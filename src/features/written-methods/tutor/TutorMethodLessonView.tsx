'use client'

import { useEffect, useId, useState } from 'react'
import { ExplanationSteps } from '../../number-types/components/ExplanationSteps'
import { useLessonEngine } from '../../number-types/useLessonEngine'
import { MethodWorkedExample } from './MethodWorkedExample'
import { FractionWorkedExample } from '../../fractions/tutor/FractionWorkedExample'
import { ConversionWorkedExample } from '../../fractions-decimals-percentages/tutor/ConversionWorkedExample'
import { diagnoseAmount, diagnoseFraction } from '../../fractions/tutor/fractionDiagnosis'
import { diagnoseNumber } from './numberDiagnosis'
import { TutorMethodMedia } from './TutorMethodVisual'
import { Button, CheckBar } from '../../../ui'
import { GENERIC_FEEDBACK, LessonDoneCard, PRAISE, RungDoneCard, RungHeader, answerText, useRungFlow } from '../../maths/rungs'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from './model'

import '../../number-types/RationalNumbersLesson.css'
import './TutorLessonBase.css'
import '../../order-of-operations/variant-c/VariantC.css'
import '../WrittenMethods.css'
import './TutorMethod.css'
import './NumberSenseLesson.css'
import '../../fractions/tutor/FractionsLesson.css'
import '../../fractions-decimals-percentages/tutor/FractionsDecimalsPercentages.css'

function Hint({ text, onConsult }: { text: string; onConsult: () => void }) {
  const [open, setOpen] = useState(false), id = useId()
  return <div className="pvb-hint rung-hint"><button type="button" className="pvb-hint-toggle" aria-expanded={open} aria-controls={id} onClick={() => { setOpen(!open); if (!open) onConsult() }}>{open ? 'Hide the hint' : 'Need a hint?'}</button><div id={id} className="pvb-hint__content" hidden={!open}><p>{text}</p></div></div>
}

function FractionAnswerInput({ id, mixed, disabled, onChange }: { id: string; mixed: boolean; disabled: boolean; onChange: (value: string) => void }) {
  const [whole, setWhole] = useState(''), [numerator, setNumerator] = useState(''), [denominator, setDenominator] = useState('')
  const update = (nextWhole: string, nextNumerator: string, nextDenominator: string) => {
    const completeFraction = nextNumerator.trim() && nextDenominator.trim()
    const value = completeFraction ? `${mixed && nextWhole.trim() ? `${nextWhole.trim()} ` : ''}${nextNumerator.trim()}/${nextDenominator.trim()}` : mixed && nextWhole.trim() && !nextNumerator.trim() && !nextDenominator.trim() ? nextWhole.trim() : ''
    onChange(value)
  }
  return <div className="fr-fraction-input rung-fraction" role="group" aria-label={mixed ? 'Enter a whole number and fraction' : 'Enter a fraction'}>
    {mixed && <label className="rung-fraction__whole" htmlFor={`whole-${id}`}><span className="sr-only">Whole number</span><input id={`whole-${id}`} inputMode="numeric" autoComplete="off" disabled={disabled} value={whole} onChange={event => { setWhole(event.target.value); update(event.target.value, numerator, denominator) }} /></label>}
    <div className="fr-fraction-input__stack rung-fraction__stack">
      <label htmlFor={`numerator-${id}`}><span className="sr-only">Numerator (top)</span><input id={`numerator-${id}`} inputMode="numeric" autoComplete="off" disabled={disabled} value={numerator} onChange={event => { setNumerator(event.target.value); update(whole, event.target.value, denominator) }} /></label>
      <span className="rung-fraction__bar" aria-hidden="true" />
      <label htmlFor={`denominator-${id}`}><span className="sr-only">Denominator (bottom)</span><input id={`denominator-${id}`} inputMode="numeric" autoComplete="off" disabled={disabled} value={denominator} onChange={event => { setDenominator(event.target.value); update(whole, numerator, event.target.value) }} /></label>
    </div>
  </div>
}

function WorkingPanel({ visual }: { visual: TutorWorking }) {
  return <div className="pvb-stage rung-working-panel">
    {visual.kind === 'fraction-worked' ? <FractionWorkedExample visual={visual} />
      : visual.kind === 'conversion-worked' ? <ConversionWorkedExample visual={visual} />
      : <MethodWorkedExample visual={visual} />}
  </div>
}

