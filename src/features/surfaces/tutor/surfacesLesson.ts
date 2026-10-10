import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigurePoint } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { dp, fig, screens, show, slips } from '../../geometry/tutor/figureLesson'
import { cone, cuboid, cylinder, prism, sphere, squarePyramid } from '../../geometry/tutor/solidPictures'

/*
 * Geometry lesson 15: Surface area. From GM15 in Sunny's revision book (p146–148), with our own numbers. Four rungs:
 * flat faces (cuboids, cubes and a triangular prism, every face added up); cylinders, 2πrh for the curved side and two
 * circles; cones (πrl + πr²) and spheres (4πr²), including working back from a sphere's surface area to its radius, as
 * the book's Example 4 does; and square-based pyramids, a square and four triangles (Example 3). Built like lessons 1
 * to 14: the first rung opens on the measuring board's cuboid, whose surface area grows as you drag it longer.
 *
 * Every rounded answer is worked out here from Math.PI and rounded to 1 decimal place, and the verify script works
 * each one out again.
 *
 * Hidden on live like lessons 1 to 14: only the unlisted Geometry shelf (src/features/geometry/geometryLessons.ts)
 * opens it.
 */

const lesson = author(215)
const { add, finish } = lesson
const { explore, worked, practice } = screens(lesson)
const flat = 'geometry-surface-cuboid'
const cylinders = 'geometry-surface-cylinder'
const curved = 'geometry-surface-cone-sphere'
const pyramids = 'geometry-surface-pyramid'

const A_BOX = { label: 'Surface area (cm²)', prefix: 'A =' }
const r1 = (n: number) => dp(n, 1)
const f = (n: number) => n.toFixed(3)
/** Room either side for the labels set beside a solid. */
const pic = (items: FigureItem[], spoken: string, caption?: string): AngleFrame => fig(items, spoken, caption, 30)

/* ---------- Rung 1: flat faces ---------- */

explore(flat, 'Drag the cuboid longer. Watch its surface area.', 'GM15 p146 Surface area (play)', { mode: 'prism' })

/** A cuboid's working: its three different faces, then twice their total. */
function cuboidSteps(w: number, h: number, l: number) {
  const front = w * h, top = w * l, side = h * l, A = 2 * (front + top + side)
  const draw = (lit?: 'face', caption?: string) => pic(cuboid(w, h, l, { w: { label: `${w} cm` }, h: { label: `${h} cm` }, l: { label: `${l} cm` } }, { lit }), `A cuboid ${w} cm wide, ${h} cm tall and ${l} cm long.`, caption)
  return { A, draw, moves: [
    { title: 'Three different faces', say: 'A cuboid has six faces in three matching pairs: front and back, top and bottom, and the two ends.', rows: [`Front = ${w} × ${h} = ${front}`, `Top = ${w} × ${l} = ${top}`, `Side = ${h} × ${l} = ${side}`], picture: draw('face') },
    { title: 'Double the total', say: 'Each face has a twin on the other side, so add the three and double.', rows: [`A = 2 × (${front} + ${top} + ${side})`, `! A = ${A} cm²`], picture: draw(undefined, `A = ${A} cm²`) },
  ] }
}
{
  const { draw, moves } = cuboidSteps(5, 3, 4)
  worked(flat, 'Find the total surface area of this cuboid.', 'Surface area', 'GM15 Your Turn Q1 (own numbers)', boardModel([], moves, 'Find A', draw()),
    'Surface area is the total area of every face, in square units. It’s the paper you’d need to wrap the shape exactly.')
}
for (const [w, h, l] of [[6, 4, 2], [5, 5, 5]] as const) {
  const { A, draw, moves } = cuboidSteps(w, h, l)
  const p = draw()
  practice(flat, w === h && h === l ? 'Find the total surface area of this cube.' : 'Find the total surface area of this cuboid.', 'GM15 Your Turn Q1 (own numbers)', p, number(A, `${A} cm²`),
    w === h && h === l ? 'Six faces, every one a 5 by 5 square.' : 'Three different faces, each twice.', boardModel([], moves, 'Find A', p),
    slips(A, [[A / 2, 'That’s only three faces. Each one has a twin: double it.'], [w * h * l, 'That’s the volume. Surface area adds the faces.']]), A_BOX)
}
{
  // A triangular prism: a right-angled triangle 4 by 3 (its long side 5) carried back 10.
  const face: FigurePoint[] = [[0, 0], [4, 0], [0, 3]]
  const draw = (lit?: 'face' | 'length', caption?: string) => pic([...prism(face, 10, { lit, labels: { length: { label: '10 cm' } } }), { kind: 'measure', from: [0, 0], to: [4, 0], label: '4 cm', offset: 10 },
    { kind: 'measure', from: [0, 0], to: [0, 3], label: '3 cm', offset: -10, side: -1 }, { kind: 'text', at: [2, 1.5], text: '5 cm', dx: 12, dy: -10 }, { kind: 'right', at: [0, 0], a: [4, 0], b: [0, 3] }],
  'A triangular prism. The triangle is right-angled with sides 3 cm, 4 cm and 5 cm; the prism is 10 cm long.', caption)
  const p = draw()
  practice(flat, 'Find the total surface area of this triangular prism.', 'GM15 Your Turn Q4 (own numbers)', p, number(132, '132 cm²'), 'Two triangles, and three rectangles, one for each side of the triangle.', boardModel([], [
    { title: 'The two triangles', say: 'Each end is a triangle: ½ × 4 × 3 = 6. There are two.', rows: ['Ends = 2 × {1|2} × 4 × 3 = 12'], picture: draw('face') },
    { title: 'The three rectangles', say: 'Each side of the triangle runs back 10 cm as a rectangle: 3, 4 and 5 by 10.', rows: ['Sides = (3 + 4 + 5) × 10 = 120'], picture: draw('length') },
    { title: 'Add them', say: 'Every face, added.', rows: ['A = 12 + 120', '! A = 132 cm²'], picture: draw(undefined, 'A = 132 cm²') },
  ], 'Find A', p), slips(132, [[126, 'There are two triangles, one at each end.'], [60, 'That’s the volume. Add the areas of the faces.'], [82, 'The rectangles are 10 cm long: (3 + 4 + 5) × 10.']]), A_BOX)
}

