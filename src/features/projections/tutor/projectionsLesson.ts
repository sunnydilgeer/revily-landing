import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigurePoint } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { fig, screens, slips } from '../../geometry/tutor/figureLesson'
import { figureExtent } from '../../written-methods/tutor/FigurePictures'
import { DEPTH, cone, cuboid, cylinder, prism, squarePyramid } from '../../geometry/tutor/solidPictures'

/*
 * Geometry lesson 16: Plans and elevations. From GM16 in Sunny's revision book (p149–150), with our own shapes. Three
 * rungs: what the plan (from above), front elevation and side elevation are (the book's square-based pyramid); drawing
 * all three for a shape, measured on squared paper (Example 1 and Your Turn Q1, Q3 to Q5); and working back from the
 * views to the 3D shape (Example 2 and Your Turn Q2). The book builds its shapes from centimetre cubes; here they are
 * prisms, cylinders, cones and pyramids drawn the way lessons 13 to 15 draw them, so each view is a clean outline.
 * Built like lessons 1 to 15, with no measuring board.
 *
 * Hidden on live like lessons 1 to 15: only the unlisted Geometry shelf (src/features/geometry/geometryLessons.ts)
 * opens it.
 */

const lesson = author(216)
const { add, finish } = lesson
const { worked, practice } = screens(lesson)
const views = 'geometry-views'
const drawing = 'geometry-plan-elevations'
const backwards = 'geometry-views-counting'

const solid = (items: FigureItem[], spoken: string, caption?: string): AngleFrame => fig(items, spoken, caption, 30)

/* ---------- Views ---------- */

type View = { name: string; items: FigureItem[]; w: number; h: number; lit?: boolean }
const rect = (w: number, h: number, lines: [FigurePoint, FigurePoint][] = []): FigureItem[] => [{ kind: 'shape', points: [[0, 0], [w, 0], [w, h], [0, h]] }, ...lines.map(([from, to]) => ({ kind: 'line' as const, from, to }))]
const triangle = (w: number, h: number): FigureItem[] => [{ kind: 'shape', points: [[0, 0], [w, 0], [w / 2, h]] }]
const disc = (r: number, dot = false): FigureItem[] => [{ kind: 'circle', centre: [r, r], r }, ...(dot ? [{ kind: 'point' as const, at: [r, r] as FigurePoint }] : [])]
const shiftItem = (item: FigureItem, dx: number): FigureItem => {
  const m = ([x, y]: FigurePoint): FigurePoint => [x + dx, y]
  if (item.kind === 'shape') return { ...item, points: item.points.map(m) }
  if (item.kind === 'line' || item.kind === 'measure') return { ...item, from: m(item.from), to: m(item.to) }
  if (item.kind === 'circle') return { ...item, centre: m(item.centre) }
  if (item.kind === 'point' || item.kind === 'text') return { ...item, at: m(item.at) }
  return item
}
/** Views side by side on squared paper, each named underneath; a `lit` view glows purple, a hidden one is left as a box with a ?. */
function viewsFig(list: (View | null)[], spoken: string, caption?: string, height = 3): AngleFrame {
  const gap = 2, width = list.reduce((a, v) => a + (v?.w ?? 2) + gap, -gap)
  const items: FigureItem[] = [{ kind: 'grid', from: [-0.5, -1], to: [width + 0.5, height + 0.5] }]
  let x = 0
  for (const v of list) {
    if (v) {
      for (const item of v.items) items.push(shiftItem(item.kind === 'shape' && v.lit ? { ...item, lit: true } : item, x))
      items.push({ kind: 'text', at: [x + v.w / 2, -0.55], text: v.name, name: true, dx: -v.name.length * 3.5 })
    } else items.push({ kind: 'text', at: [x + 1, height / 2], text: '?', tone: 'x' })
    x += (v?.w ?? 2) + gap
  }
  return fig(items, spoken, caption)
}

/** Where each view is looked at from, as an arrow onto a solid `w` wide, `h` tall and `l` deep. */
type Look = 'plan' | 'front' | 'side'
function lookArrow(look: Look, w: number, h: number, l: number): FigureItem {
  const mid = (d: number): FigurePoint => [w / 2 + DEPTH[0] * d, DEPTH[1] * d]
  if (look === 'plan') { const [x, y] = mid(l / 2); return { kind: 'line', from: [x, y + h + 1.3], to: [x, y + h + 0.25], style: 'lit', arrow: true } }
  if (look === 'front') return { kind: 'line', from: [w / 2 - DEPTH[0] * 2.2, h / 2 - DEPTH[1] * 2.2], to: [w / 2 - DEPTH[0] * 0.2, h / 2 - DEPTH[1] * 0.2], style: 'lit', arrow: true }
  const [x, y] = mid(l / 2)
  return { kind: 'line', from: [w + DEPTH[0] * l / 2 + 1.4, y + h / 2], to: [w + DEPTH[0] * l / 2 + 0.25, y + h / 2], style: 'lit', arrow: true }
}
/**
 * One view at a time (Sunny, 17 Oct: the three small views were too small to read): the 3D shape on the left, with an
 * arrow showing where it's looked at from, and the view being drawn beside it, both big. With no view, a ? holds its place.
 */
