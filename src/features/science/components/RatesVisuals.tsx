import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry Lesson 31: Rates of reaction and collision theory. Original, code-native schematics; not to scale.
 * Focus ids start with 'rates-'.
 *
 * Colour code (shared with Lesson 32): reactant particle A = electron blue, reactant particle B = coral, a product = A and B
 * joined together. Amber = energy (highlights, activation energy, collision bursts). Graph lines: 1 ink, 2 coral, 3 blue, 4 green.
 * Assessment views keep numbered badges and hide every word that names an answer (faster, slower, more product...).
 * The small helpers are exported so Lesson 32 (RateFactorVisuals) draws particles, bursts and graphs the same way.
 */
export const { ink, muted, protonFill, protonLine, electronFill, electronLine, lightIso, darkIsoLine, panelFill, panelLine, space, spaceLine, glow } = atomPalette
export const amber = '#d98a1c', amberInk = '#8a5a14', amberTint = '#f7c65a'
const r1 = (n: number) => Math.round(n * 10) / 10

export function Diagram({ title, children, viewBox = '0 0 540 300' }: { title: string; children: ReactNode; viewBox?: string }) {
  const id = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={id}><title id={id}>{`${title} Original schematic, not to scale.`}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}

// ---------- particles ----------
export type Kind = 'a' | 'b'
export function Particle({ x, y, kind, r = 8, opacity = 1 }: { x: number; y: number; kind: Kind; r?: number; opacity?: number }) {
  const fill = kind === 'a' ? electronFill : protonFill, line = kind === 'a' ? electronLine : protonLine
  return <g opacity={opacity}>
    <circle cx={r1(x)} cy={r1(y)} r={r} fill={fill} stroke={line} strokeWidth="1.5" />
    <path d={`M${r1(x - r * 0.55)} ${r1(y - r * 0.15)}a${r * 0.55} ${r * 0.55} 0 0 1 ${r1(r * 0.45)} ${r1(-r * 0.4)}`} stroke="white" strokeWidth="1.6" opacity="0.7" fill="none" />
  </g>
}
// A product: particle A and particle B joined together.
export function Product({ x, y, r = 8, angle = 0, opacity = 1 }: { x: number; y: number; r?: number; angle?: number; opacity?: number }) {
  return <g opacity={opacity} transform={`translate(${r1(x)} ${r1(y)}) rotate(${angle})`}>
    <Particle x={-r * 0.7} y={0} kind="a" r={r} /><Particle x={r * 0.7} y={0} kind="b" r={r} />
  </g>
}
// Soft curved motion lines behind a particle moving at `angle` degrees (0 = to the right). `len` 0 = still.
export function Trail({ x, y, angle, len, r = 8, opacity = 0.6 }: { x: number; y: number; angle: number; len: number; r?: number; opacity?: number }) {
  if (len <= 0) return null
  const lines = len > 20 ? [-5, 0, 5] : [-4, 4]
  return <g transform={`translate(${r1(x)} ${r1(y)}) rotate(${angle})`} opacity={opacity} stroke={muted} strokeWidth="1.6" fill="none">
    {lines.map((o, i) => <path key={i} d={`M${-r - 3} ${o}q${-len * 0.5} ${o * 0.35 + 2} ${-len + Math.abs(o) * 1.2} ${o * 0.5}`} />)}
  </g>
}
export function Moving({ x, y, kind, angle, len, opacity = 1 }: { x: number; y: number; kind: Kind; angle: number; len: number; opacity?: number }) {
  return <g opacity={opacity}><Trail x={x} y={y} angle={angle} len={len} /><Particle x={x} y={y} kind={kind} /></g>
}
// A soft, slightly uneven starburst marking a collision.
export function Burst({ x, y, size = 1, opacity = 1 }: { x: number; y: number; size?: number; opacity?: number }) {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2, rad = (i % 2 ? 6 : [13, 11, 14, 12][(i / 2) % 4]) * size
    return `${r1(x + rad * Math.cos(a))} ${r1(y + rad * Math.sin(a))}`
  })
  return <path d={`M${pts.join('L')}Z`} fill={amberTint} stroke={amber} strokeWidth="1.5" opacity={opacity} />
}
// Two particles hitting each other, with a burst between them.
export function Collision({ x, y, angle = 0, strong = true }: { x: number; y: number; angle?: number; strong?: boolean }) {
  return <g transform={`translate(${r1(x)} ${r1(y)}) rotate(${angle})`}>
    <Trail x={-9} y={0} angle={0} len={strong ? 22 : 12} /><Trail x={9} y={0} angle={180} len={strong ? 22 : 12} />
    <Particle x={-9} y={0} kind="a" /><Particle x={9} y={0} kind="b" />
    <Burst x={0} y={-12} size={0.7} />
  </g>
}

