import type { LearningState, LessonDefinition, MicroSkillId } from './types'

const integerOptions = [
  { id: 'integer', label: 'Integer' },
  { id: 'not-integer', label: 'Not an integer' },
]

const trueFalseOptions = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
]

function continueState(
  state: Omit<LearningState, 'interaction' | 'completionCondition'> & { completionCondition?: string },
): LearningState {
  return {
    ...state,
    interaction: { type: 'continue' },
    completionCondition: state.completionCondition ?? 'Learner views the mathematical change and continues.',
  }
}

const states: LearningState[] = [
  {
    id: 'L1-H01', microSkillId: 'whole-values', phase: 'hook',
    teachingIntent: 'Create curiosity about classifying values without front-loading terminology.',
    content: { title: '', prompt: 'Select all the whole numbers.' },
    component: { type: 'numberLine', props: { min: -3, max: 7, revealMarkersOnAnswer: true, hideUntilAnswer: true, markers: [
      { value: 7, label: '7', kind: 'integer' }, { value: 0.5, label: '0.5', kind: 'between' },
      { value: -3, label: '−3', kind: 'integer' }, { value: 3, label: '6 ÷ 2', kind: 'resolved' },
    ] } },
    interaction: { type: 'multiSelect', options: [
      { id: '7', label: '7' }, { id: '0.5', label: '0.5' }, { id: '-3', label: '−3' }, { id: '6/2', label: '6 ÷ 2' },
    ], correctAnswer: ['7', '-3', '6/2'] },
    feedback: {
      correct: { message: 'Exactly. 7, −3 and 6 ÷ 2 all have whole-number values.', evidence: '6 ÷ 2 resolves to 3.', visualAction: 'resolveExpressionThenPlot' },
      incorrect: { message: 'Look at each value, not just how it is written.', evidence: 'Work out 6 ÷ 2 before classifying it.' },
    },
    stateUpdate: { wholeValueConcept: true }, transition: { onCorrect: 'L1-I01' },
    completionCondition: 'Learner classifies the four values and sees the expression resolve.', analytics: { eventName: 'lesson_hook_attempt' },
  },
  continueState({
    id: 'L1-I01', microSkillId: 'whole-values', phase: 'teach',
    teachingIntent: 'Attach formal integer vocabulary to the number-line distinction.',
    content: { eyebrow: 'Micro-skill 1', title: 'Whole or not?', body: 'Whole-number values are integers. They include negative whole numbers, zero and positive whole numbers.', prompt: 'Notice where 1.5 sits.' },
    component: { type: 'numberLine', props: { min: -3, max: 3, markers: [
      { value: -3, label: '−3', kind: 'integer' }, { value: 0, label: '0', kind: 'integer' }, { value: 1.5, label: '1.5', kind: 'between' }, { value: 3, label: '3', kind: 'integer' },
    ] } }, transition: { onComplete: 'L1-I02' },
  }),
  {
    id: 'L1-I02', microSkillId: 'whole-values', phase: 'guided',
    teachingIntent: 'Quickly distinguish integers from values between integer ticks.',
    content: { title: 'Tap the integers', prompt: 'Select all the whole numbers.' },
    component: { type: 'numberLine', props: { min: -8, max: 19, revealMarkersOnAnswer: true, hideUntilAnswer: true, markers: [
      { value: -8, label: '−8', kind: 'integer' }, { value: 0, label: '0', kind: 'integer' }, { value: 2.4, label: '2.4', kind: 'between' }, { value: 19, label: '19', kind: 'integer' },
    ] } },
    interaction: { type: 'multiSelect', options: [
      { id: '-8', label: '−8' }, { id: '0', label: '0' }, { id: '2.4', label: '2.4' }, { id: '19', label: '19' },
    ], correctAnswer: ['-8', '0', '19'] },
    feedback: { correct: { message: 'Yes. Integers can be negative, zero or positive.' }, incorrect: { message: '2.4 sits between 2 and 3, so it is not an integer.', evidence: 'Whole-number values land exactly on integer ticks.' } },
    transition: { onCorrect: 'L1-I03' }, completionCondition: 'Learner selects −8, 0 and 19.', analytics: { misconceptionId: 'M002' },
  },
  {
    id: 'L1-I03', microSkillId: 'whole-values', phase: 'guided',
    teachingIntent: 'Classify an expression by its value rather than its appearance.',
    content: { title: 'Is 10 ÷ 2 an integer?' },
    component: { type: 'numberLine', props: { min: 0, max: 6, expression: '10 ÷ 2', revealMarkersOnAnswer: true, markers: [{ value: 5, label: '5', kind: 'resolved' }] } },
    interaction: { type: 'select', options: integerOptions, correctAnswer: 'integer' },
    feedback: {
      correct: { message: 'Yes. Classify the value, not its appearance.', evidence: '10 ÷ 2 = 5, and 5 is a whole number.', visualAction: 'resolveExpressionThenPlot' },
      incorrect: { message: 'Work out its value first.', evidence: 'Think of 10 objects shared into 2 equal groups.', visualAction: 'formEqualRows', followUpPrompt: 'What is 10 ÷ 2?' },
    },
    stateUpdate: { expressionClassificationSeen: true }, transition: { onCorrect: 'L1-I04' },
    completionCondition: 'Learner correctly identifies the resolved value as an integer.', analytics: { misconceptionId: 'M001' },
  },
  {
    id: 'L1-I04', microSkillId: 'whole-values', phase: 'independent',
    teachingIntent: 'Check integer classification across negatives, zero, division, pi and square-root forms.',
    content: { title: 'Integer check', prompt: 'Select every expression with an integer value.' },
    component: { type: 'classification', props: { value: '−4   ¾   6   0   −2.1   8 ÷ 2   π   √2   √9', resolvedValue: '8 ÷ 2 = 4   √9 = 3' } },
    interaction: { type: 'multiSelect', options: [
      { id: '-4', label: '−4' }, { id: '3/4', label: '¾' }, { id: '6', label: '6' }, { id: '0', label: '0' }, { id: '-2.1', label: '−2.1' }, { id: '8/2', label: '8 ÷ 2' },
      { id: 'pi', label: 'π' }, { id: 'sqrt2', label: '√2' }, { id: 'sqrt9', label: '√9' },
    ], correctAnswer: ['-4', '6', '0', '8/2', 'sqrt9'] },
    feedback: { correct: { message: 'Secure. You checked the values before classifying them.', evidence: '−4, 6, 0, 8 ÷ 2 = 4 and √9 = 3 are integers.' } },
    transition: { onCorrect: 'L1-F01' }, completionCondition: 'Learner selects all four integer values.', analytics: { misconceptionId: 'M001' },
  },
  continueState({
    id: 'L1-F01', microSkillId: 'factors-multiples', phase: 'teach',
    teachingIntent: 'Establish factors as exact grouping dimensions.',
    content: { eyebrow: 'Micro-skill 2', title: 'Dividers or times table?', body: 'Every complete rectangular arrangement gives a factor pair.', prompt: 'See how all 12 counters can form different equal rows.' },
    component: { type: 'arrayBuilder', props: { total: 12, arrangements: [{ rows: 1, columns: 12 }, { rows: 2, columns: 6 }, { rows: 3, columns: 4 }], mode: 'factors', activeArrangement: 2 } },
    transition: { onComplete: 'L1-F02' },
  }),
  continueState({
    id: 'L1-F02', microSkillId: 'factors-multiples', phase: 'teach',
    teachingIntent: 'Name the factor rule after visual experience.',
    content: { title: 'Factors divide exactly', body: 'A factor divides into a number with no remainder.', prompt: 'The complete arrangements reveal every factor of 12.' },
    component: { type: 'factorPairs', props: { target: 12, pairs: [[1, 12], [2, 6], [3, 4]], revealCount: 3 } },
    transition: { onComplete: 'L1-F03' },
  }),
  {
    id: 'L1-F03', microSkillId: 'factors-multiples', phase: 'guided',
    teachingIntent: 'Complete factor pairs and form the complete factor set.',
    content: { title: 'Complete the pair', prompt: 'What number completes 4 × ? = 20?' },
    component: { type: 'equation', props: { expression: '4 × ? = 20', resolvedExpression: '4 × 5 = 20' } },
    interaction: { type: 'numericInput', correctAnswer: 5, acceptanceRule: 'numeric', placeholder: 'Missing factor', submitLabel: 'Complete the pair' },
    feedback: { correct: { message: 'Yes. 4 × 5 = 20.', evidence: 'The factors are 1, 2, 4, 5, 10 and 20.', visualAction: 'highlightFactorPair' }, incorrect: { message: 'Find how many groups of 4 fit exactly into 20.', evidence: '20 ÷ 4 gives the missing factor.' } },
    transition: { onCorrect: 'L1-M01' }, completionCondition: 'Learner enters 5.',
  },
  continueState({
    id: 'L1-M01', microSkillId: 'factors-multiples', phase: 'teach',
    teachingIntent: 'Build multiples as repeated additions and times-table steps.',
    content: { title: 'Multiples grow in equal steps', body: 'Multiples are the numbers in a number’s times table.', prompt: 'Follow five jumps of 7.' },
    component: { type: 'multipleStepper', props: { base: 7, count: 5 } }, transition: { onComplete: 'L1-M02' },
  }),
  {
    id: 'L1-M02', microSkillId: 'factors-multiples', phase: 'guided',
    teachingIntent: 'Describe one divisibility relationship in both directions.',
    content: { title: 'One relationship, two directions', prompt: 'Select every true statement.' },
    component: { type: 'classification', props: { value: '5 × 4 = 20', properties: ['5 divides 20 exactly', '20 appears in the 5 times table'] } },
    interaction: { type: 'multiSelect', options: [
      { id: 'factor', label: '5 is a factor of 20' }, { id: 'multiple', label: '20 is a multiple of 5' }, { id: 'reverse-factor', label: '20 is a factor of 5' },
    ], correctAnswer: ['factor', 'multiple'] },
    feedback: { correct: { message: 'Both are true.', evidence: '5 is a factor of 20; 20 is a multiple of 5.' }, incorrect: { message: 'Read the equation in both directions.', evidence: '20 ÷ 5 = 4 and 5 × 4 = 20.' } },
    transition: { onCorrect: 'L1-M03' }, completionCondition: 'Learner selects both equivalent relationship statements.',
  },
  {
    id: 'L1-M03', microSkillId: 'factors-multiples', phase: 'independent',
    teachingIntent: 'Check that a number is included in its own positive multiples.',
    content: { title: 'Which are multiples of 6?', prompt: 'Select every correct value.' },
    component: { type: 'multipleStepper', props: { base: 6, count: 3, revealOnAnswer: true } },
    interaction: { type: 'multiSelect', options: [{ id: '3', label: '3' }, { id: '6', label: '6' }, { id: '12', label: '12' }, { id: '18', label: '18' }], correctAnswer: ['6', '12', '18'] },
    feedback: { correct: { message: 'Correct. 6, 12 and 18 are in the 6 times table.' }, incorrect: { message: 'Include the first step.', evidence: '6 × 1 = 6, so 6 is its own first positive multiple.' } },
    transition: { onCorrect: 'L1-M04' }, completionCondition: 'Learner includes 6, 12 and 18.', analytics: { misconceptionId: 'M004' },
  },
  {
    id: 'L1-M04', microSkillId: 'factors-multiples', phase: 'independent',
    teachingIntent: 'Reinforce that factor and multiple properties may overlap.',
    content: { title: 'What is true about 8?', prompt: 'Select every true relationship.' },
    component: { type: 'classification', props: { value: '8', properties: ['1 × 8 = 8', '8 × 1 = 8'] } },
    interaction: { type: 'multiSelect', options: [
      { id: 'factor-self', label: '8 is a factor of 8' }, { id: 'multiple-self', label: '8 is a multiple of 8' }, { id: 'factor-16', label: '8 is a factor of 16' }, { id: 'multiple-4', label: '8 is a multiple of 4' },
    ], correctAnswer: ['factor-self', 'multiple-self', 'factor-16', 'multiple-4'] },
    feedback: { correct: { message: 'All four statements are true.', evidence: 'One number can satisfy several relationships at once.' }, incorrect: { message: 'Test each statement with exact division or multiplication.' } },
    transition: { onCorrect: 'L1-P01' }, completionCondition: 'Learner recognises all four relationships as true.',
  },
  continueState({
    id: 'L1-P01', microSkillId: 'primes', phase: 'teach',
    teachingIntent: 'Introduce prime numbers through their factor list.',
    content: { eyebrow: 'Micro-skill 3', title: 'What makes a number prime?', body: 'A prime number is a positive integer greater than 1 with exactly two positive factors: 1 and itself.', prompt: 'The only factors of 7 are 1 and 7.' },
    component: { type: 'factorPairs', props: { target: 7, pairs: [[1, 7]], revealCount: 1 } },
    transition: { onComplete: 'L1-P02' },
  }),
  {
    id: 'L1-P02', microSkillId: 'primes', phase: 'guided',
    teachingIntent: 'Use a factor list as evidence that a number is not prime.',
    content: { title: 'Is 4 prime?', prompt: 'Choose the best answer.' },
    component: { type: 'factorPairs', props: { target: 4, pairs: [[1, 4], [2, 2]], revealCount: 2 } },
    interaction: { type: 'select', options: trueFalseOptions, correctAnswer: 'no' },
    feedback: { correct: { message: 'No. 4 is not prime.', evidence: 'Its factors are 1, 2 and 4—more than two.' }, incorrect: { message: 'Four has the extra factor 2.', evidence: 'Prime numbers have exactly two positive factors.' } },
    transition: { onCorrect: 'L1-P03' }, completionCondition: 'Learner rejects 4 as prime.',
  },
  {
    id: 'L1-P03', microSkillId: 'primes', phase: 'guided',
    teachingIntent: 'Correct the misconception that 1 is prime.',
    content: { title: 'Why 1 is not prime', body: 'A prime number needs exactly two different positive factors.', prompt: 'Is 1 prime?' },
    component: { type: 'classification', props: { value: '1', resolvedValue: 'Only one positive factor' } },
    interaction: { type: 'select', options: trueFalseOptions, correctAnswer: 'no' },
    feedback: { correct: { message: 'Correct. 1 is not prime.', evidence: 'A prime needs two different factors, but 1 has only one.' }, incorrect: { message: 'A prime needs two different factors.', evidence: 'The number 1 has only one positive factor.' } },
    transition: { onCorrect: 'L1-P04' }, completionCondition: 'Learner identifies that 1 is not prime.', analytics: { misconceptionId: 'M006' },
  },
  {
    id: 'L1-P04', microSkillId: 'primes', phase: 'guided',
    teachingIntent: 'Establish 2 as the only even prime.',
    content: { title: 'The only even prime', prompt: 'Which number is prime?' },
    component: { type: 'factorPairs', props: { target: 2, pairs: [[1, 2]], revealCount: 1 } },
    interaction: { type: 'select', options: [{ id: '2', label: '2' }, { id: '4', label: '4' }, { id: '6', label: '6' }, { id: '8', label: '8' }], correctAnswer: '2' },
    feedback: { correct: { message: 'Yes. 2 has exactly two factors: 1 and 2.' }, incorrect: { message: 'Every other even number has 2 as an extra factor.' } },
    transition: { onCorrect: 'L1-P05' }, completionCondition: 'Learner selects 2.',
  },
  {
    id: 'L1-P05', microSkillId: 'primes', phase: 'independent',
    teachingIntent: 'Apply the exact-two-factors rule across common traps.',
    content: { title: 'Prime check', prompt: 'Select every prime number.' },
    component: { type: 'classification', props: { value: '2   3   9   11   15   17' } },
    interaction: { type: 'multiSelect', options: ['2', '3', '9', '11', '15', '17'].map((label) => ({ id: label, label })), correctAnswer: ['2', '3', '11', '17'] },
    feedback: { correct: { message: 'Correct. 2, 3, 11 and 17 each have exactly two factors.' }, incorrect: { message: 'Look for an extra factor.', evidence: '9 = 3 × 3 and 15 = 3 × 5.' } },
    transition: { onCorrect: 'L1-S01' }, completionCondition: 'Learner selects 2, 3, 11 and 17.', analytics: { misconceptionId: 'M005' },
  },
  continueState({
    id: 'L1-S01', microSkillId: 'squares-cubes', phase: 'teach',
    teachingIntent: 'Build a square number from a square array.',
    content: { eyebrow: 'Micro-skill 4', title: 'Build a square', body: 'A square number is made by multiplying an integer by itself.', prompt: 'Three rows of three make 9.' },
    component: { type: 'powerStructure', props: { base: 3, power: 2 } }, transition: { onComplete: 'L1-S02' },
  }),
  continueState({
    id: 'L1-S02', microSkillId: 'squares-cubes', phase: 'teach',
    teachingIntent: 'Generate the first five squares through structure.',
    content: { title: 'Square numbers grow as square arrays', prompt: 'The side length changes; the rows and columns stay equal.' },
    component: { type: 'arrayBuilder', props: { total: 25, arrangements: [{ rows: 1, columns: 1 }, { rows: 2, columns: 2 }, { rows: 3, columns: 3 }, { rows: 4, columns: 4 }, { rows: 5, columns: 5 }], mode: 'square', activeArrangement: 4 } },
    transition: { onComplete: 'L1-S03' },
  }),
  {
    id: 'L1-S03', microSkillId: 'squares-cubes', phase: 'guided',
    teachingIntent: 'Recognise square numbers by equal-factor structure.',
    content: { title: 'Which are square numbers?', prompt: 'Select every square number.' },
    component: { type: 'classification', props: { value: '6   9   12   16   20   25', properties: ['3 × 3', '4 × 4', '5 × 5'] } },
    interaction: { type: 'multiSelect', options: ['6', '9', '12', '16', '20', '25'].map((label) => ({ id: label, label })), correctAnswer: ['9', '16', '25'] },
    feedback: { correct: { message: 'Yes. 9, 16 and 25 make square arrays.' }, incorrect: { message: 'Look for a number made by multiplying an integer by itself.', evidence: '3 × 3 = 9, 4 × 4 = 16, 5 × 5 = 25.' } },
    transition: { onCorrect: 'L1-C01' }, completionCondition: 'Learner selects 9, 16 and 25.', analytics: { misconceptionId: 'M007' },
  },
  continueState({
    id: 'L1-C01', microSkillId: 'squares-cubes', phase: 'teach',
    teachingIntent: 'Distinguish two equal factors from three equal factors.',
    content: { title: 'Square versus cube', body: 'A cube number is made by multiplying an integer by itself three times.', prompt: 'Compare 2 × 2 with 2 × 2 × 2.' },
    component: { type: 'powerStructure', props: { base: 2, power: 3, comparePower: 2 } }, transition: { onComplete: 'L1-C02' },
  }),
  {
    id: 'L1-C02', microSkillId: 'squares-cubes', phase: 'guided',
    teachingIntent: 'Predict a cube from repeated multiplication.',
    content: { title: 'Predict the next cube', prompt: 'What is 3 × 3 × 3?' },
    component: { type: 'powerStructure', props: { base: 3, power: 3, revealResultOnAnswer: true } },
    interaction: { type: 'numericInput', correctAnswer: 27, acceptanceRule: 'numeric', placeholder: 'Your answer', submitLabel: 'Build the cube' },
    feedback: { correct: { message: 'Correct. 3 × 3 × 3 = 27.', visualAction: 'addCubeLayer' }, incorrect: { message: 'Multiply 3 × 3 first, then multiply the result by 3.', evidence: '9 × 3 = 27.' } },
    transition: { onCorrect: 'L1-C03' }, completionCondition: 'Learner enters 27.',
  },
  {
    id: 'L1-C03', microSkillId: 'squares-cubes', phase: 'independent',
    teachingIntent: 'Classify squares and cubes while allowing overlap.',
    content: { title: 'What is true about 64?', prompt: 'Select every true statement.' },
    component: { type: 'powerStructure', props: { base: 4, power: 3, comparePower: 2, compareBase: 8 } },
    interaction: { type: 'multiSelect', options: [
      { id: 'square', label: '64 is square: 8 × 8' }, { id: 'cube', label: '64 is cube: 4 × 4 × 4' }, { id: 'prime', label: '64 is prime' },
    ], correctAnswer: ['square', 'cube'] },
    feedback: { correct: { message: 'Exactly. 64 is both square and cube.', evidence: '8 × 8 = 64 and 4 × 4 × 4 = 64.' }, incorrect: { message: 'A number can belong to both families.', evidence: 'Test both repeated-multiplication structures.' } },
    transition: { onCorrect: 'L1-R01' }, completionCondition: 'Learner recognises both properties.',
  },
  continueState({
    id: 'L1-R01', microSkillId: 'rational-irrational', phase: 'teach',
    teachingIntent: 'Introduce rational numbers through exact equivalent forms.',
    content: { eyebrow: 'Micro-skill 5', title: 'Can it be written as a fraction?', body: 'A rational number can be written exactly as a fraction of two integers.', prompt: 'One half and 0.5 are the same exact value.' },
    component: { type: 'decimalPattern', props: { value: '0.5', kind: 'terminating', fraction: '1/2', label: 'Rational' } }, transition: { onComplete: 'L1-R02' },
  }),
  {
    id: 'L1-R02', microSkillId: 'rational-irrational', phase: 'guided',
    teachingIntent: 'Show that integers are also rational.',
    content: { title: 'Integers are rational too', prompt: 'Complete 5 = 5 ÷ ?' },
    component: { type: 'classification', props: { value: '5 = 5/□', properties: ['same exact value'] } },
    interaction: { type: 'numericInput', correctAnswer: 1, acceptanceRule: 'numeric', placeholder: 'Denominator', submitLabel: 'Complete the fraction' },
    feedback: { correct: { message: 'Yes. 5 = 5/1, so 5 is rational.' }, incorrect: { message: 'What can you divide 5 by without changing its value?', evidence: 'Any integer n can be written as n/1.' } },
    transition: { onCorrect: 'L1-R03' }, completionCondition: 'Learner enters 1.',
  },
  {
    id: 'L1-R03', microSkillId: 'rational-irrational', phase: 'guided',
    teachingIntent: 'Connect a terminating decimal to an exact fraction.',
    content: { title: 'A decimal that stops', prompt: 'Is 0.25 rational?' },
    component: { type: 'decimalPattern', props: { value: '0.25', kind: 'terminating', fraction: '25/100 = 1/4', revealFractionOnAnswer: true } },
    interaction: { type: 'select', options: trueFalseOptions, correctAnswer: 'yes' },
    feedback: { correct: { message: 'Yes. 0.25 is rational.', evidence: '0.25 = 25/100 = 1/4.' }, incorrect: { message: 'A decimal can still have an exact fraction.', evidence: '25 hundredths is 25/100.' } },
    transition: { onCorrect: 'L1-R04' }, completionCondition: 'Learner classifies 0.25 as rational.',
  },
  {
    id: 'L1-R04', microSkillId: 'rational-irrational', phase: 'guided',
    teachingIntent: 'Recognise a recurring decimal as rational.',
    content: { title: 'A decimal that repeats', prompt: 'What do you notice about 0.333…?' },
    component: { type: 'decimalPattern', props: { value: '0.333333…', kind: 'recurring', fraction: '1/3', revealFractionOnAnswer: true } },
    interaction: { type: 'select', options: [{ id: 'stops', label: 'It stops' }, { id: 'repeats', label: 'A fixed pattern repeats' }, { id: 'random', label: 'The digits are random' }], correctAnswer: 'repeats' },
    feedback: { correct: { message: 'Right. The repeating decimal is rational.', evidence: '0.333… = 1/3.', visualAction: 'revealRecurringPattern' }, incorrect: { message: 'Track the digit after the decimal point.', evidence: 'The same 3 repeats forever.' } },
    transition: { onCorrect: 'L1-IR01' }, completionCondition: 'Learner identifies the repeating pattern.', analytics: { misconceptionId: 'M009' },
  },
  continueState({
    id: 'L1-IR01', microSkillId: 'rational-irrational', phase: 'teach',
    teachingIntent: 'Contrast an exact square root with an irrational root.',
    content: { title: 'Exact root or never-ending decimal?', body: 'An irrational number cannot be written exactly as a fraction of two integers. Its decimal never terminates or repeats a fixed pattern.', prompt: 'Compare √9 = 3 with √2 ≈ 1.414213…' },
    component: { type: 'decimalPattern', props: { value: '1.41421356237…', kind: 'nonRecurring', label: '√2 is irrational' } }, transition: { onComplete: 'L1-IR02' },
  }),
  {
    id: 'L1-IR02', microSkillId: 'rational-irrational', phase: 'guided',
    teachingIntent: 'Recognise pi as non-terminating and non-recurring without calling it random.',
    content: { title: 'Pi keeps going', prompt: 'Does 3.1415926535… terminate or repeat a fixed block?' },
    component: { type: 'decimalPattern', props: { value: '3.1415926535…', kind: 'nonRecurring', label: 'π' } },
    interaction: { type: 'select', options: [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' }], correctAnswer: 'no' },
    feedback: { correct: { message: 'Correct. π is irrational.', evidence: 'Its decimal neither terminates nor repeats a fixed pattern.' }, incorrect: { message: 'No fixed block repeats in the digits shown.', evidence: 'The ellipsis means the decimal continues.' } },
    transition: { onCorrect: 'L1-IR03' }, completionCondition: 'Learner identifies pi as non-terminating and non-recurring.',
  },
  {
    id: 'L1-IR03', microSkillId: 'rational-irrational', phase: 'independent',
    teachingIntent: 'Correct the misconception that every square root is irrational.',
    content: { title: 'The square-root trap', prompt: 'Which value is irrational?' },
    component: { type: 'classification', props: { value: '√4   √5   √9   √16', resolvedValue: '√4 = 2   √9 = 3   √16 = 4' } },
    interaction: { type: 'select', options: [
      { id: 'sqrt4', label: '√4' }, { id: 'sqrt5', label: '√5' }, { id: 'sqrt9', label: '√9' }, { id: 'sqrt16', label: '√16' },
    ], correctAnswer: 'sqrt5' },
    feedback: { correct: { message: 'Yes. Only √5 is irrational.', evidence: 'The other roots simplify to integers.' }, incorrect: { message: 'Evaluate roots of perfect squares first.', evidence: 'A square-root sign does not automatically mean irrational.' } },
    transition: { onCorrect: 'L1-X01' }, completionCondition: 'Learner selects only √5.', analytics: { misconceptionId: 'M008' },
  },
  ...mixedStates(),
  {
    id: 'L1-T01', microSkillId: 'mixed', phase: 'transfer',
    teachingIntent: 'Apply number properties to examination-style selection.',
    content: { eyebrow: 'GCSE transfer', title: 'Choose from the list', prompt: 'From 3, 8, 11, 16 and 27, select a prime number.' },
    component: { type: 'classification', props: { value: '3   8   11   16   27' } },
    interaction: { type: 'select', options: ['3', '8', '11', '16', '27'].map((label) => ({ id: label, label })), correctAnswer: ['3', '11'], acceptanceRule: 'oneOf' },
    feedback: { correct: { message: 'Correct. Both 3 and 11 are prime.', evidence: 'The selected number has exactly two positive factors.' }, incorrect: { message: 'Look for a number with exactly two positive factors.', evidence: 'Both 3 and 11 are valid choices.' } },
    transition: { onCorrect: 'L1-T02' }, completionCondition: 'Learner selects an accepted prime.',
  },
  {
    id: 'L1-T02', microSkillId: 'mixed', phase: 'transfer',
    teachingIntent: 'Recall a complete factor list using factor pairs.',
    content: { title: 'Write all the factors of 18', prompt: 'Enter the complete list. Order does not matter.' },
    component: { type: 'factorPairs', props: { target: 18, pairs: [[1, 18], [2, 9], [3, 6]], revealCount: 0 } },
    interaction: { type: 'numericInput', correctAnswer: [1, 2, 3, 6, 9, 18], acceptanceRule: 'unorderedSet', placeholder: 'e.g. 1, 2, 3', submitLabel: 'Check factors' },
    feedback: { correct: { message: 'Complete. You found every factor of 18.' }, incorrect: { message: 'Build factor pairs until they repeat backwards.', evidence: 'Start with 1 × 18, then test 2 and 3.' } },
    transition: { onCorrect: 'L1-T03' }, completionCondition: 'Learner supplies the complete factor set.',
  },
  {
    id: 'L1-T03', microSkillId: 'mixed', phase: 'mastery',
    teachingIntent: 'End with the transferable classification habit.',
    content: { eyebrow: 'Exit mastery', title: 'Use evidence, not appearance', prompt: 'Which statements about 25 are true?' },
    component: { type: 'classification', props: { value: '25', properties: ['5 × 5', '25 = 25/1', '5 × 5 = 25', '100 ÷ 25 = 4'] } },
    interaction: { type: 'multiSelect', options: [
      { id: 'integer', label: 'Integer' }, { id: 'prime', label: 'Prime' }, { id: 'square', label: 'Square' }, { id: 'rational', label: 'Rational' }, { id: 'multiple5', label: 'Multiple of 5' }, { id: 'factor100', label: 'Factor of 100' },
    ], correctAnswer: ['integer', 'square', 'rational', 'multiple5', 'factor100'] },
    feedback: { correct: { message: 'Lesson complete. You classified 25 using evidence.', evidence: 'One number can have several properties.' }, incorrect: { message: 'Test every statement separately.', evidence: '25 = 5 × 5 = 25/1, and 100 ÷ 25 = 4.' } },
    transition: {}, completionCondition: 'Learner selects all five true properties.',
  },
]

function mixedStates(): LearningState[] {
  const items: Array<{ id: string; value: string; resolvedValue?: string; options: string[]; answer: string[]; evidence: string }> = [
    { id: 'L1-X01', value: '5', options: ['Integer', 'Prime', 'Square', 'Rational', 'Irrational'], answer: ['Integer', 'Prime', 'Rational'], evidence: '5 is whole, has factors 1 and 5, and equals 5/1.' },
    { id: 'L1-X02', value: '9', options: ['Integer', 'Prime', 'Square', 'Rational', 'Irrational'], answer: ['Integer', 'Square', 'Rational'], evidence: '9 = 3 × 3 and 9 = 9/1; it also has factor 3.' },
    { id: 'L1-X03', value: '0.5', options: ['Integer', 'Not integer', 'Rational', 'Irrational'], answer: ['Not integer', 'Rational'], evidence: '0.5 sits between integers and equals 1/2.' },
    { id: 'L1-X04', value: '√2', options: ['Integer', 'Not integer', 'Rational', 'Irrational'], answer: ['Not integer', 'Irrational'], evidence: '√2 is between 1 and 2 and cannot be written as an exact fraction.' },
    { id: 'L1-X05', value: '8 ÷ 2', resolvedValue: '8 ÷ 2 = 4', options: ['Integer', 'Prime', 'Square', 'Rational', 'Irrational'], answer: ['Integer', 'Square', 'Rational'], evidence: 'The value is 4: a whole number, 2 × 2, and 4/1.' },
  ]
  return items.map((item, index) => ({
    id: item.id,
    microSkillId: 'mixed' as MicroSkillId,
    phase: 'independent' as const,
    teachingIntent: 'Classify one number using every property that applies.',
    content: { eyebrow: `Mixed challenge ${index + 1} of ${items.length}`, title: `What is true about ${item.value}?`, prompt: 'Select every statement that is true.' },
    component: { type: 'classification' as const, props: { value: item.value, resolvedValue: item.resolvedValue } },
    interaction: { type: 'multiSelect' as const, options: item.options.map((label) => ({ id: label, label })), correctAnswer: item.answer },
    feedback: { correct: { message: 'Correct. Several properties can overlap.', evidence: item.evidence }, incorrect: { message: 'Check each rule separately.', evidence: item.evidence } },
    transition: { onCorrect: index === items.length - 1 ? 'L1-T01' : items[index + 1].id },
    completionCondition: 'Learner selects every applicable property.',
  }))
}

export const numberTypesLesson: LessonDefinition = {
  id: 'L001',
  title: 'Numbers',
  level: 'GCSE Foundation',
  goal: 'I can look at a number, identify what type of number it is, and explain why.',
  states,
}

export const microSkillLabels: Record<MicroSkillId, string> = {
  'whole-values': 'Whole or not?',
  'factors-multiples': 'Factors & multiples',
  primes: 'Prime numbers',
  'squares-cubes': 'Squares & cubes',
  'rational-irrational': 'Rational or irrational?',
  mixed: 'Mixed challenge',
}
