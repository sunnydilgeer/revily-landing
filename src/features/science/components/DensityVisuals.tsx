import type { ReactNode } from 'react'
import { physicsPalette, PhysicsDiagram, Lines, Leader, type Pt } from './PhysicsKit'
import { Arrow, Particle, StateBox, Container, Magnifier, Chip, TickMark, blob, r1, faded, particleLine, type Box } from './GasParticleVisuals'

/*
 * Physics Lesson 28: Density (with the density required practical). Original, code-native schematics; not to scale.
 * Every focus id here starts with 'density-' and is routed from CellBiologyVisuals.tsx.
 *
 * Colour code: mass brown, volume blue, density ink; particles as in the particle-model lesson; water blue.
 * The steel block and the equation card are reused through the worked example; the cuboid, the eureka can and the
 * measuring cylinder are each reused through their own walkthrough. The worked-example card (WorkCard) is exported
 * for the latent heat lesson so both calculation walkthroughs look the same.
 */
const P = physicsPalette
const { ink, muted } = P
export const massColour = P.resistance, volumeColour = P.waterLine
const glass = '#f3f8fb', glassLine = '#7f9db2'
const lead = '#c9d0da', leadLine = '#5f6c7d', wood = '#ecd2a6', woodLine = '#a57a43'
const steel = '#d7dee6', steelLine = '#667789'

/* ---------- Shared equipment ---------- */

