/*
 * Graphs lesson 6H2, Graph transformations (Higher only). From the Higher revision guide, GR10 (pages 127-129, all
 * Level 6-7), written with the function notation f(x):
 * - Skill 1, translation in the x axis: f(x + a) moves the whole graph a to the LEFT, f(x − a) a to the right
 *   (y = −x³ + 4 → y = −(x − 2)³ + 4 is 2 right). Skill 2, translation in the y axis: f(x) + b moves it up b
 *   (y = (x − 3)² + 1 → y = (x − 3)² + 4 is up 3). Example 1: f(x) = x², sketch f(x) + 4 and f(x + 1).
 * - Skill 3, reflection in the y axis: f(−x) (y = 2x + 4 → y = −2x + 4). Skill 4, reflection in the x axis: −f(x)
 *   (sin x → −sin x). Example 2: f(x) = x² − 3x, sketch f(−x) = x² + 3x and −f(x) = −x² + 3x.
 * - Your Turn: Q1 f(x) = 1/x, sketch f(x − 3); Q2 f(x) = x² − x − 6, sketch −f(x) + 4; Q3 f(x) through (−3, 0), (0, 6)
 *   and (2, 0), sketch f(−x) and mark the new points.
 * The app can't take a freehand sketch, so every sketch is a worked example drawn a move at a time (the original curve
 * plain, the transformed one green), and the questions ask where a point moves to (tapped on the board), which
 * transformation was used, or the new equation. Book slip: Q2's picture labels f(x) as "x² − x − 6x"; the question
 * itself says f(x) = x² − x − 6, which is what is drawn here.
 */
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import type { GraphFrame, GraphPoint } from '../../written-methods/tutor/methodWorking'
import type { CurveFn } from '../../written-methods/tutor/curves'
import type { StepWorking } from '../../written-methods/tutor/stepWorking'
import { line, part, sign } from '../../written-methods/tutor/stepWorking'
import type { MicroSkillId } from '../../number-types/types'
import { latex } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, mark, pt, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'
import { at } from '../../curve-graphs/tutor/curveWorkings'
import { choose, screens, text } from './helpers'

const a = author(106.6, 'L106H2')
const { add, finish } = a
const { practice, graph } = screens(a)

const translations = 'graph-translations'
const reflections = 'graph-reflections'

const show = (n: number) => String(n).replace('-', '−')
const pair = (p: GraphPoint) => `(${show(p.x)}, ${show(p.y)})`

/* ---------- Drawing ---------- */

type Curve = NonNullable<GraphFrame['curves']>[number]
type Shape = Omit<Curve, 'at'>
/** A polynomial curve, [constant, x, x², x³], or a function (1/x, sin) with its translations and flip. */
const poly = (coeffs: number[], from: number, to: number, label?: string): Shape => ({ coeffs, from, to, label })
const fnCurve = (fn: CurveFn, from: number, to: number, label?: string): Shape => ({ coeffs: [], fn, from, to, label })
/** The question's own curve, there from the start and never greyed. */
const given = (shape: Shape): Curve => ({ ...shape, at: -1 })
const grid = (x: [number, number], y: [number, number], extra: Partial<GraphGrid> = {}): GraphGrid => ({ x, y, lines: [], points: [], ...extra })

/** Moves: a line of working under the grid, reading what the change in the rule does. */
const read = (title: string, say: string, equation: string, working: string): GraphMove => ({
  title, say, equation: latex(equation), adds: 'lines',
  change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), { text: working, family: 0, at: step }] }),
})
/**
 * Moves: points carried to where the transformation puts them, each with its step across (amber) or up and down (biro
 * blue) and the new point's coordinates.
 */
const carry = (pairs: [GraphPoint, GraphPoint][], title: string, say: string): GraphMove => ({
  title, say, equation: latex(pairs.map(([, to]) => pair(to)).join(', ')), adds: 'picture',
  change: (frame, step) => ({
    ...frame,
    marks: pairs.flatMap(([from, to]) => [...(from.x !== to.x ? [mark('x', to.x)] : []), ...(from.y !== to.y ? [mark('y', to.y)] : [])]),
    legs: [...(frame.legs ?? []), ...pairs.flatMap(([from, to]) => [
      ...(from.x !== to.x ? [{ from, to: pt(to.x, from.y), label: show(to.x - from.x), family: 1, at: step }] : []),
      ...(from.y !== to.y ? [{ from: pt(to.x, from.y), to, label: show(to.y - from.y), family: 0, at: step }] : []),
    ])],
    points: [...(frame.points ?? []), ...pairs.map(([, to]) => ({ ...to, at: step, label: pair(to) }))],
  }),
})
/** Moves: a curve drawn through the moved points; as the last move, green with the answer. */
const sketch = (shape: Shape, title: string, say: string, equation: string, answer?: string): GraphMove => {
  const move: GraphMove = {
    title, say, equation: latex(equation), adds: 'picture',
    change: (frame, step) => ({ ...frame, legs: [], curves: [...(frame.curves ?? []), { ...shape, at: step, answer: !!answer }] }),
  }
  return answer ? answerMove(answer, title, say, [], { ...move, adds: 'answer' }) : move
}

