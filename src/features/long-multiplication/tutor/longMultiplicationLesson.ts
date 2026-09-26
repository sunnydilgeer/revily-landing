import { numeric, select, working, type Diagram } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import { columnWorking, gridWorking, methodWorking } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'

const { add, finish } = author(4)
const grid = 'long-multiplication-layout', columnTopic = 'long-multiplication-ones', carry = 'long-multiplication-carrying', apply = 'long-multiplication-application'
const twoDigits = 'long-multiplication-tens'
const column = (top: string, bottom: string, ones?: string, tens?: string, total?: string, carried?: { column: number; value: number }): Diagram => ({ kind: 'multiply', top, bottom, ones, tens, total, carry: carried })
const diagram = (d: Diagram) => ({ kind: 'diagram' as const, diagram: d })
const text = (...lines: string[]) => ({ kind: 'text' as const, lines })
const columnHint = 'Work from right to left. Multiply the digits. Now add the number you carried over. Write the last digit of the result and carry over the rest.'
const columnAnswer = (first: number, second: number) => working((first * second).toLocaleString('en-GB', { maximumFractionDigits: 10 }), ...columnWorking(first, second).steps.map(step => [step.title, step.instruction] as [string, string]))

add(grid, 'Split both numbers into tens and units', 'N5.1 Q1 preparation', methodWorking(gridWorking(34, 26)), undefined, undefined, undefined, 'Units means ones. For 34 × 26, split 34 into 30 + 4 and 26 into 20 + 6. Multiply every row value by every column value, then add the four products.')
const gridExample = methodWorking(gridWorking(34, 26), columnWorking(246, 43))
const videoState = add(grid, 'Grid: 34 × 26. Column: 246 × 43.', 'N5.1 Q1; video 23.48.58 (two separate examples)', gridExample)
videoState.video = {
  id: 'lesson4-multiplication', src: '/media/lesson-4/multiplication.mp4', poster: '/media/lesson-4/multiplication.jpg',
  title: 'Grid 34 × 26 and column 246 × 43', durationSeconds: 70.2, sourceFile: 'WhatsApp Video 2026-09-17 at 23.48.58.mp4',
  textAlternative: ['Grid: split 34 and 26; products 600, 180, 80, 24; total 884.', 'Separate column example: 246 × 43.', 'Multiply by 3 to get 738; multiply by 40 to get 9,840.', 'Add the two rows, including the 1 carried over, to get 10,578.'],
}
add(columnTopic, 'Line up the digits and start at the units', 'N5.1 Q2 preparation', methodWorking(columnWorking(213, 3)), undefined, undefined, undefined, 'Write one number below the other, with units under units. Multiply from right to left. Each answer digit stays in its own place.')
add(columnTopic, 'Work out 213 × 3 using the column method.', 'N5.1 Q2', diagram(column('213', '3')), numeric(639), columnAnswer(213, 3), 'Start with the rightmost digit of 213. Multiply each place by 3; no carry is needed here.')
add(carry, 'A carry keeps the value in the next column', 'N5.1 Q3 preparation; video first partial product', methodWorking(columnWorking(246, 3)), undefined, undefined, undefined, 'Multiply the digits. Now add the number you carried over. Write the last digit of the result and carry over the rest.')
add(carry, 'Work out 246 × 3 using the column method.', 'N5.1 Q3', diagram(column('246', '3')), numeric(738), columnAnswer(246, 3), columnHint)
add(twoDigits, 'Work through 424 × 28 using long multiplication.', 'User-added worked example: 424 × 28', methodWorking(columnWorking(424, 28)), undefined, undefined, undefined, 'Multiply by 8 first. Then multiply by 20, starting the second row with a zero in units. Add the two partial products, keeping every digit in its column.')
add(twoDigits, 'Work through 291 × 56 using long multiplication.', 'User-added worked example: 291 × 56', methodWorking(columnWorking(291, 56)), undefined, undefined, undefined, 'Multiply by 6, then by 50. Include every carry and the zero in the second row. Finally add the partial products from right to left.')
add(apply, 'Work out 42 × 18 using the grid method.', 'N5.1 Q4a', { kind: 'grid', first: [40, 2], second: [10, 8] }, numeric(756), working('756', ['Split both numbers.', '42 = 40 + 2; 18 = 10 + 8.'], ['Multiply all four pairs.', '40 × 10 = 400; 40 × 8 = 320; 2 × 10 = 20; 2 × 8 = 16.'], ['Add all four products.', '400 + 320 + 20 + 16 = 756.']), 'Use every cell of the grid. Multiply its row value by its column value, then add all four products.')
const tickets = add(apply, 'Tickets to a school show cost £18 each. If 42 tickets are sold, how much money is raised in total?', 'N5.1 Q4b', text('42 tickets', '£18 for each ticket'), numeric(756), working('£756', ['Use equal groups.', '42 tickets at £18 each means 42 × 18.'], ['Use the product from part a.', '42 × 18 = 756, so the total raised is £756.']), 'The total is the number of tickets multiplied by the price of each ticket. This is the same calculation as part a.')
tickets.answerLabel = 'Total raised (£)'
add(apply, 'Work out 347 × 4 using the column method.', 'N5.1 Q5a', diagram(column('347', '4')), numeric(1388), columnAnswer(347, 4), columnHint)
add(apply, 'In your column working for 347 × 4, what number was carried from the tens column into the hundreds column?', 'N5.1 Q5b', diagram(column('347', '4')), numeric(1), working('1', ['Multiply, then add the number carried over.', columnWorking(347, 4).steps[1].instruction], ['Identify the number carried over.', 'The number carried over is 1.']), 'Follow the calculation until you carry over 1.')
add(apply, 'The same multiplication, using the column method', 'N5.1 Q5c preparation (source counterexample 34 × 26)', methodWorking(columnWorking(34, 26)))
add(apply, 'Jake says: “The grid method and the column method always give different answers for the same multiplication.” Is Jake correct? Give a reason using an example.', 'N5.1 Q5c (reason and example choices)', text('Compare the same calculation: 34 × 26'), select([
  'No. For 34 × 26, the grid gives 600 + 180 + 80 + 24 = 884 and columns give 204 + 680 = 884.',
  'Yes. The video’s grid answer is 884 and its column answer is 10,578, so the methods disagree.',
  'No. Both methods add the two original numbers, so 34 × 26 is 60.',
], 0), working('No. Both methods give 884 for 34 × 26.', ['Use the same factors for both methods.', 'The video’s 884 and 10,578 come from different questions: 34 × 26 and 246 × 43.'], ['Use the grid method.', '600 + 180 + 80 + 24 = 884.'], ['Use the column method.', '34 × 6 = 204; 34 × 20 = 680; 204 + 680 = 884.'], ['Explain why the methods agree.', 'Both split the same multiplication into smaller products and add them, so correct working gives the same result.']), 'Compare identical factors. Use 34 × 26 in both methods and include a numerical example in your reason.')
add('mixed', 'Split, multiply, carry and combine', 'N5.1 consolidation', text('Grid: multiply every pair, then add', 'Columns: multiply, then add each carry', 'Compare methods using the same factors'), undefined, undefined, undefined, 'Keep place values aligned. A carry belongs to the next column. Different methods agree when they calculate the same multiplication correctly.')
const states = finish({ videoFirst: true })
const answerWorking = {
  'N5.1 Q2': methodWorking(columnWorking(213, 3)), 'N5.1 Q3': methodWorking(columnWorking(246, 3)),
  'N5.1 Q4a': methodWorking(gridWorking(42, 18)), 'N5.1 Q4b': methodWorking(gridWorking(42, 18)),
  'N5.1 Q5a': methodWorking(columnWorking(347, 4)), 'N5.1 Q5b': methodWorking(columnWorking(347, 4)),
  'N5.1 Q5c': methodWorking(gridWorking(34, 26), columnWorking(34, 26)),
}
states.forEach(state => { state.working = answerWorking[state.sourceRef.split(' (')[0]] })
export const tutorLongMultiplicationLesson: TutorMethodLesson = { id: 'L004', number: 4, title: 'Long multiplication', level: 'GCSE Foundation', goal: 'Use grid and column multiplication, apply carries, and explain why both methods agree.', labels: { [grid]: 'Grid method', [columnTopic]: 'Column method', [carry]: 'Carrying', [twoDigits]: 'Two-digit multipliers', [apply]: 'Practice and reasoning', mixed: 'Review' }, states }
