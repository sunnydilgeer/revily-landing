'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getScienceLessons, scienceHubHref, type ScienceVariant } from './lessonNavigation'
import { assessmentResources, copyrightPolicy, coverageTopics, coverageLessonHref, initialPaperMappings, mappingStorageKey, paperLink, readinessLabels, restoreMappings, validMapping, type PaperMapping, type Readiness } from './examPreparation'
import './ScienceLesson.css'
import './FriendlyLesson.css'
import './ExamPreparation.css'

export default function ExamCoverageMap({ variant }: { variant: ScienceVariant }) {
  const [entries, setEntries] = useState<PaperMapping[]>(initialPaperMappings)
  const [ready, setReady] = useState(false)
  const [notice, setNotice] = useState('')
  const [storage, setStorage] = useState(true)
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState<string | null>(null)
  const [year, setYear] = useState('2023')
  const [series, setSeries] = useState<'June' | 'November'>('June')
  const [question, setQuestion] = useState('')
  const [marks, setMarks] = useState('')
  const [topics, setTopics] = useState<string[]>([])
  const [readiness, setReadiness] = useState<Readiness>('partial')
  const [additional, setAdditional] = useState('')
  const [checked, setChecked] = useState(false)
  const [reviewer, setReviewer] = useState('')
  useEffect(() => {
    try {
      const raw = localStorage.getItem(mappingStorageKey)
      if (raw) {
        let restored: PaperMapping[] | null = null
        try { restored = restoreMappings(JSON.parse(raw)) } catch { /* Invalid records must not look verified. */ }
        if (restored) setEntries(restored)
        else setNotice('Saved mapping data could not be read. Showing pending source references instead.')
      }
    } catch { setStorage(false) }
    setReady(true)
  }, [])
  function edit(entry: PaperMapping) {
    setEditing(entry.id); setYear(String(entry.year)); setSeries(entry.series); setQuestion(entry.question)
    setMarks(entry.marks === null ? '' : String(entry.marks)); setTopics(entry.topicIds); setReadiness(entry.readiness)
    setAdditional(entry.additionalKnowledge); setChecked(false); setReviewer(entry.reviewer); setNotice('Editing a mapping. Reconfirm the source check before saving it as teacher-checked.')
  }
  function save() {
    const entry: PaperMapping = { id: editing || crypto.randomUUID(), year: Number(year), series, question: question.trim(), marks: marks.trim() ? Number(marks) : null,
      topicIds: topics, readiness, additionalKnowledge: additional.trim(), review: checked ? 'teacherChecked' : 'pending', reviewer: reviewer.trim(), checkedAt: checked ? new Date().toISOString() : null }
    if (!validMapping(entry)) { setNotice('Check the year (2018–2025), sub-question (e.g. 01.2) and marks (1–12). Ready mappings need a linked topic. Partial/not-taught mappings need a knowledge-gap note. Teacher-checked mappings also need marks and a reviewer name.'); return }
    const next = editing ? entries.map(e => e.id === editing ? entry : e) : [...entries, entry]
    if (!restoreMappings(next)) { setNotice('That paper sub-question already has a record, or the 100-record limit has been reached. Edit its existing record instead.'); return }
    setEntries(next)
    try { localStorage.setItem(mappingStorageKey, JSON.stringify(next)) }
    catch { setStorage(false) }
    setEditing(null); setQuestion(''); setMarks(''); setTopics([]); setChecked(false); setAdditional(''); setReadiness('partial')
    setNotice('Mapping saved. This is a local teacher record, not an independent source verification or an AQA endorsement.')
  }
  function exportMetadata() {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ qualification: 'AQA-8464F', paper: '8464/B/1F', entries }, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a'); link.href = url; link.download = 'revily-science-exam-map.json'; link.click(); URL.revokeObjectURL(url)
  }
  const visible = entries.filter(e => filter === 'all' || (filter === 'pending' ? e.review === 'pending' : e.review === 'teacherChecked' && e.readiness === filter))
  return <div className="science-preview science-preview--revision">
    <header className="science-header"><Link className="science-brand" href="/" aria-label="Revily home"><span aria-hidden="true">R</span><strong>Revily</strong></Link><Link href={scienceHubHref(variant)}>All lessons</Link></header>
    <main className="science-course exam-preparation">
      <span className="science-eyebrow">Teacher planning · AQA 8464 Foundation</span><h1>From lessons to exam practice</h1>
      <p>Our six lessons cover Cell Biology, not the whole Science GCSE or all of Biology Paper 1. Teaching coverage is not proof that a learner is ready.</p>
      <nav className="exam-links" aria-label="Exam preparation resources"><Link href={`/preview/science/exam?variant=${variant}`}>Try Lesson 6 exam practice</Link><a href={assessmentResources} target="_blank" rel="noreferrer">Official AQA assessment resources</a></nav>
      <section className="exam-panel"><h2>1. Our teaching coverage</h2><p>18 topic areas, linked to the exact teaching screen in Variant {variant.toUpperCase()}. All lessons remain drafts awaiting qualified teacher review.</p>
        {getScienceLessons(variant).map(lesson => <details className="exam-lesson" key={lesson.number} open><summary>Lesson {lesson.number} · {lesson.title}</summary><ul>{coverageTopics.filter(t => t.lesson === lesson.number).map(topic => <li key={topic.id}><Link href={coverageLessonHref(topic, variant)}>{topic.title}</Link><p>{topic.skills}</p><small>Specification: {topic.spec} · Screen {topic.activity}</small></li>)}</ul></details>)}
      </section>
      <section className="exam-panel"><h2>2. Past-paper sub-question register</h2><p>Paper: 8464/B/1F only. No verified matches are preloaded. The three pending June 2023 references below come from Lesson 1’s existing source list; their exact content, marks and coverage have not been checked here.</p>
        <p>For a real question, check every prerequisite against the teaching map—not just its main topic. “Ready” means the knowledge has been taught, not that a student has mastered it. Public-release status and each generated paper link must also be checked before assigning it.</p>
        <div className="exam-controls"><label>Show mappings<select value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All records</option><option value="pending">Pending review</option><option value="ready">Teacher-checked · ready</option><option value="partial">Teacher-checked · partly covered</option><option value="notTaught">Teacher-checked · not taught yet</option></select></label><button type="button" disabled={!ready} onClick={exportMetadata}>Export mapping metadata</button></div>
        <p role="status">{entries.filter(e => e.review === 'teacherChecked').length} teacher-checked · {entries.filter(e => e.review === 'pending').length} pending{!ready ? ' · Loading local records…' : ''}</p>
        <ul className="exam-records">{visible.map(entry => <li key={entry.id}><h3>{entry.series} {entry.year} · Q{entry.question} · {entry.marks === null ? 'Marks unverified' : `${entry.marks} marks`}</h3><p>{entry.review === 'pending' ? 'Pending review · readiness unverified' : `${readinessLabels[entry.readiness]} · checked by ${entry.reviewer} on ${entry.checkedAt!.slice(0, 10)}`}</p><ul>{entry.topicIds.map(id => { const topic = coverageTopics.find(t => t.id === id)!; return <li key={id}><Link href={coverageLessonHref(topic, variant)}>Lesson {topic.lesson}: {topic.title}</Link></li> })}</ul>{entry.additionalKnowledge && <p>Review / additional knowledge: {entry.additionalKnowledge}</p>}<div className="exam-links"><a href={paperLink(entry, 'QP')} target="_blank" rel="noreferrer">Question paper (check availability)</a><a href={paperLink(entry, 'MS')} target="_blank" rel="noreferrer">Mark scheme (check availability)</a><button type="button" disabled={!ready} onClick={() => edit(entry)}>Edit Q{entry.question} mapping</button></div></li>)}</ul>
        {!visible.length && <p>No records match this filter.</p>}
      </section>
      <section className="exam-panel"><h2>3. {editing ? 'Edit' : 'Add'} a teacher mapping</h2><p>Record bibliographic metadata and your own coverage notes only. Do not paste exam questions, diagrams, mark schemes or examiner-report text into this form.</p>
        <form onSubmit={e => { e.preventDefault(); save() }}>
          <div className="exam-form-grid"><label>Exam year<input type="number" min="2018" max="2025" value={year} onChange={e => setYear(e.target.value)} required /></label><label>Series<select value={series} onChange={e => setSeries(e.target.value as 'June' | 'November')}><option>June</option><option>November</option></select></label><label>Sub-question number<input placeholder="01.2" value={question} onChange={e => setQuestion(e.target.value)} required maxLength={5} /></label><label>Marks (leave blank if unverified)<input type="number" min="1" max="12" value={marks} onChange={e => setMarks(e.target.value)} /></label></div>
          <fieldset><legend>Teaching sections needed (choose every relevant section)</legend><div className="exam-topic-options">{coverageTopics.map(t => <label key={t.id}><input type="checkbox" checked={topics.includes(t.id)} onChange={e => setTopics(e.target.checked ? [...topics, t.id] : topics.filter(id => id !== t.id))} />L{t.lesson} · {t.title}</label>)}</div></fieldset>
          <label>Proposed coverage<select value={readiness} onChange={e => setReadiness(e.target.value as Readiness)}>{Object.entries(readinessLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label>Additional knowledge needed / original review note<textarea value={additional} onChange={e => setAdditional(e.target.value)} maxLength={1500} rows={3} /></label>
          <label className="exam-check"><input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} />I checked the publicly released question, its mark scheme, marks, links and all prerequisites, and am recording my teacher review.</label>
          <label>Reviewer name<input value={reviewer} onChange={e => setReviewer(e.target.value)} maxLength={100} /></label>
          <button type="submit" disabled={!ready}>Save mapping</button>{editing && <button type="button" onClick={() => { setEditing(null); setQuestion(''); setMarks(''); setTopics([]); setAdditional(''); setChecked(false); setReadiness('partial') }}>Cancel editing</button>}
        </form>
        <p role="status">{notice}</p><p>{storage ? 'Mappings stay in this browser. Export metadata for a review handoff. A and B share this curriculum map; learner progress is unchanged.' : 'Browser storage is unavailable. Records can be viewed or edited for this visit, but may not survive reload. Export metadata to keep a copy.'}</p>
      </section>
      <aside className="exam-panel"><h2>Source and permission boundaries</h2><p>These links do not grant permission to reproduce AQA content or put it into an AI workflow. Clear the planned use with AQA before importing official material into Revily. Do not use secure or unreleased papers. The Lesson 6 pilot uses original Revily questions and draft marking guidance, not official AQA questions or mark schemes.</p><a href={copyrightPolicy} target="_blank" rel="noreferrer">Read AQA’s copyright and AI policy</a></aside>
    </main>
  </div>
}
