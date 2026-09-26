import { withLessonExplanation } from '../lessonExplanations'
import { withSectionVideos } from './lessonVideos'
import { spreader } from '../../written-methods/model'
import type { IntegerValueVisualDefinition, LearningState, LessonDefinition, MicroSkillId, NumberOption } from '../types'

const visual = (props: IntegerValueVisualDefinition['props']): IntegerValueVisualDefinition => ({ type: 'integerValues', props })
const binary: NumberOption[] = [{ id: 'integer', label: 'Integer' }, { id: 'non-integer', label: 'Non-integer' }]
const spread = spreader()
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
  question('D-I-07', 'Why are all three integers?', { kind: 'equivalentForms' }, spread([
    { id: 'value', label: 'Each has the value 2.' }, { id: 'positive', label: 'Every positive number is an integer.' }, { id: 'notation', label: 'Decimals and fractions are always integers.' },
  ]), 'value', '2, 2.0 and 4/2 all represent 2, an integer. A decimal point or fraction bar does not decide the category.', 'D-I-08'),
  teaching('D-I-08', 'Some square roots are integers', 'Work out each square root, then see which two whole numbers it sits between.', 'rootsWorked', 'D-I-09'),
  question('D-I-09', 'Is √81 an integer?', { kind: 'rootCheck', radicand: 81, lower: 8, upper: 10 }, binary, 'integer', '√81 is an integer. Since 9 × 9 = 81, √81 = 9.', 'D-I-10', 'independent'),
  question('D-I-10', 'Is √20 an integer?', { kind: 'rootCheck', radicand: 20, lower: 4, upper: 5 }, binary, 'non-integer', '√20 = 4.472…, so it sits between 4 and 5. It is not an integer.', 'D-I-11', 'independent'),
  question('D-I-11', 'Write down all the numbers from the list that are integers.', { kind: 'challenge' }, ['−7', '1.5', '0', '12/4', '√11', '26'].map(label => ({ id: label, label })), ['−7', '0', '12/4', '26'], '−7, 0, 12/4 and 26 are integers; 12/4 = 3. The other values lie between integer ticks: 1 < 1.5 < 2 and 3 < √11 < 4.', 'D-P-01', 'mastery'),
  question('D-P-01', 'Circle the number that is an integer.', { kind: 'challenge' }, ['4.2', '−15', '3/8', '√7'].map(label => ({ id: label, label })), '−15', '−15 is an integer. 4.2 and 3/8 = 0.375 have fractional parts. Since 2² < 7 < 3², √7 lies between 2 and 3.', 'D-P-02', 'independent'),
  question('D-P-02', 'Write down all the numbers from the list that are not integers.', { kind: 'challenge' }, ['−2', '6.5', '0', '20/5', '√49', '11/4'].map(label => ({ id: label, label })), ['6.5', '11/4'], '6.5 and 11/4 = 2.75 are non-integers. The others are integers: −2, 0, 20/5 = 4 and √49 = 7.', 'D-P-03', 'independent'),
  question('D-P-03', 'Write down all the numbers from the list that are integers.', { kind: 'challenge' }, ['18/6', '√20', '−9', '2.75', '√81'].map(label => ({ id: label, label })), ['18/6', '−9', '√81'], '18/6 = 3, −9 and √81 = 9 are integers. √20 lies between 4 and 5, and 2.75 lies between 2 and 3.', 'D-P-04', 'independent'),
  question('D-P-04', 'Explain why √20 is not an integer.', { kind: 'rootCheck', radicand: 20, lower: 4, upper: 5 }, spread([
    { id: 'between', label: 'It lies strictly between 4 and 5.' },
    { id: 'root', label: 'Every square root is a non-integer.' },
    { id: 'twenty', label: '20 is a non-integer.' },
  ]), 'between', '4² = 16 and 5² = 25, so 4 < √20 < 5. There is no integer strictly between 4 and 5. Some square roots are integers: √81 = 9.', 'D-P-05', 'transfer'),
  question('D-P-05', 'n is a number, and √n = 6. Is n an integer? Show how you know.', { kind: 'squareEquation' }, spread([
    { id: '36', label: 'Yes: n = 36, because 6 × 6 = 36.' },
    { id: '6', label: 'Yes: n = 6, because √n = 6.' },
    { id: '12', label: 'Yes: n = 12, because 6 × 2 = 12.' },
  ]), '36', 'Yes. √n = 6 means n = 6² = 36. Squaring undoes the square root, and 36 is an integer.', 'D-P-06', 'transfer'),
  {
    id: 'D-P-06', microSkillId: 'whole-values', phase: 'transfer', teachingIntent: 'Generate a non-integer value strictly between two consecutive integers.',
    content: { title: 'Write down a non-integer that is between 6 and 7.' }, component: visual({ kind: 'openInterval' }),
    interaction: { type: 'numericInput', acceptanceRule: 'openInterval', lowerBound: 6, upperBound: 7, correctAnswer: 6.5, displayAnswer: 'any number strictly between 6 and 7, for example 6.5', placeholder: 'Decimal or fraction' },
    feedback: {
      correct: { message: 'That’s right.', evidence: 'Your value lies strictly between 6 and 7, so it is a non-integer. Many answers work, including 6.2, 6.5 and 13/2.' },
      incorrect: { message: 'Here’s an example.', evidence: '6.5 works: 6 < 6.5 < 7. Any value strictly between these ticks is a non-integer. The endpoints 6 and 7 do not count.' },
    },
    transition: { onCorrect: 'D-P-07', onIncorrect: 'D-P-07' }, completionCondition: 'See feedback, then Continue regardless of correctness.',
  },
  question('D-P-07', 'Maya says: “The number exactly halfway between two integers is always a non-integer.” Is Maya correct? Give a reason for your answer.', { kind: 'midpointClaim' }, [
    { id: 'always', label: 'Yes: halfway between 4 and 5 is 4.5.' },
    { id: 'counterexample', label: 'No: halfway between 2 and 8 is 5.' },
    { id: 'never', label: 'No: a midpoint is never a non-integer.' },
  ], 'counterexample', 'Maya is not correct. Halfway between 2 and 8 is (2 + 8) ÷ 2 = 5, an integer. One counterexample disproves “always”. Between neighbouring integers, such as 4 and 5, the midpoint is a non-integer.', 'D-SI-01', 'mastery'),

]

