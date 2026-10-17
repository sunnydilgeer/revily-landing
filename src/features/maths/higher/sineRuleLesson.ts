/*
 * Geometry 20H: The sine rule, a Higher-only lesson after Trigonometry. From the Higher revision guide, T4 The Sine Rule
 * (Level 6-7, p230–231): a/sin A = b/sin B = c/sin C for any triangle, using two parts at a time; the flipped form for an
 * angle; and the ambiguous case, where an angle found from its sine could also be 180° take away it.
 *
 * The book's numbers: Example 1 (x = 14.4), Example 2 (the obtuse x = 110°) and Your Turn Q1 to Q5. Q1's x is opposite
 * the unmarked third angle, so it starts by finding it (46°). Q4 labels AC 20 cm, which can't be true (with C = 52° and
 * CAB = 25.3°, AC is 14.9 cm); the answer doesn't use AC, so that side is left unlabelled. Every triangle is drawn to scale.
 */
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { line, part, sign } from '../../written-methods/tutor/stepWorking'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import type { MicroSkillId } from '../../number-types/types'
import { asks } from './figureHelpers'
import { fromAngles, fromSAS, rad, tri, turned } from './trigPictures'

const a = author(220.5, 'L220H')
const { add, finish } = a
const ask = asks(a)
const length = 'sine-rule-length'
const angle = 'sine-rule-angle'

function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: ReturnType<typeof boardModel>, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  state.content.heading = heading
  return state
}
const sin = (d: number) => Math.sin(rad(d))
const L_BOX = (unit?: string) => ({ label: unit ? `Length (${unit})` : 'Length', prefix: 'x =' })

add(length, 'The sine rule', 'Higher T4 The Sine Rule Formula', text(
  'SOHCAHTOA only works in a right-angled triangle. The sine rule works in any triangle.',
  'Label the angles with capital letters, A, B and C, and the sides with small letters: side a is opposite angle A, b is opposite B and c is opposite C.',
  'The sine rule: a ÷ sin A = b ÷ sin B = c ÷ sin C.',
  'You only ever use two parts at a time: a side and the angle opposite it, then another side and the angle opposite that.',
  'Use it when you know a side and the angle opposite it. Make sure your calculator is in degrees.',
))

/* ---------- Rung 1: a missing length ---------- */

{
  // Example 1: 21° and 35° on the base, 23 opposite the 35°, x opposite the 21°.
  const c = 23 * sin(124) / sin(35)
  const pts = fromAngles(c, 21, 35)
  const t = (o: { lit?: boolean; found?: boolean } = {}) => tri(pts, {
    sides: [undefined, { label: o.found ? '14.4' : 'x', tone: o.found ? 'found' : o.lit ? 'lit' : 'x' }, { label: '23', tone: o.lit ? 'lit' : undefined }],
    angles: [{ at: 0, label: '21°', tone: o.lit ? 'lit' : undefined }, { at: 1, label: '35°', tone: o.lit ? 'lit' : undefined }],
    spoken: 'A triangle with angles of 21° and 35° on its base. The side opposite the 35° is 23; x is the side opposite the 21°.',
    caption: o.found ? 'x = 14.4' : undefined,
  })
  worked(length, 'Use the sine rule to find the side marked x, to 3 significant figures.', 'Finding a length', 'Higher T4 Example (p230)', boardModel([], [
    { title: 'Match the letters', say: 'x is opposite the 21° angle, so call them a and A. 23 is opposite the 35°: b and B.', rows: ['a = x, A = 21°', 'b = 23, B = 35°'], picture: t({ lit: true }) },
    { title: 'Put them in', say: 'Use the two parts of the sine rule with a and b in.', rows: ['{x|sin 21°} = {23|sin 35°}'], picture: t({ lit: true }) },
    { title: 'Multiply by sin 21°', say: 'Multiply both sides by sin 21° to get x on its own. Only use the calculator at the end.', rows: ['x = {23|sin 35°} × sin 21°', '= 14.370…', '! x = 14.4'], picture: t({ found: true }) },
  ], 'Find x', t()), 'Match each side to the angle opposite it, put the pair you know and the pair you want into the sine rule, then rearrange. Only press the calculator at the very end.')
}

