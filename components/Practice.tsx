"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MathText from "@/components/MathText";

// ── Types ──────────────────────────────────────────────────────────────────
type Question = {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  worked_solution: string;
  difficulty: string;
  skill_id: number;
};

type UIQuestion = {
  id: number;
  question: string;
  options: Record<string, string>;
  correct: string;
  worked: string;
};

type Hint = {
  question_id: number;
  hint_text: string;
  order_index: number;
};

type Misconception = {
  question_id: number;
  wrong_option: string;
  title: string;
  description: string;
};

type Result = { q: UIQuestion; picked: string; correct: boolean };

function toUIQuestion(q: Question): UIQuestion {
  return {
    id: q.id,
    question: q.question_text,
    options: { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d },
    correct: q.correct_option.toUpperCase(),
    worked: q.worked_solution,
  };
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("revily_session_id");
  if (!id) { id = crypto.randomUUID(); localStorage.setItem("revily_session_id", id); }
  return id;
}

// ── Supabase helpers ───────────────────────────────────────────────────────
async function logAttempt(questionId: number, answerPicked: string, isCorrect: boolean, userId: string | null) {
  await supabase.from("attempts").insert({
    question_id: questionId,
    session_id: getSessionId(),
    answer_picked: answerPicked.toLowerCase(),
    is_correct: isCorrect,
    user_id: userId ?? null,
  });
}

async function awardXP(userId: string): Promise<number> {
  const { data } = await supabase.from("profiles").select("xp").eq("user_id", userId).single();
  const newXP = (data?.xp ?? 0) + 10;
  await supabase.from("profiles").upsert({ user_id: userId, xp: newXP }, { onConflict: "user_id" });
  return newXP;
}

async function updateStreak(userId: string): Promise<number> {
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase.from("profiles").select("streak, last_active_date").eq("user_id", userId).single();
  const last = data?.last_active_date;
  const current = data?.streak ?? 0;
  if (last === today) return current;
  const diff = last ? Math.floor((new Date(today).getTime() - new Date(last).getTime()) / 86400000) : 0;
  const newStreak = diff === 1 ? current + 1 : 1;
  await supabase.from("profiles").upsert({ user_id: userId, streak: newStreak, last_active_date: today }, { onConflict: "user_id" });
  return newStreak;
}

// ── OptionButton ───────────────────────────────────────────────────────────
type OptionState = "idle" | "correct" | "wrong" | "highlight" | "dimmed";

