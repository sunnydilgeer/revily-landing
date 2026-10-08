import type { GraphPoint } from '../../written-methods/tutor/methodWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { latex } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, bracket, mark, pt, shared, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'
import { numberText, type Move } from '../../gradient/tutor/equationWorkings'
import { ends, gradientOf, mText, named, type Line } from '../../parallel-lines/tutor/parallelWorkings'

/*
 * The workings for Simultaneous equations by graph (graphs lesson 5, GR7), one move a step on the question's own
 * grid: each equation is a straight line (made y = mx + c first if it isn't, then drawn from c and a step of its
 * gradient, as in lesson 3); the solution is where they cross, the one point on both lines. Its x is read down to the
 * x axis (amber) and its y across to the y axis (biro blue), then checked in both equations, then written once.
 */

const show = (n: number) => String(n).replace('-', '−')
export const pair = (p: GraphPoint) => `(${show(p.x)}, ${show(p.y)})`
export const yOf = (l: Line, x: number) => gradientOf(l) * x + l.c
/** Where two lines cross. */
export function crossing(a: Line, b: Line): GraphPoint {
  const x = (b.c - a.c) / (gradientOf(a) - gradientOf(b))
  return pt(x, yOf(a, x))
}

/** The line's sum at x, as it is written: "2 × 2 − 1 = 3", "−2 + 5 = 3", "½ × 4 + 1 = 3". */
export function sum(l: Line, x: number) {
  const m = gradientOf(l), X = bracket(x)
  const times = m === 1 ? show(x) : m === -1 ? `−${X}` : `${mText(l)} × ${X}`
  const constant = l.c ? ` ${l.c < 0 ? '−' : '+'} ${numberText(Math.round(Math.abs(l.c) * 6), 6)}` : ''
  return `${times}${constant} = ${show(yOf(l, x))}`
}

/** A rearranging step, its line of working under the grid (purple, as in lessons 3 and 4). */
const moveLine = ([title, text, say]: Move): GraphMove => ({
  title, equation: latex(text), adds: 'lines', say,
  change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), { text, family: 3, at: step }] }),
})

/** Moves: one line drawn, named on the grid, c lit on the y axis. */
export const drawLine = (l: Line, title: string, say: string, label = named(l)): GraphMove => ({
  title, equation: latex(named(l)), adds: 'picture', say,
  change: (frame, step) => ({ ...frame, lines: [...(frame.lines ?? []), { from: ends(l)[0], to: ends(l)[1], at: step, label }], marks: [mark('y', l.c)] }),
})
/** Says how to draw a line from y = mx + c: c, then a step of the gradient. */
export const howToDraw = (l: Line) => {
  const m = gradientOf(l)
  const step = l.bottom === 1 ? `across 1, ${m < 0 ? 'down' : 'up'} ${show(Math.abs(m))}` : `across ${l.bottom}, ${l.top < 0 ? 'down' : 'up'} ${Math.abs(l.top)}`
  return `Start at ${show(l.c)} on the y axis, then step the gradient: ${step}. Join them, edge to edge.`
}

/** Moves: where the lines cross, ringed, read down to the x axis and across to the y axis. */
export const readCrossing = (p: GraphPoint): GraphMove => ({
  title: 'Where they cross', equation: latex(pair(p)), adds: 'picture',
  say: 'The solution is the point on both lines: where they cross. Read its x down on the x axis and its y across on the y axis.',
  change: (frame, step) => ({
    ...frame, boxed: [p], marks: shared([p]),
    // Its brackets go on the side away from both axes, clear of the reading lines running to them.
    points: [...(frame.points ?? []), { ...p, at: step, place: { dx: p.x < 0 ? -1 : 1, dy: p.y < 0 ? 1 : -1 } }],
    legs: [
      ...(p.y ? [{ from: p, to: pt(p.x, 0), label: '', family: 1, at: step, dashed: true }] : []),
      ...(p.x ? [{ from: p, to: pt(0, p.y), label: '', family: 0, at: step, dashed: true }] : []),
    ],
  }),
})
/** Moves: the crossing put into both equations: each gives the same y, so it is on both lines. */
export const checkBoth = (a: Line, b: Line, p: GraphPoint): GraphMove => ({
  title: 'Check in both', equation: latex(`${sum(a, p.x)}, ${sum(b, p.x)}`), adds: 'lines',
  say: `Put x = ${show(p.x)} into both equations. Both give y = ${show(p.y)}, so ${pair(p)} is on both lines.`,
  change: (frame, step) => ({
    ...frame, marks: shared([p]), legs: [],
    working: [...(frame.working ?? []), { text: `${named(a)}: ${sum(a, p.x)} ✓`, family: 0, at: step }, { text: `${named(b)}: ${sum(b, p.x)} ✓`, family: 0, at: step }],
  }),
})
/** The answer, written once: x = 2, y = 1. */
export const solution = (p: GraphPoint): GraphMove =>
  answerMove(`x = ${show(p.x)}, y = ${show(p.y)}`, 'The solution', 'The x and y where the lines cross make both equations true at the same time.', [], {
    title: '', say: '', equation: '', adds: 'answer',
    change: frame => ({ ...frame, marks: shared([p]), points: (frame.points ?? []).map(q => q.x === p.x && q.y === p.y ? { ...q, answer: true } : q) }),
  })

/**
 * Solving by graph: rearrange where needed (`moves`, each line's own), draw each line, read where they cross, check it
 * in both, then the answer. `given` lines are already on the grid (the question drew them).
 */
export function solveMoves(a: Line, b: Line, { movesA = [], movesB = [], given = 0, labels }: { movesA?: Move[]; movesB?: Move[]; given?: 0 | 1 | 2; labels?: [string, string] } = {}): GraphMove[] {
  const p = crossing(a, b)
  return [
    ...(given < 1 ? [...movesA.map(moveLine), drawLine(a, 'Draw the first line', howToDraw(a), labels?.[0])] : []),
    ...(given < 2 ? [...movesB.map(moveLine), drawLine(b, given === 1 ? 'Draw the line' : 'Draw the second', howToDraw(b), labels?.[1])] : []),
    readCrossing(p),
    checkBoth(a, b, p),
    solution(p),
  ]
}

/** A grid with the question's own lines on it, named. */
export function gridWith(lines: [Line, string?][], x: [number, number], y: [number, number]): GraphGrid {
  return { x, y, lines: lines.map(([l, label]) => ({ from: ends(l)[0], to: ends(l)[1], at: -1, label: label ?? named(l) })), points: [] }
}

/** The answer typed as two boxes, "x = ☐, y = ☐". */
export const xy = (p: GraphPoint): InteractionDefinition => ({
  type: 'numericInput', responseShape: 'list', listJoiner: ',', listLabels: ['x =', 'y ='], acceptanceRule: 'numberList',
  correctAnswer: `${p.x}, ${p.y}`, displayAnswer: `x = ${show(p.x)}, y = ${show(p.y)}`, signed: true,
})
/** Slips reading a crossing: x and y swapped, or a point on only one of the lines. */
export function crossingSlips(a: Line, b: Line) {
  const p = crossing(a, b)
  return (response: string) => {
    const [x, y] = response.replace(/−/g, '-').split(',').map(Number)
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null
    if (x === p.y && y === p.x && x !== y) return 'That’s y then x. Read x first, down on the x axis.'
    const onA = Math.abs(yOf(a, x) - y) < 1e-9, onB = Math.abs(yOf(b, x) - y) < 1e-9
    if (onA !== onB) return `That point is on ${onA ? named(a) : named(b)} only. The solution is on both lines: where they cross.`
    return null
  }
}
