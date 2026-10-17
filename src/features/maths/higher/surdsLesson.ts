/*
 * Lesson 18H, Surds (Higher only). From the Higher revision guide, A7 (every box Level 6-7, Your Turn Q5 Level 8-9) and
 * its Your Turn page: the 7 skills, taught in three sections. Multiplying, dividing and simplifying (Skills 1, 2, 4),
 * adding and double brackets (Skills 3, 5), and rationalising the denominator (Skills 6, 7). An answer like 5√3 is typed
 * in two boxes, ☐√☐, so √75 typed back in can't pass as simplest form.
 */
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { line, part, sign, type StepWorking } from '../../written-methods/tutor/stepWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { choose, number, screens, text } from './helpers'

const a = author(18.5, 'L18H')
const { add, finish } = a
const { worked, practice } = screens(a)

const simplify = 'surds-simplify'
const brackets = 'surds-add-and-brackets'
const rationalise = 'surds-rationalise'

/** a√b in two boxes: the number in front, then the number under the root. */
const surd = (front: number, under: number): InteractionDefinition => ({
  type: 'numericInput', responseShape: 'list', listJoiner: '√', acceptanceRule: 'numberList', correctAnswer: `${front}, ${under}`, displayAnswer: `${front}√${under}`,
})
/** "√☐": the number under one root. */
function underRoot(state: ReturnType<typeof practice>) { state.answerPrefix = '= √'; return state }

/** √n in simplest form: the biggest square factor comes out in front. */
function simplestWorking(n: number, square: number, start = `√${n}`): StepWorking {
  const rest = n / square, root = Math.sqrt(square)
  return {
    kind: 'step-worked', start, steps: [
      { title: 'Find a square factor', why: `Find the biggest square number that divides ${n}.`, lines: [line([part(square, 0), sign('×'), part(rest, 1)], n)] },
      { title: 'Split the root', why: 'The square root of a product is the product of the square roots.', lines: [line([part(`√${n}`)], `√${square} × √${rest}`, { eq: true })] },
      { title: 'Root the square', why: `The square root of ${square} is a whole number, so it comes out in front.`, lines: [line([part(`√${square}`, 0)], `${root}`, { eq: true }), line([part(start)], `${root}√${rest}`, { eq: true, answer: true })] },
    ],
  }
}

/* ---------- Section 1: multiplying, dividing and simplifying (Skills 1, 2, 4) ---------- */

add(simplify, 'What is a surd?', 'Higher A7 Surds', text(
  'A surd is a square root that isn’t a whole number: √2, √3 and √5 are surds. √9 is not, because it is 3.',
  'Leave surds as they are. They are exact, and a rounded decimal is not.',
  'Multiply: √a × √b = √(ab), so √7 × √2 = √14.',
  'Divide: √a ÷ √b = √(a ÷ b), so √10 ÷ √5 = √2.',
  '√a × √a = a, so √6 × √6 = 6.',
))
worked(simplify, 'Write √28 in simplified surd form.', 'Higher A7 Skill 4', simplestWorking(28, 4),
  'Look for a square number that is a factor. Its root comes out in front of the √.')
