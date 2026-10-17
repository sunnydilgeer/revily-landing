/*
 * Lesson 28 (Proof), Higher section: harder proofs. From the Higher revision guide, A24 (pages 97 to 99):
 * - Example 2 Algebraic Proof (Level 6-7): the square of an odd number is odd, (2n + 1)² = 2(2n² + 2n) + 1.
 * - Example 3 Algebraic Proof (Level 8-9): (n + 2)² − (n − 2)² is divisible by 8, because it simplifies to 8n.
 * - Type 5 Proofs with Indices (Level 8-9): 24¹² − 15¹⁰ is a multiple of 3, by taking 3 out of each term.
 * - Type 6 Proofs with Primes (Level 8-9): 5⁸⁹ − 401 is not prime: odd take away odd is even, and it ends in 4, not 2.
 * Types 1 to 4 (counterexamples, identities, angle proofs, odd and even) are already in the Foundation lesson.
 */
import { author } from '../../written-methods/tutor/content'
import { line, part, sign, type StepWorking } from '../../written-methods/tutor/stepWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { choose, screens, text, type HigherAddition } from './helpers'

const skill = 'proof-harder'
const a = author(28, 'L28-H')
const { add } = a
const { worked, practice } = screens(a)

/** Keeps an expression on one line in a title, so a phone never breaks it. */
const nb = (expression: string) => expression.replace(/ /g, ' ')
const eq = (title: string, why: string, from: string, to: string, family?: number, answer = false) => ({ title, why, lines: [line([part(from, family)], to, { eq: true, answer })] })
/** An expression typed with the letter keyboard, matched however the terms are ordered. */
const expression = (answer: string): InteractionDefinition => ({ type: 'numericInput', responseShape: 'expression', acceptanceRule: 'collectedExpression', correctAnswer: answer.replace(/−/g, '-'), displayAnswer: answer })
function simplify(title: string, sourceRef: string, answer: string, hint: string, working: StepWorking) {
  const state = practice(skill, title, sourceRef, expression(answer), answer, hint, working)
  state.answerPrefix = '='
  return state
}

add(skill, 'Harder proofs', 'Higher A24 Proof', text(
  'Higher proofs use the same tools: 2n is always even and 2n + 1 is always odd, for any whole number n.',
  'To prove something is a multiple of 8, show it is 8 × (a whole number). The same goes for any number.',
  'With powers, take the common factor out of each term. With primes, remember the only even prime is 2.',
))

/* ---------- Example 2: the square of an odd number is odd (Level 6-7) ---------- */

worked(skill, 'Prove that the square of an odd number is also odd.', 'Higher A24 Example 2 Algebraic Proof', {
  kind: 'step-worked', start: 'odd number squared', steps: [
    eq('Write an odd number', 'Any odd number can be written as 2n plus 1, where n is a whole number.', 'odd number', '2n + 1', 0),
    eq('Square it', 'Write the bracket out twice and multiply every term by every term.', '(2n + 1)²', '4n² + 4n + 1', 1),
    eq('Take out 2', 'Take 2 out of the first two terms, so it reads 2 times something, plus 1.', '4n² + 4n + 1', '2(2n² + 2n) + 1', 2),
    { title: 'Say why', why: 'n is a whole number, so the bracket is a whole number. Two times a whole number is even, and one more than that is odd.', words: '2 × (a whole number) + 1 is odd, so the square of an odd number is odd.' },
  ],
}, 'Write the odd number with algebra, square it, and rearrange it into the form of an odd number: 2 × (something) + 1.')

