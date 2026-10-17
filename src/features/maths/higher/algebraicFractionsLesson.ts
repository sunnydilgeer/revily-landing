/*
 * Lesson 8H, Algebraic fractions (Higher only). From the Higher revision guide, A15 (Key Skills 1 and 3 Level 6-7,
 * Key Skills 2 and 4 Level 8-9) and its Your Turn page (Q1 to Q5, Level 8-9), in three sections: simplifying, with
 * factorising first to cancel brackets (Key Skills 1, 2), multiplying and dividing (Key Skill 3), and adding and
 * subtracting over a common denominator (Key Skill 4). It follows Factorising quadratics because Key Skill 2 needs it.
 * An answer with letters on the top and the bottom can't be typed reliably, so most questions pick from common slips.
 */
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { line, part, sign } from '../../written-methods/tutor/stepWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { choose, number, screens, text } from './helpers'

const a = author(21.5, 'L21H')
const { add, finish } = a
const { worked, practice } = screens(a)

const simplify = 'algebraic-fractions-simplify'
const multiply = 'algebraic-fractions-multiply-divide'
const adding = 'algebraic-fractions-add-subtract'

/** A simplified expression typed with the power keys: 3a²b, x + 3. */
const expression = (answer: string): InteractionDefinition => ({
  type: 'numericInput', responseShape: 'expression', acceptanceRule: 'collectedExpression', anyPower: true, correctAnswer: answer, displayAnswer: answer,
})

/* ---------- Section 1: simplifying (Key Skills 1 and 2) ---------- */

add(simplify, 'Algebraic fractions', 'Higher A15', text(
  'An algebraic fraction has letters on the top, the bottom, or both. The rules for number fractions still work.',
  'To simplify, cancel anything that is on both the top and the bottom: a number, a letter or a whole bracket.',
  'You can only cancel a factor, something the whole top and the whole bottom are multiplied by. Never cancel part of a sum.',
))

worked(simplify, 'Simplify 55x⁴y³/15x²y².', 'Higher A15 Key Skill 1 Example', {
  kind: 'step-worked', start: '55x⁴y³/15x²y²', steps: [
    { title: 'Cancel the numbers', why: 'Divide the top and the bottom by their highest common factor. Three is left on the bottom.', lines: [line([part('55', 0), sign('÷'), part('5')], '11'), line([part('15', 0), sign('÷'), part('5')], '3')] },
    { title: 'Cancel the x’s', why: 'Dividing takes away the powers. Two x’s cancel, so two are left on the top.', lines: [line([part('x⁴', 1), sign('÷'), part('x²', 1)], 'x²')] },
    { title: 'Cancel the y’s', why: 'Two y’s cancel, so one is left on the top.', lines: [line([part('y³', 2), sign('÷'), part('y²', 2)], 'y')] },
    { title: 'Write the answer', why: 'Put what is left on the top over what is left on the bottom.', lines: [line([part('11', 0), sign('×'), part('x²', 1), sign('×'), part('y', 2), sign('÷'), part('3', 0)], '11x²y/3', { answer: true })] },
  ],
}, 'This is the easiest kind. Cancel the numbers, then each letter, using the rules of indices.')

practice(simplify, 'Simplify 12a³b²/4ab.', 'Higher A15 extra practice', expression('3a²b'), '3a²b', 'Cancel the numbers, then each letter.', {
  kind: 'step-worked', start: '12a³b²/4ab', steps: [
    { title: 'Cancel the numbers', why: 'Four goes into twelve exactly, so nothing is left on the bottom.', lines: [line([part('12', 0), sign('÷'), part('4')], '3')] },
    { title: 'Cancel the letters', why: 'Take away the powers of each letter.', lines: [line([part('a³', 1), sign('÷'), part('a', 1)], 'a²'), line([part('b²', 2), sign('÷'), part('b', 2)], 'b')] },
    { title: 'Write the answer', why: 'Everything left is on the top.', lines: [line([part('3', 0), sign('×'), part('a²', 1), sign('×'), part('b', 2)], '3a²b', { answer: true })] },
  ],
}, 'Simplified fraction')