/** A question answered by tapping a point on the board, with the grid (and its curve) on the board. */
function tap(topic: MicroSkillId, title: string, sourceRef: string, board: GraphGrid, answer: GraphPoint, hint: string, model: StepWorking) {
  const state = practice(topic, title, sourceRef, at(answer), pair(answer), hint, model)
  state.board = { mode: 'plot', grid: board }
  return state
}

/* ---------- Section 1: translations (Skills 1 and 2) ---------- */

add(translations, 'Graph transformations', 'Higher GR10 Graph Transformations', text(
  'A transformation changes a graph. We call the graph’s rule f(x), so y = f(x).',
  'f(x + a) moves the whole graph a to the LEFT. f(x − a) moves it a to the right. Inside the bracket works backwards.',
  'f(x) + b moves the whole graph up b, and f(x) − b moves it down b. Outside the bracket works the way it looks.',
  'Moving a graph is called a translation. Its shape stays exactly the same.',
))

graph(translations, 'y = −x³ + 4 becomes y = −(x − 2)³ + 4. How does the graph move?', 'Higher GR10 Skill 1', 'y = -(x - 2)^3 + 4',
  grid([-3, 6], [-3, 8], { curves: [given(poly([4, 0, 0, -1], -3, 6, 'y = −x³ + 4'))], points: [{ ...pt(0, 4), at: -1, label: '(0, 4)' }] }), [
    read('Read the bracket', 'x has had 2 taken away inside the bracket: this is f(x − 2). Inside the bracket works backwards, so the graph moves 2 to the right, not the left.', 'f(x - 2)', 'f(x − 2): 2 to the right'),
    carry([[pt(0, 4), pt(2, 4)]], 'Move a point', 'Every point moves 2 to the right, and its y stays the same: (0, 4) goes to (2, 4).'),
    sketch(poly([12, -12, 6, -1], -3, 6), 'Draw it moved', 'Draw the same shape through the moved point. The whole graph has slid 2 to the right.', 'y = -(x - 2)^3 + 4', '2 to the right'),
  ], 'Move it', 'Translate the graph',
  'Something added or taken away inside the bracket moves the graph left or right, the opposite way to its sign.')

graph(translations, 'y = (x − 3)² + 1 becomes y = (x − 3)² + 4. How does the graph move?', 'Higher GR10 Skill 2', 'y = (x - 3)^2 + 4',
  grid([-1, 8], [-1, 10], { curves: [given(poly([10, -6, 1], -1, 8, 'y = (x − 3)² + 1'))], points: [{ ...pt(3, 1), at: -1, label: '(3, 1)' }] }), [
    read('Outside the bracket', '(x − 3)² + 4 is (x − 3)² + 1 with 3 more added on the end: f(x) + 3. Adding outside the bracket adds to every y, so the graph moves up 3.', 'f(x) + 3', 'f(x) + 3: up 3'),
    carry([[pt(3, 1), pt(3, 4)]], 'Move a point', 'Every point moves up 3, and its x stays the same: the lowest point (3, 1) goes to (3, 4).'),
    sketch(poly([13, -6, 1], -1, 8), 'Draw it moved', 'Draw the same U through the moved point. The whole graph has slid up 3.', 'y = (x - 3)^2 + 4', 'up 3'),
  ], 'Move it', 'Translate the graph',
  'A number added on the end, outside the bracket, moves the graph up (or down if it is taken away).')

