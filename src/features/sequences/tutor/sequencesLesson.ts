import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { EquationRow, MethodStep, SequenceFrame } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, fmt, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { diagnoseList, diagnoseNthTerm, linear } from './sequencesDiagnosis'

const { add, finish } = author(23)
const special = 'sequences-special'
const geometric = 'sequences-geometric'
const nthTerm = 'sequences-nth-term'
const inSequence = 'sequences-in-sequence'
const consecutive = 'sequences-consecutive'
const text = (...lines: string[]) => ({ kind: 'text' as const, lines })
const tex = (value: string) => value.replace(/[~^[\]]/g, '').replace(/−/g, '-').replace(/×/g, '\\times ').replace(/÷/g, '\\div ').replace(/²/g, '^{2}').replace(/³/g, '^{3}').replace(/…/g, '\\dots').replace(/£/g, '\\pounds ').replace(/°/g, '^{\\circ}')
const signed = (n: number) => n < 0 ? `−${-n}` : `+ ${n}`
/** A jump between two terms: "+ 4", "− 8", "× 2". */
const jump = (n: number) => n < 0 ? `− ${-n}` : `+ ${n}`
/** Keeps an expression on one line in a title, so a phone never breaks it. */
const nb = (expression: string) => expression.replace(/ /g, '\u00a0')
const list = (terms: number[]) => terms.map(fmt).join(', ')

/* ---------- Workings drawn on the sequence picture (SequencePictures.tsx) ---------- */

/**
 * One move a step on the sequence picture. Each step adds one part (`adds`), and its heading goes above it. The frame
 * keeps everything earlier steps added; `at` says which step added each part, so finished parts grey out.
 */
type Move = { title: string; say: string; equation: string; adds: SequenceFrame['adds']; change: (frame: SequenceFrame, step: number) => SequenceFrame }
function sequenceModel(question: string, start: Omit<SequenceFrame, 'step' | 'adds'>, moves: Move[], label = 'Work it out'): TutorWorking {
  let frame: SequenceFrame = { ...start, step: 0, adds: 'hops' }
  const steps: MethodStep[] = moves.map((move, step) => {
    frame = { ...move.change(frame, step), step, adds: move.adds }
    return { title: move.title, operation: tex(question), equation: move.equation, instruction: move.say, frame: { sequence: frame } }
  })
  return { kind: 'method-worked', examples: [{ method: 'ordering', expression: tex(question), label, first: 0, second: 0, steps, pictureOnly: true, focus: true }] }
}
const differences = (terms: number[]) => terms.slice(1).map((term, i) => term - terms[i])

/** Moves: the jumps between the terms. */
const gaps = (terms: number[], title: string, say: string): Move => ({
  title, say, equation: tex(differences(terms).map((d, i) => `${fmt(terms[i + 1])} − ${fmt(terms[i])} = ${fmt(d)}`).join(',\\ ')), adds: 'hops',
  change: (frame, step) => ({ ...frame, hops: { labels: differences(terms).map(jump), at: step } }),
})
/** Moves: carry on from the last term, with these jumps; `filled` works the new terms out (the answer, in green). */
const carryOn = (from: number, hops: string[], terms: number[], filled: boolean, title: string, say: string): Move => ({
  title, say, equation: tex(filled ? terms.map(fmt).join(',\\ ') : hops.join(',\\ ')), adds: 'next',
  change: (frame, step) => ({ ...frame, next: { hops, terms: terms.map(fmt), filled, at: step } }),
})
/** Moves: a row lined up under the terms. */
const underRow = (label: string, cells: string[], family: number, title: string, say: string, answer = false): Move => ({
  title, say, equation: tex(`${label ? `${label}: ` : ''}${cells.join(',\\ ')}`), adds: 'row',
  change: (frame, step) => ({ ...frame, rows: [...(frame.rows ?? []), { label, cells, family, at: step, answer }] }),
})
/** Moves: lines of working under the picture. */
const lines = (texts: string[], title: string, say: string, family = 0): Move => ({
  title, say, equation: tex(texts.join(',\\ ')), adds: 'lines',
  change: (frame, step) => ({ ...frame, lines: [...(frame.lines ?? []), ...texts.map(t => ({ text: t, family, at: step }))] }),
})
/** Moves: the last one, ending in the answer in its green box. */
const answerMove = (textOf: string, title: string, say: string, extra?: Move): Move => ({
  title, say, equation: tex(textOf), adds: 'answer',
  change: (frame, step) => ({ ...(extra ? extra.change(frame, step) : frame), answer: { text: textOf, at: step } }),
})

/** The nth term an + b: the gap, the times table, then what to add (Sunny: the textbook's three steps, A9.1 video). */
function nthModel(terms: number[]): TutorWorking {
  const [gap] = differences(terms), b = terms[0] - gap
  const table = terms.map((_, i) => fmt(gap * (i + 1)))
  const compare = terms.map(() => signed(b))
  if (!b) throw new Error(`${terms}: the nth term needs something to add or take away`)
  const verb = b > 0 ? `Add ${b}` : `Subtract ${-b}`
  return sequenceModel(`${list(terms)}, …`, { terms: terms.map(fmt), more: true }, [
    gaps(terms, `The gap is ${fmt(gap)}`, `Take each term from the next one. The gap is the same every time, so that number goes in front of n.`),
    underRow(linear(gap, 0), table, 0, `Write the ${fmt(gap)} times table`, `Multiply each position (1, 2, 3, 4) by the gap, and line the answers up under the terms.`),
    answerMove(`nth term: ${linear(gap, b)}`, `Compare: ${verb.toLowerCase()}`, `Each term is the same distance from the times table, so add or take away that much.`, underRow('', compare, 3, '', '')),
  ], 'Find the nth term')
}

/* ---------- Workings on the board (EquationPictures.tsx), as in A5 ---------- */

/** "5n −2 = 63" → a row; "> note" → a note across the board; "! n = 13" → the answer. */
const row = (line: string): EquationRow => {
  if (line.startsWith('> ')) return { note: line.slice(2), family: /whole number/.test(line) ? 3 : 1 }
  if (line.startsWith('! ')) return { answer: line.slice(2) }
  const at = line.indexOf(' = ')
  return { left: line.slice(0, at), right: line.slice(at + 3) }
}
const rowTex = (line: string) => tex(line.replace(/^[>!] /, '').replace(/\{([^|]*)\|([^}]*)\}/g, '\\frac{$1}{$2}'))
/** One move on the board: its rows, and the part of the row above it works on, boxed in purple. */
type BoardMove = { title: string; say: string; rows: string[]; mark?: (line: string) => string }
function boardModel(start: string, moves: BoardMove[], label = 'Solve'): TutorWorking {
  const shownSoFar: string[] = [start]
  const steps: MethodStep[] = moves.map(move => {
    const shown = shownSoFar.map(row)
    if (move.mark) shown[shownSoFar.length - 1] = row(move.mark(shownSoFar.at(-1)!))
    shownSoFar.push(...move.rows)
    const rows = [...shown, ...move.rows.map(row)]
    return { title: move.title, operation: rowTex(start), equation: rowTex(move.rows.at(-1)!), instruction: move.say, frame: { equation: { rows } } }
  })
  return { kind: 'method-worked', examples: [{ method: 'ordering', expression: rowTex(start), label, first: 0, second: 0, steps, pictureOnly: true, focus: true }] }
}
/** Boxes the token `token` on the given side of a board row: "5n −2 = 63" → "5n [−2] = 63". */
const box = (onLeft: boolean, token: string, boxed = `[${token}]`) => (line: string) => {
  const at = line.indexOf(' = '), sides = [line.slice(0, at), line.slice(at + 3)]
  const i = onLeft ? 0 : 1, tokens: string[] = sides[i].match(/~?\{[^}]*\}\^?|\S+/g) ?? []
  const found = tokens.indexOf(token)
  if (found < 0) throw new Error(`No ${token} to box in ${line}`)
  tokens[found] = boxed
  sides[i] = tokens.join(' ')
  return sides.join(' = ')
}
const lots = (a: number) => a === 1 ? 'n' : `${fmt(a)}n`

