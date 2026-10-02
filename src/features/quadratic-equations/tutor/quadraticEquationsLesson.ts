import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { EquationRow, MethodStep, SolveFrame, WorkingLine } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { pairsOf, signsOf } from '../../quadratics/tutor/quadraticsLesson'
import { quadratic } from '../../quadratics/tutor/quadraticsDiagnosis'
import { diagnoseSlips } from '../../equations/tutor/equationsDiagnosis'
import { diagnoseSolve } from './quadraticEquationsDiagnosis'

const { add, finish } = author(22)
const solving = 'quadratic-equations'
const text = (...lines: string[]) => ({ kind: 'text' as const, lines })
const tex = (value: string) => value.replace(/[~^[\]]/g, '').replace(/−/g, '-').replace(/×/g, '\\times ').replace(/²/g, '^{2}').replace(/ or /g, ',\\ ').replace(/✓/g, '\\checkmark')
const signed = (n: number) => n < 0 ? `−${-n}` : String(n)
/** "+ 5", "− 4": a number after the first term, its sign standing apart. */
const term = (n: number) => `${n < 0 ? '−' : '+'} ${Math.abs(n)}`
/** (x − 4)(x + 5) */
const brackets = (letter: string, [a, b]: [number, number]) => `(${letter} ${term(a)})(${letter} ${term(b)})`
/** x = 4 or x = −5: one answer from each bracket. */
const roots = (letter: string, [a, b]: [number, number]) => `${letter} = ${signed(-a)} or ${letter} = ${signed(-b)}`

/* ---------- Working: the textbook's four steps on one board (SolvePictures.tsx) ---------- */

/** "x² +x = 20" → a board row. */
const row = (line: string): EquationRow => {
  const at = line.indexOf(' = ')
  return { left: line.slice(0, at), right: line.slice(at + 3) }
}
/** The board's tokens for x² + bx: "x² +6x", "x² −x". */
const squared = (letter: string, middle: number) => `${letter}² ${middle < 0 ? '−' : '+'}${Math.abs(middle) === 1 ? '' : Math.abs(middle)}${letter}`

/**
 * Step 1, when the question doesn't equal 0: the question, the same question with the part the move works on boxed,
 * the rows the move adds, and the heading and ⓘ words. The 0 row is added after them.
 */
type Start = { question: string; marked: string; rows: string[]; title: string; say: string }
/** x² + bx = c: subtract c from both sides. */
const subtract = (letter: string, middle: number, c: number): Start => ({
  question: `${squared(letter, middle)} = ${c}`, marked: `${squared(letter, middle)} = [${c}]`,
  rows: [`${squared(letter, middle)} −${c}^ = ~${c} ~−${c}^`],
  title: `Subtract ${c} from both sides`,
  say: 'Factorising only helps when one side is 0. Take the boxed number away from both sides: on its own side it cancels.',
})
/**
 * The roots of y = x² + bx + c: where the curve crosses the x-axis, y is 0. The board writes it as x² + bx + c = y, so
 * the boxed y sits right above the 0 that replaces it, and a phone has room for the brackets later on.
 */
const rootsOf = (letter: string, middle: number, last: number): Start => {
  const left = `${squared(letter, middle)} ${last < 0 ? '−' : '+'}${Math.abs(last)}`
  return { question: `${left} = y`, marked: `${left} = [y]`, rows: [], title: 'Put y = 0', say: 'The roots are where the curve crosses the x-axis, and there y is 0. Put 0 in place of y.' }
}

/**
 * Solving x² + bx + c = 0 one move a step, in the textbook's four steps: make one side 0 (`start`), factorise (A7's
 * factor pairs, the pair that adds to b, the brackets), set each bracket to 0, then undo each bracket's number. The
 * last move ends in the green answer, so the working stops there (EXPLANATIONS.md rule 7). `given` starts from the brackets.
 */
