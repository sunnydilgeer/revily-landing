import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorMethodState, TutorMethodVisual, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { boardModel, choose, number, pair, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { piece, squareModel } from './percentSquare'

/*
 * Lesson 33 (Ratio R4): Reverse percentages, from Aniksha's R4.1–R4.2 PDFs and videos. Two rungs in the PDFs' order:
 * 1% to 100% (R4.1), then dividing by the multiplier (R4.2). R4.1 draws the R4.1 video's hundred square above the A5
 * board (PercentPictures.tsx), one colour only, as in lesson 32: the original is all 100 squares, the amount given is
 * the squares left (or the squares there are), so divide to find 1 square, then multiply by 100. A rise has more than
 * 100 squares, so it works on the board alone, as do the multipliers in R4.2.
 */

const { add, finish } = author(33)
const hundred = 'reverse-percentage'
const decimal = 'reverse-percentage-multiplier'

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
  id: `lesson33-${name}`, src: `/media/lesson-33/${name}.mp4`, poster: `/media/lesson-33/${name}.svg`, title, durationSeconds, sourceFile, textAlternative,
})
/** A slip that isn't a whole number is also caught when it is typed rounded, to 2 or 1 decimal places. */
const rounded = (list: Slip[]): Slip[] => list.flatMap(([wrong, note]) => [[wrong, note], [Math.round(wrong * 100) / 100, note], [Math.round(wrong * 10) / 10, note]])
const slips = (right: number, list: Slip[]) => (response: string) => diagnoseSlips(response, right, rounded(list))
const pounds = (state: TutorMethodState) => { state.answerPrefix = '£'; return state }
/** A multiplier and the original price, typed in two boxes. */
const multiplier = (answer: [number, number], shown: string) => pair(['multiplier', 'original £'], answer, shown)

/* ---------- Rung 1: 1% to 100% (R4.1) ---------- */

