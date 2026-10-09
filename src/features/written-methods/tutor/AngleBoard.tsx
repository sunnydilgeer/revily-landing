'use client'

import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { angle, letterPath, parallelGeometry, placeSize, tick, turnBetween, type P } from './AnglePictures'

/** The numbers of sides the − and + buttons step through. Inside and outside angles skip 7, whose regular angles
 *  aren't whole degrees (128.57…° and 51.43…°). */
const sideCounts = (mode: AngleBoardSpec['mode']) => mode === 'polygon' ? [3, 4, 5, 6, 7, 8, 9, 10] : mode === 'exterior' ? [3, 4, 5, 6, 8] : [3, 4, 5, 6, 8, 9, 10]
import './AngleBoard.css'

/*
 * The angle board (geometry lesson 1, Angle facts): a play screen for each fact, Brilliant-style (Sunny, 9 Oct:
 * interactive, factual, step by step). The student drags a line or a corner with a finger, the mouse or the arrow keys,
 * and every angle's size updates as it moves, in whole degrees. Under the picture the angles are added up, each in its
 * own colour, and the total never changes: that is the fact.
 *
 * Modes:
 * - line: a line from a point on a straight line. Drag its end: the two angles trade, and still make 180°.
 * - point: lines round a point. Drag any of them: the angles change, and still make 360°.
 * - triangle: drag the top corner anywhere: the three angles change, and still make 180°.
 * - isosceles: the two sides from the top are equal. Drag the top corner up or down: the two base angles stay equal.
 * - quad: drag one corner of a quadrilateral: the four angles change, and still make 360°.
 *
 * Angles in parallel lines (geometry lesson 2) add two more, where what stays is a match, not a total:
 * - cross: two straight lines crossing. Drag one: the opposite angles stay equal.
 * - parallel: a line across two parallel lines, with one pair of angles lit in its letter (`pair`): F (corresponding)
 *   and Z (alternate) stay equal, and C (allied) always adds to 180°.
 *
 * 2D shapes and interior and exterior angles (geometry lessons 3 and 4) add shapes with any number of sides, from 3 to
 * 10, changed with the − and + buttons; the bottom left corner can be dragged off its regular place:
 * - polygon: the shape's name stays while it is dragged out of shape; only the number of sides names it. Regular when
 *   every side and angle is the same.
 * - interior: lines from one corner cut it into triangles, and the inside angles add to (n − 2) × 180° however it is
 *   dragged.
 * - exterior: each side carries on past its corner, and the outside angles add to 360° however it is dragged.
 * - kinds: drag the top of a triangle, and its name (scalene, isosceles, equilateral, right-angled) follows its angles.
 * - parallelogram: drag the top left corner: opposite angles stay equal (and next-door angles add to 180°).
 */

export type AngleBoardSpec = {
  mode: 'line' | 'point' | 'triangle' | 'isosceles' | 'quad' | 'cross' | 'parallel' | 'polygon' | 'interior' | 'exterior' | 'kinds' | 'parallelogram'
  /** parallel: the pair of angles to light, by its letter. */
  pair?: 'F' | 'Z' | 'C'
  /** line: the angle on the right. point: where each line points (degrees anticlockwise from the right). triangle: the
   *  two base angles. isosceles: the base angle. quad: the dragged top-left corner, as x and y in the picture.
   *  cross and parallel: the angle the moving line makes, going up from the right. polygon, interior and exterior: the
   *  number of sides. kinds: the two base angles. parallelogram: the bottom left angle. */
  start: number[]
}

const W = 320, H = 220
const COLOURS = ['c0', 'c1', 'c2', 'c3']
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
/** SVG y runs down; angles are worked out with y up. */
const up = (p: P): P => ({ x: p.x, y: -p.y })
const dir = (O: P, deg: number, length: number): P => ({ x: O.x + length * Math.cos(deg * Math.PI / 180), y: O.y - length * Math.sin(deg * Math.PI / 180) })
const heading = (O: P, p: P) => ((Math.atan2(O.y - p.y, p.x - O.x) * 180 / Math.PI) + 360) % 360

