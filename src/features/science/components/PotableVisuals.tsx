import { useId, type ReactNode } from 'react'
import { Arrow, blob, Mini } from './InfectionVisuals'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry Lesson 53: potable water. Original, code-native schematics; not to scale. Focus ids start with 'potable-'.
 * The shared water kit below (palette, beaker, basin, heat stand, microbes, the lab distillation rig) is also used by
 * Lesson 54 (WaterTestVisuals.tsx), so both water lessons look the same.
 *
 * Colour code (kept the same as the separation lesson, SeparationVisuals.tsx):
 *   water = pale blue fill, blue line          dissolved salt = lavender         sand / gravel = tan
 *   microbes = soft pink (as in the infection lessons)                         heat / flame = orange
 *   steam = soft grey-blue wisps               cold water in the condenser = deeper blue arrows
 *   the stage or step in focus = a warm amber halo; other stages fade back.
 * The distillation rig matches SeparationVisuals' drawing: thermometer bulb level with the side arm, condenser sloping
 * down, cold water in at the lower end and out at the upper end.
 */
const { ink, muted, panelFill, panelLine } = atomPalette
export const waterPalette = {
  ink, muted, panelFill, panelLine,
  glass: '#f5fafd', glassLine: '#6f8fa6',
  water: '#d4e9f8', waterLine: '#3f8fd0', cold: '#2f78b7', deep: '#2c6fa8',
  salt: '#e6ddf5', saltLine: '#7d68b0',
  sand: '#e8c98f', sandLine: '#a87c38', gravel: '#d9d2c6', gravelLine: '#8f8676',
  flameOut: '#f5a54a', flameIn: '#fcd97d', heatLine: '#c8641e',
  vapour: '#7f9fb8', vapourText: '#4f7390',
  bug: '#b8467f', bugFill: '#f5d9e7',
  halo: '#f8c979', amberInk: '#8a5a14',
  metal: '#9aa7b2', metalLine: '#66737e',
  good: '#3f8a5f', goodSoft: '#e3f3e8', bad: '#c8505a', badSoft: '#fbe4e6',
  grass: '#cfe3b8', grassLine: '#6f9a55', soil: '#efe2c8', soilLine: '#b89a68', rock: '#e2ddd5', rockLine: '#a39886',
  sun: '#fcd97d', sunLine: '#e0a526',
}
const W = waterPalette
export const faded = .32
export type Mode = 'on' | 'active' | 'off'
export type Pt = [number, number]
export const r1 = (n: number) => Math.round(n * 10) / 10

export function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}

