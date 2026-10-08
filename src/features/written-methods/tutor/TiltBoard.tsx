'use client'

import { useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { GraphVisual, UNIT, fmt, balanced, useMostAcross } from './GraphPictures'
import type { GraphFrame, GraphPoint } from './methodWorking'
import type { GraphBoardSpec } from './GraphBoard'

/*
 * The graph board's "tilt a line" mode (graphs lesson 3, Gradient): a line through two dots, either of which can be
 * dragged (or moved with the arrow keys; Enter swaps which). A live triangle counts the gradient the way the lesson
 * does, across first, then up: from the left dot an amber arrow across, then a biro blue arrow up (or down) to the
 * other dot. Under it the gradient is worked out live, "up 6, across 2: 6 ÷ 2 = 3", and its value goes green.
 *
 * With a `target` it is a question: tilt until the gradient is that number. The answer sent is "up/across" (6/2),
 * which the gradient check reads as a fraction. Without one it is a play screen. `subtract` (from two points) shows
 * the subtractions instead of the counts, with each dot's coordinates beside it.
 */

const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b)
/** A gradient as the lesson writes it: 3, −2, 1/2, −3/4. */
export function fractionText(up: number, across: number) {
  if (across < 0) { up = -up; across = -across }
  const g = gcd(up, across) || 1
  const [n, d] = [up / g, across / g]
  return d === 1 ? fmt(n) : `${n < 0 ? '−' : ''}${Math.abs(n)}/${d}`
}
const same = (a: GraphPoint, b: GraphPoint) => a.x === b.x && a.y === b.y

