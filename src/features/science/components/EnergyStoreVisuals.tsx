import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, Leader, EnergyStoreBadge, StoreIcon, TransferArrow, Wire, Cell, Lamp, CurrentArrow, energyStores, type EnergyStore, type Pt } from './PhysicsKit'

/*
 * Physics Lesson 1: Energy stores and systems. Original, code-native schematics; not to scale. Focus ids start with 'estore-'.
 *
 * Every store keeps its PhysicsKit colour and icon (kinetic orange, thermal red, chemical purple, gravitational indigo,
 * elastic magenta, electrostatic teal, magnetic grey, nuclear olive). Hot things are tinted red, cold things blue.
 * Three shared drawings: the eight-store gallery (section "What are energy stores?"), a "store → way → store" scene
 * (section "How does energy move?") and a dashed system boundary (section "What is a system?").
 *
 * The small scene pieces below (people, cars, mugs, thermometers, equation cards, step strips) are exported so the
 * other Energy lessons (conservation, kinetic, potential, specific heat capacity) draw with exactly the same parts.
 */

export const { ink, muted } = P
export const faded = 0.22
export const r1 = (n: number) => Math.round(n * 10) / 10
export const skin = '#f3cfb0', skinLine = '#b8835e', shirt = '#9cc3d9', shirtLine = '#3f7a9c', trousers = '#6b7f92', hair = '#6b4a35'
export const ground = '#eef2e6', groundLine = '#b9c7a8', wood = '#e8cfa6', woodLine = '#a57a45', metal = '#dfe5ea', metalLine = '#7d8e9c'
export const good = P.useful, warn = '#c0675a'

/* ---------- Text and labels ---------- */