graph(translations, 'f(x) = x². Sketch the graphs of f(x), f(x) + 4 and f(x + 1) on the same axes.', 'Higher GR10 Example 1', 'f(x) + 4,\\ f(x + 1)',
  grid([-5, 4], [-1, 9], { curves: [given(poly([0, 0, 1], -5, 4, 'f(x) = x²'))] }), [
    read('Recall y = x²', 'y = x² is a U with its lowest point at the origin, (0, 0). Both new graphs are this U, moved.', 'f(x) = x^2', 'f(x) = x²: a U through (0, 0)'),
    carry([[pt(0, 0), pt(0, 4)]], 'f(x) + 4 is up 4', 'f(x) + 4 = x² + 4 adds 4 to every y, so the whole U moves up 4. Its lowest point goes to (0, 4).'),
    sketch(poly([4, 0, 1], -5, 4, 'f(x) + 4'), 'Draw f(x) + 4', 'The same U, with its lowest point at (0, 4).', 'f(x) + 4 = x^2 + 4'),
    carry([[pt(0, 0), pt(-1, 0)]], 'f(x + 1) is left 1', 'f(x + 1) = (x + 1)² adds 1 inside the bracket, so the U moves 1 to the LEFT. Its lowest point goes to (−1, 0).'),
    sketch(poly([1, 2, 1], -5, 4, 'f(x + 1)'), 'Draw f(x + 1)', 'The same U, with its lowest point at (−1, 0). Label each graph.', 'f(x + 1) = (x + 1)^2', 'f(x) + 4 is up 4; f(x + 1) is 1 left'),
  ], 'Sketch them', 'Sketch the translations',
  'f(x) + 4 adds 4 to every y: up 4. f(x + 1) adds 1 inside the bracket: 1 to the left.')

// Your Turn Q1: f(x) = 1/x moved 3 right; its asymptote, the y axis, moves to x = 3.
const recip = fnCurve({ kind: 'reciprocal' }, -3, 7, 'f(x) = 1/x')
const recipGrid = grid([-3, 7], [-4, 4], { curves: [given(recip)], points: [{ ...pt(1, 1), at: -1, label: '(1, 1)' }, { ...pt(-1, -1), at: -1, label: '(−1, −1)' }] })
graph(translations, 'f(x) = 1/x. Sketch the graph of f(x − 3).', 'Higher GR10 Your Turn Q1', 'f(x - 3)', recipGrid, [
  read('Read the bracket', 'x − 3 inside the bracket: inside works backwards, so the whole graph moves 3 to the right.', 'f(x - 3)', 'f(x − 3): 3 to the right'),
  carry([[pt(1, 1), pt(4, 1)], [pt(-1, -1), pt(2, -1)]], 'Move the points', 'Each point moves 3 to the right: (1, 1) goes to (4, 1) and (−1, −1) goes to (2, −1).'),
  {
    title: 'Move the asymptote', say: '1/x never touches the y axis, x = 0. That line moves 3 right too, so the new graph never touches x = 3. Draw it dashed.',
    equation: latex('x = 3'), adds: 'picture',
    change: (frame, step) => ({ ...frame, legs: [], marks: [mark('x', 3)], lines: [...(frame.lines ?? []), { from: pt(3, 0), to: pt(3, 1), label: 'x = 3', dashed: true, at: step }] }),
  },
  sketch(fnCurve({ kind: 'reciprocal', h: -3 }, -3, 7), 'Draw it moved', 'Draw the same two curves through the moved points, getting closer and closer to x = 3 without touching it.', 'y = 1/(x - 3)', '3 to the right, never touching x = 3'),
], 'Sketch it', 'Sketch the translation', 'Inside the bracket works backwards: x − 3 moves the graph 3 to the right, asymptote and all.')

tap(translations, 'f(x) = 1/x passes through (1, 1). Tap where (1, 1) moves to on the graph of y = f(x − 3).', 'Higher GR10 Your Turn Q1', recipGrid, pt(4, 1),
  'Inside the bracket works backwards.', {
    kind: 'step-worked', start: 'y = f(x − 3)', steps: [
      { title: 'Read the bracket', why: 'Taking away inside the bracket moves the graph right, by the number taken away.', lines: [line([part('f(x − 3)', 0)], '3 right')] },
      { title: 'Move the point', why: 'Only x changes. Add three to it, and y stays the same.', lines: [line([part('1'), sign('+'), part('3')], '4'), line([part('(1, 1)')], '(4, 1)', { answer: true })] },
    ],
  })
