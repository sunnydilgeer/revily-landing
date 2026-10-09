import type { ReactNode } from 'react'
import type { AngleFrame } from './methodWorking'

/*
 * Geometric proof (lesson 28, A13.3), like the A13.3 video: a triangle drawn to its own angles, each angle marked with
 * an arc and named inside it, in its colour (EXPLANATIONS.md). A line through the top parallel to the base makes two
 * new angles, copies of the base angles, and the Z of alternate angles is drawn over the lines in purple. A right angle
 * is a small square. Everything is fitted inside the picture with room for its labels, so nothing runs off the edge.
 *
 * Angle facts (geometry lesson 1, GM1) add a straight line with several lines from one point, lines all the way round a
 * point, and a quadrilateral drawn to its four angles. Given angles are plain ink, the unknown biro blue, the part of
 * the picture a step uses purple (`lit`), and the answer green in a green box (`found`).
 */

export type P = { x: number; y: number }
const W = 320, H = 210, PAD = 30
export const rad = (deg: number) => deg * Math.PI / 180
const sub = (a: P, b: P): P => ({ x: a.x - b.x, y: a.y - b.y })
const unit = (v: P): P => { const l = Math.hypot(v.x, v.y) || 1; return { x: v.x / l, y: v.y / l } }
const along = (a: P, b: P, t: number): P => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
const ray = (deg: number, length = 1): P => ({ x: length * Math.cos(rad(deg)), y: length * Math.sin(rad(deg)) })

/** The angle at V from P round to Q, in degrees (0 to 360, anticlockwise with y up). */
export function turnBetween(V: P, P1: P, Q: P) {
  const a = Math.atan2(P1.y - V.y, P1.x - V.x), b = Math.atan2(Q.y - V.y, Q.x - V.x)
  return ((b - a) * 180 / Math.PI + 720) % 360
}

/** Every angle in a straight line or round a point: the ones given, and the last made up to 180 or 360. */
export function sizes(frame: AngleFrame) {
  const whole = frame.shape === 'point' ? 360 : 180
  const given = frame.angles.reduce((sum, a) => sum + a, 0)
  return given < whole - 0.01 ? [...frame.angles, whole - given] : frame.angles
}

/**
 * A quadrilateral with these four angles (anticlockwise from the bottom left, adding to 360): the base from A to B, the
 * sides from A and B at their angles, and C slid along its side until the angle at C is right.
 */
export function quadCorners(angles: number[]) {
  const [a, b, c] = angles
  const A = { x: 0, y: 0 }, B = { x: 1, y: 0 }
  const D = ray(a, 0.75)
  const dirC = ray(180 - b)
  let best = { C: { x: B.x + dirC.x * 0.75, y: B.y + dirC.y * 0.75 }, miss: Infinity }
  for (let t = 0.1; t <= 3; t += 0.002) {
    const C = { x: B.x + dirC.x * t, y: B.y + dirC.y * t }
    const miss = Math.abs(turnBetween(C, D, B) - c)
    if (miss < best.miss) best = { C, miss }
  }
  return { A, B, C: best.C, D }
}

/** The shape's corners in plain coordinates (y up), before fitting. */
function corners(frame: AngleFrame): Record<string, P> {
  if (frame.shape === 'line') {
    let at = 0
    const rays = Object.fromEntries(sizes(frame).slice(0, -1).map((a, i) => { at += a; return [`T${i}`, ray(at, 0.85)] }))
    return { O: { x: 0, y: 0 }, L: { x: -1, y: 0 }, R: { x: 1, y: 0 }, ...rays }
  }
  if (frame.shape === 'point') {
    let at = frame.turn ?? 15
    const rays = Object.fromEntries(sizes(frame).map((a, i) => { const r = ray(at); at += a; return [`T${i}`, r] }))
    return { O: { x: 0, y: 0 }, N: { x: 0, y: 1 }, S: { x: 0, y: -1 }, E: { x: 1, y: 0 }, Wst: { x: -1, y: 0 }, ...rays }
  }
  if (frame.shape === 'quad') return frame.angles.length === 4 ? quadCorners(frame.angles) : { A: { x: 0, y: 0 }, B: { x: 1.15, y: 0 }, C: { x: 0.95, y: 0.72 }, D: { x: 0.12, y: 0.62 } }
  const [a, b] = frame.angles.map(rad)
  const t = Math.sin(b) / Math.sin(a + b)
  const A = { x: 0, y: 0 }, B = { x: 1, y: 0 }, C = { x: t * Math.cos(a), y: t * Math.sin(a) }
  return frame.shape === 'exterior' ? { A, B, C, D: { x: 1.42, y: 0 } } : { A, B, C }
}