/**
 * Is `value` a term of an + b? Set the nth term equal to it, undo the + b, then divide: a whole number n says yes.
 * The divide is the last move, and its answer says whether n is whole, so nothing repeats (A9.2 video).
 */
function inSequenceModel(a: number, b: number, value: number): { model: TutorWorking; n: number } {
  const n = (value - b) / a, whole = Number.isInteger(n)
  const nText = whole ? fmt(n) : Number.isInteger(n * 100) ? fmt(n) : `${(Math.floor(n * 100) / 100).toFixed(2)}…`
  // The answer box holds n; the line under it says what that means, so a phone has room for both.
  const verdict = [`! n = ${nText}`, `> ${whole ? `A whole number, so ${fmt(value)} is a term` : `Not a whole number, so ${fmt(value)} isn’t a term`}`]
  const start = `${lots(a)}${b ? ` ${b < 0 ? '−' : '+'}${Math.abs(b)}` : ''} = ${fmt(value)}`
  const moves: BoardMove[] = []
  let right = value
  if (b) {
    const undo = b > 0 ? `−${b}^` : `+${-b}^`
    moves.push({ title: b > 0 ? `Subtract ${b} from both sides` : `Add ${-b} to both sides`, say: 'The boxed number is stuck to n. Do the opposite to both sides, so it cancels.', mark: box(true, b > 0 ? `+${b}` : `−${-b}`),
      rows: [`${lots(a)} ~${b > 0 ? `+${b}` : `−${-b}`} ~${undo} = ${fmt(value)} ${undo}`, `${lots(a)} = ${fmt(value - b)}`] })
    right = value - b
  }
  moves.push({ title: `Divide both sides by ${fmt(a)}`, say: `The boxed ${fmt(a)} multiplies n. Divide both sides by it. A whole number means the value is a term; anything else means it isn’t.`, mark: box(true, lots(a), `[${fmt(a)}]n`),
    rows: [`${lots(a)} ÷${fmt(a)}^ = ${fmt(right)} ÷${fmt(a)}^`, ...verdict] })
  return { model: boardModel(start, moves), n }
}

/**
 * Two consecutive terms of an + b add to `total`: the next term (n + 1 in place of n), expanded, then collected; the
 * two terms added; the number undone; the divide; then each term worked out, both in green (A9.3 video).
 */
function consecutiveModel(a: number, b: number, total: number, { findN = false }: { findN?: boolean } = {}): { model: TutorWorking; n: number; terms: [number, number] } {
  const term = linear(a, b), next = linear(a, a + b)
  const bracket = `${a === 1 ? '' : fmt(a)}(n+1)${b ? ` ${b < 0 ? '−' : '+'} ${Math.abs(b)}` : ''}`
  const expanded = `${lots(a)} + ${fmt(a)}${b ? ` ${b < 0 ? '−' : '+'} ${Math.abs(b)}` : ''}`
  const sum = 2 * a, constant = a + 2 * b, n = (total - constant) / sum
  const moves: BoardMove[] = [
    { title: 'Put n + 1 in place of n', say: 'The term after the nth term is in position n + 1. Put n + 1 where n is.', rows: [`> next term: ${bracket}`] },
    { title: 'Expand the bracket', say: `Multiply each part inside the bracket by the number outside.`, rows: [`> next term: ${expanded}`] },
    ...(b ? [{ title: 'Collect the numbers', say: 'Add the numbers together.', rows: [`> next term: ${next}`] }] : []),
    { title: `Add the two terms: they make ${fmt(total)}`, say: 'The two terms together make the total. Collect the n terms and the numbers.', rows: [`${sum}n ${constant < 0 ? '−' : '+'}${Math.abs(constant)} = ${fmt(total)}`] },
    { title: constant > 0 ? `Subtract ${constant} from both sides` : `Add ${-constant} to both sides`, say: 'The boxed number is stuck to n. Do the opposite to both sides, so it cancels.', mark: box(true, constant > 0 ? `+${constant}` : `−${-constant}`),
      rows: [`${sum}n ~${constant > 0 ? `+${constant}` : `−${-constant}`} ~${constant > 0 ? `−${constant}` : `+${-constant}`}^ = ${fmt(total)} ${constant > 0 ? `−${constant}` : `+${-constant}`}^`, `${sum}n = ${fmt(total - constant)}`] },
  ]
  const whole = Number.isInteger(n)
  const nText = whole ? fmt(n) : `${(Math.floor(n * 100) / 100).toFixed(2)}…`
  const terms: [number, number] = [a * n + b, a * (n + 1) + b]
  if (findN || !whole) {
    moves.push({ title: `Divide both sides by ${sum}`, say: `The boxed ${sum} multiplies n. Divide both sides by it.${whole ? '' : ' A position has to be a whole number.'}`, mark: box(true, `${sum}n`, `[${sum}]n`),
      rows: [`${sum}n ÷${sum}^ = ${fmt(total - constant)} ÷${sum}^`, `! n = ${nText}`, ...(whole ? [] : ['> Not a whole number, so no'])] })
  } else {
    moves.push({ title: `Divide both sides by ${sum}`, say: `The boxed ${sum} multiplies n. Divide both sides by it.`, mark: box(true, `${sum}n`, `[${sum}]n`), rows: [`${sum}n ÷${sum}^ = ${fmt(total - constant)} ÷${sum}^`, `n = ${fmt(n)}`] })
    moves.push({ title: `Put in n = ${fmt(n)} and n = ${fmt(n + 1)}`, say: 'The two terms are in positions n and n + 1. Put each into the nth term.',
      rows: [`! ${a === 1 ? '' : `${fmt(a)} × `}${fmt(n)}${b ? ` ${b < 0 ? '−' : '+'} ${Math.abs(b)}` : ''} = ${fmt(terms[0])}`, `! ${a === 1 ? '' : `${fmt(a)} × `}${fmt(n + 1)}${b ? ` ${b < 0 ? '−' : '+'} ${Math.abs(b)}` : ''} = ${fmt(terms[1])}`] })
  }
  return { model: boardModel(`> ${term} + next term = ${fmt(total)}`, moves), n, terms }
}

/* ---------- Answers ---------- */

