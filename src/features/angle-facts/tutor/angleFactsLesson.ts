import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { AngleFrame } from '../../written-methods/tutor/methodWorking'
import type { AngleBoardSpec } from '../../written-methods/tutor/AngleBoard'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { boardModel, choose, number, text, type BoardMove } from '../../simultaneous-equations/tutor/boardWorkings'

/*
 * Geometry lesson 1: Angle facts. From GM1 in Sunny's revision book (p116–117, "The 5 simple rules"), with our own
 * numbers; the storyboard is /mnt/project-files/lessons/geometry/L1-angle-facts/STORYBOARD.md. Four rungs, easiest
 * first: straight lines and points; triangles and quadrilaterals; isosceles triangles; two facts in a row.
 * Brilliant-style (Sunny, 9 Oct: interactive, factual, step by step): each rung opens with a play screen on the angle
 * board (AngleBoard.tsx), where the angles change as you drag and the total doesn't. Every question has its own angle
 * picture, drawn to its angles, and its working names the fact, then does one move a step, lighting up in purple the
 * part of the picture that step uses. As in the book, students give the reason: each rung asks which fact to use.
 *
 * Hidden on live: it is not in the course registry, so no curriculum, contents, search, cards or practice show it. It
 * opens only on the unlisted Geometry shelf (src/features/geometry/geometryLessons.ts). Geometry lessons are numbered
 * from 201 while they are hidden, clear of Aniksha's lessons and the Graphs shelf.
 */

const { add, finish } = author(201)
const linesPoints = 'geometry-lines-points'
const shapes = 'geometry-shapes'
const isosceles = 'geometry-isosceles'
const twoSteps = 'geometry-two-steps'

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
/** A play screen: the angle board with no right answer, and one sentence to do. */
function explore(topic: MicroSkillId, title: string, sourceRef: string, spec: AngleBoardSpec) {
  const state = add(topic, title, sourceRef, text(title))
  state.angleBoard = spec
}
function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: TutorWorking, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  state.content.heading = heading
  return state
}
/** A question under its own angle picture; its working one move a step. */
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
const sum = (ns: number[]) => ns.reduce((total, n) => total + n, 0)

/* ---------- Workings ---------- */

type Fact = { name: string; total: 180 | 360; lit: AngleFrame['lit']; spot: string; say: string }
const FACTS = {
  line: { name: 'Angles on a straight line add to 180°', total: 180, lit: 'line', spot: 'A straight line', say: 'The angles sit side by side on a straight line: half a turn. Angles on a straight line add to 180°.' },
  point: { name: 'Angles around a point add to 360°', total: 360, lit: 'turn', spot: 'Around a point', say: 'The angles go all the way round the point: a full turn. Angles around a point add to 360°.' },
  triangle: { name: 'Angles in a triangle add to 180°', total: 180, lit: 'shape', spot: 'A triangle', say: 'These are the three angles inside a triangle. Angles in a triangle add to 180°.' },
  quad: { name: 'Angles in a quadrilateral add to 360°', total: 360, lit: 'shape', spot: 'A quadrilateral', say: 'These are the four angles inside a quadrilateral (4 sides). Angles in a quadrilateral add to 360°.' },
} satisfies Record<string, Fact>

/**
 * One fact, one missing angle: spot the fact (that part of the picture purple), add the angles you know, take them from
 * the total, and the answer (green, in the picture too). `x` is the missing angle's place in the picture's labels.
 */
