/*
 * The charts for the Higher statistics lessons (14H Box plots, 14H2 Cumulative frequency, 15H Histograms), drawn as
 * measured figures like the Foundation statistics charts (../../probability/tutor/statsPictures.ts): a box plot on a
 * number line (two stacked for comparing), a cumulative frequency curve with its read-across lines, and a histogram
 * with bars of unequal widths. A histogram whose squares are counted is drawn on the lesson card's own squared paper,
 * one square a unit, so the squares in the bars can be counted.
 *
 * Tones as everywhere: `lit` what a step uses (purple), `found` the answer (green), `x` the unknown, `faint` greyed out.
 */
import type { AngleFrame, FigureItem, FigurePoint, FigureTone } from '../../written-methods/tutor/methodWorking'
import { fig } from '../../geometry/tutor/figureLesson'

const CW = 8, CH = 3.4
/** A cumulative frequency graph is drawn taller than the other charts, so its curve's S-shape and readings show on a phone. */
const CFH = 5.2
const fmt = (n: number) => Number(n.toFixed(2)).toString()
const box = (x0: number, y0: number, x1: number, y1: number): FigurePoint[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const style = (tone?: FigureTone) => tone === 'lit' ? 'lit' : tone === 'found' ? 'found' : tone === 'x' ? 'x' : 'plain'
/** A chart drawn as big as the picture allows: a small margin, room only for its labels. */
const big = (frame: AngleFrame, pad = 18) => { frame.figure!.pad = pad; return frame }
const cross = ([x, y]: FigurePoint, s = 0.12): FigureItem[] =>
  [{ kind: 'line', from: [x - s, y - s], to: [x + s, y + s] }, { kind: 'line', from: [x - s, y + s], to: [x + s, y - s] }]

/** An axis along the bottom from `from` to `to`, a tick every `step`, numbered every `every` ticks. */
export type Axis = { from: number; to: number; step: number; every?: number; title?: string }

function xAxis(axis: Axis, px: (v: number) => number, y = 0): FigureItem[] {
  const items: FigureItem[] = [{ kind: 'line', from: [0, y], to: [CW, y] }]
  const n = Math.round((axis.to - axis.from) / axis.step)
  for (let k = 0; k <= n; k++) {
    const v = axis.from + k * axis.step
    items.push({ kind: 'line', from: [px(v), y - 0.12], to: [px(v), y + (y ? 0.12 : 0)] })
    // Numbered every other tick when there are a lot of them, so the numbers never run together on a phone.
    if (k % (axis.every ?? (n > 12 ? 2 : 1)) === 0) items.push({ kind: 'text', at: [px(v), y - 0.42], text: fmt(v), small: true })
  }
  if (axis.title) items.push({ kind: 'text', at: [CW / 2, y - 0.95], text: axis.title, tone: 'faint' })
  return items
}

function yAxis(axis: Axis, py: (v: number) => number, top: number): FigureItem[] {
  const items: FigureItem[] = [{ kind: 'line', from: [0, 0], to: [0, top + 0.2] }]
  const n = Math.round((axis.to - axis.from) / axis.step)
  for (let k = 0; k <= n; k++) {
    const v = axis.from + k * axis.step, t = fmt(v)
    items.push({ kind: 'line', from: [-0.12, py(v)], to: [0, py(v)] })
    if (k % (axis.every ?? 1) === 0) items.push({ kind: 'text', at: [-0.12, py(v)], text: t, dx: -4 - t.length * 3.4, small: true })
  }
  if (axis.title) items.push({ kind: 'text', at: [0, top + 0.6], text: axis.title, tone: 'faint', dx: axis.title.length * 3.2 })
  return items
}

/* ---------- Box plots (P12) ---------- */

/** The five values in order: smallest, lower quartile, median, upper quartile, largest. */
export type Five = [number, number, number, number, number]
/**
 * One box plot. `parts` are the values drawn so far (by their place in `five`, all five if not given); the whiskers and
 * the box are drawn once both their ends are. `tones` colour a value's line, and write the value above it.
 */
export type BoxPlot = { five: Five; name?: string; parts?: number[]; tones?: Partial<Record<number, FigureTone>>; values?: boolean }

/** Box plots over one number line, the first on top. */
export function boxFig(plots: BoxPlot[], axis: Axis, spoken: string, caption?: string): AngleFrame {
  const px = (v: number) => (v - axis.from) / (axis.to - axis.from) * CW
  const items: FigureItem[] = xAxis(axis, px)
  const named = plots.some(p => p.name), rowH = named ? 2.7 : 1.9, h = 1
  plots.forEach((plot, k) => {
    const y = 0.75 + (plots.length - 1 - k) * rowH, mid = y + h / 2
    const has = (i: number) => (plot.parts ?? [0, 1, 2, 3, 4]).includes(i)
    const [lo, q1, med, q3, hi] = plot.five.map(px)
    if (has(0) && has(1)) items.push({ kind: 'line', from: [lo, mid], to: [q1, mid] })
    if (has(3) && has(4)) items.push({ kind: 'line', from: [q3, mid], to: [hi, mid] })
    if (has(1) && has(3)) items.push({ kind: 'line', from: [q1, y], to: [q3, y] }, { kind: 'line', from: [q1, y + h], to: [q3, y + h] })
    ;[lo, q1, med, q3, hi].forEach((x, i) => {
      if (!has(i)) return
      const end = i === 0 || i === 4, tone = plot.tones?.[i]
      items.push({ kind: 'line', from: [x, end ? y + 0.2 : y], to: [x, end ? y + h - 0.2 : y + h], style: style(tone) })
      if (tone && tone !== 'faint') items.push({ kind: 'text', at: [x, y + h + 0.38], text: fmt(plot.five[i]), tone })
      else if (plot.values) items.push({ kind: 'text', at: [x, y + h + 0.32], text: fmt(plot.five[i]), small: true })
    })
    // The name sits over the plot's left end, above any value written on it, so the plots keep the picture's full width.
    if (plot.name) items.push({ kind: 'text', at: [0, y + h + 1.0], text: plot.name, tone: 'faint', dx: plot.name.length * 3.6 })
  })
  return big(fig(items, spoken, caption))
}

/* ---------- Cumulative frequency (P13) ---------- */

/**
 * A smooth curve through the points that never turns back down (a monotone cubic, Fritsch and Carlson), as a cumulative
 * frequency curve is drawn. `at(x)` is its height, `inverse(y)` where it reaches a height: what a reading off the graph
 * gives, so a question's answer is what its picture shows.
 */
export function cfCurve(points: [number, number][]) {
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]), n = points.length
  const d = xs.slice(1).map((x, i) => (ys[i + 1] - ys[i]) / (x - xs[i]))
  const m = xs.map((_, i) => i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2)
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = m[i + 1] = 0; continue }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b
    if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i] }
  }
  const at = (x: number) => {
    if (x <= xs[0]) return ys[0]
    if (x >= xs[n - 1]) return ys[n - 1]
    const i = Math.max(0, xs.findIndex((v, k) => x >= v && x <= xs[k + 1]))
    const hgt = xs[i + 1] - xs[i], t = (x - xs[i]) / hgt
    const h00 = 2 * t ** 3 - 3 * t ** 2 + 1, h10 = t ** 3 - 2 * t ** 2 + t, h01 = -2 * t ** 3 + 3 * t ** 2, h11 = t ** 3 - t ** 2
    return h00 * ys[i] + h10 * hgt * m[i] + h01 * ys[i + 1] + h11 * hgt * m[i + 1]
  }
  const inverse = (y: number) => {
    let lo = xs[0], hi = xs[n - 1]
    for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; if (at(mid) < y) lo = mid; else hi = mid }
    return (lo + hi) / 2
  }
  return { at, inverse }
}

