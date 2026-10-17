/*
 * Lesson 104 (Parallel lines), a Higher section. From the Higher revision guide, GR5 Perpendicular Lines (Level 6-7,
 * p114–116): perpendicular lines meet at right angles, and their gradients multiply to −1, so a perpendicular line's
 * gradient is −1/m, the negative reciprocal (flip it and change the sign). The book's examples: y = 3x − 1 and
 * y = −⅓x + 5, drawn on a grid (3 × −⅓ = −1); and x + 4y = 8 against y = 4x − 13, made y = mx + c first. Your Turn
 * Q3 and Q5 (a perpendicular line through a point), and Q4 (a parallel line through a point, as the Foundation lesson
 * does: one question). Q5 also says "plot the line", so a worked example draws y = ⅓x + 1 on the book's grid.
 * Line equations are typed after "y =" and checked as a formula, as in the Foundation lesson (parallelLinesLesson.ts).
 */
import { author } from '../../written-methods/tutor/content'
import { line, part, sign, type StepWorking } from '../../written-methods/tutor/stepWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { latex } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, gradient, leg, mark, plot, pt, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'
import { ends, line as straight, named, type Line } from '../../parallel-lines/tutor/parallelWorkings'
import { choose, screens, text, type HigherAddition } from './helpers'

const perpendicular = 'perpendicular-lines'
const a = author(104, 'L104-H')
const { add } = a
const { worked, graph, practice, onGrid } = screens(a)

/** A line typed after "y =", any way of writing it ("−7/3x + 23/3", "23/3 − 7x/3"); `typed` is its formula. */
const typedLine = (typed: string, shown: string): InteractionDefinition => ({ type: 'numericInput', responseShape: 'formula', acceptanceRule: 'formula', correctAnswer: typed, displayAnswer: shown })
const drawn = (l: Line, at: number, extra: { answer?: boolean; label?: string } = {}) => ({ from: ends(l)[0], to: ends(l)[1], at, ...extra })

add(perpendicular, 'Perpendicular lines', 'Higher GR5 Perpendicular Lines - Right Angles', text(
  'Perpendicular lines meet at right angles.',
  'Multiply their gradients and you always get −1.',
  'So a line perpendicular to one with gradient m has gradient −1/m: flip the fraction and change the sign. This is the negative reciprocal.',
  'A gradient of 3 becomes −⅓, and −⅔ becomes 3/2.',
))

/* ---------- The book's examples ---------- */

{
  const first = straight(3, -1), second = straight(-1, 5, 3)
  const moves: GraphMove[] = [
    { title: 'First line', say: 'y = 3x − 1 is already y = mx + c, so its gradient is the number in front of x.', equation: latex('m = 3'), adds: 'picture',
      change: (frame, step) => ({ ...frame, lines: [drawn(first, step, { label: named(first) })], marks: [mark('y', -1)], working: [{ text: 'y = 3x − 1: m = 3', family: 3, at: step }] }) },
    { title: 'Second line', say: 'Its gradient is the number in front of x too. It goes down gently where the first goes up steeply.', equation: latex('m = -\\tfrac13'), adds: 'picture',
      change: (frame, step) => ({ ...frame, lines: [...(frame.lines ?? []), drawn(second, step, { label: named(second) })], marks: [mark('y', 5)], working: [...(frame.working ?? []), { text: 'y = −⅓x + 5: m = −⅓', family: 3, at: step }] }) },
    answerMove('3 × (−⅓) = −1, so they are perpendicular', 'Multiply the gradients', 'The gradients multiply to −1, so the lines meet at right angles.', [0, 1]),
  ]
  graph(perpendicular, 'Are y = 3x − 1 and y = −⅓x + 5 perpendicular?', 'Higher GR5 Perpendicular Lines Example', 'y = 3x − 1 and y = −⅓x + 5',
    { x: [-2, 6], y: [-2, 7], lines: [], points: [] }, moves, 'Multiply the gradients', 'Are they perpendicular?',
    'Read each gradient, then multiply them. If the answer is −1, the lines are perpendicular.')
}

