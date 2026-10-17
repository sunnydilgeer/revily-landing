/*
 * Lesson 31 (Direct and inverse proportion), a Higher section. From the Higher revision guide, R2 Direct and Inverse
 * Proportion (Level 6-7, p147–149): "y is proportional to x" is written y ∝ x and becomes y = kx, where k is the
 * constant of proportionality; inversely proportional is y ∝ 1/x, so y = k/x. The same works for x², x³ and √x. The
 * method is always the same: write the equation with k, put in the pair of values you are given to find k, then use
 * the equation. The book's examples (y = 3x and y = 6/x), its four graph shapes, and Your Turn Q1 to Q5. Equations are
 * typed after "y =" (or "M =", "x =", "t =") and checked as a formula, as in the Higher perpendicular lines section.
 */
import { author } from '../../written-methods/tutor/content'
import { line, part, sign, type StepWorking } from '../../written-methods/tutor/stepWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { latex } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, pt, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'
import { choose, number, screens, text, type HigherAddition } from './helpers'

const proportion = 'proportion-with-k'
const a = author(31, 'L31-H')
const { add } = a
const { worked, graph, practice } = screens(a)

/** An equation typed after "y =", any way of writing it ("6/x", "6x⁻¹"); `typed` is its formula. */
const formula = (typed: string, shown: string): InteractionDefinition => ({ type: 'numericInput', responseShape: 'formula', acceptanceRule: 'formula', correctAnswer: typed, displayAnswer: shown })

add(proportion, 'Proportion with algebra', 'Higher R2 Direct Proportionality - with Algebra', text(
  '“y is directly proportional to x” is written y ∝ x. The ∝ sign means “is proportional to”.',
  'Swap ∝ for “= k ×” and it becomes an equation: y = kx. The number k is the constant of proportionality: it tells you how y and x are linked.',
  '“y is inversely proportional to x” is written y ∝ 1/x, so y = k/x. As x doubles, y halves.',
  'It works for powers and roots too: y ∝ x² is y = kx², y ∝ √x is y = k√x, and y ∝ 1/x³ is y = k/x³.',
))

add(proportion, 'Three steps every time', 'Higher R2 Direct and Inverse Proportionality - with Algebra (method)', text(
  '1. Write the equation with k: y = kx, y = k/x², or whatever the words say.',
  '2. Put in the pair of values the question gives you, and solve for k.',
  '3. Write the equation with that number in place of k, then use it to find the new value.',
))

/* ---------- The book's examples ---------- */

worked(proportion, 'y is directly proportional to x. When y = 24, x = 8. Work out the value of y when x = 2.', 'Higher R2 Example 1: Direct Proportion', {
  kind: 'step-worked', start: 'y ∝ x, y = 24 when x = 8', steps: [
    { title: 'Write the equation', why: 'Directly proportional: swap the proportional sign for equals k times.', lines: [line([part('y ∝ x', 0)], 'y = kx')] },
    { title: 'Find k', why: 'Put in the pair of values you are given, then divide to get k on its own.', lines: [
      line([part('24 = k × 8')], undefined),
      line([part('24'), sign('÷'), part('8')], '3'),
      line([part('y')], '3x', { eq: true }),
    ] },
    { title: 'Use the equation', why: 'Put the new x into the equation.', lines: [line([part('3'), sign('×'), part('2')], '6', { answer: true })] },
  ],
}, 'Write y = kx, use the values you are given to find k, then use the equation.')

worked(proportion, 'y is inversely proportional to x. When y = 2, x = 3. Work out the value of y when x = 18.', 'Higher R2 Example 2: Inverse Proportion', {
  kind: 'step-worked', start: 'y ∝ 1/x, y = 2 when x = 3', steps: [
    { title: 'Write the equation', why: 'Inversely proportional: y is k divided by x.', lines: [line([part('y ∝ 1/x', 0)], 'y = k/x')] },
    { title: 'Find k', why: 'Put in the pair of values. k is divided by three, so multiply both sides by three.', lines: [
      line([part('2 = k ÷ 3')], undefined),
      line([part('2'), sign('×'), part('3')], '6'),
      line([part('y')], '6/x', { eq: true }),
    ] },
    { title: 'Use the equation', why: 'Put the new x into the equation and simplify the fraction.', lines: [line([part('6/18', 0)], '1/3', { answer: true, eq: true })] },
  ],
}, 'Write y = k/x, find k, then use the equation.')

/* ---------- The graphs ---------- */

