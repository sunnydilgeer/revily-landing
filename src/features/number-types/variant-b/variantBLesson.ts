import { withLessonExplanation } from '../lessonExplanations'
import { numberTypesLesson } from '../numberTypesLesson'
import type { LearningState, LessonDefinition, MicroSkillId } from '../types'

function continueState(state: Omit<LearningState, 'interaction' | 'completionCondition'>): LearningState {
  return {
    ...state,
    interaction: { type: 'continue' },
    completionCondition: 'Learner studies the mathematical relationship and continues.',
  }
}

const openingStates: LearningState[] = [
  {
    id: 'B-I-H01', microSkillId: 'whole-values', phase: 'hook',
    teachingIntent: 'Surface the boundary between whole numbers and the larger integer set.',
    content: { title: '', prompt: 'Which value is an integer but not a whole number?' },
    component: { type: 'nestedNumberSets', props: { revealPlacementsOnAnswer: true, tokens: [
      { label: '−3', region: 'integer-only' }, { label: '0', region: 'whole' },
      { label: '4', region: 'whole' }, { label: '2.5', region: 'rational-non-integer' },
    ] } },
    interaction: { type: 'select', options: [
      { id: '-3', label: '−3' },
      { id: '0', label: '0', misconceptionId: 'zero-not-whole-boundary', rationale: 'Learner recognises zero as an integer but misses that it is also a whole number.', feedback: 'Zero belongs to both sets, so it is not an integer outside the whole numbers.' },
      { id: '4', label: '4', misconceptionId: 'positive-integer-boundary', rationale: 'Learner identifies an integer without checking whether it is also whole.', feedback: 'Four is an integer, but it is also a whole number. We need the value that sits outside the whole-number set.' },
      { id: '2.5', label: '2.5', misconceptionId: 'decimal-as-integer', rationale: 'Learner treats any positive number as an integer.', feedback: 'An integer has no fractional or decimal part, so 2.5 is outside both sets.' },
    ], correctAnswer: '-3' },
    feedback: { correct: { message: 'Exactly. −3 is an integer, but it is not a whole number.', evidence: 'Whole numbers begin at zero; integers extend into the negatives.' }, incorrect: { message: 'Look for a negative value with no decimal or fractional part.', evidence: 'The accepted answer is −3.' } },
    transition: { onCorrect: 'B-I-W01' }, completionCondition: 'Learner identifies a negative integer as outside the whole-number subset.',
  },
  continueState({
    id: 'B-I-W01', microSkillId: 'whole-values', phase: 'teach',
    teachingIntent: 'Define whole numbers using a one-direction number line.',
    content: { eyebrow: 'Micro-skill 1', title: 'Whole numbers start at zero', body: 'Whole numbers are zero and the positive integers. They have no negative, decimal or fractional part.', prompt: 'The set starts at 0 and continues forever to the right.' },
    component: { type: 'setNumberLine', props: { mode: 'whole', values: [0, 1, 2, 3, 4, 5], excluded: ['−2', '½', '2.1'] } },
    transition: { onComplete: 'B-I-W02' },
  }),
  continueState({
    id: 'B-I-W02', microSkillId: 'whole-values', phase: 'teach',
    teachingIntent: 'Expand the existing whole-number line leftwards to form the integers.',
    content: { title: 'Integers extend in both directions', body: 'Integers contain every whole number and all the negative whole-number values too.', prompt: 'Extending left adds −1, −2, −3 and so on.' },
    component: { type: 'setNumberLine', props: { mode: 'integer', values: [-4, -3, -2, -1, 0, 1, 2, 3, 4], excluded: ['½', '2.1'] } },
    transition: { onComplete: 'B-I-W03' },
  }),
  continueState({
    id: 'B-I-W03', microSkillId: 'whole-values', phase: 'teach',
    teachingIntent: 'Make the subset relationship explicit using one original nested-set model.',
    content: { title: 'One set fits inside the other', body: 'Every whole number is an integer. Some integers—the negative ones—are not whole numbers.' },
    component: { type: 'nestedNumberSets', props: { tokens: [
      { label: '−4', region: 'integer-only' }, { label: '−1', region: 'integer-only' },
      { label: '0', region: 'whole' }, { label: '3', region: 'whole' },
      { label: '½', region: 'rational-non-integer' }, { label: '2.1', region: 'rational-non-integer' },
      { label: 'π', region: 'irrational' }, { label: '√2', region: 'irrational' },
    ] } },
    transition: { onComplete: 'B-I-G01' },
  }),
  {
    id: 'B-I-G01', microSkillId: 'whole-values', phase: 'guided',
    teachingIntent: 'Distinguish negative integers from whole numbers and non-integers.',
    content: { title: 'Which value is an integer but not a whole number?' },
    component: { type: 'nestedNumberSets', props: { revealPlacementsOnAnswer: true, tokens: [
      { label: '−6', region: 'integer-only' }, { label: '0', region: 'whole' },
      { label: '8', region: 'whole' }, { label: '¾', region: 'rational-non-integer' }, { label: '−2.1', region: 'rational-non-integer' },
    ] } },
    interaction: { type: 'select', options: [
      { id: '-6', label: '−6' },
      { id: '0', label: '0', misconceptionId: 'zero-not-whole-boundary', rationale: 'Learner forgets that zero is included in the whole numbers.', feedback: 'Zero sits inside the whole-number set, so it belongs to both categories.' },
      { id: '8', label: '8', misconceptionId: 'positive-integer-boundary', rationale: 'Learner identifies an integer but does not exclude whole numbers.', feedback: 'Eight is both whole and integer. We need an integer that is outside the whole-number set.' },
      { id: '3/4', label: '¾', misconceptionId: 'fraction-as-integer', rationale: 'Learner treats any number as an integer.', feedback: 'Three quarters has a fractional part, so it is not an integer.' },
      { id: '-2.1', label: '−2.1', misconceptionId: 'negative-means-integer', rationale: 'Learner assumes every negative number is an integer.', feedback: 'Being negative is not enough: −2.1 still has a decimal part, so it is not an integer.' },
    ], correctAnswer: '-6' },
    feedback: { correct: { message: 'Correct. −6 is an integer but not a whole number.', evidence: 'It is negative and has no decimal or fractional part.' }, incorrect: { message: 'The value must be negative and have no decimal or fractional part.', evidence: 'The accepted answer is −6.' } },
    transition: { onCorrect: 'B-I-D01' }, completionCondition: 'Learner selects the negative integer.',
  },
  {
    id: 'B-I-D01', microSkillId: 'whole-values', phase: 'independent',
    teachingIntent: 'Classify expressions by resolved value within the nested number sets.',
    content: { title: 'Which values are whole numbers?' },
    component: { type: 'nestedNumberSets', props: { revealPlacementsOnAnswer: true, tokens: [
      { label: '−4', region: 'integer-only' }, { label: '0', region: 'whole' },
      { label: '8 ÷ 2', region: 'whole' }, { label: '√9', region: 'whole' },
      { label: '2.1', region: 'rational-non-integer' }, { label: '√2', region: 'irrational' },
    ] } },
    interaction: { type: 'multiSelect', options: [
      { id: '-4', label: '−4', misconceptionId: 'negative-whole-number', rationale: 'Learner conflates whole numbers with all integers.' },
      { id: '0', label: '0' },
      { id: '8/2', label: '8 ÷ 2' },
      { id: 'sqrt9', label: '√9' },
      { id: '2.1', label: '2.1', misconceptionId: 'decimal-whole-number', rationale: 'Learner ignores the decimal part.' },
      { id: 'sqrt2', label: '√2', misconceptionId: 'root-notation-whole-number', rationale: 'Learner assumes every square root resolves to an integer.' },
    ], correctAnswer: ['0', '8/2', 'sqrt9'] },
    feedback: { correct: { message: 'Secure. You resolved each value before placing it.', evidence: '0, 8 ÷ 2 = 4 and √9 = 3 are whole numbers.' }, incorrect: { message: 'Resolve each expression, then check whether the value is zero or a positive integer.', evidence: 'The whole numbers are 0, 8 ÷ 2 and √9.' } },
    transition: { onCorrect: 'L1-F01' }, completionCondition: 'Learner selects every whole-number value.',
  },
]

const firstSharedState = numberTypesLesson.states.findIndex((state) => state.id === 'L1-F01')

export const variantBLesson: LessonDefinition = {
  ...numberTypesLesson,
  id: 'L001-B',
  states: [...openingStates.map(withLessonExplanation), ...numberTypesLesson.states.slice(firstSharedState)],
}

export const variantBMicroSkillLabels: Partial<Record<MicroSkillId, string>> = {
  'whole-values': 'The number family',
  'factors-multiples': 'Factors & multiples',
  primes: 'Prime numbers',
  'squares-cubes': 'Squares & cubes',
  'rational-irrational': 'Rational or irrational?',
  mixed: 'Mixed challenge',
}
