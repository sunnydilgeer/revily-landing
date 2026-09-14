'use client'

import { useEffect, useRef } from 'react'
import { ExplanationSteps } from '../../number-types/components/ExplanationSteps'
import { useLessonEngine } from '../../number-types/useLessonEngine'
import { operationsVariantBLesson, operationsVariantBLabels } from './variantBLesson'
import { OperationsVisual } from './OperationsVisual'
import '../../number-types/RationalNumbersLesson.css'
import './VariantB.css'

export default function OperationsVariantBLessonView() {
  const engine = useLessonEngine(operationsVariantBLesson)
  const state = operationsVariantBLesson.states[engine.stateIndex]
  const { feedback, selection } = engine
  const heading = useRef<HTMLHeadingElement>(null)
  const previousId = useRef(state.id)
  const teaching = state.interaction.type === 'continue'
  const numeric = state.interaction.type === 'numericInput'
  const last = engine.stateIndex === operationsVariantBLesson.states.length - 1
  const progress = engine.completed ? 100 : Math.round(engine.stateIndex / (operationsVariantBLesson.states.length - 1) * 100)
  useEffect(() => {
    if (previousId.current === state.id) return
    previousId.current = state.id
    heading.current?.focus({ preventScroll: true })
    document.getElementById('lesson-2-b')?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }, [state.id])
  return <section className="numbers-lesson opb-lesson" id="lesson-2-b" aria-labelledby="opb-topic">
    <header className="opb-topic"><h2 id="opb-topic">{operationsVariantBLabels[state.microSkillId]}</h2><span>{engine.stateIndex + 1} / {operationsVariantBLesson.states.length}</span></header>
    <div className="lesson-progress" role="progressbar" aria-label="Lesson progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div>
    <article className="opb-activity" key={state.id} data-state-id={state.id}>
      <OperationsVisual visual={state.visual} onConsultRule={feedback ? undefined : engine.markHintUsed} />
      <h3 ref={heading} tabIndex={-1}>{engine.completed ? 'Lesson complete' : state.content.title}</h3>
      {teaching && state.content.body && <p className="opb-body">{state.content.body}</p>}
      {numeric && <form onSubmit={event => { event.preventDefault(); if (!feedback && engine.inputValue.trim()) engine.submit() }}>
        <label className="sr-only" htmlFor={`answer-${state.id}`}>Your answer</label>
        <input className="opb-input" id={`answer-${state.id}`} inputMode="decimal" type="text" autoComplete="off" value={engine.inputValue} disabled={Boolean(feedback)} placeholder="Your answer" onChange={event => engine.setInputValue(event.target.value)} />
        {!feedback && <div className="opb-check"><button type="submit" className="lesson-primary-action" disabled={!engine.inputValue.trim()}>Check answer</button></div>}
      </form>}
      {!teaching && !numeric && <div className="opb-choices" role="group" aria-label="Choose one answer">{state.interaction.options?.map(option => {
        const selected = selection.includes(option.id), correct = state.interaction.correctAnswer === option.id
        const status = feedback ? correct ? 'correct' : selected ? 'incorrect' : 'neutral' : 'neutral'
        return <button type="button" key={option.id} className={`opb-choice opb-choice--${status}`} disabled={Boolean(feedback)} aria-pressed={selected} aria-label={`${option.label}${feedback ? correct ? ', correct answer' : selected ? ', your answer, incorrect' : '' : ''}`} onClick={() => engine.submitSelection([option.id])}>
          <span>{option.label}</span><span aria-hidden="true">{feedback ? correct ? '✓' : selected ? '×' : '' : '→'}</span>
        </button>
      })}</div>}
      {feedback && <div className={`opb-feedback${feedback.correct ? ' opb-feedback--correct' : ''}`} role="status">
        <p className="opb-result">{feedback.correct ? 'Correct' : 'Here’s the working'}</p>
        {feedback.workedExplanation && <ExplanationSteps explanation={feedback.workedExplanation} />}
      </div>}
      <div className="opb-actions">
        {engine.canGoBack && !feedback && !engine.completed && <button type="button" className="lesson-secondary-action" onClick={engine.back}>← Back</button>}
        {(teaching || feedback) && <button type="button" className="lesson-primary-action" onClick={engine.continueLesson}>{engine.completed ? 'Start lesson again' : last ? 'Finish lesson' : 'Continue'} <span aria-hidden="true">→</span></button>}
      </div>
    </article>
  </section>
}
