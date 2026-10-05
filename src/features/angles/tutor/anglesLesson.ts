import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { choose, number, text } from '../../inequalities/tutor/inequalityWorkings'
import { angleModel, answerMove, atPoint, crossing, figure, onLine, use, type AngleDiagram } from './angleWorkings'

/*
 * Lesson 26 (Geometry G1): Angle facts. Written by Claude, with our own numbers, for the first Geometry lesson; no
 * source pack. Three facts, one rung each, easiest first: angles on a straight line add up to 180°, angles around a
 * point add up to 360°, vertically opposite angles are equal. The video is the kit's G1.1 pack
 * (tools/lesson-kit/packs/G1.1-angle-facts.cjs), which uses all three on one picture.
 */

const { add, finish } = author(26)
const straightLine = 'angles-straight-line'
const aroundPoint = 'angles-around-point'
const opposite = 'angles-vertically-opposite'

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
/** An angle typed as a number of degrees, with `letter =` before the box and ° after it. */
const angle = (value: number, letter: string) => ({ interaction: number(value, `${letter} = ${value}°`), prefix: `${letter} =`, unit: `Size of angle ${letter} (°)` })
/** A value of x typed as a number: x = 36, not an angle. */
const value = (n: number, letter = 'x') => ({ interaction: number(n, `${letter} = ${n}`), prefix: `${letter} =`, unit: undefined })
type Answer = { interaction: InteractionDefinition; prefix?: string; unit?: string }

/** A practice question: its words, its own diagram above the answer box, and its working one move a step. */
function practice(topic: MicroSkillId, title: string, sourceRef: string, diagram: AngleDiagram, answer: Answer, hint: string, model: TutorWorking, slips?: Slip[]) {
  const { interaction } = answer
  const shown = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  const state = add(topic, title, sourceRef, figure(diagram), interaction, working(shown, ...workingSteps(model)), hint)
  state.working = model
  if (answer.prefix) state.answerPrefix = answer.prefix
  if (answer.unit) state.answerLabel = answer.unit
  if (slips) state.diagnose = (response: string) => diagnoseSlips(response, Number(interaction.correctAnswer), slips)
  return state
}
function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: TutorWorking, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  // The picture shows the angles, so the heading is only the instruction (EXPLANATIONS.md rule 1).
  state.content.heading = heading
  return state
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }

/* ---------- Rung 1: angles on a straight line ---------- */