/** Fits the corners (and the parallel line, if any) into a picture w by h, keeping their shape. */
export function fitInto(raw: Record<string, P>, w: number, h: number, pad: number, widen = 0) {
  const pts = Object.values(raw)
  const minX = Math.min(...pts.map(p => p.x)) - widen, maxX = Math.max(...pts.map(p => p.x)) + widen
  const minY = Math.min(...pts.map(p => p.y)), maxY = Math.max(...pts.map(p => p.y))
  const scale = Math.min((w - 2 * pad) / (maxX - minX || 1), (h - 2 * pad) / (maxY - minY || 1))
  const offX = (w - (maxX - minX) * scale) / 2, offY = (h - (maxY - minY) * scale) / 2
  const out: Record<string, P> = {}
  for (const [k, p] of Object.entries(raw)) out[k] = { x: offX + (p.x - minX) * scale, y: h - offY - (p.y - minY) * scale }
  return { at: out, left: offX, right: w - offX }
}
const fit = (frame: AngleFrame) => fitInto(corners(frame), W, H, PAD, frame.parallel ? 0.28 : 0)

/** An angle at V between the lines to P and Q: its arc (or a square for 90°), and where its name goes. */
export function angle(V: P, P1: P, Q: P, degrees?: number, size = 1) {
  const u = unit(sub(P1, V)), v = unit(sub(Q, V))
  const between = Math.acos(Math.max(-1, Math.min(1, u.x * v.x + u.y * v.y)))
  // A reflex angle (round a point) goes the long way round, and its name sits on the far side.
  const reflex = degrees !== undefined && degrees > 180
  const r = (between < rad(35) ? 30 : 22) * size
  const mid = reflex ? unit({ x: -(u.x + v.x), y: -(u.y + v.y) }) : unit({ x: u.x + v.x, y: u.y + v.y })
  const square = degrees !== undefined ? Math.abs(degrees - 90) < 0.5 : Math.abs(between - Math.PI / 2) < 0.01
  const sweep = u.x * v.y - u.y * v.x > 0 ? 1 : 0
  const path = square
    ? `M${V.x + u.x * 14} ${V.y + u.y * 14} L${V.x + (u.x + v.x) * 14} ${V.y + (u.y + v.y) * 14} L${V.x + v.x * 14} ${V.y + v.y * 14}`
    : `M${V.x + u.x * r} ${V.y + u.y * r} A${r} ${r} 0 ${reflex ? 1 : 0} ${reflex ? 1 - sweep : sweep} ${V.x + v.x * r} ${V.y + v.y * r}`
  const distance = reflex ? r + 18 : Math.min(64, Math.max(r + 17, 15 / Math.sin(between / 2)))
  return { path, label: { x: V.x + mid.x * distance, y: V.y + mid.y * distance } }
}

function spoken(frame: AngleFrame) {
  const named = (i: number) => frame.labels[i]
  const list = (n: number) => Array.from({ length: n }, (_, i) => named(i)).filter(Boolean).join(', ')
  if (frame.shape === 'line') {
    const n = sizes(frame).length
    return n === 2 ? `A straight line, with a line from it making two angles: ${named(1)} on the left and ${named(0)} on the right.` : `A straight line, with ${n - 1} lines from one point on it making ${n} angles, from the right: ${list(n)}.`
  }
  if (frame.shape === 'point') return `${sizes(frame).length} lines meet at a point, making the angles ${list(sizes(frame).length)} all the way round.`
  if (frame.shape === 'quad') return frame.angles.length === 4 ? `A quadrilateral with angles ${named(0)} at the bottom left, ${named(1)} at the bottom right, ${named(2)} at the top right and ${named(3)} at the top left.` : `A quadrilateral${frame.split ? ', cut into two triangles by a diagonal' : ''}.`
  const parts = [`A triangle with angles ${named(0)} at the bottom left, ${named(1)} at the bottom right and ${named(2)} at the top.`]
  if (frame.equal) parts.push('The two sides from the top are equal, each marked with a tick.')
  if (frame.shape === 'exterior') parts.push(`The base carries on past the right corner, making the outside angle ${named(3)} next to ${named(1)}.`)
  if (frame.parallel) parts.push('A line through the top is parallel to the base.')
  if (frame.copies?.[0]) parts.push(`The new angle on the left at the top is ${frame.copies[0]}, alternate to the bottom left angle.`)
  if (frame.copies?.[1]) parts.push(`The new angle on the right at the top is ${frame.copies[1]}, alternate to the bottom right angle.`)
  return parts.join(' ')
}

