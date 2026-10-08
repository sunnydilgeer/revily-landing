import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorWorking } from '../../written-methods/tutor/model'
import type { GraphBoardSpec } from '../../written-methods/tutor/GraphBoard'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { choose, latex, text } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, figure, graphModel, pt, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'
import {
  at, columnGrid, columnMoves, curve, drawn, fullMoves, pair, plotMoves, plotSlips, plotted, readPoint, sum, tableMoves, tableOf, value, valueSlips, yOf,
  type Curve,
} from './curveWorkings'

/*
 * Graphs lesson 6: Quadratic and cubic graphs. From GR6 (p80–83: the U, ∩ and S shapes; a table of values, then plot
 * and join with a smooth curve), with our own numbers. Three rungs, easiest first: tables for curves (squaring a
 * negative); plot and join smoothly; cubics and the shapes. Hands-on (Sunny, 7 Oct): the lesson opens with a play
 * screen, and the plotting questions are answered on the graph board, every column of the table a dot, joined with a
 * smooth curve once they are all down (CurveBoard.tsx).
 *
 * Hidden on live like lessons 1 to 5: not in the course registry; only the hidden Graphs shelf opens it.
 */

export const CURVES_MEDIA_ID = 'graphs-6-9a4e72b1'
const { add, finish } = author(106)
const tables = 'graphs-curve-table'
const plot = 'graphs-curve-plot'
const shapes = 'graphs-curve-shapes'

/* ---------- Screens ---------- */

const keep = (words: string) => words.replace(/\((−?[\d.]+), (−?[\d.]+)\)/g, '($1, $2)')
function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
function explore(topic: MicroSkillId, title: string, sourceRef: string, spec: GraphBoardSpec) {
  const state = add(topic, keep(title), sourceRef, text(keep(title)))
  state.board = spec
}
function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: TutorWorking, body: string) {
  const state = add(topic, keep(title), sourceRef, model, undefined, undefined, undefined, body)
  state.content.heading = keep(heading)
  return state
}
type Answer = { interaction: InteractionDefinition; board?: GraphBoardSpec; picture?: GraphGrid; prefix?: string }
function practice(topic: MicroSkillId, title: string, sourceRef: string, answer: Answer, hint: string, model: TutorWorking, diagnose?: (response: string) => string | null) {
  const { interaction } = answer
  const shown = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  const state = add(topic, keep(title), sourceRef, answer.picture ? figure(answer.picture) : text(keep(title)), interaction, working(shown, ...workingSteps(model)), hint)
  state.working = model
  state.board = answer.board
  if (diagnose) state.diagnose = diagnose
  if (answer.prefix) state.answerPrefix = answer.prefix
  return state
}

type Range = [number, number]
const grid = (x: Range, y: Range, extra: Partial<GraphGrid> = {}): GraphGrid => ({ x, y, lines: [], points: [], ...extra })
const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i)

/** A table question: one y to find, the rest of the table filled in and plotted. */
function findY(topic: MicroSkillId, c: Curve, xs: number[], i: number, x: Range, y: Range, sourceRef: string, hint: string, extra: [number, string][] = []) {
  const start = columnGrid(c, xs, i, x, y)
  practice(topic, `${c.text}. Find y when x = ${String(xs[i]).replace('-', '−')}.`, sourceRef, { interaction: value(yOf(c, xs[i])), picture: { ...start, table: { ...start.table!, ask: i } }, prefix: 'y =' },
    hint, graphModel(c.text, start, columnMoves(c, i, xs[i]), 'Put x in'), valueSlips(c, xs[i], extra))
}
/** A plotting question on the board: every column a dot, joined with a smooth curve. */
function plotTable(topic: MicroSkillId, c: Curve, xs: number[], x: Range, y: Range, sourceRef: string, hint: string) {
  const start = grid(x, y, { table: tableOf(c, xs, xs.map((_, i) => i)) })
  practice(topic, `Plot the graph of ${c.text}. Its table is filled in.`, sourceRef,
    { interaction: plotted(c, xs), board: { mode: 'points', grid: start, curve: c.coeffs } },
    hint, graphModel(c.text, start, plotMoves(c, xs), 'Plot and join'), plotSlips(c, xs))
}

