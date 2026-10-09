import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigurePoint, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { fig, screens, slips } from '../../geometry/tutor/figureLesson'

/*
 * Geometry lesson 6: Areas of shapes. From GM6 in Sunny's revision book (p126–127), with our own numbers. Four rungs:
 * rectangles and parallelograms (base × vertical height); triangles (half of that); trapeziums, ½(a + b)h; and working
 * backwards from an area to a length, as the book's Example 2 does, with the book's Your Turn Q2 idea of finding the
 * height first with Pythagoras. Built like lessons 1 to 5 (Sunny, 9 Oct): rungs open on the measuring board, where you
 * slide a parallelogram or triangle's top along a grid and the area only changes with the height.
 *
 * Hidden on live like lessons 1 to 5: only the unlisted Geometry shelf (src/features/geometry/geometryLessons.ts)
 * opens it.
 */

const lesson = author(206)
const { add, finish } = lesson
const { explore, worked, practice } = screens(lesson)
const rectPara = 'geometry-area-rect-para'
const triangle = 'geometry-area-triangle'
const trapezium = 'geometry-area-trapezium'
const backwards = 'geometry-area-backwards'

/* ---------- Pictures ---------- */

type Marks = { b?: FigureTone; h?: FigureTone; a?: FigureTone; slant?: FigureTone; fill?: boolean }
const measure = (from: FigurePoint, to: FigurePoint, label: string, tone: FigureTone = 'given', offset = -14, side: 1 | -1 = -1): FigureItem => ({ kind: 'measure', from, to, label, tone, offset, side })

/** A rectangle w by h, its two sides labelled. */
function rectFig(w: number, h: number, labels: [string, string], marks: Marks = {}, caption?: string): AngleFrame {
  return fig([
    { kind: 'shape', points: [[0, 0], [w, 0], [w, h], [0, h]], lit: marks.fill },
    { kind: 'right', at: [0, 0], a: [1, 0], b: [0, 1] },
    measure([0, 0], [w, 0], labels[0], marks.b, 14, 1),
    measure([0, 0], [0, h], labels[1], marks.h, -14, 1),
  ], `A rectangle, ${labels[0]} long and ${labels[1]} wide.`, caption)
}

/**
 * A parallelogram (or, with `top` 0, a triangle) on base b, its top slid `shift` along, with its vertical height drawn
 * dashed inside (or beside) it. `slant` labels the sloping side, the length you don't use.
 */
function slantFig(kind: 'parallelogram' | 'triangle', b: number, h: number, shift: number, labels: { b: string; h: string; slant?: string }, marks: Marks = {}, caption?: string): AngleFrame {
  // A labelled slant is drawn to its length: the top sits where that side really reaches.
  const s = parseFloat(labels.slant ?? '')
  if (s > h) shift = Math.sqrt(s * s - h * h)
  const pts: FigurePoint[] = kind === 'parallelogram' ? [[0, 0], [b, 0], [b + shift, h], [shift, h]] : [[0, 0], [b, 0], [shift, h]]
  const foot: FigurePoint = [shift, 0]
  const items: FigureItem[] = [
    { kind: 'shape', points: pts, lit: marks.fill },
    { kind: 'line', from: [shift, h], to: foot, style: 'dashed' },
    { kind: 'right', at: foot, a: [shift + 1, 0], b: [shift, 1] },
    measure([0, 0], [b, 0], labels.b, marks.b, 14, 1),
    measure(foot, [shift, h], labels.h, marks.h, 0, 1),
  ]
  if (shift < 0 || shift > b) items.push({ kind: 'line', from: [shift < 0 ? shift : b, 0], to: [shift < 0 ? 0 : shift, 0], style: 'dashed' })
  if (labels.slant) items.push(measure(kind === 'parallelogram' ? [b, 0] : [0, 0], kind === 'parallelogram' ? [b + shift, h] : [shift, h], labels.slant, marks.slant, -16, -1))
  return fig(items, `A ${kind} with base ${labels.b} and vertical height ${labels.h}${labels.slant ? `; its sloping side is ${labels.slant}` : ''}. The height is drawn dashed, at right angles to the base.`, caption)
}