const roads = crossing(25, 70, ['70°', 'a'])
const first = worked(straightLine, 'Two roads cross. One angle is 70°. Work out the size of angle a.', 'Two roads cross: find a', 'G1.1 video + Q1', angleModel('70° and a', roads, [
  use([0, 1], '70° + a = 180°', 'On a straight line', 'The 70° and a sit side by side along one straight road. A straight line is a half turn, so they add up to 180°.'),
  answerMove('a = 110°', 'Take away the 70°', 'Whatever is left of the half turn, once the 70° is used, is a.', 1),
]), 'Angles on a straight line add up to 180°. In an exam, write the reason next to the answer.')
video(first, {
  id: 'lesson26-angle-facts', src: '/media/lesson-26/angle-facts.mp4', poster: '/media/lesson-26/angle-facts.svg',
  title: 'Two roads cross: find every angle', durationSeconds: 72, sourceFile: 'G1.1_Angle_Facts.mp4 (tools/lesson-kit/packs/G1.1-angle-facts.cjs)',
  textAlternative: [
    'Two roads cross. One angle is 70°. Find the other three: a next to it, b opposite it, and c opposite a.',
    'Fact 1: angles on a straight line add up to 180°, a half turn. a and 70° sit together on one straight road, so 70 + a = 180. Take 70 from both sides: a = 110°.',
    'Fact 2: where two lines cross, the angles opposite each other are equal. b is opposite the 70°, so b = 70°. c is opposite a, so c = 110°.',
    'Fact 3: angles around a point add up to 360°, a full turn. Check: 70 + 110 + 70 + 110 = 360.',
    'In an exam, give the fact you used as the reason: a = 110° because angles on a straight line add up to 180°; b = 70° because vertically opposite angles are equal.',
    'So a = 110°, b = 70° and c = 110°.',
  ],
})
{
  const diagram = onLine([45], ['x', '135°'])
  practice(straightLine, 'The angles are on a straight line. Work out the size of angle x.', 'G1.1 Q2', diagram, angle(45, 'x'), 'A straight line is a half turn: 180°.', angleModel('135° and x', diagram, [
    use([0, 1], '135° + x = 180°', 'On a straight line', 'x and 135° make a half turn together, so they add up to 180°.'),
    answerMove('x = 45°', 'Take away the 135°', 'What is left of the 180° is x.', 0),
  ]), [[225, 'That uses 360°. These angles are on a straight line, so they add up to 180°.'], [135, 'x is the other angle on the line. The two angles add up to 180°.'], [55, 'Check the take-away: 135 + 55 is 190, not 180.']])
}
{
  const diagram = onLine([67, 132], ['67°', 'x', '48°'])
  practice(straightLine, 'Three angles sit on a straight line. Work out the size of angle x.', 'G1.1 Q4', diagram, angle(65, 'x'), 'Add the two angles you know first. All three add up to 180°.', angleModel('67°, x and 48°', diagram, [
    use([0, 2], '67° + 48° = 115°', 'Add the angles you know', 'Put the two angles you know together first.'),
    answerMove('x = 65°', 'Take it from 180°', 'All three sit on the straight line, so x is what is left of 180°.', 1),
  ]), [[245, 'That uses 360°. The angles are on a straight line, so they add up to 180°.'], [113, 'That only takes away the 67°. Take away the 48° too.'], [132, 'That only takes away the 48°. Take away the 67° too.'], [115, 'That is the two angles you know added. x is what is left of 180°.']])
}
{
  const diagram = onLine([108], ['3x', '2x'])
  practice(straightLine, 'Two angles on a straight line are 2x and 3x. Work out the value of x.', 'G1.1 Q6', diagram, value(36), 'They add up to 180°. How many lots of x are there altogether?', angleModel('2x and 3x', diagram, [
    use([0, 1], '2x + 3x = 180°', 'On a straight line', 'The two angles make a half turn, so they add up to 180°.'),
    use([], '5x = 180°', 'Collect the x’s', 'Two lots of x and three lots of x make five lots of x.'),
    answerMove('x = 36', 'Share 180 into five', 'Divide both sides by 5 to find one lot of x.'),
  ]), [[72, 'That’s 2x, one of the angles. x is half of it.'], [108, 'That’s 3x, one of the angles. x is a third of it.'], [90, 'There are five lots of x altogether: 2x + 3x = 5x.']])
}
practice(straightLine, 'Two angles of 100° and 70° meet along a line. Is it a straight line?', 'G1.1 extra (is it straight?)', atPoint([0, 100, 170], ['100°', '70°', '']), { interaction: choose(
  'No: 100° + 70° = 170°, and a straight line needs 180°',
  ['Yes: it looks straight', 'Diagrams aren’t drawn accurately, so check the numbers: 100° + 70° is 170°, not 180°.'],
  ['Yes: 170° is close to 180°', 'Close isn’t enough. A straight line is exactly 180°.'],
  ['No: angles on a straight line add up to 360°', '360° is a full turn, around a point. A straight line is 180°.'],
) }, 'Add the two angles. What must they add up to on a straight line?', angleModel('100° and 70°', atPoint([0, 100, 170], ['100°', '70°', '']), [
  use([0, 1], '100° + 70° = 170°', 'Add the two angles', 'Put the two angles together and compare with a straight line.'),
  answerMove('Not straight: 170° isn’t 180°', 'Compare with 180°', 'A straight line is exactly 180°, so these two can’t make one.'),
]))

/* ---------- Rung 2: angles around a point ---------- */

