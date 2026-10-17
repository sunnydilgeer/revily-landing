/*
 * Geometry 12H: Invariant points, a Higher-only lesson after The four transformations, as in the book. From the Higher
 * revision guide, GM14 Invariant Points (Level 6-7, p203–204): a point that ends up where it started. Reflections (the
 * book's example: a point on the mirror line stays put), two transformations in a row (the book's example: rotate 180°
 * about (1, 0), then translate by (2, 2); the invariant point is (2, 1)), and enlargements (only the centre stays put).
 * Your Turn Q1 (enlarge by 2 about the origin: no invariant points), Q2 (reflect in x = 0, then rotate 180° about
 * (0, 1), which together are a reflection in y = 1) and Q3a (reflect in y = x), with our own shapes where the book's
 * can't be read exactly. Q3b ("exactly two invariant points" after a translation) is left out: a translation that
 * matches two corners lines up a whole side, so the book's answer depends on counting only corners.
 */
import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigurePoint } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { line, part, sign } from '../../written-methods/tutor/stepWorking'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { screens } from '../../geometry/tutor/figureLesson'
import { centreMark, enlarge, grid, half, move, reflectX } from '../../transformations/tutor/transformationsLesson'
import { asks } from './figureHelpers'

const a = author(212.5, 'L212H')
const { add, finish } = a
const { worked } = screens(a)
const ask = asks(a)
const single = 'invariant-single'
const combined = 'invariant-combined'

type Pt = FigurePoint
/** Squared paper drawn with a small margin, so the squares come out as big as they can (Sunny wants pictures large). */
const paper = (...args: Parameters<typeof grid>): AngleFrame => { const f = grid(...args); return { ...f, figure: { ...f.figure!, pad: 16 } } }
const cross = (at: Pt): FigureItem[] => [{ kind: 'point', at }, { kind: 'text', at, text: '✕', tone: 'x', dy: 1 }]
const mirror = (from: Pt, to: Pt, label: string, at: Pt): FigureItem[] => [{ kind: 'line', from, to, style: 'mirror' }, { kind: 'text', at, text: label, small: true }]

/* ---------- One transformation ---------- */

add(single, 'Invariant points', 'Higher GM14 Invariant points', text(
  'An invariant point is a point on a shape that ends up in the same place after a transformation.',
  'Reflection: any point on the mirror line stays where it is.',
  'Rotation: only the centre stays still.',
  'Enlargement: only the centre stays still.',
  'To find them, do the transformation, then look for points of the image that sit on the original.',
))

{
  // The book's example: reflect in x = 1. Our own triangle, with its bottom corner on the line at (1, 1).
  const A: Pt[] = [[1, 1], [3, 2], [2, 4]]
  const B = reflectX(A, 1)
  const GX: [number, number] = [-2, 4], GY: [number, number] = [-1, 5]
  const m = mirror([1, -1], [1, 5], 'x = 1', [1.7, 4.6])
  worked(single, 'State any invariant points when shape A is reflected in the line x = 1.', 'Invariant points: reflections', 'Higher GM14 Example: Invariant Points - Reflections (p203)', boardModel([], [
    { title: 'Draw the mirror line', say: 'x = 1 is the upright line through 1 on the x axis.', rows: ['>0 Mirror line x = 1'], picture: paper(GX, GY, [{ pts: A, name: 'A' }], m) },
    { title: 'Reflect the shape', say: 'Each corner goes the same distance the other side of the line.', rows: ['>0 (3, 2) → (−1, 2)', '>0 (2, 4) → (0, 4)', '>0 (1, 1) → (1, 1)'], picture: paper(GX, GY, [{ pts: A, name: 'A' }, { pts: B, name: 'B', image: true }], m) },
    { title: 'Spot what stayed', say: 'Every point moved except the corner on the mirror line: it is 0 squares from the line, so it stays.', rows: ['! 1 invariant point: (1, 1)'], picture: paper(GX, GY, [{ pts: A, name: 'A' }, { pts: B, name: 'B', image: true }], [...m, ...cross([1, 1])], '', 'Invariant point (1, 1)') },
  ], 'Reflect', paper(GX, GY, [{ pts: A, name: 'A' }], m)), 'Do the transformation, then look for points that haven’t moved. In a reflection they are the points on the mirror line.')
}

