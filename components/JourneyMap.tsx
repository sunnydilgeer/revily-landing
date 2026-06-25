"use client";

// ── JourneyMap: 5-state mastery model ───────────────────────────────────────
//
// Status precedence per skill (see resolveStatuses / computeBaseStatus):
//   Locked     — a prerequisite hasn't reached Strong/Mastered yet
//   Learning   — unlocked, no attempts yet
//   Practising — attempted, but accuracy below the 80% bar
//   Strong     — accuracy bar reached, box 1-2 in skill_review_queue
//   Mastered   — accuracy bar reached, box >= MASTERED_MIN_BOX (time-gated
//                 advancement lives in /api/attempt + lib/learningEngine)
//
// "Review due" is a separate signal (skill_review_queue.due_at <= now),
// only surfaced in the UI for Strong/Mastered skills.
// "Repeated misconception" is a separate badge, computed via a read-time
// join over attempts + misconceptions — no schema change.

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MASTERED_MIN_BOX } from "@/lib/learningEngine";

// ── Types ──────────────────────────────────────────────────────────────────
type Skill = {
  id: number;
  name: string;
  topic_area: string;
  order_index: number;
  prerequisites: number[];
};

type SkillStatus = "locked" | "learning" | "practising" | "strong" | "mastered";

type SkillWithProgress = Skill & {
  answered: number;
  correct: number;
  total: number;
  status: SkillStatus;
  reviewDue: boolean;
  box: number; // 0 = not yet in skill_review_queue
  repeatedMisconception: boolean;
};

type TopicGroup = {
  name: string;
  colour: string;
  glowColour: string;
  icon: string;
  skills: SkillWithProgress[];
};

// ── Topic config ───────────────────────────────────────────────────────────
const TOPIC_CONFIG: Record<string, { colour: string; glowColour: string; icon: string }> = {
  "Number Foundations":                   { colour: "#f9c74f", glowColour: "#f9c74f40", icon: "⟨#⟩" },
  "Fractions, Decimals and Percentages":  { colour: "#f4845f", glowColour: "#f4845f40", icon: "%" },
  "Ratio and Proportion":                 { colour: "#a78bfa", glowColour: "#a78bfa40", icon: "∶" },
  "Core Algebra":                         { colour: "#818cf8", glowColour: "#818cf840", icon: "∑" },
  "Geometry and Measure":                 { colour: "#34d399", glowColour: "#34d39940", icon: "△" },
  "Statistics and Probability":           { colour: "#60a5fa", glowColour: "#60a5fa40", icon: "≈" },
};

// ── Mastery thresholds & helpers ────────────────────────────────────────────
// A skill reaches the accuracy bar once `correct` covers at least 80% of
// its question pool. This is the same threshold the old binary "complete"
// status used — it's now the boundary between Practising and
// Strong/Mastered, AND (unchanged) the boundary for unlocking dependents.
const MASTERY_THRESHOLD_RATIO = 0.8;

function meetsMasteryThreshold(skill: { total: number; correct: number }): boolean {
  return skill.total > 0 && skill.correct >= Math.ceil(skill.total * MASTERY_THRESHOLD_RATIO);
}

// Strong and Mastered both mean "accuracy bar reached" — the difference is
// purely review-queue box (i.e. whether time-gated retrieval has happened
// since). Used for dot styling, unlock checks, and progress counters.
function isStrongOrAbove(status: SkillStatus): boolean {
  return status === "strong" || status === "mastered";
}

// Five-state classification for one skill, given its own performance +
// review-queue box. Does NOT consider prerequisites — "locked" overrides
// this in resolveStatuses below.
function computeBaseStatus(
  skill: Pick<SkillWithProgress, "answered" | "total" | "correct" | "box">
): SkillStatus {
  if (skill.answered === 0) return "learning";
  if (!meetsMasteryThreshold(skill)) return "practising";
  return skill.box >= MASTERED_MIN_BOX ? "mastered" : "strong";
}

