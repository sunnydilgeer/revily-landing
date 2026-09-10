import type { LearningState, LessonDefinition, MicroSkillId } from '../number-types/types'

function continueState(state: Omit<LearningState, 'interaction' | 'completionCondition'>): LearningState {
  return { ...state, interaction: { type: 'continue' }, completionCondition: 'Learner studies the place-value structure and continues.' }
}

const states: LearningState[] = [
  {
    id: 'L3-H01', microSkillId: 'digit-place-value', phase: 'hook',
    teachingIntent: 'Create a need for place-value language by contrasting identical digits in adjacent columns.',
    content: { title: 'The two 8s look the same. Are they worth the same?', prompt: 'Choose the true statement about 18,852,534.' },
    component: { type: 'placeValueChart', props: { value: '18,852,534', highlightIndices: [1, 2] } },
    interaction: { type: 'select', options: [
      { id: 'ten-times', label: 'The first 8 is worth ten times the second 8.' },
      { id: 'same', label: 'The two 8s have the same value.', errorMethod: 'Treats matching digit symbols as equal values.', misconceptionId: 'PV-DIGIT-EQUALS-VALUE', rationale: 'Position is not being used to determine value.', feedback: 'The digit is the same, but the columns differ. The first 8 is 8,000,000 and the second is 800,000.' },
      { id: 'reverse', label: 'The second 8 is worth ten times the first 8.', errorMethod: 'Reverses the left/right place-value direction.', misconceptionId: 'PV-DIRECTION-REVERSED', rationale: 'A leftward move is being treated as making a place smaller.', feedback: 'Moving one place left makes a place ten times larger, not smaller.' },
      { id: 'hundred-times', label: 'The first 8 is worth 100 times the second 8.', errorMethod: 'Counts two column moves instead of one.', misconceptionId: 'PV-COLUMN-COUNT', rationale: 'The factor of 10 is being applied twice.', feedback: 'The 8s are in adjacent columns, so their values differ by one factor of 10.' },
    ], correctAnswer: 'ten-times' },
    feedback: { correct: { message: 'Yes. The first 8 is 8,000,000 and the second is 800,000.', evidence: '8,000,000 ÷ 800,000 = 10.' }, incorrect: { message: 'The first 8 is worth ten times the second 8.' } },
    transition: { onComplete: 'L3-I01' }, completionCondition: 'Learner distinguishes identical digits from their positional values.', analytics: { eventName: 'lesson_3_hook_attempt' },
  },
  continueState({
    id: 'L3-I01', microSkillId: 'digit-place-value', phase: 'teach', teachingIntent: 'Establish digit, place and value as distinct ideas.',
    content: { eyebrow: 'Micro-skill 1', title: 'A digit’s position determines its value', body: 'A digit is the symbol. Its place is the column it occupies. Its value is the amount it represents.', prompt: 'Move one column left → the place is 10 times larger.' },
    component: { type: 'placeValueChart', props: { value: '18,852,534', interactive: true, initialSelectedIndex: 4, showReadout: true } }, transition: { onComplete: 'L3-I02' },
  }),
  {
    id: 'L3-I02', microSkillId: 'digit-place-value', phase: 'guided', teachingIntent: 'Diagnose confusion among digit, place and value.',
    content: { title: 'What is the value of the highlighted 5?', prompt: 'The highlighted digit is in 18,852,534.' },
    component: { type: 'placeValueChart', props: { value: '18,852,534', highlightIndices: [3], showReadout: true, revealReadoutOnAnswer: true } },
    interaction: { type: 'select', options: [
      { id: '50000', label: '50,000' },
      { id: '5', label: '5', errorMethod: 'Reports the digit instead of its value.', misconceptionId: 'PV-DIGIT-FOR-VALUE', rationale: 'Digit and value are conflated.', feedback: '5 is the digit. In the ten-thousands column it represents 5 × 10,000 = 50,000.' },
      { id: 'place', label: 'ten thousands', errorMethod: 'Reports the place name instead of the value.', misconceptionId: 'PV-PLACE-FOR-VALUE', rationale: 'Place and value are conflated.', feedback: 'Ten thousands names the place. The value of the digit there is 50,000.' },
      { id: '500', label: '500', errorMethod: 'Uses the other 5 in the number.', misconceptionId: 'PV-REPEATED-DIGIT', rationale: 'The matching symbol is tracked instead of the highlighted position.', feedback: 'There are two 5s. The highlighted one is in the ten-thousands column, so it is worth 50,000.' },
    ], correctAnswer: '50000' },
    feedback: { correct: { message: 'Correct. The digit is 5, its place is ten thousands, and its value is 50,000.' }, incorrect: { message: 'The accepted answer is 50,000.' } },
    transition: { onComplete: 'L3-I03' }, completionCondition: 'Learner identifies the highlighted digit value.',
  },
  {
    id: 'L3-I03', microSkillId: 'digit-place-value', phase: 'independent', teachingIntent: 'Check unaided value identification in a new large integer.',
    content: { title: 'In 72,406,981, what is the value of the digit 4?', prompt: 'Enter the value, not the place name.' },
    component: { type: 'placeValueChart', props: { value: '72,406,981', highlightIndices: [2], showReadout: true, revealReadoutOnAnswer: true, revealedEquation: '4 × 100,000 = 400,000' } },
    interaction: { type: 'numericInput', correctAnswer: 400000, acceptanceRule: 'normalisedNumber', displayAnswer: '400,000', placeholder: 'Enter the value' },
    feedback: { correct: { message: 'Correct. The 4 is in the hundred-thousands column.', evidence: '4 × 100,000 = 400,000.' }, incorrect: { message: 'The accepted answer is 400,000.', evidence: 'The digit 4 occupies the hundred-thousands column.' } },
    transition: { onComplete: 'L3-D01' }, completionCondition: 'Learner enters 400,000.', analytics: { eventName: 'lesson_3_integer_value' },
  },
  continueState({
    id: 'L3-D01', microSkillId: 'decimal-places', phase: 'teach', teachingIntent: 'Extend the fixed-column model to fractional places.',
    content: { eyebrow: 'Micro-skill 2', title: 'Places become ten times smaller to the right', body: 'The decimal point stays fixed between ones and tenths. Each step right divides the value of a place by 10.', prompt: 'ones → tenths → hundredths → thousandths' },
    component: { type: 'placeValueChart', props: { value: '39.41285', highlightIndices: [4], showReadout: true } }, transition: { onComplete: 'L3-D02' },
  }),
  {
    id: 'L3-D02', microSkillId: 'decimal-places', phase: 'guided', teachingIntent: 'Diagnose reciprocal-place errors and digit-for-value responses.',
    content: { title: 'What is the value of the highlighted 2 in 39.41285?', prompt: 'Choose the amount represented by the digit.' },
    component: { type: 'placeValueChart', props: { value: '39.41285', highlightIndices: [4], showReadout: true, revealReadoutOnAnswer: true } },
    interaction: { type: 'select', options: [
      { id: '0.002', label: '0.002' },
      { id: '2', label: '2', errorMethod: 'Reports the digit.', misconceptionId: 'PV-DIGIT-FOR-VALUE', rationale: 'Digit and fractional value are conflated.', feedback: '2 is the digit. In the thousandths column it represents two thousandths, 0.002.' },
      { id: '0.02', label: '0.02', errorMethod: 'Counts only two places right of the decimal point.', misconceptionId: 'PV-DECIMAL-OFF-BY-ONE', rationale: 'The digit is placed in hundredths.', feedback: '0.02 is two hundredths. The 2 is one column farther right, in thousandths.' },
      { id: '0.0002', label: '0.0002', errorMethod: 'Counts four places right of the decimal point.', misconceptionId: 'PV-DECIMAL-OFF-BY-ONE', rationale: 'The digit is placed in ten-thousandths.', feedback: '0.0002 is two ten-thousandths. The highlighted 2 is in the thousandths column.' },
    ], correctAnswer: '0.002' },
    feedback: { correct: { message: 'Correct. The 2 is three places right of the decimal point, so it represents 0.002.' }, incorrect: { message: 'The accepted answer is 0.002.' } },
    transition: { onComplete: 'L3-D03' }, completionCondition: 'Learner identifies two thousandths.',
  },
  {
    id: 'L3-D03', microSkillId: 'decimal-places', phase: 'independent', teachingIntent: 'Check value identification deeper into a decimal.',
    content: { title: 'In 7.06482, what value does the digit 8 represent?', prompt: 'Choose the value.' },
    component: { type: 'placeValueChart', props: { value: '7.06482', highlightIndices: [4], showReadout: true, revealReadoutOnAnswer: true, revealedEquation: '8 × 0.0001 = 0.0008' } },
    interaction: { type: 'select', options: [
      { id: '0.0008', label: '0.0008' },
      { id: '0.008', label: '0.008', errorMethod: 'Places 8 in thousandths.', misconceptionId: 'PV-DECIMAL-OFF-BY-ONE', rationale: 'Stops one column too early.', feedback: '0.008 is eight thousandths. The 8 is in the next column right: ten-thousandths.' },
      { id: '0.00008', label: '0.00008', errorMethod: 'Places 8 in hundred-thousandths.', misconceptionId: 'PV-DECIMAL-OFF-BY-ONE', rationale: 'Moves one column too far right.', feedback: '0.00008 is eight hundred-thousandths. The 8 is one column to the left of that.' },
      { id: '8000', label: '8,000', errorMethod: 'Applies the whole-number direction to decimal places.', misconceptionId: 'PV-DECIMAL-DIRECTION', rationale: 'Places right of the decimal are treated as whole-number places.', feedback: 'Places to the right of the decimal point are parts of one. Eight ten-thousandths is 0.0008.' },
    ], correctAnswer: '0.0008' },
    feedback: { correct: { message: 'Correct. The 8 is in the ten-thousandths column.', evidence: '8 × 0.0001 = 0.0008.' }, incorrect: { message: 'The accepted answer is 0.0008.' } },
    transition: { onComplete: 'L3-Z01' }, completionCondition: 'Learner identifies eight ten-thousandths.',
  },
  continueState({
    id: 'L3-Z01', microSkillId: 'placeholder-zeroes', phase: 'teach', teachingIntent: 'Show why zero must remain when a place contributes no quantity.',
    content: { eyebrow: 'Micro-skill 3', title: 'Zero keeps every other digit in its column', body: 'A zero adds no quantity in its own column, but it preserves the positions of the non-zero digits.', prompt: '5,000 + 70 + 0.4 = 5,070.4' },
    component: { type: 'placeValueChart', props: { value: '5,070.4', hideZeroesUntilReveal: true, equation: '5,000 + 70 + 0.4', revealedEquation: '5,000 + 70 + 0.4 = 5,070.4' } }, transition: { onComplete: 'L3-Z02' },
  }),
  {
    id: 'L3-Z02', microSkillId: 'placeholder-zeroes', phase: 'guided', teachingIntent: 'Diagnose omission and misplacement of placeholder zeroes.',
    content: { title: 'Which number has 6 ten-thousands, 2 hundreds, 4 ones and 3 hundredths?', prompt: 'Use zero in every place with no stated units.' },
    component: { type: 'placeValueChart', props: { value: '60,204.03', hideZeroesUntilReveal: true } },
    interaction: { type: 'select', options: [
      { id: '60204.03', label: '60,204.03' },
      { id: '6204.3', label: '6,204.3', errorMethod: 'Compresses the empty columns.', misconceptionId: 'PV-ZERO-OMITTED', rationale: 'Zero is treated as removable between non-zero digits.', feedback: 'The 6 must stay in ten-thousands and the 3 in hundredths. Empty columns still need zeros: 60,204.03.' },
      { id: '60240.3', label: '60,240.3', errorMethod: 'Places 4 in tens and 3 in tenths.', misconceptionId: 'PV-COLUMNS-SHIFTED', rationale: 'Digits are recombined by adjacency instead of named places.', feedback: 'The stated non-zero places are hundreds, ones and hundredths. Keep each digit in its named column.' },
      { id: '60204.30', label: '60,204.30', errorMethod: 'Places 3 in tenths.', misconceptionId: 'PV-DECIMAL-OFF-BY-ONE', rationale: 'Hundredths is confused with tenths.', feedback: '3 hundredths is 0.03. In 0.30, the 3 is in tenths.' },
    ], correctAnswer: '60204.03' },
    feedback: { correct: { message: 'Correct. Zeroes hold the thousands, tens and tenths columns.' }, incorrect: { message: 'The accepted answer is 60,204.03.' } },
    transition: { onComplete: 'L3-Z03' }, completionCondition: 'Learner places the digits and empty columns correctly.',
  },
  {
    id: 'L3-Z03', microSkillId: 'placeholder-zeroes', phase: 'independent', teachingIntent: 'Check recombination across several empty columns.',
    content: { title: 'Write 8,000 + 6 + 0.09 as one number.', prompt: 'Enter the complete number.' },
    component: { type: 'placeValueChart', props: { value: '8,006.09', hideZeroesUntilReveal: true, equation: '8,000 + 6 + 0.09', revealedEquation: '8,000 + 6 + 0.09 = 8,006.09' } },
    interaction: { type: 'numericInput', correctAnswer: 8006.09, acceptanceRule: 'normalisedNumber', displayAnswer: '8,006.09', placeholder: 'Enter the complete number' },
    feedback: { correct: { message: 'Correct. Zeroes hold the hundreds, tens and tenths places.' }, incorrect: { message: 'The accepted answer is 8,006.09.', evidence: 'Keep 8 in thousands, 6 in ones and 9 in hundredths.' } },
    transition: { onComplete: 'L3-C01' }, completionCondition: 'Learner enters 8,006.09.', analytics: { eventName: 'lesson_3_recombine' },
  },
  continueState({
    id: 'L3-C01', microSkillId: 'decimal-comparison', phase: 'teach', teachingIntent: 'Replace whole-number-string comparison with column alignment.',
    content: { eyebrow: 'Micro-skill 4', title: 'Align equal places, then compare from left to right', body: 'Trailing zeroes do not change a decimal’s value, so 3.45 can be written as 3.450.', prompt: 'The first unequal column decides the comparison.' },
    component: { type: 'decimalComparison', props: { values: ['3.45', '3.405'], relation: '>' } }, transition: { onComplete: 'L3-C02' },
  }),
  {
    id: 'L3-C02', microSkillId: 'decimal-comparison', phase: 'guided', teachingIntent: 'Diagnose the belief that more decimal digits means a larger value.',
    content: { title: 'Which number is greater: 0.7 or 0.07?', prompt: 'Choose the greater number.' },
    component: { type: 'decimalComparison', props: { values: ['0.7', '0.07'], optionIds: ['0.7', '0.07'], relation: '>' } },
    interaction: { type: 'select', options: [
      { id: '0.7', label: '0.7' },
      { id: '0.07', label: '0.07', errorMethod: 'Compares 07 as a whole number or favours more decimal digits.', misconceptionId: 'PV-DECIMAL-AS-WHOLE-STRING', rationale: 'Matching place-value columns are not aligned.', feedback: 'Align the places: 0.70 and 0.07. Seven tenths is greater than zero tenths.' },
    ], correctAnswer: '0.7' },
    feedback: { correct: { message: 'Correct. At the tenths column, 7 > 0, so 0.7 > 0.07.' }, incorrect: { message: 'The accepted answer is 0.7.' } },
    transition: { onComplete: 'L3-C03' }, completionCondition: 'Learner identifies 0.7 as greater.',
  },
  {
    id: 'L3-C03', microSkillId: 'decimal-comparison', phase: 'independent', teachingIntent: 'Check comparison when the first unequal digit follows a shared prefix.',
    content: { title: 'Choose the true comparison.', prompt: 'Compare 5.208 and 5.28.' },
    component: { type: 'decimalComparison', props: { values: ['5.208', '5.28'], relation: '<' } },
    interaction: { type: 'select', options: [
      { id: 'less', label: '5.208 < 5.28' },
      { id: 'greater', label: '5.208 > 5.28', errorMethod: 'Compares 208 and 28 as whole numbers.', misconceptionId: 'PV-DECIMAL-AS-WHOLE-STRING', rationale: 'Decimal places are not aligned.', feedback: 'Write 5.28 as 5.280. The tenths match, then 0 hundredths is less than 8 hundredths.' },
      { id: 'equal', label: '5.208 = 5.28', errorMethod: 'Ignores the zero hundredths placeholder.', misconceptionId: 'PV-ZERO-IGNORED', rationale: 'An interior zero is treated like a trailing zero.', feedback: 'The zero is in the hundredths column and matters here: 0 hundredths is less than 8 hundredths.' },
    ], correctAnswer: 'less' },
    feedback: { correct: { message: 'Correct. The first unequal place is hundredths: 0 < 8.' }, incorrect: { message: 'The accepted comparison is 5.208 < 5.28.' } },
    transition: { onComplete: 'L3-O01' }, completionCondition: 'Learner compares the aligned hundredths digits.',
  },
  continueState({
    id: 'L3-O01', microSkillId: 'decimal-comparison', phase: 'teach', teachingIntent: 'Extend pairwise comparison into a repeatable ordering method.',
    content: { title: 'Give every number the same visible places', body: 'Align the decimals, add trailing zeroes where useful, then sort using the first unequal column.', prompt: 'Smallest → largest' },
    component: { type: 'decimalOrdering', props: { values: [{ id: '0.07', label: '0.07' }, { id: '0.7', label: '0.7' }, { id: '0.707', label: '0.707' }, { id: '0.77', label: '0.77' }], alignedValues: { '0.07': '0.070', '0.7': '0.700', '0.707': '0.707', '0.77': '0.770' }, revealAlignedOnAnswer: true } }, transition: { onComplete: 'L3-O02' },
  }),
  {
    id: 'L3-O02', microSkillId: 'decimal-comparison', phase: 'guided', teachingIntent: 'Make the learner order the mathematical objects directly.',
    content: { title: 'Order the decimals from smallest to largest.', prompt: 'Move the cards into order, then check.' },
    component: { type: 'decimalOrdering', props: { values: [{ id: '1.5', label: '1.5' }, { id: '1.005', label: '1.005' }, { id: '1.055', label: '1.055' }, { id: '1.05', label: '1.05' }], alignedValues: { '1.5': '1.500', '1.005': '1.005', '1.055': '1.055', '1.05': '1.050' }, revealAlignedOnAnswer: true } },
    interaction: { type: 'order', initialOrder: ['1.5', '1.005', '1.055', '1.05'], correctAnswer: ['1.005', '1.05', '1.055', '1.5'], acceptanceRule: 'ordered', displayAnswer: '1.005, 1.05, 1.055, 1.5' },
    feedback: { correct: { message: 'Correct. The aligned values increase from 1.005 to 1.500.' }, incorrect: { message: 'The accepted order is shown.', evidence: 'Align them as 1.005, 1.050, 1.055 and 1.500, then compare from the left.' } },
    transition: { onComplete: 'L3-R01' }, completionCondition: 'Learner submits the ordered cards.', analytics: { misconceptionId: 'PV-ORDER-SEQUENCE-INCORRECT', eventName: 'lesson_3_decimal_order' },
  },
  {
    id: 'L3-R01', microSkillId: 'mixed', phase: 'independent', teachingIntent: 'Retrieve the digit/place/value distinction after decimal work.',
    content: { eyebrow: 'Memory check', title: 'In 9,304,218, what value does the digit 3 represent?', prompt: 'Enter the value without a hint.' },
    component: { type: 'placeValueChart', props: { value: '9,304,218', highlightIndices: [1], showReadout: true, revealReadoutOnAnswer: true, revealedEquation: '3 × 100,000 = 300,000' } },
    interaction: { type: 'numericInput', correctAnswer: 300000, acceptanceRule: 'normalisedNumber', displayAnswer: '300,000', placeholder: 'Enter the value' },
    feedback: { correct: { message: 'Correct. The 3 is in the hundred-thousands column.' }, incorrect: { message: 'The accepted answer is 300,000.', evidence: 'The digit is 3; its place is hundred thousands; its value is 300,000.' } },
    transition: { onComplete: 'L3-T01' }, completionCondition: 'Learner retrieves 300,000.', analytics: { eventName: 'lesson_3_delayed_retrieval' },
  },
  {
    id: 'L3-T01', microSkillId: 'mixed', phase: 'transfer', teachingIntent: 'Integrate large-number value, decimal-place reading and comparison.',
    content: { eyebrow: 'GCSE transfer', title: 'Consider the number 48,306.075.', prompt: 'Select all three true statements.' },
    component: { type: 'placeValueChart', props: { value: '48,306.075', compact: true } },
    interaction: { type: 'multiSelect', options: [
      { id: 'eight-true', label: 'The digit 8 has a value of 8,000.' },
      { id: 'seven-true', label: 'The digit 7 is in the hundredths place.' },
      { id: 'compare-true', label: '48,306.075 < 48,306.57.' },
      { id: 'eight-false', label: 'The digit 8 has a value of 80,000.', errorMethod: 'Moves the 8 one column left.', misconceptionId: 'PV-COLUMN-OFF-BY-ONE', rationale: 'The adjacent integer place is selected.' },
      { id: 'seven-false', label: 'The digit 7 is in the tenths place.', errorMethod: 'Ignores the zero in tenths.', misconceptionId: 'PV-ZERO-IGNORED', rationale: 'The internal zero is not preserving the 7’s place.' },
      { id: 'compare-false', label: '48,306.075 > 48,306.57 because 75 > 57.', errorMethod: 'Compares decimal strings as whole numbers.', misconceptionId: 'PV-DECIMAL-AS-WHOLE-STRING', rationale: 'The decimals are not aligned by place.' },
    ], correctAnswer: ['eight-true', 'seven-true', 'compare-true'], acceptanceRule: 'unorderedSet' },
    feedback: { correct: { message: 'Correct. You kept each digit in its column and compared 0.075 with 0.570.' }, incorrect: { message: 'The three accepted statements are now shown.', evidence: '8 is in thousands; 7 is in hundredths; and 0.075 is less than 0.570.' } },
    transition: { onComplete: 'L3-M01' }, completionCondition: 'Learner submits exactly the three true statements.', analytics: { eventName: 'lesson_3_gcse_transfer' },
  },
  continueState({
    id: 'L3-M01', microSkillId: 'mixed', phase: 'mastery', teachingIntent: 'Consolidate reusable decision rules without claiming durable mastery.',
    content: { eyebrow: 'Lesson complete', title: 'Place stays fixed; value comes from position', body: 'Name the column to find a digit’s value. Keep zero placeholders. For comparisons, align equal places and use the first unequal column.', prompt: 'Next: use these fixed columns to multiply and divide by powers of ten.' },
    component: { type: 'placeValueChart', props: { value: '12,304.056', highlightIndices: [1, 4, 6], compact: true } }, transition: {},
  }),
]

export const placeValueLesson: LessonDefinition = {
  id: 'L003', title: 'Place value', level: 'GCSE Foundation',
  goal: 'I can use place-value columns to read, partition, compare and order whole numbers and decimals.', states,
}

export const placeValueMicroSkillLabels: Partial<Record<MicroSkillId, string>> = {
  'digit-place-value': 'Digit & value',
  'decimal-places': 'Decimal places',
  'placeholder-zeroes': 'Placeholder zeroes',
  'decimal-comparison': 'Compare & order',
  mixed: 'Recall & transfer',
}
