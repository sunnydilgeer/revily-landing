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
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("revily_session_id", id);
  }
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

// ── Enhanced Global Audio/Animation Styles ──────────────────────────────────
const ADVANCED_STYLE_ID = "revily-advanced-mobile-styles";
function ensureAdvancedStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(ADVANCED_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = ADVANCED_STYLE_ID;
  style.textContent = `
    @keyframes revilyXPFloat {
      0%   { opacity: 0; transform: translateY(0) scale(0.8); }
      20%  { opacity: 1; transform: translateY(-8px) scale(1.2); }
      60%  { opacity: 1; transform: translateY(-28px) scale(1); }
      100% { opacity: 0; transform: translateY(-48px) scale(0.9); }
    }
    .revily-xp-float {
      position: fixed;
      pointer-events: none;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 16px;
      font-weight: 800;
      color: #f9c74f;
      white-space: nowrap;
      z-index: 9999;
      animation: revilyXPFloat 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    @keyframes subtlePop {
      0% { transform: scale(0.98); }
      50% { transform: scale(1.02); }
      100% { transform: scale(1); }
    }
    .animate-pop { animation: subtlePop 0.25s ease-out; }
  `;
  document.head.appendChild(style);
}

function fireXPFloat() {
  ensureAdvancedStyles();
  const badge = document.querySelector<HTMLElement>("[data-revily-xp-badge]");
  const el = document.createElement("div");
  el.className = "revily-xp-float";
  el.textContent = "⚡ +10 XP";
  if (badge) {
    const rect = badge.getBoundingClientRect();
    el.style.left = rect.left + rect.width / 2 + "px";
    el.style.top = rect.top + "px";
  } else {
    el.style.right = "1.5rem";
    el.style.top = "3.5rem";
  }
  document.body.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

// ── Trigger Native Vibration for Haptic Feedback ───────────────────────────
function triggerHaptic(type: "correct" | "error") {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    if (type === "correct") {
      navigator.vibrate(40); // One quick crisp tap
    } else {
      navigator.vibrate([60, 50, 60]); // Double rejection tap
    }
  }
}

// ── OptionButton ───────────────────────────────────────────────────────────
type OptionState = "idle" | "correct" | "wrong" | "highlight" | "dimmed";

