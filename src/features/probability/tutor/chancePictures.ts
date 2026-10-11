import type { AngleFrame, FigureItem, FigurePoint, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { fig } from '../../geometry/tutor/figureLesson'

/** The picture's size and margin (FigurePictures.tsx), for the pictures measured in its own pixels. */
const PICTURE = { h: 210, pad: 38 }

/*
 * The pictures for Probability and statistics (lessons 1 to 9, P1–P9 in Sunny's revision book, p162–187), drawn as
 * measured figures (FigurePictures.tsx) like the Geometry ones: Venn diagrams with shaded regions, probability trees,
 * frequency trees, tables (two-way tables, sample spaces, frequency tables), the probability scale, spinners,
 * questionnaire questions with their tick boxes, and data values as tiles.
 *
 * Every builder takes its words and numbers as strings and a `caption`, and says out loud what it shows. Tones as in
 * the Geometry pictures: `given` ink, `x` the unknown, `lit` what a step uses (purple), `found` the answer (green box),
 * `faint` greyed out.
 */

const rad = (d: number) => d * Math.PI / 180
const loop = ([cx, cy]: FigurePoint, r: number, from = 0, to = 360, n = 48): FigurePoint[] =>
  Array.from({ length: n + 1 }, (_, k) => { const a = rad(from + (to - from) * k / n); return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as FigurePoint })
const box = (x0: number, y0: number, x1: number, y1: number): FigurePoint[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** A word or number at a point; several lines stack about it, `gap` apart. */
const words = (at: FigurePoint, lines: string[], tone?: FigureTone, gap = 0.42): FigureItem[] =>
  lines.map((line, k) => ({ kind: 'text', at: [at[0], at[1] + ((lines.length - 1) / 2 - k) * gap], text: line, ...(tone ? { tone } : {}) }))

/* ---------- Venn diagrams ---------- */

export type VennRegion = 'onlyA' | 'both' | 'onlyB' | 'outside'
/** What a two-set Venn diagram's region can be shaded as: the book's set notation (P6). */
export type VennShade = 'A' | 'B' | 'A∩B' | 'A∪B' | "A'" | "B'" | "A∩B'" | "A'∩B" | "(A∪B)'" | "(A∩B)'"
export type VennSpec = {
  /** The two sets' names, over their circles: 'A' and 'B', or 'Football' and 'Rugby'. */
  names: [string, string]
  /** What goes in each region: numbers or counts, a line each (a long list goes on two or three lines). */
  regions?: Partial<Record<VennRegion, string[]>>
  /** Each region's tone: `x` for the one to find, `lit` for the one a step uses, `found` for the answer. */
  tones?: Partial<Record<VennRegion, FigureTone>>
  shade?: VennShade
  shadeTone?: 'lit' | 'found'
  spoken: string
  caption?: string
}

const RECT = box(0, 0, 7, 4), A_C: FigurePoint = [2.25, 2], B_C: FigurePoint = [3.75, 2], R = 1.4
const VENN_AT: Record<VennRegion, FigurePoint> = { onlyA: [1.55, 2], both: [3, 2], onlyB: [4.45, 2], outside: [6.15, 0.75] }
/** The lens where the circles overlap: A's arc on its right, then B's on its left. */
function lens(): FigurePoint[] {
  const h = Math.sqrt(R * R - 0.75 * 0.75), t = Math.atan2(h, 0.75) * 180 / Math.PI
  return [...loop(A_C, R, -t, t, 24), ...loop(B_C, R, 180 - t, 180 + t, 24)]
}
/** A region as loops filled even-odd: a point inside an even number of loops is left clear. */
export function vennLoops(shade: VennShade): FigurePoint[][] {
  const A = loop(A_C, R), B = loop(B_C, R), L = lens()
  return ({ A: [A], B: [B], 'A∩B': [L], 'A∪B': [A, B, L], "A'": [RECT, A], "B'": [RECT, B], "A∩B'": [A, L], "A'∩B": [B, L], "(A∪B)'": [RECT, A, B, L], "(A∩B)'": [RECT, L] } as Record<VennShade, FigurePoint[][]>)[shade]
}

export function vennFig(spec: VennSpec): AngleFrame {
  const items: FigureItem[] = []
  if (spec.shade) items.push({ kind: 'shade', loops: vennLoops(spec.shade), tone: spec.shadeTone ?? 'lit' })
  items.push({ kind: 'shape', points: RECT, fill: 'none' }, { kind: 'circle', centre: A_C, r: R, fill: 'none' }, { kind: 'circle', centre: B_C, r: R, fill: 'none' },
    { kind: 'text', at: [0.3, 3.62], text: 'ξ', name: true },
    { kind: 'text', at: [1.35, 3.62], text: spec.names[0], name: true }, { kind: 'text', at: [4.65, 3.62], text: spec.names[1], name: true })
  for (const region of ['onlyA', 'both', 'onlyB', 'outside'] as VennRegion[]) {
    const lines = spec.regions?.[region]
    if (lines?.length) items.push(...words(VENN_AT[region], lines, spec.tones?.[region], region === 'both' ? 0.45 : 0.42))
  }
  return fig(items, spec.spoken, spec.caption)
}

export type Venn3Region = 'onlyA' | 'onlyB' | 'onlyC' | 'AB' | 'AC' | 'BC' | 'ABC' | 'outside'
const V3: Record<'A' | 'B' | 'C', FigurePoint> = { A: [2.35, 2.45], B: [3.65, 2.45], C: [3, 1.35] }
const V3_AT: Record<Venn3Region, FigurePoint> = { onlyA: [1.7, 2.8], onlyB: [4.3, 2.8], onlyC: [3, 0.55], AB: [3, 3.1], AC: [2.3, 1.55], BC: [3.7, 1.55], ABC: [3, 2.08], outside: [6.05, 0.6] }
/** Three overlapping sets (P5 Your Turn Q3): one number in each of the eight regions. */
export function venn3Fig(names: [string, string, string], regions: Partial<Record<Venn3Region, string>>, spoken: string, opts: { tones?: Partial<Record<Venn3Region, FigureTone>>; caption?: string } = {}): AngleFrame {
  const items: FigureItem[] = [{ kind: 'shape', points: RECT, fill: 'none' },
    ...(['A', 'B', 'C'] as const).map(k => ({ kind: 'circle' as const, centre: V3[k], r: 1.2, fill: 'none' as const })),
    { kind: 'text', at: [0.3, 3.62], text: 'ξ', name: true },
    { kind: 'text', at: [1.15, 3.62], text: names[0], name: true }, { kind: 'text', at: [4.85, 3.62], text: names[1], name: true }, { kind: 'text', at: [4.5, 0.6], text: names[2], name: true }]
  for (const [region, value] of Object.entries(regions) as [Venn3Region, string][]) items.push({ kind: 'text', at: V3_AT[region], text: value, ...(opts.tones?.[region] ? { tone: opts.tones[region] } : {}) })
  return fig(items, spoken, opts.caption)
}

/* ---------- Trees ---------- */

/** A branch: what it leads to, and its probability (a probability tree) or count (a frequency tree). */
export type Branch = { label: string; value: string; tone?: FigureTone }
const FIRST_Y = [1.1, -1.1], LEAF_Y = [1.65, 0.55, -0.55, -1.65]

/**
 * A probability tree (P3): two events, two outcomes each. The probability sits on each branch and the outcome at its
 * end; `results` writes each path's answer at the end of its row, and `lit` draws the paths a step uses in purple.
 */
export function probTreeFig(first: Branch[], second: Branch[][] | null, spoken: string, opts: { lit?: number[]; results?: (string | null)[]; resultTone?: FigureTone; heads?: [string, string]; caption?: string } = {}): AngleFrame {
  const items: FigureItem[] = []
  const lit = new Set(opts.lit ?? [])
  const firstLit = (i: number) => lit.has(2 * i) || lit.has(2 * i + 1) || (!second && lit.has(i))
  first.forEach((b, i) => {
    const end: FigurePoint = [2.2, second ? FIRST_Y[i] : FIRST_Y[i] * 0.8]
    items.push({ kind: 'line', from: [0, 0], to: end, style: firstLit(i) ? 'lit' : 'plain' })
    items.push({ kind: 'text', at: [1.0, end[1] * 0.5 + (i ? -0.32 : 0.32)], text: b.value, ...(b.tone ? { tone: b.tone } : {}) })
    items.push({ kind: 'text', at: end, text: b.label, name: true, dx: second ? 0 : 22, dy: second ? (i ? 18 : -14) : 0 })
    second?.[i]?.forEach((c, j) => {
      const leaf = 2 * i + j, to: FigurePoint = [4.4, LEAF_Y[leaf]]
      items.push({ kind: 'line', from: end, to, style: lit.has(leaf) ? 'lit' : 'plain' })
      items.push({ kind: 'text', at: [3.3, (end[1] + to[1]) / 2 + (j ? -0.27 : 0.27)], text: c.value, ...(c.tone ? { tone: c.tone } : {}) })
      items.push({ kind: 'text', at: to, text: c.label, name: true, dx: 18 })
      const result = opts.results?.[leaf]
      if (result) items.push({ kind: 'text', at: [6.4, to[1]], text: result, tone: lit.has(leaf) || !opts.lit ? opts.resultTone ?? 'given' : 'faint' })
    })
  })
  if (opts.heads) items.push({ kind: 'text', at: [1.1, 2.2], text: opts.heads[0], name: true }, { kind: 'text', at: [3.3, 2.2], text: opts.heads[1], name: true })
  return fig(items, spoken, opts.caption, 10)
}

/**
 * A frequency tree (P2): the total in the first circle, then each group's count in a circle at the end of its
 * branch. A group's name sits over its circle (under it for the lower one); a split's names sit to the right of the
 * last circles, where there is room for them. `second` splits each group again.
 */
const NODE = 0.5
export function freqTreeFig(total: Branch, first: Branch[], second: Branch[][] | null, spoken: string, opts: { lit?: number[]; caption?: string } = {}): AngleFrame {
  const items: FigureItem[] = []
  const lit = new Set(opts.lit ?? [])
  const node = (at: FigurePoint, b: Branch) => {
    items.push({ kind: 'circle', centre: at, r: NODE, fill: 'none' })
    items.push({ kind: 'text', at, text: b.value, ...(b.tone ? { tone: b.tone } : {}) })
  }
  const shift = (from: FigurePoint, to: FigurePoint, by: number): FigurePoint => { const d = Math.hypot(to[0] - from[0], to[1] - from[1]); return [from[0] + (to[0] - from[0]) * by / d, from[1] + (to[1] - from[1]) * by / d] }
  // To the right of a circle: the word's middle is counted in the picture's size, about 0.16 of a unit a letter out.
  const beside = (at: FigurePoint, label: string): FigureItem => ({ kind: 'text', at: [at[0] + NODE + 0.2 + label.length * 0.16, at[1]], text: label, tone: 'faint' })
  const root: FigurePoint = [0, 0]
  first.forEach((b, i) => {
    const end: FigurePoint = [2.6, second ? FIRST_Y[i] : FIRST_Y[i] * 0.8]
    items.push({ kind: 'line', from: shift(root, end, NODE), to: shift(end, root, NODE), style: lit.has(2 * i) || lit.has(2 * i + 1) || (!second && lit.has(i)) ? 'lit' : 'plain' })
    items.push(second ? { kind: 'text', at: [end[0], end[1] + (i ? -0.78 : 0.78)], text: b.label, tone: 'faint' } : beside(end, b.label))
    node(end, b)
    second?.[i]?.forEach((c, j) => {
      const leaf = 2 * i + j, to: FigurePoint = [5.2, LEAF_Y[leaf]]
      items.push({ kind: 'line', from: shift(end, to, NODE), to: shift(to, end, NODE), style: lit.has(leaf) ? 'lit' : 'plain' })
      items.push(beside(to, c.label))
      node(to, c)
    })
  })
  node(root, total)
  return fig(items, spoken, opts.caption, 18)
}

/* ---------- Tables ---------- */

/**
 * A table drawn as cells: the first row is its heading (bold). `tones` colour single cells, by [row, column]. It is
 * measured in the picture's own pixels (a letter is about 9 wide), so every cell is wide enough for its longest entry
 * and a tall table, drawn smaller, gets wider cells to match.
 */
export function tableFig(rows: string[][], spoken: string, opts: { tones?: [number, number, FigureTone][]; caption?: string; headColumn?: boolean } = {}): AngleFrame {
  const cols = Math.max(...rows.map(r => r.length)), H = 26
  const shrink = Math.min(1, (PICTURE.h - 2 * PICTURE.pad) / (rows.length * H))
  const widths = Array.from({ length: cols }, (_, c) => Math.max(40, ...rows.map(r => (r[c] ?? '').length * 9 + 18)) / shrink)
  const items: FigureItem[] = []
  const xs = widths.reduce<number[]>((a, w) => [...a, a.at(-1)! + w], [0])
  rows.forEach((row, r) => row.forEach((cell, c) => {
    const y1 = (rows.length - r) * H, y0 = y1 - H
    const head = r === 0 || (opts.headColumn && c === 0)
    items.push({ kind: 'shape', points: box(xs[c], y0, xs[c + 1], y1), fill: head ? undefined : 'none' })
    const tone = opts.tones?.find(([tr, tc]) => tr === r && tc === c)?.[2]
    if (cell) items.push({ kind: 'text', at: [(xs[c] + xs[c + 1]) / 2, (y0 + y1) / 2], text: cell, ...(tone ? { tone } : {}) })
  }))
  return fig(items, spoken, opts.caption, -24)
}

/* ---------- The probability scale ---------- */

/** The scale from 0 to 1 (P1), marked at 0, ½ and 1 with its words; `marks` put events on it, labelled above. */
export function scaleFig(marks: { at: number; label: string; tone?: FigureTone }[], spoken: string, opts: { words?: boolean; caption?: string } = {}): AngleFrame {
  const L = 6, items: FigureItem[] = [{ kind: 'line', from: [0, 0], to: [L, 0] }]
  for (const [v, n] of [[0, '0'], [0.5, '½'], [1, '1']] as const) items.push({ kind: 'line', from: [v * L, -0.18], to: [v * L, 0.18] }, { kind: 'text', at: [v * L, -0.5], text: n, name: true })
  if (opts.words !== false) items.push({ kind: 'text', at: [0, -1.05], text: 'Impossible', tone: 'faint', dx: 12 }, { kind: 'text', at: [L / 2, -1.05], text: 'Even', tone: 'faint' }, { kind: 'text', at: [L, -1.05], text: 'Certain', tone: 'faint' })
  marks.forEach((m, k) => {
    items.push({ kind: 'point', at: [m.at * L, 0] })
    items.push({ kind: 'text', at: [m.at * L, 0.55 + (k % 2) * 0.5], text: m.label, ...(m.tone ? { tone: m.tone } : {}) })
  })
  return fig(items, spoken, opts.caption)
}

/* ---------- Spinners ---------- */

/** A spinner cut into equal sections, numbered or named round it; `lit` shades the sections a step counts. */
export function spinnerFig(labels: string[], spoken: string, opts: { lit?: number[]; caption?: string } = {}): AngleFrame {
  const n = labels.length, step = 360 / n, r = 1.5, items: FigureItem[] = []
  const words = labels.some(label => label.length > 2)
  labels.forEach((label, k) => {
    const from = 90 - (k + 1) * step, to = 90 - k * step, mid = rad((from + to) / 2)
    items.push({ kind: 'arc', centre: [0, 0], r, from, to, sector: true, ...(opts.lit?.includes(k) ? { fill: 'part' as const } : {}) })
    // Numbers fit inside their section; words go just outside the rim, their near end against it.
    items.push(words ? { kind: 'text', at: [1.12 * r * Math.cos(mid), 1.12 * r * Math.sin(mid)], text: label, dx: Math.cos(mid) * label.length * 4.5, dy: -Math.sin(mid) * 4 }
      : { kind: 'text', at: [0.665 * r * Math.cos(mid), 0.665 * r * Math.sin(mid)], text: label })
  })
  items.push({ kind: 'line', from: [0, 0], to: [0.55, 0.85], arrow: true }, { kind: 'point', at: [0, 0] })
  return fig(items, spoken, opts.caption, words ? Math.max(...labels.map(label => label.length)) * 9 - 20 : undefined)
}

/* ---------- Questionnaires ---------- */

/** Breaks a sentence into lines of about `width` letters. */
export function wrap(sentence: string, width = 30): string[] {
  const lines: string[] = []
  for (const word of sentence.split(' ')) {
    if (lines.length && (lines.at(-1)! + ' ' + word).length <= width) lines[lines.length - 1] += ' ' + word
    else lines.push(word)
  }
  return lines
}

/**
 * A questionnaire question as the book draws it (P9): the question, then a tick box over each answer. Measured in the
 * picture's own pixels like a table, with a long answer on two lines so the answers never run into each other.
 */
export function formFig(question: string, options: string[], spoken: string, opts: { tones?: Partial<Record<number, FigureTone>>; caption?: string } = {}): AngleFrame {
  const answers = options.map(o => wrap(o, 7)), deep = Math.max(...answers.map(a => a.length))
  const slot = Math.max(56, ...answers.flat().map(line => line.length * 9 + 20))
  const q = wrap(question, 28), W = Math.max(slot * options.length, ...q.map(line => line.length * 9 + 16)), each = W / options.length
  // A boxed answer (lit or found) is 28 high, so its lines sit further apart.
  const gap = Object.values(opts.tones ?? {}).some(t => t === 'lit' || t === 'found') ? 30 : 16
  const under = gap > 16 ? 18 : 12, tick = (deep - 1) * gap + under + 12, top = tick + 40 + q.length * 18
  const items: FigureItem[] = [{ kind: 'shape', points: box(-8, -8, W + 8, top), fill: 'none' }]
  items.push(...words([W / 2, tick + 36 + (q.length - 1) * 9], q, undefined, 18))
  answers.forEach((lines, k) => {
    const cx = each * (k + 0.5)
    items.push({ kind: 'shape', points: box(cx - 8, tick, cx + 8, tick + 16), fill: 'none' })
    items.push(...words([cx, tick - under - (lines.length - 1) * gap / 2], lines, opts.tones?.[k], gap))
  })
  return fig(items, spoken, opts.caption, -24)
}

/* ---------- Data as tiles ---------- */

/**
 * A list of values as tiles in rows (P8): `tones` colour single tiles, by place in the list ('faint' greys out a
 * value crossed off while finding the median, 'lit' marks the middle).
 */
export function tilesFig(values: string[], spoken: string, opts: { tones?: Partial<Record<number, FigureTone>>; perRow?: number; caption?: string } = {}): AngleFrame {
  const per = opts.perRow ?? (values.length > 9 ? Math.ceil(values.length / 2) : values.length)
  const w = Math.max(0.9, ...values.map(v => v.length * 0.26 + 0.4)), rows = Math.ceil(values.length / per), items: FigureItem[] = []
  values.forEach((v, k) => {
    const c = k % per, r = Math.floor(k / per), x = c * (w + 0.12), y = (rows - 1 - r) * 1.0
    items.push({ kind: 'shape', points: box(x, y, x + w, y + 0.78), fill: opts.tones?.[k] === 'faint' ? 'none' : undefined })
    items.push({ kind: 'text', at: [x + w / 2, y + 0.39], text: v, ...(opts.tones?.[k] ? { tone: opts.tones[k] } : {}) })
  })
  return fig(items, spoken, opts.caption)
}

/* ---------- Answers ---------- */

/** A probability as a fraction, in two boxes: any equal fraction is accepted (12/52 for 3/13) unless `simplest`. */
export const fraction = (answer: string, simplest = false): InteractionDefinition => ({
  type: 'fractionInput', correctAnswer: answer, displayAnswer: answer, acceptanceRule: 'rational', responseShape: 'fraction', ...(simplest ? { requireSimplest: true } : {}),
})
