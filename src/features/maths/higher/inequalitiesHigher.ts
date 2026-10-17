/*
 * Lesson 25 (Solving inequalities), two Higher sections. From the Higher revision guide:
 * - A20 Quadratic inequalities (Level 8-9): x² < a² gives −a < x < a and x² > a² gives x < −a or x > a (the Take Note
 *   rule); otherwise make one side 0, factorise, sketch the U and read where it is below (< 0) or above (> 0) the x axis.
 *   Your Turn Q1 to Q5. A two-sided answer is typed with the sign keys; an "or" answer is picked, because it is two
 *   inequalities and the answer box takes one.
 * - A21 Graphical inequalities (Level 6-7): a solid line for ≤ and ≥, a dashed line for < and >, shade above for y >
 *   and y ≥ and below for y < and y ≤. Drawing a region and finding the inequalities from one, Your Turn Q1 to Q5.
 */
import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import { line, part, sign, type StepWorking, type WorkedStep } from '../../written-methods/tutor/stepWorking'
import type { GraphPoint } from '../../written-methods/tutor/methodWorking'
import type { MicroSkillId, InteractionDefinition } from '../../number-types/types'
import { inequality, latex } from '../../inequalities/tutor/inequalityWorkings'
import { figure, graphModel, mark, pt, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'
import { choose, screens, text, type HigherAddition } from './helpers'

const quadratic = 'quadratic-inequalities'
const regions = 'graphical-inequalities'
const a = author(25, 'L25-H')
const { add } = a
const { worked, practice } = screens(a)

/** A question with the grid drawn above it, and its own step working. */
function onGrid(topic: MicroSkillId, title: string, sourceRef: string, start: GraphGrid, interaction: InteractionDefinition, answer: string, hint: string, model: StepWorking) {
  const state = add(topic, title, sourceRef, figure(start), interaction, working(answer, ...model.steps.map(step => [step.title, step.why] as [string, string])), hint)
  state.working = model
  return state
}

/* ---------- Section 1: quadratic inequalities (A20, Level 8-9) ---------- */

add(quadratic, 'Quadratic inequalities', 'Higher A20 Take Note', text(
  'A quadratic inequality has a squared term, like x² < 64. Solve it like an equation, but remember a square has two roots.',
  'When x² < a², x is between the roots: −a < x < a.',
  'When x² > a², x is outside them: x < −a or x > a.',
  'For anything harder, make one side 0, factorise, and sketch the U. Below the x axis is < 0. Above it is > 0.',
))

worked(quadratic, 'Solve the inequality x² < 64.', 'Higher A20 Type 1 Example', {
  kind: 'step-worked', start: 'x² < 64', steps: [
    { title: 'Square root', why: 'Take the square root of both sides. A square has two roots, a positive one and a negative one.', lines: [line([part('√64', 0)], '8', { eq: true }), line([part('x²', 1), sign('='), part('64', 0)], 'x = 8 or x = −8')] },
    { title: 'Between the roots', why: 'x² is less than 64 only when x is between −8 and 8. Try 9 or −9: their squares are too big.', lines: [line([part('x² < 64')], '−8 < x < 8', { answer: true })] },
  ],
}, 'Squared and “less than”: the answer is between the two roots.')

worked(quadratic, 'Solve the inequality 2x² > 18.', 'Higher A20 Type 2 Example', {
  kind: 'step-worked', start: '2x² > 18', steps: [
    { title: 'Divide by 2', why: 'Get x² on its own first, just as you would in an equation.', lines: [line([part('18', 0), sign('÷'), part('2')], '9'), line([part('2x² > 18')], 'x² > 9')] },
    { title: 'Square root', why: 'A square has two roots, so there are two numbers to find.', lines: [line([part('√9', 0)], '3', { eq: true })] },
    { title: 'Outside the roots', why: 'x² is more than 9 when x is bigger than 3, or smaller than −3. It can’t be both at once, so write “or”.', words: 'x < −3 or x > 3' },
  ],
}, 'Squared and “more than”: the answer is outside the two roots, so it is two inequalities joined by “or”.')

/** A U through its roots, crossing the y axis at c, read below or above the x axis. */
function sketchModel(question: string, coeffs: number[], range: [number, number], y: [number, number], factorised: string, roots: [number, number], above: boolean, answer: string, given?: string): ReturnType<typeof graphModel> {
  const start: GraphGrid = { x: range, y, lines: [], points: [] }
  const [r1, r2] = roots
  const name = (n: number) => String(n).replace('-', '−')
  const moves: GraphMove[] = []
  if (given) moves.push({ title: 'Make it 0', say: 'Take everything to one side, so the other side is 0. Then the question is where the curve is above or below the x axis.', equation: latex(given), adds: 'lines',
    change: (frame, step) => ({ ...frame, working: [{ text: given, family: 0, at: step }] }) })
  moves.push(
    { title: 'Factorise', say: 'Factorise to find the roots, where the curve crosses the x axis.', equation: latex(factorised), adds: 'lines',
      change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), { text: factorised, family: 0, at: step }] }) },
    { title: 'Mark the roots', say: `Each bracket is 0 at one root, so the curve crosses the x axis at ${name(r1)} and ${name(r2)}.`, equation: latex(`x = ${name(r1)},\\ x = ${name(r2)}`), adds: 'picture',
      change: (frame, step) => ({ ...frame, marks: [mark('x', r1), mark('x', r2)], points: [{ x: r1, y: 0, at: step, label: `(${name(r1)}, 0)`, place: { dx: -1, dy: -1 } }, { x: r2, y: 0, at: step, label: `(${name(r2)}, 0)`, place: { dx: 1, dy: -1 } }] }) },
    { title: 'Sketch the U', say: 'Plus x², so the curve is a U through the two roots.', equation: latex(question), adds: 'picture',
      change: (frame, step) => ({ ...frame, curves: [{ coeffs, from: range[0], to: range[1], at: step }] }) },
    { title: above ? 'Above the axis' : 'Below the axis', say: above
      ? 'Greater than (or equal to) 0 means above the x axis. The U is above it outside the roots, so there are two parts, joined by “or”.'
      : 'Less than 0 means below the x axis. The U is below it only between the roots.', equation: latex(answer), adds: 'answer',
      change: (frame, step) => ({ ...frame, answer: { text: answer, at: step } }) },
  )
  return graphModel(question, start, moves, 'Solve it')
}

