'use client'

import { useEffect, useRef, useId, useState } from 'react'
import { ExplanationSteps } from '../../number-types/components/ExplanationSteps'
import { useLessonEngine } from '../../number-types/useLessonEngine'
import { MethodWorkedExample } from './MethodWorkedExample'
import { FractionWorkedExample } from '../../fractions/tutor/FractionWorkedExample'
import { ConversionWorkedExample } from '../../fractions-decimals-percentages/tutor/ConversionWorkedExample'
import { diagnoseAmount, diagnoseFraction } from '../../fractions/tutor/fractionDiagnosis'
import { TutorMethodMedia } from './TutorMethodVisual'
import { Button, CheckBar } from '../../../ui'
import { RUNG_COMPLETE_EVENT } from '../../maths/studyLog'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from './model'

import '../../number-types/RationalNumbersLesson.css'
import './TutorLessonBase.css'
import '../../order-of-operations/variant-c/VariantC.css'
import '../WrittenMethods.css'
import './TutorMethod.css'
import './NumberSenseLesson.css'
import '../../fractions/tutor/FractionsLesson.css'
import '../../fractions-decimals-percentages/tutor/FractionsDecimalsPercentages.css'
import './RungLesson.css'

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
  if (interaction.type === 'numericInput') return diagnoseAmount(state.content.title, response)
  return null
}

/** Engine defaults that say nothing about this question; the hint is more useful in their place. */
const GENERIC = new Set(['Here’s the working.', 'Here’s the answer.', 'Correct.'])

/** The engine words answers as "Correct answer: 2/3."; the check bar only needs "2/3". */
const answerText = (text: string) => text.replace(/^Correct answer:\s*/i, '').replace(/\.$/, '')

const praise = ['Nice! That’s right.', 'Correct!', 'Spot on.', 'That’s it.']

function goToOverview() {
  window.history.pushState({}, '', '/preview')
  window.dispatchEvent(new PopStateEvent('popstate'))
}

type RungSummary = { title: string; nextTitle: string; questions: number; firstTry: number }

