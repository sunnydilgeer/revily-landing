import type { ReactNode } from 'react'
import {
  physicsPalette as P, PhysicsDiagram, Wire, Junction, CurrentArrow, Cell, Battery, Lamp, Resistor, SwitchOpen, SwitchClosed, Ammeter, Voltmeter,
  type Pt,
} from './PhysicsKit'

/*
 * Physics Lesson 21: parallel circuits. Original, code-native schematics; not to scale. Focus ids start with 'parallel-'.
 * One circuit (cell on the left, branches to the right) is reused through each walkthrough; frames change what is lit,
 * highlighted or measured. Current arrows use the kit's current colour; pd readings the kit's pd violet.
 *
 * The small helpers exported at the top (chips, cards, reading boxes, numbered badges, step lists) are shared with the
 * other electricity lessons drawn alongside this one (ResistorPracVisuals, MainsVisuals, AppliancePowerVisuals,
 * ChargeEnergyVisuals), so their cards and readings look the same.
 */

const { ink, muted } = P

/** One colour per quantity, the same on every equation card and reading in Lessons 21–25. */
export const quantity = { E: P.useful, Q: P.chargeLine, V: P.pd, I: P.current, R: P.resistance, P: '#a9740f', t: '#4d6f8c' }
export const quantityFill = { E: P.usefulFill, Q: '#dcecf8', V: P.pdFill, I: '#fbe3d8', R: P.resistanceFill, P: '#fbefcf', t: '#e2ebf3' }

/** Rough text width for bold text at `size`. */
export const textWidth = (s: string, size = 14) => s.length * size * 0.58

/** A rounded pill of text centred on (x, y). */
export function Chip({ x, y, text, colour = ink, fill = 'white', size = 14, w, dim = false }: { x: number; y: number; text: string; colour?: string; fill?: string; size?: number; w?: number; dim?: boolean }) {
  const width = w ?? textWidth(text, size) + 22, h = size + 13
  return <g opacity={dim ? .35 : 1}>
    <rect x={x - width / 2} y={y - h / 2} width={width} height={h} rx={h / 2} fill={fill} stroke={colour} strokeWidth="1.8" />
    <text x={x} y={y + size * .36} textAnchor="middle" fontSize={size} fontWeight="700" fill={colour}>{text}</text>
  </g>
}

/** A meter reading in a small rounded box (left edge at x, centred on y). */
export function Reading({ x, y, text, colour = ink, anchor = 'start', strong = false }: { x: number; y: number; text: string; colour?: string; anchor?: 'start' | 'end' | 'middle'; strong?: boolean }) {
  const w = textWidth(text, 14) + 16, left = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2
  return <g>
    <rect x={left} y={y - 13} width={w} height={26} rx="7" fill={strong ? colour : 'white'} stroke={colour} strokeWidth="1.8" />
    <text x={left + w / 2} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="750" fill={strong ? 'white' : colour}>{text}</text>
  </g>
}

/** A soft card. */
export function Card({ x, y, w, h, children, fill = P.panel, line = P.panelLine, highlight }: { x: number; y: number; w: number; h: number; children?: ReactNode; fill?: string; line?: string; highlight?: string }) {
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="14" fill={highlight ? 'white' : fill} stroke={highlight ?? line} strokeWidth={highlight ? 2.4 : 1.6} />
    {children}
  </g>
}

/** Text made of coloured runs: [text, colour?] pairs. */
export function Runs({ x, y, runs, size = 15, anchor = 'middle', weight = 700 }: { x: number; y: number; runs: Array<[string, string?]>; size?: number; anchor?: 'start' | 'middle' | 'end'; weight?: number }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={ink} xmlSpace="preserve">{runs.map(([t, c], i) => <tspan key={i} fill={c ?? ink}>{t}</tspan>)}</text>
}

/** Plain text, one or more lines. */
export function Txt({ x, y, lines, size = 14, colour = ink, anchor = 'start', weight = 600 }: { x: number; y: number; lines: string[]; size?: number; colour?: string; anchor?: 'start' | 'middle' | 'end'; weight?: number }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={colour}>{lines.map((l, i) => <tspan key={i} x={x} dy={i ? size + 4 : 0}>{l}</tspan>)}</text>
}

/** A numbered badge (for question diagrams and step lists). */
export function Badge({ x, y, n, fill = 'white', colour = ink }: { x: number; y: number; n: number | string; fill?: string; colour?: string }) {
  return <g><circle cx={x} cy={y} r="12.5" fill={fill} stroke={colour} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="750" fill={fill === 'white' ? colour : 'white'}>{n}</text></g>
}

