'use client'

import { useEffect, useRef } from 'react'
import { microSkillLabels, numberTypesLesson } from './numberTypesLesson'
import { useLessonEngine } from './useLessonEngine'
import { ChoiceCards } from './components/ChoiceCards'
import { FeedbackPanel } from './components/FeedbackPanel'
import { StateVisual } from './components/StateVisual'
import type { LessonDefinition, MicroSkillId } from './types'
import { VariantDActivity } from './variant-d/VariantDActivity'
import './RationalNumbersLesson.css'

const journey: MicroSkillId[] = [
  'whole-values',
  'factors-multiples',
  'primes',
  'squares-cubes',
  'rational-irrational',
  'mixed',
]

export default function NumberTypesLessonView({
  lesson = numberTypesLesson,
  labels = microSkillLabels,
  variantLabel,
  focusMode = false,
}: {
  lesson?: LessonDefinition
  labels?: Partial<Record<MicroSkillId, string>>
  variantLabel?: string
  focusMode?: boolean
}) {
  const engine = useLessonEngine(lesson)
  const { state } = engine
  const coreStates = lesson.states.filter((candidate) => candidate.phase !== 'repair')
  const completedCoreStates = lesson.states
    .slice(0, engine.stateIndex + 1)
    .filter((candidate) => candidate.phase !== 'repair').length
  const stateNumber = state.phase === 'repair' ? Math.max(1, completedCoreStates) : coreStates.findIndex((candidate) => candidate.id === state.id) + 1
  const visualProgress = Math.round((stateNumber / coreStates.length) * 100)
  const partNumber = journey.indexOf(state.microSkillId) + 1
  const stateHeadingRef = useRef<HTMLHeadingElement>(null)
  const previousStateRef = useRef(state.id)
  const isContinue = state.interaction.type === 'continue'
  const canSubmit = state.interaction.type === 'numericInput'
    ? engine.inputValue.trim().length > 0
    : engine.selection.length > 0

  useEffect(() => {
    if (previousStateRef.current === state.id) return
    previousStateRef.current = state.id
    stateHeadingRef.current?.focus({ preventScroll: true })
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    stateHeadingRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' })
  }, [state.id])

  return (
    <section className={`numbers-lesson${focusMode ? ' numbers-lesson--focused' : ''}`} id="lesson" aria-labelledby="numbers-lesson-title">
      {focusMode ? <header className="study-topic"><h2 id="numbers-lesson-title">{labels[state.microSkillId]}</h2></header> : <header className="numbers-lesson__header">
        <div>
          <span className="lesson-kicker">{lesson.level} · Lesson 1{variantLabel ? ` · ${variantLabel}` : ''}</span>
          <h2 id="numbers-lesson-title">{lesson.title}</h2>
        </div>
        <div className="lesson-state-count" aria-label={`Part ${partNumber} of ${journey.length}`}>
          <strong>{partNumber}</strong><span>/ {journey.length}</span>
        </div>
      </header>}

      <div className="lesson-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={visualProgress} aria-label={`${visualProgress}% through lesson`}>
        <span style={{ width: `${visualProgress}%` }} />
      </div>

      {!focusMode && <nav className="micro-skill-map" aria-label="Lesson journey">
        {journey.map((id, index) => {
          const currentIndex = journey.indexOf(state.microSkillId)
          const status = index < currentIndex ? 'complete' : index === currentIndex ? 'current' : 'upcoming'
          return (
            <div className={`micro-skill-map__item micro-skill-map__item--${status}`} key={id} aria-current={status === 'current' ? 'step' : undefined}>
              <span>{status === 'complete' ? '✓' : index + 1}</span>
              <small>{labels[id]}</small>
            </div>
          )
        })}
      </nav>}

      <article className={`lesson-state${state.component.type === 'integerValues' ? ' lesson-state--variant-d' : ''}`} key={state.id}>
        {state.component.type === 'integerValues' ? <VariantDActivity engine={engine} headingRef={stateHeadingRef} /> : <>
        {isContinue && (
          <div className="lesson-state__copy">
            {state.content.eyebrow && <p className="lesson-state__eyebrow">{state.content.eyebrow}</p>}
            <h3 ref={stateHeadingRef} tabIndex={-1}>{state.content.title || state.content.prompt || 'Lesson activity'}</h3>
            {state.content.body && <p className="lesson-state__body">{state.content.body}</p>}
            {state.content.title && state.content.prompt && <p className="lesson-state__prompt">{state.content.prompt}</p>}
          </div>
        )}

        <StateVisual visual={state.component} revealed={isContinue || Boolean(engine.feedback)} />

        {!isContinue && (
          <div className="lesson-state__copy lesson-state__copy--question">
            {state.content.eyebrow && <p className="lesson-state__eyebrow">{state.content.eyebrow}</p>}
            <h3 ref={stateHeadingRef} tabIndex={-1}>{state.content.title || state.content.prompt || 'Lesson activity'}</h3>
            {state.content.body && <p className="lesson-state__body">{state.content.body}</p>}
            {state.content.title && state.content.prompt && <p className="lesson-state__prompt">{state.content.prompt}</p>}
          </div>
        )}

        {!isContinue && !engine.feedback && (
          <div className="lesson-response">
            {state.interaction.type === 'numericInput' ? (
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
            ) : (
              <ChoiceCards
                options={state.interaction.options ?? []}
                selected={engine.selection}
                disabled={Boolean(engine.feedback)}
                onToggle={engine.toggleOption}
              />
            )}
            <button className="lesson-primary-action" type="button" disabled={!canSubmit} onClick={engine.submit}>
              {state.interaction.submitLabel ?? 'Check answer'}
            </button>
          </div>
        )}

        {engine.feedback && <FeedbackPanel feedback={engine.feedback} correct={engine.feedback.correct} />}

        <div className="lesson-state__actions">
          {engine.canGoBack && !engine.feedback && (
            <button className="lesson-secondary-action" type="button" onClick={engine.back}>← Back</button>
          )}
          {isContinue && (
            <button className="lesson-primary-action" type="button" onClick={engine.continueLesson}>Continue <span aria-hidden="true">→</span></button>
          )}
          {engine.feedback && (
            <button className="lesson-primary-action" type="button" onClick={engine.continueLesson}>
              {engine.completed ? 'Start lesson again' : 'Continue'} <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
        </>}
      </article>

      {!focusMode && <footer className="numbers-lesson__footer">
        <p><strong>Habit:</strong> Work out the value → recall the rule → check the evidence.</p>
      </footer>}
    </section>
  )
}