/** A trapezium: parallel sides a (top) and b (bottom), height h; the top starts `shift` along. */
function trapFig(a: number, b: number, h: number, shift: number, labels: { a: string; b: string; h: string; slant?: string }, marks: Marks = {}, caption?: string): AngleFrame {
  const items: FigureItem[] = [
    { kind: 'shape', points: [[0, 0], [b, 0], [shift + a, h], [shift, h]], lit: marks.fill },
    { kind: 'line', from: [shift, h], to: [shift, 0], style: 'dashed' },
    { kind: 'right', at: [shift, 0], a: [shift + 1, 0], b: [shift, 1] },
    measure([0, 0], [b, 0], labels.b, marks.b, 14, 1),
    measure([shift, h], [shift + a, h], labels.a, marks.a, -14, -1),
    measure([shift, 0], [shift, h], labels.h, marks.h, 0, 1),
  ]
  if (labels.slant) items.push(measure([b, 0], [shift + a, h], labels.slant, marks.slant, -16, -1))
  return fig(items, `A trapezium with parallel sides ${labels.a} and ${labels.b}, and vertical height ${labels.h}${labels.slant ? `; its slanted side is ${labels.slant}` : ''}.`, caption)
}

const cm2 = (n: number) => `${n} cm²`
const AREA = { label: 'Area (cm²)', prefix: 'A =' }
const half = (n: number) => n / 2

/* ---------- Rung 1: rectangles and parallelograms ---------- */

explore(rectPara, 'Slide the top of the parallelogram. Its area only changes when its height does.', 'GM6 p126 Area of a parallelogram (play)', { mode: 'shear', shape: 'parallelogram' })
{
  const p = rectFig(7, 4, ['7 cm', '4 cm'])
  worked(rectPara, 'Find the area of this rectangle.', 'Area of a rectangle', 'GM6 p126 Area of a rectangle (own numbers)', boardModel([], [
    { title: 'Length × width', say: 'A 7 by 4 rectangle holds 4 rows of 7 centimetre squares.', rows: ['A = L × W', 'A = 7 × 4'], picture: rectFig(7, 4, ['7 cm', '4 cm'], { b: 'lit', h: 'lit' }) },
    { title: 'Multiply', say: 'Area is in square units: cm × cm makes cm².', rows: ['! A = 28 cm²'], picture: rectFig(7, 4, ['7 cm', '4 cm'], { fill: true }, 'Area 28 cm²') },
  ], 'Find the area', p), 'Area is the space inside a flat shape, counted in squares: cm², m², mm².')
}
{
  const p = slantFig('parallelogram', 9, 5, 2.5, { b: '9 cm', h: '5 cm', slant: '6 cm' })
  worked(rectPara, 'Find the area of this parallelogram.', 'Area of a parallelogram', 'GM6 p126 Area of a parallelogram (own numbers)', boardModel([], [
    { title: 'The vertical height', say: 'Use the height at right angles to the base, the dashed line, not the sloping side. Cut the triangle off one end and stick it on the other: it makes a 9 by 5 rectangle.', rows: ['> Height 5 cm, not 6 cm'], picture: slantFig('parallelogram', 9, 5, 2.5, { b: '9 cm', h: '5 cm', slant: '6 cm' }, { h: 'lit', slant: 'faint' }) },
    { title: 'Base × height', say: 'So its area is base × vertical height.', rows: ['A = b × h', 'A = 9 × 5', '! A = 45 cm²'], picture: slantFig('parallelogram', 9, 5, 2.5, { b: '9 cm', h: '5 cm', slant: '6 cm' }, { b: 'lit', h: 'lit', slant: 'faint', fill: true }, 'Area 45 cm²') },
  ], 'Find the area', p), 'Area of a parallelogram = base × vertical height. The sloping side isn’t used.')
}
for (const [b, h, slant, shift, ref] of [[15, 8, 9, 3.5, 'GM6 p127 Q3 (own numbers)'], [11, 6, 7, 3, 'GM6 p126 (own numbers)']] as const) {
  const p = slantFig('parallelogram', b, h, shift, { b: `${b} cm`, h: `${h} cm`, slant: `${slant} cm` })
  practice(rectPara, 'Find the area of this parallelogram.', ref, p, number(b * h, cm2(b * h)), 'Base × the vertical height (dashed).', boardModel([], [
    { title: 'The vertical height', say: `The dashed height, ${h} cm, is at right angles to the base. The sloping ${slant} cm isn’t used.`, rows: [`> Height ${h} cm`], picture: slantFig('parallelogram', b, h, shift, { b: `${b} cm`, h: `${h} cm`, slant: `${slant} cm` }, { h: 'lit', slant: 'faint' }) },
    { title: 'Base × height', say: 'Multiply the base by the vertical height.', rows: [`A = ${b} × ${h}`, `! A = ${cm2(b * h)}`], picture: slantFig('parallelogram', b, h, shift, { b: `${b} cm`, h: `${h} cm`, slant: `${slant} cm` }, { b: 'lit', h: 'lit', slant: 'faint', fill: true }) },
  ], 'Find the area', p), slips(b * h, [[b * slant, `That uses the sloping side. Use the vertical height, ${h} cm.`], [2 * (b + slant), 'That’s the perimeter, the distance round. Area is base × height.'], [b * h / 2, 'Not half: that’s a triangle. A parallelogram is base × height.']]), AREA)
}
{
  const p = rectFig(12, 4.5, ['12 cm', '4.5 cm'])
  practice(rectPara, 'Find the area of this rectangle.', 'GM6 p126 Area of a rectangle (own numbers)', p, number(54, cm2(54)), 'Length × width.', boardModel([], [
    { title: 'Length × width', say: '12 × 4.5: 12 × 4 = 48, and 12 × 0.5 = 6.', rows: ['A = 12 × 4.5', '! A = 54 cm²'], picture: rectFig(12, 4.5, ['12 cm', '4.5 cm'], { fill: true }) },
  ], 'Find the area', p), slips(54, [[33, 'That’s the perimeter, 12 + 4.5 + 12 + 4.5. Area is length × width.'], [16.5, 'Multiply the length and width, don’t add them.']]), AREA)
}

