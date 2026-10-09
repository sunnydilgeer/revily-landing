import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigurePoint, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { dp, fig, screens, show, slips } from '../../geometry/tutor/figureLesson'

/*
 * Geometry lesson 8: Perimeter. From GM8 in Sunny's revision book (p130–132), with our own numbers. Four rungs:
 * simple shapes (add the sides, or work back from an area or a perimeter to a side); compound shapes, finding the
 * missing sides first; shapes with a curved edge (half or part of a circumference); and sides found with Pythagoras or
 * algebra, as the book's Your Turn Q4 and Q5 do. Built like lessons 1 to 7 (Sunny, 9 Oct): the compound rung opens on
 * the measuring board, where you drag the corner cut out of a rectangle and its perimeter never changes.
 *
 * Hidden on live like lessons 1 to 7: only the unlisted Geometry shelf (src/features/geometry/geometryLessons.ts)
 * opens it.
 */

const lesson = author(208)
const { add, finish } = lesson
const { explore, worked, practice } = screens(lesson)
const simple = 'geometry-perimeter-simple'
const compound = 'geometry-perimeter-compound'
const curved = 'geometry-perimeter-curved'
const pythagoras = 'geometry-perimeter-pythagoras'

/* ---------- Pictures ---------- */

/** `along`: where on the side its label sits, 0 at its start to 1 at its end. `inside`: the label goes inside the shape, clear of a label round the corner. */
type Side = { label?: string; tone?: FigureTone; ticks?: number; along?: number; inside?: boolean }

/**
 * A polygon, its corners anticlockwise, each side labelled just outside it: side k runs from corner k to corner k + 1.
 * Anticlockwise means the outside of every side, even the inside corner of an L, is on its right.
 */
function polyFig(points: FigurePoint[], sides: Side[], spoken: string, extra: FigureItem[] = [], caption?: string, lit = false): AngleFrame {
  const items: FigureItem[] = [{ kind: 'shape', points, lit }, ...extra]
  points.forEach((a, k) => {
    const b = points[(k + 1) % points.length], side = sides[k]
    if (!side) return
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = (b[1] - a[1]) / len, ny = -(b[0] - a[0]) / len
    if (side.ticks) items.push({ kind: 'ticks', from: a, to: b, count: side.ticks })
    const t = side.along ?? 0.5
    if (side.label) items.push({ kind: 'text', at: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], text: side.label, tone: side.tone ?? 'given', dx: (side.inside ? -1 : 1) * nx * (16 + side.label.length * 3.6), dy: (side.inside ? 1 : -1) * ny * 18 })
  })
  return roomy(fig(items, spoken, caption))
}
/** Room beside the figure for the labels outside its sides. */
const roomy = (frame: AngleFrame, room = 20): AngleFrame => ({ ...frame, figure: { ...frame.figure!, room } })

const P_BOX = (unit = 'cm') => ({ label: `Perimeter (${unit})`, prefix: 'P =' })
const r1 = (n: number) => dp(n, 1)

/* A rectangle, a scalene triangle, a square, a regular pentagon. */
const rect = (w: number, h: number, l: [string, string], t: [FigureTone?, FigureTone?] = [], caption?: string) =>
  polyFig([[0, 0], [w, 0], [w, h], [0, h]], [{ label: l[0], tone: t[0] }, { label: l[1], tone: t[1] }, { label: l[0], tone: t[0] }, { label: l[1], tone: t[1] }], `A rectangle, ${l[0]} by ${l[1]}.`, [{ kind: 'right', at: [0, 0], a: [1, 0], b: [0, 1] }], caption)
const square = (s: number, label: string, tone?: FigureTone, inside?: string, caption?: string) =>
  polyFig([[0, 0], [s, 0], [s, s], [0, s]], [{ label, tone, ticks: 1 }, { ticks: 1 }, { ticks: 1 }, { ticks: 1 }], `A square${inside ? ` of area ${inside}` : ''}, side ${label}.`, [{ kind: 'right', at: [0, 0], a: [1, 0], b: [0, 1] }, ...(inside ? [{ kind: 'text' as const, at: [s / 2, s / 2] as FigurePoint, text: inside, tone: 'given' as const }] : [])], caption)