/** A reading: across from a cumulative frequency to the curve and down (`cf`), or up from a value and across (`x`). */
export type Reading = { cf?: number; x?: number; tone?: FigureTone; label?: string }

/**
 * A cumulative frequency graph: the points (each class's end and its running total, the first the start of the first
 * class at 0) as crosses, and the smooth curve through them once `curve` is set (only the first `shown` points if
 * given). `reads` draw dashed lines from the axis to the curve and on to the other axis, the value labelled there.
 */
export function cfFig(points: [number, number][], x: Axis, y: Axis, spoken: string, opts: { curve?: boolean; shown?: number; reads?: Reading[]; lit?: number[]; caption?: string } = {}): AngleFrame {
  const px = (v: number) => (v - x.from) / (x.to - x.from) * CW, py = (v: number) => (v - y.from) / (y.to - y.from) * CFH
  const items: FigureItem[] = [...xAxis(x, px), ...yAxis(y, py, CFH)]
  const shown = points.slice(0, opts.shown ?? points.length)
  if (opts.curve) {
    const { at } = cfCurve(points), x0 = points[0][0], x1 = points[points.length - 1][0], steps = 60
    for (let k = 0; k < steps; k++) {
      const a = x0 + (x1 - x0) * k / steps, b = x0 + (x1 - x0) * (k + 1) / steps
      items.push({ kind: 'line', from: [px(a), py(at(a))], to: [px(b), py(at(b))] })
    }
  }
  shown.forEach((p, k) => {
    if (opts.lit?.includes(k)) items.push(...cross([px(p[0]), py(p[1])], 0.15).map(item => ({ ...item, style: 'lit' as const })), { kind: 'text', at: [px(p[0]) - 0.15, py(p[1]) + 0.4], text: `(${fmt(p[0])}, ${fmt(p[1])})`, tone: 'lit', small: true })
    else items.push(...cross([px(p[0]), py(p[1])]))
  })
  const { at, inverse } = cfCurve(points)
  for (const r of opts.reads ?? []) {
    const tone = r.tone ?? 'lit', s = tone === 'found' ? 'found' : 'dashed'
    if (r.cf !== undefined) {
      const v = inverse(r.cf)
      items.push({ kind: 'line', from: [0, py(r.cf)], to: [px(v), py(r.cf)], style: 'dashed' }, { kind: 'line', from: [px(v), py(r.cf)], to: [px(v), 0], style: s })
      items.push({ kind: 'text', at: [px(v), 0.38], text: r.label ?? fmt(v), tone, small: true })
    } else if (r.x !== undefined) {
      const v = at(r.x)
      items.push({ kind: 'line', from: [px(r.x), 0], to: [px(r.x), py(v)], style: 'dashed' }, { kind: 'line', from: [px(r.x), py(v)], to: [0, py(v)], style: s })
      items.push({ kind: 'text', at: [0.15, py(v) + 0.3], text: r.label ?? fmt(v), tone, small: true, dx: (r.label ?? fmt(v)).length * 3.6 })
    }
  }
  return big(fig(items, spoken, opts.caption, 30))
}

