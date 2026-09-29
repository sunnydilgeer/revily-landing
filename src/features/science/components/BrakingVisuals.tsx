import { physicsPalette as P, PhysicsDiagram, Lines, EnergyStoreBadge, TransferArrow, GraphAxes, graphScale, type Pt, type GraphFrame } from './PhysicsKit'
import { Car, Arrow, Motion, Card, Tick, CrossMark, Thermometer, Tag, metal, metalLine } from './EnergyStoreVisuals'

/*
 * Physics Lesson 51: Braking distance. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'braking-' and is routed from CellBiologyVisuals.tsx.
 *
 * One road scene (a soft grey strip, the family car from the energy lessons with its brake lights on) is reused for
 * the factors; one wheel close-up (tyre, brake disc, brake pad) is reused for the energy section. Braking forces are
 * vermilion arrows, the kinetic store orange and the thermal store red, as in every Physics lesson. Distances are
 * shown as brackets under the road.
 */
const { ink, muted } = P
const force = P.current, road = '#e7ebee', roadLine = '#b7c2ca', tyre = '#4f5d69', tyreLine = '#33404b'
const brakeRed = '#e0513f'

/* ---------- Road-scene pieces ---------- */

/** A road strip whose top edge (where the tyres touch) is at y. */
function Road({ y, x1 = 14, x2 = 526 }: { y: number; x1?: number; x2?: number }) {
  return <g>
    <path d={`M${x1} ${y}H${x2}V${y + 22}Q${(x1 + x2) / 2} ${y + 25} ${x1} ${y + 22}Z`} fill={road} />
    <path d={`M${x1} ${y}H${x2}`} stroke={roadLine} strokeWidth="2" />
    <path d={`M${x1 + 10} ${y + 12}H${x2 - 10}`} stroke="white" strokeWidth="3" strokeDasharray="18 16" />
  </g>
}
/** The family car with its brake light glowing; (x, y) is the road under its middle. */
function BrakingCar({ x, y, s = 1, fill, line, lights = true, ghost = false }: { x: number; y: number; s?: number; fill?: string; line?: string; lights?: boolean; ghost?: boolean }) {
  return <g opacity={ghost ? 0.3 : 1}>
    <Car x={x} y={y} s={s} fill={fill} line={line} />
    {lights && <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="-46" cy="-24" r="9" fill={brakeRed} opacity=".25" />
      <rect x="-50" y="-28" width="6" height="8" rx="2.5" fill={brakeRed} stroke="#a8392b" strokeWidth="1.2" />
    </g>}
  </g>
}
/** A distance bracket: a line with end stops and a centred label under it. */
function Bracket({ x1, x2, y, label, colour = ink, size = 14 }: { x1: number; x2: number; y: number; label?: string; colour?: string; size?: number }) {
  return <g>
    <path d={`M${x1} ${y - 8}V${y + 8}M${x2} ${y - 8}V${y + 8}`} stroke={colour} strokeWidth="2.2" />
    <Arrow from={[x1 + 1, y]} to={[x2 - 1, y]} colour={colour} width={2.2} head={0.75} />
    <Arrow from={[x2 - 1, y]} to={[x1 + 1, y]} colour={colour} width={2.2} head={0.75} />
    {label && <text x={(x1 + x2) / 2} y={y + 24} textAnchor="middle" fontSize={size} fontWeight="700" fill={colour}>{label}</text>}
  </g>
}
/** Two dark skid marks trailing behind a point on the road. */
function Skid({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return <g stroke="#6d7780" strokeWidth="4" opacity=".55">
    <path d={`M${x1} ${y + 4}Q${(x1 + x2) / 2} ${y + 2} ${x2} ${y + 4}`} fill="none" />
    <path d={`M${x1 + 6} ${y + 10}Q${(x1 + x2) / 2} ${y + 8} ${x2} ${y + 10}`} fill="none" />
  </g>
}
/** A flat patch on the road surface with a label above it. */
function Patch({ x, y, w, kind }: { x: number; y: number; w: number; kind: 'water' | 'ice' | 'oil' | 'leaves' }) {
  const look = {
    water: { fill: P.water, line: P.waterLine },
    ice: { fill: '#e6f4fb', line: '#7fb3cf' },
    oil: { fill: '#b9b2c9', line: '#6c6385' },
    leaves: { fill: '#f2cf9a', line: '#b7792f' },
  }[kind]
  return <g>
    <ellipse cx={x} cy={y + 6} rx={w / 2} ry="7" fill={look.fill} stroke={look.line} strokeWidth="1.8" />
    {kind === 'ice' && <path d={`M${x - w / 4} ${y + 4}l8 4M${x + 4} ${y + 3}l10 5`} stroke="white" strokeWidth="2.2" />}
    {kind === 'oil' && <path d={`M${x - w / 4} ${y + 5}q${w / 4} -4 ${w / 2} 0`} stroke="#e9d9f4" strokeWidth="2" fill="none" />}
    {kind === 'leaves' && [-1, 0, 1].map(k => <path key={k} d={`M${x + k * w / 4 - 6} ${y + 6}q6 -7 12 0q-6 5 -12 0Z`} fill="#e3a14a" stroke="#b7792f" strokeWidth="1.2" />)}
    {kind === 'water' && <path d={`M${x - w / 4} ${y + 5}q${w / 8} -3 ${w / 4} 0`} stroke="white" strokeWidth="2" fill="none" />}
    <text x={x} y={y - 12} textAnchor="middle" fontSize="13" fontWeight="700" fill={look.line}>{kind}</text>
  </g>
}

/* ---------- Section 2: what changes braking distance ---------- */

function Recap() {
  const y = 170
  return <PhysicsDiagram title="A car on a road with its brake lights on. The braking distance is how far it travels from where the brakes start working to where it stops.">
    <Road y={y} />
    <BrakingCar x={110} y={y} lights={false} ghost />
    <BrakingCar x={400} y={y} />
    <Skid x1={140} x2={350} y={y} />
    <path d={`M110 ${y - 62}V${y + 38}M400 ${y - 62}V${y + 38}`} stroke={muted} strokeWidth="1.6" strokeDasharray="4 5" />
    <Tag x={110} y={y - 76} text="brakes on" colour={muted} />
    <Tag x={400} y={y - 76} text="stopped" colour={ink} />
    <Bracket x1={110} x2={400} y={y + 50} label="braking distance" colour={force} size={15} />
  </PhysicsDiagram>
}

function Speed() {
  const rows = [{ y: 104, dist: 150, name: 'slow' }, { y: 232, dist: 330, name: 'fast' }]
  return <PhysicsDiagram title="Two cars with the same braking force. The slow car stops after a short braking distance; the fast car needs a much longer one.">
    {rows.map(r => <g key={r.name}>
      <Road y={r.y} />
      <BrakingCar x={80 + r.dist} y={r.y} s={0.8} />
      <Arrow from={[80 + r.dist - 4, r.y - 50]} to={[80 + r.dist - 54, r.y - 50]} colour={force} width={4} />
      <path d={`M80 ${r.y - 34}V${r.y + 6}`} stroke={muted} strokeWidth="1.6" strokeDasharray="4 5" />
      <Tag x={40} y={r.y - 40} text={r.name} colour={ink} />
      <Bracket x1={80} x2={80 + r.dist} y={r.y + 36} colour={force} />
    </g>)}
    <Lines x={400} y={40} anchor="middle" lines={['same braking force']} size={14} colour={force} />
    <Lines x={80 + 75} y={176} anchor="middle" lines={['short']} size={13} colour={force} />
    <Lines x={80 + 165} y={298} anchor="middle" lines={['long']} size={13} colour={force} />
  </PhysicsDiagram>
}

function RoadSurface() {
  const y = 196
  return <PhysicsDiagram title="Water, ice, oil and leaves on the road all reduce the grip between the tyres and the road, so a braking car can skid.">
    <Road y={y} />
    <Patch x={62} y={y} w={74} kind="water" />
    <Patch x={150} y={y} w={66} kind="ice" />
    <Patch x={234} y={y} w={66} kind="oil" />
    <Patch x={322} y={y} w={74} kind="leaves" />
    <Skid x1={206} x2={420} y={y + 8} />
    <BrakingCar x={450} y={y} s={1.15} />
    <Tag x={450} y={96} text="less grip" colour={force} />
    <path d={`M450 108V${y - 62}`} stroke={force} strokeWidth="1.5" />
    <Lines x={270} y={264} anchor="middle" lines={['the tyres skid, so the car takes longer to stop']} size={13} weight={600} colour={muted} />
    <Lines x={180} y={100} anchor="middle" lines={['slippery road']} size={16} />
  </PhysicsDiagram>
}

/** A tyre seen from the side, sitting on a wet road; tread grooves drawn round its edge when `tread`. */
function TyreClose({ cx, cy, tread }: { cx: number; cy: number; tread: boolean }) {
  const R = 62, grooves = Array.from({ length: 24 }, (_, i) => i * 15)
  return <g>
    <circle cx={cx} cy={cy} r={R} fill={tyre} stroke={tyreLine} strokeWidth="2" />
    {tread && grooves.map(a => {
      const t = a * Math.PI / 180, x1 = cx + Math.cos(t) * (R - 8), y1 = cy + Math.sin(t) * (R - 8), x2 = cx + Math.cos(t) * (R + 0.5), y2 = cy + Math.sin(t) * (R + 0.5)
      return <path key={a} d={`M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`} stroke="white" strokeWidth="4" strokeLinecap="butt" />
    })}
    <circle cx={cx} cy={cy} r={R - 20} fill={metal} stroke={metalLine} strokeWidth="2" />
    <circle cx={cx} cy={cy} r={8} fill={metalLine} />
  </g>
}
function Tyres() {
  const ground = 214
  return <PhysicsDiagram title="Left: a new tyre with deep grooves pushes the water out from under it and grips the road. Right: a bald tyre has no grooves, so it rides on a layer of water and skids.">
    {[0, 1].map(i => {
      const cx = 135 + i * 270, bald = i === 1
      return <g key={i}>
        <rect x={cx - 120} y={ground} width={240} height={22} rx="6" fill={road} />
        <path d={`M${cx - 120} ${ground}H${cx + 120}`} stroke={roadLine} strokeWidth="2" />
        {/* the water film on the road; under the bald tyre it stays as a layer */}
        <path d={`M${cx - 120} ${ground - 4}H${cx + 120}V${ground}H${cx - 120}Z`} fill={P.water} />
        <TyreClose cx={cx} cy={ground - 62 - (bald ? 6 : 0)} tread={!bald} />
        {bald && <path d={`M${cx - 60} ${ground - 4}Q${cx} ${ground - 14} ${cx + 60} ${ground - 4}V${ground}H${cx - 60}Z`} fill={P.water} stroke={P.waterLine} strokeWidth="1.8" />}
        {bald && <Lines x={cx + 96} y={ground - 16} lines={['water']} size={12} colour={P.waterLine} />}
        {!bald && [[-92, -40], [-100, -24], [92, -40], [100, -24]].map(([dx, dy], k) => <circle key={k} cx={cx + dx} cy={ground + dy} r="3.2" fill={P.water} stroke={P.waterLine} strokeWidth="1.4" />)}
        {!bald && <g>
          <Arrow from={[cx - 30, ground - 8]} to={[cx - 78, ground - 30]} colour={P.waterLine} width={2.6} />
          <Arrow from={[cx + 30, ground - 8]} to={[cx + 78, ground - 30]} colour={P.waterLine} width={2.6} />
        </g>}
        <Lines x={cx} y={36} anchor="middle" lines={[bald ? 'bald tyre' : 'new tyre']} size={15} />
        <Lines x={cx} y={270} anchor="middle" lines={[bald ? 'skids on the water' : 'water pushed out']} size={14} colour={bald ? force : P.waterLine} />
        {bald ? <CrossMark x={cx + 82} y={60} /> : <Tick x={cx + 82} y={60} />}
      </g>
    })}
  </PhysicsDiagram>
}

/** A wheel close-up: tyre, a brake disc inside it and a brake pad (in its holder) gripping the disc at the top right. */
function Wheel({ cx, cy, R = 78, hot = 0, pad = 'new', squeeze = false, dim = false }: { cx: number; cy: number; R?: number; hot?: number; pad?: 'new' | 'worn'; squeeze?: boolean; dim?: boolean }) {
  const d = R * 0.62, a = -40 * Math.PI / 180
  const px = cx + Math.cos(a) * (d - 6), py = cy + Math.sin(a) * (d - 6)
  const padT = pad === 'new' ? 11 : 4
  return <g opacity={dim ? 0.35 : 1}>
    {hot > 0 && <circle cx={cx} cy={cy} r={R + 16} fill={P.thermal} opacity={0.35 * hot} />}
    <circle cx={cx} cy={cy} r={R} fill={tyre} stroke={tyreLine} strokeWidth="2" />
    <circle cx={cx} cy={cy} r={R - 16} fill="#eef2f5" stroke={metalLine} strokeWidth="2" />
    {/* brake disc */}
    <circle cx={cx} cy={cy} r={d} fill={hot > 0 ? '#f6c1b4' : '#c9d3db'} stroke={hot > 0 ? P.thermalLine : metalLine} strokeWidth="2.2" />
    {[0, 60, 120, 180, 240, 300].map(k => { const t = k * Math.PI / 180; return <circle key={k} cx={cx + Math.cos(t) * d * 0.62} cy={cy + Math.sin(t) * d * 0.62} r="3.4" fill="white" stroke={metalLine} strokeWidth="1.2" /> })}
    <circle cx={cx} cy={cy} r={d * 0.3} fill={metal} stroke={metalLine} strokeWidth="2" />
    {/* pad holder (calliper) with the pad against the disc edge */}
    <g transform={`translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(50)`}>
      <rect x={-22} y={-20 - (squeeze ? 0 : 3)} width={44} height={16} rx="6" fill="#f0d9a8" stroke="#a57a45" strokeWidth="2" />
      <rect x={-18} y={-4 - padT + (squeeze ? padT : padT - 2)} width={36} height={padT} rx="2" fill="#8a6443" stroke="#5f4430" strokeWidth="1.4" />
    </g>
  </g>
}
function Brakes() {
  return <PhysicsDiagram title="Left: new brake pads are thick and can push on the disc with a big force. Right: worn pads are thin and push with a small force, so the car takes longer to stop.">
    {(['new', 'worn'] as const).map((pad, i) => {
      const cx = 135 + i * 270, cy = 150
      const a = -40 * Math.PI / 180, tip: Pt = [cx + Math.cos(a) * 42, cy + Math.sin(a) * 42]
      const from: Pt = [cx + Math.cos(a) * 118, cy + Math.sin(a) * 118]
      return <g key={pad}>
        <Wheel cx={cx} cy={cy} pad={pad} squeeze />
        <Arrow from={from} to={tip} colour={force} width={pad === 'new' ? 7 : 2.4} head={pad === 'new' ? 0.75 : 1} />
        <Lines x={cx} y={36} anchor="middle" lines={[pad === 'new' ? 'new pads' : 'worn pads']} size={15} />
        <Lines x={cx} y={262} anchor="middle" lines={[pad === 'new' ? 'big force' : 'small force']} size={15} colour={force} />
        <Lines x={cx} y={282} anchor="middle" lines={[pad === 'new' ? 'stops sooner' : 'longer to stop']} size={13} weight={600} colour={muted} />
      </g>
    })}
  </PhysicsDiagram>
}

/* ---------- Section 3: what the brakes do to energy ---------- */

function PressArrows({ cx, cy }: { cx: number; cy: number }) {
  const a = -40 * Math.PI / 180, tip: Pt = [cx + Math.cos(a) * 44, cy + Math.sin(a) * 44], from: Pt = [cx + Math.cos(a) * 110, cy + Math.sin(a) * 110]
  return <Arrow from={from} to={tip} colour={force} width={4} />
}
/** Small curved rubbing arrows along the disc edge beside the pad. */
function Rub({ cx, cy }: { cx: number; cy: number }) {
  const r = 52
  const arc = (a0: number, a1: number) => { const p0 = [cx + Math.cos(a0) * r, cy + Math.sin(a0) * r], p1 = [cx + Math.cos(a1) * r, cy + Math.sin(a1) * r]; return `M${p0[0].toFixed(1)} ${p0[1].toFixed(1)}A${r} ${r} 0 0 1 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}` }
  const a0 = -95 * Math.PI / 180, a1 = -62 * Math.PI / 180, b0 = -20 * Math.PI / 180, b1 = 12 * Math.PI / 180
  const end = (t: number): Pt => [cx + Math.cos(t) * r, cy + Math.sin(t) * r]
  return <g stroke={P.thermalLine} strokeWidth="2.6" fill="none">
    <path d={arc(a0, a1)} strokeWidth="3.4" />
    <path d={arc(b0, b1)} strokeWidth="3.4" />
    {[end(a0), end(b1)].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="2.4" fill={P.thermalLine} stroke="none" />)}
  </g>
}
function Friction() {
  const cx = 170, cy = 150
  return <PhysicsDiagram title="A wheel with its brake disc. Pressing the brake pedal squeezes the brake pad onto the disc, and friction acts where they rub.">
    <Wheel cx={cx} cy={cy} squeeze />
    <PressArrows cx={cx} cy={cy} />
    <Rub cx={cx} cy={cy} />
    <Lines x={300} y={48} lines={['pad pressed on wheel']} size={15} colour={force} />
    <path d="M296 46L258 76" stroke={force} strokeWidth="1.5" />
    <Lines x={340} y={150} lines={['friction']} size={17} colour={P.thermalLine} />
    <path d="M336 146L226 146" stroke={P.thermalLine} strokeWidth="1.5" />
    <Lines x={340} y={200} lines={['friction does work,', 'so energy is transferred']} size={13} weight={600} colour={muted} />
  </PhysicsDiagram>
}
function Transfer() {
  return <PhysicsDiagram schematic={false} title="Energy is transferred from the kinetic energy store of the car to the thermal energy stores of the brakes. The work is done by friction.">
    <Car x={120} y={140} s={1.1} />
    <Motion x={58} y={116} dir={1} />
    <EnergyStoreBadge store="kinetic" x={120} y={190} label="Kinetic (car)" />
    <Wheel cx={420} cy={100} R={56} hot={0.6} squeeze />
    <EnergyStoreBadge store="thermal" x={420} y={190} label="Thermal (brakes)" />
    <TransferArrow from={[200, 196]} to={[334, 196]} bend={-0.3} colour={P.thermalLine} width={4} />
    <Lines x={270} y={256} anchor="middle" lines={['work done by friction']} size={15} colour={P.thermalLine} />
    <Lines x={270} y={282} anchor="middle" lines={['energy is not lost: it moves to another store']} size={13} weight={600} colour={muted} />
  </PhysicsDiagram>
}
function Hot() {
  const cx = 170, cy = 150
  return <PhysicsDiagram title="After a hard stop the brakes are hot: all of the car's kinetic energy has been transferred to the thermal energy stores of the brakes.">
    <Wheel cx={cx} cy={cy} hot={1} squeeze />
    {[-1, 0, 1].map(k => <path key={k} d={`M${cx + k * 26} 58c-7 -9 7 -14 0 -23s7 -14 0 -23`} stroke={P.thermalLine} strokeWidth="2.4" fill="none" opacity=".7" />)}
    <Thermometer x={300} y={214} h={130} level={0.9} colour={P.hot} />
    <Lines x={330} y={120} lines={['brakes', 'increase in', 'temperature']} size={15} colour={P.thermalLine} />
    <Lines x={330} y={222} lines={['all of the kinetic', 'energy is transferred']} size={14} />
  </PhysicsDiagram>
}

