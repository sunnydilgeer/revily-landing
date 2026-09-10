import type { LearningState, LessonDefinition, MicroSkillId, ShortDivisionStage } from '../number-types/types'

function continueState(state: Omit<LearningState, 'interaction' | 'completionCondition'>): LearningState {
  return { ...state, interaction: { type: 'continue' }, completionCondition: 'Learner studies or completes the staged short-division model and continues.' }
}

const exact288Stages: ShortDivisionStage[] = [
  { label: 'Find the starting number', narration: '2 is smaller than 9, so begin with 28.', activeDividendIndices: [0, 1] },
  { label: 'Divide 28 by 9', narration: '9 × 3 = 27, so write 3 above the tens place.', quotientDigits: [null, '3', null], activeDividendIndices: [0, 1], working: ['9 × 3 = 27'] },
  { label: 'Find the remainder', narration: '28 − 27 = 1, so the remainder is 1.', quotientDigits: [null, '3', null], activeDividendIndices: [0, 1], working: ['9 × 3 = 27', '28 − 27 = 1'] },
  { label: 'Carry the remainder', narration: 'Carry the 1 to the final 8. Together they make 18.', durationMs: 4200, quotientDigits: [null, '3', null], activeDividendIndices: [2], working: ['28 − 27 = 1'], regroup: { result: '18', carryDigit: '1', targetIndex: 2 } },
  { label: 'Divide 18 by 9', narration: '18 ÷ 9 = 2, so write 2 above the final 8. There is no remainder.', quotientDigits: [null, '3', '2'], activeDividendIndices: [2] },
  { label: 'Read the quotient', narration: 'The quotient is 32.', quotientDigits: [null, '3', '2'], working: ['288 ÷ 9 = 32'] },
]

const remainder67Stages: ShortDivisionStage[] = [
  { label: 'Divide the tens', narration: '5 × 1 = 5, so write 1 above the tens place.', quotientDigits: ['1', null], activeDividendIndices: [0], working: ['5 × 1 = 5'] },
  { label: 'Carry the remainder', narration: 'Carry the 1 to the 7. Together they make 17.', durationMs: 4200, quotientDigits: ['1', null], activeDividendIndices: [1], working: ['6 − 5 = 1'], regroup: { result: '17', carryDigit: '1', targetIndex: 1 } },
  { label: 'Divide 17 by 5', narration: '5 × 3 = 15, so write 3 above the ones place.', quotientDigits: ['1', '3'], activeDividendIndices: [1], working: ['5 × 3 = 15'] },
  { label: 'Find the final remainder', narration: '17 − 15 = 2. There are no dividend digits left, so 2 is the final remainder.', quotientDigits: ['1', '3'], working: ['17 − 15 = 2'] },
  { label: 'Read the answer', narration: '67 ÷ 5 = 13 remainder 2.', quotientDigits: ['1', '3'], working: ['67 ÷ 5 = 13 remainder 2'] },
]

const zero408Stages: ShortDivisionStage[] = [
  { label: 'Divide the hundreds', narration: '4 hundreds ÷ 4 = 1 hundred. Write 1 in the hundreds place.', quotientDigits: ['1', null, null], activeDividendIndices: [0], working: ['4 ÷ 4 = 1'] },
  { label: 'Keep the tens place', narration: '0 tens ÷ 4 = 0 tens. Write 0 in the tens place.', quotientDigits: ['1', '0', null], activeDividendIndices: [1], working: ['0 ÷ 4 = 0'] },
  { label: 'Divide the ones', narration: '8 ones ÷ 4 = 2 ones. Write 2 in the ones place.', quotientDigits: ['1', '0', '2'], activeDividendIndices: [2], working: ['8 ÷ 4 = 2'] },
  { label: 'Read the quotient', narration: 'The quotient is 102. The zero keeps the tens place.', quotientDigits: ['1', '0', '2'], working: ['408 ÷ 4 = 102'] },
]

