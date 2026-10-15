'use client'

import { Fragment, useLayoutEffect, useRef, useState, type ReactNode, type SVGProps } from 'react'
import { Working } from '../../maths/step-chain/working'
import { GRAPH_SQUARES, GraphWords, InGraphSlot } from './GraphSlot'
import type { AxisScale, GraphFrame, GraphPoint, GraphTable } from './methodWorking'
import { keepWhole } from './methodWorking'
import { Powers } from './Powers'
import { curvePath, valueAt } from './curves'

/*
 * The graphs lessons (coordinates, lines, gradient). The graph is drawn on the page's own squared paper: one
 * square of the card's grid is one unit, and the card's paper is lined up under it, so its axes sit on the paper's
 * lines (Sunny, 5 Oct: a second grid on top was jarring). Every graph is GRAPH_SQUARES squares across and up, in the
 * card's one graph slot (GraphSlot.tsx), so it is the same size and in the same place on every screen; its heading,
 * table and working go in the words beside it. Where there is no squared paper behind it, the picture draws the same
 * squares itself. Everything stays inside the grid: arrows end at its edge and every label is kept within it.
 *
 * On it: the axes, straight lines edge to edge, points with their coordinates, and the step from one point to another:
 * across (change in x, amber) and up or down (change in y, biro blue). A line the question gives is plain ink; a line a
 * step draws is biro blue, and green once it is the answer. The points a step reads are ringed in purple, and the
 * numbers it reads on the axes are highlighted, x amber and y biro blue, the same colours as in a point's brackets.
 */