practice(translations, 'f(x) = 1/x never touches the line x = 0. Which line does the graph of y = f(x − 3) never touch?', 'Higher GR10 Your Turn Q1',
  choose(['x = 3', 'x = −3', 'y = 3', 'y = −3']), 'x = 3', 'The whole graph moves, and so does the line it never touches.', {
    kind: 'step-worked', start: 'y = f(x − 3)', steps: [
      { title: 'Read the bracket', why: 'Taking away inside the bracket moves the graph right.', lines: [line([part('f(x − 3)', 0)], '3 right')] },
      { title: 'Move the asymptote', why: 'The line up and down that it never touches moves three to the right too.', lines: [line([part('0'), sign('+'), part('3')], '3'), line([part('x = 0')], 'x = 3', { answer: true })] },
    ],
  })

tap(translations, 'f(x) = x² − 4 passes through (2, 0). Tap where (2, 0) moves to on the graph of y = f(x + 3).', 'Higher GR10 extra practice',
  grid([-6, 4], [-5, 5], { curves: [given(poly([-4, 0, 1], -6, 4, 'f(x) = x² − 4'))], points: [{ ...pt(2, 0), at: -1, label: '(2, 0)' }] }), pt(-1, 0),
  'Plus inside the bracket moves it left.', {
    kind: 'step-worked', start: 'y = f(x + 3)', steps: [
      { title: 'Read the bracket', why: 'Adding inside the bracket moves the graph left, by the number added.', lines: [line([part('f(x + 3)', 0)], '3 left')] },
      { title: 'Move the point', why: 'Only x changes. Take three from it, and y stays the same.', lines: [line([part('2'), sign('−'), part('3')], '−1'), line([part('(2, 0)')], '(−1, 0)', { answer: true })] },
    ],
  })
tap(translations, 'f(x) = x² passes through (1, 1). Tap where (1, 1) moves to on the graph of y = f(x) − 3.', 'Higher GR10 extra practice',
  grid([-5, 5], [-4, 6], { curves: [given(poly([0, 0, 1], -5, 5, 'f(x) = x²'))], points: [{ ...pt(1, 1), at: -1, label: '(1, 1)' }] }), pt(1, -2),
  'Outside the bracket moves it up or down.', {
    kind: 'step-worked', start: 'y = f(x) − 3', steps: [
      { title: 'Outside the bracket', why: 'Taking away outside the bracket takes it from every y, so the graph moves down.', lines: [line([part('f(x) − 3', 0)], '3 down')] },
      { title: 'Move the point', why: 'Only y changes. Take three from it, and x stays the same.', lines: [line([part('1'), sign('−'), part('3')], '−2'), line([part('(1, 1)')], '(1, −2)', { answer: true })] },
    ],
  })
tap(translations, 'f(x) = x³ + 3 passes through (−1, 2). Tap where (−1, 2) moves to on the graph of y = f(x − 2) + 1.', 'Higher GR10 extra practice',
  grid([-4, 5], [-3, 7], { curves: [given(poly([3, 0, 0, 1], -4, 5, 'f(x) = x³ + 3'))], points: [{ ...pt(-1, 2), at: -1, label: '(−1, 2)' }] }), pt(1, 3),
  'Do the inside of the bracket and the outside separately.', {
    kind: 'step-worked', start: 'y = f(x − 2) + 1', steps: [
      { title: 'Inside the bracket', why: 'Taking away inside the bracket moves the graph right. Add it to x.', lines: [line([part('−1'), sign('+'), part('2')], '1')] },
      { title: 'Outside the bracket', why: 'Adding outside the bracket moves the graph up. Add it to y.', lines: [line([part('2'), sign('+'), part('1')], '3'), line([part('(−1, 2) moved')], '(1, 3)', { answer: true })] },
    ],
  })

practice(translations, 'The graph of y = f(x) is changed to y = f(x − 5). What happens to the graph?', 'Higher GR10 extra practice',
  choose(['It moves 5 to the right', 'It moves 5 to the left', 'It moves up 5', 'It moves down 5']), 'It moves 5 to the right', 'The change is inside the bracket.', {
    kind: 'step-worked', start: 'y = f(x − 5)', steps: [
      { title: 'Inside or outside', why: 'The change is inside the bracket, so the graph moves left or right.', lines: [line([part('x − 5', 0)], 'left or right')] },
      { title: 'Which way', why: 'Inside the bracket works backwards: taking away moves it right.', words: 'It moves 5 to the right' },
    ],
  })
