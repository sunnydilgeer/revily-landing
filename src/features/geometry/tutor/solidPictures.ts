import type { FigureItem, FigurePoint, FigureTone } from '../../written-methods/tutor/methodWorking'

/*
 * 3D shapes as measured figures (geometry lessons 13 to 16: 3D shapes, volume, surface area, plans and elevations),
 * drawn the way the book draws them: an oblique sketch, the front face square on and the length going back up to the
 * right, with the edges you can't see dashed. Each function returns figure items with the front bottom-left corner at
 * the origin, y up, ready for fig() in figureLesson.ts.
 */

/** Going back one unit of length moves this far across and up the page. */
export const DEPTH: FigurePoint = [0.55, 0.38]
const back = ([x, y]: FigurePoint, l: number): FigurePoint => [x + DEPTH[0] * l, y + DEPTH[1] * l]
const line = (from: FigurePoint, to: FigurePoint, hidden = false, lit = false): FigureItem => ({ kind: 'line', from, to, style: lit ? 'lit' : hidden ? 'dashed' : 'plain' })

export type Measure = { label: string; tone?: FigureTone }
/** Which faces to shade: the front (cross-section) face, or every visible face. */
export type Shade = 'front' | 'none'

/**
 * A prism: its cross-section `face` (anticlockwise from the bottom-left corner, which must be first) carried back
 * `length`. The front face is shaded when it's the cross-section a step uses; edges touching the hidden back corner
 * are dashed.
 */
export function prism(face: FigurePoint[], length: number, opts: { shade?: Shade; lit?: 'face' | 'length'; labels?: { length?: Measure } } = {}): FigureItem[] {
  const backFace = face.map(p => back(p, length))
  const items: FigureItem[] = []
  // The hidden back corner is behind the front bottom-left one.
  backFace.forEach((p, i) => { const q = backFace[(i + 1) % backFace.length]; items.push(line(p, q, i === 0 || (i + 1) % backFace.length === 0)) })
  face.forEach((p, i) => { if (i > 0) items.push(line(p, backFace[i], false, opts.lit === 'length' && i === 1)) })
  items.push(line(face[0], backFace[0], true))
  items.push({ kind: 'shape', points: face, fill: opts.shade === 'none' ? 'none' : 'part', lit: opts.lit === 'face' })
  if (opts.labels?.length) items.push({ kind: 'measure', from: face[1], to: backFace[1], label: opts.labels.length.label, tone: opts.labels.length.tone, offset: 10 })
  return items
}

/** A cuboid w wide, h tall and l long, its width, height and length measured. */
export function cuboid(w: number, h: number, l: number, labels: { w?: Measure; h?: Measure; l?: Measure } = {}, opts: { shade?: Shade; lit?: 'face' | 'length' } = {}): FigureItem[] {
  const items = prism([[0, 0], [w, 0], [w, h], [0, h]], l, { ...opts, labels: labels.l ? { length: labels.l } : {} })
  if (labels.w) items.push({ kind: 'measure', from: [0, 0], to: [w, 0], label: labels.w.label, tone: labels.w.tone, offset: 10 })
  if (labels.h) items.push({ kind: 'measure', from: [0, 0], to: [0, h], label: labels.h.label, tone: labels.h.tone, offset: -10, side: -1 })
  return items
}

/** Points round an ellipse, from one angle to another (degrees, anticlockwise from the right). */
export const ellipse = ([cx, cy]: FigurePoint, rx: number, ry: number, from = 0, to = 360, steps = 32): FigurePoint[] =>
  Array.from({ length: steps + 1 }, (_, k) => { const a = (from + (to - from) * k / steps) * Math.PI / 180; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] })
const RY = 0.32

