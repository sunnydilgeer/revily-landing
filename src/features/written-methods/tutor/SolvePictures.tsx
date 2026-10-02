import type { ReactNode } from 'react'
import { Side } from './EquationPictures'
import type { EquationRow, SolveFrame } from './methodWorking'
import { Powers } from './Powers'
import { Pairs, SignOf } from './QuadraticPictures'

/*
 * Solving x² + bx + c = 0 by factorising (lesson 22), in the textbook's four steps: make one side 0 on the A5 board,
 * factorise with A7's factor pairs (the last number boxed amber, the middle blue, the pair that works purple), set
 * each bracket to 0, then undo the number in each bracket on both sides, ending in the green answer. The rows line up
 * on their = signs, like the board. Colours as in EXPLANATIONS.md.
 */

const minus = (n: number) => n < 0 ? `−${-n}` : String(n)
/** "+ 5", "− 4": a term after the first, its sign standing apart. */
const after = (n: number) => `${n < 0 ? '−' : '+'} ${Math.abs(n)}`
/** The board's tokens for x + a: "x −4". */
const bracketSide = (letter: string, n: number) => `${letter} ${n < 0 ? minus(n) : `+${n}`}`
/** The answers: one for each bracket, the opposite of its number. */
export const solveAnswer = ({ letter, brackets }: Pick<SolveFrame, 'letter' | 'brackets'>) => brackets!.map(n => `${letter} = ${minus(-n)}`).join(' or ')

/** x² + bx + c, the last number boxed amber once the pairs are listed and the middle one blue once they are added. */
function Quadratic({ frame }: { frame: SolveFrame }) {
  const { letter, middle, last } = frame
  const box = (text: string, family: number, on?: boolean) => on ? <span className={`ns-quad__job is-f${family}`}><Powers text={text} /></span> : <Powers text={text} />
  // x on its own is 1x: the box goes round the x, so there is still something to box.
  const x = Math.abs(middle) === 1 ? box(letter, 0, frame.sums) : <>{box(String(Math.abs(middle)), 0, frame.sums)}{letter}</>
  return <><Powers text={`${letter}²`} />{middle !== 0 && <> <SignOf n={middle} frame={frame} /> {x}</>} <SignOf n={last} frame={frame} /> {box(String(Math.abs(last)), 1, Boolean(frame.pairs))}</>
}

/** (x − 4)(x + 5): the numbers purple, like the pair they came from; each bracket boxed when the next step splits them. */
function Brackets({ frame, boxed }: { frame: SolveFrame; boxed?: boolean }) {
  const one = (n: number) => <span className={boxed ? 'ns-shared' : undefined}>({frame.letter} {n < 0 ? '−' : '+'} <span className={frame.given ? undefined : 'ns-solve__num is-f3'}>{Math.abs(n)}</span>)</span>
  return <>{one(frame.brackets![0])}{one(frame.brackets![1])}</>
}

/** The textbook's four steps (Sunny, 2 Oct): each move is labelled with the one it belongs to. */
export const stageOf: Record<SolveFrame['adds'], string> = {
  zero: 'Step 1 · make it 0', pairs: 'Step 2 · factorise', flip: 'Step 2 · factorise', sums: 'Step 2 · factorise', brackets: 'Step 2 · factorise', split: 'Step 3 · two equations', solve: 'Step 4 · solve each',
}

type Part = 'board' | 'zero' | 'pairs' | 'brackets' | 'split' | 'moves'
/** What each step works on, adds, and so keeps clear; the rest is greyed out (Sunny, 1 Oct). The first step greys nothing. */
const clear: Record<SolveFrame['adds'], Part[]> = {
  zero: ['board', 'zero'],
  pairs: ['zero', 'pairs'],
  flip: ['zero', 'pairs'],
  sums: ['zero', 'pairs'],
  brackets: ['zero', 'pairs', 'brackets'],
  split: ['brackets', 'split'],
  solve: ['split', 'moves'],
}

function spoken(frame: SolveFrame) {
  const rows = (frame.board ?? []).map(row => 'left' in row ? `${row.left} = ${row.right}` : 'note' in row ? row.note : row.answer)
  const parts = rows.map(row => row.replace(/[~^[\]]/g, '').replace(/ ([+−])(?=\d)/g, ' $1 '))
  const zero = `${frame.letter}² ${frame.middle ? `${after(frame.middle)}${frame.letter} ` : ''}${after(frame.last)} = 0`.replace(/([+−]) 1x/, '$1 x')
  if (!frame.given && !frame.board?.some(row => 'left' in row && row.right === '0')) parts.push(zero)
  for (const [i, [a, b]] of (frame.pairs ?? []).entries()) parts.push(!frame.flipped && (a < 0 || b < 0) ? `${Math.abs(a)} and ${Math.abs(b)} multiply to ${Math.abs(a * b)}` : `${minus(a)} and ${minus(b)} multiply to ${minus(a * b)}${frame.sums ? ` and add to ${minus(a + b)}${i === frame.pick ? ', which works' : ''}` : ''}`)
  const [a, b] = frame.brackets ?? []
  if (frame.brackets) parts.push(`(${frame.letter} ${after(a)})(${frame.letter} ${after(b)}) = 0`)
  if (frame.split) parts.push(`${frame.letter} ${after(a)} = 0 or ${frame.letter} ${after(b)} = 0`)
  if (frame.solve) parts.push(`The answer: ${solveAnswer(frame)}`)
  return parts.join('. ')
}

