import type { GraphFrame, GraphPoint, MethodStep } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodVisual, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition } from '../../number-types/types'
import { latex } from '../../inequalities/tutor/inequalityWorkings'

/*
 * The workings for Straight line graphs (lesson 26, GR1): the question's own grid (GraphPictures.tsx), one move a step.
 * A step draws on the grid (points, a line, the step across or up) and may write one line under it; the last step
 * writes the answer in green.
 */

export type GraphGrid = Omit<GraphFrame, 'step' | 'adds'>
export const pt = (x: number, y: number): GraphPoint => ({ x, y })
const show = (n: number) => String(n).replace('-', '−')
/** −3 → "(−3)", so a subtraction reads 5 − (−1). */
export const bracket = (n: number) => n < 0 ? `(${show(n)})` : show(n)

/** A grid with the question's own lines and points on it (`at` −1: there from the start, never greyed). */
export function grid(x: [number, number], y: [number, number], lines: { from: GraphPoint; to: GraphPoint; label?: string }[] = [], points: (GraphPoint & { label?: string })[] = []): GraphGrid {
  return { x, y, lines: lines.map(line => ({ ...line, at: -1 })), points: points.map(point => ({ ...point, at: -1 })) }
}
/** y = k across the grid, x = k up and down it. */
export const across = (k: number) => ({ from: pt(-1, k), to: pt(1, k), label: `y = ${show(k)}` })
export const upDown = (k: number) => ({ from: pt(k, -1), to: pt(k, 1), label: `x = ${show(k)}` })

/** The question's grid, drawn plain above its answer box. */
export const figure = (start: GraphGrid): TutorMethodVisual => ({ kind: 'diagram', diagram: { kind: 'graph', frame: { ...start, step: 0, adds: 'picture' } } })

/**
 * One move a step on the grid. The frame keeps everything earlier steps added; `at` says which step added each part,
 * so finished parts grey out. `boxed` lasts for one step: the points that step reads.
 */
export type GraphMove = { title: string; say: string; equation: string; adds: GraphFrame['adds']; change: (frame: GraphFrame, step: number) => GraphFrame }
export function graphModel(question: string, start: GraphGrid, moves: GraphMove[], label = 'Work it out'): TutorWorking {
  let frame: GraphFrame = { ...start, step: 0, adds: 'picture' }
  const steps: MethodStep[] = moves.map((move, step) => {
    frame = { ...move.change({ ...frame, boxed: undefined, marks: undefined }, step), step, adds: move.adds }
    return { title: move.title, operation: latex(question), equation: move.equation, instruction: move.say, frame: { graph: frame } }
  })
  return { kind: 'method-worked', examples: [{ method: 'ordering', expression: latex(question), label, first: 0, second: 0, steps, pictureOnly: true, focus: true }] }
}

type Mark = NonNullable<GraphFrame['marks']>[number]
/** One axis number to highlight, in its axis's colour: x amber (1), y biro blue (0), as in a point's brackets. */
const mark = (axis: 'x' | 'y', value: number): Mark => ({ axis, value, family: axis === 'x' ? 1 : 0 })
/** The axis numbers in points' brackets: each x on the x axis and each y on the y axis. */
function shared(points: GraphPoint[]): Mark[] {
  const unique = (values: number[]) => [...new Set(values)]
  return [...unique(points.map(p => p.x)).map(value => mark('x', value)), ...unique(points.map(p => p.y)).map(value => mark('y', value))]
}

/** Moves: points on the grid, with their coordinates, ringed in purple while they are read; their axis numbers marked like their brackets. */
export const plot = (points: GraphPoint[], title: string, say: string): GraphMove => ({
  title, say, equation: latex(points.map(p => `(${show(p.x)}, ${show(p.y)})`).join(', ')), adds: 'picture',
  change: (frame, step) => ({ ...frame, points: [...(frame.points ?? []), ...points.map(p => ({ ...p, at: step }))], boxed: points, marks: shared(points) }),
})
/** Moves: rings points already on the grid (the two a gradient is read from), with a line of working. */
/**
 * Where two points' coordinates go: on the side towards the other point across, and below them when the line goes up
 * that way (above when it goes down), unless that runs into the y axis. That corner is clear of the line, which runs the other way through each point,
 * and of the steps from the first point (up or down) to the second (across).
 */