const headphones = worked(hundred, 'A pair of headphones costs £48 in a sale with 20% off. Work out the price of the headphones before the sale.', '£48 after 20% off. Work out the price before the sale.', 'R4.1 video + Q1', squareModel('the original', [
  { title: 'What % is £48?', say: '£48 is the price AFTER 20% was taken off. The original is all 100 squares. 20 squares came off, so £48 is the 80 squares left.', rows: ['100% − 20% = 80%', '>0 80% = £48'], pieces: [piece(80, '80% = £48')], note: '80 squares = £48' },
  { title: 'Find 1%', say: '80 squares are £48. Divide by 80 to find 1 square, 1%.', rows: ['48 ÷ 80 = 0.60'], pieces: [piece(1, '1% = £0.60')], note: '1 square = £0.60' },
  { title: 'Multiply by 100', say: 'The original is all 100 squares: 100 lots of 1%.', rows: ['0.60 × 100 = 60', '! £60'], pieces: [piece(100, '100% = £60')], note: '100 squares = £60' },
]), 'Our aim: find what % you have, divide to find 1%, then multiply by 100.')
video(headphones, media('one-to-hundred', '£48 after 20% off: the price before', 'R4.1_Reverse_Percentages_1_To_100.mp4', 104, [
  'A headphones sale: headphones are £48 in a 20% off sale. What was the price BEFORE the sale?',
  'Going backwards: £48 is the price AFTER 20% off. Normally we know the original and find the new price. This time it is backwards: we know the NEW price, and we want the original price, before the sale. Trap: 20% of £48 is NOT the answer, because the 20% was taken off a bigger number.',
  'See it in 100 squares: the original price is all 100 squares. 20 squares were taken off, so 80 squares are left, and those 80 squares are the £48 we paid. So 1 square = 48 ÷ 80 = £0.60, and 100 squares = £60.',
  'What % is the sale price? The original price is 100%. 20% was taken off, so 100% − 20% = 80% is left: 80% = £48. £48 is 80% of the original, not 100%.',
  'Find 1%, then 100%: divide both by 80 to find 1%: 1% = 48 ÷ 80 = £0.60. Multiply by 100 to find 100%, the whole original price: 100% = 0.60 × 100 = £60.',
  'Check it: go forwards. 20% of £60 = £12, and £60 − £12 = £48, the sale price we were given. Sense check: the original must be MORE than £48.',
  'Where you see it: headphones are £48 after 20% off. £48 is 80%, so 1% is £0.60 and 100% is £60: 48 ÷ 80 = 0.60, 0.60 × 100 = 60. The original price is £60.',
  'Well done: work out what % the new price is, divide to find 1%, then multiply by 100 to find the original.',
]))
pounds(practice(hundred, 'A book costs £6 after a 25% reduction. Work out the original price.', 'R4.1 Q2', number(8, '£8'), '£6 is what is left: 100% − 25% = 75%. Divide by 75 to find 1%.', squareModel('the original', [
  { title: 'What % is £6?', say: '25% came off the original, so £6 is the 75 squares left.', rows: ['100% − 25% = 75%', '>0 75% = £6'], pieces: [piece(75, '75% = £6')], note: '75 squares = £6' },
  { title: 'Find 1%', say: 'Divide by 75 to find 1 square, 1%.', rows: ['6 ÷ 75 = 0.08'], pieces: [piece(1, '1% = £0.08')], note: '1 square = £0.08' },
  { title: 'Multiply by 100', say: 'The original is all 100 squares.', rows: ['0.08 × 100 = 8', '! £8'], pieces: [piece(100, '100% = £8')], note: '100 squares = £8' },
]), slips(8, [[7.5, 'That adds 25% of £6. The 25% came off the original, so £6 is 75% of it: 6 ÷ 75, then × 100.'], [4.5, 'That takes another 25% off. The original is more than £6.'], [24, '£6 is 75% of the original, not 25%: divide by 75.']])))
pounds(practice(hundred, 'A train ticket went up by 10% and now costs £33. Work out the price before the increase.', 'R4.1 Q3', number(30, '£30'), 'It went up, so £33 is 100% + 10% = 110%. Divide by 110 to find 1%.', boardModel([], [
  { title: 'What % is £33?', say: 'It went UP, so £33 is the old 100% and 10% more: 110% of the old price.', rows: ['100% + 10% = 110%', '>0 110% = £33'] },
  { title: 'Find 1%', say: 'Divide by 110 to find 1%.', rows: ['33 ÷ 110 = 0.30'] },
  { title: 'Multiply by 100', say: 'The old price is 100 lots of 1%.', rows: ['0.30 × 100 = 30', '! £30'] },
]), slips(30, [[29.7, 'That takes 10% of £33 off. The 10% was added to the old price, so £33 is 110%: 33 ÷ 110, then × 100.'], [36.3, 'It went up to £33, so the old price is less than £33.'], [0.3, 'That’s 1%. Multiply by 100 for the old price.']])))
pounds(practice(hundred, 'A sofa is £364 in a sale. The sale takes 30% off every price. Work out the original price of the sofa.', 'R4.1 Q4a', number(520, '£520'), '£364 is what is left: 100% − 30% = 70%. Divide by 70 to find 1%.', squareModel('the original', [
  { title: 'What % is £364?', say: '30% came off, so £364 is the 70 squares left.', rows: ['100% − 30% = 70%', '>0 70% = £364'], pieces: [piece(70, '70% = £364')], note: '70 squares = £364' },
  { title: 'Find 1%', say: 'Divide by 70 to find 1 square, 1%.', rows: ['364 ÷ 70 = 5.20'], pieces: [piece(1, '1% = £5.20')], note: '1 square = £5.20' },
  { title: 'Multiply by 100', say: 'The original is all 100 squares.', rows: ['5.20 × 100 = 520', '! £520'], pieces: [piece(100, '100% = £520')], note: '100 squares = £520' },
]), slips(520, [[473.2, 'That adds 30% of £364. The 30% came off the original: £364 is 70% of it.'], [254.8, 'That takes another 30% off. The original is more than £364.'], [5.2, 'That’s 1%. Multiply by 100 for the original.']])))
pounds(practice(hundred, 'The sofa was £520 and is £364 in the sale. How much money is saved by buying the sofa in the sale?', 'R4.1 Q4b', number(156, '£156'), 'Take the sale price off the original price.', boardModel([], [
  { title: 'Original minus sale price', say: 'The saving is the difference between the two prices.', rows: ['520 − 364 = 156', '! £156'] },
]), slips(156, [[109.2, 'That’s 30% of the sale price. The 30% is of the original: 520 − 364.'], [520, 'That’s the original price. Take the sale price off it.'], [884, 'Take the sale price off the original, don’t add them.']])))
practice(hundred, 'In a school, 18% of the pupils cycle to school. 117 pupils cycle. Work out the total number of pupils in the school.', 'R4.1 Q5a', number(650, '650 pupils'), '117 pupils are 18%. Divide by 18 to find 1%.', squareModel('the school', [
  { title: 'What % is 117?', say: 'The whole school is 100 squares. The 117 pupils who cycle are 18 of them.', rows: ['>0 18% = 117'], pieces: [piece(18, '18% = 117')], note: '18 squares = 117 pupils' },
  { title: 'Find 1%', say: 'Divide by 18 to find 1 square, 1%.', rows: ['117 ÷ 18 = 6.5'], pieces: [piece(1, '1% = 6.5')], note: '1 square = 6.5 pupils' },
  { title: 'Multiply by 100', say: 'The whole school is all 100 squares.', rows: ['6.5 × 100 = 650', '! 650 pupils'], pieces: [piece(100, '100% = 650')], note: '100 squares = 650 pupils' },
]), slips(650, [[21.06, 'That’s 18% of 117. The 117 pupils are 18% of the school: 117 ÷ 18, then × 100.'], [6.5, 'That’s 1%. Multiply by 100 for the whole school.'], [138.06, '117 is only 18% of the school, so the whole school is much bigger.']]))
practice(hundred, 'The first school has 650 pupils. A second school has 24% of its pupils cycling, which is 144 pupils. Which school is bigger?', 'R4.1 Q5b', choose(
  'The first school: 650 is more than 600',
  ['The second school: 144 is more than 117', '144 is 24% of the second school, so 1% is 6 pupils and the school has 600, fewer than 650.'],
  ['They are the same size', '1% of the second school is 144 ÷ 24 = 6 pupils, so it has 600, not 650.'],
), 'Find the size of the second school: divide by 24, then multiply by 100.', boardModel([], [
  { title: 'Find 1%', say: '144 pupils are 24% of the second school. Divide by 24.', rows: ['144 ÷ 24 = 6'] },
  { title: 'Multiply by 100', say: 'The second school is 100 lots of 1%. Compare it with the first school’s 650.', rows: ['6 × 100 = 600', '> 650 is more than 600', '! The first school'] },
], 'Compare'))
practice(hundred, 'Ria says, “The headphones were £48 with 20% off, so the original was £48 + 20% of £48 = £57.60.” Why is Ria wrong?', 'R4.1 Q5c', choose(
  'The 20% came off the original, not off £48: 20% off £57.60 is £46.08, not £48',
  ['She is right: the original is £57.60', 'Check forwards: 20% off £57.60 leaves £46.08, not £48. The original is £60.'],
  ['She should take 20% off £48 instead', 'That gives £38.40, less than the sale price. The original must be more than £48.'],
  ['She should add 20% of £60', 'That does give £60, but she can’t know £60 yet. Find 1% from the 80%: 48 ÷ 80 = 0.60.'],
), 'Work forwards: take 20% off £57.60 and compare with £48.', boardModel([], [
  { title: 'Work forwards', say: 'If Ria were right, 20% off £57.60 would give £48. Find 20% of £57.60 and take it off.', rows: ['57.60 ÷ 100 × 20 = 11.52', '57.60 − 11.52 = 46.08'] },
  { title: 'Compare', say: '£46.08 is not £48. The 20% was of the original, a bigger number than £48.', rows: ['> £46.08, not £48', '! Ria is wrong'] },
], 'Why'))

