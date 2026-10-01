import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { MethodStep, QuadraticFrame, WorkingLine } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { expandModel } from '../../expanding/tutor/expandingLesson'
import { diagnoseSlips } from '../../equations/tutor/equationsDiagnosis'
import { diagnoseBrackets, quadratic } from './quadraticsDiagnosis'

const { add, finish } = author(21)
const positive = 'quadratics-positive'
const negativeMiddle = 'quadratics-negative-middle'
const negativeLast = 'quadratics-negative-last'
const squares = 'quadratics-difference-of-squares'
const text = (...lines: string[]) => ({ kind: 'text' as const, lines })
const tex = (value: string) => value.replace(/−/g, '-').replace(/×/g, '\\times ').replace(/²/g, '^{2}').replace(/✓/g, '\\checkmark')
const signed = (n: number) => n < 0 ? `−${-n}` : String(n)
/** (x + 3)(x − 5) */
const brackets = (letter: string, [a, b]: [number, number]) => `(${letter} ${a < 0 ? '−' : '+'} ${Math.abs(a)})(${letter} ${b < 0 ? '−' : '+'} ${Math.abs(b)})`

/* ---------- Working: find the two numbers, then put them in the brackets (QuadraticPictures.tsx) ---------- */

/**
 * The pairs that multiply to c, smallest first, with the signs the question needs: both positive, both negative, or
 * one of each with the bigger one taking the sign of the middle term (so the sum can come out right).
 */
function pairsOf(middle: number, last: number): [number, number][] {
  const size = Math.abs(last), pairs: [number, number][] = []
  for (let a = 1; a * a <= size; a++) if (size % a === 0) {
    const b = size / a
    pairs.push(last > 0 ? middle > 0 ? [a, b] : [-a, -b] : middle > 0 ? [-a, b] : [a, -b])
  }
  return pairs
}

/** The reasons for the signs, shown on the "Pick the signs" step. */
function signReasons(middle: number, last: number): { notes: string[]; say: string } | null {
  if (last > 0 && middle > 0) return null
  const x = `${middle < 0 ? '−' : '+'} ${Math.abs(middle)}x`
  if (last > 0) return { notes: [`+ ${last}: the same sign`, `${x}: both negative`], say: 'The last number is positive, so the two numbers have the same sign. The middle term is negative, so both are negative.' }
  return {
    notes: [`− ${-last}: one minus, one plus`, `${x}: the bigger one is ${middle < 0 ? 'minus' : 'plus'}`],
    say: `The last number is negative, so one number is negative and one is positive. They add to the middle number, which is ${middle < 0 ? 'negative' : 'positive'}, so the bigger one is ${middle < 0 ? 'negative' : 'positive'}.`,
  }
}

/** x² + bx + c: the two jobs, the signs, the pairs that multiply to c, each one's sum, then the brackets. */
function pairsModel(middle: number, last: number, letter = 'x'): TutorWorking {
  const pairs = pairsOf(middle, last), pick = pairs.findIndex(([a, b]) => a + b === middle)
  if (pick < 0) throw new Error(`${quadratic(letter, middle, last)} doesn't factorise`)
  const base = { letter, middle, last }
  const question = tex(quadratic(letter, middle, last))
  const steps: MethodStep[] = []
  // Each frame says what the step before added, so that stays clear while older working is greyed out.
  const step = (title: string, equation: string, instruction: string, frame: QuadraticFrame) => steps.push({ title, operation: question, equation, instruction, frame: { quadratic: { ...frame, before: steps.at(-1)?.frame.quadratic?.adds } } })
  let frame: QuadraticFrame = { ...base, shape: true, adds: 'shape' }
  step('What the numbers do', `a\\times b=${signed(last)},\\ a+b=${signed(middle)}`.replace(/−/g, '-'), 'Two numbers go in the brackets. The first row of the table says what they must do: multiply to make the last number and add to make the number in front of x.', frame)
  const signs = signReasons(middle, last)
  if (signs) { frame = { ...frame, signs: signs.notes, adds: 'signs' }; step('Pick the signs', '\\text{signs}', signs.say, frame) }
  frame = { ...frame, pairs, adds: 'pairs' }
  step(`Pairs that make ${signed(last)}`, pairs.map(([a, b]) => `${a}\\times ${b}`).join(',\\ '), 'List every pair of whole numbers that multiply to make the last number, with the signs picked.', frame)
  frame = { ...frame, sums: true, pick, adds: 'sums' }
  step('Check each sum', pairs.map(([a, b]) => `${a}+${b}=${a + b}`).join(',\\ '), `Add each pair. Only one pair adds to the number in front of x: that is the pair to use.`, frame)
  frame = { ...frame, answer: pairs[pick], adds: 'answer' }
  step('Into the brackets', tex(brackets(letter, pairs[pick])), `Each number of the pair goes into its own bracket after ${letter}, with its sign. Adding a negative number is the same as taking it away.`, frame)
  return { kind: 'method-worked', examples: [{ method: 'ordering', expression: question, label: 'Factorise', first: 0, second: 0, steps, pictureOnly: true }] }
}

