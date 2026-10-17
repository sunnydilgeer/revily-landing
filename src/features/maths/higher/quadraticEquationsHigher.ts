/*
 * Lesson 22 (Solving quadratics), two Higher sections. From the Higher revision guide, A12:
 * - Solving through factorising, a > 1 (Level 6-7): make it 0, factorise with a number in front of x² (the trials from
 *   lesson 21's Higher section), then each bracket is 0, so a root can be a fraction (2x + 3 = 0 gives x = −3/2).
 * - Quadratic equations and sketching graphs (Level 8-9): the roots are where the curve crosses the x axis, the last
 *   number is where it crosses the y axis, and x² positive makes a U. The worked example draws the sketch on a grid.
 */
import { author } from '../../written-methods/tutor/content'
import { line, part, sign, type StepWorking, type WorkedStep } from '../../written-methods/tutor/stepWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { latex } from '../../inequalities/tutor/inequalityWorkings'
import { graphModel, mark, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'
import { choose, number, screens, text, type HigherAddition } from './helpers'
import { bracketText, bracketsText, factoriseSteps, quadText, type Brackets } from './quadraticsHigher'

const solving = 'quadratic-equations-number-in-front'
const sketching = 'quadratic-sketching'
const a = author(22, 'L22-H')
const { add } = a
const { worked, practice } = screens(a)

const gcd = (m: number, n: number): number => n ? gcd(n, m % n) : Math.abs(m)
/** The root of px + r = 0, as a whole number or a fraction in its simplest form: −3/2. */
function root(p: number, r: number): { text: string; typed: string } {
  const top = -r, d = gcd(top, p), n = top / d, bottom = p / d
  const typed = bottom === 1 ? String(n) : `${n}/${bottom}`
  return { text: typed.replace('-', '−'), typed }
}
const roots = (found: Brackets) => [root(found.p, found.r), root(found.q, found.s)]

/** "x = ☐ or x = ☐", in either order; a fraction can be typed as one (−3/2) or as a decimal. */
const twoRoots = (values: { typed: string }[], shown: string): InteractionDefinition => ({ type: 'numericInput', responseShape: 'roots', acceptanceRule: 'unorderedSet', correctAnswer: values.map(v => v.typed).join(', '), displayAnswer: shown })

/** Make it 0 (if it isn't), factorise with the trials, then set each bracket to 0. */
function solveWorking(qa: number, qb: number, qc: number, given?: string): { working: StepWorking; answer: string; values: { typed: string }[] } {
  const equation = `${quadText(qa, qb, qc)} = 0`
  const { steps, found } = factoriseSteps(qa, qb, qc)
  const [first, second] = roots(found)
  const answer = `x = ${first.text} or x = ${second.text}`
  const all: WorkedStep[] = []
  if (given) all.push({ title: 'Make it 0', why: 'Take everything to one side, so the other side is 0.', lines: [line([part(given, 0)], equation, { eq: true })] })
  all.push(...steps.map(step => ({ ...step, tag: 'factorise' })))
  all.push({ title: 'Each bracket is 0', why: 'Two things multiply to make 0 only if one of them is 0. Solve each bracket equal to 0.', lines: [
    line([part(`${bracketText(found.p, found.r)} = 0`, 1)], `x = ${first.text}`),
    line([part(`${bracketText(found.q, found.s)} = 0`, 2)], `x = ${second.text}`),
  ] })
  all.push({ title: 'Write both answers', why: 'A quadratic equation usually has two answers. A fraction is fine, as it is.', lines: [line([part(`${bracketsText(found)} = 0`)], answer, { answer: true })] })
  return { working: { kind: 'step-worked', start: given ?? equation, steps: all }, answer, values: [first, second] }
}
function solve(qa: number, qb: number, qc: number, sourceRef: string, hint: string, given?: string) {
  const { working, answer, values } = solveWorking(qa, qb, qc, given)
  return practice(solving, `Solve ${working.start}.`, sourceRef, twoRoots(values, answer), answer, hint, working)
}

/* ---------- Section 1: a number in front of x² ---------- */

const example = solveWorking(2, -3, -9)
worked(solving, `Solve ${example.working.start} by factorising.`, 'Higher A12 Solving through Factorising (a > 1)', example.working,
  'The same four steps as before: make it 0, factorise, set each bracket to 0, solve. With a number in front of x², an answer can be a fraction.')
solve(2, -7, 3, 'Higher A12 extra practice', 'Factorise into (2x …)(x …), then set each bracket to 0.')
solve(2, 5, -3, 'Higher A12 extra practice', 'One answer is a fraction.')
solve(3, -11, 6, 'Higher A12 extra practice', 'Factorise 3x² − 11x + 6 first.')
solve(2, 1, -6, 'Higher A12 extra practice', 'Make one side 0 first.', '2x² + x = 6')

/* ---------- Section 2: sketching from the roots (Level 8-9) ---------- */

add(sketching, 'Sketching a quadratic graph', 'Higher A12 Quadratic Equations and Sketching Graphs', text(
  'The roots of x² + bx + c = 0 are where the graph of y = x² + bx + c crosses the x axis, because y is 0 there.',
  'The last number, c, is where it crosses the y axis, because x is 0 there.',
  'With a plus x², the graph is a U. It is symmetrical, so its lowest point is halfway between the roots.',
  'A sketch doesn’t have to be perfect. It needs the right shape and the right points labelled.',
))

const start: GraphGrid = { x: [-2, 4], y: [-4, 5], lines: [], points: [] }
const moves: GraphMove[] = [
  { title: 'Factorise', say: 'Set y to 0 and factorise. The roots come from the brackets.', equation: latex('x^2 - 2x - 3 = (x - 3)(x + 1)'), adds: 'lines',
    change: (frame, step) => ({ ...frame, working: [{ text: '(x − 3)(x + 1) = 0', family: 0, at: step }] }) },
  { title: 'Roots on the x axis', say: 'Each bracket is 0 at one root, so the curve crosses the x axis at x = 3 and x = −1.', equation: latex('x = 3,\\ x = -1'), adds: 'picture',
    change: (frame, step) => ({ ...frame, marks: [mark('x', 3), mark('x', -1)], points: [...(frame.points ?? []), { x: 3, y: 0, label: '(3, 0)', at: step }, { x: -1, y: 0, label: '(−1, 0)', at: step, place: { dx: -1, dy: -1 } }] }) },
  { title: 'Where it crosses y', say: 'Where x is 0, y is the last number: −3. So the curve crosses the y axis at (0, −3).', equation: latex('y = -3'), adds: 'picture',
    change: (frame, step) => ({ ...frame, marks: [mark('y', -3)], points: [...(frame.points ?? []), { x: 0, y: -3, label: '(0, −3)', at: step, place: { dx: 1, dy: 1 } }] }) },
  { title: 'Draw the U', say: 'Plus x², so the curve is a U. Draw it smoothly through the three points, with its lowest point halfway between the roots.', equation: latex('y = x^2 - 2x - 3'), adds: 'answer',
    change: (frame, step) => ({ ...frame, curves: [{ coeffs: [-3, -2, 1], from: -2, to: 4, at: step, answer: true }], answer: { text: 'U through (−1, 0), (3, 0), (0, −3)', at: step } }) },
]
const sketch = add(sketching, 'Sketch the graph of y = x² − 2x − 3.', 'Higher A12 Example', graphModel('y = x² − 2x − 3', start, moves, 'Sketch it'), undefined, undefined, undefined,
  'Find the roots by factorising, then where it crosses the y axis. Then draw a U through those points.')
sketch.content.heading = 'Sketch the graph'

practice(sketching, 'Where does the graph of y = x² − 6x + 8 cross the x axis?', 'Higher A12 extra practice', twoRoots([{ typed: '2' }, { typed: '4' }], 'x = 2 or x = 4'), 'x = 2 or x = 4', 'Set y to 0 and factorise.', {
  kind: 'step-worked', start: 'y = x² − 6x + 8', steps: [
    { title: 'Set y to 0', why: 'The curve crosses the x axis where y is 0.', lines: [line([part('x² − 6x + 8 = 0', 0)], '(x − 2)(x − 4) = 0', { eq: true })] },
    { title: 'Each bracket is 0', why: 'Each bracket gives one place where the curve crosses.', lines: [line([part('(x − 2)(x − 4) = 0')], 'x = 2 or x = 4', { answer: true })] },
  ],
})
const yCross = practice(sketching, 'Where does the graph of y = x² + 2x − 8 cross the y axis?', 'Higher A12 extra practice', { ...number(-8, '−8'), signed: true }, '−8', 'What is y when x is 0?', {
  kind: 'step-worked', start: 'y = x² + 2x − 8', steps: [
    { title: 'Put x as 0', why: 'Every axis point on the y axis has x of 0. The x² and x terms become 0.', lines: [line([part('0²'), sign('+'), part('2 × 0'), sign('−'), part('8', 0)], '−8', { answer: true })] },
  ],
})
yCross.answerPrefix = 'y ='
practice(sketching, 'Which describes the sketch of y = x² − 4x + 3?', 'Higher A12 extra practice', choose([
  'A U crossing the x axis at 1 and 3, and the y axis at 3',
  'A U crossing the x axis at −1 and −3, and the y axis at 3',
  'An upside-down U crossing the x axis at 1 and 3, and the y axis at 3',
]), 'A U crossing the x axis at 1 and 3, and the y axis at 3', 'Factorise to find the roots. Mind the signs.', {
  kind: 'step-worked', start: 'y = x² − 4x + 3', steps: [
    { title: 'Find the roots', why: 'Set y to 0 and factorise. Each bracket gives a root, with the sign flipped.', lines: [line([part('(x − 1)(x − 3) = 0', 0)], 'x = 1 or x = 3')] },
    { title: 'Find the y crossing', why: 'Where x is 0, y is the last number.', lines: [line([part('c', 1)], '3', { eq: true })] },
    { title: 'Pick the shape', why: 'Plus x² makes a U, not an upside-down U.', words: 'A U crossing the x axis at 1 and 3, and the y axis at 3' },
  ],
})
practice(sketching, 'The graph of y = x² − 2x − 3 crosses the x axis at −1 and 3. What is the x coordinate of its lowest point?', 'Higher A12 extra practice', number(1, '1'), '1', 'The U is symmetrical.', {
  kind: 'step-worked', start: 'roots −1 and 3', steps: [
    { title: 'Halfway between', why: 'The U is symmetrical, so its lowest point is halfway between the roots. Add them and halve.', lines: [line([part('−1', 0), sign('+'), part('3', 0)], 2), line([part('2'), sign('÷'), part('2')], '1', { answer: true })] },
  ],
}, 'x coordinate')

const states = a.finish()
export const quadraticEquationsNumberInFront: HigherAddition = { lessonId: 'L022', skill: solving, label: 'Number in front of x²', states: states.filter(s => s.microSkillId === solving) }
export const quadraticSketching: HigherAddition = { lessonId: 'L022', skill: sketching, label: 'Sketching from the roots', states: states.filter(s => s.microSkillId === sketching) }
