import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorWorking } from '../../written-methods/tutor/model'
import type { GraphBoardSpec } from '../../written-methods/tutor/GraphBoard'
import type { GraphPoint } from '../../written-methods/tutor/methodWorking'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips } from '../../equations/tutor/equationsDiagnosis'
import { choose, latex, text } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, figure, gradient, graphModel, grid, mark, pt, type GraphGrid } from '../../straight-line-graphs/tutor/graphWorkings'
import { gradientMoves, gradientOf, gradientSlips, gradientText, gridAround, pair } from './gradientWorkings'
import { fromGraphMoves, fromPointsMoves, gridFor, lineSlips, lineText, rearrangeMoves, typedLine } from './equationWorkings'

/*
 * Graphs lesson 3: Gradient and y = mx + c. From GR1 (p70–71) and GR2 (p72–73), with our own numbers; the storyboard
 * is /mnt/project-files/lessons/graphs/L3-gradient/STORYBOARD.md. Six rungs, easiest first: the gradient from a graph;
 * up or down (positive and negative); from two points, with GR1's formula (y₂ − y₁) ÷ (x₂ − x₁); then GR2's three
 * skills: y = mx + c from a graph, from two points, and rearranging into y = mx + c. Across first, then up, said "up over across" (Sunny, 7 Oct).
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
const lineGraph = 'graphs-equation-graph'
const linePoints = 'graphs-equation-points'
const rearrange = 'graphs-equation-rearrange'

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
    'Gradient is how steep a line is. Count across first, then up: the gradient is up over across. Up is the change in y and across the change in x, so gradient = change in y ÷ change in x.').video = {
    id: 'graphs-3-gradient', src: `/media/${GRADIENT_PREVIEW_ID}/gradient.mp4`, poster: `/media/${GRADIENT_PREVIEW_ID}/gradient.svg`,
    title: 'How steep is the line? Gradient', durationSeconds: 71, sourceFile: 'GR1.2_Gradient.mp4 (tools/lesson-kit/packs/GR1.2-gradient.cjs)',
    textAlternative: [
      'A steep line through (1, 2) and (3, 8): pick two points where it crosses grid corners exactly.',
      'Count across first: from (1, 2) along to x = 3 is across 2.',
      'Then count up: from there up to (3, 8) is up 6. Gradient is up over across: 6 ÷ 2 = 3.',
      'A line going down through (1, 5) and (3, 1): across 2, then down 4, so −4 ÷ 2 = −2. Going down from left to right is negative.',
      'With just the points (1, 2) and (4, 8): across 4 − 1 = 3, up 8 − 2 = 6, so the gradient is 6 ÷ 3 = 2, taking away in the same order both times.',
      'That is the formula gradient = change in y ÷ change in x = (y₂ − y₁) ÷ (x₂ − x₁).',
    ],
  }
}
walkLine(fromGraph, pt(1, -2), pt(3, 6), [-1, 5], [-3, 7], 'GR1 p71 Q1 (own numbers)', 'Drag the amber handle across to under (3, 6), then the blue one up to it.')
readLine(fromGraph, pt(1, -2), pt(3, 6), [-1, 5], [-3, 7], 'GR1 p71 Q1 (own numbers)', 'Across 2, then up 8. Up over across.')
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

/* ---------- Rung 3: from two points ---------- */

