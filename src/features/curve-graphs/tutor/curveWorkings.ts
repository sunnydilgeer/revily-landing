import type { GraphPoint, GraphTable } from '../../written-methods/tutor/methodWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { latex, readNumbers } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, mark, pt, shared, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'
import { coefficients, pointsKey, polySum, terms, valueAt, type Poly } from '../../written-methods/tutor/curves'

/*
 * The workings for Quadratic and cubic graphs (graphs lesson 6, GR6), one move a step on the question's own grid, as
 * in lesson 2: a table of values puts each x into the rule (a negative x in brackets, so its square is positive and its
 * cube negative), each column is a point, and the points are joined with one smooth curve, not a ruler. x is amber and
 * y biro blue everywhere: tables, brackets, working and axes.
 */

const show = (n: number) => String(n).replace('-', '−')
export const pair = (p: GraphPoint) => `(${show(p.x)}, ${show(p.y)})`

/** A curve's rule: how it is written, "y = x² − 3", and its numbers [constant, x, x², x³]. */
export type Curve = { text: string; coeffs: Poly }
export const curve = (text: string): Curve => ({ text, coeffs: coefficients(text) })
export const yOf = (c: Curve, x: number) => valueAt(c.coeffs, x)
export const sum = (c: Curve, x: number) => polySum(c.text, x)
/** Its highest power: 2 for a quadratic, 3 for a cubic. */
export const degree = (c: Curve) => Math.max(...terms(c.text).map(t => t.power))

/** The table with every y so far: `filled` columns have theirs. */
export const tableOf = (c: Curve, xs: number[], filled: number[] = []): GraphTable => ({ xs, ys: xs.map((x, i) => filled.includes(i) ? yOf(c, x) : null), rule: c.text.replace(/^y = /, '') })
const all = (xs: number[]) => xs.map((_, i) => i)
/** The curve drawn across the table, from its first x to its last. */
export const drawn = (c: Curve, xs: number[], at: number, answer = false) => ({ coeffs: c.coeffs, from: Math.min(...xs), to: Math.max(...xs), at, answer })

/* ---------- A table of values ---------- */

/**
 * Moves: one column. Its x lights up, the sum goes under the grid (amber x in, blue y out), its y drops into the
 * table, and the point drops onto the grid.
 */
export const column = (c: Curve, i: number, last = false): GraphMove => ({
  title: '', equation: '', adds: 'lines', say: '',
  change: (frame, step) => {
    const t = frame.table!, x = t.xs[i], y = yOf(c, x)
    return {
      ...frame, table: { ...t, ys: t.ys.map((v, j) => j === i ? y : v), lit: i, answer: last ? i : undefined },
      marks: [mark('x', x), mark('y', y)],
      points: [...(frame.points ?? []), { ...pt(x, y), at: step, label: '' }],
      working: [{ text: sum(c, x), family: 0, at: step }],
    }
  },
})
/** What putting a negative x in needs: its square is positive, its cube negative. */
const negativeNote = (c: Curve, x: number) => x >= 0 ? '' : degree(c) === 3
  ? ` (${show(x)})³ = ${show(x)} × ${show(x)} × ${show(x)} = ${show(x ** 3)}: a negative cubed is negative.`
  : ` (${show(x)})² = ${show(x)} × ${show(x)} = ${show(x * x)}: a negative squared is positive.`
/** The moves for a whole table: x by x, then every y is in. */
export function tableMoves(c: Curve, xs: number[]): GraphMove[] {
  return xs.map((x, i) => {
    const step = column(c, i, i === xs.length - 1)
    const say = i === 0 ? `Put the x into the rule, in brackets.${negativeNote(c, x)}` : x < 0 ? `The same for x = ${show(x)}.${negativeNote(c, x)}` : `The same for x = ${show(x)}.`
    const base = { ...step, title: `x = ${show(x)}`, equation: latex(sum(c, x)), say }
    return i === xs.length - 1 ? answerMove(xs.map(v => show(yOf(c, v))).join(', '), `x = ${show(x)}`, `${say} Every y is in the table.`, [], base) : base
  })
}
/** Moves: one column worked out, the others already there; its y is the answer. */
export function columnMoves(c: Curve, i: number, x: number): GraphMove[] {
  return [answerMove(`y = ${show(yOf(c, x))}`, `x = ${show(x)}`, `Put x = ${show(x)} into the rule, in brackets.${negativeNote(c, x)}`, [], column(c, i, true))]
}
/** The grid with every column but `i` filled in and plotted. */
export function columnGrid(c: Curve, xs: number[], i: number, x: [number, number], y: [number, number]): GraphGrid {
  const others = all(xs).filter(j => j !== i)
  return { x, y, lines: [], points: others.map(j => ({ ...pt(xs[j], yOf(c, xs[j])), at: -1, label: '' })), table: tableOf(c, xs, others) }
}

