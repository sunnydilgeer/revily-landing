import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { choose, text } from '../../inequalities/tutor/inequalityWorkings'
import { across, answerMove, placed, bracket, draw, figure, gradient, graphModel, grid, leg, pick, plot, pt, signedNumber, upDown, type GraphGrid } from './graphWorkings'

/*
 * Lesson 26 (Graphs GR1): Straight line graphs. From the GR1 pages of Sunny's book scan (p70–71), with our own numbers.
 * Three rungs, easiest first: horizontal and vertical lines (y = a across, x = a up and down), the gradient read from a
 * line on a grid, and the gradient of the line through two points. The video is the kit's GR1.1 pack
 * (tools/lesson-kit/packs/GR1.1-straight-line-graphs.cjs), on the rung 2 worked example.
 *
 * Hidden on live: it is not in the course registry, so no curriculum, contents, search, cards or practice show it. It
 * opens only at its unlisted preview page (app/preview/gr1-ba769eb9a12b/).
 */

export const GR1_PREVIEW_ID = 'gr1-ba769eb9a12b'
const { add, finish } = author(26)
const lines = 'graphs-horizontal-vertical'
const fromGraph = 'graphs-gradient-graph'
const fromPoints = 'graphs-gradient-points'

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
type Answer = { interaction: InteractionDefinition; prefix?: string }
const value = (n: number, prefix: string, shown = `${prefix} ${String(n).replace('-', '−')}`): Answer => ({ interaction: signedNumber(n, shown), prefix })
const slope = (n: number, shown: string): Answer => ({ interaction: gradient(n, `Gradient = ${shown}`), prefix: 'Gradient =' })
const pickOne = (interaction: InteractionDefinition): Answer => ({ interaction })

/** A practice question: its words, its own grid above the answer box (when it has one), and its working one move a step. */
function practice(topic: MicroSkillId, title: string, sourceRef: string, picture: GraphGrid | undefined, answer: Answer, hint: string, model: TutorWorking, slips?: Slip[]) {
  const { interaction } = answer
  const shown = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  const state = add(topic, title, sourceRef, picture ? figure(picture) : text(title), interaction, working(shown, ...workingSteps(model)), hint)
  state.working = model
  if (answer.prefix) state.answerPrefix = answer.prefix
  if (slips) state.diagnose = (response: string) => diagnoseSlips(response, Number(interaction.correctAnswer), slips)
  return state
}
function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: TutorWorking, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  // The grid shows the line, so the heading is only the instruction (EXPLANATIONS.md rule 1).
  state.content.heading = heading
  return state
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }

/** The usual slips on a gradient: upside down (across ÷ up), the sign lost, or only one of the two changes. */
function gradientSlips(rise: number, run: number): Slip[] {
  const right = rise / run
  return [
    [run / rise, 'That’s the change in x ÷ the change in y. The gradient is the change in y ÷ the change in x: up or down, over across.'],
    [-right, right < 0 ? 'The line goes down from left to right, so its gradient is negative.' : 'The line goes up from left to right, so its gradient is positive.'],
    [rise, `That’s only the change in y. Divide it by the change in x, ${String(run).replace('-', '−')}.`],
    [-run / rise, 'That’s the change in x ÷ the change in y. The gradient is the change in y ÷ the change in x: up or down, over across.'],
  ]
}

/* ---------- Rung 1: horizontal and vertical lines ---------- */

worked(lines, 'Draw the lines y = 3 and x = −2.', 'Draw y = 3 and x = −2', 'GR1 p70 Horizontal and vertical lines (own numbers)', graphModel('y = 3 and x = −2', grid([-4, 4], [-4, 4]), [
  plot([pt(-3, 3), pt(1, 3), pt(3, 3)], 'Points where y is 3', 'Pick any points whose y coordinate, the second number in the bracket, is 3.'),
  draw(across(3), 'Join them across', 'They line up straight across. Every point on this line has a y coordinate of 3.'),
  plot([pt(-2, -3), pt(-2, -1), pt(-2, 1)], 'Points where x is −2', 'Now pick points whose x coordinate, the first number in the bracket, is −2.'),
  answerMove('y = 3 goes across, x = −2 goes up and down', 'Join them up and down', 'They line up straight up and down. y equals a number is always across; x equals a number is always up and down.', [0, 1], draw(upDown(-2), '', '')),
]), 'y = a number is a horizontal line: across. x = a number is a vertical line: up and down.')

