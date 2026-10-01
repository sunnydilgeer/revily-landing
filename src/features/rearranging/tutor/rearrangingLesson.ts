import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { EquationRow, MethodStep, WorkingLine } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, fmt, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { diagnoseFormula, type FormulaSlip } from './rearrangingDiagnosis'

const { add, finish } = author(20)
const linear = 'rearrange-linear'
const fractions = 'rearrange-fractions'
const squares = 'rearrange-squares'
const roots = 'rearrange-roots'
const text = (...lines: string[]) => ({ kind: 'text' as const, lines })

/* ---------- The board: the formula split at its = sign (EquationPictures.tsx), as in Solving equations ---------- */

/** "C −5^ = 3m ~+5 ~−5^" → a row of the board; "! m = {C−5|3}" → the answer. Tokens are described in EquationPictures.tsx. */
const row = (line: string): EquationRow => {
  if (line.startsWith('! ')) return { answer: line.slice(2) }
  const at = line.indexOf(' = ')
  return { left: line.slice(0, at), right: line.slice(at + 3) }
}
/** A row as KaTeX, for the step chain: markers gone, fractions stacked, roots drawn over what they cover. */
function tex(line: EquationRow) {
  const plain = 'note' in line ? line.note : 'answer' in line ? line.answer : `${line.left} = ${line.right}`
  return plain.replace(/[~^[\]«»‹›]/g, '')
    .replace(/√\{([^|]*)\|([^}]*)\}/g, '\\sqrt{\\frac{$1}{$2}}').replace(/\{([^|]*)\|([^}]*)\}/g, '\\frac{$1}{$2}')
    .replace(/√\(([^)]*)\)/g, '\\sqrt{$1}').replace(/√([a-z])/gi, '\\sqrt{$1}')
    .replace(/²/g, '^{2}').replace(/−/g, '-').replace(/×/g, '\\times ').replace(/÷/g, '\\div ')
}

/**
 * One move: its heading, the ⓘ words, the row above with the part this move undoes boxed in purple, and the rows it
 * adds. The board keeps the row above plain once the move is done.
 */
type Move = { title: string; say: string; boxed: string; rows: string[] }

/**
 * The working for a rearrangement: the board, one move a step. The last move ends on the answer in its green box,
 * written with the new subject first, and the working stops there (no step repeating it: Sunny, 30 Sep).
 */
function board(formula: string, moves: Move[], answer: string, label = 'Rearrange'): TutorWorking {
  const lines = [formula]
  const steps: MethodStep[] = moves.map((move, i) => {
    if (move.boxed.replace(/[[\]]/g, '') !== lines.at(-1)) throw new Error(`"${move.title}" must box a part of ${lines.at(-1)}`)
    const shown = [...lines.slice(0, -1), move.boxed].map(row)
    const added = i === moves.length - 1 ? [...move.rows, `! ${answer}`] : move.rows
    lines.push(...added)
    const rows = [...shown, ...added.map(row)]
    return { title: move.title, operation: tex(rows[0]), equation: tex(rows.at(-1)!), instruction: move.say, frame: { equation: { rows } } }
  })
  return { kind: 'method-worked', examples: [{ method: 'ordering', expression: tex(row(formula)), label, first: 0, second: 0, steps, pictureOnly: true, focus: true }] }
}

/* The moves, each the same pattern: box what it undoes, do the opposite to both sides, cross out what cancels. */

const subtract = (n: string, boxed: string, rows: string[], letter: string): Move => ({ title: `Subtract ${n} from both sides`, say: `The boxed + ${n} is added to the ${letter} term. Take ${n} away from both sides, so it cancels.`, boxed, rows })
const addTo = (n: string, boxed: string, rows: string[], letter: string): Move => ({ title: `Add ${n} to both sides`, say: `The boxed − ${n} takes ${n} away from the ${letter} term. Add ${n} to both sides, so it cancels.`, boxed, rows })
const divide = (n: string, boxed: string, rows: string[], letter: string): Move => ({ title: `Divide both sides by ${n}`, say: `The boxed ${n} multiplies ${letter}. Divide both sides by ${n}: the whole of the other side goes over ${n}, and the ${n}s next to ${letter} cancel.`, boxed, rows })
const multiply = (n: string, boxed: string, rows: string[]): Move => ({ title: `Multiply both sides by ${n}`, say: `The boxed ${n} on the bottom divides. Multiply both sides by ${n}, so the fraction clears.`, boxed, rows })
const squareRoot = (boxed: string, rows: string[], letter: string): Move => ({ title: 'Square root both sides', say: `The boxed ² squares ${letter}. Undo it with a square root over the whole of each side.`, boxed, rows })
const square = (boxed: string, rows: string[]): Move => ({ title: 'Square both sides', say: 'The boxed √ is a square root. Undo it by squaring both sides: squaring a square root leaves what was under it.', boxed, rows })