type DSectionId = 'special-integers' | 'rational-numbers' | 'irrational-numbers' | 'multiples-factors'
type ConceptProps = Extract<IntegerValueVisualDefinition['props'], { kind: 'concept' }>
type WithoutKind<T> = T extends unknown ? Omit<T, 'kind'> : never
type ConceptInput = WithoutKind<ConceptProps>
const concept = (props: ConceptInput): IntegerValueVisualDefinition => visual({ kind: 'concept', ...props } as ConceptProps)
const options = (...labels: string[]): NumberOption[] => labels.map(label => ({ id: label, label }))
const mixed = (...labels: string[]) => spread(options(...labels))

function dTeaching(id: string, microSkillId: DSectionId, title: string, body: string, props: ConceptInput, next: string): LearningState {
  return {
    id, microSkillId, phase: 'teach', teachingIntent: title, content: { title, body }, component: concept(props),
    interaction: { type: 'continue' }, transition: { onComplete: next },
    completionCondition: 'Explore the teaching model if useful, then choose Continue.',
  }
}

function dSelect(id: string, microSkillId: DSectionId, title: string, props: ConceptInput, answerOptions: NumberOption[], answer: string | string[], next: string, phase: LearningState['phase'] = 'independent', oneOf = false): LearningState {
  return {
    id, microSkillId, phase, teachingIntent: title, content: { title }, component: concept(props),
    interaction: { type: oneOf ? 'select' : Array.isArray(answer) ? 'multiSelect' : 'select', options: answerOptions, correctAnswer: answer, acceptanceRule: oneOf ? 'oneOf' : undefined },
    feedback: { correct: { message: 'That’s right.' }, incorrect: { message: 'Here’s the complete answer.' } },
    transition: next ? { onCorrect: next, onIncorrect: next } : {},
    completionCondition: 'See the correct answer and full explanation, then choose Continue.',
  }
}

