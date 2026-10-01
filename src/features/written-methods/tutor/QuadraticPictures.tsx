import type { ReactNode } from 'react'
import type { QuadraticFrame } from './methodWorking'
import { Powers } from './Powers'

/*
 * Factorising x² + bx + c into (x + p)(x + q) with the diamond (X) method (Sunny chose it, 1 Oct): the two numbers
 * go in the diamond's side gaps; they multiply to c, on top (amber), and add to b, underneath (blue). The pairs that
 * multiply to c are listed under it, each pair's sum is checked against b, and the pair that works (purple) fills the
 * gaps and goes into the brackets. A difference of two squares writes each term as a square first. Colours as in
 * EXPLANATIONS.md.
 */

const minus = (n: number) => n < 0 ? `−${-n}` : String(n)
/** "+ 8x", "− 9x", "+ 15": a term after the first, its sign standing apart. */
const after = (n: number, letter = '') => `${n < 0 ? '−' : '+'} ${Math.abs(n) === 1 && letter ? '' : Math.abs(n)}${letter}`
/** The question as typed: x² + 8x + 15, or x² − 49 with no middle term. */
export const quadraticText = ({ letter, middle, last }: Pick<QuadraticFrame, 'letter' | 'middle' | 'last'>) => `${letter}² ${middle ? `${after(middle, letter)} ` : ''}${after(last)}`

function Question({ frame, plain }: { frame: QuadraticFrame; plain?: boolean }) {
  const { letter, middle, last } = frame
  const boxed = !plain && (frame.shape || frame.squares)
  const box = (text: string, family: number) => boxed ? <span className={`ns-quad__job is-f${family}`}><Powers text={text} /></span> : <Powers text={text} />
  return <p className="ns-quad__question" aria-hidden="true">
    <Powers text={`${letter}²`} />
    {middle !== 0 && <> {middle < 0 ? '−' : '+'} {box(`${Math.abs(middle) === 1 ? '' : Math.abs(middle)}`, 0)}{letter}</>}
    {' '}{last < 0 ? '−' : '+'} {box(String(Math.abs(last)), 1)}
  </p>
}

const Gap = () => <span className="ns-quad__gap" />

/** The diamond: c on top (multiply to), b underneath (add to), and two gaps for the numbers, filled at the end. */
function Diamond({ frame, done = '' }: { frame: QuadraticFrame; done?: string }) {
  const side = (n?: number) => n === undefined ? <Gap /> : <span className="ns-quad__found">{minus(n)}</span>
  return <div className={`ns-quad__diamond${done}`} aria-hidden="true">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M8 8 L92 92 M92 8 L8 92" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" fill="none" /></svg>
    <span className="ns-quad__corner is-top is-f1"><small>multiply to</small>{minus(frame.last)}</span>
    <span className="ns-quad__corner is-left">{side(frame.answer?.[0])}</span>
    <span className="ns-quad__corner is-right">{side(frame.answer?.[1])}</span>
    <span className="ns-quad__corner is-bottom is-f0">{minus(frame.middle)}<small>add to</small></span>
  </div>
}

/** The pairs that multiply to c, one a line, then what each adds to once checked: the pair that works is ticked and purple. */
function Pairs({ frame, done = '' }: { frame: QuadraticFrame; done?: string }) {
  const bracket = (n: number) => n < 0 ? `(${minus(n)})` : String(n)
  return <ul className={`ns-quad__pairs${done}`} aria-hidden="true">{(frame.pairs ?? []).map(([a, b], i) => <li key={i} className={frame.sums && i === frame.pick ? 'is-pick' : undefined}>
    <span className="is-f1">{minus(a)} × {bracket(b)}</span>
    {frame.sums && <span className="is-f0">{minus(a)} + {bracket(b)} = {minus(a + b)} <span className={i === frame.pick ? 'ns-quad__yes' : 'ns-quad__no'}>{i === frame.pick ? '✓' : '✗'}</span></span>}
  </li>)}</ul>
}

