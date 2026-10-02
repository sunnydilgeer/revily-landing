import type { ReactNode } from 'react'
import { physicsPalette, PhysicsDiagram, Lines } from './PhysicsKit'
import { Arrow } from './GasParticleVisuals'

/*
 * Higher-only diagrams for Physics Lesson 26 (AQA 8464 6.2.4.3 HT: Vp × Ip = Vs × Is). Original, code-native schematics;
 * not to scale. Focus ids start with 'htrans-' and are routed from CellBiologyVisuals.tsx.
 *
 * One close-up of a transformer is built up frame by frame: the iron core with a primary coil (left) and a secondary coil
 * (right), then Vp/Ip and Vs/Is, then power in = power out, then the equation. Same look as the Foundation grid drawings
 * (GridVisuals.tsx): steel-grey transformer, pd violet, current vermilion; the coils are copper. The teaching drawing is a
 * step-up transformer (more turns on the secondary), as on the grid; the worked example is a step-down one.
 * The question view gives Vp, Ip and Vs and shows Is as "?".
 */
const P = physicsPalette
const { ink, muted } = P
const steel = '#7f95a6', steelFill = '#eef2f5'
const copper = '#b8692f', copperBack = '#e4bf9f'

// Core: outer ring 200–340 × 40–200, limbs 30 thick. Primary limb centre 215, secondary limb centre 325.
const CORE = { x0: 200, x1: 340, y0: 40, y1: 200, t: 30 }
const PX = 215, SX = 325, RX = 23
const IN_X = 112, OUT_X = 428

type Coil = { cx: number; ys: number[] }
const turns = (from: number, to: number, n: number) => Array.from({ length: n }, (_, i) => Math.round(from + (to - from) * i / (n - 1)))

/* ---------- Text with subscripts: Vp, Ip, Vs, Is ---------- */

type Tok = string | { base: string; sub: string; colour: string }
const V = (sub: string): Tok => ({ base: 'V', sub, colour: P.pd })
const I = (sub: string): Tok => ({ base: 'I', sub, colour: P.current })
/** One line of text in which symbols get a lowered subscript. Spaces are non-breaking so they survive. */
function Eq({ x, y, toks, size = 15, anchor = 'middle', colour = ink, weight = 700 }: { x: number; y: number; toks: Tok[]; size?: number; anchor?: 'start' | 'middle' | 'end'; colour?: string; weight?: number }) {
  const drop = Math.round(size * 0.3)
  let lowered = false
  const parts: ReactNode[] = []
  toks.forEach((t, i) => {
    const back = lowered ? -drop : 0
    if (typeof t === 'string') { parts.push(<tspan key={i} dy={back}>{t.replace(/ /g, ' ')}</tspan>); lowered = false; return }
    parts.push(<tspan key={`${i}b`} dy={back} fill={t.colour}>{t.base}</tspan>)
    parts.push(<tspan key={`${i}s`} dy={drop} fill={t.colour} fontSize={Math.max(12, Math.round(size * 0.72))}>{t.sub}</tspan>)
    lowered = true
  })
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={colour}>{parts}</text>
}

/* ---------- The transformer ---------- */

function Core() {
  const { x0, x1, y0, y1, t } = CORE
  const outer = `M${x0 + 12} ${y0}H${x1 - 12}Q${x1} ${y0} ${x1} ${y0 + 12}V${y1 - 12}Q${x1} ${y1} ${x1 - 12} ${y1}H${x0 + 12}Q${x0} ${y1} ${x0} ${y1 - 12}V${y0 + 12}Q${x0} ${y0} ${x0 + 12} ${y0}Z`
  const inner = `M${x0 + t + 5} ${y0 + t}H${x1 - t - 5}Q${x1 - t} ${y0 + t} ${x1 - t} ${y0 + t + 5}V${y1 - t - 5}Q${x1 - t} ${y1 - t} ${x1 - t - 5} ${y1 - t}H${x0 + t + 5}Q${x0 + t} ${y1 - t} ${x0 + t} ${y1 - t - 5}V${y0 + t + 5}Q${x0 + t} ${y0 + t} ${x0 + t + 5} ${y0 + t}Z`
  return <path d={`${outer}${inner}`} fillRule="evenodd" fill={steelFill} stroke={steel} strokeWidth="2.2" />
}
// Each turn is a ring round the limb: the back half (behind the core) pale, the front half copper.
const arc = (cx: number, y: number, sweep: 0 | 1) => `M${cx - RX} ${y}A${RX} 6 0 0 ${sweep} ${cx + RX} ${y}`
function CoilBack({ cx, ys }: Coil) {
  return <g stroke={copperBack} strokeWidth="3" fill="none">{ys.map(y => <path key={y} d={arc(cx, y, 1)} />)}</g>
}
function CoilFront({ cx, ys }: Coil) {
  return <g stroke={copper} strokeWidth="3.2" fill="none">{ys.map(y => <path key={y} d={arc(cx, y, 0)} />)}</g>
}
/** Two leads from the ends of a coil to a pair of terminals at `tx`. */
function Leads({ cx, ys, tx, side }: Coil & { tx: number; side: -1 | 1 }) {
  const ends = [ys[0], ys[ys.length - 1]]
  const x = cx + side * RX
  return <g>
    {ends.map(y => <path key={y} d={`M${x} ${y}H${tx}`} stroke={copper} strokeWidth="2.6" fill="none" />)}
    {ends.map(y => <circle key={`t${y}`} cx={tx} cy={y} r="5" fill="white" stroke={ink} strokeWidth="2" />)}
  </g>
}