/** A circle seen from the side, as on the base of a cylinder or cone: its back half dashed when `hiddenBack`. */
function rim(c: FigurePoint, r: number, hiddenBack: boolean, fill = false): FigureItem[] {
  if (!hiddenBack) return [{ kind: 'shape', points: ellipse(c, r, r * RY), fill: fill ? 'part' : 'none' }]
  return [{ kind: 'shape', points: ellipse(c, r, r * RY, 180, 360), open: true }, { kind: 'shape', points: ellipse(c, r, r * RY, 0, 180), open: true, dashed: true }]
}

/** A cylinder standing up: radius r, height h, with its radius and height measured. */
export function cylinder(r: number, h: number, labels: { r?: Measure; h?: Measure } = {}, lit?: 'top' | 'side'): FigureItem[] {
  const items: FigureItem[] = [
    ...rim([0, 0], r, true),
    { kind: 'line', from: [-r, 0], to: [-r, h], style: lit === 'side' ? 'lit' : 'plain' },
    { kind: 'line', from: [r, 0], to: [r, h], style: lit === 'side' ? 'lit' : 'plain' },
    { kind: 'shape', points: ellipse([0, h], r, r * RY), fill: 'part', lit: lit === 'top' },
  ]
  if (labels.r) items.push({ kind: 'line', from: [0, h], to: [r, h], style: 'plain' }, { kind: 'point', at: [0, h] }, { kind: 'text', at: [r / 2, h], text: labels.r.label, tone: labels.r.tone, dy: -16 })
  if (labels.h) items.push({ kind: 'measure', from: [r, 0], to: [r, h], label: labels.h.label, tone: labels.h.tone, offset: 12 })
  return items
}

/** A cone: base radius r, vertical height h, or its slant height measured when `slant` is given. */
export function cone(r: number, h: number, labels: { r?: Measure; h?: Measure; slant?: Measure } = {}, lit?: 'base' | 'slant'): FigureItem[] {
  const items: FigureItem[] = [
    ...rim([0, 0], r, true),
    { kind: 'line', from: [-r, 0], to: [0, h], style: lit === 'slant' ? 'lit' : 'plain' },
    { kind: 'line', from: [r, 0], to: [0, h], style: lit === 'slant' ? 'lit' : 'plain' },
  ]
  if (lit === 'base') items.push({ kind: 'shape', points: ellipse([0, 0], r, r * RY), fill: 'part', lit: true })
  if (labels.r) items.push({ kind: 'line', from: [0, 0], to: [r, 0], style: 'plain' }, { kind: 'point', at: [0, 0] }, { kind: 'text', at: [r / 2, 0], text: labels.r.label, tone: labels.r.tone, dy: 15 })
  if (labels.h) items.push({ kind: 'line', from: [0, 0], to: [0, h], style: 'dashed' }, { kind: 'right', at: [0, 0], a: [0, h], b: [r, 0] }, { kind: 'text', at: [0, h * 0.45], text: labels.h.label, tone: labels.h.tone, dx: -24 })
  if (labels.slant) items.push({ kind: 'measure', from: [r, 0], to: [0, h], label: labels.slant.label, tone: labels.slant.tone, offset: 10 })
  return items
}

/** A sphere: its outline, the equator (back half dashed), and its radius from the centre. */
export function sphere(r: number, label?: Measure, lit = false): FigureItem[] {
  const items: FigureItem[] = [
    { kind: 'circle', centre: [0, 0], r, ...(lit ? {} : { fill: 'none' as const }) },
    { kind: 'shape', points: ellipse([0, 0], r, r * RY, 180, 360), open: true },
    { kind: 'shape', points: ellipse([0, 0], r, r * RY, 0, 180), open: true, dashed: true },
  ]
  if (label) items.push({ kind: 'line', from: [0, 0], to: [r, 0], style: 'plain' }, { kind: 'point', at: [0, 0] }, { kind: 'text', at: [r / 2, 0], text: label.label, tone: label.tone, dy: -15 })
  return items
}

