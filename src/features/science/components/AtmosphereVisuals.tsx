import { useId, type ReactNode } from 'react'
import { blob } from './InfectionVisuals'

/*
 * Chemistry Lesson 45: how the atmosphere evolved. Original, code-native schematics; not to scale. Focus ids start with 'atmos-'.
 * The shared pieces (palette, gas dots, Sun, clouds, plants, sea) are also used by GreenhouseVisuals.tsx (Lesson 46),
 * so the two lessons look like one set.
 *
 * Colour code (the same as the Biology carbon cycle and greenhouse drawings):
 *   purple = carbon dioxide, teal = oxygen, blue = water / water vapour, yellow = the Sun and its light,
 *   green = plants and algae, grey-blue = nitrogen, pale orange = methane, pale grey = ammonia and noble gases,
 *   orange = thermal (heat) radiation given out by the Earth, warm brown = volcanoes and rock.
 * Gas particles are small labelled dots (CO₂, O₂ …), not full chemical diagrams.
 */
export const atmosPalette = {
  ink: '#375a73', muted: '#657a89',
  purple: '#8f6fc4', purpleFill: '#efe8f9',
  teal: '#3a9a8a', tealFill: '#d5efe9',
  water: '#55acd0', waterDeep: '#3f93bd', waterFill: '#dcf0f8', sea: '#cfe8f3', seaLine: '#6fb3d3',
  yellow: '#efc75d', sunLine: '#b8902e', sunFill: '#fbe7a6',
  heat: '#dd7f3e', heatFill: '#fbe0cb',
  nitro: '#7488a0', nitroFill: '#e2e8f0',
  pale: '#a39f97', paleFill: '#f1efeb',
  methane: '#d68a45', methaneFill: '#fbe3cc',
  leafFill: '#acd79f', leafLine: '#4f8f5a', grass: '#d6ebc8', algae: '#8cc47e',
  rock: '#ecdfca', rockLine: '#b89c76', rockDeep: '#dcc8a8',
  volcano: '#cdb5a0', volcanoLine: '#86695a', lava: '#e0703f', lavaGlow: '#f6b36a',
  smoke: '#e2ddd7', smokeLine: '#aaa198',
  earlySky: '#f4eee7', sky: '#eef6fb', space: '#eef1f8',
  amber: '#c98f2c', amberFill: '#f6dfa5',
  panelFill: '#f7fafc', panelLine: '#cfdde7', good: '#4f9a74',
}
const P = atmosPalette
const { ink, muted } = P

type Pt = [number, number]
export type AtmosPt = Pt
const r1 = (n: number) => Math.round(n * 10) / 10

