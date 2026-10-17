/*
 * Lesson 6H, Turning points (Higher only, after lesson 106). From the Higher revision guide, GR7 Turning Points of
 * Quadratic Graphs (p121) and its Your Turn (p122): the turning point is where the graph turns around, a minimum for
 * +x² and a maximum for −x², on the line of symmetry halfway between the roots.
 * - Method 1, through factorising (Level 6-7): y = x² − 3x + 2 = (x − 1)(x − 2), halfway between the roots is 1.5, and
 *   y there is −0.25, so (1.5, −0.25). Your Turn Q1.
 * - Method 2, completing the square (Level 8-9): y = x² + 4x − 12 = (x + 2)² − 16, smallest when the bracket is 0, so
 *   (−2, −16). Your Turn Q2 to Q4. Completing the square itself is taught in 9H2; here it is used.
 * Both methods are drawn on a grid as worked examples: the roots, the dashed line of symmetry, then the curve and its
 * turning point. Turning points are typed as coordinates, decimals allowed: −2.5, −0.25.
 */
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { line, part, sign, type StepWorking, type WorkedStep } from '../../written-methods/tutor/stepWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { latex } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, mark, pt, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'
import { at } from '../../curve-graphs/tutor/curveWorkings'
import { choose, number, screens, text } from './helpers'

const a = author(106.5, 'L106H')
const { add, finish } = a
const { practice, graph } = screens(a)

const factorising = 'turning-points-factorising'
const square = 'turning-points-completing-square'

const show = (n: number) => String(n).replace('-', '−')
const point = (x: number, y: number) => `(${show(x)}, ${show(y)})`
const turning = (x: number, y: number) => at(pt(x, y))
/** "x = ☐ or x = ☐", in either order. */
const twoRoots = (r1: number, r2: number): InteractionDefinition => ({
  type: 'numericInput', responseShape: 'roots', acceptanceRule: 'unorderedSet', correctAnswer: `${r1}, ${r2}`, displayAnswer: `x = ${show(r1)} or x = ${show(r2)}`,
})

/* ---------- Drawing a turning point on a grid ---------- */

/** Moves: the roots on the x axis. */
const rootsMove = (roots: [number, number], say: string): GraphMove => ({
  title: 'Mark the roots', say, equation: latex(`x = ${show(roots[0])},\\ x = ${show(roots[1])}`), adds: 'picture',
  change: (frame, step) => ({
    ...frame, marks: roots.map(r => mark('x', r)),
    points: [...(frame.points ?? []), ...roots.map((r, i) => ({ ...pt(r, 0), at: step, label: `(${show(r)}, 0)`, place: { dx: i ? 1 : -1, dy: -1 } }))],
  }),
})
/** Moves: the dashed line of symmetry, x = k, with its sum under the grid. */
const symmetryMove = (k: number, sum: string, title: string, say: string): GraphMove => ({
  title, say, equation: latex(sum), adds: 'picture',
  change: (frame, step) => ({
    ...frame, marks: [mark('x', k)],
    lines: [...(frame.lines ?? []), { from: pt(k, 0), to: pt(k, 1), label: `x = ${show(k)}`, dashed: true, at: step }],
    working: [...(frame.working ?? []), { text: sum, family: 1, at: step }],
  }),
})
/** Moves: a line of working under the grid. */
const write = (title: string, say: string, sum: string, family = 0): GraphMove => ({
  title, say, equation: latex(sum), adds: 'lines',
  change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), { text: sum, family, at: step }] }),
})
/** Moves: the answer, the curve through its turning point, ringed. */
const curveMove = (coeffs: number[], from: number, to: number, tp: [number, number], say: string): GraphMove => answerMove(point(...tp), 'The turning point', say, [], {
  title: '', say: '', equation: '', adds: 'answer',
  change: (frame, step) => ({
    ...frame, boxed: [pt(...tp)], marks: [mark('x', tp[0]), mark('y', tp[1])],
    curves: [{ coeffs, from, to, at: step }],
    points: [...(frame.points ?? []), { ...pt(...tp), at: step, answer: true, label: point(...tp), place: { dx: 1, dy: 1 } }],
  }),
})
const empty = (x: [number, number], y: [number, number], extra: Partial<GraphGrid> = {}): GraphGrid => ({ x, y, lines: [], points: [], ...extra })

/* ---------- Section 1: through factorising (Method 1, Level 6-7) ---------- */

