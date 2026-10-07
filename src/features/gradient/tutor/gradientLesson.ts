import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorWorking } from '../../written-methods/tutor/model'
import type { GraphBoardSpec } from '../../written-methods/tutor/GraphBoard'
import type { GraphPoint } from '../../written-methods/tutor/methodWorking'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips } from '../../equations/tutor/equationsDiagnosis'
import { choose, text } from '../../inequalities/tutor/inequalityWorkings'
import { figure, gradient, graphModel, grid, pt, type GraphGrid } from '../../straight-line-graphs/tutor/graphWorkings'
import { gradientMoves, gradientOf, gradientSlips, gradientText, gridAround, pair } from './gradientWorkings'

/*
 * Graphs lesson 3: Gradient. From GR1 (p70–71), with our own numbers; the storyboard is
 * /mnt/project-files/lessons/graphs/L3-gradient/STORYBOARD.md. Three rungs, easiest first: the gradient from a graph;
 * up or down (positive and negative); from two points. Across first, then up, said "up over across" (Sunny, 7 Oct).
 * Hands-on: each rung opens with a play screen on the graph board (tilt a line), and the questions mix walking the
 * triangle, tilting the line to a gradient and typing it. Multiple choice only for the one concept check.
 *
 * Hidden on live like lessons 1 and 2: not in the course registry; it opens only at its unlisted preview page
 * (app/preview/graphs-3-7ffd129f/). Numbered 103, clear of Aniksha's lesson numbers.
 */

export const GRADIENT_PREVIEW_ID = 'graphs-3-7ffd129f'
const { add, finish } = author(103)
const fromGraph = 'graphs-gradient-graph'
const sign = 'graphs-gradient-sign'
const fromPoints = 'graphs-gradient-points'

/* ---------- Screens ---------- */

const keep = (words: string) => words.replace(/\((−?[\d.]+), (−?[\d.]+)\)/g, '($1, $2)')
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
const lineGrid = (a: GraphPoint, b: GraphPoint, x: Range, y: Range) => grid(x, y, [{ from: a, to: b }])
/** Across, then up, then up over across, on the line's own grid. */
const model = (a: GraphPoint, b: GraphPoint, start: GraphGrid, options?: { subtract?: boolean; given?: boolean }) =>
  graphModel(`${pair(a)} and ${pair(b)}`, start, gradientMoves(a, b, options), 'Up over across')
const slope = (a: GraphPoint, b: GraphPoint): Answer['interaction'] => gradient(gradientOf(a, b), `Gradient = ${gradientText(a, b)}`)
const slips = (a: GraphPoint, b: GraphPoint) => (response: string) => diagnoseSlips(response, gradientOf(a, b), gradientSlips(a, b))
const at = (p: GraphPoint): InteractionDefinition => ({ type: 'numericInput', acceptanceRule: 'numberList', correctAnswer: `${p.x}, ${p.y}`, displayAnswer: pair(p), signed: true })

/** Read the gradient of the line drawn: typed. */
function readLine(topic: MicroSkillId, a: GraphPoint, b: GraphPoint, x: Range, y: Range, sourceRef: string, hint: string) {
  const start = lineGrid(a, b, x, y)
  return practice(topic, 'Work out the gradient of the line.', sourceRef, { interaction: slope(a, b), picture: start, prefix: 'Gradient =' }, hint, model(a, b, start), slips(a, b))
}
/** Walk the triangle on the line: from one point across, then up or down, to the other. The title names the points, so the grid doesn't (the counts sit beside the arrows). */
function walkLine(topic: MicroSkillId, a: GraphPoint, b: GraphPoint, x: Range, y: Range, sourceRef: string, hint: string) {
  const start = { ...lineGrid(a, b, x, y), points: [{ ...a, at: -1, label: '' }, { ...b, at: -1, label: '' }] }
  return practice(topic, `Walk from ${pair(a)}: across, then ${b.y < a.y ? 'down' : 'up'} to ${pair(b)}.`, sourceRef,
    { interaction: at(b), board: { mode: 'walk', grid: start, start: a, counts: true } }, hint, model(a, b, start, { given: true }),
    response => response.replace(/\s/g, '') === `${b.y},${b.x}` ? 'Across first, to under the other point. Then up or down.' : null)
}
/** Tilt the line until its gradient is `target`. */
function tilt(topic: MicroSkillId, target: number, shown: string, ends: [GraphPoint, GraphPoint], x: Range, y: Range, sourceRef: string, hint: string, example: [GraphPoint, GraphPoint], extra?: { title?: string; lines?: GraphGrid['lines'] }) {
  const start = { ...grid(x, y), lines: extra?.lines ?? [] }
  const [a, b] = example
  return practice(topic, extra?.title ?? `Tilt the line until its gradient is ${shown}.`, sourceRef,
    { interaction: gradient(target, `Gradient = ${shown}`), board: { mode: 'tilt', grid: start, ends, target } },
    hint, model(a, b, { ...start, lines: [...(start.lines ?? []), { from: a, to: b, at: -1 }] }),
    response => { const [up, across] = response.split('/').map(Number); return across && up / across === -target ? 'Right steepness, wrong way: up from left to right is positive, down is negative.' : across && up / across === 1 / target ? 'That’s across ÷ up. Make the up over the across come to the number.' : null })
}

