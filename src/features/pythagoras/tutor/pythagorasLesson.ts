import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigurePoint, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { dp, fig, screens, sf, slips, triangleFig, type TriSide } from '../../geometry/tutor/figureLesson'

/*
 * Geometry lesson 19: Pythagoras. From T1 in Sunny's revision book (p156–157), with our own numbers except where a
 * question is the book's. The book's one equation runs through every screen: a² + b² = c², where c is the hypotenuse,
 * the longest side, opposite the right angle. Four rungs: finding the hypotenuse (square, add, square root; Your Turn
 * Q1 and Q3); finding a shorter side, where you subtract instead (Example 1, Your Turn Q4); the length of a line
 * between two points on axes, from a right-angled triangle drawn underneath it (Example 2, Your Turn Q2); and problems
 * in words, ladders against walls and diagonal braces (Your Turn Q5). Built like lessons 1 to 18: the first rung opens
 * on the measuring board, where you drag the top corner of a right-angled triangle and the squares on its two shorter
 * sides always add up to the square on the hypotenuse.
 *
 * Hidden on live like lessons 1 to 18: only the unlisted Geometry shelf (src/features/geometry/geometryLessons.ts)
 * opens it.
 */

const lesson = author(219)
const { add, finish } = lesson
const { explore, worked, practice } = screens(lesson)
const hypotenuse = 'geometry-pythagoras-hypotenuse'
const shorter = 'geometry-pythagoras-shorter'
const distance = 'geometry-pythagoras-distance'
const problems = 'geometry-pythagoras-problems'

const L_BOX = (unit = 'cm', letter = 'x') => ({ label: `Length (${unit})`, prefix: `${letter} =` })

/* ---------- Pictures ---------- */

/** A right-angled triangle from its three corners, the right angle at corner 0. Side k runs from corner k to corner k + 1. */
const right = (pts: [FigurePoint, FigurePoint, FigurePoint], sides: (TriSide | undefined)[], spoken: string, names?: string[], caption?: string) =>
  triangleFig(pts, { sides, names, right: 0, spoken, caption })

/* ---------- Rung 1: the hypotenuse ---------- */

