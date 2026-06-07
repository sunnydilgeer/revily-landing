"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

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
};

type UIQuestion = {
  id: number;
  question: string;
  options: Record<string, string>;
  correct: string;
  worked: string;
};

type Result = { q: UIQuestion; picked: string; correct: boolean };

type Profile = {
  xp: number;
  streak: number;
  last_active_date: string | null;
};

function toUIQuestion(q: Question): UIQuestion {
  return {
    id: q.id,
    question: q.question_text,
    options: {
      A: q.option_a,
      B: q.option_b,
      C: q.option_c,
      D: q.option_d,
    },
    correct: q.correct_option.toUpperCase(),
    worked: q.worked_solution,
  };
}

// ── Session ID ─────────────────────────────────────────────────────────────
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("revily_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("revily_session_id", id);
  }
  return id;
}

// ── Log attempt ────────────────────────────────────────────────────────────
async function logAttempt(
  questionId: number,
  answerPicked: string,
  isCorrect: boolean,
  userId: string | null
) {
  await supabase.from("attempts").insert({
    question_id: questionId,
    session_id: getSessionId(),
    answer_picked: answerPicked.toLowerCase(),
    is_correct: isCorrect,
    user_id: userId ?? null,
  });
}

// ── XP + Streak ────────────────────────────────────────────────────────────
async function awardXP(userId: string): Promise<number> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("xp")
    .eq("user_id", userId)
    .single();

  const newXP = (profile?.xp ?? 0) + 10;

  await supabase
    .from("profiles")
    .upsert({ user_id: userId, xp: newXP }, { onConflict: "user_id" });

  return newXP;
}

async function updateStreak(userId: string): Promise<number> {
  const today = new Date().toISOString().split("T")[0];

  const { data: profile } = await supabase
    .from("profiles")
    .select("streak, last_active_date")
    .eq("user_id", userId)
    .single();

  const last = profile?.last_active_date;
  const currentStreak = profile?.streak ?? 0;

  if (last === today) return currentStreak; // already updated today

  let newStreak = 1;
  if (last) {
    const diffDays = Math.floor(
      (new Date(today).getTime() - new Date(last).getTime()) / 86400000
    );
    if (diffDays === 1) newStreak = currentStreak + 1;
    // diffDays > 1 → reset to 1
  }

  await supabase
    .from("profiles")
    .upsert(
      { user_id: userId, streak: newStreak, last_active_date: today },
      { onConflict: "user_id" }
    );

  return newStreak;
}

// ── OptionButton ───────────────────────────────────────────────────────────
type OptionState = "idle" | "correct" | "wrong" | "highlight" | "dimmed";

