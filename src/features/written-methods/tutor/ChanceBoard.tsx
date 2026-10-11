'use client'

import { useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactElement } from 'react'
import './AngleBoard.css'

/*
 * The chance board (Probability and statistics lessons 1 to 9): a play screen for each idea, built like the measuring
 * board (MeasureBoard.tsx). The student drags a handle, with a finger, the mouse or the arrow keys, or presses a button,
 * and the numbers under the picture follow it.
 *
 * - scale (P1): drag the arrow along the probability scale. It reads as a decimal, a fraction and a percentage, and
 *   says how likely that is: impossible, unlikely, even, likely or certain.
 * - tree (P3): drag the chance of winning each of two events. The tree's four paths multiply along their branches, and
 *   however the chances change, the four answers add up to 1.
 * - spin (P4): spin a fair four-part spinner once, 10 or 100 times. The relative frequency of landing on 1 wobbles at
 *   first and settles near the probability, ¼, the more times it spins.
 * - average (P8): drag the last value of a small data set up and down. The mean follows it; the median and mode
 *   barely move, so one outlier pulls the mean but not the median, and stretches the range.
 */

export type ChanceBoardSpec = { mode: 'scale' | 'tree' | 'spin' | 'average' }

type P = { x: number; y: number }
const W = 320, H = 220
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
const fmt = (n: number, dp = 2) => Number(n.toFixed(dp)).toString()
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a
/** A twentieth as a fraction in its simplest form: 7/20, 1/4, 1/2. */
const twentieths = (n: number) => { const g = gcd(n, 20) || 1; return n === 0 ? '0' : n === 20 ? '1' : `${n / g}/${20 / g}` }
const likelihood = (p: number) => p === 0 ? 'impossible' : p === 1 ? 'certain' : p === 0.5 ? 'even chance' : p < 0.5 ? 'unlikely' : 'likely'

/* scale: the line from 0 to 1. tree: two sliders, one for each event. average: the data's bars. */
const SCALE = { x0: 58, x1: 262, y: 120 }
const SLIDERS = [{ y: 178, label: 'Event 1' }, { y: 206, label: 'Event 2' }], SLIDE = { x0: 120, x1: 290 }
const DATA = [3, 5, 5, 6, 8, 9], BARS = { x0: 18, w: 26, gap: 9, base: 200, unit: 8 }

