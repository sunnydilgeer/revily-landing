'use client'

import { useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactElement } from 'react'
import './AngleBoard.css'

/*
 * The measuring board (geometry lessons 5 to 9): a play screen for each idea, like the angle board (AngleBoard.tsx).
 * The student drags one handle, with a finger, the mouse or the arrow keys, and the numbers under the picture follow it.
 *
 * - turn (symmetry): turn a shape round its centre. Each time it fits its own outline, that turn is collected; a full
 *   turn gives the order of rotational symmetry.
 * - mirror (symmetry): turn a fold line through the shape's centre. The folded copy is drawn in purple; when it fits,
 *   the line turns into a red dashed line of symmetry and is collected.
 * - shear (area): drag the top of a parallelogram or triangle on a grid. Its area only changes with its height.
 * - circle: drag the edge of a circle. However big it is, the circumference ÷ the diameter is always π.
 * - sector: drag a sector's edge round: its area and arc are that fraction of the whole circle's.
 * - notch (perimeter): drag the inside corner of a rectangle with a corner cut out. Its area changes; its perimeter
 *   doesn't.
 */

export type MeasureShape = 'square' | 'rectangle' | 'equilateral' | 'isosceles' | 'pentagon' | 'hexagon' | 'parallelogram' | 'rhombus' | 'kite' | 'trapezium'
export type MeasureBoardSpec = {
  mode: 'turn' | 'mirror' | 'shear' | 'circle' | 'sector' | 'notch'
  /** turn and mirror: the shape. shear: 'parallelogram' (or 'equilateral' for a triangle). */
  shape?: MeasureShape
}

type P = { x: number; y: number }
const W = 320, H = 220
const C = { x: 160, y: 112 }
const rad = (d: number) => d * Math.PI / 180
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
const heading = (O: P, p: P) => ((Math.atan2(O.y - p.y, p.x - O.x) * 180 / Math.PI) + 360) % 360
const fmt = (n: number, dp = 1) => Number(n.toFixed(dp)).toString()

/** Each shape's corners, y up, centred on its own middle (the average of its corners). */
const regular = (n: number, r = 1, start = -90 - 180 / n) => Array.from({ length: n }, (_, k) => ({ x: r * Math.cos(rad(start + k * 360 / n)), y: r * Math.sin(rad(start + k * 360 / n)) }))
const centred = (list: P[]) => { const c = list.reduce((a, p) => ({ x: a.x + p.x / list.length, y: a.y + p.y / list.length }), { x: 0, y: 0 }); return list.map(p => ({ x: p.x - c.x, y: p.y - c.y })) }
export const SHAPES: Record<MeasureShape, P[]> = {
  square: regular(4),
  rectangle: centred([{ x: 0, y: 0 }, { x: 1.9, y: 0 }, { x: 1.9, y: 1.05 }, { x: 0, y: 1.05 }]),
  equilateral: regular(3, 1.1),
  isosceles: centred([{ x: 0, y: 0 }, { x: 1.2, y: 0 }, { x: 0.6, y: 1.7 }]),
  pentagon: regular(5),
  hexagon: regular(6),
  parallelogram: centred([{ x: 0, y: 0 }, { x: 1.5, y: 0 }, { x: 2.1, y: 1 }, { x: 0.6, y: 1 }]),
  rhombus: centred([{ x: 0, y: -1 }, { x: 0.7, y: 0 }, { x: 0, y: 1 }, { x: -0.7, y: 0 }]),
  kite: centred([{ x: 0, y: -1.2 }, { x: 0.7, y: 0.2 }, { x: 0, y: 0.75 }, { x: -0.7, y: 0.2 }]),
  trapezium: centred([{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 1.5, y: 1 }, { x: 0.5, y: 1 }]),
}
const SIZE = 62
const toSvg = (p: P): P => ({ x: C.x + p.x * SIZE, y: C.y - p.y * SIZE })
const turn = (p: P, deg: number): P => ({ x: p.x * Math.cos(rad(deg)) - p.y * Math.sin(rad(deg)), y: p.x * Math.sin(rad(deg)) + p.y * Math.cos(rad(deg)) })
const reflect = (p: P, deg: number): P => { const c = Math.cos(rad(2 * deg)), s = Math.sin(rad(2 * deg)); return { x: c * p.x + s * p.y, y: s * p.x - c * p.y } }
/** The same corners, in any order: the moved shape sits exactly on its outline. */
const fits = (a: P[], b: P[]) => a.every(p => b.some(q => Math.hypot(p.x - q.x, p.y - q.y) < 0.004))
const path = (list: P[]) => `M${list.map(p => `${p.x} ${p.y}`).join(' L')} Z`

