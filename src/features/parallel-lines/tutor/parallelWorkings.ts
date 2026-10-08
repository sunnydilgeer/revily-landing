import type { GraphPoint } from '../../written-methods/tutor/methodWorking'
import { latex } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, bracket, mark, pt, shared, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'
import { lineText, numberText, ratio, type Move } from '../../gradient/tutor/equationWorkings'
import { pair } from '../../gradient/tutor/gradientWorkings'

/*
 * The workings for Parallel lines (graphs lesson 4, GR5), one move a step on the question's own grid, as in lesson 3:
 * parallel lines have the same gradient, m in y = mx + c. Each line's m is read off (made the subject first if it
 * isn't), and the m's compared; a line parallel to another through a point takes that m, then the point's x and y
 * go into y = mx + c to find c. Lines a step draws are biro blue and green once they are the answer.
 */

const show = (n: number) => String(n).replace('-', '−')

/** A straight line y = (top/bottom)x + c, as the lesson writes it, and two of its points for drawing it. */
export type Line = { top: number; bottom: number; c: number }
export const line = (top: number, c: number, bottom = 1): Line => { const [n, d] = ratio(top, bottom); return { top: n, bottom: d, c } }
export const gradientOf = (l: Line) => l.top / l.bottom
export const named = (l: Line) => lineText(l.top, l.bottom, l.c)
export const mText = (l: Line) => numberText(l.top, l.bottom)
export const ends = (l: Line): [GraphPoint, GraphPoint] => [pt(0, l.c), pt(l.bottom, l.c + l.top)]
const drawn = (l: Line, at: number, extra: { answer?: boolean; label?: string } = {}) => ({ from: ends(l)[0], to: ends(l)[1], at, ...extra })
type Lines = NonNullable<GraphGrid['lines']>
/** Only the line a step draws keeps its name on the grid; the lines of working name the earlier ones (side by side, parallel names would crowd). */
const unnamed = (lines: Lines = []): Lines => lines.map(l => l.at < 0 ? l : { ...l, label: undefined })
/** The answer's grid: every line drawn, none named. */
const plain: GraphMove = { title: '', say: '', equation: '', adds: 'answer', change: frame => ({ ...frame, lines: unnamed(frame.lines) }) }

/** A rearranging step, its line of working under the grid (purple, as in lesson 3). */
const moveLine = ([title, text, say]: Move): GraphMove => ({
  title, equation: latex(text), adds: 'lines', say,
  change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), { text, family: 3, at: step }] }),
})

/**
 * Same gradient (the GR5 teaching box): each line drawn with its m written under the grid, then the answer: all the
 * m's match, so the lines are parallel, all green.
 */
export function sameGradientMoves(lines: Line[]): GraphMove[] {
  const m = mText(lines[0])
  return [
    ...lines.map((l, i): GraphMove => ({
      title: i === 0 ? 'Read m' : 'And the next', equation: latex(`${named(l)}: m = ${mText(l)}`), adds: 'picture',
      say: i === 0 ? 'Each line is already y = mx + c. m is the number in front of x.' : 'Its m is the number in front of x too.',
      change: (frame, step) => ({ ...frame, lines: [...unnamed(frame.lines), drawn(l, step, { label: named(l) })], marks: [mark('y', l.c)], working: [...(frame.working ?? []), { text: `${named(l)}: m = ${mText(l)}`, family: 3, at: step }] }),
    })),
    answerMove(`Parallel: every m is ${m}`, 'Same gradient', 'They all have the same gradient, so they never meet: they are parallel. Only c, where each crosses the y axis, is different.', lines.map((_, i) => i), plain),
  ]
}

/**
 * Is it parallel? The first line is y = mx + c already; the second is made y = mx + c one move a line (`moves`), then
 * the two m's are compared. `same` is the answer: both green when they match; the second red when they don't.
 */