/** x² − c²: each term as a square, then one bracket with a plus and one with a minus. */
function squaresModel(root: number, letter = 'x'): TutorWorking {
  const last = -root * root, question = tex(quadratic(letter, 0, last))
  const base = { letter, middle: 0, last }
  const steps: MethodStep[] = [
    { title: 'Write as squares', operation: question, equation: `${letter}^{2}=${letter}\\times ${letter},\\ ${-last}=${root}\\times ${root}`, instruction: 'There is no middle term, and both terms are squares. Write each one as something times itself.', frame: { quadratic: { ...base, squares: true, adds: 'squares' } } },
    { title: 'One plus, one minus', operation: question, equation: tex(brackets(letter, [root, -root])), instruction: 'Put the two square roots in two brackets, one with a plus and one with a minus. Multiplied out, the two middle terms cancel, so there is no middle term.', frame: { quadratic: { ...base, squares: true, answer: [root, -root], adds: 'answer', before: 'squares' } } },
  ]
  return { kind: 'method-worked', examples: [{ method: 'ordering', expression: question, label: 'Factorise', first: 0, second: 0, steps, pictureOnly: true }] }
}

/** Working for a "put a number in" part: one line a step, and the last step is the answer. */
function linesModel(question: string, lines: [string, string, string, string][], answer: [string, string, string]): TutorWorking {
  const sums: WorkingLine[] = lines.map(([parts, total], i) => ({ parts, total, family: i }))
  const steps: MethodStep[] = lines.map(([parts, total, title, say], i) => ({ title, operation: tex(question), equation: tex(`${parts}=${total}`), instruction: say, frame: { sums: sums.slice(0, i + 1) } }))
  steps.push({ title: answer[0], operation: tex(question), equation: tex(answer[2]), instruction: answer[1], frame: { sums, ordering: { answer: answer[2] } } })
  return { kind: 'method-worked', examples: [{ method: 'ordering', expression: tex(question), label: 'Work it out', first: 0, second: 0, steps, pictureOnly: true }] }
}

/* ---------- Answers ---------- */

/** Two brackets typed with the x² key, in either order. */
const twoBrackets = (answer: string): InteractionDefinition => ({ type: 'numericInput', responseShape: 'expression', acceptanceRule: 'brackets', correctAnswer: answer, displayAnswer: answer })
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
  // The picture shows the expression, so the heading is only the instruction (EXPLANATIONS.md rule 1).
  state.content.heading = 'Factorise'
  return state
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }
const media = (name: string, title: string, sourceFile: string, textAlternative: string[]) => ({
  id: `lesson21-${name}`, src: `/media/lesson-21/${name}.mp4`, poster: `/media/lesson-21/${name}.svg`, title, durationSeconds: 53, sourceFile, textAlternative,
})
/** Keeps an expression on one line in a title, so a phone never breaks it. */
const nb = (expression: string) => expression.replace(/ /g, ' ')

/** "Factorise …": two brackets typed with the x² key, the pairs working, and a message worked out from the student's brackets. */
function factorise(topic: MicroSkillId, sourceRef: string, middle: number, last: number, hint: string, title?: string, letter = 'x') {
  const model = middle === 0 ? squaresModel(Math.sqrt(-last), letter) : pairsModel(middle, last, letter)
  const steps = model.kind === 'method-worked' ? model.examples[0].steps : []
  const [a, b] = steps.at(-1)!.frame.quadratic!.answer!
  const expression = quadratic(letter, middle, last)
  return practice(topic, title ?? `Factorise ${nb(expression)}.`, sourceRef, twoBrackets(brackets(letter, [a, b])), hint, model, response => diagnoseBrackets(response, letter, middle, last))
}