function OptionButton({
  label,
  text,
  state,
  onClick,
  disabled,
}: {
  label: string;
  text: string;
  state: OptionState;
  onClick: () => void;
  disabled: boolean;
}) {
  const base =
    "flex items-center gap-3 w-full rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-150 text-sm";
  const styles: Record<OptionState, string> = {
    idle: "border-[#2e3248] bg-[#22263a] text-[#f1f0ee] hover:border-[#f9c74f] cursor-pointer",
    correct: "border-[#4ade80] bg-[#0d1f15] text-[#f1f0ee] cursor-default",
    wrong: "border-[#f87171] bg-[#1e0f0f] text-[#f1f0ee] cursor-default",
    highlight: "border-[#4ade80] bg-[#0d1f15] text-[#f1f0ee] cursor-default",
    dimmed:
      "border-[#2e3248] bg-[#22263a] text-[#555a73] cursor-default opacity-50",
  };
  const letterStyles: Record<OptionState, string> = {
    idle: "bg-[#2e3248] text-[#f1f0ee]",
    correct: "bg-[#4ade80] text-[#0d1f15]",
    wrong: "bg-[#f87171] text-[#1e0f0f]",
    highlight: "bg-[#4ade80] text-[#0d1f15]",
    dimmed: "bg-[#2e3248] text-[#555a73]",
  };
  return (
    <button
      className={`${base} ${styles[state]}`}
      onClick={onClick}
      disabled={disabled}
    >
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${letterStyles[state]}`}
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {label}
      </div>
      <span>{text}</span>
    </button>
  );
}

// ── QuestionCard ───────────────────────────────────────────────────────────
function QuestionCard({
  q,
  index,
  total,
  onAnswer,
  result,
}: {
  q: UIQuestion;
  index: number;
  total: number;
  onAnswer: (key: string) => void;
  result: string | null;
}) {
  const answered = result !== null;

  function getState(key: string): OptionState {
    if (!answered) return "idle";
    if (key === q.correct) return result === key ? "correct" : "highlight";
    if (key === result) return "wrong";
    return "dimmed";
  }

  return (
    <div>
      <div className="mb-1 text-xs uppercase tracking-widest text-[#8a8fa8]">
        Question {index + 1} of {total}
      </div>
      <div
        className="mb-7 text-xl leading-snug text-[#f1f0ee]"
        style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
      >
        {q.question}
      </div>
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
      {answered && (
        <div className="mt-5 rounded-xl border border-[#2e3248] bg-[#22263a] p-4">
          <div
            className={`mb-1.5 text-xs font-bold uppercase tracking-wider ${
              result === q.correct ? "text-[#4ade80]" : "text-[#f87171]"
            }`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {result === q.correct ? "✓ Correct!" : "✗ Not quite"}
          </div>
          <div className="text-sm leading-relaxed text-[#8a8fa8]">
            {q.worked}
          </div>
        </div>
      )}
    </div>
  );
}

// ── ScoreScreen ────────────────────────────────────────────────────────────
function ScoreScreen({
  results,
  xpEarned,
  onRestart,
}: {
  results: Result[];
  xpEarned: number;
  onRestart: () => void;
}) {
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;
  const pct = Math.round((correct / total) * 100);
  const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "⭐" : "💪";
  const msg =
    pct >= 80 ? "Smashing it!" : pct >= 60 ? "Solid effort!" : "Keep practising!";

  return (
    <div className="text-center">
      <div className="mb-2 text-5xl">{emoji}</div>
      <div
        className="text-5xl font-extrabold text-[#f9c74f]"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {correct}/{total}
      </div>
      <div className="mb-4 mt-1 text-sm text-[#8a8fa8]">
        {msg} · {pct}% correct
      </div>

      {xpEarned > 0 && (
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f9c74f33] bg-[#f9c74f15] px-4 py-1.5 text-sm font-bold text-[#f9c74f]">
          ⚡ +{xpEarned} XP earned this session
        </div>
      )}

      <div className="mb-8 flex flex-col gap-2 text-left">
        {results.map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl bg-[#22263a] px-4 py-3 text-sm"
          >
            <div
              className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                r.correct ? "bg-[#4ade80]" : "bg-[#f87171]"
              }`}
            />
            <span className="text-[#8a8fa8]">
              <strong className="text-[#f1f0ee]">Q{i + 1}:</strong>{" "}
              {r.q.question.split(":")[0]} — you picked {r.picked}
              {!r.correct && `, answer was ${r.q.correct}`}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={onRestart}
        className="w-full rounded-full bg-[#f9c74f] py-3 text-sm font-bold text-[#0f1117] transition-opacity hover:opacity-90"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Practice Again
      </button>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function Practice() {
  const [questions, setQuestions] = useState<UIQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>({
    xp: 0,
    streak: 0,
    last_active_date: null,
  });

  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  // Load session + questions + profile
  useEffect(() => {
    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const uid = session?.user?.id ?? null;
      setUserId(uid);
      setUserEmail(session?.user?.email ?? null);

      // Load profile if logged in
      if (uid) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("xp, streak, last_active_date")
          .eq("user_id", uid)
          .single();

        if (profileData) {
          setProfile(profileData);
        }
      }

      // Load questions
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .order("id");

      if (error) {
        setError("Failed to load questions. Please refresh.");
      } else {
        setQuestions((data as Question[]).map(toUIQuestion));
      }

      setLoading(false);
    }
    init();
  }, []);

  const q = questions[index];

  const filledProgress = !questions.length
    ? 0
    : done
    ? 100
    : ((index + (currentResult ? 1 : 0)) / questions.length) * 100;

  const handleAnswer = useCallback(
    async (key: string) => {
      const isCorrect = key === q.correct;
      setCurrentResult(key);
      setResults((prev) => [...prev, { q, picked: key, correct: isCorrect }]);

      if (!isCorrect) {
        setShake(true);
        setTimeout(() => setShake(false), 400);
      }

      // Fire-and-forget attempt log
      logAttempt(q.id, key, isCorrect, userId);

      // XP + streak only for correct answers by logged-in users
      if (isCorrect && userId) {
        const [newXP, newStreak] = await Promise.all([
          awardXP(userId),
          updateStreak(userId),
        ]);
        setProfile((prev) => ({ ...prev, xp: newXP, streak: newStreak }));
        setXpEarned((prev) => prev + 10);
      }
    },
    [q, userId]
  );

  function handleNext() {
    if (index + 1 >= questions.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setCurrentResult(null);
    }
  }

  function handleRestart() {
    setIndex(0);
    setResults([]);
    setCurrentResult(null);
    setDone(false);
    setXpEarned(0);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUserId(null);
    setUserEmail(null);
  }

  // ── Loading / error states ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1117]">
        <div className="text-sm text-[#8a8fa8]">Loading questions…</div>
      </div>
    );
  }

  if (error || !questions.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1117]">
        <div className="text-sm text-[#f87171]">
          {error ?? "No questions found."}
        </div>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-[#0f1117] px-4 py-10 ${
        shake ? "shake" : ""
      }`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-[#2e3248] bg-[#1a1d27] p-8">

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-[#2e3248] bg-[#22263a] px-4 py-1.5 text-xs uppercase tracking-widest text-[#8a8fa8]">
            <span className="h-2 w-2 rounded-full bg-[#f9c74f]" />
            Skill 11 · Solving Equations
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-[#2e3248] bg-[#22263a] px-3 py-1 text-xs text-[#f9c74f] font-semibold">
              ⚡ {profile.xp} XP
            </span>
            <span
              className="text-sm font-bold text-[#f9c74f]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              🔥 {profile.streak}
            </span>
            {userEmail && (
              <button
                onClick={handleSignOut}
                className="rounded-full border border-[#2e3248] bg-[#22263a] px-3 py-1 text-xs text-[#8a8fa8] hover:text-[#f87171] transition-colors"
              >
                Sign out
              </button>
            )}
          </div>
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
          <ScoreScreen
            results={results}
            xpEarned={xpEarned}
            onRestart={handleRestart}
          />
        ) : (
          <div key={index} className="pop">
            <QuestionCard
              q={q}
              index={index}
              total={questions.length}
              onAnswer={handleAnswer}
              result={currentResult}
            />
            {currentResult && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleNext}
                  className="rounded-full bg-[#f9c74f] px-7 py-2.5 text-sm font-bold text-[#0f1117] transition-opacity hover:opacity-90"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {index === questions.length - 1
                    ? "See Results"
                    : "Next Question"}{" "}
                  →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}