/** One unit: the side of a square of the page's grid (--rv-paper-grid-size). */
export const UNIT = 32
/** A square of a drawn picture on screen: UNIT times the card's --rv-graph-scale (GraphSlot.tsx). */
export const squareOf = (svg: SVGSVGElement, box = svg.getBoundingClientRect()) => UNIT * box.width / (svg.viewBox.baseVal.width || box.width)
const FAMILY = ['var(--rv-biro)', '#b45309', 'var(--rv-good-ink)', '#7c3aed']
/** x numbers are always amber and y numbers biro blue: on the axes, in a point's brackets and in the working. */
export const AXIS = { x: FAMILY[1], y: FAMILY[0] }
export const fmt = (n: number) => String(n).replace('-', '−')
const fix = (n: number) => n.toFixed(1)
export const coordinate = (p: GraphPoint) => `(${fmt(p.x)}, ${fmt(p.y)})`
/** 9.5 hours → "09:30". */
export const clock = (hours: number) => { const m = Math.round(hours * 60); return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}` }
/** A number on an axis, as that axis writes it: a time on a clock axis. */
export const axisText = (scale: AxisScale | undefined, v: number) => scale?.clock ? clock(v) : fmt(Math.round(v * 1000) / 1000)
/** The numbered values along an axis, other than where the axes cross and the grid's edges: `by` apart on an axis in steps. */
export function ticks(from: number, to: number, cross: number, scale?: AxisScale, end = 1, by = 1) {
  if (!scale) return Array.from({ length: Math.round((to - from) / by) + 1 }, (_, i) => from + i * by).filter(v => v !== cross && v !== from && v !== to)
  // A real-life axis starts where the axes cross; its last number keeps `end` squares clear of the arrow and the axis's name.
  const out: number[] = [], step = scale.per * (scale.every ?? 1)
  for (let v = cross + step; v < to - scale.per * end + 1e-9 && v < to - 1e-9; v += step) out.push(Math.round(v * 1e6) / 1e6)
  return out
}
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
export function fitLabel(candidates: LabelBox[], room: LabelRoom): LabelBox
export function fitLabel(candidates: LabelBox[], room: LabelRoom, optional: true): LabelBox | null
export function fitLabel(candidates: LabelBox[], room: LabelRoom, optional = false): LabelBox | null {
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
  if (optional && !candidates.some(clear)) return null
  const pick = candidates.find(clear) ?? { ...fallback, l: Math.min(Math.max(fallback.l, 3), width - 3 - w), base: Math.min(Math.max(fallback.base, 18), height - 5) }
  const placed = { ...pick, r: pick.l + w, t: pick.base - 14, b: pick.base + 4 }
  taken.push(placed)
  return placed
}
/** The box a dot covers, so no label is put on it (a label keeps a further 3px off it). */
export const dotBox = (x: number, y: number, r = 6) => ({ l: x - r, r: x + r, t: y - r, b: y + r })
/** A table of values: x (amber) along the top, y (biro blue) underneath, one column a point. The y row's heading
 *  can carry the rule, y = 2x − 1, its x amber, so each y in the row says where it comes from. */
export function ValueTable({ table, pick }: { table: GraphTable; pick?: (x: number) => void }) {
  const cell = (i: number) => `${table.lit === i ? ' is-lit' : ''}${table.answer === i ? ' is-answer' : ''}${table.ask === i ? ' is-ask' : ''}`
  // A long table (six columns or more) packs its cells tighter, so it fits a phone.
  return <table className={`ns-graph__table${table.xs.length > 5 ? ' is-long' : ''}`}>
    <tbody>
      <tr className="is-x"><th scope="row">x</th>{table.xs.map((x, i) => <td key={i} className={cell(i)}>{pick
        // On a board the x row is buttons: tap one and the dot goes to that x (Sunny, 15 Oct: how do you know where to drag?).
        ? <button type="button" className="ns-graph__pick" onClick={() => pick(x)} aria-label={`Go to x = ${fmt(x)}`}>{fmt(x)}</button> : fmt(x)}</td>)}</tr>
      <tr className="is-y"><th scope="row">y{table.rule && <span className="ns-graph__rule"> = {table.rule.split('x').flatMap((part, i) => i ? [<span key={i} className="is-x">x</span>, part] : [part])}</span>}</th>{table.ys.map((y, i) => <td key={i} className={cell(i)}>{table.ask === i ? '?' : y === null ? '' : fmt(y)}</td>)}</tr>
    </tbody>
  </table>
}
/** A line of working with every (x, y) in it coloured like the axes. */
/** A working line's colour: families 0 to 3, or 4 for plain ink (an equation with m and c marked in it). */
const family = (f: number) => f === 4 ? 'is-plain' : f === 5 ? 'is-f5' : `is-f${f % 4}`
/** Working text without its colour marks: "[[3|m]]" → "m". */
export const plainWorking = (text: string) => text.replace(/\[\[\d\|([^\]]*)\]\]/g, '$1')
/** A working line: "[[3|−⅓]]" colours −⅓ purple (family 3), so m and c keep their colour as they move (Sunny, 14 Oct). */
function Coordinates({ text }: { text: string }) {
  const marked = text.split(/(\[\[\d\|[^\]]*\]\])/)
  if (marked.length > 1) return <>{marked.map((part, i) => {
    const mark = /^\[\[(\d)\|([^\]]*)\]\]$/.exec(part)
    return mark ? <b key={i} className={`ns-graph__mark is-f${mark[1]}`}>{mark[2]}</b> : <Coordinates key={i} text={part} />
  })}</>
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
  const sc = frame.scale
  const parts = [sc ? `A graph of ${sc.y.name} against ${sc.x.name}, ${sc.x.name} from ${axisText(sc.x, sc.x.start)} and ${sc.y.name} from ${axisText(sc.y, sc.y.start)}.` : `A grid with x from ${fmt(frame.x[0])} to ${fmt(frame.x[1])} and y from ${fmt(frame.y[0])} to ${fmt(frame.y[1])}.`]
  const own = <T extends { at: number }>(list: T[] = []) => list.filter(part => !plain || part.at < 0)
  for (const line of own(frame.lines)) parts.push(`The line ${spokenLine(line)}.`)
  for (const curve of own(frame.curves)) parts.push(`A smooth curve${curve.label ? `, ${curve.label.replace(/−/g, 'minus ')},` : ''} from x = ${fmt(curve.from)} to x = ${fmt(curve.to)}.`)
  for (const point of own(frame.points)) parts.push(`A point at ${coordinate(point)}.`)
  if (!plain) {
    for (const leg of (frame.legs ?? []).filter(leg => !leg.dashed)) parts.push(`${leg.from.y === leg.to.y ? 'Across' : leg.to.y > leg.from.y ? 'Up' : 'Down'} ${leg.label}.`)
    for (const line of frame.working ?? []) parts.push(`${plainWorking(line.text)}.`)
    if (frame.answer) parts.push(`The answer: ${frame.answer.text}.`)
  }
  return parts.join(' ')
}

/**
 * Whether the picture is drawn on squared paper: the nearest box behind it whose background is the page grid (nothing
 * opaque in between). On a lesson card the card sets the square (--rv-graph-scale, the paper's square over UNIT, from
 * useGraphCard in GraphSlot.tsx) and lines its paper up under the graph. On any other paper the picture takes that
 * paper's square and lines the paper up itself. Either way the paper moves, never the picture, so the picture's size
 * can't chase the paper's (Sunny, 12 Oct: graphs flickered between two sizes). Off paper it draws its own squares.
 */
function usePaper() {
  // The picture may be drawn some time after the graph (once it has the card's slot), so this follows the element.
  const [svg, ref] = useState<SVGSVGElement | null>(null)
  const [paper, setPaper] = useState<{ scale?: number } | null>(null)
  useLayoutEffect(() => {
    let host: HTMLElement | null = null, square = UNIT
    for (let el = svg?.parentElement; el; el = el.parentElement) {
      const style = getComputedStyle(el)
      const size = style.backgroundSize.match(/^([\d.]+)px ([\d.]+)px/)
      if (style.backgroundImage.includes('linear-gradient') && size && size[1] === size[2]) { host = el; square = parseFloat(size[1]); break }
      if (style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent') break
    }
    if (!svg || !host || host.matches('.rung-card, .rung-done')) { setPaper(host ? {} : null); return }
    setPaper({ scale: square / UNIT })
    const sheet = host, side = square
    const align = () => {
      const g = svg.getBoundingClientRect(), c = sheet.getBoundingClientRect()
      const wrap = (v: number) => ((v % side) + side) % side
      sheet.style.backgroundPosition = `${wrap(g.left - c.left - sheet.clientLeft + sheet.scrollLeft)}px ${wrap(g.top - c.top - sheet.clientTop + sheet.scrollTop)}px`
    }
    align()
    const observer = new ResizeObserver(align)
    observer.observe(sheet)
    observer.observe(svg)
    return () => { observer.disconnect(); sheet.style.backgroundPosition = '' }
  }, [svg])
  return { ref, paper }
}

/**
 * Every graph GRAPH_SQUARES squares across and up, so every graph is the same size (Sunny, 12 Oct). Each axis grows
 * to that many squares: an axis that starts at 0 or at a real-life start grows at its far end; one either side of 0
 * grows at both ends, the extra square at its longer end, so the question's part stays near the middle. A grid that
 * already needs more squares keeps them (the slot draws it smaller, with its own squares). Boards use the same grid,
 * so a tap lands where the picture shows it.
 */
export function fillGrid<T extends { x: [number, number]; y: [number, number]; scale?: { x: AxisScale; y: AxisScale }; yStep?: number }>(g: T, squares = GRAPH_SQUARES): T {
  const tidy = (n: number) => Math.round(n * 1e6) / 1e6
  const grow = (r: [number, number], per: number, scaled: boolean): [number, number] => {
    const by = squares - Math.round((r[1] - r[0]) / per)
    if (by <= 0) return r
    if (scaled || r[0] >= 0) return [r[0], tidy(r[1] + by * per)]
    if (r[1] <= 0) return [tidy(r[0] - by * per), r[1]]
    const far = Math.ceil(by / 2), near = by - far
    return r[1] >= -r[0] ? [tidy(r[0] - near * per), tidy(r[1] + far * per)] : [tidy(r[0] - far * per), tidy(r[1] + near * per)]
  }
  const x = grow(g.x, g.scale?.x.per ?? 1, !!g.scale), y = grow(g.y, g.scale?.y.per ?? g.yStep ?? 1, !!g.scale)
  return x === g.x && y === g.y ? g : { ...g, x, y }
}

/** The picture so far. `plain` is the question before any working. The step's heading goes above what it adds. */
/** What the graph board (GraphBoard.tsx) draws inside the picture, over the question's own parts and under the highlighted axis numbers. */
export type GraphLive = {
  draw: (at: { px: (x: number) => number; py: (y: number) => number; width: number; height: number; room: LabelRoom }) => ReactNode
  svg?: SVGProps<SVGSVGElement>
  /** A tap on a number in the table's x row (a dot sliding along a rule goes there). */
  pickX?: (x: number) => void
}

export function GraphVisual({ frame: given, heading, plain, focus, live }: { frame: GraphFrame; heading?: ReactNode; plain?: boolean; focus?: boolean; live?: GraphLive }) {
  // Boards fill their grid the same way, so their taps and this picture agree.
  const frame = fillGrid(given)
  // Older parts grey out; what the step before added stays clear, because this step works on it (Sunny, 1 Oct).
  // A part with `at` −1 is the question's own picture: it is shown from the start and never greyed.
  const done = (at: number) => frame.quiet !== undefined && frame.step >= frame.quiet && !plain && at >= 0 && at < frame.step ? ' is-quiet'
    : focus && !plain && at >= 0 && frame.step > 0 && at < frame.step - 1 ? ' is-done' : ''
  const shown = (at: number) => !plain || at < 0
  const head = (adds: GraphFrame['adds']) => !plain && frame.adds === adds && heading ? <div className="ns-graph__heading">{heading}</div> : null
  const { ref, paper } = usePaper()
  const [x0, x1] = frame.x, [y0, y1] = frame.y
  // Real-life axes (graphs lessons 7 and 8): a square is `per` units, and the axes cross at `start`.
  const sx = frame.scale?.x, sy = frame.scale?.y, perX = sx?.per ?? 1, perY = sy?.per ?? frame.yStep ?? 1
  const xName = sx?.name ?? 'x', yName = sy?.name ?? 'y'
  const width = Math.round((x1 - x0) / perX) * UNIT, height = Math.round((y1 - y0) / perY) * UNIT
  // A grid of more squares than the slot holds is drawn smaller, to the slot's size, with its own squares (not the paper's).
  const most = Math.max(width, height) / UNIT, oversize = most > GRAPH_SQUARES
  const onPaper = !!paper && !oversize
  const scale = `${paper?.scale ?? 'var(--rv-graph-scale, 1)'}${oversize ? ` * ${GRAPH_SQUARES / most}` : ''}`
  const px = (x: number) => (x - x0) / perX * UNIT, py = (y: number) => (y1 - y) / perY * UNIT
  const range = (from: number, to: number, per = 1) => Array.from({ length: Math.round((to - from) / per) + 1 }, (_, i) => from + i * per)
  const axisX = sx ? sx.start : Math.min(Math.max(0, x0), x1), axisY = sy ? sy.start : Math.min(Math.max(0, y0), y1)
  const xText = (v: number) => axisText(sx, v), yText = (v: number) => axisText(sy, v)
  // A scaled axis also numbers a value it reads that falls between its numbers (10:30 on an hourly axis).
  const xTicks = ticks(x0, x1, axisX, sx, 1 + xName.length * 7.5 / UNIT), yTicks = ticks(y0, y1, axisY, sy, 1, perY)
  // An axis that counts in steps (frame.yStep) also numbers a value it reads that falls between its numbers.
  const between = !!sy || perY !== 1
  const lines = (frame.lines ?? []).filter(line => shown(line.at))
  const curves = (frame.curves ?? []).filter(curve => shown(curve.at))
  // A curve as short straight pieces inside the grid, so labels keep off it like they keep off a line.
  const curveSegments = curves.flatMap(curve => {
    const lo = Math.max(curve.from, x0), hi = Math.min(curve.to, x1), n = Math.max(2, Math.ceil((hi - lo) * 4)), out = []
    for (let i = 0; i < n; i++) {
      const xa = lo + (hi - lo) * i / n, xb = lo + (hi - lo) * (i + 1) / n, ya = valueAt(curve.coeffs, xa), yb = valueAt(curve.coeffs, xb)
      if (ya >= y0 && ya <= y1 && yb >= y0 && yb <= y1) out.push({ x1: px(xa) + 0.5, y1: py(ya) + 0.5, x2: px(xb) + 0.5, y2: py(yb) + 0.5 })
    }
    return out
  })
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
      { l: ax - 7, r: ax + 7, t: 0, b: 10 }, { l: ax + 7, r: ax + 11 + yName.length * 7.5, t: 3, b: 18 }, { l: width - 10, r: width, t: ay - 7, b: ay + 7 }, { l: width - 10 - xName.length * 7.5, r: width - 3, t: ay + 6, b: ay + 22 },
      ...xTicks.map(x => { const half = xText(x).length * 4.5 + 5; return { l: px(x) + 0.5 - half, r: px(x) + 0.5 + half, t: ay + 3, b: ay + 23 } }),
      ...yTicks.map(y => ({ l: ax - 10 - yText(y).length * 9, r: ax - 2, t: py(y) - 9, b: py(y) + 10 })),
      ...(sx ? [{ l: ax - xText(axisX).length * 4.5 - 5, r: ax + xText(axisX).length * 4.5 + 5, t: ay + 3, b: ay + 23 }, { l: ax - 20, r: ax - 2, t: ay - 9, b: ay + 3 }] : [{ l: ax - 20, r: ax - 2, t: ay + 3, b: ay + 23 }]),
      ...points.map(point => dotBox(px(point.x) + 0.5, py(point.y) + 0.5)),
    ],
    segments: [...lines.map(line => { const [a, b] = line.segment ? [line.from, line.to] : clip(frame, line.from, line.to); return { x1: px(a.x) + 0.5, y1: py(a.y) + 0.5, x2: px(b.x) + 0.5, y2: py(b.y) + 0.5 } }), ...curveSegments],
  }

  /** Keeps a label of `text` at (x, y) inside the grid: `size` is its font size, `anchor` how it hangs off x. */
  function inside(x: number, y: number, text: string, size: number, anchor: 'start' | 'middle' | 'end') {
    const w = text.length * size * 0.56
    const left = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2
    const dx = Math.max(3 - left, Math.min(0, width - 3 - (left + w)))
    return { x: x + dx, y: Math.min(Math.max(y, size + 2), height - 4) }
  }

  /** Real-life axes: a highlighted time too close to the one before it (10:00 and 10:30) drops a row, so both can be read. */
  function lowered(x: number) {
    if (!sx) return 0
    const lit = marks.filter(m => m.axis === 'x').map(m => m.value).sort((a, b) => a - b)
    let row = 0, prev: number | null = null
    for (const v of lit) {
      const half = xText(v).length * 4.5 + 5
      // A row down from the one before when they would touch, and from the axis's name at its end.
      row = prev !== null && px(v) - half < px(prev) + xText(prev).length * 4.5 + 5 + 2 ? 1 - row : px(v) + half > width - 12 - xName.length * 7.5 ? 1 : 0
      if (v === x) return row * 21
      prev = v
    }
    return 0
  }
  /** Real-life axes: a plain time that a highlighted one (on the same row) would cover is left out. So is a plain
   *  number under a dot, as when the y axis counts in 2s and a point at y = −1 sits on the x axis's numbers. */
  function hidden(x: number) {
    const half = (v: number) => xText(v).length * 4.5 + 5
    if (points.some(p => Math.abs(px(p.x) - px(x)) < half(x) + 6 && py(p.y) - py(axisY) > 3 && py(p.y) - py(axisY) < 29)) return true
    if (!sx) return false
    return marks.some(m => m.axis === 'x' && m.value !== x && !lowered(m.value) && Math.abs(px(m.value) - px(x)) < half(m.value) + half(x))
  }
  /** A plain number on the y axis that a highlighted value between the numbers would cover (€12 over the 10). */
  function hiddenY(y: number) {
    return between && marks.some(m => m.axis === 'y' && m.value !== y && Math.abs(py(m.value) - py(y)) < 19)
  }
  /** Whether a drawn line runs through a box (a plain axis number's): then the number gets a patch of paper behind it. */
  function crossed(l: number, t: number, r: number, b: number) {
    return lines.some(line => {
      const [a, z] = line.segment ? [line.from, line.to] : clip(frame, line.from, line.to)
      for (let i = 0; i <= 60; i++) {
        const x = px(a.x + (z.x - a.x) * i / 60) + 0.5, y = py(a.y + (z.y - a.y) * i / 60) + 0.5
        if (x > l && x < r && y > t && y < b) return true
      }
      return false
    })
  }
  /** The axis numbers: the plain ones under everything, the highlighted ones on top so a ring never hides them. */
  const axisNumbers = (marked: boolean) => <g className="ns-graph__numbers">
    {[...xTicks, ...(sx && marked ? marks.filter(m => m.axis === 'x' && m.value !== axisX && !xTicks.includes(m.value)).map(m => m.value) : [])].filter(x => !!markOf('x', x) === marked && (marked || !hidden(x))).map(x => {
      const mark = markOf('x', x), label = xText(x), down = mark ? lowered(x) : 0
      return <g key={`nx${x}`} className={mark ? 'is-marked' : undefined} style={mark ? { color: AXIS.x } : undefined}>
        {mark && <rect x={fix(px(x) + 0.5 - label.length * 4.5 - 5)} y={fix(py(axisY) + 4 + down)} width={fix(label.length * 9 + 10)} height="19" rx="9.5" />}
        {!mark && crossed(px(x) - label.length * 4.5 - 3, py(axisY) + 5, px(x) + label.length * 4.5 + 4, py(axisY) + 22) && <rect className="ns-graph__clear" x={fix(px(x) + 0.5 - label.length * 4 - 3)} y={fix(py(axisY) + 6)} width={fix(label.length * 8 + 6)} height="15" rx="3" />}
        <text x={fix(px(x) + 0.5)} y={fix(py(axisY) + 18 + down)}>{label}</text>
      </g>
    })}
    {[...yTicks, ...(between && marked ? marks.filter(m => m.axis === 'y' && m.value !== axisY && !yTicks.includes(m.value)).map(m => m.value) : [])].filter(y => !!markOf('y', y) === marked && (marked || !hiddenY(y))).map(y => {
      const mark = markOf('y', y), label = yText(y)
      return <g key={`ny${y}`} className={mark ? 'is-marked' : undefined} style={mark ? { color: AXIS.y } : undefined}>
        {mark && <rect x={fix(px(axisX) - 4 - label.length * 9 - 6)} y={fix(py(y) - 9)} width={fix(label.length * 9 + 10)} height="19" rx="9.5" />}
        {!mark && crossed(px(axisX) - 6 - label.length * 8, py(y) - 8, px(axisX) - 2, py(y) + 8) && <rect className="ns-graph__clear" x={fix(px(axisX) - 7 - label.length * 8)} y={fix(py(y) - 7)} width={fix(label.length * 8 + 4)} height="15" rx="3" />}
        <text className="is-y" x={fix(px(axisX) - 5)} y={fix(py(y) + 5)}>{label}</text>
      </g>
    })}
    {sx && sy && (() => {
      // Real-life axes: where they cross has a number on each, the x one under it and the y one to its left.
      const mx = markOf('x', axisX), my = markOf('y', axisY), lx = xText(axisX), ly = yText(axisY)
      // Both axes start at 0: one 0 where they cross, as on the other graphs, not a 0 on each.
      if (!mx && !my && lx === '0' && ly === '0') return marked ? null : <text className="is-y" x={fix(ax - 5)} y={fix(ay + 18)}>0</text>
      return <>
        {!!mx === marked && <g className={mx ? 'is-marked' : undefined} style={mx ? { color: AXIS.x } : undefined}>
          {mx && <rect x={fix(ax - lx.length * 4.5 - 5)} y={fix(ay + 4)} width={fix(lx.length * 9 + 10)} height="19" rx="9.5" />}
          <text x={fix(ax)} y={fix(ay + 18)}>{lx}</text>
        </g>}
        {!!my === marked && <g className={my ? 'is-marked' : undefined} style={my ? { color: AXIS.y } : undefined}>
          {my && <rect x={fix(ax - 4 - ly.length * 9 - 6)} y={fix(ay - 14)} width={fix(ly.length * 9 + 10)} height="19" rx="9.5" />}
          <text className="is-y" x={fix(ax - 5)} y={fix(ay)}>{ly}</text>
        </g>}
      </>
    })()}
    {!sx && (() => {
      const mark = markOf('x', 0) ?? markOf('y', 0)
      if (!!mark !== marked) return null
      return <g className={mark ? 'is-marked' : undefined} style={mark ? { color: AXIS[mark.axis] } : undefined}>
        {mark && <rect x={fix(px(axisX) - 20)} y={fix(py(axisY) + 4)} width="19" height="19" rx="9.5" />}
        <text className="is-y" x={fix(px(axisX) - 5)} y={fix(py(axisY) + 18)}>0</text>
      </g>
    })()}
  </g>

  const picture = <svg ref={ref} className={`ns-graph__picture${onPaper ? '' : ' has-grid'}`} width={width + 1} height={height + 1} viewBox={`0 0 ${width + 1} ${height + 1}`}
      {...live?.svg} style={paper ? { width: `calc(${width + 1}px * ${scale})`, height: `calc(${height + 1}px * ${scale})`, ...live?.svg?.style } : live?.svg?.style} aria-hidden="true">
      {!onPaper && <g className="ns-graph__grid">
        {range(x0, x1, perX).map(x => <line key={`gx${x}`} x1={fix(px(x) + 0.5)} x2={fix(px(x) + 0.5)} y1="0" y2={height + 1} />)}
        {range(y0, y1, perY).map(y => <line key={`gy${y}`} x1="0" x2={width + 1} y1={fix(py(y) + 0.5)} y2={fix(py(y) + 0.5)} />)}
      </g>}
      <g className="ns-graph__axes">
        <line x1="0" x2={width - 1} y1={fix(py(axisY) + 0.5)} y2={fix(py(axisY) + 0.5)} />
        <line x1={fix(px(axisX) + 0.5)} x2={fix(px(axisX) + 0.5)} y1="1" y2={height} />
        <path d={`M${width - 9} ${fix(py(axisY) - 5)} L${width - 2} ${fix(py(axisY) + 0.5)} L${width - 9} ${fix(py(axisY) + 6)} M${fix(px(axisX) - 5)} 9 L${fix(px(axisX) + 0.5)} 2 L${fix(px(axisX) + 6)} 9`} />
        <text className="ns-graph__axis-name" x={width - 6} y={fix(py(axisY) + 19)} textAnchor="end">{xName}</text>
        <text className="ns-graph__axis-name" x={fix(px(axisX) + 9)} y="15">{yName}</text>
      </g>
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
        })() : line.label && !line.segment ? (() => {
          // A named sloping line: its name goes near its top end (where it always went), else further down it,
          // beside or above or below it, wherever it keeps off the axes, their numbers, the arrows, the other lines
          // and names (graphs lesson 4: parallel lines are named side by side).
          const w = line.label.length * 8.6 + 4, box = (l: number, base: number) => ({ l, r: l + w, t: base - 14, b: base + 4, base })
          const first = inside(at.x, at.y - 10, line.label, 17, 'middle')
          const candidates = [box(first.x - w / 2, first.y), ...[0.1, 0.22, 0.34, 0.46, 0.58, 0.7, 0.82].flatMap(f => {
            const x = px(end.x + (other.x - end.x) * f) + 0.5, y = py(end.y + (other.y - end.y) * f) + 0.5
            // The corners the line doesn't run through: above-left and below-right of a line going up, the other
            // two of a line going down; then level with it on either side, for a steep line.
            const rising = (b.y - a.y) * (b.x - a.x) > 0
            const corners = rising ? [box(x - 6 - w, y - 8), box(x + 6, y + 22)] : [box(x + 6, y - 8), box(x - 6 - w, y + 22)]
            return [...corners, box(x + 14, y + 5), box(x - 14 - w, y + 5)]
          })]
          // On a crowded grid, any spot close beside the line, the nearest first.
          const ax0 = px(a.x) + 0.5, ay0 = py(a.y) + 0.5, ax1 = px(b.x) + 0.5, ay1 = py(b.y) + 0.5
          const gap = (c: { l: number; r: number; t: number; b: number }) => {
            let least = Infinity
            for (let i = 0; i <= 40; i++) {
              const sx = ax0 + (ax1 - ax0) * i / 40, sy = ay0 + (ay1 - ay0) * i / 40
              least = Math.min(least, Math.hypot(Math.max(c.l - sx, 0, sx - c.r), Math.max(c.t - sy, 0, sy - c.b)))
            }
            return least
          }
          const near: (LabelBox & { gap: number })[] = []
          for (let l = 3; l + w <= width - 3; l += 6) for (let base = 18; base <= height - 4; base += 6) {
            const c = box(l, base), g = gap(c)
            if (g >= 5 && g <= 22) near.push({ ...c, gap: g })
          }
          // With nowhere clear, the line goes unnamed (the question and the working name it) rather than sit on the axes.
          return fitLabel([...candidates, ...near.sort((p, q) => p.gap - q.gap)], room, true) ?? 'none' as const
        })() : null
        const label = fitted === 'none' ? null : fitted ? { x: fitted.l + 2, y: fitted.base } : line.label && inside(at.x + (vertical ? 8 : 0), at.y + (vertical ? 0 : -10), line.label, 17, vertical ? 'start' : 'middle')
        const anchor = fitted ? 'start' : vertical ? 'start' : 'middle'
        return <g key={`l${i}`} className={`ns-graph__line${kind}${done(line.at)}`}>
          <line x1={fix(px(a.x) + 0.5)} y1={fix(py(a.y) + 0.5)} x2={fix(px(b.x) + 0.5)} y2={fix(py(b.y) + 0.5)} />
          {label && <text x={fix(label.x)} y={fix(label.y)} textAnchor={anchor}>{line.label}</text>}
        </g>
      })}
      {curves.map((curve, i) => {
        const kind = curve.answer ? ' is-answer' : curve.at >= 0 ? ' is-found' : ''
        // A named curve: its name beside it, wherever it keeps clear of the axes, their numbers, the dots and other names.
        const fitted = curve.label ? (() => {
          const w = curve.label.length * 8.6 + 4, box = (l: number, base: number) => ({ l, r: l + w, t: base - 14, b: base + 4, base })
          const candidates = [0.9, 0.1, 0.8, 0.2, 0.7, 0.3].flatMap(f => {
            const x = curve.from + (curve.to - curve.from) * f, y = valueAt(curve.coeffs, x)
            if (y < y0 || y > y1) return []
            const cx = px(x) + 0.5, cy = py(y) + 0.5
            return [box(cx + 12, cy + 5), box(cx - 12 - w, cy + 5), box(cx - w / 2, cy - 12), box(cx - w / 2, cy + 26)]
          })
          return fitLabel(candidates.length ? candidates : [box(3, 18)], room, true)
        })() : null
        return <g key={`c${i}`} className={`ns-graph__line ns-graph__curve${kind}${done(curve.at)}`}>
          <path d={curvePath(curve.coeffs, curve.from, curve.to, frame, px, py)} />
          {fitted && <text x={fix(fitted.l + 2)} y={fix(fitted.base)}>{curve.label}</text>}
        </g>
      })}
      {/* The plain numbers over the lines, their halo parting a line that runs through one (−3 under y = 3x − 2), under the steps and dots. */}
      {axisNumbers(false)}
      {legs.map((leg, i) => {
        const across = leg.from.y === leg.to.y
        const ax = px(leg.from.x) + 0.5, ay = py(leg.from.y) + 0.5, tx = px(leg.to.x) + 0.5, ty = py(leg.to.y) + 0.5
        const dir = across ? Math.sign(tx - ax) : Math.sign(ty - ay)
        // A step that ends on a point stops just short of its dot, so the arrow's tip stays in sight (Sunny, 15 Oct).
        const short = points.some(p => p.x === leg.to.x && p.y === leg.to.y) ? 7 : 0
        const bx = across ? tx - dir * short : tx, by = across ? ty : ty - dir * short
        const arrow = across ? `M${fix(bx - dir * 8)} ${fix(by - 6)} L${fix(bx)} ${fix(by)} L${fix(bx - dir * 8)} ${fix(by + 6)}` : `M${fix(bx - 6)} ${fix(by - dir * 8)} L${fix(bx)} ${fix(by)} L${fix(bx + 6)} ${fix(by - dir * 8)}`
        // Each size goes outside the triangle the two steps make, so the line through it never crosses a label.
        const other = legs.find(o => o !== leg && (across ? o.to.x === leg.from.x && o.to.y === leg.from.y : o.from.x === leg.to.x && o.from.y === leg.to.y))
        // Across first (the lessons' order): the step up starts where this one ends, and the triangle is on its side. On the x axis it stays above, clear of the numbers.
        const next = across ? legs.find(o => o !== leg && o.from.x === o.to.x && o.from.x === leg.to.x && o.from.y === leg.to.y) : undefined
        const outside = across ? (next ? next.to.y < next.from.y || leg.from.y === axisY : other ? other.to.y > other.from.y : leg.from.y <= (y0 + y1) / 2) : (other ? other.to.x > other.from.x : false)
        const anchor = across ? 'middle' as const : outside ? 'end' as const : 'start' as const
        // A size that would sit on an axis (and its numbers) moves to the middle of the leg's longer side of it.
        const [lo, hi, axisAt] = across ? [Math.min(ax, bx), Math.max(ax, bx), px(axisX) + 0.5] : [Math.min(ay, by), Math.max(ay, by), py(axisY) + 0.5]
        // A step up or down that ends on a point keeps its size nearer its start, clear of that point's coordinates (Sunny, 15 Oct).
        const ends = !across && points.some(p => p.x === leg.to.x && p.y === leg.to.y)
        const middle = lo < axisAt - 14 && hi > axisAt + 14 && Math.abs((lo + hi) / 2 - axisAt) < 24
          ? (axisAt - lo >= hi - axisAt ? (lo + axisAt) / 2 : (axisAt + hi) / 2) : ends ? ay + (by - ay) * 0.3 : (lo + hi) / 2
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
        const text = point.label ?? `(${xText(point.x)}, ${yText(point.y)})`
        // A label in a corner beside its dot keeps off the axes, their numbers and the other labels (Sunny, 7 Oct).
        const cx = px(point.x) + 0.5, cy = py(point.y) + 0.5
        const corner = text !== ''
          ? placeLabel(cx, cy, labelWidth(text), { right: place.anchor === 'start', below: place.y > 0 }, room) : null
        const label = corner ? { x: corner.l + 2, y: corner.base } : inside(cx + place.x, cy + place.y, text, 15, place.anchor)
        const anchor = corner ? 'start' as const : place.anchor
        // An answer point is drawn like a right answer on the graph board: a larger green dot (Sunny's reference, 7 Oct).
        return <g key={`p${i}`} className={`ns-graph__point${point.at >= 0 ? ' is-found' : ''}${point.answer ? ' is-answer' : ''}${done(point.at)}`}>
          <circle cx={fix(px(point.x) + 0.5)} cy={fix(py(point.y) + 0.5)} r={point.answer ? 7 : 5} />
          {text !== '' && <HaloText x={fix(label.x)} y={fix(label.y)} textAnchor={anchor}>{point.label ?? <Pair x={xText(point.x)} y={yText(point.y)} />}</HaloText>}
        </g>
      })}
      {live?.draw({ px, py, width, height, room })}
      {!plain && (frame.boxed ?? []).map((point, i) => <circle key={`b${i}`} className="ns-graph__box" cx={fix(px(point.x) + 0.5)} cy={fix(py(point.y) + 0.5)} r="11" />)}
      {axisNumbers(true)}
    </svg>

  // The step's heading, the table and the working: words, not picture.
  const lead = head('picture'), written = working.length > 0, answer = !plain && frame.answer
  /** Lines of working in order, each step's heading above its first line. */
  const workingLines = (lines: typeof working) => lines.map((line, i) => <Fragment key={`w${line.at}-${i}`}>
    {frame.adds === 'lines' && line.at === frame.step && lines.findIndex(l => l.at === frame.step) === i && head('lines')}
    <p className={`ns-graph__text ${family(line.family)}${done(line.at)}`} aria-hidden="true"><Coordinates text={keepWhole(line.text)} /></p>
  </Fragment>)
  const words = (lead || frame.table || written || answer) && <div className="ns-graph ns-graph--words">
    {lead}
    {frame.table && <ValueTable table={frame.table} pick={live?.pickX} />}
    {written && workingLines(working.filter(line => !answer || line.at < frame.answer!.at))}
    {answer && <>
      {head('answer')}
      {/* The answer's own lines (its formula) go under its heading, then the answer; steps after it (a check) follow. */}
      {working.filter(line => line.at === frame.answer!.at).map((line, i) => <p key={`a${i}`} className={`ns-graph__text ${family(line.family)}${done(line.at)}`} aria-hidden="true"><Coordinates text={keepWhole(line.text)} /></p>)}
      <p className="ns-eq__answer" aria-hidden="true"><Powers text={frame.answer!.text} /></p>
      {workingLines(working.filter(line => line.at > frame.answer!.at))}
    </>}
  </div>

  // The grid goes in the card's graph slot (a board puts its whole surface there itself). The words go in the worked
  // example's working window, or beside the slot on a question (GraphWords): never inside the graph's box.
  return <div className={`ns-graph${plain ? ' is-plain' : ''}`} role="img" aria-label={spoken(frame, plain)}>
    {live ? picture : <InGraphSlot className="ns-graph">{picture}</InGraphSlot>}
    {words && <GraphWords><Working>{words}</Working></GraphWords>}
  </div>
}