const number = (answer: number, shown: string): InteractionDefinition => ({ type: 'numericInput', correctAnswer: answer, displayAnswer: shown, acceptanceRule: 'normalisedNumber' })
/** Numbers in boxes, "☐ and ☐" or "☐, ☐, ☐, ☐, ☐", in order (or either order with `anyOrder`). */
const numbers = (answer: number[], shown: string, { joiner = 'and', anyOrder = false } = {}): InteractionDefinition => ({ type: 'numericInput', responseShape: 'list', listJoiner: joiner, acceptanceRule: anyOrder ? 'unorderedSet' : 'numberList', correctAnswer: answer.map(fmt).join(', ').replace(/−/g, '-'), displayAnswer: shown })
/** An nth term typed with the letter keyboard, in any order (98 − 8n is −8n + 98). */
const expression = (answer: string): InteractionDefinition => ({ type: 'numericInput', responseShape: 'expression', acceptanceRule: 'collectedExpression', correctAnswer: answer.replace(/−/g, '-'), displayAnswer: answer })
const fractionAnswer = (answer: string): InteractionDefinition => ({ type: 'fractionInput', correctAnswer: answer, displayAnswer: answer, acceptanceRule: 'rational', responseShape: 'fraction' })
/** A choice whose right answer is written first; each wrong option says why it’s wrong. Options are shuffled when shown. */
const choose = (right: string, ...wrong: [string, string][]): InteractionDefinition => ({
  type: 'select', correctAnswer: '0',
  options: [{ id: '0', label: right }, ...wrong.map(([label, feedback], i) => ({ id: String(i + 1), label, feedback }))],
})

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
function practice(topic: MicroSkillId, title: string, sourceRef: string, interaction: InteractionDefinition, hint: string, model: TutorWorking, diagnose?: (response: string) => string | null, unit?: string) {
  const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  const state = add(topic, title, sourceRef, text(title), interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  if (diagnose) state.diagnose = diagnose
  // A list of boxes puts the unit after each box; one box puts it after the answer.
  if (unit && interaction.responseShape === 'list') state.answerPrefix = unit
  else if (unit) state.answerLabel = `Your answer (${unit})`
  return state
}
function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: TutorWorking, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  // The picture shows the sequence, so the heading is only the instruction (EXPLANATIONS.md rule 1).
  state.content.heading = heading
  return state
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }
const media = (name: string, title: string, sourceFile: string, durationSeconds: number, textAlternative: string[]) => ({
  id: `lesson23-${name}`, src: `/media/lesson-23/${name}.mp4`, poster: `/media/lesson-23/${name}.svg`, title, durationSeconds, sourceFile, textAlternative,
})
const slips = (right: number, list: Slip[]) => (response: string) => diagnoseSlips(response, right, list)

/* ---------- Rung 1: special sequences (A9.5) ---------- */

const triangle = worked(special, 'Oranges are stacked in triangles of 1, 3, 6 and 10 oranges. Work out the next two terms.', 'Find the next two terms', 'A9.5 video + Q1', sequenceModel('1, 3, 6, 10, …', { terms: ['1', '3', '6', '10'], more: true }, [
  gaps([1, 3, 6, 10], 'Find the gaps', 'Take each term from the next one. The gaps aren’t all the same, but they follow a pattern.'),
  carryOn(10, ['+ 5', '+ 6'], [15, 21], false, 'The gaps go up by 1', 'Each gap is 1 more than the one before. Carry the pattern on.'),
  carryOn(10, ['+ 5', '+ 6'], [15, 21], true, 'Add each gap', 'Add each new gap to the term before it.'),
], 'Carry on'), 'Look at the gaps between the terms, and how the gaps change.')
video(triangle, media('special-sequences', 'Triangular numbers: 1, 3, 6, 10', 'A9.5_Other_Types_Of_Sequences.mp4', 64, [
  'Triangular numbers: 1, 3, 6, 10. Each triangle of balls adds one longer row.',
  'The gaps between the terms are +2, +3, +4. The gaps go up by 1 each time, so the next gaps are 5 and 6.',
  'Add the gaps to continue: 10 + 5 = 15 and 15 + 6 = 21.',
  'Where you see it: oranges stacked in triangles of 1, 3, 6, 10. The 6th triangle has 15 + 6 = 21 oranges.',
]))
practice(special, `Square tiles are laid in squares of 1 by 1, 2 by 2, 3 by 3 and 4 by 4: ${nb('1, 4, 9, 16, …')} How many tiles are in the 5th square?`, 'A9.5 Q2', number(25, '25 tiles'), 'A square number is a number times itself.', sequenceModel('1, 4, 9, 16, …', { terms: ['1', '4', '9', '16'], more: true }, [
  underRow('n', ['1', '2', '3', '4'], 0, 'Each term is n × n', 'The terms are the square numbers: each position times itself.'),
  answerMove('5 × 5 = 25', 'The 5th: 5 × 5', 'Multiply 5 by itself.'),
]), slips(25, [[10, 'Square means times itself: 5 × 5, not 5 × 2.'], [20, 'That’s 16 + 4. Square numbers don’t go up by the same gap: the 5th is 5 × 5.'], [5, 'That’s the position. The 5th square number is 5 × 5.']]), 'tiles')
practice(special, 'A cube of side 4 cm is built from small 1 cm cubes. How many small cubes are used?', 'A9.5 Q3', number(64, '64 cubes'), 'A cube number is a number multiplied by itself three times.', sequenceModel('4³', { terms: [] }, [
  lines(['4 × 4 = 16'], 'Multiply 4 by 4', 'A cube is a number times itself three times. Start with two of them.'),
  answerMove('16 × 4 = 64', 'Then by 4 again', 'Multiply by the third 4.'),
]), slips(64, [[12, '4³ means 4 × 4 × 4, not 4 × 3.'], [16, 'That’s 4 × 4. A cube needs one more: 16 × 4.'], [48, '4 × 4 is 16, not 12: 16 × 4 = 64.']]), 'cubes')
practice(special, `Each term of a Fibonacci-type sequence is the sum of the two terms before it: ${nb('2, 3, 5, 8, 13, …')} Work out the next two terms.`, 'A9.5 Q4a', numbers([21, 34], '21 and 34'), 'Add the last two terms. Then add the last two again.', sequenceModel('2, 3, 5, 8, 13, …', { terms: ['2', '3', '5', '8', '13'], more: true }, [
  carryOn(13, ['+ 8', '+ 13'], [21, 34], true, 'Add the two terms before', 'Each new term is the two before it added: 8 and 13, then 13 and the new one.'),
]), response => diagnoseList(response, [21, 34], [[[18, 23], 'The gap isn’t 5 every time. Add the two terms before: 8 + 13, then 13 + 21.'], [[21, 29], 'The second new term adds 13 and 21, the two before it.'], [[26, 39], 'That’s doubling 13. Add the two terms before it: 8 + 13.']]))
practice(special, `Another sequence follows the same rule and starts ${nb('4, 7, …')} Write down the 3rd term.`, 'A9.5 Q4b', number(11, '11'), 'Add the first two terms.', sequenceModel('4, 7, …', { terms: ['4', '7'], more: true }, [
  carryOn(7, ['+ 4'], [11], true, 'Add the two terms before', 'The 3rd term is the first two added.'),
]), slips(11, [[10, 'The rule adds the two terms before, not 3: 4 + 7.'], [28, 'Add the two terms, don’t multiply: 4 + 7.']]))
practice(special, `The nth triangular number is ${nb('n(n + 1) ÷ 2')}. Work out the 10th triangular number.`, 'A9.5 Q5a', number(55, '55'), 'Put n = 10 into the formula.', sequenceModel('n(n + 1) ÷ 2', { terms: [] }, [
  lines(['10 × 11 = 110'], 'Put n = 10 in: 10 × 11', 'n is 10, so n + 1 is 11. Multiply them.'),
  answerMove('110 ÷ 2 = 55', 'Divide by 2', 'The formula halves it.'),
]), slips(55, [[110, 'Don’t forget to divide by 2: 110 ÷ 2.'], [50, 'n + 1 is 11: 10 × 11 = 110, then ÷ 2.'], [60, '10 × 11 is 110, not 120.']]))
practice(special, 'The 7th square number is 49. Write down the 8th square number.', 'A9.5 Q5b', number(64, '64'), 'Multiply 8 by itself.', sequenceModel('8th square', { terms: [] }, [
  answerMove('8 × 8 = 64', 'Multiply 8 by itself', 'The 8th square number is 8 times 8.'),
]), slips(64, [[56, 'That’s 49 + 7. Square numbers don’t go up by the same gap: 8 × 8.'], [50, 'Square numbers don’t go up by 1: 8 × 8.'], [16, 'Square means times itself: 8 × 8, not 8 × 2.']]))
practice(special, 'Sam says 36 is both a square number and a triangular number. Is Sam correct?', 'A9.5 Q5c', choose(
  'Yes: 6 × 6 = 36, and the 8th triangular number is 8 × 9 ÷ 2 = 36',
  ['No: 36 is square but not triangular', 'Try n = 8 in n(n + 1) ÷ 2: 8 × 9 ÷ 2 = 36. So it is triangular too.'],
  ['No: a number can’t be both', 'Some can: 1 and 36 are both. 6 × 6 = 36, and 8 × 9 ÷ 2 = 36.'],
  ['Yes: 36 is even', 'Being even doesn’t make a number square or triangular. Check: 6 × 6 = 36 and 8 × 9 ÷ 2 = 36.'],
), 'Is 36 a number times itself? Then try the triangular formula with n = 8.', sequenceModel('36', { terms: [] }, [
  lines(['6 × 6 = 36'], 'Is 36 square?', 'A square number is a number times itself.'),
  answerMove('8 × 9 ÷ 2 = 36', 'Is 36 triangular? Try n = 8', 'Put 8 in place of n in the triangular formula.'),
]))
practice(special, `Which is the term-to-term rule for ${nb('1, 3, 6, 10, 15, …')}?`, 'Textbook A9: term-to-term rule (own numbers)', choose(
  'The gap goes up by 1 each time: + 2, + 3, + 4, + 5',
  ['Add 2 each time', 'Only the first gap is 2. The gaps are 2, 3, 4, 5: each is 1 more than the last.'],
  ['Multiply by 2', '1 × 2 is 2, not 3. Look at the gaps: 2, 3, 4, 5.'],
  ['The nth term is n × n', 'That’s a position-to-term rule, and it gives 1, 4, 9: the square numbers. The term-to-term rule says how to get from one term to the next.'],
), 'A term-to-term rule says how to get from each term to the next. Look at the gaps.', sequenceModel('1, 3, 6, 10, 15, …', { terms: ['1', '3', '6', '10', '15'], more: true }, [
  gaps([1, 3, 6, 10, 15], 'Find the gaps', 'Take each term from the next one.'),
  answerMove('Add 1 more each time', 'How do the gaps change?', 'Each gap is 1 bigger than the one before.'),
]))