/* ---------- Section 4: why speed matters so much ---------- */

function Energy() {
  const k = P.kineticLine, w = force
  // Each symbol is placed on its own so the names underneath line up with it.
  const parts: [number, string, string][] = [[92, '½', k], [128, '×', k], [166, 'm', k], [204, '×', k], [244, 'v²', k], [292, '=', ink], [340, 'F', w], [378, '×', w], [416, 'd', w]]
  const names: [number, string[], string][] = [[166, ['mass', 'of car'], k], [244, ['speed', 'of car'], k], [340, ['braking', 'force'], w], [416, ['braking', 'distance'], w]]
  return <PhysicsDiagram schematic={false} title="Kinetic energy of the car equals the work done by the brakes: one half times mass times speed squared equals braking force times braking distance.">
    <rect x={56} y={38} width={214} height={40} rx="20" fill={P.kinetic} stroke={k} strokeWidth="2" />
    <text x={163} y={64} textAnchor="middle" fontSize="15" fontWeight="750" fill={k}>kinetic energy of car</text>
    <rect x={296} y={38} width={208} height={40} rx="20" fill="#fbe3da" stroke={w} strokeWidth="2" />
    <text x={400} y={64} textAnchor="middle" fontSize="15" fontWeight="750" fill={w}>work done by brakes</text>
    <Card x={40} y={94} w={460} h={66} />
    {parts.map(([x, t, c], i) => <text key={i} x={x} y={139} textAnchor="middle" fontSize="30" fontWeight="750" fill={c}>{t}</text>)}
    {names.map(([x, l, c]) => <g key={x}>
      <path d={`M${x} 168V188`} stroke={c} strokeWidth="1.6" />
      <Lines x={x} y={206} anchor="middle" lines={l} size={13} weight={700} colour={c} />
    </g>)}
    <Lines x={270} y={276} anchor="middle" lines={['to stop, the brakes must transfer all of the kinetic energy']} size={13} weight={600} colour={muted} />
  </PhysicsDiagram>
}