simplify(`Prove that the square of an even number is a multiple of 4. Simplify ${nb('(2n)²')}.`, 'Higher A24 extra practice', '4n²', 'Square the 2 and the n.', {
  kind: 'step-worked', start: 'even number squared', steps: [
    eq('Write an even number', 'Any even number can be written as 2n, where n is a whole number.', 'even number', '2n', 0),
    eq('Square it', 'Square the 2 and square the n. The answer is 4 times a whole number, so it is a multiple of 4.', '(2n)²', '4n²', 1, true),
  ],
})
simplify(`Prove that one less than the square of an odd number is a multiple of 4. Simplify ${nb('(2n + 1)² − 1')}.`, 'Higher A24 extra practice', '4n² + 4n', 'Expand the square first, then take 1 away.', {
  kind: 'step-worked', start: '(2n + 1)² − 1', steps: [
    eq('Expand the square', 'Write the bracket out twice and multiply every term by every term.', '(2n + 1)²', '4n² + 4n + 1', 0),
    eq('Take 1 away', 'The ones cancel. What is left is 4 times a whole number, so it is a multiple of 4.', '4n² + 4n + 1 − 1', '4n² + 4n', 1, true),
  ],
})
practice(skill, 'Ben writes an odd number as n + 1 in a proof. Why is that wrong?', 'Higher A24 extra practice', choose([
  'n + 1 is only odd when n is even. 2n + 1 is odd for every whole number n',
  'n + 1 is always even',
  'Nothing. n + 1 is always odd',
]), 'n + 1 is only odd when n is even. 2n + 1 is odd for every whole number n', 'Try n = 1 and n = 2 in n + 1.', {
  kind: 'step-worked', start: 'n + 1', steps: [
    { title: 'Try two values', why: 'Put n as 1, then n as 2. One answer is even and one is odd.', lines: [line([part('1'), sign('+'), part('1', 0)], 2), line([part('2'), sign('+'), part('1', 0)], 3)] },
    { title: 'Say why', why: 'A proof must work for every n. Doubling n always gives an even number, so one more is always odd.', words: 'n + 1 is only odd when n is even. 2n + 1 is odd for every whole number n' },
  ],
})

/* ---------- Example 3: divisible by 8 (Level 8-9) ---------- */

worked(skill, `Prove that ${nb('(n + 2)² − (n − 2)²')} is divisible by 8 for any whole number n.`, 'Higher A24 Example 3 Algebraic Proof', {
  kind: 'step-worked', start: '(n + 2)² − (n − 2)²', steps: [
    eq('Expand the first', 'Write the bracket out twice and multiply every term by every term.', '(n + 2)²', 'n² + 4n + 4', 0),
    eq('Expand the second', 'The same for the second bracket. Mind the signs.', '(n − 2)²', 'n² − 4n + 4', 1),
    eq('Subtract them', 'Take the whole second bracket away. The n² and the 4 cancel, and taking away minus 4n adds 4n.', '(n² + 4n + 4) − (n² − 4n + 4)', '8n', 2),
    { title: 'Say why', why: 'n is a whole number, so eight times n is in the 8 times table.', words: '8n is 8 × (a whole number), so it is divisible by 8.' },
  ],
}, 'Expand and simplify. If it comes out as 8 × (a whole number), it is divisible by 8.')

simplify(`Prove that ${nb('(n + 3)² − (n − 3)²')} is a multiple of 12. Expand and simplify it.`, 'Higher A24 extra practice', '12n', 'Expand each square, then take the second away from the first.', {
  kind: 'step-worked', start: '(n + 3)² − (n − 3)²', steps: [
    eq('Expand the first', 'Write the bracket out twice and multiply every term by every term.', '(n + 3)²', 'n² + 6n + 9', 0),
    eq('Expand the second', 'The same again. Mind the signs.', '(n − 3)²', 'n² − 6n + 9', 1),
    eq('Subtract them', 'The n² and the 9 cancel. What is left is 12 times a whole number, so it is a multiple of 12.', '(n² + 6n + 9) − (n² − 6n + 9)', '12n', 2, true),
  ],
})
practice(skill, `${nb('(n + 5)² − (n + 1)²')} simplifies to ${nb('8n + 24')}. Which shows it is divisible by 8?`, 'Higher A24 extra practice', choose([
  '8(n + 3)',
  '8(n + 24)',
  '8n + 3',
]), '8(n + 3)', 'Take 8 out of both terms.', {
  kind: 'step-worked', start: '8n + 24', steps: [
    { title: 'Divide each term', why: 'Divide both terms by 8 to see what goes inside the bracket.', lines: [line([part('24'), sign('÷'), part('8', 0)], 3)] },
    eq('Take out 8', 'Eight times a whole number is divisible by 8.', '8n + 24', '8(n + 3)', 1, true),
  ],
})