/* ---------- Rung 1: tables for curves ---------- */

{
  const c = curve('y = x² − 2'), xs = range(-2, 2)
  explore(tables, 'Slide the dot along y = x² − 2. Watch the table fill in.', 'GR6 p81 Quadratic graphs (play)',
    { mode: 'rule', curve: c.coeffs, curveText: c.text, grid: grid([-3, 3], [-3, 4], { table: tableOf(c, xs) }), start: pt(0, -2) })
}
{
  const c = curve('y = x² − 3'), xs = range(-2, 2)
  worked(tables, 'Complete the table for y = x² − 3.', 'Table for y = x² − 3', 'GR6 p81 Plotting quadratics, steps 1–3 (own numbers)',
    graphModel(c.text, grid([-3, 3], [-4, 3], { table: tableOf(c, xs) }), tableMoves(c, xs), 'Fill the table'),
    'A rule with x² makes a curve. Put each x into the rule to find its y, a negative x in brackets: (−2)² is −2 × −2 = 4, positive.').video = {
    id: 'graphs-6-curves', src: `/media/${CURVES_MEDIA_ID}/curves.mp4`, poster: `/media/${CURVES_MEDIA_ID}/curves.svg`,
    title: 'Quadratic and cubic graphs', durationSeconds: 87, sourceFile: 'GR6.1_Quadratic_and_cubic_graphs.mp4 (tools/lesson-kit/packs/GR6.1-quadratic-and-cubic-graphs.cjs)',
    textAlternative: [
      'A rule with x² is a quadratic, and its graph is a curve: a U shape, or an upside-down U when the x² is taken away.',
      'A table for y = x² − 3: put each x in, in brackets. (−2)² = 4, so x = −2 gives 4 − 3 = 1. The ys are 1, −2, −3, −2, 1.',
      'Plot each column across, then up or down, and join the points with one smooth curve, freehand, not with a ruler.',
      'A rule with x³ is a cubic. A negative cubed stays negative: (−2)³ = −8. Its graph is an S shape: up, down and up again.',
      'Recap: brackets round a negative x; a negative squared is positive and cubed is negative; plot every point and join them smoothly.',
    ],
  }
}
findY(tables, curve('y = x² + 1'), range(-2, 2), 0, [-3, 3], [-1, 6], 'GR6 p83 Q1 (own numbers)', '(−2)² means −2 × −2. Then add 1.',
  [[-3, '(−2)² is −2 × −2 = 4, positive. Then 4 + 1.']])
findY(tables, curve('y = x² − 2x'), range(-1, 3), 0, [-2, 4], [-2, 4], 'GR6 p83 Q1 (own numbers)', '(−1)² is 1. Then take away 2 × (−1).',
  [[-1, 'Take away 2 × (−1) = −2: taking away a negative adds. 1 + 2.']])
findY(tables, curve('y = 5 − x²'), range(-2, 2), 0, [-3, 3], [-1, 6], 'GR6 p83 Q1 (own numbers)', 'Square first: (−2)² = 4. Then 5 − 4.',
  [[9, 'x² is 4, and the rule takes it away: 5 − 4.']])
findY(tables, curve('y = x² + x − 4'), range(-3, 2), 0, [-4, 3], [-5, 3], 'GR6 p83 Q1 (own numbers)', '(−3)² is 9. Then add −3, then take 4.',
  [[8, 'Adding x adds −3, which takes 3 away: 9 − 3 − 4.'], [-16, '(−3)² is positive: −3 × −3 = 9.']])

/* ---------- Rung 2: plot and join smoothly ---------- */

