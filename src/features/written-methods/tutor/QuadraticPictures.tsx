import type { ReactNode } from 'react'
import type { QuadraticFrame } from './methodWorking'
import { Powers } from './Powers'

/*
 * Factorising x² + bx + c into (x + p)(x + q) in three steps (Sunny, 1 Oct): list the factor pairs of the last number
 * (boxed amber), find the pair that adds to the middle number (boxed blue), and put it in the brackets (purple, like the
 * ticked pair). With a minus, the pairs are listed plain, then a step flips their signs (Sunny, 2 Oct): the two signs in
 * the question that decide it are boxed purple, and the minus signs it adds are purple. A difference of two squares
 * writes each term as a square first. Colours as in EXPLANATIONS.md.
 */

const minus = (n: number) => n < 0 ? `−${-n}` : String(n)
/** "+ 8x", "− 9x", "+ 15": a term after the first, its sign standing apart. */
const after = (n: number, letter = '') => `${n < 0 ? '−' : '+'} ${Math.abs(n) === 1 && letter ? '' : Math.abs(n)}${letter}`
/** The question as typed: x² + 8x + 15, or x² − 49 with no middle term. */
export const quadraticText = ({ letter, middle, last }: Pick<QuadraticFrame, 'letter' | 'middle' | 'last'>) => `${letter}² ${middle ? `${after(middle, letter)} ` : ''}${after(last)}`

/** A sign in the question, boxed purple on the step that flips the pairs' signs: those two signs decide it. */
export const SignOf = ({ n, frame }: { n: number; frame: { adds: string } }) => frame.adds === 'flip' ? <span className="ns-quad__job is-f3">{n < 0 ? '−' : '+'}</span> : <>{n < 0 ? '−' : '+'}</>

function Question({ frame, plain }: { frame: QuadraticFrame; plain?: boolean }) {
  const { letter, middle, last } = frame
  // The last number is boxed from the factor pairs step, the middle one from the step that adds the pairs.
  const box = (text: string, family: number) => !plain && (family === 1 ? frame.pairs || frame.squares : frame.sums) ? <span className={`ns-quad__job is-f${family}`}><Powers text={text} /></span> : <Powers text={text} />
  return <p className="ns-quad__question" aria-hidden="true">
    <Powers text={`${letter}²`} />
    {middle !== 0 && <> <SignOf n={middle} frame={frame} /> {box(`${Math.abs(middle) === 1 ? '' : Math.abs(middle)}`, 0)}{letter}</>}
    {' '}<SignOf n={last} frame={frame} /> {box(String(Math.abs(last)), 1)}
  </p>
}

/**
 * The factor pairs of c, one a line: plain until a step flips their signs (the minus signs it adds are purple on that
 * step), then what each adds to once checked: the pair that works is ticked and purple.
 */
export function Pairs({ frame, done = '' }: { frame: QuadraticFrame; done?: string }) {
  const signed = (n: number) => n < 0 && frame.flipped ? <>{frame.adds === 'flip' ? <span className="ns-quad__flip">−</span> : '−'}{-n}</> : Math.abs(n)
  const bracket = (n: number) => n < 0 && frame.flipped ? <>({signed(n)})</> : signed(n)
  return <ul className={`ns-quad__pairs${done}`} aria-hidden="true">{(frame.pairs ?? []).map(([a, b], i) => <li key={i} className={frame.sums && i === frame.pick ? 'is-pick' : undefined}>
    <span className="is-f1">{signed(a)} × {bracket(b)}</span>
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
  if (frame.squares) parts.push(`${frame.letter} squared is ${frame.letter} times ${frame.letter}, and ${-frame.last} is ${Math.sqrt(-frame.last)} times ${Math.sqrt(-frame.last)}.`)
  for (const [i, [a, b]] of (frame.pairs ?? []).entries()) parts.push(!frame.flipped && (a < 0 || b < 0) ? `${Math.abs(a)} and ${Math.abs(b)} multiply to ${Math.abs(a * b)}.` : `${minus(a)} and ${minus(b)} multiply to ${minus(a * b)}${frame.sums ? ` and add to ${minus(a + b)}${i === frame.pick ? ', which works' : ''}` : ''}.`)
  if (frame.answer) parts.push(`The answer: (${frame.letter} ${after(frame.answer[0])})(${frame.letter} ${after(frame.answer[1])}).`)
  return parts.join(' ')
}

/** The picture so far. `plain` is the question before any working. The step's heading goes above what it adds. */
export function QuadraticVisual({ frame, heading, plain }: { frame: QuadraticFrame; heading?: ReactNode; plain?: boolean }) {
  // Grey out what this step has finished with: only the question, what the step before added and what this step adds
  // stay clear (Sunny, 1 Oct).
  type Part = 'pairs' | 'squares' | 'answer'
  const partsOf = (adds?: QuadraticFrame['adds']): Part[] => adds ? [adds === 'sums' || adds === 'flip' ? 'pairs' : adds] : []
  const clear = [...partsOf(frame.adds), ...partsOf(frame.before)]
  const done = (part: Part) => clear.includes(part) ? '' : ' is-done'
  if (plain) return <div className="ns-quad is-plain" role="img" aria-label={`The question: ${quadraticText(frame)}`}><Question frame={frame} plain /></div>
  return <div className="ns-quad" role="img" aria-label={spoken(frame)}>
    <Question frame={frame} />
    {(frame.adds === 'pairs' || frame.adds === 'flip') && heading}
    {frame.adds === 'squares' && heading}
    {frame.squares && <Squares frame={frame} done={done('squares')} />}
    {frame.adds === 'sums' && heading}
    {frame.pairs && <Pairs frame={frame} done={done('pairs')} />}
    {frame.adds === 'answer' && heading}
    {frame.answer && <Answer frame={frame} />}
  </div>
}
