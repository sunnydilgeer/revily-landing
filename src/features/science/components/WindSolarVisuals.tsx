import { useId, type ReactNode } from 'react'
import { physicsPalette as P, EnergyStoreBadge, TransferArrow, type Pt } from './PhysicsKit'

/*
 * Physics Lesson 11: wind, solar and geothermal power. Original, code-native schematics; not to scale. Focus ids start 'windsol-'.
 *
 * This file also exports the small landscape pieces (hills, sea, Sun, cloud, turbine, pylon, house, power plant, tags) that the
 * other energy-resource lessons (water power, fuels, trends) reuse, so the whole resources topic reads as one set.
 *
 * Colour code: yellow = light from the Sun; blue = water; green = plants and land; red/orange rock = the thermal store;
 * vermilion bolt = electricity; green tag with a tick = an advantage; coral tag with a cross = a disadvantage.
 * One hillside is reused through the wind frames, one sunny field through the solar frames, one cut-away of the
 * ground through the geothermal frames.
 */
const { ink, muted } = P
export const scene = {
  grass: '#e4f0da', grassLine: '#86b67a', grassDark: '#cfe6c2',
  sea: P.water, seaLine: P.waterLine, seaDeep: '#a9d3ea',
  soil: '#f1e6d3', soilLine: '#b9a07a',
  steel: '#5d7486', steelFill: '#f8fafb',
  wall: '#fbf6ee', wallLine: '#9c8a74', roof: '#e2b19b', roofLine: '#a5634a',
  smoke: '#e3e7ea', smokeLine: '#a3aeb6',
  wind: '#6f9fb6',
  electric: P.current,
  panel: '#d3def0', panelLine: '#3f5f8f',
  faded: 0.28,
}
const S = scene
const r1 = (n: number) => Math.round(n * 10) / 10

/* ---------- Organic shapes ---------- */
function seeded(seed: number) {
  let s = (Math.abs(Math.floor(seed)) * 9973 + 7) % 2147483647 || 1
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}
export function blob(cx: number, cy: number, rx: number, ry: number, seed: number, wobble = 0.12, count = 9) {
  const rand = seeded(seed)
  const pts: Pt[] = Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2, k = 1 + (rand() - 0.5) * 2 * wobble
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]
  })
  return smooth(pts, true)
}
/** A smooth curve through points (Catmull-Rom as cubic Béziers). */
export function smooth(pts: Pt[], closed = false) {
  const n = pts.length
  const at = (i: number) => closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2)
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])} ${r1(p2[1])}`
  }
  return closed ? d + 'Z' : d
}
/** Land whose top edge follows y = top(x) between x0 and x1, filled down to `bottom`. */
export function landPath(top: (x: number) => number, x0: number, x1: number, bottom: number, step = 20) {
  const pts: Pt[] = []
  for (let x = x0; x < x1; x += step) pts.push([x, top(x)])
  pts.push([x1, top(x1)])
  return `${smooth(pts)}L${x1} ${bottom}L${x0} ${bottom}Z`
}
/** The top line of a gently waving sea. */
export function wavePath(x0: number, x1: number, y: number, amp = 3.5, wave = 34) {
  let d = `M${x0} ${y}`
  for (let x = x0; x < x1; x += wave) d += `q${wave / 4} ${-amp} ${wave / 2} 0t${Math.min(wave / 2, x1 - x - wave / 2)} 0`
  return d
}
export const gauss = (x: number, mid: number, width: number) => Math.exp(-(((x - mid) / width) ** 2))

/* ---------- Figure wrapper and labels ---------- */
export function Fig({ title, children, w = 540, h = 300, note }: { title: string; children: ReactNode; w?: number; h?: number; note?: string }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={`0 0 ${w} ${h}`} role="img" aria-labelledby={titleId}><title id={titleId}>{`${title} Original schematic, not to scale.`}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg>{note && <p className="science-bio-note">{note}</p>}</div>
}
/** Text with a white halo so it reads over a scene. */
export function Say({ x, y, lines, anchor = 'start', size = 14, weight = 650, colour = ink, halo = true }: { x: number; y: number; lines: string[]; anchor?: 'start' | 'middle' | 'end'; size?: number; weight?: number; colour?: string; halo?: boolean }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={colour} stroke={halo ? 'white' : 'none'} strokeWidth={halo ? 4 : 0} paintOrder="stroke">{lines.map((l, i) => <tspan key={i} x={x} dy={i ? size + 3 : 0}>{l}</tspan>)}</text>
}
export type TagKind = 'pro' | 'con' | 'note' | 'warn' | 'coin'
const tagColours: Record<TagKind, [string, string]> = { pro: [P.usefulFill, P.useful], con: [P.wastedFill, P.wasted], note: [P.panel, muted], warn: ['#fdf0cf', '#b98a17'], coin: ['#fdf0cf', '#b98a17'] }
export function tagWidth(lines: string[]) { return Math.round(Math.max(...lines.map(l => l.length)) * 7.55 + 46) }
/** A rounded tag: tick = advantage, cross = disadvantage. (x, y) is the top-left corner (or top-centre / top-right by anchor). */
export function Tag({ x, y, lines, kind = 'pro', anchor = 'start', dim = false }: { x: number; y: number; lines: string[]; kind?: TagKind; anchor?: 'start' | 'middle' | 'end'; dim?: boolean }) {
  const w = tagWidth(lines), h = lines.length * 16 + 14
  const left = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2
  const [fill, line] = tagColours[kind], cx = left + 17, cy = y + h / 2
  const icon = kind === 'pro' ? <path d={`M${cx - 4.5} ${cy + .5}L${cx - 1.5} ${cy + 3.5}L${cx + 4.5} ${cy - 3}`} stroke={line} strokeWidth="2.2" fill="none" />
    : kind === 'con' ? <path d={`M${cx - 3.5} ${cy - 3.5}L${cx + 3.5} ${cy + 3.5}M${cx + 3.5} ${cy - 3.5}L${cx - 3.5} ${cy + 3.5}`} stroke={line} strokeWidth="2.2" />
    : <text x={cx} y={cy + 4.5} textAnchor="middle" fontSize="13" fontWeight="800" fill={line}>{kind === 'coin' ? '£' : kind === 'warn' ? '!' : 'i'}</text>
  return <g opacity={dim ? .35 : 1}>
    <rect x={left} y={y} width={w} height={h} rx={Math.min(15, h / 2)} fill={fill} stroke={line} strokeWidth="1.5" />
    <circle cx={cx} cy={cy} r="9.5" fill="white" stroke={line} strokeWidth="1.5" />
    {icon}
    <text x={left + 33} y={y + 19.5} fontSize="13" fontWeight="650" fill={ink}>{lines.map((l, i) => <tspan key={i} x={left + 33} dy={i ? 16 : 0}>{l}</tspan>)}</text>
  </g>
}
/** A numbered marker (question pictures). */
export function Num({ n, x, y }: { n: number | string; x: number; y: number }) {
  return <g><circle cx={x} cy={y} r="14" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>{n}</text></g>
}
/** A small panel with a soft border, for side-by-side pictures. */
export function Panel({ x, y, w, h, highlight = false, tint }: { x: number; y: number; w: number; h: number; highlight?: boolean; tint?: string }) {
  return <rect x={x} y={y} width={w} height={h} rx="14" fill={tint ?? P.panel} stroke={highlight ? P.useful : P.panelLine} strokeWidth={highlight ? 2.4 : 1.4} />
}
/** A clip path id helper: children drawn inside a rounded box. */
export function Clip({ x, y, w, h, children, r = 14 }: { x: number; y: number; w: number; h: number; children: ReactNode; r?: number }) {
  const id = useId().replace(/:/g, '')
  return <g><clipPath id={`c${id}`}><rect x={x} y={y} width={w} height={h} rx={r} /></clipPath><g clipPath={`url(#c${id})`}>{children}</g></g>
}