/* ---------- Rung 2: geometric sequences (A9.4) ---------- */

/** A geometric sequence: divide each term by the one before to find the ratio, then multiply on (A9.4 video). */
function ratioModel(terms: number[], next: number[], ratio: string, divide = false): TutorWorking {
  const divisions = terms.slice(1).map((term, i) => `${fmt(term)} ÷ ${fmt(terms[i])} = ${ratio}`)
  return sequenceModel(`${list(terms)}, …`, { terms: terms.map(fmt), more: true }, [
    lines(divisions, 'Divide each term by the one before', 'The answer is the same every time: that’s the common ratio.'),
    carryOn(terms.at(-1)!, next.map(() => divide ? `÷ ${ratio.split('/')[1]}` : `× ${ratio}`), next, true, divide ? `Divide by ${ratio.split('/')[1]}` : `Multiply by ${ratio}`, divide ? 'Multiplying by a third is the same as dividing by 3. Keep going from the last term.' : 'Keep multiplying by the common ratio, from the last term.'),
  ], 'Carry on')
}
const cells = worked(geometric, 'A bacteria culture has 3 cells at 1 pm, 6 at 2 pm, 12 at 3 pm and 24 at 4 pm. Work out the common ratio and the next two terms.', 'Find the next two terms', 'A9.4 video + Q1', ratioModel([3, 6, 12, 24], [48, 96], '2'), 'Divide each term by the one before. Then keep multiplying.')
video(cells, media('geometric-sequences', 'Geometric sequences: 3, 6, 12, 24', 'A9.4_Geometric_Sequences.mp4', 58, [
  'A geometric sequence multiplies by the same number each time: 3, 6, 12, 24.',
  'Start with 3 bacteria. They double every hour: 3, 6, 12, 24.',
  'Divide each term by the one before: 6 ÷ 3 = 2, 12 ÷ 6 = 2, 24 ÷ 12 = 2. The answer is the same each time: the common ratio is 2.',
  'Keep multiplying: 24 × 2 = 48 and 48 × 2 = 96.',
  'Where you see it: a culture has 3 cells at 1 pm and doubles every hour. At 6 pm there are 24 × 2 × 2 = 96.',
]))
practice(geometric, `A video is shared by 2 people, then 10, then 50. Each time the number is multiplied by 5: ${nb('2, 10, 50, …')} Work out the next term.`, 'A9.4 Q2', number(250, '250'), 'Multiply the last term by 5.', sequenceModel('2, 10, 50, …', { terms: ['2', '10', '50'], more: true }, [
  carryOn(50, ['× 5'], [250], true, 'Multiply by 5', 'The question gives the ratio: multiply the last term by it.'),
]), slips(250, [[55, 'The sequence multiplies by 5, not adds: 50 × 5.'], [90, 'The gaps aren’t the same: it multiplies by 5 each time, 50 × 5.'], [100, 'That’s 50 × 2. The ratio is 5: 50 × 5.']]))
practice(geometric, `A ball bounces to heights of 81 cm, 27 cm and 9 cm: ${nb('81, 27, 9, …')} Work out the next two bounce heights.`, 'A9.4 Q3', numbers([3, 1], '3 cm and 1 cm'), 'Divide each term by the one before it.', ratioModel([81, 27, 9], [3, 1], '1/3', true), response => diagnoseList(response, [3, 1], [[[-9, -27], 'The heights don’t go down by the same amount: each one is a third of the one before. 9 ÷ 3, then 3 ÷ 3.'], [[0, -9], 'Each height is a third of the one before, not 9 less: 9 ÷ 3 = 3.'], [[27, 81], 'The ball bounces lower each time: divide by 3, don’t multiply.']]), 'cm')
practice(geometric, `A message is forwarded to 4 people, then 12, then 36: ${nb('4, 12, 36, …')} Work out the 4th and 5th terms.`, 'A9.4 Q4a', numbers([108, 324], '108 and 324'), 'Divide to find the common ratio, then keep multiplying.', ratioModel([4, 12, 36], [108, 324], '3'), response => diagnoseList(response, [108, 324], [[[60, 84], 'The gaps aren’t the same here: divide to find the ratio. 12 ÷ 4 = 3, so multiply by 3.'], [[68, 100], 'The gaps grow, but the sequence multiplies: 36 × 3 = 108.'], [[108, 216], 'Multiply 108 by 3 as well: 108 × 3 = 324.']]))
practice(geometric, 'Explain why 4, 12, 36, … is not an arithmetic sequence.', 'A9.4 Q4b', choose(
  'The gaps, 8 and 24, are not the same',
  ['It goes up each time', 'Arithmetic sequences can go up too. What matters is whether the gap stays the same: 8, then 24.'],
  ['The numbers are too big', 'Size doesn’t matter. An arithmetic sequence adds the same each time; here the gaps are 8 and 24.'],
  ['It starts with 4', 'Any sequence can start with 4. Work out the gaps: 8 and 24 aren’t the same.'],
), 'An arithmetic sequence goes up by the same amount each time. Work out the gaps.', sequenceModel('4, 12, 36, …', { terms: ['4', '12', '36'], more: true }, [
  gaps([4, 12, 36], 'Work out the gaps', 'Take each term from the next one.'),
  answerMove('The gaps aren’t the same', 'Are the gaps the same?', 'An arithmetic sequence adds the same each time.'),
]))
practice(geometric, `Ria’s savings double every week. She has £5, £10, £20 and £40 in weeks 1 to 4. Work out how much she has in week 7.`, 'A9.4 Q5a', number(320, '£320'), 'Keep doubling until week 7.', sequenceModel('5, 10, 20, 40, …', { terms: ['5', '10', '20', '40'], more: true }, [
  carryOn(40, ['× 2', '× 2', '× 2'], [80, 160, 320], true, 'Double to weeks 5, 6 and 7', 'The common ratio is 2. Weeks 5, 6 and 7 are three more doublings.'),
]), slips(320, [[160, 'That’s week 6. One more doubling for week 7.'], [70, 'The savings double, not go up by 10: 40, 80, 160, 320.'], [640, 'That’s week 8. Week 4 is £40: three doublings to week 7.']])).answerPrefix = '£'
practice(geometric, 'Another jar has £800, £400 and £200 in weeks 1, 2 and 3. Write down the common ratio.', 'A9.4 Q5b', fractionAnswer('1/2'), 'Divide each term by the one before.', sequenceModel('800, 400, 200, …', { terms: ['800', '400', '200'], more: true }, [
  answerMove('400 ÷ 800 = 1/2', 'Divide a term by the one before', 'The common ratio is what each term is multiplied by.'),
]), response => /^\s*2\s*$/.test(response) || /^2\/1$/.test(response.replace(/\s/g, '')) ? 'Divide each term by the one before: 400 ÷ 800 = 1/2, not 800 ÷ 400.' : /-?200/.test(response) ? 'That’s the gap. The common ratio multiplies: 400 ÷ 800 = 1/2.' : null)
practice(geometric, 'Mia says 2, 6, 10, 14, … is a geometric sequence because it goes up by the same amount each time. Is Mia correct?', 'A9.4 Q5c', choose(
  'No: it adds 4 each time, so it is arithmetic. 6 ÷ 2 = 3 but 10 ÷ 6 = 1.67…',
  ['Yes: it goes up by 4 each time', 'Going up by the same amount is arithmetic. A geometric sequence multiplies by the same number: 6 ÷ 2 = 3, but 10 ÷ 6 isn’t 3.'],
  ['Yes: every term is even', 'Even numbers can be in any sequence. Check the ratios: 6 ÷ 2 = 3, 10 ÷ 6 = 1.67…'],
  ['No: it isn’t a sequence', 'It is a sequence: it follows a rule, adding 4. It’s arithmetic, not geometric.'],
), 'Geometric means multiplying by the same number. Divide each term by the one before.', sequenceModel('2, 6, 10, 14, …', { terms: ['2', '6', '10', '14'], more: true }, [
  lines(['6 ÷ 2 = 3', '10 ÷ 6 = 1.67…'], 'Divide each term by the one before', 'A geometric sequence gives the same answer every time.'),
  answerMove('Not the same: not geometric', 'Are the ratios the same?', 'It adds 4 each time instead, so it is arithmetic.'),
]))
practice(geometric, `A plant grows like this: ${nb('0.4, 1.2, 3.6, …')} Work out the next two terms.`, 'Textbook A9: geometric with decimals (own numbers)', numbers([10.8, 32.4], '10.8 and 32.4'), 'Divide a term by the one before to find the ratio.', ratioModel([0.4, 1.2, 3.6], [10.8, 32.4], '3'), response => diagnoseList(response, [10.8, 32.4], [[[6, 8.4], 'The gaps aren’t the same: it multiplies. 1.2 ÷ 0.4 = 3, so 3.6 × 3.'], [[4.4, 5.2], 'It multiplies by 3, not adds: 3.6 × 3 = 10.8.'], [[7.2, 14.4], 'The ratio is 3, not 2: 1.2 ÷ 0.4 = 3.']]))
practice(geometric, `Which is the term-to-term rule for ${nb('7, 14, 28, 56, …')}?`, 'Textbook A9: term-to-term rule (own numbers)', choose(
  'Multiply by 2',
  ['Add 7', '7 + 7 is 14, but 14 + 7 is 21, not 28. Divide instead: 14 ÷ 7 = 2, 28 ÷ 14 = 2.'],
  ['Multiply by 7', '7 × 7 is 49, not 14. Each term is double the one before.'],
  ['The nth term is 7n', '7n gives 7, 14, 21. And the term-to-term rule says how to get from one term to the next.'],
), 'A term-to-term rule says how to get from each term to the next. Divide each term by the one before.', sequenceModel('7, 14, 28, 56, …', { terms: ['7', '14', '28', '56'], more: true }, [
  lines(['14 ÷ 7 = 2', '28 ÷ 14 = 2', '56 ÷ 28 = 2'], 'Divide each term by the one before', 'The same answer each time is the number to multiply by.'),
  answerMove('Multiply by 2', 'The rule', 'Each term is the one before times the common ratio.'),
]))

