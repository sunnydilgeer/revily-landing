'use client'

import { useEffect, useReducer, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, ChevronRight, ChevronUp, Lightbulb, ListTree, RotateCcw, X } from 'lucide-react'
import { getScienceHubLessons, getScienceLessons, scienceChapters, scienceHubHref, scienceLessonHref, type ScienceVariant } from './lessonNavigation'
import { ScienceVariantSwitch } from './components/ScienceVariantSwitch'
import { teachingFrames as cellsFramesB } from './variants/b/lesson-1/teachingFrames'
import { microscopyFrames as microscopyFramesB } from './variants/b/lesson-2/teachingFrames'
import { practicalFrames as practicalFramesB } from './variants/b/lesson-3/teachingFrames'
import { specialisationFrames as specialisationFramesB } from './variants/b/lesson-4/teachingFrames'
import { divisionFrames as divisionFramesB } from './variants/b/lesson-5/teachingFrames'
import { transportFrames as transportFramesB } from './variants/b/lesson-6/teachingFrames'
import { enzymeFrames as enzymeFramesB } from './variants/b/lesson-8/teachingFrames'
import { digestionFrames as digestionFramesB } from './variants/b/lesson-9/teachingFrames'
import { organisationFrames as organisationFramesB } from './variants/b/lesson-7/teachingFrames'
import { lungsFrames as lungsFramesB } from './variants/b/lesson-10/teachingFrames'
import { heartFrames as heartFramesB } from './variants/b/lesson-11/teachingFrames'
import { vesselsFrames as vesselsFramesB } from './variants/b/lesson-12/teachingFrames'
import { bloodFrames as bloodFramesB } from './variants/b/lesson-13/teachingFrames'
import { cardiovascularFrames as cardiovascularFramesB } from './variants/b/lesson-14/teachingFrames'
import { healthFrames as healthFramesB } from './variants/b/lesson-15/teachingFrames'
import { riskCancerFrames as riskCancerFramesB } from './variants/b/lesson-16/teachingFrames'
import { plantTissueFrames as plantTissueFramesB } from './variants/b/lesson-17/teachingFrames'
import { plantTransportFrames as plantTransportFramesB } from './variants/b/lesson-18/teachingFrames'
import { pathogenFrames as pathogenFramesB } from './variants/b/lesson-19/teachingFrames'
import { humanDiseaseFrames as humanDiseaseFramesB } from './variants/b/lesson-20/teachingFrames'
import { plantMalariaFrames as plantMalariaFramesB } from './variants/b/lesson-21/teachingFrames'
import { defenceFrames as defenceFramesB } from './variants/b/lesson-22/teachingFrames'
import { ExplanationSteps } from '../number-types/components/ExplanationSteps'
import { evidenceProfile, progress, recommendedNext, retrievalDueAt } from './engine'
import { lesson1 } from './lesson-1/lesson'
import { lesson2, microscopySections } from './lesson-2/lesson'
import { microscopyFrames } from './lesson-2/teachingFrames'
import { lesson3, practicalSections } from './lesson-3/lesson'
import { practicalFrames } from './lesson-3/teachingFrames'
import { lesson4, specialisationSections } from './lesson-4/lesson'
import { specialisationFrames } from './lesson-4/teachingFrames'
import { lesson5, divisionSections } from './lesson-5/lesson'
import { divisionFrames } from './lesson-5/teachingFrames'
import { lesson6, transportSections } from './lesson-6/lesson'
import { transportFrames } from './lesson-6/teachingFrames'
import { organisationSections } from './variants/b/lesson-7/lesson'
import { enzymeSections } from './variants/b/lesson-8/lesson'
import { digestionSections } from './variants/b/lesson-9/lesson'
import { lungsSections } from './variants/b/lesson-10/lesson'
import { heartSections } from './variants/b/lesson-11/lesson'
import { vesselsSections } from './variants/b/lesson-12/lesson'
import { bloodSections } from './variants/b/lesson-13/lesson'
import { cardiovascularSections } from './variants/b/lesson-14/lesson'
import { healthSections } from './variants/b/lesson-15/lesson'
import { riskCancerSections } from './variants/b/lesson-16/lesson'
import { plantTissueSections } from './variants/b/lesson-17/lesson'
import { plantTransportSections } from './variants/b/lesson-18/lesson'
import { pathogenSections } from './variants/b/lesson-19/lesson'
import { humanDiseaseSections } from './variants/b/lesson-20/lesson'
import { plantMalariaSections } from './variants/b/lesson-21/lesson'
import { defenceSections } from './variants/b/lesson-22/lesson'
import { CellBiologyVisual } from './components/CellBiologyVisuals'
import type { LessonNumber } from './lessonNavigation'
import { createCoachPreviewSessionEngine, createPreviewSessionEngine } from './previewSession'
import type { PreviewSession, SessionAction } from './previewSession'
import { CellModel } from './components/CellModel'
import { TeachingChunk, WorkedReasoning } from './components/TeachingChunk'
import { AreaModel } from './components/OtherCellModels'
import { MicroscopyVisual } from './components/MicroscopyVisuals'
import { PracticalVisual } from './components/PracticalVisuals'
import { cellBiologySequence, infectionSequence, organisationSequence, scienceCurriculum } from './curriculum'
import type { EvidenceDimension, ScienceState } from './types'
import './ScienceLesson.css'
import './FriendlyLesson.css'
import './AnatomyVisuals.css'

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
const sessionEngines: Record<number, ReturnType<typeof createPreviewSessionEngine>> = { 1: createPreviewSessionEngine(lesson1), 2: createPreviewSessionEngine(lesson2), 3: createPreviewSessionEngine(lesson3), 4: createPreviewSessionEngine(lesson4), 5: createPreviewSessionEngine(lesson5), 6: createPreviewSessionEngine(lesson6) }
const sessionEnginesB = Object.fromEntries(getScienceLessons('b').map(item => [item.number, createPreviewSessionEngine(item.lesson)]))
const coachEngines = Object.fromEntries(getScienceLessons('b').map(item => [item.number, createCoachPreviewSessionEngine(item.lesson)]))
const framesB = { 1: cellsFramesB, 2: microscopyFramesB, 3: practicalFramesB, 4: specialisationFramesB, 5: divisionFramesB, 6: transportFramesB, 7: organisationFramesB, 8: enzymeFramesB, 9: digestionFramesB, 10: lungsFramesB, 11: heartFramesB, 12: vesselsFramesB, 13: bloodFramesB, 14: cardiovascularFramesB, 15: healthFramesB, 16: riskCancerFramesB, 17: plantTissueFramesB, 18: plantTransportFramesB, 19: pathogenFramesB, 20: humanDiseaseFramesB, 21: plantMalariaFramesB, 22: defenceFramesB }
const transportStory = [
  { lesson: 9, title: 'Nutrients enter blood', route: 'Food becomes soluble molecules' },
  { lesson: 10, title: 'Oxygen enters blood', route: 'Air reaches the alveoli' },
  { lesson: 11, title: 'The heart pumps blood', route: 'Blood completes two linked circuits' },
  { lesson: 12, title: 'Vessels deliver and exchange', route: 'Blood reaches body cells and returns' },
] as const