export function Badge({ x, y, n, colour = ink, opacity = 1 }: { x: number; y: number; n: number | string; colour?: string; opacity?: number }) {
  return <g opacity={opacity}><circle cx={r1(x)} cy={r1(y)} r="12" fill="white" stroke={colour} strokeWidth="2" /><text x={r1(x)} y={r1(y + 5)} textAnchor="middle" fontSize="14" fontWeight="700" fill={colour}>{n}</text></g>
}
export function Head({ x, y, angle, c, s = 1 }: { x: number; y: number; angle: number; c: string; s?: number }) {
  return <path d={`M${-10 * s} ${-6 * s}L0 0L${-10 * s} ${6 * s}Z`} transform={`translate(${r1(x)} ${r1(y)}) rotate(${angle})`} fill={c} stroke={c} strokeWidth="1" />
}
export function VArrow({ x, y1, y2, c, w = 3 }: { x: number; y1: number; y2: number; c: string; w?: number }) {
  const up = y2 < y1
  return <g><path d={`M${x} ${y1}V${y2 + (up ? 8 : -8)}`} stroke={c} strokeWidth={w} fill="none" /><Head x={x} y={y2} angle={up ? -90 : 90} c={c} /></g>
}

// ---------- product-time graph ----------
// Graph space: origin (GX, GY), time runs 0..GT to the right, product goes up. A line rises to height H and goes flat at time T:
// H (1 - (1 - t / T)^2.6), then H. `tau` below is that finishing time T.
export const GX = 76, GY = 252, GT = 290
export const curveY = (H: number, tau: number, t: number) => GY - H * (t >= tau ? 1 : 1 - Math.pow(1 - t / tau, 2.6))
export function curvePath(H: number, tau: number, tEnd = GT) {
  const pts: string[] = []
  for (let t = 0; t <= tEnd; t += 4) pts.push(`${GX + t} ${r1(curveY(H, tau, t))}`)
  return `M${pts.join('L')}`
}
export function GraphAxes({ yLabel = 'Amount of product formed' }: { yLabel?: string }) {
  return <g>
    <path d={`M${GX} 34V${GY}H${GX + GT + 18}`} stroke={ink} strokeWidth="2.5" fill="none" />
    <Head x={GX} y={30} angle={-90} c={ink} /><Head x={GX + GT + 22} y={GY} angle={0} c={ink} />
    <g fontSize="14" fontWeight="700" fill={ink}>
      <text transform={`translate(${GX - 20} ${(GY + 34) / 2}) rotate(-90)`} textAnchor="middle">{yLabel}</text>
      <text x={GX + GT / 2} y={GY + 30} textAnchor="middle">Time</text>
    </g>
  </g>
}
export interface Line { n: number | string; H: number; tau: number; colour: string; badgeT: number; dashed?: boolean; badgeDy?: number }
export function GraphLine({ line, opacity = 1, badge = true, width = 4 }: { line: Line; opacity?: number; badge?: boolean; width?: number }) {
  const { H, tau, colour, badgeT, dashed, n, badgeDy = 0 } = line
  return <g opacity={opacity}>
    <path d={curvePath(H, tau)} stroke={colour} strokeWidth={width} fill="none" strokeDasharray={dashed ? '10 7' : undefined} />
    {badge && <Badge x={GX + badgeT} y={curveY(H, tau, badgeT) + badgeDy} n={n} colour={colour} />}
  </g>
}
// A key row beside the graph: badge + one or two short lines.
export function KeyRow({ x, y, n, colour, lines, opacity = 1 }: { x: number; y: number; n: number | string; colour: string; lines: string[]; opacity?: number }) {
  return <g opacity={opacity}>
    <Badge x={x + 12} y={y} n={n} colour={colour} />
    <g fontSize="14" fill={ink}>{lines.map((l, i) => <text key={i} x={x + 32} y={y + 5 + i * 17} fontWeight={i === 0 ? 700 : 400}>{l}</text>)}</g>
  </g>
}

