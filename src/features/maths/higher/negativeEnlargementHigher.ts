/*
 * Lesson 212 (The four transformations), a Higher section. From the Higher revision guide, GM13 The Four Transformations
 * (Level 6-7, p200–202): the three rules for scale factors (above 1, below 1, negative), enlarging by a negative scale
 * factor (Example: −2 about the origin, with our own shape) and Your Turn Q5 (the book's triangle A(1, 3), B(3, 3),
 * C(2, 1) enlarged by −1 about the origin), and two of our own: naming a negative scale factor, and −½.
 */
import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigurePoint } from '../../written-methods/tutor/methodWorking'
import { line, part, sign } from '../../written-methods/tutor/stepWorking'
import { boardModel, choose, number } from '../../simultaneous-equations/tutor/boardWorkings'
import { screens } from '../../geometry/tutor/figureLesson'
import { centreMark, enlarge, grid } from '../../transformations/tutor/transformationsLesson'
import { asks } from './figureHelpers'
import { text, type HigherAddition } from './helpers'

const negative = 'negative-enlargement'
const a = author(212, 'L212-H')
const { worked } = screens(a)
const ask = asks(a)

type Pt = FigurePoint
/** Squared paper drawn with a small margin, so the squares come out as big as they can (Sunny wants pictures large). */
const paper = (...args: Parameters<typeof grid>): AngleFrame => { const f = grid(...args); return { ...f, figure: { ...f.figure!, pad: 16 } } }
const O: Pt = [0, 0]
/** Dashed lines from the centre through each corner of A and on to its image. */
const through = (B: Pt[], c: Pt = O): FigureItem[] => B.map(p => ({ kind: 'line' as const, from: c, to: p, style: 'dashed' as const }))

a.add(negative, 'Negative scale factors', 'Higher GM13 Enlargement: Scale Factors', text(
  'Scale factor bigger than 1: the shape gets bigger, on the same side of the centre.',
  'Scale factor between 0 and 1: the shape gets smaller, on the same side of the centre.',
  'Negative scale factor: the shape lands on the opposite side of the centre, upside down, as if turned 180°.',
  'The number without its minus sign still says how many times bigger.',
))

{
  const A: Pt[] = [[1, 1], [3, 1], [1, 2]]
  const B = enlarge(A, O, -2)
  const GX: [number, number] = [-7, 4], GY: [number, number] = [-4, 2]
  const centre = centreMark(O, 'centre (0, 0)', [2.4, -2.2])
  worked(negative, 'Enlarge shape A by scale factor −2, centre (0, 0).', 'Negative enlargement', 'Higher GM13 Example: Negative Enlargement (own shape)', boardModel([], [
    { title: 'Lines through the centre', say: 'Draw lines from each corner through the centre (0, 0) and on beyond it. The minus sign means the image is on the other side.', rows: ['>0 Centre (0, 0), scale factor −2'], picture: paper(GX, GY, [{ pts: A, name: 'A' }], [...centre, ...through(B)]) },
    { title: 'Twice as far, other side', say: 'Each new corner is twice as far from the centre, but the opposite way. (1, 1) is 1 right and 1 up, so its image is 2 left and 2 down.', rows: ['>0 (1, 1) → (−2, −2)', '>0 (3, 1) → (−6, −2)', '>0 (1, 2) → (−2, −4)'], picture: paper(GX, GY, [{ pts: A, name: 'A' }], [...centre, ...through(B), ...B.map(p => ({ kind: 'point' as const, at: p }))]) },
    { title: 'Join them up', say: 'Join the new corners to draw the image, B.', rows: ['>0 A enlarged by −2 is B'], picture: paper(GX, GY, [{ pts: A, name: 'A' }, { pts: B, name: 'B', image: true }], [...centre, ...through(B)], '', 'Twice the size, upside down, on the far side') },
    { title: 'Check it makes sense', say: 'B should be twice as big and upside down. A’s bottom side is 2 squares long; B’s top side is 4.', rows: ['! B’s side = 2 × 2 = 4 ✓'], picture: paper(GX, GY, [{ pts: A, name: 'A' }, { pts: B, name: 'B', image: true }], [{ kind: 'line', from: A[0], to: A[1], style: 'lit' }, { kind: 'line', from: B[0], to: B[1], style: 'lit' }]) },
  ], 'Enlarge', paper(GX, GY, [{ pts: A, name: 'A' }], centre)), 'A negative scale factor puts the image on the opposite side of the centre. Measure from each corner to the centre, times by the number, and go that far on the other side.')
}

