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
const words = (frame: Parameters<GraphMove['change']>[0], step: number, lines: [string, number][]) => [...(frame.working ?? []), ...lines.map(([text, family]) => ({ text, family, at: step }))]
/** An amount's number in a sum: "£5" keeps its £, "12" (litres) leaves the unit to the end. */
const inSum = (a: Amount, n: number) => a.before ? amountText(a, n) : show(n)
/** A money axis in words: "£" is pounds. */
const plural = (a: Amount) => ({ '£': 'pounds', '€': 'euros' } as Record<string, string>)[a.name] ?? a.name
/** Money per one, in pence too: €1.20. */
const rateText = (a: Amount, n: number) => a.before && !Number.isInteger(n) ? `${a.before}${n.toFixed(2)}` : amountText(a, n)
const one = (a: Amount) => plural(a).replace(/s$/, '')

/**
 * Moves: an amount off the graph, a move a step (Sunny, 15 Oct: what is × 10 doing?): it's off the graph; split it
 * into an amount you can read times a number; read that; times the reading by the same number; check by the rate.
 */
export function scaleUpMoves(l: Line, xa: Amount, ya: Amount, x: number, times: number, end: number): GraphMove[] {
  const small = x / times, p = pt(small, yOf(l, small)), big = p.y * times, X = amountText(xa, x), S = amountText(xa, small), Y = amountText(ya, p.y)
  return [
    {
      title: `${X} is off the graph`, equation: latex(`${X} > ${amountText(xa, end)}`), adds: 'lines',
      say: `The graph only goes up to ${amountText(xa, end)}, so ${X} can't be read straight off it.`,
      change: (frame, step) => ({ ...frame, working: words(frame, step, [[`${X} is off the graph: it only goes up to ${amountText(xa, end)}`, 4]]) }),
    },
    {
      title: 'Split it into an amount you can read', equation: latex(`${X} = ${S} × ${times}`), adds: 'lines',
      say: `${S} is on the graph, and ${X} is ${times} lots of ${S}.`,
      change: (frame, step) => ({ ...frame, working: words(frame, step, [[`${X} = ${S} × ${times}`, 4]]) }),
    },
    {
      title: `Read ${S}`, equation: latex(`${S} = ${Y}`), adds: 'picture',
      say: `Up from ${S} to the line, then across: ${Y}.`,
      change: (frame, step) => ({ ...frame, boxed: [p], marks: [mark('x', p.x), mark('y', p.y)], legs: reading(p, step), points: [{ ...p, at: step, label: '' }], working: words(frame, step, [[`${S} = ${Y}`, 0]]) }),
    },
    {
      title: `${times} times the ${plural(xa)} is ${times} times the ${plural(ya)}`, equation: latex(`${Y} × ${times} = ${amountText(ya, big)}`), adds: 'lines',
      say: `${X} is ${times} times ${S}, so it changes into ${times} times ${Y}: ${Y} × ${times} = ${amountText(ya, big)}.`,
      change: (frame, step) => ({ ...frame, working: words(frame, step, [[`${Y} × ${times} = ${amountText(ya, big)}`, 3]]) }),
    },
    answerMove(amountText(ya, big), 'Check it makes sense', `Each ${one(xa)} is worth ${rateText(ya, l.m)}, and ${show(x)} × ${show(l.m)} = ${amountText(ya, big)} too.`, [], {
      title: '', say: '', equation: '', adds: 'lines',
      change: (frame, step) => ({ ...frame, working: words(frame, step, [[`${Y} ÷ ${S} = ${rateText(ya, l.m)} per ${one(xa)}, and ${show(x)} × ${show(l.m)} = ${amountText(ya, big)} ✓`, 2]]) }),
    }),
  ]
}
/**
 * Moves: the rate, the line's gradient, a move a step (Sunny, 15 Oct: how does a student know to go across 10?): two
 * points read exactly, where the line crosses a grid corner; the amount across (amber); the amount up or down (biro
 * blue); up ÷ across; then a check halfway between them, and the rate as the answer.
 */
