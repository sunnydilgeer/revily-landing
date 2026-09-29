import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, Leader, type Pt } from './PhysicsKit'
import { ink, muted, r1, Caption, Tag, Eq, Arrow, Floor, Car, Bike, Person, StepStrip, Ring, type Piece } from './EnergyStoreVisuals'
import { Spaced, UnitBox } from './KineticVisuals'
import { Stopwatch } from './PowerVisuals'

/*
 * Physics Lesson 43: Distance, displacement, speed and velocity. Original, code-native schematics; not to scale.
 * Focus ids start with 'velocity-'.
 *
 * Motion colour code, shared by the motion lessons (acceleration, distance-time graphs): distance brown-orange (a thick
 * path line), displacement indigo (a straight arrow from start to finish), speed and velocity green, time blue (the
 * stopwatch from the Energy lessons), acceleration violet. The pieces below (flags, road, stopwatch tags, train, plane,
 * speed arrows) are exported for the other motion lessons.
 */

export const motion = { distance: '#b0601c', displacement: P.gravitationalLine, speed: '#1f8a6a', time: '#3f7fb0', accel: P.pd }
const M = motion

/** A flag on a pole standing at (x, y). */
export function Flag({ x, y, colour = M.speed, label }: { x: number; y: number; colour?: string; label?: string }) {
  return <g>
    <path d={`M${x} ${y}V${y - 46}`} stroke={ink} strokeWidth="2.6" />
    <path d={`M${x} ${y - 46}Q${x + 14} ${y - 42} ${x + 28} ${y - 46}V${y - 28}Q${x + 14} ${y - 24} ${x} ${y - 28}Z`} fill={colour} stroke={colour} strokeWidth="1.6" strokeOpacity=".8" fillOpacity=".75" />
    <ellipse cx={x} cy={y} rx="8" ry="3" fill={P.grid} />
    {label && <text x={x} y={y + 20} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{label}</text>}
  </g>
}
/** A road seen side on, from x1 to x2; y is the road surface. */
export function Road({ x1 = 10, x2 = 530, y }: { x1?: number; x2?: number; y: number }) {
  return <g>
    <rect x={x1} y={y} width={x2 - x1} height={16} rx="6" fill="#dfe3e7" stroke="#aab4bd" strokeWidth="1.6" />
    <path d={`M${x1 + 12} ${y + 8}H${x2 - 12}`} stroke="white" strokeWidth="2.4" strokeDasharray="14 12" />
  </g>
}
/** A speed or velocity arrow with its label above. */
export function Vel({ x, y, len, label, colour = M.speed, width = 3.4, below = false }: { x: number; y: number; len: number; label?: string; colour?: string; width?: number; below?: boolean }) {
  return <g>
    <Arrow from={[x, y]} to={[x + len, y]} colour={colour} width={width} />
    {label && <text x={r1(x + len / 2)} y={below ? y + 22 : y - 10} textAnchor="middle" fontSize="14" fontWeight="750" fill={colour} stroke="white" strokeWidth="4" paintOrder="stroke">{label}</text>}
  </g>
}
/** A dimension line along the ground with a label. */
export function Span({ x1, x2, y, label, colour = M.distance }: { x1: number; x2: number; y: number; label: string; colour?: string }) {
  return <g>
    <path d={`M${x1} ${y}H${x2}M${x1} ${y - 8}v16M${x2} ${y - 8}v16`} stroke={colour} strokeWidth="2.2" />
    <path d={`M${x1 + 9} ${y - 5}L${x1} ${y}L${x1 + 9} ${y + 5}M${x2 - 9} ${y - 5}L${x2} ${y}L${x2 - 9} ${y + 5}`} stroke={colour} strokeWidth="2.2" fill="none" />
    <text x={(x1 + x2) / 2} y={y + 24} textAnchor="middle" fontSize="15" fontWeight="750" fill={colour} stroke="white" strokeWidth="4" paintOrder="stroke">{label}</text>
  </g>
}
/** A small train facing right; (x, y) is the rail under its middle. */
export function Train({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-46 -8H40Q52 -8 52 -20Q52 -36 36 -44H-46Z" fill="#f3d9a6" stroke="#b27a2c" strokeWidth="2.2" />
    <path d="M24 -40Q36 -38 42 -28H24Z" fill="#e8f4fb" stroke="#b27a2c" strokeWidth="1.6" />
    {[-36, -18, 0].map(wx => <rect key={wx} x={wx} y={-36} width={12} height={10} rx="2" fill="#e8f4fb" stroke="#b27a2c" strokeWidth="1.4" />)}
    {[-32, -14, 22].map(wx => <circle key={wx} cx={wx} cy={-6} r="6" fill="#4f5d69" />)}
    <path d="M-50 0H56" stroke="#8a744a" strokeWidth="2.4" />
  </g>
}
/** A small plane facing right, centred on (x, y). */
export function Plane({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-44 -4Q-44 -10 -36 -10H30Q46 -10 50 -2Q46 6 30 6H-36Q-44 6 -44 -4Z" fill="#e4ebf0" stroke="#5a6b79" strokeWidth="2" />
    <path d="M-4 -8L-22 -30H-12L14 -8ZM-4 4L-22 24H-12L14 4Z" fill="#c9d5de" stroke="#5a6b79" strokeWidth="1.8" />
    <path d="M-40 -8L-48 -24H-38L-28 -8Z" fill="#c9d5de" stroke="#5a6b79" strokeWidth="1.8" />
    <path d="M36 -6Q42 -6 44 -2H36Z" fill="#3f7a9c" />
  </g>
}
/** A person in a walking (0) or running (1) pose, facing right. */
export function Mover({ x, y, s = 1, run = false }: { x: number; y: number; s?: number; run?: boolean }) {
  return run
    ? <Person x={x} y={y} s={s} lean={8} arms={[[[18, -46], [26, -58]], [[-12, -46], [-22, -38]]]} legs={[[[14, -16], [4, 0]], [[-12, -20], [-24, -8]]]} />
    : <Person x={x} y={y} s={s} lean={2} arms={[[[8, -38], [10, -22]], [[-6, -38], [-8, -22]]]} legs={[[[6, -16], [10, 0]], [[-5, -16], [-9, 0]]]} />
}
function Speedo({ x, y, text }: { x: number; y: number; text: string }) {
  const r = 34
  return <g>
    <path d={`M${x - r} ${y}A${r} ${r} 0 0 1 ${x + r} ${y}Z`} fill="white" stroke={M.speed} strokeWidth="2.4" />
    {[0.1, 0.3, 0.5, 0.7, 0.9].map(t => { const a = Math.PI * (1 + t); return <path key={t} d={`M${r1(x + Math.cos(a) * (r - 3))} ${r1(y + Math.sin(a) * (r - 3))}L${r1(x + Math.cos(a) * (r - 9))} ${r1(y + Math.sin(a) * (r - 9))}`} stroke={M.speed} strokeWidth="1.8" /> })}
    <path d={`M${x} ${y}L${x + 14} ${y - 24}`} stroke={ink} strokeWidth="2.6" />
    <circle cx={x} cy={y} r="3.4" fill={ink} />
    <text x={x} y={y + 22} textAnchor="middle" fontSize="16" fontWeight="800" fill={M.speed}>{text}</text>
  </g>
}

/* ---------- Section 2: distance and displacement ---------- */

const winding = 'M70 236C130 120 210 272 270 180S400 60 460 110'
const S0: Pt = [70, 236], S1: Pt = [460, 110]
function Path({ displacement }: { displacement: boolean }) {
  return <PhysicsDiagram title={displacement
    ? 'The same winding path, faded. A straight indigo arrow goes from the start to the finish: the displacement, a straight line with a direction. Distance is a scalar (size only); displacement is a vector (size and direction).'
    : 'A winding path from a start flag to a finish flag, drawn as a thick line. The distance is how far along the path the object moves.'}>
    <path d={winding} stroke={M.distance} strokeWidth="8" fill="none" opacity={displacement ? 0.3 : 1} />
    <path d={winding} stroke="white" strokeWidth="2" fill="none" strokeDasharray="2 10" opacity={displacement ? 0.3 : 0.8} />
    {displacement && <Arrow from={[S0[0] + 8, S0[1] - 6]} to={[S1[0] - 8, S1[1] + 4]} colour={M.displacement} width={4.2} />}
    <Flag x={S0[0]} y={S0[1] + 8} colour={M.speed} label="start" />
    <Flag x={S1[0]} y={S1[1] + 8} colour="#c0675a" label="finish" />
    {displacement
      ? <g>
          <Lines x={230} y={120} anchor="end" lines={['displacement:', 'straight line,', 'with direction']} size={14} colour={M.displacement} />
          <Tag x={230} y={268} text="distance: scalar" colour={M.distance} />
          <Tag x={420} y={268} text="displacement: vector" colour={M.displacement} />
          <Caption text="scalar: size only · vector: size and direction" x={320} y={296} size={13} />
        </g>
      : <g>
          <Lines x={40} y={40} lines={['distance: how far', 'along the path']} size={15} colour={M.distance} />
          <Tag x={400} y={272} text="scalar: size only" colour={M.distance} />
        </g>}
  </PhysicsDiagram>
}

/** A straight track with metre ticks; x0 is 0 m, `px` pixels per metre. */
function Track({ x0, px, n, y }: { x0: number; px: number; n: number; y: number }) {
  return <g>
    <path d={`M${x0 - 20} ${y}H${x0 + n * px + 24}`} stroke="#aab4bd" strokeWidth="3" />
    {Array.from({ length: n + 1 }, (_, i) => <g key={i}><path d={`M${x0 + i * px} ${y - 5}v10`} stroke="#8a98a4" strokeWidth="1.6" /><text x={x0 + i * px} y={y + 20} textAnchor="middle" fontSize="12" fill={muted}>{i} m</text></g>)}
  </g>
}
function EastSign({ x, y }: { x: number; y: number }) {
  return <g><Arrow from={[x, y]} to={[x + 40, y]} colour={muted} width={2} /><text x={x + 48} y={y + 5} fontSize="13" fontWeight="700" fill={muted}>east</text></g>
}
function Return() {
  const x0 = 90, px = 60, y = 190
  return <PhysicsDiagram title="Walk 6 m east, then 6 m back west to the start. The distance travelled is 6 + 6 = 12 m. The displacement is 0 m, because you finish where you started.">
    <EastSign x={430} y={30} />
    <Track x0={x0} px={px} n={6} y={y} />
    <Flag x={x0} y={y} colour={M.speed} />
    <Vel x={x0 + 4} y={86} len={6 * px - 8} label="6 m east" colour={M.distance} />
    <g><Arrow from={[x0 + 6 * px - 4, 128]} to={[x0 + 4, 128]} colour={M.distance} width={3.4} /><text x={x0 + 3 * px} y={122} textAnchor="middle" fontSize="14" fontWeight="750" fill={M.distance} stroke="white" strokeWidth="4" paintOrder="stroke">6 m back west</text></g>
    <circle cx={x0} cy={y} r="7" fill={M.displacement} />
    <Tag x={170} y={250} text="distance = 6 + 6 = 12 m" colour={M.distance} />
    <Tag x={400} y={250} text="displacement = 0 m" colour={M.displacement} />
  </PhysicsDiagram>
}
function TwoParts() {
  const x0 = 70, px = 45, y = 190
  return <PhysicsDiagram title="Walk 8 m east, then 3 m west. The distance is 8 + 3 = 11 m. You finish 5 m east of the start, so the displacement is 5 m east.">
    <EastSign x={440} y={26} />
    <Track x0={x0} px={px} n={9} y={y} />
    <Flag x={x0} y={y} colour={M.speed} />
    <Flag x={x0 + 5 * px} y={y} colour="#c0675a" />
    <Vel x={x0 + 4} y={84} len={8 * px - 8} label="8 m east" colour={M.distance} />
    <g><Arrow from={[x0 + 8 * px - 4, 118]} to={[x0 + 5 * px + 4, 118]} colour={M.distance} width={3.4} /><text x={x0 + 8 * px + 10} y={123} fontSize="14" fontWeight="750" fill={M.distance}>3 m west</text></g>
    <Vel x={x0 + 4} y={232} len={5 * px - 8} label="5 m east" colour={M.displacement} width={4} below />
    <Tag x={150} y={282} text="distance = 8 + 3 = 11 m" colour={M.distance} />
    <Tag x={400} y={282} text="displacement = 5 m east" colour={M.displacement} />
  </PhysicsDiagram>
}

/* ---------- Section 3: speed, velocity, average speed ---------- */

function SpeedPic() {
  return <PhysicsDiagram title="A car with a speedometer reading 20 m/s. Speed says how fast, but not which way.">
    <Road y={210} />
    <Car x={200} y={210} s={1.5} />
    <Speedo x={420} y={130} text="20 m/s" />
    <Tag x={270} y={268} text="speed: how fast, no direction" colour={M.speed} size={14} />
  </PhysicsDiagram>
}
function VelocityPic() {
  return <PhysicsDiagram title="Two identical cars on a road, both at 20 m/s. One goes to the right, the other to the left. They have the same speed but different velocities.">
    <Road y={110} />
    <Car x={150} y={110} s={1.1} />
    <Vel x={230} y={72} len={120} label="20 m/s to the right" />
    <Road y={230} />
    <Car x={390} y={230} s={1.1} flip />
    <g><Arrow from={[310, 192]} to={[190, 192]} colour={M.speed} width={3.4} /><text x={250} y={182} textAnchor="middle" fontSize="14" fontWeight="750" fill={M.speed}>20 m/s to the left</text></g>
    <Tag x={140} y={280} text="same speed" colour={ink} />
    <Tag x={390} y={280} text="different velocities" colour={M.speed} />
  </PhysicsDiagram>
}
function Average() {
  const x0 = 70, x1 = 480, yb = 230, yt = 60
  const wig = `M${x0} 190C100 186 130 196 160 188S196 184 210 150C220 110 250 96 280 104S320 96 330 112C344 150 360 190 390 186S450 194 ${x1} 188`
  return <PhysicsDiagram schematic={false} title="A sketch of speed against time for a journey: walk, then run, then walk. The speed goes up and down. A flat dashed line shows the average speed for the whole journey.">
    <path d={`M${x0} ${yb}H${x1 + 20}M${x0} ${yb}V${yt}`} stroke={ink} strokeWidth="2" />
    <Arrow from={[x1 + 8, yb]} to={[x1 + 24, yb]} colour={ink} width={2} />
    <Arrow from={[x0, yt + 10]} to={[x0, yt - 6]} colour={ink} width={2} />
    <text x={x0} y={yt - 14} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>speed</text>
    <text x={x1 + 20} y={yb + 22} textAnchor="end" fontSize="13" fontWeight="700" fill={ink}>time</text>
    <path d={wig} stroke={M.speed} strokeWidth="3.2" fill="none" />
    <path d={`M${x0} 160H${x1}`} stroke={M.speed} strokeWidth="2.6" strokeDasharray="9 6" />
    <Tag x={410} y={146} text="average speed" colour={M.speed} />
    {[['walk', 130], ['run', 270], ['walk', 420]].map(([t, x]) => <text key={`${t}${x}`} x={x as number} y={t === 'run' ? 88 : 214} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>{t}</text>)}
    <Caption text="speeds change; the average is one value for the whole trip" y={272} size={13} />
  </PhysicsDiagram>
}

/* ---------- Section 4: s = v × t ---------- */

const sPieces = (s: string, v: string, t: string): Piece[] => [[s, M.distance], [' = '], [v, M.speed], [' × '], [t, M.time]]
function EqCard() {
  return <PhysicsDiagram schematic={false} title="distance travelled = speed × time, or s = v × t. s is distance in metres, m. v is speed in metres per second, m/s. t is time in seconds, s. Here s means distance.">
    <rect x={30} y={10} width={480} height={40} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <Eq x={270} y={37} size={18} pieces={[['distance travelled', M.distance], [' = '], ['speed', M.speed], [' × '], ['time', M.time]]} />
    <rect x={150} y={62} width={240} height={56} rx="16" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <Spaced y={101} size={28} items={[['s', M.distance, 200], ['=', ink, 238], ['v', M.speed, 274], ['×', ink, 306], ['t', M.time, 340]]} />
    <UnitBox x={95} y={210} to={[200, 108]} name="distance" unit="metres" symbol="m" colour={M.distance} w={150} />
    <UnitBox x={270} y={210} to={[274, 108]} name="speed" unit="metres per second" symbol="m/s" colour={M.speed} w={170} />
    <UnitBox x={445} y={210} to={[340, 108]} name="time" unit="seconds" symbol="s" colour={M.time} w={150} />
    <Caption text="careful: s means distance, not speed" y={284} colour={M.distance} />
  </PhysicsDiagram>
}

function Card({ children }: { children: ReactNode }) {
  return <g><rect x={262} y={56} width={266} height={220} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />{children}</g>
}
function Answer({ y = 214, items, ringX, ringW = 14 }: { y?: number; items: Array<[string, string, number]>; ringX: number; ringW?: number }) {
  return <g>
    <rect x={300} y={y - 34} width={190} height={50} rx="14" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <Spaced y={y} size={24} items={items} />
    <Ring x={ringX} y={y - 8} rx={ringW} ry={15} />
  </g>
}
function WorkedS({ step }: { step: 1 | 2 | 3 }) {
  const titles = [
    'Step 1 of 3: a cyclist rides at a steady 6 m/s for 20 s. How far does she travel? Write s = v × t.',
    'Step 2 of 3: substitute: s = 6 × 20.',
    'Step 3 of 3: 6 × 20 = 120, so the cyclist travels 120 m.',
  ]
  return <PhysicsDiagram title={titles[step - 1]}>
    <StepStrip steps={['write it', 'substitute', 'answer']} active={step} colour={M.distance} gap={160} />
    <Floor x1={20} x2={240} y={196} />
    <Bike x={90} y={196} s={0.9} />
    <Vel x={120} y={96} len={70} label="6 m/s" />
    <Stopwatch x={196} y={150} r={20} frac={0.33} />
    <text x={222} y={156} fontSize="14" fontWeight="750" fill={M.time}>20 s</text>
    <Span x1={40} x2={236} y={232} label={step === 3 ? '120 m' : 'distance = ?'} />
    <Card>
      <g opacity={step === 1 ? 1 : 0.55}><Eq x={395} y={100} size={24} pieces={sPieces('s', 'v', 't')} /></g>
      {step === 1 && <g>
        <text x={395} y={150} textAnchor="middle" fontSize="14" fontWeight="650" fill={M.speed}>v = 6 m/s</text>
        <text x={395} y={174} textAnchor="middle" fontSize="14" fontWeight="650" fill={M.time}>t = 20 s</text>
        <text x={395} y={198} textAnchor="middle" fontSize="14" fontWeight="650" fill={M.distance}>s = ?</text>
      </g>}
      {step >= 2 && <g opacity={step === 2 ? 1 : 0.55}><Eq x={395} y={150} size={24} pieces={sPieces('s', '6', '20')} /></g>}
      {step === 3 && <Answer items={[['s', M.distance, 336], ['= 120', ink, 392], ['m', ink, 456]]} ringX={456} />}
    </Card>
  </PhysicsDiagram>
}
function WorkedV({ step }: { step: 1 | 2 | 3 }) {
  const titles = [
    'Step 1 of 3: start with s = v × t. Divide both sides by t to get v = s ÷ t.',
    'Step 2 of 3: a car travels 300 m in 12 s. Substitute: v = 300 ÷ 12.',
    'Step 3 of 3: 300 ÷ 12 = 25, so the average speed is 25 m/s.',
  ]
  return <PhysicsDiagram title={titles[step - 1]}>
    <StepStrip steps={['rearrange', 'substitute', 'answer']} active={step} colour={M.speed} gap={160} />
    <Road x1={16} x2={244} y={180} />
    <Car x={120} y={180} s={0.95} />
    <Stopwatch x={190} y={96} r={20} frac={0.2} />
    <text x={216} y={102} fontSize="14" fontWeight="750" fill={M.time}>12 s</text>
    <Span x1={24} x2={236} y={226} label="300 m" />
    <Card>
      {step === 1 && <g>
        <Eq x={395} y={100} size={24} pieces={sPieces('s', 'v', 't')} />
        <Arrow from={[395, 118]} to={[395, 170]} colour={ink} width={2.6} />
        <text x={405} y={150} fontSize="13" fontWeight="700" fill={ink}>÷ t both sides</text>
        <rect x={315} y={180} width={160} height={50} rx="14" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
        <Eq x={395} y={214} size={24} pieces={[['v', M.speed], [' = '], ['s', M.distance], [' ÷ '], ['t', M.time]]} />
      </g>}
      {step >= 2 && <g>
        <g opacity=".55"><Eq x={395} y={100} size={20} pieces={[['v', M.speed], [' = '], ['s', M.distance], [' ÷ '], ['t', M.time]]} /></g>
        <g opacity={step === 2 ? 1 : 0.55}><Eq x={395} y={148} size={24} pieces={[['v', M.speed], [' = '], ['300', M.distance], [' ÷ '], ['12', M.time]]} /></g>
      </g>}
      {step === 3 && <g>
        <Answer y={212} items={[['v', M.speed, 330], ['= 25', ink, 382], ['m/s', ink, 450]]} ringX={450} ringW={24} />
        <text x={395} y={254} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>average speed</text>
      </g>}
    </Card>
  </PhysicsDiagram>
}

/* ---------- Section 6: typical speeds ---------- */

function Typical() {
  const items: Array<[string, string, (x: number) => ReactNode]> = [
    ['walking', '1.5', x => <Mover x={x} y={120} s={0.85} />],
    ['running', '3', x => <Mover x={x} y={120} s={0.85} run />],
    ['cycling', '6', x => <Bike x={x} y={120} s={0.62} />],
    ['car', '25', x => <Car x={x} y={120} s={0.72} />],
    ['train', '30', x => <Train x={x} y={120} s={0.8} />],
    ['plane', '250', x => <Plane x={x} y={84} s={0.8} />],
  ]
  return <PhysicsDiagram title="Typical speeds: walking about 1.5 m/s, running 3 m/s, cycling 6 m/s, a car 25 m/s, a train 30 m/s and a plane 250 m/s.">
    {items.map(([name, v, pic], i) => {
      const x = 52 + i * 87
      return <g key={name}>
        {pic(x)}
        <text x={x} y={152} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{name}</text>
        <text x={x} y={178} textAnchor="middle" fontSize="16" fontWeight="800" fill={M.speed}>{v}</text>
        <text x={x} y={196} textAnchor="middle" fontSize="12" fontWeight="650" fill={muted}>m/s</text>
        <rect x={x - 36} y={214} width={r1(12 + i * 12)} height={14} rx="7" fill="#d6efe5" stroke={M.speed} strokeWidth="1.6" />
      </g>
    })}
    <Caption text="bars show the order from slowest to fastest, not to scale" y={262} size={13} />
    <Caption text="typical values: learn these six" y={286} colour={ink} size={14} />
  </PhysicsDiagram>
}
function Affect() {
  const tags: Array<[string, Pt, Pt]> = [['fitness', [110, 70], [280, 190]], ['age', [430, 70], [292, 150]], ['distance travelled', [110, 210], [200, 262]], ['terrain (type of ground)', [420, 214], [380, 254]]]
  return <PhysicsDiagram title="How fast a person walks, runs or cycles depends on their fitness, their age, the distance they travel and the terrain, which is the type of ground.">
    <path d="M150 262Q210 250 270 256T420 250" stroke="#b9c7a8" strokeWidth="3" fill="none" />
    {[[200, 262], [236, 258], [330, 258], [370, 256]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y + 4} rx="7" ry="3" fill="#cfd9c0" />)}
    <Mover x={272} y={252} s={1.35} run />
    {tags.map(([t, at, to]) => <g key={t}>
      <Leader from={[at[0], at[1]]} to={to} colour={muted} />
      <Tag x={at[0]} y={at[1]} text={t} colour={ink} />
    </g>)}
  </PhysicsDiagram>
}
function Sound() {
  return <PhysicsDiagram title="Sound travels through air at about 330 m/s. The speed of the wind varies from day to day.">
    <rect x={10} y={20} width={255} height={240} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <path d="M40 120H62L92 94V186L62 160H40Z" fill="#dfe5ea" stroke="#5a6b79" strokeWidth="2.2" />
    {[26, 48, 70].map(d => <path key={d} d={`M${100 + d} ${140 - d * 0.9}Q${118 + d * 1.2} 140 ${100 + d} ${140 + d * 0.9}`} stroke={M.time} strokeWidth="2.6" fill="none" opacity={1 - d / 140} />)}
    <text x={137} y={220} textAnchor="middle" fontSize="18" fontWeight="800" fill={M.speed}>330 m/s</text>
    <text x={137} y={242} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>sound, in air</text>
    <rect x={275} y={20} width={255} height={240} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <path d="M340 230V70" stroke={ink} strokeWidth="3" />
    <path d="M340 72Q380 64 420 80T480 84Q470 96 480 108Q440 104 410 110T340 110Z" fill="#9cc3d9" stroke="#3f7a9c" strokeWidth="2" />
    {[140, 160, 180].map((y, i) => <path key={y} d={`M${300 + i * 8} ${y}q30 -8 60 0t60 0`} stroke={muted} strokeWidth="2" fill="none" opacity=".7" />)}
    <text x={402} y={220} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>wind speed</text>
    <text x={402} y={242} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>varies</text>
    <Caption text="sound is faster than a car or a train" y={286} colour={ink} />
  </PhysicsDiagram>
}

export function VelocityVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'velocity-distance': return <Path displacement={false} />
    case 'velocity-displacement': return <Path displacement />
    case 'velocity-return': return <Return />
    case 'velocity-twoparts': return <TwoParts />
    case 'velocity-speed': return <SpeedPic />
    case 'velocity-velocity': return <VelocityPic />
    case 'velocity-average': return <Average />
    case 'velocity-eq': return <EqCard />
    case 'velocity-w1': return <WorkedS step={1} />
    case 'velocity-w2': return <WorkedS step={2} />
    case 'velocity-w3': return <WorkedS step={3} />
    case 'velocity-r1': return <WorkedV step={1} />
    case 'velocity-r2': return <WorkedV step={2} />
    case 'velocity-r3': return <WorkedV step={3} />
    case 'velocity-table': return <Typical />
    case 'velocity-affect': return <Affect />
    case 'velocity-sound': return <Sound />
    default: return null
  }
}