export function compareMoves(first: Line, second: Line, moves: Move[]): GraphMove[] {
  const same = gradientOf(first) === gradientOf(second)
  return [
    {
      title: 'First line', equation: latex(`m = ${mText(first)}`), adds: 'picture', say: `${named(first)} is already y = mx + c, so m is the number in front of x.`,
      change: (frame, step) => ({ ...frame, lines: [...unnamed(frame.lines), drawn(first, step, { label: named(first) })], marks: [mark('y', first.c)], working: [...(frame.working ?? []), { text: `${named(first)}: m = ${mText(first)}`, family: 3, at: step }] }),
    },
    ...moves.map(moveLine),
    {
      title: 'Second line', equation: latex(`m = ${mText(second)}`), adds: 'picture', say: 'Now it is y = mx + c too, so read its m.',
      change: (frame, step) => ({ ...frame, lines: [...unnamed(frame.lines), drawn(second, step, { label: named(second) })], marks: [mark('y', second.c)], working: [...(frame.working ?? []), { text: `m = ${mText(second)}`, family: 3, at: step }] }),
    },
    answerMove(same ? `Yes: both have m = ${mText(first)}` : `No: m = ${mText(first)} and m = ${mText(second)}`, 'Compare m',
      same ? 'The gradients match, so the lines are parallel.' : 'The gradients are different, so the lines are not parallel: they cross somewhere.',
      same ? [0, 1] : [0], plain),
  ]
}

/**
 * Parallel through a point: the given line's m (made the subject first if it isn't), then the point's x and y put
 * into y = mx + c, then c, then the new line, green, beside the given one. The grid starts with the given line and
 * the point on it.
 */
export function throughMoves(given: Line, moves: Move[], p: GraphPoint): GraphMove[] {
  const m = gradientOf(given), mx = m * p.x, c = p.y - mx
  const sub = `${show(p.y)} = ${mText(given)} × ${bracket(p.x)} + c`
  const answer = line(given.top, c, given.bottom)
  // A point on the y axis is c itself; any other point is put into y = mx + c.
  const findC: GraphMove[] = p.x === 0 ? [{
    title: 'Read c', equation: latex(`c = ${show(c)}`), adds: 'lines', say: `c is where the new line crosses the y axis: ${show(c)}.`,
    change: (frame, step) => ({ ...frame, marks: [mark('y', c)], working: [...(frame.working ?? []), { text: `c = ${show(c)}`, family: 0, at: step }] }),
  }] : [{
    title: 'Put the point in', equation: latex(sub), adds: 'lines', say: `The new line goes through ${pair(p)}: put its x and y into y = mx + c.`,
    change: (frame, step) => ({ ...frame, boxed: [p], marks: shared([p]), working: [...(frame.working ?? []), { text: sub, family: 3, at: step }] }),
  }, {
    title: 'Solve for c', equation: latex(`c = ${show(c)}`), adds: 'lines',
    say: `${mText(given)} × ${bracket(p.x)} is ${show(mx)}, so ${show(p.y)} = ${show(mx)} + c. Take ${bracket(mx)} from both sides.`,
    change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), { text: `${show(p.y)} = ${show(mx)} + c, so c = ${show(c)}`, family: 0, at: step }] }),
  }]
  return [
    ...moves.map(moveLine),
    {
      title: 'Same gradient', equation: latex(`m = ${mText(given)}`), adds: 'lines', say: `A parallel line has the same gradient, ${mText(given)}. Only c is still to find.`,
      change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), { text: `m = ${mText(given)}`, family: 3, at: step }] }),
    },
    ...findC,
    answerMove(named(answer), 'The new line', 'Put m and c into y = mx + c. It runs alongside the first line, through the point.', [], {
      title: '', say: '', equation: '', adds: 'answer',
      change: (frame, step) => ({ ...frame, lines: [...(frame.lines ?? []), drawn(answer, step, { answer: true })], marks: [mark('y', c)] }),
    }),
  ]
}

/**
 * Which are parallel? The target's m first, then each option made y = mx + c on one line ("2y − 4 = 6x is y = 3x + 2")
 * with its m and a ✓ or ✗, each drawn as it is read; the parallel ones go green in the answer. With no target, the
 * options are compared with each other (two of them match).
 */