/* ---------- Rung 2: cylinders ---------- */

function cylinderSteps(r: number, h: number, given: 'r' | 'd' = 'r') {
  const side = 2 * Math.PI * r * h, ends = 2 * Math.PI * r * r, A = r1(side + ends)
  const draw = (lit?: 'top' | 'side', caption?: string) => pic(cylinder(r, h, { r: { label: given === 'r' ? `${r} cm` : `r = ${r}`, tone: lit === 'top' ? 'lit' : 'given' }, h: { label: `${h} cm`, tone: lit === 'side' ? 'lit' : 'given' } }, lit),
    `A cylinder with radius ${r} cm and height ${h} cm.`, caption)
  return { A, draw, moves: [
    { title: 'The curved side', say: `Unrolled, the side is a rectangle: the circumference 2πr across, ${h} high.`, rows: [`2 × π × ${r} × ${h} = ${f(side)}…`], picture: draw('side') },
    { title: 'The two circles', say: 'A circle at each end: 2 × πr².', rows: [`2 × π × ${r}² = ${f(ends)}…`], picture: draw('top') },
    { title: 'Add them', say: 'The side and both ends. Round at the end.', rows: [`A = ${f(side)}… + ${f(ends)}…`, `! A = ${show(A, 1)} cm²`], picture: draw(undefined, `A = ${show(A, 1)} cm²`) },
  ] }
}
{
  const { draw, moves } = cylinderSteps(3, 10)
  worked(cylinders, 'Find the surface area of this cylinder, to 1 decimal place.', 'Surface area of a cylinder', 'GM15 p146 Example 2 (own numbers)', boardModel([], moves, 'Find A', draw()),
    'Surface area of a cylinder = 2πrh + 2πr²: the curved side, unrolled into a rectangle, and a circle at each end.')
}
for (const [r, h, given] of [[5, 8, 'r'], [2, 9, 'r'], [5, 4, 'd']] as const) {
  const { A, draw, moves } = cylinderSteps(r, h, given)
  const p = given === 'd' ? pic([...cylinder(r, h, { h: { label: `${h} cm` } }), { kind: 'measure', from: [-r, h], to: [r, h], label: `${2 * r} cm`, offset: -22, side: -1 }], `A cylinder with diameter ${2 * r} cm and height ${h} cm.`) : draw()
  const all = given === 'd' ? [{ title: 'Halve the diameter', say: `The formula needs the radius: half of ${2 * r} is ${r}.`, rows: [`r = ${2 * r} ÷ 2 = ${r} cm`], picture: draw('top') }, ...moves] : moves
  practice(cylinders, 'Find the surface area of this cylinder, to 1 decimal place.', 'GM15 p146 (own numbers)', p, number(A, `${show(A, 1)} cm²`), given === 'd' ? 'Halve the diameter, then 2πrh + 2πr².' : '2πrh for the side, 2πr² for the ends.',
    boardModel([], all, 'Find A', p), slips(A, [[r1(2 * Math.PI * r * h), 'That’s only the curved side. Add the two circles.'], [r1(2 * Math.PI * r * h + Math.PI * r * r), 'There are two circles, top and bottom.'], [r1(Math.PI * r * r * h), 'That’s the volume.']]), A_BOX)
}

