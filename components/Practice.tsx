"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MathText from "@/components/MathText";
import { MathSpan } from "@/components/MathText";
import TeachCard, { TeachContent } from "@/components/TeachCard";
// ── Types ──────────────────────────────────────────────────────────────────
type GuidedBlank = { id: string; prompt: string; answer: string };

type Question = {
  id: number;
  question_text: string;
  question_type: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  worked_solution: string;
  difficulty: string;
  skill_id: number;
  answer_type: "mcq" | "free_response" | "guided" | "teach";
  blanks: GuidedBlank[] | null;
  teach_content: TeachContent | null; // only populated when answer_type === "teach"
  probe_for_code: string | null;   // set on diagnostic questions that branch-check this code
  repair_for_code: string | null;  // set on repair questions that fix this code
  // NOTE: correct_answer is intentionally NOT selected from the DB here.
  // Free response questions are graded server-side in /api/grade-response,
  // which fetches correct_answer itself. The client never sees it.
};

type UIQuestion = {
  id: number;
  question: string;
  questionType: string;
  options: Record<string, string>;
  correct: string; // empty string for free_response/guided/teach — unused in that path
  worked: string;
  skillId: number;
  difficulty: string;
  answerType: "mcq" | "free_response" | "guided" | "teach";
  blanks: GuidedBlank[] | null;
  teachContent: TeachContent | null;
  probeForCode: string | null;
  repairForCode: string | null;
};

type Hint = {
  question_id: number;
  hint_text: string;
  order_index: number;
};

type Misconception = {
  question_id: number;
  wrong_option: string;
  code: string;
  title: string;
  description: string;
};

// `feedback` is only populated for free_response results, used by ScoreScreen
type Result = { q: UIQuestion; picked: string; correct: boolean; feedback?: string };

// The DB copy of a Result — deliberately drops `q`. Question content is
// always re-attached from the live `questions` array on restore, so a
// saved session never shows stale text if a question is edited later.
type PersistedResult = { picked: string; correct: boolean; feedback?: string };

// Grading result shape returned by /api/grade-response
type GradeResult = {
  correct: boolean;
  misconception_code: string | null;
  feedback: string;
};

// Per-question-index progress status, used by ProgressDots. Kept separate
// from `Result` because "seen" (a teach interstitial) is not a scored
// outcome — it has no correct/incorrect value and must never enter the
// score total.
type StepStatus = "correct" | "wrong" | "seen";

// Typed discriminator replaces the old magic-string "__next__" approach.
// Every call site must specify a kind, and TypeScript enforces the payload
// shape for each — no silent no-ops if a field is missing.
type AnswerAction =
  | { kind: "mcq"; key: string; misconceptionCode?: string }
  | { kind: "graded"; result: GradeResult; studentAnswer: string }
  | { kind: "guided"; blankAnswers: Record<string, string>; isCorrect: boolean }
  | { kind: "teach_continue" }
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

function parseWorkedSolution(raw: string | null | undefined): StepBlock[] {
  if (!raw) return [];
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
  worked: string | null | undefined;
  onAllRevealed: () => void;
}) {
  const steps = parseWorkedSolution(worked);
  const isSimple = !worked || (steps.length <= 1 && !worked.includes("[TRANSFORM"));
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
        <MathText text={worked ?? "Check your answer above and try again."} />
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
    questionType: q.question_type,
    options: { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d },
    correct: q.correct_option?.toUpperCase() ?? "",
    worked: q.worked_solution,
    skillId: q.skill_id,
    difficulty: q.difficulty,
    answerType: q.answer_type ?? "mcq",
    blanks: q.blanks ?? null,
    teachContent: q.teach_content ?? null,
    probeForCode: q.probe_for_code ?? null,
    repairForCode: q.repair_for_code ?? null,
  };
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("revily_session_id");
  if (!id) { id = crypto.randomUUID(); localStorage.setItem("revily_session_id", id); }
  return id;
}

