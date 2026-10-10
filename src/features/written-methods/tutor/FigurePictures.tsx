import { useRef, type ReactNode } from 'react'
import type { FigureFrame, FigureItem, FigurePoint } from './methodWorking'
import { Caption, type Bounds } from './AnglePictures'
import { useCardPaper } from './cardPaper'

/*
 * Measured figures (geometry lessons 5 to 18: symmetry, area, circles, perimeter, sectors, and lessons 10 to 18 from
 * congruence to bearings). A figure is a list of plain drawing items in their own units, y up, fitted into the picture
 * with room for the labels: numbered axes for transformations, shapes (filled lightly), lines (a
 * mirror line is red and dashed, as in the book; a North line has an arrowhead), circles, arcs and sectors,
 * measurements with an arrow at each end and the length beside them, right-angle squares, tick marks, points and words.
 *
 * Tones follow the angle pictures: `given` is plain ink, `x` the unknown in biro blue, `lit` the part a step uses in
 * purple, and `found` the answer in a green box.
 */

type P = { x: number; y: number }
const W = 320, H = 210
const rad = (d: number) => d * Math.PI / 180
const pt = ([x, y]: FigurePoint): P => ({ x, y })

/** Every point the figure reaches, so all of it fits. */
export const figureExtent = (items: FigureItem[]): FigurePoint[] => extent(items).map(p => [p.x, p.y])
function extent(items: FigureItem[]): P[] {
  return items.flatMap(item => {
    if (item.kind === 'shape') return item.points.map(pt)
    if (item.kind === 'line' || item.kind === 'measure') return [pt(item.from), pt(item.to)]
    if (item.kind === 'circle') return [{ x: item.centre[0] - item.r, y: item.centre[1] - item.r }, { x: item.centre[0] + item.r, y: item.centre[1] + item.r }]
    if (item.kind === 'arc') {
      const steps = 24, list: P[] = item.sector ? [pt(item.centre)] : []
      for (let k = 0; k <= steps; k++) { const a = rad(item.from + (item.to - item.from) * k / steps); list.push({ x: item.centre[0] + item.r * Math.cos(a), y: item.centre[1] + item.r * Math.sin(a) }) }
      return list
    }
    if (item.kind === 'point' || item.kind === 'text') return [pt(item.at)]
    if (item.kind === 'grid') return [pt(item.from), pt(item.to)]
    return []
  })
}

export const FIGURE_PAD = 38
/** Fits the figure into the picture; `shared` (steady pictures) fits it to its worked example's bounds instead. */
export function fitFigure(frame: FigureFrame, w = W, h = H, pad = FIGURE_PAD, shared?: Bounds) {
  const pts = extent(frame.items)
  let minX = Math.min(...pts.map(p => p.x)), maxX = Math.max(...pts.map(p => p.x))
  let minY = Math.min(...pts.map(p => p.y)), maxY = Math.max(...pts.map(p => p.y))
  let padX = pad + (frame.room ?? 0)
  if (shared) ({ minX, maxX, minY, maxY, pad, padX = pad } = shared)
  const scale = Math.min((w - 2 * padX) / (maxX - minX || 1), (h - 2 * pad) / (maxY - minY || 1))
  const offX = (w - (maxX - minX) * scale) / 2, offY = (h - (maxY - minY) * scale) / 2
  const at = (p: FigurePoint): P => ({ x: offX + (p[0] - minX) * scale, y: h - offY - (p[1] - minY) * scale })
  return { at, scale }
}

const tone = (t?: string) => t === 'x' ? 'is-x' : t === 'lit' ? 'is-lit' : t === 'found' ? 'is-found' : t === 'faint' ? 'is-faint' : 'is-given'

/** A word or number in the picture; `found` sits in a green box, `lit` in a purple one. */
function Label({ at, text, t }: { at: P; text: string; t?: string }) {
  const boxed = t === 'found' || t === 'lit'
  const width = text.length * 9 + 14
  return <g className={`ns-fig__label ${tone(t)}`}>
    {boxed && <rect className={t === 'found' ? 'ns-angles__found' : 'ns-angles__box'} x={at.x - width / 2} y={at.y - 14} width={width} height="28" rx="7" />}
    <text x={at.x} y={at.y}>{text}</text>
  </g>
}

