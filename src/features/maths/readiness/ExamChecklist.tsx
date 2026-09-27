'use client'

import { useEffect, useMemo, useState } from 'react'
import { buildDecks } from '../../cards/decks'
import { CARDS_EVENT, CARDS_KEY, readCardStates, type CardStates } from '../../cards/schedule'
import { mathsLessons } from '../courseRegistry'
import { MATHS_PROGRESS_EVENT, readMathsProgress, type LessonProgressMap } from '../lessonProgress'
import { rungStatus } from '../rungProgress'
import { canStatements } from './statements'
import PaperMap from './PaperMap'
import { evidenceFor, levelFor, levelLabels, levelOrder, mismatch, nextExamSeries, type Level, type SelfRating } from './readiness'
import './ExamChecklist.css'

const RATINGS_KEY = 'revily:maths-self-rating:v1'
const ratingLabels: Record<SelfRating, string> = { red: 'Not confident', amber: 'Getting there', green: 'Confident' }

function readRatings(): Record<string, SelfRating> {
  try { return JSON.parse(window.localStorage.getItem(RATINGS_KEY) ?? '{}') ?? {} } catch { return {} }
}

/** The exam map (the paper as tiles sized by marks), then every "I can…" statement with its level and the student's own rating. */
export default function ExamChecklist() {
  const [progress, setProgress] = useState<LessonProgressMap>({})
  const [cards, setCards] = useState<CardStates>({})
  const [ratings, setRatings] = useState<Record<string, SelfRating>>({})
  const series = useMemo(() => nextExamSeries(), [])

  useEffect(() => {
    const refresh = () => { setProgress(readMathsProgress()); setCards(readCardStates(CARDS_KEY)); setRatings(readRatings()) }
    refresh()
    for (const event of [MATHS_PROGRESS_EVENT, CARDS_EVENT, 'storage']) window.addEventListener(event, refresh)
    return () => { for (const event of [MATHS_PROGRESS_EVENT, CARDS_EVENT, 'storage']) window.removeEventListener(event, refresh) }
  }, [])

  function rate(key: string, rating: SelfRating) {
    const next = { ...ratings }
    if (next[key] === rating) delete next[key]; else next[key] = rating
    setRatings(next)
    try { window.localStorage.setItem(RATINGS_KEY, JSON.stringify(next)) } catch { /* storage blocked: this visit only */ }
  }

  const cardIds = useMemo(() => {
    const ids = new Map<string, string[]>()
    for (const deck of buildDecks(mathsLessons)) for (const card of deck.cards) {
      const key = `${card.lesson}:${card.rung}`
      ids.set(key, [...(ids.get(key) ?? []), card.id])
    }
    return ids
  }, [])

  const lessons = mathsLessons.map(entry => {
    const snapshot = progress[entry.lessonId]
    const status = rungStatus(entry.sections, entry.stateCount, snapshot)
    const rows = status.flatMap(section => {
      const key = `${entry.number}:${section.id}`, statement = canStatements[key]
      if (!statement) return []
      const evidence = evidenceFor(section, snapshot, cardIds.get(key) ?? [], cards)
      const level = levelFor(evidence)
      const href = `/preview?lesson=${entry.number}&section=${encodeURIComponent(section.id)}`
      return [{ key, statement, level, href, note: mismatch(ratings[key], level, evidence.score) }]
    })
    return { entry, rows }
  })
  const rows = lessons.flatMap(lesson => lesson.rows)
  const counts = Object.fromEntries(levelOrder.map(level => [level, rows.filter(row => row.level === level).length])) as Record<Level, number>
  const secureOrBetter = counts.secure + counts.examReady

  return <main className="xc">
    <a className="xc-back" href="/preview">← Curriculum</a>
    <header className="xc-head">
      <p className="xc-kicker">GCSE Maths · Foundation</p>
      <h1>Your exam map</h1>
      <p className="xc-countdown">Exams start in about <strong>{series.weeks} weeks</strong> · May/June {series.year} series</p>
    </header>

    <PaperMap rows={rows} />

    <p className="xc-honest">Tiles are sized by the marks each topic has been worth in the last 30 Foundation papers. Marks are a rough guide, not a prediction.</p>

    <section className="xc-area" aria-labelledby="xc-all">
      <h2 id="xc-all">Every statement <span>{secureOrBetter} of {rows.length} secure or better</span></h2>
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
            <a className="xc-row__main" href={row.href}>
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
  </main>
}