function dNumeric(id: string, microSkillId: DSectionId, title: string, props: ConceptInput, answer: number, next: string, placeholder = 'Enter a number'): LearningState {
  return {
    id, microSkillId, phase: 'independent', teachingIntent: title, content: { title }, component: concept(props),
    interaction: { type: 'numericInput', correctAnswer: answer, acceptanceRule: 'numeric', placeholder },
    feedback: { correct: { message: 'That’s right.' }, incorrect: { message: 'Here’s the complete answer.' } },
    transition: { onCorrect: next, onIncorrect: next },
    completionCondition: 'See the correct answer and full explanation, then choose Continue.',
  }
}

export const variantDSpecialIntegerStates: LearningState[] = [
  dTeaching('D-SI-01', 'special-integers', 'Square numbers', 'A number multiplied by itself is a square number.', { concept: 'squareArrays' }, 'D-SI-02'),
  dTeaching('D-SI-02', 'special-integers', 'Cube numbers', 'A number multiplied by itself three times is a cube number.', { concept: 'cubeLayers' }, 'D-SI-03A'),
  {
    id: 'D-SI-03A', microSkillId: 'special-integers', phase: 'teach',
    teachingIntent: 'Introduce primes through a 1–50 grid and inspect factor evidence for every number.',
    content: {
      title: 'Explore prime numbers to 50',
      body: 'A prime number has exactly two factors: 1 and itself.',
      prompt: 'Tap a number to see its factors.',
    },
    component: { type: 'primeGrid', props: { max: 50, highlightedPrimes: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47] } },
    interaction: { type: 'continue' }, transition: { onComplete: 'D-SI-04' },
    completionCondition: 'Explore factor lists if useful, then choose Continue.',
  },
  dSelect('D-SI-04', 'special-integers', 'Show that 64 is both a square number and a cube number.', { concept: 'mathCard', expression: '64', revealLines: ['8 × 8 = 64', '4 × 4 × 4 = 64'] }, options('64 = 8 × 8', '64 = 4 × 4 × 4', '64 is prime'), ['64 = 8 × 8', '64 = 4 × 4 × 4'], 'D-SI-05'),
  dSelect('D-SI-05', 'special-integers', 'Write down all the prime numbers between 20 and 30.', { concept: 'mathCard', expression: '21, 22, 23, 24, 25, 26, 27, 28, 29' }, options('21', '22', '23', '24', '25', '26', '27', '28', '29'), ['23', '29'], 'D-SI-06'),
  dSelect('D-SI-06', 'special-integers', 'Explain why 51 is not a prime number.', { concept: 'mathCard', expression: '51', revealLines: ['51 ÷ 3 = 17'] }, mixed('51 = 3 × 17, so it has factors other than 1 and itself', '51 is odd', '51 is greater than 50'), '51 = 3 × 17, so it has factors other than 1 and itself', 'D-SI-07'),
  dNumeric('D-SI-07', 'special-integers', 'A number is a square number, is odd, and lies between 30 and 50. Find the number, showing your method.', { concept: 'mathCard', expression: '30 < ? < 50', revealLines: ['36 and 49', '49 is odd, so the number is 49'] }, 49, 'D-SI-08'),
  dSelect('D-SI-08', 'special-integers', 'Write down the first three cube numbers.', { concept: 'mathCard', expression: 'n³', revealLines: ['1, 8, 27'] }, options('1', '8', '27', '64'), ['1', '8', '27'], 'D-SI-09'),
  dSelect('D-SI-09', 'special-integers', 'Show that 12 is not a prime number by writing it as a product of prime factors.', { concept: 'mathCard', expression: '12', revealLines: ['12 = 2 × 6', '6 = 2 × 3', '12 = 2 × 2 × 3'] }, mixed('2 × 2 × 3', '2 × 6', '3 × 4'), '2 × 2 × 3', 'D-SI-10'),
  dSelect('D-SI-10', 'special-integers', 'State whether 1 is a prime number. Give a reason for your answer.', { concept: 'mathCard', expression: '1', revealLines: ['No — a prime number has exactly two factors, but 1 only has one factor (itself)'] }, mixed('No — a prime number has exactly two factors, but 1 only has one factor (itself)', 'Yes — it divides by itself', 'No — all odd numbers are composite'), 'No — a prime number has exactly two factors, but 1 only has one factor (itself)', 'D-SI-11'),
  dNumeric('D-SI-11', 'special-integers', 'N is a two-digit number. N is a square number and a multiple of 5. Find N.', { concept: 'mathCard', expression: 'N', revealLines: ['16, 25, 36, 49, 64, 81', 'N = 25'] }, 25, 'D-R-01'),
]