function factModel(fact: Fact, picture: AngleFrame, x: number, label = 'Find x') {
  const known = picture.labels.flatMap((l, i) => i !== x && l.endsWith('°') ? [{ i, n: Number(l.replace('°', '')) }] : [])
  const given = sum(known.map(k => k.n)), answer = fact.total - given
  const boxed = known.map(k => k.i)
  const moves: BoardMove[] = [{ title: fact.spot, say: fact.say, rows: [`> ${fact.name}`], picture: { ...picture, lit: fact.lit } }]
  if (known.length > 1) moves.push({ title: 'Add what you know', say: 'Add up the angles you are given.', rows: [`${known.map(k => k.n).join(' +')} = ${given}`], picture: { ...picture, boxed } })
  moves.push({ title: `Take it from ${fact.total}`, say: `What’s left of the ${fact.total}° is the missing angle.`, rows: [`x = ${fact.total} −${given}`], picture: { ...picture, boxed } })
  moves.push({ title: 'The answer', say: `${fact.name}, so x is ${answer}°.`, rows: [`! x = ${deg(answer)}`], picture: { ...picture, labels: picture.labels.map((l, i) => i === x ? deg(answer) : l), found: [x] } })
  return { model: boardModel([], moves, label, picture), answer }
}

/** The usual slips with one fact: the wrong total (180 for 360, or 360 for 180), or the known angles added and left there. */
function factSlips(fact: Fact, picture: AngleFrame, x: number) {
  const known = sum(picture.labels.flatMap((l, i) => i !== x && l.endsWith('°') ? [Number(l.replace('°', ''))] : []))
  const other = fact.total === 180 ? 360 : 180
  return slips(fact.total - known, [
    [other - known, fact.total === 180 ? `${fact.spot === 'A triangle' ? 'A triangle is' : 'A straight line is'} 180°, not 360°.` : `${fact.spot === 'Around a point' ? 'Around a point is a full turn' : 'A quadrilateral is two triangles'}: 360°, not 180°.`],
    [known, `That’s the angles you know, added up. Take them from ${fact.total}°.`],
  ])
}

/** A question with one fact: the picture, its working and its slips. */
function oneFact(topic: MicroSkillId, fact: Fact, picture: AngleFrame, x: number, sourceRef: string, hint: string) {
  const { model, answer } = factModel(fact, picture, x)
  return practice(topic, 'Find the angle marked x.', sourceRef, picture, number(answer, deg(answer)), hint, model, factSlips(fact, picture, x))
}

/** Which fact? A question under the picture, the right fact first. */
const WRONG_FACT: Record<keyof typeof FACTS, [string, string]> = {
  line: [FACTS.line.name, 'Look for a straight line through the angles: there isn’t one here.'],
  point: [FACTS.point.name, 'Around a point, the angles go all the way round. These don’t.'],
  triangle: [FACTS.triangle.name, 'Count the sides: a triangle has 3.'],
  quad: [FACTS.quad.name, 'Count the sides: a quadrilateral has 4.'],
}
function whichFact(topic: MicroSkillId, title: string, sourceRef: string, picture: AngleFrame, right: keyof typeof FACTS, hint: string, model: TutorWorking) {
  const wrong = (Object.keys(FACTS) as (keyof typeof FACTS)[]).filter(k => k !== right).map(k => WRONG_FACT[k])
  return practice(topic, title, sourceRef, picture, choose(FACTS[right].name, ...wrong), hint, model)
}

/* ---------- Rung 1: straight lines and points ---------- */