/* ---------- Plot and join ---------- */

/** Moves: the first column plotted, across then up as in lesson 1; then the rest; then one smooth curve through them all. */
export function plotMoves(c: Curve, xs: number[]): GraphMove[] {
  const first = pt(xs[0], yOf(c, xs[0])), rest = xs.slice(1).map(x => pt(x, yOf(c, x)))
  return [
    {
      title: `Plot ${pair(first)}`, equation: latex(pair(first)), adds: 'picture', say: 'Each column is a point. Across, then up or down, as in lesson 1.',
      change: (frame, step) => ({
        ...frame, table: { ...frame.table!, lit: 0 }, marks: shared([first]),
        legs: [...(first.x ? [{ from: pt(0, 0), to: pt(first.x, 0), label: '', family: 1, at: step }] : []), ...(first.y ? [{ from: pt(first.x, 0), to: first, label: '', family: 0, at: step }] : [])],
        points: [...(frame.points ?? []), { ...first, at: step }],
      }),
    },
    {
      title: 'Plot the rest', equation: latex(rest.map(pair).join(', ')), adds: 'picture', say: 'The same for every other column: one point each.',
      change: (frame, step) => ({ ...frame, table: { ...frame.table!, lit: undefined }, legs: [], points: [...(frame.points ?? []).map(p => ({ ...p, label: '' })), ...rest.map(p => ({ ...p, at: step, label: '' }))] }),
    },
    joinMove(c, xs),
  ]
}
/** Moves: the answer, one smooth curve through every point, green. */
export const joinMove = (c: Curve, xs: number[]): GraphMove => answerMove(c.text, 'Join with a smooth curve', degree(c) === 3
  ? 'Join them with one smooth curve, freehand, not with a ruler: up, down and up again, an S. If a point is off the curve, check that column’s sum.'
  : yOf(c, xs[0]) > yOf(c, xs[Math.floor(xs.length / 2)])
    ? 'Join them with one smooth curve, freehand, not with a ruler. A positive x² makes a U shape. If a point is off the curve, check that column’s sum.'
    : 'Join them with one smooth curve, freehand, not with a ruler. A negative x² makes an upside-down U. If a point is off the curve, check that column’s sum.', [], {
  title: '', say: '', equation: '', adds: 'answer',
  change: (frame, step) => ({ ...frame, legs: [], table: frame.table && { ...frame.table, lit: undefined, answer: undefined }, points: (frame.points ?? []).map(p => ({ ...p, label: '' })), curves: [...(frame.curves ?? []), drawn(c, xs, step, true)] }),
})
/** The whole table, worked out and plotted: x by x, then plot, then join (a worked example). */
export function fullMoves(c: Curve, xs: number[]): GraphMove[] {
  const [head, ...rest] = xs
  return [
    { ...column(c, 0), title: `x = ${show(head)}`, equation: latex(sum(c, head)), say: `Put each x into the rule, in brackets.${negativeNote(c, head)}` },
    {
      title: 'The rest of the table', equation: latex(rest.map(x => show(yOf(c, x))).join(', ')), adds: 'lines', say: 'The same for every other x. Each column is a point.',
      change: (frame, step) => ({
        ...frame, table: { ...frame.table!, ys: xs.map(x => yOf(c, x)), lit: undefined }, marks: undefined,
        points: [...(frame.points ?? []), ...rest.map(x => ({ ...pt(x, yOf(c, x)), at: step, label: '' }))],
        working: rest.filter(x => x < 0).slice(0, 1).map(x => ({ text: sum(c, x), family: 0, at: step })),
      }),
    },
    joinMove(c, xs),
  ]
}

