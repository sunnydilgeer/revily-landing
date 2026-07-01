// app/api/grade-response/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role — server only, never exposed to client
);

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;

// ── Rate limiting ────────────────────────────────────────────────────────
// Simple sliding window: max 20 grading calls per 5 minutes per session.
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;

async function checkRateLimit(sessionId: string): Promise<boolean> {
  const now = new Date();
  const { data } = await supabase
    .from("grading_rate_limit")
    .select("call_count, window_start")
    .eq("session_id", sessionId)
    .single();

  if (!data) {
    await supabase.from("grading_rate_limit").insert({
      session_id: sessionId,
      call_count: 1,
      window_start: now.toISOString(),
    });
    return true;
  }

  const windowAge = now.getTime() - new Date(data.window_start).getTime();

  if (windowAge > RATE_LIMIT_WINDOW_MS) {
    await supabase
      .from("grading_rate_limit")
      .update({ call_count: 1, window_start: now.toISOString() })
      .eq("session_id", sessionId);
    return true;
  }

  if (data.call_count >= RATE_LIMIT_MAX) {
    return false;
  }

  await supabase
    .from("grading_rate_limit")
    .update({ call_count: data.call_count + 1 })
    .eq("session_id", sessionId);
  return true;
}

// ── Types ──────────────────────────────────────────────────────────────────
type GradeResult = {
  correct: boolean;
  misconception_code: string | null;
  feedback: string;
};

const FALLBACK_RESULT: GradeResult = {
  correct: false,
  misconception_code: null,
  feedback: "We couldn't grade that — try rephrasing your answer and submit again.",
};

// ── Route handler ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { questionId, studentAnswer, userId, sessionId, skillId } = body;

    if (!questionId || typeof studentAnswer !== "string" || !sessionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ── Rate limit check ──────────────────────────────────────────────
    const allowed = await checkRateLimit(sessionId);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait a few minutes and try again." },
        { status: 429 }
      );
    }

    // ── Fetch correct answer + question text SERVER-SIDE ONLY ──────────
    // The client never sees correct_answer — only questionId is sent to us.
    const { data: question, error: qErr } = await supabase
      .from("questions")
      .select("question_text, correct_answer, answer_type")
      .eq("id", questionId)
      .single();

    if (qErr || !question || question.answer_type !== "free_response" || !question.correct_answer) {
      return NextResponse.json({ error: "Question not found or not free response" }, { status: 404 });
    }

    // ── Fetch misconceptions server-side too ─────────────────────────────
    const { data: misconceptions } = await supabase
      .from("misconceptions")
      .select("code, title, description")
      .eq("question_id", questionId);

    const misconceptionList = (misconceptions ?? [])
      .map(m => `- ${m.code}: ${m.title} — ${m.description}`)
      .join("\n");

    // ── Build grading prompt ────────────────────────────────────────────
    const prompt = `You are a GCSE Foundation maths examiner. Grade the student's answer strictly but fairly.

Question: ${question.question_text}
Expected answer: ${question.correct_answer}
Student answered: ${studentAnswer}

Known misconceptions for this question:
${misconceptionList || "(none recorded)"}

EQUIVALENCE RULES — treat these as the SAME correct answer:
- Fractions, decimals, percentages: 3/4 = 0.75 = 75% = 75 % (ignore trailing/leading spaces)
- Ratios: 3:2 = 3 to 2 = "3 : 2" (ignore spacing around colon)
- Currency: £7.38 = 7.38 = 738p (ignore currency symbols, accept pence-to-pounds conversion)
- Negative numbers: -5 = −5 = (5) in brackets (treat en-dash, hyphen, and bracket notation as equivalent)
- Units: "7.38 ml" = "7.38" if the question already states the unit (don't penalise omitted units unless the question explicitly asks to "give units")
- Whitespace and capitalisation differences are never a reason to mark wrong

Respond ONLY with a JSON object, no other text, no markdown fences:
{"correct": true or false, "misconception_code": "<matching code from the list above, or null>", "feedback": "<one short, encouraging sentence explaining why correct or what went wrong, written for a 14-16 year old>"}

Rules:
- Do NOT accept incomplete or partially correct answers as fully correct
- If the student's answer doesn't match any known misconception but is still wrong, set misconception_code to null
- Keep feedback to one sentence`;

    // ── Call Claude (Haiku — fast, cheap, sufficient for grading) ────────
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      console.error("Claude API error:", await response.text());
      return NextResponse.json(FALLBACK_RESULT);
    }

    const data = await response.json();
    const rawText = data.content
      ?.filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("") ?? "";

    // ── JSON parse with fallback ──────────────────────────────────────────
    let graded: GradeResult;
    try {
      const cleaned = rawText.replace(/```json|```/gi, "").trim();
      const parsed = JSON.parse(cleaned);
      if (typeof parsed.correct !== "boolean" || typeof parsed.feedback !== "string") {
        throw new Error("Malformed grading response shape");
      }
      graded = {
        correct: parsed.correct,
        misconception_code: parsed.misconception_code ?? null,
        feedback: parsed.feedback,
      };
    } catch (parseErr) {
      console.error("Grading JSON parse failed. Raw text was:", rawText);
      console.error("Parse error:", parseErr);
      graded = FALLBACK_RESULT;
    }

    // ── Log attempt ──────────────────────────────────────────────────────
    await supabase.from("attempts").insert({
      question_id: questionId,
      skill_id: skillId,
      session_id: sessionId,
      answer_picked: studentAnswer,
      is_correct: graded.correct,
      user_id: userId,
    });

    // ── Award XP / streak if correct and logged in ───────────────────────
    if (graded.correct && userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("xp, streak, last_active_date")
        .eq("user_id", userId)
        .single();

      const newXP = (profile?.xp ?? 0) + 10;
      const today = new Date().toISOString().split("T")[0];
      const last = profile?.last_active_date;
      const current = profile?.streak ?? 0;
      let newStreak = current;
      if (last !== today) {
        const diff = last
          ? Math.floor((new Date(today).getTime() - new Date(last).getTime()) / 86400000)
          : 0;
        newStreak = diff === 1 ? current + 1 : 1;
      }

      await supabase.from("profiles").upsert(
        { user_id: userId, xp: newXP, streak: newStreak, last_active_date: today },
        { onConflict: "user_id" }
      );
    }

    return NextResponse.json(graded);
  } catch (err) {
    console.error("Unexpected error in /api/grade-response:", err);
    return NextResponse.json(FALLBACK_RESULT, { status: 200 });
  }
}