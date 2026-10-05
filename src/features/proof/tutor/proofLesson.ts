import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { AngleFrame } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { sameCollectedExpression, sameFactorised } from '../../number-types/lessonMath'
import { boardModel, box, choose, expression, nb, number, text } from '../../simultaneous-equations/tutor/boardWorkings'

/*
 * Lesson 28 (Algebra A13): Proof, from Aniksha's A13.1–A13.4 PDFs and videos. Four rungs in the PDFs' order: disprove
 * with one counterexample, show two expressions are identical (≡), prove angle facts, and prove facts about odd and
 * even numbers with algebra. The workings use the A5 board (EquationPictures.tsx): a proof writes the left side once
 * and carries on down the = column until it matches. Angle proofs draw the triangle above the board (AnglePictures.tsx).
 */

const { add, finish } = author(28)
const counterexample = 'proof-counterexample'
const identity = 'proof-identity'
const geometric = 'proof-geometric'
const algebraic = 'proof-algebraic'

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
  state.content.heading = heading
  return state
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }
const media = (name: string, title: string, sourceFile: string, durationSeconds: number, textAlternative: string[]) => ({
  id: `lesson28-${name}`, src: `/media/lesson-28/${name}.mp4`, poster: `/media/lesson-28/${name}.svg`, title, durationSeconds, sourceFile, textAlternative,
})
const slips = (right: number, list: Slip[]) => (response: string) => diagnoseSlips(response, right, list)
/** An expression typed in: this question's own slips, matched however the terms are ordered. */
const expressionSlips = (list: [string, string][]) => (response: string) => list.find(([wrong]) => sameCollectedExpression(response, wrong.replace(/−/g, '-')))?.[1] ?? null
const degrees = (state: TutorMethodState) => { state.answerLabel = 'Angle (°)'; return state }

/* ---------- Rung 1: disproof by counterexample (A13.1) ---------- */

