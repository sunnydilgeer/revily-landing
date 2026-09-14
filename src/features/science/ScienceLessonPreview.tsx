'use client'

import { useEffect, useReducer, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, ChevronUp, Lightbulb, RotateCcw, X } from 'lucide-react'
import { scienceLessons, scienceLessonHref } from './lessonNavigation'
import { ExplanationSteps } from '../number-types/components/ExplanationSteps'
import { evidenceProfile, progress, recommendedNext, retrievalDueAt } from './engine'
import { lesson1 } from './lesson-1/lesson'
import { lesson2, microscopySections } from './lesson-2/lesson'
import { microscopyFrames } from './lesson-2/teachingFrames'
import { lesson3, practicalSections } from './lesson-3/lesson'
import { practicalFrames } from './lesson-3/teachingFrames'
import { createPreviewSessionEngine } from './previewSession'
import type { PreviewSession, SessionAction } from './previewSession'
import { CellModel } from './components/CellModel'
import { TeachingChunk, WorkedReasoning } from './components/TeachingChunk'
import { AreaModel } from './components/OtherCellModels'
import { MicroscopyVisual } from './components/MicroscopyVisuals'
import { PracticalVisual } from './components/PracticalVisuals'
import { cellBiologySequence, scienceCurriculum } from './curriculum'
import type { EvidenceDimension, ScienceState } from './types'
import './ScienceLesson.css'
import './FriendlyLesson.css'

const cellsSections = [
  { id: 'B1-01', label: 'Start here', detail: 'Your starting knowledge' },
  { id: 'B1-02', label: 'Animal cells', detail: 'Meet the cell and explore its parts' },
  { id: 'B1-05', label: 'Animal cells: energy and proteins', detail: 'Mitochondria and ribosomes' },
  { id: 'B1-10', label: 'Models and observations', detail: 'A first practical connection' },
  { id: 'B1-24', label: 'Plant cells', detail: 'Meet the cell and explore its parts' },
  { id: 'B1-42', label: 'Plant cells: more jobs', detail: 'Energy, proteins, support and food' },
  { id: 'B1-41', label: 'Compare animal and plant cells', detail: 'Observe similarities and differences' },
  { id: 'B1-27', label: 'Bacterial cells', detail: 'Meet the cell, DNA loop and plasmids' },
  { id: 'B1-22', label: 'Names for the cells', detail: 'Eukaryotic and prokaryotic' },
  { id: 'B1-29', label: 'Cell sizes and area', detail: 'Units, standard form and estimates' },
  { id: 'B1-12', label: 'Try it yourself', detail: 'Independent checks' },
  { id: 'B1-19', label: 'Exam-style transfer', detail: 'Apply and explain' },
  { id: 'B1-32', label: 'Plant, bacterial and maths checks', detail: 'Independent checks across the new scope' },
  { id: 'B1-21', label: 'Compare two cells', detail: 'Final written task' },
]
const dimensionLabels: Record<EvidenceDimension, string> = {
  recall: 'Recall', understanding: 'Understanding', application: 'Application', explanation: 'Written explanation',
  practicalReasoning: 'Practical reasoning', dataInterpretation: 'Evidence interpretation', calculation: 'Calculation',
}
function newSessionId() { return window.crypto.randomUUID() }
const sessionEngines = { 1: createPreviewSessionEngine(lesson1), 2: createPreviewSessionEngine(lesson2), 3: createPreviewSessionEngine(lesson3) }