explore(linesPoints, 'Drag the line. Watch the two angles.', 'GM1 p116 Rule 3 (play)', { mode: 'line', start: [60] })
explore(linesPoints, 'Now drag the lines round the point.', 'GM1 p116 Rule 4 (play)', { mode: 'point', start: [20, 140, 250] })
{
  const picture: AngleFrame = { shape: 'line', angles: [128], labels: ['128°', 'x'], families: [-1, 0] }
  worked(linesPoints, 'Find the angle marked x.', 'Angles on a straight line', 'GM1 p116 Rule 3 (own numbers)', factModel(FACTS.line, picture, 1).model,
    'Angles on a straight line add to 180°: half a turn.')
}
{
  const picture: AngleFrame = { shape: 'point', angles: [140, 95, 70], labels: ['140°', '95°', '70°', 'x'], families: [-1, -1, -1, 0], turn: 20 }
  worked(linesPoints, 'Find the angle marked x.', 'Angles around a point', 'GM1 p116 Rule 4 (own numbers)', factModel(FACTS.point, picture, 3).model,
    'Angles around a point add to 360°: a full turn.')
}
oneFact(linesPoints, FACTS.line, { shape: 'line', angles: [63], labels: ['x', '117°'], families: [0, -1] }, 0, 'GM1 p117 Q1 (own numbers)', 'The two angles are on a straight line.')
oneFact(linesPoints, FACTS.line, { shape: 'line', angles: [34, 57, 89], labels: ['34°', 'x', '89°'], families: [-1, 0, -1] }, 1, 'GM1 p117 Q1 (own numbers)', 'All three angles sit on the straight line. Add the two you know first.')
oneFact(linesPoints, FACTS.point, { shape: 'point', angles: [150, 130, 80], labels: ['150°', '130°', 'x'], families: [-1, -1, 0], turn: 40 }, 2, 'GM1 p117 Q2 (own numbers)', 'The angles go all the way round the point.')
oneFact(linesPoints, FACTS.point, { shape: 'point', angles: [85, 110, 90, 75], labels: ['85°', '110°', '90°', 'x'], families: [-1, -1, -1, 0], turn: 10 }, 3, 'GM1 p117 Q2 (own numbers)', 'Add the three angles you know, then take them from 360°.')
{
  const picture: AngleFrame = { shape: 'point', angles: [105, 120, 60, 75], labels: ['105°', '120°', '60°', 'x'], families: [-1, -1, -1, 0], turn: 30 }
  whichFact(linesPoints, 'Four angles meet at a point. Which fact finds x?', 'GM1 p117 Q2 (give a reason)', picture, 'point', 'Do the angles go halfway round, or all the way?', factModel(FACTS.point, picture, 3).model)
}
{
  const picture: AngleFrame = { shape: 'point', angles: [100, 120, 140], labels: ['100°', '120°', 'x'], families: [-1, -1, 0], turn: 30 }
  practice(linesPoints, 'Three angles meet at a point. Ali says x = 180 − 100 − 120 = −40°. What went wrong?', 'GM1 p116 Rule 4 (a common mistake)', picture, choose(
    'Around a point is a full turn, 360°, so x = 140°',
    ['Nothing: x = −40°', 'An angle can’t be negative. Around a point the angles make 360°.'],
    ['Ali should add them: x = 220°', 'Add the angles you know, then take them from 360°.'],
    ['x = 40°: just drop the minus', 'Around a point the total is 360°: 360 − 220 is 140.'],
  ), 'Is a point half a turn or a full turn?', factModel(FACTS.point, picture, 2).model)
}

/* ---------- Rung 2: triangles and quadrilaterals ---------- */

