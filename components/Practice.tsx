"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MathText from "@/components/MathText";
import { MathSpan } from "@/components/MathText";

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
  answer_type: "mcq" | "free_response";
  // NOTE: correct_answer is intentionally NOT selected from the DB here.
  // Free response questions are graded server-side in /api/grade-response,
  // which fetches correct_answer itself. The client never sees it.
};

type UIQuestion = {
  id: number;
  question: string;
  options: Record<string, string>;
  correct: string; // empty string for free_response — unused in that path
  worked: string;
  skillId: number;
  difficulty: string;
  answerType: "mcq" | "free_response";
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

// `feedback` is only populated for free_response results, used by ScoreScreen
type Result = { q: UIQuestion; picked: string; correct: boolean; feedback?: string };

// Grading result shape returned by /api/grade-response
type GradeResult = {
  correct: boolean;
  misconception_code: string | null;
  feedback: string;
};

// Typed discriminator replaces the old magic-string "__next__" approach.
// Every call site must specify a kind, and TypeScript enforces the payload
// shape for each — no silent no-ops if a field is missing.
type AnswerAction =
  | { kind: "mcq"; key: string }
  | { kind: "graded"; result: GradeResult; studentAnswer: string }
  | { kind: "next" };

// ── Worked solution parser ─────────────────────────────────────────────────
type TransformBlock = { type: "transform"; from: string; to: string };
type TextBlock      = { type: "text"; content: string };
type StepBlock      = Array<TransformBlock | TextBlock>;

function extractLatex(s: string): string {
  return s.trim()
    .replace(/\\\\/g, "\\")
    .replace(/^\$\$([\s\S]*?)\$\$$/, "$1")
    .replace(/^\$([\s\S]*?)\$$/, "$1")
    .trim();
}

function parseWorkedSolution(raw: string): StepBlock[] {
  const stepStrings = raw.split(/\[STEP\]/i).map(s => s.trim()).filter(Boolean);
  return stepStrings.map(stepStr => {
    const blocks: StepBlock = [];
    const transformRe = /\[TRANSFORM:\s*([\s\S]+?)\s*\]/gi;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = transformRe.exec(stepStr)) !== null) {
      const before = stepStr.slice(lastIndex, match.index).trim();
      if (before) blocks.push({ type: "text", content: before });
      const inner = match[1].trim();
      const arrowMatch = inner.match(/^([\s\S]+?)\s*(?:->|→)\s*([\s\S]+)$/);
      if (arrowMatch) {
        blocks.push({
          type: "transform",
          from: extractLatex(arrowMatch[1].trim()),
          to:   extractLatex(arrowMatch[2].trim()),
        });
      } else {
        blocks.push({
          type: "transform",
          from: "",
          to: extractLatex(inner),
        });
      }
      lastIndex = match.index + match[0].length;
    }
    const remaining = stepStr.slice(lastIndex).trim();
    if (remaining) blocks.push({ type: "text", content: remaining });
    return blocks;
  });
}

