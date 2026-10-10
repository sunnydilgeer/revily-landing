import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigurePoint } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { dp, fig, screens, show, slips } from '../../geometry/tutor/figureLesson'
import { capsule, cone, cuboid, cylinder, prism, sphere, squarePyramid } from '../../geometry/tutor/solidPictures'

/*
 * Geometry lesson 14: Volume of 3D shapes. From GM14 in Sunny's revision book (p143–145), with our own numbers. Four
 * rungs: a prism is its cross-section's area times its length (cuboids, triangular and trapezium prisms); a cylinder
 * is a prism with a circle for its cross-section, πr² × h; pyramids and cones are a third of the prism or cylinder
 * around them, with the book's Your Turn Q4 worked backwards to x; and spheres, hemispheres and a cylinder with a
 * hemisphere on top (the book's composite example and Your Turn Q5). Built like lessons 1 to 13: the first rung opens on
 * the measuring board, where you drag a cuboid longer and its volume is always the end face times the length.
 *
 * Every rounded answer is worked out here from Math.PI and rounded to 1 decimal place, and the verify script works
 * each one out again.
 *
 * Hidden on live like lessons 1 to 13: only the unlisted Geometry shelf (src/features/geometry/geometryLessons.ts)
 * opens it.
 */

const lesson = author(214)
const { add, finish } = lesson
const { explore, worked, practice } = screens(lesson)
const prisms = 'geometry-volume-prism'
const cylinders = 'geometry-volume-cylinder'
const thirds = 'geometry-volume-pyramid-cone'
const spheres = 'geometry-volume-sphere'

const V_BOX = { label: 'Volume (cm³)', prefix: 'V =' }
const r1 = (n: number) => dp(n, 1)
const f = (n: number) => n.toFixed(3)
/** Room either side for the labels set beside a solid. */
const pic = (items: FigureItem[], spoken: string, caption?: string): AngleFrame => fig(items, spoken, caption, 30)

/* ---------- Rung 1: prisms ---------- */

explore(prisms, 'Drag the cuboid longer. Watch its volume.', 'GM14 p143 Volume of prisms (play)', { mode: 'prism' })