{
  // Your Turn Q1: 40° and 94° at the ends of x; 10.5 is opposite the 94°; x is opposite the unmarked 46°.
  const pts = turned(fromAngles(10.5 * sin(46) / sin(94), 40, 94), 0, true)
  ask(length, 'Use the sine rule to find the side marked x, to 3 significant figures.', 'Higher T4 Your Turn Q1 (Level 6-7)', tri(pts, {
    sides: [{ label: 'x', tone: 'x' }, undefined, { label: '10.5' }],
    angles: [{ at: 0, label: '40°' }, { at: 1, label: '94°' }],
    spoken: 'A triangle with x along the top, between angles of 40° and 94°. The side from the 40° corner down to the bottom corner is 10.5.',
  }), number(7.57, '7.57'), '7.57', 'x is opposite the third angle. Find that angle first.', {
    kind: 'step-worked', start: '40°, 94° and 10.5', steps: [
      { title: 'The third angle', why: 'The angles in a triangle add to one hundred and eighty degrees. This angle is opposite x.', lines: [line([part('180'), sign('−'), part('40'), sign('−'), part('94')], '46°')] },
      { title: 'Match the pairs', why: 'x is opposite the forty-six degree angle, and 10.5 is opposite the ninety-four degree angle.', lines: [line([part('x ÷ sin 46°')], '10.5 ÷ sin 94°', { eq: true })] },
      { title: 'Multiply by sin 46°', why: 'Multiply both sides by sin 46° to get x on its own, then round to three significant figures.', lines: [line([part('10.5 ÷ sin 94°'), sign('×'), part('sin 46°')], '7.57', { answer: true })] },
    ],
  }, L_BOX())
}

{
  // Your Turn Q2: A = 30° and B = 80°; AC = 5 cm is opposite B; x = CB is opposite A.
  const pts = turned(fromAngles(5, 30, 70), 0, true)
  ask(length, 'Use the sine rule to find the side marked x, to 3 significant figures.', 'Higher T4 Your Turn Q2 (Level 6-7)', tri(pts, {
    sides: [{ label: '5 cm' }, { label: 'x', tone: 'x' }],
    angles: [{ at: 0, label: '30°' }, { at: 2, label: '80°' }],
    names: ['A', 'C', 'B'],
    spoken: 'Triangle ABC. Angle A is 30° and angle B is 80°. AC is 5 cm; x is CB.',
  }), number(2.54, '2.54 cm'), '2.54 cm', 'x is opposite the 30°, and 5 cm is opposite the 80°.', {
    kind: 'step-worked', start: 'A = 30°, B = 80°, AC = 5 cm', steps: [
      { title: 'Match the pairs', why: 'CB is opposite angle A, and AC is opposite angle B.', lines: [line([part('x ÷ sin 30°')], '5 ÷ sin 80°', { eq: true })] },
      { title: 'Multiply by sin 30°', why: 'Multiply both sides by sin 30° to get x on its own, then round to three significant figures.', lines: [line([part('5 ÷ sin 80°'), sign('×'), part('sin 30°')], '2.54 cm', { answer: true })] },
    ],
  }, L_BOX('cm'))
}

{
  // Your Turn Q5: B = 68° and C = 35°; AC = 6 cm is opposite B; x = AB is opposite C.
  const pts = fromAngles(6, 77, 35)
  ask(length, 'Use the sine rule to find the side marked x, to 3 significant figures.', 'Higher T4 Your Turn Q5 (Level 6-7)', tri(pts, {
    sides: [{ label: '6 cm' }, undefined, { label: 'x', tone: 'x' }],
    angles: [{ at: 1, label: '35°' }, { at: 2, label: '68°' }],
    names: ['A', 'C', 'B'],
    spoken: 'Triangle ABC. Angle B is 68° and angle C is 35°. AC is 6 cm; x is AB.',
  }), number(3.71, '3.71 cm'), '3.71 cm', 'x is opposite the 35°, and 6 cm is opposite the 68°.', {
    kind: 'step-worked', start: 'B = 68°, C = 35°, AC = 6 cm', steps: [
      { title: 'Match the pairs', why: 'AB is opposite angle C, and AC is opposite angle B.', lines: [line([part('x ÷ sin 35°')], '6 ÷ sin 68°', { eq: true })] },
      { title: 'Multiply by sin 35°', why: 'Multiply both sides by sin 35° to get x on its own, then round to three significant figures.', lines: [line([part('6 ÷ sin 68°'), sign('×'), part('sin 35°')], '3.71 cm', { answer: true })] },
    ],
  }, L_BOX('cm'))
}

