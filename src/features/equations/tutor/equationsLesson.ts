import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { EquationRow, MethodStep, SolvedFrame, WorkingLine } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseRoots, diagnoseSlips, evaluate, fmt, linearSlips, rootSlips, solve, substitute, type Linear, type Slip } from './equationsDiagnosis'

const { add, finish } = author(19)
const one = 'equations-one-unknown'
const squares = 'equations-squares'
const both = 'equations-both-sides'
const brackets = 'equations-brackets'
const fractions = 'equations-fractions'
const text = (...lines: string[]) => ({ kind: 'text' as const, lines })

/* ---------- The board: rows of left = right (EquationPictures.tsx) ---------- */

/** "5x ~−3 ~+3^ = 27 +3^" → a row of the board; "> note" → a note across both sides. */
const row = (line: string): EquationRow => {
  if (line.startsWith('> ')) return { note: line.slice(2) }
  const at = line.indexOf(' = ')
  return { left: line.slice(0, at), right: line.slice(at + 3) }
}
/** The row as KaTeX, for the step chain: fractions stacked, roots drawn, markers gone. */
function tex(line: EquationRow) {
  const plain = 'note' in line ? line.note : `${line.left} = ${line.right}`
  return plain.replace(/[~^]/g, '').replace(/\{([^|]*)\|([^}]*)\}/g, '\\frac{$1}{$2}').replace(/√(\d+|[a-z])/g, '\\sqrt{$1}')
    .replace(/²/g, '^{2}').replace(/−/g, '-').replace(/×/g, '\\times ').replace(/÷/g, '\\div ').replace(/ or /g, ',\\ ')
}

/** A number as the first token on a side, or as a later one with its sign: 3 → "+3", −3 → "−3". */
const num = (n: number) => fmt(n)
const sgn = (n: number) => n < 0 ? fmt(n) : `+${fmt(n)}`
/** k lots of the unknown: 1 → "x", 5 → "5x", with x, x² or √x. */
const lots = (k: number, sym: string) => k === 1 ? sym : k === -1 ? `−${sym}` : `${fmt(k)}${sym}`
const side = (x: number, n: number, sym: string) => x ? `${lots(x, sym)}${n ? ` ${sgn(n)}` : ''}` : num(n)

/**
 * One move: its heading, the ⓘ words, and the rows it adds to the board. `mark` boxes the part of the row above
 * that the move undoes (the − 3, the 5 in 5x, the bottom of a fraction), so students see where each number comes from.
 */
type Move = { title: string; say: string; rows: string[]; mark?: (line: string) => string }

/** Boxes one token on one side of a row: "5x −3 = 27" with (left, −3) → "5x [−3] = 27". */
const box = (onLeft: boolean, token: string, boxed = `[${token}]`) => (line: string) => {
  const at = line.indexOf(' = '), sides = [line.slice(0, at), line.slice(at + 3)]
  const i = onLeft ? 0 : 1, tokens: string[] = sides[i].match(/~?\{[^}]*\}\^?|\S+/g) ?? []
  const found = tokens.indexOf(token)
  if (found < 0) throw new Error(`No ${token} to box in ${line}`)
  tokens[found] = boxed
  sides[i] = tokens.join(' ')
  return sides.join(' = ')
}

/**
 * The moves that solve xl·s + nl = xr·s + nr, where s is x, x² or √x, one move at a time:
 * the smaller x term off both sides, then the number next to x, then the divide.
 */
function linearMoves({ xl, nl, xr, nr }: Linear, sym: string): { moves: Move[]; value: number; how?: string } {
  const moves: Move[] = []
  let how: string | undefined
  if (xl && xr) {
    const k = Math.min(xl, xr), leftLarger = xl >= xr
    const move = `${k < 0 ? '+' : '−'}${lots(Math.abs(k), sym)}^`
    moves.push({
      title: `${k < 0 ? 'Add' : 'Subtract'} ${lots(Math.abs(k), sym)} ${k < 0 ? 'to' : 'from'} both sides`,
      say: `The boxed term is the smaller ${sym} term. Take it away from both sides, so all the ${sym} terms are on one side. On its own side it cancels.`,
      mark: box(!leftLarger, lots(k, sym)),
      rows: leftLarger
        ? [`${lots(xl, sym)} ${move}${nl ? ` ${sgn(nl)}` : ''} = ~${lots(xr, sym)} ~${move}${nr ? ` ${sgn(nr)}` : ''}`, `${side(xl - xr, nl, sym)} = ${num(nr)}`]
        : [`~${lots(xl, sym)} ~${move}${nl ? ` ${sgn(nl)}` : ''} = ${lots(xr, sym)} ${move}${nr ? ` ${sgn(nr)}` : ''}`, `${num(nl)} = ${side(xr - xl, nr, sym)}`],
    })
  }
  const onLeft = xl >= xr
  const a = Math.abs(xl - xr), b = onLeft ? nl : nr
  let c = onLeft ? nr : nl
  const put = (x: string, other: string) => onLeft ? `${x} = ${other}` : `${other} = ${x}`
  if (b) {
    moves.push({
      title: b > 0 ? `Subtract ${fmt(b)} from both sides` : `Add ${fmt(-b)} to both sides`,
      say: `The boxed number is stuck to ${sym}. Do the opposite to both sides, so it cancels.`,
      mark: box(onLeft, sgn(b)),
      rows: [put(`${lots(a, sym)} ~${sgn(b)} ~${sgn(-b)}^`, `${num(c)} ${sgn(-b)}^`), put(lots(a, sym), num(c - b))],
    })
    how = `${fmt(c)} ${b > 0 ? '−' : '+'} ${fmt(Math.abs(b))}`
    c -= b
  }
  if (a !== 1) {
    how = `${fmt(c)} ÷ ${fmt(a)}`
    moves.push({
      title: `Divide both sides by ${fmt(a)}`,
      say: `The boxed ${fmt(a)} multiplies ${sym}. Divide both sides by it to leave ${sym} on its own.`,
      mark: box(onLeft, lots(a, sym), `[${fmt(a)}]${sym}`),
      rows: [put(`${lots(a, sym)} ÷${fmt(a)}^`, `${num(c)} ÷${fmt(a)}^`)],
    })
  }
  return { moves, value: c / a, how }
}

