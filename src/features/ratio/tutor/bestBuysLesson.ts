import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { boardModel, choose, number, pair, text, type BoardMove } from '../../simultaneous-equations/tutor/boardWorkings'

/*
 * Lesson 39 (Ratio R8): Best buys. Made with the lesson kit (packs R8.1–R8.2) from R8 (p108–109) of Sunny's book, with
 * our own numbers (Sunny, 11 Oct). Two rungs: price per unit (the same amount of each), and offers.
 */

const { add, finish } = author(39)
const unit = 'bestbuy-unit'
const offers = 'bestbuy-offers'

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
const board = (moves: BoardMove[], label = 'Work it out') => boardModel([], moves, label)
/** A question: its words above the answer, and the board working once answered. */
function practice(topic: MicroSkillId, title: string, sourceRef: string, interaction: InteractionDefinition, hint: string, model: TutorWorking, list: Slip[] = []) {
  const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  const state = add(topic, title, sourceRef, text(title), interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  const right = Number(interaction.correctAnswer)
  if (list.length && interaction.type === 'numericInput') state.diagnose = (response: string) => diagnoseSlips(response, right, list)
  return state
}
function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: TutorWorking, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  state.content.heading = heading
  return state
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }
const media = (name: string, title: string, sourceFile: string, durationSeconds: number, textAlternative: string[]) => ({
  id: `lesson39-${name}`, src: `/media/lesson-39/${name}.mp4`, poster: `/media/lesson-39/${name}.svg`, title, durationSeconds, sourceFile, textAlternative,
})
const pounds = (state: TutorMethodState) => { state.answerPrefix = '£'; return state }

/* ---------- Rung 1: price per unit (R8.1) ---------- */