worked(perpendicular, 'Is the line x + 4y = 8 perpendicular to the line y = 4x − 13?', 'Higher GR5 Example: Perpendicular Lines', {
  kind: 'step-worked', start: 'x + 4y = 8 and y = 4x − 13', steps: [
    { title: 'Make y the subject', why: 'The second line is already in the usual form. Take x from both sides of the first, then divide by four.', lines: [
      line([part('x + 4y = 8')], '4y = −x + 8'),
      line([part('4y = −x + 8')], 'y = −¼x + 2'),
    ] },
    { title: 'Read the gradients', why: 'Each gradient is the number in front of x.', lines: [line([part('m', 3)], '−¼ and 4', { eq: true })] },
    { title: 'Multiply them', why: 'Their product is minus one, so the lines are perpendicular.', lines: [line([part('4'), sign('×'), part('(−1/4)')], '−1')], words: 'Yes, they are perpendicular' },
  ],
}, 'Get both lines into y = mx + c, then multiply the gradients.')

/* ---------- The negative reciprocal ---------- */

/** Flip the gradient, change its sign, and check the two multiply to −1. */
function flip(m: string, flipped: string, answer: string, check: [string, string]): StepWorking {
  return { kind: 'step-worked', start: `m = ${m}`, steps: [
    { title: 'Flip it', why: 'Turn the fraction upside down. A whole number is over one.', lines: [line([part(m, 3)], flipped)] },
    { title: 'Change the sign', why: 'A perpendicular gradient has the opposite sign. The two gradients multiply to minus one.', lines: [
      line([part(check[0]), sign('×'), part(check[1])], '−1'),
      line([part(flipped, 3)], answer, { answer: true }),
    ] },
  ] }
}

const half = practice(perpendicular, 'Write down the gradient of a line perpendicular to y = 2x + 3.', 'Higher GR5 extra practice', gradient(-0.5, '−½'), '−½',
  'Flip 2 and change its sign.', flip('2', '½', '−½', ['2', '(−1/2)']))
half.answerPrefix = 'Gradient ='
const twoThirds = practice(perpendicular, 'A line has gradient −⅔. What is the gradient of a line perpendicular to it?', 'Higher GR5 extra practice', gradient(1.5, '3/2'), '3/2',
  'Flip −⅔ and change its sign: the answer is positive.', flip('−⅔', '−3/2', '3/2', ['(−2/3)', '3/2']))
twoThirds.answerPrefix = 'Gradient ='

practice(perpendicular, 'Which line is perpendicular to y = −5x + 1?', 'Higher GR5 extra practice', choose(['y = ⅕x − 2', 'y = 5x + 1', 'y = −⅕x + 3', 'y = −5x − 2']), 'y = ⅕x − 2',
  'Flip −5 and change its sign. c can be anything.', {
    kind: 'step-worked', start: 'y = −5x + 1', steps: [
      { title: 'Its gradient', why: 'The number in front of x.', lines: [line([part('m', 3)], '−5', { eq: true })] },
      { title: 'Negative reciprocal', why: 'Flip it and change the sign. The two gradients multiply to minus one.', lines: [line([part('−5'), sign('×'), part('1/5')], '−1')] },
      { title: 'Pick the line', why: 'Only one choice has that gradient. Where it crosses the y axis doesn’t matter.', words: 'y = ⅕x − 2' },
    ],
  })

/* ---------- Is it perpendicular? ---------- */

