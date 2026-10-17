/*
 * Lesson 220 (Trigonometry), a Higher section. From the Higher revision guide, T3 Trigonometry Common Values, Your Turn
 * (Level 6-7, p228–229): working without a calculator, putting the exact values of sin, cos and tan at 0°, 30°, 45°,
 * 60° and 90° into a calculation and simplifying the surds. The book's numbers: Q1 (√3), Q2 (20√3), Q3 ((2 + √3)/4), Q4
 * (x = 8 cm) and Q5 (x = 4√3 cm). The worked example is our own. Surd answers are picked from four.
 */
import { author } from '../../written-methods/tutor/content'
import { line, part, sign } from '../../written-methods/tutor/stepWorking'
import { boardModel, choose, number } from '../../simultaneous-equations/tutor/boardWorkings'
import { screens } from '../../geometry/tutor/figureLesson'
import { asks } from './figureHelpers'
import { screens as textScreens, text, type HigherAddition } from './helpers'
import { tri } from './trigPictures'

const exact = 'trig-exact-no-calculator'
const a = author(220, 'L220-H')
const { add } = a
const { worked } = screens(a)
const { practice } = textScreens(a)
const ask = asks(a)

add(exact, 'Exact values without a calculator', 'Higher T3 Trigonometry Common Values', text(
  'On the non-calculator paper, put the exact value in for each sin, cos or tan, then work it out like any sum with fractions and surds.',
  'sin 30° = 1/2, sin 45° = 1/√2, sin 60° = √3/2. cos runs the same list backwards: cos 30° = √3/2, cos 60° = 1/2.',
  'tan 30° = 1/√3, tan 45° = 1, tan 60° = √3.',
  'sin 0° = 0, cos 0° = 1, tan 0° = 0, sin 90° = 1, cos 90° = 0.',
))

worked(exact, 'Work out the exact value of tan 60° × cos 30°.', 'Exact values', 'Higher T3 Trigonometry Common Values (own numbers)', boardModel([], [
  { title: 'Put the values in', say: 'tan 60° is √3 and cos 30° is √3 over 2.', rows: ['tan 60° × cos 30° = √3 × {√3|2}'] },
  { title: 'Multiply', say: '√3 times √3 is 3, so the top is 3.', rows: ['= {3|2}', '! tan 60° × cos 30° = {3|2}'] },
], 'Work it out'), 'Swap each sin, cos or tan for its exact value first. A surd times itself is the number inside: √3 × √3 = 3.')

practice(exact, 'Work out the exact value of sin 60° + cos 30°, without a calculator.', 'Higher T3 Your Turn Q1 (Level 6-7)',
  choose('√3', ['√3/4', 'That multiplies them. Adding two halves of √3 makes one whole √3.'], ['√6/2', 'Add the tops: √3 + √3 is 2√3, not √6.'], ['1', 'sin 60° and cos 30° are both √3/2, not 1/2.']),
  '√3', 'sin 60° and cos 30° are the same exact value.', {
    kind: 'step-worked', start: 'sin 60° + cos 30°', steps: [
      { title: 'Put the values in', why: 'Both are root three over two.', lines: [line([part('√3/2'), sign('+'), part('√3/2')], '2√3/2')] },
      { title: 'Simplify', why: 'Two halves make one.', lines: [line([part('2√3 ÷ 2')], '√3', { answer: true })] },
    ],
  })

practice(exact, 'Work out the exact value of (tan 45° ÷ sin 30°) × 10 tan 60°, without a calculator.', 'Higher T3 Your Turn Q2 (Level 6-7)',
  choose('20√3', ['5√3', 'Dividing by a half doubles: 1 ÷ 1/2 is 2, not 1/2.'], ['10√3', 'Don’t forget tan 45° ÷ sin 30°, which is 2.'], ['20', 'tan 60° is √3, not 1.']),
  '20√3', 'tan 45° = 1, sin 30° = 1/2 and tan 60° = √3.', {
    kind: 'step-worked', start: '(tan 45° ÷ sin 30°) × 10 tan 60°', steps: [
      { title: 'The fraction', why: 'tan 45° is one and sin 30° is a half. Dividing by a half doubles.', lines: [line([part('1 ÷ ½')], '2')] },
      { title: 'The other part', why: 'tan 60° is root three.', lines: [line([part('10'), sign('×'), part('√3')], '10√3')] },
      { title: 'Multiply', why: 'Multiply the two parts.', lines: [line([part('2'), sign('×'), part('10√3')], '20√3', { answer: true })] },
    ],
  })