explore(shapes, 'Drag the top corner. Watch the three angles.', 'GM1 p116 Rule 1 (play)', { mode: 'triangle', start: [62, 50] })
explore(shapes, 'Now drag a corner of the quadrilateral.', 'GM1 p116 Rule 2 (play)', { mode: 'quad', start: [70, 60] })
{
  const picture: AngleFrame = { shape: 'triangle', angles: [52, 73], labels: ['52°', '73°', 'x'], families: [-1, -1, 0] }
  worked(shapes, 'Find the angle marked x.', 'Angles in a triangle', 'GM1 p116 Example 1 (own numbers)', factModel(FACTS.triangle, picture, 2).model,
    'Angles in a triangle add to 180°.')
}
{
  const picture: AngleFrame = { shape: 'quad', angles: [95, 110, 70, 85], labels: ['95°', '110°', '70°', 'x'], families: [-1, -1, -1, 0] }
  worked(shapes, 'Find the angle marked x.', 'Angles in a quadrilateral', 'GM1 p116 Rule 2 (own numbers)', factModel(FACTS.quad, picture, 3).model,
    'Angles in a quadrilateral add to 360°: a diagonal cuts it into two triangles, 2 × 180°.')
}
oneFact(shapes, FACTS.triangle, { shape: 'triangle', angles: [38, 38], labels: ['38°', 'x', '104°'], families: [-1, 0, -1] }, 1, 'GM1 p116 Example 1 (own numbers)', 'The three angles inside a triangle add to 180°.')
oneFact(shapes, FACTS.triangle, { shape: 'triangle', angles: [90, 27], labels: ['90°', '27°', 'x'], families: [-1, -1, 0] }, 2, 'GM1 p116 Rule 1 (own numbers)', 'The square in the corner is a right angle: 90°.')
oneFact(shapes, FACTS.quad, { shape: 'quad', angles: [120, 80, 65, 95], labels: ['120°', '80°', '65°', 'x'], families: [-1, -1, -1, 0] }, 3, 'GM1 p116 Rule 2 (own numbers)', 'A quadrilateral has 4 angles, and they add to 360°.')
oneFact(shapes, FACTS.quad, { shape: 'quad', angles: [90, 90, 112, 68], labels: ['90°', '90°', '112°', 'x'], families: [-1, -1, -1, 0] }, 3, 'GM1 p116 Rule 2 (own numbers)', 'Each square corner is 90°.')
{
  const picture: AngleFrame = { shape: 'quad', angles: [85, 100, 75, 100], labels: ['85°', '100°', '75°', 'x'], families: [-1, -1, -1, 0] }
  whichFact(shapes, 'Which fact finds x?', 'GM1 p116 Rule 2 (give a reason)', picture, 'quad', 'Count the sides of the shape.', factModel(FACTS.quad, picture, 3).model)
}
{
  const picture: AngleFrame = { shape: 'quad', angles: [80, 95, 105, 80], labels: ['', '', '', ''], split: true }
  practice(shapes, 'Why do the angles in a quadrilateral add to 360°?', 'GM1 p116 Rule 2 (why)', picture, choose(
    'A diagonal cuts it into two triangles: 2 × 180°',
    ['It has 4 corners, and 4 × 90° is 360°', 'Only a rectangle has four 90° corners. The total is 360° for every quadrilateral.'],
    ['A full turn is 360°', 'That’s angles around a point. Inside a shape, count the triangles.'],
    ['It has 4 sides, and 4 × 180° is 720°', 'One diagonal makes two triangles, not four.'],
  ), 'Look at the diagonal. How many triangles does it make?', boardModel([], [
    { title: 'Cut it into triangles', say: 'One diagonal cuts a quadrilateral into two triangles.', rows: ['> Two triangles'], picture },
    { title: 'Add the two triangles', say: 'Each triangle’s angles add to 180°, and together they make the quadrilateral’s angles.', rows: ['2 ×180 = 360', '! 360°'] },
  ], 'Explain', picture))
}

/* ---------- Rung 3: isosceles triangles ---------- */

/**
 * An isosceles triangle with its top angle given: the ticks show the two equal sides, so the two base angles are equal
 * (both x); take the top from 180; halve what's left.
 */
