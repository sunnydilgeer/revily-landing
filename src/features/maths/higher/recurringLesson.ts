/*
 * Lesson 11H, Recurring decimals (Higher only). From the Higher revision guide, N12 (Level 6-7) and its Your Turn page:
 * what the dots mean, fraction to recurring decimal (make a denominator of 9s, or divide), and recurring decimal to
 * fraction (call it x, multiply by 10s until the recurring parts line up, subtract, then simplify).
 */
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { line, part, sign, type StepLine, type StepWorking } from '../../written-methods/tutor/stepWorking'
import { choose, fraction, screens, text } from './helpers'

const a = author(11.5, 'L11H')
const { add, finish } = a
const { worked, practice } = screens(a)

const meaning = 'recurring-meaning'
const toDecimal = 'recurring-to-decimal'
const toFraction = 'recurring-to-fraction'

/** A dot over a digit: 0.1̇8̇ is 0.181818… */
const dot = (digit: string) => `${digit}̇`

/* ---------- Section 1: what the dots mean ---------- */

add(meaning, 'What is a recurring decimal?', 'Higher N12 What are recurring decimals', text(
  'A recurring decimal has a digit, or a group of digits, that repeats forever after the decimal point.',
  `1/3 = 0.3333… is written 0.${dot('3')}`,
  `6/11 = 0.545454… is written 0.${dot('5')}${dot('4')}`,
  'Put a dot over the first and the last digit of the part that repeats.',
  'A fraction whose denominator has only 2s and 5s as prime factors stops instead. It is a terminating decimal.',
))
practice(meaning, 'Which is 0.272727… written with dots?', 'Higher N12 extra practice', choose([
  `0.${dot('2')}${dot('7')}`,
  `0.2${dot('7')}`,
  `0.${dot('2')}7`,
]), `0.${dot('2')}${dot('7')}`, 'Which digits repeat? Dot the first and the last of them.', {
  kind: 'step-worked', start: '0.272727…', steps: [
    { title: 'Find the repeating part', why: 'The digits 2 and 7 repeat, in that order, again and again.', lines: [line([part('0.'), part('27', 3, { boxed: true }), part('27', 3), part('27', 3), part('…')])] },
    { title: 'Write the answer', why: 'Put a dot over the first and the last digit of the part that repeats.', lines: [line([part('0.272727…')], `0.${dot('2')}${dot('7')}`, { eq: true, answer: true })] },
  ],
})
practice(meaning, 'Which of these fractions is a terminating decimal?', 'Higher N12 extra practice', choose([
  '3/8',
  '1/3',
  '2/7',
]), '3/8', 'Look at the prime factors of each denominator.', {
  kind: 'step-worked', start: '3/8, 1/3, 2/7', steps: [
    { title: 'Factor the bottoms', why: 'Only fractions whose denominators have just 2s and 5s as prime factors stop.', lines: [line([part('8', 0)], '2 × 2 × 2', { eq: true, mark: 'only 2s' }), line([part('3', 1)], '3', { eq: true }), line([part('7', 2)], '7', { eq: true })] },
    { title: 'Write the answer', why: 'Only 8 has nothing but 2s, so 3/8 stops. The other two go on forever.', words: '3/8' },
  ],
})

/* ---------- Section 2: fraction to recurring decimal ---------- */

/** Make the denominator 9s: 2/11 = 18/99 = 0.1̇8̇. */
function ninesWorking(fractionText: string, by: number, nines: string, recurring: string): StepWorking {
  const [top, bottom] = fractionText.split('/')
  const newTop = String(Number(top) * by).padStart(nines.length, '0')
  return {
    kind: 'step-worked', start: fractionText, steps: [
      { title: 'Make the bottom 9s', why: `Multiply the top and the bottom by ${by}, which makes the bottom ${nines}.`, lines: [
        line([part('top:'), part(top, 0), sign('×'), part(by)], newTop),
        line([part('bottom:'), part(bottom, 1), sign('×'), part(by)], nines),
        line([part(fractionText)], `${newTop}/${nines}`, { eq: true }),
      ] },
      { title: 'Write the answer', why: `Over ${nines}, the top is the part that repeats. Dot its first and last digits.`, lines: [line([part(fractionText)], recurring, { eq: true, answer: true })] },
    ],
  }
}

worked(toDecimal, 'Write 2/11 as a recurring decimal.', 'Higher N12 Method 1', ninesWorking('2/11', 9, '99', `0.${dot('1')}${dot('8')}`),
  'Find an equal fraction with only 9s on the bottom. The top then gives the part that repeats.')