/** The working for an equation: the board, one move a step, then the check and the answer. Squares and roots finish with their own moves. */
function solveModel(problem: string, letter: string, equation: Linear, { before = [], sym = letter }: { before?: Move[]; sym?: string } = {}): TutorWorking {
  const { moves, value, how } = linearMoves(equation, sym)
  let answer = `${letter} = ${fmt(value)}`
  let solved: SolvedFrame = { pieces: [{ text: letter, family: 0, label: 'on its own' }, { text: '=' }, { text: fmt(value), family: 1, label: how }] }
  let check: string[] = []
  if (sym === `${letter}²`) {
    // x² is now on its own: say so, then undo the square. The two answers are checked by squaring them.
    if (moves.length && moves.at(-1)!.title.startsWith('Divide')) moves.at(-1)!.rows.push(`${sym} = ${fmt(value)}`)
    const root = Math.sqrt(value)
    moves.push({ title: 'Square root both sides', say: `The boxed ² squares ${letter}. Undo it with a square root, on both sides.`, rows: [`${letter} = √${fmt(value)}`], mark: box(true, sym, `${letter}[²]`) })
    moves.push({ title: 'Two answers', say: 'A negative times a negative is positive, so the negative number squares to the same answer.', rows: [`> ${fmt(root)} × ${fmt(root)} = ${fmt(value)}`, `> −${fmt(root)} × −${fmt(root)} = ${fmt(value)}`] })
    answer = `${letter} = ${fmt(root)} or ${letter} = −${fmt(root)}`
    solved = { pieces: [{ text: letter, family: 0 }, { text: '=' }, { text: fmt(root), family: 1, label: `√${fmt(value)}` }, { text: 'or' }, { text: letter, family: 0 }, { text: '=' }, { text: `−${fmt(root)}`, family: 1, label: `−√${fmt(value)}` }] }
  } else {
    let final = value
    if (sym !== letter) {
      // √x is now on its own: undo the root by squaring.
      if (moves.length && moves.at(-1)!.title.startsWith('Divide')) moves.at(-1)!.rows.push(`${sym} = ${fmt(value)}`)
      moves.push({ title: 'Square both sides', say: 'The boxed √ is a square root. Undo it by squaring both sides.', rows: [`${letter} = ${fmt(value)}²`], mark: box(true, sym, `[√]${letter}`) })
      final = value * value
      answer = `${letter} = ${fmt(final)}`
      solved = { pieces: [{ text: letter, family: 0, label: 'on its own' }, { text: '=' }, { text: fmt(final), family: 1, label: `${fmt(value)}²` }] }
    }
    // The check: the answer put back into each side of the question.
    const at = problem.indexOf(' = '), sides = [problem.slice(0, at), problem.slice(at + 3)]
    const worked = sides.map(side => substitute(side, letter, final))
    const values = worked.map(evaluate)
    if (Math.abs(values[0] - values[1]) > 1e-9) throw new Error(`${problem}: ${answer} does not check`)
    check = sides[1].includes(letter) ? [`> ${worked[0]} = ${fmt(values[0])}`, `> ${worked[1]} = ${fmt(values[1])} ✓`] : [`> ${worked[0]} = ${worked[1]} ✓`]
  }
  const lines: string[] = [problem]
  const steps: MethodStep[] = [...before, ...moves].map(move => {
    // The row above, with the part this move undoes boxed; the board keeps it plain once the move is done.
    const shown = lines.map(row)
    if (move.mark) shown[lines.length - 1] = row(move.mark(lines.at(-1)!))
    lines.push(...move.rows)
    const rows = [...shown, ...move.rows.map(row)]
    return { title: move.title, operation: tex(rows[0]), equation: tex(rows.at(-1)!), instruction: move.say, frame: { equation: { rows } } }
  })
  const rows = [...lines, ...check].map(row)
  steps.push({ title: 'The answer', operation: tex(rows[0]), equation: tex(row(answer)), instruction: check.length ? `Put ${answer} back into the question: both sides come out the same, so it’s right.` : 'Both answers square back to the same number, so both are right.', frame: { equation: { rows }, ordering: { answer }, solved } })
  return { kind: 'method-worked', examples: [{ method: 'ordering', expression: tex(rows[0]), label: 'Solve', first: 0, second: 0, steps, pictureOnly: true }] }
}

/** Working for a "put it back in" question: lines of arithmetic, then the answer. */
function checkModel(problem: string, lines: WorkingLine[], answer: string, titles: [string, string][]): TutorWorking {
  const question = tex(row(problem))
  const steps: MethodStep[] = lines.map((line, i) => ({ title: titles[i][0], operation: question, equation: `${line.parts ?? ''}=${line.total}`.replace(/−/g, '-').replace(/×/g, '\\times ').replace(/÷/g, '\\div ').replace(/£/g, '\\pounds '), instruction: titles[i][1], frame: { sums: lines.slice(0, i + 1) } }))
  steps.push({ title: 'The answer', operation: question, equation: '\\checkmark', instruction: 'Both give the same, so the answer is right.', frame: { ordering: { answer } } })
  return { kind: 'method-worked', examples: [{ method: 'ordering', expression: question, label: 'Check', first: 0, second: 0, steps, pictureOnly: true }] }
}

