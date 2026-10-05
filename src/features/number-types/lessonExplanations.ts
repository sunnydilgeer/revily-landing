import type { FeedbackDefinition, LearningState } from './types'

type WorkedExplanation = NonNullable<FeedbackDefinition['workedExplanation']>
/**
 * A working one move a step (src/features/EXPLANATIONS.md): each step has a short heading, its ⓘ in words, and the
 * lines of maths that show where its numbers come from ("20 ÷ 5 → 4"). The answer is drawn once, in green, at the end.
 */
const explanation = (answer: string, ...steps: Array<[string, string, ...string[]]>): WorkedExplanation => ({ answer, steps: steps.map(([title, why, ...lines]) => ({ title, why, lines })) })

// The questions transcribe Aniksha's N1.1-N1.5 source sheets; their workings follow the Revily explanation style.
// Higher-tier parts (recurring decimals to fractions, simplifying surds, sums and products of surds) are not in
// this Foundation lesson.
const explanations: Record<string, WorkedExplanation> = {
  'D-I-02': explanation('−3 is an integer',
    ['Any decimal part?', 'Integers are whole numbers. They can be negative, zero or positive.', '−3 has no decimal part']),
  'D-I-03': explanation('1.5 is not an integer',
    ['Find its neighbours', 'A number between two neighbouring integers is not an integer.', '1 < 1.5 < 2']),
  'D-I-05': explanation('4',
    ['Divide', 'A fraction bar means divide the top by the bottom.', '20 ÷ 5 → 4']),
  'D-I-06': explanation('20/5 is an integer',
    ['Work out its value', 'A fraction bar means divide. Judge the value, not how it is written.', '20 ÷ 5 → 4']),
  'D-I-07': explanation('Each has the value 2',
    ['Work out each one', 'Find the value of every form before deciding.', '2.0 → 2', '4 ÷ 2 → 2']),
  'D-I-09': explanation('√81 is an integer',
    ['Find the root', 'The square root is the number that multiplies by itself to make 81.', '9 × 9 → 81', '√81 → 9']),
  'D-I-10': explanation('√20 is not an integer',
    ['Square numbers either side', 'Find the square numbers just below and just above 20.', '4 × 4 → 16', '5 × 5 → 25'],
    ['Place the root', 'It sits between the two roots, so it cannot be whole.', '4 < √20 < 5']),
  'D-I-11': explanation('−7, 0, 12/4 and 26',
    ['Work out the fraction', 'Work out the value before deciding.', '12 ÷ 4 → 3'],
    ['Work out the root', 'Find the square numbers either side of 11.', '3 × 3 → 9', '4 × 4 → 16', '3 < √11 < 4'],
    ['Sort them', 'Keep the ones with no decimal part.', 'Whole: −7, 0, 3, 26', 'Not whole: 1.5, √11']),
  'D-P-01': explanation('−15',
    ['Work out each one', 'Find the value of each number, then look for a decimal part.', '3 ÷ 8 → 0.375', '2 < √7 < 3', '4.2 has a decimal part']),
  'D-P-02': explanation('6.5 and 11/4',
    ['Work out each one', 'Find the value of each form first.', '20 ÷ 5 → 4', '√49 → 7', '11 ÷ 4 → 2.75'],
    ['Sort them', 'The ones with a decimal part are not integers.', 'Whole: −2, 0, 4, 7', 'Not whole: 6.5, 2.75']),
  'D-P-03': explanation('18/6, −9 and √81',
    ['Work out each one', 'Find the value of each form first.', '18 ÷ 6 → 3', '√81 → 9', '4 < √20 < 5'],
    ['Sort them', 'Keep the whole numbers.', 'Whole: 3, −9, 9', 'Not whole: √20, 2.75']),
  'D-P-04': explanation('It lies strictly between 4 and 5',
    ['Square numbers either side', 'Find the square numbers just below and just above 20.', '4 × 4 → 16', '5 × 5 → 25'],
    ['Place the root', 'There is no whole number between 4 and 5.', '4 < √20 < 5']),
  'D-P-05': explanation('n = 36, an integer',
    ['Undo the root', 'Squaring undoes a square root, so multiply 6 by itself.', '6 × 6 → 36']),
  'D-P-06': { ...explanation('6.5',
    ['Pick a value between', 'Any number strictly between 6 and 7 has a decimal part.', '6 < 6.5 < 7']), answerLabel: 'For example' },
  'D-P-07': explanation('No: halfway between 2 and 8 is 5',
    ['Try another pair', 'One example that breaks “always” is enough.', '(2 + 8) ÷ 2 → 5', '5 is whole']),

  'D-SI-04': explanation('64 = 8 × 8 and 64 = 4 × 4 × 4',
    ['Test square', 'A square number is a number times itself.', '8 × 8 → 64'],
    ['Test cube', 'A cube number is a number times itself, three times.', '4 × 4 × 4 → 64']),
  'D-SI-05': explanation('23 and 29',
    ['Find a factor', 'A prime has exactly two factors, 1 and itself. Look for any other factor.', '21 → 3 × 7', '22 → 2 × 11', '24 → 2 × 12', '25 → 5 × 5', '26 → 2 × 13', '27 → 3 × 9', '28 → 2 × 14'],
    ['What is left', 'The numbers with no other factor are prime.', '23 and 29 have none']),
  'D-SI-06': explanation('51 = 3 × 17',
    ['Try small divisors', 'Test 2, then 3, then 5. One exact division is enough.', '51 ÷ 3 → 17']),
  'D-SI-07': explanation('49',
    ['List the squares', 'Square the numbers until you pass 50.', '6 × 6 → 36', '7 × 7 → 49'],
    ['Pick the odd one', 'Of the two, only one is odd.', '36 is even']),
  'D-SI-08': explanation('1, 8, 27',
    ['Cube 1, 2, 3', 'A cube number is a number times itself, three times.', '1 × 1 × 1 → 1', '2 × 2 × 2 → 8', '3 × 3 × 3 → 27']),
  'D-SI-09': explanation('12 = 2 × 2 × 3',
    ['Split 12', 'Start with any factor pair.', '12 → 2 × 6'],
    ['Split again', 'Keep splitting until every factor is prime.', '6 → 2 × 3']),
  'D-SI-10': explanation('No: 1 has only one factor',
    ['Count its factors', 'A prime number has exactly two factors.', 'Factors of 1: 1']),
  'D-SI-11': explanation('N = 25',
    ['List the squares', 'Only the two-digit square numbers count.', '16, 25, 36, 49, 64, 81'],
    ['Multiple of 5', 'A multiple of 5 ends in 0 or 5.', '25 ends in 5']),

  'D-R-03': explanation('0.45 = 9/20',
    ['Write as a fraction', 'Two decimal places means hundredths.', '0.45 → 45/100'],
    ['Simplify', 'Divide the top and the bottom by the same number.', '45 ÷ 5 → 9', '100 ÷ 5 → 20']),
  'D-R-04': explanation('0.6 recurring',
    ['Test each one', 'A rational number is exactly a fraction. Recurring decimals are rational.', '2/3 → 0.666…', '√10 and √12 are not exact', 'π never ends or repeats']),
  'D-R-06': explanation('5/8 = 0.625, which stops',
    ['Divide', 'A fraction bar means divide the top by the bottom.', '5 ÷ 8 → 0.625']),
  'D-R-08': explanation('Yes: every integer is n/1',
    ['Write it over 1', 'Any whole number can be written as a fraction with 1 on the bottom.', '4 → 4/1', '−2 → −2/1']),

  'D-IR-04': explanation('√20 is irrational',
    ['Square numbers either side', 'Find the square numbers just below and just above 20.', '4 × 4 → 16', '5 × 5 → 25', '4 < √20 < 5'],
    ['Look at the decimal', 'It is not whole, and its decimal never stops or repeats.', '√20 → 4.472135…']),
  'D-IR-05': explanation('√17',
    ['Test each one', 'An irrational number cannot be written exactly as a fraction.', '√16 → 4', '0.5 → 1/2', '4 < √17 < 5']),
  'D-IR-06': explanation('√30 is irrational',
    ['Square numbers either side', 'Find the square numbers just below and just above 30.', '5 × 5 → 25', '6 × 6 → 36', '5 < √30 < 6'],
    ['Look at the decimal', 'It is not whole, and its decimal never stops or repeats.', '√30 → 5.477225…']),
  'D-IR-08': { ...explanation('√10',
    ['Square the ends', 'Roots of the numbers between these squares lie between 3 and 4.', '3 × 3 → 9', '4 × 4 → 16'],
    ['Pick a root', 'Any root of 10 to 15 works. √16 is exactly 4, and 3.5 is rational.', '3 < √10 < 4']), answerLabel: 'For example' },
  'D-IR-10': explanation('No: √16 = 4',
    ['Try a square number', 'The root of a square number is whole, so it is rational.', '4 × 4 → 16', '√16 → 4']),
  'D-IR-12': { ...explanation('√5',
    ['Square the ends', 'Roots of the numbers between these squares lie between 2 and 3.', '2 × 2 → 4', '3 × 3 → 9'],
    ['Pick a root', 'Any root of 5 to 8 works. √9 is exactly 3, and 2.5 is rational.', '2 < √5 < 3']), answerLabel: 'For example' },

  'D-MF-05': explanation('1, 2, 3, 6, 7, 14, 21, 42',
    ['Find the factor pairs', 'Try 1, 2, 3 … until the pairs meet.', '1 × 42', '2 × 21', '3 × 14', '6 × 7']),
  'D-MF-06': explanation('9, 18, 27, 36',
    ['The 9 times table', 'Multiples are the 9 times table.', '9 × 1 → 9', '9 × 2 → 18', '9 × 3 → 27', '9 × 4 → 36']),
  'D-MF-07': explanation('12',
    ['List the factors', 'Write every factor of each number.', '24: 1, 2, 3, 4, 6, 8, 12, 24', '36: 1, 2, 3, 4, 6, 9, 12, 18, 36'],
    ['Common factors', 'Keep the ones in both lists, and take the highest.', '1, 2, 3, 4, 6, 12']),
  'D-MF-08': explanation('24',
    ['List the multiples', 'Count up in 8s and in 12s.', '8: 8, 16, 24', '12: 12, 24'],
    ['First in both', 'The first number in both lists is the lowest common multiple.', '24 is in both']),
  'D-MF-09': { ...explanation('3',
    ['List the factors', 'Write every factor of each number.', '18: 1, 2, 3, 6, 9, 18', '27: 1, 3, 9, 27'],
    ['Common factors', 'Either 3 or 9 works: both are in both lists.', 'In both: 1, 3, 9']), answerLabel: 'For example' },
  'D-MF-10': { ...explanation('12 and 18',
    ['Multiples of 6', 'Both numbers must be multiples of 6 between 10 and 30.', '12, 18, 24'],
    ['Check the HCF', 'Their highest common factor must be exactly 6. 18 and 24 works too.', '12 → 6 × 2', '18 → 6 × 3']), answerLabel: 'For example' },
  'D-MF-11': explanation('Yes: n ÷ n = 1',
    ['Divide by itself', 'A factor divides exactly, with nothing left over.', '7 ÷ 7 → 1', '20 ÷ 20 → 1']),
  'D-MF-12': explanation('No: the LCM of 4 and 8 is 8',
    ['Try 4 and 8', 'One example that breaks “always” is enough.', '4: 4, 8', '8: 8'],
    ['First in both', 'The LCM is 8, which is not bigger than 8.', '8 is in both']),
}

export function withLessonExplanation(state: LearningState): LearningState {
  if (state.interaction.type === 'continue') return state
  const workedExplanation = explanations[state.id]
  if (!workedExplanation) throw new Error(`Missing Lesson 1 explanation: ${state.id}`)
  return { ...state, feedback: {
    correct: { ...state.feedback?.correct, message: 'Explanation', workedExplanation },
    incorrect: { ...state.feedback?.incorrect, message: 'Explanation', workedExplanation },
  } }
}