{
  const c = curve('y = x² − 2x − 3'), xs = range(-2, 4)
  worked(plot, 'Draw the graph of y = x² − 2x − 3.', 'Plot y = x² − 2x − 3', 'GR6 p81 Plotting quadratics, step 4 (own numbers)',
    graphModel(c.text, grid([-3, 5], [-5, 6], { table: tableOf(c, xs, xs.map((_, i) => i)) }), plotMoves(c, xs), 'Plot and join'),
    'Each column of the table is a point. Plot them all, then join them with one smooth curve, freehand. A curve has no sharp corners and no straight bits.')
}
plotTable(plot, curve('y = x² − 4'), range(-2, 2), [-3, 3], [-5, 2], 'GR6 p83 Q1 (own numbers)', 'Each column is a point: across to x, then up or down to y.')
plotTable(plot, curve('y = 6 − x²'), range(-2, 2), [-3, 3], [-1, 7], 'GR6 p83 Q1 (own numbers)', 'Across to x, then up to y. This one is upside down: x² is taken away.')
{
  // Ella's table has one y wrong; its point breaks the smooth curve.
  const c = curve('y = x² + 2x'), xs = range(-3, 1), wrong = pt(-1, 1)
  const ys = xs.map(x => x === wrong.x ? wrong.y : yOf(c, x))
  const start = grid([-4, 2], [-2, 4], { table: { xs, ys, rule: c.text.replace(/^y = /, '') }, points: xs.map((x, i) => ({ ...pt(x, ys[i]), at: -1, label: '' })) })
  const check: GraphMove = {
    title: 'Which point breaks the curve?', equation: latex(pair(wrong)), adds: 'lines', say: 'A smooth U goes down and back up. One point jumps out of it: check its sum.',
    change: (frame, step) => ({ ...frame, boxed: [wrong], table: { ...frame.table!, lit: xs.indexOf(wrong.x) }, working: [{ text: sum(c, wrong.x), family: 0, at: step }] }),
  }
  practice(plot, 'Ella’s table for y = x² + 2x has one wrong y. Tap the point in the wrong place.', 'GR6 p81 Plotting quadratics: checking (own numbers)',
    { interaction: at(wrong), board: { mode: 'plot', grid: start } },
    'The points should make a smooth U. Which one is out of line? Check its sum.', graphModel(c.text, start, [check,
      answerMove(pair(wrong), 'The wrong point', `(−1)² + 2 × (−1) = 1 − 2 = −1, not 1. The point should be at ${pair(pt(-1, -1))}.`, [], {
        title: '', say: '', equation: '', adds: 'picture',
        change: (frame, step) => ({ ...frame, points: [...(frame.points ?? []), { ...pt(-1, -1), at: step, answer: true, label: '' }], curves: [drawn(c, xs, step)] }),
      })], 'Check the sums'),
    response => {
      const [x, y] = response.replace(/−/g, '-').split(',').map(Number)
      if (x === -1 && y === -1) return 'That’s where it should be. Tap Ella’s point that’s wrong.'
      if (xs.includes(x) && y === yOf(c, x)) return `That one is right: ${sum(c, x)}. Look for the point out of the smooth U.`
      return null
    })
}
{
  const c = curve('y = x² + 2x − 3'), low = pt(-1, -4), start = grid([-5, 3], [-5, 6], { curves: [{ ...drawn(c, [-4, 2], -1), label: c.text }] })
  practice(plot, 'y = x² + 2x − 3 is drawn. Tap its lowest point.', 'GR6 p80 Quadratic graphs: the turning point (own numbers)',
    { interaction: at(low), board: { mode: 'plot', grid: start } },
    'The bottom of the U, where it stops going down and turns back up.', graphModel(c.text, start, [
      readPoint(low, 'The bottom of the U', 'The curve comes down, turns and goes back up. The turning point is the lowest point. Read x down and y across.', [sum(c, low.x)]),
    ], 'Read it'),
    response => response.replace(/[\s]/g, '').replace(/−/g, '-') === '-4,-1' ? 'x first: across to −1, then down to −4.' : null)
}

/* ---------- Rung 3: cubics and the shapes ---------- */

