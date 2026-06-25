// app/generate/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import MathText from "@/components/MathText";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";

type Skill = { id: number; name: string };

// question_type is now part of every generated question
type GeneratedQuestion = {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  worked_solution: string;
  difficulty: string;
  question_type: "fluency" | "worded" | "exam_style" | "mixed_review";
  hints: string[];
  misconceptions: {
    wrong_option: string;
    title: string;
    description: string;
  }[];
};

type ReviewQuestion = GeneratedQuestion & {
  status: "pending" | "approved" | "rejected";
};

// ── Question type display config ───────────────────────────────────────────
const QUESTION_TYPE_CONFIG: Record<string, { label: string; colour: string; bg: string; border: string }> = {
  fluency:      { label: "Fluency",      colour: "#60a5fa", bg: "#60a5fa10", border: "#60a5fa30" },
  worded:       { label: "Worded",       colour: "#34d399", bg: "#34d39910", border: "#34d39930" },
  application:  { label: "Application",  colour: "#a78bfa", bg: "#a78bfa10", border: "#a78bfa30" },
  mixed_review: { label: "Mixed Review", colour: "#f9c74f", bg: "#f9c74f10", border: "#f9c74f30" },
  repair:       { label: "Repair",       colour: "#f87171", bg: "#f8717110", border: "#f8717130" },
  retrieval:    { label: "Retrieval",    colour: "#4ade80", bg: "#4ade8010", border: "#4ade8030" },
  diagnostic:   { label: "Diagnostic",  colour: "#f4845f", bg: "#f4845f10", border: "#f4845f30" },
};

// ── Shared UI ──────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-widest text-[#555a73] mb-1">
      {children}
    </label>
  );
}

