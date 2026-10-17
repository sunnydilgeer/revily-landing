/*
 * Lesson 11 (Ordering numbers), Higher section: ordering algebraic terms. From the Higher revision guide, N11 Type 5
 * (Level 6-7) and its Your Turn Q5: put a value in for x that fits the condition, work out each term, order the values,
 * then write the terms back in that order.
 */
import { author } from '../../written-methods/tutor/content'
import { line, part, sign, type StepLine, type StepWorking } from '../../written-methods/tutor/stepWorking'
import { choose, screens, type HigherAddition } from './helpers'

const skill = 'ordering-algebraic-terms'
const a = author(11, 'L11-H')
const { worked, practice } = screens(a)

type Term = { term: string; sum?: string; value: string }
/** "x² = 2² → 4": the term, the value put in, and what it comes to (left off when it is the value itself). */
const termLine = ({ term, sum, value }: Term, family: number): StepLine => sum
  ? line([part(term, family), sign('='), part(sum)], value, { eq: true })
  : line([part(term, family)], value, { eq: true })

/** The four moves: pick x, work out each term, order the values, write the terms in that order. */
function orderTerms(start: string, x: string, pickWhy: string, terms: Term[], order: number[], answer: string, compare = 'Compare the values. Change a fraction to a decimal if it helps.'): StepWorking {
  const sign_ = /largest/.test(answer) ? '>' : '<'
  return {
    kind: 'step-worked', start, steps: [
      { title: 'Choose x', why: pickWhy, lines: [line([part('x', 3)], x, { eq: true })] },
      { title: 'Work out each term', why: 'Put the value in for x in every term.', lines: terms.map((term, i) => termLine(term, i % 4)) },
      { title: 'Order the values', why: compare, lines: [line(order.flatMap((at, i) => [...(i ? [sign(sign_)] : []), part(terms[at].value, at % 4)]))] },
      { title: 'Write the answer', why: 'Swap each value back for the term it came from, keeping the order.', words: answer.replace(/ \((smallest|largest) first\)$/, '') },
    ],
  }
}

worked(skill, 'Put x², 1/x, x and x + 1 in order from smallest to largest. x is a whole number bigger than 1.', 'Higher N11 Type 5', orderTerms(
  'x², 1/x, x, x + 1', '2', 'x can be any whole number bigger than 1. The easiest one to work with is 2.',
  [{ term: 'x²', sum: '2²', value: '4' }, { term: '1/x', sum: '1/2', value: '0.5' }, { term: 'x', value: '2' }, { term: 'x + 1', sum: '2 + 1', value: '3' }],
  [1, 2, 3, 0], '1/x, x, x + 1, x² (smallest first)',
), 'When terms have letters in, put a number in for the letter first. Then they are just numbers to order.')

practice(skill, 'Put 1/x, x², x, x + 1 and 2x in order from smallest to largest. x is a whole number bigger than 2.', 'Higher N11 Your Turn Q5', choose([
  '1/x, x, x + 1, 2x, x²',
  '1/x, x, x + 1, x², 2x',
  'x, x + 1, 2x, x², 1/x',
]), '1/x, x, x + 1, 2x, x²', 'x must be bigger than 2, so try x = 3.', orderTerms(
  '1/x, x², x, x + 1, 2x', '3', 'x must be a whole number bigger than 2, so the easiest one is 3. (With 2, x² and 2x are both 4, so they would tie.)',
  [{ term: '1/x', sum: '1/3', value: '0.33…' }, { term: 'x²', sum: '3²', value: '9' }, { term: 'x', value: '3' }, { term: 'x + 1', sum: '3 + 1', value: '4' }, { term: '2x', sum: '2 × 3', value: '6' }],
  [0, 2, 3, 4, 1], '1/x, x, x + 1, 2x, x² (smallest first)',
))

practice(skill, 'Put x², x − 1, x³ and 1/x in order from largest to smallest. x is a whole number bigger than 1.', 'Higher N11 extra practice', choose([
  'x³, x², x − 1, 1/x',
  'x³, x², 1/x, x − 1',
  '1/x, x − 1, x², x³',
]), 'x³, x², x − 1, 1/x', 'Try x = 2, then order the values from largest.', orderTerms(
  'x², x − 1, x³, 1/x', '2', 'x can be any whole number bigger than 1. The easiest one to work with is 2.',
  [{ term: 'x²', sum: '2²', value: '4' }, { term: 'x − 1', sum: '2 − 1', value: '1' }, { term: 'x³', sum: '2³', value: '8' }, { term: '1/x', sum: '1/2', value: '0.5' }],
  [2, 0, 1, 3], 'x³, x², x − 1, 1/x (largest first)', 'Order the values from largest to smallest, as the question asks.',
))

practice(skill, 'x = 0.5. Put x, x² and 1/x in order from smallest to largest.', 'Higher N11 extra practice', choose([
  'x², x, 1/x',
  'x, x², 1/x',
  '1/x, x, x²',
]), 'x², x, 1/x', 'Squaring a number between 0 and 1 makes it smaller.', orderTerms(
  'x, x², 1/x', '0.5', 'The question gives the value of x, so use it.',
  [{ term: 'x', value: '0.5' }, { term: 'x²', sum: '0.5²', value: '0.25' }, { term: '1/x', sum: '1 ÷ 0.5', value: '2' }],
  [1, 0, 2], 'x², x, 1/x (smallest first)', 'Squaring a number between 0 and 1 makes it smaller, and dividing 1 by it makes it bigger.',
))

practice(skill, 'Ella says x² is always bigger than 2x when x is a positive whole number. Is she right?', 'Higher N11 extra practice', choose([
  'No. When x = 1, x² is 1 but 2x is 2',
  'Yes. Squaring always gives a bigger answer than doubling',
  'Yes. When x = 3, x² is 9 and 2x is 6',
]), 'No. When x = 1, x² is 1 but 2x is 2', 'Test the smallest positive whole numbers first: 1, then 2.', {
  kind: 'step-worked', start: 'x² or 2x?', steps: [
    { title: 'Try x = 1', why: 'Start with the smallest positive whole number.', lines: [line([part('x²', 0), sign('='), part('1²')], '1', { eq: true }), line([part('2x', 1), sign('='), part('2 × 1')], '2', { eq: true, mark: '2x is bigger' })] },
    { title: 'Write the answer', why: 'One value of x where it fails is enough to show a claim is wrong.', words: 'No. When x = 1, x² is 1 but 2x is 2' },
  ],
})

export const orderingTerms: HigherAddition = { lessonId: 'L011', skill, label: 'Ordering algebraic terms', states: a.finish() }