const mia = worked(counterexample, 'Mia says, “If you double a number and add 1, the answer is always a prime number.” Show that Mia is wrong.', 'Double and add 1: always prime?', 'A13.1 video + Q1', boardModel([], [
  { title: 'Try n = 1, 2, 3', say: '“Always” means every number, with no exceptions. Try small numbers and check each answer.', rows: ['>0 n = 1: 2 × 1 + 1 = 3, prime ✓', '>0 n = 2: 2 × 2 + 1 = 5, prime ✓', '>0 n = 3: 2 × 3 + 1 = 7, prime ✓'] },
  { title: 'Try n = 4', say: 'Three numbers working proves nothing: keep going until one fails.', rows: ['>0 n = 4: 2 × 4 + 1 = 9'] },
  { title: 'One failure is enough', say: 'To disprove “always” you need only one example where it fails: a counterexample.', rows: ['! 9 = 3 × 3: not prime'] },
], 'Show it'), 'To show a claim is wrong, find one example where it fails: a counterexample. Write the working for that one value.')
video(mia, media('counterexample', 'Is Mia right? 2n + 1', 'A13.1_Proof_Disproof_By_Counterexample.mp4', 76, [
  'Is Mia right? Mia says: double any number and add 1, you always get a prime. 2n + 1.',
  '“Always” means every single number, no exceptions. So if we find just one number that fails, Mia is wrong. That one number is called a counterexample.',
  'Try numbers one by one: n = 1 gives 2 × 1 + 1 = 3, prime. n = 2 gives 5, prime. n = 3 gives 7, prime. n = 4 gives 2 × 4 + 1 = 9, and 9 = 3 × 3.',
  'The first three work, but that proves nothing. 9 is not prime: one failure is enough.',
  'Counterexample: n = 4 gives 9, which is not prime. Mia checked 3, 5 and 7 and stopped, so she was wrong.',
  'To disprove “always”, find one failure, and show the working for that one value.',
]))
practice(counterexample, 'Jack says, “All multiples of 3 are odd.” Which number shows that Jack is wrong?', 'A13.1 Q2', choose(
  '6',
  ['9', '9 is a multiple of 3, but it’s odd: it agrees with Jack.'],
  ['8', '8 is even, but it isn’t a multiple of 3.'],
  ['15', '15 is a multiple of 3, but it’s odd: it agrees with Jack.'],
), 'Find a multiple of 3 that is even.', boardModel([], [
  { title: 'List some multiples of 3', say: 'Look for one that is even.', rows: ['>0 3, 6, 9, 12, 15'] },
  { title: 'Find an even one', say: 'One even multiple of 3 is enough to show Jack is wrong.', rows: ['! 6 = 2 × 3: even'] },
], 'Show it'))
practice(counterexample, 'Ava says, “When you square a number, the answer is always bigger than the number.” Which number shows that Ava is wrong?', 'A13.1 Q3', choose(
  '1',
  ['3', '3² = 9, and 9 is bigger than 3: it agrees with Ava.'],
  ['−2', '(−2)² = 4, and 4 is bigger than −2: it agrees with Ava.'],
  ['10', '10² = 100, which is bigger: it agrees with Ava.'],
), 'Try 1, or a number between 0 and 1.', boardModel([], [
  { title: 'Try 1', say: 'Square it and compare with the number itself.', rows: ['1² = 1 × 1', '= 1'] },
  { title: 'Is it bigger?', say: '1 is the same as 1, not bigger, so the claim fails. A number between 0 and 1, like 0.5, fails too: 0.5² = 0.25.', rows: ['! 1² = 1: not bigger'] },
], 'Show it'))
practice(counterexample, 'Leo says, “The sum of two prime numbers is always even.” Which sum shows that Leo is wrong?', 'A13.1 Q4a', choose(
  '2 + 3 = 5',
  ['3 + 5 = 8', '8 is even: it agrees with Leo.'],
  ['1 + 2 = 3', '1 isn’t a prime number.'],
  ['5 + 7 = 12', '12 is even: it agrees with Leo.'],
), '2 is the only even prime. Add 2 to another prime.', boardModel([], [
  { title: 'Use the even prime', say: '2 is the only even prime. Add it to another prime.', rows: ['2 +3 = 5'] },
  { title: 'Is it even?', say: '5 is odd, so one sum is enough to show Leo is wrong.', rows: ['! 5 is odd'] },
], 'Show it'))
practice(counterexample, 'Explain why Leo’s statement works for every pair of odd primes.', 'A13.1 Q4b', choose(
  'Odd + odd is always even',
  ['Every prime is odd', '2 is prime, and it’s even.'],
  ['Primes only have two factors', 'True, but that doesn’t make their sum even.'],
  ['The primes are close together', '3 + 97 = 100 is even too: it’s about odd + odd.'],
), 'What happens when you add two odd numbers?', boardModel([], [
  { title: 'Try some odd primes', say: 'Every pair of odd numbers adds to an even number.', rows: ['>0 3 + 5 = 8', '>0 7 + 11 = 18'] },
  { title: 'Why', say: 'Each odd number is an even number and 1 more. The two 1s make 2, so the total is even.', rows: ['! Odd + odd = even'] },
], 'Explain'))
practice(counterexample, `Zara says, “${nb('n² + n + 11')} is prime for every whole number n.” Which value of n shows that Zara is wrong?`, 'A13.1 Q5a', choose(
  'n = 10: 121 = 11 × 11',
  ['n = 1: 13', '13 is prime: it agrees with Zara.'],
  ['n = 2: 17', '17 is prime: it agrees with Zara.'],
  ['n = 5: 41', '41 is prime: it agrees with Zara.'],
), 'Look for a value where the answer can be split into factors. Try n = 10.', boardModel([], [
  { title: 'Try n = 10', say: 'Put 10 where n is.', rows: ['10² +10 +11 = 100 +10 +11', '= 121'] },
  { title: 'Is it prime?', say: '121 has a factor other than 1 and itself, so it isn’t prime. One failure is enough.', rows: ['! 121 = 11 × 11'] },
], 'Show it'))
practice(counterexample, 'Zara checked n = 1 to n = 9 and they were all prime. Why does this not prove her statement?', 'A13.1 Q5b', choose(
  'Checking some values doesn’t prove it for every value',
  ['It does prove it: nine is plenty', 'n = 10 fails, so nine examples weren’t enough.'],
  ['She should have checked n = 0 too', 'n = 0 gives 11, which is prime: still not a proof.'],
  ['Only even values of n matter', 'Every whole number counts. n = 10 is the one that fails.'],
), 'Can nine examples cover every number?', boardModel([], [
  { title: 'Look past the examples', say: 'Nine examples can’t cover every number. n = 10 is the first one that fails.', rows: ['>0 n = 1 to 9: all prime', '>0 n = 10: 121 = 11 × 11'] },
  { title: 'What a proof needs', say: 'A proof shows it for every value. Examples can only show it is wrong.', rows: ['! Some values: not a proof'] },
], 'Explain'))
practice(counterexample, `Tom says, “If ${nb('a > b')} then ${nb('a² > b²')}.” Which pair shows that Tom is wrong?`, 'A13.1 Q5c', choose(
  'a = 1, b = −3',
  ['a = 5, b = 2', '25 > 4: it agrees with Tom. Try a negative.'],
  ['a = 2, b = −1', '4 > 1: it agrees with Tom.'],
  ['a = −3, b = 1', 'a has to be bigger than b, and −3 is smaller than 1.'],
), 'Use a negative number for b.', boardModel([], [
  { title: 'Check a > b', say: '1 is bigger than −3, so the pair fits the “if”.', rows: ['>0 1 > −3 ✓'] },
  { title: 'Square both', say: 'A negative number squared is positive. Compare the squares.', rows: ['>0 1² = 1, (−3)² = 9'] },
  { title: 'Compare', say: '1 is less than 9, so a² isn’t bigger: Tom is wrong.', rows: ['! 1 < 9'] },
], 'Show it'))

/* ---------- Rung 2: showing two expressions are identical (A13.2) ---------- */

