import type { AngleFrame, EquationRow, MethodStep } from '../../written-methods/tutor/methodWorking'
import type { TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition } from '../../number-types/types'

/*
 * The workings for Simultaneous equations (lesson 27, A12) and Proof (lesson 28, A13): the A5 board
 * (EquationPictures.tsx), one move a step. Simultaneous equations put both equations on the board at the start,
 * labelled ① and ②, as in the A12 videos; a proof writes the left side once and carries on down the = column.
 *
 * A row is written as text: "① 3x +2y = 16" (a labelled equation), "3x −x^ ~+2y ~−2y^ = 16 −8^" (a move: `^` marks
 * the part done to both sides, purple; `~` strikes out what cancels), "= x² +6x +9" (carrying on the left side of the
 * row above), "> ② × 2" (a note across the board, purple) and "! x = 4, y = 2" (the answer, in the green box).
 */

export const text = (...lines: string[]) => ({ kind: 'text' as const, lines })
/** Keeps an expression on one line in a title, so a phone never breaks it. */
export const nb = (expression: string) => expression.replace(/ /g, ' ')

export function boardRow(line: string): EquationRow {
  // "> note" is purple, a move; ">0 note" picks the colour (0 blue: a try, a fact).
  const note = line.match(/^>(\d)? /)
  if (note) return { note: line.slice(note[0].length), family: note[1] === undefined ? 3 : Number(note[1]) }
  if (line.startsWith('! ')) return { answer: line.slice(2) }
  const label = /^[①②] /.test(line) ? line[0] : undefined
  const body = label ? line.slice(2) : line
  if (body.startsWith('= ')) return { left: '', right: body.slice(2) }
  const sign = body.match(/ (=|≡) /)
  if (!sign || sign.index === undefined) throw new Error(`No = sign in ${line}`)
  return { left: body.slice(0, sign.index), right: body.slice(sign.index + 3), ...(sign[1] === '≡' ? { sign: '≡' } : {}), ...(label ? { label } : {}) }
}

/** A row as KaTeX for the step chain: markers and labels gone, words kept as words. */
export function rowTex(line: string) {
  const plain = line.replace(/^(>\d?|!) /, '').replace(/^[①②] /, '').replace(/[~^[\]]/g, '')
  if (/[a-z]{3,}/i.test(plain.replace(/\b(?:[a-z])\b/gi, ''))) return `\\text{${plain.replace(/[{}]/g, '').replace(/£/g, '\\pounds ').replace(/%/g, '\\%').replace(/[①②]/g, m => m === '①' ? '(1)' : '(2)').replace(/✓/g, '}\\checkmark\\text{').replace(/²/g, '}^{2}\\text{')}}`
  return plain.replace(/[①②]/g, m => m === '①' ? '(1)' : '(2)').replace(/≡/g, '\\equiv ').replace(/−/g, '-').replace(/×/g, '\\times ').replace(/÷/g, '\\div ')
    .replace(/£/g, '\\pounds ').replace(/%/g, '\\%').replace(/²/g, '^{2}').replace(/°/g, '^{\\circ}').replace(/✓/g, '\\checkmark').replace(/\{([^|]*)\|([^}]*)\}/g, '\\frac{$1}{$2}')
}

/**
 * One move: its heading, the ⓘ words, and the rows it adds. `marks` box the parts of rows already on the board that
 * this move works on (by index, or from the end with −1), so students see where every number comes from.
 */
export type BoardMove = { title: string; say: string; rows: string[]; marks?: [number, (line: string) => string][]; picture?: AngleFrame }

/** The working, one move a step. `picture` is the question's own angle picture (lesson 28), drawn above the board. */
export function boardModel(given: string[], moves: BoardMove[], label = 'Solve', picture?: AngleFrame): TutorWorking {
  const lines = [...given]
  let drawn = picture
  // A move that only draws on the picture (a parallel line) adds no row: its step chain shows the last row written.
  const opening = given.join(', ') || moves.flatMap(move => move.rows)[0]
  const steps: MethodStep[] = moves.map((move, index) => {
    drawn = move.picture ?? drawn
    const shown = [...lines]
    for (const [at, mark] of move.marks ?? []) {
      const i = at < 0 ? shown.length + at : at
      shown[i] = mark(shown[i])
    }
    lines.push(...move.rows)
    const rows = [...shown, ...move.rows].map(boardRow)
    return { title: move.title, operation: rowTex(opening), equation: rowTex(lines.at(-1) ?? opening), instruction: move.say, frame: { equation: { rows, given: given.length }, ...(drawn ? { angles: index === 0 && picture ? { ...drawn, before: picture } : drawn } : {}) } }
  })
  return { kind: 'method-worked', examples: [{ method: 'ordering', expression: rowTex(opening), label, first: 0, second: 0, steps, pictureOnly: true, focus: true }] }
}

/** Boxes every whole `token` on a row's two sides (not its label): "x +2y = 8" with "+2y" → "x [+2y] = 8". */
export const box = (token: string, boxed = `[${token}]`) => (line: string) => {
  const label = /^[①②] /.test(line) ? line.slice(0, 2) : ''
  let found = false
  const next = line.slice(label.length).split(/( [=≡] )/).map((part, i) => i % 2 ? part
    : (part.match(/~?\{[^}]*\}\^?|\S+/g) ?? []).map(t => t === token ? (found = true, boxed) : t).join(' '))
  if (!found) throw new Error(`No ${token} to box in ${line}`)
  return label + next.join('')
}

/* ---------- Answers ---------- */

export const number = (answer: number, shown: string): InteractionDefinition => ({ type: 'numericInput', correctAnswer: answer, displayAnswer: shown, acceptanceRule: 'normalisedNumber' })
/** Two numbers in order, each with its own label before its box: "x = ☐ and y = ☐". */
export const pair = (labels: [string, string], answer: [number, number], shown: string): InteractionDefinition => ({
  type: 'numericInput', responseShape: 'list', listJoiner: 'and', listLabels: labels, acceptanceRule: 'numberList', correctAnswer: answer.join(', '), displayAnswer: shown,
})
/** An expression, collected: "6x + 9" in any order. */
export const expression = (answer: string): InteractionDefinition => ({ type: 'numericInput', responseShape: 'expression', acceptanceRule: 'collectedExpression', correctAnswer: answer.replace(/−/g, '-'), displayAnswer: answer })
/** A choice whose right answer is written first; each wrong option says why it’s wrong. Options are shuffled when shown. */
export const choose = (right: string, ...wrong: [string, string][]): InteractionDefinition => ({
  type: 'select', correctAnswer: '0',
  options: [{ id: '0', label: right }, ...wrong.map(([label, feedback], i) => ({ id: String(i + 1), label, feedback }))],
})
export const readNumbers = (response: string) => (response.replace(/[−–]/g, '-').match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)
