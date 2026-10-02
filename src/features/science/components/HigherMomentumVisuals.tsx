import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, type Pt } from './PhysicsKit'
import { ink, muted, r1, Tag, Caption, Card, Num, Arrow, Ball, Car, Lorry, Person, Floor, Boundary, Tick, CrossMark, good, warn } from './EnergyStoreVisuals'
import { mo } from './VtGraphVisuals'
import { Trolley } from './NewtonLawVisuals'
import { Road } from './StoppingVisuals'

/*
 * Physics P5, a lesson only some students get (Physics Lesson 52H): momentum. Original, code-native schematics; not to
 * scale. Focus ids start with 'hmom-' and are routed from CellBiologyVisuals.tsx.
 *
 * Colour code (the motion kit's, plus one new colour): mass blue, velocity green (thin arrows), momentum rose (thick
 * arrows whose length shows the size of the momentum within one picture). Right is positive unless a picture says so.
 * Each teaching section keeps one drawing and changes it frame by frame; the last frame puts it together. Every sum
 * is checked in the storyboard. Assessment views never show the answer.
 */
const mom = '#b04a6e', momFill = '#f9e1ea'
const faded = 0.3

function T({ x, y, children, size = 14, colour = ink, bold = true, anchor = 'middle' }: { x: number; y: number; children: ReactNode; size?: number; colour?: string; bold?: boolean; anchor?: 'start' | 'middle' | 'end' }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={Math.max(12, size)} fontWeight={bold ? 700 : 500} fill={colour}>{children}</text>
}
/** A thin green velocity arrow with its value above it. */
function Vel({ x, y, len, dir = 1, label }: { x: number; y: number; len: number; dir?: number; label: string }) {
  return <g>
    <Arrow from={[x, y]} to={[x + dir * len, y]} colour={mo.velocity} width={3} />
    <T x={x + dir * len / 2} y={y - 10} size={13} colour={mo.velocity}>{label}</T>
  </g>
}
/** A thick rose momentum arrow. Its label sits under the arrow (or above). */
function Mom({ x, y, len, dir = 1, label, at = 'below', dim = false }: { x: number; y: number; len: number; dir?: number; label?: string; at?: 'below' | 'above' | 'none'; dim?: boolean }) {
  return <g opacity={dim ? faded : 1}>
    <Arrow from={[x, y]} to={[x + dir * len, y]} colour={mom} width={7} />
    {label && at !== 'none' && <T x={x + dir * len / 2} y={at === 'below' ? y + 24 : y - 12} size={13} colour={mom}>{label}</T>}
  </g>
}
/** A rounded chip with centred text, in one colour. */
function Chip({ x, y, w, text, colour = ink, fill = 'white', size = 14 }: { x: number; y: number; w: number; text: string; colour?: string; fill?: string; size?: number }) {
  return <g><rect x={r1(x - w / 2)} y={y - 15} width={w} height={30} rx="12" fill={fill} stroke={colour} strokeWidth="1.8" />
    <T x={x} y={y + 5} size={size} colour={colour}>{text}</T></g>
}
function MassTag({ x, y, text }: { x: number; y: number; text: string }) {
  return <Tag x={x} y={y} text={text} colour={mo.mass} fill={mo.massFill} />
}
function Ice({ y, x1 = 20, x2 = 520 }: { y: number; x1?: number; x2?: number }) {
  return <g><rect x={x1} y={y} width={x2 - x1} height={14} rx="7" fill="#e6f2f9" /><path d={`M${x1} ${y}H${x2}`} stroke="#9cc5dd" strokeWidth="2" /></g>
}
/** A delivery van facing right; (x, y) is the road under its middle. */
function Van({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-58 -14V-66Q-58 -72 -52 -72H22Q30 -72 34 -64L46 -40Q58 -38 58 -26V-14Q58 -10 54 -10H-54Q-58 -10 -58 -14Z" fill="#f3e3b5" stroke="#a5822e" strokeWidth="2.2" />
    <path d="M26 -64L40 -40H22V-64Z" fill="#e8f4fb" stroke="#a5822e" strokeWidth="1.6" />
    <path d="M14 -70V-12" stroke="#a5822e" strokeWidth="1.4" opacity=".6" />
    {[-36, 36].map(wx => <g key={wx}><circle cx={wx} cy="-10" r="10" fill="#4f5d69" stroke="#33404b" strokeWidth="1.6" /><circle cx={wx} cy="-10" r="4" fill="#dfe5ea" /></g>)}
  </g>
}

/* ---------- Section 2: what is momentum? Two lanes of traffic ---------- */

type Lane = { kind: 'car' | 'lorry' | 'parked'; mass: string; v: number; p: number; dir?: 1 | -1; pText: string }
const P_SCALE = 0.0075 // px per kg m/s: 10 000 → 75 px, 40 000 → 300 px
function LaneRow({ road, lane, carColour }: { road: number; lane: Lane; carColour?: [string, string] }) {
  const dir = lane.dir ?? 1
  const vx = dir === 1 ? 120 : 420
  const start = dir === 1 ? 200 : 340
  const tall = lane.kind === 'lorry' ? 92 : 64
  return <g>
    <Road y={road} />
    {lane.kind === 'lorry' ? <Lorry x={vx} y={road} /> : <Car x={vx} y={road} flip={dir === -1} fill={carColour?.[0]} line={carColour?.[1]} />}
    <MassTag x={vx} y={road - tall} text={lane.mass} />
    {lane.v > 0
      ? <Vel x={start} y={road - 66} len={lane.v * 6} dir={dir} label={`${lane.v} m/s`} />
      : <T x={start + 30} y={road - 60} size={13} colour={mo.velocity}>0 m/s (parked)</T>}
    {lane.p !== 0
      ? <Mom x={start} y={road - 30} len={Math.abs(lane.p) * P_SCALE} dir={dir} at="none" />
      : <circle cx={start + 4} cy={road - 30} r="5" fill={mom} />}
    <T x={start} y={road + 32} size={14} colour={mom} anchor={dir === 1 ? 'start' : 'end'}>{lane.pText}</T>
  </g>
}
const car10: Lane = { kind: 'car', mass: '1000 kg', v: 10, p: 10000, pText: 'momentum = 10 000 kg m/s' }
function TrafficScene({ stage }: { stage: 'moving' | 'mass' | 'speed' | 'equation' | 'vector' }) {
  const lanes: Record<typeof stage, [Lane, Lane | null]> = {
    moving: [{ kind: 'parked', mass: '1000 kg', v: 0, p: 0, pText: 'momentum = 0' }, car10],
    mass: [car10, { kind: 'lorry', mass: '4000 kg', v: 10, p: 40000, pText: 'momentum = 40 000 kg m/s' }],
    speed: [car10, { kind: 'car', mass: '1000 kg', v: 20, p: 20000, pText: 'momentum = 20 000 kg m/s' }],
    equation: [car10, null],
    vector: [{ ...car10, pText: 'momentum = +10 000 kg m/s' }, { kind: 'car', mass: '1000 kg', v: 10, p: -10000, dir: -1, pText: 'momentum = −10 000 kg m/s' }],
  }
  const titles: Record<typeof stage, string> = {
    moving: 'Two lanes of road. Top: a parked 1000 kg car, 0 m/s, momentum 0. Bottom: the same car moving at 10 m/s, with a rose momentum arrow: 10 000 kg m/s.',
    mass: 'Top: a 1000 kg car at 10 m/s, momentum 10 000 kg m/s. Bottom: a 4000 kg lorry at 10 m/s, with a momentum arrow four times as long: 40 000 kg m/s.',
    speed: 'Top: a 1000 kg car at 10 m/s, momentum 10 000 kg m/s. Bottom: the same car at 20 m/s, with a momentum arrow twice as long: 20 000 kg m/s.',
    equation: 'A 1000 kg car at 10 m/s. Below it, the equation p = m v: momentum in kg m/s equals mass in kg times velocity in m/s. 1000 × 10 = 10 000 kg m/s.',
    vector: 'Right is positive. Top: a 1000 kg car moving right at 10 m/s, momentum +10 000 kg m/s. Bottom: the same car moving left at 10 m/s, momentum −10 000 kg m/s, arrow pointing left.',
  }
  const [a, b] = lanes[stage]
  const red: [string, string] = ['#f2b8a8', '#b4553f']
  return <PhysicsDiagram title={titles[stage]} viewBox="0 0 540 310">
    {stage === 'vector' && <g><T x={500} y={22} size={13} anchor="end" colour={muted}>positive direction</T><Arrow from={[420, 32]} to={[500, 32]} colour={muted} width={2.4} /></g>}
    <LaneRow road={124} lane={a} />
    {b ? <LaneRow road={262} lane={b} carColour={stage === 'speed' || stage === 'vector' ? red : undefined} /> : <g>
      <Card x={40} y={170} w={460} h={126} hot />
      <T x={270} y={210} size={30} colour={mom}>p = m v</T>
      <T x={270} y={244} size={15}><tspan fill={mom}>momentum (kg m/s)</tspan> = <tspan fill={mo.mass}>mass (kg)</tspan> × <tspan fill={mo.velocity}>velocity (m/s)</tspan></T>
      <T x={270} y={278} size={15}>1000 × 10 = <tspan fill={mom}>10 000 kg m/s</tspan></T>
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 3: calculating momentum. Skateboarder and a working card ---------- */

function Skateboarder({ x, y, top, topLine, dim = false }: { x: number; y: number; top?: string; topLine?: string; dim?: boolean }) {
  return <g opacity={dim ? faded : 1}>
    <Person x={x} y={y - 15} s={1.15} lean={3} top={top} topLine={topLine} arms={[[[-16, -50], [-34, -44]], [[18, -52], [36, -46]]]} legs={[[[-9, -16], [-14, 0]], [[8, -16], [13, 0]]]} />
    <path d={`M${x - 40} ${y - 15}H${x + 40}Q${x + 48} ${y - 15} ${x + 50} ${y - 22}`} stroke="#8a6443" strokeWidth="5" fill="none" />
    <path d={`M${x - 40} ${y - 15}Q${x - 48} ${y - 15} ${x - 50} ${y - 22}`} stroke="#8a6443" strokeWidth="5" fill="none" />
    {[-26, 26].map(dx => <circle key={dx} cx={x + dx} cy={y - 6} r="5.5" fill="#4f5d69" stroke="#33404b" strokeWidth="1.4" />)}
  </g>
}
function CalcScene({ stage }: { stage: 'equation' | 'p' | 'v' | 'm' | 'together' }) {
  const second = stage === 'm'
  const mass = stage === 'm' ? 'm = ?' : '50 kg'
  const vel = stage === 'v' ? 'v = ?' : '4 m/s'
  const lines: Record<typeof stage, [string, string?][]> = {
    equation: [['p = m × v', mom]],
    p: [['p = m × v'], ['p = 50 × 4'], ['p = 200 kg m/s', mom]],
    v: [['p = 300 kg m/s', mom], ['v = p ÷ m'], ['v = 300 ÷ 50'], ['v = 6 m/s', mo.velocity]],
    m: [['p = 240 kg m/s', mom], ['m = p ÷ v'], ['m = 240 ÷ 4'], ['m = 60 kg', mo.mass]],
    together: [],
  }
  const titles: Record<typeof stage, string> = {
    equation: 'A skateboarder rolling forwards, labelled mass and velocity. A card shows p = m × v, with units: p in kg m/s, m in kg, v in m/s.',
    p: 'A 50 kg skateboarder rolling at 4 m/s. The card: p = m × v = 50 × 4 = 200 kg m/s.',
    v: 'The 50 kg skateboarder with 300 kg m/s of momentum and an unknown velocity. The card: v = p ÷ m = 300 ÷ 50 = 6 m/s.',
    m: 'A second skateboarder with unknown mass rolling at 4 m/s with 240 kg m/s of momentum. The card: m = p ÷ v = 240 ÷ 4 = 60 kg.',
    together: 'The three ways round the momentum equation: find p with p = m × v; find v with v = p ÷ m; find m with m = p ÷ v. Finish with the unit.',
  }
  return <PhysicsDiagram title={titles[stage]} viewBox="0 0 540 300">
    <Floor x1={16} x2={226} y={238} />
    <Skateboarder x={104} y={238} top={second ? '#cfe6c2' : undefined} topLine={second ? '#4f8f5a' : undefined} dim={stage === 'together'} />
    <g opacity={stage === 'together' ? faded : 1}>
      <MassTag x={104} y={98} text={stage === 'equation' ? 'mass, m' : mass} />
      <Vel x={160} y={150} len={56} label={stage === 'equation' ? 'velocity, v' : vel} />
    </g>
    <Card x={244} y={28} w={280} h={244} hot={stage !== 'together'} />
    {stage === 'equation' && <g>
      <T x={384} y={92} size={30} colour={mom}>p = m × v</T>
      <Chip x={384} y={146} w={220} text="p: momentum in kg m/s" colour={mom} fill={momFill} size={14} />
      <Chip x={384} y={190} w={220} text="m: mass in kg" colour={mo.mass} fill={mo.massFill} size={14} />
      <Chip x={384} y={234} w={220} text="v: velocity in m/s" colour={mo.velocity} fill={mo.velocityFill} size={14} />
    </g>}
    {(stage === 'p' || stage === 'v' || stage === 'm') && <g>
      <T x={384} y={62} size={14} colour={muted}>{stage === 'p' ? 'find the momentum' : stage === 'v' ? 'find the velocity' : 'find the mass'}</T>
      {lines[stage].map(([l, c], i) => {
        const last = i === lines[stage].length - 1
        return <T key={i} x={272} y={106 + i * 44} anchor="start" size={last ? 22 : 20} colour={c ?? ink}>{l}</T>
      })}
      <Tick x={496} y={100 + (lines[stage].length - 1) * 44} s={0.9} />
    </g>}
    {stage === 'together' && <g>
      <T x={384} y={62} size={14} colour={muted}>one equation, three ways round</T>
      {[['find p:', 'p = m × v', mom], ['find v:', 'v = p ÷ m', mo.velocity], ['find m:', 'm = p ÷ v', mo.mass]].map(([a, b, c], i) => <g key={i}>
        <T x={268} y={110 + i * 50} anchor="start" size={15} colour={muted}>{a}</T>
        <T x={340} y={110 + i * 50} anchor="start" size={22} colour={c}>{b}</T>
      </g>)}
      <T x={384} y={256} size={13} colour={muted}>units: kg m/s · kg · m/s</T>
    </g>}
  </PhysicsDiagram>
}

/** The worked example: a rowing boat and a four-line working card. */
function WorkedBoat() {
  const steps = ['p = m × v', 'v = p ÷ m', 'v = 600 ÷ 200', 'v = 3 m/s']
  return <PhysicsDiagram title="A rowing boat with its rower, total mass 200 kg, momentum 600 kg m/s. Working: p = m × v; v = p ÷ m; v = 600 ÷ 200; v = 3 m/s." viewBox="0 0 540 290">
    <rect x={16} y={176} width={220} height={60} rx="12" fill={P.water} opacity=".55" />
    <path d={`M16 176Q60 170 104 176T192 176T236 176`} stroke={P.waterLine} strokeWidth="2" fill="none" />
    <g transform="translate(118 176)">
      <path d="M-78 -20H82Q78 6 52 10H-52Q-74 6 -78 -20Z" fill="#e8cfa6" stroke="#a57a45" strokeWidth="2.4" />
      <path d="M-62 -10H66" stroke="#a57a45" strokeWidth="1.4" opacity=".6" />
    </g>
    <Person x={112} y={150} s={0.95} lean={-6} arms={[[[-10, -48], [-26, -40]], [[-8, -46], [-24, -38]]]} legs={[[[14, -30], [26, -14]], [[12, -28], [24, -12]]]} />
    <path d="M86 116L46 214" stroke="#a57a45" strokeWidth="3.4" />
    <ellipse cx={42} cy={222} rx="7" ry="13" fill="#e8cfa6" stroke="#a57a45" strokeWidth="1.8" transform="rotate(22 42 222)" />
    <MassTag x={124} y={44} text="200 kg" />
    <Mom x={74} y={262} len={100} label="p = 600 kg m/s" at="none" />
    <T x={124} y={252} size={13} colour={mom}>600 kg m/s</T>
    <Card x={258} y={24} w={266} h={242} hot />
    <T x={391} y={52} size={14} colour={muted}>find the velocity</T>
    {steps.map((s, i) => <g key={i}>
      <Num n={i + 1} x={286} y={94 + i * 48} state={i === steps.length - 1 ? 'active' : 'on'} colour={i === steps.length - 1 ? good : ink} />
      <T x={308} y={100 + i * 48} anchor="start" size={20} colour={i === steps.length - 1 ? good : ink}>{s}</T>
    </g>)}
  </PhysicsDiagram>
}

/* ---------- Section 4: momentum before = momentum after. Two trolleys on a track ---------- */

function Track({ y, x1 = 24, x2 = 516 }: { y: number; x1?: number; x2?: number }) {
  return <g><rect x={x1} y={y} width={x2 - x1} height={10} rx="5" fill={P.panel} stroke={P.panelLine} strokeWidth="1.6" /></g>
}
function Pad({ x, y }: { x: number; y: number }) {
  return <rect x={x - 4} y={y - 38} width={8} height={20} rx="2.5" fill="#f3d27a" stroke="#b78a1c" strokeWidth="1.4" />
}
function CollisionScene({ stage }: { stage: 'closed' | 'before' | 'after' | 'stick' }) {
  const y = 196
  const after = stage === 'after', stick = stage === 'stick'
  const ax = after ? 196 : stick ? 238 : 130, bx = after ? 392 : stick ? 326 : 330
  const titles: Record<typeof stage, string> = {
    closed: 'Two lab trolleys on a smooth level track inside a dashed line labelled closed system: trolley A, 2 kg, moving right at 3 m/s, and trolley B, 1 kg, standing still. No outside forces.',
    before: 'Before the collision. Trolley A, 2 kg at 3 m/s: momentum 2 × 3 = 6 kg m/s. Trolley B, 1 kg, still: momentum 0. Total before = 6 kg m/s.',
    after: 'After the collision. Trolley A, 2 kg, moves on at 1 m/s: momentum 2 kg m/s. Trolley B, 1 kg, moves off at 4 m/s: momentum 4 kg m/s. Total after = 6 kg m/s, the same as before.',
    stick: 'Sticky pads join the trolleys. After the collision A and B move together: 3 kg, momentum 6 kg m/s, velocity 6 ÷ 3 = 2 m/s.',
  }
  return <PhysicsDiagram title={titles[stage]} viewBox="0 0 540 310">
    <Track y={y} />
    {stage === 'closed' && <Boundary x={36} y={70} w={468} h={150} label="closed system" />}
    <Trolley x={ax} y={y} load={2} />
    <Trolley x={bx} y={y} load={1} />
    {stick && <Pad x={(ax + bx) / 2} y={y} />}
    {stick
      ? <g><MassTag x={(ax + bx) / 2} y={112} text="A + B: 3 kg" /><Vel x={bx + 52} y={156} len={40} label="2 m/s" /></g>
      : <g>
        <MassTag x={ax} y={112} text="A: 2 kg" />
        <MassTag x={bx} y={112} text="B: 1 kg" />
        <Vel x={ax + 50} y={156} len={after ? 20 : 60} label={after ? '1 m/s' : '3 m/s'} />
        {after ? <Vel x={bx + 50} y={156} len={66} label="4 m/s" /> : <T x={bx + 74} y={160} size={13} colour={mo.velocity}>still</T>}
      </g>}
    {stage === 'closed' && <Caption text="No outside forces act on the two trolleys." y={262} />}
    {stage === 'before' && <g>
      <T x={ax} y={236} size={14} colour={mom}>2 × 3 = 6 kg m/s</T>
      <T x={bx} y={236} size={14} colour={mom}>1 × 0 = 0</T>
      <Chip x={270} y={276} w={260} text="total before = 6 kg m/s" colour={mom} fill={momFill} />
    </g>}
    {after && <g>
      <T x={ax} y={236} size={14} colour={mom}>2 × 1 = 2 kg m/s</T>
      <T x={bx} y={236} size={14} colour={mom}>1 × 4 = 4 kg m/s</T>
      <Chip x={270} y={276} w={300} text="total after = 2 + 4 = 6 kg m/s" colour={mom} fill={momFill} />
      <Tick x={442} y={276} />
    </g>}
    {stick && <g>
      <Chip x={110} y={42} w={190} text="before: 6 kg m/s" colour={mom} fill={momFill} size={13} />
      <T x={282} y={238} size={14} colour={mom}>after: p = 6 kg m/s, m = 3 kg</T>
      <Chip x={282} y={276} w={250} text="v = p ÷ m = 6 ÷ 3 = 2 m/s" colour={mo.velocity} fill={mo.velocityFill} />
    </g>}
  </PhysicsDiagram>
}
function CollisionTogether() {
  return <PhysicsDiagram title="Before: trolley A, 2 kg at 3 m/s, total 6 kg m/s. Two ways it can end. Bounce: A at 1 m/s and B at 4 m/s, 2 + 4 = 6 kg m/s. Stick: A and B together, 3 kg at 2 m/s, 3 × 2 = 6 kg m/s. Before = after in both." viewBox="0 0 540 330">
    <Chip x={270} y={26} w={340} text="before: 2 kg × 3 m/s = 6 kg m/s" colour={mom} fill={momFill} />
    {[{ y: 152, label: 'bounce' }, { y: 286, label: 'stick' }].map(({ y, label }) => <g key={label}>
      <T x={24} y={y - 34} anchor="start" size={15} colour={muted}>{label}</T>
      <Track y={y} x1={20} x2={330} />
    </g>)}
    <g transform="translate(0 0)">
      <Trolley x={130} y={152} load={2} s={0.8} />
      <Trolley x={250} y={152} load={1} s={0.8} />
      <Vel x={154} y={86} len={16} label="1 m/s" />
      <Vel x={274} y={86} len={56} label="4 m/s" />
    </g>
    <Trolley x={150} y={286} load={2} s={0.8} />
    <Trolley x={220} y={286} load={1} s={0.8} />
    <Pad x={185} y={286} />
    <Vel x={250} y={222} len={32} label="2 m/s" />
    <Card x={346} y={92} w={180} h={70} />
    <T x={436} y={124} size={15} colour={mom}>2 + 4 = 6 kg m/s</T>
    <T x={436} y={148} size={13} colour={muted}>same as before</T>
    <Card x={346} y={226} w={180} h={70} />
    <T x={436} y={258} size={15} colour={mom}>3 × 2 = 6 kg m/s</T>
    <T x={436} y={282} size={13} colour={muted}>more mass, slower</T>
  </PhysicsDiagram>
}

/* ---------- Section 5: explosions and recoil. A skater throws a heavy ball ---------- */

function IceScene({ stage }: { stage: 'zero' | 'throw' | 'recoil' | 'together' }) {
  const y = 214
  const held = stage === 'zero'
  const sx = stage === 'recoil' || stage === 'together' ? 196 : 220
  const titles: Record<typeof stage, string> = {
    zero: 'A 60 kg skater stands still on smooth ice holding a 5 kg ball. Nothing is moving, so the total momentum is zero.',
    throw: 'The skater has thrown the ball forwards. The 5 kg ball moves right at 6 m/s: momentum +30 kg m/s. The total must still be zero, so the skater’s momentum is a question mark.',
    recoil: 'The skater recoils: momentum −30 kg m/s, an arrow to the left the same length as the ball’s. Velocity 30 ÷ 60 = 0.5 m/s backwards.',
    together: 'Put together: the ball has +30 kg m/s and the skater −30 kg m/s. Equal size, opposite directions, so +30 + (−30) = 0. The heavier skater moves more slowly.',
  }
  return <PhysicsDiagram title={titles[stage]} viewBox="0 0 540 310">
    <Ice y={y} />
    <Person x={sx} y={y - 4} s={1.2} lean={held ? 2 : -4} top="#e4d6f2" topLine="#7a56a6"
      arms={held ? [[[16, -54], [30, -58]], [[14, -50], [28, -54]]] : [[[16, -58], [34, -66]], [[14, -54], [32, -62]]]}
      legs={held ? undefined : [[[-8, -16], [-16, 0]], [[6, -16], [10, 0]]]} />
    <path d={`M${sx - 24} ${y - 2}H${sx + 20}`} stroke="#7d8e9c" strokeWidth="2.4" />
    <Ball x={held ? sx + 44 : 410} y={held ? y - 70 : y - 80} r={15} fill={P.gravitational} line={P.gravitationalLine} seam={false} />
    <MassTag x={sx} y={y - 140} text="skater 60 kg" />
    <MassTag x={held ? sx + 120 : 410} y={held ? y - 112 : y - 122} text="ball 5 kg" />
    {held && <Chip x={270} y={272} w={280} text="total momentum = 0" colour={mom} fill={momFill} />}
    {!held && <g>
      <Vel x={432} y={y - 80} len={60} label="6 m/s" />
      <Mom x={380} y={y - 30} len={90} label="+30 kg m/s" />
    </g>}
    {stage === 'throw' && <g>
      <T x={sx - 60} y={y - 30} size={22} colour={mom}>?</T>
      <Chip x={270} y={282} w={330} text="total after must still be 0" colour={mom} fill={momFill} />
    </g>}
    {(stage === 'recoil' || stage === 'together') && <g>
      <Mom x={sx - 34} y={y - 30} len={90} dir={-1} label="−30 kg m/s" />
      <Vel x={sx - 56} y={y - 80} len={30} dir={-1} label="0.5 m/s" />
    </g>}
    {stage === 'recoil' && <Chip x={270} y={282} w={300} text="v = 30 ÷ 60 = 0.5 m/s back" colour={mo.velocity} fill={mo.velocityFill} />}
    {stage === 'together' && <Chip x={270} y={282} w={330} text="+30 + (−30) = 0 kg m/s" colour={mom} fill={momFill} />}
  </PhysicsDiagram>
}

/* ---------- Question diagrams ---------- */

function Stone({ x, y, colour = '#c0504a' }: { x: number; y: number; colour?: string }) {
  return <g>
    <ellipse cx={x} cy={y - 14} rx="30" ry="14" fill="#c9d1d8" stroke="#6b7a87" strokeWidth="2" />
    <ellipse cx={x} cy={y - 20} rx="28" ry="9" fill="#dfe5ea" stroke="#6b7a87" strokeWidth="1.4" />
    <path d={`M${x - 10} ${y - 22}V${y - 32}H${x + 14}`} stroke={colour} strokeWidth="5" fill="none" />
  </g>
}
function StonesQuestion({ assessment }: { assessment: boolean }) {
  return <PhysicsDiagram schematic={false} viewBox={`0 0 540 ${assessment ? 290 : 326}`} title={assessment
    ? 'Two curling stones on smooth ice, both 20 kg. Before: stone A moves right at 3 m/s towards stone B, which is still. After: stone A moves right at 1 m/s and stone B moves right at an unknown velocity.'
    : 'The worked answer: before, A has 20 × 3 = 60 kg m/s and B has 0, total 60. After, A has 20 × 1 = 20 kg m/s, so B has 60 − 20 = 40 kg m/s.'}>
    {[{ y: 120, label: 'before' }, { y: 250, label: 'after' }].map(({ y, label }) => <g key={label}>
      <T x={24} y={y - 82} anchor="start" size={15} colour={muted}>{label}</T>
      <Ice y={y} />
    </g>)}
    <Stone x={120} y={120} /><Stone x={340} y={120} colour="#d6a21c" />
    <MassTag x={120} y={56} text="A: 20 kg" /><MassTag x={340} y={56} text="B: 20 kg" />
    <Vel x={160} y={100} len={60} label="3 m/s" />
    <T x={400} y={104} size={13} colour={mo.velocity} anchor="start">still</T>
    <Stone x={200} y={250} /><Stone x={380} y={250} colour="#d6a21c" />
    <T x={200} y={204} size={14} colour={mo.mass}>A</T><T x={380} y={204} size={14} colour={mo.mass}>B</T>
    <Vel x={240} y={230} len={20} label="1 m/s" />
    <T x={440} y={234} size={16} colour={mo.velocity} anchor="start">? m/s</T>
    {!assessment && <T x={270} y={306} size={14} colour={good}>B: (20 × 3) − (20 × 1) = 60 − 20 = 40 kg m/s</T>}
  </PhysicsDiagram>
}
function ThreeQuestion({ assessment }: { assessment: boolean }) {
  const rows = [
    { y: 96, mass: '10 000 kg', v: '0 m/s (parked)', p: '10 000 × 0 = 0' },
    { y: 196, mass: '800 kg', v: '10 m/s', p: '800 × 10 = 8000' },
    { y: 296, mass: '2000 kg', v: '5 m/s', p: '2000 × 5 = 10 000' },
  ]
  return <PhysicsDiagram schematic={false} viewBox="0 0 540 320" title={assessment
    ? 'Three numbered vehicles. Vehicle 1: a 10 000 kg lorry, parked, 0 m/s. Vehicle 2: an 800 kg car at 10 m/s. Vehicle 3: a 2000 kg van at 5 m/s.'
    : 'The momentum of each vehicle: 1, 10 000 × 0 = 0; 2, 800 × 10 = 8000; 3, 2000 × 5 = 10 000 kg m/s. Vehicle 3 has the most.'}>
    {rows.map((r, i) => <g key={i}>
      <Road y={r.y} x1={40} x2={250} />
      <Num n={i + 1} x={24} y={r.y - 36} state="active" />
      {i === 0 ? <Lorry x={140} y={r.y} s={0.9} /> : i === 1 ? <Car x={140} y={r.y} /> : <Van x={140} y={r.y} />}
      <T x={270} y={r.y - 50} anchor="start" size={14} colour={mo.mass}>mass {r.mass}</T>
      <T x={270} y={r.y - 28} anchor="start" size={14} colour={mo.velocity}>velocity {r.v}</T>
      {!assessment && <T x={270} y={r.y - 4} anchor="start" size={14} colour={mom}>p = {r.p} kg m/s</T>}
      {!assessment && i === 2 && <Tick x={520} y={r.y - 40} s={0.9} />}
    </g>)}
  </PhysicsDiagram>
}
function CrashQuestion({ assessment }: { assessment: boolean }) {
  return <PhysicsDiagram schematic={false} viewBox={`0 0 540 ${assessment ? 230 : 290}`} title={assessment
    ? 'A 1200 kg car moving right at 10 m/s is about to hit a parked 800 kg car. After the crash the two cars lock together and move off.'
    : 'The worked answer: momentum before 1200 × 10 = 12 000 kg m/s. Mass after 1200 + 800 = 2000 kg. Velocity after 12 000 ÷ 2000 = 6 m/s.'}>
    <Road y={160} />
    <Car x={140} y={160} />
    <Car x={370} y={160} fill="#f2b8a8" line="#b4553f" />
    <MassTag x={140} y={82} text="1200 kg" />
    <MassTag x={370} y={82} text="800 kg" />
    <Vel x={200} y={124} len={60} label="10 m/s" />
    <T x={370} y={52} size={13} colour={mo.velocity}>parked</T>
    <Caption text="After the crash the cars lock together." y={206} />
    {!assessment && <g>
      <T x={270} y={244} size={14} colour={mom}>before: 1200 × 10 = 12 000 kg m/s</T>
      <T x={270} y={270} size={14} colour={good}>after: 12 000 ÷ (1200 + 800) = 6 m/s</T>
    </g>}
  </PhysicsDiagram>
}
function WorkingQuestion({ assessment }: { assessment: boolean }) {
  const lines = ['Momentum before = 2 × 3 = 6 kg m/s', 'Momentum after = 6 kg m/s', 'Mass after = 4 kg', 'Velocity after = 6 ÷ 4 = 1.5 m/s']
  return <PhysicsDiagram schematic={false} viewBox={`0 0 540 ${assessment ? 270 : 326}`} title={assessment
    ? 'Trolley P, 2 kg, moving at 3 m/s, hits trolley Q, 4 kg, which is still. They stick together. A student’s working in four numbered lines. Line 1: momentum before = 2 × 3 = 6 kg m/s. Line 2: momentum after = 6 kg m/s. Line 3: mass after = 4 kg. Line 4: velocity after = 6 ÷ 4 = 1.5 m/s.'
    : 'The working with line 3 marked wrong: both trolleys move together, so the mass after is 2 + 4 = 6 kg, and the velocity is 6 ÷ 6 = 1 m/s.'}>
    <T x={270} y={28} size={15}>P (2 kg) at 3 m/s hits Q (4 kg) at rest.</T>
    <T x={270} y={52} size={14} colour={muted}>They stick together.</T>
    <rect x={20} y={66} width={500} height={192} rx="10" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    {lines.map((l, i) => {
      const yy = 106 + i * 44, wrong = !assessment && i === 2
      return <g key={i}>
        {wrong && <rect x={28} y={yy - 26} width={484} height={38} rx="8" fill={P.wastedFill} stroke={warn} strokeWidth="1.5" />}
        <Num n={i + 1} x={52} y={yy - 6} state="on" colour={wrong ? warn : ink} />
        <T x={78} y={yy} anchor="start" size={16} colour={wrong ? warn : ink}>{l}</T>
        {wrong && <CrossMark x={490} y={yy - 6} s={0.8} />}
      </g>
    })}
    {!assessment && <g>
      <T x={20} y={288} anchor="start" size={13} colour={good}>Both trolleys move together: mass after = 2 + 4 = 6 kg.</T>
      <T x={20} y={312} anchor="start" size={13} colour={good}>Velocity after = 6 ÷ 6 = 1 m/s.</T>
    </g>}
  </PhysicsDiagram>
}
function Burst({ x, y }: { x: number; y: number }) {
  const pts: Pt[] = Array.from({ length: 16 }, (_, i) => { const a = i * Math.PI / 8, r = i % 2 ? 16 : 34; return [r1(x + r * Math.cos(a)), r1(y + r * Math.sin(a))] })
  return <path d={`M${pts.map(p => p.join(' ')).join('L')}Z`} fill={P.light} stroke={P.lightLine} strokeWidth="2" />
}
function FireworkQuestion({ assessment }: { assessment: boolean }) {
  return <PhysicsDiagram schematic={false} viewBox={`0 0 540 ${assessment ? 230 : 290}`} title={assessment
    ? 'A firework at rest bursts into two pieces. Piece A, 0.2 kg, flies left at 15 m/s. Piece B, 0.3 kg, flies the other way at an unknown velocity.'
    : 'The worked answer: A has 0.2 × 15 = 3 kg m/s to the left, so B has 3 kg m/s to the right. B’s velocity is 3 ÷ 0.3 = 10 m/s to the right.'}>
    <Burst x={270} y={110} />
    <T x={270} y={176} size={13} colour={muted}>at rest before it bursts</T>
    <circle cx={110} cy={110} r="14" fill="#f2b8a8" stroke="#b4553f" strokeWidth="2" />
    <circle cx={430} cy={110} r="17" fill="#cfe2ef" stroke="#3f7a9c" strokeWidth="2" />
    <MassTag x={110} y={60} text="A: 0.2 kg" />
    <MassTag x={430} y={60} text="B: 0.3 kg" />
    <Vel x={90} y={150} len={60} dir={-1} label="15 m/s" />
    <T x={430} y={160} size={16} colour={mo.velocity}>? m/s</T>
    <Caption text="Total momentum before = 0" y={212} colour={mom} />
    {!assessment && <g>
      <T x={270} y={246} size={14} colour={mom}>A: 0.2 × 15 = 3 kg m/s left, so B has 3 kg m/s right</T>
      <T x={270} y={272} size={14} colour={good}>B: v = 3 ÷ 0.3 = 10 m/s to the right</T>
    </g>}
  </PhysicsDiagram>
}

export function HigherMomentumVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'hmom-what-moving': return <TrafficScene stage="moving" />
    case 'hmom-what-mass': return <TrafficScene stage="mass" />
    case 'hmom-what-speed': return <TrafficScene stage="speed" />
    case 'hmom-what-equation': return <TrafficScene stage="equation" />
    case 'hmom-what-vector': return <TrafficScene stage="vector" />
    case 'hmom-calc-equation': return <CalcScene stage="equation" />
    case 'hmom-calc-p': return <CalcScene stage="p" />
    case 'hmom-calc-v': return <CalcScene stage="v" />
    case 'hmom-calc-m': return <CalcScene stage="m" />
    case 'hmom-calc-together': return <CalcScene stage="together" />
    case 'hmom-worked-boat': return <WorkedBoat />
    case 'hmom-coll-closed': return <CollisionScene stage="closed" />
    case 'hmom-coll-before': return <CollisionScene stage="before" />
    case 'hmom-coll-after': return <CollisionScene stage="after" />
    case 'hmom-coll-stick': return <CollisionScene stage="stick" />
    case 'hmom-coll-together': return <CollisionTogether />
    case 'hmom-exp-zero': return <IceScene stage="zero" />
    case 'hmom-exp-throw': return <IceScene stage="throw" />
    case 'hmom-exp-recoil': return <IceScene stage="recoil" />
    case 'hmom-exp-together': return <IceScene stage="together" />
    case 'hmom-q-stones': return <StonesQuestion assessment={assessment} />
    case 'hmom-q-three': return <ThreeQuestion assessment={assessment} />
    case 'hmom-q-crash': return <CrashQuestion assessment={assessment} />
    case 'hmom-q-working': return <WorkingQuestion assessment={assessment} />
    case 'hmom-q-firework': return <FireworkQuestion assessment={assessment} />
    default: return <TrafficScene stage="moving" />
  }
}