/** Working for a "use your formula" question: one line a step, and the last step is the answer. */
function useModel(formula: string, lines: [string, string, string, string][], answer: [string, string, string]): TutorWorking {
  const question = tex(row(formula))
  const sums: WorkingLine[] = lines.map(([parts, total], i) => ({ parts, total, family: i }))
  const steps: MethodStep[] = lines.map(([parts, total, title, say], i) => ({ title, operation: question, equation: `${parts}=${total}`.replace(/−/g, '-').replace(/×/g, '\\times ').replace(/÷/g, '\\div ').replace(/²/g, '^{2}'), instruction: say, frame: { sums: sums.slice(0, i + 1) } }))
  steps.push({ title: answer[0], operation: question, equation: answer[2].replace(/−/g, '-').replace(/×/g, '\\times ').replace(/÷/g, '\\div ').replace(/√(\d+)/g, '\\sqrt{$1}'), instruction: answer[1], frame: { sums, ordering: { answer: answer[2] } } })
  return { kind: 'method-worked', examples: [{ method: 'ordering', expression: question, label: 'Use the formula', first: 0, second: 0, steps, pictureOnly: true }] }
}

/* ---------- Answers ---------- */

/** A formula typed after "m =": one box or a fraction, with a √ key. `answer` is read by sameFormula; `shown` is how it's written. */
const formula = (answer: string, shown: string): InteractionDefinition => ({ type: 'numericInput', responseShape: 'formula', acceptanceRule: 'formula', correctAnswer: answer, displayAnswer: shown })
const number = (answer: number, shown: string): InteractionDefinition => ({ type: 'numericInput', correctAnswer: answer, displayAnswer: shown, acceptanceRule: 'normalisedNumber' })
/** A choice whose right answer is written first; each wrong option says why it’s wrong. Options are shuffled when shown. */
const choose = (right: string, ...wrong: [string, string][]): InteractionDefinition => ({
  type: 'select', correctAnswer: '0',
  options: [{ id: '0', label: right }, ...wrong.map(([label, feedback], i) => ({ id: String(i + 1), label, feedback }))],
})

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
function practice(topic: MicroSkillId, title: string, sourceRef: string, interaction: InteractionDefinition, hint: string, model: TutorWorking, diagnose?: (response: string) => string | null, prefix?: string, unit?: string) {
  const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  const state = add(topic, title, sourceRef, text(title), interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  if (diagnose) state.diagnose = diagnose
  if (prefix) state.answerPrefix = prefix
  if (unit) state.answerLabel = `Your answer (${unit})`
  return state
}
function worked(topic: MicroSkillId, title: string, sourceRef: string, model: TutorWorking, body: string, subject: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  // The board shows the formula, so the heading is only the instruction (EXPLANATIONS.md rule 1).
  state.content.heading = `Make ${subject} the subject`
  return state
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }
const media = (name: string, title: string, sourceFile: string, textAlternative: string[]) => ({
  id: `lesson20-${name}`, src: `/media/lesson-20/${name}.mp4`, poster: `/media/lesson-20/${name}.svg`, title, durationSeconds: 53, sourceFile, textAlternative,
})
/** Keeps a formula on one line in a title, so a phone never breaks it. */
const nb = (expression: string) => expression.replace(/ /g, '\u00a0')

/** "Make m the subject": the formula typed after "m =", the board working, and a message for each usual slip. */
function rearrange(topic: MicroSkillId, sourceRef: string, title: string, subject: string, answer: string, shown: string, hint: string, model: TutorWorking, slips: FormulaSlip[]) {
  return practice(topic, title, sourceRef, formula(answer, `${subject} = ${shown}`), hint, model, response => diagnoseFormula(response, answer, subject, slips), `${subject} =`)
}
/** "Use your formula": a number after "g =", worked out line by line, with the usual slips. */
function useFormula(topic: MicroSkillId, sourceRef: string, title: string, subject: string, answer: number, unit: string, hint: string, model: TutorWorking, slips: Slip[]) {
  return practice(topic, title, sourceRef, number(answer, `${subject} = ${fmt(answer)} ${unit}`.trim()), hint, model, response => diagnoseSlips(response, answer, slips), `${subject} =`, unit)
}

/**
 * The usual slips on "other = a × subject ± b", made subject: the number moved with the wrong sign, only part of the
 * side divided, the divide missed, or a multiply instead. `other` and `b` as typed: "C", "5" (b is + 5; −8 is "−8").
 */
function linearSlips(other: string, a: number, b: number, letter: string): FormulaSlip[] {
  const top = `${other}${b > 0 ? '-' : '+'}${Math.abs(b)}`, wrongTop = `${other}${b > 0 ? '+' : '-'}${Math.abs(b)}`
  const move = b > 0 ? `The ${b} is added to ${a}${letter}, so take it away from both sides` : `The ${-b} is taken away from ${a}${letter}, so add it to both sides`
  return [
    [`(${wrongTop})/${a}`, `${move}: ${other} ${b > 0 ? '−' : '+'} ${Math.abs(b)} = ${a}${letter}.`],
    [`${other}/${a}${b > 0 ? '-' : '+'}${Math.abs(b)}`, `Undo the ${b > 0 ? '+' : '−'} ${Math.abs(b)} first. Then divide the whole of ${other} ${b > 0 ? '−' : '+'} ${Math.abs(b)} by ${a}, not just ${other}.`],
    [`${other}${b > 0 ? '-' : '+'}${Math.abs(b) / a}`, `Divide the whole of ${other} ${b > 0 ? '−' : '+'} ${Math.abs(b)} by ${a}: put all of it on top of the fraction, not just the ${Math.abs(b)}.`],
    [top, `That is ${a}${letter}. Divide both sides by ${a} to get ${letter} on its own.`],
    [`${a}(${top})`, `${a}${letter} means ${a} × ${letter}. Undo it by dividing both sides by ${a}, not multiplying.`],
  ]
}

/* ---------- Rung 1: simple linear formulae (A6.1) ---------- */

const linearVideo = worked(linear, `The cost, £C, of a taxi journey of m miles is ${nb('C = 3m + 5')}. Make m the subject.`, 'A6.1 video + Q1', board('C = 3m +5', [
  subtract('5', 'C = 3m [+5]', ['C −5^ = 3m ~+5 ~−5^', 'C −5 = 3m'], 'm'),
  divide('3', 'C −5 = [3]m', ['{C−5|3^} = {«3»m|~3^}'], 'm'),
], 'm = {C−5|3}'), 'Rearranging is solving with letters: do the opposite to both sides until m is on its own.', 'm')
video(linearVideo, media('linear', 'Making m the subject of C = 3m + 5', 'A6.1_Rearranging_Simple_Linear_Formulae.mp4', [
  'Rearranging is solving, with letters instead of numbers. Get m on its own.',
  'Subtract 5 from both sides: the + 5 and − 5 cancel, so C − 5 = 3m.',
  'Divide both sides by 3: the 3s cancel, so m = (C − 5)/3. All of C − 5 goes over the 3.',
  'Test it with numbers: when C = 20, m = 5, and 3 × 5 + 5 = 20.',
  'Where you see it: a taxi costs £5 plus £3 a mile, and the fare was £20. m = (20 − 5)/3 = 5 miles.',
]))
rearrange(linear, 'A6.1 Q2', `A bus fare, £y, is £9 more than the base price, £x: ${nb('y = x + 9')}. Make x the subject of the formula.`, 'x', 'y-9', 'y − 9', 'The 9 is added to x. Do the opposite to both sides.',
  board('y = x +9', [subtract('9', 'y = x [+9]', ['y −9^ = x ~+9 ~−9^'], 'x')], 'x = y − 9'),
  [['y+9', 'The 9 is added to x, so take it away from both sides: y − 9 = x.'], ['9-y', 'Subtract 9 from y: y − 9, not 9 − y.']])
rearrange(linear, 'A6.1 Q3', `A shop takes £8 off an order of w items that cost £5 each. The price paid is £P, where ${nb('P = 5w − 8')}. Make w the subject of the formula.`, 'w', '(P+8)/5', '(P + 8)/5', 'Undo the − 8 first, then the × 5. Use the fraction key to put all of P + 8 over 5.',
  board('P = 5w −8', [
    addTo('8', 'P = 5w [−8]', ['P +8^ = 5w ~−8 ~+8^', 'P +8 = 5w'], 'w'),
    divide('5', 'P +8 = [5]w', ['{P+8|5^} = {«5»w|~5^}'], 'w'),
  ], 'w = {P+8|5}'), linearSlips('P', 5, -8, 'w'))
rearrange(linear, 'A6.1 Q4a', `A phone plan costs £C for g gigabytes of data: ${nb('C = 4g + 12')}. Rearrange the formula to make g the subject.`, 'g', '(C-12)/4', '(C − 12)/4', 'Subtract 12 from both sides, then divide all of C − 12 by 4.',
  board('C = 4g +12', [
    subtract('12', 'C = 4g [+12]', ['C −12^ = 4g ~+12 ~−12^', 'C −12 = 4g'], 'g'),
    divide('4', 'C −12 = [4]g', ['{C−12|4^} = {«4»g|~4^}'], 'g'),
  ], 'g = {C−12|4}'), linearSlips('C', 4, 12, 'g'))
useFormula(linear, 'A6.1 Q4b', `Ella’s bill is £32. Use ${nb('g = (C − 12)/4')} to work out how many gigabytes she used.`, 'g', 5, 'gigabytes', 'Put 32 in for C. Work out the top first, then divide by 4.',
  useModel('g = {C−12|4}', [['32 − 12', '20', 'Put in C = 32', 'Work out the top of the fraction first.']], ['Divide by 4', 'The fraction bar means divide the top by 4.', 'g = 20 ÷ 4 = 5']),
  [[20, 'That’s the top of the fraction, 32 − 12. Now divide it by 4: g = 5.'], [11, 'The formula takes 12 away: (32 − 12) ÷ 4 = 5.'], [-4, 'Work out the top first, 32 − 12 = 20, then divide by 4.']])
rearrange(linear, 'A6.1 Q5a', `A rectangle has width 5 cm and length l cm. Its perimeter, P cm, is ${nb('P = 2l + 10')}. Rearrange the formula to make l the subject.`, 'l', '(P-10)/2', '(P − 10)/2', 'Subtract 10 from both sides, then divide all of P − 10 by 2.',
  board('P = 2l +10', [
    subtract('10', 'P = 2l [+10]', ['P −10^ = 2l ~+10 ~−10^', 'P −10 = 2l'], 'l'),
    divide('2', 'P −10 = [2]l', ['{P−10|2^} = {«2»l|~2^}'], 'l'),
  ], 'l = {P−10|2}'), linearSlips('P', 2, 10, 'l'))
useFormula(linear, 'A6.1 Q5b', `The perimeter of the rectangle is 34 cm. Use ${nb('l = (P − 10)/2')} to work out its length.`, 'l', 12, 'cm', 'Put 34 in for P. Work out the top first, then divide by 2.',
  useModel('l = {P−10|2}', [['34 − 10', '24', 'Put in P = 34', 'Work out the top of the fraction first.']], ['Divide by 2', 'The fraction bar means divide the top by 2.', 'l = 24 ÷ 2 = 12']),
  [[24, 'That’s the top of the fraction, 34 − 10. Now divide it by 2: l = 12.'], [22, 'The formula takes 10 away: (34 − 10) ÷ 2 = 12.'], [7, 'Work out the top first, 34 − 10 = 24, then divide by 2.']])
practice(linear, `Ben rearranges ${nb('y = 3x + 6')} and writes ${nb('x = y − 2')}. Is Ben correct?`, 'A6.1 Q5c', choose(
  'No: subtract 6 first, then divide all of y − 6 by 3, so x = (y − 6)/3',
  ['Yes: 6 ÷ 3 = 2', 'Dividing by 3 has to divide the whole of each side, y as well. Take the 6 away first: y − 6 = 3x, so x = (y − 6)/3.'],
  ['No: x = y/3 − 6', 'Undo the + 6 before dividing: y − 6 = 3x. Then all of y − 6 goes over 3: x = (y − 6)/3.'],
  ['No: x = (y + 6)/3', 'The 6 is added to 3x, so take it away: y − 6 = 3x, and x = (y − 6)/3.'],
), 'Do it yourself: subtract 6 from both sides, then divide by 3. Compare with Ben.', board('y = 3x +6', [
  subtract('6', 'y = 3x [+6]', ['y −6^ = 3x ~+6 ~−6^', 'y −6 = 3x'], 'x'),
  divide('3', 'y −6 = [3]x', ['{y−6|3^} = {«3»x|~3^}'], 'x'),
], 'x = {y−6|3}'))

/* ---------- Rung 2: formulae with fractions (A6.2) ---------- */

const fractionVideo = worked(fractions, `The mean, M, of two test scores a and b is ${nb('M = (a + b)/2')}. Make a the subject.`, 'A6.2 video + Q1', board('M = {a+b|2}', [
  multiply('2', 'M = {a+b|[2]}', ['M ×2^ = {a+b|~2} ~×2^', '2M = a +b']),
  subtract('b', '2M = a [+b]', ['2M −b^ = a ~+b ~−b^'], 'a'),
], 'a = 2M − b'), 'Clear the fraction first: multiply both sides by the number on the bottom. Then get a on its own.', 'a')
video(fractionVideo, media('fractions', 'Making a the subject of M = (a + b)/2', 'A6.2_Rearranging_Formulae_With_Fractions.mp4', [
  'Clear the fraction first, then get a on its own.',
  'Multiply both sides by 2: the 2s cancel, so 2M = a + b.',
  'Subtract b from both sides: the b terms cancel, so 2M − b = a. Write it with a on the left: a = 2M − b.',
  'Test it with numbers: when M = 72 and b = 68, a = 2 × 72 − 68 = 76.',
  'Where you see it: two tests have a mean of 72 and one score is 68, so the other score is 76.',
]))
rearrange(fractions, 'A6.2 Q2', `Four friends share a prize of £x equally. Each gets £y, where ${nb('y = x/4')}. Make x the subject of the formula.`, 'x', '4y', '4y', 'x is divided by 4. Do the opposite to both sides.',
  board('y = {x|4}', [multiply('4', 'y = {x|[4]}', ['y ×4^ = {x|~4} ~×4^'])], 'x = 4y'),
  [['y/4', 'x is divided by 4, so do the opposite: multiply both sides by 4. x = 4y.'], ['y+4', 'The 4 divides x, it doesn’t take away. Multiply both sides by 4: x = 4y.']])
rearrange(fractions, 'A6.2 Q3', `The area, A cm², of a triangular sail with base b cm and height h cm is ${nb('A = bh/2')}. Make h the subject of the formula.`, 'h', '2A/b', '2A/b', 'Multiply both sides by 2 to clear the fraction. Then h is multiplied by b.',
  board('A = {bh|2}', [
    multiply('2', 'A = {bh|[2]}', ['A ×2^ = {bh|~2} ~×2^', '2A = bh']),
    divide('b', '2A = [b]h', ['{2A|b^} = {«b»h|~b^}'], 'h'),
  ], 'h = {2A|b}'),
  [['A/(2b)', 'The 2 on the bottom divides, so multiply both sides by 2: 2A = bh. Then divide by b.'], ['2Ab', 'h is multiplied by b, so divide both sides by b, don’t multiply: h = 2A/b.'], ['b/(2A)', 'That’s upside down. 2A = bh, so h = 2A/b: 2A on top.'], ['2A-b', 'b multiplies h, it isn’t added. Divide both sides by b: h = 2A/b.'], ['2A', 'That is bh. Divide both sides by b to get h on its own.']])
rearrange(fractions, 'A6.2 Q4a', `A cyclist rides d km in t hours at an average speed of s km/h, where ${nb('s = d/t')}. Rearrange the formula to make t the subject.`, 't', 'd/s', 'd/s', 't is on the bottom. Multiply both sides by t first, then divide by s.',
  board('s = {d|t}', [
    multiply('t', 's = {d|[t]}', ['s ×t^ = {d|~t} ~×t^', 'st = d']),
    divide('s', '[s]t = d', ['{«s»t|~s^} = {d|s^}'], 't'),
  ], 't = {d|s}'),
  [['ds', 'Multiply by t to get it off the bottom: st = d. Then divide both sides by s, don’t multiply: t = d/s.'], ['s/d', 'That’s upside down. st = d, so t = d/s: d on top.'], ['d-s', 's multiplies t, it isn’t added. Divide both sides by s: t = d/s.']])
useFormula(fractions, 'A6.2 Q4b', `The cyclist rides 36 km at 12 km/h. Use ${nb('t = d/s')} to work out the time taken.`, 't', 3, 'hours', 'Put 36 in for d and 12 in for s. Then divide.',
  useModel('t = {d|s}', [], ['Put in d and s', 'd = 36 goes on top and s = 12 on the bottom.', 't = 36 ÷ 12 = 3']),
  [[432, 'Time is distance divided by speed: 36 ÷ 12 = 3, not 36 × 12.'], [1 / 3, 'That’s upside down: d goes on top. 36 ÷ 12 = 3.'], [24, 'The fraction means divide: 36 ÷ 12 = 3.']])
rearrange(fractions, 'A6.2 Q5a', `Four friends share a bill of ${nb('£(b + 20)')} equally. Each friend pays £c, where ${nb('c = (b + 20)/4')}. Rearrange the formula to make b the subject.`, 'b', '4c-20', '4c − 20', 'Multiply both sides by 4 first. Then undo the + 20.',
  board('c = {b+20|4}', [
    multiply('4', 'c = {b+20|[4]}', ['c ×4^ = {b+20|~4} ~×4^', '4c = b +20']),
    subtract('20', '4c = b [+20]', ['4c −20^ = b ~+20 ~−20^'], 'b'),
  ], 'b = 4c − 20'),
  [['4c+20', 'The 20 is added to b, so take it away from both sides: b = 4c − 20.'], ['c/4-20', 'The 4 on the bottom divides, so multiply both sides by 4: 4c = b + 20.'], ['4(c-20)', 'Multiply first: 4c = b + 20. Then take away the 20 on its own: b = 4c − 20.'], ['c-20', 'Clear the fraction first: multiply both sides by 4. 4c = b + 20.']])
useFormula(fractions, 'A6.2 Q5b', `Each friend pays £15. Use ${nb('b = 4c − 20')} to work out the value of b.`, 'b', 40, '', 'Put 15 in for c. Multiply before you subtract.',
  useModel('b = 4c −20', [['4 × 15', '60', 'Put in c = 15', '4c means 4 × c. Multiply first.']], ['Take away 20', 'Then take away the 20.', 'b = 60 − 20 = 40']),
  [[80, 'The formula takes 20 away: 4 × 15 − 20 = 40.'], [60, 'That’s 4c. Now take away the 20: b = 40.'], [-5, '4c means 4 × c: 4 × 15 = 60, then 60 − 20 = 40.']])
practice(fractions, `Ali rearranges ${nb('c = (b + 20)/4')} and writes ${nb('b = 4c + 20')}. Is Ali correct?`, 'A6.2 Q5c', choose(
  'No: the 20 is added to b, so subtract it: b = 4c − 20',
  ['Yes: multiplying by 4 gives 4c + 20', 'Multiplying by 4 gives 4c = b + 20. The + 20 is still with b, so take it away from both sides: b = 4c − 20.'],
  ['No: b = 4c − 80', 'Multiplying by 4 clears the bottom of the fraction: 4c = b + 20. The 20 isn’t multiplied, so b = 4c − 20.'],
  ['No: b = c/4 − 20', 'The 4 on the bottom divides, so undo it by multiplying: 4c = b + 20, so b = 4c − 20.'],
), 'Multiply both sides by 4, then look at the sign in front of the 20.', board('c = {b+20|4}', [
  multiply('4', 'c = {b+20|[4]}', ['c ×4^ = {b+20|~4} ~×4^', '4c = b +20']),
  subtract('20', '4c = b [+20]', ['4c −20^ = b ~+20 ~−20^'], 'b'),
], 'b = 4c − 20'))

/* ---------- Rung 3: formulae with squares (A6.3) ---------- */

const squareVideo = worked(squares, `The surface area, A cm², of a cube with side s cm is ${nb('A = 6s²')}. Make s the subject.`, 'A6.3 video + Q1', board('A = 6s²', [
  divide('6', 'A = [6]s²', ['{A|6^} = {«6»s²|~6^}', '{A|6} = s²'], 's²'),
  squareRoot('{A|6} = s[²]', ['√{A|6} = «√»(s«²»)'], 's'),
], 's = √{A|6}'), 'Get s² on its own first. The square root is the very last move.', 's')
video(squareVideo, media('squares', 'Making s the subject of A = 6s²', 'A6.3_Rearranging_Formulae_With_Squares.mp4', [
  'Get s² on its own first, then take the square root.',
  'Divide both sides by 6: the 6s cancel, so A/6 = s².',
  'Square root both sides: it undoes the square, so s = √(A/6). The root goes over the whole of A/6.',
  'Test it with numbers: when A = 54, s = 3, and 6 × 3² = 54.',
  'Where you see it: a cube-shaped box has a surface area of 54 cm², so s = √(54/6) = √9 = 3 cm.',
]))
/** The usual slips on "other = a × subject²", made subject: the root on only part, the root missed, a multiply instead. */
const squareSlips = (other: string, a: number, letter: string): FormulaSlip[] => [
  [`√${other}/${a}`, `Divide by ${a} first, then square root the whole of ${other}/${a}. Tap √ to put the root over all of it.`],
  [`${other}/${a}`, `That is ${letter}². Square root both sides to get ${letter}.`],
  [`√(${a}${other})`, `The ${a} multiplies ${letter}², so divide both sides by ${a}, not multiply: ${letter} = √(${other}/${a}).`],
  [`(${other}/${a})^2`, `Undo a square with a square root, not by squaring again: ${letter} = √(${other}/${a}).`],
  [`√(${other})`, `Divide both sides by ${a} first, so ${letter}² is on its own: ${other}/${a} = ${letter}².`],
]
rearrange(squares, 'A6.3 Q2', `A square patio has sides of x metres and an area of y square metres, where ${nb('y = x²')}. Make x the subject of the formula.`, 'x', '√y', '√y', 'x is squared. What undoes a square?',
  board('y = x²', [squareRoot('y = x[²]', ['√y = «√»(x«²»)'], 'x')], 'x = √y'),
  [['y/2', 'Squaring isn’t doubling. Undo the square with a square root: x = √y.'], ['y^2', 'Undo a square with a square root, not by squaring: x = √y.']])
rearrange(squares, 'A6.3 Q3', `A rectangular pen is 5 times as long as it is wide. Its width is r m and its area is A m², where ${nb('A = 5r²')}. Make r the subject of the formula.`, 'r', '√(A/5)', '√(A/5)', 'Divide both sides by 5, then square root. Tap √ to put the root over the whole fraction.',
  board('A = 5r²', [
    divide('5', 'A = [5]r²', ['{A|5^} = {«5»r²|~5^}', '{A|5} = r²'], 'r²'),
    squareRoot('{A|5} = r[²]', ['√{A|5} = «√»(r«²»)'], 'r'),
  ], 'r = √{A|5}'), squareSlips('A', 5, 'r'))
rearrange(squares, 'A6.3 Q4a', `A square tile has diagonal d cm and area A cm², where ${nb('A = d²/2')}. Rearrange the formula to make d the subject.`, 'd', '√(2A)', '√(2A)', 'Multiply both sides by 2 first. Then square root the whole of 2A.',
  board('A = {d²|2}', [
    multiply('2', 'A = {d²|[2]}', ['A ×2^ = {d²|~2} ~×2^', '2A = d²']),
    squareRoot('2A = d[²]', ['√(2A) = «√»(d«²»)'], 'd'),
  ], 'd = √(2A)'),
  [['2√A', 'Square root the whole of 2A, the 2 as well: d = √(2A). Tap √ to put the root over all of it.'], ['√(A/2)', 'The 2 on the bottom divides, so multiply both sides by 2: 2A = d².'], ['2A', 'That is d². Square root both sides to get d.'], ['√A', 'Multiply both sides by 2 first, so d² is on its own: 2A = d².']])
useFormula(squares, 'A6.3 Q4b', `A square tile has an area of 18 cm². Use ${nb('d = √(2A)')} to work out its diagonal.`, 'd', 6, 'cm', 'Put 18 in for A. Work out 2 × 18, then square root.',
  useModel('d = √(2A)', [['2 × 18', '36', 'Put in A = 18', 'Work out what is under the root first.']], ['Square root', 'Then take the square root.', 'd = √36 = 6']),
  [[36, 'That’s 2 × 18, under the root. Now square root it: √36 = 6.'], [3, 'The formula multiplies by 2: √(2 × 18) = √36 = 6.'], [72, 'Square root it, don’t double it: √36 = 6.']])
rearrange(squares, 'A6.3 Q5a', `A ball falls a distance h metres in t seconds, where ${nb('h = 5t²')}. Rearrange the formula to make t the subject.`, 't', '√(h/5)', '√(h/5)', 'Divide both sides by 5, then square root the whole fraction.',
  board('h = 5t²', [
    divide('5', 'h = [5]t²', ['{h|5^} = {«5»t²|~5^}', '{h|5} = t²'], 't²'),
    squareRoot('{h|5} = t[²]', ['√{h|5} = «√»(t«²»)'], 't'),
  ], 't = √{h|5}'), squareSlips('h', 5, 't'))
useFormula(squares, 'A6.3 Q5b', `The ball falls 80 m. Use ${nb('t = √(h/5)')} to work out how many seconds it takes.`, 't', 4, 'seconds', 'Put 80 in for h. Divide by 5, then square root.',
  useModel('t = √{h|5}', [['80 ÷ 5', '16', 'Put in h = 80', 'Work out what is under the root first.']], ['Square root', 'Then take the square root.', 't = √16 = 4']),
  [[16, 'That’s 80 ÷ 5, under the root. Now square root it: √16 = 4.'], [20, 'Divide by 5, don’t multiply: √(80 ÷ 5) = √16 = 4.'], [8, 'Square root it, don’t halve it: √16 = 4.']])
practice(squares, `Mia rearranges ${nb('A = 6s²')} and writes ${nb('s = √A/6')}. Is Mia correct?`, 'A6.3 Q5c', choose(
  'No: divide by 6 first, then square root the whole of A/6, so s = √(A/6)',
  ['Yes: the square root undoes the square', 'It does, but the root has to cover the whole side. Divide by 6 first: A/6 = s², then s = √(A/6).'],
  ['No: s = A/6', 'A/6 is s², not s. Square root it: s = √(A/6).'],
  ['No: s = √(6A)', 'The 6 multiplies s², so divide by 6, not multiply: s = √(A/6).'],
), 'Do it yourself: divide by 6, then square root. Where does the root go?', board('A = 6s²', [
  divide('6', 'A = [6]s²', ['{A|6^} = {«6»s²|~6^}', '{A|6} = s²'], 's²'),
  squareRoot('{A|6} = s[²]', ['√{A|6} = «√»(s«²»)'], 's'),
], 's = √{A|6}'))

/* ---------- Rung 4: formulae with square roots (A6.4) ---------- */

const rootVideo = worked(roots, `The time, t seconds, for an object to fall h metres is ${nb('t = √(h/5)')}. Make h the subject.`, 'A6.4 video + Q1', board('t = √{h|5}', [
  square('t = [√]{h|5}', ['t‹²› = «√»{h|5}‹²›', 't² = {h|5}']),
  multiply('5', 't² = {h|[5]}', ['t² ×5^ = {h|~5} ~×5^']),
], 'h = 5t²'), 'Undo the square root first by squaring both sides. Then undo the rest.', 'h')
video(rootVideo, media('square-roots', 'Making h the subject of t = √(h/5)', 'A6.4_Rearranging_Formulae_With_Square_Roots.mp4', [
  'Undo the square root by squaring both sides.',
  'Square both sides: the square root disappears, so t² = h/5.',
  'Multiply both sides by 5: the 5s cancel, so h = 5t².',
  'Test it with numbers: when t = 3, h = 5 × 3² = 45.',
  'Where you see it: a stone falls for 3 seconds, so it falls h = 5 × 3² = 45 metres.',
]))
rearrange(roots, 'A6.4 Q2', `A square tile has an area of x cm² and sides of y cm, where ${nb('y = √x')}. Make x the subject of the formula.`, 'x', 'y^2', 'y²', 'x is square rooted. What undoes a square root?',
  board('y = √x', [square('y = [√]x', ['y‹²› = («√»x)‹²›'])], 'x = y²'),
  [['√y', 'Undo a square root by squaring, not by another root: x = y².'], ['2y', 'Squaring isn’t doubling: y² means y × y.'], ['y/2', 'Undo the square root by squaring both sides: x = y².']])
/** The usual slips on "other = √(a × subject)", made subject. */
const rootSlips = (other: string, a: number, letter: string): FormulaSlip[] => [
  [`${other}/${a}`, `Square both sides first, to undo the square root: ${other}² = ${a}${letter}. Then divide by ${a}.`],
  [`${a}${other}^2`, `${a}${letter} means ${a} × ${letter}, so divide both sides by ${a}, not multiply: ${letter} = ${other}²/${a}.`],
  [`${other}^2`, `That is ${a}${letter}. Divide both sides by ${a} to get ${letter} on its own.`],
  [`√(${other}/${a})`, `Undo a square root by squaring both sides, not by another root: ${other}² = ${a}${letter}.`],
  [`(${other}/${a})^2`, `Square both sides first: ${other}² = ${a}${letter}. Then divide only by ${a}: ${letter} = ${other}²/${a}.`],
]
rearrange(roots, 'A6.4 Q3', `A toy car reaches a speed of v m/s after rolling down a ramp of height a m, where ${nb('v = √(3a)')}. Make a the subject of the formula.`, 'a', 'v^2/3', 'v²/3', 'Square both sides, then divide by 3. Use x² for the square and the fraction key for ÷ 3.',
  board('v = √(3a)', [
    square('v = [√](3a)', ['v‹²› = «√»(3a)‹²›', 'v² = 3a']),
    divide('3', 'v² = [3]a', ['{v²|3^} = {«3»a|~3^}'], 'a'),
  ], 'a = {v²|3}'), rootSlips('v', 3, 'a'))
rearrange(roots, 'A6.4 Q4a', `A car skids d metres before it stops. Its speed, v m/s, is ${nb('v = √(20d)')}. Rearrange the formula to make d the subject.`, 'd', 'v^2/20', 'v²/20', 'Square both sides first, then divide by 20.',
  board('v = √(20d)', [
    square('v = [√](20d)', ['v‹²› = «√»(20d)‹²›', 'v² = 20d']),
    divide('20', 'v² = [20]d', ['{v²|20^} = {«20»d|~20^}'], 'd'),
  ], 'd = {v²|20}'), rootSlips('v', 20, 'd'))
useFormula(roots, 'A6.4 Q4b', `The car’s speed is 10 m/s. Use ${nb('d = v²/20')} to work out the skid distance.`, 'd', 5, 'metres', 'Put 10 in for v. Square it first, then divide by 20.',
  useModel('d = {v²|20}', [['10²', '100', 'Put in v = 10', 'v² means 10 × 10.']], ['Divide by 20', 'The fraction bar means divide by 20.', 'd = 100 ÷ 20 = 5']),
  [[100, 'That’s 10², the top. Now divide by 20: d = 5.'], [1, '10² means 10 × 10 = 100, not 10 × 2. Then 100 ÷ 20 = 5.'], [0.5, 'Square the 10 first: 10² = 100. Then 100 ÷ 20 = 5.']])
rearrange(roots, 'A6.4 Q5a', `A pendulum of length l metres swings with a period of T seconds, where ${nb('T = 2√l')}. Rearrange the formula to make l the subject.`, 'l', 'T^2/4', 'T²/4', 'Divide by 2 first, so the square root is on its own. Then square both sides: the 2 is squared too.',
  board('T = 2√l', [
    divide('2', 'T = [2]√l', ['{T|2^} = {«2»√l|~2^}', '{T|2} = √l'], '√l'),
    { ...square('{T|2} = [√]l', ['{T‹²›|2‹²›} = («√»l)‹²›']), say: 'The boxed √ is a square root. Square both sides to undo it. Squaring a fraction squares its top and its bottom, so the 2 on the bottom is squared too and becomes 4.' },
  ], 'l = {T²|4}'),
  [['T^2/2', 'The 2 is squared too: (T/2)² = T²/2² = T²/4.'], ['T/4', 'Square the T as well: (T/2)² = T²/4.'], ['(T-2)^2', 'The 2 multiplies √l, so divide by 2, don’t subtract: T/2 = √l.'], ['T^2', 'Divide by 2 first, so √l is on its own: T/2 = √l. Then square: l = T²/4.'], ['2T^2', 'Divide by 2 first: T/2 = √l. Then square both sides: l = T²/4.']])
useFormula(roots, 'A6.4 Q5b', `The period is 3 seconds. Use ${nb('l = T²/4')} to work out the length of the pendulum.`, 'l', 2.25, 'metres', 'Put 3 in for T. Square it, then divide by 4.',
  useModel('l = {T²|4}', [['3²', '9', 'Put in T = 3', 'T² means 3 × 3.']], ['Divide by 4', 'The fraction bar means divide by 4.', 'l = 9 ÷ 4 = 2.25']),
  [[9, 'That’s 3², the top. Now divide by 4: l = 2.25.'], [4.5, 'The bottom is 4, not 2: 9 ÷ 4 = 2.25.'], [1.5, '3² means 3 × 3 = 9, not 3 × 2. Then 9 ÷ 4 = 2.25.'], [0.75, 'Square the 3 first: 3² = 9. Then 9 ÷ 4 = 2.25.']])
practice(roots, `Sam rearranges ${nb('T = 2√l')} and writes ${nb('l = T²/2')}. Is Sam correct?`, 'A6.4 Q5c', choose(
  'No: the 2 is squared too, so l = T²/4',
  ['Yes: square both sides, then divide by 2', 'Divide by 2 first: T/2 = √l. Squaring T/2 squares the 2 as well, so l = T²/4.'],
  ['No: l = T/4', 'Squaring T gives T², not T: l = T²/4.'],
  ['No: l = (T − 2)²', 'The 2 multiplies √l, so divide by 2, don’t subtract: l = T²/4.'],
), 'Do it yourself: divide by 2, then square both sides. What happens to the 2?', board('T = 2√l', [
  divide('2', 'T = [2]√l', ['{T|2^} = {«2»√l|~2^}', '{T|2} = √l'], '√l'),
  { ...square('{T|2} = [√]l', ['{T‹²›|2‹²›} = («√»l)‹²›']), say: 'The boxed √ is a square root. Square both sides to undo it. Squaring a fraction squares its top and its bottom, so the 2 on the bottom is squared too and becomes 4.' },
], 'l = {T²|4}'))

add('mixed', 'Rearranging formulae', 'A6.1-A6.4 consolidation', text(
  'Rearranging is solving with letters: do the opposite to both sides, one move at a time, until the new subject is on its own.',
  'Dividing divides the whole of the other side: C − 5 = 3m gives m = (C − 5)/3, with all of C − 5 on top.',
  'Clear a fraction first by multiplying both sides by its bottom: M = (a + b)/2 gives 2M = a + b.',
  'A square is undone by a square root over the whole side: A/6 = s² gives s = √(A/6). A square root is undone by squaring: t = √(h/5) gives t² = h/5.',
  'Test your formula with numbers: put in values that work in the original, and check you get them back.',
))

export const tutorRearrangingLesson: TutorMethodLesson = {
  id: 'L020', number: 20, title: 'Rearranging formulae', level: 'GCSE Foundation',
  goal: 'Change the subject of a formula, including formulae with fractions, squares and square roots.',
  labels: { [linear]: 'Simple formulae', [fractions]: 'Fractions', [squares]: 'Squares', [roots]: 'Square roots', mixed: 'Review' },
  states: finish(),
}