/* ---------- Rung 1: the gradient from a graph ---------- */

explore(fromGraph, 'Drag either end of the line. Watch the gradient.', 'GR1 p70 Gradient (play)', { mode: 'tilt', grid: grid([-1, 6], [-1, 7]), ends: [pt(1, 1), pt(3, 5)] })
{
  const a = pt(1, 2), b = pt(3, 8), start = lineGrid(a, b, [-1, 5], [-1, 9])
  worked(fromGraph, 'Work out the gradient of the line.', 'Gradient of the line', 'GR1.1 video + GR1 p70 Finding the gradient (own numbers)', model(a, b, start),
    'Gradient is how steep a line is. Count across first, then up: the gradient is up over across.').video = {
    id: 'graphs-3-gradient', src: `/media/${GRADIENT_PREVIEW_ID}/gradient.mp4`, poster: `/media/${GRADIENT_PREVIEW_ID}/gradient.svg`,
    title: 'How steep is the line? Gradient', durationSeconds: 65, sourceFile: 'GR1.2_Gradient.mp4 (tools/lesson-kit/packs/GR1.2-gradient.cjs)',
    textAlternative: [
      'A steep line through (1, 2) and (3, 8): pick two points where it crosses grid corners exactly.',
      'Count across first: from (1, 2) along to x = 3 is across 2.',
      'Then count up: from there up to (3, 8) is up 6. Gradient is up over across: 6 ÷ 2 = 3.',
      'A line going down through (1, 5) and (3, 1): across 2, then down 4, so −4 ÷ 2 = −2. Going down from left to right is negative.',
      'With just the points (1, 2) and (4, 8): across 4 − 1 = 3, up 8 − 2 = 6, so the gradient is 6 ÷ 3 = 2, taking away in the same order both times.',
    ],
  }
}
walkLine(fromGraph, pt(1, -2), pt(3, 6), [-1, 5], [-3, 7], 'GR1 p71 Q1 (own numbers)', 'Drag the amber handle across to under (3, 6), then the blue one up to it.')
readLine(fromGraph, pt(1, -2), pt(3, 6), [-1, 5], [-3, 7], 'GR1 p71 Q1 (own numbers)', 'Across 2, then up 8. Up over across.')
walkLine(fromGraph, pt(2, 2), pt(6, 4), [-1, 8], [-1, 6], 'GR1 p71 Q1 (own numbers)', 'Across first, to under (6, 4). Then up.')
readLine(fromGraph, pt(2, 2), pt(6, 4), [-1, 8], [-1, 6], 'GR1 p71 Q1 (own numbers)', 'Across 4, up 2. A gradient can be a fraction.')
tilt(fromGraph, 2, '2', [pt(1, 1), pt(4, 2)], [-1, 6], [-1, 7], 'GR1 p70 Gradient (tilt)', 'Gradient 2 means up 2 for every 1 across.', [pt(1, 1), pt(3, 5)])

/* ---------- Rung 2: up or down ---------- */