function besideFig(shape: FigureItem[], size: [number, number, number], look: Look | null, view: View | null, spoken: string, caption?: string): AngleFrame {
  const ext = figureExtent(shape), right = Math.max(...ext.map(p => p[0])), top = Math.max(...ext.map(p => p[1]))
  const x = right + 1.2, height = Math.max(top, view?.h ?? 0)
  // Room on the left for a height label (the cuboid's 2 cm).
  const items: FigureItem[] = [{ kind: 'grid', from: [-1.4, -1], to: [x + (view?.w ?? 2), height] }, ...shape]
  if (look) items.push(lookArrow(look, ...size))
  if (view) {
    for (const item of view.items) items.push(shiftItem(item.kind === 'shape' ? { ...item, lit: true } : item, x))
    items.push({ kind: 'text', at: [x + view.w / 2, -0.55], text: view.name, name: true, dx: -view.name.length * 3.5 })
  } else items.push({ kind: 'text', at: [x + 1, height / 2], text: '?', tone: 'x' })
  return fig(items, spoken, caption)
}

/* ---------- Rung 1: plan, front and side ---------- */

{
  const L: FigurePoint[] = [[0, 0], [3, 0], [3, 1], [1, 1], [1, 2], [0, 2]]
  const plan: View = { name: 'Plan', items: rect(3, 2, [[[1, 0], [1, 2]]]), w: 3, h: 2 }
  const front: View = { name: 'Front', items: [{ kind: 'shape', points: L }], w: 3, h: 2 }
  const side: View = { name: 'Side', items: rect(2, 2, [[[0, 1], [2, 1]]]), w: 2, h: 2 }
  const prismItems = prism(L, 2)
  const step = (look: Look | null, view: View | null, caption?: string) => besideFig(prismItems, [3, 2, 2], look, view, `The L-shaped prism${view ? `, and its ${view.name.toLowerCase()} view` : ''}.`, caption)
  worked(views, 'Draw the plan, front elevation and side elevation of this L-shaped prism.', 'Plan, front and side', 'GM16 p149 Plans and elevations (own shape)', boardModel([], [
    { title: 'Look from the front', say: 'Stand in front and look straight at it: you see the L, 3 wide and 2 tall.', rows: ['>0 Front elevation: the L shape, 3 wide and 2 tall'], picture: step('front', front) },
    { title: 'Look down from above', say: 'Look straight down from above: a 3 by 2 rectangle. The top steps down 1 square in from the left, so a line shows where it steps.', rows: ['>0 Plan: a 3 by 2 rectangle', '>0 The line shows where the top steps down'], picture: step('plan', plan) },
    { title: 'Look from the side', say: 'Look from the right side: a 2 by 2 square, with a line where the step is.', rows: ['>0 Side elevation: a 2 by 2 square, line at the step', '! Plan, front and side drawn'], picture: step('side', side, 'Three views of one shape') },
  ], 'Views', step(null, null)), 'A plan is the view from directly above. A front elevation is the view from the front, a side elevation from the side. Each one is flat: you don’t draw any depth.')
}
{
  const p = solid(cylinder(1.3, 2.6), 'A cylinder standing upright.')
  practice(views, 'What is the plan of this cylinder?', 'GM16 p149 (own shape)', p,
    choose('A circle', ['A rectangle', 'That’s the front or side elevation. From above you see the round top.'], ['A circle with a dot in the middle', 'That’s a cone’s plan, its point seen from above. A cylinder’s top is flat.'], ['An oval', 'The top only looks like an oval because the picture is drawn at an angle. Looking straight down on it, you see its true shape: a circle.']),
    'Imagine looking straight down on its top.', boardModel([], [
      { title: 'Look down from above', say: 'Looking straight down on a cylinder, you see its round, flat top at its true shape: a circle, not an oval.', rows: ['! Plan: a circle'], picture: viewsFig([{ name: 'Plan', items: disc(1.5), w: 3, h: 3, lit: true }, { name: 'Front', items: rect(3, 3), w: 3, h: 3 }], 'The plan and front elevation of the cylinder.', 'Plan: a circle') },
    ], 'View', p))
}
{
  const p = solid(squarePyramid(3, 3.2), 'A square-based pyramid.')
  practice(views, 'What is the front elevation of this square-based pyramid?', 'GM16 p149 Plans and elevations of a 3D shape', p,
    choose('A triangle', ['A square with its diagonals', 'That’s the plan, from above.'], ['A square', 'From the front you see the sloping sides meet at the top.'], ['A rectangle', 'The sides slope in to a point.']),
    'Stand in front of it.', boardModel([], [
      { title: 'From the front', say: 'From the front you see one triangular face, from the base up to the point.', rows: ['! Front elevation: a triangle'], picture: viewsFig([{ name: 'Plan', items: rect(3, 3, [[[0, 0], [3, 3]], [[3, 0], [0, 3]]]), w: 3, h: 3 }, { name: 'Front', items: triangle(3, 3), w: 3, h: 3, lit: true }, { name: 'Side', items: triangle(3, 3), w: 3, h: 3 }], 'The plan, front and side elevations of the pyramid.', 'Front: a triangle') },
    ], 'View', p))
}