export function FigureVisual({ frame, plain, shared, keepCaption }: { frame: FigureFrame; plain?: boolean; shared?: Bounds; keepCaption?: string[] }) {
  const { at, scale } = fitFigure(frame, W, H, FIGURE_PAD, shared)
  const t = (value?: string) => plain && value !== 'faint' ? undefined : value
  const parts: ReactNode[] = []
  const labels: ReactNode[] = []
  // A picture on squares marks one square, and the lesson card's own squared paper is lined up with it (cardPaper.ts).
  const square = useRef<SVGRectElement>(null)
  const grid = frame.items.find(item => item.kind === 'grid')
  useCardPaper(square, !!grid)
  if (grid) { const p = at([Math.ceil(grid.from[0]), Math.ceil(grid.from[1]) + 1]); parts.push(<rect key="square" ref={square} className="card-paper-square" x={p.x} y={p.y} width={scale} height={scale} />) }
  frame.items.forEach((item, i) => {
    if (item.kind === 'grid') {
      // The lesson card's own squared paper, lined up with the picture, is the grid, so no grid lines are drawn here:
      // just the axes, when asked for, numbered under and beside them.
      const [x0, y0] = item.from, [x1, y1] = item.to
      if (item.axes && x0 <= 0 && x1 >= 0) { const a = at([0, y0]), b = at([0, y1]); parts.push(<path key={`gx${i}`} className="measure-board__grid is-axis" d={`M${a.x} ${a.y} L${b.x} ${b.y}`} />) }
      if (item.axes && y0 <= 0 && y1 >= 0) { const a = at([x0, 0]), b = at([x1, 0]); parts.push(<path key={`gy${i}`} className="measure-board__grid is-axis" d={`M${a.x} ${a.y} L${b.x} ${b.y}`} />) }
      if (item.axes && item.numbers) {
        const o = at([0, 0])
        for (let x = Math.ceil(x0); x <= x1; x++) if (x) { const p = at([x, 0]); parts.push(<text key={`nx${i}-${x}`} className="ns-fig__axis" x={p.x} y={o.y + 12}>{x < 0 ? `−${-x}` : x}</text>) }
        for (let y = Math.ceil(y0); y <= y1; y++) if (y) { const p = at([0, y]); parts.push(<text key={`ny${i}-${y}`} className="ns-fig__axis" x={o.x - 9} y={p.y}>{y < 0 ? `−${-y}` : y}</text>) }
      }
    }
    if (item.kind === 'shape') {
      const d = `M${item.points.map(p => { const q = at(p); return `${q.x} ${q.y}` }).join(' L')}${item.open ? '' : ' Z'}`
      if (!plain && item.lit) parts.push(<path key={`l${i}`} className="ns-angles__lit" d={d} />)
      parts.push(<path key={i} className={`ns-fig__shape${item.fill === 'none' || item.open ? ' is-empty' : item.fill === 'part' ? ' is-part' : ''}${item.dashed ? ' is-dashed' : ''}`} d={d} />)
    }
    if (item.kind === 'line') {
      const a = at(item.from), b = at(item.to)
      parts.push(<path key={i} className={`ns-fig__line is-${item.style ?? 'plain'}${plain && item.style === 'lit' ? ' is-quiet' : ''}`} d={`M${a.x} ${a.y} L${b.x} ${b.y}`} />)
      if (item.arrow) {
        // An arrowhead at the `to` end: a North line, or a translation's move.
        const len = Math.hypot(b.x - a.x, b.y - a.y) || 1, u = { x: (b.x - a.x) / len, y: (b.y - a.y) / len }
        parts.push(<path key={`a${i}`} className={`ns-fig__line is-${item.style ?? 'plain'} is-head`} d={`M${b.x - u.x * 11 - u.y * 6} ${b.y - u.y * 11 + u.x * 6} L${b.x} ${b.y} L${b.x - u.x * 11 + u.y * 6} ${b.y - u.y * 11 - u.x * 6}`} />)
      }
    }
    if (item.kind === 'circle') {
      const c = at(item.centre)
      parts.push(<circle key={i} className={`ns-fig__shape${item.fill === 'none' ? ' is-empty' : ''}`} cx={c.x} cy={c.y} r={item.r * scale} />)
    }
    if (item.kind === 'arc') {
      const c = at(item.centre), r = item.r * scale
      const p = (deg: number) => ({ x: c.x + r * Math.cos(rad(deg)), y: c.y - r * Math.sin(rad(deg)) })
      const a = p(item.from), b = p(item.to), large = item.to - item.from > 180 ? 1 : 0
      const arc = `M${a.x} ${a.y} A${r} ${r} 0 ${large} 0 ${b.x} ${b.y}`
      if (item.sector) parts.push(<path key={`s${i}`} className={`ns-fig__shape${item.fill === 'part' ? ' is-part' : ''}`} d={`M${c.x} ${c.y} L${a.x} ${a.y} A${r} ${r} 0 ${large} 0 ${b.x} ${b.y} Z`} />)
      parts.push(<path key={i} className={`ns-fig__line is-${item.style ?? 'plain'}`} d={arc} />)
    }
    if (item.kind === 'measure') {
      // A length: a thin line with an arrow at each end, `offset` pixels to the side of what it measures, and its label.
      const a0 = at(item.from), b0 = at(item.to)
      const ux = (b0.x - a0.x), uy = (b0.y - a0.y), len = Math.hypot(ux, uy) || 1
      const u = { x: ux / len, y: uy / len }, n = { x: -u.y, y: u.x }, o = item.offset ?? 0
      const a = { x: a0.x + n.x * o, y: a0.y + n.y * o }, b = { x: b0.x + n.x * o, y: b0.y + n.y * o }
      const head = (p: P, s: number) => `M${p.x + s * u.x * 8 + n.x * 5} ${p.y + s * u.y * 8 + n.y * 5} L${p.x} ${p.y} L${p.x + s * u.x * 8 - n.x * 5} ${p.y + s * u.y * 8 - n.y * 5}`
      parts.push(<g key={i} className={`ns-fig__measure ${tone(t(item.tone))}`}><path d={`M${a.x} ${a.y} L${b.x} ${b.y}`} /><path d={head(a, 1)} /><path d={head(b, -1)} /></g>)
      if (item.label) {
        const side = item.side ?? 1, m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
        const gap = 12 + Math.abs(n.x) * item.label.length * 4.2
        labels.push(<Label key={`m${i}`} at={{ x: m.x + n.x * gap * side, y: m.y + n.y * gap * side }} text={item.label} t={t(item.tone)} />)
      }
    }
    if (item.kind === 'right') {
      const v = at(item.at), a = at(item.a), b = at(item.b)
      const ua = { x: (a.x - v.x) / Math.hypot(a.x - v.x, a.y - v.y), y: (a.y - v.y) / Math.hypot(a.x - v.x, a.y - v.y) }
      const ub = { x: (b.x - v.x) / Math.hypot(b.x - v.x, b.y - v.y), y: (b.y - v.y) / Math.hypot(b.x - v.x, b.y - v.y) }
      parts.push(<path key={i} className="ns-fig__line is-plain is-thin" d={`M${v.x + ua.x * 12} ${v.y + ua.y * 12} L${v.x + (ua.x + ub.x) * 12} ${v.y + (ua.y + ub.y) * 12} L${v.x + ub.x * 12} ${v.y + ub.y * 12}`} />)
    }
    if (item.kind === 'ticks') {
      const a = at(item.from), b = at(item.to), len = Math.hypot(b.x - a.x, b.y - a.y) || 1
      const u = { x: (b.x - a.x) / len, y: (b.y - a.y) / len }, n = { x: -u.y, y: u.x }, m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
      for (let k = 0; k < item.count; k++) { const c = { x: m.x + u.x * (k - (item.count - 1) / 2) * 6, y: m.y + u.y * (k - (item.count - 1) / 2) * 6 }; parts.push(<path key={`${i}-${k}`} className="ns-fig__line is-plain" d={`M${c.x - n.x * 7} ${c.y - n.y * 7} L${c.x + n.x * 7} ${c.y + n.y * 7}`} />) }
    }
    if (item.kind === 'point') {
      const p = at(item.at)
      parts.push(<circle key={i} className="ns-fig__point" cx={p.x} cy={p.y} r="4" />)
      if (item.label) labels.push(<text key={`p${i}`} className="ns-angles__name" x={p.x + (item.dx ?? -12)} y={p.y + (item.dy ?? -12)}>{item.label}</text>)
    }
    if (item.kind === 'text') {
      const p = at(item.at)
      labels.push(item.name
        ? <text key={`t${i}`} className="ns-angles__name" x={p.x + (item.dx ?? 0)} y={p.y + (item.dy ?? 0)}>{item.text}</text>
        : <Label key={`t${i}`} at={{ x: p.x + (item.dx ?? 0), y: p.y + (item.dy ?? 0) }} text={item.text} t={t(item.tone)} />)
    }
  })
  return <div className={`ns-angles ns-fig${plain ? ' is-plain' : ''}`} role="img" aria-label={frame.spoken}>
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">{parts}{labels}</svg>
    <Caption text={frame.caption} keep={keepCaption} />
  </div>
}
