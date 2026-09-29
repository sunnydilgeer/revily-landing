import { useId, type ReactNode } from 'react'
import { physicsPalette, PhysicsDiagram, Lines, Leader, EnergyStoreBadge, type Pt } from './PhysicsKit'

/*
 * Physics Lesson 27: The particle model and gas pressure. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'gaspart-' and is routed from CellBiologyVisuals.tsx.
 *
 * This file also exports the particle kit the other particle-model lessons (density, internal energy, latent heat)
 * draw with, so all four lessons show the same particles, boxes, thermometers and flames:
 *   one particle colour (the particles are the same in every state), soft slate-blue with a darker line;
 *   motion arrows in the kinetic-store orange; the container a pale rounded box; hot red, cold blue.
 * Solid = fixed regular grid, liquid = touching but irregular (particles "dropped" into the box), gas = few, far apart.
 */
const P = physicsPalette
const { ink, muted } = P
export const particleFill = '#d3e3f3', particleLine = '#4f7aa3'
export const boxFill = '#f7fafc', boxLine = '#8aa0b1'
export const faded = 0.28
const motion = P.kineticLine

export const r1 = (n: number) => Math.round(n * 10) / 10

// Deterministic pseudo-random numbers: the same drawing on server and client.
export function seeded(seed: number) {
  let s = (Math.abs(Math.floor(seed)) * 9973 + 7) % 2147483647 || 1
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}
function smoothClosed(points: Pt[]) {
  const n = points.length
  let d = `M${r1(points[0][0])} ${r1(points[0][1])}`
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n], p1 = points[i], p2 = points[(i + 1) % n], p3 = points[(i + 2) % n]
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])} ${r1(p2[1])}`
  }
  return d + 'Z'
}
/** A softly irregular closed outline (puddles, stones, clouds). */
export function blob(cx: number, cy: number, rx: number, ry: number, seed: number, wobble = 0.1, count = 10) {
  const rand = seeded(seed)
  return smoothClosed(Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2, k = 1 + (rand() - 0.5) * 2 * wobble
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k] as Pt
  }))
}

/* ---------- Arrows ---------- */

/** A straight arrow with a solid head. `both` puts a head on each end (vibration). */
export function Arrow({ from, to, colour = ink, width = 2.4, dashed = false, both = false }: { from: Pt; to: Pt; colour?: string; width?: number; dashed?: boolean; both?: boolean }) {
  const headAt = (tip: Pt, tail: Pt) => {
    const a = Math.atan2(tip[1] - tail[1], tip[0] - tail[0]), h = 5 + width * 1.6
    const p = (d: number, s: number): Pt => [r1(tip[0] - Math.cos(a) * d + Math.cos(a + Math.PI / 2) * s), r1(tip[1] - Math.sin(a) * d + Math.sin(a + Math.PI / 2) * s)]
    return { d: `M${tip[0]} ${tip[1]}L${p(h, h * .6).join(' ')}L${p(h * .72, 0).join(' ')}L${p(h, -h * .6).join(' ')}Z`, base: p(h * .72, 0) }
  }
  const end = headAt(to, from), start = both ? headAt(from, to) : null
  const s0 = start ? start.base : from
  return <g>
    <path d={`M${s0[0]} ${s0[1]}L${end.base[0]} ${end.base[1]}`} stroke={colour} strokeWidth={width} fill="none" strokeDasharray={dashed ? '6 5' : undefined} />
    <path d={end.d} fill={colour} stroke={colour} strokeWidth="1" />
    {start && <path d={start.d} fill={colour} stroke={colour} strokeWidth="1" />}
  </g>
}
/** A curved arrow from `from` to `to` bowing sideways by `bend` (a fraction of its length). */
export function CurveArrow({ from, to, bend = 0.3, colour = ink, width = 2.4, both = false }: { from: Pt; to: Pt; bend?: number; colour?: string; width?: number; both?: boolean }) {
  const dx = to[0] - from[0], dy = to[1] - from[1], len = Math.hypot(dx, dy) || 1
  const c: Pt = [(from[0] + to[0]) / 2 - dy / len * bend * len, (from[1] + to[1]) / 2 + dx / len * bend * len]
  const h = 5 + width * 1.6
  const tipHead = (tip: Pt, ctrl: Pt) => {
    const a = Math.atan2(tip[1] - ctrl[1], tip[0] - ctrl[0])
    const p = (d: number, s: number): Pt => [r1(tip[0] - Math.cos(a) * d + Math.cos(a + Math.PI / 2) * s), r1(tip[1] - Math.sin(a) * d + Math.sin(a + Math.PI / 2) * s)]
    return { d: `M${tip[0]} ${tip[1]}L${p(h, h * .6).join(' ')}L${p(h * .72, 0).join(' ')}L${p(h, -h * .6).join(' ')}Z`, base: p(h * .72, 0) }
  }
  const e = tipHead(to, c), s = both ? tipHead(from, c) : null
  const a = s ? s.base : from
  return <g>
    <path d={`M${a[0]} ${a[1]}Q${r1(c[0])} ${r1(c[1])} ${e.base[0]} ${e.base[1]}`} stroke={colour} strokeWidth={width} fill="none" />
    <path d={e.d} fill={colour} stroke={colour} strokeWidth="1" />
    {s && <path d={s.d} fill={colour} stroke={colour} strokeWidth="1" />}
  </g>
}

/* ---------- Particles and their arrangements ---------- */

export type Box = { x: number; y: number; w: number; h: number }
export type ParticleState = 'solid' | 'liquid' | 'gas'

/** Solid: a fixed, regular grid resting on the floor of the box. */
export function solidPts(box: Box, r: number, cols: number, rows: number): Pt[] {
  const step = 2 * r + 1, left = box.x + (box.w - (cols - 1) * step) / 2, floor = box.y + box.h - r - 5
  return Array.from({ length: cols * rows }, (_, i) => [r1(left + (i % cols) * step), r1(floor - Math.floor(i / cols) * step)] as Pt)
}
/** Liquid: particles "dropped" into the box one by one, each settling where it first touches: close together, no pattern. */
export function liquidPts(box: Box, r: number, n: number, seed: number): Pt[] {
  const rand = seeded(seed), pts: Pt[] = [], floor = box.y + box.h - r - 5, lo = box.x + r + 5, hi = box.x + box.w - r - 5
  const rest = (x: number) => {
    let y = floor
    for (const [px, py] of pts) { const dx = Math.abs(px - x); if (dx < 2 * r + 1.5) y = Math.min(y, py - Math.sqrt((2 * r + 1.5) ** 2 - dx * dx)) }
    return y
  }
  for (let i = 0; i < n; i++) {
    let best: Pt = [lo, -Infinity]
    for (let k = 0; k < 14; k++) { const x = lo + rand() * (hi - lo), y = rest(x); if (y > best[1]) best = [x, y] }
    pts.push([r1(best[0]), r1(best[1])])
  }
  return pts
}
/** Gas: a few particles spread through the whole box, far apart. */
export function gasPts(box: Box, r: number, n: number, seed: number, gap = 3.4): Pt[] {
  const rand = seeded(seed), pts: Pt[] = [], m = r + 8
  for (let tries = 0; pts.length < n && tries < 4000; tries++) {
    const p: Pt = [r1(box.x + m + rand() * (box.w - 2 * m)), r1(box.y + m + rand() * (box.h - 2 * m))]
    if (pts.every(q => Math.hypot(q[0] - p[0], q[1] - p[1]) > gap * r)) pts.push(p)
  }
  return pts
}

export function Particle({ x, y, r = 9, fill = particleFill, line = particleLine, strong = false }: { x: number; y: number; r?: number; fill?: string; line?: string; strong?: boolean }) {
  return <g>
    <circle cx={x} cy={y} r={r} fill={fill} stroke={line} strokeWidth={strong ? 2.4 : 1.6} />
    <circle cx={r1(x - r * .32)} cy={r1(y - r * .34)} r={r1(r * .28)} fill="white" opacity=".7" />
  </g>
}
/** A container: a pale rounded box. `open` leaves the top off (a beaker-like tray). */
export function Container({ box, open = false, line = boxLine, width = 2.6, fill = boxFill }: { box: Box; open?: boolean; line?: string; width?: number; fill?: string }) {
  const { x, y, w, h } = box, rr = 12
  return open
    ? <path d={`M${x} ${y}V${y + h - rr}Q${x} ${y + h} ${x + rr} ${y + h}H${x + w - rr}Q${x + w} ${y + h} ${x + w} ${y + h - rr}V${y}`} fill={fill} stroke={line} strokeWidth={width} />
    : <rect x={x} y={y} width={w} height={h} rx={rr} fill={fill} stroke={line} strokeWidth={width} />
}
/** A small two-headed arrow just above a particle: it vibrates about a fixed position. */
export function Vibrate({ x, y, r = 9, colour = motion }: { x: number; y: number; r?: number; colour?: string }) {
  const yy = y - r - 7, h = r + 2
  return <path d={`M${x - h} ${yy}H${x + h}M${x - h + 4.5} ${yy - 3.5}L${x - h} ${yy}L${x - h + 4.5} ${yy + 3.5}M${x + h - 4.5} ${yy - 3.5}L${x + h} ${yy}L${x + h - 4.5} ${yy + 3.5}`} stroke={colour} strokeWidth="1.9" fill="none" />
}
/** An arrow leaving a particle in direction `angle` (degrees); length ~ speed. */
export function Motion({ x, y, angle, length, r = 9, colour = motion, width = 2 }: { x: number; y: number; angle: number; length: number; r?: number; colour?: string; width?: number }) {
  const a = angle * Math.PI / 180, s = r + 3
  return <Arrow from={[r1(x + Math.cos(a) * s), r1(y + Math.sin(a) * s)]} to={[r1(x + Math.cos(a) * (s + length)), r1(y + Math.sin(a) * (s + length))]} colour={colour} width={width} />
}
/** Directions for gas particles that keep each arrow inside its box. */
export function gasAngles(pts: Pt[], box: Box, seed: number, length: number, r = 9) {
  const rand = seeded(seed)
  return pts.map(([x, y]) => {
    for (let k = 0; k < 24; k++) {
      const ang = rand() * 360, a = ang * Math.PI / 180, ex = x + Math.cos(a) * (r + length + 8), ey = y + Math.sin(a) * (r + length + 8)
      if (ex > box.x + 4 && ex < box.x + box.w - 4 && ey > box.y + 4 && ey < box.y + box.h - 4) return r1(ang)
    }
    return 0
  })
}

/** A box of particles in one state, with or without motion marks. The standard drawing for all particle lessons. */
export function StateBox({ box, state, r = 9, n, seed = 3, arrows = true, speed = 1, cols, rows, pts: given }: { box: Box; state: ParticleState; r?: number; n?: number; seed?: number; arrows?: boolean; speed?: number; cols?: number; rows?: number; pts?: Pt[] }) {
  const inner: Box = box
  const c = cols ?? Math.max(3, Math.floor((box.w - 14) / (2 * r + 1))), rw = rows ?? 4
  const pts = given ?? (state === 'solid' ? solidPts(inner, r, c, rw) : state === 'liquid' ? liquidPts(inner, r, n ?? c * rw - 2, seed) : gasPts(inner, r, n ?? 5, seed, 4.2))
  const angles = state === 'gas' ? gasAngles(pts, box, seed + 7, 18 * speed, r) : []
  // Liquid: curved arrows on the particles at the surface. Solid: vibration marks on the top row.
  const liquidMarks = pts.map((p, i) => [p[1], i]).sort((a, b) => a[0] - b[0]).slice(0, 4).map(([, i]) => i)
  const topRow = Math.min(...pts.map(p => p[1]))
  return <g>
    <Container box={box} open={state !== 'gas'} />
    {pts.map(([x, y], i) => <Particle key={i} x={x} y={y} r={r} />)}
    {arrows && state === 'solid' && pts.filter(([, y], i) => y === topRow && i % 2 === 0).map(([x, y], i) => <Vibrate key={i} x={x} y={y} r={r} />)}
    {arrows && state === 'liquid' && liquidMarks.map(i => { const [x, y] = pts[i]; return <CurveArrow key={i} from={[x - r * .6, y - r - 3]} to={[x + r * 1.1, y - r - 5]} bend={-0.5} colour={motion} width={1.8} /> })}
    {arrows && state === 'gas' && pts.map(([x, y], i) => <Motion key={i} x={x} y={y} angle={angles[i]} length={18 * speed} r={r} />)}
  </g>
}

/* ---------- Everyday objects shared by the particle lessons ---------- */

/** A thermometer: bulb at (x, y), `level` 0–1 of the tube filled. Hot red liquid. */
export function Thermometer({ x, y, height = 90, level = 0.5, colour = P.hot, reading }: { x: number; y: number; height?: number; level?: number; colour?: string; reading?: string }) {
  const top = y - height, fillTop = y - 8 - (height - 16) * level
  return <g>
    <path d={`M${x - 5} ${y - 8}V${top + 5}a5 5 0 0 1 10 0V${y - 8}`} fill="white" stroke={muted} strokeWidth="1.8" />
    <path d={`M${x} ${y - 6}V${r1(fillTop)}`} stroke={colour} strokeWidth="4.5" />
    <circle cx={x} cy={y} r="9" fill={colour} stroke={muted} strokeWidth="1.8" />
    {[0.25, 0.5, 0.75].map(k => <path key={k} d={`M${x + 5} ${r1(y - 8 - (height - 16) * k)}h5`} stroke={muted} strokeWidth="1.3" />)}
    {reading && <text x={x + 14} y={r1(fillTop + 5)} fontSize="14" fontWeight="700" fill={colour}>{reading}</text>}
  </g>
}
/** A small gas flame (Bunsen-style) with its base at (x, y). */
export function Flame({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0C-12 -4 -11 -18 -3 -30C-2 -20 5 -19 4 -27C12 -18 13 -5 0 0Z" fill="#f5a54a" stroke="#c8641e" strokeWidth="1.5" />
    <path d="M0 -3C-5 -7 -4 -13 0 -18C1 -13 5 -10 0 -3Z" fill="#fcd97d" />
  </g>
}
/** A small hotplate / heater under a container, centred at x, top at y. */
export function Heater({ x, y, w = 110, on = true }: { x: number; y: number; w?: number; on?: boolean }) {
  return <g>
    <rect x={x - w / 2} y={y} width={w} height={16} rx="6" fill="#e7eaec" stroke="#7f95a6" strokeWidth="2" />
    <path d={`M${x - w / 2 + 12} ${y + 8}H${x + w / 2 - 12}`} stroke={on ? P.hot : '#b8c4cd'} strokeWidth="4" />
    <rect x={x - w / 2 + 6} y={y + 16} width={w - 12} height={10} rx="3" fill="#d5dbe2" stroke="#7f95a6" strokeWidth="1.6" />
  </g>
}
/** A round pressure gauge centred on (x, y); `value` 0–1 turns the needle. */
export function Gauge({ x, y, value, r = 24, colour = ink, label }: { x: number; y: number; value: number; r?: number; colour?: string; label?: string }) {
  const a = (-210 + 240 * value) * Math.PI / 180
  const arc = (k: number) => { const t = (-210 + 240 * k) * Math.PI / 180; return [r1(x + Math.cos(t) * (r - 6)), r1(y + Math.sin(t) * (r - 6))] }
  return <g>
    <circle cx={x} cy={y} r={r} fill="white" stroke={muted} strokeWidth="2.2" />
    <path d={`M${arc(0).join(' ')}A${r - 6} ${r - 6} 0 1 1 ${arc(1).join(' ')}`} stroke={P.grid} strokeWidth="4" fill="none" />
    <path d={`M${arc(0).join(' ')}A${r - 6} ${r - 6} 0 ${value > 0.75 ? 1 : 0} 1 ${arc(value).join(' ')}`} stroke={colour} strokeWidth="4" fill="none" opacity=".45" />
    <path d={`M${x} ${y}L${r1(x + Math.cos(a) * (r - 7))} ${r1(y + Math.sin(a) * (r - 7))}`} stroke={colour} strokeWidth="2.6" />
    <circle cx={x} cy={y} r="3" fill={colour} />
    {label && <text x={x} y={y + r + 17} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>{label}</text>}
  </g>
}
/** A small burst where a particle hits a wall. */
export function Impact({ x, y, side, big = false, colour = P.hot }: { x: number; y: number; side: 'left' | 'right' | 'top' | 'bottom'; big?: boolean; colour?: string }) {
  const k = big ? 1.5 : 1
  const dir: Record<string, number> = { left: 180, right: 0, top: -90, bottom: 90 }
  return <g transform={`translate(${x} ${y}) rotate(${dir[side]})`} stroke={colour} strokeWidth={big ? 2.4 : 1.8} fill="none">
    <path d={`M${3 * k} ${-9 * k}L${9 * k} ${-14 * k}M${5 * k} 0H${13 * k}M${3 * k} ${9 * k}L${9 * k} ${14 * k}`} />
  </g>
}
/** A crossed circle ("not this"). */
export function CrossMark({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><circle r="12" fill="#fbe6e2" stroke={P.wasted} strokeWidth="2" /><path d="M-5 -5l10 10M5 -5l-10 10" stroke={P.wasted} strokeWidth="3" /></g>
}
export function TickMark({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><circle r="12" fill={P.usefulFill} stroke={P.useful} strokeWidth="2" /><path d="M-5.5 0l4 4.5l7.5 -9" stroke={P.useful} strokeWidth="3" fill="none" /></g>
}
/** A magnifier: a circle close-up joined to the spot it enlarges by two dashed lines. Children are clipped to the circle. */
export function Magnifier({ cx, cy, r, from, children, line = boxLine }: { cx: number; cy: number; r: number; from: Pt; children: ReactNode; line?: string }) {
  const clip = useId()
  const a = Math.atan2(from[1] - cy, from[0] - cx), t1 = a + 0.5, t2 = a - 0.5
  return <g>
    <path d={`M${r1(cx + Math.cos(t1) * r)} ${r1(cy + Math.sin(t1) * r)}L${from[0]} ${from[1]}L${r1(cx + Math.cos(t2) * r)} ${r1(cy + Math.sin(t2) * r)}`} stroke={muted} strokeWidth="1.3" strokeDasharray="4 4" fill="none" />
    <circle cx={from[0]} cy={from[1]} r="5" fill="none" stroke={muted} strokeWidth="1.4" />
    <circle cx={cx} cy={cy} r={r + 3} fill="white" stroke={line} strokeWidth="2.6" />
    <clipPath id={clip}><circle cx={cx} cy={cy} r={r} /></clipPath>
    <g clipPath={`url(#${clip})`}>{children}</g>
  </g>
}
/** An ice cube: a soft rounded, slightly glossy block. */
export function IceCube({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-28 -14L-6 -26L30 -18L30 16L6 30L-28 20Z" fill="#e3f2fb" stroke="#6aa8cb" strokeWidth="2" />
    <path d="M-28 -14L6 -4L30 -18M6 -4V30" fill="none" stroke="#6aa8cb" strokeWidth="1.6" />
    <path d="M-20 -8l12 4M12 -2l10 -6" stroke="white" strokeWidth="3" />
  </g>
}
/** A small puddle of water centred on (x, y). */
export function Puddle({ x, y, rx = 44, ry = 12, seed = 5 }: { x: number; y: number; rx?: number; ry?: number; seed?: number }) {
  return <g><path d={blob(x, y, rx, ry, seed, 0.12, 12)} fill={P.water} stroke={P.waterLine} strokeWidth="2" /><path d={`M${x - rx * .45} ${y - 2}q${rx * .15} -3 ${rx * .3} 0`} stroke="white" strokeWidth="2.4" fill="none" /></g>
}
/** A short label chip used for state names and small notes. */
export function Chip({ x, y, text, colour = ink, fill = 'white', line = P.panelLine, size = 13 }: { x: number; y: number; text: string; colour?: string; fill?: string; line?: string; size?: number }) {
  const w = text.length * size * 0.6 + 20
  return <g><rect x={r1(x - w / 2)} y={y - size - 2} width={r1(w)} height={size + 12} rx={(size + 12) / 2} fill={fill} stroke={line} strokeWidth="1.5" /><text x={x} y={y + 2} textAnchor="middle" fontSize={size} fontWeight="700" fill={colour}>{text}</text></g>
}
/** A row of `n` bar segments, `on` of them filled: a simple "how much energy" meter. */
export function Meter({ x, y, on, n = 3, fill = P.kinetic, line = P.kineticLine, w = 22 }: { x: number; y: number; on: number; n?: number; fill?: string; line?: string; w?: number }) {
  return <g>{Array.from({ length: n }, (_, i) => <rect key={i} x={x + i * (w + 4)} y={y} width={w} height={11} rx="5.5" fill={i < on ? fill : 'white'} stroke={i < on ? line : P.panelLine} strokeWidth="1.5" />)}</g>
}

/* ================= Lesson 27 drawings ================= */

// Section 2: the same particle in ice and in water.
function Same() {
  return <PhysicsDiagram title="An ice cube and a puddle of water. A magnified view of each shows one particle, and it is exactly the same particle in both.">
    <IceCube x={120} y={214} s={1.3} />
    <Puddle x={420} y={226} rx={62} ry={16} />
    <Magnifier cx={120} cy={92} r={46} from={[126, 196]}><rect x={70} y={40} width={100} height={100} fill="#eef6fc" /><Particle x={120} y={92} r={22} /></Magnifier>
    <Magnifier cx={420} cy={92} r={46} from={[420, 222]}><rect x={370} y={40} width={100} height={100} fill="#e4f1f9" /><Particle x={420} y={92} r={22} /></Magnifier>
    <Lines x={270} y={84} anchor="middle" lines={['the same', 'particle']} colour={particleLine} />
    <path d="M232 92H184M308 92H356" stroke={particleLine} strokeWidth="1.6" strokeDasharray="4 4" />
    <Lines x={120} y={278} anchor="middle" lines={['ice (solid)']} size={14} weight={650} />
    <Lines x={420} y={278} anchor="middle" lines={['water (liquid)']} size={14} weight={650} />
  </PhysicsDiagram>
}

// Section 2: the three states side by side; the one being taught is drawn in full, the others faded.
const TRIO: Record<ParticleState, Box> = { solid: { x: 22, y: 64, w: 150, h: 112 }, liquid: { x: 195, y: 64, w: 150, h: 112 }, gas: { x: 368, y: 64, w: 150, h: 112 } }
const TRIO_TEXT: Record<ParticleState, { title: string; lines: string[]; energy: number }> = {
  solid: { title: 'In a solid, strong forces hold the particles close together in a fixed, regular pattern. They have the least energy and only vibrate.', lines: ['fixed, regular pattern', 'strong forces', 'vibrate on the spot'], energy: 1 },
  liquid: { title: 'In a liquid, the particles are close together in an irregular pattern. They have more energy than in a solid and move past each other.', lines: ['close together, irregular', 'weaker forces', 'move past each other'], energy: 2 },
  gas: { title: 'In a gas, the particles are far apart with almost no forces between them. They have the most energy and move fast in random directions.', lines: ['far apart, almost no forces', 'most energy', 'fast, random directions'], energy: 3 },
}
function Trio({ active }: { active: ParticleState }) {
  const states: ParticleState[] = ['solid', 'liquid', 'gas']
  return <PhysicsDiagram title={TRIO_TEXT[active].title}>
    {states.map(s => {
      const b = TRIO[s], on = s === active
      return <g key={s} opacity={on ? 1 : faded}>
        <StateBox box={b} state={s} r={9} cols={6} rows={4} n={s === 'liquid' ? 20 : 5} seed={s === 'gas' ? 11 : 4} arrows={on} speed={1} />
        <Chip x={b.x + b.w / 2} y={44} text={s} colour={on ? ink : muted} fill={on ? '#eef4f9' : 'white'} />
        <text x={b.x + 8} y={b.y + b.h + 24} fontSize="12" fontWeight="650" fill={muted}>energy</text>
        <Meter x={b.x + 60} y={b.y + b.h + 14} on={TRIO_TEXT[s].energy} />
      </g>
    })}
    <g>
      {TRIO_TEXT[active].lines.map((l, i) => <g key={l}>
        <circle cx={Math.min(TRIO[active].x + 8, 300)} cy={226 + i * 22} r="3.5" fill={particleLine} />
        <text x={Math.min(TRIO[active].x + 18, 310)} y={231 + i * 22} fontSize="14" fontWeight="700" fill={ink}>{l}</text>
      </g>)}
    </g>
  </PhysicsDiagram>
}

// Section 3: one gas box. Particles free to move, then collisions with the walls, then force over an area.
const GBOX: Box = { x: 60, y: 44, w: 230, h: 190 }
const GPTS: Pt[] = [[110, 80], [202, 74], [258, 120], [150, 142], [96, 196], [214, 190], [272, 206], [170, 214]]
const GANG = [200, 330, 20, 250, 120, 150, 300, 160]
function GasBox({ focus }: { focus: 'free' | 'collide' | 'pressure' }) {
  const hitters = new Set([2, 6])
  const title = focus === 'free' ? 'Gas particles in a box move freely in straight lines in random directions.'
    : focus === 'collide' ? 'Gas particles collide with each other and with the walls of the container. Each collision with a wall gives it a small push.'
      : 'Particles hitting a wall apply a force to it. The force applied over a given area of the wall is the pressure.'
  return <PhysicsDiagram title={title}>
    {focus === 'pressure' && <rect x={GBOX.x + GBOX.w - 5} y={96} width={12} height={90} rx="5" fill={P.hotFill} stroke={P.hot} strokeWidth="1.6" />}
    <Container box={GBOX} />
    {focus === 'pressure' && <rect x={GBOX.x + GBOX.w - 3} y={98} width={6} height={86} fill={P.hotFill} />}
    {GPTS.map(([x, y], i) => {
      const hit = focus !== 'free' && hitters.has(i)
      const pair = focus === 'collide' && i === 7
      const pos: Pt = hit ? (i === 2 ? [GBOX.x + GBOX.w - 13, 118] : [GBOX.x + GBOX.w - 13, focus === 'pressure' ? 168 : 204]) : pair ? [172, 156] : [x, y]
      return <g key={i}>
        <Particle x={pos[0]} y={pos[1]} r={10} strong={hit || (focus === 'collide' && (i === 3 || i === 7))} />
        {!hit && <Motion x={pos[0]} y={pos[1]} angle={pair ? 60 : focus === 'collide' && i === 3 ? 220 : GANG[i]} length={22} r={10} />}
        {hit && <Arrow from={[pos[0] - 16, pos[1] + 2]} to={[pos[0] - 40, pos[1] + 12]} colour={motion} width={2} />}
      </g>
    })}
    {focus === 'collide' && <g>
      <Impact x={GBOX.x + GBOX.w - 1} y={118} side="right" />
      <Impact x={GBOX.x + GBOX.w - 1} y={204} side="right" />
      {/* two particles bumping into each other */}
      {focus === 'collide' && <g>
        <Impact x={163} y={145} side="top" colour={P.hot} />
      </g>}
    </g>}
    {focus === 'pressure' && <g>
      {[108, 128, 148, 168].map(y => <Arrow key={y} from={[GBOX.x + GBOX.w + 10, y]} to={[GBOX.x + GBOX.w + 34, y]} colour={P.hot} width={2.4} />)}
    </g>}
    {focus === 'free' && <g>
      <Lines x={330} y={94} lines={['free to move']} size={15} />
      <Lines x={330} y={120} lines={['straight lines until', 'they hit something']} size={13} weight={600} colour={muted} />
      <Leader from={[326, 100]} to={[276, 118]} colour={ink} />
    </g>}
    {focus === 'collide' && <g>
      <Lines x={336} y={86} lines={['collisions with', 'the walls']} size={15} colour={P.hot} />
      <Leader from={[334, 112]} to={[292, 118]} colour={P.hot} />
      <Lines x={60} y={262} lines={['and with each other']} size={14} weight={650} colour={muted} />
      <Leader from={[128, 248]} to={[166, 170]} colour={muted} />
    </g>}
    {focus === 'pressure' && <g>
      <Lines x={336} y={96} lines={['force on the wall']} size={14} colour={P.hot} />
      <Lines x={336} y={200} lines={['force over an area', '= pressure']} size={15} />
      <text x={GBOX.x + GBOX.w / 2} y={GBOX.y + GBOX.h + 32} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>shaded patch = an area of the wall</text>
    </g>}
  </PhysicsDiagram>
}

// Section 4: a cool box and a hot box of the same gas: same number of particles, same volume.
const COOL: Box = { x: 22, y: 58, w: 178, h: 146 }, HOT: Box = { x: 292, y: 58, w: 178, h: 146 }
const CPTS: Pt[] = [[62, 94], [140, 86], [176, 128], [96, 146], [58, 182], [150, 176]]
const CANG = [30, 200, 250, 330, 300, 140]
const HANG = [20, 190, 355, 330, 260, 120]
// Where the particles sit when they are drawn hitting a wall (index → position and which wall).
const COOL_HITS: Record<number, [Pt, 'left' | 'right' | 'top' | 'bottom']> = { 2: [[COOL.x + COOL.w - 11, 128], 'right'] }
const HOT_HITS: Record<number, [Pt, 'left' | 'right' | 'top' | 'bottom']> = {
  2: [[HOT.x + HOT.w - 11, 128], 'right'], 4: [[HOT.x + 11, 176], 'left'], 1: [[HOT.x + 34, HOT.y + 11], 'top'], 5: [[HOT.x + 128, HOT.y + HOT.h - 11], 'bottom'],
}
function CoolHot({ focus }: { focus: 'temp' | 'faster' | 'harder' }) {
  const title = focus === 'temp' ? 'Two boxes of the same gas. The hot gas has a higher temperature, so its particles have a higher average energy in their kinetic energy stores.'
    : focus === 'faster' ? 'The particles in the hot gas move faster on average, shown by longer arrows.'
      : 'Faster particles hit the walls more often and with more force, so the pressure gauge on the hot box reads higher.'
  const boxes = [
    { b: COOL, pts: CPTS, ang: CANG, len: 12, name: 'cool gas', t: .3, e: 1, colour: P.cold, hits: COOL_HITS },
    { b: HOT, pts: CPTS.map(([x, y]) => [x + 270, y] as Pt), ang: HANG, len: 30, name: 'hot gas', t: .82, e: 3, colour: P.hot, hits: HOT_HITS },
  ]
  return <PhysicsDiagram title={title}>
    {boxes.map(({ b, pts, ang, len, name, t, e, colour, hits }, k) => <g key={name}>
      <Container box={b} />
      {pts.map(([x, y], i) => {
        const hit = focus === 'harder' ? hits[i] : undefined
        const pos = hit ? hit[0] : [x, y]
        return <g key={i}>
          <Particle x={pos[0]} y={pos[1]} r={9} strong={!!hit} />
          {hit ? <Impact x={hit[1] === 'right' ? b.x + b.w : hit[1] === 'left' ? b.x : pos[0]} y={hit[1] === 'top' ? b.y : hit[1] === 'bottom' ? b.y + b.h : pos[1]} side={hit[1]} big={k === 1} />
            : <Motion x={pos[0]} y={pos[1]} angle={ang[i]} length={len} r={9} width={k ? 2.4 : 1.8} />}
        </g>
      })}
      <text x={b.x + b.w / 2} y={b.y - 16} textAnchor="middle" fontSize="15" fontWeight="700" fill={colour}>{name}</text>
      {focus !== 'harder' && <Thermometer x={b.x + b.w + 26} y={b.y + b.h - 6} height={96} level={t} colour={colour} />}
      {focus === 'harder' && <g><path d={`M${b.x + b.w} ${b.y + 30}h14`} stroke={boxLine} strokeWidth="5" /><Gauge x={b.x + b.w + 36} y={b.y + 30} value={k ? .82 : .3} r={21} colour={colour} /></g>}
      {focus === 'temp' && <g>
        <text x={b.x + b.w / 2} y={b.y + b.h + 26} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>average kinetic energy</text>
        <Meter x={b.x + b.w / 2 - 37} y={b.y + b.h + 36} on={e} />
      </g>}
      {focus === 'faster' && <Lines x={b.x + b.w / 2} y={b.y + b.h + 36} anchor="middle" lines={[k ? 'faster on average' : 'slower on average']} colour={colour} size={15} />}
      {focus === 'harder' && <Lines x={b.x + b.w / 2} y={b.y + b.h + 34} anchor="middle" lines={k ? ['more hits, harder hits:', 'higher pressure'] : ['fewer, gentler hits:', 'lower pressure']} colour={colour} size={14} />}
    </g>)}
    {focus === 'temp' && <EnergyStoreBadge store="kinetic" x={270} y={280} label="Kinetic energy stores of the particles" />}
  </PhysicsDiagram>
}

// Section 4: fixed volume. A sealed rigid box being heated, and a faded box with a sliding piston (not this case).
function Volume() {
  const b: Box = { x: 24, y: 74, w: 190, h: 128 }, pb: Box = { x: 330, y: 74, w: 140, h: 128 }
  const pts = gasPts(b, 9, 7, 21)
  const ang = gasAngles(pts, b, 5, 26)
  const ppts = gasPts({ x: pb.x, y: pb.y, w: pb.w - 22, h: pb.h }, 9, 4, 8, 3.6)
  return <PhysicsDiagram title="A sealed, rigid box of gas being heated: its volume stays the same, so its pressure rises. A box with a sliding piston, whose volume could change, is crossed out.">
    <rect x={b.x - 5} y={b.y - 5} width={b.w + 10} height={b.h + 10} rx="15" fill="none" stroke={ink} strokeWidth="3" />
    <Container box={b} />
    {pts.map(([x, y], i) => <g key={i}><Particle x={x} y={y} /><Motion x={x} y={y} angle={ang[i]} length={24} width={2.4} /></g>)}
    <Heater x={b.x + b.w / 2} y={b.y + b.h + 8} w={150} />
    <path d={`M${b.x + b.w + 5} ${b.y + 30}h12`} stroke={ink} strokeWidth="5" />
    <Gauge x={b.x + b.w + 38} y={b.y + 30} value={.8} r={21} colour={P.hot} />
    <Lines x={b.x + b.w + 38} y={b.y + 72} anchor="middle" lines={['pressure', 'rises']} size={13} weight={700} colour={P.hot} />
    <Lines x={b.x + b.w / 2} y={30} anchor="middle" lines={['sealed, rigid box:', 'volume stays the same']} size={14} />
    <g opacity=".42">
      <Container box={pb} />
      <rect x={pb.x + pb.w - 24} y={pb.y + 6} width={13} height={pb.h - 12} rx="4" fill="#dfe5ea" stroke={muted} strokeWidth="2" />
      <path d={`M${pb.x + pb.w - 11} ${pb.y + pb.h / 2}H${pb.x + pb.w + 30}`} stroke={muted} strokeWidth="5" />
      <Arrow from={[pb.x + pb.w + 8, pb.y + pb.h / 2 + 24]} to={[pb.x + pb.w + 40, pb.y + pb.h / 2 + 24]} colour={muted} width={2} />
      {ppts.map(([x, y], i) => <Particle key={i} x={x} y={y} />)}
      <Lines x={pb.x + pb.w / 2 + 10} y={48} anchor="middle" lines={['piston can move']} size={13} weight={650} colour={muted} />
    </g>
    <CrossMark x={pb.x + pb.w / 2 - 20} y={pb.y + pb.h + 30} />
    <Lines x={pb.x + pb.w / 2} y={pb.y + pb.h + 35} lines={['not this']} size={13} weight={650} colour={P.wasted} />
  </PhysicsDiagram>
}

// Question P27-12: one box of close, irregular particles; no arrows, no state name.
function QArrangement() {
  const b: Box = { x: 170, y: 70, w: 200, h: 150 }
  return <PhysicsDiagram title="A box of particles.">
    <StateBox box={b} state="liquid" r={11} n={20} seed={9} arrows={false} />
  </PhysicsDiagram>
}

export function GasParticleVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'gaspart-same': return <Same />
    case 'gaspart-solid': return <Trio active="solid" />
    case 'gaspart-liquid': return <Trio active="liquid" />
    case 'gaspart-gas': return <Trio active="gas" />
    case 'gaspart-free': return <GasBox focus="free" />
    case 'gaspart-collide': return <GasBox focus="collide" />
    case 'gaspart-pressure': return <GasBox focus="pressure" />
    case 'gaspart-temp': return <CoolHot focus="temp" />
    case 'gaspart-faster': return <CoolHot focus="faster" />
    case 'gaspart-harder': return <CoolHot focus="harder" />
    case 'gaspart-volume': return <Volume />
    case 'gaspart-q-arrangement': return <QArrangement />
    default: return null
  }
}
