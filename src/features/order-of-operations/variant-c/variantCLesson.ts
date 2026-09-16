import type { FeedbackDefinition, InteractionDefinition, LearningState, LessonDefinition, MicroSkillId } from '../../number-types/types'
import type { BidmasContext } from '../variant-b/bidmasRules'
import type { OperationsVisualDefinition } from '../variant-b/variantBLesson'

type Step = { title: string; math: string; evidence: string; previousMath: string }
type WorkedCalculation = { math: string; steps: Step[] }
export type TutorOperationsVisualDefinition = Exclude<OperationsVisualDefinition, { kind: 'worked' }> | { kind: 'tutor-summary' } | {
  kind: 'stacked-worked'
  math: string
  steps: Step[]
  additionalExamples?: WorkedCalculation[]
}
export type LessonVideoDefinition = {
  id: string
  src: string
  poster: string
  title: string
  durationSeconds: number
  sourceFile: string
  textAlternative: string[]
}
export type TutorOperationsState = LearningState & { visual: TutorOperationsVisualDefinition; sourceRef: string; video?: LessonVideoDefinition }
type Working = NonNullable<FeedbackDefinition['workedExplanation']>

const expression = (math: string, referenceContext?: BidmasContext): Extract<OperationsVisualDefinition, { kind: 'expression' }> => ({ kind: 'expression', math, referenceContext })
const worked = (math: string, steps: Step[], additionalExamples?: WorkedCalculation[]): TutorOperationsVisualDefinition => ({ kind: 'stacked-worked', math, steps, additionalExamples })
const step = (title: string, math: string, evidence: string, previousMath: string): Step => ({ title, math, evidence, previousMath })
const working = (answer: string, ...steps: Array<[string, string]>): Working => ({ answer, steps: steps.map(([title, line]) => ({ title, lines: [line] })) })
const select = (labels: string[], correct: number): InteractionDefinition => ({ type: 'select', options: labels.map((label, i) => ({ id: String(i), label })), correctAnswer: String(correct) })
const numeric = (value: number): InteractionDefinition => ({ type: 'numericInput', correctAnswer: value, acceptanceRule: 'numeric', placeholder: 'Your answer' })
const algebra = (value: string, displayAnswer: string): InteractionDefinition => ({ type: 'numericInput', correctAnswer: value, acceptanceRule: 'normalisedAlgebra', displayAnswer, placeholder: 'Simplified expression' })

const states: TutorOperationsState[] = []
function add(
  topic: MicroSkillId,
  title: string,
  sourceRef: string,
  visual: TutorOperationsVisualDefinition,
  interaction: InteractionDefinition = { type: 'continue' },
  explanation?: Working,
  body?: string,
  phase: LearningState['phase'] = 'guided',
) {
  states.push({
    id: `L2C-${String(states.length + 1).padStart(2, '0')}`,
    microSkillId: topic,
    phase: interaction.type === 'continue' ? 'teach' : phase,
    teachingIntent: title,
    sourceRef,
    content: { title, body },
    visual,
    component: { type: 'expressionSteps', props: { expression: 'math' in visual ? visual.math : '', steps: [] } },
    interaction,
    feedback: explanation ? {
      correct: { message: 'Correct.', workedExplanation: explanation },
      incorrect: { message: 'Here is the complete working.', workedExplanation: explanation },
    } : undefined,
    transition: {},
    completionCondition: 'View the complete explanation and continue, regardless of accuracy.',
  })
}

const priority = 'operation-priority'
const equal = 'equal-priority'
const fraction = 'fraction-grouping'
const algebraTopic = 'mixed'