/* ---------- Rung 2: triangles ---------- */

explore(triangle, 'Slide the top of the triangle along. Watch its area.', 'GM6 p126 Area of a triangle (play)', { mode: 'shear', shape: 'equilateral' })
{
  const p = slantFig('triangle', 10, 7, 3.5, { b: '10 cm', h: '7 cm' })
  worked(triangle, 'Find the area of this triangle.', 'Area of a triangle', 'GM6 p126 Area of a triangle (own numbers)', boardModel([], [
    { title: 'Half a rectangle', say: 'A triangle is exactly half of the rectangle (or parallelogram) on the same base with the same height.', rows: ['A = {1|2} × b × h'], picture: slantFig('triangle', 10, 7, 3.5, { b: '10 cm', h: '7 cm' }, { b: 'lit', h: 'lit' }) },
    { title: 'Put the numbers in', say: 'Base 10, vertical height 7.', rows: ['A = {1|2} × 10 × 7', '= {1|2} × 70', '! A = 35 cm²'], picture: slantFig('triangle', 10, 7, 3.5, { b: '10 cm', h: '7 cm' }, { fill: true }, 'Area 35 cm²') },
  ], 'Find the area', p), 'Area of a triangle = ½ × base × vertical height.')
}
for (const [b, h, shift, ref, slant] of [[13, 8, 9, 'GM6 p127 Q1 (own numbers)', undefined], [9.5, 6, 2, 'GM6 p126 (own numbers)', undefined], [12, 5, 7, 'GM6 p126 (own numbers)', '7.4 cm']] as const) {
  const labels = { b: `${b} cm`, h: `${h} cm`, ...(slant ? { slant } : {}) }
  const p = slantFig('triangle', b, h, shift, labels)
  const area = half(b * h)
  practice(triangle, 'Find the area of this triangle.', ref, p, number(area, cm2(area)), 'Half of base × vertical height.', boardModel([], [
    { title: 'Base × height', say: `Base ${b} cm, vertical height ${h} cm${slant ? `. The sloping ${slant} isn’t used` : ''}.`, rows: [`A = {1|2} × ${b} × ${h}`, `= {1|2} × ${b * h}`], picture: slantFig('triangle', b, h, shift, labels, { b: 'lit', h: 'lit', slant: 'faint' }) },
    { title: 'Halve it', say: 'A triangle is half the rectangle.', rows: [`! A = ${cm2(area)}`], picture: slantFig('triangle', b, h, shift, labels, { fill: true, slant: 'faint' }) },
  ], 'Find the area', p), slips(area, [[b * h, 'That’s the whole rectangle. A triangle is half of it.'], [b * h / 4, 'Halve once, not twice.']]), AREA)
}

