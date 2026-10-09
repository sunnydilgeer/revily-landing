import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { AngleFrame } from '../../written-methods/tutor/methodWorking'
import type { AngleBoardSpec } from '../../written-methods/tutor/AngleBoard'
import { placeSize } from '../../written-methods/tutor/AnglePictures'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { boardModel, choose, number, text, type BoardMove } from '../../simultaneous-equations/tutor/boardWorkings'

/*
 * Geometry lesson 2: Angles in parallel lines. From GM2 in Sunny's revision book (p118–119, "4 simple rules"), with our
 * own numbers. Four rungs: vertically opposite angles; corresponding (F) and alternate (Z) angles; allied angles (C),
 * which add to 180°; and two rules in a row, naming each one, as the book's questions ask. Built like lesson 1 (Sunny,
 * 9 Oct: "the same way"): each rung opens with a play screen on the angle board, where you tilt the crossing line and
 * the lit pair stays equal (or keeps adding to 180°). Every question has its own picture; its working names the rule at
 * each step and draws that rule's letter (F, Z or C) over the lines in purple.
 *
 * Hidden on live like lesson 1: only the unlisted Geometry shelf (src/features/geometry/geometryLessons.ts) opens it.
 *
 * Places: an angle's place is 0–7 (AngleFrame, methodWorking.ts): at the top crossing 0 above right, 1 above left,
 * 2 below left, 3 below right; the bottom crossing the same, 4–7. Places 0 and 2 are the crossing line's angle t, and 1
 * and 3 are 180 − t, so each answer comes from the picture itself.
 */

const { add, finish } = author(202)
const opposite = 'geometry-opposite'
const fz = 'geometry-f-z'
const allied = 'geometry-allied'
const steps = 'geometry-parallel-steps'

/* ---------- The rules ---------- */

type Rule = { name: string; title: string; equal: boolean; why: string }
export const RULES = {
  opposite: { name: 'Vertically opposite angles are equal', title: 'Vertically opposite', equal: true, why: 'Where two lines cross, the angles facing each other across the point are equal.' },
  line: { name: 'Angles on a straight line add to 180°', title: 'Straight line', equal: false, why: 'The two angles sit side by side on a straight line, so they add to 180°.' },
  corresponding: { name: 'Corresponding angles are equal (F)', title: 'Corresponding (F)', equal: true, why: 'Follow the purple F: the angles in the same position at each crossing are equal.' },
  alternate: { name: 'Alternate angles are equal (Z)', title: 'Alternate (Z)', equal: true, why: 'Follow the purple Z: the two angles inside the Z, on opposite sides of the crossing line, are equal.' },
  allied: { name: 'Allied angles add to 180° (C)', title: 'Allied (C)', equal: false, why: 'Follow the purple C: the two angles inside the C, on the same side and between the lines, add to 180°.' },
} satisfies Record<string, Rule>
export type RuleId = keyof typeof RULES

/** The rule that links the angles in places a and b. */
export function ruleOf(a: number, b: number): RuleId {
  const [i, j] = a < b ? [a, b] : [b, a]
  if (Math.floor(i / 4) === Math.floor(j / 4)) return (i % 4 + 2) % 4 === j % 4 ? 'opposite' : 'line'
  const pi = i % 4, pj = j % 4
  if (pi === pj) return 'corresponding'
  if ((pi === 2 && pj === 0) || (pi === 3 && pj === 1)) return 'alternate'
  if ((pi === 3 && pj === 0) || (pi === 2 && pj === 1)) return 'allied'
  throw new Error(`No one rule links places ${a} and ${b}`)
}

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

/* ---------- Workings ---------- */

/**
 * A picture with one angle given and x to find, and the working from the given angle to x through the places in
 * `via`, one rule a step. Each step lights the rule's letter in purple, boxes the angle it uses and shows the angle it
 * finds in green; the rule's name is the first row of its step, as the book asks ("state which rule you use").
 */
