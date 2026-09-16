'use client'

import { useEffect, useRef } from 'react'
import { useLessonEngine } from './useLessonEngine'
import { ChoiceCards } from './components/ChoiceCards'
import { FeedbackPanel } from './components/FeedbackPanel'
import { StateVisual } from './components/StateVisual'
import { LessonVideoActivity } from './components/LessonVideoActivity'
import type { LessonDefinition, MicroSkillId } from './types'
import { VariantDActivity } from './variant-d/VariantDActivity'
import './RationalNumbersLesson.css'

export default function NumberTypesLessonView({
  lesson,
  labels,
  focusMode = false,
}: {
  lesson: LessonDefinition
  labels: Partial<Record<MicroSkillId, string>>
  focusMode?: boolean
}) {
  const engine = useLessonEngine(lesson)
  const { state } = engine
  const journey = [...new Set(lesson.states.map(candidate => candidate.microSkillId))] as MicroSkillId[]
  const partNumber = journey.indexOf(state.microSkillId) + 1
  const progressSections = journey.map((id) => {
    const stateIndexes = lesson.states
      .map((candidate, index) => candidate.microSkillId === id ? index : -1)
      .filter((index) => index >= 0)
    const startIndex = stateIndexes[0]
    const endIndex = stateIndexes.at(-1) ?? startIndex
    const reached = startIndex <= engine.furthestStateIndex
    const completedStates = reached ? Math.min(engine.furthestStateIndex, endIndex) - startIndex + 1 : 0
    const progress = Math.round((completedStates / (endIndex - startIndex + 1)) * 100)
    return { id, startIndex, startId: lesson.states[startIndex].id, reached, progress }
  })
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
          <span className="lesson-kicker">{lesson.level} · Lesson 1</span>
          <h2 id="numbers-lesson-title">{lesson.title}</h2>
        </div>
        <div className="lesson-state-count" aria-label={`Part ${partNumber} of ${journey.length}`}>
          <strong>{partNumber}</strong><span>/ {journey.length}</span>
        </div>
      </header>}

      <nav className="lesson-progress-nav" aria-label="Lesson 1 progress">
        {progressSections.map((section) => {
          const current = section.id === state.microSkillId
          const name = labels[section.id] ?? section.id
          return (
            <button
              type="button"
              className={`lesson-progress-segment${current ? ' is-current' : ''}${section.reached ? ' is-reached' : ' is-locked'}`}
              key={section.id}
              disabled={!section.reached}
              aria-current={current ? 'step' : undefined}
              aria-label={section.reached ? `${name}: ${section.progress}% reached. Go to this section.` : `${name}: locked until earlier content is complete.`}
              onClick={() => engine.navigateToReached(section.startId)}
            >
              <span className="lesson-progress-segment__track" aria-hidden="true">
                <span className="lesson-progress-segment__fill" style={{ width: `${section.progress}%` }} />
              </span>
              <small aria-hidden="true">{name}</small>
            </button>
          )
        })}
      </nav>

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
        {state.component.type === 'lessonVideo' ? <LessonVideoActivity clip={state.component.props} headingRef={stateHeadingRef} canGoBack={engine.canGoBack} onBack={engine.back} onContinue={engine.continueLesson} /> : state.component.type === 'integerValues' ? <VariantDActivity engine={engine} headingRef={stateHeadingRef} /> : <>
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
