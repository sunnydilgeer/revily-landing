import type { ReactNode } from 'react'
import { physicsPalette, PhysicsDiagram, Lines, TransferArrow, GraphAxes, graphScale, type Pt, type GraphFrame } from './PhysicsKit'
import { Arrow, Particle, Container, Thermometer, Heater, IceCube, Puddle, Chip, liquidPts, gasPts, r1, faded, type Box } from './GasParticleVisuals'
import { WorkCard, massColour, type CardLine } from './DensityVisuals'
import { StateMap } from './InternalEnergyVisuals'

/*
 * Physics Lesson 30: Specific latent heat. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'latent-' and is routed from CellBiologyVisuals.tsx.
 *
 * Particles, state boxes and the state map come from the particle-model and internal energy lessons.
 * Heating graphs are drawn in the warm (hot red) colour and cooling graphs in the cool (cold blue) colour; the flat
 * parts (changes of state) get a thicker line on a soft band. Graph axes are "Time" and "Temperature" with no values.
 * Worked example: the same card as the density lesson; mass brown, specific latent heat violet, energy red.
 */
const P = physicsPalette
const { ink, muted } = P
const warm = P.hot, cool = P.cold, bondColour = '#8aa0b1'
const lColour = P.pd, eColour = P.thermalLine

/* ---------- Section 2: what latent heat is ---------- */

function Steam({ x, y }: { x: number; y: number }) {
  return <g stroke="#b9c3cc" strokeWidth="2.4" fill="none" opacity=".9">
    <path d={`M${x} ${y}c-8 -10 8 -16 0 -26s8 -16 0 -26`} />
    <path d={`M${x + 26} ${y + 4}c-8 -10 8 -16 0 -26s8 -16 0 -26`} />
    <path d={`M${x + 52} ${y}c-8 -10 8 -16 0 -26s8 -16 0 -26`} />
  </g>
}
function Boiling() {
  return <PhysicsDiagram title="A pan of boiling water on a heater. Energy keeps going in, but the thermometer stays at 100 °C while the water turns to steam.">
    <Steam x={140} y={116} />
    {/* pan */}
    <path d="M86 132H262V196Q262 212 246 212H102Q86 212 86 196Z" fill="#eef2f5" stroke="#7f95a6" strokeWidth="2.6" />
    <path d="M262 142H300" stroke="#7f95a6" strokeWidth="6" />
    <path d="M89 146H259V196Q259 209 246 209H102Q89 209 89 196Z" fill={P.water} />
    <path d="M89 146q14 -5 28 0t28 0t28 0t28 0t28 0t28 0" stroke={P.waterLine} strokeWidth="1.8" fill="none" />
    {[[120, 186, 5], [160, 170, 4], [196, 190, 6], [226, 172, 4], [140, 196, 3]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="white" stroke={P.waterLine} strokeWidth="1.4" />)}
    <Heater x={174} y={216} w={170} />
    <TransferArrow from={[24, 262]} to={[86, 232]} bend={-0.2} colour={warm} width={4} />
    <Lines x={16} y={288} lines={['energy in']} size={14} colour={warm} />
    {/* thermometer dipped in */}
    <g transform="rotate(12 214 186)"><Thermometer x={214} y={186} height={150} level={.8} /></g>
    <Lines x={260} y={62} lines={['100 °C']} size={18} colour={warm} />
    <path d="M258 56L238 66" stroke={warm} strokeWidth="1.5" />
    <Lines x={344} y={130} lines={['energy in,', 'temperature', 'stays the same']} size={16} />
    <Lines x={344} y={200} lines={['the water is turning', 'to steam']} size={13} weight={600} colour={muted} />
  </PhysicsDiagram>
}