/** A numbered pointer: badge at (x, y) with a leader to `to`. */
export function NumPointer({ x, y, n, to }: { x: number; y: number; n: number; to: Pt }) {
  const a = Math.atan2(to[1] - y, to[0] - x)
  return <g>
    <path d={`M${x + Math.cos(a) * 13} ${y + Math.sin(a) * 13}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.5" />
    <circle cx={to[0]} cy={to[1]} r="2.6" fill={ink} />
    <Badge x={x} y={y} n={n} />
  </g>
}

/** A step chip, e.g. "Step 1: pd". */
export function StepChip({ x, y, text, colour = P.useful }: { x: number; y: number; text: string; colour?: string }) {
  const w = textWidth(text, 13) + 22
  return <g><rect x={x} y={y - 13} width={w} height={26} rx="13" fill={colour} /><text x={x + w / 2} y={y + 4.6} textAnchor="middle" fontSize="13" fontWeight="750" fill="white">{text}</text></g>
}

/** A straight arrow with a solid head. */
export function Arrow({ from, to, colour = ink, width = 3, dashed = false }: { from: Pt; to: Pt; colour?: string; width?: number; dashed?: boolean }) {
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]), h = 7 + width * 1.6
  const pts = [to, [to[0] - h * Math.cos(a - .45), to[1] - h * Math.sin(a - .45)], [to[0] - h * Math.cos(a + .45), to[1] - h * Math.sin(a + .45)]]
  const end: Pt = [to[0] - h * .7 * Math.cos(a), to[1] - h * .7 * Math.sin(a)]
  return <g>
    <path d={`M${from[0]} ${from[1]}L${end[0].toFixed(1)} ${end[1].toFixed(1)}`} stroke={colour} strokeWidth={width} fill="none" strokeDasharray={dashed ? '6 6' : undefined} />
    <polygon points={pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')} fill={colour} stroke={colour} strokeWidth="1" strokeLinejoin="round" />
  </g>
}

/** Soft rising heat lines centred on x, starting at y and going up. */
export function Heat({ x, y, n = 3, gap = 12, colour = P.hot, h = 22 }: { x: number; y: number; n?: number; gap?: number; colour?: string; h?: number }) {
  return <g stroke={colour} strokeWidth="2.2" fill="none" opacity=".85">
    {Array.from({ length: n }, (_, i) => { const cx = x + (i - (n - 1) / 2) * gap; return <path key={i} d={`M${cx} ${y}c-5 ${-h / 4} 5 ${-h / 4} 0 ${-h / 2}s5 ${-h / 4} 0 ${-h / 2}`} /> })}
  </g>
}

/** A red cross. */
export function Cross({ x, y, r = 9, colour = P.wasted }: { x: number; y: number; r?: number; colour?: string }) {
  return <path d={`M${x - r} ${y - r}L${x + r} ${y + r}M${x + r} ${y - r}L${x - r} ${y + r}`} stroke={colour} strokeWidth="3.4" />
}

/** A clock face showing `minutes` of the hour shaded. */
export function Clock({ x, y, r = 24, minutes = 0, colour = quantity.t }: { x: number; y: number; r?: number; minutes?: number; colour?: string }) {
  const a = (minutes / 60) * Math.PI * 2 - Math.PI / 2, big = minutes > 30 ? 1 : 0
  const ex = x + Math.cos(a) * (r - 3), ey = y + Math.sin(a) * (r - 3)
  return <g>
    <circle cx={x} cy={y} r={r} fill="white" stroke={colour} strokeWidth="2.4" />
    {minutes > 0 && <path d={`M${x} ${y}L${x} ${y - r + 3}A${r - 3} ${r - 3} 0 ${big} 1 ${ex.toFixed(1)} ${ey.toFixed(1)}Z`} fill={quantityFill.t} stroke="none" />}
    {Array.from({ length: 12 }, (_, i) => { const t = i / 12 * Math.PI * 2; return <path key={i} d={`M${(x + Math.cos(t) * (r - 3)).toFixed(1)} ${(y + Math.sin(t) * (r - 3)).toFixed(1)}L${(x + Math.cos(t) * (r - 6.5)).toFixed(1)} ${(y + Math.sin(t) * (r - 6.5)).toFixed(1)}`} stroke={colour} strokeWidth="1.4" /> })}
    <path d={`M${x} ${y}V${y - r * .62}`} stroke={colour} strokeWidth="2.4" />
    <path d={`M${x} ${y}L${ex.toFixed(1)} ${ey.toFixed(1)}`} stroke={colour} strokeWidth="1.8" opacity={minutes ? 1 : 0} />
    <circle cx={x} cy={y} r="2.6" fill={colour} />
  </g>
}

// ---------- The parallel circuit ----------

const B1 = '#3a7fb8', B2 = '#3f9463', B3 = '#9b5aa8'
const branchColour = [B1, B2, B3]
const branchTint = ['#e3eff9', '#e2f2e6', '#f1e6f5']

type Branch = { kind?: 'lamp' | 'resistor' | 'gap'; lit?: boolean; sw?: 'open' | 'closed'; amm?: string; ammColour?: string; ammStrong?: boolean; num?: number; vm?: string; vmStrong?: boolean; tint?: boolean; name?: string; dim?: boolean; arrows?: boolean }
type Layout = { left: number; top: number; bottom: number; xs: number[] }
const std: Layout = { left: 80, top: 62, bottom: 258, xs: [220, 340] }
const three: Layout = { left: 80, top: 62, bottom: 258, xs: [200, 300, 400] }

function ParallelCircuit({ L = std, branches, battery, cellAmm, cellAmmStrong, cellNum, cellVm, cellVmStrong, cellArrows = true, junctions = true, halo = false, cellLabel }: {
  L?: Layout; branches: Branch[]; battery?: boolean; cellAmm?: string; cellAmmStrong?: boolean; cellNum?: number; cellVm?: string; cellVmStrong?: boolean; cellArrows?: boolean; junctions?: boolean; halo?: boolean; cellLabel?: string
}) {
  const { left, top, bottom, xs } = L, mid = (top + bottom) / 2, last = xs[xs.length - 1]
  const hasCellAmm = cellAmm !== undefined || cellNum !== undefined
  const ammX = (left + xs[0]) / 2 + 6
  const swY = top + 44, ammY = bottom - 40
  const anyCurrent = branches.some(b => b.arrows !== false && b.kind !== 'gap' && b.sw !== 'open')
  return <g>
    {/* soft tints behind branches */}
    {branches.map((b, i) => b.tint && <rect key={`t${i}`} x={xs[i] - 30} y={top + 14} width={60} height={bottom - top - 28} rx="24" fill={branchTint[i]} stroke={branchColour[i]} strokeOpacity=".35" strokeWidth="1.4" />)}
    {/* wires */}
    <Wire points={[[xs[0], top], [left, top], [left, bottom], [xs[0], bottom]]} />
    {xs.slice(1, -1).map((x, i) => <Wire key={`r${i}`} points={[[xs[i], top], [x, top]]} radius={0} />)}
    {xs.slice(1, -1).map((x, i) => <Wire key={`b${i}`} points={[[xs[i], bottom], [x, bottom]]} radius={0} />)}
    {xs.map((x, i) => <g key={`br${i}`} opacity={branches[i]?.dim ? .35 : 1}>
      <Wire points={i === xs.length - 1 ? [[xs[i - 1] ?? left, top], [x, top], [x, bottom], [xs[i - 1] ?? left, bottom]] : [[x, top], [x, bottom]]} />
    </g>)}
    {/* cell or battery */}
    <rect x={left - 8} y={mid - (battery ? 22 : 8)} width={16} height={battery ? 44 : 16} fill="white" stroke="none" />
    {battery ? <Battery x={left} y={mid} rotate={90} cells={2} /> : <Cell x={left} y={mid} rotate={90} />}
    {cellLabel && <Txt x={left - 26} y={mid + 5} lines={[cellLabel]} anchor="end" colour={ink} weight={700} />}
    {hasCellAmm && <Ammeter x={ammX} y={top} length={40} />}
    {cellAmm && <Reading x={ammX} y={top - 32} text={cellAmm} colour={P.current} anchor="middle" strong={cellAmmStrong} />}
    {cellNum !== undefined && <Badge x={ammX} y={top - 32} n={cellNum} />}
    {cellVm && <g>
      <Wire points={[[left, mid - 44], [left - 46, mid - 44], [left - 46, mid - 32]]} width={2} />
      <Wire points={[[left, mid + 44], [left - 46, mid + 44], [left - 46, mid + 32]]} width={2} />
      <Junction x={left} y={mid - 44} /><Junction x={left} y={mid + 44} />
      <Voltmeter x={left - 46} y={mid} rotate={90} length={60} />
      <Reading x={left - 46} y={mid + 70} text={cellVm} colour={P.pd} anchor="middle" strong={cellVmStrong} />
    </g>}
    {/* branch components */}
    {branches.map((b, i) => { const x = xs[i], kind = b.kind ?? 'lamp', col = branchColour[i]; return <g key={`c${i}`} opacity={b.dim ? .35 : 1}>
      {b.sw && <g><rect x={x - 8} y={swY - 10} width={16} height={20} fill="white" />{b.sw === 'open' ? <SwitchOpen x={x} y={swY} rotate={90} length={40} /> : <SwitchClosed x={x} y={swY} rotate={90} length={40} />}</g>}
      {kind === 'lamp' && <Lamp x={x} y={mid} rotate={90} length={40} lit={b.lit} />}
      {kind === 'resistor' && <Resistor x={x} y={mid} rotate={90} length={44} />}
      {kind === 'gap' && <g><rect x={x - 8} y={mid - 24} width={16} height={48} fill="white" /><circle cx={x} cy={mid} r="14" fill="none" stroke={muted} strokeWidth="1.6" strokeDasharray="4 4" /><Cross x={x} y={mid} r={7} /></g>}
      {(b.amm !== undefined || b.num !== undefined) && <Ammeter x={x} y={ammY} rotate={90} length={36} />}
      {b.amm && <Reading x={x + 20} y={ammY} text={b.amm} colour={b.ammColour ?? col} strong={b.ammStrong} />}
      {b.num !== undefined && <NumPointer x={x + 38} y={ammY + 18} n={b.num} to={[x + 12, ammY + 7]} />}
      {b.vm && <g>
        <Wire points={[[x, mid - 34], [x + 42, mid - 34], [x + 42, mid - 26]]} width={2} />
        <Wire points={[[x, mid + 34], [x + 42, mid + 34], [x + 42, mid + 26]]} width={2} />
        <Junction x={x} y={mid - 34} /><Junction x={x} y={mid + 34} />
        <Voltmeter x={x + 42} y={mid} rotate={90} length={50} />
        <Reading x={x + 42} y={mid + 58} text={b.vm} colour={P.pd} anchor="middle" strong={b.vmStrong} />
      </g>}
      {b.name && <Txt x={x} y={top - 14} lines={[b.name]} anchor="middle" colour={col} weight={750} />}
      {b.arrows !== false && kind !== 'gap' && b.sw !== 'open' && <g>
        <CurrentArrow x={x} y={b.sw ? mid - 44 : top + 30} rotate={90} />
      </g>}
    </g> })}
    {/* junction dots */}
    {junctions && xs.slice(0, -1).map((x, i) => <g key={`j${i}`}>
      {halo && <><circle cx={x} cy={top} r="13" fill={P.light} stroke={P.lightLine} strokeWidth="1.6" /><circle cx={x} cy={bottom} r="13" fill={P.light} stroke={P.lightLine} strokeWidth="1.6" /></>}
      <Junction x={x} y={top} /><Junction x={x} y={bottom} />
    </g>)}
    {/* current on the main wires */}
    {cellArrows && anyCurrent && <g>
      <CurrentArrow x={left} y={top + 26} rotate={-90} />
      <CurrentArrow x={hasCellAmm ? ammX + 36 : (left + xs[0]) / 2} y={top} rotate={0} />
      <CurrentArrow x={(left + xs[0]) / 2} y={bottom} rotate={180} />
      <CurrentArrow x={left} y={bottom - 26} rotate={-90} />
    </g>}
    {void last}
  </g>
}

function Note({ x, y, lines, colour = ink, size = 14, anchor = 'start' }: { x: number; y: number; lines: string[]; colour?: string; size?: number; anchor?: 'start' | 'middle' | 'end' }) {
  return <Txt x={x} y={y} lines={lines} colour={colour} size={size} anchor={anchor} weight={700} />
}

// ---------- Section: what is a parallel circuit? ----------

function Branches() {
  return <PhysicsDiagram viewBox="0 0 540 300" title="A cell with two lamps, each on its own loop. The two loops are branch 1 and branch 2, and each branch is joined separately to the cell.">
    <ParallelCircuit branches={[{ lit: true, tint: true, name: 'branch 1' }, { lit: true, tint: true, name: 'branch 2' }]} />
    <Note x={392} y={130} lines={['each branch is', 'joined separately', 'to the cell']} />
  </PhysicsDiagram>
}
function Remove() {
  return <PhysicsDiagram title="The same parallel circuit with the lamp on branch 2 taken out, leaving a gap. The lamp on branch 1 is still lit.">
    <ParallelCircuit branches={[{ lit: true, tint: true, name: 'branch 1' }, { kind: 'gap', dim: false, name: 'branch 2' }]} />
    <Note x={392} y={120} lines={['lamp taken out', 'of branch 2']} colour={P.wasted} />
    <Note x={392} y={180} lines={['the other branch', 'still works']} colour={B1} />
  </PhysicsDiagram>
}
function Switches() {
  return <PhysicsDiagram title="A parallel circuit with a switch on each branch. The switch on branch 1 is closed and its lamp is lit. The switch on branch 2 is open and its lamp is off.">
    <ParallelCircuit branches={[{ lit: true, sw: 'closed', name: 'switch closed' }, { lit: false, sw: 'open', name: 'switch open' }]} />
    <Note x={392} y={140} lines={['a switch on a', 'branch controls', 'only that branch']} />
  </PhysicsDiagram>
}

function Bulb({ x, y }: { x: number; y: number }) {
  return <g>
    <circle cx={x} cy={y} r="26" fill={P.light} opacity=".6" />
    <path d={`M${x - 11} ${y + 4}a14 14 0 1 1 22 0c-3 4 -4 7 -4 10h-14c0 -3 -1 -6 -4 -10z`} fill="#fff6d6" stroke={P.lightLine} strokeWidth="2" />
    <rect x={x - 7} y={y + 14} width={14} height={8} rx="2" fill={P.magnetic} stroke={P.magneticLine} strokeWidth="1.6" />
  </g>
}
function Kettle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-22 22L-18 -14Q-17 -22 -8 -22H10Q18 -22 19 -14L22 22Z" fill="#e8eef3" stroke="#5a6b79" strokeWidth="2.2" />
    <path d="M19 -10Q34 -8 31 8Q29 16 21 16" fill="none" stroke="#5a6b79" strokeWidth="3" />
    <path d="M-18 -8L-30 -16" stroke="#5a6b79" strokeWidth="4" />
    <rect x={-26} y={22} width={52} height={7} rx="3" fill="#5a6b79" />
    <path d="M-8 -22Q0 -30 8 -22" fill="none" stroke="#5a6b79" strokeWidth="2.4" />
  </g>
}
function Telly({ x, y }: { x: number; y: number }) {
  return <g>
    <rect x={x - 30} y={y - 20} width={60} height={40} rx="6" fill="#dfe8ef" stroke="#5a6b79" strokeWidth="2.2" />
    <rect x={x - 24} y={y - 14} width={48} height={28} rx="3" fill="#c6dcec" />
    <path d={`M${x - 10} ${y + 28}H${x + 10}M${x} ${y + 20}V${y + 28}`} stroke="#5a6b79" strokeWidth="3" />
  </g>
}
function Everyday() {
  const top = 124, bottom = 262, xs = [200, 310, 420], wall = '#fbf7f0'
  // Each appliance: [top of the drawing, bottom of the drawing], so the branch wire runs into it and out again.
  const ends: Array<[number, number]> = [[167, 208], [164, 223], [174, 222]]
  return <PhysicsDiagram viewBox="0 0 540 310" title="A house with the mains supply on the left. A lamp, a kettle and a television each sit on their own branch from the one supply, so each can be used on its own. Car electrics are wired in parallel too.">
    <path d="M40 290V112L270 30L500 112V290Z" fill={wall} stroke="#c9b79a" strokeWidth="2.2" />
    <path d="M24 290H516" stroke="#c9b79a" strokeWidth="3" />
    <Note x={270} y={100} lines={['lights and sockets are wired in parallel']} anchor="middle" />
    <Wire points={[[92, 164], [92, top], [xs[2], top], [xs[2], ends[2][0]]]} />
    <Wire points={[[xs[2], ends[2][1]], [xs[2], bottom], [92, bottom], [92, 224]]} />
    <rect x={62} y={164} width={60} height={60} rx="10" fill={P.panel} stroke={ink} strokeWidth="2" />
    <Txt x={92} y={189} lines={['mains', 'supply']} anchor="middle" size={13} weight={700} />
    {xs.slice(0, 2).map((x, i) => <g key={x}><Wire points={[[x, top], [x, ends[i][0]]]} /><Wire points={[[x, ends[i][1]], [x, bottom]]} /><Junction x={x} y={top} /><Junction x={x} y={bottom} /></g>)}
    <Bulb x={xs[0]} y={186} />
    <Kettle x={xs[1]} y={194} />
    <Telly x={xs[2]} y={194} />
    <Txt x={xs[0] + 10} y={230} lines={['lamp']} size={13} colour={muted} />
    <Txt x={xs[1] + 10} y={244} lines={['kettle']} size={13} colour={muted} />
    <Txt x={xs[2] - 10} y={244} lines={['TV']} size={13} colour={muted} anchor="end" />
    <g transform="translate(386 16)">
      <rect x={0} y={0} width={132} height={34} rx="17" fill="white" stroke={ink} strokeWidth="1.6" />
      <path d="M12 23h32v-7l-6 -7h-17l-7 7h-2z" fill={P.water} stroke={ink} strokeWidth="1.6" />
      <circle cx={20} cy={24} r="3.8" fill={ink} /><circle cx={37} cy={24} r="3.8" fill={ink} />
      <text x={56} y={22} fontSize="13" fontWeight="700" fill={ink}>cars too</text>
    </g>
  </PhysicsDiagram>
}

// ---------- Section: pd and current ----------

const wide: Layout = { left: 118, top: 62, bottom: 258, xs: [258, 398] }
function SamePd() {
  return <PhysicsDiagram viewBox="0 0 540 310" title="A 6 V cell with two lamps in parallel. One voltmeter is across the cell and one across each lamp. All three voltmeters read 6 V: the same pd on every branch.">
    <ParallelCircuit L={wide} branches={[{ lit: true, vm: '6 V', arrows: false }, { lit: true, vm: '6 V', arrows: false }]} cellVm="6 V" cellArrows={false} />
    <Note x={270} y={32} lines={['same pd on every branch']} anchor="middle" colour={P.pd} size={15} />
  </PhysicsDiagram>
}
function JunctionView() {
  return <PhysicsDiagram title="A cell with two lamp branches. The two junctions are highlighted. Current arrows show the current splitting at the top junction and joining again at the bottom junction.">
    <ParallelCircuit branches={[{ lit: true }, { lit: true }]} halo />
    <CurrentArrow x={280} y={62} rotate={0} />
    <CurrentArrow x={280} y={258} rotate={180} />
    <Note x={236} y={36} lines={['current splits']} colour={P.current} />
    <Note x={236} y={292} lines={['then joins again']} colour={P.current} />
    <Note x={392} y={140} lines={['a junction is', 'where wires meet']} />
  </PhysicsDiagram>
}
function Add() {
  return <PhysicsDiagram viewBox="0 0 540 300" title="A parallel circuit with three ammeters. The ammeter by the cell reads 3.0 A. The ammeter on branch 1 reads 1.2 A and the one on branch 2 reads 1.8 A. 3.0 = 1.2 + 1.8.">
    <ParallelCircuit branches={[{ lit: true, amm: '1.2 A' }, { lit: true, amm: '1.8 A' }]} cellAmm="3.0 A" />
    <Card x={420} y={110} w={112} h={96}>
      <Txt x={476} y={134} lines={['total']} anchor="middle" size={13} colour={muted} />
      <Runs x={476} y={162} runs={[['3.0', P.current], [' = ', ink]]} size={17} />
      <Runs x={476} y={188} runs={[['1.2', B1], [' + ', ink], ['1.8', B2]]} size={17} />
    </Card>
  </PhysicsDiagram>
}
function Worked({ step }: { step: 1 | 2 }) {
  const L: Layout = { left: 80, top: 66, bottom: 258, xs: [210, 330] }
  return <PhysicsDiagram viewBox="0 0 560 300" title={step === 1
    ? 'Worked example, step 1. A 12 V battery with two lamps in parallel. The ammeter by the battery reads 3.0 A and the branch 1 ammeter reads 1.2 A; the branch 2 ammeter is marked with a question mark. Each lamp has 12 V across it, the same as the battery.'
    : 'Worked example, step 2. The same circuit. The unknown branch 2 current is highlighted: 3.0 − 1.2 = 1.8 A.'}>
    <ParallelCircuit L={L} battery branches={[{ lit: true, amm: '1.2 A' }, { lit: true, amm: step === 1 ? '?' : '1.8 A', ammStrong: step === 2 }]} cellAmm="3.0 A" cellLabel="12 V" />
    <g opacity={step === 1 ? 1 : .4}>
      <Chip x={250} y={128} text="12 V" colour={P.pd} fill={P.pdFill} size={13} />
      <Chip x={370} y={128} text="12 V" colour={P.pd} fill={P.pdFill} size={13} />
    </g>
    {step === 1
      ? <g><StepChip x={414} y={34} text="Step 1: pd" colour={P.pd} />
        <Card x={414} y={64} w={138} h={96}><Txt x={426} y={90} lines={['same pd as the', 'battery on each', 'branch: 12 V']} size={13} weight={650} /></Card></g>
      : <g><StepChip x={414} y={34} text="Step 2: current" colour={P.current} />
        <Card x={414} y={64} w={138} h={112} highlight={B2}>
          <Runs x={483} y={92} runs={[['3.0', P.current], [' = ', ink], ['1.2', B1], [' + I₂', B2]]} size={14} />
          <Runs x={483} y={124} runs={[['I₂ = 3.0 − 1.2', ink]]} size={14} />
          <Runs x={483} y={156} runs={[['I₂ = 1.8 A', B2]]} size={16} />
        </Card></g>}
  </PhysicsDiagram>
}

// ---------- Section: resistance ----------

function AddBranch() {
  return <PhysicsDiagram title="The parallel circuit with a third lamp added on a new branch, which is highlighted. The new branch has the same pd as the others.">
    <ParallelCircuit L={three} branches={[{ lit: true }, { lit: true }, { lit: true, tint: true }]} />
    <Note x={440} y={140} lines={['new branch,', 'same pd']} colour={B3} />
  </PhysicsDiagram>
}
function MoreCurrent() {
  const mini = (x: number, n: 2 | 3, dim: boolean) => {
    const xs = n === 2 ? [110, 170] : [100, 150, 200]
    return <g transform={`translate(${x} 0)`} opacity={dim ? .45 : 1}>
      <ParallelCircuit L={{ left: 40, top: 96, bottom: 236, xs }} branches={xs.map(() => ({ lit: true, arrows: false }))} cellArrows={false} />
      <Arrow from={[34, 70]} to={[n === 2 ? 110 : 150, 70]} colour={P.current} width={n === 2 ? 3 : 7} />
    </g>
  }
  return <PhysicsDiagram title="Two parallel circuits side by side. On the left, faded, two branches with a thin total-current arrow. On the right, three branches with a thicker total-current arrow: more branches, more total current.">
    {mini(20, 2, true)}
    {mini(280, 3, false)}
    <Txt x={100} y={270} lines={['2 branches']} anchor="middle" colour={muted} weight={700} />
    <Txt x={380} y={270} lines={['3 branches']} anchor="middle" weight={700} />
    <Txt x={80} y={52} lines={['total current']} anchor="middle" size={13} colour={P.current} />
    <Txt x={360} y={52} lines={['bigger total current']} anchor="middle" size={13} colour={P.current} weight={750} />
    <Note x={270} y={296} lines={['more branches, more total current']} anchor="middle" size={14} />
  </PhysicsDiagram>
}
function LessResistance() {
  const row = (y: number, sym: string, colour: string, fill: string, word: string, dir: 'level' | 'up' | 'down') => <g>
    <circle cx={150} cy={y} r="24" fill={fill} stroke={colour} strokeWidth="2" />
    <text x={150} y={y + 7} textAnchor="middle" fontSize="20" fontWeight="750" fill={colour}>{sym}</text>
    {dir === 'level' && <Arrow from={[196, y]} to={[256, y]} colour={colour} width={4} />}
    {dir === 'up' && <Arrow from={[204, y + 18]} to={[246, y - 20]} colour={colour} width={6} />}
    {dir === 'down' && <Arrow from={[204, y - 18]} to={[246, y + 20]} colour={colour} width={4} />}
    <Txt x={280} y={y + 5} lines={[word]} colour={colour} size={15} weight={750} />
  </g>
  return <PhysicsDiagram viewBox="0 0 540 300" title="R = V ÷ I. When a branch is added the pd stays the same and the total current gets bigger, so the total resistance goes down.">
    <Card x={70} y={20} w={400} h={262} />
    <Runs x={270} y={54} runs={[['R', P.resistance], [' = ', ink], ['V', P.pd], [' ÷ ', ink], ['I', P.current]]} size={22} />
    {row(100, 'V', P.pd, P.pdFill, 'pd stays the same', 'level')}
    {row(166, 'I', P.current, quantityFill.I, 'total current bigger', 'up')}
    <path d="M110 204H430" stroke={P.panelLine} strokeWidth="1.6" />
    {row(242, 'R', P.resistance, P.resistanceFill, 'total resistance down', 'down')}
  </PhysicsDiagram>
}
function TotalR() {
  const res = (x: number, y: number, rot = 0) => <Resistor x={x} y={y} rotate={rot} length={44} />
  return <PhysicsDiagram viewBox="0 0 540 300" title="Left: two 10 ohm resistors in parallel; the total is less than 10 ohms. Right: two 10 ohm resistors in series; the total is 20 ohms. In parallel the total is less than any one resistor; in series the resistances add up.">
    <Txt x={130} y={34} lines={['parallel']} anchor="middle" size={15} weight={750} />
    <Wire points={[[40, 140], [80, 140]]} /><Wire points={[[180, 140], [220, 140]]} />
    <Wire points={[[80, 100], [80, 180]]} radius={0} /><Wire points={[[180, 100], [180, 180]]} radius={0} />
    <Wire points={[[80, 100], [180, 100]]} /><Wire points={[[80, 180], [180, 180]]} />
    <Junction x={80} y={140} /><Junction x={180} y={140} />
    <circle cx={40} cy={140} r="4" fill="white" stroke={P.wire} strokeWidth="2" /><circle cx={220} cy={140} r="4" fill="white" stroke={P.wire} strokeWidth="2" />
    {res(130, 100)}{res(130, 180)}
    <Txt x={130} y={84} lines={['10 Ω']} anchor="middle" size={13} colour={P.resistance} weight={700} />
    <Txt x={130} y={214} lines={['10 Ω']} anchor="middle" size={13} colour={P.resistance} weight={700} />
    <Chip x={130} y={246} text="total less than 10 Ω" colour={P.resistance} fill={P.resistanceFill} size={13} />
    <path d="M270 50V230" stroke={P.panelLine} strokeWidth="1.6" strokeDasharray="5 6" />
    <Txt x={405} y={34} lines={['series']} anchor="middle" size={15} weight={750} />
    <Wire points={[[300, 140], [510, 140]]} />
    <circle cx={300} cy={140} r="4" fill="white" stroke={P.wire} strokeWidth="2" /><circle cx={510} cy={140} r="4" fill="white" stroke={P.wire} strokeWidth="2" />
    {res(365, 140)}{res(445, 140)}
    <Txt x={365} y={120} lines={['10 Ω']} anchor="middle" size={13} colour={P.resistance} weight={700} />
    <Txt x={445} y={120} lines={['10 Ω']} anchor="middle" size={13} colour={P.resistance} weight={700} />
    <Chip x={405} y={246} text="total is 20 Ω" colour={P.resistance} fill={P.resistanceFill} size={13} />
    <Note x={270} y={290} lines={['parallel: less than any one;  series: add up']} anchor="middle" size={14} />
  </PhysicsDiagram>
}

// ---------- On your own ----------

function QCircuit() {
  return <PhysicsDiagram title="A circuit with a cell and two parallel branches, A and B, each with a lamp. There are three numbered ammeters: 1 next to the cell, 2 on branch A and 3 on branch B.">
    <ParallelCircuit L={{ left: 140, top: 62, bottom: 258, xs: [280, 400] }} branches={[{ lit: true, num: 2, name: 'branch A' }, { lit: true, num: 3, name: 'branch B' }]} cellNum={1} />
  </PhysicsDiagram>
}

export function ParallelVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'parallel-branches': return <Branches />
    case 'parallel-remove': return <Remove />
    case 'parallel-switch': return <Switches />
    case 'parallel-everyday': return <Everyday />
    case 'parallel-same-pd': return <SamePd />
    case 'parallel-junction': return <JunctionView />
    case 'parallel-add': return <Add />
    case 'parallel-worked-pd': return <Worked step={1} />
    case 'parallel-worked-current': return <Worked step={2} />
    case 'parallel-add-branch': return <AddBranch />
    case 'parallel-more-current': return <MoreCurrent />
    case 'parallel-less-resistance': return <LessResistance />
    case 'parallel-total-r': return <TotalR />
    case 'parallel-q-circuit': return <QCircuit />
    default: return null
  }
}
