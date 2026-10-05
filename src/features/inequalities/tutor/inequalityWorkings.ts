import type { EquationRow, MethodStep, NumberLineFrame } from '../../written-methods/tutor/methodWorking'
import type { TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition } from '../../number-types/types'

/*
 * The workings and answer boxes shared by Inequalities (lesson 24, A10) and Solving inequalities (lesson 25, A11):
 * the number line (InequalityPictures.tsx), one move a step, and the A5 board with inequality signs.
 */

export const text = (...lines: string[]) => ({ kind: 'text' as const, lines })
export const tex = (value: string) => value.replace(/[~^[\]]/g, '').replace(/−/g, '-').replace(/≤/g, '\\leq ').replace(/≥/g, '\\geq ').replace(/×/g, '\\times ').replace(/÷/g, '\\div ').replace(/…/g, '\\dots').replace(/°/g, '^{\\circ}').replace(/\{([^|]*)\|([^}]*)\}/g, '\\frac{$1}{$2}')
/** Words stay words in the step chain's maths ("smaller than 3"); maths is converted. */
export const latex = (value: string) => /[a-z]{2,}/i.test(value) ? `\\text{${value.replace(/[{}]/g, '')}}` : tex(value)
/** Keeps an expression on one line in a title, so a phone never breaks it. */
export const nb = (expression: string) => expression.replace(/ /g, '\u00a0')
export const show = (n: number) => String(n).replace('-', '−')
/** The numbers under a number line, evenly spaced. */
export function ticks(from: number, to: number, by = 1) {
  const list: number[] = []
  for (let n = from; n <= to; n += by) list.push(n)
  return list
}

/* ---------- Workings on the number line ---------- */

/**
 * One move a step on the number line. Each step adds one part (`adds`), and its heading goes above it. The frame keeps
 * everything earlier steps added; `at` says which step added each part, so finished parts grey out. `boxed` lasts
 * for one step: the number that step reads or draws.
 */
export type LineMove = { title: string; say: string; equation: string; adds: NumberLineFrame['adds']; change: (frame: NumberLineFrame, step: number) => NumberLineFrame }
export function lineModel(question: string, start: Omit<NumberLineFrame, 'step' | 'adds'>, moves: LineMove[], label = 'Work it out'): TutorWorking {
  let frame: NumberLineFrame = { ...start, step: 0, adds: 'line' }
  const steps: MethodStep[] = moves.map((move, step) => {
    frame = { ...move.change({ ...frame, boxed: undefined }, step), step, adds: move.adds }
    return { title: move.title, operation: latex(question), equation: move.equation, instruction: move.say, frame: { numberLine: frame } }
  })
  return { kind: 'method-worked', examples: [{ method: 'ordering', expression: latex(question), label, first: 0, second: 0, steps, pictureOnly: true, focus: true }] }
}
/** The question's own number line: circles and the arrow or joining line it describes, there from the start. */
export function given(numbers: number[], circles: [number, boolean][], to: number | 'left' | 'right'): Omit<NumberLineFrame, 'step' | 'adds'> {
  return { ticks: numbers, circles: circles.map(([value, closed]) => ({ value, closed, at: -1 })), shade: { from: circles[0][0], to, at: -1 } }
}
/** Moves: a circle, filled (the number is included) or open (it isn't), boxed in purple while it is drawn. */
export const circle = (value: number, closed: boolean, title: string, say: string): LineMove => ({
  title, say, equation: latex(`${show(value)} ${closed ? 'included' : 'not included'}`), adds: 'line',
  change: (frame, step) => ({ ...frame, circles: [...(frame.circles ?? []).filter(c => c.value !== value), { value, closed, at: step }], boxed: [value] }),
})
/** Moves: the arrow off one end of the line, or the line joining two circles. */
export const shade = (from: number, to: number | 'left' | 'right', title: string, say: string): LineMove => ({
  title, say, equation: latex(typeof to === 'number' ? `${show(from)} to ${show(to)}` : `from ${show(from)} ${to}`), adds: 'line',
  change: (frame, step) => ({ ...frame, shade: { from, to, at: step } }),
})
/** Moves: a line of working under the picture (purple: a halfway result), reading the circle at `value`. */
export const lineOf = (lineText: string, title: string, say: string, value?: number): LineMove => ({
  title, say, equation: latex(lineText), adds: 'lines',
  change: (frame, step) => ({ ...frame, lines: [...(frame.lines ?? []), { text: lineText, family: 3, at: step }], boxed: value === undefined ? undefined : [value] }),
})
/** Moves: the whole numbers that fit, as green dots: the answer. */
export const dots = (values: number[], title: string, say: string): LineMove => ({
  title, say, equation: tex(values.map(show).join(',\\ ')), adds: 'line',
  change: (frame, step) => ({ ...frame, dots: { values, at: step } }),
})
/** Moves: the last one, ending in the answer in its green box; `extra` draws something with it, `value` boxes a circle. */
export const answerMove = (answerText: string, title: string, say: string, extra?: LineMove, value?: number): LineMove => ({
  title, say, equation: latex(answerText), adds: 'answer',
  change: (frame, step) => ({ ...(extra ? extra.change(frame, step) : frame), answer: { text: answerText, at: step }, ...(value === undefined ? {} : { boxed: [value] }) }),
})