{
  const moves: GraphMove[] = [
    { title: 'y = kx', say: 'Directly proportional to x: a straight line through the origin. Double x and y doubles.', equation: latex('y = 2x'), adds: 'picture',
      change: (frame, step) => ({ ...frame, lines: [{ from: pt(0, 0), to: pt(3.5, 7), at: step, segment: true, label: 'y = 2x' }] }) },
    { title: 'y = kx²', say: 'Proportional to x squared: a curve through the origin that gets steeper and steeper.', equation: latex('y = x^2'), adds: 'picture',
      change: (frame, step) => ({ ...frame, curves: [{ coeffs: [0, 0, 1], from: 0, to: 2.65, at: step, label: 'y = x²' }] }) },
    answerMove('y = k/x never touches the axes', 'y = k/x', 'Inversely proportional: as x gets bigger, y gets smaller. The curve gets closer and closer to both axes but never touches them. y = k/x² and y = k/x³ look the same, just steeper.', [], {
      title: '', say: '', equation: '', adds: 'answer',
      change: (frame, step) => ({ ...frame, curves: [...(frame.curves ?? []), { coeffs: [], fn: { kind: 'reciprocal', a: 4 }, from: 0.5, to: 7, at: step, answer: true, label: 'y = 4/x' }] }),
    }),
  ]
  graph(proportion, 'What do proportion graphs look like?', 'Higher R2 Proportionality Graphs', 'y = kx, y = kx² and y = k/x',
    { x: [-1, 7], y: [-1, 8], lines: [], points: [] }, moves, 'Three shapes', 'Proportion graphs',
    'Direct proportion goes through the origin. Inverse proportion never touches either axis.')
}

practice(proportion, 'Which graph shows y inversely proportional to x?', 'Higher R2 Proportionality Graphs (concept)', choose([
  'A curve that falls and gets closer and closer to both axes',
  'A straight line through the origin',
  'A curve through the origin that gets steeper',
  'A straight line that falls and crosses both axes',
]), 'A curve that falls and gets closer and closer to both axes', 'As x gets bigger, y = k/x gets smaller, but it is never 0.', {
  kind: 'step-worked', start: 'y = k/x', steps: [
    { title: 'Bigger x, smaller y', why: 'Dividing by a bigger number gives a smaller answer, so the graph falls.', lines: [line([part('y = k/x', 0)], 'falls')] },
    { title: 'Never zero', why: 'A number divided by another is never zero, and you can’t divide by zero, so the curve never meets either axis.', words: 'A curve that falls and gets closer and closer to both axes' },
  ],
})

/* ---------- Your Turn ---------- */

const q1 = practice(proportion, 'F is inversely proportional to the square of r. When F = 50, r = 3. Calculate the value of F when r = 12.', 'Higher R2 Your Turn Q1',
  number(3.125, '3.125'), '3.125', 'F = k/r². Put in F = 50 and r = 3 to find k first.', {
    kind: 'step-worked', start: 'F ∝ 1/r², F = 50 when r = 3', steps: [
      { title: 'Write the equation', why: 'Inversely proportional to the square of r: k divided by r squared.', lines: [line([part('F ∝ 1/r²', 0)], 'F = k/r²')] },
      { title: 'Find k', why: 'Three squared is nine, so k is divided by nine. Multiply both sides by nine.', lines: [
        line([part('50 = k ÷ 9')], undefined),
        line([part('50'), sign('×'), part('9')], '450'),
        line([part('F')], '450/r²', { eq: true }),
      ] },
      { title: 'Use the equation', why: 'Twelve squared is one hundred and forty-four.', lines: [line([part('450'), sign('÷'), part('144')], '3.125', { answer: true })] },
    ],
  })
q1.answerPrefix = 'F ='

/** Inversely proportional, y = 30/x: k from the table's first column, then the missing value. */
function tableWorking(last: StepWorking['steps'][number]): StepWorking {
  return { kind: 'step-worked', start: 'y ∝ 1/x, y = 7.5 when x = 4', steps: [
    { title: 'Write the equation', why: 'Inversely proportional: y is k divided by x.', lines: [line([part('y ∝ 1/x', 0)], 'y = k/x')] },
    { title: 'Find k', why: 'The table’s first column is the pair of values you are given. k is divided by four, so multiply by four.', lines: [
      line([part('7.5'), sign('×'), part('4')], '30'),
      line([part('y')], '30/x', { eq: true }),
    ] },
    last,
  ] }
}
const q2a = practice(proportion, 'y is inversely proportional to x. When x = 4, y = 7.5. Find y when x = 60.', 'Higher R2 Your Turn Q2 (the table)',
  number(0.5, '0.5'), '0.5', 'Find k from x = 4 and y = 7.5 first.', tableWorking(
    { title: 'Use the equation', why: 'Put x equals sixty into the equation.', lines: [line([part('30'), sign('÷'), part('60')], '0.5', { answer: true })] }))
