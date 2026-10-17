/*
 * Geometry 20H2: The cosine rule, a Higher-only lesson after The sine rule. From the Higher revision guide, T5 The Cosine
 * Rule (Level 6-7, p232–233): a² = b² + c² − 2bc cos A for any triangle, where a is the side opposite the angle A. A
 * length from two sides and the angle between them; an angle from all three sides, with the rule rearranged to
 * cos A = (b² + c² − a²) ÷ 2bc. And which rule to use: the sine rule needs a side with its opposite angle.
 *
 * The book's numbers: the Example (x = 4.9) and Your Turn Q1 to Q5; the angle example is our own. Every triangle is
 * drawn to scale.
 */
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { line, part, sign } from '../../written-methods/tutor/stepWorking'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import type { MicroSkillId } from '../../number-types/types'
import { asks } from './figureHelpers'
import { fromAngles, fromSAS, fromSSS, rad, tri, turned, type Tri } from './trigPictures'

const a = author(220.6, 'L220H2')
const { add, finish } = a
const ask = asks(a)
const length = 'cosine-rule-length'
const angle = 'cosine-rule-angle'

function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: ReturnType<typeof boardModel>, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  state.content.heading = heading
  return state
}
const A_BOX = { label: 'Angle (°)', prefix: 'x =' }
const L_BOX = { label: 'Length (cm)', prefix: 'x =' }

add(length, 'The cosine rule', 'Higher T5 The Cosine Rule Formula', text(
  'The cosine rule is another rule for any triangle, not just right-angled ones.',
  'a² = b² + c² − 2bc cos A',
  'a is the side opposite the angle A. b and c are the other two sides, the ones that make the angle A.',
  'Use it to find a side when you know the other two sides and the angle between them.',
  'Work out the right-hand side, then square root it at the end.',
))

/* ---------- Rung 1: a missing length ---------- */

{
  // Example: 5 and 7 meet at the 44° angle; x is opposite it.
  const pts: Tri = [[0, 0], [7, 0], [7 - 5 * Math.cos(rad(44)), 5 * Math.sin(rad(44))]]
  const t = (o: { lit?: boolean; found?: boolean } = {}) => tri(pts, {
    sides: [{ label: '7', tone: o.lit ? 'lit' : undefined }, { label: '5', tone: o.lit ? 'lit' : undefined }, { label: o.found ? '4.9' : 'x', tone: o.found ? 'found' : 'x' }],
    angles: [{ at: 1, label: '44°', tone: o.lit ? 'lit' : undefined }],
    spoken: 'A triangle with sides 7 and 5 meeting at a 44° angle; x is the side opposite the angle.',
    caption: o.found ? 'x = 4.9' : undefined,
  })
  worked(length, 'Use the cosine rule to find the side marked x, to 1 decimal place.', 'Finding a length', 'Higher T5 Example (p232)', boardModel([], [
    { title: 'Match the letters', say: 'x is opposite the 44° angle, so it is a, and the angle is A. The two sides making the angle are b and c.', rows: ['a = x, A = 44°', 'b = 5, c = 7'], picture: t({ lit: true }) },
    { title: 'Put them in', say: 'Put the numbers into the formula.', rows: ['x² = 5² + 7² − 2 × 5 × 7 × cos 44°', 'x² = 25 + 49 − 70 cos 44°'], picture: t({ lit: true }) },
    { title: 'Square root', say: 'Square root both sides, and put it all into the calculator in one go.', rows: ['x = √(25 + 49 − 70 cos 44°)', '= 4.862…', '! x = 4.9'], picture: t({ found: true }) },
  ], 'Find x', t()), 'Match the letters first: a is the side you want, opposite the angle A you know. b and c are the two sides that make the angle.')
}

