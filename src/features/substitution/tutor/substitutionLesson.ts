import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { boardModel, choose, nb, number, text, type BoardMove } from '../../simultaneous-equations/tutor/boardWorkings'

/*
 * Lesson 36 (Algebra): Substitution. Not in Aniksha's book, so written for Revily with our own numbers in the book's
 * style (Sunny, 11 Oct): AQA 8300 A2 (substitute into expressions and formulae) comes up in every sitting, and no
 * other lesson taught it. Three rungs: whole numbers into expressions, negative numbers and powers, and formulae,
 * including science formulae. Each working writes the letters, then the numbers in brackets, then BIDMAS, on the board.
 */

const { add, finish } = author(36)
const expressions = 'substitution-expressions'
const negatives = 'substitution-negatives'
const formulae = 'substitution-formulae'

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
const board = (given: string[], moves: BoardMove[], label = 'Work it out') => boardModel(given, moves, label)
/** A question: its words above the answer, and the board working once answered. */
function practice(topic: MicroSkillId, title: string, interaction: InteractionDefinition, hint: string, model: TutorWorking, list: Slip[] = []) {
  const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  const state = add(topic, title, 'Revily (own numbers)', text(title), interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  const right = Number(interaction.correctAnswer)
  if (list.length && interaction.type === 'numericInput') state.diagnose = (response: string) => diagnoseSlips(response, right, list)
  return state
}
function worked(topic: MicroSkillId, title: string, heading: string, model: TutorWorking, body: string) {
  const state = add(topic, title, 'Revily (own numbers)', model, undefined, undefined, undefined, body)
  state.content.heading = heading
  return state
}

/* ---------- Rung 1: whole numbers into expressions ---------- */

worked(expressions, `Work out the value of ${nb('3a + 2b')} when a = 4 and b = 5.`, '3a + 2b when a = 4, b = 5', board(['E = 3a + 2b'], [
  { title: 'Swap each letter for its number', say: '3a means 3 × a, and 2b means 2 × b. Put each number in brackets where its letter was.', rows: ['E = 3 × (4) + 2 × (5)'] },
  { title: 'BIDMAS: multiply first', say: 'Multiplying comes before adding: 3 × 4 = 12 and 2 × 5 = 10.', rows: ['= 12 + 10'] },
  { title: 'Then add', say: 'Add the two parts to finish.', rows: ['= 22', '! 3a + 2b = 22'] },
]), 'Our aim: swap each letter for its number, in brackets, then work it out with BIDMAS. A number next to a letter means multiply: 3a is 3 × a.')
practice(expressions, `Work out ${nb('5x − 7')} when x = 6.`, number(23, '23'), '5x means 5 × x.', board(['E = 5x − 7'], [
  { title: 'Swap x for 6', say: '5x means 5 × x.', rows: ['E = 5 × (6) − 7'] },
  { title: 'Multiply, then subtract', say: '5 × 6 = 30, then take away 7.', rows: ['= 30 − 7', '= 23', '! 23'] },
]), [[49, '5x is 5 × 6 = 30, not 56. Then 30 − 7 = 23.'], [-2, 'BIDMAS: multiply first. 5 × 6 = 30, then 30 − 7 = 23.']])
practice(expressions, `Work out ${nb('pq + 4')} when p = 3 and q = 7.`, number(25, '25'), 'pq means p × q.', board(['E = pq + 4'], [
  { title: 'Swap the letters', say: 'pq means p × q.', rows: ['E = (3) × (7) + 4'] },
  { title: 'Multiply, then add', say: '3 × 7 = 21, then add 4.', rows: ['= 21 + 4', '= 25', '! 25'] },
]), [[14, 'pq means p × q, not p + q: 3 × 7 = 21, then 21 + 4 = 25.'], [21, 'Don’t forget the + 4: 21 + 4 = 25.']])
practice(expressions, `Work out ${nb('4(m + 3)')} when m = 5.`, number(32, '32'), 'Brackets first.', board(['E = 4(m + 3)'], [
  { title: 'Swap m for 5', say: 'Put 5 in place of m, inside the bracket.', rows: ['E = 4 × ((5) + 3)'] },
  { title: 'Brackets first', say: '5 + 3 = 8, then multiply by 4.', rows: ['= 4 × 8', '= 32', '! 32'] },
]), [[23, 'Brackets first: 5 + 3 = 8, then 4 × 8 = 32.'], [8, 'That’s the bracket. Now multiply it by 4: 32.']])
practice(expressions, `Work out ${nb('(a + b) ÷ 2')} when a = 9 and b = 13.`, number(11, '11'), 'Add first, because of the bracket, then halve.', board(['E = (a + b) ÷ 2'], [
  { title: 'Swap the letters', say: 'Put each number where its letter was.', rows: ['E = ((9) + (13)) ÷ 2'] },
  { title: 'Brackets, then divide', say: '9 + 13 = 22, and 22 ÷ 2 = 11.', rows: ['= 22 ÷ 2', '= 11', '! 11'] },
]), [[22, 'That’s the bracket. Now divide by 2: 11.'], [15.5, 'The bracket comes first: add, then divide. (9 + 13) ÷ 2 = 11.']])

/* ---------- Rung 2: negative numbers and powers ---------- */

worked(negatives, `Work out ${nb('2x²')} when x = −3.`, '2x² when x = −3', board(['E = 2x²'], [
  { title: 'Swap x for −3, in brackets', say: 'The brackets keep the minus sign with the number. Only x is squared, not the 2.', rows: ['E = 2 × (−3)²'] },
  { title: 'Indices before multiplying', say: 'BIDMAS: square first. (−3)² = −3 × −3 = 9: two negatives make a positive.', rows: ['= 2 × 9'] },
  { title: 'Then multiply', say: '2 × 9 = 18.', rows: ['= 18', '! 2x² = 18'] },
]), 'Our aim: a negative number always goes in brackets. Square before you multiply, and remember a negative squared is positive.')
practice(negatives, `Work out ${nb('4 − 3y')} when y = −2.`, number(10, '10'), '3y is 3 × (−2). Then take that away from 4.', board(['E = 4 − 3y'], [
  { title: 'Swap y for −2', say: '3y means 3 × y. Keep −2 in brackets.', rows: ['E = 4 − 3 × (−2)'] },
  { title: 'Multiply first', say: '3 × −2 = −6, so the sum is 4 − (−6).', rows: ['= 4 − (−6)'] },
  { title: 'Two signs together', say: '− and − are the same, so they make +.', rows: ['= 4 + 6', '= 10', '! 10'] },
]), [[-2, '3 × (−2) = −6, and 4 − (−6) = 4 + 6 = 10.'], [2, 'BIDMAS: multiply first. 3 × (−2) = −6, then 4 − (−6) = 10.'], [-10, '4 − (−6) is 4 + 6 = 10.']])
practice(negatives, `Work out ${nb('x² + 5')} when x = −4.`, number(21, '21'), '(−4)² is positive.', board(['E = x² + 5'], [
  { title: 'Swap x for −4, in brackets', say: '(−4)² = −4 × −4 = 16.', rows: ['E = (−4)² + 5', '= 16 + 5'] },
  { title: 'Add', say: '16 + 5 = 21.', rows: ['= 21', '! 21'] },
]), [[-11, '(−4)² = −4 × −4 = 16, which is positive. 16 + 5 = 21.'], [-3, 'Squaring is −4 × −4 = 16, not −4 × 2.'], [13, 'Squaring is −4 × −4 = 16, not 4 × 2.']])
practice(negatives, `Work out ${nb('ab − c')} when a = −2, b = 6 and c = −5.`, number(-7, '−7'), 'ab = −2 × 6. Then take away −5.', board(['E = ab − c'], [
  { title: 'Swap the letters', say: 'Every negative goes in brackets.', rows: ['E = (−2) × (6) − (−5)'] },
  { title: 'Multiply first', say: '−2 × 6 = −12: different signs give a negative.', rows: ['= −12 − (−5)'] },
  { title: 'Two signs together', say: '− and − make +, so −12 + 5.', rows: ['= −12 + 5', '= −7', '! −7'] },
]), [[-17, 'Taking away −5 means adding 5: −12 + 5 = −7.'], [7, '−2 × 6 = −12, then −12 + 5 = −7.'], [17, '−2 × 6 = −12, then −12 + 5 = −7.']])
practice(negatives, `Sam says that when t = −3, the value of ${nb('t²')} is −9. Is Sam right?`, choose(
  'No: (−3)² = 9',
  ['Yes: (−3)² = −9', '(−3)² means −3 × −3. Two negatives make a positive: 9.'],
  ['No: (−3)² = −6', 'Squaring is −3 × −3, not −3 × 2.'],
  ['No: (−3)² = 6', 'Squaring is −3 × −3, not 3 × 2.'],
), 'Write t² as t × t.', board(['E = t²'], [
  { title: 'Swap t for −3, in brackets', say: 't² means t × t, so (−3)² is −3 × −3. Two negatives make a positive.', rows: ['E = (−3)²', '= −3 × −3', '= 9', '! Sam is wrong: it is 9'] },
], 'Why'))

/* ---------- Rung 3: formulae ---------- */

worked(formulae, `Use the formula ${nb('v = u + at')} to work out v when u = 5, a = 3 and t = 4.`, 'v = u + at', board(['v = u + at'], [
  { title: 'Swap each letter for its number', say: 'at means a × t. Put each number in brackets where its letter was.', rows: ['v = (5) + (3) × (4)'] },
  { title: 'Multiply first', say: 'BIDMAS: 3 × 4 = 12 before adding.', rows: ['v = 5 + 12'] },
  { title: 'Then add', say: '5 + 12 = 17.', rows: ['v = 17', '! v = 17'] },
]), 'Our aim: a formula works just like an expression. The letter on its own on the left is what you are working out.')
practice(formulae, `The perimeter of a rectangle is ${nb('P = 2l + 2w')}. Work out P when l = 8 cm and w = 3.5 cm.`, number(23, '23 cm'), '2l means 2 × l.', board(['P = 2l + 2w'], [
  { title: 'Swap the letters', say: '2l is 2 × 8 and 2w is 2 × 3.5.', rows: ['P = 2 × (8) + 2 × (3.5)', 'P = 16 + 7'] },
  { title: 'Add', say: '16 + 7 = 23.', rows: ['P = 23', '! P = 23 cm'] },
]), [[11.5, 'That’s one length and one width. A rectangle has two of each: 2 × 8 + 2 × 3.5 = 23.']])
practice(formulae, `A taxi charges C pounds for a journey of m miles, where ${nb('C = 3 + 2m')}. Work out C when m = 12.`, number(27, '£27'), 'Multiply 2 by 12 first.', board(['C = 3 + 2m'], [
  { title: 'Swap m for 12', say: '2m means 2 × 12.', rows: ['C = 3 + 2 × (12)', 'C = 3 + 24'] },
  { title: 'Add', say: '3 + 24 = 27.', rows: ['C = 27', '! £27'] },
]), [[60, 'BIDMAS: multiply first. 2 × 12 = 24, then 3 + 24 = 27.'], [17, '2m means 2 × 12 = 24, not 2 and 12 added. 3 + 24 = 27.']]).answerPrefix = '£'
practice(formulae, `Use ${nb('F = 1.8C + 32')} to change 25°C into °F.`, number(77, '77°F'), 'Multiply 1.8 by 25 first.', board(['F = 1.8C + 32'], [
  { title: 'Swap C for 25', say: '1.8C means 1.8 × 25.', rows: ['F = 1.8 × (25) + 32', 'F = 45 + 32'] },
  { title: 'Add', say: '45 + 32 = 77.', rows: ['F = 77', '! 77°F'] },
]), [[45, 'Don’t forget the + 32: 45 + 32 = 77.'], [102.6, 'BIDMAS: multiply first. 1.8 × 25 = 45, then add 32.']])
practice(formulae, `Use ${nb('s = ut + ½at²')} to work out s when u = 2, t = 3 and a = 4.`, number(24, '24'), 'Square t first, then multiply.', board(['s = ut + ½at²'], [
  { title: 'Swap the letters', say: 'ut is 2 × 3. ½at² is ½ × 4 × 3².', rows: ['s = (2) × (3) + ½ × (4) × (3)²'] },
  { title: 'Indices first', say: '3² = 9, so the second part is ½ × 4 × 9 = 18.', rows: ['s = 6 + ½ × 4 × 9', 's = 6 + 18'] },
  { title: 'Add', say: '6 + 18 = 24.', rows: ['s = 24', '! s = 24'] },
]), [[42, 'Only t is squared: ½ × 4 × 9 = 18, not (½ × 4 × 3)² = 36. 6 + 18 = 24.'], [12, 'Square t first: 3² = 9, so ½ × 4 × 9 = 18. 6 + 18 = 24.'], [18, 'Don’t forget ut = 2 × 3 = 6: 6 + 18 = 24.']])

add('mixed', 'Substitution', 'Revily consolidation', text(
  'Swap each letter for its number, in brackets, then work it out with BIDMAS.',
  'A number next to a letter means multiply: 3a is 3 × a, and pq is p × q.',
  'Negative numbers always go in brackets: (−3)² = −3 × −3 = 9.',
  'In 2x², only x is squared: square first, then multiply by 2.',
  'A formula works just like an expression: the letter on its own is what you are working out.',
))

export const tutorSubstitutionLesson: TutorMethodLesson = {
  id: 'L036', number: 36, title: 'Substitution', level: 'GCSE Foundation',
  goal: 'Put numbers into expressions and formulae, including negative numbers and powers, and work out the value with BIDMAS.',
  labels: { [expressions]: 'Into expressions', [negatives]: 'Negatives and powers', [formulae]: 'Formulae', mixed: 'Review' },
  states: finish(),
}
