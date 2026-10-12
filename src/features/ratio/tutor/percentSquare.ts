import type { PercentFrame } from '../../written-methods/tutor/methodWorking'
import type { TutorWorking } from '../../written-methods/tutor/model'
import { boardModel, type BoardMove } from '../../simultaneous-equations/tutor/boardWorkings'

/*
 * The hundred square above the A5 board (PercentPictures.tsx), shared by Percentages (lesson 32, R3) and Reverse
 * percentages (lesson 33, R4): the whole is 100 squares, so 1% is 1 square. Each move can change the pieces and the note.
 */

export type Piece = PercentFrame['pieces'][number]
export const piece = (size: number, label: string, off?: 'off'): Piece => ({ size, label, ...(off ? { off: true } : {}) })
/** A move on the board, with what it changes on the square: its pieces and the note. */
export type SquareMove = BoardMove & { pieces?: Piece[]; note?: string }

/** The board working with the hundred square drawn above it: it opens on the whole, with no pieces yet. */
export function squareModel(whole: string, moves: SquareMove[], label = 'Work it out'): TutorWorking {
  const model = boardModel([], moves, label)
  if (model.kind !== 'method-worked') throw new Error('A percentage working is a board')
  let pieces: Piece[] = []
  // An increase goes past 100 squares: keep room for the extra columns from the start.
  const most = Math.max(100, ...moves.map(move => (move.pieces ?? []).reduce((sum, p) => sum + p.size, 0)))
  const room = Math.ceil((most - 100) / 10)
  const roomed = room ? { room } : {}
  model.examples[0].steps.forEach((step, i) => {
    const move = moves[i]
    pieces = move.pieces ?? pieces
    step.frame.percent = { whole, pieces, ...roomed, ...(move.note ? { note: move.note } : {}), ...(i === 0 ? { before: { whole, pieces: [], ...roomed } } : {}) }
  })
  return model
}