practice(translations, 'The graph of y = x² is moved 3 to the left. What is its new equation?', 'Higher GR10 extra practice',
  choose(['y = (x + 3)²', 'y = (x − 3)²', 'y = x² + 3', 'y = x² − 3']), 'y = (x + 3)²', 'Left means inside the bracket, the opposite way to how it looks.', {
    kind: 'step-worked', start: 'y = x², 3 left', steps: [
      { title: 'Inside the bracket', why: 'Moving left or right changes x inside the bracket: f(x + a) or f(x − a).', lines: [line([part('3 left', 0)], 'f(x + 3)')] },
      { title: 'Put it in', why: 'Replace every x in the rule with the bracket.', lines: [line([part('f(x + 3)')], 'y = (x + 3)²', { eq: true, answer: true })] },
    ],
  })
practice(translations, 'The graph of y = x² + 2x is moved down 5. What is its new equation?', 'Higher GR10 extra practice',
  choose(['y = x² + 2x − 5', 'y = x² + 2x + 5', 'y = (x − 5)² + 2(x − 5)', 'y = (x + 5)² + 2(x + 5)']), 'y = x² + 2x − 5', 'Up and down is outside the bracket.', {
    kind: 'step-worked', start: 'y = x² + 2x, down 5', steps: [
      { title: 'Outside the bracket', why: 'Moving up or down adds to, or takes from, every y: f(x) + b or f(x) − b.', lines: [line([part('5 down', 0)], 'f(x) − 5')] },
      { title: 'Take 5 away', why: 'Take it away from the whole rule.', lines: [line([part('f(x) − 5')], 'y = x² + 2x − 5', { eq: true, answer: true })] },
    ],
  })

/* ---------- Section 2: reflections (Skills 3 and 4) ---------- */

add(reflections, 'Reflecting a graph', 'Higher GR10 Skills 3 and 4', text(
  'f(−x) reflects the graph in the y axis: every x changes sign, so the left and right sides swap over.',
  '−f(x) reflects the graph in the x axis: every y changes sign, so the graph turns upside down.',
  'A point on the mirror line stays where it is.',
  'For f(−x), put (−x) in place of every x. For −f(x), change the sign of every term.',
))

graph(reflections, 'y = 2x + 4 becomes y = −2x + 4. How does the graph change?', 'Higher GR10 Skill 3', 'y = -2x + 4',
  grid([-5, 5], [-3, 8], { lines: [{ from: pt(-2, 0), to: pt(0, 4), label: 'y = 2x + 4', at: -1 }], points: [{ ...pt(-2, 0), at: -1, label: '(−2, 0)' }, { ...pt(0, 4), at: -1, label: '(0, 4)' }] }), [
    read('Spot the change', 'Every x has become −x: 2(−x) + 4 = −2x + 4. That is f(−x), a reflection in the y axis.', 'f(-x) = -2x + 4', 'f(−x) = −2x + 4'),
    carry([[pt(-2, 0), pt(2, 0)]], 'Flip the points', 'Each x changes sign, so (−2, 0) goes across to (2, 0). (0, 4) is on the y axis, the mirror, so it stays.'),
    {
      ...answerMove('reflected in the y axis', 'Draw it reflected', 'Join (0, 4) and (2, 0). The line slopes the other way: the left and right sides have swapped.'),
      change: (frame, step) => ({ ...frame, legs: [], lines: [...(frame.lines ?? []), { from: pt(0, 4), to: pt(2, 0), label: 'y = −2x + 4', at: step, answer: true }], answer: { text: 'reflected in the y axis', at: step } }),
    },
  ], 'Reflect it', 'Reflect the graph',
  'Changing every x to −x swaps the left and right sides: a reflection in the y axis.')

const trigScale: GraphGrid['scale'] = { x: { per: 45, every: 2, start: 0, unit: '°', name: 'x' }, y: { per: 0.25, every: 2, start: 0, name: 'y' } }
graph(reflections, 'y = sin x becomes y = −sin x. How does the graph change?', 'Higher GR10 Skill 4', 'y = −sin x',
  grid([-45, 450], [-1.25, 1.5], { scale: trigScale, curves: [given(fnCurve({ kind: 'sin' }, 0, 360, 'y = sin x'))], points: [{ ...pt(90, 1), at: -1, label: '(90, 1)' }, { ...pt(270, -1), at: -1, label: '(270, −1)' }] }), [
    read('Spot the change', 'The whole rule has a minus in front: −f(x). Every y changes sign, so it is a reflection in the x axis.', '-f(x)', '−f(x): every y changes sign'),
    carry([[pt(90, 1), pt(90, -1)], [pt(270, -1), pt(270, 1)]], 'Flip the points', 'The peak (90, 1) goes down to (90, −1), and the lowest point (270, −1) comes up to (270, 1). Points on the x axis stay.'),
    sketch(fnCurve({ kind: 'sin', a: -1 }, 0, 360), 'Draw it reflected', 'Draw the same wave through the flipped points. It is the sine wave upside down.', 'y = −sin x', 'reflected in the x axis'),
  ], 'Reflect it', 'Reflect the graph',
  'A minus in front of the whole rule changes the sign of every y: a reflection in the x axis.')