const H = 140
const LINES: Record<number, Line> = {
  1: { n: 1, H, tau: 160, colour: ink, badgeT: 50 },
  2: { n: 2, H, tau: 70, colour: protonLine, badgeT: 16 },
  3: { n: 3, H, tau: 260, colour: electronLine, badgeT: 110 },
  4: { n: 4, H: 196, tau: 160, colour: darkIsoLine, badgeT: 110 },
}

// ---------- Section: what rate means ----------
function Meaning() {
  // a nail with rust patches, and a firework burst
  const rust = '#b8733f', rustTint = '#e0a878'
  const rays = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2)
  return <Diagram title="Two reactions at different rates. An iron nail rusts slowly, over weeks. A firework burns fast, in about a second. The rate is how fast reactants change into products.">
    <rect x="20" y="16" width="240" height="210" rx="22" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <rect x="280" y="16" width="240" height="210" rx="22" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    {/* nail */}
    <g transform="translate(140 118) rotate(-28)">
      <path d="M-78 -13q-4 13 0 26h10v-26z" fill="#c6ced5" stroke="#7f8c97" strokeWidth="2" />
      <path d="M-68 -5H62L84 0L62 5H-68Z" fill="#dde3e8" stroke="#7f8c97" strokeWidth="2" />
      <path d="M-40 -5q6 -4 14 -1q6 5 -2 7q-8 3 -12 -1z" fill={rustTint} stroke={rust} strokeWidth="1.5" />
      <path d="M2 -4q8 -5 16 0q4 6 -6 8q-10 1 -10 -4z" fill={rustTint} stroke={rust} strokeWidth="1.5" />
      <path d="M36 2q7 -6 13 -2q2 5 -5 6q-6 1 -8 -2z" fill={rustTint} stroke={rust} strokeWidth="1.5" />
    </g>
    <text x="140" y="200" textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>Slow: weeks</text>
    <text x="140" y="44" textAnchor="middle" fontSize="14" fill={muted}>A nail rusting</text>
    {/* firework */}
    <g transform="translate(400 118)">
      {rays.map((a, i) => {
        const c = i % 2 ? protonLine : amber, R = i % 3 ? 52 : 44
        return <g key={i}>
          <path d={`M${r1(12 * Math.cos(a))} ${r1(12 * Math.sin(a))}Q${r1(30 * Math.cos(a + 0.12))} ${r1(30 * Math.sin(a + 0.12))} ${r1(R * Math.cos(a))} ${r1(R * Math.sin(a))}`} stroke={c} strokeWidth="3" fill="none" />
          <circle cx={r1((R + 8) * Math.cos(a))} cy={r1((R + 8) * Math.sin(a))} r="3" fill={i % 2 ? protonFill : amberTint} stroke={c} strokeWidth="1" />
        </g>
      })}
      <circle r="8" fill={amberTint} stroke={amber} strokeWidth="2" />
    </g>
    <text x="400" y="200" textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>Fast: a second</text>
    <text x="400" y="44" textAnchor="middle" fontSize="14" fill={muted}>A firework</text>
    <text x="270" y="262" textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>rate = how fast reactants change into products</text>
  </Diagram>
}

