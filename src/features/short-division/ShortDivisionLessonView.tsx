'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChoiceCards } from '../number-types/components/ChoiceCards'
import { FeedbackPanel } from '../number-types/components/FeedbackPanel'
import { StateVisual } from '../number-types/components/StateVisual'
import { useLessonEngine } from '../number-types/useLessonEngine'
import type { MicroSkillId } from '../number-types/types'
import { QuotientRemainderInput } from './components/QuotientRemainderInput'
import { ShortDivisionHint, type ShortDivisionHintDefinition } from './components/ShortDivisionHint'
import { shortDivisionLesson, shortDivisionMicroSkillLabels } from './shortDivisionLesson'
import '../number-types/RationalNumbersLesson.css'
import './ShortDivisionLesson.css'

const journey: MicroSkillId[] = [
  'short-division-layout',
  'short-division-partial-dividend',
  'short-division-regrouping',
  'short-division-place-value',
  'short-division-check',
  'mixed',
]

const hints: Record<string, ShortDivisionHintDefinition> = {
  'L4-F01': { label: 'List nearby multiples', title: 'Count in equal groups', body: 'List multiples of 9 until the next one would be greater than 28.', example: '9, 18, 27, 36' },
  'L4-G01': { label: 'Subtract first', title: 'Find what remains', body: 'Multiply the quotient digit by the divisor, then subtract that product from the partial dividend. Regroup the result, not the quotient digit.' },
  'L4-I01': { label: 'Use nearby multiples', title: 'Work one partial dividend at a time', body: 'Find the greatest multiple of 9 that does not exceed the current partial dividend. Multiply back and subtract before regrouping.' },
  'L4-R01': { label: 'Compare with the divisor', title: 'Check the remainder bound', body: 'A valid whole-number remainder is never negative and must be smaller than the divisor.' },
  'L4-I02': { label: 'Pause at each remainder', title: 'Multiply back before regrouping', body: 'After writing a quotient digit, multiply it by 5 and subtract. Regroup only the remainder with the next digit.' },
  'L4-Z02': { label: 'Name the place', title: 'Keep the quotient columns aligned', body: 'The quotient already has a hundreds digit. Ask how many tens are produced by zero tens.' },
  'L4-I03': { label: 'Keep the columns aligned', title: 'Every remaining place needs a digit', body: 'Once the quotient has begun, write one quotient digit for each remaining place. A place can have a quotient digit of zero.' },
  'L4-C02': { label: 'Name each number', title: 'Reconstruct the dividend', body: 'Start with quotient × divisor, then add the remainder.' },
  'L4-T01': { label: 'Use both checks', title: 'Test the equality and the remainder', body: 'Reconstruct the dividend with (quotient × divisor) + remainder, then compare the remainder with the divisor.' },
}

