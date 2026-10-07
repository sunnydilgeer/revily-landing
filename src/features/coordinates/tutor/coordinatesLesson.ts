import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorWorking } from '../../written-methods/tutor/model'
import type { GraphBoardSpec } from '../../written-methods/tutor/GraphBoard'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { choose, text } from '../../inequalities/tutor/inequalityWorkings'
import { figure, graphModel, grid, pt, type GraphGrid } from '../../straight-line-graphs/tutor/graphWorkings'
import { at, board, midGrid, midpoint, midpointMoves, midpointSlips, pair, plotMoves, pointSlips, readMoves } from './coordinateWorkings'
import type { GraphPoint } from '../../written-methods/tutor/methodWorking'

/*
 * Graphs lesson 1: Coordinates. From GR3 in Sunny's revision book (p74–75), with our own numbers; the storyboard is
 * /mnt/project-files/lessons/graphs/L1-coordinates/STORYBOARD.md. Three rungs, easiest first: across, then up; all four
 * quadrants; the midpoint. Hands-on (Sunny, 7 Oct): each rung opens with a play screen on the graph board, and the
 * questions are mostly plotting, walking and dragging the dot. Multiple choice only for the one concept check.
 *
 * Hidden on live: it is not in the course registry, so no curriculum, contents, search, cards or practice show it. It
 * opens only at its unlisted preview page (app/preview/graphs-1-c7d2e94a/). Graphs lessons are numbered from 101 while
 * they are hidden, so they never share a number (or saved progress) with Aniksha's lessons.
 */

export const COORDINATES_PREVIEW_ID = 'graphs-1-c7d2e94a'
const { add, finish } = author(101)
const across = 'graphs-coordinates'
const quadrants = 'graphs-quadrants'
const middle = 'graphs-midpoint'

/* ---------- Screens ---------- */

/** Brackets never break across two lines on a phone: "(4, −3)" stays together. */
const keep = (words: string) => words.replace(/\((−?[\d.]+), (−?[\d.]+)\)/g, '($1,\u00a0$2)')

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
/** A play screen: the graph board with no right answer, and one sentence to do. */
function explore(topic: MicroSkillId, title: string, sourceRef: string, spec: GraphBoardSpec) {
  const state = add(topic, keep(title), sourceRef, text(keep(title)))
  state.board = spec
}
function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: TutorWorking, body: string) {
  const state = add(topic, keep(title), sourceRef, model, undefined, undefined, undefined, body)
  state.content.heading = keep(heading)
  return state
}
type Answer = { interaction: InteractionDefinition; board?: GraphBoardSpec; picture?: GraphGrid }
/** A question: answered on the graph board, or typed under its picture; its working one move a step. */
function practice(topic: MicroSkillId, title: string, sourceRef: string, answer: Answer, hint: string, model: TutorWorking, diagnose: (response: string) => string | null) {
  const { interaction } = answer
  const state = add(topic, keep(title), sourceRef, answer.picture ? figure(answer.picture) : text(keep(title)), interaction, working(interaction.displayAnswer ?? '', ...workingSteps(model)), hint)
  state.working = model
  state.board = answer.board
  state.diagnose = diagnose
  return state
}
/** The point on the question's grid, read one move a step. */
const plotModel = (p: GraphPoint, x: [number, number], y: [number, number]) => graphModel(pair(p), grid(x, y), plotMoves(p), 'Across, then up')
const dot = (p: GraphPoint, x: [number, number], y: [number, number]) => grid(x, y, [], [{ ...p, label: '' }])
const readModel = (p: GraphPoint, x: [number, number], y: [number, number]) => graphModel('the dot', dot(p, x, y), readMoves(p), 'Read it')
const midModel = (a: GraphPoint, b: GraphPoint) => graphModel(`${pair(a)} and ${pair(b)}`, midGrid(a, b), midpointMoves(a, b), 'Halfway')

/** Plot, walk or drag to p on a grid x by y. */
function onBoard(mode: GraphBoardSpec['mode'], topic: MicroSkillId, title: string, sourceRef: string, p: GraphPoint, x: [number, number], y: [number, number], hint: string, start?: GraphPoint) {
  return practice(topic, title, sourceRef, { interaction: at(p), board: board(mode, grid(x, y), start) }, hint, plotModel(p, x, y), pointSlips(p))
}
/** Type the brackets of the dot on a grid. */
function readDot(topic: MicroSkillId, sourceRef: string, p: GraphPoint, x: [number, number], y: [number, number], hint: string) {
  return practice(topic, 'Write down the coordinates of the dot.', sourceRef, { interaction: at(p, true), picture: dot(p, x, y) }, hint, readModel(p, x, y), pointSlips(p))
}