/** A triangular prism: base b, height h (the triangle's apex above its left end), length l. */
const triangle = (b: number, h: number): FigurePoint[] => [[0, 0], [b, 0], [b * 0.3, h]]
const trapezium = (a: number, b: number, h: number): FigurePoint[] => [[0, 0], [b, 0], [(b + a) / 2, h], [(b - a) / 2, h]]
function triPrism(b: number, h: number, l: number, lit?: 'face' | 'length', caption?: string) {
  const face = triangle(b, h)
  const items = [...prism(face, l, { lit, labels: { length: { label: `${l} cm`, tone: lit === 'length' ? 'lit' : 'given' } } }),
    { kind: 'measure' as const, from: [0, 0] as FigurePoint, to: [b, 0] as FigurePoint, label: `${b} cm`, offset: 10 },
    { kind: 'line' as const, from: face[2], to: [face[2][0], 0] as FigurePoint, style: 'dashed' as const },
    { kind: 'text' as const, at: [face[2][0], h / 2] as FigurePoint, text: `${h} cm`, tone: lit === 'face' ? 'lit' as const : 'given' as const, dx: -26 }]
  return pic(items, `A triangular prism. The triangle has base ${b} cm and height ${h} cm; the prism is ${l} cm long.`, caption)
}
{
  const p = triPrism(6, 4, 10)
  worked(prisms, 'Find the volume of this triangular prism.', 'Volume of a prism', 'GM14 p143 Example (own numbers)', boardModel([], [
    { title: 'The cross-section', say: 'The end face is the shape that runs all the way through: a triangle. Its area is ½ × base × height.', rows: ['A = {1|2} × 6 × 4 = 12 cm²'], picture: triPrism(6, 4, 10, 'face') },
    { title: 'Times the length', say: 'Every slice of the prism is that triangle, 10 cm of them.', rows: ['V = 12 × 10', '! V = 120 cm³'], picture: triPrism(6, 4, 10, 'length', 'V = 120 cm³') },
  ], 'Find V', p), 'Volume of a prism = area of cross-section × length. A cuboid is a prism too: its cross-section is a rectangle.')
}
{
  const draw = (lit?: 'face' | 'length', caption?: string) => pic(cuboid(5, 4, 7, { w: { label: '5 cm' }, h: { label: '4 cm' }, l: { label: '7 cm', tone: lit === 'length' ? 'lit' : 'given' } }, { lit }), 'A cuboid 5 cm wide, 4 cm tall and 7 cm long.', caption)
  const p = draw()
  practice(prisms, 'Find the volume of this cuboid.', 'GM14 Your Turn Q1 (own numbers)', p, number(140, '140 cm³'), 'The end face is a rectangle: 5 × 4. Then times the length.', boardModel([], [
    { title: 'The cross-section', say: 'The end face is a 5 by 4 rectangle.', rows: ['A = 5 × 4 = 20 cm²'], picture: draw('face') },
    { title: 'Times the length', say: 'Times the length, 7 cm.', rows: ['V = 20 × 7', '! V = 140 cm³'], picture: draw('length', 'V = 140 cm³') },
  ], 'Find V', p), slips(140, [[16, 'That adds the three lengths. Volume multiplies them.'], [166, 'That’s the surface area. Volume is length × width × height.']]), V_BOX)
}
{
  const p = triPrism(8, 5, 12)
  practice(prisms, 'Find the volume of this triangular prism.', 'GM14 p143 (own numbers)', p, number(240, '240 cm³'), 'The triangle’s area is ½ × 8 × 5. Then times 12.', boardModel([], [
    { title: 'The cross-section', say: 'Half of base times height.', rows: ['A = {1|2} × 8 × 5 = 20 cm²'], picture: triPrism(8, 5, 12, 'face') },
    { title: 'Times the length', say: 'The prism is 12 cm long.', rows: ['V = 20 × 12', '! V = 240 cm³'], picture: triPrism(8, 5, 12, 'length', 'V = 240 cm³') },
  ], 'Find V', p), slips(240, [[480, 'The triangle is half of 8 × 5. Halve it first.'], [25, 'That adds the lengths. Multiply the area by the length.']]), V_BOX)
}
{
  const face = trapezium(4, 10, 5)
  const draw = (lit?: 'face' | 'length', caption?: string) => pic([...prism(face, 6, { lit, labels: { length: { label: '6 cm', tone: lit === 'length' ? 'lit' : 'given' } } }),
    { kind: 'measure', from: [0, 0], to: [10, 0], label: '10 cm', offset: 10 }, { kind: 'text', at: [5, 5], text: '4 cm', dy: -16 },
    { kind: 'line', from: face[3], to: [face[3][0], 0], style: 'dashed' }, { kind: 'text', at: [face[3][0], 2.5], text: '5 cm', tone: lit === 'face' ? 'lit' : 'given', dx: 26 }],
  'A prism whose cross-section is a trapezium with parallel sides 4 cm and 10 cm, 5 cm apart. It is 6 cm long.', caption)
  const p = draw()
  practice(prisms, 'Find the volume of this trapezium prism.', 'GM14 Your Turn Q3 (own numbers)', p, number(210, '210 cm³'), 'The trapezium’s area is ½(a + b)h. Then times the length.', boardModel([], [
    { title: 'The cross-section', say: 'A trapezium: half the sum of the parallel sides, times the distance between them.', rows: ['A = {1|2} × (4 + 10) × 5 = 35 cm²'], picture: draw('face') },
    { title: 'Times the length', say: 'The prism is 6 cm long.', rows: ['V = 35 × 6', '! V = 210 cm³'], picture: draw('length', 'V = 210 cm³') },
  ], 'Find V', p), slips(210, [[420, 'A trapezium’s area is half of (a + b) × h. Halve it.'], [1200, 'That multiplies every length. Find the trapezium’s area first.']]), V_BOX)
}

/* ---------- Rung 2: cylinders ---------- */