/* ---------- Rung 3: cones and spheres ---------- */

function coneSteps(r: number, l: number) {
  const curve = Math.PI * r * l, base = Math.PI * r * r, A = r1(curve + base)
  const draw = (lit?: 'base' | 'slant', caption?: string) => pic(cone(r, Math.sqrt(l * l - r * r), { r: { label: `${r} cm` }, slant: { label: `${l} cm`, tone: lit === 'slant' ? 'lit' : 'given' } }, lit), `A cone with base radius ${r} cm and slant height ${l} cm.`, caption)
  return { A, draw, moves: [
    { title: 'The curved surface', say: `πrl, with l the slant height, ${l}.`, rows: [`π × ${r} × ${l} = ${f(curve)}…`], picture: draw('slant') },
    { title: 'The base', say: 'The circle underneath: πr².', rows: [`π × ${r}² = ${f(base)}…`], picture: draw('base') },
    { title: 'Add them', say: 'Curved surface and base. Round at the end.', rows: [`A = ${f(curve)}… + ${f(base)}…`, `! A = ${show(A, 1)} cm²`], picture: draw(undefined, `A = ${show(A, 1)} cm²`) },
  ] }
}
{
  const { draw, moves } = coneSteps(4, 9)
  worked(curved, 'Find the total surface area of this cone, to 1 decimal place.', 'Cones and spheres', 'GM15 p146 Example 1 (own numbers)', boardModel([], moves, 'Find A', draw()),
    'Cone: πrl + πr², where l is the slanted height. Sphere: 4πr². The exam gives you these two.')
}
{
  const { A, draw, moves } = coneSteps(3, 8)
  const p = draw()
  practice(curved, 'Find the total surface area of this cone, to 1 decimal place.', 'GM15 p146 (own numbers)', p, number(A, `${show(A, 1)} cm²`), 'πrl + πr², with l = 8.', boardModel([], moves, 'Find A', p),
    slips(A, [[r1(Math.PI * 24), 'That’s only the curved surface. Add the circle underneath.'], [r1(Math.PI * 3 * 8 * 8 + Math.PI * 9), 'πrl is π × 3 × 8. Don’t square the slant.']]), A_BOX)
}
for (const r of [5, 2.5]) {
  const A = r1(4 * Math.PI * r * r)
  const draw = (lit = false, caption?: string) => pic(sphere(r, { label: `${r} cm` }, lit), `A sphere with radius ${r} cm.`, caption)
  const p = draw()
  practice(curved, 'Find the surface area of this sphere, to 1 decimal place.', 'GM15 p147 (own numbers)', p, number(A, `${show(A, 1)} cm²`), '4πr².', boardModel([], [
    { title: 'Square the radius', say: `${r} squared.`, rows: [`r² = ${r}² = ${r * r}`], picture: p },
    { title: 'Times 4π', say: 'Then times 4 and times π.', rows: [`A = 4 × π × ${r * r}`, `! A = ${show(A, 1)} cm²`], picture: draw(true, `A = ${show(A, 1)} cm²`) },
  ], 'Find A', p), slips(A, [[r1(Math.PI * r * r), 'That’s one circle. A sphere’s surface is four of them: 4πr².'], [r1(4 / 3 * Math.PI * r ** 3), 'That’s the volume.']]), A_BOX)
}
{
  // Working back from a sphere's surface area to its radius (the book's Example 4).
  const r = Math.sqrt(400 / (4 * Math.PI)), R = r1(r)
  const items: FigureItem[] = sphere(2, { label: 'r', tone: 'x' })
  const p = pic(items, 'A sphere with surface area 400 square centimetres and radius r.')
  practice(curved, 'A sphere has surface area 400 cm². Find its radius, to 1 decimal place.', 'GM15 p147 Example 4 (own numbers)', p, number(R, `${show(R, 1)} cm`), 'Set 4πr² = 400. Divide by 4π, then square root.', boardModel([], [
    { title: 'Set up the formula', say: 'The surface area is 4πr², and it’s 400.', rows: ['4πr² = 400'], picture: p },
    { title: 'Divide by 4π', say: 'Undo the times 4π.', rows: [`r² = 400 ÷ 4π = ${f(r * r)}…`], picture: p },
    { title: 'Square root', say: 'Undo the square. Round at the end.', rows: [`r = √${f(r * r)}…`, `! r = ${show(R, 1)} cm`], picture: pic(sphere(2, { label: `r = ${show(R, 1)}`, tone: 'found' }), 'A sphere with surface area 400 square centimetres.', `r = ${show(R, 1)} cm`) },
  ], 'Find r', p), slips(R, [[r1(400 / (4 * Math.PI)), 'That’s r². Square root it.'], [r1(Math.sqrt(400 / Math.PI)), 'Divide by 4π, not just π.']]), { label: 'Radius (cm)', prefix: 'r =' })
}

