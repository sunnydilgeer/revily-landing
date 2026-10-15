import type { GraphPoint } from '../../written-methods/tutor/methodWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { latex } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, bracket, mark, pt, shared, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'
import { matchLines, numberText, type Move } from '../../gradient/tutor/equationWorkings'
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

/** A rearranging step, its lines of working under the grid (purple, as in lesson 3): the move written out, then what it leaves. */
const moveLine = ([title, text, say]: Move): GraphMove => ({
  title, equation: latex(text.split('\n').at(-1)!), adds: 'lines', say,
  change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), ...text.split('\n').map(line => ({ text: line, family: 3, at: step }))] }),
})
const words = (frame: Parameters<GraphMove['change']>[0], step: number, lines: [string, number][]) => [...(frame.working ?? []), ...lines.map(([text, family]) => ({ text, family, at: step }))]

/** Moves: what solving by graph means, before any drawing (Sunny, 15 Oct: where does the answer come from?). */
const meaning: GraphMove = {
  title: 'What it means', equation: latex('the one point on both lines'), adds: 'lines',
  say: 'Simultaneous equations are both true at the same time, for the same x and y. Each one is a straight line, so the answer is the one point on both lines: where they cross.',
  change: (frame, step) => ({ ...frame, working: words(frame, step, [['Both equations are true at the same time, for the same x and y', 4], ['Each one is a line: we want the one point on both lines', 4]]) }),
}

/** Moves: one line drawn, named on the grid, c lit on the y axis. */
export const drawLine = (l: Line, title: string, say: string, label = named(l)): GraphMove => ({
  title, equation: latex(named(l)), adds: 'picture', say,
  change: (frame, step) => ({ ...frame, legs: [], lines: [...(frame.lines ?? []), { from: ends(l)[0], to: ends(l)[1], at: step, label }], marks: [mark('y', l.c)] }),
})
/**
 * Moves: drawing one line the lesson 3 way (Sunny, 15 Oct), a move a step: m and c matched to y = mx + c, c plotted
 * on the y axis, one step of the gradient from there, then the two joined edge to edge.
 */
function drawSteps(l: Line, which: string, label = named(l)): GraphMove[] {
  const a = pt(0, l.c), b = pt(l.bottom, l.c + l.top), m = numberText(l.top, l.bottom)
  const way = `across ${l.bottom}, ${l.top < 0 ? 'down' : 'up'} ${Math.abs(l.top)}`
  return [
    {
      title: `Match the ${which} line to y = mx + c`, equation: latex(`m = ${m}, c = ${show(l.c)}`), adds: 'lines',
      say: `${named(l)} is y = mx + c with m = ${m} and c = ${show(l.c)}. m is the number in front of x; c is the number on its own.`,
      change: (frame, step) => ({ ...frame, legs: [], working: words(frame, step, matchLines(l.top, l.bottom, l.c).slice(1).map(text => [text, 4] as [string, number])) }),
    },
    {
      title: 'Plot c on the y axis', equation: latex(pair(a)), adds: 'picture',
      say: `c is where the line crosses the y axis: ${pair(a)}.`,
      change: (frame, step) => ({ ...frame, marks: [mark('y', l.c)], working: words(frame, step, [[`c = ${show(l.c)}: start at ${pair(a)}`, 0]]) }),
    },
    {
      title: 'Step the gradient', equation: latex(pair(b)), adds: 'picture',
      say: `The gradient is ${m}: from c, ${way}. That lands on ${pair(b)}.`,
      change: (frame, step) => ({
        ...frame, marks: shared([b]),
        legs: [{ from: a, to: pt(b.x, a.y), label: show(l.bottom), family: 1, at: step }, { from: pt(b.x, a.y), to: b, label: show(Math.abs(l.top)), family: 0, at: step }],
        points: [...(frame.points ?? []), { ...b, at: step }],
        working: words(frame, step, [[`m = ${m}: ${way}, which lands on ${pair(b)}`, 3]]),
      }),
    },
    drawLine(l, 'Join them', 'Join the two points with one straight line, right across the grid.', label),
  ]
}