export default function TutorMethodLessonView({ lesson }: { lesson: TutorMethodLesson }) {
  const labels = lesson.labels
  const numberSense = lesson.number === 10 || lesson.number === 11
  const engine = useLessonEngine(lesson)
  const state = lesson.states[engine.stateIndex]
  const { feedback, selection } = engine
  const heading = useRef<HTMLHeadingElement>(null)
  const continueButton = useRef<HTMLButtonElement>(null)
  const previousId = useRef(state.id)
  const [showWorking, setShowWorking] = useState(false)
  const [rungDone, setRungDone] = useState<RungSummary | null>(null)
  const [leaving, setLeaving] = useState(false)

  const teaching = state.interaction.type === 'continue'
  const numeric = state.interaction.type === 'numericInput'
  const fraction = state.interaction.type === 'fractionInput'
  const pair = state.interaction.type === 'quotientRemainderInput'
  const choices = !teaching && !numeric && !fraction && !pair
  const last = engine.stateIndex === lesson.states.length - 1

  // Rungs: each micro-skill in the lesson is one rung of the ladder.
  const rungs = [...new Set(lesson.states.map(candidate => candidate.microSkillId))]
  const rungIndex = rungs.indexOf(state.microSkillId)
  const rungStates = lesson.states.flatMap((candidate, i) => candidate.microSkillId === state.microSkillId ? [i] : [])
  const positionInRung = rungStates.indexOf(engine.stateIndex)
  const lastInRung = positionInRung === rungStates.length - 1
  const rungQuestions = rungStates.filter(i => lesson.states[i].interaction.type !== 'continue')
  const questionNumber = rungQuestions.indexOf(engine.stateIndex) + 1
  const rungProgress = Math.round(((positionInRung + (feedback || teaching ? 1 : 0)) / rungStates.length) * 100)

  useEffect(() => {
    if (previousId.current === state.id) return
    previousId.current = state.id
    setShowWorking(false)
    heading.current?.focus({ preventScroll: true })
    document.getElementById(`lesson-${lesson.number}`)?.scrollIntoView({ block: 'start', behavior: 'instant' })
    if (leaving) goToOverview()
  }, [state.id, lesson.number, leaving])

  useEffect(() => { if (feedback) continueButton.current?.focus({ preventScroll: true }) }, [feedback])

  function next() {
    if (!engine.completed && lastInRung) window.dispatchEvent(new CustomEvent(RUNG_COMPLETE_EVENT))
    if (!engine.completed && lastInRung && !last && rungIndex < rungs.length - 1) {
      setRungDone({
        title: labels[state.microSkillId] ?? 'This rung',
        nextTitle: labels[rungs[rungIndex + 1]] ?? 'the next rung',
        questions: rungQuestions.length,
        firstTry: rungQuestions.filter(i => engine.attempts[lesson.states[i].id]?.correctFirstTry).length,
      })
      return
    }
    engine.continueLesson()
  }

  function keepGoing() {
    setRungDone(null)
    engine.continueLesson()
  }

  function takeABreak() {
    setRungDone(null)
    setLeaving(true)
    engine.continueLesson() // move past the finished rung first, so "Continue" later starts the next one
  }

  const title = labels[state.microSkillId] ?? lesson.title
  const header = <header className="rung-head">
    <div className="rung-head__meta">
      <span className="rung-head__kicker">{lesson.title} · Rung {rungIndex + 1} of {rungs.length}</span>
      <h2 id={`wmt-topic-${lesson.number}`}>{title}</h2>
    </div>
    <div className="rung-head__progress">
      <div className="rung-head__bar" role="progressbar" aria-label={`Progress through ${title}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={rungProgress}>
        <span style={{ width: `${Math.max(4, rungProgress)}%` }} />
      </div>
      <span className="rung-head__count" aria-hidden="true">{Math.min(positionInRung + 1, rungStates.length)} / {rungStates.length}</span>
    </div>
  </header>

  if (rungDone) {
    return <section className="rung-lesson" id={`lesson-${lesson.number}`} aria-labelledby="rung-done-title">
      {header}
      <div className="rung-done rv-paper" role="status">
        <div className="rung-done__badge" aria-hidden="true"><svg viewBox="0 0 24 24" width="40" height="40"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
        <p className="rung-done__kicker">Rung {rungIndex + 1} of {rungs.length} complete</p>
        <h3 id="rung-done-title" ref={heading} tabIndex={-1}>{rungDone.title}</h3>
        {rungDone.questions > 0 && <p className="rung-done__score"><strong>{rungDone.firstTry} of {rungDone.questions}</strong> right first time</p>}
        <p className="rung-done__next">Next rung: <strong>{rungDone.nextTitle}</strong></p>
        <div className="rung-done__actions">
          <Button size="lg" onClick={keepGoing} autoFocus>Keep going</Button>
          <Button variant="secondary" size="lg" onClick={takeABreak}>Take a break</Button>
        </div>
        <p className="rung-done__saved">Your progress is saved on this device.</p>
      </div>
    </section>
  }

  if (engine.completed) {
    return <section className="rung-lesson" id={`lesson-${lesson.number}`} aria-labelledby="lesson-done-title">
      <div className="rung-done rv-paper" role="status">
        <div className="rung-done__badge" aria-hidden="true"><svg viewBox="0 0 24 24" width="40" height="40"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
        <p className="rung-done__kicker">All {rungs.length} rungs climbed</p>
        <h3 id="lesson-done-title" ref={heading} tabIndex={-1}>Lesson complete: {lesson.title}</h3>
        <div className="rung-done__actions">
          <Button size="lg" onClick={goToOverview}>Back to lessons</Button>
          <Button variant="secondary" size="lg" onClick={engine.continueLesson}>Start again</Button>
        </div>
      </div>
    </section>
  }

  const response = pair ? `${engine.quotientValue} r ${engine.remainderValue}` : engine.inputValue
  const mistake = feedback && !feedback.correct ? explainMistake(state, response) : null
  const canCheck = pair ? Boolean(engine.quotientValue.trim() && engine.remainderValue.trim()) : Boolean(engine.inputValue.trim())
  const answerState = feedback ? feedback.correct ? ' is-correct' : ' is-incorrect' : ''
  const extraLines = state.visual.kind === 'text' && !repeatsTitle(state)

  return <section className={`numbers-lesson pvb-lesson wm-lesson wmt-lesson rung-lesson${numberSense ? ' ns-lesson' : ''}`} id={`lesson-${lesson.number}`} aria-labelledby={`wmt-topic-${lesson.number}`}>
    {header}
    <article className={`pvb-activity rung-card${teaching ? ' rung-card--teach' : ' rung-card--question'}`} key={state.id} data-state-id={state.id} data-source-ref={state.sourceRef}>
      <p className="rung-card__eyebrow">{teaching ? state.video ? 'Worked example' : 'Learn' : `Question ${questionNumber} of ${rungQuestions.length}`}</p>
      <h3 ref={heading} tabIndex={-1}>{state.content.title}</h3>
      {teaching && !state.video && state.content.body && <p className="pvb-body">{state.content.body}</p>}
      {(teaching || !numberSense) && !repeatsTitle(state) && (teaching || !extraLines ? <TutorMethodMedia state={state} /> : <div className="rung-given">{state.visual.kind === 'text' && state.visual.lines.map(line => <p key={line}>{line}</p>)}</div>)}
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
          title={feedback.correct ? praise[engine.stateIndex % praise.length] : 'Not quite'}
          message={feedback.correct ? undefined : <>{mistake ?? (GENERIC.has(feedback.message) ? state.hint : feedback.message)}{feedback.correctAnswer && <> The answer is <strong>{answerText(feedback.correctAnswer)}</strong>.</>}</>}
        >
          {state.working && <Button variant="secondary" aria-expanded={showWorking} onClick={() => setShowWorking(!showWorking)}>{showWorking ? 'Hide the working' : 'See the working'}</Button>}
          <Button ref={continueButton} variant={feedback.correct ? 'good' : 'bad'} size="lg" onClick={next}>{last ? 'Finish lesson' : 'Continue'}</Button>
        </CheckBar>
      : <CheckBar message={choices ? 'Tap the answer you think is right.' : undefined}>
          {engine.canGoBack && <Button variant="ghost" onClick={engine.back}>← Back</Button>}
          {teaching && <Button ref={continueButton} size="lg" onClick={next}>{last ? 'Finish lesson' : 'Continue'}</Button>}
          {(numeric || fraction || pair) && <Button type="submit" form={`form-${state.id}`} size="lg" disabled={!canCheck}>Check</Button>}
        </CheckBar>}
  </section>
}