function cylinderSteps(r: number, h: number, given: 'r' | 'd' = 'r') {
  const base = Math.PI * r * r, V = r1(base * h)
  const draw = (lit?: 'top' | 'side', caption?: string) => pic(cylinder(r, h, { r: { label: given === 'r' ? `${r} cm` : `r = ${r}`, tone: lit === 'top' ? 'lit' : 'given' }, h: { label: `${h} cm`, tone: lit === 'side' ? 'lit' : 'given' } }, lit),
    `A cylinder with radius ${r} cm and height ${h} cm.`, caption)
  return { V, draw, moves: [
    ...(given === 'd' ? [{ title: 'Halve the diameter', say: `The formula needs the radius: half of ${2 * r} is ${r}.`, rows: [`r = ${2 * r} ÷ 2 = ${r} cm`], picture: draw('top') }] : []),
    { title: 'The circle’s area', say: `The cross-section is a circle: πr² = π × ${r}².`, rows: [`A = π × ${r}² = ${f(base)}… cm²`], picture: draw('top') },
    { title: 'Times the height', say: `The cylinder is ${h} cm tall. Round at the end.`, rows: [`V = ${f(base)}… × ${h}`, `! V = ${show(V, 1)} cm³`], picture: draw('side', `V = ${show(V, 1)} cm³`) },
  ] }
}
{
  const { draw, moves } = cylinderSteps(3, 10)
  worked(cylinders, 'Find the volume of this cylinder, to 1 decimal place.', 'Volume of a cylinder', 'GM14 p143 Volume of prisms: cylinders (own numbers)', boardModel([], moves, 'Find V', draw()),
    'A cylinder is a prism with a circle for its cross-section, so V = πr² × h. Learn this one: the exam won’t give it.')
}
for (const [r, h, given] of [[5, 8, 'r'], [2, 9, 'r'], [5, 4, 'd']] as const) {
  const { V, draw, moves } = cylinderSteps(r, h, given)
  const p = given === 'd' ? pic([...cylinder(r, h, { h: { label: `${h} cm` } }), { kind: 'measure', from: [-r, h], to: [r, h], label: `${2 * r} cm`, offset: -22, side: -1 }], `A cylinder with diameter ${2 * r} cm and height ${h} cm.`) : draw()
  practice(cylinders, 'Find the volume of this cylinder, to 1 decimal place.', 'GM14 p143 (own numbers)', p, number(V, `${show(V, 1)} cm³`), given === 'd' ? 'Halve the diameter first. Then πr² × h.' : 'πr², then times the height.',
    boardModel([], moves, 'Find V', p), slips(V, [[r1(Math.PI * 2 * r * h), 'That uses 2r, not r². Square the radius.'], [r1(Math.PI * 4 * r * r * h), 'That squares the diameter. Use the radius.'], [r1(Math.PI * r * r), 'That’s only the circle. Times it by the height.']]), V_BOX)
}

/* ---------- Rung 3: pyramids and cones ---------- */