practice(simplify, 'Simplify 18x²y/24xy³.', 'Higher A15 extra practice', choose([
  '3x/4y²',
  '3xy²/4',
  '3x²/4y³',
]), '3x/4y²', 'There are more y’s on the bottom, so y stays on the bottom.', {
  kind: 'step-worked', start: '18x²y/24xy³', steps: [
    { title: 'Cancel the numbers', why: 'Divide both by their highest common factor.', lines: [line([part('18', 0), sign('÷'), part('6')], '3'), line([part('24', 0), sign('÷'), part('6')], '4')] },
    { title: 'Cancel the x’s', why: 'One x cancels, so one is left on the top.', lines: [line([part('x²', 1), sign('÷'), part('x', 1)], 'x')] },
    { title: 'Cancel the y’s', why: 'One y cancels, so two are left on the bottom.', lines: [line([part('y³', 2), sign('÷'), part('y', 2)], 'y² on the bottom')] },
    { title: 'Write the answer', why: 'What is left on the top goes over what is left on the bottom.', lines: [line([part('3x', 1), sign('÷'), part('4y²', 2)], '3x/4y²', { answer: true })] },
  ],
})

worked(simplify, 'Simplify (a² + a − 6)/(ab + 3b) fully.', 'Higher A15 Key Skill 2 Example', {
  kind: 'step-worked', start: '(a² + a − 6)/(ab + 3b)', steps: [
    { title: 'Factorise the top', why: 'Find two numbers that multiply to the last number and add to the middle one.', lines: [line([part('a² + a − 6', 0)], '(a + 3)(a − 2)', { eq: true })] },
    { title: 'Factorise the bottom', why: 'Both terms have a b in them, so take it outside a bracket.', lines: [line([part('ab + 3b', 1)], 'b(a + 3)', { eq: true })] },
    { title: 'Cancel the bracket', why: 'The same bracket multiplies the whole top and the whole bottom, so it cancels.', lines: [line([part('(a + 3)', 2, { struck: true }), part('(a − 2)'), sign('÷'), part('b'), part('(a + 3)', 2, { struck: true })], '(a − 2)/b', { answer: true })] },
  ],
}, 'When there is a quadratic or a sum, you can’t cancel yet. Factorise the top and the bottom first, then cancel a whole bracket.')

practice(simplify, 'Simplify (x² + 5x + 6)/(x + 2).', 'Higher A15 extra practice', expression('x + 3'), 'x + 3', 'Factorise the top. One bracket matches the bottom.', {
  kind: 'step-worked', start: '(x² + 5x + 6)/(x + 2)', steps: [
    { title: 'Factorise the top', why: 'Find two numbers that multiply to the last number and add to the middle one.', lines: [line([part('x² + 5x + 6', 0)], '(x + 2)(x + 3)', { eq: true })] },
    { title: 'Cancel the bracket', why: 'The same bracket is on the top and is the whole bottom. Nothing is left on the bottom.', lines: [line([part('(x + 2)', 1, { struck: true }), part('(x + 3)'), sign('÷'), part('(x + 2)', 1, { struck: true })], 'x + 3', { answer: true })] },
  ],
}, 'Simplified fraction')

practice(simplify, 'Simplify (x² − 9)/(x² + x − 6) fully.', 'Higher A15 extra practice', choose([
  '(x − 3)/(x − 2)',
  '(x + 3)/(x − 2)',
  '(x − 9)/(x − 6)',
]), '(x − 3)/(x − 2)', 'The top is a difference of two squares.', {
  kind: 'step-worked', start: '(x² − 9)/(x² + x − 6)', steps: [
    { title: 'Factorise the top', why: 'A square take away a square splits into a plus bracket and a minus bracket.', lines: [line([part('x² − 9', 0)], '(x + 3)(x − 3)', { eq: true })] },
    { title: 'Factorise the bottom', why: 'Find two numbers that multiply to the last number and add to the middle one.', lines: [line([part('x² + x − 6', 1)], '(x + 3)(x − 2)', { eq: true })] },
    { title: 'Cancel the bracket', why: 'The bracket on both the top and the bottom cancels.', lines: [line([part('(x + 3)', 2, { struck: true }), part('(x − 3)'), sign('÷'), part('(x + 3)', 2, { struck: true }), part('(x − 2)')], '(x − 3)/(x − 2)', { answer: true })] },
  ],
})

