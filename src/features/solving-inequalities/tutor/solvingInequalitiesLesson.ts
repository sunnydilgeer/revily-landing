import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { diagnoseInequality } from '../../inequalities/tutor/inequalitiesDiagnosis'
import { answerMove, boardModel, box, choose, circle, dots, given, inequality, integers, lineModel, lineOf, nb, number, readNumbers, shade, show, text, ticks, type BoardMove } from '../../inequalities/tutor/inequalityWorkings'

const { add, finish } = author(25)
const listing = 'inequalities-integers'
const solving = 'inequalities-solve'
const twoSigns = 'inequalities-solve-two-signs'
const negative = 'inequalities-negative'

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
function practice(topic: MicroSkillId, title: string, sourceRef: string, interaction: InteractionDefinition, hint: string, model: TutorWorking, diagnose?: (response: string) => string | null) {
  const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  const state = add(topic, title, sourceRef, text(title), interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  if (diagnose) state.diagnose = diagnose
  return state
}
function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: TutorWorking, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  // The picture shows the inequality, so the heading is only the instruction (EXPLANATIONS.md rule 1).
  state.content.heading = heading
  return state
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }
const media = (name: string, title: string, sourceFile: string, durationSeconds: number, textAlternative: string[]) => ({
  id: `lesson25-${name}`, src: `/media/lesson-25/${name}.mp4`, poster: `/media/lesson-25/${name}.svg`, title, durationSeconds, sourceFile, textAlternative,
})
const slips = (right: number, list: Slip[]) => (response: string) => diagnoseSlips(response, right, list)
/** A solved inequality typed with the sign keys, with this question's own slips first. */
function solved(answer: string, list: [string, string][] = []) {
  return { interaction: inequality(answer), diagnose: (response: string) => diagnoseInequality(response, answer, list, false) }
}
/** Whole numbers typed in one box: says which are missing or shouldn't be there. */
function listDiagnosis(right: number[], ends: [number, boolean][] = []) {
  return (response: string) => {
    const typed = [...new Set(readNumbers(response))]
    if (!typed.length || (typed.length === right.length && typed.every(n => right.includes(n)))) return null
    const extra = typed.filter(n => !right.includes(n)), missing = right.filter(n => !typed.includes(n))
    const end = ends.find(([value]) => extra.includes(value) || missing.includes(value))
    if (end) return end[1] ? `${show(end[0])} is included: its sign is ≤, so put it in the list.` : `${show(end[0])} isn’t included: its sign is <, so leave it out.`
    if (extra.some(n => !Number.isInteger(n))) return 'Integers are whole numbers: leave out the decimals.'
    if (missing.length) return `Some are missing: list every whole number from ${show(right[0])} to ${show(right.at(-1)!)}.`
    return `${show(extra[0])} doesn’t fit the inequality.`
  }
}

/* ---------- Workings: whole numbers on the number line (A11.1) ---------- */

/** low (<, ≤) x (<, ≤) high: each circle, then the whole numbers between in green. `written` adds the inequality first. */
function listModel(question: string, low: number, lowIn: boolean, high: number, highIn: boolean, words?: [string, string], written?: string) {
  const values = ticks(lowIn ? low : low + 1, highIn ? high : high - 1)
  return lineModel(question, { ticks: ticks(low - 1, high + 1) }, [
    circle(low, lowIn, words?.[0] ?? `${show(low)} is ${lowIn ? 'in' : 'left out'}`, lowIn ? `${words ? '' : 'The sign is ≤, so '}${show(low)} itself is included: a filled circle.` : `${words ? '' : 'The sign is <, so '}${show(low)} itself isn’t included: an open circle.`),
    { ...circle(high, highIn, words?.[1] ?? `${show(high)} is ${highIn ? 'in' : 'left out'}`, highIn ? `${show(high)} itself is included: a filled circle.` : `${show(high)} itself isn’t included: an open circle.`),
      change: (frame, step) => shade(low, high, '', '').change(circle(high, highIn, '', '').change(frame, step), step) },
    ...(written ? [lineOf(written, 'Write the inequality', 'The smaller number, the letter, then the bigger number, each with its circle’s sign.')] : []),
    dots(values, 'List the whole numbers', 'Every whole number on the line between the circles, and any end with a filled circle.'),
  ], 'List them')
}

/* ---------- Rung 1: listing integers (A11.1) ---------- */

const team = worked(listing, 'A five-a-side squad must have more than 2 players and at most 6 players. Let n be the number of players. Write an inequality for n and list all the possible values.', 'More than 2, at most 6: list n', 'A11.1 video + Q1',
  listModel('more than 2, at most 6', 2, false, 6, true, ['More than 2: 2 is left out', 'At most 6: 6 is in'], '2 < n ≤ 6'), 'Read each sign: is the number itself included? Then list every whole number in between.')