export function Caption({ text, y = 290, x = 270, colour = muted, size = 14 }: { text: string; y?: number; x?: number; colour?: string; size?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={size} fontWeight="600" fill={colour}>{text}</text>
}
/** A rounded tag with centred text. Width is estimated from the text. */
export function Tag({ x, y, text, colour = ink, fill = 'white', size = 13, w }: { x: number; y: number; text: string; colour?: string; fill?: string; size?: number; w?: number }) {
  const width = w ?? Math.round(text.length * size * 0.56 + 20)
  return <g>
    <rect x={r1(x - width / 2)} y={y - 12} width={width} height={24} rx="12" fill={fill} stroke={colour} strokeWidth="1.5" />
    <text x={x} y={y + 4.5} textAnchor="middle" fontSize={size} fontWeight="700" fill={colour}>{text}</text>
  </g>
}
/** A numbered circle, used for question objects and for step strips. */
export function Num({ n, x, y, state = 'on', colour = ink }: { n: number | string; x: number; y: number; state?: 'active' | 'on' | 'off'; colour?: string }) {
  const active = state === 'active', off = state === 'off'
  return <g opacity={off ? 0.42 : 1}>
    <circle cx={x} cy={y} r="12.5" fill={active ? colour : 'white'} stroke={colour} strokeWidth="2" />
    <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={active ? 'white' : colour}>{n}</text>
  </g>
}
/** The step strip along the top of a worked example: numbered words, the current one filled. */
export function StepStrip({ steps, active, y = 22, colour = ink, x0 = 270, gap = 150 }: { steps: string[]; active: number; y?: number; colour?: string; x0?: number; gap?: number }) {
  const start = x0 - (steps.length - 1) * gap / 2
  return <g>
    {steps.map((word, i) => {
      const n = i + 1, state = n === active ? 'active' : n < active ? 'on' : 'off'
      const cx = start + i * gap
      return <g key={word}>
        <Num n={n} x={cx - 34} y={y} state={state} colour={colour} />
        <text x={cx - 16} y={y + 5} fontSize="14" fontWeight={n === active ? 700 : 600} fill={n === active ? colour : ink} opacity={n > active ? 0.42 : 1}>{word}</text>
      </g>
    })}
  </g>
}
/** A soft card behind an equation or a working line. `hot` gives it the highlight tint. */
export function Card({ x, y, w, h, hot = false, colour = ink, children }: { x: number; y: number; w: number; h: number; hot?: boolean; colour?: string; children?: ReactNode }) {
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="14" fill={hot ? '#fff6e3' : P.panel} stroke={hot ? '#e7b75e' : P.panelLine} strokeWidth={hot ? 2 : 1.5} />
    {children}
    {void colour}
  </g>
}
/** An equation or working line built from coloured pieces that flow one after another. */
export type Piece = [string, string?]
export function Eq({ x, y, pieces, size = 20, anchor = 'middle', weight = 700 }: { x: number; y: number; pieces: Piece[]; size?: number; anchor?: 'start' | 'middle' | 'end'; weight?: number }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={ink}>{pieces.map(([t, c], i) => <tspan key={i} fill={c ?? ink}>{t}</tspan>)}</text>
}
/** A ring drawn round an answer's unit. */
export function Ring({ x, y, rx = 14, ry = 13, colour = good }: { x: number; y: number; rx?: number; ry?: number; colour?: string }) {
  return <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="none" stroke={colour} strokeWidth="2.2" />
}
export function Tick({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><circle r="12" fill={P.usefulFill} stroke={good} strokeWidth="2" /><path d="M-5.5 0l4 4.5l7.5 -9" stroke={good} strokeWidth="3" fill="none" /></g>
}
export function CrossMark({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><circle r="12" fill={P.wastedFill} stroke={warn} strokeWidth="2" /><path d="M-5 -5l10 10M5 -5l-10 10" stroke={warn} strokeWidth="3" /></g>
}
/** A plain straight arrow (forces, motion, "lifted"). */
export function Arrow({ from, to, colour = ink, width = 3, head = 1 }: { from: Pt; to: Pt; colour?: string; width?: number; head?: number }) {
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]), h = (7 + width * 1.6) * head
  const p = (d: number, s: number): Pt => [r1(to[0] - Math.cos(a) * d + Math.cos(a + Math.PI / 2) * s), r1(to[1] - Math.sin(a) * d + Math.sin(a + Math.PI / 2) * s)]
  const [b1, b2, base] = [p(h, h * 0.55), p(h, -h * 0.55), p(h * 0.72, 0)]
  return <g><path d={`M${from[0]} ${from[1]}L${base[0]} ${base[1]}`} stroke={colour} strokeWidth={width} fill="none" /><path d={`M${to[0]} ${to[1]}L${b1[0]} ${b1[1]}L${base[0]} ${base[1]}L${b2[0]} ${b2[1]}Z`} fill={colour} stroke={colour} strokeWidth="1.2" /></g>
}

/* ---------- Scene pieces ---------- */

export function Floor({ x1 = 10, x2 = 530, y }: { x1?: number; x2?: number; y: number }) {
  return <path d={`M${x1} ${y}Q${(x1 + x2) / 2} ${y - 3} ${x2} ${y}`} stroke={groundLine} strokeWidth="2.2" fill="none" />
}
export function Ball({ x, y, r = 16, fill = '#f6c9a0', line = P.kineticLine, seam = true }: { x: number; y: number; r?: number; fill?: string; line?: string; seam?: boolean }) {
  return <g>
    <circle cx={x} cy={y} r={r} fill={fill} stroke={line} strokeWidth="2" />
    {seam && <path d={`M${x - r * 0.72} ${y - r * 0.55}Q${x} ${y + r * 0.1} ${x + r * 0.72} ${y - r * 0.55}`} stroke={line} strokeWidth="1.4" fill="none" opacity=".7" />}
    <circle cx={x - r * 0.35} cy={y - r * 0.4} r={r * 0.2} fill="white" opacity=".7" />
  </g>
}
/** Short motion lines trailing behind something moving to the right (dir 1) or left (-1). */
export function Motion({ x, y, dir = 1, colour = P.kineticLine, n = 3, len = 22 }: { x: number; y: number; dir?: number; colour?: string; n?: number; len?: number }) {
  return <g stroke={colour} strokeWidth="2.4" opacity=".75">
    {Array.from({ length: n }, (_, i) => { const dy = (i - (n - 1) / 2) * 9, l = len - Math.abs(i - (n - 1) / 2) * 6; return <path key={i} d={`M${x} ${y + dy}h${-dir * l}`} /> })}
  </g>
}
/** A small family car facing right; (x, y) is the middle of the road under it. */
export function Car({ x, y, s = 1, fill = '#9cc3d9', line = '#3f7a9c', flip = false }: { x: number; y: number; s?: number; fill?: string; line?: string; flip?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M-48 -14Q-50 -30 -36 -32L-22 -33Q-12 -50 4 -50H16Q30 -50 38 -34L44 -32Q52 -29 50 -16Q50 -11 45 -11H-44Q-48 -11 -48 -14Z" fill={fill} stroke={line} strokeWidth="2.2" />
    <path d="M-15 -34Q-8 -45 3 -45H13Q24 -45 30 -34Z" fill="#e8f4fb" stroke={line} strokeWidth="1.6" />
    <path d="M7 -45V-34" stroke={line} strokeWidth="1.6" />
    <circle cx="44" cy="-24" r="3" fill="#fde8a8" stroke={line} strokeWidth="1.2" />
    {[-28, 28].map(wx => <g key={wx}><circle cx={wx} cy="-10" r="10" fill="#4f5d69" stroke="#33404b" strokeWidth="1.6" /><circle cx={wx} cy="-10" r="4" fill={metal} /></g>)}
  </g>
}
/** A lorry facing right; (x, y) is the road under its middle. */
export function Lorry({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-70" y="-78" width="92" height="60" rx="6" fill="#eef1e4" stroke="#7b8a5a" strokeWidth="2.2" />
    <path d="M24 -18V-58Q24 -64 30 -64H46Q54 -64 58 -56L66 -40Q68 -36 68 -32V-24Q68 -18 62 -18Z" fill="#e7a98b" stroke="#a5634a" strokeWidth="2.2" />
    <path d="M32 -56H45Q49 -56 51 -52L57 -40H32Z" fill="#e8f4fb" stroke="#a5634a" strokeWidth="1.6" />
    <path d="M-70 -18H68" stroke="#6d7a52" strokeWidth="3" />
    {[-52, -30, 48].map(wx => <g key={wx}><circle cx={wx} cy="-10" r="11" fill="#4f5d69" stroke="#33404b" strokeWidth="1.6" /><circle cx={wx} cy="-10" r="4.4" fill={metal} /></g>)}
  </g>
}
/** A bicycle with a rider, facing right; (x, y) is the road under the middle. `braking` highlights the brake pad. */
export function Bike({ x, y, s = 1, braking = false }: { x: number; y: number; s?: number; braking?: boolean }) {
  const frame = '#3f8f7d'
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-30, 30].map(wx => <g key={wx}><circle cx={wx} cy="-22" r="21" fill="none" stroke="#4f5d69" strokeWidth="3.4" /><circle cx={wx} cy="-22" r="3" fill="#4f5d69" /></g>)}
    <path d="M-30 -22L-8 -24L16 -52M-8 -24L-14 -54M-30 -22L-14 -54H14M30 -22L16 -52L14 -60" stroke={frame} strokeWidth="3.4" fill="none" />
    <path d="M8 -62H20" stroke="#4f5d69" strokeWidth="3.4" />
    <path d="M-20 -56H-8" stroke="#4f5d69" strokeWidth="4" />
    {braking && <g><rect x="42" y="-50" width="8" height="12" rx="2" transform="rotate(35 46 -44)" fill={P.thermal} stroke={P.thermalLine} strokeWidth="2" /></g>}
    {/* rider */}
    <path d="M-14 -58L-6 -90" stroke={shirtLine} strokeWidth="12" />
    <path d="M-14 -58L-6 -90" stroke={shirt} strokeWidth="8.5" />
    <path d="M-12 -60L2 -40L-4 -22M-12 -60L8 -44L12 -30" stroke={trousers} strokeWidth="7" fill="none" />
    <path d="M-6 -86L14 -64" stroke={skinLine} strokeWidth="6.5" /><path d="M-6 -86L14 -64" stroke={skin} strokeWidth="4" />
    <circle cx="-2" cy="-102" r="10" fill={skin} stroke={skinLine} strokeWidth="1.8" />
    <path d="M-12 -104Q-10 -116 2 -114Q10 -112 8 -104Q0 -110 -12 -104Z" fill="#7fb0cf" stroke={shirtLine} strokeWidth="1.4" />
  </g>
}

type Limb = Pt[]
/**
 * A simple rounded person. (x, y) is between the feet. Limbs are polylines in local coordinates from the
 * shoulder (0, -62) or the hip (0, -34); `s` scales. Only enough detail to show a pose.
 */
export function Person({ x, y, s = 1, arms, legs, lean = 0, top = shirt, topLine = shirtLine, flip = false }: { x: number; y: number; s?: number; arms: [Limb, Limb]; legs?: [Limb, Limb]; lean?: number; top?: string; topLine?: string; flip?: boolean }) {
  const sh: Pt = [lean, -62], hip: Pt = [0, -34]
  const legsP = legs ?? [[[-6, -16], [-9, 0]], [[6, -16], [9, 0]]]
  const line = (from: Pt, pts: Limb) => `M${from[0]} ${from[1]}` + pts.map(p => `L${p[0]} ${p[1]}`).join('')
  return <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    {legsP.map((l, i) => <path key={i} d={line(hip, l)} stroke={trousers} strokeWidth="8" fill="none" />)}
    {legsP.map((l, i) => <path key={`f${i}`} d={`M${l[l.length - 1][0] - 2} ${l[l.length - 1][1]}h8`} stroke="#4f5d69" strokeWidth="5" />)}
    <path d={`M${hip[0]} ${hip[1] + 2}L${sh[0]} ${sh[1]}`} stroke={topLine} strokeWidth="17" />
    <path d={`M${hip[0]} ${hip[1] + 2}L${sh[0]} ${sh[1]}`} stroke={top} strokeWidth="13.5" />
    {arms.map((a, i) => <g key={i}><path d={line([sh[0], sh[1] + 3], a)} stroke={skinLine} strokeWidth="7.5" fill="none" /><path d={line([sh[0], sh[1] + 3], a)} stroke={skin} strokeWidth="4.8" fill="none" /></g>)}
    <circle cx={lean * 1.3} cy={-76} r="11" fill={skin} stroke={skinLine} strokeWidth="1.8" />
    <path d={`M${lean * 1.3 - 11} ${-78}Q${lean * 1.3 - 9} ${-90} ${lean * 1.3 + 1} ${-88}Q${lean * 1.3 + 10} ${-87} ${lean * 1.3 + 10} ${-79}Q${lean * 1.3} ${-84} ${lean * 1.3 - 11} ${-78}Z`} fill={hair} />
  </g>
}
/** A mug; (x, y) is the middle of its base. `steam` adds rising wisps, `hot` tints the tea warm. */
export function Mug({ x, y, s = 1, steam = true, hot = true }: { x: number; y: number; s?: number; steam?: boolean; hot?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    {steam && <g stroke={P.thermalLine} strokeWidth="2" fill="none" opacity=".55">
      <path d="M-8 -50C-13 -58 -3 -62 -8 -72" /><path d="M3 -50C-2 -58 8 -62 3 -72" />
    </g>}
    <path d="M18 -34Q32 -34 32 -22Q32 -10 18 -12" stroke="#b98563" strokeWidth="5" fill="none" />
    <path d="M-20 -44H20V-8Q20 0 12 0H-12Q-20 0 -20 -8Z" fill="#f8e7da" stroke="#b98563" strokeWidth="2.2" />
    <path d="M-17 -38H17" stroke={hot ? '#a86a3c' : '#8a6443'} strokeWidth="4" />
  </g>
}
/** A thermometer: a rounded tube with a red column. `level` 0–1 sets the column; `reading` is written beside it. */
export function Thermometer({ x, y, h = 90, level = 0.5, reading, side = 'right', colour = P.hot, dim = false }: { x: number; y: number; h?: number; level?: number; reading?: string; side?: 'left' | 'right'; colour?: string; dim?: boolean }) {
  const top = y - h, colTop = r1(y - 10 - (h - 22) * level)
  return <g opacity={dim ? 0.45 : 1}>
    <rect x={x - 6} y={top} width="12" height={h} rx="6" fill="white" stroke={metalLine} strokeWidth="1.8" />
    <path d={`M${x} ${y - 4}V${colTop}`} stroke={colour} strokeWidth="4.5" />
    <circle cx={x} cy={y + 2} r="9" fill={colour} stroke={metalLine} strokeWidth="1.8" />
    {[0.25, 0.5, 0.75].map(k => <path key={k} d={`M${x + 6} ${r1(y - 10 - (h - 22) * k)}h-4`} stroke={metalLine} strokeWidth="1.2" />)}
    {reading && <text x={side === 'right' ? x + 14 : x - 14} y={colTop + 5} textAnchor={side === 'right' ? 'start' : 'end'} fontSize="14" fontWeight="700" fill={colour}>{reading}</text>}
  </g>
}
export function Flame({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0C-11 -4 -10 -17 -3 -27C-1 -18 5 -17 3 -24C11 -16 12 -4 0 0Z" fill="#f5a54a" stroke="#c8641e" strokeWidth="1.5" />
    <path d="M0 -3C-5 -7 -4 -13 0 -17C1 -12 5 -9 0 -3Z" fill="#fcd97d" />
  </g>
}
/** A shelf bracketed to a wall at the left or right; (x, y) is the middle of its top surface. */
export function Shelf({ x, y, w = 90 }: { x: number; y: number; w?: number }) {
  return <g>
    <rect x={x - w / 2} y={y} width={w} height="9" rx="3" fill={wood} stroke={woodLine} strokeWidth="1.8" />
    <path d={`M${x - w / 2 + 12} ${y + 9}l10 16M${x + w / 2 - 12} ${y + 9}l-10 16`} stroke={woodLine} strokeWidth="2.2" />
  </g>
}
/** A closed book lying flat; (x, y) is the middle of its base. */
export function Book({ x, y, fill = '#9fb8e6', line = P.gravitationalLine }: { x: number; y: number; fill?: string; line?: string }) {
  return <g>
    <rect x={x - 22} y={y - 14} width="44" height="14" rx="3" fill={fill} stroke={line} strokeWidth="1.8" />
    <path d={`M${x - 16} ${y - 4}H${x + 20}`} stroke="white" strokeWidth="3" />
  </g>
}
/** A coiled spring from `a` to `b` (drawn as soft loops). */
export function Spring({ a, b, coils = 8, width = 14, colour = P.elasticLine }: { a: Pt; b: Pt; coils?: number; width?: number; colour?: string }) {
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, nx = -uy, ny = ux
  const lead = Math.min(10, len * 0.12), body = len - 2 * lead
  let d = `M${a[0]} ${a[1]}L${r1(a[0] + ux * lead)} ${r1(a[1] + uy * lead)}`
  for (let i = 0; i < coils; i++) {
    const t0 = lead + body * i / coils, t1 = lead + body * (i + 0.5) / coils, t2 = lead + body * (i + 1) / coils
    const c1: Pt = [a[0] + ux * (t0 + (t1 - t0) * 0.1) + nx * width, a[1] + uy * (t0 + (t1 - t0) * 0.1) + ny * width]
    const c2: Pt = [a[0] + ux * (t1 + (t2 - t1) * 0.9) - nx * width, a[1] + uy * (t1 + (t2 - t1) * 0.9) - ny * width]
    d += `Q${r1(c1[0])} ${r1(c1[1])} ${r1(a[0] + ux * t1)} ${r1(a[1] + uy * t1)}Q${r1(c2[0])} ${r1(c2[1])} ${r1(a[0] + ux * t2)} ${r1(a[1] + uy * t2)}`
  }
  d += `L${b[0]} ${b[1]}`
  return <path d={d} stroke={colour} strokeWidth="2.6" fill="none" />
}
/** A mitten-shaped hand, fingers pointing along +x before rotation. */
export function Hand({ x, y, rotate = 0, s = 1 }: { x: number; y: number; rotate?: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
    <path d="M-30 -9H-16V9H-30Z" fill={shirt} stroke={shirtLine} strokeWidth="1.8" />
    <path d="M-17 -10Q-2 -14 12 -11Q21 -8 21 0Q21 8 12 10Q-2 14 -17 10Z" fill={skin} stroke={skinLine} strokeWidth="1.8" />
    <path d="M-6 -11Q2 -21 11 -17Q13 -14 5 -9" fill={skin} stroke={skinLine} strokeWidth="1.8" />
    <path d="M4 -3H16M4 3H16" stroke={skinLine} strokeWidth="1.2" opacity=".6" />
  </g>
}
/** A soft wooden crate; (x, y) is the middle of its base. */
export function Crate({ x, y, w = 56, h = 44 }: { x: number; y: number; w?: number; h?: number }) {
  return <g>
    <rect x={x - w / 2} y={y - h} width={w} height={h} rx="5" fill={wood} stroke={woodLine} strokeWidth="2" />
    <path d={`M${x - w / 2 + 6} ${y - h + 6}L${x + w / 2 - 6} ${y - 6}M${x - w / 2 + 6} ${y - 6}L${x + w / 2 - 6} ${y - h + 6}`} stroke={woodLine} strokeWidth="1.4" opacity=".55" />
  </g>
}
/** A dashed rounded boundary with a small "system" tag: what we are studying. */
export function Boundary({ x, y, w, h, label = 'system', labelAt = 'top', colour = ink }: { x: number; y: number; w: number; h: number; label?: string; labelAt?: 'top' | 'bottom'; colour?: string }) {
  const ly = labelAt === 'top' ? y : y + h
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="22" fill="none" stroke={colour} strokeWidth="2.2" strokeDasharray="8 6" />
    {label && <Tag x={x + w / 2} y={ly} text={label} colour={colour} />}
  </g>
}
/** An upright energy bar in a store's colours; `level` 0–1. */
export function StoreBar({ x, y, h = 70, w = 26, level, store }: { x: number; y: number; h?: number; w?: number; level: number; store: EnergyStore }) {
  const { fill, line } = energyStores[store], fh = r1(h * Math.max(0, Math.min(1, level)))
  return <g>
    <rect x={x - w / 2} y={y - h} width={w} height={h} rx="7" fill="white" stroke={line} strokeWidth="1.8" />
    {fh > 0 && <rect x={x - w / 2 + 3} y={r1(y - fh + 3)} width={w - 6} height={Math.max(0, fh - 6)} rx="4" fill={fill} stroke={line} strokeWidth="1" />}
  </g>
}

/* ---------- Lesson 1 pieces ---------- */

function Apple({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -20C-9 -26 -21 -20 -20 -8C-19 4 -9 12 0 7C9 12 19 4 20 -8C21 -20 9 -26 0 -20Z" fill="#f2a79a" stroke="#b9564a" strokeWidth="2" />
    <path d="M0 -20Q1 -27 4 -30" stroke={woodLine} strokeWidth="2.2" fill="none" />
    <path d="M3 -25Q12 -32 16 -24Q9 -21 3 -25Z" fill={P.plant} stroke={P.plantLine} strokeWidth="1.4" />
  </g>
}
/** A torch-style cell (the real object, not the circuit symbol). + at the top. */
function BatteryCan({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-4" y="-44" width="8" height="5" rx="1.5" fill={metal} stroke={metalLine} strokeWidth="1.5" />
    <rect x="-11" y="-40" width="22" height="40" rx="4" fill={P.chemical} stroke={P.chemicalLine} strokeWidth="2" />
    <rect x="-11" y="-40" width="22" height="12" rx="4" fill="#cbb6e6" stroke={P.chemicalLine} strokeWidth="2" />
    <text x="0" y="-15" textAnchor="middle" fontSize="13" fontWeight="800" fill={P.chemicalLine}>+</text>
  </g>
}
function FuelCan({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-15 0V-30L-6 -40H15V0Z" fill="#f3d9a6" stroke="#b07f2a" strokeWidth="2" />
    <path d="M-3 -40V-47H6V-40" fill="#e3c38a" stroke="#b07f2a" strokeWidth="1.8" />
    <path d="M-9 -24H9M-9 -14H9" stroke="#b07f2a" strokeWidth="1.5" opacity=".7" />
  </g>
}
function Charge({ x, y, sign, r = 14 }: { x: number; y: number; sign: '+' | '−'; r?: number }) {
  const plus = sign === '+'
  return <g>
    <circle cx={x} cy={y} r={r} fill={plus ? '#f8e0db' : P.electrostatic} stroke={P.electrostaticLine} strokeWidth="2" />
    <path d={plus ? `M${x - 6} ${y}H${x + 6}M${x} ${y - 6}V${y + 6}` : `M${x - 6} ${y}H${x + 6}`} stroke={P.electrostaticLine} strokeWidth="2.6" />
  </g>
}
function BarMagnet({ x, y, w = 50, flip = false }: { x: number; y: number; w?: number; flip?: boolean }) {
  const [l, r] = flip ? ['S', 'N'] : ['N', 'S']
  const col = (k: string) => k === 'N' ? '#e79a8f' : '#9fc0dd'
  return <g>
    <rect x={x - w / 2} y={y - 11} width={w / 2} height="22" rx="3" fill={col(l)} stroke={P.magneticLine} strokeWidth="1.8" />
    <rect x={x} y={y - 11} width={w / 2} height="22" rx="3" fill={col(r)} stroke={P.magneticLine} strokeWidth="1.8" />
    <text x={x - w / 4} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill={ink}>{l}</text>
    <text x={x + w / 4} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill={ink}>{r}</text>
  </g>
}
function Atom({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 60, -60].map(a => <ellipse key={a} cx="0" cy="0" rx="36" ry="12" transform={`rotate(${a})`} fill="none" stroke={metalLine} strokeWidth="1.4" opacity=".75" />)}
    <circle cx="36" cy="0" r="3.4" fill={P.charge} /><circle cx={r1(-18)} cy={r1(-31.2)} r="3.4" fill={P.charge} /><circle cx={r1(-18)} cy={r1(31.2)} r="3.4" fill={P.charge} />
    <circle r="12" fill={P.nuclear} stroke={P.nuclearLine} strokeWidth="1.6" />
    <circle cx="-3.5" cy="-2.5" r="4.4" fill={P.nuclearLine} /><circle cx="3.8" cy="-2" r="4.4" fill="white" stroke={P.nuclearLine} strokeWidth="1.4" /><circle cx="0" cy="3.8" r="4.4" fill={P.nuclearLine} />
  </g>
}
/** Two things that pull on each other: small facing arrows between them. */
function Pull({ x, y, gap = 12, colour }: { x: number; y: number; gap?: number; colour: string }) {
  return <g><Arrow from={[x - gap - 8, y]} to={[x - 3, y]} colour={colour} width={2} head={0.7} /><Arrow from={[x + gap + 8, y]} to={[x + 3, y]} colour={colour} width={2} head={0.7} /></g>
}

/* ---------- Section 2: the eight-store gallery ---------- */

type GalleryTile = { store: EnergyStore; cx: number; cy: number; label: string }
// Two rows of four tiles. The wider badges (Gravitational, Electrostatic) sit in the right-hand column.
const COLS = [72, 194, 314, 450]
const ROW = [0, 150]
const tiles: GalleryTile[] = [
  { store: 'kinetic', cx: COLS[0], cy: ROW[0], label: 'Kinetic' },
  { store: 'thermal', cx: COLS[1], cy: ROW[0], label: 'Thermal' },
  { store: 'chemical', cx: COLS[2], cy: ROW[0], label: 'Chemical' },
  { store: 'gravitational', cx: COLS[3], cy: ROW[0], label: 'Gravitational' },
  { store: 'elastic', cx: COLS[0], cy: ROW[1], label: 'Elastic' },
  { store: 'magnetic', cx: COLS[1], cy: ROW[1], label: 'Magnetic' },
  { store: 'nuclear', cx: COLS[2], cy: ROW[1], label: 'Nuclear' },
  { store: 'electrostatic', cx: COLS[3], cy: ROW[1], label: 'Electrostatic' },
]
function TileArt({ store, cx, cy }: { store: EnergyStore; cx: number; cy: number }) {
  const base = cy + 96 // the floor line of each tile
  switch (store) {
    case 'kinetic': return <g><Floor x1={cx - 52} x2={cx + 52} y={base} /><Ball x={cx + 14} y={base - 20} r={19} /><Motion x={cx - 10} y={base - 20} len={26} /></g>
    case 'thermal': return <g><Mug x={cx} y={base} s={1.05} /></g>
    case 'chemical': return <g><Apple x={cx - 36} y={base - 8} s={0.9} /><BatteryCan x={cx + 4} y={base} s={1.05} /><FuelCan x={cx + 40} y={base} s={0.95} /></g>
    case 'gravitational': return <g>
      <path d={`M${cx - 62} ${base}H${cx + 62}`} stroke={groundLine} strokeWidth="2.2" />
      <path d={`M${cx + 40} ${cy + 18}V${base}`} stroke={woodLine} strokeWidth="3" opacity=".5" />
      <Shelf x={cx + 8} y={cy + 32} w={70} />
      <Book x={cx + 8} y={cy + 32} />
      <path d={`M${cx - 40} ${base - 4}V${cy + 30}`} stroke={P.gravitationalLine} strokeWidth="1.8" strokeDasharray="4 4" />
      <path d={`M${cx - 46} ${cy + 30}h12M${cx - 46} ${base - 4}h12`} stroke={P.gravitationalLine} strokeWidth="1.8" />
      <text x={cx - 48} y={cy + 72} textAnchor="end" fontSize="12" fontWeight="700" fill={P.gravitationalLine}>high</text>
    </g>
    case 'elastic': return <g>
      <path d={`M${cx - 54} ${base - 48}V${base - 8}`} stroke={woodLine} strokeWidth="5" />
      <Spring a={[cx - 52, base - 28]} b={[cx + 18, base - 28]} coils={8} width={10} />
      <Hand x={cx + 32} y={base - 28} s={0.72} rotate={180} />
      <Arrow from={[cx + 10, base - 54]} to={[cx + 40, base - 54]} colour={P.elasticLine} width={2.2} head={0.8} />
    </g>
    case 'magnetic': return <g><BarMagnet x={cx - 30} y={base - 34} w={44} /><BarMagnet x={cx + 30} y={base - 34} w={44} /><Pull x={cx} y={base - 58} gap={4} colour={P.magneticLine} /></g>
    case 'nuclear': return <g><Atom x={cx} y={base - 36} s={1.05} /></g>
    case 'electrostatic': return <g><Charge x={cx - 34} y={base - 34} sign="+" r={16} /><Charge x={cx + 34} y={base - 34} sign="−" r={16} /><Pull x={cx} y={base - 34} gap={6} colour={P.electrostaticLine} /></g>
  }
}
const GALLERY: Record<string, { on: EnergyStore[]; met: EnergyStore[]; note?: string; title: string }> = {
  'estore-motion-heat': { on: ['kinetic', 'thermal'], met: [], note: 'hotter = more energy in the thermal store', title: 'A rolling ball has energy in its kinetic store. A mug of hot tea has energy in its thermal store; the hotter it is, the more energy the store holds.' },
  'estore-chemical': { on: ['chemical'], met: ['kinetic', 'thermal'], note: 'released by a chemical reaction', title: 'An apple, a battery and a can of fuel all have energy in a chemical store, released by chemical reactions.' },
  'estore-potential': { on: ['gravitational', 'elastic'], met: ['kinetic', 'thermal', 'chemical'], note: 'raised: gravitational potential · stretched: elastic potential', title: 'A book on a high shelf has energy in its gravitational potential store. A stretched spring has energy in its elastic potential store.' },
  'estore-fields': { on: ['magnetic', 'electrostatic'], met: ['kinetic', 'thermal', 'chemical', 'gravitational', 'elastic'], note: 'they attract or repel without touching', title: 'Two bar magnets attracting each other have energy in a magnetic store. A positive and a negative charge attracting each other have energy in an electrostatic store.' },
  'estore-nuclear': { on: ['kinetic', 'thermal', 'chemical', 'gravitational', 'elastic', 'magnetic', 'nuclear', 'electrostatic'], met: [], note: 'eight energy stores in all', title: 'An atom with its nucleus highlighted has energy in its nuclear store. All eight energy stores are shown together: kinetic, thermal, chemical, gravitational potential, elastic potential, magnetic, nuclear and electrostatic.' },
}
function Gallery({ focus }: { focus: string }) {
  const g = GALLERY[focus]
  const all = focus === 'estore-nuclear'
  return <PhysicsDiagram title={g.title} viewBox="0 0 540 330">
    {tiles.map(t => {
      const on = g.on.includes(t.store), met = g.met.includes(t.store)
      const lit = on && (!all || t.store === 'nuclear')
      return <g key={t.store} opacity={on ? 1 : met ? 0.55 : faded}>
        {lit && <rect x={t.cx - 64} y={t.cy + 4} width={128} height={138} rx="18" fill={energyStores[t.store].fill} fillOpacity=".35" stroke={energyStores[t.store].line} strokeWidth="1.4" strokeOpacity=".5" />}
        <TileArt store={t.store} cx={t.cx} cy={t.cy} />
        <EnergyStoreBadge store={t.store} x={t.cx} y={t.cy + 120} label={t.label} />
      </g>
    })}
    {g.note && <Caption text={g.note} y={318} colour={ink} />}
  </PhysicsDiagram>
}
/** First frame: the idea of a store, before any store is named. */
function StoreIdea() {
  const jar = (x: number, level: number) => <g>
    <path d={`M${x - 46} 92Q${x - 50} 80 ${x - 38} 78H${x + 38}Q${x + 50} 80 ${x + 46} 92V200Q${x + 46} 214 ${x + 32} 214H${x - 32}Q${x - 46} 214 ${x - 46} 200Z`} fill="white" stroke={ink} strokeWidth="2.4" />
    <path d={`M${x - 42} ${r1(210 - 120 * level)}Q${x} ${r1(204 - 120 * level)} ${x + 42} ${r1(210 - 120 * level)}V200Q${x + 42} 210 ${x + 30} 210H${x - 30}Q${x - 42} 210 ${x - 42} 200Z`} fill="#f6dfa5" stroke="#c98f2c" strokeWidth="1.6" />
    <text x={x} y={240} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>energy store</text>
  </g>
  return <PhysicsDiagram title="Two energy stores drawn as jars. Energy is kept in stores; an arrow shows energy moving from one store to the other. None of it is used up.">
    {jar(130, 0.7)}
    {jar(410, 0.3)}
    <TransferArrow from={[190, 120]} to={[350, 120]} bend={-0.18} colour="#c98f2c" width={4} label="energy moves" labelColour={ink} />
    <text x={270} y={200} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>from one store</text>
    <text x={270} y={218} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>to another</text>
    <Caption text="Energy is kept in stores. It is not used up: it moves." y={282} />
  </PhysicsDiagram>
}

/* ---------- Section 3: store → way → store ---------- */

/** A labelled store under an object: the badge, then the object's name in small grey text. */
function Owned({ store, x, y, owner, label }: { store: EnergyStore; x: number; y: number; owner: string; label?: string }) {
  return <g><EnergyStoreBadge store={store} x={x} y={y} label={label} /><text x={x} y={y + 30} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>{owner}</text></g>
}
function Panel({ x, w, title, children }: { x: number; w: number; title: string; children?: ReactNode }) {
  return <g>
    <rect x={x} y={8} width={w} height={284} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <text x={x + w / 2} y={34} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{title}</text>
    {children}
  </g>
}
function Block({ x, y, w = 60, h = 44, hot }: { x: number; y: number; w?: number; h?: number; hot: boolean }) {
  return <g>
    <rect x={x - w / 2} y={y - h} width={w} height={h} rx="8" fill={hot ? P.hotFill : P.coldFill} stroke={hot ? P.hot : P.cold} strokeWidth="2.2" />
    <text x={x} y={y - h / 2 + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill={hot ? P.hot : P.cold}>{hot ? 'hot' : 'cold'}</text>
  </g>
}
function Sun({ x, y, r = 20 }: { x: number; y: number; r?: number }) {
  return <g>
    {Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5; return <path key={i} d={`M${r1(x + Math.cos(a) * (r + 5))} ${r1(y + Math.sin(a) * (r + 5))}L${r1(x + Math.cos(a) * (r + 12))} ${r1(y + Math.sin(a) * (r + 12))}`} stroke={P.lightLine} strokeWidth="2.4" /> })}
    <circle cx={x} cy={y} r={r} fill={P.light} stroke={P.lightLine} strokeWidth="2" />
  </g>
}
function Earth({ x, y, r = 18 }: { x: number; y: number; r?: number }) {
  return <g>
    <circle cx={x} cy={y} r={r} fill={P.water} stroke={P.waterLine} strokeWidth="2" />
    <path d={`M${x - 10} ${y - 10}Q${x - 2} ${y - 14} ${x + 2} ${y - 6}Q${x - 4} ${y} ${x - 12} ${y - 2}Z M${x + 2} ${y + 4}Q${x + 12} ${y + 2} ${x + 12} ${y + 10}Q${x + 4} ${y + 14} ${x} ${y + 10}Z`} fill={P.plant} stroke={P.plantLine} strokeWidth="1.2" />
  </g>
}
function Speaker({ x, y }: { x: number; y: number }) {
  return <g>
    <rect x={x - 18} y={y - 26} width="30" height="52" rx="6" fill="#e6e9ee" stroke="#5a6b79" strokeWidth="2" />
    <circle cx={x - 3} cy={y + 8} r="10" fill="white" stroke="#5a6b79" strokeWidth="1.8" /><circle cx={x - 3} cy={y + 8} r="3.5" fill="#5a6b79" />
    <circle cx={x - 3} cy={y - 13} r="5" fill="white" stroke="#5a6b79" strokeWidth="1.6" />
  </g>
}
function Ear({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x + 8} ${y + 22}Q${x - 14} ${y + 24} ${x - 12} ${y}Q${x - 12} ${y - 22} ${x + 6} ${y - 22}Q${x + 20} ${y - 22} ${x + 18} ${y - 6}Q${x + 16} ${y + 4} ${x + 8} ${y + 6}Q${x + 2} ${y + 10} ${x + 8} ${y + 22}Z`} fill={skin} stroke={skinLine} strokeWidth="2" />
    <path d={`M${x + 8} ${y - 12}Q${x - 4} ${y - 12} ${x - 2} ${y}Q${x} ${y + 6} ${x + 4} ${y + 4}`} stroke={skinLine} strokeWidth="1.6" fill="none" />
  </g>
}
function Waves({ x, y, colour, n = 3 }: { x: number; y: number; colour: string; n?: number }) {
  return <g stroke={colour} strokeWidth="2.2" fill="none">{Array.from({ length: n }, (_, i) => <path key={i} d={`M${x + i * 11} ${y - 10 - i * 3}Q${x + 7 + i * 11} ${y} ${x + i * 11} ${y + 10 + i * 3}`} />)}</g>
}
function ToyCar({ x, y }: { x: number; y: number }) {
  return <g>
    <Car x={x} y={y} s={1.15} fill="#f7c9a3" line={P.kineticLine} />
    <g transform={`translate(${x - 10} ${y - 32})`}>
      <rect x="-15" y="-9" width="30" height="18" rx="3" fill={P.chemical} stroke={P.chemicalLine} strokeWidth="1.8" />
      <rect x="15" y="-4" width="4" height="8" rx="1" fill={P.chemicalLine} />
      <text x="0" y="5" textAnchor="middle" fontSize="12" fontWeight="800" fill={P.chemicalLine}>+ −</text>
    </g>
  </g>
}
function Transfers({ focus }: { focus: string }) {
  if (focus === 'estore-transfer') return <PhysicsDiagram title="A hot mug of tea held in two cold hands. Energy is transferred by heating from the thermal store of the mug to the thermal store of the hands.">
    <Mug x={270} y={150} s={1.5} />
    <Hand x={216} y={112} s={1.1} />
    <Hand x={322} y={120} s={1.1} rotate={180} />
    <Leader from={[140, 186]} to={[252, 124]} colour={P.thermalLine} />
    <Leader from={[400, 186]} to={[330, 122]} colour={P.thermalLine} />
    <Owned store="thermal" x={120} y={206} owner="the mug" />
    <Owned store="thermal" x={420} y={206} owner="your hands" />
    <TransferArrow from={[180, 214]} to={[362, 214]} bend={0.12} colour={P.hot} width={4} label="by heating" />
    <Caption text="from the thermal store of the mug to the thermal store of your hands" y={284} size={13} />
  </PhysicsDiagram>
  if (focus === 'estore-heat-radiation') return <PhysicsDiagram title="Two panels. By heating: energy moves from a hot block to a cold block. By radiation: light carries energy from the Sun to the Earth, and sound carries energy from a speaker to an ear.">
    <Panel x={6} w={234} title="By heating">
      <Block x={62} y={180} hot />
      <Block x={184} y={180} hot={false} />
      <TransferArrow from={[96, 130]} to={[150, 130]} bend={-0.35} colour={P.hot} width={4} />
      <text x={123} y={92} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.hot}>hot → cold</text>
      <Caption text="hotter object to colder object" x={123} y={236} size={13} />
    </Panel>
    <Panel x={252} w={282} title="By radiation">
      <Sun x={298} y={92} />
      <Earth x={486} y={96} />
      <Arrow from={[330, 84]} to={[462, 88]} colour={P.lightLine} width={2.4} head={0.8} />
      <Arrow from={[330, 102]} to={[462, 102]} colour={P.lightLine} width={2.4} head={0.8} />
      <text x={394} y={76} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.lightLine}>light</text>
      <Speaker x={300} y={200} />
      <Waves x={322} y={200} colour="#5a6b79" />
      <Arrow from={[364, 200]} to={[444, 200]} colour="#5a6b79" width={2.4} head={0.8} />
      <text x={402} y={186} textAnchor="middle" fontSize="13" fontWeight="700" fill="#5a6b79">sound</text>
      <Ear x={478} y={200} />
      <Caption text="light and sound carry energy" x={393} y={266} size={13} />
    </Panel>
  </PhysicsDiagram>
  if (focus === 'estore-mech-elec') return <PhysicsDiagram title="Two panels. Mechanically: a person pushes a box along the floor; a force moves the box. Electrically: a cell and a lamp in a closed loop; a current flows and the lamp lights.">
    <Panel x={6} w={260} title="Mechanically">
      <Floor x1={20} x2={252} y={214} />
      <Person x={92} y={214} lean={10} arms={[[[20, -52], [36, -46]], [[18, -58], [36, -54]]]} legs={[[[-8, -16], [-22, 0]], [[6, -18], [8, 0]]]} />
      <Crate x={162} y={214} w={60} h={54} />
      <Arrow from={[140, 132]} to={[196, 132]} colour={ink} width={3} />
      <text x={168} y={120} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>force</text>
      <Arrow from={[132, 238]} to={[212, 238]} colour={P.kineticLine} width={3} />
      <text x={172} y={264} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.kineticLine}>the box moves</text>
    </Panel>
    <Panel x={274} w={260} title="Electrically">
      <Wire points={[[344, 90], [320, 90], [320, 220], [464, 220], [464, 90], [424, 90]]} />
      <Cell x={384} y={90} length={80} signs />
      <Lamp x={392} y={220} length={80} lit />
      <CurrentArrow x={320} y={160} rotate={90} />
      <CurrentArrow x={464} y={150} rotate={-90} />
      <text x={404} y={160} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.current}>current flows</text>
      <text x={404} y={264} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>cell and lamp</text>
    </Panel>
  </PhysicsDiagram>
  // estore-describe
  return <PhysicsDiagram title="A battery-powered toy car speeding up. Energy is transferred electrically from the chemical store of the battery to the kinetic store of the car.">
    <Floor x1={140} x2={400} y={140} />
    <ToyCar x={270} y={140} />
    <Motion x={196} y={110} len={28} />
    <Leader from={[150, 174]} to={[252, 110]} colour={P.chemicalLine} />
    <Leader from={[392, 174]} to={[306, 118]} colour={P.kineticLine} />
    <Owned store="chemical" x={120} y={190} owner="the battery" />
    <Owned store="kinetic" x={420} y={190} owner="the car" />
    <TransferArrow from={[186, 196]} to={[366, 196]} bend={0.08} colour={P.current} width={4} label="electrically" />
    <rect x={30} y={240} width={480} height={52} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <Eq x={270} y={261} size={15} pieces={[['energy is transferred '], ['electrically', P.current]]} />
    <Eq x={270} y={282} size={15} pieces={[['from the '], ['chemical', P.chemicalLine], [' store to the '], ['kinetic', P.kineticLine], [' store']]} />
  </PhysicsDiagram>
}

/* ---------- Section 4: systems ---------- */

function Racket({ x, y, rotate = -30 }: { x: number; y: number; rotate?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    <path d="M0 26V70" stroke={woodLine} strokeWidth="7" />
    <ellipse cx="0" cy="0" rx="22" ry="28" fill="#fbf6ee" stroke="#5a6b79" strokeWidth="3" />
    <path d="M-11 -24V24M0 -28V28M11 -24V24M-20 -12H20M-22 0H22M-20 12H20" stroke="#b3bcc5" strokeWidth="1" />
  </g>
}
function TennisBall({ x, y, r = 13 }: { x: number; y: number; r?: number }) {
  return <g>
    <circle cx={x} cy={y} r={r} fill="#e3ef8f" stroke="#8a9a2c" strokeWidth="2" />
    <path d={`M${x - r * 0.9} ${y - r * 0.3}Q${x} ${y + r * 0.2} ${x + r * 0.3} ${y - r * 0.9}M${x - r * 0.3} ${y + r * 0.9}Q${x} ${y} ${x + r * 0.9} ${y + r * 0.3}`} stroke="#8a9a2c" strokeWidth="1.4" fill="none" />
  </g>
}
function Bath({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 90} ${y - 60}H${x + 90}V${y - 30}Q${x + 90} ${y} ${x + 60} ${y}H${x - 60}Q${x - 90} ${y} ${x - 90} ${y - 30}Z`} fill="white" stroke={metalLine} strokeWidth="2.4" />
    <path d={`M${x - 84} ${y - 48}H${x + 84}V${y - 30}Q${x + 84} ${y - 6} ${x + 58} ${y - 6}H${x - 58}Q${x - 84} ${y - 6} ${x - 84} ${y - 30}Z`} fill={P.hotFill} stroke={P.hot} strokeWidth="1.4" />
    <path d={`M${x - 70} ${y}v12M${x + 70} ${y}v12`} stroke={metalLine} strokeWidth="4" />
    <path d={`M${x + 78} ${y - 60}V${y - 84}H${x + 62}`} stroke={metalLine} strokeWidth="3.4" fill="none" />
    <g stroke={P.thermalLine} strokeWidth="2" fill="none" opacity=".5"><path d={`M${x - 40} ${y - 66}c-5 -8 5 -12 0 -20`} /><path d={`M${x - 10} ${y - 66}c-5 -8 5 -12 0 -20`} /><path d={`M${x + 20} ${y - 66}c-5 -8 5 -12 0 -20`} /></g>
  </g>
}
function Padlock({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-9 -6V-14Q-9 -24 0 -24Q9 -24 9 -14V-6" stroke="#5a6b79" strokeWidth="3.2" fill="none" />
    <rect x="-14" y="-7" width="28" height="22" rx="4" fill="#f3d9a6" stroke="#9c7a3a" strokeWidth="2" />
    <circle cx="0" cy="2" r="3" fill="#9c7a3a" /><path d="M0 4v5" stroke="#9c7a3a" strokeWidth="2.4" />
  </g>
}
/** An arrow that reaches a boundary and is stopped there: the arrowhead meets a cross on the line. */
function Stop({ from, at, colour }: { from: Pt; at: Pt; colour: string }) {
  const dx = Math.sign(at[0] - from[0]), dy = Math.sign(at[1] - from[1])
  return <g>
    <Arrow from={from} to={[at[0] - dx * 14, at[1] - dy * 14]} colour={colour} width={3} />
    <CrossMark x={at[0]} y={at[1]} s={0.85} />
  </g>
}
function Systems({ focus }: { focus: string }) {
  if (focus === 'estore-system') return <PhysicsDiagram title="Two systems, each inside a dashed boundary. Left: one object, a tennis ball. Right: a group of objects, a racket and a ball.">
    <Boundary x={40} y={46} w={180} h={190} />
    <TennisBall x={130} y={146} r={22} />
    <text x={130} y={262} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>one object</text>
    <Boundary x={290} y={46} w={214} h={190} />
    <Racket x={370} y={126} rotate={-28} />
    <TennisBall x={450} y={110} r={16} />
    <Motion x={432} y={110} dir={1} colour={metalLine} n={2} len={16} />
    <text x={397} y={262} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>a group of objects</text>
  </PhysicsDiagram>
  if (focus === 'estore-change') return <PhysicsDiagram title="A bath of hot water in a room is the system, inside a dashed boundary. As it cools, energy is transferred by heating from the thermal store of the water to the thermal store of the room.">
    <rect x={8} y={8} width={524} height={284} rx="16" fill="#fbf8f2" stroke="#e5dccb" strokeWidth="1.5" />
    <path d="M8 218H532" stroke="#d9ccb4" strokeWidth="2" />
    <text x={500} y={36} textAnchor="end" fontSize="13" fontWeight="700" fill={muted}>the room</text>
    <Boundary x={40} y={62} w={244} h={168} />
    <Bath x={162} y={206} />
    <EnergyStoreBadge store="thermal" x={162} y={262} label="Thermal: water" />
    <EnergyStoreBadge store="thermal" x={430} y={170} label="Thermal: room" />
    <TransferArrow from={[250, 130]} to={[400, 150]} bend={-0.25} colour={P.hot} width={4} label="by heating" />
    <g stroke={P.hot} strokeWidth="1.8" opacity=".4" fill="none"><path d="M300 200q10 -6 20 0t20 0" /><path d="M350 90q10 -6 20 0t20 0" /></g>
  </PhysicsDiagram>
  if (focus === 'estore-closed') return <PhysicsDiagram title="A closed system drawn as a dashed box with a padlock. Arrows for matter and for energy, going in and coming out, are all stopped at the boundary: nothing can enter or leave.">
    <Boundary x={170} y={52} w={200} h={190} label="closed system" />
    <Padlock x={270} y={152} s={1.6} />
    <Stop from={[62, 112]} at={[170, 112]} colour={P.waterLine} />
    <text x={100} y={98} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.waterLine}>matter in</text>
    <Stop from={[226, 192]} at={[170, 192]} colour={P.waterLine} />
    <text x={100} y={186} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.waterLine}>matter out</text>
    <Stop from={[478, 112]} at={[370, 112]} colour={P.kineticLine} />
    <text x={440} y={98} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.kineticLine}>energy in</text>
    <Stop from={[314, 192]} at={[370, 192]} colour={P.kineticLine} />
    <text x={440} y={186} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.kineticLine}>energy out</text>
    <Caption text="Nothing gets in and nothing gets out." y={282} />
  </PhysicsDiagram>
  // estore-closed-blocks
  return <PhysicsDiagram title="A sealed, insulated box holds a hot block and a cold block. Energy is transferred by heating from the hot block to the cold block. The total energy in the box is the same before and after.">
    <rect x={24} y={64} width={276} height={176} rx="22" fill="#eef1f4" stroke={metalLine} strokeWidth="2.4" />
    <rect x={44} y={84} width={236} height={136} rx="14" fill="white" stroke={metalLine} strokeWidth="1.6" />
    <Tag x={162} y={64} text="sealed, insulated box" colour={ink} />
    <Block x={100} y={200} w={70} h={52} hot />
    <Block x={224} y={200} w={70} h={52} hot={false} />
    <TransferArrow from={[112, 136]} to={[212, 136]} bend={-0.3} colour={P.hot} width={4} label="by heating" />
    <rect x={330} y={64} width={186} height={176} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <text x={423} y={90} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>total energy</text>
    <StoreBar x={386} y={206} h={90} w={34} level={0.8} store="thermal" />
    <StoreBar x={460} y={206} h={90} w={34} level={0.8} store="thermal" />
    <text x={423} y={168} textAnchor="middle" fontSize="20" fontWeight="800" fill={ink}>=</text>
    <text x={386} y={226} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>before</text>
    <text x={460} y={226} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>after</text>
    <Caption text="Energy moves inside the box, but the total stays the same." y={276} />
  </PhysicsDiagram>
}

/* ---------- Question: four numbered objects (assessment view has no store names anyway) ---------- */

function Skateboard({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 44} ${y - 20}Q${x - 50} ${y - 28} ${x - 42} ${y - 26}H${x + 42}Q${x + 50} ${y - 28} ${x + 44} ${y - 20}Q${x + 40} ${y - 16} ${x + 34} ${y - 16}H${x - 34}Q${x - 40} ${y - 16} ${x - 44} ${y - 20}Z`} fill="#f2b98f" stroke="#a5634a" strokeWidth="2" />
    {[-28, 28].map(dx => <circle key={dx} cx={x + dx} cy={y - 8} r="7" fill="#4f5d69" stroke="#33404b" strokeWidth="1.5" />)}
  </g>
}
function Bucket({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 20} ${y - 34}L${x - 15} ${y}H${x + 15}L${x + 20} ${y - 34}Z`} fill="#cfe0ea" stroke="#56738a" strokeWidth="2" />
    <path d={`M${x - 20} ${y - 34}Q${x} ${y - 58} ${x + 20} ${y - 34}`} stroke="#56738a" strokeWidth="2" fill="none" />
  </g>
}
function QuestionObjects() {
  const cells: Array<{ n: number; x: number; y: number; art: ReactNode }> = [
    { n: 1, x: 12, y: 8, art: <g>
      <path d="M30 26H240" stroke={woodLine} strokeWidth="6" />
      <path d="M160 29V50" stroke="#8a6443" strokeWidth="2.4" />
      <path d="M156 50Q160 56 164 50" stroke={metalLine} strokeWidth="2.4" fill="none" />
      <Bucket x={160} y={96} />
      <path d="M40 138H250" stroke={groundLine} strokeWidth="2.2" />
    </g> },
    { n: 2, x: 276, y: 8, art: <g><Floor x1={300} x2={520} y={138} /><Skateboard x={420} y={138} /><Motion x={362} y={120} len={26} colour={metalLine} /></g> },
    { n: 3, x: 12, y: 156, art: <g>
      <path d="M40 282H250" stroke={groundLine} strokeWidth="2.2" />
      <Spring a={[140, 282]} b={[140, 232]} coils={7} width={16} />
      <rect x={116} y={224} width={48} height={8} rx="3" fill={metal} stroke={metalLine} strokeWidth="1.8" />
      <Hand x={140} y={210} rotate={90} s={1} />
      <Arrow from={[190, 204]} to={[190, 240]} colour={ink} width={2.4} head={0.8} />
    </g> },
    { n: 4, x: 276, y: 156, art: <g><path d="M320 282H500" stroke={groundLine} strokeWidth="2.2" /><Mug x={410} y={280} s={1.25} /></g> },
  ]
  return <PhysicsDiagram title="Four numbered objects: a raised bucket, a rolling skateboard, a squashed spring and a hot cup.">
    {cells.map(c => <g key={c.n}>
      <rect x={c.x} y={c.y} width={252} height={140} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.4" />
      {c.art}
      <Num n={c.n} x={c.x + 22} y={c.y + 22} />
    </g>)}
  </PhysicsDiagram>
}

export function EnergyStoreVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  if (focus === 'estore-idea') return <StoreIdea />
  if (focus in GALLERY) return <Gallery focus={focus} />
  if (['estore-transfer', 'estore-heat-radiation', 'estore-mech-elec', 'estore-describe'].includes(focus)) return <Transfers focus={focus} />
  if (['estore-system', 'estore-change', 'estore-closed', 'estore-closed-blocks'].includes(focus)) return <Systems focus={focus} />
  if (focus === 'estore-q-objects') return <QuestionObjects />
  return null
}

// Re-exported so the other Energy lessons can import everything they draw with from one place.
export { Lines, Leader, StoreIcon }
