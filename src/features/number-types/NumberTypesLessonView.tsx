'use client'

import { useLessonEngine } from './useLessonEngine'
import { ChoiceCards } from './components/ChoiceCards'
import { FeedbackPanel } from './components/FeedbackPanel'
import { StateVisual } from './components/StateVisual'
import { LessonVideoActivity } from './components/LessonVideoActivity'
import type { LessonDefinition, MicroSkillId } from './types'
import { VariantDActivity } from './variant-d/VariantDActivity'
import { GENERIC_FEEDBACK, LessonDoneCard, PRAISE, RungDoneCard, RungHeader, answerText, useRungFlow } from '../maths/rungs'
import { diagnoseNumber } from '../written-methods/tutor/numberDiagnosis'
import { Button, CheckBar } from '../../ui'
import './RationalNumbersLesson.css'

/**
 * Lesson 1 (Number types) on the shared rung frame. The lesson's own activity components draw the
 * question and feedback; the rung header and bottom check bar come from the frame.
 * `focusMode` is kept for the existing call site; the rung frame is always focused.
 */
export default function NumberTypesLessonView({
  lesson,
  labels,
}: {
  lesson: LessonDefinition
  labels: Partial<Record<MicroSkillId, string>>
  focusMode?: boolean
}) {
  const engine = useLessonEngine(lesson)
  const flow = useRungFlow(lesson, engine, labels, 'lesson')
  const { state, teaching, last, heading, continueButton, rungQuestions, questionNumber, next } = flow
  const { feedback } = engine
  const video = state.component.type === 'lessonVideo'
  const variantD = state.component.type === 'integerValues'
  const numeric = state.interaction.type === 'numericInput'
  const multiple = state.interaction.type === 'multiSelect'
  const canSubmit = numeric ? engine.inputValue.trim().length > 0 : engine.selection.length > 0
  const header = <RungHeader flow={flow} lessonTitle="Number types" headingId="numbers-lesson-title" />

  if (flow.rungDone) return <section className="rung-lesson" id="lesson" aria-labelledby="rung-done-title">{header}<RungDoneCard flow={flow} /></section>
  if (engine.completed) return <section className="rung-lesson" id="lesson" aria-labelledby="lesson-done-title"><LessonDoneCard flow={flow} lessonTitle="Number types" onRestart={engine.continueLesson} /></section>

  const expected = typeof state.interaction.correctAnswer === 'number' || typeof state.interaction.correctAnswer === 'string' ? String(state.interaction.correctAnswer) : ''
  const mistake = feedback && !feedback.correct && numeric && expected ? diagnoseNumber(state.content.title, engine.inputValue, expected) : null

  return <section className="numbers-lesson numbers-lesson--focused rung-lesson" id="lesson" aria-labelledby="numbers-lesson-title">
    {header}
    <article className={`lesson-state rung-card${variantD ? ' lesson-state--variant-d' : ''}`} key={state.id}>
      {!video && !variantD && <p className="rung-card__eyebrow">{teaching ? 'Learn' : `Question ${questionNumber} of ${rungQuestions.length}`}</p>}
      {state.component.type === 'lessonVideo' ? <LessonVideoActivity clip={state.component.props} headingRef={heading} canGoBack={engine.canGoBack} onBack={engine.back} onContinue={next} hideActions />
        : variantD ? <VariantDActivity engine={engine} headingRef={heading} hideActions />
        : <>
          <div className="lesson-state__copy">
            {state.content.eyebrow && <p className="lesson-state__eyebrow">{state.content.eyebrow}</p>}
            <h3 ref={heading} tabIndex={-1}>{state.content.title || state.content.prompt || 'Lesson activity'}</h3>
            {state.content.body && <p className="lesson-state__body">{state.content.body}</p>}
            {state.content.title && state.content.prompt && <p className="lesson-state__prompt">{state.content.prompt}</p>}
          </div>
          <StateVisual visual={state.component} revealed={teaching || Boolean(feedback)} />
          {!teaching && !feedback && (numeric
            ? <form className="rung-answer-form" id={`form-${state.id}`} onSubmit={event => { event.preventDefault(); if (canSubmit) engine.submit() }}>
                <div className="rung-answer">
                  <span className="rung-answer__eq" aria-hidden="true">=</span>
                  <label className="sr-only" htmlFor={`response-${state.id}`}>Your answer</label>
                  <input id={`response-${state.id}`} className="rung-answer__input" inputMode="decimal" autoComplete="off" value={engine.inputValue} placeholder="?" onChange={event => engine.setInputValue(event.target.value)} />
                </div>
              </form>
            : <ChoiceCards options={state.interaction.options ?? []} selected={engine.selection} disabled={Boolean(feedback)} onToggle={engine.toggleOption} />)}
          {feedback && <FeedbackPanel feedback={feedback} correct={feedback.correct} />}
        </>}
    </article>

    {feedback
      ? <CheckBar
          status={feedback.correct ? 'correct' : 'incorrect'}
          title={feedback.correct ? PRAISE[engine.stateIndex % PRAISE.length] : 'Not quite'}
          message={feedback.correct ? undefined : <>{mistake ?? (GENERIC_FEEDBACK.has(feedback.message) ? null : feedback.message)}{feedback.correctAnswer && <> The answer is <strong>{answerText(feedback.correctAnswer)}</strong>.</>}</>}
        >
          <Button ref={continueButton} variant={feedback.correct ? 'good' : 'bad'} size="lg" onClick={next}>{last ? 'Finish lesson' : 'Continue'}</Button>
        </CheckBar>
      : <CheckBar message={!teaching && !video && !numeric && !multiple && variantD ? 'Tap the answer you think is right.' : multiple ? 'Select all that apply, then check.' : undefined}>
          {engine.canGoBack && <Button variant="ghost" onClick={engine.back}>← Back</Button>}
          {(teaching || video) && <Button ref={continueButton} size="lg" onClick={next}>{last ? 'Finish lesson' : 'Continue'}</Button>}
          {!teaching && !video && (numeric || multiple || !variantD) && <Button size="lg" disabled={!canSubmit} onClick={engine.submit}>Check</Button>}
        </CheckBar>}
  </section>
}
