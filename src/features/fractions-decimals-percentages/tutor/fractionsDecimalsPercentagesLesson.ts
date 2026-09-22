import { numeric, select, working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import {
  decimalToFractionWorking,
  decimalToPercentageWorking,
  fractionToDecimalWorking,
  fractionToPercentageWorking,
  percentageToDecimalWorking,
  percentageToFractionWorking,
} from './conversionWorking'

const { add, finish } = author(9)
const fractionToDecimal = 'fraction-to-decimal'
const decimalToFraction = 'decimal-to-fraction'
const decimalToPercentage = 'decimal-to-percentage'
const percentageToDecimal = 'percentage-to-decimal'
const fractionToPercentage = 'fraction-to-percentage'
const percentageToFraction = 'percentage-to-fraction'
const text = (...lines: string[]) => ({ kind: 'text' as const, lines })

const fractionAnswer = (answer: string): InteractionDefinition => ({
  type: 'fractionInput', correctAnswer: answer, displayAnswer: answer, acceptanceRule: 'rational', responseShape: 'fraction', requireSimplest: true,
})
const fractionRange = (example: string, requiredDenominator: number, lowerBound?: number, upperBound?: number): InteractionDefinition => ({
  type: 'fractionInput', correctAnswer: example, displayAnswer: `For example, ${example}`, acceptanceRule: 'rationalInterval', responseShape: 'fraction', requiredDenominator, lowerBound, upperBound,
})
const numberChoices = (...answers: number[]): InteractionDefinition => ({
  type: 'numericInput', correctAnswer: answers, displayAnswer: answers.join(' or '), acceptanceRule: 'oneOf',
})
const openNumber = (lowerBound: number): InteractionDefinition => ({
  type: 'numericInput', correctAnswer: `any value greater than ${lowerBound}`, displayAnswer: `Any value greater than ${lowerBound}`, acceptanceRule: 'greaterThan', lowerBound,
})
const explain = (answer: string, method: string) => working(answer, ['Choose the conversion.', method], ['Check equivalence.', `The answer is ${answer}.`])

function practice(
  topic: MicroSkillId,
  title: string,
  sourceRef: string,
  interaction: InteractionDefinition,
  answer: string,
  hint: string,
  walkthrough: TutorWorking,
  lines: string[] = [title],
  answerLabel?: string,
) {
  const state = add(topic, title, sourceRef, text(...lines), interaction, explain(answer, hint), hint)
  state.working = walkthrough
  if (answerLabel) state.answerLabel = answerLabel
  return state
}
function worked(topic: MicroSkillId, title: string, sourceRef: string, visual: TutorWorking, body: string) {
  return add(topic, title, sourceRef, visual, undefined, undefined, undefined, body)
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }

const ftdVideo = worked(fractionToDecimal, 'Write 5/8 as a decimal.', 'N9.1 Q1; video N9.1', fractionToDecimalWorking(5, 8, '0.625'), 'A fraction bar means division: divide the numerator by the denominator.')
video(ftdVideo, {
  id: 'lesson9-fraction-to-decimal', src: '/media/lesson-9/fraction-to-decimal.mp4', poster: '/media/lesson-9/fraction-to-decimal.jpg', title: 'Fraction to decimal: 5/8', durationSeconds: 46.2, sourceFile: 'N9.1_Fraction_to_Decimal.mp4',
  textAlternative: ['Start with 5/8.', 'Treat the fraction bar as division: 5 divided by 8.', 'Complete the division to get 0.625.', 'Therefore 5/8 equals 0.625.'],
})
practice(fractionToDecimal, 'Write 3/4 as a decimal.', 'N9.1 Q2', numeric(0.75), '0.75', 'Divide 3 by 4.', fractionToDecimalWorking(3, 4, '0.75'))
practice(fractionToDecimal, 'Write 17/40 as a decimal.', 'N9.1 Q3', numeric(0.425), '0.425', 'The fraction bar tells you to calculate 17 ÷ 40.', fractionToDecimalWorking(17, 40, '0.425'))
practice(fractionToDecimal, 'Write 9/16 as a decimal.', 'N9.1 Q4a', numeric(0.5625), '0.5625', 'Set up 9 ÷ 16.', fractionToDecimalWorking(9, 16, '0.5625'))
practice(fractionToDecimal, 'Write 9/16 as a decimal correct to 2 decimal places.', 'N9.1 Q4b', numeric(0.56), '0.56', 'First find 9 ÷ 16, then look at the third decimal digit.', fractionToDecimalWorking(9, 16, '0.5625', '0.56'))
practice(fractionToDecimal, '1/n = 0.125. Find the value of n.', 'N9.1 Q5a', numeric(8), 'n = 8', 'Find the denominator that makes 1 ÷ n equal 0.125.', fractionToDecimalWorking(1, 8, '0.125'), ['1/n = 0.125', 'Find n'])
practice(fractionToDecimal, 'Write a fraction with denominator 8 that converts to a decimal bigger than 0.625.', 'N9.1 Q5b', fractionRange('6/8', 8, 0.625, 1), '6/8 or 7/8', 'Because 5/8 = 0.625, choose a numerator bigger than 5.', fractionToDecimalWorking(6, 8, '0.75'), undefined, 'Your fraction')
practice(fractionToDecimal, 'Ben says: “A fraction with a bigger denominator always converts to a smaller decimal.” Is Ben correct?', 'N9.1 Q5c', select([
  'No. For example, 9/10 = 0.9 is greater than 1/2 = 0.5, even though 10 is the bigger denominator.',
  'Yes. The denominator alone always decides the size of a fraction.',
  'No. A fraction with a bigger denominator is always a bigger decimal.',
], 0), 'No - 9/10 is a counterexample.', 'Compare complete fractions, not denominators by themselves.', fractionToDecimalWorking(9, 10, '0.9'), ['Compare 1/2 = 0.5 with 9/10'])

const dtfVideo = worked(decimalToFraction, 'Write 0.84 as a fraction in its simplest form.', 'N9.2 Q1; video N9.2', decimalToFractionWorking('0.84', 21, 25), 'Write the decimal over the matching power of ten, then simplify.')
video(dtfVideo, {
  id: 'lesson9-decimal-to-fraction', src: '/media/lesson-9/decimal-to-fraction.mp4', poster: '/media/lesson-9/decimal-to-fraction.jpg', title: 'Decimal to fraction: 0.84', durationSeconds: 35.6, sourceFile: 'N9.2_Decimal_to_Fraction.mp4',
  textAlternative: ['0.84 has two decimal places, so write it as 84/100.', 'The highest common factor of 84 and 100 is 4.', 'Divide the numerator and denominator by 4.', '0.84 equals 21/25 in simplest form.'],
})
practice(decimalToFraction, 'Write 0.6 as a fraction in its simplest form.', 'N9.2 Q2', fractionAnswer('3/5'), '3/5', 'Write 0.6 as 6/10, then simplify.', decimalToFractionWorking('0.6', 3, 5))
practice(decimalToFraction, 'Write 0.35 as a fraction in its simplest form.', 'N9.2 Q3', fractionAnswer('7/20'), '7/20', 'Write 0.35 as 35/100 and divide both parts by 5.', decimalToFractionWorking('0.35', 7, 20))
practice(decimalToFraction, 'Write 0.375 as a fraction in its simplest form.', 'N9.2 Q4a', fractionAnswer('3/8'), '3/8', 'Three decimal places means start with 375/1000.', decimalToFractionWorking('0.375', 3, 8))
practice(decimalToFraction, 'Convert 3/8 back to a decimal to check the answer to part (a).', 'N9.2 Q4b', numeric(0.375), '0.375', 'Divide 3 by 8.', fractionToDecimalWorking(3, 8, '0.375'))
practice(decimalToFraction, 'n/20 = 0.45. Find the value of n.', 'N9.2 Q5a', numeric(9), 'n = 9', 'Multiply 0.45 by 20.', fractionToDecimalWorking(9, 20, '0.45'), ['n/20 = 0.45', 'Find n'])
practice(decimalToFraction, 'Write a fraction with denominator 20 that converts to a decimal smaller than 0.45.', 'N9.2 Q5b', fractionRange('8/20', 20, 0, 0.45), 'for example, 8/20', 'Because 9/20 = 0.45, choose a positive numerator smaller than 9.', fractionToDecimalWorking(8, 20, '0.4'), undefined, 'Your fraction')
practice(decimalToFraction, 'Priya says: “Every decimal with 2 decimal places simplifies to a fraction with denominator 100.” Is Priya correct?', 'N9.2 Q5c', select([
  'No. For example, 0.75 = 75/100 = 3/4, so the simplified denominator is 4.',
  'Yes. A fraction made from two decimal places can never be simplified.',
  'No. Every two-place decimal simplifies to a fraction with denominator 10.',
], 0), 'No - 0.75 simplifies to 3/4.', 'Test the claim by simplifying 75/100.', decimalToFractionWorking('0.75', 3, 4), ['Test the claim with 0.75'])

const dtpVideo = worked(decimalToPercentage, 'Write 0.68 as a percentage.', 'N9.3 Q1; video N9.3', decimalToPercentageWorking('0.68', '68'), 'Multiply the decimal by 100 and attach the percent sign.')
video(dtpVideo, {
  id: 'lesson9-decimal-to-percentage', src: '/media/lesson-9/decimal-to-percentage.mp4', poster: '/media/lesson-9/decimal-to-percentage.jpg', title: 'Decimal to percentage: 0.68', durationSeconds: 29, sourceFile: 'N9.3_Decimal_to_Percentage.mp4',
  textAlternative: ['Start with 0.68.', 'Multiply by 100.', 'The digits move two place-value columns to give 68.', '0.68 equals 68%.'],
})
practice(decimalToPercentage, 'Write 0.4 as a percentage.', 'N9.3 Q2', numeric(40), '40%', 'Multiply 0.4 by 100.', decimalToPercentageWorking('0.4', '40'), undefined, 'Percentage (%)')
practice(decimalToPercentage, 'Write 0.056 as a percentage.', 'N9.3 Q3', numeric(5.6), '5.6%', 'Multiply by 100; a placeholder zero keeps the place value clear.', decimalToPercentageWorking('0.056', '5.6'), undefined, 'Percentage (%)')
practice(decimalToPercentage, 'Write 1.25 as a percentage.', 'N9.3 Q4a', numeric(125), '125%', 'Multiply by 100 even though the decimal is greater than 1.', decimalToPercentageWorking('1.25', '125'), undefined, 'Percentage (%)')
practice(decimalToPercentage, 'Explain why 1.25 converts to a percentage bigger than 100%.', 'N9.3 Q4b', select([
  '1.25 is greater than one whole, so its percentage must be greater than 100%.',
  'Every decimal with two digits becomes a percentage over 100%.',
  'The percentage is over 100% because 1.25 is less than 1.',
], 0), '1.25 is more than one whole.', 'Compare 1.25 with 1, which is 100%.', decimalToPercentageWorking('1.25', '125'), ['Compare 1.25 with one whole'])
practice(decimalToPercentage, 'A decimal converts to 4.5%. Work out the original decimal.', 'N9.3 Q5a', numeric(0.045), '0.045', 'Undo multiplying by 100 by dividing 4.5 by 100.', percentageToDecimalWorking('4.5', '0.045'))
practice(decimalToPercentage, 'Write down a decimal that converts to a percentage bigger than 200%.', 'N9.3 Q5b', openNumber(2), 'for example, 2.5', 'Choose any decimal greater than 2.', decimalToPercentageWorking('2.5', '250'), undefined, 'Your decimal')
practice(decimalToPercentage, 'Tom says: “A decimal that is already bigger than 1 will convert to a percentage over 1000%.” Is Tom correct?', 'N9.3 Q5c', select([
  'No. For example, 1.5 is greater than 1 but converts to 150%, not more than 1000%.',
  'Yes. Every decimal above 1 becomes at least 1000%.',
  'No. Decimals above 1 always convert to exactly 100%.',
], 0), 'No - 1.5 = 150%.', 'Test the statement using a value just above 1.', decimalToPercentageWorking('1.5', '150'), ['Test the claim with 1.5'])

const ptdVideo = worked(percentageToDecimal, 'Write 72% as a decimal.', 'N9.4 Q1; video N9.4', percentageToDecimalWorking('72', '0.72'), 'Divide the percentage by 100.')
video(ptdVideo, {
  id: 'lesson9-percentage-to-decimal', src: '/media/lesson-9/percentage-to-decimal.mp4', poster: '/media/lesson-9/percentage-to-decimal.jpg', title: 'Percentage to decimal: 72%', durationSeconds: 29.8, sourceFile: 'N9.4_Percentage_to_Decimal.mp4',
  textAlternative: ['Start with 72%.', 'Divide by 100.', 'The digits move two place-value columns to the right.', '72% equals 0.72.'],
})
practice(percentageToDecimal, 'Write 9% as a decimal.', 'N9.4 Q2', numeric(0.09), '0.09', 'Divide 9 by 100 and include the placeholder zero.', percentageToDecimalWorking('9', '0.09'))
practice(percentageToDecimal, 'Write 3.5% as a decimal.', 'N9.4 Q3', numeric(0.035), '0.035', 'Divide 3.5 by 100.', percentageToDecimalWorking('3.5', '0.035'))
practice(percentageToDecimal, 'Write 240% as a decimal.', 'N9.4 Q4a', numeric(2.4), '2.4', 'Divide by 100 even though the percentage is over 100%.', percentageToDecimalWorking('240', '2.4'))
practice(percentageToDecimal, 'Explain why 240% converts to a decimal bigger than 1.', 'N9.4 Q4b', select([
  '240% is more than 100%, so it represents more than one whole and its decimal is greater than 1.',
  'Every percentage with three digits becomes a decimal greater than 1.',
  '240% is less than one whole because percent means divide by 100.',
], 0), '240% is more than one whole.', 'Compare 240% with 100%, which equals 1.', percentageToDecimalWorking('240', '2.4'), ['Compare 240% with 100%'])
practice(percentageToDecimal, 'Write 25/2% as a decimal.', 'N9.4 Q5a', numeric(0.125), '0.125', 'First convert 25/2 to 12.5, then divide by 100.', percentageToDecimalWorking('12.5', '0.125'), ['25/2% = 12.5%', 'Now convert to a decimal'])
practice(percentageToDecimal, 'Write down a percentage that converts to a decimal bigger than 5.', 'N9.4 Q5b', openNumber(500), 'for example, 600%', 'Choose any percentage greater than 500%.', percentageToDecimalWorking('600', '6'), undefined, 'Percentage (%)')
practice(percentageToDecimal, 'Aisha says: “You can convert any percentage to a decimal just by removing the % sign.” Is Aisha correct?', 'N9.4 Q5c', select([
  'No. For example, 50% = 0.5, not 50; you must divide by 100.',
  'Yes. The percent sign has no effect on the value.',
  'No. You must multiply every percentage by 100.',
], 0), 'No - 50% = 0.5.', 'The percent sign means out of 100.', percentageToDecimalWorking('50', '0.5'), ['Test the claim with 50%'])

const ftpVideo = worked(fractionToPercentage, 'Write 7/20 as a percentage.', 'N9.5 Q1; video N9.5', fractionToPercentageWorking(7, 20, '35'), 'Multiply the fraction by 100 and complete the division.')
video(ftpVideo, {
  id: 'lesson9-fraction-to-percentage', src: '/media/lesson-9/fraction-to-percentage.mp4', poster: '/media/lesson-9/fraction-to-percentage.jpg', title: 'Fraction to percentage: 7/20', durationSeconds: 41.6, sourceFile: 'N9.5_Fraction_to_Percentage.mp4',
  textAlternative: ['Start with 7/20.', 'Multiply the fraction by 100.', 'Calculate 700 divided by 20.', '7/20 equals 35%.'],
})
practice(fractionToPercentage, 'Write 1/4 as a percentage.', 'N9.5 Q2', numeric(25), '25%', 'Multiply 1/4 by 100.', fractionToPercentageWorking(1, 4, '25'), undefined, 'Percentage (%)')
practice(fractionToPercentage, 'Write 9/25 as a percentage.', 'N9.5 Q3', numeric(36), '36%', 'Multiply 9/25 by 100 and simplify before dividing.', fractionToPercentageWorking(9, 25, '36'), undefined, 'Percentage (%)')
practice(fractionToPercentage, 'Write 11/8 as a percentage.', 'N9.5 Q4a', numeric(137.5), '137.5%', 'Multiply by 100 even though the fraction is greater than one.', fractionToPercentageWorking(11, 8, '137.5'), undefined, 'Percentage (%)')
practice(fractionToPercentage, 'Explain why 11/8 converts to a percentage bigger than 100%.', 'N9.5 Q4b', select([
  '11/8 has a numerator greater than its denominator, so it is more than one whole and more than 100%.',
  'Every fraction with denominator 8 is more than 100%.',
  '11/8 is less than one whole because 8 is less than 11.',
], 0), '11/8 is greater than one whole.', 'Compare the numerator and denominator.', fractionToPercentageWorking(11, 8, '137.5'), ['Compare 11/8 with 8/8'])
practice(fractionToPercentage, 'n/40 converts to 65%. Find the value of n.', 'N9.5 Q5a', numeric(26), 'n = 26', 'Solve n ÷ 40 × 100 = 65.', fractionToPercentageWorking(26, 40, '65'), ['n/40 = 65%', 'Find n'])
practice(fractionToPercentage, 'Write a fraction with denominator 8 that converts to a percentage bigger than 100%.', 'N9.5 Q5b', fractionRange('9/8', 8, 1), 'for example, 9/8', 'Choose a numerator bigger than 8.', fractionToPercentageWorking(9, 8, '112.5'), undefined, 'Your fraction')
practice(fractionToPercentage, 'Leo says: “A fraction with a numerator smaller than its denominator always converts to a percentage under 50%.” Is Leo correct?', 'N9.5 Q5c', select([
  'No. For example, 3/4 has a smaller numerator but converts to 75%, which is over 50%.',
  'Yes. Every proper fraction is less than 50%.',
  'No. Every proper fraction converts to more than 100%.',
], 0), 'No - 3/4 = 75%.', 'Test a proper fraction close to one.', fractionToPercentageWorking(3, 4, '75'), ['Test the claim with 3/4'])

const ptfVideo = worked(percentageToFraction, 'Write 65% as a fraction in its simplest form.', 'N9.6 Q1; video N9.6', percentageToFractionWorking('65', 13, 20), 'Write the percentage over 100, then simplify.')
video(ptfVideo, {
  id: 'lesson9-percentage-to-fraction', src: '/media/lesson-9/percentage-to-fraction.mp4', poster: '/media/lesson-9/percentage-to-fraction.jpg', title: 'Percentage to fraction: 65%', durationSeconds: 34.6, sourceFile: 'N9.6_Percentage_to_Fraction.mp4',
  textAlternative: ['Write 65% as 65/100.', 'The highest common factor of 65 and 100 is 5.', 'Divide the numerator and denominator by 5.', '65% equals 13/20 in simplest form.'],
})
practice(percentageToFraction, 'Write 40% as a fraction in its simplest form.', 'N9.6 Q2', fractionAnswer('2/5'), '2/5', 'Write 40/100, then simplify.', percentageToFractionWorking('40', 2, 5))
practice(percentageToFraction, 'Write 28% as a fraction in its simplest form.', 'N9.6 Q3', fractionAnswer('7/25'), '7/25', 'Write 28/100 and divide both parts by 4.', percentageToFractionWorking('28', 7, 25))
practice(percentageToFraction, 'Write 12.5% as a fraction in its simplest form.', 'N9.6 Q4a', fractionAnswer('1/8'), '1/8', 'Write 12.5/100, clear the decimal, then simplify.', percentageToFractionWorking('12.5', 1, 8))
practice(percentageToFraction, 'Convert 1/8 back to a percentage to check the answer to part (a).', 'N9.6 Q4b', numeric(12.5), '12.5%', 'Multiply 1/8 by 100.', fractionToPercentageWorking(1, 8, '12.5'), undefined, 'Percentage (%)')
practice(percentageToFraction, 'p% converts to 9/20 in its simplest form. Find the value of p.', 'N9.6 Q5a', numeric(45), 'p = 45', 'Convert 9/20 back to a percentage by multiplying by 100.', fractionToPercentageWorking(9, 20, '45'), ['p% = 9/20', 'Find p'])
practice(percentageToFraction, 'Write down a percentage bigger than 50% that converts to a fraction with denominator 4.', 'N9.6 Q5b', numberChoices(75, 125, 175, 225, 275, 325, 375, 425, 475, 525, 575, 625, 675, 725, 775, 825, 875, 925, 975), 'for example, 75%', 'Choose an odd number of quarters greater than two quarters.', percentageToFractionWorking('75', 3, 4), undefined, 'Percentage (%)')
practice(percentageToFraction, 'Maya says: “Every whole-number percentage converts to a fraction with denominator 100.” Is Maya correct?', 'N9.6 Q5c', select([
  'No. For example, 50% = 50/100 = 1/2, so the simplified denominator is 2.',
  'Yes. Percent always means the final denominator must stay 100.',
  'No. Every whole-number percentage simplifies to a whole number.',
], 0), 'No - 50% simplifies to 1/2.', 'The first fraction is over 100, but it may simplify.', percentageToFractionWorking('50', 1, 2), ['Test the claim with 50%'])

add('mixed', 'Choose a route and check the size', 'N9.1-N9.6 consolidation', text(
  'Fraction to decimal: numerator ÷ denominator',
  'Decimal to fraction: use a power of 10, then simplify',
  'Decimal ↔ percentage: multiply or divide by 100',
  'Fraction to percentage: multiply by 100',
  'Percentage to fraction: write over 100, then simplify',
), undefined, undefined, undefined, 'Use the direction of the conversion to choose the inverse operation. Check against the benchmarks 0, 1 and 100% so the final size makes sense.')

const states = finish()
export const tutorFractionsDecimalsPercentagesLesson: TutorMethodLesson = {
  id: 'L009', number: 9, title: 'Fractions, decimals and percentages', level: 'GCSE Foundation',
  goal: 'Convert accurately between fractions, decimals and percentages and explain why the representations are equivalent.',
  labels: {
    [fractionToDecimal]: 'Fraction to decimal', [decimalToFraction]: 'Decimal to fraction',
    [decimalToPercentage]: 'Decimal to percentage', [percentageToDecimal]: 'Percentage to decimal',
    [fractionToPercentage]: 'Fraction to percentage', [percentageToFraction]: 'Percentage to fraction', mixed: 'Review',
  },
  states,
}