const expand = worked(identity, `Show that ${nb('(x + 3)² − x² ≡ 6x + 9')}.`, 'Show the two sides are identical', 'A13.2 video + Q1', boardModel(['(x+3)² −x² ≡ 6x +9'], [
  { title: 'Write the square as two brackets', say: '≡ means always equal, whatever x is. Work on the left side only: (x + 3)² means (x + 3) times (x + 3).', marks: [[0, box('(x+3)²')]], rows: ['(x+3)² −x² = (x+3)(x+3) −x²'] },
  { title: 'Expand the brackets', say: 'Every term times every term: x × x, x × 3, 3 × x and 3 × 3.', marks: [[-1, box('(x+3)(x+3)')]], rows: ['= x² +3x +3x +9 −x²'] },
  { title: 'Collect the x terms', say: '3x and 3x are like terms.', marks: [[-1, box('+3x')]], rows: ['= x² +6x +9 −x²'] },
  { title: 'Cancel the x² terms', say: '+x² and −x² add to nothing. What is left is exactly the right side.', marks: [[-1, line => box('−x²')(box('x²')(line))]], rows: ['= ~x² +6x +9 ~−x²', '! 6x + 9 ✓'] },
], 'Show it'), 'Work on one side only. Expand every bracket and collect like terms until it matches the other side.')
video(expand, media('identity', 'Show (x + 3)² − x² ≡ 6x + 9', 'A13.2_Proof_Algebraic_Equivalent.mp4', 80, [
  'Are these the same? Show that (x + 3)² − x² ≡ 6x + 9.',
  '≡ has three lines: it means always equal, whatever x is. To show it, we only touch the left side, and keep tidying it until it looks like the right.',
  'Open the bracket: (x + 3)² is (x + 3)(x + 3). In a grid: x × x = x², x × 3 = 3x, 3 × x = 3x and 3 × 3 = 9. Add the four pieces: x² + 3x + 3x + 9 = x² + 6x + 9.',
  'Put it back in: the left side was (x + 3)² − x², so it becomes x² + 6x + 9 − x². There is + x² at the start and − x² at the end.',
  'Cancel and compare: + x² and − x² add to nothing, leaving 6x + 9. That is exactly the right side, so (x + 3)² − x² ≡ 6x + 9.',
  'Check with x = 1: (1 + 3)² − 1² = 15 and 6 × 1 + 9 = 15.',
  'Work on one side only, expand every bracket fully, and collect terms until it matches.',
]))
practice(identity, `Show that ${nb('3(x + 2) + 2x ≡ 5x + 6')}. Expand and simplify the left side.`, 'A13.2 Q2', expression('5x + 6'), 'Expand the bracket, then collect the x terms.', boardModel(['3(x+2) +2x ≡ 5x +6'], [
  { title: 'Expand the bracket', say: 'The boxed 3 multiplies everything inside: 3 × x and 3 × 2.', marks: [[0, box('3(x+2)', '[3](x+2)')]], rows: ['3(x+2) +2x = 3x +6 +2x'] },
  { title: 'Collect the x terms', say: '3x and 2x are like terms. What is left is the right side.', marks: [[-1, line => box('+2x')(box('3x')(line))]], rows: ['! 5x + 6 ✓'] },
], 'Show it'), expressionSlips([['5x + 2', '3 times 2 is 6: 3(x + 2) is 3x + 6.'], ['3x + 6', 'Add the 2x on the end too.'], ['6x + 6', '3x + 2x is 5x.']]))
practice(identity, `Show that ${nb('4(x − 1) − 2(x − 5) ≡ 2x + 6')}. Expand and simplify the left side.`, 'A13.2 Q3', expression('2x + 6'), 'Expand both brackets. Careful: −2 × −5 is +10.', boardModel(['4(x−1) −2(x−5) ≡ 2x +6'], [
  { title: 'Expand both brackets', say: 'The boxed numbers multiply everything in their brackets. −2 × −5 is +10.', marks: [[0, line => line.replace('4(x−1)', '[4](x−1)').replace('−2(x−5)', '[−2](x−5)')]], rows: ['4(x−1) −2(x−5) = 4x −4 −2x +10'] },
  { title: 'Collect like terms', say: '4x − 2x is 2x, and −4 + 10 is 6. What is left is the right side.', rows: ['! 2x + 6 ✓'] },
], 'Show it'), expressionSlips([['2x − 14', '−2 × −5 is +10, not −10.'], ['6x + 6', 'It’s 4x − 2x: take the 2x away.'], ['2x − 6', '−2 × −5 is +10: −4 + 10 = 6.']]))
practice(identity, `Show that ${nb('(n + 4)(n − 2) ≡ n² + 2n − 8')}. Expand and simplify the left side.`, 'A13.2 Q4a', expression('n² + 2n − 8'), 'Every term times every term: n × n, n × −2, 4 × n and 4 × −2.', boardModel(['(n+4)(n−2) ≡ n² +2n −8'], [
  { title: 'Expand the brackets', say: 'Four products: n × n, n × −2, 4 × n and 4 × −2.', marks: [[0, box('(n+4)(n−2)')]], rows: ['(n+4)(n−2) = n² −2n +4n −8'] },
  { title: 'Collect the n terms', say: '−2n + 4n is 2n. What is left is the right side.', marks: [[-1, line => box('+4n')(box('−2n')(line))]], rows: ['! n² + 2n − 8 ✓'] },
], 'Show it'), expressionSlips([['n² − 8', 'Don’t forget the middle terms: −2n + 4n = 2n.'], ['n² + 2n + 8', '4 × −2 is −8.'], ['n² − 2n − 8', '−2n + 4n is +2n.']]))
practice(identity, `What is the difference between ${nb('=')} and ${nb('≡')}?`, 'A13.2 Q4b', choose(
  '≡ means the two sides are equal for every value of the letter',
  ['They mean the same thing', '= can be true for one value only. ≡ is true for every value.'],
  ['≡ means the two sides are nearly equal', '≡ is exactly equal, for every value of the letter.'],
  ['= means the two sides are equal for every value', 'That’s ≡. = in an equation is true for some values only.'],
), 'Is it true for some values, or for all of them?', boardModel([], [
  { title: 'An equation: =', say: 'x + 3 = 5 is only true when x is 2.', rows: ['>0 x + 3 = 5: only x = 2'] },
  { title: 'An identity: ≡', say: '2(x + 1) and 2x + 2 are equal whatever x is.', rows: ['>0 2(x + 1) ≡ 2x + 2: every x'] },
  { title: 'The difference', say: '≡ is true for every value of the letter.', rows: ['! ≡ : every value'] },
], 'Explain'))
practice(identity, `Show that ${nb('(x + 2)² − (x − 2)² ≡ 8x')}. Expand and simplify the left side.`, 'A13.2 Q5a', expression('8x'), 'Expand each square separately, then take the second away. The minus changes every sign in the second bracket.', boardModel(['(x+2)² −(x−2)² ≡ 8x'], [
  { title: 'Expand each square', say: '(x + 2)² is x² + 4x + 4 and (x − 2)² is x² − 4x + 4. Keep each in its bracket.', marks: [[0, line => box('−(x−2)²')(box('(x+2)²')(line))]], rows: ['(x+2)² −(x−2)² = (x² +4x +4) −(x² −4x +4)'] },
  { title: 'Take away the second bracket', say: 'The minus in front changes every sign inside the second bracket.', rows: ['= x² +4x +4 −x² +4x −4'] },
  { title: 'Collect like terms', say: 'x² − x² and 4 − 4 cancel. 4x + 4x is 8x: the right side.', rows: ['= ~x² +4x ~+4 ~−x² +4x ~−4', '! 8x ✓'] },
], 'Show it'), expressionSlips([['8', 'Take the whole second bracket away: −(−4x) is +4x, and the 4s cancel.'], ['0', 'The minus changes every sign in the second bracket: −(−4x) is +4x.'], ['2x² + 8', 'Take the second bracket away, don’t add it.']]))
practice(identity, `Use ${nb('(x + 2)² − (x − 2)² ≡ 8x')} to work out ${nb('52² − 48²')} without a calculator.`, 'A13.2 Q5b', number(400, '400'), '52 is 50 + 2 and 48 is 50 − 2. What is x?', boardModel(['(x+2)² −(x−2)² ≡ 8x'], [
  { title: 'Find x', say: '52 is 50 + 2 and 48 is 50 − 2, so x is 50.', rows: ['>0 x = 50'] },
  { title: 'Use 8x', say: 'The left side is 52² − 48², so it equals 8 × 50.', rows: ['52² −48² = 8×50', '! 400'] },
], 'Work it out'), slips(400, [[16, '52² − 48² isn’t (52 − 48)². Use 8x with x = 50.'], [4, 'That’s 52 − 48. Use 8x with x = 50.'], [416, 'x is 50, the number in the middle: 8 × 50.']]))
practice(identity, `Ella says ${nb('(x + 5)² ≡ x² + 25')}. Why is Ella wrong?`, 'A13.2 Q5c', choose(
  'The 10x term is missing: (x + 5)² ≡ x² + 10x + 25',
  ['She is right: square each part', '(x + 5)² is (x + 5)(x + 5): there are four products, not two.'],
  ['It should be x² + 5x + 25', 'Two lots of 5x: x × 5 and 5 × x make 10x.'],
  ['It should be x² + 10', '5 × 5 is 25, and there is a 10x term too.'],
), 'Write (x + 5)² as two brackets and expand. Or try x = 1.', boardModel(['(x+5)² ≡ x² +25'], [
  { title: 'Write it as two brackets', say: '(x + 5)² means (x + 5) times (x + 5).', marks: [[0, box('(x+5)²')]], rows: ['(x+5)² = (x+5)(x+5)'] },
  { title: 'Expand the brackets', say: 'Every term times every term: x × x, x × 5, 5 × x and 5 × 5.', rows: ['= x² +5x +5x +25'] },
  { title: 'Collect the x terms', say: '5x + 5x is 10x, and Ella left it out. With x = 1: 36, but 1 + 25 is 26.', rows: ['= x² +10x +25', '! The 10x is missing'] },
], 'Show it'))

