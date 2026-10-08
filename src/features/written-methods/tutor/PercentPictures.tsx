import type { PercentFrame } from './methodWorking'

/*
 * The hundred square (lesson 32, R3), like the R3 videos: the whole amount is 100 squares, so each square is 1%. The
 * pieces a percentage is broken into (10%, 5%, 1%) fill the squares in order, row by row, each with its pill on the
 * right: 10% pieces blue, 5% teal, 1% amber, and the piece being worked on in purple. A green piece is the answer
 * (what is left after a decrease). The picture is always the same size, so nothing moves from step to step (Sunny).
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

/** A piece's colour: 10% blue, 5% teal, 1% amber, unless it says otherwise. */
const tone = (piece: PercentFrame['pieces'][number]) => piece.tone ?? (piece.size >= 10 ? 'b1' : piece.size === 5 ? 'b2' : 'b0')

/** Which piece each of the 100 squares belongs to, filling row by row. */
export function squareOwners(frame: PercentFrame) {
  const owners: (number | undefined)[] = Array(100).fill(undefined)
  let at = 0
  frame.pieces.forEach((piece, i) => { for (let k = 0; k < piece.size && at < 100; k++) owners[at++] = i })
  return owners
}

function spoken(frame: PercentFrame) {
  const pieces = frame.pieces.map(piece => piece.label).join(', ')
  return `A hundred square: 100 squares are ${frame.whole}, so each square is 1%.${pieces ? ` ${pieces}.` : ''}${frame.note ? ` ${frame.note}.` : ''}`
}

export function PercentVisual({ frame, plain }: { frame: PercentFrame; plain?: boolean }) {
  const owners = squareOwners(frame)
  const lit = plain ? [] : frame.lit ?? []
  const note = plain ? undefined : frame.note
  return <div className="ns-percent" role="img" aria-label={spoken(frame)}>
    <svg viewBox={`0 0 ${PERCENT_WIDTH} ${PERCENT_HEIGHT}`} aria-hidden="true">
      {owners.map((owner, k) => {
        const piece = owner === undefined ? undefined : frame.pieces[owner]
        const className = `ns-percent__square${piece ? ` is-${lit.includes(owner!) ? 'lit' : tone(piece)}` : ''}`
        return <rect key={k} className={className} x={PAD + (k % 10) * CELL} y={PAD + Math.floor(k / 10) * CELL} width={SQ} height={SQ} rx="2" />
      })}
      {frame.pieces.map((piece, i) => {
        const y = PAD + i * PILL_ROW, width = percentPillWidth(piece.label)
        return <g key={i} className={`ns-percent__pill is-${lit.includes(i) ? 'lit' : tone(piece)}`}>
          <rect x={PILL_X} y={y} width={width} height={PILL_H} rx={PILL_H / 2} />
          <text x={PILL_X + width / 2} y={y + PILL_H / 2}>{piece.label}</text>
        </g>
      })}
      <text className={`ns-percent__note${note ? ' is-lit' : ''}`} x={PERCENT_WIDTH / 2} y={NOTE_Y}>{note ?? `100 squares = ${frame.whole}`}</text>
    </svg>
  </div>
}