/** The transformer close-up. `secondary` = number of turns on the secondary coil (the primary has 4). */
function Transformer({ secondary = 8, children }: { secondary?: number; children?: ReactNode }) {
  const p: Coil = { cx: PX, ys: turns(92, 152, 4) }
  const s: Coil = secondary > 4 ? { cx: SX, ys: turns(80, 164, secondary) } : { cx: SX, ys: turns(104, 140, secondary) }
  return <g>
    <CoilBack {...p} /><CoilBack {...s} />
    <Core />
    <CoilFront {...p} /><CoilFront {...s} />
    <Leads {...p} tx={IN_X} side={-1} />
    <Leads {...s} tx={OUT_X} side={1} />
    {children}
  </g>
}
const P_TOP = 92, P_BOT = 152
const sEnds = (secondary: number) => secondary > 4 ? [80, 164] : [104, 140]

function Names() {
  return <g>
    <Lines x={270} y={28} anchor="middle" lines={['iron core']} size={13} weight={600} colour={muted} />
    <Lines x={178} y={226} anchor="middle" lines={['primary coil']} size={14} colour={copper} />
    <Lines x={364} y={226} anchor="middle" lines={['secondary coil']} size={14} colour={copper} />
    <Lines x={IN_X} y={192} anchor="middle" lines={['electricity in']} size={13} weight={600} colour={muted} />
    <Lines x={OUT_X} y={192} anchor="middle" lines={['electricity out']} size={13} weight={600} colour={muted} />
  </g>
}
/** Vp and Vs as violet double arrows across each pair of terminals; Ip and Is as vermilion arrows on the top leads. */
function Symbols({ secondary = 8 }: { secondary?: number }) {
  const [sTop, sBot] = sEnds(secondary)
  return <g>
    <Arrow from={[IN_X - 18, P_TOP + 4]} to={[IN_X - 18, P_BOT - 4]} colour={P.pd} width={2.2} both />
    <Eq x={IN_X - 28} y={(P_TOP + P_BOT) / 2 + 6} toks={[V('p')]} anchor="end" size={18} />
    <Arrow from={[134, P_TOP]} to={[176, P_TOP]} colour={P.current} width={3} />
    <Eq x={155} y={P_TOP - 12} toks={[I('p')]} size={18} />
    <Arrow from={[OUT_X + 18, sTop + 4]} to={[OUT_X + 18, sBot - 4]} colour={P.pd} width={2.2} both />
    <Eq x={OUT_X + 28} y={(sTop + sBot) / 2 + 6} toks={[V('s')]} anchor="start" size={18} />
    <Arrow from={[366, sTop]} to={[408, sTop]} colour={P.current} width={3} />
    <Eq x={387} y={sTop - 12} toks={[I('s')]} size={18} />
  </g>
}

/* ---------- Boxes under the drawing ---------- */

function Chip({ x, y, w, h = 40, fill = 'white', line = P.panelLine, children }: { x: number; y: number; w: number; h?: number; fill?: string; line?: string; children: ReactNode }) {
  return <g><rect x={x - w / 2} y={y} width={w} height={h} rx={h / 2} fill={fill} stroke={line} strokeWidth="1.8" />{children}</g>
}
function PowerRow({ y }: { y: number }) {
  return <g>
    <Chip x={156} y={y} w={190} fill={P.usefulFill} line={P.useful}><Eq x={156} y={y + 26} toks={['power in = ', V('p'), ' × ', I('p')]} size={16} /></Chip>
    <text x={270} y={y + 29} textAnchor="middle" fontSize="26" fontWeight="700" fill={ink}>=</text>
    <Chip x={384} y={y} w={190} fill={P.usefulFill} line={P.useful}><Eq x={384} y={y + 26} toks={['power out = ', V('s'), ' × ', I('s')]} size={16} /></Chip>
  </g>
}
const EQUATION: Tok[] = [V('p'), ' × ', I('p'), '  =  ', V('s'), ' × ', I('s')]

/* ---------- Teaching frames ---------- */