/* ---------- Rung 2: drawing them to size ---------- */

{
  const cuboidItems = cuboid(4, 2, 3, { w: { label: '4 cm' }, h: { label: '2 cm' }, l: { label: '3 cm' } })
  const plan: View = { name: 'Plan', items: rect(4, 3), w: 4, h: 3 }, front: View = { name: 'Front', items: rect(4, 2), w: 4, h: 2 }, side: View = { name: 'Side', items: rect(3, 2), w: 3, h: 2 }
  const step = (look: Look | null, view: View | null, caption?: string) => besideFig(cuboidItems, [4, 2, 3], look, view, `A cuboid 4 cm wide, 2 cm tall and 3 cm deep${view ? `, and its ${view.name.toLowerCase()} view on centimetre squares` : ''}.`, caption)
  worked(drawing, 'Draw the plan and elevations of this cuboid on centimetre squares.', 'Drawing them to size', 'GM16 Your Turn Q1 (own shape)', boardModel([], [
    { title: 'Front: width by height', say: 'From the front you see the width and the height: 4 by 2.', rows: ['>0 Front: 4 × 2'], picture: step('front', front) },
    { title: 'Plan: width by depth', say: 'From above you see the width and how deep it goes: 4 by 3.', rows: ['>0 Plan: 4 × 3'], picture: step('plan', plan) },
    { title: 'Side: depth by height', say: 'From the side you see the depth and the height: 3 by 2.', rows: ['! Front 4 × 2, plan 4 × 3, side 3 × 2'], picture: step('side', side, 'Each view uses two of the three lengths') },
  ], 'Views', step(null, null)), 'Draw each view to size on squared paper. The front uses width and height, the plan width and depth, the side depth and height.')
}
{
  const p = solid(cuboid(5, 2, 3, { w: { label: '5 cm' }, h: { label: '2 cm' }, l: { label: '3 cm' } }), 'A cuboid 5 cm wide, 2 cm tall and 3 cm deep.')
  practice(drawing, 'What is the area of the plan of this cuboid?', 'GM16 Your Turn Q1 (own shape)', p, number(15, '15 cm²'), 'From above you see the width and the depth.', boardModel([], [
    { title: 'Width by depth', say: 'The plan is a rectangle 5 wide and 3 deep.', rows: ['A = 5 × 3', '! A = 15 cm²'], picture: viewsFig([{ name: 'Plan', items: rect(5, 3), w: 5, h: 3, lit: true }], 'The plan of the cuboid: a 5 by 3 rectangle.', 'Plan: 5 by 3') },
  ], 'Area', p), slips(15, [[10, 'That’s the front, 5 by 2. The plan is from above: 5 by 3.'], [6, 'That’s the side, 3 by 2.'], [30, 'That’s the volume. The plan is flat: 5 × 3.']]), { label: 'Area (cm²)', prefix: 'A =' })
}
{
  const face: FigurePoint[] = [[0, 0], [4, 0], [2, 3]]
  const p = solid([...prism(face, 5), { kind: 'measure', from: [0, 0], to: [4, 0], label: '4 cm', offset: 10 }, { kind: 'line', from: [2, 3], to: [2, 0], style: 'dashed' }, { kind: 'text', at: [2, 0.6], text: '3 cm', dx: 4 }], 'A triangular prism; its triangle is 4 cm across and 3 cm tall.')
  practice(drawing, 'The front elevation of this prism is its triangle. What is its area?', 'GM16 p149 (own shape)', p, number(6, '6 cm²'), 'Half of base times height.', boardModel([], [
    { title: 'The triangle', say: 'From the front you see the triangle: 4 across and 3 tall. Half of 4 × 3.', rows: ['A = {1|2} × 4 × 3', '! A = 6 cm²'], picture: viewsFig([{ name: 'Front', items: triangle(4, 3), w: 4, h: 3, lit: true }], 'The front elevation: a triangle 4 across and 3 tall.', 'Front: half of 4 × 3') },
  ], 'Area', p), slips(6, [[12, 'A triangle is half of base × height.'], [20, 'That’s the plan, 4 by 5. The front is the triangle.']]), { label: 'Area (cm²)', prefix: 'A =' })
}