/* ---------- Rung 3: trapeziums ---------- */

{
  const L = { a: '6 cm', b: '10 cm', h: '5 cm' }
  const p = trapFig(6, 10, 5, 1.5, L)
  worked(trapezium, 'Find the area of this trapezium.', 'Area of a trapezium', 'GM6 p126 Example 1 (own numbers)', boardModel([], [
    { title: 'The parallel sides', say: 'a and b are the two parallel sides; h is the vertical height between them.', rows: ['A = {1|2}(a + b)h', '> a = 6, b = 10, h = 5'], picture: trapFig(6, 10, 5, 1.5, L, { a: 'lit', b: 'lit', h: 'lit' }) },
    { title: 'Add, then multiply', say: 'Add the parallel sides, multiply by the height, then halve: the average of the two widths, times the height.', rows: ['A = {1|2} × (6 + 10) × 5', '= {1|2} × 16 × 5', '! A = 40 cm²'], picture: trapFig(6, 10, 5, 1.5, L, { fill: true }, 'Area 40 cm²') },
  ], 'Find the area', p), 'Area of a trapezium = ½(a + b)h: a and b are the parallel sides, h the vertical height.')
}
for (const [a, b, h, shift, ref] of [[7, 12.5, 6, 2, 'GM6 p126 Example 1 (own numbers)'], [9, 15, 4, 3, 'GM6 p126 (own numbers)'], [5, 11, 7, 0, 'GM6 p126 (own numbers)']] as const) {
  const L = { a: `${a} cm`, b: `${b} cm`, h: `${h} cm` }
  const p = trapFig(a, b, h, shift, L)
  const area = half((a + b) * h)
  practice(trapezium, 'Find the area of this trapezium.', ref, p, number(area, cm2(area)), 'Add the parallel sides, times the height, then halve.', boardModel([], [
    { title: 'Add the parallel sides', say: `a + b = ${a} + ${b} = ${a + b}.`, rows: [`A = {1|2} × (${a} + ${b}) × ${h}`, `= {1|2} × ${a + b} × ${h}`], picture: trapFig(a, b, h, shift, L, { a: 'lit', b: 'lit' }) },
    { title: 'Times h, then halve', say: `${a + b} × ${h} = ${(a + b) * h}, and half of that is ${area}.`, rows: [`! A = ${cm2(area)}`], picture: trapFig(a, b, h, shift, L, { fill: true }) },
  ], 'Find the area', p), slips(area, [[(a + b) * h, 'Halve it: the formula is ½(a + b)h.'], [half(a * b * h), 'Add a and b first, don’t multiply them.'], [b * h, 'That’s a rectangle as wide as the bottom. Use both parallel sides.']]), AREA)
}

/* ---------- Rung 4: working backwards ---------- */