/** Where the two base angles a and b, on base A to B, meet. */
function apex(A: P, B: P, a: number, b: number): P {
  const r = Math.PI / 180, base = B.x - A.x
  const t = Math.sin(b * r) / Math.sin((a + b) * r) * base
  return { x: A.x + t * Math.cos(a * r), y: A.y - t * Math.sin(a * r) }
}

type Shape = { lines: string[]; angles: { V: P; from: P; to: P; size: number }[]; handles: P[]; total: number; ticks?: string[]; lit?: string; corners?: P[] }

/* ---------- Shapes with n sides ---------- */

export const POLYGON_NAMES: Record<number, string> = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon' }
const MANY = new Set(['polygon', 'interior', 'exterior'])
/** The corners of a regular shape with n sides, anticlockwise from the bottom left, sitting on a flat base. */
function regular(n: number, room: number): P[] {
  const at = Array.from({ length: n }, (_, k) => rad(-90 - 180 / n + k * 360 / n))
  const xs = at.map(Math.cos), ys = at.map(Math.sin)
  const R = Math.min((H - 40) * room / (Math.max(...ys) - Math.min(...ys)), (W - 60) * room / (Math.max(...xs) - Math.min(...xs)))
  const cy = H / 2 + R * (Math.max(...ys) + Math.min(...ys)) / 2
  return at.map(a => ({ x: W / 2 + R * Math.cos(a), y: cy - R * Math.sin(a) }))
}
const rad = (d: number) => d * Math.PI / 180
const away = (from: P, to: P, length: number): P => { const d = Math.hypot(to.x - from.x, to.y - from.y) || 1; return { x: to.x + (to.x - from.x) / d * length, y: to.y + (to.y - from.y) / d * length } }
/** Whole degrees that still add to the total: round each, then give the leftover to the ones rounded down most. */
function wholeDegrees(raw: number[], total: number) {
  const out = raw.map(Math.floor)
  let left = Math.round(total - out.reduce((a, b) => a + b, 0))
  raw.map((r, i) => ({ i, part: r - Math.floor(r) })).sort((a, b) => b.part - a.part).forEach(({ i }) => { if (left > 0) { out[i]++; left-- } })
  return out
}
function crosses(a: P, b: P, c: P, d: P) {
  const side = (p: P, q: P, r: P) => Math.sign((q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x))
  return side(a, b, c) !== side(a, b, d) && side(c, d, a) !== side(c, d, b)
}
/** The board's shape with n sides, corner 0 moved by (dx, dy). */
function many(mode: AngleBoardSpec['mode'], v: number[]): Shape {
  const [n, dx, dy] = [v[0], v[1] ?? 0, v[2] ?? 0]
  const V = regular(n, mode === 'exterior' ? 0.72 : mode === 'interior' ? 0.9 : 1)
  V[0] = { x: V[0].x + dx, y: V[0].y + dy }
  const inside = V.map((p, i) => turnBetween(up(p), up(V[(i + 1) % n]), up(V[(i + n - 1) % n])))
  const outline = `M${V.map(p => `${p.x} ${p.y}`).join(' L')} Z`
  if (mode === 'exterior') {
    const ends = V.map((p, i) => away(V[(i + n - 1) % n], p, 38))
    const sizes = wholeDegrees(inside.map(a => 180 - a), 360)
    return { lines: [outline, ...V.map((p, i) => `M${p.x} ${p.y} L${ends[i].x} ${ends[i].y}`)], handles: [V[0]], total: 360, corners: V,
      angles: V.map((p, i) => ({ V: p, from: ends[i], to: V[(i + 1) % n], size: sizes[i] })) }
  }
  const total = (n - 2) * 180
  const sizes = wholeDegrees(inside, total)
  const lit = mode === 'interior' ? Array.from({ length: n - 3 }, (_, k) => `M${V[0].x} ${V[0].y} L${V[k + 2].x} ${V[k + 2].y}`).join(' ') : undefined
  return { lines: [outline], handles: [V[0]], total, corners: V, lit,
    angles: mode === 'interior' ? V.map((p, i) => ({ V: p, from: V[(i + 1) % n], to: V[(i + n - 1) % n], size: sizes[i] })) : [] }
}
/** Corner 0 dragged to p, or null when the shape would cross itself (or, inside and outside, cave in). */
function dragCorner(mode: AngleBoardSpec['mode'], v: number[], p: P): number[] | null {
  const n = v[0], home = regular(n, mode === 'exterior' ? 0.72 : mode === 'interior' ? 0.9 : 1)[0]
  let dx = Math.round(clamp(p.x, 12, W - 12) - home.x), dy = Math.round(clamp(p.y, 12, H - 12) - home.y)
  // Close to its regular place, it snaps there.
  if (Math.hypot(dx, dy) < 7) { dx = 0; dy = 0 }
  const next = [n, dx, dy], s = many(mode, next), V = s.corners!
  const inside = V.map((q, i) => turnBetween(up(q), up(V[(i + 1) % n]), up(V[(i + n - 1) % n])))
  if (mode !== 'polygon' && inside.some(a => a < 22 || a > 172)) return null
  if (inside.some(a => a < 12 || a > 348 || Math.abs(a - 180) < 4)) return null
  for (let k = 1; k < n - 1; k++) {
    const a = V[k], b = V[(k + 1) % n]
    if (k !== 1 && crosses(V[0], V[1], a, b)) return null
    if (k + 1 !== n - 1 && crosses(V[n - 1], V[0], a, b)) return null
  }
  return next
}

