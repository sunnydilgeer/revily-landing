import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorWorking } from '../../written-methods/tutor/model'
import type { GraphBoardSpec } from '../../written-methods/tutor/GraphBoard'
import type { GraphPoint } from '../../written-methods/tutor/methodWorking'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { sameFormula } from '../../number-types/lessonMath'
import { diagnoseChoice } from '../../like-terms/tutor/likeTermsDiagnosis'
import { choose, text } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, gradient, graphModel, grid, pt, type GraphGrid } from '../../straight-line-graphs/tutor/graphWorkings'
import { gradientMoves } from '../../gradient/tutor/gradientWorkings'
import { lineSlips, typedLine, type Move } from '../../gradient/tutor/equationWorkings'
import { lineAnswer as drawnLine } from '../../lines/tutor/lineWorkings'
import { compareMoves, ends, gridWith, line, named, parallelSlips, parallelThrough, pickMoves, sameGradientMoves, throughMoves, type Line, type Option } from './parallelWorkings'

/*
 * Graphs lesson 4: Parallel lines. From GR5 (p79–81), with our own numbers. Three rungs, easiest first: parallel lines
 * have the same gradient (the teaching box: y = 3x + 3, y = 3x, y = 3x − 5); rearranging to compare m (the worked
 * example, 3y − 9x = 21, and Your Turn Q1 and Q3); and a line parallel to another through a point (Your Turn Q2).
 * Hands-on as in lessons 1–3 (Sunny, 7 Oct: Brilliant-style): tilting a line until it is parallel, building one with
 * m and c, and drawing one through a point. "Which are parallel" is a choose-all, as in the book.
 *
 * Hidden on live like lessons 1–3: only the hidden Graphs shelf opens it. Numbered 104.
 */

export const PARALLEL_MEDIA_ID = 'graphs-4-f35507d6'
const { add, finish } = author(104)
const sameGradient = 'graphs-parallel-gradient'
const rearrange = 'graphs-parallel-rearrange'
const through = 'graphs-parallel-through'

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
  const shown = interaction.displayAnswer ?? interaction.options?.filter(option => [interaction.correctAnswer].flat().map(String).includes(option.id)).map(option => option.label).join(' and ') ?? ''
  const state = add(topic, keep(title), sourceRef, text(keep(title)), interaction, working(shown, ...workingSteps(model)), hint)
  state.working = model
  state.board = answer.board
  if (diagnose) state.diagnose = diagnose
  if (answer.prefix) state.answerPrefix = answer.prefix
  return state
}

type Range = [number, number]
/** A line typed after "y =": any way of writing it passes. */
const typed = (l: Line): InteractionDefinition => ({ type: 'numericInput', responseShape: 'formula', acceptanceRule: 'formula', correctAnswer: typedLine(l.top, l.bottom, l.c), displayAnswer: named(l) })
/** Choose every line that fits; each wrong one has its own note. */
function chooseAll(options: [string, true | string][]): { interaction: InteractionDefinition; diagnose: (response: string) => string | null } {
  const notes = Object.fromEntries(options.flatMap(([, right], i) => right === true ? [] : [[String(i), right]]))
  return {
    interaction: { type: 'multiSelect', acceptanceRule: 'unorderedSet', options: options.map(([label], i) => ({ id: String(i), label })), correctAnswer: options.flatMap(([, right], i) => right === true ? [String(i)] : []) },
    diagnose: response => diagnoseChoice(response, notes),
  }
}
const pickModel = (question: string, target: Line | null, options: Option[], x: Range, y: Range) => graphModel(question, grid(x, y), pickMoves(target, options), 'Compare m')

/* ---------- Rung 1: same gradient ---------- */