explore(hypotenuse, 'Drag the corner. Watch the squares on the sides.', 'T1 p156 Pythagoras’ Theorem (play)', { mode: 'pythagoras' })
const guess1 = right([[0, 0], [8, 0], [0, 6]], [{ label: '8 cm' }, { label: '?', tone: 'x' }, { label: '6 cm' }], 'A right-angled triangle with shorter sides 6 cm and 8 cm. The longest side is missing.')
practice(hypotenuse, 'Guess first: the two shorter sides are 6 cm and 8 cm. Is the longest side 14 cm?', 'T1 p156 (guess first)', guess1, choose('No, it’s shorter',
  ['Yes', '6 + 8 = 14 would be a straight line. The corner cuts across: 6² + 8² = 100, so it’s √100 = 10 cm.'], ['No, it’s longer', 'Going straight across is always shorter than going round the corner.']),
'Is going across the corner shorter or longer than going round it?', boardModel([], [
  { title: 'Square and add', say: 'Pythagoras squares the sides, adds, then square roots.', rows: ['c² = 6² + 8² = 100', 'c = √(100) = 10', '! No, it’s shorter: 10 cm'], picture: guess1 },
], 'Guess', guess1))
{
  // Your Turn Q1: AB = 8, AC = 14, the right angle at A.
  const pts: [FigurePoint, FigurePoint, FigurePoint] = [[0, 0], [14, 0], [0, 8]]
  const t = (bc: TriSide, lit?: FigureTone, caption?: string) => right(pts, [{ label: '14 cm', tone: lit }, bc, { label: '8 cm', tone: lit }], 'A right-angled triangle ABC: AB is 8 cm, AC is 14 cm, the right angle at A, and BC is missing.', ['A', 'C', 'B'], caption)
  const p = t({ label: '?', tone: 'x' })
  worked(hypotenuse, 'Find the length BC, to 1 decimal place.', 'The hypotenuse', 'T1 Your Turn Q1 (book’s numbers)', boardModel([], [
    { title: 'Find the hypotenuse', say: 'The hypotenuse is the longest side. It’s opposite the right angle. Here that’s BC, the one we want: c.', rows: ['>0 BC is opposite the right angle: c'], picture: t({ label: 'c', tone: 'lit' }) },
    { title: 'Square and add', say: 'The two shorter sides are a and b. Square each one and add.', rows: ['c² = 8² + 14²', 'c² = 64 + 196 = 260'], picture: t({ label: 'c', tone: 'x' }, 'lit') },
    { title: 'Square root', say: 'That’s c². Square root it to get c, then round to 1 decimal place.', rows: ['c = √(260) = 16.124…', '! BC = 16.1 cm'], picture: t({ label: '16.1 cm', tone: 'found' }, undefined, 'BC = 16.1 cm') },
  ], 'Find BC', p), 'Pythagoras’ theorem works in any right-angled triangle: a² + b² = c². c is the hypotenuse, the longest side, opposite the right angle. To find it, square the other two, add, then square root.')
}
{
  const pts: [FigurePoint, FigurePoint, FigurePoint] = [[15, 0], [15, 8], [0, 0]]
  const t = (c: TriSide, caption?: string) => right(pts, [{ label: '8 cm' }, c, { label: '15 cm' }], 'A right-angled triangle with shorter sides 8 cm and 15 cm. The hypotenuse is missing.', undefined, caption)
  const p = t({ label: '?', tone: 'x' })
  practice(hypotenuse, 'Find the length of the hypotenuse.', 'T1 p156 (own numbers)', p, number(17, '17 cm'), 'Square the two shorter sides, add, then square root.', boardModel([], [
    { title: 'Square and add', say: '8² is 64 and 15² is 225.', rows: ['c² = 8² + 15²', 'c² = 64 + 225 = 289'], picture: t({ label: 'c', tone: 'lit' }) },
    { title: 'Square root', say: '17 × 17 = 289.', rows: ['c = √(289)', '! c = 17 cm'], picture: t({ label: '17 cm', tone: 'found' }, 'c = 17 cm') },
  ], 'Find c', p), slips(17, [[289, 'That’s c². Square root it to get c.'], [23, 'Square the sides first: 8² + 15², not 8 + 15.'], [12.7, 'You took the squares away. For the hypotenuse, add them.']]), L_BOX('cm', 'c'))
}
{
  // Your Turn Q3: PQ = 5.9, PR = 6.7, the right angle at P.
  const pts: [FigurePoint, FigurePoint, FigurePoint] = [[0, 0], [6.7, 0], [0, 5.9]]
  const t = (qr: TriSide, caption?: string) => right(pts, [{ label: '6.7 cm' }, qr, { label: '5.9 cm' }], 'A right-angled triangle PQR: PQ is 5.9 cm, PR is 6.7 cm, the right angle at P. QR is missing.', ['P', 'R', 'Q'], caption)
  const p = t({ label: '?', tone: 'x' })
  const c = Math.sqrt(5.9 ** 2 + 6.7 ** 2)
  practice(hypotenuse, 'PQR is a right-angled triangle. Find the length QR, to 1 decimal place.', 'T1 Your Turn Q3 (book’s numbers)', p, number(8.9, '8.9 cm'), 'QR is opposite the right angle: the hypotenuse. Add the squares.', boardModel([], [
    { title: 'Square and add', say: '5.9² is 34.81 and 6.7² is 44.89.', rows: ['QR² = 5.9² + 6.7²', 'QR² = 34.81 + 44.89 = 79.7'], picture: t({ label: 'QR', tone: 'lit' }) },
    { title: 'Square root', say: 'Square root, then round to 1 decimal place.', rows: ['QR = √(79.7) = 8.927…', '! QR = 8.9 cm'], picture: t({ label: '8.9 cm', tone: 'found' }, 'QR = 8.9 cm') },
  ], 'Find QR', p), slips(8.9, [[dp(79.7, 1), 'That’s QR². Square root it.'], [12.6, 'Square the sides first, then add.'], [dp(Math.sqrt(44.89 - 34.81), 1), 'You took the squares away. QR is the hypotenuse, so add them.'], [dp(c, 2), 'Round to 1 decimal place: 8.9.']]), L_BOX('cm', 'QR'))
}
{
  const pts: [FigurePoint, FigurePoint, FigurePoint] = [[0, 0], [5, 0], [0, 3]]
  const p = right(pts, [{}, {}, {}], 'A right-angled triangle XYZ with the right angle at Y.', ['Y', 'Z', 'X'])
  practice(hypotenuse, 'Which side is the hypotenuse?', 'T1 p156 Pythagoras’ Theorem', p, choose('XZ', ['XY', 'XY touches the right angle. The hypotenuse is opposite it.'], ['YZ', 'YZ touches the right angle. The hypotenuse is opposite it, the longest side.']), 'Find the right angle. The hypotenuse is the side across from it.', boardModel([], [
    { title: 'Opposite the right angle', say: 'The right angle is at Y. The side that doesn’t touch Y is XZ, and it’s the longest.', rows: ['! XZ is the hypotenuse'], picture: right(pts, [{}, { label: 'hypotenuse', tone: 'found' }, {}], 'XZ, opposite the right angle at Y, is the hypotenuse.', ['Y', 'Z', 'X']) },
  ], 'Hypotenuse', p))
}

