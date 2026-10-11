'use client'

import { useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactElement } from 'react'
import './AngleBoard.css'

/*
 * The chart board (Statistics lessons 10 to 18, P10–P18 in Sunny's revision book): the charts in the book, built by
 * hand. Drag with a finger or the mouse, or pick a handle with Tab and move it with the arrow keys; the numbers under
 * the chart follow.
 *
 * - bars (P12, P14, P15): drag each bar's height. With `show: 'mean'` the footer works out the mean from the bars, as
 *   frequencies of the values `xs` (a frequency table, or the midpoints of a grouped one).
 * - line (P17): drag each point of a line graph up or down.
 * - pictogram (P10): drag each row's pictures out, a quarter of a picture at a time; `key` is what one picture stands for.
 * - pie (P18): drag the edge after slice `edge`. That slice grows and the next one shrinks, so the total stays the same.
 * - scatter (P16): drag the last point, and the footer names the correlation; or, with `move: 'line'`, drag the two
 *   ends of a line of best fit, and the footer counts the points above and below it and reads it at `readAt`.
 *
 * `ask`: the board is the answer to a question, as on the chance board. The answer is the free values in order
 * ("29,15,35"), the pie slice's angle in degrees ("144"), the point ("190,88"), or what the line reads at `readAt`.
 * What would give it away is hidden: the pie shows the angle but not the count, and a pictogram its pictures but not
 * what they stand for.
 */

type Axis = [number, number, string]
export type ChartBoardSpec =
  | { mode: 'bars' | 'line'; labels: string[]; values: number[]; max: number; free?: number[]; snap?: number; show?: 'total' | 'mean'; xs?: number[]; ask?: boolean; title?: string }
  | { mode: 'pictogram'; labels: string[]; values: number[]; key: number; icons?: number; free?: number[]; ask?: boolean }
  | { mode: 'pie'; labels: string[]; values: number[]; edge?: number; ask?: boolean }
  | { mode: 'scatter'; points: [number, number][]; x: Axis; y: Axis; move?: 'point' | 'line'; from?: number[]; snap?: [number, number]; readAt?: number; ask?: boolean }

type P = { x: number; y: number }
const W = 320, H = 220
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
const fmt = (n: number, dp = 2) => Number(n.toFixed(dp)).toString()
const snapTo = (v: number, step: number) => Math.round(v / step) * step
const freeOf = (spec: { values: number[]; free?: number[] }) => spec.free ?? spec.values.map((_, k) => k)
/** A whole number of pictures and the quarter over: 2¾. */
const quarters = (q: number) => `${Math.floor(q / 4) || (q % 4 ? '' : '0')}${['', '¼', '½', '¾'][q % 4]}`
/** A tidy gap between the numbers on an axis, for about five of them. */
const niceStep = (span: number) => { const raw = span / 5, p = 10 ** Math.floor(Math.log10(raw)); return [1, 2, 2.5, 5, 10].map(m => m * p).find(s => s >= raw)! }

/* The plot's box, in the board's own pixels. */
const PLOT = { x0: 46, x1: 308, top: 18, base: 176 }
/* The pie: its centre and radius, and the key down its right. */
const PIE = { x: 102, y: 108, r: 84 }

/** The values a board starts on, as the board holds them. */
function startOf(spec: ChartBoardSpec): number[] {
  if (spec.mode === 'scatter') {
    const [x0, x1] = spec.x, [y0, y1] = spec.y
    return spec.from ?? (spec.move === 'line' ? [y0 + (y1 - y0) * 0.3, y0 + (y1 - y0) * 0.6] : [(x0 + x1) / 2, (y0 + y1) / 2])
  }
  return [...spec.values]
}

