import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorWorking } from '../../written-methods/tutor/model'
import type { GraphBoardSpec } from '../../written-methods/tutor/GraphBoard'
import type { GraphPoint } from '../../written-methods/tutor/methodWorking'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { text } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, figure, graphModel, grid, pt, type GraphGrid } from '../../straight-line-graphs/tutor/graphWorkings'
import {
  across, at, column, ends, lineAnswer, named, pair, plotMoves, rule, ruleLineSlips, straightMoves, straightSlips, sum, tableMoves, tableOf, through,
  upDown, value, valueSlips, yOf, type Rule, type Straight,
} from './lineWorkings'

/*
 * Graphs lesson 2: Lines from coordinates. From GR1's first box (p70: lines across and up and down) and GR4 method 1
 * (p76–77: a table of values, then plot and join), with our own numbers; the storyboard is
 * /mnt/project-files/lessons/graphs/L2-lines-from-coordinates/STORYBOARD.md. Three rungs, easiest first: lines across
 * and up and down; a table of values; plot and join. Hands-on (Sunny, 7 Oct): each rung opens with a play screen on the
 * graph board, and most questions are drawing lines and moving dots. No multiple choice.
 *
 * Hidden on live like lesson 1: not in the course registry; it opens only at its unlisted preview page
 * (app/preview/graphs-2-1bc88dee/). Numbered 102, clear of Aniksha's lesson numbers.
 */

export const LINES_PREVIEW_ID = 'graphs-2-1bc88dee'
const { add, finish } = author(102)
const straight = 'graphs-straight-lines'
const table = 'graphs-table-of-values'
const join = 'graphs-plot-and-join'

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
function practice(topic: MicroSkillId, title: string, sourceRef: string, answer: Answer, hint: string, model: TutorWorking, diagnose: (response: string) => string | null) {
  const { interaction } = answer
  const state = add(topic, keep(title), sourceRef, answer.picture ? figure(answer.picture) : text(keep(title)), interaction, working(interaction.displayAnswer ?? interaction.correctAnswer as string, ...workingSteps(model)), hint)
  state.working = model
  state.board = answer.board
  state.diagnose = diagnose
  if (answer.prefix) state.answerPrefix = answer.prefix
  return state
}

type Range = [number, number]
/** Points on the line, three across it (or up it), on a grid x by y. */
const straightModel = (s: Straight, along: number[], x: Range, y: Range, given: GraphPoint[] = []) =>
  graphModel(named(s), grid(x, y, [], given), straightMoves(s, along), s.axis === 'y' ? 'Across' : 'Up and down')
/** The rule's table, filled in x by x, each point dropping onto the grid. */
const tableModel = (r: Rule, xs: number[], x: Range, y: Range) => graphModel(r.text, { ...grid(x, y), table: tableOf(r, xs) }, tableMoves(r, xs), 'Fill the table')
/** The finished table, plotted column by column, then joined. */
const plotModel = (r: Rule, xs: number[], x: Range, y: Range) => graphModel(r.text, { ...grid(x, y), table: tableOf(r, xs, xs.map((_, i) => i)) }, plotMoves(r, xs), 'Plot and join')
/** One column of a table worked out; the others are already there, with their points. */
function columnModel(r: Rule, xs: number[], i: number, x: Range, y: Range) {
  const others = xs.map((_, j) => j).filter(j => j !== i)
  const start = { ...grid(x, y, [], others.map(j => ({ ...pt(xs[j], yOf(r, xs[j])), label: '' }))), table: tableOf(r, xs, others) }
  const move = answerMove(`y = ${String(yOf(r, xs[i])).replace('-', '−')}`, `x = ${String(xs[i]).replace('-', '−')}`, `Put the x into the rule: ${r.words}.`, [], column(r, i, true))
  return graphModel(r.text, start, [{ ...move, equation: move.equation }], 'Put x in')
}

/* ---------- Rung 1: lines across and up and down ---------- */

explore(straight, 'Drag the dot along y = 3. Which number never changes?', 'GR1 p70 Horizontal and vertical lines (play)',
  { mode: 'rule', rule: { m: 0, c: 3 }, grid: grid([-4, 5], [-1, 5], [{ from: pt(0, 3), to: pt(1, 3), label: 'y = 3' }]), start: pt(-2, 3) })