practice(lines, 'Which equation is the line drawn on the grid?', 'GR1 p70 Horizontal lines (own numbers)', grid([-4, 4], [-2, 5], [across(4)]), pickOne(choose(
  'y = 4',
  ['x = 4', 'x = 4 goes up and down. This line goes across, and every point on it has y = 4.'],
  ['y = 0', 'y = 0 is the x axis itself. This line is 4 squares above it.'],
  ['y = 4x', 'y = 4x slopes up through (0, 0). This line is flat.'],
)), 'Read two points on the line. Which coordinate stays the same?', graphModel('the line drawn', grid([-4, 4], [-2, 5], [across(4)]), [
  plot([pt(-2, 4), pt(3, 4)], 'Read two points', 'Read the coordinates of two points on the line. Their y coordinates are both 4.'),
  answerMove('y = 4', 'Every y is 4', 'The line goes across, so every point on it has the same y coordinate.', [0]),
]))
practice(lines, 'Write down the equation of the line drawn on the grid.', 'GR1 p70 Vertical lines (own numbers)', grid([-2, 5], [-3, 4], [upDown(3)]), value(3, 'x ='), 'The line goes up and down. What is the x coordinate of every point on it?', graphModel('the line drawn', grid([-2, 5], [-3, 4], [upDown(3)]), [
  plot([pt(3, -2), pt(3, 2)], 'Read two points', 'Read the coordinates of two points on the line. Their x coordinates are both 3.'),
  answerMove('x = 3', 'Every x is 3', 'The line goes up and down, so every point on it has the same x coordinate.', [0]),
]), [[-3, 'The line is to the right of the y axis, so its x coordinates are positive.'], [0, 'That’s the y axis. This line is 3 squares to the right of it.']])
practice(lines, 'A horizontal line goes through the point (6, −1). Write down its equation.', 'GR1 p71 Q4 (own numbers)', grid([-1, 7], [-3, 3], [], [pt(6, -1)]), value(-1, 'y ='), 'Horizontal means across. Which coordinate stays the same all the way along?', graphModel('(6, −1)', grid([-1, 7], [-3, 3], [], [pt(6, -1)]), [
  draw({ ...across(-1), label: undefined }, 'Draw it across', 'A horizontal line goes straight across through the point.'),
  answerMove('y = −1', 'Every y is −1', 'Every point on it has the same y coordinate as (6, −1), the second number.', [0]),
]), [[6, '6 is the x coordinate. A horizontal line keeps the same y all the way along, so use the second number.'], [1, 'Check the sign: the point is below the x axis, so y is negative.']])
practice(lines, 'Which of these points is on the line x = −4?', 'GR1 p70 Vertical lines (points on the line)', undefined, pickOne(choose(
  '(−4, 7)',
  ['(7, −4)', 'There y is −4. On x = −4 the first number, x, must be −4.'],
  ['(4, −4)', 'There x is 4, not −4.'],
  ['(0, −4)', 'That point is on the y axis, where x is 0.'],
)), 'x is the first number in the bracket.', graphModel('x = −4', grid([-6, 2], [-2, 8], [upDown(-4)]), [
  answerMove('(−4, 7)', 'x must be −4', 'Every point on this line has −4 as its first number. The y coordinate can be anything.', [], plot([pt(-4, 7)], '', '')),
]))
practice(lines, 'Which equation is the y axis?', 'GR1 p70 Horizontal and vertical lines (the axes)', undefined, pickOne(choose(
  'x = 0',
  ['y = 0', 'y = 0 is the x axis: every point on it has y = 0, so it goes across.'],
  ['y = 1', 'y = 1 goes across, one square above the x axis.'],
  ['x = 1', 'x = 1 goes up and down, one square to the right of the y axis.'],
)), 'The y axis goes up and down. What is x at every point on it?', graphModel('the y axis', grid([-3, 3], [-3, 3]), [
  plot([pt(0, -2), pt(0, 1), pt(0, 3)], 'Points on the y axis', 'Every point on the y axis has 0 as its first number.'),
  answerMove('x = 0', 'Every x is 0', 'It goes up and down, and every x coordinate on it is 0.'),
]))

