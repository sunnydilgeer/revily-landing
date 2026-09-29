import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines } from './PhysicsKit'
import { ink, muted, Caption, Tag, Eq, Arrow, Floor, Ball, Car, Bike, StepStrip, Ring, type Piece } from './EnergyStoreVisuals'
import { Spaced, UnitBox } from './KineticVisuals'
import { Stopwatch } from './PowerVisuals'
import { motion as M, Road, Vel, Span } from './VelocityVisuals'

/*
 * Physics Lesson 44: Acceleration. Original, code-native schematics; not to scale. Focus ids start with 'accel-'.
 *
 * Same motion colours as the speed and velocity lesson: velocity green, time blue, distance brown-orange and
 * acceleration violet. Recurring picture: a vehicle on a road with velocity arrows whose length shows the velocity,
 * so a growing arrow means speeding up and a shrinking arrow means slowing down.
 */

const A = M.accel

/** A small van facing right; (x, y) is the road under its middle. */
function Van({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-56 -14V-58Q-56 -64 -50 -64H22Q30 -64 36 -56L50 -38Q56 -34 56 -26V-14Q56 -10 52 -10H-52Q-56 -10 -56 -14Z" fill="#f1f4f6" stroke="#5a6b79" strokeWidth="2.2" />
    <path d="M26 -58L44 -38H26Z" fill="#e8f4fb" stroke="#5a6b79" strokeWidth="1.6" />
    <path d="M-50 -34H18" stroke={M.time} strokeWidth="4" />
    {[-32, 32].map(wx => <g key={wx}><circle cx={wx} cy="-10" r="10" fill="#4f5d69" stroke="#33404b" strokeWidth="1.6" /><circle cx={wx} cy="-10" r="4" fill="#dfe5ea" /></g>)}
  </g>
}
function Faded({ o, children }: { o: number; children: ReactNode }) {
  return <g opacity={o}>{children}</g>
}
function Chip({ x, y, text, colour = A }: { x: number; y: number; text: string; colour?: string }) {
  const w = text.length * 8 + 20
  return <g><rect x={x - w / 2} y={y - 13} width={w} height={26} rx="13" fill="white" stroke={colour} strokeWidth="1.8" /><text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="750" fill={colour}>{text}</text></g>
}

/* ---------- Section 2: what acceleration is ---------- */

function Idea() {
  const pos: Array<[number, number, string, number]> = [[90, 20, '2 m/s', 0.4], [260, 60, '6 m/s', 0.7], [430, 100, '10 m/s', 1]]
  return <PhysicsDiagram title="A car pulling away at three moments. Its velocity arrow grows from 2 m/s to 6 m/s to 10 m/s. The velocity is changing: this is acceleration.">
    <Road y={200} />
    {pos.map(([x, len, t, o]) => <g key={x}>
      <Faded o={o}><Car x={x} y={200} s={0.85} /></Faded>
      <Vel x={x - 40} y={120} len={len} label={t} />
    </g>)}
    <path d="M50 70V58H530V70" stroke={A} strokeWidth="2.2" fill="none" />
    <text x={290} y={46} textAnchor="middle" fontSize="15" fontWeight="750" fill={A}>velocity changes: this is acceleration</text>
    <Caption text="longer arrow = bigger velocity" y={264} />
  </PhysicsDiagram>
}
function EqCard() {
  return <PhysicsDiagram schematic={false} title="acceleration = change in velocity ÷ time taken, or a = Δv ÷ t. a is in metres per second squared, m/s². Δv is in metres per second, m/s. t is in seconds, s. Δ means change in: Δv = final velocity − starting velocity.">
    <rect x={20} y={10} width={500} height={40} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <Eq x={270} y={37} size={16} pieces={[['acceleration', A], [' = '], ['change in velocity', M.speed], [' ÷ '], ['time taken', M.time]]} />
    <rect x={150} y={62} width={240} height={56} rx="16" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <Spaced y={101} size={28} items={[['a', A, 196], ['=', ink, 232], ['Δv', M.speed, 274], ['÷', ink, 314], ['t', M.time, 346]]} />
    <UnitBox x={95} y={198} to={[196, 108]} name="acceleration" unit="metres per second²" symbol="m/s²" colour={A} w={160} />
    <UnitBox x={270} y={198} to={[274, 108]} name="change in velocity" unit="metres per second" symbol="m/s" colour={M.speed} w={170} />
    <UnitBox x={445} y={198} to={[346, 108]} name="time taken" unit="seconds" symbol="s" colour={M.time} w={150} />
    <Caption text="Δ means “change in”:  Δv = final velocity − starting velocity" y={276} colour={ink} size={13} />
  </PhysicsDiagram>
}
function Units() {
  const xs = [70, 200, 330, 460], v = [0, 3, 6, 9]
  return <PhysicsDiagram title="A car gains 3 m/s every second: 0, 3, 6 and 9 m/s at 0, 1, 2 and 3 seconds. Its acceleration is 3 m/s², which means 3 metres per second, every second.">
    <Road y={170} />
    {xs.map((x, i) => <g key={x}>
      <Faded o={0.35 + i * 0.2}><Car x={x} y={170} s={0.62} /></Faded>
      {v[i] > 0 ? <Vel x={x - 26} y={100} len={v[i] * 9} label={`${v[i]} m/s`} /> : <text x={x} y={96} textAnchor="middle" fontSize="14" fontWeight="750" fill={M.speed}>0 m/s</text>}
      <text x={x} y={206} textAnchor="middle" fontSize="14" fontWeight="700" fill={M.time}>{i} s</text>
      {i > 0 && <Chip x={x - 65} y={236} text="+3 m/s" />}
    </g>)}
    <rect x={120} y={258} width={300} height={34} rx="17" fill={P.pdFill} stroke={A} strokeWidth="2" />
    <text x={270} y={281} textAnchor="middle" fontSize="15" fontWeight="750" fill={A}>+3 m/s each second = 3 m/s²</text>
  </PhysicsDiagram>
}
function Decel() {
  const pos: Array<[number, number]> = [[90, 12], [260, 8], [430, 4]]
  return <PhysicsDiagram title="A car slowing down: its velocity arrow shrinks from 12 m/s to 8 m/s to 4 m/s. The change in velocity is negative. This is deceleration, a negative acceleration.">
    <Road y={180} />
    {pos.map(([x, v], i) => <g key={x}>
      <Faded o={0.5 + i * 0.25}><Car x={x} y={180} s={0.85} /></Faded>
      <Vel x={x - 40} y={96} len={v * 8} label={`${v} m/s`} />
      {i > 0 && <Chip x={x - 85} y={60} text="−4 m/s" colour={P.wasted} />}
    </g>)}
    <rect x={100} y={222} width={340} height={36} rx="18" fill={P.wastedFill} stroke={P.wasted} strokeWidth="2" />
    <text x={270} y={246} textAnchor="middle" fontSize="15" fontWeight="750" fill={P.wasted}>slowing down: negative acceleration</text>
    <Caption text="also called deceleration" y={284} />
  </PhysicsDiagram>
}

/* ---------- Section 3: worked example a = Δv ÷ t ---------- */

function WorkCard({ children }: { children: ReactNode }) {
  return <g><rect x={262} y={52} width={266} height={228} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />{children}</g>
}
function Answer({ y, items, ringX, ringW = 14, size = 24, x = 296, w = 200 }: { y: number; items: Array<[string, string, number]>; ringX: number; ringW?: number; size?: number; x?: number; w?: number }) {
  return <g>
    <rect x={x} y={y - 34} width={w} height={50} rx="14" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <Spaced y={y} size={size} items={items} />
    <Ring x={ringX} y={y - 8} rx={ringW} ry={15} />
  </g>
}
const aEq: Piece[] = [['a', A], [' = '], ['Δv', M.speed], [' ÷ '], ['t', M.time]]
function Worked({ step }: { step: 1 | 2 | 3 | 4 }) {
  const titles = [
    'Step 1 of 4: a bike speeds up from 3 m/s to 15 m/s in 4 s. Write the equation a = Δv ÷ t.',
    'Step 2 of 4: find the change in velocity: final minus starting, 15 − 3 = 12 m/s.',
    'Step 3 of 4: substitute: a = 12 ÷ 4.',
    'Step 4 of 4: 12 ÷ 4 = 3, so the acceleration is 3 m/s².',
  ]
  return <PhysicsDiagram title={titles[step - 1]}>
    <StepStrip steps={['write it', 'change', 'substitute', 'answer']} active={step} colour={A} gap={128} />
    <Floor x1={14} x2={246} y={196} />
    <Faded o={0.45}><Bike x={62} y={196} s={0.62} /></Faded>
    <Bike x={186} y={196} s={0.62} />
    <Vel x={46} y={96} len={18} label="3 m/s" />
    <Vel x={150} y={96} len={82} label="15 m/s" />
    <text x={62} y={218} textAnchor="middle" fontSize="12" fontWeight="650" fill={muted}>start</text>
    <text x={186} y={218} textAnchor="middle" fontSize="12" fontWeight="650" fill={muted}>end</text>
    <Stopwatch x={108} y={252} r={18} frac={0.3} />
    <text x={134} y={258} fontSize="14" fontWeight="750" fill={M.time}>4 s</text>
    <WorkCard>
      <g opacity={step === 1 ? 1 : 0.55}><Eq x={395} y={92} size={24} pieces={aEq} /></g>
      {step === 1 && <g>
        <text x={395} y={138} textAnchor="middle" fontSize="14" fontWeight="650" fill={M.speed}>starting velocity = 3 m/s</text>
        <text x={395} y={162} textAnchor="middle" fontSize="14" fontWeight="650" fill={M.speed}>final velocity = 15 m/s</text>
        <text x={395} y={186} textAnchor="middle" fontSize="14" fontWeight="650" fill={M.time}>t = 4 s</text>
      </g>}
      {step >= 2 && <g opacity={step === 2 ? 1 : 0.55}>
        {step === 2 && <rect x={274} y={112} width={242} height={40} rx="12" fill="#e3f3ec" stroke={M.speed} strokeWidth="2" />}
        <Eq x={395} y={139} size={18} pieces={[['Δv', M.speed], [' = 15 − 3 = '], ['12 m/s', M.speed]]} />
        {step === 2 && <text x={395} y={176} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>final − starting</text>}
      </g>}
      {step >= 3 && <g opacity={step === 3 ? 1 : 0.55}><Eq x={395} y={186} size={24} pieces={[['a', A], [' = '], ['12', M.speed], [' ÷ '], ['4', M.time]]} /></g>}
      {step === 4 && <Answer y={250} items={[['a', A, 326], ['= 3', ink, 372], ['m/s²', ink, 444]]} ringX={444} ringW={30} />}
    </WorkCard>
  </PhysicsDiagram>
}

/* ---------- Section 4: estimating ---------- */

function Estimate() {
  return <PhysicsDiagram schematic={false} title="An estimate is a rough answer using sensible numbers. The symbol ~ in front of a number means about: ~6 m/s means about 6 m/s.">
    <path d="M80 150C50 150 44 110 76 102C74 66 124 58 140 80C154 50 214 54 220 86C258 82 272 120 246 140C262 170 222 192 196 176C180 200 128 200 116 176C92 186 70 172 80 150Z" fill="#f4f7fa" stroke="#8aa0b1" strokeWidth="2.4" />
    <circle cx={98} cy={214} r="10" fill="#f4f7fa" stroke="#8aa0b1" strokeWidth="2" />
    <circle cx={80} cy={244} r="6" fill="#f4f7fa" stroke="#8aa0b1" strokeWidth="2" />
    <text x={160} y={140} textAnchor="middle" fontSize="34" fontWeight="800" fill={A}>~ 6 m/s</text>
    <rect x={296} y={70} width={226} height={42} rx="21" fill={P.pdFill} stroke={A} strokeWidth="2" />
    <text x={409} y={97} textAnchor="middle" fontSize="16" fontWeight="750" fill={A}>~ means “about”</text>
    <Lines x={300} y={160} lines={['an estimate is not exact:', 'use sensible, rough', 'numbers for things you', 'cannot measure']} size={14} />
  </PhysicsDiagram>
}
function EstimateBike() {
  return <PhysicsDiagram title="A cyclist starts from standing still, 0 m/s, and reaches a typical bike speed of about 6 m/s in about 10 s. The change in velocity is 6 − 0 = 6 m/s.">
    <Floor x1={20} x2={520} y={200} />
    <Faded o={0.55}><Bike x={100} y={200} s={0.85} /></Faded>
    <Bike x={420} y={200} s={0.85} />
    <Vel x={380} y={78} len={90} label="6 m/s (typical)" />
    <Tag x={100} y={236} text="standing still: 0 m/s" colour={M.speed} />
    <Stopwatch x={262} y={120} r={24} frac={0.6} />
    <text x={262} y={170} textAnchor="middle" fontSize="15" fontWeight="750" fill={M.time}>about 10 s</text>
    <Arrow from={[180, 150]} to={[222, 150]} colour={muted} width={2.4} />
    <Arrow from={[302, 150]} to={[344, 150]} colour={muted} width={2.4} />
    <Tag x={420} y={236} text="Δv = 6 − 0 = 6 m/s" colour={M.speed} />
  </PhysicsDiagram>
}
function EstimateAnswer() {
  return <PhysicsDiagram schematic={false} title="a = Δv ÷ t = 6 ÷ 10 = 0.6 m/s². Because it is an estimate, write ~0.6 m/s².">
    <rect x={90} y={30} width={360} height={220} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <g opacity=".55"><Eq x={270} y={76} size={22} pieces={aEq} /></g>
    <Eq x={270} y={126} size={24} pieces={[['a', A], [' = '], ['6', M.speed], [' ÷ '], ['10', M.time], [' = 0.6 m/s²']]} />
    <rect x={170} y={152} width={200} height={56} rx="16" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <text x={270} y={190} textAnchor="middle" fontSize="26" fontWeight="800" fill={A}>~0.6 m/s²</text>
    <text x={270} y={234} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>~ because it is only an estimate</text>
  </PhysicsDiagram>
}

/* ---------- Section 5: uniform acceleration and v² − u² = 2as ---------- */

function Uniform() {
  const balls: Array<[number, number, string]> = [[66, 22, '1 s'], [130, 44, '2 s'], [210, 66, '3 s']]
  return <PhysicsDiagram title="A ball falling freely, shown after 1, 2 and 3 seconds. Its velocity arrow grows by the same amount each second: uniform acceleration. Near the Earth this is about 9.8 m/s².">
    <Ball x={150} y={30} r={14} fill="#dfe5ea" line="#7d8e9c" seam={false} />
    <text x={120} y={35} textAnchor="end" fontSize="13" fontWeight="650" fill={muted}>let go</text>
    {balls.map(([y, len, t]) => <g key={t}>
      <Ball x={150} y={y} r={14} fill="#f6c9a0" seam={false} />
      <text x={120} y={y + 5} textAnchor="end" fontSize="14" fontWeight="750" fill={M.time}>{t}</text>
      <Arrow from={[182, y - 8]} to={[182, y - 8 + len]} colour={M.speed} width={3.4} />
    </g>)}
    <Chip x={240} y={100} text="+9.8 m/s" colour={M.speed} />
    <Chip x={240} y={172} text="+9.8 m/s" colour={M.speed} />
    <Lines x={310} y={100} lines={['uniform:', 'same change', 'every second']} size={16} colour={A} />
    <rect x={306} y={196} width={200} height={44} rx="22" fill={P.pdFill} stroke={A} strokeWidth="2" />
    <text x={406} y={224} textAnchor="middle" fontSize="17" fontWeight="800" fill={A}>g ≈ 9.8 m/s²</text>
  </PhysicsDiagram>
}
function Suvat() {
  return <PhysicsDiagram schematic={false} title="For uniform acceleration: v² − u² = 2 × a × s. v is the final velocity and u the starting velocity, both in m/s; a is the acceleration in m/s²; s is the distance in metres. Both velocities are squared.">
    <rect x={120} y={16} width={300} height={60} rx="16" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <Spaced y={57} size={26} items={[['v²', M.speed, 160], ['−', ink, 192], ['u²', M.speed, 224], ['=', ink, 258], ['2', ink, 288], ['×', ink, 312], ['a', A, 336], ['×', ink, 360], ['s', M.distance, 384]]} />
    <UnitBox x={70} y={178} to={[160, 66]} name="v: final" unit="velocity" symbol="m/s" colour={M.speed} w={124} />
    <UnitBox x={202} y={178} to={[224, 66]} name="u: starting" unit="velocity" symbol="m/s" colour={M.speed} w={124} />
    <UnitBox x={334} y={178} to={[336, 66]} name="a:" unit="acceleration" symbol="m/s²" colour={A} w={124} />
    <UnitBox x={466} y={178} to={[384, 66]} name="s:" unit="distance" symbol="m" colour={M.distance} w={124} />
    <Caption text="both velocities are squared" y={270} colour={M.speed} size={15} />
  </PhysicsDiagram>
}
function VanScene() {
  return <g>
    <Road x1={14} x2={246} y={170} />
    <Van x={80} y={170} s={0.8} />
    <Vel x={60} y={98} len={70} label="u = 13 m/s" />
    <Span x1={24} x2={236} y={210} label="s = 36 m" />
    <Tag x={186} y={140} text="v = ?" colour={M.speed} />
    <Tag x={130} y={264} text="a = −2 m/s² (slowing)" colour={A} />
  </g>
}
function WorkedX({ step }: { step: 1 | 2 | 3 }) {
  const titles = [
    'Step 1 of 3: a van at 13 m/s slows down uniformly at 2 m/s² over 36 m. Rearrange v² − u² = 2as by adding u² to both sides: v² = u² + 2as.',
    'Step 2 of 3: slowing down, so a = −2. v² = 13² + (2 × −2 × 36), so v² = 169 − 144 = 25.',
    'Step 3 of 3: take the square root: v = √25 = 5 m/s.',
  ]
  return <PhysicsDiagram title={titles[step - 1]}>
    <StepStrip steps={['rearrange', 'substitute', 'square root']} active={step} colour={A} gap={160} />
    <VanScene />
    <WorkCard>
      {step === 1 && <g>
        <Eq x={395} y={96} size={22} pieces={[['v²', M.speed], [' − '], ['u²', M.speed], [' = 2'], ['a', A], ['s', M.distance]]} />
        <Arrow from={[395, 114]} to={[395, 176]} colour={ink} width={2.6} />
        <Lines x={405} y={138} lines={['add u² to', 'both sides']} size={13} />
        <rect x={296} y={186} width={198} height={48} rx="14" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
        <Eq x={395} y={218} size={22} pieces={[['v²', M.speed], [' = '], ['u²', M.speed], [' + 2'], ['a', A], ['s', M.distance]]} />
      </g>}
      {step >= 2 && <g opacity={step === 2 ? 1 : 0.55}>
        <g opacity=".6"><Eq x={395} y={86} size={18} pieces={[['v²', M.speed], [' = '], ['u²', M.speed], [' + 2'], ['a', A], ['s', M.distance]]} /></g>
        <Eq x={395} y={124} size={17} pieces={[['v²', M.speed], [' = '], ['13²', M.speed], [' + (2 × '], ['−2', A], [' × '], ['36', M.distance], [')']]} />
        <Eq x={395} y={160} size={18} pieces={[['v²', M.speed], [' = 169 − 144']]} />
        <Eq x={395} y={196} size={20} pieces={[['v²', M.speed], [' = 25']]} />
      </g>}
      {step === 3 && <Answer y={254} x={276} w={238} size={21} items={[['v', M.speed, 298], ['= √25 = 5', ink, 374], ['m/s', ink, 470]]} ringX={470} ringW={22} />}
    </WorkCard>
  </PhysicsDiagram>
}

export function AccelerationVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'accel-idea': return <Idea />
    case 'accel-eq': return <EqCard />
    case 'accel-units': return <Units />
    case 'accel-decel': return <Decel />
    case 'accel-w1': return <Worked step={1} />
    case 'accel-w2': return <Worked step={2} />
    case 'accel-w3': return <Worked step={3} />
    case 'accel-w4': return <Worked step={4} />
    case 'accel-est1': return <Estimate />
    case 'accel-est2': return <EstimateBike />
    case 'accel-est3': return <EstimateAnswer />
    case 'accel-uniform': return <Uniform />
    case 'accel-suvat': return <Suvat />
    case 'accel-x1': return <WorkedX step={1} />
    case 'accel-x2': return <WorkedX step={2} />
    case 'accel-x3': return <WorkedX step={3} />
    default: return null
  }
}
