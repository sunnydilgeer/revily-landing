/*
 * Lesson 9H, The quadratic formula (Higher only). From the Higher revision guide, A13 (every box Level 6-7) and its Your
 * Turn page: the formula and what a, b and c are, a = 1 (x² + 2x − 35 = 0), a > 1 to 2 dp (2x² − 6x + 3 = 0), the ±
 * note, then Q1 to Q4 rounded and Q5 in surd form. Rounded answers are typed as "x = ☐ or x = ☐", in either order; an
 * answer like −2 ± √3 is typed in two boxes, so only the simplest form passes.
 */
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { line, part, sign, type StepLine, type StepWorking, type WorkedStep } from '../../written-methods/tutor/stepWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { choose, screens, text } from './helpers'

const a = author(22.5, 'L22H')
const { add, finish } = a
const { worked, practice } = screens(a)

const formula = 'quadratic-formula'
const surdForm = 'quadratic-formula-surds'

const show = (n: number) => String(n).replace('-', '−')
/** −3 → "(−3)", so a sum reads 4 × 1 × (−35). */
const bracket = (n: number) => n < 0 ? `(${show(n)})` : show(n)
/** "x² + 2x − 35", leaving out 1s and 0s. */
function quadText(qa: number, qb: number, qc: number) {
  const term = (k: number, x: string, first: boolean) => {
    if (k === 0) return ''
    const size = Math.abs(k) === 1 && x ? '' : String(Math.abs(k))
    return first ? `${k < 0 ? '−' : ''}${size}${x}` : ` ${k < 0 ? '−' : '+'} ${size}${x}`
  }
  return `${term(qa, 'x²', true)}${term(qb, 'x', false)}${term(qc, '', false)}`
}
/** Rounded to `places` decimal places, or to `figures` significant figures. */
const round = (value: number, places?: number, figures?: number) => figures ? Number(value.toPrecision(figures)) : Number(value.toFixed(places))
const dots = (value: number) => `${show(Number(value.toFixed(4)))}…`

/** "x = ☐ or x = ☐", in either order. */
const twoRoots = (values: number[], shown: string): InteractionDefinition => ({ type: 'numericInput', responseShape: 'roots', acceptanceRule: 'unorderedSet', correctAnswer: values.join(', '), displayAnswer: shown })
/** "x = ☐ ± √☐", or "x = ☐ ± ☐√☐": the boxes only take the simplest form. */
const plusMinusRoot = (numbers: number[], shown: string): InteractionDefinition => ({
  type: 'numericInput', responseShape: 'list', listJoiner: '', acceptanceRule: 'numberList', signed: true,
  listLabels: numbers.length === 2 ? ['x =', '± √'] : ['x =', '±', '√'], correctAnswer: numbers.join(', '), displayAnswer: shown,
})

/** The first two moves of every question: (make it 0), name a, b and c, then work out b² − 4ac. */
function opening(qa: number, qb: number, qc: number, given?: string): WorkedStep[] {
  const steps: WorkedStep[] = []
  if (given) steps.push({ title: 'Make it 0', why: 'The formula needs everything on one side, with 0 on the other.', lines: [line([part(given, 0)], `${quadText(qa, qb, qc)} = 0`, { eq: true })] })
  steps.push({ title: 'Find a, b, c', why: 'a is the number of x², b the number of x, and c the number on its own. Each keeps its sign.', lines: [
    line([part('a', 0)], show(qa), { eq: true }), line([part('b', 1)], show(qb), { eq: true }), line([part('c', 2)], show(qc), { eq: true }),
  ] })
  const square = qb * qb, four = 4 * qa * qc
  steps.push({ title: 'Find b² − 4ac', why: 'This is the part under the square root. Work it out first, minding the signs.', lines: [
    line([part(bracket(qb), 1), sign('×'), part(bracket(qb), 1)], square),
    line([part('4'), sign('×'), part(bracket(qa), 0), sign('×'), part(bracket(qc), 2)], show(four)),
    line([part(square), sign('−'), part(bracket(four))], square - four),
  ] })
  return steps
}
const intoFormula = (qa: number, qb: number, disc: number): WorkedStep => ({
  title: 'Use the formula', why: 'Minus b, plus or minus the root, all over two lots of a.',
  lines: [line([part('x')], `(${show(-qb)} ± √${disc}) / ${2 * qa}`, { eq: true })],
})