/* ---------- Rung 1: all positive (A7.1) ---------- */

const positiveVideo = worked(positive, `A rectangular garden has an area, in square metres, of ${nb('x² + 8x + 15')}. Factorise it to find expressions for the length and width.`, 'A7.1 video + Q1', pairsModel(8, 15), 'Find two numbers that multiply to the last number and add to the number in front of x. They go in the brackets.')
video(positiveVideo, media('all-positive', 'Factorising x² + 8x + 15', 'A7.1_Factorising_Quadratics_All_Positive.mp4', [
  'A quadratic becomes two brackets: x² + 8x + 15 = (x + a)(x + b), with two mystery numbers a and b.',
  'a × b makes the last number, 15. a + b makes the middle number, 8.',
  'List the pairs that multiply to 15 and check each sum: 1 and 15 add to 16, 3 and 5 add to 8.',
  '3 and 5 add to 8, so put them in the brackets: x² + 8x + 15 = (x + 3)(x + 5).',
  'Expand the brackets to check: x² + 5x + 3x + 15 = x² + 8x + 15.',
  'Where you see it: a rectangular garden has area x² + 8x + 15 m², so its sides are x + 3 and x + 5.',
]))
factorise(positive, 'A7.1 Q2', 5, 4, 'Two numbers that multiply to 4 and add to 5.', `A rectangular card has an area, in square centimetres, of ${nb('x² + 5x + 4')}. Factorise this expression.`)
factorise(positive, 'A7.1 Q3', 10, 21, 'Two numbers that multiply to 21 and add to 10.', `A rectangular photo has an area, in square centimetres, of ${nb('x² + 10x + 21')}. Factorise this expression.`)
factorise(positive, 'A7.1 Q4a', 9, 20, 'List the pairs that multiply to 20. Which pair adds to 9?', `A rectangular patio has an area of ${nb('x² + 9x + 20')} square metres. Factorise it to find expressions for the length and width.`)
practice(positive, `When x = 3, show that ${nb('x² + 9x + 20')} and ${nb('(x + 4)(x + 5)')} give the same area.`, 'A7.1 Q4b', choose(
  '3² + 9 × 3 + 20 = 56 and (3 + 4)(3 + 5) = 7 × 8 = 56',
  ['6 + 27 + 20 = 53 and 7 × 8 = 56', '3² means 3 × 3 = 9, not 3 × 2. 9 + 27 + 20 = 56, the same as 7 × 8.'],
  ['3² + 9 × 3 + 20 = 56 and 3 + 4 + 3 + 5 = 15', 'The brackets multiply: (3 + 4)(3 + 5) = 7 × 8 = 56.'],
  ['3² + 93 + 20 = 122 and 7 × 8 = 56', '9x means 9 × x, so 9 × 3 = 27, not 93.'],
), 'Put 3 in for x in each form. Work out the brackets first, then multiply.', linesModel('x² + 9x + 20', [
  ['3² + 9 × 3 + 20', '56', 'The first form', 'Square 3, then multiply 9 by 3, then add.'],
  ['(3 + 4)(3 + 5) = 7 × 8', '56', 'The brackets', 'Work out each bracket, then multiply them.'],
], ['Both the same', 'Both forms give the same area, so the factorising is right.', 'Both are 56 m²']))
factorise(positive, 'A7.1 Q5a', 12, 35, 'Two numbers that multiply to 35 and add to 12.', `A rectangular pool cover has an area, in square metres, of ${nb('x² + 12x + 35')}. Factorise this expression.`)
practice(positive, `Expand ${nb('(x + 5)(x + 7)')} to check it gives ${nb('x² + 12x + 35')}.`, 'A7.1 Q5b', choose(
  'x² + 7x + 5x + 35 = x² + 12x + 35, which matches',
  ['x² + 35, which doesn’t match', 'Multiply every term by every term: x × 7 = 7x and 5 × x = 5x are the middle terms.'],
  ['x² + 12x + 12, which doesn’t match', 'The numbers multiply: 5 × 7 = 35, not 5 + 7.'],
), 'Multiply each term in the first bracket by each term in the second.', expandModel('(x + 5)(x + 7)'))
practice(positive, `Kai factorises ${nb('x² + 6x + 8')} and writes ${nb('(x + 2)(x + 3)')}. Is Kai correct?`, 'A7.1 Q5c', choose(
  'No: (x + 2)(x + 3) gives x² + 5x + 6. It should be (x + 2)(x + 4)',
  ['Yes: 2 × 3 = 6, the middle number', 'The numbers must multiply to the last number, 8, and add to the middle number, 6. That’s 2 and 4.'],
  ['No: it should be (x + 1)(x + 8)', '1 × 8 = 8, but 1 + 8 = 9, not 6. Use 2 and 4.'],
  ['No: it should be (x + 6)(x + 8)', 'The numbers in the brackets aren’t the 6 and the 8: they multiply to 8 and add to 6, so 2 and 4.'],
), 'Expand Kai’s brackets. Do you get the question back?', pairsModel(6, 8))