/* ---------- Rung 2: a shorter side ---------- */

const guess2 = right([[0, 0], [8, 0], [0, 6]], [{ label: '?', tone: 'x' }, { label: '10 cm' }, { label: '6 cm' }], 'A right-angled triangle: hypotenuse 10 cm, one side 6 cm, the third side missing.')
practice(shorter, 'Guess first: the hypotenuse is 10 cm and one side is 6 cm. Is the third side longer or shorter than 10 cm?', 'T1 p157 (guess first)', guess2, choose('Shorter',
  ['Longer', 'The hypotenuse is always the longest side, so the others are shorter.'], ['The same', 'Only the hypotenuse can be the longest: the third side is shorter.']),
'Which side is always the longest?', boardModel([], [
  { title: 'The longest side', say: 'The hypotenuse is opposite the right angle and always the longest. So for a shorter side, subtract.', rows: ['a² = 10² − 6² = 64', 'a = 8', '! Shorter: 8 cm'], picture: guess2 },
], 'Guess', guess2))

{
  // Example 1: the hypotenuse 10 cm, one side 6 cm; x the other. The right angle at the bottom right.
  const pts: [FigurePoint, FigurePoint, FigurePoint] = [[0, 0], [0, 6], [-8, 0]]
  const t = (x: TriSide, lit?: FigureTone, caption?: string) => right(pts, [{ label: '6 cm' }, { label: '10 cm', tone: lit }, x], 'A right-angled triangle: the hypotenuse is 10 cm, another side 6 cm, and the third side x.', undefined, caption)
  const p = t({ label: 'x', tone: 'x' })
  worked(shorter, 'Find the length of the side marked x.', 'A shorter side', 'T1 p156 Example 1 (book’s numbers)', boardModel([], [
    { title: 'Find the hypotenuse', say: 'The side opposite the right angle is 10 cm. That’s c. So x is one of the shorter sides, a.', rows: ['>0 Hypotenuse c = 10, a = x, b = 6'], picture: t({ label: 'x', tone: 'x' }, 'lit') },
    { title: 'Put them in', say: 'Write a² + b² = c² with the numbers in.', rows: ['x² + 6² = 10²', 'x² + 36 = 100'], picture: t({ label: 'x', tone: 'lit' }) },
    { title: 'Subtract, then root', say: 'Take 36 from both sides, then square root.', rows: ['x² = 100 − 36 = 64', 'x = √(64)', '! x = 8 cm'], picture: t({ label: '8 cm', tone: 'found' }, undefined, 'x = 8 cm') },
  ], 'Find x', p), 'When the hypotenuse is given, the missing side is a shorter one. Square both, take the smaller square from the bigger, then square root. Check: the answer must be less than the hypotenuse.')
}
{
  const pts: [FigurePoint, FigurePoint, FigurePoint] = [[0, 0], [24, 0], [0, 7]]
  const t = (x: TriSide, caption?: string) => right(pts, [x, { label: '25 cm' }, { label: '7 cm' }], 'A right-angled triangle: the hypotenuse is 25 cm, one side 7 cm, and the bottom side x.', undefined, caption)
  const p = t({ label: 'x', tone: 'x' })
  practice(shorter, 'Find the length of the side marked x.', 'T1 p156 (own numbers)', p, number(24, '24 cm'), '25 is the hypotenuse. Subtract the squares.', boardModel([], [
    { title: 'Subtract the squares', say: '25 is the hypotenuse, so subtract: 625 − 49.', rows: ['x² + 7² = 25²', 'x² = 625 − 49 = 576'], picture: t({ label: 'x', tone: 'lit' }) },
    { title: 'Square root', say: '24 × 24 = 576.', rows: ['x = √(576)', '! x = 24 cm'], picture: t({ label: '24 cm', tone: 'found' }, 'x = 24 cm') },
  ], 'Find x', p), slips(24, [[dp(Math.sqrt(674), 1), 'You added the squares. 25 is the hypotenuse, so subtract.'], [576, 'That’s x². Square root it.'], [18, 'Square the sides first: 25² − 7².']]), L_BOX())
}
{
  // Your Turn Q4: LM = 3.1, MN = 5.1 (the hypotenuse), the right angle at L.
  const ln = Math.sqrt(5.1 ** 2 - 3.1 ** 2)
  const pts: [FigurePoint, FigurePoint, FigurePoint] = [[0, 0], [-ln, 0], [0, 3.1]]
  const t = (x: TriSide, caption?: string) => right(pts, [x, { label: '5.1 cm' }, { label: '3.1 cm' }], 'A right-angled triangle LMN: LM is 3.1 cm, MN is 5.1 cm, the right angle at L. LN is missing.', ['L', 'N', 'M'], caption)
  const p = t({ label: '?', tone: 'x' })
  practice(shorter, 'LMN is a right-angled triangle. Find the length LN, to 1 decimal place.', 'T1 Your Turn Q4 (book’s numbers)', p, number(4, '4.0 cm'), 'MN is opposite the right angle. Subtract the squares.', boardModel([], [
    { title: 'Subtract the squares', say: 'MN, 5.1, is the hypotenuse. So subtract: 26.01 − 9.61.', rows: ['LN² + 3.1² = 5.1²', 'LN² = 26.01 − 9.61 = 16.4'], picture: t({ label: 'LN', tone: 'lit' }) },
    { title: 'Square root', say: 'Square root and round. Keep the 0: to 1 decimal place it’s 4.0.', rows: ['LN = √(16.4) = 4.049…', '! LN = 4.0 cm'], picture: t({ label: '4.0 cm', tone: 'found' }, 'LN = 4.0 cm') },
  ], 'Find LN', p), slips(4, [[6, 'You added the squares. MN is the hypotenuse, so subtract.'], [16.4, 'That’s LN². Square root it.'], [2, 'Square the sides first: 5.1² − 3.1².']]), L_BOX('cm', 'LN'))
}

