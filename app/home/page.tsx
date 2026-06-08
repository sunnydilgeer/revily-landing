"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// ── Types ──────────────────────────────────────────────────────────────────
type Profile = {
  xp: number;
  streak: number;
};

type Skill = {
  id: number;
  name: string;
  slug: string;
  topic_area: string;
  order_index: number;
};

type SkillProgress = {
  total: number;
  answered: number;
  correct: number;
};

type SkillCard = Skill & SkillProgress;

// ── Helpers ────────────────────────────────────────────────────────────────
function getLevel(xp: number) {
  return Math.floor(xp / 100) + 1;
}

function getXPIntoLevel(xp: number) {
  return xp % 100;
}

function getLevelLabel(xp: number) {
  const level = getLevel(xp);
  if (level <= 2) return "Newcomer";
  if (level <= 5) return "Apprentice";
  if (level <= 10) return "Solver";
  if (level <= 20) return "Expert";
  return "Master";
}

function getStreakMessage(streak: number) {
  if (streak === 0) return "Start your streak today!";
  if (streak === 1) return "Day 1 — keep it going tomorrow!";
  if (streak < 7)  return `🔥 ${streak} day streak — you're building momentum!`;
  if (streak < 30) return `🔥 ${streak} days — seriously impressive!`;
  return `🔥 ${streak} days — you're unstoppable!`;
}