{
  // Your Turn Q1: 86 cm and 65 cm meet at 19°; x is opposite.
  const pts = turned(fromSAS(86, 65, 19), -10, true)
  ask(length, 'Use the cosine rule to find the side marked x, to 2 significant figures.', 'Higher T5 Your Turn Q1 (Level 6-7)', tri(pts, {
    sides: [{ label: '86 cm' }, { label: 'x', tone: 'x' }, { label: '65 cm' }],
    angles: [{ at: 0, label: '19°' }],
    spoken: 'A triangle with sides 86 cm and 65 cm meeting at a 19° angle; x is the side opposite it.',
  }), number(32, '32 cm'), '32 cm', 'x is opposite the 19°. The other two sides are b and c.', {
    kind: 'step-worked', start: 'b = 86, c = 65, A = 19°', steps: [
      { title: 'Square the sides', why: 'Square the two sides that make the angle, and add them.', lines: [line([part('86²'), sign('+'), part('65²')], '11 621')] },
      { title: 'Subtract 2bc cos A', why: 'Twice the two sides times the cosine of the angle between them comes off.', lines: [line([part('11 621'), sign('−'), part('2 × 86 × 65 × cos 19°')], '1050.1…')] },
      { title: 'Square root', why: 'That is x squared. Square root it, then round to two significant figures.', lines: [line([part('√1050.1…')], '32 cm', { answer: true })] },
    ],
  }, L_BOX)
}

{
  // Your Turn Q3: AC = 4.5 cm and AB = 6 cm meet at A = 40°; x = BC.
  const pts = turned(fromSAS(4.5, 6, 40), 0, true)
  ask(length, 'Use the cosine rule to find the side marked x, to 2 significant figures.', 'Higher T5 Your Turn Q3 (Level 6-7)', tri(pts, {
    sides: [{ label: '4.5 cm' }, { label: 'x', tone: 'x' }, { label: '6 cm' }],
    angles: [{ at: 0, label: '40°' }],
    names: ['A', 'C', 'B'],
    spoken: 'Triangle ABC. AC is 4.5 cm and AB is 6 cm, meeting at A, which is 40°; x is BC.',
  }), number(3.9, '3.9 cm'), '3.9 cm', 'x is opposite the 40°, between 4.5 cm and 6 cm.', {
    kind: 'step-worked', start: 'b = 4.5, c = 6, A = 40°', steps: [
      { title: 'Square the sides', why: 'Square the two sides that make the angle, and add them.', lines: [line([part('4.5²'), sign('+'), part('6²')], '56.25')] },
      { title: 'Subtract 2bc cos A', why: 'Twice the two sides times the cosine of the angle between them comes off.', lines: [line([part('56.25'), sign('−'), part('2 × 4.5 × 6 × cos 40°')], '14.88…')] },
      { title: 'Square root', why: 'That is x squared. Square root it, then round to two significant figures.', lines: [line([part('√14.88…')], '3.9 cm', { answer: true })] },
    ],
  }, L_BOX)
}

{
  // Your Turn Q5: AB = 5.2 cm and AC = 3.5 cm meet at A = 28°; x = BC.
  const bc = Math.sqrt(5.2 ** 2 + 3.5 ** 2 - 2 * 5.2 * 3.5 * Math.cos(rad(28)))
  const pts = fromSSS(3.5, 5.2, bc)
  ask(length, 'Use the cosine rule to find the side marked x, to 2 significant figures.', 'Higher T5 Your Turn Q5 (Level 6-7)', tri(pts, {
    sides: [{ label: 'x', tone: 'x' }, { label: '3.5 cm' }, { label: '5.2 cm' }],
    angles: [{ at: 2, label: '28°' }],
    names: ['B', 'C', 'A'],
    spoken: 'Triangle ABC. AB is 5.2 cm and AC is 3.5 cm, meeting at A, which is 28°; x is BC.',
  }), number(2.7, '2.7 cm'), '2.7 cm', 'x is opposite the 28°, between 5.2 cm and 3.5 cm.', {
    kind: 'step-worked', start: 'b = 5.2, c = 3.5, A = 28°', steps: [
      { title: 'Square the sides', why: 'Square the two sides that make the angle, and add them.', lines: [line([part('5.2²'), sign('+'), part('3.5²')], '39.29')] },
      { title: 'Subtract 2bc cos A', why: 'Twice the two sides times the cosine of the angle between them comes off.', lines: [line([part('39.29'), sign('−'), part('2 × 5.2 × 3.5 × cos 28°')], '7.150…')] },
      { title: 'Square root', why: 'That is x squared. Square root it, then round to two significant figures.', lines: [line([part('√7.150…')], '2.7 cm', { answer: true })] },
    ],
  }, L_BOX)
}

