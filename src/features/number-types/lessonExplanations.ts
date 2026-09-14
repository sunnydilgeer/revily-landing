import type { FeedbackDefinition, LearningState } from './types'

type WorkedExplanation = NonNullable<FeedbackDefinition['workedExplanation']>
const explanation = (answer: string, ...steps: Array<[string, ...string[]]>): WorkedExplanation => ({ answer, steps: steps.map(([title, ...lines]) => ({ title, lines })) })

// Tutor wording is transcribed from N1.1_Integers_vs_Non-Integers.pdf.
// Exam marking annotations are omitted; open-response answers are labelled as examples.
const explanations: Record<string, WorkedExplanation> = {
  'D-I-11': explanation('−7, 0, 12/4, 26',
    ['Check the numbers that are already whole', '−7 and 0 and 26 have nothing after a decimal point'],
    ['Work out the fraction before deciding', '12/4 = 12 ÷ 4 = 3'],
    ['Work out the root before deciding', '√11 = 3·316…'],
    ['Rule out the two that are not whole', '1.5 and √11 are not integers']),
  'D-P-01': explanation('−15',
    ['Work each number out and look for anything after the decimal point', '4.2 · 3/8 = 0·375 · √7 = 2·645…'],
    ['A negative whole number is still a whole number']),
  'D-P-02': explanation('6·5 and 11/4',
    ['Work out the fraction and the root first', '20/5 = 20 ÷ 5 = 4 and √49 = 7', 'Both come out whole, so both are integers and neither belongs in the answer'],
    ['Now check what is left', '11/4 = 2·75 and 6.5 is not whole']),
  'D-P-03': explanation('18/6, −9 and √81',
    ['Work out the fraction and both roots', '18/6 = 18 ÷ 6 = 3 · √81 = 9 · √20 = 4·472…', 'Two of those come out whole and one does not', '−9 is already whole, and 2·75 has a decimal part']),
  'D-P-04': explanation('√20 = 4·472… which is not whole',
    ['Work the root out and look at what comes after the decimal point', '√20 = 4·472135…', 'It does not come out exactly, so it is not a whole number']),
  'D-P-05': explanation('Yes — n = 36, which is an integer',
    ['Undo the square root by squaring both sides', 'n = 6 × 6 = 36'],
    ['36 has nothing after a decimal point, so it is a whole number']),
  'D-P-06': { ...explanation('6·5', ['Choose anything between them that is not whole', '6·5 or 6·2 or 13/2']), answerLabel: 'Example answer' },
  'D-P-07': explanation('No — halfway between 2 and 8 is 5',
    ['Test two integers that sit next to each other', 'halfway between 4 and 5 = 4·5', 'That one is not whole, so Maya looks right so far'],
    ['But she said always, so test a pair with a gap between them', '(2 + 8) ÷ 2 = 5', '5 is a whole number, so one example is enough to break her statement']),

  'D-I-02': explanation('Integer', ['Check whether −3 has a fractional part', '−3 has no fractional part. Integers can be negative, zero or positive.']),
  'D-I-03': explanation('Non-integer', ['Place 1.5 between its neighbouring integers', '1 < 1.5 < 2', '1.5 has a fractional part, so it is not an integer.']),
  'D-I-05': explanation('4', ['Work out the fraction by dividing', '20/5 = 20 ÷ 5 = 4']),
  'D-I-06': explanation('Integer', ['Work out the fraction first', '20/5 = 20 ÷ 5 = 4'], ['Classify its value', '4 is an integer, so 20/5 represents an integer too.']),
  'D-I-07': explanation('Each has the value 2.', ['Work out each representation', '2.0 = 2 and 4/2 = 4 ÷ 2 = 2'], ['Check the value, rather than the notation', 'All three represent 2, which is an integer.']),
  'D-I-09': explanation('Integer', ['Find the number that squares to 81', '9 × 9 = 81, so √81 = 9'], ['Classify the result', '9 has no fractional part, so it is an integer.']),
  'D-I-10': explanation('Non-integer', ['Compare 20 with the neighbouring square numbers', '4 × 4 = 16 and 5 × 5 = 25'], ['Place the square root between the integers', '4 < √20 < 5', 'There is no integer strictly between 4 and 5.']),

  'L1-H01': explanation('7, −3 and 6 ÷ 2', ['Work out the expression first', '6 ÷ 2 = 3'], ['Check which values are integers', '7, −3 and 3 have no fractional part. 0.5 lies between 0 and 1.']),
  'L1-I02': explanation('−8, 0 and 19', ['Check the negative number and zero', '−8 and 0 are integers. Integers can be negative, zero or positive.'], ['Check the remaining values', '19 is an integer. 2 < 2.4 < 3, so 2.4 is not.']),
  'L1-I03': explanation('Integer', ['Work out the division before deciding', '10 ÷ 2 = 5'], ['Classify the result', '5 is an integer, so 10 ÷ 2 represents an integer.']),
  'L1-I04': explanation('−4, 6, 0, 8 ÷ 2 and √9', ['Work out the division and exact root first', '8 ÷ 2 = 4 and √9 = 3'], ['Check which values have no fractional part', '−4, 6, 0, 4 and 3 are integers.'], ['Rule out the remaining values', '¾ = 0.75 and −2.1 have fractional parts. π and √2 are irrational, so neither is an integer.']),
  'B-I-H01': explanation('−3', ['Check which values are integers', '−3, 0 and 4 have no fractional part. 2.5 is not an integer.'], ['Remove the whole numbers', 'Whole numbers start at 0. Both 0 and 4 are whole numbers; −3 is outside that set.']),
  'B-I-G01': explanation('−6', ['Check which values are integers', '−6, 0 and 8 are integers. ¾ and −2.1 have fractional parts.'], ['Look for an integer outside the whole numbers', '0 and 8 are whole numbers. −6 is negative, so it is not a whole number.']),
  'B-I-D01': explanation('0, 8 ÷ 2 and √9', ['Work out the expressions first', '8 ÷ 2 = 4 and √9 = 3'], ['Keep zero and the positive integers', '0, 4 and 3 are whole numbers.'], ['Rule out the other values', '−4 is negative. 2.1 and √2 have fractional parts.']),

  'L1-F03': explanation('5', ['Undo the multiplication by dividing', '20 ÷ 4 = 5'], ['Check the missing factor', '4 × 5 = 20']),
  'L1-M02': explanation('5 is a factor of 20; 20 is a multiple of 5.', ['Check the factor by dividing', '20 ÷ 5 = 4 with no remainder, so 5 is a factor of 20.'], ['Check the multiple by multiplying', '5 × 4 = 20, so 20 is a multiple of 5.'], ['Check the reversed statement', '5 ÷ 20 = 0.25, so 20 is not a factor of 5.']),
  'L1-M03': explanation('6, 12 and 18', ['Build the first three positive multiples of 6', '6 × 1 = 6', '6 × 2 = 12', '6 × 3 = 18'], ['Check the remaining option', '3 is not in the 6 times table.']),
  'L1-M04': explanation('All four statements are true.', ['Check the relationships with 8 itself', '8 ÷ 8 = 1, so 8 is a factor of 8.', '8 × 1 = 8, so 8 is a multiple of 8.'], ['Check the relationships with 16 and 4', '16 ÷ 8 = 2, so 8 is a factor of 16.', '4 × 2 = 8, so 8 is a multiple of 4.']),
  'L1-P02': explanation('No — 4 is not prime.', ['List the positive factors of 4', '1 × 4 = 4 and 2 × 2 = 4', 'The different positive factors are 1, 2 and 4.'], ['Count the factors', '4 has three positive factors. A prime needs exactly two.']),
  'L1-P03': explanation('No — 1 is neither prime nor composite.', ['List the positive factors of 1', '1 × 1 = 1, so the only positive factor is 1.'], ['Compare with the prime-number rule', 'A prime needs two different positive factors. 1 has only one.']),
  'L1-P04': explanation('2', ['Check the positive factors of 2', 'They are 1 and 2: exactly two, so 2 is prime.'], ['Rule out the other even numbers', '4, 6 and 8 each have 2 as a factor as well as 1 and themselves. They have more than two positive factors.']),
  'L1-P05': explanation('2, 3, 11 and 17', ['Check the numbers with exactly two positive factors', '2: 1 and 2; 3: 1 and 3; 11: 1 and 11; 17: 1 and 17.'], ['Look for extra factors in the others', '9 = 3 × 3 and 15 = 3 × 5. Both have more than two positive factors.']),
  'L1-S03': explanation('9, 16 and 25', ['Try multiplying an integer by itself', '3 × 3 = 9', '4 × 4 = 16', '5 × 5 = 25'], ['Check the other options against neighbouring squares', '4 < 6 < 9; 9 < 12 < 16; 16 < 20 < 25.', '6, 12 and 20 fall between square numbers.']),
  'L1-C02': explanation('27', ['Multiply the first two factors', '3 × 3 = 9'], ['Multiply the result by the third factor', '9 × 3 = 27', 'A cube uses three equal factors.']),
  'L1-C03': explanation('64 is both square and cube.', ['Test the square structure', '8 × 8 = 64, so 64 is a square number.'], ['Test the cube structure', '4 × 4 × 4 = 64, so 64 is a cube number.'], ['Check whether it is prime', '64 has factors other than 1 and 64, including 2, so it is not prime.']),
  'L1-R02': explanation('1', ['Divide without changing the value', '5 ÷ 1 = 5, so 5 = 5/1.'], ['Check the rational-number rule', '5 and 1 are integers and the denominator is not zero. This makes 5 rational.']),
  'L1-R03': explanation('Yes — 0.25 is rational.', ['Write the decimal as hundredths', '0.25 = 25/100'], ['Simplify the fraction', '25/100 = 1/4', 'It is an exact fraction of two integers, so 0.25 is rational.']),
  'L1-R04': explanation('A fixed pattern repeats.', ['Look at the repeating block', 'The digit 3 repeats forever in 0.333….'], ['Connect it to an exact fraction', '0.333… = 1/3, so this recurring decimal is rational.']),
  'L1-IR02': explanation('No — π neither terminates nor repeats a fixed block.', ['Recall what is known about π', 'Its decimal continues forever without a fixed repeating block. A short list of digits alone cannot prove this.'], ['Apply the irrational-number rule', 'π cannot be written exactly as a fraction of two integers, so it is irrational.']),
  'L1-IR03': explanation('√5', ['Work out the roots of perfect squares', '√4 = 2, √9 = 3 and √16 = 4. These integers are rational.'], ['Check the remaining root', '5 is not a perfect square. √5 cannot be written exactly as a fraction of two integers, so it is irrational.']),
  'L1-X01': explanation('Integer, prime and rational', ['Check the integer and prime rules', '5 has no fractional part. Its only positive factors are 1 and 5.'], ['Check square and rational', '4 < 5 < 9, so 5 is not square. 5 = 5/1, so it is rational and not irrational.']),
  'L1-X02': explanation('Integer, square and rational', ['Check the value and square structure', '9 is an integer and 3 × 3 = 9, so it is square.'], ['Check prime and rational', '9 has the extra factor 3, so it is not prime. 9 = 9/1, so it is rational and not irrational.']),
  'L1-X03': explanation('Not integer and rational', ['Place the decimal between integers', '0 < 0.5 < 1, so 0.5 is not an integer.'], ['Write it as an exact fraction', '0.5 = 1/2, so it is rational and not irrational.']),
  'L1-X04': explanation('Not integer and irrational', ['Compare with neighbouring square numbers', '1 < 2 < 4, so 1 < √2 < 2. √2 is not an integer.'], ['Check whether it has an exact rational form', '2 is not a perfect square. √2 cannot be written exactly as a fraction of two integers, so it is irrational.']),
  'L1-X05': explanation('Integer, square and rational', ['Work out the expression first', '8 ÷ 2 = 4'], ['Check each property of 4', '4 is an integer. 2 × 2 = 4, so it is square. 4 = 4/1, so it is rational.', '4 has three positive factors, so it is not prime. A rational number is not irrational.']),
  'L1-T01': { ...explanation('3 or 11', ['Check the prime candidates', '3 has factors 1 and 3. 11 has factors 1 and 11. Each has exactly two positive factors.'], ['Rule out the others', '8 and 16 have the extra factor 2. 27 has the extra factor 3.']), answerLabel: 'Either answer works' },
  'L1-T02': explanation('1, 2, 3, 6, 9, 18', ['Find the factor pairs', '1 × 18 = 18', '2 × 9 = 18', '3 × 6 = 18'], ['Check that the list is complete', '4 and 5 do not divide 18 exactly. The next pair, 6 × 3, repeats a pair already found.'], ['List both numbers from each pair', 'Write each positive factor once, in any order.']),
  'L1-T03': explanation('Integer, square, rational, multiple of 5 and factor of 100', ['Check integer, square and prime', '25 is an integer. 5 × 5 = 25, so it is square.', 'It has the extra factor 5, so it is not prime.'], ['Check rational', '25 = 25/1, an exact fraction of two integers.'], ['Check the multiple and factor relationships', '5 × 5 = 25, so 25 is a multiple of 5.', '100 ÷ 25 = 4 with no remainder, so 25 is a factor of 100.']),
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
