"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MathText from "@/components/MathText";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";

// ── Types ──────────────────────────────────────────────────────────────────
type Skill = {
  id: number;
  name: string;
  slug: string;
  order_index: number;
  topic_area: string;
  prerequisites: number[];
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
  answer_type: "mcq" | "free_response";
  correct_answer: string | null;
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
  question_id: number;
  code: string;
  title: string;
  description: string;
  wrong_option: string;
  example_wrong_answer: string;
  example_wrong_thinking: string;
  diagnostic_meaning: string;
  order_index: number;
};

// answer_type/correct_answer added for free response generation.
// MCQ fields are optional now since free response questions don't have them.
type GeneratedQuestion = {
  question_text: string;
  answer_type: "mcq" | "free_response";
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  correct_option?: string;
  correct_answer?: string;
  worked_solution: string;
  difficulty: string;
  question_type: "fluency" | "worded" | "application" | "mixed_review" | "repair" | "retrieval" | "diagnostic";
  hints: string[];
  misconceptions: { wrong_option: string; title: string; description: string }[];
};

type GenerateQuestion = GeneratedQuestion & {
  savedId: number | null | "saving" | "error";
};

type Tab = "skills" | "questions" | "generate";

// ── Question type config ───────────────────────────────────────────────────
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

function Input({ value, onChange, placeholder, type = "text" }: {
  value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full rounded-xl border border-[#2e3248] bg-[#0f1117] px-3 py-2 text-sm text-[#f1f0ee] placeholder-[#555a73] focus:border-[#f9c74f] focus:outline-none transition-colors" />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full rounded-xl border border-[#2e3248] bg-[#0f1117] px-3 py-2 text-sm text-[#f1f0ee] placeholder-[#555a73] focus:border-[#f9c74f] focus:outline-none transition-colors resize-none font-mono" />
  );
}

function Select({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: { label: string; value: string }[];
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full rounded-xl border border-[#2e3248] bg-[#0f1117] px-3 py-2 text-sm text-[#f1f0ee] focus:border-[#f9c74f] focus:outline-none transition-colors">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function Btn({ onClick, children, variant = "primary", disabled }: {
  onClick: () => void; children: React.ReactNode;
  variant?: "primary" | "ghost" | "danger" | "success"; disabled?: boolean;
}) {
  const styles = {
    primary: "bg-[#f9c74f] text-[#0f1117] hover:opacity-90",
    ghost:   "border border-[#2e3248] text-[#8a8fa8] hover:text-[#f1f0ee] hover:border-[#f9c74f40]",
    danger:  "text-[#f87171] hover:bg-[#f8717115]",
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

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-[#2e3248] bg-[#1a1d27] p-5">{children}</div>;
}

function SectionHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-extrabold text-[#f1f0ee]"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{title}</h2>
      <Btn onClick={onAdd}>+ Add</Btn>
    </div>
  );
}

// ── Worked solution editor ─────────────────────────────────────────────────
function WorkedSolutionEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [showGuide, setShowGuide] = useState(false);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <Label>Worked Solution</Label>
        <button onClick={() => setShowGuide(s => !s)}
          className="text-xs text-[#818cf8] hover:opacity-80 transition-opacity"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
          {showGuide ? "Hide guide ↑" : "Show formatting guide ↓"}
        </button>
      </div>
      {showGuide && (
        <div className="mb-3 rounded-xl border border-[#818cf833] bg-[#818cf808] p-4 flex flex-col gap-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#818cf8]"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Formatting guide</div>
          {[
            { token: "[STEP]", desc: "splits solution into separate steps" },
            { token: "[TRANSFORM: before -> after]", desc: "tap-to-reveal equation change" },
            { token: "$...$", desc: "wraps maths in proper notation" },
          ].map(({ token, desc }) => (
            <div key={token} className="flex items-center gap-2">
              <span className="rounded-md bg-[#818cf822] px-2 py-0.5 font-mono text-xs text-[#a5b4fc] flex-shrink-0">{token}</span>
              <span className="text-xs text-[#8a8fa8]">{desc}</span>
            </div>
          ))}
        </div>
      )}
      <Textarea value={value} onChange={onChange}
        placeholder="Write the solution. Use [STEP] to split steps, [TRANSFORM: before -> after] for equations, $...$ for maths." rows={5} />
    </div>
  );
}

// ── Prerequisites picker ───────────────────────────────────────────────────
function PrerequisitesPicker({ allSkills, currentSkillId, selected, onChange }: {
  allSkills: Skill[]; currentSkillId?: number; selected: number[]; onChange: (ids: number[]) => void;
}) {
  const options = allSkills.filter(s => s.id !== currentSkillId);
  function toggle(id: number) {
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  }
  return (
    <div>
      <Label>Prerequisites</Label>
      <div className="flex flex-wrap gap-2 mt-1">
        {options.map(s => {
          const active = selected.includes(s.id);
          return (
            <button key={s.id} onClick={() => toggle(s.id)}
              className="rounded-full border px-3 py-1 text-xs font-semibold transition-all"
              style={{
                borderColor: active ? "#f9c74f" : "#2e3248",
                backgroundColor: active ? "#f9c74f15" : "#0f1117",
                color: active ? "#f9c74f" : "#8a8fa8",
              }}>
              {active ? "✓ " : ""}{s.name}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <div className="mt-2 text-xs text-[#555a73]">
          Requires: {selected.map(id => allSkills.find(s => s.id === id)?.name).filter(Boolean).join(", ")}
        </div>
      )}
    </div>
  );
}

// ── Inline misconception slot ──────────────────────────────────────────────
function MisconceptionSlot({ option, questionId, skillId, existing, onSaved, onDeleted }: {
  option: string; questionId: number; skillId: number;
  existing: Misconception | null; onSaved: () => void; onDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [exampleWrongAnswer, setExampleWrongAnswer] = useState(existing?.example_wrong_answer ?? "");
  const [exampleWrongThinking, setExampleWrongThinking] = useState(existing?.example_wrong_thinking ?? "");
  const [diagnosticMeaning, setDiagnosticMeaning] = useState(existing?.diagnostic_meaning ?? "");

  useEffect(() => {
    setTitle(existing?.title ?? "");
    setDescription(existing?.description ?? "");
    setExampleWrongAnswer(existing?.example_wrong_answer ?? "");
    setExampleWrongThinking(existing?.example_wrong_thinking ?? "");
    setDiagnosticMeaning(existing?.diagnostic_meaning ?? "");
  }, [existing?.id]);

  async function save() {
    setSaving(true);
    const payload = {
      skill_id: skillId, question_id: questionId, wrong_option: option,
      title, description,
      example_wrong_answer: exampleWrongAnswer,
      example_wrong_thinking: exampleWrongThinking,
      diagnostic_meaning: diagnosticMeaning,
      code: existing?.code ?? `MC_Q${questionId}_${option.toUpperCase()}`,
      order_index: existing?.order_index ?? 0,
    };
    if (existing?.id) {
      await supabase.from("misconceptions").update(payload).eq("id", existing.id);
    } else {
      await supabase.from("misconceptions").insert(payload);
    }
    setSaving(false); setOpen(false); onSaved();
  }

  async function del() {
    if (!existing?.id) return;
    if (!confirm(`Delete misconception for option ${option.toUpperCase()}?`)) return;
    await supabase.from("misconceptions").delete().eq("id", existing.id);
    onDeleted();
  }

  const hasContent = !!existing;
  return (
    <div className={`mt-1.5 rounded-lg border transition-colors ${hasContent ? "border-[#f8717133] bg-[#f871710a]" : "border-[#2e3248] bg-[#0f1117]"}`}>
      <div className="flex items-center justify-between px-2.5 py-1.5 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs">⚠</span>
          {hasContent
            ? <span className="text-xs text-[#f87171] truncate font-medium">{existing.title}</span>
            : <span className="text-xs text-[#555a73] italic">No misconception</span>
          }
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {hasContent && <button onClick={del} className="text-xs text-[#555a73] hover:text-[#f87171] transition-colors">Delete</button>}
          <button onClick={() => setOpen(o => !o)}
            className="text-xs font-semibold text-[#818cf8] hover:opacity-80 transition-opacity"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {open ? "Close ↑" : hasContent ? "Edit ↓" : "+ Add ↓"}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-[#2e3248] px-2.5 pb-2.5 pt-2.5 flex flex-col gap-2.5">
          <div><Label>Title</Label><Input value={title} onChange={setTitle} placeholder="e.g. Reversed the ratio order" /></div>
          <div><Label>What is the student thinking?</Label>
            <Textarea value={description} onChange={setDescription} placeholder="e.g. The student writes blue:red instead of red:blue." rows={2} />
          </div>
          <button onClick={() => setShowAdvanced(s => !s)} className="text-xs text-[#555a73] hover:text-[#8a8fa8] transition-colors text-left">
            {showAdvanced ? "Hide advanced ↑" : "Show advanced fields ↓"}
          </button>
          {showAdvanced && (
            <div className="flex flex-col gap-2 rounded-lg border border-[#2e3248] bg-[#0f1117] p-2.5">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#555a73]">Advanced</div>
              <div><Label>Example wrong answer</Label><Input value={exampleWrongAnswer} onChange={setExampleWrongAnswer} placeholder="e.g. 8:12" /></div>
              <div><Label>Example wrong thinking</Label>
                <Textarea value={exampleWrongThinking} onChange={setExampleWrongThinking} placeholder="e.g. Student reads question as blue to red rather than red to blue." rows={2} />
              </div>
              <div><Label>Diagnostic meaning</Label>
                <Textarea value={diagnosticMeaning} onChange={setDiagnosticMeaning} placeholder="What does choosing this option reveal about the student's understanding?" rows={2} />
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <Btn onClick={save} disabled={saving || !title.trim()}>{saving ? "Saving…" : existing ? "Update" : "Save"}</Btn>
            <Btn onClick={() => setOpen(false)} variant="ghost">Cancel</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Options grid with integrated misconception slots (MCQ editor only) ─────
function OptionsWithMisconceptions({ editing, setEditing, misconceptions, reloadMisconceptions }: {
  editing: Question;
  setEditing: (fn: (q: Question) => Question) => void;
  misconceptions: Misconception[];
  reloadMisconceptions: () => void;
}) {
  const opts = ["a", "b", "c", "d"] as const;
  const correctOption = editing.correct_option.toLowerCase();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {opts.map(opt => {
        const isCorrect = opt === correctOption;
        const existing = misconceptions.find(m => m.wrong_option.toLowerCase() === opt) ?? null;
        return (
          <div key={opt}>
            <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${isCorrect ? "border-[#4ade8044] bg-[#4ade8010]" : "border-[#2e3248] bg-[#0f1117]"}`}>
              <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${isCorrect ? "bg-[#4ade80] text-[#0d1f15]" : "bg-[#2e3248] text-[#8a8fa8]"}`}
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                {opt.toUpperCase()}
              </span>
              <input value={(editing as any)[`option_${opt}`] ?? ""}
                onChange={e => setEditing(q => ({ ...q, [`option_${opt}`]: e.target.value }))}
                placeholder={`Option ${opt.toUpperCase()}`}
                className="flex-1 bg-transparent text-sm text-[#f1f0ee] placeholder-[#555a73] focus:outline-none" />
              {isCorrect && <span className="text-xs text-[#4ade80] font-semibold flex-shrink-0">✓ Correct</span>}
            </div>
            {!isCorrect && editing.id ? (
              <MisconceptionSlot option={opt} questionId={editing.id} skillId={editing.skill_id}
                existing={existing} onSaved={reloadMisconceptions} onDeleted={reloadMisconceptions} />
            ) : !isCorrect && (
              <div className="mt-1.5 rounded-lg border border-[#2e3248] bg-[#0f1117] px-2.5 py-1.5">
                <span className="text-xs text-[#555a73] italic">Save question first to add misconception</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Free response answer editor (replaces options grid when answer_type is free_response) ─
function FreeResponseAnswerEditor({ editing, setEditing }: {
  editing: Question;
  setEditing: (fn: (q: Question) => Question) => void;
}) {
  return (
    <div className="rounded-xl border border-[#4ade8044] bg-[#4ade8010] px-4 py-3">
      <Label>Correct answer (exact text Claude will grade against)</Label>
      <Input
        value={editing.correct_answer ?? ""}
        onChange={v => setEditing(q => ({ ...q, correct_answer: v }))}
        placeholder='e.g. "7.38" or "3:2" or "x = 5"'
      />
      <p className="mt-2 text-xs text-[#555a73]">
        This is graded by Claude at answer time, which already accepts mathematically equivalent
        forms (e.g. 0.75 = 3/4 = 75%). You don't need to list every variant here — just the canonical answer.
      </p>
    </div>
  );
}

// ── Inline hints editor ────────────────────────────────────────────────────
function HintsEditor({ questionId }: { questionId: number }) {
  const [hints, setHints] = useState<Hint[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingHint, setAddingHint] = useState(false);
  const [newHintText, setNewHintText] = useState("");
  const [savingNew, setSavingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("hints").select("*").eq("question_id", questionId).order("order_index");
    setHints(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, [questionId]);

  async function addHint() {
    if (!newHintText.trim()) return;
    setSavingNew(true);
    await supabase.from("hints").insert({ question_id: questionId, hint_text: newHintText.trim(), order_index: hints.length });
    setNewHintText(""); setAddingHint(false); setSavingNew(false); load();
  }
  async function updateHint(id: number) {
    await supabase.from("hints").update({ hint_text: editingText }).eq("id", id);
    setEditingId(null); setEditingText(""); load();
  }
  async function deleteHint(id: number) {
    if (!confirm("Delete this hint?")) return;
    await supabase.from("hints").delete().eq("id", id); load();
  }
  async function moveHint(id: number, direction: "up" | "down") {
    const idx = hints.findIndex(h => h.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= hints.length) return;
    const a = hints[idx]; const b = hints[swapIdx];
    await Promise.all([
      supabase.from("hints").update({ order_index: b.order_index }).eq("id", a.id),
      supabase.from("hints").update({ order_index: a.order_index }).eq("id", b.id),
    ]);
    load();
  }

  return (
    <div className="mt-5 border-t border-[#2e3248] pt-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#f1f0ee]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Hints</span>
          {!loading && (
            <span className="rounded-full bg-[#f9c74f15] border border-[#f9c74f30] px-2 py-0.5 text-xs text-[#f9c74f]">
              {hints.length} hint{hints.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        {!addingHint && (
          <button onClick={() => setAddingHint(true)}
            className="text-xs font-semibold text-[#f9c74f] hover:opacity-80 transition-opacity"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            + Add hint
          </button>
        )}
      </div>
      {loading ? <div className="text-xs text-[#555a73]">Loading…</div> : (
        <div className="flex flex-col gap-2">
          {hints.map((h, i) => (
            <div key={h.id} className="rounded-xl border border-[#f9c74f22] bg-[#f9c74f08] px-3 py-2">
              {editingId === h.id ? (
                <div className="flex flex-col gap-2">
                  <Textarea value={editingText} onChange={setEditingText} rows={2} />
                  <div className="flex gap-2">
                    <Btn onClick={() => updateHint(h.id)}>Save</Btn>
                    <Btn onClick={() => setEditingId(null)} variant="ghost">Cancel</Btn>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="text-xs font-bold text-[#f9c74f] flex-shrink-0 mt-0.5">💡 {i + 1}</span>
                    <span className="text-sm text-[#f1f0ee] leading-snug">{h.hint_text}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => moveHint(h.id, "up")} disabled={i === 0} className="text-xs text-[#555a73] hover:text-[#8a8fa8] disabled:opacity-30 transition-colors px-1">↑</button>
                    <button onClick={() => moveHint(h.id, "down")} disabled={i === hints.length - 1} className="text-xs text-[#555a73] hover:text-[#8a8fa8] disabled:opacity-30 transition-colors px-1">↓</button>
                    <button onClick={() => { setEditingId(h.id); setEditingText(h.hint_text); }} className="text-xs text-[#8a8fa8] hover:text-[#f1f0ee] transition-colors px-1">Edit</button>
                    <button onClick={() => deleteHint(h.id)} className="text-xs text-[#555a73] hover:text-[#f87171] transition-colors px-1">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {hints.length === 0 && !addingHint && <div className="text-xs text-[#555a73] italic">No hints yet. Add one to help students who get stuck.</div>}
          {addingHint && (
            <div className="rounded-xl border border-[#f9c74f33] bg-[#f9c74f08] px-3 py-2.5 flex flex-col gap-2">
              <Label>New hint</Label>
              <Textarea value={newHintText} onChange={setNewHintText} placeholder="Write a hint that nudges without giving the answer away…" rows={2} />
              <div className="flex gap-2">
                <Btn onClick={addHint} disabled={savingNew || !newHintText.trim()}>{savingNew ? "Saving…" : "Save hint"}</Btn>
                <Btn onClick={() => { setAddingHint(false); setNewHintText(""); }} variant="ghost">Cancel</Btn>
              </div>
            </div>
          )}
        </div>
      )}
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
    if (data) setSkills(data.map(s => ({ ...s, prerequisites: s.prerequisites ?? [] })));
  }
  useEffect(() => { load(); }, []);

  function blank(): Partial<Skill> {
    return { name: "", slug: "", order_index: 0, topic_area: "", prerequisites: [] };
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    const payload = { name: editing.name, slug: editing.slug, order_index: editing.order_index, topic_area: editing.topic_area, prerequisites: editing.prerequisites ?? [] };
    if (editing.id) { await supabase.from("skills").update(payload).eq("id", editing.id); }
    else { await supabase.from("skills").insert(payload); }
    setSaving(false); setEditing(null); load();
  }

  async function del(id: number) {
    if (!confirm("Delete this skill? All linked questions will also be deleted.")) return;
    await supabase.from("skills").delete().eq("id", id); load();
  }

  return (
    <div>
      <SectionHeader title="Skills" onAdd={() => setEditing(blank())} />
      {editing && (
        <Card>
          <div className="mb-4 text-sm font-bold text-[#f9c74f]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {editing.id ? "Edit Skill" : "New Skill"}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Name</Label><Input value={editing.name ?? ""} onChange={v => setEditing(e => ({ ...e, name: v }))} placeholder="e.g. Fractions — Basics" /></div>
            <div><Label>Slug</Label><Input value={editing.slug ?? ""} onChange={v => setEditing(e => ({ ...e, slug: v }))} placeholder="e.g. fractions-basics" /></div>
            <div><Label>Topic Area</Label><Input value={editing.topic_area ?? ""} onChange={v => setEditing(e => ({ ...e, topic_area: v }))} placeholder="e.g. Number" /></div>
            <div><Label>Order Index</Label><Input type="number" value={editing.order_index ?? 0} onChange={v => setEditing(e => ({ ...e, order_index: parseInt(v) }))} /></div>
          </div>
          <div className="mt-3">
            <PrerequisitesPicker allSkills={skills} currentSkillId={editing.id} selected={editing.prerequisites ?? []} onChange={ids => setEditing(e => ({ ...e, prerequisites: ids }))} />
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
                <div className="font-bold text-[#f1f0ee] truncate" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{s.name}</div>
                <div className="mt-0.5 text-xs text-[#555a73]">{s.topic_area} · order {s.order_index} · <span className="font-mono">{s.slug}</span></div>
                {s.prerequisites.length > 0 && (
                  <div className="mt-1 text-xs text-[#555a73]">
                    Requires: {s.prerequisites.map(id => skills.find(sk => sk.id === id)?.name).filter(Boolean).join(", ")}
                  </div>
                )}
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
function QuestionsTab({ skills, initialSkillFilter, highlightQuestionId }: {
  skills: Skill[];
  initialSkillFilter?: string | null;
  highlightQuestionId?: number | null;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filterSkill, setFilterSkill] = useState<string>(initialSkillFilter ?? "all");
  const [editing, setEditing] = useState<Question | null>(null);
  const [saving, setSaving] = useState(false);
  const [misconceptions, setMisconceptions] = useState<Misconception[]>([]);

  async function load() {
    let q = supabase.from("questions").select("*").order("id");
    if (filterSkill !== "all") q = q.eq("skill_id", filterSkill);
    const { data } = await q;
    if (data) setQuestions(data);
  }
  async function loadMisconceptions(questionId: number) {
    const { data } = await supabase.from("misconceptions").select("*").eq("question_id", questionId);
    setMisconceptions(data ?? []);
  }
  useEffect(() => { load(); }, [filterSkill]);
  useEffect(() => {
    if (editing?.id) loadMisconceptions(editing.id);
    else setMisconceptions([]);
  }, [editing?.id]);

  function blank(): Question {
    return {
      id: 0, skill_id: skills[0]?.id, question_text: "",
      option_a: "", option_b: "", option_c: "", option_d: "",
      correct_option: "a", worked_solution: "", difficulty: "foundation",
      answer_type: "mcq", correct_answer: null,
    };
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    const basePayload = {
      skill_id: editing.skill_id,
      question_text: editing.question_text,
      worked_solution: editing.worked_solution,
      difficulty: editing.difficulty,
      answer_type: editing.answer_type,
    };
    // Build one flat object with every possible column present (nulled where
    // not applicable) instead of a conditional union — Supabase's insert/update
    // typing rejects payloads that could be one of two different shapes.
    const payload = editing.answer_type === "free_response"
      ? {
          ...basePayload,
          correct_answer: editing.correct_answer,
          option_a: null, option_b: null, option_c: null, option_d: null,
          correct_option: null,
        }
      : {
          ...basePayload,
          option_a: editing.option_a, option_b: editing.option_b,
          option_c: editing.option_c, option_d: editing.option_d,
          correct_option: editing.correct_option,
          correct_answer: null,
        };

    if (editing.id) {
      await supabase.from("questions").update(payload).eq("id", editing.id);
    } else {
      const { data } = await supabase.from("questions").insert(payload).select("id").single();
      if (data) setEditing(q => q ? { ...q, id: data.id } : q);
    }
    setSaving(false); load();
  }

  async function del(id: number) {
    if (!confirm("Delete this question and all its hints and misconceptions?")) return;
    await supabase.from("questions").delete().eq("id", id);
    if (editing?.id === id) setEditing(null); load();
  }

  const skillOptions = [{ label: "All skills", value: "all" }, ...skills.map(s => ({ label: s.name, value: String(s.id) }))];
  const diffOptions = [{ label: "Foundation", value: "foundation" }, { label: "Crossover", value: "crossover" }, { label: "Higher", value: "higher" }];
  const correctOptions = ["a","b","c","d"].map(v => ({ label: v.toUpperCase(), value: v }));
  const answerTypeOptions = [
    { label: "Multiple choice", value: "mcq" },
    { label: "Free response", value: "free_response" },
  ];

  return (
    <div>
      <SectionHeader title="Questions" onAdd={() => setEditing(blank())} />
      <div className="mb-4 max-w-sm"><Select value={filterSkill} onChange={setFilterSkill} options={skillOptions} /></div>

      {editing && (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-bold text-[#f9c74f]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              {editing.id ? "Edit Question" : "New Question"}
            </div>
            {editing.id && <span className="text-xs text-[#555a73] font-mono">ID {editing.id}</span>}
          </div>

          <div className="grid gap-3 sm:grid-cols-3 mb-4">
            <div><Label>Skill</Label>
              <Select value={String(editing.skill_id ?? skills[0]?.id)} onChange={v => setEditing(q => q ? { ...q, skill_id: parseInt(v) } : q)} options={skills.map(s => ({ label: s.name, value: String(s.id) }))} />
            </div>
            <div><Label>Difficulty</Label>
              <Select value={editing.difficulty ?? "foundation"} onChange={v => setEditing(q => q ? { ...q, difficulty: v } : q)} options={diffOptions} />
            </div>
            <div><Label>Answer type</Label>
              <Select value={editing.answer_type ?? "mcq"} onChange={v => setEditing(q => q ? { ...q, answer_type: v as "mcq" | "free_response" } : q)} options={answerTypeOptions} />
            </div>
          </div>

          <div className="mb-4"><Label>Question Text</Label>
            <Textarea value={editing.question_text ?? ""} onChange={v => setEditing(q => q ? { ...q, question_text: v } : q)} placeholder="Enter the question…" rows={2} />
          </div>

          <div className="mb-4">
            {editing.answer_type === "free_response" ? (
              <>
                <Label>Answer</Label>
                <FreeResponseAnswerEditor editing={editing} setEditing={fn => setEditing(q => q ? fn(q) : q)} />
              </>
            ) : (
              <>
                <div className="mb-2 flex items-center justify-between">
                  <Label>Options &amp; Misconceptions</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#555a73]">Correct:</span>
                    <Select value={editing.correct_option ?? "a"} onChange={v => setEditing(q => q ? { ...q, correct_option: v } : q)} options={correctOptions} />
                  </div>
                </div>
                <OptionsWithMisconceptions editing={editing} setEditing={fn => setEditing(q => q ? fn(q) : q)} misconceptions={misconceptions} reloadMisconceptions={() => editing.id && loadMisconceptions(editing.id)} />
              </>
            )}
          </div>

          <div className="mb-4"><WorkedSolutionEditor value={editing.worked_solution ?? ""} onChange={v => setEditing(q => q ? { ...q, worked_solution: v } : q)} /></div>

          <div className="flex gap-2">
            <Btn onClick={save} disabled={saving}>{saving ? "Saving…" : "Save question"}</Btn>
            <Btn onClick={() => setEditing(null)} variant="ghost">Close</Btn>
            {editing.id && <Btn onClick={() => del(editing.id)} variant="danger">Delete question</Btn>}
          </div>

          {editing.id
            ? <HintsEditor questionId={editing.id} />
            : <div className="mt-5 border-t border-[#2e3248] pt-4 text-xs text-[#555a73]">💡 Save the question first to add hints.</div>
          }
        </Card>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {questions.map(q => {
          const skill = skills.find(s => s.id === q.skill_id);
          const isEditing = editing?.id === q.id;
          const isHighlighted = highlightQuestionId === q.id;
          return (
            <div
              key={q.id}
              ref={isHighlighted ? (el => { if (el) el.scrollIntoView({ behavior: "smooth", block: "center" }); }) : undefined}
              className={`rounded-2xl border bg-[#1a1d27] p-5 transition-colors ${
                isEditing ? "border-[#f9c74f44]" : isHighlighted ? "border-[#f9c74f] ring-2 ring-[#f9c74f33]" : "border-[#2e3248]"
              }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2 flex-wrap">
                    <span className="rounded-full bg-[#f9c74f15] border border-[#f9c74f30] px-2 py-0.5 text-xs text-[#f9c74f]">{skill?.name ?? "Unknown skill"}</span>
                    <span className="text-xs text-[#555a73] capitalize">{q.difficulty}</span>
                    {q.answer_type === "free_response" && (
                      <span className="rounded-full bg-[#4ade8015] border border-[#4ade8030] px-2 py-0.5 text-xs text-[#4ade80]">free response</span>
                    )}
                    {q.worked_solution?.includes("[STEP]") && <span className="rounded-full bg-[#818cf815] border border-[#818cf830] px-2 py-0.5 text-xs text-[#818cf8]">step-by-step</span>}
                    {isHighlighted && <span className="rounded-full bg-[#f9c74f20] border border-[#f9c74f44] px-2 py-0.5 text-xs text-[#f9c74f] font-semibold">Just generated</span>}
                  </div>
                  <div className="font-semibold text-[#f1f0ee] text-sm leading-snug">{q.question_text}</div>
                  {q.answer_type === "free_response" ? (
                    <div className="mt-2 inline-block rounded-lg bg-[#4ade8015] text-[#4ade80] border border-[#4ade8030] text-xs px-2 py-1">
                      Answer: {q.correct_answer}
                    </div>
                  ) : (
                    <div className="mt-2 grid grid-cols-2 gap-1">
                      {(["a","b","c","d"] as const).map(opt => (
                        <div key={opt} className={`text-xs px-2 py-1 rounded-lg ${q.correct_option === opt ? "bg-[#4ade8015] text-[#4ade80] border border-[#4ade8030]" : "text-[#555a73]"}`}>
                          {opt.toUpperCase()}: {(q as any)[`option_${opt}`]}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Btn onClick={() => setEditing(isEditing ? null : q)} variant="ghost">{isEditing ? "Close" : "Edit"}</Btn>
                  <Btn onClick={() => del(q.id)} variant="danger">Delete</Btn>
                </div>
              </div>
            </div>
          );
        })}
        {questions.length === 0 && (
          <div className="rounded-2xl border border-[#2e3248] bg-[#1a1d27] px-6 py-10 text-center text-sm text-[#555a73]">No questions yet for this skill.</div>
        )}
      </div>
    </div>
  );
}

// ── Generate tab ───────────────────────────────────────────────────────────
function GenerateTab({ skills, onSwitchToQuestions }: {
  skills: Skill[];
  onSwitchToQuestions: (skillId: string, questionId: number) => void;
}) {
  const [skillId, setSkillId] = useState<string>(String(skills[0]?.id ?? ""));
  const [difficulty, setDifficulty] = useState("foundation");
  const [count, setCount] = useState("5");
  const [questionType, setQuestionType] = useState("mixed");
  // NEW: answer type selector, defaults to MCQ to preserve existing behaviour
  const [answerType, setAnswerType] = useState<"mcq" | "free_response">("mcq");
  const [paperFile, setPaperFile] = useState<File | null>(null);
  const [paperBase64, setPaperBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<GenerateQuestion[]>([]);

  useEffect(() => {
    if (skills.length > 0 && !skillId) setSkillId(String(skills[0].id));
  }, [skills]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPaperFile(file); setPaperBase64(null);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { const base64 = (reader.result as string).split(",")[1]; setPaperBase64(base64); };
    reader.readAsDataURL(file);
  }

  function clearPaper() {
    setPaperFile(null); setPaperBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleGenerate() {
    const skill = skills.find(s => String(s.id) === skillId);
    if (!skill) return;
    setGenerating(true); setGenerationError(null); setQuestions([]);
    let text = "";
    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillName: skill.name, difficulty, count, questionType,
          answerType, // NEW — tells the route which JSON shape to request from Claude
          paperBase64: paperBase64 ?? undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) { setGenerationError(data?.error?.message ?? "API error."); setGenerating(false); return; }
      text = data.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
      const clean = text.replace(/```json|```/gi, "").trim();
      // Backslash sanitisation for LaTeX inside JSON strings (\frac, \div, \geq etc.)
      const PLACEHOLDER = "\x00DBLSLASH\x00";
      const sanitised = clean
        .replace(/\\\\/g, PLACEHOLDER)
        .replace(/\\/g, "\\\\")
        .replace(new RegExp(PLACEHOLDER.replace(/\x00/g, "\\x00"), "g"), "\\\\");
      const parsed: GeneratedQuestion[] = JSON.parse(sanitised);
      setQuestions(parsed.map(q => ({ ...q, savedId: null })));
    } catch (err) {
      console.error("Raw text was:", text); console.error("Parse error:", err);
      setGenerationError("Failed to parse response. Try generating again.");
    }
    setGenerating(false);
  }

  async function saveQuestion(index: number) {
    const q = questions[index];
    if (!q || typeof q.savedId === "number") return;

    setQuestions(prev => prev.map((x, i) => i === index ? { ...x, savedId: "saving" } : x));

    const basePayload = {
      skill_id: parseInt(skillId),
      question_text: q.question_text,
      worked_solution: q.worked_solution,
      difficulty: q.difficulty,
      question_type: q.question_type,
      answer_type: q.answer_type,
    };

    // Same fix as QuestionsTab.save() — one flat shape with all columns
    // present (nulled where not applicable), not a conditional union.
    const payload = q.answer_type === "free_response"
      ? {
          ...basePayload,
          correct_answer: q.correct_answer,
          option_a: null, option_b: null, option_c: null, option_d: null,
          correct_option: null,
        }
      : {
          ...basePayload,
          option_a: q.option_a, option_b: q.option_b, option_c: q.option_c, option_d: q.option_d,
          correct_option: q.correct_option,
          correct_answer: null,
        };

    const { data: qData, error: qErr } = await supabase
      .from("questions")
      .insert(payload)
      .select("id")
      .single();

    if (qErr || !qData) {
      setQuestions(prev => prev.map((x, i) => i === index ? { ...x, savedId: "error" } : x));
      return;
    }

    const questionId = qData.id;

    if (q.hints?.length > 0) {
      await supabase.from("hints").insert(q.hints.map((hint, i) => ({ question_id: questionId, hint_text: hint, order_index: i })));
    }
    if (q.misconceptions?.length > 0) {
      await supabase.from("misconceptions").insert(q.misconceptions.map((m, i) => ({
        skill_id: parseInt(skillId),
        question_id: questionId,
        // For free response, wrong_option is a free-text snake_case label
        // (e.g. "rounded_up_instead_of_down") rather than a letter A-D.
        wrong_option: m.wrong_option,
        code: `GEN_${questionId}_${m.wrong_option.toUpperCase().replace(/\s+/g, "_")}`,
        title: m.title,
        description: m.description,
        example_wrong_answer: "",
        example_wrong_thinking: "",
        diagnostic_meaning: "",
        order_index: i,
      })));
    }

    setQuestions(prev => prev.map((x, i) => i === index ? { ...x, savedId: questionId } : x));
  }

  const savedCount = questions.filter(q => typeof q.savedId === "number").length;
  const unsavedCount = questions.filter(q => q.savedId === null).length;

  const diffOptions = [{ label: "Foundation", value: "foundation" }, { label: "Crossover", value: "crossover" }, { label: "Higher", value: "higher" }];
  const countOptions = ["3","5","8","10"].map(v => ({ label: v + " questions", value: v }));
  const typeOptions = [
    { label: "Mixed (Claude decides)", value: "mixed" },
    { label: "Fluency",       value: "fluency"      },
    { label: "Worded",        value: "worded"       },
    { label: "Application",   value: "application"  },
    { label: "Mixed Review",  value: "mixed_review" },
    { label: "Repair",        value: "repair"       },
    { label: "Retrieval",     value: "retrieval"    },
    { label: "Diagnostic",    value: "diagnostic"   },
  ];
  const answerTypeOptions = [
    { label: "Multiple choice", value: "mcq" },
    { label: "Free response", value: "free_response" },
  ];

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-[#2e3248] bg-[#1a1d27] p-6">
        <div className="mb-4 text-sm font-bold text-[#f9c74f]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
          Configure generation
        </div>
        <div className="grid gap-4 sm:grid-cols-2 mb-4">
          <div><Label>Topic / Skill</Label><Select value={skillId} onChange={setSkillId} options={skills.map(s => ({ label: s.name, value: String(s.id) }))} /></div>
          <div><Label>Difficulty</Label><Select value={difficulty} onChange={setDifficulty} options={diffOptions} /></div>
          <div><Label>Question type</Label><Select value={questionType} onChange={setQuestionType} options={typeOptions} /></div>
          <div><Label>Number of questions</Label><Select value={count} onChange={setCount} options={countOptions} /></div>
        </div>

        {/* NEW: Answer type selector */}
        <div className="mb-4">
          <Label>Answer type</Label>
          <div className="flex gap-2">
            {answerTypeOptions.map(opt => {
              const active = answerType === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setAnswerType(opt.value as "mcq" | "free_response")}
                  className="flex-1 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all"
                  style={{
                    borderColor: active ? "#f9c74f" : "#2e3248",
                    backgroundColor: active ? "#f9c74f15" : "#0f1117",
                    color: active ? "#f9c74f" : "#8a8fa8",
                  }}
                >
                  {active ? "✓ " : ""}{opt.label}
                </button>
              );
            })}
          </div>
          {answerType === "free_response" && (
            <p className="mt-2 text-xs text-[#555a73]">
              Claude will write an expected answer instead of four options, and will grade student
              responses against it at answer time (accepting equivalent forms like 0.75 = 3/4 = 75%).
            </p>
          )}
        </div>

        <div className="mb-5">
          <Label>Past paper style reference (optional)</Label>
          {!paperFile ? (
            <label className="flex items-center gap-3 w-full cursor-pointer rounded-xl border border-dashed border-[#2e3248] bg-[#0f1117] px-4 py-3 text-sm text-[#555a73] hover:border-[#f9c74f40] hover:text-[#8a8fa8] transition-colors">
              <span>📄</span><span>Upload AQA / Edexcel past paper PDF</span>
              <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
            </label>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-[#4ade8044] bg-[#4ade8010] px-4 py-3">
              <span className="text-sm">📄</span>
              <span className="flex-1 text-sm text-[#4ade80] truncate">{paperFile.name}</span>
              {!paperBase64 && <span className="text-xs text-[#555a73]">Reading…</span>}
              {paperBase64 && <span className="text-xs text-[#4ade80]">✓ Ready</span>}
              <button onClick={clearPaper} className="text-xs text-[#555a73] hover:text-[#f87171] transition-colors">Remove</button>
            </div>
          )}
          <p className="mt-1.5 text-xs text-[#555a73]">Claude will match the phrasing, style, and complexity of the uploaded paper.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleGenerate} disabled={generating || !skillId}
            className="rounded-full bg-[#f9c74f] px-6 py-2.5 text-sm font-bold text-[#0f1117] transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {generating ? "Generating…" : "⚡ Generate questions"}
          </button>
          {generating && <span className="text-xs text-[#555a73]">{paperBase64 ? "Analysing paper + generating… 20–35s" : "This takes 10–20 seconds…"}</span>}
        </div>
        {generationError && <div className="mt-3 rounded-xl border border-[#f87171] bg-[#1e0f0f] px-4 py-3 text-xs text-[#f87171]">{generationError}</div>}
      </div>

      {questions.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 text-xs text-[#8a8fa8] flex-wrap">
              <span>{questions.length} generated</span>
              {savedCount > 0 && <span className="text-[#4ade80]">✓ {savedCount} saved</span>}
              {unsavedCount > 0 && <span className="text-[#555a73]">{unsavedCount} unsaved</span>}
            </div>
            {savedCount > 0 && (
              <button
                onClick={() => {
                  const firstSaved = questions.find(q => typeof q.savedId === "number");
                  if (firstSaved) onSwitchToQuestions(skillId, firstSaved.savedId as number);
                }}
                className="rounded-full border border-[#4ade8044] px-4 py-1.5 text-xs font-bold text-[#4ade80] hover:bg-[#4ade8015] transition-colors"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Edit saved questions →
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {questions.map((q, i) => {
              const isSaved = typeof q.savedId === "number";
              const isSaving = q.savedId === "saving";
              const isError = q.savedId === "error";
              const cfg = QUESTION_TYPE_CONFIG[q.question_type];

              return (
                <div key={i} className={`rounded-2xl border p-5 transition-all ${
                  isSaved ? "border-[#4ade8044] bg-[#4ade8008]" : "border-[#2e3248] bg-[#1a1d27]"
                }`}>
                  <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#555a73]">Q{i + 1}</span>
                      <span className="rounded-full bg-[#f9c74f15] border border-[#f9c74f30] px-2 py-0.5 text-xs text-[#f9c74f] capitalize">{q.difficulty}</span>
                      {q.answer_type === "free_response" && (
                        <span className="rounded-full bg-[#4ade8015] border border-[#4ade8030] px-2 py-0.5 text-xs text-[#4ade80]">free response</span>
                      )}
                      {cfg && (
                        <span className="rounded-full border px-2 py-0.5 text-xs font-semibold"
                          style={{ color: cfg.colour, backgroundColor: cfg.bg, borderColor: cfg.border }}>
                          {cfg.label}
                        </span>
                      )}
                    </div>

                    {isSaved ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#4ade80]">✓ Saved</span>
                        <button
                          onClick={() => onSwitchToQuestions(skillId, q.savedId as number)}
                          className="text-xs text-[#4ade80] underline underline-offset-2 hover:opacity-80 transition-opacity"
                          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                          Edit in questions →
                        </button>
                      </div>
                    ) : isError ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#f87171]">Failed to save</span>
                        <Btn onClick={() => saveQuestion(i)} variant="danger">Retry</Btn>
                      </div>
                    ) : (
                      <Btn onClick={() => saveQuestion(i)} disabled={isSaving} variant="success">
                        {isSaving ? "Saving…" : "Save question"}
                      </Btn>
                    )}
                  </div>

                  <div className="mb-4 text-base font-bold text-[#f1f0ee] leading-snug"
                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                    <MathText text={q.question_text} />
                  </div>

                  {/* Branch on answer type for the preview body */}
                  {q.answer_type === "free_response" ? (
                    <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#4ade8044] bg-[#4ade8010] px-4 py-3">
                      <span className="text-xs font-bold text-[#4ade80] uppercase tracking-wider">Expected answer</span>
                      <span className="text-base font-bold text-[#4ade80]"><MathText text={q.correct_answer ?? ""} /></span>
                    </div>
                  ) : (
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      {(["a","b","c","d"] as const).map(opt => {
                        const isCorrect = q.correct_option?.toLowerCase() === opt;
                        return (
                          <div key={opt} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${isCorrect ? "border-[#4ade8044] bg-[#4ade8010] text-[#4ade80]" : "border-[#2e3248] text-[#8a8fa8]"}`}>
                            <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${isCorrect ? "bg-[#4ade80] text-[#0d1f15]" : "bg-[#2e3248] text-[#8a8fa8]"}`}
                              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                              {opt.toUpperCase()}
                            </span>
                            <MathText text={(q as any)[`option_${opt}`]} />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {q.hints && q.hints.length > 0 && (
                    <div className="mb-4 flex flex-col gap-2">
                      {q.hints.map((hint, hi) => (
                        <div key={hi} className="rounded-xl border border-[#f9c74f22] bg-[#f9c74f08] px-3 py-2 flex items-start gap-2">
                          <span className="text-xs font-bold text-[#f9c74f] flex-shrink-0">💡 {hi + 1}</span>
                          <div className="text-xs text-[#f9c74f]"><MathText text={hint} /></div>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.misconceptions && q.misconceptions.length > 0 && (
                    <div className="mb-4 flex flex-col gap-2">
                      {q.misconceptions.map((m, mi) => (
                        <div key={mi} className="rounded-xl border border-[#f8717122] bg-[#f871710a] px-3 py-2">
                          <div className="text-xs font-bold text-[#f87171] mb-0.5">
                            ⚠ {q.answer_type === "free_response" ? m.wrong_option.replace(/_/g, " ") : `Option ${m.wrong_option.toUpperCase()}`}: {m.title}
                          </div>
                          <div className="text-xs text-[#c88]"><MathText text={m.description} /></div>
                        </div>
                      ))}
                    </div>
                  )}

                  <WorkedSolutionToggle solution={q.worked_solution} />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function WorkedSolutionToggle({ solution }: { solution: string }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)} className="text-xs text-[#818cf8] hover:opacity-80 transition-opacity"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
        {show ? "Hide worked solution ↑" : "Preview worked solution ↓"}
      </button>
      {show && (
        <div className="mt-2 rounded-xl border border-[#818cf833] bg-[#818cf808] px-4 py-3">
          <pre className="whitespace-pre-wrap font-mono text-xs text-[#a5b4fc] leading-relaxed">{solution}</pre>
        </div>
      )}
    </>
  );
}

// ── Main (inner — needs Suspense for useSearchParams) ──────────────────────
function AdminPageInner() {
  const searchParams = useSearchParams();

  const [authed, setAuthed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("revily_admin") === "1";
  });
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState<Tab>(() => {
    const t = searchParams.get("tab");
    return (t === "questions" || t === "skills" || t === "generate") ? t as Tab : "skills";
  });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [urlSkillFilter] = useState<string | null>(() => searchParams.get("skill"));
  const [questionsSkillFilter, setQuestionsSkillFilter] = useState<string | null>(null);
  const [highlightQuestionId, setHighlightQuestionId] = useState<number | null>(null);

  useEffect(() => {
    if (authed) {
      supabase.from("skills").select("*").order("order_index")
        .then(({ data }) => {
          if (data) setSkills(data.map(s => ({ ...s, prerequisites: s.prerequisites ?? [] })));
        });
    }
  }, [authed]);

  function handleLogin() {
    if (pw === ADMIN_PASSWORD) { sessionStorage.setItem("revily_admin", "1"); setAuthed(true); setPwError(false); }
    else { setPwError(true); }
  }

  function handleSwitchToQuestions(skillId: string, questionId: number) {
    setQuestionsSkillFilter(skillId);
    setHighlightQuestionId(questionId);
    setTab("questions");
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1117] px-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="w-full max-w-sm rounded-2xl border border-[#2e3248] bg-[#1a1d27] p-8">
          <div className="mb-6 text-center">
            <div className="mb-1 text-2xl font-extrabold text-[#f9c74f]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Revily Admin</div>
            <div className="text-xs text-[#555a73]">Content management</div>
          </div>
          <Label>Password</Label>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Enter admin password"
            className="w-full rounded-xl border border-[#2e3248] bg-[#0f1117] px-3 py-2 text-sm text-[#f1f0ee] placeholder-[#555a73] focus:border-[#f9c74f] focus:outline-none transition-colors mb-3" />
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

  const tabs: { key: Tab; label: string }[] = [
    { key: "skills",    label: "Skills"    },
    { key: "questions", label: "Questions" },
    { key: "generate",  label: "⚡ Generate" },
  ];

  return (
    <div className="min-h-screen bg-[#0f1117] px-4 pb-16 pt-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-2xl font-extrabold text-[#f9c74f]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Revily Admin</div>
            <div className="text-xs text-[#555a73]">Content management</div>
          </div>
          <button onClick={() => { sessionStorage.removeItem("revily_admin"); setAuthed(false); }}
            className="text-xs text-[#555a73] hover:text-[#f1f0ee] transition-colors">Sign out</button>
        </div>

        <div className="mb-6 flex gap-1 rounded-2xl border border-[#2e3248] bg-[#1a1d27] p-1 w-fit">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${tab === t.key ? "bg-[#f9c74f] text-[#0f1117]" : "text-[#8a8fa8] hover:text-[#f1f0ee]"}`}
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "skills"    && <SkillsTab />}
        {tab === "questions" && (
          <QuestionsTab
            skills={skills}
            initialSkillFilter={questionsSkillFilter ?? urlSkillFilter}
            highlightQuestionId={highlightQuestionId}
          />
        )}
        {tab === "generate"  && (
          <GenerateTab
            skills={skills}
            onSwitchToQuestions={handleSwitchToQuestions}
          />
        )}
      </div>
    </div>
  );
}

// ── Default export — wraps in Suspense for useSearchParams ─────────────────
export default function AdminPage() {
  return (
    <Suspense>
      <AdminPageInner />
    </Suspense>
  );
}