/* ---------- Rung 2: a missing angle, and which rule ---------- */

add(angle, 'Finding an angle', 'Higher T5 The Cosine Rule', text(
  'When you know all three sides, the cosine rule finds any angle.',
  'Rearrange it: cos A = (b² + c² − a²) ÷ 2bc.',
  'a is the side opposite the angle you want. Work out cos A, then use cos⁻¹ on your calculator.',
  'An angle from cos⁻¹ is never ambiguous: a negative cos A gives an obtuse angle.',
))

{
  // Our own: sides 7, 8 and 9; the angle opposite the 9.
  const pts = fromSSS(9, 8, 7)
  const t = (o: { lit?: boolean; found?: boolean } = {}) => tri(pts, {
    sides: [{ label: '7' }, { label: '9', tone: o.lit ? 'lit' : undefined }, { label: '8' }],
    angles: [{ at: 0, label: o.found ? '73.4°' : 'x', tone: o.found ? 'found' : 'x' }],
    spoken: 'A triangle with sides 7, 8 and 9; x is the angle opposite the 9.',
    caption: o.found ? 'x = 73.4°' : undefined,
  })
  worked(angle, 'Find the angle marked x, to 1 decimal place.', 'Finding an angle', 'Higher T5 The Cosine Rule (own numbers)', boardModel([], [
    { title: 'Match the letters', say: 'x is opposite the side of 9, so a = 9. The sides making x are 8 and 7.', rows: ['a = 9', 'b = 8, c = 7'], picture: t({ lit: true }) },
    { title: 'Put them in', say: 'Use the rearranged rule: the two sides next to the angle squared, take away the side opposite squared, over 2bc.', rows: ['cos x = {8² + 7² − 9²|2 × 8 × 7}', 'cos x = {32|112}'], picture: t({ lit: true }) },
    { title: 'Use inverse cos', say: 'cos⁻¹ on the calculator, then round.', rows: ['x = cos⁻¹({32|112}) = 73.39…', '! x = 73.4°'], picture: t({ found: true }) },
  ], 'Find x', t()), 'For an angle, rearrange the cosine rule: cos A = (b² + c² − a²) ÷ 2bc, with a the side opposite the angle. Then cos⁻¹.')
}

{
  // Your Turn Q2: 5 cm and 7 cm make the angle x; 6 cm is opposite it.
  const pts = turned(fromSSS(7, 6, 5), 0, true)
  ask(angle, 'Use the cosine rule to find the angle marked x, to 1 decimal place.', 'Higher T5 Your Turn Q2 (Level 6-7)', tri(pts, {
    sides: [{ label: '5 cm' }, { label: '7 cm' }, { label: '6 cm' }],
    angles: [{ at: 1, label: 'x', tone: 'x' }],
    spoken: 'A triangle with sides 5 cm, 6 cm and 7 cm; x is the angle between the 5 cm and 7 cm sides.',
  }), number(57.1, '57.1°'), '57.1°', 'The 6 cm side is opposite x, so it is a.', {
    kind: 'step-worked', start: 'a = 6, b = 5, c = 7', steps: [
      { title: 'The top', why: 'Square the two sides next to x and add them, then take away the square of the side opposite.', lines: [line([part('5²'), sign('+'), part('7²'), sign('−'), part('6²')], '38')] },
      { title: 'The bottom', why: 'Twice the two sides next to x.', lines: [line([part('2'), sign('×'), part('5'), sign('×'), part('7')], '70')] },
      { title: 'Use inverse cos', why: 'cos x is the top over the bottom. Use inverse cosine, then round to one decimal place.', lines: [line([part('cos⁻¹(38 ÷ 70)')], '57.1°', { answer: true })] },
    ],
  }, A_BOX)
}