/* ---------- Rung 1: across, then up ---------- */

explore(across, 'Drag the dot. Watch its brackets.', 'GR3 p74 Plotting a point (play)', board('explore', grid([-1, 7], [-1, 6]), pt(2, 3)))
worked(across, 'Plot the point (4, 2).', 'Plot (4, 2)', 'GR3 p74 Plotting a point (own numbers)', plotModel(pt(4, 2), [-1, 7], [-1, 5]),
  'Coordinates are across, then up: the first number is across (x), the second is up (y).').video = {
  id: 'graphs-1-coordinates', src: `/media/${COORDINATES_PREVIEW_ID}/coordinates.mp4`, poster: `/media/${COORDINATES_PREVIEW_ID}/coordinates.svg`,
  title: 'Where is the point? Coordinates', durationSeconds: 64, sourceFile: 'GR3.1_Coordinates.mp4 (tools/lesson-kit/packs/GR3.1-coordinates.cjs)',
  textAlternative: [
    'Coordinates say where a point is: across, then up.',
    'Plot (4, 2): the first number, 4, is across; the second, 2, is up. Start at 0, go along the x axis to 4, then straight up 2.',
    'Plot (−3, 2): a negative x goes left of 0, so go left 3, then up 2.',
    'Read the dot at (−2, −4): up to the x axis gives x = −2, across to the y axis gives y = −4.',
    'The midpoint of (1, 2) and (7, 6): halfway across is (1 + 7) ÷ 2 = 4, halfway up is (2 + 6) ÷ 2 = 4, so the midpoint is (4, 4).',
    'Recap: across first, then up. Negative x goes left and negative y goes down. Midpoint: add and halve, the x numbers and the y numbers.',
  ],
}
worked(across, 'Write down the coordinates of the dot.', 'Read the dot', 'GR3 p74 Reading a point (own numbers)', readModel(pt(3, 5), [-1, 6], [-1, 7]),
  'To read a point: down to the x axis for the first number, across to the y axis for the second.')
onBoard('walk', across, 'Walk to (5, 1): across, then up.', 'GR3 p74 Plotting a point (walk)', pt(5, 1), [-1, 7], [-1, 5], 'Drag the amber handle across 5 first, then the blue handle up 1.')
onBoard('plot', across, 'Tap the grid to plot (6, 3).', 'GR3 p75 Q1 (own numbers)', pt(6, 3), [-1, 8], [-1, 5], 'Across 6 along the x axis, then up 3.')
onBoard('drag', across, 'Drag the dot to (2, 4).', 'GR3 p75 Q1 (own numbers)', pt(2, 4), [-1, 7], [-1, 6], 'The first number, 2, is across. The second, 4, is up.', pt(5, 1))
readDot(across, 'GR3 p74 Reading a point (own numbers)', pt(1, 5), [-1, 6], [-1, 7], 'Look down to the x axis first, then across to the y axis.')
onBoard('plot', across, 'Tap the grid to plot (0, 4).', 'GR3 p74 Points on an axis', pt(0, 4), [-2, 6], [-1, 6], 'Across 0 means you don’t move across at all.')

/* ---------- Rung 2: all four quadrants ---------- */

explore(quadrants, 'Drag the dot into all four corners of the grid. Watch the signs.', 'GR3 p74 Four quadrants (play)', board('explore', grid([-4, 4], [-4, 4]), pt(2, 2)))
worked(quadrants, 'Plot the point (−3, 2).', 'Plot (−3, 2)', 'GR3 p74 Plotting a point (negatives, own numbers)', plotModel(pt(-3, 2), [-4, 4], [-3, 4]),
  'A negative x goes left of 0. A negative y goes down, below 0.')
worked(quadrants, 'Write down the coordinates of the dot.', 'Read the dot', 'GR3 p74 Reading a point (negatives, own numbers)', readModel(pt(-2, -4), [-4, 4], [-5, 3]),
  'Left of the y axis, x is negative. Below the x axis, y is negative.')
onBoard('walk', quadrants, 'Walk to (4, −3): across, then down.', 'GR3 p74 Four quadrants (walk)', pt(4, -3), [-2, 6], [-5, 3], 'Across 4 first. Then −3 goes down.')
onBoard('plot', quadrants, 'Tap the grid to plot (−1, 3).', 'GR3 p75 Q2 (own numbers)', pt(-1, 3), [-4, 4], [-4, 4], 'Negative 1 across means 1 to the left. Then up 3.')
onBoard('drag', quadrants, 'Drag the dot to (−5, −1).', 'GR3 p75 Q2 (own numbers)', pt(-5, -1), [-7, 2], [-4, 4], 'Both numbers are negative: left 5, then down 1.', pt(1, 2))
readDot(quadrants, 'GR3 p74 Points on an axis (own numbers)', pt(0, -2), [-4, 4], [-4, 3], 'The dot is on the y axis. How far across is it?')
onBoard('plot', quadrants, 'Tap the grid to plot (3, 0).', 'GR3 p74 Points on an axis (own numbers)', pt(3, 0), [-4, 5], [-3, 4], 'Up 0 means you don’t move up at all.')

