import type { GraphPoint } from '../../written-methods/tutor/methodWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { clearSide, type GraphBoardSpec } from '../../written-methods/tutor/GraphBoard'
import { latex, readNumbers } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, bracket, mark, plot, pt, shared, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'

/*
 * The workings for Coordinates (graphs lesson 1, GR3), one move a step on the question's own grid (GraphPictures.tsx):
 * plotting a point is across, then up; reading one is down to the x axis, then across to the y axis; a midpoint is
 * halfway across, then halfway up. x is amber and y biro blue everywhere: the arrows, the brackets and the axis numbers.
 */

const show = (n: number) => String(n).replace('-', '−')
export const pair = (p: GraphPoint) => `(${show(p.x)}, ${show(p.y)})`

/* ---------- Plotting: across, then up ---------- */

/** Moves: the brackets, with their two numbers lit on the axes (the heading names them; nothing is written under the grid). */
export const readBrackets = (p: GraphPoint): GraphMove => ({
  title: 'Read the brackets', equation: latex(pair(p)), adds: 'picture',
  say: p.x < 0 || p.y < 0 ? 'The first number is across, the second is up. A negative goes the other way: left, or down.' : 'The first number is across, the second is up.',
  change: frame => ({ ...frame, marks: shared([p]) }),
})
/** Moves: along the x axis from 0, amber; left for a negative. Across 0 stays on the y axis. */
export const goAcross = (p: GraphPoint): GraphMove => ({
  title: p.x === 0 ? 'Across 0' : p.x < 0 ? `Across ${show(p.x)}: left` : `Across ${show(p.x)}`, equation: latex(`across ${show(p.x)}`), adds: 'picture',
  say: p.x === 0 ? 'Across 0: stay on the y axis.' : p.x < 0 ? 'Start at 0. Negative goes left, along the x axis.' : 'Start at 0 and go along the x axis.',
  change: (frame, step) => ({ ...frame, marks: [mark('x', p.x)], legs: p.x === 0 ? frame.legs : [...(frame.legs ?? []), { from: pt(0, 0), to: pt(p.x, 0), label: '', family: 1, at: step }] }),
})
/** Moves: straight up from there, biro blue; down for a negative. */
export const goUp = (p: GraphPoint): GraphMove => ({
  title: p.y === 0 ? 'Up 0' : p.y < 0 ? `Down ${show(-p.y)}` : `Up ${show(p.y)}`, equation: latex(`up ${show(p.y)}`), adds: 'picture',
  say: p.y === 0 ? 'Up 0: stay on the x axis.' : p.y < 0 ? 'Negative goes down, below the x axis.' : 'Then go straight up.',
  change: (frame, step) => ({ ...frame, marks: [mark('y', p.y)], legs: p.y === 0 ? frame.legs : [...(frame.legs ?? []), { from: pt(p.x, 0), to: p, label: '', family: 0, at: step }] }),
})
/** The answer: just the dot and its brackets, the walk's arrows and ring gone (Sunny, 7 Oct: keep it minimal). */
export const thePoint = (p: GraphPoint): GraphMove => {
  const dot = plot([p], '', '')
  return answerMove(pair(p), 'The point', 'Where the walk ends is the point.', [], { ...dot, change: (frame, step) => { const next = dot.change(frame, step); return { ...next, legs: [], boxed: undefined, points: next.points?.map(q => q.at === step ? { ...q, answer: true } : q) } } })
}
export const plotMoves = (p: GraphPoint) => [readBrackets(p), goAcross(p), goUp(p), thePoint(p)]

/* ---------- Reading: down to the x axis, across to the y axis ---------- */

export const lookDown = (p: GraphPoint): GraphMove => ({
  title: p.y < 0 ? 'Look up' : 'Look down', equation: latex(`x is ${show(p.x)}`), adds: 'picture',
  say: `Follow the grid line ${p.y < 0 ? 'up' : 'down'} to the x axis${p.x < 0 ? '. Left of 0 is negative' : ''}.`,
  change: (frame, step) => ({ ...frame, boxed: [p], marks: [mark('x', p.x)], legs: [...(frame.legs ?? []), { from: p, to: pt(p.x, 0), label: '', family: 1, at: step, dashed: true }] }),
})
export const lookAcross = (p: GraphPoint): GraphMove => ({
  title: 'Look across', equation: latex(`y is ${show(p.y)}`), adds: 'picture',
  say: `Follow the grid line across to the y axis${p.y < 0 ? '. Below 0 is negative' : ''}.`,
  change: (frame, step) => ({ ...frame, boxed: [p], marks: [mark('y', p.y)], legs: [...(frame.legs ?? []), { from: p, to: pt(0, p.y), label: '', family: 0, at: step, dashed: true }] }),
})
export const readAnswer = (p: GraphPoint): GraphMove => answerMove(pair(p), 'The answer', 'Across first, then up: the x number, then the y number.', [], {
  title: '', say: '', equation: '', adds: 'answer', change: frame => ({ ...frame, marks: shared([p]) }),
})
/** On an axis, one look is enough: the other number is 0. */
export const readMoves = (p: GraphPoint) => p.x === 0
  ? [{ ...lookAcross(p), say: 'The dot is on the y axis, so it didn’t go across at all: x is 0. Read y across.' }, readAnswer(p)]
  : p.y === 0 ? [{ ...lookDown(p), say: 'The dot is on the x axis, so it didn’t go up at all: y is 0. Read x down.' }, readAnswer(p)]
  : [lookDown(p), lookAcross(p), readAnswer(p)]

