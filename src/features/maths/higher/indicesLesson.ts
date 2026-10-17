/*
 * Lesson 16H, Negative and fractional powers (Higher only). From the Higher revision guide, A3 Indices Rules (every box
 * Level 6-7) and its Your Turn page: Rule 10 (a negative power is 1 over the positive power, and flips a fraction),
 * Rule 8 (the bottom of a fractional power is a root) and Rule 9 (the top is a power: root first, then power), then the
 * rules together (Example 3, write it as one power of 2). Fractional powers are written ^(2/3); Powers.tsx raises them.
 */
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { line, part, sign, type StepWorking } from '../../written-methods/tutor/stepWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { choose, fraction, number, screens, text } from './helpers'

const a = author(16.5, 'L16H')
const { add, finish } = a
const { worked, practice } = screens(a)

const negative = 'indices-negative-powers'
const fractional = 'indices-fractional-powers'
const together = 'indices-rules-together'

/** "Write … as a single power": a base box and a raised power box. */
const power = (base: number, n: number): InteractionDefinition => ({
  type: 'numericInput', responseShape: 'power', acceptanceRule: 'power', correctAnswer: `${base}^${n}`, displayAnswer: `${base}${[...String(n)].map(c => c === '-' ? '⁻' : '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(c)]).join('')}`,
})

/* ---------- Section 1: negative powers (Rule 10) ---------- */

/** aⁿ with n negative: flip it to 1 over the positive power, then work that out. */
function flipWorking(start: string, positive: string, repeated: string, value: number, answer: string): StepWorking {
  return {
    kind: 'step-worked', start, steps: [
      { title: 'Flip it', why: 'A negative power means 1 over the same number to the positive power.', lines: [line([part(start, 0)], `1/${positive}`, { eq: true })] },
      { title: 'Work out the bottom', why: 'Multiply the number by itself as many times as the power says.', lines: [line([part(repeated, 1)], value)] },
      { title: 'Write the answer', why: 'The minus sign only flipped the number. The answer is a fraction, not a negative number.', lines: [line([part(start)], answer, { eq: true, answer: true })] },
    ],
  }
}

add(negative, 'What does a negative power mean?', 'Higher A3 Rule 10', text(
  'A negative power flips the number: put 1 over it, with the power made positive.',
  'a⁻ⁿ = 1/aⁿ',
  '10⁻¹ = 1/10 and 4⁻² = 1/4² = 1/16',
  'A fraction to a negative power flips over: (a/b)⁻ⁿ = (b/a)ⁿ',
  'A negative power never makes the answer negative.',
))
worked(negative, 'Simplify 4⁻³.', 'Higher A3 Example 1', flipWorking('4⁻³', '4³', '4 × 4 × 4', 64, '1/64'),
  'Put 1 over the number with the power made positive, then work out the power.')
practice(negative, 'Work out 5⁻².', 'Higher A3 extra practice', fraction('1/25'), '1/25', 'Put 1 over 5², then work out 5².', flipWorking('5⁻²', '5²', '5 × 5', 25, '1/25'), 'Answer')
practice(negative, 'Work out 2⁻⁵.', 'Higher A3 extra practice', fraction('1/32'), '1/32', 'Put 1 over 2⁵.', flipWorking('2⁻⁵', '2⁵', '2 × 2 × 2 × 2 × 2', 32, '1/32'), 'Answer')
practice(negative, 'Which is equal to 3⁻²?', 'Higher A3 extra practice', choose(['1/9', '−9', '−6']), '1/9', 'A negative power flips the number. It doesn’t make it negative.', flipWorking('3⁻²', '3²', '3 × 3', 9, '1/9'))
practice(negative, 'Work out (2/3)⁻².', 'Higher A3 Rule 10', fraction('9/4'), '9/4', 'A fraction to a negative power flips over first.', {
  kind: 'step-worked', start: '(2/3)⁻²', steps: [
    { title: 'Flip the fraction', why: 'A negative power flips a fraction over, and the power becomes positive.', lines: [line([part('(2/3)⁻²', 0)], '(3/2)²', { eq: true })] },
    { title: 'Square top and bottom', why: 'A power of a fraction works on the top and the bottom.', lines: [line([part('3', 1), sign('×'), part('3', 1)], 9), line([part('2', 2), sign('×'), part('2', 2)], 4)] },
    { title: 'Write the answer', why: 'Nine on the top, four on the bottom.', lines: [line([part('(2/3)⁻²')], '9/4', { eq: true, answer: true })] },
  ],
}, 'Answer')

/* ---------- Section 2: fractional powers (Rules 8 and 9) ---------- */