export function rateMoves(a: GraphPoint, b: GraphPoint, xa: Amount, ya: Amount, rate: string): GraphMove[] {
  const across = b.x - a.x, up = b.y - a.y, turn = pt(b.x, a.y), r = Math.abs(up) / across, way = up < 0 ? 'Down' : 'Up'
  const per = ya.before ? `${amountText(ya, r)} ${rate}` : `${show(r)} ${rate}`
  const half = across / 2, c = pt(a.x + half, a.y + up / 2)
  const sum = `${a.y ? `${inSum(ya, a.y)} ${up < 0 ? '−' : '+'} ` : ''}${show(half)} × ${inSum(ya, r)} = ${amountText(ya, c.y)}`
  return [
    {
      title: 'Pick two points you can read exactly', equation: latex(`(${show(a.x)}, ${show(a.y)}), (${show(b.x)}, ${show(b.y)})`), adds: 'picture',
      say: `Pick two points where the line crosses a grid corner, so both can be read exactly: (${show(a.x)}, ${show(a.y)}) and (${show(b.x)}, ${show(b.y)}).`,
      change: (frame, step) => ({
        ...frame, boxed: [a, b], marks: [mark('x', a.x), mark('x', b.x), mark('y', a.y), mark('y', b.y)], points: [...(frame.points ?? []), { ...a, at: step, label: '' }, { ...b, at: step, label: '' }],
        working: [{ text: `(${show(a.x)}, ${show(a.y)}) and (${show(b.x)}, ${show(b.y)}): the line crosses a grid corner at each`, family: 4, at: step }],
      }),
    },
    {
      title: 'Across', equation: latex(amountText(xa, across)), adds: 'picture', say: `Across from one point to the other: ${show(a.x)} to ${amountText(xa, b.x)} is ${amountText(xa, across)}.`,
      change: (frame, step) => ({
        ...frame, marks: [mark('x', a.x), mark('x', b.x)],
        legs: [{ from: a, to: turn, label: amountText(xa, across), family: 1, at: step }], working: words(frame, step, [[`Across: ${show(a.x)} to ${amountText(xa, b.x)} is ${amountText(xa, across)}`, 1]]),
      }),
    },
    {
      title: way, equation: latex(amountText(ya, Math.abs(up))), adds: 'picture', say: `${way} from one point to the other: ${show(a.y)} to ${amountText(ya, b.y)} is ${amountText(ya, Math.abs(up))}.`,
      change: (frame, step) => ({
        ...frame, marks: [mark('y', a.y), mark('y', b.y)], legs: [...(frame.legs ?? []), { from: turn, to: b, label: amountText(ya, Math.abs(up)), family: 0, at: step }],
        working: words(frame, step, [[`${way}: ${show(a.y)} to ${amountText(ya, b.y)} is ${amountText(ya, Math.abs(up))}`, 0]]),
      }),
    },
    {
      title: 'Calculate the rate', equation: latex(per), adds: 'lines',
      say: `The rate is ${way.toLowerCase()} ÷ across: ${amountText(ya, Math.abs(up))} ÷ ${amountText(xa, across)} = ${per}.${up < 0 ? ' The line goes down, so the amount is falling.' : ''}`,
      change: (frame, step) => ({ ...frame, working: words(frame, step, [[`Rate = ${way.toLowerCase()} ÷ across = ${amountText(ya, Math.abs(up))} ÷ ${amountText(xa, across)} = ${per}`, 3]]) }),
    },
    answerMove(`${show(r)} ${rate}`, 'Check it makes sense', `Halfway, after ${amountText(xa, c.x)}: ${sum}. The line is there too, so the rate is right.`, [], {
      title: '', say: '', equation: '', adds: 'picture',
      change: (frame, step) => ({
        ...frame, legs: reading(c, step), boxed: [c], marks: [mark('x', c.x), mark('y', c.y)], points: [...(frame.points ?? []), { ...c, at: step, label: '' }],
        working: words(frame, step, [[`After ${amountText(xa, c.x)}: ${sum}, and the line is at ${inSum(ya, c.y)} ✓`, 2]]),
      }),
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