/** A square-based pyramid: base b by b, apex h above the middle of the base, its base side and height measured. */
export function squarePyramid(b: number, h: number, labels: { b?: Measure; h?: Measure; slant?: Measure } = {}, lit?: 'base' | 'face'): FigureItem[] {
  const f0: FigurePoint = [0, 0], f1: FigurePoint = [b, 0], b1 = back(f1, b), b0 = back(f0, b)
  const mid: FigurePoint = [(f0[0] + b1[0]) / 2, (f0[1] + b1[1]) / 2], apex: FigurePoint = [mid[0], mid[1] + h]
  const items: FigureItem[] = [
    line(f0, f1), line(f1, b1), line(b1, b0, true), line(b0, f0, true),
    line(f0, apex), line(f1, apex), line(b1, apex), line(b0, apex, true),
  ]
  if (lit === 'base') items.push({ kind: 'shape', points: [f0, f1, b1, b0], fill: 'part', lit: true })
  if (lit === 'face') items.push({ kind: 'shape', points: [f0, f1, apex], fill: 'part', lit: true })
  if (labels.b) items.push({ kind: 'measure', from: f0, to: f1, label: labels.b.label, tone: labels.b.tone, offset: 10 })
  if (labels.h) items.push({ kind: 'line', from: mid, to: apex, style: 'dashed' }, { kind: 'point', at: mid }, { kind: 'text', at: [mid[0], mid[1] + h * 0.5], text: labels.h.label, tone: labels.h.tone, dx: 22 })
  if (labels.slant) {
    // The slant height of the front face: from the middle of the front edge up to the apex.
    const m: FigurePoint = [b / 2, 0]
    items.push({ kind: 'line', from: m, to: apex, style: 'dashed' }, { kind: 'text', at: [(m[0] + apex[0]) / 2, (m[1] + apex[1]) / 2], text: labels.slant.label, tone: labels.slant.tone, dx: -22 })
  }
  return items
}

/** A hemisphere sitting on top of a cylinder (GM14 Your Turn Q5), radius r, cylinder height h. */
export function capsule(r: number, h: number, labels: { r?: Measure; h?: Measure } = {}): FigureItem[] {
  const items = cylinder(r, h, labels).filter(item => !(item.kind === 'shape' && item.fill === 'part'))
  items.push({ kind: 'shape', points: ellipse([0, h], r, r * RY, 180, 360), open: true }, { kind: 'shape', points: ellipse([0, h], r, r * RY, 0, 180), open: true, dashed: true })
  items.push({ kind: 'arc', centre: [0, h], r, from: 0, to: 180 })
  return items
}

/** A tetrahedron: a triangular base (its back corner hidden behind) and an apex above. */
export function tetrahedron(s: number, lit?: 'edges' | 'vertices'): FigureItem[] {
  // The back corner sits behind the front face, so its three edges are dashed.
  const a: FigurePoint = [0, 0], b: FigurePoint = [s, 0], c = back([s * 0.5, 0], s * 0.6), top: FigurePoint = [s * 0.5, s * 0.95]
  const items: FigureItem[] = [line(a, b, false, lit === 'edges'), line(b, c, true), line(c, a, true), line(a, top, false, lit === 'edges'), line(b, top, false, lit === 'edges'), line(c, top, true)]
  if (lit === 'vertices') items.push(...[a, b, c, top].map(at => ({ kind: 'point' as const, at })))
  return items
}

/** A square frustum: a square base b across, cut off flat at height h with a smaller square top t across. */
export function frustum(b: number, t: number, h: number): FigureItem[] {
  const f0: FigurePoint = [0, 0], f1: FigurePoint = [b, 0], b1 = back(f1, b), b0 = back(f0, b)
  const inset = (b - t) / 2, g0: FigurePoint = back([inset, h], inset), g1: FigurePoint = [g0[0] + t, g0[1]], h1 = back(g1, t), h0 = back(g0, t)
  return [
    line(f0, f1), line(f1, b1), line(b1, b0, true), line(b0, f0, true),
    { kind: 'shape', points: [g0, g1, h1, h0], fill: 'none' },
    line(f0, g0), line(f1, g1), line(b1, h1), line(b0, h0, true),
  ]
}