video(team, media('listing-integers', 'More than 2, at most 6: 3, 4, 5, 6', 'A11.1_Listing_Integers_In_An_Inequality.mp4', 70.5, [
  'A five-a-side team: more than 2 players, at most 6. How many players could there be? 2 < n ≤ 6.',
  'Read the two signs. More than 2: 2 < n, so 2 is not allowed. At most 6: n ≤ 6, so 6 is allowed.',
  'A team is made of whole people, so n is an integer.',
  'On a number line: an open circle at 2, a filled circle at 6, and a line between. The whole numbers on that line are 3, 4, 5 and 6.',
  'List them: 2 is left out (strict sign) and 6 is included. A team can have 3, 4, 5 or 6 players, not 2 (too few) or 7 (too many).',
]))
practice(listing, `List all the integers that satisfy ${nb('−1 < x < 3')}.`, 'A11.1 Q2', integers([0, 1, 2]), 'Both signs are strict, so leave out −1 and 3.', listModel('-1 < x < 3', -1, false, 3, false), listDiagnosis([0, 1, 2], [[-1, false], [3, false]]))
practice(listing, `x is an integer such that ${nb('−3 ≤ x < 2')}. List all the possible values of x.`, 'A11.1 Q3', integers([-3, -2, -1, 0, 1]), '−3 is included (≤). 2 is not (<).', listModel('-3 ≤ x < 2', -3, true, 2, false), listDiagnosis([-3, -2, -1, 0, 1], [[-3, true], [2, false]]))
practice(listing, `n is an integer such that ${nb('−2 ≤ n ≤ 4')}. Write down the smallest and the largest possible values of n.`, 'A11.1 Q4a', { type: 'numericInput', responseShape: 'list', listJoiner: 'and', acceptanceRule: 'numberList', correctAnswer: '-2, 4', displayAnswer: 'smallest −2, largest 4' }, 'Both signs are ≤, so both ends are allowed.', lineModel('-2 ≤ n ≤ 4', { ticks: ticks(-3, 5) }, [
  circle(-2, true, '−2 is in', 'The sign is ≤, so −2 itself is included: the smallest.'),
  answerMove('−2 and 4', '4 is in', 'The sign is ≤ again, so 4 itself is included: the largest.', { ...circle(4, true, '', ''), change: (frame, step) => shade(-2, 4, '', '').change(circle(4, true, '', '').change(frame, step), step) }),
], 'Read the ends'), response => {
  const typed = readNumbers(response)
  return typed.length === 2 && typed[0] === -1 && typed[1] === 3 ? 'Both signs are ≤, so −2 and 4 themselves are included.' : typed.length === 2 && typed[0] === 4 && typed[1] === -2 ? 'Smallest first: −2, then the largest, 4.' : null
})
practice(listing, `How many integers satisfy ${nb('−2 ≤ n ≤ 4')}?`, 'A11.1 Q4b', number(7, '7'), 'List them, then count. Don’t forget 0.', lineModel('-2 ≤ n ≤ 4', given(ticks(-3, 5), [[-2, true], [4, true]], 4), [
  lineOf('−2, −1, 0, 1, 2, 3, 4', 'List them', 'Both ends are included, and every whole number between, with 0.'),
  answerMove('7 integers', 'Count them', 'Count every number in the list.'),
], 'Count them'), slips(7, [[6, 'Count both ends and 0: −2, −1, 0, 1, 2, 3, 4.'], [5, 'Both ends are included (≤): −2 and 4 count too.'], [2, 'That’s 4 − 2. Count every whole number from −2 to 4.']]))
practice(listing, `x is an integer such that ${nb('2x ≤ 9')}. List all the positive integer values of x.`, 'A11.1 Q5a', integers([1, 2, 3, 4]), 'Divide both sides by 2 first.', lineModel('2x ≤ 9', { ticks: ticks(0, 6) }, [
  lineOf('x ≤ 4.5', 'Divide both sides by 2', 'Treat it like an equation: dividing by a positive number keeps the sign.'),
  { ...circle(4.5, true, 'Draw it on the line', '4.5 is included, and x can be anything smaller.'), change: (frame, step) => shade(4.5, 'left', '', '').change(circle(4.5, true, '', '').change(frame, step), step) },
  dots([1, 2, 3, 4], 'List the positive whole numbers', 'Positive means bigger than 0, so start at 1.'),
], 'Solve, then list'), listDiagnosis([1, 2, 3, 4], [[0, false]]))
practice(listing, `Write down the largest integer that satisfies ${nb('3x < 20')}.`, 'A11.1 Q5b', number(6, '6'), 'Divide both sides by 3. Or try 3 × 6 and 3 × 7.', lineModel('3x < 20', { ticks: ticks(3, 9) }, [
  lineOf('x < 6.66…', 'Divide both sides by 3', '20 shared by 3 isn’t whole, so x is less than six and two thirds.'),
  { ...circle(20 / 3, false, 'Draw it on the line', 'Six and two thirds isn’t included, and x can be anything smaller.'), change: (frame, step) => shade(20 / 3, 'left', '', '').change(circle(20 / 3, false, '', '').change(frame, step), step) },
  dots([6], 'The largest whole number', 'The whole number just below the circle.'),
], 'Solve, then read'), slips(6, [[7, '3 × 7 = 21, which isn’t less than 20.'], [6.66, 'An integer is a whole number.'], [6.67, 'An integer is a whole number.'], [5, '3 × 6 = 18 is less than 20, so 6 works too.']]))
practice(listing, `Ravi says the integers that satisfy ${nb('−2 < x ≤ 2')} are −2, −1, 0, 1, 2. Is Ravi correct?`, 'A11.1 Q5c', choose(
  'No: the sign next to −2 is <, so −2 shouldn’t be in the list',
  ['Yes: he listed every integer from −2 to 2', '−2 < x is strict: −2 itself isn’t included.'],
  ['No: 2 shouldn’t be in the list', '2 has ≤, so 2 is included. It’s −2 that should go.'],
  ['No: he has missed out 3', 'x ≤ 2 stops at 2. The mistake is −2: < leaves it out.'],
), 'Check the sign next to each end.', listModel('-2 < x ≤ 2', -2, false, 2, true))

