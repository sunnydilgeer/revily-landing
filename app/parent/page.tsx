"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

// ── Types ──────────────────────────────────────────────────────────────────

type SkillStatus = "locked" | "learning" | "practising" | "strong" | "mastered";

interface StrandSummary {
  name: string;
  color: string;
  skills: { id: number; name: string; status: SkillStatus }[];
}

interface MisconceptionFlag {
  skillName: string;
  code: string;
  title: string;
  count: number;
}

interface ReviewDue {
  skillName: string;
  dueAt: string;
}

interface DashboardData {
  streak: number;
  lastActiveDate: string | null;
  missionsCompleted: number;
  studentName: string | null;
  skillCounts: Record<SkillStatus, number>;
  strands: StrandSummary[];
  reviewDue: ReviewDue[];
  misconceptionFlags: MisconceptionFlag[];
  loading: boolean;
  error: string | null;
}

// ── DB row types ───────────────────────────────────────────────────────────

interface QueueRow {
  skill_id: number;
  box: number;
  due_at: string;
}

interface SkillRow {
  id: number;
  name: string;
  topic_area: string | null;
  order_index: number;
  prerequisites: number[] | null;
}

interface AttemptRow {
  skill_id: number;
  is_correct: boolean;
}

// ── Config ─────────────────────────────────────────────────────────────────

const STRAND_CONFIG: Record<string, { color: string }> = {
  "Number Foundations":                   { color: "#6366f1" },
  "Fractions, Decimals and Percentages":  { color: "#2DD4BF" },
  "Ratio and Proportion":                 { color: "#f59e0b" },
  "Core Algebra":                         { color: "#ec4899" },
  "Geometry and Measure":                 { color: "#10b981" },
  "Statistics and Probability":           { color: "#8b5cf6" },
};

const STATUS_CONFIG: Record<SkillStatus, { label: string; color: string }> = {
  locked:     { label: "Upcoming",   color: "#475569" },
  learning:   { label: "Learning",   color: "#60a5fa" },
  practising: { label: "Practising", color: "#f59e0b" },
  strong:     { label: "Strong",     color: "#2DD4BF" },
  mastered:   { label: "Mastered",   color: "#a78bfa" },
};

const MASTERED_MIN_BOX = 3;
const STRONG_ACCURACY_THRESHOLD = 0.8;

// ── Main component ─────────────────────────────────────────────────────────