/* ---------- Scene pieces ---------- */
export function Sun({ x, y, r = 18, rays = true, dim = false }: { x: number; y: number; r?: number; rays?: boolean; dim?: boolean }) {
  return <g opacity={dim ? .45 : 1}>
    {rays && Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return <path key={i} d={`M${r1(x + Math.cos(a) * (r + 5))} ${r1(y + Math.sin(a) * (r + 5))}L${r1(x + Math.cos(a) * (r + 12))} ${r1(y + Math.sin(a) * (r + 12))}`} stroke={P.lightLine} strokeWidth="2.4" /> })}
    <circle cx={x} cy={y} r={r} fill={P.light} stroke={P.lightLine} strokeWidth="2" />
  </g>
}
export function Cloud({ x, y, s = 1, dark = false }: { x: number; y: number; s?: number; dark?: boolean }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M-30 10H30C42 10 43 -8 29 -8C29 -22 9 -27 2 -15C-5 -27 -27 -22 -22 -6C-36 -8 -41 10 -30 10Z" fill={dark ? '#dfe5ea' : '#f2f6f8'} stroke={dark ? '#7f919e' : '#a3b4c0'} strokeWidth={2 / s} />
}
export function Moon({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  return <path d={`M${x} ${y - r}A${r} ${r} 0 0 0 ${x} ${y + r}A${r * .5} ${r} 0 0 1 ${x} ${y - r}Z`} fill="#f4f1dc" stroke="#9a9468" strokeWidth="1.8" />
}
/** Wind: a soft flowing arrow. */
export function Gust({ from, to, width = 2.6, bend = .12 }: { from: Pt; to: Pt; width?: number; bend?: number }) {
  return <TransferArrow from={from} to={to} bend={bend} colour={S.wind} width={width} />
}
/** A lightning bolt for electricity. */
export function Bolt({ x, y, s = 1, colour = S.electric }: { x: number; y: number; s?: number; colour?: string }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M3 -13L-6.5 1.5H-.5L-3.5 13L7 -2.5H1.5L4.5 -13Z" fill={colour} stroke={colour} strokeWidth="1.2" />
}
/** A cable carrying electricity from one point to another, with a bolt at its middle. */
export function Cable({ from, to, sag = 10, bolt = true }: { from: Pt; to: Pt; sag?: number; bolt?: boolean }) {
  const mid: Pt = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2 + sag]
  return <g><path d={`M${from[0]} ${from[1]}Q${mid[0]} ${mid[1] + sag} ${to[0]} ${to[1]}`} stroke={S.electric} strokeWidth="2" fill="none" strokeDasharray="1 5" />{bolt && <Bolt x={mid[0]} y={mid[1]} s={.95} />}</g>
}
/** A wind turbine standing on (x, y), tower height h. `angle` turns the blades. */
export function Turbine({ x, y, h, angle = 0, dim = false, ghost = false }: { x: number; y: number; h: number; angle?: number; dim?: boolean; ghost?: boolean }) {
  const L = h * .52, w = Math.max(3.4, L * .085), top = y - h
  const blade = `M0 0C${r1(w)} ${r1(-L * .22)} ${r1(w * 1.25)} ${r1(-L * .62)} ${r1(w * .2)} ${-L}C${r1(-w * .5)} ${r1(-L * .7)} ${r1(-w * .8)} ${r1(-L * .3)} 0 0Z`
  const dash = ghost ? '4 4' : undefined, stroke = ghost ? '#9fb0bd' : S.steel
  return <g opacity={dim ? S.faded : 1}>
    <path d={`M${x - w * .9} ${y}L${x - w * .42} ${top + 3}H${x + w * .42}L${x + w * .9} ${y}Z`} fill={ghost ? 'none' : S.steelFill} stroke={stroke} strokeWidth="1.6" strokeDasharray={dash} />
    <g transform={`translate(${x} ${top})`}>
      {[0, 120, 240].map(a => <path key={a} d={blade} transform={`rotate(${angle + a})`} fill={ghost ? 'none' : S.steelFill} stroke={stroke} strokeWidth="1.5" strokeDasharray={dash} />)}
      <circle r={w * .8} fill={ghost ? 'white' : '#dfe6ec'} stroke={stroke} strokeWidth="1.5" strokeDasharray={dash} />
    </g>
  </g>
}
export function Pylon({ x, y, h = 60, dim = false }: { x: number; y: number; h?: number; dim?: boolean }) {
  const t = y - h
  return <g opacity={dim ? S.faded : 1} stroke={muted} strokeWidth="1.7" fill="none">
    <path d={`M${x - 11} ${y}L${x - 3} ${t}H${x + 3}L${x + 11} ${y}`} />
    <path d={`M${x - 16} ${t + 9}H${x + 16}M${x - 13} ${t + 21}H${x + 13}`} />
    <path d={`M${x - 9} ${y - h * .2}L${x + 7} ${y - h * .45}L${x - 5} ${y - h * .65}L${x + 4} ${t + 21}M${x + 9} ${y - h * .2}L${x - 7} ${y - h * .45}L${x + 5} ${y - h * .65}L${x - 4} ${t + 21}`} strokeWidth="1.1" />
  </g>
}
/** A small house standing on (x, y). */
export function House({ x, y, s = 1, dim = false, lit = false }: { x: number; y: number; s?: number; dim?: boolean; lit?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} opacity={dim ? S.faded : 1} strokeWidth={1.6 / s}>
    <path d="M-17 0V-22H17V0Z" fill={S.wall} stroke={S.wallLine} />
    <path d="M-21 -21L0 -38L21 -21Z" fill={S.roof} stroke={S.roofLine} />
    <rect x="-11" y="-17" width="8" height="8" rx="1" fill={lit ? P.light : '#e3eef6'} stroke={S.wallLine} />
    <rect x="4" y="-13" width="8" height="13" rx="1" fill="#e8d6c4" stroke={S.wallLine} />
  </g>
}
/** A power station standing on (x, y): a hall and a chimney, optionally smoking. */
export function PowerPlant({ x, y, s = 1, smoke = false, chimney = true, dim = false }: { x: number; y: number; s?: number; smoke?: boolean; chimney?: boolean; dim?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} opacity={dim ? S.faded : 1} strokeWidth={1.6 / s}>
    {smoke && <g fill={S.smoke} stroke={S.smokeLine}>
      <path d={blob(24, -76, 10, 8, 3)} /><path d={blob(33, -92, 13, 10, 5)} /><path d={blob(47, -108, 16, 12, 7)} />
    </g>}
    {chimney && <path d="M17 -30L19 -66H29L31 -30Z" fill="#eef1f4" stroke={S.steel} />}
    {chimney && <path d="M18.6 -58H29.4" stroke={P.wasted} strokeWidth={3 / s} />}
    <path d="M-34 0V-30L-20 -40V-30L-6 -40V-30L8 -40V-30H36V0Z" fill="#eef1f4" stroke={S.steel} />
    {[-26, -12, 2, 18].map(wx => <rect key={wx} x={wx} y="-22" width="8" height="8" rx="1" fill="#dbe6ee" stroke={S.steel} strokeWidth={1.2 / s} />)}
  </g>
}
/** A nuclear-style cooling tower standing on (x, y). */
export function CoolingTower({ x, y, s = 1, steam = true }: { x: number; y: number; s?: number; steam?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={1.6 / s}>
    {steam && <g fill="#f4f6f8" stroke="#b9c4cc"><path d={blob(-2, -78, 16, 9, 11)} /><path d={blob(10, -92, 19, 11, 13)} /></g>}
    <path d="M-26 0C-18 -22 -14 -44 -18 -66H18C14 -44 18 -22 26 0Z" fill="#eef1f4" stroke={S.steel} />
    <path d="M-18 -66H18" stroke={S.steel} />
  </g>
}
/** A tree with a soft canopy standing on (x, y). */
export function Tree({ x, y, s = 1, seed = 1, dim = false, dead = false }: { x: number; y: number; s?: number; seed?: number; dim?: boolean; dead?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} opacity={dim ? S.faded : 1} strokeWidth={1.6 / s}>
    <path d="M-3 0L-2 -22H2L3 0Z" fill="#c9a77f" stroke="#8a6443" />
    {dead ? <path d="M0 -20L-9 -34M0 -22L8 -38M-4 -29L-12 -30M4 -31L12 -33" stroke="#8a6443" strokeWidth={2 / s} fill="none" />
      : <path d={blob(0, -34, 16, 17, seed, .1)} fill={P.plant} stroke={P.plantLine} />}
  </g>
}
export function Bird({ x, y, s = 1, colour = ink }: { x: number; y: number; s?: number; colour?: string }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M-10 -2Q-5 -8 0 0Q5 -8 10 -2" stroke={colour} strokeWidth={2 / s} fill="none" />
}
export function Fish({ x, y, s = 1, flip = false, colour = '#e8a25c' }: { x: number; y: number; s?: number; flip?: boolean; colour?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} strokeWidth={1.5 / s}>
    <path d="M-12 0C-6 -8 6 -8 11 0C6 8 -6 8 -12 0Z" fill={colour} fillOpacity=".45" stroke={colour} />
    <path d="M11 0L19 -6V6Z" fill={colour} fillOpacity=".45" stroke={colour} />
    <circle cx="-6" cy="-1.5" r="1.4" fill={ink} stroke="none" />
  </g>
}
export function Coin({ x, y, r = 12 }: { x: number; y: number; r?: number }) {
  return <g><circle cx={x} cy={y} r={r} fill="#fbe7a8" stroke="#b98a17" strokeWidth="1.8" /><circle cx={x} cy={y} r={r - 3.5} fill="none" stroke="#d9b24a" strokeWidth="1" /><text x={x} y={y + r * .4} textAnchor="middle" fontSize={Math.max(12, r * 1.15)} fontWeight="800" fill="#9a700f">£</text></g>
}
/** A simple rounded person, feet on (x, y). */
export function Person({ x, y, s = 1, colour = '#7a8fa0', fill = '#e6edf2', mood = 'plain' }: { x: number; y: number; s?: number; colour?: string; fill?: string; mood?: 'plain' | 'sad' | 'happy' }) {
  const mouth = mood === 'sad' ? 'M-3 -41.5Q0 -44 3 -41.5' : mood === 'happy' ? 'M-3 -43Q0 -40 3 -43' : 'M-2.5 -42H2.5'
  return <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={1.6 / s}>
    <path d="M-12 0C-12 -18 -9 -30 0 -30C9 -30 12 -18 12 0Z" fill={fill} stroke={colour} />
    <circle cx="0" cy="-44" r="10" fill="#f6e3d3" stroke={colour} />
    <circle cx="-3.5" cy="-46" r="1.2" fill={ink} stroke="none" /><circle cx="3.5" cy="-46" r="1.2" fill={ink} stroke="none" />
    <path d={mouth} stroke={ink} strokeWidth={1.3 / s} fill="none" />
  </g>
}
/** A solar panel on a small stand, feet on (x, y). */
export function SolarPanel({ x, y, s = 1, lit = true, dim = false }: { x: number; y: number; s?: number; lit?: boolean; dim?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} opacity={dim ? S.faded : 1} strokeWidth={1.6 / s}>
    <path d="M-2 0V-20M-18 0L-10 -14M14 0L8 -18" stroke={S.steel} strokeWidth={2 / s} />
    <path d="M-40 -14L-24 -44H38L26 -14Z" fill={lit ? S.panel : '#c3cad6'} stroke={S.panelLine} />
    <path d="M-35.3 -23H30M-29.7 -34H34.5M-15 -44L-24 -14M3 -44L-4 -14M20 -44L12 -14" stroke={S.panelLine} strokeWidth={1 / s} opacity=".7" />
    {lit && <path d="M-26 -41L-22 -41L-31 -17H-35Z" fill="white" opacity=".55" stroke="none" />}
  </g>
}

/* ---------- Lesson 11 scenes ---------- */
const hillY = (x: number) => 214 - 36 * gauss(x, 110, 100) - 24 * gauss(x, 250, 70)
const SEA_X = 352, SEA_Y = 214

function WindScene({ mode }: { mode: 'turbine' | 'pros' | 'noise' }) {
  const t: [number, number, number][] = mode === 'pros' ? [[105, 92, 12], [228, 88, 70]] : [[105, 92, 12], [228, 88, 70], [462, 76, 40]]
  const noise = mode === 'noise'
  return <Clip x={0} y={0} w={540} h={300} r={16}>
    <path d={landPath(hillY, 0, 540, 300)} fill={S.grass} stroke={S.grassLine} strokeWidth="1.8" />
    <path d={`${wavePath(SEA_X, 540, SEA_Y)}V300H${SEA_X}Z`} fill={S.sea} stroke="none" />
    <path d={wavePath(SEA_X, 540, SEA_Y)} stroke={S.seaLine} strokeWidth="2" fill="none" />
    <path d={`M${442} ${SEA_Y + 2}H${482}`} stroke={S.steel} strokeWidth="3" />
    {t.map(([x, h, a], i) => <Turbine key={i} x={x} y={i === 2 ? SEA_Y : hillY(x) + 1} h={h} angle={a} dim={noise && i !== 1} />)}
    {mode !== 'noise' && <g>
      <Gust from={[8, 70]} to={[62, 66]} /><Gust from={[14, 104]} to={[66, 100]} /><Gust from={[8, 138]} to={[58, 136]} />
    </g>}
  </Clip>
}

function WindTurbine() {
  return <Fig title="Three wind turbines, two on a grassy moor and one out at sea. Wind arrows blow from the left and turn the blades. A cable carries electricity from a turbine to a pylon." h={300}>
    <WindScene mode="turbine" />
    <Say x={10} y={52} lines={['wind']} colour={S.wind} />
    <path d="M280 52A58 58 0 0 1 282 104" stroke={ink} strokeWidth="2.2" fill="none" />
    <path d="M282 104l-6.5 -9.5 10.5 1z" fill={ink} stroke={ink} strokeWidth="1" />
    <Say x={292} y={70} lines={['blades', 'turn']} />
    <Pylon x={330} y={hillY(330) + 1} h={64} />
    <Cable from={[236, hillY(236) - 30]} to={[326, hillY(330) - 55]} sag={4} />
    <Say x={346} y={128} lines={['electricity']} colour={S.electric} />
    <Say x={128} y={268} lines={['moor']} colour={P.plantLine} anchor="middle" halo={false} />
    <Say x={462} y={262} lines={['out at sea']} colour={S.seaLine} anchor="middle" halo={false} />
  </Fig>
}

function WindPros() {
  return <Fig title="The wind turbines on the hill with no smoke. A second small picture shows the same hill after the turbines have been taken away: the land is back to normal." h={300}>
    <WindScene mode="pros" />
    <Tag x={20} y={246} lines={['no pollution once built']} />
    <Say x={420} y={40} lines={['after the turbines', 'are taken away']} size={13} anchor="middle" colour={muted} />
    <rect x={318} y={70} width={204} height={104} rx="14" fill="white" stroke={P.panelLine} strokeWidth="1.4" />
    <Clip x={318} y={70} w={204} h={104}>
      <path d={landPath(x => 150 - 24 * gauss(x, 410, 70), 318, 522, 180)} fill={S.grass} stroke={S.grassLine} strokeWidth="1.6" />
      <Turbine x={410} y={127} h={34} angle={30} ghost />
      <Tree x={352} y={146} s={.6} seed={4} /><Tree x={484} y={144} s={.55} seed={8} />
    </Clip>
    <Tag x={522} y={186} lines={['no lasting damage:', 'land goes back to normal']} anchor="end" />
  </Fig>
}

function WindNoise() {
  return <Fig title="A house close to a wind turbine. Sound waves spread from the turbine towards the house, and the turbine stands out on the skyline." h={300}>
    <WindScene mode="noise" />
    <House x={330} y={hillY(330) + 2} s={1.25} />
    {[18, 30, 42].map((r, i) => <path key={r} d={`M${258 + r * .2} ${104 - r}A${r} ${r} 0 0 1 ${258 + r * .2} ${104 + r}`} transform={`translate(${i * 10} 50)`} stroke={P.wasted} strokeWidth="2.2" fill="none" opacity={1 - i * .2} />)}
    <Tag x={300} y={60} lines={['noisy for people', 'living nearby']} kind="con" />
    <Tag x={24} y={24} lines={['some people say', 'turbines spoil the view']} kind="con" />
  </Fig>
}

function WindLimits() {
  const px = [12, 188, 364], pw = 164, top = 20, ph = 196
  const ground = (x0: number) => landPath(x => 176 - 6 * gauss(x, x0 + 82, 60), x0, x0 + pw, top + ph)
  return <Fig title="Three small pictures. A still day with a limp flag: the turbine has stopped. A stormy day with a bending tree: the turbine is stopped to avoid damage. A demand bar rising while the supply bar is locked." h={290} note="On average, wind turbines produce electricity for about 70 to 85 per cent of the time.">
    {px.map((x, i) => <Panel key={x} x={x} y={top} w={pw} h={ph} tint="white" />)}
    {/* still day */}
    <Clip x={px[0]} y={top} w={pw} h={ph}><path d={ground(px[0])} fill={S.grass} stroke={S.grassLine} strokeWidth="1.6" /></Clip>
    <Sun x={px[0] + 30} y={52} r={12} />
    <Turbine x={px[0] + 92} y={175} h={92} angle={20} />
    <path d={`M${px[0] + 138} 176V122`} stroke={S.steel} strokeWidth="2" />
    <path d={`M${px[0] + 138} 124C${px[0] + 142} 134 ${px[0] + 136} 144 ${px[0] + 141} 154L${px[0] + 138} 154Z`} fill={P.wastedFill} stroke={P.wasted} strokeWidth="1.5" />
    {/* storm */}
    <Clip x={px[1]} y={top} w={pw} h={ph}><path d={ground(px[1])} fill={S.grass} stroke={S.grassLine} strokeWidth="1.6" /></Clip>
    <Cloud x={px[1] + 120} y={44} s={.8} dark />
    <Gust from={[px[1] + 8, 70]} to={[px[1] + 64, 64]} width={3.4} /><Gust from={[px[1] + 10, 100]} to={[px[1] + 68, 96]} width={3.4} />
    <Turbine x={px[1] + 96} y={175} h={92} angle={0} />
    <path d={`M${px[1] + 140} 176Q${px[1] + 140} 160 ${px[1] + 150} 148`} stroke="#8a6443" strokeWidth="3" fill="none" />
    <path d={blob(px[1] + 152, 138, 12, 9, 21, .12)} fill={P.plant} stroke={P.plantLine} strokeWidth="1.5" transform={`rotate(25 ${px[1] + 152} 138)`} />
    <path d={`M${px[1] + 30} 128L${px[1] + 44} 104L${px[1] + 58} 128Z`} fill="#fdf0cf" stroke="#b98a17" strokeWidth="1.8" />
    <text x={px[1] + 44} y={125} textAnchor="middle" fontSize="14" fontWeight="800" fill="#9a700f">!</text>
    {/* demand */}
    <path d={`M${px[2] + 22} 176H${px[2] + 142}`} stroke={ink} strokeWidth="1.8" />
    <rect x={px[2] + 34} y={70} width={36} height={106} rx="4" fill={P.kinetic} stroke={P.kineticLine} strokeWidth="1.6" />
    <path d={`M${px[2] + 52} 64V40`} stroke={P.kineticLine} strokeWidth="2.6" /><path d={`M${px[2] + 45} 46L${px[2] + 52} 36L${px[2] + 59} 46Z`} fill={P.kineticLine} stroke={P.kineticLine} strokeWidth="1.2" />
    <rect x={px[2] + 94} y={116} width={36} height={60} rx="4" fill={P.panel} stroke={S.steel} strokeWidth="1.6" />
    <g transform={`translate(${px[2] + 112} 96)`}><path d="M-6 -2V-7A6 6 0 0 1 6 -7V-2" stroke={S.steel} strokeWidth="2.2" fill="none" /><rect x="-9" y="-2" width="18" height="14" rx="2.5" fill="#fdf0cf" stroke="#b98a17" strokeWidth="1.6" /></g>
    <text x={px[2] + 52} y={194} textAnchor="middle" fontSize="12.5" fontWeight="650" fill={muted}>demand</text>
    <text x={px[2] + 112} y={194} textAnchor="middle" fontSize="12.5" fontWeight="650" fill={muted}>supply</text>
    {[['little wind:', 'turbine stops'], ['too much wind:', 'stopped to', 'avoid damage'], ['supply cannot', 'rise on demand']].map((l, i) => <Say key={i} x={px[i] + pw / 2} y={238} lines={l} anchor="middle" size={13} halo={false} />)}
  </Fig>
}

const fieldY = (x: number) => 206 - 10 * gauss(x, 150, 140) + 6 * gauss(x, 440, 90)
function SolarScene({ dimPanel = false, house = true }: { dimPanel?: boolean; house?: boolean }) {
  return <Clip x={0} y={0} w={540} h={300} r={16}>
    <path d={landPath(fieldY, 0, 540, 300)} fill={S.grass} stroke={S.grassLine} strokeWidth="1.8" />
    <path d={landPath(x => fieldY(x) + 38 + 6 * Math.sin(x / 50), 0, 540, 300)} fill={S.grassDark} stroke="none" opacity=".6" />
    <Tree x={30} y={fieldY(30) + 2} s={.9} seed={3} />
    <SolarPanel x={200} y={fieldY(200) + 2} s={1.35} dim={dimPanel} />
    {house && <House x={420} y={fieldY(420) + 2} s={1.3} lit />}
    {house && <Tree x={494} y={fieldY(494) + 2} s={.8} seed={9} />}
  </Clip>
}
function SolarCell() {
  return <Fig title="The Sun shines on a solar panel in a field. Light from the Sun falls on the panel, and a cable carries electricity to a house." h={290} note="There are no moving parts: no blades to turn.">
    <SolarScene />
    <Sun x={62} y={56} r={22} />
    {[[92, 76, 176, 134], [80, 94, 150, 150], [104, 66, 210, 122]].map(([x1, y1, x2, y2], i) => <path key={i} d={`M${x1} ${y1}L${x2} ${y2}`} stroke={P.lightLine} strokeWidth="2.6" strokeDasharray="7 6" />)}
    <Say x={110} y={48} lines={['light from the Sun']} colour="#9a700f" />
    <Say x={200} y={fieldY(200) + 34} lines={['solar cell']} anchor="middle" />
    <Cable from={[248, fieldY(248) - 30]} to={[398, fieldY(400) - 18]} sag={6} />
    <Say x={322} y={148} lines={['electricity']} colour={S.electric} anchor="middle" />
  </Fig>
}
function SolarPros() {
  return <Fig title="A sunny field with a solar panel. Four advantages are listed: no pollution once built, very reliable in sunny countries, free energy so running costs are almost zero, and fairly reliable even in cloudy Britain." h={300}>
    <SolarScene house={false} />
    <Sun x={62} y={56} r={22} />
    <Tag x={290} y={14} lines={['no pollution once built']} />
    <Tag x={290} y={52} lines={['very reliable in', 'sunny countries']} />
    <Tag x={290} y={106} lines={['free energy: running', 'costs almost zero']} />
    <Tag x={290} y={160} lines={['fairly reliable, even', 'in cloudy Britain']} />
    <Cloud x={104} y={82} s={.75} />
  </Fig>
}

function SolarCons() {
  const ground = (x0: number) => landPath(x => 176 - 5 * gauss(x, x0 + 118, 80), x0, x0 + 244, 216)
  return <Fig title="Two pictures of the same solar panel. By day the Sun shines on it and the house light is on. At night, under the Moon, the panel makes no electricity. Two disadvantages are listed below." h={300}>
    <Clip x={12} y={14} w={244} h={202}><rect x={12} y={14} width={244} height={202} fill="#fffbef" /><path d={ground(12)} fill={S.grass} stroke={S.grassLine} strokeWidth="1.6" /></Clip>
    <Clip x={284} y={14} w={244} h={202}><rect x={284} y={14} width={244} height={202} fill="#dfe3f0" /><path d={ground(284)} fill="#c7d6c0" stroke="#7d9a78" strokeWidth="1.6" /></Clip>
    <rect x={12} y={14} width={244} height={202} rx="14" fill="none" stroke={P.panelLine} strokeWidth="1.4" />
    <rect x={284} y={14} width={244} height={202} rx="14" fill="none" stroke={P.panelLine} strokeWidth="1.4" />
    <Sun x={50} y={50} r={15} /><Moon x={322} y={48} r={14} />
    {[[340, 34], [372, 58], [470, 40], [505, 70]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="1.8" fill="#7d86a8" />)}
    <SolarPanel x={110} y={178} s={1.05} /><House x={206} y={177} s={1} lit />
    <SolarPanel x={382} y={178} s={1.05} lit={false} /><House x={478} y={177} s={1} />
    <Bolt x={158} y={130} s={1.1} />
    <Say x={134} y={206} lines={['day: electricity']} anchor="middle" size={13} />
    <Say x={406} y={206} lines={['night: none']} anchor="middle" size={13} />
    <Tag x={20} y={232} lines={['lots of energy used', 'to build the panels']} kind="con" />
    <Tag x={278} y={232} lines={['output cannot be', 'increased on demand']} kind="con" />
  </Fig>
}
function SolarUses() {
  const c = [[92, 118], [270, 118], [448, 118]] as const, r = 76
  return <Fig title="Three round pictures of solar cells in use: a weather station on a remote mountain, an electric road sign beside a road, and a satellite in space with solar panel wings." h={256}>
    {c.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r} fill={i === 2 ? '#e7ebf5' : '#f4f8fb'} stroke={P.panelLine} strokeWidth="1.6" />)}
    <Clip x={16} y={42} w={152} h={152} r={76}>
      <path d={`M16 200L70 92L96 120L118 82L168 200Z`} fill="#dfe7e2" stroke="#8aa596" strokeWidth="1.6" />
      <path d="M110 92L118 82L126 94L120 90L116 96Z" fill="white" stroke="#8aa596" strokeWidth="1.2" />
      <path d="M92 150V112" stroke={S.steel} strokeWidth="2.2" /><path d="M92 112L104 104" stroke={S.steel} strokeWidth="1.8" /><circle cx="104" cy="103" r="3" fill={S.steelFill} stroke={S.steel} strokeWidth="1.4" />
      <path d="M70 128L78 114H98L92 128Z" fill={S.panel} stroke={S.panelLine} strokeWidth="1.5" /><path d="M84 128L87 114" stroke={S.panelLine} strokeWidth="1" />
      <rect x="86" y="146" width="14" height="10" rx="2" fill="#eef1f4" stroke={S.steel} strokeWidth="1.4" />
    </Clip>
    <Sun x={52} y={74} r={10} rays={false} />
    <Clip x={194} y={42} w={152} h={152} r={76}>
      <path d="M194 168H346V200H194Z" fill="#d9dee3" /><path d="M200 181H340" stroke="white" strokeWidth="3" strokeDasharray="12 10" />
      <path d="M270 168V108" stroke={S.steel} strokeWidth="3" />
      <rect x="236" y="104" width="68" height="34" rx="5" fill="#2f3f4c" stroke={S.steel} strokeWidth="1.6" />
      <text x="270" y="126" textAnchor="middle" fontSize="13" fontWeight="800" fill="#ffc46b">SLOW</text>
      <path d="M246 98L252 84H290L286 98Z" fill={S.panel} stroke={S.panelLine} strokeWidth="1.5" /><path d="M252 98L256 84M268 98L271 84" stroke={S.panelLine} strokeWidth="1" />
      <path d="M262 98V104M278 98V104" stroke={S.steel} strokeWidth="1.6" />
    </Clip>
    <g>
      {[[400, 108], [466, 108]].map(([x, y], i) => <g key={i}><rect x={x} y={y} width={32} height={20} rx="2" fill={S.panel} stroke={S.panelLine} strokeWidth="1.5" /><path d={`M${x + 11} ${y}V${y + 20}M${x + 21} ${y}V${y + 20}M${x} ${y + 10}H${x + 32}`} stroke={S.panelLine} strokeWidth="1" /></g>)}
      <path d="M432 118H436M460 118H466" stroke={S.steel} strokeWidth="2" />
      <rect x="436" y="104" width="24" height="28" rx="4" fill="#f5e7c9" stroke="#b08a4a" strokeWidth="1.6" />
      <path d="M448 104V94" stroke={S.steel} strokeWidth="1.6" /><circle cx="448" cy="92" r="3" fill={S.steelFill} stroke={S.steel} strokeWidth="1.3" />
      {[[410, 76], [486, 82], [420, 160], [478, 150], [446, 170]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="1.6" fill="#8e98b5" />)}
    </g>
    <Say x={92} y={218} lines={['remote places']} anchor="middle" halo={false} />
    <Say x={270} y={218} lines={['road signs']} anchor="middle" halo={false} />
    <Say x={448} y={218} lines={['satellites']} anchor="middle" halo={false} />
  </Fig>
}