function topGiven(top: number, xOnLeft = true) {
  const base = (180 - top) / 2
  const picture: AngleFrame = { shape: 'triangle', angles: [base, base], equal: true, labels: xOnLeft ? ['x', '', deg(top)] : ['', 'x', deg(top)], families: [0, 0, -1] }
  const both: AngleFrame = { ...picture, labels: ['x', 'x', deg(top)] }
  const model = boardModel([], [
    { title: 'Spot the equal sides', say: 'The ticks show the two equal sides. The angles at their feet, the base angles, are equal: both are x.', rows: ['> Base angles are equal: both x'], picture: { ...both, lit: 'sides' } },
    { title: 'Angles in a triangle', say: 'The three angles add to 180°.', rows: [`x +x +${top} = 180`], picture: { ...both, lit: 'shape' } },
    { title: `Take away ${top}`, say: 'Take the top angle from 180°. What’s left is shared by the two base angles.', rows: [`2x = ${180 - top}`], picture: { ...both, boxed: [2] } },
    { title: 'Halve it', say: `The two base angles share ${180 - top}° equally.`, rows: [`! x = ${deg(base)}`], picture: { ...both, labels: [deg(base), deg(base), deg(top)], found: [0, 1] } },
  ], 'Find x', picture)
  return { picture, model, answer: base, slips: slips(base, [[180 - top, 'That’s what the two base angles share. Halve it.'], [top, 'The top angle is the odd one out. The equal angles are at the feet of the equal sides.'], [180 - 2 * top, 'The top angle is the odd one out. Here the two equal angles are at the bottom.']]) }
}
/** An isosceles triangle with a base angle given: the other base angle is the same; take both from 180. */
function baseGiven(base: number, onLeft = true) {
  const top = 180 - 2 * base
  const picture: AngleFrame = { shape: 'triangle', angles: [base, base], equal: true, labels: onLeft ? [deg(base), '', 'x'] : ['', deg(base), 'x'], families: [-1, -1, 0] }
  const both: AngleFrame = { ...picture, labels: [deg(base), deg(base), 'x'] }
  const model = boardModel([], [
    { title: 'Spot the equal sides', say: `The ticks show the two equal sides. The base angles at their feet are equal, so the other one is ${base}° too.`, rows: [`> Base angles are equal: both ${deg(base)}`], picture: { ...both, lit: 'sides', boxed: [onLeft ? 1 : 0] } },
    { title: 'Angles in a triangle', say: 'The three angles add to 180°. Take both base angles away.', rows: [`x = 180 −${base} −${base}`], picture: { ...both, lit: 'shape', boxed: [0, 1] } },
    { title: 'The answer', say: `So the top angle is ${top}°.`, rows: [`! x = ${deg(top)}`], picture: { ...both, labels: [deg(base), deg(base), deg(top)], found: [2] } },
  ], 'Find x', picture)
  return { picture, model, answer: top, slips: slips(top, [[180 - base, 'Both base angles are equal: take away two of them.'], [base, 'The top angle is the odd one out. The base angles are the equal pair.'], [(180 - base) / 2, 'The given angle is a base angle, so the other base angle is the same. Take both from 180°.']]) }
}

explore(isosceles, 'Drag the top corner. Watch the two base angles.', 'GM1 p116 Rule 5 (play)', { mode: 'isosceles', start: [65] })
worked(isosceles, 'The triangle is isosceles. Find the angle marked x.', 'Isosceles: a base angle given', 'GM1 p116 Rule 5 (own numbers)', baseGiven(68).model,
  'Isosceles means two equal sides, marked with ticks. The two base angles, at the feet of the equal sides, are equal.')
worked(isosceles, 'The triangle is isosceles. Find the angle marked x.', 'Isosceles: the top angle given', 'GM1 p116 Example 2 (own numbers)', topGiven(40).model,
  'With the top angle given, take it from 180°, then halve what’s left: the two base angles share it.')
for (const [q, ref, hint] of [
  [baseGiven(72), 'GM1 p117 Q3 (own numbers)', 'The other base angle is 72° too.'],
  [topGiven(64, false), 'GM1 p117 Q4 (own numbers)', 'Take 64° from 180°, then share what’s left between the two base angles.'],
  [topGiven(35), 'GM1 p117 Q4 (own numbers)', 'Take 35° from 180°, then halve it. The answer can be a half.'],
  [baseGiven(45, false), 'GM1 p117 Q3 (own numbers)', 'Both base angles are 45°.'],
] as const) practice(isosceles, 'The triangle is isosceles. Find the angle marked x.', ref, q.picture, number(q.answer, deg(q.answer)), hint, q.model, q.slips)
{
  const q = topGiven(50)
  practice(isosceles, 'The triangle is isosceles and its top angle is 50°. Jo says the other two angles are 50° and 80°. What is right?', 'GM1 p116 Rule 5 (a common mistake)', q.picture, choose(
    'They are both 65°: the base angles are equal',
    ['Jo is right', 'The ticks show the sides from the top are equal, so the two base angles match. 50° is the top.'],
    ['They are both 50°', 'Then the angles would add to 150°, not 180°.'],
    ['They are both 130°', '130° is what the two base angles share. Halve it.'],
  ), 'Which two angles are at the feet of the equal sides?', q.model)
}
{
  const q = baseGiven(70)
  practice(isosceles, 'Why is the other base angle also 70°?', 'GM1 p117 Q3 (give a reason)', q.picture, choose(
    'The two sides marked with ticks are equal, so the base angles are equal',
    ['Angles in a triangle add to 180°', 'True, but that finds the last angle. The ticks tell you two angles match.'],
    ['Angles on a straight line add to 180°', 'There’s no straight line through the base angles.'],
    ['Every triangle has two equal angles', 'Only an isosceles triangle does: the ticks show it.'],
  ), 'What do the tick marks show?', q.model)
}