/** The answer a board question gives for these values. */
export function chartValue(spec: ChartBoardSpec, v: number[]): string {
  if (spec.mode === 'pie') { const total = spec.values.reduce((s, n) => s + n, 0); return fmt(v[spec.edge ?? 0] / total * 360, 1) }
  if (spec.mode === 'scatter') {
    if (spec.move === 'line') { const [x0, x1] = spec.x, t = ((spec.readAt ?? x0) - x0) / (x1 - x0); return fmt(v[0] + (v[1] - v[0]) * t, 0) }
    return `${fmt(v[0])},${fmt(v[1])}`
  }
  return freeOf(spec).map(k => fmt(v[k])).join(',')
}

/** How strong the link is between x and y: the correlation coefficient, in words as the book says it. */
function correlation(points: [number, number][]) {
  const n = points.length, mx = points.reduce((s, p) => s + p[0], 0) / n, my = points.reduce((s, p) => s + p[1], 0) / n
  const sxy = points.reduce((s, p) => s + (p[0] - mx) * (p[1] - my), 0), sxx = points.reduce((s, p) => s + (p[0] - mx) ** 2, 0), syy = points.reduce((s, p) => s + (p[1] - my) ** 2, 0)
  const r = sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0
  return Math.abs(r) < 0.3 ? 'no correlation' : `${Math.abs(r) >= 0.75 ? 'strong' : 'weak'} ${r > 0 ? 'positive' : 'negative'} correlation`
}