practice(exact, 'Work out the exact value of ((tan 45° + cos 30°) ÷ tan 45°) × cos 60°, without a calculator.', 'Higher T3 Your Turn Q3 (Level 6-7)',
  choose('(2 + √3)/4', ['(1 + √3)/2', 'cos 30° is √3/2, so the bracket is 1 + √3/2. Then halve it.'], ['(2 + √3)/2', 'Don’t forget × cos 60°, which halves it again.'], ['√3/4', 'tan 45° is 1, so the bracket is 1 + √3/2, not just √3/2.']),
  '(2 + √3)/4', 'tan 45° = 1, cos 30° = √3/2 and cos 60° = 1/2.', {
    kind: 'step-worked', start: '((tan 45° + cos 30°) ÷ tan 45°) × cos 60°', steps: [
      { title: 'The bracket', why: 'tan 45° is one and cos 30° is root three over two. Write one as two halves.', lines: [line([part('1'), sign('+'), part('√3/2')], '(2 + √3)/2')] },
      { title: 'Divide by tan 45°', why: 'tan 45° is one, so dividing by it changes nothing.', lines: [line([part('(2 + √3)/2 ÷ 1')], '(2 + √3)/2')] },
      { title: 'Times cos 60°', why: 'cos 60° is a half, which doubles the bottom.', lines: [line([part('(2 + √3)/2'), sign('×'), part('½')], '(2 + √3)/4', { answer: true })] },
    ],
  })

ask(exact, 'ABC is a right-angled triangle. Work out the missing side length x, without a calculator.', 'Higher T3 Your Turn Q4 (Level 6-7)', tri([[0, 0], [0, 8], [8 * Math.sqrt(3), 0]], {
  sides: [{ label: 'x', tone: 'x' }, { label: '16 cm' }],
  angles: [{ at: 2, label: '30°' }],
  right: 0, names: ['C', 'B', 'A'],
  spoken: 'Right-angled triangle ABC, the right angle at C. Angle A is 30°, the hypotenuse AB is 16 cm, and x is CB, opposite the 30°.',
}), number(8, '8 cm'), '8 cm', 'x is opposite the 30°, and 16 cm is the hypotenuse.', {
  kind: 'step-worked', start: 'A = 30°, AB = 16 cm', steps: [
    { title: 'Pick SOH', why: 'x is opposite the angle and the hypotenuse is known, so use sine. sin 30° is exactly a half.', lines: [line([part('x')], '16 × sin 30°', { eq: true })] },
    { title: 'Use the exact value', why: 'Times sixteen by a half.', lines: [line([part('16'), sign('×'), part('½')], '8 cm', { answer: true })] },
  ],
}, { label: 'Length (cm)', prefix: 'x =' })

ask(exact, 'ABC is a right-angled triangle. Work out the missing side length x, without a calculator.', 'Higher T3 Your Turn Q5 (Level 6-7)', tri([[0, 0], [12, 0], [0, 12 / Math.sqrt(3)]], {
  sides: [{ label: '12 cm' }, undefined, { label: 'x', tone: 'x' }],
  angles: [{ at: 1, label: '30°' }],
  right: 0, names: ['C', 'B', 'A'],
  spoken: 'Right-angled triangle ABC, the right angle at C. Angle B is 30°, CB is 12 cm, and x is AC, opposite the 30°.',
}), choose('4√3 cm', ['12√3 cm', 'tan 30° is 1/√3, so divide 12 by √3, don’t multiply.'], ['6 cm', 'That uses sin 30°. AC is opposite and CB is next to the angle: tan.'], ['6√3 cm', 'That uses cos 30°. AC is opposite and CB is next to the angle: tan.']),
'4√3 cm', 'x is opposite the 30°, and 12 cm is next to it: use tan.', {
  kind: 'step-worked', start: 'B = 30°, CB = 12 cm', steps: [
    { title: 'Pick TOA', why: 'x is opposite the angle and the side next to it is known, so use tan. tan 30° is one over root three.', lines: [line([part('x')], '12 × 1/√3', { eq: true })] },
    { title: 'Rationalise', why: 'Multiply top and bottom by root three, then cancel the three.', lines: [line([part('12/√3')], '12√3/3', { eq: true }), line([part('12√3 ÷ 3')], '4√3 cm', { answer: true })] },
  ],
})

export const exactValuesNoCalculator: HigherAddition = { lessonId: 'L220', skill: exact, label: 'Exact values without a calculator', states: a.finish() }
