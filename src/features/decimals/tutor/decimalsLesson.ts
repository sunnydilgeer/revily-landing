import { chooser, numeric, working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import {
  decimalAdditionWorking,
  decimalDivisionWorking,
  decimalMultiplicationWorking,
  decimalSubtractionWorking,
  methodWorking,
  type MethodWorking,
} from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson, TutorMethodState } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'

const choose = chooser()

const { add, finish } = author(6)
const addition = 'decimal-addition', subtraction = 'decimal-subtraction', multiplication = 'decimal-multiplication', division = 'decimal-division'
const text = (...lines: string[]) => ({ kind: 'text' as const, lines })
const explain = (answer: string, first: string, second: string) => working(answer, ['Choose the method.', first], ['Complete and check.', second])

function practice(topic: MicroSkillId, title: string, sourceRef: string, interaction: InteractionDefinition, answer: string, explanation: ReturnType<typeof working>, hint: string, walkthrough?: MethodWorking, lines: string[] = [title]) {
  const state = add(topic, title, sourceRef, text(...lines), interaction, explanation, hint)
  if (walkthrough) state.working = walkthrough
  return state
}

function video(state: TutorMethodState, definition: TutorMethodState['video']) { state.video = definition }

const addQ1 = methodWorking(decimalAdditionWorking([5.6, 2.75]))
const addVideo = add(addition, 'Work out 5.6 + 2.75.', 'N6.1 Q1; video 19.42.44', addQ1)
video(addVideo, {
  id: 'lesson6-adding-decimals', src: '/media/lesson-6/adding-decimals.mp4', poster: '/media/lesson-6/adding-decimals.jpg',
  title: 'Adding decimals: 5.6 + 2.75', durationSeconds: 29.2, sourceFile: 'WhatsApp Video 2026-09-18 at 19.42.44.mp4',
  textAlternative: ['Line up the decimal points in 5.6 and 2.75.', 'Write 5.6 as 5.60 so both numbers show hundredths.', 'Add from the right: 0 + 5 = 5; 6 + 7 = 13, write 3 and carry 1.', 'Add the ones, including the carried 1, to get 8.35.'],
})
practice(addition, 'Work out 3.2 + 4.5.', 'N6.1 Q2', numeric(7.7), '7.7', explain('7.7', 'The points already align.', 'Add tenths, then ones: 3.2 + 4.5 = 7.7.'), 'Line up the decimal points. Both numbers already have one decimal place.', methodWorking(decimalAdditionWorking([3.2, 4.5])))
practice(addition, 'Work out 12.08 + 5.9.', 'N6.1 Q3', numeric(17.98), '17.98', explain('17.98', 'Write 5.9 as 5.90.', 'Add the aligned columns to get 17.98.'), 'Pad 5.9 with a trailing zero, then work from hundredths to tens.', methodWorking(decimalAdditionWorking([12.08, 5.9])))
practice(addition, 'Work out 23.45 + 6.708.', 'N6.1 Q4a', numeric(30.158), '30.158', explain('30.158', 'Write 23.45 as 23.450.', 'Add every aligned column, carrying where needed.'), 'Use three decimal places in both addends: 23.450 + 6.708.', methodWorking(decimalAdditionWorking([23.45, 6.708])))
const addMoney = practice(addition, 'The total is £30.158. Round this amount to the nearest penny.', 'N6.1 Q4b', numeric(30.16), '£30.16', explain('£30.16', 'Start from 30.158.', 'The third decimal is 8, so round the hundredths up: £30.16.'), 'Look at the third decimal place. Five or more rounds the hundredths up.', methodWorking(decimalAdditionWorking([30.15, 0.008])), ['Total: £30.158', 'Round to the nearest penny (2 decimal places)'])
addMoney.answerLabel = 'Amount (£)'
practice(addition, 'Work out 14.6 + 8.75 + 3.081.', 'N6.1 Q5a', numeric(26.431), '26.431', explain('26.431', 'Write 14.600, 8.750 and 3.081.', 'Add all three numbers by aligned columns.'), 'Give all three numbers three decimal places before adding.', methodWorking(decimalAdditionWorking([14.6, 8.75, 3.081])))
practice(addition, 'The total is 26.431. What is the value of the digit 4?', 'N6.1 Q5b', numeric(0.4), '0.4', explain('0.4', 'The total is 26.431.', 'The 4 is in the tenths column, so its value is 0.4.'), 'Read the first digit after the decimal point.', methodWorking(decimalAdditionWorking([14.6, 8.75, 3.081])), ['Total: 26.431', 'Value of the digit 4'])
practice(addition, 'Ravi says: “When adding decimals, you should line up the numbers by their last digit, not by the decimal point.” Is Ravi correct?', 'N6.1 Q5c', choose([
  'No. Lining up 5.6 and 2.75 by their last digits puts tenths under hundredths; equal place values must align.',
  'Yes. The final digits always have the same place value.',
  'Yes. Decimal points may move during addition without changing the values.',
]), 'No - line up decimal points.', explain('No - line up decimal points.', 'Last-digit alignment can put tenths under hundredths.', 'Decimal-point alignment keeps equal place values in the same column.'), 'Test Ravi’s method on 5.6 + 2.75. Identify the place value of each final digit.', undefined, ['Compare 5.6 and 2.75', 'Which columns represent equal place values?'])

