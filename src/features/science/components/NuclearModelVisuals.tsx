import { useId } from 'react'
import { physicsPalette, PhysicsDiagram, Lines, Leader, type Pt } from './PhysicsKit'
import { atomPalette, Electron, Nucleus } from './AtomVisuals'

/*
 * Physics Lesson 31: Developing the model of the atom. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'nucmodel-' and is routed from CellBiologyVisuals.tsx.
 *
 * This file also holds the small pieces the other atomic-structure lessons (P4) draw with, so the chapter reads as
 * one set. Particle colours are the Chemistry ones (AtomVisuals.tsx): proton coral "+", neutron grey, electron blue "−".
 * One colour per idea across P4:
 *   alpha = coral (it is 2 protons and 2 neutrons), beta = electron blue, gamma = green wave,
 *   EM radiation absorbed or released by electrons = amber wave (light),
 *   mass numbers = violet, atomic numbers = coral (the number of protons),
 *   gold foil = soft gold, the solid-sphere model = slate, the plum pudding = pale coral.
 */
const P = physicsPalette
const A = atomPalette
export const nuc = {
  ink: P.ink, muted: P.muted, faded: 0.3,
  proton: A.protonFill, protonLine: A.protonLine, neutron: A.neutronFill, neutronLine: A.neutronLine,
  electron: A.electronFill, electronLine: A.electronLine, space: A.space, spaceLine: A.spaceLine, glow: A.glow, levelLine: A.shellLine,
  alpha: '#c2584d', alphaFill: '#fbe1dc',
  beta: A.electronLine, betaFill: '#dcecf8',
  gamma: '#3c9563', gammaFill: '#dcefe3',
  em: P.lightLine, emFill: P.light,
  mass: '#6d52b3', massFill: '#ece6f7',
  atomic: A.protonLine, atomicFill: '#fbe3df',
  gold: '#f5e3a0', goldLine: '#bf962a',
  lead: '#aab4bd', leadLine: '#66737f',
  sphere: '#cfdde8', sphereLine: '#5f7f96',
  pudding: '#fbdcd6', puddingLine: A.protonLine,
  good: P.useful, bad: P.wasted,
}
const { ink, muted } = nuc
export const r1 = (n: number) => Math.round(n * 10) / 10

/* ---------- Shared P4 pieces ---------- */

