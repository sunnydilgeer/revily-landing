import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorWorking } from '../../written-methods/tutor/model'
import type { GraphBoardSpec } from '../../written-methods/tutor/GraphBoard'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { choose, text } from '../../inequalities/tutor/inequalityWorkings'
import { figure, graphModel, grid, type GraphGrid } from '../../straight-line-graphs/tutor/graphWorkings'
import { lineAnswer as drawnLine } from '../../lines/tutor/lineWorkings'
import { drawSlips, type Move } from '../../gradient/tutor/equationWorkings'
import { ends, line, named, type Line } from '../../parallel-lines/tutor/parallelWorkings'
import { crossing, crossingSlips, gridWith, solveMoves, xy } from './simultaneousGraphWorkings'

/*
 * Graphs lesson 5: Simultaneous equations by graph. From GR7 (p84–85), with our own numbers. Three rungs, easiest
 * first: the solution is where the two lines cross (read it off); draw both lines, then read it (the worked example:
 * y = 2x − 5 and y = −x + 4, crossing at (3, 1)); and rearrange first, when an equation isn't y = mx + c (Your Turn
 * Q2 and Q3: 2y + 3x = −3, 3y + x = −4). Every working checks the crossing in both equations before the answer.
 * Hands-on (Sunny, 7 Oct): drag a dot onto both lines, draw the second line, tap where they cross.
 *
 * Hidden on live like lessons 1–4: only the hidden Graphs shelf opens it. Numbered 105.
 */

export const SIMULTANEOUS_MEDIA_ID = 'graphs-5-cd14d0ef'
const { add, finish } = author(105)
const read = 'graphs-simultaneous-read'
const draw = 'graphs-simultaneous-draw'
const rearrange = 'graphs-simultaneous-rearrange'

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
const at = (a: Line, b: Line): InteractionDefinition => { const p = crossing(a, b); return { type: 'numericInput', acceptanceRule: 'numberList', correctAnswer: `${p.x}, ${p.y}`, displayAnswer: `x = ${p.x}, y = ${p.y}`.replace(/-/g, '−'), signed: true } }

/** Tap where the two drawn lines cross. */
function tapCrossing(topic: MicroSkillId, title: string, a: Line, b: Line, x: Range, y: Range, sourceRef: string, hint: string, labels?: [string, string]) {
  const start = gridWith([[a, labels?.[0]], [b, labels?.[1]]], x, y)
  return practice(topic, title, sourceRef, { interaction: at(a, b), board: { mode: 'plot', grid: start } }, hint,
    graphModel(`${labels?.[0] ?? named(a)} and ${labels?.[1] ?? named(b)}`, start, solveMoves(a, b, { given: 2, labels }), 'Where they cross'), crossingSlips(a, b))
}
/** Draw the second line on the board, the first already drawn. */
function drawSecond(topic: MicroSkillId, title: string, a: Line, b: Line, x: Range, y: Range, sourceRef: string, hint: string, moves: Move[] = [], label?: string) {
  const start = gridWith([[a]], x, y)
  return practice(topic, title, sourceRef, { interaction: { ...drawnLine(...ends(b)), displayAnswer: named(b) }, board: { mode: 'line', grid: start, line: ends(b) } }, hint,
    graphModel(`${named(a)} and ${label ?? named(b)}`, start, solveMoves(a, b, { given: 1, movesB: moves, labels: [named(a), label ?? named(b)] }), 'Draw, then read'),
    drawSlips(b.top, b.bottom, b.c))
}

/* ---------- Rung 1: where the lines cross ---------- */

