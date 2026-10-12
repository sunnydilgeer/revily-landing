import type { PercentFrame } from './methodWorking'

/*
 * The hundred square (lesson 32, R3), like the R3 videos: the whole amount is 100 squares, so each square is 1%. A
 * step shades the squares it is about (1%, then the percentage wanted) row by row, with its value in a pill on the
 * right. One colour only, so nothing needs decoding (Sunny, 8 Oct). The picture is always the same size, so nothing
 * moves from step to step (Sunny).
 */

export const PERCENT_WIDTH = 320
export const PERCENT_HEIGHT = 182
const PAD = 4, CELL = 14.5, SQ = 13
const GRID = 10 * CELL
const PILL_X = PAD + GRID + 14, PILL_H = 28, PILL_ROW = 34
export const PILL_SIZE = 15, NOTE_SIZE = 15
export const MAX_PILLS = 4
/** Text widths at the picture's font sizes, a little generous so nothing touches its neighbour. */
export const textWidth = (text: string, size: number) => [...text].length * size * 0.56
export const percentPillWidth = (text: string) => textWidth(text, PILL_SIZE) + 16
export const PILL_ROOM = PERCENT_WIDTH - PILL_X - PAD
const NOTE_Y = PAD + GRID + 20

/** Which piece each square belongs to, filling row by row; squares past 100 are the increase. */
export function squareOwners(frame: PercentFrame) {
  const owners: (number | undefined)[] = Array(100 + (frame.room ?? 0) * 10).fill(undefined)
  let at = 0
  frame.pieces.forEach((piece, i) => { for (let k = 0; k < piece.size && at < owners.length; k++) owners[at++] = i })
  return owners
}

/** Where square k sits: the first 100 row by row, then the increase down columns to the right. */
function place(k: number) {
  if (k < 100) return { x: PAD + (k % 10) * CELL, y: PAD + Math.floor(k / 10) * CELL }
  const extra = k - 100
  return { x: PAD + GRID + 6 + Math.floor(extra / 10) * CELL, y: PAD + (extra % 10) * CELL }
}

function spoken(frame: PercentFrame) {
  const pieces = frame.pieces.map(piece => piece.label).join(', ')
  return `A hundred square: 100 squares are ${frame.whole}, so each square is 1%.${pieces ? ` ${pieces}.` : ''}${frame.note ? ` ${frame.note}.` : ''}`
}

export function PercentVisual({ frame, plain }: { frame: PercentFrame; plain?: boolean }) {
  const owners = squareOwners(frame)
  const note = plain ? undefined : frame.note
  const shift = frame.room ? frame.room * CELL + 6 : 0
  const width = PERCENT_WIDTH + shift
  return <div className="ns-percent" role="img" aria-label={spoken(frame)}>
    <svg viewBox={`0 0 ${width} ${PERCENT_HEIGHT}`} aria-hidden="true">
      {owners.map((owner, k) => {
        // Squares past 100 are only drawn once a piece reaches them: the opening screen shows just the 100.
        if (k >= 100 && owner === undefined) return null
        const piece = owner === undefined ? undefined : frame.pieces[owner]
        const className = `ns-percent__square${piece ? piece.off ? ' is-off' : ' is-on' : ''}${k >= 100 ? ' is-extra' : ''}`
        return <rect key={k} className={className} {...place(k)} width={SQ} height={SQ} rx="2" />
      })}
      {frame.pieces.map((piece, i) => {
        const y = PAD + i * PILL_ROW, pill = percentPillWidth(piece.label)
        return <g key={i} className={`ns-percent__pill${piece.off ? ' is-off' : ''}`}>
          <rect x={PILL_X + shift} y={y} width={pill} height={PILL_H} rx={PILL_H / 2} />
          <text x={PILL_X + shift + pill / 2} y={y + PILL_H / 2}>{piece.label}</text>
        </g>
      })}
      <text className="ns-percent__note" x={width / 2} y={NOTE_Y}>{note ?? `100 squares = ${frame.whole}`}</text>
    </svg>
  </div>
}