/* ---------- Rung 3: the length of a line ---------- */

type Pt = [number, number]
const coord = (p: Pt) => `(${p.join(', ')})`.replace(/-/g, '−')
/**
 * Two points on numbered axes, the line between them, and the right-angled triangle under it: across, then up or
 * down to the second point. `labels` writes how far across and up on the dashed sides.
 */
function axesFig(P: Pt, Q: Pt, x: [number, number], y: [number, number], o: { legs?: 'dashed' | 'lit'; labels?: [string, string]; line?: 'plain' | 'x' | 'found'; caption?: string; at?: [Pt, Pt] } = {}): AngleFrame {
  const R: Pt = [Q[0], P[1]]
  const items: FigureItem[] = [{ kind: 'grid', from: [x[0], y[0]], to: [x[1], y[1]], axes: true, numbers: true }]
  if (o.legs) items.push({ kind: 'line', from: P, to: R, style: o.legs }, { kind: 'line', from: R, to: Q, style: o.legs }, { kind: 'right', at: R, a: P, b: Q })
  items.push({ kind: 'line', from: P, to: Q, style: o.line ?? 'plain' })
  if (o.labels) {
    const up = Q[1] > P[1], right = Q[0] > P[0]
    // Each count beside the middle of its side, moved along it, clear of the axis numbers, when that middle is near an axis.
    const clear = (a: number, b: number) => {
      const mid = (a + b) / 2, lo = Math.min(a, b) + 0.5, hi = Math.max(a, b) - 0.5
      if (Math.abs(mid) >= 1.3) return mid
      return [mid - 1.6, mid + 1.6].filter(t => t >= lo && t <= hi).sort((m, n) => Math.abs(n) - Math.abs(m))[0] ?? mid
    }
    items.push({ kind: 'text', at: [clear(P[0], R[0]), P[1]], text: o.labels[0], tone: o.legs === 'lit' ? 'lit' : 'given', dy: up ? 20 : -16 },
      { kind: 'text', at: [R[0], clear(R[1], Q[1])], text: o.labels[1], tone: o.legs === 'lit' ? 'lit' : 'given', dx: right ? 22 : -22 })
  }
  const [pa, qa] = o.at ?? [[-12, 16], [10, -12]]
  items.push({ kind: 'point', at: P, label: coord(P), dx: pa[0], dy: pa[1] }, { kind: 'point', at: Q, label: coord(Q), dx: qa[0], dy: qa[1] })
  return fig(items, `Axes with the points ${coord(P)} and ${coord(Q)} and the line between them.`, o.caption)
}
{
  // Example 2: (−4, −1) to (3, 4).
  const P: Pt = [-4, -1], Q: Pt = [3, 4], X: [number, number] = [-5, 4], Y: [number, number] = [-2, 5]
  const at: [Pt, Pt] = [[-20, 22], [-40, -10]]
  const p = axesFig(P, Q, X, Y, { at })
  worked(distance, 'Find the distance between (−4, −1) and (3, 4), to 1 decimal place.', 'The length of a line', 'T1 p157 Example 2 (book’s numbers)', boardModel([], [
    { title: 'Draw a triangle', say: 'Plot the points and join them. Draw across, then up: a right-angled triangle with the line as its hypotenuse.', rows: ['>0 Across, then up: a right-angled triangle'], picture: axesFig(P, Q, X, Y, { legs: 'dashed', at }) },
    { title: 'Across and up', say: 'Across: 3 − (−4) = 7. Up: 4 − (−1) = 5.', rows: ['Across = 3 − (−4) = 7', 'Up = 4 − (−1) = 5'], picture: axesFig(P, Q, X, Y, { legs: 'lit', labels: ['7', '5'], at }) },
    { title: 'Pythagoras', say: 'Square, add and square root, then round.', rows: ['c² = 5² + 7² = 25 + 49 = 74', 'c = √(74) = 8.602…', '! Length = 8.6'], picture: axesFig(P, Q, X, Y, { legs: 'dashed', labels: ['7', '5'], line: 'found', at, caption: 'Length = 8.6' }) },
  ], 'Length', p), 'To find the length of a line between two points, draw a right-angled triangle under it. Its sides are how far across and how far up. The line is the hypotenuse.')
}
for (const [P, Q, X, Y, right, at, ref] of [
  [[2, -1], [5, 3], [-1, 6], [-2, 4], 5, [[-36, 4], [10, -10]], 'T1 p157 (own numbers)'],
  [[-2, 3], [4, -1], [-3, 5], [-2, 4], 7.2, [[-14, -10], [12, 18]], 'T1 p157 (own numbers)'],
  [[-6, 2], [4, 5], [-7, 5], [-1, 6], 10.4, [[-8, -14], [-40, -10]], 'T1 Your Turn Q2 (book’s numbers)'],
] as [Pt, Pt, [number, number], [number, number], number, [Pt, Pt], string][]) {
  const dx = Q[0] - P[0], dy = Math.abs(Q[1] - P[1]), c2 = dx * dx + dy * dy, c = Math.sqrt(c2), whole = Number.isInteger(c)
  const book = ref.includes('Q2')
  const p = axesFig(P, Q, X, Y, { at })
  const shown = whole ? String(c) : book ? String(sf(c, 3)) : String(dp(c, 1))
  practice(distance, `Find the distance between ${coord(P)} and ${coord(Q)}${whole ? '' : book ? ', to 3 significant figures' : ', to 1 decimal place'}.`, ref, p, number(right, shown), 'Draw the triangle under the line. How far across? How far up or down?', boardModel([], [
    { title: 'Across and up', say: `Across: ${Q[0]} − ${P[0] < 0 ? `(${P[0]})` : P[0]} = ${dx}. ${Q[1] > P[1] ? 'Up' : 'Down'}: ${dy}.`.replace(/-/g, '−'), rows: [`Across = ${dx}`, `${Q[1] > P[1] ? 'Up' : 'Down'} = ${dy}`], picture: axesFig(P, Q, X, Y, { legs: 'lit', labels: [String(dx), String(dy)], at }) },
    { title: 'Pythagoras', say: whole ? 'Square, add and square root.' : `Square, add and square root, then round to ${book ? '3 significant figures' : '1 decimal place'}.`, rows: [`c² = ${dx}² + ${dy}² = ${dx * dx} + ${dy * dy} = ${c2}`, whole ? `c = √(${c2})` : `c = √(${c2}) = ${c.toFixed(3)}…`, `! Length = ${shown}`], picture: axesFig(P, Q, X, Y, { legs: 'dashed', labels: [String(dx), String(dy)], line: 'found', at, caption: `Length = ${shown}` }) },
  ], 'Length', p), slips(right, [[c2, 'That’s c². Square root it.'], [dx + dy, 'Square across and up first, then add.'], ...(dx !== dy ? [[dp(Math.sqrt(Math.abs(dx * dx - dy * dy)), 1), 'You took the squares away. The line is the hypotenuse, so add.'] as [number, string]] : [])]), { label: 'Length', prefix: 'Length =' })
}