/* ---------- Rung 3: geometric proof (A13.3), the triangle above the board ---------- */

const triangle = (a: number, b: number, labels: string[], extra: Partial<AngleFrame> = {}): AngleFrame => ({ shape: 'triangle', angles: [a, b], labels, ...extra })
const proofPicture = triangle(62, 48, ['a', 'b', 'c'])
const sum = worked(geometric, 'A triangle has angles a, b and c. Prove that a + b + c = 180°.', 'Prove a + b + c = 180°', 'A13.3 video + Q1', boardModel([], [
  { title: 'Draw a parallel line', say: '“Prove” means for every triangle, so use letters, not numbers. Draw a line through the top, parallel to the base.', rows: [], picture: { ...proofPicture, parallel: true } },
  { title: 'The Z on the left', say: 'Follow the purple Z: the two angles inside a Z are equal (alternate angles). So the new angle on the left is a.', rows: ['>0 left angle = a (alternate)'], picture: { ...proofPicture, parallel: true, copies: ['a', null], zig: 'left' } },
  { title: 'The Z on the right', say: 'The Z the other way round: the new angle on the right is b (alternate angles).', rows: ['>0 right angle = b (alternate)'], picture: { ...proofPicture, parallel: true, copies: ['a', 'b'], zig: 'right' } },
  { title: 'Angles on a straight line', say: 'a, c and b sit side by side on the straight parallel line, and angles on a straight line add to 180°. No numbers were used, so it’s true for every triangle.', rows: ['a +c +b = 180°', '! a + b + c = 180° ✓'], picture: { ...proofPicture, parallel: true, copies: ['a', 'b'] } },
], 'Prove it', proofPicture), 'Draw a line through the top, parallel to the base. Alternate angles copy a and b to the top, and angles on a straight line add to 180°.')
video(sum, media('geometric', 'Prove a + b + c = 180°', 'A13.3_Proof_Geometric.mp4', 100, [
  'Angles in a triangle: prove that the three angles always add up to 180°. a + b + c = 180°.',
  '“Prove” means show it is true for any triangle, not just one. So we use letters a, b and c instead of numbers, and two facts we already know.',
  'Add a parallel line: draw a line through the top, parallel to the base. This makes two new angles at the top. They are copies of a and b.',
  'Fact 1, the Z on the left: the base and the new line are parallel. Follow the purple Z: the two angles inside the Z are equal (alternate angles). So the new angle on the left is a.',
  'Fact 1, the Z on the right: now the Z the other way round. The two angles inside this Z are equal too, so the new angle on the right is b.',
  'Fact 2, straight line: angles on a straight line add to 180°. a, c and b all sit on the straight parallel line, so a + c + b = 180°, which is a + b + c = 180°.',
  'No numbers were used, so it is true for every triangle. Draw a parallel line, alternate angles are equal, angles on a line make 180°.',
]))
degrees(practice(geometric, 'Two angles on a straight line are 2x and 3x. Find x.', 'A13.3 Q2', number(36, '36°'), 'Angles on a straight line add to 180°.', boardModel([], [
  { title: 'Angles on a straight line', say: 'The two angles sit on a straight line, so they add to 180°.', rows: ['2x +3x = 180'] },
  { title: 'Collect the x terms', say: '2x and 3x are like terms.', marks: [[-1, line => box('+3x')(box('2x')(line))]], rows: ['5x = 180'] },
  { title: 'Divide both sides by 5', say: 'The boxed 5 multiplies x. Divide both sides by it.', marks: [[-1, box('5x', '[5]x')]], rows: ['5x ÷5^ = 180 ÷5^', '! x = 36°'] },
], 'Work it out', { shape: 'line', angles: [72], labels: ['2x', '3x'], families: [0, 0] }), slips(36, [[180, 'Divide 180 by 5: 5x = 180.'], [72, 'That’s 2x. x is half of it.'], [108, 'That’s 3x. Find x: 180 ÷ 5.'], [72 / 2 * 5, 'Collect the x terms first: 2x + 3x = 5x.']])))
degrees(practice(geometric, 'A triangle has angles 50°, x and 2x + 10°. Find x.', 'A13.3 Q3', number(40, '40°'), 'Angles in a triangle add to 180°.', boardModel([], [
  { title: 'Angles in a triangle', say: 'The three angles of a triangle add to 180°.', rows: ['50 +x +2x +10 = 180'] },
  { title: 'Collect like terms', say: 'x + 2x is 3x, and 50 + 10 is 60.', rows: ['3x +60 = 180'] },
  { title: 'Subtract 60 from both sides', say: 'The boxed +60 is with 3x. Take 60 from both sides, so it cancels.', marks: [[-1, box('+60')]], rows: ['3x ~+60 ~−60^ = 180 −60^', '3x = 120'] },
  { title: 'Divide both sides by 3', say: 'The boxed 3 multiplies x. Divide both sides by it.', marks: [[-1, box('3x', '[3]x')]], rows: ['3x ÷3^ = 120 ÷3^', '! x = 40°'] },
], 'Work it out', triangle(50, 40, ['50°', 'x', '2x + 10'], { families: [1, 0, 0] })), slips(40, [[120, 'That’s 3x. Divide by 3.'], [130 / 3, 'Take 50 and 10 from 180: 3x = 120.'], [90, 'That’s 2x + 10. Find x.'], [60, 'Collect like terms: x + 2x is 3x.']])))
degrees(practice(geometric, 'An isosceles triangle has two equal angles, y each, and a third angle of 40°. Find y.', 'A13.3 Q4a', number(70, '70°'), 'The two base angles are equal. Angles in a triangle add to 180°.', boardModel([], [
  { title: 'Angles in a triangle', say: 'The base angles of an isosceles triangle are equal, both y, so y + y is 2y. The three angles add to 180°.', rows: ['2y +40 = 180'] },
  { title: 'Subtract 40 from both sides', say: 'The boxed +40 is with 2y. Take 40 from both sides.', marks: [[-1, box('+40')]], rows: ['2y ~+40 ~−40^ = 180 −40^', '2y = 140'] },
  { title: 'Divide both sides by 2', say: 'The boxed 2 multiplies y. Divide both sides by it.', marks: [[-1, box('2y', '[2]y')]], rows: ['2y ÷2^ = 140 ÷2^', '! y = 70°'] },
], 'Work it out', triangle(70, 70, ['y', 'y', '40°'], { equal: true, families: [0, 0, 1] })), slips(70, [[140, 'That’s both angles. Divide by 2.'], [110, 'Take 40 from 180, then share the 140 between the two equal angles.'], [40, 'The third angle is 40°. The two equal ones are y.']])))
practice(geometric, 'Why can’t a triangle have two right angles?', 'A13.3 Q4b', choose(
  'Two right angles already make 180°, leaving 0° for the third angle',
  ['Right angles only go in squares', 'A triangle can have one right angle. The problem is two.'],
  ['The third angle would be 90° too', 'The angles add to 180°: two 90s leave nothing.'],
  ['The sides would be too long', 'It’s the angles: 90 + 90 is already 180.'],
), 'Angles in a triangle add to 180°. What would be left?', boardModel([], [
  { title: 'Add the two right angles', say: 'Two right angles are 90° each.', rows: ['90 +90 = 180'] },
  { title: 'What is left', say: 'Angles in a triangle add to 180°, so the third angle would be 0°: no triangle.', rows: ['! Third angle: 0°'] },
], 'Explain'))
{
  const exterior: AngleFrame = { shape: 'exterior', angles: [58, 60], labels: ['a', 'c', 'b', 'e'], families: [1, 2, 0, 3] }
  const state = practice(geometric, 'A triangle has angles a, b and c. The base carries on past c, making an outside angle e next to c. Use the angle facts to write e in terms of a and b.', 'A13.3 Q5a', expression('a + b'), 'a + b + c = 180 (a triangle) and c + e = 180 (a straight line).', boardModel([], [
    { title: 'Angles in a triangle', say: 'The three angles inside add to 180°.', rows: ['① a +b +c = 180'] },
    { title: 'Angles on a straight line', say: 'c and e sit on the straight line, so they add to 180° too.', rows: ['② c +e = 180'] },
    { title: 'Both make 180', say: 'Both left sides equal 180, so they equal each other.', rows: ['a +b +c = c +e'] },
    { title: 'Subtract c from both sides', say: 'The boxed c is on both sides. Take it away, and e is left on its own.', marks: [[-1, line => line.replace('+c =', '+[c] =').replace('= c', '= [c]')]], rows: ['a +b ~+c ~−c^ = ~c ~−c^ +e', '! e = a + b'] },
  ], 'Prove it', exterior), expressionSlips([['180 − c', 'That’s true, but write it with a and b: a + b + c = 180 too.'], ['a + b + c', 'Take c away: c + e = 180 and a + b + c = 180.'], ['180 − a − b', 'That’s c. e is next to c on the straight line.']]))
  state.answerPrefix = 'e ='
}
degrees(practice(geometric, 'A triangle has angles 35° and 65°. Work out the outside angle at the third corner.', 'A13.3 Q5b', number(100, '100°'), 'The outside angle is the sum of the two opposite inside angles.', boardModel([], [
  { title: 'Add the opposite angles', say: 'The outside angle is a + b: the two inside angles opposite it.', rows: ['e = 35 +65', '! e = 100°'] },
], 'Work it out', { shape: 'exterior', angles: [65, 35], labels: ['65°', 'c', '35°', 'e'], families: [1, 2, 1, 3] }), slips(100, [[80, 'That’s the inside angle at the third corner. The outside angle is next to it: 180 − 80.'], [30, 'Add the two angles: 35 + 65.']])))
practice(geometric, 'Noah says the angles in any quadrilateral add to 180° because it is made of triangles. What is right?', 'A13.3 Q5c', choose(
  'A quadrilateral splits into two triangles, so its angles add to 360°',
  ['Noah is right: 180°', 'A quadrilateral is two triangles, not one: 2 × 180.'],
  ['It splits into four triangles: 720°', 'One diagonal cuts it into two triangles.'],
  ['It splits into three triangles: 540°', 'That’s a pentagon. A quadrilateral makes two.'],
), 'How many triangles does one diagonal make?', boardModel([], [
  { title: 'Cut it into triangles', say: 'One diagonal cuts a quadrilateral into two triangles.', rows: [], picture: { shape: 'quad', angles: [], labels: [], split: true } },
  { title: 'Add the two triangles', say: 'Each triangle’s angles add to 180°, and together they make the quadrilateral’s angles.', rows: ['2 ×180 = 360', '! 360°'] },
], 'Explain', { shape: 'quad', angles: [], labels: [] }))