export const tick = (p: P, q: P) => { const m = along(p, q, 0.5), n = unit({ x: -(q.y - p.y), y: q.x - p.x }); return `M${m.x - n.x * 7} ${m.y - n.y * 7} L${m.x + n.x * 7} ${m.y + n.y * 7}` }

/* ---------- Parallel lines and crossing lines (geometry lesson 2) ---------- */

/** The size of the angle in place i (0–7 or 0–3): 0 and 2 are the angle t, 1 and 3 its partner on the line, 180 − t. */
export const placeSize = (t: number, i: number) => i % 2 === 0 ? t : 180 - t

/**
 * Two parallel lines across a picture w by h, crossed by a line at t degrees through the middle. Each crossing has its
 * four arms (right, up the crossing line, left, down it), so place i's angle runs from arm i to arm i + 1.
 */
export function parallelGeometry(t: number, w: number, h: number) {
  const mid = { x: w / 2, y: h / 2 }, half = h * 0.205, ext = h * 0.2
  const run = 1 / Math.tan(rad(t))
  const y1 = mid.y - half, y2 = mid.y + half
  const P1 = { x: mid.x + half * run, y: y1 }, P2 = { x: mid.x - half * run, y: y2 }
  const E1 = { x: P1.x + ext * run, y: y1 - ext }, E2 = { x: P2.x - ext * run, y: y2 + ext }
  const armsAt = (P: P) => {
    const u = unit({ x: run, y: -1 })
    return [{ x: P.x + 50, y: P.y }, { x: P.x + u.x * 46, y: P.y + u.y * 46 }, { x: P.x - 50, y: P.y }, { x: P.x - u.x * 46, y: P.y - u.y * 46 }]
  }
  const chevron = (x: number, y: number) => `M${x - 5} ${y - 6} L${x + 3} ${y} L${x - 5} ${y + 6}`
  return {
    P: [P1, P2], E: [E1, E2], arms: [armsAt(P1), armsAt(P2)], lines: [[{ x: 14, y: y1 }, { x: w - 14, y: y1 }], [{ x: 14, y: y2 }, { x: w - 14, y: y2 }]],
    chevrons: [chevron(P1.x > mid.x ? 48 : w - 48, y1), chevron(P2.x > mid.x ? 48 : w - 48, y2)],
  }
}

/** The letter two angles make, drawn over the lines: F (corresponding), Z (alternate), C (allied), or an X (opposite). */
export function letterPath(g: ReturnType<typeof parallelGeometry>, a: number, b: number) {
  const [i, j] = a < b ? [a, b] : [b, a]
  const lineArm = (k: number) => g.arms[Math.floor(k / 4)][k % 4 === 0 || k % 4 === 3 ? 0 : 2]
  const at = (k: number) => g.P[Math.floor(k / 4)]
  const pts = (list: P[]) => `M${list.map(p => `${p.x} ${p.y}`).join(' L')}`
  if (Math.floor(i / 4) === Math.floor(j / 4)) {
    // At one crossing: both lines through it, a short way each side.
    const c = Math.floor(i / 4), arms = g.arms[c]
    return `${pts([arms[0], arms[2]])} ${pts([arms[1], arms[3]])}`
  }
  const path = pts([lineArm(i), at(i), at(j), lineArm(j)])
  // Corresponding angles are both above (or both below) their lines: the F's stem carries on past the pair.
  const above = (k: number) => k % 4 < 2
  if (above(i) === above(j)) return above(i) ? `${path} ${pts([g.P[0], g.E[0]])}` : `${path} ${pts([g.P[1], g.E[1]])}`
  return path
}

function parallelSpoken(frame: AngleFrame) {
  const where = ['above the line, right', 'above the line, left', 'below the line, left', 'below the line, right']
  const named = frame.labels.flatMap((l, i) => l ? [`${l} ${frame.shape === 'cross' ? where[i].replace('the line, ', '') : `at the ${i < 4 ? 'top' : 'bottom'} crossing, ${where[i % 4]}`}`] : [])
  return frame.shape === 'cross' ? `Two straight lines cross, making four angles: ${named.join('; ')}.` : `Two parallel lines, marked with arrows, crossed by a third line. ${named.join('; ')}.`
}

