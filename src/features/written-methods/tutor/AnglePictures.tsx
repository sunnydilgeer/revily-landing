import type { ReactNode } from 'react'
import type { AngleFrame } from './methodWorking'

/*
 * Geometric proof (lesson 28, A13.3), like the A13.3 video: a triangle drawn to its own angles, each angle marked with
 * an arc and named inside it, in its colour (EXPLANATIONS.md). A line through the top parallel to the base makes two
 * new angles, copies of the base angles, and the Z of alternate angles is drawn over the lines in purple. A right angle
 * is a small square. Everything is fitted inside the picture with room for its labels, so nothing runs off the edge.
 */

type P = { x: number; y: number }
const W = 320, H = 210, PAD = 30
const rad = (deg: number) => deg * Math.PI / 180
const sub = (a: P, b: P): P => ({ x: a.x - b.x, y: a.y - b.y })
const unit = (v: P): P => { const l = Math.hypot(v.x, v.y) || 1; return { x: v.x / l, y: v.y / l } }
const along = (a: P, b: P, t: number): P => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })

/** The shape's corners in plain coordinates (y up), before fitting. */
function corners(frame: AngleFrame) {
  if (frame.shape === 'line') {
    const t = rad(frame.angles[0])
    return { O: { x: 0, y: 0 }, L: { x: -1, y: 0 }, R: { x: 1, y: 0 }, T: { x: 0.85 * Math.cos(t), y: 0.85 * Math.sin(t) } }
  }
  if (frame.shape === 'quad') return { A: { x: 0, y: 0 }, B: { x: 1.15, y: 0 }, C: { x: 0.95, y: 0.72 }, D: { x: 0.12, y: 0.62 } }
  const [a, b] = frame.angles.map(rad)
  const t = Math.sin(b) / Math.sin(a + b)
  const A = { x: 0, y: 0 }, B = { x: 1, y: 0 }, C = { x: t * Math.cos(a), y: t * Math.sin(a) }
  return frame.shape === 'exterior' ? { A, B, C, D: { x: 1.42, y: 0 } } : { A, B, C }
}

/** Fits the corners (and the parallel line, if any) into the picture, keeping their shape. */
function fit(frame: AngleFrame) {
  const raw: Record<string, P> = corners(frame)
  const pts = Object.values(raw)
  const minX = Math.min(...pts.map(p => p.x)) - (frame.parallel ? 0.28 : 0), maxX = Math.max(...pts.map(p => p.x)) + (frame.parallel ? 0.28 : 0)
  const minY = Math.min(...pts.map(p => p.y)), maxY = Math.max(...pts.map(p => p.y))
  const scale = Math.min((W - 2 * PAD) / (maxX - minX || 1), (H - 2 * PAD) / (maxY - minY || 1))
  const offX = (W - (maxX - minX) * scale) / 2, offY = (H - (maxY - minY) * scale) / 2
  const out: Record<string, P> = {}
  for (const [k, p] of Object.entries(raw)) out[k] = { x: offX + (p.x - minX) * scale, y: H - offY - (p.y - minY) * scale }
  return { at: out, left: offX, right: W - offX }
}

/** An angle at V between the lines to P and Q: its arc (or a square for 90°), and where its name goes. */
function angle(V: P, P1: P, Q: P, degrees?: number) {
  const u = unit(sub(P1, V)), v = unit(sub(Q, V))
  const between = Math.acos(Math.max(-1, Math.min(1, u.x * v.x + u.y * v.y)))
  const r = between < rad(35) ? 30 : 22
  const mid = unit({ x: u.x + v.x, y: u.y + v.y })
  const square = degrees !== undefined ? Math.abs(degrees - 90) < 0.5 : Math.abs(between - Math.PI / 2) < 0.01
  const path = square
    ? `M${V.x + u.x * 14} ${V.y + u.y * 14} L${V.x + (u.x + v.x) * 14} ${V.y + (u.y + v.y) * 14} L${V.x + v.x * 14} ${V.y + v.y * 14}`
    : `M${V.x + u.x * r} ${V.y + u.y * r} A${r} ${r} 0 0 ${u.x * v.y - u.y * v.x > 0 ? 1 : 0} ${V.x + v.x * r} ${V.y + v.y * r}`
  const distance = Math.min(64, Math.max(r + 17, 15 / Math.sin(between / 2)))
  return { path, label: { x: V.x + mid.x * distance, y: V.y + mid.y * distance } }
}