add(factorising, 'Turning points', 'Higher GR7 What is the Turning Point?', text(
  'The turning point of a graph is where it turns around.',
  'With a positive x², the graph is a U and the turning point is its lowest point: a minimum. With a negative x², it is a ∩ and the turning point is a maximum.',
  'A quadratic graph is symmetrical. Its line of symmetry goes through the turning point, exactly halfway between the roots.',
  'So: factorise to find the roots, go halfway between them for x, then put that x into the equation for y.',
))

graph(factorising, 'Use the symmetry of the graph to find the turning point of y = x² − 3x + 2.', 'Higher GR7 Method 1: Through Factorising', 'y = x² − 3x + 2',
  empty([-2, 4], [-1, 4]), [
    write('Factorise', 'Set y to 0 and factorise. Each bracket gives a root.', '(x − 1)(x − 2) = 0'),
    rootsMove([1, 2], 'Each bracket is 0 at one root, so the curve crosses the x axis at 1 and 2.'),
    symmetryMove(1.5, '(1 + 2) ÷ 2 = 1.5', 'Halfway between', 'Add the roots and halve. The line of symmetry, and the turning point, are halfway between them.'),
    write('Put x in', 'Put x = 1.5 into the equation to find the y coordinate.', '1.5² − 3 × 1.5 + 2 = −0.25'),
    curveMove([2, -3, 1], -0.5, 3.5, [1.5, -0.25], 'Positive x², so it is a U and the turning point is a minimum, at (1.5, −0.25). The graph agrees: it dips just below the x axis.'),
  ], 'Find it', 'Find the turning point',
  'Factorise for the roots, go halfway between them, then put that x into the equation.')

/** Factorise, the roots, halfway between them, then y there: the turning point. */
function factorWorking(start: string, brackets: string, roots: [number, number], put: string, terms: [string, string, string], tp: [number, number], shape?: string): StepWorking {
  const [r1, r2] = roots, total = r1 + r2
  const steps: WorkedStep[] = [
    { title: 'Find the roots', why: 'Set y to zero and factorise. Each bracket is zero at one root.', lines: [line([part(`${brackets} = 0`, 0)], `x = ${show(r1)} or x = ${show(r2)}`)] },
    { title: 'Halfway between', why: 'The turning point is on the line of symmetry, halfway between the roots. Add them and halve.', lines: [
      line([part(show(r1), 1), sign('+'), part(r2 < 0 ? `(${show(r2)})` : show(r2), 1)], show(total)),
      line([part(show(total)), sign('÷'), part('2')], show(tp[0])),
    ] },
    { title: 'Put x in', why: 'Put that x into the equation to find the y coordinate.', lines: [
      line([part(put)], terms.map((t, i) => i ? (t.startsWith('−') ? ` − ${t.slice(1)}` : ` + ${t}`) : t).join(''), { eq: true }),
      line(terms.flatMap((t, i) => i ? [sign(t.startsWith('−') ? '−' : '+'), part(t.replace('−', ''))] : [part(t)]), show(tp[1])),
    ] },
    { title: shape ? 'Maximum or minimum' : 'The turning point', why: shape ?? 'x first, then y.', lines: [line([part(start)], point(...tp), { answer: true })] },
  ]
  return { kind: 'step-worked', start, steps }
}

practice(factorising, 'Sketch the graph of y = x² + 5x + 6. Where does it cross the x axis?', 'Higher GR7 Your Turn Q1', twoRoots(-2, -3), 'x = −2 or x = −3', 'Set y to 0 and factorise.', {
  kind: 'step-worked', start: 'y = x² + 5x + 6', steps: [
    { title: 'Factorise', why: 'Two numbers that multiply to the last number and add to the middle one.', lines: [line([part('x² + 5x + 6', 0)], '(x + 2)(x + 3)', { eq: true })] },
    { title: 'Each bracket is 0', why: 'Each bracket gives one root, with its sign flipped.', lines: [line([part('(x + 2)(x + 3) = 0')], 'x = −2 or x = −3', { answer: true })] },
  ],
})
practice(factorising, 'y = x² + 5x + 6 has roots −2 and −3. Find the coordinates of its turning point.', 'Higher GR7 Your Turn Q1', turning(-2.5, -0.25), '(−2.5, −0.25)',
  'Halfway between −2 and −3, then put that x in.',
  factorWorking('y = x² + 5x + 6', '(x + 2)(x + 3)', [-2, -3], '(−2.5)² + 5 × (−2.5) + 6', ['6.25', '−12.5', '6'], [-2.5, -0.25]), 'Turning point')
