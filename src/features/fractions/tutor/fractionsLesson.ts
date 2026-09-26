import { chooser, numeric, working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import {
  addSubtractFractionsWorking,
  divideFractionsWorking,
  equivalentFractionWorking,
  fractionOfAmountWorking,
  improperToMixedWorking,
  mixedCalculationWorking,
  mixedToImproperWorking,
  multiplyFractionsWorking,
  simplifyFractionWorking,
} from './fractionWorking'

const choose = chooser()

const { add, finish } = author(8)
const simplifying = 'simplifying-fractions'
const converting = 'mixed-improper-fractions'
const adding = 'adding-fractions'
const subtracting = 'subtracting-fractions'
const multiplying = 'multiplying-fractions'
const dividing = 'dividing-fractions'
const mixedCalculations = 'mixed-fraction-calculations'
const amounts = 'fractions-of-amounts'
const text = (...lines: string[]) => ({ kind: 'text' as const, lines })

const fractionAnswer = (answer: string, mixed = answer.includes(' ') || !answer.includes('/'), requiredDenominator?: number): InteractionDefinition => ({
  type: 'fractionInput', correctAnswer: answer, displayAnswer: answer, acceptanceRule: 'rational', responseShape: mixed ? 'mixedNumber' : 'fraction', requiredDenominator,
  requireSimplest: requiredDenominator === undefined, requireMixedForm: mixed && answer.includes(' '),
})
const explain = (answer: string, method: string) => working(answer, ['Choose the fraction method.', method], ['Check the result.', `The answer is ${answer}.`])

function practice(topic: MicroSkillId, title: string, sourceRef: string, interaction: InteractionDefinition, answer: string, hint: string, walkthrough?: TutorWorking, lines: string[] = [title]) {
  const state = add(topic, title, sourceRef, text(...lines), interaction, explain(answer, hint), hint)
  if (walkthrough) state.working = walkthrough
  return state
}
function worked(topic: MicroSkillId, title: string, sourceRef: string, visual: TutorWorking, body: string) {
  return add(topic, title, sourceRef, visual, undefined, undefined, undefined, body)
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }

const simplifyVideo = worked(simplifying, 'Simplify 18/24 fully.', 'N8.1 Q1; video N8.1', simplifyFractionWorking(18, 24), 'Find the highest common factor, then divide the numerator and denominator by it.')
video(simplifyVideo, {
  id: 'lesson8-simplifying-fractions', src: '/media/lesson-8/simplifying-fractions.mp4', poster: '/media/lesson-8/simplifying-fractions.jpg', title: 'Simplifying fractions: 18/24', durationSeconds: 47, sourceFile: 'N8.1_Simplifying_Fractions.mp4',
  textAlternative: ['Start with 18/24.', 'The highest common factor of 18 and 24 is 6.', 'Divide the numerator and denominator by 6.', '18/24 simplifies fully to 3/4.'],
})
practice(simplifying, 'Simplify 10/15 fully.', 'N8.1 Q2', fractionAnswer('2/3'), '2/3', 'Find the highest common factor of 10 and 15.', simplifyFractionWorking(10, 15))
practice(simplifying, 'Simplify 42/56 fully.', 'N8.1 Q3', fractionAnswer('3/4'), '3/4', 'Find the greatest number that divides 42 and 56 exactly.', simplifyFractionWorking(42, 56))
practice(simplifying, 'Simplify 28/70 fully.', 'N8.1 Q4a', fractionAnswer('2/5'), '2/5', 'The HCF of 28 and 70 is 14.', simplifyFractionWorking(28, 70))
practice(simplifying, 'Sam says the simplest form of 36/48 is 6/8. Explain why Sam is wrong and choose the fully simplified fraction.', 'N8.1 Q4b', choose([
  'Sam is wrong because 6 and 8 still share a factor of 2; 36/48 simplifies fully to 3/4.',
  'Sam is correct because dividing once always gives the simplest form.',
  'Sam is wrong because 36/48 simplifies to 2/3.',
]), 'Sam is wrong; the simplest form is 3/4.', 'Check whether 6 and 8 still have a common factor greater than 1.', undefined, ['Sam proposes 36/48 = 6/8', 'Is 6/8 fully simplified?'])
practice(simplifying, 'Simplify 90/135 fully.', 'N8.1 Q5a', fractionAnswer('2/3'), '2/3', 'The HCF of 90 and 135 is 45.', simplifyFractionWorking(90, 135))
practice(simplifying, 'Write a fraction equivalent to 5/8 that has a denominator of 96.', 'N8.1 Q5b', fractionAnswer('60/96', false, 96), '60/96', 'Work out the scale factor from 8 to 96, then apply it to 5.', equivalentFractionWorking(5, 8, 96))
practice(simplifying, 'Jake says 51/85 cannot be simplified because 51 and 85 share no common factor. Show that Jake is wrong and choose the simplest form.', 'N8.1 Q5c', choose([
  '51 and 85 are both divisible by 17, so 51/85 = 3/5.',
  'Jake is correct because both numbers are odd.',
  'They are both divisible by 3, so 51/85 = 17/28.',
]), '51/85 = 3/5.', 'Write 51 and 85 as products and look for a shared factor.', undefined, ['51 = 3 × 17', '85 = 5 × 17'])

const conversionVideo = worked(converting, 'Convert 3 1/4 to an improper fraction and back again.', 'N8.2 video', mixedToImproperWorking(3, 1, 4), 'Count the quarter-parts in the three wholes, then add the remaining quarter.')
video(conversionVideo, {
  id: 'lesson8-mixed-improper', src: '/media/lesson-8/mixed-improper-fractions.mp4', poster: '/media/lesson-8/mixed-improper-fractions.jpg', title: 'Mixed and improper fractions: 3 1/4 and 13/4', durationSeconds: 56.4, sourceFile: 'N8.2_Mixed_and_Improper_Fractions.mp4',
  textAlternative: ['Convert 3 1/4 by calculating 3 × 4 + 1 = 13.', 'Keep the denominator 4, giving 13/4.', 'Convert back by dividing 13 by 4: 3 remainder 1.', 'The remainder is the new numerator, so 13/4 = 3 1/4.'],
})
worked(converting, 'Write 4 2/5 as an improper fraction.', 'N8.2 Q1 worked example', mixedToImproperWorking(4, 2, 5), 'Multiply the whole number by the denominator, then add the numerator.')
practice(converting, 'Write 17/6 as a mixed number.', 'N8.2 Q2', fractionAnswer('2 5/6', true), '2 5/6', 'Divide 17 by 6. The quotient is the whole number and the remainder is the new numerator.', improperToMixedWorking(17, 6))
practice(converting, 'Write 6 3/8 as an improper fraction.', 'N8.2 Q3', fractionAnswer('51/8', false), '51/8', 'Calculate 6 × 8 + 3 and keep the denominator 8.', mixedToImproperWorking(6, 3, 8))
practice(converting, 'Write 29/4 as a mixed number.', 'N8.2 Q4a', fractionAnswer('7 1/4', true), '7 1/4', 'Divide 29 by 4 and use the remainder over 4.', improperToMixedWorking(29, 4))
practice(converting, 'Write 3 5/8 as an improper fraction. Then use the reverse conversion to check it.', 'N8.2 Q4b', fractionAnswer('29/8', false), '29/8', 'Calculate 3 × 8 + 5, then check by dividing the new numerator by 8.', mixedToImproperWorking(3, 5, 8))
practice(converting, 'Write 47/6 as a mixed number.', 'N8.2 Q5a', fractionAnswer('7 5/6', true), '7 5/6', 'Find how many complete groups of 6 fit into 47.', improperToMixedWorking(47, 6))
practice(converting, 'Write 8 3/4 as an improper fraction.', 'N8.2 Q5b', fractionAnswer('35/4', false), '35/4', 'Calculate 8 × 4 + 3.', mixedToImproperWorking(8, 3, 4))
practice(converting, 'Ravi says 7 2/5 = 47/5 because he adds 7 + 5 before adding 2. Explain his mistake and choose the correct improper fraction.', 'N8.2 Q5c', choose([
  'Ravi should multiply 7 × 5, then add 2, so 7 2/5 = 37/5.',
  'Ravi is correct because the denominator is added to the whole number.',
  'Ravi should multiply 7 × 2, then add 5, giving 19/5.',
]), '7 2/5 = 37/5.', 'A whole contains five fifths, so seven wholes contain 7 × 5 fifths.', undefined, ['7 wholes contain 35 fifths', 'Add the remaining 2 fifths'])

const addVideo = worked(adding, 'Work out 1/2 + 1/3.', 'N8.3 video', addSubtractFractionsWorking([{ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 3 }], 'add'), 'Use equivalent fractions with a common denominator before adding.')
video(addVideo, {
  id: 'lesson8-adding-fractions', src: '/media/lesson-8/adding-fractions.mp4', poster: '/media/lesson-8/adding-fractions.jpg', title: 'Adding fractions: 1/2 + 1/3', durationSeconds: 47, sourceFile: 'N8.3_Adding_Fractions.mp4',
  textAlternative: ['Start with 1/2 + 1/3.', 'The lowest common denominator of 2 and 3 is 6.', 'Rewrite the fractions as 3/6 and 2/6.', 'Add the numerators to obtain 5/6.'],
})
worked(adding, 'Work out 1/3 + 1/4.', 'N8.3 Q1 worked example', addSubtractFractionsWorking([{ numerator: 1, denominator: 3 }, { numerator: 1, denominator: 4 }], 'add'), 'Find a common denominator and rewrite both fractions with equal-sized parts.')
practice(adding, 'Work out 2/9 + 4/9. Give your answer in its simplest form.', 'N8.3 Q2', fractionAnswer('2/3'), '2/3', 'The denominators already match, so add the numerators and then simplify.', addSubtractFractionsWorking([{ numerator: 2, denominator: 9 }, { numerator: 4, denominator: 9 }], 'add'))
practice(adding, 'Without a calculator, work out 3/8 + 1/6.', 'N8.3 Q3', fractionAnswer('13/24'), '13/24', 'The lowest common denominator of 8 and 6 is 24.', addSubtractFractionsWorking([{ numerator: 3, denominator: 8 }, { numerator: 1, denominator: 6 }], 'add'))
practice(adding, 'Without a calculator, work out 2/5 + 1/10. Give your answer in its simplest form.', 'N8.3 Q4a', fractionAnswer('1/2'), '1/2', 'Rewrite 2/5 as tenths before adding.', addSubtractFractionsWorking([{ numerator: 2, denominator: 5 }, { numerator: 1, denominator: 10 }], 'add'))
practice(adding, 'Without a calculator, work out 5/6 + 3/4. Give your answer as a mixed number.', 'N8.3 Q4b', fractionAnswer('1 7/12', true), '1 7/12', 'Use twelfths, add, then convert the improper result to a mixed number.', addSubtractFractionsWorking([{ numerator: 5, denominator: 6 }, { numerator: 3, denominator: 4 }], 'add'))
practice(adding, 'Without a calculator, work out 7/9 + 5/12. Give your answer as a mixed number.', 'N8.3 Q5a', fractionAnswer('1 7/36', true), '1 7/36', 'Use 36 as the common denominator.', addSubtractFractionsWorking([{ numerator: 7, denominator: 9 }, { numerator: 5, denominator: 12 }], 'add'))
practice(adding, 'Without a calculator, work out 1/2 + 1/3 + 1/6.', 'N8.3 Q5b', fractionAnswer('1', true), '1', 'Write all three fractions in sixths.', addSubtractFractionsWorking([{ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 3 }, { numerator: 1, denominator: 6 }], 'add'))
practice(adding, 'Tom adds 1/4 + 1/4 and gets 2/8 by adding both numerators and denominators. Explain why Tom is wrong and choose the correct answer.', 'N8.3 Q5c', choose([
  'The quarters are already equal-sized parts, so keep denominator 4 and add the numerators: 2/4 = 1/2.',
  'Tom is correct because every fraction addition adds both parts.',
  'The denominator should be multiplied, so the answer is 1/16.',
]), '1/4 + 1/4 = 1/2.', 'Adding counts equal-sized parts; it does not change the size of each part.', undefined, ['Two quarters are being counted', 'Keep the denominator 4'])

const subtractVideo = worked(subtracting, 'Work out 5/6 - 1/3.', 'N8.4 video', addSubtractFractionsWorking([{ numerator: 5, denominator: 6 }, { numerator: 1, denominator: 3 }], 'subtract'), 'Rewrite 1/3 as 2/6, subtract the numerators, then simplify.')
video(subtractVideo, {
  id: 'lesson8-subtracting-fractions', src: '/media/lesson-8/subtracting-fractions.mp4', poster: '/media/lesson-8/subtracting-fractions.jpg', title: 'Subtracting fractions: 5/6 - 1/3', durationSeconds: 47, sourceFile: 'N8.4_Subtracting_Fractions.mp4',
  textAlternative: ['Start with 5/6 - 1/3.', 'Rewrite 1/3 with denominator 6 as 2/6.', 'Subtract the numerators to obtain 3/6.', 'Simplify 3/6 to 1/2.'],
})
worked(subtracting, 'Work out 5/6 - 1/4.', 'N8.4 Q1 worked example', addSubtractFractionsWorking([{ numerator: 5, denominator: 6 }, { numerator: 1, denominator: 4 }], 'subtract'), 'Use twelfths so both fractions describe equal-sized parts.')
practice(subtracting, 'Work out 7/8 - 3/8. Give your answer in its simplest form.', 'N8.4 Q2', fractionAnswer('1/2'), '1/2', 'Keep the common denominator, subtract the numerators, then simplify.', addSubtractFractionsWorking([{ numerator: 7, denominator: 8 }, { numerator: 3, denominator: 8 }], 'subtract'))
practice(subtracting, 'Without a calculator, work out 7/9 - 2/3.', 'N8.4 Q3', fractionAnswer('1/9'), '1/9', 'Rewrite 2/3 as ninths.', addSubtractFractionsWorking([{ numerator: 7, denominator: 9 }, { numerator: 2, denominator: 3 }], 'subtract'))
practice(subtracting, 'Without a calculator, work out 11/12 - 1/4. Give your answer in its simplest form.', 'N8.4 Q4a', fractionAnswer('2/3'), '2/3', 'Rewrite 1/4 as 3/12, then simplify the difference.', addSubtractFractionsWorking([{ numerator: 11, denominator: 12 }, { numerator: 1, denominator: 4 }], 'subtract'))
practice(subtracting, 'Without a calculator, work out 2 - 5/8. Give your answer as a mixed number.', 'N8.4 Q4b', fractionAnswer('1 3/8', true), '1 3/8', 'Write 2 as 16/8 before subtracting.', addSubtractFractionsWorking([{ numerator: 2, denominator: 1 }, { numerator: 5, denominator: 8 }], 'subtract'))
practice(subtracting, 'Without a calculator, work out 5/6 - 3/8.', 'N8.4 Q5a', fractionAnswer('11/24'), '11/24', 'Use 24 as the common denominator.', addSubtractFractionsWorking([{ numerator: 5, denominator: 6 }, { numerator: 3, denominator: 8 }], 'subtract'))
practice(subtracting, 'Without a calculator, work out 7/10 - 1/4.', 'N8.4 Q5b', fractionAnswer('9/20'), '9/20', 'Rewrite both fractions in twentieths.', addSubtractFractionsWorking([{ numerator: 7, denominator: 10 }, { numerator: 1, denominator: 4 }], 'subtract'))
practice(subtracting, 'Maya subtracts 8/9 - 2/9 and writes 6/0 because she subtracts the denominators. Explain her mistake and choose the correct answer.', 'N8.4 Q5c', choose([
  'The ninths are equal-sized parts, so keep denominator 9 and subtract only the numerators: 6/9 = 2/3.',
  'Maya is correct, but 6/0 should be simplified to 6.',
  'Both denominators should be added, giving 6/18.',
]), '8/9 - 2/9 = 2/3.', 'The denominator names the size of the parts and stays 9.', undefined, ['Subtract two ninths from eight ninths', 'Six ninths remain'])

const multiplyVideo = worked(multiplying, 'Work out 2/3 × 3/4.', 'N8.5 video', multiplyFractionsWorking({ numerator: 2, denominator: 3 }, { numerator: 3, denominator: 4 }), 'Multiply across, then simplify the product.')
video(multiplyVideo, {
  id: 'lesson8-multiplying-fractions', src: '/media/lesson-8/multiplying-fractions.mp4', poster: '/media/lesson-8/multiplying-fractions.jpg', title: 'Multiplying fractions: 2/3 × 3/4', durationSeconds: 47, sourceFile: 'N8.5_Multiplying_Fractions.mp4',
  textAlternative: ['Start with 2/3 × 3/4.', 'Multiply the numerators and denominators to obtain 6/12.', 'Simplify 6/12 by dividing both parts by 6.', 'The product is 1/2.'],
})
worked(multiplying, 'Work out 2/3 × 4/5.', 'N8.5 Q1 worked example', multiplyFractionsWorking({ numerator: 2, denominator: 3 }, { numerator: 4, denominator: 5 }), 'Multiply the numerators and denominators.')
practice(multiplying, 'Work out 1/4 × 2/3. Give your answer in its simplest form.', 'N8.5 Q2', fractionAnswer('1/6'), '1/6', 'Multiply across to get 2/12, then simplify.', multiplyFractionsWorking({ numerator: 1, denominator: 4 }, { numerator: 2, denominator: 3 }))
practice(multiplying, 'Without a calculator, work out 3/5 × 5/9. Give your answer in its simplest form.', 'N8.5 Q3', fractionAnswer('1/3'), '1/3', 'Cancel the common factor 5 before multiplying.', multiplyFractionsWorking({ numerator: 3, denominator: 5 }, { numerator: 5, denominator: 9 }, true))
practice(multiplying, 'Without a calculator, work out 2/7 × 7/8. Give your answer in its simplest form.', 'N8.5 Q4a', fractionAnswer('1/4'), '1/4', 'Cancel the common factor 7 before multiplying.', multiplyFractionsWorking({ numerator: 2, denominator: 7 }, { numerator: 7, denominator: 8 }, true))
practice(multiplying, 'Without a calculator, work out 5/6 × 9/10. Give your answer in its simplest form.', 'N8.5 Q4b', fractionAnswer('3/4'), '3/4', 'Multiply across, then divide 45/60 by its HCF.', multiplyFractionsWorking({ numerator: 5, denominator: 6 }, { numerator: 9, denominator: 10 }))
practice(multiplying, 'Without a calculator, work out 4/9 × 3/8. Give your answer in its simplest form.', 'N8.5 Q5a', fractionAnswer('1/6'), '1/6', 'Multiply to get 12/72, then simplify fully.', multiplyFractionsWorking({ numerator: 4, denominator: 9 }, { numerator: 3, denominator: 8 }))
practice(multiplying, 'Without a calculator, work out 5/12 × 8/15. Give your answer in its simplest form.', 'N8.5 Q5b', fractionAnswer('2/9'), '2/9', 'Multiply to get 40/180, then divide both parts by 20.', multiplyFractionsWorking({ numerator: 5, denominator: 12 }, { numerator: 8, denominator: 15 }))
practice(multiplying, 'Ben says multiplying two fractions below 1 always gives an answer bigger than both fractions. Use 1/2 × 1/3 to decide whether Ben is correct.', 'N8.5 Q5c', choose([
  'Ben is wrong: 1/2 × 1/3 = 1/6, which is smaller than both factors; multiplying by a fraction below 1 scales down.',
  'Ben is correct because multiplication always makes numbers larger.',
  'Ben is wrong because 1/2 × 1/3 = 2/5.',
]), 'Ben is wrong; the product is 1/6.', 'Think of taking one third of one half.', undefined, ['1/2 × 1/3 = 1/6', 'Compare 1/6 with both factors'])

const divideVideo = worked(dividing, 'Work out 1/2 ÷ 1/6.', 'N8.6 video', divideFractionsWorking({ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 6 }), 'Use the reciprocal of the second fraction, then multiply.')
video(divideVideo, {
  id: 'lesson8-dividing-fractions', src: '/media/lesson-8/dividing-fractions.mp4', poster: '/media/lesson-8/dividing-fractions.jpg', title: 'Dividing fractions: 1/2 ÷ 1/6', durationSeconds: 47, sourceFile: 'N8.6_Dividing_Fractions.mp4',
  textAlternative: ['Start with 1/2 ÷ 1/6.', 'Keep the first fraction, change division to multiplication and use the reciprocal 6/1.', 'Multiply to obtain 6/2.', 'Simplify 6/2 to 3.'],
})
worked(dividing, 'Work out 3/4 ÷ 2/5.', 'N8.6 Q1 worked example', divideFractionsWorking({ numerator: 3, denominator: 4 }, { numerator: 2, denominator: 5 }), 'Replace division by multiplication using the reciprocal of the second fraction.')
practice(dividing, 'Work out 1/3 ÷ 2/5.', 'N8.6 Q2', fractionAnswer('5/6'), '5/6', 'Use 5/2, the reciprocal of 2/5, then multiply.', divideFractionsWorking({ numerator: 1, denominator: 3 }, { numerator: 2, denominator: 5 }))
practice(dividing, 'Without a calculator, work out 5/8 ÷ 3/4. Give your answer in its simplest form.', 'N8.6 Q3', fractionAnswer('5/6'), '5/6', 'Change the division to multiplication by 4/3.', divideFractionsWorking({ numerator: 5, denominator: 8 }, { numerator: 3, denominator: 4 }))
practice(dividing, 'Without a calculator, work out 2/9 ÷ 4/9. Give your answer in its simplest form.', 'N8.6 Q4a', fractionAnswer('1/2'), '1/2', 'Multiply 2/9 by the reciprocal 9/4.', divideFractionsWorking({ numerator: 2, denominator: 9 }, { numerator: 4, denominator: 9 }))
practice(dividing, 'Without a calculator, work out 7/10 ÷ 3/5. Give your answer as a mixed number.', 'N8.6 Q4b', fractionAnswer('1 1/6', true), '1 1/6', 'Multiply by 5/3, simplify, then convert the improper fraction.', divideFractionsWorking({ numerator: 7, denominator: 10 }, { numerator: 3, denominator: 5 }))
practice(dividing, 'Without a calculator, work out 5/6 ÷ 5/9. Give your answer as a mixed number.', 'N8.6 Q5a', fractionAnswer('1 1/2', true), '1 1/2', 'Multiply by 9/5, cancel, then convert the result.', divideFractionsWorking({ numerator: 5, denominator: 6 }, { numerator: 5, denominator: 9 }))
practice(dividing, 'Without a calculator, work out 2/5 ÷ 6/25. Give your answer as a mixed number.', 'N8.6 Q5b', fractionAnswer('1 2/3', true), '1 2/3', 'Multiply 2/5 by 25/6, simplify, then convert.', divideFractionsWorking({ numerator: 2, denominator: 5 }, { numerator: 6, denominator: 25 }))
practice(dividing, 'Aisha says dividing by a fraction always makes a number bigger. Use 3/4 ÷ 3/2 to decide whether she is correct.', 'N8.6 Q5c', choose([
  'Aisha is wrong: 3/4 ÷ 3/2 = 1/2; dividing by a fraction greater than 1 makes this value smaller.',
  'Aisha is correct because every fraction is less than 1.',
  'Aisha is wrong because 3/4 ÷ 3/2 = 9/8.',
]), 'Aisha is wrong; the result is 1/2.', 'The divisor 3/2 is greater than 1, so compare the result with 3/4.', undefined, ['3/4 × 2/3 = 1/2', '1/2 is smaller than 3/4'])

const mixedVideo = worked(mixedCalculations, 'Work out 1 1/2 × 2/3.', 'N8.7 video', mixedCalculationWorking({ whole: 1, numerator: 1, denominator: 2 }, { numerator: 2, denominator: 3 }, 'multiply'), 'Convert the mixed number to 3/2, then multiply and simplify.')
video(mixedVideo, {
  id: 'lesson8-mixed-calculations', src: '/media/lesson-8/mixed-fraction-calculations.mp4', poster: '/media/lesson-8/mixed-fraction-calculations.jpg', title: 'Calculations with mixed fractions: 1 1/2 × 2/3', durationSeconds: 56.4, sourceFile: 'N8.7_Calculations_with_Mixed_Fractions.mp4',
  textAlternative: ['Convert 1 1/2 to 3/2.', 'Multiply 3/2 by 2/3.', 'Cancel the common 3s and 2s.', 'The product is one whole.'],
})
worked(mixedCalculations, 'Work out 2 3/5 × 1 1/2.', 'N8.7 Q1 worked example', mixedCalculationWorking({ whole: 2, numerator: 3, denominator: 5 }, { whole: 1, numerator: 1, denominator: 2 }, 'multiply'), 'Convert both mixed numbers to improper fractions before multiplying.')
practice(mixedCalculations, 'Work out 1 1/4 × 2.', 'N8.7 Q2', fractionAnswer('2 1/2', true), '2 1/2', 'Convert 1 1/4 to 5/4 and write 2 as 2/1.', mixedCalculationWorking({ whole: 1, numerator: 1, denominator: 4 }, { numerator: 2, denominator: 1 }, 'multiply'))
practice(mixedCalculations, 'Without a calculator, work out 3 1/3 ÷ 1 2/3.', 'N8.7 Q3', fractionAnswer('2', true), '2', 'Convert both mixed numbers to improper fractions, then divide using the reciprocal.', mixedCalculationWorking({ whole: 3, numerator: 1, denominator: 3 }, { whole: 1, numerator: 2, denominator: 3 }, 'divide'))
practice(mixedCalculations, 'Without a calculator, work out 2 1/2 × 1 1/5.', 'N8.7 Q4a', fractionAnswer('3', true), '3', 'Convert to 5/2 and 6/5, then multiply.', mixedCalculationWorking({ whole: 2, numerator: 1, denominator: 2 }, { whole: 1, numerator: 1, denominator: 5 }, 'multiply'))
practice(mixedCalculations, 'Without a calculator, work out 4 1/4 ÷ 1 1/2. Give your answer as a mixed number.', 'N8.7 Q4b', fractionAnswer('2 5/6', true), '2 5/6', 'Convert to 17/4 and 3/2, then multiply by the reciprocal 2/3.', mixedCalculationWorking({ whole: 4, numerator: 1, denominator: 4 }, { whole: 1, numerator: 1, denominator: 2 }, 'divide'))
practice(mixedCalculations, 'Without a calculator, work out 3 2/5 × 2 1/2.', 'N8.7 Q5a', fractionAnswer('8 1/2', true), '8 1/2', 'Convert to 17/5 and 5/2 before multiplying.', mixedCalculationWorking({ whole: 3, numerator: 2, denominator: 5 }, { whole: 2, numerator: 1, denominator: 2 }, 'multiply'))
practice(mixedCalculations, 'Without a calculator, work out 5 1/3 ÷ 2 2/3.', 'N8.7 Q5b', fractionAnswer('2', true), '2', 'Convert to 16/3 and 8/3, then divide.', mixedCalculationWorking({ whole: 5, numerator: 1, denominator: 3 }, { whole: 2, numerator: 2, denominator: 3 }, 'divide'))
practice(mixedCalculations, 'Noah multiplies the whole-number parts and fractional parts of 2 1/2 × 1 1/3 separately, then adds them. Explain why this is wrong and choose the correct answer.', 'N8.7 Q5c', choose([
  'Convert first: 2 1/2 = 5/2 and 1 1/3 = 4/3, so the product is 20/6 = 3 1/3.',
  'Noah is correct; the answer is 2 1/6.',
  'Add the mixed numbers first, so the answer is 3 5/6.',
]), 'The correct product is 3 1/3.', 'A mixed number is one value; convert the complete value before multiplying.', undefined, ['2 1/2 = 5/2', '1 1/3 = 4/3'])

const amountVideo = worked(amounts, 'Find 2/5 of 20.', 'N8.8 video', fractionOfAmountWorking(2, 5, 20, false), 'Divide by the denominator to find one part, then multiply by the numerator.')
video(amountVideo, {
  id: 'lesson8-fractions-amounts', src: '/media/lesson-8/fractions-of-amounts.mp4', poster: '/media/lesson-8/fractions-of-amounts.jpg', title: 'Fractions of amounts: 2/5 of 20', durationSeconds: 47, sourceFile: 'N8.8_Fractions_of_Amounts.mp4',
  textAlternative: ['Start with 2/5 of 20.', 'Divide 20 by the denominator 5 to get 4.', 'Multiply 4 by the numerator 2 to get 8.', 'Therefore 2/5 of 20 is 8.'],
})
worked(amounts, 'Find 2/5 of £85.', 'N8.8 Q1 worked example', fractionOfAmountWorking(2, 5, 85), 'Find one fifth first, then take two fifths.')
const amountQ2 = practice(amounts, 'Find 1/4 of £48.', 'N8.8 Q2', numeric(12), '£12', 'Divide £48 by the denominator 4.', fractionOfAmountWorking(1, 4, 48)); amountQ2.answerLabel = 'Amount (£)'
const amountQ3 = practice(amounts, 'Find 5/8 of £96.', 'N8.8 Q3', numeric(60), '£60', 'Divide £96 by 8, then multiply the result by 5.', fractionOfAmountWorking(5, 8, 96)); amountQ3.answerLabel = 'Amount (£)'
const amountQ4a = practice(amounts, 'Find 3/7 of £147.', 'N8.8 Q4a', numeric(63), '£63', 'Find one seventh of £147, then take three parts.', fractionOfAmountWorking(3, 7, 147)); amountQ4a.answerLabel = 'Amount (£)'
const amountQ4b = practice(amounts, "A coat's original price is £96. In a sale it is reduced to 2/3 of its original price. What is the sale price?", 'N8.8 Q4b', numeric(64), '£64', 'The sale price is two thirds of £96.', fractionOfAmountWorking(2, 3, 96)); amountQ4b.answerLabel = 'Sale price (£)'
const amountQ5a = practice(amounts, 'Find 7/12 of £360.', 'N8.8 Q5a', numeric(210), '£210', 'Find one twelfth of £360, then multiply by 7.', fractionOfAmountWorking(7, 12, 360)); amountQ5a.answerLabel = 'Amount (£)'
const amountQ5b = practice(amounts, 'Find 5/9 of £126.', 'N8.8 Q5b', numeric(70), '£70', 'Find one ninth of £126, then multiply by 5.', fractionOfAmountWorking(5, 9, 126)); amountQ5b.answerLabel = 'Amount (£)'
practice(amounts, 'Priya says that to find 3/4 of an amount you must divide by 4 first and can never multiply by 3 first. Use 3/4 of £48 to decide whether she is correct.', 'N8.8 Q5c', choose([
  'Priya is wrong: £48 ÷ 4 × 3 = £36 and £48 × 3 ÷ 4 = £36, so either order works when the division is exact.',
  'Priya is correct because multiplying first always changes the fraction.',
  'Priya is wrong because 3/4 of £48 is £64.',
]), '£36 either way.', 'Calculate both orders and compare the results.', undefined, ['£48 ÷ 4 × 3', '£48 × 3 ÷ 4'])

add('mixed', 'Simplify, convert, calculate and interpret', 'N8.1-N8.8 consolidation', text('Simplify: divide both parts by a common factor', 'Add or subtract: use equal-sized parts', 'Multiply: multiply across and simplify', 'Divide: multiply by the reciprocal', 'Mixed numbers: convert before calculating', 'Amounts: divide by the denominator, multiply by the numerator'), undefined, undefined, undefined, 'Choose the method that matches the question, preserve the value at every equivalent step, and check whether the size of the answer is sensible.')

const states = finish()
export const tutorFractionsLesson: TutorMethodLesson = {
  id: 'L008', number: 8, title: 'Fractions', level: 'GCSE Foundation',
  goal: 'Simplify, convert and calculate with fractions, mixed numbers and fractions of amounts.',
  labels: {
    [simplifying]: 'Simplifying', [converting]: 'Mixed and improper', [adding]: 'Adding', [subtracting]: 'Subtracting',
    [multiplying]: 'Multiplying', [dividing]: 'Dividing', [mixedCalculations]: 'Mixed calculations', [amounts]: 'Of amounts', mixed: 'Review',
  },
  states,
}