function regular(n: number, label: string, tone?: FigureTone, inside?: string, caption?: string) {
  const pts = Array.from({ length: n }, (_, k): FigurePoint => { const a = (-90 - 180 / n + 360 * k / n) * Math.PI / 180; return [Math.cos(a), Math.sin(a)] })
  return polyFig(pts, pts.map((_, k) => ({ ticks: 1, ...(k === 0 ? { label, tone } : {}) })), `A regular ${n === 5 ? 'pentagon' : 'hexagon'}, every side ${label}.`, inside ? [{ kind: 'text', at: [0, 0], text: inside, tone: 'given' }] : [], caption)
}

/* ---------- Rung 1: simple shapes ---------- */

{
  const p = rect(9, 4, ['9 cm', '4 cm'])
  worked(simple, 'Find the perimeter of this rectangle.', 'Perimeter', 'GM8 p130 Perimeter (own numbers)', boardModel([], [
    { title: 'All the way round', say: 'Perimeter is the distance all the way round the outside. A rectangle has four sides: two 9s and two 4s.', rows: ['P = 9 + 4 + 9 + 4'], picture: rect(9, 4, ['9 cm', '4 cm'], ['lit', 'lit']) },
    { title: 'Add them', say: 'Or double 9 + 4. Perimeter is a length, so it’s in cm, not cm².', rows: ['= 2 × 13', '! P = 26 cm'], picture: rect(9, 4, ['9 cm', '4 cm'], [], 'P = 26 cm') },
  ], 'Find P', p), 'Perimeter is the distance all the way round a shape: add up every side.')
}
{
  const pts: FigurePoint[] = [[0, 0], [9, 0], [5.833, 3.873]]
  const tri = (tone?: FigureTone, caption?: string) => polyFig(pts, [{ label: '9 cm', tone }, { label: '5 cm', tone }, { label: '7 cm', tone }], 'A triangle with sides 9 cm, 5 cm and 7 cm.', [], caption)
  const p = tri()
  practice(simple, 'Find the perimeter of this triangle.', 'GM8 p130 (own numbers)', p, number(21, '21 cm'), 'Add the three sides.', boardModel([], [
    { title: 'Add the sides', say: '9 + 5 + 7.', rows: ['P = 9 + 5 + 7', '! P = 21 cm'], picture: tri('lit', 'P = 21 cm') },
  ], 'Find P', p), slips(21, [[r1(9 * 3.873 / 2), 'That’s near the area. Perimeter is the distance round: add the sides.'], [315, 'Add the sides, don’t multiply them.']]), P_BOX())
}
practice(simple, 'Which is the perimeter of a 5 m by 3 m rectangle?', 'GM8 p130 (own numbers)', rect(5, 3, ['5 m', '3 m']), choose('16 m', ['15 m²', 'That’s the area, 5 × 3. Perimeter is the distance round.'], ['8 m', 'That’s only two sides. There are four.'], ['15 m', '5 × 3 is the area. Add all four sides.']), 'Add all four sides.',
  boardModel([], [{ title: 'Round the outside', say: 'Two 5s and two 3s.', rows: ['P = 5 + 3 + 5 + 3', '! P = 16 m'], picture: rect(5, 3, ['5 m', '3 m'], ['lit', 'lit'], 'P = 16 m') }], 'Find P', rect(5, 3, ['5 m', '3 m'])))
{
  const p = square(7, '?', 'x', '49 cm²')
  worked(simple, 'A square has an area of 49 cm². Find its perimeter.', 'Area to perimeter', 'GM8 p131 Q1 (own numbers)', boardModel([], [
    { title: 'Find a side', say: 'A square’s area is side × side, so the side is the square root of the area: √49 = 7.', rows: ['s × s = 49', 's = √49 = 7'], picture: square(7, '7 cm', 'lit', '49 cm²') },
    { title: 'Four sides', say: 'A square has four equal sides.', rows: ['P = 4 × 7', '! P = 28 cm'], picture: square(7, '7 cm', 'given', undefined, 'P = 28 cm') },
  ], 'Find P', p), 'Given an area, find the side first. Square root a square’s area to get its side.')
}
{
  const p = square(9, '?', 'x', '81 cm²')
  practice(simple, 'A square has an area of 81 cm². Find its perimeter.', 'GM8 p131 Q1 (own numbers)', p, number(36, '36 cm'), 'Square root the area to get a side.', boardModel([], [
    { title: 'Find a side', say: '√81 = 9, so each side is 9 cm.', rows: ['s = √81 = 9'], picture: square(9, '9 cm', 'lit', '81 cm²') },
    { title: 'Four sides', say: '4 × 9.', rows: ['P = 4 × 9', '! P = 36 cm'], picture: square(9, '9 cm', 'given', undefined, 'P = 36 cm') },
  ], 'Find P', p), slips(36, [[324, 'That’s 4 × 81. Find the side first: √81 = 9.'], [20.25, 'That’s 81 ÷ 4. A side is √81 = 9.'], [9, 'That’s one side. The perimeter is all four.']]), P_BOX())
}
{
  const p = regular(5, 's', 'x', 'P = 32 cm')
  practice(simple, 'A regular pentagon has a perimeter of 32 cm. How long is each side?', 'GM8 p131 Q2 (own numbers)', p, number(6.4, '6.4 cm'), 'Regular means every side is the same. How many sides?', boardModel([], [
    { title: 'Five equal sides', say: 'A pentagon has 5 sides, all equal, so share the perimeter between them.', rows: ['5 × s = 32', 's = 32 ÷ 5', '! s = 6.4 cm'], picture: regular(5, '6.4 cm', 'found') },
  ], 'Find s', p), slips(6.4, [[8, 'That’s 32 ÷ 4. A pentagon has 5 sides.'], [160, 'Divide by 5, don’t multiply.'], [5.3, 'That’s 32 ÷ 6. A pentagon has 5 sides.']]), { label: 'Side (cm)', prefix: 's =' })
}