/** A digital balance: platform on top at y, centred at x, with a display reading. */
export function Balance({ x, y, reading, w = 120, dim = false }: { x: number; y: number; reading: string; w?: number; dim?: boolean }) {
  return <g opacity={dim ? faded : 1}>
    <rect x={x - w / 2 + 10} y={y} width={w - 20} height={7} rx="3.5" fill="#dfe5ea" stroke="#7f95a6" strokeWidth="1.8" />
    <path d={`M${x - w / 2} ${y + 44}L${x - w / 2 + 8} ${y + 9}H${x + w / 2 - 8}L${x + w / 2} ${y + 44}Z`} fill="#eef2f5" stroke="#7f95a6" strokeWidth="2" />
    <rect x={x - 32} y={y + 18} width={64} height={20} rx="5" fill="#26394a" />
    <text x={x} y={y + 33} textAnchor="middle" fontSize="13" fontWeight="700" fill="#bff0c9" fontFamily="ui-monospace, monospace">{reading}</text>
  </g>
}
/** A measuring cylinder standing on its foot at y (bottom), centred at x. `level` 0–1 of the tube is filled. */
export function Cylinder({ x, y, h = 150, w = 40, level = 0, liquid = P.water, liquidLine = P.waterLine, marks = 5, eye = false }: { x: number; y: number; h?: number; w?: number; level?: number; liquid?: string; liquidLine?: string; marks?: number; eye?: boolean }) {
  const top = y - h, inner = h - 18, surf = y - 12 - inner * level
  return <g>
    <path d={`M${x - w / 2 - 12} ${y}H${x + w / 2 + 12}`} stroke={glassLine} strokeWidth="5" />
    {level > 0 && <path d={`M${x - w / 2 + 2} ${r1(surf)}Q${x} ${r1(surf + 6)} ${x + w / 2 - 2} ${r1(surf)}V${y - 8}H${x - w / 2 + 2}Z`} fill={liquid} stroke="none" />}
    {level > 0 && <path d={`M${x - w / 2 + 2} ${r1(surf)}Q${x} ${r1(surf + 6)} ${x + w / 2 - 2} ${r1(surf)}`} stroke={liquidLine} strokeWidth="1.8" fill="none" />}
    <path d={`M${x - w / 2} ${top + 4}V${y - 6}Q${x - w / 2} ${y - 3} ${x - w / 2 + 4} ${y - 3}H${x + w / 2 - 4}Q${x + w / 2} ${y - 3} ${x + w / 2} ${y - 6}V${top + 4}`} fill="none" stroke={glassLine} strokeWidth="2.2" />
    <path d={`M${x - w / 2 - 4} ${top}Q${x - w / 2} ${top + 1} ${x - w / 2} ${top + 5}M${x + w / 2} ${top + 5}Q${x + w / 2} ${top} ${x + w / 2 + 6} ${top - 3}`} fill="none" stroke={glassLine} strokeWidth="2.2" />
    {Array.from({ length: marks * 2 }, (_, i) => { const yy = r1(y - 12 - inner * (i + 1) / (marks * 2)); return <path key={i} d={`M${x - w / 2} ${yy}h${i % 2 ? 12 : 7}`} stroke={glassLine} strokeWidth="1.3" /> })}
    <path d={`M${x + w / 2 - 8} ${top + 16}V${y - 22}`} stroke="white" strokeWidth="3" opacity=".8" />
    {eye && <g />}
  </g>
}
/** A eureka can: a can with a spout sloping down from near its top. (x, y) = bottom centre. `level` 0–1 of water. */
function EurekaCan({ x, y, w = 110, h = 130, level = .82, spilling = false }: { x: number; y: number; w?: number; h?: number; level?: number; spilling?: boolean }) {
  const left = x - w / 2, right = x + w / 2, top = y - h, spoutY = top + h * (1 - level) + 2
  return <g>
    <path d={`M${left + 2} ${r1(y - h * level)}H${right - 2}V${y - 8}Q${right - 2} ${y - 2} ${right - 8} ${y - 2}H${left + 8}Q${left + 2} ${y - 2} ${left + 2} ${y - 8}Z`} fill={P.water} />
    <path d={`M${left + 2} ${r1(y - h * level)}H${right - 2}`} stroke={P.waterLine} strokeWidth="1.8" />
    {/* spout */}
    <path d={`M${right} ${r1(spoutY - 7)}L${right + 42} ${r1(spoutY + 16)}M${right} ${r1(spoutY + 7)}L${right + 40} ${r1(spoutY + 26)}`} stroke={glassLine} strokeWidth="2.4" />
    {spilling && <path d={`M${right} ${r1(spoutY)}L${right + 40} ${r1(spoutY + 20)}`} stroke={P.water} strokeWidth="7" />}
    <path d={`M${left} ${top}V${y - 10}Q${left} ${y} ${left + 10} ${y}H${right - 10}Q${right} ${y} ${right} ${y - 10}V${top}`} fill="none" stroke={glassLine} strokeWidth="2.6" />
    <ellipse cx={x} cy={top} rx={w / 2} ry="5" fill="none" stroke={glassLine} strokeWidth="2" />
    <path d={`M${right - 14} ${top + 18}V${y - 16}`} stroke="white" strokeWidth="4" opacity=".7" />
  </g>
}
/** A small irregular stone. */
function Stone({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={blob(0, 0, 17, 12, 44, .22, 9)} fill="#c9c1b3" stroke="#7d7466" strokeWidth="2" />
    <path d="M-7 -4q4 -3 8 -1M3 5q4 -1 6 -4" stroke="#9d9384" strokeWidth="1.5" fill="none" />
  </g>
}
/** A cuboid drawn in simple perspective; (x, y) = front bottom-left corner. */
function Cuboid({ x, y, w, h, d = 28, fill, line, grain = false }: { x: number; y: number; w: number; h: number; d?: number; fill: string; line: string; grain?: boolean }) {
  const dx = d * .8, dy = d * .55
  return <g strokeLinejoin="round">
    <path d={`M${x} ${y - h}L${x + dx} ${y - h - dy}H${x + w + dx}L${x + w} ${y - h}Z`} fill="white" opacity=".55" />
    <path d={`M${x} ${y - h}L${x + dx} ${y - h - dy}H${x + w + dx}L${x + w} ${y - h}Z`} fill={fill} fillOpacity=".75" stroke={line} strokeWidth="2" />
    <path d={`M${x + w} ${y}V${y - h}L${x + w + dx} ${y - h - dy}V${y - dy}Z`} fill={fill} stroke={line} strokeWidth="2" />
    <path d={`M${x + w} ${y}V${y - h}L${x + w + dx} ${y - h - dy}V${y - dy}Z`} fill="black" opacity=".08" />
    <rect x={x} y={y - h} width={w} height={h} fill={fill} stroke={line} strokeWidth="2" />
    {grain && <path d={`M${x + 6} ${y - h * .3}q${w * .3} -8 ${w * .6} 0t${w * .35} -2M${x + 8} ${y - h * .65}q${w * .25} 6 ${w * .55} 0t${w * .4} 3`} stroke={line} strokeWidth="1.4" fill="none" opacity=".7" />}
  </g>
}

/* ---------- The worked-example card (also used by the latent heat lesson) ---------- */

export type CardLine = { text: ReactNode; note?: string }
/** A card of calculation lines; lines up to `step` are shown, the current one highlighted, later ones hidden. */
export function WorkCard({ x, y, w, lines, step, done = false }: { x: number; y: number; w: number; lines: CardLine[]; step: number; done?: boolean }) {
  const rowH = 46
  const note = lines[step]?.note
  return <g>
    {note && <text x={x + 12} y={y - 10} fontSize="13" fontWeight="700" fill={muted}>{`Step ${step + 1}: ${note}`}</text>}
    <rect x={x} y={y} width={w} height={lines.length * rowH + 20} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.6" />
    {lines.map((l, i) => {
      if (i > step) return null
      const cy = y + 14 + i * rowH, on = i === step
      return <g key={i}>
        {on && <rect x={x + 8} y={cy - 2} width={w - 16} height={rowH - 4} rx="12" fill="white" stroke={done && on ? P.useful : ink} strokeWidth={on ? 2 : 0} />}
        <circle cx={x + 30} cy={cy + 20} r="11" fill={on ? ink : 'white'} stroke={ink} strokeWidth="1.8" opacity={on ? 1 : .55} />
        <text x={x + 30} y={cy + 25} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={on ? 'white' : ink} opacity={on ? 1 : .55}>{i + 1}</text>
        <text x={x + 52} y={cy + 26} fontSize="16" fontWeight={on ? 750 : 600} fill={ink} opacity={on ? 1 : .6}>{l.text}</text>
      </g>
    })}
  </g>
}
const M = ({ children }: { children: ReactNode }) => <tspan fill={massColour}>{children}</tspan>
const V = ({ children }: { children: ReactNode }) => <tspan fill={volumeColour}>{children}</tspan>

/* ---------- Section 2: what density is ---------- */

// Lead and wood blocks of the same size on a beam balance; close-ups show packed and loose particles.
function Idea() {
  const tilt = 9 * Math.PI / 180, cx = 270, arm = 150, pivotY = 176
  // left pan (lead) lower, right pan (wood) higher
  const L: Pt = [r1(cx - arm * Math.cos(tilt)), r1(pivotY + arm * Math.sin(tilt))], R: Pt = [r1(cx + arm * Math.cos(tilt)), r1(pivotY - arm * Math.sin(tilt))]
  const pan = ([px, py]: Pt) => <g><path d={`M${px} ${py}V${py + 20}`} stroke={muted} strokeWidth="1.6" /><path d={`M${px - 44} ${py + 20}H${px + 44}Q${px + 40} ${py + 30} ${px} ${py + 30}Q${px - 40} ${py + 30} ${px - 44} ${py + 20}Z`} fill="#eef2f5" stroke="#7f95a6" strokeWidth="2" /></g>
  return <PhysicsDiagram title="A block of lead and a block of wood of the same size on a balance. The lead side goes down: it has more mass. Close-ups show the lead's particles packed tightly and the wood's more loosely.">
    <path d={`M${cx} ${pivotY}L${cx - 22} 266H${cx + 22}Z`} fill="#eef2f5" stroke="#7f95a6" strokeWidth="2" />
    <path d={`M${cx - 50} 266H${cx + 50}`} stroke="#7f95a6" strokeWidth="4" />
    <path d={`M${L[0]} ${L[1]}L${R[0]} ${R[1]}`} stroke={ink} strokeWidth="5" />
    <circle cx={cx} cy={pivotY} r="5" fill="white" stroke={ink} strokeWidth="2" />
    {pan(L)}{pan(R)}
    <Cuboid x={L[0] - 26} y={L[1] + 20} w={46} h={40} d={18} fill={lead} line={leadLine} />
    <Cuboid x={R[0] - 26} y={R[1] + 20} w={46} h={40} d={18} fill={wood} line={woodLine} grain />
    <Magnifier cx={70} cy={96} r={46} from={[L[0] - 4, L[1] - 2]}>
      <rect x={20} y={46} width={100} height={100} fill="#eef1f5" />
      {Array.from({ length: 25 }, (_, i) => <Particle key={i} x={34 + (i % 5) * 18} y={60 + Math.floor(i / 5) * 18} r={8.5} fill={lead} line={leadLine} />)}
    </Magnifier>
    <Magnifier cx={482} cy={72} r={46} from={[R[0], R[1] - 2]}>
      <rect x={432} y={22} width={100} height={100} fill="#fbf5ea" />
      {[[462, 48], [502, 54], [476, 84], [512, 96], [454, 104], [490, 114], [470, 32]].map(([px, py], i) => <Particle key={i} x={px} y={py} r={8.5} fill={wood} line={woodLine} />)}
    </Magnifier>
    <Lines x={70} y={170} anchor="middle" lines={['lead']} size={15} />
    <Lines x={494} y={152} anchor="middle" lines={['wood']} size={15} />
    <Lines x={270} y={36} anchor="middle" lines={['same size,', 'different mass']} size={15} />
    <Lines x={L[0]} y={L[1] + 58} anchor="middle" lines={['more mass: denser']} size={13} weight={650} colour={massColour} />
  </PhysicsDiagram>
}
function Packing() {
  const a: Box = { x: 60, y: 60, w: 170, h: 150 }, b: Box = { x: 310, y: 60, w: 170, h: 150 }
  const tight: Pt[] = Array.from({ length: 48 }, (_, i) => [r1(a.x + 17 + (i % 8) * 19.4 + (Math.floor(i / 8) % 2 ? 0 : 0)), r1(a.y + 19 + Math.floor(i / 8) * 21.6)])
  const loose: Pt[] = [[340, 86], [396, 80], [450, 96], [356, 140], [414, 128], [462, 160], [338, 190], [398, 186], [436, 124]]
  return <PhysicsDiagram title="Two boxes of the same size. In one the particles are packed tightly: it is denser. In the other they are packed loosely: it is less dense.">
    <Container box={a} /><Container box={b} />
    {tight.map(([x, y], i) => <Particle key={i} x={x} y={y} r={9} />)}
    {loose.map(([x, y], i) => <Particle key={i} x={x} y={y} r={9} />)}
    <Lines x={a.x + a.w / 2} y={40} anchor="middle" lines={['denser']} size={16} />
    <Lines x={b.x + b.w / 2} y={40} anchor="middle" lines={['less dense']} size={16} />
    <Lines x={a.x + a.w / 2} y={240} anchor="middle" lines={['tightly packed']} size={13} weight={650} colour={muted} />
    <Lines x={b.x + b.w / 2} y={240} anchor="middle" lines={['loosely packed']} size={13} weight={650} colour={muted} />
    <Lines x={270} y={282} anchor="middle" lines={['same volume, different number of particles']} size={13} weight={600} colour={muted} />
  </PhysicsDiagram>
}
function States() {
  const boxes: [Box, 'solid' | 'liquid' | 'gas'][] = [[{ x: 22, y: 92, w: 150, h: 120 }, 'solid'], [{ x: 195, y: 92, w: 150, h: 120 }, 'liquid'], [{ x: 368, y: 92, w: 150, h: 120 }, 'gas']]
  return <PhysicsDiagram title="Particles in a solid, a liquid and a gas. They are packed less and less tightly, so the solid is generally the densest and the gas the least dense.">
    <Arrow from={[40, 44]} to={[500, 44]} colour={particleLine} width={3} />
    <Lines x={270} y={32} anchor="middle" lines={['less and less dense']} size={14} colour={particleLine} />
    {boxes.map(([b, s]) => <g key={s}>
      <StateBox box={b} state={s} r={9} cols={6} rows={5} n={s === 'liquid' ? 22 : 5} seed={s === 'gas' ? 11 : 4} arrows={false} />
      <Chip x={b.x + b.w / 2} y={244} text={s} />
    </g>)}
  </PhysicsDiagram>
}
function Equation() {
  return <PhysicsDiagram schematic={false} title="The density equation: density equals mass divided by volume, rho equals m over V. Mass in kilograms, volume in cubic metres, density in kilograms per cubic metre.">
    <rect x={70} y={26} width={400} height={128} rx="20" fill={P.usefulFill} stroke={P.useful} strokeWidth="2" />
    <text x={270} y={70} textAnchor="middle" fontSize="21" fontWeight="750" fill={ink}>density = <M>mass</M> ÷ <V>volume</V></text>
    <text x={270} y={118} textAnchor="middle" fontSize="26" fontWeight="750" fill={ink}>ρ = <M>m</M> / <V>V</V></text>
    <text x={270} y={142} textAnchor="middle" fontSize="12.5" fontWeight="650" fill={muted}>ρ is the Greek letter rho</text>
    {[['density', 'kg/m³', ink, 110], ['mass', 'kg', massColour, 270], ['volume', 'm³', volumeColour, 430]].map(([name, unit, colour, x]) => <g key={name as string}>
      <rect x={(x as number) - 66} y={184} width={132} height={70} rx="16" fill="white" stroke={colour as string} strokeWidth="2" />
      <text x={x as number} y={212} textAnchor="middle" fontSize="14" fontWeight="650" fill={colour as string}>{name}</text>
      <text x={x as number} y={240} textAnchor="middle" fontSize="20" fontWeight="750" fill={colour as string}>{unit}</text>
    </g>)}
    <text x={270} y={286} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>units</text>
  </PhysicsDiagram>
}

/* ---------- Section 3: worked example (steel block) ---------- */

const STEEL_LINES: CardLine[] = [
  { text: <>density = <M>mass</M> ÷ <V>volume</V></>, note: 'word equation' },
  { text: <>density = <M>39</M> ÷ <V>0.0050</V></>, note: 'substitute' },
  { text: <>= 7800</>, note: 'calculate' },
  { text: <>density = 7800 kg/m³</>, note: 'add the unit' },
]
function Worked({ step }: { step: number }) {
  const titles = ['A steel block has a volume of 0.0050 cubic metres and a mass of 39 kilograms. Step 1: write density = mass ÷ volume.', 'Step 2: substitute. Density = 39 ÷ 0.0050.', 'Step 3: calculate. 39 ÷ 0.0050 = 7800.', 'Step 4: add the unit. Kilograms and cubic metres give kilograms per cubic metre: 7800 kg/m³.']
  return <PhysicsDiagram schematic={false} title={titles[step]}>
    <Cuboid x={30} y={176} w={92} h={62} d={34} fill={steel} line={steelLine} />
    <Lines x={76} y={70} anchor="middle" lines={['steel']} size={15} />
    <Lines x={76} y={206} anchor="middle" lines={['V = 0.0050 m³']} size={14} colour={volumeColour} />
    <Lines x={76} y={228} anchor="middle" lines={['m = 39 kg']} size={14} colour={massColour} />
    <WorkCard x={176} y={46} w={352} lines={STEEL_LINES} step={step} done={step === 3} />
    {step === 3 && <g><TickMark x={498} y={218} /><Lines x={352} y={270} anchor="middle" lines={['kg and m³ give kg/m³']} size={13} weight={650} colour={muted} /></g>}
  </PhysicsDiagram>
}

/* ---------- Section 4: measuring a solid ---------- */

function Regular({ calc = false }: { calc?: boolean }) {
  const bx = 96, by = 190
  return <PhysicsDiagram title={calc ? 'The cuboid: its volume is length × width × height. Then density = mass ÷ volume.' : 'A cuboid on a balance, which measures its mass. A ruler measures its length, width and height.'}>
    <Balance x={140} y={by} reading="54.0 g" w={150} />
    <Cuboid x={bx} y={by} w={78} h={48} d={40} fill="#d7e4d0" line="#5f8a55" />
    {/* ruler along the front edge */}
    <g transform={`translate(${bx - 6} ${by - 8})`}>
      <rect x={0} y={-14} width={112} height={14} rx="3" fill="#fbeec4" stroke="#b98a17" strokeWidth="1.6" />
      {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${4 + i * 10.4} -14v${i % 5 ? 4 : 7}`} stroke="#8a6410" strokeWidth="1.2" />)}
    </g>
    {/* dimension marks */}
    <g stroke={volumeColour} strokeWidth="1.8" fill="none">
      <path d={`M${bx} ${by + 58}H${bx + 78}M${bx} ${by + 52}v12M${bx + 78} ${by + 52}v12`} />
      <path d={`M${bx - 16} ${by}V${by - 48}M${bx - 22} ${by}h12M${bx - 22} ${by - 48}h12`} />
      <path d={`M${bx + 84} ${by - 54}L${bx + 112} ${by - 76}`} />
    </g>
    <text x={bx + 39} y={by + 78} textAnchor="middle" fontSize="13" fontWeight="700" fill={volumeColour}>length</text>
    <text x={bx - 24} y={by - 20} textAnchor="end" fontSize="13" fontWeight="700" fill={volumeColour}>height</text>
    <text x={bx + 118} y={by - 76} fontSize="13" fontWeight="700" fill={volumeColour}>width</text>
    {!calc && <g>
      <Lines x={300} y={96} lines={['ruler: length, width', 'and height']} size={14} colour={volumeColour} />
      <Leader from={[296, 92]} to={[bx + 70, by - 12]} colour={volumeColour} />
      <Lines x={300} y={206} lines={['balance: mass']} size={14} colour={massColour} />
      <Leader from={[296, 202]} to={[176, by + 24]} colour={massColour} />
    </g>}
    {calc && <g>
      <rect x={290} y={50} width={232} height={64} rx="16" fill="white" stroke={volumeColour} strokeWidth="2" />
      <text x={406} y={78} textAnchor="middle" fontSize="15" fontWeight="750" fill={volumeColour}>volume =</text>
      <text x={406} y={100} textAnchor="middle" fontSize="15" fontWeight="750" fill={volumeColour}>length × width × height</text>
      <Arrow from={[406, 122]} to={[406, 150]} colour={muted} width={2.2} />
      <rect x={290} y={158} width={232} height={50} rx="16" fill={P.usefulFill} stroke={P.useful} strokeWidth="2" />
      <text x={406} y={189} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>density = <M>mass</M> ÷ <V>volume</V></text>
    </g>}
  </PhysicsDiagram>
}
function Eureka({ displace = false, question = false }: { displace?: boolean; question?: boolean }) {
  const cx = 150, cy = 236, cylX = 228
  const title = question ? 'A stone of mass 30 g lowered into a full eureka can. The water pushed out through the spout is collected in a measuring cylinder, which reads 12 cm³.'
    : displace ? 'The stone is lowered into the full eureka can. It pushes water out through the spout into the measuring cylinder. The volume of water collected equals the volume of the stone.'
      : 'A eureka can, a can with a spout in its side, filled with water up to the spout. A measuring cylinder stands under the spout and a stone hangs on a thread above the can.'
  return <PhysicsDiagram title={title}>
    {/* thread and stone */}
    <path d={`M${cx - 6} 20V${displace || question ? 164 : 50}`} stroke={muted} strokeWidth="1.6" />
    <EurekaCan x={cx} y={cy} level={.8} spilling={displace || question} />
    <Stone x={cx - 6} y={displace || question ? 178 : 64} />
    {(displace || question) && <path d={`M${cx + 96} ${cy - 84}q4 8 4 14`} stroke={P.waterLine} strokeWidth="3" fill="none" strokeDasharray="1 7" />}
    <Cylinder x={cylX + 24} y={cy + 2} h={80} w={36} level={displace || question ? .42 : 0} marks={3} />
    {!question && <g>
      <Lines x={cx - 16} y={cy + 30} anchor="middle" lines={['eureka can']} size={14} />
      <Lines x={236} y={96} lines={['spout']} size={14} />
      <Leader from={[248, 102]} to={[cx + 72, cy - 88]} />
      <Lines x={cylX + 44} y={cy + 30} anchor="middle" lines={['measuring cylinder']} size={14} />
    </g>}
    {!displace && !question && <g>
      <Balance x={450} y={130} reading="30.0 g" w={120} />
      <Stone x={450} y={120} s={.9} />
      <Lines x={450} y={100} anchor="middle" lines={['mass first']} size={14} colour={massColour} />
      <Lines x={cx + 20} y={40} lines={['stone on a thread']} size={13} weight={650} colour={muted} />
    </g>}
    {displace && <g>
      <Lines x={340} y={70} lines={['water pushed out', 'through the spout']} size={14} colour={P.waterLine} />
      <Leader from={[336, 80]} to={[cx + 92, cy - 90]} colour={P.waterLine} />
      <rect x={340} y={150} width={186} height={66} rx="14" fill={P.coldFill} stroke={volumeColour} strokeWidth="1.8" />
      <Lines x={433} y={175} anchor="middle" lines={['volume of water', 'collected = volume', 'of the stone']} size={13} colour={volumeColour} />
    </g>}
    {question && <g>
      <Balance x={450} y={150} reading="30.0 g" w={120} />
      <Stone x={450} y={140} s={.9} />
      <Lines x={450} y={120} anchor="middle" lines={['the stone']} size={13} weight={650} colour={muted} />
      <Lines x={cylX + 56} y={cy - 22} lines={['12 cm³']} size={15} colour={volumeColour} />
      <Leader from={[cylX + 54, cy - 27]} to={[cylX + 36, cy - 30]} colour={volumeColour} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 5: measuring a liquid ---------- */

function Liquid({ calc = false }: { calc?: boolean }) {
  const oil = '#fbe7b0', oilLine = '#c3930f'
  const bx = 150, by = 200
  return <PhysicsDiagram title={calc ? 'The balance now reads 40 g and the measuring cylinder shows 50 cubic centimetres. Density = 40 ÷ 50 = 0.8 g/cm³.' : 'An empty measuring cylinder stands on a balance, which has been zeroed so it reads 0.0 g. Then the liquid is poured in.'}>
    <Balance x={bx} y={by} reading={calc ? '40.0 g' : '0.0 g'} w={150} />
    <Cylinder x={bx} y={by} h={150} w={44} level={calc ? .62 : 0} liquid={oil} liquidLine={oilLine} marks={5} />
    {!calc && <g>
      {/* beaker pouring */}
      <g transform={`translate(${bx + 64} 40) rotate(-38)`}>
        <path d="M0 0V44Q0 50 6 50H40Q46 50 46 44V0" fill="white" stroke={P.waterLine} strokeWidth="2" />
        <path d="M2 18H44V44Q44 48 40 48H6Q2 48 2 44Z" fill={oil} />
        <path d="M-4 -2L2 0" stroke={P.waterLine} strokeWidth="2" />
      </g>
      <path d={`M${bx + 56} 58Q${bx + 18} 64 ${bx + 6} 96V120`} stroke={oilLine} strokeWidth="4" fill="none" opacity=".75" />
      <Lines x={300} y={236} lines={['zero the balance first,', 'with the empty cylinder on it']} size={14} colour={massColour} />
      <Leader from={[296, 232]} to={[bx + 30, by + 28]} colour={massColour} />
      <Lines x={300} y={120} lines={['then pour in', '50 cm³ of liquid']} size={14} colour={volumeColour} />
    </g>}
    {calc && <g>
      <Lines x={bx - 88} y={100} anchor="end" lines={['50 cm³']} size={15} colour={volumeColour} />
      <Leader from={[bx - 86, 96]} to={[bx - 24, by - 12 - 132 * .62]} colour={volumeColour} />
      <Lines x={bx - 94} y={by + 36} anchor="end" lines={['40 g']} size={15} colour={massColour} />
      <Leader from={[bx - 92, by + 32]} to={[bx - 34, by + 28]} colour={massColour} />
      <WorkCard x={262} y={64} w={264} lines={[{ text: <>density = <M>40</M> ÷ <V>50</V></> }, { text: <>= 0.8 g/cm³</> }]} step={1} done />
      <Lines x={394} y={196} anchor="middle" lines={['g and cm³ give g/cm³']} size={13} weight={650} colour={muted} />
    </g>}
  </PhysicsDiagram>
}
function Care() {
  const cx = 150, by = 236, level = .55, surf = by - 12 - (150 - 18) * level
  return <PhysicsDiagram title="Taking care: read the measuring cylinder with your eye level with the liquid surface, repeat and take a mean, and wipe up spills.">
    <Cylinder x={cx} y={by} h={150} w={44} level={level} marks={5} />
    {/* eye */}
    <g transform={`translate(40 ${r1(surf + 3)})`}>
      <path d="M-18 0Q0 -14 18 0Q0 14 -18 0Z" fill="white" stroke={ink} strokeWidth="2" />
      <circle r="5.5" fill={ink} />
    </g>
    <path d={`M60 ${r1(surf + 3)}H${cx + 60}`} stroke={ink} strokeWidth="1.8" strokeDasharray="6 5" />
    <Lines x={cx + 66} y={r1(surf + 8)} lines={['eye level with the', 'bottom of the curved surface']} size={13} />
    {/* repeat tag */}
    <g transform="translate(300 40)">
      <rect x={0} y={0} width={220} height={66} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.6" />
      <text x={16} y={27} fontSize="14" fontWeight="750" fill={ink}>repeat and take a mean</text>
      <text x={16} y={50} fontSize="13" fontWeight="600" fill={muted}>0.81, 0.79, 0.80 → 0.80</text>
    </g>
    {/* spill and cloth */}
    <path d={blob(410, 262, 46, 9, 12, .2)} fill={P.water} stroke={P.waterLine} strokeWidth="1.8" />
    <path d="M436 238C448 226 474 226 486 236C492 246 480 256 464 258C448 260 430 250 436 238Z" fill="#fde2e2" stroke={P.wasted} strokeWidth="1.8" />
    <path d="M444 242q10 -6 22 -2M446 250q12 -4 26 0" stroke={P.wasted} strokeWidth="1.3" fill="none" />
    <Lines x={300} y={206} lines={['wipe up spills:', 'they are slippery']} size={14} />
  </PhysicsDiagram>
}

export function DensityVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'density-idea': return <Idea />
    case 'density-packing': return <Packing />
    case 'density-states': return <States />
    case 'density-equation': return <Equation />
    case 'density-w1': return <Worked step={0} />
    case 'density-w2': return <Worked step={1} />
    case 'density-w3': return <Worked step={2} />
    case 'density-w4': return <Worked step={3} />
    case 'density-regular': return <Regular />
    case 'density-regular-calc': return <Regular calc />
    case 'density-eureka': return <Eureka />
    case 'density-displace': return <Eureka displace />
    case 'density-q-eureka': return <Eureka question />
    case 'density-liquid': return <Liquid />
    case 'density-liquid-calc': return <Liquid calc />
    case 'density-care': return <Care />
    default: return null
  }
}