function Single({ stage }: { stage: 'curve' | 'steep' | 'flat' }) {
  const Hs = 160, tau = 210
  const band = (t0: number, t1: number) => {
    const pts: string[] = []
    for (let t = t0; t <= t1; t += 4) pts.push(`${GX + t} ${r1(curveY(Hs, tau, t))}`)
    return `M${pts.join('L')}`
  }
  const titles = {
    curve: 'A graph of amount of product formed against time. The line rises steeply at first, then gets less steep, then goes flat.',
    steep: 'The same graph with the steep start highlighted. Here a lot of product forms quickly, so the reaction is fast.',
    flat: 'The same graph with the flat end highlighted. No more product forms, so the reaction has finished because the reactants are used up.',
  }
  return <Diagram title={titles[stage]}>
    <GraphAxes />
    {stage === 'steep' && <path d={band(0, 44)} stroke={amberTint} strokeWidth="18" fill="none" opacity="0.8" />}
    {stage === 'flat' && <path d={band(214, GT)} stroke={amberTint} strokeWidth="18" fill="none" opacity="0.8" />}
    <path d={curvePath(Hs, tau)} stroke={ink} strokeWidth="4" fill="none" opacity={stage === 'curve' ? 1 : 0.35} />
    {stage === 'steep' && <g><path d={band(0, 44)} stroke={ink} strokeWidth="4" fill="none" />
      <g fontSize="15" fill={amberInk}><text x={GX + 56} y={205} fontWeight="700">Steep:</text><text x={GX + 56} y={223}>fast reaction</text></g></g>}
    {stage === 'flat' && <g><path d={band(214, GT)} stroke={ink} strokeWidth="4" fill="none" />
      <g fontSize="15" fill={amberInk}><text x={GX + 150} y={62} fontWeight="700">Flat: reaction finished</text></g>
      <text x={GX + 196} y={124} fontSize="14" fill={ink}>reactants used up</text></g>}
  </Diagram>
}

// ---------- Section: comparing lines ----------
type LineStage = 'original' | 'faster' | 'slower' | 'same' | 'more'
function Lines({ stage }: { stage: LineStage }) {
  const order: LineStage[] = ['original', 'faster', 'slower', 'same', 'more']
  const idx = order.indexOf(stage)
  const shown = [1, 2, 3, 4].filter((n) => n === 1 || (n === 2 && idx >= 1) || (n === 3 && idx >= 2) || (n === 4 && idx >= 4))
  const active = stage === 'original' ? 1 : stage === 'faster' ? 2 : stage === 'slower' ? 3 : stage === 'more' ? 4 : 0
  const op = (n: number) => active === 0 ? 1 : n === active ? 1 : 0.3
  const key: Record<number, string[]> = { 1: ['original', 'reaction'], 2: ['faster'], 3: ['slower'], 4: ['more product', 'made'] }
  const keyY: Record<number, number> = { 1: 52, 2: 104, 3: 146, 4: 188 }
  const titles: Record<LineStage, string> = {
    original: 'A graph of amount of product formed against time with one line, line 1, the original reaction.',
    faster: 'Line 2 is added. It is steeper than line 1 at the start and goes flat sooner, at the same height. It is a faster reaction.',
    slower: 'Line 3 is added. It is less steep than line 1 at the start and goes flat later, at the same height. It is a slower reaction.',
    same: 'Lines 1, 2 and 3 all go flat at the same height, shown by a dashed line. They made the same amount of product in different times.',
    more: 'Line 4 goes flat at a greater height than lines 1, 2 and 3. More product was made, which needs more reactants at the start.',
  }
  return <Diagram title={titles[stage]}>
    <GraphAxes />
    {stage === 'same' && <g><path d={`M${GX} ${GY - H}H${GX + GT}`} stroke={amber} strokeWidth="2" strokeDasharray="7 6" fill="none" />
      <text x={GX + 60} y={GY - H - 10} fontSize="14" fontWeight="700" fill={amberInk}>same amount of product</text></g>}
    {shown.map((n) => <GraphLine key={n} line={LINES[n]} opacity={op(n)} />)}
    {shown.map((n) => <KeyRow key={n} x={396} y={keyY[n]} n={n} colour={LINES[n].colour} lines={key[n]} opacity={op(n)} />)}
    {stage === 'more' && <text x={428} y={244} fontSize="14" fontWeight="700" fill={darkIsoLine}>needs more</text>}
    {stage === 'more' && <text x={428} y={261} fontSize="14" fontWeight="700" fill={darkIsoLine}>reactants</text>}
  </Diagram>
}