/* ---------- Rung 3: the nth term (A9.1) ---------- */

/** "Find the nth term of …": typed with the letter keyboard, with a message from the student's own nth term. */
function nthQuestion(title: string, sourceRef: string, terms: number[], hint: string) {
  const [gap] = differences(terms)
  if (differences(terms).some(d => d !== gap)) throw new Error(`${sourceRef}: ${terms} isn't linear`)
  const answer = linear(gap, terms[0] - gap)
  return practice(nthTerm, title, sourceRef, expression(answer), hint, nthModel(terms), response => diagnoseNthTerm(response, gap, terms[0]))
}
const savings = worked(nthTerm, 'Mia saves money in a jar. After weeks 1, 2, 3 and 4 she has £5, £9, £13 and £17. Find an expression for the nth term of this sequence.', 'Find the nth term', 'A9.1 video + Q1', nthModel([5, 9, 13, 17]), 'Find the gap. Write that times table. Compare it with the sequence.')
video(savings, media('nth-term', 'The nth term of 5, 9, 13, 17', 'A9.1_Nth_Term_Of_Linear_Sequences.mp4', 58, [
  'The nth term is a rule that gives the term at any position: 5, 9, 13, 17, …',
  'Position in, term out: each position is multiplied by 4, then 1 is added. Position 1 gives 5, 2 gives 9, 3 gives 13.',
  'The gap between the terms is 4 each time, so write the 4 times table, 4n: 4, 8, 12, 16.',
  'Compare 4n with the sequence: each term is 1 more. So the nth term is 4n + 1.',
  'Where you see it: Mia saves £5, £9, £13, £17 in weeks 1 to 4. In week 20 she has 4 × 20 + 1 = £81.',
]))
practice(nthTerm, `A sequence has nth term ${nb('3n − 2')}. Work out the first 5 terms.`, 'Textbook A9 Your Turn Q2a (own numbers)', numbers([1, 4, 7, 10, 13], '1, 4, 7, 10, 13', { joiner: ',' }), 'Put n = 1, 2, 3, 4 and 5 into 3n − 2.', sequenceModel('3n − 2', { terms: [] }, [
  underRow('n', ['1', '2', '3', '4', '5'], 0, 'n is 1, 2, 3, 4, 5', 'The first five terms are at positions 1 to 5.'),
  underRow('3n', ['3', '6', '9', '12', '15'], 1, 'Multiply each by 3', '3n means 3 times n.'),
  underRow('', ['1', '4', '7', '10', '13'], 3, 'Subtract 2', 'Take 2 away from each, as the nth term says.', true),
], 'Work them out'), response => diagnoseList(response, [1, 4, 7, 10, 13], [[[3, 6, 9, 12, 15], 'That’s 3n. The nth term takes 2 away from each: 3 − 2, 6 − 2, …'], [[5, 8, 11, 14, 17], '3n − 2 takes 2 away, not adds: 3 − 2 = 1.'], [[-2, 1, 4, 7, 10], 'The first term is n = 1, not n = 0: 3 × 1 − 2 = 1.']]))
practice(nthTerm, `Pattern n of a tile design uses ${nb('3n + 2')} tiles. How many tiles are in pattern 5?`, 'A9.1 Q2', number(17, '17 tiles'), 'Put n = 5 into 3n + 2.', sequenceModel('3n + 2', { terms: [] }, [
  lines(['3 × 5 = 15'], 'Put n = 5 in: 3 × 5', '3n means 3 times n.'),
  answerMove('15 + 2 = 17', 'Add 2', 'Then add the 2, as the nth term says.'),
]), slips(17, [[37, '3n means 3 × n, not 3 then 5: 3 × 5 = 15.'], [21, 'Multiply first, then add: 3 × 5 + 2 = 17.'], [10, '3n + 2 needs both parts: 3 × 5 = 15, then + 2.'], [15, 'Don’t forget the + 2: 15 + 2 = 17.']]), 'tiles')
nthQuestion(`Matchstick patterns use 7, 12, 17 and 22 sticks for patterns 1, 2, 3 and 4. Find an expression for the nth term.`, 'A9.1 Q3', [7, 12, 17, 22], 'The gap is 5, so start with 5n. Compare 5n with the sequence.')
nthQuestion(`Find the nth term of ${nb('5, 11, 17, 23, …')}`, 'Textbook A9: nth term with a minus (own numbers)', [5, 11, 17, 23], 'The gap is 6. Compare 6n with the sequence: is each term more or less?')
nthQuestion(`Find the nth term of ${nb('−2, 1, 4, 7, …')}`, 'Textbook A9: nth term from a negative start (own numbers)', [-2, 1, 4, 7], 'The gap is 3. Compare 3n with the sequence.')
nthQuestion(`A cup of tea cools down. Its temperature in °C after 1, 2, 3 and 4 minutes is ${nb('90, 82, 74, 66, …')} Find an expression for the nth term.`, 'A9.1 Q4a', [90, 82, 74, 66], 'The sequence goes down by 8, so start with −8n.')
practice(nthTerm, `Use the nth term ${nb('−8n + 98')} to work out the temperature after 10 minutes.`, 'A9.1 Q4b', number(18, '18 °C'), 'Put n = 10 into the nth term.', sequenceModel('−8n + 98', { terms: [] }, [
  lines(['−8 × 10 = −80'], 'Put n = 10 in: −8 × 10', '−8n means −8 times n.'),
  answerMove('−80 + 98 = 18', 'Add 98', 'Then add the 98.'),
]), slips(18, [[178, '−8 × 10 is −80, so −80 + 98 = 18.'], [-18, '−80 + 98 is positive: 98 is bigger than 80.'], [10, 'That’s the number of minutes. Put n = 10 into −8n + 98.']]), '°C')
nthQuestion(`A theatre has 6 seats in row 1, 11 in row 2, 16 in row 3 and 21 in row 4. Find an expression for the nth term.`, 'A9.1 Q5a', [6, 11, 16, 21], 'The gap is 5, so start with 5n.')
practice(nthTerm, `Row n of the theatre has ${nb('5n + 1')} seats. How many seats are in row 20?`, 'A9.1 Q5b', number(101, '101 seats'), 'Put n = 20 into the nth term.', sequenceModel('5n + 1', { terms: [] }, [
  lines(['5 × 20 = 100'], 'Put n = 20 in: 5 × 20', '5n means 5 times n.'),
  answerMove('100 + 1 = 101', 'Add 1', 'Then add the 1.'),
]), slips(101, [[100, 'Don’t forget the + 1: 100 + 1.'], [26, 'That’s the 21 seats of row 4 plus 5. Put n = 20 into 5n + 1.'], [120, '5 × 20 is 100, so 100 + 1 = 101.']]), 'seats')
practice(nthTerm, `Tom says the nth term of ${nb('7, 10, 13, 16, …')} is ${nb('3n + 7')}. Is Tom correct?`, 'A9.1 Q5c', choose(
  'No: 3n + 7 gives 10 for the first term, not 7. The nth term is 3n + 4',
  ['Yes: the gap is 3 and it starts at 7', 'The first term is 3 × 1 + 7 = 10, not 7. 3n gives 3, so add 4: 3n + 4.'],
  ['No: it should be 7n + 3', 'The gap, 3, goes in front of n. 3n gives 3, and the first term is 7, so 3n + 4.'],
  ['No: it should be n + 3', 'The terms go up by 3, so it starts with 3n. 3n gives 3: add 4 to make 7.'],
), 'Test Tom’s rule with n = 1. Does it give 7?', nthModel([7, 10, 13, 16]))