export function ChanceBoard({ spec }: { spec: ChanceBoardSpec }) {
  const start: Record<ChanceBoardSpec['mode'], number[]> = { scale: [13], tree: [6, 7], spin: [], average: [7] }
  const [v, setV] = useState(start[spec.mode])
  const [which, setWhich] = useState(0)
  const [held, setHeld] = useState(false)
  const [moved, setMoved] = useState(false)
  const [spins, setSpins] = useState<number[]>([])
  const svg = useRef<SVGSVGElement>(null)
  const id = useId()
  const set = (next: number[]) => { setV(next); setMoved(true) }

  const from = (p: P, pick: number): number[] | null => {
    if (spec.mode === 'scale') return [clamp(Math.round((p.x - SCALE.x0) / (SCALE.x1 - SCALE.x0) * 20), 0, 20)]
    if (spec.mode === 'tree') { const next = [...v]; next[pick] = clamp(Math.round((p.x - SLIDE.x0) / (SLIDE.x1 - SLIDE.x0) * 10), 0, 10); return next }
    if (spec.mode === 'average') return [clamp(Math.round((BARS.base - p.y) / BARS.unit), 1, 20)]
    return null
  }
  const toLocal = (event: PointerEvent): P | null => {
    const m = svg.current?.getScreenCTM()
    if (!m) return null
    const q = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse())
    return { x: q.x, y: q.y }
  }
  const move = (p: P | null, pick = which) => { const next = p && from(p, pick); if (next && next.join() !== v.join()) set(next) }
  const key = (event: KeyboardEvent) => {
    const step = event.key === 'ArrowRight' || event.key === 'ArrowUp' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -1 : 0
    if (!step || spec.mode === 'spin') return
    event.preventDefault()
    const vertical = event.key === 'ArrowUp' || event.key === 'ArrowDown'
    if (spec.mode === 'scale') set([clamp(v[0] + step, 0, 20)])
    if (spec.mode === 'average') set([clamp(v[0] + step, 1, 20)])
    // The tree: left and right change event 1, up and down event 2.
    if (spec.mode === 'tree') { const k = vertical ? 1 : 0, next = [...v]; next[k] = clamp(v[k] + step, 0, 10); set(next) }
  }
  const spin = (times: number) => {
    setSpins(list => [...list, ...Array.from({ length: times }, () => 1 + Math.floor(Math.random() * 4))])
    setMoved(true)
  }

  let drawing: ReactElement
  let handles: P[] = []
  let footer: ReactElement
  let spoken: string
  const bump = moved ? `${v.join()}-${spins.length}` : 'still'
  const pill = (text: string) => <strong className={`angle-board__total${moved ? ' is-moved' : ''}`} key={bump}>{text}</strong>

  if (spec.mode === 'scale') {
    const n = v[0], p = n / 20, x = SCALE.x0 + p * (SCALE.x1 - SCALE.x0)
    handles = [{ x, y: SCALE.y - 34 }]
    drawing = <>
      <path className="ns-fig__line" d={`M${SCALE.x0} ${SCALE.y} L${SCALE.x1} ${SCALE.y}`} />
      {[0, 0.25, 0.5, 0.75, 1].map(t => { const tx = SCALE.x0 + t * (SCALE.x1 - SCALE.x0); return <g key={t}>
        <path className="ns-fig__line is-thin" d={`M${tx} ${SCALE.y - (t * 4 % 2 ? 6 : 10)} L${tx} ${SCALE.y + (t * 4 % 2 ? 6 : 10)}`} />
        {t * 4 % 2 === 0 && <text className="measure-board__label" x={tx} y={SCALE.y + 26}>{t === 0.5 ? '½' : t}</text>}
      </g> })}
      <text className="measure-board__label is-c" x={SCALE.x0} y={SCALE.y + 52}>Impossible</text>
      <text className="measure-board__label is-c" x={(SCALE.x0 + SCALE.x1) / 2} y={SCALE.y + 52}>Even</text>
      <text className="measure-board__label is-c" x={SCALE.x1} y={SCALE.y + 52}>Certain</text>
      <path className="ns-fig__line is-lit" d={`M${x} ${SCALE.y - 24} L${x} ${SCALE.y - 4}`} />
      <path className="ns-fig__line is-lit is-head" d={`M${x - 6} ${SCALE.y - 13} L${x} ${SCALE.y - 4} L${x + 6} ${SCALE.y - 13}`} />
      <text className="measure-board__label is-big is-a" x={clamp(x, 40, 280)} y={SCALE.y - 64}>{likelihood(p)}</text>
    </>
    spoken = `The arrow is at ${fmt(p)}, which is ${twentieths(n)} or ${Math.round(p * 100)}%: ${likelihood(p)}.`
    footer = <span aria-hidden="true"><span className="angle-board__n c0">{fmt(p)}</span> = <span className="angle-board__n c1">{twentieths(n)}</span> = {pill(`${Math.round(p * 100)}%`)}</span>
  } else if (spec.mode === 'tree') {
    const [a, b] = v.map(k => k / 10)
    const ps = [a * b, a * (1 - b), (1 - a) * b, (1 - a) * (1 - b)]
    const root = { x: 18, y: 78 }, mid = [{ x: 98, y: 38 }, { x: 98, y: 118 }]
    const leaf = [{ x: 184, y: 18 }, { x: 184, y: 58 }, { x: 184, y: 98 }, { x: 184, y: 138 }]
    const names = ['Win, win', 'Win, lose', 'Lose, win', 'Lose, lose']
    handles = SLIDERS.map((s, k) => ({ x: SLIDE.x0 + v[k] / 10 * (SLIDE.x1 - SLIDE.x0), y: s.y }))
    drawing = <>
      {mid.map((m, i) => <g key={`m${i}`}>
        <path className="ns-fig__line is-thin" d={`M${root.x} ${root.y} L${m.x} ${m.y}`} />
        <text className="measure-board__label is-c" x={(root.x + m.x) / 2 - 4} y={(root.y + m.y) / 2 + (i ? 12 : -12)}>{fmt(i ? 1 - a : a, 1)}</text>
        {[0, 1].map(j => { const l = leaf[2 * i + j]; return <g key={j}>
          <path className="ns-fig__line is-thin" d={`M${m.x} ${m.y} L${l.x} ${l.y}`} />
          <text className="measure-board__label is-a" x={(m.x + l.x) / 2} y={(m.y + l.y) / 2 + (j ? 11 : -11)}>{fmt(j ? 1 - b : b, 1)}</text>
          <text className="measure-board__label" x={l.x + 6} y={l.y} style={{ textAnchor: 'start' }}>{names[2 * i + j]}</text>
          <text className="measure-board__label is-h" x={l.x + 92} y={l.y}>{fmt(ps[2 * i + j])}</text>
        </g> })}
      </g>)}
      {SLIDERS.map((s, k) => <g key={s.label}>
        <text className="measure-board__label" x={36} y={s.y}>{s.label}</text>
        <path className="ns-fig__line is-thin" d={`M${SLIDE.x0} ${s.y} L${SLIDE.x1} ${s.y}`} />
        <text className="measure-board__label is-big" x={90} y={s.y} style={{ fill: k ? '#7c3aed' : '#b45309' }}>{fmt(v[k] / 10, 1)}</text>
      </g>)}
    </>
    spoken = `Event 1 is won with probability ${fmt(a, 1)}, event 2 with ${fmt(b, 1)}. Win both ${fmt(ps[0])}, win then lose ${fmt(ps[1])}, lose then win ${fmt(ps[2])}, lose both ${fmt(ps[3])}. They add up to 1.`
    footer = <span aria-hidden="true">{ps.map((q, k) => <span key={k}>{k ? ' + ' : ''}<span className="angle-board__n c0">{fmt(q)}</span></span>)} = {pill('1')}</span>
  } else if (spec.mode === 'spin') {
    const ones = spins.filter(s => s === 1).length, total = spins.length, rf = total ? ones / total : 0
    const O = { x: 82, y: 100 }, r = 64, last = spins.at(-1)
    // The pointer stops in the middle of the part it landed on: 1 is top right, then clockwise.
    const angle = last ? (last - 1) * 90 + 45 : 20
    const tip = { x: O.x + 46 * Math.sin(angle * Math.PI / 180), y: O.y - 46 * Math.cos(angle * Math.PI / 180) }
    const bar = { x: 186, w: 110, top: 34, bottom: 174 }, yOf = (q: number) => bar.bottom - q * 2 * (bar.bottom - bar.top)
    drawing = <>
      <circle className="ns-fig__shape is-empty" cx={O.x} cy={O.y} r={r} />
      <path className="ns-fig__shape is-part" d={`M${O.x} ${O.y} L${O.x} ${O.y - r} A${r} ${r} 0 0 1 ${O.x + r} ${O.y} Z`} />
      <path className="ns-fig__line is-thin" d={`M${O.x - r} ${O.y} L${O.x + r} ${O.y} M${O.x} ${O.y - r} L${O.x} ${O.y + r}`} />
      {[1, 2, 3, 4].map(k => { const a = ((k - 1) * 90 + 45) * Math.PI / 180; return <text key={k} className="measure-board__label is-big" x={O.x + 40 * Math.sin(a)} y={O.y - 40 * Math.cos(a)}>{k}</text> })}
      <path className="ns-fig__line is-x" d={`M${O.x} ${O.y} L${tip.x} ${tip.y}`} />
      <circle className="ns-fig__point" cx={O.x} cy={O.y} r="4.5" />
      <path className="measure-board__grid is-axis" d={`M${bar.x} ${bar.bottom} L${bar.x + bar.w} ${bar.bottom} M${bar.x} ${bar.top - 6} L${bar.x} ${bar.bottom}`} />
      <path className="ns-fig__line is-mirror" d={`M${bar.x} ${yOf(0.25)} L${bar.x + bar.w} ${yOf(0.25)}`} />
      <text className="measure-board__label" x={bar.x - 14} y={yOf(0.25)}>¼</text>
      <text className="measure-board__label" x={bar.x - 14} y={yOf(0.5)}>½</text>
      {total > 0 && <rect className="measure-board__ghost is-fit" x={bar.x + 30} y={yOf(Math.min(rf, 0.5))} width={50} height={bar.bottom - yOf(Math.min(rf, 0.5))} />}
      <text className="measure-board__label is-a" x={bar.x + 55} y={bar.bottom + 16}>{total ? fmt(rf, 3) : 'no spins'}</text>
    </>
    spoken = total ? `Spun ${total} times and landed on 1 ${ones} times: relative frequency ${fmt(rf, 3)}. The probability of 1 is a quarter, 0.25.` : 'Not spun yet. The probability of landing on 1 is a quarter, 0.25.'
    footer = <span aria-hidden="true">{total ? <>1 came up <span className="angle-board__n c0">{ones}</span> of <span className="angle-board__n c1">{total}</span> times = {pill(fmt(rf, 3))}</> : <>P(1) = ¼ = 0.25. Spin it!</>}</span>
  } else {
    const data = [...DATA, v[0]], sorted = [...data].sort((a, b) => a - b)
    const mean = data.reduce((s, n) => s + n, 0) / data.length, median = sorted[3], range = sorted[6] - sorted[0]
    const counts = new Map<number, number>(); data.forEach(n => counts.set(n, (counts.get(n) ?? 0) + 1))
    const top = Math.max(...counts.values()), modes = [...counts].filter(([, c]) => c === top && c > 1).map(([n]) => n)
    const xOf = (k: number) => BARS.x0 + k * (BARS.w + BARS.gap)
    handles = [{ x: xOf(6) + BARS.w / 2, y: BARS.base - v[0] * BARS.unit }]
    drawing = <>
      <path className="measure-board__grid is-axis" d={`M${BARS.x0 - 8} ${BARS.base} L${xOf(7)} ${BARS.base}`} />
      {data.map((n, k) => <g key={k}>
        <rect className={k === 6 ? 'measure-board__ghost is-fit' : 'ns-fig__shape'} x={xOf(k)} y={BARS.base - n * BARS.unit} width={BARS.w} height={n * BARS.unit} />
        <text className="measure-board__label" x={xOf(k) + BARS.w / 2} y={BARS.base - n * BARS.unit - 10}>{n}</text>
      </g>)}
      <path className="ns-fig__line is-mirror" d={`M${BARS.x0 - 8} ${BARS.base - mean * BARS.unit} L${xOf(7)} ${BARS.base - mean * BARS.unit}`} />
      <text className="measure-board__label is-c" x={xOf(7) + 6} y={BARS.base - mean * BARS.unit} style={{ textAnchor: 'start' }}>mean</text>
    </>
    spoken = `The data are ${data.join(', ')}. Mean ${fmt(mean, 1)}, median ${median}, mode ${modes.join(' and ') || 'none'}, range ${range}.`
    footer = <span aria-hidden="true">Mean {pill(fmt(mean, 1))} Median <span className="angle-board__n c0">{median}</span> Mode <span className="angle-board__n c1">{modes.join(', ') || '–'}</span> Range <span className="angle-board__n c2">{range}</span></span>
  }

  const what = { scale: 'Drag the arrow along the scale, or use the arrow keys.', tree: 'Drag along either slider to change the chance of winning each event; left and right keys change event 1, up and down event 2.', spin: 'Press a button to spin the spinner.', average: 'Drag the last bar up or down, or use the arrow keys.' }[spec.mode]
  const surface = <svg ref={svg} className="angle-board__surface" viewBox={`0 0 ${W} ${H}`} role="application" tabIndex={spec.mode === 'spin' ? -1 : 0} aria-label={`Chance board. ${what}`} aria-describedby={`${id}-sum`}
    onPointerDown={event => {
      if (spec.mode === 'spin') return
      event.currentTarget.setPointerCapture(event.pointerId); setHeld(true)
      const p = toLocal(event)
      // On the tree, the slider nearest the finger is the one it moves.
      const pick = spec.mode === 'tree' && p ? (Math.abs(p.y - SLIDERS[0].y) < Math.abs(p.y - SLIDERS[1].y) ? 0 : 1) : 0
      setWhich(pick); move(p, pick)
    }}
    onPointerMove={event => { if (held) move(toLocal(event)) }} onPointerUp={() => setHeld(false)} onPointerCancel={() => setHeld(false)} onKeyDown={key}>
    {drawing}
    {handles.map((h, k) => <circle key={k} className="angle-board__handle" cx={h.x} cy={h.y} r={held && k === which ? 13 : 11} />)}
  </svg>
  return <div className={`angle-board measure-board chance-board${held ? ' is-held' : ''}`}>
    {surface}
    {spec.mode === 'spin' && <div className="angle-board__sides">
      {[1, 10, 100].map(n => <button key={n} type="button" className="angle-board__side" onClick={() => spin(n)}>{n === 1 ? 'Spin once' : `Spin ${n}`}</button>)}
      <button type="button" className="angle-board__side" disabled={!spins.length} onClick={() => { setSpins([]); setMoved(false) }}>Reset</button>
    </div>}
    <p className="angle-board__sum" id={`${id}-sum`} aria-live="polite"><span className="sr-only">{spoken}</span>{footer}</p>
  </div>
}