// ── Dependency-aware status resolver ──────────────────────────────────────
// Must be called after progress AND review-queue box are computed.
// Iterates in order_index order so upstream statuses are resolved first.
//
// Unlock boundary is unchanged from the old 4-state model: a skill becomes
// available once its prerequisites meet the same 80% accuracy bar that used
// to define "complete" (now: Strong or Mastered, both of which require that
// bar). No skill that was unlockable before is now locked, or vice versa —
// only the labels either side of that boundary have changed.
function resolveStatuses(skills: SkillWithProgress[]): SkillWithProgress[] {
  const sorted = [...skills].sort((a, b) => a.order_index - b.order_index);
  const resolved = new Map<number, SkillStatus>();

  for (const skill of sorted) {
    const prereqs = skill.prerequisites ?? [];
    if (prereqs.length > 0) {
      const allMet = prereqs.every(pid => {
        const pStatus = resolved.get(pid);
        return pStatus ? isStrongOrAbove(pStatus) : false;
      });
      if (!allMet) {
        resolved.set(skill.id, "locked");
        continue;
      }
    }
    resolved.set(skill.id, computeBaseStatus(skill));
  }

  return sorted.map(skill => ({ ...skill, status: resolved.get(skill.id) ?? "locked" }));
}

// ── Review-queue lookup ─────────────────────────────────────────────────────
// Every skill_review_queue row for this user, keyed by skill_id — gives
// both the current box (drives Strong vs Mastered) and due_at (drives the
// "review due" indicator).
async function fetchReviewQueue(userId: string): Promise<Map<number, { box: number; due_at: string }>> {
  const { data, error } = await supabase
    .from("skill_review_queue")
    .select("skill_id, box, due_at")
    .eq("user_id", userId);

  if (error) {
    console.log("[JourneyMap] skill_review_queue lookup error:", error.message);
    return new Map();
  }

  console.log("[JourneyMap] review queue rows:", data);
  const map = new Map<number, { box: number; due_at: string }>();
  for (const row of data ?? []) {
    map.set(row.skill_id, { box: row.box, due_at: row.due_at });
  }
  return map;
}

// ── Misconception-repetition lookup ─────────────────────────────────────────
// Flags any skill where the SAME misconception code has been triggered on
// 2+ separate incorrect attempts. Matches HBO's "reduced repetition of the
// same misconception" mastery criterion. Read-time join — no schema change,
// since misconceptions already carries (question_id, wrong_option, code).
//
// Note: this signal is only as good as the data — if `wrong_option` is null
// on most misconceptions rows, this will rarely flag anything yet.
async function fetchMisconceptionFlags(userId: string, skillIds: number[]): Promise<Set<number>> {
  const { data: wrongAttempts, error: attemptsError } = await supabase
    .from("attempts")
    .select("question_id, answer_picked, skill_id")
    .eq("user_id", userId)
    .eq("is_correct", false)
    .in("skill_id", skillIds);

  if (attemptsError) {
    console.log("[JourneyMap] wrong-attempts lookup error:", attemptsError.message);
    return new Set();
  }
  if (!wrongAttempts?.length) return new Set();

  const questionIds = [...new Set(wrongAttempts.map(a => a.question_id))];

  const { data: misconceptionRows, error: miscError } = await supabase
    .from("misconceptions")
    .select("question_id, wrong_option, code")
    .in("question_id", questionIds);

  if (miscError) {
    console.log("[JourneyMap] misconceptions lookup error:", miscError.message);
    return new Set();
  }

  // For each wrong attempt, find which misconception (if any) it matches,
  // then count how often each code recurs per skill.
  const codeCountsBySkill = new Map<number, Map<string, number>>();
  for (const attempt of wrongAttempts) {
    if (!attempt.skill_id) continue;
    const match = (misconceptionRows ?? []).find(
      m => m.question_id === attempt.question_id &&
           m.wrong_option?.toUpperCase() === attempt.answer_picked?.toUpperCase()
    );
    if (!match) continue;

    const skillCounts = codeCountsBySkill.get(attempt.skill_id) ?? new Map<string, number>();
    skillCounts.set(match.code, (skillCounts.get(match.code) ?? 0) + 1);
    codeCountsBySkill.set(attempt.skill_id, skillCounts);
  }

  const flagged = new Set<number>();
  for (const [skillId, codeCounts] of codeCountsBySkill) {
    for (const count of codeCounts.values()) {
      if (count >= 2) { flagged.add(skillId); break; }
    }
  }

  console.log("[JourneyMap] skills with repeated misconceptions:", [...flagged]);
  return flagged;
}