export const variantDRationalStates: LearningState[] = [
  dTeaching('D-R-01', 'rational-numbers', 'From a fraction to a decimal', 'A rational number can be written exactly as a fraction of two integers. Build five eighths, then connect it to division.', { concept: 'fractionDecimal' }, 'D-R-02'),
  dTeaching('D-R-02', 'rational-numbers', 'Decimals may stop or repeat', 'Terminating and recurring decimals are rational. Integers are rational too because they can be written over 1.', { concept: 'rationalForms' }, 'D-R-03'),
  dSelect('D-R-03', 'rational-numbers', 'Show that 0·45 is a rational number.', { concept: 'mathCard', expression: '0·45', revealLines: ['0·45 = 45/100'] }, mixed('0·45 = 45/100 = 9/20', '0·45 cannot be a fraction', '0·45 = 45/10'), '0·45 = 45/100 = 9/20', 'D-R-04'),
  dSelect('D-R-04', 'rational-numbers', 'Circle the number that is rational.', { concept: 'mathCard', expression: 'π,  √10,  0·6,  √12', revealLines: ['√10 and √12 are not exact roots, and π never ends or repeats', '0·6'] }, options('π', '√10', '0·6', '√12'), '0·6', 'D-R-05'),
  dSelect('D-R-05', 'rational-numbers', 'Write the recurring decimal 0·7 as a fraction in its simplest form.', { concept: 'mathCard', expression: '0·7', revealLines: ['10x = 7·7…', '10x − x = 7', 'x = 7/9'] }, mixed('7/9', '7/10', '77/100'), '7/9', 'D-R-06'),
  dSelect('D-R-06', 'rational-numbers', 'Show that 5/8 is a rational number that can also be written as a terminating decimal.', { concept: 'mathCard', expression: '5/8', revealLines: ['5 ÷ 8 = 0·625'] }, mixed('0·625 terminates, and 5/8 is already a fraction of integers, so it is rational', 'Every fraction has a recurring decimal', '0·625 is irrational because it has three decimal places'), '0·625 terminates, and 5/8 is already a fraction of integers, so it is rational', 'D-R-07'),
  dSelect('D-R-07', 'rational-numbers', 'Convert the recurring decimal 0·18 (= 0·181818…) to a fraction.', { concept: 'mathCard', expression: '0·18', revealLines: ['x = 0.181818…', '100x = 18.181818…', '100x − x = 18.181818… − 0.181818…', '99x = 18', 'x = 18/99', 'x = 2/11'] }, mixed('2/11', '18/100', '18/11'), '2/11', 'D-R-08'),
  dSelect('D-R-08', 'rational-numbers', 'State whether every integer is a rational number. Give a reason for your answer.', { concept: 'mathCard', expression: 'n = n/1', revealLines: ['Any integer n can be written as n ÷ 1', 'That is already a fraction of two integers, with a denominator of 1'] }, mixed('Yes — every integer n can be written as the fraction n/1, so every integer is rational', 'No — integers cannot be fractions', 'Only positive integers are rational'), 'Yes — every integer n can be written as the fraction n/1, so every integer is rational', 'D-IR-01'),
]

