'use client'

import { useEffect, useRef, useState } from 'react'
import { FeedbackPanel } from '../number-types/components/FeedbackPanel'
import { StateVisual } from '../number-types/components/StateVisual'
import { useLessonEngine } from '../number-types/useLessonEngine'
import type { MicroSkillId } from '../number-types/types'
import { orderOfOperationsLesson, orderOfOperationsMicroSkillLabels } from './orderOfOperationsLesson'
import '../number-types/RationalNumbersLesson.css'
import './OrderOfOperationsLesson.css'
import './prototype/BidmasSpotlightPrototype.css'

const journey: MicroSkillId[] = [
  'operation-priority',
  'brackets-indices',
  'equal-priority',
  'fraction-grouping',
  'mixed',
]

export default function OrderOfOperationsLessonView() {
  const engine = useLessonEngine(orderOfOperationsLesson)
  const { state } = engine
  const coreStates = orderOfOperationsLesson.states.filter((candidate) => candidate.phase !== 'repair')
  const stateNumber = coreStates.findIndex((candidate) => candidate.id === state.id) + 1
  const visualProgress = Math.round((stateNumber / coreStates.length) * 100)
  const partNumber = journey.indexOf(state.microSkillId) + 1
  const stateHeadingRef = useRef<HTMLHeadingElement>(null)
  const previousStateRef = useRef(state.id)
  const [visualComplete, setVisualComplete] = useState(false)
  const isContinue = state.interaction.type === 'continue'
  const isFinalState = engine.stateIndex === orderOfOperationsLesson.states.length - 1
  const requiresVisualCompletion = state.component.type === 'operationSpotlight' || state.component.type === 'nextOperation'
  const canSubmit = state.interaction.type === 'numericInput' && engine.inputValue.trim().length > 0

  useEffect(() => {
    if (previousStateRef.current === state.id) return
    previousStateRef.current = state.id
    setVisualComplete(false)
    stateHeadingRef.current?.focus({ preventScroll: true })
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    stateHeadingRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' })
  }, [state.id])

  return (
    <section className="numbers-lesson operations-lesson" id="lesson-2" aria-labelledby="operations-lesson-title">
      <header className="numbers-lesson__header">
        <div>
          <span className="lesson-kicker">{orderOfOperationsLesson.level} · Lesson 2</span>
          <h2 id="operations-lesson-title">{orderOfOperationsLesson.title}</h2>
        </div>
        <div className="lesson-state-count" aria-label={`Part ${partNumber} of ${journey.length}`}>
          <strong>{partNumber}</strong><span>/ {journey.length}</span>
        </div>
      </header>

      <div className="lesson-progress" aria-label={`${visualProgress}% through lesson`}>
        <span style={{ width: `${visualProgress}%` }} />
      </div>

      <nav className="micro-skill-map operations-lesson__map" aria-label="Lesson journey">
        {journey.map((id, index) => {
          const currentIndex = journey.indexOf(state.microSkillId)
          const status = index < currentIndex ? 'complete' : index === currentIndex ? 'current' : 'upcoming'
          return (
            <div className={`micro-skill-map__item micro-skill-map__item--${status}`} key={id} aria-current={status === 'current' ? 'step' : undefined}>
              <span>{status === 'complete' ? '✓' : index + 1}</span>
              <small>{orderOfOperationsMicroSkillLabels[id]}</small>
            </div>
          )
        })}
      </nav>

      <article className="lesson-state" key={state.id}>
        <div className="lesson-state__copy">
          {state.content.eyebrow && <p className="lesson-state__eyebrow">{state.content.eyebrow}</p>}
          <h3 ref={stateHeadingRef} tabIndex={-1}>{state.content.title || state.content.prompt || 'Lesson activity'}</h3>
          {state.content.body && <p className="lesson-state__body">{state.content.body}</p>}
          {state.content.title && state.content.prompt && <p className="lesson-state__prompt">{state.content.prompt}</p>}
        </div>

        <StateVisual
          visual={state.component}
          revealed={isContinue || Boolean(engine.feedback)}
          selected={engine.selection}
          onVisualSelect={engine.toggleOption}
          onVisualComplete={() => setVisualComplete(true)}
        />

        {!isContinue && !engine.feedback && (
          <div className="lesson-response">
            {state.interaction.type === 'numericInput' && (
              <div className="numeric-response">
                <label htmlFor={`response-${state.id}`}>Your answer</label>
                <input
                  id={`response-${state.id}`}
                  inputMode="decimal"
                  value={engine.inputValue}
                  placeholder={state.interaction.placeholder}
                  onChange={(event) => engine.setInputValue(event.target.value)}
                  onKeyDown={(event) => { if (event.key === 'Enter' && canSubmit) engine.submit() }}
                />
              </div>
            )}
            <button className="lesson-primary-action" type="button" disabled={!canSubmit} onClick={engine.submit}>
              {state.interaction.submitLabel ?? 'Check answer'}
            </button>
          </div>
        )}

        {engine.feedback && <FeedbackPanel feedback={engine.feedback} correct={engine.feedback.correct} />}

        <div className="lesson-state__actions">
          {engine.canGoBack && !engine.feedback && !engine.completed && (
            <button className="lesson-secondary-action" type="button" onClick={engine.back}>← Back</button>
          )}
          {isContinue && (
            <button
              className="lesson-primary-action"
              type="button"
              disabled={requiresVisualCompletion && !visualComplete}
              onClick={engine.continueLesson}
            >
              {engine.completed ? 'Start lesson again' : isFinalState ? 'Finish lesson' : 'Continue'} <span aria-hidden="true">→</span>
            </button>
          )}
          {engine.feedback && (
            <button className="lesson-primary-action" type="button" onClick={engine.continueLesson}>
              {engine.completed ? 'Start lesson again' : 'Continue'} <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </article>

      <footer className="numbers-lesson__footer">
        <p><strong>Habit:</strong> Read the structure → resolve one legal operation → check what remains.</p>
      </footer>
    </section>
  )
}
