'use client'

import { useEffect, useRef, useId, useState } from 'react'
import { ExplanationSteps } from '../../number-types/components/ExplanationSteps'
import { useLessonEngine } from '../../number-types/useLessonEngine'
import { AnswerMethodWorking } from './MethodWorkedExample'
import { TutorMethodMedia } from './TutorMethodVisual'
import type { TutorMethodLesson } from './model'

import '../../number-types/RationalNumbersLesson.css'
import '../../place-value/variant-b/VariantB.css'
import '../../order-of-operations/variant-c/VariantC.css'
import '../WrittenMethods.css'
import './TutorMethod.css'

function Hint({ text, onConsult }: { text: string; onConsult: () => void }) {
  const [open, setOpen] = useState(false), id = useId()
  return <div className="pvb-hint"><button type="button" className="pvb-hint-toggle" aria-expanded={open} aria-controls={id} onClick={() => { setOpen(!open); if (!open) onConsult() }}>Hint <span aria-hidden="true">{open ? '−' : '+'}</span></button><div id={id} className="pvb-hint__content" hidden={!open}><p>{text}</p></div></div>
}
export default function TutorMethodLessonView({ lesson }: { lesson: TutorMethodLesson }) {
  const labels = lesson.labels
  const compactFeedback = lesson.number === 6 || lesson.number === 7
  const engine = useLessonEngine(lesson)
  const state = lesson.states[engine.stateIndex]
  const { feedback, selection } = engine
  const heading = useRef<HTMLHeadingElement>(null)
  const previousId = useRef(state.id)
  const teaching = state.interaction.type === 'continue'
  const numeric = state.interaction.type === 'numericInput'
  const pair = state.interaction.type === 'quotientRemainderInput'
  const last = engine.stateIndex === lesson.states.length - 1
  const journey = [...new Set(lesson.states.map(candidate => candidate.microSkillId))]
  useEffect(() => {
    if (previousId.current === state.id) return
    previousId.current = state.id
    heading.current?.focus({ preventScroll: true })
    document.getElementById(`lesson-${lesson.number}`)?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }, [state.id, lesson.number])
  return <section className="numbers-lesson pvb-lesson wm-lesson wmt-lesson" id={`lesson-${lesson.number}`} aria-labelledby={`wmt-topic-${lesson.number}`}>
    <header className="pvb-topic"><h2 id={`wmt-topic-${lesson.number}`}>{labels[state.microSkillId]}</h2><span>{engine.stateIndex + 1} / {lesson.states.length}</span></header>
    <nav className="lesson-progress-nav" aria-label={`Lesson ${lesson.number} progress`}>{journey.map(topic => {
      const indexes = lesson.states.flatMap((candidate, i) => candidate.microSkillId === topic ? [i] : [])
      const start = indexes[0], end = indexes.at(-1)!
      const reached = start <= engine.furthestStateIndex
      const progress = engine.completed ? 100 : !reached ? 0 : Math.round(Math.max(0, Math.min(engine.furthestStateIndex, end) - start) / Math.max(1, end - start) * 100)
      const name = labels[topic]
      return <button type="button" key={topic} className={`lesson-progress-segment${state.microSkillId === topic ? ' is-current' : ''}${reached ? ' is-reached' : ' is-locked'}`} disabled={!reached} aria-current={state.microSkillId === topic ? 'step' : undefined} aria-label={reached ? `${name}: ${progress}% reached. Go to this section.` : `${name}: locked until earlier content is complete.`} onClick={() => engine.navigateToReached(lesson.states[start].id)}>
        <span className="lesson-progress-segment__track" aria-hidden="true"><span className="lesson-progress-segment__fill" style={{ width: `${progress}%` }} /></span><small aria-hidden="true">{name}</small>
      </button>
    })}</nav>
    <article className="pvb-activity" key={state.id} data-state-id={state.id} data-source-ref={state.sourceRef}>
      <TutorMethodMedia state={state} />
      {!teaching && state.hint && <Hint text={state.hint} onConsult={engine.markHintUsed} />}
      <h3 ref={heading} tabIndex={-1}>{engine.completed ? 'Lesson complete' : state.content.title}</h3>
      {teaching && !state.video && state.content.body && <p className="pvb-body">{state.content.body}</p>}
      {(numeric || pair) && <form id={`form-${state.id}`} onSubmit={event => { event.preventDefault(); if (!feedback && (pair ? engine.quotientValue.trim() && engine.remainderValue.trim() : engine.inputValue.trim())) engine.submit() }}>
        {numeric ? <><label className="wmt-label" htmlFor={`answer-${state.id}`}>{state.answerLabel ?? 'Your answer'}</label>
        <input id={`answer-${state.id}`} className="pvb-input" inputMode="decimal" type="text" autoComplete="off" spellCheck={false} value={engine.inputValue} disabled={Boolean(feedback)} placeholder={state.interaction.placeholder} onChange={event => engine.setInputValue(event.target.value)} /></> : <div className="wm-pair-input">{(['quotient', 'remainder'] as const).map(field => <label key={field} htmlFor={`${field}-${state.id}`}><span>{field === 'quotient' ? 'Full boxes' : 'Buns left over'}</span><input id={`${field}-${state.id}`} className="pvb-input" type="text" inputMode="numeric" autoComplete="off" value={field === 'quotient' ? engine.quotientValue : engine.remainderValue} disabled={Boolean(feedback)} onChange={event => (field === 'quotient' ? engine.setQuotientValue : engine.setRemainderValue)(event.target.value)} /></label>)}</div>}
      </form>}
      {!teaching && !numeric && !pair && <div className="pvb-choices" role="group" aria-label="Choose one answer">{state.interaction.options?.map(option => {
        const selected = selection.includes(option.id), correct = state.interaction.correctAnswer === option.id
        const status = feedback ? correct ? 'correct' : selected ? 'incorrect' : 'neutral' : 'neutral'
        return <button type="button" key={option.id} className={`pvb-choice pvb-choice--${status}`} disabled={Boolean(feedback)} aria-pressed={selected} aria-label={`${option.label}${feedback ? correct ? ', correct answer' : selected ? ', your answer, incorrect' : '' : ''}`} onClick={() => engine.submitSelection([option.id])}><span>{option.label}</span><span aria-hidden="true">{feedback ? correct ? '✓' : selected ? '×' : '' : '→'}</span></button>
      })}</div>}
      {feedback && <div className={`pvb-feedback${feedback.correct ? ' pvb-feedback--correct' : ''}`} role="status"><p className="pvb-result">{feedback.correct ? 'Correct' : compactFeedback ? 'Not quite' : 'Here’s the working'}</p>{!compactFeedback && feedback.workedExplanation && <ExplanationSteps explanation={feedback.workedExplanation} />}</div>}
      {feedback && state.working && <AnswerMethodWorking visual={state.working} />}
      <div className="pvb-actions">
        {engine.canGoBack && !engine.completed && <button type="button" className="lesson-secondary-action" onClick={engine.back}>← Back</button>}
        {!feedback && (numeric || pair) && <button type="submit" form={`form-${state.id}`} className="lesson-primary-action" disabled={pair ? !(engine.quotientValue.trim() && engine.remainderValue.trim()) : !engine.inputValue.trim()}>Check answer</button>}
        {(teaching || feedback) && <button type="button" className="lesson-primary-action" onClick={engine.continueLesson}>{engine.completed ? 'Start lesson again' : last ? 'Finish lesson' : 'Continue'} <span aria-hidden="true">→</span></button>}
      </div>
    </article>
  </section>
}