/* ---------- Rung 4: problems ---------- */

/** A ladder against a wall: its foot `foot` from the wall, `len` long, reaching `h` up. */
function ladderFig(foot: number, h: number, sides: [TriSide, TriSide, TriSide], caption?: string): AngleFrame {
  const W: FigurePoint = [foot, 0], T: FigurePoint = [foot, h], F: FigurePoint = [0, 0]
  return triangleFig([W, T, F], { sides, right: 0, caption, spoken: 'A ladder leaning against a wall, its foot on the ground away from the wall.', extra: [
    { kind: 'line', from: [foot, 0], to: [foot, h * 1.15] }, { kind: 'line', from: [-foot * 0.25, 0], to: [foot * 1.1, 0] },
    { kind: 'text', at: [foot, h * 1.15], text: 'Wall', name: true, dx: 6, dy: -6 },
  ] })
}
{
  // Your Turn Q5: a 2.9 m ladder, its foot 1.3 m from the wall.
  const h = Math.sqrt(2.9 ** 2 - 1.3 ** 2)
  const l = (up: TriSide, lit?: FigureTone, caption?: string) => ladderFig(1.3, h, [up, { label: '2.9 m', tone: lit }, { label: '1.3 m', tone: lit }], caption)
  const p = l({ label: '?', tone: 'x' })
  worked(problems, 'A 2.9 m ladder leans against a wall. Its foot is 1.3 m from the wall. How far up the wall does it reach, to 1 decimal place?', 'Problems in words', 'T1 Your Turn Q5 (book’s numbers)', boardModel([], [
    { title: 'Draw the triangle', say: 'The wall, the ground and the ladder make a right-angled triangle. The ladder is the hypotenuse, opposite the right angle.', rows: ['>0 The ladder is the hypotenuse: c = 2.9'], picture: l({ label: '?', tone: 'x' }, 'lit') },
    { title: 'Subtract the squares', say: 'We want a shorter side, the height up the wall, so subtract.', rows: ['h² + 1.3² = 2.9²', 'h² = 8.41 − 1.69 = 6.72'], picture: l({ label: 'h', tone: 'lit' }) },
    { title: 'Square root', say: 'Square root and round.', rows: ['h = √(6.72) = 2.592…', '! h = 2.6 m'], picture: l({ label: '2.6 m', tone: 'found' }, undefined, 'It reaches 2.6 m up the wall') },
  ], 'Find h', p), 'In a problem in words, draw the right-angled triangle first. Find the hypotenuse: it is often the ladder, or a diagonal. Then add or subtract the squares.')
}
{
  const l = (up: TriSide, caption?: string) => ladderFig(1.4, 4.8, [up, { label: '5 m' }, { label: '1.4 m' }], caption)
  const p = l({ label: '?', tone: 'x' })
  practice(problems, 'A 5 m ladder leans against a wall with its foot 1.4 m from the wall. How far up the wall does it reach?', 'T1 Your Turn Q5 (own numbers)', p, number(4.8, '4.8 m'), 'The ladder is the hypotenuse. Subtract the squares.', boardModel([], [
    { title: 'Subtract the squares', say: 'The ladder, 5 m, is the hypotenuse: 25 − 1.96.', rows: ['h² + 1.4² = 5²', 'h² = 25 − 1.96 = 23.04'], picture: l({ label: 'h', tone: 'lit' }) },
    { title: 'Square root', say: '4.8 × 4.8 = 23.04.', rows: ['h = √(23.04)', '! h = 4.8 m'], picture: l({ label: '4.8 m', tone: 'found' }, 'It reaches 4.8 m up the wall') },
  ], 'Find h', p), slips(4.8, [[dp(Math.sqrt(26.96), 1), 'You added the squares. The ladder is the hypotenuse, so subtract.'], [23.04, 'That’s h². Square root it.'], [3.6, 'Square first: 5² − 1.4², not 5 − 1.4.']]), L_BOX('m', 'h'))
}
{
  // A gate 3 m wide and 1.2 m tall with a diagonal brace.
  const pts: [FigurePoint, FigurePoint, FigurePoint] = [[3, 0], [3, 1.2], [0, 0]]
  const g = (d: TriSide, caption?: string) => triangleFig(pts, { sides: [{ label: '1.2 m' }, d, { label: '3 m' }], right: 0, caption, spoken: 'A gate 3 m wide and 1.2 m tall, with a brace along its diagonal.', extra: [{ kind: 'shape', points: [[0, 0], [3, 0], [3, 1.2], [0, 1.2]], fill: 'none' }] })
  const p = g({ label: '?', tone: 'x' })
  practice(problems, 'A gate is 3 m wide and 1.2 m tall. A brace goes along its diagonal. How long is the brace, to 1 decimal place?', 'T1 p157 (own numbers)', p, number(3.2, '3.2 m'), 'The brace is the hypotenuse. Add the squares.', boardModel([], [
    { title: 'Add the squares', say: 'The diagonal is opposite the right angle at the corner: the hypotenuse. 9 + 1.44.', rows: ['d² = 3² + 1.2²', 'd² = 9 + 1.44 = 10.44'], picture: g({ label: 'd', tone: 'lit' }) },
    { title: 'Square root', say: 'Square root and round.', rows: ['d = √(10.44) = 3.231…', '! d = 3.2 m'], picture: g({ label: '3.2 m', tone: 'found' }, 'The brace is 3.2 m') },
  ], 'Find d', p), slips(3.2, [[4.2, 'Square the sides first: 3² + 1.2², not 3 + 1.2.'], [10.44, 'That’s d². Square root it.'], [2.7, 'You took the squares away. The brace is the hypotenuse, so add.']]), L_BOX('m', 'd'))
}