{
  // Your Turn Q4: AB = 12 cm, AC = 7 cm, BC = 10 cm; x is the angle at C, opposite AB.
  const pts = fromSSS(7, 12, 10)
  ask(angle, 'Use the cosine rule to find the angle marked x, to 1 decimal place.', 'Higher T5 Your Turn Q4 (Level 6-7)', tri(pts, {
    sides: [{ label: '10 cm' }, { label: '7 cm' }, { label: '12 cm' }],
    angles: [{ at: 1, label: 'x', tone: 'x' }],
    names: ['B', 'C', 'A'],
    spoken: 'Triangle ABC. AB is 12 cm, AC is 7 cm and BC is 10 cm; x is the angle at C.',
  }), number(88, '88.0°'), '88.0°', 'x is at C, so the side opposite it is AB, 12 cm.', {
    kind: 'step-worked', start: 'a = 12, b = 7, c = 10', steps: [
      { title: 'The top', why: 'Square the two sides next to x and add them, then take away the square of the side opposite.', lines: [line([part('7²'), sign('+'), part('10²'), sign('−'), part('12²')], '5')] },
      { title: 'The bottom', why: 'Twice the two sides next to x.', lines: [line([part('2'), sign('×'), part('7'), sign('×'), part('10')], '140')] },
      { title: 'Use inverse cos', why: 'cos x is the top over the bottom. Use inverse cosine, then round to one decimal place.', lines: [line([part('cos⁻¹(5 ÷ 140)')], '88.0°', { answer: true })] },
    ],
  }, A_BOX)
}

{
  const pts = fromAngles(10, 50, 60)
  ask(angle, 'You know two sides and the angle between them. Which rule finds the third side?', 'Higher T4 and T5 (choosing the rule)', tri(pts, {
    sides: [{ label: '10 cm' }, { label: 'x', tone: 'x' }, { label: '9.2 cm' }],
    angles: [{ at: 0, label: '50°' }],
    spoken: 'A triangle with sides 10 cm and 9.2 cm meeting at a 50° angle; x is the side opposite the angle.',
  }), choose('The cosine rule',
    ['The sine rule', 'The sine rule needs a side and the angle opposite it. Here the 50° is opposite x, which you don’t know.'],
    ['SOHCAHTOA', 'SOHCAHTOA needs a right angle, and this triangle hasn’t got one.'],
    ['Pythagoras', 'Pythagoras only works in a right-angled triangle.']),
  'The cosine rule', 'Is there a side with its opposite angle that you know?', {
    kind: 'step-worked', start: 'Two sides and the angle between', steps: [
      { title: 'Look for a pair', why: 'No side you know has its opposite angle known too, so the sine rule can’t start. Two sides with the angle between them is the cosine rule.', words: 'The cosine rule' },
    ],
  })
}

add('mixed', 'The cosine rule', 'Higher T5 consolidation', text(
  'a² = b² + c² − 2bc cos A, where a is opposite the angle A.',
  'A side: you know the other two sides and the angle between them.',
  'An angle: you know all three sides. cos A = (b² + c² − a²) ÷ 2bc, then cos⁻¹.',
  'Know a side and its opposite angle? Use the sine rule instead.',
))

export const tutorCosineRuleLesson: TutorMethodLesson = {
  id: 'L220H2', number: 220.6, title: 'The cosine rule', level: 'GCSE Higher',
  steadyPictures: true,
  largePictures: true,
  goal: 'Use the cosine rule to find a side from two sides and the angle between them, or an angle from three sides.',
  labels: { [length]: 'Finding a length', [angle]: 'Finding an angle', mixed: 'Review' },
  states: finish(),
}
