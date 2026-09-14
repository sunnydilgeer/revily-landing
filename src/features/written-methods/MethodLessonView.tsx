'use client'
import { useEffect, useId, useRef, useState } from 'react'
import { useLessonEngine } from '../number-types/useLessonEngine'
import { ExplanationSteps } from '../number-types/components/ExplanationSteps'
import { MethodVisual } from './MethodVisual'
import type { MethodLesson } from './model'
import '../number-types/RationalNumbersLesson.css'
import '../place-value/variant-b/VariantB.css'
import './WrittenMethods.css'

function Hint({ text, onOpen }: { text: string; onOpen: () => void }) {
  const [open, setOpen] = useState(false), id = useId()
  return <div className="pvb-hint"><button type="button" className="pvb-hint-toggle" aria-expanded={open} aria-controls={id} onClick={() => { if (!open) onOpen(); setOpen(!open) }}>Hint <span aria-hidden="true">{open ? '−' : '+'}</span></button>{open && <div id={id} className="pvb-hint__content"><p>{text}</p></div>}</div>
}
export default function MethodLessonView({ lesson }: { lesson: MethodLesson }) {
  const engine = useLessonEngine(lesson), state = lesson.states[engine.stateIndex]
  const heading = useRef<HTMLHeadingElement>(null), previous = useRef(state.id)
  const { feedback, selection } = engine
  const teaching = state.interaction.type === 'continue', numeric = state.interaction.type === 'numericInput', pair = state.interaction.type === 'quotientRemainderInput', multiple = state.interaction.type === 'multiSelect'
  const accepted = Array.isArray(state.interaction.correctAnswer) ? state.interaction.correctAnswer : [state.interaction.correctAnswer]
  const canSubmit = pair ? Boolean(engine.quotientValue.trim() && engine.remainderValue.trim()) : numeric ? Boolean(engine.inputValue.trim()) : selection.length > 0
  const progress = Math.round(engine.stateIndex / (lesson.states.length - 1) * 100)
  useEffect(() => { if (previous.current !== state.id) { previous.current = state.id; heading.current?.focus({ preventScroll: true }); document.getElementById(lesson.id)?.scrollIntoView({ block: 'start', behavior: 'instant' }) } }, [state.id, lesson.id])
  return <section id={lesson.id} className="numbers-lesson pvb-lesson wm-lesson" aria-label={`${lesson.title}, Variant B`}>
    <header className="pvb-topic"><h2>{lesson.title}</h2><span>{engine.stateIndex + 1} / {lesson.states.length}</span></header>
    <div className="lesson-progress" role="progressbar" aria-label="Lesson progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div>
    <article key={state.id} className="pvb-activity" data-state-id={state.id}>
      <div className="pvb-stage"><MethodVisual visual={state.visual} />{!teaching && state.hint && <Hint text={state.hint} onOpen={engine.markHintUsed} />}</div>
      <h3 ref={heading} tabIndex={-1}>{engine.completed ? 'Lesson complete' : state.content.title}</h3>
      {teaching && state.content.body && <p className="pvb-body">{state.content.body}</p>}
      {(numeric || pair) && <form id={`form-${state.id}`} onSubmit={event => { event.preventDefault(); if (canSubmit && !feedback) engine.submit() }}>
        {numeric ? <><label className="sr-only" htmlFor={`answer-${state.id}`}>Your answer</label><input id={`answer-${state.id}`} className="pvb-input" type="text" inputMode="decimal" autoComplete="off" placeholder="Your answer" value={engine.inputValue} disabled={Boolean(feedback)} onChange={event => engine.setInputValue(event.target.value)} /></> : <div className="wm-pair-input">{(['quotient', 'remainder'] as const).map(field => <label key={field} htmlFor={`${field}-${state.id}`}><span>{field === 'quotient' ? 'Quotient' : 'Remainder'}</span><input id={`${field}-${state.id}`} className="pvb-input" type="text" inputMode="numeric" autoComplete="off" placeholder={field === 'quotient' ? 'Whole number' : 'Left over'} value={field === 'quotient' ? engine.quotientValue : engine.remainderValue} disabled={Boolean(feedback)} onChange={event => (field === 'quotient' ? engine.setQuotientValue : engine.setRemainderValue)(event.target.value)} /></label>)}</div>}
      </form>}
      {!teaching && !numeric && !pair && <div className="pvb-choices" role="group" aria-label={multiple ? 'Select all that apply' : 'Choose one answer'}>{state.interaction.options?.map(option => {
        const selected = selection.includes(option.id), correct = accepted.includes(option.id)
        const status = feedback ? correct ? 'correct' : selected ? 'incorrect' : 'neutral' : selected ? 'selected' : 'neutral'
        return <button key={option.id} type="button" className={`pvb-choice pvb-choice--${status}`} disabled={Boolean(feedback)} aria-pressed={selected} aria-label={`${option.label}${feedback ? correct ? ', correct answer' : selected ? ', your answer, incorrect' : '' : ''}`} onClick={() => multiple ? engine.toggleOption(option.id) : engine.submitSelection([option.id])}><span>{option.label}</span><span className="pvb-choice__mark" aria-hidden="true">{feedback ? correct ? '✓' : selected ? '×' : '' : multiple ? selected ? '✓' : '+' : '→'}</span></button>
      })}</div>}
      {feedback && <div role="status" className={`pvb-feedback${feedback.correct ? ' pvb-feedback--correct' : ''}`}><p className="pvb-result">{feedback.correct ? 'Correct' : 'Here’s the working'}</p>{feedback.workedExplanation && <ExplanationSteps explanation={feedback.workedExplanation} />}</div>}
      <div className="pvb-actions">{engine.canGoBack && !feedback && !engine.completed && <button type="button" className="lesson-secondary-action" onClick={engine.back}>← Back</button>}{!feedback && (numeric || pair || multiple) && <button type={multiple ? 'button' : 'submit'} form={multiple ? undefined : `form-${state.id}`} className="lesson-primary-action" disabled={!canSubmit} onClick={multiple ? engine.submit : undefined}>Check answer</button>}{(teaching || feedback) && <button type="button" className="lesson-primary-action" onClick={engine.continueLesson}>{engine.completed ? 'Start lesson again' : engine.stateIndex === lesson.states.length - 1 ? 'Finish lesson' : 'Continue'} <span aria-hidden="true">→</span></button>}</div>
    </article>
  </section>
}
