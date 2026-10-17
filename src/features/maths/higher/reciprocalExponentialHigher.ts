/*
 * Lesson 106 (Quadratic and cubic graphs), one Higher section. From the Higher revision guide, GR6 Harder Graphs (p117,
 * Level 6-7) and its Your Turn (p120, Q3 to Q5):
 * - Reciprocal graphs y = k/x, e.g. y = 1/x: two curves in opposite corners that never touch the axes (no y at x = 0).
 * - Exponential graphs y = kˣ, e.g. y = 3ˣ: through (0, 1), getting steeper, never below the x axis.
 * As in the Foundation lesson, a table of values sits above the grid; each column is a point and the points are joined
 * with a smooth curve, here drawn with the curve's function (curves.ts). Tiny ys like 0.008 sit on the x axis on a
 * one-unit grid: the table carries them.
 */
import { author } from '../../written-methods/tutor/content'
import { line, part, sign } from '../../written-methods/tutor/stepWorking'
import type { GraphTable } from '../../written-methods/tutor/methodWorking'
import { fnValue, type CurveFn } from '../../written-methods/tutor/curves'
import { latex } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, gradient, mark, pt, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'
import { at } from '../../curve-graphs/tutor/curveWorkings'
import { between, choose, number, screens, text, type HigherAddition } from './helpers'

const skill = 'reciprocal-exponential-graphs'
const a = author(106, 'L106-H')
const { add } = a
const { practice, graph, onGrid } = screens(a)

const show = (n: number) => String(n).replace('-', '−')
/** A y as the table writes it: exact if it stops (0.125, 0.0016), else to two decimal places (1/3 is 0.33). */
const cell = (fn: CurveFn, x: number) => { const y = fnValue(fn, x); return Math.abs(y * 1e4 - Math.round(y * 1e4)) < 1e-9 ? y : Math.round(y * 100) / 100 }
const reciprocal = (k = 1): CurveFn => ({ kind: 'reciprocal', a: k })
const exponential = (base: number): CurveFn => ({ kind: 'exponential', base })

/** A table above the grid: `filled` columns have their y, `ask` is the cell the question asks for. */
function table(fn: CurveFn, xs: number[], rule: string, filled: number[], ask?: number): GraphTable {
  return { xs, ys: xs.map((x, i) => filled.includes(i) ? cell(fn, x) : null), rule, ask }
}
/** The question's grid: the table, and a dot for every filled column. */
function tableGrid(fn: CurveFn, xs: number[], rule: string, ask: number, x: [number, number], y: [number, number], extra: Partial<GraphGrid> = {}): GraphGrid {
  const filled = xs.map((_, i) => i).filter(i => i !== ask)
  return { x, y, lines: [], points: filled.map(i => ({ ...pt(xs[i], fnValue(fn, xs[i])), at: -1, label: '' })), table: table(fn, xs, rule, filled, ask), ...extra }
}

/* ---------- Worked examples: table, plot, join ---------- */

/** Moves: every y into the table (with a sum or two under the grid). */
const fill = (fn: CurveFn, sums: string[], say: string): GraphMove => ({
  title: 'Fill the table', equation: latex(sums.join(',\\ ')), adds: 'lines', say,
  change: (frame, step) => ({ ...frame, table: { ...frame.table!, ys: frame.table!.xs.map(x => cell(fn, x)) }, working: sums.map(t => ({ text: t, family: 0, at: step })) }),
})
/** Moves: each column a point. */
const plotAll = (fn: CurveFn, say: string): GraphMove => ({
  title: 'Plot the points', equation: latex('points'), adds: 'picture', say,
  change: (frame, step) => ({ ...frame, points: [...(frame.points ?? []), ...frame.table!.xs.map(x => ({ ...pt(x, fnValue(fn, x)), at: step, label: '' }))] }),
})
/** Moves: the answer, a smooth curve (or two, either side of an axis it never touches) through the points. */
const join = (fn: CurveFn, pieces: [number, number][], rule: string, title: string, say: string): GraphMove => answerMove(rule, title, say, [], {
  title: '', say: '', equation: '', adds: 'answer',
  change: (frame, step) => ({ ...frame, curves: pieces.map(([from, to]) => ({ coeffs: [], fn, from, to, at: step, answer: true })) }),
})

/* ---------- Reciprocal graphs ---------- */

add(skill, 'Reciprocal graphs', 'Higher GR6 Reciprocal Graphs', text(
  'A reciprocal graph has the form y = k/x, where k is a number: y = 1/x, y = 6/x.',
  'You can’t divide by 0, so there is no point at x = 0. The graph comes in two separate curves, in opposite corners.',
  'The curves get closer and closer to the axes but never touch them.',
  'Plot it like any curve: a table of values, a point for each column, then a smooth curve on each side.',
))