const subQ1 = methodWorking(decimalSubtractionWorking(8.35, 2.6))
const subVideo = add(subtraction, 'Work out 8.35 - 2.6.', 'N6.2 Q1; video 19.44.03', subQ1)
video(subVideo, {
  id: 'lesson6-subtracting-decimals', src: '/media/lesson-6/subtracting-decimals.mp4', poster: '/media/lesson-6/subtracting-decimals.jpg',
  title: 'Subtracting decimals: 8.35 - 2.6', durationSeconds: 29.7, sourceFile: 'WhatsApp Video 2026-09-18 at 19.44.03.mp4',
  textAlternative: ['Line up the decimal points in 8.35 and 2.6.', 'Write 2.6 as 2.60.', 'Subtract the hundredths, then regroup one whole as ten tenths.', 'Complete the subtraction to get 5.75.'],
})
practice(subtraction, 'Work out 5.8 - 2.3.', 'N6.2 Q2', numeric(3.5), '3.5', explain('3.5', 'The points already align.', 'Subtract tenths, then ones: 5.8 - 2.3 = 3.5.'), 'Subtract equal place values in the same column.', methodWorking(decimalSubtractionWorking(5.8, 2.3)))
practice(subtraction, 'Work out 14.2 - 5.75.', 'N6.2 Q3', numeric(8.45), '8.45', explain('8.45', 'Write 14.2 as 14.20.', 'Regroup through the tenths and ones to get 8.45.'), 'Write 14.20, then regroup one place at a time from right to left.', methodWorking(decimalSubtractionWorking(14.2, 5.75)))
practice(subtraction, 'Work out 40 - 17.85.', 'N6.2 Q4a', numeric(22.15), '22.15', explain('22.15', 'Write 40 as 40.00.', 'Regroup through the zeroes and subtract each column.'), 'Write 40.00. Regroup from the tens through the ones, tenths and hundredths.', methodWorking(decimalSubtractionWorking(40, 17.85)))
const change = practice(subtraction, 'You pay for an item costing £17.85 with a £40 note. How much change should you get?', 'N6.2 Q4b', numeric(22.15), '£22.15', explain('£22.15', 'Change means amount paid minus cost.', '£40.00 - £17.85 = £22.15.'), 'Subtract the cost, £17.85, from the amount paid, £40.00.', methodWorking(decimalSubtractionWorking(40, 17.85)), ['Paid: £40.00', 'Cost: £17.85'])
change.answerLabel = 'Change (£)'
const chainedSubtraction = methodWorking(decimalSubtractionWorking(21.4, 8.75), decimalSubtractionWorking(12.65, 3.6))
practice(subtraction, 'Work out 21.4 - 8.75 - 3.6.', 'N6.2 Q5a', numeric(9.05), '9.05', explain('9.05', 'Work left to right: 21.40 - 8.75 = 12.65.', 'Then 12.65 - 3.60 = 9.05.'), 'Subtractions of equal priority are completed from left to right.', chainedSubtraction)
practice(subtraction, 'The result is 9.05. What is the value of the digit 5?', 'N6.2 Q5b', numeric(0.05), '0.05', explain('0.05', 'The result is 9.05.', 'The 5 is in the hundredths column, so its value is 0.05.'), 'Read the second digit after the decimal point.', chainedSubtraction, ['Result: 9.05', 'Value of the digit 5'])
practice(subtraction, 'Meera says: “Subtracting decimals never needs regrouping if the first number has fewer decimal places.” Is Meera correct?', 'N6.2 Q5c', choose([
  'No. 21.40 - 8.75 needs regrouping even though 21.4 was originally written with fewer decimal places.',
  'Yes. Fewer written decimal places guarantee that every top digit is larger.',
  'No. Decimal subtraction never uses regrouping.',
]), 'No - the digits determine whether regrouping is needed.', explain('No - the digits determine whether regrouping is needed.', 'Trailing zeroes do not change 21.4.', 'In 21.40 - 8.75, 0 hundredths cannot subtract 5 without regrouping.'), 'Rewrite 21.4 as 21.40 and inspect the hundredths column.', undefined, ['Test the claim with 21.4 - 8.75'])