practice(simplify, 'Simplify (2(8 − k) + 4(k − 1))/(k² − 36).', 'Higher A15 Your Turn Q3', choose([
  '2/(k − 6)',
  '2/(k + 6)',
  '(2k + 12)/(k² − 36)',
]), '2/(k − 6)', 'Expand and simplify the top first, then factorise the top and the bottom.', {
  kind: 'step-worked', start: '(2(8 − k) + 4(k − 1))/(k² − 36)', steps: [
    { title: 'Expand the top', why: 'Multiply out both brackets, then collect like terms.', lines: [line([part('16 − 2k + 4k − 4', 0)], '2k + 12', { eq: true })] },
    { title: 'Factorise the top', why: 'Both terms divide by 2, so take it outside a bracket.', lines: [line([part('2k + 12', 0)], '2(k + 6)', { eq: true })] },
    { title: 'Factorise the bottom', why: 'A square take away a square splits into a plus bracket and a minus bracket.', lines: [line([part('k² − 36', 1)], '(k + 6)(k − 6)', { eq: true })] },
    { title: 'Cancel the bracket', why: 'The bracket on both the top and the bottom cancels.', lines: [line([part('2'), part('(k + 6)', 2, { struck: true }), sign('÷'), part('(k + 6)', 2, { struck: true }), part('(k − 6)')], '2/(k − 6)', { answer: true })] },
  ],
})

practice(simplify, 'Ben says (x + 3)/x simplifies to 3, because the x’s cancel. Is he right?', 'Higher A15 extra practice', choose([
  'No. x is only part of the top, not a factor of it, so it can’t cancel',
  'Yes. The x on the top cancels with the x on the bottom',
  'No. It simplifies to 3x',
]), 'No. x is only part of the top, not a factor of it, so it can’t cancel', 'Is the whole top multiplied by x?', {
  kind: 'step-worked', start: '(x + 3)/x', steps: [
    { title: 'Look for a factor', why: 'You can only cancel something the whole top is multiplied by. The top is x add 3, not x times something.', words: 'No. x is only part of the top, not a factor of it, so it can’t cancel' },
  ],
})

/* ---------- Section 2: multiplying and dividing (Key Skill 3) ---------- */

add(multiply, 'Multiplying and dividing', 'Higher A15 Key Skill 3', text(
  'Multiplying and dividing algebraic fractions works exactly like number fractions.',
  'To multiply, multiply the tops together and the bottoms together, then cancel.',
  'To divide, flip the second fraction upside down and change the ÷ to a ×. Then multiply.',
  'Factorise any brackets first, so whole brackets can cancel.',
))

worked(multiply, 'Simplify (2x + 4)/3xy × x/(x + 2) fully.', 'Higher A15 Example 1', {
  kind: 'step-worked', start: '(2x + 4)/3xy × x/(x + 2)', steps: [
    { title: 'Multiply the tops', why: 'Multiply the two tops together. Keep the bracket whole.', lines: [line([part('(2x + 4)', 0), sign('×'), part('x', 0)], 'x(2x + 4)')] },
    { title: 'Multiply the bottoms', why: 'Multiply the two bottoms together.', lines: [line([part('3xy', 1), sign('×'), part('(x + 2)', 1)], '3xy(x + 2)')] },
    { title: 'Factorise the top', why: 'Both terms in the bracket divide by 2. Now the same bracket is on the top and the bottom.', lines: [line([part('2x + 4', 0)], '2(x + 2)', { eq: true })] },
    { title: 'Cancel and finish', why: 'The x and the bracket are on both the top and the bottom, so they cancel.', lines: [line([part('2'), part('x', 2, { struck: true }), part('(x + 2)', 2, { struck: true }), sign('÷'), part('3'), part('x', 2, { struck: true }), part('y'), part('(x + 2)', 2, { struck: true })], '2/3y', { answer: true })] },
  ],
}, 'Multiply the tops and the bottoms. It looks simplified, but 2x + 4 factorises, and then a bracket cancels.')

worked(multiply, 'Simplify (3x + 1)/(x − 1) ÷ 2x/(x − 1).', 'Higher A15 Key Skill 3 Example', {
  kind: 'step-worked', start: '(3x + 1)/(x − 1) ÷ 2x/(x − 1)', steps: [
    { title: 'Flip and multiply', why: 'Turn the second fraction upside down and change the divide to a multiply.', lines: [line([part('(3x + 1)/(x − 1)'), sign('×'), part('(x − 1)/2x', 0)], '(3x + 1)(x − 1)/2x(x − 1)')] },
    { title: 'Cancel the bracket', why: 'The same bracket is on the top and the bottom, so it cancels.', lines: [line([part('(3x + 1)'), part('(x − 1)', 1, { struck: true }), sign('÷'), part('2x'), part('(x − 1)', 1, { struck: true })], '(3x + 1)/2x', { answer: true })] },
  ],
}, 'Flip the second fraction and multiply. Then cancel what is on both the top and the bottom.')