practice(simplify, 'Write √75 in simplified surd form.', 'Higher A7 Your Turn Q1', surd(5, 3), '5√3', 'Which square number divides 75?', simplestWorking(75, 25), 'Simplified surd')
practice(simplify, 'Write √63 in simplified surd form.', 'Higher A7 Your Turn Q2', surd(3, 7), '3√7', 'Which square number divides 63?', simplestWorking(63, 9), 'Simplified surd')
practice(simplify, 'Write √72 in simplified surd form.', 'Higher A7 extra practice', surd(6, 2), '6√2', 'Use the biggest square factor: 36, not 4 or 9.', simplestWorking(72, 36), 'Simplified surd')
underRoot(practice(simplify, 'Work out √7 × √2.', 'Higher A7 Skill 1', number(14, '√14'), '√14', 'Multiply the numbers under the roots.', {
  kind: 'step-worked', start: '√7 × √2', steps: [
    { title: 'One root', why: 'Multiplying surds: multiply the numbers inside one square root.', lines: [line([part('7', 0), sign('×'), part('2', 1)], 14)] },
    { title: 'Write the answer', why: 'Fourteen has no square factor, so it stays as it is.', lines: [line([part('√7 × √2')], '√14', { eq: true, answer: true })] },
  ],
}, 'Answer'))
practice(simplify, 'Work out 2√2 × 3√5.', 'Higher A7 Skill 1', surd(6, 10), '6√10', 'Numbers in front multiply, and numbers under the roots multiply.', {
  kind: 'step-worked', start: '2√2 × 3√5', steps: [
    { title: 'Numbers in front', why: 'Multiply the numbers in front of the roots.', lines: [line([part('2', 0), sign('×'), part('3', 0)], 6)] },
    { title: 'Numbers under roots', why: 'Multiply the numbers under the roots.', lines: [line([part('2', 1), sign('×'), part('5', 1)], 10)] },
    { title: 'Write the answer', why: 'The front number goes in front of the new root.', lines: [line([part('2√2 × 3√5')], '6√10', { eq: true, answer: true })] },
  ],
}, 'Answer')
underRoot(practice(simplify, 'Work out √10 ÷ √5.', 'Higher A7 Skill 2', number(2, '√2'), '√2', 'Divide the numbers under the roots.', {
  kind: 'step-worked', start: '√10 ÷ √5', steps: [
    { title: 'One root', why: 'Dividing surds: divide the numbers inside one square root.', lines: [line([part('10', 0), sign('÷'), part('5', 1)], 2)] },
    { title: 'Write the answer', why: 'Two is not a square number, so the answer stays a surd.', lines: [line([part('√10 ÷ √5')], '√2', { eq: true, answer: true })] },
  ],
}, 'Answer'))
practice(simplify, 'Work out 8√12 ÷ 2√3.', 'Higher A7 Skill 2', number(8, '8'), '8', 'Divide the front numbers, then the numbers under the roots.', {
  kind: 'step-worked', start: '8√12 ÷ 2√3', steps: [
    { title: 'Numbers in front', why: 'Divide the numbers in front.', lines: [line([part('8', 0), sign('÷'), part('2', 0)], 4)] },
    { title: 'Numbers under roots', why: 'Divide the numbers under the roots.', lines: [line([part('12', 1), sign('÷'), part('3', 1)], 4)] },
    { title: 'Root the square', why: 'Four is a square number, so its root is a whole number: two.', lines: [line([part('4'), sign('×'), part('2')], '8', { answer: true })] },
  ],
}, 'Answer')
practice(simplify, 'Write √(3/16) in simplified surd form.', 'Higher A7 Your Turn Q3', choose(['√3/4', '3/4', '√3/16']), '√3/4', 'Take the root of the top and the bottom on their own.', {
  kind: 'step-worked', start: '√(3/16)', steps: [
    { title: 'Split the root', why: 'The root of a fraction is the root of the top over the root of the bottom.', lines: [line([part('√(3/16)')], '√3/√16', { eq: true })] },
    { title: 'Root the bottom', why: 'Sixteen is a square number. Three is not, so it stays as a surd.', lines: [line([part('√16', 1)], '4', { eq: true }), line([part('√(3/16)')], '√3/4', { eq: true, answer: true })] },
  ],
})

/* ---------- Section 2: adding, subtracting and double brackets (Skills 3, 5) ---------- */