graph(reflections, 'f(x) = x² − 3x. Sketch the graphs of f(x), f(−x) and −f(x) on the same axes.', 'Higher GR10 Example 2', 'f(-x),\\ -f(x)',
  grid([-5, 5], [-5, 5], { curves: [given(poly([0, -3, 1], -5, 5, 'f(x) = x² − 3x'))], points: [{ ...pt(3, 0), at: -1, label: '(3, 0)' }] }), [
    read('Work out f(−x)', 'Put (−x) in place of every x: (−x)² − 3(−x) = x² + 3x.', 'f(-x) = x^2 + 3x', 'f(−x) = (−x)² − 3(−x) = x² + 3x'),
    carry([[pt(3, 0), pt(-3, 0)]], 'Reflect in y', 'Every x changes sign, so the root (3, 0) goes across to (−3, 0). The origin is on the mirror, so it stays.'),
    sketch(poly([0, 3, 1], -5, 5, 'f(−x)'), 'Draw f(−x)', 'The same U, flipped left to right, through (−3, 0) and (0, 0).', 'f(-x) = x^2 + 3x'),
    read('Work out −f(x)', 'Change the sign of every term: −(x² − 3x) = −x² + 3x.', '-f(x) = -x^2 + 3x', '−f(x) = −(x² − 3x) = −x² + 3x'),
    sketch(poly([0, 3, -1], -5, 5, '−f(x)'), 'Draw −f(x)', 'Every y changes sign, so the U turns upside down. The roots (0, 0) and (3, 0) are on the x axis, the mirror, so they stay.', '-f(x) = -x^2 + 3x', 'f(−x) is flipped left to right; −f(x) is upside down'),
  ], 'Sketch them', 'Sketch the reflections',
  'f(−x) puts −x in for x: a reflection in the y axis. −f(x) changes every sign: a reflection in the x axis.')

const quad = poly([3, -4, 1], -5, 5, 'f(x) = x² − 4x + 3')
tap(reflections, 'f(x) = x² − 4x + 3 passes through (4, 3). Tap where (4, 3) moves to on the graph of y = f(−x).', 'Higher GR10 extra practice',
  grid([-5, 5], [-3, 7], { curves: [given(quad)], points: [{ ...pt(4, 3), at: -1, label: '(4, 3)' }] }), pt(-4, 3),
  'f(−x) is a reflection in the y axis.', {
    kind: 'step-worked', start: 'y = f(−x)', steps: [
      { title: 'Which mirror', why: 'A minus on the x inside the bracket reflects the graph in the y axis.', lines: [line([part('f(−x)', 0)], 'reflect in y axis')] },
      { title: 'Flip the x', why: 'Every x changes sign, and y stays the same.', lines: [line([part('(4, 3)')], '(−4, 3)', { answer: true })] },
    ],
  })
tap(reflections, 'f(x) = x² − 4x + 3 passes through (0, 3). Tap where (0, 3) moves to on the graph of y = −f(x).', 'Higher GR10 extra practice',
  grid([-3, 6], [-5, 5], { curves: [given(quad)], points: [{ ...pt(0, 3), at: -1, label: '(0, 3)' }] }), pt(0, -3),
  '−f(x) is a reflection in the x axis.', {
    kind: 'step-worked', start: 'y = −f(x)', steps: [
      { title: 'Which mirror', why: 'A minus in front of the whole rule reflects the graph in the x axis.', lines: [line([part('−f(x)', 0)], 'reflect in x axis')] },
      { title: 'Flip the y', why: 'Every y changes sign, and x stays the same.', lines: [line([part('(0, 3)')], '(0, −3)', { answer: true })] },
    ],
  })