// ---------- Shared pieces (exported for GreenhouseVisuals.tsx) ----------
export function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
export function Lines({ x, y, lines, anchor = 'start', size = 14, weight = 700, colour = ink, gap = 3 }: { x: number; y: number; lines: string[]; anchor?: 'start' | 'middle' | 'end'; size?: number; weight?: number; colour?: string; gap?: number }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={colour}>{lines.map((l, i) => <tspan key={i} x={x} dy={i ? size + gap : 0}>{l}</tspan>)}</text>
}
export function Caption({ text, y = 288, x = 270, colour = muted }: { text: string; y?: number; x?: number; colour?: string }) {
  return <text x={x} y={y} textAnchor="middle" fontSize="14" fontWeight="600" fill={colour}>{text}</text>
}
export function Leader({ from, to, colour = ink }: { from: Pt; to: Pt; colour?: string }) {
  return <g><path d={`M${from[0]} ${from[1]}L${to[0]} ${to[1]}`} stroke={colour} strokeWidth="1.4" /><circle cx={to[0]} cy={to[1]} r="2.6" fill={colour} /></g>
}
export function Arrow({ from, to, colour = ink, width = 2.4, dashed = false }: { from: Pt; to: Pt; colour?: string; width?: number; dashed?: boolean }) {
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]), h = 6 + width * 1.5
  const p = (d: number, s: number): Pt => [r1(to[0] - Math.cos(a) * d + Math.cos(a + Math.PI / 2) * s), r1(to[1] - Math.sin(a) * d + Math.sin(a + Math.PI / 2) * s)]
  const [b1, b2, base] = [p(h, h * .6), p(h, -h * .6), p(h * .7, 0)]
  return <g><path d={`M${from[0]} ${from[1]}L${base[0]} ${base[1]}`} stroke={colour} strokeWidth={width} fill="none" strokeDasharray={dashed ? '6 6' : undefined} /><path d={`M${to[0]} ${to[1]}L${b1[0]} ${b1[1]}L${b2[0]} ${b2[1]}Z`} fill={colour} stroke={colour} strokeWidth="1.2" /></g>
}
// A soft curved arrow (quadratic), for gas moving from one place to another.
export function CurveArrow({ from, to, bend = 20, colour = ink, width = 2.4, dashed = false }: { from: Pt; to: Pt; bend?: number; colour?: string; width?: number; dashed?: boolean }) {
  const mx = (from[0] + to[0]) / 2, my = (from[1] + to[1]) / 2, a = Math.atan2(to[1] - from[1], to[0] - from[0])
  const c: Pt = [r1(mx + Math.cos(a + Math.PI / 2) * bend), r1(my + Math.sin(a + Math.PI / 2) * bend)]
  const ta = Math.atan2(to[1] - c[1], to[0] - c[0]), h = 6 + width * 1.5
  const p = (d: number, s: number): Pt => [r1(to[0] - Math.cos(ta) * d + Math.cos(ta + Math.PI / 2) * s), r1(to[1] - Math.sin(ta) * d + Math.sin(ta + Math.PI / 2) * s)]
  const [b1, b2, base] = [p(h, h * .6), p(h, -h * .6), p(h * .7, 0)]
  return <g><path d={`M${from[0]} ${from[1]}Q${c[0]} ${c[1]} ${base[0]} ${base[1]}`} stroke={colour} strokeWidth={width} fill="none" strokeDasharray={dashed ? '6 6' : undefined} /><path d={`M${to[0]} ${to[1]}L${b1[0]} ${b1[1]}L${b2[0]} ${b2[1]}Z`} fill={colour} stroke={colour} strokeWidth="1.2" /></g>
}
export type Mode = 'on' | 'active' | 'off'
export function Num({ n, x, y, mode = 'on', colour = ink }: { n: number; x: number; y: number; mode?: Mode; colour?: string }) {
  const active = mode === 'active'
  return <g opacity={mode === 'off' ? .4 : 1}>
    <circle cx={x} cy={y} r="12" fill={active ? colour : 'white'} stroke={active ? colour : ink} strokeWidth="2" />
    <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={active ? 'white' : ink}>{n}</text>
  </g>
}
export type KeyItem = { n: number; lines: string[]; colour?: string }
// The numbered key beside a scene, as in the plant-transport lesson: the current step bold and coloured, the rest quiet.
export function Key({ items, modes, x = 392, y = 56, gap = 56 }: { items: KeyItem[]; modes: Mode[]; x?: number; y?: number; gap?: number }) {
  return <g>{items.map((item, i) => {
    const mode = modes[i], active = mode === 'active', colour = item.colour || ink, cy = y + i * gap
    return <g key={item.n} opacity={mode === 'off' ? .42 : 1}>
      <circle cx={x} cy={cy} r="12" fill={active ? colour : 'white'} stroke={active ? colour : ink} strokeWidth="2" />
      <text x={x} y={cy + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={active ? 'white' : ink}>{item.n}</text>
      <text x={x + 20} y={cy + 5} fontSize="13.5" fontWeight={active ? 700 : 600} fill={active ? colour : ink}>{item.lines.map((l, j) => <tspan key={j} x={x + 20} dy={j ? 16 : 0}>{l}</tspan>)}</text>
    </g>
  })}</g>
}
export function Sun({ x, y, r = 20 }: { x: number; y: number; r?: number }) {
  return <g>{Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2; return <line key={i} x1={r1(x + Math.cos(a) * (r + 4))} y1={r1(y + Math.sin(a) * (r + 4))} x2={r1(x + Math.cos(a) * (r + 10))} y2={r1(y + Math.sin(a) * (r + 10))} stroke={P.sunLine} strokeWidth="2.2" /> })}
    <circle cx={x} cy={y} r={r} fill={P.yellow} stroke={P.sunLine} strokeWidth="2" /></g>
}
const CLOUD_BUMPS = [[-46, 10, 14], [-28, -2, 20], [-4, -12, 24], [22, -6, 20], [42, 6, 15]]
export function Cloud({ x, y, s = 1, fill = '#ffffff', line = '#9fb3c2' }: { x: number; y: number; s?: number; fill?: string; line?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    {CLOUD_BUMPS.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r + 2} fill={line} />)}<rect x={-62} y={6} width={120} height={22} rx="11" fill={line} />
    {CLOUD_BUMPS.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={fill} />)}<rect x={-60} y={8} width={116} height={18} rx="9" fill={fill} />
  </g>
}
export type Gas = 'co2' | 'o2' | 'n2' | 'h2o' | 'ch4' | 'nh3' | 'noble'
export const GAS_STYLE: Record<Gas, { fill: string; line: string; text: string }> = {
  co2: { fill: P.purpleFill, line: P.purple, text: 'CO₂' },
  o2: { fill: P.tealFill, line: P.teal, text: 'O₂' },
  n2: { fill: P.nitroFill, line: P.nitro, text: 'N₂' },
  h2o: { fill: P.waterFill, line: P.water, text: 'H₂O' },
  ch4: { fill: P.methaneFill, line: P.methane, text: 'CH₄' },
  nh3: { fill: P.paleFill, line: P.pale, text: 'NH₃' },
  noble: { fill: P.paleFill, line: P.pale, text: 'Ar' },
}
// One gas particle: a soft round dot with its formula (label) or a small plain dot (label = false).
export function GasDot({ x, y, gas, r = 14, label = true, opacity = 1, dashed = false }: { x: number; y: number; gas: Gas; r?: number; label?: boolean; opacity?: number; dashed?: boolean }) {
  const s = GAS_STYLE[gas]
  return <g opacity={opacity}>
    <circle cx={x} cy={y} r={r} fill={dashed ? 'white' : s.fill} stroke={s.line} strokeWidth={label ? 1.8 : 2} strokeDasharray={dashed ? '4 3' : undefined} />
    {label && <text x={x} y={y + 4.5} textAnchor="middle" fontSize="12" fontWeight="700" fill={s.line}>{s.text}</text>}
  </g>
}
export function Plant({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0C-2 -30 2 -60 0 -92" fill="none" stroke={P.leafLine} strokeWidth="4" />
    {[[-1, -30], [1, -50], [-1, -68], [1, -82]].map(([side, ly], i) => <path key={i} d={`M0 ${ly}C${side * 10} ${ly - 18} ${side * 34} ${ly - 20} ${side * 42} ${ly - 12}C${side * 32} ${ly} ${side * 12} ${ly + 4} 0 ${ly}Z`} fill={P.leafFill} stroke={P.leafLine} strokeWidth="1.8" />)}
  </g>
}
export function Tree({ x, y, s = 1, seed = 3, stump = false }: { x: number; y: number; s?: number; seed?: number; stump?: boolean }) {
  if (stump) return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-9 0V-14L-4 -18L0 -14L4 -19L9 -15V0Z" fill="#b08a5e" stroke="#7d5d3a" strokeWidth="1.6" /><ellipse cx="0" cy="-15.5" rx="8.5" ry="3" fill="#dcc095" stroke="#7d5d3a" strokeWidth="1.2" /></g>
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-6 0L-5 -46H5L6 0Z" fill="#b08a5e" stroke="#7d5d3a" strokeWidth="1.6" />
    <path d={blob(0, -72, 34, 30, seed, .1)} fill={P.leafFill} stroke={P.leafLine} strokeWidth="2" />
  </g>
}
// Algae: small clusters of round green cells and a few soft strands.
export function Algae({ x, y, s = 1, seed = 1 }: { x: number; y: number; s?: number; seed?: number }) {
  const cells: [number, number, number][] = [[0, 0, 7], [11, -4, 6], [6, 8, 6.5], [-9, 6, 5.5], [-6, -9, 5], [16, 7, 5], [2, -14, 4.5]]
  return <g transform={`translate(${x} ${y}) scale(${s}) rotate(${seed * 37 % 360})`}>
    {cells.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={P.algae} stroke={P.leafLine} strokeWidth="1.3" />)}
    {cells.slice(0, 4).map(([cx, cy], i) => <circle key={i} cx={cx - 1.5} cy={cy - 1.5} r="1.6" fill="#dff0d6" />)}
  </g>
}
export function Seaweed({ x, y, h = 60, flip = 1 }: { x: number; y: number; h?: number; flip?: 1 | -1 }) {
  return <path d={`M${x} ${y}c${flip * 10} ${-h * .25} ${-flip * 10} ${-h * .5} 0 ${-h * .75}c${flip * 6} ${-h * .1} ${flip * 4} ${-h * .2} ${-flip * 2} ${-h * .25}c${flip * 12} ${h * .1} ${flip * 16} ${h * .35} ${flip * 8} ${h * .55}c${-flip * 10} ${h * .2} ${flip * 8} ${h * .3} ${flip * 6} ${h * .45}Z`} fill={P.algae} stroke={P.leafLine} strokeWidth="1.5" />
}
// A gentle wavy water surface from x0 to x1 at height y, closed down to bottom.
export function seaPath(x0: number, x1: number, y: number, bottom: number, amp = 4, wave = 40) {
  let d = `M${x0} ${y}`
  for (let x = x0; x < x1; x += wave) d += `q${wave / 4} ${-amp} ${wave / 2} 0t${Math.min(wave / 2, x1 - x - wave / 2)} 0`
  return `${d}L${x1} ${bottom}L${x0} ${bottom}Z`
}
export function surfacePath(x0: number, x1: number, y: number, amp = 4, wave = 40) {
  let d = `M${x0} ${y}`
  for (let x = x0; x < x1; x += wave) d += `q${wave / 4} ${-amp} ${wave / 2} 0t${Math.min(wave / 2, x1 - x - wave / 2)} 0`
  return d
}
export function Rabbit({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const fur = '#dcc6a8', furLine = '#9c7e5c'
  return <g transform={`translate(${x} ${y}) scale(${-s} ${s})`} stroke={furLine} strokeWidth="1.6">
    <ellipse cx="-2" cy="-20" rx="24" ry="17" fill={fur} />
    <ellipse cx="-8" cy="-4" rx="14" ry="5" fill={fur} />
    <ellipse cx="17" cy="-54" rx="4.5" ry="14" transform="rotate(-12 17 -54)" fill={fur} /><ellipse cx="25" cy="-53" rx="4.5" ry="14" transform="rotate(10 25 -53)" fill={fur} />
    <circle cx="22" cy="-33" r="12" fill={fur} />
    <circle cx="-25" cy="-24" r="6" fill="#fffaf2" />
    <circle cx="27" cy="-35" r="1.8" fill={ink} stroke="none" /><circle cx="33.5" cy="-31" r="1.6" fill="#b87a7a" stroke="none" />
  </g>
}
export function Shell({ x, y, s = 1, fill = '#f6efe2', line = '#a88f6c' }: { x: number; y: number; s?: number; fill?: string; line?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-14 4C-16 -8 -8 -16 0 -16C8 -16 16 -8 14 4Q0 9 -14 4Z" fill={fill} stroke={line} strokeWidth="1.6" />
    <path d="M0 6V-15M-7 5L-5 -13M7 5L5 -13" stroke={line} strokeWidth="1.2" fill="none" />
  </g>
}

// A rounded scene panel: background, clipped contents, soft border.
export function Framed({ x = 10, y = 10, w = 520, h = 280, fill = P.sky, children }: { x?: number; y?: number; w?: number; h?: number; fill?: string; children: ReactNode }) {
  const clip = useId().replace(/:/g, '')
  return <g>
    <clipPath id={clip}><rect x={x} y={y} width={w} height={h} rx="14" /></clipPath>
    <rect x={x} y={y} width={w} height={h} rx="14" fill={fill} />
    <g clipPath={`url(#${clip})`}>{children}</g>
    <rect x={x} y={y} width={w} height={h} rx="14" fill="none" stroke={P.panelLine} strokeWidth="1.4" />
  </g>
}

// ---------- Volcanic scenes ----------
function Volcano({ x, base, w, h, plume = 3, drift = 1, lavaSide = -1 }: { x: number; base: number; w: number; h: number; plume?: number; drift?: number; lavaSide?: 1 | -1 }) {
  const cw = Math.max(10, w * .09), top = base - h
  const d = `M${r1(x - w / 2)} ${base}C${r1(x - w * .26)} ${r1(base - h * .3)} ${r1(x - cw * 1.7)} ${r1(base - h * .78)} ${r1(x - cw)} ${top}Q${x} ${top + 7} ${r1(x + cw)} ${top}C${r1(x + cw * 1.7)} ${r1(base - h * .78)} ${r1(x + w * .26)} ${r1(base - h * .3)} ${r1(x + w / 2)} ${base}Z`
  const puffs = Array.from({ length: plume }, (_, i) => [r1(x + drift * i * 9), r1(top - 12 - i * 17), 9 + i * 3.2])
  return <g>
    {puffs.map(([cx, cy, r], i) => <circle key={`o${i}`} cx={cx} cy={cy} r={r + 1.8} fill={P.smokeLine} />)}
    {puffs.map(([cx, cy, r], i) => <circle key={`i${i}`} cx={cx} cy={cy} r={r} fill={P.smoke} />)}
    <path d={d} fill={P.volcano} stroke={P.volcanoLine} strokeWidth="2" />
    <path d={`M${r1(x - cw * .8)} ${top + 2}Q${x} ${top + 8} ${r1(x + cw * .8)} ${top + 2}`} stroke={P.lava} strokeWidth="4" fill="none" />
    <path d={`M${r1(x + lavaSide * cw * .6)} ${top + 4}c${lavaSide * 3} ${r1(h * .12)} ${lavaSide * 1} ${r1(h * .2)} ${lavaSide * 7} ${r1(h * .32)}`} stroke={P.lava} strokeWidth="3.4" fill="none" />
  </g>
}
function Ground({ y = 252, bottom = 290, x0 = 10, x1 = 530 }: { y?: number; bottom?: number; x0?: number; x1?: number }) {
  return <path d={`M${x0} ${y + 4}C${x0 + 80} ${y - 6} ${x0 + 160} ${y + 8} ${(x0 + x1) / 2} ${y}S${x1 - 70} ${y - 4} ${x1} ${y + 2}V${bottom}H${x0}Z`} fill="#dcc6a9" stroke="#a98c6c" strokeWidth="2" />
}
function EarlyScene({ faded = false }: { faded?: boolean }) {
  const clip = useId().replace(/:/g, '')
  return <g opacity={faded ? .35 : 1}>
    <clipPath id={clip}><rect x={10} y={10} width={520} height={280} rx="14" /></clipPath>
    <rect x={10} y={10} width={520} height={280} rx="14" fill={P.earlySky} />
    <g clipPath={`url(#${clip})`}>
      <Volcano x={60} base={262} w={110} h={58} plume={2} drift={1} />
      <Volcano x={170} base={262} w={180} h={112} plume={4} drift={-1} lavaSide={1} />
      <Volcano x={330} base={264} w={220} h={146} plume={4} drift={1} />
      <Volcano x={470} base={262} w={150} h={84} plume={3} drift={-1} />
      <Ground />
    </g>
  </g>
}
function Volcanoes() {
  return <Diagram title="The early Earth, about 4.6 billion years ago: the surface is covered in volcanoes erupting and giving out gases. There are no oceans and no plants.">
    <EarlyScene />
    <Lines x={28} y={40} lines={['about 4.6 billion', 'years ago']} />
    <Lines x={446} y={40} anchor="middle" lines={['volcanoes give', 'out gases']} colour={P.volcanoLine} />
    <Leader from={[410, 64]} to={[356, 64]} colour={P.volcanoLine} />
    <Caption y={282} text="No oceans and no plants yet" colour={ink} />
  </Diagram>
}
function Theory() {
  return <Diagram title="The same volcanic landscape, faded, with a question mark over the sky: the early atmosphere is our best theory, because it was so long ago that evidence is hard to find.">
    <EarlyScene faded />
    <text x={130} y={122} textAnchor="middle" fontSize="80" fontWeight="700" fill={muted} opacity=".35">?</text>
    {/* thought bubble */}
    <path d={blob(360, 84, 118, 44, 7, .06)} fill="white" stroke={P.panelLine} strokeWidth="2" />
    <circle cx={254} cy={138} r="8" fill="white" stroke={P.panelLine} strokeWidth="2" /><circle cx={236} cy={156} r="5" fill="white" stroke={P.panelLine} strokeWidth="2" />
    <text x={360} y={80} textAnchor="middle" fontSize="18" fontWeight="700" fill={ink}>our best theory</text>
    <text x={360} y={102} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>not a certain fact</text>
    <rect x={110} y={228} width={320} height={36} rx="18" fill="white" stroke={P.panelLine} strokeWidth="1.6" />
    <text x={270} y={251} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>very old, so hard to get evidence</text>
  </Diagram>
}

// The early sky as a band of gas particles above one volcano. Mostly carbon dioxide; no oxygen.
const EARLY_DOTS: [number, number, Gas][] = [
  [48, 52, 'co2'], [98, 50, 'h2o'], [148, 54, 'co2'], [198, 50, 'n2'], [248, 54, 'co2'], [298, 50, 'co2'], [338, 58, 'ch4'],
  [72, 94, 'co2'], [122, 98, 'co2'], [172, 94, 'co2'], [222, 98, 'co2'], [272, 94, 'h2o'], [320, 98, 'co2'],
  [46, 136, 'nh3'], [96, 134, 'co2'], [146, 138, 'n2'], [246, 138, 'co2'], [296, 134, 'h2o'], [338, 138, 'co2'], [196, 132, 'n2'],
]
function GasBand({ highlight }: { highlight: 'co2' | 'others' }) {
  return <g>
    <rect x={10} y={10} width={356} height={280} rx="14" fill={P.earlySky} />
    <rect x={18} y={22} width={340} height={140} rx="22" fill="#fbf8f4" stroke="#d9cbb8" strokeWidth="1.6" strokeDasharray="6 5" />
    <Volcano x={190} base={276} w={220} h={78} plume={2} drift={1} />
    <path d="M10 272C90 264 150 278 190 272S320 266 366 272V276C366 284 360 290 352 290H24C16 290 10 284 10 276Z" fill="#dcc6a9" stroke="#a98c6c" strokeWidth="1.6" />
    {EARLY_DOTS.map(([x, y, g], i) => <GasDot key={i} x={x} y={y} gas={g} opacity={(g === 'co2') === (highlight === 'co2') ? 1 : .3} />)}
  </g>
}
function EarlyGases() {
  return <Diagram title="The early atmosphere above a volcano, shown as gas particles: most are carbon dioxide and there is little or no oxygen, like the atmospheres of Mars and Venus today.">
    <GasBand highlight="co2" />
    <GasDot x={392} y={50} gas="co2" />
    <Lines x={414} y={46} lines={['mostly carbon', 'dioxide']} colour={P.purple} />
    <GasDot x={392} y={122} gas="o2" dashed />
    <path d="M380 134L404 110" stroke={P.teal} strokeWidth="2" />
    <Lines x={414} y={118} lines={['little or no', 'oxygen']} colour={P.teal} />
    <rect x={376} y={184} width={156} height={92} rx="16" fill={P.panelFill} stroke={P.panelLine} strokeWidth="1.5" />
    <circle cx={406} cy={214} r="14" fill="#e9b9a0" stroke="#b56f52" strokeWidth="1.6" />
    <circle cx={446} cy={214} r="16" fill="#f5e3b5" stroke="#bfa05c" strokeWidth="1.6" />
    <Lines x={454} y={250} anchor="middle" lines={['like Mars and', 'Venus today']} size={13} weight={600} colour={muted} gap={2} />
  </Diagram>
}
function VolcanoOther() {
  return <Diagram title="Volcanoes also gave out nitrogen, which built up over time, water vapour, and small amounts of methane and ammonia. Carbon dioxide was still the main gas.">
    <GasBand highlight="others" />
    <GasDot x={392} y={44} gas="n2" />
    <Lines x={414} y={40} lines={['nitrogen: builds', 'up over time']} colour={P.nitro} />
    <GasDot x={392} y={104} gas="h2o" />
    <Lines x={414} y={109} lines={['water vapour']} colour={P.waterDeep} />
    <GasDot x={392} y={156} gas="ch4" /><GasDot x={392} y={190} gas="nh3" />
    <Lines x={414} y={162} lines={['methane and', 'ammonia: small', 'amounts']} size={13} colour="#8a7f70" gap={2} />
    <GasDot x={392} y={250} gas="co2" opacity={.6} />
    <Lines x={414} y={246} lines={['carbon dioxide:', 'still the most']} size={13} weight={600} colour={P.purple} gap={2} />
  </Diagram>
}

// ---------- The oceans form: three cooling steps ----------
function StepCard({ n, x, w = 160, fill, title, children }: { n: number; x: number; w?: number; fill: string; title: string[]; children: ReactNode }) {
  const clip = useId().replace(/:/g, '')
  return <g>
    <clipPath id={clip}><rect x={x} y={22} width={w} height={172} rx="18" /></clipPath>
    <rect x={x} y={22} width={w} height={172} rx="18" fill={fill} />
    <g clipPath={`url(#${clip})`}>{children}</g>
    <rect x={x} y={22} width={w} height={172} rx="18" fill="none" stroke={P.panelLine} strokeWidth="1.6" />
    <Num n={n} x={x + 22} y={44} />
    <Lines x={x + w / 2} y={218} anchor="middle" lines={title} size={14} />
  </g>
}
function Wisp({ x, y, h = 26, colour = P.water }: { x: number; y: number; h?: number; colour?: string }) {
  return <path d={`M${x} ${y}q5 ${-h / 4} 0 ${-h / 2}t0 ${-h / 2}`} stroke={colour} strokeWidth="2.5" fill="none" />
}
function Drop({ x, y, r = 5 }: { x: number; y: number; r?: number }) {
  return <path d={`M${x} ${y - r * 1.7}C${x + r * .4} ${y - r} ${x + r} ${y - r * .4} ${x + r} ${y + r * .2}A${r} ${r} 0 0 1 ${x - r} ${y + r * .2}C${x - r} ${y - r * .4} ${x - r * .4} ${y - r} ${x} ${y - r * 1.7}Z`} fill={P.waterFill} stroke={P.water} strokeWidth="1.5" />
}
function Oceans() {
  const hot = '#d9a98a', hotLine = '#a86d4f', cool = '#dcc6a9', coolLine = '#a98c6c'
  return <Diagram title="The oceans form in three steps. 1: the Earth is hot and there is water vapour in the air. 2: as it cools, the water vapour condenses. 3: liquid water collects and forms the oceans.">
    <StepCard n={1} x={12} fill="#fcefe4" title={['hot: water vapour', 'in the air']}>
      <path d="M12 160C50 150 90 166 130 156S170 158 172 158V200H12Z" fill={hot} stroke={hotLine} strokeWidth="2" />
      {[44, 84, 124].map(x => <Wisp key={x} x={x} y={146} h={34} />)}
      <GasDot x={64} y={82} gas="h2o" r={13} /><GasDot x={116} y={70} gas="h2o" r={13} /><GasDot x={140} y={108} gas="h2o" r={13} />
    </StepCard>
    <StepCard n={2} x={190} fill="#f4f6f8" title={['cooler: vapour', 'condenses']}>
      <path d="M190 164C230 156 270 168 310 160S348 162 350 162V200H190Z" fill={cool} stroke={coolLine} strokeWidth="2" />
      <Cloud x={272} y={78} s={.9} fill="#f4f8fb" />
      {[[240, 124], [262, 138], [284, 122], [306, 140], [254, 152], [296, 156]].map(([x, y], i) => <Drop key={i} x={x} y={y} r={4.5} />)}
    </StepCard>
    <StepCard n={3} x={368} fill="#eef6fb" title={['liquid water', 'collects: oceans']}>
      <path d={seaPath(376, 522, 126, 200, 3, 36)} fill={P.sea} stroke={P.seaLine} strokeWidth="1.8" />
      <path d="M368 104C392 104 398 160 432 166H466C502 162 508 104 530 102V200H368Z" fill={cool} stroke={coolLine} strokeWidth="2" />
      <text x={449} y={150} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.waterDeep}>ocean</text>
    </StepCard>
    <Arrow from={[174, 108]} to={[188, 108]} width={2.2} /><Arrow from={[352, 108]} to={[366, 108]} width={2.2} />
    <Caption y={284} text="As the Earth cooled, the oceans formed" />
  </Diagram>
}

// ---------- Phase 2: carbon dioxide removed ----------
function Dissolve() {
  const grad = useId().replace(/:/g, '')
  const air: Pt[] = [[64, 112], [144, 98], [224, 116], [304, 100]]
  const inSea: Pt[] = [[60, 206], [120, 238], [180, 200], [236, 250], [300, 212], [360, 244], [420, 204], [470, 240], [500, 196]]
  const clip = useId().replace(/:/g, '')
  return <Diagram title="Carbon dioxide particles move from the air into the ocean and dissolve. Less carbon dioxide is left in the air.">
    <clipPath id={clip}><rect x={10} y={10} width={520} height={280} rx="14" /></clipPath>
    <defs><linearGradient id={grad} x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor={P.purple} stopOpacity=".32" /><stop offset="1" stopColor={P.purple} stopOpacity=".04" /></linearGradient></defs>
    <g clipPath={`url(#${clip})`}>
    <rect x={10} y={10} width={520} height={280} fill={P.earlySky} />
    <rect x={24} y={22} width={330} height={34} rx="17" fill={`url(#${grad})`} />
    <text x={40} y={44} fontSize="13" fontWeight="700" fill={P.purple}>less and less carbon dioxide in the air</text>
    <path d={seaPath(6, 534, 150, 296, 5, 48)} fill={P.sea} stroke={P.seaLine} strokeWidth="2" />
    </g>
    {air.map(([x, y], i) => <g key={i}><GasDot x={x} y={y} gas="co2" r={13} /><Arrow from={[x + 4, y + 18]} to={[x + 10, y + 66]} colour={P.purple} width={2.2} /></g>)}
    {inSea.map(([x, y], i) => <GasDot key={i} x={x} y={y} gas="co2" r={10} label={false} opacity={.75} />)}
    <Lines x={440} y={92} anchor="middle" lines={['carbon dioxide', 'dissolves in', 'the oceans']} colour={P.purple} />
    <text x={270} y={280} textAnchor="middle" fontSize="14" fontWeight="700" fill={P.waterDeep}>ocean</text>
  </Diagram>
}
const GRAINS: Pt[] = [[40, 244], [56, 240], [72, 245], [88, 241], [104, 245], [120, 240], [136, 244], [152, 241], [168, 245], [184, 240], [200, 244], [216, 241], [232, 245], [248, 240], [264, 244], [280, 241], [296, 245], [312, 240], [328, 244], [344, 241],
  [48, 234], [80, 232], [112, 234], [144, 232], [176, 234], [208, 232], [240, 234], [272, 232], [304, 234], [336, 232]]
function Grain({ x, y, r = 5 }: { x: number; y: number; r?: number }) {
  return <ellipse cx={x} cy={y} rx={r * 1.25} ry={r * .85} fill="#f4ecdc" stroke="#a88f6c" strokeWidth="1.3" />
}
function Sediments() {
  return <Diagram title="Dissolved carbon dioxide in the sea forms carbonates. These form small solid particles that settle to the seabed as a layer of sediment. This is precipitation: an insoluble solid forms from a solution.">
    <rect x={14} y={20} width={344} height={264} rx="16" fill={P.sky} />
    <path d={seaPath(14, 358, 44, 236, 4, 43)} fill={P.sea} stroke={P.seaLine} strokeWidth="1.8" />
    <path d="M14 228H358V268C358 277 351 284 342 284H30C21 284 14 277 14 268Z" fill={P.rock} />
    <rect x={14} y={20} width={344} height={264} rx="16" fill="none" stroke={P.panelLine} strokeWidth="1.6" />
    <path d="M14 228H358" stroke={P.rockLine} strokeWidth="1.6" />
    {/* dissolved carbon dioxide near the surface */}
    {[[48, 78], [104, 92], [160, 74], [216, 90], [272, 76], [326, 92]].map(([x, y], i) => <GasDot key={i} x={x} y={y} gas="co2" r={13} />)}
    {/* solid grains forming and sinking */}
    {[[70, 138], [128, 150], [186, 132], [244, 152], [302, 140]].map(([x, y], i) => <g key={i}><Grain x={x} y={y} /><path d={`M${x} ${y + 10}v22`} stroke={muted} strokeWidth="1.6" strokeDasharray="3 4" /><path d={`M${x - 4} ${y + 28}l4 5l4 -5`} stroke={muted} strokeWidth="1.6" fill="none" /></g>)}
    {GRAINS.map(([x, y], i) => <Grain key={i} x={x} y={y} r={4.6} />)}
    <text x={186} y={272} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.rockLine}>seabed</text>
    <Lines x={374} y={126} lines={['carbonates form']} />
    <Leader from={[370, 132]} to={[310, 140]} />
    <Lines x={374} y={206} lines={['solid particles', 'settle: sediments']} />
    <Leader from={[370, 216]} to={[340, 234]} />
    <rect x={368} y={20} width={166} height={84} rx="14" fill="white" stroke={muted} strokeWidth="1.6" strokeDasharray="5 4" />
    <Lines x={380} y={42} lines={['Precipitation:']} size={13} colour={ink} />
    <Lines x={380} y={61} lines={['an insoluble solid', 'forms from a solution']} size={12} weight={600} colour={muted} gap={4} />
  </Diagram>
}
function PhotoUptake() {
  return <Diagram title="Algae in the sea and a green plant on land both take in carbon dioxide from the air for photosynthesis, using light from the Sun.">
    <Framed><path d={seaPath(6, 536, 150, 296, 4, 40)} fill={P.sea} stroke={P.seaLine} strokeWidth="1.8" />
    <path d="M262 296C280 180 300 140 336 132C400 124 470 130 540 126V296Z" fill={P.grass} stroke={P.leafLine} strokeWidth="1.8" /></Framed>
    <Sun x={52} y={50} r={20} />
    <Seaweed x={60} y={288} h={70} /><Seaweed x={80} y={288} h={52} flip={-1} /><Seaweed x={228} y={288} h={60} flip={-1} />
    <Algae x={120} y={200} /><Algae x={170} y={226} seed={3} /><Algae x={140} y={252} s={.9} seed={5} /><Algae x={206} y={196} s={.85} seed={2} />
    <Plant x={430} y={150} s={.9} />
    <GasDot x={130} y={96} gas="co2" /><GasDot x={190} y={108} gas="co2" />
    <CurveArrow from={[132, 114]} to={[130, 184]} bend={-10} colour={P.purple} />
    <CurveArrow from={[192, 126]} to={[180, 206]} bend={10} colour={P.purple} />
    <GasDot x={344} y={88} gas="co2" /><GasDot x={506} y={62} gas="co2" />
    <CurveArrow from={[358, 96]} to={[398, 106]} bend={-8} colour={P.purple} />
    <CurveArrow from={[498, 76]} to={[466, 94]} bend={8} colour={P.purple} />
    <text x={150} y={282} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.leafLine}>algae</text>
    <text x={430} y={176} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.leafLine}>green plant</text>
    <Lines x={270} y={40} anchor="middle" lines={['photosynthesis takes in', 'carbon dioxide']} colour={P.purple} />
  </Diagram>
}