/** A difference of two squares: each term written as a square, the part that is squared boxed in its colour. */
function Squares({ frame, done = '' }: { frame: QuadraticFrame; done?: string }) {
  const root = Math.sqrt(-frame.last)
  return <div className={`ns-quad__shape${done}`} aria-hidden="true">
    <p><Powers text={`${frame.letter}²`} /> = <span className="ns-quad__job is-f0">{frame.letter}</span> × {frame.letter}</p>
    <p>{-frame.last} = <span className="ns-quad__job is-f1">{root}</span> × {root}</p>
  </div>
}

/** The answer, built from the two numbers in their colour: purple from the pair that works, amber from a square. */
function Answer({ frame }: { frame: QuadraticFrame }) {
  const [a, b] = frame.answer!
  const family = frame.squares ? 'is-f1' : 'is-f3'
  const piece = (n: number) => <>{n < 0 ? ' − ' : ' + '}<span className={family}>{Math.abs(n)}</span></>
  return <p className="ns-eq__answer ns-quad__answer" aria-hidden="true">({frame.letter}{piece(a)})({frame.letter}{piece(b)})</p>
}

function spoken(frame: QuadraticFrame) {
  const parts = [`The question: ${quadraticText(frame)}.`]
  if (frame.shape) parts.push(`Two numbers go in the gaps. They multiply to ${minus(frame.last)} and add to ${minus(frame.middle)}.`)
  if (frame.signs) parts.push(...frame.signs.map(sign => `${sign}.`))
  if (frame.squares) parts.push(`${frame.letter} squared is ${frame.letter} times ${frame.letter}, and ${-frame.last} is ${Math.sqrt(-frame.last)} times ${Math.sqrt(-frame.last)}.`)
  for (const [i, [a, b]] of (frame.pairs ?? []).entries()) parts.push(`${minus(a)} and ${minus(b)} multiply to ${minus(a * b)}${frame.sums ? ` and add to ${minus(a + b)}${i === frame.pick ? ', which works' : ''}` : ''}.`)
  if (frame.answer) parts.push(`The answer: (${frame.letter} ${after(frame.answer[0])})(${frame.letter} ${after(frame.answer[1])}).`)
  return parts.join(' ')
}

/** The picture so far. `plain` is the question before any working. The step's heading goes above what it adds. */
export function QuadraticVisual({ frame, heading, plain }: { frame: QuadraticFrame; heading?: ReactNode; plain?: boolean }) {
  // Grey out what this step has finished with: only the question, what the step before added and what this step adds
  // stay clear (Sunny, 1 Oct). The last step fills the diamond's gaps, so the diamond is clear again with the answer.
  type Part = 'diamond' | 'signs' | 'pairs' | 'squares' | 'answer'
  const partsOf = (adds?: QuadraticFrame['adds']): Part[] => adds === 'shape' ? ['diamond'] : adds === 'pairs' || adds === 'sums' ? ['pairs'] : adds === 'answer' ? ['answer', 'diamond'] : adds ? [adds] : []
  const clear = [...partsOf(frame.adds), ...partsOf(frame.before)]
  const done = (part: Part) => clear.includes(part) ? '' : ' is-done'
  if (plain) return <div className="ns-quad is-plain" role="img" aria-label={`The question: ${quadraticText(frame)}`}><Question frame={frame} plain /></div>
  return <div className="ns-quad" role="img" aria-label={spoken(frame)}>
    <Question frame={frame} />
    {frame.adds === 'shape' && heading}
    {frame.shape && <Diamond frame={frame} done={done('diamond')} />}
    {frame.adds === 'signs' && heading}
    {frame.signs && <ul className={`ns-quad__signs${done('signs')}`} aria-hidden="true">{frame.signs.map(sign => <li key={sign}><Powers text={sign} /></li>)}</ul>}
    {frame.adds === 'squares' && heading}
    {frame.squares && <Squares frame={frame} done={done('squares')} />}
    {(frame.adds === 'pairs' || frame.adds === 'sums') && heading}
    {frame.pairs && <Pairs frame={frame} done={done('pairs')} />}
    {frame.adds === 'answer' && heading}
    {frame.answer && <Answer frame={frame} />}
  </div>
}