graph(factorising, 'Sketch y = x² + 5x + 6, marking the roots and the turning point.', 'Higher GR7 Your Turn Q1', 'y = x² + 5x + 6',
  empty([-5, 1], [-1, 6]), [
    rootsMove([-3, -2], 'From the factorised form, the curve crosses the x axis at −3 and −2.'),
    write('Where it crosses y', 'Where x is 0, y is the last number, so the curve crosses the y axis at 6.', '(0, 6)', 0),
    symmetryMove(-2.5, '(−2 + −3) ÷ 2 = −2.5', 'Halfway between', 'The line of symmetry is halfway between the roots.'),
    curveMove([6, 5, 1], -5, 0.5, [-2.5, -0.25], 'A U through the roots and (0, 6), lowest at the turning point (−2.5, −0.25), just below the x axis.'),
  ], 'Sketch it', 'Sketch the graph')

practice(factorising, 'Find the turning point of y = x² − 6x + 8.', 'Higher GR7 extra practice', turning(3, -1), '(3, −1)', 'Factorise first: (x − 2)(x − 4).',
  factorWorking('y = x² − 6x + 8', '(x − 2)(x − 4)', [2, 4], '3² − 6 × 3 + 8', ['9', '−18', '8'], [3, -1]), 'Turning point')
practice(factorising, 'Find the turning point of y = x² + 2x − 8.', 'Higher GR7 extra practice', turning(-1, -9), '(−1, −9)', 'Factorise first: (x − 2)(x + 4).',
  factorWorking('y = x² + 2x − 8', '(x − 2)(x + 4)', [2, -4], '(−1)² + 2 × (−1) − 8', ['1', '−2', '−8'], [-1, -9]), 'Turning point')
practice(factorising, 'y = −x² + 2x + 3 = −(x − 3)(x + 1). Find its turning point.', 'Higher GR7 extra practice', turning(1, 4), '(1, 4)', 'Halfway between the roots, then put x in. Mind the minus in front of x².',
  factorWorking('y = −x² + 2x + 3', '−(x − 3)(x + 1)', [3, -1], '−1² + 2 × 1 + 3', ['−1', '2', '3'], [1, 4], 'Negative x squared, so the graph is upside down and this is a maximum.'), 'Turning point')
practice(factorising, 'Is the turning point of y = −x² + 2x + 3 a maximum or a minimum?', 'Higher GR7 What is the Turning Point? (concept)', choose([
  'A maximum: the x² is negative, so the graph is a ∩',
  'A minimum: the x² is negative, so the graph is a U',
  'A minimum: the last number is positive',
  'A maximum: the x number is positive',
]), 'A maximum: the x² is negative, so the graph is a ∩', 'Look at the sign in front of x².', {
  kind: 'step-worked', start: 'y = −x² + 2x + 3', steps: [
    { title: 'Sign of x²', why: 'Only the sign in front of x squared decides the shape.', lines: [line([part('−x²', 0)], 'negative')] },
    { title: 'Pick the shape', why: 'A negative x squared turns the U upside down, so the turning point is the top.', words: 'A maximum: the x² is negative, so the graph is a ∩' },
  ],
})
practice(factorising, 'A quadratic graph crosses the x axis at −1 and 5. What is the x coordinate of its turning point?', 'Higher GR7 extra practice', { ...number(2, '2'), signed: true }, '2', 'The turning point is halfway between the roots.', {
  kind: 'step-worked', start: 'roots −1 and 5', steps: [
    { title: 'Halfway between', why: 'The line of symmetry is halfway between the roots. Add them and halve.', lines: [line([part('−1', 1), sign('+'), part('5', 1)], '4'), line([part('4'), sign('÷'), part('2')], '2', { answer: true })] },
  ],
}, 'x coordinate')

/* ---------- Section 2: completing the square (Method 2, Level 8-9) ---------- */

add(square, 'Turning points by completing the square', 'Higher GR7 Method 2: Completing the Square', text(
  'Complete the square, as in lesson 9H2: y = x² + 4x − 12 = (x + 2)² − 16.',
  'A square is never negative, so (x + 2)² is smallest when it is 0. Then y is −16, the minimum value.',
  'The bracket is 0 when x = −2: the bracket’s number with its sign flipped. So the turning point is (−2, −16).',
  'This works even when the graph has no roots. With −x², the squared bracket is taken away, so you get a maximum.',
))