q2a.answerPrefix = 'y ='
const q2b = practice(proportion, 'y = 30/x. Find x when y = 12.', 'Higher R2 Your Turn Q2 (the table)',
  number(2.5, '2.5'), '2.5', 'Put y = 12 in, then rearrange: x = 30 ÷ 12.', tableWorking(
    { title: 'Rearrange for x', why: 'Swap x and y over: x is k divided by y.', lines: [line([part('30'), sign('÷'), part('12')], '2.5', { answer: true })] }))
q2b.answerPrefix = 'x ='

const q3a = practice(proportion, 'The money Sasha earns, M, is directly proportional to the hours she works, h. In 9.5 hours she earns £155.80. Express M in terms of h.', 'Higher R2 Your Turn Q3a',
  formula('16.4*h', 'M = 16.4h'), 'M = 16.4h', 'M = kh. Put in M = 155.80 and h = 9.5 to find k.', {
    kind: 'step-worked', start: 'M ∝ h, M = 155.80 when h = 9.5', steps: [
      { title: 'Write the equation', why: 'Directly proportional: M is k times h.', lines: [line([part('M ∝ h', 0)], 'M = kh')] },
      { title: 'Find k', why: 'Divide the pay by the hours. k is her pay for one hour.', lines: [line([part('155.80'), sign('÷'), part('9.5')], '16.4')] },
      { title: 'Write it with k', why: 'Put the number in place of k.', lines: [line([part('M = kh')], 'M = 16.4h', { answer: true })] },
    ],
  })
q3a.answerPrefix = 'M ='
practice(proportion, 'M = 16.4h. How many hours would it take Sasha to earn £688.80?', 'Higher R2 Your Turn Q3b',
  number(42, '42 hours'), '42', 'Put M = 688.80 in and divide by 16.4.', {
    kind: 'step-worked', start: 'M = 16.4h, M = 688.80', steps: [
      { title: 'Put M in', why: 'The pay is sixteen point four times the hours.', lines: [line([part('688.80 = 16.4h')], undefined)] },
      { title: 'Divide by k', why: 'Divide both sides by sixteen point four to get h on its own.', lines: [line([part('688.80'), sign('÷'), part('16.4')], '42', { answer: true })] },
    ],
  }, 'Time (hours)')

/** x is directly proportional to y, x = y/4: k from x = 2, y = 8, then the new value. */
function quarterWorking(last: StepWorking['steps'][number]): StepWorking {
  return { kind: 'step-worked', start: 'x ∝ y, x = 2 when y = 8', steps: [
    { title: 'Write the equation', why: 'x is proportional to y, so here x is k times y.', lines: [line([part('x ∝ y', 0)], 'x = ky')] },
    { title: 'Find k', why: 'Put in the pair of values and divide to get k on its own.', lines: [line([part('2'), sign('÷'), part('8')], '0.25')] },
    last,
  ] }
}
const q4a = practice(proportion, 'x is directly proportional to y. When x = 2, y = 8. Write an equation connecting x and y.', 'Higher R2 Your Turn Q4a',
  formula('y/4', 'x = ¼y'), 'x = ¼y', 'Careful: x is proportional to y, so start with x = ky.', quarterWorking(
    { title: 'Write it with k', why: 'A quarter is the same as nought point two five.', lines: [line([part('x = ky')], 'x = ¼y', { answer: true })] }))
q4a.answerPrefix = 'x ='
const q4b = practice(proportion, 'x = ¼y. Calculate the value of x when y is 32.', 'Higher R2 Your Turn Q4b',
  number(8, '8'), '8', 'A quarter of 32.', quarterWorking(
    { title: 'Use the equation', why: 'A quarter of y: divide it by four.', lines: [line([part('32'), sign('÷'), part('4')], '8', { answer: true })] }))
q4b.answerPrefix = 'x ='
const q4c = practice(proportion, 'x = ¼y. Calculate the value of y when x is 50.', 'Higher R2 Your Turn Q4c',
  number(200, '200'), '200', 'x is a quarter of y, so y is 4 times x.', quarterWorking(
    { title: 'Rearrange for y', why: 'Multiply both sides by four to get y on its own.', lines: [line([part('50'), sign('×'), part('4')], '200', { answer: true })] }))
q4c.answerPrefix = 'y ='