{
  const fn = reciprocal(), xs = [-2, -1, -0.5, 0.5, 1, 2]
  graph(skill, 'Draw the graph of y = 1/x from x = −5 to x = 5.', 'Higher GR6 Reciprocal Graphs (e.g. y = 1/x)', 'y = 1/x',
    { x: [-5, 5], y: [-5, 5], lines: [], points: [], table: { xs, ys: xs.map(() => null), rule: '1/x' } }, [
      fill(fn, ['1 ÷ (−2) = −0.5', '1 ÷ 0.5 = 2'], 'Divide 1 by each x. A negative x gives a negative y, and a small x gives a big y.'),
      plotAll(fn, 'Each column is a point. The negative ones are in the bottom left, the positive ones in the top right.'),
      join(fn, [[-5, -0.2], [0.2, 5]], 'y = 1/x', 'Two smooth curves', 'Join each side with its own smooth curve. There is no point at x = 0, so the two curves never meet and never touch the axes.'),
    ], 'Table, plot, join', 'Draw the graph',
    'Make a table of values, plot each column, then join each side with a smooth curve. Never join across the y axis.')
}

practice(skill, 'Which describes the graph of y = 1/x?', 'Higher GR6 Reciprocal Graphs (concept)', choose([
  'Two curves in opposite corners that never touch the axes',
  'A U shape with its lowest point at (0, 0)',
  'One curve that crosses the y axis at 1',
  'A straight line through the origin',
]), 'Two curves in opposite corners that never touch the axes', 'What happens when x is 0?', {
  kind: 'step-worked', start: 'y = 1/x', steps: [
    { title: 'Try x as 0', why: 'You can’t divide by zero, so there is no point on the y axis. The graph is in two pieces.', lines: [line([part('1 ÷ 0')], 'no value')] },
    { title: 'Pick the shape', why: 'A positive x gives a positive y and a negative x a negative y, so the pieces are in opposite corners.', words: 'Two curves in opposite corners that never touch the axes' },
  ],
})

{
  // Your Turn Q5: y = 1/x from x = 1 to 5, on the book's scale (0.5 every two squares).
  const fn = reciprocal(), xs = [1, 2, 3, 4, 5]
  const scale = { x: { per: 1, start: 0, name: 'x' }, y: { per: 0.25, start: 0, name: 'y' } }
  const q = onGrid(skill, 'y = 1/x. Find y when x = 4.', 'Higher GR6 Your Turn Q5', tableGrid(fn, xs, '1/x', 3, [-1, 6], [-0.25, 1.5], { scale }),
    gradient(0.25, '0.25'), '0.25', 'Divide 1 by 4.', {
      kind: 'step-worked', start: 'y = 1/x', steps: [
        { title: 'Put x in', why: 'Divide one by the x in the column.', lines: [line([part('1'), sign('÷'), part('4', 1)], '0.25', { answer: true })] },
      ],
    })
  q.answerPrefix = 'y ='
  const q3 = onGrid(skill, 'y = 1/x. Find y when x = 3, to 2 decimal places.', 'Higher GR6 Your Turn Q5', tableGrid(fn, xs, '1/x', 2, [-1, 6], [-0.25, 1.5], { scale }),
    between(0.33, 0.325, 0.335, '0.33'), '0.33', 'Divide 1 by 3, then round.', {
      kind: 'step-worked', start: 'y = 1/x', steps: [
        { title: 'Put x in', why: 'Divide one by the x in the column. It goes on for ever.', lines: [line([part('1/3', 1)], '0.333…', { eq: true })] },
        { title: 'Round it', why: 'Keep two decimal places. The next digit is small, so round down.', lines: [line([part('0.333…')], '0.33', { answer: true })] },
      ],
    })
  q3.answerPrefix = 'y ='
  graph(skill, 'Use the table for y = 1/x to plot its graph from x = 1 to x = 5.', 'Higher GR6 Your Turn Q5', 'y = 1/x',
    { x: [-1, 6], y: [-0.25, 1.5], lines: [], points: [], scale, table: { xs, ys: xs.map(x => cell(fn, x)), rule: '1/x' } }, [
      plotAll(fn, 'Each column is a point. One square up is 0.25 here, so 0.33 sits just above the first square.'),
      join(fn, [[1, 5]], 'y = 1/x', 'Join with a curve', 'Join them with one smooth curve. It drops quickly, then flattens out towards the x axis but never reaches it.'),
    ], 'Plot and join', 'Plot the graph')
}

