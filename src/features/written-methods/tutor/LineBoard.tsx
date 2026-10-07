'use client'

import { useId, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { GraphVisual, UNIT, fmt } from './GraphPictures'
import type { GraphFrame, GraphPoint } from './methodWorking'
import type { GraphBoardSpec } from './GraphBoard'

/*
 * The graph board's "draw a line" mode (graphs lesson 2): tap two corners and a straight line runs through them, edge
 * to edge. A line across or up and down is named on the grid (y = 3, x = −2). Tapping a dot again lifts it; a third
 * tap moves the nearer dot. Arrow keys move a ring over the corners and Enter or Space taps.
 *
 * The answer is the line itself, written so that every pair of points on it gives the same three numbers: a, b, c in
 * ax + by = c, with no common factor and a or b positive first (lineKey). So any two points on y = 2x − 1 are right.
 */

const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b)
/** The line through p and q as "a, b, c" in ax + by = c: the same three numbers for any two points on it. */
export function lineKey(p: GraphPoint, q: GraphPoint) {
  let a = q.y - p.y, b = p.x - q.x, c = a * p.x + b * p.y
  const g = gcd(gcd(a, b), c) || 1
  a /= g; b /= g; c /= g
  if (a < 0 || (a === 0 && b < 0)) { a = -a; b = -b; c = -c }
  return `${a + 0}, ${b + 0}, ${c + 0}`
}
/** A line's name when it runs across (y = 3) or up and down (x = −2). */
export const lineName = (p: GraphPoint, q: GraphPoint) => p.y === q.y ? `y = ${fmt(p.y)}` : p.x === q.x ? `x = ${fmt(p.x)}` : undefined

const same = (a: GraphPoint, b: GraphPoint) => a.x === b.x && a.y === b.y

export function LineBoard({ spec, result, disabled, onChange }: { spec: GraphBoardSpec; result?: 'correct' | 'incorrect'; disabled?: boolean; onChange?: (value: string) => void }) {
  const { grid } = spec
  const [x0, x1] = grid.x, [y0, y1] = grid.y
  const play = !spec.line
  const [taps, setTaps] = useState<GraphPoint[]>([])
  const [cursor, setCursor] = useState<GraphPoint | null>(null)
  const id = useId()

  const clamp = (p: GraphPoint): GraphPoint => ({ x: Math.min(Math.max(p.x, x0 + 1), x1 - 1), y: Math.min(Math.max(p.y, y0 + 1), y1 - 1) })
  function update(next: GraphPoint[]) {
    setTaps(next)
    onChange?.(next.length === 2 ? lineKey(next[0], next[1]) : '')
  }
  function tap(target: GraphPoint) {
    const p = clamp(target)
    const hit = taps.findIndex(q => same(q, p))
    if (hit >= 0) return update(taps.filter((_, i) => i !== hit))
    if (taps.length < 2) return update([...taps, p])
    const far = (q: GraphPoint) => Math.hypot(q.x - p.x, q.y - p.y)
    update(far(taps[0]) <= far(taps[1]) ? [p, taps[1]] : [taps[0], p])
  }
  function corner(event: PointerEvent<SVGSVGElement>): GraphPoint {
    const box = event.currentTarget.getBoundingClientRect()
    return { x: x0 + Math.round((event.clientX - box.left - 0.5) / UNIT), y: y1 - Math.round((event.clientY - box.top - 0.5) / UNIT) }
  }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return
    const from = cursor ?? taps[taps.length - 1] ?? clamp({ x: 0, y: 0 })
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); return tap(from) }
    const step = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[event.key]
    if (!step) return
    event.preventDefault()
    setCursor(clamp({ x: from.x + step[0], y: from.y + step[1] }))
  }

  const drawn = taps.length === 2 ? { from: taps[0], to: taps[1] } : null
  const right = spec.line
  const lines: NonNullable<GraphFrame['lines']> = [...(grid.lines ?? [])]
  if (drawn) lines.push({ ...drawn, label: lineName(drawn.from, drawn.to), at: 0, answer: result === 'correct', wrong: result === 'incorrect' })
  if (result === 'incorrect' && right) lines.push({ from: right[0], to: right[1], label: lineName(right[0], right[1]), at: 0, answer: true })
  // The tapped corners' numbers light up on the axes, x amber and y biro blue, as on the rest of the board.
  const marks: NonNullable<GraphFrame['marks']> = []
  for (const p of taps) {
    if (!marks.some(m => m.axis === 'x' && m.value === p.x)) marks.push({ axis: 'x', value: p.x, family: 1 })
    if (!marks.some(m => m.axis === 'y' && m.value === p.y)) marks.push({ axis: 'y', value: p.y, family: 0 })
  }
  const frame: GraphFrame = {
    ...grid, step: 0, adds: 'picture', marks, lines,
    points: [...(grid.points ?? []), ...taps.map(p => ({ ...p, at: 0, label: play ? undefined : '' }))],
  }
  const status = result === 'correct' ? 'is-right' : result === 'incorrect' ? 'is-wrong' : ''
  const live = drawn ? `A line through (${fmt(drawn.from.x)}, ${fmt(drawn.from.y)}) and (${fmt(drawn.to.x)}, ${fmt(drawn.to.y)})${lineName(drawn.from, drawn.to) ? `: ${lineName(drawn.from, drawn.to)}` : ''}` : `${taps.length} of 2 points`

  return <div className={`graph-board graph-board--line${disabled ? ' is-disabled' : ''}${status ? ` ${status}` : ''}`}>
    <div className="graph-board__surface" tabIndex={disabled ? -1 : 0} role="group" onKeyDown={onKeyDown} onBlur={() => setCursor(null)}
      aria-label={`Tap two points to draw a line through them: arrow keys move, Enter taps. A grid with x from ${fmt(x0)} to ${fmt(x1)} and y from ${fmt(y0)} to ${fmt(y1)}.`} aria-describedby={`${id}-live`}>
      <GraphVisual frame={frame} live={{
        svg: disabled ? undefined : {
          onPointerDown: event => { event.preventDefault(); setCursor(null); tap(corner(event)) },
          style: { touchAction: 'none', cursor: 'pointer' },
        },
        draw: ({ px, py }) => cursor && !disabled ? <circle className="graph-board__cursor" cx={px(cursor.x) + 0.5} cy={py(cursor.y) + 0.5} r="11" /> : null,
      }} />
    </div>
    <p className="sr-only" id={`${id}-live`} aria-live="polite">{live}</p>
    {!disabled && <div className="graph-board__tools">
      <p className="graph-board__note" aria-hidden="true">{taps.length === 2 ? 'Tap again to move a point' : taps.length === 1 ? 'Now tap a second point' : 'Tap two points to draw a line'}</p>
      {taps.length > 0 && <button type="button" className="graph-board__again" onClick={() => update([])}>Start again</button>}
    </div>}
  </div>
}