/** a^(top/bottom): the bottom is the root, the top the power. Root first, so the numbers stay small. */
function rootWorking(start: string, root: string, rootValue: number, raise: { top: number; sum: string } | null, answer: string, negativeFirst = false): StepWorking {
  const steps: StepWorking['steps'] = []
  if (negativeFirst) steps.push({ title: 'Flip it', why: 'Deal with the minus first: 1 over the same number to the positive power.', lines: [line([part(start, 0)], `1/${start.replace('^(-', '^(')}`, { eq: true })] })
  steps.push({ title: 'Bottom is the root', why: 'The bottom of a fractional power says which root to take.', lines: [line([part(root, 1)], rootValue, { eq: true })] })
  if (raise) steps.push({ title: 'Top is the power', why: 'The top of the fraction is an ordinary power. Raise the root to it.', lines: [line([part(raise.sum, 2)], Number(answer.replace(/^1\//, '')) )] })
  steps.push({ title: 'Write the answer', why: negativeFirst ? 'The answer goes on the bottom, because of the minus.' : 'Taking the root first kept the numbers small.', lines: [line([part(start)], answer, { eq: true, answer: true })] })
  return { kind: 'step-worked', start, steps }
}

add(fractional, 'What does a fractional power mean?', 'Higher A3 Rules 8 and 9', text(
  'The bottom of a fractional power is a root. The top is a power.',
  'x^(1/2) = √x and x^(1/3) = ∛x',
  'a^(b/c): take the c-th root of a, then raise it to the power b.',
  '64^(2/3) = (∛64)² = 4² = 16',
  'Take the root first. The numbers stay small.',
))
worked(fractional, 'Simplify 9^(3/2).', 'Higher A3 Example 2', rootWorking('9^(3/2)', '√9', 3, { top: 3, sum: '3 × 3 × 3' }, '27'),
  'The 2 on the bottom means square root. The 3 on top means cube it. Root first, then the power.')
practice(fractional, 'Work out 25^(1/2).', 'Higher A3 extra practice', number(5, '5'), '5', 'A power of a half is a square root.', rootWorking('25^(1/2)', '√25', 5, null, '5'), 'Answer')
practice(fractional, 'Work out 27^(1/3).', 'Higher A3 extra practice', number(3, '3'), '3', 'A power of a third is a cube root.', rootWorking('27^(1/3)', '∛27', 3, null, '3'), 'Answer')
practice(fractional, 'Work out 64^(2/3).', 'Higher A3 Rule 9', number(16, '16'), '16', 'Cube root first, then square it.', rootWorking('64^(2/3)', '∛64', 4, { top: 2, sum: '4 × 4' }, '16'), 'Answer')
practice(fractional, 'Work out 16^(3/4).', 'Higher A3 extra practice', number(8, '8'), '8', 'The 4th root of 16, then cube it.', rootWorking('16^(3/4)', '⁴√16', 2, { top: 3, sum: '2 × 2 × 2' }, '8'), 'Answer')
practice(fractional, 'Work out 8^(-5/3).', 'Higher A3 Your Turn Q4', fraction('1/32'), '1/32', 'Flip it for the minus. Then cube root, then the power 5.', rootWorking('8^(-5/3)', '∛8', 2, { top: 5, sum: '2 × 2 × 2 × 2 × 2' }, '1/32', true), 'Answer')
practice(fractional, 'Work out 25^(-1/2).', 'Higher A3 extra practice', fraction('1/5'), '1/5', 'Flip it, then take the square root.', rootWorking('25^(-1/2)', '√25', 5, null, '1/5', true), 'Answer')

/* ---------- Section 3: the rules together (Example 3 and Your Turn) ---------- */

worked(together, 'Write 2¹⁵ × 8⁻⁴ as a power of 2, and hence work out its value.', 'Higher A3 Example 3', {
  kind: 'step-worked', start: '2¹⁵ × 8⁻⁴', steps: [
    { title: 'Write 8 as 2³', why: 'Both numbers must have the same base before the rules work. Eight is two cubed.', lines: [line([part('8⁻⁴', 0)], '(2³)⁻⁴', { eq: true })] },
    { title: 'Power of a power', why: 'A power of a power multiplies the powers (Rule 3).', lines: [line([part('3', 0), sign('×'), part('−4', 0)], '−12'), line([part('(2³)⁻⁴', 0)], '2⁻¹²', { eq: true })] },
    { title: 'Multiply: add powers', why: 'Multiplying powers of the same number adds the powers (Rule 1).', lines: [line([part('15', 1), sign('+'), part('−12', 0)], '3'), line([part('2¹⁵ × 2⁻¹²')], '2³', { eq: true })] },
    { title: 'Work it out', why: 'Two cubed is two times itself three times.', lines: [line([part('2', 2), sign('×'), part('2', 2), sign('×'), part('2', 2)], '8', { answer: true })] },
  ],
}, 'Make the bases the same first. Then add the powers to multiply, and multiply the powers for a power of a power.')
practice(together, 'Write 9⁵ × 3⁻⁵ as a power of 3.', 'Higher A3 Your Turn Q1', power(3, 5), '3⁵', 'Write 9 as 3² first.', {
  kind: 'step-worked', start: '9⁵ × 3⁻⁵', steps: [
    { title: 'Write 9 as 3²', why: 'Both numbers need the same base. Nine is three squared.', lines: [line([part('9⁵', 0)], '(3²)⁵', { eq: true })] },
    { title: 'Power of a power', why: 'Multiply the powers.', lines: [line([part('2', 0), sign('×'), part('5', 0)], '10'), line([part('(3²)⁵', 0)], '3¹⁰', { eq: true })] },
    { title: 'Multiply: add powers', why: 'Add the powers. Adding a negative takes away.', lines: [line([part('10', 0), sign('+'), part('−5', 1)], '5'), line([part('3¹⁰ × 3⁻⁵')], '3⁵', { eq: true, answer: true })] },
  ],
}, 'Single power')
practice(together, 'Work out √9 × 6⁻². Write your answer in its simplest form.', 'Higher A3 Your Turn Q2', fraction('1/12'), '1/12', 'Work out each part on its own, then multiply.', {
  kind: 'step-worked', start: '√9 × 6⁻²', steps: [
    { title: 'Square root', why: 'Three times itself is nine.', lines: [line([part('√9', 0)], '3', { eq: true })] },
    { title: 'Negative power', why: 'Flip it: 1 over six squared.', lines: [line([part('6⁻²', 1)], '1/36', { eq: true })] },
    { title: 'Multiply', why: 'Three lots of a thirty-sixth is three thirty-sixths.', lines: [line([part('3', 0), sign('×'), part('1/36', 1)], '3/36')] },
    { title: 'Simplify', why: 'Divide the top and the bottom by three.', lines: [line([part('3/36')], '1/12', { eq: true, answer: true })] },
  ],
}, 'Answer')
practice(together, 'Work out 4^(1/2) × 4^(3/2).', 'Higher A3 Your Turn Q3', number(16, '16'), '16', 'Same base, so add the powers.', {
  kind: 'step-worked', start: '4^(1/2) × 4^(3/2)', steps: [
    { title: 'Add the powers', why: 'Same base, so multiplying adds the powers. A half and three halves make four halves.', lines: [line([part('1/2', 0), sign('+'), part('3/2', 1)], '2')] },
    { title: 'Work it out', why: 'Four squared.', lines: [line([part('4²')], '16', { eq: true, answer: true })] },
  ],
}, 'Answer')
practice(together, 'Write 27 × 3⁻⁵ as a power of 3.', 'Higher A3 extra practice', power(3, -2), '3⁻²', 'Write 27 as a power of 3.', {
  kind: 'step-worked', start: '27 × 3⁻⁵', steps: [
    { title: 'Write 27 as 3³', why: 'Three times three times three is twenty-seven.', lines: [line([part('27', 0)], '3³', { eq: true })] },
    { title: 'Multiply: add powers', why: 'Add the powers. The answer can be a negative power.', lines: [line([part('3', 0), sign('+'), part('−5', 1)], '−2'), line([part('3³ × 3⁻⁵')], '3⁻²', { eq: true, answer: true })] },
  ],
}, 'Single power')
practice(together, 'Mo says 16^(1/2) is 8. What has he done wrong?', 'Higher A3 extra practice', choose([
  'He halved 16. A power of a half means the square root, so it is 4',
  'Nothing. 8 is right',
  'He should have squared 16, so it is 256',
]), 'He halved 16. A power of a half means the square root, so it is 4', 'What does the 2 on the bottom of the power mean?', {
  kind: 'step-worked', start: '16^(1/2)', steps: [
    { title: 'Bottom is the root', why: 'A 2 on the bottom of the power means the square root, not divide by two.', lines: [line([part('√16', 0)], '4', { eq: true })] },
    { title: 'Write the answer', why: 'Mo multiplied by a half instead of taking the root.', words: 'He halved 16. A power of a half means the square root, so it is 4' },
  ],
})

add('mixed', 'Negative and fractional powers', 'Higher A3 consolidation', text(
  'A negative power flips: put 1 over it with the power made positive. It never makes the answer negative.',
  'The bottom of a fractional power is a root, the top is a power. Take the root first.',
  'With a minus and a fraction, flip first, then root, then power.',
  'To use the rules together, write every number with the same base first.',
))

export const tutorIndicesHigherLesson: TutorMethodLesson = {
  id: 'L016H', number: 16.5, title: 'Negative and fractional powers', level: 'GCSE Higher',
  goal: 'Work out negative and fractional powers, and use all the rules of indices together.',
  labels: { [negative]: 'Negative powers', [fractional]: 'Fractional powers', [together]: 'Using the rules together', mixed: 'Review' },
  states: finish(),
}
