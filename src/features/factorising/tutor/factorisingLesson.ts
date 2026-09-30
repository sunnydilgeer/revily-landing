import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { ExpandFrame, MethodStep, WorkingLine } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { readFactorised } from '../../number-types/lessonMath'
import { show, terms, times } from '../../expanding/tutor/expandingDiagnosis'
import { commonFactor, diagnoseFactorise, divide, factorParts, leftover, split } from './factorisingDiagnosis'

const { add, finish } = author(18)
const two = 'factorise-two-terms'
const three = 'factorise-three-terms'
const text = (...lines: string[]) => ({ kind: 'text' as const, lines })
const tex = (value: string) => value.replace(/−/g, '-').replace(/×/g, '\\times ').replace(/÷/g, '\\div ').replace(/²/g, '^{2}').replace(/³/g, '^{3}')

/* ---------- Answers ---------- */

/** A factorised answer, with the x² key: the right factor outside, the bracket's terms in any order. */
const factorised = (answer: string): InteractionDefinition => ({ type: 'numericInput', responseShape: 'expression', acceptanceRule: 'factorisedExpression', correctAnswer: answer, displayAnswer: answer })
/** A choice whose right answer is written first; each wrong option says why it’s wrong. Options are shuffled when shown. */
const choose = (right: string, ...wrong: [string, string][]): InteractionDefinition => ({
  type: 'select', correctAnswer: '0',
  options: [{ id: '0', label: right }, ...wrong.map(([label, feedback], i) => ({ id: String(i + 1), label, feedback }))],
})

/* ---------- Working: the grid method backwards, picture first (src/features/EXPLANATIONS.md) ---------- */

/** The common factor goes down the side, each term of the question sits in a box, and the bracket is along the top. */
function factoriseModel(expression: string): TutorWorking {
  const question = terms(expression), factor = commonFactor(question)
  const inside = question.map(term => divide(term, factor))
  const answer = `${show(factor)}(${inside.map((term, i) => show(term, i === 0)).join(' ')})`
  const cells = [question.map((term, i) => ({ text: show(term), family: i }))]
  const grid = (side: string, top: string[], coloured = false): ExpandFrame => ({ given: true, coloured, grids: [{ side: [side], top, cells }] })
  const gaps = question.map(() => '?')
  const splits = (mark: boolean | 'out'): WorkingLine[] => question.map((term, i) => ({ parts: show(term), total: split(term, factor, mark), family: i }))
  const parts = factorParts(factor)
  const common: WorkingLine = { parts: parts === show(factor) ? undefined : parts, total: show(factor), family: 3 }
  // What is left of each term once the common factor is crossed out; a term that was all common factor leaves 1.
  const left: WorkingLine[] = question.map((term, i) => {
    const rest = leftover(term, factor), total = show(inside[i])
    return { parts: rest === '1' ? 'All crossed out' : rest === total ? undefined : rest, total, family: i }
  })
  const several = question.length > 2 ? 'every term' : 'both terms'
  const steps: MethodStep[] = [
    { title: 'Split each term', operation: tex(expression), equation: question.map(term => `${tex(show(term))}=${tex(split(term, factor))}`).join(',\\ '), instruction: 'Write each term as its numbers and letters multiplied together, so you can see what they share.', frame: { expand: grid('?', gaps), sums: splits(false) } },
    { title: 'The common factor', operation: tex(expression), equation: tex(show(factor)), instruction: `Box what ${several} share: the biggest number that goes into ${several}, and every letter that is in ${several}. Together they are the common factor, and it goes outside, down the side of the grid.`, frame: { expand: grid(show(factor), gaps, true), sums: [...splits(true), common] } },
    { title: 'Take it out of each term', operation: tex(expression), equation: question.map((term, i) => `${tex(show(term))}\\div ${tex(show(factor))}=${tex(show(inside[i]))}`).join(',\\ '), instruction: `Dividing by ${show(factor)} takes its boxed parts out of every term: cross them out. What is left of each term goes along the top of the grid, into the bracket.`, frame: { expand: grid(show(factor), inside.map(term => show(term)), true), sums: [...splits('out'), common, ...left] } },
    { title: 'The answer', operation: tex(expression), equation: tex(answer), instruction: 'The side of the grid goes outside the bracket, and the top of the grid goes inside it, each with its sign.', frame: { ordering: { answer }, bracket: { outside: show(factor), inside: inside.map((term, i) => ({ text: show(term, i === 0), family: i, from: show(question[i]) })) } } },
  ]
  return { kind: 'method-worked', examples: [{ method: 'ordering', expression: tex(expression), label: 'Factorise', first: 0, second: 0, steps, pictureOnly: true }] }
}
/** Checking a factorised answer by expanding it: the grid forwards, then the question again. */
function checkModel(answer: string): TutorWorking {
  const { outside, inside } = readFactorised(answer)!
  const products = inside.map(term => times(outside, term))
  const expanded = products.map((term, i) => show(term, i === 0)).join(' ')
  const grid = (filled: boolean): ExpandFrame => ({ grids: [{ side: [show(outside)], top: inside.map(term => show(term)), cells: filled ? [products.map((term, i) => ({ text: show(term), family: i }))] : undefined }] })
  return { kind: 'method-worked', examples: [{ method: 'ordering', expression: tex(answer), label: 'Expand', first: 0, second: 0, pictureOnly: true, steps: [
    { title: 'Multiply each box', operation: tex(answer), equation: inside.map((term, i) => `${tex(show(outside))}\\times ${tex(show(term))}=${tex(show(products[i]))}`).join(',\\ '), instruction: 'Each box is the term outside times the term on its column. Multiply the numbers, then add the powers of each letter.', frame: { expand: grid(true) } },
    { title: 'The answer', operation: tex(answer), equation: tex(expanded), instruction: 'Every box together is the expression in the question, so the factorising is right.', frame: { ordering: { answer: `${expanded}, the question` } } },
  ] }] }
}

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
  return add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }
/** Video 2: the same example done another way (dividing the whole expression by the common factor). */
function video2(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video2 = definition }
const media = (name: string, title: string, durationSeconds: number, sourceFile: string, textAlternative: string[]) => ({
  id: `lesson18-${name}`, src: `/media/lesson-18/${name}.mp4`, poster: `/media/lesson-18/${name}.svg`, title, durationSeconds, sourceFile, textAlternative,
})
/** Keeps an expression on one line in a title, so a phone never breaks it inside a bracket. */
const nb = (expression: string) => expression.replace(/ /g, ' ')
/** "Factorise fully …": typed with the x² key, with the grid working and wrong-answer messages worked out from the terms. */
function factoriseQuestion(topic: MicroSkillId, sourceRef: string, expression: string, answer: string, hint: string, title = `Factorise fully ${nb(expression)}.`) {
  const model = factoriseModel(expression)
  return practice(topic, title, sourceRef, factorised(answer), hint, model, response => diagnoseFactorise(response, expression, answer))
}

/* ---------- Rung 1: two terms (A4.1) ---------- */

const twoVideo = worked(two, `Factorise fully ${nb('6x² + 9x')}.`, 'A4.1 video + Q1', factoriseModel('6x² + 9x'), 'Factorising is expanding backwards: find what every term shares, and take it outside the bracket.')
video(twoVideo, media('two-terms', 'Factorising 6x² + 9x', 53, 'A4.1_Factorising_Two_Terms.mp4', [
  'Factorising is the opposite of expanding brackets. Split each term into its factors: 6x² = 3 × 2 × x × x and 9x = 3 × 3 × x.',
  'Circle what both terms share: a 3 and an x. The shared part, 3x, is the common factor.',
  'Write 3x outside the bracket, and what is left of each term goes inside: 6x² + 9x = 3x(2x + 3).',
  'Expand it back to check: 3x × 2x = 6x² and 3x × 3 = 9x.',
  'Where you see it: two flower beds share the same width, 3x, so 3x goes outside. Their lengths are 2x and 3.',
]))
video2(twoVideo, media('two-terms-another-way', 'Another way: factorising 6x² + 9x by dividing', 53, 'A4.1_Factorising_Two_Terms.mp4 (second version)', [
  'Another way to do the same question. Split each term into its factors: 6x² = 3 × 2 × x × x and 9x = 3 × 3 × x. Both share 3 and x, so the common factor is 3x.',
  'Divide the whole expression by 3x: (6x² + 9x) ÷ 3x = 6x² ÷ 3x + 9x ÷ 3x.',
  'Write each term as its factors over 3 × x. What matches on the top and bottom cancels: 3 × 2 × x × x over 3 × x leaves 2x, and 3 × 3 × x over 3 × x leaves 3.',
  'What is left goes inside the bracket: 6x² + 9x = 3x(2x + 3).',
  'Where you see it: two beds share the same width, 3x, so 3x goes outside.',
]))
factoriseQuestion(two, 'A4.1 Q2', '5a + 10', '5(a + 2)', 'Which number goes into 5 and 10? Divide each term by it.', `Factorise ${nb('5a + 10')}.`)
factoriseQuestion(two, 'A4.1 Q3', '14y² − 21y', '7y(2y − 3)', 'The biggest number in 14 and 21, and the letter both terms have. Keep the minus sign.', `A rectangular patio has an area of ${nb('14y² − 21y')} square metres. Factorise fully the expression for the area.`)
factoriseQuestion(two, 'A4.1 Q4a', '12ab + 18b²', '6b(2a + 3b)', 'Find the biggest number in 12 and 18. Which letter is in both terms?', `A banner has an area of ${nb('12ab + 18b²')} square centimetres. Factorise fully the expression for its area.`)
practice(two, `Kim writes ${nb('4x² + 10x')} = ${nb('2(2x² + 5x)')}. Her answer is not fully factorised. Why not?`, 'A4.1 Q4b', choose(
  'Both terms in the bracket still have a common factor of x',
  ['2 is not a factor of 4x² and 10x', '2 does go into 4 and 10, so taking out 2 is a start. But 2x² and 5x still share an x, so it should be 2x(2x + 5).'],
  ['She should have taken out 4', '4 doesn’t go into 10. The numbers only share 2, but both terms also share an x: 2x(2x + 5).'],
  ['Nothing, it is fully factorised', 'Look inside the bracket: 2x² and 5x both have an x, so the x can come out too.'],
), 'Look at what is left inside the bracket. Do the terms still share anything?', factoriseModel('4x² + 10x'))
factoriseQuestion(two, 'A4.1 Q5a', '15p²q + 25pq²', '5pq(3p + 5q)', 'The biggest number in 15 and 25. Both terms have a p and a q.', `Two flower beds have areas ${nb('15p²q')} and ${nb('25pq²')} square metres. Factorise fully the expression for their total area, ${nb('15p²q + 25pq²')}.`)
practice(two, `Show that ${nb('5pq(3p + 5q)')} is right by expanding it.`, 'A4.1 Q5b', choose(
  '5pq × 3p = 15p²q and 5pq × 5q = 25pq², which is the question',
  ['5pq × 3p = 15pq and 5pq × 5q = 25pq', 'p × p = p², so 5pq × 3p = 15p²q. And q × q = q², so 5pq × 5q = 25pq².'],
  ['5pq × 3p = 8p²q and 5pq × 5q = 10pq²', 'Multiply the numbers, don’t add them: 5 × 3 = 15 and 5 × 5 = 25.'],
), 'Multiply 5pq by each term in the bracket.', checkModel('5pq(3p + 5q)'))
practice(two, `Sam says ${nb('6m²n + 9mn')} = ${nb('3m(2mn + 3n)')}. Is Sam’s answer fully factorised?`, 'A4.1 Q5c', choose(
  'No: 2mn and 3n still share n, so it’s 3mn(2m + 3)',
  ['Yes: 3m goes into both terms', '3m does go into both terms, but it isn’t the biggest factor. 2mn and 3n still share an n, so 3mn goes outside.'],
  ['No: it should be 3(2m²n + 3mn)', 'That takes out less, not more. Every term has a 3, an m and an n, so 3mn goes outside: 3mn(2m + 3).'],
  ['No: it should be mn(6m + 9)', '6m and 9 still share a 3. Take out 3mn: 3mn(2m + 3).'],
), 'Look at the bracket. Do both terms still share a factor?', factoriseModel('6m²n + 9mn'))