function solveModel(middle: number, last: number, { letter = 'x', start, given }: { letter?: string; start?: Start; given?: [number, number] } = {}): TutorWorking {
  const pairs = pairsOf(middle, last), pick = pairs.findIndex(([a, b]) => a + b === middle)
  if (!given && pick < 0) throw new Error(`${quadratic(letter, middle, last)} doesn't factorise`)
  const pair = given ?? pairs[pick]
  const zero = `${quadratic(letter, middle, last)} = 0`
  const question = given ? `${brackets(letter, given)} = 0` : start?.question ?? zero
  const board = start && [row(start.question), ...start.rows.map(row), row(zero)]
  const signs = signsOf(middle, last)
  const steps: MethodStep[] = []
  let frame: SolveFrame = { letter, middle, last, board, given: Boolean(given), brackets: given, adds: 'zero' }
  // Each step's textbook step (1–4) is drawn above its heading by the picture (stageOf in SolvePictures.tsx).
  const step = (title: string, equation: string, instruction: string, next: SolveFrame) => {
    frame = next
    steps.push({ title, operation: tex(question), equation, instruction, frame: { solve: frame } })
  }
  if (start) step(start.title, tex(zero), start.say, { ...frame, board: [row(start.marked), ...board!.slice(1)] })
  if (!given) {
    step(`Factor pairs of ${signed(last)}`, pairs.map(([a, b]) => `${a}\\times ${b}`).join(',\\ '), `List every pair that multiplies to make the last number.${signs?.say ?? ''}`, { ...frame, board, signs: signs?.lines, pairs, adds: 'pairs' })
    step(`Which pair adds to ${signed(middle)}?`, pairs.map(([a, b]) => `${a}+${b}=${a + b}`).join(',\\ '), `Add each pair. The one that makes the middle number is your pair.${Math.abs(middle) === 1 ? ` ${letter} on its own means 1${letter}.` : ''}`, { ...frame, sums: true, pick, adds: 'sums' })
    step('Into the brackets', tex(`${brackets(letter, pair)} = 0`), `Each number goes into its own bracket after ${letter}, with its sign. The other side is still 0.`, { ...frame, brackets: pair, adds: 'brackets' })
  }
  step('One bracket must be 0', tex(`${letter} ${term(pair[0])} = 0 or ${letter} ${term(pair[1])} = 0`), 'Two things multiply to make 0 only if one of them is 0: no plates, or no cookies on each plate. So set each bracket equal to 0.', { ...frame, split: true, adds: 'split' })
  const undo = pair.map(n => n < 0 ? `add ${-n}` : `subtract ${n}`).join(', ')
  step(undo.charAt(0).toUpperCase() + undo.slice(1), tex(roots(letter, pair)), `Do the opposite of the boxed number to both sides, so it cancels and leaves ${letter} on its own.`, { ...frame, solve: true, adds: 'solve' })
  return { kind: 'method-worked', examples: [{ method: 'ordering', expression: tex(question), label: 'Solve', first: 0, second: 0, steps, pictureOnly: true, focus: true }] }
}

/** Working for a "think about x" part: one line a step, and the last step ends in the answer, which isn't repeated. */
function linesModel(question: string, lines: [string, string, string, string][], answer: [string, string, string]): TutorWorking {
  const sums: WorkingLine[] = lines.map(([parts, total], i) => ({ parts, total, family: i }))
  const steps: MethodStep[] = lines.map(([parts, total, title, say], i) => ({ title, operation: tex(question), equation: `\\text{${tex(`${parts} → ${total}`).replace('→', '}\\to\\text{')}}`, instruction: say, frame: { sums: sums.slice(0, i + 1) } }))
  steps.push({ title: answer[0], operation: tex(question), equation: `\\text{${answer[2]}}`, instruction: answer[1], frame: { sums, ordering: { answer: answer[2] } } })
  return { kind: 'method-worked', examples: [{ method: 'ordering', expression: tex(question), label: 'Work it out', first: 0, second: 0, steps, pictureOnly: true }] }
}

/* ---------- Answers ---------- */