// ── Attempt logging (MCQ + guided path — via API route) ─────────────────────
// Free response attempts are logged server-side inside /api/grade-response,
// so this function is only ever called for answer_type === "mcq" or "guided".
async function logAttempt(q: UIQuestion, answerPicked: string, isCorrect: boolean, userId: string | null, misconceptionCode?: string) {
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
      misconceptionCode: misconceptionCode ?? null,
    }),
  });
}

// ── Supabase helpers (XP / streak — MCQ + guided path) ───────────────────────
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

// ── GuidedScaffold ───────────────────────────────────────────────────────────
// Multi-blank fill-in-the-blank input for the "Guided Example" lesson stage.
// Grading is simple client-side normalized-string matching — these are short,
// low-stakes scaffold steps (a single number or short fraction per blank),
// not a full graded assessment, so the equivalence-rule machinery in
// /api/grade-response would be overkill here.
function normalizeBlankAnswer(s: string): string {
  return s.trim().replace(/\s+/g, "");
}

function GuidedScaffold({
  blanks,
  disabled,
  onSubmit,
}: {
  blanks: GuidedBlank[];
  disabled: boolean;
  onSubmit: (values: Record<string, string>, allCorrect: boolean) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    setValues({});
  }, [blanks]);

  const allFilled = blanks.every(b => (values[b.id] ?? "").trim().length > 0);

  function handleSubmit() {
    if (disabled || !allFilled) return;
    const allCorrect = blanks.every(
      b => normalizeBlankAnswer(values[b.id] ?? "") === normalizeBlankAnswer(b.answer)
    );
    onSubmit(values, allCorrect);
  }

  return (
    <div className="flex flex-col gap-4">
      {blanks.map((b, i) => (
        <div key={b.id} className="flex flex-col gap-2">
          <div className="text-sm leading-relaxed text-[#8a8fa8]">
            <span
              className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#818cf833] text-[10px] font-bold text-[#818cf8]"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              {i + 1}
            </span>
            <MathText text={b.prompt} />
          </div>
          <input
            type="text"
            value={values[b.id] ?? ""}
            onChange={e => setValues(prev => ({ ...prev, [b.id]: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            disabled={disabled}
            placeholder="?"
            className="w-full rounded-xl border-2 border-[#2e3248] bg-[#22263a] px-4 py-3 text-lg font-bold text-[#f1f0ee] placeholder-[#555a73] focus:border-[#f9c74f] focus:outline-none transition-colors disabled:opacity-60"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          />
        </div>
      ))}
      {!disabled && (
        <button
          onClick={handleSubmit}
          disabled={!allFilled}
          className="w-full rounded-xl bg-[#f9c74f] py-3.5 text-sm font-bold text-[#0f1117] transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          Check my answers
        </button>
      )}
    </div>
  );
}

// Post-answer feedback for guided scaffolds — shows each blank with the
// student's answer alongside the correct one, color-coded per blank.
function GuidedFeedback({ blanks, studentAnswers }: { blanks: GuidedBlank[]; studentAnswers: Record<string, string> }) {
  return (
    <div className="mt-3 flex flex-col gap-2 rounded-xl border border-[#2e3248] bg-[#22263a] p-4">
      {blanks.map((b, i) => {
        const given = studentAnswers[b.id] ?? "";
        const correct = normalizeBlankAnswer(given) === normalizeBlankAnswer(b.answer);
        return (
          <div key={b.id} className="flex items-center justify-between text-sm">
            <span className="text-[#8a8fa8]">Blank {i + 1}: {given || "—"}</span>
            <span className={correct ? "text-[#4ade80]" : "text-[#f87171]"}>
              {correct ? "✓ correct" : `should be ${b.answer}`}
            </span>
          </div>
        );
      })}
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
// Driven by `stepStatus` (indexed by position in the questions array) rather
// than the scored results list, so a "teach" interstitial — which never
// produces a Result — doesn't shift every dot after it out of alignment.
function ProgressDots({ stepStatus, total, currentIndex, onDotClick }: {
  stepStatus: Record<number, StepStatus>;
  total: number;
  currentIndex: number;
  onDotClick: (i: number) => void;
}) {
  return (
    <div className="flex gap-1.5 items-center">
      {Array.from({ length: total }).map((_, i) => {
        const status = stepStatus[i];
        const isCurrent = i === currentIndex && !status;
        const clickable = !!status; // only steps already answered/seen are reviewable
        let bg = "bg-[#22263a]";
        if (status === "correct") bg = "bg-[#4ade80]";
        else if (status === "wrong") bg = "bg-[#f87171]";
        else if (status === "seen") bg = "bg-[#818cf8]"; // teach step — viewed, not scored
        else if (isCurrent) bg = "bg-[#f9c74f]";
        return (
          <button
            key={i}
            type="button"
            onClick={() => clickable && onDotClick(i)}
            disabled={!clickable}
            aria-label={clickable ? `Review question ${i + 1}` : `Question ${i + 1}`}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${bg} ${
              clickable ? "cursor-pointer hover:opacity-75" : "cursor-default"
            }`}
            style={{ transform: isCurrent ? "scaleY(1.4)" : "scaleY(1)" }}
          />
        );
      })}
    </div>
  );
}

// ── ReviewCard ─────────────────────────────────────────────────────────────
// Read-only summary shown when a past (already-answered/seen) progress dot
// is tapped. Deliberately NOT the interactive QuestionCard — no reattempt,
// no resubmission, nothing that could rewrite resultsByIndex/stepStatus.
// This is a viewer, not a second attempt.
function ReviewCard({
  q,
  result,
  status,
  onClose,
}: {
  q: UIQuestion;
  result: Result | null; // null for "teach" steps
  status: StepStatus | undefined;
  onClose: () => void;
}) {
  if (q.answerType === "teach") {
    return <TeachCard content={q.teachContent!} onContinue={onClose} continueLabel="Close" />;
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-[#8a8fa8]">Reviewing a past question</div>
      </div>

      <div
        className="mb-5 text-2xl leading-snug text-[#f1f0ee]"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 }}
      >
        <MathText text={q.question} />
      </div>

      {q.answerType === "mcq" && (
        <div className="flex flex-col gap-3">
          {Object.entries(q.options).map(([k, v]) => {
            let state: OptionState = "dimmed";
            if (k === q.correct) state = result?.picked === k ? "correct" : "highlight";
            else if (k === result?.picked) state = "wrong";
            return <OptionButton key={k} label={k} text={v} state={state} onClick={() => {}} disabled />;
          })}
        </div>
      )}

      {(q.answerType === "free_response" || q.answerType === "guided") && (
        <div className="rounded-xl border border-[#2e3248] bg-[#22263a] px-4 py-4 text-sm text-[#f1f0ee]">
          You answered: <span className="font-bold">{result?.picked}</span>
          {result?.feedback && (
            <div className="mt-2 text-[#8a8fa8]">
              <MathText text={result.feedback} />
            </div>
          )}
        </div>
      )}

      {status && (
        <div
          className={`mt-4 text-xs font-bold uppercase tracking-wider ${
            status === "correct" ? "text-[#4ade80]" : "text-[#f87171]"
          }`}
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          {status === "correct" ? "✓ Correct" : "✗ Incorrect"}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="rounded-full bg-[#f9c74f] px-7 py-2.5 text-sm font-bold text-[#0f1117] transition-opacity hover:opacity-90"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ── QuestionCard ───────────────────────────────────────────────────────────
function QuestionCard({
  q, index, total, userId, onAnswerAction, firstResult, freeResponseGrade, guidedAnswers,
  hints, misconceptions, onAllStepsRevealed, allStepsRevealed, isDetour,
}: {
  q: UIQuestion;
  index: number;
  total: number;
  userId: string | null;
  onAnswerAction: (action: AnswerAction) => void;
  firstResult: string | null;       // MCQ letter, or sentinel "__correct__" / "__wrong__" for free response/guided
  freeResponseGrade: GradeResult | null; // populated only when q.answerType === "free_response" and answered
  guidedAnswers: Record<string, string> | null; // populated only when q.answerType === "guided" and answered
  hints: Hint[];
  misconceptions: Misconception[];
  onAllStepsRevealed: () => void;
  allStepsRevealed: boolean;
  isDetour: boolean; // true when shown as a Route D branch, out of flat sequence
}) {
  // Teach interstitial — non-quiz, no scoring, no progress-gating logic.
  // Bypasses everything below (its own "Key Point" header, its own
  // continue button) rather than reusing the "Question X of Y" chrome.
  if (q.answerType === "teach") {
    return (
      <TeachCard
        content={q.teachContent!}
        onContinue={() => onAnswerAction({ kind: "teach_continue" })}
      />
    );
  }

  const isFreeResponse = q.answerType === "free_response";
  const isGuided = q.answerType === "guided";
  const answered = firstResult !== null;

  // wasWrong means different things per type:
  // - MCQ: picked letter doesn't match q.correct
  // - free response: freeResponseGrade.correct === false
  // - guided: firstResult sentinel is "__wrong__"
  const wasWrong = isGuided
    ? answered && firstResult === "__wrong__"
    : isFreeResponse
    ? answered && freeResponseGrade?.correct === false
    : answered && firstResult !== q.correct;

  // Reattempt flow is MCQ-only by design — free response and guided go
  // straight to feedback + Next, since retrying isn't a meaningful
  // interaction the way "pick a different letter" is.
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
    if (!answered) {
      const code = misconceptions.find(
        m => m.question_id === q.id && m.wrong_option?.toUpperCase() === key.toUpperCase()
      )?.code;
      onAnswerAction({ kind: "mcq", key, misconceptionCode: code });
    }
  }

  function handleGraded(result: GradeResult, studentAnswer: string) {
    onAnswerAction({ kind: "graded", result, studentAnswer });
  }

  function handleGuidedSubmit(values: Record<string, string>, allCorrect: boolean) {
    onAnswerAction({ kind: "guided", blankAnswers: values, isCorrect: allCorrect });
  }

  const activeMisconception = !isFreeResponse && !isGuided && wasWrong
    ? misconceptions.find(
        m => m.question_id === q.id && m.wrong_option?.toUpperCase() === firstResult?.toUpperCase()
      ) ?? null
    : null;

  // For free response/guided: once answered, always unlocked to move on
  // (no reattempt). For MCQ: unchanged existing logic.
  const nextUnlocked = (isFreeResponse || isGuided)
    ? answered
    : answered && (firstResult === q.correct ? true : reattemptDone);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        {isDetour ? (
          <div className="text-xs uppercase tracking-widest text-[#818cf8]">
            {q.questionType === "repair" ? "🛠 Targeted Repair" : "🔍 Quick Check"}
          </div>
        ) : (
          <div className="text-xs uppercase tracking-widest text-[#8a8fa8]">
            Question {index + 1} of {total}
          </div>
        )}
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
      {isGuided ? (
        <GuidedScaffold
          blanks={q.blanks ?? []}
          disabled={answered}
          onSubmit={handleGuidedSubmit}
        />
      ) : isFreeResponse ? (
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
          {isGuided
            ? wasWrong && guidedAnswers && (
                <GuidedFeedback blanks={q.blanks ?? []} studentAnswers={guidedAnswers} />
              )
            : isFreeResponse
            ? wasWrong && freeResponseGrade && (
                <FreeResponseFeedback feedback={freeResponseGrade.feedback} correct={false} />
              )
            : wasWrong && <MisconceptionPanel misconception={activeMisconception} />
          }

          {!isGuided && (
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
          )}

          {isGuided && (
            <div
              className={`mt-3 text-xs font-bold uppercase tracking-wider ${!wasWrong ? "text-[#4ade80]" : "text-[#f87171]"}`}
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              {!wasWrong ? "✓ Correct!" : "💡 Close — check the blanks above"}
            </div>
          )}
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
                // MCQ / guided — unchanged behaviour
                <>
                  {" "}— you picked {r.picked}
                  {!r.correct && r.q.answerType === "mcq" && `, answer was ${r.q.correct}`}
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
  // Route D branching state (see doc §1.4). `index` remains the flat-
  // sequence resume pointer — it never moves during a detour, so
  // finishing one naturally "returns to the original skill" at the
  // same point. `shownIds` prevents a question already shown via detour
  // from reappearing when flat sequence later reaches its normal slot.
  const [detourQueue, setDetourQueue] = useState<number[]>([]);
  const [activeDetourId, setActiveDetourId] = useState<number | null>(null);
  const [shownIds, setShownIds] = useState<Set<number>>(new Set());
  // Indexed by question position (not push-ordered) so a "teach" step —
  // which never produces a Result — can't shift later indices out of
  // alignment. See ProgressDots and the ScoreScreen call site below.
  const [resultsByIndex, setResultsByIndex] = useState<Record<number, Result>>({});
  const [stepStatus, setStepStatus] = useState<Record<number, StepStatus>>({});
  const [reviewIndex, setReviewIndex] = useState<number | null>(null);
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [freeResponseGrade, setFreeResponseGrade] = useState<GradeResult | null>(null);
  const [guidedAnswers, setGuidedAnswers] = useState<Record<string, string> | null>(null);
  const [allStepsRevealed, setAllStepsRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  // Gates the persistence-write effect further down — stays false until
  // the restore-on-load fetch has run (whether or not it found anything),
  // so that effect can never fire on mount and overwrite a saved row with
  // the empty default state before restoration has had a chance to apply.
  const [restored, setRestored] = useState(false);
  const allStepsRevealedRef = useRef(false);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);
      if (skillId) {
        const { data: skill } = await supabase.from("skills").select("name").eq("id", skillId).single();
        if (skill) setSkillName(skill.name);
      }
      // Ordered by display_order, not id — the guided/teach interstitials
      // are inserted after their surrounding questions and rely on
      // fractional display_order values (e.g. 4.5) to sit in the right
      // place in the lesson flow.
      let query = supabase.from("questions").select("*").order("display_order");
      if (skillId) query = query.eq("skill_id", skillId);
      const { data: qData, error: qErr } = await query;
      if (qErr || !qData) { setError("Failed to load questions. Please refresh."); setLoading(false); return; }
      const uiQuestions = (qData as Question[]).map(toUIQuestion);
      setQuestions(uiQuestions);
      const qIds = qData.map((q: Question) => q.id);
      const [{ data: hData }, { data: mData }, { data: catalogData }] = await Promise.all([
        supabase.from("hints").select("question_id, hint_text, order_index").in("question_id", qIds),
        supabase.from("misconceptions").select("question_id, wrong_option, code, title, description").in("question_id", qIds),
        // Skill-level catalog rows (question_id is null) — per the import
        // convention, question-linked rows are often title-only, relying
        // on the catalog entry with the same `code` for the description.
        // /api/grade-response already does this fallback server-side for
        // free response; this does the equivalent for the MCQ panel.
        skillId
          ? supabase.from("misconceptions").select("code, title, description").eq("skill_id", skillId).is("question_id", null)
          : Promise.resolve({ data: [] as { code: string; title: string; description: string }[] }),
      ]);
      setHints((hData as Hint[]) ?? []);
      const catalogByCode: Record<string, { title: string; description: string }> = {};
      (catalogData ?? []).forEach((c) => { catalogByCode[c.code] = c; });
      const enrichedMisconceptions = ((mData as Misconception[]) ?? []).map((m) => ({
        ...m,
        title: m.title || catalogByCode[m.code]?.title || m.title,
        description: m.description || catalogByCode[m.code]?.description || "",
      }));
      setMisconceptions(enrichedMisconceptions);

      // Restore saved progress. identityKey mirrors what's written below:
      // the signed-in user's id when available (resumes across devices),
      // otherwise the anonymous session_id (resumes on this device only —
      // there's no cross-device identity to key on without an account).
      if (skillId) {
        const identityKey = session?.user?.id ?? getSessionId();
        const { data: progress, error: progressErr } = await supabase
          .from("practice_progress")
          .select("*")
          .eq("identity_key", identityKey)
          .eq("skill_id", skillId)
          .maybeSingle();

        if (progressErr) {
          console.error("Failed to load saved progress:", progressErr);
        } else if (progress && !progress.done) {
          setIndex(progress.current_index ?? 0);
          setStepStatus((progress.step_status as Record<number, StepStatus>) ?? {});
          const raw = (progress.results_by_index as Record<string, PersistedResult>) ?? {};
          const rehydrated: Record<number, Result> = {};
          for (const [k, r] of Object.entries(raw)) {
            const i = Number(k);
            if (uiQuestions[i]) rehydrated[i] = { ...r, q: uiQuestions[i] };
          }
          setResultsByIndex(rehydrated);
          setXpEarned(progress.xp_earned ?? 0);
          setDetourQueue((progress.detour_queue as number[]) ?? []);
          setActiveDetourId(progress.active_detour_id ?? null);
          setShownIds(new Set((progress.shown_ids as number[]) ?? []));
        }
      }

      setLoading(false);
      setRestored(true);
    }
    init();
  }, [skillId]);

  // Persist progress after every change, once restoration above has run.
  // Fires once per answer/teach-continue — not high frequency, so a plain
  // upsert per change is fine without debouncing.
  useEffect(() => {
    if (!restored || !skillId) return;
    supabase
      .from("practice_progress")
      .upsert(
        {
          user_id: userId,
          session_id: getSessionId(),
          skill_id: Number(skillId),
          current_index: index,
          results_by_index: Object.fromEntries(
            Object.entries(resultsByIndex).map(([k, r]) => [
              k,
              { picked: r.picked, correct: r.correct, feedback: r.feedback } as PersistedResult,
            ])
          ),
          step_status: stepStatus,
          xp_earned: xpEarned,
          done,
          detour_queue: detourQueue,
          active_detour_id: activeDetourId,
          shown_ids: Array.from(shownIds),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "identity_key,skill_id" }
      )
      .then(({ error }) => {
        if (error) console.error("Failed to save progress:", error);
      });
  }, [index, resultsByIndex, stepStatus, xpEarned, done, detourQueue, activeDetourId, shownIds, restored, skillId, userId]);

  // The currently-displayed question: a detour target when one is
  // active (Route D branch), otherwise the flat-sequence question at
  // `index`. `recordIndex` is its position in the base array — that's
  // always what resultsByIndex/stepStatus key off, regardless of
  // whether it was reached by branching or by normal sequence, so a
  // probe answered early via detour still lights up its own dot.
  const q = activeDetourId !== null
    ? questions.find(qq => qq.id === activeDetourId)
    : questions[index];
  const recordIndex = q ? questions.findIndex(qq => qq.id === q.id) : index;

  // Advances `index` past any question already shown via detour, so
  // flat sequence never re-shows something the student already saw.
  function nextFlatIndex(from: number): number {
    let i = from;
    while (i < questions.length && shownIds.has(questions[i].id)) i++;
    return i;
  }

  // Shared by "next" and "teach_continue": if a detour is active, step
  // out of it (into whatever's next in detourQueue, or back to flat
  // sequence if empty). Otherwise advance the flat pointer, skipping
  // anything already shown via an earlier detour.
  function advance() {
    // A queued target takes priority over flat advancement, whether it
    // was queued while already mid-detour (chaining probe -> repair) or
    // queued just now from an ordinary flat question — both cases must
    // route into it, not silently drop it.
    if (detourQueue.length > 0) {
      const [nextId, ...rest] = detourQueue;
      setDetourQueue(rest);
      setActiveDetourId(nextId);
    } else if (activeDetourId !== null) {
      // Nothing left queued — return to flat sequence where it left off.
      setActiveDetourId(null);
      const ni = nextFlatIndex(index + 1);
      if (ni >= questions.length) setDone(true); else setIndex(ni);
    } else {
      const ni = nextFlatIndex(index + 1);
      if (ni >= questions.length) setDone(true); else setIndex(ni);
    }
    setCurrentResult(null);
    setFreeResponseGrade(null);
    setGuidedAnswers(null);
    setAllStepsRevealed(false);
    allStepsRevealedRef.current = false;
  }

  const handleAnswerAction = useCallback(async (action: AnswerAction) => {
    if (action.kind === "teach_continue") {
      // Mark seen for the progress dots, then advance — but never touch
      // resultsByIndex, xpEarned, or attempt logging, since a teach
      // interstitial is not a scored or graded event.
      setStepStatus(prev => ({ ...prev, [recordIndex]: "seen" }));
      advance();
      return;
    }

    if (action.kind === "next") {
      advance();
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
      setResultsByIndex(prev => ({
        ...prev,
        [recordIndex]: { q, picked: studentAnswer, correct: result.correct, feedback: result.feedback },
      }));
      setStepStatus(prev => ({ ...prev, [recordIndex]: result.correct ? "correct" : "wrong" }));
      if (!result.correct) { setShake(true); setTimeout(() => setShake(false), 400); }
      if (result.correct) {
        setXpEarned(prev => prev + 10);
        fireXPFloat();
        window.dispatchEvent(new Event("revily:xp-updated"));
      }
      return;
    }

    if (action.kind === "guided") {
      // Guided scaffold — graded client-side (simple normalized string
      // match per blank), logged via /api/attempt same as MCQ.
      const { blankAnswers, isCorrect } = action;
      setGuidedAnswers(blankAnswers);
      setCurrentResult(isCorrect ? "__correct__" : "__wrong__");
      if (isCorrect) {
        setAllStepsRevealed(true);
        allStepsRevealedRef.current = true;
      }
      const pickedSummary = Object.values(blankAnswers).join(", ");
      setResultsByIndex(prev => ({ ...prev, [recordIndex]: { q, picked: pickedSummary, correct: isCorrect } }));
      setStepStatus(prev => ({ ...prev, [recordIndex]: isCorrect ? "correct" : "wrong" }));
      if (!isCorrect) { setShake(true); setTimeout(() => setShake(false), 400); }
      logAttempt(q, pickedSummary, isCorrect, userId);
      if (isCorrect && userId) {
        await Promise.all([awardXP(userId), updateStreak(userId)]);
        setXpEarned(prev => prev + 10);
        fireXPFloat();
        window.dispatchEvent(new Event("revily:xp-updated"));
      }
      return;
    }

    // action.kind === "mcq"
    const key = action.key;
    const isCorrect = key === q.correct;
    setCurrentResult(key);
    if (isCorrect) {
      setAllStepsRevealed(true);
      allStepsRevealedRef.current = true;
    }
    setResultsByIndex(prev => ({ ...prev, [recordIndex]: { q, picked: key, correct: isCorrect } }));
    setStepStatus(prev => ({ ...prev, [recordIndex]: isCorrect ? "correct" : "wrong" }));
    if (!isCorrect) { setShake(true); setTimeout(() => setShake(false), 400); }
    logAttempt(q, key, isCorrect, userId, action.misconceptionCode);

    // Route D branching (doc §1.4): a wrong answer with a resolved
    // misconception code jumps to that code's diagnostic probe. If the
    // question just answered IS the probe and it was also wrong, that
    // "confirms" the pattern — jump to the matching repair instead. A
    // repair is terminal: it never triggers a further branch, per
    // "before returning to the original skill."
    if (!isCorrect && action.misconceptionCode) {
      let targetId: number | undefined;
      if (q.questionType === "diagnostic") {
        targetId = questions.find(
          qq => qq.questionType === "repair" && qq.repairForCode === action.misconceptionCode
        )?.id;
      } else if (q.questionType !== "repair") {
        targetId = questions.find(
          qq => qq.questionType === "diagnostic" && qq.probeForCode === action.misconceptionCode
        )?.id;
      }
      if (targetId !== undefined && targetId !== q.id && !shownIds.has(targetId)) {
        setDetourQueue(prev => [...prev, targetId!]);
        setShownIds(prev => new Set(prev).add(targetId!));
      }
    }

    if (isCorrect && userId) {
      await Promise.all([awardXP(userId), updateStreak(userId)]);
      setXpEarned(prev => prev + 10);
      fireXPFloat();
      window.dispatchEvent(new Event("revily:xp-updated"));
    }
  }, [q, recordIndex, userId, currentResult, index, questions, shownIds, detourQueue, activeDetourId]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      // Teach interstitials own a single "continue" action — Enter/Space
      // advances immediately, no answered-state gating like the quiz types.
      if (q?.answerType === "teach") {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleAnswerAction({ kind: "teach_continue" });
        }
        return;
      }
      // Free response / guided questions own their own input field(s) —
      // keyboard letter shortcuts (1-4, a-d) should not fire for them.
      if (q?.answerType === "free_response" || q?.answerType === "guided") {
        if ((e.key === "Enter" || e.key === " ") && currentResult) {
          e.preventDefault();
          if (allStepsRevealedRef.current) handleAnswerAction({ kind: "next" });
        }
        return;
      }
      const keyMap: Record<string, string> = { a:"A", b:"B", c:"C", d:"D", "1":"A", "2":"B", "3":"C", "4":"D" };
      const mapped = keyMap[e.key.toLowerCase()];
      if (mapped && !currentResult && q) {
        const code = misconceptions.find(
          m => m.question_id === q.id && m.wrong_option?.toUpperCase() === mapped.toUpperCase()
        )?.code;
        handleAnswerAction({ kind: "mcq", key: mapped, misconceptionCode: code });
        return;
      }
      if ((e.key === "Enter" || e.key === " ") && currentResult) {
        e.preventDefault();
        if (allStepsRevealedRef.current) handleAnswerAction({ kind: "next" });
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentResult, q, handleAnswerAction, misconceptions]);

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
          <ProgressDots
            stepStatus={stepStatus}
            total={questions.length}
            currentIndex={index}
            onDotClick={(i) => setReviewIndex(i)}
          />
        </div>

        {reviewIndex !== null ? (
          <div key={`review-${reviewIndex}`} className="pop">
            <ReviewCard
              q={questions[reviewIndex]}
              result={resultsByIndex[reviewIndex] ?? null}
              status={stepStatus[reviewIndex]}
              onClose={() => setReviewIndex(null)}
            />
          </div>
        ) : done ? (
          <ScoreScreen results={Object.values(resultsByIndex)} xpEarned={xpEarned} onHome={() => router.push("/home")} />
        ) : (
          <div key={q?.id ?? index} className="pop">
            <QuestionCard
              q={q}
              index={recordIndex}
              total={questions.length}
              userId={userId}
              onAnswerAction={handleAnswerAction}
              firstResult={currentResult}
              freeResponseGrade={freeResponseGrade}
              guidedAnswers={guidedAnswers}
              hints={hints}
              misconceptions={misconceptions}
              onAllStepsRevealed={() => {
                setAllStepsRevealed(true);
                allStepsRevealedRef.current = true;
              }}
              allStepsRevealed={allStepsRevealed}
              isDetour={activeDetourId !== null}
            />
          </div>
        )}
      </div>
    </div>
  );
}