function spoken(frame: AngleFrame) {
  const named = (i: number) => frame.labels[i]
  if (frame.shape === 'line') return `A straight line, with a line from it making two angles: ${named(1)} on the left and ${named(0)} on the right.`
  if (frame.shape === 'quad') return `A quadrilateral${frame.split ? ', cut into two triangles by a diagonal' : ''}.`
  const parts = [`A triangle with angles ${named(0)} at the bottom left, ${named(1)} at the bottom right and ${named(2)} at the top.`]
  if (frame.equal) parts.push('The two sides from the top are equal.')
  if (frame.shape === 'exterior') parts.push(`The base carries on past the right corner, making the outside angle ${named(3)} next to ${named(1)}.`)
  if (frame.parallel) parts.push('A line through the top is parallel to the base.')
  if (frame.copies?.[0]) parts.push(`The new angle on the left at the top is ${frame.copies[0]}, alternate to the bottom left angle.`)
  if (frame.copies?.[1]) parts.push(`The new angle on the right at the top is ${frame.copies[1]}, alternate to the bottom right angle.`)
  return parts.join(' ')
}

export function AngleVisual({ frame, plain }: { frame: AngleFrame; plain?: boolean }) {
  const { at, left, right } = fit(frame)
  const fam = (i: number) => plain ? 'is-plain' : `is-f${(frame.families?.[i] ?? [1, 0, 2, 3][i] ?? 0) % 4}`
  const marks: { path: string; label: P; text: string; cls: string; boxed: boolean }[] = []
  const mark = (i: number, V: P, P1: P, Q: P, degrees?: number) => {
    if (!frame.labels[i]) return
    const a = angle(V, P1, Q, degrees)
    marks.push({ ...a, text: frame.labels[i], cls: fam(i), boxed: !plain && Boolean(frame.boxed?.includes(i)) })
  }
  let lines: string[] = []
  let extra: ReactNode = null
  if (frame.shape === 'line') {
    const { O, L, R, T } = at
    lines = [`M${L.x} ${L.y} L${R.x} ${R.y}`, `M${O.x} ${O.y} L${T.x} ${T.y}`]
    mark(0, O, R, T, frame.angles[0])
    mark(1, O, T, L, 180 - frame.angles[0])
  } else if (frame.shape === 'quad') {
    const { A, B, C, D } = at
    lines = [`M${A.x} ${A.y} L${B.x} ${B.y} L${C.x} ${C.y} L${D.x} ${D.y} Z`]
    if (frame.split) extra = <path className={plain ? 'ns-angles__line' : 'ns-angles__zig'} d={`M${A.x} ${A.y} L${C.x} ${C.y}`} />
  } else {
    const { A, B, C } = at
    const [a, b] = frame.angles
    lines = [`M${A.x} ${A.y} L${B.x} ${B.y} L${C.x} ${C.y} Z`]
    mark(0, A, B, C, a)
    mark(1, B, C, A, b)
    mark(2, C, A, B, 180 - a - b)
    if (frame.shape === 'exterior') {
      const { D } = at
      lines.push(`M${B.x} ${B.y} L${D.x} ${D.y}`)
      mark(3, B, D, C, 180 - b)
    }
    if (frame.equal) {
      const tick = (p: P, q: P) => { const m = along(p, q, 0.5), n = unit({ x: -(q.y - p.y), y: q.x - p.x }); return `M${m.x - n.x * 7} ${m.y - n.y * 7} L${m.x + n.x * 7} ${m.y + n.y * 7}` }
      lines.push(tick(C, A), tick(C, B))
    }
    if (frame.parallel) {
      const PL = { x: left - 6, y: C.y }, PR = { x: right + 6, y: C.y }
      const chevron = (m: P) => `M${m.x - 5} ${m.y - 6} L${m.x + 3} ${m.y} L${m.x - 5} ${m.y + 6}`
      lines.push(`M${PL.x} ${PL.y} L${PR.x} ${PR.y}`, chevron(along(PL, PR, 0.82)), chevron(along(A, B, 0.5)))
      if (frame.copies?.[0]) { const a2 = angle(C, PL, A); marks.push({ ...a2, text: frame.copies[0], cls: fam(0), boxed: false }) }
      if (frame.copies?.[1]) { const b2 = angle(C, B, PR); marks.push({ ...b2, text: frame.copies[1], cls: fam(1), boxed: false }) }
      if (frame.zig && !plain) {
        const z = frame.zig === 'left' ? [PL, C, A, along(A, B, 0.6)] : [PR, C, B, along(B, A, 0.6)]
        extra = <path className="ns-angles__zig" d={`M${z.map(p => `${p.x} ${p.y}`).join(' L')}`} />
      }
    }
  }
  return <div className={`ns-angles${plain ? ' is-plain' : ''}`} role="img" aria-label={spoken(frame)}>
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      {lines.map((d, i) => <path key={i} className="ns-angles__line" d={d} />)}
      {extra}
      {marks.map((m, i) => <g key={i} className={`ns-angles__mark ${m.cls}`}>
        <path d={m.path} />
        {m.boxed && <rect className="ns-angles__box" x={m.label.x - m.text.length * 5 - 8} y={m.label.y - 15} width={m.text.length * 10 + 16} height="30" rx="7" />}
        <text x={m.label.x} y={m.label.y}>{m.text}</text>
      </g>)}
    </svg>
  </div>
}