const mulQ1 = decimalMultiplicationWorking(3.4, 1.2)
const mulVideo = add(multiplication, 'Work out 3.4 × 1.2.', 'N6.3 Q1; video 19.19.17', mulQ1)
video(mulVideo, {
  id: 'lesson6-multiplying-decimals', src: '/media/lesson-6/multiplying-decimals.mp4', poster: '/media/lesson-6/multiplying-decimals.jpg',
  title: 'Multiplying decimals: 3.4 × 1.2', durationSeconds: 66.2, sourceFile: 'WhatsApp Video 2026-09-18 at 19.19.17.mp4',
  textAlternative: ['Calculate the digits as 34 × 12 using long multiplication.', 'The partial products are 68 and 340, giving 408.', 'The original factors contain two decimal places altogether.', 'Divide 408 by 100 to restore those places: 3.4 × 1.2 = 4.08.'],
})
practice(multiplication, 'Work out 2.5 × 3.', 'N6.3 Q2', numeric(7.5), '7.5', explain('7.5', 'Calculate 25 × 3 = 75.', 'There is one decimal place altogether, so the product is 7.5.'), 'Calculate 25 × 3, then restore one decimal place.', decimalMultiplicationWorking(2.5, 3))
practice(multiplication, 'Work out 4.6 × 0.5.', 'N6.3 Q3', numeric(2.3), '2.3', explain('2.3', 'Calculate 46 × 5 = 230.', 'Restore two decimal places: 2.30 = 2.3.'), 'There are two decimal places altogether across the factors.', decimalMultiplicationWorking(4.6, 0.5))
practice(multiplication, 'Work out 5.2 × 3.4.', 'N6.3 Q4a', numeric(17.68), '17.68', explain('17.68', 'Calculate 52 × 34 = 1,768.', 'Restore two decimal places to get 17.68.'), 'Use long multiplication for 52 × 34, then count two decimal places.', decimalMultiplicationWorking(5.2, 3.4))
const ribbonCost = practice(multiplication, 'Ribbon costs £5.20 per metre. What is the cost of 3.4 metres?', 'N6.3 Q4b', numeric(17.68), '£17.68', explain('£17.68', 'Cost = price per metre × number of metres.', '5.20 × 3.4 = 17.68, so the cost is £17.68.'), 'Multiply the price per metre, £5.20, by 3.4 metres.', decimalMultiplicationWorking(5.2, 3.4), ['£5.20 per metre', '3.4 metres'])
ribbonCost.answerLabel = 'Cost (£)'
practice(multiplication, 'Work out 6.25 × 1.6.', 'N6.3 Q5a', numeric(10), '10', explain('10', 'Calculate 625 × 16 = 10,000.', 'Restore three decimal places: 10.000 = 10.'), 'The factors have three decimal places altogether.', decimalMultiplicationWorking(6.25, 1.6))
practice(multiplication, 'For 6.25 × 1.6, how many decimal places are there altogether in the two factors?', 'N6.3 Q5b', numeric(3), '3', explain('3', '6.25 has two decimal places.', '1.6 has one, so 2 + 1 = 3.'), 'Count places in both factors, not in the simplified answer.', decimalMultiplicationWorking(6.25, 1.6), ['6.25 → 2 decimal places', '1.6 → 1 decimal place'])
practice(multiplication, 'Tom says: “Multiplying two decimals together always gives an answer with more decimal places than either original number.” Is Tom correct?', 'N6.3 Q5c', choose([
  'No. 6.25 × 1.6 = 10, whose trailing decimal zeroes are unnecessary.',
  'Yes. The answer must display every decimal place counted in the factors.',
  'No. Multiplying decimals always produces a whole number.',
]), 'No - trailing zeroes may be removed.', explain('No - trailing zeroes may be removed.', 'The placement process gives 10.000.', '10.000 has the same value as 10, so the final answer can show fewer decimal places.'), 'Use 6.25 × 1.6 as a counterexample.', undefined, ['Test the claim with 6.25 × 1.6'])

