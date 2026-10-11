import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { boardModel, choose, number, text, type BoardMove } from '../../simultaneous-equations/tutor/boardWorkings'

/*
 * Lesson 35 (Number): Calculating with negative numbers. Not in Aniksha's book, so written for Revily with our own
 * numbers in the book's style (Sunny, 11 Oct): AQA 8300 N2 asks for all four operations with negative numbers, and
 * no other lesson taught them. Four rungs: adding and subtracting on a number line, two signs next to each other,
 * multiplying and dividing, and problems in context (temperatures, money, floors). Workings are on the A5 board.
 */

const { add, finish } = author(35)
const line = 'negatives-number-line'
const signs = 'negatives-two-signs'
const times = 'negatives-multiply-divide'
const problems = 'negatives-problems'

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
const board = (moves: BoardMove[], label = 'Work it out') => boardModel([], moves, label)
/** A question: its words above the answer, and the board working once answered. */
function practice(topic: MicroSkillId, title: string, interaction: InteractionDefinition, hint: string, model: TutorWorking, list: Slip[] = []) {
  const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  const state = add(topic, title, 'Revily (own numbers)', text(title), interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  const right = Number(interaction.correctAnswer)
  if (list.length && interaction.type === 'numericInput') state.diagnose = (response: string) => diagnoseSlips(response, right, list)
  return state
}
function worked(topic: MicroSkillId, title: string, heading: string, model: TutorWorking, body: string) {
  const state = add(topic, title, 'Revily (own numbers)', model, undefined, undefined, undefined, body)
  state.content.heading = heading
  return state
}

/* ---------- Rung 1: adding and subtracting on a number line ---------- */

worked(line, 'Work out −3 + 7.', '−3 + 7', board([
  { title: 'Start at −3', say: 'Find −3 on the number line: 3 below zero.', rows: ['>0 Start at −3'] },
  { title: 'Add 7: move up 7', say: 'Adding moves up the number line. 3 steps up gets you to 0, and 4 more gets you to 4.', rows: ['−3 + 3 = 0', '0 + 4 = 4', '! −3 + 7 = 4'] },
]), 'Our aim: on a number line, adding moves up and subtracting moves down. Zero is a handy stop on the way.')
practice(line, 'Work out −8 + 5.', number(-3, '−3'), 'Start at −8 and move up 5.', board([
  { title: 'Start at −8, move up 5', say: 'Moving up 5 from −8 does not reach zero: you stop 3 below it.', rows: ['−8 + 5 = −3', '! −3'] },
]), [[3, 'Moving up 5 from −8 stops before zero, so the answer is still negative: −3.'], [-13, 'Adding moves up the number line, towards zero: −8 + 5 = −3.']])
practice(line, 'Work out 4 − 9.', number(-5, '−5'), 'Start at 4 and move down 9. You pass zero.', board([
  { title: 'Down to zero', say: 'Start at 4. 4 steps down gets you to 0.', rows: ['4 − 4 = 0'] },
  { title: 'Then 5 more', say: 'You still have 5 steps to go, so you end 5 below zero.', rows: ['0 − 5 = −5', '! 4 − 9 = −5'] },
]), [[5, 'Taking away more than you have goes below zero: 4 − 9 = −5.'], [13, 'Subtracting moves down: 4 − 9 = −5.']])
practice(line, 'Work out −2 − 6.', number(-8, '−8'), 'You start below zero and move further down.', board([
  { title: 'Start at −2, move down 6', say: 'Subtracting moves down, so you go further below zero.', rows: ['−2 − 6 = −8', '! −8'] },
]), [[4, 'Start at −2 and go down 6: further below zero, to −8.'], [-4, 'Go down 6 from −2: −3, −4, −5, −6, −7, −8.'], [8, 'Keep the minus sign: both moves are downwards.']])
practice(line, 'Work out −15 + 9 − 4.', number(-10, '−10'), 'One step at a time, left to right.', board([
  { title: 'Add 9', say: 'Start at −15 and move up 9.', rows: ['−15 + 9 = −6'] },
  { title: 'Take away 4', say: 'Now move down 4 from −6.', rows: ['−6 − 4 = −10', '! −10'] },
]), [[-2, '−6 − 4 goes further below zero, to −10.'], [-6, 'That’s after adding 9. Now take away 4.']])

/* ---------- Rung 2: two signs next to each other ---------- */

worked(signs, 'Work out 6 − (−4).', '6 − (−4)', board([
  { title: 'Two signs together', say: 'Look at the two signs between the numbers: a minus, then a negative. Two signs that are different make a minus. Two signs that are the same make a plus.', rows: ['>0 − and − are the same: they make +'] },
  { title: 'Rewrite, then work it out', say: 'Taking away a negative is the same as adding. 6 − (−4) becomes 6 + 4.', rows: ['6 − (−4) = 6 + 4', '= 10', '! 10'] },
]), 'Our aim: when two signs sit next to each other, swap them for one. Same signs make +. Different signs make −.')
practice(signs, 'Work out 3 + (−8).', number(-5, '−5'), '+ and − are different, so they make −.', board([
  { title: 'Swap the two signs', say: '+ then − are different signs, so they make −.', rows: ['3 + (−8) = 3 − 8'] },
  { title: 'Work it out', say: 'Start at 3 and move down 8.', rows: ['3 − 8 = −5', '! −5'] },
]), [[11, '+ and − make −: 3 + (−8) is 3 − 8 = −5.'], [5, '3 − 8 goes below zero: −5.']])
practice(signs, 'Work out −7 − (−2).', number(-5, '−5'), '− and − are the same, so they make +.', board([
  { title: 'Swap the two signs', say: '− then − are the same, so they make +.', rows: ['−7 − (−2) = −7 + 2'] },
  { title: 'Work it out', say: 'Start at −7 and move up 2.', rows: ['−7 + 2 = −5', '! −5'] },
]), [[-9, 'Taking away a negative means adding: −7 + 2 = −5.'], [5, 'Start at −7 and move up 2: you are still below zero, at −5.']])
practice(signs, 'Work out −4 + (−9).', number(-13, '−13'), '+ and − are different, so they make −.', board([
  { title: 'Swap the two signs', say: '+ then − make −.', rows: ['−4 + (−9) = −4 − 9'] },
  { title: 'Work it out', say: 'Start at −4 and move down 9.', rows: ['−4 − 9 = −13', '! −13'] },
]), [[5, 'Adding a negative means taking away: −4 − 9 = −13.'], [-5, 'Adding a negative means taking away: −4 − 9 = −13.']])
practice(signs, 'Which of these is the same as 10 − (−3)?', choose(
  '10 + 3',
  ['10 − 3', 'The − and − are the same signs, so they make +, not −.'],
  ['−10 + 3', 'The 10 doesn’t change. Only the two signs in the middle swap.'],
  ['−10 − 3', 'The 10 doesn’t change, and − − makes +.'],
), 'Same signs make +.', board([
  { title: 'Swap the two signs', say: '− then − are the same, so they make +.', rows: ['10 − (−3) = 10 + 3', '! 10 + 3 = 13'] },
], 'Why'))

/* ---------- Rung 3: multiplying and dividing ---------- */

worked(times, 'Work out −6 × 4 and −20 ÷ −5.', '−6 × 4 and −20 ÷ −5', board([
  { title: 'Multiply the numbers', say: 'Ignore the signs at first: 6 × 4 = 24.', rows: ['6 × 4 = 24'] },
  { title: 'Then the sign', say: 'The signs are different, a negative times a positive, so the answer is negative.', rows: ['−6 × 4 = −24'] },
  { title: 'Dividing works the same way', say: '20 ÷ 5 = 4. The signs are the same, both negative, so the answer is positive.', rows: ['−20 ÷ −5 = 4', '! −24 and 4'] },
]), 'Our aim: when you multiply or divide, work out the numbers first, then the sign. Same signs give a positive answer. Different signs give a negative answer.')
practice(times, 'Work out −7 × −3.', number(21, '21'), 'Same signs give a positive answer.', board([
  { title: 'Numbers, then sign', say: '7 × 3 = 21. Both are negative, the same sign, so the answer is positive.', rows: ['−7 × −3 = 21', '! 21'] },
]), [[-21, 'A negative times a negative is positive: 21.'], [-10, 'This is multiplying, not adding: 7 × 3 = 21.']])
practice(times, 'Work out 36 ÷ −9.', number(-4, '−4'), 'Different signs give a negative answer.', board([
  { title: 'Numbers, then sign', say: '36 ÷ 9 = 4. One positive and one negative, different signs, so the answer is negative.', rows: ['36 ÷ −9 = −4', '! −4'] },
]), [[4, 'The signs are different, so the answer is negative: −4.']])
practice(times, 'Work out (−5)².', number(25, '25'), 'Squaring means times itself: (−5) × (−5).', board([
  { title: 'Write it as a multiplication', say: 'Squaring means multiplying the number by itself.', rows: ['(−5)² = −5 × −5'] },
  { title: 'Numbers, then sign', say: '5 × 5 = 25, and a negative times a negative is positive.', rows: ['−5 × −5 = 25', '! 25'] },
]), [[-25, '(−5)² is −5 × −5, and two negatives make a positive: 25.'], [-10, 'Squaring is −5 × −5, not −5 × 2.'], [10, 'Squaring is −5 × −5, not 5 × 2.']])
practice(times, 'Work out −2 × −3 × −4.', number(-24, '−24'), 'Two numbers at a time.', board([
  { title: 'The first two', say: '−2 × −3: same signs, so positive 6.', rows: ['−2 × −3 = 6'] },
  { title: 'Then the third', say: '6 × −4: different signs, so negative 24.', rows: ['6 × −4 = −24', '! −24'] },
]), [[24, 'Two at a time: −2 × −3 = 6, then 6 × −4 = −24.']])

/* ---------- Rung 4: problems ---------- */

worked(problems, 'At 6 am the temperature was −4°C. By midday it was 9°C. How many degrees did the temperature rise?', 'From −4°C to 9°C', board([
  { title: 'Up to zero', say: 'Count up from −4 to 0: that is 4 degrees.', rows: ['>0 −4 to 0 is 4 degrees'] },
  { title: 'Then on to 9', say: 'From 0 up to 9 is 9 more degrees. Add the two parts.', rows: ['4 + 9 = 13', '! It rose 13°C'] },
]), 'Our aim: the difference between two numbers is the bigger one take away the smaller one: 9 − (−4) = 9 + 4 = 13. Counting through zero gives the same answer.')
practice(problems, 'Ana has −£35 in her bank account. She pays in £60. How much is in her account now?', number(25, '£25'), 'Start at −35 and move up 60.', board([
  { title: 'Pay in £60', say: 'Paying in moves her balance up. 35 of it gets her back to £0, and £25 is left over.', rows: ['−35 + 60 = 25', '! £25'] },
]), [[-95, 'Paying money in moves the balance up: −35 + 60 = 25.'], [95, 'Start at −35, not 35: −35 + 60 = 25.'], [-25, 'Paying in £60 takes her above zero: £25.']])
practice(problems, 'A lift is on floor 3. It goes down 5 floors. Which floor is it on now? (Floor −1 is the first floor below ground.)', number(-2, '−2'), 'Start at 3 and move down 5.', board([
  { title: 'Down 5 floors', say: '3 floors down gets to the ground, floor 0. 2 more floors down is floor −2.', rows: ['3 − 5 = −2', '! Floor −2'] },
]), [[2, 'Going down 5 floors from floor 3 takes the lift below ground: floor −2.'], [8, 'The lift goes down, so subtract: 3 − 5 = −2.']])
practice(problems, 'In Oslo it is −7°C. In Rome it is 15°C. What is the difference in temperature?', number(22, '22°C'), 'Bigger take away smaller: 15 − (−7).', board([
  { title: 'Bigger take away smaller', say: 'The difference is 15 − (−7). Same signs make +.', rows: ['15 − (−7) = 15 + 7', '= 22', '! 22°C'] },
]), [[8, '15 − (−7) is 15 + 7: count 7 up to zero, then 15 more. 22°C.'], [-22, 'A difference is a distance, so it is positive: 22°C.']])
practice(problems, 'The temperature at night was −3°C. It fell by 6 degrees before morning. What was the temperature in the morning?', number(-9, '−9°C'), 'Falling means moving down.', board([
  { title: 'Fall 6 degrees', say: 'Falling means subtracting. Start at −3 and go down 6.', rows: ['−3 − 6 = −9', '! −9°C'] },
]), [[3, 'It fell, so move down from −3: −3 − 6 = −9.'], [9, 'Keep the minus sign: −3 − 6 = −9.'], [-3, 'Go down 6 from −3: −9.']])

add('mixed', 'Negative numbers', 'Revily consolidation', text(
  'Adding moves up the number line. Subtracting moves down. Zero is a handy stop on the way.',
  'Two signs next to each other: same signs make +, different signs make −. So 6 − (−4) = 6 + 4.',
  'Multiplying and dividing: do the numbers first, then the sign. Same signs give a positive answer; different signs give a negative answer.',
  'A difference is the bigger number take away the smaller: from −4 to 9 is 9 − (−4) = 13.',
))

export const tutorNegativesLesson: TutorMethodLesson = {
  id: 'L035', number: 35, title: 'Negative numbers', level: 'GCSE Foundation',
  goal: 'Add, subtract, multiply and divide with negative numbers, and use them for temperatures, money and floors.',
  labels: { [line]: 'Adding and subtracting', [signs]: 'Two signs together', [times]: 'Multiplying and dividing', [problems]: 'Problems', mixed: 'Review' },
  states: finish(),
}