const below = add(quadratic, 'Solve the inequality x² − 2x − 3 < 0.', 'Higher A20 Type 3 Example',
  sketchModel('x² − 2x − 3 < 0', [-3, -2, 1], [-3, 5], [-5, 6], '(x + 1)(x − 3) < 0', [-1, 3], false, '−1 < x < 3'), undefined, undefined, undefined,
  'Factorise, sketch the U through its roots, then read where it is below the x axis.')
below.content.heading = 'Solve the inequality'
const aboveScreen = add(quadratic, 'Solve the inequality x² + 5x ≥ −4.', 'Higher A20 Type 4 Example',
  sketchModel('x² + 5x + 4 ≥ 0', [4, 5, 1], [-6, 2], [-3, 6], '(x + 1)(x + 4) ≥ 0', [-4, -1], true, 'x ≤ −4 or x ≥ −1', 'x² + 5x + 4 ≥ 0'), undefined, undefined, undefined,
  'Make one side 0 first. Then factorise, sketch, and read where the U is above the x axis.')
aboveScreen.content.heading = 'Solve the inequality'

/** Make it 0 if needed, factorise, then read the U between (< 0) or outside (> 0) the roots. */
function quadraticSolve(question: string, steps: WorkedStep[]): StepWorking { return { kind: 'step-worked', start: question, steps } }
const roots = (bracketed: string, values: string): WorkedStep => ({ title: 'Find the roots', why: 'Each bracket is 0 at one root. These are where the U crosses the x axis.', lines: [line([part(bracketed, 0)], values)] })
const factorise = (from: string, to: string): WorkedStep => ({ title: 'Factorise', why: 'Two numbers that multiply to the last number and add to the middle one.', lines: [line([part(from)], to, { eq: true })] })
const between = (answer: string, inclusive: boolean): WorkedStep => ({ title: 'Between the roots', why: `The U is below the x axis between its roots.${inclusive ? ' “Or equal to” includes the roots themselves.' : ''}`, lines: [line([part('below the axis')], answer, { answer: true })] })

practice(quadratic, 'Solve the inequality x² − 5x + 6 ≤ 0.', 'Higher A20 Your Turn Q1', inequality('2 ≤ x ≤ 3'), '2 ≤ x ≤ 3', 'Factorise, then find where the U is below (or on) the x axis.',
  quadraticSolve('x² − 5x + 6 ≤ 0', [factorise('x² − 5x + 6', '(x − 2)(x − 3)'), roots('(x − 2)(x − 3) = 0', 'x = 2 or x = 3'), between('2 ≤ x ≤ 3', true)]))