/* ---------- Rung 2: negative middle term (A7.2) ---------- */

const middleVideo = worked(negativeMiddle, `A rectangular rug has an area, in square metres, of ${nb('x² − 9x + 20')}. Factorise it to find expressions for the length and width.`, 'A7.2 video + Q1', pairsModel(-9, 20), 'The last number is plus and the middle is minus, so both numbers are negative.')
video(middleVideo, media('negative-middle', 'Factorising x² − 9x + 20', 'A7.2_Factorising_Quadratics_Negative_Middle_Term.mp4', [
  'The middle is negative and the last is positive, so both numbers are negative.',
  'a × b makes the last number, 20. a + b makes the middle number, −9.',
  'List the negative pairs that multiply to 20 and check each sum: −1 and −20 add to −21, −2 and −10 add to −12, −4 and −5 add to −9.',
  '−4 and −5 add to −9, so x² − 9x + 20 = (x − 4)(x − 5).',
  'Expand to check: x² − 5x − 4x + 20 = x² − 9x + 20.',
  'Where you see it: a rug has area x² − 9x + 20 m², so its sides are x − 4 and x − 5.',
]))
factorise(negativeMiddle, 'A7.2 Q2', -6, 5, 'Two negative numbers that multiply to 5 and add to −6.', `A rectangular tile has an area, in square centimetres, of ${nb('x² − 6x + 5')}. Factorise this expression.`)
factorise(negativeMiddle, 'A7.2 Q3', -11, 24, 'Two negative numbers that multiply to 24 and add to −11.', `A rectangular banner has an area, in square metres, of ${nb('x² − 11x + 24')}. Factorise this expression.`)
factorise(negativeMiddle, 'A7.2 Q4a', -10, 16, 'List the negative pairs that multiply to 16. Which pair adds to −10?', `A rectangular mat has an area of ${nb('x² − 10x + 16')} square metres. Factorise it to find expressions for the length and width.`)
const mat = practice(negativeMiddle, `The mat is ${nb('(x − 2)')} m by ${nb('(x − 8)')} m. Work out its length and width when x = 10.`, 'A7.2 Q4b', { type: 'numericInput', responseShape: 'dimensions', acceptanceRule: 'unorderedSet', correctAnswer: '8, 2', displayAnswer: '8 m by 2 m' },
  'Put 10 in for x in each bracket.', linesModel('(x − 2)(x − 8)', [
    ['10 − 2', '8', 'The first side', 'Put x = 10 into x − 2.'],
    ['10 − 8', '2', 'The other side', 'Put x = 10 into x − 8.'],
  ], ['Both sides', 'The two brackets are the two sides of the mat.', '8 m by 2 m']),
  response => {
    const values = response.split(',').map(Number).sort((a, b) => a - b).join(', ')
    return values === '12, 18' ? 'x − 2 takes 2 away from x: 10 − 2 = 8 and 10 − 8 = 2.' : values === '-8, -2' ? 'x is 10, so the sides are 10 − 2 = 8 and 10 − 8 = 2: lengths are positive.' : values === '10, 10' ? 'Take each number away from 10: 10 − 2 = 8 and 10 − 8 = 2.' : null
  })
