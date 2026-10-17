/*
 * Lesson 101 (Coordinates), a Higher section. From the Higher revision guide, GR3 Skill 3 "Ratios to find Coordinates"
 * (Level 6-7, p110): C on AB with AC : CB = 3 : 5 is 3/8 of the way from A, so find 3/8 of the change in x and of the
 * change in y, and add each to A's coordinate. The book's example (A(−5, 16), B(3, 12), C = (−2, 29/2)) is drawn on a
 * grid one move a step, as the Foundation midpoint is (coordinateWorkings.ts): across from A, then down to B, each
 * labelled with its size. Your Turn Q3 (p111) has a fractional x, so it is two questions: the y, typed as a whole
 * number, then the x, typed as a fraction. The extra practice has whole-number answers on a grid, typed as "x, y".
 */
import { author } from '../../written-methods/tutor/content'
import { line, part, sign, type StepLine, type StepWorking } from '../../written-methods/tutor/stepWorking'
import type { GraphPoint } from '../../written-methods/tutor/methodWorking'
import { latex } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, leg, plot, pt, signedNumber, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'
import { at, pair } from '../../coordinates/tutor/coordinateWorkings'
import { number, screens, text, type HigherAddition } from './helpers'

const ratio = 'coordinates-ratio'
const a = author(101, 'L101-H')
const { add } = a
const { graph, practice, onGrid } = screens(a)

const show = (n: number) => String(n).replace('-', '−')
const bracket = (n: number) => n < 0 ? `(${show(n)})` : show(n)

add(ratio, 'A point in a ratio', 'Higher GR3 Skill 3 Ratios to find Coordinates', text(
  'C lies on the line from A to B, with AC : CB = 3 : 5. That splits the line into 3 + 5 = 8 equal parts.',
  'C is 3 of those parts from A, so it is 3/8 of the way along.',
  'Find how far x changes from A to B and take 3/8 of it. Do the same for y.',
  'Add each share to A’s coordinates, and you have C.',
))

/* ---------- The book's example, on a grid ---------- */

{
  const A = pt(-5, 16), B = pt(3, 12), corner = pt(3, 16), C = pt(-2, 14.5)
  const start: GraphGrid = {
    x: [-6, 4], y: [-2, 18], yStep: 2,
    lines: [{ from: A, to: B, at: -1, segment: true }],
    points: [{ ...A, at: -1, label: 'A (−5, 16)', place: { dx: -1, dy: -1 } }, { ...B, at: -1, label: 'B (3, 12)', place: { dx: 1, dy: 1 } }],
  }
  const write = (title: string, say: string, text: string, family: number, value?: number): GraphMove => ({
    title, say, equation: latex(text), adds: 'lines',
    change: (frame, step) => ({ ...frame, marks: value === undefined ? undefined : [{ axis: family === 1 ? 'x' : 'y', value, family: family === 1 ? 1 : 0 }],
      working: [...(frame.working ?? []), { text, family, at: step }] }),
  })
  const moves: GraphMove[] = [
    write('Total parts', 'Add the two parts of the ratio. C is 3 of the 8 parts from A, so it is 3/8 of the way along.', '3 + 5 = 8 parts, so C is 3/8 of the way from A', 3),
    leg(A, corner, '3 − (−5) = 8', 'Across from A', 'How far x changes from A to B: take A’s x from B’s x.'),
    write('3/8 of it', 'Take 3/8 of the change in x, then add it to A’s x.', '3/8 × 8 = 3, so x = −5 + 3 = −2', 1, -2),
    leg(corner, B, '12 − 16 = −4', 'Down to B', 'How far y changes from A to B: take A’s y from B’s y. It goes down, so it is negative.'),
    write('3/8 of it', 'Take 3/8 of the change in y, then add it to A’s y. Adding a negative takes it away.', '3/8 × (−4) = −3/2, so y = 16 + (−3/2) = 29/2', 0, 14.5),
    answerMove('C = (−2, 29/2) = (−2, 14.5)', 'The point C', 'C sits on the line, 3 parts from A and 5 parts from B.', [], {
      ...plot([C], '', ''),
      change: (frame, step) => ({ ...frame, points: [...(frame.points ?? []), { ...C, at: step, label: 'C (−2, 14.5)', place: { dx: -1, dy: 1 } }], boxed: [C] }),
    }),
  ]
  graph(ratio, 'A(−5, 16) and B(3, 12). C lies on AB with AC : CB = 3 : 5. Find the coordinates of C.', 'Higher GR3 Skill 3 Example', 'A(−5, 16), B(3, 12), AC : CB = 3 : 5',
    start, moves, 'Find C', 'Find the coordinates of C', 'Add the parts of the ratio. Then find that fraction of the change in x and in y, and add each to A.')
}

/* ---------- Questions ---------- */

