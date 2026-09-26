'use client'

import { ExplanationSteps } from '../../number-types/components/ExplanationSteps'
import { useLessonEngine } from '../../number-types/useLessonEngine'
import { GENERIC_FEEDBACK, LessonDoneCard, PRAISE, RungDoneCard, RungHeader, answerText, useRungFlow } from '../../maths/rungs'
import { Button, CheckBar } from '../../../ui'
import { diagnoseBidmas } from '../ladder/bidmasDiagnosis'
import { operationsVariantCLesson, operationsVariantCLabels, type TutorOperationsState } from './variantCLesson'
import { TutorTeachingMedia } from './TutorTeachingMedia'
import '../../number-types/RationalNumbersLesson.css'
import './TutorOperations.css'
import './VariantC.css'

const lesson = operationsVariantCLesson

function explainMistake(state: TutorOperationsState, response: string) {
  if (state.interaction.type !== 'numericInput' || typeof state.interaction.correctAnswer !== 'number') return null
  if (state.visual.kind !== 'expression') return null
  return diagnoseBidmas(state.visual.math, response, state.interaction.correctAnswer)
}

/** "Calculate: 4 + 6 × 3" shown above a large 4 + 6 × 3: keep just "Calculate". */
function shortTitle(state: TutorOperationsState) {
  const match = state.visual.kind === 'expression' ? /^([A-Z][a-z ]+):\s*\S/.exec(state.content.title) : null
  return match ? match[1] : state.content.title
}

export default function OperationsVariantCLessonView() {
  const engine = useLessonEngine(lesson)
  const flow = useRungFlow(lesson, engine, operationsVariantCLabels, 'lesson-2-c')
  const { teaching, last, heading, continueButton, next } = flow
  const state = flow.state as TutorOperationsState
  const { feedback, selection } = engine
  const textInput = state.interaction.type === 'numericInput'
  const algebraInput = state.interaction.acceptanceRule === 'normalisedAlgebra'
  const ladder = state.visual.kind === 'ladder-player'
  const header = <RungHeader flow={flow} lessonTitle="Order of operations" headingId="opc-topic" />

  if (flow.rungDone) return <section className="rung-lesson" id="lesson-2-c" aria-labelledby="rung-done-title">{header}<RungDoneCard flow={flow} /></section>
  if (engine.completed) return <section className="rung-lesson" id="lesson-2-c" aria-labelledby="lesson-done-title"><LessonDoneCard flow={flow} lessonTitle="Order of operations" onRestart={engine.continueLesson} /></section>

  const mistake = feedback && !feedback.correct ? explainMistake(state, engine.inputValue) : null
  const answerState = feedback ? feedback.correct ? ' is-correct' : ' is-incorrect' : ''

  return <section className={`numbers-lesson opb-lesson opc-lesson rung-lesson${ladder ? ' rung-lesson--wide' : ''}`} id="lesson-2-c" aria-labelledby="opc-topic">
    {header}
    <article className={`opb-activity rung-card${teaching ? ' rung-card--teach' : ' rung-card--question'}`} key={state.id} data-state-id={state.id} data-source-ref={state.sourceRef}>
      <h3 ref={heading} tabIndex={-1} className={state.content.title === flow.title ? 'sr-only' : undefined}>{shortTitle(state)}</h3>
      {teaching && !state.video && state.content.body && <p className="opb-body">{state.content.body}</p>}
      <TutorTeachingMedia visual={state.visual} video={state.video} onConsultRule={feedback ? undefined : engine.markHintUsed} />

      {textInput && <form className="rung-answer-form" id={`form-${state.id}`} onSubmit={event => { event.preventDefault(); if (!feedback && engine.inputValue.trim()) engine.submit() }}>
        <div className={`rung-answer${answerState}`}>
          <span className="rung-answer__eq" aria-hidden="true">=</span>
          <label className="sr-only" htmlFor={`answer-${state.id}`}>{algebraInput ? 'Your simplified expression' : 'Your answer'}</label>
          <input className="opb-input rung-answer__input" id={`answer-${state.id}`} inputMode={algebraInput ? 'text' : 'decimal'} type="text" autoComplete="off" autoCapitalize="none" spellCheck={false} value={engine.inputValue} disabled={Boolean(feedback)} placeholder="?" onChange={event => engine.setInputValue(event.target.value)} />
        </div>
      </form>}

      {!teaching && !textInput && <div className="opb-choices pvb-choices" role="group" aria-label="Choose one answer">{state.interaction.options?.map(option => {
        const selected = selection.includes(option.id)
        const correct = state.interaction.correctAnswer === option.id
        const status = feedback ? correct ? 'correct' : selected ? 'incorrect' : 'neutral' : 'neutral'
        return <button type="button" key={option.id} className={`opb-choice pvb-choice pvb-choice--${status} opb-choice--${status}`} disabled={Boolean(feedback)} aria-pressed={selected} aria-label={`${option.label}${feedback ? correct ? ', correct answer' : selected ? ', your answer, incorrect' : '' : ''}`} onClick={() => engine.submitSelection([option.id])}>
          <span>{option.label}</span><span aria-hidden="true">{feedback ? correct ? '✓' : selected ? '×' : '' : ''}</span>
        </button>
      })}</div>}

      {feedback?.workedExplanation && <div className="rung-explain"><ExplanationSteps explanation={feedback.workedExplanation} showAnswer={false} /></div>}
    </article>

    {feedback
      ? <CheckBar
          status={feedback.correct ? 'correct' : 'incorrect'}
          title={feedback.correct ? PRAISE[engine.stateIndex % PRAISE.length] : 'Not quite'}
          message={feedback.correct ? undefined : <>{mistake ?? (GENERIC_FEEDBACK.has(feedback.message) ? null : feedback.message)}{feedback.correctAnswer && <> The answer is <strong>{answerText(feedback.correctAnswer)}</strong>.</>}</>}
        >
          <Button ref={continueButton} variant={feedback.correct ? 'good' : 'bad'} size="lg" onClick={next}>{last ? 'Finish lesson' : 'Continue'}</Button>
        </CheckBar>
      : <CheckBar>
          {engine.canGoBack && <Button variant="ghost" onClick={engine.back}>← Back</Button>}
          {teaching && <Button ref={continueButton} size="lg" onClick={next}>{last ? 'Finish lesson' : 'Continue'}</Button>}
          {textInput && <Button type="submit" form={`form-${state.id}`} size="lg" disabled={!engine.inputValue.trim()}>Check</Button>}
        </CheckBar>}
  </section>
}
