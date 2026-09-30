'use client'

import { useEffect, useId, useRef, useState, type Ref } from 'react'
import { useLessonEngine } from '../../number-types/useLessonEngine'
import { MethodWorkedExample } from './MethodWorkedExample'
import { FractionWorkedExample } from '../../fractions/tutor/FractionWorkedExample'
import { ConversionWorkedExample } from '../../fractions-decimals-percentages/tutor/ConversionWorkedExample'
import { diagnoseAmount, diagnoseFraction } from '../../fractions/tutor/fractionDiagnosis'
import { diagnoseNumber } from './numberDiagnosis'
import { TutorMethodMedia } from './TutorMethodVisual'
import { Powers } from './Powers'
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
  return <div className="pvb-hint rung-hint"><button type="button" className="pvb-hint-toggle" aria-expanded={open} aria-controls={id} onClick={() => { setOpen(!open); if (!open) onConsult() }}>{open ? 'Hide the hint' : 'Need a hint?'}</button><div id={id} className="pvb-hint__content" hidden={!open}><p><Powers text={text} /></p></div></div>
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

/** Standard form as two boxes, A × 10 to the power n. The power box takes a minus sign, so it opens the full keyboard (a number pad has no minus key). */
function StandardFormAnswerInput({ id, disabled, onChange }: { id: string; disabled: boolean; onChange: (value: string) => void }) {
  const [a, setA] = useState(''), [power, setPower] = useState('')
  const update = (nextA: string, nextPower: string) => {
    const digits = nextPower.trim().replace(/^[-−]\s*/, '')
    const sign = /^[-−]/.test(nextPower.trim()) ? '-' : ''
    onChange(nextA.trim() && digits ? `${nextA.trim()}×10^${sign}${digits}` : '')
  }
  return <div className="rung-sf" role="group" aria-label="Enter a number in standard form">
    <label htmlFor={`sf-a-${id}`}><span className="sr-only">Number from 1 up to 10</span><input id={`sf-a-${id}`} className="rung-sf__a" inputMode="decimal" autoComplete="off" spellCheck={false} placeholder="?" disabled={disabled} value={a} onChange={event => { setA(event.target.value); update(event.target.value, power) }} /></label>
    <span className="rung-sf__times" aria-hidden="true">× 10</span>
    <span className="rung-sf__power">
      <label htmlFor={`sf-n-${id}`}><span className="sr-only">Power of 10 (type − first if it is negative)</span><input id={`sf-n-${id}`} inputMode="text" autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder="?" disabled={disabled} value={power} onChange={event => { setPower(event.target.value); update(a, event.target.value) }} /></label>
    </span>
  </div>
}

const SUPERSCRIPTS: Record<string, string> = { '-': '⁻', '−': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }

/**
 * An algebra answer, typed with the letter keyboard. The x² key saves hunting for a superscript. With `anyPower`
 * it is an xⁿ key instead: tap it and the digits (and a minus) typed next are raised, until anything else is typed.
 */
function ExpressionAnswerInput({ id, value, disabled, anyPower, onChange }: { id: string; value: string; disabled: boolean; anyPower?: boolean; onChange: (value: string) => void }) {
  const input = useRef<HTMLInputElement>(null)
  const [raising, setRaising] = useState(false)
  const square = () => {
    const field = input.current, at = field?.selectionStart ?? value.length, end = field?.selectionEnd ?? at
    onChange(`${value.slice(0, at)}²${value.slice(end)}`)
    requestAnimationFrame(() => { field?.focus(); field?.setSelectionRange(at + 1, at + 1) })
  }
  const power = () => { setRaising(!raising); requestAnimationFrame(() => input.current?.focus()) }
  const type = (next: string) => {
    if (!raising) return onChange(next)
    // Find what was just typed: the text between the unchanged start and the unchanged end.
    let start = 0
    while (start < value.length && start < next.length && value[start] === next[start]) start++
    let end = 0
    while (end < value.length - start && end < next.length - start && value[value.length - 1 - end] === next[next.length - 1 - end]) end++
    const typed = next.slice(start, next.length - end)
    if (!typed || [...typed].some(c => !SUPERSCRIPTS[c])) { setRaising(false); return onChange(next) }
    const raised = [...typed].map(c => SUPERSCRIPTS[c]).join('')
    onChange(next.slice(0, start) + raised + next.slice(next.length - end))
    requestAnimationFrame(() => input.current?.setSelectionRange(start + raised.length, start + raised.length))
  }
  return <div className="rung-expression">
    <label className="sr-only" htmlFor={`answer-${id}`}>Your answer</label>
    <input ref={input} id={`answer-${id}`} className={`pvb-input rung-answer__input rung-expression__input${value.length > 10 ? ' is-long' : ''}`} type="text" inputMode="text" autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} value={value} disabled={disabled} placeholder="?" onChange={event => type(event.target.value)} />
    {anyPower
      ? <button type="button" className={`rung-expression__key${raising ? ' is-on' : ''}`} onClick={power} disabled={disabled} aria-pressed={raising} aria-label="Type a power: the next digits are raised">x<sup>n</sup></button>
      : <button type="button" className="rung-expression__key" onClick={square} disabled={disabled} aria-label="Type a squared sign">x²</button>}
  </div>
}

