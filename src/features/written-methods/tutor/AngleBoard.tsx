'use client'

import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { angle, tick, turnBetween, type P } from './AnglePictures'
import './AngleBoard.css'

/*
 * The angle board (geometry lesson 1, Angle facts): a play screen for each fact, Brilliant-style (Sunny, 9 Oct:
 * interactive, factual, step by step). The student drags a line or a corner with a finger, the mouse or the arrow keys,
 * and every angle's size updates as it moves, in whole degrees. Under the picture the angles are added up, each in its
 * own colour, and the total never changes: that is the fact.
 *
 * Modes:
 * - line: a line from a point on a straight line. Drag its end: the two angles trade, and still make 180°.
 * - point: lines round a point. Drag any of them: the angles change, and still make 360°.
 * - triangle: drag the top corner anywhere: the three angles change, and still make 180°.
 * - isosceles: the two sides from the top are equal. Drag the top corner up or down: the two base angles stay equal.
 * - quad: drag one corner of a quadrilateral: the four angles change, and still make 360°.
 */

export type AngleBoardSpec = {
  mode: 'line' | 'point' | 'triangle' | 'isosceles' | 'quad'
  /** line: the angle on the right. point: where each line points (degrees anticlockwise from the right). triangle: the
   *  two base angles. isosceles: the base angle. quad: the dragged top-left corner, as x and y in the picture. */
  start: number[]
}

const W = 320, H = 220
const COLOURS = ['c0', 'c1', 'c2', 'c3']
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
/** SVG y runs down; angles are worked out with y up. */
const up = (p: P): P => ({ x: p.x, y: -p.y })
const dir = (O: P, deg: number, length: number): P => ({ x: O.x + length * Math.cos(deg * Math.PI / 180), y: O.y - length * Math.sin(deg * Math.PI / 180) })
const heading = (O: P, p: P) => ((Math.atan2(O.y - p.y, p.x - O.x) * 180 / Math.PI) + 360) % 360

/** Where the two base angles a and b, on base A to B, meet. */
function apex(A: P, B: P, a: number, b: number): P {
  const r = Math.PI / 180, base = B.x - A.x
  const t = Math.sin(b * r) / Math.sin((a + b) * r) * base
  return { x: A.x + t * Math.cos(a * r), y: A.y - t * Math.sin(a * r) }
}

type Shape = { lines: string[]; angles: { V: P; from: P; to: P; size: number }[]; handles: P[]; total: number; ticks?: string[] }

function shapeOf(mode: AngleBoardSpec['mode'], v: number[]): Shape {
  if (mode === 'line') {
    const O = { x: 160, y: 160 }, L = { x: 20, y: 160 }, R = { x: 300, y: 160 }, T = dir(O, v[0], 120)
    return { lines: [`M${L.x} ${L.y} L${R.x} ${R.y}`, `M${O.x} ${O.y} L${T.x} ${T.y}`], angles: [{ V: O, from: R, to: T, size: v[0] }, { V: O, from: T, to: L, size: 180 - v[0] }], handles: [T], total: 180 }
  }
  if (mode === 'point') {
    const O = { x: 160, y: 110 }, ends = v.map(d => dir(O, d, 95))
    return {
      lines: ends.map(T => `M${O.x} ${O.y} L${T.x} ${T.y}`), handles: ends, total: 360,
      angles: v.map((d, i) => ({ V: O, from: ends[i], to: ends[(i + 1) % v.length], size: Math.round(((v[(i + 1) % v.length] - d) + 360) % 360) })),
    }
  }
  if (mode === 'quad') {
    const A = { x: 40, y: 190 }, B = { x: 270, y: 200 }, C = { x: 250, y: 50 }, D = { x: v[0], y: v[1] }
    const raw = [turnBetween(up(A), up(B), up(D)), turnBetween(up(B), up(C), up(A)), turnBetween(up(C), up(D), up(B))].map(Math.round)
    const sizes = [...raw, 360 - raw[0] - raw[1] - raw[2]]
    return { lines: [`M${A.x} ${A.y} L${B.x} ${B.y} L${C.x} ${C.y} L${D.x} ${D.y} Z`], handles: [D], total: 360,
      angles: [{ V: A, from: B, to: D, size: sizes[0] }, { V: B, from: C, to: A, size: sizes[1] }, { V: C, from: D, to: B, size: sizes[2] }, { V: D, from: A, to: C, size: sizes[3] }] }
  }
  const A = { x: 35, y: 195 }, B = { x: 285, y: 195 }
  const [a, b] = mode === 'isosceles' ? [v[0], v[0]] : v
  const C = apex(A, B, a, b)
  return { lines: [`M${A.x} ${A.y} L${B.x} ${B.y} L${C.x} ${C.y} Z`], handles: [C], total: 180, ticks: mode === 'isosceles' ? [tick(C, A), tick(C, B)] : undefined,
    angles: [{ V: A, from: B, to: C, size: a }, { V: B, from: C, to: A, size: b }, { V: C, from: A, to: B, size: 180 - a - b }] }
}