/** A triangle's name from its angles. */
export function triangleKind(a: number, b: number, c: number) {
  const right = a === 90 || b === 90 || c === 90
  const same = Number(a === b) + Number(b === c) + Number(a === c)
  if (same === 3) return 'Equilateral'
  if (right) return same ? 'Right-angled isosceles' : 'Right-angled'
  return same ? 'Isosceles' : 'Scalene'
}

/** The places (0–7) of each letter's pair: F corresponding, Z alternate, C allied. */
export const PAIRS = { F: [0, 4], Z: [2, 4], C: [3, 4] } as const

function shapeOf(mode: AngleBoardSpec['mode'], v: number[], pair: AngleBoardSpec['pair'] = 'F'): Shape {
  if (MANY.has(mode)) return many(mode, v)
  if (mode === 'parallelogram') {
    const A = { x: 40, y: 178 }, B = { x: 215, y: 178 }, D = dir(A, v[0], 125), C = { x: B.x + D.x - A.x, y: D.y }
    const sizes = [v[0], 180 - v[0], v[0], 180 - v[0]]
    const mid = (p: P, q: P, k: number) => { const m = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 }, d = Math.hypot(q.x - p.x, q.y - p.y), u = { x: (q.x - p.x) / d, y: (q.y - p.y) / d }, o = 14 + k * 8; return `M${m.x + u.x * o - u.x * 7 + u.y * 6} ${m.y + u.y * o - u.y * 7 - u.x * 6} L${m.x + u.x * o} ${m.y + u.y * o} L${m.x + u.x * o - u.x * 7 - u.y * 6} ${m.y + u.y * o - u.y * 7 + u.x * 6}` }
    return { lines: [`M${A.x} ${A.y} L${B.x} ${B.y} L${C.x} ${C.y} L${D.x} ${D.y} Z`], handles: [D], total: 360, ticks: [mid(A, B, 0), mid(D, C, 0), mid(A, D, 0), mid(A, D, 1), mid(B, C, 0), mid(B, C, 1)],
      angles: [{ V: A, from: B, to: D, size: sizes[0] }, { V: B, from: C, to: A, size: sizes[1] }, { V: C, from: D, to: B, size: sizes[2] }, { V: D, from: A, to: C, size: sizes[3] }] }
  }
  if (mode === 'cross') {
    const O = { x: 160, y: 110 }, far = dir(O, v[0], 100), back = dir(O, v[0] + 180, 100)
    const arms = [{ x: 300, y: 110 }, far, { x: 20, y: 110 }, back]
    return { lines: [`M20 110 L300 110`, `M${back.x} ${back.y} L${far.x} ${far.y}`], handles: [far], total: 0,
      angles: arms.map((a, k) => ({ V: O, from: a, to: arms[(k + 1) % 4], size: placeSize(v[0], k) })) }
  }
  if (mode === 'parallel') {
    const g = parallelGeometry(v[0], W, H), d = (list: P[]) => `M${list.map(p => `${p.x} ${p.y}`).join(' L')}`
    const [a, b] = PAIRS[pair]
    return { lines: [...g.lines.map(d), d([g.E[0], g.E[1]]), ...g.chevrons], handles: [g.E[0]], total: 0, lit: letterPath(g, a, b),
      angles: [a, b].map(i => { const arms = g.arms[Math.floor(i / 4)], k = i % 4; return { V: g.P[Math.floor(i / 4)], from: arms[k], to: arms[(k + 1) % 4], size: placeSize(v[0], k) } }) }
  }
  if (mode === 'line') {
    const O = { x: 160, y: 160 }, L = { x: 20, y: 160 }, R = { x: 300, y: 160 }, T = dir(O, v[0], 120)
    return { lines: [`M${L.x} ${L.y} L${R.x} ${R.y}`, `M${O.x} ${O.y} L${T.x} ${T.y}`], angles: [{ V: O, from: R, to: T, size: v[0] }, { V: O, from: T, to: L, size: 180 - v[0] }], handles: [T], total: 180 }
  }
  if (mode === 'point') {
    const O = { x: 160, y: 110 }, ends = v.map(d => dir(O, d, 95))
    return {
      lines: ends.map(T => `M${O.x} ${O.y} L${T.x} ${T.y}`), handles: ends, total: 360,
      angles: v.map((d, i) => ({ V: O, from: ends[i], to: ends[(i + 1) % v.length], size: Math.round(((v[(i + 1) % v.length] - d) + 360) % 360) })),
    }
  }
  if (mode === 'quad') {
    const A = { x: 40, y: 190 }, B = { x: 270, y: 200 }, C = { x: 250, y: 50 }, D = { x: v[0], y: v[1] }
    const raw = [turnBetween(up(A), up(B), up(D)), turnBetween(up(B), up(C), up(A)), turnBetween(up(C), up(D), up(B))].map(Math.round)
    const sizes = [...raw, 360 - raw[0] - raw[1] - raw[2]]
    return { lines: [`M${A.x} ${A.y} L${B.x} ${B.y} L${C.x} ${C.y} L${D.x} ${D.y} Z`], handles: [D], total: 360,
      angles: [{ V: A, from: B, to: D, size: sizes[0] }, { V: B, from: C, to: A, size: sizes[1] }, { V: C, from: D, to: B, size: sizes[2] }, { V: D, from: A, to: C, size: sizes[3] }] }
  }
  const A = { x: 35, y: 195 }, B = { x: 285, y: 195 }
  const [a, b] = mode === 'isosceles' ? [v[0], v[0]] : v
  const C = apex(A, B, a, b)
  // kinds: a tick on each side that matches another (the side opposite each equal angle).
  const c = 180 - a - b, sides: [P, P, number][] = [[B, C, a], [C, A, b], [A, B, c]]
  const kindTicks = sides.filter(([, , x], i) => sides.some(([, , y], j) => i !== j && x === y)).map(([p, q]) => tick(p, q))
  return { lines: [`M${A.x} ${A.y} L${B.x} ${B.y} L${C.x} ${C.y} Z`], handles: [C], total: 180, ticks: mode === 'isosceles' ? [tick(C, A), tick(C, B)] : mode === 'kinds' ? kindTicks : undefined,
    angles: [{ V: A, from: B, to: C, size: a }, { V: B, from: C, to: A, size: b }, { V: C, from: A, to: B, size: 180 - a - b }] }
}