/* ---------- Rung 4: two facts in a row ---------- */

/**
 * A triangle whose base carries on past the right corner (the book's Q5): the inside angle at that corner and the
 * outside one share a straight line, and the triangle's three angles add to 180. Line first, then triangle, or the
 * other way round.
 */
function lineThenTriangle(left: number, outside: number, labels: [string, string, string, string], families: number[]) {
  const inside = 180 - outside, top = 180 - left - inside
  const picture: AngleFrame = { shape: 'exterior', angles: [left, inside], labels, families }
  const model = boardModel([], [
    { title: 'A straight line first', say: 'The base carries on as a straight line, so x and the outside angle add to 180°.', rows: ['> Angles on a straight line add to 180°'], picture: { ...picture, lit: 'line', boxed: [3] } },
    { title: 'Find x', say: `Take the outside angle from 180°: x is ${inside}°.`, rows: [`x = 180 −${outside}`, `= ${inside}`], picture: { ...picture, labels: [labels[0], deg(inside), labels[2], labels[3]], found: [1] } },
    { title: 'Then the triangle', say: 'Now you know two angles in the triangle, and the three add to 180°.', rows: ['> Angles in a triangle add to 180°'], picture: { ...picture, labels: [labels[0], deg(inside), labels[2], labels[3]], lit: 'shape', boxed: [0, 1] } },
    { title: 'Find y', say: `Take both from 180°: y is ${top}°.`, rows: [`y = 180 −${left} −${inside}`, `! y = ${deg(top)}`], picture: { ...picture, labels: [labels[0], deg(inside), deg(top), labels[3]], found: [2] } },
  ], 'Find y', picture)
  return { picture, model, answer: top, slips: slips(top, [[inside, `That’s x. Now use it in the triangle to find y.`], [180 - left, 'Take x away too: the triangle’s three angles add to 180°.']]) }
}