/* ---------- Rung 2: solving (A11.2), on the A5 board ---------- */

/** Moves on the board: add or take away the same on both sides, or divide both sides. */
const undo = (title: string, say: string, rows: string[], mark: (line: string) => string): BoardMove => ({ title, say, rows, mark })
const divide = (by: number, letterTerm: string, rows: string[], say = `The boxed ${by} multiplies the letter. Divide both sides by it: it’s positive, so the sign stays the same.`): BoardMove => ({ title: `Divide both sides by ${by}`, say, rows, mark: box(letterTerm, `[${by}]${letterTerm.slice(String(by).length)}`) })

const balance = worked(solving, `Solve ${nb('4a − 5 > a + 7')}.`, 'Solve', 'A11.2 video + Q1', boardModel('4a −5 > a +7', [
  undo('Add 5 to both sides', 'Treat it like an equation. The boxed −5 is stuck to 4a: add 5 to both sides, so it cancels.', ['4a ~−5 ~+5^ > a +7 +5^', '4a > a +12'], box('−5', '[−5]', 0)),
  undo('Subtract a from both sides', 'Get the letters on one side: take the boxed a from both sides.', ['4a −a^ > ~a +12 ~−a^', '3a > 12'], box('a', '[a]', 1)),
  divide(3, '3a', ['3a ÷3^ > 12 ÷3^', '! a > 4']),
]), 'Solve it like an equation: do the same to both sides. Dividing by a positive number keeps the sign.')
video(balance, media('solving-inequalities', 'Solve 4a − 5 > a + 7', 'A11.2_Solving_Linear_Inequalities.mp4', 83, [
  'Unknown on both sides: solve 4a − 5 > a + 7. Treat it like an equation.',
  'An inequality is like a balance that is not level: > means the left side is heavier. Do the same thing to both sides and it stays true.',
  'Get rid of the − 5: add 5 to both sides. 4a > a + 12.',
  'Get a on one side only: take a from both sides. 3a > 12.',
  'Divide both sides by 3. It’s a positive number, so the sign stays: a > 4. Any number bigger than 4 works, but not 4 itself.',
  'Check with a = 5: 4 × 5 − 5 = 15 and 5 + 7 = 12. 15 > 12, so the left side really is bigger.',
]))
{
  const { interaction, diagnose } = solved('x < 4', [['x < 7', 'Subtract 3 first, then divide by 2: 2x < 8.'], ['x < 8', 'That’s 2x. Divide both sides by 2.'], ['x > 4', 'Dividing by a positive number keeps the sign: <.'], ['x ≤ 4', 'The sign stays strict, <: 4 itself doesn’t work.']])
  practice(solving, `Solve ${nb('2x + 3 < 11')}.`, 'A11.2 Q2', interaction, 'Subtract 3 from both sides, then divide by 2.', boardModel('2x +3 < 11', [
    undo('Subtract 3 from both sides', 'The boxed +3 is stuck to 2x. Take 3 from both sides, so it cancels.', ['2x ~+3 ~−3^ < 11 −3^', '2x < 8'], box('+3', '[+3]', 0)),
    divide(2, '2x', ['2x ÷2^ < 8 ÷2^', '! x < 4']),
  ]), diagnose)
}
{
  const { interaction, diagnose } = solved('y ≥ 5', [['y ≥ 3', 'Add 2 (don’t take it away): 5y ≥ 3y + 10.'], ['y ≥ 10', 'That’s 2y. Divide both sides by 2.'], ['y ≥ 0.75', 'Collect the y terms first: 5y − 3y = 2y.'], ['y > 5', 'Keep the sign the same: ≥.']])
  practice(solving, `Solve ${nb('5y − 2 ≥ 3y + 8')}.`, 'A11.2 Q3', interaction, 'Add 2 to both sides, then subtract 3y from both sides.', boardModel('5y −2 ≥ 3y +8', [
    undo('Add 2 to both sides', 'The boxed −2 is stuck to 5y. Add 2 to both sides, so it cancels.', ['5y ~−2 ~+2^ ≥ 3y +8 +2^', '5y ≥ 3y +10'], box('−2', '[−2]', 0)),
    undo('Subtract 3y from both sides', 'Get the letters on one side: take the boxed 3y from both sides.', ['5y −3y^ ≥ ~3y +10 ~−3y^', '2y ≥ 10'], box('3y', '[3y]', 1)),
    divide(2, '2y', ['2y ÷2^ ≥ 10 ÷2^', '! y ≥ 5']),
  ]), diagnose)
}
{
  const { interaction, diagnose } = solved('x ≤ 4', [['x ≤ 8', '3 × 2 is 6: expand to 3x + 6, not 3x + 2.'], ['x ≤ 1.6', 'Expand the bracket first: 3(x + 2) is 3x + 6.'], ['x ≤ 16', 'Subtract 6 from 10, don’t add it.'], ['x ≥ 4', 'Keep the sign the same: ≤.']])
  practice(solving, `Solve ${nb('3(x + 2) ≤ 2x + 10')}.`, 'A11.2 Q4a', interaction, 'Expand the bracket first: 3 × x and 3 × 2.', boardModel('3(x+2) ≤ 2x +10', [
    { title: 'Expand the bracket', say: 'The boxed 3 multiplies everything inside the bracket.', rows: ['3x +6 ≤ 2x +10'], mark: line => line.replace('3(x+2)', '[3](x+2)') },
    undo('Subtract 2x from both sides', 'Get the letters on one side: take the boxed 2x from both sides.', ['3x −2x^ +6 ≤ ~2x +10 ~−2x^', 'x +6 ≤ 10'], box('2x', '[2x]', 1)),
    undo('Subtract 6 from both sides', 'The boxed +6 is stuck to x. Take 6 from both sides.', ['x ~+6 ~−6^ ≤ 10 −6^', '! x ≤ 4'], box('+6', '[+6]', 0)),
  ]), diagnose)
}
practice(solving, `Write down the largest integer that satisfies ${nb('x ≤ 4')}.`, 'A11.2 Q4b', number(4, '4'), 'Is 4 itself included?', lineModel('x ≤ 4', given(ticks(0, 6), [[4, true]], 'left'), [
  lineOf('4 is included', 'The sign is ≤', '≤ includes 4 itself: a filled circle.', 4),
  dots([4], 'The largest whole number', 'Nothing bigger than 4 fits.'),
], 'Read it'), slips(4, [[3, '≤ includes 4 itself, so 4 is the largest.'], [5, '5 is bigger than 4, so it doesn’t fit.']]))
{
  const { interaction, diagnose } = solved('x < 5', [['x > 5', '10 > 2x means 2x is less than 10: x < 5.'], ['x < 10', 'That’s 2x. Divide both sides by 2.'], ['x < 1.25', 'Multiply both sides by 4 first: the 4 cancels on the left.']])
  practice(solving, `Solve ${nb('(2x + 6) ÷ 4 > x − 1')}.`, 'A11.2 Q5a', interaction, 'Multiply both sides by 4 to clear the fraction.', boardModel('{2x+6|4} > x −1', [
    { title: 'Multiply both sides by 4', say: 'The boxed 4 on the bottom divides. Multiply both sides by 4, so it cancels.', rows: ['{2x+6|~4} ~×4^ > (x−1) ×4^', '2x +6 > 4(x−1)'], mark: line => line.replace('|4}', '|[4]}') },
    { title: 'Expand the bracket', say: 'The boxed 4 multiplies everything inside the bracket.', rows: ['2x +6 > 4x −4'], mark: line => line.replace('4(x−1)', '[4](x−1)') },
    undo('Subtract 2x from both sides', 'Take the smaller x term, the boxed 2x, from both sides, so x stays positive.', ['~2x +6 ~−2x^ > 4x −2x^ −4', '6 > 2x −4'], box('2x', '[2x]', 0)),
    undo('Add 4 to both sides', 'The boxed −4 is stuck to 2x. Add 4 to both sides.', ['6 +4^ > 2x ~−4 ~+4^', '10 > 2x'], box('−4', '[−4]', 1)),
    divide(2, '2x', ['10 ÷2^ > 2x ÷2^', '! x < 5'], 'Divide both sides by the boxed 2. 5 is bigger than x: x is less than 5.'),
  ]), diagnose)
}
practice(solving, `Which number line shows ${nb('x < 5')}?`, 'A11.2 Q5b', choose(
  'An open circle at 5, and an arrow pointing left',
  ['A filled circle at 5, and an arrow pointing left', '< doesn’t include 5: the circle is open.'],
  ['An open circle at 5, and an arrow pointing right', 'Less than means smaller numbers, to the left.'],
  ['A filled circle at 5, and an arrow pointing right', '5 isn’t included (open), and smaller numbers are to the left.'],
), 'Is 5 included? Which way are the smaller numbers?', lineModel('x < 5', { ticks: ticks(2, 8) }, [
  circle(5, false, '5 isn’t included: leave it open', '< is strict, so 5 itself isn’t allowed.'),
  answerMove('Open circle at 5, arrow left', 'Smaller: the arrow points left', 'Less than means the smaller numbers, to the left.', shade(5, 'left', '', '')),
], 'Draw it'))
practice(solving, `Noor solves ${nb('6x − 1 > 4x + 9')} and gets ${nb('x > 4')}. Is Noor correct?`, 'A11.2 Q5c', choose(
  'No: 2x > 10, so x > 5',
  ['Yes: x > 4', 'Add 1 to both sides: 6x > 4x + 10, so 2x > 10 and x > 5.'],
  ['No: x < 5', 'Dividing by 2, a positive number, keeps the sign: x > 5.'],
  ['No: x > 10', 'That’s 2x. Divide both sides by 2: x > 5.'],
), 'Solve it yourself: add 1, then subtract 4x.', boardModel('6x −1 > 4x +9', [
  undo('Add 1 to both sides', 'The boxed −1 is stuck to 6x. Add 1 to both sides.', ['6x ~−1 ~+1^ > 4x +9 +1^', '6x > 4x +10'], box('−1', '[−1]', 0)),
  undo('Subtract 4x from both sides', 'Get the letters on one side: take the boxed 4x from both sides.', ['6x −4x^ > ~4x +10 ~−4x^', '2x > 10'], box('4x', '[4x]', 1)),
  divide(2, '2x', ['2x ÷2^ > 10 ÷2^', '! x > 5']),
]))

