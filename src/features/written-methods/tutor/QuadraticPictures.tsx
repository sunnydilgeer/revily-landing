import type { ReactNode } from 'react'
import type { QuadraticFrame } from './methodWorking'
import { Powers } from './Powers'

/*
 * Factorising x² + bx + c into (x + p)(x + q), like the A7 videos, but with every job written down (Sunny, 1 Oct):
 * the two numbers go in the brackets, they multiply to c (amber) and add to b (blue). The pairs that multiply to c
 * are listed in a table, then each pair's sum is checked against b, and the pair that works (purple) goes into the
 * brackets. A difference of two squares writes each term as a square first. Colours as in EXPLANATIONS.md.
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

/** The brackets with two empty boxes, and the two jobs the numbers in them must do. */
function Shape({ frame, done = '' }: { frame: QuadraticFrame; done?: string }) {
  return <div className={`ns-quad__shape${done}`} aria-hidden="true">
    <p className="ns-quad__brackets">({frame.letter} + <Gap />)({frame.letter} + <Gap />)</p>
    <p className="is-f1"><Gap /> × <Gap /> = {minus(frame.last)}</p>
    <p className="is-f0"><Gap /> + <Gap /> = {minus(frame.middle)}</p>
  </div>
}

/** The pairs that multiply to c, with what each adds to once checked: the pair that works is ticked and purple. */
function Pairs({ frame, heading, done = '' }: { frame: QuadraticFrame; heading?: ReactNode; done?: string }) {
  const pairs = frame.pairs ?? []
  return <>
    {frame.adds === 'pairs' && heading}
    <table className={`ns-quad__pairs${done}`} aria-hidden="true">
      <thead><tr><th>The two numbers</th><th className="is-f1">×</th><th className="is-f0">+</th></tr></thead>
      {frame.adds === 'sums' && heading && <tbody className="ns-quad__heading-row"><tr><td colSpan={3}>{heading}</td></tr></tbody>}
      <tbody>{pairs.map(([a, b], i) => <tr key={i} className={frame.sums && i === frame.pick ? 'is-pick' : undefined}>
        <td>{minus(a)} <span className="ns-quad__and">and</span> {minus(b)}</td>
        <td className="is-f1">{minus(a * b)}</td>
        <td className="is-f0">{frame.sums ? <>{minus(a + b)} <span className={i === frame.pick ? 'ns-quad__yes' : 'ns-quad__no'}>{i === frame.pick ? '✓' : '✗'}</span></> : ''}</td>
      </tr>)}</tbody>
    </table>
  </>
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
  if (frame.shape) parts.push(`Two numbers go in the brackets. They multiply to ${minus(frame.last)} and add to ${minus(frame.middle)}.`)
  if (frame.signs) parts.push(...frame.signs.map(sign => `${sign}.`))
  if (frame.squares) parts.push(`${frame.letter} squared is ${frame.letter} times ${frame.letter}, and ${-frame.last} is ${Math.sqrt(-frame.last)} times ${Math.sqrt(-frame.last)}.`)
  for (const [i, [a, b]] of (frame.pairs ?? []).entries()) parts.push(`${minus(a)} and ${minus(b)} multiply to ${minus(a * b)}${frame.sums ? ` and add to ${minus(a + b)}${i === frame.pick ? ', which works' : ''}` : ''}.`)
  if (frame.answer) parts.push(`The answer: (${frame.letter} ${after(frame.answer[0])})(${frame.letter} ${after(frame.answer[1])}).`)
  return parts.join(' ')
}

/** The picture so far. `plain` is the question before any working. The step's heading goes above what it adds. */
export function QuadraticVisual({ frame, heading, plain }: { frame: QuadraticFrame; heading?: ReactNode; plain?: boolean }) {
  // Grey out the parts this step has finished with: the question and the part just before this step's stay clear.
  const parts = (['shape', 'signs', 'squares', 'pairs', 'answer'] as const).filter(part => part === 'shape' ? frame.shape : part === 'signs' ? frame.signs : part === 'squares' ? frame.squares : part === 'pairs' ? frame.pairs : frame.answer)
  const now = parts.indexOf(frame.adds === 'sums' ? 'pairs' : frame.adds)
  const done = (part: typeof parts[number]) => parts.indexOf(part) < now - 1 ? ' is-done' : ''
  if (plain) return <div className="ns-quad is-plain" role="img" aria-label={`The question: ${quadraticText(frame)}`}><Question frame={frame} plain /></div>
  return <div className="ns-quad" role="img" aria-label={spoken(frame)}>
    <Question frame={frame} />
    {frame.adds === 'shape' && heading}
    {frame.shape && <Shape frame={frame} done={done('shape')} />}
    {frame.adds === 'signs' && heading}
    {frame.signs && <ul className={`ns-quad__signs${done('signs')}`} aria-hidden="true">{frame.signs.map(sign => <li key={sign}><Powers text={sign} /></li>)}</ul>}
    {frame.adds === 'squares' && heading}
    {frame.squares && <Squares frame={frame} done={done('squares')} />}
    {frame.pairs && <Pairs frame={frame} heading={heading} done={done('pairs')} />}
    {frame.adds === 'answer' && heading}
    {frame.answer && <Answer frame={frame} />}
  </div>
}
