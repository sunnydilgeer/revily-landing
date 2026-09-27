'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowIcon, CloseIcon } from '../../../ui/icons'
import { modeLink } from '../../../ui/modeTransition'
import { paperTopics } from '../readiness/paperMap'
import PartView from './PartView'
import { MathText } from './MathText'
import { saveSprint } from './record'
import { rampLabels, styleLabels, questionMarks, RAMPS, type Question } from './types'
import { VennDiagram } from './VennDiagram'

const letters = 'abcdefgh'
const plural = (n: number) => `${n} mark${n === 1 ? '' : 's'}`

/** A Paper Sprint in progress: one question at a time, parts revealed in turn, then the results. */
export default function Sprint({ questions, gold, onClose, onAgain }: {
  questions: Question[]
  /** Skills at exam-ready (gold) right now, live from the exam path. */
  gold: number
  onClose: () => void
  onAgain: () => void
}) {
  const [index, setIndex] = useState(0)
  const [partIndex, setPartIndex] = useState(0)
  const [earned, setEarned] = useState<number[][]>(() => questions.map(() => []))
  const [finished, setFinished] = useState(false)
  const [goldAtStart] = useState(gold)
  const top = useRef<HTMLDivElement>(null)
  const question = questions[index]
  const outOf = questions.reduce((sum, q) => sum + questionMarks(q), 0)
  const total = earned.flat().reduce((sum, n) => sum + n, 0)
  const questionDone = earned[index].length === question.parts.length

  useEffect(() => { top.current?.scrollIntoView({ block: 'start' }) }, [index, finished])

  function partDone(points: number) {
    setEarned(all => all.map((list, i) => i === index ? [...list, points] : list))
  }

  function next() {
    if (index + 1 < questions.length) { setIndex(index + 1); setPartIndex(0); return }
    saveSprint(total, outOf)
    setFinished(true)
  }

  if (finished) {
    const share = total / outOf
    const byRamp = RAMPS.map(ramp => {
      const onRamp = questions.map((q, i) => ({ q, i })).filter(({ q }) => q.ramp === ramp)
      return { ramp, got: onRamp.reduce((sum, { i }) => sum + earned[i].reduce((a, b) => a + b, 0), 0), of: onRamp.reduce((sum, { q }) => sum + questionMarks(q), 0) }
    })
    const newGold = Math.max(0, gold - goldAtStart)
    return <div className="pr-sprint pr-results" ref={top}>
      <p className="pr-kicker">Paper Sprint done</p>
      <p className="pr-score"><strong>{total}</strong><span>/{outOf} marks</span></p>
      <p className="pr-results__line">{share >= 0.8 ? 'Top work. That’s exam-ready form.' : share >= 0.5 ? 'Over half the marks. Grade 4 has needed about half in recent papers.' : 'Every mark here is one you can win in May. Check the working below.'}</p>
      {newGold > 0 && <p className="pr-gold" role="status">★ {newGold} skill{newGold === 1 ? '' : 's'} turned gold on your exam path.</p>}
      <ul className="pr-ramp-results">
        {byRamp.filter(r => r.of > 0).map(r => <li key={r.ramp}><span>{rampLabels[r.ramp]}</span><strong>{r.got}/{r.of}</strong></li>)}
      </ul>
      <ol className="pr-summary">
        {questions.map((q, i) => {
          const got = earned[i].reduce((a, b) => a + b, 0), of = questionMarks(q)
          return <li key={q.id} className={got === of ? 'is-full' : got === 0 ? 'is-none' : ''}>
            <span className="pr-summary__q">Q{i + 1}</span>
            <span className="pr-summary__stem">{paperTopics.find(topic => topic.id === q.topic)?.title} · {rampLabels[q.ramp]}</span>
            <span className="pr-summary__marks">{got}/{of}</span>
          </li>
        })}
      </ol>
      <p className="pr-note">Right-first-time answers count towards gold on your exam path.</p>
      <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={onAgain}>Another sprint <ArrowIcon size={18} /></button>
      <a className="pr-link pr-link--center" href="/preview/ready" onClick={modeLink('night')}>See your exam path</a>
      <button type="button" className="pr-link pr-link--center" onClick={onClose}>Back to Practice</button>
    </div>
  }

  return <div className="pr-sprint" ref={top}>
    <div className="pr-bar">
      <button type="button" className="pr-close" aria-label="Leave the sprint (answers so far are saved)" onClick={onClose}><CloseIcon size={18} /></button>
      <div className="pr-progress" role="img" aria-label={`Question ${index + 1} of ${questions.length}`}>
        {questions.map((q, i) => <span key={q.id} className={i < index || (i === index && questionDone) ? 'is-done' : i === index ? 'is-now' : ''} />)}
      </div>
      <span className="pr-tally" aria-label={`${total} marks so far`}>{total}<small>/{outOf}</small></span>
    </div>

    <article className="pr-question" aria-labelledby="pr-q-title" data-template={question.id} data-variant={question.variant}>
      <header className="pr-question__head">
        <h2 id="pr-q-title">Question {index + 1}</h2>
        <span className={`pr-chip pr-chip--${question.ramp}`}>{rampLabels[question.ramp]}</span>
        {styleLabels[question.style] && <span className="pr-chip pr-chip--style">{styleLabels[question.style]}</span>}
        <span className="pr-question__marks">{plural(questionMarks(question))}</span>
      </header>
      <p className="pr-stem"><MathText text={question.stem} /></p>
      {question.diagram?.kind === 'venn' && <VennDiagram diagram={question.diagram} />}
      {question.parts.slice(0, partIndex + 1).map((part, i) => <PartView
        key={`${question.id}-${i}`}
        part={part}
        label={question.parts.length > 1 ? letters[i] : undefined}
        onDone={points => { partDone(points); if (i + 1 < question.parts.length) setPartIndex(i + 1) }}
      />)}
    </article>

    {questionDone && <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block pr-next" onClick={next}>
      {index + 1 < questions.length ? 'Next question' : 'See my marks'} <ArrowIcon size={18} />
    </button>}
  </div>
}
