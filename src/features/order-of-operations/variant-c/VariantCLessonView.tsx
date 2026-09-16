'use client'

import { useEffect, useRef } from 'react'
import { ExplanationSteps } from '../../number-types/components/ExplanationSteps'
import { useLessonEngine } from '../../number-types/useLessonEngine'
import { operationsVariantCLesson, operationsVariantCLabels } from './variantCLesson'
import { TutorTeachingMedia } from './TutorTeachingMedia'
import '../../number-types/RationalNumbersLesson.css'
import '../variant-b/VariantB.css'
import './VariantC.css'

export default function OperationsVariantCLessonView() {
  const engine = useLessonEngine(operationsVariantCLesson)
  const state = operationsVariantCLesson.states[engine.stateIndex]
  const { feedback, selection } = engine
  const heading = useRef<HTMLHeadingElement>(null)
  const previousId = useRef(state.id)
  const teaching = state.interaction.type === 'continue'
  const textInput = state.interaction.type === 'numericInput'
  const algebraInput = state.interaction.acceptanceRule === 'normalisedAlgebra'
  const last = engine.stateIndex === operationsVariantCLesson.states.length - 1
  const progress = engine.completed ? 100 : Math.round(engine.stateIndex / (operationsVariantCLesson.states.length - 1) * 100)

  useEffect(() => {
    if (previousId.current === state.id) return
    previousId.current = state.id
    heading.current?.focus({ preventScroll: true })
    document.getElementById('lesson-2-c')?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }, [state.id])

  return <section className="numbers-lesson opb-lesson opc-lesson" id="lesson-2-c" aria-labelledby="opc-topic">
    <header className="opb-topic"><h2 id="opc-topic">{operationsVariantCLabels[state.microSkillId]}</h2><span>{engine.stateIndex + 1} / {operationsVariantCLesson.states.length}</span></header>
    <div className="lesson-progress" role="progressbar" aria-label="Lesson progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div>
    <article className="opb-activity" key={state.id} data-state-id={state.id} data-source-ref={state.sourceRef}>
      <TutorTeachingMedia visual={state.visual} video={state.video} onConsultRule={feedback ? undefined : engine.markHintUsed} />
      <h3 ref={heading} tabIndex={-1}>{engine.completed ? 'Lesson complete' : state.content.title}</h3>
      {teaching && state.content.body && <p className="opb-body">{state.content.body}</p>}
      {textInput && <form onSubmit={event => { event.preventDefault(); if (!feedback && engine.inputValue.trim()) engine.submit() }}>
        <label className="opc-answer-label" htmlFor={`answer-${state.id}`}>{algebraInput ? 'Your simplified expression' : 'Your answer'}</label>
        <input className="opb-input" id={`answer-${state.id}`} inputMode={algebraInput ? 'text' : 'decimal'} type="text" autoComplete="off" autoCapitalize="none" spellCheck={false} value={engine.inputValue} disabled={Boolean(feedback)} placeholder={state.interaction.placeholder} onChange={event => engine.setInputValue(event.target.value)} />
        {!feedback && <div className="opb-check"><button type="submit" className="lesson-primary-action" disabled={!engine.inputValue.trim()}>Check answer</button></div>}
      </form>}
      {!teaching && !textInput && <div className="opb-choices" role="group" aria-label="Choose one answer">{state.interaction.options?.map(option => {
        const selected = selection.includes(option.id)
        const correct = state.interaction.correctAnswer === option.id
        const status = feedback ? correct ? 'correct' : selected ? 'incorrect' : 'neutral' : 'neutral'
        return <button type="button" key={option.id} className={`opb-choice opb-choice--${status}`} disabled={Boolean(feedback)} aria-pressed={selected} aria-label={`${option.label}${feedback ? correct ? ', correct answer' : selected ? ', your answer, incorrect' : '' : ''}`} onClick={() => engine.submitSelection([option.id])}>
          <span>{option.label}</span><span aria-hidden="true">{feedback ? correct ? '✓' : selected ? '×' : '' : '→'}</span>
        </button>
      })}</div>}
      {feedback && <div className={`opb-feedback${feedback.correct ? ' opb-feedback--correct' : ''}`} role="status">
        <p className="opb-result">{feedback.correct ? 'Correct' : 'Here is the working'}</p>
        {feedback.workedExplanation && <ExplanationSteps explanation={feedback.workedExplanation} />}
      </div>}
      <div className="opb-actions">
        {engine.canGoBack && !feedback && !engine.completed && <button type="button" className="lesson-secondary-action" onClick={engine.back}>← Back</button>}
        {(teaching || feedback) && <button type="button" className="lesson-primary-action" onClick={engine.continueLesson}>{engine.completed ? 'Start lesson again' : last ? 'Finish lesson' : 'Continue'} <span aria-hidden="true">→</span></button>}
      </div>
    </article>
  </section>
}
