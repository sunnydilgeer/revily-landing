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
  { title: 'Pick an amount', say: 'The boxes are different sizes, so find the cost of the same amount of each: 100 g divides into all three. 1.2 kg = 1200 g.', rows: ['> cost of 100 g, in pence'] },
  { title: 'Divide each price', say: 'A has 5 lots of 100 g, B has 7.5 and C has 12.', rows: ['A: 320 ÷ 5 = 64p', 'B: 450 ÷ 7.5 = 60p', 'C: 744 ÷ 12 = 62p'] },
  { title: 'Compare', say: 'The lowest cost for 100 g is the best value.', rows: ['! B is the best value'] },
]), 'Our aim: the cheapest box isn’t always the best buy. Find the cost of the same amount of each, then pick the lowest.')
video(cereal, media('unit', 'Which cereal box is the best value?', 'R8.1_Price_Per_Unit.mp4', 43, [
  'Best buys: cereal comes in three sizes. A is 500 g for £3.20, B is 750 g for £4.50, C is 1.2 kg for £7.44. Which is the best value?',
  'Step 1, pick an amount: the boxes are different sizes, so find the cost of the same amount of each. 100 g divides into all three: 1.2 kg = 1200 g.',
  'Step 2, divide: A 320 ÷ 5 = 64p, B 450 ÷ 7.5 = 60p, C 744 ÷ 12 = 62p for 100 g.',
  'Step 3, compare: 60p is the lowest, so B is the best value.',
  'Watch out: the cheapest box is not always the best buy. Work in pence to keep the numbers whole.',
]))
practice(unit, 'A pack of 8 pens costs £2.40. A pack of 5 pens costs £1.60. Which pack is better value?', 'R8.1 Q2', choose('The pack of 8', ['The pack of 5', 'It costs less, but each pen is 32p: the pack of 8 is 30p a pen.'], ['They are the same value', '240 ÷ 8 = 30p a pen, but 160 ÷ 5 = 32p a pen.']), 'Find the cost of 1 pen in each pack.', board([
  { title: 'Cost of 1 pen', say: 'Divide each price, in pence, by the number of pens.', rows: ['240 ÷ 8 = 30p', '160 ÷ 5 = 32p'] },
  { title: 'Compare', say: '30p a pen is cheaper.', rows: ['! The pack of 8'] },
]))
practice(unit, 'A 2 litre bottle of juice costs £1.80. A 3 litre bottle costs £2.85. How much does 1 litre cost in the better-value bottle, in pence?', 'R8.1 Q3', number(90, '90p'), 'Find the cost of 1 litre in each bottle.', board([
  { title: 'Cost of 1 litre', say: 'Divide each price by the number of litres.', rows: ['180 ÷ 2 = 90p', '285 ÷ 3 = 95p'] },
  { title: 'Compare', say: '90p a litre is cheaper, so the 2 litre bottle is better value.', rows: ['! 90p, the 2 litre bottle'] },
]), [[95, 'That’s the 3 litre bottle. The 2 litre bottle is cheaper per litre.'], [150, 'Divide the price by the litres: 180 ÷ 2 = 90p.']])
practice(unit, 'A 250 g jar of coffee costs £1.75. A 400 g jar costs £2.60. Which jar is better value?', 'R8.1 Q4', choose('The 400 g jar', ['The 250 g jar', 'It costs less, but it’s 70p for 100 g; the 400 g jar is 65p.'], ['They are the same value', '175 ÷ 2.5 = 70p and 260 ÷ 4 = 65p for 100 g.']), 'Find the cost of 100 g in each jar.', board([
  { title: 'Cost of 100 g', say: '250 g is 2.5 lots of 100 g, and 400 g is 4.', rows: ['175 ÷ 2.5 = 70p', '260 ÷ 4 = 65p'] },
  { title: 'Compare', say: '65p is cheaper.', rows: ['! The 400 g jar'] },
]))
practice(unit, 'Rice comes as 1.5 kg for £4.20, 600 g for £1.74 or 2 kg for £5.80. What is the cost of 100 g of the best-value bag, in pence?', 'R8.1 Q5', number(28, '28p'), 'Change kg to g, then find the cost of 100 g of each.', board([
  { title: 'Same units', say: '1.5 kg = 1500 g and 2 kg = 2000 g.', rows: ['1.5 kg = 1500 g', '2 kg = 2000 g'] },
  { title: 'Cost of 100 g', say: 'Divide each price by the number of 100 g.', rows: ['420 ÷ 15 = 28p', '174 ÷ 6 = 29p', '580 ÷ 20 = 29p'] },
  { title: 'Compare', say: '28p is cheapest, the 1.5 kg bag.', rows: ['! 28p, the 1.5 kg bag'] },
]), [[29, 'Two bags are 29p for 100 g, but the 1.5 kg bag is cheaper: 420 ÷ 15 = 28p.']])

