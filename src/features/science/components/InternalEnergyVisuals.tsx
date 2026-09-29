import type { ReactNode } from 'react'
import { physicsPalette, PhysicsDiagram, Lines, Leader, EnergyStoreBadge, TransferArrow, type Pt } from './PhysicsKit'
import { Arrow, CurveArrow, Particle, StateBox, Container, Magnifier, Thermometer, Heater, IceCube, Puddle, Chip, CrossMark, Motion, solidPts, liquidPts, faded, particleLine, r1, type Box, type ParticleState } from './GasParticleVisuals'
import { Balance } from './DensityVisuals'

/*
 * Physics Lesson 29: Internal energy and changes of state. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'internal-' and is routed from CellBiologyVisuals.tsx.
 *
 * Particles and state boxes as in the particle-model lesson (solid grid, liquid irregular, gas sparse).
 * Energy-store badges from the Physics kit: kinetic orange; the particles' potential store is drawn with the
 * spring (elastic potential) badge, because it comes from the bonds between particles.
 * Warm (hot red) arrows = heating, cool (cold blue) arrows = cooling, in every drawing and in the state map.
 * The state map (StateMap) is exported for the latent heat lesson.
 */
const P = physicsPalette
const { ink, muted } = P
const warm = P.hot, cool = P.cold, bond = P.elasticLine

/* ---------- The state map: solid, liquid and gas with the named changes ---------- */

export type Change = 'melting' | 'freezing' | 'boiling' | 'condensing' | 'sublimating'
const SM: Record<ParticleState, Box> = { solid: { x: 22, y: 112, w: 112, h: 92 }, liquid: { x: 214, y: 112, w: 112, h: 92 }, gas: { x: 406, y: 112, w: 112, h: 92 } }
const CHANGE: Record<Change, { from: Pt; to: Pt; bend: number; colour: string; label: string[]; at: Pt }> = {
  melting: { from: [138, 132], to: [210, 132], bend: -0.35, colour: warm, label: ['melting'], at: [174, 98] },
  boiling: { from: [330, 132], to: [402, 132], bend: -0.35, colour: warm, label: ['boiling or', 'evaporating'], at: [366, 82] },
  freezing: { from: [210, 186], to: [138, 186], bend: -0.35, colour: cool, label: ['freezing'], at: [174, 236] },
  condensing: { from: [402, 186], to: [330, 186], bend: -0.35, colour: cool, label: ['condensing'], at: [366, 236] },
  sublimating: { from: [78, 106], to: [462, 106], bend: -0.36, colour: warm, label: ['sublimating'], at: [270, 26] },
}
export function StateMap({ title, boxes = ['solid', 'liquid', 'gas'], changes = [], named = true, numbers, energy, extra, viewBox, dimBoxes = [] }: {
  title: string; boxes?: ParticleState[]; changes?: Change[]; named?: boolean; numbers?: Partial<Record<Change, number>>; energy?: boolean; extra?: ReactNode; viewBox?: string; dimBoxes?: ParticleState[]
}) {
  const states: ParticleState[] = ['solid', 'liquid', 'gas']
  return <PhysicsDiagram title={title} viewBox={viewBox}>
    {states.map(s => {
      const b = SM[s], on = boxes.includes(s) && !dimBoxes.includes(s)
      if (!boxes.includes(s) && !dimBoxes.includes(s)) return null
      return <g key={s} opacity={on ? 1 : faded}>
        <StateBox box={b} state={s} r={7.5} cols={6} rows={4} n={s === 'liquid' ? 18 : 5} seed={s === 'gas' ? 13 : 6} arrows={false} />
        <Chip x={b.x + b.w / 2} y={b.y + b.h + 26} text={s} />
      </g>
    })}
    {changes.map(c => {
      const { from, to, bend, colour, label, at } = CHANGE[c]
      const n = numbers?.[c]
      return <g key={c}>
        <CurveArrow from={from} to={to} bend={bend} colour={colour} width={3} />
        {named && <Lines x={at[0]} y={at[1]} anchor="middle" lines={label} size={14} colour={colour} />}
        {n !== undefined && <g><circle cx={at[0]} cy={at[1] - 5 + (label.length > 1 && !named ? 8 : 0)} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={at[0]} y={at[1] + (label.length > 1 && !named ? 8 : 0)} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{n}</text></g>}
      </g>
    })}
    {energy && <g>
      <Lines x={12} y={288} lines={['warm arrows: heating, energy in']} size={13} weight={650} colour={warm} />
      <Lines x={528} y={288} anchor="end" lines={['cool arrows: cooling, energy out']} size={13} weight={650} colour={cool} />
    </g>}
    {extra}
  </PhysicsDiagram>
}