explore(sameGradient, 'Tilt the blue line so it never meets the black one. Watch its gradient.', 'GR5 p79 Parallel lines (play)',
  { mode: 'tilt', grid: gridWith(line(2, -1), [-3, 5], [-3, 6]), ends: [pt(-2, 1), pt(1, 2)] })
{
  const lines = [line(2, 3), line(2, 0), line(2, -2)]
  worked(sameGradient, 'Are y = 2x + 3, y = 2x and y = 2x − 2 parallel?', 'Are y = 2x + 3, y = 2x and y = 2x − 2 parallel?', 'GR5 p79 Parallel lines: same gradient (own numbers)',
    graphModel('y = 2x + 3, y = 2x and y = 2x − 2', grid([-4, 4], [-4, 6]), sameGradientMoves(lines), 'Same gradient'),
    'Parallel lines are always the same distance apart, however far they go, so they never meet. They have the same gradient: the same m in y = mx + c.').video = {
    id: 'graphs-4-parallel', src: `/media/${PARALLEL_MEDIA_ID}/parallel.mp4`, poster: `/media/${PARALLEL_MEDIA_ID}/parallel.svg`,
    title: 'Parallel lines: the same gradient', durationSeconds: 70, sourceFile: 'GR5.1_Parallel_lines.mp4 (tools/lesson-kit/packs/GR5.1-parallel-lines.cjs)',
    textAlternative: [
      'Parallel lines are always the same distance apart, so they never meet.',
      'y = 2x + 3, y = 2x and y = 2x − 2 all have m = 2, the same gradient, so they are parallel. Only c, where each crosses the y axis, changes.',
      'Is y = 2x + 5 parallel to 4y − 8x = 12? Make y the subject first: add 8x to both sides, 4y = 8x + 12, then divide by 4, y = 2x + 3. Both have m = 2, so yes.',
      'The line parallel to y = 3x − 1 through (2, 4): the same gradient, 3. Put the point in: 4 = 3 × 2 + c, so 4 = 6 + c and c = −2. The line is y = 3x − 2.',
    ],
  }
}
{
  const a = pt(0, 2), b = pt(2, 0), start = gridWith(line(-1, 2), [-3, 4], [-3, 5])
  practice(sameGradient, 'The black line is y = −x + 2. Tilt the blue line until it is parallel to it.', 'GR5 p79 Same gradient (tilt)',
    { interaction: gradient(-1, 'Gradient = −1'), board: { mode: 'tilt', grid: start, ends: [pt(-2, -1), pt(1, 1)], target: -1 } },
    'Parallel means the same gradient. y = −x + 2 goes down 1 for every 1 across.', graphModel('y = −x + 2', start, gradientMoves(a, b), 'Up over across'),
    response => { const [up, across] = response.split('/').map(Number); return across && up / across === 1 ? 'Right steepness, but the black line goes down from left to right. Tilt yours down too.' : null })
}
{
  const target = line(4, -1)
  const { interaction, diagnose } = chooseAll([
    ['y = 4x + 7', true],
    ['y = −4x − 1', 'y = −4x − 1 has m = −4: it goes down. The sign matters.'],
    ['y = 1 + 4x', true],
    ['y = x − 4', 'y = x − 4 has m = 1. The 4 there is c, not the gradient.'],
  ])
  practice(sameGradient, 'Which lines are parallel to y = 4x − 1? Choose all that apply.', 'GR5 p79 Same gradient (own numbers)', { interaction }, 'Parallel lines have the same m: the number in front of x.',
    pickModel('Parallel to y = 4x − 1?', target, [{ text: 'y = 4x + 7', line: line(4, 7) }, { text: 'y = −4x − 1', line: line(-4, -1) }, { text: 'y = 1 + 4x', line: line(4, 1) }, { text: 'y = x − 4', line: line(1, -4) }], [-3, 3], [-4, 6]),
    diagnose)
}
practice(sameGradient, 'Write down the gradient of a line parallel to y = 5 − 3x.', 'GR5 p79 Same gradient (own numbers)', { interaction: gradient(-3, 'Gradient = −3'), prefix: 'Gradient =' },
  'Parallel lines have the same gradient. Which number goes with x?', graphModel('y = 5 − 3x', gridWith(line(-3, 5), [-2, 4], [-3, 7], [], 'y = 5 − 3x'), [
    { title: 'In order', equation: 'y = −3x + 5', adds: 'lines', say: 'Write it the usual way round: the x term first. 5 − 3x is the same as −3x + 5.', change: (frame, step) => ({ ...frame, working: [{ text: 'y = −3x + 5', family: 3, at: step }] }) },
    answerMove('Gradient = −3', 'Same gradient', 'Its m is −3, and a parallel line has the same gradient.', [0]),
  ], 'Same gradient'),
  response => response.trim() === '5' ? 'That’s c, where it crosses the y axis. The gradient is the number with x.' : response.trim() === '3' ? 'Keep the sign: it’s −3x.' : null)
{
  const given = line(2, 1), start = gridWith(given, [-4, 4], [-5, 6])
  practice(sameGradient, 'Make the line parallel to y = 2x + 1 that crosses the y axis at −3.', 'GR5 p79 Same gradient (own numbers)',
    { interaction: { type: 'numericInput', acceptanceRule: 'numberList', correctAnswer: '2, -3', displayAnswer: 'y = 2x − 3' }, board: { mode: 'equation', grid: start, rule: { m: 1, c: 0 }, equation: { m: 2, c: -3 } } },
    'Keep m the same as y = 2x + 1. c is where it crosses the y axis.', graphModel('y = 2x + 1', start, throughMoves(given, [], pt(0, -3)), 'm, then c'),
    response => response.replace(/\s/g, '') === '2,1' ? 'That’s the same line. Move c down to −3.' : response.split(',')[0]?.trim() !== '2' && response.replace(/\s/g, '').endsWith(',-3') ? 'Right c, but parallel needs the same m as y = 2x + 1: 2.' : null)
}