worked(toDecimal, 'Write 5/37 as a decimal.', 'Higher N12 Method 2', {
  kind: 'step-worked', start: '5/37', steps: [
    { title: 'Divide top by bottom', why: 'A fraction is a division. Use the bus stop with plenty of zeros after the point.', lines: [line([part('5.000000', 0), sign('÷'), part('37', 1)], '0.135135…', { eq: true })] },
    { title: 'Spot the repeat', why: 'The remainders come back round to 5, so 135 repeats forever.', lines: [line([part('0.'), part('135', 3, { boxed: true }), part('135', 3), part('…')])] },
    { title: 'Write the answer', why: 'Dot the first and last digits of the part that repeats.', lines: [line([part('5/37')], `0.${dot('1')}3${dot('5')}`, { eq: true, answer: true })] },
  ],
}, 'When there is no easy way to make 9s on the bottom, divide.')
practice(toDecimal, 'Write 1/9 as a recurring decimal.', 'Higher N12 Your Turn Q1', choose([
  `0.${dot('1')}`,
  '0.9',
  `0.${dot('9')}`,
]), `0.${dot('1')}`, 'The bottom is already a 9.', {
  kind: 'step-worked', start: '1/9', steps: [
    { title: 'Read the top', why: 'The bottom is already one 9, so the top digit is the one that repeats.', lines: [line([part('1/9')], '0.1111…', { eq: true })] },
    { title: 'Write the answer', why: 'Only one digit repeats, so it gets one dot.', lines: [line([part('1/9')], `0.${dot('1')}`, { eq: true, answer: true })] },
  ],
})
practice(toDecimal, 'Write 7/33 as a recurring decimal.', 'Higher N12 Example 1', choose([
  `0.${dot('2')}${dot('1')}`,
  `0.${dot('7')}${dot('3')}`,
  `0.2${dot('1')}`,
]), `0.${dot('2')}${dot('1')}`, '33 × 3 = 99.', ninesWorking('7/33', 3, '99', `0.${dot('2')}${dot('1')}`))
practice(toDecimal, 'Write 10/11 as a recurring decimal.', 'Higher N12 Your Turn Q4', choose([
  `0.${dot('9')}${dot('0')}`,
  `0.${dot('1')}${dot('0')}`,
  `0.9${dot('0')}`,
]), `0.${dot('9')}${dot('0')}`, '11 × 9 = 99.', ninesWorking('10/11', 9, '99', `0.${dot('9')}${dot('0')}`))
practice(toDecimal, 'Write 4/9 as a recurring decimal.', 'Higher N12 extra practice', choose([
  `0.${dot('4')}`,
  `0.${dot('4')}${dot('9')}`,
  '0.49',
]), `0.${dot('4')}`, 'The bottom is already a 9.', {
  kind: 'step-worked', start: '4/9', steps: [
    { title: 'Read the top', why: 'The bottom is already one 9, so the top digit is the one that repeats.', lines: [line([part('4/9')], '0.4444…', { eq: true })] },
    { title: 'Write the answer', why: 'Only one digit repeats, so it gets one dot.', lines: [line([part('4/9')], `0.${dot('4')}`, { eq: true, answer: true })] },
  ],
})

/* ---------- Section 3: recurring decimal to fraction ---------- */

type Shift = { times: string; value: string }
/**
 * Call the decimal x, write two multiples of x with the same digits after the point, subtract to clear the repeat,
 * divide, then simplify. `simplified` is left off when the fraction is already in its simplest form.
 */
function toFractionWorking(decimal: string, upper: Shift, lower: Shift, whole: string, divided: string, simplified?: { by: number; answer: string }): StepWorking {
  const [bigX, smallX] = [upper.times, lower.times]
  const multiplier = (times: string) => Number(times.replace('x', '') || 1)
  const factor = multiplier(bigX) - multiplier(smallX)
  const lines: StepLine[] = [
    line([part(bigX, 0)], upper.value, { eq: true }),
    line([part(smallX, 1)], lower.value, { eq: true }),
  ]
  const steps: StepWorking['steps'] = [
    { title: 'Call it x', why: 'Write the decimal as x, the number you want to turn into a fraction.', lines: [line([part('x', 1)], decimal, { eq: true })] },
    { title: 'Line up the repeats', why: smallX === 'x'
      ? `${bigX.replace('x', '')} has as many zeros as there are digits in the repeating part, so ${bigX} has the same digits after the point as x.`
      : `Multiply by 10s until two multiples of x have the same digits after the point: ${smallX} and ${bigX}.`, lines },
    { title: 'Subtract', why: 'Take one from the other. The repeating digits after the point cancel out.', lines: [line([part(bigX, 0), sign('−'), part(smallX, 1)], `${factor}x`, { eq: true }), line([part(upper.value, 0), sign('−'), part(lower.value, 1)], whole, { eq: true })] },
  ]
  steps.push(simplified
    ? { title: `Divide by ${factor}`, why: `Divide both sides by ${factor} to find x.`, lines: [line([part('x', 1)], divided, { eq: true })] }
    : { title: `Divide by ${factor}`, why: `Divide both sides by ${factor} to find x. The fraction won’t simplify.`, lines: [line([part('x', 1)], divided, { eq: true, answer: true })] })
  if (simplified) steps.push({ title: 'Simplify', why: `Divide the top and the bottom by ${simplified.by}.`, lines: [line([part(divided)], simplified.answer, { eq: true, answer: true })] })
  return { kind: 'step-worked', start: decimal, trail: true, steps }
}

