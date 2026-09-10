'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChoiceCards } from '../number-types/components/ChoiceCards'
import { FeedbackPanel } from '../number-types/components/FeedbackPanel'
import { StateVisual } from '../number-types/components/StateVisual'
import { useLessonEngine } from '../number-types/useLessonEngine'
import type { MicroSkillId } from '../number-types/types'
import { LongMultiplicationHint, type LongMultiplicationHintDefinition } from './components/LongMultiplicationHint'
import { longMultiplicationLesson, longMultiplicationMicroSkillLabels } from './longMultiplicationLesson'
import '../number-types/RationalNumbersLesson.css'
import './LongMultiplicationLesson.css'

const journey: MicroSkillId[] = ['long-multiplication-layout', 'long-multiplication-ones', 'long-multiplication-tens', 'long-multiplication-carrying', 'long-multiplication-application', 'mixed']

const hints: Record<string, LongMultiplicationHintDefinition> = {
  'L5-Q02': { label: 'Times first', title: 'Multiply, then carry', body: 'Work out 3 × 8 first. Then write 4 and carry 2.', example: '3 × 8 = 24' },
  'L5-Q04': { label: 'Start with zero', title: 'The next row is for 20', body: 'Write 0 on the right before you start the second row.' },
  'L5-C01': { label: 'Add the carry', title: 'Do the times, then add', body: '6 × 4 = 24. Now add the carried 4.', example: '24 + 4 = ?' },
  'L5-Z01': { label: 'Keep the carry', title: 'The carry is still there', body: '2 × 0 = 0. Now add the carried 1.', example: '0 + 1 = ?' },
  'L5-A01': { label: '18 lots of 246', title: 'Lots of means multiply', body: 'There are 18 equal rows, with 246 seats in every row.', example: '246 × 18' },
  'L5-S02': { label: 'Combine both changes', title: 'Multiply the scale factors', body: 'Each factor is 10 times greater, so the product is 10 × 10 = 100 times greater.', example: '9.472 × 100' },
  'L5-I03': { label: 'Make two rows', title: 'Use the same four steps', body: 'First row, zero, second row, add.' },
}

export default function LongMultiplicationLessonView() {
  const engine = useLessonEngine(longMultiplicationLesson)
  const { state } = engine
  const [openHint, setOpenHint] = useState<string | null>(null)
  const [completedVisual, setCompletedVisual] = useState<string | null>(null)
  const coreStates = longMultiplicationLesson.states.filter((candidate) => candidate.phase !== 'repair')
  const stateNumber = coreStates.findIndex((candidate) => candidate.id === state.id) + 1
  const visualProgress = Math.round((stateNumber / coreStates.length) * 100)
  const partNumber = journey.indexOf(state.microSkillId) + 1
  const stateHeadingRef = useRef<HTMLHeadingElement>(null)
  const previousStateRef = useRef(state.id)
  const isContinue = state.interaction.type === 'continue'
  const isFinalState = engine.stateIndex === longMultiplicationLesson.states.length - 1
  const isStepper = state.component.type === 'longMultiplication' && state.component.props.mode === 'stepper'
  const canContinue = !isStepper || completedVisual === state.id
  const canSubmit = state.interaction.type === 'numericInput' ? engine.inputValue.trim().length > 0 : engine.selection.length > 0
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

  return <section className="numbers-lesson long-multiplication-lesson" id="lesson-5" aria-labelledby="long-multiplication-lesson-title">
    <header className="numbers-lesson__header"><div><span className="lesson-kicker">{longMultiplicationLesson.level} · Lesson 5</span><h2 id="long-multiplication-lesson-title">{longMultiplicationLesson.title}</h2></div><div className="lesson-state-count" aria-label={`Part ${partNumber} of ${journey.length}`}><strong>{partNumber}</strong><span>/ {journey.length}</span></div></header>
    <div className="lesson-progress" aria-label={`${visualProgress}% through lesson`}><span style={{ width: `${visualProgress}%` }} /></div>
    <nav className="micro-skill-map long-multiplication-lesson__map" aria-label="Lesson journey">{journey.map((id, index) => {
      const currentIndex = journey.indexOf(state.microSkillId)
      const status = index < currentIndex ? 'complete' : index === currentIndex ? 'current' : 'upcoming'
      return <div className={`micro-skill-map__item micro-skill-map__item--${status}`} key={id} aria-current={status === 'current' ? 'step' : undefined}><span>{status === 'complete' ? '✓' : index + 1}</span><small>{longMultiplicationMicroSkillLabels[id]}</small></div>
    })}</nav>
    <article className="lesson-state" key={state.id}>
      <div className="lesson-state__copy">{state.content.eyebrow && <p className="lesson-state__eyebrow">{state.content.eyebrow}</p>}<h3 ref={stateHeadingRef} tabIndex={-1}>{state.content.title || state.content.prompt || 'Lesson activity'}</h3>{state.content.body && <p className="lesson-state__body">{state.content.body}</p>}{state.content.title && state.content.prompt && <p className="lesson-state__prompt">{state.content.prompt}</p>}</div>
      {hint && !engine.feedback && <LongMultiplicationHint hint={hint} open={openHint === state.id} onOpen={() => { engine.markHintUsed(); setOpenHint(state.id) }} onClose={() => setOpenHint(null)} />}
      <StateVisual visual={state.component} revealed={isContinue || Boolean(engine.feedback)} selected={engine.selection} onVisualSelect={engine.toggleOption} onVisualComplete={onVisualComplete} />
      {!isContinue && !engine.feedback && <div className="lesson-response">{state.interaction.type === 'numericInput' ? <div className="numeric-response"><label htmlFor={`response-${state.id}`}>Your answer</label><input id={`response-${state.id}`} inputMode="decimal" autoComplete="off" value={engine.inputValue} placeholder={state.interaction.placeholder} onChange={(event) => engine.setInputValue(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && canSubmit) engine.submit() }} /></div> : <ChoiceCards options={state.interaction.options ?? []} selected={engine.selection} disabled={Boolean(engine.feedback)} onToggle={engine.toggleOption} />}<button className="lesson-primary-action" type="button" disabled={!canSubmit} onClick={engine.submit}>{state.interaction.submitLabel ?? 'Check answer'}</button></div>}
      {engine.feedback && <FeedbackPanel feedback={engine.feedback} correct={engine.feedback.correct} />}
      <div className="lesson-state__actions">{engine.canGoBack && !engine.feedback && !engine.completed && <button className="lesson-secondary-action" type="button" onClick={engine.back}>← Back</button>}{isContinue && canContinue && <button className="lesson-primary-action" type="button" onClick={engine.continueLesson}>{engine.completed ? 'Start lesson again' : isFinalState ? 'Finish lesson' : 'Continue'} <span aria-hidden="true">→</span></button>}{engine.feedback && <button className="lesson-primary-action" type="button" onClick={engine.continueLesson}>{engine.completed ? 'Start lesson again' : 'Continue'} <span aria-hidden="true">→</span></button>}</div>
    </article>
    <footer className="numbers-lesson__footer"><p><strong>Remember:</strong> first row → write 0 → second row → add.</p></footer>
  </section>
}