/** The next angles when a handle is dragged to p, or null when the move would break the shape. */
function dragTo(mode: AngleBoardSpec['mode'], v: number[], handle: number, p: P): number[] | null {
  if (MANY.has(mode)) return dragCorner(mode, v, p)
  if (mode === 'parallelogram') return [clamp(Math.round(heading({ x: 40, y: 178 }, p)), 40, 140)]
  if (mode === 'cross') return [clamp(Math.round(heading({ x: 160, y: 110 }, p)), 20, 160)]
  if (mode === 'parallel') return [clamp(Math.round(heading({ x: W / 2, y: H / 2 }, p)), 38, 142)]
  if (mode === 'line') return [clamp(Math.round(heading({ x: 160, y: 160 }, p)), 8, 172) || 8]
  if (mode === 'point') {
    const n = v.length, d = Math.round(heading({ x: 160, y: 110 }, p))
    const prev = v[(handle + n - 1) % n], next = v[(handle + 1) % n]
    const gap = (from: number, to: number) => ((to - from) + 360) % 360
    if (gap(prev, d) < 12 || gap(d, next) < 12 || gap(prev, d) > gap(prev, next)) return null
    return v.map((x, i) => i === handle ? d : x)
  }
  if (mode === 'quad') {
    const D = { x: clamp(Math.round(p.x), 10, 230), y: clamp(Math.round(p.y), 15, 170) }
    const next = [D.x, D.y]
    return shapeOf('quad', next).angles.every(a => a.size >= 15 && a.size <= 165) ? next : null
  }
  const A = { x: 35, y: 195 }, B = { x: 285, y: 195 }
  const C = { x: clamp(p.x, 20, 300), y: clamp(p.y, 12, 175) }
  if (mode === 'isosceles') return [clamp(Math.round(Math.atan2(A.y - C.y, 125) * 180 / Math.PI), 10, 80)]
  const a = Math.round(turnBetween(up(A), up(B), up(C))), b = Math.round(turnBetween(up(B), up(C), up(A)))
  return a >= 10 && b >= 10 && a + b <= 170 ? [a, b] : null
}