mat.answerPrefix = 'm'
factorise(negativeMiddle, 'A7.2 Q5a', -14, 40, 'Two negative numbers that multiply to 40 and add to −14.', `A rectangular lawn has an area, in square metres, of ${nb('x² − 14x + 40')}. Factorise this expression.`)
practice(negativeMiddle, `Expand ${nb('(x − 4)(x − 10)')} to check it gives ${nb('x² − 14x + 40')}.`, 'A7.2 Q5b', choose(
  'x² − 10x − 4x + 40 = x² − 14x + 40, which matches',
  ['x² − 14x − 40, which doesn’t match', '−4 × −10 = +40: two negatives multiply to a positive.'],
  ['x² + 14x + 40, which doesn’t match', '−10x and −4x add to −14x, not +14x.'],
), 'Multiply each term in the first bracket by each term in the second. Watch the signs.', expandModel('(x − 4)(x − 10)'))
practice(negativeMiddle, `Zoe factorises ${nb('x² − 7x + 12')} and writes ${nb('(x + 3)(x + 4)')}. Is Zoe correct?`, 'A7.2 Q5c', choose(
  'No: (x + 3)(x + 4) gives + 7x. The middle term is −7x, so both numbers are negative: (x − 3)(x − 4)',
  ['Yes: 3 × 4 = 12 and 3 + 4 = 7', '3 + 4 = +7, but the middle term is −7x. −3 and −4 multiply to 12 and add to −7.'],
  ['No: it should be (x + 3)(x − 4)', '3 × −4 = −12, not +12. Both numbers must be negative: (x − 3)(x − 4).'],
  ['No: it should be (x − 3)(x + 4)', '−3 × 4 = −12, not +12. Both numbers must be negative: (x − 3)(x − 4).'],
), 'Expand Zoe’s brackets. What sign is the middle term?', pairsModel(-7, 12))

/* ---------- Rung 3: negative last term (A7.3) ---------- */