graph(square, 'Use completing the square to find the turning point of y = x² + 4x − 12.', 'Higher GR7 Method 2: Completing the Square', 'y = x² + 4x − 12',
  empty([-7, 3], [-18, 4], { yStep: 2 }), [
    write('Complete the square', 'Halve 4 for the bracket. (x + 2)² makes an extra 4, so take 4 more away from the −12.', 'y = (x + 2)² − 16'),
    symmetryMove(-2, 'x + 2 = 0, x = −2', 'Make the bracket 0', 'A square is never negative, so y is smallest when the bracket is 0. That happens when x = −2: the line of symmetry.'),
    write('The minimum value', 'With the bracket 0, all that is left is −16. That is the lowest y the graph reaches.', 'y = 0 − 16 = −16'),
    curveMove([-12, 4, 1], -7, 3, [-2, -16], 'Positive x², so this is a minimum point: the bottom of the U, at (−2, −16).'),
  ], 'Find it', 'Find the turning point',
  'Complete the square, make the bracket 0 for x, and what is left is y.')

/** x² + bx + c (b and the numbers as given): halve, square, take away, then read the point. */
function squareWorking(start: string, b: string, half: string, bracket: string, expanded: string, c: string, extra: string, e: string, form: string, tp: [number, number]): StepWorking {
  return {
    kind: 'step-worked', start, steps: [
      { title: 'Halve the x number', why: 'Half the number in front of x goes in the bracket with x.', lines: [line([part(b, 0), sign('÷'), part('2')], half)] },
      { title: 'Square the half', why: 'Squaring the bracket makes an extra number on the end.', lines: [line([part(bracket, 0)], expanded, { eq: true })] },
      { title: 'Take it away', why: 'Take the extra number away, and keep the number that was on the end.', lines: [line([part(c, 1), sign('−'), part(extra, 0)], e), line([part(start.replace('y = ', ''))], form.replace('y = ', ''), { eq: true })] },
      { title: 'Read the point', why: 'The bracket is zero when x is its number with the sign flipped. Then y is the number left over.', lines: [line([part(form)], point(...tp), { answer: true })] },
    ],
  }
}

practice(square, 'Use completing the square to find the coordinates of the turning point of y = x² − 3x + 11.', 'Higher GR7 Your Turn Q2', turning(1.5, 8.75), '(1.5, 8.75)',
  'Half of −3 is −1.5, so the bracket is (x − 1.5)².',
  squareWorking('y = x² − 3x + 11', '−3', '−1.5', '(x − 1.5)²', 'x² − 3x + 2.25', '11', '2.25', '8.75', 'y = (x − 1.5)² + 8.75', [1.5, 8.75]), 'Turning point')
practice(square, 'Use completing the square to find the coordinates of the turning point of y = −x² + 10x − 3.', 'Higher GR7 Your Turn Q3', turning(5, 22), '(5, 22)',
  'Take −1 out of the first two terms: −(x² − 10x) − 3.', {
    kind: 'step-worked', start: 'y = −x² + 10x − 3', steps: [
      { title: 'Take out −1', why: 'Take minus one out of the first two terms. The number on the end stays outside.', lines: [line([part('−x² + 10x', 0)], '−(x² − 10x)', { eq: true })] },
      { title: 'Halve the x number', why: 'Half the number in front of x, inside the bracket, goes in the new bracket.', lines: [line([part('−10', 0), sign('÷'), part('2')], '−5')] },
      { title: 'Square the half', why: 'Squaring the bracket makes an extra number. Inside the minus bracket, taking it away outside becomes adding it.', lines: [
        line([part('(x − 5)²', 0)], 'x² − 10x + 25', { eq: true }),
        line([part('−(x² − 10x)')], '−(x − 5)² + 25', { eq: true }),
      ] },
      { title: 'Add the end number', why: 'Put the number on the end back with it.', lines: [line([part('25', 0), sign('−'), part('3', 1)], '22'), line([part('y')], '−(x − 5)² + 22', { eq: true })] },
      { title: 'Read the maximum', why: 'The squared bracket is taken away, so y is biggest when the bracket is zero. That is a maximum.', lines: [line([part('y = −(x − 5)² + 22')], '(5, 22)', { answer: true })] },
    ],
  }, 'Turning point')
practice(square, 'Complete the square to find the coordinates of the turning point of y = 2x² + 20x + 14.', 'Higher GR7 Your Turn Q4', turning(-5, -36), '(−5, −36)',
  'Take 2 out of the first two terms: 2(x² + 10x) + 14.', {
    kind: 'step-worked', start: 'y = 2x² + 20x + 14', steps: [
      { title: 'Take out 2', why: 'Take the number in front of x squared out of the first two terms.', lines: [line([part('2x² + 20x', 0)], '2(x² + 10x)', { eq: true })] },
      { title: 'Halve the x number', why: 'Half the number in front of x, inside the bracket, goes in the new bracket.', lines: [line([part('10', 1), sign('÷'), part('2')], '5')] },
      { title: 'Take the extra away', why: 'The half squared is inside the bracket, so times it by the number outside before taking it away.', lines: [
        line([part('2', 0), sign('×'), part('5'), sign('×'), part('5')], '50'),
        line([part('14'), sign('−'), part('50')], '−36'),
        line([part('y')], '2(x + 5)² − 36', { eq: true }),
      ] },
      { title: 'Read the point', why: 'The bracket is zero when x is its number with the sign flipped. Then y is the number left over.', lines: [line([part('y = 2(x + 5)² − 36')], '(−5, −36)', { answer: true })] },
    ],
  }, 'Turning point')