{
  const draw = (lit?: 'base' | 'face', caption?: string) => pic(squarePyramid(6, 10, { b: { label: '6 cm' }, h: { label: '10 cm', tone: lit === 'face' ? 'lit' : 'given' } }, lit), 'A square-based pyramid with base 6 cm by 6 cm and vertical height 10 cm.', caption)
  worked(thirds, 'Find the volume of this square-based pyramid.', 'Pyramids and cones', 'GM14 p143 Example (own numbers)', boardModel([], [
    { title: 'The base', say: 'The base is a 6 by 6 square.', rows: ['Base = 6² = 36 cm²'], picture: draw('base') },
    { title: 'A third of base × height', say: 'A pyramid fills a third of the box around it: one third of the base times the vertical height.', rows: ['V = {1|3} × 36 × 10', '! V = 120 cm³'], picture: draw(undefined, 'V = 120 cm³') },
  ], 'Find V', draw()), 'Volume of a pyramid = ⅓ × area of base × vertical height. A cone is the same with a circle for its base: ⅓πr²h.')
}
{
  const draw = (lit?: 'base' | 'face', caption?: string) => pic(squarePyramid(9, 8, { b: { label: '9 cm' }, h: { label: '8 cm' } }, lit), 'A square-based pyramid with base 9 cm by 9 cm and vertical height 8 cm.', caption)
  const p = draw()
  practice(thirds, 'Find the volume of this square-based pyramid.', 'GM14 Your Turn Q2 (own numbers)', p, number(216, '216 cm³'), 'Base 9², times the height, then a third.', boardModel([], [
    { title: 'The base', say: 'A 9 by 9 square.', rows: ['Base = 9² = 81 cm²'], picture: draw('base') },
    { title: 'A third of base × height', say: 'A third of 81 × 8.', rows: ['V = {1|3} × 81 × 8', '! V = 216 cm³'], picture: draw(undefined, 'V = 216 cm³') },
  ], 'Find V', p), slips(216, [[648, 'That’s the whole box. A pyramid is a third of it.'], [24, 'That’s a third of 9 × 8. Square the base first: 9² = 81.']]), V_BOX)
}
for (const [r, h] of [[3, 7], [6, 5]] as const) {
  const base = Math.PI * r * r, V = r1(base * h / 3)
  const draw = (lit?: 'base' | 'slant', caption?: string) => pic(cone(r, h, { r: { label: `${r} cm` }, h: { label: `${h} cm` } }, lit), `A cone with base radius ${r} cm and vertical height ${h} cm.`, caption)
  const p = draw()
  practice(thirds, 'Find the volume of this cone, to 1 decimal place.', 'GM14 p143 Volume of cones (own numbers)', p, number(V, `${show(V, 1)} cm³`), '⅓ × πr² × h.', boardModel([], [
    { title: 'The base', say: `A circle of radius ${r}: π × ${r}².`, rows: [`Base = π × ${r}² = ${f(base)}… cm²`], picture: draw('base') },
    { title: 'A third of base × height', say: `A third of the base times ${h}.`, rows: [`V = {1|3} × ${f(base)}… × ${h}`, `! V = ${show(V, 1)} cm³`], picture: draw(undefined, `V = ${show(V, 1)} cm³`) },
  ], 'Find V', p), slips(V, [[r1(base * h), 'That’s the cylinder around it. A cone is a third of that.'], [r1(Math.PI * r * h / 3), 'Square the radius: πr².']]), V_BOX)
}
{
  // The book's Your Turn Q4: a volume and a base given, the height in x.
  const items: FigureItem[] = [...squarePyramid(5, 6), { kind: 'text', at: [2.5, -0.3], text: 'base 18 cm²', dy: 12 }, { kind: 'text', at: [3.3, 5.5], text: 'x + 5', tone: 'x', dx: 34 }]
  const p = pic(items, 'A pyramid with base area 18 square centimetres and height x + 5 centimetres. Its volume is 54 cubic centimetres.')
  practice(thirds, 'This pyramid has volume 54 cm³. Its base has area 18 cm² and its height is x + 5 cm. Find x.', 'GM14 Your Turn Q4 (own numbers)', p, number(4, 'x = 4'), 'Write ⅓ × 18 × (x + 5) = 54, then solve.', boardModel([], [
    { title: 'Write the volume', say: 'A third of the base times the height is the volume.', rows: ['{1|3} × 18 × (x + 5) = 54', '6(x + 5) = 54'], picture: p },
    { title: 'Solve', say: 'Divide by 6, then take away 5.', rows: ['x + 5 = 9', '! x = 4'], picture: p },
  ], 'Find x', p), slips(4, [[9, 'That’s the height, x + 5. Take away 5.'], [-2, 'Divide by 6 first: 54 ÷ 6 = 9.']]), { prefix: 'x =' })
}

/* ---------- Rung 4: spheres and composite shapes ---------- */