/* ---------- Rung 2: compound shapes ---------- */

explore(compound, 'Drag the corner cut out of the rectangle. Watch the area, and the perimeter.', 'GM8 p130 Compound shapes (play)', { mode: 'notch' })
{
  const pts: FigurePoint[] = [[0, 0], [12, 0], [12, 5], [7, 5], [7, 9], [0, 9]]
  const L = (a: Side, b: Side, caption?: string) => polyFig(pts, [{ label: '12 cm' }, { label: '5 cm' }, { inside: true, ...a }, b, { label: '7 cm' }, { label: '9 cm' }], 'An L-shape: bottom 12 cm, left 9 cm, top 7 cm, the lower right side 5 cm; the two sides of the step are missing.', [], caption)
  const p = L({ label: 'a', tone: 'x' }, { label: 'b', tone: 'x' })
  worked(compound, 'Find the perimeter of this shape.', 'Missing sides', 'GM8 p130 Example 1 (own numbers)', boardModel([], [
    { title: 'Across', say: 'The whole bottom is 12. The top 7 and side a make the same width.', rows: ['a = 12 − 7 = 5'], picture: L({ label: '5 cm', tone: 'found' }, { label: 'b', tone: 'x' }) },
    { title: 'Up', say: 'The whole left side is 9. The 5 on the right and side b make the same height.', rows: ['b = 9 − 5 = 4'], picture: L({ label: '5 cm' }, { label: '4 cm', tone: 'found' }) },
    { title: 'Add all six', say: 'Go round once, starting at a corner, so you don’t miss or double a side.', rows: ['P = 12 + 5 + 5 + 4 + 7 + 9', '! P = 42 cm'], picture: L({ label: '5 cm', tone: 'lit' }, { label: '4 cm', tone: 'lit' }, 'P = 42 cm') },
  ], 'Find P', p), 'Find every missing side first. Across: the long side = the short sides together. Up: the same.')
}
{
  const pts: FigurePoint[] = [[0, 0], [14, 0], [14, 4], [8, 4], [8, 10], [0, 10]]
  const L = (x: Side, caption?: string) => polyFig(pts, [{ label: '14 cm' }, {}, x, {}, { label: '8 cm' }, { label: '10 cm' }], 'An L-shape: bottom 14 cm, top 8 cm, left 10 cm. The step across is x.', [], caption)
  const p = L({ label: 'x', tone: 'x' })
  practice(compound, 'Find the length x.', 'GM8 p130 (own numbers)', p, number(6, 'x = 6 cm'), 'The top and x together are as wide as the bottom.', boardModel([], [
    { title: 'Across', say: 'The bottom, 14, is the top, 8, and x together.', rows: ['8 + x = 14', '! x = 6 cm'], picture: L({ label: '6 cm', tone: 'found' }) },
  ], 'Find x', p), slips(6, [[22, 'Subtract: x is the part of 14 that the 8 doesn’t cover.'], [4, 'That’s the height of the step. x goes across.']]), { label: 'Length (cm)', prefix: 'x =' })
}
{
  const pts: FigurePoint[] = [[0, 0], [15, 0], [15, 6], [9, 6], [9, 10], [0, 10]]
  const L = (a: Side, b: Side, caption?: string) => polyFig(pts, [{ label: '15 cm' }, { label: '6 cm' }, { inside: true, ...a }, b, { label: '9 cm' }, { label: '10 cm' }], 'An L-shape: bottom 15 cm, lower right side 6 cm, top 9 cm, left 10 cm; two sides of the step are missing.', [], caption)
  const p = L({}, {})
  practice(compound, 'Find the perimeter of this shape.', 'GM8 p131 Q4 (own numbers)', p, number(50, '50 cm'), 'Find the two missing sides first.', boardModel([], [
    { title: 'Missing sides', say: 'Across: 15 − 9 = 6. Up: 10 − 6 = 4.', rows: ['a = 15 − 9 = 6', 'b = 10 − 6 = 4'], picture: L({ label: '6 cm', tone: 'found' }, { label: '4 cm', tone: 'found' }) },
    { title: 'Add all six', say: 'Once round the outside.', rows: ['P = 15 + 6 + 6 + 4 + 9 + 10', '! P = 50 cm'], picture: L({ label: '6 cm' }, { label: '4 cm' }, 'P = 50 cm') },
  ], 'Find P', p), slips(50, [[40, 'You’ve missed the two sides of the step. Find them, then add all six.'], [126, 'That’s the area. Perimeter is the distance round.']]), P_BOX())
}
{
  const pts: FigurePoint[] = [[0, 0], [160, 0], [160, 60], [110, 60], [110, 90], [0, 90]]
  const L = (lit = false, caption?: string) => polyFig(pts, [{ label: '160 m' }, {}, {}, {}, {}, { label: '90 m' }], 'A rectangular field, 160 m by 90 m, with a corner cut out. Only the 160 m and 90 m sides are labelled.', lit ? [{ kind: 'line', from: [110, 90], to: [160, 90], style: 'dashed' }, { kind: 'line', from: [160, 60], to: [160, 90], style: 'dashed' }] : [], caption)
  const p = L()
  practice(compound, 'A field is a rectangle with a corner cut out. Find its perimeter.', 'GM8 p132 Q5 (own numbers)', p, number(500, '500 m'), 'Slide the sides of the cut out to the corner. What shape is the perimeter then?', boardModel([], [
    { title: 'Slide the cut out', say: 'Push the step’s two sides out to the dashed corner: across they still add to 160, and up they still add to 90. The perimeter is the same as the whole rectangle’s.', rows: ['> Same as a 160 by 90 rectangle'], picture: L(true) },
    { title: 'Two of each', say: 'Two 160s and two 90s.', rows: ['P = 2 × (160 + 90)', '! P = 500 m'], picture: L(false, 'P = 500 m') },
  ], 'Find P', p), slips(500, [[250, 'That’s once round half of it: double it.'], [14400, 'That’s the area of the rectangle. Perimeter is the distance round.']]), P_BOX('m'))
}