add(brackets, 'Adding surds and double brackets', 'Higher A7 Skills 3 and 5', text(
  'Only like surds add or subtract, the same as collecting like terms: √a + √a = 2√a, and 5√b − 2√b = 3√b.',
  'Don’t do this: √a + √b is not √(a + b).',
  'Double brackets with surds expand with FOIL, then collect like terms.',
  '(√10 + √3)(√10 − √3) = 10 − √30 + √30 − 3 = 7',
))
practice(brackets, 'Simplify 5√3 − 2√3.', 'Higher A7 Skill 3', surd(3, 3), '3√3', 'They are like surds: collect them like 5x − 2x.', {
  kind: 'step-worked', start: '5√3 − 2√3', steps: [
    { title: 'Like surds', why: 'Both are lots of the same surd, so take away the numbers in front.', lines: [line([part('5', 0), sign('−'), part('2', 0)], 3)] },
    { title: 'Write the answer', why: 'The surd stays the same, like the x in collecting like terms.', lines: [line([part('5√3 − 2√3')], '3√3', { eq: true, answer: true })] },
  ],
}, 'Answer')
practice(brackets, 'Simplify √12 + √27.', 'Higher A7 extra practice', surd(5, 3), '5√3', 'Simplify each surd first, then they are like surds.', {
  kind: 'step-worked', start: '√12 + √27', steps: [
    { title: 'Simplify each surd', why: 'Take the square factor out of each. Then they are both lots of root three.', lines: [line([part('√12', 0)], '2√3', { eq: true }), line([part('√27', 1)], '3√3', { eq: true })] },
    { title: 'Add like surds', why: 'Add the numbers in front.', lines: [line([part('2', 0), sign('+'), part('3', 1)], 5), line([part('√12 + √27')], '5√3', { eq: true, answer: true })] },
  ],
}, 'Answer')
practice(brackets, 'Which is right?', 'Higher A7 Skill 3', choose(['√9 + √16 is 7', '√9 + √16 is √25, which is 5', '√9 + √16 is √144, which is 12']), '√9 + √16 is 7', 'Work out each root on its own first.', {
  kind: 'step-worked', start: '√9 + √16', steps: [
    { title: 'Each root', why: 'Roots don’t add inside. Work out each one.', lines: [line([part('√9', 0)], '3', { eq: true }), line([part('√16', 1)], '4', { eq: true })] },
    { title: 'Write the answer', why: 'Three and four make seven, not five. So √a + √b is never √(a + b).', words: '√9 + √16 is 7' },
  ],
})
worked(brackets, 'Expand and simplify (√10 + √3)(√10 − √3).', 'Higher A7 Skill 5', {
  kind: 'step-worked', start: '(√10 + √3)(√10 − √3)', steps: [
    { title: 'FOIL', why: 'Firsts, outers, inners, lasts, as with any double brackets.', lines: [line([part('(√10 + √3)(√10 − √3)', 0)], '√10² − √3√10 + √3√10 − √3²', { eq: true })] },
    { title: 'Middle terms cancel', why: 'Minus root thirty and plus root thirty cancel out.', lines: [line([part('√10²', 0), sign('−'), part('√3²', 1)], '10 − 3', { eq: true })] },
    { title: 'Work it out', why: 'A surd squared is the number under the root.', lines: [line([part('10'), sign('−'), part('3')], '7', { answer: true })] },
  ],
}, 'Expand with FOIL, then collect like terms. A surd times itself is a whole number.')
practice(brackets, 'Expand and simplify (2 + √3)(2 − √3).', 'Higher A7 extra practice', number(1, '1'), '1', 'FOIL, then the middle terms cancel.', {
  kind: 'step-worked', start: '(2 + √3)(2 − √3)', steps: [
    { title: 'FOIL', why: 'Firsts, outers, inners, lasts.', lines: [line([part('(2 + √3)(2 − √3)', 0)], '4 − 2√3 + 2√3 − 3', { eq: true })] },
    { title: 'Collect', why: 'The surds cancel, leaving whole numbers.', lines: [line([part('4'), sign('−'), part('3')], '1', { answer: true })] },
  ],
}, 'Answer')
practice(brackets, 'Expand and simplify (1 + √2)².', 'Higher A7 extra practice', choose(['3 + 2√2', '3', '1 + 2√2']), '3 + 2√2', 'Squared means two brackets: (1 + √2)(1 + √2).', {
  kind: 'step-worked', start: '(1 + √2)²', steps: [
    { title: 'FOIL', why: 'Write it as two brackets and multiply out.', lines: [line([part('(1 + √2)(1 + √2)', 0)], '1 + √2 + √2 + 2', { eq: true })] },
    { title: 'Collect', why: 'Add the whole numbers, and add the like surds.', lines: [line([part('1 + √2 + √2 + 2')], '3 + 2√2', { eq: true, answer: true })] },
  ],
})