export function ChartBoard({ spec, onChange, disabled }: { spec: ChartBoardSpec; onChange?: (value: string) => void; disabled?: boolean }) {
  const [v, setV] = useState(() => startOf(spec))
  const ask = Boolean(spec.ask)
  const [which, setWhich] = useState(0)
  const [held, setHeld] = useState(false)
  const [moved, setMoved] = useState(false)
  const svg = useRef<SVGSVGElement>(null)
  const id = useId()
  const set = (next: number[]) => { if (disabled) return; setV(next); setMoved(true); onChange?.(chartValue(spec, next)) }

  /* Where things are drawn, for each kind of chart. */
  const bars = spec.mode === 'bars' || spec.mode === 'line' ? spec : null
  const slot = bars ? (PLOT.x1 - PLOT.x0) / bars.values.length : 0
  const unit = bars ? (PLOT.base - PLOT.top) / bars.max : 0
  const xOfBar = (k: number) => PLOT.x0 + slot * (k + 0.5)
  const pict = spec.mode === 'pictogram' ? spec : null
  const PICT = { x0: 112, row: Math.min(36, 168 / Math.max(1, pict?.labels.length ?? 1)), size: 24, gap: 6 }
  const rowY = (k: number) => 22 + PICT.row * (k + 0.5)
  const sc = spec.mode === 'scatter' ? spec : null
  const sx = (x: number) => sc ? PLOT.x0 + (x - sc.x[0]) / (sc.x[1] - sc.x[0]) * (PLOT.x1 - PLOT.x0) : 0
  const sy = (y: number) => sc ? PLOT.base - (y - sc.y[0]) / (sc.y[1] - sc.y[0]) * (PLOT.base - PLOT.top) : 0
  const total = spec.mode === 'pie' ? spec.values.reduce((s, n) => s + n, 0) : 0
  const edge = spec.mode === 'pie' ? spec.edge ?? 0 : 0

  /** The handles a finger or the keys can move, in the order Tab and the arrow keys take them. */
  const handles: P[] = []
  if (bars) for (const k of freeOf(bars)) handles.push({ x: xOfBar(k), y: PLOT.base - v[k] * unit })
  if (pict) for (const k of freeOf(pict)) handles.push({ x: PICT.x0 + v[k] / 4 * (PICT.size + PICT.gap) - PICT.gap / 2, y: rowY(k) })
  if (spec.mode === 'pie') {
    const a = v.slice(0, edge + 1).reduce((s, n) => s + n, 0) / total * 2 * Math.PI
    handles.push({ x: PIE.x + PIE.r * Math.sin(a), y: PIE.y - PIE.r * Math.cos(a) })
  }
  if (sc) {
    if (sc.move === 'line') handles.push({ x: sx(sc.x[0]), y: sy(v[0]) }, { x: sx(sc.x[1]), y: sy(v[1]) })
    else handles.push({ x: sx(v[0]), y: sy(v[1]) })
  }

  /** The values once handle `pick` is dragged to point `p`. */
  const at = (p: P, pick: number): number[] | null => {
    const next = [...v]
    if (bars) {
      const k = freeOf(bars)[pick], step = bars.snap ?? 1
      next[k] = clamp(snapTo((PLOT.base - p.y) / unit, step), 0, bars.max)
    } else if (pict) {
      const k = freeOf(pict)[pick]
      next[k] = clamp(Math.round((p.x - PICT.x0 + PICT.gap / 2) / (PICT.size + PICT.gap) * 4), 0, (pict.icons ?? 6) * 4)
    } else if (spec.mode === 'pie') {
      const turn = (Math.atan2(p.x - PIE.x, PIE.y - p.y) * 180 / Math.PI + 360) % 360
      const before = v.slice(0, edge).reduce((s, n) => s + n, 0), pair = v[edge] + v[edge + 1]
      const n = clamp(Math.round(turn / 360 * total) - before, 0, pair)
      next[edge] = n; next[edge + 1] = pair - n
    } else if (sc) {
      const [sxs, sys] = sc.snap ?? [niceStep(sc.x[1] - sc.x[0]) / 5, niceStep(sc.y[1] - sc.y[0]) / 5]
      const x = sc.x[0] + (p.x - PLOT.x0) / (PLOT.x1 - PLOT.x0) * (sc.x[1] - sc.x[0]), y = sc.y[0] + (PLOT.base - p.y) / (PLOT.base - PLOT.top) * (sc.y[1] - sc.y[0])
      if (sc.move === 'line') next[pick] = clamp(snapTo(y, sys), sc.y[0], sc.y[1])
      else { next[0] = clamp(snapTo(x, sxs), sc.x[0], sc.x[1]); next[1] = clamp(snapTo(y, sys), sc.y[0], sc.y[1]) }
    }
    return next
  }
  const toLocal = (event: PointerEvent): P | null => {
    const m = svg.current?.getScreenCTM()
    if (!m) return null
    const q = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse())
    return { x: q.x, y: q.y }
  }
  // A question takes the first touch as an answer even where the board starts, so Check is never stuck off.
  const move = (p: P | null, pick = which) => { const next = p && at(p, pick); if (next && (next.join() !== v.join() || (onChange && !moved))) set(next) }
  const nearest = (p: P) => {
    if (sc?.move !== 'line' && !bars && !pict) return 0
    // Bars and lines: the handle across from the finger. Rows of pictures: the row it is on. The line: its nearer end.
    const d = (h: P) => bars ? Math.abs(h.x - p.x) : pict ? Math.abs(h.y - p.y) : Math.hypot(h.x - p.x, h.y - p.y)
    return handles.reduce((best, h, k) => d(h) < d(handles[best]) ? k : best, 0)
  }
  const key = (event: KeyboardEvent) => {
    const k = event.key
    if ((k === 'Tab' && handles.length > 1 && !(event.shiftKey ? which === 0 : which === handles.length - 1))) { event.preventDefault(); setWhich(which + (event.shiftKey ? -1 : 1)); return }
    const step = k === 'ArrowRight' || k === 'ArrowUp' ? 1 : k === 'ArrowLeft' || k === 'ArrowDown' ? -1 : 0
    if (!step) return
    event.preventDefault()
    const next = [...v]
    if (bars) { const i = freeOf(bars)[which]; next[i] = clamp(v[i] + step * (bars.snap ?? 1), 0, bars.max) }
    else if (pict) { const i = freeOf(pict)[which]; next[i] = clamp(v[i] + step, 0, (pict.icons ?? 6) * 4) }
    else if (spec.mode === 'pie') { const pair = v[edge] + v[edge + 1]; next[edge] = clamp(v[edge] + step, 0, pair); next[edge + 1] = pair - next[edge] }
    else if (sc) {
      const [sxs, sys] = sc.snap ?? [niceStep(sc.x[1] - sc.x[0]) / 5, niceStep(sc.y[1] - sc.y[0]) / 5]
      const across = k === 'ArrowLeft' || k === 'ArrowRight'
      if (sc.move === 'line') next[which] = clamp(v[which] + step * sys, sc.y[0], sc.y[1])
      else if (across) next[0] = clamp(v[0] + step * sxs, sc.x[0], sc.x[1])
      else next[1] = clamp(v[1] + step * sys, sc.y[0], sc.y[1])
    }
    set(next)
  }

  let drawing: ReactElement
  let footer: ReactElement
  let spoken: string
  const bump = moved ? v.join() : 'still'
  const pill = (text: string) => <strong className={`angle-board__total${moved ? ' is-moved' : ''}`} key={bump}>{text}</strong>
  const small = (label: string, room: number) => label.length * 7 > room ? { fontSize: Math.max(10, Math.min(13, room / label.length * 1.6)) } : undefined

  if (bars) {
    const step = niceStep(bars.max), free = new Set(freeOf(bars))
    // Labels too long for their slot (about 7 pixels a letter) take turns on two rows.
    const tight = bars.labels.some(l => l.length * 7 > slot - 4)
    const ticks = Array.from({ length: Math.floor(bars.max / step) + 1 }, (_, k) => k * step)
    const sum = v.reduce((s, n) => s + n, 0)
    const fx = bars.xs ? v.reduce((s, n, k) => s + n * bars.xs![k], 0) : 0
    drawing = <>
      {ticks.map(t => <g key={t}>
        <path className={`measure-board__grid${t ? '' : ' is-axis'}`} d={`M${PLOT.x0} ${PLOT.base - t * unit} L${PLOT.x1} ${PLOT.base - t * unit}`} />
        <text className="measure-board__label" style={{ fontSize: 12 }} x={PLOT.x0 - 16} y={PLOT.base - t * unit}>{fmt(t)}</text>
      </g>)}
      <path className="measure-board__grid is-axis" d={`M${PLOT.x0} ${PLOT.top - 6} L${PLOT.x0} ${PLOT.base}`} />
      {bars.mode === 'line' && <path className="ns-fig__line is-thin" fill="none" d={v.map((n, k) => `${k ? 'L' : 'M'}${xOfBar(k)} ${PLOT.base - n * unit}`).join(' ')} />}
      {v.map((n, k) => <g key={k}>
        {bars.mode === 'bars'
          ? <rect className={free.has(k) ? 'measure-board__ghost is-fit' : 'ns-fig__shape'} x={xOfBar(k) - slot * 0.3} y={PLOT.base - n * unit} width={slot * 0.6} height={n * unit} />
          : !free.has(k) && <path className="ns-fig__line is-thin" d={`M${xOfBar(k) - 5} ${PLOT.base - n * unit - 5} l10 10 m0 -10 l-10 10`} />}
        <text className="measure-board__label" style={{ fontSize: 12 }} x={xOfBar(k)} y={PLOT.base + (tight && k % 2 ? 30 : 15)}>{bars.labels[k]}</text>
        {n > 0 && <text className={`measure-board__label${free.has(k) ? ' is-a' : ''}`} style={{ fontSize: 12 }} x={xOfBar(k)} y={PLOT.base - n * unit - (bars.mode === 'bars' ? 9 : 16)}>{fmt(n)}</text>}
      </g>)}
      {bars.title && <text className="measure-board__label" style={{ fontSize: 12 }} x={(PLOT.x0 + PLOT.x1) / 2} y={PLOT.base + (tight ? 44 : 34)}>{bars.title}</text>}
    </>
    const list = v.map((n, k) => `${bars.labels[k]} ${fmt(n)}`).join(', ')
    spoken = `${bars.mode === 'bars' ? 'Bar chart' : 'Line graph'}: ${list}.`
    if (bars.show === 'mean' && bars.xs && !ask) {
      spoken += ` Total ${fmt(sum)}, mean ${sum ? fmt(fx / sum, 1) : 'none'}.`
      footer = <span aria-hidden="true">Σfx <span className="angle-board__n c0">{fmt(fx)}</span> ÷ Σf <span className="angle-board__n c1">{fmt(sum)}</span> = {pill(sum ? fmt(fx / sum, 2) : '–')}</span>
    } else if (bars.show === 'total' && !ask) {
      spoken += ` Total ${fmt(sum)}.`
      footer = <span aria-hidden="true">Total {pill(fmt(sum))}</span>
    } else {
      const k = freeOf(bars)[which]
      footer = <span aria-hidden="true">{bars.labels[k]} = <span className="angle-board__n c2">{fmt(v[k])}</span></span>
    }
  } else if (pict) {
    const free = new Set(freeOf(pict)), S = PICT.size
    drawing = <>
      {pict.labels.map((label, k) => <g key={k}>
        <text className="measure-board__label" style={{ textAnchor: 'start', ...small(label, 90) }} x={8} y={rowY(k)}>{label}</text>
        <path className="measure-board__grid" d={`M${PICT.x0 - 8} ${rowY(k) + PICT.row / 2} L${W - 6} ${rowY(k) + PICT.row / 2}`} />
        {Array.from({ length: Math.ceil(v[k] / 4) }, (_, i) => {
          const x = PICT.x0 + i * (S + PICT.gap), y = rowY(k) - S / 2, part = Math.min(4, v[k] - i * 4)
          // A picture is a square of four quarters, filled in reading order: a half is the top two.
          const cells = [[0, 0], [1, 0], [0, 1], [1, 1]].slice(0, part)
          return <g key={i}>
            {cells.map(([cx, cy], c) => <rect key={c} className={free.has(k) ? 'measure-board__ghost is-fit' : 'ns-fig__shape is-part'} x={x + cx * S / 2} y={y + cy * S / 2} width={S / 2} height={S / 2} />)}
          </g>
        })}
      </g>)}
      <path className="measure-board__grid is-axis" d={`M${PICT.x0 - 8} 18 L${PICT.x0 - 8} ${rowY(pict.labels.length - 1) + PICT.row / 2}`} />
    </>
    const k = freeOf(pict)[which]
    spoken = `Pictogram, one picture stands for ${pict.key}: ${pict.labels.map((l, i) => `${l} ${quarters(v[i])} pictures`).join(', ')}.`
    footer = ask ? <span aria-hidden="true">{pict.labels[k]}: <span className="angle-board__n c2">{quarters(v[k])}</span> pictures</span>
      : <span aria-hidden="true">{pict.labels[k]}: <span className="angle-board__n c0">{quarters(v[k])}</span> × <span className="angle-board__n c1">{pict.key}</span> = {pill(fmt(v[k] / 4 * pict.key))}</span>
  } else if (spec.mode === 'pie') {
    let turn = 0
    const slices = v.map((n, k) => { const from = turn; turn += n / total * 360; return { from, to: turn, k } })
    const pt = (deg: number, r = PIE.r) => ({ x: PIE.x + r * Math.sin(deg * Math.PI / 180), y: PIE.y - r * Math.cos(deg * Math.PI / 180) })
    const angle = (k: number) => v[k] / total * 360
    drawing = <>
      <circle className="ns-fig__shape is-empty" cx={PIE.x} cy={PIE.y} r={PIE.r} />
      {slices.map(({ from, to, k }) => {
        if (to - from <= 0) return null
        const a = pt(from), b = pt(to), big = to - from > 180 ? 1 : 0, mid = pt((from + to) / 2, PIE.r * 0.62)
        const d = to - from >= 359.99 ? `M${PIE.x} ${PIE.y - PIE.r} A${PIE.r} ${PIE.r} 0 1 1 ${PIE.x - 0.01} ${PIE.y - PIE.r} Z` : `M${PIE.x} ${PIE.y} L${a.x} ${a.y} A${PIE.r} ${PIE.r} 0 ${big} 1 ${b.x} ${b.y} Z`
        return <g key={k}>
          <path className={k === edge ? 'measure-board__ghost is-fit' : 'ns-fig__shape is-empty'} d={d} />
          {to - from >= 24 && <text className={`measure-board__label${k === edge ? ' is-a' : ''}`} style={{ fontSize: 12 }} x={mid.x} y={mid.y}>{ask && k !== edge ? '' : `${fmt(angle(k), 1)}°`}</text>}
        </g>
      })}
      {spec.labels.map((label, k) => <text key={k} className={`measure-board__label${k === edge ? ' is-a' : ''}`} style={{ textAnchor: 'start', fontSize: 13 }} x={204} y={30 + k * 22}>{ask ? label : `${label} ${fmt(v[k])}`}</text>)}
    </>
    spoken = ask ? `Pie chart: ${spec.labels[edge]} is ${fmt(angle(edge), 1)} degrees.` : `Pie chart of ${total}: ${v.map((n, k) => `${spec.labels[k]} ${n}, ${fmt(angle(k), 1)} degrees`).join('; ')}.`
    footer = ask ? <span aria-hidden="true">{spec.labels[edge]} = <span className="angle-board__n c2">{fmt(angle(edge), 1)}°</span></span>
      : <span aria-hidden="true">{spec.labels[edge]}: <span className="angle-board__n c0">{v[edge]}</span> ÷ <span className="angle-board__n c1">{total}</span> × 360 = {pill(`${fmt(angle(edge), 1)}°`)}</span>
  } else {
    const s = sc!, tx = niceStep(s.x[1] - s.x[0]), ty = niceStep(s.y[1] - s.y[0])
    const xt = Array.from({ length: Math.floor((s.x[1] - s.x[0]) / tx + 1e-9) + 1 }, (_, k) => s.x[0] + k * tx)
    const yt = Array.from({ length: Math.floor((s.y[1] - s.y[0]) / ty + 1e-9) + 1 }, (_, k) => s.y[0] + k * ty)
    const line = s.move === 'line', pts = line ? s.points : [...s.points, [v[0], v[1]] as [number, number]]
    const yAt = (x: number) => v[0] + (v[1] - v[0]) * (x - s.x[0]) / (s.x[1] - s.x[0])
    const above = line ? s.points.filter(p => p[1] > yAt(p[0]) + 1e-9).length : 0, below = line ? s.points.filter(p => p[1] < yAt(p[0]) - 1e-9).length : 0
    const cross = (p: [number, number], k: number, lit?: boolean) => <path key={k} className={`ns-fig__line is-thin${lit ? ' is-lit' : ''}`} style={lit ? { strokeWidth: 3 } : undefined} d={`M${sx(p[0]) - 5} ${sy(p[1]) - 5} l10 10 m0 -10 l-10 10`} />
    drawing = <>
      {xt.map(t => <g key={`x${t}`}><path className="measure-board__grid" d={`M${sx(t)} ${PLOT.top} L${sx(t)} ${PLOT.base}`} /><text className="measure-board__label" style={{ fontSize: 11 }} x={sx(t)} y={PLOT.base + 13}>{fmt(t)}</text></g>)}
      {yt.map(t => <g key={`y${t}`}><path className="measure-board__grid" d={`M${PLOT.x0} ${sy(t)} L${PLOT.x1} ${sy(t)}`} /><text className="measure-board__label" style={{ fontSize: 11 }} x={PLOT.x0 - 16} y={sy(t)}>{fmt(t)}</text></g>)}
      <path className="measure-board__grid is-axis" fill="none" d={`M${PLOT.x0} ${PLOT.top} L${PLOT.x0} ${PLOT.base} L${PLOT.x1} ${PLOT.base}`} />
      <text className="measure-board__label" style={{ fontSize: 12 }} x={(PLOT.x0 + PLOT.x1) / 2} y={PLOT.base + 32}>{s.x[2]}</text>
      <text className="measure-board__label" style={{ fontSize: 12 }} transform={`translate(10 ${(PLOT.top + PLOT.base) / 2}) rotate(-90)`}>{s.y[2]}</text>
      {s.points.map((p, k) => cross(p, k))}
      {line && <path className="ns-fig__line is-lit" style={{ strokeWidth: 3 }} d={`M${sx(s.x[0])} ${sy(v[0])} L${sx(s.x[1])} ${sy(v[1])}`} />}
      {line && s.readAt !== undefined && !ask && <path className="ns-fig__line is-mirror" d={`M${sx(s.readAt)} ${PLOT.base} L${sx(s.readAt)} ${sy(yAt(s.readAt))} L${PLOT.x0} ${sy(yAt(s.readAt))}`} />}
      {!line && cross([v[0], v[1]], -1, true)}
    </>
    if (line) {
      const read = s.readAt !== undefined ? fmt(yAt(s.readAt), 0) : ''
      spoken = `Line of best fit: ${above} points above it, ${below} below.${s.readAt !== undefined && !ask ? ` At ${s.readAt} it reads ${read}.` : ''}`
      footer = <span aria-hidden="true">Above <span className="angle-board__n c0">{above}</span> Below <span className="angle-board__n c1">{below}</span>{s.readAt !== undefined && !ask && <> At {fmt(s.readAt)}: {pill(read)}</>}</span>
    } else {
      const word = correlation(pts)
      spoken = ask ? `The new point is at ${fmt(v[0])}, ${fmt(v[1])}.` : `The new point is at ${fmt(v[0])}, ${fmt(v[1])}: ${word}.`
      footer = ask ? <span aria-hidden="true">Point (<span className="angle-board__n c0">{fmt(v[0])}</span>, <span className="angle-board__n c1">{fmt(v[1])}</span>)</span>
        : <span aria-hidden="true">({fmt(v[0])}, {fmt(v[1])}) {pill(word)}</span>
    }
  }

  const what = { bars: 'Drag a bar up or down; Tab moves to the next bar and the arrow keys change it.', line: 'Drag a point up or down; Tab moves to the next point and the arrow keys change it.', pictogram: 'Drag along a row to add or take away pictures, a quarter at a time; Tab moves to the next row.', pie: 'Drag the edge of the slice round the circle, or use the arrow keys.', scatter: sc?.move === 'line' ? 'Drag either end of the line up or down; Tab swaps ends.' : 'Drag the new point, or use the arrow keys.' }[spec.mode]
  return <div className={`angle-board measure-board chart-board${held ? ' is-held' : ''}`}>
    <svg ref={svg} className="angle-board__surface" viewBox={`0 0 ${W} ${H}`} role="application" tabIndex={0} aria-label={`Chart board. ${what}`} aria-describedby={`${id}-sum`}
      onPointerDown={event => {
        if (disabled) return
        event.currentTarget.setPointerCapture(event.pointerId); setHeld(true)
        const p = toLocal(event)
        const pick = p ? nearest(p) : 0
        setWhich(pick); move(p, pick)
      }}
      onPointerMove={event => { if (held) move(toLocal(event)) }} onPointerUp={() => setHeld(false)} onPointerCancel={() => setHeld(false)} onKeyDown={key}>
      {drawing}
      {handles.map((h, k) => <circle key={k} className="angle-board__handle" cx={h.x} cy={h.y} r={held && k === which ? 13 : k === which && handles.length > 1 ? 12 : 11} />)}
    </svg>
    <p className="angle-board__sum" id={`${id}-sum`} aria-live="polite"><span className="sr-only">{spoken}</span>{footer}</p>
  </div>
}