practice(multiply, 'Simplify 2x/5 × 10/x².', 'Higher A15 extra practice', choose([
  '4/x',
  '4x',
  '20/5x',
]), '4/x', 'Multiply the tops and the bottoms, then cancel.', {
  kind: 'step-worked', start: '2x/5 × 10/x²', steps: [
    { title: 'Multiply the tops', why: 'Multiply the numbers, and keep the letter.', lines: [line([part('2x', 0), sign('×'), part('10', 0)], '20x')] },
    { title: 'Multiply the bottoms', why: 'Multiply the two bottoms together.', lines: [line([part('5', 1), sign('×'), part('x²', 1)], '5x²')] },
    { title: 'Cancel and finish', why: 'Cancel the numbers, then one x. There is one more x on the bottom, so it stays there.', lines: [line([part('20x', 0), sign('÷'), part('5x²', 1)], '4/x', { answer: true })] },
  ],
})

practice(multiply, 'Simplify 7ab/12 ÷ 4a/9b².', 'Higher A15 Your Turn Q4', choose([
  '21b³/16',
  '7a²/27b',
  '63ab³/48',
]), '21b³/16', 'Flip the second fraction, then multiply and cancel.', {
  kind: 'step-worked', start: '7ab/12 ÷ 4a/9b²', steps: [
    { title: 'Flip and multiply', why: 'Turn the second fraction upside down and change the divide to a multiply.', lines: [line([part('7ab/12'), sign('×'), part('9b²/4a', 0)], '63ab³/48a')] },
    { title: 'Cancel the a’s', why: 'There is an a on the top and the bottom, so it cancels.', lines: [line([part('63ab³', 1), sign('÷'), part('48a', 1)], '63b³/48')] },
    { title: 'Cancel the numbers', why: 'Divide the top and the bottom by their highest common factor.', lines: [line([part('63', 2), sign('÷'), part('3')], '21'), line([part('48', 2), sign('÷'), part('3')], '16'), line([part('63b³/48')], '21b³/16', { eq: true, answer: true })] },
  ],
})

practice(multiply, 'Simplify (x + 1)/4 ÷ (x + 1)/12.', 'Higher A15 extra practice', number(3, '3'), '3', 'Flip the second fraction. The brackets cancel.', {
  kind: 'step-worked', start: '(x + 1)/4 ÷ (x + 1)/12', steps: [
    { title: 'Flip and multiply', why: 'Turn the second fraction upside down and change the divide to a multiply.', lines: [line([part('(x + 1)/4'), sign('×'), part('12/(x + 1)', 0)], '12(x + 1)/4(x + 1)')] },
    { title: 'Cancel the bracket', why: 'The same bracket is on the top and the bottom.', lines: [line([part('12'), part('(x + 1)', 1, { struck: true }), sign('÷'), part('4'), part('(x + 1)', 1, { struck: true })], '12/4')] },
    { title: 'Divide the numbers', why: 'Only numbers are left, so work out the division.', lines: [line([part('12', 2), sign('÷'), part('4', 2)], '3', { answer: true })] },
  ],
}, 'Answer')

practice(multiply, 'Simplify (x² − 4)/3x × 6/(x + 2) fully.', 'Higher A15 extra practice', choose([
  '2(x − 2)/x',
  '2(x + 2)/x',
  '6(x² − 4)/3x(x + 2)',
]), '2(x − 2)/x', 'Factorise x² − 4 first.', {
  kind: 'step-worked', start: '(x² − 4)/3x × 6/(x + 2)', steps: [
    { title: 'Factorise the top', why: 'A square take away a square splits into a plus bracket and a minus bracket.', lines: [line([part('x² − 4', 0)], '(x + 2)(x − 2)', { eq: true })] },
    { title: 'Multiply across', why: 'Multiply the tops together and the bottoms together.', lines: [line([part('6(x + 2)(x − 2)', 0), sign('÷'), part('3x(x + 2)', 1)], '6(x + 2)(x − 2)/3x(x + 2)')] },
    { title: 'Cancel and finish', why: 'The bracket cancels, and three goes into six twice.', lines: [line([part('6', 2), sign('÷'), part('3', 2)], '2'), line([part('6(x + 2)(x − 2)/3x(x + 2)')], '2(x − 2)/x', { eq: true, answer: true })] },
  ],
})

/* ---------- Section 3: adding and subtracting (Key Skill 4) ---------- */

