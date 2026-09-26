import { chooser, working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import { numberSenseWorking } from '../../written-methods/tutor/numberSenseWorking'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'

const choose = chooser()

const { add, finish } = author(10)
const decimalPlaces = 'rounding-decimal-places'
const significantFigures = 'rounding-significant-figures'
const powersOfTen = 'rounding-powers-of-ten'
const carrying = 'rounding-carrying'
const text = (...lines: string[]) => ({ kind: 'text' as const, lines })

const number = (answer: number, displayAnswer = answer.toLocaleString('en-GB', { maximumFractionDigits: 10 })): InteractionDefinition => ({
  type: 'numericInput', correctAnswer: answer, displayAnswer, acceptanceRule: 'normalisedNumber',
})
const fixed = (answer: string, places: number): InteractionDefinition => ({
  type: 'numericInput', correctAnswer: answer, displayAnswer: answer, acceptanceRule: 'exactDecimalPlaces', requiredDecimalPlaces: places,
})
const explain = (answer: string, ...steps: Array<[string, string]>) => working(answer, ...steps)

type RoundModel = {
  original: string
  expression?: string
  target: string
  split: string
  keptDigit: string
  cutDigit: number
  answer: string
  suffix?: string
  carry?: string
  finalNote?: string
}

function roundingModel(model: RoundModel): TutorWorking {
  const roundsUp = model.cutDigit >= 5
  const answerWithUnit = `${model.answer}${model.suffix ? ` ${model.suffix}` : ''}`
  const [kept = '', discarded = ''] = model.split.split('|').map(part => part.trim())
  const decisionDigit = discarded.charAt(0)
  const roundingFrame = (stage: 'identify' | 'decide' | 'result') => ({
    original: model.original,
    target: model.target,
    kept,
    decisionDigit,
    remaining: discarded.slice(1),
    stage,
    roundsUp,
    answer: stage === 'result' ? answerWithUnit : undefined,
  })
  return numberSenseWorking(model.expression ?? model.original.replaceAll(' ', '\\,'), `Round to ${model.target}`, [
    {
      title: 'Find the last digit to keep',
      equation: model.split.replace('|', '\\mid').replaceAll(' ', '\\,'),
      instruction: `For ${model.target}, the ${model.keptDigit} is the last digit kept. The digit immediately after it is the decision digit.`,
      rounding: roundingFrame('identify'),
    },
    {
      title: 'Use the decision digit',
      equation: roundsUp ? `${model.cutDigit}\\geq5` : `${model.cutDigit}<5`,
      instruction: `${model.cutDigit} is ${roundsUp ? '5 or more, so round the kept digit up' : 'below 5, so leave the kept digit unchanged'}.${model.carry ? ` ${model.carry}` : ''}`,
      rounding: roundingFrame('decide'),
    },
    {
      title: 'Write the rounded value',
      equation: `${model.original.replaceAll(' ', '\\,')}\\to${model.answer.replaceAll(' ', '\\,')}`,
      instruction: model.finalNote ?? 'Remove decimal digits to the right of the rounding point, or replace later whole-number digits with zeroes.',
      rounding: roundingFrame('result'),
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
  model: RoundModel,
  feedbackSteps?: Array<[string, string]>,
) {
  const steps = feedbackSteps ?? [
    ['Find the last digit to keep.', `For ${model.target}, split the number as ${model.split}.`],
    ['Check the next digit.', `${model.cutDigit} is ${model.cutDigit >= 5 ? '5 or more, so round up' : 'below 5, so the kept digit stays the same'}.${model.carry ? ` ${model.carry}` : ''}`],
    ['Write the rounded value.', `${model.original} rounds to ${answer}.`],
  ]
  const state = add(topic, title, sourceRef, text(title), interaction, explain(answer, ...steps), hint)
  state.working = roundingModel(model)
  return state
}

function worked(topic: MicroSkillId, title: string, sourceRef: string, model: RoundModel, body: string) {
  return add(topic, title, sourceRef, roundingModel(model), undefined, undefined, undefined, body)
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }

const decimalVideo = worked(decimalPlaces, 'Write 7.4362 correct to 2 decimal places.', 'N10.1 Q1; video N10.1', {
  original: '7.4362', target: '2 decimal places', split: '7.43 | 62', keptDigit: '3 in the hundredths column', cutDigit: 6, answer: '7.44', suffix: 'm',
}, 'Count the required decimal places, inspect the next digit, then round once from the original value.')
video(decimalVideo, {
  id: 'lesson10-rounding-decimal-places', src: '/media/lesson-10/rounding-decimal-places.mp4', poster: '/media/lesson-10/rounding-decimal-places.svg', title: 'Rounding 7.4362 to 2 decimal places', durationSeconds: 54.5, sourceFile: 'N10.1_Rounding_Decimal_Places.mp4',
  textAlternative: ['Count two decimal places in 7.4362 and place the cut-off after the 3.', 'The next digit is 6.', 'Because 6 is at least 5, round the 3 up to 4.', '7.4362 rounds to 7.44 m.'],
})
practice(decimalPlaces, 'Ravi’s height is 1.6327 m. Write it correct to 1 decimal place.', 'N10.1 Q2', number(1.6, '1.6 m'), '1.6 m', 'Keep the tenths digit, then inspect the hundredths digit.', { original: '1.6327', target: '1 decimal place', split: '1.6 | 327', keptDigit: '6 in the tenths column', cutDigit: 3, answer: '1.6', suffix: 'm' })
practice(decimalPlaces, 'A cyclist rides 24.3650 km. Write the distance correct to 2 decimal places.', 'N10.1 Q3', number(24.37, '24.37 km'), '24.37 km', 'The third decimal digit is exactly 5, and 5 rounds up.', { original: '24.3650', target: '2 decimal places', split: '24.36 | 50', keptDigit: '6 in the hundredths column', cutDigit: 5, answer: '24.37', suffix: 'km' })
practice(decimalPlaces, 'A parcel has a mass of 3.2748 kg. Write it correct to 2 decimal places.', 'N10.1 Q4a', number(3.27, '3.27 kg'), '3.27 kg', 'Keep two digits after the decimal point and inspect the third.', { original: '3.2748', target: '2 decimal places', split: '3.27 | 48', keptDigit: '7 in the hundredths column', cutDigit: 4, answer: '3.27', suffix: 'kg' })
practice(decimalPlaces, 'Write 3.2748 correct to 1 decimal place.', 'N10.1 Q4b', number(3.3, '3.3 kg'), '3.3 kg', 'Return to the original number and inspect the hundredths digit.', { original: '3.2748', target: '1 decimal place', split: '3.2 | 748', keptDigit: '2 in the tenths column', cutDigit: 7, answer: '3.3', suffix: 'kg' })
practice(decimalPlaces, 'A stopwatch shows 12.2451 seconds. Write the time correct to 2 decimal places.', 'N10.1 Q5a', number(12.25, '12.25 s'), '12.25 s', 'The third decimal digit is 5, so round the hundredths digit up.', { original: '12.2451', target: '2 decimal places', split: '12.24 | 51', keptDigit: '4 in the hundredths column', cutDigit: 5, answer: '12.25', suffix: 's' })
practice(decimalPlaces, 'Write 12.2451 correct to 3 decimal places.', 'N10.1 Q5b', number(12.245, '12.245 s'), '12.245 s', 'Keep three decimal digits, then inspect the fourth.', { original: '12.2451', target: '3 decimal places', split: '12.245 | 1', keptDigit: '5 in the thousandths column', cutDigit: 1, answer: '12.245', suffix: 's' })
practice(decimalPlaces, 'Zane rounds 12.25 to 1 decimal place and gets 12.3 s. Is this the correct rounding of the original 12.2451 s?', 'N10.1 Q5c', choose([
  'No. Round the original number: 12.2 | 451 has cut-off digit 4, so the answer is 12.2 s.',
  'Yes. Rounding 12.25 again is always equivalent to rounding the original number.',
  'No. The original number rounds to 12.4 s because it contains a 5.',
]), 'No - the original value rounds to 12.2 s.', 'Always round from the original measurement, not from an already rounded answer.', { original: '12.2451', target: '1 decimal place', split: '12.2 | 451', keptDigit: '2 in the tenths column', cutDigit: 4, answer: '12.2', suffix: 's' }, [
  ['Return to the original value.', 'Use 12.2451, not the intermediate rounded value 12.25.'],
  ['Find the cut-off digit.', 'For 1 decimal place, write 12.2 | 451. The cut-off digit is 4.'],
  ['Conclude.', '4 is below 5, so 12.2451 rounds to 12.2 s. Zane is not correct.'],
])

const significantVideo = worked(significantFigures, 'Write 0.02768 correct to 2 significant figures.', 'N10.2 Q1; video N10.2', {
  original: '0.02768', target: '2 significant figures', split: '0.027 | 68', keptDigit: '7, the second non-zero significant digit', cutDigit: 6, answer: '0.028', suffix: 'g',
}, 'Leading zeroes only locate the decimal point. Start counting significant figures at the first non-zero digit.')
video(significantVideo, {
  id: 'lesson10-rounding-significant-figures', src: '/media/lesson-10/rounding-significant-figures.mp4', poster: '/media/lesson-10/rounding-significant-figures.svg', title: 'Rounding 0.02768 to 2 significant figures', durationSeconds: 54.5, sourceFile: 'N10.2_Rounding_Significant_Figures.mp4',
  textAlternative: ['Ignore leading zeroes and count 2 then 7 as the first two significant figures.', 'The cut-off digit is 6.', 'Because 6 is at least 5, round 7 up to 8.', '0.02768 rounds to 0.028 g.'],
})
practice(significantFigures, 'A jug holds 2.638 litres. Write it correct to 2 significant figures.', 'N10.2 Q2', number(2.6, '2.6 litres'), '2.6 litres', 'Count significant figures from the first non-zero digit.', { original: '2.638', target: '2 significant figures', split: '2.6 | 38', keptDigit: '6, the second significant digit', cutDigit: 3, answer: '2.6', suffix: 'litres' })
practice(significantFigures, 'A stadium holds 48 562 people. Write this correct to 2 significant figures.', 'N10.2 Q3', number(49000, '49 000 people'), '49 000 people', 'Keep 4 and 8, then inspect the next digit.', { original: '48 562', expression: '48\\,562', target: '2 significant figures', split: '48 | 562', keptDigit: '8, the second significant digit', cutDigit: 5, answer: '49 000', suffix: 'people', finalNote: 'Replace every whole-number digit after the cut-off with zero.' })
practice(significantFigures, 'A spider’s thread is 0.0004062 cm wide. Write it correct to 2 significant figures.', 'N10.2 Q4a', number(0.00041, '0.00041 cm'), '0.00041 cm', 'The first significant figure is 4; the zero after it is the second.', { original: '0.0004062', target: '2 significant figures', split: '0.00040 | 62', keptDigit: '0 after the 4, the second significant digit', cutDigit: 6, answer: '0.00041', suffix: 'cm' })
practice(significantFigures, 'Write 0.0004062 correct to 1 significant figure.', 'N10.2 Q4b', number(0.0004, '0.0004 cm'), '0.0004 cm', 'Leading zeroes do not count; keep the 4 and inspect the next digit.', { original: '0.0004062', target: '1 significant figure', split: '0.0004 | 062', keptDigit: '4, the first significant digit', cutDigit: 0, answer: '0.0004', suffix: 'cm' })
practice(significantFigures, 'A town has a population of 25 749. Write it correct to 3 significant figures.', 'N10.2 Q5a', number(25700, '25 700'), '25 700', 'Keep 2, 5 and 7, then inspect the 4.', { original: '25 749', expression: '25\\,749', target: '3 significant figures', split: '257 | 49', keptDigit: '7, the third significant digit', cutDigit: 4, answer: '25 700', finalNote: 'Replace the remaining whole-number digits with zeroes.' })
practice(significantFigures, 'Write 25 749 correct to 1 significant figure.', 'N10.2 Q5b', number(30000, '30 000'), '30 000', 'Keep the first non-zero digit and inspect the next digit.', { original: '25 749', expression: '25\\,749', target: '1 significant figure', split: '2 | 5749', keptDigit: '2, the first significant digit', cutDigit: 5, answer: '30 000', finalNote: 'Round 2 up to 3 and replace the remaining digits with zeroes.' })
practice(significantFigures, 'Dev says 25 749 correct to 2 significant figures is 25 000. Is Dev correct?', 'N10.2 Q5c', choose([
  'No. In 25 | 749 the cut-off digit is 7, so the 5 rounds up and the answer is 26 000.',
  'Yes. Keeping the first two digits always means every following digit can be ignored.',
  'No. The answer is 25 700 because three significant figures are needed.',
]), 'No - the answer is 26 000.', 'After keeping two digits, you must use the third digit to decide whether to round.', { original: '25 749', expression: '25\\,749', target: '2 significant figures', split: '25 | 749', keptDigit: '5, the second significant digit', cutDigit: 7, answer: '26 000', finalNote: 'Round the 5 up to 6, then replace later digits with zeroes.' })

const powersVideo = worked(powersOfTen, 'Write 348 correct to the nearest 10.', 'N10.3 Q1; video N10.3', {
  original: '348', target: 'nearest 10', split: '34 | 8', keptDigit: '4 in the tens column', cutDigit: 8, answer: '350', suffix: 'pupils', finalNote: 'Round the tens digit up and replace the units digit with zero.'
}, 'For the nearest 10, 100 or 1000, keep that place-value digit and use the digit immediately to its right.')
video(powersVideo, {
  id: 'lesson10-rounding-powers-of-ten', src: '/media/lesson-10/rounding-nearest-powers-of-ten.mp4', poster: '/media/lesson-10/rounding-nearest-powers-of-ten.svg', title: 'Rounding 348 to the nearest 10', durationSeconds: 54.5, sourceFile: 'N10.3_Rounding_Nearest_10_100_1000.mp4',
  textAlternative: ['For the nearest 10, keep the tens digit 4.', 'The units digit 8 is the cut-off digit.', 'Because 8 is at least 5, round 4 up to 5.', 'Replace the units digit with zero to get 350 pupils.'],
})
practice(powersOfTen, '6342 people watch a football match. Write this correct to the nearest 100.', 'N10.3 Q2', number(6300, '6300 people'), '6300 people', 'Keep the hundreds digit and inspect the tens digit.', { original: '6342', target: 'nearest 100', split: '63 | 42', keptDigit: '3 in the hundreds column', cutDigit: 4, answer: '6300', suffix: 'people', finalNote: 'Keep the 3 and replace the tens and units digits with zeroes.' })
practice(powersOfTen, 'A house is valued at £64 500. Write this correct to the nearest £1000.', 'N10.3 Q3', number(65000, '£65 000'), '£65 000', 'Keep the thousands digit; a cut-off digit of exactly 5 rounds up.', { original: '64 500', expression: '64\\,500', target: 'nearest 1000', split: '64 | 500', keptDigit: '4 in the thousands column', cutDigit: 5, answer: '65 000', suffix: 'pounds', finalNote: 'Round the thousands digit up and replace the final three digits with zeroes.' })
practice(powersOfTen, 'A stadium has 47 380 seats. Write this correct to the nearest 1000.', 'N10.3 Q4a', number(47000, '47 000 seats'), '47 000 seats', 'Keep the thousands digit and inspect the hundreds digit.', { original: '47 380', expression: '47\\,380', target: 'nearest 1000', split: '47 | 380', keptDigit: '7 in the thousands column', cutDigit: 3, answer: '47 000', suffix: 'seats', finalNote: 'Keep the thousands digit and replace the final three digits with zeroes.' })
practice(powersOfTen, 'Write 47 380 correct to the nearest 10 000.', 'N10.3 Q4b', number(50000, '50 000 seats'), '50 000 seats', 'Now keep the ten-thousands digit and inspect the thousands digit.', { original: '47 380', expression: '47\\,380', target: 'nearest 10 000', split: '4 | 7380', keptDigit: '4 in the ten-thousands column', cutDigit: 7, answer: '50 000', suffix: 'seats', finalNote: 'Round the ten-thousands digit up and replace all later digits with zeroes.' })
practice(powersOfTen, 'A shop takes £6472 in one day. Write this correct to the nearest £100.', 'N10.3 Q5a', number(6500, '£6500'), '£6500', 'Keep the hundreds digit and inspect the tens digit.', { original: '6472', target: 'nearest 100', split: '64 | 72', keptDigit: '4 in the hundreds column', cutDigit: 7, answer: '6500', suffix: 'pounds', finalNote: 'Round the hundreds digit up and replace tens and units with zeroes.' })
practice(powersOfTen, 'Write £6472 correct to the nearest £1000.', 'N10.3 Q5b', number(6000, '£6000'), '£6000', 'Keep the thousands digit and inspect the hundreds digit.', { original: '6472', target: 'nearest 1000', split: '6 | 472', keptDigit: '6 in the thousands column', cutDigit: 4, answer: '6000', suffix: 'pounds', finalNote: 'Keep the thousands digit and replace the final three digits with zeroes.' })
practice(powersOfTen, 'Sam says a number that rounds to 6500 to the nearest 100 must be bigger than 6500. Is Sam correct?', 'N10.3 Q5c', choose([
  'No. 6472 is smaller than 6500, but its tens digit is 7 so it rounds up to 6500.',
  'Yes. A rounded value is always smaller than the original number.',
  'No. Every number below 6500 rounds to 6400.',
]), 'No - 6472 is a counterexample.', 'Use the value from part (a) as a counterexample.', { original: '6472', target: 'nearest 100', split: '64 | 72', keptDigit: '4 in the hundreds column', cutDigit: 7, answer: '6500', finalNote: '6472 rounds up to 6500 even though 6472 is smaller than 6500.' }, [
  ['Use the earlier value.', '6472 has 4 hundreds and a cut-off digit of 7.'],
  ['Round it.', 'The 7 makes the 4 round up, so 6472 rounds to 6500.'],
  ['Compare.', '6472 < 6500, so Sam’s claim is false.'],
])

const carryingVideo = worked(carrying, 'Write 3.4962 correct to 2 decimal places.', 'N10.4 Q1; video N10.4', {
  original: '3.4962', target: '2 decimal places', split: '3.49 | 62', keptDigit: '9 in the hundredths column', cutDigit: 6, answer: '3.50', suffix: 'm', carry: '9 + 1 = 10: write 0 and carry 1 to the 4, making 5.', finalNote: 'Keep the final zero because the answer must show 2 decimal places.'
}, 'When a kept 9 rounds up, write 0 in that place and carry 1 left. Preserve any zero needed to show the requested accuracy.')
video(carryingVideo, {
  id: 'lesson10-rounding-carrying', src: '/media/lesson-10/rounding-carrying.mp4', poster: '/media/lesson-10/rounding-carrying.svg', title: 'Rounding 3.4962 with a carry', durationSeconds: 59.1, sourceFile: 'N10.4_Carrying_the_1.mp4',
  textAlternative: ['Keep two decimal places in 3.4962, giving 3.49 before the cut-off.', 'The cut-off digit is 6, so the final 9 rounds up.', 'Write 0 and carry 1 to the 4, making 5.', 'Keep the trailing zero: the answer is 3.50 m.'],
})
practice(carrying, 'A rope is 6.97 m long. Write it correct to 1 decimal place.', 'N10.4 Q2', fixed('7.0', 1), '7.0 m', 'Rounding the 9 requires a carry into the units column; keep one decimal place.', { original: '6.97', target: '1 decimal place', split: '6.9 | 7', keptDigit: '9 in the tenths column', cutDigit: 7, answer: '7.0', suffix: 'm', carry: '9 + 1 = 10: write 0 in the tenths and carry 1 to the 6.', finalNote: 'Keep the zero to show that the value is correct to 1 decimal place.' })
practice(carrying, 'A crowd of 3972 attends a concert. Write this correct to the nearest 100.', 'N10.4 Q3', number(4000, '4000 people'), '4000 people', 'The hundreds digit is 9; rounding it up carries into the thousands.', { original: '3972', target: 'nearest 100', split: '39 | 72', keptDigit: '9 in the hundreds column', cutDigit: 7, answer: '4000', suffix: 'people', carry: '9 + 1 = 10: write 0 and carry 1 to the 3, making 4.', finalNote: 'Replace the final two digits with zeroes after carrying.' })
practice(carrying, 'A capsule contains 0.09962 g. Write it correct to 2 significant figures.', 'N10.4 Q4a', fixed('0.10', 2), '0.10 g', 'The two significant 9s both carry; the final zero records 2 significant figures.', { original: '0.09962', target: '2 significant figures', split: '0.099 | 62', keptDigit: 'the second 9', cutDigit: 6, answer: '0.10', suffix: 'g', carry: 'The second 9 becomes 10, then the first 9 also becomes 10, carrying into the tenths place.', finalNote: 'Write 0.10 rather than 0.1 so the answer shows 2 significant figures.' })
practice(carrying, 'Write 0.09962 correct to 1 significant figure.', 'N10.4 Q4b', number(0.1, '0.1 g'), '0.1 g', 'Keep the first 9 and use the next 9 as the cut-off digit.', { original: '0.09962', target: '1 significant figure', split: '0.09 | 962', keptDigit: 'the first 9', cutDigit: 9, answer: '0.1', suffix: 'g', carry: 'The 9 rounds to 10, so write 0 and carry 1 into the tenths place.', finalNote: 'For 1 significant figure, 0.10 is written as 0.1.' })
practice(carrying, 'A stadium holds 89 650 people. Write this correct to the nearest 1000.', 'N10.4 Q5a', number(90000, '90 000 people'), '90 000 people', 'The thousands digit is 9 and the hundreds digit makes it round up.', { original: '89 650', expression: '89\\,650', target: 'nearest 1000', split: '89 | 650', keptDigit: '9 in the thousands column', cutDigit: 6, answer: '90 000', suffix: 'people', carry: '9 + 1 = 10: write 0 and carry 1 to the 8, making 9.', finalNote: 'Replace the final three digits with zeroes.' })
practice(carrying, 'Write 89 650 correct to the nearest 100.', 'N10.4 Q5b', number(89700, '89 700 people'), '89 700 people', 'Keep the hundreds digit; this time the 6 rounds to 7 without a carry.', { original: '89 650', expression: '89\\,650', target: 'nearest 100', split: '896 | 50', keptDigit: '6 in the hundreds column', cutDigit: 5, answer: '89 700', suffix: 'people', finalNote: 'Round 6 up to 7, then replace tens and units with zeroes.' })
practice(carrying, 'Ali says 5.996 correct to 2 decimal places is 5.90. Is Ali correct?', 'N10.4 Q5c', choose([
  'No. The carry passes through both 9s and into the units, so the answer is 6.00.',
  'Yes. The final 9 becomes 0 and no other digit changes.',
  'No. The answer is 6 because trailing zeroes must always be removed.',
]), 'No - the answer is 6.00.', 'Carry through every consecutive 9, then retain two decimal places.', { original: '5.996', target: '2 decimal places', split: '5.99 | 6', keptDigit: 'the second 9', cutDigit: 6, answer: '6.00', carry: 'The final 9 becomes 10 and carries to the first 9, which also becomes 10 and carries to the 5.', finalNote: 'Keep both zeroes because the answer must show 2 decimal places.' })

add('mixed', 'Choose the rounding place before you use the cut-off digit', 'N10.1-N10.4 consolidation', text(
  'Decimal places: count from the decimal point.',
  'Significant figures: start at the first non-zero digit.',
  'Nearest 10, 100 or 1000: keep the named place-value digit.',
  'A cut-off digit of 5 or more rounds up; below 5 stays the same.',
  'When a 9 rounds up, write 0 and carry 1 to the left.',
), undefined, undefined, undefined, 'Always round once from the original value. Keep trailing zeroes when they communicate the requested accuracy, such as 3.50 to 2 decimal places.')

export const tutorRoundingLesson: TutorMethodLesson = {
  id: 'L010', number: 10, title: 'Rounding numbers', level: 'GCSE Foundation',
  goal: 'Round decimals and whole numbers to a stated accuracy, including cases where rounding carries across a 9.',
  labels: {
    [decimalPlaces]: 'Decimal places', [significantFigures]: 'Significant figures',
    [powersOfTen]: 'Nearest 10, 100 and 1000', [carrying]: 'Carrying the 1', mixed: 'Review',
  },
  states: finish(),
}
