/*
 * Lesson 2H, Simplifying with BIDMAS (Higher only). From the Higher revision guide, N2 Your Turn Q5 (Level 6-7):
 * a fraction with algebra on the top and the bottom. BIDMAS still decides the order: the bracket first, then each
 * product or division, then divide the top by the bottom (numbers divide, powers of the same letter take away).
 * Lesson 2 has its own lesson view (order-of-operations/variant-c), so this is a short lesson of its own after it.
 */
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { line, part, sign, type StepWorking } from '../../written-methods/tutor/stepWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { choose, number, screens, text } from './helpers'

const a = author(2.5, 'L2H')
const { add, finish } = a
const { worked, practice } = screens(a)

const skill = 'bidmas-algebraic-fractions'

/** A simplified expression typed with the power keys: 4x², 15y. */
const expression = (answer: string): InteractionDefinition => ({
  type: 'numericInput', responseShape: 'expression', acceptanceRule: 'collectedExpression', anyPower: true, correctAnswer: answer, displayAnswer: answer,
})

type Sum = { left: string; op: '+' | '−' | '×' | '÷'; right: string; value: string }
const sumLine = ({ left, op, right, value }: Sum, family: number) => line([part(left, family), sign(op), part(right)], value)

/** Bracket, bottom, top, then divide: the order every question here is worked in. */
function simplify(start: string, bracket: Sum, bottom: Sum, top: Sum, divide: Sum, answer = divide.value): StepWorking {
  return {
    kind: 'step-worked', start, steps: [
      { title: 'Bracket first', why: 'Brackets come first in BIDMAS. Collect the like terms inside.', lines: [sumLine(bracket, 0)] },
      { title: 'Work out the bottom', why: 'Divide the numbers, then take away the powers of each letter.', lines: [sumLine(bottom, 1)] },
      { title: 'Work out the top', why: 'Multiply the numbers, then add the powers of each letter.', lines: [sumLine(top, 2)] },
      { title: 'Divide top by bottom', why: 'Cancel the numbers, then take away the powers of each letter. A letter left only on the bottom stays there.', lines: [line([part(divide.left, 2), sign('÷'), part(divide.right, 1)], answer, { answer: true })] },
    ],
  }
}

worked(skill, 'Write (42q² × pq) ÷ (28p³ ÷ (9p − 5p)) in its simplest form.', 'Higher N2 Your Turn Q5', simplify(
  '42q² × pq ÷ (28p³ ÷ (9p − 5p))',
  { left: '9p', op: '−', right: '5p', value: '4p' },
  { left: '28p³', op: '÷', right: '4p', value: '7p²' },
  { left: '42q²', op: '×', right: 'pq', value: '42pq³' },
  { left: '42pq³', op: '÷', right: '7p²', value: '6q³/p' },
), 'This is a fraction with 42q² × pq on top and 28p³ ÷ (9p − 5p) on the bottom. BIDMAS still decides the order. Work out the top and the bottom, then divide.')

practice(skill, 'Simplify (6x² × 2x) ÷ 3x.', 'Higher N2 extra practice', expression('4x²'), '4x²', 'Multiply on the top first, then divide by 3x.', {
  kind: 'step-worked', start: '6x² × 2x ÷ 3x', steps: [
    { title: 'Work out the top', why: 'Multiply the numbers, then add the powers of x.', lines: [line([part('6x²', 0), sign('×'), part('2x')], '12x³')] },
    { title: 'Divide top by bottom', why: 'Divide the numbers, then take away the powers of x.', lines: [line([part('12x³', 0), sign('÷'), part('3x', 1)], '4x²', { answer: true })] },
  ],
}, 'Simplified expression')

practice(skill, 'Simplify 20a³b ÷ (12a − 7a).', 'Higher N2 extra practice', expression('4a²b'), '4a²b', 'Collect the terms in the bracket first.', {
  kind: 'step-worked', start: '20a³b ÷ (12a − 7a)', steps: [
    { title: 'Bracket first', why: 'Brackets come first in BIDMAS. Collect the like terms inside.', lines: [line([part('12a', 0), sign('−'), part('7a')], '5a')] },
    { title: 'Divide', why: 'Divide the numbers, then take away the powers of a. The b has nothing to cancel with, so it stays.', lines: [line([part('20a³b'), sign('÷'), part('5a', 0)], '4a²b', { answer: true })] },
  ],
}, 'Simplified expression')