/** The steps for C, AC : CB = p : q: total parts, then the x and y shares added to A (x amber, y biro blue). */
function shares(A: GraphPoint, B: GraphPoint, p: number, q: number) {
  const n = p + q, f = `${p}/${n}`
  const dx = B.x - A.x, dy = B.y - A.y
  const C = pt(A.x + p * dx / n, A.y + p * dy / n)
  const total = { title: 'Total parts', why: 'Add the parts of the ratio. C is the first part’s share of the way from A.', lines: [line([part(p), sign('+'), part(q)], n)] }
  const xLines = (last?: Partial<StepLine>): StepLine[] => [
    line([part(show(B.x), 1), sign('−'), part(bracket(A.x), 1)], show(dx)),
    line([part(f), sign('×'), part(bracket(dx), 1)], show(p * dx / n)),
    line([part(show(A.x), 1), sign('+'), part(bracket(p * dx / n), 1)], show(C.x), last),
  ]
  const yLines = (last?: Partial<StepLine>): StepLine[] => [
    line([part(show(B.y), 0), sign('−'), part(bracket(A.y), 0)], show(dy)),
    line([part(f), sign('×'), part(bracket(dy), 0)], show(p * dy / n)),
    line([part(show(A.y), 0), sign('+'), part(bracket(p * dy / n), 0)], show(C.y), last),
  ]
  return { C, f, total, xLines, yLines }
}
const xWhy = 'Take A’s x from B’s x, find that fraction of it, then add it on to A’s x.'
const yWhy = 'Take A’s y from B’s y, find that fraction of it, then add it on to A’s y.'

/** A whole-number C on a grid, typed as "x, y". */
function onLine(A: GraphPoint, B: GraphPoint, p: number, q: number, x: [number, number], y: [number, number], sourceRef: string, hint: string) {
  const { C, total, xLines, yLines } = shares(A, B, p, q)
  const start: GraphGrid = { x, y, lines: [{ from: A, to: B, at: -1, segment: true }], points: [{ ...A, at: -1, label: `A ${pair(A)}` }, { ...B, at: -1, label: `B ${pair(B)}` }] }
  const model: StepWorking = { kind: 'step-worked', start: `AC : CB = ${p} : ${q}`, steps: [
    total,
    { title: 'Find the x', why: xWhy, lines: xLines() },
    { title: 'Find the y', why: yWhy, lines: yLines() },
    { title: 'The point C', why: 'Write the x, then the y, in brackets.', lines: [line([part('C')], pair(C), { answer: true })] },
  ] }
  return onGrid(ratio, `C lies on AB with AC : CB = ${p} : ${q}. Find the coordinates of C.`, sourceRef, start, at(C, true), pair(C), hint, model)
}

onLine(pt(1, 1), pt(9, 5), 1, 3, [-1, 10], [-1, 6], 'Higher GR3 extra practice', 'There are 4 parts in all, so C is 1/4 of the way from A.')
onLine(pt(-4, 5), pt(2, -4), 2, 1, [-5, 3], [-5, 6], 'Higher GR3 extra practice', 'C is 2/3 of the way from A. y goes down, so its change is negative.')
onLine(pt(6, -3), pt(-3, 3), 1, 2, [-4, 7], [-4, 4], 'Higher GR3 extra practice', 'C is 1/3 of the way from A. x goes left, so its change is negative.')

// Your Turn Q3: A(−10, 37), B(−16, 1), AC : CB = 2 : 7 gives C = (−34/3, 29). The y first (a whole number), then the x.
{
  const A = pt(-10, 37), B = pt(-16, 1)
  const { total, yLines } = shares(A, B, 2, 7)
  const question = 'A(−10, 37) and B(−16, 1). C lies on AB with AC : CB = 2 : 7.'
  const yQ = practice(ratio, `${question} Find the y coordinate of C.`, 'Higher GR3 Your Turn Q3', { ...number(29, '29'), signed: true }, '29', 'There are 9 parts, so C is 2/9 of the way from A. Find 2/9 of the change in y.', {
    kind: 'step-worked', start: 'AC : CB = 2 : 7', steps: [total, { title: 'Find the y', why: yWhy, lines: yLines({ answer: true }) }],
  })
  yQ.answerPrefix = 'y ='
  const xQ = practice(ratio, `${question} Find the x coordinate of C, as a fraction.`, 'Higher GR3 Your Turn Q3', signedNumber(-34 / 3, '−34/3'), '−34/3', 'C is 2/9 of the way from A. Find 2/9 of the change in x and add it to −10.', {
    kind: 'step-worked', start: 'AC : CB = 2 : 7', steps: [total, { title: 'Find the x', why: xWhy, lines: [
      line([part('−16', 1), sign('−'), part('(−10)', 1)], '−6'),
      line([part('2/9'), sign('×'), part('(−6)', 1)], '−4/3'),
      line([part('−10', 1), sign('+'), part('(−4/3)', 1)], '−34/3', { answer: true }),
    ] }],
  })
  xQ.answerPrefix = 'x ='
}

export const ratioOnLine: HigherAddition = { lessonId: 'L101', skill: ratio, label: 'A point in a ratio', states: a.finish() }