export type Option = { text: string; line: Line }
export function pickMoves(target: Line | null, options: Option[]): GraphMove[] {
  const m = target ? gradientOf(target) : options.map(o => gradientOf(o.line)).find((g, i, all) => all.indexOf(g) !== i)
  const matches = options.flatMap((o, i) => gradientOf(o.line) === m ? [i] : [])
  const offset = target ? 1 : 0
  return [
    ...(target ? [{
      title: 'The line’s m', equation: latex(`m = ${mText(target)}`), adds: 'picture' as const, say: `${named(target)} is y = mx + c, so its m is the number in front of x. A parallel line needs this m.`,
      change: (frame, step) => ({ ...frame, lines: [...unnamed(frame.lines), drawn(target, step, { label: named(target) })], working: [...(frame.working ?? []), { text: `${named(target)}: m = ${mText(target)}`, family: 3, at: step }] }),
    } satisfies GraphMove] : []),
    ...options.map((o, i): GraphMove => {
      const same = o.text === named(o.line)
      const text = `${same ? o.text : `${o.text} is ${named(o.line)}`}: m = ${mText(o.line)}${target ? gradientOf(o.line) === m ? ' ✓' : ' ✗' : ''}`
      return {
        title: i === 0 ? 'Each line’s m' : 'The next one', equation: latex(text), adds: 'picture',
        say: same ? 'It is already y = mx + c: read its m.' : 'Make y the subject to get y = mx + c, then read its m.',
        change: (frame, step) => ({ ...frame, lines: [...unnamed(frame.lines), drawn(o.line, step)], working: [...(frame.working ?? []), { text, family: 3, at: step }] }),
      }
    }),
    answerMove(matches.map(i => options[i].text).join(' and '), 'Same m', !target ? 'Those two have the same m, so they are parallel.'
      : matches.length === 1 ? `Only that one has the same m as ${named(target)}, so it is the parallel one.` : `Those have the same m as ${named(target)}, so they are parallel to it.`,
      matches.map(i => i + offset), plain),
  ]
}
/** The line a parallel-through-a-point question asks for. */
export const parallelThrough = (given: Line, p: GraphPoint) => line(given.top, p.y - gradientOf(given) * p.x, given.bottom)

/** A grid holding a line's crossing and a point, with room for the line's label: `x` and `y` widen it. */
export function gridWith(given: Line, x: [number, number], y: [number, number], points: GraphPoint[] = [], label = named(given)): GraphGrid {
  return { x, y, lines: [{ ...drawn(given, -1), label }], points: points.map(p => ({ ...p, at: -1 })) }
}

/** Slips drawing a parallel line on the board (sent as "a, b, k", ax + by = k): not parallel, or parallel but missing the point. */
export function parallelSlips(given: Line, p: GraphPoint) {
  const m = gradientOf(given), c = p.y - m * p.x
  const near = (u: number, v: number) => Math.abs(u - v) < 1e-9
  return (response: string) => {
    const [a, b, k] = response.replace(/−/g, '-').split(',').map(Number)
    if ([a, b, k].some(Number.isNaN) || b === undefined) return null
    if (b === 0) return 'That line goes straight up and down. A parallel line has the same tilt as the first one.'
    const slope = -a / b, crosses = k / b
    if (near(slope, m) && near(crosses, given.c)) return 'That’s the same line again. Parallel means alongside it, through the point.'
    if (near(slope, m) && !near(crosses, c)) return `Parallel, good, but it has to go through ${pair(p)}.`
    if (near(p.y, slope * p.x + crosses) && near(slope, -m)) return 'Through the point, but tilted the other way. Copy the first line’s gradient, sign and all.'
    if (near(p.y, slope * p.x + crosses)) return `Through the point, but not parallel. Step the first line’s gradient, ${numberText(given.top, given.bottom)}, from the point.`
    return null
  }
}