add(priority, 'See the multiplication as one quantity', 'Variant B screen 01', { kind: 'groups' }, undefined, undefined, 'Change the group size. Count the three equal groups by multiplying, then add the two loose counters.')
add(priority, 'Brackets first, then the power', 'N2.1 Q1; video 09.47.34 00:00-00:29', {
  kind: 'stacked-worked', math: '5\\times(2^3-3)+6', steps: [
    step('Work inside the bracket. Calculate the power first.', '5\\times(8-3)+6', '2³ = 8', '5\\times(\\underline{2^3}-3)+6'),
    step('Finish the calculation inside the bracket.', '5\\times5+6', '8 - 3 = 5', '5\\times(\\underline{8-3})+6'),
    step('Multiply before adding.', '25+6', '5 × 5 = 25', '\\underline{5\\times5}+6'),
    step('Add the final 6.', '31', '25 + 6 = 31', '\\underline{25+6}'),
  ],
}, undefined, undefined, 'Watch the clip or choose Step by step to build the working. The underlined calculation produces the line below. You can continue at any time.')
add(priority, 'The classic trap: multiply before adding', 'Video 09.47.34 00:30-00:43', worked('3+4\\times2', [
  step('Calculate the multiplication.', '3+8', '4 × 2 = 8', '3+\\underline{4\\times2}'),
  step('Now add the 3.', '11', 'The value is 11, not 14.', '\\underline{3+8}'),
]), undefined, undefined, 'The multiplication forms one quantity before the addition is completed.')
add(priority, 'Calculate: 4 + 6 × 3', 'N2.1 Q2', expression('4+6\\times3'), numeric(22), working('22', ['Multiply before you add.', '6 × 3 = 18'], ['Now add the 4.', '4 + 18 = 22']))
add(priority, 'Work out: 20 ÷ (2 + 3) × 4', 'N2.1 Q3', expression('20\\div(2+3)\\times4'), numeric(16), working('16', ['Work out the bracket first.', '2 + 3 = 5'], ['Division and multiplication share priority. Work from left to right.', '20 ÷ 5 = 4'], ['Now multiply.', '4 × 4 = 16']))
add(priority, 'Work out: 3 + 4² × (6 - 2)', 'N2.1 Q4a', expression('3+4^2\\times(6-2)'), numeric(67), working('67', ['Work out the bracket.', '6 - 2 = 4'], ['Calculate the power.', '4² = 16'], ['Multiply before adding.', '16 × 4 = 64'], ['Add the 3.', '3 + 64 = 67']))
add(priority, 'Where should the brackets go to make 19?', 'N2.1 Q4b', expression('2+3\\times4-1=19', 'place-brackets'), select(['(2 + 3) × 4 - 1 = 19', '2 + 3 × (4 - 1) = 19', '2 + (3 × 4) - 1 = 19'], 0), working('(2 + 3) × 4 - 1 = 19', ['Group the addition so it happens first.', '2 + 3 = 5'], ['Multiply, then subtract.', '5 × 4 - 1 = 20 - 1 = 19']))
add(priority, 'n = 3 × (5 - 2)². Work out n.', 'N2.1 Q5a', expression('n=3\\times(5-2)^2'), numeric(27), working('n = 27', ['Work out the bracket.', '5 - 2 = 3'], ['Square the bracket result.', '3² = 9'], ['Multiply by 3.', '3 × 9 = 27']), undefined, 'independent')
add(priority, 'Zain says “10 - 4 ÷ 2 = 3”. Show that Zain is wrong.', 'N2.1 Q5b', expression('10-4\\div2'), select(['4 ÷ 2 = 2, then 10 - 2 = 8.', '10 - 4 = 6, then 6 ÷ 2 = 3.', '10 - 2 = 8, then 8 ÷ 4 = 2.'], 0), working('10 - 4 ÷ 2 = 8, not 3', ['Divide before subtracting.', '4 ÷ 2 = 2'], ['Subtract the result from 10.', '10 - 2 = 8']), undefined, 'transfer')
add(priority, 'Priya says brackets always change the answer. Is she correct?', 'N2.1 Q5c', expression('2+3+4'), select(['No. 2 + 3 + 4 and (2 + 3) + 4 both equal 9.', 'Yes. Any brackets force a different operation.', 'Yes. (2 + 3) + 4 equals 5 + 4, not 9.'], 0), working('No - this bracket does not change the value.', ['Test a calculation with only addition.', '2 + 3 + 4 = 9'], ['Insert a bracket without changing the order.', '(2 + 3) + 4 = 5 + 4 = 9']), undefined, 'transfer')

