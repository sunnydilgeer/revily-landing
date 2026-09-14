import type { FeedbackDefinition, InteractionDefinition, LearningState, LessonDefinition, MicroSkillId } from '../../number-types/types'
import type { BidmasContext } from './bidmasRules'

type Step = { title: string; math: string; evidence: string }
export type OperationsVisualDefinition =
  | { kind: 'groups' | 'brackets' | 'fraction' | 'summary' }
  | { kind: 'expression'; math: string; caption?: string; referenceContext?: BidmasContext }
  | { kind: 'worked'; math: string; steps: Step[] }
export type OperationsState = LearningState & { visual: OperationsVisualDefinition }
type Working = NonNullable<FeedbackDefinition['workedExplanation']>
const expression = (math: string, referenceContext?: BidmasContext): OperationsVisualDefinition => ({ kind: 'expression', math, referenceContext })
const step = (title: string, math: string, evidence: string): Step => ({ title, math, evidence })
const working = (answer: string, ...steps: Array<[string, string]>): Working => ({ answer, steps: steps.map(([title, line]) => ({ title, lines: [line] })) })
const select = (labels: string[], correct: number): InteractionDefinition => ({ type: 'select', options: labels.map((label, i) => ({ id: String(i), label })), correctAnswer: String(correct) })
const numeric = (value: number): InteractionDefinition => ({ type: 'numericInput', correctAnswer: value, acceptanceRule: 'numeric', placeholder: 'Your answer' })
const states: OperationsState[] = []
function add(topic: MicroSkillId, title: string, visual: OperationsVisualDefinition, interaction: InteractionDefinition = { type: 'continue' }, explanation?: Working, body?: string, phase: LearningState['phase'] = 'guided') {
  states.push({
    id: `L2B-${String(states.length + 1).padStart(2, '0')}`, microSkillId: topic, phase: interaction.type === 'continue' ? 'teach' : phase,
    teachingIntent: title, content: { title, body }, visual,
    // Semantic fallback keeps this lesson compatible with the shared engine's LessonDefinition.
    component: { type: 'expressionSteps', props: { expression: 'math' in visual ? visual.math : '', steps: [] } },
    interaction, feedback: explanation ? { correct: { message: 'Correct.', workedExplanation: explanation }, incorrect: { message: 'Here’s the answer.', workedExplanation: explanation } } : undefined,
    transition: {}, completionCondition: 'View the explanation and continue, regardless of accuracy.',
  })
}
const priority = 'operation-priority', brackets = 'brackets-indices', equal = 'equal-priority', fraction = 'fraction-grouping', mixed = 'mixed'
add(priority, 'See the multiplication as a group', { kind: 'groups' }, undefined, undefined, 'Change the group size. Multiply to count the grouped counters, then add the two loose counters.')
add(priority, 'Which calculation comes first?', expression('7 + 3 \\times 4'), select(['7 + 3', '3 × 4'], 1), working('3 × 4', ['Start with multiplication.', '3 × 4 = 12'], ['Keep the 7 ready to add afterwards.', '7 + 12 = 19']))
add(priority, 'What is the final value?', expression('7 + \\underbrace{12}_{3\\times4}', 'resolved-multiplication'), numeric(19), working('19', ['The multiplication is already complete. Add the remaining values.', '7 + 12 = 19']))
add(priority, 'Multiply first, then subtract', { kind: 'worked', math: '18 - 2 \\times 6', steps: [step('Calculate the multiplication.', '18 - \\underbrace{2\\times6}_{12}', '2 × 6 = 12'), step('Keep 18 and subtract the result.', '18 - 12 = 6', '18 − 12 = 6')] }, undefined, undefined, 'BIDMAS is a reminder of the order of operations. Here, multiplication comes before subtraction.')
add(priority, 'Work out the value', expression('20 - 3 \\times 4'), numeric(8), working('8', ['Multiply before subtracting.', '3 × 4 = 12'], ['Subtract from 20.', '20 − 12 = 8']), undefined, 'independent')
add(brackets, 'Brackets change what belongs together', { kind: 'brackets' }, undefined, undefined, 'Switch between the expressions. With brackets, add 2 and 3 first, then multiply the whole group by 4.')
add(brackets, 'Work out the value', expression('(6 + 2) \\times 3'), numeric(24), working('24', ['Complete the bracket first.', '6 + 2 = 8'], ['Multiply the whole result by 3.', '8 × 3 = 24']))
add(brackets, 'A square uses the number twice as a factor', { kind: 'worked', math: '3^2', steps: [step('Write the base multiplied by itself.', '3^2 = 3 \\times 3', 'The small 2 means two factors of 3.'), step('Calculate the product.', '3 \\times 3 = 9', '3² = 9')] }, undefined, undefined, 'The raised number is an index. Squaring is different from multiplying by 2.')
add(brackets, 'Which calculation means the same as 4²?', expression('4^2'), select(['4 × 2', '4 + 4', '4 × 4'], 2), working('4 × 4', ['Use two factors of the base, 4.', '4² = 4 × 4 = 16']))
add(brackets, 'Complete the bracket before squaring it', { kind: 'worked', math: '30 - (2+3)^2', steps: [step('Add inside the bracket.', '30 - 5^2', '2 + 3 = 5'), step('Square the whole bracket result.', '30 - 25', '5² = 5 × 5 = 25'), step('Subtract.', '30 - 25 = 5', '30 − 25 = 5')] }, undefined, undefined, 'In BIDMAS, B means brackets and I means indices (powers). Here, complete the bracket before squaring its value.')
add(brackets, 'Inside the bracket, what comes first?', expression('2 \\times (5^2 - 9)'), select(['5²', '5 − 9', '2 × 5'], 0), working('5²', ['Work inside the bracket, using the usual priority rules.', '5² = 25'], ['Finish the bracket before multiplying outside it.', '2 × (25 − 9) = 2 × 16 = 32']))
add(brackets, 'Now work out the whole value', expression('2 \\times (5^2 - 9)'), numeric(32), working('32', ['Square 5 inside the bracket.', '5² = 25'], ['Complete the subtraction inside the bracket.', '25 − 9 = 16'], ['Multiply the result by 2.', '2 × 16 = 32']))
add(equal, 'Division and multiplication share priority', { kind: 'worked', math: '24 \\div 6 \\times 2', steps: [step('Start with the operation furthest left.', '\\underbrace{24 \\div 6}_{4} \\times 2', '24 ÷ 6 = 4'), step('Continue to the right.', '4 \\times 2 = 8', '4 × 2 = 8')] }, undefined, undefined, 'The D and M in BIDMAS share priority. Work from left to right, whichever comes first.')
add(equal, 'Which calculation comes first here?', expression('8 \\times 3 \\div 2'), select(['8 × 3', '3 ÷ 2'], 0), working('8 × 3', ['Multiplication and division share priority. Start on the left.', '8 × 3 = 24'], ['Then divide by 2.', '24 ÷ 2 = 12']))
add(equal, 'Work out the value', expression('18 \\div 3 \\times 2'), numeric(12), working('12', ['Start on the left: divide first in this expression.', '18 ÷ 3 = 6'], ['Then multiply by 2.', '6 × 2 = 12']), undefined, 'independent')
add(equal, 'Addition and subtraction share priority too', { kind: 'worked', math: '10 - 6 + 2', steps: [step('Start on the left with subtraction.', '\\underbrace{10 - 6}_{4} + 2', '10 − 6 = 4'), step('Then add 2.', '4 + 2 = 6', '4 + 2 = 6')] }, undefined, undefined, 'The A and S in BIDMAS share priority too. After higher-priority operations, add and subtract from left to right.')
add(equal, 'Work out the value', expression('20 - 8 + 3'), numeric(15), working('15', ['Addition and subtraction share priority. Start on the left.', '20 − 8 = 12'], ['Then add 3.', '12 + 3 = 15']), undefined, 'independent')
add(equal, '“Addition always comes before subtraction.” Is that true?', expression('10 - 6 + 2'), select(['Yes — add 6 and 2 first.', 'No — subtract 6 first because it is on the left.'], 1), working('No. Equal-priority operations are evaluated left to right.', ['Test the claim with this expression.', '10 − 6 + 2 = 4 + 2 = 6'], ['Adding 6 and 2 first would insert brackets that are not there.', '10 − (6 + 2) = 2 is a different calculation.']), undefined, 'transfer')
add(fraction, 'A fraction bar makes two groups', { kind: 'fraction' }, undefined, undefined, 'Explore the numerator (top) and denominator (bottom). Calculate each whole group before dividing. Either group can be worked out first.')
add(fraction, 'Keep the top and bottom together', { kind: 'worked', math: '\\frac{18 - 2\\times5}{3+1}', steps: [step('Multiply within the numerator first.', '\\frac{18-10}{3+1}', '2 × 5 = 10'), step('Finish the numerator.', '\\frac{8}{3+1}', '18 − 10 = 8'), step('Calculate the denominator.', '\\frac{8}{4}', '3 + 1 = 4'), step('Divide the whole top by the whole bottom.', '\\frac{8}{4} = 2', '8 ÷ 4 = 2')] })
add(fraction, 'What is the value of the numerator?', expression('\\frac{4^2+8}{2\\times3}', 'numerator'), numeric(24), working('24', ['The numerator is the whole expression above the bar. Square first.', '4² = 16'], ['Add 8 to finish the numerator.', '16 + 8 = 24']))
add(fraction, 'What is the value of the whole fraction?', expression('\\frac{4^2+8}{2\\times3}'), numeric(4), working('4', ['Complete the numerator.', '4² + 8 = 16 + 8 = 24'], ['Complete the denominator.', '2 × 3 = 6'], ['Divide the numerator by the denominator.', '24/6 = 4']))
add(fraction, 'Work out the value', expression('\\frac{30\\div5+6}{10-6}'), numeric(3), working('3', ['Divide before adding in the numerator.', '30 ÷ 5 + 6 = 6 + 6 = 12'], ['Calculate the denominator.', '10 − 6 = 4'], ['Divide the two results.', '12/4 = 3']), undefined, 'independent')
add(mixed, 'Work out the value', expression('36 \\div 6 \\times 2 - 5'), numeric(7), working('7', ['Divide and multiply from left to right.', '36 ÷ 6 = 6'], ['Complete the multiplication before subtracting.', '6 × 2 = 12'], ['Subtract 5.', '12 − 5 = 7']), undefined, 'independent')
add(mixed, 'Where would brackets make this statement true?', expression('3 + 5 \\times 2 = 16', 'place-brackets'), select(['(3 + 5) × 2 = 16', '3 + (5 × 2) = 16'], 0), working('(3 + 5) × 2 = 16', ['Group the addition so it happens first.', '(3 + 5) × 2 = 8 × 2 = 16'], ['Check why the other placement does not work.', '3 + (5 × 2) = 3 + 10 = 13']), undefined, 'transfer')
add(mixed, 'Bring the rules together', expression('\\frac{3^2+3}{10-6}'), numeric(3), working('3', ['Square before adding in the numerator.', '3² + 3 = 9 + 3 = 12'], ['Calculate the denominator.', '10 − 6 = 4'], ['Divide the two results.', '12/4 = 3']), undefined, 'transfer')
add(mixed, 'You’ve reached the end', { kind: 'summary' }, undefined, undefined, 'Read the structure, calculate one part, then check what remains. A fraction bar groups the whole top and bottom.')
states.forEach((state, i) => { state.transition = i < states.length - 1 ? { onComplete: states[i + 1].id } : {} })
export const operationsVariantBLesson: LessonDefinition & { states: OperationsState[] } = { id: 'L002-B', title: 'Order of operations', level: 'GCSE Foundation', goal: 'Read the structure and evaluate expressions one operation at a time.', states }
export const operationsVariantBLabels: Partial<Record<MicroSkillId, string>> = { 'operation-priority': 'Multiplication first', 'brackets-indices': 'Brackets & powers', 'equal-priority': 'Equal priority', 'fraction-grouping': 'Fraction bars', mixed: 'Putting it together' }
