'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowIcon, StarIcon } from '../../../ui/icons'
import { modeLink } from '../../../ui/modeTransition'
import { useReadiness } from '../readiness/useReadiness'
import { templates } from './bank'
import { markServed, readServed, readSprints, type SprintRecord } from './record'
import Sprint from './Sprint'
import { buildSprint, SPRINT_SHAPE } from './sprintPlan'
import { rampLabels, RAMPS, type Question } from './types'
import './Practice.css'

/**
 * Practice: past-paper-style questions, written fresh. The Paper Sprint climbs like a real paper, and every
 * part answered right first time counts towards gold (exam-ready) on the exam path.
 */
export default function PracticeHome() {
  const { rows, loaded } = useReadiness()
  const [sprint, setSprint] = useState<Question[] | null>(null)
  const [runs, setRuns] = useState(0)
  const [history, setHistory] = useState<SprintRecord[]>([])
  useEffect(() => { setHistory(readSprints()) }, [sprint])

  const gold = rows.filter(row => row.level === 'examReady').length
  const secure = rows.filter(row => row.level === 'secure').length
  const levels = useMemo(() => Object.fromEntries(rows.map(row => [row.key, row.level])), [rows])

  function start() {
    const questions = buildSprint(templates, levels, readServed())
    markServed(questions.map(question => question.id))
    setRuns(runs + 1)
    setSprint(questions)
  }

  if (sprint) return <Sprint key={runs} questions={sprint} gold={gold} onClose={() => setSprint(null)} onAgain={start} />

  const last = history.at(-1)
  const best = history.reduce<SprintRecord | undefined>((top, run) => !top || run.marks / run.outOf > top.marks / top.outOf ? run : top, undefined)
  const shape = RAMPS.flatMap(ramp => Array.from({ length: SPRINT_SHAPE[ramp] }, () => ramp))

  return <div className="pr-home">
    <header className="pr-home__head">
      <p className="pr-kicker">Exams</p>
      <h1>Past-paper practice</h1>
      <p>Exam-style questions with marks, like the real paper. Every question is new, written in the style of AQA Foundation papers.</p>
    </header>

    <section className="pr-sprint-card" aria-labelledby="pr-sprint-title">
      <div className="pr-sprint-card__top">
        <h2 id="pr-sprint-title">Paper Sprint</h2>
        <span>6 questions · about 15 min</span>
      </div>
      <p>It climbs like a real paper: quick marks first, then a stretch at the end. Get a step wrong and you can still pick up method marks.</p>
      <ol className="pr-ramp" aria-label="How the sprint climbs: 2 warm-ups, 2 work-it-outs, 1 multi-step and 1 stretch">
        {shape.map((ramp, i) => <li key={i} className={`pr-ramp__step pr-ramp__step--${ramp}`}>
          <span className="pr-ramp__bar" style={{ height: `${28 + RAMPS.indexOf(ramp) * 14}px` }} aria-hidden="true" />
          <span className="pr-ramp__q">Q{i + 1}</span>
        </li>)}
      </ol>
      <ul className="pr-ramp-key" aria-hidden="true">
        {RAMPS.map(ramp => <li key={ramp} className={`pr-ramp__step--${ramp}`}><span />{rampLabels[ramp]}</li>)}
      </ul>
      <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={start} disabled={!loaded}>Start a sprint <ArrowIcon size={18} /></button>
    </section>

    <ul className="pr-stats">
      <li><span>Last sprint</span><strong>{last ? `${last.marks}/${last.outOf}` : '–'}</strong></li>
      <li><span>Best</span><strong>{best ? `${best.marks}/${best.outOf}` : '–'}</strong></li>
      <li className="pr-stats__gold"><span><StarIcon size={12} /> Gold skills</span><strong>{gold}<small>/{rows.length}</small></strong></li>
    </ul>

    {secure > 0 && <p className="pr-callout">
      <strong>{secure} secure skill{secure === 1 ? '' : 's'}</strong> can turn gold with Practice: answer at least 2 questions on {secure === 1 ? 'it' : 'each'}, mostly right first time, and keep {secure === 1 ? 'its' : 'their'} revision cards fresh.
    </p>}

    <p className="pr-note">
      Sprints start with skills you have learnt in lessons. Number is ready now; more topics arrive as their lessons do.{' '}
      <a href="/preview/ready" onClick={modeLink('night')}>See your exam path</a>
    </p>
  </div>
}