{
  // Your Turn Q5: the book's triangle, scale factor −1 about the origin.
  const A: Pt[] = [[1, 3], [3, 3], [2, 1]]
  const p = paper([-4, 4], [-4, 4], [{ pts: A, name: '' }], [
    { kind: 'text', at: A[0], text: 'A', dx: -8, dy: -10 }, { kind: 'text', at: A[1], text: 'B', dx: 8, dy: -10 }, { kind: 'text', at: A[2], text: 'C', dx: 0, dy: 16 },
  ], 'Triangle ABC with corners A (1, 3), B (3, 3) and C (2, 1).')
  ask(negative, 'Triangle ABC is enlarged by scale factor −1, centre (0, 0). Where does corner A (1, 3) go?', 'Higher GM13 Your Turn Q5 (Level 6-7)', p,
    choose('(−1, −3)', ['(−1, 3)', 'That reflects in the y axis. A negative scale factor sends the corner through the centre, to the opposite side.'], ['(1, −3)', 'That reflects in the x axis. Go through the centre: both numbers change sign.'], ['(−3, −1)', 'Keep x and y in their places: only their signs change.']),
    '(−1, −3)', 'Scale factor −1: the same distance from the centre, on the opposite side.', {
      kind: 'step-worked', start: 'A (1, 3), scale factor −1, centre (0, 0)', steps: [
        { title: 'Times the scale factor', why: 'From the origin, multiply how far across and how far up by minus one.', lines: [line([part('1'), sign('×'), part('−1')], '−1'), line([part('3'), sign('×'), part('−1')], '−3')] },
        { title: 'The new corner', why: 'The same size, the same distance away, on the opposite side: like a half turn.', words: '(−1, −3)' },
      ],
    })
}

{
  const A: Pt[] = [[2, 1], [3, 1], [2, 2]]
  const B = enlarge(A, O, -2)
  const p = paper([-7, 4], [-5, 3], [{ pts: A, name: 'A' }, { pts: B, name: 'B', image: true }], centreMark(O, 'centre (0, 0)', [2.6, -1.8]))
  ask(negative, 'B is an enlargement of A with centre (0, 0). What is the scale factor?', 'Higher GM13 (own numbers)', p, number(-2, '−2'), '−2', 'How many times bigger is B? Which side of the centre is it on?', {
    kind: 'step-worked', start: 'A and B, centre (0, 0)', steps: [
      { title: 'How many times bigger?', why: 'Compare matching sides: B’s bottom side over A’s.', lines: [line([part('2'), sign('÷'), part('1')], '2')] },
      { title: 'Which side?', why: 'B is on the opposite side of the centre and upside down, so the scale factor is negative.', lines: [line([part('2'), sign('×'), part('−1')], '−2', { answer: true })] },
    ],
  }, { label: 'Scale factor', prefix: 'SF =' })
}

{
  const A: Pt[] = [[2, 2], [6, 2], [2, 4]]
  const p = paper([-4, 7], [-2, 5], [{ pts: A, name: 'A' }], [...centreMark(O, 'centre (0, 0)', [-2.6, 1.6]), { kind: 'point', at: [6, 2], label: '(6, 2)', dx: 6, dy: -16 }])
  ask(negative, 'Shape A is enlarged by scale factor −½, centre (0, 0). Where does the corner (6, 2) go?', 'Higher GM13 (own numbers)', p,
    choose('(−3, −1)', ['(3, 1)', 'That’s scale factor ½. The minus sign sends it to the opposite side of the centre.'], ['(−12, −4)', 'That’s scale factor −2. A half makes it smaller: halve the distance.'], ['(4, 0)', 'Multiply by −½. Don’t take a half away.']),
    '(−3, −1)', 'Half as far from the centre, on the opposite side.', {
      kind: 'step-worked', start: '(6, 2), scale factor −½, centre (0, 0)', steps: [
        { title: 'Times the scale factor', why: 'Multiply how far across and how far up by minus a half.', lines: [line([part('6'), sign('×'), part('−0.5')], '−3'), line([part('2'), sign('×'), part('−0.5')], '−1')] },
        { title: 'The new corner', why: 'Half as far from the centre, on the opposite side: the shape gets smaller and turns upside down.', words: '(−3, −1)' },
      ],
    })
}

export const negativeEnlargement: HigherAddition = { lessonId: 'L212', skill: negative, label: 'Negative scale factors', states: a.finish() }