// ── TransformTile ──────────────────────────────────────────────────────────
const TILE_STYLE_ID = "revily-transform-tile-style";
function ensureTileStyle() {
  if (typeof document === "undefined") return;
  if (document.getElementById(TILE_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = TILE_STYLE_ID;
  style.textContent = `
  @keyframes revilyPulse {
    0%, 100% { box-shadow: 0 0 0 0px #818cf844; }
    50%       { box-shadow: 0 0 0 4px #818cf822; }
  }
  .revily-transform-idle { animation: revilyPulse 2s ease-in-out infinite; }

  @keyframes revilyFadeIn {
    0%   { opacity: 0; transform: scale(0.92) translateY(4px); filter: blur(4px); }
    100% { opacity: 1; transform: scale(1)    translateY(0);   filter: blur(0);   }
  }
  .revily-fade-in { animation: revilyFadeIn 0.3s ease-out forwards; }
`;
  document.head.appendChild(style);
}

function TransformTile({ from, to, onReveal }: { from: string; to: string; onReveal?: () => void }) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => { ensureTileStyle(); }, []);

  function handleFlip() {
    if (!flipped) { setFlipped(true); onReveal?.(); }
    else { setFlipped(false); }
  }

  return (
    <button
      onClick={handleFlip}
      className={`relative mt-3 w-full rounded-2xl border-2 px-5 py-4 transition-all duration-200 cursor-pointer ${!flipped ? "revily-transform-idle" : ""}`}
      style={{
        borderColor: flipped ? "#4ade80" : "#818cf8",
        background:  flipped ? "#0d1f15" : "#818cf80d",
        fontFamily: "'Bricolage Grotesque', sans-serif",
      }}
    >
      <div className="mb-2 text-left text-[10px] font-bold uppercase tracking-widest"
        style={{ color: flipped ? "#4ade8088" : "#818cf888" }}>
        {flipped ? "after" : "tap to reveal →"}
      </div>

      <div key={String(flipped)} className="flex items-center justify-center gap-3 revily-fade-in">
        {from && (
          <div className="text-base" style={{ color: flipped ? "#4ade80" : "#a5b4fc" }}>
            <MathSpan latex={from} />
          </div>
        )}
        {!flipped && (
          <div className="flex items-center gap-1.5 text-sm font-bold text-[#818cf8]">
            {from && <span>→</span>}
            <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-dashed border-[#818cf8] text-sm text-[#818cf8]">?</span>
          </div>
        )}
        {flipped && (
          <div className="flex items-center gap-2 text-base text-[#4ade80]">
            {from && <span className="text-sm font-bold">→</span>}
            <MathSpan latex={to} />
          </div>
        )}
      </div>

      {flipped && <div className="mt-2 text-center text-[10px] text-[#4ade8066]">tap to reset</div>}
    </button>
  );
}

// ── StepByStepSolution ─────────────────────────────────────────────────────
function StepByStepSolution({
  worked,
  onAllRevealed,
}: {
  worked: string;
  onAllRevealed: () => void;
}) {
  const steps = parseWorkedSolution(worked);
  const isSimple = steps.length <= 1 && !worked.includes("[TRANSFORM");
  const [revealed, setRevealed] = useState(1);
  const [tilesRevealed, setTilesRevealed] = useState<Record<string, boolean>>({});

  const revealedSteps = steps.slice(0, revealed);
  const totalTiles = revealedSteps.reduce((acc, step) =>
    acc + step.filter(b => b.type === "transform").length, 0
  );
  const tilesFlippedCount = Object.values(tilesRevealed).filter(Boolean).length;
  const allTilesFlipped = totalTiles === 0 || tilesFlippedCount >= totalTiles;
  const allRevealed = revealed >= steps.length;

  useEffect(() => {
    if (isSimple || (allRevealed && allTilesFlipped)) {
      onAllRevealed();
    }
  }, [isSimple, allRevealed, allTilesFlipped]);

  if (isSimple) {
    return (
      <div className="text-sm leading-relaxed text-[#8a8fa8]">
        <MathText text={worked} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {revealedSteps.map((step, si) => (
        <div key={si} className="flex gap-3">
          <div
            className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
            style={{
              background: si < revealed - 1 ? "#f9c74f33" : "#818cf833",
              color:      si < revealed - 1 ? "#f9c74f"   : "#818cf8",
              fontFamily: "'Bricolage Grotesque', sans-serif",
            }}
          >
            {si + 1}
          </div>
          <div className="flex-1">
            {step.map((block, bi) => {
              if (block.type === "text") {
                return (
                  <span key={bi} className="text-sm leading-relaxed text-[#8a8fa8]">
                    <MathText text={block.content} />
                  </span>
                );
              }
              const tileKey = `${si}-${bi}`;
              return (
                <TransformTile
                  key={bi}
                  from={block.from}
                  to={block.to}
                  onReveal={() => setTilesRevealed(prev => ({ ...prev, [tileKey]: true }))}
                />
              );
            })}
          </div>
        </div>
      ))}

      {revealed < steps.length && (
        <button
          onClick={() => setRevealed(r => r + 1)}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#818cf8] bg-[#818cf80d] py-3 text-sm font-bold text-[#818cf8] transition-all hover:bg-[#818cf815] active:scale-95"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          Show me step {revealed + 1} of {steps.length} →
        </button>
      )}
    </div>
  );
}

function toUIQuestion(q: Question): UIQuestion {
  return {
    id: q.id,
    question: q.question_text,
    options: { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d },
    correct: q.correct_option?.toUpperCase() ?? "",
    worked: q.worked_solution,
    skillId: q.skill_id,
    difficulty: q.difficulty,
    answerType: q.answer_type ?? "mcq",
  };
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("revily_session_id");
  if (!id) { id = crypto.randomUUID(); localStorage.setItem("revily_session_id", id); }
  return id;
}

// ── Attempt logging (MCQ path only — via API route) ─────────────────────────
// Free response attempts are logged server-side inside /api/grade-response,
// so this function is only ever called for answer_type === "mcq".
async function logAttempt(q: UIQuestion, answerPicked: string, isCorrect: boolean, userId: string | null) {
  await fetch("/api/attempt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      questionId: q.id,
      skillId: q.skillId,
      answerPicked,
      isCorrect,
      userId,
      sessionId: getSessionId(),
    }),
  });
}

