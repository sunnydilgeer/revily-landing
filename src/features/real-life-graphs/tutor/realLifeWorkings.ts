import type { GraphPoint } from '../../written-methods/tutor/methodWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { latex, readNumbers } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, mark, pt, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'

/*
 * The workings for Real-life graphs (graphs lesson 8, GR9), one move a step on the question's own graph: an amount
 * across (amber) and an amount up (biro blue), each square worth its axis's step. A value is read up (or across) to the
 * line, then across (or down) to the other axis, with dashed reading lines. The gradient is a rate: the amount up for
 * each one across (litres a minute, £ a day). Where the line starts on the up axis is a fixed charge, paid before any.
 */

const show = (n: number) => String(Math.round(n * 1000) / 1000).replace('-', '−')

/** How an axis writes its amounts: "£" before, " litres" after. */
export type Amount = { before?: string; after?: string; name: string; per: number }
export const amountText = (a: Amount, n: number) => `${a.before ?? ''}${show(n)}${a.after ?? ''}`
/** A straight line y = mx + c, in the graph's own amounts, and its name. */
export type Line = { m: number; c: number; name?: string }
export const yOf = (l: Line, x: number) => l.m * x + l.c
export const xOf = (l: Line, y: number) => (y - l.c) / l.m
/** The part of the line on the graph, from the axes to the grid's edge: real amounts aren't below 0. */
export function onGraph(l: Line, xEnd: number, yEnd: number): [GraphPoint, GraphPoint] {
  const from = l.c >= 0 ? pt(0, l.c) : pt(xOf(l, 0), 0)
  const atEdge = yOf(l, xEnd)
  const to = atEdge > yEnd ? pt(xOf(l, yEnd), yEnd) : atEdge < 0 ? pt(xOf(l, 0), 0) : pt(xEnd, atEdge)
  return [from, to]
}

/** The graph: across from 0 to `xEnd` (`x` the amount), up from 0 to `yEnd`, the question's lines drawn on it. */
export function rlGrid(x: Amount, xEnd: number, y: Amount, yEnd: number, lines: Line[] = []): GraphGrid {
  return {
    x: [-x.per, xEnd], y: [-y.per, yEnd], points: [],
    scale: { x: { per: x.per, start: 0, name: x.name }, y: { per: y.per, start: 0, name: y.name } },
    lines: lines.map(l => { const [from, to] = onGraph(l, xEnd, yEnd); return { from, to, at: -1, label: l.name, segment: true } }),
  }
}