function OptionButton({ label, text, state, onClick, disabled }: {
  label: string; text: string; state: OptionState; onClick: () => void; disabled: boolean;
}) {
  const base = "flex items-center gap-3 w-full rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-150 text-sm";
  const styles: Record<OptionState, string> = {
    idle:      "border-[#2e3248] bg-[#22263a] text-[#f1f0ee] hover:border-[#f9c74f] cursor-pointer",
    correct:   "border-[#4ade80] bg-[#0d1f15] text-[#f1f0ee] cursor-default",
    wrong:     "border-[#f87171] bg-[#1e0f0f] text-[#f1f0ee] cursor-default",
    highlight: "border-[#4ade80] bg-[#0d1f15] text-[#f1f0ee] cursor-default",
    dimmed:    "border-[#2e3248] bg-[#22263a] text-[#555a73] cursor-default opacity-50",
  };
  const letterStyles: Record<OptionState, string> = {
    idle:      "bg-[#2e3248] text-[#f1f0ee]",
    correct:   "bg-[#4ade80] text-[#0d1f15]",
    wrong:     "bg-[#f87171] text-[#1e0f0f]",
    highlight: "bg-[#4ade80] text-[#0d1f15]",
    dimmed:    "bg-[#2e3248] text-[#555a73]",
  };
  const keyHints: Record<string, string> = { A: "1", B: "2", C: "3", D: "4" };
  const hint = keyHints[label];

  return (
    <button className={`${base} ${styles[state]}`} onClick={onClick} disabled={disabled}>
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${letterStyles[state]}`}
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        {label}
      </div>
      <span className="flex-1"><MathText text={text} /></span>
      {state === "idle" && hint && (
        <span className="ml-auto rounded-md border border-[#3a3f58] bg-[#2e3248] px-1.5 py-0.5 text-[10px] font-mono text-[#555a73]">
          {hint}
        </span>
      )}
    </button>
  );
}

// ── HintButton ─────────────────────────────────────────────────────────────
function HintButton({ hints, answered }: { hints: Hint[]; answered: boolean }) {
  const [revealed, setRevealed] = useState(0);

  // Reset when question changes
  useEffect(() => { setRevealed(0); }, [hints]);

  if (!hints.length || answered) return null;

  return (
    <div className="flex flex-col items-end gap-2">
      {/* Revealed hints */}
      {hints.slice(0, revealed).map((h, i) => (
        <div
          key={i}
          className="w-full rounded-xl border border-[#f9c74f33] bg-[#f9c74f0d] px-4 py-3 text-sm text-[#f9c74f]"
        >
          <span className="mr-2 font-bold">💡</span>
          <MathText text={h.hint_text} />
        </div>
      ))}

      {/* Show hint button — advances through hints */}
      {revealed < hints.length && (
        <button
          onClick={() => setRevealed((r) => r + 1)}
          className="flex items-center gap-1.5 rounded-full border border-[#f9c74f44] bg-transparent px-3 py-1.5 text-xs text-[#f9c74f] transition-opacity hover:opacity-80"
        >
          💡 {revealed === 0 ? "Show hint" : "Another hint"}
        </button>
      )}
    </div>
  );
}

// ── MisconceptionPanel ─────────────────────────────────────────────────────
function MisconceptionPanel({ misconception }: { misconception: Misconception | null }) {
  if (!misconception) return null;
  return (
    <div className="mt-3 rounded-xl border border-[#f8717133] bg-[#f871710d] px-4 py-3">
      <div
        className="mb-1 text-xs font-bold uppercase tracking-wider text-[#f87171]"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        ⚠ Common mistake: {misconception.title}
      </div>
      <div className="text-sm leading-relaxed text-[#c88]">
        {misconception.description}
      </div>
    </div>
  );
}

// ── QuestionCard ───────────────────────────────────────────────────────────
function QuestionCard({ q, index, total, onAnswer, result, hints, misconceptions }: {
  q: UIQuestion;
  index: number;
  total: number;
  onAnswer: (key: string) => void;
  result: string | null;
  hints: Hint[];
  misconceptions: Misconception[];
}) {
  const answered = result !== null;

  function getState(key: string): OptionState {
    if (!answered) return "idle";
    if (key === q.correct) return result === key ? "correct" : "highlight";
    if (key === result) return "wrong";
    return "dimmed";
  }

  // Find misconception for the picked wrong answer
  const activeMisconception = answered && result !== q.correct
    ? misconceptions.find(
        (m) =>
          m.question_id === q.id &&
        m.wrong_option?.toUpperCase() === result?.toUpperCase()      ) ?? null
    : null;

  return (
    <div>
      {/* Question counter + hint button row */}
      <div className="mb-1 flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-[#8a8fa8]">
          Question {index + 1} of {total}
        </div>
      </div>

      {/* Question text */}
      <div
        className="mb-5 text-xl leading-snug text-[#f1f0ee]"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 }}
      >
        <MathText text={q.question} />
      </div>

      {/* Hint button — above options so it's easy to find */}
      <div className="mb-4">
        <HintButton
          hints={hints.filter((h) => h.question_id === q.id).sort((a, b) => a.order_index - b.order_index)}
          answered={answered}
        />
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {Object.entries(q.options).map(([k, v]) => (
          <OptionButton
            key={k}
            label={k}
            text={v}
            state={getState(k)}
            onClick={() => onAnswer(k)}
            disabled={answered}
          />
        ))}
      </div>

      {/* Post-answer feedback */}
      {answered && (
        <>
          {/* Misconception panel — only when wrong answer has a mapped misconception */}
          <MisconceptionPanel misconception={activeMisconception} />

          {/* Worked solution */}
          <div className="mt-3 rounded-xl border border-[#2e3248] bg-[#22263a] p-4">
            <div
              className={`mb-1.5 text-xs font-bold uppercase tracking-wider ${result === q.correct ? "text-[#4ade80]" : "text-[#f87171]"}`}
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              {result === q.correct ? "✓ Correct!" : "✗ Not quite"}
            </div>
            <div className="text-sm leading-relaxed text-[#8a8fa8]">
              <MathText text={q.worked} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── ScoreScreen ────────────────────────────────────────────────────────────
function ScoreScreen({ results, xpEarned, onHome }: {
  results: Result[]; xpEarned: number; onHome: () => void;
}) {
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;
  const pct = Math.round((correct / total) * 100);
  const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "⭐" : "💪";
  const msg = pct >= 80 ? "Smashing it!" : pct >= 60 ? "Solid effort!" : "Keep practising!";

  return (
    <div className="text-center">
      <div className="mb-2 text-5xl">{emoji}</div>
      <div
        className="text-5xl font-extrabold text-[#f9c74f]"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        {correct}/{total}
      </div>
      <div className="mb-4 mt-1 text-sm text-[#8a8fa8]">{msg} · {pct}% correct</div>
      {xpEarned > 0 && (
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f9c74f33] bg-[#f9c74f15] px-4 py-1.5 text-sm font-bold text-[#f9c74f]">
          ⚡ +{xpEarned} XP earned this session
        </div>
      )}
      <div className="mb-8 flex flex-col gap-2 text-left">
        {results.map((r, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl bg-[#22263a] px-4 py-3 text-sm">
            <div className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${r.correct ? "bg-[#4ade80]" : "bg-[#f87171]"}`} />
            <span className="text-[#8a8fa8]">
              <strong className="text-[#f1f0ee]">Q{i + 1}:</strong>{" "}
              {r.q.question.replace(/\$+[^$]*\$+/g, "…").split(":")[0]} — you picked {r.picked}
              {!r.correct && `, answer was ${r.q.correct}`}
            </span>
          </div>
        ))}
      </div>
      <button
        onClick={onHome}
        className="w-full rounded-full bg-[#f9c74f] py-3 text-sm font-bold text-[#0f1117] transition-opacity hover:opacity-90"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        Back to Home
      </button>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function Practice() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skillId = searchParams.get("skill");

  const [questions, setQuestions] = useState<UIQuestion[]>([]);
  const [skillName, setSkillName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Hints + misconceptions indexed by question id
  const [hints, setHints] = useState<Hint[]>([]);
  const [misconceptions, setMisconceptions] = useState<Misconception[]>([]);

  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);

      if (skillId) {
        const { data: skill } = await supabase
          .from("skills").select("name").eq("id", skillId).single();
        if (skill) setSkillName(skill.name);
      }

      // Fetch questions
      let query = supabase.from("questions").select("*").order("id");
      if (skillId) query = query.eq("skill_id", skillId);
      const { data: qData, error: qErr } = await query;

      if (qErr || !qData) {
        setError("Failed to load questions. Please refresh.");
        setLoading(false);
        return;
      }

      const uiQuestions = (qData as Question[]).map(toUIQuestion);
      setQuestions(uiQuestions);

      // Fetch hints and misconceptions for these question ids
      const qIds = qData.map((q: Question) => q.id);

      const [{ data: hData }, { data: mData }] = await Promise.all([
        supabase
          .from("hints")
          .select("question_id, hint_text, order_index")
          .in("question_id", qIds),
        supabase
          .from("misconceptions")
          .select("question_id, wrong_option, title, description")
          .in("question_id", qIds),
      ]);

      setHints((hData as Hint[]) ?? []);
      setMisconceptions((mData as Misconception[]) ?? []);
      setLoading(false);
    }
    init();
  }, [skillId]);

  const q = questions[index];
  const filledProgress = !questions.length ? 0
    : done ? 100
    : ((index + (currentResult ? 1 : 0)) / questions.length) * 100;

  const handleAnswer = useCallback(async (key: string) => {
    const isCorrect = key === q.correct;
    setCurrentResult(key);
    setResults((prev) => [...prev, { q, picked: key, correct: isCorrect }]);
    if (!isCorrect) { setShake(true); setTimeout(() => setShake(false), 400); }
    logAttempt(q.id, key, isCorrect, userId);
    if (isCorrect && userId) {
      await Promise.all([awardXP(userId), updateStreak(userId)]);
      setXpEarned((prev) => prev + 10);
      window.dispatchEvent(new Event("revily:xp-updated"));
    }
  }, [q, userId]);

  function handleNext() {
    if (index + 1 >= questions.length) { setDone(true); }
    else { setIndex((i) => i + 1); setCurrentResult(null); }
  }

  function handleHome() { router.push("/home"); }

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const keyMap: Record<string, string> = {
        a: "A", b: "B", c: "C", d: "D",
        "1": "A", "2": "B", "3": "C", "4": "D",
      };
      const mapped = keyMap[e.key.toLowerCase()];
      if (mapped && !currentResult && q) { handleAnswer(mapped); return; }
      if ((e.key === "Enter" || e.key === " ") && currentResult) {
        e.preventDefault();
        handleNext();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentResult, q, handleAnswer]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1117]">
      <div className="text-sm text-[#8a8fa8]">Loading questions…</div>
    </div>
  );

  if (error || !questions.length) return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1117]">
      <div className="text-center">
        <div className="mb-3 text-sm text-[#f87171]">{error ?? "No questions found for this skill."}</div>
        <button onClick={handleHome}
          className="rounded-full border border-[#2e3248] px-4 py-2 text-xs text-[#8a8fa8] hover:text-[#f1f0ee] transition-colors">
          ← Back to home
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-[#0f1117] px-4 py-10 ${shake ? "shake" : ""}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-[#2e3248] bg-[#1a1d27] p-8">

        {/* Skill label + back */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-[#2e3248] bg-[#22263a] px-4 py-1.5 text-xs uppercase tracking-widest text-[#8a8fa8]">
            <span className="h-2 w-2 rounded-full bg-[#f9c74f]" />
            {skillName || "Practice"}
          </div>
          <button
            onClick={handleHome}
            className="rounded-full border border-[#2e3248] bg-[#22263a] px-3 py-1.5 text-xs text-[#8a8fa8] hover:text-[#f1f0ee] transition-colors"
          >
            ← Home
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-[#22263a]">
          <div
            className="h-full rounded-full bg-[#f9c74f] transition-all duration-500"
            style={{ width: `${filledProgress}%` }}
          />
        </div>

        {/* Content */}
        {done ? (
          <ScoreScreen results={results} xpEarned={xpEarned} onHome={handleHome} />
        ) : (
          <div key={index} className="pop">
            <QuestionCard
              q={q}
              index={index}
              total={questions.length}
              onAnswer={handleAnswer}
              result={currentResult}
              hints={hints}
              misconceptions={misconceptions}
            />
            {currentResult && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleNext}
                  className="rounded-full bg-[#f9c74f] px-7 py-2.5 text-sm font-bold text-[#0f1117] transition-opacity hover:opacity-90"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  {index === questions.length - 1 ? "See Results" : "Next Question"} →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}