/** One row of the board: left = right, lined up on the = sign. */
function Row({ left, right, done }: { left: ReactNode; right: ReactNode; done: string }) {
  return <div className={`ns-eq__row${done}`} aria-hidden="true">
    <span className="ns-eq__left">{left}</span>
    <span className="ns-eq__equals">=</span>
    <span className="ns-eq__right">{right}</span>
  </div>
}

/** The picture so far. `plain` is the question before any working. The step's heading goes above what it adds. */
export function SolveVisual({ frame, heading, plain, focus }: { frame: SolveFrame; heading?: ReactNode; plain?: boolean; focus?: boolean }) {
  const { letter } = frame
  const done = (part: Part) => focus && frame.adds !== 'zero' && !clear[frame.adds].includes(part) ? ' is-done' : ''
  if (plain) {
    const first = frame.board?.[0]
    return <div className="ns-eq ns-solve is-plain" role="img" aria-label={`The question: ${spoken({ ...frame, board: first ? [first] : undefined, pairs: undefined, brackets: frame.given ? frame.brackets : undefined, split: false, solve: false })}`}>
      {first && 'left' in first
        ? <Row left={<Side side={first.left} plain />} right={<Side side={first.right} plain />} done="" />
        : frame.given ? <Row left={<Brackets frame={frame} />} right="0" done="" />
        : <Row left={<Quadratic frame={{ ...frame, pairs: undefined, sums: false }} />} right="0" done="" />}
    </div>
  }
  const board = frame.board ?? []
  // A question already equal to 0 has no board: its own row is the 0 row. A board ending in a 0 row draws it itself.
  const zeroRow = !frame.given && !board.some(row => 'left' in row && row.right === '0')
  const boardRow = (row: EquationRow, i: number) => 'left' in row
    ? <Row key={`b${i}`} left={row.right === '0' && i > 0 ? <Quadratic frame={frame} /> : <Side side={row.left} />} right={<Side side={row.right} />} done={done(i === board.length - 1 && row.right === '0' ? 'zero' : 'board')} />
    : <p key={`b${i}`} className={`ns-eq__note is-f${('family' in row ? row.family ?? 3 : 3) % 4}${done('board')}`} aria-hidden="true">{'note' in row ? row.note : row.answer}</p>
  const [a, b] = frame.brackets ?? [0, 0]
  // The textbook step this move belongs to, a quiet line above its heading, so students can match it to their book.
  const head = heading && <div className="ns-eq__heading"><p className="ns-solve__stage">{stageOf[frame.adds]}</p>{heading}</div>
  const wide = (part: Part, children: ReactNode) => <div className={`ns-solve__wide${done(part)}`} aria-hidden="true">{children}</div>
  return <div className="ns-eq ns-solve" role="img" aria-label={spoken(frame)}>
    {board.slice(0, 1).map(boardRow)}
    {frame.adds === 'zero' && head}
    {board.slice(1).map((row, i) => boardRow(row, i + 1))}
    {zeroRow && <Row left={<Quadratic frame={frame} />} right="0" done={done('zero')} />}
    {(frame.adds === 'pairs' || frame.adds === 'flip') && head}
    {frame.adds === 'sums' && head}
    {frame.pairs && wide('pairs', <Pairs frame={{ letter, middle: frame.middle, last: frame.last, pairs: frame.pairs, flipped: frame.flipped, sums: frame.sums, pick: frame.pick, adds: frame.adds === 'flip' ? 'flip' : 'pairs' }} />)}
    {frame.adds === 'brackets' && head}
    {frame.brackets && <Row left={<Brackets frame={frame} boxed={frame.adds === 'split'} />} right="0" done={done('brackets')} />}
    {frame.adds === 'split' && head}
    {frame.split && <>
      <Row left={<Side side={frame.solve ? `${letter} [${minus(a).replace(/^(?=\d)/, '+')}]` : bracketSide(letter, a)} />} right={<Side side="0" />} done={done('split')} />
      <p className={`ns-eq__note ns-solve__or${done('split')}`} aria-hidden="true">or</p>
      <Row left={<Side side={frame.solve ? `${letter} [${minus(b).replace(/^(?=\d)/, '+')}]` : bracketSide(letter, b)} />} right={<Side side="0" />} done={done('split')} />
    </>}
    {frame.adds === 'solve' && head}
    {frame.solve && <>
      {[a, b].map((n, i) => {
        const undo = n < 0 ? `+${-n}^` : `−${n}^`
        return <Row key={`m${i}`} left={<Side side={`${letter} ~${n < 0 ? minus(n) : `+${n}`} ~${undo}`} />} right={<Side side={`0 ${undo}`} />} done="" />
      })}
      <p className="ns-eq__answer" aria-hidden="true"><Powers text={solveAnswer(frame)} /></p>
    </>}
  </div>
}