/* ---------- Type 5: proofs with indices (Level 8-9) ---------- */

worked(skill, `Prove that the difference between ${nb('24¹²')} and ${nb('15¹⁰')} is a multiple of 3.`, 'Higher A24 Type 5 Proofs with Indices', {
  kind: 'step-worked', start: '24¹² − 15¹⁰', steps: [
    { title: 'Spot the factor', why: 'Both 24 and 15 are in the 3 times table.', lines: [line([part('3', 0), sign('×'), part('8')], 24), line([part('3', 0), sign('×'), part('5')], 15)] },
    { title: 'Split off one', why: 'Take one 24 and one 15 out of the powers, using the rules of indices.', lines: [line([part('24¹²')], '24 × 24¹¹', { eq: true }), line([part('15¹⁰')], '15 × 15⁹', { eq: true })] },
    eq('Take out 3', 'Write each single 24 and 15 as three times something, then take the 3 outside a bracket.', '24¹² − 15¹⁰', '3(8 × 24¹¹ − 5 × 15⁹)', 1),
    { title: 'Say why', why: 'The bracket is a whole number, so the whole thing is three times a whole number.', words: '3 × (a whole number) is a multiple of 3.' },
  ],
}, 'To prove a multiple of 3, take a factor of 3 out of each term. Then it is 3 × (a whole number).')

practice(skill, `Which shows that ${nb('10⁶ + 15⁴')} is a multiple of 5?`, 'Higher A24 extra practice', choose([
  '5(2 × 10⁵ + 3 × 15³)',
  '5(10⁵ + 15³)',
  '5(2 × 10⁶ + 3 × 15⁴)',
]), '5(2 × 10⁵ + 3 × 15³)', 'Split one 10 and one 15 off the powers first.', {
  kind: 'step-worked', start: '10⁶ + 15⁴', steps: [
    { title: 'Split off one', why: 'Take one 10 and one 15 out of the powers.', lines: [line([part('10⁶')], '10 × 10⁵', { eq: true }), line([part('15⁴')], '15 × 15³', { eq: true })] },
    { title: 'Write with 5', why: 'Both are in the 5 times table.', lines: [line([part('5', 0), sign('×'), part('2')], 10), line([part('5', 0), sign('×'), part('3')], 15)] },
    eq('Take out 5', 'Take the 5 outside a bracket. What is left inside is a whole number.', '10⁶ + 15⁴', '5(2 × 10⁵ + 3 × 15³)', 1, true),
  ],
})
practice(skill, `Which shows that ${nb('12⁵ − 4³')} is a multiple of 4?`, 'Higher A24 extra practice', choose([
  '4(3 × 12⁴ − 4²)',
  '4(3 × 12⁵ − 4³)',
  '4(12⁴ − 4²)',
]), '4(3 × 12⁴ − 4²)', 'Split one 12 and one 4 off the powers first.', {
  kind: 'step-worked', start: '12⁵ − 4³', steps: [
    { title: 'Split off one', why: 'Take one 12 and one 4 out of the powers. The powers each go down by one.', lines: [line([part('12⁵')], '12 × 12⁴', { eq: true }), line([part('4³')], '4 × 4²', { eq: true })] },
    { title: 'Write with 4', why: 'Twelve is three lots of 4.', lines: [line([part('4', 0), sign('×'), part('3')], 12)] },
    eq('Take out 4', 'Take the 4 outside a bracket.', '12⁵ − 4³', '4(3 × 12⁴ − 4²)', 1, true),
  ],
})
practice(skill, `Which number is a factor of ${nb('6⁹ + 9⁶')}?`, 'Higher A24 extra practice', choose(['3', '2', '5']), '3', 'Which number divides both 6 and 9?', {
  kind: 'step-worked', start: '6⁹ + 9⁶', steps: [
    { title: 'Common factor', why: 'Both 6 and 9 are in the 3 times table, so 3 can come out of each term.', lines: [line([part('3', 0), sign('×'), part('2')], 6), line([part('3', 0), sign('×'), part('3')], 9)] },
    { title: 'Not 2', why: 'A power of 6 is even and a power of 9 is odd. Even plus odd is odd, so 2 is not a factor.', words: '3' },
  ],
})