practice(quadratic, 'Solve the inequality x² − 3x > 0.', 'Higher A20 Your Turn Q2', choose(['x < 0 or x > 3', '0 < x < 3', 'x > 3', 'x < −3 or x > 0']), 'x < 0 or x > 3', 'Take out x as a common factor. One root is 0.',
  quadraticSolve('x² − 3x > 0', [
    { title: 'Factorise', why: 'Both terms have an x in them, so take it out.', lines: [line([part('x² − 3x')], 'x(x − 3)', { eq: true })] },
    roots('x(x − 3) = 0', 'x = 0 or x = 3'),
    { title: 'Outside the roots', why: 'More than 0 means above the x axis. The U is above it on both sides of its roots, so write “or”.', words: 'x < 0 or x > 3' },
  ]))

practice(quadratic, 'Solve the inequality 3p² + 8 > 20.', 'Higher A20 Your Turn Q3', choose(['p < −2 or p > 2', '−2 < p < 2', 'p > 2', 'p < −4 or p > 4']), 'p < −2 or p > 2', 'Get p² on its own, then square root. Don’t forget the negative root.',
  quadraticSolve('3p² + 8 > 20', [
    { title: 'Subtract 8', why: 'Undo the adding first, as in an equation.', lines: [line([part('20', 0), sign('−'), part('8')], '12'), line([part('3p² + 8 > 20')], '3p² > 12')] },
    { title: 'Divide by 3', why: 'Get p² on its own.', lines: [line([part('12', 0), sign('÷'), part('3')], '4'), line([part('3p² > 12')], 'p² > 4')] },
    { title: 'Square root', why: 'A square has two roots.', lines: [line([part('√4', 0)], '2', { eq: true })] },
    { title: 'Outside the roots', why: 'Squared and more than: p is bigger than the positive root, or smaller than the negative one.', words: 'p < −2 or p > 2' },
  ]))

practice(quadratic, 'Solve the inequality x² − 3x + 2 < 0.', 'Higher A20 Your Turn Q4', inequality('1 < x < 2'), '1 < x < 2', 'Factorise, then find where the U is below the x axis.',
  quadraticSolve('x² − 3x + 2 < 0', [factorise('x² − 3x + 2', '(x − 1)(x − 2)'), roots('(x − 1)(x − 2) = 0', 'x = 1 or x = 2'), between('1 < x < 2', false)]))

practice(quadratic, 'Solve the inequality x² − 5x + 24 < 5x + 8.', 'Higher A20 Your Turn Q5', inequality('2 < x < 8'), '2 < x < 8', 'Take everything to the left, so the right side is 0.',
  quadraticSolve('x² − 5x + 24 < 5x + 8', [
    { title: 'Make it 0', why: 'Take the 5x and the 8 away from both sides, so one side is 0.', lines: [line([part('24', 0), sign('−'), part('8', 0)], '16'), line([part('x² − 5x + 24 < 5x + 8')], 'x² − 10x + 16 < 0')] },
    factorise('x² − 10x + 16', '(x − 2)(x − 8)'),
    roots('(x − 2)(x − 8) = 0', 'x = 2 or x = 8'),
    between('2 < x < 8', false),
  ]))

practice(quadratic, 'Solve the inequality x² ≤ 25.', 'Higher A20 extra practice', inequality('−5 ≤ x ≤ 5'), '−5 ≤ x ≤ 5', 'Squared and “less than or equal to”: between the roots, and including them.',
  quadraticSolve('x² ≤ 25', [
    { title: 'Square root', why: 'A square has two roots, a positive one and a negative one.', lines: [line([part('√25', 0)], '5', { eq: true })] },
    { title: 'Between the roots', why: 'Less than or equal to: x is between the roots, and can be either root.', lines: [line([part('x² ≤ 25')], '−5 ≤ x ≤ 5', { answer: true })] },
  ]))

/* ---------- Section 2: regions on a graph (A21, Level 6-7) ---------- */

add(regions, 'Regions on a graph', 'Higher A21 Expressing Graphical Inequalities', text(
  'An inequality like y ≥ 2x − 1 is a region of a graph: every point on one side of the line y = 2x − 1.',
  'Draw the line as if the inequality were an equation. ≤ and ≥ give a solid line. < and > give a dashed line, because the line itself isn’t included.',
  'y > or y ≥ means shade above the line. y < or y ≤ means shade below it. For x > or x ≥, shade to the right.',
  'Rearrange the inequality into y = mx + c form first, so you can tell above from below.',
))

