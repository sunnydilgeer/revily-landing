import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { AngleFrame } from '../../written-methods/tutor/methodWorking'
import type { AngleBoardSpec } from '../../written-methods/tutor/AngleBoard'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { boardModel, choose, number, text, type BoardMove } from '../../simultaneous-equations/tutor/boardWorkings'

/*
 * Geometry lesson 3: 2D shapes. From GM3 in Sunny's revision book (p120–121), with our own shapes and numbers. Four
 * rungs: polygons, their names from 3 to 10 sides, and regular or irregular; the four kinds of triangle; the six
 * quadrilaterals by their properties; and using a property to find an angle, as the book's Q3 does. Built like lessons
 * 1 and 2 (Sunny, 9 Oct: interactive, factual, step by step): each rung opens with a play screen on the angle board,
 * every question has its own picture drawn to its angles, and each working shows the property it uses on the picture.
 *
 * Hidden on live like lessons 1 and 2: only the unlisted Geometry shelf (src/features/geometry/geometryLessons.ts)
 * opens it.
 *
 * Pictures are `polygon` frames (AngleFrame, methodWorking.ts): corners anticlockwise from the bottom left, side i
 * running from corner i to corner i + 1. Ticks mark equal sides, arrows parallel ones; a label of ' ' draws a corner's
 * mark (a right-angle square) with no number.
 */