/** The arrow keys: a degree at a time (a quadrilateral's corner, a few pixels). */
function nudge(mode: AngleBoardSpec['mode'], v: number[], key: string): number[] | null {
  const step = key === 'ArrowRight' || key === 'ArrowUp' ? 1 : key === 'ArrowLeft' || key === 'ArrowDown' ? -1 : 0
  if (!step) return null
  const vertical = key === 'ArrowUp' || key === 'ArrowDown'
  if (mode === 'line') return [clamp(v[0] - step, 8, 172)]
  if (mode === 'cross') return [clamp(v[0] - step, 20, 160)]
  if (mode === 'parallel') return [clamp(v[0] - step, 38, 142)]
  if (mode === 'parallelogram') return [clamp(v[0] - step, 40, 140)]
  if (MANY.has(mode)) { const home = regular(v[0], mode === 'exterior' ? 0.72 : mode === 'interior' ? 0.9 : 1)[0], dx = v[1] ?? 0, dy = v[2] ?? 0; return dragCorner(mode, v, vertical ? { x: home.x + dx, y: home.y + dy - step * 4 } : { x: home.x + dx + step * 4, y: home.y + dy }) }
  if (mode === 'point') return dragTo(mode, v, 0, dir({ x: 160, y: 110 }, v[0] + step, 95))
  if (mode === 'isosceles') return [clamp(v[0] + step, 10, 80)]
  if (mode === 'quad') return dragTo(mode, v, 0, vertical ? { x: v[0], y: v[1] - step * 4 } : { x: v[0] + step * 4, y: v[1] })
  const next = vertical ? [v[0] + step, v[1] + step] : [v[0] - step, v[1] + step]
  return next[0] >= 10 && next[1] >= 10 && next[0] + next[1] <= 170 ? next : null
}