add(equal, 'Division and multiplication: start on the left', 'Variant B screen 13', worked('24\\div6\\times2', [
  step('Start with the operation furthest left.', '4\\times2', '24 ÷ 6 = 4', '\\underline{24\\div6}\\times2'),
  step('Continue to the right.', '8', '4 × 2 = 8', '\\underline{4\\times2}'),
]), undefined, undefined, 'Division and multiplication share priority. The D and M letters do not override left-to-right order.')
add(equal, 'Work out: 18 ÷ 3 × 2', 'Variant B screen 15', expression('18\\div3\\times2'), numeric(12), working('12', ['Start on the left with division.', '18 ÷ 3 = 6'], ['Continue to the right with multiplication.', '6 × 2 = 12']), undefined, 'independent')
add(equal, 'Addition and subtraction: start on the left', 'Variant B screen 16', worked('10-6+2', [
  step('Start with the operation furthest left.', '4+2', '10 - 6 = 4', '\\underline{10-6}+2'),
  step('Continue to the right.', '6', '4 + 2 = 6', '\\underline{4+2}'),
]), undefined, undefined, 'Addition and subtraction share priority too.')
add(equal, '“Addition always comes before subtraction.” Is that true?', 'Variant B screen 18', expression('10-6+2'), select(['Yes - add 6 and 2 first.', 'No - subtract 6 first because it is furthest left.'], 1), working('No. Equal-priority operations are evaluated left to right.', ['Use the expression as a counterexample.', '10 - 6 + 2 = 4 + 2 = 6'], ['Adding 6 and 2 first inserts brackets that are not there.', '10 - (6 + 2) = 2 is a different calculation.']), undefined, 'transfer')

