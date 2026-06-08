"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// ── Types ──────────────────────────────────────────────────────────────────
type Skill = {
  id: number;
  name: string;
  topic_area: string;
  order_index: number;
  prerequisites: number[];
};

type SkillWithProgress = Skill & {
  answered: number;
  correct: number;
  total: number;
  status: "locked" | "available" | "started" | "complete";
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
  Number:     { colour: "#f9c74f", glowColour: "#f9c74f40", icon: "⟨#⟩" },
  Algebra:    { colour: "#a78bfa", glowColour: "#a78bfa40", icon: "∑" },
  Geometry:   { colour: "#34d399", glowColour: "#34d39940", icon: "△" },
  Statistics: { colour: "#60a5fa", glowColour: "#60a5fa40", icon: "≈" },
};

// ── Dependency-aware status resolver ──────────────────────────────────────
// Must be called after progress is computed so we can check completion.
// Iterates in order_index order so upstream statuses are resolved first.
function resolveStatuses(skills: SkillWithProgress[]): SkillWithProgress[] {
  // Work on a map so we can look up resolved status by id
  const byId = new Map<number, SkillWithProgress>();
  for (const s of skills) byId.set(s.id, s);

  // Sort by order_index so prerequisites are resolved before dependents
  const sorted = [...skills].sort((a, b) => a.order_index - b.order_index);

  const resolved = new Map<number, SkillWithProgress["status"]>();

  for (const skill of sorted) {
    // Already complete (≥80% correct, at least 1 question attempted)
    if (skill.total > 0 && skill.correct >= Math.ceil(skill.total * 0.8)) {
      resolved.set(skill.id, "complete");
      continue;
    }
    // In progress
    if (skill.answered > 0) {
      resolved.set(skill.id, "started");
      continue;
    }
    // Check prerequisites
    const prereqs = skill.prerequisites ?? [];
    if (prereqs.length === 0) {
      // No prerequisites — always available
      resolved.set(skill.id, "available");
      continue;
    }
    // All prerequisites must be complete
    const allMet = prereqs.every(pid => resolved.get(pid) === "complete");
    resolved.set(skill.id, allMet ? "available" : "locked");
  }

  return sorted.map(skill => ({ ...skill, status: resolved.get(skill.id) ?? "locked" }));
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
  onStart: (id: number) => void;
  allSkills: SkillWithProgress[];
}) {
  const isComplete  = skill.status === "complete";
  const isStarted   = skill.status === "started";
  const isLocked    = skill.status === "locked";
  const isAvailable = skill.status === "available";
  const pct = skill.total > 0 ? Math.round((skill.correct / skill.total) * 100) : 0;

  // Build a human-readable prerequisite hint for locked skills
  const lockedHint = isLocked && skill.prerequisites.length > 0
    ? skill.prerequisites
        .map(pid => allSkills.find(s => s.id === pid)?.name)
        .filter(Boolean)
        .join(", ")
    : null;

  return (
    <div className="group flex items-center gap-4" style={{ animationDelay: `${index * 60}ms` }}>
      {/* Dot */}
      <div className="relative flex flex-col items-center" style={{ width: 40 }}>
        <button
          onClick={() => !isLocked && onStart(skill.id)}
          disabled={isLocked}
          className="relative z-10 flex items-center justify-center rounded-full transition-all duration-200"
          style={{
            width: isAvailable || isStarted ? 36 : 28,
            height: isAvailable || isStarted ? 36 : 28,
            backgroundColor: isComplete ? colour : "#1a1d27",
            border: isLocked ? "2px solid #2e3248" : `2px solid ${colour}`,
            boxShadow: !isLocked ? `0 0 12px ${glowColour}` : "none",
            cursor: isLocked ? "default" : "pointer",
          }}
        >
          {isComplete && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7L5.5 10L11.5 4" stroke="#0f1117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {isStarted && (
            <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: colour }} />
          )}
          {isAvailable && (
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: colour }} />
          )}
          {isLocked && (
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
              <rect x="1" y="5" width="8" height="7" rx="1" stroke="#2e3248" strokeWidth="1.5"/>
              <path d="M3 5V3.5a2 2 0 0 1 4 0V5" stroke="#2e3248" strokeWidth="1.5"/>
            </svg>
          )}
        </button>
      </div>

      {/* Label card */}
      <button
        onClick={() => !isLocked && onStart(skill.id)}
        disabled={isLocked}
        className="flex flex-1 items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200"
        style={{
          borderColor: isLocked ? "#1e2130" : `${colour}30`,
          backgroundColor: isLocked
            ? "#13151f"
            : isComplete
            ? `${colour}10`
            : isStarted
            ? `${colour}08`
            : "#1a1d27",
          cursor: isLocked ? "default" : "pointer",
          opacity: isLocked ? 0.45 : 1,
        }}
      >
        <div className="min-w-0 flex-1">
          <div
            className="text-sm font-semibold leading-tight"
            style={{
              color: isLocked ? "#3a3f58" : isComplete ? colour : "#f1f0ee",
              fontFamily: "'Bricolage Grotesque', sans-serif",
            }}
          >
            {skill.name}
          </div>

          {/* Sublabel */}
          {isLocked && lockedHint && (
            <div className="mt-0.5 text-xs text-[#3a3f58]">
              Requires: {lockedHint}
            </div>
          )}
          {!isLocked && skill.total > 0 && (
            <div className="mt-0.5 text-xs text-[#555a73]">
              {isComplete
                ? `${pct}% — complete`
                : isStarted
                ? `${skill.correct}/${skill.total} correct`
                : `${skill.total} questions`}
            </div>
          )}
          {!isLocked && skill.total === 0 && (
            <div className="mt-0.5 text-xs text-[#555a73]">Coming soon</div>
          )}
        </div>

        {/* Mini progress bar for started */}
        {isStarted && skill.total > 0 && (
          <div className="ml-3 h-1 w-16 flex-shrink-0 overflow-hidden rounded-full bg-[#2e3248]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: colour }}
            />
          </div>
        )}

        {(isAvailable || isStarted) && (
          <span className="ml-3 flex-shrink-0 text-xs" style={{ color: colour }}>→</span>
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
      if (session?.user?.id) {
        const { data } = await supabase
          .from("attempts")
          .select("question_id, is_correct, questions(skill_id)")
          .eq("user_id", session.user.id);
        attemptData = data ?? [];
      }

      // Build progress
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
        return {
          ...skill,
          prerequisites: skill.prerequisites ?? [],
          total, answered, correct,
          status: "available" as const,
        };
      });

      // Resolve statuses using dependency graph
      const resolved = resolveStatuses(withProgress);
      setAllSkills(resolved);

      // Auto-expand topic containing first active skill
      const firstActive = resolved.find(s => s.status === "available" || s.status === "started");
      if (firstActive) setExpandedTopics(new Set([firstActive.topic_area]));

      // Group by topic
      const topicOrder = ["Number", "Algebra", "Geometry", "Statistics"];
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

  function handleStart(skillId: number) {
    onClose();
    router.push(`/practice?skill=${skillId}`);
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
            const done = all.filter(s => s.status === "complete").length;
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
                const doneCount = group.skills.filter(s => s.status === "complete").length;
                const hasActive = group.skills.some(s => s.status === "started" || s.status === "available");

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