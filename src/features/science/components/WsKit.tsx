import { useId, type ReactNode } from 'react'
import { physicsPalette, PhysicsDiagram, type Pt } from './PhysicsKit'

/*
 * The Working Scientifically drawing kit. The WS lessons (WsDesignVisuals, WsCollectVisuals, WsProcessVisuals …)
 * draw with these pieces so tables, number lines, stopwatches, people and simple lab kit look the same in every lesson.
 * It sits on the Physics kit: same ink, panels and palette, and the same PhysicsDiagram wrapper (role="img", title).
 *
 * Colour code, the same in every WS lesson:
 *   the variable you change (independent, x-axis) blue, the variable you measure (dependent, y-axis) brown-orange
 *   (the same pair as WsPresentVisuals' `ws.x` / `ws.y`),
 *   the variables you keep the same (control) slate grey; good / yes green, bad / no coral;
 *   the true value violet; a highlight (the cell or value to look at) soft yellow; anomalies coral.
 * Tables are neat rounded grids with a tinted heading row; units go in the heading, e.g. "Time (s)".
 */
export { PhysicsDiagram as WsDiagram }
export type { Pt }
const P = physicsPalette
export const { ink, muted } = P
export const r1 = (n: number) => Math.round(n * 10) / 10
export const faded = 0.3

export type Tone = 'plain' | 'change' | 'measure' | 'keep' | 'good' | 'bad' | 'truth' | 'mark'
export const tones: Record<Tone, { fill: string; line: string; text: string }> = {
  plain: { fill: '#ffffff', line: '#b9cad6', text: ink },
  change: { fill: '#dcecf8', line: '#3f7fb0', text: '#2f6a96' },
  measure: { fill: '#fbe6d2', line: '#b0601c', text: '#99511a' },
  keep: { fill: P.magnetic, line: P.magneticLine, text: P.magneticLine },
  good: { fill: P.usefulFill, line: P.useful, text: '#3b7a59' },
  bad: { fill: P.wastedFill, line: P.wasted, text: '#a4503f' },
  truth: { fill: P.pdFill, line: P.pd, text: P.pd },
  mark: { fill: '#fff1c2', line: P.lightLine, text: '#8a6a0a' },
}
export const wsPalette = {
  ...P,
  change: tones.change.line, measure: tones.measure.line, keep: tones.keep.line,
  good: tones.good.line, bad: tones.bad.line, truth: tones.truth.line, mark: tones.mark.fill, markLine: tones.mark.line,
  tableLine: '#b9cad6', tableHead: '#edf3f7',
  glass: '#f3f8fb', glassLine: '#7f9db2',
  skin: '#f3d6bd', skinLine: '#c29274', hair: '#6b5446',
  wood: '#ecd2a6', woodLine: '#a57a43', metal: '#dfe5ea', metalLine: '#7f95a6',
  soil: '#c9a27e', soilLine: '#8d6a4b', pot: '#f0c8a6', potLine: '#b3714a',
}
const W = wsPalette

/** Rough text width, for sizing pills and cells. */
export const textW = (t: string, size: number) => t.length * size * 0.56

/* ---------- Small marks ---------- */