// ---------- Section: collision theory ----------
function Box({ x, y, w, h, children, tint = space }: { x: number; y: number; w: number; h: number; children?: ReactNode; tint?: string }) {
  return <g><rect x={x} y={y} width={w} height={h} rx="24" fill={tint} stroke={spaceLine} strokeWidth="2" />{children}</g>
}
function Collide() {
  const loose: [number, number, Kind, number, number][] = [
    [110, 80, 'a', 20, 16], [200, 70, 'b', 150, 14], [96, 200, 'b', -40, 18], [180, 226, 'a', 200, 14],
    [390, 76, 'a', 160, 16], [450, 150, 'b', 250, 14], [370, 222, 'b', -20, 16], [460, 230, 'a', 190, 12], [140, 140, 'a', 80, 12],
  ]
  return <Diagram title="Particles moving about in a mixture. Two particles in the middle are heading straight for each other and are about to collide.">
    <Box x={40} y={30} w={460} h={230} />
    {loose.map(([x, y, k, a, l], i) => <Moving key={i} x={x} y={y} kind={k} angle={a} len={l} />)}
    <Moving x={238} y={150} kind="a" angle={0} len={34} />
    <Moving x={306} y={150} kind="b" angle={180} len={34} />
    <Head x={258} y={150} angle={0} c={ink} s={0.8} /><Head x={286} y={150} angle={180} c={ink} s={0.8} />
    <text x={272} y={122} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>collide</text>
    <text x={270} y={286} textAnchor="middle" fontSize="14" fill={muted}>Reactant particles are always moving and bumping into each other.</text>
  </Diagram>
}
function Energy() {
  const row = (y: number, strong: boolean) => <g>
    <Moving x={84} y={y} kind="a" angle={0} len={strong ? 34 : 12} /><Moving x={120} y={y} kind="b" angle={180} len={strong ? 34 : 12} />
    <Burst x={102} y={y - 20} size={strong ? 1 : 0.55} />
    <path d={`M180 ${y}H206`} stroke={muted} strokeWidth="2.5" fill="none" /><Head x={212} y={y} angle={0} c={muted} />
    {strong ? <Product x={262} y={y} /> : <g><Moving x={236} y={y} kind="a" angle={180} len={12} /><Moving x={296} y={y} kind="b" angle={0} len={12} /></g>}
  </g>
  return <Diagram title="Two collisions. Top: the particles collide gently, with too little energy, and bounce apart with no reaction. Bottom: the particles collide hard, with enough energy, and join to make a product.">
    <Box x={20} y={24} w={500} h={110} />
    <Box x={20} y={156} w={500} h={110} tint={glow} />
    {row(80, false)}{row(212, true)}
    <g fontSize="15" fill={ink}>
      <text x={340} y={74} fontWeight="700">too little energy:</text><text x={340} y={94}>no reaction</text>
      <text x={340} y={206} fontWeight="700">enough energy:</text><text x={340} y={226}>reaction</text>
    </g>
  </Diagram>
}
function Activation() {
  // ground on the left (reactants), a soft mound, lower ground on the right (products)
  const hill = 'M30 210H150C200 210 205 70 260 70C318 70 318 236 380 236H510'
  return <Diagram title="A particle has to get over a hill before it can react. The height of the hill is the activation energy, the minimum energy the particles need to react.">
    <path d={`${hill}V270H30Z`} fill={lightIso} opacity="0.55" />
    <path d={hill} stroke={darkIsoLine} strokeWidth="3" fill="none" />
    <path d="M110 188C170 150 200 40 262 44C320 48 350 170 420 212" stroke={amber} strokeWidth="2.5" strokeDasharray="6 7" fill="none" />
    <Head x={422} y={214} angle={30} c={amber} s={0.9} />
    <Product x={440} y={224} opacity={0.35} />
    <Moving x={100} y={200} kind="a" angle={-25} len={20} />
    <path d="M60 210V70" stroke={ink} strokeWidth="1.5" strokeDasharray="5 5" opacity="0.5" fill="none" />
    <path d="M60 70H250" stroke={ink} strokeWidth="1.5" strokeDasharray="5 5" opacity="0.5" fill="none" />
    <VArrow x={60} y1={210} y2={72} c={amber} />
    <g fontSize="14" fontWeight="700" fill={amberInk}><text x={72} y={122}>activation</text><text x={72} y={139}>energy</text></g>
    <g fontSize="13" fill={muted}><text x={40} y={232}>reactants</text><text x={440} y={258} textAnchor="middle">products</text></g>
    <text x={270} y={292} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>activation energy = minimum energy to react</text>
  </Diagram>
}
function Frequency() {
  const box = (x: number, loose: [number, number, Kind, number][], hits: [number, number, number][]) => <g transform={`translate(${x} 44)`}>
    <Box x={0} y={0} w={236} h={200} />
    {loose.map(([px, py, k, a], i) => <Moving key={i} x={px} y={py} kind={k} angle={a} len={14} />)}
    {hits.map(([bx, by, a], i) => <Collision key={i} x={bx} y={by} angle={a} strong={false} />)}
  </g>
  return <Diagram title="Two boxes, each with eight reacting particles. The left box has one collision. The right box has two collisions at the same moment, so twice as many collisions per second and a reaction twice as fast.">
    {box(20, [[40, 116, 'a', 30], [196, 100, 'b', 200], [66, 172, 'b', -60], [172, 176, 'a', 150], [120, 124, 'a', 90], [200, 150, 'b', 250]], [[118, 54, 0]])}
    {box(284, [[196, 60, 'b', 200], [40, 150, 'a', -30], [112, 178, 'b', 60], [128, 104, 'a', 160]], [[70, 60, 20], [168, 146, -30]])}
    <g fontSize="14" fontWeight="700" fill={ink} textAnchor="middle">
      <text x={138} y={30}>fewer collisions per second</text><text x={402} y={30}>more collisions per second</text>
    </g>
    <text x={402} y={266} textAnchor="middle" fontSize="15" fontWeight="700" fill={protonLine}>faster reaction</text>
    <text x={270} y={292} textAnchor="middle" fontSize="14" fontWeight="700" fill={amberInk}>2 × collisions = 2 × rate</text>
  </Diagram>
}