function chain(shape: 'parallel' | 'cross', t: number, given: number, x: number, via: number[] = []) {
  const size = (place: number) => placeSize(t, place % 4)
  const n = shape === 'cross' ? 4 : 8
  const labels = Array.from({ length: n }, (_, i) => i === given ? deg(size(given)) : i === x ? 'x' : '')
  const families = labels.map((_, i) => i === given ? -1 : 0)
  const picture: AngleFrame = { shape, angles: [t], labels, families }
  const places = [given, ...via, x]
  const shown = [...labels]
  const moves: BoardMove[] = []
  const rules: RuleId[] = []
  if (shape === 'cross') moves.push({ title: 'Spot the crossing', say: 'Two straight lines cross at one point, making four angles: two pairs facing each other across the point.', rows: ['> Two straight lines cross'], picture: { ...picture, lit: 'cross' } })
  if (shape === 'parallel') moves.push({ title: 'Spot the parallel lines', say: 'The arrows show the two lines are parallel: always the same distance apart, so they never meet. A line crossing them makes the same angles at both crossings.', rows: ['> Arrows mark parallel lines'], picture })
  places.slice(1).forEach((m, step) => {
    const k = places[step], rule = ruleOf(k, m), r = RULES[rule], value = size(m), last = m === x
    rules.push(rule)
    const name = last ? 'x' : 'a'
    const rows = r.equal
      ? [`> ${r.name}`, last ? `! x = ${deg(value)}` : `${name} = ${deg(value)}`]
      : [`> ${r.name}`, `${name} = 180 −${size(k)}`, last ? `! x = ${deg(value)}` : `= ${value}`]
    shown[m] = deg(value)
    const lit: Partial<AngleFrame> = shape === 'parallel' ? { pair: [k, m] } : rule === 'opposite' ? { lit: 'cross' } : {}
    moves.push({ title: r.title, say: `${r.why} So ${last ? 'x' : 'this angle'} is ${value}°.`, rows, picture: { ...picture, ...lit, labels: [...shown], boxed: [k], found: [m] } })
  })
  return { picture, model: boardModel([], moves, 'Find x', picture), answer: size(x), rules }
}

/** The usual slips: an equal pair taken as adding to 180 (or the other way round), or stopping one rule early. */
function chainSlips(c: ReturnType<typeof chain>, t: number, early?: number) {
  const other = c.answer === t ? 180 - t : t
  const lastRule = RULES[c.rules.at(-1)!]
  const list: Slip[] = []
  if (early !== undefined && early !== c.answer) list.push([early, 'That’s the angle after the first rule. Use a second rule to get to x.'])
  list.push([other, lastRule.equal ? `${lastRule.name}: they don’t add to 180°.` : `${lastRule.name}. These two aren’t equal.`])
  return slips(c.answer, list)
}

function question(topic: MicroSkillId, title: string, sourceRef: string, c: ReturnType<typeof chain>, t: number, hint: string, early?: number) {
  return practice(topic, title, sourceRef, c.picture, number(c.answer, deg(c.answer)), hint, c.model, chainSlips(c, t, early))
}

/** Which rule? The right rule first; the wrong ones say why. */
const WRONG_RULE: Record<RuleId, [string, string]> = {
  opposite: [RULES.opposite.name, 'Vertically opposite angles face each other at one crossing. These are at different crossings.'],
  line: [RULES.line.name, 'These two don’t sit side by side on one straight line.'],
  corresponding: [RULES.corresponding.name, 'Corresponding angles are in the same position at each crossing, making an F.'],
  alternate: [RULES.alternate.name, 'Alternate angles are inside the parallel lines on opposite sides of the crossing line, making a Z.'],
  allied: [RULES.allied.name, 'Allied angles are inside the parallel lines on the same side, making a C.'],
}
function whichRule(topic: MicroSkillId, title: string, sourceRef: string, c: ReturnType<typeof chain>, hint: string) {
  const right = c.rules[0]
  const wrong = (['corresponding', 'alternate', 'allied', 'opposite', 'line'] as RuleId[]).filter(r => r !== right).slice(0, 3).map(r => WRONG_RULE[r])
  return practice(topic, title, sourceRef, c.picture, choose(RULES[right].name, ...wrong), hint, c.model)
}

/* ---------- Rung 1: vertically opposite angles ---------- */

explore(opposite, 'Drag the line. Watch the opposite angles.', 'GM2 p118 Rule 3 (play)', { mode: 'cross', start: [55] })
worked(opposite, 'Two straight lines cross. Find the angle marked x.', 'Vertically opposite angles', 'GM2 p118 Rule 3 (own numbers)', chain('cross', 47, 0, 2).model,
  'Where two straight lines cross, the angles opposite each other are equal: vertically opposite angles.')
