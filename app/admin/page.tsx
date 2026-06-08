"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ── Auth ───────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";

// ── Types ──────────────────────────────────────────────────────────────────
type Skill = {
  id: number;
  name: string;
  slug: string;
  order_index: number;
  topic_area: string;
};

type Question = {
  id: number;
  skill_id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  worked_solution: string;
  difficulty: string;
};

type Hint = {
  id: number;
  question_id: number;
  hint_text: string;
  order_index: number;
};

type Misconception = {
  id: number;
  skill_id: number;
  code: string;
  title: string;
  description: string;
  example_wrong_answer: string;
  example_wrong_thinking: string;
  diagnostic_meaning: string;
  order_index: number;
};

type Tab = "skills" | "questions" | "hints" | "misconceptions";

// ── Shared UI ──────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-widest text-[#555a73] mb-1">
      {children}
    </label>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: {
  value: string | number; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-[#2e3248] bg-[#0f1117] px-3 py-2 text-sm text-[#f1f0ee] placeholder-[#555a73] focus:border-[#f9c74f] focus:outline-none transition-colors"
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-xl border border-[#2e3248] bg-[#0f1117] px-3 py-2 text-sm text-[#f1f0ee] placeholder-[#555a73] focus:border-[#f9c74f] focus:outline-none transition-colors resize-none"
    />
  );
}

function Select({ value, onChange, options }: {
  value: string; onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full rounded-xl border border-[#2e3248] bg-[#0f1117] px-3 py-2 text-sm text-[#f1f0ee] focus:border-[#f9c74f] focus:outline-none transition-colors"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function Btn({ onClick, children, variant = "primary", disabled }: {
  onClick: () => void; children: React.ReactNode;
  variant?: "primary" | "ghost" | "danger"; disabled?: boolean;
}) {
  const styles = {
    primary: "bg-[#f9c74f] text-[#0f1117] hover:opacity-90",
    ghost:   "border border-[#2e3248] text-[#8a8fa8] hover:text-[#f1f0ee] hover:border-[#f9c74f40]",
    danger:  "text-[#f87171] hover:bg-[#f8717115]",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${styles[variant]} disabled:opacity-40`}
      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
    >
      {children}
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#2e3248] bg-[#1a1d27] p-5">
      {children}
    </div>
  );
}

function SectionHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-extrabold text-[#f1f0ee]"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
        {title}
      </h2>
      <Btn onClick={onAdd} variant="primary">+ Add</Btn>
    </div>
  );
}

// ── Skills tab ─────────────────────────────────────────────────────────────
function SkillsTab() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Partial<Skill> | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from("skills").select("*").order("order_index");
    if (data) setSkills(data);
  }

  useEffect(() => { load(); }, []);

  function blank(): Partial<Skill> {
    return { name: "", slug: "", order_index: 0, topic_area: "" };
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    if (editing.id) {
      await supabase.from("skills").update({
        name: editing.name, slug: editing.slug,
        order_index: editing.order_index, topic_area: editing.topic_area,
      }).eq("id", editing.id);
    } else {
      await supabase.from("skills").insert({
        name: editing.name, slug: editing.slug,
        order_index: editing.order_index, topic_area: editing.topic_area,
      });
    }
    setSaving(false);
    setEditing(null);
    load();
  }

  async function del(id: number) {
    if (!confirm("Delete this skill? All linked questions will also be deleted.")) return;
    await supabase.from("skills").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <SectionHeader title="Skills" onAdd={() => setEditing(blank())} />

      {editing && (
        <Card>
          <div className="mb-4 text-sm font-bold text-[#f9c74f]"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {editing.id ? "Edit Skill" : "New Skill"}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Name</Label>
              <Input value={editing.name ?? ""} onChange={v => setEditing(e => ({ ...e, name: v }))} placeholder="e.g. Fractions — Basics" />
            </div>
            <div><Label>Slug</Label>
              <Input value={editing.slug ?? ""} onChange={v => setEditing(e => ({ ...e, slug: v }))} placeholder="e.g. fractions-basics" />
            </div>
            <div><Label>Topic Area</Label>
              <Input value={editing.topic_area ?? ""} onChange={v => setEditing(e => ({ ...e, topic_area: v }))} placeholder="e.g. Number" />
            </div>
            <div><Label>Order Index</Label>
              <Input type="number" value={editing.order_index ?? 0} onChange={v => setEditing(e => ({ ...e, order_index: parseInt(v) }))} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Btn onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Btn>
            <Btn onClick={() => setEditing(null)} variant="ghost">Cancel</Btn>
          </div>
        </Card>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {skills.map(s => (
          <Card key={s.id}>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="font-bold text-[#f1f0ee] truncate"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{s.name}</div>
                <div className="mt-0.5 text-xs text-[#555a73]">
                  {s.topic_area} · order {s.order_index} · <span className="font-mono">{s.slug}</span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Btn onClick={() => setEditing(s)} variant="ghost">Edit</Btn>
                <Btn onClick={() => del(s.id)} variant="danger">Delete</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Questions tab ──────────────────────────────────────────────────────────
function QuestionsTab({ skills }: { skills: Skill[] }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filterSkill, setFilterSkill] = useState<string>("all");
  const [editing, setEditing] = useState<Partial<Question> | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    let q = supabase.from("questions").select("*").order("id");
    if (filterSkill !== "all") q = q.eq("skill_id", filterSkill);
    const { data } = await q;
    if (data) setQuestions(data);
  }

  useEffect(() => { load(); }, [filterSkill]);

  function blank(): Partial<Question> {
    return {
      skill_id: skills[0]?.id,
      question_text: "", option_a: "", option_b: "", option_c: "", option_d: "",
      correct_option: "a", worked_solution: "", difficulty: "foundation",
    };
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    const payload = {
      skill_id: editing.skill_id,
      question_text: editing.question_text,
      option_a: editing.option_a, option_b: editing.option_b,
      option_c: editing.option_c, option_d: editing.option_d,
      correct_option: editing.correct_option,
      worked_solution: editing.worked_solution,
      difficulty: editing.difficulty,
    };
    if (editing.id) {
      await supabase.from("questions").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("questions").insert(payload);
    }
    setSaving(false);
    setEditing(null);
    load();
  }

  async function del(id: number) {
    if (!confirm("Delete this question?")) return;
    await supabase.from("questions").delete().eq("id", id);
    load();
  }

  const skillOptions = [
    { label: "All skills", value: "all" },
    ...skills.map(s => ({ label: s.name, value: String(s.id) })),
  ];

  const diffOptions = [
    { label: "Foundation", value: "foundation" },
    { label: "Crossover", value: "crossover" },
    { label: "Higher", value: "higher" },
  ];

  const correctOptions = ["a", "b", "c", "d"].map(v => ({ label: v.toUpperCase(), value: v }));

  return (
    <div>
      <SectionHeader title="Questions" onAdd={() => setEditing(blank())} />

      <div className="mb-4 w-64">
        <Select value={filterSkill} onChange={setFilterSkill} options={skillOptions} />
      </div>

      {editing && (
        <Card>
          <div className="mb-4 text-sm font-bold text-[#f9c74f]"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {editing.id ? "Edit Question" : "New Question"}
          </div>
          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div><Label>Skill</Label>
                <Select
                  value={String(editing.skill_id ?? skills[0]?.id)}
                  onChange={v => setEditing(e => ({ ...e, skill_id: parseInt(v) }))}
                  options={skills.map(s => ({ label: s.name, value: String(s.id) }))}
                />
              </div>
              <div><Label>Difficulty</Label>
                <Select value={editing.difficulty ?? "foundation"}
                  onChange={v => setEditing(e => ({ ...e, difficulty: v }))}
                  options={diffOptions} />
              </div>
            </div>
            <div><Label>Question Text</Label>
              <Textarea value={editing.question_text ?? ""}
                onChange={v => setEditing(e => ({ ...e, question_text: v }))}
                placeholder="Enter the question…" rows={2} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["a", "b", "c", "d"] as const).map(opt => (
                <div key={opt}><Label>Option {opt.toUpperCase()}</Label>
                  <Input value={(editing as any)[`option_${opt}`] ?? ""}
                    onChange={v => setEditing(e => ({ ...e, [`option_${opt}`]: v }))}
                    placeholder={`Option ${opt.toUpperCase()}`} />
                </div>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><Label>Correct Option</Label>
                <Select value={editing.correct_option ?? "a"}
                  onChange={v => setEditing(e => ({ ...e, correct_option: v }))}
                  options={correctOptions} />
              </div>
            </div>
            <div><Label>Worked Solution</Label>
              <Textarea value={editing.worked_solution ?? ""}
                onChange={v => setEditing(e => ({ ...e, worked_solution: v }))}
                placeholder="Explain the correct answer step by step…" rows={3} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Btn onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Btn>
            <Btn onClick={() => setEditing(null)} variant="ghost">Cancel</Btn>
          </div>
        </Card>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {questions.map(q => {
          const skill = skills.find(s => s.id === q.skill_id);
          return (
            <Card key={q.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2 flex-wrap">
                    <span className="rounded-full bg-[#f9c74f15] border border-[#f9c74f30] px-2 py-0.5 text-xs text-[#f9c74f]">
                      {skill?.name ?? "Unknown skill"}
                    </span>
                    <span className="text-xs text-[#555a73] capitalize">{q.difficulty}</span>
                  </div>
                  <div className="font-semibold text-[#f1f0ee] text-sm leading-snug">
                    {q.question_text}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-1">
                    {(["a", "b", "c", "d"] as const).map(opt => (
                      <div key={opt} className={`text-xs px-2 py-1 rounded-lg ${q.correct_option === opt ? "bg-[#4ade8015] text-[#4ade80] border border-[#4ade8030]" : "text-[#555a73]"}`}>
                        {opt.toUpperCase()}: {(q as any)[`option_${opt}`]}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Btn onClick={() => setEditing(q)} variant="ghost">Edit</Btn>
                  <Btn onClick={() => del(q.id)} variant="danger">Delete</Btn>
                </div>
              </div>
            </Card>
          );
        })}
        {questions.length === 0 && (
          <div className="rounded-2xl border border-[#2e3248] bg-[#1a1d27] px-6 py-10 text-center text-sm text-[#555a73]">
            No questions yet for this skill.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Hints tab ──────────────────────────────────────────────────────────────
function HintsTab({ skills }: { skills: Skill[] }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [hints, setHints] = useState<Hint[]>([]);
  const [filterSkill, setFilterSkill] = useState<string>("all");
  const [filterQuestion, setFilterQuestion] = useState<string>("all");
  const [editing, setEditing] = useState<Partial<Hint> | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadQuestions() {
    let q = supabase.from("questions").select("id, question_text, skill_id").order("id");
    if (filterSkill !== "all") q = q.eq("skill_id", filterSkill);
    const { data } = await q;
    if (data) setQuestions(data as Question[]);
  }

  async function loadHints() {
    let q = supabase.from("hints").select("*").order("question_id").order("order_index");
    if (filterQuestion !== "all") q = q.eq("question_id", filterQuestion);
    const { data } = await q;
    if (data) setHints(data);
  }

  useEffect(() => { loadQuestions(); }, [filterSkill]);
  useEffect(() => { loadHints(); }, [filterQuestion]);

  function blank(): Partial<Hint> {
    return { question_id: questions[0]?.id, hint_text: "", order_index: 0 };
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    const payload = {
      question_id: editing.question_id,
      hint_text: editing.hint_text,
      order_index: editing.order_index,
    };
    if (editing.id) {
      await supabase.from("hints").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("hints").insert(payload);
    }
    setSaving(false);
    setEditing(null);
    loadHints();
  }

  async function del(id: number) {
    if (!confirm("Delete this hint?")) return;
    await supabase.from("hints").delete().eq("id", id);
    loadHints();
  }

  const skillOptions = [
    { label: "All skills", value: "all" },
    ...skills.map(s => ({ label: s.name, value: String(s.id) })),
  ];

  const questionOptions = [
    { label: "All questions", value: "all" },
    ...questions.map(q => ({ label: q.question_text.slice(0, 60) + (q.question_text.length > 60 ? "…" : ""), value: String(q.id) })),
  ];

  return (
    <div>
      <SectionHeader title="Hints" onAdd={() => setEditing(blank())} />

      <div className="mb-4 flex gap-3 flex-wrap">
        <div className="w-56">
          <Select value={filterSkill} onChange={v => { setFilterSkill(v); setFilterQuestion("all"); }} options={skillOptions} />
        </div>
        <div className="w-72">
          <Select value={filterQuestion} onChange={setFilterQuestion} options={questionOptions} />
        </div>
      </div>

      {editing && (
        <Card>
          <div className="mb-4 text-sm font-bold text-[#f9c74f]"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {editing.id ? "Edit Hint" : "New Hint"}
          </div>
          <div className="grid gap-3">
            <div><Label>Question</Label>
              <Select
                value={String(editing.question_id ?? questions[0]?.id)}
                onChange={v => setEditing(e => ({ ...e, question_id: parseInt(v) }))}
                options={questions.map(q => ({ label: q.question_text.slice(0, 80), value: String(q.id) }))}
              />
            </div>
            <div><Label>Hint Text</Label>
              <Textarea value={editing.hint_text ?? ""}
                onChange={v => setEditing(e => ({ ...e, hint_text: v }))}
                placeholder="Write a hint that nudges without giving the answer away…" rows={2} />
            </div>
            <div className="w-32"><Label>Order</Label>
              <Input type="number" value={editing.order_index ?? 0}
                onChange={v => setEditing(e => ({ ...e, order_index: parseInt(v) }))} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Btn onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Btn>
            <Btn onClick={() => setEditing(null)} variant="ghost">Cancel</Btn>
          </div>
        </Card>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {hints.map(h => {
          const q = questions.find(q => q.id === h.question_id);
          return (
            <Card key={h.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {q && (
                    <div className="mb-1 text-xs text-[#555a73] truncate">
                      Q: {q.question_text.slice(0, 80)}
                    </div>
                  )}
                  <div className="text-sm text-[#f1f0ee]">{h.hint_text}</div>
                  <div className="mt-1 text-xs text-[#555a73]">Order: {h.order_index}</div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Btn onClick={() => setEditing(h)} variant="ghost">Edit</Btn>
                  <Btn onClick={() => del(h.id)} variant="danger">Delete</Btn>
                </div>
              </div>
            </Card>
          );
        })}
        {hints.length === 0 && (
          <div className="rounded-2xl border border-[#2e3248] bg-[#1a1d27] px-6 py-10 text-center text-sm text-[#555a73]">
            No hints yet.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Misconceptions tab ─────────────────────────────────────────────────────
function MisconceptionsTab({ skills }: { skills: Skill[] }) {
  const [misconceptions, setMisconceptions] = useState<Misconception[]>([]);
  const [filterSkill, setFilterSkill] = useState<string>("all");
  const [editing, setEditing] = useState<Partial<Misconception> | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    let q = supabase.from("misconceptions").select("*").order("skill_id").order("order_index");
    if (filterSkill !== "all") q = q.eq("skill_id", filterSkill);
    const { data } = await q;
    if (data) setMisconceptions(data);
  }

  useEffect(() => { load(); }, [filterSkill]);

  function blank(): Partial<Misconception> {
    return {
      skill_id: skills[0]?.id, code: "", title: "",
      description: "", example_wrong_answer: "",
      example_wrong_thinking: "", diagnostic_meaning: "", order_index: 0,
    };
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    const payload = {
      skill_id: editing.skill_id, code: editing.code, title: editing.title,
      description: editing.description, example_wrong_answer: editing.example_wrong_answer,
      example_wrong_thinking: editing.example_wrong_thinking,
      diagnostic_meaning: editing.diagnostic_meaning, order_index: editing.order_index,
    };
    if (editing.id) {
      await supabase.from("misconceptions").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("misconceptions").insert(payload);
    }
    setSaving(false);
    setEditing(null);
    load();
  }

  async function del(id: number) {
    if (!confirm("Delete this misconception?")) return;
    await supabase.from("misconceptions").delete().eq("id", id);
    load();
  }

  const skillOptions = [
    { label: "All skills", value: "all" },
    ...skills.map(s => ({ label: s.name, value: String(s.id) })),
  ];

  return (
    <div>
      <SectionHeader title="Misconceptions" onAdd={() => setEditing(blank())} />

      <div className="mb-4 w-64">
        <Select value={filterSkill} onChange={setFilterSkill} options={skillOptions} />
      </div>

      {editing && (
        <Card>
          <div className="mb-4 text-sm font-bold text-[#f9c74f]"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {editing.id ? "Edit Misconception" : "New Misconception"}
          </div>
          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <div><Label>Skill</Label>
                <Select
                  value={String(editing.skill_id ?? skills[0]?.id)}
                  onChange={v => setEditing(e => ({ ...e, skill_id: parseInt(v) }))}
                  options={skills.map(s => ({ label: s.name, value: String(s.id) }))}
                />
              </div>
              <div><Label>Code (e.g. M1)</Label>
                <Input value={editing.code ?? ""}
                  onChange={v => setEditing(e => ({ ...e, code: v }))}
                  placeholder="M1" />
              </div>
              <div><Label>Order</Label>
                <Input type="number" value={editing.order_index ?? 0}
                  onChange={v => setEditing(e => ({ ...e, order_index: parseInt(v) }))} />
              </div>
            </div>
            <div><Label>Title</Label>
              <Input value={editing.title ?? ""}
                onChange={v => setEditing(e => ({ ...e, title: v }))}
                placeholder="e.g. Does Not Understand What an Equation Represents" />
            </div>
            <div><Label>Description</Label>
              <Textarea value={editing.description ?? ""}
                onChange={v => setEditing(e => ({ ...e, description: v }))}
                placeholder="Describe the misconception…" rows={2} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><Label>Example Wrong Answer</Label>
                <Input value={editing.example_wrong_answer ?? ""}
                  onChange={v => setEditing(e => ({ ...e, example_wrong_answer: v }))}
                  placeholder="e.g. 22" />
              </div>
              <div><Label>Example Wrong Thinking</Label>
                <Textarea value={editing.example_wrong_thinking ?? ""}
                  onChange={v => setEditing(e => ({ ...e, example_wrong_thinking: v }))}
                  placeholder="e.g. Student adds instead of subtracts…" rows={2} />
              </div>
            </div>
            <div><Label>Diagnostic Meaning</Label>
              <Textarea value={editing.diagnostic_meaning ?? ""}
                onChange={v => setEditing(e => ({ ...e, diagnostic_meaning: v }))}
                placeholder="What does this wrong answer reveal about the student's understanding?" rows={2} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Btn onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Btn>
            <Btn onClick={() => setEditing(null)} variant="ghost">Cancel</Btn>
          </div>
        </Card>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {misconceptions.map(m => {
          const skill = skills.find(s => s.id === m.skill_id);
          return (
            <Card key={m.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2 flex-wrap">
                    <span className="rounded-full bg-[#f9c74f15] border border-[#f9c74f30] px-2 py-0.5 text-xs font-bold text-[#f9c74f]">
                      {m.code}
                    </span>
                    <span className="text-xs text-[#555a73]">{skill?.name}</span>
                  </div>
                  <div className="font-semibold text-[#f1f0ee] text-sm">{m.title}</div>
                  {m.description && (
                    <div className="mt-1 text-xs text-[#8a8fa8] leading-relaxed">{m.description}</div>
                  )}
                  {m.example_wrong_answer && (
                    <div className="mt-2 text-xs text-[#555a73]">
                      Wrong answer: <span className="text-[#f87171] font-mono">{m.example_wrong_answer}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Btn onClick={() => setEditing(m)} variant="ghost">Edit</Btn>
                  <Btn onClick={() => del(m.id)} variant="danger">Delete</Btn>
                </div>
              </div>
            </Card>
          );
        })}
        {misconceptions.length === 0 && (
          <div className="rounded-2xl border border-[#2e3248] bg-[#1a1d27] px-6 py-10 text-center text-sm text-[#555a73]">
            No misconceptions yet for this skill.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState<Tab>("skills");
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    if (authed) {
      supabase.from("skills").select("*").order("order_index")
        .then(({ data }) => { if (data) setSkills(data); });
    }
  }, [authed]);

  function handleLogin() {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1117] px-4"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="w-full max-w-sm rounded-2xl border border-[#2e3248] bg-[#1a1d27] p-8">
          <div className="mb-6 text-center">
            <div className="mb-1 text-2xl font-extrabold text-[#f9c74f]"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Revily Admin
            </div>
            <div className="text-xs text-[#555a73]">Content management</div>
          </div>
          <Label>Password</Label>
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Enter admin password"
            className="w-full rounded-xl border border-[#2e3248] bg-[#0f1117] px-3 py-2 text-sm text-[#f1f0ee] placeholder-[#555a73] focus:border-[#f9c74f] focus:outline-none transition-colors mb-3"
          />
          {pwError && (
            <div className="mb-3 text-xs text-[#f87171]">Incorrect password.</div>
          )}
          <button
            onClick={handleLogin}
            className="w-full rounded-full bg-[#f9c74f] py-2.5 text-sm font-bold text-[#0f1117] transition-opacity hover:opacity-90"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Enter
          </button>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "skills", label: "Skills" },
    { key: "questions", label: "Questions" },
    { key: "hints", label: "Hints" },
    { key: "misconceptions", label: "Misconceptions" },
  ];

  return (
    <div className="min-h-screen bg-[#0f1117] px-4 pb-16 pt-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-2xl font-extrabold text-[#f9c74f]"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Revily Admin
            </div>
            <div className="text-xs text-[#555a73]">Content management</div>
          </div>
          <button onClick={() => setAuthed(false)}
            className="text-xs text-[#555a73] hover:text-[#f1f0ee] transition-colors">
            Sign out
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-2xl border border-[#2e3248] bg-[#1a1d27] p-1 w-fit">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                tab === t.key
                  ? "bg-[#f9c74f] text-[#0f1117]"
                  : "text-[#8a8fa8] hover:text-[#f1f0ee]"
              }`}
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "skills" && <SkillsTab />}
        {tab === "questions" && <QuestionsTab skills={skills} />}
        {tab === "hints" && <HintsTab skills={skills} />}
        {tab === "misconceptions" && <MisconceptionsTab skills={skills} />}
      </div>
    </div>
  );
}