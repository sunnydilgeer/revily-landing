import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { diagnoseInequality } from './inequalitiesDiagnosis'
import { answerMove, choose, circle, given, inequality, lineModel, lineOf, nb, number, shade, dots, text, ticks } from './inequalityWorkings'

const { add, finish } = author(24)
const numberLine = 'inequalities-number-line'
const twoSided = 'inequalities-two-sided'

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
function practice(topic: MicroSkillId, title: string, sourceRef: string, interaction: InteractionDefinition, hint: string, model: TutorWorking, diagnose?: (response: string) => string | null) {
  const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  const state = add(topic, title, sourceRef, text(title), interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  if (diagnose) state.diagnose = diagnose
  return state
}
function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: TutorWorking, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  // The picture shows the number line, so the heading is only the instruction (EXPLANATIONS.md rule 1).
  state.content.heading = heading
  return state
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }
const media = (name: string, title: string, sourceFile: string, durationSeconds: number, textAlternative: string[]) => ({
  id: `lesson24-${name}`, src: `/media/lesson-24/${name}.mp4`, poster: `/media/lesson-24/${name}.svg`, title, durationSeconds, sourceFile, textAlternative,
})
/** A typed inequality, with this question's own slips first. */
function typed(answer: string, slips: [string, string][] = []) {
  return { interaction: inequality(answer), diagnose: (response: string) => diagnoseInequality(response, answer, slips) }
}
const slips = (right: number, list: Slip[]) => (response: string) => diagnoseSlips(response, right, list)

/* ---------- Rung 1: one sign on a number line (A10.1) ---------- */