worked(straight, 'Draw the line y = 3.', 'Draw y = 3', 'GR1 p70 Horizontal lines (own numbers)', straightModel(across(3), [-3, 1, 3], [-4, 5], [-1, 5]),
  'Every point on y = 3 has y 3, whatever its x. So the line goes straight across.').video = {
  id: 'graphs-2-lines', src: `/media/${LINES_PREVIEW_ID}/lines.mp4`, poster: `/media/${LINES_PREVIEW_ID}/lines.svg`,
  title: 'From a rule to a line', durationSeconds: 57, sourceFile: 'GR4.1_Lines_from_coordinates.mp4 (tools/lesson-kit/packs/GR4.1-lines-from-coordinates.cjs)',
  textAlternative: [
    'A line is made of points that follow a rule: here is how to go from a rule to a line.',
    'The line y = 3: every point on it, like (−3, 3), (1, 3) and (3, 3), has y 3, so it goes across.',
    'A table for y = 2x − 1: put each x into the rule, double it and take 1, so x = −1, 0, 1, 2 give y = −3, −1, 1, 3.',
    'Plot each pair across, then up (or down); the four points line up, so join them with one straight line.',
    'Recap: y = a goes across and x = a goes up and down; put each x into the rule to fill the table; plot and join with one straight line.',
  ],
}
worked(straight, 'Draw the line x = −2.', 'Draw x = −2', 'GR1 p70 Vertical lines (own numbers)', straightModel(upDown(-2), [-1, 2, 4], [-4, 4], [-2, 5]),
  'Every point on x = −2 has x −2, whatever its y. So the line goes straight up and down.')
{
  const draw = (s: Straight, title: string, ref: string, x: Range, y: Range, along: number[], hint: string, given: GraphPoint[] = []) =>
    practice(straight, title, ref, { interaction: lineAnswer(...ends(s)), board: { mode: 'line', grid: grid(x, y, [], given), line: ends(s) } }, hint, straightModel(s, along, x, y, given), straightSlips(s))
  draw(across(-2), 'Draw the line y = −2.', 'GR1 p70 Q1 (own numbers)', [-4, 5], [-4, 3], [-3, 0, 3], 'Every point on it has y −2. Tap two of them.')
  draw(upDown(4), 'Draw the line x = 4.', 'GR1 p70 Q1 (own numbers)', [-2, 6], [-2, 5], [-1, 1, 3], 'Every point on it has x 4. Tap two of them.')
  practice(straight, 'Write down the equation of the line.', 'GR1 p70 Q2 (own numbers)',
    { interaction: value(3), picture: grid([-2, 5], [-2, 5], [{ from: pt(3, 0), to: pt(3, 1) }]), prefix: 'x =' },
    'The line goes up and down, so every point on it has the same x.', straightModel(upDown(3), [-1, 1, 3], [-2, 5], [-2, 5]),
    response => /^\s*−?-?\d/.test(response) && Number(response.replace('−', '-')) === -3 ? 'The line is right of the y axis, so its x is positive.' : null)
  draw(across(-1), 'Draw the line across through (6, −1).', 'GR1 p70 Q3 (own numbers)', [-1, 8], [-3, 3], [0, 3, 6], 'Across means y stays the same. Which number is y?', [pt(6, -1)])
  draw(upDown(-4), 'Draw the line up and down through (−4, 2).', 'GR1 p70 Q3 (own numbers)', [-6, 3], [-2, 4], [-1, 0, 2], 'Up and down means x stays the same. Which number is x?', [pt(-4, 2)])
  practice(straight, 'The y axis is a straight line. Write down its equation.', 'GR1 p70 Axes', { interaction: value(0), picture: grid([-3, 4], [-3, 4]), prefix: 'x =' },
    'Every point on the y axis is 0 across.', straightModel(upDown(0), [-2, 1, 3], [-3, 4], [-3, 4]),
    response => /^\s*\d/.test(response) && Number(response) !== 0 ? 'On the y axis you don’t move across at all.' : null)
}

/* ---------- Rung 2: a table of values ---------- */