const { add, finish } = author(203)
const names = 'geometry-polygon-names'
const triangles = 'geometry-triangle-types'
const quads = 'geometry-quadrilaterals'
const props = 'geometry-shape-angles'

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
function explore(topic: MicroSkillId, title: string, sourceRef: string, spec: AngleBoardSpec) {
  const state = add(topic, title, sourceRef, text(title))
  state.angleBoard = spec
}
function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: TutorWorking, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  state.content.heading = heading
  return state
}
function practice(topic: MicroSkillId, title: string, sourceRef: string, picture: AngleFrame, interaction: InteractionDefinition, hint: string, model: TutorWorking, diagnose?: (response: string) => string | null) {
  const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  const state: TutorMethodState = add(topic, title, sourceRef, { kind: 'angle', angle: picture }, interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  if (interaction.type === 'numericInput') { state.answerLabel = 'Angle (°)'; state.answerPrefix = 'x =' }
  if (diagnose) state.diagnose = diagnose
  return state
}
const slips = (right: number, list: Slip[]) => (response: string) => diagnoseSlips(response.replace(/°/g, ''), right, list)
const deg = (n: number) => `${n}°`

/* ---------- Pictures ---------- */

export const NAMES: Record<number, string> = { 3: 'Triangle', 4: 'Quadrilateral', 5: 'Pentagon', 6: 'Hexagon', 7: 'Heptagon', 8: 'Octagon', 9: 'Nonagon', 10: 'Decagon' }
const blank = (n: number) => Array.from({ length: n }, () => '')
export const regularAngles = (n: number) => Array.from({ length: n }, () => (n - 2) * 180 / n)
/** A polygon drawn to its angles, with nothing marked unless asked. */
export const poly = (angles: number[], more: Partial<AngleFrame> = {}): AngleFrame => ({ shape: 'polygon', angles, labels: blank(angles.length), ...more })
const ones = (n: number, k = 1) => Array.from({ length: n }, () => k)
const square90 = (n: number) => Array.from({ length: n }, () => ' ')
/** A kite's sides with these angles at its two ends (corners 0 and 2): from the sine rule, so the ticked sides really match. */
const kiteSides = (a: number, c: number) => [1, Math.sin(a * Math.PI / 360) / Math.sin(c * Math.PI / 360)]

/** The six quadrilaterals (GM3 p120), each with its properties marked: ticks, arrows and right angles. */
export const QUADS = {
  square: { name: 'Square', facts: '4 equal sides and 4 right angles', picture: poly([90, 90, 90, 90], { sides: [1, 1], sideTicks: ones(4), labels: square90(4), families: ones(4, -1) }) },
  rectangle: { name: 'Rectangle', facts: '4 right angles, and opposite sides equal', picture: poly([90, 90, 90, 90], { sides: [1.7, 1], sideTicks: [1, 2, 1, 2], labels: square90(4), families: ones(4, -1) }) },
  parallelogram: { name: 'Parallelogram', facts: '2 pairs of parallel sides; opposite angles equal, and next-door angles add to 180°', picture: poly([62, 118, 62, 118], { sides: [1.5, 1], sideArrows: [1, 2, 1, 2] }) },
  rhombus: { name: 'Rhombus', facts: '4 equal sides; opposite sides parallel and opposite angles equal', picture: poly([60, 120, 60, 120], { sides: [1.1, 1.1], sideTicks: ones(4), sideArrows: [1, 2, 1, 2] }) },
  trapezium: { name: 'Trapezium', facts: '1 pair of parallel sides', picture: poly([62, 74, 106, 118], { sides: [1.9, 0.95], sideArrows: [1, 0, 1, 0] }) },
  kite: { name: 'Kite', facts: '2 pairs of equal sides next to each other, and one pair of equal angles', picture: poly([50, 105, 100, 105], { sides: kiteSides(50, 100), turn: 65, sideTicks: [1, 2, 2, 1] }) },
} satisfies Record<string, { name: string; facts: string; picture: AngleFrame }>
/** Each quadrilateral's marks in a few words, for the board. */
const SHORT: Record<QuadId, string> = { square: '4 equal sides, 4 right angles', rectangle: '4 right angles', parallelogram: '2 pairs of parallel sides', rhombus: '4 equal sides', trapezium: '1 pair of parallel sides', kite: '2 pairs of equal sides' }
export type QuadId = keyof typeof QUADS

/* ---------- Workings ---------- */

/** Naming a shape: number its corners to count the sides once each, then name it; then, if asked, regular or not. */
function nameIt(picture: AngleFrame, regular?: string) {
  const n = picture.angles.length, name = NAMES[n]
  const moves: BoardMove[] = [
    { title: 'Count the sides', say: `Go round once, numbering each corner so none is counted twice. Every side runs from one corner to the next, so ${n} corners means ${n} sides.`, rows: [`> ${n} straight sides`], picture: { ...picture, names: picture.angles.map((_, i) => String(i + 1)), lit: 'shape' } },
    { title: 'Name it', say: `Any shape with ${n} straight sides is a${name === 'Octagon' ? 'n' : ''} ${name.toLowerCase()}, whatever it looks like.`, rows: [regular ? `> ${name}` : `! ${name}`], picture: { ...picture, caption: name } },
  ]
  if (regular) moves.push({ title: 'Regular or irregular?', say: regular, rows: [`! ${picture.sideTicks?.every(t => t === picture.sideTicks?.[0]) && picture.angles.every(a => Math.abs(a - picture.angles[0]) < 0.01) ? 'Regular' : 'Irregular'} ${name.toLowerCase()}`], picture: { ...picture, caption: name } })
  return boardModel([], moves, 'Name it', picture)
}

/** Naming a triangle: look at its sides (ticks), then its angles, then name it. */
function triangleIt(picture: AngleFrame, sides: string, angles: string, kind: string) {
  return boardModel([], [
    { title: 'Look at the sides', say: sides, rows: ['> Ticks mark equal sides'], picture: { ...picture, lit: 'shape' } },
    { title: 'Look at the angles', say: angles, rows: [`> ${picture.labels.filter(l => l.trim()).join(', ')}`], picture },
    { title: 'Name it', say: `So it is ${/^[AEIOU]/.test(kind) ? 'an' : 'a'} ${kind.toLowerCase()} triangle.`, rows: [`! ${kind}`], picture: { ...picture, caption: kind } },
  ], 'Name it', picture)
}

/** Naming a quadrilateral from what's marked on it. */
function quadIt(id: QuadId, clues: string) {
  const q = QUADS[id]
  return boardModel([], [
    { title: 'Read the marks', say: clues, rows: ['> Ticks: equal sides. Arrows: parallel sides'], picture: { ...q.picture, lit: 'shape' } },
    { title: 'Name it', say: `${q.name}: ${q.facts}.`, rows: [`! ${q.name}`], picture: { ...q.picture, caption: q.name } },
  ], 'Name it', q.picture)
}

/**
 * Using a property to find an angle: the shape, then the property (each step boxing the angle it uses and showing the
 * one it finds in green), then x.
 */
type Use = { from: number[]; to: number; rule: string; say: string; rows: (shown: string[]) => string[] }
function useProperty(picture: AngleFrame, spot: [string, string], uses: Use[], x: number) {
  const shown = [...picture.labels]
  const moves: BoardMove[] = [{ title: 'Spot the shape', say: spot[1], rows: [`> ${spot[0]}`], picture: { ...picture, lit: 'shape' } }]
  uses.forEach(use => {
    const value = Math.round(picture.angles[use.to])
    const rows = use.rows(shown)
    shown[use.to] = deg(value)
    moves.push({ title: use.rule, say: use.say, rows, picture: { ...picture, labels: [...shown], boxed: use.from, found: [use.to] } })
  })
  return { picture, model: boardModel([], moves, 'Find x', picture), answer: Math.round(picture.angles[x]) }
}

/* ---------- Rung 1: polygons and their names ---------- */

explore(names, 'Add sides, then drag a corner out of shape. Watch the name.', 'GM3 p120 (play)', { mode: 'polygon', start: [5] })
worked(names, 'Name this shape.', 'Counting the sides', 'GM3 p120 Irregular polygons (own shape)', nameIt(poly([95, 150, 95, 160, 120, 140, 140], { sides: [1.3, 0.7, 0.9, 0.8, 0.6] })),
  'A polygon is a flat shape made of straight sides. Its name only depends on how many sides it has.')
worked(names, 'Is this shape regular or irregular?', 'Regular or irregular', 'GM3 p120 Regular polygons', nameIt(poly(regularAngles(6), { sideTicks: ones(6), labels: Array.from({ length: 6 }, () => '120°'), families: ones(6, -1) }),
  'Every side has one tick, so every side is the same length, and every angle is 120°. All sides and all angles the same: it is regular.'),
  'Regular means all the sides are the same length and all the angles are the same size. If either is different, it is irregular.')
{
  const p = poly([75, 80, 240, 60, 85], { sides: [1.6, 1, 0.8] })
  practice(names, 'What is the name of this shape?', 'GM3 p121 Q1 (own shape)', p, choose(
    'Pentagon',
    ['Hexagon', 'Count again, numbering the corners: there are 5.'],
    ['Quadrilateral', 'The dent adds a corner. Count every corner, the one pointing in too.'],
    ['It isn’t a polygon', 'A dent doesn’t matter. Straight sides that close up make a polygon.'],
  ), 'Number the corners as you go round, including the one that points in.', nameIt(p))
}
{
  const p = poly([105, 125, 130, 110, 135, 115], { sides: [1.4, 0.8, 1, 0.9] })
  practice(names, 'What is the name of this shape?', 'GM3 p120 Irregular polygons (own shape)', p, choose(
    'Hexagon',
    ['Pentagon', 'A pentagon has 5 sides. Count again.'],
    ['Heptagon', 'A heptagon has 7 sides. Count again.'],
    ['Octagon', 'An octagon has 8 sides.'],
  ), 'Count the sides. 6 sides is a hex…', nameIt(p))
}
{
  const p = poly([120, 150, 125, 145, 140, 130, 150, 120], { sides: [1.2, 0.7, 0.9, 0.8, 1, 0.6] })
  practice(names, 'What is the name of this shape?', 'GM3 p120 Irregular polygons (own shape)', p, choose(
    'Octagon',
    ['Heptagon', 'A heptagon has 7 sides. Number the corners and count again.'],
    ['Nonagon', 'A nonagon has 9 sides.'],
    ['Hexagon', 'A hexagon has 6 sides.'],
  ), 'Oct means 8, like an octopus’s arms.', nameIt(p))
}
{
  const p = poly(regularAngles(10), { sideTicks: ones(10) })
  practice(names, 'This shape is regular. What is it called?', 'GM3 p120 Regular polygons', p, choose(
    'Regular decagon',
    ['Regular nonagon', 'A nonagon has 9 sides. Count again.'],
    ['Regular octagon', 'An octagon has 8 sides.'],
    ['Circle', 'It has straight sides, so it is a polygon. Count them.'],
  ), 'Dec means 10, like a decade.', nameIt(p))
}
{
  const p = QUADS.rectangle.picture
  practice(names, 'Is a rectangle a regular polygon?', 'GM3 p120 Regular polygons (a common mistake)', p, choose(
    'No: its angles are equal, but its sides aren’t',
    ['Yes: all its angles are 90°', 'Equal angles aren’t enough. A regular shape needs equal sides too.'],
    ['Yes: its opposite sides are equal', 'All 4 sides must be equal. The long sides and short sides differ.'],
    ['No: it has right angles', 'A square has right angles and is regular. Look at the sides.'],
  ), 'Regular needs all sides equal and all angles equal.', boardModel([], [
    { title: 'Angles', say: 'All four angles are 90°: the angles are all the same.', rows: ['> 4 right angles: angles equal'], picture: { ...p, lit: 'shape' } },
    { title: 'Sides', say: 'One tick and two ticks: the long sides and the short sides are different lengths.', rows: ['> Sides not all equal'], picture: p },
    { title: 'Regular?', say: 'Regular needs both. The sides let it down, so a rectangle is irregular. A square is the regular quadrilateral.', rows: ['! Irregular'], picture: { ...p, caption: 'Irregular' } },
  ], 'Decide', p))
}

/* ---------- Rung 2: the four kinds of triangle ---------- */

explore(triangles, 'Drag the top corner. Watch the triangle’s name change.', 'GM3 p121 Triangles (play)', { mode: 'kinds', start: [50, 75] })
{
  const p = poly([70, 70, 40], { sideTicks: [0, 1, 1], labels: ['70°', '70°', '40°'], families: [0, 0, 1] })
  worked(triangles, 'What kind of triangle is this?', 'Isosceles triangles', 'GM3 p121 Triangles 2', triangleIt(p,
    'The two sloping sides each have one tick: they are the same length. The base is different.',
    'The two base angles are both 70°. Two equal sides always come with two equal angles, at the ends of the third side.', 'Isosceles'),
    'Equilateral: 3 equal sides, all angles 60°. Isosceles: 2 equal sides and 2 equal angles. Right-angled: one angle is 90°. Scalene: no sides or angles equal.')
}
{
  const p = poly([90, 34, 56], { sides: [1.3], labels: [' ', '34°', '56°'], families: [-1, 0, 1] })
  practice(triangles, 'What kind of triangle is this?', 'GM3 p121 Triangles 3', p, choose(
    'Right-angled',
    ['Scalene', 'Its sides do all differ, but the square in the corner says more: one angle is 90°.'],
    ['Isosceles', 'No two angles are equal, so no two sides are.'],
    ['Equilateral', 'Equilateral angles are all 60°.'],
  ), 'Look for the little square in a corner.', triangleIt(p, 'No ticks: nothing says any sides are equal.', 'The square in the corner is a right angle: 90°.', 'Right-angled'))
}
{
  const p = poly([60, 60, 60], { sideTicks: [1, 1, 1], labels: ['60°', '60°', '60°'], families: [0, 0, 0] })
  practice(triangles, 'What kind of triangle is this?', 'GM3 p121 Triangles 1', p, choose(
    'Equilateral',
    ['Isosceles', 'Isosceles has exactly 2 equal sides. This has 3.'],
    ['Scalene', 'Scalene sides are all different. These all have one tick.'],
    ['Right-angled', 'None of the angles is 90°.'],
  ), 'How many sides have the same tick?', triangleIt(p, 'Every side has one tick: all 3 sides are equal.', 'All 3 angles are 60°.', 'Equilateral'))
}
{
  const p = poly([47, 78, 55], { labels: ['47°', '78°', '55°'], families: [0, 1, 2] })
  practice(triangles, 'What kind of triangle is this?', 'GM3 p121 Triangles 4', p, choose(
    'Scalene',
    ['Isosceles', 'No two angles match, so no two sides do.'],
    ['Right-angled', 'None of the angles is 90°.'],
    ['Equilateral', 'Equilateral angles are all 60°.'],
  ), 'Are any of the angles the same?', triangleIt(p, 'No ticks, and the sides look different lengths.', 'All three angles are different, so all three sides are different.', 'Scalene'))
}
{
  const p = poly([50, 80, 50], { labels: ['50°', '80°', '50°'], families: [0, 1, 0] })
  practice(triangles, 'A triangle has angles 50°, 80° and 50°. What kind is it?', 'GM3 p121 Triangles 2 (from the angles)', p, choose(
    'Isosceles',
    ['Scalene', 'Two angles are the same: 50° and 50°.'],
    ['Equilateral', 'Only two angles match, not all three.'],
    ['Right-angled', 'None of them is 90°.'],
  ), 'Two equal angles mean two equal sides.', triangleIt(p, 'No ticks are drawn here, so use the angles.', 'Two angles are 50°. Equal angles mean the sides opposite them are equal too.', 'Isosceles'))
}
{
  const p = poly([90, 45, 45], { sideTicks: [1, 0, 1], labels: [' ', '45°', '45°'], families: [-1, 0, 0] })
  practice(triangles, 'Can a triangle be right-angled and isosceles at the same time?', 'GM3 p121 Triangles (both at once)', p, choose(
    'Yes: 90°, 45° and 45°, with two equal sides',
    ['No: a right angle makes it scalene', 'Here the other two angles are both 45°, so two sides are equal.'],
    ['No: isosceles angles must be under 90°', 'Only the two equal angles must be under 90°. The third can be anything.'],
    ['Only if it is equilateral', 'Equilateral angles are all 60°, never 90°.'],
  ), 'The other two angles share 90°.', triangleIt(p, 'Two sides have one tick: they are equal.', 'One angle is 90°, and the other two are 45° each.', 'Right-angled isosceles'))
}

/* ---------- Rung 3: the six quadrilaterals ---------- */

explore(quads, 'Drag the corner of the parallelogram. Watch the opposite angles.', 'GM3 p120 Quadrilaterals 5 (play)', { mode: 'parallelogram', start: [65] })
worked(quads, 'The six quadrilaterals you need to know.', 'Six quadrilaterals', 'GM3 p120 Quadrilaterals: 6 common types', boardModel([],
  (Object.keys(QUADS) as QuadId[]).map(id => ({ title: QUADS[id].name, say: `${QUADS[id].name}: ${QUADS[id].facts}.`, rows: [`>0 ${QUADS[id].name}: ${SHORT[id]}`], picture: { ...QUADS[id].picture, caption: QUADS[id].name } })),
  'Six quadrilaterals', QUADS.square.picture),
  'Ticks mark equal sides; arrows mark parallel sides. Each quadrilateral is known by what its marks say.')
practice(quads, 'Only the top and bottom sides are parallel. What type of quadrilateral is this?', 'GM3 p121 Q2 (own shape)', QUADS.trapezium.picture, choose(
  'Trapezium',
  ['Parallelogram', 'A parallelogram has 2 pairs of parallel sides. This has 1.'],
  ['Kite', 'A kite has 2 pairs of equal sides, next to each other.'],
  ['Rhombus', 'A rhombus has 4 equal sides and 2 pairs of parallel sides.'],
), 'One pair of parallel sides.', quadIt('trapezium', 'One arrow on the top and one on the bottom: one pair of parallel sides. The slanted sides aren’t parallel.'))
practice(quads, 'What type of quadrilateral is this?', 'GM3 p120 Quadrilaterals 5', QUADS.parallelogram.picture, choose(
  'Parallelogram',
  ['Rhombus', 'A rhombus has 4 equal sides. Nothing says these are.'],
  ['Rectangle', 'A rectangle has right angles. These corners slant.'],
  ['Trapezium', 'A trapezium has only 1 pair of parallel sides. This has 2.'],
), 'Count the pairs of arrows.', quadIt('parallelogram', 'Single arrows on the top and bottom, double arrows on the sides: 2 pairs of parallel sides. No ticks, no right angles.'))
practice(quads, 'What type of quadrilateral is this?', 'GM3 p120 Quadrilaterals 4', QUADS.kite.picture, choose(
  'Kite',
  ['Rhombus', 'A rhombus has all 4 sides equal. Here the single-tick sides are longer than the double-tick ones.'],
  ['Parallelogram', 'No arrows: nothing is parallel.'],
  ['Trapezium', 'A trapezium has a pair of parallel sides.'],
), 'Where are the equal sides: opposite, or next to each other?', quadIt('kite', 'One tick on the two sides meeting at the bottom, two ticks on the two meeting at the top: 2 pairs of equal sides, next to each other.'))
practice(quads, 'What type of quadrilateral is this?', 'GM3 p120 Quadrilaterals 6', QUADS.rhombus.picture, choose(
  'Rhombus',
  ['Square', 'A square has right angles. These corners slant.'],
  ['Kite', 'A kite’s equal sides come in two pairs. Here all 4 are equal.'],
  ['Rectangle', 'A rectangle has right angles, and only opposite sides equal.'],
), 'All 4 ticks match, but the corners aren’t square.', quadIt('rhombus', 'Every side has one tick: 4 equal sides. The arrows show both pairs of opposite sides are parallel. No right angles.'))
practice(quads, 'Which is true of every parallelogram?', 'GM3 p120 Quadrilaterals 5 (properties)', QUADS.parallelogram.picture, choose(
  'Opposite angles are equal',
  ['All 4 sides are equal', 'That’s a rhombus. A parallelogram’s opposite sides are equal, not all four.'],
  ['All 4 angles are 90°', 'That’s a rectangle.'],
  ['Only one pair of sides is parallel', 'That’s a trapezium. A parallelogram has two pairs.'],
), 'Remember the board: drag the corner and two pairs stay equal.', quadIt('parallelogram', 'Two pairs of parallel sides. Drag it on the board and the opposite angles always match.'))

/* ---------- Rung 4: using a property to find an angle ---------- */

const PARA = '2 pairs of parallel sides'
const nextDoor = (a: number, b: number): Use => ({ from: [a], to: b, rule: 'Next-door angles add to 180°', say: 'Between two parallel sides, the two angles on one side make a C: allied angles add to 180°.', rows: s => [`x = 180 −${s[a].replace('°', '')}`, `! x = ${180 - Number(s[a].replace('°', ''))}°`] })
{
  const c = useProperty(poly([63, 117, 63, 117], { sides: [1.5, 1], sideArrows: [1, 2, 1, 2], labels: ['63°', 'x', '', ''], families: [-1, 0, 0, 0] }),
    ['Parallelogram', 'Two pairs of arrows: it is a parallelogram.'], [nextDoor(0, 1)], 1)
  worked(props, 'This is a parallelogram. Find the angle marked x.', 'Angles in a parallelogram', 'GM3 p121 Q3 (own numbers)', c.model,
    'A parallelogram’s opposite angles are equal, and next-door angles add to 180°: they are allied angles between parallel sides.')
}
{
  const c = useProperty(poly([57, 123, 57, 123], { sides: [1.6, 1], sideArrows: [1, 2, 1, 2], names: ['D', 'C', 'B', 'A'], labels: ['57°', '', '', 'x'], families: [-1, 0, 0, 0] }),
    ['Parallelogram ABCD', 'ABCD is a parallelogram: two pairs of parallel sides.'], [{ ...nextDoor(0, 3), say: 'AD runs between the parallel sides AB and DC, so the angles at A and D are allied: they add to 180°.' }], 3)
  practice(props, 'ABCD is a parallelogram. Find the angle marked x.', 'GM3 p121 Q3 (own numbers)', c.picture, number(c.answer, deg(c.answer)), 'The angles at A and D are next to each other.', c.model,
    slips(c.answer, [[57, 'Opposite angles are equal, but these two are next to each other: they add to 180°.']]))
}
{
  const c = useProperty(poly([71, 109, 71, 109], { sides: [1.5, 1.05], sideArrows: [1, 2, 1, 2], labels: ['71°', '', 'x', ''], families: [-1, 0, 0, 0] }),
    ['Parallelogram', 'Two pairs of arrows: a parallelogram.'], [{ from: [0], to: 2, rule: 'Opposite angles are equal', say: 'In a parallelogram, opposite angles are equal.', rows: s => [`! x = ${s[0]}`] }], 2)
  practice(props, 'This is a parallelogram. Find the angle marked x.', 'GM3 p120 Quadrilaterals 5 (own numbers)', c.picture, number(c.answer, deg(c.answer)), 'x is opposite the 71°.', c.model,
    slips(c.answer, [[109, 'Next-door angles add to 180°, but x is opposite the 71°.']]))
}
{
  const c = useProperty(poly([48, 132, 48, 132], { sides: [1.1, 1.1], sideTicks: ones(4), sideArrows: [1, 2, 1, 2], labels: ['x', '132°', '', ''], families: [0, -1, 0, 0] }),
    ['Rhombus', 'Four equal sides: a rhombus. Its opposite sides are parallel, like a parallelogram’s.'], [{ ...nextDoor(1, 0), say: 'The bottom and top sides are parallel, so the two angles on the bottom make a C: they add to 180°.' }], 0)
  practice(props, 'This is a rhombus. Find the angle marked x.', 'GM3 p120 Quadrilaterals 6 (own numbers)', c.picture, number(c.answer, deg(c.answer)), 'A rhombus is a parallelogram with equal sides.', c.model,
    slips(c.answer, [[132, 'Opposite angles are equal; these two are next to each other.']]))
}
{
  const p = poly([56, 112, 80, 112], { sides: kiteSides(56, 80), turn: -28, sideTicks: [1, 2, 2, 1], labels: ['x', '112°', '80°', ''], families: [0, -1, -1, 0] })
  const c = useProperty(p, ['Kite', 'Ticks show two pairs of equal sides next to each other: a kite.'], [
    { from: [1], to: 3, rule: 'A kite’s equal angles', say: 'A kite has one pair of equal angles: the two where a one-tick side meets a two-tick side.', rows: () => ['> Equal angles in a kite', 'a = 112°'] },
    { from: [1, 2, 3], to: 0, rule: 'Quadrilateral: 360°', say: 'All four angles of any quadrilateral add to 360°, so take the other three away from 360.', rows: () => ['x = 360 −112 −112 −80', '! x = 56°'] },
  ], 0)
  practice(props, 'This is a kite. Find the angle marked x.', 'GM3 p120 Quadrilaterals 4 (own numbers)', c.picture, number(c.answer, deg(c.answer)), 'Find the angle that matches 112° first.', c.model,
    slips(c.answer, [[168, 'Use 112° twice: the kite’s other side angle matches it.'], [112, 'That’s the matching angle. x is at the left point.'], [80, 'The kite’s two end angles aren’t equal.']]))
}
{
  const c = useProperty(poly([64, 78, 102, 116], { sides: [1.9, 0.95], sideArrows: [1, 0, 1, 0], labels: ['64°', '', '', 'x'], families: [-1, 0, 0, 0] }),
    ['Trapezium', 'One pair of arrows, on the top and bottom: a trapezium.'], [{ ...nextDoor(0, 3), say: 'The left side crosses the two parallel sides, so the angles at its ends make a C: they add to 180°.' }], 3)
  practice(props, 'This is a trapezium. Find the angle marked x.', 'GM3 p120 Quadrilaterals 3 + GM2 allied angles (own numbers)', c.picture, number(c.answer, deg(c.answer)), 'Look for a C between the parallel sides.', c.model,
    slips(c.answer, [[64, 'These two aren’t equal: inside the C they add to 180°.']]))
}

add('mixed', '2D shapes', 'GM3 consolidation', text(
  'A polygon’s name depends only on its number of sides: 5 pentagon, 6 hexagon, 7 heptagon, 8 octagon, 9 nonagon, 10 decagon.',
  'Regular means all sides and all angles are equal.',
  'Triangles: equilateral, isosceles, right-angled or scalene.',
  'Square, rectangle, parallelogram, rhombus, trapezium and kite: read the ticks, arrows and right angles.',
  'A property finds an angle: opposite angles in a parallelogram are equal, next-door ones add to 180°.',
))

export const tutorShapesLesson: TutorMethodLesson = {
  id: 'L203', number: 203, title: '2D shapes', level: 'GCSE Foundation',
  goal: 'Name polygons from 3 to 10 sides and say if they are regular, name the four triangles and six quadrilaterals from their properties, and use a property to find an angle.',
  labels: { [names]: 'Polygons', [triangles]: 'Triangles', [quads]: 'Quadrilaterals', [props]: 'Using properties', mixed: 'Review' },
  states: finish(),
}