const ride = worked(numberLine, 'To go on a ride you must be at least 120 cm tall. Let h be a rider’s height in cm. Write this as an inequality and show it on a number line.', 'At least 120 cm: show h on a number line', 'A10.1 video + Q1', lineModel('h ≥ 120', { ticks: ticks(100, 150, 10) }, [
  circle(120, true, 'At least 120: 120 is allowed', '120 itself is allowed, so its circle is filled in.'),
  shade(120, 'right', 'Taller is allowed too', 'Every height above 120 is allowed, so the arrow points right, to the bigger numbers.'),
  answerMove('h ≥ 120', 'Write the inequality', 'A filled circle with the arrow to the right means greater than or equal to.'),
], 'Draw it, then write it'), 'Filled circle: the number is allowed. Open circle: it isn’t. The arrow shows which way the other numbers go.')
video(ride, media('inequalities-on-a-number-line', 'At least 120 cm: h ≥ 120', 'A10.1_Inequalities_On_A_Number_Line.mp4', 100, [
  'A height sign at a ride: you must be at least 120 cm tall. Which heights are allowed?',
  'The four signs: > greater than, < less than, ≥ greater than or equal to, ≤ less than or equal to. The little line underneath means “or equal to”.',
  'At least 120 cm: 120 is allowed, and anything taller. “At least” means greater than or equal to, so h ≥ 120. h = 120 and h = 135 are allowed; h = 119 is not.',
  'Draw a number line with 120 on it. 120 is allowed, so a filled (closed) circle at 120. Taller is allowed, so the arrow points right.',
  'With a strict sign, x < 8, 8 is not allowed: an open (empty) circle at 8.',
  'Where you see it: Sam is 125 cm. 125 ≥ 120, so Sam can ride.',
]))
{
  const { interaction, diagnose } = typed('x < 3', [
    ['x ≤ 3', 'The circle is open, so 3 isn’t included: use < without the line under it.'],
    ['x > 3', 'The arrow points left, to the smaller numbers: x is less than 3.'],
    ['x ≥ 3', 'The arrow points left, so smaller (<), and the circle is open, so 3 isn’t included.'],
  ])
  practice(numberLine, 'A number line has an open circle at 3 and an arrow pointing left. Write down the inequality it shows.', 'A10.1 Q2', interaction, 'Left means smaller. An open circle means 3 itself isn’t included.', lineModel('open circle at 3, arrow left', given(ticks(0, 6), [[3, false]], 'left'), [
    lineOf('smaller than 3', 'The arrow points left', 'Left is the smaller numbers.'),
    answerMove('x < 3', 'The circle is open', 'Open means 3 itself isn’t included, so the sign has no line under it.', undefined, 3),
  ], 'Read it'), diagnose)
}
{
  const { interaction, diagnose } = typed('p ≤ 8', [
    ['p < 8', '“No more than 8” means 8 people is allowed: use ≤, with the line under it.'],
    ['p ≥ 8', 'No more than 8 means 8 or fewer: the sign points to p being smaller.'],
    ['p > 8', 'No more than 8 means 8 or fewer, so p ≤ 8.'],
  ])
  practice(numberLine, 'A lift can carry no more than 8 people. Let p be the number of people in the lift. Write an inequality for p.', 'A10.1 Q3', interaction, '“No more than 8” means 8 is allowed, but not 9.', lineModel('p ≤ 8', { ticks: ticks(4, 12) }, [
    circle(8, true, 'No more than 8: 8 is allowed', '8 people is allowed, so its circle is filled in.'),
    shade(8, 'left', 'Fewer is allowed too', 'Any number below 8 is allowed, so the arrow points left.'),
    answerMove('p ≤ 8', 'Write the inequality', 'A filled circle with the arrow to the left means less than or equal to.'),
  ], 'Draw it, then write it'), diagnose)
}
practice(numberLine, `How do you show ${nb('p ≤ 8')} on a number line?`, 'A10.1 Q3 (number line)', choose(
  'A filled circle at 8, and an arrow pointing left',
  ['An open circle at 8, and an arrow pointing left', '≤ has the line under it: 8 is included, so the circle is filled in.'],
  ['A filled circle at 8, and an arrow pointing right', 'p is less than or equal to 8: the smaller numbers are to the left.'],
  ['An open circle at 8, and an arrow pointing right', '8 is included, so the circle is filled, and smaller numbers are to the left.'],
), 'Is 8 included? Which way are the smaller numbers?', lineModel('p ≤ 8', { ticks: ticks(4, 12) }, [
  circle(8, true, '8 is included: fill it in', '≤ has the line under it, so 8 itself is allowed.'),
  answerMove('Filled circle at 8, arrow left', 'Smaller: the arrow points left', 'Less than means the smaller numbers, to the left.', shade(8, 'left', '', '')),
], 'Draw it'))
{
  const { interaction, diagnose } = typed('t < −18', [
    ['t ≤ −18', 'Colder than −18 means −18 itself isn’t allowed: use < without the line.'],
    ['t > −18', 'Colder means a lower temperature: t is less than −18.'],
    ['t < 18', 'The freezer is below zero: −18, not 18.'],
  ])
  practice(numberLine, 'A freezer must be kept colder than −18 °C. Let t be the temperature in °C. Write an inequality for t.', 'A10.1 Q4a', interaction, 'Colder means less than. Is −18 itself allowed?', lineModel('t < -18', { ticks: ticks(-21, -15) }, [
    circle(-18, false, 'Colder than −18: −18 isn’t allowed', '−18 itself is not colder than −18, so its circle is open.'),
    shade(-18, 'left', 'Colder is smaller', 'Colder temperatures are lower numbers, to the left.'),
    answerMove('t < −18', 'Write the inequality', 'An open circle with the arrow to the left means less than.'),
  ], 'Draw it, then write it'), diagnose)
}
practice(numberLine, `The freezer’s number line shows ${nb('t < −18')}. Is −18 °C an allowed temperature?`, 'A10.1 Q4b', choose(
  'No: the circle at −18 is open, so −18 isn’t included',
  ['Yes: −18 is on the number line', 'Being on the line isn’t enough: the circle at −18 is open, so −18 isn’t allowed.'],
  ['Yes: < includes −18', '< is strict: it doesn’t include −18. Only ≤ would.'],
  ['No: −18 is too cold', '−18 isn’t colder than −18, it’s equal. The circle is open, so it isn’t included.'],
), 'Look at the circle at −18: is it open or filled?', lineModel('t < -18', given(ticks(-21, -15), [[-18, false]], 'left'), [
  answerMove('Open: −18 isn’t allowed', 'Look at the circle at −18', 'An open circle means that number isn’t included.', undefined, -18),
], 'Read it'))
{
  const { interaction, diagnose } = typed('x ≥ −2', [
    ['x > −2', 'The circle is filled, so −2 is included: use ≥, with the line under it.'],
    ['x ≤ −2', 'The arrow points right, to the bigger numbers: x is greater than or equal to −2.'],
    ['x ≥ 2', 'The circle is at −2, below zero.'],
  ])
  practice(numberLine, 'A number line shows a filled circle at −2 with an arrow pointing right. Write down the inequality it shows.', 'A10.1 Q5a', interaction, 'Right means bigger. A filled circle means −2 itself is included.', lineModel('filled circle at -2, arrow right', given(ticks(-4, 2), [[-2, true]], 'right'), [
    lineOf('bigger than −2', 'The arrow points right', 'Right is the bigger numbers.'),
    answerMove('x ≥ −2', 'The circle is filled', 'Filled means −2 itself is included, so the sign has the line under it.', undefined, -2),
  ], 'Read it'), diagnose)
}
practice(numberLine, `Write down the smallest integer that satisfies ${nb('x ≥ −2')}.`, 'A10.1 Q5a (smallest integer)', number(-2, '−2'), 'The circle at −2 is filled. Is −2 itself included?', lineModel('x ≥ -2', given(ticks(-4, 2), [[-2, true]], 'right'), [
  lineOf('−2 is included', 'The circle at −2 is filled', 'Filled means −2 itself is allowed.', -2),
  dots([-2], 'The smallest whole number', 'Everything else on the arrow is bigger than −2.'),
], 'Read it'), slips(-2, [[-1, 'The circle at −2 is filled, so −2 itself is included: it’s the smallest.'], [-3, '−3 is to the left of the circle: it’s smaller than −2, so it isn’t included.'], [2, 'The circle is at −2, below zero.']]))
{
  const { interaction, diagnose } = typed('x ≥ 5', [
    ['x > 5', 'The circle is filled, so 5 is included: use ≥, with the line under it.'],
    ['x ≤ 5', 'The arrow points right, to the bigger numbers.'],
  ])
  practice(numberLine, 'Priya draws a filled circle at 5 and an arrow pointing right. Write down her inequality.', 'A10.1 Q5b', interaction, 'Right means bigger. Filled means 5 is included.', lineModel('filled circle at 5, arrow right', given(ticks(2, 8), [[5, true]], 'right'), [
    lineOf('bigger than 5', 'The arrow points right', 'Right is the bigger numbers.'),
    answerMove('x ≥ 5', 'The circle is filled', 'Filled means 5 itself is included, so the sign has the line under it.', undefined, 5),
  ], 'Read it'), diagnose)
}
practice(numberLine, `Leo says ${nb('x > 4')} and ${nb('x ≥ 4')} look exactly the same on a number line. Is Leo correct?`, 'A10.1 Q5c', choose(
  'No: x > 4 has an open circle at 4, and x ≥ 4 has a filled one',
  ['Yes: both arrows point right', 'The arrows are the same, but the circles aren’t: > doesn’t include 4 (open), ≥ does (filled).'],
  ['Yes: both start at 4', 'They start at 4, but only ≥ includes 4 itself: open circle for >, filled for ≥.'],
  ['No: the arrows point different ways', 'Both arrows point right, to the bigger numbers. The difference is the circle.'],
), 'Does each one include 4 itself?', lineModel('x > 4 and x ≥ 4', { ticks: ticks(1, 7) }, [
  { ...circle(4, false, 'x > 4: an open circle', '> is strict: 4 itself isn’t included.'), change: (frame, step) => ({ ...shade(4, 'right', '', '').change(circle(4, false, '', '').change(frame, step), step) }) },
  answerMove('Not the same: the circles differ', 'x ≥ 4: a filled circle', '≥ includes 4 itself, so the circle is filled in. Only the circle changes.', circle(4, true, '', '')),
], 'Compare them'))