// ── Supabase helpers (XP / streak — MCQ path only) ───────────────────────────
// Free response XP/streak is awarded server-side inside /api/grade-response.
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

// ── XP Float ──────────────────────────────────────────────────────────────
const XP_STYLE_ID = "revily-xp-float-style";
function ensureXPStyle() {
  if (typeof document === "undefined") return;
  if (document.getElementById(XP_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = XP_STYLE_ID;
  style.textContent = `
    @keyframes revilyXPFloat {
      0%   { opacity: 0; transform: translateY(0)    scale(0.8); }
      20%  { opacity: 1; transform: translateY(-6px)  scale(1.2); }
      60%  { opacity: 1; transform: translateY(-22px) scale(1);   }
      100% { opacity: 0; transform: translateY(-40px) scale(0.9); }
    }
    .revily-xp-float {
      position: fixed;
      pointer-events: none;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 15px;
      font-weight: 700;
      color: #f9c74f;
      white-space: nowrap;
      z-index: 9999;
      animation: revilyXPFloat 1.1s ease-out forwards;
    }
  `;
  document.head.appendChild(style);
}

function fireXPFloat() {
  ensureXPStyle();
  const badge = document.querySelector<HTMLElement>("[data-revily-xp-badge]");
  const el = document.createElement("div");
  el.className = "revily-xp-float";
  el.textContent = "+10 XP";
  if (badge) {
    const rect = badge.getBoundingClientRect();
    el.style.left = rect.left + rect.width / 2 + "px";
    el.style.top  = rect.top + "px";
  } else {
    el.style.right = "1.5rem";
    el.style.top   = "3.5rem";
  }
  document.body.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

// ── OptionButton ───────────────────────────────────────────────────────────
type OptionState = "idle" | "correct" | "wrong" | "highlight" | "dimmed";

function OptionButton({ label, text, state, onClick, disabled }: {
  label: string; text: string; state: OptionState; onClick: () => void; disabled: boolean;
}) {
  const base = "flex items-center gap-3 w-full rounded-xl border-2 px-4 py-4 text-left transition-all duration-150";
  const styles: Record<OptionState, string> = {
    idle:      "border-[#2e3248] bg-[#22263a] text-[#f1f0ee] hover:border-[#f9c74f] hover:translate-x-0.5 cursor-pointer",
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

  return (
    <button className={`${base} ${styles[state]}`} onClick={onClick} disabled={disabled}>
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold ${letterStyles[state]}`}
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        {keyHints[label]}
      </div>
      <span className="flex-1 text-lg font-bold leading-snug" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
        <MathText text={text} />
      </span>
    </button>
  );
}

// ── FreeResponseInput ────────────────────────────────────────────────────────
// Plain text input for free response questions. Submits to /api/grade-response,
// which is the ONLY place that knows the correct answer — this component
// never receives or sends correct_answer. Only questionId + the student's
// typed text are sent.
function FreeResponseInput({
  questionId,
  skillId,
  userId,
  onGraded,
  disabled,
}: {
  questionId: number;
  skillId: number;
  userId: string | null;
  onGraded: (result: GradeResult, studentAnswer: string) => void;
  disabled: boolean;
}) {
  const [value, setValue] = useState("");
  const [grading, setGrading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset local state whenever the question changes (new questionId)
  useEffect(() => {
    setValue("");
    setGrading(false);
    setRateLimited(false);
    inputRef.current?.focus();
  }, [questionId]);

  async function handleSubmit() {
    if (!value.trim() || grading || disabled) return;
    setGrading(true);
    setRateLimited(false);

    try {
      const res = await fetch("/api/grade-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId,
          skillId,
          studentAnswer: value.trim(),
          userId,
          sessionId: getSessionId(),
        }),
      });

      if (res.status === 429) {
        setRateLimited(true);
        setGrading(false);
        return;
      }

      const data: GradeResult = await res.json();
      onGraded(data, value.trim());
    } catch (err) {
      console.error("Grading request failed:", err);
      onGraded(
        { correct: false, misconception_code: null, feedback: "Something went wrong — please try again." },
        value.trim()
      );
    } finally {
      setGrading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === "Enter" && !disabled && handleSubmit()}
        disabled={disabled || grading}
        placeholder="Type your answer…"
        className="w-full rounded-xl border-2 border-[#2e3248] bg-[#22263a] px-4 py-4 text-lg font-bold text-[#f1f0ee] placeholder-[#555a73] focus:border-[#f9c74f] focus:outline-none transition-colors disabled:opacity-60"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      />
      {!disabled && (
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || grading}
          className="w-full rounded-xl bg-[#f9c74f] py-3.5 text-sm font-bold text-[#0f1117] transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          {grading ? "Checking…" : "Submit answer"}
        </button>
      )}
      {rateLimited && (
        <div className="rounded-xl border border-[#f8717144] bg-[#f871710d] px-4 py-3 text-xs text-[#f87171]">
          You've made a lot of attempts in a short time — take a short break and try again in a few minutes.
        </div>
      )}
    </div>
  );
}

// ── HintButton ─────────────────────────────────────────────────────────────
function HintButton({ hints, answered }: { hints: Hint[]; answered: boolean }) {
  const [revealed, setRevealed] = useState(0);
  useEffect(() => { setRevealed(0); }, [hints]);
  if (!hints.length || answered) return null;
  return (
    <div className="flex flex-col items-end gap-2">
      {hints.slice(0, revealed).map((h, i) => (
        <div key={i} className="w-full rounded-xl border border-[#f9c74f33] bg-[#f9c74f0d] px-4 py-3 text-sm text-[#f9c74f]">
          <span className="mr-2 font-bold">💡</span>
          <MathText text={h.hint_text} />
        </div>
      ))}
      {revealed < hints.length && (
        <button
          onClick={() => setRevealed(r => r + 1)}
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
        <MathText text={misconception.description} />
      </div>
    </div>
  );
}

// Lightweight feedback panel for free response — shows Claude's one-sentence
// feedback directly, rather than reusing MisconceptionPanel which expects
// a DB-shaped misconception object with title/description.
function FreeResponseFeedback({ feedback, correct }: { feedback: string; correct: boolean }) {
  if (correct) return null;
  return (
    <div className="mt-3 rounded-xl border border-[#f8717133] bg-[#f871710d] px-4 py-3">
      <div
        className="mb-1 text-xs font-bold uppercase tracking-wider text-[#f87171]"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        💡 Feedback
      </div>
      <div className="text-sm leading-relaxed text-[#c88]">
        <MathText text={feedback} />
      </div>
    </div>
  );
}

// ── ProgressDots ───────────────────────────────────────────────────────────
function ProgressDots({ results, total, currentIndex }: {
  results: Result[];
  total: number;
  currentIndex: number;
}) {
  return (
    <div className="flex gap-1.5 items-center">
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
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${bg}`}
            style={{ transform: isCurrent ? "scaleY(1.4)" : "scaleY(1)" }}
          />
        );
      })}
    </div>
  );
}

