/*
 * Lesson 27 (Simultaneous equations), Higher section: one linear and one quadratic equation. From the Higher revision
 * guide, A23 Type 2 Non-linear Simultaneous Equations (Level 8-9) and Your Turn Q5: elimination won't work with an x²,
 * so rearrange the linear equation, substitute it into the other one, solve the quadratic, then put both x values back
 * in to get two pairs. The pairs are where the line crosses the curve, which the graph screen shows.
 */
import { author } from '../../written-methods/tutor/content'
import { line, part, sign, type StepWorking } from '../../written-methods/tutor/stepWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { latex } from '../../inequalities/tutor/inequalityWorkings'
import { graphModel, mark, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'
import { choose, screens, text, type HigherAddition } from './helpers'

const skill = 'simultaneous-non-linear'
const a = author(27, 'L27-H')
const { add } = a
const { worked, practice } = screens(a)

/** Keeps an equation on one line in a title, so a phone never breaks it. */
const nb = (expression: string) => expression.replace(/ /g, ' ')
const eq = (title: string, why: string, from: string, to: string, family?: number) => ({ title, why, lines: [line([part(from, family)], to, { eq: true })] })

/** The x values typed as "x = ☐ or x = ☐", in either order. */
const twoValues = (values: number[], shown: string): InteractionDefinition => ({ type: 'numericInput', responseShape: 'roots', acceptanceRule: 'unorderedSet', correctAnswer: values.join(', '), displayAnswer: shown })

add(skill, 'One equation with x²', 'Higher A23 Type 2 Non-linear Simultaneous Equations', text(
  'When one equation has an x² (or a y²), you can’t make a letter disappear by adding or subtracting.',
  'Instead, rearrange the straight-line equation to get y on its own (or x), and put it in place of y in the other equation. This is substitution.',
  'That leaves a quadratic. Solve it, then put each x back into the straight-line equation to find its y.',
  'There are usually two pairs of answers.',
))

const example: StepWorking = {
  kind: 'step-worked', start: 'x² + 2y = 9 and y − x = 3', steps: [
    eq('Rearrange the line', 'Get one letter on its own in the straight-line equation. Add x to both sides.', 'y − x = 3', 'y = x + 3', 0),
    eq('Substitute for y', 'Put x + 3 in place of y in the other equation, in a bracket.', 'x² + 2y = 9', 'x² + 2(x + 3) = 9', 0),
    eq('Expand and simplify', 'Expand the bracket, then take 9 from both sides so one side is 0.', 'x² + 2x + 6 = 9', 'x² + 2x − 3 = 0', 1),
    { title: 'Solve the quadratic', why: 'Factorise. Two numbers that multiply to make −3 and add to make 2 are 3 and −1.', lines: [line([part('(x + 3)(x − 1) = 0', 1)], 'x = 1 or x = −3')] },
    { title: 'Find each y', why: 'Put each x into the rearranged line, y is x plus 3.', lines: [line([part('1'), sign('+'), part('3', 2)], 4), line([part('−3'), sign('+'), part('3', 2)], 0)] },
    { title: 'Write both pairs', why: 'Each x goes with its own y. Write them as pairs.', lines: [line([part('pairs')], 'x = 1, y = 4 and x = −3, y = 0', { answer: true })] },
  ],
}
worked(skill, `Solve ${nb('x² + 2y = 9')} and ${nb('y − x = 3')}.`, 'Higher A23 Example', example,
  'Rearrange the straight-line equation, substitute it into the one with x², solve the quadratic, then find each y.')

/* What the two pairs mean: the points where the line crosses the curve. */
const start: GraphGrid = { x: [-5, 4], y: [-4, 5], lines: [], points: [] }
const moves: GraphMove[] = [
  { title: 'Draw the curve', say: 'x² + 2y = 9 rearranges to y = 4.5 − ½x². It has an x², so its graph is a curve.', equation: latex('x^2 + 2y = 9'), adds: 'picture',
    change: (frame, step) => ({ ...frame, curves: [{ coeffs: [4.5, 0, -0.5], from: -4, to: 4, at: step, label: 'x² + 2y = 9' }] }) },
  { title: 'Draw the line', say: 'y − x = 3 rearranges to y = x + 3, a straight line.', equation: latex('y = x + 3'), adds: 'picture',
    change: (frame, step) => ({ ...frame, lines: [...(frame.lines ?? []), { from: { x: 0, y: 3 }, to: { x: 1, y: 4 }, label: 'y = x + 3', at: step }] }) },
  { title: 'Where they cross', say: 'Both equations are true where the line crosses the curve. They cross twice, at (1, 4) and (−3, 0): the two pairs.', equation: latex('(1, 4),\\ (-3, 0)'), adds: 'answer',
    change: (frame, step) => ({ ...frame, marks: [mark('x', 1), mark('x', -3)], points: [...(frame.points ?? []), { x: 1, y: 4, label: '(1, 4)', at: step, answer: true, place: { dx: 1, dy: 1 } }, { x: -3, y: 0, label: '(−3, 0)', at: step, answer: true, place: { dx: -1, dy: -1 } }], answer: { text: 'x = 1, y = 4 and x = −3, y = 0', at: step } }) },
]
const graph = add(skill, 'What the answers mean on a graph', 'Higher A23 Example graph', graphModel('x² + 2y = 9 and y = x + 3', start, moves, 'See it'), undefined, undefined, undefined,
  'Each pair of answers is a point where the line crosses the curve. A line can cross a curve twice, so there are usually two pairs.')
graph.content.heading = 'Where the line crosses the curve'

practice(skill, `Solve ${nb('x² + y² = 25')} and ${nb('x + y = 7')}.`, 'Higher A23 Your Turn Q5', choose([
  'x = 3, y = 4 and x = 4, y = 3',
  'x = 3, y = 4 only',
  'x = −3, y = 10 and x = −4, y = 11',
]), 'x = 3, y = 4 and x = 4, y = 3', 'Rearrange x + y = 7 to y = 7 − x, then substitute.', {
  kind: 'step-worked', start: 'x² + y² = 25 and x + y = 7', steps: [
    eq('Rearrange the line', 'Take x from both sides of the straight-line equation.', 'x + y = 7', 'y = 7 − x', 0),
    eq('Substitute for y', 'Put 7 − x in place of y, in a bracket, and square the whole bracket.', 'x² + y² = 25', 'x² + (7 − x)² = 25', 0),
    eq('Expand the square', 'Write the bracket out twice and multiply every term by every term.', '(7 − x)²', '49 − 14x + x²', 1),
    eq('Make it 0', 'Collect the x² terms, then take 25 from both sides.', '2x² − 14x + 49 = 25', '2x² − 14x + 24 = 0', 1),
    eq('Divide by 2', 'Every term is even, so halve them all. That makes it easier to factorise.', '2x² − 14x + 24 = 0', 'x² − 7x + 12 = 0', 1),
    { title: 'Solve the quadratic', why: 'Two numbers that multiply to make 12 and add to make −7 are −3 and −4.', lines: [line([part('(x − 3)(x − 4) = 0', 1)], 'x = 3 or x = 4')] },
    { title: 'Find each y', why: 'Put each x into y is 7 take away x.', lines: [line([part('7'), sign('−'), part('3', 2)], 4), line([part('7'), sign('−'), part('4', 2)], 3)] },
    { title: 'Write both pairs', why: 'Each x goes with its own y.', words: 'x = 3, y = 4 and x = 4, y = 3' },
  ],
})

const meet = practice(skill, `The curve ${nb('y = x² − 4')} and the line ${nb('y = x + 2')} cross twice. Find the two x values where they cross.`, 'Higher A23 extra practice', twoValues([3, -2], 'x = 3 or x = −2'), 'x = 3 or x = −2', 'Both are y =, so set the right-hand sides equal.', {
  kind: 'step-worked', start: 'y = x² − 4 and y = x + 2', steps: [
    eq('Set them equal', 'Both equations say what y is, so the two right-hand sides are equal where they cross.', 'x² − 4', 'x + 2', 0),
    eq('Make it 0', 'Take x and 2 from both sides, so one side is 0.', 'x² − 4 = x + 2', 'x² − x − 6 = 0', 1),
    { title: 'Factorise', why: 'Two numbers that multiply to make −6 and add to make −1 are −3 and 2.', lines: [line([part('(x − 3)(x + 2) = 0', 1)], 'x = 3 or x = −2', { answer: true })] },
  ],
})
meet.answerLabel = 'x values'

practice(skill, `Solve ${nb('y = x² + 1')} and ${nb('y = 2x + 4')}.`, 'Higher A23 extra practice', choose([
  'x = 3, y = 10 and x = −1, y = 2',
  'x = 3, y = 10 and x = −1, y = 6',
  'x = −3, y = −2 and x = 1, y = 6',
]), 'x = 3, y = 10 and x = −1, y = 2', 'Set x² + 1 equal to 2x + 4.', {
  kind: 'step-worked', start: 'y = x² + 1 and y = 2x + 4', steps: [
    eq('Set them equal', 'Both equations say what y is, so the right-hand sides are equal.', 'x² + 1', '2x + 4', 0),
    eq('Make it 0', 'Take 2x and 4 from both sides.', 'x² + 1 = 2x + 4', 'x² − 2x − 3 = 0', 1),
    { title: 'Solve the quadratic', why: 'Two numbers that multiply to make −3 and add to make −2 are −3 and 1.', lines: [line([part('(x − 3)(x + 1) = 0', 1)], 'x = 3 or x = −1')] },
    { title: 'Find each y', why: 'Put each x into the straight line, the easier equation. Double x, then add 4.', lines: [line([part('2 × 3'), sign('+'), part('4', 2)], 10), line([part('2 × (−1)'), sign('+'), part('4', 2)], 2)] },
    { title: 'Write both pairs', why: 'Each x goes with its own y.', words: 'x = 3, y = 10 and x = −1, y = 2' },
  ],
})

practice(skill, `Solve ${nb('x² + y² = 10')} and ${nb('y = x + 2')}.`, 'Higher A23 extra practice', choose([
  'x = 1, y = 3 and x = −3, y = −1',
  'x = 1, y = 3 and x = −3, y = 1',
  'x = −1, y = 1 and x = 3, y = 5',
]), 'x = 1, y = 3 and x = −3, y = −1', 'y is already on its own. Put x + 2 in place of y.', {
  kind: 'step-worked', start: 'x² + y² = 10 and y = x + 2', steps: [
    eq('Substitute for y', 'y is already on its own. Put x + 2 in place of y, in a bracket.', 'x² + y² = 10', 'x² + (x + 2)² = 10', 0),
    eq('Expand the square', 'Write the bracket out twice and multiply every term by every term.', '(x + 2)²', 'x² + 4x + 4', 1),
    eq('Make it 0', 'Collect the x² terms, then take 10 from both sides.', '2x² + 4x + 4 = 10', '2x² + 4x − 6 = 0', 1),
    eq('Divide by 2', 'Every term is even, so halve them all.', '2x² + 4x − 6 = 0', 'x² + 2x − 3 = 0', 1),
    { title: 'Solve the quadratic', why: 'Two numbers that multiply to make −3 and add to make 2 are 3 and −1.', lines: [line([part('(x + 3)(x − 1) = 0', 1)], 'x = 1 or x = −3')] },
    { title: 'Find each y', why: 'Put each x into y is x plus 2.', lines: [line([part('1'), sign('+'), part('2', 2)], 3), line([part('−3'), sign('+'), part('2', 2)], '−1')] },
    { title: 'Write both pairs', why: 'Each x goes with its own y.', words: 'x = 1, y = 3 and x = −3, y = −1' },
  ],
})

export const nonLinearSimultaneous: HigherAddition = { lessonId: 'L027', skill, label: 'One equation with x²', states: a.finish() }
