/*
 * Lesson 105 (Simultaneous equations by graph), Higher section: a line and a circle. From the Higher revision guide,
 * GR9 Type 2 Linear and Non-Linear Graphs (Level 6-7, page 125): plot the straight line and the circle on the same
 * axes and read where they cross. A line can cross a circle twice, so there are two pairs of answers: y = x + 2 and
 * x² + y² = 100 cross at (6, 8) and (−8, −6). The book's example is drawn one move a step, on axes counting in 2s so the
 * radius 10 circle fits about 11 squares. The practice uses our own numbers whose crossings are whole-number points;
 * two pairs are picked (the answer box takes one list), one question types the two x values, and two ask how many
 * solutions a line and a circle can have (2, 1 or 0).
 */
import { author } from '../../written-methods/tutor/content'
import { line, part, sign, type StepWorking, type WorkedStep } from '../../written-methods/tutor/stepWorking'
import type { GraphPoint } from '../../written-methods/tutor/methodWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { latex } from '../../inequalities/tutor/inequalityWorkings'
import { mark, pt, shared, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'
import { choose, number, screens, text, type HigherAddition } from './helpers'

const skill = 'line-circle-simultaneous'
const a = author(105, 'L105-H')
const { add } = a
const { practice, graph, onGrid } = screens(a)

const show = (n: number) => String(n).replace('-', '−')
const pair = (p: GraphPoint) => `(${show(p.x)}, ${show(p.y)})`
const solution = (p: GraphPoint) => `x = ${show(p.x)}, y = ${show(p.y)}`
/** The question's grid: the circle and the line there from the start, each named. */
function both(x: [number, number], y: [number, number], r: number, circleLabel: string, from: GraphPoint, to: GraphPoint, lineLabel: string): GraphGrid {
  return { x, y, circles: [{ r, at: -1, label: circleLabel }], lines: [{ from, to, label: lineLabel, at: -1 }], points: [] }
}

add(skill, 'A line and a circle', 'Higher GR9 Type 2 Linear and Non-Linear Graphs', text(
  'You can solve a straight line and a circle together by drawing both on the same axes.',
  'The answers are where they cross: each crossing point works in both equations.',
  'A line can cross a circle twice, so there are usually two pairs of answers. Write each x with its own y.',
  'A line can also just touch the circle (one answer, a tangent) or miss it completely (no answers).',
))

/* The book's example: y = x + 2 and x² + y² = 100. */
const hundred: GraphGrid = { x: [-12, 10], y: [-12, 10], scale: { x: { per: 2, start: 0, name: 'x' }, y: { per: 2, start: 0, name: 'y' } }, lines: [], points: [] }
const crossings = [pt(6, 8), pt(-8, -6)]
const moves: GraphMove[] = [
  { title: 'Draw the circle', say: 'x² + y² = 100 is a circle about (0, 0). 100 is 10², so its radius is 10. Each square is 2.', equation: latex('x^2 + y^2 = 100'), adds: 'picture',
    change: (frame, step) => ({ ...frame, marks: [mark('x', 10), mark('x', -10)], circles: [{ r: 10, at: step, label: 'x² + y² = 100' }] }) },
  { title: 'Draw the line', say: 'y = x + 2 crosses the y axis at 2 and goes up 1 for every 1 across. Draw it right across the grid.', equation: latex('y = x + 2'), adds: 'picture',
    change: (frame, step) => ({ ...frame, marks: [mark('y', 2)], lines: [{ from: pt(0, 2), to: pt(6, 8), label: 'y = x + 2', at: step }] }) },
  { title: 'Where they cross', say: 'The line crosses the circle twice. Read each point: (6, 8) and (−8, −6). Both work in both equations.', equation: latex('(6, 8),\\ (-8, -6)'), adds: 'picture',
    change: (frame, step) => ({ ...frame, boxed: crossings, marks: shared(crossings),
      points: [{ x: 6, y: 8, label: '(6, 8)', at: step, place: { dx: 1, dy: 1 } }, { x: -8, y: -6, label: '(−8, −6)', at: step, place: { dx: -1, dy: 1 } }] }) },
  { title: 'Write both pairs', say: 'Each crossing gives one pair of answers. Check (6, 8): 36 + 64 = 100 and 6 + 2 = 8.', equation: latex('x = 6,\\ y = 8\\ \\text{and}\\ x = -8,\\ y = -6'), adds: 'answer',
    change: (frame, step) => ({ ...frame, points: (frame.points ?? []).map(p => ({ ...p, answer: true })), answer: { text: 'x = 6, y = 8 and x = −8, y = −6', at: step } }) },
]
graph(skill, 'By plotting their graphs, solve y = x + 2 and x² + y² = 100.', 'Higher GR9 Type 2 Example', 'y = x + 2 and x² + y² = 100', hundred, moves, 'Solve it', 'Where the line crosses the circle',
  'Draw the circle and the line on the same axes. The solutions are the points where they cross.')

/** Read both crossings off the grid, check each in both equations, then write both pairs. */
function readWorking(start: string, points: [GraphPoint, GraphPoint], circle: (p: GraphPoint) => NonNullable<WorkedStep['lines']>, lineCheck: (p: GraphPoint) => NonNullable<WorkedStep['lines']>[number], last: WorkedStep): StepWorking {
  const check = (p: GraphPoint, title: string): WorkedStep => ({ title, why: 'Its x squared add its y squared should make the circle’s number, and it should fit the line too.', lines: [...circle(p), lineCheck(p)] })
  return { kind: 'step-worked', start, steps: [
    { title: 'Find the crossings', why: 'Read each point where the line crosses the circle: down to the x axis, across to the y axis.', lines: [line([part('crossings')], `${pair(points[0])} and ${pair(points[1])}`)] },
    check(points[0], 'Check the first'),
    check(points[1], 'Check the second'),
    last,
  ] }
}
const squares = (p: GraphPoint) => [line([part(String(p.x * p.x), 1), sign('+'), part(String(p.y * p.y), 0)], p.x * p.x + p.y * p.y)]
const pairs = (points: GraphPoint[]): WorkedStep => ({ title: 'Write both pairs', why: 'Each crossing is one pair of answers. Each x goes with its own y.', words: points.map(solution).join(' and ') })

/* y = x + 1 and x² + y² = 25: (3, 4) and (−4, −3). */
onGrid(skill, 'Use the graph to solve y = x + 1 and x² + y² = 25.', 'Higher GR9 extra practice', both([-6, 5], [-5, 6], 5, 'x² + y² = 25', pt(0, 1), pt(3, 4), 'y = x + 1'), choose([
  'x = 3, y = 4 and x = −4, y = −3', 'x = 4, y = 3 and x = −3, y = −4', 'x = 3, y = 4 only', 'x = 0, y = 1 and x = 0, y = 5',
]), 'x = 3, y = 4 and x = −4, y = −3', 'Find both points where the line crosses the circle.',
readWorking('y = x + 1 and x² + y² = 25', [pt(3, 4), pt(-4, -3)], squares, p => line([part(show(p.x), 1), sign('+'), part('1')], show(p.y)), pairs([pt(3, 4), pt(-4, -3)])))

/* y = 7 − x and x² + y² = 25: (3, 4) and (4, 3). */
onGrid(skill, 'Use the graph to solve y = 7 − x and x² + y² = 25.', 'Higher GR9 extra practice', both([-5, 6], [-5, 6], 5, 'x² + y² = 25', pt(3, 4), pt(4, 3), 'y = 7 − x'), choose([
  'x = 3, y = 4 and x = 4, y = 3', 'x = 3, y = 4 only', 'x = −3, y = −4 and x = −4, y = −3', 'x = 0, y = 7 and x = 7, y = 0',
]), 'x = 3, y = 4 and x = 4, y = 3', 'The two crossings are close together. Look carefully.',
readWorking('y = 7 − x and x² + y² = 25', [pt(3, 4), pt(4, 3)], squares, p => line([part('7'), sign('−'), part(show(p.x), 1)], show(p.y)), pairs([pt(3, 4), pt(4, 3)])))

/* y = 2x − 5 and x² + y² = 10: (1, −3) and (3, 1), typed as the two x values. */
const xValues: InteractionDefinition = { type: 'numericInput', responseShape: 'roots', acceptanceRule: 'unorderedSet', correctAnswer: '1, 3', displayAnswer: 'x = 1 or x = 3' }
onGrid(skill, 'The graphs of y = 2x − 5 and x² + y² = 10 are drawn. Write down the x values of the solutions.', 'Higher GR9 extra practice', both([-5, 5], [-6, 4], Math.sqrt(10), 'x² + y² = 10', pt(0, -5), pt(3, 1), 'y = 2x − 5'),
  xValues, 'x = 1 or x = 3', 'Find where the line crosses the circle, and read each x down to the x axis.',
  readWorking('y = 2x − 5 and x² + y² = 10', [pt(1, -3), pt(3, 1)], squares, p => line([part('2'), sign('×'), part(show(p.x), 1), sign('−'), part('5')], show(p.y)),
    { title: 'Write the x values', why: 'Both points work in both equations. The question asks only for their x values.', lines: [line([part('x values')], 'x = 1 or x = 3', { answer: true })] }),
  'x values')

/* y = x − 1 and x² + y² = 13: (3, 2) and (−2, −3). */
onGrid(skill, 'Use the graph to solve y = x − 1 and x² + y² = 13.', 'Higher GR9 extra practice', both([-5, 5], [-5, 5], Math.sqrt(13), 'x² + y² = 13', pt(0, -1), pt(3, 2), 'y = x − 1'), choose([
  'x = 3, y = 2 and x = −2, y = −3', 'x = 2, y = 3 and x = −3, y = −2', 'x = 3, y = 2 and x = −2, y = 3', 'x = 3, y = 2 only',
]), 'x = 3, y = 2 and x = −2, y = −3', 'Two crossings. Mind which number is x and which is y.',
readWorking('y = x − 1 and x² + y² = 13', [pt(3, 2), pt(-2, -3)], squares, p => line([part(show(p.x), 1), sign('−'), part('1')], show(p.y)), pairs([pt(3, 2), pt(-2, -3)])))

/* y = 5 just touches x² + y² = 25: one solution. */
const touching = onGrid(skill, 'How many solutions do y = 5 and x² + y² = 25 have?', 'Higher GR9 extra practice', both([-6, 5], [-5, 6], 5, 'x² + y² = 25', pt(-1, 5), pt(1, 5), 'y = 5'),
  number(1, '1'), '1', 'Count the points where the line meets the circle.', {
    kind: 'step-worked', start: 'y = 5 and x² + y² = 25', steps: [
      { title: 'Look at the line', why: 'The line across at five touches the top of the circle, which has radius five.', lines: [line([part('meets at')], '(0, 5)')] },
      { title: 'Count the points', why: 'It touches the circle once and doesn’t cross it. It is a tangent, so there is one solution.', lines: [line([part('points')], '1', { answer: true })] },
    ],
  })
touching.answerLabel = 'solutions'

practice(skill, 'Why can a straight line and a circle have 2, 1 or 0 solutions?', 'Higher GR9 Type 2 (concept)', choose([
  'The line can cross the circle twice, just touch it once, or miss it',
  'A circle has two halves, so there are always two',
  'A straight line always crosses a circle once',
  'A circle’s equation has x² in it, so it has no solutions',
]), 'The line can cross the circle twice, just touch it once, or miss it', 'Picture a ruler moving across a circle.', {
  kind: 'step-worked', start: 'a line and a circle', steps: [
    { title: 'Solutions are crossings', why: 'Each solution is a point on both graphs, where the line meets the circle.', lines: [line([part('solutions')], 'crossing points', { eq: true })] },
    { title: 'Count the crossings', why: 'A line through the circle crosses it twice. A tangent touches it once. A line outside misses it.', words: 'The line can cross the circle twice, just touch it once, or miss it' },
  ],
})

export const lineAndCircle: HigherAddition = { lessonId: 'L105', skill: 'line-circle-simultaneous', label: 'A line and a circle', states: a.finish() }