{
  const L = { b: '12 cm', h: 'h' }
  const p = slantFig('triangle', 12, 5, 4, L)
  worked(backwards, 'This triangle has a base of 12 cm and an area of 30 cm². Find its vertical height.', 'Working backwards', 'GM6 p126 Example 2 (own numbers)', boardModel([], [
    { title: 'Put in what you know', say: 'Write the formula, and put in the area and the base.', rows: ['A = {1|2} × b × h', '30 = {1|2} × 12 × h', '30 = 6 × h'], picture: slantFig('triangle', 12, 5, 4, L, { b: 'lit', h: 'x' }) },
    { title: 'Solve for h', say: 'Divide both sides by 6.', rows: ['h = 30 ÷ 6', '! h = 5 cm'], picture: slantFig('triangle', 12, 5, 4, { b: '12 cm', h: '5 cm' }, { h: 'found' }) },
  ], 'Find h', p), 'Put the numbers you know into the formula, then solve it like an equation.')
}
{
  const p = slantFig('parallelogram', 9, 8, 2.5, { b: '9 cm', h: 'h' })
  practice(backwards, 'This parallelogram has an area of 72 cm² and a base of 9 cm. Find its vertical height h.', 'GM6 p126 (working backwards)', p, number(8, '8 cm'), 'Area = base × height, so height = area ÷ base.', boardModel([], [
    { title: 'Put in what you know', say: 'Area = base × height.', rows: ['72 = 9 × h'], picture: slantFig('parallelogram', 9, 8, 2.5, { b: '9 cm', h: 'h' }, { b: 'lit', h: 'x' }) },
    { title: 'Divide', say: 'Divide both sides by 9.', rows: ['h = 72 ÷ 9', '! h = 8 cm'], picture: slantFig('parallelogram', 9, 8, 2.5, { b: '9 cm', h: '8 cm' }, { h: 'found' }) },
  ], 'Find h', p), slips(8, [[648, 'Divide the area by the base, don’t multiply.'], [4, 'Not halved: a parallelogram is base × height.'], [16, 'That would be a triangle. A parallelogram has no ½.']]), { label: 'Height (cm)', prefix: 'h =' })
}
{
  const p = slantFig('triangle', 8, 9, 5, { b: '8 cm', h: 'h' })
  practice(backwards, 'This triangle has an area of 36 cm² and a base of 8 cm. Find its vertical height h.', 'GM6 p126 Example 2 (own numbers)', p, number(9, '9 cm'), '½ × 8 = 4, so 36 = 4 × h.', boardModel([], [
    { title: 'Put in what you know', say: 'Half of the base is 4.', rows: ['36 = {1|2} × 8 × h', '36 = 4 × h'], picture: slantFig('triangle', 8, 9, 5, { b: '8 cm', h: 'h' }, { b: 'lit', h: 'x' }) },
    { title: 'Divide', say: 'Divide both sides by 4.', rows: ['h = 36 ÷ 4', '! h = 9 cm'], picture: slantFig('triangle', 8, 9, 5, { b: '8 cm', h: '9 cm' }, { h: 'found' }) },
  ], 'Find h', p), slips(9, [[4.5, 'You’ve forgotten the ½: 36 = ½ × 8 × h, so h = 36 ÷ 4.'], [144, 'Divide, don’t multiply.']]), { label: 'Height (cm)', prefix: 'h =' })
}
{
  // The book's Your Turn Q2 idea: the height isn't given, so find it with Pythagoras first.
  const L = { a: '9 cm', b: '15 cm', h: 'h', slant: '10 cm' }
  const p = trapFig(9, 15, 8, 0, L)
  practice(backwards, 'This trapezium has parallel sides 9 cm and 15 cm, and a slanted side of 10 cm. Find its area.', 'GM6 p127 Q2 (own numbers)', p, number(96, cm2(96)), 'The slant, the height and the 6 cm overhang make a right-angled triangle.', boardModel([], [
    { title: 'Find the height', say: 'The bottom sticks out 15 − 9 = 6 cm past the top. That 6, the height and the 10 cm slant make a right-angled triangle, so use Pythagoras: h² + 6² = 10².', rows: ['h² = 10² − 6²', '= 100 − 36 = 64', 'h = 8'], picture: trapFig(9, 15, 8, 0, L, { slant: 'lit', h: 'x' }) },
    { title: 'Area', say: 'Now use ½(a + b)h with h = 8.', rows: ['A = {1|2} × (9 + 15) × 8', '! A = 96 cm²'], picture: trapFig(9, 15, 8, 0, { ...L, h: '8 cm' }, { fill: true, h: 'found' }) },
  ], 'Find the area', p), slips(96, [[120, 'That uses the slant, 10 cm, as the height. Find the vertical height first.'], [192, 'Halve it: ½(a + b)h.']]), AREA)
}

add('mixed', 'Areas of shapes', 'GM6 consolidation', text(
  'Rectangle: length × width. Parallelogram: base × vertical height.',
  'Triangle: ½ × base × vertical height.',
  'Trapezium: ½(a + b)h, where a and b are the parallel sides.',
  'Always the vertical height, at right angles to the base, never a sloping side.',
  'Area is in square units: cm², m², mm².',
))

export const tutorAreasLesson: TutorMethodLesson = {
  id: 'L206', number: 206, title: 'Areas of shapes', level: 'GCSE Foundation',
  goal: 'Find the areas of rectangles, parallelograms, triangles and trapeziums using the vertical height, and work backwards from an area to a missing length.',
  labels: { [rectPara]: 'Rectangles and parallelograms', [triangle]: 'Triangles', [trapezium]: 'Trapeziums', [backwards]: 'Working backwards', mixed: 'Review' },
  states: finish(),
}