{
  const pts = fromAngles(9, 48, 57)
  ask(length, 'Which pair of the sine rule do you need to find x?', 'Higher T4 The Sine Rule Formula (choosing the pair)', tri(pts, {
    sides: [{ label: '9 cm' }, { label: 'x', tone: 'x' }],
    angles: [{ at: 0, label: '48°' }, { at: 2, label: '75°' }],
    spoken: 'A triangle with a 9 cm base. The angle at its left end is 48° and the top angle is 75°; x is the right side.',
  }), choose('x ÷ sin 48° = 9 ÷ sin 75°',
    ['x ÷ sin 75° = 9 ÷ sin 48°', 'Each side goes with the angle opposite it. x is opposite the 48°, not the 75°.'],
    ['x ÷ sin 48° = 9 ÷ sin 57°', 'The 57° angle is opposite the left side, not the 9 cm base. The base is opposite the 75° at the top.'],
    ['x = 9 × sin 48°', 'That is SOHCAHTOA, which needs a right angle. This triangle hasn’t got one.']),
  'x ÷ sin 48° = 9 ÷ sin 75°', 'Pair each side with the angle opposite it.', {
    kind: 'step-worked', start: 'Angles 48° and 75°, side 9 cm', steps: [
      { title: 'Opposite pairs', why: 'x is across from the forty-eight degree angle, and the nine centimetre base is across from the seventy-five degree angle at the top.', words: 'x ÷ sin 48° = 9 ÷ sin 75°' },
    ],
  })
}

/* ---------- Rung 2: a missing angle, and the ambiguous case ---------- */

add(angle, 'Finding an angle', 'Higher T4 Example: Sine Rule to Find an Angle', text(
  'To find an angle, flip the sine rule over: sin A ÷ a = sin B ÷ b = sin C ÷ c. You don’t have to, but it makes life easier.',
  'Rearrange to get sin x on its own, then use sin⁻¹ on your calculator.',
  'The ambiguous case: sin x and sin (180° − x) are the same. So sin⁻¹ gives an acute angle, but the obtuse angle 180° take away it can fit the same facts.',
  'This happens when you know two sides and an angle that isn’t between them. If the question asks for the obtuse angle, take the acute one from 180°.',
))

{
  // Example 2: B = 33°, a = 43 m opposite x, b = 25 m opposite B; the obtuse x = 110.48…°.
  const x = 180 - 69.5175
  const pts = fromSAS(25 * sin(180 - 33 - x) / sin(33), 43, 33)
  const t = (o: { lit?: boolean; found?: string } = {}) => tri(pts, {
    sides: [undefined, { label: '25 m', tone: o.lit ? 'lit' : undefined }, { label: '43 m', tone: o.lit ? 'lit' : undefined }],
    angles: [{ at: 0, label: '33°', tone: o.lit ? 'lit' : undefined }, { at: 1, label: o.found ?? 'x', tone: o.found ? 'found' : 'x' }],
    spoken: 'A triangle with a 33° angle at the bottom left. The side from it to the top is 43 m, and the side from the top down to the obtuse angle x is 25 m.',
    caption: o.found ? `x = ${o.found}` : undefined,
  })
  worked(angle, 'Use the sine rule to find the obtuse angle marked x, to 2 significant figures.', 'The ambiguous case', 'Higher T4 Example (p230)', boardModel([], [
    { title: 'Match the letters', say: 'x is opposite 43 m: A and a. The 33° is opposite 25 m: B and b.', rows: ['A = x, a = 43', 'B = 33°, b = 25'], picture: t({ lit: true }) },
    { title: 'Put them in', say: 'Use the flipped sine rule, angles on top.', rows: ['{sin x|43} = {sin 33°|25}'], picture: t({ lit: true }) },
    { title: 'Multiply by 43', say: 'Multiply both sides by 43, then use sin⁻¹.', rows: ['sin x = {43 × sin 33°|25}', 'x = sin⁻¹(0.9367…) = 70° (2 sf)'], picture: t({ found: '70°?' }) },
    { title: 'The obtuse angle', say: 'The question asked for an obtuse angle, but sin⁻¹ gave an acute one. Two different triangles fit, both correct. Take it from 180°.', rows: ['x = 180 − 70', '! x = 110°'], picture: t({ found: '110°' }) },
  ], 'Find x', t()), 'With the sine rule, an angle can be acute or obtuse: sin⁻¹ only ever gives the acute one. When the obtuse angle is wanted, take it from 180°.')
}

{
  // Your Turn Q3: A = 15°, AC = 12 cm opposite the obtuse x at B, BC = 7 cm opposite A.
  const x = 180 - 26.34
  const pts = turned(fromAngles(12, 15, 180 - 15 - x), 0, true)
  ask(angle, 'Use the sine rule to find the obtuse angle x, to 3 significant figures.', 'Higher T4 Your Turn Q3 (Level 6-7)', tri(pts, {
    sides: [{ label: '12 cm' }, { label: '7 cm' }],
    angles: [{ at: 0, label: '15°' }, { at: 2, label: 'x', tone: 'x' }],
    names: ['A', 'C', 'B'],
    spoken: 'Triangle ABC with angle A 15°. AC is 12 cm and BC is 7 cm; x is the obtuse angle at B.',
  }), number(154, '154°'), '154°', 'Use the flipped rule to find the acute angle first, then take it from 180°.', {
    kind: 'step-worked', start: 'A = 15°, AC = 12 cm, BC = 7 cm', steps: [
      { title: 'Match the pairs', why: 'The angle at B is opposite AC, and the fifteen degree angle is opposite BC.', lines: [line([part('sin x ÷ 12')], 'sin 15° ÷ 7', { eq: true })] },
      { title: 'Multiply by 12', why: 'Multiply both sides by twelve to get sin x on its own.', lines: [line([part('12'), sign('×'), part('sin 15° ÷ 7')], '0.4436…')] },
      { title: 'Use inverse sin', why: 'The calculator gives the acute angle.', lines: [line([part('sin⁻¹(0.4436…)')], '26.34…°')] },
      { title: 'The obtuse angle', why: 'The angle at B is obtuse, so take the acute angle from one hundred and eighty degrees and round.', lines: [line([part('180'), sign('−'), part('26.34…')], '154°', { answer: true })] },
    ],
  }, { label: 'Angle (°)', prefix: 'x =' })
}