explore(read, 'Drag the dot. Can you put it on both lines at once?', 'GR7 p84 Two linear graphs (play)',
  { mode: 'explore', grid: gridWith([[line(1, 1)], [line(-1, 5)]], [-2, 6], [-2, 7]), start: { x: 0, y: 1 } })
{
  const a = line(2, -1), b = line(-1, 5)
  worked(read, 'Use the graph to solve the simultaneous equations y = 2x − 1 and y = −x + 5.', 'Solve y = 2x − 1 and y = −x + 5', 'GR7 p84 Two linear graphs (own numbers)',
    graphModel('y = 2x − 1 and y = −x + 5', gridWith([[a], [b]], [-2, 5], [-2, 7]), solveMoves(a, b, { given: 2 }), 'Where they cross'),
    'Simultaneous equations are both true at the same time, for the same x and y. Each one is a straight line, and the one point on both lines is where they cross: its x and y are the solution.').video = {
    id: 'graphs-5-simultaneous', src: `/media/${SIMULTANEOUS_MEDIA_ID}/simultaneous.mp4`, poster: `/media/${SIMULTANEOUS_MEDIA_ID}/simultaneous.svg`,
    title: 'Simultaneous equations by graph', durationSeconds: 74, sourceFile: 'GR7.1_Simultaneous_equations_by_graph.mp4 (tools/lesson-kit/packs/GR7.1-simultaneous-equations-by-graph.cjs)',
    textAlternative: [
      'Simultaneous equations are true at the same time, for the same x and y. Each one is a straight line.',
      'Draw y = 2x − 3: start at −3 on the y axis, then across 1 and up 2. Draw y = −x + 3: start at 3, then across 1 and down 1.',
      'The one point on both lines is where they cross: (2, 1). Read x = 2 down on the x axis and y = 1 across on the y axis.',
      'Check in both: 2 × 2 − 3 = 1 and −2 + 3 = 1. Both give y = 1, so the solution is x = 2, y = 1.',
      'If an equation isn’t y = mx + c, make y the subject first: 2y + x = 4 becomes y = −½x + 2.',
    ],
  }
}
tapCrossing(read, 'Tap the point that solves both equations.', line(1, 2), line(-1, 4), [-2, 5], [-1, 6], 'GR7 p85 Q1 (own numbers)', 'The point on both lines: where they cross.')
{
  const a = line(3, -2), b = line(1, 2), p = crossing(a, b), start = gridWith([[a], [b]], [-2, 5], [-3, 7])
  practice(read, 'Use the graph to solve y = 3x − 2 and y = x + 2.', 'GR7 p85 Q1 (own numbers)', { interaction: xy(p), picture: start },
    'Read where the lines cross: x first, then y.', graphModel('y = 3x − 2 and y = x + 2', start, solveMoves(a, b, { given: 2 }), 'Where they cross'), crossingSlips(a, b))
}
tapCrossing(read, 'Tap the point that solves both equations.', line(-2, -1), line(1, 2), [-4, 3], [-3, 5], 'GR7 p85 Q1 (own numbers)', 'Where the lines cross. It can be left of the y axis.')
{
  const a = line(2, -3), b = line(-1, 3), start = gridWith([[a], [b]], [-2, 5], [-4, 5])
  practice(read, 'The lines y = 2x − 3 and y = −x + 3 cross at one point. What does that point tell you?', 'GR7 p84 Two linear graphs (concept)', { interaction: choose(
    'The x and y that make both equations true',
    ['Only the answer to y = 2x − 3', 'The point is on both lines, so its x and y work in both equations.'],
    ['The gradients of the two lines', 'The gradients are how steep each line is. Where they cross is a point: an x and a y.'],
    ['Where each line crosses the y axis', 'That’s c for each line. The solution is where the two lines cross each other.'],
  ), picture: start }, 'A point on a line makes its equation true.', graphModel('y = 2x − 3 and y = −x + 3', start, solveMoves(a, b, { given: 2 }), 'Where they cross'))
}

/* ---------- Rung 2: draw both, then read ---------- */

{
  const a = line(2, -3), b = line(-1, 3)
  worked(draw, 'By drawing their graphs, solve y = 2x − 3 and y = −x + 3.', 'Draw y = 2x − 3 and y = −x + 3', 'GR7 p84 Example: plotting both graphs (own numbers)',
    graphModel('y = 2x − 3 and y = −x + 3', grid([-2, 5], [-4, 5]), solveMoves(a, b), 'Draw, then read'),
    'Draw both lines on the same grid. Each is y = mx + c: start at c on the y axis and step the gradient. Then read where they cross, and check it in both.')
}
drawSecond(draw, 'y = x + 1 is drawn. Draw y = −2x + 4 on the same grid.', line(1, 1), line(-2, 4), [-2, 4], [-3, 6], 'GR7 p85 Q1 (own numbers)', 'Start at 4 on the y axis, then across 1 and down 2.')
tapCrossing(draw, 'Now tap where y = x + 1 and y = −2x + 4 cross.', line(1, 1), line(-2, 4), [-2, 4], [-3, 6], 'GR7 p85 Q1 (own numbers)', 'Where the two lines cross: x first, then y.')
drawSecond(draw, 'y = 2x − 1 is drawn. Draw y = −x − 4 on the same grid.', line(2, -1), line(-1, -4), [-4, 3], [-6, 3], 'GR7 p85 Q1 (own numbers)', 'Start at −4 on the y axis, then across 1 and down 1.')
{
  const a = line(2, -1), b = line(-1, -4), p = crossing(a, b), start = gridWith([[a], [b]], [-4, 3], [-6, 3])
  practice(draw, 'Use your graph to solve y = 2x − 1 and y = −x − 4.', 'GR7 p85 Q1 (own numbers)', { interaction: xy(p), picture: start },
    'Read the crossing: down to the x axis, across to the y axis.', graphModel('y = 2x − 1 and y = −x − 4', start, solveMoves(a, b, { given: 2 }), 'Where they cross'), crossingSlips(a, b))
}