const double = rule(2, -1, 'y = 2x − 1', 'double it, then take 1')
explore(table, 'Slide the dot along y = 2x − 1. Watch the table fill in.', 'GR4 p76 Table of values (play)',
  { mode: 'rule', rule: { m: 2, c: -1 }, grid: { ...grid([-3, 4], [-4, 5]), table: tableOf(double, [-1, 0, 1, 2]) }, start: pt(0, -1) })
worked(table, 'Complete the table for y = 2x − 1.', 'Table for y = 2x − 1', 'GR4 p76 Method 1: table of values (own numbers)', tableModel(double, [-1, 0, 1, 2], [-3, 4], [-4, 5]),
  'Put each x into the rule to find its y.')
for (const [r, xs, i, x, y, hint, extra] of [
  [rule(1, 2, 'y = x + 2', 'add 2'), [-2, -1, 0, 1], 0, [-3, 3], [-1, 4], 'Start at −2 and add 2.', [[-4, 'x is −2, so add 2 to −2.']]],
  [rule(3, -2, 'y = 3x − 2', 'times 3, then take 2'), [-1, 0, 1, 2], 0, [-2, 3], [-6, 5], '3 × (−1) first, then take 2.', [[-1, 'Times 3 first: 3 × (−1) = −3. Then take 2.']]],
  [rule(-1, 4, 'y = 4 − x', 'start at 4 and take away x'), [0, 1, 2, 3], 3, [-1, 4], [-1, 5], 'Start at 4 and take away 3.', [[-1, 'Start at 4 and take away x: 4 − 3.'], [7, 'Take x away from 4, don’t add it.']]],
  [rule(0.5, 1, 'y = ½x + 1', 'halve it, then add 1'), [0, 2, 4, 6], 2, [-1, 7], [-1, 5], 'Half of 4, then add 1.', [[9, '½x means half of x: halve 4, don’t double it.'], [5, 'Halve 4 first, then add 1.']]],
  [rule(-2, 1, 'y = −2x + 1', 'times −2, then add 1'), [-2, -1, 0, 1], 0, [-3, 2], [-2, 6], '−2 × (−2) is positive. Then add 1.', [[-3, '−2 × (−2) is +4: two negatives make a positive.']]],
] as [Rule, number[], number, Range, Range, string, [number, string][]][]) {
  const filled = xs.map((_, j) => j).filter(j => j !== i)
  const picture = { ...grid(x, y, [], filled.map(j => ({ ...pt(xs[j], yOf(r, xs[j])), label: '' }))), table: { ...tableOf(r, xs, filled), ask: i } }
  practice(table, `${r.text}. Find y when x = ${String(xs[i]).replace('-', '−')}.`, 'GR4 p77 Q1 (own numbers)', { interaction: { ...value(yOf(r, xs[i])), displayAnswer: `y = ${String(yOf(r, xs[i])).replace('-', '−')}` }, picture, prefix: 'y =' },
    hint, columnModel(r, xs, i, x, y), valueSlips(r, xs[i], extra))
}

/* ---------- Rung 3: plot and join ---------- */

