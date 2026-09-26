'use client'

/*
 * The rung frame shared by every lesson screen: rung maths, the header, the rung-complete and
 * lesson-complete cards, and the "Keep going / Take a break" flow. Each lesson view supplies only
 * its own teaching and question content in between.
 */
import { useEffect, useRef, useState, type RefObject } from 'react'
import { Button } from '../../ui'
import type { useLessonEngine } from '../number-types/useLessonEngine'
import type { LessonDefinition, MicroSkillId } from '../number-types/types'
import { RUNG_COMPLETE_EVENT } from './studyLog'
import { markSectionComplete, readMathsProgress } from './lessonProgress'
import { legacyCompleted, sectionsOf } from './rungProgress'
import '../written-methods/tutor/RungLesson.css'

type Engine = ReturnType<typeof useLessonEngine>

/** Engine defaults that say nothing about the question; the hint is more useful in their place. */
export const GENERIC_FEEDBACK = new Set(['Here’s the working.', 'Here’s the answer.', 'Here is the complete working.', 'Correct.', 'Explanation'])

/** The engine words answers as "Correct answer: 2/3."; the check bar only needs "2/3". */
export const answerText = (text: string) => text.replace(/^Correct answer:\s*/i, '').replace(/\.$/, '')

export const PRAISE = ['Nice! That’s right.', 'Correct!', 'Spot on.', 'That’s it.']

export function goToOverview() {
  window.history.pushState({}, '', '/preview')
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export type RungSummary = { title: string; nextTitle: string; questions: number; firstTry: number }

export function useRungFlow(lesson: LessonDefinition, engine: Engine, labels: Partial<Record<MicroSkillId, string>>, anchorId: string) {
  const state = lesson.states[engine.stateIndex]
  const heading = useRef<HTMLHeadingElement>(null)
  const continueButton = useRef<HTMLButtonElement>(null)
  const previousId = useRef(state.id)
  const [rungDone, setRungDone] = useState<RungSummary | null>(null)
  const [leaving, setLeaving] = useState(false)

  const teaching = state.interaction.type === 'continue'
  const last = engine.stateIndex === lesson.states.length - 1
  const rungs = [...new Set(lesson.states.map(candidate => candidate.microSkillId))]
  const rungIndex = rungs.indexOf(state.microSkillId)
  const rungStates = lesson.states.flatMap((candidate, i) => candidate.microSkillId === state.microSkillId ? [i] : [])
  const positionInRung = rungStates.indexOf(engine.stateIndex)
  const lastInRung = positionInRung === rungStates.length - 1
  const rungQuestions = rungStates.filter(i => lesson.states[i].interaction.type !== 'continue')
  const questionNumber = rungQuestions.indexOf(engine.stateIndex) + 1
  const rungProgress = Math.round(((positionInRung + (engine.feedback || teaching ? 1 : 0)) / rungStates.length) * 100)
  const title = labels[state.microSkillId] ?? lesson.title

  useEffect(() => {
    if (previousId.current === state.id) return
    previousId.current = state.id
    heading.current?.focus({ preventScroll: true })
    document.getElementById(anchorId)?.scrollIntoView({ block: 'start', behavior: 'instant' })
    if (leaving) goToOverview()
  }, [state.id, anchorId, leaving])

  useEffect(() => { if (engine.feedback) continueButton.current?.focus({ preventScroll: true }) }, [engine.feedback])

  function next() {
    if (!engine.completed && lastInRung) {
      window.dispatchEvent(new CustomEvent(RUNG_COMPLETE_EVENT))
      markSectionComplete(lesson.id, state.microSkillId, legacyCompleted(sectionsOf(lesson), lesson.states.length, readMathsProgress()[lesson.id]?.furthestStateIndex))
    }
    if (!engine.completed && lastInRung && !last && rungIndex < rungs.length - 1) {
      setRungDone({
        title,
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

  return {
    state, teaching, last, title, heading, continueButton,
    rungs, rungIndex, rungStates, positionInRung, rungQuestions, questionNumber, rungProgress,
    rungDone, next, keepGoing, takeABreak,
  }
}

type Flow = ReturnType<typeof useRungFlow>

export function RungHeader({ flow, lessonTitle, headingId }: { flow: Flow; lessonTitle: string; headingId: string }) {
  const { title, rungIndex, rungs, rungProgress, positionInRung, rungStates } = flow
  return <header className="rung-head">
    <div className="rung-head__meta">
      <span className="rung-head__kicker">{lessonTitle} · Rung {rungIndex + 1} of {rungs.length}</span>
      <h2 id={headingId}>{title}</h2>
    </div>
    <div className="rung-head__progress">
      <div className="rung-head__bar" role="progressbar" aria-label={`Progress through ${title}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={rungProgress}>
        <span style={{ width: `${Math.max(4, rungProgress)}%` }} />
      </div>
      <span className="rung-head__count" aria-hidden="true">{Math.min(positionInRung + 1, rungStates.length)} / {rungStates.length}</span>
    </div>
  </header>
}

const Tick = () => <div className="rung-done__badge" aria-hidden="true"><svg viewBox="0 0 24 24" width="40" height="40"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>

export function RungDoneCard({ flow }: { flow: Flow }) {
  const done = flow.rungDone!
  return <div className="rung-done rv-paper" role="status">
    <Tick />
    <p className="rung-done__kicker">Rung {flow.rungIndex + 1} of {flow.rungs.length} complete</p>
    <h3 id="rung-done-title" ref={flow.heading as RefObject<HTMLHeadingElement>} tabIndex={-1}>{done.title}</h3>
    {done.questions > 0 && <p className="rung-done__score"><strong>{done.firstTry} of {done.questions}</strong> right first time</p>}
    <p className="rung-done__next">Next rung: <strong>{done.nextTitle}</strong></p>
    <div className="rung-done__actions">
      <Button size="lg" onClick={flow.keepGoing} autoFocus>Keep going</Button>
      <Button variant="secondary" size="lg" onClick={flow.takeABreak}>Take a break</Button>
    </div>
    <p className="rung-done__saved">Your progress is saved on this device.</p>
  </div>
}

export function LessonDoneCard({ flow, lessonTitle, onRestart }: { flow: Flow; lessonTitle: string; onRestart: () => void }) {
  return <div className="rung-done rv-paper" role="status">
    <Tick />
    <p className="rung-done__kicker">All {flow.rungs.length} rungs climbed</p>
    <h3 id="lesson-done-title" ref={flow.heading as RefObject<HTMLHeadingElement>} tabIndex={-1}>Lesson complete: {lessonTitle}</h3>
    <div className="rung-done__actions">
      <Button size="lg" onClick={goToOverview}>Back to lessons</Button>
      <Button variant="secondary" size="lg" onClick={onRestart}>Start again</Button>
    </div>
  </div>
}
