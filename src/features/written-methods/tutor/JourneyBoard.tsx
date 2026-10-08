'use client'

import { useId, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { GraphVisual, HaloText, UNIT, axisText, fitLabel, squareOf, balanced, useMostAcross } from './GraphPictures'
import type { GraphFrame, GraphPoint } from './methodWorking'
import type { GraphBoardSpec } from './GraphBoard'

/*
 * The graph board's "draw a journey" mode (graphs lesson 7, GR8: distance–time graphs). The journey starts at `start`
 * (home, at the time it sets off). Tap a corner to end a part of the journey there: the board joins the corners in time
 * order with straight lines, so a part going up is moving away, a flat part is stopped and a part going down is coming
 * back. One corner a time: a second tap at the same time moves it, and tapping a corner lifts it. Arrow keys move a
 * ring over the corners and Enter or Space taps.
 *
 * On the play screen (no `journey`) each part shows its speed, distance ÷ time. The answer is the journey's corners in
 * time order, "t, d, t, d", with any corner in the middle of a straight part left out (journeyKey), so tapping an extra
 * point along a straight part doesn't make it wrong. After a wrong answer the right journey is drawn green.
 */

const same = (a: GraphPoint, b: GraphPoint) => Math.abs(a.x - b.x) < 1e-9 && Math.abs(a.y - b.y) < 1e-9
/** The corners where the journey changes: a corner on a straight line between its neighbours is left out. */
export function corners(start: GraphPoint, points: GraphPoint[]) {
  const all = [start, ...[...points].sort((a, b) => a.x - b.x)]
  return all.filter((p, i) => {
    if (i === 0) return false
    const a = all[i - 1], b = all[i + 1]
    return !b || Math.abs((p.y - a.y) * (b.x - p.x) - (b.y - p.y) * (p.x - a.x)) > 1e-9
  })
}
export const journeyKey = (start: GraphPoint, points: GraphPoint[]) => corners(start, points).map(p => `${Math.round(p.x * 1000) / 1000}, ${p.y}`).join(', ')
/** A part's speed, in the graph's units an hour (the time axis is in hours). */
export const speedOf = (a: GraphPoint, b: GraphPoint) => Math.abs(b.y - a.y) / (b.x - a.x)

export function JourneyBoard({ spec, result, disabled, onChange }: { spec: GraphBoardSpec; result?: 'correct' | 'incorrect'; disabled?: boolean; onChange?: (value: string) => void }) {
  const { ref: roomRef, most } = useMostAcross<HTMLDivElement>()
  const grid = balanced(spec.grid, most)
  const scale = grid.scale!
  const [x0, x1] = grid.x, [, y1] = grid.y
  const per = { x: scale.x.per, y: scale.y.per }
  const start = spec.start ?? { x: scale.x.start, y: scale.y.start }
  const play = !spec.journey
  const [taps, setTaps] = useState<GraphPoint[]>([])
  const [cursor, setCursor] = useState<GraphPoint | null>(null)
  const id = useId()

  // A corner is later than the start, inside the grid, and not below the time axis (no distance is negative).
  const clamp = (p: GraphPoint): GraphPoint => ({ x: Math.min(Math.max(p.x, start.x + per.x), x1 - per.x), y: Math.min(Math.max(p.y, scale.y.start), y1 - per.y) })
  function update(next: GraphPoint[]) {
    setTaps(next)
    onChange?.(next.length ? journeyKey(start, next) : '')
  }
  function tap(target: GraphPoint) {
    const p = clamp(target)
    if (taps.some(q => same(q, p))) return update(taps.filter(q => !same(q, p)))
    update([...taps.filter(q => Math.abs(q.x - p.x) > 1e-9), p])
  }
  function corner(event: PointerEvent<SVGSVGElement>): GraphPoint {
    const box = event.currentTarget.getBoundingClientRect(), square = squareOf(event.currentTarget, box)
    return { x: x0 + Math.round((event.clientX - box.left - 0.5) / square) * per.x, y: y1 - Math.round((event.clientY - box.top - 0.5) / square) * per.y }
  }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return
    const sorted = [...taps].sort((a, b) => a.x - b.x)
    const from = cursor ?? sorted[sorted.length - 1] ?? clamp({ x: start.x + per.x, y: start.y })
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); return tap(from) }
    const step = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[event.key]
    if (!step) return
    event.preventDefault()
    setCursor(clamp({ x: from.x + step[0] * per.x, y: from.y + step[1] * per.y }))
  }

  const path = [start, ...[...taps].sort((a, b) => a.x - b.x)]
  const right = spec.journey ? [start, ...spec.journey] : []
  const lines: NonNullable<GraphFrame['lines']> = [...(grid.lines ?? [])]
  path.slice(1).forEach((p, i) => lines.push({ from: path[i], to: p, at: 0, segment: true, answer: result === 'correct', wrong: result === 'incorrect' }))
  if (result === 'incorrect') right.slice(1).forEach((p, i) => lines.push({ from: right[i], to: p, at: 0, segment: true, answer: true }))
  const last = path.length > 1 ? path[path.length - 1] : null
  const marks: NonNullable<GraphFrame['marks']> = last ? [{ axis: 'x', value: last.x, family: 1 }, { axis: 'y', value: last.y, family: 0 }] : []
  const frame: GraphFrame = {
    ...grid, step: 0, adds: 'picture', marks, lines,
    points: [...(grid.points ?? []), { ...start, at: -1, label: '' }, ...taps.map(p => ({ ...p, at: 0, label: '' }))],
  }
  const unit = scale.y.name.replace(/^.*\((.*)\)$/, '$1')
  const speedText = (a: GraphPoint, b: GraphPoint) => a.y === b.y ? 'stopped' : `${Math.round(speedOf(a, b) * 100) / 100} ${unit}/h`
  const live = path.length > 1 ? `${path.length - 1} part${path.length > 2 ? 's' : ''}. The last ends at ${axisText(scale.x, last!.x)}, ${axisText(scale.y, last!.y)} ${unit}` : 'No parts yet'

  return <div ref={roomRef} className={`graph-board graph-board--journey${disabled ? ' is-disabled' : ''}`}>
    <div className="graph-board__surface" tabIndex={disabled ? -1 : 0} role="group" onKeyDown={onKeyDown} onBlur={() => setCursor(null)}
      aria-label={`Draw the journey: tap where each part ends, or move with the arrow keys and press Enter. ${scale.y.name} up, ${scale.x.name} across.`} aria-describedby={`${id}-live`}>
      <GraphVisual frame={frame} mostAcross={most} live={{
        svg: disabled ? undefined : {
          onPointerDown: event => { event.preventDefault(); setCursor(null); tap(corner(event)) },
          style: { touchAction: 'none', cursor: 'pointer' },
        },
        draw: ({ px, py, room }) => <>
          {/* The play screen: each part's speed beside it, clear of the axes and other labels. */}
          {play && path.slice(1).map((p, i) => {
            const a = path[i], text = speedText(a, p), w = text.length * 8 + 6
            const mx = (px(a.x) + px(p.x)) / 2 + 0.5, my = (py(a.y) + py(p.y)) / 2 + 0.5
            const box = (l: number, base: number) => ({ l, r: l + w, t: base - 14, b: base + 4, base })
            const spot = fitLabel([box(mx - w / 2, my - 10), box(mx - w / 2, my + 24), box(mx + 10, my + 5), box(mx - 10 - w, my + 5)], room, true)
            return spot && <HaloText key={`s${i}`} className="graph-board__speed" x={spot.l + 2} y={spot.base}>{text}</HaloText>
          })}
          {cursor && !disabled && <circle className="graph-board__cursor" cx={px(cursor.x) + 0.5} cy={py(cursor.y) + 0.5} r="11" />}
        </>,
      }} />
    </div>
    <p className="sr-only" id={`${id}-live`} aria-live="polite">{live}</p>
    {!disabled && <div className="graph-board__tools">
      <p className="graph-board__note" aria-hidden="true">{taps.length ? 'Tap where the next part ends. Tap a corner to lift it' : 'Tap where the first part ends'}</p>
      {taps.length > 0 && <button type="button" className="graph-board__again" onClick={() => update([])}>Start again</button>}
    </div>}
  </div>
}
