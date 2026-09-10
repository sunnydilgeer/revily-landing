'use client'

import { useEffect, useRef, useState } from 'react'
import { ChoiceCards } from '../number-types/components/ChoiceCards'
import { FeedbackPanel } from '../number-types/components/FeedbackPanel'
import { StateVisual } from '../number-types/components/StateVisual'
import { useLessonEngine } from '../number-types/useLessonEngine'
import type { MicroSkillId } from '../number-types/types'
import { PlaceValueHint, type PlaceValueHintDefinition } from './components/PlaceValueHint'
import { placeValueLesson, placeValueMicroSkillLabels } from './placeValueLesson'
import '../number-types/RationalNumbersLesson.css'
import './PlaceValueLesson.css'

const journey: MicroSkillId[] = ['digit-place-value', 'decimal-places', 'placeholder-zeroes', 'decimal-comparison', 'mixed']

const hints: Record<string, PlaceValueHintDefinition> = {
  'L3-I02': { label: 'Find the column', title: 'Name the column first', body: 'Then multiply the digit by one unit of that column.', example: 'In 264,000, the 6 is in ten thousands: 6 × 10,000.' },
  'L3-D02': { label: 'Count the places', title: 'Start beside the decimal point', body: 'The first place right is tenths, the second is hundredths, and the third is thousandths.', example: 'ones | . | tenths | hundredths | thousandths' },
  'L3-Z02': { label: 'Mark the empty places', title: 'Keep every named column fixed', body: 'Put each stated digit in its named column. Every column left empty between them needs a zero placeholder.' },
  'L3-C02': { label: 'Align the places', title: 'Trailing zeroes can make alignment visible', body: 'Adding a zero at the end of a decimal does not change its value. Then compare matching columns.', example: '2.5 = 2.50' },
  'L3-O02': { label: 'Line up the decimals', title: 'Use one shared place-value grid', body: 'Write every number to the same number of decimal places, then compare from the left. The first unequal place decides.' },
}

export default function PlaceValueLessonView() {
  const engine = useLessonEngine(placeValueLesson)
  const { state } = engine
  const [openHint, setOpenHint] = useState<string | null>(null)
  const coreStates = placeValueLesson.states.filter((candidate) => candidate.phase !== 'repair')
  const stateNumber = coreStates.findIndex((candidate) => candidate.id === state.id) + 1
  const visualProgress = Math.round((stateNumber / coreStates.length) * 100)
  const partNumber = journey.indexOf(state.microSkillId) + 1
  const stateHeadingRef = useRef<HTMLHeadingElement>(null)
  const previousStateRef = useRef(state.id)
  const isContinue = state.interaction.type === 'continue'
  const isFinalState = engine.stateIndex === placeValueLesson.states.length - 1
  const usesVisualChoices = state.component.type === 'decimalComparison' && Boolean(state.component.props.optionIds)
  const isOrder = state.interaction.type === 'order'
  const canSubmit = state.interaction.type === 'numericInput' ? engine.inputValue.trim().length > 0 : isOrder || engine.selection.length > 0
  const hint = hints[state.id]

  useEffect(() => {
    if (previousStateRef.current === state.id) return
    previousStateRef.current = state.id
    setOpenHint(null)
    stateHeadingRef.current?.focus({ preventScroll: true })
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    stateHeadingRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' })
  }, [state.id])

  return <section className="numbers-lesson place-value-lesson" id="lesson-3" aria-labelledby="place-value-lesson-title">
    <header className="numbers-lesson__header">
      <div><span className="lesson-kicker">{placeValueLesson.level} · Lesson 3</span><h2 id="place-value-lesson-title">{placeValueLesson.title}</h2></div>
      <div className="lesson-state-count" aria-label={`Part ${partNumber} of ${journey.length}`}><strong>{partNumber}</strong><span>/ {journey.length}</span></div>
    </header>
    <div className="lesson-progress" aria-label={`${visualProgress}% through lesson`}><span style={{ width: `${visualProgress}%` }} /></div>
    <nav className="micro-skill-map place-value-lesson__map" aria-label="Lesson journey">
      {journey.map((id, index) => {
        const currentIndex = journey.indexOf(state.microSkillId)
        const status = index < currentIndex ? 'complete' : index === currentIndex ? 'current' : 'upcoming'
        return <div className={`micro-skill-map__item micro-skill-map__item--${status}`} key={id} aria-current={status === 'current' ? 'step' : undefined}><span>{status === 'complete' ? '✓' : index + 1}</span><small>{placeValueMicroSkillLabels[id]}</small></div>
      })}
    </nav>
    <article className="lesson-state" key={state.id}>
      <div className="lesson-state__copy">
        {state.content.eyebrow && <p className="lesson-state__eyebrow">{state.content.eyebrow}</p>}
        <h3 ref={stateHeadingRef} tabIndex={-1}>{state.content.title || state.content.prompt || 'Lesson activity'}</h3>
        {state.content.body && <p className="lesson-state__body">{state.content.body}</p>}
        {state.content.title && state.content.prompt && <p className="lesson-state__prompt">{state.content.prompt}</p>}
      </div>
      {hint && !engine.feedback && <PlaceValueHint hint={hint} open={openHint === state.id} onOpen={() => { engine.markHintUsed(); setOpenHint(state.id) }} onClose={() => setOpenHint(null)} />}
      <StateVisual
        visual={state.component}
        revealed={isContinue || Boolean(engine.feedback)}
        selected={isOrder
          ? engine.feedback
            ? state.interaction.correctAnswer as string[]
            : engine.selection.length === 0 ? state.interaction.initialOrder : engine.selection
          : engine.selection}
        onVisualSelect={engine.toggleOption}
        onOrderChange={engine.setOrder}
      />
      {!isContinue && !engine.feedback && <div className="lesson-response">
        {state.interaction.type === 'numericInput' ? <div className="numeric-response"><label htmlFor={`response-${state.id}`}>Your answer</label><input id={`response-${state.id}`} inputMode="decimal" value={engine.inputValue} placeholder={state.interaction.placeholder} onChange={(event) => engine.setInputValue(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && canSubmit) engine.submit() }} /></div>
          : usesVisualChoices || isOrder ? null
          : <ChoiceCards options={state.interaction.options ?? []} selected={engine.selection} disabled={Boolean(engine.feedback)} onToggle={engine.toggleOption} />}
        <button className="lesson-primary-action" type="button" disabled={!canSubmit} onClick={engine.submit}>{state.interaction.submitLabel ?? 'Check answer'}</button>
      </div>}
      {engine.feedback && <FeedbackPanel feedback={engine.feedback} correct={engine.feedback.correct} />}
      <div className="lesson-state__actions">
        {engine.canGoBack && !engine.feedback && !engine.completed && <button className="lesson-secondary-action" type="button" onClick={engine.back}>← Back</button>}
        {isContinue && <button className="lesson-primary-action" type="button" onClick={engine.continueLesson}>{engine.completed ? 'Start lesson again' : isFinalState ? 'Finish lesson' : 'Continue'} <span aria-hidden="true">→</span></button>}
        {engine.feedback && <button className="lesson-primary-action" type="button" onClick={engine.continueLesson}>{engine.completed ? 'Start lesson again' : 'Continue'} <span aria-hidden="true">→</span></button>}
      </div>
    </article>
    <footer className="numbers-lesson__footer"><p><strong>Habit:</strong> Keep the decimal point fixed → align matching places → compare from the largest place.</p></footer>
  </section>
}