// ---------- On your own ----------
function QThree() {
  const lines: Line[] = [
    { n: 1, H, tau: 70, colour: ink, badgeT: 18 },
    { n: 2, H, tau: 150, colour: ink, badgeT: 60 },
    { n: 3, H, tau: 260, colour: ink, badgeT: 120 },
  ]
  return <Diagram title="A graph of amount of product formed against time with three numbered lines, 1, 2 and 3. They start at different steepness and all go flat at the same height.">
    <GraphAxes />{lines.map((l) => <GraphLine key={String(l.n)} line={l} />)}
  </Diagram>
}
function QFour() {
  const lines: Line[] = [
    { n: 1, H, tau: 150, colour: ink, badgeT: 80 },
    { n: 2, H: 80, tau: 110, colour: ink, badgeT: 220 },
    { n: 3, H, tau: 260, colour: ink, badgeT: 120 },
    { n: 4, H: 196, tau: 150, colour: ink, badgeT: 40 },
  ]
  return <Diagram title="A graph of amount of product formed against time with four numbered lines, 1 to 4, which go flat at different heights.">
    <GraphAxes />{lines.map((l) => <GraphLine key={String(l.n)} line={l} />)}
  </Diagram>
}

export function RatesVisual({ focus }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'rates-meaning': return <Meaning />
    case 'rates-curve': return <Single stage="curve" />
    case 'rates-steep': return <Single stage="steep" />
    case 'rates-flat': return <Single stage="flat" />
    case 'rates-lines-original': return <Lines stage="original" />
    case 'rates-lines-faster': return <Lines stage="faster" />
    case 'rates-lines-slower': return <Lines stage="slower" />
    case 'rates-lines-same': return <Lines stage="same" />
    case 'rates-lines-more': return <Lines stage="more" />
    case 'rates-collide': return <Collide />
    case 'rates-energy': return <Energy />
    case 'rates-activation': return <Activation />
    case 'rates-frequency': return <Frequency />
    case 'rates-q-three': return <QThree />
    case 'rates-q-four': return <QFour />
    default: return <Meaning />
  }
}