// ── Spaced-repetition queue seeding ────────────────────────────────────────
// For every skill that has just reached "Strong" for the first time
// (box === 0, i.e. no skill_review_queue row yet), upsert a row at box 1,
// due tomorrow. Idempotent — ignoreDuplicates means an existing row's
// box/due_at is left untouched. Skills already Strong or Mastered with
// box > 0 are already in the queue and are skipped here.
async function seedReviewQueue(userId: string, resolved: SkillWithProgress[]) {
  const newlyStrong = resolved.filter(s => s.status === "strong" && s.box === 0);
  console.log("[JourneyMap] newly-strong skills to seed:", newlyStrong.map(s => ({ id: s.id, name: s.name })));
  if (newlyStrong.length === 0) return;

  const tomorrow = new Date(Date.now() + 86400000).toISOString();

  const { error, data } = await supabase.from("skill_review_queue").upsert(
    newlyStrong.map(s => ({
      user_id: userId,
      skill_id: s.id,
      box: 1,
      due_at: tomorrow,
    })),
    { onConflict: "user_id,skill_id", ignoreDuplicates: true }
  ).select();

  if (error) {
    console.log("[JourneyMap] skill_review_queue upsert error:", error.message);
  } else {
    console.log("[JourneyMap] skill_review_queue upsert result:", data);
  }
}