add(adding, 'Adding and subtracting', 'Higher A15 Key Skill 4', text(
  'To add or take away fractions, they need the same bottom: a common denominator.',
  'Multiply the top and the bottom of each fraction by the other fraction’s bottom.',
  'Then add or take away the tops, and keep the bottom. Take care with a minus in front of a bracket.',
  'Finally, factorise the top if you can, in case something cancels.',
))

worked(adding, 'Write 2/(x + 2) + 3/(2x + 1) as a single fraction.', 'Higher A15 Key Skill 4 Example', {
  kind: 'step-worked', start: '2/(x + 2) + 3/(2x + 1)', steps: [
    { title: 'Common denominator', why: 'Multiply the top and the bottom of each fraction by the other one’s bottom. Now both have the same bottom.', lines: [
      line([part('2/(x + 2)', 0)], '2(2x + 1)/(x + 2)(2x + 1)', { eq: true }),
      line([part('3/(2x + 1)', 1)], '3(x + 2)/(x + 2)(2x + 1)', { eq: true }),
    ] },
    { title: 'Expand the tops', why: 'Multiply out each top.', lines: [line([part('2(2x + 1)', 0)], '4x + 2', { eq: true }), line([part('3(x + 2)', 1)], '3x + 6', { eq: true })] },
    { title: 'Add the tops', why: 'Add the tops and collect like terms. The bottom stays the same.', lines: [line([part('4x + 2', 0), sign('+'), part('3x + 6', 1)], '7x + 8'), line([part('(7x + 8)/(x + 2)(2x + 1)')], '(7x + 8)/((x + 2)(2x + 1))', { eq: true, answer: true })] },
  ],
}, 'The bottoms are different, so make them the same first, just like number fractions.')

worked(adding, 'Write m/(m − 6) + m/7 as one fraction in its simplest form.', 'Higher A15 Example 2', {
  kind: 'step-worked', start: 'm/(m − 6) + m/7', steps: [
    { title: 'Common denominator', why: 'Multiply the top and the bottom of each fraction by the other one’s bottom.', lines: [
      line([part('m/(m − 6)', 0)], '7m/7(m − 6)', { eq: true }),
      line([part('m/7', 1)], 'm(m − 6)/7(m − 6)', { eq: true }),
    ] },
    { title: 'Add the tops', why: 'Expand the bracket, then collect like terms.', lines: [line([part('7m', 0), sign('+'), part('m² − 6m', 1)], 'm² + m')] },
    { title: 'Factorise the top', why: 'Both terms have an m, so take it outside a bracket. Nothing cancels with the bottom, so this is the simplest form.', lines: [line([part('m² + m', 2)], 'm(m + 1)', { eq: true }), line([part('(m² + m)/7(m − 6)')], 'm(m + 1)/(7(m − 6))', { eq: true, answer: true })] },
  ],
}, 'Make the bottoms the same, add the tops, then factorise the top in case anything cancels.')

practice(adding, 'Simplify 1/2x + 1/3x − 1/5x.', 'Higher A15 Your Turn Q1', choose([
  '19/30x',
  '1/30x',
  '1/10x',
]), '19/30x', 'Every bottom has an x. What is the smallest number 2, 3 and 5 all go into?', {
  kind: 'step-worked', start: '1/2x + 1/3x − 1/5x', steps: [
    { title: 'Common denominator', why: 'Find the lowest common multiple of the numbers. Every bottom already has an x.', lines: [line([part('2', 0), sign('×'), part('3', 0), sign('×'), part('5', 0)], '30')] },
    { title: 'Change each fraction', why: 'Multiply the top and the bottom of each fraction to make the bottom thirty x.', lines: [
      line([part('1/2x', 0)], '15/30x', { eq: true }), line([part('1/3x', 1)], '10/30x', { eq: true }), line([part('1/5x', 2)], '6/30x', { eq: true }),
    ] },
    { title: 'Combine the tops', why: 'Add and take away the tops. The bottom stays the same.', lines: [line([part('15', 0), sign('+'), part('10', 1), sign('−'), part('6', 2)], '19'), line([part('19', 2), sign('÷'), part('30x')], '19/30x', { answer: true })] },
  ],
})