{
  const draw = (lit = false, caption?: string) => pic(sphere(3, { label: '3 cm' }, lit), 'A sphere with radius 3 cm.', caption)
  const V = r1(4 / 3 * Math.PI * 27)
  worked(spheres, 'Find the volume of this sphere, to 1 decimal place.', 'Volume of a sphere', 'GM14 p144 Example (own numbers)', boardModel([], [
    { title: 'Cube the radius', say: 'The formula is 4/3 πr³: cube the radius first.', rows: ['r³ = 3 × 3 × 3 = 27'], picture: draw() },
    { title: 'Times 4/3 π', say: 'Then times π and times four thirds.', rows: [`V = {4|3} × π × 27 = 36π`, `! V = ${show(V, 1)} cm³`], picture: draw(true, `V = 36π = ${show(V, 1)} cm³`) },
  ], 'Find V', draw()), 'Volume of a sphere = 4/3 πr³. You’re given this in the exam. A hemisphere is half a sphere.')
}
{
  const V = r1(4 / 3 * Math.PI * 216)
  const draw = (lit = false, caption?: string) => pic(sphere(6, { label: '6 cm' }, lit), 'A sphere with radius 6 cm.', caption)
  const p = draw()
  practice(spheres, 'Find the volume of this sphere, to 1 decimal place.', 'GM14 p144 (own numbers)', p, number(V, `${show(V, 1)} cm³`), '4/3 × π × 6³.', boardModel([], [
    { title: 'Cube the radius', say: '6 × 6 × 6.', rows: ['r³ = 6³ = 216'], picture: p },
    { title: 'Times 4/3 π', say: 'Four thirds of 216 is 288.', rows: ['V = {4|3} × π × 216 = 288π', `! V = ${show(V, 1)} cm³`], picture: draw(true, `V = ${show(V, 1)} cm³`) },
  ], 'Find V', p), slips(V, [[r1(4 / 3 * Math.PI * 36), 'That squares the radius. Cube it: 6³ = 216.'], [r1(Math.PI * 216), 'Times four thirds as well.'], [r1(2 / 3 * Math.PI * 216), 'That’s a hemisphere, half of it.']]), V_BOX)
}
{
  const V = r1(2 / 3 * Math.PI * 27)
  const items: FigureItem[] = [{ kind: 'arc', centre: [0, 0], r: 3, from: 0, to: 180 }, ...sphere(3, { label: '3 cm' }).slice(1, 3), { kind: 'line', from: [0, 0], to: [3, 0] }, { kind: 'point', at: [0, 0] }, { kind: 'text', at: [1.5, 0], text: '3 cm', dy: 15 }]
  const p = pic(items, 'A hemisphere with radius 3 cm.')
  practice(spheres, 'Find the volume of this hemisphere, to 1 decimal place.', 'GM14 p144 (own numbers)', p, number(V, `${show(V, 1)} cm³`), 'A hemisphere is half a sphere: half of 4/3 πr³.', boardModel([], [
    { title: 'The whole sphere', say: 'First the sphere it is half of.', rows: ['Sphere = {4|3} × π × 3³ = 36π'], picture: p },
    { title: 'Halve it', say: 'Half of 36π is 18π.', rows: ['V = 36π ÷ 2 = 18π', `! V = ${show(V, 1)} cm³`], picture: pic(items, 'A hemisphere with radius 3 cm.', `V = ${show(V, 1)} cm³`) },
  ], 'Find V', p), slips(V, [[r1(4 / 3 * Math.PI * 27), 'That’s the whole sphere. Halve it.'], [r1(2 / 3 * Math.PI * 9), 'Cube the radius, 3³ = 27.']]), V_BOX)
}
{
  // A hemisphere on a cylinder, like the book's Your Turn Q5.
  const cyl = Math.PI * 4 * 5, hemi = 2 / 3 * Math.PI * 8, V = r1(cyl + hemi)
  const draw = (caption?: string) => pic(capsule(2, 5, { r: { label: '2 cm' }, h: { label: '5 cm' } }), 'A cylinder with radius 2 cm and height 5 cm with a hemisphere of radius 2 cm on top.', caption)
  const p = draw()
  practice(spheres, 'A hemisphere sits on top of this cylinder. Find the volume of the whole shape, to 1 decimal place.', 'GM14 Your Turn Q5 (own numbers)', p, number(V, `${show(V, 1)} cm³`), 'Find the two parts separately, then add.', boardModel([], [
    { title: 'The cylinder', say: 'πr² × h, with r = 2 and h = 5.', rows: [`π × 2² × 5 = 20π = ${f(cyl)}…`], picture: p },
    { title: 'The hemisphere', say: 'Half of 4/3 π × 2³.', rows: [`{1|2} × {4|3} × π × 2³ = ${f(hemi)}…`], picture: p },
    { title: 'Add them', say: 'The whole shape is both parts. Round at the end.', rows: [`V = ${f(cyl)}… + ${f(hemi)}…`, `! V = ${show(V, 1)} cm³`], picture: draw(`V = ${show(V, 1)} cm³`) },
  ], 'Find V', p), slips(V, [[r1(cyl), 'That’s only the cylinder. Add the hemisphere on top.'], [r1(cyl + 2 * hemi), 'The top is half a sphere, not a whole one.']]), V_BOX)
}

add('mixed', 'Volume of 3D shapes', 'GM14 consolidation', text(
  'Prism: area of cross-section × length. A cuboid is length × width × height.',
  'Cylinder: πr² × h.',
  'Pyramid: ⅓ × base × height. Cone: ⅓πr²h.',
  'Sphere: 4/3 πr³, a hemisphere is half. Add the parts of a composite shape.',
))

export const tutorVolumeLesson: TutorMethodLesson = {
  id: 'L214', number: 214, title: 'Volume of 3D shapes', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Find the volume of prisms, cylinders, pyramids, cones, spheres and shapes made of them.',
  labels: { [prisms]: 'Prisms', [cylinders]: 'Cylinders', [thirds]: 'Pyramids and cones', [spheres]: 'Spheres and composites', mixed: 'Review' },
  states: finish(),
}