/** A whole-number root: the + and the − each give an answer. */
function exactWorking(qa: number, qb: number, qc: number, given?: string): { working: StepWorking; answer: string; values: number[] } {
  const disc = qb * qb - 4 * qa * qc, root = Math.sqrt(disc)
  const [plus, minus] = [(-qb + root) / (2 * qa), (-qb - root) / (2 * qa)]
  const answer = `x = ${show(plus)} or x = ${show(minus)}`
  const steps = [...opening(qa, qb, qc, given), intoFormula(qa, qb, disc),
    { title: 'Root it', why: 'It is a square number, so its root is a whole number.', lines: [line([part(`√${disc}`)], root, { eq: true })] },
    { title: 'Use the plus', why: 'The plus sign gives one answer.', lines: [line([part(show(-qb)), sign('+'), part(root)], -qb + root), line([part(show(-qb + root)), sign('÷'), part(2 * qa)], show(plus))] },
    { title: 'Use the minus', why: 'The minus sign gives the other answer.', lines: [line([part(show(-qb)), sign('−'), part(root)], show(-qb - root)), line([part(show(-qb - root)), sign('÷'), part(2 * qa)], show(minus))] },
    { title: 'Write both answers', why: 'A quadratic equation usually has two answers.', lines: [line([part(`${quadText(qa, qb, qc)} = 0`)], answer, { answer: true })] },
  ]
  return { working: { kind: 'step-worked', start: given ?? `${quadText(qa, qb, qc)} = 0`, steps }, answer, values: [plus, minus] }
}

/** A root that isn't whole: use the calculator, then round both answers the way the question asks. */
function roundedWorking(qa: number, qb: number, qc: number, accuracy: { places?: number; figures?: number }, given?: string) {
  const disc = qb * qb - 4 * qa * qc, root = Math.sqrt(disc)
  const exact = [(-qb + root) / (2 * qa), (-qb - root) / (2 * qa)]
  const values = exact.map(v => round(v, accuracy.places, accuracy.figures))
  const answer = `x = ${show(values[0])} or x = ${show(values[1])}`
  const how = accuracy.figures ? `${accuracy.figures} significant figures` : `${accuracy.places} decimal places`
  const steps: WorkedStep[] = [...opening(qa, qb, qc, given), intoFormula(qa, qb, disc),
    { title: 'Use the calculator', why: 'The root isn’t a whole number. Keep every digit until the end.', lines: [
      line([part(`(${show(-qb)} + √${disc}) / ${2 * qa}`, 0)], dots(exact[0]), { eq: true }),
      line([part(`(${show(-qb)} − √${disc}) / ${2 * qa}`, 1)], dots(exact[1]), { eq: true }),
    ] },
    { title: 'Round both answers', why: `The question asks for ${how}.`, lines: [
      line([part(dots(exact[0]), 0)], show(values[0]), { eq: true }),
      line([part(dots(exact[1]), 1)], show(values[1]), { eq: true }),
      line([part(`${quadText(qa, qb, qc)} = 0`)], answer, { answer: true }),
    ] as StepLine[] },
  ]
  return { working: { kind: 'step-worked' as const, start: given ?? `${quadText(qa, qb, qc)} = 0`, steps }, answer, values }
}
function rounded(qa: number, qb: number, qc: number, accuracy: { places?: number; figures?: number }, sourceRef: string, hint: string, given?: string) {
  const { working, answer, values } = roundedWorking(qa, qb, qc, accuracy, given)
  const how = accuracy.figures ? `${accuracy.figures} significant figures` : `2 decimal places`
  return practice(formula, `Use the quadratic formula to solve ${working.start}. Give your answers to ${how}.`, sourceRef, twoRoots(values, answer), answer, hint, working)
}

/* ---------- Section 1: using the formula ---------- */

add(formula, 'The quadratic formula', 'Higher A13 The Quadratic Formula', text(
  'The quadratic formula solves any quadratic equation ax² + bx + c = 0, even one that won’t factorise.',
  'x = (−b ± √(b² − 4ac)) / 2a',
  'a is the number in front of x², b the number in front of x, and c the number on its own. Each keeps its sign.',
  'You are not given this formula in the exam, so learn it.',
))
add(formula, 'Why plus or minus?', 'Higher A13 Take note', text(
  'The ± means "plus or minus". A quadratic has up to two answers.',
  'Use the plus sign for one answer and the minus sign for the other.',
  'You can put the formula straight into a calculator, once with + and once with −.',
))
const example1 = exactWorking(1, 2, -35)
worked(formula, 'Use the quadratic formula to solve x² + 2x − 35 = 0.', 'Higher A13 Example 1', example1.working,
  'Find a, b and c, work out b² − 4ac, then put them into the formula. The plus gives one answer and the minus the other.')
const example2 = roundedWorking(2, -6, 3, { places: 2 })
worked(formula, 'Use the quadratic formula to solve 2x² − 6x + 3 = 0. Give your answers to 2 decimal places.', 'Higher A13 Example 2', example2.working,
  'Here b² − 4ac is 12, which is not a square number. That’s how you know the answers won’t be whole, so round them.')