practice(square, 'Find the turning point of y = x² − 8x + 10.', 'Higher GR7 extra practice', turning(4, -6), '(4, −6)', 'Half of −8 is −4.',
  squareWorking('y = x² − 8x + 10', '−8', '−4', '(x − 4)²', 'x² − 8x + 16', '10', '16', '−6', 'y = (x − 4)² − 6', [4, -6]), 'Turning point')
practice(square, 'Find the turning point of y = x² + 6x + 13.', 'Higher GR7 extra practice', turning(-3, 4), '(−3, 4)', 'Half of 6 is 3. This graph never crosses the x axis, but it still has a turning point.',
  squareWorking('y = x² + 6x + 13', '6', '3', '(x + 3)²', 'x² + 6x + 9', '13', '9', '4', 'y = (x + 3)² + 4', [-3, 4]), 'Turning point')
practice(square, 'Find the maximum point of y = −x² − 4x + 1.', 'Higher GR7 extra practice', turning(-2, 5), '(−2, 5)', 'Take −1 out of the first two terms: −(x² + 4x) + 1.', {
  kind: 'step-worked', start: 'y = −x² − 4x + 1', steps: [
    { title: 'Take out −1', why: 'Take minus one out of the first two terms. The number on the end stays outside.', lines: [line([part('−x² − 4x', 0)], '−(x² + 4x)', { eq: true })] },
    { title: 'Halve the x number', why: 'Half the number in front of x, inside the bracket, goes in the new bracket.', lines: [line([part('4', 1), sign('÷'), part('2')], '2')] },
    { title: 'Square the half', why: 'Squaring the bracket makes an extra number. Inside the minus bracket, taking it away outside becomes adding it.', lines: [
      line([part('(x + 2)²', 0)], 'x² + 4x + 4', { eq: true }),
      line([part('4', 0), sign('+'), part('1', 1)], '5'),
      line([part('y')], '−(x + 2)² + 5', { eq: true }),
    ] },
    { title: 'Read the maximum', why: 'The squared bracket is taken away, so y is biggest when the bracket is zero.', lines: [line([part('y = −(x + 2)² + 5')], '(−2, 5)', { answer: true })] },
  ],
}, 'Turning point')
practice(square, 'Describe the turning point of y = 5 − (x − 1)².', 'Higher GR7 extra practice', choose([
  'A maximum at (1, 5)', 'A minimum at (1, 5)', 'A maximum at (−1, 5)', 'A minimum at (−1, 5)',
]), 'A maximum at (1, 5)', 'Is the squared bracket added or taken away?', {
  kind: 'step-worked', start: 'y = 5 − (x − 1)²', steps: [
    { title: 'Make the bracket 0', why: 'The bracket is zero when x is its number with the sign flipped. Then y is the number left.', lines: [line([part('x − 1 = 0', 0)], 'x = 1'), line([part('5'), sign('−'), part('0')], '5')] },
    { title: 'Maximum or minimum', why: 'The squared bracket is taken away, so anything else makes y smaller. That is a maximum.', words: 'A maximum at (1, 5)' },
  ],
})

add('mixed', 'Turning points', 'Higher GR7 consolidation', text(
  'The turning point is where a graph turns around: a minimum for +x² (a U), a maximum for −x² (a ∩).',
  'Through factorising: the roots, then halfway between them for x, then put x in for y.',
  'By completing the square: y = (x + d)² + e has its turning point at (−d, e).',
  'With a number in front of x², take it out first. With a minus in front, the point is a maximum.',
))

export const tutorTurningPointsLesson: TutorMethodLesson = {
  id: 'L106H', number: 106.5, title: 'Turning points', level: 'GCSE Higher', graphCard: true,
  goal: 'Find the turning point of a quadratic graph by factorising or by completing the square, and say whether it is a maximum or a minimum.',
  labels: { [factorising]: 'Through factorising', [square]: 'Completing the square', mixed: 'Review' },
  states: finish(),
}
