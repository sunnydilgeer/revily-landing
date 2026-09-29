import { physicsPalette as P, PhysicsDiagram, EnergyStoreBadge, TransferArrow, energyStores, type EnergyStore, type Pt } from './PhysicsKit'
import { ink, muted, r1, Caption, Tag, Arrow, CrossMark, Floor, Ball, Car, Bike, Person, Shelf, Boundary, Leader, woodLine, metalLine, good } from './EnergyStoreVisuals'

/*
 * Physics Lesson 2: Conservation of energy. Original, code-native schematics; not to scale. Focus ids start with 'conserve-'.
 *
 * Store colours and icons are the PhysicsKit set used in every Physics lesson. Useful energy is green, wasted
 * (dissipated) energy is coral, as in the later lessons on wasted energy and efficiency.
 * Shared drawings: a dashed "system" boundary (section "Is energy ever lost?"), one sledge scene built up over three
 * frames (section "How do forces move energy?"), and for the four examples a scene on the left with the same
 * "from store → mechanically → to store" panel on the right (section "How do you describe a change?").
 */

const wasted = P.wasted, wastedFill = P.wastedFill
const snow = '#f4f8fb', snowLine = '#b9cfdd'

/* ---------- Section 2: is energy ever lost? ---------- */

/** A coin-like energy token. */
function Token({ x, y, r = 11 }: { x: number; y: number; r?: number }) {
  return <g><circle cx={x} cy={y} r={r} fill="#f6dfa5" stroke="#c98f2c" strokeWidth="2" /><text x={x} y={y + 4.5} textAnchor="middle" fontSize="13" fontWeight="800" fill="#9a6a14">E</text></g>
}
/** A few thin arrows fanning out from a point: energy spreading into the surroundings. */
function Spread({ x, y, r0 = 28, r1: rr = 70, n = 8, colour = wasted, start = 0, sweep = 360 }: { x: number; y: number; r0?: number; r1?: number; n?: number; colour?: string; start?: number; sweep?: number }) {
  return <g opacity=".85">{Array.from({ length: n }, (_, i) => {
    const a = (start + (sweep === 360 ? i * 360 / n : i * sweep / (n - 1))) * Math.PI / 180
    return <Arrow key={i} from={[r1(x + Math.cos(a) * r0), r1(y + Math.sin(a) * r0)]} to={[r1(x + Math.cos(a) * rr), r1(y + Math.sin(a) * rr)]} colour={colour} width={1.8} head={0.6} />
  })}</g>
}
function Phone({ x, y, s = 1, warm = false }: { x: number; y: number; s?: number; warm?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    {warm && <ellipse cx="0" cy="0" rx="40" ry="54" fill={wastedFill} opacity=".7" />}
    <rect x="-22" y="-40" width="44" height="80" rx="9" fill="#4f5d69" stroke="#33404b" strokeWidth="2" />
    <rect x="-17" y="-32" width="34" height="60" rx="4" fill="#cfe6f2" />
    <circle cx="0" cy="34" r="2.6" fill="#9aa9b5" />
  </g>
}
/** A stacked energy bar: segments of different stores, bottom first. */
function StackBar({ x, y, w = 60, h = 150, parts, label }: { x: number; y: number; w?: number; h?: number; parts: Array<[EnergyStore, number]>; label: string }) {
  let top = y
  return <g>
    <rect x={x - w / 2} y={y - h} width={w} height={h} rx="10" fill="white" stroke={ink} strokeWidth="2" />
    {parts.map(([store, k], i) => {
      const hh = r1((h - 8) * k), yy = r1(top - hh - (i === 0 ? 4 : 0)); top = yy
      return <g key={store}>
        <rect x={x - w / 2 + 4} y={yy} width={w - 8} height={hh} rx="6" fill={energyStores[store].fill} stroke={energyStores[store].line} strokeWidth="1.4" />
      </g>
    })}
    <text x={x} y={y + 22} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{label}</text>
  </g>
}
function Lost({ focus }: { focus: string }) {
  if (focus === 'conserve-principle') return <PhysicsDiagram title="Energy drawn as a token moving from one store to another. Energy can be moved, but it is never created and never destroyed.">
    <Boundary x={24} y={46} w={290} h={186} />
    <EnergyStoreBadge store="chemical" x={98} y={170} />
    <EnergyStoreBadge store="kinetic" x={246} y={170} />
    <TransferArrow from={[112, 140]} to={[232, 140]} bend={-0.4} colour="#c98f2c" width={3.5} />
    <Token x={172} y={98} />
    <text x={169} y={214} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>energy moves between stores</text>
    <g>
      <rect x={344} y={70} width={172} height={60} rx="14" fill={wastedFill} stroke={wasted} strokeWidth="1.6" />
      <CrossMark x={370} y={100} />
      <text x={392} y={96} fontSize="15" fontWeight="700" fill={ink}>never</text>
      <text x={392} y={115} fontSize="15" fontWeight="700" fill={wasted}>created</text>
      <rect x={344} y={148} width={172} height={60} rx="14" fill={wastedFill} stroke={wasted} strokeWidth="1.6" />
      <CrossMark x={370} y={178} />
      <text x={392} y={174} fontSize="15" fontWeight="700" fill={ink}>never</text>
      <text x={392} y={193} fontSize="15" fontWeight="700" fill={wasted}>destroyed</text>
    </g>
    <Caption text="the conservation of energy" y={274} colour={ink} size={16} />
  </PhysicsDiagram>
  if (focus === 'conserve-three') return <PhysicsDiagram title="A system with its energy shown as a bar. Three arrows leave it: energy transferred usefully, energy stored, and energy dissipated, which spreads out and is wasted.">
    <Boundary x={24} y={50} w={170} h={200} />
    <rect x={84} y={90} width={50} height={130} rx="10" fill="white" stroke={ink} strokeWidth="2" />
    <rect x={88} y={112} width={42} height={104} rx="7" fill="#f6dfa5" stroke="#c98f2c" strokeWidth="1.4" />
    <text x={109} y={240} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>energy</text>
    <TransferArrow from={[196, 110]} to={[318, 78]} bend={-0.08} colour={good} width={4} />
    <TransferArrow from={[196, 150]} to={[318, 150]} bend={0} colour={P.waterLine} width={4} />
    <TransferArrow from={[196, 190]} to={[318, 222]} bend={0.08} colour={wasted} width={4} />
    <rect x={326} y={56} width={196} height={44} rx="12" fill={P.usefulFill} stroke={good} strokeWidth="1.6" />
    <text x={424} y={84} textAnchor="middle" fontSize="15" fontWeight="700" fill={good}>transferred usefully</text>
    <rect x={326} y={128} width={196} height={44} rx="12" fill="#e3f0f8" stroke={P.waterLine} strokeWidth="1.6" />
    <text x={424} y={156} textAnchor="middle" fontSize="15" fontWeight="700" fill={P.waterLine}>stored</text>
    <rect x={326} y={200} width={196} height={44} rx="12" fill={wastedFill} stroke={wasted} strokeWidth="1.6" />
    <text x={424} y={228} textAnchor="middle" fontSize="15" fontWeight="700" fill={wasted}>dissipated</text>
    <text x={424} y={266} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>spread out and wasted</text>
  </PhysicsDiagram>
  if (focus === 'conserve-dissipated') return <PhysicsDiagram title="A phone that has been in use is warm. Thin arrows spread out from it into the air: energy is transferred to the thermal store of the surroundings. It is still there, but spread out and hard to use.">
    <Spread x={150} y={150} r0={56} r1={96} n={10} start={-72} />
    <Phone x={150} y={150} s={1.1} warm />
    <Tag x={150} y={30} text="warm phone" colour={ink} />
    <rect x={292} y={70} width={226} height={132} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <EnergyStoreBadge store="thermal" x={405} y={104} label="Thermal: surroundings" />
    <text x={405} y={146} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>still there,</text>
    <text x={405} y={166} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>but spread out</text>
    <text x={405} y={186} textAnchor="middle" fontSize="14" fontWeight="700" fill={wasted}>and hard to use</text>
    <Caption text="Dissipated energy is not destroyed." y={276} />
  </PhysicsDiagram>
  // conserve-every-time
  return <PhysicsDiagram title="Two bars of equal height. Energy before: all in the chemical store. Energy after: shared between the kinetic and thermal stores. The two totals are equal.">
    <StackBar x={150} y={220} parts={[['chemical', 1]]} label="energy before" />
    <StackBar x={390} y={220} parts={[['kinetic', 0.6], ['thermal', 0.4]]} label="energy after" />
    <text x={270} y={160} textAnchor="middle" fontSize="40" fontWeight="800" fill={ink}>=</text>
    <EnergyStoreBadge store="chemical" x={150} y={36} />
    <Leader from={[150, 52]} to={[150, 100]} colour={P.chemicalLine} />
    <EnergyStoreBadge store="thermal" x={480} y={102} />
    <EnergyStoreBadge store="kinetic" x={480} y={174} />
    <Caption text="The energy moves between stores. The total never changes." y={284} />
  </PhysicsDiagram>
}

/* ---------- Section 3: the sledge ---------- */

function Sledge({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 52} ${y - 6}H${x + 42}Q${x + 60} ${y - 6} ${x + 60} ${y - 22}`} stroke={woodLine} strokeWidth="4" fill="none" />
    <path d={`M${x - 40} ${y - 6}V${y - 22}M${x + 28} ${y - 6}V${y - 22}`} stroke={woodLine} strokeWidth="4" />
    <rect x={x - 52} y={y - 32} width={100} height={12} rx="4" fill="#e7a98b" stroke="#a5634a" strokeWidth="2" />
    <rect x={x - 30} y={y - 58} width={48} height={26} rx="6" fill="#cfe0ea" stroke="#56738a" strokeWidth="2" />
  </g>
}
const SNOW = 212
function SledgeScene({ focus }: { focus: string }) {
  const step = focus === 'conserve-work' ? 1 : focus === 'conserve-work-energy' ? 2 : 3
  const titles = [
    'A girl pulls a sledge across the snow with a rope. The force along the rope moves the sledge, so work is done on it.',
    'The same sledge scene with a card: work done equals energy transferred, and both are measured in joules, J.',
    'The same sledge scene. Energy is transferred mechanically from the chemical store of the girl to the kinetic store of the sledge.',
  ]
  const hand: Pt = [300, 188], hitch: Pt = [190, SNOW - 28]
  return <PhysicsDiagram title={titles[step - 1]}>
    <path d={`M0 ${SNOW}Q140 ${SNOW - 6} 270 ${SNOW}T540 ${SNOW}V300H0Z`} fill={snow} stroke={snowLine} strokeWidth="2" />
    <Sledge x={130} y={SNOW} />
    <path d={`M${hitch[0]} ${hitch[1]}L${hand[0]} ${hand[1]}`} stroke="#8a6443" strokeWidth="2.4" />
    <Person x={326} y={SNOW} lean={9} top="#e9a3b8" topLine="#a9567a" arms={[[[-12, -44], [-26, -24]], [[-8, -48], [-26, -26]]]} legs={[[[6, -16], [16, 0]], [[-6, -16], [-14, 0]]]} />
    {/* force along the rope and the movement */}
    <Arrow from={[214, 166]} to={[284, 169]} colour={ink} width={3.2} />
    <text x={249} y={154} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>force</text>
    <Arrow from={[80, 236]} to={[180, 236]} colour={P.kineticLine} width={3.2} />
    <text x={130} y={262} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.kineticLine}>the sledge moves</text>
    {step === 1 && <g>
      <rect x={378} y={60} width={146} height={78} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
      <text x={451} y={88} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>force moves</text>
      <text x={451} y={106} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>the object:</text>
      <text x={451} y={126} textAnchor="middle" fontSize="15" fontWeight="800" fill={good}>work is done</text>
    </g>}
    {step === 2 && <g>
      <rect x={358} y={40} width={174} height={112} rx="14" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
      <text x={445} y={68} textAnchor="middle" fontSize="15" fontWeight="800" fill={ink}>work done</text>
      <text x={445} y={92} textAnchor="middle" fontSize="20" fontWeight="800" fill={ink}>=</text>
      <text x={445} y={114} textAnchor="middle" fontSize="15" fontWeight="800" fill={ink}>energy transferred</text>
      <text x={445} y={140} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>both in joules (J)</text>
    </g>}
    {step === 3 && <g>
      <EnergyStoreBadge store="chemical" x={436} y={100} />
      <Leader from={[410, 116]} to={[334, 150]} colour={P.chemicalLine} />
      <EnergyStoreBadge store="kinetic" x={120} y={100} />
      <Leader from={[120, 116]} to={[124, 164]} colour={P.kineticLine} />
      <TransferArrow from={[380, 90]} to={[176, 90]} bend={0.22} colour={ink} width={3.5} label="mechanically" />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 4: four examples, each with the same store panel on the right ---------- */

function StorePanel({ from, fromOwner, to, toOwner, extra }: { from: EnergyStore; fromOwner: string; to: EnergyStore[]; toOwner: string | string[]; extra?: string }) {
  const owners = typeof toOwner === 'string' ? [toOwner] : toOwner
  const x = 410, gap = to.length > 1 ? 42 : 0, top = 176 - (to.length - 1) * gap / 2
  return <g>
    <rect x={292} y={10} width={238} height={280} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <text x={x} y={34} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>from</text>
    <EnergyStoreBadge store={from} x={x} y={58} />
    <text x={x} y={90} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>{fromOwner}</text>
    <Arrow from={[x, 100]} to={[x, top - 26 - (to.length > 2 ? 0 : 0)]} colour={ink} width={3.5} />
    <text x={x + 12} y={r1((100 + top - 26) / 2 + 5)} fontSize="14" fontWeight="700" fill={ink}>mechanically</text>
    {to.map((s, i) => <EnergyStoreBadge key={s} store={s} x={x} y={top + i * gap} />)}
    {extra && <text x={x} y={top + to.length * gap + 4} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted} opacity=".8">{extra}</text>}
    {owners.map((o, i) => <text key={o} x={x} y={276 - (owners.length - 1 - i) * 17} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>{o}</text>)}
  </g>
}
function Brick({ x, y, w = 36, h = 18 }: { x: number; y: number; w?: number; h?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx="3" fill="#e9b7a0" stroke="#a5634a" strokeWidth="1.6" />
}
function Examples({ focus }: { focus: string }) {
  if (focus === 'conserve-thrown') return <PhysicsDiagram title="A person throws a ball upwards. Energy is transferred mechanically from the chemical store of the thrower to the kinetic and gravitational potential stores of the ball.">
    <Floor x1={20} x2={276} y={264} />
    <Person x={130} y={264} s={1.3} arms={[[[16, -66], [26, -92]], [[-14, -46], [-18, -30]]]} />
    <Ball x={166} y={112} r={15} />
    <Arrow from={[166, 90]} to={[166, 40]} colour={P.kineticLine} width={3} />
    <text x={180} y={64} fontSize="13" fontWeight="700" fill={P.kineticLine}>up</text>
    <StorePanel from="chemical" fromOwner="the thrower" to={['kinetic', 'gravitational']} toOwner="the ball" />
  </PhysicsDiagram>
  if (focus === 'conserve-dropped') return <PhysicsDiagram title="A ball rolls off a shelf and falls. Gravity pulls it down and it speeds up. Energy is transferred mechanically from its gravitational potential store to its kinetic store.">
    <Floor x1={20} x2={276} y={264} />
    <path d="M40 30V264" stroke={woodLine} strokeWidth="4" opacity=".5" />
    <Shelf x={86} y={78} w={92} />
    <g opacity=".3"><Ball x={112} y={62} r={15} /></g>
    <g opacity=".55"><Ball x={150} y={128} r={15} /></g>
    <Ball x={164} y={210} r={15} />
    <path d="M126 70Q146 84 150 110" stroke={metalLine} strokeWidth="1.6" strokeDasharray="4 4" fill="none" />
    <path d="M152 146Q160 170 163 192" stroke={metalLine} strokeWidth="1.6" strokeDasharray="4 4" fill="none" />
    <Arrow from={[218, 120]} to={[218, 200]} colour={ink} width={3} />
    <text x={230} y={164} fontSize="14" fontWeight="700" fill={ink}>gravity</text>
    <StorePanel from="gravitational" fromOwner="the ball, high up" to={['kinetic']} toOwner="the ball, moving faster" />
  </PhysicsDiagram>
  if (focus === 'conserve-braking') return <PhysicsDiagram title="A cyclist squeezes the brakes. Friction between the brake pads and the wheel transfers energy mechanically from the kinetic store of the bike to the thermal stores of the brakes, the wheels and the surroundings.">
    <Floor x1={10} x2={280} y={250} />
    <Bike x={140} y={250} s={1.35} braking />
    <circle cx={r1(140 + 46 * 1.35)} cy={r1(250 - 44 * 1.35)} r="16" fill="none" stroke={P.thermalLine} strokeWidth="2" strokeDasharray="4 4" />
    <Leader from={[226, 124]} to={[r1(140 + 46 * 1.35), r1(250 - 44 * 1.35) - 10]} colour={P.thermalLine} />
    <Tag x={236} y={112} text="brake pad" colour={P.thermalLine} />
    <text x={140} y={284} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>friction slows the wheel</text>
    <StorePanel from="kinetic" fromOwner="the moving bike" to={['thermal']} toOwner={['the brakes, the wheels', 'and the surroundings']} />
  </PhysicsDiagram>
  // conserve-crash
  return <PhysicsDiagram title="A car hits a wall and the two push on each other. Energy is transferred mechanically from the kinetic store of the car to many other stores, including the elastic potential and thermal stores of the car and the wall.">
    <Floor x1={10} x2={280} y={240} />
    <rect x={222} y={84} width={48} height={156} rx="4" fill="#e9b7a0" stroke="#a5634a" strokeWidth="2" />
    <g stroke="#a5634a" strokeWidth="1.3" opacity=".6">
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M222 ${106 + i * 20}H270`} />)}
      {Array.from({ length: 8 }, (_, i) => <path key={`v${i}`} d={`M${i % 2 ? 238 : 254} ${86 + i * 20}v18`} />)}
    </g>
    <Car x={172} y={240} s={1.2} />
    <Arrow from={[228, 212]} to={[266, 212]} colour={ink} width={3.2} head={0.85} />
    <Arrow from={[216, 212]} to={[174, 212]} colour={ink} width={3.2} head={0.85} />
    <text x={200} y={140} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>they push on</text>
    <text x={200} y={156} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>each other</text>
    <Leader from={[210, 162]} to={[222, 204]} colour={ink} />
    <StorePanel from="kinetic" fromOwner="the moving car" to={['elastic', 'thermal']} toOwner="the car and the wall" extra="and other stores" />
  </PhysicsDiagram>
}

