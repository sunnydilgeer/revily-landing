import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { boardModel, box, choose, nb, number, pair, readNumbers, text, type BoardMove } from './boardWorkings'

/*
 * Lesson 27 (Algebra A12): Simultaneous equations, from Aniksha's A12.1 and A12.2 PDFs and videos. Two rungs, easiest
 * first: eliminate a letter by adding or taking away the equations, then form the two equations from words.
 * Both equations go on the A5 board at the start, labelled ① and ② as in the videos (EquationPictures.tsx).
 */

const { add, finish } = author(27)
const eliminate = 'simultaneous-elimination'
const words = 'simultaneous-words'

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
  // The board shows both equations, so the heading is only the instruction (EXPLANATIONS.md rule 1).
  state.content.heading = heading
  return state
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }
const media = (name: string, title: string, sourceFile: string, durationSeconds: number, textAlternative: string[]) => ({
  id: `lesson27-${name}`, src: `/media/lesson-27/${name}.mp4`, poster: `/media/lesson-27/${name}.svg`, title, durationSeconds, sourceFile, textAlternative,
})
const slips = (right: number, list: Slip[]) => (response: string) => diagnoseSlips(response, right, list)
/** Two values typed in order: says which one is wrong, or that they're the wrong way round. Then this question's own slips. */
function both(names: [string, string], right: [number, number], list: [[number, number], string][] = []) {
  return (response: string) => {
    const [a, b] = readNumbers(response)
    if (a === undefined || b === undefined || (a === right[0] && b === right[1])) return null
    const own = list.find(([values]) => values[0] === a && values[1] === b)
    if (own) return own[1]
    if (a === right[1] && b === right[0]) return `Check which is which: ${names[0]} first, then ${names[1]}.`
    if (a === right[0]) return `${names[0]} = ${String(a).replace('-', '−')} is right. Put it into one of the equations to find ${names[1]}.`
    if (b === right[1]) return `${names[1]} = ${String(b).replace('-', '−')} is right. Put it into one of the equations to find ${names[0]}.`
    return null
  }
}

/* ---------- Moves on the board ---------- */

const divide = (by: number, term: string, left: string, right: string, result: string): BoardMove => ({
  title: `Divide both sides by ${by}`, say: `The boxed ${by} multiplies the letter. Divide both sides by it.`,
  rows: [`${left} ÷${by}^ = ${right} ÷${by}^`, result], marks: [[-1, box(term, `[${by}]${term.slice(String(by).length)}`)]],
})
/** Swap a letter for the number just found: the letter boxed in the equation, and the number boxed where it was found. */
const swapIn = (letter: string, value: string, equation: 0 | 1, token: string, row: string, boxedToken = token.replace(letter, `[${letter}]`)): BoardMove => ({
  title: `Put ${letter} = ${value} into ${equation ? '②' : '①'}`,
  say: `${letter} is ${value} in both equations. Swap the boxed ${letter} for ${value}: there is only one letter left.`,
  rows: [row], marks: [[equation, box(token, boxedToken)], [-1, box(value)]],
})
const takeOff = (n: number, rows: string[]): BoardMove => ({
  title: `Subtract ${n} from both sides`, say: `The boxed ${n} is with the letter. Take ${n} from both sides, so it cancels.`, rows,
  marks: [[-1, line => line.split(' ').includes(`+${n}`) ? box(`+${n}`)(line) : box(String(n))(line)]],
})

/* ---------- Rung 1: elimination (A12.1) ---------- */