export function TiltBoard({ spec, result, disabled, onChange }: { spec: GraphBoardSpec; result?: 'correct' | 'incorrect'; disabled?: boolean; onChange?: (value: string) => void }) {
  const { ref: roomRef, most } = useMostAcross<HTMLDivElement>()
  const grid = balanced(spec.grid, most)
  const [x0, x1] = grid.x, [y0, y1] = grid.y
  const [ends, setEnds] = useState<[GraphPoint, GraphPoint]>(spec.ends ?? [{ x: 0, y: 0 }, { x: 2, y: 2 }])
  const [active, setActive] = useState<0 | 1>(1)
  const [held, setHeld] = useState(false)
  const pressed = useRef<0 | 1 | null>(null)
  const id = useId()

  const clamp = (p: GraphPoint): GraphPoint => ({ x: Math.min(Math.max(p.x, x0 + 1), x1 - 1), y: Math.min(Math.max(p.y, y0 + 1), y1 - 1) })
  function move(which: 0 | 1, target: GraphPoint) {
    const p = clamp(target), other = ends[1 - which]
    if (same(p, other) || same(p, ends[which])) return
    const next: [GraphPoint, GraphPoint] = which === 0 ? [p, other] : [other, p]
    setEnds(next)
    const [l, r] = next[0].x <= next[1].x ? next : [next[1], next[0]]
    onChange?.(r.x === l.x ? '' : `${r.y - l.y}/${r.x - l.x}`)
  }
  function corner(event: PointerEvent<SVGSVGElement>): GraphPoint {
    const box = event.currentTarget.getBoundingClientRect()
    return { x: x0 + Math.round((event.clientX - box.left - 0.5) / UNIT), y: y1 - Math.round((event.clientY - box.top - 0.5) / UNIT) }
  }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); return setActive(active === 0 ? 1 : 0) }
    const step = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[event.key]
    if (!step) return
    event.preventDefault()
    move(active, { x: ends[active].x + step[0], y: ends[active].y + step[1] })
  }

  const [l, r] = ends[0].x <= ends[1].x ? ends : [ends[1], ends[0]]
  const across = r.x - l.x, up = r.y - l.y
  const corner3 = { x: r.x, y: l.y }
  const target = spec.target
  const status = result === 'correct' ? ' is-right' : result === 'incorrect' ? ' is-wrong' : ''
  // A wrong answer shows a right line, green, through the left dot.
  const right = result === 'incorrect' && target !== undefined ? [{ from: l, to: { x: l.x + 1, y: l.y + target }, at: 0, answer: true }] : []
  const frame: GraphFrame = {
    ...grid, step: 0, adds: 'picture',
    lines: [...(grid.lines ?? []), { from: l, to: r, at: 0, answer: result === 'correct', wrong: result === 'incorrect' }, ...right],
    marks: [
      ...[...new Set([l.x, r.x])].map(value => ({ axis: 'x' as const, value, family: 1 })),
      ...[...new Set([l.y, r.y])].map(value => ({ axis: 'y' as const, value, family: 0 })),
    ],
    points: spec.subtract ? [{ ...l, at: 0 }, { ...r, at: 0 }] : [],
  }

  const X = (n: number | string) => <span className="is-x">{typeof n === 'number' ? fmt(n) : n}</span>
  const Y = (n: number | string) => <span className="is-y">{typeof n === 'number' ? fmt(n) : n}</span>
  const bracket = (n: number) => n < 0 ? `(${fmt(n)})` : fmt(n)
  let readout: ReactNode
  if (across === 0) readout = 'Straight up and down: no gradient'
  else if (spec.subtract) readout = <>({Y(r.y)} − {Y(bracket(l.y))}) ÷ ({X(r.x)} − {X(bracket(l.x))}) = {Y(up)} ÷ {X(across)} = <b className="graph-board__gradient">{fractionText(up, across)}</b></>
  else if (up === 0) readout = <>Flat: up {Y(0)}, so the gradient is <b className="graph-board__gradient">0</b></>
  else readout = <>{up > 0 ? 'up' : 'down'} {Y(Math.abs(up))}, across {X(across)}: {Y(up)} ÷ {X(across)} = <b className="graph-board__gradient">{fractionText(up, across)}</b></>
  const live = across === 0 ? 'The line is straight up and down.' : `Across ${across}, ${up >= 0 ? 'up' : 'down'} ${Math.abs(up)}: gradient ${fractionText(up, across).replace('−', 'minus ')}`

  return <div ref={roomRef} className={`graph-board graph-board--tilt${held ? ' is-held' : ''}${disabled ? ' is-disabled' : ''}`}>
    <div className="graph-board__surface" tabIndex={disabled ? -1 : 0} role="group" onKeyDown={onKeyDown}
      aria-label={`A line through two dots. Arrow keys move a dot; Enter switches dot. A grid with x from ${fmt(x0)} to ${fmt(x1)} and y from ${fmt(y0)} to ${fmt(y1)}.`} aria-describedby={`${id}-live`}>
      <GraphVisual frame={frame} mostAcross={most} live={{
        svg: disabled ? undefined : {
          onPointerDown: event => {
            event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId)
            const p = corner(event), far = (q: GraphPoint) => Math.hypot(q.x - p.x, q.y - p.y)
            const which = far(ends[0]) <= far(ends[1]) ? 0 : 1
            pressed.current = which; setActive(which); setHeld(true); move(which, p)
          },
          onPointerMove: event => { if (pressed.current !== null) move(pressed.current, corner(event)) },
          onPointerUp: () => { pressed.current = null; setHeld(false) },
          onPointerCancel: () => { pressed.current = null; setHeld(false) },
          style: { touchAction: 'none', cursor: 'pointer' },
        },
        draw: ({ px, py }) => {
          const at = (p: GraphPoint) => ({ x: px(p.x) + 0.5, y: py(p.y) + 0.5 })
          const arrow = (from: GraphPoint, to: GraphPoint, family: number, key: string) => {
            if (same(from, to)) return null
            const a = at(from), b = at(to), isAcross = from.y === to.y
            const dir = isAcross ? Math.sign(b.x - a.x) : Math.sign(b.y - a.y)
            // The up arrow stops short of the dot it ends at, so its head shows.
            const end = isAcross ? b : { x: b.x, y: b.y - dir * 9 }
            const head = isAcross ? `M${end.x - dir * 8} ${end.y - 6} L${end.x} ${end.y} L${end.x - dir * 8} ${end.y + 6}` : `M${end.x - 6} ${end.y - dir * 8} L${end.x} ${end.y} L${end.x + 6} ${end.y - dir * 8}`
            return <g key={key} className={`ns-graph__leg is-f${family}`}><line x1={a.x} y1={a.y} x2={end.x} y2={end.y} /><path d={head} /></g>
          }
          return <>
            {across !== 0 && arrow(l, corner3, 1, 'across')}
            {across !== 0 && arrow(corner3, r, 0, 'up')}
            {ends.map((p, i) => <g key={i} className={`graph-board__dot${status}`}>
              {!disabled && <circle className="graph-board__halo" cx={at(p).x} cy={at(p).y} r={active === i ? 16 : 13} />}
              <circle cx={at(p).x} cy={at(p).y} r="7" />
            </g>)}
          </>
        },
      }} />
    </div>
    <p className="sr-only" id={`${id}-live`} aria-live="polite">{live}</p>
    <p className="graph-board__note graph-board__sum" aria-hidden="true">{readout}</p>
  </div>
}