// ── Progress ring ──────────────────────────────────────────────────────────
function ProgressRing({ pct }: { pct: number }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width="44" height="44" className="flex-shrink-0 -rotate-90">
      <circle cx="22" cy="22" r={r} fill="none" stroke="#2e3248" strokeWidth="3" />
      <circle
        cx="22" cy="22" r={r} fill="none"
        stroke="#f9c74f" strokeWidth="3"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

// ── Skill card ─────────────────────────────────────────────────────────────
function SkillCardComponent({
  skill,
  onStart,
}: {
  skill: SkillCard;
  onStart: (id: number) => void;
}) {
  const pct = skill.total > 0 ? Math.round((skill.correct / skill.total) * 100) : 0;
  const started = skill.answered > 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#2e3248] bg-[#1a1d27] p-5 transition-all duration-200 hover:border-[#f9c74f40] hover:bg-[#1e2130]">

      {/* Top row */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div
            className="mb-1 text-base font-bold leading-tight text-[#f1f0ee] truncate"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {skill.name}
          </div>
          <div className="inline-flex items-center rounded-full border border-[#2e3248] bg-[#22263a] px-2 py-0.5 text-xs font-semibold text-[#8a8fa8]">
            {skill.topic_area || "General"}
          </div>
        </div>
        <ProgressRing pct={pct} />
      </div>

      {/* Progress bar */}
      <div className="mb-1 flex items-center justify-between text-xs text-[#555a73]">
        <span>{skill.correct} correct</span>
        <span>{skill.total} questions</span>
      </div>
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-[#22263a]">
        <div
          className="h-full rounded-full bg-[#f9c74f] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* CTA */}
      <button
        onClick={() => onStart(skill.id)}
        className="w-full rounded-full py-2.5 text-sm font-bold transition-all duration-150"
        style={{
          fontFamily: "'Syne', sans-serif",
          backgroundColor: started ? "transparent" : "#f9c74f",
          color: started ? "#f9c74f" : "#0f1117",
          border: started ? "2px solid #f9c74f40" : "2px solid transparent",
        }}
      >
        {started ? "Continue →" : "Start →"}
      </button>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile>({ xp: 0, streak: 0 });
  const [firstName, setFirstName] = useState("there");
  const [skills, setSkills] = useState<SkillCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/auth");
        return;
      }

      // First name
      const fullName = session.user.user_metadata?.full_name || "";
      setFirstName(fullName.split(" ")[0] || "there");

      // Profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("xp, streak")
        .eq("user_id", session.user.id)
        .single();

      if (profileData) setProfile(profileData);

      // Skills — using actual columns
      const { data: skillsData } = await supabase
        .from("skills")
        .select("id, name, slug, topic_area, order_index")
        .order("order_index");

      if (!skillsData?.length) {
        setLoading(false);
        return;
      }

      // Question counts per skill
      const { data: qCounts } = await supabase
        .from("questions")
        .select("skill_id")
        .in("skill_id", skillsData.map((s) => s.id));

      // Attempts per skill for this user
      const { data: attemptData } = await supabase
        .from("attempts")
        .select("question_id, is_correct, questions(skill_id)")
        .eq("user_id", session.user.id);

      // Build skill cards
      const cards: SkillCard[] = skillsData.map((skill) => {
        const total = qCounts?.filter((q) => q.skill_id === skill.id).length ?? 0;

        const myAttempts = (attemptData ?? []).filter(
          (a: any) => a.questions?.skill_id === skill.id
        );

        // Dedupe by question_id — only count each question once (best attempt)
        const seenIds = new Set<number>();
        let answered = 0;
        let correct = 0;
        for (const a of myAttempts) {
          if (!seenIds.has(a.question_id)) {
            seenIds.add(a.question_id);
            answered++;
            if (a.is_correct) correct++;
          }
        }

        return { ...skill, total, answered, correct };
      });

      setSkills(cards);
      setLoading(false);
    }

    load();
  }, [router]);

  function handleStart(skillId: number) {
    router.push(`/practice?skill=${skillId}`);
  }

  const level = getLevel(profile.xp);
  const xpIntoLevel = getXPIntoLevel(profile.xp);
  const levelLabel = getLevelLabel(profile.xp);
  const totalAnswered = skills.reduce((acc, s) => acc + s.answered, 0);
  const totalCorrect = skills.reduce((acc, s) => acc + s.correct, 0);

  return (
    <div
      className="min-h-[calc(100vh-3.5rem)] bg-[#0f1117] px-4 pb-16 pt-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% -10%, #f9c74f30 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl">

        {/* ── Hero ── */}
        <div className="mb-10">
          <div className="mb-1 text-sm font-medium text-[#555a73]">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long", day: "numeric", month: "long",
            })}
          </div>
          <h1
            className="mb-6 text-3xl font-extrabold text-[#f1f0ee]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Welcome back, {firstName} 👋
          </h1>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

            {/* Level */}
            <div className="rounded-2xl border border-[#2e3248] bg-[#1a1d27] p-4">
              <div className="mb-1 text-xs uppercase tracking-widest text-[#555a73]">Level</div>
              <div
                className="text-2xl font-extrabold text-[#f9c74f]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {level}
              </div>
              <div className="mt-0.5 text-xs text-[#8a8fa8]">{levelLabel}</div>
            </div>

            {/* XP */}
            <div className="rounded-2xl border border-[#2e3248] bg-[#1a1d27] p-4">
              <div className="mb-1 text-xs uppercase tracking-widest text-[#555a73]">Total XP</div>
              <div
                className="text-2xl font-extrabold text-[#f9c74f]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {profile.xp}
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#2e3248]">
                <div
                  className="h-full rounded-full bg-[#f9c74f] transition-all duration-500"
                  style={{ width: `${xpIntoLevel}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-[#555a73]">{xpIntoLevel}/100 to Lv.{level + 1}</div>
            </div>

            {/* Streak */}
            <div className="rounded-2xl border border-[#2e3248] bg-[#1a1d27] p-4">
              <div className="mb-1 text-xs uppercase tracking-widest text-[#555a73]">Streak</div>
              <div
                className="text-2xl font-extrabold text-[#f1f0ee]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                🔥 {profile.streak}
              </div>
              <div className="mt-0.5 text-xs text-[#8a8fa8]">
                {profile.streak === 1 ? "day" : "days"}
              </div>
            </div>

            {/* Accuracy */}
            <div className="rounded-2xl border border-[#2e3248] bg-[#1a1d27] p-4">
              <div className="mb-1 text-xs uppercase tracking-widest text-[#555a73]">Accuracy</div>
              <div
                className="text-2xl font-extrabold text-[#f1f0ee]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {totalAnswered > 0
                  ? `${Math.round((totalCorrect / totalAnswered) * 100)}%`
                  : "—"}
              </div>
              <div className="mt-0.5 text-xs text-[#8a8fa8]">
                {totalAnswered} answered
              </div>
            </div>
          </div>

          {/* Streak message */}
          {profile.streak > 0 && (
            <div className="mt-3 rounded-xl border border-[#f9c74f20] bg-[#f9c74f08] px-4 py-2.5 text-sm text-[#f9c74f]">
              {getStreakMessage(profile.streak)}
            </div>
          )}
        </div>

        {/* ── Skills ── */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2
              className="text-lg font-extrabold text-[#f1f0ee]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Your Skills
            </h2>
            <div className="text-xs text-[#555a73]">
              {skills.filter((s) => s.answered > 0).length} of {skills.length} started
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 animate-pulse rounded-2xl border border-[#2e3248] bg-[#1a1d27]"
                />
              ))}
            </div>
          ) : skills.length === 0 ? (
            <div className="rounded-2xl border border-[#2e3248] bg-[#1a1d27] px-6 py-12 text-center">
              <div className="mb-2 text-3xl">📚</div>
              <div className="text-sm text-[#8a8fa8]">
                No skills yet — ask your teacher to add some content.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => (
                <SkillCardComponent
                  key={skill.id}
                  skill={skill}
                  onStart={handleStart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}