/* ---------- Rung 2: rearranging to compare m ---------- */

{
  const moves: Move[] = [['Add 8x to both sides', '4y = 8x + 12', 'Get it into y = mx + c first. Add 8x to both sides to get the y term on its own.'], ['Divide by 4', 'y = 2x + 3', 'Divide every term by 4, so y is on its own.']]
  worked(rearrange, 'Is the line y = 2x + 5 parallel to the line 4y − 8x = 12?', 'Is y = 2x + 5 parallel to 4y − 8x = 12?', 'GR5 p79 Example: parallel lines (own numbers)',
    graphModel('y = 2x + 5 and 4y − 8x = 12', grid([-4, 4], [-3, 8]), compareMoves(line(2, 5), line(2, 3), moves), 'Compare m'),
    'Parallel lines have the same m, so get both into y = mx + c. One already is; make y the subject of the other, one move at a time, then compare.')
}
{
  const moves: Move[] = [['Take 6x from both sides', '2y = −6x + 4', 'Get the y term on its own first.'], ['Divide by 2', 'y = −3x + 2', 'Divide every term by 2.']]
  practice(rearrange, 'Is y = −3x + 1 parallel to 2y + 6x = 4?', 'GR5 p79 Example (own numbers)', { interaction: choose('Yes: both have gradient −3',
    ['No: the gradients are −3 and 6', 'Make y the subject first: taking 6x from both sides leaves −6x, then ÷ 2 gives −3x.'],
    ['No: the gradients are −3 and 3', 'Taking 6x from both sides makes it −6x: the gradient is negative.'],
    ['No: the c’s are different', 'c is where a line crosses the y axis. Parallel lines only need the same m.']) },
  'Make y the subject of 2y + 6x = 4, then compare m.', graphModel('y = −3x + 1 and 2y + 6x = 4', grid([-2, 3], [-4, 6]), compareMoves(line(-3, 1), line(-3, 2), moves), 'Compare m'))
}
practice(rearrange, 'Find the gradient of the line 3y + 6x = 9.', 'GR5 p79 Make y the subject (own numbers)', { interaction: gradient(-2, 'Gradient = −2'), prefix: 'Gradient =' },
  'Take 6x from both sides, then divide every term by 3.', graphModel('3y + 6x = 9', grid([-2, 4], [-3, 6]), [
    { title: 'Take 6x from both sides', equation: '3y = −6x + 9', adds: 'lines', say: 'Get the y term on its own first.', change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), { text: '3y = −6x + 9', family: 3, at: step }] }) },
    { title: 'Divide by 3', equation: 'y = −2x + 3', adds: 'lines', say: 'Divide every term by 3, so y is on its own.', change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), { text: 'y = −2x + 3', family: 3, at: step }] }) },
    answerMove('Gradient = −2', 'Read m', 'Now it is y = mx + c: m is the number in front of x.', [], { title: '', say: '', equation: '', adds: 'answer', change: (frame, step) => ({ ...frame, lines: [{ from: ends(line(-2, 3))[0], to: ends(line(-2, 3))[1], at: step }] }) }),
  ], 'Make y the subject'),
  response => response.trim() === '6' || response.trim() === '-6' || response.trim() === '−6' ? 'Divide by 3 as well: y has to be on its own.' : response.trim() === '2' ? 'Taking 6x from both sides leaves −6x: the gradient is negative.' : response.trim() === '3' ? 'That’s c. The gradient is the number in front of x.' : null)
{
  const options: Option[] = [{ text: '2y − 4 = 6x', line: line(3, 2) }, { text: '3y + 6x = 3', line: line(-2, 1) }, { text: 'y − 3x = 8', line: line(3, 8) }]
  const { interaction, diagnose } = chooseAll([
    ['2y − 4 = 6x', true],
    ['3y + 6x = 3', '3y + 6x = 3 is y = −2x + 1: its gradient is −2.'],
    ['y − 3x = 8', true],
  ])
  practice(rearrange, 'Two of these lines are parallel. Which two?', 'GR5 p80 Q1 (own numbers)', { interaction }, 'Make y the subject of each one, then look for the same m.',
    pickModel('2y − 4 = 6x, 3y + 6x = 3, y − 3x = 8', null, options, [-3, 3], [-4, 7]), diagnose)
}
{
  const target = line(2, -3)
  const options: Option[] = [{ text: 'y + 2x = 5', line: line(-2, 5) }, { text: 'y − ½x = 1', line: line(1, 1, 2) }, { text: '3y = 6x + 3', line: line(2, 1) }, { text: 'y = 4x − 3', line: line(4, -3) }]
  const { interaction, diagnose } = chooseAll([
    ['y + 2x = 5', 'y + 2x = 5 is y = −2x + 5: the gradient is −2, not 2.'],
    ['y − ½x = 1', 'y − ½x = 1 is y = ½x + 1: a gradient of ½, not 2.'],
    ['3y = 6x + 3', true],
    ['y = 4x − 3', 'Same c, but parallel needs the same m, and this m is 4.'],
  ])
  practice(rearrange, 'Which of these lines are parallel to y = 2x − 3? Choose all that apply.', 'GR5 p80 Q3 (own numbers)', { interaction }, 'Make y the subject of each, then compare its m with 2.',
    pickModel('Parallel to y = 2x − 3?', target, options, [-3, 4], [-5, 6]), diagnose)
}