/* ---------- Rung 3: curved edges ---------- */

{
  // A 10 by 7 rectangle with a semicircle on its top side.
  const arch = (tone?: FigureTone, arc: 'lit' | 'plain' = 'plain', caption?: string) => fig([
    { kind: 'shape', points: [[10, 7], [10, 0], [0, 0], [0, 7]], open: true },
    { kind: 'arc', centre: [5, 7], r: 5, from: 0, to: 180, style: arc },
    { kind: 'line', from: [0, 7], to: [10, 7], style: 'dashed' },
    { kind: 'right', at: [0, 0], a: [1, 0], b: [0, 1] },
    { kind: 'text', at: [5, 0], text: '10 cm', tone, dy: 20 },
    { kind: 'text', at: [0, 3.5], text: '7 cm', tone, dx: -30 },
    { kind: 'text', at: [10, 3.5], text: '7 cm', tone, dx: 30 },
  ], 'A 10 cm by 7 cm rectangle with a semicircle on its top, 10 cm side. The top side is dashed: it is inside the shape.', caption)
  const half = Math.PI * 10 / 2
  worked(curved, 'Find the perimeter of this shape, to 1 decimal place.', 'A curved edge', 'GM8 p132 Example 1 (own numbers)', boardModel([], [
    { title: 'The curved part', say: `The curve is half a circle of diameter 10: half of π × 10 = ${half.toFixed(3)}….`, rows: [`{1|2} × π × 10 = ${half.toFixed(3)}…`], picture: arch(undefined, 'lit') },
    { title: 'The straight sides', say: 'The dashed side is inside the shape, so it isn’t part of the perimeter. Only three straight sides count.', rows: ['7 + 10 + 7 = 24'], picture: arch('lit') },
    { title: 'Add', say: 'Add the curve and the straight sides; round at the end.', rows: [`P = 24 + ${half.toFixed(3)}…`, `! P = ${show(r1(24 + half), 1)} cm`], picture: arch(undefined, 'plain', `P = ${show(r1(24 + half), 1)} cm`) },
  ], 'Find P', arch()), 'A curved edge is part of a circumference: a semicircle’s is ½ × π × d. Only count edges on the outside.')
}
{
  const semi = (tone?: FigureTone, caption?: string) => fig([
    { kind: 'shape', points: [[-4, 0], [4, 0]], open: true },
    { kind: 'arc', centre: [0, 0], r: 4, from: 0, to: 180 },
    { kind: 'point', at: [0, 0] },
    { kind: 'measure', from: [0, 0], to: [4, 0], label: '4 cm', tone, offset: 14, side: 1 },
  ], 'A semicircle of radius 4 cm.', caption)
  const P = r1(4 * Math.PI + 8)
  practice(curved, 'Find the perimeter of this semicircle, to 1 decimal place.', 'GM8 p132 Q2 (own numbers)', semi(), number(P, `${P} cm`), 'Half the circumference, plus the straight edge.', boardModel([], [
    { title: 'Half the circumference', say: `The diameter is 8, so the curve is ½ × π × 8 = 4π = ${(4 * Math.PI).toFixed(3)}….`, rows: [`{1|2} × π × 8 = ${(4 * Math.PI).toFixed(3)}…`], picture: semi('lit') },
    { title: 'Add the straight edge', say: 'The straight edge is the diameter, 8 cm. Don’t forget it.', rows: [`P = ${(4 * Math.PI).toFixed(3)}… + 8`, `! P = ${P} cm`], picture: semi(undefined, `P = ${P} cm`) },
  ], 'Find P', semi()), slips(P, [[r1(4 * Math.PI), 'That’s only the curve. Add the straight edge, 8 cm.'], [r1(2 * Math.PI + 8), 'The diameter is 8, not 4: the curve is ½ × π × 8.'], [r1(8 * Math.PI + 8), 'Half a circle: half of π × 8.']]), P_BOX())
}
{
  const track = (tone?: FigureTone, caption?: string) => fig([
    { kind: 'line', from: [0, 0], to: [20, 0] },
    { kind: 'line', from: [0, 8], to: [20, 8] },
    { kind: 'arc', centre: [20, 4], r: 4, from: -90, to: 90 },
    { kind: 'arc', centre: [0, 4], r: 4, from: 90, to: 270 },
    { kind: 'line', from: [20, 0], to: [20, 8], style: 'dashed' },
    { kind: 'line', from: [0, 0], to: [0, 8], style: 'dashed' },
    { kind: 'text', at: [10, 0], text: '20 m', tone, dy: 20 },
    { kind: 'text', at: [20, 4], text: '8 m', tone, dx: -26 },
  ], 'A running track: two straight sides of 20 m, with a semicircle of diameter 8 m at each end.', caption)
  const P = r1(40 + 8 * Math.PI)
  practice(curved, 'A running track has two straights of 20 m and a semicircle at each end. Find its perimeter, to 1 decimal place.', 'GM8 p132 (own numbers)', track(), number(P, `${P} m`), 'Two semicircles make one whole circle.', boardModel([], [
    { title: 'Two semicircles', say: `The two ends make one whole circle of diameter 8: π × 8 = ${(8 * Math.PI).toFixed(3)}….`, rows: [`π × 8 = ${(8 * Math.PI).toFixed(3)}…`], picture: track('lit') },
    { title: 'Add the straights', say: 'Two straights of 20 m. The dashed lines are inside the track.', rows: [`P = 40 + ${(8 * Math.PI).toFixed(3)}…`, `! P = ${P} m`], picture: track(undefined, `P = ${P} m`) },
  ], 'Find P', track()), slips(P, [[r1(40 + 4 * Math.PI), 'That’s only one semicircle. There’s one at each end: a whole circle.'], [r1(56 + 8 * Math.PI), 'The dashed ends are inside the track: don’t count them.'], [r1(20 + 8 * Math.PI), 'There are two straights of 20 m.']]), P_BOX('m'))
}