// Geothermal: a slice of the ground, getting hotter with depth.
const GROUND = 96
const layers = [
  { y: GROUND, fill: '#f3ecdf', line: '#c9b594' },
  { y: 150, fill: '#f6e0cc', line: '#d4a784' },
  { y: 200, fill: '#f7cdb9', line: '#cc7d66' },
  { y: 244, fill: P.thermal, line: P.thermalLine },
]
function layerTop(i: number) { return (x: number) => layers[i].y + (i ? 5 * Math.sin(x / 38 + i * 1.7) : 0) }
function GroundCut({ glow = true }: { glow?: boolean }) {
  return <Clip x={0} y={0} w={540} h={310} r={16}>
    {layers.map((l, i) => <path key={i} d={landPath(layerTop(i), 0, 540, 310)} fill={l.fill} stroke={l.line} strokeWidth="1.4" />)}
    <path d={landPath(x => GROUND - 3 + 2 * Math.sin(x / 30), 0, 540, GROUND + 8, 15)} fill={S.grassDark} stroke={S.grassLine} strokeWidth="1.6" />
    {glow && [[56, 276], [136, 286], [352, 272], [496, 284]].map(([x, y], i) => <path key={i} d={`M${x} ${y + 10}c-4 -5 4 -8 0 -13s4 -8 0 -12`} stroke={P.thermalLine} strokeWidth="2" fill="none" opacity=".75" />)}
  </Clip>
}
function HotRock() {
  return <Fig title="A slice through the ground. Grass on the surface, then layers of rock that get warmer in colour further down, ending in hot rocks with a thermal energy store." h={310}>
    <GroundCut />
    <Tree x={80} y={GROUND} s={1} seed={2} /><House x={456} y={GROUND} s={1.1} />
    <Say x={200} y={80} lines={["Earth's surface"]} />
    <path d="M36 120V250" stroke={P.hot} strokeWidth="3" /><path d="M28 244L36 258L44 244Z" fill={P.hot} stroke={P.hot} strokeWidth="1.2" />
    <Say x={50} y={186} lines={['deeper,', 'hotter']} colour={P.thermalLine} size={13} />
    <Say x={420} y={272} lines={['hot rocks']} colour={P.thermalLine} anchor="middle" />
    <EnergyStoreBadge store="thermal" x={250} y={268} label="Thermal store" />
  </Fig>
}
function GeoPlant({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <PowerPlant x={x} y={y} s={s} chimney={false} />
}
function GeoPipes({ x }: { x: number }) {
  return <g>
    <path d={`M${x - 12} ${GROUND - 4}V262`} stroke={P.cold} strokeWidth="7" /><path d={`M${x - 12} ${GROUND - 4}V262`} stroke={P.coldFill} strokeWidth="3" />
    <path d={`M${x + 12} 262V${GROUND - 4}`} stroke={P.hot} strokeWidth="7" /><path d={`M${x + 12} 262V${GROUND - 4}`} stroke={P.hotFill} strokeWidth="3" />
    <path d={`M${x - 12} 262Q${x - 12} 276 ${x} 276Q${x + 12} 276 ${x + 12} 262`} stroke={P.hot} strokeWidth="7" fill="none" />
    <path d={`M${x - 20} 170l8 12 8 -12`} stroke={P.cold} strokeWidth="2.4" fill="none" />
    <path d={`M${x + 4} 190l8 -12 8 12`} stroke={P.hot} strokeWidth="2.4" fill="none" />
  </g>
}
function GeoUses() {
  const pipeY = GROUND + 10
  return <Fig title="The same slice of ground. Cold water is pumped down a pipe to the hot rocks and comes back up hot. The hot water is used at a power station to generate electricity, and piped to homes to heat them directly." h={310}>
    <GroundCut />
    <path d={`M162 ${GROUND - 2}V${pipeY}H488`} stroke={P.hot} strokeWidth="6" fill="none" /><path d={`M162 ${GROUND - 2}V${pipeY}H488`} stroke={P.hotFill} strokeWidth="2.5" fill="none" />
    {[392, 440, 488].map(x => <path key={x} d={`M${x} ${pipeY}V${GROUND - 4}`} stroke={P.hot} strokeWidth="4" />)}
    <GeoPipes x={150} />
    <GeoPlant x={150} y={GROUND} s={1.05} />
    <Pylon x={60} y={GROUND} h={56} />
    <Cable from={[114, GROUND - 26]} to={[64, GROUND - 48]} sag={2} bolt={false} />
    <Bolt x={92} y={52} s={1.05} />
    <Say x={36} y={24} lines={['generate electricity']} colour={S.electric} size={13.5} />
    {[392, 440, 488].map(x => <House key={x} x={x} y={GROUND} s={1.05} lit />)}
    <path d={`M${300} ${pipeY + 16}H${350}`} stroke={P.hot} strokeWidth="2.4" /><path d={`M${350} ${pipeY + 10}l10 6 -10 6z`} fill={P.hot} stroke={P.hot} strokeWidth="1" />
    <Say x={440} y={34} lines={['heat buildings', 'directly']} colour={P.hot} anchor="middle" size={13.5} />
    <Say x={128} y={214} lines={['cold water', 'down']} colour={P.cold} size={13} anchor="end" />
    <Say x={172} y={214} lines={['hot water', 'up']} colour={P.hot} size={13} />
    <Say x={420} y={272} lines={['hot rocks']} colour={P.thermalLine} anchor="middle" />
  </Fig>
}
function GeoPros() {
  const sky = [<Sun key="s" x={0} y={0} r={11} />, <Cloud key="c" x={0} y={2} s={.62} dark />, <Moon key="m" x={0} y={0} r={11} />]
  return <Fig title="The slice of ground under a strip of sky showing sunshine, rain and night. The weather changes, but the hot rocks below stay hot all the time." h={310}>
    <GroundCut />
    <GeoPipes x={120} /><GeoPlant x={120} y={GROUND} s={.95} />
    {[240, 330, 420].map((x, i) => <g key={x} transform={`translate(${x} 42)`}>{sky[i]}{i === 1 && [-10, 0, 10].map(d => <path key={d} d={`M${d} 14l-3 8`} stroke={P.waterLine} strokeWidth="2" />)}</g>)}
    <path d="M216 72H444" stroke={muted} strokeWidth="1.4" strokeDasharray="3 5" />
    <Say x={330} y={88} lines={['day, night, any weather']} anchor="middle" size={13} colour={muted} halo />
    <Tag x={214} y={150} lines={['reliable: the rocks', 'are always hot']} />
    <Tag x={214} y={206} lines={['little damage to', 'the environment']} />
  </Fig>
}
function GeoCons() {
  const top = (x: number) => 104 + 10 * Math.sin(x / 70) + 5 * Math.sin(x / 23)
  const hot = (x: number) => 200 - 62 * gauss(x, 250, 42) + 3 * Math.sin(x / 25)
  const spots = [60, 145, 350, 430, 500]
  return <Fig title="A long slice of land. Under most places the hot rocks are very deep, and those places are crossed out. In one place the hot rocks come close to the surface, and a geothermal plant is built there." h={300}>
    <Clip x={12} y={60} w={516} h={160}>
      <path d={landPath(top, 12, 528, 230)} fill="#f3ecdf" stroke="#c9b594" strokeWidth="1.4" />
      <path d={landPath(hot, 12, 528, 230, 10)} fill={P.thermal} stroke={P.thermalLine} strokeWidth="1.5" />
      <path d={`${smooth(Array.from({ length: 27 }, (_, i) => [12 + i * 19.85, top(12 + i * 19.85)] as Pt))}`} stroke={S.grassLine} strokeWidth="5" fill="none" opacity=".55" />
      <path d="M244 104V150M258 150V104" stroke={P.hot} strokeWidth="5" /><path d="M244 104V150" stroke={P.cold} strokeWidth="5" />
    </Clip>
    <rect x={12} y={60} width={516} height={160} rx="14" fill="none" stroke={P.panelLine} strokeWidth="1.4" />
    <GeoPlant x={251} y={top(251) + 2} s={.72} />
    <circle cx={296} cy={top(251) - 34} r="11" fill="white" stroke={P.useful} strokeWidth="2" /><path d={`M291 ${top(251) - 34}l3.5 3.5 6 -7`} stroke={P.useful} strokeWidth="2.4" fill="none" />
    {spots.map(x => <path key={x} d={`M${x - 8} ${top(x) - 22}L${x + 8} ${top(x) - 6}M${x + 8} ${top(x) - 22}L${x - 8} ${top(x) - 6}`} stroke={P.wasted} strokeWidth="3" />)}
    <Say x={120} y={182} lines={['hot rocks too deep']} size={13} colour={P.thermalLine} anchor="middle" />
    <Say x={292} y={160} lines={['hot rocks near', 'the surface']} size={13} colour={P.thermalLine} />
    <Tag x={20} y={236} lines={['not many suitable', 'locations']} kind="con" />
    <Tag x={520} y={236} lines={['building a plant usually', 'costs quite a lot']} kind="coin" anchor="end" />
  </Fig>
}
function Compare() {
  const cols = [
    { x: 14, name: 'wind', works: ['works when', 'the wind blows'] },
    { x: 190, name: 'solar', works: ['works in', 'daylight only'] },
    { x: 366, name: 'geothermal', works: ['works all', 'the time'] },
  ]
  return <Fig title="Three cards side by side. Wind turbines work when the wind blows. Solar cells work in daylight only. Geothermal power works all the time, but only in a few places. The geothermal card is highlighted." h={290}>
    {cols.map((c, i) => <Panel key={i} x={c.x} y={14} w={160} h={220} highlight={i === 2} tint={i === 2 ? '#f3faf5' : P.panel} />)}
    <Clip x={14} y={14} w={160} h={130}><path d={landPath(x => 128 - 8 * gauss(x, 94, 50), 14, 174, 150)} fill={S.grass} stroke={S.grassLine} strokeWidth="1.5" /></Clip>
    <Turbine x={94} y={124} h={70} angle={15} />
    <Gust from={[26, 56]} to={[58, 52]} width={2.2} />
    <Clip x={190} y={14} w={160} h={130}><path d={landPath(x => 128 - 5 * gauss(x, 270, 50), 190, 350, 150)} fill={S.grass} stroke={S.grassLine} strokeWidth="1.5" /></Clip>
    <Sun x={222} y={46} r={13} /><SolarPanel x={282} y={124} s={.95} />
    <Clip x={366} y={14} w={160} h={130}>
      <path d={landPath(() => 88, 366, 526, 150)} fill="#f6e0cc" stroke="#d4a784" strokeWidth="1.4" />
      <path d={landPath(x => 118 + 3 * Math.sin(x / 20), 366, 526, 150)} fill={P.thermal} stroke={P.thermalLine} strokeWidth="1.4" />
      <path d="M437 86V124M455 124V86" stroke={P.hot} strokeWidth="5" />
      <path d="M437 86V124" stroke={P.cold} strokeWidth="5" />
    </Clip>
    <PowerPlant x={446} y={88} s={.72} chimney={false} />
    {cols.map((c, i) => <g key={c.name}>
      <text x={c.x + 80} y={170} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>{c.name}</text>
      <text x={c.x + 80} y={196} textAnchor="middle" fontSize="13" fontWeight="600" fill={i === 2 ? P.useful : muted}>{c.works.map((l, j) => <tspan key={j} x={c.x + 80} dy={j ? 16 : 0}>{l}</tspan>)}</text>
    </g>)}
    <Say x={446} y={262} lines={['but only in a few places']} anchor="middle" size={13} colour={P.wasted} halo={false} />
  </Fig>
}
function QResources({ assessment }: { assessment: boolean }) {
  return <Fig title={assessment ? 'Three energy resource pictures, numbered 1 to 3.' : 'Three energy resources: 1 a geothermal power plant with pipes down to hot rocks, 2 wind turbines on a hill, 3 a solar panel.'} h={250}>
    {[14, 190, 366].map(x => <Panel key={x} x={x} y={14} w={160} h={200} tint="white" />)}
    <Clip x={14} y={14} w={160} h={200}>
      <path d={landPath(() => 110, 14, 174, 214)} fill="#f6e0cc" stroke="#d4a784" strokeWidth="1.4" />
      <path d={landPath(x => 168 + 4 * Math.sin(x / 18), 14, 174, 214)} fill={P.thermal} stroke={P.thermalLine} strokeWidth="1.4" />
      <path d={landPath(() => 107, 14, 174, 116)} fill={S.grassDark} stroke={S.grassLine} strokeWidth="1.4" />
      <path d="M84 108V176" stroke={P.cold} strokeWidth="5" /><path d="M104 176V108" stroke={P.hot} strokeWidth="5" />
      <path d="M84 176Q94 186 104 176" stroke={P.hot} strokeWidth="5" fill="none" />
    </Clip>
    <PowerPlant x={94} y={108} s={.8} chimney={false} />
    <Clip x={190} y={14} w={160} h={200}><path d={landPath(x => 176 - 16 * gauss(x, 270, 60), 190, 350, 214)} fill={S.grass} stroke={S.grassLine} strokeWidth="1.5" /></Clip>
    <Turbine x={236} y={172} h={80} angle={10} /><Turbine x={300} y={166} h={88} angle={50} />
    <Clip x={366} y={14} w={160} h={200}><path d={landPath(x => 176 - 4 * gauss(x, 446, 60), 366, 526, 214)} fill={S.grass} stroke={S.grassLine} strokeWidth="1.5" /></Clip>
    <SolarPanel x={446} y={174} s={1.25} />
    {[94, 270, 446].map((x, i) => <Num key={i} n={i + 1} x={x} y={236} />)}
  </Fig>
}

export function WindSolarVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'windsol-turbine': return <WindTurbine />
    case 'windsol-wind-pros': return <WindPros />
    case 'windsol-wind-noise': return <WindNoise />
    case 'windsol-wind-limits': return <WindLimits />
    case 'windsol-cell': return <SolarCell />
    case 'windsol-uses': return <SolarUses />
    case 'windsol-solar-pros': return <SolarPros />
    case 'windsol-solar-cons': return <SolarCons />
    case 'windsol-hotrock': return <HotRock />
    case 'windsol-geouses': return <GeoUses />
    case 'windsol-geopros': return <GeoPros />
    case 'windsol-geocons': return <GeoCons />
    case 'windsol-compare': return <Compare />
    case 'windsol-q-resources': return <QResources assessment={assessment} />
    default: return null
  }
}