/* ---------- Rung 2: the gradient from a graph ---------- */

{
  const line = { from: pt(1, 2), to: pt(3, 8) }
  const start = grid([-1, 5], [-2, 9], [line])
  const first = worked(fromGraph, 'Work out the gradient of the line drawn on the grid.', 'Find the gradient', 'GR1.1 video + GR1 p70 Finding the gradient (own numbers)', graphModel('the line drawn', start, [
    pick([pt(1, 2), pt(3, 8)], '(1, 2) and (3, 8)', 'Pick two points', 'Choose two points where the line crosses grid corners exactly, not too close together.'),
    leg(pt(1, 2), pt(1, 8), 'Change in y = 6', 'Change in y', 'Count the squares up from the lower point to the height of the other one.'),
    leg(pt(1, 8), pt(3, 8), 'Change in x = 2', 'Change in x', 'Now count the squares across to the other point.'),
    answerMove('Gradient = 6 ÷ 2 = 3', 'Up over across', 'Divide the change in y by the change in x. It is how far the line goes up for every one square across.'),
  ]), 'Gradient = change in y ÷ change in x. It is how steep the line is: how far up for every one across.')
  video(first, {
    id: 'lesson26-straight-line-graphs', src: `/media/${GR1_PREVIEW_ID}/straight-line-graphs.mp4`, poster: `/media/${GR1_PREVIEW_ID}/straight-line-graphs.svg`,
    title: 'How steep is the line? Gradient', durationSeconds: 69, sourceFile: 'GR1.1_Straight_Line_Graphs.mp4 (tools/lesson-kit/packs/GR1.1-straight-line-graphs.cjs)',
    textAlternative: [
      'The gradient of a line is how steep it is: how far it goes up for every one square across.',
      'A straight line goes through (1, 2) and (3, 8). Pick those two points: both sit exactly on grid corners.',
      'Change in y: from y = 2 up to y = 8 is 6 squares up.',
      'Change in x: from x = 1 across to x = 3 is 2 squares across.',
      'Gradient = change in y ÷ change in x = 6 ÷ 2 = 3. For every one square across, the line goes up 3.',
      'With just the two points and no grid, subtract: change in y = 8 − 2 = 6, change in x = 3 − 1 = 2, and 6 ÷ 2 = 3 again.',
      'A line going up from left to right has a positive gradient. A line going down has a negative gradient: its change in y is negative.',
    ],
  })
}
{
  const start = grid([-1, 5], [-3, 7], [{ from: pt(1, -2), to: pt(3, 6) }])
  practice(fromGraph, 'Work out the gradient of the line drawn on the grid.', 'GR1 p71 Q1 (own numbers)', start, slope(4, '4'), 'Pick two points on grid corners. Count up, then across.', graphModel('the line drawn', start, [
    pick([pt(1, -2), pt(3, 6)], '(1, −2) and (3, 6)', 'Pick two points', 'Choose two points where the line crosses grid corners exactly.'),
    leg(pt(1, -2), pt(1, 6), 'Change in y = 8', 'Change in y', 'Count the squares up from the lower point to the height of the other one.'),
    leg(pt(1, 6), pt(3, 6), 'Change in x = 2', 'Change in x', 'Now count the squares across to the other point.'),
    answerMove('Gradient = 8 ÷ 2 = 4', 'Up over across', 'Divide the change in y by the change in x.'),
  ]), gradientSlips(8, 2))
}
{
  const start = grid([-1, 5], [-1, 7], [{ from: pt(1, 5), to: pt(3, 1) }])
  practice(fromGraph, 'Work out the gradient of the line drawn on the grid.', 'GR1 p71 Q2 (own numbers)', start, slope(-2, '−2'), 'The line goes down from left to right. What does that tell you about the gradient?', graphModel('the line drawn', start, [
    pick([pt(1, 5), pt(3, 1)], '(1, 5) and (3, 1)', 'Pick two points', 'Choose two points where the line crosses grid corners exactly. Work from left to right.'),
    leg(pt(1, 5), pt(1, 1), 'Change in y = −4', 'Change in y', 'From the left point the line goes down 4 squares, so the change in y is negative.'),
    leg(pt(1, 1), pt(3, 1), 'Change in x = 2', 'Change in x', 'Then count the squares across to the other point.'),
    answerMove('Gradient = −4 ÷ 2 = −2', 'Down over across', 'Divide the change in y by the change in x. A negative divided by a positive is negative.'),
  ]), gradientSlips(-4, 2))
}
{
  const start = grid([-1, 8], [-1, 5], [{ from: pt(2, 2), to: pt(6, 4) }])
  practice(fromGraph, 'Work out the gradient of the line drawn on the grid.', 'GR1 p70 Finding the gradient (a fraction, own numbers)', start, slope(0.5, '1/2'), 'This line is not very steep: it goes up less than one for every one across.', graphModel('the line drawn', start, [
    pick([pt(2, 2), pt(6, 4)], '(2, 2) and (6, 4)', 'Pick two points', 'Choose two points where the line crosses grid corners exactly.'),
    leg(pt(2, 2), pt(2, 4), 'Change in y = 2', 'Change in y', 'Count the squares up from the lower point to the height of the other one.'),
    leg(pt(2, 4), pt(6, 4), 'Change in x = 4', 'Change in x', 'Now count the squares across to the other point.'),
    answerMove('Gradient = 2 ÷ 4 = 1/2', 'Up over across', 'Divide the change in y by the change in x. A gradient can be a fraction: half a square up for every one across.'),
  ]), gradientSlips(2, 4))
}
{
  const start = grid([-3, 4], [-3, 4], [{ from: pt(-1, 3), to: pt(2, 0) }])
  practice(fromGraph, 'Is the gradient of this line positive or negative?', 'GR1 p70 Positive vs negative gradients', start, pickOne(choose(
    'Negative: as x goes up, y goes down',
    ['Positive: every straight line has a positive gradient', 'A line that goes down from left to right has a negative gradient.'],
    ['Positive: it crosses the y axis above 0', 'Where it crosses doesn’t decide the sign. Which way does it go, from left to right?'],
    ['Zero: it goes through the x axis', 'A gradient of 0 is a flat line, across. This one slopes.'],
  )), 'Read the line from left to right, the way you read.', graphModel('the line drawn', start, [
    pick([pt(-1, 3), pt(2, 0)], 'left to right', 'Read left to right', 'Start at the left and move right along the line.'),
    answerMove('Negative: y goes down as x goes up', 'It goes down', 'Going right, the line goes down, so its change in y is negative and so is the gradient.'),
  ]))
}