/* ---------- Question: a ball at three heights (no speeds, no stores) ---------- */

function QuestionDrop() {
  const ys = [70, 150, 232], labels = ['Position 1', 'Position 2', 'Position 3']
  return <PhysicsDiagram title="A ball shown at three heights as it falls.">
    <path d="M120 20V272" stroke={woodLine} strokeWidth="5" opacity=".5" />
    <Floor x1={100} x2={440} y={272} />
    <Shelf x={164} y={70} w={80} />
    {ys.map((y, i) => <g key={i}>
      <g opacity={i === 0 ? 1 : 0.9}><Ball x={i === 0 ? 180 : 250} y={i === 0 ? y - 15 : y} r={15} /></g>
      <path d={`M${i === 0 ? 200 : 270} ${i === 0 ? y - 15 : y}H330`} stroke={metalLine} strokeWidth="1.4" strokeDasharray="4 4" />
      <text x={340} y={(i === 0 ? y - 15 : y) + 5} fontSize="15" fontWeight="700" fill={ink}>{labels[i]}</text>
    </g>)}
    <Arrow from={[210, 110]} to={[210, 220]} colour={ink} width={3} />
  </PhysicsDiagram>
}

export function ConserveVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  if (['conserve-principle', 'conserve-three', 'conserve-dissipated', 'conserve-every-time'].includes(focus)) return <Lost focus={focus} />
  if (['conserve-work', 'conserve-work-energy', 'conserve-mechanical'].includes(focus)) return <SledgeScene focus={focus} />
  if (['conserve-thrown', 'conserve-dropped', 'conserve-braking', 'conserve-crash'].includes(focus)) return <Examples focus={focus} />
  if (focus === 'conserve-q-drop') return <QuestionDrop />
  return null
}

