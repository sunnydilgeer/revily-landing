'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { WorkedChain } from '../step-chain/WorkedChain'
import { answerText, canMark, mark, markNumber } from './marking'
import { MathLine, MathText } from './MathText'
import { recordAttempt } from './record'
import type { MethodStep, Part } from './types'

/*
 * One part of a question, marked the way an examiner would on a phone:
 *
 *   First try right  → all the marks, and it counts as right first time towards gold.
 *   First try wrong  → a number part with method marks walks through its method steps, one mark each (as the
 *                      mark scheme gives method marks when the final answer slips), then one more go at the
 *                      answer for no marks. Other typed parts get the hint and one more go. Choice and
 *                      spot-the-mistake parts show the answer straight away.
 */
type Stage = 'first' | 'method' | 'retry' | 'done'
type Outcome = 'right' | 'fixed' | 'shown'
type MethodResult = { step: MethodStep; right: boolean }

const plural = (n: number) => `${n} mark${n === 1 ? '' : 's'}`

export default function PartView({ part, label, onDone }: { part: Part; label?: string; onDone: (earned: number) => void }) {
  const [stage, setStage] = useState<Stage>('first')
  const [typed, setTyped] = useState('')
  const [methodIndex, setMethodIndex] = useState(0)
  const [methods, setMethods] = useState<MethodResult[]>([])
  const [earned, setEarned] = useState(0)
  const [outcome, setOutcome] = useState<Outcome>('shown')
  const [note, setNote] = useState<string | null>(null)
  const [wrongCount, setWrongCount] = useState(0)
  const [firstAnswer, setFirstAnswer] = useState('')
  const [showWorking, setShowWorking] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const typedPart = part.kind === 'number' || part.kind === 'fraction'
  const method = part.kind === 'number' ? part.method ?? [] : []
  const step = stage === 'method' ? method[methodIndex] : undefined

  useEffect(() => { if (stage !== 'done') input.current?.focus({ preventScroll: true }) }, [stage, methodIndex])

  function finish(points: number, how: Outcome) {
    setEarned(points)
    setOutcome(how)
    setStage('done')
    setShowWorking(how !== 'right')
    onDone(points)
  }

  function check(event?: FormEvent) {
    event?.preventDefault()
    if (stage === 'done') return
    if (stage === 'method' && step) {
      if (typed.trim() === '') return
      const right = markNumber(step, typed).right
      const results = [...methods, { step, right }]
      setMethods(results)
      setTyped('')
      if (methodIndex + 1 < method.length) setMethodIndex(methodIndex + 1)
      else setStage('retry')
      return
    }
    if (!canMark(part, typed)) return
    const verdict = mark(part, typed)
    setNote(verdict.note ?? null)
    if (stage === 'first') {
      setFirstAnswer(typed)
      recordAttempt(part.statements, verdict.right)
      if (verdict.right) return finish(part.marks, 'right')
      setWrongCount(count => count + 1)
      if (!typedPart) return finish(0, 'shown')
      setTyped('')
      setStage(method.length ? 'method' : 'retry')
      return
    }
    // The retry: no marks, but getting there still matters.
    const methodMarks = methods.filter(result => result.right).length
    if (verdict.right) return finish(methodMarks, 'fixed')
    setWrongCount(count => count + 1)
    finish(methodMarks, 'shown')
  }

  const boxPart = step ?? (part.kind === 'number' ? part : null)
  const box = typedPart && stage !== 'done' && <label className={`pr-answer${wrongCount ? ' is-wrong' : ''}`} key={`${stage}-${methodIndex}-${wrongCount}`}>
    <span className="pr-sr">{step ? step.prompt : 'Your answer'}</span>
    {boxPart?.prefix && <span className="pr-answer__affix" aria-hidden="true">{boxPart.prefix}</span>}
    <input
      ref={input}
      inputMode={part.kind === 'fraction' && !step ? 'text' : 'decimal'}
      autoComplete="off"
      autoCapitalize="off"
      spellCheck={false}
      value={typed}
      onChange={event => setTyped(event.target.value)}
      placeholder={part.kind === 'fraction' && !step ? (part.form === 'mixed' ? 'like 2 3/4' : 'like 3/4') : 'Your answer'}
    />
    {boxPart?.suffix && <span className="pr-answer__affix pr-answer__affix--after" aria-hidden="true">{boxPart.suffix.trim()}</span>}
  </label>

  return <div className={`pr-part pr-part--${stage}`}>
    <div className="pr-part__head">
      {label && <span className="pr-part__label">({label})</span>}
      <p className="pr-part__prompt"><MathText text={part.prompt} /></p>
      <span className="pr-part__marks">[{plural(part.marks)}]</span>
    </div>

    {part.kind === 'choice' && <div className={`pr-choices${part.options.every(option => option.length <= 8) ? ' pr-choices--compact' : ''}`} role="radiogroup" aria-label="Options">
      {part.options.map((option, i) => {
        const state = stage === 'done' ? i === part.correct ? ' is-right' : String(i) === firstAnswer ? ' is-wrong' : '' : typed === String(i) ? ' is-picked' : ''
        return <button key={i} type="button" role="radio" aria-checked={typed === String(i)} disabled={stage === 'done'} className={`pr-choice${state}`} onClick={() => setTyped(String(i))}>
          <MathText text={option} />
        </button>
      })}
    </div>}

    {part.kind === 'spot' && <ol className="pr-spot" aria-label="The working">
      {part.lines.map((line, i) => {
        const state = stage === 'done' ? i === part.wrong ? ' is-right' : String(i) === firstAnswer ? ' is-wrong' : '' : typed === String(i) ? ' is-picked' : ''
        return <li key={i}>
          <button type="button" aria-pressed={typed === String(i)} disabled={stage === 'done'} className={`pr-spot__line${state}`} onClick={() => setTyped(String(i))}>
            <span className="pr-spot__number">Line {i + 1}</span>
            <MathLine tex={line} />
          </button>
        </li>
      })}
    </ol>}

    {methods.length > 0 && <ul className="pr-methods">
      {methods.map((result, i) => <li key={i} className={result.right ? 'is-right' : 'is-wrong'}>
        <span aria-hidden="true">{result.right ? '✓' : '✗'}</span>
        <span>{result.step.prompt} <strong>{result.step.prefix ?? ''}{result.step.answer}{result.step.suffix ?? ''}</strong>{result.right ? ' · 1 method mark' : ''}</span>
      </li>)}
    </ul>}

    {stage !== 'done' && <form className="pr-check" onSubmit={check}>
      {stage === 'method' && step && <p className="pr-nudge"><strong>Not quite. Let’s pick up the method marks.</strong> {step.prompt}</p>}
      {stage === 'retry' && <p className="pr-nudge" role="alert">
        <strong>{methods.length ? 'Now have another go at the answer.' : 'Not quite.'}</strong> {note ?? part.hint}{methods.length ? ' (No marks for this go, but it counts for learning.)' : ''}
      </p>}
      {box}
      <button type="submit" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" disabled={stage === 'method' ? typed.trim() === '' : !canMark(part, typed)}>Check</button>
    </form>}

    {stage === 'done' && <div className={`pr-verdict pr-verdict--${outcome}`} role="status">
      <p className="pr-verdict__title">
        {outcome === 'right' ? `Right! ${plural(part.marks)}.` : earned > 0 ? `${earned} of ${plural(part.marks)}.` : `0 of ${plural(part.marks)}.`}
        {outcome === 'fixed' && ' You got there on the second go.'}
      </p>
      {outcome !== 'right' && <p>The answer is <strong><MathText text={answerText(part)} /></strong>.{earned > 0 ? ' The method marks still count, just like in the exam.' : ''}</p>}
      {outcome !== 'right' && note && <p className="pr-verdict__note">{note}</p>}
      {part.reason && <p className="pr-reason"><strong>Why: </strong>{part.reason}</p>}
      {part.chain && (showWorking
        ? <WorkedChain steps={part.chain} />
        : <button type="button" className="pr-link" onClick={() => setShowWorking(true)}>See the working</button>)}
    </div>}
  </div>
}