{
  // Your Turn Q4: C = 52°, AB = 12 cm opposite C, CB = 6.5 cm opposite the angle CAB.
  const A = 25.267
  const pts = fromAngles(6.5, 52, 180 - 52 - A)
  ask(angle, 'Use the sine rule to find angle CAB, to 3 significant figures.', 'Higher T4 Your Turn Q4 (Level 6-7)', tri(pts, {
    sides: [{ label: '6.5 cm' }, { label: '12 cm' }],
    angles: [{ at: 0, label: '52°' }, { at: 2, label: 'x', tone: 'x' }],
    names: ['C', 'B', 'A'],
    spoken: 'Triangle ABC with angle C 52°. CB is 6.5 cm and AB is 12 cm; x is angle CAB at the top.',
  }), number(25.3, '25.3°'), '25.3°', 'Angle CAB is opposite CB. The 52° is opposite AB.', {
    kind: 'step-worked', start: 'C = 52°, AB = 12 cm, CB = 6.5 cm', steps: [
      { title: 'Match the pairs', why: 'Angle CAB is opposite CB, and the fifty-two degree angle is opposite AB.', lines: [line([part('sin x ÷ 6.5')], 'sin 52° ÷ 12', { eq: true })] },
      { title: 'Multiply by 6.5', why: 'Multiply both sides by six point five to get sin x on its own.', lines: [line([part('6.5'), sign('×'), part('sin 52° ÷ 12')], '0.4268…')] },
      { title: 'Use inverse sin', why: 'Use inverse sine on the calculator, then round to three significant figures.', lines: [line([part('sin⁻¹(0.4268…)')], '25.3°', { answer: true })] },
    ],
  }, { label: 'Angle (°)', prefix: 'x =' })
}

{
  const pts = fromAngles(8, 30, 70)
  ask(angle, 'sin x = 0.5. Which two angles between 0° and 180° could x be?', 'Higher T4 The ambiguous case', tri(pts, {
    angles: [{ at: 0, label: 'x', tone: 'x' }],
    spoken: 'A triangle with an angle x, where sin x is 0.5.',
  }), choose('30° or 150°',
    ['30° or 60°', 'sin 60° is about 0.87. The other angle is 180° take away 30°.'],
    ['30° or 330°', 'An angle in a triangle is less than 180°.'],
    ['30° only', 'sin 150° is 0.5 too: 180° take away 30°.']),
  '30° or 150°', 'sin x and sin (180° − x) are the same.', {
    kind: 'step-worked', start: 'sin x = 0.5', steps: [
      { title: 'Inverse sin', why: 'The calculator gives the acute angle.', lines: [line([part('sin⁻¹(0.5)')], '30°')] },
      { title: 'The obtuse one', why: 'Taking it from one hundred and eighty degrees gives an angle with the same sine.', lines: [line([part('180'), sign('−'), part('30')], '150')] },
      { title: 'Both angles', why: 'Either angle could be in the triangle.', words: '30° or 150°' },
    ],
  })
}

add('mixed', 'The sine rule', 'Higher T4 consolidation', text(
  'Side a is opposite angle A, b opposite B, c opposite C.',
  'A length: a ÷ sin A = b ÷ sin B. An angle: sin A ÷ a = sin B ÷ b. Use two parts at a time.',
  'Use the sine rule when you know a side and the angle opposite it.',
  'sin⁻¹ gives the acute angle. For the obtuse one, take it from 180°.',
))

export const tutorSineRuleLesson: TutorMethodLesson = {
  id: 'L220H', number: 220.5, title: 'The sine rule', level: 'GCSE Higher',
  steadyPictures: true,
  largePictures: true,
  goal: 'Use the sine rule to find a missing side or angle in any triangle, including the obtuse angle in the ambiguous case.',
  labels: { [length]: 'Finding a length', [angle]: 'Finding an angle', mixed: 'Review' },
  states: finish(),
}