explore(fromPoints, 'Drag either end. Watch the two subtractions.', 'GR1 p71 Gradient from two points (play)', { mode: 'tilt', grid: grid([-2, 6], [-1, 9]), ends: [pt(1, 2), pt(4, 8)], subtract: true })
{
  const a = pt(1, 2), b = pt(4, 8)
  worked(fromPoints, 'Work out the gradient of the line through (1, 2) and (4, 8).', 'From two points', 'GR1 p71 Gradient from two points (own numbers)', model(a, b, gridAround(a, b), { subtract: true, given: true }),
    'No grid needed: take the first point from the second, the y’s for up and the x’s for across, in the same order both times. That’s the formula gradient = (y₂ − y₁) ÷ (x₂ − x₁).')
}
for (const [a, b, hint] of [
  [pt(2, 3), pt(4, 9), 'Up: 9 − 3. Across: 4 − 2.'],
  [pt(-2, 5), pt(1, -4), 'Up: −4 − 5. Across: 1 − (−2).'],
  [pt(2, 1), pt(-2, 2), 'Same order both times: 2 − 1 up, −2 − 2 across. It can be a fraction.'],
  [pt(-3, 2), pt(3, -1), 'Up: −1 − 2. Across: 3 − (−3). Then simplify the fraction.'],
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

/* ---------- Rung 4: y = mx + c from a graph (GR2) ---------- */

/** The answer, the question's line going green, c lit on the y axis. */
const answerMoveFor = (answerText: string, title: string, say: string, c: number) =>
  answerMove(answerText, title, say, [0], { title: '', say: '', equation: '', adds: 'answer', change: frame => ({ ...frame, marks: [mark('y', c)] }) })

const lineAnswer = (mTop: number, mBottom: number, c: number): InteractionDefinition =>
  ({ type: 'numericInput', responseShape: 'formula', acceptanceRule: 'formula', correctAnswer: typedLine(mTop, mBottom, c), displayAnswer: lineText(mTop, mBottom, c) })
/** c, then across and up from where the line crosses the y axis, then y = mx + c, on the line's own grid. */
const lineModel = (c: number, across: number, up: number, x: Range, y: Range) =>
  graphModel(lineText(up, across, c), lineGrid(pt(0, c), pt(across, c + up), x, y), fromGraphMoves(c, across, up), 'y = mx + c')
/** Write down the equation of the line drawn: typed after "y =". */
function equationOf(c: number, across: number, up: number, x: Range, y: Range, sourceRef: string, hint: string) {
  return practice(lineGraph, 'Write down the equation of the line.', sourceRef,
    { interaction: lineAnswer(up, across, c), picture: lineGrid(pt(0, c), pt(across, c + up), x, y), prefix: 'y =' },
    hint, lineModel(c, across, up, x, y), lineSlips(up, across, c))
}

explore(lineGraph, 'Change m and c. Watch what each one does to the line.', 'GR2 p72 The straight line equation (play)',
  { mode: 'equation', grid: grid([-3, 5], [-4, 5]), rule: { m: 1, c: 0 } })
worked(lineGraph, 'Find the equation of the line.', 'y = mx + c', 'GR2 p72 Skill 1: equation from a graph (own numbers)', lineModel(-2, 1, 3, [-2, 4], [-4, 5]),
  'Every straight line is y = mx + c. m is the gradient. c is where the line crosses the y axis, the y-intercept. Find c first, then m.').video = {
  id: 'graphs-3-equation', src: `/media/${GRADIENT_PREVIEW_ID}/equation.mp4`, poster: `/media/${GRADIENT_PREVIEW_ID}/equation.svg`,
  title: 'The equation of a straight line', durationSeconds: 70, sourceFile: 'GR2.1_Equation_of_a_line.mp4 (tools/lesson-kit/packs/GR2.1-equation-of-a-line.cjs)',
  textAlternative: [
    'Every straight line is y = mx + c: m is the gradient and c is where it crosses the y axis.',
    'From a graph: the line crosses the y axis at −2, so c = −2. From there, across 1 and up 3, so m = 3 ÷ 1 = 3. The line is y = 3x − 2.',
    'From two points, (−2, 9) and (3, −1): m = (−1 − 9) ÷ (3 − (−2)) = −10 ÷ 5 = −2. Put in (−2, 9): 9 = −2 × (−2) + c, so 9 = 4 + c and c = 5. The line is y = −2x + 5.',
    'Rearranging x + 3y = 12: take x from both sides, 3y = −x + 12, then divide by 3, y = −⅓x + 4. The gradient is −⅓ and the y-intercept 4.',
  ],
}
equationOf(-1, 2, 1, [-3, 5], [-3, 3], 'GR2 p73 Q1 (own numbers)', 'c first: where does it cross the y axis? Then across 2 and up.')
practice(lineGraph, 'Make the line y = 2x − 3.', 'GR2 p72 The straight line equation (own numbers)',
  { interaction: { type: 'numericInput', acceptanceRule: 'numberList', correctAnswer: '2, -3', displayAnswer: 'y = 2x − 3' }, board: { mode: 'equation', grid: grid([-3, 5], [-5, 5]), rule: { m: 1, c: 0 }, equation: { m: 2, c: -3 } } },
  'm is the number in front of x. c is the number on its own, with its sign.', lineModel(-3, 1, 2, [-3, 5], [-5, 5]),
  response => response.replace(/\s/g, '') === '-3,2' ? 'That’s m and c swapped. m goes with x.' : response.replace(/\s/g, '') === '2,3' ? 'c is −3: the line crosses below 0.' : null)
equationOf(3, 1, -2, [-2, 4], [-2, 5], 'GR2 p73 Q3 (own numbers)', 'It crosses the y axis at 3. Across 1, then down: down is negative.')
practice(lineGraph, 'Write down the gradient of y = 5 − 2x.', 'GR2 p72 Reading m and c (own numbers)', { interaction: gradient(-2, 'Gradient = −2'), prefix: 'Gradient =' },
  'The gradient is the number in front of x, with its sign.', graphModel('y = 5 − 2x', lineGrid(pt(0, 5), pt(1, 3), [-1, 5], [-2, 6]), [
    { title: 'In order', equation: latex('y = −2x + 5'), adds: 'lines', say: 'Write it the usual way round: the x term first. 5 − 2x is the same as −2x + 5.', change: (frame, step) => ({ ...frame, working: [{ text: 'y = −2x + 5', family: 3, at: step }] }) },
    answerMoveFor('Gradient = −2', 'Read m', 'm is the number in front of x: −2. The line goes down 2 for every 1 across.', 5),
  ], 'y = mx + c'),
  response => response.trim().replace('−', '-') === '5' ? 'That’s c, where it crosses the y axis. The gradient is the number with x.' : response.trim() === '2' ? 'Keep the sign: it’s −2x.' : null)

/* ---------- Rung 5: y = mx + c from two points (GR2) ---------- */

/** m, then a point put in, then c, then the line. */
const pointsModel = (a: GraphPoint, b: GraphPoint) => {
  const [n, d] = [b.y - a.y, b.x - a.x]
  const c = a.y - (n / d) * a.x
  return graphModel(`${pair(a)} and ${pair(b)}`, gridFor([a, b], c), fromPointsMoves(a, b), 'm, then c')
}
function throughPoints(a: GraphPoint, b: GraphPoint, sourceRef: string, hint: string) {
  const up = b.y - a.y, across = b.x - a.x, c = a.y - (up / across) * a.x
  return practice(linePoints, `Find the equation of the line through ${pair(a)} and ${pair(b)}.`, sourceRef,
    { interaction: lineAnswer(up, across, c), prefix: 'y =' }, hint, pointsModel(a, b), lineSlips(up, across, c))
}
worked(linePoints, 'Find the equation of the line through (−2, 9) and (3, −1).', 'From two points', 'GR2 p72 Skill 2: equation through two points (own numbers)', pointsModel(pt(-2, 9), pt(3, -1)),
  'Two steps: find m from the two points, then put one point’s x and y into y = mx + c to find c.')
throughPoints(pt(1, 5), pt(3, 11), 'GR2 p73 Q2 (own numbers)', 'm = (11 − 5) ÷ (3 − 1). Then put in x = 1, y = 5.')
throughPoints(pt(-2, -5), pt(3, 30), 'GR2 p73 Q2 (own numbers)', 'm = (30 − (−5)) ÷ (3 − (−2)). Then put in one point.')
throughPoints(pt(2, 4), pt(6, 6), 'GR2 p73 Q2 (own numbers)', 'm = (6 − 4) ÷ (6 − 2), a fraction. Then put in x = 2, y = 4.')

/* ---------- Rung 6: rearranging into y = mx + c (GR2) ---------- */

/** ax + by = k, made into y = mx + c, the line coming in on its grid. */
const rearrangeModel = (a: number, b: number, k: number, x: Range, y: Range) => {
  const named = `${a === 1 ? '' : a === -1 ? '−' : String(a).replace('-', '−')}x ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}y = ${String(k).replace('-', '−')}`
  return graphModel(named, grid(x, y), rearrangeMoves(a, b, k), 'Make y the subject')
}
worked(rearrange, 'Find the gradient and y-intercept of x + 3y = 12.', 'Rearranging', 'GR2 p73 Skill 3: rearranging (own numbers)', rearrangeModel(1, 3, 12, [-1, 7], [-1, 6]),
  'Make y the subject, one move at a time, until it says y = mx + c. Then read off m and c.')
practice(rearrange, 'Find the gradient of the line 2x + y = 7.', 'GR2 p73 Skill 3 (own numbers)', { interaction: gradient(-2, 'Gradient = −2'), prefix: 'Gradient =' },
  'Take 2x from both sides first.', rearrangeModel(2, 1, 7, [-1, 5], [-2, 8]),
  response => response.trim() === '2' ? 'Taking 2x from both sides leaves −2x: the gradient is negative.' : response.trim() === '7' ? 'That’s c. The gradient is the number in front of x.' : null)
practice(rearrange, 'Write 4y − 8x = 12 in the form y = mx + c.', 'GR2 p73 Skill 3 (own numbers)', { interaction: lineAnswer(2, 1, 3), prefix: 'y =' },
  'Add 8x to both sides, then divide every term by 4.', rearrangeModel(-8, 4, 12, [-3, 3], [-2, 6]), lineSlips(2, 1, 3))
practice(rearrange, '3x + 2y = 10. Tap where the line crosses the y axis.', 'GR2 p73 Skill 3 (own numbers)',
  { interaction: at(pt(0, 5)), board: { mode: 'plot', grid: grid([-2, 5], [-2, 7]) } },
  'Make y the subject. c is where it crosses the y axis.', rearrangeModel(3, 2, 10, [-2, 5], [-2, 7]),
  response => response.replace(/\s/g, '') === '0,10' ? 'Divide the 10 by 2 as well: y = −3/2x + 5.' : response.replace(/\s/g, '') === '5,0' ? 'On the y axis x is 0: across 0, then up.' : null)

add('mixed', 'Gradient and y = mx + c', 'GR1 and GR2 consolidation', text(
  'Gradient is how steep a line is: up over across, the change in y over the change in x.',
  'From two points: gradient = (y₂ − y₁) ÷ (x₂ − x₁), the same order top and bottom.',
  'Going up from left to right is positive; going down is negative.',
  'Every straight line is y = mx + c: m is the gradient and c is where it crosses the y axis.',
  'From two points: find m, then put one point in to find c. Otherwise make y the subject first.',
))

export const tutorGradientLesson: TutorMethodLesson = {
  id: 'L103', number: 103, title: 'Gradient and y = mx + c', level: 'GCSE Foundation',
  goal: 'Find the gradient of a straight line from a graph or from two points, and its equation y = mx + c from a graph, from two points or by rearranging.',
  labels: { [fromGraph]: 'Gradient from a graph', [sign]: 'Up or down', [fromPoints]: 'Gradient from two points', [lineGraph]: 'y = mx + c from a graph', [linePoints]: 'y = mx + c from two points', [rearrange]: 'Rearranging to y = mx + c', mixed: 'Review' },
  states: finish(),
}