function ParallelVisual({ frame, plain }: { frame: AngleFrame; plain?: boolean }) {
  const t = frame.angles[0]
  const fam = (i: number) => { const f = frame.families?.[i]; return plain || f === -1 ? 'is-plain' : `is-f${(f ?? 0) % 4}` }
  const marks: { path: string; label: P; text: string; cls: string; boxed: boolean; found: boolean }[] = []
  const lines: string[] = [], lit: string[] = []
  const d = (list: P[]) => `M${list.map(p => `${p.x} ${p.y}`).join(' L')}`
  const corners: { V: P; arms: P[] }[] = []
  if (frame.shape === 'cross') {
    const O = { x: W / 2, y: H / 2 }, u = unit({ x: Math.cos(rad(t)), y: -Math.sin(rad(t)) }), L = 96
    const arms = [{ x: O.x + 120, y: O.y }, { x: O.x + u.x * L, y: O.y + u.y * L }, { x: O.x - 120, y: O.y }, { x: O.x - u.x * L, y: O.y - u.y * L }]
    lines.push(d([arms[0], arms[2]]), d([arms[1], arms[3]]))
    corners.push({ V: O, arms })
    if (frame.lit === 'cross') lit.push(...lines)
  } else {
    const g = parallelGeometry(t, W, H)
    lines.push(...g.lines.map(d), d([g.E[0], g.E[1]]), ...g.chevrons)
    corners.push({ V: g.P[0], arms: g.arms[0] }, { V: g.P[1], arms: g.arms[1] })
    if (frame.pair) lit.push(letterPath(g, frame.pair[0], frame.pair[1]))
  }
  frame.labels.forEach((text, i) => {
    if (!text) return
    const { V, arms } = corners[Math.floor(i / 4)], k = i % 4
    const a = angle(V, arms[k], arms[(k + 1) % 4], placeSize(t, k), 0.9)
    marks.push({ ...a, text, cls: fam(i), boxed: !plain && Boolean(frame.boxed?.includes(i)), found: !plain && Boolean(frame.found?.includes(i)) })
  })
  return <div className={`ns-angles${plain ? ' is-plain' : ''}`} role="img" aria-label={parallelSpoken(frame)}>
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      {!plain && lit.map((p, i) => <path key={`lit${i}`} className="ns-angles__lit" d={p} />)}
      {lines.map((p, i) => <path key={i} className="ns-angles__line" d={p} />)}
      {marks.map((m, i) => <g key={i} className={`ns-angles__mark ${m.found ? 'is-f2' : m.cls}`}>
        <path d={m.path} />
        {(m.boxed || m.found) && <rect className={m.found ? 'ns-angles__found' : 'ns-angles__box'} x={m.label.x - m.text.length * 5 - 8} y={m.label.y - 15} width={m.text.length * 10 + 16} height="30" rx="7" />}
        <text x={m.label.x} y={m.label.y}>{m.text}</text>
      </g>)}
    </svg>
  </div>
}