/* ---------- Workings on the board (EquationPictures.tsx), as in A5, with inequality signs ---------- */

const SIGN = /\s([<>≤≥]|\[[<>≤≥]\])\s/g
/** "4a −5 > a +7" → a row; "3 < 2x +1 < 11" → three parts; "> note" → a note; "! a > 4" → the answer. */
export function boardRow(line: string): EquationRow {
  if (line.startsWith('> ')) return { note: line.slice(2), family: 3 }
  if (line.startsWith('! ')) return { answer: line.slice(2) }
  const parts = line.split(SIGN)
  if (parts.length === 3) return { left: parts[0], sign: parts[1], right: parts[2] }
  if (parts.length === 5) return { left: parts[0], sign: parts[1], middle: parts[2], sign2: parts[3], right: parts[4] }
  throw new Error(`No inequality sign in ${line}`)
}
const rowTex = (line: string) => tex(line.replace(/^[>!] /, ''))
/** One move on the board: its rows, and the part of the row above it works on, boxed in purple. */
export type BoardMove = { title: string; say: string; rows: string[]; mark?: (line: string) => string }
export function boardModel(start: string, moves: BoardMove[], label = 'Solve'): TutorWorking {
  const shownSoFar: string[] = [start]
  const steps: MethodStep[] = moves.map(move => {
    const shown = shownSoFar.map(boardRow)
    if (move.mark) shown[shownSoFar.length - 1] = boardRow(move.mark(shownSoFar.at(-1)!))
    shownSoFar.push(...move.rows)
    const rows = [...shown, ...move.rows.map(boardRow)]
    return { title: move.title, operation: rowTex(start), equation: rowTex(move.rows.at(-1)!), instruction: move.say, frame: { equation: { rows } } }
  })
  return { kind: 'method-worked', examples: [{ method: 'ordering', expression: rowTex(start), label, first: 0, second: 0, steps, pictureOnly: true, focus: true }] }
}
/** Boxes every `token` on a board row (all parts, or only part `only`): "2x +1" → "2x [+1]". */
export const box = (token: string, boxed = `[${token}]`, only?: number) => (line: string) => {
  const parts = line.split(SIGN)
  let found = false
  const next = parts.map((part, i) => {
    if (i % 2 === 1 || (only !== undefined && i !== only * 2)) return part
    const tokens: string[] = part.match(/~?\{[^}]*\}\^?|\S+/g) ?? []
    return tokens.map(t => t === token ? (found = true, boxed) : t).join(' ')
  })
  if (!found) throw new Error(`No ${token} to box in ${line}`)
  return next.map((part, i) => i % 2 === 1 ? ` ${part} ` : part).join('')
}

/* ---------- Answers ---------- */

/** An inequality typed as on paper, "x ☐ ☐" or "☐ ☐ x ☐ ☐": the signs from keys, the numbers in boxes. */
export const inequality = (answer: string): InteractionDefinition => ({ type: 'numericInput', responseShape: 'inequality', acceptanceRule: 'inequality', correctAnswer: answer.replace(/−/g, '-'), displayAnswer: answer })
export const number = (answer: number, shown: string): InteractionDefinition => ({ type: 'numericInput', correctAnswer: answer, displayAnswer: shown, acceptanceRule: 'normalisedNumber' })
/** Whole numbers typed in one box, in any order: one box, so it doesn't give away how many there are. */
export const integers = (answer: number[]): InteractionDefinition => ({ type: 'numericInput', responseShape: 'numbers', acceptanceRule: 'unorderedSet', correctAnswer: answer.map(show).join(', ').replace(/−/g, '-'), displayAnswer: answer.map(show).join(', ') })
/** A choice whose right answer is written first; each wrong option says why it’s wrong. Options are shuffled when shown. */
export const choose = (right: string, ...wrong: [string, string][]): InteractionDefinition => ({
  type: 'select', correctAnswer: '0',
  options: [{ id: '0', label: right }, ...wrong.map(([label, feedback], i) => ({ id: String(i + 1), label, feedback }))],
})
/** The numbers typed in one box, "3, 4, 5" → [3, 4, 5]. */
export const readNumbers = (response: string) => (response.replace(/[−–]/g, '-').match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)