// ── QuestionCard ───────────────────────────────────────────────────────────
function QuestionCard({
  q, index, total, userId, onAnswerAction, firstResult, freeResponseGrade,
  hints, misconceptions, onAllStepsRevealed, allStepsRevealed,
}: {
  q: UIQuestion;
  index: number;
  total: number;
  userId: string | null;
  onAnswerAction: (action: AnswerAction) => void;
  firstResult: string | null;       // MCQ letter, or sentinel "__correct__" / "__wrong__" for free response
  freeResponseGrade: GradeResult | null; // populated only when q.answerType === "free_response" and answered
  hints: Hint[];
  misconceptions: Misconception[];
  onAllStepsRevealed: () => void;
  allStepsRevealed: boolean;
}) {
  const isFreeResponse = q.answerType === "free_response";
  const answered = firstResult !== null;

  // wasWrong means different things per type:
  // - MCQ: picked letter doesn't match q.correct
  // - free response: freeResponseGrade.correct === false
  const wasWrong = isFreeResponse
    ? answered && freeResponseGrade?.correct === false
    : answered && firstResult !== q.correct;

  // Reattempt flow is MCQ-only by design — free response goes straight to
  // feedback + worked solution + Next, since "retyping the same wrong text"
  // isn't a meaningful interaction the way "pick a different letter" is.
  const [reattempt, setReattempt] = useState<string | null>(null);
  const reattemptDone = reattempt !== null;

  function getState(key: string): OptionState {
    if (wasWrong && allStepsRevealed && !reattemptDone) return "idle";
    if (!answered) return "idle";
    if (key === q.correct) return firstResult === key ? "correct" : "highlight";
    if (key === firstResult) return "wrong";
    return "dimmed";
  }

  function getReattemptState(key: string): OptionState {
    if (!reattemptDone) return "idle";
    if (key === q.correct) return reattempt === key ? "correct" : "highlight";
    if (key === reattempt) return "wrong";
    return "dimmed";
  }

  function handleMCQClick(key: string) {
    if (wasWrong && allStepsRevealed && !reattemptDone) { setReattempt(key); return; }
    if (!answered) onAnswerAction({ kind: "mcq", key });
  }

  function handleGraded(result: GradeResult, studentAnswer: string) {
    onAnswerAction({ kind: "graded", result, studentAnswer });
  }

  const activeMisconception = !isFreeResponse && wasWrong
    ? misconceptions.find(
        m => m.question_id === q.id && m.wrong_option?.toUpperCase() === firstResult?.toUpperCase()
      ) ?? null
    : null;

  // For free response: once answered, always unlocked to move on (no reattempt).
  // For MCQ: unchanged existing logic.
  const nextUnlocked = isFreeResponse
    ? answered
    : answered && (firstResult === q.correct ? true : reattemptDone);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-[#8a8fa8]">
          Question {index + 1} of {total}
        </div>
      </div>

      <div
        className="mb-5 text-2xl leading-snug text-[#f1f0ee]"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 }}
      >
        <MathText text={q.question} />
      </div>

      {/* Pre-answer: hints only — no worked example */}
      {!answered && (
        <div className="mb-4">
          <HintButton
            hints={hints.filter(h => h.question_id === q.id).sort((a, b) => a.order_index - b.order_index)}
            answered={answered}
          />
        </div>
      )}

      {/* Answer input — branches on answer type */}
      {isFreeResponse ? (
        <FreeResponseInput
          questionId={q.id}
          skillId={q.skillId}
          userId={userId}
          onGraded={handleGraded}
          disabled={answered}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {Object.entries(q.options).map(([k, v]) => (
            <OptionButton
              key={k} label={k} text={v}
              state={wasWrong && allStepsRevealed && !reattemptDone
                ? "idle"
                : reattemptDone
                ? getReattemptState(k)
                : getState(k)
              }
              onClick={() => handleMCQClick(k)}
              disabled={
                (!wasWrong && answered) ||
                (wasWrong && !allStepsRevealed) ||
                reattemptDone
              }
            />
          ))}
        </div>
      )}

      {/* Post-answer section */}
      {answered && (
        <>
          {isFreeResponse
            ? wasWrong && freeResponseGrade && (
                <FreeResponseFeedback feedback={freeResponseGrade.feedback} correct={false} />
              )
            : wasWrong && <MisconceptionPanel misconception={activeMisconception} />
          }

          <div className="mt-3 rounded-xl border border-[#2e3248] bg-[#22263a] p-4">
            <div
              className={`mb-1 text-xs font-bold uppercase tracking-wider ${!wasWrong ? "text-[#4ade80]" : "text-[#f87171]"}`}
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              {!wasWrong
                ? "✓ Correct!"
                : isFreeResponse
                ? "💡 Not quite — here's the worked solution:"
                : "💡 Nearly! Here's where it went wrong:"}
            </div>

            {wasWrong && isFreeResponse && (
              <StepByStepSolution
                worked={q.worked}
                onAllRevealed={onAllStepsRevealed}
              />
            )}

            {wasWrong && !isFreeResponse && (
              <>
                {!allStepsRevealed && (
                  <p className="mb-3 text-xs text-[#555a73]">
                    Work through the steps below, then you'll get another shot at it.
                  </p>
                )}
                {allStepsRevealed && !reattemptDone && (
                  <p className="mb-3 text-xs text-[#f9c74f]">
                    Got it? Now try it again ↑
                  </p>
                )}
                {reattemptDone && (
                  <p className="mb-3 text-xs" style={{ color: reattempt === q.correct ? "#4ade80" : "#f87171" }}>
                    {reattempt === q.correct ? "✓ You got it this time!" : `Not quite — the answer was ${q.correct}.`}
                  </p>
                )}
                <StepByStepSolution
                  worked={q.worked}
                  onAllRevealed={onAllStepsRevealed}
                />
              </>
            )}
          </div>
        </>
      )}

      {answered && (
        <div className="mt-6 flex flex-col items-end gap-2">
          {!nextUnlocked && (
            <p className="text-xs text-[#555a73]">
              {wasWrong && !reattemptDone
                ? allStepsRevealed
                  ? "Have another go first ↑"
                  : "Work through the steps to continue"
                : "Tap through the steps to continue"}
            </p>
          )}
          <button
            onClick={() => nextUnlocked && onAnswerAction({ kind: "next" })}
            disabled={!nextUnlocked}
            className="rounded-full bg-[#f9c74f] px-7 py-2.5 text-sm font-bold text-[#0f1117] transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            {index === total - 1 ? "See Results" : "Next Question"} →
          </button>
        </div>
      )}
    </div>
  );
}

