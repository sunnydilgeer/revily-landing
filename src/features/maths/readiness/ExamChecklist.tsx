'use client'

import { useMemo } from 'react'
import { modeLink } from '../../../ui/modeTransition'
import ExamWorld from './ExamWorld'
import { levelLabels, levelOrder, nextExamSeries, type Level, type SelfRating } from './readiness'
import { useReadiness } from './useReadiness'
import './ExamChecklist.css'

const ratingLabels: Record<SelfRating, string> = { red: 'Not confident', amber: 'Getting there', green: 'Confident' }

/** The exam world, with the full list of "I can…" statements and the student's own ratings in its checklist panel. */
export default function ExamChecklist() {
  const { lessons, rows, ratings, rate, loaded } = useReadiness()
  const series = useMemo(() => nextExamSeries(), [])
  const counts = Object.fromEntries(levelOrder.map(level => [level, rows.filter(row => row.level === level).length])) as Record<Level, number>
  const secureOrBetter = counts.secure + counts.examReady

  const checklist = <>
      <section className="xc xc-area" aria-label="Every statement">
        <p className="xc-tally">{secureOrBetter} of {rows.length} secure or better</p>
        <ul className="xc-summary" aria-label="Your statements by level">
          {[...levelOrder].reverse().map(level => <li key={level} className={`xc-level xc-level--${level}`}><strong>{counts[level]}</strong> {levelLabels[level]}</li>)}
        </ul>
        <details className="xc-key">
          <summary>What the levels mean</summary>
          <dl>
            <dt>Learnt</dt><dd>You finished the section.</dd>
            <dt>Secure</dt><dd>You got at least 80% of its questions right first time.</dd>
            <dt>Exam-ready</dt><dd>Secure, and you still remembered its revision cards days later.</dd>
          </dl>
          <p>Tap the colours to say how confident you feel. If your results say something different, we’ll tell you.</p>
        </details>
        {lessons.map(({ entry, rows }) => rows.length > 0 && <div className="xc-lesson" key={entry.lessonId}>
          <h3>{entry.number}. {entry.title}</h3>
          <ul>
            {rows.map(row => <li key={row.key} className={`xc-row xc-row--${row.level}`}>
              <a className="xc-row__main" href={row.href} onClick={modeLink('paper')}>
                <span className={`xc-level xc-level--${row.level}`}>{levelLabels[row.level]}</span>
                <span className="xc-can">{row.statement}</span>
              </a>
              <div className="xc-rate" role="group" aria-label={`How confident are you: ${row.statement}`}>
                {(['red', 'amber', 'green'] as const).map(rating => <button
                  key={rating}
                  type="button"
                  className={`xc-dot xc-dot--${rating}${ratings[row.key] === rating ? ' is-on' : ''}`}
                  aria-pressed={ratings[row.key] === rating}
                  aria-label={ratingLabels[rating]}
                  title={ratingLabels[rating]}
                  onClick={() => rate(row.key, rating)}
                />)}
              </div>
              {row.note && <p className="xc-note" role="note">{row.note}</p>}
            </li>)}
          </ul>
        </div>)}
      </section>
  </>

  return <ExamWorld rows={rows} loaded={loaded} weeks={series.weeks} year={series.year} checklist={checklist} />
}