/** Particles with short bond lines joining close neighbours. */
function Bonded({ pts, r = 9, reach = 2.7 }: { pts: Pt[]; r?: number; reach?: number }) {
  const bonds: ReactNode[] = []
  pts.forEach((a, i) => pts.forEach((b, j) => { if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1]) < reach * r) bonds.push(<path key={`${i}-${j}`} d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`} stroke={bondColour} strokeWidth="3.4" />) }))
  return <g>{bonds}{pts.map(([x, y], i) => <Particle key={i} x={x} y={y} r={r * .74} />)}</g>
}
const LB: Box = { x: 30, y: 70, w: 170, h: 140 }, RB: Box = { x: 340, y: 70, w: 170, h: 140 }
function Bonds() {
  const lp = liquidPts(LB, 9, 22, 31)
  const gp = gasPts(RB, 9, 9, 5, 2.9)
  return <PhysicsDiagram title="Left: particles in a liquid held by bonds. Right: after energy is transferred, bonds are broken and the particles move apart. The temperature does not change.">
    <Container box={LB} open /><Bonded pts={lp} />
    <Container box={RB} /><Bonded pts={gp} reach={2.5} />
    <TransferArrow from={[214, 140]} to={[326, 140]} bend={-0.25} colour={warm} width={4} />
    <Lines x={270} y={98} anchor="middle" lines={['energy', 'breaks bonds']} size={14} colour={warm} />
    <Chip x={LB.x + LB.w / 2} y={244} text="bonds hold particles" />
    <Chip x={RB.x + RB.w / 2} y={244} text="bonds broken" />
    <Lines x={270} y={288} anchor="middle" lines={['all the energy goes into breaking bonds, none into temperature']} size={13} weight={600} colour={muted} />
  </PhysicsDiagram>
}
function Cooling() {
  const gp = gasPts(LB, 9, 9, 5, 2.9)
  const lp = liquidPts(RB, 9, 22, 31)
  return <PhysicsDiagram title="A gas condensing to a liquid as it cools: bonds form between the particles and energy is released. The thermometer reading stays the same during the change.">
    <Container box={LB} /><Bonded pts={gp} reach={2.5} />
    <Container box={RB} open /><Bonded pts={lp} />
    <Arrow from={[214, 120]} to={[326, 120]} colour={ink} width={3} />
    <Lines x={270} y={106} anchor="middle" lines={['bonds form']} size={14} />
    <TransferArrow from={[404, 104]} to={[380, 26]} bend={-0.25} colour={cool} width={4} />
    <Lines x={414} y={40} lines={['energy', 'released']} size={14} colour={cool} />
    <Thermometer x={270} y={238} height={80} level={.55} colour={cool} />
    <Lines x={270} y={284} anchor="middle" lines={['temperature stays the same']} size={13} weight={650} colour={muted} />
    <Chip x={LB.x + LB.w / 2} y={244} text="gas" />
    <Chip x={RB.x + RB.w / 2} y={244} text="liquid" />
  </PhysicsDiagram>
}
function Term() {
  return <StateMap title="The state map: energy goes in when a substance melts or boils and comes out when it condenses or freezes. The energy transferred during a change of state is called latent heat." changes={['melting', 'freezing', 'boiling', 'condensing']}
    extra={<g>
      <rect x={130} y={22} width={280} height={34} rx="17" fill={P.hotFill} stroke={warm} strokeWidth="2" />
      <text x={270} y={45} textAnchor="middle" fontSize="15" fontWeight="750" fill={warm}>latent heat: energy gained</text>
      <rect x={130} y={256} width={280} height={34} rx="17" fill={P.coldFill} stroke={cool} strokeWidth="2" />
      <text x={270} y={279} textAnchor="middle" fontSize="15" fontWeight="750" fill={cool}>latent heat: energy released</text>
    </g>} />
}

/* ---------- Section 3: heating and cooling graphs ---------- */

const GF: GraphFrame = { x: 84, y: 46, width: 400, height: 190, xMax: 14, yMax: 10 }
const HEAT: Pt[] = [[0, 1], [2, 3], [5, 3], [7, 7], [11.5, 7], [13, 9.2]]
const COOL: Pt[] = [[0, 9.2], [1.5, 7], [6, 7], [8, 3], [11, 3], [13, 1]]
type Seg = { a: Pt; b: Pt; flat: boolean }
const segs = (pts: Pt[]): Seg[] => pts.slice(1).map((b, i) => ({ a: pts[i], b, flat: pts[i][1] === b[1] }))
function Graph({ kind, highlight = 'all', labels, numbers, levels = true, title, extra }: {
  kind: 'heat' | 'cool'; highlight?: 'all' | 'slope' | 'flat'; labels?: string[]; numbers?: number[]; levels?: boolean; title: string; extra?: ReactNode
}) {
  const s = graphScale(GF), pts = kind === 'heat' ? HEAT : COOL, colour = kind === 'heat' ? warm : cool, band = kind === 'heat' ? P.hotFill : P.coldFill
  const parts = segs(pts)
  return <PhysicsDiagram schematic={false} title={title}>
    <GraphAxes frame={GF} xLabel="Time" yLabel="Temperature" xTicks={[]} yTicks={[]} origin={false} />
    {levels && [[3, 'melting point'], [7, 'boiling point']].map(([v, name]) => <g key={v as number}>
      <path d={`M${GF.x} ${s.y(v as number)}H${GF.x + GF.width}`} stroke={muted} strokeWidth="1.4" strokeDasharray="5 6" />
      <text x={GF.x - 8} y={s.y(v as number) - 2} textAnchor="end" fontSize="12" fontWeight="650" fill={muted}>{(name as string).split(' ').map((w, k) => <tspan key={k} x={GF.x - 8} dy={k ? 14 : 0}>{w}</tspan>)}</text>
    </g>)}
    {parts.map((p, i) => p.flat && <rect key={`b${i}`} x={s.x(p.a[0])} y={s.y(p.a[1]) - 11} width={s.x(p.b[0]) - s.x(p.a[0])} height={22} rx="11" fill={band} opacity={highlight === 'slope' ? .35 : 1} />)}
    {parts.map((p, i) => {
      const on = highlight === 'all' || (highlight === 'flat') === p.flat
      return <path key={i} d={`M${s.x(p.a[0])} ${s.y(p.a[1])}L${s.x(p.b[0])} ${s.y(p.b[1])}`} stroke={colour} strokeWidth={p.flat ? 5.5 : 3.4} opacity={on ? 1 : faded} fill="none" />
    })}
    {labels && parts.map((p, i) => {
      const on = highlight === 'all' || (highlight === 'flat') === p.flat
      if (!labels[i] || !on) return null
      const mx = (s.x(p.a[0]) + s.x(p.b[0])) / 2, my = (s.y(p.a[1]) + s.y(p.b[1])) / 2
      const above = p.flat ? (kind === 'heat' ? my - 20 : my + 32) : my + 4
      const x = p.flat ? mx : mx + 14
      return <text key={`l${i}`} x={r1(x)} y={r1(above)} textAnchor={p.flat ? 'middle' : 'start'} fontSize="14" fontWeight="750" fill={colour} stroke="white" strokeWidth="4" paintOrder="stroke">{labels[i]}</text>
    })}
    {numbers && parts.map((p, i) => {
      if (numbers[i] === undefined) return null
      const mx = (s.x(p.a[0]) + s.x(p.b[0])) / 2, my = (s.y(p.a[1]) + s.y(p.b[1])) / 2
      const down = p.b[1] < p.a[1]
      const at: Pt = p.flat ? [mx, my - 24] : down ? [mx + 18, my - 14] : [mx + 20, my + 6]
      return <g key={`n${i}`}><circle cx={r1(at[0])} cy={r1(at[1])} r="12.5" fill="white" stroke={ink} strokeWidth="2" /><text x={r1(at[0])} y={r1(at[1] + 5)} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{numbers[i]}</text></g>
    })}
    {extra}
  </PhysicsDiagram>
}

/* ---------- Section 4: specific latent heat ---------- */

function Def() {
  return <PhysicsDiagram title="Specific latent heat: the energy needed to change the state of 1 kg of a material, for example 1 kg of ice melting to water, with no change in temperature.">
    <g>
      <IceCube x={110} y={150} s={1.5} />
      <rect x={82} y={200} width={56} height={26} rx="13" fill="white" stroke={massColour} strokeWidth="2" />
      <text x={110} y={218} textAnchor="middle" fontSize="15" fontWeight="750" fill={massColour}>1 kg</text>
    </g>
    <TransferArrow from={[180, 150]} to={[320, 150]} bend={-0.2} colour={warm} width={4} label="energy" />
    <Puddle x={410} y={170} rx={66} ry={17} seed={9} />
    <rect x={382} y={200} width={56} height={26} rx="13" fill="white" stroke={massColour} strokeWidth="2" />
    <text x={410} y={218} textAnchor="middle" fontSize="15" fontWeight="750" fill={massColour}>1 kg</text>
    <Chip x={110} y={80} text="0 °C" colour={cool} line={cool} />
    <Chip x={410} y={120} text="0 °C" colour={cool} line={cool} />
    <Lines x={270} y={264} anchor="middle" lines={['energy for 1 kg to change state, temperature unchanged']} size={14} />
  </PhysicsDiagram>
}
function Vs() {
  return <PhysicsDiagram schematic={false} title="Specific heat capacity is about a change in temperature. Specific latent heat is about a change of state.">
    <rect x={24} y={30} width={234} height={220} rx="20" fill={P.hotFill} stroke={warm} strokeWidth="2" />
    <Lines x={141} y={62} anchor="middle" lines={['specific heat capacity']} size={15} colour={warm} />
    <Thermometer x={120} y={206} height={110} level={.75} />
    <Arrow from={[146, 190]} to={[146, 110]} colour={warm} width={3} />
    <Lines x={141} y={236} anchor="middle" lines={['temperature change']} size={14} />
    <rect x={282} y={30} width={234} height={220} rx="20" fill={P.panel} stroke={lColour} strokeWidth="2" />
    <Lines x={399} y={62} anchor="middle" lines={['specific latent heat']} size={15} colour={lColour} />
    <IceCube x={340} y={150} s={.95} />
    <Arrow from={[374, 150]} to={[412, 150]} colour={ink} width={2.6} />
    <Puddle x={458} y={164} rx={40} ry={11} seed={5} />
    <Lines x={399} y={236} anchor="middle" lines={['change of state']} size={14} />
  </PhysicsDiagram>
}
function Pair({ which }: { which: 'fusion' | 'vapour' }) {
  const fusion = which === 'fusion'
  return <StateMap title={fusion ? 'Specific latent heat of fusion is for changing between a solid and a liquid: melting or freezing.' : 'Specific latent heat of vaporisation is for changing between a liquid and a gas: boiling or condensing.'}
    changes={fusion ? ['melting', 'freezing'] : ['boiling', 'condensing']} dimBoxes={[fusion ? 'gas' : 'solid']}
    extra={<g>
      <rect x={fusion ? 20 : 196} y={28} width={326} height={40} rx="20" fill={P.pdFill} stroke={lColour} strokeWidth="2" />
      <text x={fusion ? 183 : 359} y={54} textAnchor="middle" fontSize="15" fontWeight="750" fill={lColour}>{fusion ? 'fusion: melting or freezing' : 'vaporisation: boiling or condensing'}</text>
    </g>} />
}

/* ---------- Section 5: worked example ---------- */

const M = ({ children }: { children: ReactNode }) => <tspan fill={massColour}>{children}</tspan>
const L = ({ children }: { children: ReactNode }) => <tspan fill={lColour}>{children}</tspan>
const E = ({ children }: { children: ReactNode }) => <tspan fill={eColour}>{children}</tspan>
const ICE_LINES: CardLine[] = [
  { text: <><E>E</E> = <M>m</M> × <L>L</L></>, note: 'energy = mass × specific latent heat' },
  { text: <><E>E</E> = <M>0.50</M> × <L>334 000</L></>, note: 'substitute (mass already in kg)' },
  { text: <><E>E</E> = 167 000 J</>, note: 'calculate, unit joules' },
]
function Worked({ step }: { step: number }) {
  const titles = ['How much energy melts 0.50 kg of ice at its melting point? The specific latent heat of fusion of ice is 334 000 J/kg. Step 1: E = m L.', 'Step 2: substitute. E = 0.50 × 334 000.', 'Step 3: work it out. E = 167 000 J of energy.', 'If the mass is in grams, divide by 1000 first: 250 g ÷ 1000 = 0.25 kg.']
  const g2kg = step === 3
  return <PhysicsDiagram schematic={false} title={titles[step]}>
    <IceCube x={80} y={104} s={1.2} />
    <Lines x={80} y={162} anchor="middle" lines={['m = 0.50 kg']} size={14} colour={massColour} />
    <Lines x={80} y={184} anchor="middle" lines={['L = 334 000 J/kg']} size={13} colour={lColour} />
    <Lines x={80} y={206} anchor="middle" lines={['(fusion, ice)']} size={12} weight={600} colour={muted} />
    <g opacity={g2kg ? .45 : 1}><WorkCard x={170} y={40} w={356} lines={ICE_LINES} step={Math.min(step, 2)} done={step === 2} /></g>
    {g2kg && <g>
      <rect x={170} y={214} width={356} height={60} rx="18" fill="white" stroke={massColour} strokeWidth="2.2" />
      <text x={186} y={208} fontSize="13" fontWeight="700" fill={muted}>Mass in grams? Convert first</text>
      <text x={200} y={251} fontSize="17" fontWeight="750" fill={massColour}>250 g</text>
      <Arrow from={[260, 245]} to={[312, 245]} colour={massColour} width={2.4} />
      <text x={286} y={236} textAnchor="middle" fontSize="12" fontWeight="700" fill={muted}>÷ 1000</text>
      <text x={322} y={251} fontSize="17" fontWeight="750" fill={massColour}>0.25 kg</text>
      <text x={510} y={251} textAnchor="end" fontSize="13" fontWeight="650" fill={muted}>then E = mL</text>
    </g>}
  </PhysicsDiagram>
}

export function LatentVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'latent-heating': return <Boiling />
    case 'latent-bonds': return <Bonds />
    case 'latent-cooling': return <Cooling />
    case 'latent-term': return <Term />
    case 'latent-heatgraph': return <Graph kind="heat" title="A heating graph of temperature against time for a solid heated steadily: the line goes up, flat, up, flat, up. The flat parts are at the melting point and the boiling point." />
    case 'latent-slope': return <Graph kind="heat" highlight="slope" labels={['solid', '', 'liquid', '', 'gas']} title="The sloping parts of the heating graph: the temperature rises while the substance is all solid, then all liquid, then all gas. The particles move faster." extra={<Lines x={300} y={272} anchor="middle" lines={['sloping: temperature rising, particles faster']} size={13} weight={650} colour={muted} />} />
    case 'latent-flat': return <Graph kind="heat" highlight="flat" labels={['', 'melting', '', 'boiling', '']} title="The flat parts of the heating graph are changes of state: melting at the melting point and boiling at the boiling point. The temperature does not change." extra={<Lines x={300} y={272} anchor="middle" lines={['flat: temperature does not change']} size={13} weight={650} colour={muted} />} />
    case 'latent-coolgraph': return <Graph kind="cool" labels={['gas', 'condensing', 'liquid', 'freezing', 'solid']} title="A cooling graph: the same shape going downwards. Gas cools, condenses (flat), liquid cools, freezes (flat), then the solid cools." />
    case 'latent-q-heating': return <Graph kind="heat" levels={false} numbers={[1, 2, 3, 4]} title="A graph of temperature against time with four numbered parts." />
    case 'latent-q-cooling': return <Graph kind="cool" levels={false} numbers={[1, 2, 3, 4, 5]} title="A graph of temperature against time for a substance being cooled, with five numbered parts." />
    case 'latent-def': return <Def />
    case 'latent-vs': return <Vs />
    case 'latent-fusion': return <Pair which="fusion" />
    case 'latent-vapour': return <Pair which="vapour" />
    case 'latent-w1': return <Worked step={0} />
    case 'latent-w2': return <Worked step={1} />
    case 'latent-w3': return <Worked step={2} />
    case 'latent-w4': return <Worked step={3} />
    default: return null
  }
}