practice(reflections, 'The graph of y = f(x) is changed to y = −f(x). What happens to the graph?', 'Higher GR10 extra practice',
  choose(['It is reflected in the x axis', 'It is reflected in the y axis', 'It moves down 1', 'It moves 1 to the left']), 'It is reflected in the x axis', 'Which part has the minus: the whole rule, or the x?', {
    kind: 'step-worked', start: 'y = −f(x)', steps: [
      { title: 'Find the minus', why: 'The minus is in front of the whole rule, so every y changes sign.', lines: [line([part('−f(x)', 0)], 'y changes sign')] },
      { title: 'Name it', why: 'Every y changing sign turns the graph upside down over the x axis.', words: 'It is reflected in the x axis' },
    ],
  })
practice(reflections, 'The graph of y = f(x) is changed to y = f(−x). What happens to the graph?', 'Higher GR10 extra practice',
  choose(['It is reflected in the y axis', 'It is reflected in the x axis', 'It moves down 1', 'It moves 1 to the left']), 'It is reflected in the y axis', 'Which part has the minus: the whole rule, or the x?', {
    kind: 'step-worked', start: 'y = f(−x)', steps: [
      { title: 'Find the minus', why: 'The minus is on the x inside the bracket, so every x changes sign.', lines: [line([part('f(−x)', 0)], 'x changes sign')] },
      { title: 'Name it', why: 'Every x changing sign swaps the left and right sides over the y axis.', words: 'It is reflected in the y axis' },
    ],
  })
practice(reflections, 'f(x) = x² + 5x − 1. Which is the equation of y = f(−x)?', 'Higher GR10 extra practice',
  choose(['y = x² − 5x − 1', 'y = −x² − 5x + 1', 'y = −x² + 5x − 1', 'y = x² + 5x + 1']), 'y = x² − 5x − 1', 'Put (−x) in place of every x.', {
    kind: 'step-worked', start: 'f(x) = x² + 5x − 1', steps: [
      { title: 'Put in −x', why: 'Replace every x with minus x, in brackets.', lines: [line([part('f(−x)', 0)], '(−x)² + 5(−x) − 1', { eq: true })] },
      { title: 'Tidy the signs', why: 'A negative squared is positive, and five lots of minus x is minus five x.', lines: [line([part('(−x)² + 5(−x) − 1')], 'y = x² − 5x − 1', { eq: true, answer: true })] },
    ],
  })

// Your Turn Q3: f(x) through (−3, 0), (0, 6) and (2, 0) is −(x + 3)(x − 2) = −x² − x + 6; f(−x) = −x² + x + 6.
const q3Grid = grid([-5, 5], [-3, 7], {
  curves: [given(poly([6, -1, -1], -5, 5, 'y = f(x)'))],
  points: [{ ...pt(-3, 0), at: -1, label: '(−3, 0)' }, { ...pt(0, 6), at: -1, label: '(0, 6)' }, { ...pt(2, 0), at: -1, label: '(2, 0)' }],
})
graph(reflections, 'The graph of f(x) goes through (−3, 0), (0, 6) and (2, 0). Sketch f(−x) and mark where these points go.', 'Higher GR10 Your Turn Q3', 'f(-x)', q3Grid, [
  read('Which mirror', 'f(−x) changes the sign of every x: a reflection in the y axis. Every y stays the same.', 'f(-x)', 'f(−x): reflect in the y axis'),
  carry([[pt(-3, 0), pt(3, 0)], [pt(2, 0), pt(-2, 0)]], 'Flip the points', '(−3, 0) goes to (3, 0) and (2, 0) goes to (−2, 0). (0, 6) is on the y axis, the mirror, so it stays.'),
  sketch(poly([6, 1, -1], -5, 5), 'Draw it reflected', 'Draw the same upside-down U through (−2, 0), (0, 6) and (3, 0).', '(3, 0),\\ (0, 6),\\ (-2, 0)', '(3, 0), (0, 6), (−2, 0)'),
], 'Reflect it', 'Reflect the graph', 'Change the sign of each x. A point on the y axis stays where it is.')
practice(reflections, 'The graph of f(x) goes through (−3, 0), (0, 6) and (2, 0). Where do these points go on the graph of y = f(−x)?', 'Higher GR10 Your Turn Q3',
  choose(['(3, 0), (0, 6), (−2, 0)', '(−3, 0), (0, −6), (2, 0)', '(3, 0), (0, −6), (−2, 0)', '(−3, 6), (0, 0), (2, 6)']), '(3, 0), (0, 6), (−2, 0)', 'f(−x) reflects in the y axis: change the sign of each x.', {
    kind: 'step-worked', start: 'y = f(−x)', steps: [
      { title: 'Which mirror', why: 'A minus on the x inside the bracket reflects the graph in the y axis.', lines: [line([part('f(−x)', 0)], 'x changes sign')] },
      { title: 'Flip each point', why: 'Change the sign of each x and keep each y. Zero stays zero, so the point on the y axis doesn’t move.', lines: [
        line([part('(−3, 0) flipped')], '(3, 0)'), line([part('(2, 0) flipped')], '(−2, 0)'),
        line([part('the three points')], '(3, 0), (0, 6), (−2, 0)', { answer: true }),
      ] },
    ],
  })