/* ---------- Type 6: proofs with primes (Level 8-9) ---------- */

worked(skill, `Show that ${nb('5⁸⁹ − 401')} is not a prime number.`, 'Higher A24 Type 6 Proofs with Primes', {
  kind: 'step-worked', start: '5⁸⁹ − 401', steps: [
    { title: 'Odd or even?', why: 'Odd times odd is odd, so any power of 5 is odd. 401 is odd too.', lines: [line([part('5⁸⁹')], 'odd', { eq: true }), line([part('401')], 'odd', { eq: true })] },
    { title: 'Odd minus odd', why: 'Odd take away odd is always even.', lines: [line([part('odd'), sign('−'), part('odd')], 'even', { eq: true })] },
    { title: 'Is it 2?', why: 'The only even prime is 2. Every power of 5 ends in 5, and 401 ends in 1, so the answer ends in 4. It can’t be 2.', lines: [line([part('ends in 5'), sign('−'), part('ends in 1')], 'ends in 4')] },
    { title: 'Say why', why: 'An even number that isn’t 2 has 2 as a factor, so it can’t be prime.', words: '5⁸⁹ − 401 is even and not 2, so it is not prime.' },
  ],
}, 'To show a number isn’t prime, find a factor. Odd and even is often the quickest way: an even number bigger than 2 is never prime.')

practice(skill, `Why is ${nb('3⁵⁰ − 1')} not a prime number?`, 'Higher A24 extra practice', choose([
  'It is odd take away odd, so it is even, and it is much bigger than 2',
  'It is odd, and odd numbers are never prime',
  'Any number with a power in it is not prime',
]), 'It is odd take away odd, so it is even, and it is much bigger than 2', 'Is a power of 3 odd or even?', {
  kind: 'step-worked', start: '3⁵⁰ − 1', steps: [
    { title: 'Odd or even?', why: 'Odd times odd is odd, so any power of 3 is odd. Odd take away odd is even.', lines: [line([part('odd'), sign('−'), part('odd')], 'even', { eq: true })] },
    { title: 'Say why', why: 'The only even prime is 2, and this number is far bigger than 2.', words: 'It is odd take away odd, so it is even, and it is much bigger than 2' },
  ],
})
practice(skill, `Why is ${nb('7²⁰ + 9')} not a prime number?`, 'Higher A24 extra practice', choose([
  'It ends in 0, so 10 is a factor',
  'It is odd plus odd, which is odd',
  '7 is prime, so it can’t be',
]), 'It ends in 0, so 10 is a factor', 'Look at the last digits of the powers of 7.', {
  kind: 'step-worked', start: '7²⁰ + 9', steps: [
    { title: 'Last digits of powers', why: 'Multiply by 7 each time and watch the last digit. It goes 7, 9, 3, 1, then repeats.', lines: [line([part('7'), sign('×'), part('7')], 49), line([part('49'), sign('×'), part('7')], 343), line([part('343'), sign('×'), part('7')], 2401)] },
    { title: 'Find the pattern', why: 'Every fourth power ends in 1. The power 20 is in the 4 times table, so 7²⁰ ends in 1.', lines: [line([part('ends in 1'), sign('+'), part('9')], 'ends in 0')] },
    { title: 'Say why', why: 'A number ending in 0 is in the 10 times table, so it has a factor other than 1 and itself.', words: 'It ends in 0, so 10 is a factor' },
  ],
})

export const harderProofs: HigherAddition = { lessonId: 'L028', skill, label: 'Harder proofs', states: a.finish() }