export function AngleVisual({ frame, plain }: { frame: AngleFrame; plain?: boolean }) {
  if (frame.shape === 'parallel' || frame.shape === 'cross') return <ParallelVisual frame={frame} plain={plain} />
  const { at, left, right } = fit(frame)
  const fam = (i: number) => {
    const f = frame.families?.[i]
    return plain || f === -1 ? 'is-plain' : `is-f${(f ?? [1, 0, 2, 3][i] ?? 0) % 4}`
  }
  const marks: { path: string; label: P; text: string; cls: string; boxed: boolean; found: boolean }[] = []
  const mark = (i: number, V: P, P1: P, Q: P, degrees?: number) => {
    if (!frame.labels[i]) return
    const a = angle(V, P1, Q, degrees)
    marks.push({ ...a, text: frame.labels[i], cls: fam(i), boxed: !plain && Boolean(frame.boxed?.includes(i)), found: !plain && Boolean(frame.found?.includes(i)) })
  }
  let lines: string[] = []
  let lit: string[] = []
  let extra: ReactNode = null
  if (frame.shape === 'line') {
    const { O, L, R } = at
    const all = sizes(frame)
    const rays = all.slice(0, -1).map((_, i) => at[`T${i}`])
    lines = [`M${L.x} ${L.y} L${R.x} ${R.y}`, ...rays.map(T => `M${O.x} ${O.y} L${T.x} ${T.y}`)]
    const edges = [R, ...rays, L]
    all.forEach((a, i) => mark(i, O, edges[i], edges[i + 1], a))
    if (frame.lit === 'line') lit = [`M${L.x} ${L.y} L${R.x} ${R.y}`]
  } else if (frame.shape === 'point') {
    const { O } = at
    const all = sizes(frame)
    const rays = all.map((_, i) => at[`T${i}`])
    lines = rays.map(T => `M${O.x} ${O.y} L${T.x} ${T.y}`)
    all.forEach((a, i) => mark(i, O, rays[i], rays[(i + 1) % rays.length], a))
    if (frame.lit === 'turn') { const r = Math.hypot(rays[0].x - O.x, rays[0].y - O.y) * 0.62; lit = [`M${O.x + r} ${O.y} A${r} ${r} 0 1 0 ${O.x - r} ${O.y} A${r} ${r} 0 1 0 ${O.x + r} ${O.y}`] }
  } else if (frame.shape === 'quad') {
    const { A, B, C, D } = at
    lines = [`M${A.x} ${A.y} L${B.x} ${B.y} L${C.x} ${C.y} L${D.x} ${D.y} Z`]
    if (frame.angles.length === 4) {
      const [a, b, c, d] = frame.angles
      mark(0, A, B, D, a)
      mark(1, B, C, A, b)
      mark(2, C, D, B, c)
      mark(3, D, A, C, d)
    }
    if (frame.lit === 'shape') lit = lines
    if (frame.split) extra = <path className={plain ? 'ns-angles__line' : 'ns-angles__zig'} d={`M${A.x} ${A.y} L${C.x} ${C.y}`} />
  } else {
    const { A, B, C } = at
    const [a, b] = frame.angles
    lines = [`M${A.x} ${A.y} L${B.x} ${B.y} L${C.x} ${C.y} Z`]
    mark(0, A, B, C, a)
    mark(1, B, C, A, b)
    mark(2, C, A, B, 180 - a - b)
    if (frame.lit === 'shape') lit = [...lines]
    if (frame.lit === 'sides') lit = [`M${A.x} ${A.y} L${C.x} ${C.y} L${B.x} ${B.y}`]
    if (frame.shape === 'exterior') {
      const { D } = at
      lines.push(`M${B.x} ${B.y} L${D.x} ${D.y}`)
      mark(3, B, D, C, 180 - b)
      if (frame.lit === 'line') lit = [`M${A.x} ${A.y} L${D.x} ${D.y}`]
    }
    if (frame.equal) lines.push(tick(C, A), tick(C, B))
    if (frame.parallel) {
      const PL = { x: left - 6, y: C.y }, PR = { x: right + 6, y: C.y }
      const chevron = (m: P) => `M${m.x - 5} ${m.y - 6} L${m.x + 3} ${m.y} L${m.x - 5} ${m.y + 6}`
      lines.push(`M${PL.x} ${PL.y} L${PR.x} ${PR.y}`, chevron(along(PL, PR, 0.82)), chevron(along(A, B, 0.5)))
      if (frame.copies?.[0]) { const a2 = angle(C, PL, A); marks.push({ ...a2, text: frame.copies[0], cls: fam(0), boxed: false, found: false }) }
      if (frame.copies?.[1]) { const b2 = angle(C, B, PR); marks.push({ ...b2, text: frame.copies[1], cls: fam(1), boxed: false, found: false }) }
      if (frame.zig && !plain) {
        const z = frame.zig === 'left' ? [PL, C, A, along(A, B, 0.6)] : [PR, C, B, along(B, A, 0.6)]
        extra = <path className="ns-angles__zig" d={`M${z.map(p => `${p.x} ${p.y}`).join(' L')}`} />
      }
    }
  }
  return <div className={`ns-angles${plain ? ' is-plain' : ''}`} role="img" aria-label={spoken(frame)}>
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      {!plain && lit.map((d, i) => <path key={`lit${i}`} className="ns-angles__lit" d={d} />)}
      {lines.map((d, i) => <path key={i} className="ns-angles__line" d={d} />)}
      {extra}
      {marks.map((m, i) => <g key={i} className={`ns-angles__mark ${m.found ? 'is-f2' : m.cls}`}>
        <path d={m.path} />
        {(m.boxed || m.found) && <rect className={m.found ? 'ns-angles__found' : 'ns-angles__box'} x={m.label.x - m.text.length * 5 - 8} y={m.label.y - 15} width={m.text.length * 10 + 16} height="30" rx="7" />}
        <text x={m.label.x} y={m.label.y}>{m.text}</text>
      </g>)}
    </svg>
  </div>
}