const cereal = worked(unit, 'Cereal comes in three sizes: A is 500 g for £3.20, B is 750 g for £4.50 and C is 1.2 kg for £7.44. Which is the best value?', 'Which cereal box is the best value?', 'R8.1 video + Q1', board([
  { title: 'Pick a common amount', say: 'The boxes are different sizes, so find what 100 g of each costs. The smallest is the best value.', rows: ['> Compare the cost of 100 g of each box'] },
  { title: 'Calculate A’s cost of 100 g', say: 'A is 500 g, which is 5 lots of 100 g, so divide its price by 5.', rows: ['A: cost of 100 g = £3.20 ÷ 5 = £0.64'] },
  { title: 'Calculate B’s cost of 100 g', say: 'B is 750 g, which is 7.5 lots of 100 g, so divide by 7.5.', rows: ['B: cost of 100 g = £4.50 ÷ 7.5 = £0.60'] },
  { title: 'Calculate C’s cost of 100 g', say: 'C is 1.2 kg, which is 1200 g, or 12 lots of 100 g, so divide by 12.', rows: ['1.2 kg = 1200 g', 'C: cost of 100 g = £7.44 ÷ 12 = £0.62'] },
  { title: 'Compare', say: '£0.60 is the cheapest for 100 g.', rows: ['! B is the best value'] },
]), 'Our aim: the cheapest box isn’t always the best buy. Find the cost of the same amount of each, then pick the lowest.')
video(cereal, media('unit', 'Which cereal box is the best value?', 'R8.1_Price_Per_Unit.mp4', 43, [
  'Best buys: cereal comes in three sizes. A is 500 g for £3.20, B is 750 g for £4.50, C is 1.2 kg for £7.44. Which is the best value?',
  'Step 1, pick an amount: the boxes are different sizes, so find the cost of the same amount of each. 100 g divides into all three: 1.2 kg = 1200 g.',
  'Step 2, divide: A 320 ÷ 5 = 64p, B 450 ÷ 7.5 = 60p, C 744 ÷ 12 = 62p for 100 g.',
  'Step 3, compare: 60p is the lowest, so B is the best value.',
  'Watch out: the cheapest box is not always the best buy. Work in pence to keep the numbers whole.',
]))
practice(unit, 'A pack of 8 pens costs £2.40. A pack of 5 pens costs £1.60. Which pack is better value?', 'R8.1 Q2', choose('The pack of 8', ['The pack of 5', 'It costs less, but each pen is 32p: the pack of 8 is 30p a pen.'], ['They are the same value', '240 ÷ 8 = 30p a pen, but 160 ÷ 5 = 32p a pen.']), 'Find the cost of 1 pen in each pack.', board([
  { title: 'Pick a common amount', say: 'The packs hold different numbers of pens, so find what 1 pen costs in each.', rows: ['> Compare the cost of 1 pen in each pack'] },
  { title: 'Calculate the cost of 1 pen', say: 'The pack of 8 is 8 pens, so divide its price by 8. The pack of 5, divide by 5.', rows: ['Pack of 8: cost of 1 pen = £2.40 ÷ 8 = £0.30', 'Pack of 5: cost of 1 pen = £1.60 ÷ 5 = £0.32'] },
  { title: 'Compare', say: '£0.30 a pen is cheaper.', rows: ['! The pack of 8'] },
]))
practice(unit, 'A 2 litre bottle of juice costs £1.80. A 3 litre bottle costs £2.85. How much does 1 litre cost in the better-value bottle, in pence?', 'R8.1 Q3', number(90, '90p'), 'Find the cost of 1 litre in each bottle.', board([
  { title: 'Pick a common amount', say: 'The bottles are different sizes, so find what 1 litre costs in each.', rows: ['> Compare the cost of 1 litre in each bottle'] },
  { title: 'Calculate the cost of 1 litre', say: 'The 2 litre bottle, divide by 2. The 3 litre bottle, divide by 3.', rows: ['2 litre: cost of 1 litre = £1.80 ÷ 2 = £0.90', '3 litre: cost of 1 litre = £2.85 ÷ 3 = £0.95'] },
  { title: 'Compare', say: '£0.90 a litre is cheaper, so the 2 litre bottle is better value. The question asks in pence: £0.90 is 90p.', rows: ['! 90p, the 2 litre bottle'] },
]), [[95, 'That’s the 3 litre bottle. The 2 litre bottle is cheaper per litre.'], [150, 'Divide the price by the litres: 180 ÷ 2 = 90p.']])
practice(unit, 'A 250 g jar of coffee costs £1.75. A 400 g jar costs £2.60. Which jar is better value?', 'R8.1 Q4', choose('The 400 g jar', ['The 250 g jar', 'It costs less, but it’s 70p for 100 g; the 400 g jar is 65p.'], ['They are the same value', '175 ÷ 2.5 = 70p and 260 ÷ 4 = 65p for 100 g.']), 'Find the cost of 100 g in each jar.', board([
  { title: 'Pick a common amount', say: 'The jars are different sizes, so find what 100 g of each costs.', rows: ['> Compare the cost of 100 g of each jar'] },
  { title: 'Calculate the cost of 100 g', say: '250 g is 2.5 lots of 100 g, so divide by 2.5. 400 g is 4 lots, so divide by 4.', rows: ['250 g jar: cost of 100 g = £1.75 ÷ 2.5 = £0.70', '400 g jar: cost of 100 g = £2.60 ÷ 4 = £0.65'] },
  { title: 'Compare', say: '£0.65 is cheaper for 100 g.', rows: ['! The 400 g jar'] },
]))
practice(unit, 'Rice comes as 1.5 kg for £4.20, 600 g for £1.74 or 2 kg for £5.80. What is the cost of 100 g of the best-value bag, in pence?', 'R8.1 Q5', number(28, '28p'), 'Change kg to g, then find the cost of 100 g of each.', board([
  { title: 'Pick a common amount', say: 'The bags are different sizes, so find what 100 g of each costs.', rows: ['> Compare the cost of 100 g of each bag'] },
  { title: 'Convert kg to g', say: '1 kg is 1000 g, so the kg bags are 1500 g and 2000 g.', rows: ['1.5 kg = 1500 g', '2 kg = 2000 g'] },
  { title: 'Calculate the cost of 100 g', say: '1500 g is 15 lots of 100 g, 600 g is 6 lots and 2000 g is 20 lots.', rows: ['1.5 kg bag: cost of 100 g = £4.20 ÷ 15 = £0.28', '600 g bag: cost of 100 g = £1.74 ÷ 6 = £0.29', '2 kg bag: cost of 100 g = £5.80 ÷ 20 = £0.29'] },
  { title: 'Compare', say: '£0.28 is the cheapest, and the question asks in pence: 28p.', rows: ['! 28p, the 1.5 kg bag'] },
]), [[29, 'Two bags are 29p for 100 g, but the 1.5 kg bag is cheaper: 420 ÷ 15 = 28p.']])