const cafe = worked(eliminate, `Solve the simultaneous equations ${nb('3x + 2y = 16')} and ${nb('x + 2y = 8')}.`, 'Solve', 'A12.1 video + Q1', boardModel(['① 3x +2y = 16', '② x +2y = 8'], [
  { title: 'Take ② away from ①', say: 'Both equations have the boxed +2y. Take ② away from ①: the y terms cancel, so only x is left.', marks: [[0, box('+2y')], [1, box('+2y')]], rows: ['3x −x^ ~+2y ~−2y^ = 16 −8^', '2x = 8'] },
  divide(2, '2x', '2x', '8', 'x = 4'),
  swapIn('x', '4', 1, 'x', '4 +2y = 8', '[x]'),
  takeOff(4, ['~4 ~−4^ +2y = 8 −4^', '2y = 4']),
  divide(2, '2y', '2y', '4', '! x = 4, y = 2'),
]), 'Make one letter disappear: take one equation away from the other. Find that letter, then put it back in to find the other.')
video(cafe, media('elimination', 'Solve 3x + 2y = 16 and x + 2y = 8', 'A12.1_Simultaneous_Equations_Elimination.mp4', 124, [
  'Two equations at once: 3x + 2y = 16 and x + 2y = 8. Find x and y.',
  'x and y are two mystery numbers. One equation is not enough, so we need both. The trick: make one letter disappear, then there is only one left.',
  'Number the equations: call them ① and ② so we can say which is which.',
  'Take ② away from ①. Write ② right under ①, so the parts line up. Top row minus bottom row: 2y − 2y = 0, so the y terms cancel out. 3x − x = 2x and 16 − 8 = 8, so 2x = 8.',
  'Find x: 2x means 2 times x, so divide both sides by 2. x = 4. Half done: we know x.',
  'Find y: put 4 where x was, in ② (the easier one). 4 + 2y = 8. Take 4 from both sides: 2y = 4. Divide both sides by 2.',
  'The answer: x = 4, y = 2.',
]))
practice(eliminate, `Solve the simultaneous equations ${nb('x + y = 9')} and ${nb('x − y = 3')}.`, 'A12.1 Q2', pair(['x =', 'y ='], [6, 3], 'x = 6, y = 3'), 'The y terms have opposite signs. Add the equations.', boardModel(['① x +y = 9', '② x −y = 3'], [
  { title: 'Add ① and ②', say: 'The boxed y terms have opposite signs, +y and −y. Add the equations, so they cancel.', marks: [[0, box('+y')], [1, box('−y')]], rows: ['x +x^ ~+y ~−y^ = 9 +3^', '2x = 12'] },
  divide(2, '2x', '2x', '12', 'x = 6'),
  swapIn('x', '6', 0, 'x', '6 +y = 9', '[x]'),
  takeOff(6, ['~6 ~−6^ +y = 9 −6^', '! x = 6, y = 3']),
]), both(['x', 'y'], [6, 3], [[[3, 6], 'Check which is which: x first, then y.'], [[12, -3], 'Divide 12 by 2: 2x = 12, so x = 6.']]))
practice(eliminate, `Solve the simultaneous equations ${nb('2x + 3y = 19')} and ${nb('2x + y = 11')}.`, 'A12.1 Q3', pair(['x =', 'y ='], [3.5, 4], 'x = 3.5, y = 4'), 'Both have 2x. Take ② away from ① to get rid of x.', boardModel(['① 2x +3y = 19', '② 2x +y = 11'], [
  { title: 'Take ② away from ①', say: 'Both equations have the boxed 2x. Take ② away from ①: the x terms cancel, so only y is left.', marks: [[0, box('2x')], [1, box('2x')]], rows: ['~2x ~−2x^ +3y −y^ = 19 −11^', '2y = 8'] },
  divide(2, '2y', '2y', '8', 'y = 4'),
  swapIn('y', '4', 1, '+y', '2x +4 = 11', '+[y]'),
  takeOff(4, ['2x ~+4 ~−4^ = 11 −4^', '2x = 7']),
  divide(2, '2x', '2x', '7', '! x = 3.5, y = 4'),
]), both(['x', 'y'], [3.5, 4], [[[4, 3.5], 'Check which is which: x first, then y.'], [[3.5, 8], 'Divide by 2: 2y = 8, so y = 4.']]))
practice(eliminate, `Solve the simultaneous equations ${nb('3x + 2y = 12')} and ${nb('x + y = 5')}.`, 'A12.1 Q4a', pair(['x =', 'y ='], [2, 3], 'x = 2, y = 3'), 'Multiply the second equation by 2, so both have 2y.', boardModel(['① 3x +2y = 12', '② x +y = 5'], [
  { title: 'Multiply ② by 2', say: 'The y terms don’t match yet: 2y and y. Multiply every term in ② by 2, so both have 2y.', marks: [[1, box('+y')]], rows: ['> ② × 2', '2x +2y = 10'] },
  { title: 'Take it away from ①', say: 'Now both have the boxed +2y. Take the new equation away from ①: the y terms cancel.', marks: [[0, box('+2y')], [-1, box('+2y')]], rows: ['3x −2x^ ~+2y ~−2y^ = 12 −10^', 'x = 2'] },
  swapIn('x', '2', 1, 'x', '2 +y = 5', '[x]'),
  takeOff(2, ['~2 ~−2^ +y = 5 −2^', '! x = 2, y = 3']),
]), both(['x', 'y'], [2, 3], [[[7, -4.5], 'Multiply all of ② by 2, the 5 too: 2x + 2y = 10.']]))
practice(eliminate, `Check ${nb('x = 2, y = 3')} in the first equation: work out ${nb('3x + 2y')}.`, 'A12.1 Q4b', number(12, '12'), 'Put 2 where x is and 3 where y is.', boardModel(['① 3x +2y = 12'], [
  { title: 'Put in x = 2 and y = 3', say: 'Swap each letter for its number: 3x is 3 × 2 and 2y is 2 × 3.', marks: [[0, line => line.replace('3x', '3[x]').replace('+2y', '+2[y]')]], rows: ['3×2 +2×3 = 12'] },
  { title: 'Work it out', say: 'Multiply, then add. It should come to 12, the other side of ①.', rows: ['6 +6 = 12', '! 12 = 12 ✓'] },
], 'Check'), slips(12, [[11, '3 × 2 = 6 and 2 × 3 = 6: 6 + 6 = 12.'], [10, '3x is 3 × 2, not 3 + 2.'], [13, '3x is 3 × 2 and 2y is 2 × 3.']]))
practice(eliminate, `Solve the simultaneous equations ${nb('4x + 3y = 23')} and ${nb('2x − y = 4')}.`, 'A12.1 Q5a', pair(['x =', 'y ='], [3.5, 3], 'x = 3.5, y = 3'), 'Multiply the second equation by 2, so both have 4x.', boardModel(['① 4x +3y = 23', '② 2x −y = 4'], [
  { title: 'Multiply ② by 2', say: 'The x terms don’t match yet: 4x and 2x. Multiply every term in ② by 2, so both have 4x.', marks: [[1, box('2x')]], rows: ['> ② × 2', '4x −2y = 8'] },
  { title: 'Take it away from ①', say: 'Both have the boxed 4x. Take the new equation away from ①: 4x cancels, and taking away −2y adds 2y.', marks: [[0, box('4x')], [-1, box('4x')]], rows: ['~4x ~−4x^ +3y +2y^ = 23 −8^', '5y = 15'] },
  divide(5, '5y', '5y', '15', 'y = 3'),
  swapIn('y', '3', 1, '−y', '2x −3 = 4', '−[y]'),
  { title: 'Add 3 to both sides', say: 'The boxed −3 is with 2x. Add 3 to both sides, so it cancels.', marks: [[-1, box('−3')]], rows: ['2x ~−3 ~+3^ = 4 +3^', '2x = 7'] },
  divide(2, '2x', '2x', '7', '! x = 3.5, y = 3'),
]), both(['x', 'y'], [3.5, 3], [[[19 / 6, 15], 'Taking away −2y adds 2y: 3y − (−2y) = 5y, so 5y = 15.'], [[3.5, 15], 'Divide by 5: 5y = 15, so y = 3.']]))
practice(eliminate, `In the last question, why were the equations ${nb('4x + 3y = 23')} and ${nb('4x − 2y = 8')} taken away, not added?`, 'A12.1 Q5b', choose(
  'Both x terms are +4x, the same sign, so taking away cancels them',
  ['Taking away always works', 'Adding is right when the signs are different, like +y and −y. Here both are +4x.'],
  ['Adding would cancel the x terms', '4x + 4x = 8x. Same signs cancel when you take one away.'],
  ['The y terms had the same sign', 'The y terms were +3y and −2y. It was the x terms that matched.'],
), 'Look at the signs of the terms you want to get rid of.', boardModel(['① 4x +3y = 23', '4x −2y = 8'], [
  { title: 'Same sign: take away', say: 'Both are +4x. Taking one from the other leaves no x, so it cancels. Adding would give 8x.', marks: [[0, box('4x')], [1, box('4x')]], rows: ['! 4x − 4x = 0'] },
], 'Why'))
practice(eliminate, `Sam solves ${nb('x + y = 10')} and ${nb('x − y = 2')} by taking the second from the first. He gets ${nb('2y = 8')}, so ${nb('y = 4')}. Is Sam correct?`, 'A12.1 Q5c', choose(
  'Yes: y − (−y) = 2y, so y = 4 and x = 6',
  ['No: taking away gives 0y, so add instead', 'y − (−y) is y + y = 2y, so taking away works too.'],
  ['No: 10 − 2 is 12', '10 − 2 = 8, so 2y = 8 is right.'],
  ['No: y = 6', 'That’s x. y = 4: 6 + 4 = 10 and 6 − 4 = 2.'],
), 'Take away carefully: what is y − (−y)?', boardModel(['① x +y = 10', '② x −y = 2'], [
  { title: 'Take ② away from ①', say: 'Both have the boxed x. Taking away −y adds y: y − (−y) = 2y.', marks: [[0, box('x')], [1, box('x')]], rows: ['~x ~−x^ +y +y^ = 10 −2^', '2y = 8'] },
  divide(2, '2y', '2y', '8', 'y = 4'),
  swapIn('y', '4', 0, '+y', 'x +4 = 10', '+[y]'),
  takeOff(4, ['x ~+4 ~−4^ = 10 −4^', '! x = 6, y = 4']),
]))