{
  const diagram = atPoint([10, 100, 240, 315], ['90°', '140°', '75°', 'z'])
  worked(aroundPoint, 'Four angles meet at a point. Work out the size of angle z.', 'Four angles meet: find z', 'G1.1 Q5', angleModel('90°, 140°, 75° and z', diagram, [
    use([0, 1, 2], '90° + 140° + 75° = 305°', 'Add the angles you know', 'Put together the three angles you know.'),
    answerMove('z = 55°', 'Take it from 360°', 'All four angles make a full turn, 360°. What is left is z.', 3),
  ]), 'Angles around a point add up to 360°: a full turn. The square in the corner means a right angle, 90°.')
}
{
  const diagram = atPoint([20, 145, 295], ['125°', '150°', 'y'])
  practice(aroundPoint, 'Three angles meet at a point. Work out the size of angle y.', 'G1.1 extra (point, three angles)', diagram, angle(85, 'y'), 'A full turn is 360°.', angleModel('125°, 150° and y', diagram, [
    use([0, 1], '125° + 150° = 275°', 'Add the angles you know', 'Put the two angles you know together first.'),
    answerMove('y = 85°', 'Take it from 360°', 'The three angles make a full turn, so y is what is left of 360°.', 2),
  ]), [[275, 'That is the two angles added. y is what is left of 360°.'], [-95, 'Around a point is a full turn: 360°, not 180°.'], [95, 'Check the take-away: 275 + 95 is 370, not 360.']])
}
{
  const diagram = atPoint([0, 72, 144, 216, 288], ['x', 'x', 'x', 'x', 'x'])
  practice(aroundPoint, 'Five equal angles, each x, meet at a point. Work out the value of x.', 'G1.1 extra (equal angles)', diagram, angle(72, 'x'), 'Five equal angles make a full turn.', angleModel('five angles of x', diagram, [
    use([0, 1, 2, 3, 4], '5x = 360°', 'Around a point', 'Five equal angles make a full turn, 360°.'),
    answerMove('x = 72°', 'Share 360 into five', 'Divide both sides by 5 to find one angle.'),
  ]), [[36, 'Around a point is a full turn: 360°, not 180°.'], [1800, 'Divide 360 by 5, don’t multiply.']])
}
{
  const diagram = atPoint([30, 122, 260], ['2x', '3x', '130°'])
  practice(aroundPoint, 'Three angles meet at a point: 2x, 3x and 130°. Work out the value of x.', 'G1.1 Q7a', diagram, value(46), 'All three add up to 360°. Collect the x’s, then take away the 130°.', angleModel('2x, 3x and 130°', diagram, [
    use([0, 1, 2], '2x + 3x + 130° = 360°', 'Around a point', 'The three angles make a full turn, so they add up to 360°.'),
    use([], '5x + 130° = 360°', 'Collect the x’s', 'Two lots of x and three lots of x make five lots of x.'),
    use([], '5x = 230°', 'Take away the 130°', 'Take 130 from both sides, so only the x’s are left.'),
    answerMove('x = 46', 'Share 230 into five', 'Divide both sides by 5 to find one lot of x.'),
  ]), [[92, 'That’s 2x, one of the angles. x is half of it.'], [138, 'That’s 3x, one of the angles. x is a third of it.'], [230, 'That’s 5x. Divide by 5 to find x.'], [10, 'Around a point is a full turn: 360°, not 180°.']])
}
practice(aroundPoint, 'Jay says the angles around a point add up to 180°. Is Jay right?', 'G1.1 extra (Jay)', atPoint([30, 150, 270], ['120°', '120°', '120°']), { interaction: choose(
  'No: around a point is a full turn, 360°',
  ['Yes: angles always add up to 180°', '180° is a straight line, a half turn. Around a point is a full turn.'],
  ['No: they add up to 90°', '90° is a right angle, a quarter turn. Around a point is a full turn.'],
  ['Yes: 120° + 120° is less than 180°', 'All three angles count: 120° + 120° + 120° is 360°.'],
) }, 'Think of turning all the way round once.', angleModel('three angles of 120°', atPoint([30, 150, 270], ['120°', '120°', '120°']), [
  use([0, 1, 2], '120° + 120° + 120° = 360°', 'Add all the angles', 'Put together every angle around the point.'),
  answerMove('No: a full turn is 360°', 'A full turn', 'Going all the way round the point is a full turn: 360°. 180° is a straight line.'),
]))

/* ---------- Rung 3: vertically opposite angles ---------- */