add(fraction, 'A fraction bar makes two complete groups', 'Variant B screen 19', { kind: 'fraction' }, undefined, undefined, 'Explore the numerator and denominator. Either group can be calculated first; divide only after both groups are complete.')
add(fraction, 'Work out the top, the bottom, then divide', 'Video 09.48.11', worked('\\frac{2+2\\times3}{2\\times2}', [
  step('Multiply before adding in the numerator.', '\\frac{2+6}{2\\times2}', '2 × 3 = 6', '\\frac{2+\\underline{2\\times3}}{2\\times2}'),
  step('Finish the numerator.', '\\frac{8}{2\\times2}', '2 + 6 = 8', '\\frac{\\underline{2+6}}{2\\times2}'),
  step('Work out the denominator.', '\\frac{8}{4}', '2 × 2 = 4', '\\frac{8}{\\underline{2\\times2}}'),
  step('Divide the completed top by the completed bottom.', '2', '8 ÷ 4 = 2', '\\underline{\\frac{8}{4}}'),
]), undefined, undefined, 'Top first is a helpful workflow, not a new priority rule.')
add(fraction, 'Simplify the fraction', 'N2.2 Q1', worked('\\frac{3^2+3}{2\\times4+2}', [
  step('Calculate the power before adding in the numerator.', '\\frac{9+3}{2\\times4+2}', '3² = 9', '\\frac{\\underline{3^2}+3}{2\\times4+2}'),
  step('Finish the numerator.', '\\frac{12}{2\\times4+2}', '9 + 3 = 12', '\\frac{\\underline{9+3}}{2\\times4+2}'),
  step('Multiply before adding in the denominator.', '\\frac{12}{8+2}', '2 × 4 = 8', '\\frac{12}{\\underline{2\\times4}+2}'),
  step('Finish the denominator.', '\\frac{12}{10}', '8 + 2 = 10', '\\frac{12}{\\underline{8+2}}'),
  step('Simplify the fraction.', '\\frac65', 'Divide top and bottom by 2.', '\\underline{\\frac{12}{10}}'),
]), undefined, undefined, 'Use Next and Back to build the working, or Replay to start again.')
add(fraction, 'Work out the value of the fraction', 'N2.2 Q2', expression('\\frac{5+3}{2\\times2}'), numeric(2), working('2', ['Work out the numerator.', '5 + 3 = 8'], ['Work out the denominator.', '2 × 2 = 4'], ['Divide the results.', '8/4 = 2']))
add(fraction, 'Simplify the fraction', 'N2.2 Q3', expression('\\frac{4^2-6}{3+2\\times1}'), numeric(2), working('2', ['Calculate the power, then subtract in the numerator.', '4² - 6 = 16 - 6 = 10'], ['Multiply before adding in the denominator.', '3 + 2 × 1 = 3 + 2 = 5'], ['Divide the results.', '10/5 = 2']))
add(fraction, 'Work out the value of the fraction', 'N2.2 Q4a', expression('\\frac{2\\times(1+4)}{3^2-4}'), numeric(2), working('2', ['Complete the bracket, then multiply in the numerator.', '2 × (1 + 4) = 2 × 5 = 10'], ['Calculate the power, then subtract in the denominator.', '3² - 4 = 9 - 4 = 5'], ['Divide the results.', '10/5 = 2']))
add(fraction, 'Where should the denominator brackets go?', 'N2.2 Q4b', expression('\\frac{20}{2+3\\times2}', 'place-brackets'), select(['20/((2 + 3) × 2)', '20/(2 + (3 × 2))', '(20/2) + 3 × 2'], 0), working('20/((2 + 3) × 2) = 2', ['Group the addition in the denominator.', '2 + 3 = 5'], ['Multiply to finish the denominator.', '5 × 2 = 10'], ['Divide.', '20/10 = 2']))
add(fraction, 'Work out n', 'N2.2 Q5a', expression('n=\\frac{5^2-1}{3\\times2-2}'), numeric(6), working('n = 6', ['Calculate the numerator.', '5² - 1 = 25 - 1 = 24'], ['Calculate the denominator.', '3 × 2 - 2 = 6 - 2 = 4'], ['Divide.', '24/4 = 6']), undefined, 'independent')
add(fraction, 'Kofi says the fraction simplifies to 5. Show that he is wrong.', 'N2.2 Q5b', expression('\\frac{4+2\\times3}{2\\times5}'), select(['The top and bottom are both 10, so the value is 1.', 'Add 4 + 2 first, so the top is 18 and the value is 1.8.', 'Cancel the two 2s, so the value is 7.'], 0), working('1, not 5', ['Multiply before adding in the numerator.', '4 + 2 × 3 = 4 + 6 = 10'], ['Calculate the denominator.', '2 × 5 = 10'], ['Divide.', '10/10 = 1']), undefined, 'transfer')
add(fraction, 'Does the equivalent single-line calculation match the fraction?', 'N2.2 Q5c', expression('\\frac{3+3}{4-1}'), select(['Yes - (3 + 3) ÷ (4 - 1) keeps both groups and also equals 2.', 'Yes - 3 + 3 ÷ 4 - 1 equals 2 without any brackets.', 'No - a fraction bar cannot be written as division.'], 0), working('Yes - when the numerator and denominator stay grouped.', ['Work out the fraction.', '(3 + 3)/(4 - 1) = 6/3 = 2'], ['Rewrite the fraction bar as division and keep both groups.', '(3 + 3) ÷ (4 - 1) = 6 ÷ 3 = 2']), undefined, 'transfer')