const lastVideo = worked(negativeLast, `A rectangular flower bed has an area, in square metres, of ${nb('x² + 2x − 15')}. Factorise it to find expressions for the length and width.`, 'A7.3 video + Q1', pairsModel(2, -15), 'The last number is negative, so one number is negative and one is positive.')
video(lastVideo, media('negative-last', 'Factorising x² + 2x − 15', 'A7.3_Factorising_Quadratics_Negative_Last_Term.mp4', [
  'The last number is negative, so the two numbers have different signs: one plus bracket, one minus bracket.',
  'a × b makes the last number, −15. a + b makes the middle number, 2.',
  'List every pair that multiplies to −15 and check each sum: 1 and −15 add to −14, −1 and 15 add to 14, 3 and −5 add to −2, −3 and 5 add to 2.',
  '−3 and 5 add to 2, so x² + 2x − 15 = (x − 3)(x + 5).',
  'Expand to check: x² + 5x − 3x − 15 = x² + 2x − 15.',
  'Where you see it: a flower bed has area x² + 2x − 15 m², so its sides are x − 3 and x + 5.',
]))
factorise(negativeLast, 'A7.3 Q2', 3, -4, 'Two numbers that multiply to −4 and add to 3. One is negative.', `A rectangular sign has an area, in square metres, of ${nb('x² + 3x − 4')}. Factorise this expression.`)
factorise(negativeLast, 'A7.3 Q3', -2, -24, 'Two numbers that multiply to −24 and add to −2. The bigger one is negative.', `A rectangular field has an area, in square metres, of ${nb('x² − 2x − 24')}. Factorise this expression.`)
factorise(negativeLast, 'A7.3 Q4a', 5, -14, 'Two numbers that multiply to −14 and add to 5.', `A rectangular flower bed has an area of ${nb('x² + 5x − 14')} square metres. Factorise it to find expressions for the length and width.`)
practice(negativeLast, `The flower bed is ${nb('(x + 7)')} m by ${nb('(x − 2)')} m. Explain why x must be greater than 2.`, 'A7.3 Q4b', choose(
  'A side can’t be zero or negative, so x − 2 must be more than 0',
  ['x + 7 must be more than 2', 'x + 7 is the other side, and it is positive anyway. The side x − 2 is the one that could be 0 or less.'],
  ['x must be positive', 'If x were 1, the side x − 2 would be −1 m, which can’t be a length. So x − 2 > 0, which means x > 2.'],
  ['The bracket has − 2, so x is more than −2', 'If x were 0, the side x − 2 would be −2 m. The side must be more than 0, so x is more than 2.'],
), 'Look at the side x − 2. What happens to it when x is 2 or less?', linesModel('(x + 7)(x − 2)', [
  ['x − 2', 'a side', 'The shorter side', 'x − 2 is a length, so it has to be more than 0.'],
], ['More than 0', 'A length can’t be zero or negative, so x has to be more than 2.', 'x − 2 > 0, so x > 2']))
factorise(negativeLast, 'A7.3 Q5a', -3, -28, 'Two numbers that multiply to −28 and add to −3.', `A rectangular yard has an area, in square metres, of ${nb('x² − 3x − 28')}. Factorise this expression.`)
practice(negativeLast, `Expand ${nb('(x − 7)(x + 4)')} to check it gives ${nb('x² − 3x − 28')}.`, 'A7.3 Q5b', choose(
  'x² + 4x − 7x − 28 = x² − 3x − 28, which matches',
  ['x² − 3x + 28, which doesn’t match', '−7 × 4 = −28: a negative times a positive is negative.'],
  ['x² + 11x − 28, which doesn’t match', '4x and −7x add to −3x, not 11x.'],
), 'Multiply each term in the first bracket by each term in the second. Watch the signs.', expandModel('(x − 7)(x + 4)'))
practice(negativeLast, `Ivy factorises ${nb('x² − 3x − 10')} and writes ${nb('(x − 5)(x − 2)')}. Is Ivy correct?`, 'A7.3 Q5c', choose(
  'No: (x − 5)(x − 2) gives + 10. The last number is −10, so the signs differ: (x − 5)(x + 2)',
  ['Yes: 5 × 2 = 10 and 5 + 2 = 7', 'Her numbers multiply to +10, but the last number is −10. One number must be negative: −5 and 2.'],
  ['No: it should be (x + 5)(x − 2)', '5 + −2 = +3, but the middle term is −3x. Use −5 and 2.'],
  ['No: it should be (x − 10)(x + 1)', '−10 + 1 = −9, not −3. Use −5 and 2.'],
), 'Expand Ivy’s brackets. What sign is the last number?', pairsModel(-3, -10))

/* ---------- Rung 4: difference of two squares (A7.4) ---------- */