/* ---------- Rung 2: two signs on a number line (A10.2) ---------- */

const fridge = worked(twoSided, 'A fridge must be kept from 1 °C up to, but not including, 5 °C. Let t be the temperature. Write a two-sided inequality for t and show it on a number line.', 'From 1 °C up to, not including, 5 °C: show t', 'A10.2 video + Q1', lineModel('1 ≤ t < 5', { ticks: ticks(0, 6) }, [
  circle(1, true, '1 °C is allowed', 'The lowest temperature, 1, is allowed, so its circle is filled in.'),
  circle(5, false, '5 °C isn’t allowed', 'Up to, but not including: 5 itself isn’t allowed, so its circle is open.'),
  shade(1, 5, 'Join the circles', 'Every temperature between them is allowed.'),
  answerMove('1 ≤ t < 5', 'Write the two signs', 'The smallest number, then t, then the biggest. ≤ next to the filled circle, < next to the open one.'),
], 'Draw it, then write it'), 'Smallest number on the left, the letter in the middle, biggest on the right. Each end gets its own sign.')
video(fridge, media('two-sided-inequalities', 'From 1 °C up to 5 °C: 1 ≤ t < 5', 'A10.2_Two_Sided_Inequalities_On_A_Number_Line.mp4', 95.5, [
  'A fridge must be from 1 °C up to, but not including, 5 °C: 1 ≤ t < 5.',
  'The temperature has a lowest value and a highest value. 1 °C is allowed; 5 °C is not. So t is squeezed between 1 and 5.',
  'Write it with two signs: t in the middle, the limits on each side. 1 is allowed, so use ≤. 5 is not allowed, so use <.',
  'On a number line: a filled circle at 1, an open circle at 5, and a line between them.',
  'Check some values: t = 1 is allowed, t = 3.5 is allowed, t = 5 is not.',
  'Where you see it: the dial shows 3 °C. 3 is between 1 and 5, so the fridge is fine.',
]))
{
  const { interaction, diagnose } = typed('−2 < x < 3', [
    ['−2 ≤ x ≤ 3', 'Both circles are open, so neither −2 nor 3 is included: use < at both ends.'],
    ['−2 ≤ x < 3', 'The circle at −2 is open too: use < next to −2.'],
    ['−2 < x ≤ 3', 'The circle at 3 is open too: use < next to 3.'],
  ])
  practice(twoSided, 'A number line has an open circle at −2, an open circle at 3, and a line joining them. Write down the inequality it shows.', 'A10.2 Q2', interaction, 'Neither end is included. Write the smaller number first.', lineModel('open circles at -2 and 3', given(ticks(-3, 4), [[-2, false], [3, false]], 3), [
    lineOf('−2 < x', 'The circle at −2 is open', 'Open: −2 isn’t included, so the sign next to it is <.', -2),
    answerMove('−2 < x < 3', 'The circle at 3 is open', 'Open again: 3 isn’t included either, so < on this side too.', undefined, 3),
  ], 'Read it'), diagnose)
}
{
  const { interaction, diagnose } = typed('500 ≤ w ≤ 520', [
    ['500 < w < 520', '“At least 500 and at most 520” includes both: 500 g and 520 g are allowed, so use ≤.'],
    ['500 ≤ w < 520', '“At most 520” includes 520: use ≤ on that side too.'],
    ['500 < w ≤ 520', '“At least 500” includes 500: use ≤ on that side too.'],
  ])
  practice(twoSided, 'A bag of apples must weigh at least 500 g and at most 520 g. Let w be the weight in grams. Write a two-sided inequality for w.', 'A10.2 Q3', interaction, '“At least” and “at most” both include the number.', lineModel('500 ≤ w ≤ 520', { ticks: ticks(495, 525, 5) }, [
    circle(500, true, 'At least 500: 500 is allowed', '500 g itself is allowed, so its circle is filled in.'),
    circle(520, true, 'At most 520: 520 is allowed', '520 g itself is allowed too.'),
    shade(500, 520, 'Join the circles', 'Every weight between them is allowed.'),
    answerMove('500 ≤ w ≤ 520', 'Write the two signs', 'Both circles are filled, so both signs have the line under them.'),
  ], 'Draw it, then write it'), diagnose)
}
practice(twoSided, `Which number line shows ${nb('500 ≤ w ≤ 520')}?`, 'A10.2 Q3 (number line)', choose(
  'Filled circles at 500 and 520, with a line between them',
  ['Open circles at 500 and 520, with a line between them', 'Both signs are ≤, so 500 and 520 are included: filled circles.'],
  ['A filled circle at 500, and an arrow pointing right', 'w stops at 520, so the line stops there too, at a second circle.'],
  ['A filled circle at 500, an open circle at 520, and a line between', 'Both signs are ≤: 520 is included too, so its circle is filled.'],
), 'Both signs are ≤. Where does the line stop?', lineModel('500 ≤ w ≤ 520', { ticks: ticks(495, 525, 5) }, [
  circle(500, true, '500 is included: fill it in', '≤ has the line under it, so 500 itself is allowed.'),
  circle(520, true, '520 is included: fill it in', '≤ again, so 520 is allowed too.'),
  answerMove('Filled circles, joined', 'Join the circles', 'Every weight between them is allowed.', shade(500, 520, '', '')),
], 'Draw it'))
{
  const { interaction, diagnose } = typed('−4 ≤ x < 1', [
    ['−4 < x ≤ 1', 'The circles are the wrong way round: −4 is filled (≤) and 1 is open (<).'],
    ['−4 ≤ x ≤ 1', 'The circle at 1 is open, so 1 isn’t included: use < next to 1.'],
    ['−4 < x < 1', 'The circle at −4 is filled, so −4 is included: use ≤ next to −4.'],
  ])
  practice(twoSided, 'A number line shows a filled circle at −4, an open circle at 1, and a line between them. Write down the inequality it shows.', 'A10.2 Q4a', interaction, 'Filled: use ≤. Open: use <. Smaller number first.', lineModel('filled at -4, open at 1', given(ticks(-5, 2), [[-4, true], [1, false]], 1), [
    lineOf('−4 ≤ x', 'The circle at −4 is filled', 'Filled: −4 is included, so the sign next to it is ≤.', -4),
    answerMove('−4 ≤ x < 1', 'The circle at 1 is open', 'Open: 1 isn’t included, so the sign next to it is <.', undefined, 1),
  ], 'Read it'), diagnose)
}
practice(twoSided, `Write down the largest integer that satisfies ${nb('−4 ≤ x < 1')}.`, 'A10.2 Q4b', number(0, '0'), '1 isn’t included. What is the whole number just below it?', lineModel('-4 ≤ x < 1', given(ticks(-5, 2), [[-4, true], [1, false]], 1), [
  lineOf('1 isn’t included', 'The circle at 1 is open', 'Open means 1 itself isn’t allowed.', 1),
  dots([0], 'Go one below', 'The whole number just below 1 is the largest one that fits.'),
], 'Read it'), slips(0, [[1, 'The circle at 1 is open, so 1 isn’t included. Go one below.'], [-4, 'That’s the smallest. The largest is at the other end, just below 1.'], [0.9, 'An integer is a whole number: the largest one below 1 is 0.']]))
{
  const { interaction, diagnose } = typed('5 ≤ a < 12', [
    ['5 < a ≤ 12', 'The ends are the wrong way round: 5 is allowed (≤), 12 isn’t (<).'],
    ['5 ≤ a ≤ 12', '“Under 12” means 12 isn’t allowed: use < next to 12.'],
    ['5 < a < 12', '“5 and over” includes 5: use ≤ next to 5.'],
  ])
  practice(twoSided, 'Children aged 5 and over but under 12 can join a club. Let a be a child’s age in years. Write a two-sided inequality for a.', 'A10.2 Q5a', interaction, '“5 and over” includes 5. “Under 12” doesn’t include 12.', lineModel('5 ≤ a < 12', { ticks: ticks(4, 13) }, [
    circle(5, true, '5 and over: 5 is allowed', 'A child of 5 can join, so its circle is filled in.'),
    circle(12, false, 'Under 12: 12 isn’t allowed', 'A child of 12 can’t join, so its circle is open.'),
    shade(5, 12, 'Join the circles', 'Every age between them can join.'),
    answerMove('5 ≤ a < 12', 'Write the two signs', '≤ next to the filled circle, < next to the open one.'),
  ], 'Draw it, then write it'), diagnose)
}
practice(twoSided, `How do you show ${nb('5 ≤ a < 12')} on a number line?`, 'A10.2 Q5b', choose(
  'A filled circle at 5, an open circle at 12, and a line between',
  ['An open circle at 5, a filled circle at 12, and a line between', 'The circles are swapped: 5 has ≤ (filled), 12 has < (open).'],
  ['Filled circles at 5 and 12, and a line between', '12 has <, so it isn’t included: its circle is open.'],
  ['A filled circle at 5, and an arrow pointing right', 'The ages stop under 12, so the line stops at an open circle at 12.'],
), 'Match each circle to the sign next to its number.', lineModel('5 ≤ a < 12', { ticks: ticks(4, 13) }, [
  circle(5, true, '5 has ≤: fill it in', '≤ includes 5 itself.'),
  circle(12, false, '12 has <: leave it open', '< doesn’t include 12.'),
  answerMove('Filled at 5, open at 12, joined', 'Join the circles', 'Every age between them is allowed.', shade(5, 12, '', '')),
], 'Draw it'))
practice(twoSided, `Amara shows ${nb('−3 < x ≤ 2')} with an open circle at 2 and a filled circle at −3. What mistake has she made?`, 'A10.2 Q5c', choose(
  'The circles are the wrong way round: −3 should be open and 2 filled',
  ['Nothing: the circles are right', 'Match each circle to its own sign: −3 has < (open), 2 has ≤ (filled). Hers are swapped.'],
  ['Both circles should be filled', '−3 has <, which doesn’t include −3: that circle is open.'],
  ['The line should be an arrow', 'x is squeezed between −3 and 2, so a line joins the two circles.'],
), 'Look at the sign next to each number.', lineModel('-3 < x ≤ 2', { ticks: ticks(-4, 3) }, [
  circle(-3, false, '−3 has <: an open circle', '< doesn’t include −3.'),
  circle(2, true, '2 has ≤: a filled circle', '≤ includes 2.'),
  answerMove('Amara swapped the circles', 'Compare with Amara’s', 'She drew −3 filled and 2 open: the other way round.', shade(-3, 2, '', '')),
], 'Draw it'))

add('mixed', 'Inequalities', 'A10.1-A10.2 consolidation', text(
  '< less than, > greater than. ≤ and ≥ have a line under them: “or equal to”.',
  'On a number line, a filled circle means the number is included (≤, ≥). An open circle means it isn’t (<, >).',
  'One sign: an arrow off the end, left for smaller, right for bigger. x ≥ −2 is a filled circle at −2 with the arrow pointing right.',
  'Two signs: the smallest number, the letter, the biggest number. Join the two circles with a line. 1 ≤ t < 5 is filled at 1, open at 5.',
))

export const tutorInequalitiesLesson: TutorMethodLesson = {
  id: 'L024', number: 24, title: 'Inequalities', level: 'GCSE Foundation',
  goal: 'Write an inequality from words or a number line, and show one- and two-sided inequalities on a number line.',
  labels: { [numberLine]: 'One sign', [twoSided]: 'Two signs', mixed: 'Review' },
  states: finish(),
}