// Sunny, 5 Oct: neither letter matches until both equations are multiplied, one by 2 and the other by 3.
worked(eliminate, `Solve the simultaneous equations ${nb('2x + 3y = 13')} and ${nb('3x + 2y = 12')}.`, 'Solve', 'A12.1 extra worked (× 3 and × 2)', boardModel(['① 2x +3y = 13', '② 3x +2y = 12'], [
  { title: 'Multiply ① by 3', say: 'Neither letter matches yet: 2x and 3x. 2x × 3 and 3x × 2 both make 6x. Start with every term in ① times 3, the number after the equals sign too.', marks: [[0, box('2x')]], rows: ['> ① × 3', '6x +9y = 39'] },
  { title: 'Multiply ② by 2', say: 'Every term in ② times 2. Now both have 6x.', marks: [[1, box('3x')]], rows: ['> ② × 2', '6x +4y = 24'] },
  { title: 'Take one away from the other', say: 'Both new equations have the boxed 6x. Take the second away from the first: the x terms cancel.', marks: [[3, box('6x')], [5, box('6x')]], rows: ['~6x ~−6x^ +9y −4y^ = 39 −24^', '5y = 15'] },
  divide(5, '5y', '5y', '15', 'y = 3'),
  { title: 'Put y = 3 into ①', say: 'y is 3 in both equations. Swap the boxed y for 3: 3 × 3 is 9.', marks: [[0, box('+3y', '+3[y]')], [-1, box('3')]], rows: ['2x +3×3 = 13', '2x +9 = 13'] },
  takeOff(9, ['2x ~+9 ~−9^ = 13 −9^', '2x = 4']),
  divide(2, '2x', '2x', '4', '! x = 2, y = 3'),
]), 'When neither letter matches, multiply both equations. Pick numbers that give the same x term in both, like 6x from 2x × 3 and 3x × 2.')
practice(eliminate, `Solve the simultaneous equations ${nb('3x + 2y = 19')} and ${nb('2x + 3y = 16')}.`, 'A12.1 extra (× 2 and × 3)', pair(['x =', 'y ='], [5, 2], 'x = 5, y = 2'), 'Multiply ① by 2 and ② by 3, so both have 6x.', boardModel(['① 3x +2y = 19', '② 2x +3y = 16'], [
  { title: 'Multiply ① by 2', say: 'Neither letter matches yet: 3x and 2x. 3x × 2 and 2x × 3 both make 6x. Every term in ① times 2.', marks: [[0, box('3x')]], rows: ['> ① × 2', '6x +4y = 38'] },
  { title: 'Multiply ② by 3', say: 'Every term in ② times 3. Now both have 6x.', marks: [[1, box('2x')]], rows: ['> ② × 3', '6x +9y = 48'] },
  { title: 'Take one away from the other', say: 'Both new equations have the boxed 6x. Take the first away from the second: the x terms cancel.', marks: [[3, box('6x')], [5, box('6x')]], rows: ['~6x ~−6x^ +9y −4y^ = 48 −38^', '5y = 10'] },
  divide(5, '5y', '5y', '10', 'y = 2'),
  { title: 'Put y = 2 into ①', say: 'Swap the boxed y for 2: 2 × 2 is 4.', marks: [[0, box('+2y', '+2[y]')], [-1, box('2')]], rows: ['3x +2×2 = 19', '3x +4 = 19'] },
  takeOff(4, ['3x ~+4 ~−4^ = 19 −4^', '3x = 15']),
  divide(3, '3x', '3x', '15', '! x = 5, y = 2'),
]), both(['x', 'y'], [5, 2]))