/* ---------- Rung 2: offers (R8.2) ---------- */

const juice = worked(offers, 'A 1 litre carton of juice costs £1.20, and the second carton is half price. A 2 litre carton costs £1.70. Which is cheaper for 2 litres?', 'Offer or the big carton?', 'R8.2 video + Q1', board([
  { title: 'Cost the offer', say: 'The first carton is full price; the second is half of £1.20.', rows: ['1.20 + 0.60 = 1.80'] },
  { title: 'Same amount', say: 'Both ways give 2 litres: £1.80 against £1.70.', rows: ['> two small £1.80, one large £1.70'] },
  { title: 'Compare', say: 'The big carton costs less for the same juice.', rows: ['! The 2 litre carton'] },
]), 'Our aim: work out what an offer really costs, then compare the same amount each way.')
video(juice, media('offers', 'Offer or the big carton?', 'R8.2_Offers.mp4', 39, [
  'Offers: a 1 litre carton of juice is £1.20, and the second carton is half price. A 2 litre carton is £1.70. Which is better for 2 litres?',
  'Step 1, cost the offer: first carton £1.20, second, half price, £0.60. 1.20 + 0.60 = £1.80.',
  'Step 2, same amount: two small cartons are £1.80, one large carton is £1.70. The 2 litre carton is cheaper.',
  'Other offers: 3 for 2 means pay for 2 and get 3. 25% extra free means 400 g becomes 400 × 1.25 = 500 g for the same price. Then compare the same amount, as before.',
  'Work out what the offer really costs, compare the same amount each way, and for extra free increase the amount, not the price.',
]))
pounds(practice(offers, 'Chocolate bars cost £1.50 each, on a 3 for 2 offer. How much does each bar cost with the offer?', 'R8.2 Q2', number(1, '£1'), '3 for 2: you pay for 2 bars and get 3.', board([
  { title: 'Pay for 2', say: 'You get 3 bars for the price of 2.', rows: ['1.50 × 2 = 3.00'] },
  { title: 'Share between 3', say: 'That buys 3 bars.', rows: ['3.00 ÷ 3 = 1.00', '! £1 each'] },
]), [[0.75, 'You pay for 2 bars and get 3, so £3 ÷ 3.'], [3, 'That’s the cost of 3 bars. Divide by 3 for each one.']]))
practice(offers, 'Brand A: 400 g for £2 with 25% extra free. Brand B: 450 g for £1.89. How many grams are in a pack of Brand A with the offer?', 'R8.2 Q3', number(500, '500 g'), '25% extra: multiply the amount by 1.25.', board([
  { title: 'Add the extra', say: '25% more than 400 g.', rows: ['400 × 1.25 = 500'] },
  { title: 'Cost of 100 g', say: 'A is now 500 g for £2; B is 450 g for £1.89.', rows: ['A: 200 ÷ 5 = 40p', 'B: 189 ÷ 4.5 = 42p', '! 500 g, so Brand A is better value'] },
]), [[100, 'That’s the extra 25%. Add it to the 400 g.'], [425, '25% of 400 g is 100 g, not 25 g.']])
practice(offers, 'Shop X sells cereal at £2.40 a box, buy one get one free. Shop Y sells it at 2 boxes for £2.20. Kai wants 2 boxes. Where is it cheaper?', 'R8.2 Q4', choose('Shop Y', ['Shop X', 'Buy one get one free means 2 boxes for £2.40, which is more than £2.20.'], ['They cost the same', 'X is £2.40 for 2 boxes; Y is £2.20.']), 'Find what 2 boxes cost in each shop.', board([
  { title: 'Cost of 2 boxes', say: 'Buy one get one free: pay for 1, get 2.', rows: ['X: 2 boxes = £2.40', 'Y: 2 boxes = £2.20'] },
  { title: 'Compare', say: '£2.20 is less.', rows: ['! Shop Y'] },
]))
pounds(practice(offers, 'Lee needs 6 cans. Shop A sells cans at 75p each, 3 for 2. Shop B sells 6 cans for £3.30 with 10% off. How much does Lee pay at the cheaper shop?', 'R8.2 Q5', number(2.97, '£2.97'), 'Cost 6 cans at each shop: 3 for 2 means paying for 4 of the 6.', board([
  { title: 'Shop A', say: '6 cans on 3 for 2: pay for 4.', rows: ['4 × 0.75 = 3.00'] },
  { title: 'Shop B', say: '10% off leaves 90%.', rows: ['3.30 × 0.9 = 2.97'] },
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