const states: LearningState[] = [
  {
    id: 'L4-H01', microSkillId: 'short-division-layout', phase: 'hook',
    teachingIntent: 'Expose independent-digit division and establish the first usable partial dividend.',
    content: { title: 'Where should the division begin?', prompt: 'For 288 ÷ 9, choose the first partial dividend that is large enough to divide into whole groups of 9.' },
    component: { type: 'shortDivision', props: { dividend: '288', divisor: 9, activeDividendIndices: [0, 1] } },
    interaction: { type: 'select', options: [
      { id: '2', label: '2', errorMethod: 'Divides the first written digit independently.', misconceptionId: 'SD-DIGITS-INDEPENDENT', rationale: 'The learner has not extended the partial dividend when the first digit is smaller than the divisor.', feedback: '2 is smaller than 9. Before the quotient begins, include the next digit so the first partial dividend is 28.' },
      { id: '28', label: '28' },
      { id: '288', label: '288', errorMethod: 'Uses the whole dividend instead of its smallest usable left-hand part.', misconceptionId: 'SD-WHOLE-DIVIDEND-FIRST', rationale: 'The left-to-right place-value structure is not being used.', feedback: '288 is the whole dividend. Short division starts with the smallest left-hand part that can contain a whole group of 9: 28.' },
    ], correctAnswer: '28' },
    feedback: { correct: { message: 'Yes. Since 2 is smaller than 9, begin with 28.', evidence: '9 × 3 = 27, which does not exceed 28.' }, incorrect: { message: 'The accepted answer is 28.' } },
    transition: { onComplete: 'L4-V01' }, completionCondition: 'Learner identifies 28 as the first partial dividend.', analytics: { eventName: 'lesson_4_hook_partial_dividend' },
  },
  continueState({
    id: 'L4-V01', microSkillId: 'short-division-layout', phase: 'teach', teachingIntent: 'Attach precise vocabulary to stable visual regions.',
    content: { eyebrow: 'Micro-skill 1', title: 'Read the bus-stop layout', body: 'The dividend is being divided. The divisor is the number we divide by. The quotient is the result. A remainder is what is left after making the greatest possible number of whole groups.', prompt: '288 is the dividend. 9 is the divisor. The quotient will be written above.' },
    component: { type: 'shortDivision', props: { dividend: '288', divisor: 9, mode: 'static', showLabels: true } }, transition: { onComplete: 'L4-F01' },
  }),
  {
    id: 'L4-F01', microSkillId: 'short-division-partial-dividend', phase: 'guided', teachingIntent: 'Check the multiplication fact needed for the first quotient digit.',
    content: { title: 'Which is the greatest multiple of 9 that does not exceed 28?', prompt: 'This tells us the first quotient digit.' },
    component: { type: 'shortDivision', props: { dividend: '288', divisor: 9, activeDividendIndices: [0, 1] } },
    interaction: { type: 'select', options: [
      { id: '18', label: '18 = 9 × 2', errorMethod: 'Chooses a usable multiple but not the greatest one.', misconceptionId: 'SD-NOT-GREATEST-MULTIPLE', rationale: 'One more group of 9 also fits.', feedback: '18 fits, but one more group of 9 also fits. Use the greatest multiple that does not exceed 28.' },
      { id: '27', label: '27 = 9 × 3' },
      { id: '36', label: '36 = 9 × 4', errorMethod: 'Chooses a multiple greater than the partial dividend.', misconceptionId: 'SD-MULTIPLE-TOO-LARGE', rationale: 'Four groups of 9 exceed 28.', feedback: '36 is greater than 28, so four whole groups do not fit.' },
    ], correctAnswer: '27' },
    feedback: { correct: { message: 'Correct. Three groups fit because 9 × 3 = 27, leaving 1.' }, incorrect: { message: 'The accepted answer is 27 = 9 × 3.' } },
    transition: { onComplete: 'L4-M01' }, completionCondition: 'Learner selects 27.', analytics: { eventName: 'lesson_4_greatest_multiple' },
  },
  continueState({
    id: 'L4-M01', microSkillId: 'short-division-layout', phase: 'teach', teachingIntent: 'State a mathematically precise, repeatable short-division procedure.',
    content: { eyebrow: 'Micro-skill 2', title: 'Divide → write → remainder → regroup → repeat', body: 'Divide the current partial dividend. Write the quotient digit above its place. Multiply back and subtract to find the remainder. If another dividend digit remains, regroup the remainder with it. Then repeat.', prompt: 'Choose the greatest whole-number multiple that does not exceed the partial dividend.' },
    component: { type: 'shortDivision', props: { dividend: '288', divisor: 9, mode: 'static', activeDividendIndices: [0, 1] } }, transition: { onComplete: 'L4-W01' },
  }),
  continueState({
    id: 'L4-W01', microSkillId: 'short-division-regrouping', phase: 'teach', teachingIntent: 'Model exact short division one decision at a time without leaking later working.',
    content: { title: 'Worked example: 288 ÷ 9', prompt: 'Press Play, use Next and Previous, or choose any step.' },
    component: { type: 'shortDivision', props: { dividend: '288', divisor: 9, mode: 'stepper', stages: exact288Stages, answer: { label: '288 ÷ 9 = 32', quotientDigits: [null, '3', '2'] } } }, transition: { onComplete: 'L4-L01' }, analytics: { eventName: 'lesson_4_worked_288_completed' },
  }),
  {
    id: 'L4-L01', microSkillId: 'short-division-place-value', phase: 'guided', teachingIntent: 'Distinguish an unnecessary leading zero from a required place-holding zero.',
    content: { title: 'How should the quotient be written?', prompt: 'Choose the standard answer to 288 ÷ 9.' },
    component: { type: 'shortDivision', props: { dividend: '288', divisor: 9, quotientDigits: [null, '3', '2'], answer: { label: '288 ÷ 9 = 32', quotientDigits: [null, '3', '2'] } } },
    interaction: { type: 'select', options: [
      { id: '32', label: '32' },
      { id: '032', label: '032', errorMethod: 'Keeps an unnecessary leading quotient zero.', misconceptionId: 'SD-UNNECESSARY-LEADING-ZERO', rationale: 'A pre-quotient place is being treated like an internal quotient place.', feedback: 'A leading zero does not change the value, but standard notation begins the quotient at its first non-zero place: 32.' },
      { id: '3r1', label: '3 remainder 1', errorMethod: 'Stops after the first quotient digit.', misconceptionId: 'SD-STOPS-EARLY', rationale: 'The final dividend digit has not been processed.', feedback: 'That is only the result after dividing 28. Regroup the remainder with the final 8 and finish the ones place.' },
    ], correctAnswer: '32' },
    feedback: { correct: { message: 'Correct. Begin the quotient at the first place used, so the answer is 32.' }, incorrect: { message: 'The accepted answer is 32.' } },
    transition: { onComplete: 'L4-G01' }, completionCondition: 'Learner selects standard quotient notation.',
  },
  {
    id: 'L4-G01', microSkillId: 'short-division-regrouping', phase: 'guided', teachingIntent: 'Diagnose regrouping the quotient, product or nothing instead of the remainder.',
    content: { eyebrow: 'Micro-skill 3', title: 'What should be regrouped with the final 8?', prompt: 'In 288 ÷ 9, three groups of 9 use 27 from the partial dividend 28.' },
    component: { type: 'shortDivision', props: { dividend: '288', divisor: 9, mode: 'paused', quotientDigits: [null, '3', null], activeDividendIndices: [2], working: ['28 − 27 = ?'] } },
    interaction: { type: 'select', options: [
      { id: '18', label: 'Regroup 1, making 18' },
      { id: '38', label: 'Regroup 3, making 38', errorMethod: 'Regroups the quotient digit.', misconceptionId: 'SD-CARRIES-QUOTIENT', rationale: 'The quotient digit is confused with the remainder.', feedback: '3 is the quotient digit. Regroup the remainder from 28 − 27, which is 1.' },
      { id: '278', label: 'Regroup 27, making 278', errorMethod: 'Regroups the product.', misconceptionId: 'SD-REGROUPS-PRODUCT', rationale: 'The amount already divided is reused.', feedback: '27 has already been used. Subtract it from 28 and regroup only what remains.' },
      { id: '8', label: 'Use 8 only', errorMethod: 'Drops the remainder.', misconceptionId: 'SD-REMAINDER-DROPPED', rationale: 'The remaining ten disappears.', feedback: 'The remaining ten cannot disappear. Regroup it as 10 ones, then combine it with 8 ones.' },
    ], correctAnswer: '18' },
    feedback: { correct: { message: 'Correct. 28 − 27 = 1, and 1 ten with 8 ones makes 18 ones.' }, incorrect: { message: 'Regroup the remainder 1 with 8 to make 18.' } },
    transition: { onComplete: 'L4-I01' }, completionCondition: 'Learner regroups the remainder to form 18.',
  },
  {
    id: 'L4-I01', microSkillId: 'short-division-regrouping', phase: 'independent', teachingIntent: 'Check unaided exact short division across two quotient places.',
    content: { title: 'Use short division to calculate 234 ÷ 9.', prompt: 'Enter the quotient.' },
    component: { type: 'shortDivision', props: { dividend: '234', divisor: 9, answer: { label: '234 ÷ 9 = 26', quotientDigits: [null, '2', '6'], working: ['23 ÷ 9 = 2 remainder 5', '54 ÷ 9 = 6'] } } },
    interaction: { type: 'numericInput', correctAnswer: 26, acceptanceRule: 'nonNegativeInteger', displayAnswer: '26', placeholder: 'Enter the quotient' },
    feedback: { correct: { message: 'Correct. 23 ÷ 9 = 2 remainder 5, then 54 ÷ 9 = 6.', evidence: '26 × 9 = 234.' }, incorrect: { message: 'The accepted answer is 26.', evidence: 'Begin with 23, write 2, regroup remainder 5 with 4 to make 54, then write 6.' } },
    transition: { onComplete: 'L4-W02' }, completionCondition: 'Learner submits 26.', analytics: { eventName: 'lesson_4_exact_independent' },
  },
  continueState({
    id: 'L4-W02', microSkillId: 'short-division-regrouping', phase: 'teach', teachingIntent: 'Model a completed short-division calculation with a non-zero final remainder.',
    content: { eyebrow: 'Micro-skill 4', title: 'Worked example: 67 ÷ 5', body: 'A remainder at the final place becomes part of the answer.', prompt: 'Play it through or move at your own pace.' },
    component: { type: 'shortDivision', props: { dividend: '67', divisor: 5, mode: 'stepper', stages: remainder67Stages, answer: { label: '67 ÷ 5 = 13 remainder 2', quotientDigits: ['1', '3'], remainder: 2 } } }, transition: { onComplete: 'L4-R01' }, analytics: { eventName: 'lesson_4_worked_67_completed' },
  }),
  {
    id: 'L4-R01', microSkillId: 'short-division-check', phase: 'guided', teachingIntent: 'Establish the remainder bound and distinguish a remainder from a decimal digit.',
    content: { title: 'Which answer can be a valid result of division by 5?', prompt: 'A whole-number remainder must be at least 0 and smaller than the divisor.' },
    component: { type: 'shortDivision', props: { dividend: '67', divisor: 5 } },
    interaction: { type: 'select', options: [
      { id: '13r2', label: '13 remainder 2' },
      { id: '13r5', label: '13 remainder 5', errorMethod: 'Leaves a remainder equal to the divisor.', misconceptionId: 'SD-REMAINDER-NOT-SMALLER', rationale: 'One more whole group remains.', feedback: 'A remainder of 5 makes one more whole group of 5. The quotient is not yet complete.' },
      { id: '12r7', label: '12 remainder 7', errorMethod: 'Leaves a remainder greater than the divisor.', misconceptionId: 'SD-REMAINDER-NOT-SMALLER', rationale: 'The remainder still contains a whole group.', feedback: '7 contains another whole group of 5, so it cannot be the final remainder.' },
      { id: '13.2', label: '13.2', errorMethod: 'Treats remainder notation as a decimal digit.', misconceptionId: 'SD-REMAINDER-AS-DECIMAL', rationale: 'The remainder is appended as tenths rather than divided by the divisor.', feedback: 'Remainder 2 does not mean 0.2. A decimal answer would require dividing the remainder by 5, which is outside this lesson.' },
    ], correctAnswer: '13r2' },
    feedback: { correct: { message: 'Correct. 2 is a whole number from 0 to 4, so it can be a remainder after division by 5.' }, incorrect: { message: 'The valid answer is 13 remainder 2.' } },
    transition: { onComplete: 'L4-I02' }, completionCondition: 'Learner selects a remainder smaller than the divisor.',
  },
  {
    id: 'L4-I02', microSkillId: 'short-division-regrouping', phase: 'independent', teachingIntent: 'Check a complete quotient-and-remainder calculation without option cues.',
    content: { title: 'Use short division to calculate 347 ÷ 5.', prompt: 'Enter the quotient and the whole-number remainder.' },
    component: { type: 'shortDivision', props: { dividend: '347', divisor: 5, answer: { label: '347 ÷ 5 = 69 remainder 2', quotientDigits: [null, '6', '9'], remainder: 2, working: ['34 ÷ 5 = 6 remainder 4', '47 ÷ 5 = 9 remainder 2'] } } },
    interaction: { type: 'quotientRemainderInput', correctAnswer: { quotient: 69, remainder: 2 }, dividend: 347, divisor: 5, displayAnswer: '69 remainder 2' },
    feedback: { correct: { message: 'Correct. 347 ÷ 5 = 69 remainder 2.', evidence: '(69 × 5) + 2 = 347.' }, incorrect: { message: 'The accepted answer is 69 remainder 2.', evidence: '34 ÷ 5 = 6 r 4; regroup to make 47; 47 ÷ 5 = 9 r 2.' } },
    transition: { onComplete: 'L4-Z01' }, completionCondition: 'Learner submits quotient 69 and remainder 2.', analytics: { eventName: 'lesson_4_remainder_independent' },
  },
  continueState({
    id: 'L4-Z01', microSkillId: 'short-division-place-value', phase: 'teach', teachingIntent: 'Use place value to explain an essential internal quotient zero.',
    content: { eyebrow: 'Micro-skill 5', title: 'A zero inside the quotient holds a place', body: 'Once quotient writing has begun, every remaining dividend place must produce a quotient digit—even when that digit is zero.', prompt: 'In 408 ÷ 4, zero tens divided by 4 is zero tens.' },
    component: { type: 'shortDivision', props: { dividend: '408', divisor: 4, mode: 'stepper', stages: zero408Stages, answer: { label: '408 ÷ 4 = 102', quotientDigits: ['1', '0', '2'] } } }, transition: { onComplete: 'L4-Z02' },
  }),
  {
    id: 'L4-Z02', microSkillId: 'short-division-place-value', phase: 'guided', teachingIntent: 'Directly diagnose omission of the internal quotient zero.',
    content: { title: 'What must be written above the zero tens?', prompt: 'The calculation is 408 ÷ 4. The hundreds quotient digit 1 is already written.' },
    component: { type: 'shortDivision', props: { dividend: '408', divisor: 4, mode: 'paused', quotientDigits: ['1', null, null], activeDividendIndices: [1], answer: { label: '408 ÷ 4 = 102', quotientDigits: ['1', '0', '2'] } } },
    interaction: { type: 'select', options: [
      { id: 'zero', label: 'Write 0' },
      { id: 'skip', label: 'Write nothing and move to 8', errorMethod: 'Omits an internal quotient zero.', misconceptionId: 'SD-INTERNAL-ZERO-OMITTED', rationale: 'Skipping tens shifts the ones digit into the tens place.', feedback: 'Skipping the tens place shifts the final 2 into the tens column and changes 102 into 12.' },
      { id: 'four', label: 'Write 4', errorMethod: 'Writes the divisor instead of the number of groups.', misconceptionId: 'SD-WRITES-DIVISOR', rationale: 'The divisor is copied into the quotient.', feedback: 'Write the number of groups. Zero tens contains zero groups of 4.' },
    ], correctAnswer: 'zero' },
    feedback: { correct: { message: 'Correct. The zero holds the tens place, so the completed quotient is 102.' }, incorrect: { message: 'Write 0 above the tens place.' } },
    transition: { onComplete: 'L4-I03' }, completionCondition: 'Learner writes a zero quotient digit in the tens place.', analytics: { eventName: 'lesson_4_internal_zero_diagnostic' },
  },
  {
    id: 'L4-I03', microSkillId: 'short-division-place-value', phase: 'independent', teachingIntent: 'Check transfer of the internal-zero rule in a new calculation.',
    content: { title: 'Use short division to calculate 824 ÷ 4.', prompt: 'Enter every quotient digit, including any placeholder zero.' },
    component: { type: 'shortDivision', props: { dividend: '824', divisor: 4, answer: { label: '824 ÷ 4 = 206', quotientDigits: ['2', '0', '6'], working: ['8 hundreds ÷ 4 = 2 hundreds', '2 tens ÷ 4 = 0 tens remainder 2 tens', '24 ones ÷ 4 = 6 ones'] } } },
    interaction: { type: 'numericInput', correctAnswer: 206, acceptanceRule: 'nonNegativeInteger', displayAnswer: '206', placeholder: 'Enter the quotient' },
    feedback: { correct: { message: 'Correct. The zero keeps the tens place.', evidence: '206 × 4 = 824.' }, incorrect: { message: 'The accepted answer is 206.', evidence: 'After writing 2 hundreds, write 0 in the tens place before writing 6 in the ones place.' } },
    transition: { onComplete: 'L4-C01' }, completionCondition: 'Learner submits 206.', analytics: { eventName: 'lesson_4_internal_zero_independent' },
  },
  continueState({
    id: 'L4-C01', microSkillId: 'short-division-check', phase: 'teach', teachingIntent: 'Establish inverse checking and the remainder constraint.',
    content: { eyebrow: 'Micro-skill 6', title: 'Multiply back, then add the remainder', body: 'For dividend N, divisor d, quotient q and remainder r: (q × d) + r = N. Also check 0 ≤ r < d.', prompt: 'For 347 ÷ 5 = 69 remainder 2, the check reconstructs 347.' },
    component: { type: 'divisionCheck', props: { dividend: 347, divisor: 5, quotient: 69, remainder: 2 } }, transition: { onComplete: 'L4-C02' },
  }),
  {
    id: 'L4-C02', microSkillId: 'short-division-check', phase: 'guided', teachingIntent: 'Diagnose omission of the remainder and use of the dividend instead of the divisor.',
    content: { title: 'Which check proves 67 ÷ 5 = 13 remainder 2?', prompt: 'Choose the calculation that reconstructs the dividend.' },
    component: { type: 'divisionCheck', props: { dividend: 67, divisor: 5, quotient: 13, remainder: 2, revealOnAnswer: true } },
    interaction: { type: 'select', options: [
      { id: 'correct', label: '(13 × 5) + 2 = 67' },
      { id: 'omit', label: '13 × 5 = 65', errorMethod: 'Omits the remainder from the inverse check.', misconceptionId: 'SD-CHECK-OMITS-REMAINDER', rationale: 'Only the grouped portion is reconstructed.', feedback: '65 is the grouped part. Add the remainder 2 to reconstruct 67.' },
      { id: 'dividend', label: '(13 × 67) + 2', errorMethod: 'Multiplies the quotient by the dividend.', misconceptionId: 'SD-CHECK-USES-DIVIDEND', rationale: 'Dividend and divisor roles are confused.', feedback: 'Multiply the quotient by the divisor, not by the dividend.' },
      { id: 'reverse', label: '(5 × 2) + 13', errorMethod: 'Reassigns quotient and remainder roles.', misconceptionId: 'SD-CHECK-ROLES-REVERSED', rationale: 'The remainder is treated as a group count.', feedback: 'The quotient counts groups of the divisor, so first calculate 13 × 5.' },
    ], correctAnswer: 'correct' },
    feedback: { correct: { message: 'Correct. The 13 groups account for 65, and the remainder 2 reconstructs 67.' }, incorrect: { message: 'The accepted check is (13 × 5) + 2 = 67.' } },
    transition: { onComplete: 'L4-D01' }, completionCondition: 'Learner selects the complete inverse check.', analytics: { eventName: 'lesson_4_inverse_check' },
  },
  {
    id: 'L4-D01', microSkillId: 'short-division-regrouping', phase: 'independent', teachingIntent: 'Retrieve exact short division after remainder, zero and checking work.',
    content: { eyebrow: 'Memory check', title: 'Calculate 936 ÷ 8.', prompt: 'Use the bus-stop method without a hint.' },
    component: { type: 'shortDivision', props: { dividend: '936', divisor: 8, answer: { label: '936 ÷ 8 = 117', quotientDigits: ['1', '1', '7'], working: ['9 ÷ 8 = 1 remainder 1', '13 ÷ 8 = 1 remainder 5', '56 ÷ 8 = 7'] } } },
    interaction: { type: 'numericInput', correctAnswer: 117, acceptanceRule: 'nonNegativeInteger', displayAnswer: '117', placeholder: 'Enter the quotient' },
    feedback: { correct: { message: 'Correct. 936 ÷ 8 = 117.', evidence: '117 × 8 = 936.' }, incorrect: { message: 'The accepted answer is 117.', evidence: 'Use partial dividends 9, then 13, then 56; the quotient digits are 1, 1 and 7.' } },
    transition: { onComplete: 'L4-T01' }, completionCondition: 'Learner submits 117.', analytics: { eventName: 'lesson_4_delayed_retrieval' },
  },
  {
    id: 'L4-T01', microSkillId: 'short-division-check', phase: 'transfer', teachingIntent: 'Integrate procedure, place value and validation by judging a worked claim.',
    content: { eyebrow: 'GCSE transfer', title: 'A student says 758 ÷ 7 = 108 remainder 2.', prompt: 'Is the student correct? Choose the best justification.' },
    component: { type: 'divisionCheck', props: { dividend: 758, divisor: 7, quotient: 108, remainder: 2, revealOnAnswer: true } },
    interaction: { type: 'select', options: [
      { id: 'correct', label: 'Yes. (108 × 7) + 2 = 758, and 2 < 7.' },
      { id: 'zero', label: 'No. A quotient cannot contain a zero.', errorMethod: 'Rejects an internal quotient zero.', misconceptionId: 'SD-INTERNAL-ZERO-OMITTED', rationale: 'The place-holding function of zero is not recognised.', feedback: 'A zero inside a quotient can be essential. Here it holds the tens place.' },
      { id: 'omit', label: 'No. 108 × 7 = 756, not 758.', errorMethod: 'Omits the remainder from the check.', misconceptionId: 'SD-CHECK-OMITS-REMAINDER', rationale: 'Only the complete groups are counted.', feedback: 'The product accounts for the complete groups. Add the stated remainder 2.' },
      { id: 'dividend', label: 'Yes. (108 × 758) + 2 gives the dividend.', errorMethod: 'Uses the dividend as the multiplier in the check.', misconceptionId: 'SD-CHECK-USES-DIVIDEND', rationale: 'Dividend and divisor are confused.', feedback: 'The check uses quotient × divisor, then adds the remainder.' },
    ], correctAnswer: 'correct' },
    feedback: { correct: { message: 'Correct. The inverse check reconstructs 758 and the remainder is smaller than 7.' }, incorrect: { message: 'The student is correct.', evidence: '(108 × 7) + 2 = 758, and 2 < 7.' } },
    transition: { onComplete: 'L4-MST' }, completionCondition: 'Learner validates the quotient and remainder using both checks.', analytics: { eventName: 'lesson_4_gcse_transfer' },
  },
  continueState({
    id: 'L4-MST', microSkillId: 'mixed', phase: 'mastery', teachingIntent: 'Consolidate the transferable method without claiming durable mastery.',
    content: { eyebrow: 'Lesson complete', title: 'Keep each quotient digit in its place', body: 'Divide the current partial dividend, write the quotient digit, multiply back to find the remainder, regroup with the next digit, and repeat. Keep an internal zero. Check with (quotient × divisor) + remainder = dividend.', prompt: 'Next: choose and use a written method for two-digit divisors.' },
    component: { type: 'divisionCheck', props: { dividend: 758, divisor: 7, quotient: 108, remainder: 2 } }, transition: {},
  }),
]

export const shortDivisionLesson: LessonDefinition = {
  id: 'L004', title: 'Short division: the bus stop method', level: 'GCSE Foundation',
  goal: 'I can use short division to divide a multi-digit whole number by a one-digit whole number, write any whole-number remainder, and check my result.', states,
}

export const shortDivisionMicroSkillLabels: Partial<Record<MicroSkillId, string>> = {
  'short-division-layout': 'Read the layout',
  'short-division-partial-dividend': 'Choose & divide',
  'short-division-regrouping': 'Remainders',
  'short-division-place-value': 'Keep the place',
  'short-division-check': 'Check the result',
  mixed: 'Recall & transfer',
}