{
  const q = practice(skill, 'y = 6/x. Find y when x = −3.', 'Higher GR6 extra practice', { ...number(-2, '−2'), signed: true }, '−2', 'Divide 6 by −3.', {
    kind: 'step-worked', start: 'y = 6/x', steps: [
      { title: 'Put x in', why: 'Divide the number on top by x. A positive divided by a negative is negative.', lines: [line([part('6'), sign('÷'), part('(−3)', 1)], '−2', { answer: true })] },
    ],
  })
  q.answerPrefix = 'y ='
}

/* ---------- Exponential graphs ---------- */

add(skill, 'Exponential graphs', 'Higher GR6 Exponential Graphs', text(
  'An exponential graph has the form y = kˣ, where k is a positive number: y = 2ˣ, y = 3ˣ.',
  'Any number to the power 0 is 1, so every one goes through (0, 1).',
  'A negative power is a fraction: 2⁻¹ = 1/2. So y gets tiny on one side but never goes below the x axis.',
  'When k is more than 1 it gets steeper and steeper. When k is less than 1, like 0.2, it falls instead.',
))

{
  // Your Turn Q4 as the worked example: y = 2ˣ from x = −3 to 2.
  const fn = exponential(2), xs = [-3, -2, -1, 0, 1, 2]
  graph(skill, 'Using y = 2ˣ, draw a table of values from x = −3 to x = 2, then plot the graph.', 'Higher GR6 Your Turn Q4', 'y = 2ˣ',
    { x: [-4, 3], y: [-1, 5], lines: [], points: [], table: { xs, ys: xs.map(() => null), rule: '2ˣ' } }, [
      fill(fn, ['2⁻³ = 1/8 = 0.125', '2⁰ = 1'], 'A negative power is one over the power: 2⁻³ is 1 over 2³. Each column doubles the one before.'),
      plotAll(fn, 'Each column is a point. The left ones are very close to the x axis, but just above it.'),
      {
        title: 'Through (0, 1)', equation: latex('(0, 1)'), adds: 'lines', say: 'Any number to the power 0 is 1, so the graph crosses the y axis at (0, 1).',
        change: (frame, step) => ({ ...frame, boxed: [pt(0, 1)], marks: [mark('y', 1)], working: [...(frame.working ?? []), { text: 'crosses the y axis at (0, 1)', family: 3, at: step }] }),
      },
      join(fn, [[-3, 2]], 'y = 2ˣ', 'Join with a curve', 'Join them with one smooth curve. It gets steeper and steeper to the right, and flatter to the left, never going below the x axis.'),
    ], 'Table, plot, join', 'Draw the graph',
    'Put each x in as a power of 2. A negative power is a fraction, so the left side hugs the x axis.')
}

practice(skill, 'Where does the graph of y = 2ˣ cross the y axis?', 'Higher GR6 Exponential Graphs (concept)', at(pt(0, 1)), '(0, 1)', 'On the y axis, x is 0.', {
  kind: 'step-worked', start: 'y = 2ˣ', steps: [
    { title: 'Put x as 0', why: 'Every point on the y axis has x of zero. Any number to the power zero is one.', lines: [line([part('2⁰')], '1', { eq: true })] },
    { title: 'The crossing point', why: 'x first, then y.', lines: [line([part('x = 0, y = 1')], '(0, 1)', { answer: true })] },
  ],
}, 'Point')

practice(skill, 'Which describes the graph of y = 3ˣ?', 'Higher GR6 Exponential Graphs (e.g. y = 3ˣ)', choose([
  'Through (0, 1), getting steeper, never below the x axis',
  'Through (0, 0), getting steeper, never below the x axis',
  'Two curves in opposite corners that never touch the axes',
  'A U shape with its lowest point at (0, 1)',
]), 'Through (0, 1), getting steeper, never below the x axis', 'Try x = 0, then a negative x.', {
  kind: 'step-worked', start: 'y = 3ˣ', steps: [
    { title: 'Try x as 0', why: 'Any number to the power zero is one.', lines: [line([part('3⁰')], '1', { eq: true })] },
    { title: 'Try a negative x', why: 'A negative power is a fraction, small but still positive. So the curve never goes below the x axis.', lines: [line([part('3⁻¹')], '1/3', { eq: true })] },
    { title: 'Pick the shape', why: 'Each step right multiplies y by three, so it gets steeper.', words: 'Through (0, 1), getting steeper, never below the x axis' },
  ],
})