practice(perpendicular, 'Is y = ½x + 3 perpendicular to 2y + 4x = 7?', 'Higher GR5 extra practice',
  choose(['Yes: the gradients multiply to −1', 'No: the gradients are different', 'No: the gradients multiply to −2']), 'Yes: the gradients multiply to −1',
  'Make y the subject of 2y + 4x = 7 first.', {
    kind: 'step-worked', start: 'y = ½x + 3 and 2y + 4x = 7', steps: [
      { title: 'Make y the subject', why: 'Take the x term from both sides, then halve every term.', lines: [line([part('2y + 4x = 7')], '2y = −4x + 7'), line([part('2y = −4x + 7')], 'y = −2x + 3.5')] },
      { title: 'Multiply the gradients', why: 'Perpendicular lines have gradients that multiply to minus one.', lines: [line([part('1/2'), sign('×'), part('(−2)')], '−1')], words: 'Yes: the gradients multiply to −1' },
    ],
  })

practice(perpendicular, 'Is y = 3x + 2 perpendicular to y = −3x + 1?', 'Higher GR5 extra practice',
  choose(['No: the gradients multiply to −9', 'Yes: the gradients have opposite signs', 'Yes: the gradients multiply to −1', 'No: they are parallel']), 'No: the gradients multiply to −9',
  'Opposite signs isn’t enough. Multiply the gradients.', {
    kind: 'step-worked', start: 'y = 3x + 2 and y = −3x + 1', steps: [
      { title: 'Read the gradients', why: 'Both lines are already in the usual form, so each gradient is the number in front of x.', lines: [line([part('m', 3)], '3 and −3', { eq: true })] },
      { title: 'Multiply them', why: 'The product isn’t minus one, so they are not perpendicular. A perpendicular gradient is flipped too, not just given the other sign.', lines: [line([part('3'), sign('×'), part('(−3)')], '−9')], words: 'No: the gradients multiply to −9' },
    ],
  })

/* ---------- A line through a point ---------- */

/** Perpendicular (or parallel) gradient, then the point put into y = mx + c to find c, then the line. */
function through(start: string, gradientStep: StepWorking['steps'][number], sub: string, cLines: ReturnType<typeof line>[], answer: string): StepWorking {
  return { kind: 'step-worked', start, steps: [
    gradientStep,
    { title: 'Put the point in', why: 'The new line goes through the point, so its x and y fit the equation.', lines: [line([part(sub)], undefined)] },
    { title: 'Solve for c', why: 'Work out the multiplication, then take it from both sides.', lines: cLines },
    { title: 'The new line', why: 'Put m and c back into the equation of a straight line.', lines: [line([part('y = mx + c')], answer, { answer: true })] },
  ] }
}

const q3 = practice(perpendicular, 'Find the equation of the line that is perpendicular to y = 3/7x + 9 and passes through the point (5, −4).', 'Higher GR5 Your Turn Q3',
  typedLine('-7/3*x+23/3', 'y = −7/3x + 23/3'), 'y = −7/3x + 23/3', 'Flip 3/7 and change its sign. Then put x = 5 and y = −4 into y = mx + c.',
  through('y = 3/7x + 9 through (5, −4)',
    { title: 'Perpendicular gradient', why: 'Flip the gradient and change its sign. The two multiply to minus one.', lines: [line([part('3/7'), sign('×'), part('(−7/3)')], '−1'), line([part('m', 3)], '−7/3', { eq: true })] },
    '−4 = −7/3 × 5 + c',
    [line([part('−7/3'), sign('×'), part('5')], '−35/3'), line([part('−4'), sign('+'), part('35/3')], '23/3'), line([part('c', 0)], '23/3', { eq: true })],
    'y = −7/3x + 23/3'))
q3.answerPrefix = 'y ='

const q4 = practice(perpendicular, 'Find the equation of the straight line that passes through (1, 3) and is parallel to the line y = 5x − 1.', 'Higher GR5 Your Turn Q4',
  typedLine('5*x-2', 'y = 5x − 2'), 'y = 5x − 2', 'A parallel line has the same gradient. Then put x = 1 and y = 3 in.',
  through('y = 5x − 1 through (1, 3)',
    { title: 'Same gradient', why: 'Parallel lines have the same gradient.', lines: [line([part('m', 3)], '5', { eq: true })] },
    '3 = 5 × 1 + c',
    [line([part('5'), sign('×'), part('1')], '5'), line([part('3'), sign('−'), part('5')], '−2')],
    'y = 5x − 2'))
