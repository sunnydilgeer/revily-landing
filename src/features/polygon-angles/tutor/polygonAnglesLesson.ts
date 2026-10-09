import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { AngleFrame } from '../../written-methods/tutor/methodWorking'
import type { AngleBoardSpec } from '../../written-methods/tutor/AngleBoard'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { boardModel, choose, number, text, type BoardMove } from '../../simultaneous-equations/tutor/boardWorkings'

/*
 * Geometry lesson 4: Interior and exterior angles. From GM4 in Sunny's revision book (p122–123), with our own numbers
 * (the book's Your Turn Q4 has no whole-number answer, so nothing here copies it). Four rungs: the outside angles of
 * any polygon make a full turn, 360°, so a regular one's is 360 ÷ n; the inside angles add to (n − 2) × 180°, from the
 * triangles one corner cuts it into; a regular polygon's inside angle, two ways; and missing angles, with algebra as
 * the book's Q3 does. Built like lessons 1 to 3 (Sunny, 9 Oct): the first two rungs open with a play screen on the
 * angle board, where you drag a corner and the total doesn't change, and every question has its own picture.
 *
 * Hidden on live like lessons 1 to 3: only the unlisted Geometry shelf (src/features/geometry/geometryLessons.ts)
 * opens it.
 *
 * Pictures are `polygon` frames (AngleFrame, methodWorking.ts): corners anticlockwise from the bottom left. An outside
 * angle at corner i is `outside[i]`; its mark is number n + i for `families`, `boxed` and `found`.
 */