practice(skill, 'Simplify (15y² × 2y) ÷ (10y³ ÷ (7y − 2y)).', 'Higher N2 extra practice', expression('15y'), '15y', 'Bracket, then the bottom, then the top.', simplify(
  '15y² × 2y ÷ (10y³ ÷ (7y − 2y))',
  { left: '7y', op: '−', right: '2y', value: '5y' },
  { left: '10y³', op: '÷', right: '5y', value: '2y²' },
  { left: '15y²', op: '×', right: '2y', value: '30y³' },
  { left: '30y³', op: '÷', right: '2y²', value: '15y' },
), 'Simplified expression')

practice(skill, 'Simplify (8m² × 3mn) ÷ (16m ÷ (5m − 3m)).', 'Higher N2 extra practice', choose([
  '3m³n',
  '3m²n',
  '12m³n',
]), '3m³n', 'The bottom comes to a number with no m in it.', simplify(
  '8m² × 3mn ÷ (16m ÷ (5m − 3m))',
  { left: '5m', op: '−', right: '3m', value: '2m' },
  { left: '16m', op: '÷', right: '2m', value: '8' },
  { left: '8m²', op: '×', right: '3mn', value: '24m³n' },
  { left: '24m³n', op: '÷', right: '8', value: '3m³n' },
))

practice(skill, 'Simplify (36r² × r) ÷ (12r⁴ ÷ (r + 2r)).', 'Higher N2 extra practice', number(9, '9'), '9', 'Every r cancels.', simplify(
  '36r² × r ÷ (12r⁴ ÷ (r + 2r))',
  { left: 'r', op: '+', right: '2r', value: '3r' },
  { left: '12r⁴', op: '÷', right: '3r', value: '4r³' },
  { left: '36r²', op: '×', right: 'r', value: '36r³' },
  { left: '36r³', op: '÷', right: '4r³', value: '9' },
), 'Answer')

practice(skill, 'Write (12x × y²) ÷ (24x⁴ ÷ (5x − 2x)) in its simplest form.', 'Higher N2 Your Turn Q5', choose([
  '3y²/2x²',
  '3x²y²/2',
  '2y²/3x²',
]), '3y²/2x²', 'There are more x’s on the bottom than the top, so x stays on the bottom.', simplify(
  '12x × y² ÷ (24x⁴ ÷ (5x − 2x))',
  { left: '5x', op: '−', right: '2x', value: '3x' },
  { left: '24x⁴', op: '÷', right: '3x', value: '8x³' },
  { left: '12x', op: '×', right: 'y²', value: '12xy²' },
  { left: '12xy²', op: '÷', right: '8x³', value: '3y²/2x²' },
))

practice(skill, 'Sam says 24x³ ÷ 4x is 6x³. What has he done wrong?', 'Higher N2 extra practice', choose([
  'He divided the numbers but kept x³. It should be 6x²',
  'He should have multiplied the numbers. It should be 96x⁴',
  'Nothing. 6x³ is right',
]), 'He divided the numbers but kept x³. It should be 6x²', 'What happens to the powers of x when you divide?', {
  kind: 'step-worked', start: '24x³ ÷ 4x', steps: [
    { title: 'Divide the numbers', why: 'Sam got this part right.', lines: [line([part('24', 0), sign('÷'), part('4')], '6')] },
    { title: 'Take away the powers', why: 'Dividing by x takes one x away, so the power goes down by one.', lines: [line([part('x³', 1), sign('÷'), part('x')], 'x²')] },
    { title: 'Write the answer', why: 'Sam kept the power the same, so his answer is too big by a factor of x.', words: 'He divided the numbers but kept x³. It should be 6x²' },
  ],
})

add('mixed', 'Simplifying with BIDMAS', 'Higher N2 consolidation', text(
  'Brackets first: collect the like terms inside.',
  'Then work out the top and the bottom on their own.',
  'Multiplying adds the powers of a letter. Dividing takes them away.',
  'A letter with more powers on the bottom stays on the bottom of the answer.',
))

export const tutorBidmasAlgebraLesson: TutorMethodLesson = {
  id: 'L002H', number: 2.5, title: 'Simplifying with BIDMAS', level: 'GCSE Higher',
  goal: 'Simplify a fraction with algebra on the top and the bottom, using BIDMAS and the rules for powers.',
  labels: { [skill]: 'Algebraic fractions with BIDMAS', mixed: 'Review' },
  states: finish(),
}