/* ---------- Rung 2: dividing by the multiplier (R4.2) ---------- */

const busPass = worked(decimal, 'A bus pass went up in price by 15%. It now costs £69. Work out the price before the increase.', '£69 after a 15% rise. Work out the price before.', 'R4.2 video + Q1', boardModel([], [
  { title: 'The multiplier', say: 'After a 15% rise the new price is 100% + 15% = 115% of the old price. As a decimal, divide by 100.', rows: ['100% + 15% = 115%', '115 ÷ 100 = 1.15'] },
  { title: 'Divide by 1.15', say: 'Going forwards, old price × 1.15 = £69. To undo × 1.15, divide by 1.15.', rows: ['69 ÷ 1.15 = 60', '! £60'] },
]), 'Our aim: write the new % as a decimal, then divide the new amount by it.')
video(busPass, media('decimals', '£69 after a 15% rise: the price before', 'R4.2_Reverse_Percentages_Using_Decimals.mp4', 100, [
  'A bus pass goes up: a bus pass went up by 15% to £69. What did it cost BEFORE the rise?',
  'Going backwards: £69 is the price AFTER a 15% rise. We know the NEW price and we want the old one. The old price is 100%, and it went UP by 15%: 100% + 15% = 115%, so 115% = £69. Trap: do not take 15% off £69.',
  'See it on the bus pass: the old price is the mystery, call it 100%. It went up 15%, so the new price is 115% = 1.15 times the old one. Old × 1.15 = £69, so old = £69 ÷ 1.15.',
  'Turn the % into a decimal: a quick way is to write the % as a decimal: 115% = 115 ÷ 100 = 1.15. Going forwards we would do old price × 1.15 = £69. To undo a × 1.15, we ÷ 1.15.',
  'Divide by the decimal: divide both sides by 1.15. Old price = 69 ÷ 1.15 = £60.',
  'Check it: go forwards. £60 × 1.15 = £69. Sense check: it went up, so the old price must be LESS than £69. For a decrease, 30% off leaves 70%, so divide by 0.7.',
  'Where you see it: a bus pass went up 15% to £69. 115% = 1.15, so the old price is 69 ÷ 1.15 = £60.',
  'Well done: work out the new % (100 + or − the change), turn it into a decimal, then DIVIDE the new amount by it. The answer is £60.',
]))
pounds(practice(decimal, 'A coat costs £56 after 30% off. Work out the original price.', 'R4.2 Q2', number(80, '£80'), '30% off leaves 70% = 0.7. Divide £56 by 0.7.', boardModel([], [
  { title: 'The multiplier', say: '30% off leaves 100% − 30% = 70%. As a decimal, divide by 100.', rows: ['100% − 30% = 70%', '70 ÷ 100 = 0.7'] },
  { title: 'Divide by 0.7', say: 'Original × 0.7 = £56, so divide by 0.7 to undo it.', rows: ['56 ÷ 0.7 = 80', '! £80'] },
]), slips(80, [[72.8, 'That adds 30% of £56. £56 is 70% of the original: 56 ÷ 0.7.'], [39.2, 'That takes 30% off again. Divide by 0.7 to undo it.'], [56 / 0.3, '30% was taken off, so 70% is left: divide by 0.7, not 0.3.']])))
practice(decimal, 'A café raised its prices by 8%. A sandwich now costs £4.32. Write down the multiplier, and use it to find the price before the rise.', 'R4.2 Q3', multiplier([1.08, 4], '1.08 and £4'), '100% + 8% = 108%. Write it as a decimal, then divide £4.32 by it.', boardModel([], [
  { title: 'The multiplier', say: 'The new price is 100% + 8% = 108% of the old one. As a decimal, divide by 100.', rows: ['100% + 8% = 108%', '108 ÷ 100 = 1.08'] },
  { title: 'Divide by 1.08', say: 'Divide the new price by the multiplier.', rows: ['4.32 ÷ 1.08 = 4', '! 1.08 and £4'] },
]), response => /0\.08/.test(response) ? '0.08 is only the 8%. Keep the 100% too: 108% = 1.08.' : /\b1\.8\b/.test(response) ? '8% is 0.08, so the multiplier is 1 + 0.08 = 1.08.' : /4\.6\d/.test(response) ? 'Divide by 1.08 to go back, don’t multiply: the old price is less than £4.32.' : null)
practice(decimal, 'A laptop is reduced by 35% in a sale. The sale price is £338. Write down the multiplier, and use it to find the original price.', 'R4.2 Q4a', multiplier([0.65, 520], '0.65 and £520'), '35% off leaves 65%. Write it as a decimal, then divide £338 by it.', boardModel([], [
  { title: 'The multiplier', say: '35% off leaves 100% − 35% = 65%. As a decimal, divide by 100.', rows: ['100% − 35% = 65%', '65 ÷ 100 = 0.65'] },
  { title: 'Divide by 0.65', say: 'Divide the sale price by the multiplier.', rows: ['338 ÷ 0.65 = 520', '! 0.65 and £520'] },
]), response => /0\.35/.test(response) ? '0.35 is the 35% taken off. Use what is left: 100% − 35% = 65% = 0.65.' : /1\.35/.test(response) ? 'That’s the multiplier for an increase. A decrease leaves 65%: 0.65.' : /219\.7/.test(response) ? 'Divide by 0.65 to go back, don’t multiply: the original is more than £338.' : null)
pounds(practice(decimal, 'The laptop’s original price was £520. Check your answer by working forwards: what is £520 with 35% off?', 'R4.2 Q4b', number(338, '£338'), 'Multiply the original by the multiplier, 0.65.', boardModel([], [
  { title: 'Work forwards', say: 'Original × 0.65 should give the sale price.', rows: ['520 × 0.65 = 338', '> the sale price ✓', '! £338'] },
]), slips(338, [[182, 'That’s the 35% taken off. Multiply by 0.65 for what is left.'], [702, 'Take 35% off, don’t add it on: 520 × 0.65.']])))
practice(decimal, 'A runner’s new 400 m time is 54.6 seconds. This is 9% faster than her old time. Work out her old time in seconds.', 'R4.2 Q5a', number(60, '60 seconds'), 'Faster means the time went DOWN by 9%, so the new time is 91% = 0.91 of the old time.', boardModel([], [
  { title: 'The multiplier', say: '9% faster means the time went down by 9%. The new time is 100% − 9% = 91% of the old time.', rows: ['100% − 9% = 91%', '91 ÷ 100 = 0.91'] },
  { title: 'Divide by 0.91', say: 'Divide the new time by the multiplier.', rows: ['54.6 ÷ 0.91 = 60', '! 60 seconds'] },
]), slips(60, [[59.514, 'That adds 9% of 54.6. The new time is 91% of the old: 54.6 ÷ 0.91.'], [54.6 / 1.09, 'Faster means the time went down, so the new time is 91%: divide by 0.91, not 1.09.'], [49.686, 'Divide by 0.91, don’t multiply: the old time is longer.']]))
pounds(practice(decimal, 'A house price rose by 12% to £201,600. Work out the price before the rise.', 'R4.2 Q5b', number(180000, '£180,000'), 'A 12% rise gives 112% = 1.12. Divide by 1.12.', boardModel([], [
  { title: 'The multiplier', say: 'The new price is 100% + 12% = 112% of the old one.', rows: ['100% + 12% = 112%', '112 ÷ 100 = 1.12'] },
  { title: 'Divide by 1.12', say: 'Divide the new price by the multiplier.', rows: ['201600 ÷ 1.12 = 180000', '! £180,000'] },
]), slips(180000, [[177408, 'That takes 12% of £201,600 off. Divide by 1.12 instead.'], [225792, 'Divide by 1.12, don’t multiply: the old price is less.'], [1680000, 'Divide by 1.12, not 0.12: the new price is 112%.']])))
practice(decimal, 'Tom says, “To undo a 15% increase, take 15% off the new price.” The bus pass went up 15% to £69, and the old price was £60. Why is Tom wrong?', 'R4.2 Q5c', choose(
  '15% of £69 is more than 15% of £60, so taking it off gives £58.65, not £60',
  ['He is right: 15% off £69 gives £60', '15% of £69 is £10.35, and 69 − 10.35 = £58.65, not £60.'],
  ['He should add 15% to £69 instead', 'Adding makes it bigger still. Divide by 1.15 to undo the rise: £60.'],
  ['Taking 15% off gives more than £60', 'It gives £58.65, less than £60, because 15% of £69 is more than 15% of £60.'],
), 'Try Tom’s method on £69 and compare with £60.', boardModel([], [
  { title: 'Try Tom’s method', say: 'Take 15% off £69: find 15% of £69, then take it off.', rows: ['69 ÷ 100 × 15 = 10.35', '69 − 10.35 = 58.65'] },
  { title: 'Compare', say: '£58.65 is not £60. 15% of £69 is bigger than 15% of £60, so you must divide by 1.15.', rows: ['> £58.65, not £60', '! Tom is wrong'] },
], 'Why'))

add('mixed', 'Reverse percentages', 'R4.1-R4.2 consolidation', text(
  'Going backwards: you know the amount AFTER the change, and you want the original, 100%.',
  'Work out what % you have: 20% off leaves 80%; a 10% rise makes 110%.',
  'Divide to find 1%, then multiply by 100: £48 is 80%, so 48 ÷ 80 = £0.60 and 0.60 × 100 = £60.',
  'Or with a decimal: 115% = 1.15, so divide by it. £69 ÷ 1.15 = £60. Never take the % off the new amount.',
))

export const tutorReversePercentLesson: TutorMethodLesson = {
  id: 'L033', number: 33, title: 'Reverse percentages', level: 'GCSE Foundation',
  goal: 'Find the original amount before a percentage increase or decrease, by finding 1% or by dividing by the multiplier.',
  labels: { [hundred]: '1% to 100%', [decimal]: 'Using decimals', mixed: 'Review' },
  states: finish(),
}