const { add, finish } = author(204)
const exterior = 'geometry-exterior'
const interior = 'geometry-interior-sum'
const regularTopic = 'geometry-regular-angles'
const algebra = 'geometry-polygon-algebra'

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
type Box = { label?: string; prefix: string }
const ANGLE: Box = { label: 'Angle (°)', prefix: 'x =' }
function practice(topic: MicroSkillId, title: string, sourceRef: string, picture: AngleFrame, interaction: InteractionDefinition, hint: string, model: TutorWorking, diagnose?: (response: string) => string | null, box: Box = ANGLE) {
  const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  const state: TutorMethodState = add(topic, title, sourceRef, { kind: 'angle', angle: picture }, interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  if (interaction.type === 'numericInput') { state.answerLabel = box.label; state.answerPrefix = box.prefix }
  if (diagnose) state.diagnose = diagnose
  return state
}
const slips = (right: number, list: Slip[]) => (response: string) => diagnoseSlips(response.replace(/°/g, ''), right, list.filter(([value]) => value !== right))
const deg = (n: number) => `${n}°`

/* ---------- Pictures ---------- */

export const NAMES: Record<number, string> = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon' }
const blank = (n: number) => Array.from({ length: n }, () => '')
const regularAngles = (n: number) => Array.from({ length: n }, () => (n - 2) * 180 / n)
const poly = (angles: number[], more: Partial<AngleFrame> = {}): AngleFrame => ({ shape: 'polygon', angles, labels: blank(angles.length), ...more })
const ticked = (n: number) => Array.from({ length: n }, () => 1)
const sumOf = (n: number) => (n - 2) * 180
/** A regular polygon, its sides ticked equal. */
const regularPoly = (n: number, more: Partial<AngleFrame> = {}) => poly(regularAngles(n), { sideTicks: ticked(n), ...more })
/** One outside angle, at corner i of n. */
const outsideAt = (n: number, i: number, label: string) => Array.from({ length: n }, (_, k) => k === i ? label : null)

/* ---------- Workings ---------- */

/** The inside angles add to (n − 2) × 180°: lines from one corner cut it into n − 2 triangles. */
function sumMoves(picture: AngleFrame, last: boolean, name = 'Sum'): BoardMove[] {
  const n = picture.angles.length
  return [
    { title: 'Cut into triangles', say: `Draw a line from one corner to every corner it isn’t joined to. A ${NAMES[n]} has ${n} sides, so it cuts into ${n} − 2 = ${n - 2} triangles.`, rows: [`> ${n} sides: ${n - 2} triangles`], picture: { ...picture, fan: true } },
    { title: 'Each triangle is 180°', say: `The triangles’ angles make up the ${NAMES[n]}’s inside angles exactly, and each triangle’s add to 180°.`, rows: [`${name} = (${n} −2) × 180`, last ? `! ${name} = ${sumOf(n)}°` : `= ${sumOf(n)}°`], picture: { ...picture, fan: true } },
  ]
}

/** A regular polygon's outside angle: n equal turns make one full turn. `corner` carries the x. */
function outsideModel(n: number, x = 1) {
  const picture = regularPoly(n, { outside: outsideAt(n, x, 'x') })
  const every = Array.from({ length: n }, (_, k) => k === x ? 'x' : ' ')
  const e = 360 / n
  return { picture, answer: e, model: boardModel([], [
    { title: 'Walk round the shape', say: 'Walk round the outside, turning at each corner. The turn at a corner is its outside angle: from carrying straight on to the next side. Back where you started, you have turned once all the way round.', rows: ['> All the outside angles: 360°'], picture: { ...picture, outside: every, lit: 'shape' } },
    { title: 'Share 360° equally', say: `It is regular, so all ${n} turns are the same: share 360° into ${n}.`, rows: [`x = 360 ÷${n}`, `! x = ${deg(e)}`], picture: { ...picture, outside: outsideAt(n, x, deg(e)), found: [n + x] } },
  ], 'Find x', picture) }
}

/** The inside angles' sum, then x is what's left. */
function missingModel(picture: AngleFrame, x: number) {
  const n = picture.angles.length, given = picture.angles.map(Math.round).filter((_, i) => i !== x)
  const right = Math.round(picture.angles[x])
  const moves = sumMoves(picture, false)
  moves.push({ title: 'Take the others away', say: `x is what is left of ${sumOf(n)}° once the other angles are taken away.`, rows: [`x = ${sumOf(n)} ${given.map(a => `−${a}`).join(' ')}`, `! x = ${deg(right)}`], picture: { ...picture, labels: picture.labels.map((l, i) => i === x ? deg(right) : l), found: [x] } })
  return { picture, answer: right, model: boardModel([], moves, 'Find x', picture) }
}

/** Algebra: the sum, then collect the x terms and the numbers, then solve. `terms`: each angle as [x's, number]. */
function algebraModel(picture: AngleFrame, terms: [number, number][]) {
  const n = picture.angles.length
  const xs = terms.reduce((a, [k]) => a + k, 0), nums = terms.reduce((a, [, c]) => a + c, 0)
  const x = (sumOf(n) - nums) / xs
  const moves = sumMoves(picture, false)
  moves.push(
    { title: 'Add them all up', say: `Add every angle and set it equal to ${sumOf(n)}°: the x terms make ${xs}x, and the numbers make ${nums}.`, rows: [`${xs}x +${nums} = ${sumOf(n)}`], picture: { ...picture, lit: 'shape' } },
    { title: `Take away ${nums}`, say: `Take ${nums} from both sides, to leave the x terms alone.`, rows: [`${xs}x = ${sumOf(n) - nums}`], picture },
    { title: `Divide by ${xs}`, say: `Divide both sides by ${xs}. Check: put x = ${x} back into each angle, and they add to ${sumOf(n)}°.`, rows: [`! x = ${x}`], picture: { ...picture, caption: picture.labels.map((_, i) => deg(Math.round(picture.angles[i]))).join(' + ') + ` = ${sumOf(n)}°` } },
  )
  return { picture, answer: x, model: boardModel([], moves, 'Find x', picture) }
}

/* ---------- Rung 1: exterior angles ---------- */

explore(exterior, 'Drag a corner, and add or take away sides. Watch the outside angles’ total.', 'GM4 p122 Exterior angles (play)', { mode: 'exterior', start: [5] })
{
  const c = outsideModel(6)
  worked(exterior, 'This is a regular hexagon. Find the exterior angle x.', 'Exterior angles', 'GM4 p122 Exterior angles (own numbers)', c.model,
    'An exterior angle is the turn at a corner: between one side carried on and the next side. The exterior angles of any polygon add to 360°, so a regular polygon’s is 360 ÷ the number of sides.')
}
for (const [n, hint, ref] of [[5, 'Share 360° between 5 corners.', 'GM4 p122 (own numbers)'], [8, 'Share 360° between 8 corners.', 'GM4 p122 (own numbers)'], [10, '10 equal turns make 360°.', 'GM4 p122 (own numbers)']] as const) {
  const c = outsideModel(n)
  practice(exterior, `This is a regular ${NAMES[n]}. Find the exterior angle x.`, ref, c.picture, number(c.answer, deg(c.answer)), hint, c.model,
    slips(c.answer, [[180 - c.answer, `That’s the inside angle. The exterior angle is the turn, 360 ÷ ${n}.`], [sumOf(n) / n, `That’s the inside angle. The exterior angle is 360 ÷ ${n}.`], [360 * n, `Divide: 360 shared into ${n}.`]]))
}
{
  const n = 9
  const picture = regularPoly(n, { outside: outsideAt(n, 1, '40°'), families: [...blank(n).map(() => 0), ...blank(n).map(() => -1)] })
  const model = boardModel([], [
    { title: 'All the turns: 360°', say: 'However many sides it has, the exterior angles add to 360°. A regular polygon’s are all 40°.', rows: ['> 40° each, 360° in all'], picture: { ...picture, outside: Array.from({ length: n }, (_, k) => k === 1 ? '40°' : ' '), lit: 'shape' } },
    { title: 'How many 40s?', say: 'The number of sides is how many 40° turns make 360°.', rows: ['n = 360 ÷40', '! n = 9 sides'], picture: { ...picture, caption: 'A regular nonagon' } },
  ], 'Find n', picture)
  practice(exterior, 'A regular polygon has exterior angles of 40°. How many sides does it have?', 'GM4 p122 Exterior angles (working backwards)', picture, number(9, '9 sides'), 'How many 40s make 360?', model,
    slips(9, [[140, 'That’s the inside angle. How many 40° turns make 360°?'], [14400, 'Divide: 360 ÷ 40.']]), { label: 'Sides', prefix: 'n =' })
}

/* ---------- Rung 2: the interior angle sum ---------- */

explore(interior, 'Drag a corner, and add or take away sides. Watch the inside angles’ total.', 'GM4 p122 Interior angles (play)', { mode: 'interior', start: [5] })
{
  const p = poly([115, 125, 130, 110, 120, 120], { sides: [0.8, 0.8, 0.8, 0.9] })
  worked(interior, 'What do the inside angles of a hexagon add up to?', 'The interior angle sum', 'GM4 p122 Interior angles', boardModel([], sumMoves(p, true), 'Find the sum', p),
    'Cut the shape into triangles from one corner. A shape with n sides makes n − 2 triangles, so its interior angles add to (n − 2) × 180°.')
}
for (const [n, angles, sides] of [[5, [100, 112, 108, 98, 122], [0.8, 0.85, 0.85]], [8, [130, 140, 135, 125, 145, 130, 140, 135], [0.85, 0.8, 0.85, 0.8, 0.8, 0.8]]] as const) {
  const p = poly([...angles], { sides: [...sides] })
  practice(interior, `What do the interior angles of a${n === 8 ? 'n' : ''} ${NAMES[n]} add up to?`, 'GM4 p122 Interior angles', p, number(sumOf(n), deg(sumOf(n))), `${n} sides cut into ${n - 2} triangles.`, boardModel([], sumMoves(p, true), 'Find the sum', p),
    slips(sumOf(n), [[n * 180, `Not ${n} triangles: lines from one corner make ${n} − 2.`], [(n - 1) * 180, `${n} − 2 triangles, not ${n} − 1.`], [360, 'Only a quadrilateral’s add to 360°.']]), { label: 'Angle sum (°)', prefix: 'Sum =' })
}
{
  const c = missingModel(poly([110, 95, 120, 100, 115], { sides: [1.25, 1.25, 1.15], labels: ['110°', '95°', '120°', '100°', 'x'], families: [-1, -1, -1, -1, 0] }), 4)
  practice(interior, 'Find the angle marked x.', 'GM4 p123 (own numbers)', c.picture, number(c.answer, deg(c.answer)), 'A pentagon’s angles add to 540°.', c.model,
    slips(c.answer, [[c.answer + 180, 'A pentagon’s angles add to 540°, not 720°.'], [c.answer - 180, 'A pentagon’s angles add to 540°, not 360°.']]))
}
{
  const c = missingModel(poly([135, 110, 117, 125, 105, 128], { sides: [1.15, 1.25, 1.35, 1.35], labels: ['135°', '110°', 'x', '125°', '105°', '128°'], families: [-1, -1, 0, -1, -1, -1] }), 2)
  practice(interior, 'Find the angle marked x.', 'GM4 p123 (own numbers)', c.picture, number(c.answer, deg(c.answer)), 'A hexagon’s angles add to 720°.', c.model,
    slips(c.answer, [[c.answer + 180, 'A hexagon’s angles add to 720°, not 900°.']]))
}
{
  const p = poly([115, 125, 130, 110, 120, 120], { sides: [0.8, 0.8, 0.8, 0.9] })
  practice(interior, 'Mo says a hexagon’s angles add to 1080°, because 6 × 180 = 1080. What is right?', 'GM4 p122 Interior angles (a common mistake)', p, choose(
    '720°: a hexagon cuts into 4 triangles, not 6',
    ['Mo is right: 1080°', 'Lines from one corner cut a hexagon into 4 triangles, not 6.'],
    ['360°: all shapes add to 360°', 'Only quadrilaterals do. The outside angles add to 360°.'],
    ['900°: 5 triangles', 'n − 2 triangles: 6 − 2 = 4.'],
  ), 'Draw the lines from one corner and count the triangles.', boardModel([], sumMoves(p, true), 'Find the sum', p))
}

/* ---------- Rung 3: a regular polygon's interior angle ---------- */

{
  const n = 5, picture = regularPoly(n, { labels: ['', 'x', '', '', ''] })
  worked(regularTopic, 'This is a regular pentagon. Find the interior angle x.', 'Regular polygons', 'GM4 p123 Q1 (the method)', boardModel([], [
    ...sumMoves(picture, false),
    { title: 'Share it equally', say: 'It is regular, so all 5 angles are the same: share 540° into 5.', rows: ['x = 540 ÷5', '! x = 108°'], picture: { ...picture, labels: ['', '108°', '', '', ''], found: [1] } },
  ], 'Find x', picture), 'A regular polygon’s angles are all equal: its interior angle is the sum shared equally between the corners.')
}
{
  const n = 5, picture = regularPoly(n, { labels: ['', 'x', '', '', ''], outside: outsideAt(n, 1, '') })
  worked(regularTopic, 'This is a regular pentagon. Find the interior angle x another way.', 'Or use the exterior angle', 'GM4 p122 (interior + exterior = 180°)', boardModel([], [
    { title: 'The exterior angle', say: 'The exterior angles make 360°, and there are 5 equal ones.', rows: ['e = 360 ÷5', '= 72°'], picture: { ...picture, outside: outsideAt(n, 1, '72°'), found: [n + 1] } },
    { title: 'A straight line', say: 'At each corner the interior and exterior angles sit on a straight line, so they add to 180°.', rows: ['x = 180 −72', '! x = 108°'], picture: { ...picture, labels: ['', '108°', '', '', ''], outside: outsideAt(n, 1, '72°'), boxed: [n + 1], found: [1] } },
  ], 'Find x', picture), 'Interior and exterior angles at a corner add to 180°. So a regular polygon’s interior angle is 180° − 360 ÷ n.')
}
for (const [n, hint] of [[8, 'An octagon’s angles add to 1080°.'], [10, 'Find the exterior angle first, then 180° take it away.'], [9, 'Share the sum, 1260°, between 9 corners.']] as const) {
  const picture = regularPoly(n, { labels: Array.from({ length: n }, (_, k) => k === 1 ? 'x' : '') })
  const x = sumOf(n) / n
  const model = boardModel([], [
    ...sumMoves(picture, false),
    { title: 'Share it equally', say: `It is regular, so all ${n} angles are the same: share ${sumOf(n)}° into ${n}.`, rows: [`x = ${sumOf(n)} ÷${n}`, `! x = ${deg(x)}`], picture: { ...picture, labels: picture.labels.map(l => l ? deg(x) : l), found: [1] } },
  ], 'Find x', picture)
  practice(regularTopic, `This is a regular ${NAMES[n]}. Find the interior angle x.`, 'GM4 p123 Q2 (own numbers)', picture, number(x, deg(x)), hint, model,
    slips(x, [[360 / n, `That’s the exterior angle. The interior angle is 180° − ${360 / n}°.`], [sumOf(n), `That’s all ${n} angles together. Share it equally.`]]))
}
{
  const n = 6, picture = regularPoly(n, { labels: ['', 'x', '', '', '', ''], outside: outsideAt(n, 1, '60°'), families: [0, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1] })
  practice(regularTopic, 'This regular hexagon’s exterior angle is 60°. Find the interior angle x.', 'GM4 p122 (interior + exterior = 180°)', picture, number(120, '120°'), 'They sit on a straight line.', boardModel([], [
    { title: 'A straight line', say: 'The interior and exterior angles at a corner sit on a straight line, so they add to 180°.', rows: ['x = 180 −60', '! x = 120°'], picture: { ...picture, labels: ['', '120°', '', '', '', ''], boxed: [n + 1], found: [1] } },
  ], 'Find x', picture), slips(120, [[60, 'They aren’t equal: on a straight line they add to 180°.'], [300, '180 is the total on a straight line.']]))
}

/* ---------- Rung 4: missing angles and algebra ---------- */

{
  const p = poly([80, 95, 70, 115], { sides: [1.2, 1.1], labels: ['80°', '95°', '', 'x'], outside: outsideAt(4, 2, '110°'), families: [-1, -1, 0, 0, -1, -1, -1, -1] })
  worked(algebra, 'Find the angle marked x.', 'Using an exterior angle', 'GM4 p122 Example (own numbers)', boardModel([], [
    { title: 'Inside from outside', say: 'The exterior angle and the interior angle at that corner make a straight line: 180°.', rows: ['a = 180 −110', '= 70°'], picture: { ...p, labels: ['80°', '95°', '70°', 'x'], boxed: [6], found: [2] } },
    { title: 'Quadrilateral: 360°', say: 'A quadrilateral cuts into 2 triangles, so its angles add to 360°. Take the other three away.', rows: ['x = 360 −80 −95 −70', '! x = 115°'], picture: { ...p, labels: ['80°', '95°', '70°', '115°'], boxed: [0, 1, 2], found: [3] } },
  ], 'Find x', p), 'When a question gives an exterior angle, turn it into the interior angle first: 180° take it away.')
}
{
  const p = poly([100, 100, 110, 120, 110], { sides: [1.35, 1.35, 1.05], labels: ['2x', 'x + 50', 'x + 60', '120°', '110°'], families: [0, 0, 0, -1, -1] })
  worked(algebra, 'Find x.', 'Algebra in a polygon', 'GM4 p123 Q3 (own numbers)', algebraModel(p, [[2, 0], [1, 50], [1, 60], [0, 120], [0, 110]]).model,
    'Angles written with x still add to the shape’s total. Add them all, set it equal to the sum, and solve.')
}
{
  const c = algebraModel(poly([60, 120, 100, 80], { sides: [1.25, 1.1], labels: ['x', '2x', '100°', '80°'], families: [0, 0, -1, -1] }), [[1, 0], [2, 0], [0, 100], [0, 80]])
  practice(algebra, 'Find x.', 'GM4 p123 Q4 (own numbers)', c.picture, number(c.answer, String(c.answer)), 'The four angles add to 360°: 3x + 180 = 360.', c.model,
    slips(c.answer, [[120, 'That’s 2x. x is half of it.'], [180, 'That’s 3x. Divide by 3.']]), { prefix: 'x =' })
}
{
  const c = algebraModel(poly([110, 90, 120, 120, 100], { sides: [0.9, 0.85, 0.7], labels: ['x + 50', 'x + 30', '2x', '120°', '100°'], families: [0, 0, 0, -1, -1] }), [[1, 50], [1, 30], [2, 0], [0, 120], [0, 100]])
  practice(algebra, 'Find x.', 'GM4 p123 Q3 (own numbers)', c.picture, number(c.answer, String(c.answer)), 'A pentagon’s angles add to 540°: 4x + 300 = 540.', c.model,
    slips(c.answer, [[240, 'That’s 4x. Divide by 4.'], [110, 'That’s x + 50. x is 50 less.'], [120, 'That’s 2x. x is half of it.']]), { prefix: 'x =' })
}
{
  const c = algebraModel(poly([124, 122, 117, 120, 112, 125], { sides: [0.75, 0.75, 0.85, 0.85], labels: ['2x', 'x + 60', 'x + 55', '120°', 'x + 50', '125°'], families: [0, 0, 0, -1, 0, -1] }), [[2, 0], [1, 60], [1, 55], [0, 120], [1, 50], [0, 125]])
  practice(algebra, 'Find x.', 'GM4 p123 Q3 (own numbers)', c.picture, number(c.answer, String(c.answer)), 'A hexagon’s angles add to 720°.', c.model,
    slips(c.answer, [[310, 'That’s 5x. Divide by 5.'], [124, 'That’s 2x. x is half of it.']]), { prefix: 'x =' })
}
{
  const p = poly([76, 101, 70, 113], { sides: [1.2, 1.1], labels: ['76°', '101°', '', 'x'], outside: outsideAt(4, 2, '110°'), families: [-1, -1, 0, 0, -1, -1, -1, -1] })
  practice(algebra, 'Find the angle marked x.', 'GM4 p122 Example (own numbers)', p, number(113, '113°'), 'Turn the exterior angle into the interior angle first.', boardModel([], [
    { title: 'Inside from outside', say: 'The exterior and interior angles at that corner make a straight line: 180°.', rows: ['a = 180 −110', '= 70°'], picture: { ...p, labels: ['76°', '101°', '70°', 'x'], boxed: [6], found: [2] } },
    { title: 'Quadrilateral: 360°', say: 'The four inside angles add to 360°. Take the other three away.', rows: ['x = 360 −76 −101 −70', '! x = 113°'], picture: { ...p, labels: ['76°', '101°', '70°', '113°'], boxed: [0, 1, 2], found: [3] } },
  ], 'Find x', p), slips(113, [[73, 'Use the interior angle, 180 − 110 = 70°, not the exterior one.']]))
}

add('mixed', 'Interior and exterior angles', 'GM4 consolidation', text(
  'Exterior angles of any polygon add to 360°. A regular polygon’s exterior angle is 360 ÷ n.',
  'Interior angles add to (n − 2) × 180°: a shape with n sides cuts into n − 2 triangles.',
  'A regular polygon’s interior angle is the sum ÷ n, or 180° − the exterior angle.',
  'Interior and exterior angles at a corner add to 180°.',
  'With algebra: add every angle, set it equal to the sum, and solve.',
))

export const tutorPolygonAnglesLesson: TutorMethodLesson = {
  id: 'L204', number: 204, title: 'Interior and exterior angles', level: 'GCSE Foundation',
  goal: 'Use the exterior angle sum (360°) and the interior angle sum ((n − 2) × 180°) to find angles in polygons, regular or not, including with algebra.',
  labels: { [exterior]: 'Exterior angles', [interior]: 'Interior angle sum', [regularTopic]: 'Regular polygons', [algebra]: 'Missing angles', mixed: 'Review' },
  states: finish(),
}
