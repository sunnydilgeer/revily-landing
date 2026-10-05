/*
 * BIDMAS workings as a board, the way a teacher writes them (src/features/EXPLANATIONS.md): the expression is rewritten
 * one move at a time. Each step boxes, in purple, the part it works out next, then writes the new expression underneath
 * with that part's value in blue. A power opens into its copies ("4 × 4") on its own line. The last row is the answer,
 * in green, and the working stops there.
 *
 * Rows are plain text. " | " splits a fraction into its top and bottom; [..] is boxed; {..} is the new value.
 */

export type BoardStep = {
  title: string
  instruction: string
  /** The previous row with the part this step works out boxed, and the row it becomes. */
  mark: string
  next: string
  /** Lines between the two rows that show where the value comes from ("4 × 4 → 16"). */
  notes?: string[]
  /** A second expression starts here (its first row is `mark`, plain rows above are cleared). */
  fresh?: boolean
  /** The answer in words, when the question asks for a reason rather than a value. */
  words?: string
}
export type BoardWorking = { kind: 'board'; start: string; prefix?: string; steps: BoardStep[] }

const strip = (row: string) => row.replace(/[[\]{}]/g, '')
/** A step's rows from the part it works out: the part is found in `where` (the top or bottom of a fraction), or anywhere. */
export type Move = { title: string; instruction: string; part: string; value: string; notes?: string[]; where?: 'top' | 'bottom'; words?: string }
export type Fresh = { title: string; instruction: string; start: string; fresh: true; words?: string }

function replaceIn(row: string, part: string, by: string, where?: 'top' | 'bottom') {
  if (!where) {
    if (!row.includes(part)) throw new Error(`"${part}" is not in "${row}"`)
    return row.replace(part, by)
  }
  const [top, bottom] = row.split(' | ')
  const side = where === 'top' ? top : bottom
  if (!side.includes(part)) throw new Error(`"${part}" is not in the ${where} of "${row}"`)
  const changed = side.replace(part, by)
  return where === 'top' ? `${changed} | ${bottom}` : `${top} | ${changed}`
}

/** A board from the first row and the moves: each move boxes its part in the row so far and replaces it by its value. */
export function board(start: string, moves: Array<Move | Fresh>, prefix?: string): BoardWorking {
  let row = start
  const steps: BoardStep[] = moves.map(move => {
    if ('fresh' in move) {
      row = move.start
      return { title: move.title, instruction: move.instruction, mark: move.start, next: move.start, fresh: true, words: move.words }
    }
    const mark = replaceIn(row, move.part, `[${move.part}]`, move.where)
    const next = replaceIn(row, move.part, `{${move.value}}`, move.where)
    row = strip(next)
    return { title: move.title, instruction: move.instruction, mark, next, notes: move.notes, words: move.words }
  })
  return { kind: 'board', start, prefix, steps }
}

export const plainRow = strip