{
  const c = curve('y = x³ − 3x'), xs = range(-2, 2)
  worked(shapes, 'Draw the graph of y = x³ − 3x.', 'Plot y = x³ − 3x', 'GR6 p82 Plotting cubics (own numbers)',
    graphModel(c.text, grid([-3, 3], [-3, 3], { table: tableOf(c, xs) }), fullMoves(c, xs), 'Table, plot, join'),
    'A rule with x³ is a cubic. A negative cubed stays negative: (−2)³ = −2 × −2 × −2 = −8. Its graph is an S shape: up, down and up again.')
}
{
  const c = curve('y = 4 − x²'), xs = range(-2, 2), start = grid([-3, 3], [-1, 5], { table: tableOf(c, xs, xs.map((_, i) => i)) })
  practice(shapes, 'What shape is the graph of y = 4 − x²?', 'GR6 p80 Quadratic and cubic shapes (concept)', { interaction: choose(
    '∩, a hill: the x² is taken away',
    ['U, a valley', 'A U comes from adding x². Here x² is taken away, so it turns upside down.'],
    ['S: up, down and up again', 'An S comes from x³. The highest power here is x².'],
    ['A straight line', 'An x² makes a curve. A straight line has no x², x³ or y².'],
  ) }, 'Find the highest power of x, and whether it is added or taken away.', graphModel(c.text, start, [
    {
      title: 'The highest power', equation: latex('− x²'), adds: 'lines', say: 'The highest power is x², so it is a quadratic: a U or a ∩. Here x² is taken away.',
      change: (frame, step) => ({ ...frame, points: xs.map(x => ({ ...pt(x, yOf(c, x)), at: step, label: '' })), working: [{ text: 'x² taken away: ∩', family: 3, at: step }] }),
    },
    answerMove('∩', 'Join them', 'Its table makes a hill: up to 4 in the middle and back down.', [], { title: '', say: '', equation: '', adds: 'answer', change: (frame, step) => ({ ...frame, curves: [drawn(c, xs, step, true)] }) }),
  ], 'The shape'))
}
findY(shapes, curve('y = x³ − 4x'), range(-2, 2), 1, [-3, 3], [-4, 4], 'GR6 p83 Q2 (own numbers)', '(−1)³ = −1 × −1 × −1. Then take away 4 × (−1).',
  [[5, '(−1)³ is negative: −1 × −1 × −1 = −1. Then −1 + 4.'], [-5, 'Taking away 4 × (−1) = −4 adds 4: −1 + 4.']])
plotTable(shapes, curve('y = x³ − 4x'), range(-2, 2), [-3, 3], [-4, 4], 'GR6 p83 Q2 (own numbers)', 'Across to x, then up or down to y. It makes an S.')
findY(shapes, curve('y = x³ + 2'), range(-2, 1), 0, [-3, 2], [-7, 4], 'GR6 p83 Q2 (own numbers)', '(−2)³ = −2 × −2 × −2. Then add 2.',
  [[10, '(−2)³ is negative: −2 × −2 × −2 = −8. Then −8 + 2.'], [-4, 'x³ is x × x × x, not 3 × x: (−2)³ = −8.']])

add('mixed', 'Quadratic and cubic graphs', 'GR6 consolidation', text(
  'A rule with x² is a quadratic: a U shape, or ∩ when the x² is taken away.',
  'A rule with x³ is a cubic: an S shape.',
  'Table of values: put each x into the rule, in brackets. A negative squared is positive; a negative cubed is negative.',
  'Plot every column across, then up or down.',
  'Join the points with one smooth curve, freehand. A point off the curve means a sum to check.',
))

export const tutorCurveGraphsLesson: TutorMethodLesson = {
  id: 'L106', number: 106, title: 'Quadratic and cubic graphs', level: 'GCSE Foundation',
  goal: 'Fill in a table of values for a quadratic or cubic, plot it and join it with a smooth curve, and know the U, ∩ and S shapes.',
  labels: { [tables]: 'Tables for curves', [plot]: 'Plot a smooth curve', [shapes]: 'Cubics and shapes', mixed: 'Review' },
  states: finish(),
}