/* ---------- Rung 3: parallel through a point ---------- */

explore(through, 'Tap two points to draw a line. Can you make one that runs alongside the black line?', 'GR5 p80 Parallel through a point (play)',
  { mode: 'line', grid: gridWith(line(1, 1, 2), [-3, 5], [-2, 5]) })
{
  const given = line(3, -1), p = pt(2, 4)
  worked(through, 'Find the equation of the line parallel to y = 3x − 1 that goes through (2, 4).', 'The line parallel to y = 3x − 1 through (2, 4)', 'GR5 p80 Q2 Parallel through a point (own numbers)',
    graphModel('y = 3x − 1 through (2, 4)', gridWith(given, [-2, 4], [-4, 7], [p]), throughMoves(given, [], p), 'm, then c'),
    'A parallel line has the same m. Then use the point: put its x and y into y = mx + c and solve for c.')
}
/** Draw it on the board: the given line and the point are on the grid. */
function drawThrough(title: string, given: Line, moves: Move[], p: GraphPoint, x: Range, y: Range, sourceRef: string, hint: string, label = named(given)) {
  const answer = parallelThrough(given, p), start = gridWith(given, x, y, [p], label)
  return practice(through, title, sourceRef, { interaction: { ...drawnLine(...ends(answer)), displayAnswer: named(answer) }, board: { mode: 'line', grid: start, line: ends(answer) } },
    hint, graphModel(`${label} through ${`(${p.x}, ${p.y})`.replace(/-/g, '−')}`, start, throughMoves(given, moves, p), 'm, then c'), parallelSlips(given, p))
}
/** Typed after "y =". */
function typeThrough(title: string, given: Line, moves: Move[], p: GraphPoint, x: Range, y: Range, sourceRef: string, hint: string, label = named(given)) {
  const answer = parallelThrough(given, p)
  const slips = lineSlips(answer.top, answer.bottom, answer.c)
  return practice(through, title, sourceRef, { interaction: typed(answer), prefix: 'y =' }, hint,
    graphModel(`${label} through ${`(${p.x}, ${p.y})`.replace(/-/g, '−')}`, gridWith(given, x, y, [p], label), throughMoves(given, moves, p), 'm, then c'),
    response => sameFormula(response.replace(/^\s*y\s*=\s*/i, ''), typedLine(given.top, given.bottom, given.c)) ? 'That’s the first line. Keep its m, but find a new c from the point.' : slips(response))
}
drawThrough('Draw the line parallel to y = 2x + 1 that goes through (1, 0).', line(2, 1), [], pt(1, 0), [-3, 4], [-4, 5], 'GR5 p80 Q2 (own numbers)',
  'Same gradient as y = 2x + 1: from (1, 0), across 1 and up 2.')
