'use client'

import { Fragment, useLayoutEffect, useRef, useState, type ReactNode, type SVGProps } from 'react'
import type { GraphFrame, GraphPoint, GraphTable } from './methodWorking'
import { Powers } from './Powers'

/*
 * The graphs lessons (coordinates, lines, gradient). The graph is drawn on the page's own squared paper: one
 * square of the card's grid is one unit, and the picture is nudged so its axes sit on the card's grid lines (Sunny,
 * 5 Oct: a second grid on top was jarring). Where there is no squared paper behind it, the picture draws the same
 * squares itself. Everything stays inside the grid: arrows end at its edge and every label is kept within it.
 *
 * On it: the axes, straight lines edge to edge, points with their coordinates, and the step from one point to another:
 * across (change in x, amber) and up or down (change in y, biro blue). A line the question gives is plain ink; a line a
 * step draws is biro blue, and green once it is the answer. The points a step reads are ringed in purple, and the
 * numbers it reads on the axes are highlighted, x amber and y biro blue, the same colours as in a point's brackets.
 */

/** One unit: the side of a square of the page's grid (--rv-paper-grid-size). */
export const UNIT = 32
const FAMILY = ['var(--rv-biro)', '#b45309', 'var(--rv-good-ink)', '#7c3aed']
/** x numbers are always amber and y numbers biro blue: on the axes, in a point's brackets and in the working. */
export const AXIS = { x: FAMILY[1], y: FAMILY[0] }
export const fmt = (n: number) => String(n).replace('-', '−')
const fix = (n: number) => n.toFixed(1)
export const coordinate = (p: GraphPoint) => `(${fmt(p.x)}, ${fmt(p.y)})`
/** A point's coordinates with the x in its amber and the y in its biro blue, as on the axes. */
const Pair = ({ x, y }: { x: string; y: string }) => <>(<tspan className="is-x">{x}</tspan>, <tspan className="is-y">{y}</tspan>)</>
/**
 * Text with coloured parts (tspans) and a halo that keeps grid lines off it. Safari ignores paint-order on tspans, so
 * a stroked label draws its halo over its own letters and the digits look doubled; the halo is a copy underneath.
 */
export function HaloText({ children, className, ...props }: SVGProps<SVGTextElement>) {
  return <>
    <text {...props} className={`${className ?? ''} is-halo`} aria-hidden="true">{children}</text>
    <text {...props} className={`${className ?? ''} is-ink`}>{children}</text>
  </>
}
/** A label's box on the picture: its left, right, top and bottom edges, and the baseline its text sits on. */
export type LabelBox = { l: number; r: number; t: number; b: number; base: number }
type Box = Omit<LabelBox, 'base'>
/** What a label must keep off: the axes, their numbers, arrowheads and names, every dot and placed label, and the lines. */
export type LabelRoom = { width: number; height: number; taken: Box[]; segments: { x1: number; y1: number; x2: number; y2: number }[] }
/** How wide a point's brackets are, with their halo: about 7.4px a character at 16px. */
export const labelWidth = (text: string) => text.length * 7.4 + 4
const overlaps = (c: Box, o: Box) => c.l < o.r && c.r > o.l && c.t < o.b && c.b > o.t
/**
 * Where a point's coordinates go: beside the dot at (x, y), `w` wide. The preferred corner first, then the other three,
 * then centred above or below it, then level with the dot on either side, then a row further out. A place is taken
 * only if it stays inside the grid with 3px to spare round everything in `room`. The box chosen joins `room.taken`.
 */