/* ---------- Midpoint: halfway across, then halfway up ---------- */

const half = (a: number, b: number) => (a + b) / 2
export const midpoint = (a: GraphPoint, b: GraphPoint) => pt(half(a.x, b.x), half(a.y, b.y))

/** The two points joined, on a grid around them (and 0), at most 9 squares across: a spare square on the right, room
 * for the brackets of a point at the right-hand edge. */
export function midGrid(a: GraphPoint, b: GraphPoint): GraphGrid {
  const xs = [a.x, b.x, 0], ys = [a.y, b.y, 0]
  const left = Math.min(...xs) - 1, right = Math.max(...xs) + 1
  const frame = { x: [left, right + (right - left < 9 ? 1 : 0)] as [number, number], y: [Math.min(...ys) - 1, Math.max(...ys) + 1] as [number, number] }
  return { ...frame, lines: [{ from: a, to: b, at: -1, segment: true }], points: [a, b].map(p => ({ ...p, at: -1, place: clearSide(a, b, p, frame) })) }
}
export const halfwayAcross = (a: GraphPoint, b: GraphPoint): GraphMove => ({
  title: 'Halfway across', equation: latex(`(${show(a.x)} + ${bracket(b.x)}) ÷ 2`), adds: 'lines',
  say: 'Add the two x numbers, then halve.',
  change: (frame, step) => ({ ...frame, boxed: [a, b], marks: [mark('x', a.x), mark('x', b.x), mark('x', half(a.x, b.x))],
    working: [...(frame.working ?? []), { text: `(${show(a.x)} + ${bracket(b.x)}) ÷ 2 = ${show(half(a.x, b.x))}`, family: 1, at: step }] }),
})
export const halfwayUp = (a: GraphPoint, b: GraphPoint): GraphMove => ({
  title: 'Halfway up', equation: latex(`(${show(a.y)} + ${bracket(b.y)}) ÷ 2`), adds: 'lines',
  say: 'Now add the two y numbers, then halve.',
  change: (frame, step) => ({ ...frame, boxed: [a, b], marks: [mark('y', a.y), mark('y', b.y), mark('y', half(a.y, b.y))],
    working: [...(frame.working ?? []), { text: `(${show(a.y)} + ${bracket(b.y)}) ÷ 2 = ${show(half(a.y, b.y))}`, family: 0, at: step }] }),
})
export const theMidpoint = (a: GraphPoint, b: GraphPoint): GraphMove => {
  const m = midpoint(a, b), dot = plot([m], '', '')
  // Its brackets go in a corner the line doesn't run through.
  return answerMove(pair(m), 'The midpoint', 'It sits exactly halfway along the line.', [], { ...dot, change: (frame, step) => {
    const next = dot.change(frame, step)
    return { ...next, points: next.points?.map(p => p.at === step && p.x === m.x && p.y === m.y ? { ...p, place: clearSide(a, b, m, frame) } : p) }
  } })
}
export const midpointMoves = (a: GraphPoint, b: GraphPoint) => [halfwayAcross(a, b), halfwayUp(a, b), theMidpoint(a, b)]

/* ---------- Answers ---------- */

/** A point, as "x, y": moved to on the graph board, or typed in two boxes. */
export const at = (p: GraphPoint, typed = false): InteractionDefinition => ({
  type: 'numericInput', acceptanceRule: 'numberList', correctAnswer: `${p.x}, ${p.y}`, displayAnswer: pair(p), signed: true, ...(typed ? { responseShape: 'point' as const } : {}),
})
export const board = (mode: GraphBoardSpec['mode'], grid: GraphGrid, start?: GraphPoint, ends?: [GraphPoint, GraphPoint]): GraphBoardSpec => ({ mode, grid, start, ends })

/**
 * The usual slips with coordinates: the two numbers swapped (up first), a sign lost, or, on an axis, the 0 in the wrong
 * place. `extra` adds a question's own (a midpoint not halved). Null when no slip fits.
 */
export function pointSlips(p: GraphPoint, extra: [GraphPoint, string][] = []) {
  return (response: string) => {
    const [x, y] = readNumbers(response)
    if (x === undefined || y === undefined || (x === p.x && y === p.y)) return null
    const own = extra.find(([q]) => q.x === x && q.y === y)
    if (own) return own[1]
    if (x === p.y && y === p.x) {
      if (p.x === 0) return 'It’s on the y axis, so it didn’t move across at all: x is 0.'
      if (p.y === 0) return 'It’s on the x axis, so it didn’t move up at all: y is 0.'
      return 'You went up first. Across comes first: the x number.'
    }
    if (x === -p.x && y === -p.y) return 'Both signs are the wrong way round. Negative x goes left, and negative y goes down.'
    if (x === -p.x && y === p.y) return p.x < 0 ? 'This point is left of the y axis, so its x is negative.' : 'This point is right of the y axis, so its x is positive.'
    if (y === -p.y && x === p.x) return p.y < 0 ? 'This point is below the x axis, so its y is negative.' : 'This point is above the x axis, so its y is positive.'
    return null
  }
}
/** A midpoint's own slips: the totals not halved, or the difference halved. */
export function midpointSlips(a: GraphPoint, b: GraphPoint) {
  return pointSlips(midpoint(a, b), [
    [pt(a.x + b.x, a.y + b.y), 'That’s the total. Halve it to get halfway.'],
    [pt(Math.abs(b.x - a.x) / 2, Math.abs(b.y - a.y) / 2), 'Halfway is the average: add the two numbers, then halve.'],
  ])
}