/* ---------- Reading a curve ---------- */

/** Moves: a point on the curve ringed and read, x down to the x axis (amber) and y across (biro blue), as the answer. */
export const readPoint = (p: GraphPoint, title: string, say: string, extra: string[] = []): GraphMove => answerMove(pair(p), title, say, [], {
  title: '', say: '', equation: '', adds: 'picture',
  change: (frame, step) => ({
    ...frame, boxed: [p], marks: shared([p]),
    points: [...(frame.points ?? []), { ...p, at: step, answer: true, place: { dx: p.x < 0 ? -1 : 1, dy: 1 } }],
    legs: [...(p.y ? [{ from: p, to: pt(p.x, 0), label: '', family: 1, at: step, dashed: true }] : []), ...(p.x ? [{ from: p, to: pt(0, p.y), label: '', family: 0, at: step, dashed: true }] : [])],
    working: extra.map(text => ({ text, family: 0, at: step })),
  }),
})

/* ---------- Answers ---------- */

/** A y typed after "y =", either minus sign. */
export const value = (n: number): InteractionDefinition => ({ type: 'numericInput', acceptanceRule: 'numberList', correctAnswer: String(n), displayAnswer: `y = ${show(n)}`, signed: true })
/** A point tapped on the board. */
export const at = (p: GraphPoint): InteractionDefinition => ({ type: 'numericInput', acceptanceRule: 'numberList', correctAnswer: `${p.x}, ${p.y}`, displayAnswer: pair(p), signed: true })
/** Every column of the table plotted, in order across (CurveBoard.tsx). */
export const plotted = (c: Curve, xs: number[]): InteractionDefinition => ({
  type: 'numericInput', acceptanceRule: 'numberList', correctAnswer: pointsKey(xs.map(x => pt(x, yOf(c, x)))), displayAnswer: `${xs.length} points joined with a smooth curve`, signed: true,
})

/** The y with a negative x's square (or cube) given the wrong sign: (−2)² taken as −4, (−2)³ as 8. */
const signSlip = (c: Curve, x: number) => terms(c.text).reduce((s, t) => s + t.coef * (t.power >= 2 ? -(x ** t.power) : x ** t.power), 0)
/** The y with x² taken as 2x. */
const doubled = (c: Curve, x: number) => terms(c.text).reduce((s, t) => s + t.coef * (t.power === 2 ? 2 * x : x ** t.power), 0)
/** Slips putting x into a curve's rule: a square or cube's sign, x² as 2x, or a sign lost in the answer. */
export function valueSlips(c: Curve, x: number, extra: [number, string][] = []) {
  const right = yOf(c, x)
  return (response: string) => {
    const [n] = readNumbers(response)
    if (n === undefined || n === right) return null
    const own = extra.find(([wrong]) => wrong === n)
    if (own) return own[1]
    if (x < 0 && n === signSlip(c, x)) return terms(c.text).some(t => t.power === 3)
      ? `${show(x)} cubed is negative: (${show(x)}) × (${show(x)}) × (${show(x)}) = ${show(x ** 3)}.`
      : `(${show(x)})² is positive: (${show(x)}) × (${show(x)}) = ${show(x * x)}.`
    if (n === doubled(c, x)) return `x² means x × x, not 2 × x.`
    if (n === -right) return 'Check the sign of your answer.'
    return null
  }
}
/** Slips plotting a table: a dot in the wrong column or row, x and y swapped. */
export function plotSlips(c: Curve, xs: number[]) {
  return (response: string) => {
    const n = readNumbers(response)
    if (n.length !== xs.length * 2) return null
    const points = Array.from({ length: xs.length }, (_, i) => pt(n[2 * i], n[2 * i + 1]))
    const wrong = points.filter(p => !xs.some(x => x === p.x && yOf(c, x) === p.y))
    if (!wrong.length) return null
    if (points.map(p => p.x).join() !== xs.join()) return 'One point a column: each x in the table has one dot.'
    if (wrong.length === 1) return `The point at x = ${show(wrong[0].x)} is off: the table says y = ${show(yOf(c, wrong[0].x))}. Across first, then up or down.`
    return `${wrong.length} points are off. For each column go across to x first, then up or down to y.`
  }
}