// ---------- Carbon locked in rocks and fossil fuels ----------
const LOCK_KEY: KeyItem[] = [
  { n: 1, lines: ['sea creatures die', 'and sink'] },
  { n: 2, lines: ['buried under', 'layers'] },
  { n: 3, lines: ['squashed over', 'millions of years', 'into rock'] },
]
function Locked() {
  const clip = useId().replace(/:/g, '')
  return <Diagram title="A seabed cross-section. 1: sea creatures die and sink. 2: they are buried under layers of sediment. 3: over millions of years the layers are squashed into rock, with a small pocket of oil and gas. The carbon is trapped.">
    <clipPath id={clip}><rect x={14} y={14} width={340} height={272} rx="16" /></clipPath>
    <g clipPath={`url(#${clip})`}>
      <rect x={14} y={14} width={340} height={100} fill={P.sea} />
      <path d={surfacePath(14, 354, 28, 3, 40)} stroke={P.seaLine} strokeWidth="1.8" fill="none" />
      <path d="M14 112C80 106 160 118 240 110S330 108 354 112V150H14Z" fill={P.rock} stroke={P.rockLine} strokeWidth="1.6" />
      <path d="M14 150C90 146 180 154 260 148S340 148 354 150V184H14Z" fill={P.rockDeep} stroke={P.rockLine} strokeWidth="1.6" />
      <path d="M14 184C100 180 190 188 270 182S340 184 354 184V210H14Z" fill="#cdb593" stroke={P.rockLine} strokeWidth="1.6" />
      <path d="M14 210C100 207 190 213 270 208S340 210 354 210V290H14Z" fill="#bfa682" stroke={P.rockLine} strokeWidth="1.6" />
      <path d="M14 236C100 233 190 240 270 234S340 236 354 236M14 262C100 259 190 266 270 260S340 262 354 262" stroke="#a88f6c" strokeWidth="1.2" fill="none" opacity=".7" />
      {/* 1: sinking */}
      <Shell x={96} y={56} s={.9} /><path d="M96 70v22" stroke={muted} strokeWidth="1.6" strokeDasharray="3 4" /><path d="M91 90l5 6l5 -6" stroke={muted} strokeWidth="1.6" fill="none" />
      <Shell x={200} y={78} s={.75} />
      {/* 2: buried shells */}
      <Shell x={90} y={134} s={.7} /><Shell x={180} y={136} s={.7} /><Shell x={270} y={132} s={.7} />
      {/* 3: squashed (flattened) remains and a trapped oil and gas pocket */}
      {[70, 140, 290].map(x => <ellipse key={x} cx={x} cy={198} rx={12} ry={3.5} fill="#f6efe2" stroke="#a88f6c" strokeWidth="1.2" />)}
      <path d="M160 250C160 232 196 224 222 226C250 228 262 240 258 252C250 264 172 266 160 250Z" fill="#6c5a45" stroke="#4d3f31" strokeWidth="1.6" />
      <path d="M170 242C178 232 200 228 222 229C240 231 250 236 252 242C232 238 190 238 170 242Z" fill="#e8e2d6" />
    </g>
    <rect x={14} y={14} width={340} height={272} rx="16" fill="none" stroke={P.panelLine} strokeWidth="1.6" />
    <text x={296} y={48} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.waterDeep}>sea</text>
    <text x={120} y={250} textAnchor="middle" fontSize="12" fontWeight="700" fill="white">oil and gas</text>
    <Num n={1} x={130} y={62} /><Num n={2} x={226} y={132} /><Num n={3} x={36} y={246} />
    <Key items={LOCK_KEY} modes={['on', 'on', 'on']} x={384} y={50} gap={62} />
    <rect x={370} y={224} width={160} height={40} rx="20" fill={P.amberFill} stroke={P.amber} strokeWidth="1.6" />
    <text x={450} y={249} textAnchor="middle" fontSize="15" fontWeight="700" fill="#8a5d17">carbon trapped</text>
    <Leader from={[370, 244]} to={[258, 246]} colour={P.amber} />
  </Diagram>
}
function Fern({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0C2 -12 4 -24 10 -34" stroke={P.leafLine} strokeWidth="2.2" fill="none" />
    {[[-4, 1], [-12, -1], [-20, 1], [-27, -1]].map(([ly, side], i) => <ellipse key={i} cx={r1(2 + ly * -.15 + side * 7)} cy={ly} rx="7" ry="3.2" transform={`rotate(${side * 25} ${r1(2 + ly * -.15 + side * 7)} ${ly})`} fill={P.leafFill} stroke={P.leafLine} strokeWidth="1.2" />)}
  </g>
}
function Plankton({ x, y }: { x: number; y: number }) {
  return <g>{[[0, 0, 6], [14, -6, 5], [8, 10, 4.5], [-10, 8, 4]].map(([dx, dy, r], i) => <g key={i}><circle cx={x + dx} cy={y + dy} r={r} fill="#e1efd9" stroke="#6f9a66" strokeWidth="1.3" /><circle cx={x + dx} cy={y + dy} r={r * .4} fill="#9cc58e" /></g>)}</g>
}
function Fossil() {
  const clip = useId().replace(/:/g, '')
  return <Diagram title="A cross-section of rock layers. A coal seam formed from thick layers of plants. A pocket of crude oil and natural gas formed from plankton. A limestone layer formed from shells and skeletons, which are calcium carbonate.">
    <clipPath id={clip}><rect x={14} y={14} width={250} height={272} rx="16" /></clipPath>
    <g clipPath={`url(#${clip})`}>
      <rect x={14} y={14} width={250} height={272} fill={P.rock} />
      <path d="M14 40C80 34 160 44 264 38V14H14Z" fill={P.grass} stroke={P.leafLine} strokeWidth="1.6" />
      <path d="M14 82C80 78 170 86 264 80V106C170 112 80 104 14 108Z" fill="#5d5650" stroke="#3e3934" strokeWidth="1.6" />
      <path d="M14 132C80 128 170 136 264 130V204C170 210 80 202 14 206Z" fill={P.rockDeep} stroke={P.rockLine} strokeWidth="1.6" />
      <path d="M76 190C84 160 110 148 140 148C170 148 196 160 204 190Z" fill="#6c5a45" stroke="#4d3f31" strokeWidth="1.6" />
      <path d="M94 170C104 158 120 154 140 154C160 154 176 158 186 170Z" fill="#eae4d8" stroke="#b9ae9a" strokeWidth="1.2" />
      <path d="M14 226C80 222 170 230 264 224V286H14Z" fill="#f3ecdd" stroke={P.rockLine} strokeWidth="1.6" />
      {[[36, 262], [88, 270], [134, 276], [184, 268], [232, 262], [60, 280], [210, 280]].map(([x, y], i) => <path key={i} d={`M${x - 6} ${y}a6 6 0 0 1 12 0`} stroke="#b9a37f" strokeWidth="1.5" fill="none" />)}
    </g>
    <rect x={14} y={14} width={250} height={272} rx="16" fill="none" stroke={P.panelLine} strokeWidth="1.6" />
    <text x={139} y={100} textAnchor="middle" fontSize="13" fontWeight="700" fill="white">coal seam</text>
    <text x={140} y={168} textAnchor="middle" fontSize="12" fontWeight="700" fill={muted}>gas</text>
    <text x={140} y={186} textAnchor="middle" fontSize="12" fontWeight="700" fill="white">oil</text>
    <text x={139} y={246} textAnchor="middle" fontSize="13" fontWeight="700" fill="#8e7a58">limestone</text>
    {/* labels with small source icons */}
    <Fern x={296} y={108} s={1.1} />
    <Lines x={330} y={80} lines={['coal']} />
    <Lines x={330} y={98} lines={['from thick layers', 'of plants']} size={13} weight={600} colour={muted} gap={2} />
    <Leader from={[284, 94]} to={[250, 94]} />
    <Plankton x={298} y={170} />
    <Lines x={330} y={152} lines={['crude oil and', 'natural gas']} />
    <Lines x={330} y={188} lines={['from plankton']} size={13} weight={600} colour={muted} />
    <Leader from={[284, 170]} to={[200, 172]} />
    <Shell x={298} y={254} s={.9} />
    <Lines x={330} y={234} lines={['limestone']} />
    <Lines x={330} y={252} lines={['from shells and skeletons:', 'calcium carbonate']} size={13} weight={600} colour={muted} gap={2} />
    <Leader from={[282, 256]} to={[250, 256]} />
  </Diagram>
}

// ---------- Phase 3: oxygen ----------
function Bubble({ x, y, r = 7, label = false }: { x: number; y: number; r?: number; label?: boolean }) {
  return label ? <GasDot x={x} y={y} gas="o2" r={13} /> : <circle cx={x} cy={y} r={r} fill={P.tealFill} stroke={P.teal} strokeWidth="1.8" />
}
function AlgaeOxygen() {
  return <Diagram title="Algae in the sea give out oxygen bubbles. A timeline shows algae evolving about 2.7 billion years ago, then green plants over the next billion years or so.">
    <Framed h={186}><path d={seaPath(6, 536, 92, 200, 4, 34)} fill={P.sea} stroke={P.seaLine} strokeWidth="1.8" />
    <path d="M334 200C348 120 370 86 404 82C444 76 490 80 540 78V200Z" fill={P.grass} stroke={P.leafLine} strokeWidth="1.8" /></Framed>
    <Sun x={44} y={42} r={16} />
    {[[60, 124], [110, 140], [160, 118], [210, 146], [260, 126], [300, 152], [86, 168], [186, 172], [262, 174]].map(([x, y], i) => <Algae key={i} x={x} y={y} s={.8} seed={i + 1} />)}
    {[[82, 104], [140, 108], [240, 104], [300, 110]].map(([x, y], i) => <Bubble key={i} x={x} y={y} r={5} />)}
    <Bubble x={112} y={62} label /><Bubble x={200} y={52} label /><Bubble x={286} y={66} label />
    <Plant x={462} y={92} s={.7} />
    <Plant x={420} y={100} s={.5} />
    <Lines x={180} y={30} anchor="middle" lines={['algae give out oxygen']} colour={P.teal} />
    {/* timeline */}
    <Arrow from={[26, 232]} to={[516, 232]} colour={muted} width={2.2} />
    <text x={516} y={222} textAnchor="end" fontSize="13" fontWeight="600" fill={muted}>time</text>
    <circle cx={120} cy={232} r="7" fill={P.algae} stroke={P.leafLine} strokeWidth="2" />
    <Lines x={120} y={258} anchor="middle" lines={['about 2.7 billion', 'years ago: algae']} size={13} colour={P.leafLine} gap={2} />
    <path d="M250 232H470" stroke={P.leafLine} strokeWidth="7" opacity=".45" />
    <Lines x={362} y={258} anchor="middle" lines={['green plants: over the', 'next billion years or so']} size={13} colour={P.leafLine} gap={2} />
  </Diagram>
}
function PhotoEq() {
  const box = (x: number, w: number, lines: string[], fill: string, line: string) => <g>
    <rect x={x} y={56} width={w} height={56} rx="16" fill={fill} stroke={line} strokeWidth="2" />
    <Lines x={x + w / 2} y={lines.length > 1 ? 80 : 90} anchor="middle" lines={lines} size={15} colour={line} gap={2} />
  </g>
  return <Diagram viewBox="0 0 540 230" schematic={false} title="Photosynthesis word equation: carbon dioxide plus water, using light, makes glucose plus oxygen. Symbol equation: 6CO2 + 6H2O → C6H12O6 + 6O2.">
    {box(8, 104, ['carbon', 'dioxide'], P.purpleFill, P.purple)}
    <text x={124} y={92} textAnchor="middle" fontSize="22" fontWeight="700" fill={ink}>+</text>
    {box(136, 86, ['water'], P.waterFill, P.waterDeep)}
    <Arrow from={[230, 84]} to={[306, 84]} width={3} />
    <Sun x={268} y={36} r={9} />
    <text x={268} y={72} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.sunLine}>light</text>
    {box(314, 96, ['glucose'], P.amberFill, '#8a5d17')}
    <text x={422} y={92} textAnchor="middle" fontSize="22" fontWeight="700" fill={ink}>+</text>
    {box(434, 98, ['oxygen'], P.tealFill, P.teal)}
    <text x={270} y={160} textAnchor="middle" fontSize="19" fontWeight="700" fill={ink}>
      <tspan fill={P.purple}>6CO₂</tspan><tspan> + </tspan><tspan fill={P.waterDeep}>6H₂O</tspan><tspan> → </tspan><tspan fill="#8a5d17">C₆H₁₂O₆</tspan><tspan> + </tspan><tspan fill={P.teal}>6O₂</tspan>
    </text>
    <Caption y={206} text="Carbon dioxide is used up and oxygen is made" />
  </Diagram>
}
function OxygenRise() {
  return <Diagram title="A schematic graph with no numbers. Across: time. Up: amount in the atmosphere. The carbon dioxide line falls and the oxygen line rises. With more oxygen, animals could evolve.">
    <path d="M70 34V244H372" stroke={ink} strokeWidth="2" fill="none" />
    <path d="M64 42L70 32L76 42M362 238L374 244L362 250" stroke={ink} strokeWidth="2" fill="none" />
    <text x={222} y={270} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>time</text>
    <text x={0} y={0} transform="translate(46 140) rotate(-90)" textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>amount in the atmosphere</text>
    <path d="M78 52C130 56 160 90 200 140S290 214 360 222" stroke={P.purple} strokeWidth="4" fill="none" />
    <path d="M78 236C130 236 160 234 196 220S270 110 360 90" stroke={P.teal} strokeWidth="4" fill="none" />
    <text x={160} y={56} fontSize="14" fontWeight="700" fill={P.purple}>carbon dioxide</text>
    <text x={298} y={80} textAnchor="middle" fontSize="14" fontWeight="700" fill={P.teal}>oxygen</text>
    <rect x={392} y={70} width={138} height={170} rx="18" fill={P.panelFill} stroke={P.panelLine} strokeWidth="1.5" />
    <path d="M404 190C440 184 480 192 520 188V200H404Z" fill={P.grass} />
    <Rabbit x={466} y={190} s={.95} />
    <Lines x={461} y={216} anchor="middle" lines={['animals can', 'evolve']} size={14} colour={P.teal} gap={2} />
    <Arrow from={[366, 92]} to={[400, 118]} colour={P.teal} width={2} dashed />
  </Diagram>
}
function AirBar({ assessment = false, y = 70, dim = false }: { assessment?: boolean; y?: number; dim?: boolean }) {
  const clip = useId().replace(/:/g, '')
  const x0 = 30, w = 480, n = assessment ? 372 : 378, o = assessment ? 100 : 94
  const nFill = assessment ? '#eef1f4' : P.nitroFill, oFill = assessment ? '#eef1f4' : P.tealFill, sFill = assessment ? '#eef1f4' : '#d9d3e6'
  const line = assessment ? '#8a98a4' : ink
  return <g opacity={dim ? .45 : 1}>
    <clipPath id={clip}><rect x={x0} y={y} width={w} height={64} rx="10" /></clipPath>
    <g clipPath={`url(#${clip})`}>
      <rect x={x0} y={y} width={n} height={64} fill={nFill} />
      <rect x={x0 + n} y={y} width={o} height={64} fill={oFill} />
      <rect x={x0 + n + o} y={y} width={w - n - o} height={64} fill={sFill} />
      <path d={`M${x0 + n} ${y}V${y + 64}M${x0 + n + o} ${y}V${y + 64}`} stroke={line} strokeWidth="1.6" />
    </g>
    <rect x={x0} y={y} width={w} height={64} rx="10" fill="none" stroke={line} strokeWidth="2" />
    {assessment ? <g>
      <text x={x0 + n / 2} y={y + 40} textAnchor="middle" fontSize="22" fontWeight="700" fill={ink}>A</text>
      <text x={x0 + n + o / 2} y={y + 40} textAnchor="middle" fontSize="22" fontWeight="700" fill={ink}>B</text>
      <text x={x0 + w - 2} y={y + 106} textAnchor="middle" fontSize="22" fontWeight="700" fill={ink}>C</text>
      <Leader from={[x0 + w - 3, y + 84]} to={[x0 + w - 3, y + 40]} />
    </g> : <g>
      <text x={x0 + n / 2} y={y + 28} textAnchor="middle" fontSize="18" fontWeight="700" fill={P.nitro}>nitrogen</text>
      <text x={x0 + n / 2} y={y + 50} textAnchor="middle" fontSize="15" fontWeight="700" fill={P.nitro}>80% (4/5)</text>
      <text x={x0 + n + o / 2} y={y + 28} textAnchor="middle" fontSize="15" fontWeight="700" fill={P.teal}>oxygen</text>
      <text x={x0 + n + o / 2} y={y + 50} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.teal}>20% (1/5)</text>
    </g>}
  </g>
}
function AirToday() {
  return <Diagram viewBox="0 0 540 240" title="Air today as one bar: about 80% (four fifths) nitrogen, about 20% (one fifth) oxygen, and a very thin slice of other gases, less than 1%. The proportions have been similar for about 200 million years.">
    <text x={30} y={52} fontSize="16" fontWeight="700" fill={ink}>air today</text>
    <AirBar />
    <Lines x={500} y={170} anchor="end" lines={['other gases: less than 1%']} size={14} colour={P.purple} />
    <Leader from={[507, 156]} to={[507, 112]} colour={P.purple} />
    <Caption y={218} text="About the same proportions for about 200 million years" />
  </Diagram>
}
function OtherGases() {
  const clip = useId().replace(/:/g, '')
  const parts: [string, string, string][] = [['carbon dioxide', P.purpleFill, P.purple], ['noble gases', P.paleFill, '#7d786f'], ['water vapour', P.waterFill, P.waterDeep]]
  return <Diagram viewBox="0 0 540 260" title="The thin slice of other gases in the air, zoomed in. It is mainly carbon dioxide, noble gases and water vapour, together less than 1% of the air.">
    <AirBar dim y={24} />
    <rect x={503} y={20} width={11} height={72} rx="5" fill="none" stroke={P.purple} strokeWidth="2.2" />
    <path d="M504 92L40 150M513 92L500 150" stroke={P.purple} strokeWidth="1.4" strokeDasharray="5 4" />
    <clipPath id={clip}><rect x={40} y={150} width={462} height={62} rx="14" /></clipPath>
    <g clipPath={`url(#${clip})`}>{parts.map(([name, fill], i) => <rect key={name} x={40 + i * 154} y={150} width={154} height={62} fill={fill} />)}</g>
    <path d="M194 150V212M348 150V212" stroke={ink} strokeWidth="1.6" />
    <rect x={40} y={150} width={462} height={62} rx="14" fill="none" stroke={ink} strokeWidth="2" />
    {parts.map(([name, , line], i) => <text key={name} x={117 + i * 154} y={187} textAnchor="middle" fontSize="15" fontWeight="700" fill={line}>{name}</text>)}
    <Caption y={244} text="Zoomed in: together less than 1% of the air" />
  </Diagram>
}
function Timeline() {
  const panel = (x: number, n: number, title: string[], children: ReactNode, sky: string) => <PhasePanel key={n} x={x} n={n} title={title} sky={sky}>{children}</PhasePanel>
  return <Diagram title="The three phases in order. 1: volcanoes gave out gases, mostly carbon dioxide. 2: carbon dioxide was removed by the oceans, algae, plants and rocks. 3: plants and algae made oxygen.">
    {panel(12, 1, ['Volcanoes gave', 'out gases'], <g>
      <Volcano x={100} base={190} w={140} h={70} plume={3} drift={1} />
      <path d="M12 186C60 180 120 190 172 184V200H12Z" fill="#dcc6a9" stroke="#a98c6c" strokeWidth="1.6" />
      {[[36, 46], [36, 96], [146, 40], [150, 92], [46, 146], [146, 146]].map(([x, y], i) => <GasDot key={i} x={x} y={y} gas="co2" r={12} />)}
    </g>, P.earlySky)}
    {panel(190, 2, ['Carbon dioxide', 'removed'], <g>
      <path d={seaPath(190, 350, 132, 200, 3, 34)} fill={P.sea} stroke={P.seaLine} strokeWidth="1.6" />
      <path d="M272 200C282 150 296 124 318 120C332 118 342 118 352 117V200Z" fill={P.grass} stroke={P.leafLine} strokeWidth="1.6" />
      <Plant x={326} y={124} s={.6} />
      <Algae x={214} y={158} s={.75} /><Algae x={248} y={170} s={.7} seed={4} />
      <path d="M190 186C230 182 260 190 350 186V200H190Z" fill={P.rockDeep} stroke={P.rockLine} strokeWidth="1.4" />
      <GasDot x={228} y={60} gas="co2" r={12} /><GasDot x={290} y={40} gas="co2" r={12} />
      <Arrow from={[230, 76]} to={[236, 118]} colour={P.purple} width={2} />
      <Arrow from={[296, 54]} to={[310, 76]} colour={P.purple} width={2} />
    </g>, P.sky)}
    {panel(368, 3, ['Plants and algae', 'made oxygen'], <g>
      <path d="M368 170C420 162 470 174 528 166V200H368Z" fill={P.grass} stroke={P.leafLine} strokeWidth="1.6" />
      <Tree x={410} y={176} s={.72} seed={5} /><Plant x={488} y={172} s={.7} />
      {[[398, 50], [502, 50], [452, 88], [508, 96]].map(([x, y], i) => <GasDot key={i} x={x} y={y} gas="o2" r={12} />)}
      <GasDot x={450} y={38} gas="co2" r={12} opacity={.55} />
    </g>, P.sky)}
    <Arrow from={[20, 272]} to={[520, 272]} colour={muted} width={2.2} />
    <text x={504} y={262} textAnchor="end" fontSize="13" fontWeight="600" fill={muted}>time</text>
  </Diagram>
}
function PhasePanel({ x, n, title, sky, children }: { x: number; n: number; title: string[]; sky: string; children: ReactNode }) {
  const clip = useId().replace(/:/g, '')
  return <g>
    <clipPath id={clip}><rect x={x} y={14} width={160} height={186} rx="16" /></clipPath>
    <rect x={x} y={14} width={160} height={186} rx="16" fill={sky} />
    <g clipPath={`url(#${clip})`}>{children}</g>
    <rect x={x} y={14} width={160} height={186} rx="16" fill="none" stroke={P.panelLine} strokeWidth="1.6" />
    <Num n={n} x={x + 20} y={222} />
    <Lines x={x + 38} y={220} lines={title} size={13.5} gap={2} />
  </g>
}
function QuestionBar() {
  return <Diagram viewBox="0 0 540 170" title="A bar split into three sections, A a very large section, B a smaller section and C a very thin section.">
    <AirBar assessment y={40} />
  </Diagram>
}

export function AtmosphereVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus === 'atmos-q-bar') return <QuestionBar />
  void assessment
  if (focus === 'atmos-volcanoes') return <Volcanoes />
  if (focus === 'atmos-theory') return <Theory />
  if (focus === 'atmos-early-gases') return <EarlyGases />
  if (focus === 'atmos-volcano-other') return <VolcanoOther />
  if (focus === 'atmos-oceans') return <Oceans />
  if (focus === 'atmos-dissolve') return <Dissolve />
  if (focus === 'atmos-sediments') return <Sediments />
  if (focus === 'atmos-photo-uptake') return <PhotoUptake />
  if (focus === 'atmos-locked') return <Locked />
  if (focus === 'atmos-fossil') return <Fossil />
  if (focus === 'atmos-algae') return <AlgaeOxygen />
  if (focus === 'atmos-photo-eq') return <PhotoEq />
  if (focus === 'atmos-oxygen-rise') return <OxygenRise />
  if (focus === 'atmos-air-today') return <AirToday />
  if (focus === 'atmos-other-gases') return <OtherGases />
  if (focus === 'atmos-timeline') return <Timeline />
  return <Timeline />
}
