import { select, working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import { numberSenseWorking } from '../../written-methods/tutor/numberSenseWorking'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'

const { add, finish } = author(11)
const decimals = 'ordering-decimals'
const largeNumbers = 'ordering-large-numbers'
const negatives = 'ordering-negative-numbers'
const mixedForms = 'ordering-fractions-decimals-percentages'
const text = (...lines: string[]) => ({ kind: 'text' as const, lines })

const openInterval = (example: number, lowerBound: number, upperBound: number, displayAnswer: string): InteractionDefinition => ({
  type: 'numericInput', correctAnswer: example, displayAnswer, acceptanceRule: 'openInterval', lowerBound, upperBound,
})
const integerInterval = (example: number, lowerBound: number, upperBound: number, displayAnswer: string): InteractionDefinition => ({
  type: 'numericInput', correctAnswer: example, displayAnswer, acceptanceRule: 'integerInterval', lowerBound, upperBound,
})
const explain = (answer: string, ...steps: Array<[string, string]>) => working(answer, ...steps)

type OrderModel = {
  expression: string
  label: string
  original: string[]
  comparable: string[]
  comparison: string
  answer: string
  method: string
  conclusion?: string
}

function orderingModel(model: OrderModel): TutorWorking {
  return numberSenseWorking(model.expression, model.label, model.original, [
    {
      title: 'Write the values in a comparable form',
      equation: model.expression,
      instruction: model.method,
      rows: model.comparable,
      note: 'Compare equal place values or equivalent forms',
    },
    {
      title: 'Compare in the requested direction',
      equation: model.comparison,
      instruction: model.conclusion ?? 'Compare from the greatest place value first. When values tie, move one place to the right.',
      rows: [...model.comparable, `Order: ${model.comparison.replaceAll('\\,', ' ')}`],
      note: 'Complete comparison',
    },
    {
      title: 'Give the answer in the original forms',
      equation: model.comparison,
      instruction: `Keep the requested direction and return converted fractions or percentages to their original forms. The answer is ${model.answer}.`,
      rows: [`Answer: ${model.answer}`],
      result: model.answer,
      note: `Answer: ${model.answer}`,
    },
  ])
}

function practice(
  topic: MicroSkillId,
  title: string,
  sourceRef: string,
  interaction: InteractionDefinition,
  answer: string,
  hint: string,
  model: OrderModel,
  feedbackSteps?: Array<[string, string]>,
  answerLabel?: string,
) {
  const steps = feedbackSteps ?? [
    ['Make the values comparable.', model.method],
    ['Compare in the requested direction.', `${model.comparison.replaceAll('\\,', ' ')}.`],
    ['State the answer.', model.answer],
  ]
  const state = add(topic, title, sourceRef, text(title), interaction, explain(answer, ...steps), hint)
  state.working = orderingModel(model)
  if (answerLabel) state.answerLabel = answerLabel
  return state
}

function worked(topic: MicroSkillId, title: string, sourceRef: string, model: OrderModel, body: string) {
  return add(topic, title, sourceRef, orderingModel(model), undefined, undefined, undefined, body)
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }

const decimalsVideo = worked(decimals, 'Order 3.7 kg, 3.07 kg, 3.72 kg and 2.9 kg from smallest to largest.', 'N11.1 Q1; video N11.1', {
  expression: '3.7,\\;3.07,\\;3.72,\\;2.9', label: 'Order decimals',
  original: ['3.7 kg', '3.07 kg', '3.72 kg', '2.9 kg'],
  comparable: ['2.90', '3.07', '3.70', '3.72'], comparison: '2.90<3.07<3.70<3.72',
  answer: '2.9 kg, 3.07 kg, 3.7 kg, 3.72 kg',
  method: 'Compare whole-number parts first. Add trailing zeroes so tied decimal places line up: 3.7 becomes 3.70.',
}, 'Line up decimal places and compare one column at a time; having more written digits does not make a decimal larger.')
video(decimalsVideo, {
  id: 'lesson11-ordering-decimals', src: '/media/lesson-11/ordering-decimals.mp4', poster: '/media/lesson-11/ordering-decimals.svg', title: 'Ordering decimal parcel masses', durationSeconds: 55, sourceFile: 'N11.1_Ordering_Decimals.mp4',
  textAlternative: ['Compare whole-number parts, making 2.9 the smallest.', 'Compare tenths among the values beginning with 3.', 'Write 3.7 as 3.70 to compare it with 3.72.', 'The order is 2.9, 3.07, 3.7, 3.72 kg.'],
})
practice(decimals, 'Rainfall was 2.4 cm on Monday, 2.04 cm on Tuesday and 2.14 cm on Wednesday. Which day had the most rain?', 'N11.1 Q2', select(['Monday', 'Tuesday', 'Wednesday'], 0), 'Monday', 'Align the values as 2.40, 2.04 and 2.14.', {
  expression: '2.4,\\;2.04,\\;2.14', label: 'Compare rainfall', original: ['Monday: 2.4 cm', 'Tuesday: 2.04 cm', 'Wednesday: 2.14 cm'], comparable: ['Monday: 2.40', 'Tuesday: 2.04', 'Wednesday: 2.14'], comparison: '2.04<2.14<2.40', answer: 'Monday', method: 'All have whole-number part 2. Compare tenths: 4 tenths is greater than 1 tenth and 0 tenths.',
})
practice(decimals, 'Order 1.85 m, 1.58 m, 1.5 m, 1.08 m and 1.8 m from largest to smallest.', 'N11.1 Q3', select([
  '1.85 m, 1.8 m, 1.58 m, 1.5 m, 1.08 m',
  '1.8 m, 1.85 m, 1.5 m, 1.58 m, 1.08 m',
  '1.08 m, 1.5 m, 1.58 m, 1.8 m, 1.85 m',
], 0), '1.85 m, 1.8 m, 1.58 m, 1.5 m, 1.08 m', 'Write 1.8 as 1.80 and 1.5 as 1.50.', {
  expression: '1.85,\\;1.58,\\;1.5,\\;1.08,\\;1.8', label: 'Order ribbon lengths', original: ['1.85 m', '1.58 m', '1.5 m', '1.08 m', '1.8 m'], comparable: ['1.85', '1.58', '1.50', '1.08', '1.80'], comparison: '1.85>1.80>1.58>1.50>1.08', answer: '1.85 m, 1.8 m, 1.58 m, 1.5 m, 1.08 m', method: 'Align the decimals to hundredths. Compare tenths first, then use hundredths to break ties.',
})
practice(decimals, 'Order the race times 28.6 s, 28.06 s, 28.66 s and 28.16 s from fastest to slowest.', 'N11.1 Q4a', select([
  '28.06 s, 28.16 s, 28.6 s, 28.66 s',
  '28.66 s, 28.6 s, 28.16 s, 28.06 s',
  '28.06 s, 28.16 s, 28.66 s, 28.6 s',
], 0), '28.06 s, 28.16 s, 28.6 s, 28.66 s', 'Fastest means the smallest time. Write 28.6 as 28.60.', {
  expression: '28.6,\\;28.06,\\;28.66,\\;28.16', label: 'Order race times', original: ['Amir: 28.6 s', 'Beth: 28.06 s', 'Cai: 28.66 s', 'Dee: 28.16 s'], comparable: ['Amir: 28.60', 'Beth: 28.06', 'Cai: 28.66', 'Dee: 28.16'], comparison: '28.06<28.16<28.60<28.66', answer: '28.06 s, 28.16 s, 28.6 s, 28.66 s', method: 'Fastest is the smallest time. Align hundredths, then compare tenths and hundredths.',
})
practice(decimals, 'Ravi says 28.06 s is slower than 28.6 s because it has more digits. Is Ravi correct?', 'N11.1 Q4b', select([
  'No. 28.06 has 0 tenths while 28.6 has 6 tenths, so 28.06 is the smaller and faster time.',
  'Yes. A decimal with more written digits is always larger.',
  'No. The times are equal because both start with 28.',
], 0), 'No - 28.06 s is the smaller time.', 'Compare place values, not the number of written digits.', {
  expression: '28.06\\;?\\;28.6', label: 'Test Ravi’s claim', original: ['Beth: 28.06 s', 'Amir: 28.6 s'], comparable: ['28.06', '28.60'], comparison: '28.06<28.60', answer: 'No - 28.06 s is smaller, so it is faster', method: 'Write 28.6 as 28.60. More digits do not mean a greater value.',
})
practice(decimals, 'Order 1.25 L, 1.205 L, 1.3 L and 1.052 L from smallest to largest.', 'N11.1 Q5a', select([
  '1.052 L, 1.205 L, 1.25 L, 1.3 L',
  '1.052 L, 1.25 L, 1.205 L, 1.3 L',
  '1.3 L, 1.25 L, 1.205 L, 1.052 L',
], 0), '1.052 L, 1.205 L, 1.25 L, 1.3 L', 'Give every value three decimal places.', {
  expression: '1.25,\\;1.205,\\;1.3,\\;1.052', label: 'Order bottle sizes', original: ['1.25 L', '1.205 L', '1.3 L', '1.052 L'], comparable: ['1.250', '1.205', '1.300', '1.052'], comparison: '1.052<1.205<1.250<1.300', answer: '1.052 L, 1.205 L, 1.25 L, 1.3 L', method: 'Write all four values to three decimal places, then compare each column from left to right.',
})
practice(decimals, 'A new bottle holds more than 1.3 L but less than 1.31 L. Write a possible size.', 'N11.1 Q5b', openInterval(1.305, 1.3, 1.31, 'Any value strictly between 1.3 and 1.31, for example 1.305 L'), 'for example, 1.305 L', 'Write the limits as 1.300 and 1.310, then choose a value strictly between them.', {
  expression: '1.3<x<1.31', label: 'Choose a decimal in an interval', original: ['Lower limit: 1.3 L', 'Upper limit: 1.31 L'], comparable: ['1.300', '1.305', '1.310'], comparison: '1.300<1.305<1.310', answer: 'for example, 1.305 L', method: 'Add trailing zeroes to align the limits. The endpoints are excluded, so choose a value strictly between them.',
}, undefined, 'Bottle size (L)')
practice(decimals, 'Sam says 1.205 is bigger than 1.25 because 205 is bigger than 25. Is Sam correct?', 'N11.1 Q5c', select([
  'No. Write 1.25 as 1.250; 1.250 is greater than 1.205 because 5 hundredths is greater than 0 hundredths.',
  'Yes. Compare the whole strings of digits after the decimal point as integers.',
  'No. 1.205 and 1.25 are equal because trailing zeroes do not matter.',
], 0), 'No - 1.25 is greater than 1.205.', 'Compare tenths, hundredths and thousandths in aligned columns.', {
  expression: '1.205\\;?\\;1.25', label: 'Test Sam’s claim', original: ['1.205', '1.25'], comparable: ['1.205', '1.250'], comparison: '1.205<1.250', answer: 'No - 1.25 is greater than 1.205', method: 'Write 1.25 as 1.250. Both have 2 tenths, but 1.250 has 5 hundredths while 1.205 has 0 hundredths.',
})

const largeVideo = worked(largeNumbers, 'Order 8204, 12 750, 8240, 9006 and 12 705 from smallest to largest.', 'N11.2 Q1; video N11.2', {
  expression: '8204,\\;12\\,750,\\;8240,\\;9006,\\;12\\,705', label: 'Order whole numbers', original: ['8204', '12 750', '8240', '9006', '12 705'], comparable: ['4 digits: 8204, 8240, 9006', '5 digits: 12 705, 12 750'], comparison: '8204<8240<9006<12\\,705<12\\,750', answer: '8204, 8240, 9006, 12 705, 12 750', method: 'Count digits first. Fewer digits means a smaller positive whole number. Within each group, compare from the left.',
}, 'For positive whole numbers, digit count gives the first comparison; then compare matching place values from left to right.')
video(largeVideo, {
  id: 'lesson11-ordering-large-numbers', src: '/media/lesson-11/ordering-large-numbers.mp4', poster: '/media/lesson-11/ordering-large-numbers.svg', title: 'Ordering large football attendances', durationSeconds: 53, sourceFile: 'N11.2_Ordering_Large_Numbers.mp4',
  textAlternative: ['Group the three 4-digit numbers before the two 5-digit numbers.', 'Order 8204, 8240 and 9006 by comparing thousands and tens.', 'Order 12 705 before 12 750 by comparing tens.', 'The final ascending order is 8204, 8240, 9006, 12 705, 12 750.'],
})
practice(largeNumbers, 'Mountains A, B and C are 3845 m, 4120 m and 3890 m high. Which is tallest?', 'N11.2 Q2', select(['Mount A', 'Mount B', 'Mount C'], 1), 'Mount B', 'All have four digits, so compare the thousands digits.', {
  expression: '3845,\\;4120,\\;3890', label: 'Compare mountain heights', original: ['Mount A: 3845 m', 'Mount B: 4120 m', 'Mount C: 3890 m'], comparable: ['A: 3 thousands', 'B: 4 thousands', 'C: 3 thousands'], comparison: '3845<3890<4120', answer: 'Mount B', method: 'All values have four digits. Mount B is the only one with 4 thousands, so it is tallest.',
})
practice(largeNumbers, 'Order 4316, 4361, 4136, 4613 and 4163 from largest to smallest.', 'N11.2 Q3', select([
  '4613, 4361, 4316, 4163, 4136',
  '4613, 4316, 4361, 4136, 4163',
  '4136, 4163, 4316, 4361, 4613',
], 0), '4613, 4361, 4316, 4163, 4136', 'Compare hundreds, then use tens to break each tie.', {
  expression: '4316,\\;4361,\\;4136,\\;4613,\\;4163', label: 'Order village populations', original: ['4316', '4361', '4136', '4613', '4163'], comparable: ['4613: 6 hundreds', '4361 and 4316: 3 hundreds', '4163 and 4136: 1 hundred'], comparison: '4613>4361>4316>4163>4136', answer: '4613, 4361, 4316, 4163, 4136', method: 'All start with 4 thousands. Compare hundreds, then tens where the hundreds match.',
})
practice(largeNumbers, 'Order 25 480, 25 084, 2548 and 25 840 from smallest to largest.', 'N11.2 Q4a', select([
  '2548, 25 084, 25 480, 25 840',
  '25 084, 2548, 25 480, 25 840',
  '2548, 25 840, 25 480, 25 084',
], 0), '2548, 25 084, 25 480, 25 840', 'Start by counting digits.', {
  expression: '25\\,480,\\;25\\,084,\\;2548,\\;25\\,840', label: 'Order website visitors', original: ['25 480', '25 084', '2548', '25 840'], comparable: ['2548: 4 digits', '25 084, 25 480, 25 840: 5 digits'], comparison: '2548<25\\,084<25\\,480<25\\,840', answer: '2548, 25 084, 25 480, 25 840', method: '2548 has fewer digits, so it is smallest. The remaining values all begin 25, so compare hundreds.',
})
practice(largeNumbers, 'Explain why 2548 is smaller than 25 084.', 'N11.2 Q4b', select([
  '2548 has 4 digits while 25 084 has 5 digits, so the positive whole number 2548 is smaller.',
  '2548 is smaller because its first digit 2 is smaller than the first digit 2.',
  '2548 is not smaller; spaces do not change a number, so the values are equal.',
], 0), '2548 has fewer digits, so it is smaller.', 'Count the digits in each positive whole number.', {
  expression: '2548\\;?\\;25\\,084', label: 'Compare digit counts', original: ['2548', '25 084'], comparable: ['2548: 4 digits', '25 084: 5 digits'], comparison: '2548<25\\,084', answer: '2548 is smaller because it has fewer digits', method: 'A positive 4-digit whole number is always less than a positive 5-digit whole number.',
})
practice(largeNumbers, 'Order £18 605, £18 065, £19 002, £9990 and £18 650 from largest to smallest.', 'N11.2 Q5a', select([
  '£19 002, £18 650, £18 605, £18 065, £9990',
  '£9990, £19 002, £18 650, £18 605, £18 065',
  '£19 002, £18 605, £18 650, £18 065, £9990',
], 0), '£19 002, £18 650, £18 605, £18 065, £9990', '£9990 is the only 4-digit amount. Compare the 5-digit amounts from the left.', {
  expression: '18\\,605,\\;18\\,065,\\;19\\,002,\\;9990,\\;18\\,650', label: 'Order charity totals', original: ['£18 605', '£18 065', '£19 002', '£9990', '£18 650'], comparable: ['£19 002: 19 thousand', '£18 650, £18 605, £18 065: 18 thousand', '£9990: 4 digits'], comparison: '19\\,002>18\\,650>18\\,605>18\\,065>9990', answer: '£19 002, £18 650, £18 605, £18 065, £9990', method: 'Five-digit amounts exceed £9990. Among them, £19 002 is largest; compare hundreds and tens among the £18-thousand amounts.',
})
practice(largeNumbers, 'Write a whole number strictly between £18 605 and £18 650.', 'N11.2 Q5b', integerInterval(18620, 18605, 18650, 'Any whole number from 18 606 to 18 649, for example £18 620'), 'for example, £18 620', 'The endpoints are excluded, and the answer must be a whole number.', {
  expression: '18\\,605<n<18\\,650', label: 'Choose a whole number in an interval', original: ['Lower limit: £18 605', 'Upper limit: £18 650'], comparable: ['18 605', '18 620', '18 650'], comparison: '18\\,605<18\\,620<18\\,650', answer: 'for example, £18 620', method: 'Choose any integer after 18 605 and before 18 650. The valid source range is 18 606 to 18 649.',
}, undefined, 'Whole number (£)')
practice(largeNumbers, 'Leah says £9990 is the biggest amount because 9 is the biggest first digit. Is Leah correct?', 'N11.2 Q5c', select([
  'No. Count digits first: £9990 has 4 digits, while £18 065 has 5, so £18 065 is bigger.',
  'Yes. The first written digit always decides the order, even when digit counts differ.',
  'No. £9990 is equal to £19 002 after rounding.',
], 0), 'No - the 5-digit amounts are bigger than £9990.', 'For positive whole numbers, compare digit counts before first digits.', {
  expression: '9990\\;?\\;18\\,065', label: 'Test Leah’s claim', original: ['£9990', '£18 065'], comparable: ['9990: 4 digits', '18 065: 5 digits'], comparison: '9990<18\\,065', answer: 'No - £9990 is smaller', method: 'Digit count comes before comparing leading digits. Any positive 5-digit number is greater than any positive 4-digit number.',
})

const negativesVideo = worked(negatives, 'Order −7 °C, 2 °C, −12 °C and 5 °C from coldest to warmest.', 'N11.3 Q1; video N11.3', {
  expression: '-7,\\;2,\\;-12,\\;5', label: 'Order temperatures', original: ['−7 °C', '2 °C', '−12 °C', '5 °C'], comparable: ['Negatives: −12, −7', 'Zero boundary', 'Positives: 2, 5'], comparison: '-12<-7<2<5', answer: '−12 °C, −7 °C, 2 °C, 5 °C', method: 'Negative temperatures are below zero. Among negatives, the value with the greater distance below zero is smaller.',
}, 'Use a number line: values farther left are smaller. For negatives, a greater magnitude means a lower value.')
video(negativesVideo, {
  id: 'lesson11-ordering-negative-numbers', src: '/media/lesson-11/ordering-negative-numbers.mp4', poster: '/media/lesson-11/ordering-negative-numbers.svg', title: 'Ordering positive and negative temperatures', durationSeconds: 57.1, sourceFile: 'N11.3_Ordering_Negative_Numbers.mp4',
  textAlternative: ['Place negative temperatures below the positive temperatures.', 'Between −12 and −7, −12 is farther below zero and is colder.', 'Order positive 2 before positive 5.', 'The order is −12, −7, 2, 5 degrees Celsius.'],
})
practice(negatives, 'Freezers are set to −18 °C, −24 °C and −20 °C. Which is coldest?', 'N11.3 Q2', select(['−18 °C', '−24 °C', '−20 °C'], 1), '−24 °C', 'For negative temperatures, farther below zero means colder.', {
  expression: '-18,\\;-24,\\;-20', label: 'Compare freezer temperatures', original: ['−18 °C', '−24 °C', '−20 °C'], comparable: ['Distances below zero: 18, 24, 20'], comparison: '-24<-20<-18', answer: '−24 °C', method: 'All are negative. The magnitude 24 is greatest, so −24 is farthest below zero and therefore coldest.',
})
practice(negatives, 'Order −3.5 °C, 2.4 °C, −3.05 °C, −4.2 °C and 0 °C from coldest to warmest.', 'N11.3 Q3', select([
  '−4.2 °C, −3.5 °C, −3.05 °C, 0 °C, 2.4 °C',
  '−3.05 °C, −3.5 °C, −4.2 °C, 0 °C, 2.4 °C',
  '2.4 °C, 0 °C, −3.05 °C, −3.5 °C, −4.2 °C',
], 0), '−4.2 °C, −3.5 °C, −3.05 °C, 0 °C, 2.4 °C', 'Order the negatives by their distance below zero, then place 0 and the positive value.', {
  expression: '-3.5,\\;2.4,\\;-3.05,\\;-4.2,\\;0', label: 'Order signed decimals', original: ['−3.5 °C', '2.4 °C', '−3.05 °C', '−4.2 °C', '0 °C'], comparable: ['Negative magnitudes: 4.20, 3.50, 3.05', 'Then 0', 'Then positive 2.4'], comparison: '-4.2<-3.5<-3.05<0<2.4', answer: '−4.2 °C, −3.5 °C, −3.05 °C, 0 °C, 2.4 °C', method: 'Write magnitudes to equal decimal places. Reverse the magnitude order for negatives, then place zero before positive values.',
})
practice(negatives, 'Order −86 m, 120 m, −8.6 m, −68 m and 12 m from lowest to highest.', 'N11.3 Q4a', select([
  '−86 m, −68 m, −8.6 m, 12 m, 120 m',
  '−8.6 m, −68 m, −86 m, 12 m, 120 m',
  '120 m, 12 m, −8.6 m, −68 m, −86 m',
], 0), '−86 m, −68 m, −8.6 m, 12 m, 120 m', 'Place negatives first; among them, the greatest magnitude is lowest.', {
  expression: '-86,\\;120,\\;-8.6,\\;-68,\\;12', label: 'Order heights relative to sea level', original: ['−86 m', '120 m', '−8.6 m', '−68 m', '12 m'], comparable: ['Negative magnitudes: 86, 68, 8.6', 'Positive heights: 12, 120'], comparison: '-86<-68<-8.6<12<120', answer: '−86 m, −68 m, −8.6 m, 12 m, 120 m', method: 'All negative heights are below all positive heights. Reverse the magnitude order among negatives.',
})
practice(negatives, 'A lake is lower than −68 m but higher than −86 m. Write a possible whole-number height.', 'N11.3 Q4b', integerInterval(-75, -86, -68, 'Any whole number from −85 to −69, for example −75 m'), 'for example, −75 m', 'Translate the words to −86 < height < −68.', {
  expression: '-86<h<-68', label: 'Choose a negative integer in an interval', original: ['Higher than −86 m', 'Lower than −68 m'], comparable: ['−86', '−75', '−68'], comparison: '-86<-75<-68', answer: 'for example, −75 m', method: 'A valid height must lie strictly between the two endpoints. For whole numbers, the source range is −85 to −69.',
}, undefined, 'Height (m)')
practice(negatives, 'Order −£60, £25, −£140, −£15 and £0 from largest to smallest.', 'N11.3 Q5a', select([
  '£25, £0, −£15, −£60, −£140',
  '£25, £0, −£140, −£60, −£15',
  '−£140, −£60, −£15, £0, £25',
], 0), '£25, £0, −£15, −£60, −£140', 'Positive balances come first; among debts, owing less is the greater balance.', {
  expression: '-60,\\;25,\\;-140,\\;-15,\\;0', label: 'Order account balances', original: ['−£60', '£25', '−£140', '−£15', '£0'], comparable: ['Positive: £25', 'Zero: £0', 'Debts by magnitude: £15, £60, £140'], comparison: '25>0>-15>-60>-140', answer: '£25, £0, −£15, −£60, −£140', method: 'A positive balance is greatest, then zero. Among negative balances, the smaller debt magnitude gives the greater value.',
})
practice(negatives, 'Which account owes the most: −£60, £25, −£140, −£15 or £0?', 'N11.3 Q5b', select(['−£60', '£25', '−£140', '−£15', '£0'], 2), '−£140', 'Only negative balances owe money; compare their magnitudes.', {
  expression: '-60,\\;25,\\;-140,\\;-15,\\;0', label: 'Compare debts', original: ['Debts: −£60, −£140, −£15', 'Non-debts: £25, £0'], comparable: ['Debt magnitudes: 60, 140, 15'], comparison: '140>60>15', answer: '−£140 owes the most', method: 'The account with the greatest negative magnitude owes the most money. A £140 debt exceeds debts of £60 and £15.',
})
practice(negatives, 'Ravi says −£140 is greater than −£60 because 140 is greater than 60. Is Ravi correct?', 'N11.3 Q5c', select([
  'No. −140 is farther below zero than −60, so −£140 is less than −£60.',
  'Yes. Ignore the minus signs and compare 140 with 60.',
  'No. All negative balances are equal because they all represent debt.',
], 0), 'No - −£140 is less than −£60.', 'On a number line, −140 lies farther left than −60.', {
  expression: '-140\\;?\\;-60', label: 'Test Ravi’s claim', original: ['−£140', '−£60'], comparable: ['Distances below zero: 140 and 60'], comparison: '-140<-60', answer: 'No - −£140 is less than −£60', method: 'A greater magnitude makes a negative value smaller. Owing £140 is a lower balance than owing £60.',
})

const mixedVideo = worked(mixedForms, 'Order 3/5, 0.65, 58% and 1/2 from smallest to largest.', 'N11.4 Q1; video N11.4', {
  expression: '\\frac35,\\;0.65,\\;58\\%,\\;\\frac12', label: 'Order fractions, decimals and percentages', original: ['3/5', '0.65', '58%', '1/2'], comparable: ['3/5 = 0.60', '0.65 = 0.65', '58% = 0.58', '1/2 = 0.50'], comparison: '0.50<0.58<0.60<0.65', answer: '1/2, 58%, 3/5, 0.65', method: 'Convert every value to a decimal: divide fractions and divide percentages by 100.',
}, 'Convert unlike forms to one common form, compare the values, then write the answer using the original forms.')
video(mixedVideo, {
  id: 'lesson11-ordering-mixed-forms', src: '/media/lesson-11/ordering-fractions-decimals-percentages.mp4', poster: '/media/lesson-11/ordering-fractions-decimals-percentages.svg', title: 'Ordering fractions, decimals and percentages', durationSeconds: 58, sourceFile: 'N11.4_Ordering_Fractions_Decimals_Percentages.mp4',
  textAlternative: ['Convert 3/5 to 0.6, 58% to 0.58 and 1/2 to 0.5.', 'Compare 0.5, 0.58, 0.6 and 0.65.', 'Order them from smallest to largest.', 'Return to the original forms: 1/2, 58%, 3/5, 0.65.'],
})
practice(mixedForms, 'Shop A offers 1/4 off, Shop B offers 30% off and Shop C offers 0.2 off. Which discount is biggest?', 'N11.4 Q2', select(['Shop A', 'Shop B', 'Shop C'], 1), 'Shop B', 'Convert each discount to a decimal.', {
  expression: '\\frac14,\\;30\\%,\\;0.2', label: 'Compare discounts', original: ['Shop A: 1/4', 'Shop B: 30%', 'Shop C: 0.2'], comparable: ['1/4 = 0.25', '30% = 0.30', '0.2 = 0.20'], comparison: '0.20<0.25<0.30', answer: 'Shop B', method: 'Divide 1 by 4 and divide 30 by 100. The common decimal forms are 0.25, 0.30 and 0.20.',
})
practice(mixedForms, 'Order 7/10, 0.72, 68% and 3/4 from largest to smallest.', 'N11.4 Q3', select([
  '3/4, 0.72, 7/10, 68%',
  '0.72, 3/4, 7/10, 68%',
  '68%, 7/10, 0.72, 3/4',
], 0), '3/4, 0.72, 7/10, 68%', 'Convert every value to a decimal before ordering.', {
  expression: '\\frac7{10},\\;0.72,\\;68\\%,\\;\\frac34', label: 'Order success rates', original: ['7/10', '0.72', '68%', '3/4'], comparable: ['7/10 = 0.70', '0.72 = 0.72', '68% = 0.68', '3/4 = 0.75'], comparison: '0.75>0.72>0.70>0.68', answer: '3/4, 0.72, 7/10, 68%', method: 'Convert the fractions by division and the percentage by dividing by 100, then compare hundredths.',
})
practice(mixedForms, 'Mia has 0.35, Leo has 36%, Sam has 3/8 and Zara has 2/5 of a pizza. Order them from smallest to largest.', 'N11.4 Q4a', select([
  'Mia 0.35, Leo 36%, Sam 3/8, Zara 2/5',
  'Mia 0.35, Sam 3/8, Leo 36%, Zara 2/5',
  'Zara 2/5, Sam 3/8, Leo 36%, Mia 0.35',
], 0), 'Mia 0.35, Leo 36%, Sam 3/8, Zara 2/5', 'Convert all four amounts to decimals and align three places.', {
  expression: '0.35,\\;36\\%,\\;\\frac38,\\;\\frac25', label: 'Order pizza amounts', original: ['Mia: 0.35', 'Leo: 36%', 'Sam: 3/8', 'Zara: 2/5'], comparable: ['Mia: 0.350', 'Leo: 0.360', 'Sam: 0.375', 'Zara: 0.400'], comparison: '0.350<0.360<0.375<0.400', answer: 'Mia 0.35, Leo 36%, Sam 3/8, Zara 2/5', method: '36% = 0.36, 3/8 = 0.375 and 2/5 = 0.4. Write all values to three decimal places.',
})
practice(mixedForms, 'Nadia has 0.38 of a pizza. How many of Mia (0.35), Leo (36%), Sam (3/8) and Zara (2/5) have more than Nadia?', 'N11.4 Q4b', select(['0 friends', '1 friend (Zara)', '2 friends (Sam and Zara)'], 1), '1 friend (Zara)', 'Compare each decimal equivalent with 0.38.', {
  expression: '0.38\\;?\\;0.35,\\;36\\%,\\;\\frac38,\\;\\frac25', label: 'Compare with a benchmark', original: ['Nadia: 0.38', 'Mia: 0.35', 'Leo: 36%', 'Sam: 3/8', 'Zara: 2/5'], comparable: ['Mia: 0.350', 'Leo: 0.360', 'Sam: 0.375', 'Nadia: 0.380', 'Zara: 0.400'], comparison: '0.350<0.360<0.375<0.380<0.400', answer: '1 friend (Zara)', method: 'Convert the mixed forms to decimals. Only Zara’s 0.400 is greater than Nadia’s 0.380; Sam’s 0.375 is just below it.',
})
practice(mixedForms, 'Order Ola 0.7, Kim 0.705, Lee 71%, Jo 18/25 and Max 29/40 from smallest to largest.', 'N11.4 Q5a', select([
  'Ola 0.7, Kim 0.705, Lee 71%, Jo 18/25, Max 29/40',
  'Kim 0.705, Ola 0.7, Lee 71%, Jo 18/25, Max 29/40',
  'Max 29/40, Jo 18/25, Lee 71%, Kim 0.705, Ola 0.7',
], 0), 'Ola 0.7, Kim 0.705, Lee 71%, Jo 18/25, Max 29/40', 'Convert every mark to a decimal with three places.', {
  expression: '0.7,\\;0.705,\\;71\\%,\\;\\frac{18}{25},\\;\\frac{29}{40}', label: 'Order test marks', original: ['Ola: 0.7', 'Kim: 0.705', 'Lee: 71%', 'Jo: 18/25', 'Max: 29/40'], comparable: ['Ola: 0.700', 'Kim: 0.705', 'Lee: 0.710', 'Jo: 0.720', 'Max: 0.725'], comparison: '0.700<0.705<0.710<0.720<0.725', answer: 'Ola 0.7, Kim 0.705, Lee 71%, Jo 18/25, Max 29/40', method: '71% = 0.71, 18/25 = 0.72 and 29/40 = 0.725. Align all five values to thousandths.',
})
practice(mixedForms, 'Pat scored strictly between Lee’s 71% and Jo’s 18/25. Write a possible mark as a decimal.', 'N11.4 Q5b', openInterval(0.715, 0.71, 0.72, 'Any decimal strictly between 0.71 and 0.72, for example 0.715'), 'for example, 0.715', 'Convert the endpoints to 0.710 and 0.720.', {
  expression: '0.71<x<\\frac{18}{25}', label: 'Choose a mark in an interval', original: ['Lee: 71%', 'Jo: 18/25'], comparable: ['71% = 0.710', 'Example: 0.715', '18/25 = 0.720'], comparison: '0.710<0.715<0.720', answer: 'for example, 0.715', method: 'Convert 71% to 0.71 and 18/25 to 0.72. Choose any decimal strictly between them.',
}, undefined, 'Pat’s mark')
practice(mixedForms, 'Ali says 18/25 is less than 71% because 18 is less than 71. Is Ali correct?', 'N11.4 Q5c', select([
  'No. 18/25 = 72%, and 72% is greater than 71%.',
  'Yes. Compare the numerator 18 directly with the percentage number 71.',
  'No. 18/25 equals 18%, which is still less than 71%.',
], 0), 'No - 18/25 = 72%, which is greater than 71%.', 'Compare values in the same form.', {
  expression: '\\frac{18}{25}\\;?\\;71\\%', label: 'Test Ali’s claim', original: ['18/25', '71%'], comparable: ['18/25 = 72/100 = 72%', '71% = 71%'], comparison: '72\\%>71\\%', answer: 'No - 18/25 is greater than 71%', method: 'Scale 18/25 to a denominator of 100: multiply numerator and denominator by 4 to get 72/100 = 72%.',
})

add('mixed', 'Make values comparable before deciding their order', 'N11.1-N11.4 consolidation', text(
  'Decimals: align place-value columns with trailing zeroes.',
  'Large positive whole numbers: compare digit counts, then compare from the left.',
  'Negative numbers: values farther below zero are smaller.',
  'Fractions, decimals and percentages: convert to one common form, compare, then restore the original forms.',
), undefined, undefined, undefined, 'Translate words such as fastest, coldest, lowest and owes most into the correct numerical direction before ordering.')

export const tutorOrderingLesson: TutorMethodLesson = {
  id: 'L011', number: 11, title: 'Ordering numbers', level: 'GCSE Foundation',
  goal: 'Order decimals, large whole numbers, negative values and mixed fraction-decimal-percentage representations accurately.',
  labels: {
    [decimals]: 'Ordering decimals', [largeNumbers]: 'Ordering large numbers',
    [negatives]: 'Ordering negative numbers', [mixedForms]: 'Fractions, decimals and percentages', mixed: 'Review',
  },
  states: finish(),
}