export default function ShortDivisionLessonView() {
  const engine = useLessonEngine(shortDivisionLesson)
  const { state } = engine
  const [openHint, setOpenHint] = useState<string | null>(null)
  const [completedVisual, setCompletedVisual] = useState<string | null>(null)
  const coreStates = shortDivisionLesson.states.filter((candidate) => candidate.phase !== 'repair')
  const stateNumber = coreStates.findIndex((candidate) => candidate.id === state.id) + 1
  const visualProgress = Math.round((stateNumber / coreStates.length) * 100)
  const partNumber = journey.indexOf(state.microSkillId) + 1
  const stateHeadingRef = useRef<HTMLHeadingElement>(null)
  const previousStateRef = useRef(state.id)
  const isContinue = state.interaction.type === 'continue'
  const isFinalState = engine.stateIndex === shortDivisionLesson.states.length - 1
  const isStepper = state.component.type === 'shortDivision' && state.component.props.mode === 'stepper'
  const canContinue = !isStepper || completedVisual === state.id
  const isRemainderInput = state.interaction.type === 'quotientRemainderInput'
  const canSubmit = state.interaction.type === 'numericInput'
    ? engine.inputValue.trim().length > 0
    : isRemainderInput
      ? engine.quotientValue.trim().length > 0 && engine.remainderValue.trim().length > 0
      : engine.selection.length > 0
  const hint = hints[state.id]
  const onVisualComplete = useCallback(() => setCompletedVisual(state.id), [state.id])

  useEffect(() => {
    if (previousStateRef.current === state.id) return
    previousStateRef.current = state.id
    setOpenHint(null)
    setCompletedVisual(null)
    stateHeadingRef.current?.focus({ preventScroll: true })
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    stateHeadingRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' })
  }, [state.id])

  return (
    <section className="numbers-lesson short-division-lesson" id="lesson-4" aria-labelledby="short-division-lesson-title">
      <header className="numbers-lesson__header">
        <div><span className="lesson-kicker">{shortDivisionLesson.level} · Lesson 4</span><h2 id="short-division-lesson-title">{shortDivisionLesson.title}</h2></div>
        <div className="lesson-state-count" aria-label={`Part ${partNumber} of ${journey.length}`}><strong>{partNumber}</strong><span>/ {journey.length}</span></div>
      </header>
      <div className="lesson-progress" aria-label={`${visualProgress}% through lesson`}><span style={{ width: `${visualProgress}%` }} /></div>
      <nav className="micro-skill-map short-division-lesson__map" aria-label="Lesson journey">
        {journey.map((id, index) => {
          const currentIndex = journey.indexOf(state.microSkillId)
          const status = index < currentIndex ? 'complete' : index === currentIndex ? 'current' : 'upcoming'
          return <div className={`micro-skill-map__item micro-skill-map__item--${status}`} key={id} aria-current={status === 'current' ? 'step' : undefined}><span>{status === 'complete' ? '✓' : index + 1}</span><small>{shortDivisionMicroSkillLabels[id]}</small></div>
        })}
      </nav>
      <article className="lesson-state" key={state.id}>
        <div className="lesson-state__copy">
          {state.content.eyebrow && <p className="lesson-state__eyebrow">{state.content.eyebrow}</p>}
          <h3 ref={stateHeadingRef} tabIndex={-1}>{state.content.title || state.content.prompt || 'Lesson activity'}</h3>
          {state.content.body && <p className="lesson-state__body">{state.content.body}</p>}
          {state.content.title && state.content.prompt && <p className="lesson-state__prompt">{state.content.prompt}</p>}
        </div>
        {hint && !engine.feedback && <ShortDivisionHint hint={hint} open={openHint === state.id} onOpen={() => { engine.markHintUsed(); setOpenHint(state.id) }} onClose={() => setOpenHint(null)} />}
        <StateVisual visual={state.component} revealed={isContinue || Boolean(engine.feedback)} selected={engine.selection} onVisualSelect={engine.toggleOption} onVisualComplete={onVisualComplete} />
        {!isContinue && !engine.feedback && (
          <div className="lesson-response">
            {state.interaction.type === 'numericInput' ? (
              <div className="numeric-response"><label htmlFor={`response-${state.id}`}>Your answer</label><input id={`response-${state.id}`} inputMode="numeric" autoComplete="off" value={engine.inputValue} placeholder={state.interaction.placeholder} onChange={(event) => engine.setInputValue(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && canSubmit) engine.submit() }} /></div>
            ) : isRemainderInput ? (
              <QuotientRemainderInput id={`response-${state.id}`} quotient={engine.quotientValue} remainder={engine.remainderValue} disabled={Boolean(engine.feedback)} onQuotientChange={engine.setQuotientValue} onRemainderChange={engine.setRemainderValue} onSubmit={engine.submit} />
            ) : (
              <ChoiceCards options={state.interaction.options ?? []} selected={engine.selection} disabled={Boolean(engine.feedback)} onToggle={engine.toggleOption} />
            )}
            <button className="lesson-primary-action" type="button" disabled={!canSubmit} onClick={engine.submit}>{state.interaction.submitLabel ?? 'Check answer'}</button>
          </div>
        )}
        {engine.feedback && <FeedbackPanel feedback={engine.feedback} correct={engine.feedback.correct} />}
        <div className="lesson-state__actions">
          {engine.canGoBack && !engine.feedback && !engine.completed && <button className="lesson-secondary-action" type="button" onClick={engine.back}>← Back</button>}
          {isContinue && canContinue && <button className="lesson-primary-action" type="button" onClick={engine.continueLesson}>{engine.completed ? 'Start lesson again' : isFinalState ? 'Finish lesson' : 'Continue'} <span aria-hidden="true">→</span></button>}
          {engine.feedback && <button className="lesson-primary-action" type="button" onClick={engine.continueLesson}>{engine.completed ? 'Start lesson again' : 'Continue'} <span aria-hidden="true">→</span></button>}
        </div>
      </article>
      <footer className="numbers-lesson__footer"><p><strong>Habit:</strong> Divide → write → find the remainder → regroup → repeat.</p></footer>
    </section>
  )
}