/* ---------- Section 3: rationalising the denominator (Skills 6, 7) ---------- */

add(rationalise, 'Rationalising the denominator', 'Higher A7 Skills 6 and 7', text(
  'Rationalising means getting the surd off the bottom of a fraction.',
  'A surd on its own: multiply the top and the bottom by that surd. a/√b = a√b/b',
  'A bottom like 3 + √5: multiply the top and the bottom by the bottom with the sign changed, 3 − √5. The surds then cancel on the bottom.',
))
worked(rationalise, 'Rationalise the denominator of 3/√5.', 'Higher A7 Example 1', {
  kind: 'step-worked', start: '3/√5', steps: [
    { title: 'Times by √5/√5', why: 'Multiply the top and the bottom by the surd on the bottom. That is times one, so the value stays the same.', lines: [line([part('3/√5', 0), sign('×'), part('√5/√5', 1)], '3√5/(√5√5)', { eq: true })] },
    { title: 'Simplify the bottom', why: 'A surd times itself is the number under the root.', lines: [line([part('√5√5', 1)], '5', { eq: true }), line([part('3/√5')], '3√5/5', { eq: true, answer: true })] },
  ],
}, 'Multiply the top and the bottom by the surd on the bottom. The bottom becomes a whole number.')
practice(rationalise, 'Rationalise the denominator of 12/√3. Write your answer in its simplest form.', 'Higher A7 Your Turn Q4', surd(4, 3), '4√3', 'Times the top and the bottom by √3, then simplify.', {
  kind: 'step-worked', start: '12/√3', steps: [
    { title: 'Times by √3/√3', why: 'Multiply the top and the bottom by the surd on the bottom.', lines: [line([part('12/√3', 0), sign('×'), part('√3/√3', 1)], '12√3/3', { eq: true })] },
    { title: 'Simplify', why: 'Twelve divided by three is four.', lines: [line([part('12', 0), sign('÷'), part('3', 1)], 4), line([part('12/√3')], '4√3', { eq: true, answer: true })] },
  ],
}, 'Answer')
practice(rationalise, 'Rationalise the denominator of 10/√2.', 'Higher A7 extra practice', surd(5, 2), '5√2', 'Times the top and the bottom by √2.', {
  kind: 'step-worked', start: '10/√2', steps: [
    { title: 'Times by √2/√2', why: 'Multiply the top and the bottom by the surd on the bottom.', lines: [line([part('10/√2', 0), sign('×'), part('√2/√2', 1)], '10√2/2', { eq: true })] },
    { title: 'Simplify', why: 'Ten divided by two is five.', lines: [line([part('10', 0), sign('÷'), part('2', 1)], 5), line([part('10/√2')], '5√2', { eq: true, answer: true })] },
  ],
}, 'Answer')
worked(rationalise, 'Rationalise the denominator of 8/(5 + √2).', 'Higher A7 Example 2', {
  kind: 'step-worked', start: '8/(5 + √2)', steps: [
    { title: 'Change the sign', why: 'Multiply the top and the bottom by the bottom with its sign changed.', lines: [line([part('8/(5 + √2)', 0), sign('×'), part('(5 − √2)/(5 − √2)', 1)])] },
    { title: 'Multiply out the top', why: 'Eight times each term in the bracket.', lines: [line([part('8(5 − √2)', 0)], '40 − 8√2', { eq: true })] },
    { title: 'Multiply out the bottom', why: 'FOIL. The middle terms cancel, so the surd goes.', lines: [line([part('(5 + √2)(5 − √2)', 1)], '25 − 5√2 + 5√2 − 2', { eq: true }), line([part('25'), sign('−'), part('2')], 23)] },
    { title: 'Write the answer', why: 'Put the top over the bottom.', lines: [line([part('8/(5 + √2)')], '(40 − 8√2)/23', { eq: true, answer: true })] },
  ],
}, 'When the bottom has a number and a surd, multiply by the bottom with the sign changed. Then the surds cancel on the bottom.')
practice(rationalise, 'Rationalise the denominator of 5/(3 + √5).', 'Higher A7 Skill 7', choose(['(15 − 5√5)/4', '(15 + 5√5)/4', '(15 − 5√5)/14']), '(15 − 5√5)/4', 'Times the top and the bottom by 3 − √5.', {
  kind: 'step-worked', start: '5/(3 + √5)', steps: [
    { title: 'Change the sign', why: 'Multiply the top and the bottom by the bottom with its sign changed.', lines: [line([part('5/(3 + √5)', 0), sign('×'), part('(3 − √5)/(3 − √5)', 1)])] },
    { title: 'Multiply out the top', why: 'Five times each term in the bracket.', lines: [line([part('5(3 − √5)', 0)], '15 − 5√5', { eq: true })] },
    { title: 'Multiply out the bottom', why: 'The middle terms cancel. Root five squared is five.', lines: [line([part('(3 + √5)(3 − √5)', 1)], '9 − 5', { eq: true }), line([part('9'), sign('−'), part('5')], 4)] },
    { title: 'Write the answer', why: 'Put the top over the bottom.', lines: [line([part('5/(3 + √5)')], '(15 − 5√5)/4', { eq: true, answer: true })] },
  ],
})
practice(rationalise, 'Rationalise the denominator of 7/(√10 − 1). Write your answer in its simplest form.', 'Higher A7 Your Turn Q5 (Level 8-9)', choose(['(7√10 + 7)/9', '(7√10 − 7)/9', '(7√10 + 7)/11']), '(7√10 + 7)/9', 'The bottom has a minus, so multiply by √10 + 1.', {
  kind: 'step-worked', start: '7/(√10 − 1)', steps: [
    { title: 'Change the sign', why: 'The bottom has a minus, so multiply the top and the bottom by the same bracket with a plus.', lines: [line([part('7/(√10 − 1)', 0), sign('×'), part('(√10 + 1)/(√10 + 1)', 1)])] },
    { title: 'Multiply out the top', why: 'Seven times each term in the bracket.', lines: [line([part('7(√10 + 1)', 0)], '7√10 + 7', { eq: true })] },
    { title: 'Multiply out the bottom', why: 'The middle terms cancel. Root ten squared is ten.', lines: [line([part('(√10 − 1)(√10 + 1)', 1)], '10 − 1', { eq: true }), line([part('10'), sign('−'), part('1')], 9)] },
    { title: 'Write the answer', why: 'Put the top over the bottom.', lines: [line([part('7/(√10 − 1)')], '(7√10 + 7)/9', { eq: true, answer: true })] },
  ],
})

add('mixed', 'Surds', 'Higher A7 consolidation', text(
  'Multiply or divide surds by multiplying or dividing the numbers under the roots.',
  'Simplify by taking out the biggest square factor: √28 = 2√7.',
  'Only like surds add or subtract. √a + √b is not √(a + b).',
  'Rationalise a surd on the bottom by multiplying the top and the bottom by it, or by the bottom with its sign changed.',
))

export const tutorSurdsLesson: TutorMethodLesson = {
  id: 'L018H', number: 18.5, title: 'Surds', level: 'GCSE Higher',
  goal: 'Multiply, divide, simplify and add surds, expand brackets with surds, and rationalise the denominator.',
  labels: { [simplify]: 'Multiplying and simplifying surds', [brackets]: 'Adding surds and brackets', [rationalise]: 'Rationalising the denominator', mixed: 'Review' },
  states: finish(),
}