type Edge = { from: GraphPoint; to: GraphPoint; label: string; dashed?: boolean }
const edge = (from: GraphPoint, to: GraphPoint, label: string, dashed = false): Edge => ({ from, to, label, dashed })
/** The question's own grid: its lines (and a shaded region) there from the start. */
function given(x: [number, number], y: [number, number], edges: Edge[], region?: { within: { a: number; b: number; c: number }[]; label?: string }): GraphGrid {
  return { x, y, lines: edges.map(e => ({ ...e, at: -1 })), points: [], ...(region ? { regions: [{ ...region, at: -1 }] } : {}) }
}

// Drawing: y + 1 ≥ 2x (Type 1).
const drawn = add(regions, 'Shade the region that satisfies y + 1 ≥ 2x and mark it with the letter A.', 'Higher A21 Type 1 Example', graphModel('y + 1 ≥ 2x', { x: [-3, 4], y: [-4, 6], lines: [], points: [] }, [
  { title: 'Rearrange', say: 'Take 1 from both sides, so y is on its own and the inequality is in the form y = mx + c.', equation: latex('y \\ge 2x - 1'), adds: 'lines',
    change: (frame, step) => ({ ...frame, working: [{ text: 'y ≥ 2x − 1', family: 0, at: step }] }) },
  { title: 'Draw a solid line', say: 'Draw y = 2x − 1: it crosses the y axis at −1 and goes up 2 for every 1 across. ≥ includes the line, so it is solid.', equation: latex('y = 2x - 1'), adds: 'picture',
    change: (frame, step) => ({ ...frame, lines: [{ from: pt(0, -1), to: pt(1, 1), label: 'y = 2x − 1', at: step }] }) },
  { title: 'Shade above', say: 'Greater than or equal to: shade the side above the line, and mark it A.', equation: latex('y \\ge 2x - 1'), adds: 'answer',
    change: (frame, step) => ({ ...frame, regions: [{ within: [{ a: 2, b: -1, c: 1 }], label: 'A', at: step, answer: true }], answer: { text: 'A: above the solid line y = 2x − 1', at: step } }) },
], 'Shade it'), undefined, undefined, undefined, 'Rearrange to y = mx + c, draw the line (solid or dashed), then shade the right side.')
drawn.content.heading = 'Shade the region'

// Three inequalities: y > 2, x ≥ −1, y < −x + 5 (the Example).
const three = add(regions, 'Shade the region that satisfies y > 2, x ≥ −1 and y < −x + 5. Mark it R.', 'Higher A21 Example', graphModel('y > 2,\\ x ≥ −1,\\ y < −x + 5', { x: [-3, 6], y: [-2, 7], lines: [], points: [] }, [
  { title: 'Draw y = 2', say: '> is not included, so y = 2 is a dashed line across the grid.', equation: latex('y = 2'), adds: 'picture',
    change: (frame, step) => ({ ...frame, lines: [{ from: pt(0, 2), to: pt(1, 2), label: 'y = 2', dashed: true, at: step }] }) },
  { title: 'Draw x = −1', say: '≥ includes the line, so x = −1 is a solid line up and down.', equation: latex('x = -1'), adds: 'picture',
    change: (frame, step) => ({ ...frame, lines: [...(frame.lines ?? []), { from: pt(-1, 0), to: pt(-1, 1), label: 'x = −1', at: step }] }) },
  { title: 'Draw y = −x + 5', say: 'It crosses the y axis at 5 and goes down 1 for every 1 across. < is not included, so it is dashed.', equation: latex('y = -x + 5'), adds: 'picture',
    change: (frame, step) => ({ ...frame, lines: [...(frame.lines ?? []), { from: pt(0, 5), to: pt(5, 0), label: 'y = −x + 5', dashed: true, at: step }] }) },
  { title: 'Shade where all fit', say: 'Above y = 2, to the right of x = −1 and below y = −x + 5. Only the triangle fits all three. Mark it R.', equation: latex('R'), adds: 'answer',
    change: (frame, step) => ({ ...frame, regions: [{ within: [{ a: 0, b: -1, c: -2 }, { a: -1, b: 0, c: 1 }, { a: 1, b: 1, c: 5 }], label: 'R', at: step, answer: true }], answer: { text: 'R: the triangle inside all three lines', at: step } }) },
], 'Shade it'), undefined, undefined, undefined, 'Draw each line, solid or dashed, then shade the one region on the right side of all three.')
three.content.heading = 'Shade the region'