/** The next angles when a handle is dragged to p, or null when the move would break the shape. */
function dragTo(mode: AngleBoardSpec['mode'], v: number[], handle: number, p: P): number[] | null {
  if (mode === 'line') return [clamp(Math.round(heading({ x: 160, y: 160 }, p)), 8, 172) || 8]
  if (mode === 'point') {
    const n = v.length, d = Math.round(heading({ x: 160, y: 110 }, p))
    const prev = v[(handle + n - 1) % n], next = v[(handle + 1) % n]
    const gap = (from: number, to: number) => ((to - from) + 360) % 360
    if (gap(prev, d) < 12 || gap(d, next) < 12 || gap(prev, d) > gap(prev, next)) return null
    return v.map((x, i) => i === handle ? d : x)
  }
  if (mode === 'quad') {
    const D = { x: clamp(Math.round(p.x), 10, 230), y: clamp(Math.round(p.y), 15, 170) }
    const next = [D.x, D.y]
    return shapeOf('quad', next).angles.every(a => a.size >= 15 && a.size <= 165) ? next : null
  }
  const A = { x: 35, y: 195 }, B = { x: 285, y: 195 }
  const C = { x: clamp(p.x, 20, 300), y: clamp(p.y, 12, 175) }
  if (mode === 'isosceles') return [clamp(Math.round(Math.atan2(A.y - C.y, 125) * 180 / Math.PI), 10, 80)]
  const a = Math.round(turnBetween(up(A), up(B), up(C))), b = Math.round(turnBetween(up(B), up(C), up(A)))
  return a >= 10 && b >= 10 && a + b <= 170 ? [a, b] : null
}

/** The arrow keys: a degree at a time (a quadrilateral's corner, a few pixels). */
function nudge(mode: AngleBoardSpec['mode'], v: number[], key: string): number[] | null {
  const step = key === 'ArrowRight' || key === 'ArrowUp' ? 1 : key === 'ArrowLeft' || key === 'ArrowDown' ? -1 : 0
  if (!step) return null
  const vertical = key === 'ArrowUp' || key === 'ArrowDown'
  if (mode === 'line') return [clamp(v[0] - step, 8, 172)]
  if (mode === 'point') return dragTo(mode, v, 0, dir({ x: 160, y: 110 }, v[0] + step, 95))
  if (mode === 'isosceles') return [clamp(v[0] + step, 10, 80)]
  if (mode === 'quad') return dragTo(mode, v, 0, vertical ? { x: v[0], y: v[1] - step * 4 } : { x: v[0] + step * 4, y: v[1] })
  const next = vertical ? [v[0] + step, v[1] + step] : [v[0] - step, v[1] + step]
  return next[0] >= 10 && next[1] >= 10 && next[0] + next[1] <= 170 ? next : null
}

export function AngleBoard({ spec }: { spec: AngleBoardSpec }) {
  const [values, setValues] = useState(spec.start)
  const [held, setHeld] = useState<number | null>(null)
  const [moved, setMoved] = useState(false)
  const svg = useRef<SVGSVGElement>(null)
  const id = useId()
  const shape = shapeOf(spec.mode, values)

  const toSvg = (event: PointerEvent): P | null => {
    const matrix = svg.current?.getScreenCTM()
    if (!matrix) return null
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse())
    return { x: p.x, y: p.y }
  }
  const move = (handle: number, p: P | null) => {
    if (!p) return
    const next = dragTo(spec.mode, values, handle, p)
    if (next) { setValues(next); setMoved(true) }
  }
  const down = (event: PointerEvent<SVGSVGElement>) => {
    const p = toSvg(event)
    if (!p) return
    const nearest = shape.handles.map((h, i) => ({ i, d: Math.hypot(h.x - p.x, h.y - p.y) })).sort((a, b) => a.d - b.d)[0]
    event.currentTarget.setPointerCapture(event.pointerId)
    setHeld(nearest.i)
    move(nearest.i, p)
  }
  const key = (event: KeyboardEvent) => {
    const next = nudge(spec.mode, values, event.key)
    if (event.key.startsWith('Arrow')) event.preventDefault()
    if (next) { setValues(next); setMoved(true) }
  }

  const sum = shape.angles.reduce((total, a) => total + a.size, 0)
  const spoken = `${shape.angles.map(a => `${a.size}°`).join(' plus ')} makes ${sum}°.`
  const what = { line: 'Drag the end of the line, or use the arrow keys.', point: 'Drag any line round the point, or use the arrow keys.', triangle: 'Drag the top corner, or use the arrow keys.', isosceles: 'Drag the top corner up or down, or use the arrow keys.', quad: 'Drag the top left corner, or use the arrow keys.' }[spec.mode]

  return <div className={`angle-board${held !== null ? ' is-held' : ''}`}>
    <svg ref={svg} className="angle-board__surface" viewBox={`0 0 ${W} ${H}`} role="application" tabIndex={0} aria-label={`Angle board. ${what}`} aria-describedby={`${id}-sum`}
      onPointerDown={down} onPointerMove={event => { if (held !== null) move(held, toSvg(event)) }} onPointerUp={() => setHeld(null)} onPointerCancel={() => setHeld(null)} onKeyDown={key}>
      {shape.lines.map((d, i) => <path key={i} className="ns-angles__line" d={d} />)}
      {shape.ticks?.map((d, i) => <path key={`t${i}`} className="ns-angles__line" d={d} />)}
      {shape.angles.map((a, i) => {
        const drawn = angle(a.V, a.from, a.to, a.size)
        const text = `${a.size}°`
        return <g key={i} className={`angle-board__mark ${COLOURS[i]}`}>
          <path d={drawn.path} />
          <text x={drawn.label.x} y={drawn.label.y}>{text}</text>
        </g>
      })}
      {shape.handles.map((h, i) => <circle key={i} className="angle-board__handle" cx={h.x} cy={h.y} r={held === i ? 13 : 11} />)}
    </svg>
    <p className="angle-board__sum" id={`${id}-sum`} aria-live="polite">
      <span className="sr-only">{spoken}</span>
      <span aria-hidden="true">{shape.angles.map((a, i) => <span key={i}>{i ? ' + ' : ''}<span className={`angle-board__n ${COLOURS[i]}`}>{a.size}°</span></span>)} = <strong className={`angle-board__total${moved ? ' is-moved' : ''}`} key={moved ? sum + values.join() : 'still'}>{sum}°</strong></span>
    </p>
  </div>
}