export default function ParentDashboard() {
  const [data, setData] = useState<DashboardData>({
    streak: 0,
    lastActiveDate: null,
    missionsCompleted: 0,
    studentName: null,
    skillCounts: { locked: 0, learning: 0, practising: 0, strong: 0, mastered: 0 },
    strands: [],
    reviewDue: [],
    misconceptionFlags: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function load() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setData(d => ({ ...d, loading: false, error: "Not signed in." }));
        return;
      }

      const userId = user.id;

      // ── Parallel fetches ──────────────────────────────────────────────

      const [profileRes, attemptsRes, skillsRes, queueRes, misconceptionsRes] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("streak, last_active_date, full_name")
            .eq("user_id", userId)
            .single(),

          supabase
            .from("attempts")
            .select("skill_id, is_correct, created_at")
            .eq("user_id", userId),

          supabase
            .from("skills")
            .select("id, name, topic_area, order_index, prerequisites")
            .order("order_index"),

          supabase
            .from("skill_review_queue")
            .select("skill_id, box, due_at")
            .eq("user_id", userId),

          supabase
            .from("attempts")
            .select("skill_id, answer_picked, misconceptions!inner(code, title, wrong_option)")
            .eq("user_id", userId)
            .eq("is_correct", false),
        ]);

      // ── Profile ───────────────────────────────────────────────────────

      const streak = profileRes.data?.streak ?? 0;
      const lastActiveDate = profileRes.data?.last_active_date ?? null;
      const studentName = (profileRes.data as any)?.full_name ?? null;

      // ── Mission count (unique active days) ────────────────────────────

      const allAttempts = (attemptsRes.data ?? []) as (AttemptRow & { created_at: string })[];
      const attemptDates = new Set(
        allAttempts.map(a => new Date(a.created_at).toISOString().slice(0, 10))
      );
      const missionsCompleted = attemptDates.size;

      // ── Accuracy map ──────────────────────────────────────────────────

      const accuracyMap = new Map<number, { correct: number; total: number }>();
      for (const a of allAttempts) {
        const sid = a.skill_id;
        if (!accuracyMap.has(sid)) accuracyMap.set(sid, { correct: 0, total: 0 });
        const entry = accuracyMap.get(sid)!;
        entry.total += 1;
        if (a.is_correct) entry.correct += 1;
      }

      // ── Skill status computation ───────────────────────────────────────

      const skills = (skillsRes.data ?? []) as SkillRow[];
      const queue = (queueRes.data ?? []) as QueueRow[];
      const queueMap = new Map<number, QueueRow>(queue.map(q => [q.skill_id, q]));
      const skillMap = new Map<number, SkillRow>(skills.map(s => [s.id, s]));
      const statusCache = new Map<number, SkillStatus>();

      function computeStatusById(id: number): SkillStatus {
        if (statusCache.has(id)) return statusCache.get(id)!;
        const skill = skillMap.get(id);
        if (!skill) return "locked";

        const prereqs = (skill.prerequisites ?? []) as number[];
        const prereqsMet = prereqs.every(pid => {
          const ps = computeStatusById(pid);
          return ps === "strong" || ps === "mastered";
        });
        if (!prereqsMet && prereqs.length > 0) {
          statusCache.set(id, "locked");
          return "locked";
        }

        const qEntry = queueMap.get(skill.id);
        const acc = accuracyMap.get(skill.id);
        const accuracy = acc && acc.total > 0 ? acc.correct / acc.total : null;
        const box = qEntry?.box ?? 1;

        let status: SkillStatus;
        if (!qEntry && (!acc || acc.total === 0)) {
          status = "learning";
        } else if (accuracy !== null && accuracy >= STRONG_ACCURACY_THRESHOLD) {
          status = box >= MASTERED_MIN_BOX ? "mastered" : "strong";
        } else if (acc && acc.total > 0) {
          status = "practising";
        } else {
          status = "learning";
        }

        statusCache.set(id, status);
        return status;
      }

      const skillStatuses: { skill: SkillRow; status: SkillStatus }[] = skills.map(skill => ({
        skill,
        status: computeStatusById(skill.id),
      }));

      // ── Skill counts ──────────────────────────────────────────────────

      const skillCounts: Record<SkillStatus, number> = {
        locked: 0, learning: 0, practising: 0, strong: 0, mastered: 0,
      };
      for (const { status } of skillStatuses) skillCounts[status]++;

      // ── Strands ───────────────────────────────────────────────────────

      const strandMap = new Map<string, StrandSummary>();
      for (const { skill, status } of skillStatuses) {
        const topic = skill.topic_area ?? "General";
        if (!strandMap.has(topic)) {
          strandMap.set(topic, {
            name: topic,
            color: STRAND_CONFIG[topic]?.color ?? "#64748b",
            skills: [],
          });
        }
        strandMap.get(topic)!.skills.push({ id: skill.id, name: skill.name, status });
      }
      const strands = Array.from(strandMap.values());

      // ── Review due ────────────────────────────────────────────────────

      const now = new Date();
      const reviewDue: ReviewDue[] = queue
        .filter(q => q.due_at && new Date(q.due_at) <= now)
        .map(q => ({
          skillName: skillMap.get(q.skill_id)?.name ?? `Skill ${q.skill_id}`,
          dueAt: q.due_at,
        }))
        .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

      // ── Misconception flags ───────────────────────────────────────────

      const miscCounts = new Map<string, { skillId: number; code: string; title: string; count: number }>();
      for (const a of misconceptionsRes.data ?? []) {
        const row = a as unknown as {
          skill_id: number;
          answer_picked: string;
          misconceptions: { code: string; title: string; wrong_option: string }[];
        };
        const { code, title, wrong_option } = row.misconceptions?.[0] ?? {};
        if (wrong_option && row.answer_picked === wrong_option && code) {
          const key = `${row.skill_id}:${code}`;
          if (!miscCounts.has(key)) {
            miscCounts.set(key, { skillId: row.skill_id, code, title, count: 0 });
          }
          miscCounts.get(key)!.count++;
        }
      }

      const misconceptionFlags: MisconceptionFlag[] = Array.from(miscCounts.values())
        .filter(m => m.count >= 2)
        .map(m => ({
          skillName: skillMap.get(m.skillId)?.name ?? `Skill ${m.skillId}`,
          code: m.code,
          title: m.title,
          count: m.count,
        }))
        .sort((a, b) => b.count - a.count);

      setData({
        streak,
        lastActiveDate,
        missionsCompleted,
        studentName,
        skillCounts,
        strands,
        reviewDue,
        misconceptionFlags,
        loading: false,
        error: null,
      });
    }

    load();
  }, []);

  if (data.loading) return <LoadingState />;
  if (data.error) return <ErrorState message={data.error} />;

  const totalSkills = Object.values(data.skillCounts).reduce((a, b) => a + b, 0);
  const progressSkills = data.skillCounts.strong + data.skillCounts.mastered;

  return (
    <div className="parent-dashboard">
      <header className="dashboard-header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-mark">R</span>
            <span className="brand-name">Revily</span>
            <span className="brand-tag">Parent View</span>
          </div>
          <div className="header-right">
            {data.studentName && (
              <span className="student-name">{data.studentName}</span>
            )}
            <div className="header-date">
              {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="stats-row">
          <StatCard value={data.streak}          unit="day streak"   label={data.streak >= 7 ? "On a roll 🔥" : "Keep it going"} accent="#f59e0b" />
          <StatCard value={data.missionsCompleted} unit="active days" label="Days with practice"       accent="#2DD4BF" />
          <StatCard value={progressSkills}        unit={`of ${totalSkills}`} label="Skills strong or mastered" accent="#a78bfa" />
        </section>

        <section className="section">
          <h2 className="section-title">Skills overview</h2>
          <div className="status-pills">
            {(Object.keys(STATUS_CONFIG) as SkillStatus[]).map(s => (
              <div key={s} className="status-pill" style={{ borderColor: STATUS_CONFIG[s].color }}>
                <span className="pill-count" style={{ color: STATUS_CONFIG[s].color }}>{data.skillCounts[s]}</span>
                <span className="pill-label">{STATUS_CONFIG[s].label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Progress by topic</h2>
          <p className="section-sub">Each bar shows all skills in a topic, coloured by mastery level</p>
          <div className="strands-list">
            {data.strands.map(strand => <StrandBar key={strand.name} strand={strand} />)}
          </div>
        </section>

        <div className="bottom-grid">
          <section className="section card">
            <h2 className="section-title">Due for review</h2>
            {data.reviewDue.length === 0
              ? <p className="empty-state">Nothing due right now — check back tomorrow.</p>
              : (
                <ul className="review-list">
                  {data.reviewDue.map((r, i) => (
                    <li key={i} className="review-item">
                      <span className="review-skill">{r.skillName}</span>
                      <span className="review-due">{formatDue(r.dueAt)}</span>
                    </li>
                  ))}
                </ul>
              )}
          </section>

          <section className="section card">
            <h2 className="section-title">
              Needs attention
              {data.misconceptionFlags.length > 0 && (
                <span className="flag-badge">{data.misconceptionFlags.length}</span>
              )}
            </h2>
            {data.misconceptionFlags.length === 0
              ? <p className="empty-state">No repeated mistakes detected yet.</p>
              : (
                <ul className="flag-list">
                  {data.misconceptionFlags.map((f, i) => (
                    <li key={i} className="flag-item">
                      <div className="flag-header">
                        <span className="flag-skill">{f.skillName}</span>
                        <span className="flag-count">×{f.count}</span>
                      </div>
                      <p className="flag-title">{f.title}</p>
                      <p className="flag-code">{f.code}</p>
                    </li>
                  ))}
                </ul>
              )}
          </section>

          <section className="section card card--locked">
            <div className="locked-icon">🔒</div>
            <h2 className="section-title">Grade 4 readiness</h2>
            <p className="locked-copy">
              This score will appear once your child has completed enough skills to make a reliable estimate. Keep practising.
            </p>
          </section>
        </div>
      </main>

      <style>{styles}</style>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function StatCard({ value, unit, label, accent }: {
  value: number; unit: string; label: string; accent: string;
}) {
  return (
    <div className="stat-card" style={{ "--accent": accent } as React.CSSProperties}>
      <div className="stat-value">
        <span className="stat-number">{value}</span>
        <span className="stat-unit">{unit}</span>
      </div>
      <p className="stat-label">{label}</p>
      <div className="stat-bar" />
    </div>
  );
}

function StrandBar({ strand }: { strand: StrandSummary }) {
  const total = strand.skills.length;
  const statusOrder: SkillStatus[] = ["mastered", "strong", "practising", "learning", "locked"];
  return (
    <div className="strand-row">
      <div className="strand-meta">
        <span className="strand-dot" style={{ background: strand.color }} />
        <span className="strand-name">{strand.name}</span>
        <span className="strand-count">{total} skills</span>
      </div>
      <div className="strand-bar-track">
        {statusOrder.map(status => {
          const count = strand.skills.filter(s => s.status === status).length;
          if (count === 0) return null;
          return (
            <div
              key={status}
              className="strand-segment"
              style={{
                width: `${(count / total) * 100}%`,
                background: STATUS_CONFIG[status].color,
                opacity: status === "locked" ? 0.2 : status === "learning" ? 0.5 : 1,
              }}
              title={`${STATUS_CONFIG[status].label}: ${count}`}
            />
          );
        })}
      </div>
      <div className="strand-legend">
        {statusOrder.map(status => {
          const count = strand.skills.filter(s => s.status === status).length;
          if (count === 0) return null;
          return (
            <span key={status} className="strand-legend-item" style={{ color: STATUS_CONFIG[status].color }}>
              {count} {STATUS_CONFIG[status].label.toLowerCase()}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="loading-shell">
      <div className="loading-spinner" />
      <p>Loading progress…</p>
      <style>{styles}</style>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="loading-shell">
      <p className="error-msg">{message}</p>
      <style>{styles}</style>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDue(dueAt: string): string {
  const diffDays = Math.floor((Date.now() - new Date(dueAt).getTime()) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap');

  .parent-dashboard { min-height: 100vh; background: #0a1628; color: #f7f5f0; font-family: 'DM Sans', system-ui, sans-serif; }

  .dashboard-header { border-bottom: 1px solid #1e293b; padding: 0 2rem; position: sticky; top: 0; background: #0a1628; z-index: 10; }
  .header-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 60px; }
  .brand { display: flex; align-items: center; gap: 10px; }
  .brand-mark { width: 32px; height: 32px; background: #2DD4BF; color: #0a1628; border-radius: 8px; display: grid; place-items: center; font-weight: 700; font-size: 1rem; font-family: 'DM Serif Display', serif; }
  .brand-name { font-weight: 600; font-size: 1.05rem; letter-spacing: -0.02em; }
  .brand-tag { font-size: 0.7rem; font-weight: 500; color: #64748b; border: 1px solid #1e293b; border-radius: 20px; padding: 2px 8px; letter-spacing: 0.04em; text-transform: uppercase; }
  .header-date { font-size: 0.85rem; color: #64748b; }
  .header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
  .student-name { font-size: 0.85rem; font-weight: 600; color: #f7f5f0; }

  .dashboard-main { max-width: 1100px; margin: 0 auto; padding: 2.5rem 2rem 4rem; }

  .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-bottom: 2.5rem; }
  .stat-card { background: #111d30; border: 1px solid #1e293b; border-radius: 16px; padding: 1.75rem; position: relative; overflow: hidden; }
  .stat-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--accent); border-radius: 0 0 16px 16px; }
  .stat-value { display: flex; align-items: baseline; gap: 6px; margin-bottom: 6px; }
  .stat-number { font-family: 'DM Serif Display', serif; font-size: 3rem; line-height: 1; color: var(--accent); }
  .stat-unit { font-size: 0.9rem; color: #94a3b8; font-weight: 500; }
  .stat-label { font-size: 0.8rem; color: #64748b; margin: 0; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }

  .section { margin-bottom: 2.5rem; }
  .section-title { font-size: 1rem; font-weight: 600; letter-spacing: -0.01em; margin: 0 0 0.35rem; display: flex; align-items: center; gap: 8px; }
  .section-sub { font-size: 0.82rem; color: #64748b; margin: 0 0 1.25rem; }

  .status-pills { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  .status-pill { border: 1px solid; border-radius: 10px; padding: 0.6rem 1rem; display: flex; flex-direction: column; align-items: center; min-width: 80px; background: #111d30; }
  .pill-count { font-family: 'DM Serif Display', serif; font-size: 1.6rem; line-height: 1; }
  .pill-label { font-size: 0.7rem; color: #94a3b8; font-weight: 500; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.05em; }

  .strands-list { display: flex; flex-direction: column; gap: 1.25rem; }
  .strand-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .strand-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .strand-name { font-size: 0.9rem; font-weight: 500; flex: 1; }
  .strand-count { font-size: 0.78rem; color: #64748b; }
  .strand-bar-track { height: 10px; border-radius: 99px; background: #1e293b; display: flex; overflow: hidden; gap: 1px; }
  .strand-segment { height: 100%; transition: width 0.4s ease; flex-shrink: 0; }
  .strand-legend { display: flex; gap: 12px; margin-top: 5px; flex-wrap: wrap; }
  .strand-legend-item { font-size: 0.72rem; font-weight: 500; }

  .bottom-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.25rem; align-items: stretch; }
  .card { background: #111d30; border: 1px solid #1e293b; border-radius: 16px; padding: 1.5rem; margin-bottom: 0; display: flex; flex-direction: column; justify-content: flex-start; }
  .card--locked { text-align: center; opacity: 0.6; border-style: dashed; justify-content: center; align-items: center; }
  .locked-icon { font-size: 1.75rem; margin-bottom: 0.75rem; }
  .locked-copy { font-size: 0.83rem; color: #64748b; line-height: 1.5; margin: 0.5rem 0 0; }

  .review-list { list-style: none; margin: 0.75rem 0 0; padding: 0; display: flex; flex-direction: column; }
  .review-item { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0; border-bottom: 1px solid #1e293b; font-size: 0.875rem; }
  .review-item:last-child { border-bottom: none; }
  .review-skill { font-weight: 500; }
  .review-due { font-size: 0.78rem; color: #f59e0b; font-weight: 500; }

  .flag-badge { background: #7f1d1d; color: #fca5a5; border-radius: 20px; padding: 1px 8px; font-size: 0.7rem; font-weight: 600; }
  .flag-list { list-style: none; margin: 0.75rem 0 0; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; }
  .flag-item { padding: 0.75rem; background: #1a0f0f; border: 1px solid #3f1515; border-radius: 10px; }
  .flag-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; }
  .flag-skill { font-size: 0.82rem; font-weight: 600; color: #f7f5f0; }
  .flag-count { font-size: 0.75rem; color: #f87171; font-weight: 600; }
  .flag-title { font-size: 0.82rem; color: #fca5a5; margin: 0 0 2px; }
  .flag-code { font-size: 0.7rem; color: #64748b; margin: 0; font-family: monospace; }

  .empty-state { font-size: 0.83rem; color: #475569; margin: 0.75rem 0 0; font-style: italic; }
  .loading-shell { min-height: 100vh; background: #0a1628; display: grid; place-items: center; font-family: 'DM Sans', system-ui, sans-serif; gap: 1rem; font-size: 0.9rem; color: #64748b; }
  .loading-spinner { width: 32px; height: 32px; border: 2px solid #1e293b; border-top-color: #2DD4BF; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .error-msg { color: #f87171; }

  @media (max-width: 768px) {
    .stats-row { grid-template-columns: 1fr; }
    .bottom-grid { grid-template-columns: 1fr; }
    .status-pills { gap: 0.5rem; }
    .status-pill { min-width: 70px; }
  }
`;