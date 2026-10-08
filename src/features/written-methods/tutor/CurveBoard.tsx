'use client'

import { useId, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { GraphVisual, UNIT, fmt } from './GraphPictures'
import type { GraphFrame, GraphPoint } from './methodWorking'
import type { GraphBoardSpec } from './GraphBoard'
import { pointsKey, smoothThrough, valueAt } from './curves'

/*
 * The graph board's "plot the table" mode (graphs lesson 6, GR6): every column of the table is a point to plot. Tap a
 * corner to drop a dot; one dot a column, so a second tap in the same column moves it, and tapping a dot lifts it. Once
 * every column has its dot, the board joins them with one smooth curve, the way the book says to finish: a dot in the
 * wrong place shows as a kink. Arrow keys move a ring over the corners and Enter or Space taps.
 *
 * The answer is every point in order across, "x, y, x, y" (pointsKey). After a wrong answer the right curve is drawn
 * green with the points the table gives, and each wrong dot is red.
 */

const same = (a: GraphPoint, b: GraphPoint) => a.x === b.x && a.y === b.y

export function CurveBoard({ spec, result, disabled, onChange }: { spec: GraphBoardSpec; result?: 'correct' | 'incorrect'; disabled?: boolean; onChange?: (value: string) => void }) {
  const { grid } = spec
  const [x0, x1] = grid.x, [y0, y1] = grid.y
  const xs = grid.table?.xs ?? []
  const [dots, setDots] = useState<GraphPoint[]>([])
  const [last, setLast] = useState<GraphPoint | null>(null)
  const [cursor, setCursor] = useState<GraphPoint | null>(null)
  const id = useId()

  const clamp = (p: GraphPoint): GraphPoint => ({ x: Math.min(Math.max(p.x, x0 + 1), x1 - 1), y: Math.min(Math.max(p.y, y0 + 1), y1 - 1) })
  const complete = (list: GraphPoint[]) => list.length === xs.length
  function update(next: GraphPoint[], tapped: GraphPoint | null) {
    setDots(next); setLast(tapped)
    onChange?.(complete(next) ? pointsKey(next) : '')
  }
  function tap(target: GraphPoint) {
    const p = clamp(target)
    if (dots.some(q => same(q, p))) return update(dots.filter(q => !same(q, p)), null)
    update([...dots.filter(q => q.x !== p.x), p], p)
  }
  function corner(event: PointerEvent<SVGSVGElement>): GraphPoint {
    const box = event.currentTarget.getBoundingClientRect()
    return { x: x0 + Math.round((event.clientX - box.left - 0.5) / UNIT), y: y1 - Math.round((event.clientY - box.top - 0.5) / UNIT) }
  }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return
    const from = cursor ?? last ?? clamp({ x: xs[0] ?? 0, y: 0 })
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); return tap(from) }
    const step = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[event.key]
    if (!step) return
    event.preventDefault()
    setCursor(clamp({ x: from.x + step[0], y: from.y + step[1] }))
  }

  const curve = spec.curve
  const right = curve ? xs.map(x => ({ x, y: valueAt(curve, x) })) : []
  const onCurve = (p: GraphPoint) => right.some(q => same(q, p))
  const sorted = [...dots].sort((a, b) => a.x - b.x)
  const joined = complete(dots)
  // The tapped dot's numbers light up on the axes, x amber and y biro blue; its column lights up in the table.
  const marks: NonNullable<GraphFrame['marks']> = last ? [{ axis: 'x', value: last.x, family: 1 }, { axis: 'y', value: last.y, family: 0 }] : []
  const column = last ? xs.indexOf(last.x) : -1
  const frame: GraphFrame = {
    ...grid, step: 0, adds: 'picture', marks,
    ...(grid.table ? { table: { ...grid.table, lit: column >= 0 ? column : undefined } } : {}),
    curves: [...(grid.curves ?? []), ...(result === 'incorrect' && curve && xs.length ? [{ coeffs: curve, from: Math.min(...xs), to: Math.max(...xs), at: -1, answer: true }] : [])],
  }
  const status = (p: GraphPoint) => result === 'correct' ? ' is-right' : result === 'incorrect' ? onCurve(p) ? '' : ' is-wrong' : ''
  const live = joined ? `All ${xs.length} points plotted and joined with a smooth curve` : `${dots.length} of ${xs.length} points${last ? `. The last one is at (${fmt(last.x)}, ${fmt(last.y)})` : ''}`

  return <div className={`graph-board graph-board--points${disabled ? ' is-disabled' : ''}`}>
    <div className="graph-board__surface" tabIndex={disabled ? -1 : 0} role="group" onKeyDown={onKeyDown} onBlur={() => setCursor(null)}
      aria-label={`Plot every point in the table: tap a corner, or move with the arrow keys and press Enter. A grid with x from ${fmt(x0)} to ${fmt(x1)} and y from ${fmt(y0)} to ${fmt(y1)}.`} aria-describedby={`${id}-live`}>
      <GraphVisual frame={frame} live={{
        svg: disabled ? undefined : {
          onPointerDown: event => { event.preventDefault(); setCursor(null); tap(corner(event)) },
          style: { touchAction: 'none', cursor: 'pointer' },
        },
        draw: ({ px, py }) => {
          const at = (p: GraphPoint) => ({ x: px(p.x) + 0.5, y: py(p.y) + 0.5 })
          return <>
            {joined && <path className={`graph-board__join${result === 'correct' ? ' is-right' : ''}`} d={smoothThrough(sorted.map(at))} />}
            {result === 'incorrect' && right.filter(p => !dots.some(q => same(q, p))).map(p => <g key={`r${p.x},${p.y}`} className="graph-board__dot is-answer"><circle cx={at(p).x} cy={at(p).y} r="5" /></g>)}
            {sorted.map(p => <g key={`d${p.x},${p.y}`} className={`graph-board__dot${status(p)}`}><circle cx={at(p).x} cy={at(p).y} r="7" /></g>)}
            {cursor && !disabled && <circle className="graph-board__cursor" cx={at(cursor).x} cy={at(cursor).y} r="11" />}
          </>
        },
      }} />
    </div>
    <p className="sr-only" id={`${id}-live`} aria-live="polite">{live}</p>
    {!disabled && <div className="graph-board__tools">
      <p className="graph-board__note" aria-hidden="true">{joined ? 'Joined with a smooth curve. Tap a dot to move it' : `${dots.length} of ${xs.length} points plotted`}</p>
      {dots.length > 0 && <button type="button" className="graph-board__again" onClick={() => update([], null)}>Start again</button>}
    </div>}
  </div>
}