/* ---------- Rung 4: is a value part of a sequence? (A9.2) ---------- */

/** "Is it in the sequence?" as a choice, with the board working. The source's answer must match the working. */
function inQuestion(title: string, sourceRef: string, a: number, b: number, value: number, right: string, wrong: [string, string][], hint: string) {
  const { model, n } = inSequenceModel(a, b, value)
  if (Number.isInteger(n) !== right.startsWith('Yes')) throw new Error(`${sourceRef}: n = ${n}`)
  return practice(inSequence, title, sourceRef, choose(right, ...wrong), hint, model)
}
const seats = worked(inSequence, `Row n of a hall has ${nb('5n − 2')} seats. Is there a row with exactly 63 seats?`, 'Is 63 a term?', 'A9.2 video', inSequenceModel(5, -2, 63).model, 'Put the nth term equal to the number and solve for n. A whole number means yes.')
video(seats, media('is-it-in-the-sequence', 'Is 63 a term of 5n − 2?', 'A9.2_Is_A_Value_Part_Of_A_Sequence.mp4', 63.5, [
  'Is 63 a term of 5n − 2? Put the nth term equal to the number and solve for n: 5n − 2 = 63.',
  'Position in, term out: × 5, then − 2. Position 1 gives 3, 2 gives 8, 3 gives 13. Is 63 an output? Run it backwards.',
  'Add 2 to both sides: 5n = 65. Divide both sides by 5: n = 13.',
  '13 is a whole number, so 63 is in the sequence.',
  'Where you see it: row n of a hall has 5n − 2 seats. Row 13 has exactly 63 seats.',
]))
inQuestion('Lockers in a school are numbered 6n. Is there a locker numbered 30?', 'A9.2 Q2', 6, 0, 30, 'Yes: 30 ÷ 6 = 5, so it is the 5th locker', [
  ['No: 30 isn’t in the 6 times table', '6 × 5 = 30, so it is: the 5th locker.'],
  ['Yes: 30 is even', 'Being even isn’t enough: 6n is the 6 times table, and 30 ÷ 6 = 5.'],
  ['No: 30 is bigger than 6', 'The lockers go 6, 12, 18, 24, 30: 30 is the 5th.'],
], 'Divide 30 by 6. A whole number means yes.')
inQuestion(`Row n of a hall has ${nb('5n + 3')} chairs. Could a row have exactly 48 chairs?`, 'A9.2 Q1', 5, 3, 48, 'Yes: 5n + 3 = 48 gives n = 9, so row 9 has 48 chairs', [
  ['No: 48 isn’t in the 5 times table', 'The sequence adds 3 to the 5 times table: 5 × 9 + 3 = 48.'],
  ['Yes: row 48', 'The row number is n, not the number of chairs: 5n + 3 = 48 gives n = 9.'],
  ['No: n = 51 ÷ 5', 'Subtract the 3, don’t add it: 5n = 45, so n = 9.'],
], 'Put 5n + 3 equal to 48 and solve for n.')
inQuestion(`A pattern of tiles uses ${nb('5n − 2')} tiles for pattern n. Could a pattern use exactly 60 tiles?`, 'A9.2 Q3', 5, -2, 60, 'No: 5n − 2 = 60 gives n = 12.4, which isn’t whole', [
  ['Yes: pattern 12', '5 × 12 − 2 is 58, not 60. Solving gives n = 12.4: not a whole number.'],
  ['Yes: 60 is in the 5 times table', 'The sequence takes 2 off the 5 times table: 3, 8, 13, … Solve 5n − 2 = 60: n = 12.4.'],
  ['No: 60 is too big', 'Big numbers can be terms. Solve 5n − 2 = 60: n = 12.4, which isn’t whole.'],
], 'Put 5n − 2 equal to 60 and solve for n. Is n a whole number?')
const tins = inSequenceModel(3, 4, 49)
practice(inSequence, `A shop stacks tins in rows. Row n has ${nb('3n + 4')} tins. Which row has 49 tins?`, 'A9.2 Q4a', number(15, 'Row 15'), 'Put 3n + 4 equal to 49 and solve for n.', tins.model, slips(15, [[45, 'That’s 3n. Divide by 3 to get n: 45 ÷ 3 = 15.'], [17.67, 'Subtract the 4, don’t add it: 3n = 45, so n = 15.'], [16.33, 'Solve 3n + 4 = 49: subtract 4, then divide by 3.']])).answerPrefix = 'Row'
inQuestion(`Row n has ${nb('3n + 4')} tins. Explain why no row has exactly 50 tins.`, 'A9.2 Q4b', 3, 4, 50, 'No: 3n + 4 = 50 gives n = 15.33…, which isn’t a whole number', [
  ['Yes: row 16 has 50', '3 × 16 + 4 = 52, not 50. Solving gives n = 15.33…: not whole.'],
  ['No: 50 is even', 'Even numbers can be terms: row 2 has 10. Solve 3n + 4 = 50: n = 15.33….'],
  ['No: 50 isn’t in the 3 times table', '49 isn’t either, but row 15 has 49. Solve 3n + 4 = 50: n isn’t whole.'],
], 'Solve 3n + 4 = 50. Is n a whole number?')
inQuestion(`Bus route numbers follow the rule ${nb('7n + 2')}. Is 100 a route number?`, 'A9.2 Q5a', 7, 2, 100, 'Yes: 7n + 2 = 100 gives n = 14, so it is the 14th route number', [
  ['No: 100 isn’t in the 7 times table', 'The routes add 2 to the 7 times table: 7 × 14 + 2 = 100.'],
  ['No: n = 102 ÷ 7, which isn’t whole', 'Subtract the 2, don’t add it: 7n = 98, n = 14.'],
  ['Yes: 100 is a round number', 'Round numbers aren’t always terms. Solve 7n + 2 = 100: n = 14, a whole number.'],
], 'Put 7n + 2 equal to 100 and solve for n.')
practice(inSequence, `Route 100 is the 14th route number (${nb('7n + 2')}). Work out the first route number that is greater than 100.`, 'A9.2 Q5b', number(107, '107'), '100 is term 14, so the next term is n = 15.', sequenceModel('7n + 2', { terms: [] }, [
  lines(['7 × 15 = 105'], 'The next term: n = 15. 7 × 15', '100 is the 14th term, so the next one is the 15th.'),
  answerMove('105 + 2 = 107', 'Add 2', 'Then add the 2.'),
]), slips(107, [[101, 'Route numbers go up by 7: the next one is 7 × 15 + 2.'], [105, 'Don’t forget the + 2: 105 + 2.'], [102, 'Route numbers go up by 7, not 2: 100 + 7 = 107.']]))
inQuestion(`Zoe says 30 is in the sequence with nth term ${nb('4n + 1')} because 30 is bigger than 4. Is Zoe correct?`, 'A9.2 Q5c', 4, 1, 30, 'No: 4n + 1 = 30 gives n = 7.25, which isn’t whole', [
  ['Yes: 30 is bigger than 4', 'Being big enough doesn’t make it a term. Solve 4n + 1 = 30: n = 7.25.'],
  ['Yes: 4 × 7 + 1 is close to 30', 'Close isn’t enough: 4 × 7 + 1 = 29, and 4 × 8 + 1 = 33. n = 7.25 isn’t whole.'],
  ['No: 30 is even', 'Some terms could be even in other sequences. Here 4n + 1 = 30 gives n = 7.25.'],
], 'Put 4n + 1 equal to 30 and solve for n.')
{
  // Textbook A9 Example 2, with our own numbers: find the nth term first, then check the value.
  const { model } = inSequenceModel(5, -3, 98)
  const nth = nthModel([2, 7, 12, 17])
  // The nth term is a step on the way, not the answer: it ends in a purple line, and only the verdict is green.
  if (model.kind === 'method-worked' && nth.kind === 'method-worked') model.examples[0].steps = [...nth.examples[0].steps.map(step => {
    const frame = step.frame.sequence!
    return frame.answer ? { ...step, frame: { sequence: { ...frame, answer: undefined, adds: 'lines' as const, lines: [{ text: frame.answer.text, family: 3, at: frame.answer.at }] } } } : step
  }), ...model.examples[0].steps]
  practice(inSequence, `The first terms of a sequence are ${nb('2, 7, 12, 17, …')} Is 98 in this sequence?`, 'Textbook A9: find the nth term first (own numbers)', choose(
    'No: the nth term is 5n − 3, and 5n − 3 = 98 gives n = 20.2, which isn’t whole',
    ['Yes: it goes up in 5s', 'It goes up in 5s from 2: 97 is a term, 98 isn’t. Solve 5n − 3 = 98: n = 20.2.'],
    ['Yes: 98 is even, like 2 and 12', 'Every other term is even, but that isn’t enough. The nth term is 5n − 3, and 5n − 3 = 98 gives n = 20.2.'],
    ['No: 98 is bigger than 17', 'The sequence carries on past 17. Find the nth term, 5n − 3, then solve 5n − 3 = 98.'],
  ), 'Find the nth term first. Then put it equal to 98 and solve for n.', model)
}