/** "x = ☐ or x = ☐", in either order. */
const twoAnswers = (letter: string, pair: [number, number]): InteractionDefinition => ({ type: 'numericInput', responseShape: 'roots', acceptanceRule: 'unorderedSet', correctAnswer: `${-pair[0]}, ${-pair[1]}`, displayAnswer: roots(letter, pair) })
const number = (answer: number, shown: string): InteractionDefinition => ({ type: 'numericInput', correctAnswer: answer, displayAnswer: shown, acceptanceRule: 'normalisedNumber' })
/** A choice whose right answer is written first; each wrong option says why it’s wrong. Options are shuffled when shown. */
const choose = (right: string, ...wrong: [string, string][]): InteractionDefinition => ({
  type: 'select', correctAnswer: '0',
  options: [{ id: '0', label: right }, ...wrong.map(([label, feedback], i) => ({ id: String(i + 1), label, feedback }))],
})

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
function practice(topic: MicroSkillId, title: string, sourceRef: string, interaction: InteractionDefinition, hint: string, model: TutorWorking, diagnose?: (response: string) => string | null) {
  const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  const state = add(topic, title, sourceRef, text(title), interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  if (diagnose) state.diagnose = diagnose
  return state
}
function worked(topic: MicroSkillId, title: string, sourceRef: string, model: TutorWorking, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  // The board shows the equation, so the heading is only the instruction (EXPLANATIONS.md rule 1).
  state.content.heading = 'Solve'
  return state
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }
const media = (name: string, title: string, sourceFile: string, textAlternative: string[]) => ({
  id: `lesson22-${name}`, src: `/media/lesson-22/${name}.mp4`, poster: `/media/lesson-22/${name}.svg`, title, durationSeconds: 79, sourceFile, textAlternative,
})
/** Keeps an expression on one line in a title, so a phone never breaks it. */
const nb = (expression: string) => expression.replace(/ /g, ' ')

/**
 * "Solve …": two boxes, "x = ☐ or x = ☐", the four-step working and a message worked out from the student's answers.
 * The working must reach the answer the source gives.
 */
function solveQuestion(sourceRef: string, title: string, middle: number, last: number, answer: [number, number], hint: string, { letter = 'x', start, given, extra }: { letter?: string; start?: Start; given?: [number, number]; extra?: [number[], string][] } = {}) {
  const model = solveModel(middle, last, { letter, start, given })
  const steps = model.kind === 'method-worked' ? model.examples[0].steps : []
  const pair = steps.at(-1)!.frame.solve!.brackets!
  const values = pair.map(n => -n).sort((p, q) => p - q), wanted = [...answer].sort((p, q) => p - q)
  if (values.join() !== wanted.join()) throw new Error(`${sourceRef}: the working gives ${values}, not ${wanted}`)
  const state = practice(solving, title, sourceRef, twoAnswers(letter, pair), hint, model, response => diagnoseSolve(response, letter, pair, middle, last, extra))
  state.answerPrefix = `${letter} =`
  return state
}
/** Typing x(x + b) = c's two "answers", x = c and x + b = c, or solving as if c were 0. */
const notZero = (middle: number, c: number): [number[], string][] => [
  [[0, -middle], `That solves the equation with 0 on the right. Subtract ${c} from both sides first, so one side is 0.`],
  [[c, c - middle], `One bracket must be 0 only when the other side is 0. Subtract ${c} from both sides first, then factorise.`],
]

/* ---------- One rung: solving by factorising (A8.1, and the textbook's A8 page) ---------- */

// Aniksha is re-recording the A8.1 video with x² + x = 20 (it was x² + x = 12); it goes on this screen with video().
worked(solving, `Solve ${nb('x² + x = 20')}.`, 'A8.1 video (x² + x = 20, as re-recorded) + textbook A8 steps', solveModel(1, -20, { start: subtract('x', 1, 20) }), 'Make one side 0. Factorise. One bracket must be 0, so solve each one.')

solveQuestion('A8.1 Q2', `A bridge cable touches the road where ${nb('(x − 2)(x − 6) = 0')}, with x in metres along the road. Solve ${nb('(x − 2)(x − 6) = 0')}.`, -8, 12, [2, 6], 'One of the two brackets must be 0. Solve each one.', { given: [-2, -6] })
solveQuestion('A8.1 Q1', `A skate bowl’s curved side is modelled by ${nb('y = x² − 7x + 10')}, where x is the distance in metres along the ground. Solve ${nb('x² − 7x + 10 = 0')} to find where the edges are.`, -7, 10, [2, 5], 'It already equals 0. Find two numbers that multiply to 10 and add to −7.')
solveQuestion('Textbook A8 Your Turn Q2 (own numbers)', `Use factorisation to solve ${nb('x² − 9x + 14 = 0')}.`, -9, 14, [2, 7], 'Two negative numbers that multiply to 14 and add to −9.')
solveQuestion('A8.1 Q3', `A ramp has the profile ${nb('y = x² + 3x − 10')}, with x in metres. The ramp meets the ground where y = 0. Solve ${nb('x² + 3x − 10 = 0')}.`, 3, -10, [2, -5], 'Two numbers that multiply to −10 and add to 3. One is negative.')
solveQuestion('Textbook A8 Your Turn Q1 (own numbers)', `Use factorisation to solve ${nb('p² − 2p − 15 = 0')}.`, -2, -15, [5, -3], 'The letter is p this time. Two numbers that multiply to −15 and add to −2.', { letter: 'p' })
solveQuestion('Textbook A8 Your Turn Q3 (own numbers)', `Use factorisation to find the roots of ${nb('y = x² − 7x + 12')}.`, -7, 12, [3, 4], 'The roots are where y = 0. Then factorise.', { start: rootsOf('x', -7, 12) })
solveQuestion('Own question: make it 0 first', `Solve ${nb('x² + 3x = 18')}.`, 3, -18, [3, -6], 'Subtract 18 from both sides first, so one side is 0.', { start: subtract('x', 3, 18), extra: notZero(3, 18) })
solveQuestion('A8.1 Q4a', `A rectangular pond has width x metres and length ${nb('(x + 5)')} metres. Its area is 24 m². This gives the equation ${nb('x² + 5x − 24 = 0')}. Solve this equation.`, 5, -24, [-8, 3], 'Two numbers that multiply to −24 and add to 5.')
practice(solving, 'Explain why the width of the pond is 3 m and not −8 m.', 'A8.1 Q4b', choose(
  'A width can’t be negative, so x = 3',
  ['−8 is the smaller answer', 'Smaller isn’t the reason. x is the width, and a length can’t be negative.'],
  ['Both could be the width', 'x = −8 solves the equation, but a pond can’t be −8 m wide.'],
  ['3 comes from the second bracket', 'The order of the brackets doesn’t matter. x is a width, and widths are positive.'],
), 'Think about what x stands for.', linesModel('x = −8 or x = 3', [
  ['x = −8', 'a width of −8 m', 'Try x = −8', 'x is the width, and a length can’t be negative.'],
], ['The width', 'Only the positive answer can be a width. Then the length is 3 + 5, and 3 × 8 makes the 24 m².', 'x = 3, so the width is 3 m']))
solveQuestion('A8.1 Q5a', `A rectangular rug has width x metres and length ${nb('(x + 6)')} metres. Its area is 40 m². This gives the equation ${nb('x² + 6x − 40 = 0')}. Solve this equation.`, 6, -40, [-10, 4], 'Two numbers that multiply to −40 and add to 6.')
practice(solving, `The rug is x m wide and ${nb('(x + 6)')} m long. Work out the length of the rug.`, 'A8.1 Q5b', number(10, '10 m'), 'The width can’t be negative. The length is x + 6.', linesModel('x = −10 or x = 4', [
  ['−10 or 4', 'x = 4', 'The width', 'A width can’t be negative, so x is 4.'],
], ['The length', 'The length is x + 6, so add 6 to the width.', '4 + 6 = 10 m']), response => diagnoseSlips(response, 10, [
  [4, 'That’s the width, x. The length is x + 6.'], [-4, 'Use the positive answer: a width can’t be −10. The length is 4 + 6.'], [-10, 'A width can’t be negative, so x = 4. The length is x + 6.'], [16, 'That’s −10 + 6 without the minus. Use the positive answer, x = 4: the length is 4 + 6.'], [40, 'That’s the area. The length is x + 6, with x = 4.'],
])).answerLabel = 'Your answer (m)'
practice(solving, `Ben solves ${nb('x² + 6x = 40')} and writes “${nb('x(x + 6) = 40')}, so x = 40 or ${nb('x + 6 = 40')}”. Is Ben correct?`, 'A8.1 Q5c', choose(
  'No: one side must be 0 first. x² + 6x − 40 = 0 gives x = 4 or x = −10',
  ['Yes: one of x and x + 6 must be 40', 'That only works with 0. Two numbers can multiply to 40 without either being 40, like 4 × 10. Make one side 0 first.'],
  ['No: x = 0 or x = −6', 'That solves x(x + 6) = 0. The right side is 40, so subtract 40 from both sides first.'],
  ['No: x = 40 or x = 34', 'Try them: 40 × 46 is far more than 40. Make one side 0, then factorise.'],
), 'Does “one bracket must be …” work when the other side isn’t 0?', solveModel(6, -40, { start: subtract('x', 6, 40) }))

add('mixed', 'Solving quadratics by factorising', 'A8.1 consolidation', text(
  'Step 1: make one side 0. x² + x = 20 becomes x² + x − 20 = 0.',
  'Step 2: factorise. −4 and 5 multiply to −20 and add to 1, so (x − 4)(x + 5) = 0.',
  'Step 3: two things multiply to make 0, so one bracket must be 0: x − 4 = 0 or x + 5 = 0.',
  'Step 4: solve each one. x = 4 or x = −5. Each answer has the opposite sign to its bracket’s number.',
  'Check the question: a length or a width can’t be negative.',
))

export const tutorQuadraticEquationsLesson: TutorMethodLesson = {
  id: 'L022', number: 22, title: 'Solving quadratics', level: 'GCSE Foundation',
  goal: 'Solve quadratic equations like x² + x = 20 by making one side 0, factorising and setting each bracket to 0.',
  labels: { [solving]: 'Solve by factorising', mixed: 'Review' },
  states: finish(),
}