// ---------- Numbers, key rows, labels ----------
export function Num({ n, x, y, mode = 'on', colour = ink }: { n: number | string; x: number; y: number; mode?: Mode; colour?: string }) {
  const active = mode === 'active'
  return <g opacity={mode === 'off' ? .42 : 1}>
    <circle cx={x} cy={y} r="12" fill={active ? colour : 'white'} stroke={active ? colour : ink} strokeWidth="2" />
    <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={active ? 'white' : ink}>{n}</text>
  </g>
}
export function KeyRow({ n, x, y, lines, mode, colour = ink }: { n: number; x: number; y: number; lines: string[]; mode: Mode; colour?: string }) {
  const active = mode === 'active'
  return <g opacity={mode === 'off' ? .42 : 1}>
    <Num n={n} x={x} y={y} mode={mode === 'off' ? 'on' : mode} colour={colour} />
    <text x={x + 22} y={y + 5 - (lines.length - 1) * 8} fontSize="14" fontWeight={active ? 700 : 600} fill={active ? colour : ink}>{lines.map((l, j) => <tspan key={j} x={x + 22} dy={j ? 16 : 0}>{l}</tspan>)}</text>
  </g>
}
export function Pointer({ n, x, y, to }: { n: number; x: number; y: number; to: Pt }) {
  const a = Math.atan2(to[1] - y, to[0] - x)
  return <g><path d={`M${r1(x + Math.cos(a) * 13)} ${r1(y + Math.sin(a) * 13)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
    <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}
/** A short label (lines stack 17px apart), optionally with a leader line ending in a dot. The leader starts at (lx, ly) when given. */
export function Tag({ x, y, lines, to, from, anchor = 'start', colour = ink, size = 14, weight = 700 }: { x: number; y: number; lines: string[]; to?: Pt; from?: Pt; anchor?: 'start' | 'middle' | 'end'; colour?: string; size?: number; weight?: number }) {
  const s: Pt = from ?? [anchor === 'start' ? x - 5 : anchor === 'end' ? x + 5 : x, anchor === 'middle' ? (to && to[1] > y ? y + (lines.length - 1) * 17 + 6 : y - size - 2) : y - 5]
  return <g>
    {to && <><path d={`M${r1(s[0])} ${r1(s[1])}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.4" /><circle cx={to[0]} cy={to[1]} r="2.6" fill={ink} /></>}
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={colour}>{lines.map((l, i) => <tspan key={i} x={x} dy={i ? 17 : 0}>{l}</tspan>)}</text>
  </g>
}
export function Tick({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  return <g><circle cx={x} cy={y} r={r} fill={W.goodSoft} stroke={W.good} strokeWidth="2" /><path d={`M${r1(x - r * .45)} ${r1(y + r * .02)}l${r1(r * .32)} ${r1(r * .36)}l${r1(r * .6)} ${r1(-r * .72)}`} fill="none" stroke={W.good} strokeWidth={r > 11 ? 3 : 2.4} /></g>
}
export function Cross({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  const k = r * .38
  return <g><circle cx={x} cy={y} r={r} fill={W.badSoft} stroke={W.bad} strokeWidth="2" /><path d={`M${r1(x - k)} ${r1(y - k)}l${r1(2 * k)} ${r1(2 * k)}M${r1(x + k)} ${r1(y - k)}l${r1(-2 * k)} ${r1(2 * k)}`} stroke={W.bad} strokeWidth={r > 11 ? 3 : 2.4} /></g>
}
/** A soft amber halo behind the part in focus. */
export function Halo({ x, y, w, h, rx = 16 }: { x: number; y: number; w: number; h: number; rx?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={rx} fill={W.halo} opacity=".38" />
}

// ---------- Particles, microbes, bits ----------
export function Crystal({ x, y, s = 6 }: { x: number; y: number; s?: number }) {
  return <rect x={r1(x - s / 2)} y={r1(y - s / 2)} width={s} height={s} rx="1.2" fill={W.salt} stroke={W.saltLine} strokeWidth="1.2" transform={`rotate(${(x * 7 + y * 3) % 40 - 20} ${r1(x)} ${r1(y)})`} />
}
export function Grain({ x, y, s = 4, fill = W.sand, line = W.sandLine }: { x: number; y: number; s?: number; fill?: string; line?: string }) {
  return <ellipse cx={r1(x)} cy={r1(y)} rx={s} ry={r1(s * .75)} fill={fill} stroke={line} strokeWidth="1.1" transform={`rotate(${(x * 13 + y * 5) % 60} ${r1(x)} ${r1(y)})`} />
}
/** A small rod-shaped microbe, drawn enlarged. `dead` adds a red cross over it. */
export function Microbe({ x, y, s = 1, angle = 0, dead = false, seed = 1 }: { x: number; y: number; s?: number; angle?: number; dead?: boolean; seed?: number }) {
  return <g>
    <g transform={`rotate(${angle} ${x} ${y})`}>
      <path d={`M${r1(x + 9 * s)} ${y}q${r1(3 * s)} -3 ${r1(6 * s)} 0t${r1(6 * s)} 0`} stroke={W.bug} strokeWidth="1.4" fill="none" />
      <path d={blob(x, y, 10 * s, 5 * s, seed, .05, .45, 12)} fill={W.bugFill} stroke={W.bug} strokeWidth="1.6" />
      <circle cx={r1(x - 3 * s)} cy={y} r={r1(1.6 * s)} fill={W.bug} opacity=".6" /><circle cx={r1(x + 3 * s)} cy={r1(y + s)} r={r1(1.4 * s)} fill={W.bug} opacity=".6" />
    </g>
    {dead && <path d={`M${r1(x - 9 * s)} ${r1(y - 8 * s)}L${r1(x + 9 * s)} ${r1(y + 8 * s)}M${r1(x + 9 * s)} ${r1(y - 8 * s)}L${r1(x - 9 * s)} ${r1(y + 8 * s)}`} stroke={W.bad} strokeWidth="2.6" />}
  </g>
}
export function Twig({ x, y, len = 34, angle = 0 }: { x: number; y: number; len?: number; angle?: number }) {
  return <g transform={`rotate(${angle} ${x} ${y})`}>
    <path d={`M${x - len / 2} ${y}Q${x} ${y - 3} ${x + len / 2} ${y}M${x - 2} ${y - 1}l8 -8M${x + 8} ${y}l6 -6`} stroke="#8a6a44" strokeWidth="3.4" fill="none" />
    <path d={`M${x + 6} ${y - 9}q6 -6 10 -2q-4 6 -10 2Z`} fill={W.grass} stroke={W.grassLine} strokeWidth="1.2" />
  </g>
}
export function Drops({ x, y, n = 2, colour = W.waterLine, fill = W.water }: { x: number; y: number; n?: number; colour?: string; fill?: string }) {
  return <g>{Array.from({ length: n }, (_, i) => <path key={i} d={`M${x} ${y + i * 14}q-4 6 0 8q4 -2 0 -8Z`} fill={fill} stroke={colour} strokeWidth="1.4" />)}</g>
}
export function Steam({ cx, y, n = 3, gap = 24 }: { cx: number; y: number; n?: number; gap?: number }) {
  return <g fill="none" stroke={W.vapour} strokeWidth="2.2" opacity=".9">
    {Array.from({ length: n }, (_, i) => { const x = cx + (i - (n - 1) / 2) * gap; return <path key={i} d={`M${x} ${y}q-7 -9 0 -18q7 -9 0 -18`} /> })}
  </g>
}
export function Bubbles({ pts, r = 3 }: { pts: Pt[]; r?: number }) {
  return <g>{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r1(r * (.75 + (i % 3) * .2))} fill="white" stroke={W.waterLine} strokeWidth="1.2" />)}</g>
}

// ---------- Glassware and lab pieces ----------
/** A beaker: x,y is the top-left of the rim. `level` is the liquid height as a fraction of the beaker. */
export function Beaker({ x, y, w, h, level = 0, fill = W.water, line = W.waterLine, children }: { x: number; y: number; w: number; h: number; level?: number; fill?: string; line?: string; children?: ReactNode }) {
  const top = y + h - h * level
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="7" fill={W.glass} />
    {level > 0 && <path d={`M${x + 2} ${r1(top)}H${x + w - 2}V${y + h - 7}Q${x + w - 2} ${y + h - 2} ${x + w - 7} ${y + h - 2}H${x + 7}Q${x + 2} ${y + h - 2} ${x + 2} ${y + h - 7}Z`} fill={fill} />}
    {level > 0 && <path d={`M${x + 2} ${r1(top)}Q${x + w / 2} ${r1(top + 2)} ${x + w - 2} ${r1(top)}`} fill="none" stroke={line} strokeWidth="1.8" />}
    {children}
    <path d={`M${x - 6} ${y - 2}Q${x} ${y} ${x} ${y + 6}V${y + h - 9}Q${x} ${y + h} ${x + 9} ${y + h}H${x + w - 9}Q${x + w} ${y + h} ${x + w} ${y + h - 9}V${y}`} fill="none" stroke={W.glassLine} strokeWidth="2.4" />
    <path d={`M${x + 8} ${y + 14}V${y + h * .6}`} stroke="white" strokeWidth="3" opacity=".9" />
  </g>
}
/** A drinking glass (slightly tapered). cx is its centre, base the bottom. */
export function Glass({ cx, base, w = 70, h = 96, level = .7, children }: { cx: number; base: number; w?: number; h?: number; level?: number; children?: ReactNode }) {
  const top = base - h, t = w / 2, b = w * .38, clip = useId().replace(/:/g, '')
  const d = `M${cx - t} ${top}L${r1(cx - b)} ${base - 6}Q${r1(cx - b)} ${base} ${r1(cx - b + 6)} ${base}H${r1(cx + b - 6)}Q${r1(cx + b)} ${base} ${r1(cx + b)} ${base - 6}L${cx + t} ${top}`
  const surf = r1(base - h * level)
  return <g>
    <defs><clipPath id={clip}><path d={d + 'Z'} /></clipPath></defs>
    <path d={d + 'Z'} fill={W.glass} />
    <g clipPath={`url(#${clip})`}>
      <rect x={cx - t} y={surf} width={w} height={base - surf} fill={W.water} />
      <path d={`M${cx - t} ${surf}Q${cx} ${surf + 3} ${cx + t} ${surf}`} fill="none" stroke={W.waterLine} strokeWidth="1.8" />
      {children}
    </g>
    <path d={d} fill="none" stroke={W.glassLine} strokeWidth="2.4" />
    <path d={`M${r1(cx - t + 9)} ${top + 12}L${r1(cx - b + 7)} ${base - 14}`} stroke="white" strokeWidth="3" opacity=".9" />
  </g>
}
export function Flame({ cx, base, size = 1 }: { cx: number; base: number; size?: number }) {
  const h = 30 * size, w = 10 * size
  return <g>
    <path d={`M${r1(cx - w)} ${base}Q${r1(cx - w)} ${r1(base - h * .55)} ${cx} ${r1(base - h)}Q${r1(cx + w)} ${r1(base - h * .55)} ${r1(cx + w)} ${base}Z`} fill={W.flameOut} stroke={W.heatLine} strokeWidth="1.4" />
    <path d={`M${r1(cx - w * .5)} ${base}Q${r1(cx - w * .5)} ${r1(base - h * .35)} ${cx} ${r1(base - h * .62)}Q${r1(cx + w * .5)} ${r1(base - h * .35)} ${r1(cx + w * .5)} ${base}Z`} fill={W.flameIn} />
  </g>
}
/** Tripod with gauze on top at gauzeY and a Bunsen burner under it, standing on the bench at ground. */
export function HeatStand({ cx, gauzeY, ground, flame = 'full', width = 110 }: { cx: number; gauzeY: number; ground: number; flame?: 'off' | 'gentle' | 'full'; width?: number }) {
  const tubeTop = gauzeY + 34
  return <g>
    <path d={`M${cx - width / 2 + 10} ${gauzeY + 4}L${cx - width / 2} ${ground}M${cx + width / 2 - 10} ${gauzeY + 4}L${cx + width / 2} ${ground}`} stroke={W.metalLine} strokeWidth="4" />
    <rect x={cx - width / 2} y={gauzeY} width={width} height={5} rx="1.5" fill={W.metal} stroke={W.metalLine} strokeWidth="1.2" />
    <path d={`M${cx - width / 2 + 6} ${gauzeY + 2.5}H${cx + width / 2 - 6}`} stroke="white" strokeWidth="1" strokeDasharray="2 3" />
    {flame !== 'off' && <Flame cx={cx} base={tubeTop} size={flame === 'gentle' ? .65 : 1} />}
    <rect x={cx - 6} y={tubeTop} width={12} height={ground - tubeTop - 8} fill={W.metal} stroke={W.metalLine} strokeWidth="1.4" />
    <rect x={cx - 22} y={ground - 9} width={44} height={9} rx="3" fill={W.metal} stroke={W.metalLine} strokeWidth="1.4" />
  </g>
}
/**
 * A white evaporating basin with its base at y. `fill` is the water depth as a fraction (0 = dry); `ring` draws a faint
 * ring of leftover solid on the dry basin.
 */
export function Basin({ cx, y, w = 110, fill = 0, ring = false, faint = false }: { cx: number; y: number; w?: number; fill?: number; ring?: boolean; faint?: boolean }) {
  const h = w * .3, top = y - h, half = w / 2
  const halfAt = (yy: number) => half * Math.sqrt(Math.max(0, 1 - ((yy - top) / h) ** 2)) - 3
  const surf = r1(y - 3 - (h - 6) * fill), hs = halfAt(surf)
  const ringPts: Pt[] = Array.from({ length: 11 }, (_, i) => [cx - half * .5 + i * half * .1, y - 5 + Math.abs(i - 5) * -.3])
  return <g>
    <path d={`M${cx - half} ${r1(top)}Q${cx - half} ${y} ${cx} ${y}Q${cx + half} ${y} ${cx + half} ${r1(top)}Z`} fill="#fcfcfb" />
    {fill > 0 && <path d={`M${r1(cx - hs)} ${surf}H${r1(cx + hs)}Q${r1(cx + hs * .9)} ${y - 2} ${cx} ${y - 2}Q${r1(cx - hs * .9)} ${y - 2} ${r1(cx - hs)} ${surf}Z`} fill={W.water} stroke={W.waterLine} strokeWidth="1.6" />}
    {ring && <g opacity={faint ? .55 : .95}>{ringPts.map(([x, yy], i) => <circle key={i} cx={r1(x)} cy={r1(yy)} r={i % 2 ? 1.6 : 2.2} fill="#ece7da" stroke="#b3a88f" strokeWidth=".9" />)}</g>}
    <path d={`M${cx - half - 5} ${r1(top - 1)}Q${cx - half} ${y + 1} ${cx} ${y + 1}Q${cx + half} ${y + 1} ${cx + half + 5} ${r1(top - 1)}`} fill="none" stroke="#7d8a95" strokeWidth="2.6" />
    <path d={`M${cx + half + 1} ${r1(top - 1)}l8 -3`} stroke="#7d8a95" strokeWidth="2.6" />
  </g>
}
/** A digital top-pan balance; the pan top is at y. */
export function Balance({ cx, y, reading, w = 170, hot = false, dim = false }: { cx: number; y: number; reading: string; w?: number; hot?: boolean; dim?: boolean }) {
  return <g opacity={dim ? .45 : 1}>
    <rect x={cx - w / 2 + 16} y={y} width={w - 32} height="9" rx="4.5" fill="#dbe6ee" stroke={muted} strokeWidth="1.8" />
    <path d={`M${cx - w / 2 + 6} ${y + 9}H${cx + w / 2 - 6}Q${cx + w / 2 + 4} ${y + 11} ${cx + w / 2} ${y + 28}L${cx + w / 2 - 4} ${y + 42}Q${cx + w / 2 - 6} ${y + 50} ${cx + w / 2 - 16} ${y + 50}H${cx - w / 2 + 16}Q${cx - w / 2 + 6} ${y + 50} ${cx - w / 2 + 4} ${y + 42}L${cx - w / 2} ${y + 28}Q${cx - w / 2 - 4} ${y + 11} ${cx - w / 2 + 6} ${y + 9}Z`} fill={panelFill} stroke={muted} strokeWidth="1.8" />
    <rect x={cx - 46} y={y + 17} width="92" height="25" rx="6" fill="white" stroke={hot ? W.heatLine : ink} strokeWidth={hot ? 2.4 : 1.8} />
    <text x={cx} y={y + 35} textAnchor="middle" fontSize="16" fontWeight="700" fill={hot ? W.heatLine : ink}>{reading}</text>
  </g>
}
export function Bench({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return <path d={`M${x1} ${y}Q${(x1 + x2) / 2} ${y + 2} ${x2} ${y}`} stroke={panelLine} strokeWidth="3" fill="none" />
}
/** A thermometer: bulb at (x, bulbY); `top` is where the red line reaches. */
export function Thermometer({ x, y1, bulbY, top }: { x: number; y1: number; bulbY: number; top: number }) {
  return <g>
    <rect x={x - 4} y={y1} width={8} height={bulbY - y1} rx="4" fill="white" stroke={W.glassLine} strokeWidth="1.6" />
    <path d={`M${x} ${bulbY - 4}V${top}`} stroke="#d0463c" strokeWidth="2.6" />
    <circle cx={x} cy={bulbY} r="6" fill="#e06b62" stroke="#b4524a" strokeWidth="1.4" />
  </g>
}
export function Reading({ x, y, text, w = 76 }: { x: number; y: number; text: string; w?: number }) {
  return <g><rect x={x - w / 2} y={y - 20} width={w} height={28} rx="8" fill="white" stroke={W.heatLine} strokeWidth="1.8" /><text x={x} y={y} textAnchor="middle" fontSize="15" fontWeight="700" fill={W.heatLine}>{text}</text></g>
}

// ---------- The lab distillation rig (same geometry as the separation lesson's simple distillation) ----------
const U: Pt = [.923, .386], N: Pt = [-.386, .923]
export const RIG = { cx: 100, cy: 196, r: 40, neckHalf: 9, neckTop: 60, arm: 92, ground: 330, end: 346 }
export const rigAt = (s: number, off = 0): Pt => [r1(RIG.cx + RIG.neckHalf + U[0] * s + N[0] * off), r1(RIG.arm + U[1] * s + N[1] * off)]
export type RigFocus = 'flask' | 'condense' | 'collect' | 'all' | 'plain'
/**
 * Round-bottomed flask of impure water on a tripod over a Bunsen burner, thermometer in the neck, sloping condenser,
 * beaker. `focus` puts an amber halo on one part; `steam` shows the rising steam arrows; `reading` the thermometer.
 */
export function Rig({ focus = 'all', steam = true, reading = '100 °C', collected = true, coldLabels = false }: { focus?: RigFocus; steam?: boolean; reading?: string; collected?: boolean; coldLabels?: boolean }) {
  const clip = useId().replace(/:/g, '')
  const g = RIG
  const A: Pt = [g.cx + g.neckHalf, g.arm]
  const gauzeY = g.cy + g.r + 2
  const joinY = r1(g.cy - Math.sqrt(g.r * g.r - g.neckHalf * g.neckHalf))
  const flaskD = `M${g.cx - g.neckHalf} ${g.neckTop}V${joinY}A${g.r} ${g.r} 0 1 0 ${g.cx + g.neckHalf} ${joinY}V${g.neckTop}`
  const s0 = 64, s1 = 262, jacket = 17
  const [ex, ey] = rigAt(g.end)
  const outlet = rigAt(84, -jacket), inlet = rigAt(s1 - 22, jacket)
  const P0 = rigAt(s0), P1 = rigAt(s1)
  return <g>
    {focus === 'flask' && <rect x={g.cx - 58} y={g.neckTop - 16} width={116} height={g.ground - g.neckTop + 22} rx="18" fill={W.halo} opacity=".35" />}
    {focus === 'condense' && <path d={`M${P0[0]} ${P0[1]}L${P1[0]} ${P1[1]}`} stroke={W.halo} strokeWidth={jacket * 2 + 24} opacity=".42" />}
    {focus === 'collect' && <rect x={ex - 48} y={ey + 4} width={96} height={g.ground - ey + 2} rx="14" fill={W.halo} opacity=".42" />}
    <HeatStand cx={g.cx} gauzeY={gauzeY} ground={g.ground} flame="full" width={104} />
    <defs><clipPath id={clip}><circle cx={g.cx} cy={g.cy} r={g.r - 1.5} /></clipPath></defs>
    <path d={flaskD + 'Z'} fill={W.glass} />
    <rect x={g.cx - g.r} y={g.cy + 2} width={g.r * 2} height={g.r} fill={W.water} clipPath={`url(#${clip})`} />
    <path d={`M${g.cx - g.r} ${g.cy + 2}H${g.cx + g.r}`} stroke={W.waterLine} strokeWidth="1.6" clipPath={`url(#${clip})`} />
    {[[-18, 20], [0, 27], [16, 18], [-6, 12], [24, 28], [-26, 30]].map(([dx, dy], i) => <circle key={i} cx={g.cx + dx} cy={g.cy + dy} r="2.8" fill={W.salt} stroke={W.saltLine} strokeWidth="1.1" />)}
    {steam && <Bubbles pts={[[g.cx - 10, g.cy + 8], [g.cx + 10, g.cy + 12]]} r={2.6} />}
    <path d={flaskD} fill="none" stroke={W.glassLine} strokeWidth="2.4" />
    {/* stopper and thermometer, bulb level with the side arm */}
    <rect x={g.cx - g.neckHalf - 3} y={g.neckTop - 12} width={g.neckHalf * 2 + 6} height={16} rx="3" fill="#d8c3a5" stroke="#a88d68" strokeWidth="1.4" />
    <rect x={g.cx - 3.5} y={6} width={7} height={g.arm - 10} rx="3.5" fill="white" stroke={W.glassLine} strokeWidth="1.6" />
    <path d={`M${g.cx} ${g.arm - 4}V${reading ? 22 : 54}`} stroke="#d0463c" strokeWidth="2.4" />
    <circle cx={g.cx} cy={g.arm} r="5" fill="#e06b62" stroke="#b4524a" strokeWidth="1.4" />
    {reading && <g><rect x={g.cx - 92} y={8} width={70} height={28} rx="8" fill="white" stroke={W.heatLine} strokeWidth="1.8" /><text x={g.cx - 57} y={28} textAnchor="middle" fontSize="15" fontWeight="700" fill={W.heatLine}>{reading}</text><path d={`M${g.cx - 22} 22H${g.cx - 6}`} stroke={W.heatLine} strokeWidth="1.6" /></g>}
    {/* condenser: outer cold-water jacket around the inner tube */}
    <path d={`M${P0[0]} ${P0[1]}L${P1[0]} ${P1[1]}`} stroke={W.glassLine} strokeWidth={jacket * 2 + 4} />
    <path d={`M${P0[0]} ${P0[1]}L${P1[0]} ${P1[1]}`} stroke="#cfe5f6" strokeWidth={jacket * 2 - 1} />
    <path d={`M${outlet[0]} ${outlet[1] + 4}V${outlet[1] - 20}M${inlet[0]} ${inlet[1] - 4}V${inlet[1] + 20}`} stroke={W.glassLine} strokeWidth="11" />
    <path d={`M${outlet[0]} ${outlet[1] + 6}V${outlet[1] - 19}M${inlet[0]} ${inlet[1] - 6}V${inlet[1] + 19}`} stroke="#cfe5f6" strokeWidth="7" />
    <path d={`M${A[0] - 2} ${A[1]}L${ex} ${ey}`} stroke={W.glassLine} strokeWidth="12" strokeLinecap="butt" />
    <path d={`M${A[0] - 2} ${A[1]}L${ex} ${ey}`} stroke={W.glass} strokeWidth="8" strokeLinecap="butt" />
    <rect x={g.cx - g.neckHalf + 1.2} y={g.arm - 5} width={g.neckHalf * 2 - 2.4} height={10} fill={W.glass} />
    {collected && <path d={`M${rigAt(s1 - 40)[0]} ${rigAt(s1 - 40)[1] + 2}L${ex - 1} ${ey + 2}`} stroke={W.waterLine} strokeWidth="3" />}
    {/* cold water: in at the lower end, out at the upper end */}
    <Arrow x1={inlet[0]} y1={inlet[1] + 46} x2={inlet[0]} y2={inlet[1] + 22} colour={W.cold} width={2.5} />
    <Arrow x1={outlet[0]} y1={outlet[1] - 20} x2={outlet[0]} y2={outlet[1] - 44} colour={W.cold} width={2.5} />
    {coldLabels && <><text x={inlet[0] - 8} y={inlet[1] + 62} textAnchor="middle" fontSize="13" fontWeight="700" fill={W.cold}>cold water in</text><text x={outlet[0] + 10} y={outlet[1] - 50} fontSize="13" fontWeight="700" fill={W.cold}>water out</text></>}
    {steam && <g>
      <Arrow x1={g.cx} y1={joinY + 14} x2={g.cx} y2={g.arm + 34} colour={W.vapour} width={2.2} dashed />
      <Arrow x1={rigAt(6)[0]} y1={rigAt(6)[1]} x2={rigAt(56)[0]} y2={rigAt(56)[1]} colour={W.vapour} width={2.2} dashed />
    </g>}
    <Beaker x={ex - 40} y={ey + 30} w={80} h={g.ground - ey - 30} level={collected ? .3 : 0} />
    {collected && <Drops x={ex} y={ey + 8} n={2} />}
  </g>
}

// ============================================================================================
// Lesson 53 drawings
// ============================================================================================

// ---------- Section: what is potable water? ----------
function Meaning() {
  return <Diagram viewBox="0 0 540 280" title="A person holding a glass of clear water up to drink. A green tick beside the glass says potable: safe to drink.">
    <Mini x={160} y={96} scale={.9} body={150} />
    {/* arm lifting the glass */}
    <path d="M178 150Q206 150 212 132" stroke="#b9906f" strokeWidth="13" fill="none" />
    <path d="M178 150Q206 150 212 132" stroke="#f1dcc8" strokeWidth="9.5" fill="none" />
    <g transform="rotate(-40 214 147)"><Glass cx={214} base={147} w={40} h={56} level={.45} /></g>
    <Glass cx={380} base={236} w={92} h={128} level={.74} />
    <Tick x={446} y={112} r={20} />
    <text x={380} y={40} textAnchor="middle" fontSize="20" fontWeight="700" fill={W.deep}>potable:</text>
    <text x={380} y={64} textAnchor="middle" fontSize="17" fontWeight="700" fill={ink}>safe to drink</text>
    <Bench x1={290} x2={470} y={238} />
  </Diagram>
}
function Particles({ cx, cy, r, extra }: { cx: number; cy: number; r: number; extra: boolean }) {
  const pts: Pt[] = [[-44, -30], [-20, -50], [8, -52], [34, -36], [52, -10], [-54, 2], [-28, -12], [0, -24], [26, -8], [48, 20], [-44, 32], [-16, 18], [12, 8], [34, 38], [-22, 48], [6, 44], [-2, -2]]
  const others: Array<[number, number, string, string]> = [[-32, -32, W.salt, W.saltLine], [22, 20, '#fdebc8', '#c98f2c'], [-34, 16, '#dcefe0', W.good], [30, -54, W.salt, W.saltLine]]
  return <g>
    <circle cx={cx} cy={cy} r={r} fill="white" stroke={ink} strokeWidth="2" />
    {pts.map(([dx, dy], i) => <circle key={i} cx={cx + dx} cy={cy + dy} r="7" fill={W.water} stroke={W.waterLine} strokeWidth="1.4" />)}
    {extra && others.map(([dx, dy, f, l], i) => <circle key={`o${i}`} cx={cx + dx} cy={cy + dy} r="4.5" fill={f} stroke={l} strokeWidth="1.6" />)}
  </g>
}
function NotPure() {
  return <Diagram viewBox="0 0 540 300" title="Two glasses of water, each with a magnified circle of its particles. Left, pure water: only H₂O molecules, all the same. Right, potable water: H₂O molecules with a few particles of other safe dissolved substances among them.">
    {[0, 1].map(k => { const x = 135 + k * 270; return <g key={k}>
      <Glass cx={x - 62} base={232} w={54} h={78} level={.72} />
      <circle cx={x - 60} cy={200} r="12" fill="none" stroke={ink} strokeWidth="1.8" />
      <path d={`M${x - 50} 192L${x - 6} 168M${x - 52} 210L${x + 12} 204`} stroke={panelLine} strokeWidth="2" />
      <Particles cx={x + 30} cy={150} r={70} extra={k === 1} />
      <text x={x} y={32} textAnchor="middle" fontSize="17" fontWeight="700" fill={k ? W.deep : ink}>{k ? 'potable water' : 'pure water'}</text>
      <text x={x + 30} y={246} textAnchor="middle" fontSize="14" fontWeight="600" fill={ink}>{k ? 'H₂O plus safe' : 'only H₂O'}</text>
      <text x={x + 30} y={264} textAnchor="middle" fontSize="14" fontWeight="600" fill={ink}>{k ? 'dissolved substances' : 'molecules'}</text>
    </g> })}
    <path d="M270 40V270" stroke={panelLine} strokeWidth="1.5" strokeDasharray="4 6" />
    <text x={270} y={292} textAnchor="middle" fontSize="12" fill={muted}>magnified (particles not to scale)</text>
  </Diagram>
}
function PhStrip({ x, y, w = 196, lo = 6.5, hi = 8.5, mark }: { x: number; y: number; w?: number; lo?: number; hi?: number; mark?: number }) {
  const cols = ['#e2524a', '#ea6c43', '#f08a3e', '#f4a63c', '#f3c13f', '#e6d24a', '#b9d552', '#7cc95d', '#4fb58a', '#3e9fae', '#3f82c2', '#4d64b8', '#5b4ea6', '#62418f']
  const cw = w / 14, xAt = (p: number) => x + (p - .5) * cw
  return <g>
    {cols.map((c, i) => <rect key={i} x={r1(x + i * cw)} y={y} width={r1(cw + .4)} height={20} fill={c} opacity=".78" />)}
    <rect x={x} y={y} width={w} height={20} rx="4" fill="none" stroke={muted} strokeWidth="1.4" />
    {lo < hi && <rect x={r1(xAt(lo))} y={y - 5} width={r1(xAt(hi) - xAt(lo))} height={30} rx="6" fill="none" stroke={ink} strokeWidth="2.6" />}
    {mark !== undefined && <path d={`M${r1(xAt(mark))} ${y - 8}l-6 -9h12z`} fill={ink} />}
    {[1, 7, 14].map(p => <text key={p} x={r1(xAt(p))} y={y + 38} textAnchor="middle" fontSize="12" fill={muted}>{p}</text>)}
  </g>
}
function Rules() {
  const rows: Array<[string, string, ReactNode]> = [
    ['low levels of', 'dissolved salts', <g key="s">{[[0, 0], [10, 6], [-8, 8], [4, -9], [-12, -6], [14, -4]].map(([dx, dy], i) => <Crystal key={i} x={96 + dx} y={82 + dy} s={i < 2 ? 7 : 5} />)}</g>],
    ['pH between', '6.5 and 8.5', <g key="p" />],
    ['no harmful', 'microbes', <g key="m"><Microbe x={96} y={238} s={1.4} dead /></g>],
  ]
  return <Diagram viewBox="0 0 540 300" schematic={false} title="A checklist card for potable water with three rows: low levels of dissolved salts; pH between 6.5 and 8.5, shown as the middle of a pH scale; no harmful microbes.">
    <rect x={40} y={20} width={460} height={262} rx="16" fill={panelFill} stroke={panelLine} strokeWidth="1.6" />
    <text x={270} y={48} textAnchor="middle" fontSize="16" fontWeight="700" fill={W.deep}>Safe to drink if it has:</text>
    {rows.map(([a, b, icon], i) => { const y = 82 + i * 78; return <g key={i}>
      {i > 0 && <path d={`M60 ${y - 38}H480`} stroke={panelLine} strokeWidth="1.2" />}
      {icon}
      <text x={140} y={y - 3} fontSize="15" fontWeight="600" fill={ink}>{a}</text>
      <text x={140} y={y + 16} fontSize="15" fontWeight="700" fill={ink}>{b}</text>
      <Tick x={462} y={y} r={14} />
    </g> })}
    <PhStrip x={262} y={150} w={168} />
    <text x={96} y={166} textAnchor="middle" fontSize="18" fontWeight="700" fill={W.good}>pH</text>
  </Diagram>
}

// ---------- Section: where does it come from? (one landscape) ----------
// Side view: a reservoir behind a dam, a river and a lake at the surface; soil, then rock holding water, then solid rock.
const SURFACE = 'M0 112C24 112 30 118 36 128C46 150 62 158 84 158C104 158 116 150 124 134L124 112H146C170 112 184 132 206 144C220 150 226 150 232 152C236 166 244 170 252 170C262 170 268 164 272 152C290 148 310 150 330 152C346 170 372 180 410 180C446 180 470 168 484 152C500 146 520 146 540 146'
const GROUND = SURFACE + 'V300H0Z'
function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const puffs: Array<[number, number, number]> = [[-38, 6, 18], [-16, -6, 24], [12, -10, 26], [38, 2, 20], [0, 10, 18], [-26, 12, 14], [26, 12, 15]]
  return <g>
    {puffs.map(([dx, dy, r], i) => <circle key={i} cx={r1(x + dx * s)} cy={r1(y + dy * s)} r={r1(r * s)} fill="none" stroke="#9fb3c2" strokeWidth="4" />)}
    {puffs.map(([dx, dy, r], i) => <circle key={`f${i}`} cx={r1(x + dx * s)} cy={r1(y + dy * s)} r={r1(r * s)} fill="#eef3f7" />)}
  </g>
}
function Rain({ x, y, w, rows = 3 }: { x: number; y: number; w: number; rows?: number }) {
  return <g stroke={W.waterLine} strokeWidth="2.2">{Array.from({ length: rows * 5 }, (_, i) => { const c = i % 5, r = Math.floor(i / 5), xx = x + c * w / 4 + (r % 2) * 10 - 5, yy = y + r * 20; return <path key={i} d={`M${r1(xx)} ${yy}l-4 11`} /> })}</g>
}
function Landscape({ focus }: { focus: 'rain' | 'sources' }) {
  const clip = useId().replace(/:/g, '')
  const rainOn = focus === 'rain'
  return <Diagram viewBox="0 0 540 300" title={rainOn
    ? 'A landscape seen from the side. A cloud rains onto the land. Rainwater is freshwater: it has little dissolved in it.'
    : 'The same landscape. Rain collects as surface water in a reservoir behind a dam, a river and a lake, and as ground water trapped in a layer of rock underground.'}>
    <defs><clipPath id={clip}><path d={GROUND} /></clipPath></defs>
    {/* surface water bodies (the ground drawn on top hides the parts below the banks) */}
    <g opacity={rainOn ? faded : 1}>
      <rect x={30} y={122} width={96} height={60} fill={W.water} /><path d="M36 122H124" stroke={W.waterLine} strokeWidth="2" />
      <rect x={228} y={156} width={48} height={30} fill={W.water} /><path d="M234 156H270" stroke={W.waterLine} strokeWidth="2" />
      <rect x={326} y={158} width={162} height={40} fill={W.water} /><path d="M338 158Q410 161 478 158" stroke={W.waterLine} strokeWidth="2" />
    </g>
    <path d={GROUND} fill={W.soil} />
    <g clipPath={`url(#${clip})`} opacity={rainOn ? .5 : 1}>
      <path d="M0 212Q140 204 270 214T540 208V264H0Z" fill="#dde6ea" />
      {Array.from({ length: 34 }, (_, i) => { const x = 10 + (i * 61) % 530, y = 222 + ((i * 7) % 4) * 8; return <circle key={i} cx={x} cy={y} r="3.4" fill={W.water} stroke={W.waterLine} strokeWidth="1.1" /> })}
      <path d="M0 256Q140 262 270 254T540 256V300H0Z" fill={W.rock} />
      <path d="M0 212Q140 204 270 214T540 208M0 258Q140 262 270 254T540 256" fill="none" stroke={W.rockLine} strokeWidth="1.6" />
    </g>
    <path d={SURFACE} fill="none" stroke={W.grassLine} strokeWidth="5" opacity=".85" />
    {/* the dam wall */}
    <path d="M120 110H134L150 164H118Z" fill="#d9dde1" stroke={W.metalLine} strokeWidth="1.8" />
    {/* rain */}
    {rainOn && <Halo x={80} y={4} w={200} h={120} />}
    <g opacity={rainOn ? 1 : .55}>
      <Cloud x={150} y={44} /><Cloud x={214} y={56} s={.7} />
      <Rain x={104} y={80} w={130} rows={rainOn ? 2 : 1} />
    </g>
    {rainOn ? <g>
      <Tag x={300} y={42} lines={['rainwater: freshwater,', 'little dissolved in it']} colour={W.deep} />
      <text x={300} y={100} fontSize="13" fill={muted}>Rain collects on the land</text>
      <text x={300} y={117} fontSize="13" fill={muted}>and under it.</text>
    </g> : <g>
      <Tag x={60} y={196} lines={['reservoir']} anchor="middle" colour={W.deep} size={13} />
      <Tag x={252} y={196} lines={['river']} anchor="middle" colour={W.deep} size={13} />
      <Tag x={408} y={136} lines={['lake']} anchor="middle" colour={W.deep} size={13} />
      <rect x={300} y={14} width={232} height={58} rx="12" fill="white" stroke={W.waterLine} strokeWidth="1.8" />
      <text x={416} y={38} textAnchor="middle" fontSize="15" fontWeight="700" fill={W.deep}>surface water:</text>
      <text x={416} y={58} textAnchor="middle" fontSize="13" fontWeight="600" fill={ink}>lakes, rivers, reservoirs</text>
      <rect x={312} y={264} width={220} height={30} rx="10" fill="white" stroke={W.waterLine} strokeWidth="1.8" />
      <text x={422} y={284} textAnchor="middle" fontSize="14" fontWeight="700" fill={W.deep}>ground water: in rocks</text>
      <path d="M380 264L360 238" stroke={ink} strokeWidth="1.4" /><circle cx={360} cy={236} r="2.6" fill={ink} />
    </g>}
  </Diagram>
}
// A soft outline of Great Britain and Northern Ireland (a simplified, hand-placed shape; not a real map).
const GB: Pt[] = [[100, 12], [126, 16], [120, 38], [134, 58], [122, 80], [112, 94], [126, 106], [132, 128], [144, 150], [154, 172], [170, 186], [182, 204], [174, 222], [184, 238], [172, 250], [148, 252], [120, 258], [96, 262], [78, 272], [62, 278], [72, 262], [92, 248], [106, 238], [90, 226], [74, 222], [80, 204], [70, 190], [86, 176], [100, 168], [96, 150], [90, 132], [100, 118], [80, 106], [70, 90], [58, 70], [70, 54], [62, 34], [80, 20]]
function smooth(points: Pt[]) {
  const n = points.length
  let d = `M${points[0][0]} ${points[0][1]}`
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n], p1 = points[i], p2 = points[(i + 1) % n], p3 = points[(i + 2) % n]
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`
  }
  return d + 'Z'
}
function DropIcon({ x, y, s = 1, fill = W.water, line = W.waterLine }: { x: number; y: number; s?: number; fill?: string; line?: string }) {
  return <path d={`M${x} ${r1(y - 10 * s)}C${r1(x + 7 * s)} ${r1(y - 2 * s)} ${r1(x + 7 * s)} ${r1(y + 5 * s)} ${x} ${r1(y + 6 * s)}C${r1(x - 7 * s)} ${r1(y + 5 * s)} ${r1(x - 7 * s)} ${r1(y - 2 * s)} ${x} ${r1(y - 10 * s)}Z`} fill={fill} stroke={line} strokeWidth="1.6" />
}
function UkMap() {
  return <Diagram viewBox="0 0 540 300" title="A simple outline of the UK with the south-east of England shaded. In the warmer south-east, surface water dries up first, so more of the water supply comes from ground water.">
    <g transform="translate(30 6)">
      <path d={smooth(GB)} fill="#eef5ea" stroke={W.grassLine} strokeWidth="2.2" />
      <path d={blob(38, 118, 18, 15, 7, .1)} fill="#eef5ea" stroke={W.grassLine} strokeWidth="2.2" />
      <path d={blob(160, 226, 24, 17, 12, .1)} fill={W.sun} opacity=".75" stroke={W.sunLine} strokeWidth="1.8" />
      <DropIcon x={160} y={230} s={.9} fill="#e7e1d6" line={W.rockLine} />
      <DropIcon x={96} y={70} s={.9} /><DropIcon x={110} y={150} s={.9} />
    </g>
    <circle cx={248} cy={220} r="15" fill={W.sun} stroke={W.sunLine} strokeWidth="2" />
    {Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return <path key={i} d={`M${r1(248 + Math.cos(a) * 20)} ${r1(220 + Math.sin(a) * 20)}L${r1(248 + Math.cos(a) * 27)} ${r1(220 + Math.sin(a) * 27)}`} stroke={W.sunLine} strokeWidth="2.4" /> })}
    <text x={290} y={196} fontSize="15" fontWeight="700" fill={W.amberInk}>south-east: warmer</text>
    <text x={290} y={218} fontSize="14" fill={ink}>surface water dries up first,</text>
    <text x={290} y={236} fontSize="14" fontWeight="700" fill={ink}>so more ground water</text>
    <g transform="translate(290 44)">
      <DropIcon x={10} y={10} /><text x={28} y={15} fontSize="14" fill={ink}>surface water</text>
      <DropIcon x={10} y={44} fill="#e7e1d6" line={W.rockLine} /><text x={28} y={49} fontSize="14" fill={ink}>mostly ground water</text>
      <text x={0} y={92} fontSize="13" fill={muted}>The source depends on</text>
      <text x={0} y={109} fontSize="13" fill={muted}>where you live.</text>
    </g>
  </Diagram>
}
function Dry() {
  const cracks = ['M20 212l18 10l-6 14l16 8', 'M70 230l14 -8l12 10', 'M120 214l-8 16l14 10l-4 14', 'M190 228l16 6l6 -12', 'M150 262l18 -8l10 10']
  return <Diagram viewBox="0 0 540 300" title="A very dry country: cracked, dry ground, a dry river bed with no water in it, and a hot Sun. The sea is beside it, and an arrow shows that sea water is used instead.">
    <circle cx={70} cy={56} r="24" fill={W.sun} stroke={W.sunLine} strokeWidth="2" />
    {Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5; return <path key={i} d={`M${r1(70 + Math.cos(a) * 31)} ${r1(56 + Math.sin(a) * 31)}L${r1(70 + Math.cos(a) * 40)} ${r1(56 + Math.sin(a) * 40)}`} stroke={W.sunLine} strokeWidth="2.6" /> })}
    <path d="M0 190Q120 182 250 192Q300 196 320 200L340 300H0Z" fill="#f1dfbd" stroke="#c49a5a" strokeWidth="2" />
    <path d="M60 196Q110 214 150 204Q200 192 240 214Q260 228 290 222" fill="none" stroke="#d6b27a" strokeWidth="16" />
    <path d="M60 196Q110 214 150 204Q200 192 240 214Q260 228 290 222" fill="none" stroke="#c49a5a" strokeWidth="1.5" strokeDasharray="3 6" />
    {cracks.map((d, i) => <path key={i} d={d} fill="none" stroke="#b58848" strokeWidth="1.8" />)}
    {[[110, 208], [188, 202], [262, 222]].map(([x, y], i) => <path key={i} d={blob(x, y, 6, 4, i + 3, .15)} fill="#d9d2c6" stroke="#8f8676" strokeWidth="1.2" />)}
    <path d="M320 200Q420 196 540 198V300H340Z" fill={W.water} stroke={W.waterLine} strokeWidth="2" />
    {[0, 1, 2].map(i => <path key={i} d={`M${370 + i * 50} ${230 + (i % 2) * 22}q8 -6 16 0t16 0`} fill="none" stroke={W.waterLine} strokeWidth="2" />)}
    <Tag x={96} y={168} lines={['dry river bed']} anchor="middle" to={[112, 206]} colour={W.amberInk} />
    <g><path d="M226 190V160L248 142L270 160V190Z" fill="#fbf6ea" stroke="#b9a77a" strokeWidth="2" /><rect x={241} y={168} width={14} height={22} rx="2" fill="#dcc7a2" stroke="#9c835a" strokeWidth="1.4" /></g>
    <text x={170} y={286} textAnchor="middle" fontSize="14" fontWeight="700" fill={W.amberInk}>not enough surface or ground water</text>
    <text x={450} y={282} textAnchor="middle" fontSize="15" fontWeight="700" fill={W.deep}>sea</text>
    <path d="M430 214Q400 130 286 150" fill="none" stroke={W.deep} strokeWidth="3" />
    <path d="M280 151l13 -8l-1 15z" fill={W.deep} stroke={W.deep} strokeWidth="1.5" />
    <rect x={330} y={50} width={184} height={54} rx="14" fill="white" stroke={W.waterLine} strokeWidth="2" />
    <text x={422} y={74} textAnchor="middle" fontSize="15" fontWeight="700" fill={W.deep}>sea water</text>
    <text x={422} y={94} textAnchor="middle" fontSize="14" fontWeight="600" fill={ink}>used instead</text>
  </Diagram>
}

// ---------- Section: desalination ----------
const SALT_PTS: Pt[] = [[-40, -30], [-12, -42], [22, -36], [44, -16], [-50, 2], [-22, -10], [8, -12], [34, 8], [-38, 30], [-8, 18], [18, 30], [46, 36], [-20, 44], [4, 46]]
function Salty() {
  return <Diagram viewBox="0 0 540 280" title="A beaker of sea water with lots of dissolved salt particles spread through it. Too much dissolved salt: not potable. Desalination removes the salt.">
    <Beaker x={70} y={60} w={150} h={180} level={.78}>
      {SALT_PTS.map(([dx, dy], i) => <circle key={i} cx={145 + dx} cy={170 + dy} r="4.6" fill={W.salt} stroke={W.saltLine} strokeWidth="1.4" />)}
    </Beaker>
    <text x={145} y={36} textAnchor="middle" fontSize="16" fontWeight="700" fill={W.deep}>sea water</text>
    <Tag x={262} y={132} lines={['dissolved salt']} to={[190, 146]} colour={W.saltLine} />
    <rect x={262} y={172} width={250} height={82} rx="14" fill={panelFill} stroke={panelLine} strokeWidth="1.6" />
    <text x={280} y={198} fontSize="15" fontWeight="700" fill={W.bad}>too much salt: not potable</text>
    <text x={280} y={222} fontSize="14" fill={ink}>Desalination removes</text>
    <text x={280} y={240} fontSize="14" fill={ink}>the salt.</text>
  </Diagram>
}
function Distill() {
  return <Diagram viewBox="0 0 540 340" title="Desalination by distillation. Sea water is boiled in a flask; the steam passes into a condenser cooled by cold water, turns back into liquid and drips into a beaker as fresh water. The salt is left behind in the flask.">
    <Rig focus="plain" coldLabels={false} />
    <Tag x={10} y={146} lines={['sea water']} from={[40, 152]} to={[76, 218]} colour={W.deep} size={13} />
    <KeyRow n={1} x={330} y={26} lines={['boil the sea water']} mode="on" colour={W.heatLine} />
    <KeyRow n={2} x={330} y={58} lines={['steam rises']} mode="on" colour={W.vapourText} />
    <KeyRow n={3} x={330} y={90} lines={['condenser cools it:', 'liquid water']} mode="on" colour={W.cold} />
    <KeyRow n={4} x={330} y={132} lines={['fresh water collected']} mode="active" colour={W.waterLine} />
    <text x={352} y={160} fontSize="13" fontWeight="700" fill={W.saltLine}>salt left in the flask</text>
  </Diagram>
}
function Membrane() {
  const clipL = useId().replace(/:/g, '')
  const left: Pt[] = [[60, 110], [92, 96], [128, 118], [168, 104], [206, 126], [70, 150], [110, 160], [150, 146], [190, 168], [80, 196], [124, 204], [166, 194], [210, 206], [96, 236], [144, 240], [196, 236]]
  const saltL: Pt[] = [[76, 128], [140, 132], [196, 146], [100, 178], [150, 222], [214, 180], [62, 226]]
  const right: Pt[] = [[320, 180], [352, 204], [392, 188], [430, 210], [470, 196], [336, 234], [380, 238], [420, 232], [462, 236], [300, 214]]
  return <Diagram viewBox="0 0 540 300" title="Reverse osmosis: a tank split by a membrane. Salty water is pushed against the membrane on the left. Only water molecules pass through its tiny holes to the right, giving fresh water. Salt particles and larger molecules are trapped on the left.">
    <defs><clipPath id={clipL}><rect x={40} y={80} width={460} height={180} rx="16" /></clipPath></defs>
    <rect x={40} y={80} width={460} height={180} rx="16" fill={W.glass} />
    <g clipPath={`url(#${clipL})`}>
      <rect x={40} y={92} width={218} height={170} fill="#dde6f0" />
      <rect x={282} y={160} width={218} height={102} fill={W.water} />
      <path d="M282 160H500" stroke={W.waterLine} strokeWidth="1.8" />
    </g>
    {left.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6" fill={W.water} stroke={W.waterLine} strokeWidth="1.3" />)}
    {saltL.map(([x, y], i) => <circle key={`s${i}`} cx={x} cy={y} r="9" fill={W.salt} stroke={W.saltLine} strokeWidth="1.6" />)}
    {right.map(([x, y], i) => <circle key={`r${i}`} cx={x} cy={y} r="6" fill={W.water} stroke={W.waterLine} strokeWidth="1.3" />)}
    {/* the membrane: a wall with tiny gaps */}
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={260} y={86 + i * 19.6} width={20} height={13} rx="4" fill="#c9b99a" stroke="#8f7a55" strokeWidth="1.4" />)}
    {/* water molecules passing through the gaps */}
    <circle cx={270} cy={140} r="5" fill={W.water} stroke={W.waterLine} strokeWidth="1.3" />
    <Arrow x1={226} y1={140} x2={252} y2={140} colour={W.waterLine} width={2} /><Arrow x1={284} y1={140} x2={312} y2={148} colour={W.waterLine} width={2} />
    <circle cx={270} cy={199} r="5" fill={W.water} stroke={W.waterLine} strokeWidth="1.3" />
    <Arrow x1={284} y1={199} x2={310} y2={204} colour={W.waterLine} width={2} />
    <rect x={40} y={80} width={460} height={180} rx="16" fill="none" stroke={W.glassLine} strokeWidth="2.4" />
    <text x={148} y={62} textAnchor="middle" fontSize="16" fontWeight="700" fill={W.saltLine}>salty water</text>
    <text x={392} y={62} textAnchor="middle" fontSize="16" fontWeight="700" fill={W.deep}>fresh water</text>
    <Tag x={270} y={292} lines={['membrane']} anchor="middle" to={[270, 262]} />
    <text x={392} y={120} textAnchor="middle" fontSize="13" fill={muted}>only water gets through</text>
    <text x={148} y={284} textAnchor="middle" fontSize="13" fill={muted}>salt is trapped</text>
  </Diagram>
}
function MiniFlask({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 5} ${y - 30}V${y - 16}A18 18 0 1 0 ${x + 5} ${y - 16}V${y - 30}Z`} fill={W.glass} stroke={W.glassLine} strokeWidth="2" />
    <path d={`M${x - 16} ${y}A18 18 0 0 0 ${x + 16} ${y}Z`} fill={W.water} />
    <path d={`M${x + 5} ${y - 26}L${x + 40} ${y - 12}`} stroke={W.glassLine} strokeWidth="6" /><path d={`M${x + 5} ${y - 26}L${x + 40} ${y - 12}`} stroke="#cfe5f6" strokeWidth="3" />
    <Flame cx={x} base={y + 36} size={.5} />
  </g>
}
function Cost() {
  return <Diagram viewBox="0 0 540 300" title="A yellow lightning bolt for energy above a pound coin: both desalination methods, distillation and reverse osmosis, need lots of energy, so they are expensive.">
    <path d="M130 30L92 118H124L104 190L170 94H136L158 30Z" fill={W.sun} stroke={W.sunLine} strokeWidth="2.4" />
    <circle cx={132} cy={236} r="36" fill="#f6dfa5" stroke="#c98f2c" strokeWidth="2.4" />
    <circle cx={132} cy={236} r="28" fill="none" stroke="#c98f2c" strokeWidth="1.4" />
    <text x={132} y={248} textAnchor="middle" fontSize="32" fontWeight="700" fill={W.amberInk}>£</text>
    <text x={220} y={62} fontSize="18" fontWeight="700" fill={W.amberInk}>lots of energy</text>
    <text x={220} y={86} fontSize="18" fontWeight="700" fill={ink}>= expensive</text>
    {[0, 1].map(k => { const x = 222 + k * 150; return <g key={k}>
      <rect x={x} y={120} width={136} height={142} rx="14" fill={panelFill} stroke={panelLine} strokeWidth="1.6" />
      <text x={x + 68} y={246} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{k ? 'reverse osmosis' : 'distillation'}</text>
      {k === 0 ? <MiniFlask x={x + 52} y={186} /> : <g>
        <rect x={x + 18} y={148} width={100} height={62} rx="8" fill={W.glass} stroke={W.glassLine} strokeWidth="2" />
        <rect x={x + 20} y={150} width={46} height={58} fill="#dde6f0" /><rect x={x + 70} y={170} width={46} height={38} fill={W.water} />
        {[0, 1, 2, 3].map(i => <rect key={i} x={x + 64} y={150 + i * 15} width={8} height={9} rx="2.5" fill="#c9b99a" stroke="#8f7a55" strokeWidth="1" />)}
        {[[34, 170], [50, 190], [40, 200]].map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={dy} r="5" fill={W.salt} stroke={W.saltLine} strokeWidth="1.2" />)}
      </g>}
    </g> })}
    <text x={220} y={288} fontSize="13" fill={muted}>Used only when there is no other fresh water.</text>
  </Diagram>
}

// ---------- Section: treating fresh water (one treatment-works strip) ----------
type Stage = 'treat' | 'mesh' | 'beds' | 'sterilise' | 'route'
function Pipe({ d }: { d: string }) {
  return <g><path d={d} fill="none" stroke={W.glassLine} strokeWidth="11" /><path d={d} fill="none" stroke={W.water} strokeWidth="6.5" /></g>
}
function Tap({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 30} ${y}H${x + 14}Q${x + 26} ${y} ${x + 26} ${y + 12}V${y + 20}`} fill="none" stroke={W.metalLine} strokeWidth="12" />
    <path d={`M${x - 30} ${y}H${x + 14}Q${x + 26} ${y} ${x + 26} ${y + 12}V${y + 20}`} fill="none" stroke="#cdd6dd" strokeWidth="8" />
    <rect x={x + 2} y={y - 20} width={8} height={14} rx="2" fill={W.metal} stroke={W.metalLine} strokeWidth="1.4" />
    <rect x={x - 10} y={y - 24} width={32} height={7} rx="3.5" fill={W.metal} stroke={W.metalLine} strokeWidth="1.4" />
  </g>
}
function Works({ stage }: { stage: Stage }) {
  const dim = (s: Stage) => stage === 'treat' || stage === 'route' || stage === s ? 1 : faded
  const route = stage === 'route'
  const titles: Record<Stage, string> = {
    treat: 'Treating fresh water: water from a river passes through two stages, filtration and then sterilisation, before it reaches the tap.',
    mesh: 'Filtration, part 1: river water flows through a wire mesh. Twigs and other large things are too big for the gaps and are stopped.',
    beds: 'Filtration, part 2: the water trickles down through filter beds of sand and gravel. The grains catch tiny bits of solid.',
    sterilise: 'Sterilisation: harmful microbes in the water are killed, using chlorine gas, ozone or ultraviolet light.',
    route: 'The whole route: rain collects as surface water or ground water; it passes through a wire mesh, then filter beds, then is sterilised, and reaches the tap as potable water. Where there is only sea water, it is desalinated first and joins the route.',
  }
  const notes: Record<Stage, string> = {
    treat: 'Two stages: filtration, then sterilisation.',
    mesh: 'Wire mesh stops large things, such as twigs.',
    beds: 'Filter beds: sand and gravel catch tiny bits.',
    sterilise: 'Chlorine gas, ozone or ultraviolet light kill microbes.',
    route: '',
  }
  const base = route ? 30 : 0
  return <Diagram viewBox={`0 0 540 ${route ? 330 : 300}`} title={titles[stage]}>
    <g transform={`translate(0 ${base})`}>
      {stage === 'mesh' && <Halo x={100} y={90} w={84} h={130} />}
      {stage === 'beds' && <Halo x={188} y={80} w={120} h={150} />}
      {stage === 'sterilise' && <Halo x={316} y={80} w={112} h={150} />}
      {/* pipes between the stages */}
      <g opacity={stage === 'treat' || route ? 1 : .6}>
        <Pipe d="M92 164H118" /><Pipe d="M166 164H206" /><Pipe d="M290 214H300Q310 214 310 204V172Q310 164 320 164H332" /><Pipe d="M414 190H448Q460 190 460 178V136H470" />
      </g>
      {/* source: a river with twigs and microbes */}
      <g>
        <path d="M8 136Q20 196 60 198Q90 198 96 170V136Z" fill={W.water} />
        <path d="M8 136Q52 140 96 136" stroke={W.waterLine} strokeWidth="2" fill="none" />
        <path d="M2 128Q14 204 60 206Q100 206 104 160" fill="none" stroke={W.soilLine} strokeWidth="3" />
        <Twig x={34} y={150} len={30} angle={-8} /><Twig x={68} y={170} len={24} angle={20} />
        <Microbe x={34} y={180} s={.8} seed={2} /><Microbe x={76} y={148} s={.8} angle={30} seed={4} />
        {route ? <text x={48} y={228} textAnchor="middle" fontSize="13" fontWeight="700" fill={W.deep}><tspan x={48}>surface</tspan><tspan x={48} dy={16}>water</tspan></text>
          : <text x={52} y={236} textAnchor="middle" fontSize="13" fontWeight="700" fill={W.deep}>river</text>}
      </g>
      {/* 1. wire mesh */}
      <g opacity={dim('mesh')}>
        <rect x={112} y={134} width={60} height={60} rx="8" fill={W.water} stroke={W.glassLine} strokeWidth="2" />
        <path d="M142 118V204" stroke={W.metalLine} strokeWidth="2.6" />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M136 ${122 + i * 10}H148`} stroke={W.metalLine} strokeWidth="1.8" />)}
        <Twig x={126} y={152} len={20} angle={100} /><Twig x={127} y={178} len={18} angle={-100} />
        <text x={route ? 150 : 142} y={236} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>wire mesh</text>
      </g>
      {/* 2. filter beds */}
      <g opacity={dim('beds')}>
        <rect x={198} y={100} width={96} height={120} rx="10" fill={W.glass} stroke={W.glassLine} strokeWidth="2" />
        <rect x={200} y={112} width={92} height={36} fill={W.water} /><path d="M200 112H292" stroke={W.waterLine} strokeWidth="1.8" />
        {Array.from({ length: 36 }, (_, i) => <Grain key={i} x={206 + (i % 12) * 7.6 + (Math.floor(i / 12) % 2) * 3} y={154 + Math.floor(i / 12) * 8} s={3.4} />)}
        {Array.from({ length: 14 }, (_, i) => <Grain key={`g${i}`} x={208 + (i % 7) * 13 + (Math.floor(i / 7) % 2) * 6} y={186 + Math.floor(i / 7) * 13} s={5.6} fill={W.gravel} line={W.gravelLine} />)}
        {[[222, 126], [252, 136], [274, 124]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.2" fill="#8a6a44" />)}
        {[[218, 152], [262, 160], [240, 156]].map(([x, y], i) => <circle key={`c${i}`} cx={x} cy={y} r="2.2" fill="#8a6a44" />)}
        {stage === 'beds' && <><Arrow x1={180} y1={112} x2={180} y2={196} colour={W.waterLine} width={2.2} /><text x={246} y={94} textAnchor="middle" fontSize="12" fontWeight="700" fill={W.sandLine}>sand and gravel</text></>}
        <text x={246} y={236} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>filter beds</text>
      </g>
      {/* 3. sterilisation */}
      <g opacity={dim('sterilise')}>
        <rect x={326} y={120} width={92} height={96} rx="10" fill={W.water} stroke={W.glassLine} strokeWidth="2" />
        <Bubbles pts={[[344, 204], [352, 180], [346, 156], [360, 138], [400, 200], [406, 170]]} r={3.2} />
        <Microbe x={378} y={150} s={.9} dead seed={3} /><Microbe x={384} y={190} s={.9} angle={-20} dead seed={5} />
        {stage === 'sterilise' && <g>
          <rect x={336} y={96} width={72} height={12} rx="6" fill="#e9e1fb" stroke="#7d68b0" strokeWidth="1.6" />
          {[350, 372, 394].map(x => <path key={x} d={`M${x} 110l-3 8`} stroke="#7d68b0" strokeWidth="2" />)}
        </g>}
        <text x={372} y={236} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>sterilisation</text>
      </g>
      {/* tap */}
      <g>
        <Tap x={492} y={136} />
        <Drops x={518} y={162} n={1} />
        <Glass cx={518} base={220} w={36} h={44} level={.6} />
        <text x={496} y={236} textAnchor="middle" fontSize="13" fontWeight="700" fill={W.deep}>tap</text>
      </g>
      {/* stage brackets */}
      {stage !== 'mesh' && stage !== 'beds' && stage !== 'sterilise' && <g>
        <path d="M112 70V62H294V70" fill="none" stroke={W.sandLine} strokeWidth="2" />
        <text x={203} y={54} textAnchor="middle" fontSize="15" fontWeight="700" fill={W.sandLine}>Filtration</text>
        <path d="M326 70V62H418V70" fill="none" stroke={W.bug} strokeWidth="2" />
        <text x={372} y={54} textAnchor="middle" fontSize="15" fontWeight="700" fill={W.bug}>Sterilisation</text>
      </g>}
      {stage === 'mesh' && <text x={142} y={88} textAnchor="middle" fontSize="13" fontWeight="700" fill={W.sandLine}>twigs stopped</text>}
      {stage === 'sterilise' && <text x={372} y={78} textAnchor="middle" fontSize="13" fontWeight="700" fill={W.bug}>microbes killed</text>}
    </g>
    {route ? <g>
      {/* rain feeds the source; ground water, or desalinated sea water, can join instead */}
      <Cloud x={56} y={30} s={.72} />
      <Rain x={26} y={52} w={64} rows={1} />
      <Pipe d="M104 300V196" />
      <Arrow x1={104} y1={292} x2={104} y2={214} colour={W.deep} width={2} />
      <rect x={8} y={290} width={372} height={32} rx="11" fill={panelFill} stroke={W.waterLine} strokeWidth="1.8" />
      <text x={20} y={311} fontSize="13" fontWeight="700" fill={W.deep}>or ground water, or sea water after desalination</text>
      <Num n={1} x={118} y={30} /><Num n={2} x={52} y={128} /><Num n={3} x={142} y={116} /><Num n={4} x={246} y={116} /><Num n={5} x={372} y={116} /><Num n={6} x={492} y={116} />
    </g> : <text x={270} y={280} textAnchor="middle" fontSize="14" fontWeight="700" fill={stage === 'treat' ? ink : W.amberInk}>{notes[stage]}</text>}
  </Diagram>
}
function FlowQuestion({ assessment }: { assessment: boolean }) {
  return <Diagram viewBox="0 0 540 250" title={assessment ? 'A lake containing twigs and microbes, two unlabelled treatment stages numbered 1 and 2, and a tap.' : 'A lake containing twigs and microbes, then stage 1, filtration, which removes the twigs and solid bits, then stage 2, sterilisation, which kills the microbes, then a tap.'}>
    <path d="M10 90Q24 176 74 178Q118 178 124 130V90Z" fill={W.water} />
    <path d="M10 90Q66 94 124 90" stroke={W.waterLine} strokeWidth="2" fill="none" />
    <path d="M4 82Q18 186 74 186Q128 186 132 120" fill="none" stroke={W.soilLine} strokeWidth="3" />
    <Twig x={40} y={106} len={30} angle={-8} /><Twig x={92} y={134} len={24} angle={24} /><Twig x={52} y={150} len={20} angle={-30} />
    <Microbe x={78} y={108} s={.9} seed={2} /><Microbe x={36} y={134} s={.9} angle={30} seed={4} /><Microbe x={98} y={160} s={.8} seed={6} />
    <text x={68} y={216} textAnchor="middle" fontSize="14" fontWeight="700" fill={W.deep}>lake</text>
    {[0, 1].map(k => { const x = 170 + k * 130; return <g key={k}>
      <rect x={x} y={92} width={100} height={70} rx="14" fill="white" stroke={ink} strokeWidth="2" strokeDasharray={assessment ? '6 5' : undefined} />
      <Num n={k + 1} x={x + 50} y={80} />
      {!assessment && <text x={x + 50} y={133} textAnchor="middle" fontSize="14" fontWeight="700" fill={k ? W.bug : W.sandLine}>{k ? 'sterilise' : 'filter'}</text>}
    </g> })}
    <Arrow x1={134} y1={127} x2={164} y2={127} colour={ink} width={2.4} /><Arrow x1={274} y1={127} x2={294} y2={127} colour={ink} width={2.4} /><Arrow x1={404} y1={127} x2={430} y2={127} colour={ink} width={2.4} />
    <Tap x={478} y={110} />
    <Drops x={504} y={138} n={2} />
    <text x={488} y={216} textAnchor="middle" fontSize="14" fontWeight="700" fill={W.deep}>tap</text>
  </Diagram>
}

export function PotableVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'potable-meaning': return <Meaning />
    case 'potable-notpure': return <NotPure />
    case 'potable-rules': return <Rules />
    case 'potable-rain': return <Landscape focus="rain" />
    case 'potable-sources': return <Landscape focus="sources" />
    case 'potable-uk': return <UkMap />
    case 'potable-dry': return <Dry />
    case 'potable-salty': return <Salty />
    case 'potable-distill': return <Distill />
    case 'potable-membrane': return <Membrane />
    case 'potable-cost': return <Cost />
    case 'potable-treat': return <Works stage="treat" />
    case 'potable-mesh': return <Works stage="mesh" />
    case 'potable-beds': return <Works stage="beds" />
    case 'potable-sterilise': return <Works stage="sterilise" />
    case 'potable-route': return <Works stage="route" />
    case 'potable-q-flow': return <FlowQuestion assessment={assessment} />
    default: return <Works stage="route" />
  }
}