/* ---------- Rung 2: three terms (A4.2) ---------- */

const threeVideo = worked(three, `Factorise fully ${nb('10x + 15y + 5')}.`, 'A4.2 video + Q1', factoriseModel('10x + 15y + 5'), 'The common factor has to go into every term, even the plain number.')
video(threeVideo, media('three-terms', 'Factorising 10x + 15y + 5', 53, 'A4.2_Factorising_Three_Terms.mp4', [
  'The common factor has to fit into every term. Split every term, even the plain number: 10x = 5 × 2 × x, 15y = 5 × 3 × y and 5 = 5 × 1.',
  'Only 5 fits all three terms. The letters x and y are not in every term, so they stay inside.',
  'Write 5 outside. The plain number 5 gives 1 inside the bracket: it does not vanish. 10x + 15y + 5 = 5(2x + 3y + 1).',
  'Expand it back to check all three: 5 × 2x = 10x, 5 × 3y = 15y and 5 × 1 = 5.',
  'Where you see it: three crates share a side of 5, so 5 goes outside. Their other sides are 2x, 3y and 1.',
]))
video2(threeVideo, media('three-terms-another-way', 'Another way: factorising 10x + 15y + 5 by dividing', 53, 'A4.2_Factorising_Three_Terms.mp4 (second version)', [
  'Another way to do the same question. Split every term, even the plain number: 10x = 5 × 2 × x, 15y = 5 × 3 × y and 5 = 5 × 1. Only 5 fits all three terms.',
  'Divide the whole expression by 5: (10x + 15y + 5) ÷ 5 = 10x ÷ 5 + 15y ÷ 5 + 5 ÷ 5.',
  'The 5s cancel on the top and bottom of each term, leaving 2x, 3y and 1. Even 5 ÷ 5 leaves a 1.',
  'What is left goes inside the bracket: 10x + 15y + 5 = 5(2x + 3y + 1).',
  'Where you see it: three crates share a side of 5, so 5 goes outside.',
]))
factoriseQuestion(three, 'A4.2 Q2', '3p + 6q + 9r', '3(p + 2q + 3r)', 'Which number goes into 3, 6 and 9? Divide every term by it.', `Factorise ${nb('3p + 6q + 9r')}.`)
factoriseQuestion(three, 'A4.2 Q3', '6x² + 9x + 12xy', '3x(2x + 3 + 4y)', 'Find the biggest number in 6, 9 and 12. Is there a letter in every term?', `A garden has three beds with areas ${nb('6x²')}, ${nb('9x')} and ${nb('12xy')} square metres. Factorise fully the expression for the total area, ${nb('6x² + 9x + 12xy')}.`)
factoriseQuestion(three, 'A4.2 Q4a', '12x² + 18x + 6', '6(2x² + 3x + 1)', 'The biggest number in 12, 18 and 6. The last term has no x, so x can’t come out.', `An order at a shop costs ${nb('12x² + 18x + 6')} pence. Factorise fully the expression for the cost.`)
practice(three, `Ravi factorises ${nb('12x² + 18x + 6')} as ${nb('6(2x² + 3x)')}. What mistake has he made?`, 'A4.2 Q4b', choose(
  'He left out the + 1: 6 ÷ 6 = 1, so it’s 6(2x² + 3x + 1)',
  ['He should have taken out 6x', '6x doesn’t go into the last term, 6, so only 6 comes out. His mistake is the missing + 1.'],
  ['12x² ÷ 6 should be 2x', 'Only the numbers are divided by 6, so 12x² ÷ 6 = 2x² is right. The mistake is the last term: 6 ÷ 6 = 1.'],
  ['No mistake: 6 ÷ 6 leaves nothing', '6 ÷ 6 = 1, not 0. Expand his answer and you get 12x² + 18x: the + 6 has gone.'],
), 'Expand his answer and compare it with the question.', factoriseModel('12x² + 18x + 6'))
factoriseQuestion(three, 'A4.2 Q5a', '8x³y + 12x²y² + 4xy', '4xy(2x² + 3xy + 1)', 'The biggest number in 8, 12 and 4. Every term has an x and a y. The last term divided by itself is 1.', `A box has a volume of ${nb('8x³y + 12x²y² + 4xy')} cubic centimetres. Factorise fully the expression for the volume.`)
practice(three, `Check that ${nb('4xy(2x² + 3xy + 1)')} is right by expanding it.`, 'A4.2 Q5b', choose(
  '8x³y + 12x²y² + 4xy, which matches the question',
  ['8x³y + 12x²y²', '4xy × 1 = 4xy. The 1 in the bracket gives a term too.'],
  ['8x²y + 12xy + 4xy', 'Add the powers of each letter: 4xy × 2x² = 8x³y, and 4xy × 3xy = 12x²y².'],
), 'Multiply 4xy by each of the three terms.', checkModel('4xy(2x² + 3xy + 1)'))
factoriseQuestion(three, 'A4.2 Q5c', '9k³ + 6k² − 3k', '3k(3k² + 2k − 1)', 'Find the biggest number in 9, 6 and 3, and the power of k every term has. The last term is negative, so the sign stays.')

add('mixed', 'Factorising', 'A4.1-A4.2 consolidation', text(
  'Factorising is expanding backwards: take out what every term shares.',
  'Find the biggest number that goes into every term, and every letter that is in every term: 6x² + 9x = 3x(2x + 3).',
  'Divide each term by the common factor. A term that is the whole factor leaves 1: 10x + 15y + 5 = 5(2x + 3y + 1).',
  'Fully factorised means nothing is still shared inside the bracket. Expand your answer to check it.',
))

export const tutorFactorisingLesson: TutorMethodLesson = {
  id: 'L018', number: 18, title: 'Factorising', level: 'GCSE Foundation',
  goal: 'Factorise expressions fully by taking out the highest common factor.',
  labels: { [two]: 'Two terms', [three]: 'Three terms', mixed: 'Review' },
  states: finish(),
}