/* ---------- Rung 2: from words (A12.2) ---------- */

const teas = worked(words, 'A café sells teas and cakes. 2 teas and 1 cake cost £7. 2 teas and 3 cakes cost £13. Work out the cost of one tea and one cake.', '2 teas + 1 cake: £7. 2 teas + 3 cakes: £13', 'A12.2 video + Q1', boardModel([], [
  { title: 'Write the two equations', say: 'Let t be the cost of a tea and c the cost of a cake, in pounds. Each sentence becomes an equation.', rows: ['① 2t +c = 7', '② 2t +3c = 13'] },
  { title: 'Take ① away from ②', say: 'Both have the boxed 2t: the teas cost the same on both trays. Take ① away from ②, so they cancel.', marks: [[0, box('2t')], [1, box('2t')]], rows: ['~2t ~−2t^ +3c −c^ = 13 −7^', '2c = 6'] },
  divide(2, '2c', '2c', '6', 'c = 3'),
  swapIn('c', '3', 0, '+c', '2t +3 = 7', '+[c]'),
  takeOff(3, ['2t ~+3 ~−3^ = 7 −3^', '2t = 4']),
  divide(2, '2t', '2t', '4', '! Tea £2, cake £3'),
], 'Work it out'), 'Give each price a letter and write an equation for each sentence. Then solve them like A12.1, and answer in words.')
video(teas, media('worded-problems', 'Teas and cakes: £7 and £13', 'A12.2_Simultaneous_Equations_Worded_Problems.mp4', 104, [
  'Teas and cakes: 2 teas and 1 cake cost £7. 2 teas and 3 cakes cost £13. How much is each?',
  'Turn words into letters: we do not know the price of a tea, so call it t. We do not know the price of a cake, so call it c. Now each sentence can become an equation.',
  'Both trays have 2 teas, so the teas cost the same on both. Tray 2 has 2 more cakes and costs £6 more.',
  'Write the two equations: “2 teas and 1 cake cost £7” is ① 2t + c = 7. “2 teas and 3 cakes cost £13” is ② 2t + 3c = 13.',
  'Take ① away from ②: write ① under ②, so the parts line up. 2t − 2t = 0, so the t terms cancel out. 3c − c = 2c and 13 − 7 = 6, so 2c = 6.',
  'Divide both sides by 2: c = 3. Put 3 where c was, in ①: 2t + 3 = 7. Take 3 from both sides, then divide by 2: t = 2.',
  'Answer in words: t was a tea and c was a cake, so a tea costs £2 and a cake costs £3. Check ②: 2 × 2 + 3 × 3 = 4 + 9 = 13 ✓.',
]))
{
  const state = practice(words, '3 pens and 1 ruler cost £5. 1 pen and 1 ruler cost £3. Find the cost of a pen.', 'A12.2 Q2', number(1, '£1'), 'Take the second from the first: the rulers cancel.', boardModel([], [
    { title: 'Write the two equations', say: 'Let p be the cost of a pen and r the cost of a ruler, in pounds.', rows: ['① 3p +r = 5', '② p +r = 3'] },
    { title: 'Take ② away from ①', say: 'Both have the boxed +r: one ruler each. Take ② away from ①, so the rulers cancel.', marks: [[0, box('+r')], [1, box('+r')]], rows: ['3p −p^ ~+r ~−r^ = 5 −3^', '2p = 2'] },
    divide(2, '2p', '2p', '2', '! A pen costs £1'),
  ], 'Work it out'), slips(1, [[2, 'That’s 2 pens. Divide by 2: 2p = 2, so p = 1.'], [8, 'Take the second equation away, don’t add it.']]))
  state.answerPrefix = '£'
}
practice(words, 'An adult ticket costs a pounds and a child ticket costs c pounds. 2 adults and 3 children pay £31. 2 adults and 1 child pay £21. Find a and c.', 'A12.2 Q3', pair(['a =', 'c ='], [8, 5], 'a = 8, c = 5'), 'Write both equations. Both have 2a: take one away from the other.', boardModel([], [
  { title: 'Write the two equations', say: 'Each sentence becomes an equation: 2 adults is 2a, 3 children is 3c.', rows: ['① 2a +3c = 31', '② 2a +c = 21'] },
  { title: 'Take ② away from ①', say: 'Both have the boxed 2a. Take ② away from ①, so the adults cancel.', marks: [[0, box('2a')], [1, box('2a')]], rows: ['~2a ~−2a^ +3c −c^ = 31 −21^', '2c = 10'] },
  divide(2, '2c', '2c', '10', 'c = 5'),
  swapIn('c', '5', 1, '+c', '2a +5 = 21', '+[c]'),
  takeOff(5, ['2a ~+5 ~−5^ = 21 −5^', '2a = 16']),
  divide(2, '2a', '2a', '16', '! a = 8, c = 5'),
], 'Work it out'), both(['a', 'c'], [8, 5], [[[16, 5], 'That’s 2a. Divide by 2: a = 8.'], [[8, 10], 'That’s 2c. Divide by 2: c = 5.']]))
{
  const state = practice(words, '4 burgers and 2 drinks cost £22. 1 burger and 1 drink cost £7. Write two equations and solve them to find the cost of a burger.', 'A12.2 Q4a', number(4, '£4'), 'Let b be a burger and d a drink. Multiply the second equation by 2 so the drinks match.', boardModel([], [
    { title: 'Write the two equations', say: 'Let b be the cost of a burger and d the cost of a drink, in pounds.', rows: ['① 4b +2d = 22', '② b +d = 7'] },
    { title: 'Multiply ② by 2', say: 'The drinks don’t match yet: 2d and d. Multiply every term in ② by 2, so both have 2d.', marks: [[1, box('+d')]], rows: ['> ② × 2', '2b +2d = 14'] },
    { title: 'Take it away from ①', say: 'Both have the boxed +2d. Take the new equation away from ①, so the drinks cancel.', marks: [[0, box('+2d')], [-1, box('+2d')]], rows: ['4b −2b^ ~+2d ~−2d^ = 22 −14^', '2b = 8'] },
    divide(2, '2b', '2b', '8', '! A burger costs £4'),
  ], 'Work it out'), slips(4, [[5, 'Multiply all of ② by 2, the 7 too: 2b + 2d = 14.'], [8, 'That’s 2 burgers. Divide by 2.'], [3, 'That’s a drink. The question asks for a burger.']]))
  state.answerPrefix = '£'
}
{
  const state = practice(words, 'A burger costs £4. Use 1 burger and 1 drink cost £7 to work out the cost of a drink.', 'A12.2 Q4b', number(3, '£3'), 'Put b = 4 into b + d = 7.', boardModel(['② b +d = 7'], [
    { title: 'Put b = 4 into ②', say: 'A burger is £4. Swap the boxed b for 4: only d is left.', marks: [[0, box('b', '[b]')]], rows: ['4 +d = 7'] },
    { title: 'Subtract 4 from both sides', say: 'The boxed 4 is with d. Take 4 from both sides, so it cancels.', marks: [[-1, box('4')]], rows: ['~4 ~−4^ +d = 7 −4^', '! A drink costs £3'] },
  ], 'Work it out'), slips(3, [[11, 'Take 4 away from 7, don’t add it.'], [4, 'That’s a burger. A drink is 7 − 4.']]))
  state.answerPrefix = '£'
}
practice(words, 'A shop sells notebooks for n pence and pencils for p pence. 3 notebooks and 4 pencils cost 390p. 2 notebooks and 3 pencils cost 270p. Find n and p.', 'A12.2 Q5a', pair(['n =', 'p ='], [90, 30], 'n = 90, p = 30'), 'Multiply the first by 2 and the second by 3, so both have 6n.', boardModel([], [
  { title: 'Write the two equations', say: '3 notebooks and 4 pencils is 3n + 4p, in pence. The same for the second sentence.', rows: ['① 3n +4p = 390', '② 2n +3p = 270'] },
  { title: 'Multiply ① by 2', say: 'Neither letter matches yet. 3n × 2 and 2n × 3 both make 6n. Start with every term in ① times 2.', marks: [[0, box('3n')]], rows: ['> ① × 2', '6n +8p = 780'] },
  { title: 'Multiply ② by 3', say: 'Every term in ② times 3: now both have 6n.', marks: [[1, box('2n')]], rows: ['> ② × 3', '6n +9p = 810'] },
  { title: 'Take one away from the other', say: 'Both have the boxed 6n. Take the first away from the second, so n cancels.', marks: [[3, box('6n')], [5, box('6n')]], rows: ['~6n ~−6n^ +9p −8p^ = 810 −780^', 'p = 30'] },
  { title: 'Put p = 30 into ①', say: 'Swap the boxed p for 30. 4 × 30 is 120.', marks: [[0, box('+4p', '+4[p]')], [-1, box('30')]], rows: ['3n +4×30 = 390', '3n +120 = 390'] },
  takeOff(120, ['3n ~+120 ~−120^ = 390 −120^', '3n = 270']),
  divide(3, '3n', '3n', '270', '! n = 90, p = 30'),
], 'Work it out'), both(['n', 'p'], [90, 30], [[[30, 90], 'Check which is which: n is a notebook, p is a pencil.'], [[270, 30], 'That’s 3n. Divide by 3: n = 90.']]))
{
  const state = practice(words, 'A notebook costs 90p and a pencil costs 30p. How much do 5 notebooks and 2 pencils cost, in pence?', 'A12.2 Q5b', number(510, '510p (£5.10)'), 'Work out 5 × 90 and 2 × 30, then add.', boardModel([], [
    { title: 'Put in the prices', say: '5 notebooks is 5 × 90 and 2 pencils is 2 × 30.', rows: ['5n +2p = 5×90 +2×30'] },
    { title: 'Multiply', say: 'Work out each part first.', rows: ['= 450 +60'] },
    { title: 'Add', say: 'Add the two parts: the cost in pence.', rows: ['! 510p = £5.10'] },
  ], 'Work it out'), slips(510, [[5.1, 'That’s in pounds. The answer box is in pence: 510.'], [480, '5 × 90 = 450 and 2 × 30 = 60: 450 + 60 = 510.']]))
  state.answerLabel = 'Cost (p)'
}
practice(words, 'Priya says that “2 apples and 2 bananas cost £4” is enough to find the cost of one apple. Is Priya correct?', 'A12.2 Q5c', choose(
  'No: one equation with two letters has lots of answers, so you need a second equation',
  ['Yes: 4 ÷ 2 = 2, so an apple is £2', 'That leaves nothing for the bananas. 2 apples and 2 bananas cost £4 together.'],
  ['Yes: an apple and a banana must cost £1 each', 'They could: but £1.50 and 50p fit too. One equation can’t tell which.'],
  ['No: you need the price of a banana first', 'You don’t know either price. Two letters need two equations.'],
), 'Try two different prices for an apple. Do they both fit?', boardModel([], [
  { title: 'Write the equation', say: 'Let a be an apple and b a banana, in pounds.', rows: ['2a +2b = 4'] },
  { title: 'Try a = 1', say: 'If an apple is £1, the bananas cost £2, so a banana is £1.', rows: ['> a = 1: b = 1 fits'] },
  { title: 'Try a = 1.5', say: 'If an apple is £1.50, a banana is 50p. That fits too, so one equation can’t give the price.', rows: ['! a = 1.5, b = 0.5 fits too'] },
], 'Why'))

add('mixed', 'Simultaneous equations', 'A12.1-A12.2 consolidation', text(
  'Number the equations ① and ②. Make one letter disappear: take one away from the other when its terms are the same (2y and 2y), add them when the signs are different (+y and −y).',
  'If no letter matches, multiply an equation first: x + y = 5 times 2 is 2x + 2y = 10.',
  'Find the first letter, then put it back into the easier equation to find the other.',
  'From words: give each unknown price a letter, write one equation per sentence, then answer in words.',
))

export const tutorSimultaneousEquationsLesson: TutorMethodLesson = {
  id: 'L027', number: 27, title: 'Simultaneous equations', level: 'GCSE Foundation',
  goal: 'Solve two simultaneous equations by adding or taking them away, multiplying one first when no letter matches, and write them from a problem in words.',
  labels: { [eliminate]: 'Eliminate', [words]: 'From words', mixed: 'Review' },
  states: finish(),
}
