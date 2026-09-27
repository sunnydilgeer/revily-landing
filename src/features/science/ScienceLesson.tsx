'use client'

/*
 * The Science lesson player in the app's lesson frame: the same top bar, section header with a
 * progress bar, question card, bottom check bar and done cards as Maths. The Science session engine
 * (previewSession.ts / engine.ts) is unchanged: it still records every attempt, keeps written answers
 * pending, and never certifies a practical.
 */
import { useCallback, useEffect, useReducer, useRef, useState, type RefObject } from 'react'
import { Button, CheckBar, RevilyLogo } from '../../ui'
import { progress } from './engine'
import { scienceChapters, scienceHubHref, scienceLessonHref, scienceLessons, type LessonNumber } from './lessonNavigation'
import { createPreviewSessionEngine, type PreviewSession, type SessionAction } from './previewSession'
import { sectionRanges } from './scienceProgress'
import { WalkthroughDiagram, WorkedVisual } from './components/TeachingChunk'
import { LessonVisual } from './components/LessonVisual'
import ScienceContentsDrawer from './ScienceContentsDrawer'
import { lessonFrames } from './lessonFrames'
import type { ChoiceState, TeachingState, WrittenState } from './types'
import '../../App.css'
import '../maths/MathsNavigation.css'
import '../written-methods/tutor/RungLesson.css'
import './ScienceLesson.css'
import './FriendlyLesson.css'
import './AnatomyVisuals.css'
import './ScienceLessonFrame.css'

// Same event Maths fires when a rung is finished: finishing a section keeps the shared streak going.
const SECTION_COMPLETE_EVENT = 'revily:rung-complete'
const PRAISE = ['Nice! That’s right.', 'Correct!', 'Spot on.', 'That’s it.']
const PRACTICAL_NOTES: Record<string, string> = {
  'B-CELL-003-B': 'This lesson prepares you for required practical 1. You still need to do it for real with your teacher: look at real plant and animal cells, then draw and label them with their size.',
  'B-CELL-006B-B': 'This lesson prepares you for required practical 2. You still need to do the real investigation with your teacher.',
  'B-ORG-008-B': 'This lesson prepares you for required practical 4. You still need to do the real investigation with your teacher.',
  'B-ORG-009-B': 'This lesson prepares you for required practical 3. You still need to do the real food tests with your teacher.',
  'B-BIO-027-B': 'This lesson prepares you for the photosynthesis required practical. You still need to do the real investigation with your teacher.',
  'B-HOM-032-B': 'This lesson prepares you for the reaction time required practical. You still need to do the real investigation with your teacher.',
}

// Short optional reminders on a lesson's first screen, for students coming back to the topic.
// Shown only after the Start here question is answered, so they never give its answer away.
const REFRESHERS: Record<string, { title: string; text: string }> = {
  'B4-01': { title: 'Quick cells refresher', text: 'A membrane controls entry and exit. A nucleus contains genetic information. Mitochondria release energy through aerobic respiration. Plant cell walls support cells. Specialised cells adapt these structures to a job.' },
  'B5-01': { title: 'Quick nucleus refresher', text: 'The nucleus contains genetic information. Chromosomes in the nucleus consist of DNA; a gene is a small section of DNA. This lesson connects that model to cell division.' },
}

const engines = new Map(scienceLessons.map(item => [item.number, createPreviewSessionEngine(item.lesson)] as const))
const newSessionId = () => window.crypto.randomUUID()
const now = () => new Date().toISOString()
const sectionTitle = (title: string) => title.replace(/^Chapter \d+ · /, '')

type SectionSummary = { index: number; title: string; nextTitle: string; questions: number; firstTry: number }

const Tick = () => <div className="rung-done__badge" aria-hidden="true"><svg viewBox="0 0 24 24" width="40" height="40"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>

function Hint({ open, text, id, onToggle }: { open: boolean; text: string; id: string; onToggle: () => void }) {
  return <div className="sl-hint">
    <button type="button" className="sl-hint__toggle" aria-expanded={open} aria-controls={`hint-${id}`} onClick={onToggle}>{open ? 'Hide the hint' : 'Need a hint?'}</button>
    {open && <p id={`hint-${id}`}>{text}</p>}
  </div>
}