export function AngleBoard({ spec }: { spec: AngleBoardSpec }) {
  const [values, setValues] = useState(spec.start)
  const [held, setHeld] = useState<number | null>(null)
  const [moved, setMoved] = useState(false)
  const svg = useRef<SVGSVGElement>(null)
  const id = useId()
  const shape = shapeOf(spec.mode, values, spec.pair)

  const toSvg = (event: PointerEvent): P | null => {
    const matrix = svg.current?.getScreenCTM()
    if (!matrix) return null
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse())
    return { x: p.x, y: p.y }
  }
  const move = (handle: number, p: P | null) => {
    if (!p) return
    const next = dragTo(spec.mode, values, handle, p)
    if (next) { setValues(next); setMoved(true) }
  }
  const down = (event: PointerEvent<SVGSVGElement>) => {
    const p = toSvg(event)
    if (!p) return
    const nearest = shape.handles.map((h, i) => ({ i, d: Math.hypot(h.x - p.x, h.y - p.y) })).sort((a, b) => a.d - b.d)[0]
    event.currentTarget.setPointerCapture(event.pointerId)
    setHeld(nearest.i)
    move(nearest.i, p)
  }
  const key = (event: KeyboardEvent) => {
    const next = nudge(spec.mode, values, event.key)
    if (event.key.startsWith('Arrow')) event.preventDefault()
    if (next) { setValues(next); setMoved(true) }
  }

  const sum = shape.angles.reduce((total, a) => total + a.size, 0)
  const pairs = spec.mode === 'cross' || spec.mode === 'parallelogram'
  const match = spec.mode === 'parallel' && spec.pair !== 'C'
  const n = values[0], name = POLYGON_NAMES[n], isRegular = !values[1] && !values[2]
  const kind = spec.mode === 'kinds' ? triangleKind(shape.angles[0].size, shape.angles[1].size, shape.angles[2].size) : ''
  const sameOutside = shape.angles.every(a => a.size === shape.angles[0].size)
  // Opposite angles share a colour: they are the same size. Inside and outside a shape with many sides, one colour.
  const colour = (i: number) => pairs ? COLOURS[i % 2] : MANY.has(spec.mode) ? COLOURS[0] : COLOURS[i]
  const spoken = pairs ? `The opposite angles match: ${shape.angles[0].size}° and ${shape.angles[2].size}°, ${shape.angles[1].size}° and ${shape.angles[3].size}°.`
    : match ? `The two angles in the ${spec.pair} match: ${shape.angles[0].size}° and ${shape.angles[1].size}°.`
    : spec.mode === 'polygon' ? `${n} sides: a${name === 'octagon' ? 'n' : ''} ${name}, ${isRegular ? 'regular' : 'irregular'}.`
    : spec.mode === 'kinds' ? `${shape.angles.map(a => `${a.size}°`).join(', ')}: ${kind}.`
    : `${shape.angles.map(a => `${a.size}°`).join(' plus ')} makes ${sum}°.`
  const what = { line: 'Drag the end of the line, or use the arrow keys.', point: 'Drag any line round the point, or use the arrow keys.', triangle: 'Drag the top corner, or use the arrow keys.', isosceles: 'Drag the top corner up or down, or use the arrow keys.', quad: 'Drag the top left corner, or use the arrow keys.', cross: 'Drag the end of the sloping line, or use the arrow keys.', parallel: 'Drag the top of the line crossing the parallel lines, or use the arrow keys.',
    polygon: 'Drag the bottom left corner, or use the arrow keys. The buttons change the number of sides.', interior: 'Drag the bottom left corner, or use the arrow keys. The buttons change the number of sides.', exterior: 'Drag the bottom left corner, or use the arrow keys. The buttons change the number of sides.', kinds: 'Drag the top corner, or use the arrow keys.', parallelogram: 'Drag the top left corner, or use the arrow keys.' }[spec.mode]
  const counts = sideCounts(spec.mode), at = counts.indexOf(n)
  const sides = (step: number) => { const next = counts[at + step]; if (next) { setValues([next, 0, 0]); setMoved(true) } }
  const bump = moved ? values.join() : 'still'

  return <div className={`angle-board${held !== null ? ' is-held' : ''}`}>
    <svg ref={svg} className="angle-board__surface" viewBox={`0 0 ${W} ${H}`} role="application" tabIndex={0} aria-label={`Angle board. ${what}`} aria-describedby={`${id}-sum`}
      onPointerDown={down} onPointerMove={event => { if (held !== null) move(held, toSvg(event)) }} onPointerUp={() => setHeld(null)} onPointerCancel={() => setHeld(null)} onKeyDown={key}>
      {shape.lit && <path className="ns-angles__lit" d={shape.lit} />}
      {shape.lines.map((d, i) => <path key={i} className="ns-angles__line" d={d} />)}
      {shape.ticks?.map((d, i) => <path key={`t${i}`} className="ns-angles__line" d={d} />)}
      {shape.angles.map((a, i) => {
        const drawn = angle(a.V, a.from, a.to, a.size, MANY.has(spec.mode) && n > 5 ? 0.75 : 1)
        const text = `${a.size}°`
        return <g key={i} className={`angle-board__mark ${colour(i)}`}>
          <path d={drawn.path} />
          <text x={drawn.label.x} y={drawn.label.y}>{text}</text>
        </g>
      })}
      {shape.handles.map((h, i) => <circle key={i} className="angle-board__handle" cx={h.x} cy={h.y} r={held === i ? 13 : 11} />)}
    </svg>
    <p className="angle-board__sum" id={`${id}-sum`} aria-live="polite">
      <span className="sr-only">{spoken}</span>
      {pairs
        ? <span aria-hidden="true">{[[0, 2], [1, 3]].map(([a, b], k) => <span key={k}>{k ? <span className="angle-board__gap" /> : null}<span className={`angle-board__n ${colour(a)}`}>{shape.angles[a].size}°</span> <strong className={`angle-board__same${moved ? ' is-moved' : ''}`} key={bump}>=</strong> <span className={`angle-board__n ${colour(b)}`}>{shape.angles[b].size}°</span></span>)}</span>
        : match
        ? <span aria-hidden="true"><span className={`angle-board__n ${colour(0)}`}>{shape.angles[0].size}°</span> <strong className={`angle-board__same${moved ? ' is-moved' : ''}`} key={bump}>=</strong> <span className={`angle-board__n ${colour(1)}`}>{shape.angles[1].size}°</span></span>
        : spec.mode === 'polygon'
        ? <span aria-hidden="true"><span className="angle-board__n c0">{n}</span> sides: <strong className={`angle-board__total${moved ? ' is-moved' : ''}`} key={`${n}`}>{name}</strong> <span className={`angle-board__tag${isRegular ? ' is-regular' : ''}`}>{isRegular ? 'regular' : 'irregular'}</span></span>
        : spec.mode === 'kinds'
        ? <span aria-hidden="true">{shape.angles.map((a, i) => <span key={i}>{i ? ', ' : ''}<span className={`angle-board__n ${colour(i)}`}>{a.size}°</span></span>)}: <strong className={`angle-board__total${moved ? ' is-moved' : ''}`} key={kind}>{kind}</strong></span>
        : spec.mode === 'exterior' && sameOutside
        ? <span aria-hidden="true">{n} × <span className="angle-board__n c0">{shape.angles[0].size}°</span> = <strong className={`angle-board__total${moved ? ' is-moved' : ''}`} key={bump}>{sum}°</strong></span>
        : <span aria-hidden="true">{shape.angles.map((a, i) => <span key={i}>{i ? ' + ' : ''}<span className={`angle-board__n ${colour(i)}`}>{a.size}°</span></span>)} = <strong className={`angle-board__total${moved ? ' is-moved' : ''}`} key={moved ? sum + values.join() : 'still'}>{sum}°</strong></span>}
    </p>
    {spec.mode === 'interior' && <p className="angle-board__rule" aria-hidden="true">{n} sides, {n - 2} triangles: {n - 2} × 180° = {sum}°</p>}
    {MANY.has(spec.mode) && <div className="angle-board__sides">
      <button type="button" className="angle-board__side" onClick={() => sides(-1)} disabled={at <= 0} aria-label="One side fewer">− side</button>
      <button type="button" className="angle-board__side" onClick={() => sides(1)} disabled={at >= counts.length - 1} aria-label="One side more">+ side</button>
    </div>}
  </div>
}