/* ---------- Rung 2: offers (R8.2) ---------- */

const juice = worked(offers, 'A 1 litre carton of juice costs £1.20, and the second carton is half price. A 2 litre carton costs £1.70. Which is cheaper for 2 litres?', 'Offer or the big carton?', 'R8.2 video + Q1', board([
  { title: 'What the offer means', say: 'Half price means you pay half, so the second carton is £1.20 ÷ 2.', rows: ['> Second carton half price: pay full price for 1 carton, then half price for the next', 'Second carton = £1.20 ÷ 2 = £0.60'] },
  { title: 'Pick a common amount', say: 'Compare 2 litres each way: 2 small cartons on the offer, or 1 large carton.', rows: ['> To get 2 litres, buy 2 small cartons or 1 large carton'] },
  { title: 'Calculate buying 2 small cartons', say: 'The first carton is full price and the second is £0.60.', rows: ['2 small cartons = £1.20 + £0.60 = £1.80'] },
  { title: 'Calculate buying 1 large carton', say: 'The large carton is 2 litres on its own.', rows: ['1 large carton = £1.70'] },
  { title: 'Compare', say: 'Both give 2 litres, and £1.70 is less.', rows: ['! The 2 litre carton is cheaper, even with the offer'] },
]), 'Our aim: work out what an offer really costs, then compare the same amount each way.')
video(juice, media('offers', 'Offer or the big carton?', 'R8.2_Offers.mp4', 39, [
  'Offers: a 1 litre carton of juice is £1.20, and the second carton is half price. A 2 litre carton is £1.70. Which is better for 2 litres?',
  'Step 1, cost the offer: first carton £1.20, second, half price, £0.60. 1.20 + 0.60 = £1.80.',
  'Step 2, same amount: two small cartons are £1.80, one large carton is £1.70. The 2 litre carton is cheaper.',
  'Other offers: 3 for 2 means pay for 2 and get 3. 25% extra free means 400 g becomes 400 × 1.25 = 500 g for the same price. Then compare the same amount, as before.',
  'Work out what the offer really costs, compare the same amount each way, and for extra free increase the amount, not the price.',
]))
pounds(practice(offers, 'Chocolate bars cost £1.50 each, on a 3 for 2 offer. How much does each bar cost with the offer?', 'R8.2 Q2', number(1, '£1'), '3 for 2: you pay for 2 bars and get 3.', board([
  { title: 'What the offer means', say: 'You take 3 bars but only pay for 2.', rows: ['> 3 for 2: take 3 bars, pay for only 2. The third bar is free'] },
  { title: 'Calculate the cost of 3 bars', say: 'You pay for 2 bars and get 3.', rows: ['3 bars = £1.50 × 2 = £3.00'] },
  { title: 'Calculate the cost of 1 bar', say: '£3.00 buys 3 bars, so divide by 3.', rows: ['1 bar = £3.00 ÷ 3 = £1.00', '! £1 each'] },
]), [[0.75, 'You pay for 2 bars and get 3, so £3 ÷ 3.'], [3, 'That’s the cost of 3 bars. Divide by 3 for each one.']]))
practice(offers, 'Brand A: 400 g for £2 with 25% extra free. Brand B: 450 g for £1.89. How many grams are in a pack of Brand A with the offer?', 'R8.2 Q3', number(500, '500 g'), '25% extra: multiply the amount by 1.25.', board([
  { title: 'What the offer means', say: 'The price stays £2. Only the amount goes up.', rows: ['> 25% extra free: you get 25% more in the pack, for the same price'] },
  { title: 'Calculate the extra', say: '25% is a quarter, so divide 400 g by 4.', rows: ['25% of 400 g = 400 g ÷ 4 = 100 g'] },
  { title: 'Calculate Brand A with the offer', say: 'Add the extra to the 400 g.', rows: ['Brand A = 400 g + 100 g = 500 g'] },
  { title: 'Calculate the cost of 100 g', say: 'A is now 500 g, 5 lots of 100 g, so divide by 5. B is 450 g, 4.5 lots, so divide by 4.5.', rows: ['A: cost of 100 g = £2.00 ÷ 5 = £0.40', 'B: cost of 100 g = £1.89 ÷ 4.5 = £0.42', '! 500 g, so Brand A is better value'] },
]), [[100, 'That’s the extra 25%. Add it to the 400 g.'], [425, '25% of 400 g is 100 g, not 25 g.']])
practice(offers, 'Shop X sells cereal at £2.40 a box, buy one get one free. Shop Y sells it at 2 boxes for £2.20. Kai wants 2 boxes. Where is it cheaper?', 'R8.2 Q4', choose('Shop Y', ['Shop X', 'Buy one get one free means 2 boxes for £2.40, which is more than £2.20.'], ['They cost the same', 'X is £2.40 for 2 boxes; Y is £2.20.']), 'Find what 2 boxes cost in each shop.', board([
  { title: 'What the offer means', say: 'At Shop X, the second box is free.', rows: ['> Buy one get one free: pay for 1 box, get 2'] },
  { title: 'Calculate 2 boxes in each shop', say: 'Kai wants 2 boxes. At Shop X you pay for 1 of them.', rows: ['Shop X: 2 boxes = £2.40 × 1 = £2.40', 'Shop Y: 2 boxes = £2.20'] },
  { title: 'Compare', say: '£2.20 is less.', rows: ['! Shop Y'] },
]))
pounds(practice(offers, 'Lee needs 6 cans. Shop A sells cans at 75p each, 3 for 2. Shop B sells 6 cans for £3.30 with 10% off. How much does Lee pay at the cheaper shop?', 'R8.2 Q5', number(2.97, '£2.97'), 'Cost 6 cans at each shop: 3 for 2 means paying for 4 of the 6.', board([
  { title: 'What the offers mean', say: 'Shop A gives free cans. Shop B takes money off the price.', rows: ['> 3 for 2: for every 3 cans, pay for 2', '> 10% off: pay 90% of the price'] },
  { title: 'Calculate 6 cans at Shop A', say: '6 cans is 2 lots of 3, so you pay for 2 × 2 = 4 cans.', rows: ['Shop A: 6 cans = £0.75 × 4 = £3.00'] },
  { title: 'Calculate 6 cans at Shop B', say: '90% is 0.9, so multiply the price by 0.9.', rows: ['Shop B: 6 cans = £3.30 × 0.9 = £2.97'] },
  { title: 'Compare', say: '£2.97 is cheaper.', rows: ['! £2.97 at Shop B'] },
]), [[3, 'That’s Shop A. Shop B, with 10% off, is cheaper.'], [3.3, 'Take off the 10%: 3.30 × 0.9.']]))

add('mixed', 'Best buys', 'R8 consolidation', text(
  'Find the cost of the same amount of each (1 item, 1 litre, 100 g), then pick the lowest. Same units first, and work in pence.',
  'The cheapest pack is not always the best buy.',
  'For an offer, work out what you really pay, then compare the same amount each way: 3 for 2 means pay for 2, extra free means more for the same price.',
))

export const tutorBestBuysLesson: TutorMethodLesson = {
  id: 'L039', number: 39, title: 'Best buys', level: 'GCSE Foundation',
  goal: 'Compare value for money by finding the cost of the same amount of each, including special offers.',
  labels: { [unit]: 'Price per unit', [offers]: 'Offers', mixed: 'Review' },
  states: finish(),
}