/** A practice question's stage only repeats its title; hide it so the question is shown once. */
function repeatsTitle(state: TutorMethodState) {
  return state.visual.kind === 'text' && state.visual.lines.length === 1 && state.visual.lines[0].trim() === state.content.title.trim()
}

function explainMistake(state: TutorMethodState, response: string) {
  const { interaction } = state
  const own = state.diagnose?.(response)
  if (own) return own
  if (interaction.type === 'fractionInput' && typeof interaction.correctAnswer === 'string') {
    return diagnoseFraction({
      question: state.content.title,
      response,
      expected: interaction.correctAnswer,
      requireSimplest: interaction.requireSimplest,
      requireMixedForm: interaction.requireMixedForm,
      requiredDenominator: interaction.requiredDenominator,
    })
  }
  if (interaction.type === 'numericInput') {
    const expected = typeof interaction.correctAnswer === 'number' || typeof interaction.correctAnswer === 'string' ? String(interaction.correctAnswer) : ''
    return diagnoseAmount(state.content.title, response) ?? (expected ? diagnoseNumber(state.content.title, response, expected) : null)
  }
  return null
}

export default function TutorMethodLessonView({ lesson }: { lesson: TutorMethodLesson }) {
  const numberSense = lesson.number >= 10
  // Lessons 12 onwards follow the minimal layout: no eyebrow above the question, no idle helper line.
  const minimal = lesson.number >= 12
  const engine = useLessonEngine(lesson)
  const flow = useRungFlow(lesson, engine, lesson.labels, `lesson-${lesson.number}`)
  const { state: baseState, teaching, last, heading, continueButton, rungQuestions, questionNumber, next } = flow
  const state = baseState as TutorMethodState
  const { feedback, selection } = engine
  const [showWorking, setShowWorking] = useState(false)
  useEffect(() => setShowWorking(false), [state.id])

  const numeric = state.interaction.type === 'numericInput'
  const fraction = state.interaction.type === 'fractionInput'
  const pair = state.interaction.type === 'quotientRemainderInput'
  const choices = !teaching && !numeric && !fraction && !pair
  const header = <RungHeader flow={flow} lessonTitle={lesson.title} headingId={`wmt-topic-${lesson.number}`} />

  if (flow.rungDone) return <section className="rung-lesson" id={`lesson-${lesson.number}`} aria-labelledby="rung-done-title">{header}<RungDoneCard flow={flow} /></section>
  if (engine.completed) return <section className="rung-lesson" id={`lesson-${lesson.number}`} aria-labelledby="lesson-done-title"><LessonDoneCard flow={flow} lessonTitle={lesson.title} onRestart={engine.continueLesson} /></section>

  const response = pair ? `${engine.quotientValue} r ${engine.remainderValue}` : engine.inputValue
  const mistake = feedback && !feedback.correct ? explainMistake(state, response) : null
  const canCheck = pair ? Boolean(engine.quotientValue.trim() && engine.remainderValue.trim()) : Boolean(engine.inputValue.trim())
  const answerState = feedback ? feedback.correct ? ' is-correct' : ' is-incorrect' : ''
  const extraLines = state.visual.kind === 'text' && !repeatsTitle(state)

  return <section className={`numbers-lesson pvb-lesson wm-lesson wmt-lesson rung-lesson${numberSense ? ' ns-lesson' : ''}`} id={`lesson-${lesson.number}`} aria-labelledby={`wmt-topic-${lesson.number}`}>
    {header}
    <article className={`pvb-activity rung-card${teaching ? ' rung-card--teach' : ' rung-card--question'}`} key={state.id} data-state-id={state.id} data-source-ref={state.sourceRef}>
      {!minimal && <p className="rung-card__eyebrow">{teaching ? state.video ? 'Worked example' : 'Learn' : `Question ${questionNumber} of ${rungQuestions.length}`}</p>}
      <h3 ref={heading} tabIndex={-1}>{state.content.title}</h3>
      {teaching && !state.video && state.content.body && <p className="pvb-body">{state.content.body}</p>}
      {(teaching || !numberSense || extraLines) && !repeatsTitle(state) && (teaching || !extraLines ? <TutorMethodMedia state={state} /> : <div className="rung-given">{state.visual.kind === 'text' && state.visual.lines.map(line => <p key={line}>{line}</p>)}</div>)}
      {teaching && state.video && state.content.body && <p className="pvb-body rung-card__tip">{state.content.body}</p>}

      {(numeric || fraction || pair) && <form className="rung-answer-form" id={`form-${state.id}`} onSubmit={event => { event.preventDefault(); if (!feedback && canCheck) engine.submit() }}>
        {numeric || fraction ? <div className={`rung-answer${answerState}`}>
          <span className="rung-answer__eq" aria-hidden="true">=</span>
          {numeric
            ? <><label className="sr-only" htmlFor={`answer-${state.id}`}>{state.answerLabel ?? 'Your answer'}</label>
              <input id={`answer-${state.id}`} className="pvb-input rung-answer__input" inputMode="decimal" type="text" autoComplete="off" spellCheck={false} value={engine.inputValue} disabled={Boolean(feedback)} placeholder="?" onChange={event => engine.setInputValue(event.target.value)} /></>
            : <FractionAnswerInput id={state.id} mixed={state.interaction.responseShape === 'mixedNumber'} disabled={Boolean(feedback)} onChange={engine.setInputValue} />}
          {state.answerLabel && numeric && <span className="rung-answer__unit" aria-hidden="true">{state.answerLabel.replace(/^.*\((.*)\).*$/, '$1')}</span>}
        </div> : <div className="wm-pair-input">{(['quotient', 'remainder'] as const).map(field => <label key={field} htmlFor={`${field}-${state.id}`}><span>{field === 'quotient' ? 'Full boxes' : 'Buns left over'}</span><input id={`${field}-${state.id}`} className="pvb-input" type="text" inputMode="numeric" autoComplete="off" value={field === 'quotient' ? engine.quotientValue : engine.remainderValue} disabled={Boolean(feedback)} onChange={event => (field === 'quotient' ? engine.setQuotientValue : engine.setRemainderValue)(event.target.value)} /></label>)}</div>}
      </form>}

      {choices && <div className="pvb-choices" role="group" aria-label="Choose one answer">{state.interaction.options?.map(option => {
        const selected = selection.includes(option.id), correct = state.interaction.correctAnswer === option.id
        const status = feedback ? correct ? 'correct' : selected ? 'incorrect' : 'neutral' : 'neutral'
        return <button type="button" key={option.id} className={`pvb-choice pvb-choice--${status}`} disabled={Boolean(feedback)} aria-pressed={selected} aria-label={`${option.label}${feedback ? correct ? ', correct answer' : selected ? ', your answer, incorrect' : '' : ''}`} onClick={() => engine.submitSelection([option.id])}><span>{option.label}</span><span aria-hidden="true">{feedback ? correct ? '✓' : selected ? '×' : '' : ''}</span></button>
      })}</div>}

      {!teaching && !feedback && state.hint && <Hint text={state.hint} onConsult={engine.markHintUsed} />}
      {feedback && !feedback.correct && !mistake && lesson.number < 6 && feedback.workedExplanation && <div className="rung-explain"><ExplanationSteps explanation={feedback.workedExplanation} /></div>}
      {feedback && showWorking && state.working && <WorkingPanel visual={state.working} />}
    </article>

    {feedback
      ? <CheckBar
          status={feedback.correct ? 'correct' : 'incorrect'}
          title={feedback.correct ? PRAISE[engine.stateIndex % PRAISE.length] : 'Not quite'}
          message={feedback.correct ? undefined : <>{mistake ?? (GENERIC_FEEDBACK.has(feedback.message) ? state.hint : feedback.message)}{feedback.correctAnswer && <> The answer is <strong>{answerText(feedback.correctAnswer)}</strong>.</>}</>}
        >
          {state.working && <Button variant="secondary" aria-expanded={showWorking} onClick={() => setShowWorking(!showWorking)}>{showWorking ? 'Hide the working' : 'See the working'}</Button>}
          <Button ref={continueButton} variant={feedback.correct ? 'good' : 'bad'} size="lg" onClick={next}>{last ? 'Finish lesson' : 'Continue'}</Button>
        </CheckBar>
      : <CheckBar message={choices && !minimal ? 'Tap the answer you think is right.' : undefined}>
          {engine.canGoBack && <Button variant="ghost" onClick={engine.back}>← Back</Button>}
          {teaching && <Button ref={continueButton} size="lg" onClick={next}>{last ? 'Finish lesson' : 'Continue'}</Button>}
          {(numeric || fraction || pair) && <Button type="submit" form={`form-${state.id}`} size="lg" disabled={!canCheck}>Check</Button>}
        </CheckBar>}
  </section>
}