// Your Turn Q2: f(x) = x² − x − 6 = (x + 2)(x − 3); −f(x) + 4 = −x² + x + 10.
const q2Grid = grid([-4, 5], [-8, 12], { yStep: 2, curves: [given(poly([-6, -1, 1], -4, 5, 'f(x) = x² − x − 6'))], points: [{ ...pt(-2, 0), at: -1, label: '(−2, 0)' }, { ...pt(3, 0), at: -1, label: '(3, 0)' }, { ...pt(0, -6), at: -1, label: '(0, −6)' }] })
graph(reflections, 'f(x) = x² − x − 6. Sketch the graph of −f(x) + 4.', 'Higher GR10 Your Turn Q2', '-f(x) + 4', q2Grid, [
  read('Two changes', 'The minus in front of f(x) reflects it in the x axis. Then + 4 outside moves it up 4. Do them in that order.', '-f(x) + 4', '−f(x): reflect in x axis, then + 4: up 4'),
  carry([[pt(0, -6), pt(0, 6)]], 'Reflect in x', 'Every y changes sign: (0, −6) goes up to (0, 6). The roots (−2, 0) and (3, 0) are on the mirror, so they stay.'),
  sketch(poly([6, 1, -1], -4, 5), 'Draw −f(x)', 'The same U, upside down, through (−2, 0), (0, 6) and (3, 0).', '-f(x) = -x^2 + x + 6'),
  carry([[pt(-2, 0), pt(-2, 4)], [pt(0, 6), pt(0, 10)], [pt(3, 0), pt(3, 4)]], 'Up 4', 'Add 4 to every y: (−2, 4), (0, 10) and (3, 4).'),
  sketch(poly([10, 1, -1], -4, 5), 'Draw it moved', 'The upside-down U, moved up 4, through (−2, 4), (0, 10) and (3, 4).', '-f(x) + 4 = -x^2 + x + 10', 'upside down, through (−2, 4), (0, 10), (3, 4)'),
], 'Sketch it', 'Reflect, then translate', 'Reflect in the x axis first (every y changes sign), then move up 4.')
tap(reflections, 'f(x) = x² − x − 6 crosses the y axis at (0, −6). Tap where the graph of y = −f(x) + 4 crosses the y axis.', 'Higher GR10 Your Turn Q2', q2Grid, pt(0, 10),
  'Reflect in the x axis first, then move up.', {
    kind: 'step-worked', start: 'y = −f(x) + 4', steps: [
      { title: 'Reflect in x', why: 'The minus in front of the rule changes the sign of every y.', lines: [line([part('−(−6)')], '6')] },
      { title: 'Move up 4', why: 'Adding outside the bracket adds to every y. The x stays zero.', lines: [line([part('6'), sign('+'), part('4')], '10'), line([part('(0, −6)')], '(0, 10)', { answer: true })] },
    ],
  })

add('mixed', 'Graph transformations', 'Higher GR10 consolidation', text(
  'f(x + a) moves the graph a to the left, and f(x − a) moves it a to the right: inside the bracket works backwards.',
  'f(x) + b moves it up b, and f(x) − b moves it down b.',
  'f(−x) reflects it in the y axis, and −f(x) reflects it in the x axis.',
  'To sketch one, move a few key points (roots, turning points, crossings), then draw the same shape through them.',
))

export const tutorGraphTransformationsLesson: TutorMethodLesson = {
  id: 'L106H2', number: 106.6, title: 'Graph transformations', level: 'GCSE Higher', graphCard: true,
  goal: 'Translate and reflect a graph using f(x) notation, and say where its points move to.',
  labels: { [translations]: 'Translations', [reflections]: 'Reflections', mixed: 'Review' },
  states: finish(),
}