{
  const A: Pt[] = [[1, 2], [4, 3], [3, 4]]
  const m = mirror([-1, 2], [6, 2], 'y = 2', [5.4, 2.4])
  const p = paper([-1, 6], [-1, 5], [{ pts: A, name: 'A' }], m)
  ask(single, 'Shape A is reflected in the line y = 2. Which point is invariant?', 'Higher GM14 Reflections (own numbers)', p,
    choose('(1, 2)', ['(4, 3)', 'That corner is 1 square above the line, so it lands 1 below it, at (4, 1).'], ['(3, 4)', 'That corner is 2 squares above the line, so it lands 2 below it, at (3, 0).'], ['(2, 2)', 'That point is on the mirror line, but not on shape A.']),
    '(1, 2)', 'Which corner is on the mirror line?', {
      kind: 'step-worked', start: 'Mirror line y = 2', steps: [
        { title: 'Points on the line', why: 'A point on the mirror line is no distance from it, so it reflects onto itself. Corner (1, 2) has y equal to 2.', words: '(1, 2)' },
      ],
    })
}

{
  // Your Turn Q1, with our own triangle: enlargement by 2 about the origin.
  const A: Pt[] = [[1, 1], [1, 3], [2, 1]]
  const p = paper([-1, 5], [-1, 4], [{ pts: A, name: 'A' }])
  ask(single, 'Shape A is enlarged by scale factor 2 about the origin. How many invariant points are there?', 'Higher GM14 Your Turn Q1 (Level 6-7)', p, number(0, '0'), '0', 'In an enlargement, only the centre stays still. Is the centre on A?', {
    kind: 'step-worked', start: 'Scale factor 2, centre (0, 0)', steps: [
      { title: 'Enlarge it', why: 'Every corner goes twice as far from the origin, so every point of A moves.', lines: [line([part('1'), sign('×'), part('2')], '2'), line([part('3'), sign('×'), part('2')], '6')] },
      { title: 'Check the centre', why: 'Only the centre stays still, and the origin isn’t on A, so no point of A stays put.', words: '0' },
    ],
  }, { prefix: 'Points =' })
}

{
  const A: Pt[] = [[1, 1], [3, 1], [1, 2]]
  const B = enlarge(A, [1, 1], 2)
  const p = paper([-1, 6], [-1, 4], [{ pts: A, name: '' }, { pts: B, name: 'B', image: true }], [...centreMark([1, 1], 'centre (1, 1)', [4, 3.4]), { kind: 'text', at: [0.4, 1.6], text: 'A', name: true }])
  ask(single, 'Shape A is enlarged by scale factor 2, centre (1, 1), to give B. How many invariant points are there?', 'Higher GM14 Enlargements (own numbers)', p, number(1, '1'), '1', 'The centre is a corner of A this time.', {
    kind: 'step-worked', start: 'Scale factor 2, centre (1, 1)', steps: [
      { title: 'The centre stays', why: 'The centre of enlargement never moves, and here it is a corner of A.', lines: [line([part('(1, 1) → (1, 1)')])] },
      { title: 'Everything else moves', why: 'Every other point goes twice as far from the centre, so only one point stays.', words: '1' },
    ],
  }, { prefix: 'Points =' })
}

/* ---------- Two transformations ---------- */

{
  // The book's example: rotate 180° about (1, 0), then translate by (2, 2).
  const A: Pt[] = [[2, 1], [4, 0], [4, 2]]
  const B = half(A, [1, 0])
  const C = move(B, 2, 2)
  const GX: [number, number] = [-4, 5], GY: [number, number] = [-3, 3]
  const c = centreMark([1, 0], 'centre (1, 0)', [2.6, -2.2])
  worked(combined, 'Rotate A 180° about (1, 0), then translate by (2, 2). Label the final shape C and state any invariant points.', 'Invariant points: two moves', 'Higher GM14 Example: Invariant Points - Translation (p203)', boardModel([], [
    { title: 'Rotate first', say: 'A half turn about (1, 0): each corner goes through the centre to the same distance on the other side. Call it B.', rows: ['>0 (2, 1) → (0, −1)', '>0 (4, 0) → (−2, 0)', '>0 (4, 2) → (−2, −2)'], picture: paper(GX, GY, [{ pts: A, name: 'A' }, { pts: B, name: 'B', ghost: true }], c) },
    { title: 'Then translate', say: 'Move B 2 right and 2 up. Call it C.', rows: ['>0 Translate 2 right, 2 up', '>0 (0, −1) → (2, 1)', '>0 (−2, 0) → (0, 2)', '>0 (−2, −2) → (0, 0)'], picture: paper(GX, GY, [{ pts: A, name: 'A' }, { pts: B, name: 'B', ghost: true }, { pts: C, name: 'C', image: true }], c) },
    { title: 'Compare C with A', say: 'C’s corner (2, 1) is exactly where A’s corner (2, 1) started: that point is invariant.', rows: ['! Invariant point: (2, 1)'], picture: paper(GX, GY, [{ pts: A, name: 'A' }, { pts: C, name: 'C', image: true }], cross([2, 1]), '', 'Invariant point (2, 1)') },
  ], 'Transform', paper(GX, GY, [{ pts: A, name: 'A' }], c)), 'With two transformations, do them in order, then compare the final shape with the very first one.')
}

