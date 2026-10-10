import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorMethodState, TutorMethodVisual, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { boardModel, choose, number, pair, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { piece, squareModel } from './percentSquare'

/*
 * Lesson 32 (Ratio R3): Percentages, from Aniksha's R3.1–R3.4 PDFs and videos. Four rungs in the PDFs' order: a
 * percentage of an amount, a percentage increase, a percentage decrease and a percentage change. One method throughout
 * (Sunny, 8 Oct): find 1%, then multiply by the percentage wanted (100% + the rise, or what is left after a fall).
 * Those workings draw the videos' hundred square above the A5 board (PercentPictures.tsx), one colour only: the whole
 * is 100 squares, so 1% is 1 square. Multipliers and percentage change work on the board alone.
 */

const { add, finish } = author(32)
const ofAmount = 'percentage-of-amount'
const increase = 'percentage-increase'
const decrease = 'percentage-decrease'
const change = 'percentage-change'

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
/** A question: its hundred square above the answer when its working has one (or its words), and the working once answered. */
function practice(topic: MicroSkillId, title: string, sourceRef: string, interaction: InteractionDefinition, hint: string, model: TutorWorking, diagnose?: (response: string) => string | null) {
  faded(model)
  const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  const opening = model.kind === 'method-worked' ? model.examples[0].steps[0]?.frame.percent?.before : undefined
  const visual: TutorMethodVisual = opening ? { kind: 'percent', percent: opening } : text(title)
  const state = add(topic, title, sourceRef, visual, interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  if (diagnose) state.diagnose = diagnose
  return state
}
/** Sunny (8 Oct): every finished row greys out, since a percentage step rarely works on just the row above it. */
function faded(model: TutorWorking) {
  if (model.kind === 'method-worked') model.examples.forEach(example => { example.focus = 'all' })
  return model
}
function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: TutorWorking, body: string) {
  faded(model)
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  state.content.heading = heading
  return state
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }
const media = (name: string, title: string, sourceFile: string, durationSeconds: number, textAlternative: string[]) => ({
  id: `lesson32-${name}`, src: `/media/lesson-32/${name}.mp4`, poster: `/media/lesson-32/${name}.svg`, title, durationSeconds, sourceFile, textAlternative,
})
const slips = (right: number, list: Slip[]) => (response: string) => diagnoseSlips(response, right, list)
const pounds = (state: TutorMethodState) => { state.answerPrefix = '£'; return state }
const percent = (state: TutorMethodState) => { state.answerPrefix = '%'; return state }
/** A multiplier and the new price, typed in two boxes. */
const multiplier = (answer: [number, number], shown: string) => pair(['multiplier', 'new price £'], answer, shown)

/* ---------- Rung 1: a percentage of an amount (R3.1) ---------- */

const trainers = worked(ofAmount, 'A pair of trainers costs £80. A shop takes 23% off. Work out 23% of £80.', 'Work out 23% of £80.', 'R3.1 video + Q1', squareModel('£80', [
  { title: 'Find 1%', say: 'Per cent means out of 100, so the whole £80 is 100 squares. 1% is 1 square: divide by 100.', rows: ['80 ÷ 100 = 0.80'], pieces: [piece(1, '1% = £0.80')] },
  { title: 'Multiply by 23', say: '23% is 23 squares, so 23 lots of 1%.', rows: ['23 × 0.80 = 18.40', '! £18.40'], pieces: [piece(23, '23% = £18.40')], note: '23 squares = £18.40' },
]), 'Our aim: find 1%, then multiply by the percentage you want.')
video(trainers, media('of-amount', 'Work out 23% of £80', 'R3.1_Percentage_Of_An_Amount.mp4', 104, [
  'A trainers discount: trainers cost £80, and the shop takes 23% off. How much is 23% of £80?',
  'What does 23% mean? Per cent means out of 100: 23% is 23 out of every 100. 100% is the whole £80, and we want 23 hundredths of it. No calculator? Break 23% into 10%, 10%, 1%, 1%, 1%.',
  'See it in 100 squares: 100 squares make the whole £80, so each square is 1% = £0.80. 10 squares are 10% = £8, another 10 squares are £8, and 3 more squares are 3% = £2.40. 23 squares are 23% = £18.40.',
  'Find 10%, 5% and 1%: 10% of £80 = 80 ÷ 10 = £8. 5% is half of 10%: 8 ÷ 2 = £4. 1% is 10% divided by 10: £0.80.',
  'Build 23% from the pieces: 10% + 10% + 1% + 1% + 1% = £8 + £8 + £0.80 + £0.80 + £0.80 = £16 + £2.40 = £18.40.',
  'Check it: on a calculator, 23% = 0.23 and 0.23 × 80 = 18.40. A quarter, 25%, would be £20, and £18.40 is a bit less. The trainers now cost £80 − £18.40 = £61.60.',
  'Where you see it: the price tag changes from £80 to £61.60. 23% of £80 is £18.40 off.',
  'Well done: 10% is divide by 10, 1% is divide by 100, then add the pieces to build the percentage. The answer is £18.40.',
]))
practice(ofAmount, 'A cinema has 300 seats. 40% of the seats are taken. How many seats are taken?', 'R3.1 Q2', number(120, '120 seats'), '1% of 300 is 3. Multiply by 40.', squareModel('300 seats', [
  { title: 'Find 1%', say: 'The 300 seats are 100 squares. 1% is 1 square: divide by 100.', rows: ['300 ÷ 100 = 3'], pieces: [piece(1, '1% = 3')] },
  { title: 'Multiply by 40', say: '40% is 40 lots of 1%.', rows: ['40 × 3 = 120', '! 120 seats'], pieces: [piece(40, '40% = 120')], note: '40 squares = 120 seats' },
]), slips(120, [[30, 'That’s 10%. 40% is 40 lots of 1%: 40 × 3.'], [12, '1% of 300 is 3 seats, not 0.3. 40% is 40 × 3.'], [180, 'That’s the seats left. The question asks how many are taken.']]))
pounds(practice(ofAmount, 'A phone bill is £64. 35% of the bill is for calls. Work out how much of the bill is for calls.', 'R3.1 Q3', number(22.4, '£22.40'), '1% of £64 is £0.64. Multiply by 35.', squareModel('£64', [
  { title: 'Find 1%', say: 'The whole £64 is 100 squares. 1% is 1 square: divide by 100.', rows: ['64 ÷ 100 = 0.64'], pieces: [piece(1, '1% = £0.64')] },
  { title: 'Multiply by 35', say: '35% is 35 lots of 1%.', rows: ['35 × 0.64 = 22.40', '! £22.40'], pieces: [piece(35, '35% = £22.40')], note: '35 squares = £22.40' },
]), slips(22.4, [[6.4, 'That’s 10%. 35% is 35 lots of 1%: 35 × 0.64.'], [19.2, 'That’s 30%. 35% is 35 lots of 1%: 35 × 0.64.'], [41.6, 'That’s what is left. The question asks for the calls, 35%.']])))
practice(ofAmount, 'A school has 850 pupils. 18% of the pupils walk to school. Work out how many pupils walk to school.', 'R3.1 Q4a', number(153, '153 pupils'), '1% of 850 is 8.5. Multiply by 18.', squareModel('850', [
  { title: 'Find 1%', say: 'The 850 pupils are 100 squares. 1% is 1 square: divide by 100.', rows: ['850 ÷ 100 = 8.5'], pieces: [piece(1, '1% = 8.5')] },
  { title: 'Multiply by 18', say: '18% is 18 lots of 1%.', rows: ['18 × 8.5 = 153', '! 153 pupils'], pieces: [piece(18, '18% = 153')], note: '18 squares = 153 pupils' },
]), slips(153, [[85, 'That’s 10%. 18% is 18 lots of 1%: 18 × 8.5.'], [127.5, 'That’s 15%. 18% is 18 lots of 1%: 18 × 8.5.'], [697, 'That’s the pupils who don’t walk. The question asks for the 18% who do.']]))
practice(ofAmount, 'Use a calculator to check that 18% of 850 is 153. First write 18% as a decimal. What is 18% as a decimal?', 'R3.1 Q4b', number(0.18, '0.18'), 'Per cent means out of 100: divide 18 by 100.', boardModel([], [
  { title: 'Per cent to decimal', say: 'Per cent means out of 100, so divide by 100.', rows: ['18 ÷ 100 = 0.18'] },
  { title: 'Check on a calculator', say: 'Multiply the amount by the decimal. It gives 153 again.', rows: ['0.18 × 850 = 153', '! 0.18'] },
]), slips(0.18, [[1.8, '18 ÷ 100 is 0.18: move the digits two places, not one.'], [18, 'Write it as a decimal: divide 18 by 100.'], [0.018, '18 ÷ 100 is 0.18, not 0.018.']]))
pounds(practice(ofAmount, 'A coat costs £120. In a sale it has 35% off. Work out the sale price of the coat.', 'R3.1 Q5a', number(78, '£78'), '35% off leaves 65% to pay. Find 1%, then multiply by 65.', squareModel('£120', [
  { title: 'Find 1%', say: 'The whole £120 is 100 squares. 1% is 1 square: divide by 100.', rows: ['120 ÷ 100 = 1.20'], pieces: [piece(1, '1% = £1.20')] },
  { title: 'Multiply by 65', say: '35% off leaves 100% − 35% = 65% to pay: 65 lots of 1%.', rows: ['65 × 1.20 = 78', '! £78'], pieces: [piece(65, '65% = £78')], note: '65 squares are left = £78' },
]), slips(78, [[42, 'That’s the 35% taken off. The sale price is what is left: 120 − 42.'], [85, '35% of £120 is £42, not £35. 1% is £1.20, and you pay 65 lots of it.'], [162, 'It’s a sale: take the 35% off, don’t add it on.']])))
practice(ofAmount, 'The first shop sells the coat for £78. A second shop sells the same £120 coat with 1/3 off. Which shop is cheaper?', 'R3.1 Q5b', choose(
  'The first shop: £78 is less than £80',
  ['The second shop: 1/3 off is more than 35% off', '1/3 is about 33%, less than 35%. The second shop charges 120 − 40 = £80, more than £78.'],
  ['They cost the same', '1/3 of £120 is £40, so the second shop charges £80, not £78.'],
), 'Work out 1/3 of £120, and take it off.', boardModel([], [
  { title: 'Find 1/3', say: 'A third of £120: divide by 3.', rows: ['120 ÷ 3 = 40'] },
  { title: 'Take it off', say: 'The second shop takes £40 off. Compare with the first shop’s £78.', rows: ['120 − 40 = 80', '> £78 is less than £80', '! The first shop'] },
], 'Compare'))
practice(ofAmount, 'Ella says, “23% of £80 is £18.40, so 23% of £40 is £9.20 and 46% of £80 is £36.80.” Is Ella correct?', 'R3.1 Q5c', choose(
  'Yes: half the amount halves the answer, and double the percentage doubles it',
  ['No: 23% of £40 is £18.40 too', 'The percentage stays 23%, but the amount halves, so the answer halves: £9.20.'],
  ['No: 46% of £80 is £18.40 + 2 = £20.40', 'Doubling the percentage doubles the answer: 18.40 × 2 = £36.80.'],
  ['Only the first part is right', '46% is 2 lots of 23%, so 46% of £80 is 2 × 18.40 = £36.80. Both are right.'],
), 'Halve the £18.40 for half the amount. Double it for double the percentage.', boardModel([], [
  { title: 'Half the amount', say: '£40 is half of £80, so 23% of it is half of £18.40.', rows: ['18.40 ÷ 2 = 9.20'] },
  { title: 'Double the percentage', say: '46% is 2 lots of 23%, so double the £18.40.', rows: ['18.40 × 2 = 36.80', '! Ella is right'] },
], 'Check'))

/* ---------- Rung 2: a percentage increase (R3.2) ---------- */

const rent = worked(increase, 'Rent is £600 a month. The landlord increases the rent by 15%. Work out the new rent.', '£600 goes up by 15%. Work out the new rent.', 'R3.2 video + Q1', squareModel('£600', [
  { title: 'Find 1%', say: 'The original £600 is 100%, 100 squares. 1% is 1 square: divide by 100.', rows: ['600 ÷ 100 = 6'], pieces: [piece(1, '1% = £6')] },
  { title: 'Multiply by 115', say: 'The new rent is all 100% and 15% more: 115%, so 115 lots of 1%.', rows: ['115 × 6 = 690', '! £690'], pieces: [piece(100, '100% = £600')], note: '115 squares = £690' },
]), 'Our aim: find 1%, then multiply by 100% plus the increase.')
video(rent, media('increase', '£600 increased by 15%', 'R3.2_Percentage_Increase.mp4', 100, [
  'A rent rise: rent is £600 a month, and it goes up by 15%. What is the new rent?',
  'What is a percentage increase? Increase means it goes up. The £600 is the original: that is 100%. 15% more means we add 15% of £600 on top. New total = original + the extra.',
  'See it in 100 squares: £600 is 100 squares, so each square is 1% = £6. 10 squares are 10% = £60, and 5 more squares are £30. That is the extra 15% = £90 to add on top of the £600.',
  'Find the extra 15%: 15% is 10% + 5%. 10% of £600 = £60, 5% is half of that, £30. So 15% of £600 = £60 + £30 = £90.',
  'Add it on: £600 + £90 = £690, so the new rent is £690. It went up, so £690 is more than £600.',
  'The quick way, a multiplier: 100% + 15% = 115%, which is 1.15 as a decimal. £600 × 1.15 = £690, the same answer. For an increase the multiplier is more than 1.',
  'Where you see it: the rent changes from £600 to £690. £600 + £90 = £690, or £600 × 1.15 = £690.',
  'Well done: find the percentage of the original and add it on, or multiply by 1 + the decimal. The answer is £690.',
]))
pounds(practice(increase, 'A bus fare of £2 goes up by 10%. Work out the new fare.', 'R3.2 Q2', number(2.2, '£2.20'), '1% of £2 is 2p. The new fare is 100% + 10% = 110%.', squareModel('£2', [
  { title: 'Find 1%', say: 'The £2 fare is 100 squares. 1% is 1 square: divide by 100.', rows: ['2 ÷ 100 = 0.02'], pieces: [piece(1, '1% = £0.02')] },
  { title: 'Multiply by 110', say: 'The new fare is 100% + 10% = 110%, so 110 lots of 1%.', rows: ['110 × 0.02 = 2.20', '! £2.20'], pieces: [piece(100, '100% = £2')], note: '110 squares = £2.20' },
]), slips(2.2, [[0.2, 'That’s the 10% increase. Add it on to the £2.'], [12, 'Add 10% of £2, not £10: 10% of £2 is £0.20.'], [1.8, 'It goes up, so add the 20p, don’t take it off.']])))
pounds(practice(increase, 'A worker earns £28,000 a year. She gets a 4% pay rise. Work out her new salary.', 'R3.2 Q3', number(29120, '£29,120'), '1% of £28,000 is £280. The new salary is 104%.', squareModel('£28,000', [
  { title: 'Find 1%', say: 'The £28,000 is 100 squares. 1% is 1 square: divide by 100.', rows: ['28000 ÷ 100 = 280'], pieces: [piece(1, '1% = £280')] },
  { title: 'Multiply by 104', say: 'The new salary is 100% + 4% = 104%, so 104 lots of 1%.', rows: ['104 × 280 = 29120', '! £29,120'], pieces: [piece(100, '100% = £28,000')], note: '104 squares = £29,120' },
]), slips(29120, [[1120, 'That’s the 4% rise. Add it on to £28,000.'], [28004, 'Add 4% of £28,000, not £4: 4 × 280 = £1,120.'], [26880, 'A pay rise goes up: add the £1,120, don’t take it off.']])))
practice(increase, 'A gym membership costs £35 a month. The price goes up by 12%. Write down the multiplier for a 12% increase, and use it to find the new price.', 'R3.2 Q4a', multiplier([1.12, 39.2], '1.12 and £39.20'), '100% + 12% = 112%. Write 112% as a decimal.', boardModel([], [
  { title: 'The multiplier', say: 'You keep the whole 100% and add 12%: 112%. 112 lots of 1% is the same as × 1.12: divide 112 by 100.', rows: ['112 ÷ 100 = 1.12'] },
  { title: 'Multiply', say: 'Multiply the original price by the multiplier.', rows: ['35 × 1.12 = 39.20', '! 1.12 and £39.20'] },
]), response => /0\.12/.test(response) ? '0.12 gives only the 12%. Keep the 100% too: 100% + 12% = 112% = 1.12.' : /1\.2\b/.test(response) ? '12% is 0.12, so the multiplier is 1 + 0.12 = 1.12.' : null)
practice(increase, 'Why is the multiplier for a percentage increase always greater than 1?', 'R3.2 Q4b', choose(
  'You keep the whole original, 100% = 1, and add more on top',
  ['Because increases are always bigger than 10%', 'Even a 1% increase has a multiplier above 1: 1.01. It’s the 100% you keep.'],
  ['Because you multiply by the percentage', 'You multiply by 100% plus the increase, as a decimal, so it’s more than 1.'],
  ['It isn’t: a 5% increase has multiplier 0.05', '0.05 would give only the 5%. Keep the 100% too: 1.05.'],
), 'Think about what 100% means.', boardModel([], [
  { title: 'Think about 100%', say: '100% is the whole original, and as a decimal that is 1. An increase keeps all of it and adds more on top.', rows: ['> 100% = 1, and more on top', '! More than 1'] },
], 'Why'))
pounds(practice(increase, 'A savings account pays 3% interest per year. Amir puts in £2,000. How much is in the account after 1 year?', 'R3.2 Q5a', number(2060, '£2,060'), '1% of £2,000 is £20. After a year there is 100% + 3% = 103%.', boardModel([], [
  { title: 'Find 1%', say: '1% of £2,000: divide by 100.', rows: ['2000 ÷ 100 = 20'] },
  { title: 'Multiply by 103', say: 'After a year there is 100% + 3% = 103%, so 103 lots of 1%.', rows: ['103 × 20 = 2060', '! £2,060'] },
]), slips(2060, [[60, 'That’s the interest. Add it on to the £2,000.'], [2003, '3% of £2,000 is £60, not £3.'], [2600, '3% of £2,000 is £60: 1% is £20.']])))
pounds(practice(increase, 'Amir’s £2,060 stays in the account for a second year at 3%. How much is in the account after 2 years?', 'R3.2 Q5b', number(2121.8, '£2,121.80'), 'The second year’s 3% is on the new amount, £2,060.', boardModel([], [
  { title: 'Multiply the new amount', say: 'The second year’s 3% is worked out on £2,060, not on £2,000. Multiply by 1.03 again.', rows: ['2060 × 1.03 = 2121.80', '! £2,121.80'] },
]), slips(2121.8, [[2120, 'That adds £60 again. The second 3% is on £2,060: 2060 × 1.03.'], [61.8, 'That’s the second year’s interest. Add it on to £2,060.'], [2180, 'That is 3% of £2,000 added twice to £2,060. Multiply £2,060 by 1.03.']])))
pounds(practice(increase, 'Priya says, “A 20% increase then another 20% increase is the same as a 40% increase.” Test it with £100: how much is £100 after a 20% increase and then another 20% increase?', 'R3.2 Q5c', number(144, '£144'), 'Multiply by 1.2, then multiply the new amount by 1.2 again.', boardModel([], [
  { title: 'The first 20%', say: 'A 20% increase: multiply by 1.2.', rows: ['100 × 1.2 = 120'] },
  { title: 'The second 20%', say: 'The second 20% is on the new amount, £120.', rows: ['120 × 1.2 = 144'] },
  { title: 'Compare with 40%', say: 'A 40% increase would give £140. £144 is more, so Priya is wrong: it is a 44% increase.', rows: ['100 × 1.4 = 140', '> Priya is wrong', '! £144, not £140'] },
]), slips(144, [[140, 'That’s a 40% increase. Do the two 20% increases one after the other: the second is on £120.'], [120, 'That’s after one increase. Add 20% of £120 too.'], [44, 'That’s the increase. The question asks how much is in the account: £144.']])))

/* ---------- Rung 3: a percentage decrease (R3.3) ---------- */

const jacket = worked(decrease, 'A jacket costs £45. In a sale it is reduced by 30%. Work out the sale price.', '£45 reduced by 30%. Work out the sale price.', 'R3.3 video + Q1', squareModel('£45', [
  { title: 'Find 1%', say: 'The original £45 is 100 squares. 1% is 1 square: divide by 100.', rows: ['45 ÷ 100 = 0.45'], pieces: [piece(1, '1% = £0.45')] },
  { title: 'Multiply by 70', say: '30% off leaves 100% − 30% = 70% to pay, so 70 lots of 1%.', rows: ['70 × 0.45 = 31.50', '! £31.50'], pieces: [piece(70, '70% = £31.50')], note: '70 squares are left = £31.50' },
]), 'Our aim: work out the percentage left to pay, then find 1% and multiply.')
video(jacket, media('decrease', '£45 reduced by 30%', 'R3.3_Percentage_Decrease.mp4', 100, [
  'A jacket in the sale: a jacket costs £45, and the sale takes 30% off. What is the sale price?',
  'What is a percentage decrease? Decrease means it goes down. The £45 is the original: that is 100%. 30% off means we take 30% of £45 away. New price = original − the discount.',
  'See it in 100 squares: £45 is 100 squares, so each square is 1% = £0.45. 10 squares are 10% = £4.50, three times over. 30 squares are 30% = £13.50 off, and the other 70 squares are what you pay.',
  'Find the 30% off: 10% of £45 = 45 ÷ 10 = £4.50, so 30% = 3 × £4.50 = £13.50. The discount is £13.50.',
  'Take it off: £45 − £13.50 = £31.50, so the sale price is £31.50. It went down, so £31.50 is less than £45.',
  'The quick way, a multiplier: 100% − 30% = 70%, so you pay 70% of the price. £45 × 0.7 = £31.50, the same answer. For a decrease the multiplier is less than 1.',
  'Where you see it: the price tag changes from £45 to £31.50. 30% of £45 is £13.50 off, so you pay £31.50.',
  'Well done: find the percentage of the original and take it off, or multiply by 1 − the decimal. The answer is £31.50.',
]))
pounds(practice(decrease, 'A game costs £50. It is reduced by 20%. Work out the new price.', 'R3.3 Q2', number(40, '£40'), '20% off leaves 80% to pay. 1% of £50 is 50p.', squareModel('£50', [
  { title: 'Find 1%', say: 'The £50 is 100 squares. 1% is 1 square: divide by 100.', rows: ['50 ÷ 100 = 0.50'], pieces: [piece(1, '1% = £0.50')] },
  { title: 'Multiply by 80', say: '20% off leaves 100% − 20% = 80% to pay, so 80 lots of 1%.', rows: ['80 × 0.50 = 40', '! £40'], pieces: [piece(80, '80% = £40')], note: '80 squares are left = £40' },
]), slips(40, [[10, 'That’s the 20% taken off. The new price is what is left: 50 − 10.'], [30, '20% of £50 is £10, not £20. Take £10 off.'], [60, 'It is reduced: take the £10 off, don’t add it on.']])))
pounds(practice(decrease, 'A car was worth £9,000. Its value falls by 15% in a year. Work out its value after the year.', 'R3.3 Q3', number(7650, '£7,650'), 'A 15% fall leaves 85%. 1% of £9,000 is £90.', squareModel('£9,000', [
  { title: 'Find 1%', say: 'The £9,000 is 100 squares. 1% is 1 square: divide by 100.', rows: ['9000 ÷ 100 = 90'], pieces: [piece(1, '1% = £90')] },
  { title: 'Multiply by 85', say: 'A 15% fall leaves 100% − 15% = 85%, so 85 lots of 1%.', rows: ['85 × 90 = 7650', '! £7,650'], pieces: [piece(85, '85% = £7,650')], note: '85 squares are left = £7,650' },
]), slips(7650, [[1350, 'That’s the 15% fall. Take it off the £9,000.'], [8100, 'That’s 10% off. A 15% fall leaves 85%: 85 × 90.'], [10350, 'The value falls: take the £1,350 off, don’t add it on.']])))
practice(decrease, 'A TV costs £480. The shop reduces the price by 35%. Write down the multiplier for a 35% decrease, and use it to find the new price.', 'R3.3 Q4a', multiplier([0.65, 312], '0.65 and £312'), '100% − 35% = 65% is left. Write 65% as a decimal.', boardModel([], [
  { title: 'The multiplier', say: '100% − 35% = 65% is left. 65 lots of 1% is the same as × 0.65: divide 65 by 100.', rows: ['65 ÷ 100 = 0.65'] },
  { title: 'Multiply', say: 'Multiply the original price by the multiplier.', rows: ['480 × 0.65 = 312', '! 0.65 and £312'] },
]), response => /0\.35/.test(response) ? '0.35 gives the 35% taken off. Use what is left: 100% − 35% = 65% = 0.65.' : /1\.35/.test(response) ? 'That’s the multiplier for an increase. A decrease leaves 65%: 0.65.' : null)
practice(decrease, 'Why is the multiplier for a percentage decrease always less than 1?', 'R3.3 Q4b', choose(
  'You keep less than the whole 100%, and 100% = 1',
  ['Because decreases are always less than 50%', 'A 60% decrease works too: 0.4. You keep less than 100%, so it is less than 1.'],
  ['It isn’t: a 10% decrease has multiplier 1.1', 'That is a 10% increase. A 10% decrease leaves 90%: 0.9.'],
  ['Because you divide by the percentage', 'You multiply by what is left as a decimal. That is less than 100%, so less than 1.'],
), 'Think about what you are left with.', boardModel([], [
  { title: 'Think about what is left', say: '100% is the whole original, and as a decimal that is 1. A decrease takes some away, so you keep less than all of it.', rows: ['> 100% = 1, take some off', '! Less than 1'] },
], 'Why'))
pounds(practice(decrease, 'A laptop costs £720. It is reduced by 25% in a sale, then reduced by a further 10% on the last day. Work out the final price.', 'R3.3 Q5a', number(486, '£486'), 'Do one decrease after the other: × 0.75, then × 0.9 on the new price.', boardModel([], [
  { title: '25% off', say: '75% is left: multiply by 0.75.', rows: ['720 × 0.75 = 540'] },
  { title: '10% off the new price', say: 'The second 10% comes off the new price, £540. 90% is left: multiply by 0.9.', rows: ['540 × 0.9 = 486', '! £486'] },
]), slips(486, [[468, 'That’s 35% off £720. The 10% comes off the new price, £540.'], [540, 'That’s after the first reduction. Take 10% off £540 too.'], [234, 'Multiply by what is left, not by what is taken off: × 0.75, then × 0.9.']])))
percent(practice(decrease, 'The laptop went from £720 to £486. Work out the total percentage reduction from the original £720.', 'R3.3 Q5b', number(32.5, '32.5%'), 'What fraction of £720 is £486? Then work out how much is taken off.', boardModel([], [
  { title: 'Compare with the original', say: 'Divide the final price by the original: 0.675 is 67.5% of it left.', rows: ['486 ÷ 720 = 0.675'] },
  { title: 'The reduction', say: '67.5% is left, so the rest has been taken off.', rows: ['100 − 67.5 = 32.5', '! 32.5%'] },
]), slips(32.5, [[35, '25% + 10% isn’t right here: the 10% is off £540. Work out 486 ÷ 720.'], [67.5, 'That’s the part left. Take it from 100%.'], [0.675, 'That’s the part left as a decimal: 67.5%. The reduction is 100 − 67.5.']])))
practice(decrease, 'Sam says, “25% off then 10% off is the same as 35% off.” The final price of the £720 laptop was £486. Why is Sam wrong?', 'R3.3 Q5c', choose(
  'The 10% comes off the smaller price, £540, so it is only 32.5% off',
  ['Sam is right: 25% + 10% = 35%', '35% off would be 720 × 0.65 = £468, but the final price is £486. The 10% is of £540, not £720.'],
  ['It is more than 35% off', 'The final £486 is more than £468, the 35% price, so less has come off: 32.5%.'],
  ['You multiply the percentages: 25 × 10 = 250% off', 'Multiply the multipliers, not the percentages: 0.75 × 0.9 = 0.675, so 32.5% off.'],
), 'Work out 35% off £720 and compare it with £486.', boardModel([], [
  { title: '35% off', say: 'If Sam were right, 35% off would give the same price. 65% is left: × 0.65.', rows: ['720 × 0.65 = 468'] },
  { title: 'Compare', say: '£486 is not £468. The second 10% is taken off a smaller amount, £540, so it is worth less.', rows: ['> only 32.5% off, not 35%', '! £486, not £468'] },
], 'Why'))

/* ---------- Rung 4: a percentage change (R3.4) ---------- */

const phone = worked(change, 'A phone cost £400. A year later it is sold for £250. Work out the percentage change in its value.', '£400 to £250. Work out the percentage change.', 'R3.4 video + Q1', boardModel([], [
  { title: 'Find the change', say: 'The change is the difference between the two values.', rows: ['400 − 250 = 150'] },
  { title: 'Divide by the original', say: 'Divide the change by the ORIGINAL value, then multiply by 100. It went down, so it is a decrease.', rows: ['150 ÷ 400 × 100 = 37.5', '! 37.5% decrease'] },
]), 'Our aim: find the change, divide it by the original, then multiply by 100.')
video(phone, media('change', '£400 to £250: the percentage change', 'R3.4_Percentage_Change.mp4', 100, [
  'A phone loses value: a phone cost £400, and a year later it sells for £250. What is the percentage change?',
  'What is percentage change? It tells us how big the change is as a percentage, always compared with the original, the starting value. Percentage change = change ÷ original × 100.',
  'See it on the price tag: it started at £400, the original, 100%. It dropped to £250, a £150 drop. £150 out of the original £400 is 150 ÷ 400 = 0.375 = 37.5%.',
  'Find the change: £400 − £250 = £150. It went down, so this is a decrease.',
  'Change out of the original: divide by the original £400, not the £250. 150 ÷ 400 = 0.375, and 0.375 × 100 = 37.5. That is a 37.5% decrease.',
  'Check it: 10% of £400 is £40, so 37.5% is 3.75 × £40 = £150, and £400 − £150 = £250, the price we ended with. Dividing by £250 would be wrong. Say increase or decrease in your answer.',
  'Where you see it: the tag changes from £400 to £250, 37.5% down. 150 ÷ 400 × 100 = 37.5, a 37.5% decrease.',
  'Well done: find the change, divide by the original, multiply by 100, and say increase or decrease. The answer is a 37.5% decrease.',
]))
percent(practice(change, 'A plant grows from 20 cm to 25 cm. Work out the percentage increase in its height.', 'R3.4 Q2', number(25, '25%'), 'The change is 5 cm. Divide by the original 20 cm, then × 100.', boardModel([], [
  { title: 'Find the change', say: 'The difference between the two heights.', rows: ['25 − 20 = 5'] },
  { title: 'Divide by the original', say: 'Divide the change by the original 20 cm, then multiply by 100.', rows: ['5 ÷ 20 × 100 = 25', '! 25% increase'] },
]), slips(25, [[20, 'Divide by the original, 20 cm, not the new height: 5 ÷ 20 × 100.'], [5, 'That’s the change in cm. Divide by 20, then × 100.'], [0.25, 'Multiply by 100 to make it a percentage: 25%.']])))
percent(practice(change, 'A shop’s sales went from £3,200 in March to £3,680 in April. Work out the percentage increase in sales.', 'R3.4 Q3', number(15, '15%'), 'Find the change, then divide by the March sales.', boardModel([], [
  { title: 'Find the change', say: 'The difference between the two months.', rows: ['3680 − 3200 = 480'] },
  { title: 'Divide by the original', say: 'Divide by the original, the March sales, then multiply by 100.', rows: ['480 ÷ 3200 × 100 = 15', '! 15% increase'] },
]), slips(15, [[480 / 3680 * 100, 'Divide by the original, March’s £3,200, not April’s.'], [480, 'That’s the change in pounds. Divide by 3,200, then × 100.'], [0.15, 'Multiply by 100 to make it a percentage: 15%.']])))
percent(practice(change, 'A football club’s attendance fell from 24,000 to 20,400. Work out the percentage decrease in attendance.', 'R3.4 Q4a', number(15, '15%'), 'Find the change, then divide by the original 24,000.', boardModel([], [
  { title: 'Find the change', say: 'The difference between the two attendances.', rows: ['24000 − 20400 = 3600'] },
  { title: 'Divide by the original', say: 'Divide by the original 24,000, then multiply by 100.', rows: ['3600 ÷ 24000 = 0.15', '0.15 × 100 = 15', '! 15% decrease'] },
]), slips(15, [[3600 / 20400 * 100, 'Divide by the original, 24,000, not the new attendance.'], [3600, 'That’s the change. Divide by 24,000, then × 100.']])))
practice(change, 'Jack divides 3,600 by 20,400 and gets 17.6% for the fall from 24,000 to 20,400. What is Jack’s mistake?', 'R3.4 Q4b', choose(
  'He divided by the new value. Divide by the original, 24,000',
  ['He should have multiplied by 100 first', 'The order doesn’t matter. The problem is the number he divided by: use the original, 24,000.'],
  ['He should have divided 20,400 by 3,600', 'That gives about 5.7, not a percentage. Divide the change by the original: 3,600 ÷ 24,000.'],
  ['Nothing: 17.6% is right', 'A percentage change is always compared with the original, 24,000: 15%.'],
), 'Which number should the change be compared with?', boardModel([], [
  { title: 'Divide by the original', say: 'Jack divided by the new value. A percentage change is always compared with the original.', rows: ['3600 ÷ 24000 = 0.15', '0.15 × 100 = 15', '! 15%, not 17.6%'] },
], 'Why'))
percent(practice(change, 'A house was bought for £180,000 and sold for £207,000. Work out the percentage profit. Give your answer to 1 decimal place.', 'R3.4 Q5a', number(15, '15.0%'), 'Find the profit, then divide by the price it was bought for.', boardModel([], [
  { title: 'Find the change', say: 'The profit is the difference between the two prices.', rows: ['207000 − 180000 = 27000'] },
  { title: 'Divide by the original', say: 'Divide by the original, the price it was bought for, then multiply by 100.', rows: ['27000 ÷ 180000 = 0.15', '0.15 × 100 = 15', '! 15.0% profit'] },
]), slips(15, [[27000 / 207000 * 100, 'Divide by the original, £180,000, not the selling price.'], [27000, 'That’s the profit in pounds. Divide by 180,000, then × 100.']])))
percent(practice(change, 'A second house was bought for £250,000 and sold for £230,000. Work out the percentage loss.', 'R3.4 Q5b', number(8, '8%'), 'The change is £20,000. Divide by the original £250,000.', boardModel([], [
  { title: 'Find the change', say: 'The loss is the difference between the two prices.', rows: ['250000 − 230000 = 20000'] },
  { title: 'Divide by the original', say: 'Divide by the original £250,000, then multiply by 100.', rows: ['20000 ÷ 250000 = 0.08', '0.08 × 100 = 8', '! 8% loss'] },
]), slips(8, [[20000 / 230000 * 100, 'Divide by the original, £250,000, not the selling price.'], [20000, 'That’s the loss in pounds. Divide by 250,000, then × 100.']])))
practice(change, 'Mia says, “The first house made more money, so it must have the bigger percentage change.” The first house made £27,000 on £180,000, a 15% profit. The second lost £20,000 on £250,000, an 8% loss. Is Mia’s reasoning correct?', 'R3.4 Q5c', choose(
  'Her answer is right here, but her reason is wrong: the percentage depends on the original too',
  ['Yes: more money always means a bigger percentage', 'Not always: £20,000 on £250,000 is 8%, but £20,000 on £100,000 would be 20%.'],
  ['Her answer is wrong: the second house has the bigger percentage', '15% is bigger than 8%, so her answer is right here. It’s her reason that is wrong.'],
), 'The percentage depends on the change and the original.', boardModel([], [
  { title: 'Both percentages', say: 'Each change is compared with its own original.', rows: ['27000 ÷ 180000 = 0.15', '0.15 × 100 = 15', '20000 ÷ 250000 = 0.08', '0.08 × 100 = 8'] },
  { title: 'Her reason', say: '15% is bigger, so her answer is right here. But a bigger change on a much bigger original can give a smaller percentage.', rows: ['> her answer is right here', '! Wrong reason'] },
], 'Why'))

add('mixed', 'Percentages', 'R3.1-R3.4 consolidation', text(
  'One method for all of them: find 1% (÷ 100), then multiply by the percentage you want. 23% of £80 is 23 × 0.80 = £18.40.',
  'An increase: you want 100% + the increase. Up 15% is 115 lots of 1%, the same as × 1.15.',
  'A decrease: you want what is left. 30% off leaves 70 lots of 1%, the same as × 0.7.',
  'A percentage change: change ÷ original × 100. Always divide by the original.',
))

export const tutorPercentLesson: TutorMethodLesson = {
  id: 'L032', number: 32, title: 'Percentages', level: 'GCSE Foundation',
  goal: 'Find a percentage of an amount, increase and decrease by a percentage, and work out a percentage change.',
  labels: { [ofAmount]: 'Percentage of an amount', [increase]: 'Percentage increase', [decrease]: 'Percentage decrease', [change]: 'Percentage change', mixed: 'Review' },
  steadyPictures: true,
  states: finish(),
}