const reading = (p: GraphPoint, step: number) => [
  ...(p.y ? [{ from: p, to: pt(p.x, 0), label: '', family: 1, at: step, dashed: true }] : []),
  ...(p.x ? [{ from: p, to: pt(0, p.y), label: '', family: 0, at: step, dashed: true }] : []),
]
/** Moves: from an amount across, up to the line, then across to read the other amount. */
export function readUp(l: Line, xa: Amount, ya: Amount, x: number, title?: string): GraphMove {
  const p = pt(x, yOf(l, x))
  return answerMove(amountText(ya, p.y), title ?? `Up from ${amountText(xa, x)}`, `Up from ${amountText(xa, x)} to the line, then across to the ${ya.name} axis: ${amountText(ya, p.y)}.`, [], {
    title: '', say: '', equation: '', adds: 'picture',
    change: (frame, step) => ({ ...frame, boxed: [p], marks: [mark('x', p.x), mark('y', p.y)], legs: reading(p, step), points: [...(frame.points ?? []), { ...p, at: step, label: '' }] }),
  })
}
/** Moves: from an amount up the side, across to the line, then down to read the other amount. */
export function readAcross(l: Line, xa: Amount, ya: Amount, y: number): GraphMove {
  const p = pt(xOf(l, y), y)
  return answerMove(amountText(xa, p.x), `Across from ${amountText(ya, y)}`, `Across from ${amountText(ya, y)} to the line, then down to the ${xa.name} axis: ${amountText(xa, p.x)}.`, [], {
    title: '', say: '', equation: '', adds: 'picture',
    change: (frame, step) => ({ ...frame, boxed: [p], marks: [mark('x', p.x), mark('y', p.y)], legs: reading(p, step), points: [...(frame.points ?? []), { ...p, at: step, label: '' }] }),
  })
}
/** Moves: an amount off the graph, read as a smaller one that's on it, then multiplied up. */
export function scaleUpMoves(l: Line, xa: Amount, ya: Amount, x: number, times: number): GraphMove[] {
  const small = x / times, p = pt(small, yOf(l, small))
  return [
    {
      title: `Read ${amountText(xa, small)}`, equation: latex(`${amountText(xa, small)} = ${amountText(ya, p.y)}`), adds: 'picture',
      say: `${amountText(xa, x)} is off the graph, but ${amountText(xa, x)} is ${times} lots of ${amountText(xa, small)}. Read ${amountText(xa, small)}: up to the line and across.`,
      change: (frame, step) => ({ ...frame, boxed: [p], marks: [mark('x', p.x), mark('y', p.y)], legs: reading(p, step), points: [{ ...p, at: step, label: '' }], working: [{ text: `${amountText(xa, small)} = ${amountText(ya, p.y)}`, family: 0, at: step }] }),
    },
    answerMove(amountText(ya, p.y * times), `× ${times}`, `${times} times as much: ${amountText(ya, p.y)} × ${times} = ${amountText(ya, p.y * times)}.`, [], {
      title: '', say: '', equation: '', adds: 'lines',
      change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), { text: `${amountText(xa, x)} = ${amountText(ya, p.y)} × ${times} = ${amountText(ya, p.y * times)}`, family: 3, at: step }] }),
    }),
  ]
}
/** Moves: the rate, the line's gradient: the amount across (amber), the amount up or down (biro blue), up ÷ across. */
export function rateMoves(a: GraphPoint, b: GraphPoint, xa: Amount, ya: Amount, rate: string): GraphMove[] {
  const across = b.x - a.x, up = b.y - a.y, turn = pt(b.x, a.y), r = Math.abs(up) / across
  return [
    {
      title: 'Across', equation: latex(amountText(xa, across)), adds: 'lines', say: `Two points on the line. Across from one to the other: ${amountText(xa, across)}.`,
      change: (frame, step) => ({
        ...frame, boxed: [a, b], marks: [mark('x', a.x), mark('x', b.x)], points: [...(frame.points ?? []), { ...a, at: step, label: '' }, { ...b, at: step, label: '' }],
        legs: [{ from: a, to: turn, label: amountText(xa, across), family: 1, at: step }], working: [{ text: `across: ${amountText(xa, across)}`, family: 1, at: step }],
      }),
    },
    {
      title: up < 0 ? 'Down' : 'Up', equation: latex(amountText(ya, Math.abs(up))), adds: 'lines', say: `${up < 0 ? 'Down' : 'Up'} from one to the other: ${amountText(ya, Math.abs(up))}.`,
      change: (frame, step) => ({
        ...frame, marks: [mark('y', a.y), mark('y', b.y)], legs: [...(frame.legs ?? []), { from: turn, to: b, label: amountText(ya, Math.abs(up)), family: 0, at: step }],
        working: [...(frame.working ?? []), { text: `${up < 0 ? 'down' : 'up'}: ${amountText(ya, Math.abs(up))}`, family: 0, at: step }],
      }),
    },
    answerMove(`${show(r)} ${rate}`, 'The rate', `The gradient is a rate: ${show(Math.abs(up))} ÷ ${show(across)} = ${show(r)} ${rate}.${up < 0 ? ' The line goes down, so the amount is falling.' : ''}`, [], {
      title: '', say: '', equation: '', adds: 'lines',
      change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), { text: `${show(Math.abs(up))} ÷ ${show(across)} = ${show(r)} ${rate}`, family: 3, at: step }] }),
    }),
  ]
}
/** Moves: where the line starts on the up axis: what is paid before any time or amount. */
export const fixedMove = (l: Line, ya: Amount, say = 'Where the line starts, at 0 across, is paid before anything else: the fixed charge.'): GraphMove => ({
  title: 'Where it starts', equation: latex(amountText(ya, l.c)), adds: 'picture', say,
  change: (frame, step) => ({ ...frame, boxed: [pt(0, l.c)], marks: [mark('y', l.c)], points: [...(frame.points ?? []), { ...pt(0, l.c), at: step, label: '' }], working: [{ text: `fixed charge: ${amountText(ya, l.c)}`, family: 0, at: step }] }),
})
/** Moves: the line drawn from its fixed charge, one step of its rate at a time. */
export function drawLineMoves(l: Line, xa: Amount, ya: Amount, steps: number, xEnd: number, yEnd: number): GraphMove[] {
  const b = pt(steps, yOf(l, steps)), [a, edge] = onGraph(l, xEnd, yEnd)
  return [
    fixedMove(l, ya, `Before any ${xa.name}, it costs ${amountText(ya, l.c)}: the line starts there on the ${ya.name} axis.`),
    answerMove(`${amountText(ya, l.c)}, then ${amountText(ya, l.m)} for each ${xa.name.replace(/s$/, '')}`, `${amountText(ya, l.m)} for each ${xa.name.replace(/s$/, '')}`,
      `Each ${xa.name.replace(/s$/, '')} adds ${amountText(ya, l.m)}: after ${steps}, ${amountText(ya, l.c)} + ${steps} × ${amountText(ya, l.m)} = ${amountText(ya, b.y)}. Join them with a ruler.`, [], {
        title: '', say: '', equation: '', adds: 'picture',
        change: (frame, step) => ({ ...frame, marks: [mark('x', b.x), mark('y', b.y)], points: [...(frame.points ?? []), { ...b, at: step, label: '' }], lines: [...(frame.lines ?? []), { from: a, to: edge, at: step, answer: true, segment: true }] }),
      }),
  ]
}
/** Moves: where two lines cross, read down and across: the amount where both cost the same. */
export function crossMoves(p: GraphPoint, xa: Amount, ya: Amount): GraphMove[] {
  return [answerMove(`${amountText(xa, p.x)}`, 'Where they cross', `Where the lines cross they cost the same: down to ${amountText(xa, p.x)}, across to ${amountText(ya, p.y)}.`, [], {
    title: '', say: '', equation: '', adds: 'picture',
    change: (frame, step) => ({ ...frame, boxed: [p], marks: [mark('x', p.x), mark('y', p.y)], legs: reading(p, step), points: [{ ...p, at: step, answer: true, label: '' }] }),
  })]
}

/* ---------- Answers ---------- */

/** An amount typed, any way of writing it (25, 25.0, 12.5). */
export const amount = (n: number, shown: string): InteractionDefinition => ({
  type: 'numericInput', acceptanceRule: 'openInterval', lowerBound: n - 1e-6, upperBound: n + 1e-6, correctAnswer: n, displayAnswer: shown, signed: true,
})
/** A point tapped on the graph. */
export const at = (p: GraphPoint, shown: string): InteractionDefinition => ({ type: 'numericInput', acceptanceRule: 'numberList', correctAnswer: `${p.x}, ${p.y}`, displayAnswer: shown, signed: true })
/** A number's slips: each a wrong answer and what it means. */
export const slips = (list: [number, string][]) => (response: string) => {
  const [n] = readNumbers(response)
  return n === undefined ? null : list.find(([wrong]) => Math.abs(wrong - n) < 1e-6)?.[1] ?? null
}