worked(toFraction, `Write 0.${dot('1')}${dot('4')} as a fraction.`, 'Higher N12 Example 2', toFractionWorking(
  `0.${dot('1')}${dot('4')}`, { times: '100x', value: '14.1414…' }, { times: 'x', value: '0.1414…' }, '14', '14/99',
), 'Two digits repeat, so multiply by 100. Then 100x and x have the same digits after the point, and subtracting gets rid of them.')
worked(toFraction, `Write 0.${dot('1')}4${dot('7')} as a fraction in its simplest form.`, 'Higher N12 Convert recurring decimals to fractions', toFractionWorking(
  `0.${dot('1')}4${dot('7')}`, { times: '1000x', value: '147.147…' }, { times: 'x', value: '0.147…' }, '147', '147/999', { by: 3, answer: '49/333' },
), 'Three digits repeat, so multiply by 1000.')
worked(toFraction, `Write 0.8${dot('3')} as a fraction.`, 'Higher N12 Example 3', toFractionWorking(
  `0.8${dot('3')}`, { times: '100x', value: '83.333…' }, { times: '10x', value: '8.333…' }, '75', '75/90', { by: 15, answer: '5/6' },
), 'When the repeat starts later, first move the part that doesn’t repeat in front of the point: 10x = 8.333… Then 100x has the same digits after the point too.')
practice(toFraction, `Write 0.${dot('3')} as a fraction.`, 'Higher N12 Your Turn Q2', fraction('1/3'), '1/3', 'One digit repeats, so use 10x and x.', toFractionWorking(
  `0.${dot('3')}`, { times: '10x', value: '3.333…' }, { times: 'x', value: '0.333…' }, '3', '3/9', { by: 3, answer: '1/3' },
), 'Fraction')
practice(toFraction, `Write 0.${dot('4')}${dot('5')} as a fraction in its simplest form.`, 'Higher N12 extra practice', fraction('5/11'), '5/11', 'Two digits repeat, so use 100x and x.', toFractionWorking(
  `0.${dot('4')}${dot('5')}`, { times: '100x', value: '45.4545…' }, { times: 'x', value: '0.4545…' }, '45', '45/99', { by: 9, answer: '5/11' },
), 'Fraction')
practice(toFraction, `Write 0.${dot('3')}9${dot('0')} as a fraction in its simplest form.`, 'Higher N12 Your Turn Q3', fraction('130/333'), '130/333', 'Three digits repeat, so use 1000x and x.', toFractionWorking(
  `0.${dot('3')}9${dot('0')}`, { times: '1000x', value: '390.390…' }, { times: 'x', value: '0.390…' }, '390', '390/999', { by: 3, answer: '130/333' },
), 'Fraction')
practice(toFraction, `Write 0.1${dot('6')} as a fraction in its simplest form.`, 'Higher N12 extra practice', fraction('1/6'), '1/6', 'The 1 doesn’t repeat. Start with 10x.', toFractionWorking(
  `0.1${dot('6')}`, { times: '100x', value: '16.666…' }, { times: '10x', value: '1.666…' }, '15', '15/90', { by: 15, answer: '1/6' },
), 'Fraction')
practice(toFraction, `Write 1.5${dot('4')} as a fraction.`, 'Higher N12 Your Turn Q5', fraction('139/90'), '139/90', 'Only the 4 repeats. Use 100x and 10x.', toFractionWorking(
  `1.5${dot('4')}`, { times: '100x', value: '154.444…' }, { times: '10x', value: '15.444…' }, '139', '139/90',
), 'Fraction')

add('mixed', 'Recurring decimals', 'Higher N12 consolidation', text(
  'Dot the first and last digits of the part that repeats.',
  'Fraction to decimal: make the bottom 9s, or divide the top by the bottom.',
  'Decimal to fraction: call it x, multiply by 10s until two multiples have the same digits after the point, subtract, divide, then simplify.',
))

export const tutorRecurringLesson: TutorMethodLesson = {
  id: 'L011H', number: 11.5, title: 'Recurring decimals', level: 'GCSE Higher',
  goal: 'Write recurring decimals with dots, change a fraction to a recurring decimal, and change a recurring decimal to a fraction.',
  labels: { [meaning]: 'What the dots mean', [toDecimal]: 'Fraction to recurring decimal', [toFraction]: 'Recurring decimal to fraction', mixed: 'Review' },
  states: finish(),
}