{
  const q = lineThenTriangle(35, 130, ['35°', 'x', 'y', '130°'], [-1, 0, 0, -1])
  worked(twoSteps, 'The base is a straight line. Find the angle marked y.', 'Two facts in a row', 'GM1 p117 Q5 (own numbers)', q.model,
    'When one fact isn’t enough, find the angle you can, then use it with a second fact. Say the reason each time.')
}
{
  const q = lineThenTriangle(48, 112, ['48°', 'x', 'y', '112°'], [-1, 0, 0, -1])
  const s = practice(twoSteps, 'The base is a straight line. Find the angle marked y.', 'GM1 p117 Q5 (own numbers)', q.picture, number(q.answer, deg(q.answer)), 'Find x on the straight line first. Then use the triangle.', q.model, q.slips)
  s.answerPrefix = 'y ='
}
{
  // Isosceles, with the outside angle at a base corner: the straight line gives that base angle, the ticks give the other.
  const outside = 140, base = 180 - outside, top = 180 - 2 * base
  const picture: AngleFrame = { shape: 'exterior', angles: [base, base], equal: true, labels: ['', 'x', 'y', deg(outside)], families: [0, 0, 0, -1] }
  const model = boardModel([], [
    { title: 'A straight line first', say: 'x and the outside angle sit on the straight line, so they add to 180°.', rows: [`x = 180 −${outside}`, `= ${base}`], picture: { ...picture, lit: 'line', boxed: [3] } },
    { title: 'Spot the equal sides', say: `The ticks show the triangle is isosceles, so the other base angle is ${base}° too.`, rows: [`> Base angles are equal: both ${deg(base)}`], picture: { ...picture, labels: [deg(base), deg(base), 'y', deg(outside)], lit: 'sides' } },
    { title: 'Then the triangle', say: `The three angles add to 180°. Take both base angles away: y is ${top}°.`, rows: [`y = 180 −${base} −${base}`, `! y = ${deg(top)}`], picture: { ...picture, labels: [deg(base), deg(base), deg(top), deg(outside)], found: [2] } },
  ], 'Find y', picture)
  const s = practice(twoSteps, 'The triangle is isosceles and its base is a straight line. Find the angle marked y.', 'GM1 p117 Q4 + Q5 (own numbers)', picture, number(top, deg(top)), 'The straight line gives x. The ticks tell you the other base angle.', model,
    slips(top, [[base, 'That’s x, a base angle. Now find y, the top.'], [180 - base, 'Both base angles are 40°: take away two of them.']]))
  s.answerPrefix = 'y ='
}
{
  // The other way round: the triangle first, then the straight line.
  const left = 58, topAngle = 70, inside = 180 - left - topAngle, outside = 180 - inside
  const picture: AngleFrame = { shape: 'exterior', angles: [left, inside], labels: [deg(left), 'x', deg(topAngle), 'y'], families: [-1, 0, -1, 0] }
  const model = boardModel([], [
    { title: 'The triangle first', say: 'Two angles of the triangle are given, and the three add to 180°.', rows: [`x = 180 −${left} −${topAngle}`, `= ${inside}`], picture: { ...picture, lit: 'shape', boxed: [0, 2] } },
    { title: 'Then the straight line', say: 'x and y sit side by side on the straight line, so they add to 180°.', rows: [`y = 180 −${inside}`], picture: { ...picture, labels: [deg(left), deg(inside), deg(topAngle), 'y'], lit: 'line', boxed: [1] } },
    { title: 'The answer', say: `So y is ${outside}°. It’s the same as the two far angles added: ${left} and ${topAngle}.`, rows: [`! y = ${deg(outside)}`], picture: { ...picture, labels: [deg(left), deg(inside), deg(topAngle), deg(outside)], found: [3] } },
  ], 'Find y', picture)
  const s = practice(twoSteps, 'The base is a straight line. Find the angle marked y.', 'GM1 p117 Q5 (own numbers)', picture, number(outside, deg(outside)), 'This time the triangle comes first: find x, then use the straight line.', model,
    slips(outside, [[inside, 'That’s x. y is next to it on the straight line.'], [180 - left, 'Find x in the triangle first, using both angles you know.']]))
  s.answerPrefix = 'y ='
}
{
  const q = lineThenTriangle(40, 125, ['40°', 'x', 'y', '125°'], [-1, 0, 0, -1])
  practice(twoSteps, 'Which two facts find y, in order?', 'GM1 p117 Q5 (give a reason)', q.picture, choose(
    'Angles on a straight line, then angles in a triangle',
    ['Angles in a triangle, then angles on a straight line', 'The triangle has only one angle you know until you find x on the line.'],
    ['Angles around a point, then angles in a triangle', 'The angles at the corner are half a turn: a straight line, not a full turn.'],
    ['Only angles in a triangle', 'One fact isn’t enough: x is missing until you use the straight line.'],
  ), 'Which angle can you find first?', q.model)
}

add('mixed', 'Angle facts', 'GM1 consolidation', text(
  'Angles on a straight line add to 180°, and angles around a point add to 360°.',
  'Angles in a triangle add to 180°, and angles in a quadrilateral add to 360°.',
  'An isosceles triangle has two equal sides, marked with ticks. The base angles at their feet are equal.',
  'When one fact isn’t enough, find what you can, then use a second fact. Give the reason for each step.',
))

export const tutorAngleFactsLesson: TutorMethodLesson = {
  id: 'L201', number: 201, title: 'Angle facts', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Find missing angles on a straight line, around a point, in triangles and quadrilaterals and in isosceles triangles, giving the reason each time.',
  labels: { [linesPoints]: 'Lines and points', [shapes]: 'Triangles and quadrilaterals', [isosceles]: 'Isosceles triangles', [twoSteps]: 'Two facts in a row', mixed: 'Review' },
  states: finish(),
}