q4.answerPrefix = 'y ='

const q5 = practice(perpendicular, 'Find the equation of the straight line that passes through (−9, −2) and is perpendicular to y = −3x + 10.', 'Higher GR5 Your Turn Q5',
  typedLine('1/3*x+1', 'y = ⅓x + 1'), 'y = ⅓x + 1', 'Flip −3 and change its sign. Then put x = −9 and y = −2 in.',
  through('y = −3x + 10 through (−9, −2)',
    { title: 'Perpendicular gradient', why: 'Flip the gradient and change its sign. The two multiply to minus one.', lines: [line([part('−3'), sign('×'), part('1/3')], '−1'), line([part('m', 3)], '⅓', { eq: true })] },
    '−2 = ⅓ × (−9) + c',
    [line([part('1/3'), sign('×'), part('(−9)')], '−3'), line([part('−2'), sign('+'), part('3')], '1')],
    'y = ⅓x + 1'))
q5.answerPrefix = 'y ='

// Q5 goes on: plot the line, on the book's grid (x from −2 to 7, y from −1 to 4).
{
  const answer = straight(1, 1, 3), start: GraphGrid = { x: [-2, 7], y: [-1, 4], lines: [], points: [] }
  const moves: GraphMove[] = [
    plot([pt(0, 1)], 'Start at c', 'c is 1, so the line crosses the y axis at (0, 1).'),
    leg(pt(0, 1), pt(3, 1), 'across 3', 'Across 3', 'A gradient of one third is up 1 for every 3 across. Go across 3 first.'),
    leg(pt(3, 1), pt(3, 2), 'up 1', 'Up 1', 'Then up 1. That is the next point on the line.'),
    answerMove('y = ⅓x + 1', 'Draw the line', 'Join the points with a ruler and carry on to the edges of the grid. Another step across 3 and up 1 reaches (6, 3).', [], {
      title: '', say: '', equation: '', adds: 'answer',
      change: (frame, step) => ({ ...frame, points: [...(frame.points ?? []), { x: 3, y: 2, at: step }, { x: 6, y: 3, at: step }], lines: [drawn(answer, step, { answer: true, label: named(answer) })] }),
    }),
  ]
  graph(perpendicular, 'Plot the line y = ⅓x + 1.', 'Higher GR5 Your Turn Q5 (plot)', 'y = ⅓x + 1', start, moves, 'c, then the gradient', 'Plot y = ⅓x + 1',
    'Start where it crosses the y axis, then step the gradient: across 3, up 1.')
}

{
  const given = straight(2, -1), p = pt(4, 1)
  const start: GraphGrid = { x: [-1, 7], y: [-2, 6], lines: [drawn(given, -1, { label: named(given) })], points: [{ ...p, at: -1 }] }
  const find = onGrid(perpendicular, 'Find the equation of the line perpendicular to y = 2x − 1 that goes through (4, 1).', 'Higher GR5 extra practice', start,
    typedLine('-1/2*x+3', 'y = −½x + 3'), 'y = −½x + 3', 'The perpendicular gradient is −½. Put x = 4 and y = 1 into y = mx + c.',
    through('y = 2x − 1 through (4, 1)',
      { title: 'Perpendicular gradient', why: 'Flip the gradient and change its sign. The two multiply to minus one.', lines: [line([part('2'), sign('×'), part('(−1/2)')], '−1'), line([part('m', 3)], '−½', { eq: true })] },
      '1 = −½ × 4 + c',
      [line([part('−1/2'), sign('×'), part('4')], '−2'), line([part('1'), sign('+'), part('2')], '3')],
      'y = −½x + 3'))
  find.answerPrefix = 'y ='
}

export const perpendicularLines: HigherAddition = { lessonId: 'L104', skill: perpendicular, label: 'Perpendicular lines', states: a.finish() }
