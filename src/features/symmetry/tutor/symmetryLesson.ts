import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigurePoint } from '../../written-methods/tutor/methodWorking'
import { SHAPES, foldsThatFit, turnsThatFit, type MeasureShape } from '../../written-methods/tutor/MeasureBoard'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text, type BoardMove } from '../../simultaneous-equations/tutor/boardWorkings'
import { fig, screens, slips } from '../../geometry/tutor/figureLesson'

/*
 * Geometry lesson 5: Symmetry. From GM5 in Sunny's revision book (p124–125). Three rungs: lines of symmetry (fold it
 * and it fits); rotational symmetry (turn it and count how often it fits in a full turn); and both together, as the
 * book's table and Your Turn questions ask. Built like lessons 1 to 4 (Sunny, 9 Oct: interactive, factual, step by
 * step): each rung opens on the measuring board, where you fold or turn the shape yourself and the fits are collected.
 * Every answer here is worked out from the shape itself: the board's own fit test (MeasureBoard.tsx) counts the
 * lines and the turns, and the verify script checks the lesson against it.
 *
 * Hidden on live like lessons 1 to 4: only the unlisted Geometry shelf (src/features/geometry/geometryLessons.ts)
 * opens it.
 */

const lesson = author(205)
const { add, finish } = lesson
const { explore, worked, practice } = screens(lesson)
const lines = 'geometry-lines-symmetry'
const rotation = 'geometry-rotational-symmetry'
const both = 'geometry-symmetry-both'

/* ---------- Pictures ---------- */

const NAME: Record<MeasureShape, string> = { square: 'square', rectangle: 'rectangle', equilateral: 'equilateral triangle', isosceles: 'isosceles triangle', pentagon: 'regular pentagon', hexagon: 'regular hexagon', parallelogram: 'parallelogram', rhombus: 'rhombus', kite: 'kite', trapezium: 'isosceles trapezium' }
const outline = (shape: MeasureShape): FigurePoint[] => SHAPES[shape].map(p => [p.x, p.y])
const reach = (shape: MeasureShape) => Math.max(...SHAPES[shape].map(p => Math.hypot(p.x, p.y))) * 1.18
const mirrorAt = (shape: MeasureShape, deg: number, style: 'mirror' | 'lit' = 'mirror'): FigureItem => {
  const r = reach(shape), c = Math.cos(deg * Math.PI / 180) * r, s = Math.sin(deg * Math.PI / 180) * r
  return { kind: 'line', from: [-c, -s], to: [c, s], style }
}
/** A shape, with any of its lines of symmetry drawn red and dashed. */
const shapeFig = (shape: MeasureShape, mirrors: number[] = [], caption?: string, more: FigureItem[] = []): AngleFrame => fig(
  [{ kind: 'shape', points: outline(shape) }, ...mirrors.map(m => mirrorAt(shape, m)), ...more],
  `A ${NAME[shape]}${mirrors.length ? `, with ${mirrors.length} line${mirrors.length === 1 ? '' : 's'} of symmetry drawn as red dashed lines` : ''}.`, caption)
/** The book's question 5: a circle with 8 triangles round it, evenly spaced. */
function sun(mirrors: number[] = [], caption?: string): AngleFrame {
  const tri = (k: number): FigurePoint[] => {
    const a = (k * 45) * Math.PI / 180, u = [Math.cos(a), Math.sin(a)], n = [-u[1], u[0]]
    return [[u[0] * 1.15 + n[0] * 0.28, u[1] * 1.15 + n[1] * 0.28], [u[0] * 1.62, u[1] * 1.62], [u[0] * 1.15 - n[0] * 0.28, u[1] * 1.15 - n[1] * 0.28]]
  }
  return fig([
    { kind: 'circle', centre: [0, 0], r: 0.95 }, ...Array.from({ length: 8 }, (_, k): FigureItem => ({ kind: 'shape', points: tri(k) })),
    ...mirrors.map((m): FigureItem => ({ kind: 'line', from: [-1.8 * Math.cos(m * Math.PI / 180), -1.8 * Math.sin(m * Math.PI / 180)], to: [1.8 * Math.cos(m * Math.PI / 180), 1.8 * Math.sin(m * Math.PI / 180)], style: 'mirror' })),
  ], `A circle with 8 identical triangles evenly spaced round it, like a sun${mirrors.length ? `, with ${mirrors.length} lines of symmetry drawn` : ''}.`, caption)
}
export const SUN_LINES = [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5]