/* ---------- Section 2: kinetic and potential stores, internal energy ---------- */

function Spring({ a, b, colour = bond, coils = 5 }: { a: Pt; b: Pt; colour?: string; coils?: number }) {
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, nx = -uy, ny = ux
  const pts: Pt[] = [a]
  for (let i = 1; i < coils * 2; i++) { const t = 0.15 + 0.7 * i / (coils * 2), s = i % 2 ? 6 : -6; pts.push([r1(a[0] + ux * len * t + nx * s), r1(a[1] + uy * len * t + ny * s)]) }
  pts.push(b)
  return <path d={pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join('')} stroke={colour} strokeWidth="2" fill="none" />
}
const KBOX: Box = { x: 30, y: 60, w: 190, h: 150 }
function Stores({ show }: { show: 'kinetic' | 'potential' | 'total' }) {
  const pts = solidPts(KBOX, 10, 8, 5)
  const title = show === 'kinetic' ? 'Particles in a solid vibrating. Moving or vibrating particles have energy in their kinetic energy stores.'
    : show === 'potential' ? 'A close-up of two particles held by a bond, drawn as a spring. Because of their positions, the particles have energy in their potential energy stores.'
      : 'Internal energy is the total energy the particles have in their kinetic and potential energy stores.'
  const kOn = show !== 'potential', pOn = show !== 'kinetic'
  return <PhysicsDiagram title={title}>
    <Container box={KBOX} />
    {pts.map(([x, y], i) => <Particle key={i} x={x} y={y} r={10} />)}
    {kOn && [1, 3, 5, 7].map(i => { const [x, y] = pts[pts.length - 8 + i - 1]; return <path key={i} d={`M${x - 12} ${y - 17}H${x + 12}M${x - 7.5} ${y - 20.5}L${x - 12} ${y - 17}L${x - 7.5} ${y - 13.5}M${x + 7.5} ${y - 20.5}L${x + 12} ${y - 17}L${x + 7.5} ${y - 13.5}`} stroke={P.kineticLine} strokeWidth="2" fill="none" /> })}
    {/* close-up of two particles joined by a bond */}
    <g opacity={pOn ? 1 : faded}>
      <Magnifier cx={330} cy={112} r={56} from={[pts[27][0] + 10, pts[27][1]]}>
        <rect x={270} y={52} width={120} height={120} fill="#f4f7fb" />
        <Spring a={[305, 112]} b={[355, 112]} />
        <Particle x={296} y={112} r={17} /><Particle x={364} y={112} r={17} />
      </Magnifier>
    </g>
    {show === 'kinetic' && <g>
      <Lines x={124} y={40} anchor="middle" lines={['move or vibrate']} size={15} colour={P.kineticLine} />
      <EnergyStoreBadge store="kinetic" x={124} y={256} label="Kinetic energy stores" />
    </g>}
    {show === 'potential' && <g>
      <Lines x={420} y={70} lines={['bond']} size={14} colour={bond} />
      <Leader from={[418, 66]} to={[344, 108]} colour={bond} />
      <Lines x={330} y={196} anchor="middle" lines={['positions of the particles']} size={14} colour={bond} />
      <EnergyStoreBadge store="elastic" x={330} y={256} label="Potential energy stores" />
    </g>}
    {show === 'total' && <g>
      <EnergyStoreBadge store="kinetic" x={96} y={250} label="Kinetic" />
      <text x={170} y={256} textAnchor="middle" fontSize="22" fontWeight="750" fill={ink}>+</text>
      <EnergyStoreBadge store="elastic" x={250} y={250} label="Potential" />
      <text x={330} y={256} textAnchor="middle" fontSize="22" fontWeight="750" fill={ink}>=</text>
      <rect x={350} y={232} width={170} height={36} rx="18" fill={P.panel} stroke={ink} strokeWidth="2" />
      <text x={435} y={256} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>internal energy</text>
      <Lines x={430} y={210} anchor="middle" lines={['total of both stores']} size={13} weight={650} colour={muted} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 3: what heating does ---------- */

/** A beaker (open glass) with its bottom at y, centred on x; `children` are drawn inside it. */
function Beaker({ x, y, w = 120, h = 110, children }: { x: number; y: number; w?: number; h?: number; children?: ReactNode }) {
  return <g>
    {children}
    <path d={`M${x - w / 2 - 6} ${y - h}L${x - w / 2} ${y - h + 6}V${y - 8}Q${x - w / 2} ${y} ${x - w / 2 + 8} ${y}H${x + w / 2 - 8}Q${x + w / 2} ${y} ${x + w / 2} ${y - 8}V${y - h}`} fill="none" stroke="#7f9db2" strokeWidth="2.6" />
  </g>
}
function EnergyBar({ x, y, level, from }: { x: number; y: number; level: number; from?: number }) {
  const h = 120
  return <g>
    <rect x={x} y={y} width={26} height={h} rx="13" fill="white" stroke={P.thermalLine} strokeWidth="2" />
    {from !== undefined && <rect x={x + 4} y={r1(y + 4 + (h - 8) * (1 - from))} width={18} height={r1((h - 8) * from)} rx="9" fill={P.thermal} opacity=".5" />}
    <rect x={x + 4} y={r1(y + 4 + (h - 8) * (1 - level))} width={18} height={r1((h - 8) * level)} rx="9" fill={P.thermal} stroke={P.thermalLine} strokeWidth="1.2" opacity={from !== undefined ? .95 : 1} />
    <Lines x={x + 13} y={y + h + 22} anchor="middle" lines={['internal', 'energy']} size={13} weight={700} colour={P.thermalLine} />
  </g>
}
function Heating() {
  const inner: Box = { x: 110, y: 100, w: 108, h: 104 }
  const pts = liquidPts(inner, 8, 20, 17)
  return <PhysicsDiagram title="A beaker of water on a heater. Energy is transferred to the particles by heating, so the internal energy of the water increases.">
    <Beaker x={164} y={208} w={116} h={120}>
      <path d="M108 96H220V200Q220 206 214 206H114Q108 206 108 200Z" fill={P.water} opacity=".45" />
      <path d="M108 96H220" stroke={P.waterLine} strokeWidth="1.6" opacity=".7" />
      {pts.map(([x, y], i) => <Particle key={i} x={x} y={y} r={8} />)}
    </Beaker>
    <Heater x={164} y={212} w={150} />
    <TransferArrow from={[40, 250]} to={[118, 190]} bend={-0.25} colour={warm} width={4} label="heating" />
    <EnergyBar x={330} y={80} level={.8} from={.45} />
    <Arrow from={[376, 180]} to={[376, 100]} colour={P.thermalLine} width={3} />
    <Lines x={392} y={130} lines={['goes up']} size={14} colour={P.thermalLine} />
    <Lines x={270} y={40} anchor="middle" lines={['energy in: the particles gain energy']} size={14} />
  </PhysicsDiagram>
}
function Two() {
  return <PhysicsDiagram schematic={false} title="More internal energy leads to one of two things: the temperature rises, or the state changes.">
    <rect x={146} y={30} width={248} height={50} rx="25" fill={P.thermal} fillOpacity=".5" stroke={P.thermalLine} strokeWidth="2" />
    <text x={270} y={61} textAnchor="middle" fontSize="16" fontWeight="750" fill={ink}>more internal energy</text>
    <CurveArrow from={[230, 86]} to={[140, 150]} bend={-0.15} colour={ink} width={3} />
    <CurveArrow from={[310, 86]} to={[400, 150]} bend={0.15} colour={ink} width={3} />
    <text x={270} y={132} textAnchor="middle" fontSize="15" fontWeight="750" fill={muted}>either</text>
    {/* temperature rises */}
    <rect x={40} y={156} width={200} height={118} rx="20" fill={P.hotFill} stroke={warm} strokeWidth="2" />
    <Thermometer x={80} y={258} height={84} level={.78} />
    <Arrow from={[100, 240]} to={[100, 190]} colour={warm} width={3} />
    <Lines x={118} y={206} lines={['temperature', 'rises']} size={16} colour={warm} />
    {/* state changes */}
    <rect x={300} y={156} width={200} height={118} rx="20" fill={P.panel} stroke={particleLine} strokeWidth="2" />
    <IceCube x={344} y={214} s={.75} />
    <Arrow from={[372, 214]} to={[400, 214]} colour={ink} width={2.6} />
    <Puddle x={440} y={226} rx={30} ry={9} seed={7} />
    <Lines x={400} y={260} anchor="middle" lines={['state changes']} size={16} colour={particleLine} />
  </PhysicsDiagram>
}
function Temp() {
  const b: Box = { x: 190, y: 60, w: 200, h: 150 }
  const pts: Pt[] = [[226, 96], [300, 88], [356, 110], [240, 160], [318, 150], [362, 180], [270, 190]]
  const ang = [30, 190, 250, 320, 60, 300, 200]
  return <PhysicsDiagram title="When the temperature of a gas rises, its particles move faster, shown by long arrows. A thermometer shows the temperature going up.">
    <Container box={b} />
    {pts.map(([x, y], i) => <g key={i}><Particle x={x} y={y} /><Motion x={x} y={y} angle={ang[i]} length={28} width={2.4} /></g>)}
    <Thermometer x={120} y={206} height={130} level={.8} />
    <Arrow from={[142, 190]} to={[142, 110]} colour={warm} width={3} />
    <Lines x={290} y={40} anchor="middle" lines={['particles move faster']} size={15} colour={P.kineticLine} />
    <Lines x={100} y={240} anchor="middle" lines={['temperature', 'rises']} size={14} colour={warm} />
    <Lines x={300} y={250} anchor="middle" lines={['how much depends on mass,', 'specific heat capacity and energy']} size={13} weight={600} colour={muted} />
  </PhysicsDiagram>
}
function StateChange() {
  return <PhysicsDiagram title="A change of state: energy from heating breaks the bonds between particles, pulling them apart. This increases the energy in their potential energy stores.">
    {/* before: two bonded particles */}
    <g>
      <Spring a={[74, 130]} b={[124, 130]} />
      <Particle x={64} y={130} r={17} /><Particle x={134} y={130} r={17} />
      <Lines x={99} y={184} anchor="middle" lines={['bonded']} size={14} colour={bond} />
    </g>
    <TransferArrow from={[180, 130]} to={[300, 130]} bend={0} colour={warm} width={4} />
    <Lines x={240} y={112} anchor="middle" lines={['energy breaks bonds']} size={14} colour={warm} />
    {/* after: pulled apart, bond broken */}
    <g>
      <path d="M362 130l10 -6l8 10l10 -8" stroke={bond} strokeWidth="2" fill="none" strokeDasharray="3 4" />
      <path d="M418 130l10 -6l8 10l10 -8" stroke={bond} strokeWidth="2" fill="none" strokeDasharray="3 4" />
      <Particle x={340} y={134} r={17} /><Particle x={480} y={126} r={17} />
      <Arrow from={[320, 164]} to={[296, 172]} colour={P.kineticLine} width={2} />
      <Arrow from={[500, 156]} to={[524, 166]} colour={P.kineticLine} width={2} />
      <Lines x={410} y={184} anchor="middle" lines={['bond broken:', 'further apart']} size={14} colour={bond} />
    </g>
    <EnergyStoreBadge store="elastic" x={200} y={256} label="Potential energy stores" />
    <Arrow from={[322, 272]} to={[322, 238]} colour={bond} width={3.4} />
    <Lines x={336} y={261} lines={['increase']} size={14} colour={bond} />
  </PhysicsDiagram>
}

/* ---------- Section 5: what stays the same ---------- */

function Physical() {
  return <StateMap title="Melting and freezing change only the arrangement of the same particles. No new substance is made: it is a physical change." boxes={['solid', 'liquid']} changes={['melting', 'freezing']}
    extra={<g>
      <rect x={350} y={36} width={176} height={62} rx="16" fill={P.usefulFill} stroke={P.useful} strokeWidth="2" />
      <Lines x={438} y={62} anchor="middle" lines={['same particles,', 'new arrangement']} size={14} colour={P.useful} />
      <g transform="translate(360 262)">
        <text x={40} y={5} fontSize="15" fontWeight="700" fill={P.wasted} textDecoration="line-through">new substance</text>
        <CrossMark x={20} y={0} />
      </g>
    </g>} />
}
function Reverse() {
  return <PhysicsDiagram title="Water freezes to ice and melts back to water. The change can be reversed, and the material gets back the properties it had before.">
    <Puddle x={100} y={170} rx={60} ry={16} seed={4} />
    <IceCube x={270} y={160} s={1.3} />
    <Puddle x={440} y={170} rx={60} ry={16} seed={4} />
    <CurveArrow from={[160, 130]} to={[222, 122]} bend={-0.3} colour={cool} width={3} />
    <CurveArrow from={[318, 122]} to={[380, 130]} bend={-0.3} colour={warm} width={3} />
    <Lines x={190} y={88} anchor="middle" lines={['freezes']} size={14} colour={cool} />
    <Lines x={350} y={88} anchor="middle" lines={['melts']} size={14} colour={warm} />
    <Lines x={100} y={218} anchor="middle" lines={['water']} size={14} />
    <Lines x={270} y={218} anchor="middle" lines={['ice']} size={14} />
    <Lines x={440} y={218} anchor="middle" lines={['water again']} size={14} />
    <Lines x={270} y={264} anchor="middle" lines={['same properties again']} size={15} colour={P.useful} />
  </PhysicsDiagram>
}
function Count() {
  const a: Box = { x: 40, y: 60, w: 170, h: 130 }, b: Box = { x: 330, y: 60, w: 170, h: 130 }
  const sp = solidPts(a, 13, 5, 2)
  const lp = liquidPts(b, 13, 10, 23)
  const num = (pts: Pt[]) => pts.map(([x, y], i) => <g key={i}><Particle x={x} y={y} r={13} /><text x={x} y={y + 4.5} textAnchor="middle" fontSize="12" fontWeight="700" fill={particleLine}>{i + 1}</text></g>)
  return <PhysicsDiagram title="A solid and the liquid it melts into each have the same number of particles, ten in each.">
    <StateBox box={a} state="solid" pts={sp} arrows={false} r={13} />
    {num(sp)}
    <StateBox box={b} state="liquid" pts={lp} arrows={false} r={13} />
    {num(lp)}
    <TransferArrow from={[228, 130]} to={[312, 130]} bend={-0.25} colour={warm} width={3.4} label="melts" />
    <Lines x={125} y={220} anchor="middle" lines={['solid: 10 particles']} size={14} />
    <Lines x={415} y={220} anchor="middle" lines={['liquid: 10 particles']} size={14} />
    <Lines x={270} y={268} anchor="middle" lines={['none added, none lost']} size={15} colour={P.useful} />
  </PhysicsDiagram>
}
function Mass() {
  return <PhysicsDiagram title="0.50 kg of ice on a balance, and the same ice after it has melted: the balance reads 0.50 kg both times. Mass is conserved.">
    <g>
      <IceCube x={130} y={148} s={.9} />
      <path d="M82 124V172Q82 180 90 180H170Q178 180 178 172V124" fill="none" stroke="#7f9db2" strokeWidth="2.6" />
    </g>
    <Balance x={130} y={182} reading="0.50 kg" w={150} />
    <g>
      <path d="M362 124V172Q362 180 370 180H450Q458 180 458 172V124" fill="none" stroke="#7f9db2" strokeWidth="2.6" />
      <path d="M364 146H456V172Q456 178 450 178H370Q364 178 364 172Z" fill={P.water} />
      <path d="M364 146H456" stroke={P.waterLine} strokeWidth="1.8" />
    </g>
    <Balance x={410} y={182} reading="0.50 kg" w={150} />
    <TransferArrow from={[220, 150]} to={[330, 150]} bend={-0.25} colour={warm} width={3.4} label="melts" />
    <Lines x={130} y={256} anchor="middle" lines={['ice']} size={14} />
    <Lines x={410} y={256} anchor="middle" lines={['water']} size={14} />
    <Lines x={270} y={60} anchor="middle" lines={['mass is conserved']} size={16} colour={P.useful} />
    <Lines x={270} y={286} anchor="middle" lines={['the balances were zeroed with the empty dish']} size={12} weight={600} colour={muted} />
  </PhysicsDiagram>
}

export function InternalEnergyVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'internal-kinetic': return <Stores show="kinetic" />
    case 'internal-potential': return <Stores show="potential" />
    case 'internal-total': return <Stores show="total" />
    case 'internal-heating': return <Heating />
    case 'internal-two': return <Two />
    case 'internal-temp': return <Temp />
    case 'internal-state': return <StateChange />
    case 'internal-solidliquid': return <StateMap title="Melting changes a solid to a liquid (warm arrow, heating). Freezing changes a liquid to a solid (cool arrow, cooling)." changes={['melting', 'freezing']} dimBoxes={['gas']} />
    case 'internal-liquidgas': return <StateMap title="Boiling or evaporating changes a liquid to a gas (heating). Condensing changes a gas to a liquid (cooling)." changes={['boiling', 'condensing']} dimBoxes={['solid']} />
    case 'internal-sublime': return <StateMap title="Sublimating: a solid changes straight to a gas without becoming a liquid first." changes={['sublimating']} dimBoxes={['liquid']} />
    case 'internal-map': return <StateMap title="All the changes of state. Warm arrows are heating: melting, boiling or evaporating, sublimating. Cool arrows are cooling, which takes energy away: freezing and condensing." changes={['melting', 'freezing', 'boiling', 'condensing', 'sublimating']} energy />
    case 'internal-physical': return <Physical />
    case 'internal-reverse': return <Reverse />
    case 'internal-count': return <Count />
    case 'internal-mass': return <Mass />
    case 'internal-q-changes': return <StateMap title="Three boxes showing solid, liquid and gas with four numbered arrows between them." changes={['melting', 'boiling', 'condensing', 'freezing']} named={false} numbers={{ melting: 1, boiling: 2, condensing: 3, freezing: 4 }} />
    default: return null
  }
}