/** Moves: where the lines cross, ringed: the one point on both. */
export const findCrossing = (p: GraphPoint): GraphMove => ({
  title: 'Find where the lines cross', equation: latex(pair(p)), adds: 'picture',
  say: 'The lines cross at one point. It is the only point on both lines, so it is the answer.',
  change: (frame, step) => ({
    ...frame, legs: [], boxed: [p], marks: [],
    // Its brackets go on the side away from both axes, clear of the reading lines running to them.
    points: [...(frame.points ?? []).map(q => ({ ...q, label: '' })), { ...p, at: step, place: { dx: p.x < 0 ? -1 : 1, dy: p.y < 0 ? 1 : -1 } }],
    working: words(frame, step, [['The lines cross here: the one point on both lines', 4]]),
  }),
})
/** Moves: its x, read straight down (or up) to the x axis. */
const readX = (p: GraphPoint): GraphMove => ({
  title: 'Read x', equation: latex(`x = ${show(p.x)}`), adds: 'picture',
  say: 'Go straight down (or up) from the crossing to the x axis, and read the number there.',
  change: (frame, step) => ({
    ...frame, marks: [mark('x', p.x)],
    legs: p.y ? [{ from: p, to: pt(p.x, 0), label: '', family: 1, at: step, dashed: true }] : [],
    working: words(frame, step, [[`Straight down to the x axis: x = ${show(p.x)}`, 1]]),
  }),
})
/** Moves: its y, read straight across to the y axis. */
const readY = (p: GraphPoint): GraphMove => ({
  title: 'Read y', equation: latex(`y = ${show(p.y)}`), adds: 'picture',
  say: 'Go straight across from the crossing to the y axis, and read the number there.',
  change: (frame, step) => ({
    ...frame, marks: shared([p]),
    legs: [...(frame.legs ?? []), ...(p.x ? [{ from: p, to: pt(0, p.y), label: '', family: 0, at: step, dashed: true }] : [])],
    working: words(frame, step, [[`Straight across to the y axis: y = ${show(p.y)}`, 0]]),
  }),
})
/** Moves: the crossing put into both equations: each gives the same y, so it is on both lines. */
export const checkBoth = (a: Line, b: Line, p: GraphPoint, labels?: [string, string]): GraphMove => ({
  title: 'Check in both', equation: latex(`${sum(a, p.x)}, ${sum(b, p.x)}`), adds: 'lines',
  say: `Put x = ${show(p.x)} into both equations. Both give y = ${show(p.y)}, so ${pair(p)} is on both lines.`,
  change: (frame, step) => ({
    ...frame, marks: shared([p]), legs: [],
    working: words(frame, step, [[`Put x = ${show(p.x)} into each. Both should give y = ${show(p.y)}`, 4], [`${labels?.[0] ?? named(a)}: ${sum(a, p.x)} ✓`, 2], [`${labels?.[1] ?? named(b)}: ${sum(b, p.x)} ✓`, 2]]),
  }),
})
/** The answer, written once: x = 2, y = 1. */
export const solution = (p: GraphPoint): GraphMove =>
  answerMove(`x = ${show(p.x)}, y = ${show(p.y)}`, 'The solution', 'The x and y where the lines cross make both equations true at the same time.', [], {
    title: '', say: '', equation: '', adds: 'answer',
    change: frame => ({ ...frame, marks: shared([p]), points: (frame.points ?? []).map(q => q.x === p.x && q.y === p.y ? { ...q, answer: true } : q) }),
  })

/**
 * Solving by graph, a move a step: what it means; for each line not on the grid yet, rearrange it where needed
 * (`moves`), match it to y = mx + c, plot c, step the gradient and join; then find where the lines cross, read x, read
 * y, check in both, and the answer. `given` lines are already on the grid (the question drew them).
 */
export function solveMoves(a: Line, b: Line, { movesA = [], movesB = [], given = 0, labels }: { movesA?: Move[]; movesB?: Move[]; given?: 0 | 1 | 2; labels?: [string, string] } = {}): GraphMove[] {
  const p = crossing(a, b)
  return [
    meaning,
    ...(given < 1 ? [...movesA.map(moveLine), ...drawSteps(a, 'first', labels?.[0])] : []),
    ...(given < 2 ? [...movesB.map(moveLine), ...drawSteps(b, given === 1 ? 'other' : 'second', labels?.[1])] : []),
    findCrossing(p), readX(p), readY(p),
    checkBoth(a, b, p, labels),
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