export function placed(a: GraphPoint, b: GraphPoint) {
  const dx = Math.sign(b.x - a.x), dy = Math.sign(b.y - a.y)
  // A point just beside the y axis has its coordinates written away from it, clear of the axis numbers.
  const away = (p: GraphPoint) => (dx < 0 && p.x >= 0 && p.x < 2) || (dx > 0 && p.x < 0 && p.x > -2) ? -dx : dx
  return [{ ...a, place: { dx: away(a), dy } }, { ...b, place: { dx: away(b), dy } }]
}
export const pick = (points: [GraphPoint, GraphPoint], lineText: string, title: string, say: string): GraphMove => ({
  title, say, equation: latex(lineText), adds: 'lines',
  change: (frame, step) => ({
    ...frame, boxed: points, marks: shared(points),
    points: [...(frame.points ?? []).filter(p => !points.some(q => q.x === p.x && q.y === p.y)), ...placed(...points).map(p => ({ ...p, at: step }))],
    working: [...(frame.working ?? []), { text: lineText, family: 3, at: step }],
  }),
})
/** Moves: a straight line drawn through two points, biro blue (a halfway result); y = 3 marks the 3 on the y axis. */
export const draw = (line: { from: GraphPoint; to: GraphPoint; label?: string }, title: string, say: string): GraphMove => ({
  title, say, equation: latex(line.label ?? 'join the points'), adds: 'picture',
  change: (frame, step) => ({
    ...frame, lines: [...(frame.lines ?? []), { ...line, at: step }],
    marks: line.from.y === line.to.y ? [mark('y', line.from.y)] : line.from.x === line.to.x ? [mark('x', line.from.x)] : undefined,
  }),
})
/**
 * Moves: the step between two points, across (change in x, amber) or up or down (change in y, biro blue), labelled
 * with its size, and its sum written under the grid in the same colour.
 */
export const leg = (from: GraphPoint, to: GraphPoint, lineText: string, title: string, say: string): GraphMove => {
  const isAcross = from.y === to.y
  const size = isAcross ? to.x - from.x : to.y - from.y
  const family = isAcross ? 1 : 0
  return {
    title, say, equation: latex(lineText), adds: 'lines',
    change: (frame, step) => ({
      ...frame, boxed: [from, to].filter(p => (frame.points ?? []).some(q => q.x === p.x && q.y === p.y)),
      legs: [...(frame.legs ?? []), { from, to, label: show(size), family, at: step }],
      // The two ends of the step on its axis: up from y = 2 to y = 8 marks 2 and 8 on the y axis.
      marks: isAcross ? [mark('x', from.x), mark('x', to.x)] : [mark('y', from.y), mark('y', to.y)],
      working: [...(frame.working ?? []), { text: lineText, family, at: step }],
    }),
  }
}
/** Moves: the last one, the answer in its green box; `lines` turns those lines (by index) green on the grid too. */
export const answerMove = (answerText: string, title: string, say: string, lines: number[] = [], extra?: GraphMove): GraphMove => ({
  title, say, equation: latex(answerText), adds: 'answer',
  change: (frame, step) => {
    const drawn = extra ? extra.change(frame, step) : frame
    const answers = (drawn.lines ?? []).map((line, i) => lines.includes(i) ? { ...line, answer: true } : line)
    // A line across or up and down that is the answer has its axis number marked: y = 4 marks the 4.
    const marks = answers.filter(line => line.answer).flatMap((line): Mark[] => line.from.y === line.to.y ? [mark('y', line.from.y)] : line.from.x === line.to.x ? [mark('x', line.from.x)] : [])
    return { ...drawn, lines: answers, marks: marks.length ? marks : drawn.marks, answer: { text: answerText, at: step } }
  },
})

/* ---------- Answers ---------- */

/**
 * A gradient, typed any way that has its value: 3, −2, 1/2 or 0.5. The phone shows the full keyboard (− and /).
 * Checked as "strictly between value ± 0.000001", which every way of writing the value passes.
 */
export const gradient = (value: number, shown: string): InteractionDefinition => ({
  type: 'numericInput', acceptanceRule: 'openInterval', lowerBound: value - 1e-6, upperBound: value + 1e-6, correctAnswer: value, displayAnswer: shown, signed: true,
})
/** A whole number that may be negative: y = −1. */
export const signedNumber = (value: number, shown: string): InteractionDefinition => ({ ...gradient(value, shown) })