const squaresVideo = worked(squares, `A square poster with sides of x cm has a square hole with sides of 7 cm cut out. The area left, in square centimetres, is ${nb('x² − 49')}. Factorise this expression.`, 'A7.4 video + Q1', squaresModel(7), 'One square minus another: one bracket with a plus, one with a minus.')
video(squaresVideo, media('difference-of-squares', 'Factorising x² − 49', 'A7.4_Factorising_Quadratics_Difference_Of_Two_Squares.mp4', [
  'There is no middle term: it is one square minus another.',
  'Write each term as a square: x² = x × x and 49 = 7 × 7, so it is x² − 7².',
  'One plus bracket, one minus bracket: x² − 49 = (x + 7)(x − 7).',
  'Expand to check: x² − 7x + 7x − 49. The middle terms cancel, leaving x² − 49.',
  'Where you see it: a square lawn of side x metres has a square pond of side 7 metres. The grass area is x² − 49 = (x + 7)(x − 7); when x = 10 it is 17 × 3 = 51 m².',
]))
factorise(squares, 'A7.4 Q2', 0, -16, '16 is 4². One bracket plus, one bracket minus.', `A square tablecloth with sides of x m has a square stain with sides of 4 m. The clean area, in square metres, is ${nb('x² − 16')}. Factorise this expression.`)
factorise(squares, 'A7.4 Q3', 0, -81, '81 is 9². The letter is y this time.', `A square sandbox with sides of y m has a square of sides 9 m dug out. The sand area, in square metres, is ${nb('y² − 81')}. Factorise this expression.`, 'y')
factorise(squares, 'A7.4 Q4a', 0, -36, 'Write 36 as a square. Then one bracket plus, one bracket minus.', `A square lawn has sides of x metres. A square pond with sides of 6 metres is dug in it. The grass left is ${nb('x² − 36')} square metres. Factorise ${nb('x² − 36')}.`)
practice(squares, `When x = 10, use ${nb('(x + 6)(x − 6)')} to work out the area of grass left.`, 'A7.4 Q4b', number(64, '64 m²'), 'Put 10 in for x in each bracket, then multiply.', linesModel('(x + 6)(x − 6)', [
  ['10 + 6', '16', 'The first bracket', 'Put x = 10 into x + 6.'],
  ['10 − 6', '4', 'The second bracket', 'Put x = 10 into x − 6.'],
], ['Multiply them', 'The brackets multiply to give the area.', '16 × 4 = 64']), response => diagnoseSlips(response, 64, [
  [20, 'The brackets multiply: 16 × 4 = 64, not 16 + 4.'], [12, 'The brackets multiply: 16 × 4 = 64.'], [136, 'The pond is taken away: 10² − 36 = 64.'], [100, 'That’s the whole lawn, 10². Take the pond away: 100 − 36 = 64.'],
]) ).answerLabel = 'Your answer (m²)'
// A7.4 Q5a was 4x² − 25 = (2x + 5)(2x − 5): a number in front of x² is Higher tier (AQA 8300 A4, bold), so the app
// asks the same question with x² − 100 (Sunny, 1 Oct). Q5b checks it the same way.
factorise(squares, 'A7.4 Q5a', 0, -100, '100 is 10². One bracket plus, one bracket minus.', `A square sheet of card with sides of x cm has a square with sides of 10 cm cut out. The card left, in square centimetres, is ${nb('x² − 100')}. Factorise this expression.`)
practice(squares, `Expand ${nb('(x + 10)(x − 10)')} to check it gives ${nb('x² − 100')}.`, 'A7.4 Q5b', choose(
  'x² − 10x + 10x − 100 = x² − 100, because the middle terms cancel',
  ['x² − 20x − 100, which doesn’t match', '−10x and +10x add to 0: they cancel.'],
  ['x² + 100, which doesn’t match', '+10 × −10 = −100: a positive times a negative is negative.'],
), 'Multiply each term in the first bracket by each term in the second. What happens to the middle terms?', expandModel('(x + 10)(x − 10)'))
practice(squares, `Jon factorises ${nb('x² − 25')} and writes ${nb('(x − 5)(x − 5)')}. Is Jon correct?`, 'A7.4 Q5c', choose(
  'No: (x − 5)(x − 5) gives x² − 10x + 25. One bracket needs a plus: (x + 5)(x − 5)',
  ['Yes: 5 × 5 = 25', 'With two minuses, −5 × −5 = +25, and the middle terms add to −10x. One plus and one minus: (x + 5)(x − 5).'],
  ['No: it should be (x + 5)(x + 5)', 'That gives x² + 10x + 25. One plus and one minus makes the middle terms cancel: (x + 5)(x − 5).'],
  ['No: it should be (x − 25)(x + 1)', 'That gives x² − 24x − 25. 25 is 5 × 5, so it’s (x + 5)(x − 5).'],
), 'Expand Jon’s brackets. Do the middle terms cancel?', squaresModel(5))

add('mixed', 'Factorising quadratics', 'A7.1-A7.4 consolidation', text(
  'x² + bx + c = (x + p)(x + q), where p and q multiply to c and add to b: x² + 8x + 15 = (x + 3)(x + 5).',
  'Last number positive: both numbers have the same sign as the middle term. x² − 9x + 20 = (x − 4)(x − 5).',
  'Last number negative: one number is negative, one positive. x² + 2x − 15 = (x − 3)(x + 5).',
  'One square minus another: one plus bracket, one minus bracket. x² − 49 = (x + 7)(x − 7).',
  'Expand your brackets to check: you should get the question back.',
))

export const tutorQuadraticsLesson: TutorMethodLesson = {
  id: 'L021', number: 21, title: 'Factorising quadratics', level: 'GCSE Foundation',
  goal: 'Factorise quadratics of the form x² + bx + c into two brackets, including the difference of two squares.',
  labels: { [positive]: 'All positive', [negativeMiddle]: 'Negative middle', [negativeLast]: 'Negative last', [squares]: 'Two squares', mixed: 'Review' },
  states: finish(),
}