export function placeLabel(x: number, y: number, w: number, prefer: { right: boolean; below: boolean }, room: LabelRoom): LabelBox {
  const box = (right: boolean, base: number) => { const l = right ? x + 10 : x - 10 - w; return { l, r: l + w, t: base - 14, b: base + 4, base } }
  const centred = (base: number) => ({ l: x - w / 2, r: x + w / 2, t: base - 14, b: base + 4, base })
  const row = (below: boolean, far = false) => y + (below ? 25 : -13) + (far ? (below ? 24 : -24) : 0)
  const { right, below } = prefer
  const candidates = [
    box(right, row(below)), box(!right, row(below)), box(right, row(!below)), box(!right, row(!below)),
    centred(row(below)), centred(row(!below)), box(right, y + 5), box(!right, y + 5),
    box(right, row(below, true)), box(!right, row(below, true)), box(right, row(!below, true)), box(!right, row(!below, true)),
  ]
  return fitLabel(candidates, room)
}
/** The first of `candidates` with 3px to spare round everything in `room` (else the first, kept inside the grid); it joins `room.taken`. */
export function fitLabel(candidates: LabelBox[], room: LabelRoom): LabelBox {
  const { width, height, taken, segments } = room
  const crosses = (c: Box) => segments.some(({ x1, y1, x2, y2 }) => {
    for (let i = 0; i <= 24; i++) { const sx = x1 + (x2 - x1) * i / 24, sy = y1 + (y2 - y1) * i / 24; if (sx > c.l && sx < c.r && sy > c.t && sy < c.b) return true }
    return false
  })
  const clear = (c: LabelBox) => {
    const padded = { l: c.l - 3, r: c.r + 3, t: c.t - 3, b: c.b + 3 }
    return c.l >= 3 && c.r <= width - 3 && c.t >= 2 && c.b <= height - 2 && !taken.some(o => overlaps(padded, o)) && !crosses(padded)
  }
  const fallback = candidates[0], w = fallback.r - fallback.l
  const pick = candidates.find(clear) ?? { ...fallback, l: Math.min(Math.max(fallback.l, 3), width - 3 - w), base: Math.min(Math.max(fallback.base, 18), height - 5) }
  const placed = { ...pick, r: pick.l + w, t: pick.base - 14, b: pick.base + 4 }
  taken.push(placed)
  return placed
}
/** The box a dot covers, so no label is put on it (a label keeps a further 3px off it). */
export const dotBox = (x: number, y: number, r = 6) => ({ l: x - r, r: x + r, t: y - r, b: y + r })
/** A table of values: x (amber) along the top, y (biro blue) underneath, one column a point. */
export function ValueTable({ table }: { table: GraphTable }) {
  const cell = (i: number) => `${table.lit === i ? ' is-lit' : ''}${table.answer === i ? ' is-answer' : ''}${table.ask === i ? ' is-ask' : ''}`
  return <table className="ns-graph__table">
    <tbody>
      <tr className="is-x"><th scope="row">x</th>{table.xs.map((x, i) => <td key={i} className={cell(i)}>{fmt(x)}</td>)}</tr>
      <tr className="is-y"><th scope="row">y</th>{table.ys.map((y, i) => <td key={i} className={cell(i)}>{table.ask === i ? '?' : y === null ? '' : fmt(y)}</td>)}</tr>
    </tbody>
  </table>
}
/** A line of working with every (x, y) in it coloured like the axes. */
function Coordinates({ text }: { text: string }) {
  const parts = text.split(/(\(−?[\d.]+, −?[\d.]+\))/)
  return <>{parts.map((part, i) => {
    const pair = /^\((−?[\d.]+), (−?[\d.]+)\)$/.exec(part)
    return pair ? <span key={i} className="ns-graph__pair">(<span className="is-x">{pair[1]}</span>, <span className="is-y">{pair[2]}</span>)</span> : <Powers key={i} text={part} />
  })}</>
}

/** The part of the line through a and b that is inside the grid (Liang–Barsky). */
export function clip(frame: Pick<GraphFrame, 'x' | 'y'>, a: GraphPoint, b: GraphPoint): [GraphPoint, GraphPoint] {
  const dx = b.x - a.x, dy = b.y - a.y
  let low = -Infinity, high = Infinity
  for (const [d, start, min, max] of [[dx, a.x, frame.x[0], frame.x[1]], [dy, a.y, frame.y[0], frame.y[1]]] as const) {
    if (d === 0) continue
    const t1 = (min - start) / d, t2 = (max - start) / d
    low = Math.max(low, Math.min(t1, t2)); high = Math.min(high, Math.max(t1, t2))
  }
  return [{ x: a.x + low * dx, y: a.y + low * dy }, { x: a.x + high * dx, y: a.y + high * dy }]
}