/* ---------- Rung 5: consecutive terms (A9.3) ---------- */

const wall = consecutiveModel(3, 2, 55)
const steps = worked(consecutive, `Step n of a staircase uses ${nb('3n + 2')} bricks. Two steps next to each other use 55 bricks in total. Work out the number of bricks in each step.`, 'Two terms next to each other add to 55', 'A9.3 video + Q4', wall.model, 'The term after the nth term is the (n + 1)th. Add the two, put them equal to the total, and solve for n.')
video(steps, media('consecutive-terms', 'Consecutive terms of 3n + 2 that add to 55', 'A9.3_Problems_With_Consecutive_Terms.mp4', 63.5, [
  'Consecutive terms are next to each other. The term after n is the term at n + 1.',
  'Position in, term out: × 3, then + 2. Next-door positions give next-door terms.',
  'The next term: replace n with n + 1, giving 3n + 5.',
  'Add the two terms and make the total 55: (3n + 2) + (3n + 5) = 55, so 6n + 7 = 55.',
  'Subtract 7, then divide by 6: 6n = 48, so n = 8.',
  'Terms 8 and 9 are 26 and 29. They add to 55.',
  'Where you see it: layer n of a wall has 3n + 2 bricks. Layers 8 and 9 have 26 and 29 bricks.',
]))
{
  const { model, terms } = consecutiveModel(2, 3, 40)
  practice(consecutive, `Layer n of a brick wall has ${nb('2n + 3')} bricks. Two layers next to each other have 40 bricks in total. Find the number of bricks in each of the two layers.`, 'A9.3 Q1', numbers(terms, '19 bricks and 21 bricks', { anyOrder: true }), 'Call the layers n and n + 1. Add their nth terms and put them equal to 40.', model, response => diagnoseList(response, terms, [[[20, 20], 'The layers aren’t the same: they’re 2 bricks apart. Solve (2n + 3) + (2n + 5) = 40.'], [[8, 9], 'Those are the layer numbers. Put n = 8 and n = 9 into 2n + 3.']]), 'bricks')
}
practice(consecutive, `The nth ticket number is ${nb('3n + 1')}. Write an expression for the next ticket number, the ${nb('(n + 1)')}th.`, 'A9.3 Q2', expression('3n + 4'), 'Replace n with n + 1.', boardModel('> nth term: 3n + 1', [
  { title: 'Put n + 1 in place of n', say: 'The next term is in position n + 1.', rows: ['> next term: 3(n+1) + 1'] },
  { title: 'Expand the bracket', say: 'Multiply each part inside the bracket by the number outside.', rows: ['> next term: 3n + 3 + 1'] },
  { title: 'Collect the numbers', say: 'Add the numbers together.', rows: ['! 3n + 4'] },
], 'Work it out'), response => {
  const typed = response.replace(/\s/g, '').replace(/[−–]/g, '-')
  return typed === '3n+2' ? 'That adds 1 to the term, not to n. The 3 multiplies n + 1 too: 3(n + 1) + 1 = 3n + 4.' : typed === '3(n+1)+1' || typed === '3n+1+1' ? 'Expand the bracket: 3(n + 1) is 3n + 3, so 3n + 3 + 1.' : typed === '4n+1' ? 'Only n changes to n + 1: 3(n + 1) + 1 = 3n + 4.' : null
})
{
  const { model, terms } = consecutiveModel(4, 0, 60)
  practice(consecutive, `Row n of a hall has 4n chairs. Two rows next to each other have 60 chairs in total. Find the number of chairs in each row.`, 'A9.3 Q3', numbers(terms, '28 chairs and 32 chairs', { anyOrder: true }), 'The rows are n and n + 1. Add them and put the total equal to 60.', model, response => diagnoseList(response, terms, [[[30, 30], 'Next-door rows aren’t the same: 4(n + 1) is 4 more than 4n.'], [[7, 8], 'Those are the row numbers. Put n = 7 and n = 8 into 4n.']]), 'chairs')
}
// A9.3 Q4a and Q4b are the worked example above (the video works Q4), so they aren't asked again.
{
  const { model, n } = consecutiveModel(5, -2, 81, { findN: true })
  practice(consecutive, `Pattern n in a dot design has ${nb('5n − 2')} dots. Two patterns next to each other have 81 dots in total. Find the value of n.`, 'A9.3 Q5a', number(n, 'n = 8'), 'The next pattern has 5(n + 1) − 2 dots. Add the two and put them equal to 81.', model, slips(n, [[9, 'That’s n + 1, the second pattern. n is the first one: 8.'], [8.2, 'The two patterns make 10n + 1, not 10n − 1: subtract 1 from 81.'], [16.6, 'Add both terms: 5n − 2 and 5n + 3 make 10n + 1.']])).answerPrefix = 'n ='
}
practice(consecutive, `Patterns 8 and 9 of the dot design (${nb('5n − 2')}) are next to each other. Work out the number of dots in each.`, 'A9.3 Q5b', numbers([38, 43], '38 dots and 43 dots', { anyOrder: true }), 'Put n = 8 and n = 9 into 5n − 2.', sequenceModel('5n − 2', { terms: [] }, [
  answerMove('5 × 8 − 2 = 38 and 5 × 9 − 2 = 43', 'Put in n = 8 and n = 9', 'Each pattern’s number goes in place of n.'),
]), response => diagnoseList(response, [38, 43], [[[40, 45], 'Don’t forget the − 2: 5 × 8 − 2 = 38.'], [[42, 47], '5n − 2 takes 2 away, not adds.']]), 'dots')
{
  const { model } = consecutiveModel(6, 1, 60)
  practice(consecutive, `Dan says two consecutive terms of the sequence ${nb('6n + 1')} add up to 60. Is Dan correct?`, 'A9.3 Q5c', choose(
    'No: 12n + 8 = 60 gives n = 4.33…, which isn’t a whole number',
    ['Yes: 30 + 30 = 60', 'Consecutive terms aren’t equal: they’re 6 apart. Solve (6n + 1) + (6n + 7) = 60.'],
    ['Yes: n = 4 and n = 5', 'Terms 4 and 5 are 25 and 31, which make 56, not 60.'],
    ['No: 60 is even', 'Two odd terms can add to an even number. Solve 12n + 8 = 60: n isn’t whole.'],
  ), 'The next term is 6(n + 1) + 1. Add the two and put them equal to 60.', model)
}

add('mixed', 'Sequences', 'A9.1-A9.5 consolidation', text(
  'Term to term: how to get from each term to the next. Add the gap, or multiply by the common ratio.',
  'Special sequences: square numbers are n × n, cube numbers n × n × n, triangular numbers add 1 more each time, Fibonacci adds the two before.',
  'Position to term, the nth term: the gap goes in front of n, then add or take away to match. 5, 9, 13, 17 has nth term 4n + 1.',
  'Is a number in the sequence? Put the nth term equal to it and solve. A whole number n means yes.',
  'Two terms next to each other are the nth and the (n + 1)th. Add them, put them equal to the total and solve.',
))

export const tutorSequencesLesson: TutorMethodLesson = {
  id: 'L023', number: 23, title: 'Sequences', level: 'GCSE Foundation',
  goal: 'Continue special and geometric sequences, find and use the nth term of a linear sequence, decide whether a number is a term, and solve problems with terms next to each other.',
  labels: { [special]: 'Special sequences', [geometric]: 'Geometric', [nthTerm]: 'The nth term', [inSequence]: 'Is it in?', [consecutive]: 'Next to each other', mixed: 'Review' },
  states: finish(),
}