function headPath(tip: Pt, angle: number, size: number) {
  const back = (d: number, s: number): Pt => [r1(tip[0] - Math.cos(angle) * d + Math.cos(angle + Math.PI / 2) * s), r1(tip[1] - Math.sin(angle) * d + Math.sin(angle + Math.PI / 2) * s)]
  const [a, b, notch] = [back(size, size * .55), back(size, -size * .55), back(size * .72, 0)]
  return { d: `M${r1(tip[0])} ${r1(tip[1])}L${a[0]} ${a[1]}L${notch[0]} ${notch[1]}L${b[0]} ${b[1]}Z`, base: notch }
}
/** A straight arrow; `via` bends it into a soft curve. */
export function Arrow({ from, to, via, colour = ink, width = 2.6, dashed = false, head = true }: { from: Pt; to: Pt; via?: Pt; colour?: string; width?: number; dashed?: boolean; head?: boolean }) {
  const c = via ?? from
  const { d, base } = headPath(to, Math.atan2(to[1] - c[1], to[0] - c[0]), 7 + width * 1.5)
  const end = head ? base : to
  const line = via ? `M${from[0]} ${from[1]}Q${via[0]} ${via[1]} ${end[0]} ${end[1]}` : `M${from[0]} ${from[1]}L${end[0]} ${end[1]}`
  return <g><path d={line} stroke={colour} strokeWidth={width} fill="none" strokeDasharray={dashed ? '6 6' : undefined} />{head && <path d={d} fill={colour} stroke={colour} strokeWidth="1.2" />}</g>
}
/** A wavy arrow: electromagnetic radiation (gamma green, or amber for light absorbed or released by electrons). */
export function WavyArrow({ from, to, colour = nuc.em, waves = 3.5, amp = 7, width = 2.8, head = true }: { from: Pt; to: Pt; colour?: string; waves?: number; amp?: number; width?: number; head?: boolean }) {
  const dx = to[0] - from[0], dy = to[1] - from[1], len = Math.hypot(dx, dy) || 1, ang = Math.atan2(dy, dx)
  const hs = 8 + width * 1.5, run = head ? len - hs * .8 : len
  const ux = dx / len, uy = dy / len, nx = -uy, ny = ux
  const pts: string[] = []
  for (let i = 0; i <= 64; i++) {
    const t = i / 64 * run, taper = Math.min(1, (run - t) / 14 + .15, t / 10 + .2), off = Math.sin(t / run * waves * 2 * Math.PI) * amp * taper
    pts.push(`${i ? 'L' : 'M'}${r1(from[0] + ux * t + nx * off)} ${r1(from[1] + uy * t + ny * off)}`)
  }
  const { d } = headPath(to, ang, hs)
  return <g><path d={pts.join('')} stroke={colour} strokeWidth={width} fill="none" />{head && <path d={d} fill={colour} stroke={colour} strokeWidth="1.2" />}</g>
}
/** A rounded chip with a short phrase, centred on (x, y). */
export function Chip({ x, y, text, colour = ink, fill = 'white', size = 13, w }: { x: number; y: number; text: string; colour?: string; fill?: string; size?: number; w?: number }) {
  const width = w ?? Math.round(text.length * size * .62 + 28)
  return <g><rect x={r1(x - width / 2)} y={y - 15} width={width} height={30} rx="15" fill={fill} stroke={colour} strokeWidth="1.8" /><text x={x} y={y + size * .36} textAnchor="middle" fontSize={size} fontWeight="700" fill={colour}>{text}</text></g>
}
/** A label with a leader line to the thing it names. */
export function Callout({ at, to, lines, anchor = 'start', colour = ink, size = 14, weight = 700 }: { at: Pt; to: Pt; lines: string[]; anchor?: 'start' | 'middle' | 'end'; colour?: string; size?: number; weight?: number }) {
  const s = Math.max(12, size), h = (lines.length - 1) * (s + 3)
  const from: Pt = anchor === 'middle' ? [at[0], r1(to[1] > at[1] ? at[1] + h + 7 : at[1] - s - 4)] : [anchor === 'start' ? at[0] - 6 : at[0] + 6, r1(at[1] - s * .35 + h / 2)]
  return <g><Leader from={from} to={to} colour={colour} /><Lines x={at[0]} y={at[1]} lines={lines} anchor={anchor} size={s} weight={weight} colour={colour} /></g>
}
/** An alpha particle: 2 protons and 2 neutrons in a tight cluster. */
export function AlphaParticle({ x, y, r = 7, signs = true }: { x: number; y: number; r?: number; signs?: boolean }) {
  const d = r * .78
  const spots: [number, number, boolean][] = [[-d, -d, true], [d, -d, false], [-d, d, false], [d, d, true]]
  return <g>{spots.map(([dx, dy, p], i) => <g key={i}>
    <circle cx={r1(x + dx)} cy={r1(y + dy)} r={r} fill={p ? nuc.proton : nuc.neutron} stroke={p ? nuc.protonLine : nuc.neutronLine} strokeWidth="1.4" />
    {p && signs && r >= 7 && <text x={r1(x + dx)} y={r1(y + dy + r * .5)} textAnchor="middle" fontSize="12" fontWeight="700" fill="white">+</text>}
  </g>)}</g>
}
/** A beta particle: a fast electron with speed lines behind it (moving to the right unless `angle` says otherwise, in degrees). */
export function BetaParticle({ x, y, r = 8, angle = 0 }: { x: number; y: number; r?: number; angle?: number }) {
  return <g>
    <path transform={`rotate(${angle} ${x} ${y})`} d={`M${x - r - 6} ${y - 5}H${x - r - 22}M${x - r - 4} ${y}H${x - r - 28}M${x - r - 6} ${y + 5}H${x - r - 20}`} stroke={nuc.beta} strokeWidth="2" opacity=".55" />
    <Electron x={x} y={y} r={r} sign={r >= 7} />
  </g>
}
/** A single neutron. */
export function NeutronDot({ x, y, r = 9 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill={nuc.neutron} stroke={nuc.neutronLine} strokeWidth="1.5" />
}
/** The radiation warning symbol. */
export function Trefoil({ x, y, r = 12, colour = '#3a3a2a', back = '#fbe28a' }: { x: number; y: number; r?: number; colour?: string; back?: string }) {
  const blade = (a: number) => {
    const a1 = (a - 30) * Math.PI / 180, a2 = (a + 30) * Math.PI / 180, ri = r * .3
    return `M${r1(x + Math.cos(a1) * ri)} ${r1(y + Math.sin(a1) * ri)}L${r1(x + Math.cos(a1) * r)} ${r1(y + Math.sin(a1) * r)}A${r} ${r} 0 0 1 ${r1(x + Math.cos(a2) * r)} ${r1(y + Math.sin(a2) * r)}L${r1(x + Math.cos(a2) * ri)} ${r1(y + Math.sin(a2) * ri)}A${ri} ${ri} 0 0 0 ${r1(x + Math.cos(a1) * ri)} ${r1(y + Math.sin(a1) * ri)}Z`
  }
  return <g><circle cx={x} cy={y} r={r * 1.3} fill={back} stroke="#c3930f" strokeWidth="1.2" /><g fill={colour}>{[-90, 30, 150].map(a => <path key={a} d={blade(a)} />)}<circle cx={x} cy={y} r={r * .18} /></g></g>
}
/** A nucleus that is unstable: a wobbly glow round the cluster. */
export function UnstableGlow({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const pts = Array.from({ length: 28 }, (_, i) => {
    const a = i / 28 * 2 * Math.PI, rr = r * (i % 2 ? .9 : 1.06)
    return `${i ? 'L' : 'M'}${r1(cx + Math.cos(a) * rr)} ${r1(cy + Math.sin(a) * rr)}`
  }).join('') + 'Z'
  return <path d={pts} fill="#fde2c8" stroke="#e39a5b" strokeWidth="1.6" strokeDasharray="4 3" />
}
export function Tick({ x, y, s = 1, colour = nuc.good }: { x: number; y: number; s?: number; colour?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><circle r="12" fill="white" stroke={colour} strokeWidth="2" /><path d="M-5.5 0.5L-1.5 4.5L6 -4" stroke={colour} strokeWidth="2.8" fill="none" /></g>
}
export function Cross({ x, y, s = 1, colour = nuc.bad }: { x: number; y: number; s?: number; colour?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><circle r="12" fill="white" stroke={colour} strokeWidth="2" /><path d="M-4.5 -4.5L4.5 4.5M4.5 -4.5L-4.5 4.5" stroke={colour} strokeWidth="2.8" /></g>
}
/** A row of numbered step pills; `current` is highlighted, earlier ones ticked, later ones faded. */
export function StepStrip({ steps, current, x, y, gap = 8, w = 128 }: { steps: string[]; current: number; x: number; y: number; gap?: number; w?: number }) {
  return <g>{steps.map((s, i) => {
    const on = i === current, done = i < current, left = x + i * (w + gap)
    return <g key={s} opacity={i > current ? .45 : 1}>
      <rect x={left} y={y} width={w} height={30} rx="15" fill={on ? '#fff4e6' : 'white'} stroke={on ? '#e0a45c' : P.panelLine} strokeWidth={on ? 2 : 1.5} />
      <circle cx={left + 16} cy={y + 15} r="10" fill={on ? '#e0a45c' : done ? nuc.good : 'white'} stroke={on ? '#e0a45c' : done ? nuc.good : muted} strokeWidth="1.5" />
      <text x={left + 16} y={y + 19.5} textAnchor="middle" fontSize="12" fontWeight="700" fill={on || done ? 'white' : muted}>{i + 1}</text>
      <text x={left + 32} y={y + 20} fontSize="13" fontWeight={on ? 750 : 600} fill={on ? ink : muted}>{s}</text>
    </g>
  })}</g>
}

/**
 * A nuclear symbol, mass number over atomic number to the left of the element symbol.
 * (x, y): left edge and the symbol's baseline. A value of null leaves a gap; '?' draws a dashed box with a question mark.
 */
export type NumVal = number | string | null
export function nuclideWidth({ A: a, Z: z, sym, size = 40 }: { A: NumVal; Z: NumVal; sym: string; size?: number }) {
  const n = size * .5, digits = Math.max(String(a ?? '00').length, String(z ?? '00').length, 1)
  return r1(digits * n * .62 + 4 + symWidth(sym, size))
}
const symWidth = (sym: string, size: number) => [...sym].reduce((w, ch) => w + size * (/[MW]/.test(ch) ? .9 : /[A-Z]/.test(ch) ? .72 : .6), 0)
export function Nuclide({ x, y, A: a, Z: z, sym, size = 40, symColour = ink, aColour = nuc.mass, zColour = nuc.atomic, dimA = false, dimZ = false, ringA = false, ringZ = false }: {
  x: number; y: number; A: NumVal; Z: NumVal; sym: string; size?: number; symColour?: string; aColour?: string; zColour?: string; dimA?: boolean; dimZ?: boolean; ringA?: boolean; ringZ?: boolean
}) {
  const n = size * .5, digits = Math.max(String(a ?? '00').length, String(z ?? '00').length, 1), numW = digits * n * .62
  const nx = x + numW, sx = x + numW + 4
  const topY = r1(y - size * .38), botY = r1(y + size * .2)
  const num = (v: NumVal, yy: number, colour: string, dim: boolean, ring: boolean) => {
    if (v === null) return null
    if (v === '?') return <g><rect x={r1(nx - numW)} y={r1(yy - n * .82)} width={r1(numW + 1)} height={r1(n * 1.05)} rx="4" fill="#fff8e8" stroke="#e0a45c" strokeWidth="1.6" strokeDasharray="4 3" /><text x={r1(nx - numW / 2)} y={yy} textAnchor="middle" fontSize={n} fontWeight="750" fill="#c77a1c">?</text></g>
    return <g opacity={dim ? .3 : 1}>
      {ring && <rect x={r1(nx - String(v).length * n * .62 - 6)} y={r1(yy - n * .86)} width={r1(String(v).length * n * .62 + 12)} height={r1(n * 1.12)} rx={r1(n * .5)} fill="none" stroke={colour} strokeWidth="1.8" />}
      <text x={r1(nx)} y={yy} textAnchor="end" fontSize={n} fontWeight="750" fill={colour}>{String(v).replace('-', '−')}</text>
    </g>
  }
  return <g>
    {num(a, topY, aColour, dimA, ringA)}
    {num(z, botY, zColour, dimZ, ringZ)}
    <text x={r1(sx)} y={y} fontSize={size} fontWeight="750" fill={symColour}>{sym}</text>
  </g>
}

/* ---------- Lesson 31 drawings ---------- */

function SolidBall({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const id = useId()
  return <g>
    <defs><radialGradient id={id} cx="38%" cy="32%" r="70%"><stop offset="0" stopColor="#f1f6fa" /><stop offset=".55" stopColor={nuc.sphere} /><stop offset="1" stopColor="#a9bfcf" /></radialGradient></defs>
    <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} stroke={nuc.sphereLine} strokeWidth="2.2" />
    <ellipse cx={cx - r * .34} cy={cy - r * .4} rx={r * .2} ry={r * .12} fill="white" opacity=".7" transform={`rotate(-30 ${cx - r * .34} ${cy - r * .4})`} />
  </g>
}
function PuddingBall({ cx, cy, r, signs = true, electrons = true }: { cx: number; cy: number; r: number; signs?: boolean; electrons?: boolean }) {
  const id = useId()
  const plus: Pt[] = [[-.5, -.35], [.1, -.62], [.55, -.2], [-.15, .05], [.35, .4], [-.55, .3], [0, .62], [-.25, -.7]]
  const els: Pt[] = [[-.25, -.4], [.35, -.5], [.62, .12], [-.6, -.02], [.1, .28], [-.3, .58], [.38, .66]]
  const s = r / 95
  return <g>
    <defs><radialGradient id={id} cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#fff1ee" /><stop offset="1" stopColor={nuc.pudding} /></radialGradient></defs>
    <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} stroke={nuc.puddingLine} strokeWidth="2" />
    {signs && plus.map(([dx, dy], i) => <text key={i} x={r1(cx + dx * r)} y={r1(cy + dy * r + 5)} textAnchor="middle" fontSize={Math.max(12, 17 * s)} fontWeight="700" fill={nuc.puddingLine} opacity=".45">+</text>)}
    {electrons && els.map(([dx, dy], i) => <Electron key={i} x={cx + dx * r} y={cy + dy * r} r={r1(Math.max(4, 9 * s))} sign={s > .7} />)}
  </g>
}

function Solid() {
  return <PhysicsDiagram title="The first model: an atom as a tiny solid sphere with nothing inside it, which cannot be split.">
    <SolidBall cx={180} cy={150} r={92} />
    <path d="M96 64L268 236" stroke={nuc.bad} strokeWidth="2" strokeDasharray="7 6" opacity=".8" />
    <Cross x={250} y={218} s={1.1} />
    <Lines x={320} y={112} lines={['a solid sphere']} size={20} />
    <Lines x={320} y={146} lines={['nothing inside it']} size={15} weight={650} colour={muted} />
    <Chip x={392} y={198} text="cannot be split" colour={nuc.bad} fill="#fdf1ee" size={14} />
  </PhysicsDiagram>
}
function Electrons() {
  const out: [Pt, Pt][] = [[[236, 92], [318, 58]], [[262, 150], [340, 150]], [[238, 206], [318, 240]]]
  return <PhysicsDiagram title="Scientists found that atoms contain tiny negative particles called electrons, so atoms can be split.">
    <SolidBall cx={170} cy={150} r={92} />
    {out.map(([a, b], i) => <g key={i}><Arrow from={a} to={[b[0] - 14, b[1] + (b[1] - a[1]) * -0.12]} colour={nuc.electronLine} width={2.2} /><Electron x={b[0]} y={b[1]} r={10} /></g>)}
    <Lines x={372} y={138} lines={['electrons']} size={20} colour={nuc.electronLine} />
    <Lines x={372} y={166} lines={['tiny particles with', 'a negative charge']} size={14} weight={650} colour={muted} />
  </PhysicsDiagram>
}
function Plum() {
  return <PhysicsDiagram title="The plum pudding model: the atom is a ball of positive charge with negative electrons scattered through it.">
    <PuddingBall cx={170} cy={150} r={104} />
    <Callout at={[318, 70]} to={[238, 88]} lines={['ball of positive', 'charge']} colour={nuc.puddingLine} />
    <Callout at={[318, 222]} to={[213, 218]} lines={['electrons', '(negative)']} colour={nuc.electronLine} />
    <Chip x={430} y={150} text="plum pudding model" size={14} />
  </PhysicsDiagram>
}

/* The alpha scattering experiment, drawn once. Foil at (FX, FY); the detector is a ring round it. */
const FX = 282, FY = 150, R = 106
const BEAMS = [-36, -24, -12, 0, 12, 24, 36]
type Fate = 'straight' | 'slight' | 'large' | 'back'
const RESULT: { dy: number; fate: Fate; angle?: number }[] = [
  { dy: -36, fate: 'straight' }, { dy: -24, fate: 'large', angle: -62 }, { dy: -12, fate: 'straight' }, { dy: 0, fate: 'back', angle: 152 },
  { dy: 12, fate: 'straight' }, { dy: 24, fate: 'slight', angle: 20 }, { dy: 36, fate: 'large', angle: 72 },
]
const EXPECT: { dy: number; fate: Fate; angle?: number }[] = BEAMS.map((dy, i) => i === 1 ? { dy, fate: 'slight', angle: -16 } : i === 5 ? { dy, fate: 'slight', angle: 14 } : { dy, fate: 'straight' })
const onRing = (angle: number, rr = R - 9): Pt => [r1(FX + Math.cos(angle * Math.PI / 180) * rr), r1(FY + Math.sin(angle * Math.PI / 180) * rr)]
function Flash({ at }: { at: Pt }) {
  const [x, y] = at
  return <path d={`M${x} ${y - 7}L${x + 2} ${y - 2}L${x + 7} ${y}L${x + 2} ${y + 2}L${x} ${y + 7}L${x - 2} ${y + 2}L${x - 7} ${y}L${x - 2} ${y - 2}Z`} fill="#f7c948" stroke="#c3930f" strokeWidth="1" />
}
export function ScatterScene({ mode, labels = true, numbers = false, dimResults = false }: { mode: 'setup' | 'expect' | 'results'; labels?: boolean; numbers?: boolean; dimResults?: boolean }) {
  const paths = mode === 'expect' ? EXPECT : RESULT
  const gap = 24, a0 = (180 + gap) * Math.PI / 180, a1 = (180 - gap) * Math.PI / 180
  const ring = (rr: number) => `M${r1(FX + Math.cos(a0) * rr)} ${r1(FY + Math.sin(a0) * rr)}A${rr} ${rr} 0 1 1 ${r1(FX + Math.cos(a1) * rr)} ${r1(FY + Math.sin(a1) * rr)}`
  const exits = paths.map(p => {
    const y0 = FY + p.dy
    const ang = p.fate === 'straight' ? Math.asin(p.dy / (R - 9)) * 180 / Math.PI : p.angle!
    return { ...p, y0, end: onRing(ang) }
  })
  return <g>
    {/* detector ring */}
    <path d={ring(R)} stroke="#c9d6df" strokeWidth="14" fill="none" strokeLinecap="butt" />
    <path d={ring(R + 7)} stroke="#9fb1bf" strokeWidth="1.4" fill="none" />
    <path d={ring(R - 7)} stroke="#9fb1bf" strokeWidth="1.4" fill="none" />
    {/* source in a lead box */}
    <rect x={20} y={112} width={64} height={76} rx="10" fill={nuc.lead} stroke={nuc.leadLine} strokeWidth="2" />
    <rect x={66} y={FY - 40} width={18} height={80} rx="3" fill="#8793a0" stroke={nuc.leadLine} strokeWidth="1.5" />
    <Trefoil x={44} y={150} r={11} />
    {/* incoming alpha particles */}
    {BEAMS.map(dy => <g key={dy}>
      <path d={`M86 ${FY + dy}H${FX - 3}`} stroke={nuc.alpha} strokeWidth="2" opacity={mode === 'setup' ? 1 : .8} />
      {mode === 'setup' && <g><circle cx={140 + (dy + 36) * .9} cy={FY + dy} r="4" fill={nuc.proton} stroke={nuc.alpha} strokeWidth="1.2" /><path d={headPath([FX - 4, FY + dy], 0, 9).d} fill={nuc.alpha} /></g>}
    </g>)}
    {/* outgoing paths */}
    {mode !== 'setup' && <g opacity={dimResults ? .5 : 1}>{exits.map((p, i) => {
      const start: Pt = [FX + 2, p.y0]
      const colour = nuc.alpha
      return <g key={i}>
        <Arrow from={p.fate === 'back' ? [FX - 3, p.y0] : start} to={p.end} via={p.fate === 'back' ? [FX - 40, p.y0 + 4] : undefined} colour={colour} width={2} />
        <Flash at={onRing(Math.atan2(p.end[1] - FY, p.end[0] - FX) * 180 / Math.PI, R)} />
      </g>
    })}</g>}
    {/* gold foil */}
    <rect x={FX - 3.5} y={FY - 64} width={7} height={128} rx="3" fill={nuc.gold} stroke={nuc.goldLine} strokeWidth="1.6" />
    {labels && <g>
      <Lines x={52} y={210} anchor="middle" lines={['source']} size={13} colour={muted} />
      {mode === 'setup' && <g>
        <Lines x={20} y={62} lines={['alpha particles', '(positive)']} colour={nuc.alpha} size={14} />
        <Leader from={[112, 84]} to={[150, FY - 36]} colour={nuc.alpha} />
        <Callout at={[FX, 20]} to={[FX, FY - 64]} anchor="middle" lines={['thin gold foil']} colour={nuc.goldLine} size={14} />
        <Callout at={[410, 262]} to={onRing(58, R + 7)} lines={['detector']} size={14} />
      </g>}
      {mode !== 'setup' && <Lines x={FX} y={290} anchor="middle" lines={['gold foil']} size={13} colour={nuc.goldLine} />}
    </g>}
    {numbers && <g>
      {([[1, 414, 150], [2, 160, 226], [3, 342, 34]] as const).map(([n, x, y]) => <g key={n}><circle cx={x} cy={y} r="21" fill={ink} /><text x={x} y={y + 8} textAnchor="middle" fontSize="23" fontWeight="750" fill="white">{n}</text></g>)}
    </g>}
  </g>
}
function Gold({ mode }: { mode: 'setup' | 'expect' | 'results' }) {
  const titles = {
    setup: 'The alpha scattering experiment: positive alpha particles from a source are fired at a very thin sheet of gold foil. A detector all round the foil shows where they go.',
    expect: 'What the plum pudding model predicted: with the positive charge spread out, the alpha particles should pass straight through the gold foil or bend only slightly.',
    results: 'What actually happened: most alpha particles passed straight through the foil, a few were deflected at large angles, and a tiny number bounced straight back.',
  }
  return <PhysicsDiagram title={titles[mode]}>
    <ScatterScene mode={mode} />
    {mode === 'expect' && <g>
      <Lines x={402} y={30} lines={['prediction']} size={16} colour={nuc.puddingLine} />
      <PuddingBall cx={458} cy={86} r={30} signs={false} />
      <Lines x={402} y={150} lines={['all pass straight', 'through or bend', 'only slightly']} size={14} />
      <Lines x={402} y={222} lines={['charge spread out:', 'nothing dense', 'to hit']} size={13} weight={600} colour={muted} />
    </g>}
    {mode === 'results' && <g>
      <Callout at={[404, 36]} to={[322, 66]} lines={['a few deflected', 'at large angles']} colour={nuc.alpha} size={14} />
      <Lines x={404} y={144} lines={['most pass', 'straight through']} size={14} />
      <Callout at={[112, 262]} to={[196, 196]} anchor="end" lines={['a tiny number', 'bounce back']} colour={nuc.alpha} size={14} />
    </g>}
  </PhysicsDiagram>
}
function Conclude() {
  const cards: [string, string[]][] = [
    ['most pass straight through', ['most of the atom is', 'empty space']],
    ['a tiny number bounce back', ['most of the mass is in', 'a tiny nucleus']],
    ['a few deflected at large angles', ['the nucleus has a', 'positive charge']],
  ]
  return <PhysicsDiagram title="Three observations, three conclusions. 1: most alpha particles pass straight through, so most of the atom is empty space. 2: a tiny number bounce back, so most of the mass is in a tiny nucleus. 3: a few are deflected at large angles, so the nucleus is positive.">
    <g transform="translate(0 64) scale(.57)"><ScatterScene mode="results" labels={false} numbers /></g>
    {cards.map(([obs, con], i) => {
      const y = 22 + i * 90
      return <g key={i}>
        <rect x={262} y={y} width={270} height={78} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.6" />
        <circle cx={286} cy={y + 39} r="14" fill={ink} /><text x={286} y={y + 44.5} textAnchor="middle" fontSize="15" fontWeight="750" fill="white">{i + 1}</text>
        <text x={310} y={y + 22} fontSize="12.5" fontWeight="650" fill={muted}>{obs}</text>
        <Lines x={310} y={y + 44} lines={con} size={15} weight={750} colour={i === 2 ? nuc.puddingLine : ink} />
      </g>
    })}
  </PhysicsDiagram>
}
function Orbits({ cx, cy, radii, electrons, dashed = true }: { cx: number; cy: number; radii: number[]; electrons: number[][]; dashed?: boolean }) {
  return <g>
    {radii.map(r => <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={nuc.levelLine} strokeWidth="1.8" strokeDasharray={dashed ? '5 5' : undefined} />)}
    {electrons.map((angles, i) => angles.map(a => <Electron key={`${i}-${a}`} x={cx + Math.cos(a * Math.PI / 180) * radii[i]} y={cy + Math.sin(a * Math.PI / 180) * radii[i]} r={8.5} />))}
  </g>
}
function PlainNucleus({ cx, cy, r = 11 }: { cx: number; cy: number; r?: number }) {
  return <g><circle cx={cx} cy={cy} r={r * 2.1} fill={nuc.glow} /><circle cx={cx} cy={cy} r={r} fill={nuc.proton} stroke={nuc.protonLine} strokeWidth="1.5" /><text x={cx} y={cy + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="white">+</text></g>
}
function Bohr() {
  const cx = 170, cy = 150
  return <PhysicsDiagram title="Bohr's model: electrons orbit the positive nucleus in energy levels, each at a fixed distance from the nucleus.">
    <circle cx={cx} cy={cy} r={134} fill={nuc.space} stroke={nuc.spaceLine} strokeWidth="1.5" />
    <Orbits cx={cx} cy={cy} radii={[46, 82, 118]} electrons={[[200, 20], [-60, 120], [-20]]} />
    <PlainNucleus cx={cx} cy={cy} />
    <Callout at={[340, 82]} to={[cx + 111, cy - 40]} lines={['electrons']} colour={nuc.electronLine} />
    <Callout at={[340, 162]} to={[cx + 82, cy]} lines={['energy levels,', 'at fixed distances']} />
    <Callout at={[340, 246]} to={[cx + 10, cy + 10]} lines={['nucleus (positive)']} colour={nuc.protonLine} />
  </PhysicsDiagram>
}
function Zoom({ stage }: { stage: 'protons' | 'neutrons' }) {
  const ax = 96, ay = 150, zx = 322, zy = 140, zr = 96
  return <PhysicsDiagram title={stage === 'protons' ? 'Zooming in on the nucleus: later experiments showed it can be divided into smaller positive particles called protons.' : 'Zooming in again: James Chadwick showed the nucleus also contains neutral particles called neutrons, mixed in with the protons.'}>
    <circle cx={ax} cy={ay} r={86} fill={nuc.space} stroke={nuc.spaceLine} strokeWidth="1.5" />
    {[34, 62].map(r => <circle key={r} cx={ax} cy={ay} r={r} fill="none" stroke={nuc.levelLine} strokeWidth="1.5" strokeDasharray="4 4" />)}
    <Electron x={ax - 34} y={ay} r={6.5} sign={false} /><Electron x={ax + 34} y={ay} r={6.5} sign={false} /><Electron x={ax + 44} y={ay - 44} r={6.5} sign={false} />
    <circle cx={ax} cy={ay} r={9} fill={nuc.glow} /><circle cx={ax} cy={ay} r={5} fill={nuc.proton} stroke={nuc.protonLine} />
    <circle cx={ax} cy={ay} r={15} fill="none" stroke={ink} strokeWidth="1.8" />
    <path d={`M${ax + 4} ${ay - 14.5}L${zx - 20} ${zy - zr + 2}M${ax + 4} ${ay + 14.5}L${zx - 20} ${zy + zr - 2}`} stroke={muted} strokeWidth="1.3" strokeDasharray="4 4" />
    <circle cx={zx} cy={zy} r={zr} fill="#fff7f5" stroke={ink} strokeWidth="2" />
    <Nucleus cx={zx} cy={zy} protons={3} neutrons={4} r={17} mode={stage === 'protons' ? 'protons' : 'full'} />
    {stage === 'protons'
      ? <g>
        <Callout at={[436, 60]} to={[zx + 14, zy - 18]} lines={['protons', '(positive)']} colour={nuc.protonLine} />
        <Lines x={zx} y={272} anchor="middle" lines={['the nucleus splits into protons']} size={14} weight={650} colour={muted} />
      </g>
      : <g>
        <Callout at={[436, 60]} to={[zx + 14, zy - 18]} lines={['protons', '(positive)']} colour={nuc.protonLine} />
        <Callout at={[436, 214]} to={[zx + 6, zy + 26]} lines={['neutrons', '(no charge)']} colour={nuc.neutronLine} />
        <Lines x={zx} y={272} anchor="middle" lines={['found by James Chadwick']} size={14} weight={650} colour={muted} />
      </g>}
  </PhysicsDiagram>
}
function ModelIcon({ i, cx, cy }: { i: number; cx: number; cy: number }) {
  const r = 42
  if (i === 0) return <SolidBall cx={cx} cy={cy} r={r} />
  if (i === 1) return <PuddingBall cx={cx} cy={cy} r={r} />
  if (i === 2) return <g>
    <circle cx={cx} cy={cy} r={r} fill={nuc.space} stroke={nuc.spaceLine} strokeWidth="1.8" strokeDasharray="5 4" />
    <circle cx={cx} cy={cy} r={8} fill={nuc.glow} /><circle cx={cx} cy={cy} r={4.5} fill={nuc.proton} stroke={nuc.protonLine} />
    {[[-24, -18], [22, -22], [-16, 26], [26, 16]].map(([dx, dy], k) => <Electron key={k} x={cx + dx} y={cy + dy} r={5} sign={false} />)}
  </g>
  return <g>
    <circle cx={cx} cy={cy} r={r} fill={nuc.space} stroke={nuc.spaceLine} strokeWidth="1.8" />
    {[18, 32].map(rr => <circle key={rr} cx={cx} cy={cy} r={rr} fill="none" stroke={nuc.levelLine} strokeWidth="1.5" strokeDasharray="3 3" />)}
    <Electron x={cx - 18} y={cy} r={4.5} sign={false} /><Electron x={cx + 18} y={cy} r={4.5} sign={false} /><Electron x={cx + 22.6} y={cy - 22.6} r={4.5} sign={false} />
    <Nucleus cx={cx} cy={cy} protons={3} neutrons={4} r={3.2} glowOn={false} signs={false} />
  </g>
}
function Timeline() {
  const xs = [72, 204, 336, 468], cy = 118
  const names = [['solid sphere'], ['plum pudding'], ['nuclear model'], ['Bohr model with', 'protons, neutrons']]
  return <PhysicsDiagram title="How the model changed: solid sphere, then plum pudding, then the nuclear model, then Bohr's energy levels with protons and neutrons in the nucleus. Each time, new evidence changed the model.">
    <path d={`M${xs[0]} ${cy}H${xs[3]}`} stroke={P.panelLine} strokeWidth="3" />
    {xs.map((x, i) => <g key={x}>
      <circle cx={x} cy={cy} r={50} fill="white" />
      <ModelIcon i={i} cx={x} cy={cy} />
      <Lines x={x} y={cy + 74} anchor="middle" lines={names[i]} size={13.5} />
    </g>)}
    {xs.slice(0, 3).map((x, i) => <g key={i}>
      <Arrow from={[x + 50, cy]} to={[xs[i + 1] - 50, cy]} width={2.6} />
      <Lines x={(x + xs[i + 1]) / 2} y={cy - 46} anchor="middle" lines={['new', 'evidence']} size={12} weight={650} colour={muted} />
    </g>)}
    <Chip x={270} y={264} text="new evidence changed the model each time" size={14} fill="#fff4e6" colour="#b86f1e" />
  </PhysicsDiagram>
}

export function NuclearModelVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'nucmodel-solid': return <Solid />
    case 'nucmodel-electron': return <Electrons />
    case 'nucmodel-plum': return <Plum />
    case 'nucmodel-gold-setup': return <Gold mode="setup" />
    case 'nucmodel-gold-expect': return <Gold mode="expect" />
    case 'nucmodel-gold-results': return <Gold mode="results" />
    case 'nucmodel-gold-conclude': return <Conclude />
    case 'nucmodel-bohr': return <Bohr />
    case 'nucmodel-protons': return <Zoom stage="protons" />
    case 'nucmodel-neutron': return <Zoom stage="neutrons" />
    case 'nucmodel-timeline': return <Timeline />
    case 'nucmodel-q-scatter': return assessment
      ? <PhysicsDiagram title="Alpha particles fired at gold foil; most go straight through, a few bend, one bounces back."><ScatterScene mode="results" /></PhysicsDiagram>
      : <Gold mode="results" />
    default: return null
  }
}