// Determining: y > −2, x ≤ 2, y ≤ 3x − 1 (Type 2).
const shaded = given([-3, 4], [-3, 6], [edge(pt(0, -2), pt(1, -2), 'y = −2', true), edge(pt(2, 0), pt(2, 1), 'x = 2'), edge(pt(0, -1), pt(1, 2), 'y = 3x − 1')],
  { within: [{ a: 0, b: -1, c: 2 }, { a: 1, b: 0, c: 2 }, { a: -3, b: 1, c: -1 }] })
const found = add(regions, 'Find the 3 inequalities that describe the shaded region.', 'Higher A21 Type 2 Example', graphModel('the shaded region', shaded, [
  { title: 'Name the lines', say: 'The line across is y = −2 and the line up and down is x = 2. The sloping line crosses the y axis at −1 and goes up 3 for every 1 across.', equation: latex('y = -2,\\ x = 2,\\ y = 3x - 1'), adds: 'lines',
    change: (frame, step) => ({ ...frame, marks: [mark('y', -2), mark('x', 2), mark('y', -1)], working: [{ text: 'y = −2, x = 2, y = 3x − 1', family: 0, at: step }] }) },
  { title: 'The dashed line', say: 'y = −2 is dashed, so it isn’t included, and the region is above it.', equation: latex('y > -2'), adds: 'lines',
    change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), { text: 'y > −2', family: 0, at: step }] }) },
  { title: 'The solid lines', say: 'x = 2 is solid and the region is to its left. y = 3x − 1 is solid and the region is below it.', equation: latex('x \\le 2,\\ y \\le 3x - 1'), adds: 'answer',
    change: (frame, step) => ({ ...frame, answer: { text: 'y > −2, x ≤ 2 and y ≤ 3x − 1', at: step } }) },
], 'Find them'), undefined, undefined, undefined, 'Find each line’s equation. Dashed means < or >, solid means ≤ or ≥, and the shading says which side.')
found.content.heading = 'Find the 3 inequalities'

onGrid(regions, 'The line x + 2y = 8 is drawn. To show x + 2y ≤ 8, how do you draw the line and which side do you shade?', 'Higher A21 Your Turn Q1', given([-2, 8], [-2, 6], [edge(pt(0, 4), pt(8, 0), 'x + 2y = 8')]),
  choose(['Solid line, shade below', 'Dashed line, shade below', 'Solid line, shade above', 'Dashed line, shade above']), 'Solid line, shade below', 'Rearrange to y = … to see above or below.', {
    kind: 'step-worked', start: 'x + 2y ≤ 8', steps: [
      { title: 'Rearrange', why: 'Take x from both sides, then halve, so y is on its own.', lines: [line([part('x + 2y ≤ 8')], 'y ≤ 4 − ½x')] },
      { title: 'Solid or dashed', why: 'Less than or equal to includes the line itself, so it is solid.', lines: [line([part('≤', 0)], 'solid')] },
      { title: 'Pick the side', why: 'y is less than the line’s value, so the region is below it.', words: 'Solid line, shade below' },
    ],
  })

onGrid(regions, 'Region R satisfies y ≥ 1, y ≤ 3, x > 0 and y > x. Which point is inside R?', 'Higher A21 Your Turn Q2',
  given([-2, 5], [-1, 5], [edge(pt(0, 1), pt(1, 1), 'y = 1'), edge(pt(0, 3), pt(1, 3), 'y = 3'), edge(pt(0, 0), pt(1, 1), 'y = x', true)]),
  choose(['(1, 2)', '(3, 2)', '(−1, 2)', '(1, 4)']), '(1, 2)', 'Check the point against all four inequalities. It must fit every one.', {
    kind: 'step-worked', start: '(1, 2)', steps: [
      { title: 'Check y', why: 'Its y must be from 1 to 3, including both.', lines: [line([part('y', 1)], '2', { eq: true, mark: '✓' })] },
      { title: 'Check x', why: 'Its x must be more than 0.', lines: [line([part('x', 0)], '1', { eq: true, mark: '✓' })] },
      { title: 'Check y > x', why: 'Its y must be bigger than its x. The other points each break one of the rules.', lines: [line([part('2'), sign('>'), part('1')], '(1, 2)', { answer: true })] },
    ],
  })