/* ---------- Rung 3: from the views back to the shape ---------- */

{
  const v = (lit: 'plan' | 'front' | null, caption?: string) => viewsFig([{ name: 'Plan', items: disc(1.5, true), w: 3, h: 3, lit: lit === 'plan' }, { name: 'Front', items: triangle(3, 3), w: 3, h: 3, lit: lit === 'front' }], 'A plan, a circle with a dot in the middle, and a front elevation that is a triangle.', caption)
  worked(backwards, 'These are the plan and front elevation of a 3D shape. What is it?', 'Back to the shape', 'GM16 p149 Example 2 (own shape)', boardModel([], [
    { title: 'Read the plan', say: 'From above it’s a circle, with a dot in the middle: a round base with a point above its centre.', rows: ['>0 Plan: circle and centre point'], picture: v('plan') },
    { title: 'Read the front elevation', say: 'From the front it’s a triangle: it comes up to a point.', rows: ['! A cone'], picture: v('front', 'Round base, rising to a point') },
  ], 'Shape', v(null)), 'To go back to the 3D shape, read each view in turn: the plan gives the base, the elevations give the height and how the sides go up.')
}
for (const [plan, front, right, wrong, spoken] of [
  [{ name: 'Plan', items: rect(4, 3, [[[2, 0], [2, 3]]]), w: 4, h: 3 }, { name: 'Front', items: triangle(4, 3), w: 4, h: 3 }, 'Triangular prism', [['Square-based pyramid', 'A pyramid’s plan has lines going to the middle. This plan is a rectangle with one line along it: a ridge.'], ['Cone', 'A cone’s plan is a circle.'], ['Cuboid', 'A cuboid’s front is a rectangle, not a triangle.']], 'A plan that is a rectangle with a line along the middle, and a triangular front elevation.'],
  [{ name: 'Plan', items: rect(3, 3, [[[0, 0], [3, 3]], [[3, 0], [0, 3]]]), w: 3, h: 3 }, { name: 'Front', items: triangle(3, 3), w: 3, h: 3 }, 'Square-based pyramid', [['Triangular prism', 'A prism’s plan is a rectangle with one ridge line. These lines meet in the middle: a point.'], ['Cone', 'The plan is a square, not a circle.'], ['Cube', 'A cube’s front is a square.']], 'A plan that is a square with both diagonals, and a triangular front elevation.'],
  [{ name: 'Plan', items: disc(1.5), w: 3, h: 3 }, { name: 'Front', items: rect(3, 3), w: 3, h: 3 }, 'Cylinder', [['Cone', 'A cone’s front is a triangle, and its plan has a dot for the point.'], ['Sphere', 'A sphere looks like a circle from the front too.'], ['Cube', 'A cube’s plan is a square.']], 'A plan that is a circle and a front elevation that is a rectangle.'],
] as [View, View, string, [string, string][], string][]) {
  const p = viewsFig([plan, front], spoken)
  const shape = right === 'Triangular prism' ? prism([[0, 0], [3, 0], [1.5, 2]], 4) : right === 'Square-based pyramid' ? squarePyramid(3, 3) : cylinder(1.3, 2.6)
  practice(backwards, 'This is the plan and front elevation of a 3D shape. What is it?', 'GM16 Your Turn Q2 (own shape)', p, choose(right, ...wrong), 'The plan gives the base; the front shows how it rises.', boardModel([], [
    { title: 'Put them together', say: right === 'Triangular prism' ? 'A triangle from the front, the same all the way back, with a ridge along the top.' : right === 'Square-based pyramid' ? 'A square base, with sides rising to a point above the middle.' : 'A round base, going straight up to a flat round top.', rows: [`! ${right}`], picture: solid(shape, `A ${right.toLowerCase()}.`, right) },
  ], 'Shape', p))
}

add('mixed', 'Plans and elevations', 'GM16 consolidation', text(
  'Plan: the view from above. Front and side elevations: from the front and the side.',
  'Each view is flat: no depth drawn.',
  'Front: width × height. Plan: width × depth. Side: depth × height.',
  'Back to the shape: the plan gives the base, the elevations show how it rises.',
))

export const tutorProjectionsLesson: TutorMethodLesson = {
  id: 'L216', number: 216, title: 'Plans and elevations', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Draw the plan, front elevation and side elevation of a 3D shape, and work back from them to the shape.',
  labels: { [views]: 'Plan, front and side', [drawing]: 'Drawing to size', [backwards]: 'Back to the shape', mixed: 'Review' },
  states: finish(),
}