/**
 * A squared unknown has two answers: "x = ☐ or x = ☐", in either order. Each box opens the full keyboard, because a
 * number pad has no minus key. Either box alone can be checked, so an answer with only the positive root is caught.
 */
function RootsAnswerInput({ id, letter, disabled, onChange }: { id: string; letter: string; disabled: boolean; onChange: (value: string) => void }) {
  const [first, setFirst] = useState(''), [second, setSecond] = useState('')
  const update = (a: string, b: string) => onChange([a, b].map(value => value.trim().replace(/^[−–]/, '-')).filter(Boolean).join(', '))
  const box = (which: 'a' | 'b', value: string, set: (value: string) => void) => <label htmlFor={`root-${which}-${id}`}>
    <span className="sr-only">{which === 'a' ? 'First answer' : 'Second answer'} (type − first if it is negative)</span>
    <input id={`root-${which}-${id}`} className="pvb-input rung-answer__input" inputMode="text" autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder="?" disabled={disabled} value={value}
      onChange={event => { set(event.target.value); update(which === 'a' ? event.target.value : first, which === 'a' ? second : event.target.value) }} />
  </label>
  return <div className="rung-roots" role="group" aria-label={`Enter both values of ${letter}`}>
    <span className="rung-roots__pair"><span className="rung-answer__eq" aria-hidden="true">{letter} =</span>{box('a', first, setFirst)}</span>
    <span className="rung-roots__or">or</span>
    <span className="rung-roots__pair"><span className="rung-answer__eq" aria-hidden="true">{letter} =</span>{box('b', second, setSecond)}</span>
  </div>
}

/** One power, as a base with its power box raised beside it (like the power box in standard form). */
function PowerAnswerInput({ id, disabled, onChange }: { id: string; disabled: boolean; onChange: (value: string) => void }) {
  const [base, setBase] = useState(''), [power, setPower] = useState('')
  const update = (nextBase: string, nextPower: string) => {
    const digits = nextPower.trim().replace(/^[-−]\s*/, '')
    const sign = /^[-−]/.test(nextPower.trim()) ? '-' : ''
    onChange(nextBase.trim() && digits ? `${nextBase.trim()}^${sign}${digits}` : '')
  }
  return <div className="rung-sf rung-power" role="group" aria-label="Enter a single power">
    <label htmlFor={`pw-base-${id}`}><span className="sr-only">Base (the number or letter being raised)</span><input id={`pw-base-${id}`} className="rung-sf__a" inputMode="text" autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder="?" disabled={disabled} value={base} onChange={event => { setBase(event.target.value); update(event.target.value, power) }} /></label>
    <span className="rung-sf__power">
      <label htmlFor={`pw-power-${id}`}><span className="sr-only">Power (type − first if it is negative)</span><input id={`pw-power-${id}`} inputMode="text" autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder="?" disabled={disabled} value={power} onChange={event => { setPower(event.target.value); update(base, event.target.value) }} /></label>
    </span>
  </div>
}