export const variantDIrrationalStates: LearningState[] = [
  dTeaching('D-IR-01', 'irrational-numbers', 'Place √20 between two integers', 'Compare the neighbouring square numbers, place the root, then reveal its non-terminating, non-recurring decimal.', { concept: 'rootJourney' }, 'D-IR-02'),
  dTeaching('D-IR-02', 'irrational-numbers', 'Exact root or non-exact root?', 'The root sign alone does not decide the number type. Test whether the number under it is a square number.', { concept: 'rootCompare' }, 'D-IR-03'),
  dTeaching('D-IR-03', 'irrational-numbers', 'Simplify √45', 'Take out the square factor. A non-zero rational number multiplied by an irrational number is irrational. Zero is the exception.', { concept: 'surdSimplify' }, 'D-IR-04'),
  dSelect('D-IR-04', 'irrational-numbers', 'Show that √20 is an irrational number.', { concept: 'rootInterval', radicand: 20, lower: 4, upper: 5, decimal: '4.472135…' }, mixed('√20 cannot be written as a whole number or an exact fraction, so it is irrational', 'Every square root is irrational', '20 is an irrational number'), '√20 cannot be written as a whole number or an exact fraction, so it is irrational', 'D-IR-05'),
  dSelect('D-IR-05', 'irrational-numbers', 'Circle the number that is irrational.', { concept: 'mathCard', expression: '0·5   √16   √17   3/4', revealLines: ['√16 = 4, and 0·5 and 3/4 are already exact fractions', '√17'] }, options('0·5', '√16', '√17', '3/4'), '√17', 'D-IR-06'),
  dSelect('D-IR-06', 'irrational-numbers', 'Explain why √30 is irrational.', { concept: 'rootInterval', radicand: 30, lower: 5, upper: 6, decimal: '5.477225…' }, mixed('√30 sits between 5 and 6 but is not exactly either, so its decimal never stops or repeats', '30 is even, so its root is irrational', '√30 is greater than 5'), '√30 sits between 5 and 6 but is not exactly either, so its decimal never stops or repeats', 'D-IR-07'),
  dSelect('D-IR-07', 'irrational-numbers', 'Show that √45 can be written in the form a√b, and explain why the result is still irrational.', { concept: 'mathCard', expression: '√45', revealLines: ['45 = 9 × 5', '√45 = √9 × √5', '√9 = 3', '√45 = 3√5', '5 is not a square number.', 'Therefore, √5 is irrational.', 'This means 3√5 is also irrational.'] }, mixed('5 is not a square number, so √5 (and therefore 3√5) is still irrational', '9√5 is rational', '15 is rational'), '5 is not a square number, so √5 (and therefore 3√5) is still irrational', 'D-IR-08'),
  dSelect('D-IR-08', 'irrational-numbers', 'Write down an irrational number that lies between 3 and 4.', { concept: 'mathCard', expression: '3 < ? < 4', revealLines: ['√10 (or √11, √12, √13, √14, √15)'] }, options('√10', '√11', '√12', '√13', '√14', '√15', '3.5', '√16'), ['√10', '√11', '√12', '√13', '√14', '√15'], 'D-IR-09', 'independent', true),
  dSelect('D-IR-09', 'irrational-numbers', 'Show that 4 + √13 is irrational.', { concept: 'mathCard', expression: '4 + √13', revealLines: ['3² = 9', '4² = 16', '13 is between 9 and 16.', 'Therefore, √13 is between 3 and 4.', '√13 = 3.605551275…', '4 + √13 = 7.605551275…', 'The decimal still does not stop or repeat.', 'Therefore, 4 + √13 is irrational.'] }, mixed('4 + √13 is irrational, because adding a rational number to an irrational one never creates a pattern or an end', 'Adding an integer always makes a number rational', 'The answer is irrational because it is greater than 7'), '4 + √13 is irrational, because adding a rational number to an irrational one never creates a pattern or an end', 'D-IR-10'),
  dSelect('D-IR-10', 'irrational-numbers', 'State whether every square root is irrational. Give a reason for your answer.', { concept: 'mathCard', expression: '√16 = 4', revealLines: ['16 is a square number, since 4² = 16', 'That means the root comes out exactly, with nothing left over'] }, mixed('No — the square root of a square number, like √16 = 4, is a whole number, so it is rational', 'Yes — every root has endless digits', 'No — every square root is an integer'), 'No — the square root of a square number, like √16 = 4, is a whole number, so it is rational', 'D-IR-11'),
  dSelect('D-IR-11', 'irrational-numbers', 'Priya says this. Show that Priya is wrong. “Multiplying two irrational numbers always gives an irrational answer.”', { concept: 'mathCard', expression: 'irrational × irrational', revealLines: ['√5 × √5 = 5', '5 can be written as 5/1, a fraction of two integers'] }, mixed('No — √5 × √5 = 5, which is rational, so Priya\'s statement is false', '√2 × √3 = √6', '2 × √5 = 2√5'), 'No — √5 × √5 = 5, which is rational, so Priya\'s statement is false', 'D-IR-12'),
  dSelect('D-IR-12', 'irrational-numbers', 'Write down an irrational number that lies between 2 and 3.', { concept: 'mathCard', expression: '2 < ? < 3', revealLines: ['√5 (or √6, √7, √8)'] }, options('√5', '√6', '√7', '√8', '2.5', '√9'), ['√5', '√6', '√7', '√8'], 'D-IR-13', 'independent', true),
  dSelect('D-IR-13', 'irrational-numbers', 'Jack says this. Show that Jack is wrong. “If you add two irrational numbers, the answer is always irrational.”', { concept: 'mathCard', expression: 'irrational + irrational', revealLines: ['√2 + (−√2) = 0', '0 can be written as 0/1, a fraction of two integers'] }, mixed('No — √2 + (−√2) = 0, which is rational, so Jack\'s statement is false', '√2 + √3', '1 + √2'), 'No — √2 + (−√2) = 0, which is rational, so Jack\'s statement is false', 'D-MF-01'),
]