/* ---------- Rung 3: the gradient through two points ---------- */

/** The two points on a grid that fits them, with a square of room around. */
function twoPoints(a: [number, number], b: [number, number]): GraphGrid {
  const xs = [a[0], b[0], 0], ys = [a[1], b[1], 0]
  // Two squares of room on the side the coordinates are written, so they stay inside the grid.
  const right = b[0] > a[0] ? 2 : 1, left = b[0] > a[0] ? 1 : 2
  return grid([Math.min(...xs) - left, Math.max(...xs) + right], [Math.min(...ys) - 1, Math.max(...ys) + 1], [], placed(pt(...a), pt(...b)))
}
/** Change in y, then change in x (second point take away the first, both times), then divide. */
function pointsModel(a: [number, number], b: [number, number], sayY = 'Take the first point’s y from the second point’s y.', sayX = 'Take the x coordinates in the same order: the second point’s take away the first’s.') {
  const [x1, y1] = a, [x2, y2] = b
  const rise = y2 - y1, run = x2 - x1, fmt = (n: number) => String(n).replace('-', '−')
  const top = Math.sign(run) * rise / gcd(rise, run), bottom = Math.abs(run) / gcd(rise, run)
  const show = bottom === 1 ? fmt(top) : `${fmt(top)}/${bottom}`
  return graphModel(`(${fmt(x1)}, ${fmt(y1)}) and (${fmt(x2)}, ${fmt(y2)})`, twoPoints(a, b), [
    leg(pt(x1, y1), pt(x1, y2), `Change in y = ${fmt(y2)} − ${bracket(y1)} = ${fmt(rise)}`, 'Change in y', sayY),
    leg(pt(x1, y2), pt(x2, y2), `Change in x = ${fmt(x2)} − ${bracket(x1)} = ${fmt(run)}`, 'Change in x', sayX),
    answerMove(`Gradient = ${fmt(rise)} ÷ ${bracket(run)} = ${show}`, 'Divide', 'Divide the change in y by the change in x.'),
  ], 'Work it out')
}
const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b)