/** The line's name for a screen reader: "y = 3", "x = −2", or the points it goes through. */
function spokenLine(line: NonNullable<GraphFrame['lines']>[number]) {
  if (line.label) return line.label.replace(/−/g, 'minus ')
  return `a straight line through ${coordinate(line.from)} and ${coordinate(line.to)}`
}
function spoken(frame: GraphFrame, plain?: boolean) {
  const parts = [`A grid with x from ${fmt(frame.x[0])} to ${fmt(frame.x[1])} and y from ${fmt(frame.y[0])} to ${fmt(frame.y[1])}.`]
  const own = <T extends { at: number }>(list: T[] = []) => list.filter(part => !plain || part.at < 0)
  for (const line of own(frame.lines)) parts.push(`The line ${spokenLine(line)}.`)
  for (const point of own(frame.points)) parts.push(`A point at ${coordinate(point)}.`)
  if (!plain) {
    for (const leg of (frame.legs ?? []).filter(leg => !leg.dashed)) parts.push(`${leg.from.y === leg.to.y ? 'Across' : leg.to.y > leg.from.y ? 'Up' : 'Down'} ${leg.label}.`)
    for (const line of frame.working ?? []) parts.push(`${line.text}.`)
    if (frame.answer) parts.push(`The answer: ${frame.answer.text}.`)
  }
  return parts.join(' ')
}

/**
 * Lines the picture up with the squared paper behind it: finds the nearest box whose background is the page grid
 * (nothing opaque in between), and returns the nudge that puts the picture's grid lines on its lines. Null when there
 * is no squared paper behind, so the picture draws its own.
 */