/* ---------- Rung 4: algebraic proof (A13.4) ---------- */

const consecutive = worked(algebraic, 'Prove that the sum of any two consecutive whole numbers is always odd.', 'Two numbers in a row: always odd?', 'A13.4 video + Q1', boardModel([], [
  { title: 'Name the numbers', say: 'We can’t test every pair, so use a letter. The first is n; the next is one more.', rows: ['> n and n + 1'] },
  { title: 'Add them', say: 'n + n is two lots of n, 2n.', rows: ['n +(n+1) = 2n +1'] },
  { title: 'Why 2n + 1 is odd', say: '2n is 2 × n, in the 2 times table, so it’s even. One more than an even number is odd.', rows: ['! 2n + 1 is odd ✓'] },
], 'Prove it'), 'Even numbers are 2n, odd numbers are 2n + 1. Write the numbers with letters, simplify, then say why the answer is even or odd.')
video(consecutive, media('algebraic', 'Two numbers in a row: n + (n + 1)', 'A13.4_Proof_Algebraic_Proof.mp4', 96, [
  'Two numbers in a row: prove that if you add any two consecutive whole numbers, the answer is always odd. n + (n + 1).',
  'Even and odd in algebra: even numbers 2, 4, 6, 8… are all 2 × something, so any even number is written 2n. Odd numbers are one more than even: 2n + 1.',
  'See the two numbers as blocks: the first is n blocks, the next is n + 1 blocks. Together: n + n + 1.',
  'Write the two numbers: we cannot test every pair, so use a letter. First number n, next number n + 1. If n = 7, the next is 8, but n can be anything.',
  'Add them together: n + n + 1. n + n is two lots of n, 2n, so it is 2n + 1.',
  'Why is 2n + 1 odd? 2n is 2 × n, in the 2 times table, so it is even. Even + 1 is always odd (like 8 + 1 = 9). So 2n + 1 is odd for every n.',
  'Check: n = 4 gives 4 + 5 = 9, odd. n = 10 gives 10 + 11 = 21, odd. Always 2n + 1.',
]))
practice(algebraic, 'n is a whole number. Which expression is always even?', 'A13.4 Q2', choose(
  '2n',
  ['n + 2', 'With n = 3 it’s 5, which is odd.'],
  ['2n + 1', 'That’s one more than an even number: always odd.'],
  ['n²', 'With n = 3 it’s 9, which is odd.'],
), 'Even numbers are in the 2 times table.', boardModel([], [
  { title: 'Even means × 2', say: 'Every even number is 2 times a whole number: 2, 4, 6, 8…', rows: ['>0 2 × 1, 2 × 2, 2 × 3, 2 × 4'] },
  { title: 'With a letter', say: '2 times any whole number n is in the 2 times table.', rows: ['! 2n is always even'] },
], 'Explain'))
practice(algebraic, 'Two even numbers are 2n and 2m. Prove their sum is even: write 2n + 2m with 2 outside a bracket.', 'A13.4 Q3', { type: 'numericInput', responseShape: 'expression', acceptanceRule: 'factorisedExpression', correctAnswer: '2(n + m)', displayAnswer: '2(n + m)' }, 'Use two different letters, 2n and 2m, then take out the 2.', boardModel([], [
  { title: 'Add them', say: 'Use two different letters, so the two even numbers can be different.', rows: ['> 2n + 2m'] },
  { title: 'Take out the 2', say: 'Both terms have a 2: take it outside a bracket.', rows: ['2n +2m = 2(n+m)'] },
  { title: 'Why it’s even', say: '2 times a whole number is in the 2 times table.', rows: ['! 2(n + m) is even ✓'] },
], 'Prove it'), response => sameCollectedExpression(response, '2n + 2m') ? 'That’s the sum. Take the 2 outside a bracket: 2(…).' : sameFactorised(response, '2(n + 2m)') || sameFactorised(response, '2(2n + m)') ? 'Divide each term by 2: 2n ÷ 2 is n and 2m ÷ 2 is m.' : null)
practice(algebraic, `Prove that the sum of three consecutive whole numbers is a multiple of 3. First, simplify ${nb('n + (n + 1) + (n + 2)')}.`, 'A13.4 Q4a', expression('3n + 3'), 'Collect the n terms and the numbers.', boardModel([], [
  { title: 'Add them', say: 'Call them n, n + 1 and n + 2. Collect the n terms and the numbers.', rows: ['n +(n+1) +(n+2) = 3n +3'] },
  { title: 'Take out the 3', say: 'Both terms have a 3. 3 times a whole number is a multiple of 3.', rows: ['= 3(n+1)', '! A multiple of 3 ✓'] },
], 'Prove it'), expressionSlips([['3n', 'Add the numbers too: 1 + 2 = 3.'], ['3n + 2', 'There are two numbers to add: 1 and 2.'], ['n + 3', 'Three lots of n: n + n + n = 3n.']]))
practice(algebraic, 'Check the proof with 7, 8 and 9: work out 7 + 8 + 9.', 'A13.4 Q4b', number(24, '24'), 'Add them, then check it’s in the 3 times table.', boardModel([], [
  { title: 'Add them', say: 'n is 7, so 3n + 3 is 21 + 3 too.', rows: ['7 +8 +9 = 24'] },
  { title: 'Is it a multiple of 3?', say: '24 is in the 3 times table.', rows: ['! 24 = 3 × 8 ✓'] },
], 'Check'), slips(24, [[23, '7 + 8 = 15, and 15 + 9 = 24.'], [25, '7 + 8 = 15, and 15 + 9 = 24.']]))
practice(algebraic, `Two odd numbers are 2n + 1 and 2m + 1. Their product is ${nb('2(2nm + n + m) + 1')}. Why does that prove the product is odd?`, 'A13.4 Q5a', choose(
  'It is 2 × a whole number, plus 1: one more than an even number',
  ['It has a 2 in it', '2(…) on its own is even. It’s the + 1 that makes it odd.'],
  ['n and m are odd', 'n and m can be any whole numbers. It’s the 2(…) + 1 that matters.'],
  ['It has a bracket', 'Brackets don’t make a number odd. 2 × something + 1 does.'],
), 'Odd numbers are 2 × something + 1.', boardModel([], [
  { title: 'Multiply them out', say: 'Every term times every term.', rows: ['(2n+1)(2m+1) = 4nm +2n +2m +1'] },
  { title: 'Take out 2 from the even part', say: '4nm, 2n and 2m all have a 2. The + 1 is left over.', rows: ['= 2(2nm +n +m) +1', '! Even + 1: odd ✓'] },
], 'Prove it'))
practice(algebraic, `Prove that the difference between two consecutive square numbers is always odd. Simplify ${nb('(n + 1)² − n²')}.`, 'A13.4 Q5b', expression('2n + 1'), 'Write (n + 1)² as (n + 1)(n + 1) and expand.', boardModel([], [
  { title: 'Write the square as two brackets', say: 'The next square number after n² is (n + 1)². (n + 1)² means (n + 1) times (n + 1).', rows: ['(n+1)² −n² = (n+1)(n+1) −n²'] },
  { title: 'Expand the bracket', say: '(n + 1)(n + 1) is n² + n + n + 1, which is n² + 2n + 1.', rows: ['= n² +2n +1 −n²'] },
  { title: 'Cancel the n² terms', say: '+n² and −n² add to nothing. 2n + 1 is one more than an even number: odd.', marks: [[-1, line => box('−n²')(box('n²')(line))]], rows: ['= ~n² +2n +1 ~−n²', '! 2n + 1 is odd ✓'] },
], 'Prove it'), expressionSlips([['1', '(n + 1)² isn’t n² + 1: there are two n terms in the middle.'], ['2n²+2n+1', 'Take the n² away, don’t add it.'], ['n + 1', 'n + n is 2n: (n + 1)(n + 1) is n² + 2n + 1.']]))
practice(algebraic, 'Ravi says the sum of two odd numbers is odd, because “odd plus odd stays odd”. What is right?', 'A13.4 Q5c', choose(
  'Ravi is wrong: (2n + 1) + (2m + 1) = 2(n + m + 1), which is even',
  ['Ravi is right: 3 + 5 is odd', '3 + 5 = 8, which is even.'],
  ['It depends on the numbers', '(2n + 1) + (2m + 1) is always 2(n + m + 1): always even.'],
  ['Ravi is wrong: it’s always a multiple of 4', '3 + 3 = 6 isn’t a multiple of 4. It’s always even.'],
), 'Add 2n + 1 and 2m + 1.', boardModel([], [
  { title: 'Write two odd numbers', say: 'Use two different letters: 2n + 1 and 2m + 1.', rows: ['> 2n + 1 and 2m + 1'] },
  { title: 'Add them', say: 'Collect the numbers: 1 + 1 is 2.', rows: ['2n +1 +2m +1 = 2n +2m +2'] },
  { title: 'Take out the 2', say: 'Every term has a 2, so it’s 2 times a whole number: even.', rows: ['= 2(n+m+1)', '! Even, not odd'] },
], 'Prove it'))

add('mixed', 'Proof', 'A13.1-A13.4 consolidation', text(
  'To show a claim is wrong, one counterexample is enough: 2n + 1 with n = 4 gives 9 = 3 × 3, not prime.',
  '≡ means equal for every value. Work on one side only, expand and collect until it matches the other.',
  'Angle proofs use facts with reasons: alternate angles are equal, angles on a straight line add to 180°.',
  'Even numbers are 2n, odd numbers are 2n + 1. Simplify, then show it is 2(…) for even or 2(…) + 1 for odd.',
))

export const tutorProofLesson: TutorMethodLesson = {
  id: 'L028', number: 28, title: 'Proof', level: 'GCSE Foundation',
  goal: 'Disprove a statement with a counterexample, show two expressions are identical, prove angle facts with reasons, and prove facts about odd and even numbers with algebra.',
  labels: { [counterexample]: 'Counterexamples', [identity]: 'Identities', [geometric]: 'Angle proofs', [algebraic]: 'Odd and even', mixed: 'Review' },
  states: finish(),
}