const divQ1 = methodWorking(decimalDivisionWorking(5.46, 0.6))
const divVideo = add(division, 'Work out 5.46 ÷ 0.6.', 'N6.4 Q1; video 19.19.40', divQ1)
video(divVideo, {
  id: 'lesson6-dividing-decimals', src: '/media/lesson-6/dividing-decimals.mp4', poster: '/media/lesson-6/dividing-decimals.jpg',
  title: 'Dividing decimals: 5.46 ÷ 0.6', durationSeconds: 51.2, sourceFile: 'WhatsApp Video 2026-09-18 at 19.19.40.mp4',
  textAlternative: ['Multiply 0.6 by 10 to make the divisor 6.', 'Multiply 5.46 by the same 10 to make 54.6.', 'Set out 54.6 ÷ 6 and keep the decimal point aligned in the quotient.', 'Divide to obtain 9.1, so 5.46 ÷ 0.6 = 9.1.'],
})
practice(division, 'Work out 8.4 ÷ 2.', 'N6.4 Q2', numeric(4.2), '4.2', explain('4.2', 'The divisor 2 is already whole.', 'Divide 8.4 by 2 to get 4.2.'), 'No scaling is needed because the divisor is a whole number.', methodWorking(decimalDivisionWorking(8.4, 2)))
practice(division, 'Work out 9.36 ÷ 1.2.', 'N6.4 Q3', numeric(7.8), '7.8', explain('7.8', 'Multiply both numbers by 10: 93.6 ÷ 12.', '93.6 ÷ 12 = 7.8.'), 'Scale both the dividend and divisor by 10.', methodWorking(decimalDivisionWorking(9.36, 1.2)))
practice(division, 'Work out 12.6 ÷ 0.3.', 'N6.4 Q4a', numeric(42), '42', explain('42', 'Multiply both numbers by 10: 126 ÷ 3.', '126 ÷ 3 = 42.'), 'Make 0.3 into 3 and apply the same ×10 to 12.6.', methodWorking(decimalDivisionWorking(12.6, 0.3)))
practice(division, 'A 12.6 m ribbon is cut into pieces 0.3 m long. How many pieces are there?', 'N6.4 Q4b', numeric(42), '42 pieces', explain('42 pieces', 'The number of equal pieces is 12.6 ÷ 0.3.', 'Scale both by 10: 126 ÷ 3 = 42 pieces.'), 'Divide the total length, 12.6 m, by the length of each piece, 0.3 m.', methodWorking(decimalDivisionWorking(12.6, 0.3)), ['12.6 m altogether', '0.3 m per piece'])
practice(division, 'Work out 15.75 ÷ 2.5.', 'N6.4 Q5a', numeric(6.3), '6.3', explain('6.3', 'Multiply both by 10: 157.5 ÷ 25.', '157.5 ÷ 25 = 6.3.'), 'Scale both numbers by 10 before dividing.', methodWorking(decimalDivisionWorking(15.75, 2.5)))
practice(division, 'In 15.75 ÷ 2.5, the divisor is multiplied by 10 to become 25. What does the dividend become?', 'N6.4 Q5b', numeric(157.5), '157.5', explain('157.5', 'The divisor 2.5 is multiplied by 10 to become 25.', 'Apply the same ×10 to 15.75: it becomes 157.5.'), 'Use exactly the same scale factor on both numbers.', methodWorking(decimalDivisionWorking(15.75, 2.5)), ['15.75 ÷ 2.5', 'Scale both numbers by 10'])
practice(division, 'Zara says: “To divide by a decimal, only move the divisor’s decimal point; the dividend can stay the same.” Is Zara correct?', 'N6.4 Q5c', choose([
  'No. Both numbers must be scaled equally; 15.75 ÷ 25 = 0.63, but the original quotient is 6.3.',
  'Yes. Changing only the divisor keeps the division equivalent.',
  'No. Only the dividend should be multiplied by 10.',
]), 'No - scale the dividend and divisor by the same amount.', explain('No - scale both numbers equally.', 'Changing 2.5 to 25 alone makes the divisor ten times larger.', 'Multiply both by 10: 15.75 ÷ 2.5 = 157.5 ÷ 25 = 6.3.'), 'Compare scaling only 2.5 with scaling both numbers.', undefined, ['Compare 15.75 ÷ 2.5 with 15.75 ÷ 25'])

add('mixed', 'Line up, regroup, count and scale', 'N6.1-N6.4 consolidation', text('Add and subtract: align decimal points', 'Multiply: calculate whole-number digits, then restore the places', 'Divide: make the divisor whole and scale both numbers equally'), undefined, undefined, undefined, 'Choose the rule that matches the operation, keep every place value visible, and check that the answer is sensible.')

const states = finish()
export const tutorDecimalsLesson: TutorMethodLesson = {
  id: 'L006', number: 6, title: 'Decimal calculations', level: 'GCSE Foundation',
  goal: 'Add, subtract, multiply and divide decimals accurately using place value.',
  labels: { [addition]: 'Adding decimals', [subtraction]: 'Subtracting decimals', [multiplication]: 'Multiplying decimals', [division]: 'Dividing decimals', mixed: 'Review' },
  states,
}