const q5a = practice(proportion, 'The time t, in minutes, for an order is inversely proportional to the square of the number of staff, s. It takes 20 minutes with 4 staff. Write an equation for t in terms of s.', 'Higher R2 Your Turn Q5a',
  formula('320/s^2', 't = 320/s²'), 't = 320/s²', 't = k/s². Four squared is 16.', {
    kind: 'step-worked', start: 't ∝ 1/s², t = 20 when s = 4', steps: [
      { title: 'Write the equation', why: 'Inversely proportional to the square: k divided by s squared.', lines: [line([part('t ∝ 1/s²', 0)], 't = k/s²')] },
      { title: 'Find k', why: 'Four squared is sixteen, so k is divided by sixteen. Multiply both sides by sixteen.', lines: [line([part('20'), sign('×'), part('16')], '320')] },
      { title: 'Write it with k', why: 'Put the number in place of k.', lines: [line([part('t = k/s²')], 't = 320/s²', { answer: true })] },
    ],
  })
q5a.answerPrefix = 't ='
practice(proportion, 't = 320/s². If the number of staff is doubled, how many times quicker will customers get their orders?', 'Higher R2 Your Turn Q5b',
  choose(['4 times quicker', '2 times quicker', '16 times quicker', '2 times slower']), '4 times quicker', 'Try it: 4 staff, then 8 staff.', {
    kind: 'step-worked', start: 't = 320/s²', steps: [
      { title: 'With 4 staff', why: 'The question tells you: twenty minutes.', lines: [line([part('320'), sign('÷'), part('16')], '20')] },
      { title: 'With 8 staff', why: 'Double four is eight, and eight squared is sixty-four.', lines: [line([part('320'), sign('÷'), part('64')], '5')] },
      { title: 'Compare them', why: 'Doubling s makes s squared four times bigger, so the time is a quarter of what it was.', lines: [line([part('20'), sign('÷'), part('5')], '4')], words: '4 times quicker' },
    ],
  })

/* ---------- More practice ---------- */

const root = practice(proportion, 'y is directly proportional to √x. When x = 9, y = 12. Find y when x = 25.', 'Higher R2 extra practice (y ∝ √x)',
  number(20, '20'), '20', 'y = k√x, and √9 = 3.', {
    kind: 'step-worked', start: 'y ∝ √x, y = 12 when x = 9', steps: [
      { title: 'Write the equation', why: 'Proportional to the square root of x: k times root x.', lines: [line([part('y ∝ √x', 0)], 'y = k√x')] },
      { title: 'Find k', why: 'The square root of nine is three, so twelve is k times three.', lines: [line([part('12'), sign('÷'), part('3')], '4')] },
      { title: 'Use the equation', why: 'The square root of twenty-five is five.', lines: [line([part('4'), sign('×'), part('5')], '20', { answer: true })] },
    ],
  })
root.answerPrefix = 'y ='

const cube = practice(proportion, 'p is directly proportional to the cube of q. When q = 2, p = 40. Write an equation for p in terms of q.', 'Higher R2 extra practice (y ∝ x³)',
  formula('5*q^3', 'p = 5q³'), 'p = 5q³', 'p = kq³, and 2³ = 8.', {
    kind: 'step-worked', start: 'p ∝ q³, p = 40 when q = 2', steps: [
      { title: 'Write the equation', why: 'Proportional to the cube: k times q cubed.', lines: [line([part('p ∝ q³', 0)], 'p = kq³')] },
      { title: 'Find k', why: 'Two cubed is eight, so forty is k times eight.', lines: [line([part('40'), sign('÷'), part('8')], '5')] },
      { title: 'Write it with k', why: 'Put the number in place of k.', lines: [line([part('p = kq³')], 'p = 5q³', { answer: true })] },
    ],
  })
cube.answerPrefix = 'p ='

practice(proportion, 'y is directly proportional to x². What happens to y when x is tripled?', 'Higher R2 extra practice (concept)',
  choose(['It is multiplied by 9', 'It is multiplied by 3', 'It is multiplied by 6', 'It is divided by 9']), 'It is multiplied by 9', 'Try x = 1, then x = 3, in y = kx².', {
    kind: 'step-worked', start: 'y = kx²', steps: [
      { title: 'Triple x', why: 'Whatever x was, it is now three times as big.', lines: [line([part('x', 1)], '3x')] },
      { title: 'Square it', why: 'Three squared is nine, so x squared is nine times as big, and so is y.', lines: [line([part('3'), sign('×'), part('3')], '9')], words: 'It is multiplied by 9' },
    ],
  })

export const proportionWithK: HigherAddition = { lessonId: 'L031', skill: proportion, label: 'Proportion with k', states: a.finish() }