export default function ScienceLessonPreview({ lessonNumber = 1, variant = 'a', initialActivity, experience = 'lessons' }: { lessonNumber?: LessonNumber; variant?: ScienceVariant; initialActivity?: string; experience?: 'lessons' | 'coach' }) {
  const isCoach = experience === 'coach'
  const hubHref = isCoach ? '/preview/scienceB' : scienceHubHref(variant)
  const lessonHref = (number: LessonNumber) => isCoach ? `/preview/scienceB?lesson=${number}` : scienceLessonHref(number, variant)
  const scienceLessons = getScienceHubLessons(variant)
  const lesson = scienceLessons.find(item => item.number === lessonNumber)!.lesson
  const currentLessonItem = scienceLessons.find(item => item.number === lessonNumber)!
  const nextLessonItem = scienceLessons.find(item => item.number === lessonNumber + 1)
  const practicalLesson = [3, 6, 8, 9].includes(lessonNumber)
  const sections = { 1: cellsSections, 2: microscopySections, 3: practicalSections, 4: specialisationSections, 5: divisionSections, 6: transportSections, 7: organisationSections, 8: enzymeSections, 9: digestionSections, 10: lungsSections, 11: heartSections, 12: vesselsSections, 13: bloodSections, 14: cardiovascularSections, 15: healthSections, 16: riskCancerSections, 17: plantTissueSections, 18: plantTransportSections, 19: pathogenSections, 20: humanDiseaseSections, 21: plantMalariaSections, 22: defenceSections }[lessonNumber]
  const customFrames = variant === 'b' ? framesB[lessonNumber] : { 1: undefined, 2: microscopyFrames, 3: practicalFrames, 4: specialisationFrames, 5: divisionFrames, 6: transportFrames }[lessonNumber]
  const { createPreviewSession, previewReducer, restorePreviewSession, storageKey } = (isCoach ? coachEngines : variant === 'b' ? sessionEnginesB : sessionEngines)[lessonNumber]
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
  const currentSectionIndex = sections.reduce((active, section, index) => {
    const startIndex = lesson.states.findIndex(item => item.id === section.id)
    return startIndex >= 0 && startIndex <= stateIndex ? index : active
  }, 0)
  const digestionPhase = lessonNumber === 9 && state
    ? stateIndex < lesson.states.findIndex(item => item.id === 'B9-13')
      ? { number: 1, title: 'Digestion', detail: 'Food becomes small, soluble molecules that can enter the blood.' }
      : { number: 2, title: 'Food tests', detail: 'Laboratory observations identify carbohydrates, proteins and lipids.' }
    : null
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
    const opening = restored || createPreviewSession(newSessionId())
    dispatch({ type: 'restore', session: initialActivity ? previewReducer(opening, { type: 'jump', id: initialActivity }) : opening })
    setReady(true)
  }, [createPreviewSession, restorePreviewSession, previewReducer, storageKey, initialActivity])
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
  useEffect(() => {
    if (!menuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
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
      const elements = [menuButton.current, ...Array.from(menuPanel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), summary') || [])].filter((element): element is HTMLElement => Boolean(element && element.getClientRects().length && (!element.closest('details:not([open])') || element.tagName === 'SUMMARY')))
      const first = elements[0], last = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
  }}>
    <header className="science-header">
      <a className="science-brand" href="/" aria-label="Revily home"><span aria-hidden="true">R</span><strong>Revily</strong></a>
      <nav className="science-breadcrumb" aria-label="Breadcrumb"><Link href={hubHref}>{isCoach ? 'Science Coach' : 'Science'}</Link><ChevronRight size={14} aria-hidden="true" /><span>Biology</span><ChevronRight size={14} aria-hidden="true" /><strong>{lessonNumber <= 6 ? 'Cell biology' : 'Organisation'}</strong></nav>
      <button ref={menuButton} className="science-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="science-lesson-menu" onClick={() => menuOpen ? closeMenu() : setMenuOpen(true)}><ListTree size={17} aria-hidden="true" /> Contents</button>
    </header>
    {menuOpen && <><button className="science-menu-backdrop" type="button" aria-label="Close course contents" onClick={closeMenu} /><aside className="science-menu" id="science-lesson-menu" ref={menuPanel} role="dialog" aria-modal="true" aria-label="Course contents">
      <div className="science-menu__heading"><div><h2>Course contents</h2><span>Biology · {scienceLessons.length} lessons</span></div><button className="science-icon-button" type="button" aria-label="Close course contents" onClick={closeMenu}><X size={19} /></button></div>
      <nav className="science-course-outline" aria-label="Biology course contents">{scienceChapters.map(chapter => <section key={chapter.code} className="science-course-outline__chapter" aria-labelledby={`outline-${chapter.code}`}>
        <h3 id={`outline-${chapter.code}`}>{chapter.code} · {chapter.title}</h3>
        <ol>{scienceLessons.filter(item => (chapter.lessonNumbers as readonly number[]).includes(item.number)).map(item => <li key={item.number} className={item.number === lessonNumber ? 'is-current' : undefined}>
          <Link href={lessonHref(item.number)} aria-current={item.number === lessonNumber ? 'page' : undefined}><span>{item.number}</span><strong>{item.title}</strong>{item.number === lessonNumber && <small>{completion.completed}/{completion.total}</small>}</Link>
          {item.number === lessonNumber && <ol className="science-course-outline__sections">{sections.map((section, index) => <li key={section.id}><button type="button" className={index === currentSectionIndex ? 'is-current' : undefined} aria-current={index === currentSectionIndex ? 'step' : undefined} onClick={() => jump(section.id)}><span>{section.label}</span></button></li>)}</ol>}
        </li>)}</ol>
      </section>)}</nav>
      <Link className="science-menu__all-lessons" href={hubHref}><ArrowLeft size={15} aria-hidden="true" /> {isCoach ? 'Science Coach home' : 'All science lessons'}</Link>
    </aside></>}
    <main className="science-main" aria-busy={!ready} inert={menuOpen || undefined}>
      <div className="science-topic"><div><span className="science-eyebrow">{lessonNumber <= 6 ? 'B1 Cell biology' : 'B2 Organisation'} · Lesson {lessonNumber}</span><h1>{lesson.title}</h1></div><span className="science-topic__count">{state ? `${stateIndex + 1} / ${lesson.states.length}` : `${completion.completed} / ${completion.total}`}</span></div>
      {lessonNumber >= 9 && lessonNumber <= 12 && <nav className="science-transport-story" aria-label="How Lessons 9 to 12 connect"><span className="science-eyebrow">The transport story</span><ol>{transportStory.map(item => <li key={item.lesson} className={item.lesson === lessonNumber ? 'is-current' : undefined}><Link href={lessonHref(item.lesson)} aria-current={item.lesson === lessonNumber ? 'page' : undefined}><span>{item.lesson}</span><strong>{item.title}</strong><small>{item.route}</small></Link></li>)}</ol></nav>}
      <div className="science-progress" role="progressbar" aria-label="Lesson completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(completion.fraction * 100)}><span style={{ width: `${completion.fraction * 100}%` }} /></div>
      {digestionPhase && <div className="science-lesson-phase"><span>Part {digestionPhase.number} of 2</span><div><strong>{digestionPhase.title}</strong><small>{digestionPhase.detail}</small></div></div>}
      {!ready ? <article className="science-activity"><p className="science-muted">Opening your lesson…</p></article> : state ? <article className="science-activity" data-state-id={state.id}>
        {state.kind !== 'teaching' && state.exam && <div className="science-activity__meta"><span className="science-exam-label">Exam-style · {state.exam.marks} {state.exam.marks === 1 ? 'mark' : 'marks'}</span></div>}
        {state.kind === 'teaching' && state.media ? <>
          <TeachingChunk state={state} customFrames={customFrames?.[state.id]} onExposure={expose} headingRef={heading} key={state.id} />
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
        {lessonNumber === 4 && state.id === 'B4-01' && <details className="science-marking-guide"><summary>Optional cells refresher</summary><p>A membrane controls entry and exit. A nucleus contains genetic information. Mitochondria release energy through aerobic respiration. Plant cell walls support cells. Specialised cells adapt these structures to a job.</p></details>}
        {lessonNumber === 5 && state.id === 'B5-01' && <details className="science-marking-guide"><summary>Optional nucleus refresher</summary><p>The nucleus contains genetic information. Chromosomes in the nucleus consist of DNA; a gene is a small section of DNA. This lesson connects that model to cell division.</p></details>}
        {state.kind !== 'teaching' && <div className="science-hint"><button type="button" className="science-hint__toggle" aria-expanded={hintOpen} aria-controls={`hint-${state.id}`} onClick={() => dispatch({ type: 'hint' })}><Lightbulb size={16} aria-hidden="true" /> Hint {hintOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>{hintOpen && <p id={`hint-${state.id}`}>{state.hint}</p>}</div>}
        {state.kind !== 'teaching' && submitted && <section className={`science-feedback science-feedback--${submitted.result}`} aria-label="Answer feedback" aria-live="polite">
          <p className="science-feedback__result">{submitted.result === 'correct' ? <><Check size={17} aria-hidden="true" /> That’s right</> : submitted.result === 'pendingTeacherReview' ? <><BookOpen size={17} aria-hidden="true" /> Response saved · awaiting teacher review</> : 'Let’s work through it'}</p>
          {submitted.result === 'incorrect' && selectedOption?.feedback && <p className="science-feedback__correction">{selectedOption.feedback}</p>}
          <ExplanationSteps explanation={{ steps: state.explanation.steps.map(line => ({ title: '', lines: [line] })), answer: state.explanation.answer, answerLabel: state.kind === 'written' ? 'Model answer' : 'Answer' }} />
          {state.kind === 'written' && <p className="science-feedback__note">This preview does not auto-mark written reasoning. A saved response is not evidence of a correct explanation.</p>}
          {state.kind === 'written' && <details className="science-marking-guide"><summary>View the {state.rubric.marks}-mark draft marking guide</summary><ol>{state.rubric.points.map(point => <li key={point}>{point}</li>)}</ol><p>Do not credit a contradictory claim such as:</p><ul>{state.rubric.reject.map(point => <li key={point}>{point}</li>)}</ul></details>}
          {state.kind === 'written' && <p className="science-feedback__note">Saved on this browser only. No teacher-marking queue is connected.</p>}
          {submitted.answerPreviouslySeen && <p className="science-feedback__note">Previously seen item: this attempt counts as practice.</p>}
          {submitted.result === 'incorrect' && misconception && <div className="science-repair"><button type="button" className="science-text-button" aria-expanded={repairOpen} onClick={() => setRepairOpen(open => !open)}>{repairOpen ? 'Hide' : 'Take a closer look'} {repairOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>{repairOpen && <p>{misconception.correction}</p>}</div>}
        </section>}
        <div className="science-actions">{stateIndex > 0 && <button type="button" className="science-text-button" onClick={() => dispatch({ type: 'jump', id: lesson.states[stateIndex - 1].id })}><ArrowLeft size={16} /> Back</button>}{(state.kind === 'teaching' || submitted) && <button type="button" className="science-primary" onClick={() => dispatch({ type: 'continue', at: now() })}>{stateIndex === lesson.states.length - 1 ? 'See lesson summary' : 'Continue'} <ArrowRight size={17} /></button>}</div>
      </article> : isCoach ? <article className="science-activity science-summary">
        <div className="science-summary__icon"><Check size={28} aria-hidden="true" /></div>
        <span className="science-eyebrow">Science Coach · One step at a time</span>
        <h2 className="science-question" ref={heading} tabIndex={-1}>{completion.fraction === 1 ? 'You’ve finished this lesson’s activities.' : 'You’ve reached the end of the preview.'}</h2>
        <p className="science-body">{completion.fraction === 1 ? 'Now give the ideas time to settle. Your Coach home will help you practise tricky ideas and check remembering later.' : `You finished ${completion.completed} of ${completion.total} activities. You can go back to the parts you skipped.`}</p>
        <p className="science-body">Finishing activities is not the same as remembering. Review questions check a small sample of ideas, not the whole lesson.</p>
        {profile.pendingReview.length > 0 && <p className="science-body">Your written answers are saved on this browser. They still need teacher review; no teacher-marking queue is connected.</p>}
        {practicalLesson && <p className="science-body">This online lesson prepares you for practical work. You still need to do the real investigation with your teacher.</p>}
        <div className="science-actions">{completion.fraction !== 1 && <button className="science-secondary" type="button" onClick={() => jump(lesson.states.find(s => !session.completedIds.includes(s.id))!.id)}>Return to unfinished activities</button>}<Link className="science-primary" href={hubHref}>Back to Science Coach <ArrowRight size={17} /></Link></div>
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
        <div className="science-next"><span className="science-eyebrow">Suggested next step</span><h3>{completion.fraction !== 1 ? 'Finish the remaining activities' : next.kind === 'repair' ? `Revisit ${currentLessonItem.title.toLowerCase()}` : nextLessonItem ? `Next: ${nextLessonItem.title.toLowerCase()}` : practicalLesson ? 'Next: complete the supervised practical' : 'Next topic not built yet'}</h3><p>{completion.fraction !== 1 ? 'The preview menu lets you inspect any screen. For a full lesson, return to the first unfinished activity.' : next.kind === 'repair' ? 'Replay the relevant teaching and worked examples as practice. Fresh repair questions are not built yet.' : nextLessonItem ? `Lesson ${nextLessonItem.number} is ready: ${nextLessonItem.detail.toLowerCase()}.` : practicalLesson ? 'Use this preparation with your teacher in a risk-assessed laboratory. Digital completion does not complete the required practical.' : 'Return to the lesson hub to review what is currently available.'}</p>{lessonNumber === 3 && completion.fraction === 1 && <p>Also practise microscopy with your teacher: observe real plant and animal cells, draw and label them and include calibrated size information. Online completion does not complete required practical 1.</p>}{completion.fraction === 1 && nextLessonItem && <Link className="science-text-button" href={scienceLessonHref(nextLessonItem.number, variant)}>Open Lesson {nextLessonItem.number} <ArrowRight size={15} /></Link>}</div>
        {session.lastExposureAt && <p className="science-summary__retrieval">Delayed retrieval is not assessed yet. Earliest eligible check: <time dateTime={retrievalDueAt(session.lastExposureAt)}>{new Date(retrievalDueAt(session.lastExposureAt)).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</time>. Retrieval scheduling is not live in this preview.</p>}
        <div className="science-actions">{completion.fraction !== 1 ? <button className="science-primary" type="button" onClick={() => jump(lesson.states.find(s => !session.completedIds.includes(s.id))!.id)}>Return to unfinished activity <ArrowRight size={16} /></button> : <button className="science-secondary" type="button" onClick={() => jump(lesson.states.find(s => s.kind === 'teaching')!.id)}><RotateCcw size={16} /> Review the teaching</button>}</div>
      </article>}
      <details className="science-lesson-options">
        <summary>Lesson information and options</summary>
        {!isCoach && <ScienceVariantSwitch variant={variant} lessonNumber={lessonNumber} activity={state?.id} />}
        <nav className="science-lesson-options__links" aria-label="Lesson resources">{isCoach ? <Link href="/preview/scienceB?view=review">Your short review</Link> : <><Link href={`/preview/science/coverage?variant=${variant}`}>Curriculum and exam map</Link>{lessonNumber === 6 && <Link href={`/preview/science/exam?variant=${variant}`}>Lesson 6 exam practice</Link>}</>}</nav>
        <details className="science-curriculum"><summary>Where this lesson fits</summary><p>AQA Combined Science: Trilogy · Foundation. {scienceLessons.length} lessons are built in this wording route, awaiting qualified teacher review.</p><ol>{(lessonNumber <= 6 ? cellBiologySequence : lessonNumber >= 19 ? infectionSequence : organisationSequence).map(item => <li key={item.title}><strong>{item.title}</strong><span>{item.status} · {item.spec}</span></li>)}</ol>{scienceCurriculum.map(strand => <section key={strand.strand}><h3>{strand.strand}</h3>{strand.papers.map(paper => <p key={paper.paper}>Paper {paper.paper}: {paper.topics.map(([code, title]) => `${code} ${title}`).join(' · ')}</p>)}</section>)}<p>Working scientifically, maths and practical skills run across all three subjects. Digital lessons prepare learners for practical work but never certify hands-on completion.</p></details>
        <details className="science-curriculum"><summary>Lesson sources</summary><ul>{lesson.sources.map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a><span>{source.locator}</span></li>)}</ul></details>
        <button type="button" className="science-text-button" onClick={() => setResetConfirm(true)}><RotateCcw size={14} /> Restart local preview</button>
        {resetConfirm && <div className="science-reset-confirm"><p>Restart this lesson? Submitted answers will normally be remembered as previously seen, so a repeat is practice rather than fresh evidence.</p><label className="science-reset-confirm__history"><input type="checkbox" checked={clearPracticeHistory} onChange={event => setClearPracticeHistory(event.target.checked)} /> Clear this lesson’s local practice history too</label>{clearPracticeHistory && <p>This resets only this lesson’s local preview record. Use it to test a fresh lesson; it does not change any account or production learning history.</p>}<div><button type="button" className="science-secondary" onClick={() => { setResetConfirm(false); setClearPracticeHistory(false) }}>Keep my progress</button><button type="button" className="science-primary" onClick={restart}>Restart lesson</button></div></div>}
        <p className="science-menu__note">{storageAvailable ? 'Progress is saved on this browser only. No account or production mastery records are updated.' : 'Browser storage is unavailable. Progress lasts only while this page stays open.'}</p>
      </details>
      <p className="science-preview-note">AQA Combined Science: Trilogy · Foundation <span aria-hidden="true">/</span> Draft preview · teacher review pending</p>
      {!storageAvailable && <p className="science-storage-warning" role="status">Progress can’t be saved in this browser. Keep this page open while you explore.</p>}
    </main>
  </div>
}

function LessonVisual({ state, feedbackVisible }: { state: ScienceState; feedbackVisible: boolean }) {
  if (/^B(?:[4-9]|1\d|2[0-2])-/.test(state.id) && state.visual) return <CellBiologyVisual focus={state.visual.id} assessment={!feedbackVisible} />
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
