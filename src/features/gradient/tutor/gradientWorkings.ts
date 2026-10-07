import type { GraphPoint } from '../../written-methods/tutor/methodWorking'
import { fractionText } from '../../written-methods/tutor/TiltBoard'
import { latex } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, bracket, mark, pt, shared, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'
import type { Slip } from '../../equations/tutor/equationsDiagnosis'

/*
 * The workings for Gradient (graphs lesson 3, GR1), one move a step on the question's own grid (GraphPictures.tsx).
 * Across first, then up, as in lessons 1 and 2 (Sunny, 7 Oct): from the first point an amber arrow across, then a biro
 * blue arrow up (or down) to the second, each with its count written under the grid in its colour; then "up over
 * across" in the green answer box. From two points the counts are subtractions, in the same order both times.
 */

const show = (n: number) => String(n).replace('-', '−')
export const pair = (p: GraphPoint) => `(${show(p.x)}, ${show(p.y)})`
export const gradientOf = (a: GraphPoint, b: GraphPoint) => (b.y - a.y) / (b.x - a.x)
export const gradientText = (a: GraphPoint, b: GraphPoint) => fractionText(b.y - a.y, b.x - a.x)

/** Moves: the two points, ringed, their numbers lit on the axes. */
const pickTwo = (a: GraphPoint, b: GraphPoint, given: boolean): GraphMove => ({
  title: 'Two points', equation: latex(`${pair(a)} and ${pair(b)}`), adds: 'picture',
  say: given ? 'Start from the first point.' : 'Pick two points where the line crosses grid corners exactly. Start from the left one.',
  change: (frame, step) => ({
    ...frame, boxed: [a, b], marks: shared([a, b]),
    points: [...(frame.points ?? []).filter(p => !((p.x === a.x && p.y === a.y) || (p.x === b.x && p.y === b.y))), { ...a, at: step }, { ...b, at: step }],
  }),
})
/** Moves: across from the first point to under (or over) the second, amber; its count, or subtraction, under the grid. */
const acrossFrom = (a: GraphPoint, b: GraphPoint, subtract: boolean): GraphMove => {
  const n = b.x - a.x
  const text = subtract ? `across: ${show(b.x)} − ${bracket(a.x)} = ${show(n)}` : `across ${show(n)}`
  return {
    title: n < 0 ? 'Across (left)' : 'Across', equation: latex(text), adds: 'lines',
    say: subtract ? 'Take the first x from the second.' : n < 0 ? 'Count the squares across to the other point. Going left counts as negative.' : 'Count the squares across to the other point.',
    change: (frame, step) => ({
      ...frame, marks: [mark('x', a.x), mark('x', b.x)],
      points: (frame.points ?? []).map(p => ({ ...p, label: '' })),
      legs: [...(frame.legs ?? []), { from: a, to: pt(b.x, a.y), label: '', family: 1, at: step }],
      working: [...(frame.working ?? []), { text, family: 1, at: step }],
    }),
  }
}
/** Moves: then up (or down) to the second point, biro blue. */
const upTo = (a: GraphPoint, b: GraphPoint, subtract: boolean): GraphMove => {
  const n = b.y - a.y
  const text = subtract ? `up: ${show(b.y)} − ${bracket(a.y)} = ${show(n)}` : n < 0 ? `down ${show(-n)}` : `up ${show(n)}`
  return {
    title: n < 0 ? 'Then down' : 'Then up', equation: latex(text), adds: 'lines',
    say: subtract ? 'Take the first y from the second, in the same order.' : n < 0 ? 'Then count down to the point. Going down counts as negative.' : 'Then count up to the point.',
    change: (frame, step) => ({
      ...frame, marks: [mark('y', a.y), mark('y', b.y)],
      legs: [...(frame.legs ?? []), { from: pt(b.x, a.y), to: b, label: '', family: 0, at: step }],
      working: [...(frame.working ?? []), { text, family: 0, at: step }],
    }),
  }
}
/** The answer: up over across. */
const overAcross = (a: GraphPoint, b: GraphPoint): GraphMove => {
  const up = b.y - a.y, across = b.x - a.x
  const down = up < 0 && across > 0
  return answerMove(`Gradient = ${show(up)} ÷ ${show(across)} = ${gradientText(a, b)}`, 'Up over across',
    down ? 'Divide the up by the across. The line goes down from left to right, so its gradient is negative.' : 'Divide the up by the across: how far the line goes up for every one square across.', [],
    { title: '', say: '', equation: '', adds: 'answer', change: frame => ({ ...frame, marks: shared([a, b]) }) })
}
/** Across, then up, then up over across. `given`: the points are named in the question (from two points). */
export function gradientMoves(a: GraphPoint, b: GraphPoint, { subtract = false, given = false } = {}) {
  return [pickTwo(a, b, given), acrossFrom(a, b, subtract), upTo(a, b, subtract), overAcross(a, b)]
}

/** A grid around two points (and 0), a square spare all round, for a gradient from two points. */
export function gridAround(a: GraphPoint, b: GraphPoint): GraphGrid {
  const xs = [a.x, b.x, 0], ys = [a.y, b.y, 0]
  return { x: [Math.min(...xs) - 1, Math.max(...xs) + 1], y: [Math.min(...ys) - 1, Math.max(...ys) + 1], lines: [{ from: a, to: b, at: -1 }], points: [] }
}

/** The usual slips on a gradient: across over up, the sign lost, only the up, or the two subtractions in different orders. */
export function gradientSlips(a: GraphPoint, b: GraphPoint): Slip[] {
  const up = b.y - a.y, across = b.x - a.x, right = up / across
  return [
    [across / up, 'That’s across ÷ up. The gradient is up over across: the up ÷ the across.'],
    [-right, right < 0 ? 'The line goes down from left to right, so its gradient is negative.' : 'The line goes up from left to right, so its gradient is positive.'],
    [up, `That’s only the up. Divide it by the across, ${show(across)}.`],
    [-across / up, 'That’s across ÷ up. The gradient is up over across.'],
  ]
}