{
  // Your Turn Q2: reflect in x = 0, then rotate 180° about (0, 1). Together that's a reflection in y = 1.
  const A: Pt[] = [[-4, 3], [-2, 3], [-1, 2], [-3, 1]]
  const p = paper([-5, 5], [-2, 4], [{ pts: A, name: 'A' }])
  ask(combined, 'Reflect shape A in the line x = 0, then rotate it 180° about (0, 1). What are the coordinates of the invariant point?', 'Higher GM14 Your Turn Q2 (Level 6-7)', p,
    choose('(−3, 1)', ['(−1, 2)', 'That corner is 1 above y = 1, so it lands 1 below it, at (−1, 0).'], ['(0, 1)', 'That’s the centre of the rotation, but it isn’t on A, and the reflection moved things first.'], ['(3, 1)', 'That’s where (−3, 1) goes after the reflection. The rotation brings it back.']),
    '(−3, 1)', 'Do both moves to each corner. Which corner comes back to where it started?', {
      kind: 'step-worked', start: 'Reflect in x = 0, then rotate 180° about (0, 1)', steps: [
        { title: 'Reflect', why: 'Reflecting in the y axis changes the sign of x.', lines: [line([part('−3'), sign('×'), part('−1')], '3')] },
        { title: 'Rotate', why: 'A half turn about the point zero, one sends x to minus x, and y to two take away y.', lines: [line([part('3'), sign('×'), part('−1')], '−3'), line([part('2'), sign('−'), part('1')], '1')] },
        { title: 'Back where it started', why: 'The corner at minus three, one comes back to the same place: together the two moves are a reflection in the line y equals one.', words: '(−3, 1)' },
      ],
    })
}

{
  // Your Turn Q3a, with our own triangle touching y = x at a corner.
  const A: Pt[] = [[-3, 1], [1, 1], [-1, 3]]
  const m = mirror([-1, -1], [4, 4], 'y = x', [3.4, 2.8])
  const p = paper([-4, 4], [-1, 4], [{ pts: A, name: 'A' }], m)
  ask(combined, 'Shape A is reflected in the line y = x. Which point of A is invariant?', 'Higher GM14 Your Turn Q3a (Level 6-7)', p,
    choose('(1, 1)', ['(−3, 1)', 'In y = x, x and y swap: that corner goes to (1, −3).'], ['(−1, 3)', 'In y = x, x and y swap: that corner goes to (3, −1).'], ['(0, 0)', 'The origin is on the mirror line, but not on shape A.']),
    '(1, 1)', 'In y = x the coordinates swap over. Which corner stays the same when you swap them?', {
      kind: 'step-worked', start: 'Mirror line y = x', steps: [
        { title: 'Swap the coordinates', why: 'Reflecting in y equals x swaps each corner’s x and y.', lines: [line([part('(−3, 1) → (1, −3)')]), line([part('(−1, 3) → (3, −1)')])] },
        { title: 'Which stays put?', why: 'A corner whose x and y are equal is on the mirror line, so swapping them changes nothing.', words: '(1, 1)' },
      ],
    })
}

add('mixed', 'Invariant points', 'Higher GM14 consolidation', text(
  'An invariant point ends up exactly where it started.',
  'Reflection: points on the mirror line. Rotation and enlargement: only the centre.',
  'A translation on its own moves every point.',
  'For two transformations, do them in order and compare the final shape with the first one.',
))

export const tutorInvariantPointsLesson: TutorMethodLesson = {
  id: 'L212H', number: 212.5, title: 'Invariant points', level: 'GCSE Higher',
  steadyPictures: true,
  largePictures: true,
  goal: 'Find the points that stay where they are after a reflection, rotation, enlargement or two transformations in a row.',
  labels: { [single]: 'One transformation', [combined]: 'Two transformations', mixed: 'Review' },
  states: finish(),
}