typeThrough('Find the equation of the line parallel to y = −2x + 7 that goes through (2, 1).', line(-2, 7), [], pt(2, 1), [-1, 5], [-2, 8], 'GR5 p80 Q2 (own numbers)',
  'm is −2. Put x = 2 and y = 1 into y = −2x + c.')
typeThrough('Find the equation of the line parallel to 2y = x + 6 that goes through (4, 1).', line(1, 3, 2), [['Divide by 2', 'y = ½x + 3', 'Make y the subject of the first line to read its m.']], pt(4, 1), [-2, 6], [-3, 6], 'GR5 p80 Q2 (own numbers)',
  'Divide 2y = x + 6 by 2 to read m. Then put x = 4 and y = 1 in.', '2y = x + 6')
drawThrough('Draw the line parallel to 4y = −8x + 4 that goes through (1, 3).', line(-2, 1), [['Divide by 4', 'y = −2x + 1', 'Make y the subject of the first line to read its m.']], pt(1, 3), [-2, 4], [-3, 7], 'GR5 p80 Q2 (own numbers)',
  'Divide by 4: y = −2x + 1, so m is −2. From (1, 3), across 1 and down 2.', '4y = −8x + 4')

add('mixed', 'Parallel lines', 'GR5 consolidation', text(
  'Parallel lines are always the same distance apart, so they never meet.',
  'Parallel lines have the same gradient: the same m in y = mx + c. Only c changes.',
  'To compare two lines, make y the subject of each, then look at m.',
  'For a line parallel to another through a point: take the same m, put the point’s x and y in, and solve for c.',
))

export const tutorParallelLinesLesson: TutorMethodLesson = {
  id: 'L104', number: 104, title: 'Parallel lines', level: 'GCSE Foundation',
  goal: 'Know that parallel lines have the same gradient, rearrange equations to compare gradients, and find a line parallel to another through a point.',
  labels: { [sameGradient]: 'Same gradient', [rearrange]: 'Is it parallel?', [through]: 'Parallel through a point', mixed: 'Review' },
  states: finish(),
}
