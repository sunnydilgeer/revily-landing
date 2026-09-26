'use client'

import { Button } from '../../ui'
import { mathsChapters, mathsLessons, type MathsLessonEntry, type MathsLessonNumber } from './courseRegistry'
import type { LessonProgressMap, LessonProgressSnapshot } from './lessonProgress'
import { GOAL_OPTIONS, saveDailyGoal } from './studyLog'
import type { StudySummary } from './useStudy'
import { Bolt, streakLabel } from './AppShell'
import { rungStatus } from './rungProgress'
import './Curriculum.css'

type Props = {
  progress: LessonProgressMap
  lastLesson: MathsLessonNumber
  study: StudySummary
  onOpenLesson: (lesson: MathsLessonNumber) => void
}

const LATER_CHAPTERS = ['Algebra', 'Ratio and proportion', 'Geometry and measures', 'Probability', 'Statistics']
const WEEKDAY = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

/** Rung status for one lesson (done = finished, current = where the student is now). */
export function rungsFor(entry: MathsLessonEntry, snapshot?: LessonProgressSnapshot) {
  return rungStatus(entry.sections, entry.stateCount, snapshot)
}

export default function Curriculum({ progress, lastLesson, study, onOpenLesson }: Props) {
  const lastEntry = mathsLessons.find(entry => entry.number === lastLesson) ?? mathsLessons[0]
  const nextIncomplete = mathsLessons.find(entry => !progress[entry.lessonId]?.completed)
  const upNext = progress[lastEntry.lessonId] && !progress[lastEntry.lessonId].completed ? lastEntry : nextIncomplete ?? lastEntry
  const upNextSnapshot = progress[upNext.lessonId]
  const upNextRungs = rungsFor(upNext, upNextSnapshot)
  // Continue resumes where the student is; with no position yet, suggest the first unfinished rung.
  const currentRung = upNextRungs.findIndex(rung => rung.current)
  const upNextRungIndex = currentRung >= 0 ? currentRung : Math.max(0, upNextRungs.findIndex(rung => !rung.done))
  const doneLessons = mathsLessons.filter(entry => progress[entry.lessonId]?.completed).length
  const goalPercent = Math.min(100, Math.round(study.minutesToday / study.goal * 100))
  const goalMet = study.minutesToday >= study.goal

  return <div className="cur">
    <header className="cur-head">
      <div>
        <h1>Curriculum</h1>
        <p>GCSE Foundation Maths · climb one rung at a time</p>
      </div>
      <div className="cur-overall" aria-label={`${doneLessons} of ${mathsLessons.length} lessons complete`}>
        <div className="cur-overall__bar" aria-hidden="true"><span style={{ width: `${doneLessons / mathsLessons.length * 100}%` }} /></div>
        <span>{doneLessons} / {mathsLessons.length} lessons</span>
      </div>
    </header>

    <div className="cur-top">
      <section className="cur-next" aria-labelledby="up-next-title">
        <div className="cur-next__copy">
          <span className="cur-kicker cur-kicker--night">{upNextSnapshot ? 'Up next' : 'Start here'}</span>
          <h2 id="up-next-title">{upNext.title}</h2>
          <p>Rung {upNextRungIndex + 1} of {upNextRungs.length} · {upNextRungs[upNextRungIndex]?.title}</p>
          <Button size="lg" className="cur-next__go" onClick={() => onOpenLesson(upNext.number)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l13-8z" fill="currentColor" /></svg>
            {upNextSnapshot ? 'Continue' : 'Start lesson'}
          </Button>
        </div>
        <ol className="cur-next__ladder" aria-hidden="true">
          {upNextRungs.slice(Math.max(0, upNextRungIndex - 1), upNextRungIndex + 3).map(rung => <li key={rung.id} className={rung.done ? 'is-done' : rung.id === upNextRungs[upNextRungIndex]?.id ? 'is-next' : ''}>{rung.title}</li>)}
        </ol>
      </section>

      <section className="cur-today" aria-labelledby="today-title">
        <div className="cur-today__row">
          <h2 id="today-title" className="cur-kicker">Today</h2>
          <span className={`cur-streak${study.streak ? ' is-lit' : ''}`}><Bolt size={16} />{streakLabel(study.streak)}</span>
        </div>
        <p className="cur-today__minutes"><strong>{study.minutesToday}</strong> of {study.goal} min</p>
        <div className="cur-today__bar" role="progressbar" aria-label="Daily goal" aria-valuemin={0} aria-valuemax={study.goal} aria-valuenow={Math.min(study.minutesToday, study.goal)}>
          <span style={{ width: `${Math.max(goalPercent, 3)}%` }} className={goalMet ? 'is-met' : ''} />
        </div>
        <p className="cur-today__note">{goalMet ? 'Goal met. Anything more is a bonus.' : study.minutesToday ? 'Keep going. Rungs flow straight into each other.' : 'Minutes count while a lesson is open and you’re working.'}</p>
        {study.week.length > 0 && <ol className="cur-week" aria-label="Last seven days">
          {study.week.map(day => {
            const [y, m, d] = day.key.split('-').map(Number)
            const letter = WEEKDAY[new Date(y, m - 1, d).getDay()]
            return <li key={day.key} className={day.counted ? 'is-counted' : ''} aria-label={`${day.key}: ${day.counted ? `counted, ${day.minutes} minutes` : 'not counted'}`}><span aria-hidden="true">{letter}</span></li>
          })}
        </ol>}
        <fieldset className="cur-goal">
          <legend>Daily goal</legend>
          <div>{GOAL_OPTIONS.map(minutes => <button key={minutes} type="button" aria-pressed={study.goal === minutes} onClick={() => saveDailyGoal(minutes)}>{minutes} min</button>)}</div>
        </fieldset>
      </section>
    </div>

    {mathsChapters.map((chapter, chapterIndex) => <section className="cur-chapter" key={chapter.id} aria-labelledby={`chapter-${chapter.id}`}>
      <header className="cur-chapter__head">
        <span className="cur-chapter__num" aria-hidden="true">{chapterIndex + 1}</span>
        <div>
          <h2 id={`chapter-${chapter.id}`}>Chapter {chapterIndex + 1} · {chapter.title}</h2>
          <p>{chapter.lessons.length} lessons · {chapter.lessons.reduce((sum, entry) => sum + entry.sections.length, 0)} rungs</p>
        </div>
      </header>
      <ol className="cur-path">
        {chapter.lessons.map(entry => {
          const snapshot = progress[entry.lessonId]
          const rungs = rungsFor(entry, snapshot)
          const doneRungs = rungs.filter(rung => rung.done).length
          const status = snapshot?.completed ? 'done' : entry.lessonId === upNext.lessonId ? 'next' : snapshot ? 'progress' : 'todo'
          return <li className={`cur-lesson is-${status}`} key={entry.lessonId}>
            <span className="cur-lesson__node" aria-hidden="true">{status === 'done' ? '✓' : entry.number}</span>
            <div className="cur-lesson__body">
              <h3>{entry.title}</h3>
              <p>{entry.description}</p>
              <div className="cur-rungs" role="img" aria-label={`${doneRungs} of ${rungs.length} rungs done`}>
                {rungs.map(rung => <span key={rung.id} title={rung.title} className={rung.done ? 'is-done' : rung.current ? 'is-current' : ''} />)}
                <small>{doneRungs} / {rungs.length} rungs</small>
              </div>
            </div>
            <Button variant={status === 'next' ? 'primary' : 'secondary'} onClick={() => onOpenLesson(entry.number)} aria-label={`${status === 'done' ? 'Review' : snapshot ? 'Continue' : 'Start'} ${entry.title}`}>
              {status === 'done' ? 'Review' : snapshot ? 'Continue' : 'Start'}
            </Button>
          </li>
        })}
      </ol>
    </section>)}

    <section className="cur-later" aria-labelledby="later-title">
      <h2 id="later-title">Coming later</h2>
      <ul>
        {LATER_CHAPTERS.map((title, index) => <li key={title}>
          <span className="cur-chapter__num is-locked" aria-hidden="true">{mathsChapters.length + index + 1}</span>
          <span>{title}</span>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-label="Not built yet"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
        </li>)}
      </ul>
    </section>
  </div>
}
