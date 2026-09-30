'use client'

/*
 * Today: minutes against the daily goal (with the goal picker), the streak and the week strip.
 * Hidden for now: the curriculum page is only the table of contents, so nothing renders this card. Kept to reuse elsewhere.
 */
import { GOAL_OPTIONS, saveDailyGoal } from './studyLog'
import type { StudySummary } from './useStudy'
import { Bolt, streakLabel } from './AppShell'

const WEEKDAY = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function TodayCard({ study }: { study: StudySummary }) {
  const goalPercent = Math.min(100, Math.round(study.minutesToday / study.goal * 100))
  const goalMet = study.minutesToday >= study.goal
  const { minutesBySubject } = study
  return <section className="cur-today" aria-labelledby="today-title">
    <div className="cur-today__row">
      <h2 id="today-title" className="cur-kicker">Today</h2>
      <span className={`cur-streak${study.streak ? ' is-lit' : ''}`}><Bolt size={16} />{streakLabel(study.streak)}</span>
    </div>
    <p className="cur-today__minutes"><strong>{study.minutesToday}</strong> of {study.goal} min</p>
    <div className="cur-today__bar" role="progressbar" aria-label="Daily goal" aria-valuemin={0} aria-valuemax={study.goal} aria-valuenow={Math.min(study.minutesToday, study.goal)}>
      <span style={{ width: `${Math.max(goalPercent, 3)}%` }} className={goalMet ? 'is-met' : ''} />
    </div>
    <p className="cur-today__note">{goalMet ? 'Goal met. Anything more is a bonus.' : study.minutesToday ? 'Keep going. Each step flows straight into the next.' : 'Minutes count while a lesson is open and you’re working.'}</p>
    {minutesBySubject.maths > 0 && minutesBySubject.science > 0 && <p className="cur-today__split">Maths {minutesBySubject.maths} min · Science {minutesBySubject.science} min</p>}
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
}