worked(opposite, 'Two straight lines cross. Find the angle marked x.', 'The angle next to it', 'GM2 p118 Rule 3 + GM1 Rule 3 (own numbers)', chain('cross', 47, 0, 1).model,
  'The angle next to it isn’t opposite: the two sit on a straight line, so they add to 180°.')
question(opposite, 'Two straight lines cross. Find the angle marked x.', 'GM2 p118 Rule 3 (own numbers)', chain('cross', 52, 1, 3), 52, 'x is opposite the 128°.')
question(opposite, 'Two straight lines cross. Find the angle marked x.', 'GM2 p118 Rule 3 (own numbers)', chain('cross', 64, 0, 1), 64, 'x and 64° sit side by side on a straight line.')
question(opposite, 'Two straight lines cross. Find the angle marked x.', 'GM2 p118 Rule 3 (own numbers)', chain('cross', 105, 3, 1), 105, 'Look straight across the point from the 75°.')
whichRule(opposite, 'Which rule finds x?', 'GM2 p118 Rule 3 (state the rule)', chain('cross', 70, 2, 0), 'The two angles face each other across the point.')

/* ---------- Rung 2: corresponding (F) and alternate (Z) angles ---------- */

explore(fz, 'Tilt the line across the parallel lines. Watch the F.', 'GM2 p118 Rule 2 (play)', { mode: 'parallel', pair: 'F', start: [60] })
explore(fz, 'Now watch the Z.', 'GM2 p118 Rule 1 (play)', { mode: 'parallel', pair: 'Z', start: [60] })
worked(fz, 'The arrows mark parallel lines. Find the angle marked x.', 'Corresponding angles: F', 'GM2 p118 Rule 2 (own numbers)', chain('parallel', 72, 0, 4).model,
  'Corresponding angles are in the same position at each crossing. They make an F, and they are equal.')
worked(fz, 'The arrows mark parallel lines. Find the angle marked x.', 'Alternate angles: Z', 'GM2 p118 Rule 1 (own numbers)', chain('parallel', 58, 2, 4).model,
  'Alternate angles are between the parallel lines, on opposite sides of the crossing line. They make a Z, and they are equal.')
question(fz, 'The arrows mark parallel lines. Find the angle marked x.', 'GM2 p119 Q1 (own numbers)', chain('parallel', 65, 1, 5), 65, 'x is in the same position as 115°, at the other crossing: an F.')
question(fz, 'The arrows mark parallel lines. Find the angle marked x.', 'GM2 p119 Q1 (own numbers)', chain('parallel', 63, 6, 2), 63, 'Look for the F: same position, other crossing.')
question(fz, 'The arrows mark parallel lines. Find the angle marked x.', 'GM2 p119 Q2 (own numbers)', chain('parallel', 59, 3, 5), 59, 'Both angles are between the parallel lines, either side of the crossing line: a Z.')
question(fz, 'The arrows mark parallel lines. Find the angle marked x.', 'GM2 p119 Q2 (own numbers)', chain('parallel', 49, 4, 2), 49, 'Find the Z between the parallel lines.')
whichRule(fz, 'Which rule finds x?', 'GM2 p119 Q2 (state the rule)', chain('parallel', 56, 3, 5), 'Is it an F, a Z or a C?')
practice(fz, 'Corresponding angles make which letter?', 'GM2 p118 Rule 2 (the letter)', chain('parallel', 68, 1, 5).picture, choose(
  'F: the same position at each crossing',
  ['Z: either side of the crossing line', 'That’s alternate angles, inside the parallel lines.'],
  ['C: on the same side, inside', 'That’s allied angles, which add to 180°.'],
  ['X: facing across one crossing', 'That’s vertically opposite angles, at one crossing.'],
), 'Corresponding means in the same position.', chain('parallel', 68, 1, 5).model)

/* ---------- Rung 3: allied angles (C) ---------- */

explore(allied, 'Tilt the line. Watch the two angles inside the C.', 'GM2 p118 Rule 4 (play)', { mode: 'parallel', pair: 'C', start: [60] })
worked(allied, 'The arrows mark parallel lines. Find the angle marked x.', 'Allied angles: C', 'GM2 p118 Rule 4 (own numbers)', chain('parallel', 68, 3, 4).model,
  'Allied angles are between the parallel lines on the same side of the crossing line. They make a C, and they add to 180°. They are not equal.')
