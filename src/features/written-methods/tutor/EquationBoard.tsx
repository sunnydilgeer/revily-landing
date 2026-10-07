'use client'

import { useId, useState, type ReactNode } from 'react'
import { GraphVisual, fmt } from './GraphPictures'
import type { GraphFrame, GraphPoint } from './methodWorking'
import type { GraphBoardSpec } from './GraphBoard'
import { fractionText } from './TiltBoard'

/*
 * The graph board's "y = mx + c" mode (graphs lesson 3, GR2): two steppers, one for m and one for c, and the line
 * moves as they change. c is where it crosses the y axis: its number there is lit biro blue, as any y is. m is the
 * gradient: from there a little triangle goes across (amber), then up or down (blue), by m for every
 * one across (by m × 2 for every 2 across when m is a half). The equation is written under the grid, live. No dot
 * where it crosses: c's number lit on the y axis marks the spot, and a dot would sit on top of it.
 *
 * With an `equation` it is a question: make the line y = 2x − 3. The answer sent is "m, c" (2, −3), checked as a
 * list of numbers. Without one it is a play screen.
 */

const M_VALUES = [-3, -2, -1, -0.5, 0, 0.5, 1, 2, 3]
const same = (a: GraphPoint, b: GraphPoint) => a.x === b.x && a.y === b.y

/** y = 2x − 3, y = −½x + 1, y = x, y = 4: the way the lesson writes it. */
export function equationText(m: number, c: number) {
  const mx = m === 0 ? '' : m === 1 ? 'x' : m === -1 ? '−x' : Number.isInteger(m) ? `${fmt(m)}x` : `${m < 0 ? '−' : ''}½x`
  const cc = c === 0 ? (mx ? '' : '0') : !mx ? fmt(c) : c < 0 ? ` − ${fmt(-c)}` : ` + ${fmt(c)}`
  return `y = ${mx}${cc}`
}

function Stepper({ name, value, onDown, onUp, disabled, className }: { name: string; value: ReactNode; onDown: () => void; onUp: () => void; disabled?: boolean; className: string }) {
  return <div className={`graph-board__stepper ${className}`} role="group" aria-label={name}>
    <button type="button" onClick={onDown} disabled={disabled} aria-label={`${name} down`}>−</button>
    <span className="graph-board__stepper-value"><i>{name}</i> = {value}</span>
    <button type="button" onClick={onUp} disabled={disabled} aria-label={`${name} up`}>+</button>
  </div>
}

export function EquationBoard({ spec, result, disabled, onChange }: { spec: GraphBoardSpec; result?: 'correct' | 'incorrect'; disabled?: boolean; onChange?: (value: string) => void }) {
  const { grid } = spec
  const [y0, y1] = grid.y
  const startM = spec.rule?.m ?? 1, startC = spec.rule?.c ?? 0
  const [mi, setMi] = useState(Math.max(0, M_VALUES.indexOf(startM)))
  const [c, setC] = useState(startC)
  const id = useId()
  const m = M_VALUES[mi]

  function set(nextMi: number, nextC: number) {
    const i = Math.min(Math.max(nextMi, 0), M_VALUES.length - 1), k = Math.min(Math.max(nextC, y0 + 1), y1 - 1)
    setMi(i); setC(k)
    onChange?.(`${M_VALUES[i]}, ${k}`)
  }

  const target = spec.equation
  const intercept = { x: 0, y: c }
  // The triangle from the y axis: across 1 (2 for a half), then up or down to the line.
  const step = Number.isInteger(m) ? 1 : 2
  const corner = { x: step, y: c }, onLine = { x: step, y: c + m * step }
  const right = result === 'incorrect' && target ? [{ from: { x: 0, y: target.c }, to: { x: 1, y: target.c + target.m }, at: 0, answer: true }] : []
  const frame: GraphFrame = {
    ...grid, step: 0, adds: 'picture',
    lines: [...(grid.lines ?? []), { from: intercept, to: { x: 1, y: c + m }, at: 0, answer: result === 'correct', wrong: result === 'incorrect' }, ...right],
    marks: [{ axis: 'y', value: c, family: 0 }],
    points: [],
  }
  const live = `${equationText(m, c)}: gradient ${fractionText(m * step, step).replace('−', 'minus ')}, crosses the y axis at ${fmt(c)}`

  return <div className={`graph-board graph-board--equation${disabled ? ' is-disabled' : ''}`}>
    <div className="graph-board__surface" role="group" aria-label={`The line ${live}. A grid with x from ${fmt(grid.x[0])} to ${fmt(grid.x[1])} and y from ${fmt(y0)} to ${fmt(y1)}.`}>
      <GraphVisual frame={frame} live={{
        draw: ({ px, py }) => {
          const at = (p: GraphPoint) => ({ x: px(p.x) + 0.5, y: py(p.y) + 0.5 })
          const arrow = (from: GraphPoint, to: GraphPoint, family: number, key: string) => {
            if (same(from, to)) return null
            const a = at(from), b = at(to), isAcross = from.y === to.y
            const dir = isAcross ? Math.sign(b.x - a.x) : Math.sign(b.y - a.y)
            const head = isAcross ? `M${b.x - dir * 8} ${b.y - 6} L${b.x} ${b.y} L${b.x - dir * 8} ${b.y + 6}` : `M${b.x - 6} ${b.y - dir * 8} L${b.x} ${b.y} L${b.x + 6} ${b.y - dir * 8}`
            return <g key={key} className={`ns-graph__leg is-f${family}`}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} /><path d={head} /></g>
          }
          const fits = onLine.y > y0 && onLine.y < y1
          return <>
            {m !== 0 && fits && arrow(intercept, corner, 1, 'across')}
            {m !== 0 && fits && arrow(corner, onLine, 0, 'up')}
          </>
        },
      }} />
    </div>
    <div className="graph-board__tools">
      <Stepper name="m" className="is-m" value={<b className="graph-board__gradient">{fractionText(m * step, step)}</b>} disabled={disabled} onDown={() => set(mi - 1, c)} onUp={() => set(mi + 1, c)} />
      <Stepper name="c" className="is-c" value={<b className="is-y">{fmt(c)}</b>} disabled={disabled} onDown={() => set(mi, c - 1)} onUp={() => set(mi, c + 1)} />
    </div>
    <p className="sr-only" id={`${id}-live`} aria-live="polite">{live}</p>
    <p className="graph-board__note graph-board__sum" aria-hidden="true">{equationText(m, c).replace(/^y = /, 'y = ')}</p>
  </div>
}