/* ---------- Rung 4: square-based pyramids ---------- */

function pyramidSteps(b: number, s: number) {
  const tri = b * s / 2, A = 4 * tri + b * b
  const draw = (lit?: 'base' | 'face', caption?: string) => pic(squarePyramid(b, 1.6 * b, { b: { label: `${b} cm` }, slant: { label: `${s} cm`, tone: lit === 'face' ? 'lit' : 'given' } }, lit), `A square-based pyramid with base ${b} cm; each triangular face has height ${s} cm.`, caption)
  return { A, draw, moves: [
    { title: 'One triangle', say: `Each triangular face has base ${b} and height ${s}: ½ × ${b} × ${s}. There are four, all the same.`, rows: [`{1|2} × ${b} × ${s} = ${tri}`, `4 × ${tri} = ${4 * tri}`], picture: draw('face') },
    { title: 'Add the base', say: `The square base: ${b} × ${b}.`, rows: [`A = ${4 * tri} + ${b * b}`, `! A = ${A} cm²`], picture: draw('base', `A = ${A} cm²`) },
  ] }
}
{
  const { draw, moves } = pyramidSteps(6, 5)
  worked(pyramids, 'Find the surface area of this square-based pyramid.', 'Square-based pyramids', 'GM15 p147 Example 3 (own numbers)', boardModel([], moves, 'Find A', draw()),
    'A square-based pyramid has five faces: four matching triangles and the square base. Use the height of a triangle, not of the pyramid.')
}
for (const [b, s] of [[10, 12], [8, 5]] as const) {
  const { A, draw, moves } = pyramidSteps(b, s)
  const p = draw()
  practice(pyramids, 'Find the surface area of this square-based pyramid.', 'GM15 Your Turn Q5 (own numbers)', p, number(A, `${A} cm²`), 'Four triangles, ½ × base × height each, and the square base.', boardModel([], moves, 'Find A', p),
    slips(A, [[4 * b * s / 2, 'Add the square base underneath.'], [4 * b * s + b * b, 'Each triangle is half of base × height.'], [b * s / 2 + b * b, 'There are four triangles.']]), A_BOX)
}

add('mixed', 'Surface area', 'GM15 consolidation', text(
  'Surface area: the total area of every face.',
  'Cuboid: three pairs of faces. Prism: two ends and a rectangle for each side.',
  'Cylinder: 2πrh + 2πr². Cone: πrl + πr². Sphere: 4πr².',
  'Square-based pyramid: four triangles and the square.',
))

export const tutorSurfacesLesson: TutorMethodLesson = {
  id: 'L215', number: 215, title: 'Surface area', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Find the surface area of prisms, cylinders, cones, spheres and pyramids.',
  labels: { [flat]: 'Flat faces', [cylinders]: 'Cylinders', [curved]: 'Cones and spheres', [pyramids]: 'Pyramids', mixed: 'Review' },
  states: finish(),
}