add(algebraTopic, 'Multiply products, then collect like terms', 'Video 09.48.31', worked('2x\\times3x+x^2', [
  step('Multiply the coefficients and variable factors.', '6x^2+x^2', '2 × 3 = 6 and x × x = x²', '\\underline{2x\\times3x}+x^2'),
  step('The terms match, so add their coefficients.', '7x^2', '6 + 1 = 7', '\\underline{6x^2+x^2}'),
], [{ math: '5y\\times2y-3\\times y^2', steps: [
  step('Form the first product in the second example.', '10y^2-3\\times y^2', '5 × 2 = 10 and y × y = y²', '\\underline{5y\\times2y}-3\\times y^2'),
  step('Form the second product.', '10y^2-3y^2', '3 × y² = 3y²', '10y^2-\\underline{3\\times y^2}'),
  step('Now subtract the like terms.', '7y^2', '10 - 3 = 7', '\\underline{10y^2-3y^2}'),
] }]), undefined, undefined, 'An index on a letter is carried as part of the algebraic factor; it is not a number to evaluate without a value for the letter.')
add(algebraTopic, 'Write the expression in its simplest form', 'N2.3 Q1', worked('3ab\\times4b-5\\times ab^2', [
  step('Form the first product.', '12ab^2-5\\times ab^2', '3 × 4 = 12 and b × b = b²', '\\underline{3ab\\times4b}-5\\times ab^2'),
  step('Form the second product.', '12ab^2-5ab^2', '5 × ab² = 5ab²', '12ab^2-\\underline{5\\times ab^2}'),
  step('Subtract the like terms.', '7ab^2', '12 - 5 = 7', '\\underline{12ab^2-5ab^2}'),
]), undefined, undefined, 'Form each product before subtracting.')
add(algebraTopic, 'Simplify: 2x × 3x + 4x²', 'N2.3 Q2', expression('2x\\times3x+4x^2'), algebra('10x^2', '10x²'), working('10x²', ['Form the product.', '2x × 3x = 6x²'], ['Add the like terms.', '6x² + 4x² = 10x²']))
add(algebraTopic, 'Write the expression in its simplest form', 'N2.3 Q3', expression('5pq\\times2q-3\\times pq^2'), algebra('7pq^2', '7pq²'), working('7pq²', ['Form both products.', '5pq × 2q = 10pq² and 3 × pq² = 3pq²'], ['Subtract the like terms.', '10pq² - 3pq² = 7pq²']))
add(algebraTopic, 'Simplify: 4m × 3n + 2m × 5n', 'N2.3 Q4a', expression('4m\\times3n+2m\\times5n'), algebra('22mn', '22mn'), working('22mn', ['Form both products.', '4m × 3n = 12mn and 2m × 5n = 10mn'], ['Add the like terms.', '12mn + 10mn = 22mn']))
add(algebraTopic, 'Why is 6x × 2x not the same as 6x + 2x?', 'N2.3 Q4b', expression('6x\\times2x\\quad\\text{and}\\quad6x+2x'), select(['Multiplication gives 12x², but addition gives 8x.', 'Multiplication and addition both give 8x.', 'Multiplication gives 12x, but addition gives 8x².'], 0), working('12x² is not the same as 8x.', ['Multiply coefficients and variable factors.', '6x × 2x = 12x²'], ['Add coefficients when the terms already match.', '6x + 2x = 8x']))
add(algebraTopic, 'Write the expression in its simplest form', 'N2.3 Q5a', expression('7c\\times3cd-4\\times c^2d'), algebra('17c^2d', '17c²d'), working('17c²d', ['Form the first product.', '7c × 3cd = 21c²d'], ['Form the second product.', '4 × c²d = 4c²d'], ['Subtract the like terms.', '21c²d - 4c²d = 17c²d']), undefined, 'independent')
add(algebraTopic, 'Ravi says 3xy × 2x simplifies to 5x²y. Show that he is wrong.', 'N2.3 Q5b', expression('3xy\\times2x'), select(['3 × 2 = 6 and x × x = x², so the answer is 6x²y.', '3 + 2 = 5 and x × x = x², so Ravi is correct.', '3 × 2 = 6 and x + x = 2x, so the answer is 12xy.'], 0), working('6x²y, not 5x²y', ['Multiply the numerical coefficients.', '3 × 2 = 6'], ['Combine the variable factors.', 'xy × x = x²y'], ['Put the product together.', '3xy × 2x = 6x²y']), undefined, 'transfer')
add(algebraTopic, 'Sana says add or subtract before multiplying. Is she correct?', 'N2.3 Q5c', expression('2a\\times3a+a^2'), select(['No - multiply first to get 6a², then add a² to get 7a².', 'Yes - add 3a + a² first, then multiply by 2a.', 'No - add the coefficients first to get 5a².'], 0), working('No - 2a × 3a + a² = 7a².', ['Form the product first.', '2a × 3a = 6a²'], ['Now add the like term.', '6a² + a² = 7a²']), undefined, 'transfer')
add(algebraTopic, 'Four priority levels, one careful habit', 'All tutor sources; Variant B recap', { kind: 'tutor-summary' }, undefined, undefined, 'Read the structure, complete one operation, then check what remains. In algebra, form products before collecting like terms.')