function OptionButton({ label, text, state, onClick, disabled }: {
  label: string; text: string; state: OptionState; onClick: () => void; disabled: boolean;
}) {
  const base = "flex items-center gap-4 w-full rounded-2xl border-2 px-5 py-4 text-left transition-all duration-150 active:scale-[0.99] select-none min-h-[64px]";
  const styles: Record<OptionState, string> = {
    idle:      "border-[#2e3248] bg-[#22263a] text-[#f1f0ee] hover:border-[#f9c74f] cursor-pointer",
    correct:   "border-[#4ade80] bg-[#0d1f15] text-[#f1f0ee] cursor-default",
    wrong:     "border-[#f87171] bg-[#1e0f0f] text-[#f1f0ee] cursor-default",
    highlight: "border-[#4ade80] bg-[#0d1f15] text-[#f1f0ee] cursor-default",
    dimmed:    "border-[#2e3248] bg-[#22263a] text-[#555a73] cursor-default opacity-40",
  };
  const letterStyles: Record<OptionState, string> = {
    idle:      "bg-[#2e3248] text-[#f1f0ee]",
    correct:   "bg-[#4ade80] text-[#0d1f15]",
    wrong:     "bg-[#f87171] text-[#1e0f0f]",
    highlight: "bg-[#4ade80] text-[#0d1f15]",
    dimmed:    "bg-[#2e3248] text-[#555a73]",
  };

  return (
    <button className={`${base} ${styles[state]}`} onClick={onClick} disabled={disabled}>
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-base font-black ${letterStyles[state]}`}
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        {label}
      </div>
      {/* Bumped font size and improved spacing for readable math rendering */}
      <span className="flex-1 text-xl font-bold leading-snug text-[#f1f0ee]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
        <MathText text={text} />
      </span>
    </button>
  );
}

// ── HintButton ─────────────────────────────────────────────────────────────
function HintButton({ hints, answered }: { hints: Hint[]; answered: boolean }) {
  const [revealed, setRevealed] = useState(0);
  useEffect(() => { setRevealed(0); }, [hints]);
  if (!hints.length || answered) return null;
  return (
    <div className="flex flex-col items-stretch gap-2 w-full transition-all duration-300">
      {hints.slice(0, revealed).map((h, i) => (
        <div key={i} className="w-full rounded-2xl border border-[#f9c74f33] bg-[#f9c74f0d] px-4 py-3.5 text-base text-[#f9c74f] animate-pop">
          <span className="mr-2 font-bold">💡</span>
          <MathText text={h.hint_text} />
        </div>
      ))}
      {revealed < hints.length && (
        <button
          onClick={() => setRevealed((r) => r + 1)}
          className="self-start flex items-center gap-1.5 rounded-full border-2 border-[#f9c74f33] bg-[#1a1d27] px-4 py-2 text-sm font-bold text-[#f9c74f] transition-opacity active:scale-95"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          💡 {revealed === 0 ? "Get a Hint" : "Next Hint"}
        </button>
      )}
    </div>
  );
}

// ── WorkedExampleButton ────────────────────────────────────────────────────
function WorkedExampleButton({ workedSolution, answered }: { workedSolution: string; answered: boolean }) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { setRevealed(false); }, [workedSolution]);
  if (answered || !workedSolution) return null;
  return (
    <div className="flex flex-col items-stretch gap-2 w-full transition-all duration-300">
      {revealed && (
        <div className="w-full rounded-2xl border border-[#818cf833] bg-[#818cf80d] px-4 py-3.5 text-base text-[#a5b4fc] animate-pop">
          <div
            className="mb-2 text-xs font-bold uppercase tracking-wider text-[#818cf8]"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            📖 Worked example
          </div>
          <MathText text={workedSolution} />
        </div>
      )}
      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          className="self-start flex items-center gap-1.5 rounded-full border-2 border-[#818cf833] bg-[#1a1d27] px-4 py-2 text-sm font-bold text-[#818cf8] transition-opacity active:scale-95"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          📖 See Dynamic Example
        </button>
      )}
    </div>
  );
}

// ── MisconceptionPanel ─────────────────────────────────────────────────────
function MisconceptionPanel({ misconception }: { misconception: Misconception | null }) {
  if (!misconception) return null;
  return (
    <div className="mt-3 rounded-2xl border border-[#f8717144] bg-[#f871710f] p-4 animate-pop">
      <div
        className="mb-1 text-sm font-black uppercase tracking-wide text-[#f87171] flex items-center gap-1.5"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        <span>⚠️</span> Common Trap: {misconception.title}
      </div>
      <div className="text-base leading-relaxed text-[#e2b3b3]">
        {misconception.description}
      </div>
    </div>
  );
}

// ── ProgressDots ───────────────────────────────────────────────────────────
function ProgressDots({ results, total, currentIndex }: { results: Result[]; total: number; currentIndex: number }) {
  return (
    <div className="flex gap-2 items-center w-full py-1">
      {Array.from({ length: total }).map((_, i) => {
        const result = results[i];
        const isCurrent = i === currentIndex && !result;
        let bg = "bg-[#22263a]"; 
        if (result?.correct) bg = "bg-[#4ade80]";
        else if (result && !result.correct) bg = "bg-[#f87171]";
        else if (isCurrent) bg = "bg-[#f9c74f]";
        return (
          <div
            key={i}
            className={`h-2.5 flex-1 rounded-full transition-all duration-300 ${bg}`}
            style={{
              transform: isCurrent ? "scaleY(1.3)" : "scaleY(1)",
            }}
          />
        );
      })}
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

  const activeMisconception = answered && result !== q.correct
    ? misconceptions.find(
        (m) => m.question_id === q.id && m.wrong_option?.toUpperCase() === result?.toUpperCase()
      ) ?? null
    : null;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs font-bold uppercase tracking-widest text-[#8a8fa8]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
          Question {index + 1} of {total}
        </div>
      </div>

      {/* Enlarged math display to reduce working memory strain */}
      <div
        className="mb-6 text-3xl leading-snug text-[#f1f0ee] tracking-tight"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}
      >
        <MathText text={q.question} />
      </div>

      {/* Lifelines Accordion Area */}
      <div className="mb-6 flex flex-col gap-3">
        <HintButton
          hints={hints.filter((h) => h.question_id === q.id).sort((a, b) => a.order_index - b.order_index)}
          answered={answered}
        />
        <WorkedExampleButton workedSolution={q.worked} answered={answered} />
      </div>

      {/* Action Options */}
      <div className="flex flex-col gap-3.5">
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

      {/* Feedback Card */}
      {answered && (
        <div className="space-y-3">
          <MisconceptionPanel misconception={activeMisconception} />
          <div className="mt-4 rounded-2xl border border-[#2e3248] bg-[#22263a] p-5 animate-pop">
            <div
              className={`mb-2 text-sm font-black uppercase tracking-wider ${result === q.correct ? "text-[#4ade80]" : "text-[#f87171]"}`}
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              {result === q.correct ? "🎉 Brilliantly Done!" : "🧠 Amazing Attempt! Let's Learn:"}
            </div>
            <div className="text-base leading-relaxed text-[#aeb3d0]">
              <MathText text={q.worked} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ScoreScreen ────────────────────────────────────────────────────────────
function ScoreScreen({ results, xpEarned, onHome }: { results: Result[]; xpEarned: number; onHome: () => void }) {
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;
  const pct = Math.round((correct / total) * 100);
  const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "⭐" : "💪";
  const msg = pct >= 80 ? "Unstoppable Form!" : pct >= 60 ? "Fantastic Progress!" : "Epic Effort! Try Again!";

  return (
    <div className="text-center animate-pop">
      <div className="mb-2 text-6xl drop-shadow-md">{emoji}</div>
      <div
        className="text-6xl font-black text-[#f9c74f]"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        {correct}/{total}
      </div>
      <div className="mb-5 mt-1 text-base font-bold text-[#8a8fa8]">{msg} · {pct}% Score</div>
      
      {xpEarned > 0 && (
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f9c74f44] bg-[#f9c74f1a] px-5 py-2 text-base font-black text-[#f9c74f] animate-bounce">
          ⚡ +{xpEarned} TOTAL XP EARNED
        </div>
      )}

      <div className="mb-6 flex gap-2">
        {results.map((r, i) => (
          <div
            key={i}
            className={`h-3 flex-1 rounded-full ${r.correct ? "bg-[#4ade80]" : "bg-[#f87171]"}`}
          />
        ))}
      </div>

      <div className="mb-8 flex flex-col gap-2 text-left max-h-[220px] overflow-y-auto pr-1">
        {results.map((r, i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl bg-[#22263a] px-4 py-3.5 text-sm">
            <div className={`h-3 w-3 flex-shrink-0 rounded-full ${r.correct ? "bg-[#4ade80]" : "bg-[#f87171]"}`} />
            <span className="text-[#8a8fa8] truncate">
              <strong className="text-[#f1f0ee]">Q{i + 1}:</strong>{" "}
              {r.q.question.replace(/\$+[^$]*\$+/g, "…").split(":")[0]}
            </span>
          </div>
        ))}
      </div>
      <button
        onClick={onHome}
        className="w-full rounded-2xl bg-[#f9c74f] py-4 text-base font-black text-[#0f1117] transition-all active:scale-[0.98]"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        Return to Dashboard
      </button>
    </div>
  );
}

// ── Main Responsive/Mobile-First component ─────────────────────────────────
export default function Practice() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skillId = searchParams.get("skill");

  const [questions, setQuestions] = useState<UIQuestion[]>([]);
  const [skillName, setSkillName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [streak, setStreak] = useState<number>(0);

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
      ensureAdvancedStyles();
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);

      if (session?.user?.id) {
        const { data: profile } = await supabase.from("profiles").select("streak").eq("user_id", session.user.id).single();
        if (profile) setStreak(profile.streak ?? 0);
      }

      if (skillId) {
        const { data: skill } = await supabase.from("skills").select("name").eq("id", skillId).single();
        if (skill) setSkillName(skill.name);
      }

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

      const qIds = qData.map((q: Question) => q.id);
      const [{ data: hData }, { data: mData }] = await Promise.all([
        supabase.from("hints").select("question_id, hint_text, order_index").in("question_id", qIds),
        supabase.from("misconceptions").select("question_id, wrong_option, title, description").in("question_id", qIds),
      ]);

      setHints((hData as Hint[]) ?? []);
      setMisconceptions((mData as Misconception[]) ?? []);
      setLoading(false);
    }
    init();
  }, [skillId]);

  const q = questions[index];

  const handleAnswer = useCallback(async (key: string) => {
    const isCorrect = key === q.correct;
    setCurrentResult(key);
    setResults((prev) => [...prev, { q, picked: key, correct: isCorrect }]);
    
    // Tactile Feedback & Alerts
    if (!isCorrect) {
      triggerHaptic("error");
      setShake(true);
      setTimeout(() => setShake(false), 400);
    } else {
      triggerHaptic("correct");
    }

    logAttempt(q.id, key, isCorrect, userId);

    if (isCorrect && userId) {
      const [_, newStreak] = await Promise.all([awardXP(userId), updateStreak(userId)]);
      setStreak(newStreak);
      setXpEarned((prev) => prev + 10);
      fireXPFloat();
      window.dispatchEvent(new Event("revily:xp-updated"));
    }
  }, [q, userId]);

  function handleNext() {
    if (index + 1 >= questions.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setCurrentResult(null);
    }
    // Scroll mobile screen context back smoothly to the top for the new card
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleHome() { router.push("/home"); }

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
      <div className="text-base font-bold text-[#8a8fa8]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
        Loading bite-sized modules…
      </div>
    </div>
  );

  if (error || !questions.length) return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1117] px-4">
      <div className="text-center">
        <div className="mb-4 text-base text-[#f87171] font-bold">{error ?? "No tasks found here yet!"}</div>
        <button onClick={handleHome}
          className="rounded-full border-2 border-[#2e3248] px-5 py-2 text-sm text-[#8a8fa8] font-bold hover:text-[#f1f0ee] transition-colors">
          ← Return Home
        </button>
      </div>
    </div>
  );

  return (
    /* The padding-bottom pb-32 accounts for the bottom sticky action sheet on mobile viewports */
    <div
      className={`flex min-h-screen items-start justify-center bg-[#0f1117] px-4 pt-6 pb-32 ${shake ? "shake" : ""}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="w-full max-w-md bg-[#0f1117]">

        {/* Gamified Header Tracker */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border-2 border-[#2e3248] bg-[#1a1d27] px-4 py-1.5 text-xs uppercase font-black tracking-wider text-[#8a8fa8]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            <span className="h-2 w-2 rounded-full bg-[#f9c74f]" />
            {skillName || "Practice"}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Direct streak burning value display */}
            {streak > 0 && (
              <div className="flex items-center gap-1 text-sm font-black text-[#f9c74f]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                🔥 {streak}
              </div>
            )}
            <button
              onClick={handleHome}
              className="rounded-full border-2 border-[#2e3248] bg-[#1a1d27] px-4 py-1.5 text-xs font-bold text-[#8a8fa8] hover:text-[#f1f0ee] transition-colors"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              ← Leave
            </button>
          </div>
        </div>

        {/* Dynamic Tactile Progress Metric */}
        <div className="mb-6">
          <ProgressDots
            results={results}
            total={questions.length}
            currentIndex={index}
          />
        </div>

        {/* Render Card Container */}
        {done ? (
          <div className="rounded-3xl border border-[#2e3248] bg-[#1a1d27] p-6 shadow-xl">
            <ScoreScreen results={results} xpEarned={xpEarned} onHome={handleHome} />
          </div>
        ) : (
          <div key={index} className="animate-pop">
            <QuestionCard
              q={q}
              index={index}
              total={questions.length}
              onAnswer={handleAnswer}
              result={currentResult}
              hints={hints}
              misconceptions={misconceptions}
            />
          </div>
        )}
      </div>

      {/* FIXED MOBILE THUMB ZONE FOOTER BAR */}
      {!done && currentResult && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-[#2e3248] bg-[#1a1d27]/95 backdrop-blur-md px-4 py-4 z-50 flex items-center justify-center animate-pop">
          <div className="w-full max-w-md">
            <button
              onClick={handleNext}
              className="w-full rounded-2xl bg-[#f9c74f] py-4 text-base font-black text-[#0f1117] shadow-lg shadow-[#f9c74f]/10 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              <span>{index === questions.length - 1 ? "See Final Results" : "Continue"}</span>
              <span className="text-lg">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}