/* ---------- Rung 3: two signs (A11.3): the same move on all three parts ---------- */

const squeeze = worked(twoSigns, `Solve ${nb('3 < 2x + 1 < 11')}.`, 'Solve', 'A11.3 video + Q1', boardModel('3 < 2x +1 < 11', [
  undo('Subtract 1 from all three parts', 'There are three parts. Whatever you do, do it to all three: take 1 from each, so the boxed +1 cancels.', ['3 −1^ < 2x ~+1 ~−1^ < 11 −1^', '2 < 2x < 10'], box('+1', '[+1]', 1)),
  divide(2, '2x', ['2 ÷2^ < 2x ÷2^ < 10 ÷2^', '! 1 < x < 5'], 'Divide all three parts by the boxed 2. It’s positive, so both signs stay.'),
]), 'Three parts: do the same to all three. Undo the + or − first, then the × or ÷.')
video(squeeze, media('two-signs', 'Solve 3 < 2x + 1 < 11', 'A11.3_Inequalities_With_Two_Signs.mp4', 74.5, [
  'Two signs at once: solve 3 < 2x + 1 < 11. There are three parts: the left part 3, the middle 2x + 1 and the right part 11.',
  'We want x on its own in the middle. Whatever we do, we do it to all three parts.',
  'Take 1 from all three: 3 − 1 < 2x + 1 − 1 < 11 − 1, so 2 < 2x < 10.',
  'Divide all three by 2. It’s positive, so the signs stay: 1 < x < 5.',
  'On a number line: open circles at 1 and 5, with a line between. The whole numbers inside are 2, 3 and 4.',
  'Check with x = 3: 2 × 3 + 1 = 7, and 3 < 7 < 11, so x = 3 works.',
]))
{
  const { interaction, diagnose } = solved('1 ≤ x ≤ 6', [['4 ≤ x ≤ 6', 'Take 3 from the left part too: 4 − 3 = 1.'], ['1 ≤ x ≤ 9', 'Take 3 from the right part too: 9 − 3 = 6.'], ['7 ≤ x ≤ 12', 'Subtract 3 from every part, don’t add it.']])
  practice(twoSigns, `Solve ${nb('4 ≤ x + 3 ≤ 9')}.`, 'A11.3 Q2', interaction, 'Subtract 3 from all three parts.', boardModel('4 ≤ x +3 ≤ 9', [
    undo('Subtract 3 from all three parts', 'The boxed +3 is stuck to x. Take 3 from every part.', ['4 −3^ ≤ x ~+3 ~−3^ ≤ 9 −3^', '! 1 ≤ x ≤ 6'], box('+3', '[+3]', 1)),
  ]), diagnose)
}
{
  const { interaction, diagnose } = solved('−1 ≤ x < 3', [['−1 ≤ x < 9', 'Divide the right part by 3 too: 9 ÷ 3 = 3.'], ['−3 ≤ x < 9', 'That’s 3x. Divide all three parts by 3.'], ['−7 ≤ x < 5', 'Add 2 to every part, don’t take it away.'], ['−1 < x ≤ 3', 'Each sign stays where it was: ≤ on the left, < on the right.']])
  practice(twoSigns, `Solve ${nb('−5 ≤ 3x − 2 < 7')}.`, 'A11.3 Q3', interaction, 'Add 2 to all three parts, then divide all three by 3.', boardModel('−5 ≤ 3x −2 < 7', [
    undo('Add 2 to all three parts', 'The boxed −2 is stuck to 3x. Add 2 to every part.', ['−5 +2^ ≤ 3x ~−2 ~+2^ < 7 +2^', '−3 ≤ 3x < 9'], box('−2', '[−2]', 1)),
    divide(3, '3x', ['−3 ÷3^ ≤ 3x ÷3^ < 9 ÷3^', '! −1 ≤ x < 3'], 'Divide all three parts by the boxed 3. It’s positive, so both signs stay.'),
  ]), diagnose)
}
{
  const { interaction, diagnose } = solved('−2 < x ≤ 6', [['−1 < x ≤ 3', 'That’s x ÷ 2. Multiply all three parts by 2.'], ['1 < x ≤ 5', 'Subtract 2 from the outside parts too.'], ['2 < x ≤ 14', 'Subtract 2 first, then multiply by 2.']])
  practice(twoSigns, `Solve ${nb('1 < x ÷ 2 + 2 ≤ 5')}.`, 'A11.3 Q4a', interaction, 'Subtract 2 from all three parts, then multiply all three by 2.', boardModel('1 < {x|2} +2 ≤ 5', [
    undo('Subtract 2 from all three parts', 'The boxed +2 is stuck to the fraction. Take 2 from every part.', ['1 −2^ < {x|2} ~+2 ~−2^ ≤ 5 −2^', '−1 < {x|2} ≤ 3'], box('+2', '[+2]', 1)),
    { title: 'Multiply all three parts by 2', say: 'The boxed 2 on the bottom divides x. Multiply every part by 2, so it cancels.', rows: ['−1 ×2^ < {x|~2} ~×2^ ≤ 3 ×2^', '! −2 < x ≤ 6'], mark: line => line.replace('{x|2}', '{x|[2]}') },
  ]), diagnose)
}
practice(twoSigns, `List the integers that satisfy ${nb('−2 < x ≤ 6')}.`, 'A11.3 Q4b', integers([-1, 0, 1, 2, 3, 4, 5, 6]), '−2 isn’t included. 6 is.', listModel('-2 < x ≤ 6', -2, false, 6, true), listDiagnosis([-1, 0, 1, 2, 3, 4, 5, 6], [[-2, false], [6, true]]))
{
  const { interaction, diagnose } = solved('2 < x ≤ 5', [['8 < x ≤ 20', 'That’s 4x. Divide all three parts by 4.'], ['1 < x ≤ 4', 'Add 2 to every part, don’t take it away.'], ['2 ≤ x ≤ 5', 'Each sign stays where it was: < on the left.']])
  practice(twoSigns, `x is an integer and ${nb('6 < 4x − 2 ≤ 18')}. Solve the inequality.`, 'A11.3 Q5a', interaction, 'Add 2 to all three parts, then divide all three by 4.', boardModel('6 < 4x −2 ≤ 18', [
    undo('Add 2 to all three parts', 'The boxed −2 is stuck to 4x. Add 2 to every part.', ['6 +2^ < 4x ~−2 ~+2^ ≤ 18 +2^', '8 < 4x ≤ 20'], box('−2', '[−2]', 1)),
    divide(4, '4x', ['8 ÷4^ < 4x ÷4^ ≤ 20 ÷4^', '! 2 < x ≤ 5'], 'Divide all three parts by the boxed 4. It’s positive, so both signs stay.'),
  ]), diagnose)
}
practice(twoSigns, `x is an integer and ${nb('2 < x ≤ 5')}. Write down all the possible values of x.`, 'A11.3 Q5b', integers([3, 4, 5]), '2 isn’t included. 5 is.', listModel('2 < x ≤ 5', 2, false, 5, true), listDiagnosis([3, 4, 5], [[2, false], [5, true]]))
practice(twoSigns, `Jude solves ${nb('2 < 3x + 5 < 14')} by subtracting 5 from the middle only, and gets ${nb('2 < 3x < 14')}. What is the right answer?`, 'A11.3 Q5c', choose(
  '−1 < x < 3: take 5 from all three parts',
  ['2 < 3x < 14 is right', 'Whatever you do to the middle, do to both ends: 2 − 5 and 14 − 5.'],
  ['2 < x < 14', 'Take 5 from the ends too, then divide every part by 3.'],
  ['−3 < x < 9', 'That’s 3x. Divide all three parts by 3.'],
), 'Whatever is done to the middle must be done to both ends.', boardModel('2 < 3x +5 < 14', [
  undo('Subtract 5 from all three parts', 'Jude only did the middle. Take 5 from every part.', ['2 −5^ < 3x ~+5 ~−5^ < 14 −5^', '−3 < 3x < 9'], box('+5', '[+5]', 1)),
  divide(3, '3x', ['−3 ÷3^ < 3x ÷3^ < 9 ÷3^', '! −1 < x < 3'], 'Divide all three parts by the boxed 3.'),
]))

