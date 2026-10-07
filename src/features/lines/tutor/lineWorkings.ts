import type { GraphPoint, GraphTable } from '../../written-methods/tutor/methodWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { lineKey, lineName } from '../../written-methods/tutor/LineBoard'
import { latex, readNumbers } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, bracket, draw, mark, pt, shared, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'

/*
 * The workings for Lines from coordinates (graphs lesson 2, GR1 and GR4), one move a step on the question's own grid
 * (GraphPictures.tsx): a line across or up and down is points that share one number, joined; a table of values puts
 * each x into the rule to get its y; plotting the table is lesson 1's "across, then up" for each column, then one
 * straight line through them all. x is amber and y biro blue everywhere: tables, brackets, working and axes.
 */

const show = (n: number) => String(n).replace('-', '−')
export const pair = (p: GraphPoint) => `(${show(p.x)}, ${show(p.y)})`

/** A straight-line rule, y = mx + c, with how it is written and said in words. */
export type Rule = { m: number; c: number; text: string; words: string }
export const rule = (m: number, c: number, text: string, words: string): Rule => ({ m, c, text, words })
export const yOf = (r: Rule, x: number) => r.m * x + r.c
/** The rule's sum at x, as it is written: "2 × (−1) − 1 = −3", "4 − 3 = 1", "½ × 4 + 1 = 3". */
export function sum(r: Rule, x: number) {
  const X = bracket(x), y = show(yOf(r, x))
  const constant = r.c ? ` ${r.c < 0 ? '−' : '+'} ${Math.abs(r.c)}` : ''
  if (r.text.includes('½')) return `½ × ${X}${constant} = ${y}`
  // A rule that starts with its number: 4 − x, 3 − x.
  if (/= \d+ − x$/.test(r.text)) return `${r.c} − ${X} = ${y}`
  const times = r.m === 1 ? X : r.m === -1 ? `−${X}` : `${show(r.m)} × ${X}`
  return `${times}${constant} = ${y}`
}
/** Two points of the rule's line, at x = 0 and x = 1, for drawing it and checking a line. */
export const through = (r: Rule): [GraphPoint, GraphPoint] => [pt(0, yOf(r, 0)), pt(1, yOf(r, 1))]

/* ---------- Lines across and up and down ---------- */

/** y = k is a line across; x = k is up and down. */
export type Straight = { axis: 'x' | 'y'; k: number }
export const across = (k: number): Straight => ({ axis: 'y', k })
export const upDown = (k: number): Straight => ({ axis: 'x', k })
export const named = (s: Straight) => `${s.axis} = ${show(s.k)}`
export const ends = (s: Straight): [GraphPoint, GraphPoint] => s.axis === 'y' ? [pt(0, s.k), pt(1, s.k)] : [pt(s.k, 0), pt(s.k, 1)]

/** Moves: three points that share the number, their shared number lit on its axis. */
export const sharing = (s: Straight, along: number[]): GraphMove => {
  const points = along.map(v => s.axis === 'y' ? pt(v, s.k) : pt(s.k, v))
  return {
    title: s.axis === 'y' ? `Points with y ${show(s.k)}` : `Points with x ${show(s.k)}`, equation: latex(points.map(pair).join(', ')), adds: 'picture',
    say: s.axis === 'y' ? `Every point on ${named(s)} has y ${show(s.k)}, whatever its x.` : `Every point on ${named(s)} has x ${show(s.k)}, whatever its y.`,
    change: (frame, step) => ({ ...frame, points: [...(frame.points ?? []), ...points.map(p => ({ ...p, at: step }))], marks: [mark(s.axis, s.k)] }),
  }
}
/** Moves: the answer, the points joined by one line, green, edge to edge. */
export const joinStraight = (s: Straight): GraphMove => {
  const [a, b] = ends(s)
  const line = { from: a, to: b, label: named(s) }
  return answerMove(named(s), 'Join them', s.axis === 'y' ? `y is ${show(s.k)} at every point, so the line goes straight across.` : `x is ${show(s.k)} at every point, so the line goes straight up and down.`,
    [], { ...draw(line, '', ''), change: (frame, step) => ({ ...frame, lines: [...(frame.lines ?? []), { ...line, at: step, answer: true }], points: (frame.points ?? []).map(p => ({ ...p, label: '' })) }) })
}
export const straightMoves = (s: Straight, along: number[]) => [sharing(s, along), joinStraight(s)]

/* ---------- A table of values ---------- */

/** The table with every y so far: `filled` columns have theirs. */
export const tableOf = (r: Rule, xs: number[], filled: number[] = []): GraphTable => ({ xs, ys: xs.map((x, i) => filled.includes(i) ? yOf(r, x) : null) })

/**
 * Moves: one column. Its x lights up, the sum goes under the grid (amber x in, blue y out), its y drops into the
 * table, and the point drops onto the grid. The last column's y is the answer, in green.
 */