/* ---------- Review: one of each, our own numbers ---------- */

{
  const pts: [FigurePoint, FigurePoint, FigurePoint] = [[12, 0], [12, 9], [0, 0]]
  const t = (c: TriSide, caption?: string) => right(pts, [{ label: '9 cm' }, c, { label: '12 cm' }], 'A right-angled triangle with shorter sides 9 cm and 12 cm. The hypotenuse is missing.', undefined, caption)
  const p = t({ label: '?', tone: 'x' })
  practice('mixed', 'Find the length of the hypotenuse.', 'T1 review (own numbers)', p, number(15, '15 cm'), 'Square, add, square root.', boardModel([], [
    { title: 'Square and add', say: '9² is 81 and 12² is 144.', rows: ['c² = 81 + 144 = 225'], picture: t({ label: 'c', tone: 'lit' }) },
    { title: 'Square root', say: '15 × 15 = 225.', rows: ['! c = 15 cm'], picture: t({ label: '15 cm', tone: 'found' }, 'c = 15 cm') },
  ], 'Find c', p), slips(15, [[21, 'Square the sides first: 9² + 12².'], [225, 'That’s c². Square root it.']]), L_BOX('cm', 'c'))
}
{
  const pts: [FigurePoint, FigurePoint, FigurePoint] = [[4, 2], [4, 6], [1, 2]]
  const t = (d: TriSide, caption?: string) => right(pts, [{ label: 'up 4' }, d, { label: 'across 3' }], 'A line from (1, 2) to (4, 6), with its across 3 and up 4 drawn as a right-angled triangle.', undefined, caption)
  const p = t({ label: '?', tone: 'x' })
  practice('mixed', 'On a centimetre grid, find the distance from (1, 2) to (4, 6).', 'T1 review (own numbers)', p, number(5, '5 cm'), 'Across and up are the shorter sides.', boardModel([], [
    { title: 'Across and up', say: 'Across 4 − 1 = 3, up 6 − 2 = 4.', rows: ['d² = 3² + 4² = 25'], picture: t({ label: 'd', tone: 'lit' }) },
    { title: 'Square root', say: '5 × 5 = 25.', rows: ['! d = 5 cm'], picture: t({ label: '5 cm', tone: 'found' }, 'd = 5 cm') },
  ], 'Find d', p), slips(5, [[7, 'Square them: 3² + 4², then square root.'], [25, 'That’s d². Square root it.']]), L_BOX('cm', 'd'))
}

add('mixed', 'Pythagoras', 'T1 consolidation', text(
  'In a right-angled triangle, a² + b² = c². c is the hypotenuse: the longest side, opposite the right angle.',
  'Finding the hypotenuse: square the two shorter sides, add, square root.',
  'Finding a shorter side: square both, subtract, square root.',
  'A line between two points: draw the triangle under it. Across and up are the two shorter sides.',
))

export const tutorPythagorasLesson: TutorMethodLesson = {
  id: 'L219', number: 219, title: 'Pythagoras', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Use a² + b² = c² to find the hypotenuse or a shorter side, the length of a line between two points, and lengths in problems.',
  labels: { [hypotenuse]: 'The hypotenuse', [shorter]: 'A shorter side', [distance]: 'Length of a line', [problems]: 'Problems', mixed: 'Review' },
  states: finish(),
}