/* ---------- Workings ---------- */

/** Lines of symmetry, found one at a time: each fold drawn in red; the answer is how many. */
function linesModel(shape: MeasureShape, why: string[] = []) {
  const folds = foldsThatFit(shape), n = folds.length
  const moves: BoardMove[] = folds.map((m, i) => ({ title: m === 0 ? 'Fold across' : m === 90 ? 'Fold down the middle' : m === 45 || m === 135 ? 'Fold corner to corner' : 'Fold on a slant', say: why[i] ?? 'Fold along this line: the two halves land exactly on each other, so it is a line of symmetry.', rows: [`> Line ${i + 1}`], picture: shapeFig(shape, folds.slice(0, i + 1)) }))
  if (!n) moves.push({ title: 'Try every fold', say: why[0] ?? 'Try folding it every way: down the middle, across, corner to corner. One half never lands on the other.', rows: ['> No fold fits'], picture: shapeFig(shape) })
  moves.push({ title: 'Count them', say: n ? `${n} fold${n === 1 ? '' : 's'} fit, and no other fold does.` : 'No line of symmetry at all.', rows: [`! ${n} line${n === 1 ? '' : 's'} of symmetry`], picture: shapeFig(shape, folds, `${n} line${n === 1 ? '' : 's'} of symmetry`) })
  return { n, model: boardModel([], moves, 'Count the lines', shapeFig(shape)) }
}

/** Rotational symmetry: mark a corner, turn until the shape fits again, count the fits in a full turn. */
function orderModel(shape: MeasureShape) {
  const turns = turnsThatFit(shape), n = turns.length
  const corner = (deg: number): FigurePoint => { const p = SHAPES[shape][0], a = deg * Math.PI / 180; return [p.x * Math.cos(a) - p.y * Math.sin(a), p.x * Math.sin(a) + p.y * Math.cos(a)] }
  const dots = (k: number): FigureItem[] => [0, ...turns.slice(0, k).filter(t => t < 360)].map((t, i) => ({ kind: 'point', at: corner(t), label: String(i + 1), dx: corner(t)[0] >= 0 ? 12 : -12, dy: corner(t)[1] >= 0 ? -12 : 14 }))
  const moves: BoardMove[] = [
    { title: 'Mark a corner', say: 'Put a dot on one corner, so you can see the shape turn round its centre.', rows: ['> Mark a corner'], picture: shapeFig(shape, [], undefined, dots(0)) },
    { title: 'Turn it', say: n > 1 ? `Turn it about its centre. It fits its outline again after ${turns[0]}°, then every ${turns[0]}° after that: the dot visits ${n} corners before it is back where it started.` : 'Turn it about its centre. It only fits its outline again when it is back where it started, after a full 360°.', rows: [n > 1 ? `> Fits every ${turns[0]}°` : '> Fits only at 360°'], picture: shapeFig(shape, [], undefined, dots(n)) },
    { title: 'Count the fits', say: `In one full turn it fits ${n} time${n === 1 ? '' : 's'}${n > 1 ? `: 360 ÷ ${turns[0]} = ${n}` : ''}.`, rows: [`! Order ${n}`], picture: shapeFig(shape, [], `Rotational symmetry order ${n}`, dots(n)) },
  ]
  return { n, model: boardModel([], moves, 'Find the order', shapeFig(shape)) }
}

const count = (n: number) => number(n, String(n))
const LINES_BOX = { prefix: 'Lines =' }
const ORDER_BOX = { prefix: 'Order =' }

/* ---------- Rung 1: lines of symmetry ---------- */

