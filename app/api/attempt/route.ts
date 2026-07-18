// app/api/attempt/route.ts
//
// Logs every attempt, and for skills already in skill_review_queue,
// advances or resets the Leitner box — gated on real elapsed time.
//
// - Incorrect: always reset to box 1. A wrong answer is evidence of
//   forgetting regardless of timing, so this always registers.
// - Correct, due_at has passed: genuine retrieval after the scheduled
//   gap -> advance the box.
// - Correct, due_at NOT yet passed: the student re-attempted this skill
//   before it was actually due (e.g. via normal practice rather than
//   the review flow). Still logged in `attempts`, but box/due_at are
//   left untouched -- otherwise a student could cycle box 1 -> 4
//   ("Mastered") within a single sitting, which would violate the
//   "retention over time" mastery principle.
//
// Putting a skill INTO the queue for the first time happens separately,
// in JourneyMap (seedReviewQueue), when accuracy first crosses 80% and
// no queue row exists yet.
//
// DEBUG: console.log statements trace the spaced-repetition flow in the
// server terminal. Safe to remove before a public demo.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { nextBox, nextDueDate, hasIntervalElapsed } from "@/lib/learningEngine";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { questionId, skillId, answerPicked, isCorrect, userId, sessionId, misconceptionCode } = body;

  console.log("[/api/attempt] received", { questionId, skillId, answerPicked, isCorrect, userId });

  if (!questionId || !skillId || !answerPicked || !sessionId) {
    console.log("[/api/attempt] missing required fields");
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // 1. Log the attempt (always).
  const { error: attemptError } = await supabaseAdmin.from("attempts").insert({
    question_id: questionId,
    skill_id: skillId, // denormalized for easier querying
    session_id: sessionId,
    answer_picked: String(answerPicked).toLowerCase(),
    is_correct: isCorrect,
    user_id: userId ?? null,
    misconception_code: misconceptionCode ?? null,

  });

  if (attemptError) {
    console.log("[/api/attempt] attempt insert error:", attemptError.message);
    return NextResponse.json({ error: attemptError.message }, { status: 500 });
  }

  console.log("[/api/attempt] attempt logged ok");

  if (!userId) {
    console.log("[/api/attempt] anonymous user — skipping review queue check");
    return NextResponse.json({ ok: true, review: null });
  }

  // 2. If this skill is already in the review queue, update its box/due
  //    date — subject to the elapsed-time gate described above.
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("skill_review_queue")
    .select("box, due_at")
    .eq("user_id", userId)
    .eq("skill_id", skillId)
    .single();

  if (fetchError) {
    console.log("[/api/attempt] no existing review_queue row for this skill (expected if not yet completed):", fetchError.message);
    return NextResponse.json({ ok: true, review: null });
  }

  const now = new Date();
  const due = hasIntervalElapsed(existing.due_at, now);

  if (!isCorrect) {
    const box = 1;
    const due_at = nextDueDate(box, now).toISOString();
    console.log("[/api/attempt] incorrect — resetting box:", { skillId, oldBox: existing.box, newBox: box, due_at });
    const { error: updateError } = await supabaseAdmin
      .from("skill_review_queue")
      .update({ box, due_at, updated_at: now.toISOString() })
      .eq("user_id", userId)
      .eq("skill_id", skillId);
    if (updateError) console.log("[/api/attempt] review queue update error:", updateError.message);
    else console.log("[/api/attempt] review queue reset ok");
  } else if (due) {
    const box = nextBox(existing.box, true);
    const due_at = nextDueDate(box, now).toISOString();
    console.log("[/api/attempt] correct + due — advancing box:", { skillId, oldBox: existing.box, newBox: box, due_at });
    const { error: updateError } = await supabaseAdmin
      .from("skill_review_queue")
      .update({ box, due_at, updated_at: now.toISOString() })
      .eq("user_id", userId)
      .eq("skill_id", skillId);
    if (updateError) console.log("[/api/attempt] review queue update error:", updateError.message);
    else console.log("[/api/attempt] review queue advanced ok");
  } else {
    console.log("[/api/attempt] correct but not yet due — box/due_at unchanged:", { skillId, box: existing.box, due_at: existing.due_at });
  }

  return NextResponse.json({ ok: true });
}