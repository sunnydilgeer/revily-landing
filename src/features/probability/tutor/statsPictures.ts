import type { AngleFrame, FigureItem, FigurePoint, FigureTone } from '../../written-methods/tutor/methodWorking'
import { fig } from '../../geometry/tutor/figureLesson'

/*
 * The charts for Statistics lessons 10 to 18 (P10–P18 in Sunny's revision book, p188–218), drawn as measured figures
 * (FigurePictures.tsx) like the probability pictures (chancePictures.ts): pictograms, stem and leaf diagrams, bar
 * charts (and dual bar charts), scatter graphs with a line of best fit, line graphs and pie charts.
 *
 * Every chart is drawn in the same box, 8 wide and 5 high, whatever its numbers, so a lesson's charts sit the same
 * size. Tones as everywhere: `lit` what a step uses (purple), `found` the answer (green), `x` the unknown, `faint`
 * greyed out.
 */

const CW = 8, CH = 3.4
/**
 * A label under the x-axis: when the labels are too long for their slots (about 30 pixels a unit, 8 a letter), every
 * other one drops to a second row so they never run into each other.
 */
const under = (labels: string[], slot: number) => {
  const tight = labels.some(l => l.length * 8 > slot * 30 - 4)
  return (k: number): FigurePoint => [slot * (k + 0.5), tight && k % 2 ? -0.85 : -0.4]
}
const box = (x0: number, y0: number, x1: number, y1: number): FigurePoint[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const fmt = (n: number) => Number(n.toFixed(2)).toString()
/** An ×, as the book plots a point. */
const cross = ([x, y]: FigurePoint, style: 'plain' | 'lit' | 'found' | 'x' = 'plain', s = 0.13): FigureItem[] =>
  [{ kind: 'line', from: [x - s, y - s], to: [x + s, y + s], style }, { kind: 'line', from: [x - s, y + s], to: [x + s, y - s], style }]
const lineStyle = (tone?: FigureTone) => tone === 'lit' ? 'lit' : tone === 'found' ? 'found' : tone === 'x' ? 'x' : 'plain'

/** The y-axis, numbered every `step` up to `max`, with its title along the top. */
function yAxis(max: number, step: number, title?: string): FigureItem[] {
  const items: FigureItem[] = [{ kind: 'line', from: [0, 0], to: [0, CH + 0.2] }]
  for (let t = 0; t <= max + 1e-9; t += step) {
    const y = t / max * CH
    items.push({ kind: 'line', from: [-0.1, y], to: [0, y] }, { kind: 'text', at: [-0.1, y], text: fmt(t), dx: -4 - fmt(t).length * 3.6 })
  }
  if (title) items.push({ kind: 'text', at: [0, CH + 0.55], text: title, tone: 'faint', dx: title.length * 3.2 })
  return items
}

/* ---------- Bar charts (P15) ---------- */

/**
 * A bar chart: one bar per label, or two side by side (a dual bar chart, `series` of two lists, named in `legend`).
 * `tones` mark single bars by [series, bar]; `values` writes each bar's number on top of it.
 */
export function barFig(labels: string[], series: number[][], spoken: string, opts: { max: number; step: number; tones?: [number, number, FigureTone][]; legend?: [string, string]; values?: boolean; yTitle?: string; caption?: string }): AngleFrame {
  const items: FigureItem[] = [...yAxis(opts.max, opts.step, opts.yTitle), { kind: 'line', from: [0, 0], to: [CW, 0] }]
  const slot = CW / labels.length, n = series.length, w = slot * (n > 1 ? 0.36 : 0.56), below = under(labels, slot)
  labels.forEach((label, k) => {
    series.forEach((values, s) => {
      const x0 = slot * k + (slot - w * n) / 2 + s * w, h = values[k] / opts.max * CH
      const tone = opts.tones?.find(([ts, tk]) => ts === s && tk === k)?.[2]
      if (h > 0) items.push({ kind: 'shape', points: box(x0, 0, x0 + w, h), ...(s ? { fill: 'none' as const } : {}) })
      if (h > 0 && (tone === 'lit' || tone === 'found')) items.push({ kind: 'shade', loops: [box(x0, 0, x0 + w, h)], tone })
      if (opts.values || tone) items.push({ kind: 'text', at: [x0 + w / 2, h + 0.32], text: fmt(values[k]), ...(tone ? { tone } : {}) })
    })
    items.push({ kind: 'text', at: below(k), text: label })
  })
  if (opts.legend) {
    // The key along the top, right of the axis title: a swatch, its name, then the other (about 30 pixels a unit).
    const x1 = 2.6, x2 = x1 + 0.45 + (opts.legend[0].length * 9 + 16) / 30
    items.push({ kind: 'shape', points: box(x1, CH + 0.35, x1 + 0.25, CH + 0.6) }, { kind: 'text', at: [x1 + 0.35, CH + 0.48], text: opts.legend[0], dx: opts.legend[0].length * 4.6 + 2 },
      { kind: 'shape', points: box(x2, CH + 0.35, x2 + 0.25, CH + 0.6), fill: 'none' }, { kind: 'text', at: [x2 + 0.35, CH + 0.48], text: opts.legend[1], dx: opts.legend[1].length * 4.6 + 2 })
  }
  return fig(items, spoken, opts.caption)
}

/* ---------- Line graphs (P17) ---------- */

/**
 * A line graph: a point (an ×) over each label, joined by straight lines. `tones` mark points; `lit` segments (by the
 * point they start from) are drawn purple. `xs` puts the points at uneven places along the axis (Roger's mistake).
 */
export function lineFig(labels: string[], values: (number | null)[], spoken: string, opts: { max: number; step: number; min?: number; tones?: Partial<Record<number, FigureTone>>; lit?: number[]; join?: boolean; xs?: number[]; yTitle?: string; caption?: string; ticks?: string[] }): AngleFrame {
  const min = opts.min ?? 0, span = opts.max - min
  const items: FigureItem[] = [{ kind: 'line', from: [0, 0], to: [0, CH + 0.2] }, { kind: 'line', from: [0, 0], to: [CW, 0] }]
  for (let t = min; t <= opts.max + 1e-9; t += opts.step) {
    const y = (t - min) / span * CH, label = opts.ticks?.[Math.round((t - min) / opts.step)] ?? fmt(t)
    items.push({ kind: 'line', from: [-0.1, y], to: [0, y] }, { kind: 'text', at: [-0.1, y], text: label, dx: -4 - label.length * 3.6 })
  }
  if (opts.yTitle) items.push({ kind: 'text', at: [0, CH + 0.55], text: opts.yTitle, tone: 'faint', dx: opts.yTitle.length * 3.2 })
  const slot = CW / labels.length, xOf = (k: number) => opts.xs ? opts.xs[k] : slot * (k + 0.5)
  const at = (k: number): FigurePoint => [xOf(k), ((values[k] ?? min) - min) / span * CH]
  const below = under(labels, opts.xs ? CW / labels.length : slot)
  labels.forEach((label, k) => items.push({ kind: 'text', at: [xOf(k), below(k)[1]], text: label }))
  if (opts.join !== false) values.forEach((value, k) => {
    if (k && value !== null && values[k - 1] !== null) items.push({ kind: 'line', from: at(k - 1), to: at(k), style: opts.lit?.includes(k - 1) ? 'lit' : 'plain' })
  })
  values.forEach((value, k) => {
    if (value === null) return
    const tone = opts.tones?.[k]
    items.push(...cross(at(k), lineStyle(tone)))
    if (tone && tone !== 'faint') items.push({ kind: 'text', at: [at(k)[0], at(k)[1] + 0.45], text: fmt(value), tone })
  })
  return fig(items, spoken, opts.caption)
}

/* ---------- Scatter graphs (P16) ---------- */

export type ScatterAxis = { from: number; to: number; step: number; title: string }

/**
 * A scatter graph: each point an ×. `line` draws a line of best fit between two points (in the data's own units);
 * `read` draws the dashed lines from the x-axis up to the line and across to the y-axis, as when predicting.
 */
export function scatterFig(points: [number, number][], x: ScatterAxis, y: ScatterAxis, spoken: string, opts: { line?: [[number, number], [number, number]]; read?: [number, number]; tones?: Partial<Record<number, FigureTone>>; caption?: string; numbers?: boolean } = {}): AngleFrame {
  const px = (v: number) => (v - x.from) / (x.to - x.from) * CW, py = (v: number) => (v - y.from) / (y.to - y.from) * CH
  const items: FigureItem[] = [{ kind: 'line', from: [0, 0], to: [0, CH + 0.2] }, { kind: 'line', from: [0, 0], to: [CW + 0.2, 0] }]
  for (let t = x.from; t <= x.to + 1e-9; t += x.step) items.push({ kind: 'line', from: [px(t), -0.1], to: [px(t), 0] }, { kind: 'text', at: [px(t), -0.4], text: fmt(t) })
  for (let t = y.from; t <= y.to + 1e-9; t += y.step) items.push({ kind: 'line', from: [-0.1, py(t)], to: [0, py(t)] }, { kind: 'text', at: [-0.1, py(t)], text: fmt(t), dx: -4 - fmt(t).length * 3.6 })
  items.push({ kind: 'text', at: [CW / 2, -0.95], text: x.title, tone: 'faint' }, { kind: 'text', at: [0, CH + 0.55], text: y.title, tone: 'faint', dx: y.title.length * 3.2 })
  if (opts.line) items.push({ kind: 'line', from: [px(opts.line[0][0]), py(opts.line[0][1])], to: [px(opts.line[1][0]), py(opts.line[1][1])], style: 'lit' })
  if (opts.read) {
    const [rx, ry] = opts.read
    items.push({ kind: 'line', from: [px(rx), 0], to: [px(rx), py(ry)], style: 'dashed' }, { kind: 'line', from: [px(rx), py(ry)], to: [0, py(ry)], style: 'dashed' })
  }
  points.forEach((p, k) => {
    const tone = opts.tones?.[k]
    items.push(...cross([px(p[0]), py(p[1])], lineStyle(tone)))
    if (tone && tone !== 'faint') items.push({ kind: 'text', at: [px(p[0]), py(p[1]) + 0.45], text: `(${fmt(p[0])}, ${fmt(p[1])})`, tone })
  })
  return fig(items, spoken, opts.caption)
}

/* ---------- Pie charts (P18) ---------- */

/**
 * A pie chart: slices in order, clockwise from the top, each its share of 360°. `show` writes the slice's name, its
 * angle, or both inside it; `tones` mark slices (a `lit` or `found` slice is shaded); `angles` overrides the angles
 * drawn (a slice the question hides is drawn at its true size).
 */
export function pieFig(labels: string[], values: number[], spoken: string, opts: { show?: 'names' | 'angles' | 'both'; tones?: Partial<Record<number, FigureTone>>; caption?: string; marks?: Partial<Record<number, string>> } = {}): AngleFrame {
  const total = values.reduce((s, n) => s + n, 0), r = 2.2, items: FigureItem[] = [{ kind: 'circle', centre: [0, 0], r, fill: 'none' }]
  let turn = 0
  values.forEach((value, k) => {
    const angle = value / total * 360, from = 90 - turn - angle, to = 90 - turn, tone = opts.tones?.[k]
    turn += angle
    items.push({ kind: 'arc', centre: [0, 0], r, from, to, sector: true, ...(tone === 'lit' || tone === 'found' ? { fill: 'part' as const } : {}) })
    const mid = (from + to) / 2 * Math.PI / 180, at: FigurePoint = [r * 0.6 * Math.cos(mid), r * 0.6 * Math.sin(mid)]
    const name = labels[k], deg = opts.marks?.[k] ?? `${fmt(angle)}°`
    const lines = opts.show === 'angles' ? [deg] : opts.show === 'both' ? [name, deg] : [name]
    if (angle < 22) items.push({ kind: 'text', at: [r * 1.2 * Math.cos(mid), r * 1.2 * Math.sin(mid)], text: lines.join(' '), dx: Math.cos(mid) * lines.join(' ').length * 3.6, ...(tone ? { tone } : {}) })
    else lines.forEach((line, i) => items.push({ kind: 'text', at: [at[0], at[1] + ((lines.length - 1) / 2 - i) * 0.42], text: line, ...(tone && (opts.show !== 'both' || i) ? { tone } : {}) }))
  })
  return fig(items, spoken, opts.caption, 40)
}

/* ---------- Pictograms (P10) ---------- */

/**
 * A pictogram: a row of pictures for each label, each picture a square of four quarters (so ¾ of a picture is three
 * of them), and the key under it. `values` are in quarters of a picture. `tones` mark whole rows.
 */
export function pictogramFig(labels: string[], values: number[], key: string, spoken: string, opts: { tones?: Partial<Record<number, FigureTone>>; caption?: string; counts?: Partial<Record<number, string>> } = {}): AngleFrame {
  const S = 0.62, gap = 0.16, rowH = 0.85, items: FigureItem[] = []
  const rows = labels.length, top = rows * rowH
  const label0 = Math.max(...labels.map(l => l.length)) * 0.16 + 0.3
  labels.forEach((label, k) => {
    const y = top - (k + 1) * rowH + (rowH - S) / 2, tone = opts.tones?.[k]
    items.push({ kind: 'text', at: [-label0 / 2 - 0.2, y + S / 2], text: label, ...(tone ? { tone } : {}) })
    items.push({ kind: 'line', from: [-0.15, top - (k + 1) * rowH], to: [Math.max(4, ...values.map(v => Math.ceil(v / 4))) * (S + gap) + 0.1, top - (k + 1) * rowH], style: 'dashed' })
    for (let i = 0; i * 4 < values[k]; i++) {
      const x = i * (S + gap), part = Math.min(4, values[k] - i * 4)
      const cells: [number, number][] = [[0, 1], [1, 1], [0, 0], [1, 0]]
      if (part === 4) items.push({ kind: 'shape', points: box(x, y, x + S, y + S), ...(tone === 'lit' || tone === 'found' ? { fill: 'part' as const } : {}) })
      else cells.slice(0, part).forEach(([cx, cy]) => items.push({ kind: 'shape', points: box(x + cx * S / 2, y + cy * S / 2, x + (cx + 1) * S / 2, y + (cy + 1) * S / 2), ...(tone === 'lit' || tone === 'found' ? { fill: 'part' as const } : {}) }))
    }
    const count = opts.counts?.[k]
    if (count) items.push({ kind: 'text', at: [Math.ceil(values[k] / 4) * (S + gap) + 0.3, y + S / 2], text: count, dx: count.length * 3.6, tone: tone ?? 'found' })
  })
  items.push({ kind: 'line', from: [-0.15, 0], to: [-0.15, top], style: 'plain' })
  items.push({ kind: 'shape', points: box(0, -0.95, S, -0.95 + S) }, { kind: 'text', at: [S + 0.2, -0.95 + S / 2], text: `= ${key}`, dx: (key.length + 2) * 3.6 })
  return fig(items, spoken, opts.caption, 30)
}

/* ---------- Stem and leaf diagrams (P11) ---------- */

/**
 * A stem and leaf diagram: the stems down the middle and each row's leaves to the right in order, with its key under
 * it. `back` puts a second set of leaves on the left (a back-to-back diagram), read outwards from the stem. `tones`
 * mark single leaves by [row, leaf] (negative leaf numbers count the left-hand leaves, -1 the nearest the stem).
 */
export function stemLeafFig(stems: string[], leaves: number[][], key: string, spoken: string, opts: { back?: number[][]; tones?: [number, number, FigureTone][]; caption?: string; keyBack?: string; names?: [string, string] } = {}): AngleFrame {
  const items: FigureItem[] = [], rowH = 0.55, gap = 0.42, top = stems.length * rowH
  const width = Math.max(4, ...leaves.map(l => l.length)) * gap
  const backW = opts.back ? Math.max(4, ...opts.back.map(l => l.length)) * gap : 0
  items.push({ kind: 'line', from: [0.35, top + 0.1], to: [0.35, -0.05] })
  stems.forEach((stem, r) => {
    const y = top - (r + 0.5) * rowH
    items.push({ kind: 'text', at: [0, y], text: stem, name: true })
    leaves[r].forEach((leaf, i) => {
      const tone = opts.tones?.find(([tr, ti]) => tr === r && ti === i)?.[2]
      items.push({ kind: 'text', at: [0.7 + i * gap, y], text: String(leaf), ...(tone ? { tone } : {}) })
    })
    opts.back?.[r]?.forEach((leaf, i) => {
      const tone = opts.tones?.find(([tr, ti]) => tr === r && ti === -(i + 1))?.[2]
      items.push({ kind: 'text', at: [-0.4 - i * gap, y], text: String(leaf), ...(tone ? { tone } : {}) })
    })
  })
  if (opts.back) items.push({ kind: 'line', from: [-0.15, top + 0.1], to: [-0.15, -0.05] })
  if (opts.names) items.push({ kind: 'text', at: [-backW / 2 - 0.2, top + 0.4], text: opts.names[0], tone: 'faint' }, { kind: 'text', at: [0.5 + width / 2, top + 0.4], text: opts.names[1], tone: 'faint' })
  items.push({ kind: 'text', at: [0.35 + (width - backW) / 2, -0.55], text: `Key: ${key}`, tone: 'faint' })
  if (opts.keyBack) items.push({ kind: 'text', at: [0.35 + (width - backW) / 2, -1.0], text: `Key: ${opts.keyBack}`, tone: 'faint' })
  return fig(items, spoken, opts.caption, 24)
}
