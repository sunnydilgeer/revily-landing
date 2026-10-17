/*
 * Lesson 104.5, Circle graphs and tangents (Higher only, shown as Graphs 4H after Parallel lines, whose Higher section
 * teaches perpendicular gradients). From the Higher revision guide, GR8 (pages 122 to 124):
 * - What are circle graphs (Level 6-7): x² + y² = r² is a circle with centre (0, 0) and radius r; x² + y² = 4² is
 *   x² + y² = 16. Your Turn Q1: the circle pictured has radius 10 (read from the photo of page 124), so x² + y² = 100.
 * - Finding the equation of a tangent (Level 8-9): the tangent is perpendicular to the radius at that point, so its
 *   gradient is the negative reciprocal of the radius's. The book's example, x² + y² = 25 at (3, 4), giving
 *   y = −¾x + 25/4, is drawn on a grid one move a step. Your Turn Q2 (x² + y² = 169 at (12, 5)) is typed as y = mx + c,
 *   as in the gradient lesson; Q3 (x² + y² = 113 at (−8, −7)) has big fractions, so it is picked from close equations.
 * The big circles are drawn on axes that count in 2s or 3s (`scale`), so each grid stays about 11 squares.
 */
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { line, part, sign } from '../../written-methods/tutor/stepWorking'
import type { AxisScale } from '../../written-methods/tutor/methodWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { latex } from '../../inequalities/tutor/inequalityWorkings'
import { gradient, mark, pt, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'
import { choose, number, screens, text } from './helpers'

const a = author(104.5, 'L104H')
const { add, finish } = a
const { practice, graph, onGrid } = screens(a)

const equation = 'circle-graphs-equation'
const tangent = 'circle-graphs-tangent'

/** Axes that count in `per` a square, crossing at 0, so a big circle fits about 11 squares. */
const counting = (per: number): { x: AxisScale; y: AxisScale } => ({ x: { per, start: 0, name: 'x' }, y: { per, start: 0, name: 'y' } })
/** A line equation typed after "y =" (as in the gradient lesson): checked as a formula, so any way of writing it passes. */
const lineAnswer = (typed: string, shown: string): InteractionDefinition => ({ type: 'numericInput', responseShape: 'formula', acceptanceRule: 'formula', correctAnswer: typed, displayAnswer: shown })

/* ---------- Section 1: the equation of a circle (Level 6-7) ---------- */

add(equation, 'Circle graphs', 'Higher GR8 What are Circle Graphs?', text(
  'A circle with its centre at (0, 0) has the equation x² + y² = r², where r is the radius.',
  'The number on the right is the radius squared. So x² + y² = 16 is x² + y² = 4², a circle of radius 4.',
  'To find the radius, square root the number on the right. To write the equation, square the radius.',
  'Every point on the circle fits the equation: its x squared add its y squared makes r².',
))

const sixteen: GraphGrid = { x: [-5, 5], y: [-5, 5], lines: [], points: [] }
const sixteenMoves: GraphMove[] = [
  { title: 'Find the radius', say: 'The number on the right is the radius squared. 16 is 4², so the radius is 4.', equation: latex('r^2 = 16,\\ r = 4'), adds: 'lines',
    change: (frame, step) => ({ ...frame, working: [{ text: 'r² = 16, so r = 4', family: 0, at: step }] }) },
  { title: 'Mark four points', say: 'The centre is (0, 0). Go 4 along each axis, right, left, up and down: those points are on the circle.', equation: latex('(4, 0),\\ (-4, 0),\\ (0, 4),\\ (0, -4)'), adds: 'picture',
    change: (frame, step) => ({ ...frame, marks: [mark('x', 4), mark('x', -4), mark('y', 4), mark('y', -4)],
      points: [pt(4, 0), pt(-4, 0), pt(0, 4), pt(0, -4)].map(p => ({ ...p, at: step })) }) },
  { title: 'Draw the circle', say: 'Draw a circle through the four points, with its centre at (0, 0).', equation: latex('x^2 + y^2 = 16'), adds: 'answer',
    change: (frame, step) => ({ ...frame, circles: [{ r: 4, at: step, answer: true, label: 'x² + y² = 16' }], answer: { text: 'centre (0, 0), radius 4', at: step } }) },
]
graph(equation, 'Draw the graph of x² + y² = 16.', 'Higher GR8 What are Circle Graphs? (e.g.)', 'x² + y² = 16', sixteen, sixteenMoves, 'Draw it', 'Draw the circle',
  'Square root the number on the right to find the radius, then draw the circle about (0, 0).')

const hundred: GraphGrid = { x: [-12, 10], y: [-12, 10], scale: counting(2), circles: [{ r: 10, at: -1 }], lines: [], points: [] }
onGrid(equation, 'State the equation of the circle pictured.', 'Higher GR8 Your Turn Q1', hundred, choose([
  'x² + y² = 100', 'x² + y² = 10', 'x² + y² = 20', 'x² + y² = 50',
]), 'x² + y² = 100', 'Read where the circle crosses an axis. That is the radius.', {
  kind: 'step-worked', start: 'circle about (0, 0)', steps: [
    { title: 'Read the radius', why: 'The circle crosses the x axis at ten and minus ten. Each square is two, so count carefully.', lines: [line([part('r', 0)], '10', { eq: true })] },
    { title: 'Square the radius', why: 'The number on the right of the equation is the radius squared.', lines: [line([part('10', 0), sign('×'), part('10', 0)], 100)] },
    { title: 'Write the equation', why: 'Put the radius squared on the right.', lines: [line([part('x² + y² = r²')], 'x² + y² = 100', { answer: true })] },
  ],
})

const radius = practice(equation, 'What is the radius of the circle x² + y² = 49?', 'Higher GR8 extra practice', number(7, '7'), '7', 'The number on the right is the radius squared.', {
  kind: 'step-worked', start: 'x² + y² = 49', steps: [
    { title: 'Square root it', why: 'The number on the right is the radius squared, so square root it to get the radius.', lines: [line([part('√49', 0)], '7', { answer: true })] },
  ],
})
radius.answerPrefix = 'r ='

const fromRadius = practice(equation, 'A circle has centre (0, 0) and radius 6. Write down its equation.', 'Higher GR8 extra practice', number(36, '36'), '36', 'Square the radius.', {
  kind: 'step-worked', start: 'radius 6', steps: [
    { title: 'Square the radius', why: 'The number on the right of the equation is the radius squared.', lines: [line([part('6', 0), sign('×'), part('6', 0)], '36', { answer: true })] },
  ],
})
fromRadius.answerPrefix = 'x² + y² ='

practice(equation, 'Is the point (5, −12) on the circle x² + y² = 169?', 'Higher GR8 extra practice', choose([
  'Yes: 25 + 144 is 169', 'No: 5 − 12 isn’t 169', 'No: 25 − 144 isn’t 169',
]), 'Yes: 25 + 144 is 169', 'Square the x and the y, then add them.', {
  kind: 'step-worked', start: 'x² + y² = 169 and (5, −12)', steps: [
    { title: 'Square each number', why: 'Put the point’s x and y into the equation. A negative number squared is positive.', lines: [line([part('5', 1), sign('×'), part('5', 1)], 25), line([part('−12', 0), sign('×'), part('−12', 0)], 144)] },
    { title: 'Add them', why: 'If they add to the number on the right, the point is on the circle.', lines: [line([part('25'), sign('+'), part('144')], 169)] },
    { title: 'Decide', why: 'They do, so the point is on the circle.', words: 'Yes: 25 + 144 is 169' },
  ],
})

practice(equation, 'Is the point (3, 5) on the circle x² + y² = 36?', 'Higher GR8 extra practice', choose([
  'No: 9 + 25 is 34, not 36', 'Yes: 9 + 25 is 34, close to 36', 'Yes: 3 + 5 is 8, less than 36',
]), 'No: 9 + 25 is 34, not 36', 'Square the x and the y, then add them.', {
  kind: 'step-worked', start: 'x² + y² = 36 and (3, 5)', steps: [
    { title: 'Square each number', why: 'Put the point’s x and y into the equation.', lines: [line([part('3', 1), sign('×'), part('3', 1)], 9), line([part('5', 0), sign('×'), part('5', 0)], 25)] },
    { title: 'Add them', why: 'If they add to the number on the right, the point is on the circle.', lines: [line([part('9'), sign('+'), part('25')], 34)] },
    { title: 'Decide', why: 'Close isn’t good enough. The point is just inside the circle, not on it.', words: 'No: 9 + 25 is 34, not 36' },
  ],
})

/* ---------- Section 2: the equation of a tangent (Level 8-9) ---------- */

add(tangent, 'The tangent to a circle', 'Higher GR8 Finding the Equation of a Tangent', text(
  'A tangent is a straight line that just touches the circle at one point.',
  'The tangent is perpendicular to the radius at that point. So its gradient is the negative reciprocal of the radius’s gradient: flip it and change its sign.',
  'Find the gradient of the radius from (0, 0) to the point: change in y over change in x.',
  'Then put the point into y = mx + c to find c, as for any line through a point.',
))

const twentyFive: GraphGrid = { x: [-5, 6], y: [-5, 6], lines: [], points: [] }
const tangentMoves: GraphMove[] = [
  { title: 'Read the radius', say: 'x² + y² = 25 is a circle about (0, 0). 25 is 5², so its radius is 5.', equation: latex('r = 5'), adds: 'picture',
    change: (frame, step) => ({ ...frame, circles: [{ r: 5, at: step, label: 'x² + y² = 25' }], working: [{ text: 'r² = 25, so r = 5', family: 0, at: step }] }) },
  { title: 'Draw the radius', say: 'Join the centre (0, 0) to the point (3, 4). The tangent touches the circle here.', equation: latex('(0, 0)\\ \\text{to}\\ (3, 4)'), adds: 'picture',
    change: (frame, step) => ({ ...frame, lines: [{ from: pt(0, 0), to: pt(3, 4), segment: true, at: step }], points: [{ x: 3, y: 4, label: '(3, 4)', at: step, place: { dx: 1, dy: -1 } }], boxed: [pt(3, 4)], marks: [mark('x', 3), mark('y', 4)] }) },
  { title: 'Gradient of the radius', say: 'From (0, 0) to (3, 4) the radius goes 3 across and 4 up. Gradient is change in y over change in x.', equation: latex('\\frac{4 - 0}{3 - 0} = \\frac{4}{3}'), adds: 'lines',
    change: (frame, step) => ({ ...frame,
      legs: [{ from: pt(0, 0), to: pt(3, 0), label: '3', family: 1, at: step }, { from: pt(3, 0), to: pt(3, 4), label: '4', family: 0, at: step }],
      working: [...(frame.working ?? []), { text: 'radius gradient = 4/3', family: 3, at: step }] }) },
  { title: 'Gradient of the tangent', say: 'The tangent is perpendicular to the radius. Flip 4/3 over and change its sign: −3/4.', equation: latex('-\\frac{3}{4}'), adds: 'lines',
    change: (frame, step) => ({ ...frame, legs: [], working: [...(frame.working ?? []), { text: 'tangent gradient = −3/4', family: 3, at: step }] }) },
  { title: 'Find c', say: 'The tangent goes through (3, 4). Put x = 3 and y = 4 into y = −¾x + c: 4 = −9/4 + c, so c = 4 + 9/4 = 25/4.', equation: latex('4 = -\\frac{3}{4} \\times 3 + c'), adds: 'lines',
    change: (frame, step) => ({ ...frame, boxed: [pt(3, 4)], working: [...(frame.working ?? []), { text: '4 = −¾ × 3 + c, so c = 25/4', family: 0, at: step }] }) },
  { title: 'Draw the tangent', say: 'The tangent has gradient −¾ and goes through (3, 4). It just touches the circle there, at right angles to the radius.', equation: latex('y = -\\frac{3}{4}x + \\frac{25}{4}'), adds: 'answer',
    change: (frame, step) => ({ ...frame, lines: [...(frame.lines ?? []), { from: pt(3, 4), to: pt(7, 1), at: step, answer: true }], answer: { text: 'y = −¾x + 25/4', at: step } }) },
]
graph(tangent, 'Find the equation of the tangent to x² + y² = 25 at the point (3, 4).', 'Higher GR8 Finding the Equation of a Tangent (Example)', 'x² + y² = 25 at (3, 4)', twentyFive, tangentMoves, 'Find it', 'The tangent at (3, 4)',
  'Find the gradient of the radius, flip it and change its sign for the tangent, then use the point to find c.')

const q2Grid: GraphGrid = { x: [-15, 18], y: [-15, 18], scale: counting(3), circles: [{ r: 13, at: -1 }], lines: [], points: [{ x: 12, y: 5, label: '(12, 5)', at: -1 }] }
const q2 = onGrid(tangent, 'Find the equation of the tangent to the circle at the point (12, 5).', 'Higher GR8 Your Turn Q2', q2Grid,
  lineAnswer('-12/5*x+169/5', 'y = −12/5x + 169/5'), 'y = −12/5x + 169/5', 'Gradient of the radius first: from (0, 0) to (12, 5).', {
    kind: 'step-worked', start: 'tangent at (12, 5)', steps: [
      { title: 'Gradient of the radius', why: 'The radius goes from the centre to the point. Change in y over change in x.', lines: [line([part('5', 0), sign('÷'), part('12', 1)], '5/12')] },
      { title: 'Gradient of the tangent', why: 'The tangent is perpendicular to the radius. Flip the fraction and change its sign.', lines: [line([part('5/12', 3)], '−12/5')] },
      { title: 'Put in the point', why: 'The tangent goes through the point, so its x and y fit y equals mx add c.', lines: [line([part('5'), sign('='), part('−12/5 × 12'), sign('+'), part('c')], '5 = −144/5 + c')] },
      { title: 'Find c', why: 'Add the fraction to both sides. Five is twenty-five fifths.', lines: [line([part('25/5'), sign('+'), part('144/5')], 'c = 169/5')] },
      { title: 'Write the equation', why: 'Put m and c into y equals mx add c.', lines: [line([part('y = mx + c')], 'y = −12/5x + 169/5', { answer: true })] },
    ],
  }, 'Equation')
q2.answerPrefix = 'y ='

practice(tangent, 'Find the equation of the tangent to x² + y² = 113 at the point (−8, −7).', 'Higher GR8 Your Turn Q3', choose([
  'y = −8/7x − 113/7', 'y = 7/8x − 113/7', 'y = −8/7x + 113/7', 'y = 8/7x − 9/7',
]), 'y = −8/7x − 113/7', 'The radius goes from (0, 0) to (−8, −7). Mind the negatives.', {
  kind: 'step-worked', start: 'x² + y² = 113 at (−8, −7)', steps: [
    { title: 'Gradient of the radius', why: 'Change in y over change in x, from the centre to the point. A negative over a negative is positive.', lines: [line([part('−7', 0), sign('÷'), part('−8', 1)], '7/8')] },
    { title: 'Gradient of the tangent', why: 'Perpendicular, so flip the fraction and change its sign.', lines: [line([part('7/8', 3)], '−8/7')] },
    { title: 'Put in the point', why: 'The tangent goes through the point. Minus times minus is plus.', lines: [line([part('−7'), sign('='), part('−8/7 × (−8)'), sign('+'), part('c')], '−7 = 64/7 + c')] },
    { title: 'Find c', why: 'Take the fraction from both sides. Minus seven is minus forty-nine sevenths.', lines: [line([part('−49/7'), sign('−'), part('64/7')], 'c = −113/7')] },
    { title: 'Write the equation', why: 'Put m and c into y equals mx add c.', words: 'y = −8/7x − 113/7' },
  ],
})

const radiusGradient = practice(tangent, 'The point (6, 8) is on the circle x² + y² = 100. What is the gradient of the radius to (6, 8)?', 'Higher GR8 extra practice', gradient(4 / 3, '4/3'), '4/3', 'From (0, 0) to (6, 8): change in y over change in x.', {
  kind: 'step-worked', start: '(0, 0) to (6, 8)', steps: [
    { title: 'Change in y', why: 'From the centre up to the point.', lines: [line([part('8', 0), sign('−'), part('0', 0)], 8)] },
    { title: 'Change in x', why: 'From the centre across to the point.', lines: [line([part('6', 1), sign('−'), part('0', 1)], 6)] },
    { title: 'Divide and simplify', why: 'Change in y over change in x, then cancel by two.', lines: [line([part('8', 0), sign('÷'), part('6', 1)], '4/3', { answer: true })] },
  ],
})
radiusGradient.answerPrefix = 'Gradient ='

const tangentGradient = practice(tangent, 'The radius to a point on a circle has gradient 4/3. What is the gradient of the tangent at that point?', 'Higher GR8 extra practice', gradient(-3 / 4, '−3/4'), '−3/4', 'The tangent is perpendicular to the radius.', {
  kind: 'step-worked', start: 'radius gradient 4/3', steps: [
    { title: 'Flip and change sign', why: 'Perpendicular gradients multiply to make minus one. Turn the fraction upside down and change its sign.', lines: [line([part('4/3', 3)], '−3/4', { answer: true })] },
  ],
})
tangentGradient.answerPrefix = 'Gradient ='

const whole = practice(tangent, 'Find the equation of the tangent to x² + y² = 5 at the point (2, 1).', 'Higher GR8 extra practice', lineAnswer('-2*x+5', 'y = −2x + 5'), 'y = −2x + 5', 'Gradient of the radius, then flip it and change its sign.', {
  kind: 'step-worked', start: 'x² + y² = 5 at (2, 1)', steps: [
    { title: 'Gradient of the radius', why: 'From the centre to the point: change in y over change in x.', lines: [line([part('1', 0), sign('÷'), part('2', 1)], '1/2')] },
    { title: 'Gradient of the tangent', why: 'Flip the fraction and change its sign. A half flipped is two.', lines: [line([part('1/2', 3)], '−2')] },
    { title: 'Put in the point', why: 'The tangent goes through the point, so its x and y fit the equation.', lines: [line([part('1'), sign('='), part('−2 × 2'), sign('+'), part('c')], '1 = −4 + c')] },
    { title: 'Find c', why: 'Add four to both sides.', lines: [line([part('1'), sign('+'), part('4')], 5)] },
    { title: 'Write the equation', why: 'Put m and c into y equals mx add c.', lines: [line([part('y = mx + c')], 'y = −2x + 5', { answer: true })] },
  ],
}, 'Equation')
whole.answerPrefix = 'y ='

add('mixed', 'Circle graphs and tangents', 'Higher GR8 consolidation', text(
  'x² + y² = r² is a circle with centre (0, 0) and radius r. Square root the number on the right for the radius.',
  'A point is on the circle when its x squared add its y squared makes r².',
  'The tangent at a point is perpendicular to the radius there: find the radius’s gradient, flip it and change its sign.',
  'Then put the point into y = mx + c to find c.',
))

export const tutorCircleGraphsLesson: TutorMethodLesson = {
  id: 'L104H', number: 104.5, title: 'Circle graphs and tangents', level: 'GCSE Higher', graphCard: true,
  goal: 'Read a circle’s radius from x² + y² = r², write its equation, and find the equation of a tangent to it.',
  labels: { [equation]: 'The equation of a circle', [tangent]: 'The tangent to a circle', mixed: 'Review' },
  states: finish(),
}