/* ---------- Rung 4: multiplying or dividing by a negative (A11.4): the sign flips ---------- */

/** Divide both sides by a negative: the sign flips, boxed in purple on the same row. */
const flipDivide = (by: number, letterTerm: string, left: string, flipped: string, right: string, answer: string): BoardMove => ({
  title: `Divide both sides by ${show(by)}: flip the sign`, say: 'Dividing by a negative number flips the sign: the other way round.', rows: [`${left} ÷${show(by)}^ [${flipped}] ${right} ÷${show(by)}^`, `! ${answer}`], mark: box(letterTerm, `[${show(by)}]${letterTerm.slice(show(by).length)}`),
})

const flip = worked(negative, `Solve ${nb('−3x > 12')}.`, 'Solve', 'A11.4 video + Q1', boardModel('−3x > 12', [
  flipDivide(-3, '−3x', '−3x', '<', '12', 'x < −4'),
]), 'Solve it like an equation, but when you multiply or divide by a negative number, flip the sign.')
video(flip, media('dividing-by-a-negative', 'Solve −3x > 12: the sign flips', 'A11.4_Multiplying_Or_Dividing_By_A_Negative.mp4', 87, [
  'Dividing by a negative: solve −3x > 12. One special rule: the sign flips.',
  'Why does the sign flip? Start with something true: 2 < 6. Multiply both sides by −1: −2 and −6. −2 is bigger than −6 (it’s closer to zero), so −2 > −6.',
  'On a number line, 6 is to the right of 2, so 2 < 6. But −2 is to the right of −6, so −2 > −6: the order swaps.',
  'Multiplying or dividing by a negative flips the sign.',
  'Solve −3x > 12: divide both sides by −3 to get x alone. We divided by a negative, so flip the sign: > becomes <. x < −4.',
  'Check: x = −5 gives −3 × (−5) = 15, and 15 > 12. x = −3 gives 9, and 9 is not > 12.',
]))
{
  const { interaction, diagnose } = solved('y ≥ −6', [['y ≤ −6', 'Multiplying by −1 flips the sign: ≤ becomes ≥.'], ['y ≥ 6', '6 × −1 is −6.'], ['y ≤ 6', 'Multiply both sides by −1: the 6 becomes −6, and the sign flips.']])
  practice(negative, `Solve ${nb('−y ≤ 6')}.`, 'A11.4 Q2', interaction, 'Multiply both sides by −1, and flip the sign.', boardModel('−y ≤ 6', [
    { title: 'Multiply both sides by −1: flip the sign', say: 'Multiplying by a negative number flips the sign: the other way round.', rows: ['−y ×−1^ [≥] 6 ×−1^', '! y ≥ −6'], mark: box('−y', '[−]y') },
  ]), diagnose)
}
{
  const { interaction, diagnose } = solved('x > 3', [['x < 3', 'Dividing by −2 flips the sign: < becomes >.'], ['x > −3', '−6 ÷ −2 is 3: a negative divided by a negative is positive.'], ['x > 7', 'Subtract 10 from both sides, don’t add it: −2x < −6.']])
  practice(negative, `Solve ${nb('10 − 2x < 4')}.`, 'A11.4 Q3', interaction, 'Subtract 10 from both sides. Then divide by −2 and flip the sign.', boardModel('10 −2x < 4', [
    undo('Subtract 10 from both sides', 'The boxed 10 is with the x term. Take 10 from both sides, so it cancels.', ['~10 −2x ~−10^ < 4 −10^', '−2x < −6'], box('10', '[10]', 0)),
    flipDivide(-2, '−2x', '−2x', '>', '−6', 'x > 3'),
  ]), diagnose)
}
{
  const { interaction, diagnose } = solved('k ≤ 3', [['k ≥ 3', 'Dividing by −3 flips the sign: ≥ becomes ≤.'], ['k ≤ −3', '−9 ÷ −3 is 3.'], ['k ≤ 5/3', 'Subtract 7 from both sides, don’t add it: −3k ≥ −9.']])
  practice(negative, `Solve ${nb('7 − 3k ≥ −2')}.`, 'A11.4 Q4a', interaction, 'Subtract 7 from both sides. Then divide by −3 and flip the sign.', boardModel('7 −3k ≥ −2', [
    undo('Subtract 7 from both sides', 'The boxed 7 is with the k term. Take 7 from both sides, so it cancels.', ['~7 −3k ~−7^ ≥ −2 −7^', '−3k ≥ −9'], box('7', '[7]', 0)),
    flipDivide(-3, '−3k', '−3k', '≤', '−9', 'k ≤ 3'),
  ]), diagnose)
}
practice(negative, `Write down the largest integer that satisfies ${nb('k ≤ 3')}.`, 'A11.4 Q4b', number(3, '3'), 'Is 3 itself included?', lineModel('k ≤ 3', given(ticks(-1, 5), [[3, true]], 'left'), [
  lineOf('3 is included', 'The sign is ≤', '≤ includes 3 itself: a filled circle.', 3),
  dots([3], 'The largest whole number', 'Nothing bigger than 3 fits.'),
], 'Read it'), slips(3, [[2, '≤ includes 3 itself, so 3 is the largest.'], [4, '4 is bigger than 3, so it doesn’t fit.']]))
{
  const { interaction, diagnose } = solved('x < 3', [['x > 3', '9 > 3x means 3x is less than 9: x < 3.'], ['x > −3', 'Add 2x to both sides to keep x positive: 5 > 3x − 4.'], ['x < 1/3', 'Add 2x and 4 to both sides first: 9 > 3x.']])
  practice(negative, `Solve ${nb('5 − 2x > x − 4')}.`, 'A11.4 Q5a', interaction, 'Add 2x to both sides so the x term is positive. Then add 4.', boardModel('5 −2x > x −4', [
    undo('Add 2x to both sides', 'Adding the boxed 2x to both sides keeps x positive, so the sign never needs to flip.', ['5 ~−2x ~+2x^ > x +2x^ −4', '5 > 3x −4'], box('−2x', '[−2x]', 0)),
    undo('Add 4 to both sides', 'The boxed −4 is stuck to 3x. Add 4 to both sides.', ['5 +4^ > 3x ~−4 ~+4^', '9 > 3x'], box('−4', '[−4]', 1)),
    divide(3, '3x', ['9 ÷3^ > 3x ÷3^', '! x < 3'], 'Divide both sides by the boxed 3. 3 is bigger than x: x is less than 3.'),
  ]), diagnose)
}
practice(negative, `Which number line shows ${nb('x < 3')}?`, 'A11.4 Q5b', choose(
  'An open circle at 3, and an arrow pointing left',
  ['A filled circle at 3, and an arrow pointing left', '< doesn’t include 3: the circle is open.'],
  ['An open circle at 3, and an arrow pointing right', 'Less than means smaller numbers, to the left.'],
  ['A filled circle at 3, and an arrow pointing right', '3 isn’t included (open), and smaller numbers are to the left.'],
), 'Is 3 included? Which way are the smaller numbers?', lineModel('x < 3', { ticks: ticks(0, 6) }, [
  circle(3, false, '3 isn’t included: leave it open', '< is strict, so 3 itself isn’t allowed.'),
  answerMove('Open circle at 3, arrow left', 'Smaller: the arrow points left', 'Less than means the smaller numbers, to the left.', shade(3, 'left', '', '')),
], 'Draw it'))
practice(negative, `Mia solves ${nb('−4x ≤ 8')} and writes ${nb('x ≤ −2')}. What is the right answer?`, 'A11.4 Q5c', choose(
  'x ≥ −2: dividing by −4 flips the sign',
  ['x ≤ −2 is right', 'She divided by −4, a negative number, so the sign must flip: x ≥ −2.'],
  ['x ≤ 2', '8 ÷ −4 is −2, and the sign flips: x ≥ −2.'],
  ['x ≥ 2', '8 ÷ −4 is −2, not 2.'],
), 'What happens to the sign when you divide by a negative?', boardModel('−4x ≤ 8', [
  flipDivide(-4, '−4x', '−4x', '≥', '8', 'x ≥ −2'),
]))

add('mixed', 'Solving inequalities', 'A11.1-A11.4 consolidation', text(
  'Integers are whole numbers. < leaves its number out; ≤ puts it in. −1 < x ≤ 3 gives 0, 1, 2, 3.',
  'Solve an inequality like an equation: do the same to both sides. 2x + 3 < 11 gives 2x < 8, so x < 4.',
  'Two signs: three parts, the same move on all three. 3 < 2x + 1 < 11 gives 2 < 2x < 10, so 1 < x < 5.',
  'Multiplying or dividing by a negative number flips the sign. −3x > 12 gives x < −4.',
))

export const tutorSolvingInequalitiesLesson: TutorMethodLesson = {
  id: 'L025', number: 25, title: 'Solving inequalities', level: 'GCSE Foundation',
  goal: 'List the integers in an inequality, solve linear inequalities including ones with two signs, and flip the sign when multiplying or dividing by a negative.',
  labels: { [listing]: 'List integers', [solving]: 'Solve', [twoSigns]: 'Two signs', [negative]: 'Negatives', mixed: 'Review' },
  states: finish(),
}