/* ---------- Histograms (P15) ---------- */

/** A class: its two ends and its frequency. */
export type Bar = [number, number, number]
export const density = ([a, b, f]: Bar) => f / (b - a)

/**
 * A histogram: each bar as wide as its class and as tall as its frequency density, with no gaps. `y` numbers the
 * frequency density axis (left out, the axis is unnumbered, as in the book's counting questions). `tones` shade bars;
 * `marks` write a number on a bar; `strip` shades part of the area, from one value to another; `hidden` bars aren't
 * drawn yet.
 */
export function histFig(bars: Bar[], x: Axis, y: Axis | null, spoken: string, opts: { top?: number; tones?: Partial<Record<number, FigureTone>>; marks?: Partial<Record<number, string>>; strip?: [number, number, ('lit' | 'found')?]; hidden?: number[]; caption?: string } = {}): AngleFrame {
  const top = y ? y.to : opts.top ?? Math.max(...bars.map(density)) * 1.15
  const px = (v: number) => (v - x.from) / (x.to - x.from) * CW, py = (v: number) => v / top * CH
  const items: FigureItem[] = [...xAxis(x, px), ...(y ? yAxis(y, py, CH) : [{ kind: 'line' as const, from: [0, 0] as FigurePoint, to: [0, CH + 0.2] as FigurePoint }])]
  if (!y) items.push({ kind: 'text', at: [0, CH + 0.6], text: 'Frequency density', tone: 'faint', dx: 17 * 3.2 })
  if (opts.strip) {
    const [a, b, tone] = opts.strip
    for (const bar of bars) {
      const lo = Math.max(a, bar[0]), hi = Math.min(b, bar[1])
      if (hi > lo) items.push({ kind: 'shade', loops: [box(px(lo), 0, px(hi), py(density(bar)))], tone: tone ?? 'lit' })
    }
  }
  bars.forEach((bar, k) => {
    if (opts.hidden?.includes(k)) return
    const tone = opts.tones?.[k], [a, b] = bar, h = py(density(bar))
    items.push({ kind: 'shape', points: box(px(a), 0, px(b), h), fill: 'none' })
    if (tone === 'lit' || tone === 'found') items.push({ kind: 'shade', loops: [box(px(a), 0, px(b), h)], tone })
    const mark = opts.marks?.[k]
    if (mark) items.push({ kind: 'text', at: [(px(a) + px(b)) / 2, h + 0.32], text: mark, small: !tone, ...(tone ? { tone } : {}) })
  })
  return big(fig(items, spoken, opts.caption, 30))
}

