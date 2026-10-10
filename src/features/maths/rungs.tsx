'use client'

/*
 * The rung frame shared by every lesson screen: rung maths, the header, the rung-complete and
 * lesson-complete cards, and the "Keep going / Take a break" flow. Each lesson view supplies only
 * its own teaching and question content in between.
 */
import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '../../ui'
import { ArrowIcon, TopicIcon } from '../../ui/icons'
import { modeLink } from '../../ui/modeTransition'
import type { useLessonEngine } from '../number-types/useLessonEngine'
import type { LessonDefinition, MicroSkillId } from '../number-types/types'
import { withOrderedOptions } from './optionOrder'
import { RUNG_COMPLETE_EVENT } from './studyLog'
import { markSectionComplete, readMathsProgress } from './lessonProgress'
import { legacyCompleted, sectionsOf } from './rungProgress'
import { mathsLessons } from './courseRegistry'
import { topicForLesson } from './readiness/paperTopics'
import { StepDriverContext, type StepDriver } from './step-chain/stepDriver'
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
  const state = withOrderedOptions(lesson, lesson.states[engine.stateIndex])
  const heading = useRef<HTMLHeadingElement>(null)
  const continueButton = useRef<HTMLButtonElement>(null)
  const previousId = useRef(state.id)
  const [rungDone, setRungDone] = useState<RungSummary | null>(null)
  const [leaving, setLeaving] = useState(false)
  // A worked example on this teaching screen that still has steps to show (see stepDriver.ts).
  const [driver, setDriver] = useState<StepDriver | null>(null)

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
    const score = { questions: rungQuestions.length, firstTry: rungQuestions.filter(i => engine.attempts[lesson.states[i].id]?.correctFirstTry).length }
    if (!engine.completed && lastInRung) {
      window.dispatchEvent(new CustomEvent(RUNG_COMPLETE_EVENT))
      // Attempts are only known for this sitting, so the saved score counts the questions answered in it:
      // a section finished across a reload isn't marked down for answers given before the reload.
      const answered = rungQuestions.filter(i => engine.attempts[lesson.states[i].id])
      const saved = rungQuestions.length === 0 ? { questions: 0, firstTry: 0 }
        : answered.length ? { questions: answered.length, firstTry: answered.filter(i => engine.attempts[lesson.states[i].id]?.correctFirstTry).length }
        : undefined
      markSectionComplete(lesson.id, state.microSkillId, legacyCompleted(sectionsOf(lesson), lesson.states.length, readMathsProgress()[lesson.id]?.furthestStateIndex), saved)
    }
    if (!engine.completed && lastInRung && !last && rungIndex < rungs.length - 1) {
      setRungDone({
        title,
        nextTitle: labels[rungs[rungIndex + 1]] ?? 'the next rung',
        ...score,
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

  // The bottom bar's one button on a teaching screen: the worked example's next step first, then Continue.
  const stepping = teaching && driver
  const advance = stepping ? driver.next : next
  const advanceLabel = stepping ? driver.label : last ? 'Finish lesson' : 'Continue'

  const lessonNumber = mathsLessons.find(entry => entry.lessonId === lesson.id)?.number
  const topic = lessonNumber ? topicForLesson(lessonNumber) : undefined

  return {
    state, teaching, last, title, heading, continueButton, topic,
    rungs, rungIndex, rungStates, positionInRung, rungQuestions, questionNumber, rungProgress,
    rungDone, next, keepGoing, takeABreak,
    setDriver, advance, advanceLabel,
  }
}

type Flow = ReturnType<typeof useRungFlow>

/** Lets a teaching screen's worked example drive the bottom bar's button. Questions keep their chains' own buttons. */
export function DriveSteps({ flow, children }: { flow: Flow; children: ReactNode }) {
  return <StepDriverContext.Provider value={flow.teaching ? flow.setDriver : null}>{children}</StepDriverContext.Provider>
}

/**
 * The lesson page's top bar (close, section and progress, Contents). A page that has one provides its slot, and the
 * rung header draws into it; undefined means no bar, and the header sits above the card as before.
 */
export const LessonBarSlot = createContext<HTMLElement | null | undefined>(undefined)

export function RungHeader({ flow, lessonTitle, headingId }: { flow: Flow; lessonTitle: string; headingId: string }) {
  const { title, rungIndex, rungs, rungProgress } = flow
  const slot = useContext(LessonBarSlot)
  const head = <header className="rung-head">
    <div className="rung-head__title">
      {flow.topic && <span className="rung-head__topic" aria-hidden="true"><TopicIcon id={flow.topic.id} size={22} /></span>}
      <div className="rung-head__names">
        {slot !== undefined && <small className="rung-head__lesson">{lessonTitle}</small>}
        <h2 id={headingId}>{title}</h2>
      </div>
    </div>
    <div className="rung-head__progress">
      <div className="rung-head__bar" role="progressbar" aria-label={`${lessonTitle}, rung ${rungIndex + 1} of ${rungs.length}: progress through ${title}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={rungProgress}>
        <span style={{ width: `${Math.max(4, rungProgress)}%` }} />
      </div>
    </div>
  </header>
  if (slot === undefined) return head
  return slot ? createPortal(head, slot) : null
}

/** A slice of the exam path inside the paper card: where this section's progress shows up. */
function PathLink({ flow }: { flow: Flow }) {
  if (!flow.topic) return null
  return <a className="rung-path" href={`/preview/ready?from=${flow.topic.id}`} onClick={modeLink('night')}>
    <span className="rung-path__node" aria-hidden="true"><TopicIcon id={flow.topic.id} size={22} /></span>
    <span className="rung-path__text"><small>Your exam path</small>See {flow.topic.title} light up</span>
    <ArrowIcon size={18} className="rung-path__go" />
  </a>
}

const Tick = () => <div className="rung-done__badge" aria-hidden="true"><svg viewBox="0 0 24 24" width="40" height="40"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>

export function RungDoneCard({ flow }: { flow: Flow }) {
  const done = flow.rungDone!
  return <div className="rung-done rv-paper" role="status">
    <Tick />
    <p className="rung-done__kicker">{flow.rungIndex + 1} of {flow.rungs.length} done</p>
    <h3 id="rung-done-title" ref={flow.heading as RefObject<HTMLHeadingElement>} tabIndex={-1}>{done.title}</h3>
    {done.questions > 0 && <p className="rung-done__score"><strong>{done.firstTry} of {done.questions}</strong> right first time</p>}
    <p className="rung-done__next">Next: <strong>{done.nextTitle}</strong></p>
    <div className="rung-done__actions">
      <Button size="lg" onClick={flow.keepGoing} autoFocus>Keep going</Button>
      <Button variant="secondary" size="lg" onClick={flow.takeABreak}>Take a break</Button>
    </div>
    <PathLink flow={flow} />
    <p className="rung-done__saved">Your progress is saved on this device.</p>
  </div>
}

export function LessonDoneCard({ flow, lessonTitle, onRestart }: { flow: Flow; lessonTitle: string; onRestart: () => void }) {
  return <div className="rung-done rv-paper" role="status">
    <Tick />
    <h3 id="lesson-done-title" ref={flow.heading as RefObject<HTMLHeadingElement>} tabIndex={-1}>Lesson complete: {lessonTitle}</h3>
    <div className="rung-done__actions">
      <Button size="lg" onClick={goToOverview}>Back to lessons</Button>
      <Button variant="secondary" size="lg" onClick={onRestart}>Start again</Button>
    </div>
    <PathLink flow={flow} />
  </div>
}