function useGridAlignment() {
  const ref = useRef<SVGSVGElement>(null)
  const [shift, setShift] = useState<{ x: number; y: number } | null>(null)
  const shiftRef = useRef(shift)
  shiftRef.current = shift
  useLayoutEffect(() => {
    const svg = ref.current
    if (!svg) return
    let paper: HTMLElement | null = null
    for (let el = svg.parentElement; el; el = el.parentElement) {
      const style = getComputedStyle(el)
      if (style.backgroundImage.includes('linear-gradient') && style.backgroundSize.startsWith(`${UNIT}px ${UNIT}px`)) { paper = el; break }
      if (style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent') break
    }
    const host = paper
    function align() {
      if (!svg) return
      if (!host) { setShift(current => current === null ? current : null); return }
      const box = host.getBoundingClientRect(), style = getComputedStyle(host)
      const originX = box.left + parseFloat(style.borderLeftWidth), originY = box.top + parseFloat(style.borderTopWidth)
      const own = svg.getBoundingClientRect()
      const current = shiftRef.current ?? { x: 0, y: 0 }
      // Where the picture would be without a nudge, and the smallest nudge (−16 to 16) onto the paper's lines.
      const near = (from: number, origin: number) => { const off = ((origin - from) % UNIT + UNIT) % UNIT; return off >= UNIT / 2 ? off - UNIT : off }
      const next = { x: near(own.left - current.x, originX), y: near(own.top - current.y, originY) }
      if (!shiftRef.current || Math.abs(next.x - shiftRef.current.x) > 0.25 || Math.abs(next.y - shiftRef.current.y) > 0.25) setShift(next)
    }
    align()
    const observer = new ResizeObserver(align)
    if (host) observer.observe(host)
    window.addEventListener('resize', align)
    document.fonts?.ready.then(align)
    return () => { observer.disconnect(); window.removeEventListener('resize', align) }
  })
  return { ref, shift }
}

/** The picture so far. `plain` is the question before any working. The step's heading goes above what it adds. */
/** What the graph board (GraphBoard.tsx) draws inside the picture, over the question's own parts and under the highlighted axis numbers. */
export type GraphLive = {
  draw: (at: { px: (x: number) => number; py: (y: number) => number; width: number; height: number; room: LabelRoom }) => ReactNode
  svg?: SVGProps<SVGSVGElement>
}

export function GraphVisual({ frame, heading, plain, focus, live }: { frame: GraphFrame; heading?: ReactNode; plain?: boolean; focus?: boolean; live?: GraphLive }) {
  // Older parts grey out; what the step before added stays clear, because this step works on it (Sunny, 1 Oct).
  // A part with `at` −1 is the question's own picture: it is shown from the start and never greyed.
  const done = (at: number) => focus && !plain && at >= 0 && frame.step > 0 && at < frame.step - 1 ? ' is-done' : ''
  const shown = (at: number) => !plain || at < 0
  const head = (adds: GraphFrame['adds']) => !plain && frame.adds === adds && heading ? <div className="ns-graph__heading">{heading}</div> : null
  const { ref, shift } = useGridAlignment()
  const [x0, x1] = frame.x, [y0, y1] = frame.y
  const width = (x1 - x0) * UNIT, height = (y1 - y0) * UNIT
  const px = (x: number) => (x - x0) * UNIT, py = (y: number) => (y1 - y) * UNIT
  const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i)
  const axisX = Math.min(Math.max(0, x0), x1), axisY = Math.min(Math.max(0, y0), y1)
  const lines = (frame.lines ?? []).filter(line => shown(line.at))
  const points = (frame.points ?? []).filter(point => shown(point.at))
  const legs = plain ? [] : frame.legs ?? []
  const working = plain ? [] : frame.working ?? []
  const marks = plain ? [] : frame.marks ?? []
  const markOf = (axis: 'x' | 'y', value: number) => marks.find(mark => mark.axis === axis && mark.value === value)

  // What a point's brackets keep off: the axes with their numbers, arrowheads and names, every dot, the lines, and each
  // label once it is placed (Sunny, 7 Oct: nothing on the axis numbers, the arrows or another label).
  const ax = px(axisX) + 0.5, ay = py(axisY) + 0.5
  const room: LabelRoom = {
    width, height,
    taken: [
      { l: 0, r: width, t: ay - 2, b: ay + 2 }, { l: ax - 2, r: ax + 2, t: 0, b: height },
      { l: ax - 7, r: ax + 7, t: 0, b: 10 }, { l: ax + 7, r: ax + 18, t: 3, b: 18 }, { l: width - 10, r: width, t: ay - 7, b: ay + 7 }, { l: width - 17, r: width - 3, t: ay + 6, b: ay + 22 },
      ...range(x0, x1).filter(x => x !== axisX && x !== x0 && x !== x1).map(x => { const half = fmt(x).length * 4.5 + 5; return { l: px(x) + 0.5 - half, r: px(x) + 0.5 + half, t: ay + 3, b: ay + 23 } }),
      ...range(y0, y1).filter(y => y !== axisY && y !== y0 && y !== y1).map(y => ({ l: ax - 10 - fmt(y).length * 9, r: ax - 2, t: py(y) - 9, b: py(y) + 10 })),
      { l: ax - 20, r: ax - 2, t: ay + 3, b: ay + 23 },
      ...points.map(point => dotBox(px(point.x) + 0.5, py(point.y) + 0.5)),
    ],
    segments: lines.map(line => { const [a, b] = line.segment ? [line.from, line.to] : clip(frame, line.from, line.to); return { x1: px(a.x) + 0.5, y1: py(a.y) + 0.5, x2: px(b.x) + 0.5, y2: py(b.y) + 0.5 } }),
  }

  /** Keeps a label of `text` at (x, y) inside the grid: `size` is its font size, `anchor` how it hangs off x. */
  function inside(x: number, y: number, text: string, size: number, anchor: 'start' | 'middle' | 'end') {
    const w = text.length * size * 0.56
    const left = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2
    const dx = Math.max(3 - left, Math.min(0, width - 3 - (left + w)))
    return { x: x + dx, y: Math.min(Math.max(y, size + 2), height - 4) }
  }

  /** The axis numbers: the plain ones under everything, the highlighted ones on top so a ring never hides them. */
  const axisNumbers = (marked: boolean) => <g className="ns-graph__numbers">
    {range(x0, x1).filter(x => x !== axisX && x !== x0 && x !== x1 && !!markOf('x', x) === marked).map(x => {
      const mark = markOf('x', x), label = fmt(x)
      return <g key={`nx${x}`} className={mark ? 'is-marked' : undefined} style={mark ? { color: AXIS.x } : undefined}>
        {mark && <rect x={fix(px(x) + 0.5 - label.length * 4.5 - 5)} y={fix(py(axisY) + 4)} width={fix(label.length * 9 + 10)} height="19" rx="9.5" />}
        <text x={fix(px(x) + 0.5)} y={fix(py(axisY) + 18)}>{label}</text>
      </g>
    })}
    {range(y0, y1).filter(y => y !== axisY && y !== y0 && y !== y1 && !!markOf('y', y) === marked).map(y => {
      const mark = markOf('y', y), label = fmt(y)
      return <g key={`ny${y}`} className={mark ? 'is-marked' : undefined} style={mark ? { color: AXIS.y } : undefined}>
        {mark && <rect x={fix(px(axisX) - 4 - label.length * 9 - 6)} y={fix(py(y) - 9)} width={fix(label.length * 9 + 10)} height="19" rx="9.5" />}
        <text className="is-y" x={fix(px(axisX) - 5)} y={fix(py(y) + 5)}>{label}</text>
      </g>
    })}
    {(() => {
      const mark = markOf('x', 0) ?? markOf('y', 0)
      if (!!mark !== marked) return null
      return <g className={mark ? 'is-marked' : undefined} style={mark ? { color: AXIS[mark.axis] } : undefined}>
        {mark && <rect x={fix(px(axisX) - 20)} y={fix(py(axisY) + 4)} width="19" height="19" rx="9.5" />}
        <text className="is-y" x={fix(px(axisX) - 5)} y={fix(py(axisY) + 18)}>0</text>
      </g>
    })()}
  </g>

  return <div className={`ns-graph${plain ? ' is-plain' : ''}`} role="img" aria-label={spoken(frame, plain)}>
    {head('picture')}
    {frame.table && <ValueTable table={frame.table} />}
    <svg ref={ref} className={`ns-graph__picture${shift ? '' : ' has-grid'}`} width={width + 1} height={height + 1} viewBox={`0 0 ${width + 1} ${height + 1}`}
      {...live?.svg} style={shift ? { transform: `translate(${fix(shift.x)}px, ${fix(shift.y)}px)`, ...live?.svg?.style } : live?.svg?.style} aria-hidden="true">
      {!shift && <g className="ns-graph__grid">
        {range(x0, x1).map(x => <line key={`gx${x}`} x1={fix(px(x) + 0.5)} x2={fix(px(x) + 0.5)} y1="0" y2={height + 1} />)}
        {range(y0, y1).map(y => <line key={`gy${y}`} x1="0" x2={width + 1} y1={fix(py(y) + 0.5)} y2={fix(py(y) + 0.5)} />)}
      </g>}
      <g className="ns-graph__axes">
        <line x1="0" x2={width - 1} y1={fix(py(axisY) + 0.5)} y2={fix(py(axisY) + 0.5)} />
        <line x1={fix(px(axisX) + 0.5)} x2={fix(px(axisX) + 0.5)} y1="1" y2={height} />
        <path d={`M${width - 9} ${fix(py(axisY) - 5)} L${width - 2} ${fix(py(axisY) + 0.5)} L${width - 9} ${fix(py(axisY) + 6)} M${fix(px(axisX) - 5)} 9 L${fix(px(axisX) + 0.5)} 2 L${fix(px(axisX) + 6)} 9`} />
        <text className="ns-graph__axis-name" x={width - 6} y={fix(py(axisY) + 19)} textAnchor="end">x</text>
        <text className="ns-graph__axis-name" x={fix(px(axisX) + 9)} y="15">y</text>
      </g>
      {axisNumbers(false)}
      {lines.map((line, i) => {
        const [a, b] = line.segment ? [line.from, line.to] : clip(frame, line.from, line.to)
        // The label sits near one end, nudged off the line: the right end of a line across, the bottom of a line up
        // and down (so it doesn't meet a line across the top), and the top end of a sloping line.
        const vertical = a.x === b.x && !line.segment
        const end = vertical ? (a.y < b.y ? a : b) : b.y > a.y || (b.y === a.y && b.x > a.x) ? b : a, other = end === b ? a : b
        const along = { x: px(other.x) - px(end.x), y: py(other.y) - py(end.y) }, size = Math.hypot(along.x, along.y)
        // A line up and down is named at the bottom of the grid, below the axis numbers.
        const at = vertical ? { x: px(end.x), y: height - 8 } : { x: px(end.x) + along.x / size * 30, y: py(end.y) + along.y / size * 30 }
        const kind = line.wrong ? ' is-wrong' : line.answer ? ' is-answer' : line.at >= 0 ? ' is-found' : ''
        // A line across or up and down keeps its name off the axis numbers, the points and their labels: the right end
        // (across) or the bottom (up and down) first, then the other side of the line, then the other end.
        const flat = a.y === b.y && !line.segment
        const fitted = line.label && (flat || vertical) ? (() => {
          const w = line.label.length * 8.6 + 4, box = (l: number, base: number) => ({ l, r: l + w, t: base - 14, b: base + 4, base })
          const lx = px(a.x) + 0.5, ly = py(a.y) + 0.5
          return fitLabel(flat
            ? [box(width - 8 - w, ly - 9), box(width - 8 - w, ly + 23), box(8, ly - 9), box(8, ly + 23), box((width - w) / 2, ly - 9), box((width - w) / 2, ly + 23)]
            : [box(lx + 8, height - 8), box(lx - 8 - w, height - 8), box(lx + 8, 22), box(lx - 8 - w, 22), box(lx + 8, height / 2), box(lx - 8 - w, height / 2)], room)
        })() : null
        const label = fitted ? { x: fitted.l + 2, y: fitted.base } : line.label && inside(at.x + (vertical ? 8 : 0), at.y + (vertical ? 0 : -10), line.label, 17, vertical ? 'start' : 'middle')
        const anchor = fitted ? 'start' : vertical ? 'start' : 'middle'
        return <g key={`l${i}`} className={`ns-graph__line${kind}${done(line.at)}`}>
          <line x1={fix(px(a.x) + 0.5)} y1={fix(py(a.y) + 0.5)} x2={fix(px(b.x) + 0.5)} y2={fix(py(b.y) + 0.5)} />
          {label && <text x={fix(label.x)} y={fix(label.y)} textAnchor={anchor}>{line.label}</text>}
        </g>
      })}
      {legs.map((leg, i) => {
        const across = leg.from.y === leg.to.y
        const ax = px(leg.from.x) + 0.5, ay = py(leg.from.y) + 0.5, bx = px(leg.to.x) + 0.5, by = py(leg.to.y) + 0.5
        const dir = across ? Math.sign(bx - ax) : Math.sign(by - ay)
        const arrow = across ? `M${fix(bx - dir * 8)} ${fix(by - 6)} L${fix(bx)} ${fix(by)} L${fix(bx - dir * 8)} ${fix(by + 6)}` : `M${fix(bx - 6)} ${fix(by - dir * 8)} L${fix(bx)} ${fix(by)} L${fix(bx + 6)} ${fix(by - dir * 8)}`
        // Each size goes outside the triangle the two steps make, so the line through it never crosses a label.
        const other = legs.find(o => o !== leg && (across ? o.to.x === leg.from.x && o.to.y === leg.from.y : o.from.x === leg.to.x && o.from.y === leg.to.y))
        const outside = across ? (other ? other.to.y > other.from.y : leg.from.y <= (y0 + y1) / 2) : (other ? other.to.x > other.from.x : false)
        const anchor = across ? 'middle' as const : outside ? 'end' as const : 'start' as const
        // A size that would sit on an axis (and its numbers) moves to the middle of the leg's longer side of it.
        const [lo, hi, axisAt] = across ? [Math.min(ax, bx), Math.max(ax, bx), px(axisX) + 0.5] : [Math.min(ay, by), Math.max(ay, by), py(axisY) + 0.5]
        const middle = lo < axisAt - 14 && hi > axisAt + 14 && Math.abs((lo + hi) / 2 - axisAt) < 24
          ? (axisAt - lo >= hi - axisAt ? (lo + axisAt) / 2 : (axisAt + hi) / 2) : (lo + hi) / 2
        const label = inside(across ? middle : ax + (outside ? -9 : 9), across ? ay + (outside ? -10 : 22) : middle + 6, leg.label, 18, anchor)
        if (leg.dashed) return <g key={`g${i}`} className={`ns-graph__leg is-dashed is-f${leg.family % 4}${done(leg.at)}`}>
          <line x1={fix(ax)} y1={fix(ay)} x2={fix(bx)} y2={fix(by)} />
        </g>
        return <g key={`g${i}`} className={`ns-graph__leg is-f${leg.family % 4}${done(leg.at)}`}>
          <line x1={fix(ax)} y1={fix(ay)} x2={fix(bx)} y2={fix(by)} />
          <path d={arrow} />
          <text x={fix(label.x)} y={fix(label.y)} textAnchor={anchor}>{leg.label}</text>
        </g>
      })}
      {points.map((point, i) => {
        // The coordinates go beside a point on a line up and down, under a point on a line across, and otherwise
        // above it (below it under the x axis, clear of the axis numbers).
        const onUpDown = lines.some(line => line.from.x === line.to.x && line.from.x === point.x) || points.filter(q => q.x === point.x).length > 2
        const onAcross = !onUpDown && (lines.some(line => line.from.y === line.to.y && line.from.y === point.y) || points.filter(q => q.y === point.y).length > 2)
        const right = point.x <= (x0 + x1) / 2
        // Clear of the purple ring (radius 11) a point gets while it is read.
        const place = point.place ? { x: point.place.dx * 13, y: point.place.dy > 0 ? 27 : -15, anchor: point.place.dx > 0 ? 'start' as const : 'end' as const }
          : onUpDown ? { x: right ? 15 : -15, y: 5, anchor: right ? 'start' as const : 'end' as const }
          : onAcross ? { x: 0, y: 27, anchor: 'middle' as const }
          : { x: right ? 12 : -12, y: point.y < axisY ? 25 : -13, anchor: right ? 'start' as const : 'end' as const }
        const text = point.label ?? coordinate(point)
        // A label in a corner beside its dot keeps off the axes, their numbers and the other labels (Sunny, 7 Oct).
        const cx = px(point.x) + 0.5, cy = py(point.y) + 0.5
        const corner = text !== ''
          ? placeLabel(cx, cy, labelWidth(text), { right: place.anchor === 'start', below: place.y > 0 }, room) : null
        const label = corner ? { x: corner.l + 2, y: corner.base } : inside(cx + place.x, cy + place.y, text, 15, place.anchor)
        const anchor = corner ? 'start' as const : place.anchor
        // An answer point is drawn like a right answer on the graph board: a larger green dot (Sunny's reference, 7 Oct).
        return <g key={`p${i}`} className={`ns-graph__point${point.at >= 0 ? ' is-found' : ''}${point.answer ? ' is-answer' : ''}${done(point.at)}`}>
          <circle cx={fix(px(point.x) + 0.5)} cy={fix(py(point.y) + 0.5)} r={point.answer ? 7 : 5} />
          {text !== '' && <HaloText x={fix(label.x)} y={fix(label.y)} textAnchor={anchor}>{point.label ?? <Pair x={fmt(point.x)} y={fmt(point.y)} />}</HaloText>}
        </g>
      })}
      {live?.draw({ px, py, width, height, room })}
      {!plain && (frame.boxed ?? []).map((point, i) => <circle key={`b${i}`} className="ns-graph__box" cx={fix(px(point.x) + 0.5)} cy={fix(py(point.y) + 0.5)} r="11" />)}
      {axisNumbers(true)}
    </svg>
    {working.map((line, i) => <Fragment key={`w${i}`}>
      {frame.adds === 'lines' && line.at === frame.step && working.findIndex(l => l.at === frame.step) === i && head('lines')}
      <p className={`ns-graph__text is-f${line.family % 4}${done(line.at)}`} aria-hidden="true"><Coordinates text={line.text} /></p>
    </Fragment>)}
    {!plain && frame.answer && <>
      {head('answer')}
      <p className="ns-eq__answer" aria-hidden="true"><Powers text={frame.answer.text} /></p>
    </>}
  </div>
}