{
  // Your Turn Q3: y = (0.2)ˣ, the book gives y at x = 1 and x = 4.
  const fn = exponential(0.2), xs = [-1, 0, 1, 2, 3, 4], rule = '(0.2)ˣ'
  const grid = (ask: number, known: number[]): GraphGrid => {
    const filled = known.filter(i => i !== ask)
    return { x: [-2, 5], y: [-1, 6], lines: [], points: filled.map(i => ({ ...pt(xs[i], fnValue(fn, xs[i])), at: -1, label: '' })), table: table(fn, xs, rule, filled, ask) }
  }
  const q1 = onGrid(skill, 'Using y = (0.2)ˣ, complete the table. Find y when x = −1.', 'Higher GR6 Your Turn Q3', grid(0, [2, 5]), number(5, '5'), '5',
    'A power of −1 means 1 divided by the number.', {
      kind: 'step-worked', start: 'y = (0.2)ˣ', steps: [
        { title: 'Negative power', why: 'A power of minus one is one divided by the number.', lines: [line([part('1'), sign('÷'), part('0.2', 1)], '5', { answer: true })] },
      ],
    })
  q1.answerPrefix = 'y ='
  const q2 = onGrid(skill, 'Using y = (0.2)ˣ, find y when x = 2.', 'Higher GR6 Your Turn Q3', grid(3, [0, 1, 2, 5]), number(0.04, '0.04'), '0.04',
    'Squared means 0.2 × 0.2.', {
      kind: 'step-worked', start: 'y = (0.2)ˣ', steps: [
        { title: 'Square it', why: 'A power of two means the number times itself.', lines: [line([part('0.2'), sign('×'), part('0.2')], '0.04', { answer: true })] },
      ],
    })
  q2.answerPrefix = 'y ='
  const q3 = onGrid(skill, 'Using y = (0.2)ˣ, find y when x = 3.', 'Higher GR6 Your Turn Q3', grid(4, [0, 1, 2, 3, 5]), number(0.008, '0.008'), '0.008',
    'Take the y for x = 2 and times it by 0.2 again.', {
      kind: 'step-worked', start: 'y = (0.2)ˣ', steps: [
        { title: 'One more 0.2', why: 'Each step right multiplies by the number once more, so times the last y by it.', lines: [line([part('0.04'), sign('×'), part('0.2')], '0.008', { answer: true })] },
      ],
    })
  q3.answerPrefix = 'y ='
  practice(skill, 'Which describes the graph of y = (0.2)ˣ?', 'Higher GR6 Your Turn Q3', choose([
    'Through (0, 1), falling and getting flatter, never below the x axis',
    'Through (0, 1), getting steeper, never below the x axis',
    'Through (0, 0.2), falling and getting flatter',
    'Falling, then crossing the x axis at 4',
  ]), 'Through (0, 1), falling and getting flatter, never below the x axis', 'Look at the table: 5, 1, 0.2, 0.04, …', {
    kind: 'step-worked', start: 'y = (0.2)ˣ', steps: [
      { title: 'Read the table', why: 'The table goes five, one, then smaller and smaller, but every y stays positive.', lines: [line([part('(0.2)⁰')], '1', { eq: true })] },
      { title: 'Pick the shape', why: 'The number is less than one, so each step right makes y smaller. It flattens out towards the x axis but never reaches it.', words: 'Through (0, 1), falling and getting flatter, never below the x axis' },
    ],
  })
  graph(skill, 'Plot the graph of y = (0.2)ˣ from x = −1 to x = 4.', 'Higher GR6 Your Turn Q3', 'y = (0.2)ˣ',
    { x: [-2, 5], y: [-1, 6], lines: [], points: [], table: { xs, ys: xs.map(x => cell(fn, x)), rule } }, [
      plotAll(fn, 'Each column is a point. 0.04, 0.008 and 0.0016 are too small to see on this grid: they sit just above the x axis.'),
      join(fn, [[-1, 4]], 'y = (0.2)ˣ', 'Join with a curve', 'Join them with one smooth curve. It falls steeply, then flattens out just above the x axis.'),
    ], 'Plot and join', 'Plot the graph')
}

{
  const q = practice(skill, 'y = 3ˣ. Find y when x = 2.', 'Higher GR6 extra practice', number(9, '9'), '9', '3² means 3 × 3.', {
    kind: 'step-worked', start: 'y = 3ˣ', steps: [
      { title: 'Put x in', why: 'The x is the power, so multiply three by itself that many times.', lines: [line([part('3'), sign('×'), part('3')], '9', { answer: true })] },
    ],
  })
  q.answerPrefix = 'y ='
  const r = practice(skill, 'y = 4ˣ. Find y when x = −1.', 'Higher GR6 extra practice', gradient(0.25, '0.25'), '0.25', 'A power of −1 means 1 divided by the number.', {
    kind: 'step-worked', start: 'y = 4ˣ', steps: [
      { title: 'Negative power', why: 'A power of minus one is one divided by the number. A fraction or a decimal is fine.', lines: [line([part('1'), sign('÷'), part('4')], '0.25', { answer: true })] },
    ],
  })
  r.answerPrefix = 'y ='
}

const states = a.finish()
export const reciprocalExponential: HigherAddition = { lessonId: 'L106', skill, label: 'Reciprocal and exponential graphs', states }