/** The turns (1° to 360°) at which a shape fits itself, and the fold lines (0° to 179°) that fit. */
export const turnsThatFit = (shape: MeasureShape) => Array.from({ length: 360 }, (_, k) => k + 1).filter(a => fits(SHAPES[shape].map(p => turn(p, a)), SHAPES[shape]))
export const foldsThatFit = (shape: MeasureShape) => Array.from({ length: 180 }, (_, k) => k).filter(a => fits(SHAPES[shape].map(p => reflect(p, a)), SHAPES[shape]))

/* ---------- Area, circle, sector and perimeter boards ---------- */

const GRID = 30, BASE = { x: 40, y: 190 }, BASE_LEN = 6
const NOTCH = { w: 8, h: 5 }

export function MeasureBoard({ spec }: { spec: MeasureBoardSpec }) {
  const shape = spec.shape ?? 'square'
  const start: Record<MeasureBoardSpec['mode'], number[]> = { turn: [0], mirror: [20], shear: [2, 4], circle: [3], sector: [120], notch: [3, 2] }
  const [v, setV] = useState(start[spec.mode])
  const [found, setFound] = useState<number[]>([])
  const [held, setHeld] = useState(false)
  const [moved, setMoved] = useState(false)
  const svg = useRef<SVGSVGElement>(null)
  const id = useId()
  const fitTurns = spec.mode === 'turn' ? turnsThatFit(shape) : []
  const fitFolds = spec.mode === 'mirror' ? foldsThatFit(shape) : []

  /** Close to a turn or fold that fits, the handle snaps onto it. */
  const snap = (a: number, list: number[]) => list.find(f => Math.abs(a - f) <= 4) ?? Math.round(a)
  const set = (next: number[]) => {
    setV(next); setMoved(true)
    if (spec.mode === 'turn' && fitTurns.includes(next[0]) && !found.includes(next[0])) setFound([...found, next[0]].sort((a, b) => a - b))
    if (spec.mode === 'mirror' && fitFolds.includes(next[0]) && !found.includes(next[0])) setFound([...found, next[0]].sort((a, b) => a - b))
  }
  const from = (p: P): number[] | null => {
    if (spec.mode === 'turn') {
      // The handle starts at the shape's first corner; the turn is how far round the pointer is from there.
      // Past a full turn it stops at 360°.
      const a0 = heading(C, toSvg(SHAPES[shape][0]))
      let a = (heading(C, p) - a0 + 360) % 360
      if (v[0] > 270 && a < 90) a = 360
      return [a >= 356 ? 360 : snap(a, fitTurns)]
    }
    if (spec.mode === 'mirror') return [snap(heading(C, p) % 180, fitFolds) % 180]
    if (spec.mode === 'shear') {
      const h = clamp(Math.round((BASE.y - p.y) / GRID), 1, 5), x = clamp(Math.round((p.x - BASE.x) / GRID * 2) / 2, -1, spec.shape === 'equilateral' ? 8 : 3)
      return [spec.shape === 'equilateral' ? x : clamp(x, -1, 4), h]
    }
    if (spec.mode === 'circle') return [clamp(Math.round(Math.hypot(p.x - 110, p.y - 112) / 12 * 2) / 2, 1, 7.5)]
    if (spec.mode === 'sector') { const a = Math.round(heading({ x: 160, y: 112 }, p) / 5) * 5; return [a === 0 ? 360 : clamp(a, 10, 360)] }
    // notch: the inside corner of the cut, in whole centimetres.
    return [clamp(Math.round((p.x - 40) / 30), 1, NOTCH.w - 1), clamp(Math.round((p.y - 35) / 30), 1, NOTCH.h - 1)]
  }
  const toLocal = (event: PointerEvent): P | null => {
    const m = svg.current?.getScreenCTM()
    if (!m) return null
    const q = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse())
    return { x: q.x, y: q.y }
  }
  const move = (p: P | null) => { const next = p && from(p); if (next && next.join() !== v.join()) set(next) }
  const key = (event: KeyboardEvent) => {
    const step = event.key === 'ArrowRight' || event.key === 'ArrowUp' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -1 : 0
    if (!step) return
    event.preventDefault()
    const vertical = event.key === 'ArrowUp' || event.key === 'ArrowDown'
    if (spec.mode === 'turn') set([clamp(v[0] + step, 0, 360)])
    if (spec.mode === 'mirror') set([(v[0] + step + 180) % 180])
    if (spec.mode === 'shear') set(vertical ? [v[0], clamp(v[1] + step, 1, 5)] : [clamp(v[0] + step / 2, -1, spec.shape === 'equilateral' ? 8 : 3), v[1]])
    if (spec.mode === 'circle') set([clamp(v[0] + step / 2, 1, 7.5)])
    if (spec.mode === 'sector') set([clamp(v[0] + step * 5, 10, 360)])
    if (spec.mode === 'notch') set(vertical ? [v[0], clamp(v[1] - step, 1, NOTCH.h - 1)] : [clamp(v[0] + step, 1, NOTCH.w - 1), v[1]])
  }

  let drawing: ReactElement
  let handle: P
  let footer: ReactElement
  let spoken: string
  const bump = moved ? v.join() : 'still'
  const pill = (text: string) => <strong className={`angle-board__total${moved ? ' is-moved' : ''}`} key={bump}>{text}</strong>

  if (spec.mode === 'turn' || spec.mode === 'mirror') {
    const base = SHAPES[shape].map(toSvg)
    const moved2 = SHAPES[shape].map(p => spec.mode === 'turn' ? turn(p, v[0]) : reflect(p, v[0])).map(toSvg)
    const fitsNow = spec.mode === 'turn' ? fitTurns.includes(v[0]) : fitFolds.includes(v[0])
    const end = (deg: number, r: number) => ({ x: C.x + r * Math.cos(rad(deg)), y: C.y - r * Math.sin(rad(deg)) })
    handle = spec.mode === 'turn' ? moved2[0] : end(v[0], 100)
    drawing = <>
      <path className="ns-fig__shape" d={path(base)} />
      {spec.mode === 'turn'
        ? <path className="measure-board__ghost is-turn" d={path(moved2)} />
        : <><path className={`measure-board__ghost${fitsNow ? ' is-fit' : ''}`} d={path(moved2)} />
          <path className={`ns-fig__line ${fitsNow ? 'is-mirror' : 'is-dashed'}`} d={`M${end(v[0] + 180, 100).x} ${end(v[0] + 180, 100).y} L${handle.x} ${handle.y}`} /></>}
      <circle className="ns-fig__point" cx={C.x} cy={C.y} r="3.5" />
    </>
    const total = spec.mode === 'turn' ? fitTurns.length : fitFolds.length
    const done = spec.mode === 'turn' ? found.includes(360) : found.length === total
    spoken = spec.mode === 'turn'
      ? `Turned ${v[0]}°. ${fitsNow ? 'It fits its outline.' : 'It doesn’t fit.'} Fits found at ${found.join('°, ') || 'none yet'}${found.length ? '°' : ''}.${done ? ` Order of rotational symmetry ${total}.` : ''}`
      : `Fold line at ${v[0]}°. ${fitsNow ? 'A line of symmetry.' : 'Not a line of symmetry.'} Lines found: ${found.length}.${done ? ` All ${total} found.` : ''}`
    footer = spec.mode === 'turn'
      ? <span aria-hidden="true">Turned <span className="angle-board__n c0">{v[0]}°</span>{fitsNow && v[0] ? <> {pill('fits')}</> : ''}<span className="measure-board__found">{found.length ? `Fits: ${found.map(a => `${a}°`).join(', ')}` : 'Turn it until it fits'}</span>{done && <span className="measure-board__found"><span className="angle-board__same">Order {total}</span></span>}</span>
      : <span aria-hidden="true">{fitsNow ? pill('Line of symmetry') : <span className="angle-board__tag">Doesn’t fit</span>}<span className="measure-board__found">Lines found: <span className="angle-board__n c0">{found.length}</span>{done && <> <span className="angle-board__same">all {total}</span></>}</span></span>
  } else if (spec.mode === 'shear') {
    const [x, h] = v, triangle = spec.shape === 'equilateral'
    const A = BASE, B = { x: BASE.x + BASE_LEN * GRID, y: BASE.y }, top = { x: BASE.x + x * GRID, y: BASE.y - h * GRID }
    const pts = triangle ? [A, B, top] : [A, B, { x: top.x + BASE_LEN * GRID, y: top.y }, top]
    handle = top
    const area = triangle ? BASE_LEN * h / 2 : BASE_LEN * h
    const foot = { x: top.x, y: BASE.y }
    drawing = <>
      {Array.from({ length: 11 }, (_, k) => <path key={`v${k}`} className="measure-board__grid" d={`M${10 + k * GRID} 10 L${10 + k * GRID} 205`} />)}
      {Array.from({ length: 7 }, (_, k) => <path key={`h${k}`} className="measure-board__grid" d={`M10 ${10 + k * GRID} L310 ${10 + k * GRID}`} />)}
      <path className="ns-fig__shape" d={path(pts)} />
      <path className="ns-fig__line is-dashed" d={`M${top.x} ${top.y} L${foot.x} ${foot.y}`} />
      {(foot.x < A.x || foot.x > B.x) && <path className="ns-fig__line is-dashed" d={`M${foot.x} ${foot.y} L${foot.x < A.x ? A.x : B.x} ${foot.y}`} />}
      <text className="measure-board__label is-h" x={top.x + 10} y={(top.y + BASE.y) / 2}>h = {h}</text>
      <text className="measure-board__label" x={(A.x + B.x) / 2} y={BASE.y + 14}>b = {BASE_LEN}</text>
    </>
    spoken = `Base ${BASE_LEN}, height ${h}: area ${triangle ? `half of ${BASE_LEN} times ${h}` : `${BASE_LEN} times ${h}`}, ${area} squares.`
    footer = <span aria-hidden="true">{triangle ? '½ × ' : ''}<span className="angle-board__n c0">{BASE_LEN}</span> × <span className="angle-board__n c1">{h}</span> = {pill(`${area} squares`)}</span>
  } else if (spec.mode === 'circle') {
    const r = v[0], O = { x: 110, y: 112 }, R = r * 12
    handle = { x: O.x + R, y: O.y }
    drawing = <>
      <circle className="ns-fig__shape" cx={O.x} cy={O.y} r={R} />
      <path className="ns-fig__line is-x" d={`M${O.x - R} ${O.y} L${O.x + R} ${O.y}`} />
      <circle className="ns-fig__point" cx={O.x} cy={O.y} r="3.5" />
      <text className="measure-board__label is-big" x="262" y="70">d = {fmt(2 * r)}</text>
      <text className="measure-board__label is-big is-c" x="262" y="105">C = {fmt(2 * Math.PI * r)}</text>
      <text className="measure-board__label is-big is-a" x="262" y="140">A = {fmt(Math.PI * r * r)}</text>
    </>
    spoken = `Radius ${r}, diameter ${2 * r}, circumference ${fmt(2 * Math.PI * r)}, area ${fmt(Math.PI * r * r)}. Circumference divided by diameter is 3.14.`
    footer = <span aria-hidden="true"><span className="angle-board__n c1">C</span> ÷ <span className="angle-board__n c0">d</span> = {fmt(2 * Math.PI * r)} ÷ {fmt(2 * r)} = {pill('3.14… = π')}</span>
  } else if (spec.mode === 'sector') {
    const a = v[0], O = { x: 110, y: 112 }, R = 85, r = 6
    const end = { x: O.x + R * Math.cos(rad(a)), y: O.y - R * Math.sin(rad(a)) }
    handle = end
    const large = a > 180 ? 1 : 0
    const sector = a >= 360 ? `M${O.x - R} ${O.y} A${R} ${R} 0 1 0 ${O.x + R} ${O.y} A${R} ${R} 0 1 0 ${O.x - R} ${O.y} Z` : `M${O.x} ${O.y} L${O.x + R} ${O.y} A${R} ${R} 0 ${large} 0 ${end.x} ${end.y} Z`
    drawing = <>
      <circle className="ns-fig__shape is-empty" cx={O.x} cy={O.y} r={R} />
      <path className="ns-fig__shape is-part" d={sector} />
      {a < 360 && <path className="ns-fig__line is-lit" d={`M${O.x + R} ${O.y} A${R} ${R} 0 ${large} 0 ${end.x} ${end.y}`} />}
      <text className="measure-board__label is-big" x="262" y="62">{a}° of 360°</text>
      <text className="measure-board__label is-big is-a" x="262" y="104">Area {fmt(a / 360 * Math.PI * r * r)}</text>
      <text className="measure-board__label is-big is-c" x="262" y="146">Arc {fmt(a / 360 * Math.PI * 2 * r)}</text>
      <text className="measure-board__label" x={O.x + R / 2} y={O.y + 12}>r = {r}</text>
    </>
    spoken = `A ${a}° sector of a circle of radius ${r}: ${a} over 360 of the circle. Area ${fmt(a / 360 * Math.PI * r * r)}, arc ${fmt(a / 360 * Math.PI * 2 * r)}.`
    footer = <span aria-hidden="true">Fraction of the circle: <span className="angle-board__n c2">{a}</span> ÷ 360 = {pill(fmt(a / 360, 3))}</span>
  } else {
    // notch: the cut-out corner is top right, from (cx, top) down to (right, cy).
    const [cx, cy] = v, L = 40, T = 35, s = 30, Wd = NOTCH.w * s, Ht = NOTCH.h * s
    const pts = [{ x: L, y: T + Ht }, { x: L + Wd, y: T + Ht }, { x: L + Wd, y: T + cy * s }, { x: L + cx * s, y: T + cy * s }, { x: L + cx * s, y: T }, { x: L, y: T }]
    handle = pts[3]
    const area = NOTCH.w * NOTCH.h - (NOTCH.w - cx) * cy, perimeter = 2 * (NOTCH.w + NOTCH.h)
    drawing = <>
      <path className="ns-fig__shape is-dashed" d={`M${L} ${T} L${L + Wd} ${T} L${L + Wd} ${T + Ht}`} />
      <path className="ns-fig__shape" d={path(pts)} />
      <text className="measure-board__label" x={L + Wd / 2} y={T + Ht + 14}>{NOTCH.w}</text>
      <text className="measure-board__label" x={L - 12} y={T + Ht / 2}>{NOTCH.h}</text>
      <text className="measure-board__label is-h" x={L + (cx * s + Wd) / 2} y={T + cy * s - 10}>{NOTCH.w - cx}</text>
      <text className="measure-board__label is-h" x={L + cx * s - 12} y={T + cy * s / 2}>{cy}</text>
    </>
    spoken = `A ${NOTCH.w} by ${NOTCH.h} rectangle with a ${NOTCH.w - cx} by ${cy} corner cut out. Area ${area}. Perimeter ${perimeter}, the same as the whole rectangle.`
    footer = <span aria-hidden="true">Area <span className="angle-board__n c1">{area}</span>, perimeter {pill(`${perimeter}`)}</span>
  }

  const what = { turn: 'Drag the corner round to turn the shape, or use the arrow keys.', mirror: 'Drag the end of the fold line round, or use the arrow keys.', shear: 'Drag the top corner, or use the arrow keys.', circle: 'Drag the edge of the circle, or use the arrow keys.', sector: 'Drag the edge of the sector round, or use the arrow keys.', notch: 'Drag the inside corner of the cut, or use the arrow keys.' }[spec.mode]
  return <div className={`angle-board measure-board${held ? ' is-held' : ''}`}>
    <svg ref={svg} className="angle-board__surface" viewBox={`0 0 ${W} ${H}`} role="application" tabIndex={0} aria-label={`Measuring board. ${what}`} aria-describedby={`${id}-sum`}
      onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); setHeld(true); move(toLocal(event)) }}
      onPointerMove={event => { if (held) move(toLocal(event)) }} onPointerUp={() => setHeld(false)} onPointerCancel={() => setHeld(false)} onKeyDown={key}>
      {drawing}
      <circle className="angle-board__handle" cx={handle.x} cy={handle.y} r={held ? 13 : 11} />
    </svg>
    <p className="angle-board__sum" id={`${id}-sum`} aria-live="polite"><span className="sr-only">{spoken}</span>{footer}</p>
  </div>
}