/* ---------- Rung 4: sides from Pythagoras or algebra ---------- */

const rightTri = (a: number, b: number, l: [Side, Side, Side], caption?: string) =>
  polyFig([[0, 0], [b, 0], [0, a]], [l[1], l[2], l[0]], `A right-angled triangle: sides ${l[0].label} and ${l[1].label} around the right angle, and ${l[2].label} opposite it.`, [{ kind: 'right', at: [0, 0], a: [1, 0], b: [0, 1] }], caption)
{
  const tri = (c: Side, caption?: string) => rightTri(5, 12, [{ label: '5 cm' }, { label: '12 cm' }, c], caption)
  const p = tri({ label: '?', tone: 'x' })
  worked(pythagoras, 'Find the perimeter of this right-angled triangle.', 'Pythagoras first', 'GM8 p131 Q4 (own numbers)', boardModel([], [
    { title: 'The missing side', say: 'A missing side of a right-angled triangle: use Pythagoras. The longest side, c, is opposite the right angle.', rows: ['c² = 5² + 12²', 'c² = 25 + 144 = 169', 'c = √169 = 13'], picture: tri({ label: '13 cm', tone: 'found' }) },
    { title: 'Add the three sides', say: 'Now every side is known.', rows: ['P = 5 + 12 + 13', '! P = 30 cm'], picture: tri({ label: '13 cm' }, 'P = 30 cm') },
  ], 'Find P', p), 'A side missing from a right-angled triangle? Find it with Pythagoras, a² + b² = c², then add.')
}
{
  const tri = (c: Side, caption?: string) => rightTri(9, 12, [{ label: '9 cm' }, { label: '12 cm' }, c], caption)
  const p = tri({ label: '?', tone: 'x' })
  practice(pythagoras, 'Find the perimeter of this right-angled triangle.', 'GM8 p131 Q4 (own numbers)', p, number(36, '36 cm'), 'Pythagoras for the long side first.', boardModel([], [
    { title: 'Pythagoras', say: '81 + 144 = 225, and √225 = 15.', rows: ['c² = 9² + 12²', 'c² = 81 + 144 = 225', 'c = 15'], picture: tri({ label: '15 cm', tone: 'found' }) },
    { title: 'Add', say: '9 + 12 + 15.', rows: ['P = 9 + 12 + 15', '! P = 36 cm'], picture: tri({ label: '15 cm' }, 'P = 36 cm') },
  ], 'Find P', p), slips(36, [[21, 'Find the third side first, with Pythagoras.'], [246, 'That adds 9² + 12² + 9 + 12. Square root 225 first: c = 15.']]), P_BOX())
}
{
  const tri = (b: Side, caption?: string) => rightTri(6, 8, [{ label: '6 cm' }, b, { label: '10 cm' }], caption)
  const p = tri({ label: '?', tone: 'x' })
  practice(pythagoras, 'Find the perimeter of this right-angled triangle.', 'GM8 p131 (own numbers)', p, number(24, '24 cm'), 'The 10 is the longest side. Subtract the squares.', boardModel([], [
    { title: 'A shorter side', say: 'The missing side is a short one, so subtract: 100 − 36 = 64, and √64 = 8.', rows: ['b² = 10² − 6²', 'b² = 100 − 36 = 64', 'b = 8'], picture: tri({ label: '8 cm', tone: 'found' }) },
    { title: 'Add', say: '6 + 8 + 10.', rows: ['P = 6 + 8 + 10', '! P = 24 cm'], picture: tri({ label: '8 cm' }, 'P = 24 cm') },
  ], 'Find P', p), slips(24, [[r1(16 + Math.sqrt(136)), 'You added the squares. 10 is the longest side, so subtract: 100 − 36.'], [16, 'Find the third side first.']]), P_BOX())
}
{
  const r = (l: [string, string], t?: FigureTone, caption?: string) => rect(10, 6, l, [t, t], caption)
  const p = r(['2x', 'x + 3'], 'x')
  worked(pythagoras, 'A rectangle has sides 2x and x + 3, and a perimeter of 36 cm. Find x.', 'Perimeter with algebra', 'GM8 p132 Q5 (own numbers)', boardModel([], [
    { title: 'Add the sides', say: 'Add all four sides, like any perimeter, and collect: 2x + 2x + x + x = 6x, and 3 + 3 = 6.', rows: ['2x + (x + 3) + 2x + (x + 3) = 36', '6x + 6 = 36'], picture: r(['2x', 'x + 3'], 'lit') },
    { title: 'Solve', say: 'Take 6 from both sides, then divide by 6.', rows: ['6x = 30', '! x = 5'], picture: r(['10 cm', '8 cm'], 'found', 'x = 5: sides 10 cm and 8 cm') },
  ], 'Find x', p), 'An algebra perimeter: add the sides into one expression, set it equal to the perimeter, and solve.')
}
{
  // Isosceles: base 2x = 16, equal sides x + 4 = 12.
  const h = Math.sqrt(12 * 12 - 8 * 8)
  const tri = (t?: FigureTone, caption?: string, found = false) => polyFig([[0, 0], [16, 0], [8, h]], [{ label: found ? '16 cm' : '2x', tone: t }, { label: found ? '12 cm' : 'x + 4', tone: t, ticks: 1 }, { label: found ? '12 cm' : 'x + 4', tone: t, ticks: 1 }], 'An isosceles triangle: two equal sides of x + 4 and a base of 2x.', [], caption)
  const p = tri('x')
  practice(pythagoras, 'This isosceles triangle has a perimeter of 40 cm. Find x.', 'GM8 p132 Q5 (own numbers)', p, number(8, 'x = 8'), 'Add the three sides into one expression, then set it equal to 40.', boardModel([], [
    { title: 'Add the sides', say: 'x + x + 2x = 4x, and 4 + 4 = 8.', rows: ['(x + 4) + (x + 4) + 2x = 40', '4x + 8 = 40'], picture: tri('lit') },
    { title: 'Solve', say: 'Take 8 from both sides, then divide by 4.', rows: ['4x = 32', '! x = 8'], picture: tri('found', 'Sides 12, 12 and 16 cm', true) },
  ], 'Find x', p), slips(8, [[12, 'That’s x + 4, a side. The question asks for x.'], [10, 'There are two 4s: 4x + 8 = 40.'], [16, 'That’s 2x, the base. Halve it for x.']]), { prefix: 'x =' })
}
add('mixed', 'Perimeter', 'GM8 consolidation', text(
  'Perimeter is the distance all the way round: add every side. It’s a length, in cm or m, not cm².',
  'Compound shapes: find each missing side first. Across, the long side is the short ones together; up, the same.',
  'A curved edge is part of a circumference: a semicircle’s is ½ × π × d. Dashed lines inside a shape don’t count.',
  'A side missing from a right-angled triangle: Pythagoras. Sides in algebra: add them, set equal to the perimeter, solve.',
))

export const tutorPerimeterLesson: TutorMethodLesson = {
  id: 'L208', number: 208, title: 'Perimeter', level: 'GCSE Foundation',
  goal: 'Find the perimeter of simple, compound and curved shapes, finding missing sides with subtraction, Pythagoras or algebra first.',
  labels: { [simple]: 'Simple shapes', [compound]: 'Compound shapes', [curved]: 'Curved edges', [pythagoras]: 'Pythagoras and algebra', mixed: 'Review' },
  states: finish(),
}
