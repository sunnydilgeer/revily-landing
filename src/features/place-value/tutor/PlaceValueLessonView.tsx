'use client'

import { ExplanationSteps } from '../../number-types/components/ExplanationSteps'
import { useLessonEngine } from '../../number-types/useLessonEngine'
import { GENERIC_FEEDBACK, LessonDoneCard, PRAISE, RungDoneCard, RungHeader, answerText, useRungFlow } from '../../maths/rungs'
import { diagnoseNumber } from '../../written-methods/tutor/numberDiagnosis'
import { Button, CheckBar } from '../../../ui'
import { InlinePlaceHint } from './PlaceValueHint'
import { PlaceValueTeachingMedia } from './PlaceValueTeachingMedia'
import { tutorPlaceValueLesson as lesson, tutorPlaceValueLabels as labels, type TutorPlaceState } from './placeValueLesson'
import '../../number-types/RationalNumbersLesson.css'
import '../../written-methods/tutor/TutorLessonBase.css'
import '../../order-of-operations/variant-c/VariantC.css'
import './PlaceValueLesson.css'

/** Lesson 3 (Place value) on the shared rung frame. */
export default function TutorPlaceValueLessonView() {
  const engine = useLessonEngine(lesson)
  const flow = useRungFlow(lesson, engine, labels, 'lesson-3')
  const { teaching, last, heading, continueButton, rungQuestions, questionNumber, next } = flow
  const state = flow.state as TutorPlaceState
  const { feedback, selection } = engine
  const numeric = state.interaction.type === 'numericInput'
  const fraction = state.interaction.acceptanceRule === 'fraction'
  const header = <RungHeader flow={flow} lessonTitle="Place value" headingId="pvt-topic" />

  if (flow.rungDone) return <section className="rung-lesson" id="lesson-3" aria-labelledby="rung-done-title">{header}<RungDoneCard flow={flow} /></section>
  if (engine.completed) return <section className="rung-lesson" id="lesson-3" aria-labelledby="lesson-done-title"><LessonDoneCard flow={flow} lessonTitle="Place value" onRestart={engine.continueLesson} /></section>

  const expected = typeof state.interaction.correctAnswer === 'number' || typeof state.interaction.correctAnswer === 'string' ? String(state.interaction.correctAnswer) : ''
  const mistake = feedback && !feedback.correct && numeric && !fraction && expected ? diagnoseNumber(state.content.title, engine.inputValue, expected) : null
  const answerState = feedback ? feedback.correct ? ' is-correct' : ' is-incorrect' : ''

  return <section className="numbers-lesson pvb-lesson pvt-lesson rung-lesson" id="lesson-3" aria-labelledby="pvt-topic">
    {header}
    <article className={`pvb-activity rung-card${teaching ? ' rung-card--teach' : ' rung-card--question'}`} key={state.id} data-state-id={state.id} data-source-ref={state.sourceRef}>
      <p className="rung-card__eyebrow">{teaching ? state.video ? 'Worked example' : 'Learn' : `Question ${questionNumber} of ${rungQuestions.length}`}</p>
      <h3 ref={heading} tabIndex={-1}>{state.content.title}</h3>
      {teaching && !state.video && state.content.body && <p className="pvb-body">{state.content.body}</p>}
      <PlaceValueTeachingMedia state={state} />
      {numeric && <form className="rung-answer-form" id={`form-${state.id}`} onSubmit={event => { event.preventDefault(); if (!feedback && engine.inputValue.trim()) engine.submit() }}>
        <div className={`rung-answer${answerState}`}>
          <span className="rung-answer__eq" aria-hidden="true">=</span>
          <label className="sr-only" htmlFor={`answer-${state.id}`}>{fraction ? 'Your fraction' : 'Your answer'}</label>
          <input id={`answer-${state.id}`} className="pvb-input rung-answer__input" inputMode={fraction ? 'text' : 'decimal'} type="text" autoComplete="off" spellCheck={false} value={engine.inputValue} disabled={Boolean(feedback)} placeholder="?" onChange={event => engine.setInputValue(event.target.value)} />
        </div>
      </form>}
      {!teaching && !numeric && <div className="pvb-choices" role="group" aria-label="Choose one answer">{state.interaction.options?.map(option => {
        const selected = selection.includes(option.id), correct = state.interaction.correctAnswer === option.id
        const status = feedback ? correct ? 'correct' : selected ? 'incorrect' : 'neutral' : 'neutral'
        return <button type="button" key={option.id} className={`pvb-choice pvb-choice--${status}`} disabled={Boolean(feedback)} aria-pressed={selected} aria-label={`${option.label}${feedback ? correct ? ', correct answer' : selected ? ', your answer, incorrect' : '' : ''}`} onClick={() => engine.submitSelection([option.id])}><span>{option.label}</span><span aria-hidden="true">{feedback ? correct ? '✓' : selected ? '×' : '' : ''}</span></button>
      })}</div>}
      {!teaching && !feedback && state.hints && <InlinePlaceHint hints={state.hints} onConsult={engine.markHintUsed} />}
      {feedback?.workedExplanation && <div className="rung-explain"><ExplanationSteps explanation={feedback.workedExplanation} /></div>}
    </article>

    {feedback
      ? <CheckBar
          status={feedback.correct ? 'correct' : 'incorrect'}
          title={feedback.correct ? PRAISE[engine.stateIndex % PRAISE.length] : 'Not quite'}
          message={feedback.correct ? undefined : <>{mistake ?? (GENERIC_FEEDBACK.has(feedback.message) ? null : feedback.message)}{feedback.correctAnswer && <> The answer is <strong>{answerText(feedback.correctAnswer)}</strong>.</>}</>}
        >
          <Button ref={continueButton} variant={feedback.correct ? 'good' : 'bad'} size="lg" onClick={next}>{last ? 'Finish lesson' : 'Continue'}</Button>
        </CheckBar>
      : <CheckBar message={!teaching && !numeric ? 'Tap the answer you think is right.' : undefined}>
          {engine.canGoBack && <Button variant="ghost" onClick={engine.back}>← Back</Button>}
          {teaching && <Button ref={continueButton} size="lg" onClick={next}>{last ? 'Finish lesson' : 'Continue'}</Button>}
          {numeric && <Button type="submit" form={`form-${state.id}`} size="lg" disabled={!engine.inputValue.trim()}>Check</Button>}
        </CheckBar>}
  </section>
}