export const column = (r: Rule, i: number, last = false): GraphMove => ({
  title: '', equation: '', adds: 'lines', say: '',
  change: (frame, step) => {
    const t = frame.table!, x = t.xs[i], y = yOf(r, x)
    return {
      ...frame, table: { ...t, ys: t.ys.map((v, j) => j === i ? y : v), lit: i, answer: last ? i : undefined },
      marks: [mark('x', x), mark('y', y)],
      points: [...(frame.points ?? []), { ...pt(x, y), at: step, label: '' }],
      working: [{ text: sum(r, x), family: 0, at: step }],
    }
  },
})
/** The moves for a whole table: x by x, then the answer. */
export function tableMoves(r: Rule, xs: number[]): GraphMove[] {
  return xs.map((x, i) => {
    const step = column(r, i, i === xs.length - 1)
    const say = i === 0 ? `Put the x into the rule: ${r.words}.` : `The same for x = ${show(x)}.`
    const base = { ...step, title: `x = ${show(x)}`, equation: latex(sum(r, x)), say }
    return i === xs.length - 1
      ? answerMove(xs.map(v => show(yOf(r, v))).join(', '), `x = ${show(x)}`, `${say} Every y is in the table.`, [], base)
      : base
  })
}

/* ---------- Plot and join ---------- */

/** Moves: one column of the table plotted, across then up as in lesson 1, its column lit. */
export const plotColumn = (r: Rule, i: number): GraphMove => ({
  title: '', equation: '', adds: 'picture', say: '',
  change: (frame, step) => {
    const t = frame.table!, p = pt(t.xs[i], yOf(r, t.xs[i]))
    const legs = [
      ...(p.x ? [{ from: pt(0, 0), to: pt(p.x, 0), label: '', family: 1, at: step }] : []),
      ...(p.y ? [{ from: pt(p.x, 0), to: p, label: '', family: 0, at: step }] : []),
    ]
    // Only the point being plotted has its brackets: the earlier ones are just dots (Sunny, 7 Oct: minimal).
    return { ...frame, table: { ...t, lit: i }, legs, marks: shared([p]), points: [...(frame.points ?? []).map(q => ({ ...q, label: '' })), { ...p, at: step }] }
  },
})
export function plotMoves(r: Rule, xs: number[]): GraphMove[] {
  const [a, b] = through(r)
  const join: GraphMove = answerMove(r.text, 'Join them', 'One straight line through every point, edge to edge. If one point is off the line, check that column’s sum.', [], {
    title: '', say: '', equation: '', adds: 'answer',
    change: (frame, step) => ({ ...frame, table: { ...frame.table!, lit: undefined }, legs: [], points: (frame.points ?? []).map(p => ({ ...p, label: '' })), lines: [...(frame.lines ?? []), { from: a, to: b, at: step, answer: true }] }),
  })
  return [
    ...xs.map((x, i) => ({ ...plotColumn(r, i), title: `Plot ${pair(pt(x, yOf(r, x)))}`, equation: latex(pair(pt(x, yOf(r, x)))), say: i === 0 ? 'Each column is a point. Across, then up, as in lesson 1.' : 'The next column: across, then up.' })),
    join,
  ]
}

/* ---------- Answers ---------- */

/** A line drawn on the board, checked as the line itself: any two of its points are right. */
export const lineAnswer = (a: GraphPoint, b: GraphPoint): InteractionDefinition => ({
  type: 'numericInput', acceptanceRule: 'numberList', correctAnswer: lineKey(a, b), displayAnswer: lineName(a, b) ?? 'the line', signed: true,
})
/** A number typed after "x =" or "y =", with either minus sign (numberList reads − and -). */
export const value = (n: number): InteractionDefinition => ({ type: 'numericInput', acceptanceRule: 'numberList', correctAnswer: String(n), signed: true })
/** A point, as "x, y", moved to on the graph board. */
export const at = (p: GraphPoint): InteractionDefinition => ({ type: 'numericInput', acceptanceRule: 'numberList', correctAnswer: `${p.x}, ${p.y}`, displayAnswer: pair(p), signed: true })

const parseLine = (response: string) => { const [a, b, c] = readNumbers(response); return a === undefined || b === undefined || c === undefined ? null : { a, b, c } }
/** Slips drawing a line across or up and down: the other way round, or through the wrong number. */
export function straightSlips(s: Straight) {
  return (response: string) => {
    const line = parseLine(response)
    if (!line) return null
    const across = line.a === 0, upDown = line.b === 0
    const k = across ? line.c / line.b : upDown ? line.c / line.a : null
    if (s.axis === 'y' && upDown) return k === s.k ? `${named(s)} goes across: every point has y ${show(s.k)}.` : `${named(s)} goes across, not up and down.`
    if (s.axis === 'x' && across) return k === s.k ? `${named(s)} goes up and down: every point has x ${show(s.k)}.` : `${named(s)} goes up and down, not across.`
    if (s.axis === 'y' && across && k !== s.k) return `Across means y stays the same. Every point needs y ${show(s.k)}.`
    if (s.axis === 'x' && upDown && k !== s.k) return `Up and down means x stays the same. Every point needs x ${show(s.k)}.`
    if (!across && !upDown) return `This line slopes. ${named(s)} is straight ${s.axis === 'y' ? 'across' : 'up and down'}.`
    return null
  }
}
/** Slips drawing a rule's line: one point plotted wrong makes a different line. */
export const ruleLineSlips = () => (response: string) => parseLine(response) ? 'A straight-line rule gives one straight line through every point in the table. Tap two of the table’s points.' : null
/** Slips putting x into a rule: a lost sign, or the rule's order. */
export function valueSlips(r: Rule, x: number, extra: [number, string][] = []) {
  const right = yOf(r, x)
  return (response: string) => {
    const [n] = readNumbers(response)
    if (n === undefined || n === right) return null
    const own = extra.find(([wrong]) => wrong === n)
    if (own) return own[1]
    if (x < 0 && n === r.m * -x + r.c) return 'Times a negative gives a negative.'
    if (n === -right) return 'Check the sign of your answer.'
    return null
  }
}