export const lesson2Videos: Array<LessonVideoDefinition & { stateId: string }> = [
  {
    id: 'bidmas-worked-example', stateId: 'L2C-02',
    src: '/media/lesson-2/bidmas-worked-example.mp4', poster: '/media/lesson-2/bidmas-worked-example.jpg',
    title: 'BIDMAS: one calculation at a time', durationSeconds: 55.4,
    sourceFile: 'WhatsApp Video 2026-09-15 at 09.47.34 (1).mp4',
    textAlternative: [
      'Work out 5 × (2³ - 3) + 6. Begin inside the bracket: calculate the index before the subtraction.',
      '2³ = 8, so 5 × (2³ - 3) + 6 becomes 5 × (8 - 3) + 6.',
      '8 - 3 = 5. The expression is now 5 × 5 + 6.',
      'Multiply before adding: 5 × 5 = 25. Then 25 + 6 = 31.',
      'The classic trap: 3 + 4 × 2. Multiply 4 × 2 = 8 first, then 3 + 8 = 11, not 14.',
      'Priority: brackets, indices, division and multiplication, then addition and subtraction. Within each equal-priority pair, work left to right.',
    ],
  },
  {
    id: 'bidmas-fractions', stateId: 'L2C-16',
    src: '/media/lesson-2/bidmas-fractions.mp4', poster: '/media/lesson-2/bidmas-fractions.jpg',
    title: 'BIDMAS with fractions', durationSeconds: 54.4,
    sourceFile: 'WhatsApp Video 2026-09-15 at 09.48.11 (1).mp4',
    textAlternative: [
      'Work out (2 + 2 × 3)/(2 × 2). The fraction bar groups the complete numerator and denominator.',
      'In the numerator, multiply first: 2 × 3 = 6. Then 2 + 6 = 8.',
      'In the denominator, 2 × 2 = 4.',
      'Divide the completed numerator by the completed denominator: 8 ÷ 4 = 2.',
      'Top first is a helpful workflow, not a priority rule. Either group may be completed first; keep both groups intact before dividing.',
    ],
  },
  {
    id: 'bidmas-algebra', stateId: 'L2C-25',
    src: '/media/lesson-2/bidmas-algebra.mp4', poster: '/media/lesson-2/bidmas-algebra.jpg',
    title: 'BIDMAS with algebra', durationSeconds: 51.8,
    sourceFile: 'WhatsApp Video 2026-09-15 at 09.48.31 (1).mp4',
    textAlternative: [
      'Algebra follows the same order: form products before adding or subtracting.',
      'First example: 2x × 3x + x². Multiply coefficients and variable factors: 2 × 3 = 6 and x × x = x².',
      'The expression becomes 6x² + x². These are like terms, so 6x² + x² = 7x².',
      'Second example: 5y × 2y - 3 × y². The products are 10y² and 3y².',
      'Now subtract the like terms: 10y² - 3y² = 7y².',
      'An index such as x² stays part of the variable factor; without a value for x, it is not a number to evaluate. Only collect terms with matching variable factors and powers.',
    ],
  },
]

lesson2Videos.forEach(video => {
  const state = states.find(item => item.id === video.stateId)
  if (!state || state.interaction.type !== 'continue') throw new Error('Lesson video must belong to a teaching screen')
  state.video = video
})

states.forEach((state, index) => {
  state.transition = index < states.length - 1 ? { onComplete: states[index + 1].id } : {}
})

export const operationsVariantCLesson: LessonDefinition & { states: TutorOperationsState[] } = {
  id: 'L002-C',
  title: 'Order of operations - tutor-backed',
  level: 'GCSE Foundation',
  goal: 'Use BIDMAS to evaluate numerical, fractional and algebraic expressions one operation at a time.',
  states,
}

export const operationsVariantCLabels: Partial<Record<MicroSkillId, string>> = {
  'operation-priority': 'Using BIDMAS',
  'equal-priority': 'Equal priority',
  'fraction-grouping': 'BIDMAS & fractions',
  mixed: 'BIDMAS & algebra',
}
