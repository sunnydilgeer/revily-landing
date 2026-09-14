import type { FeedbackDefinition, InteractionDefinition, LearningState, LessonDefinition, MicroSkillId } from '../../number-types/types'

export type PlaceVisual =
  | { kind: 'number'; value: string; highlights?: number[]; guideIndex?: number }
  | { kind: 'compare'; values: [string, string] }
  | { kind: 'alignment'; values: string[]; highlightPlace?: number }
  | { kind: 'parts'; parts: string[] }
  | { kind: 'direction' | 'summary' }
export type PlaceLessonVisual = PlaceVisual
  | { kind: 'explore'; value: string; initialIndex: number }
  | { kind: 'zeroes' }
  | { kind: 'equivalent' }
  | { kind: 'worked'; initial: PlaceVisual; steps: Array<{ visual: PlaceVisual; instruction: string; equation?: string }> }
export type PlaceHint = { label: string; text: string; guide?: { value: string; index: number }; alignment?: string[] }
export type PlaceState = LearningState & { visual: PlaceLessonVisual; hints?: PlaceHint[] }
type Working = NonNullable<FeedbackDefinition['workedExplanation']>
const number = (value: string, ...highlights: number[]): PlaceVisual => ({ kind: 'number', value, highlights })
const select = (labels: string[], correct: number): InteractionDefinition => ({ type: 'select', options: labels.map((label, i) => ({ id: String(i), label })), correctAnswer: String(correct) })
const numeric = (value: number, displayAnswer: string): InteractionDefinition => ({ type: 'numericInput', correctAnswer: value, displayAnswer, acceptanceRule: 'normalisedNumber', placeholder: 'Your answer' })
const multiple = (labels: string[], correct: number[]): InteractionDefinition => ({ type: 'multiSelect', options: labels.map((label, i) => ({ id: String(i), label })), correctAnswer: correct.map(String), acceptanceRule: 'unorderedSet' })
const working = (answer: string, ...steps: Array<[string, string]>): Working => ({ answer, steps: steps.map(([title, line]) => ({ title, lines: [line] })) })
const hint = (text: string, guide?: { value: string; index: number }): PlaceHint[] => [{ label: 'Method', text, guide }]
const valueHint = (value: string, index: number) => hint('Find the marked digit’s column. Its value is the digit multiplied by one unit of that column.', { value, index })
const compareHint = (values: string[]) => [{ label: 'Align the places', text: 'Add trailing zeroes to line up matching places. Compare from the left; stop at the first different digit.', alignment: values }]
const states: PlaceState[] = []
function teach(topic: MicroSkillId, title: string, visual: PlaceLessonVisual, body?: string) {
  add(topic, title, visual, { type: 'continue' }, undefined, undefined, body, 'teach')
}
function add(topic: MicroSkillId, title: string, visual: PlaceLessonVisual, interaction: InteractionDefinition, explanation?: Working, hints?: PlaceHint[], body?: string, phase: LearningState['phase'] = 'guided') {
  states.push({ id: `L3B-${String(states.length + 1).padStart(2, '0')}`, microSkillId: topic, phase, teachingIntent: title,
    content: { title, body }, visual, hints, interaction,
    component: { type: 'placeValueChart', props: { value: 'value' in visual ? visual.value : '0' } },
    feedback: explanation ? { correct: { message: 'Correct.', workedExplanation: explanation }, incorrect: { message: 'Here’s the working.', workedExplanation: explanation } } : undefined,
    transition: {}, completionCondition: 'View the explanation and continue regardless of accuracy.',
  })
}
const digit = 'digit-place-value', decimal = 'decimal-places', zero = 'placeholder-zeroes', compare = 'decimal-comparison', mixed = 'mixed'
teach(digit, 'Same digit. Different values.', { kind: 'explore', value: '3,333', initialIndex: 1 }, 'Tap a 3 to see its place and value. The column tells you what that digit is worth.')
add(digit, 'Which place is the marked 5 in?', number('4,582', 1), select(['Tens', 'Hundreds', 'Thousands'], 1), working('Hundreds', ['Count whole-number places from the right.', '2 is in ones, 8 is in tens, 5 is in hundreds.']), hint('Start at the rightmost digit: ones, tens, hundreds, thousands. Count one column at a time.'))
add(digit, 'What is the value of the marked 5?', number('4,582', 1), numeric(500, '500'), working('500', ['Use the hundreds column.', '5 hundreds = 5 × 100'], ['Calculate the amount.', '5 × 100 = 500']), valueHint('4,582', 1))
teach(digit, 'The same method works for larger numbers', { kind: 'worked', initial: number('72,406,981', 2), steps: [
  { visual: { kind: 'number', value: '72,406,981', highlights: [2], guideIndex: 2 }, instruction: 'Find the marked 4’s column: hundred thousands.' },
  { visual: number('72,406,981', 2), instruction: 'Multiply the digit by one unit of its column.', equation: '4 × 100,000 = 400,000' },
] })
add(digit, 'What is the value of the marked 5?', number('18,852,534', 3), numeric(50000, '50,000'), working('50,000', ['Find the marked 5, not the other 5.', 'The marked 5 is in the ten-thousands column.'], ['Multiply by the column’s unit.', '5 × 10,000 = 50,000']), valueHint('18,852,534', 3), undefined, 'independent')
add(digit, 'How do the values of the marked 8s compare?', number('18,852,534', 1, 2), select(['The first is worth ten times the second.', 'They have the same value.', 'The second is worth ten times the first.'], 0), working('The first 8 is worth ten times the second.', ['Find each digit’s value.', 'First 8: 8,000,000. Second 8: 800,000.'], ['Compare the amounts.', '8,000,000 ÷ 800,000 = 10']), hint('The 8s are in neighbouring columns. Each column to the left is worth ten times as much.'))
teach(decimal, 'Each place to the right is one tenth as large', { kind: 'explore', value: '4.444', initialIndex: 1 }, 'The decimal point separates ones from tenths. After tenths come hundredths, then thousandths.')
add(decimal, 'Which place is the marked 7 in?', number('6.47', 2), select(['Tenths', 'Hundredths', 'Thousandths'], 1), working('Hundredths', ['Count places to the right of the decimal point.', '4 is in tenths; 7 is in hundredths.']), hint('The first digit after the decimal point is tenths. The second is hundredths; the third is thousandths.'))
add(decimal, 'What is the value of the marked 7?', number('6.47', 2), numeric(0.07, '0.07'), working('0.07', ['The 7 is in the hundredths column.', '7 hundredths = 7 × 0.01'], ['Calculate its value.', '7 × 0.01 = 0.07']), valueHint('6.47', 2))
teach(decimal, 'Count the places from the decimal point', { kind: 'worked', initial: number('39.41285', 4), steps: [
  { visual: { kind: 'number', value: '39.41285', highlights: [4], guideIndex: 4 }, instruction: '4 is tenths, 1 is hundredths, and the marked 2 is thousandths.' },
  { visual: number('39.41285', 4), instruction: 'Use one thousandth for each of the two units.', equation: '2 × 0.001 = 0.002' },
] })
add(decimal, 'What is the value of the marked 8?', number('7.06482', 4), numeric(0.0008, '0.0008'), working('0.0008', ['Count four places after the decimal point.', '0 tenths, 6 hundredths, 4 thousandths, 8 ten-thousandths.'], ['Multiply by one ten-thousandth.', '8 × 0.0001 = 0.0008']), valueHint('7.06482', 4), undefined, 'independent')
teach(zero, 'Zero holds an empty place', { kind: 'zeroes' }, 'Fill the empty columns with zeroes so the other digits stay in place.')
add(zero, 'Which number matches these parts?', { kind: 'parts', parts: ['6 ten-thousands', '2 hundreds', '4 ones', '3 hundredths'] }, select(['6,204.3', '60,240.3', '60,204.03', '60,204.30'], 2), working('60,204.03', ['Write the value of each part.', '60,000 + 200 + 4 + 0.03'], ['Keep a zero in every empty column.', '60,000 + 200 + 4 + 0.03 = 60,204.03']), hint('Start with the largest place. Leave a column for each missing place, including tenths. Zeroes hold those empty columns.'))
add(zero, 'Write these parts as one number', { kind: 'parts', parts: ['8,000', '+ 6', '+ 0.09'] }, numeric(8006.09, '8,006.09'), working('8,006.09', ['Place the non-zero digits.', '8 thousands, 6 ones, 9 hundredths.'], ['Fill the hundreds, tens and tenths with zeroes.', '8,000 + 6 + 0.09 = 8,006.09']), hint('Place each part in its named column. For example, 2,000 + 4 is 2,004 because hundreds and tens are empty.'), undefined, 'independent')
teach(zero, 'A trailing decimal zero keeps the same value', { kind: 'equivalent' }, 'Switch between the forms. Adding zeroes at the end of the decimal part keeps every existing digit in its column.')
add(zero, 'Select both numbers equal to 0.5', number('0.5'), multiple(['0.50', '0.05', '0.500', '5.0'], [0, 2]), working('0.50 and 0.500', ['Keep the 5 in the tenths column.', '0.5 = 0.50 = 0.500'], ['Check the other positions of 5.', '0.05 is five hundredths; 5.0 is five ones.']), hint('A trailing decimal zero adds no value. Check whether the 5 stays in the tenths column in each option.'))
add(zero, '“Any zero can be removed.” Is that true?', { kind: 'compare', values: ['5.07', '5.7'] }, select(['Yes — zeroes never affect a number.', 'No — removing this zero moves 7 from hundredths to tenths.'], 1), working('No. 5.07 and 5.7 have different values.', ['Find the place of 7 in each number.', 'In 5.07, 7 is worth 0.07. In 5.7, 7 is worth 0.7.'], ['Use this as a counterexample to “any zero”.', '5.07 ≠ 5.7']), compareHint(['5.07', '5.7']), undefined, 'transfer')
teach(compare, 'Line up the places, then compare', { kind: 'worked', initial: { kind: 'compare', values: ['3.45', '3.405'] }, steps: [
  { visual: { kind: 'alignment', values: ['3.45', '3.405'] }, instruction: 'Add a trailing zero: 3.45 is also 3.450.' },
  { visual: { kind: 'alignment', values: ['3.45', '3.405'], highlightPlace: -1 }, instruction: 'Start from the left. Both have 3 ones and 4 tenths.' },
  { visual: { kind: 'alignment', values: ['3.45', '3.405'], highlightPlace: -2 }, instruction: 'The hundredths differ: 5 is greater than 0. This decides the comparison.', equation: '3.45 > 3.405' },
] }, 'The > sign means the left number is greater. The < sign means it is smaller.')
add(compare, 'Which sign belongs between these numbers?', { kind: 'compare', values: ['0.7', '0.07'] }, select(['<', '=', '>'], 2), working('0.7 > 0.07', ['Align equal places.', '0.7 = 0.70'], ['Compare the tenths first.', '7 tenths > 0 tenths, so 0.70 > 0.07.']), compareHint(['0.7', '0.07']))
add(compare, 'Which sign belongs between these numbers?', { kind: 'compare', values: ['5.208', '5.28'] }, select(['<', '=', '>'], 0), working('5.208 < 5.28', ['Align equal places.', '5.28 = 5.280'], ['Find the first different place.', 'Ones and tenths match; 0 hundredths < 8 hundredths.']), compareHint(['5.208', '5.28']), undefined, 'independent')
add(compare, 'Does having more decimal digits make 0.405 greater?', { kind: 'compare', values: ['0.405', '0.45'] }, select(['Yes — 405 is greater than 45.', 'No — compare the same places: 0 hundredths is less than 5 hundredths.'], 1), working('No. 0.405 < 0.45', ['Align the decimals instead of comparing digit strings.', '0.45 = 0.450'], ['The tenths match. Compare hundredths next.', '0 < 5, so 0.405 < 0.450.']), compareHint(['0.405', '0.45']), undefined, 'transfer')
teach(compare, 'Use the same method to put numbers in order', { kind: 'worked', initial: { kind: 'parts', parts: ['0.707', '0.07', '0.77', '0.7'] }, steps: [
  { visual: { kind: 'alignment', values: ['0.707', '0.07', '0.77', '0.7'] }, instruction: 'Give every number three decimal places. Their values stay the same.' },
  { visual: { kind: 'alignment', values: ['0.07', '0.7', '0.707', '0.77'] }, instruction: 'Compare from the left and put the smallest first.', equation: '0.07 < 0.7 < 0.707 < 0.77' },
] })
add(compare, 'Put these numbers in order, smallest first', { kind: 'direction' }, { type: 'order', initialOrder: ['1.5', '1.005', '1.055', '1.05'], correctAnswer: ['1.005', '1.05', '1.055', '1.5'], acceptanceRule: 'ordered', displayAnswer: '1.005, 1.05, 1.055, 1.5' }, working('1.005, 1.05, 1.055, 1.5', ['Write matching decimal places.', '1.500, 1.005, 1.055, 1.050'], ['Compare from the left to order them.', '1.005 < 1.050 < 1.055 < 1.500']), compareHint(['1.5', '1.005', '1.055', '1.05']), undefined, 'independent')
add(mixed, 'What is the value of the marked 3?', number('9,304,218', 1), numeric(300000, '300,000'), working('300,000', ['Locate the marked 3.', 'It is in the hundred-thousands column.'], ['Multiply by one unit of the column.', '3 × 100,000 = 300,000']), valueHint('9,304,218', 1), undefined, 'independent')
add(mixed, 'Select the three true statements', number('48,306.075'), multiple(['The 8 has a value of 8,000.', 'The 7 is in the hundredths place.', '48,306.075 < 48,306.57.', 'The 8 has a value of 80,000.', 'The 7 is in the tenths place.', '48,306.075 > 48,306.57.'], [0, 1, 2]), working('8 is worth 8,000; 7 is in hundredths; 48,306.075 < 48,306.57.', ['Read the whole-number columns.', '8 × 1,000 = 8,000'], ['Count places after the decimal point.', '0 tenths, 7 hundredths, 5 thousandths.'], ['Compare the decimal parts; the whole-number parts match.', '0.075 < 0.570, so 48,306.075 < 48,306.57.']), [
  { label: 'Digit value', text: 'Find the column occupied by 8, then multiply by one unit of that column.', guide: { value: '48,306.075', index: 1 } },
  { label: 'Decimal place', text: 'Count from the decimal point: tenths, hundredths, thousandths. Include any zeroes.' },
  { label: 'Comparison', text: 'The whole-number parts are the same. Compare these aligned decimal parts from the left.', alignment: ['0.075', '0.57'] },
], undefined, 'transfer')
teach(mixed, 'You’ve reached the end', { kind: 'summary' }, 'Read each digit’s place, keep the zeroes that hold a column, and compare matching places from the left.')
states.forEach((state, i) => { state.transition = i + 1 < states.length ? { onComplete: states[i + 1].id } : {} })
export const placeValueVariantBLesson: LessonDefinition & { states: PlaceState[] } = { id: 'L003-B', title: 'Place value', level: 'GCSE Foundation', goal: 'Use a digit’s place to read, build, compare and order numbers.', states }
export const placeValueVariantBLabels: Partial<Record<MicroSkillId, string>> = { 'digit-place-value': 'Digit, place & value', 'decimal-places': 'Decimal places', 'placeholder-zeroes': 'The role of zero', 'decimal-comparison': 'Compare & order', mixed: 'Putting it together' }