function WorkingPanel({ visual, ref }: { visual: TutorWorking; ref?: Ref<HTMLDivElement> }) {
  return <div className="pvb-stage rung-working-panel" ref={ref}>
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
  if (interaction.responseShape === 'standardForm' || interaction.responseShape === 'expression' || interaction.responseShape === 'power' || interaction.responseShape === 'roots' || interaction.type === 'multiSelect') return null
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
  const engine = useLessonEngine(lesson)
  const flow = useRungFlow(lesson, engine, lesson.labels, `lesson-${lesson.number}`)
  const { state: baseState, teaching, last, heading, continueButton, next } = flow
  const state = baseState as TutorMethodState
  const { feedback, selection } = engine
  const [showWorking, setShowWorking] = useState(false)
  useEffect(() => setShowWorking(false), [state.id])
  // Opening the working brings it into view above the folded answer ribbon, so the ribbon never sits on top of it.
  const workingPanel = useRef<HTMLDivElement>(null)
  useEffect(() => { if (showWorking) workingPanel.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }) }, [showWorking])

  const numeric = state.interaction.type === 'numericInput'
  const fraction = state.interaction.type === 'fractionInput'
  const standardForm = numeric && state.interaction.responseShape === 'standardForm'
  const expression = numeric && state.interaction.responseShape === 'expression'
  const power = numeric && state.interaction.responseShape === 'power'
  const roots = numeric && state.interaction.responseShape === 'roots'
  const multi = state.interaction.type === 'multiSelect'
  const pair = state.interaction.type === 'quotientRemainderInput'
  const choices = !teaching && !numeric && !fraction && !pair
  const header = <RungHeader flow={flow} lessonTitle={lesson.title} headingId={`wmt-topic-${lesson.number}`} />

  if (flow.rungDone) return <section className="rung-lesson" id={`lesson-${lesson.number}`} aria-labelledby="rung-done-title">{header}<RungDoneCard flow={flow} /></section>
  if (engine.completed) return <section className="rung-lesson" id={`lesson-${lesson.number}`} aria-labelledby="lesson-done-title"><LessonDoneCard flow={flow} lessonTitle={lesson.title} onRestart={engine.continueLesson} /></section>

  const response = pair ? `${engine.quotientValue} r ${engine.remainderValue}` : multi ? selection.join(',') : engine.inputValue
  const mistake = feedback && !feedback.correct ? explainMistake(state, response) : null
  const canCheck = pair ? Boolean(engine.quotientValue.trim() && engine.remainderValue.trim()) : Boolean(engine.inputValue.trim())
  const answerState = feedback ? feedback.correct ? ' is-correct' : ' is-incorrect' : ''
  const extraLines = state.visual.kind === 'text' && !repeatsTitle(state)
  // The question's own grid or bus stop is drawn again, step by step, in its working; once that is open, show it once.
  const drawnInWorking = Boolean(feedback && showWorking && state.working && (state.visual.kind === 'diagram' || state.visual.kind === 'grid'))
  // Worked examples are step chains that explain every move, so the one-line method summary would repeat them.
  const stepChain = state.visual.kind === 'method-worked' || state.visual.kind === 'fraction-worked' || state.visual.kind === 'conversion-worked'

  return <section className={`numbers-lesson pvb-lesson wm-lesson wmt-lesson rung-lesson${numberSense ? ' ns-lesson' : ''}`} id={`lesson-${lesson.number}`} aria-labelledby={`wmt-topic-${lesson.number}`}>
    {header}
    <article className={`pvb-activity rung-card${teaching ? ' rung-card--teach' : ' rung-card--question'}`} key={state.id} data-state-id={state.id} data-source-ref={state.sourceRef}>
      <h3 ref={heading} tabIndex={-1}>{state.content.heading ? <><span aria-hidden="true"><Powers text={state.content.heading} /></span><span className="sr-only">{state.content.title}</span></> : <Powers text={state.content.title} />}</h3>
      {teaching && !state.video && state.content.body && !stepChain && <p className="pvb-body">{state.content.body}</p>}
      {(teaching || !numberSense || extraLines) && !repeatsTitle(state) && !drawnInWorking && (teaching || !extraLines ? <TutorMethodMedia state={state} /> : <div className="rung-given">{state.visual.kind === 'text' && state.visual.lines.map(line => <p key={line}><Powers text={line} /></p>)}</div>)}
      {teaching && state.video && state.content.body && !stepChain && <p className="pvb-body rung-card__tip">{state.content.body}</p>}

      {(numeric || fraction || pair) && <form className="rung-answer-form" id={`form-${state.id}`} onSubmit={event => { event.preventDefault(); if (!feedback && canCheck) engine.submit() }}>
        {numeric || fraction ? <div className={`rung-answer${answerState}`}>
          {!standardForm && !expression && !power && !roots && <span className="rung-answer__eq" aria-hidden="true">{state.answerPrefix ?? '='}</span>}
          {roots
            ? <RootsAnswerInput id={state.id} letter={state.answerPrefix?.replace(/\s*=$/, '') ?? 'x'} disabled={Boolean(feedback)} onChange={engine.setInputValue} />
            : expression
            ? <ExpressionAnswerInput id={state.id} value={engine.inputValue} disabled={Boolean(feedback)} anyPower={state.interaction.anyPower} onChange={engine.setInputValue} />
            : power
            ? <PowerAnswerInput id={state.id} disabled={Boolean(feedback)} onChange={engine.setInputValue} />
            : standardForm
            ? <StandardFormAnswerInput id={state.id} disabled={Boolean(feedback)} onChange={engine.setInputValue} />
            : numeric
            ? <><label className="sr-only" htmlFor={`answer-${state.id}`}>{state.answerLabel ?? 'Your answer'}</label>
              <input id={`answer-${state.id}`} className="pvb-input rung-answer__input" inputMode="decimal" type="text" autoComplete="off" spellCheck={false} value={engine.inputValue} disabled={Boolean(feedback)} placeholder="?" onChange={event => engine.setInputValue(event.target.value)} /></>
            : <FractionAnswerInput id={state.id} mixed={state.interaction.responseShape === 'mixedNumber'} disabled={Boolean(feedback)} onChange={engine.setInputValue} />}
          {state.answerLabel && numeric && <span className="rung-answer__unit" aria-hidden="true">{state.answerLabel.replace(/^.*\((.*)\).*$/, '$1')}</span>}
        </div> : <div className="wm-pair-input">{(['quotient', 'remainder'] as const).map(field => <label key={field} htmlFor={`${field}-${state.id}`}><span>{field === 'quotient' ? 'Full boxes' : 'Buns left over'}</span><input id={`${field}-${state.id}`} className="pvb-input" type="text" inputMode="numeric" autoComplete="off" value={field === 'quotient' ? engine.quotientValue : engine.remainderValue} disabled={Boolean(feedback)} onChange={event => (field === 'quotient' ? engine.setQuotientValue : engine.setRemainderValue)(event.target.value)} /></label>)}</div>}
      </form>}

      {choices && <div className="pvb-choices" role="group" aria-label={multi ? 'Choose every answer that fits' : 'Choose one answer'}>{state.interaction.options?.map(option => {
        const answers = state.interaction.correctAnswer
        const selected = selection.includes(option.id), correct = Array.isArray(answers) ? answers.map(String).includes(option.id) : answers === option.id
        const status = feedback ? correct ? 'correct' : selected ? 'incorrect' : 'neutral' : selected ? 'selected' : 'neutral'
        return <button type="button" key={option.id} className={`pvb-choice pvb-choice--${status}`} disabled={Boolean(feedback)} aria-pressed={selected} aria-label={`${option.label}${feedback ? correct ? ', correct answer' : selected ? ', your answer, incorrect' : '' : ''}`} onClick={() => multi ? engine.toggleOption(option.id) : engine.submitSelection([option.id])}><span><Powers text={option.label} /></span><span aria-hidden="true" className={multi && !feedback ? `pvb-choice__box${selected ? ' pvb-choice__box--on' : ''}` : undefined}>{feedback ? correct ? '✓' : selected ? '×' : '' : ''}</span></button>
      })}</div>}

      {!teaching && !feedback && state.hint && <Hint text={state.hint} onConsult={engine.markHintUsed} />}
      {feedback && showWorking && state.working && <WorkingPanel visual={state.working} ref={workingPanel} />}
    </article>

    {feedback
      ? <CheckBar
          status={feedback.correct ? 'correct' : 'incorrect'}
          compact={showWorking}
          title={feedback.correct ? PRAISE[engine.stateIndex % PRAISE.length] : 'Not quite'}
          message={feedback.correct ? undefined : <><Powers text={mistake ?? (GENERIC_FEEDBACK.has(feedback.message) ? state.hint : feedback.message)} />{feedback.correctAnswer && <> The answer is <strong><Powers text={answerText(feedback.correctAnswer)} /></strong>.</>}</>}
        >
          {state.working && <Button variant="secondary" aria-expanded={showWorking} onClick={() => setShowWorking(!showWorking)}>{showWorking ? 'Hide working' : 'See the working'}</Button>}
          <Button ref={continueButton} variant={feedback.correct ? 'good' : 'bad'} size="lg" onClick={next}>{last ? 'Finish lesson' : 'Continue'}</Button>
        </CheckBar>
      : <CheckBar>
          {engine.canGoBack && <Button variant="ghost" onClick={engine.back}>← Back</Button>}
          {teaching && <Button ref={continueButton} size="lg" onClick={next}>{last ? 'Finish lesson' : 'Continue'}</Button>}
          {multi && <Button size="lg" disabled={!selection.length} onClick={engine.submit}>Check</Button>}
          {(numeric || fraction || pair) && <Button type="submit" form={`form-${state.id}`} size="lg" disabled={!canCheck}>Check</Button>}
        </CheckBar>}
  </section>
}