/** A row of kinetic "energy blocks": how much energy is in the store. */
function EnergyBlocks({ x, y, n }: { x: number; y: number; n: number }) {
  return <g>{Array.from({ length: n }, (_, i) => <rect key={i} x={x + i * 26} y={y} width={22} height={22} rx="6" fill={P.kinetic} stroke={P.kineticLine} strokeWidth="1.8" />)}</g>
}
function Faster() {
  return <PhysicsDiagram title="A slow car has a little kinetic energy. A faster car has much more, because the speed is squared, so much more work is needed to stop it.">
    <Road y={112} />
    <BrakingCar x={90} y={112} s={0.8} lights={false} />
    <Motion x={40} y={92} dir={1} n={2} len={14} />
    <Tag x={90} y={36} text="slow" />
    <EnergyBlocks x={190} y={76} n={1} />
    <Lines x={224} y={93} lines={['a little kinetic energy']} size={13} weight={650} colour={P.kineticLine} />
    <Road y={236} />
    <BrakingCar x={90} y={236} s={0.8} lights={false} />
    <Motion x={34} y={214} dir={1} n={3} len={30} />
    <Tag x={90} y={160} text="faster" />
    <EnergyBlocks x={190} y={200} n={9} />
    <Lines x={190} y={186} lines={['much more kinetic energy']} size={13} weight={650} colour={P.kineticLine} />
    <rect x={354} y={24} width={164} height={36} rx="18" fill="white" stroke={P.kineticLine} strokeWidth="2" />
    <text x={436} y={47} textAnchor="middle" fontSize="15" fontWeight="750" fill={P.kineticLine}>speed is squared</text>
  </PhysicsDiagram>
}
function ForceNeeded() {
  const rows = [{ y: 106, name: 'slow', len: 44, w: 3 }, { y: 230, name: 'fast', len: 110, w: 6.5 }]
  const x1 = 100, x2 = 360
  return <PhysicsDiagram title="Two cars stop in the same braking distance. The faster car has more energy, so more work is needed: it needs a bigger braking force.">
    {rows.map(r => <g key={r.name}>
      <Road y={r.y} x1={40} x2={520} />
      <BrakingCar x={x2} y={r.y} s={0.8} />
      <Arrow from={[x2 - 30, r.y - 26]} to={[x2 - 30 - r.len, r.y - 26]} colour={force} width={r.w} head={r.w > 5 ? 0.75 : 1} />
      <Tag x={470} y={r.y - 50} text={r.name} />
      <Bracket x1={x1} x2={x2} y={r.y + 36} colour={muted} />
    </g>)}
    <Lines x={x2 - 30 - 44 - 8} y={78} anchor="end" lines={['small force']} size={13} colour={force} />
    <Lines x={x2 - 30 - 110 - 8} y={200} anchor="end" lines={['big force']} size={13} colour={force} />
    <Lines x={270} y={36} anchor="middle" lines={['same distance, more work, bigger force']} size={15} />
  </PhysicsDiagram>
}
function Danger() {
  const y = 200, fx = 330 + 28 * 1.2
  return <PhysicsDiagram title="Dangers of a very large deceleration: the brakes can overheat and stop working well, and the car can skid.">
    <Road y={y} />
    <Skid x1={110} x2={300} y={y} />
    <BrakingCar x={330} y={y} s={1.2} />
    {/* front wheel glowing: the brakes are overheating */}
    <circle cx={fx} cy={y - 12} r={21} fill={P.thermal} opacity=".75" />
    <circle cx={fx} cy={y - 12} r={9} fill={P.hot} opacity=".85" />
    <rect x={40} y={40} width={176} height={58} rx="18" fill="white" stroke={ink} strokeWidth="2" />
    <Lines x={128} y={64} anchor="middle" lines={['the car skids', 'on the road']} size={14} />
    <path d={`M140 98L190 ${y + 2}`} stroke={ink} strokeWidth="1.6" />
    <rect x={330} y={40} width={176} height={58} rx="18" fill={P.hotFill} stroke={P.hot} strokeWidth="2" />
    <Lines x={418} y={64} anchor="middle" lines={['brakes overheat', 'and work less well']} size={14} colour={P.thermalLine} />
    <path d={`M420 98L${fx + 10} ${y - 30}`} stroke={P.thermalLine} strokeWidth="1.6" />
    <Lines x={270} y={270} anchor="middle" lines={['too much energy transferred too quickly']} size={13} weight={600} colour={muted} />
  </PhysicsDiagram>
}