onGrid(regions, 'A region satisfies y ≤ x + 1, y > −3 and x ≤ 4. Which of its boundary lines are dashed?', 'Higher A21 Your Turn Q3',
  given([-4, 6], [-4, 6], [edge(pt(0, 1), pt(1, 2), 'y = x + 1'), edge(pt(0, -3), pt(1, -3), 'y = −3', true), edge(pt(4, 0), pt(4, 1), 'x = 4')]),
  choose(['Only y = −3', 'y = x + 1 and x = 4', 'All three', 'None of them']), 'Only y = −3', 'Dashed lines go with < and >.', {
    kind: 'step-worked', start: 'y ≤ x + 1, y > −3, x ≤ 4', steps: [
      { title: 'Read each sign', why: 'Less than or equal to includes the line, so it is solid. A strict sign leaves the line out, so it is dashed.', lines: [line([part('≤', 0)], 'solid'), line([part('>', 1)], 'dashed')] },
      { title: 'Pick the dashed', why: 'Only one of the three has a strict sign.', words: 'Only y = −3' },
    ],
  })

onGrid(regions, 'Which three inequalities describe the shaded region?', 'Higher A21 Your Turn Q4 (own region)',
  given([-1, 6], [-1, 6], [edge(pt(1, 0), pt(1, 1), 'x = 1'), edge(pt(0, 4), pt(1, 4), 'y = 4', true), edge(pt(0, 0), pt(1, 1), 'y = x')],
    { within: [{ a: -1, b: 0, c: -1 }, { a: 0, b: 1, c: 4 }, { a: 1, b: -1, c: 0 }] }),
  choose(['x ≥ 1, y < 4, y ≥ x', 'x > 1, y < 4, y ≥ x', 'x ≥ 1, y > 4, y ≥ x', 'x ≥ 1, y < 4, y ≤ x']), 'x ≥ 1, y < 4, y ≥ x', 'Name each line, then check solid or dashed and which side is shaded.', {
    kind: 'step-worked', start: 'the shaded region', steps: [
      { title: 'Name the lines', why: 'One goes up and down, one goes across, and one goes up 1 for every 1 across through the origin.', lines: [line([part('lines')], 'x = 1, y = 4, y = x')] },
      { title: 'Solid or dashed', why: 'The line up and down and the sloping line are solid, so they get “or equal to”. The line across is dashed, so it gets a strict sign.', lines: [line([part('y = 4', 1)], 'dashed')] },
      { title: 'Which side', why: 'The region is to the right of the line up and down, below the line across, and above the sloping line.', words: 'x ≥ 1, y < 4, y ≥ x' },
    ],
  })

onGrid(regions, 'Which inequality describes the sloping edge of the shaded region?', 'Higher A21 Your Turn Q5 (own region)',
  given([-1, 5], [-1, 7], [edge(pt(0, 0), pt(1, 0), 'y = 0', true), edge(pt(3, 0), pt(3, 1), 'x = 3', true), edge(pt(0, 0), pt(1, 2), 'y = 2x')],
    { within: [{ a: 0, b: -1, c: 0 }, { a: 1, b: 0, c: 3 }, { a: -2, b: 1, c: 0 }] }),
  choose(['y ≤ 2x', 'y ≥ 2x', 'y < 2x', 'y ≤ x + 2']), 'y ≤ 2x', 'Find the line’s equation, then check solid or dashed and the side.', {
    kind: 'step-worked', start: 'the sloping edge', steps: [
      { title: 'Find the line', why: 'It goes through the origin and up 2 for every 1 across.', lines: [line([part('gradient', 0)], '2'), line([part('line')], 'y = 2x', { eq: true })] },
      { title: 'Solid or dashed', why: 'The line is solid, so it is included.', lines: [line([part('solid', 1)], '≤ or ≥')] },
      { title: 'Which side', why: 'The shading is below the line.', words: 'y ≤ 2x' },
    ],
  })

const states = a.finish()
export const quadraticInequalities: HigherAddition = { lessonId: 'L025', skill: quadratic, label: 'Quadratic inequalities', states: states.filter(s => s.microSkillId === quadratic) }
export const graphicalInequalities: HigherAddition = { lessonId: 'L025', skill: regions, label: 'Regions on a graph', states: states.filter(s => s.microSkillId === regions) }