/* ---------- Rung 3: the midpoint ---------- */

explore(middle, 'Drag the dot until both halves of the line match.', 'GR3 p74 Midpoint of a line (play)', board('midpoint', { x: [-1, 8], y: [-1, 6] }, pt(2, 4), [pt(1, 1), pt(7, 5)]))
worked(middle, 'Find the midpoint of the line from (1, 2) to (7, 6).', 'Midpoint of the line', 'GR3 p74 Midpoint of a line (own numbers)', midModel(pt(1, 2), pt(7, 6)),
  'The midpoint is halfway across and halfway up: add the two x numbers and halve, then add the two y numbers and halve.')
worked(middle, 'Find the midpoint of (−2, 5) and (4, −3).', 'Midpoint of (−2, 5) and (4, −3)', 'GR3 p74 Midpoint, coordinates only (own numbers)', midModel(pt(-2, 5), pt(4, -3)),
  'With only the coordinates, do the same: the x numbers, then the y numbers, each added and halved.')
{
  const a = pt(2, 1), b = pt(6, 5)
  practice(middle, 'Drag the dot to the midpoint of the line.', 'GR3 p75 Q3 (own numbers)', { interaction: at(midpoint(a, b)), board: board('drag', midGrid(a, b), pt(1, 4)) },
    'Halfway between 2 and 6 across, then halfway between 1 and 5 up.', midModel(a, b), midpointSlips(a, b))
}
{
  const a = pt(-3, 4), b = pt(3, 0)
  practice(middle, 'Tap the grid to plot the midpoint of the line.', 'GR3 p75 Q3 (own numbers)', { interaction: at(midpoint(a, b)), board: board('plot', midGrid(a, b)) },
    'Add the two x numbers and halve: −3 and 3. Then the two y numbers.', midModel(a, b), midpointSlips(a, b))
}
for (const [a, b, hint] of [
  [pt(-5, -1), pt(1, 7), 'Add the x numbers, −5 + 1, and halve. Then the y numbers.'],
  [pt(0, 3), pt(5, -4), 'A midpoint can be a half: halfway between 0 and 5 is 2.5.'],
  [pt(-7, -2), pt(-1, -6), 'Both points are left of the y axis and below the x axis, so the midpoint is too.'],
] as const) {
  practice(middle, `Find the midpoint of ${pair(a)} and ${pair(b)}.`, 'GR3 p75 Q3 (own numbers)', { interaction: at(midpoint(a, b), true) }, hint, midModel(a, b), midpointSlips(a, b))
}
{
  const a = pt(2, 4), b = pt(6, 8)
  const question = keep('Sam says the midpoint of (2, 4) and (6, 8) is (8, 12). What went wrong?')
  const state = add(middle, question, 'GR3 p74 Midpoint (a common mistake)', text(question), choose(
    keep('Sam added but didn’t halve: it is (4, 6)'),
    ['Nothing: Sam is right', '(8, 12) is outside both points. A midpoint is between them: halve the totals.'],
    ['Sam should have subtracted: it is (4, 4)', 'Subtracting gives the distance, not the middle. Add, then halve.'],
    ['Sam swapped x and y: it is (12, 8)', 'The order is fine. The totals still need halving.'],
  ), undefined, 'Is (8, 12) between the two points?')
  state.working = midModel(a, b)
}

add('mixed', 'Coordinates', 'GR3 consolidation', text(
  'Coordinates are across, then up: (x, y).',
  'A negative x goes left of 0, and a negative y goes down.',
  'On the y axis x is 0, and on the x axis y is 0.',
  'Midpoint: add the two x numbers and halve, then add the two y numbers and halve.',
))

export const tutorCoordinatesLesson: TutorMethodLesson = {
  id: 'L101', number: 101, title: 'Coordinates', level: 'GCSE Foundation',
  goal: 'Plot and read points in all four quadrants, across then up, and find the midpoint of a line.',
  labels: { [across]: 'Across, then up', [quadrants]: 'All four quadrants', [middle]: 'The midpoint', mixed: 'Review' },
  states: finish(),
}