/**
 * A histogram on the lesson card's own squared paper, one square a unit, so its squares can be counted: each bar is
 * `w` squares wide and `h` squares tall, set out from 0. `labels` number the bottom axis at those squares.
 */
export function squaresHistFig(bars: { from: number; w: number; h: number; tone?: 'lit' | 'found'; mark?: string }[], labels: [number, string][], spoken: string, caption?: string): AngleFrame {
  const right = Math.max(...bars.map(b => b.from + b.w)), tall = Math.max(...bars.map(b => b.h))
  const items: FigureItem[] = [{ kind: 'grid', from: [0, 0], to: [right + 1, tall + 1] }, { kind: 'line', from: [0, 0], to: [right + 1, 0] }, { kind: 'line', from: [0, 0], to: [0, tall + 1] }]
  for (const b of bars) {
    items.push({ kind: 'shape', points: box(b.from, 0, b.from + b.w, b.h), fill: 'none' })
    if (b.tone) items.push({ kind: 'shade', loops: [box(b.from, 0, b.from + b.w, b.h)], tone: b.tone })
    if (b.mark) items.push({ kind: 'text', at: [b.from + b.w / 2, b.h + 0.6], text: b.mark, ...(b.tone ? { tone: b.tone } : {}) })
  }
  for (const [at, text] of labels) items.push({ kind: 'line', from: [at, -0.25], to: [at, 0] }, { kind: 'text', at: [at, -0.8], text, small: true })
  items.push({ kind: 'text', at: [0, tall + 2.2], text: 'Frequency density', tone: 'faint', dx: 17 * 3.2 })
  return big(fig(items, spoken, caption))
}

/* ---------- A list in order ---------- */

/** Values in order along a row, each with its place under it in small figures; `tones` light values by place (from 0). */
export function listFig(values: number[], spoken: string, tones: Partial<Record<number, FigureTone>> = {}, caption?: string): AngleFrame {
  // A long list goes on two rows, so its values and their boxed highlights never run together on a phone.
  const gap = 1, perRow = values.length > 8 ? Math.ceil(values.length / 2) : values.length, items: FigureItem[] = []
  values.forEach((v, k) => {
    const tone = tones[k], x = (k % perRow) * gap, y = -Math.floor(k / perRow) * 2
    items.push({ kind: 'text', at: [x, y], text: fmt(v), ...(tone ? { tone } : {}) })
    items.push({ kind: 'text', at: [x, y - 0.75], text: String(k + 1), tone: 'faint', small: true })
  })
  return fig(items, spoken, caption, 10)
}