explore(lines, 'Turn the fold line. When the folded copy fits, it’s a line of symmetry.', 'GM5 p124 Lines of symmetry (play)', { mode: 'mirror', shape: 'rectangle' })
worked(lines, 'How many lines of symmetry does a square have?', 'Lines of symmetry', 'GM5 p124 Regular polygons', linesModel('square', [
  'Fold it across the middle: the top half lands exactly on the bottom.',
  'Fold it along a diagonal, corner to corner: the two triangles fit exactly.',
  'Fold it down the middle: the left half lands on the right.',
  'And the other diagonal.',
]).model, 'A line of symmetry is a mirror line: fold the shape along it and one half lands exactly on the other.')
explore(lines, 'Now try a parallelogram. Can you find any fold that fits?', 'GM5 p124 Irregular polygons (play)', { mode: 'mirror', shape: 'parallelogram' })
for (const [shape, hint, ref] of [['equilateral', 'Try a fold from each corner to the middle of the opposite side.', 'GM5 p125 Q1'], ['isosceles', 'Only the two equal sides can swap over.', 'GM5 p125 Q2'], ['pentagon', 'A regular polygon has as many lines as sides.', 'GM5 p125 Q3'], ['kite', 'A kite folds one way only: along the line through its top and bottom corners.', 'GM5 p125 table']] as const) {
  const m = linesModel(shape)
  practice(lines, `How many lines of symmetry does this ${NAME[shape]} have?`, ref, shapeFig(shape), count(m.n), hint, m.model,
    slips(m.n, [[m.n + 1, 'One too many: check each fold really lands exactly.'], [m.n - 1, 'You’ve missed one. Try every corner and every side’s middle.'], [0, 'There is at least one fold that fits.']]), LINES_BOX)
}
{
  const m = linesModel('parallelogram', ['Fold it down the middle: the slanted sides don’t land on each other. Fold it corner to corner: the two halves face opposite ways. No fold fits.'])
  practice(lines, 'How many lines of symmetry does a parallelogram have?', 'GM5 p124 table (a common mistake)', shapeFig('parallelogram'), count(0), 'Fold it on the board in your head: does the slant ever land on itself?', m.model,
    slips(0, [[2, 'Folding along a diagonal or down the middle doesn’t fit: the slants point opposite ways.'], [1, 'Try that fold carefully: the slanted sides don’t land on each other.']]), LINES_BOX)
}

/* ---------- Rung 2: rotational symmetry ---------- */

explore(rotation, 'Turn the shape round its centre. Count how many times it fits in one full turn.', 'GM5 p124 Rotational symmetry (play)', { mode: 'turn', shape: 'square' })
worked(rotation, 'What is the order of rotational symmetry of a regular pentagon?', 'Rotational symmetry', 'GM5 p124 Rotational symmetry', orderModel('pentagon').model,
  'The order of rotational symmetry is how many times a shape fits its own outline in one full turn. Every shape fits at least once, at 360°, so the smallest order is 1.')
explore(rotation, 'A parallelogram has no lines of symmetry. Does it fit when you turn it?', 'GM5 p124 table (play)', { mode: 'turn', shape: 'parallelogram' })
for (const [shape, hint] of [['rectangle', 'Turn it a quarter turn: does it fit? A half turn?'], ['equilateral', 'It fits every 120°.'], ['kite', 'A kite only looks the same when it is back where it started.'], ['hexagon', 'It fits every 60°.']] as const) {
  const m = orderModel(shape)
  practice(rotation, `What is the order of rotational symmetry of this ${NAME[shape]}?`, 'GM5 p124 table', shapeFig(shape), count(m.n), hint, m.model,
    slips(m.n, [[0, 'Every shape fits at least once, at a full turn: the smallest order is 1.'], [m.n * 2, 'Count the fits in one full turn, 360°, not two.'], [m.n === 1 ? 2 : m.n - 1, m.n === 1 ? 'It doesn’t fit after a half turn: only at the full 360°.' : 'Count the full turn too: back where it started is a fit.']]), ORDER_BOX)
}
{
  const m = orderModel('parallelogram')
  practice(rotation, 'What is the order of rotational symmetry of a parallelogram?', 'GM5 p124 table', shapeFig('parallelogram'), count(m.n), 'Turn it half way round.', m.model,
    slips(2, [[0, 'Lines of symmetry: none. But it does fit when you turn it.'], [1, 'It also fits after a half turn, 180°.']]), ORDER_BOX)
}

/* ---------- Rung 3: both together ---------- */