/* ---------- Rung 3: rearrange first ---------- */

{
  const a = line(1, -1), b = line(-1, 2, 2)
  worked(rearrange, 'By drawing their graphs, solve y = x − 1 and 2y + x = 4.', 'Solve y = x − 1 and 2y + x = 4', 'GR7 p85 Q2 Rearrange first (own numbers)',
    graphModel('y = x − 1 and 2y + x = 4', grid([-2, 6], [-3, 5]), solveMoves(a, b, { movesB: [['Take x from both sides', '2y = −x + 4', 'To draw 2y + x = 4, get it into y = mx + c first. Take x from both sides.'], ['Divide by 2', 'y = −½x + 2', 'Divide every term by 2, so y is on its own.']], labels: ['y = x − 1', '2y + x = 4'] }), 'Make y the subject'),
    'An equation that isn’t y = mx + c gets rearranged first, so you can draw it from c and its gradient. Then it’s the same: draw both, read where they cross, check.')
}
drawSecond(rearrange, 'y = 2x − 5 is drawn. Draw 3y + x = 6 on the same grid.', line(2, -5), line(-1, 2, 3), [-2, 6], [-6, 4], 'GR7 p85 Q3 (own numbers)',
  'Make y the subject: y = −⅓x + 2. Start at 2 on the y axis, then across 3 and down 1.',
  [['Take x from both sides', '3y = −x + 6', 'Get the y term on its own first.'], ['Divide by 3', 'y = −⅓x + 2', 'Divide every term by 3.']], '3y + x = 6')
tapCrossing(rearrange, 'Now tap the point that solves y = 2x − 5 and 3y + x = 6.', line(2, -5), line(-1, 2, 3), [-2, 6], [-6, 4], 'GR7 p85 Q3 (own numbers)', 'Where the lines cross: x first.', ['y = 2x − 5', '3y + x = 6'])
{
  const a = line(2, 3), b = line(-2, -1), p = crossing(a, b), start = gridWith([[a, 'y = 2x + 3'], [b, '2y + 4x = −2']], [-4, 3], [-4, 5])
  practice(rearrange, 'The graphs of y = 2x + 3 and 2y + 4x = −2 are drawn. Use them to solve the equations.', 'GR7 p85 Q2 (own numbers)', { interaction: xy(p), picture: start },
    'Read where the lines cross. You can check it in both equations.', graphModel('y = 2x + 3 and 2y + 4x = −2', start, solveMoves(a, b, { given: 2, labels: ['y = 2x + 3', '2y + 4x = −2'] }), 'Where they cross'), crossingSlips(a, b))
}

add('mixed', 'Simultaneous equations by graph', 'GR7 consolidation', text(
  'Simultaneous equations are both true at the same time, for the same x and y.',
  'Each equation is a straight line. Make y the subject first if it isn’t y = mx + c.',
  'Draw both lines on the same grid: start at c, then step the gradient.',
  'The solution is where they cross: read x down to the x axis and y across to the y axis.',
  'Check it: put x into both equations and both should give the same y.',
))

export const tutorSimultaneousGraphsLesson: TutorMethodLesson = {
  id: 'L105', number: 105, title: 'Simultaneous equations by graph', level: 'GCSE Foundation',
  goal: 'Solve a pair of simultaneous equations by drawing both lines and reading where they cross, rearranging an equation into y = mx + c first if needed.',
  labels: { [read]: 'Where the lines cross', [draw]: 'Draw both, then read', [rearrange]: 'Rearrange first', mixed: 'Review' },
  states: finish(),
}