export const variantDMultiplesFactorsStates: LearningState[] = [
  dTeaching('D-MF-01', 'multiples-factors', 'Build multiples with equal hops', 'Multiples of 6 are the landing points you reach by adding another 6 each time.', { concept: 'multipleHops' }, 'D-MF-02'),
  dTeaching('D-MF-02', 'multiples-factors', 'Find factors with rectangles', 'A factor pair makes a complete rectangle with no counters left over. Explore the rectangles for 24.', { concept: 'factorRectangles' }, 'D-MF-03'),
  dTeaching('D-MF-03', 'multiples-factors', 'Find the highest common factor', 'List both factor sets, mark the shared factors, then choose the greatest shared value.', { concept: 'hcfCompare' }, 'D-MF-04'),
  dTeaching('D-MF-04', 'multiples-factors', 'Find the lowest common multiple', 'List multiples until both lists reach the same value. The first shared landing point is the LCM.', { concept: 'lcmCompare' }, 'D-MF-05'),
  dSelect('D-MF-05', 'multiples-factors', 'List all the factors of 42.', { concept: 'mathCard', expression: '42', revealLines: ['1 × 42 = 42', '2 × 21 = 42', '3 × 14 = 42', '6 × 7 = 42'] }, options('1', '2', '3', '4', '6', '7', '12', '14', '21', '42'), ['1', '2', '3', '6', '7', '14', '21', '42'], 'D-MF-06'),
  dSelect('D-MF-06', 'multiples-factors', 'Write down the first four multiples of 9.', { concept: 'mathCard', expression: '9 × n', revealLines: ['9, 18, 27, 36'] }, options('9', '18', '27', '36', '45'), ['9', '18', '27', '36'], 'D-MF-07'),
  dNumeric('D-MF-07', 'multiples-factors', 'Find the highest common factor of 24 and 36.', { concept: 'mathCard', expression: 'HCF(24, 36)', revealLines: ['Factors of 24', '1, 2, 3, 4, 6, 8, 12, 24', 'Factors of 36', '1, 2, 3, 4, 6, 9, 12, 18, 36', 'Common factors', '1, 2, 3, 4, 6, 12', 'HCF = 12'] }, 12, 'D-MF-08'),
  dNumeric('D-MF-08', 'multiples-factors', 'Find the lowest common multiple of 8 and 12.', { concept: 'lcmCompare' }, 24, 'D-MF-09'),
  dSelect('D-MF-09', 'multiples-factors', 'Write down a common factor of 18 and 27, other than 1.', { concept: 'mathCard', expression: '18 and 27', revealLines: ['3 (or 9)'] }, options('3', '6', '9', '18'), ['3', '9'], 'D-MF-10', 'independent', true),
  dSelect('D-MF-10', 'multiples-factors', 'Two numbers both lie between 10 and 30, and their highest common factor is 6. Find one possible pair.', { concept: 'mathCard', expression: '10 < numbers < 30', revealLines: ['12, 18, 24', '12 and 18, or 18 and 24'] }, options('12 and 18', '12 and 24', '18 and 24', '24 and 30'), ['12 and 18', '18 and 24'], 'D-MF-11', 'independent', true),
  dSelect('D-MF-11', 'multiples-factors', 'State whether every number is a factor of itself. Give a reason for your answer.', { concept: 'mathCard', expression: 'n ÷ n = 1', revealLines: ['Yes — any number divided by itself gives 1, with no remainder'] }, mixed('Yes — any number divided by itself gives 1, with no remainder', 'No — factors must be smaller', 'Only prime numbers are factors of themselves'), 'Yes — any number divided by itself gives 1, with no remainder', 'D-MF-12'),
  dSelect('D-MF-12', 'multiples-factors', 'Tomas says this. Show that Tomas is wrong. “The LCM of two numbers is always bigger than both numbers.”', { concept: 'mathCard', expression: 'LCM(4, 8)', revealLines: ['LCM of 4 and 8 = 8'] }, mixed('No — the LCM of 4 and 8 is 8, which is not bigger than 8', 'LCM of 3 and 5 = 15', 'LCM of 2 and 7 = 14'), 'No — the LCM of 4 and 8 is 8, which is not bigger than 8', ''),
]

export const variantDLesson: LessonDefinition = {
  id: 'L001',
  title: 'Numbers',
  level: 'GCSE Foundation',
  goal: 'I can look at a number, identify what type of number it is, and explain why.',
  states: withSectionVideos([
    ...variantDOpeningStates,
    ...variantDSpecialIntegerStates,
    ...variantDRationalStates,
    ...variantDIrrationalStates,
    ...variantDMultiplesFactorsStates,
  ]).map(withLessonExplanation),
}

export const variantDMicroSkillLabels: Partial<Record<MicroSkillId, string>> = {
  'whole-values': 'Integers & non-integers',
  'special-integers': 'Special integers',
  'rational-numbers': 'Rational numbers',
  'irrational-numbers': 'Irrational numbers',
  'multiples-factors': 'Multiples & factors',
}