{
  const diagram = crossing(30, 58, ['58°', '', 'y'])
  worked(opposite, 'Two straight lines cross. Write down the size of angle y.', 'Two lines cross: find y', 'G1.1 Q3', angleModel('58° and y', diagram, [
    use([0, 2], 'y is opposite 58°', 'Opposite each other', 'Where two straight lines cross, the angles opposite each other are equal.'),
    answerMove('y = 58°', 'Opposite angles are equal', 'Reason: vertically opposite angles are equal.', 2),
  ]), 'Vertically opposite angles are equal. They sit across the point from each other, like the blades of open scissors.')
}
{
  const diagram = crossing(20, 125, ['125°', '', 'p'])
  practice(opposite, 'Two straight lines cross. Write down the size of angle p.', 'G1.1 extra (opposite 125°)', diagram, angle(125, 'p'), 'p is across the point from the 125°.', angleModel('125° and p', diagram, [
    use([0, 2], 'p is opposite 125°', 'Opposite each other', 'p and the 125° sit across the point from each other.'),
    answerMove('p = 125°', 'Opposite angles are equal', 'Vertically opposite angles are equal.', 2),
  ]), [[55, 'That’s the angle next to the 125°, on a straight line. p is opposite it, so it is equal.'], [235, 'p is opposite the 125°, so it is the same size.']])
}
{
  const diagram = crossing(35, 40, ['40°', 'q'])
  practice(opposite, 'Two straight lines cross. Work out the size of angle q.', 'G1.1 extra (next to 40°)', diagram, angle(140, 'q'), 'Is q opposite the 40°, or next to it?', angleModel('40° and q', diagram, [
    use([0, 1], '40° + q = 180°', 'On a straight line', 'q is next to the 40°, not opposite. They sit along one straight line, so they add up to 180°.'),
    answerMove('q = 140°', 'Take away the 40°', 'What is left of the half turn is q.', 1),
  ]), [[40, 'q is next to the 40°, not opposite it. They are on a straight line, so they add up to 180°.'], [320, 'That uses 360°. q and the 40° are on a straight line: 180°.']])
}
{
  const diagram = crossing(25, 84, ['84°', '', '3x'])
  practice(opposite, 'Two straight lines cross. The angle opposite 84° is 3x. Work out the value of x.', 'G1.1 extra (3x opposite)', diagram, value(28), 'Opposite angles are equal, so 3x is 84°.', angleModel('84° and 3x', diagram, [
    use([0, 2], '3x = 84°', 'Opposite angles are equal', '3x is across the point from the 84°, so they are the same size.'),
    answerMove('x = 28', 'Share 84 into three', 'Divide both sides by 3 to find one lot of x.'),
  ]), [[84, 'That’s 3x, the angle. x is a third of it.'], [252, 'Divide 84 by 3, don’t multiply.'], [32, '3x is opposite the 84°, so it is equal to it, not 180° − 84°.']])
}
practice(opposite, 'Two straight lines cross. One angle is 125°. Mia says the angle opposite it is 55°, because they add up to 180°. Is Mia correct?', 'G1.1 Q7b', crossing(20, 125, ['125°', '', '?']), { interaction: choose(
  'No: opposite angles are equal, so it is 125°. 55° is the angle next to it',
  ['Yes: angles add up to 180°', 'Only angles next to each other on a straight line add up to 180°. Opposite angles are equal.'],
  ['No: it is 235°, because they add up to 360°', 'All four angles add up to 360°, not these two. Opposite angles are equal.'],
  ['Yes: opposite angles add up to 180°', 'Opposite angles are equal. The ones that add up to 180° are next to each other.'],
) }, 'Is the angle opposite, or next to the 125°?', angleModel('125° and the angle opposite', crossing(20, 125, ['125°', '', '?']), [
  use([0, 2], 'opposite 125°', 'Opposite each other', 'Across the point from the 125°: vertically opposite angles are equal.'),
  answerMove('Not correct: it is 125°', 'Opposite angles are equal', 'Mia used the straight-line fact, which is for the angle next to it.', 2, '125°'),
]))

add('mixed', 'Angle facts', 'G1.1 consolidation', text(
  'On a straight line, angles add up to 180°: a half turn.',
  'Around a point, angles add up to 360°: a full turn.',
  'Where two straight lines cross, vertically opposite angles are equal.',
  'In an exam, give the fact as your reason: “angles on a straight line add up to 180°”.',
))

export const tutorAnglesLesson: TutorMethodLesson = {
  id: 'L026', number: 26, title: 'Angle facts', level: 'GCSE Foundation',
  goal: 'Find missing angles on a straight line, around a point and where two lines cross, and give the reason.',
  labels: { [straightLine]: 'On a straight line', [aroundPoint]: 'Around a point', [opposite]: 'Opposite angles', mixed: 'Review' },
  states: finish(),
}