export default function ScienceLessonPreview({ lessonNumber = 1 }: { lessonNumber?: 1 | 2 | 3 }) {
  const lesson = { 1: lesson1, 2: lesson2, 3: lesson3 }[lessonNumber]
  const sections = { 1: cellsSections, 2: microscopySections, 3: practicalSections }[lessonNumber]
  const { createPreviewSession, previewReducer, restorePreviewSession, storageKey } = sessionEngines[lessonNumber]
  function reducer(session: PreviewSession, action: SessionAction | { type: 'restore'; session: PreviewSession }) {
    return action.type === 'restore' ? action.session : previewReducer(session, action)
  }
  const [session, dispatch] = useReducer(reducer, createPreviewSession('loading'))
  const [ready, setReady] = useState(false)
  const [storageAvailable, setStorageAvailable] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [resetConfirm, setResetConfirm] = useState(false)
  const [clearPracticeHistory, setClearPracticeHistory] = useState(false)
  const [repairOpen, setRepairOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const menuPanel = useRef<HTMLDivElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const previousId = useRef<string | null>('loading')
  const state = lesson.states.find(s => s.id === session.currentId)
  const stateIndex = state ? lesson.states.indexOf(state) : lesson.states.length
  const submitted = state ? session.answers[state.id] : undefined
  const hintOpen = Boolean(state && session.hintsOpen.includes(state.id))
  const completion = progress(lesson, session.completedIds)
  const now = () => new Date().toISOString()
  const expose = () => dispatch({ type: 'exposure', at: now() })

  useEffect(() => {
    let restored: PreviewSession | null = null
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw) {
        try { restored = restorePreviewSession(JSON.parse(raw)) }
        catch { /* Corrupt data resets the preview; browser storage may still be usable. */ }
      }
    } catch { setStorageAvailable(false) }
    dispatch({ type: 'restore', session: restored || createPreviewSession(newSessionId()) })
    setReady(true)
  }, [createPreviewSession, restorePreviewSession, storageKey])
  useEffect(() => {
    if (!ready || session.lessonId !== lesson.id) return
    try { window.localStorage.setItem(storageKey, JSON.stringify(session)) }
    catch { setStorageAvailable(false) }
  }, [session, ready, storageKey, lesson.id])
  useEffect(() => {
    if (!ready || previousId.current === session.currentId) return
    const firstLoad = previousId.current === 'loading'
    previousId.current = session.currentId
    setRepairOpen(false)
    if (!firstLoad) {
      heading.current?.focus({ preventScroll: true })
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    if (state?.kind === 'teaching' || submitted) dispatch({ type: 'exposure', at: new Date().toISOString() })
  }, [session.currentId, ready, state?.kind, submitted])
  useEffect(() => {
    if (menuOpen) menuPanel.current?.querySelector<HTMLButtonElement>('button')?.focus()
  }, [menuOpen])

  function closeMenu() { setMenuOpen(false); setResetConfirm(false); setClearPracticeHistory(false); menuButton.current?.focus() }
  function jump(id: string) { dispatch({ type: 'jump', id }); closeMenu() }
  function restart() {
    dispatch({ type: 'restart', sessionId: newSessionId(), clearPracticeHistory }); closeMenu()
  }
  function submit(response: string) {
    dispatch({ type: 'answer', response, at: now() })
  }
  const profile = evidenceProfile(lesson, Object.values(session.answers))
  const next = recommendedNext(profile, false, lesson)
  const selectedOption = state?.kind === 'choice' ? state.options.find(o => o.id === submitted?.response) : undefined
  const misconception = selectedOption?.misconceptionSignal
    ? lesson.misconceptions.find(m => m.id === selectedOption.misconceptionSignal) : undefined

  return <div className="science-preview science-preview--revision" onKeyDown={event => {
    if (!menuOpen) return
    if (event.key === 'Escape') { event.preventDefault(); closeMenu() }
    if (event.key === 'Tab') {
      const elements = [menuButton.current, ...Array.from(menuPanel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), summary') || [])].filter(Boolean) as HTMLElement[]
      const first = elements[0], last = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
  }}>
    <header className="science-header">
      <a className="science-brand" href="/" aria-label="Revily home"><span aria-hidden="true">R</span><strong>Revily</strong></a>
      <Link className="science-header__subject science-all-lessons" href="/preview/science"><ArrowLeft size={15} aria-hidden="true" /> All lessons</Link>
      <button ref={menuButton} className="science-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="science-lesson-menu" onClick={() => menuOpen ? closeMenu() : setMenuOpen(true)}>Lesson menu {menuOpen ? <X size={16} /> : <ChevronDown size={16} />}</button>
    </header>
    {menuOpen && <div className="science-menu" id="science-lesson-menu" ref={menuPanel} role="region" aria-label="Science lesson menu">
      <div className="science-menu__heading"><div><span className="science-eyebrow">Local preview</span><h2>Explore the lesson</h2></div><button className="science-icon-button" type="button" aria-label="Close lesson menu" onClick={closeMenu}><X size={19} /></button></div>
      <nav className="science-lesson-picker" aria-label="Switch science lesson">{scienceLessons.map(item => <Link key={item.number} href={scienceLessonHref(item.number)} aria-current={item.number === lessonNumber ? 'page' : undefined}><span>{item.number}</span>{item.title}</Link>)}</nav>
      <p className="science-muted">Jump to a section to inspect the prototype. Skipping screens does not count as completion.</p>
      <nav className="science-menu__sections" aria-label="Preview sections">{sections.map(section => <button type="button" key={section.id} onClick={() => jump(section.id)}><strong>{section.label}</strong><span>{section.detail}</span><ArrowRight size={16} /></button>)}</nav>
      <details className="science-curriculum"><summary>Where this lesson fits</summary><p>AQA Combined Science: Trilogy · Foundation. Cells, Microscopy and Practical skills are built drafts; subsequent lessons are planned.</p><ol>{cellBiologySequence.map(item => <li key={item.title}><strong>{item.title}</strong><span>{item.status} · {item.spec}</span></li>)}</ol>{scienceCurriculum.map(strand => <section key={strand.strand}><h3>{strand.strand}</h3>{strand.papers.map(paper => <p key={paper.paper}>Paper {paper.paper}: {paper.topics.map(([code, title]) => `${code} ${title}`).join(' · ')}</p>)}</section>)}<p>Working scientifically, maths and practical skills run across all three subjects. Completing this lesson does not complete the microscopy required practical.</p></details>
      <div className="science-menu__footer"><Link href="/preview/science">All science lessons <ArrowRight size={15} /></Link><a href="/preview">Open Maths preview <ArrowRight size={15} /></a><button type="button" className="science-text-button" onClick={() => setResetConfirm(true)}><RotateCcw size={14} /> Restart local preview</button></div>
      {resetConfirm && <div className="science-reset-confirm"><p>Restart this lesson? Submitted answers will normally be remembered as previously seen, so a repeat is practice rather than fresh evidence.</p><label className="science-reset-confirm__history"><input type="checkbox" checked={clearPracticeHistory} onChange={event => setClearPracticeHistory(event.target.checked)} /> Clear this lesson’s local practice history too</label>{clearPracticeHistory && <p>This resets only this lesson’s local preview record. Use it to test a fresh lesson; it does not change any account or production learning history.</p>}<div><button type="button" className="science-secondary" onClick={() => { setResetConfirm(false); setClearPracticeHistory(false) }}>Keep my progress</button><button type="button" className="science-primary" onClick={restart}>Restart lesson</button></div></div>}
      <p className="science-menu__note">{storageAvailable ? 'Progress is saved on this browser only. No account or production mastery records are updated.' : 'Browser storage is unavailable. Progress lasts only while this page stays open.'}</p>
    </div>}
    <main className="science-main" aria-busy={!ready} inert={menuOpen || undefined}>
      <div className="science-topic"><div><span className="science-eyebrow">B1 Cell biology · Lesson {lessonNumber}</span><h1>{lesson.title}</h1></div><span className="science-topic__count">{state ? `${stateIndex + 1} / ${lesson.states.length}` : `${completion.completed} / ${completion.total}`}</span></div>
      <div className="science-progress" role="progressbar" aria-label="Lesson completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(completion.fraction * 100)}><span style={{ width: `${completion.fraction * 100}%` }} /></div>
      {!ready ? <article className="science-activity"><p className="science-muted">Opening your lesson…</p></article> : state ? <article className="science-activity" data-state-id={state.id}>
        {state.kind !== 'teaching' && state.exam && <div className="science-activity__meta"><span className="science-exam-label">Exam-style · {state.exam.marks} {state.exam.marks === 1 ? 'mark' : 'marks'}</span></div>}
        {state.kind === 'teaching' && state.media ? <>
          <TeachingChunk state={state} customFrames={lessonNumber === 3 ? practicalFrames[state.id] : lessonNumber === 2 ? microscopyFrames[state.id] : undefined} onExposure={expose} suspended={menuOpen} headingRef={heading} key={state.id} />
        </> : state.kind === 'teaching' && state.steps ? <>
          <h2 ref={heading} tabIndex={-1} className="science-question science-question--teach">{state.title}</h2>
          <WorkedReasoning state={state} onExposure={expose} key={state.id} />
        </> : <>
          <LessonVisual state={state} feedbackVisible={Boolean(submitted)} />
          <h2 ref={heading} tabIndex={-1} className="science-question">{state.title}</h2>
          {state.kind === 'teaching' && <p className="science-body">{state.body}</p>}
          {state.kind === 'choice' && <div className="science-choices" role="group" aria-label="Choose one answer">{state.options.map(option => {
            const selected = submitted?.response === option.id
            const correct = submitted && option.id === state.answerId
            const status = correct ? 'correct' : selected ? 'incorrect' : 'neutral'
            return <button type="button" key={option.id} disabled={Boolean(submitted)} aria-pressed={selected || false} aria-label={`${option.label}${submitted ? correct ? ', correct answer' : selected ? ', your answer, incorrect' : '' : ''}`} className={`science-choice science-choice--${status}`} onClick={() => submit(option.id)}><span>{option.label}</span>{correct ? <Check size={19} aria-hidden="true" /> : selected ? <X size={19} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}</button>
          })}</div>}
          {state.kind === 'written' && <form className="science-written" onSubmit={event => { event.preventDefault(); if (!submitted && session.drafts[state.id]?.trim()) submit(session.drafts[state.id]) }}>
            <label htmlFor="science-written-answer">Your explanation</label>
            <textarea id="science-written-answer" maxLength={2000} rows={4} value={submitted?.response ?? session.drafts[state.id] ?? ''} disabled={Boolean(submitted)} placeholder={state.placeholder || 'An animal cell has…, whereas a bacterial cell… . Give two differences.'} onChange={event => dispatch({ type: 'draft', response: event.target.value })} />
            {!submitted && <div className="science-written__footer"><span>{state.instruction || 'Two short, paired comparisons are enough.'}</span><button type="submit" className="science-primary" disabled={!session.drafts[state.id]?.trim()}>Save response <ArrowRight size={16} /></button></div>}
          </form>}
        </>}
        {state.kind !== 'teaching' && <div className="science-hint"><button type="button" className="science-hint__toggle" aria-expanded={hintOpen} aria-controls={`hint-${state.id}`} onClick={() => dispatch({ type: 'hint' })}><Lightbulb size={16} aria-hidden="true" /> Hint {hintOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>{hintOpen && <p id={`hint-${state.id}`}>{state.hint}</p>}</div>}
        {state.kind !== 'teaching' && submitted && <section className={`science-feedback science-feedback--${submitted.result}`} aria-label="Answer feedback" aria-live="polite">
          <p className="science-feedback__result">{submitted.result === 'correct' ? <><Check size={17} aria-hidden="true" /> That’s right</> : submitted.result === 'pendingTeacherReview' ? <><BookOpen size={17} aria-hidden="true" /> Response saved · awaiting teacher review</> : 'Let’s work through it'}</p>
          {submitted.result === 'incorrect' && selectedOption?.feedback && <p className="science-feedback__correction">{selectedOption.feedback}</p>}
          <ExplanationSteps explanation={{ steps: state.explanation.steps.map(line => ({ title: '', lines: [line] })), answer: state.explanation.answer, answerLabel: state.kind === 'written' ? 'Model answer' : 'Answer' }} />
          {state.kind === 'written' && <p className="science-feedback__note">This preview does not auto-mark written reasoning. A saved response is not evidence of a correct explanation.</p>}
          {state.kind === 'written' && <details className="science-marking-guide"><summary>View the {state.rubric.marks}-mark draft marking guide</summary><ol>{state.rubric.points.map(point => <li key={point}>{point}</li>)}</ol><p>Do not credit a contradictory claim such as:</p><ul>{state.rubric.reject.map(point => <li key={point}>{point}</li>)}</ul></details>}
          {submitted.answerPreviouslySeen && <p className="science-feedback__note">Previously seen item: this attempt counts as practice.</p>}
          {submitted.result === 'incorrect' && misconception && <div className="science-repair"><button type="button" className="science-text-button" aria-expanded={repairOpen} onClick={() => setRepairOpen(open => !open)}>{repairOpen ? 'Hide' : 'Take a closer look'} {repairOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>{repairOpen && <p>{misconception.correction}</p>}</div>}
        </section>}
        <div className="science-actions">{stateIndex > 0 && <button type="button" className="science-text-button" onClick={() => dispatch({ type: 'jump', id: lesson.states[stateIndex - 1].id })}><ArrowLeft size={16} /> Back</button>}{(state.kind === 'teaching' || submitted) && <button type="button" className="science-primary" onClick={() => dispatch({ type: 'continue', at: now() })}>{stateIndex === lesson.states.length - 1 ? 'See lesson summary' : 'Continue'} <ArrowRight size={17} /></button>}</div>
      </article> : <article className="science-activity science-summary">
        <div className="science-summary__icon"><Check size={28} aria-hidden="true" /></div>
        <span className="science-eyebrow">Your learning, dimension by dimension</span>
        <h2 className="science-question" ref={heading} tabIndex={-1}>{completion.fraction === 1 ? 'Lesson complete' : 'Your preview summary'}</h2>
        <p className="science-body">{completion.fraction === 1 ? 'You’ve reached the end. Completing a lesson and mastering its ideas are different things.' : `You completed ${completion.completed} of ${completion.total} screens. Skipped activities do not count as learning evidence.`}</p>
        <div className="science-evidence">{(['recall', 'understanding', 'application', 'explanation', 'practicalReasoning', 'dataInterpretation', 'calculation'] as EvidenceDimension[]).map(dimension => {
          const status = profile.dimensions[dimension]
          const pending = dimension === 'explanation' && profile.pendingReview.length > 0
          const label = pending ? 'Awaiting review' : status === 'secureInSession' ? 'Secure this session' : status === 'retained' ? 'Sampled retention' : status === 'developing' ? (dimension === 'practicalReasoning' || dimension === 'dataInterpretation' ? 'Introduced · practice only' : 'Developing') : 'Not assessed'
          return <div key={dimension}><span>{dimensionLabels[dimension]}</span><strong className={`science-evidence__status science-evidence__status--${pending ? 'pending' : status}`}>{label}</strong></div>
        })}</div>
        <div className="science-next"><span className="science-eyebrow">Suggested next step</span><h3>{completion.fraction !== 1 ? 'Finish the remaining activities' : next.kind === 'repair' ? (lessonNumber === 3 ? 'Revisit practical methods and drawings' : lessonNumber === 2 ? 'Revisit microscopy and calculations' : 'Revisit cells and calculations') : lessonNumber === 3 ? 'Next: supervised microscope practice' : lessonNumber === 2 ? 'Next: microscope practical skills' : 'Next: microscopy'}</h3><p>{completion.fraction !== 1 ? 'The preview menu lets you inspect any screen. For a full lesson, return to the first unfinished activity.' : next.kind === 'repair' ? 'Replay the relevant teaching and worked examples as practice. Fresh repair questions are not built yet.' : lessonNumber === 3 ? 'Use these methods in a teacher-supervised practical: observe real plant and animal cells, draw and label them, and include calibrated size information. Online completion does not verify equipment handling or complete required practical 1. Specialisation and differentiation is the next planned topic, not built yet.' : lessonNumber === 2 ? 'Lesson 3 is ready: prepare slides, focus safely and record biological drawings. This digital lesson does not complete required practical 1.' : 'Lesson 2 is ready: explore microscopes, resolution and magnification calculations. Digital lessons do not complete the required practical.'}</p>{completion.fraction === 1 && lessonNumber < 3 && <Link className="science-text-button" href={scienceLessonHref(lessonNumber === 1 ? 2 : 3)}>Open Lesson {lessonNumber + 1} <ArrowRight size={15} /></Link>}</div>
        {session.lastExposureAt && <p className="science-summary__retrieval">Delayed retrieval is not assessed yet. Earliest eligible check: <time dateTime={retrievalDueAt(session.lastExposureAt)}>{new Date(retrievalDueAt(session.lastExposureAt)).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</time>. Retrieval scheduling is not live in this preview.</p>}
        <div className="science-actions">{completion.fraction !== 1 ? <button className="science-primary" type="button" onClick={() => jump(lesson.states.find(s => !session.completedIds.includes(s.id))!.id)}>Return to unfinished activity <ArrowRight size={16} /></button> : <button className="science-secondary" type="button" onClick={() => jump(lessonNumber === 3 ? 'B3-02' : lessonNumber === 2 ? 'B2-02' : 'B1-02')}><RotateCcw size={16} /> Review the teaching</button>}</div>
      </article>}
      <p className="science-preview-note">AQA Combined Science: Trilogy · Foundation <span aria-hidden="true">/</span> Draft preview · teacher review pending</p>
      {!storageAvailable && <p className="science-storage-warning" role="status">Progress can’t be saved in this browser. Keep this page open while you explore.</p>}
    </main>
  </div>
}

function LessonVisual({ state, feedbackVisible }: { state: ScienceState; feedbackVisible: boolean }) {
  if (state.id === 'B3-01') return <PracticalVisual focus="onion" />
  if (state.id === 'B3-17') return <PracticalVisual focus="drawing-choice" />
  if (state.id === 'B2-01') return <MicroscopyVisual focus="light" />
  if (state.id === 'B1-01') return <div className="science-visual-panel science-visual-panel--opening"><CellModel description="A simplified model of a typical animal cell, not to scale. Colours distinguish structures; this is not a photograph." /></div>
  if (state.visual?.kind === 'cellModel') {
    const target = state.id === 'B1-03' || state.id === 'B1-20'
    return <div className="science-visual-panel"><CellModel pointer={target} alternate={state.visual.id === 'animal-cell-b'} labelled={!target || feedbackVisible} highlight={state.id === 'B1-09' ? 'nucleus' : undefined} description={target && !feedbackVisible ? state.visual.assessmentDescription : state.visual.accessibleDescription} /></div>
  }
  if (state.id === 'B1-10' || state.id === 'B1-11') return <div className="science-observation"><div className="science-observation__label"><BookOpen size={17} aria-hidden="true" /> An observation record</div><p>“In this prepared stained animal-cell view, a nucleus and cell outline were visible; tiny internal structures were not distinguished.”</p><span>Illustrative scenario · not a real micrograph</span></div>
  if (state.id === 'B1-06') return <div className="science-function-visual"><span>Structure</span><ArrowRight size={18} aria-hidden="true" /><span>Process</span><ArrowRight size={18} aria-hidden="true" /><span>Function</span></div>
  if (state.id === 'B1-35') return <AreaModel length={6} width={2} />
  if (state.id === 'B1-21') return <div className="science-context"><span className="science-eyebrow">Compare two structures</span><p>Animal cell <ArrowRight size={16} aria-hidden="true" /> Bacterial cell</p></div>
  return null
}