worked(fromPoints, 'Work out the gradient of the line that passes through (1, 2) and (4, 8).', 'Gradient through (1, 2) and (4, 8)', 'GR1 p70 Example 1 (own numbers)', pointsModel([1, 2], [4, 8]),
  'Gradient = change in y ÷ change in x. Subtract in the same order both times: the second point take away the first.')
practice(fromPoints, 'Work out the gradient of the line that passes through (2, 3) and (4, 9).', 'GR1 p71 Q3 (own numbers)', undefined, slope(3, '3'), 'Change in y first: 9 take away 3.', pointsModel([2, 3], [4, 9]), gradientSlips(6, 2))
practice(fromPoints, 'Work out the gradient of the line that passes through (−2, 5) and (1, −4).', 'GR1 p71 Q3 (negatives, own numbers)', undefined, slope(-3, '−3'), 'Take care with the negatives: 1 − (−2) is 1 + 2.', pointsModel([-2, 5], [1, -4]), gradientSlips(-9, 3))
practice(fromPoints, 'Work out the gradient of the line that passes through (−3, −2) and (3, 1).', 'GR1 p70 Example 1 (a fraction, own numbers)', undefined, slope(0.5, '1/2'), 'The change in y is smaller than the change in x, so the answer is a fraction.', pointsModel([-3, -2], [3, 1]), gradientSlips(3, 6))
practice(fromPoints, 'Work out the gradient of the line that passes through (5, 1) and (1, 9).', 'GR1 p70 Example 1 (same order)', undefined, slope(-2, '−2'), 'Subtract in the same order both times: 9 − 1, then 1 − 5.', pointsModel([5, 1], [1, 9], 'Take the first point’s y from the second point’s y.', 'Same order: the second point’s x take away the first’s. The second point is to the left, so it is negative.'), [
  [2, 'Take both coordinates in the same order. If you start with 9 − 1, the x’s must be 1 − 5, which is −4.'],
  [-0.5, 'That’s the change in x ÷ the change in y. The gradient is the change in y ÷ the change in x.'],
  [8, 'That’s only the change in y. Divide it by the change in x, 1 − 5 = −4.'],
])
{
  const a: [number, number] = [1, 3], b: [number, number] = [3, 9]
  practice(fromPoints, 'Sam works out the gradient of the line through (1, 3) and (3, 9) as (3 − 1) ÷ (9 − 3) = 1/3. Is Sam correct?', 'GR1 p70 Gradient formula (a common mistake)', undefined, pickOne(choose(
    'No: it is 3. Sam divided the change in x by the change in y',
    ['Yes: the differences are 2 and 6', 'Which goes on top? The gradient is the change in y ÷ the change in x: 6 ÷ 2.'],
    ['No: it is −3', 'The line goes up from (1, 3) to (3, 9), so the gradient is positive.'],
    ['No: it is 6', '6 is only the change in y. Divide it by the change in x, 2.'],
  )), 'Which change goes on top: x or y?', pointsModel(a, b))
}

add('mixed', 'Straight line graphs', 'GR1 consolidation', text(
  'y = a number is a horizontal line, across. x = a number is a vertical line, up and down.',
  'Gradient = change in y ÷ change in x: how far up for every one across.',
  'From two points: subtract the y’s and the x’s in the same order, then divide.',
  'Going up from left to right: a positive gradient. Going down: a negative gradient.',
))

export const tutorStraightLineGraphsLesson: TutorMethodLesson = {
  id: 'L026', number: 26, title: 'Straight line graphs', level: 'GCSE Foundation',
  goal: 'Draw horizontal and vertical lines, and find the gradient of a straight line from a graph or from two points.',
  labels: { [lines]: 'Across and up', [fromGraph]: 'Gradient from a graph', [fromPoints]: 'Gradient from two points', mixed: 'Review' },
  states: finish(),
}