// ── ScoreScreen ────────────────────────────────────────────────────────────
function ScoreScreen({ results, xpEarned, onHome }: {
  results: Result[]; xpEarned: number; onHome: () => void;
}) {
  const correct = results.filter(r => r.correct).length;
  const total = results.length;
  const pct = Math.round((correct / total) * 100);
  const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "⭐" : "💪";
  const msg = pct >= 80 ? "Smashing it!" : pct >= 60 ? "Solid effort!" : "Keep practising!";

  return (
    <div className="text-center">
      <div className="mb-2 text-5xl">{emoji}</div>
      <div className="text-5xl font-extrabold text-[#f9c74f]"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
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
              {r.q.question.replace(/\$+[^$]*\$+/g, "…").split(":")[0]}
              {r.q.answerType === "free_response" ? (
                // Free response — show Claude's feedback sentence naturally,
                // never "you picked: <feedback>" (fixes the underspecified
                // ScoreScreen tweak from the original review).
                r.feedback ? <> — {r.feedback}</> : null
              ) : (
                // MCQ — unchanged behaviour
                <>
                  {" "}— you picked {r.picked}
                  {!r.correct && `, answer was ${r.q.correct}`}
                </>
              )}
            </span>
          </div>
        ))}
      </div>
      <button onClick={onHome}
        className="w-full rounded-full bg-[#f9c74f] py-3 text-sm font-bold text-[#0f1117] transition-opacity hover:opacity-90">
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
  const [hints, setHints] = useState<Hint[]>([]);
  const [misconceptions, setMisconceptions] = useState<Misconception[]>([]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [freeResponseGrade, setFreeResponseGrade] = useState<GradeResult | null>(null);
  const [allStepsRevealed, setAllStepsRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const allStepsRevealedRef = useRef(false);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);
      if (skillId) {
        const { data: skill } = await supabase.from("skills").select("name").eq("id", skillId).single();
        if (skill) setSkillName(skill.name);
      }
      let query = supabase.from("questions").select("*").order("id");
      if (skillId) query = query.eq("skill_id", skillId);
      const { data: qData, error: qErr } = await query;
      if (qErr || !qData) { setError("Failed to load questions. Please refresh."); setLoading(false); return; }
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

  const handleAnswerAction = useCallback(async (action: AnswerAction) => {
    if (action.kind === "next") {
      if (index + 1 >= questions.length) {
        setDone(true);
      } else {
        setIndex(i => i + 1);
        setCurrentResult(null);
        setFreeResponseGrade(null);
        setAllStepsRevealed(false);
        allStepsRevealedRef.current = false;
      }
      return;
    }

    if (currentResult) return; // already answered this question

    if (action.kind === "graded") {
      // Free response — grading, attempt logging, and XP/streak already
      // happened server-side inside /api/grade-response. This branch only
      // updates local UI state to reflect the result.
      const { result, studentAnswer } = action;
      setFreeResponseGrade(result);
      setCurrentResult(result.correct ? "__correct__" : "__wrong__");
      if (result.correct) {
        setAllStepsRevealed(true);
        allStepsRevealedRef.current = true;
      }
      setResults(prev => [...prev, {
        q,
        picked: studentAnswer,
        correct: result.correct,
        feedback: result.feedback,
      }]);
      if (!result.correct) { setShake(true); setTimeout(() => setShake(false), 400); }
      if (result.correct) {
        setXpEarned(prev => prev + 10);
        fireXPFloat();
        window.dispatchEvent(new Event("revily:xp-updated"));
      }
      return;
    }

    // action.kind === "mcq" — existing logic, unchanged
    const key = action.key;
    const isCorrect = key === q.correct;
    setCurrentResult(key);
    if (isCorrect) {
      setAllStepsRevealed(true);
      allStepsRevealedRef.current = true;
    }
    setResults(prev => [...prev, { q, picked: key, correct: isCorrect }]);
    if (!isCorrect) { setShake(true); setTimeout(() => setShake(false), 400); }
    logAttempt(q, key, isCorrect, userId);
    if (isCorrect && userId) {
      await Promise.all([awardXP(userId), updateStreak(userId)]);
      setXpEarned(prev => prev + 10);
      fireXPFloat();
      window.dispatchEvent(new Event("revily:xp-updated"));
    }
  }, [q, userId, currentResult, index, questions.length]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      // Free response questions own their own input field — keyboard letter
      // shortcuts (1-4, a-d) should not fire for them.
      if (q?.answerType === "free_response") {
        if ((e.key === "Enter" || e.key === " ") && currentResult) {
          e.preventDefault();
          if (allStepsRevealedRef.current) handleAnswerAction({ kind: "next" });
        }
        return;
      }
      const keyMap: Record<string, string> = { a:"A", b:"B", c:"C", d:"D", "1":"A", "2":"B", "3":"C", "4":"D" };
      const mapped = keyMap[e.key.toLowerCase()];
      if (mapped && !currentResult && q) { handleAnswerAction({ kind: "mcq", key: mapped }); return; }
      if ((e.key === "Enter" || e.key === " ") && currentResult) {
        e.preventDefault();
        if (allStepsRevealedRef.current) handleAnswerAction({ kind: "next" });
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentResult, q, handleAnswerAction]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1117]">
      <div className="text-sm text-[#8a8fa8]">Loading questions…</div>
    </div>
  );

  if (error || !questions.length) return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1117]">
      <div className="text-center">
        <div className="mb-3 text-sm text-[#f87171]">{error ?? "No questions found for this skill."}</div>
        <button onClick={() => router.push("/home")}
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
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-[#2e3248] bg-[#22263a] px-4 py-1.5 text-xs uppercase tracking-widest text-[#8a8fa8]">
            <span className="h-2 w-2 rounded-full bg-[#f9c74f]" />
            {skillName || "Practice"}
          </div>
          <button onClick={() => router.push("/home")}
            className="rounded-full border border-[#2e3248] bg-[#22263a] px-3 py-1.5 text-xs text-[#8a8fa8] hover:text-[#f1f0ee] transition-colors">
            ← Home
          </button>
        </div>

        <div className="mb-6">
          <ProgressDots results={results} total={questions.length} currentIndex={index} />
        </div>

        {done ? (
          <ScoreScreen results={results} xpEarned={xpEarned} onHome={() => router.push("/home")} />
        ) : (
          <div key={index} className="pop">
            <QuestionCard
              q={q}
              index={index}
              total={questions.length}
              userId={userId}
              onAnswerAction={handleAnswerAction}
              firstResult={currentResult}
              freeResponseGrade={freeResponseGrade}
              hints={hints}
              misconceptions={misconceptions}
              onAllStepsRevealed={() => {
                setAllStepsRevealed(true);
                allStepsRevealedRef.current = true;
              }}
              allStepsRevealed={allStepsRevealed}
            />
          </div>
        )}
      </div>
    </div>
  );
}