function Select({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full rounded-xl border border-[#2e3248] bg-[#0f1117] px-3 py-2 text-sm text-[#f1f0ee] focus:border-[#f9c74f] focus:outline-none transition-colors">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function Btn({ onClick, children, variant = "primary", disabled }: {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "danger" | "success";
  disabled?: boolean;
}) {
  const styles = {
    primary: "bg-[#f9c74f] text-[#0f1117] hover:opacity-90",
    ghost:   "border border-[#2e3248] text-[#8a8fa8] hover:text-[#f1f0ee] hover:border-[#f9c74f40]",
    danger:  "border border-[#f8717144] text-[#f87171] hover:bg-[#f8717115]",
    success: "bg-[#4ade80] text-[#0d1f15] hover:opacity-90",
  };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${styles[variant]} disabled:opacity-40`}
      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
      {children}
    </button>
  );
}

function Card({ children, dimmed }: { children: React.ReactNode; dimmed?: boolean }) {
  return (
    <div className={`rounded-2xl border border-[#2e3248] bg-[#1a1d27] p-5 transition-opacity ${dimmed ? "opacity-40" : ""}`}>
      {children}
    </div>
  );
}

// ── Question type badge ────────────────────────────────────────────────────
function QuestionTypeBadge({ type }: { type: string }) {
  const cfg = QUESTION_TYPE_CONFIG[type] ?? {
    label: type,
    colour: "#8a8fa8",
    bg: "#8a8fa810",
    border: "#8a8fa830",
  };
  return (
    <span
      className="rounded-full border px-2 py-0.5 text-xs font-semibold"
      style={{ color: cfg.colour, backgroundColor: cfg.bg, borderColor: cfg.border }}
    >
      {cfg.label}
    </span>
  );
}

// ── Question preview card ──────────────────────────────────────────────────
function QuestionPreview({ q, index, onApprove, onReject }: {
  q: ReviewQuestion;
  index: number;
  onApprove: () => void;
  onReject: () => void;
}) {
  const [showWorked, setShowWorked] = useState(false);
  const optionLabels = ["a", "b", "c", "d"] as const;

  const statusBadge = {
    pending:  { label: "Pending review", color: "text-[#8a8fa8] border-[#2e3248]" },
    approved: { label: "✓ Approved",     color: "text-[#4ade80] border-[#4ade8044]" },
    rejected: { label: "✗ Rejected",     color: "text-[#f87171] border-[#f8717144]" },
  }[q.status];

  return (
    <Card dimmed={q.status === "rejected"}>
      <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-[#555a73]">Q{index + 1}</span>
          <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${statusBadge.color}`}>
            {statusBadge.label}
          </span>
          <span className="rounded-full bg-[#f9c74f15] border border-[#f9c74f30] px-2 py-0.5 text-xs text-[#f9c74f] capitalize">
            {q.difficulty}
          </span>
          {/* Question type badge — the new addition */}
          {q.question_type && <QuestionTypeBadge type={q.question_type} />}
        </div>
        {q.status === "pending" && (
          <div className="flex gap-2">
            <Btn onClick={onApprove} variant="success">✓ Approve</Btn>
            <Btn onClick={onReject} variant="danger">✗ Reject</Btn>
          </div>
        )}
      </div>

      <div className="mb-4 text-base font-bold text-[#f1f0ee] leading-snug"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
        <MathText text={q.question_text} />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        {optionLabels.map(opt => {
          const isCorrect = q.correct_option.toLowerCase() === opt;
          return (
            <div key={opt}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                isCorrect
                  ? "border-[#4ade8044] bg-[#4ade8010] text-[#4ade80]"
                  : "border-[#2e3248] text-[#8a8fa8]"
              }`}>
              <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                isCorrect ? "bg-[#4ade80] text-[#0d1f15]" : "bg-[#2e3248] text-[#8a8fa8]"
              }`} style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                {opt.toUpperCase()}
              </span>
              <MathText text={(q as any)[`option_${opt}`]} />
            </div>
          );
        })}
      </div>

      {q.hints && q.hints.length > 0 && (
        <div className="mb-4 flex flex-col gap-2">
          {q.hints.map((hint, i) => (
            <div key={i} className="rounded-xl border border-[#f9c74f22] bg-[#f9c74f08] px-3 py-2 flex items-start gap-2">
              <span className="text-xs font-bold text-[#f9c74f] flex-shrink-0">💡 {i + 1}</span>
              <div className="text-xs text-[#f9c74f]"><MathText text={hint} /></div>
            </div>
          ))}
        </div>
      )}

      {q.misconceptions && q.misconceptions.length > 0 && (
        <div className="mb-4 flex flex-col gap-2">
          {q.misconceptions.map((m, i) => (
            <div key={i} className="rounded-xl border border-[#f8717122] bg-[#f871710a] px-3 py-2">
              <div className="text-xs font-bold text-[#f87171] mb-0.5">
                ⚠ Option {m.wrong_option.toUpperCase()}: {m.title}
              </div>
              <div className="text-xs text-[#c88]">
                <MathText text={m.description} />
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setShowWorked(s => !s)}
        className="text-xs text-[#818cf8] hover:opacity-80 transition-opacity mb-2"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        {showWorked ? "Hide worked solution ↑" : "Preview worked solution ↓"}
      </button>

      {showWorked && (
        <div className="rounded-xl border border-[#818cf833] bg-[#818cf808] px-4 py-3">
          <pre className="whitespace-pre-wrap font-mono text-xs text-[#a5b4fc] leading-relaxed">
            {q.worked_solution}
          </pre>
        </div>
      )}
    </Card>
  );
}

// ── Main generate page ─────────────────────────────────────────────────────
export default function GeneratePage() {
  const [authed, setAuthed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("revily_admin") === "1";
  });
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillId, setSkillId] = useState<string>("");
  const [difficulty, setDifficulty] = useState("foundation");
  const [count, setCount] = useState("5");
  const [questionType, setQuestionType] = useState("mixed");

  // Paper upload state
  const [paperFile, setPaperFile] = useState<File | null>(null);
  const [paperBase64, setPaperBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);

  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<string | null>(null);

  useEffect(() => {
    if (authed) {
      supabase.from("skills").select("id, name").order("id")
        .then(({ data }) => {
          if (data) { setSkills(data); setSkillId(String(data[0]?.id ?? "")); }
        });
    }
  }, [authed]);

  function handleLogin() {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("revily_admin", "1");
      setAuthed(true); setPwError(false);
    } else {
      setPwError(true);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPaperFile(file);
    setPaperBase64(null);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setPaperBase64(base64);
    };
    reader.readAsDataURL(file);
  }

  function clearPaper() {
    setPaperFile(null);
    setPaperBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleGenerate() {
    const skill = skills.find(s => String(s.id) === skillId);
    if (!skill) return;

    setGenerating(true);
    setGenerationError(null);
    setQuestions([]);
    setSaveResult(null);

    let text = "";
    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillName: skill.name,
          difficulty,
          count,
          questionType,
          paperBase64: paperBase64 ?? undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setGenerationError(data?.error?.message ?? "API error. Check your key.");
        setGenerating(false);
        return;
      }

      text = data.content
        .filter((b: any) => b.type === "text")
        .map((b: any) => b.text)
        .join("");

      const clean = text.replace(/```json|```/gi, "").trim();
      const parsed: GeneratedQuestion[] = JSON.parse(clean);

      setQuestions(parsed.map(q => ({ ...q, status: "pending" })));
    } catch (err) {
      console.error("Raw text was:", text);
      console.error("Parse error:", err);
      setGenerationError("Failed to parse response. Try generating again.");
    }

    setGenerating(false);
  }

  async function handleSaveApproved() {
    const approved = questions.filter(q => q.status === "approved");
    if (!approved.length) return;

    setSaving(true);
    setSaveResult(null);

    let inserted = 0;
    let failed = 0;

    for (const q of approved) {
      const { data: qData, error: qErr } = await supabase
        .from("questions")
        .insert({
          skill_id: parseInt(skillId),
          question_text: q.question_text,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          correct_option: q.correct_option,
          worked_solution: q.worked_solution,
          difficulty: q.difficulty,
          question_type: q.question_type, // ← new field saved here
        })
        .select("id")
        .single();

      if (qErr || !qData) { failed++; continue; }

      const questionId = qData.id;

      if (q.hints?.length > 0) {
        await supabase.from("hints").insert(
          q.hints.map((hint, i) => ({
            question_id: questionId,
            hint_text: hint,
            order_index: i,
          }))
        );
      }

      if (q.misconceptions?.length > 0) {
        await supabase.from("misconceptions").insert(
          q.misconceptions.map((m, i) => ({
            skill_id: parseInt(skillId),
            question_id: questionId,
            wrong_option: m.wrong_option,
            code: `GEN_${questionId}_${m.wrong_option.toUpperCase()}`,
            title: m.title,
            description: m.description,
            example_wrong_answer: "",
            example_wrong_thinking: "",
            diagnostic_meaning: "",
            order_index: i,
          }))
        );
      }

      inserted++;
    }

    setSaving(false);
    setSaveResult(
      failed === 0
        ? `✓ ${inserted} question${inserted !== 1 ? "s" : ""} saved to Supabase.`
        : `Saved ${inserted}, failed ${failed}. Check console.`
    );
    setQuestions(prev => prev.filter(q => q.status !== "approved"));
  }

  const approvedCount = questions.filter(q => q.status === "approved").length;
  const pendingCount  = questions.filter(q => q.status === "pending").length;

  // Type breakdown for the results summary bar
  const typeCounts = questions.reduce<Record<string, number>>((acc, q) => {
    if (q.question_type) acc[q.question_type] = (acc[q.question_type] ?? 0) + 1;
    return acc;
  }, {});

  const diffOptions = [
    { label: "Foundation", value: "foundation" },
    { label: "Crossover",  value: "crossover"  },
    { label: "Higher",     value: "higher"      },
  ];
  const countOptions = ["3","5","8","10"].map(v => ({ label: v + " questions", value: v }));
  const typeOptions = [
    { label: "Mixed (Claude decides)",  value: "mixed"        },
    { label: "Fluency",                 value: "fluency"      },
    { label: "Worded",                  value: "worded"       },
    { label: "Application",             value: "application"  },
    { label: "Mixed Review",            value: "mixed_review" },
    { label: "Repair",                  value: "repair"       },
    { label: "Retrieval",               value: "retrieval"    },
    { label: "Diagnostic",              value: "diagnostic"   },
  ];

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1117] px-4"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="w-full max-w-sm rounded-2xl border border-[#2e3248] bg-[#1a1d27] p-8">
          <div className="mb-6 text-center">
            <div className="mb-1 text-2xl font-extrabold text-[#f9c74f]"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Revily Admin</div>
            <div className="text-xs text-[#555a73]">Content management</div>
          </div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-[#555a73] mb-1">Password</label>
          <input type="password" value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Enter admin password"
            className="w-full rounded-xl border border-[#2e3248] bg-[#0f1117] px-3 py-2 text-sm text-[#f1f0ee] placeholder-[#555a73] focus:border-[#f9c74f] focus:outline-none transition-colors mb-3"
          />
          {pwError && <div className="mb-3 text-xs text-[#f87171]">Incorrect password.</div>}
          <button onClick={handleLogin}
            className="w-full rounded-full bg-[#f9c74f] py-2.5 text-sm font-bold text-[#0f1117] transition-opacity hover:opacity-90"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117] px-4 pb-16 pt-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mx-auto max-w-4xl">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-2xl font-extrabold text-[#f9c74f]"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Generate Questions
            </div>
            <div className="text-xs text-[#555a73]">AI-powered question authoring</div>
          </div>
          <a href="/admin" className="text-xs text-[#555a73] hover:text-[#f1f0ee] transition-colors">
            ← Back to admin
          </a>
        </div>

        {/* Generator form */}
        <div className="mb-8 rounded-2xl border border-[#2e3248] bg-[#1a1d27] p-6">
          <div className="mb-4 text-sm font-bold text-[#f9c74f]"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Configure generation
          </div>

          <div className="grid gap-4 sm:grid-cols-2 mb-4">
            <div>
              <Label>Topic / Skill</Label>
              <Select
                value={skillId}
                onChange={setSkillId}
                options={skills.map(s => ({ label: s.name, value: String(s.id) }))}
              />
            </div>
            <div>
              <Label>Difficulty</Label>
              <Select value={difficulty} onChange={setDifficulty} options={diffOptions} />
            </div>
            <div>
              <Label>Question type</Label>
              <Select value={questionType} onChange={setQuestionType} options={typeOptions} />
            </div>
            <div>
              <Label>Number of questions</Label>
              <Select value={count} onChange={setCount} options={countOptions} />
            </div>
          </div>

          {/* Past paper upload */}
          <div className="mb-5">
            <Label>Past paper style reference (optional)</Label>
            {!paperFile ? (
              <label className="flex items-center gap-3 w-full cursor-pointer rounded-xl border border-dashed border-[#2e3248] bg-[#0f1117] px-4 py-3 text-sm text-[#555a73] hover:border-[#f9c74f40] hover:text-[#8a8fa8] transition-colors">
                <span>📄</span>
                <span>Upload AQA / Edexcel past paper PDF</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-[#4ade8044] bg-[#4ade8010] px-4 py-3">
                <span className="text-sm">📄</span>
                <span className="flex-1 text-sm text-[#4ade80] truncate">{paperFile.name}</span>
                {!paperBase64 && <span className="text-xs text-[#555a73]">Reading…</span>}
                {paperBase64 && <span className="text-xs text-[#4ade80]">✓ Ready</span>}
                <button onClick={clearPaper} className="text-xs text-[#555a73] hover:text-[#f87171] transition-colors">
                  Remove
                </button>
              </div>
            )}
            <p className="mt-1.5 text-xs text-[#555a73]">
              Claude will match the phrasing, style, and complexity of the uploaded paper.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleGenerate}
              disabled={generating || !skillId}
              className="rounded-full bg-[#f9c74f] px-6 py-2.5 text-sm font-bold text-[#0f1117] transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              {generating ? "Generating…" : "⚡ Generate questions"}
            </button>
            {generating && (
              <span className="text-xs text-[#555a73]">
                {paperBase64 ? "Analysing paper + generating… 20–35s" : "This takes 10–20 seconds…"}
              </span>
            )}
          </div>

          {generationError && (
            <div className="mt-3 rounded-xl border border-[#f87171] bg-[#1e0f0f] px-4 py-3 text-xs text-[#f87171]">
              {generationError}
            </div>
          )}
        </div>

        {/* Results */}
        {questions.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap text-xs text-[#8a8fa8]">
                <span>{questions.length} generated</span>
                <span className="text-[#4ade80]">✓ {approvedCount} approved</span>
                <span className="text-[#555a73]">{pendingCount} pending</span>
                {/* Type breakdown — useful at a glance when "Mixed" was selected */}
                {Object.entries(typeCounts).map(([type, n]) => {
                  const cfg = QUESTION_TYPE_CONFIG[type];
                  return cfg ? (
                    <span key={type} style={{ color: cfg.colour }}>
                      {n} {cfg.label.toLowerCase()}
                    </span>
                  ) : null;
                })}
              </div>
              <div className="flex items-center gap-3">
                {approvedCount > 0 && (
                  <button
                    onClick={handleSaveApproved}
                    disabled={saving}
                    className="rounded-full bg-[#4ade80] px-5 py-2 text-xs font-bold text-[#0d1f15] transition-opacity hover:opacity-90 disabled:opacity-40"
                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                  >
                    {saving ? "Saving…" : `Save ${approvedCount} approved →`}
                  </button>
                )}
              </div>
            </div>

            {saveResult && (
              <div className={`mb-4 rounded-xl border px-4 py-3 text-xs ${
                saveResult.startsWith("✓")
                  ? "border-[#4ade8044] bg-[#4ade8010] text-[#4ade80]"
                  : "border-[#f8717144] bg-[#f871710a] text-[#f87171]"
              }`}>
                {saveResult}
              </div>
            )}

            <div className="flex flex-col gap-4">
              {questions.map((q, i) => (
                <QuestionPreview
                  key={i} q={q} index={i}
                  onApprove={() => setQuestions(prev =>
                    prev.map((x, j) => j === i ? { ...x, status: "approved" } : x)
                  )}
                  onReject={() => setQuestions(prev =>
                    prev.map((x, j) => j === i ? { ...x, status: "rejected" } : x)
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}