/* ---------- Answers ---------- */

const number = (answer: number, shown: string): InteractionDefinition => ({ type: 'numericInput', correctAnswer: answer, displayAnswer: shown, acceptanceRule: 'normalisedNumber' })
/** Both answers of a squared unknown, in either order. */
const twoRoots = (root: number, letter = 'x'): InteractionDefinition => ({ type: 'numericInput', responseShape: 'roots', acceptanceRule: 'unorderedSet', correctAnswer: `${root}, -${root}`, displayAnswer: `${letter} = ${root} or ${letter} = −${root}` })
/** A choice whose right answer is written first; each wrong option says why it’s wrong. Options are shuffled when shown. */
const choose = (right: string, ...wrong: [string, string][]): InteractionDefinition => ({
  type: 'select', correctAnswer: '0',
  options: [{ id: '0', label: right }, ...wrong.map(([label, feedback], i) => ({ id: String(i + 1), label, feedback }))],
})

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
function practice(topic: MicroSkillId, title: string, sourceRef: string, interaction: InteractionDefinition, hint: string, model: TutorWorking, diagnose?: (response: string) => string | null, prefix?: string) {
  const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  const state = add(topic, title, sourceRef, text(title), interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  if (diagnose) state.diagnose = diagnose
  if (prefix) state.answerPrefix = prefix
  return state
}
function worked(topic: MicroSkillId, title: string, sourceRef: string, model: TutorWorking, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  // The board shows the equation, so the heading is only the instruction (EXPLANATIONS.md rule 1).
  state.content.heading = 'Solve'
  return state
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }
const media = (name: string, title: string, sourceFile: string, textAlternative: string[]) => ({
  id: `lesson19-${name}`, src: `/media/lesson-19/${name}.mp4`, poster: `/media/lesson-19/${name}.svg`, title, durationSeconds: 53, sourceFile, textAlternative,
})
/** Keeps an expression on one line in a title, so a phone never breaks it. */
const nb = (expression: string) => expression.replace(/ /g, '\u00a0')
/** Titles show fractions as (top)/bottom; the board draws them stacked. */
const shown = (problem: string) => problem.replace(/[~^]/g, '').replace(/\{([^|]*)\|([^}]*)\}/g, (_, top: string, bottom: string) => /[+−]/.test(top) ? `(${top})/${bottom}` : `${top}/${bottom}`)
  .replace(/(?<=[^(×÷\s])([+−])/g, ' $1 ').replace(/ ([+−])(?=\S)/g, ' $1 ').replace(/\s+/g, ' ').trim()

/**
 * "Solve …": a number typed after "x =", the board working, and the wrong answers from each slip. `extra` adds the
 * slips that come from brackets or fractions. The equation as solved must give the answer the source gives.
 */
function solveQuestion(topic: MicroSkillId, sourceRef: string, problem: string, equation: Linear, answer: number, hint: string, { letter = 'x', before = [], extra = [], title }: { letter?: string; before?: Move[]; extra?: Slip[]; title?: string } = {}) {
  if (Math.abs(solve(equation) - answer) > 1e-9) throw new Error(`${sourceRef}: ${problem} does not give ${answer}`)
  const slips = [...extra, ...linearSlips(equation, letter)]
  return practice(topic, title ?? `Solve ${nb(shown(problem))}.`, sourceRef, number(answer, `${letter} = ${fmt(answer)}`), hint, solveModel(problem, letter, equation, { before }), response => diagnoseSlips(response, answer, slips), `${letter} =`)
}
/** Multiplying out a bracket, every product shown: "2×3x +2×1" → "6x +2" (Sunny's feedback on the A5.3 video). */
const expand = (title: string, rows: string[]): Move => ({ title, say: 'The boxed number outside multiplies every term inside its bracket, keeping each sign.', rows, mark: line => line.replace(/(^| )(\d+)\(/g, '$1[$2](') })
const clear = (by: number, rows: string[], say = `The boxed ${by} on the bottom divides. Multiply both sides by ${by}, so it cancels.`): Move => ({ title: `Multiply both sides by ${by}`, say, rows, mark: line => line.replace(/\|(\d+)\}/g, '|[$1]}') })
const line = (parts: string, total: string, family = 0): WorkingLine => ({ parts, total, family })

/* ---------- Rung 1: one unknown (A5.1) ---------- */

const oneVideo = worked(one, `Solve ${nb('5x − 3 = 27')}.`, 'A5.1 video + Q1', solveModel('5x −3 = 27', 'x', { xl: 5, nl: -3, xr: 0, nr: 27 }), 'Get x on its own by doing the opposite operation to both sides.')
video(oneVideo, media('one-unknown', 'Solving 5x − 3 = 27', 'A5.1_Solving_Equations_One_Unknown.mp4', [
  'Get x on its own, using the opposite operation. Whatever you do to one side, do to the other.',
  'Add 3 to both sides: the − 3 and + 3 cancel, so 5x = 30.',
  'Divide both sides by 5: the 5s cancel, so x = 6. Put it back in to check: 5 × 6 − 3 = 27.',
  'Where you see it: a taxi costs £3 plus £5 a mile, and the ride cost £28. 5m + 3 = 28, so m = 5 miles.',
]))
solveQuestion(one, 'A5.1 Q2', 'x −7 = 12', { xl: 1, nl: -7, xr: 0, nr: 12 }, 19, 'To undo − 7, add 7 to both sides.')
solveQuestion(one, 'A5.1 Q3', '7x +5 = 40', { xl: 7, nl: 5, xr: 0, nr: 40 }, 5, 'Undo the + 5 first, then the × 7.')
solveQuestion(one, 'A5.1 Q4a', '2m +3 = 17', { xl: 2, nl: 3, xr: 0, nr: 17 }, 7, 'Take the £3 off both sides, then divide by the £2 a mile.', { letter: 'm', title: `A taxi costs £3 plus £2 for each mile. A journey costs £17. Solve ${nb('2m + 3 = 17')} to find the number of miles, m.` })
practice(one, `Check your answer, m = 7, by putting it back into ${nb('2m + 3 = 17')}.`, 'A5.1 Q4b', choose(
  '2 × 7 + 3 = 17, which matches, so m = 7 is right',
  ['2 × 7 + 3 = 20, so m = 7 is wrong', '2 × 7 = 14, and 14 + 3 = 17. It matches, so m = 7 is right.'],
  ['27 + 3 = 30, so m = 7 is wrong', '2m means 2 × m, not 2 with a 7 after it: 2 × 7 = 14, then 14 + 3 = 17.'],
), 'Put 7 in for m. Multiply before you add.', checkModel('2m +3 = 17', [line('2 × 7', '14', 0), line('14 + 3', '17', 1)], '17 matches, so m = 7', [['Put in m = 7', '2m means 2 × m.'], ['Add the 3', 'Multiply first, then add.']]))
solveQuestion(one, 'A5.1 Q5a', '6n +4 = 34', { xl: 6, nl: 4, xr: 0, nr: 34 }, 5, 'Take off the £4 pen first, then share what is left between the 6 notebooks.', { letter: 'n', title: `Mia buys 6 notebooks that cost the same and a pen for £4. She pays £34 altogether. Solve ${nb('6n + 4 = 34')} to find the cost of one notebook, £n.` })
solveQuestion(one, 'A5.1 Q5b', '9x −11 = 52', { xl: 9, nl: -11, xr: 0, nr: 52 }, 7, 'Add 11 to both sides, then divide by 9.')
practice(one, `Tom solves ${nb('4x − 8 = 20')} and writes ${nb('4x = 12')}, so ${nb('x = 3')}. Is Tom correct?`, 'A5.1 Q5c', choose(
  'No: to remove − 8 you add 8, so 4x = 28 and x = 7',
  ['Yes: 20 − 8 = 12, and 12 ÷ 4 = 3', 'Taking away 8 is what − 8 already does. To undo it, add 8: 4x = 28, so x = 7.'],
  ['No: 12 ÷ 4 is 4, so x = 4', '12 ÷ 4 = 3, so his dividing is fine. The mistake is the first step: add 8 to get 4x = 28.'],
  ['No: x = 28', '4x = 28, but that is 4 lots of x. Divide by 4: x = 7.'],
), 'Check his first step. What undoes − 8?', solveModel('4x −8 = 20', 'x', { xl: 4, nl: -8, xr: 0, nr: 20 }))

/* ---------- Rung 2: squares and square roots (A5.5) ---------- */

const squareVideo = worked(squares, `Solve ${nb('2x² = 50')}.`, 'A5.5 video + Q1', solveModel('2x² = 50', 'x', { xl: 2, nl: 0, xr: 0, nr: 50 }, { sym: 'x²' }), 'Get x² on its own, then take the square root. There are two answers.')
video(squareVideo, media('squares-and-roots', 'Solving 2x² = 50', 'A5.5_Solving_Equations_Squares_And_Square_Roots.mp4', [
  'Get x² on its own, then take the square root as the last step.',
  'Divide both sides by 2: the 2s cancel, so x² = 25.',
  'Square root both sides. There are two answers: x = 5 or x = −5.',
  'Both answers work: 2 × 5² = 50 and 2 × (−5)² = 50.',
  'Where you see it: a garden has an area of 3x² = 108 square metres. Lengths cannot be negative, so x = 6 metres.',
]))
const squareQuestion = (sourceRef: string, problem: string, equation: Linear, root: number, hint: string, title?: string) =>
  practice(squares, title ?? `Solve ${nb(shown(problem))}.`, sourceRef, twoRoots(root), hint, solveModel(problem, 'x', equation, { sym: 'x²' }), response => diagnoseRoots(response, root), 'x =')
const rootQuestion = (sourceRef: string, problem: string, equation: Linear, answer: number, hint: string) => {
  const root = solve(equation)
  if (root * root !== answer) throw new Error(`${sourceRef}: ${problem} does not give ${answer}`)
  return practice(squares, `Solve ${nb(shown(problem))}.`, sourceRef, number(answer, `x = ${answer}`), hint, solveModel(problem, 'x', equation, { sym: '√x' }), response => diagnoseSlips(response, answer, [...rootSlips(root), ...linearSlips(equation, '√x').map(([wrong, message]) => [wrong * wrong, message] as Slip)]), 'x =')
}
squareQuestion('A5.5 Q2', 'x² = 49', { xl: 1, nl: 0, xr: 0, nr: 49 }, 7, 'Square root both sides. Give both answers.')
rootQuestion('A5.5 Q3', '4√x = 20', { xl: 4, nl: 0, xr: 0, nr: 20 }, 25, 'Divide both sides by 4, then square both sides to undo the square root.')
squareQuestion('A5.5 Q4a', '3x² = 108', { xl: 3, nl: 0, xr: 0, nr: 108 }, 6, 'Divide both sides by 3, then square root. Give both answers.', `A rectangular garden is 3x metres long and x metres wide. Its area is 108 m². Solve ${nb('3x² = 108')}.`)
practice(squares, 'The garden’s equation gave x = 6 or x = −6. Explain why x can only be 6.', 'A5.5 Q4b', choose(
  'x is the garden’s width, and a length cannot be negative',
  ['−6 squared is −36, so it doesn’t work', '−6 × −6 = +36, so −6 does solve the equation. It’s ruled out because x is a width.'],
  ['A square root is always positive', 'Both 6 and −6 square to 36, so the equation has two answers. Only the garden rules −6 out: a width can’t be negative.'],
), 'Think about what x stands for in the garden.', { kind: 'method-worked', examples: [{ method: 'ordering', expression: '3x^{2}=108', label: 'Explain', first: 0, second: 0, pictureOnly: true, steps: [
  { title: 'Both answers', operation: '3x^{2}=108', equation: '3x^{2}=108', instruction: 'Both numbers solve the equation.', frame: { sums: [line('x = 6 or x = −6', '3x² = 108', 0)] } },
  { title: 'What x is', operation: '3x^{2}=108', equation: 'x', instruction: 'x is how wide the garden is, in metres.', frame: { sums: [line('x = 6 or x = −6', '3x² = 108', 0), line('x', 'the width', 1)] } },
  { title: 'The answer', operation: '3x^{2}=108', equation: 'x=6', instruction: 'A width can’t be negative, so only 6 is left.', frame: { ordering: { answer: 'A length can’t be negative, so x = 6' } } },
] }] })
squareQuestion('A5.5 Q5a', '3x² −5 = 43', { xl: 3, nl: -5, xr: 0, nr: 43 }, 4, 'Add 5, divide by 3, then square root. Give both answers.')
rootQuestion('A5.5 Q5b', '2√x +3 = 11', { xl: 2, nl: 3, xr: 0, nr: 11 }, 16, 'Subtract 3, divide by 2, then square both sides.')
practice(squares, `Ella says: “If ${nb('x² = 36')} then x can only be 6.” Is Ella correct?`, 'A5.5 Q5c', choose(
  'No: (−6)² = 36 too, so x can be 6 or −6',
  ['Yes: a square root is positive', 'A calculator’s √36 gives 6, but −6 × −6 = 36 as well. So x = 6 or x = −6.'],
  ['No: x can only be −6', '6 × 6 = 36 too. Both 6 and −6 work.'],
  ['No: x = 18, because 36 ÷ 2 = 18', 'Squaring isn’t doubling: 18² = 324. x = 6 or x = −6.'],
), 'Square a negative number. What do you get?', solveModel('x² = 36', 'x', { xl: 1, nl: 0, xr: 0, nr: 36 }, { sym: 'x²' }))

/* ---------- Rung 3: unknown on both sides (A5.2) ---------- */

const bothVideo = worked(both, `Solve ${nb('9x + 4 = 4x + 29')}.`, 'A5.2 video + Q1', solveModel('9x +4 = 4x +29', 'x', { xl: 9, nl: 4, xr: 4, nr: 29 }), 'Collect the x terms on one side first: take the smaller one away from both sides.')
video(bothVideo, media('both-sides', 'Solving 9x + 4 = 4x + 29', 'A5.2_Solving_Equations_Unknown_On_Both_Sides.mp4', [
  'Collect the x terms on one side first. Move the smaller x term across.',
  'Subtract 4x from both sides: the 4x on the right cancels, so 5x + 4 = 29.',
  'Subtract 4 from both sides: the 4s on the left cancel, so 5x = 25.',
  'Divide both sides by 5: x = 5.',
  'Where you see it: Plan A is £10 set-up plus £4 a week, Plan B is £2 set-up plus £6 a week. 4w + 10 = 6w + 2, so w = 4 weeks.',
]))
solveQuestion(both, 'A5.2 Q2', '5x = 2x +12', { xl: 5, nl: 0, xr: 2, nr: 12 }, 4, 'Subtract 2x from both sides, then divide.')
solveQuestion(both, 'A5.2 Q3', '6x −4 = 2x +20', { xl: 6, nl: -4, xr: 2, nr: 20 }, 6, 'Subtract 2x from both sides first. Then add 4.')
solveQuestion(both, 'A5.2 Q4a', '4w +10 = 6w +2', { xl: 4, nl: 10, xr: 6, nr: 2 }, 4, 'Subtract the smaller w term, 4w, from both sides. The w terms end up on the right.', { letter: 'w', title: `Plan A costs £10 set-up plus £4 a week. Plan B costs £2 set-up plus £6 a week. They cost the same after w weeks. Solve ${nb('4w + 10 = 6w + 2')}.` })
practice(both, 'Show that both plans cost the same after 4 weeks.', 'A5.2 Q4b', choose(
  'Plan A: 4 × 4 + 10 = £26. Plan B: 6 × 4 + 2 = £26',
  ['Plan A: 4 × 4 + 10 = £56. Plan B: 6 × 4 + 2 = £32', 'Multiply before adding: 4 × 4 = 16, then 16 + 10 = 26. And 6 × 4 = 24, then 24 + 2 = 26.'],
  ['Plan A: 4 + 4 + 10 = £18. Plan B: 6 + 4 + 2 = £12', '4w means 4 × w, so it’s 4 × 4 = 16, not 4 + 4.'],
), 'Put 4 in for w in each plan. Multiply before you add.', checkModel('4w +10 = 6w +2', [line('4 × 4 + 10', '£26', 0), line('6 × 4 + 2', '£26', 1)], 'Both plans cost £26', [['Plan A', 'Put w = 4 into 4w + 10. Multiply first.'], ['Plan B', 'Put w = 4 into 6w + 2.']]))
solveQuestion(both, 'A5.2 Q5a', '10x −7 = 4x +29', { xl: 10, nl: -7, xr: 4, nr: 29 }, 6, 'Subtract 4x from both sides, add 7, then divide.')
practice(both, `Check x = 6 by putting it into both sides of ${nb('10x − 7 = 4x + 29')}.`, 'A5.2 Q5b', choose(
  'Both sides are 53, so x = 6 is right',
  ['Left side 53, right side 35, so x = 6 is wrong', '4 × 6 + 29 = 24 + 29 = 53, not 35. Both sides are 53.'],
  ['Left side 67, right side 53, so x = 6 is wrong', '10 × 6 − 7 = 60 − 7 = 53. Take the 7 away, don’t add it.'],
), 'Put 6 in for x on each side, and work each side out.', checkModel('10x −7 = 4x +29', [line('10 × 6 − 7', '53', 0), line('4 × 6 + 29', '53', 1)], 'Both sides are 53', [['The left side', 'Multiply first, then take away.'], ['The right side', 'Multiply first, then add.']]))
practice(both, `Nina solves ${nb('5x + 9 = 2x + 3')} and writes ${nb('3x = 12')}, so ${nb('x = 4')}. Is Nina correct?`, 'A5.2 Q5c', choose(
  'No: taking 9 from both sides gives 3x = −6, so x = −2',
  ['Yes: 3 + 9 = 12, and 12 ÷ 3 = 4', 'To remove + 9, take 9 away from both sides: 3 − 9 = −6. So 3x = −6 and x = −2.'],
  ['No: 3x = −6, so x = −3', '−6 ÷ 3 = −2, not −3.'],
  ['No: it should be 7x = −6', 'Take 2x away, don’t add it: 5x − 2x = 3x.'],
), 'Look at the 9. What do you do to both sides to remove + 9?', solveModel('5x +9 = 2x +3', 'x', { xl: 5, nl: 9, xr: 2, nr: 3 }))

/* ---------- Rung 4: brackets (A5.3) ---------- */

const bracketVideo = worked(brackets, `Solve ${nb('2(3x + 1) = x + 22')}.`, 'A5.3 video + Q1', solveModel('2(3x+1) = x +22', 'x', { xl: 6, nl: 2, xr: 1, nr: 22 }, { before: [expand('Multiply out the bracket', ['2×3x +2×1 = x +22', '6x +2 = x +22'])] }), 'Brackets are in the way, so multiply them out first. Then solve as before.')
video(bracketVideo, media('brackets', 'Solving 2(3x + 1) = x + 22', 'A5.3_Solving_Equations_With_Brackets.mp4', [
  'Brackets are in the way, so expand them first.',
  'Multiply everything in the bracket by 2: 6x + 2 = x + 22.',
  'Subtract x from both sides: 5x + 2 = 22. Subtract 2 from both sides: 5x = 20.',
  'Divide both sides by 5: x = 4.',
  'Where you see it: Amir buys 3 tickets at £(x + 1) each and Bella buys 2 at £(x + 4). They pay the same: 3(x + 1) = 2(x + 4), so x = 5.',
]))
solveQuestion(brackets, 'A5.3 Q2', '3(x+2) = 15', { xl: 3, nl: 6, xr: 0, nr: 15 }, 3, 'Multiply out the bracket first: 3 times both terms.', {
  before: [expand('Multiply out the bracket', ['3×x +3×2 = 15', '3x +6 = 15'])],
  extra: [[(15 - 2) / 3, 'The 3 multiplies both terms in the bracket: 3 × 2 = 6, so 3x + 6 = 15.']],
})
solveQuestion(brackets, 'A5.3 Q3', '5(x−2) = 2x +11', { xl: 5, nl: -10, xr: 2, nr: 11 }, 7, 'Multiply out the bracket: 5 × −2 = −10. Then get the x terms on one side.', {
  before: [expand('Multiply out the bracket', ['5×x +5×−2 = 2x +11', '5x −10 = 2x +11'])],
  extra: [[(11 + 2) / 3, 'The 5 multiplies both terms in the bracket: 5 × −2 = −10, so 5x − 10 = 2x + 11.']],
})
solveQuestion(brackets, 'A5.3 Q4a', '3(x+1) = 2(x+4)', { xl: 3, nl: 3, xr: 2, nr: 8 }, 5, 'Multiply out both brackets, then take 2x from both sides.', {
  title: `Amir buys 3 cinema tickets at ${nb('£(x + 1)')} each. Bella buys 2 tickets at ${nb('£(x + 4)')} each. They pay the same. Solve ${nb('3(x + 1) = 2(x + 4)')}.`,
  before: [expand('Multiply out both brackets', ['3×x +3×1 = 2×x +2×4', '3x +3 = 2x +8'])],
  extra: [[4 - 1, 'Multiply every term in each bracket: 3 × 1 = 3 and 2 × 4 = 8. So 3x + 3 = 2x + 8.']],
})
practice(brackets, `Amir buys 3 tickets at ${nb('£(x + 1)')} each, and x = 5. How much does Amir pay?`, 'A5.3 Q4b', number(18, '£18'), 'Each ticket costs x + 1. Work out one ticket, then times by 3.', checkModel('3(x+1) = 2(x+4)', [line('5 + 1', '£6', 0), line('3 × 6', '£18', 1)], '£18', [['One ticket', 'Put x = 5 into x + 1.'], ['Three tickets', 'Amir buys 3.']]), response => diagnoseSlips(response, 18, [[16, 'Multiply the whole bracket: 3 × (5 + 1) = 3 × 6 = 18, not 3 × 5 + 1.'], [6, 'That’s one ticket. Amir buys 3: 3 × 6 = 18.'], [5, 'That’s x. One ticket is x + 1 = £6, and Amir buys 3.']]), '£')
solveQuestion(brackets, 'A5.3 Q5a', '4(x+3) = 2(3x−2)', { xl: 4, nl: 12, xr: 6, nr: -4 }, 8, 'Multiply out both brackets. The larger x term is on the right, so take 4x from both sides.', {
  before: [expand('Multiply out both brackets', ['4×x +4×3 = 2×3x +2×−2', '4x +12 = 6x −4'])],
})
practice(brackets, `Check x = 8 by putting it into both sides of ${nb('4(x + 3) = 2(3x − 2)')}.`, 'A5.3 Q5b', choose(
  'Both sides are 44, so x = 8 is right',
  ['Left side 35, right side 22, so x = 8 is wrong', 'Work out the bracket first, then multiply: 4 × (8 + 3) = 4 × 11 = 44, and 2 × (24 − 2) = 2 × 22 = 44.'],
  ['Left side 44, right side 46, so x = 8 is wrong', '3 × 8 − 2 = 22, and 2 × 22 = 44, not 46.'],
), 'Put 8 in for x. Work out each bracket first, then multiply.', checkModel('4(x+3) = 2(3x−2)', [line('4 × (8 + 3) = 4 × 11', '44', 0), line('2 × (24 − 2) = 2 × 22', '44', 1)], 'Both sides are 44', [['The left side', 'The bracket first, then times 4.'], ['The right side', '3 × 8 = 24 inside the bracket, then take 2, then times 2.']]))
practice(brackets, `Leo solves ${nb('3(x − 4) = 2x + 5')} by writing ${nb('3x − 4 = 2x + 5')}, so ${nb('x = 9')}. Is Leo correct?`, 'A5.3 Q5c', choose(
  'No: 3 × −4 = −12, so 3x − 12 = 2x + 5 and x = 17',
  ['Yes: x − 4 = 5, so x = 9', 'Look at his first line: the 3 multiplies both terms in the bracket, so it’s 3x − 12, not 3x − 4. Then x = 17.'],
  ['No: 3x − 12 = 2x + 5, so x = 7', 'Add 12 to both sides, don’t take it away: x = 5 + 12 = 17.'],
  ['No: 3x + 12 = 2x + 5, so x = −7', '3 × −4 = −12, not +12. So 3x − 12 = 2x + 5, and x = 17.'],
), 'Check his first line. What does the 3 multiply?', solveModel('3(x−4) = 2x +5', 'x', { xl: 3, nl: -12, xr: 2, nr: 5 }, { before: [expand('Multiply out the bracket', ['3×x +3×−4 = 2x +5', '3x −12 = 2x +5'])] }))

/* ---------- Rung 5: fractions (A5.4) ---------- */

const fractionVideo = worked(fractions, `Solve ${nb('(2x + 1)/3 = 5')}.`, 'A5.4 video + Q1', solveModel('{2x+1|3} = 5', 'x', { xl: 2, nl: 1, xr: 0, nr: 15 }, { before: [clear(3, ['{2x+1|~3} ~×3^ = 5 ×3^', '2x +1 = 15'])] }), 'Remove the fraction first: multiply both sides by the number on the bottom.')
video(fractionVideo, media('fractions', 'Solving (2x + 1)/3 = 5', 'A5.4_Solving_Equations_With_Fractions.mp4', [
  'Remove the fraction first: multiply both sides by the number under the fraction.',
  'Multiply both sides by 3: the 3s cancel, so 2x + 1 = 15.',
  'Subtract 1 from both sides: 2x = 14. Divide both sides by 2: x = 7.',
  'Where you see it: a bill of £(3x − 1) is split between 4 people and a bill of £(x + 5) between 2. Each pays the same: x = 11, so each person pays £8.',
]))
solveQuestion(fractions, 'A5.4 Q2', '{x|4} = 6', { xl: 1, nl: 0, xr: 0, nr: 24 }, 24, 'x is divided by 4, so multiply both sides by 4.', {
  before: [clear(4, ['{x|~4} ~×4^ = 6 ×4^'])],
  extra: [[6 / 4, 'x is divided by 4, so do the opposite: multiply both sides by 4. 6 × 4 = 24.'], [6 + 4, 'x is divided by 4, not added to 4: multiply both sides by 4.']],
})
solveQuestion(fractions, 'A5.4 Q3', '{x+2|3} = {x+4|5}', { xl: 5, nl: 10, xr: 3, nr: 12 }, 1, 'Multiply both sides by 15, the smallest number 3 and 5 both go into.', {
  before: [clear(15, ['{x+2|3} ×15^ = {x+4|5} ×15^', '> 15 ÷ 3 = 5', '> 15 ÷ 5 = 3', '5(x+2) = 3(x+4)'], 'The boxed bottoms, 3 and 5, both go into 15, so multiply both sides by 15. Each bottom cancels, and what is left of the 15 multiplies the top.'), expand('Multiply out both brackets', ['5×x +5×2 = 3×x +3×4', '5x +10 = 3x +12'])],
  extra: [[(20 - 6) / -2, 'The 15 ÷ 3 = 5 goes with the left top, and 15 ÷ 5 = 3 with the right: 5(x + 2) = 3(x + 4).'], [(12 - 2) / 2, 'The 5 multiplies both terms in the bracket: 5 × 2 = 10.']],
})
solveQuestion(fractions, 'A5.4 Q4a', '{3x−1|4} = {x+5|2}', { xl: 3, nl: -1, xr: 2, nr: 10 }, 11, 'Multiply both sides by 4. The right side is over 2, so it becomes 2(x + 5).', {
  title: `A bill of ${nb('£(3x − 1)')} is shared between 4 people. A bill of ${nb('£(x + 5)')} is shared between 2 people. Each person pays the same. Solve ${nb('(3x − 1)/4 = (x + 5)/2')}.`,
  before: [clear(4, ['{3x−1|~4} ~×4^ = {x+5|2} ×4^', '> 4 ÷ 2 = 2', '3x −1 = 2(x+5)'], 'The boxed bottoms, 4 and 2, both go into 4, so multiply both sides by 4. The 4 on the left cancels; on the right, 4 ÷ 2 = 2 is left to multiply the top.'), expand('Multiply out the bracket', ['3x −1 = 2×x +2×5', '3x −1 = 2x +10'])],
  extra: [[3, 'The bottoms are different, 4 and 2, so you can’t just drop them. Multiply both sides by 4: 4 ÷ 2 = 2 multiplies the right top, so 3x − 1 = 2(x + 5).']],
})
practice(fractions, 'The bill question gave x = 11. How much does each person pay?', 'A5.4 Q4b', number(8, '£8'), 'Put 11 into either fraction: (x + 5)/2 is the quicker one.', checkModel('{3x−1|4} = {x+5|2}', [line('11 + 5', '16', 0), line('16 ÷ 2', '£8', 1)], '£8 each', [['The bill', 'Put x = 11 into x + 5.'], ['Share it', 'Two people share the £16.']]), response => diagnoseSlips(response, 8, [[16, 'That’s the whole bill. It’s shared between 2 people: 16 ÷ 2 = 8.'], [32, 'That’s the other whole bill, 3 × 11 − 1. It’s shared between 4: 32 ÷ 4 = 8.'], [11, 'That’s x. Put it into the bill: (11 + 5) ÷ 2 = 8.']]), '£')
solveQuestion(fractions, 'A5.4 Q5a', '{2x+3|5} = {x+6|3}', { xl: 6, nl: 9, xr: 5, nr: 30 }, 21, 'Multiply both sides by 15. The left top gets 3, the right top gets 5.', {
  before: [clear(15, ['{2x+3|5} ×15^ = {x+6|3} ×15^', '> 15 ÷ 5 = 3', '> 15 ÷ 3 = 5', '3(2x+3) = 5(x+6)'], 'The boxed bottoms, 5 and 3, both go into 15, so multiply both sides by 15. Each bottom cancels, and what is left of the 15 multiplies the top.'), expand('Multiply out both brackets', ['3×2x +3×3 = 5×x +5×6', '6x +9 = 5x +30'])],
  extra: [[(18 - 15) / (10 - 3), 'The 15 ÷ 5 = 3 goes with the left top, and 15 ÷ 3 = 5 with the right: 3(2x + 3) = 5(x + 6).']],
})
practice(fractions, `With x = 21, work out the value each fraction in ${nb('(2x + 3)/5 = (x + 6)/3')} is equal to.`, 'A5.4 Q5b', number(9, '9'), 'Put 21 into either fraction. Work out the top, then divide.', checkModel('{2x+3|5} = {x+6|3}', [line('2 × 21 + 3', '45', 0), line('45 ÷ 5', '9', 1)], '9', [['The top', 'Put x = 21 into 2x + 3.'], ['Divide', 'The fraction means divide by 5.']]), response => diagnoseSlips(response, 9, [[45, 'That’s the top. Divide by the bottom: 45 ÷ 5 = 9.'], [27, 'That’s the top of the other fraction. Divide by its bottom: 27 ÷ 3 = 9.'], [21, 'That’s x. Put it into the fraction: (2 × 21 + 3) ÷ 5 = 9.']]))
practice(fractions, `Zac solves ${nb('(x + 1)/2 = (x + 7)/4')} by writing ${nb('x + 1 = x + 7')}. Is Zac correct?`, 'A5.4 Q5c', choose(
  'No: multiply both sides by 4 to get 2(x + 1) = x + 7, so x = 5',
  ['Yes: he removed both fractions', 'The bottoms are different, 2 and 4, so he can’t just drop them. Times both sides by 4: 2(x + 1) = x + 7, so x = 5.'],
  ['No: multiply by 2 to get x + 1 = 2(x + 7)', 'Multiply by 4, which 2 and 4 both go into. 4 ÷ 2 = 2 goes on the left: 2(x + 1) = x + 7.'],
  ['No: it should be x + 1 = 2x + 7', '4 ÷ 2 = 2 multiplies the left top, and all of it: 2(x + 1) = x + 7, so x = 5.'],
), 'The bottoms are 2 and 4. What number do both go into?', solveModel('{x+1|2} = {x+7|4}', 'x', { xl: 2, nl: 2, xr: 1, nr: 7 }, { before: [clear(4, ['{x+1|2} ×4^ = {x+7|~4} ~×4^', '> 4 ÷ 2 = 2', '2(x+1) = x +7'], 'The boxed bottoms, 2 and 4, both go into 4, so multiply both sides by 4. The 4 on the right cancels; on the left, 4 ÷ 2 = 2 is left to multiply the top.'), expand('Multiply out the bracket', ['2×x +2×1 = x +7', '2x +2 = x +7'])] }))

add('mixed', 'Solving equations', 'A5.1-A5.5 consolidation', text(
  'Do the same to both sides, using the opposite operation, until the letter is on its own: 5x − 3 = 27 gives x = 6.',
  'Letter on both sides: take the smaller letter term away from both sides first.',
  'Brackets: multiply out first, every term inside. Fractions: multiply both sides by the number on the bottom.',
  'x² = 49 has two answers, x = 7 or x = −7. For √x = 5, square both sides: x = 25.',
  'Check by putting your answer back in: both sides should come out the same.',
))

export const tutorEquationsLesson: TutorMethodLesson = {
  id: 'L019', number: 19, title: 'Solving equations', level: 'GCSE Foundation',
  goal: 'Solve equations with one unknown, including brackets, fractions, the unknown on both sides and squares.',
  labels: { [one]: 'One unknown', [squares]: 'Squares and roots', [both]: 'Both sides', [brackets]: 'Brackets', [fractions]: 'Fractions', mixed: 'Review' },
  states: finish(),
}