explore(sign, 'Tilt the line from going up to going down. Watch the sign.', 'GR1 p70 Positive and negative gradients (play)', { mode: 'tilt', grid: grid([-3, 5], [-3, 5]), ends: [pt(-1, -1), pt(2, 3)] })
{
  const a = pt(1, 5), b = pt(3, 1), start = lineGrid(a, b, [-1, 5], [-1, 7])
  worked(sign, 'Work out the gradient of the line.', 'A line going down', 'GR1 p70 Negative gradient (own numbers)', model(a, b, start),
    'Read from left to right. Going up is a positive gradient; going down is negative.')
}
readLine(sign, pt(-1, 3), pt(2, -3), [-3, 4], [-4, 5], 'GR1 p71 Q2 (own numbers)', 'From the left point: across 3, then down 6. Down is negative.')
tilt(sign, -0.5, '−1/2', [pt(-2, -1), pt(2, 1)], [-3, 4], [-3, 4], 'GR1 p70 Negative gradient (tilt)', 'Down 1 for every 2 across.', [pt(-2, 2), pt(2, 0)])
tilt(sign, 3, '3', [pt(-2, -1), pt(2, 1)], [-3, 4], [-3, 5], 'GR1 p70 Steeper lines (tilt)', 'Steeper means more up for each across: up 3 for every 1.', [pt(0, 0), pt(1, 3)],
  { title: 'The black line has gradient 1/2. Tilt the blue line to make it steeper, with gradient 3.', lines: [{ from: pt(-2, -1), to: pt(2, 1), at: -1 }] })
walkLine(sign, pt(-2, 3), pt(2, 1), [-3, 4], [-2, 5], 'GR1 p71 Q2 (own numbers)', 'Across to under (2, 1) first. Then down.')
readLine(sign, pt(-2, 3), pt(2, 1), [-3, 4], [-2, 5], 'GR1 p71 Q2 (own numbers)', 'Across 4, then down 2. Down is negative.')

/* ---------- Rung 3: from two points ---------- */

explore(fromPoints, 'Drag either end. Watch the two subtractions.', 'GR1 p71 Gradient from two points (play)', { mode: 'tilt', grid: grid([-2, 6], [-1, 9]), ends: [pt(1, 2), pt(4, 8)], subtract: true })
{
  const a = pt(1, 2), b = pt(4, 8)
  worked(fromPoints, 'Work out the gradient of the line through (1, 2) and (4, 8).', 'From two points', 'GR1 p71 Gradient from two points (own numbers)', model(a, b, gridAround(a, b), { subtract: true, given: true }),
    'No grid needed: take the first point from the second, the y’s for up and the x’s for across, in the same order both times.')
}
for (const [a, b, hint] of [
  [pt(2, 3), pt(4, 9), 'Up: 9 − 3. Across: 4 − 2.'],
  [pt(-2, 5), pt(1, -4), 'Up: −4 − 5. Across: 1 − (−2).'],
  [pt(-3, -2), pt(3, 1), 'Up: 1 − (−2). Across: 3 − (−3).'],
  [pt(5, 1), pt(1, 9), 'Same order both times: 9 − 1 up, 1 − 5 across.'],
] as const) {
  practice(fromPoints, `Work out the gradient of the line through ${pair(a)} and ${pair(b)}.`, 'GR1 p71 Q3 (own numbers)', { interaction: slope(a, b), prefix: 'Gradient =' },
    hint, model(a, b, gridAround(a, b), { subtract: true, given: true }), slips(a, b))
}
{
  const a = pt(1, 3), b = pt(3, 9)
  const question = 'Sam says the gradient of the line through (1, 3) and (3, 9) is 1/3. What went wrong?'
  practice(fromPoints, question, 'GR1 p71 Gradient (a common mistake)', { interaction: choose(
    'Sam did across ÷ up. Up over across is 6 ÷ 2 = 3',
    ['Nothing: Sam is right', 'The line goes up 6 for 2 across: much steeper than 1/3.'],
    ['Sam lost a minus sign: it is −1/3', 'The line goes up from left to right, so its gradient is positive.'],
    ['Sam should have added: it is 12 ÷ 4 = 3', 'Adding the coordinates isn’t how far the line goes. Take one point from the other.'],
  ) }, 'Up is the change in y. Which number goes on top?', model(a, b, gridAround(a, b), { subtract: true, given: true }))
}

add('mixed', 'Gradient', 'GR1 consolidation', text(
  'Gradient is how steep a line is: how far up for every one square across.',
  'Count across first, then up. Gradient = up ÷ across.',
  'Going up from left to right is positive; going down is negative.',
  'From two points: take one from the other, the y’s for up and the x’s for across, in the same order.',
))

export const tutorGradientLesson: TutorMethodLesson = {
  id: 'L103', number: 103, title: 'Gradient', level: 'GCSE Foundation',
  goal: 'Find the gradient of a straight line from a graph or from two points: across first, then up, up over across.',
  labels: { [fromGraph]: 'Gradient from a graph', [sign]: 'Up or down', [fromPoints]: 'From two points', mixed: 'Review' },
  states: finish(),
}