const own = exactWorking(1, -3, -10)
practice(formula, 'Use the quadratic formula to solve x² − 3x − 10 = 0.', 'Higher A13 extra practice', twoRoots(own.values, own.answer), own.answer, 'b is −3, so minus b is 3.', own.working)
rounded(1, 11, 16, { figures: 3 }, 'Higher A13 Your Turn Q1', 'a is 1, b is 11 and c is 16.')
rounded(1, -2, -44, { figures: 3 }, 'Higher A13 Your Turn Q2', 'Make one side 0 first.', 'x² − 2x = 44')
rounded(4, 7, -1, { places: 2 }, 'Higher A13 Your Turn Q3', 'c is −1, so −4ac is plus.')
rounded(1, 8, 13, { places: 2 }, 'Higher A13 Your Turn Q4', 'Add 13 to both sides first.', 'x² + 8x = −13')

/* ---------- Section 2: answers in surd form ---------- */

add(surdForm, 'Answers in surd form', 'Higher A13 Your Turn Q5', text(
  '"Surd form" means exact: leave the square root in, and don’t use a calculator to round.',
  'Simplify the surd: √12 = 2√3.',
  'Then divide every part by any number they share: (−4 ± 2√3) / 2 = −2 ± √3.',
))
practice(surdForm, 'Solve x² + 4x + 1 = 0. Give your answers in surd form.', 'Higher A13 extra practice', plusMinusRoot([-2, 3], 'x = −2 ± √3'), 'x = −2 ± √3', 'b² − 4ac is 12. Simplify √12, then divide by 2.', {
  kind: 'step-worked', start: 'x² + 4x + 1 = 0', steps: [
    ...opening(1, 4, 1), intoFormula(1, 4, 12),
    { title: 'Simplify the surd', why: 'Four is a square factor of twelve, so two comes out in front.', lines: [line([part('√12', 0)], '2√3', { eq: true })] },
    { title: 'Divide by 2', why: 'Both parts of the top divide by the two on the bottom.', lines: [line([part('(−4 ± 2√3) / 2')], 'x = −2 ± √3', { eq: true, answer: true })] },
  ],
}, 'Exact answers')
practice(surdForm, 'Solve x² − 6x + 4 = 0. Give your answers in surd form.', 'Higher A13 extra practice', plusMinusRoot([3, 5], 'x = 3 ± √5'), 'x = 3 ± √5', 'b² − 4ac is 20. Simplify √20, then divide by 2.', {
  kind: 'step-worked', start: 'x² − 6x + 4 = 0', steps: [
    ...opening(1, -6, 4), intoFormula(1, -6, 20),
    { title: 'Simplify the surd', why: 'Four is a square factor of twenty, so two comes out in front.', lines: [line([part('√20', 0)], '2√5', { eq: true })] },
    { title: 'Divide by 2', why: 'Both parts of the top divide by the two on the bottom.', lines: [line([part('(6 ± 2√5) / 2')], 'x = 3 ± √5', { eq: true, answer: true })] },
  ],
}, 'Exact answers')
practice(surdForm, 'Use the quadratic formula to find the solutions to 25x² − 30x + 7 = 0, giving your answer in surd form.', 'Higher A13 Your Turn Q5', choose([
  'x = (3 ± √2) / 5', 'x = (30 ± √200) / 5', 'x = (3 ± √2) / 50',
]), 'x = (3 ± √2) / 5', 'b² − 4ac is 200. Simplify √200, then divide every part by 10.', {
  kind: 'step-worked', start: '25x² − 30x + 7 = 0', steps: [
    ...opening(25, -30, 7), intoFormula(25, -30, 200),
    { title: 'Simplify the surd', why: 'One hundred is a square factor of two hundred, so ten comes out in front.', lines: [line([part('√200', 0)], '10√2', { eq: true })] },
    { title: 'Divide by 10', why: 'Every part of the top and the bottom divides by ten.', lines: [line([part('(30 ± 10√2) / 50')], 'x = (3 ± √2) / 5', { eq: true, answer: true })] },
  ],
})

add('mixed', 'The quadratic formula', 'Higher A13 consolidation', text(
  'Make one side 0, then read off a, b and c with their signs.',
  'Work out b² − 4ac first. If it is a square number, the answers are whole numbers or fractions.',
  'x = (−b ± √(b² − 4ac)) / 2a: the plus gives one answer and the minus the other.',
  'Round only at the end. For surd form, simplify the root and divide by any shared number.',
))

export const tutorQuadraticFormulaLesson: TutorMethodLesson = {
  id: 'L022H', number: 22.5, title: 'The quadratic formula', level: 'GCSE Higher',
  goal: 'Solve any quadratic with the formula, giving answers to decimal places, significant figures or in surd form.',
  labels: { [formula]: 'Using the formula', [surdForm]: 'Answers in surd form', mixed: 'Review' },
  states: finish(),
}