function Coils() {
  return <PhysicsDiagram viewBox="0 0 540 240" title="A transformer: two coils of copper wire wound on an iron core. The primary coil on the left has 4 turns and is where electricity goes in. The secondary coil on the right has 8 turns and is where electricity comes out.">
    <Transformer><Names /></Transformer>
  </PhysicsDiagram>
}
function Labels() {
  return <PhysicsDiagram viewBox="0 0 540 240" title="The same transformer. Across the primary coil is a pd, Vp, and in it a current, Ip. Across the secondary coil is a pd, Vs, and in it a current, Is.">
    <Transformer><Names /><Symbols /></Transformer>
  </PhysicsDiagram>
}
function Power() {
  return <PhysicsDiagram viewBox="0 0 540 320" title="The same transformer, labelled Vp, Ip, Vs and Is. Below: power in equals Vp times Ip, power out equals Vs times Is, and the two are equal because a transformer is nearly 100% efficient.">
    <Transformer><Names /><Symbols /></Transformer>
    <PowerRow y={246} />
    <Lines x={270} y={308} anchor="middle" lines={['nearly 100% efficient: almost no energy wasted']} size={13} weight={600} colour={P.useful} />
  </PhysicsDiagram>
}
function All() {
  return <PhysicsDiagram viewBox="0 0 540 372" title="Put it together. The transformer with Vp, Ip, Vs and Is labelled. The transformer equation: Vp times Ip equals Vs times Is. Step-up: Vs goes up, so Is goes down. Step-down: Vs goes down, so Is goes up.">
    <Transformer><Names /><Symbols /></Transformer>
    <rect x={110} y={244} width={320} height={50} rx="16" fill={P.panel} stroke={ink} strokeWidth="2" />
    <Eq x={270} y={277} toks={EQUATION} size={24} />
    {([['step-up', 150, 'up', 'down'], ['step-down', 390, 'down', 'up']] as const).map(([name, x, v, i]) => <Chip key={name} x={x} y={308} w={220} h={44} fill={P.pdFill} line={P.pd}>
      <text x={x - 4} y={335} textAnchor="end" fontSize="14" fontWeight="700" fill={ink}>{name}:</text>
      <Eq x={x + 6} y={335} toks={[V('s'), v === 'up' ? ' ↑   ' : ' ↓   ', I('s'), i === 'up' ? ' ↑' : ' ↓']} anchor="start" size={16} />
    </Chip>)}
  </PhysicsDiagram>
}

/* ---------- Worked example and question ---------- */

function Values({ y, left, right }: { y: number; left: [Tok[], Tok[]]; right: [Tok[], Tok[]] }) {
  return <g>
    {[left, right].map((pair, side) => pair.map((toks, row) => <Chip key={`${side}${row}`} x={side ? 390 : 150} y={y + row * 46} w={200}>
      <Eq x={side ? 390 : 150} y={y + row * 46 + 26} toks={toks} size={16} />
    </Chip>))}
  </g>
}
function Worked() {
  return <PhysicsDiagram viewBox="0 0 540 408" title="Worked example: a step-down transformer. Primary coil: Vp = 230 V, Ip = 2.0 A. Secondary coil: Vs = 23 V. Working: 230 times 2.0 equals 23 times Is, so 460 equals 23 times Is, and Is equals 460 divided by 23, which is 20 A.">
    <Transformer secondary={2}><Names /><Symbols secondary={2} /></Transformer>
    <Values y={246} left={[[V('p'), ' = 230 V'], [I('p'), ' = 2.0 A']]} right={[[V('s'), ' = 23 V'], [I('s'), ' = 20 A']]} />
    <rect x={30} y={346} width={480} height={48} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.8" />
    <Eq x={270} y={376} toks={['230 × 2.0 = 23 × ', I('s'), '   →   ', I('s'), ' = 460 ÷ 23 = 20 A']} size={16} />
  </PhysicsDiagram>
}
function Question() {
  return <PhysicsDiagram viewBox="0 0 540 346" title="A step-up transformer. Primary coil: Vp = 25 000 V, Ip = 400 A. Secondary coil: Vs = 400 000 V. The secondary current, Is, is unknown.">
    <Transformer><Names /><Symbols /></Transformer>
    <Values y={246} left={[[V('p'), ' = 25 000 V'], [I('p'), ' = 400 A']]} right={[[V('s'), ' = 400 000 V'], [I('s'), ' = ?']]} />
  </PhysicsDiagram>
}

export function HigherTransformerVisual({ focus }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'htrans-coils': return <Coils />
    case 'htrans-labels': return <Labels />
    case 'htrans-power': return <Power />
    case 'htrans-all': return <All />
    case 'htrans-worked': return <Worked />
    case 'htrans-question': return <Question />
    default: return <All />
  }
}