/** A rounded pill with centred text. */
export function Tag({ x, y, text, tone = 'plain', size = 13, w, dim = false, strong = false }: { x: number; y: number; text: string; tone?: Tone; size?: number; w?: number; dim?: boolean; strong?: boolean }) {
  const c = tones[tone], width = w ?? textW(text, size) + 26, h = size + 14
  return <g opacity={dim ? faded : 1}>
    <rect x={r1(x - width / 2)} y={r1(y - h / 2)} width={r1(width)} height={h} rx={h / 2} fill={c.fill} stroke={c.line} strokeWidth={strong ? 2.2 : 1.6} />
    <text x={x} y={r1(y + size * 0.36)} textAnchor="middle" fontSize={size} fontWeight="700" fill={c.text}>{text}</text>
  </g>
}
/** A soft rounded card. Plain cards are very pale; toned cards take the tone's tint. */
export function Panel({ x, y, w, h, tone = 'plain', dim = false, strong = false, r = 16, children }: { x: number; y: number; w: number; h: number; tone?: Tone; dim?: boolean; strong?: boolean; r?: number; children?: ReactNode }) {
  const c = tones[tone]
  return <g opacity={dim ? faded : 1}>
    <rect x={x} y={y} width={w} height={h} rx={r} fill={tone === 'plain' ? P.panel : c.fill} fillOpacity={tone === 'plain' ? 1 : 0.5} stroke={c.line} strokeWidth={strong ? 2.4 : 1.6} />
    {children}
  </g>
}
export function Tick({ x, y, s = 1, dim = false }: { x: number; y: number; s?: number; dim?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} opacity={dim ? faded : 1}><circle r="12" fill={tones.good.fill} stroke={tones.good.line} strokeWidth="2" /><path d="M-5.5 0l4 4.5l7.5 -9" stroke={tones.good.line} strokeWidth="3" fill="none" /></g>
}
export function Cross({ x, y, s = 1, dim = false }: { x: number; y: number; s?: number; dim?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} opacity={dim ? faded : 1}><circle r="12" fill={tones.bad.fill} stroke={tones.bad.line} strokeWidth="2" /><path d="M-4.5 -4.5l9 9M4.5 -4.5l-9 9" stroke={tones.bad.line} strokeWidth="3" /></g>
}
/** An arrow with a solid head; `bend` bows it sideways (a fraction of its length). */
export function Arrow({ from, to, colour = ink, width = 2.6, dashed = false, bend = 0, opacity = 1 }: { from: Pt; to: Pt; colour?: string; width?: number; dashed?: boolean; bend?: number; opacity?: number }) {
  const dx = to[0] - from[0], dy = to[1] - from[1], len = Math.hypot(dx, dy) || 1
  const c: Pt = [(from[0] + to[0]) / 2 - dy * bend, (from[1] + to[1]) / 2 + dx * bend]
  const a = Math.atan2(to[1] - c[1], to[0] - c[0]), h = 7 + width * 1.5
  const p = (d: number, s: number): Pt => [r1(to[0] - Math.cos(a) * d + Math.cos(a + Math.PI / 2) * s), r1(to[1] - Math.sin(a) * d + Math.sin(a + Math.PI / 2) * s)]
  const [b1, b2, base] = [p(h, h * 0.58), p(h, -h * 0.58), p(h * 0.72, 0)]
  const line = bend ? `M${from[0]} ${from[1]}Q${r1(c[0])} ${r1(c[1])} ${base[0]} ${base[1]}` : `M${from[0]} ${from[1]}L${base[0]} ${base[1]}`
  void len
  return <g opacity={opacity}>
    <path d={line} stroke={colour} strokeWidth={width} fill="none" strokeDasharray={dashed ? '6 6' : undefined} />
    <path d={`M${to[0]} ${to[1]}L${b1[0]} ${b1[1]}L${base[0]} ${base[1]}L${b2[0]} ${b2[1]}Z`} fill={colour} stroke={colour} strokeWidth="1.2" />
  </g>
}
/** A soft curly bracket along x1–x2 at height y. dir = 1: the tips point down (the bracket sits above what it groups). */
export function Bracket({ x1, x2, y, dir = 1, colour = ink, width = 2 }: { x1: number; x2: number; y: number; dir?: 1 | -1; colour?: string; width?: number }) {
  const m = (x1 + x2) / 2, k = Math.min(8, (x2 - x1) / 4), d = dir * 7
  return <path d={`M${x1} ${y + d}Q${x1} ${y} ${x1 + k} ${y}H${m - k}Q${m} ${y} ${m} ${y - d}Q${m} ${y} ${m + k} ${y}H${x2 - k}Q${x2} ${y} ${x2} ${y + d}`} fill="none" stroke={colour} strokeWidth={width} />
}
/** A vertical curly bracket along y1–y2 at x. dir = 1: the tips point left. */
export function VBracket({ y1, y2, x, dir = 1, colour = ink, width = 2 }: { y1: number; y2: number; x: number; dir?: 1 | -1; colour?: string; width?: number }) {
  const m = (y1 + y2) / 2, k = Math.min(8, (y2 - y1) / 4), d = dir * 7
  return <path d={`M${x - d} ${y1}Q${x} ${y1} ${x} ${y1 + k}V${m - k}Q${x} ${m} ${x + d} ${m}Q${x} ${m} ${x} ${m + k}V${y2 - k}Q${x} ${y2} ${x - d} ${y2}`} fill="none" stroke={colour} strokeWidth={width} />
}
/** A numbered pointer for question diagrams: a circled number with a leader line to the part it names. */
export function Numbered({ n, at, to }: { n: number; at: Pt; to: Pt }) {
  const a = Math.atan2(to[1] - at[1], to[0] - at[0])
  return <g>
    <path d={`M${r1(at[0] + Math.cos(a) * 13)} ${r1(at[1] + Math.sin(a) * 13)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" />
    <circle cx={to[0]} cy={to[1]} r="3" fill={ink} />
    <circle cx={at[0]} cy={at[1]} r="13" fill="white" stroke={ink} strokeWidth="2" />
    <text x={at[0]} y={at[1] + 5} textAnchor="middle" fontSize="14" fontWeight="750" fill={ink}>{n}</text>
  </g>
}

/* ---------- Tables ---------- */

/** A table cell: plain text, or text with a tone (tinted cell), faded, or struck out. '\n' splits a cell into two lines. */
export type Cell = string | { t: string; tone?: Tone; dim?: boolean; strike?: boolean }
/**
 * A neat results table: rounded outer edge, tinted heading row, thin rules. `cols` are column widths; the first row is the
 * heading. `hiCol` tints a whole column (below the heading too) in the highlight colour. `title` sits above, left-aligned.
 */
export function DataTable({ x, y, cols, rows, rowH = 36, headH, size = 14, hiCol, hiHead = false, title, titleTone = 'plain' }: {
  x: number; y: number; cols: number[]; rows: Cell[][]; rowH?: number; headH?: number; size?: number; hiCol?: number; hiHead?: boolean; title?: string; titleTone?: Tone
}) {
  const clip = useId().replace(/:/g, '')
  const hh = headH ?? rowH, w = cols.reduce((s, c) => s + c, 0), h = hh + (rows.length - 1) * rowH
  const xs = cols.reduce<number[]>((a, c, i) => [...a, i ? a[i - 1] + cols[i - 1] : x], [])
  const rowY = (j: number) => j === 0 ? y : y + hh + (j - 1) * rowH
  const cellH = (j: number) => j === 0 ? hh : rowH
  const cell = (c: Cell) => typeof c === 'string' ? { t: c } : c
  return <g>
    {title && <text x={x + 2} y={y - 10} fontSize="14" fontWeight="750" fill={tones[titleTone].text}>{title}</text>}
    <defs><clipPath id={clip}><rect x={x} y={y} width={w} height={h} rx="12" /></clipPath></defs>
    <rect x={x} y={y} width={w} height={h} rx="12" fill="white" />
    <g clipPath={`url(#${clip})`}>
      <rect x={x} y={y} width={w} height={hh} fill={hiHead ? tones.mark.fill : W.tableHead} />
      {hiCol !== undefined && <rect x={xs[hiCol]} y={y} width={cols[hiCol]} height={h} fill={tones.mark.fill} opacity=".85" />}
      {rows.map((row, j) => row.map((raw, i) => {
        const c = cell(raw)
        return c.tone && c.tone !== 'plain' ? <rect key={`f${j}-${i}`} x={xs[i]} y={rowY(j)} width={cols[i]} height={cellH(j)} fill={tones[c.tone].fill} opacity=".8" /> : null
      }))}
    </g>
    <g stroke={W.tableLine} strokeWidth="1.3">
      {xs.slice(1).map((cx, i) => <path key={`v${i}`} d={`M${cx} ${y}V${y + h}`} />)}
      {rows.slice(2).map((_, j) => <path key={`h${j}`} d={`M${x} ${rowY(j + 2)}H${x + w}`} />)}
    </g>
    <path d={`M${x} ${y + hh}H${x + w}`} stroke={W.tableLine} strokeWidth="2" />
    <rect x={x} y={y} width={w} height={h} rx="12" fill="none" stroke={W.tableLine} strokeWidth="2" />
    {rows.map((row, j) => row.map((raw, i) => {
      const c = cell(raw), lines = c.t.split('\n'), head = j === 0
      const fs = head ? Math.max(12, size - 1) : size, cx = xs[i] + cols[i] / 2, cy = rowY(j) + cellH(j) / 2
      const colour = c.tone && c.tone !== 'plain' ? tones[c.tone].text : ink
      const top = cy - (lines.length - 1) * (fs + 2) / 2 + fs * 0.36
      const tw = textW(c.t, fs)
      return <g key={`t${j}-${i}`} opacity={c.dim ? faded + 0.1 : 1}>
        <text x={cx} y={r1(top)} textAnchor="middle" fontSize={fs} fontWeight={head || i === 0 ? 750 : 600} fill={colour}>{lines.map((l, k) => <tspan key={k} x={cx} dy={k ? fs + 2 : 0}>{l}</tspan>)}</text>
        {c.strike && <path d={`M${r1(cx - tw / 2 - 5)} ${r1(cy + 5)}L${r1(cx + tw / 2 + 5)} ${r1(cy - 5)}`} stroke={tones.bad.line} strokeWidth="2.4" />}
      </g>
    }))}
  </g>
}
/** Where a table's columns start (for pointing at a column or cell). */
export const colX = (x: number, cols: number[]) => cols.reduce<number[]>((a, c, i) => [...a, i ? a[i - 1] + cols[i - 1] : x], [])

/* ---------- Number lines and data dots ---------- */

export const numberScale = (x: number, w: number, min: number, max: number) => (v: number) => r1(x + (v - min) / (max - min) * w)
/** A horizontal number line with ticks every `step`, numbers under the ticks in `labels` (default: every tick) and a unit. */
export function NumberLine({ x, y, w, min, max, step, labels, unit, fmt = (v: number) => String(v) }: { x: number; y: number; w: number; min: number; max: number; step: number; labels?: number[]; unit?: string; fmt?: (v: number) => string }) {
  const s = numberScale(x, w, min, max)
  const n = Math.round((max - min) / step), ticks = Array.from({ length: n + 1 }, (_, i) => r1((min + i * step) * 1000) / 1000)
  const show = labels ?? ticks
  return <g>
    <path d={`M${x - 10} ${y}H${x + w + 10}`} stroke={ink} strokeWidth="2.2" />
    {ticks.map(v => <path key={v} d={`M${s(v)} ${y - 5}V${y + 5}`} stroke={ink} strokeWidth="1.6" />)}
    {show.map(v => <text key={`l${v}`} x={s(v)} y={y + 22} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>{fmt(v)}</text>)}
    {unit && <text x={x + w + 22} y={y + 22} textAnchor="start" fontSize="13" fontWeight="700" fill={muted}>{unit}</text>}
  </g>
}
/** A data point: a soft round dot in a tone. */
export function Dot({ x, y, tone = 'measure', r = 8, dim = false, ring = false }: { x: number; y: number; tone?: Tone; r?: number; dim?: boolean; ring?: boolean }) {
  const c = tones[tone]
  return <g opacity={dim ? faded : 1}>
    {ring && <circle cx={x} cy={y} r={r + 7} fill="none" stroke={c.line} strokeWidth="2.2" />}
    <circle cx={x} cy={y} r={r} fill={c.fill} stroke={c.line} strokeWidth="2" />
  </g>
}

/* ---------- People and timing ---------- */

const shirts: [string, string][] = [[P.water, P.waterLine], [P.kinetic, P.kineticLine], [P.plant, P.plantLine], [P.chemical, P.chemicalLine], [P.elastic, P.elasticLine], [P.light, P.lightLine]]
/** A simple head-and-shoulders person; (x, y) is the middle of the shoulders' base. `kind` picks a shirt colour. */
export function Bust({ x, y, s = 1, kind = 0, dim = false }: { x: number; y: number; s?: number; kind?: number; dim?: boolean }) {
  const [fill, line] = shirts[kind % shirts.length]
  return <g transform={`translate(${x} ${y}) scale(${s})`} opacity={dim ? faded : 1}>
    <path d="M-24 0C-24 -18 -15 -27 0 -27C15 -27 24 -18 24 0Z" fill={fill} stroke={line} strokeWidth="2" />
    <circle cx="0" cy="-41" r="12.5" fill={W.skin} stroke={W.skinLine} strokeWidth="1.8" />
    <path d="M-12.5 -43Q-11 -56 0 -55Q11 -55 12.5 -44Q5 -50 -12.5 -43Z" fill={W.hair} />
  </g>
}
/** A stopwatch; the face shows `reading` (or a hand when there is none). */
export function Stopwatch({ x, y, r = 28, reading, tone = 'plain', dim = false, size }: { x: number; y: number; r?: number; reading?: string; tone?: Tone; dim?: boolean; size?: number }) {
  const c = tone === 'plain' ? { fill: W.tableHead, line: ink, text: ink } : tones[tone]
  const fs = size ?? (r >= 26 ? 14 : 12)
  return <g opacity={dim ? faded : 1}>
    <rect x={x - 6} y={y - r - 10} width="12" height="9" rx="3" fill={c.fill} stroke={c.line} strokeWidth="1.8" />
    <path d={`M${r1(x + r * 0.66)} ${r1(y - r * 0.86)}l6 -6`} stroke={c.line} strokeWidth="3.2" />
    <circle cx={x} cy={y} r={r} fill={c.fill} stroke={c.line} strokeWidth="2.2" />
    <circle cx={x} cy={y} r={r - 6} fill="white" stroke={W.tableLine} strokeWidth="1.3" />
    {reading ? <text x={x} y={r1(y + fs * 0.36)} textAnchor="middle" fontSize={fs} fontWeight="750" fill={tone === 'plain' ? ink : c.text}>{reading}</text>
      : <g><path d={`M${x} ${y}L${x + r * 0.35} ${y - r * 0.45}`} stroke={ink} strokeWidth="2.4" /><circle cx={x} cy={y} r="2.6" fill={ink} /></g>}
  </g>
}

/* ---------- Lab kit ---------- */

/** A bench top from x1 to x2. */
export function Bench({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return <path d={`M${x1} ${y}Q${(x1 + x2) / 2} ${y + 2} ${x2} ${y}`} stroke={W.panelLine} strokeWidth="3.4" fill="none" />
}
/** A potted plant; (x, y) is the bottom of the pot. `h` is the stem height above the soil. */
export function PotPlant({ x, y, h = 70, s = 1, dim = false }: { x: number; y: number; h?: number; s?: number; dim?: boolean }) {
  const leaves = Math.max(2, Math.round(h / 24))
  return <g transform={`translate(${x} ${y}) scale(${s})`} opacity={dim ? faded : 1}>
    <path d={`M0 -34C-2 ${-34 - h * 0.4} 2 ${-34 - h * 0.7} 0 ${-34 - h}`} fill="none" stroke={P.plantLine} strokeWidth="3.4" />
    {Array.from({ length: leaves }, (_, i) => {
      const side = i % 2 ? 1 : -1, ly = -34 - h * (0.3 + 0.62 * i / Math.max(1, leaves - 1)), len = 22 - i * 1.5
      return <path key={i} d={`M0 ${r1(ly)}C${side * 6} ${r1(ly - 13)} ${side * len * 0.8} ${r1(ly - 15)} ${side * len} ${r1(ly - 9)}C${side * len * 0.75} ${r1(ly)} ${side * 8} ${r1(ly + 3)} 0 ${r1(ly)}Z`} fill={P.plant} stroke={P.plantLine} strokeWidth="1.8" />
    })}
    <path d={`M-9 ${-34 - h}C-6 ${-44 - h} 6 ${-44 - h} 9 ${-34 - h}C4 ${-37 - h} -4 ${-37 - h} -9 ${-34 - h}Z`} fill={P.plant} stroke={P.plantLine} strokeWidth="1.6" />
    <path d="M-24 -34H24L19 -3Q18 0 15 0H-15Q-18 0 -19 -3Z" fill={W.pot} stroke={W.potLine} strokeWidth="2" />
    <rect x="-27" y="-40" width="54" height="10" rx="4" fill={W.pot} stroke={W.potLine} strokeWidth="2" />
    <path d="M-22 -40Q0 -45 22 -40" fill={W.soil} stroke={W.soilLine} strokeWidth="1.4" />
  </g>
}
/** A ruler standing upright; (x, y) is its bottom, `h` its height. */
export function Ruler({ x, y, h, w = 14, dim = false }: { x: number; y: number; h: number; w?: number; dim?: boolean }) {
  const n = Math.floor(h / 8)
  return <g opacity={dim ? faded : 1}>
    <rect x={x - w / 2} y={y - h} width={w} height={h} rx="2.5" fill="#f7ebc8" stroke="#b99a52" strokeWidth="1.6" />
    {Array.from({ length: n }, (_, i) => <path key={i} d={`M${x - w / 2} ${y - 4 - i * 8}h${i % 5 === 0 ? 8 : 4.5}`} stroke="#9c8040" strokeWidth="1.1" />)}
  </g>
}
/** A hanging lamp shade with a soft glow below; (x, y) is the middle of the shade's rim. */
export function Lampshade({ x, y, w = 70, glow = true, dim = false }: { x: number; y: number; w?: number; glow?: boolean; dim?: boolean }) {
  return <g opacity={dim ? faded : 1}>
    {glow && <path d={`M${x - w / 2 + 6} ${y}L${x - w * 0.9} ${y + 56}Q${x} ${y + 68} ${x + w * 0.9} ${y + 56}L${x + w / 2 - 6} ${y}Z`} fill={P.light} opacity=".45" />}
    <path d={`M${x} ${y - 36}V${y - 26}`} stroke={W.metalLine} strokeWidth="2" />
    <path d={`M${x - w / 2} ${y}C${x - w / 2 + 4} ${y - 18} ${x - 14} ${y - 26} ${x} ${y - 26}C${x + 14} ${y - 26} ${x + w / 2 - 4} ${y - 18} ${x + w / 2} ${y}Z`} fill={W.metal} stroke={W.metalLine} strokeWidth="2" />
    <ellipse cx={x} cy={y + 2} rx="9" ry="5" fill="#fff6d6" stroke={P.lightLine} strokeWidth="1.5" />
  </g>
}
/** A gas syringe lying flat; the nozzle is at (x, y) on the left and the barrel runs right. `fill` 0–1 is how far the plunger is out. */
export function GasSyringe({ x, y, w = 150, fill = 0.4, dim = false, scale = true }: { x: number; y: number; w?: number; fill?: number; dim?: boolean; scale?: boolean }) {
  const bx = x + 14, bw = w - 14, gas = bx + bw * fill
  return <g opacity={dim ? faded : 1}>
    <rect x={x} y={y - 4} width="16" height="8" rx="2" fill={W.glass} stroke={W.glassLine} strokeWidth="1.8" />
    <rect x={bx} y={y - 14} width={bw} height="28" rx="5" fill={W.glass} stroke={W.glassLine} strokeWidth="2.2" />
    <rect x={bx + 2} y={y - 12} width={r1(gas - bx - 2)} height="24" rx="4" fill="#e6f2ea" />
    {scale && Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${r1(bx + 8 + i * (bw - 16) / 9)} ${y - 14}v${i % 5 === 0 ? 9 : 6}`} stroke={W.glassLine} strokeWidth="1.2" />)}
    <rect x={r1(gas)} y={y - 12} width="7" height="24" rx="2" fill="#c3ccd4" stroke={W.metalLine} strokeWidth="1.6" />
    <path d={`M${r1(gas + 7)} ${y}H${r1(gas + bw * 0.55)}`} stroke={W.metalLine} strokeWidth="4" />
    <rect x={r1(gas + bw * 0.55)} y={y - 13} width="7" height="26" rx="2.5" fill="#c3ccd4" stroke={W.metalLine} strokeWidth="1.6" />
  </g>
}
