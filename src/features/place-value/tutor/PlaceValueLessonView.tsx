'use client'

import { useEffect, useRef } from 'react'
import { ExplanationSteps } from '../../number-types/components/ExplanationSteps'
import { useLessonEngine } from '../../number-types/useLessonEngine'
import { InlinePlaceHint } from '../variant-b/PlaceValueHint'
import { PlaceValueTeachingMedia } from './PlaceValueTeachingMedia'
import { tutorPlaceValueLesson as lesson, tutorPlaceValueLabels as labels } from './placeValueLesson'
import '../../number-types/RationalNumbersLesson.css'
import '../variant-b/VariantB.css'
import '../../order-of-operations/variant-c/VariantC.css'
import './PlaceValueLesson.css'

export default function TutorPlaceValueLessonView() {
  const engine = useLessonEngine(lesson)
  const state = lesson.states[engine.stateIndex]
  const { feedback, selection } = engine
  const heading = useRef<HTMLHeadingElement>(null)
  const previousId = useRef(state.id)
  const teaching = state.interaction.type === 'continue'
  const numeric = state.interaction.type === 'numericInput'
  const fraction = state.interaction.acceptanceRule === 'fraction'
  const last = engine.stateIndex === lesson.states.length - 1
  const journey = [...new Set(lesson.states.map(candidate => candidate.microSkillId))]
  useEffect(() => {
    if (previousId.current === state.id) return
    previousId.current = state.id
    heading.current?.focus({ preventScroll: true })
    document.getElementById('lesson-3')?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }, [state.id])
  return <section className="numbers-lesson pvb-lesson pvt-lesson" id="lesson-3" aria-labelledby="pvt-topic">
    <header className="pvb-topic"><h2 id="pvt-topic">{labels[state.microSkillId]}</h2><span>{engine.stateIndex + 1} / {lesson.states.length}</span></header>
    <nav className="lesson-progress-nav" aria-label="Lesson 3 progress">{journey.map(topic => {
      const indexes = lesson.states.flatMap((candidate, i) => candidate.microSkillId === topic ? [i] : [])
      const start = indexes[0], end = indexes.at(-1)!
      const reached = start <= engine.furthestStateIndex
      const progress = engine.completed ? 100 : !reached ? 0 : Math.round(Math.max(0, Math.min(engine.furthestStateIndex, end) - start) / Math.max(1, end - start) * 100)
      const name = labels[topic]
      return <button type="button" key={topic} className={`lesson-progress-segment${state.microSkillId === topic ? ' is-current' : ''}${reached ? ' is-reached' : ' is-locked'}`} disabled={!reached} aria-current={state.microSkillId === topic ? 'step' : undefined} aria-label={reached ? `${name}: ${progress}% reached. Go to this section.` : `${name}: locked until earlier content is complete.`} onClick={() => engine.navigateToReached(lesson.states[start].id)}>
        <span className="lesson-progress-segment__track" aria-hidden="true"><span className="lesson-progress-segment__fill" style={{ width: `${progress}%` }} /></span><small aria-hidden="true">{name}</small>
      </button>
    })}</nav>
    <article className="pvb-activity" key={state.id} data-state-id={state.id} data-source-ref={state.sourceRef}>
      <PlaceValueTeachingMedia state={state} />
      {!teaching && state.hints && <InlinePlaceHint hints={state.hints} onConsult={feedback ? undefined : engine.markHintUsed} />}
      <h3 ref={heading} tabIndex={-1}>{engine.completed ? 'Lesson complete' : state.content.title}</h3>
      {teaching && !state.video && state.content.body && <p className="pvb-body">{state.content.body}</p>}
      {numeric && <form id={`form-${state.id}`} onSubmit={event => { event.preventDefault(); if (!feedback && engine.inputValue.trim()) engine.submit() }}>
        <label className="pvt-answer-label" htmlFor={`answer-${state.id}`}>{fraction ? 'Your fraction' : 'Your answer'}</label>
        <input id={`answer-${state.id}`} className="pvb-input" inputMode={fraction ? 'text' : 'decimal'} type="text" autoComplete="off" spellCheck={false} value={engine.inputValue} disabled={Boolean(feedback)} placeholder={state.interaction.placeholder} onChange={event => engine.setInputValue(event.target.value)} />
      </form>}
      {!teaching && !numeric && <div className="pvb-choices" role="group" aria-label="Choose one answer">{state.interaction.options?.map(option => {
        const selected = selection.includes(option.id), correct = state.interaction.correctAnswer === option.id
        const status = feedback ? correct ? 'correct' : selected ? 'incorrect' : 'neutral' : 'neutral'
        return <button type="button" key={option.id} className={`pvb-choice pvb-choice--${status}`} disabled={Boolean(feedback)} aria-pressed={selected} aria-label={`${option.label}${feedback ? correct ? ', correct answer' : selected ? ', your answer, incorrect' : '' : ''}`} onClick={() => engine.submitSelection([option.id])}><span>{option.label}</span><span aria-hidden="true">{feedback ? correct ? '✓' : selected ? '×' : '' : '→'}</span></button>
      })}</div>}
      {feedback && <div className={`pvb-feedback${feedback.correct ? ' pvb-feedback--correct' : ''}`} role="status"><p className="pvb-result">{feedback.correct ? 'Correct' : 'Here’s the working'}</p>{feedback.workedExplanation && <ExplanationSteps explanation={feedback.workedExplanation} />}</div>}
      <div className="pvb-actions">
        {engine.canGoBack && !engine.completed && <button type="button" className="lesson-secondary-action" onClick={engine.back}>← Back</button>}
        {!feedback && numeric && <button type="submit" form={`form-${state.id}`} className="lesson-primary-action" disabled={!engine.inputValue.trim()}>Check answer</button>}
        {(teaching || feedback) && <button type="button" className="lesson-primary-action" onClick={engine.continueLesson}>{engine.completed ? 'Start lesson again' : last ? 'Finish lesson' : 'Continue'} <span aria-hidden="true">→</span></button>}
      </div>
    </article>
  </section>
}