{
  const L = linesModel('hexagon'), R = orderModel('hexagon')
  worked(both, 'A regular hexagon: its lines of symmetry and its order of rotational symmetry.', 'Regular polygons', 'GM5 p124 Regular polygons', boardModel([], [
    { title: 'Lines of symmetry', say: 'A line through each pair of opposite corners (3), and through the middles of each pair of opposite sides (3).', rows: ['> 6 lines of symmetry'], picture: shapeFig('hexagon', foldsThatFit('hexagon')) },
    { title: 'Rotational symmetry', say: 'It fits every 60° of a turn: 360 ÷ 60 = 6 times.', rows: ['> Order 6'], picture: shapeFig('hexagon') },
    { title: 'The pattern', say: `A regular polygon with n sides has n lines of symmetry and rotational symmetry of order n.`, rows: [`! ${L.n} lines, order ${R.n}`], picture: shapeFig('hexagon', foldsThatFit('hexagon'), '6 sides: 6 lines, order 6') },
  ], 'Both', shapeFig('hexagon')), 'Regular polygons are the easy ones: the number of sides gives both answers.')
}
practice(both, 'Which shape has exactly 2 lines of symmetry?', 'GM5 p125 Q4', shapeFig('rectangle'), choose(
  'Rectangle',
  ['Square', 'A square has 4: down, across, and both diagonals.'],
  ['Kite', 'A kite has just 1.'],
  ['Equilateral triangle', 'An equilateral triangle has 3.'],
), 'Think of a fold down the middle and one across, but none corner to corner.', linesModel('rectangle').model)
practice(both, 'Which is true of a rhombus?', 'GM5 p124 table', shapeFig('rhombus'), choose(
  '2 lines of symmetry, order 2',
  ['4 lines of symmetry, order 4', 'That’s a square. A rhombus only folds along its diagonals.'],
  ['0 lines of symmetry, order 2', 'That’s a parallelogram. A rhombus folds along both diagonals.'],
  ['1 line of symmetry, order 1', 'That’s a kite.'],
), 'Fold along each diagonal, then try a half turn.', boardModel([], [
  { title: 'Lines of symmetry', say: 'Each diagonal folds it exactly in half. A fold down a side’s middle doesn’t fit.', rows: ['> 2 lines (the diagonals)'], picture: shapeFig('rhombus', foldsThatFit('rhombus')) },
  { title: 'Rotational symmetry', say: 'It fits after a half turn, and again at the full turn: order 2.', rows: ['! 2 lines, order 2'], picture: shapeFig('rhombus', foldsThatFit('rhombus'), '2 lines, order 2') },
], 'Both', shapeFig('rhombus')))
{
  const moves: BoardMove[] = [
    { title: 'Through the triangles', say: 'A fold through a triangle’s tip and the one opposite: the two sides match. There are 8 triangles, in 4 opposite pairs: 4 lines.', rows: ['> 4 lines through the triangles'], picture: sun([0, 45, 90, 135]) },
    { title: 'Between them', say: 'A fold through the gaps between triangles fits too: 4 more lines.', rows: ['> 4 lines through the gaps'], picture: sun(SUN_LINES) },
    { title: 'Count them', say: '4 + 4 = 8 lines of symmetry, one for every triangle.', rows: ['! 8 lines of symmetry'], picture: sun(SUN_LINES, '8 lines of symmetry') },
  ]
  practice(both, 'How many lines of symmetry does this shape have?', 'GM5 p125 Q5', sun(), count(8), 'Try a fold through a triangle, then one through a gap.', boardModel([], moves, 'Count the lines', sun()),
    slips(8, [[4, 'Those are the folds through the triangles. Folds through the gaps fit too.'], [16, 'Each line passes through two triangles (or two gaps): count each line once.'], [0, 'Fold it through any triangle’s tip: it fits.']]), LINES_BOX)
}
{
  const m = linesModel('trapezium')
  practice(both, 'How many lines of symmetry does this isosceles trapezium have?', 'GM5 p124 Irregular polygons', shapeFig('trapezium'), count(m.n), 'Fold it down the middle.', m.model,
    slips(1, [[2, 'Folding it across the middle doesn’t fit: the top is shorter than the bottom.'], [0, 'Its slanted sides are equal, so it folds down the middle.']]), LINES_BOX)
}

add('mixed', 'Symmetry', 'GM5 consolidation', text(
  'A line of symmetry is a mirror line: fold along it and the halves fit exactly.',
  'The order of rotational symmetry is how many times it fits in one full turn. The smallest order is 1.',
  'A regular polygon with n sides has n lines of symmetry and order n.',
  'A parallelogram has no lines of symmetry but order 2. A kite has 1 line and order 1.',
))

export const tutorSymmetryLesson: TutorMethodLesson = {
  id: 'L205', number: 205, title: 'Symmetry', level: 'GCSE Foundation',
  goal: 'Find a shape’s lines of symmetry and its order of rotational symmetry, including regular polygons and the common quadrilaterals and triangles.',
  labels: { [lines]: 'Lines of symmetry', [rotation]: 'Rotational symmetry', [both]: 'Both together', mixed: 'Review' },
  states: finish(),
}
