import { microSkillLabels, numberTypesLesson } from '../numberTypesLesson'
import type { IntegerValueVisualDefinition, LearningState, LessonDefinition, MicroSkillId, NumberOption } from '../types'

const visual = (props: IntegerValueVisualDefinition['props']): IntegerValueVisualDefinition => ({ type: 'integerValues', props })
const binary: NumberOption[] = [{ id: 'integer', label: 'Integer' }, { id: 'non-integer', label: 'Non-integer' }]
function question(id: string, title: string, props: IntegerValueVisualDefinition['props'], options: NumberOption[], answer: string | string[], explanation: string, next: string, phase: LearningState['phase'] = 'guided'): LearningState {
  return {
    id, microSkillId: 'whole-values', phase, teachingIntent: title, content: { title }, component: visual(props),
    interaction: { type: Array.isArray(answer) ? 'multiSelect' : 'select', options, correctAnswer: answer },
    feedback: { correct: { message: 'That’s right.', evidence: explanation }, incorrect: { message: 'Here’s the answer.', evidence: explanation } },
    transition: { onCorrect: next, onIncorrect: next },
    completionCondition: 'See the correct answer and explanation, then choose Continue.',
  }
}
function teaching(id: string, title: string, body: string, kind: 'explorer' | 'fractionWorked' | 'rootsWorked', next: string): LearningState {
  return { id, microSkillId: 'whole-values', phase: 'teach', teachingIntent: title, content: { title, body }, component: visual({ kind }), interaction: { type: 'continue' }, transition: { onComplete: next }, completionCondition: 'Explore the example and choose Continue; exploration is optional.' }
}
export const variantDOpeningStates: LearningState[] = [
  teaching('D-I-01', 'Move the point. What changes?', 'Integers are … −3, −2, −1, 0, 1, 2, 3 … . Values between neighbouring integer ticks are non-integers.', 'explorer', 'D-I-02'),
  question('D-I-02', 'Is −3 an integer?', { kind: 'classify', expression: '−3', value: -3, min: -4, max: 0 }, binary, 'integer', '−3 is an integer. Negative integers count too; −3 has no fractional part.', 'D-I-03'),
  question('D-I-03', 'Is 1.5 an integer?', { kind: 'classify', expression: '1.5', value: 1.5, min: 0, max: 3 }, binary, 'non-integer', '1.5 is a non-integer. It lies between 1 and 2.', 'D-I-04'),
  teaching('D-I-04', 'A fraction can represent an integer', 'Work out the value first. The fraction bar tells you to divide.', 'fractionWorked', 'D-I-05'),
  question('D-I-05', 'What is the value of 20/5?', { kind: 'fractionValue' }, ['4', '5', '15'].map(label => ({ id: label, label })), '4', '20 ÷ 5 = 4. So 20/5 represents the value 4.', 'D-I-06'),
  question('D-I-06', 'Is 20/5 an integer?', { kind: 'classify', expression: '20/5', value: 4, min: 2, max: 6, resolution: '20 ÷ 5 = 4' }, binary, 'integer', '20/5 is an integer because its value is 4. Judge the value, however it is written.', 'D-I-07'),
  question('D-I-07', 'Why are all three integers?', { kind: 'equivalentForms' }, [
    { id: 'value', label: 'Each has the value 2.' }, { id: 'positive', label: 'Every positive number is an integer.' }, { id: 'notation', label: 'Decimals and fractions are always integers.' },
  ], 'value', '2, 2.0 and 4/2 all represent 2, an integer. A decimal point or fraction bar does not decide the category.', 'D-I-08'),
  teaching('D-I-08', 'Some square roots are integers', 'Compare these two examples. Look for a square number, or place the root between integer ticks.', 'rootsWorked', 'D-I-09'),
  question('D-I-09', 'Is √81 an integer?', { kind: 'rootCheck', radicand: 81, lower: 8, upper: 10 }, binary, 'integer', '√81 is an integer. Since 9 × 9 = 81, √81 = 9.', 'D-I-10', 'independent'),
  question('D-I-10', 'Is √20 an integer?', { kind: 'rootCheck', radicand: 20, lower: 4, upper: 5 }, binary, 'non-integer', '√20 is a non-integer. 4² = 16 and 5² = 25, so 4 < √20 < 5. No integer lies strictly between 4 and 5.', 'D-I-11', 'independent'),
  question('D-I-11', 'Select all the integers.', { kind: 'challenge' }, ['−7', '1.5', '0', '12/4', '√11', '26'].map(label => ({ id: label, label })), ['−7', '0', '12/4', '26'], '−7, 0, 12/4 and 26 are integers; 12/4 = 3. The other values lie between integer ticks: 1 < 1.5 < 2 and 3 < √11 < 4.', 'D-P-01', 'mastery'),
  question('D-P-01', 'Which value is an integer?', { kind: 'challenge' }, ['4.2', '−15', '3/8', '√7'].map(label => ({ id: label, label })), '−15', '−15 is an integer. 4.2 and 3/8 = 0.375 have fractional parts. Since 2² < 7 < 3², √7 lies between 2 and 3.', 'D-P-02', 'independent'),
  question('D-P-02', 'Select all the non-integers.', { kind: 'challenge' }, ['−2', '6.5', '0', '20/5', '√49', '11/4'].map(label => ({ id: label, label })), ['6.5', '11/4'], '6.5 and 11/4 = 2.75 are non-integers. The others are integers: −2, 0, 20/5 = 4 and √49 = 7.', 'D-P-03', 'independent'),
  question('D-P-03', 'Select all the integers.', { kind: 'challenge' }, ['18/6', '√20', '−9', '2.75', '√81'].map(label => ({ id: label, label })), ['18/6', '−9', '√81'], '18/6 = 3, −9 and √81 = 9 are integers. √20 lies between 4 and 5, and 2.75 lies between 2 and 3.', 'D-P-04', 'independent'),
  question('D-P-04', 'Why is √20 a non-integer?', { kind: 'rootCheck', radicand: 20, lower: 4, upper: 5 }, [
    { id: 'between', label: 'It lies strictly between 4 and 5.' },
    { id: 'root', label: 'Every square root is a non-integer.' },
    { id: 'twenty', label: '20 is a non-integer.' },
  ], 'between', '4² = 16 and 5² = 25, so 4 < √20 < 5. There is no integer strictly between 4 and 5. Some square roots are integers: √81 = 9.', 'D-P-05', 'transfer'),
  question('D-P-05', 'Is n an integer? Choose the reason.', { kind: 'squareEquation' }, [
    { id: '36', label: 'Yes: n = 36, because 6 × 6 = 36.' },
    { id: '6', label: 'Yes: n = 6, because √n = 6.' },
    { id: '12', label: 'Yes: n = 12, because 6 × 2 = 12.' },
  ], '36', 'Yes. √n = 6 means n = 6² = 36. Squaring undoes the square root, and 36 is an integer.', 'D-P-06', 'transfer'),
  {
    id: 'D-P-06', microSkillId: 'whole-values', phase: 'transfer', teachingIntent: 'Generate a non-integer value strictly between two consecutive integers.',
    content: { title: 'Give a non-integer between 6 and 7.' }, component: visual({ kind: 'openInterval' }),
    interaction: { type: 'numericInput', acceptanceRule: 'openInterval', lowerBound: 6, upperBound: 7, correctAnswer: 6.5, displayAnswer: 'any number strictly between 6 and 7, for example 6.5', placeholder: 'Decimal or fraction' },
    feedback: {
      correct: { message: 'That’s right.', evidence: 'Your value lies strictly between 6 and 7, so it is a non-integer. Many answers work, including 6.2, 6.5 and 13/2.' },
      incorrect: { message: 'Here’s an example.', evidence: '6.5 works: 6 < 6.5 < 7. Any value strictly between these ticks is a non-integer. The endpoints 6 and 7 do not count.' },
    },
    transition: { onCorrect: 'D-P-07', onIncorrect: 'D-P-07' }, completionCondition: 'See feedback, then Continue regardless of correctness.',
  },
  question('D-P-07', 'Is Maya correct? Choose the reason.', { kind: 'midpointClaim' }, [
    { id: 'always', label: 'Yes: halfway between 4 and 5 is 4.5.' },
    { id: 'counterexample', label: 'No: halfway between 2 and 8 is 5.' },
    { id: 'never', label: 'No: a midpoint is never a non-integer.' },
  ], 'counterexample', 'Maya is not correct. Halfway between 2 and 8 is (2 + 8) ÷ 2 = 5, an integer. One counterexample disproves “always”. Between neighbouring integers, such as 4 and 5, the midpoint is a non-integer.', 'L1-F01', 'mastery'),

]
const sharedStart = numberTypesLesson.states.findIndex(state => state.id === 'L1-F01')
if (sharedStart < 0) throw new Error('Variant D needs L1-F01.')
export const variantDLesson: LessonDefinition = { ...numberTypesLesson, id: 'L001-D', states: [...variantDOpeningStates, ...numberTypesLesson.states.slice(sharedStart)] }
export const variantDMicroSkillLabels: Partial<Record<MicroSkillId, string>> = { ...microSkillLabels, 'whole-values': 'Integers & non-integers' }