question(allied, 'The arrows mark parallel lines. Find the angle marked x.', 'GM2 p118 Rule 4 (own numbers)', chain('parallel', 74, 2, 5), 74, 'Both angles are inside the parallel lines, on the left: a C.')
question(allied, 'The arrows mark parallel lines. Find the angle marked x.', 'GM2 p118 Rule 4 (own numbers)', chain('parallel', 49, 5, 2), 49, 'Allied angles add to 180°.')
question(allied, 'The arrows mark parallel lines. Find the angle marked x.', 'GM2 p118 Rule 4 (own numbers)', chain('parallel', 57, 4, 3), 57, 'Find the C between the parallel lines.')
{
  const c = chain('parallel', 70, 3, 4)
  practice(allied, 'Sam says x = 110°, because allied angles are equal. What is right?', 'GM2 p118 Rule 4 (a common mistake)', c.picture, choose(
    'Allied angles add to 180°, so x = 70°',
    ['Sam is right: x = 110°', 'Allied angles aren’t equal. Inside a C they add to 180°.'],
    ['x = 250°: add them', '180 is the total: x is 180 − 110.'],
    ['x = 90°', 'Only if both were right angles. 180 − 110 is 70.'],
  ), 'Equal angles make an F or a Z. What about a C?', c.model)
}
whichRule(allied, 'Which rule finds x?', 'GM2 p118 Rule 4 (state the rule)', chain('parallel', 62, 2, 5), 'Is it an F, a Z or a C?')

/* ---------- Rung 4: two rules in a row ---------- */

worked(steps, 'The arrows mark parallel lines. Find x, and state the rule at each step.', 'Two rules in a row', 'GM2 p118 Example (own numbers)', chain('parallel', 39, 1, 4, [3]).model,
  'When no one rule links the angle you know to x, find an angle in between. Name the rule at every step.')
question(steps, 'The arrows mark parallel lines. Find the angle marked x.', 'GM2 p119 Q3 (own numbers)', chain('parallel', 52, 0, 7, [4]), 52, 'The F gives the angle at the bottom crossing first. Then a straight line.', 52)
question(steps, 'The arrows mark parallel lines. Find the angle marked x.', 'GM2 p119 Q4 (own numbers)', chain('parallel', 117, 2, 7, [4]), 117, 'A Z first, then a straight line.', 117)
question(steps, 'The arrows mark parallel lines. Find the angle marked x.', 'GM2 p119 Q5 (own numbers)', chain('parallel', 114, 5, 0, [1]), 114, 'The F takes 66° up to the top crossing. Then a straight line.', 66)
{
  const c = chain('parallel', 44, 1, 4, [3])
  practice(steps, 'Which two rules find x, in order?', 'GM2 p119 Q3 (state the rules)', c.picture, choose(
    'Vertically opposite, then allied angles',
    ['Corresponding, then alternate', 'From 136° neither an F nor a Z reaches x.'],
    ['Allied angles only', '136° and x aren’t inside the C together. First move 136° across the crossing.'],
    ['Alternate, then a straight line', '136° is outside the parallel lines, so there’s no Z from it.'],
  ), 'Which angle can you find from 136° straight away?', c.model)
}

add('mixed', 'Angles in parallel lines', 'GM2 consolidation', text(
  'Vertically opposite angles are equal: they face each other where two lines cross.',
  'Corresponding angles are equal: same position at each crossing, an F.',
  'Alternate angles are equal: inside the parallel lines on opposite sides, a Z.',
  'Allied angles add to 180°: inside the parallel lines on the same side, a C.',
  'Name the rule at every step: the reason earns the marks.',
))

export const tutorParallelAnglesLesson: TutorMethodLesson = {
  id: 'L202', number: 202, title: 'Angles in parallel lines', level: 'GCSE Foundation',
  goal: 'Find angles where lines cross and in parallel lines, using vertically opposite, corresponding (F), alternate (Z) and allied (C) angles, and name the rule at each step.',
  labels: { [opposite]: 'Vertically opposite', [fz]: 'F and Z angles', [allied]: 'Allied angles', [steps]: 'Two rules in a row', mixed: 'Review' },
  states: finish(),
}
