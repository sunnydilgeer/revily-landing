'use client'

import { useEffect, useRef, useState } from 'react'
import { ExplanationSteps } from '../../number-types/components/ExplanationSteps'
import { useLessonEngine } from '../../number-types/useLessonEngine'
import { InlinePlaceHint } from './PlaceValueHint'
import { PlaceValueVisual } from './PlaceValueVisuals'
import { placeValueVariantBLesson, placeValueVariantBLabels } from './variantBLesson'
import '../../number-types/RationalNumbersLesson.css'
import './VariantB.css'

function OrderResponse({ order, disabled, onChange }: { order: string[]; disabled: boolean; onChange: (values: string[]) => void }) {
  const [announcement, setAnnouncement] = useState('')
  function move(from: number, to: number) {
    if (disabled || to < 0 || to >= order.length) return
    const next = [...order]
    const [value] = next.splice(from, 1)
    next.splice(to, 0, value)
    onChange(next)
    setAnnouncement(`${value} is now in position ${to + 1} of ${order.length}.`)
  }
  return <><ol className="pvb-order" aria-label={disabled ? 'Your submitted order' : 'Numbers in your current order'}>{order.map((value, i) => <li key={value}>
    <span className="pvb-order__position" aria-hidden="true">{i + 1}</span><strong>{value}</strong>
    <div><button type="button" aria-label={`Move ${value} up`} disabled={disabled || i === 0} onClick={() => move(i, i - 1)}>↑</button><button type="button" aria-label={`Move ${value} down`} disabled={disabled || i === order.length - 1} onClick={() => move(i, i + 1)}>↓</button></div>
  </li>)}</ol><p className="sr-only" aria-live="polite">{announcement}</p></>
}

export default function PlaceValueVariantBLessonView() {
  const engine = useLessonEngine(placeValueVariantBLesson)
  const state = placeValueVariantBLesson.states[engine.stateIndex]
  const { feedback, selection } = engine
  const heading = useRef<HTMLHeadingElement>(null)
  const previousId = useRef(state.id)
  const teaching = state.interaction.type === 'continue'
  const numeric = state.interaction.type === 'numericInput'
  const multiple = state.interaction.type === 'multiSelect'
  const ordering = state.interaction.type === 'order'
  const accepted = Array.isArray(state.interaction.correctAnswer) ? state.interaction.correctAnswer : [state.interaction.correctAnswer]
  const options = state.interaction.options ?? []
  const shortChoices = options.every(option => option.label.length < 16)
  const signs = options.length === 3 && options.every(option => /^[<=>]$/.test(option.label))
  const canSubmit = numeric ? Boolean(engine.inputValue.trim()) : ordering || selection.length > 0
  const last = engine.stateIndex === placeValueVariantBLesson.states.length - 1
  const progress = Math.round(engine.stateIndex / (placeValueVariantBLesson.states.length - 1) * 100)
  useEffect(() => {
    if (previousId.current === state.id) return
    previousId.current = state.id
    heading.current?.focus({ preventScroll: true })
    document.getElementById('lesson-3-b')?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }, [state.id])
  return <section className="numbers-lesson pvb-lesson" id="lesson-3-b" aria-labelledby="pvb-topic">
    <header className="pvb-topic"><h2 id="pvb-topic">{placeValueVariantBLabels[state.microSkillId]}</h2><span>{engine.stateIndex + 1} / {placeValueVariantBLesson.states.length}</span></header>
    <div className="lesson-progress" role="progressbar" aria-label="Lesson progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div>
    <article className="pvb-activity" key={state.id} data-state-id={state.id}>
      <figure className="pvb-stage">
        <PlaceValueVisual visual={state.visual} />
        {!teaching && state.hints && <InlinePlaceHint hints={state.hints} onConsult={feedback ? undefined : engine.markHintUsed} />}
      </figure>
      <h3 ref={heading} tabIndex={-1}>{engine.completed ? 'Lesson complete' : state.content.title}</h3>
      {teaching && state.content.body && <p className="pvb-body">{state.content.body}</p>}
      {numeric && <form id={`form-${state.id}`} onSubmit={event => { event.preventDefault(); if (!feedback && canSubmit) engine.submit() }}>
        <label className="sr-only" htmlFor={`answer-${state.id}`}>Your answer</label><input id={`answer-${state.id}`} className="pvb-input" inputMode="decimal" type="text" autoComplete="off" value={engine.inputValue} disabled={Boolean(feedback)} placeholder="Your answer" onChange={event => engine.setInputValue(event.target.value)} />
      </form>}
      {ordering && <OrderResponse order={selection.length ? selection : state.interaction.initialOrder ?? []} disabled={Boolean(feedback)} onChange={engine.setOrder} />}
      {!teaching && !numeric && !ordering && <div className={`pvb-choices${signs ? ' pvb-choices--signs' : shortChoices ? ' pvb-choices--short' : ''}`} role="group" aria-label={multiple ? 'Select all that apply' : 'Choose one answer'}>{options.map(option => {
        const selected = selection.includes(option.id), correct = accepted.includes(option.id)
        const status = feedback ? correct ? 'correct' : selected ? 'incorrect' : 'neutral' : selected ? 'selected' : 'neutral'
        const label = signs ? `${option.label === '<' ? 'Less than' : option.label === '>' ? 'Greater than' : 'Equal to'} (${option.label})` : option.label
        return <button type="button" key={option.id} className={`pvb-choice pvb-choice--${status}`} disabled={Boolean(feedback)} aria-pressed={selected} aria-label={`${label}${feedback ? correct ? ', correct answer' : selected ? ', your answer, incorrect' : '' : ''}`} onClick={() => multiple ? engine.toggleOption(option.id) : engine.submitSelection([option.id])}>
          <span>{option.label}</span><span className="pvb-choice__mark" aria-hidden="true">{feedback ? correct ? '✓' : selected ? '×' : '' : multiple ? selected ? '✓' : '+' : signs ? '' : '→'}</span>
        </button>
      })}</div>}
      {feedback && <div className={`pvb-feedback${feedback.correct ? ' pvb-feedback--correct' : ''}`} role="status"><p className="pvb-result">{feedback.correct ? 'Correct' : 'Here’s the working'}</p>{feedback.workedExplanation && <ExplanationSteps explanation={feedback.workedExplanation} />}</div>}
      <div className="pvb-actions">
        {engine.canGoBack && !feedback && !engine.completed && <button type="button" className="lesson-secondary-action" onClick={engine.back}>← Back</button>}
        {!feedback && (numeric || multiple || ordering) && <button type={numeric ? 'submit' : 'button'} form={numeric ? `form-${state.id}` : undefined} className="lesson-primary-action" disabled={!canSubmit} onClick={numeric ? undefined : engine.submit}>Check answer</button>}
        {(teaching || feedback) && <button type="button" className="lesson-primary-action" onClick={engine.continueLesson}>{engine.completed ? 'Start lesson again' : last ? 'Finish lesson' : 'Continue'} <span aria-hidden="true">→</span></button>}
      </div>
    </article>
  </section>
}