export default function ScienceLesson({ lessonNumber, initialActivity }: { lessonNumber: LessonNumber; initialActivity?: string }) {
  const entry = scienceLessons.find(item => item.number === lessonNumber)!
  const lesson = entry.lesson
  const nextEntry = scienceLessons.find(item => item.number === lessonNumber + 1)
  const chapter = scienceChapters.find(item => (item.lessonNumbers as readonly number[]).includes(lessonNumber))!
  const frames = lessonFrames[lessonNumber]
  const { createPreviewSession, previewReducer, restorePreviewSession, storageKey } = engines.get(lessonNumber)!
  const reducer = useCallback((session: PreviewSession, action: SessionAction | { type: 'restore'; session: PreviewSession }) =>
    action.type === 'restore' ? action.session : previewReducer(session, action), [previewReducer])
  const [session, dispatch] = useReducer(reducer, createPreviewSession('loading'))
  const [ready, setReady] = useState(false)
  const [storageAvailable, setStorageAvailable] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [frame, setFrame] = useState(0)
  const [revealed, setRevealed] = useState(0)
  const [sectionDone, setSectionDone] = useState<SectionSummary | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const continueButton = useRef<HTMLButtonElement>(null)
  const contentsButton = useRef<HTMLButtonElement>(null)
  const previousId = useRef<string | null>('loading')

  const state = lesson.states.find(item => item.id === session.currentId)
  const stateIndex = state ? lesson.states.indexOf(state) : lesson.states.length
  const ranges = sectionRanges(lesson, lessonNumber)
  const sectionIndex = Math.max(0, ranges.findIndex(range => stateIndex >= range.start && stateIndex < range.end))
  const range = ranges[sectionIndex] ?? { id: '', title: lesson.title, start: 0, end: lesson.states.length }
  const submitted = state ? session.answers[state.id] : undefined
  const completion = progress(lesson, session.completedIds)
  const stateFrames = state?.kind === 'teaching' && state.media ? frames?.[state.id] ?? [] : []
  const workedSteps = state?.kind === 'teaching' && !state.media ? state.steps ?? [] : []
  const stepDone = state?.kind === 'teaching' ? 1 : submitted ? 1 : 0
  const sectionProgress = Math.round((stateIndex - range.start + stepDone) / Math.max(1, range.end - range.start) * 100)

  // Restore this lesson's saved session, then keep saving it.
  useEffect(() => {
    let restored: PreviewSession | null = null
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw) {
        try { restored = restorePreviewSession(JSON.parse(raw)) }
        catch { /* Corrupt data starts a fresh session; storage may still work. */ }
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

  // A new screen: reset its steps, move focus to its heading, and record exposure as before.
  useEffect(() => {
    if (!ready || previousId.current === session.currentId) return
    const firstLoad = previousId.current === 'loading'
    previousId.current = session.currentId
    setFrame(0)
    setRevealed(0)
    if (!firstLoad) {
      heading.current?.focus({ preventScroll: true })
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    if (state?.kind === 'teaching' || submitted) dispatch({ type: 'exposure', at: now() })
  }, [session.currentId, ready, state?.kind, submitted])
  useEffect(() => { if (submitted) continueButton.current?.focus({ preventScroll: true }) }, [submitted])

  const expose = () => dispatch({ type: 'exposure', at: now() })
  const goToCurriculum = () => window.location.assign(scienceHubHref())

  function advance() {
    if (!state) return
    const reviewing = session.completedIds.includes(state.id)
    const lastInSection = stateIndex === range.end - 1
    dispatch({ type: 'continue', at: now() })
    if (!lastInSection || reviewing) return
    window.dispatchEvent(new CustomEvent(SECTION_COMPLETE_EVENT))
    if (sectionIndex >= ranges.length - 1) return
    const choices = lesson.states.slice(range.start, range.end).filter((item): item is ChoiceState => item.kind === 'choice')
    setSectionDone({
      index: sectionIndex,
      title: sectionTitle(range.title),
      nextTitle: sectionTitle(ranges[sectionIndex + 1].title),
      questions: choices.length,
      firstTry: choices.filter(item => session.answers[item.id]?.result === 'correct').length,
    })
  }

  function back() {
    if (frame > 0) { setFrame(frame - 1); expose(); return }
    if (stateIndex > 0) dispatch({ type: 'jump', id: lesson.states[stateIndex - 1].id })
  }

  function jump(id: string) {
    setSectionDone(null)
    dispatch({ type: 'jump', id })
  }

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
    window.requestAnimationFrame(() => contentsButton.current?.focus())
  }, [])

  const header = <header className="rung-head">
    <h2 id="science-section-title">{sectionTitle(range.title)}</h2>
    <div className="rung-head__progress">
      <div className="rung-head__bar" role="progressbar" aria-label={`${entry.title}, section ${sectionIndex + 1} of ${ranges.length}: progress through ${sectionTitle(range.title)}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={sectionProgress}>
        <span style={{ width: `${Math.max(4, Math.min(100, sectionProgress))}%` }} />
      </div>
    </div>
  </header>

  let body
  if (!ready) {
    body = <section className="rung-lesson"><p className="sl-loading">Opening your lesson…</p></section>
  } else if (sectionDone) {
    body = <section className="rung-lesson" aria-labelledby="rung-done-title">
      <div className="rung-done rv-paper" role="status">
        <Tick />
        <p className="rung-done__kicker">Section {sectionDone.index + 1} of {ranges.length} complete</p>
        <h3 id="rung-done-title" ref={heading as RefObject<HTMLHeadingElement>} tabIndex={-1}>{sectionDone.title}</h3>
        {sectionDone.questions > 0 && <p className="rung-done__score"><strong>{sectionDone.firstTry} of {sectionDone.questions}</strong> right first time</p>}
        <p className="rung-done__next">Next section: <strong>{sectionDone.nextTitle}</strong></p>
        <div className="rung-done__actions">
          <Button size="lg" onClick={() => setSectionDone(null)} autoFocus>Keep going</Button>
          <Button variant="secondary" size="lg" onClick={goToCurriculum}>Take a break</Button>
        </div>
        <p className="rung-done__saved">Your progress is saved on this device.</p>
      </div>
    </section>
  } else if (!state) {
    const remaining = lesson.states.find(item => !session.completedIds.includes(item.id))
    const pendingWritten = Object.values(session.answers).some(answer => answer.result === 'pendingTeacherReview')
    body = <section className="rung-lesson" aria-labelledby="lesson-done-title">
      <div className="rung-done rv-paper" role="status">
        {!remaining && <Tick />}
        <p className="rung-done__kicker">{remaining ? `${completion.total - completion.completed} screens still to do` : `All ${ranges.length} sections done`}</p>
        <h3 id="lesson-done-title" ref={heading as RefObject<HTMLHeadingElement>} tabIndex={-1}>{remaining ? 'Almost there' : `Lesson complete: ${entry.title}`}</h3>
        {!remaining && pendingWritten && <p className="rung-done__next">Your written answers are saved on this device.</p>}
        {!remaining && PRACTICAL_NOTES[lesson.id] && <p className="rung-done__next sl-practical-note">{PRACTICAL_NOTES[lesson.id]}</p>}
        <div className="rung-done__actions">
          {remaining
            ? <Button size="lg" onClick={() => jump(remaining.id)}>Go to what’s left</Button>
            : nextEntry && <Button size="lg" onClick={() => window.location.assign(scienceLessonHref(nextEntry.number))}>Next: {nextEntry.title}</Button>}
          <Button variant="secondary" size="lg" onClick={goToCurriculum}>Back to lessons</Button>
        </div>
      </div>
    </section>
  } else {
    const choice = state.kind === 'choice' ? state : null
    const written = state.kind === 'written' ? state : null
    const walkthrough = stateFrames.length > 0
    const current = walkthrough ? stateFrames[Math.min(frame, stateFrames.length - 1)] : null
    const selected = choice?.options.find(option => option.id === submitted?.response)
    const misconception = selected?.misconceptionSignal ? lesson.misconceptions.find(item => item.id === selected.misconceptionSignal) : undefined
    const answerLabel = choice?.options.find(option => option.id === choice.answerId)?.label
    const lastState = stateIndex === lesson.states.length - 1
    const continueLabel = lastState ? 'Finish lesson' : 'Continue'
    const canGoBack = frame > 0 || stateIndex > 0
    const draft = written ? session.drafts[written.id] ?? '' : ''

    let bar
    if (submitted && choice) {
      const correct = submitted.result === 'correct'
      bar = <CheckBar
        status={correct ? 'correct' : 'incorrect'}
        title={correct ? PRAISE[stateIndex % PRAISE.length] : 'Not quite'}
        message={correct ? undefined : <>{misconception?.correction ?? selected?.feedback}{answerLabel && <> The answer is <strong>{answerLabel}</strong>.</>}</>}
      >
        <Button ref={continueButton} variant={correct ? 'good' : 'bad'} size="lg" onClick={advance}>{continueLabel}</Button>
      </CheckBar>
    } else if (submitted && written) {
      bar = <CheckBar status="saved" title="Saved for review" message={<><strong>Model answer.</strong> {written.explanation.answer}</>}>
        <Button ref={continueButton} size="lg" onClick={advance}>{continueLabel}</Button>
      </CheckBar>
    } else if (walkthrough && frame < stateFrames.length - 1) {
      bar = <CheckBar>
        {canGoBack && <Button variant="ghost" onClick={back}>← Back</Button>}
        <Button ref={continueButton} size="lg" onClick={() => { setFrame(frame + 1); expose() }}>Next</Button>
      </CheckBar>
    } else if (workedSteps.length > 0 && revealed < workedSteps.length) {
      bar = <CheckBar>
        {canGoBack && <Button variant="ghost" onClick={back}>← Back</Button>}
        <Button ref={continueButton} size="lg" onClick={() => { setRevealed(revealed + 1); expose() }}>{revealed === 0 ? 'Show the reasoning' : 'Next step'}</Button>
      </CheckBar>
    } else if (state.kind === 'teaching') {
      bar = <CheckBar>
        {canGoBack && <Button variant="ghost" onClick={back}>← Back</Button>}
        <Button ref={continueButton} size="lg" onClick={advance}>{continueLabel}</Button>
      </CheckBar>
    } else if (canGoBack || written) {
      // A question with nothing to do yet but answer: only Back (and Save for written answers).
      bar = <CheckBar>
        {canGoBack && <Button variant="ghost" onClick={back}>← Back</Button>}
        {written && <Button type="submit" form={`form-${written.id}`} size="lg" disabled={!draft.trim()}>Save answer</Button>}
      </CheckBar>
    }

    body = <section className="rung-lesson sl-lesson" aria-labelledby="science-section-title">
      {header}
      <article className={`rung-card sl-card${state.kind === 'teaching' ? ' rung-card--teach' : ' rung-card--question'}`} key={state.id} data-state-id={state.id}>
        {state.kind !== 'teaching' && state.exam && <span className="sl-marks">Exam-style · {state.exam.marks} {state.exam.marks === 1 ? 'mark' : 'marks'}</span>}

        {walkthrough && current ? <>
          <h3 ref={heading} tabIndex={-1}>{current.label}</h3>
          <p className="sl-lead">{current.summary}</p>
          <div className="science-preview science-preview--revision sl-visual"><WalkthroughDiagram state={state as TeachingState} steps={stateFrames} index={Math.min(frame, stateFrames.length - 1)} onSelect={to => { setFrame(to); expose() }} /></div>
          <p className="sl-text">{current.text}</p>
          {stateFrames.length > 1 && <ol className="sl-dots" aria-label={`Step ${frame + 1} of ${stateFrames.length}`}>{stateFrames.map((item, i) => <li key={item.label} className={i === frame ? 'is-current' : i < frame ? 'is-done' : ''} />)}</ol>}
        </> : state.kind === 'teaching' && workedSteps.length > 0 ? <>
          <h3 ref={heading} tabIndex={-1}>{state.title}</h3>
          <div className="science-preview science-preview--revision sl-visual"><WorkedVisual state={state} /></div>
          {state.body && <p className="sl-text">{state.body}</p>}
          {revealed > 0 && <ol className="sl-steps">{workedSteps.slice(0, revealed).map((step, i) => <li key={step}><span aria-hidden="true">{i + 1}</span><p>{step}</p></li>)}</ol>}
        </> : <>
          <div className="science-preview science-preview--revision sl-visual sl-visual--optional"><LessonVisual state={state} feedbackVisible={Boolean(submitted)} /></div>
          <h3 ref={heading} tabIndex={-1}>{state.title}</h3>
          {state.kind === 'teaching' && state.body && <p className="sl-text">{state.body}</p>}
          {choice && <div className="sl-choices" role="group" aria-label="Choose one answer">{choice.options.map(option => {
            const isSelected = submitted?.response === option.id
            const isAnswer = Boolean(submitted) && option.id === choice.answerId
            const status = isAnswer ? 'correct' : isSelected ? 'incorrect' : 'neutral'
            return <button type="button" key={option.id} className={`sl-choice sl-choice--${status}`} disabled={Boolean(submitted)} aria-pressed={isSelected}
              aria-label={`${option.label}${submitted ? isAnswer ? ', correct answer' : isSelected ? ', your answer, incorrect' : '' : ''}`}
              onClick={() => dispatch({ type: 'answer', response: option.id, at: now() })}>
              <span>{option.label}</span>{isAnswer ? <span aria-hidden="true">✓</span> : isSelected ? <span aria-hidden="true">✗</span> : null}
            </button>
          })}</div>}
          {written && <WrittenAnswer state={written} draft={submitted?.response ?? draft} locked={Boolean(submitted)} onDraft={response => dispatch({ type: 'draft', response })} onSave={() => { if (!submitted && draft.trim()) dispatch({ type: 'answer', response: draft, at: now() }) }} />}
        </>}

        {REFRESHERS[state.id] && submitted && <details className="sl-markscheme"><summary>{REFRESHERS[state.id].title}</summary><p className="sl-text">{REFRESHERS[state.id].text}</p></details>}
        {state.kind !== 'teaching' && !submitted && <Hint open={session.hintsOpen.includes(state.id)} text={state.hint} id={state.id} onToggle={() => dispatch({ type: 'hint' })} />}
        {choice && submitted?.result === 'incorrect' && <ol className="sl-steps sl-steps--working" aria-label="Working">{choice.explanation.steps.map((step, i) => <li key={step}><span aria-hidden="true">{i + 1}</span><p>{step}</p></li>)}</ol>}
        {written && submitted && <details className="sl-markscheme"><summary>How the {written.rubric.marks} marks are given</summary><ul>{written.rubric.points.map(point => <li key={point}>{point}</li>)}</ul></details>}
      </article>
      {bar}
    </section>
  }

  return <div className="app-shell app-shell--lesson app-shell--study sl-shell" data-subject="science">
    <header className="site-header">
      <RevilyLogo wordmark={false} size={24} href={scienceHubHref()} />
      <nav className="maths-breadcrumbs" aria-label="Breadcrumb">
        <a href={scienceHubHref()}>Curriculum</a>
        <span aria-hidden="true">/</span>
        <span className="maths-breadcrumb-number" aria-current="page">{entry.title}</span>
      </nav>
      <button ref={contentsButton} className="maths-contents-button" type="button" aria-expanded={drawerOpen} aria-controls="science-contents" onClick={() => setDrawerOpen(true)}>Contents</button>
    </header>
    <main className="lesson-preview" id="main-content" aria-busy={!ready} inert={drawerOpen || undefined}>{body}</main>
    <ScienceContentsDrawer
      open={drawerOpen}
      lessonNumber={lessonNumber}
      chapterTitle={chapter.title}
      session={session}
      storageAvailable={storageAvailable}
      onClose={closeDrawer}
      onJump={id => { jump(id); closeDrawer() }}
      onRestart={clearPracticeHistory => { setSectionDone(null); dispatch({ type: 'restart', sessionId: newSessionId(), clearPracticeHistory }); closeDrawer() }}
    />
  </div>
}

function WrittenAnswer({ state, draft, locked, onDraft, onSave }: { state: WrittenState; draft: string; locked: boolean; onDraft: (value: string) => void; onSave: () => void }) {
  return <form className="sl-written" id={`form-${state.id}`} onSubmit={event => { event.preventDefault(); onSave() }}>
    <label className="sr-only" htmlFor={`answer-${state.id}`}>Your answer</label>
    <textarea id={`answer-${state.id}`} maxLength={2000} rows={4} value={draft} disabled={locked} placeholder={state.placeholder || 'Write your answer here.'} onChange={event => onDraft(event.target.value)} />
  </form>
}