/* ---------- Question visual: bar chart of road surfaces ---------- */

function RoadChart() {
  const GF: GraphFrame = { x: 110, y: 50, width: 360, height: 180, xMax: 3, yMax: 110 }
  const s = graphScale(GF)
  const bars: [string, number][] = [['Dry', 20], ['Wet', 40], ['Icy', 100]]
  return <PhysicsDiagram schematic={false} title="A bar chart of braking distance in metres for the same car at the same speed on three road surfaces: dry, wet and icy.">
    <GraphAxes frame={GF} xLabel="" yLabel="Braking distance" yUnit="m" yTicks={[20, 40, 60, 80, 100]} grid />
    <text x={GF.x + GF.width / 2} y={GF.y + GF.height + 46} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>Road surface</text>
    {bars.map(([name, v], i) => {
      const cx = s.x(i + 0.5)
      return <g key={name}>
        <rect x={cx - 34} y={s.y(v)} width={68} height={s.y(0) - s.y(v)} rx="5" fill="#d6dee6" stroke="#6f8494" strokeWidth="2" />
        <text x={cx} y={s.y(0) + 20} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{name}</text>
      </g>
    })}
    <text x={GF.x + GF.width} y={36} textAnchor="end" fontSize="13" fontWeight="650" fill={muted}>Same car, same speed</text>
  </PhysicsDiagram>
}

export function BrakingVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'braking-recap': return <Recap />
    case 'braking-speed': return <Speed />
    case 'braking-road': return <RoadSurface />
    case 'braking-tyres': return <Tyres />
    case 'braking-brakes': return <Brakes />
    case 'braking-friction': return <Friction />
    case 'braking-transfer': return <Transfer />
    case 'braking-hot': return <Hot />
    case 'braking-energy': return <Energy />
    case 'braking-faster': return <Faster />
    case 'braking-force': return <ForceNeeded />
    case 'braking-danger': return <Danger />
    case 'braking-q-road': return <RoadChart />
    default: return null
  }
}