// ── Checkpoint dot ─────────────────────────────────────────────────────────
function Checkpoint({
  skill,
  colour,
  glowColour,
  index,
  onStart,
  allSkills,
}: {
  skill: SkillWithProgress;
  colour: string;
  glowColour: string;
  index: number;
  onStart: (id: number, reviewDue?: boolean) => void;
  allSkills: SkillWithProgress[];
}) {
  const isLocked     = skill.status === "locked";
  const isLearning   = skill.status === "learning";
  const isPractising = skill.status === "practising";
  const isStrong     = skill.status === "strong";
  const isMastered   = skill.status === "mastered";
  const isStrongOrMastered = isStrongOrAbove(skill.status);

  const pct = skill.total > 0 ? Math.round((skill.correct / skill.total) * 100) : 0;

  // Build a human-readable prerequisite hint for locked skills
  const lockedHint = isLocked && skill.prerequisites.length > 0
    ? skill.prerequisites
        .map(pid => allSkills.find(s => s.id === pid)?.name)
        .filter(Boolean)
        .join(", ")
    : null;

  // "Review due" only surfaces once a skill has reached Strong/Mastered —
  // a skill that's slipped back to Practising needs general practice, not
  // a scheduled retrieval check.
  const showReviewDue = isStrongOrMastered && skill.reviewDue;
  const showAction = isLearning || isPractising || showReviewDue;
  const dotSize = isLearning || isPractising ? 36 : 28;

  return (
    <div className="group flex items-center gap-4" style={{ animationDelay: `${index * 60}ms` }}>
      {/* Dot */}
      <div className="relative flex flex-col items-center" style={{ width: 40 }}>
        <button
          onClick={() => !isLocked && onStart(skill.id, showReviewDue)}
          disabled={isLocked}
          className="relative z-10 flex items-center justify-center rounded-full transition-all duration-200"
          style={{
            width: dotSize,
            height: dotSize,
            backgroundColor: isStrongOrMastered ? colour : "#1a1d27",
            border: isLocked ? "2px solid #2e3248" : `2px solid ${colour}`,
            boxShadow: !isLocked ? `0 0 12px ${glowColour}` : "none",
            cursor: isLocked ? "default" : "pointer",
          }}
        >
          {isStrongOrMastered && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7L5.5 10L11.5 4" stroke="#0f1117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {isPractising && (
            <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: colour }} />
          )}
          {isLearning && (
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: colour }} />
          )}
          {isLocked && (
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
              <rect x="1" y="5" width="8" height="7" rx="1" stroke="#2e3248" strokeWidth="1.5"/>
              <path d="M3 5V3.5a2 2 0 0 1 4 0V5" stroke="#2e3248" strokeWidth="1.5"/>
            </svg>
          )}
        </button>

        {/* Mastered marker — small star, bottom-right of the dot */}
        {isMastered && (
          <div
            className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#0f1117]"
            style={{ backgroundColor: "#f9c74f" }}
            title="Mastered"
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M4 0L5.1 2.6L8 3L5.8 5L6.3 8L4 6.5L1.7 8L2.2 5L0 3L2.9 2.6L4 0Z" fill="#0f1117"/>
            </svg>
          </div>
        )}

        {/* Review-due indicator — top-right of the dot */}
        {showReviewDue && (
          <div
            className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full border border-[#0f1117]"
            style={{ backgroundColor: "#f87171" }}
            title="Review due"
          />
        )}
      </div>

      {/* Label card */}
      <button
        onClick={() => !isLocked && onStart(skill.id, showReviewDue)}
        disabled={isLocked}
        className="flex flex-1 items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200"
        style={{
          borderColor: isLocked ? "#1e2130" : showReviewDue ? "#f8717150" : `${colour}30`,
          backgroundColor: isLocked
            ? "#13151f"
            : isStrongOrMastered
            ? `${colour}10`
            : isPractising
            ? `${colour}08`
            : "#1a1d27",
          cursor: isLocked ? "default" : "pointer",
          opacity: isLocked ? 0.45 : 1,
        }}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <div
              className="text-sm font-semibold leading-tight"
              style={{
                color: isLocked ? "#3a3f58" : isStrongOrMastered ? colour : "#f1f0ee",
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
            >
              {skill.name}
            </div>
            {!isLocked && skill.repeatedMisconception && (
              <span className="text-xs" title="A specific misconception keeps coming up here">
                ⚠️
              </span>
            )}
          </div>

          {/* Sublabel */}
          {isLocked && lockedHint && (
            <div className="mt-0.5 text-xs text-[#3a3f58]">
              Requires: {lockedHint}
            </div>
          )}
          {!isLocked && showReviewDue && (
            <div className="mt-0.5 text-xs font-semibold text-[#f87171]">
              ⟲ Review due
            </div>
          )}
          {!isLocked && !showReviewDue && skill.total > 0 && (
            <div className="mt-0.5 text-xs text-[#555a73]">
              {isMastered
                ? `${pct}% — mastered`
                : isStrong
                ? `${pct}% — strong`
                : isPractising
                ? `${skill.correct}/${skill.total} correct`
                : `${skill.total} questions`}
            </div>
          )}
          {!isLocked && skill.total === 0 && (
            <div className="mt-0.5 text-xs text-[#555a73]">Coming soon</div>
          )}
        </div>

        {/* Mini progress bar for practising */}
        {isPractising && skill.total > 0 && (
          <div className="ml-3 h-1 w-16 flex-shrink-0 overflow-hidden rounded-full bg-[#2e3248]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: colour }}
            />
          </div>
        )}

        {showAction && (
          <span className="ml-3 flex-shrink-0 text-xs" style={{ color: showReviewDue ? "#f87171" : colour }}>→</span>
        )}
      </button>
    </div>
  );
}

// ── Main JourneyMap component ──────────────────────────────────────────────
export function JourneyMap({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [groups, setGroups] = useState<TopicGroup[]>([]);
  const [allSkills, setAllSkills] = useState<SkillWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set(["Number"]));
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    async function load() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id ?? null;

      const { data: skillsData } = await supabase
        .from("skills")
        .select("id, name, topic_area, order_index, prerequisites")
        .order("order_index");

      if (!skillsData?.length) { setLoading(false); return; }

      const { data: qCounts } = await supabase
        .from("questions")
        .select("skill_id")
        .in("skill_id", skillsData.map(s => s.id));

      let attemptData: any[] = [];
      if (userId) {
        const { data } = await supabase
          .from("attempts")
          .select("question_id, is_correct, questions(skill_id)")
          .eq("user_id", userId)
          .order("created_at", { ascending: true });
        attemptData = data ?? [];
      }

      // Review-queue state (box + due_at) for every skill the user has
      // started reviewing.
      const reviewMap = userId
        ? await fetchReviewQueue(userId)
        : new Map<number, { box: number; due_at: string }>();

      // Build progress. attemptData is ordered oldest-first, so "first
      // attempt" in the dedup loop below is genuinely chronological.
      const withProgress: SkillWithProgress[] = skillsData.map(skill => {
        const total = qCounts?.filter(q => q.skill_id === skill.id).length ?? 0;
        const myAttempts = attemptData.filter((a: any) => a.questions?.skill_id === skill.id);
        const seenIds = new Set<number>();
        let answered = 0; let correct = 0;
        for (const a of myAttempts) {
          if (!seenIds.has(a.question_id)) {
            seenIds.add(a.question_id);
            answered++;
            if (a.is_correct) correct++;
          }
        }
        const reviewEntry = reviewMap.get(skill.id);
        return {
          ...skill,
          prerequisites: skill.prerequisites ?? [],
          total, answered, correct,
          status: "learning" as const, // placeholder — overwritten below
          reviewDue: reviewEntry ? new Date(reviewEntry.due_at) <= new Date() : false,
          box: reviewEntry?.box ?? 0,
          repeatedMisconception: false, // placeholder — filled in below
        };
      });

      // Resolve 5-state statuses using the dependency graph + review-queue box
      let resolved = resolveStatuses(withProgress);

      // Flag skills where the same misconception has come up repeatedly
      if (userId) {
        const flagged = await fetchMisconceptionFlags(userId, skillsData.map(s => s.id));
        resolved = resolved.map(s => ({ ...s, repeatedMisconception: flagged.has(s.id) }));
      }

      setAllSkills(resolved);

      // Seed spaced-repetition queue for skills that have just reached
      // "Strong" for the first time. Fire-and-forget — doesn't block the
      // UI, and ignoreDuplicates makes this safe to call on every load.
      if (userId) {
        seedReviewQueue(userId, resolved).catch(() => {
          // Non-critical — a missed seed just means that skill enters the
          // queue on a later visit instead.
        });
      }

      // Auto-expand topic containing first active skill
      const firstActive = resolved.find(s => s.status === "learning" || s.status === "practising");
      if (firstActive) setExpandedTopics(new Set([firstActive.topic_area]));

      // Group by topic
      const topicOrder = [
        "Number Foundations",
        "Fractions, Decimals and Percentages",
        "Ratio and Proportion",
        "Core Algebra",
        "Geometry and Measure",
        "Statistics and Probability",
      ];
            const grouped: TopicGroup[] = topicOrder
        .map(topic => {
          const cfg = TOPIC_CONFIG[topic] ?? { colour: "#8a8fa8", glowColour: "#8a8fa840", icon: "○" };
          return {
            name: topic,
            ...cfg,
            skills: resolved.filter(s => s.topic_area === topic),
          };
        })
        .filter(g => g.skills.length > 0);

      setGroups(grouped);
      setLoading(false);
    }
    load();
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  function toggleTopic(topic: string) {
    setExpandedTopics(prev => {
      const next = new Set(prev);
      next.has(topic) ? next.delete(topic) : next.add(topic);
      return next;
    });
  }

  function handleStart(skillId: number, reviewDue?: boolean) {
    onClose();
    const suffix = reviewDue ? "&review=true" : "";
    router.push(`/practice?skill=${skillId}${suffix}`);
  }

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex justify-end"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="relative flex h-full w-full max-w-md flex-col overflow-hidden"
        style={{
          backgroundColor: "#0d0f17",
          borderLeft: "1px solid #2e3248",
          animation: "slideIn 0.25s ease-out",
        }}
      >
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
          @keyframes fadeUp {
            from { transform: translateY(8px); opacity: 0; }
            to   { transform: translateY(0);   opacity: 1; }
          }
          .checkpoint-row { animation: fadeUp 0.3s ease-out both; }
        `}</style>

        {/* Header */}
        <div className="flex-shrink-0 border-b border-[#2e3248] px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div
                className="text-lg font-extrabold text-[#f1f0ee]"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                GCSE Foundation Journey
              </div>
              <div className="mt-0.5 text-xs text-[#555a73]">
                Your path through the full curriculum
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2e3248] bg-[#1a1d27] text-[#8a8fa8] transition-colors hover:text-[#f1f0ee]"
            >
              ✕
            </button>
          </div>

          {/* Overall progress */}
          {!loading && groups.length > 0 && (() => {
            const all = groups.flatMap(g => g.skills);
            const done = all.filter(s => isStrongOrAbove(s.status)).length;
            const pct = Math.round((done / all.length) * 100);
            return (
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-[#555a73]">
                  <span>{done} of {all.length} skills complete</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#2e3248]">
                  <div
                    className="h-full rounded-full bg-[#f9c74f] transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })()}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="text-sm text-[#555a73]">Loading your journey…</div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {groups.map(group => {
                const isExpanded = expandedTopics.has(group.name);
                const doneCount = group.skills.filter(s => isStrongOrAbove(s.status)).length;
                const hasActive = group.skills.some(s => s.status === "practising" || s.status === "learning");

                return (
                  <div key={group.name} className="overflow-hidden rounded-2xl border border-[#1e2130]">
                    {/* Topic header */}
                    <button
                      onClick={() => toggleTopic(group.name)}
                      className="flex w-full items-center justify-between px-4 py-3.5 transition-colors hover:bg-[#1a1d27]"
                      style={{ backgroundColor: "#13151f" }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
                          style={{
                            backgroundColor: `${group.colour}15`,
                            color: group.colour,
                            fontFamily: "'Bricolage Grotesque', sans-serif",
                            border: `1px solid ${group.colour}30`,
                          }}
                        >
                          {group.icon}
                        </div>
                        <div className="text-left">
                          <div
                            className="text-sm font-bold text-[#f1f0ee]"
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                          >
                            {group.name}
                          </div>
                          <div className="text-xs text-[#555a73]">
                            {doneCount}/{group.skills.length} complete
                            {hasActive && !isExpanded && (
                              <span style={{ color: group.colour }}> · active</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-12 overflow-hidden rounded-full bg-[#2e3248]">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.round((doneCount / group.skills.length) * 100)}%`,
                              backgroundColor: group.colour,
                            }}
                          />
                        </div>
                        <span
                          className="text-xs text-[#555a73] transition-transform duration-200"
                          style={{
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            display: "inline-block",
                          }}
                        >
                          ▾
                        </span>
                      </div>
                    </button>

                    {/* Skills list */}
                    {isExpanded && (
                      <div className="flex flex-col gap-2 px-4 pb-4 pt-3" style={{ backgroundColor: "#0f1117" }}>
                        <div className="relative">
                          <div
                            className="absolute left-[19px] top-4 bottom-4 w-px"
                            style={{ backgroundColor: `${group.colour}20` }}
                          />
                          <div className="flex flex-col gap-2.5">
                            {group.skills.map((skill, i) => (
                              <div
                                key={skill.id}
                                className="checkpoint-row"
                                style={{ animationDelay: `${i * 50}ms` }}
                              >
                                <Checkpoint
                                  skill={skill}
                                  colour={group.colour}
                                  glowColour={group.glowColour}
                                  index={i}
                                  onStart={handleStart}
                                  allSkills={allSkills}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}