explore(join, 'Tap two points. Watch the line go through them.', 'GR4 p76 Plot and join (play)', { mode: 'line', grid: grid([-4, 5], [-3, 5]) })
worked(join, 'Draw the graph of y = 2x − 1.', 'Plot y = 2x − 1', 'GR4 p76 Method 1: plot and join (own numbers)', plotModel(double, [-1, 0, 1, 2], [-3, 4], [-4, 5]),
  'Each column of the table is a point. Plot them across, then up. They line up, so join them with one straight line.')
{
  const plus = rule(1, 1, 'y = x + 1', 'add 1')
  const xs = [-2, -1, 0, 1, 2]
  practice(join, 'Draw the graph of y = x + 1. Its table is filled in.', 'GR4 p77 Q2 (own numbers)',
    { interaction: lineAnswer(...through(plus)), board: { mode: 'line', grid: { ...grid([-3, 4], [-2, 5]), table: tableOf(plus, xs, xs.map((_, i) => i)) }, line: through(plus) } },
    'Each column is a point: tap two of them, across then up.', plotModel(plus, xs, [-3, 4], [-2, 5]), ruleLineSlips())
}
{
  const r = rule(2, 1, 'y = 2x + 1', 'double it, then add 1'), xs = [-1, 0, 1, 2]
  const right = xs.slice(0, 3).map(x => ({ ...pt(x, yOf(r, x)), label: '' }))
  practice(join, 'One point is wrong. Drag it to where y = 2x + 1 puts it.', 'GR4 p77 Checking points (own numbers)',
    { interaction: at(pt(2, 5)), board: { mode: 'drag', grid: { ...grid([-2, 4], [-2, 7], [], right), table: tableOf(r, xs, [0, 1, 2]) }, start: pt(2, 4) } },
    `Put x = 2 into the rule: ${sum(r, 2).replace(/ = .*/, '')}.`, columnModel(r, xs, 3, [-2, 4], [-2, 7]),
    response => response.replace(/\s/g, '') === '2,4' ? 'That’s where it started. Work out y for x = 2.' : null)
  practice(join, 'y = 2x + 1 is drawn. Tap its point where x = 3.', 'GR4 p77 Reading a line (own numbers)',
    { interaction: at(pt(3, 7)), board: { mode: 'plot', grid: grid([-2, 5], [-2, 9], [{ from: pt(0, 1), to: pt(1, 3) }]) } },
    'Across 3, then up to the line. Or put x = 3 into the rule.', graphModel(r.text, grid([-2, 5], [-2, 9], [{ from: pt(0, 1), to: pt(1, 3) }]), [
      answerMove(pair(pt(3, 7)), 'x = 3', `Put x = 3 into the rule: ${sum(r, 3)}.`, [], {
        title: '', say: '', equation: '', adds: 'picture',
        change: (frame, step) => ({ ...frame, points: [{ ...pt(3, 7), at: step, answer: true }], marks: [{ axis: 'x', value: 3, family: 1 }, { axis: 'y', value: 7, family: 0 }], working: [{ text: sum(r, 3), family: 0, at: step }] }),
      }),
    ], 'Put x in'),
    response => response.replace(/\s/g, '') === '7,3' ? 'Across first: x is 3.' : null)
}
{
  const r = rule(-1, 3, 'y = 3 − x', 'start at 3 and take away x'), xs = [-1, 0, 1, 2, 3]
  const filled = [1, 2, 3, 4]
  practice(join, 'y = 3 − x. Find y when x = −1.', 'GR4 p77 Q3 (own numbers)',
    { interaction: { ...value(4), displayAnswer: 'y = 4' }, picture: { ...grid([-2, 4], [-1, 5], [], filled.map(j => ({ ...pt(xs[j], yOf(r, xs[j])), label: '' }))), table: { ...tableOf(r, xs, filled), ask: 0 } }, prefix: 'y =' },
    'Start at 3 and take away −1: taking away a negative adds.', columnModel(r, xs, 0, [-2, 4], [-1, 5]),
    valueSlips(r, -1, [[2, 'Taking away −1 is the same as adding 1: 3 − (−1) = 4.'], [-4, 'Start at 3 and take away x: 3 − (−1).']]))
  practice(join, 'Now draw the graph of y = 3 − x.', 'GR4 p77 Q3 (own numbers)',
    { interaction: lineAnswer(...through(r)), board: { mode: 'line', grid: { ...grid([-2, 5], [-2, 5]), table: tableOf(r, xs, xs.map((_, i) => i)) }, line: through(r) } },
    'Tap two of the table’s points.', plotModel(r, xs, [-2, 5], [-2, 5]), ruleLineSlips())
}

add('mixed', 'Lines from coordinates', 'GR1 and GR4 consolidation', text(
  'y = 3 goes straight across: every point on it has y 3.',
  'x = −2 goes straight up and down: every point on it has x −2.',
  'A table of values: put each x into the rule to get its y.',
  'Each column is a point. Plot them across, then up, and join them with one straight line.',
))

export const tutorLinesLesson: TutorMethodLesson = {
  id: 'L102', number: 102, title: 'Lines from coordinates', level: 'GCSE Foundation',
  goal: 'Draw lines across and up and down, fill in a table of values from a rule, and plot it as a straight line.',
  labels: { [straight]: 'Across and up-and-down lines', [table]: 'Table of values', [join]: 'Plot and join', mixed: 'Review' },
  states: finish(),
}