practice(adding, 'Simplify 8/x − 1/(x − 3).', 'Higher A15 Your Turn Q2', choose([
  '(7x − 24)/(x(x − 3))',
  '(7x − 3)/(x(x − 3))',
  '7/(x − 3)',
]), '(7x − 24)/(x(x − 3))', 'Use x(x − 3) as the bottom. The 8 multiplies the whole bracket.', {
  kind: 'step-worked', start: '8/x − 1/(x − 3)', steps: [
    { title: 'Common denominator', why: 'Multiply the top and the bottom of each fraction by the other one’s bottom.', lines: [
      line([part('8/x', 0)], '8(x − 3)/x(x − 3)', { eq: true }),
      line([part('1/(x − 3)', 1)], 'x/x(x − 3)', { eq: true }),
    ] },
    { title: 'Expand the top', why: 'The 8 multiplies both terms in the bracket.', lines: [line([part('8(x − 3)', 0)], '8x − 24', { eq: true })] },
    { title: 'Take away the tops', why: 'Take away the second top and collect like terms. The bottom stays the same.', lines: [line([part('8x − 24', 0), sign('−'), part('x', 1)], '7x − 24'), line([part('(7x − 24)/x(x − 3)')], '(7x − 24)/(x(x − 3))', { eq: true, answer: true })] },
  ],
})

practice(adding, 'Simplify (z + 2)/(z − 1) − z/(z + 5).', 'Higher A15 Your Turn Q5', choose([
  '(8z + 10)/((z − 1)(z + 5))',
  '(6z + 10)/((z − 1)(z + 5))',
  '2/((z − 1)(z + 5))',
]), '(8z + 10)/((z − 1)(z + 5))', 'Use (z − 1)(z + 5) as the bottom. Take care: the minus applies to the whole second top.', {
  kind: 'step-worked', start: '(z + 2)/(z − 1) − z/(z + 5)', steps: [
    { title: 'Common denominator', why: 'Multiply the top and the bottom of each fraction by the other one’s bottom.', lines: [
      line([part('(z + 2)/(z − 1)', 0)], '(z + 2)(z + 5)/(z − 1)(z + 5)', { eq: true }),
      line([part('z/(z + 5)', 1)], 'z(z − 1)/(z − 1)(z + 5)', { eq: true }),
    ] },
    { title: 'Expand the tops', why: 'Multiply out each top.', lines: [line([part('(z + 2)(z + 5)', 0)], 'z² + 7z + 10', { eq: true }), line([part('z(z − 1)', 1)], 'z² − z', { eq: true })] },
    { title: 'Take away the tops', why: 'The minus changes every sign in the second top, so minus a minus z is plus z. The squares cancel.', lines: [line([part('z² + 7z + 10', 0), sign('−'), part('(z² − z)', 1)], '8z + 10'), line([part('(8z + 10)/(z − 1)(z + 5)')], '(8z + 10)/((z − 1)(z + 5))', { eq: true, answer: true })] },
  ],
})

practice(adding, 'Write 1/x + 1/(x + 1) as a single fraction.', 'Higher A15 extra practice', choose([
  '(2x + 1)/(x(x + 1))',
  '2/(2x + 1)',
  '(x + 1)/(x(x + 1))',
]), '(2x + 1)/(x(x + 1))', 'You can’t just add the tops and the bottoms. Make the bottoms the same.', {
  kind: 'step-worked', start: '1/x + 1/(x + 1)', steps: [
    { title: 'Common denominator', why: 'Multiply the top and the bottom of each fraction by the other one’s bottom.', lines: [
      line([part('1/x', 0)], '(x + 1)/x(x + 1)', { eq: true }),
      line([part('1/(x + 1)', 1)], 'x/x(x + 1)', { eq: true }),
    ] },
    { title: 'Add the tops', why: 'Add the tops and collect like terms. The bottom stays the same.', lines: [line([part('x + 1', 0), sign('+'), part('x', 1)], '2x + 1'), line([part('(2x + 1)/x(x + 1)')], '(2x + 1)/(x(x + 1))', { eq: true, answer: true })] },
  ],
})

add('mixed', 'Algebraic fractions', 'Higher A15 consolidation', text(
  'Simplify by cancelling what the whole top and the whole bottom are multiplied by. Factorise first.',
  'Multiply the tops and the bottoms. To divide, flip the second fraction and multiply.',
  'To add or take away, make the bottoms the same, then add or take away the tops.',
  'Finish by factorising the top, in case a bracket cancels.',
))

export const tutorAlgebraicFractionsLesson: TutorMethodLesson = {
  id: 'L021H', number: 21.5, title: 'Algebraic fractions', level: 'GCSE Higher',
  goal: 'Simplify algebraic fractions by cancelling, factorise first to cancel brackets, and multiply, divide, add and subtract them.',
  labels: { [simplify]: 'Simplifying', [multiply]: 'Multiplying and dividing', [adding]: 'Adding and subtracting', mixed: 'Review' },
  states: finish(),
}
