import { useId, type ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, Leader, EnergyStoreBadge, TransferArrow, type Pt } from './PhysicsKit'
import { Num, Tick, CrossMark, Car, Thermometer, Arrow } from './EnergyStoreVisuals'
import { Magnifier } from './GasParticleVisuals'
import { WaveArrow, emGroups, waveColour, r1 } from './EmSpectrumVisuals'

/*
 * Physics Lesson 58: Uses of radio waves, microwaves and infrared. Original, code-native schematics; not to scale.
 * Focus ids start with 'emuse-'.
 *
 * EM waves are the wavy arrows of the EM spectrum lesson, in the same group colours: radio waves blue with long
 * gentle waves, microwaves teal with tighter waves, infrared warm red with small waves. Energy going into a store
 * uses the PhysicsKit thermal badge. Hot is red, cold is blue.
 */
const { ink, muted } = P
const radio = emGroups.radio.line, micro = emGroups.micro.line, ir = waveColour.ir
const ground = '#eef2e6', groundLine = '#b9c7a8', grass = '#cfe6c2', grassLine = '#7fae76'
const wall = '#f3ece2', wallLine = '#a88c6c', roof = '#d98f7a', roofLine = '#a5634a'
const metal = '#dfe5ea', metalLine = '#7d8e9c'

/* ---------- Pieces ---------- */

/** A lattice transmitter mast; (x, y) is its base. */
function Mast({ x, y, h = 150 }: { x: number; y: number; h?: number }) {
  const top = y - h, w = h * 0.2
  const rungs = 6
  let brace = ''
  for (let k = 0; k < rungs; k++) {
    const y0 = y - (h - 10) * k / rungs, y1 = y - (h - 10) * (k + 1) / rungs
    const hw0 = w * (1 - k / rungs) + 3, hw1 = w * (1 - (k + 1) / rungs) + 3
    brace += `M${r1(x - hw0)} ${r1(y0)}L${r1(x + hw1)} ${r1(y1)}M${r1(x + hw0)} ${r1(y0)}L${r1(x - hw1)} ${r1(y1)}M${r1(x - hw1)} ${r1(y1)}H${r1(x + hw1)}`
  }
  return <g>
    <path d={brace} stroke={metalLine} strokeWidth="1.3" fill="none" />
    <path d={`M${x - w - 3} ${y}L${x - 3} ${top + 10}M${x + w + 3} ${y}L${x + 3} ${top + 10}`} stroke="#5a6b79" strokeWidth="2.6" />
    <path d={`M${x} ${top + 10}V${top}`} stroke="#5a6b79" strokeWidth="2.6" />
    <circle cx={x} cy={top} r="4.5" fill={P.thermal} stroke={P.thermalLine} strokeWidth="1.5" />
  </g>
}
/** A small house; (x, y) is the middle of its base. `aerial` adds a TV aerial on the roof. */
function House({ x, y, s = 1, aerial = true, colours }: { x: number; y: number; s?: number; aerial?: boolean; colours?: { wall: string; roof: string; window: string; door: string } }) {
  const c = colours ?? { wall, roof, window: '#e8f4fb', door: '#9cc3d9' }
  const line = colours ? '#3b3f58' : wallLine
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    {aerial && <g stroke="#5a6b79" strokeWidth="2" fill="none"><path d="M18 -62V-86" /><path d="M8 -84H28M10 -78H26M12 -72H24" /></g>}
    <path d="M-36 0V-44H36V0Z" fill={c.wall} stroke={line} strokeWidth="2" />
    <path d="M-44 -42L0 -74L44 -42Z" fill={c.roof} stroke={colours ? line : roofLine} strokeWidth="2" />
    <rect x="-26" y="-34" width="16" height="14" rx="2" fill={c.window} stroke={line} strokeWidth="1.5" />
    <rect x="10" y="-34" width="16" height="14" rx="2" fill={c.window} stroke={line} strokeWidth="1.5" />
    <rect x="-7" y="-22" width="14" height="22" rx="2" fill={c.door} stroke={line} strokeWidth="1.5" />
  </g>
}
/** A dish aerial on a short post; (x, y) is the foot of the post; `face` is the angle (degrees) the dish points. */
function Dish({ x, y, face = -60, s = 1 }: { x: number; y: number; face?: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0V-22" stroke="#5a6b79" strokeWidth="4" />
    <path d="M-10 0H10" stroke="#5a6b79" strokeWidth="4" />
    <g transform={`translate(0 -24) rotate(${face + 90})`}>
      <path d="M-22 -4Q0 16 22 -4Z" fill={metal} stroke={metalLine} strokeWidth="2" />
      <path d="M0 5V-16" stroke={metalLine} strokeWidth="1.8" />
      <circle cx="0" cy="-17" r="3" fill={metalLine} />
    </g>
  </g>
}
function Satellite({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    {[-1, 1].map(k => <g key={k}>
      <path d={`M${k * 18} 0H${k * 26}`} stroke={metalLine} strokeWidth="2.4" />
      <rect x={k > 0 ? 26 : -70} y={-11} width={44} height={22} rx="2" fill="#bcd0ea" stroke="#4f6fa6" strokeWidth="1.8" />
      <path d={`M${k > 0 ? 41 : -55} -11V11M${k > 0 ? 55 : -41} -11V11M${k > 0 ? 26 : -70} 0h44`} stroke="#4f6fa6" strokeWidth="1" />
    </g>)}
    <rect x="-18" y="-16" width="36" height="32" rx="6" fill="#f0e3c4" stroke="#a88c3c" strokeWidth="2" />
    <path d="M-8 16Q0 28 8 16" fill={metal} stroke={metalLine} strokeWidth="1.8" />
  </g>
}
/** The Earth's curved surface along the bottom, with the atmosphere as a pale band. */
function EarthCurve({ atmosphere = true }: { atmosphere?: boolean }) {
  return <g>
    {atmosphere && <path d="M-10 196Q270 128 550 196V300H-10Z" fill="#e3f0f9" />}
    <path d="M-10 250Q270 190 550 250V300H-10Z" fill={grass} stroke={grassLine} strokeWidth="2" />
    <path d="M-10 272Q270 214 550 272V300H-10Z" fill="#b7d6a8" opacity=".6" />
  </g>
}
function TV({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x="-24" y="-34" width="48" height="32" rx="4" fill="#3b5163" stroke="#26394a" strokeWidth="2" />
    <rect x="-19" y="-29" width="38" height="22" rx="2" fill="#8fc2e6" />
    <path d="M-12 -10L-2 -22L6 -14L12 -20L19 -10Z" fill="#cfe6c2" />
    <path d="M-10 0H10M0 -2V0" stroke="#26394a" strokeWidth="3" />
  </g>
}

/* ---------- Section 2: radio waves ---------- */

function RadioScene() {
  return <PhysicsDiagram title="A transmitter mast sends radio waves to the aerial on a house and to a radio in a car. The waves carry the programme without wires.">
    <path d="M10 250Q270 244 530 250" stroke={groundLine} strokeWidth="2.2" fill="none" />
    <Mast x={80} y={250} h={176} />
    <WaveArrow from={[96, 82]} to={[386, 150]} wavelength={52} amp={9} colour={radio} width={2.8} />
    <WaveArrow from={[96, 98]} to={[330, 206]} wavelength={52} amp={9} colour={radio} width={2.8} />
    <House x={440} y={250} s={1.1} />
    <Car x={320} y={250} s={.9} />
    <path d="M338 214l12 -22" stroke="#5a6b79" strokeWidth="2" />
    <Lines x={80} y={278} anchor="middle" lines={['transmitter']} size={15} />
    <Lines x={200} y={72} lines={['radio waves']} size={15} colour={radio} />
    <Leader from={[492, 124]} to={[460, 164]} />
    <Lines x={496} y={120} anchor="middle" lines={['aerial']} size={15} />
    <Lines x={320} y={278} anchor="middle" lines={['car radio']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

function Hill() {
  return <path d="M232 250Q262 150 300 120Q334 96 366 134Q398 176 420 250Z" fill={grass} stroke={grassLine} strokeWidth="2" />
}
function ShortScene() {
  return <PhysicsDiagram title="Shorter-wavelength radio waves travel in straight lines. A house in direct sight of the mast receives them; a house behind a hill does not, because the hill is in the way.">
    <path d="M10 250Q270 244 530 250" stroke={groundLine} strokeWidth="2.2" fill="none" />
    <Hill />
    <Mast x={60} y={250} h={150} />
    <House x={190} y={250} s={.85} />
    <House x={478} y={250} s={.85} />
    <WaveArrow from={[74, 108]} to={[196, 172]} wavelength={16} amp={6} colour={radio} />
    <WaveArrow from={[74, 96]} to={[298, 128]} wavelength={16} amp={6} colour={radio} />
    <Tick x={190} y={128} />
    <CrossMark x={318} y={96} />
    <Lines x={478} y={150} anchor="middle" lines={['no signal']} size={13} weight={650} colour={muted} />
    <Lines x={270} y={32} anchor="middle" lines={['short waves: direct sight, short distance']} size={15} />
    <Lines x={190} y={278} anchor="middle" lines={['in direct sight']} size={13} weight={650} colour={muted} />
    <Lines x={478} y={278} anchor="middle" lines={['behind the hill']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

/** A wave squiggle following a circular arc (centre c, radius R) from angle a0 to a1 (degrees), with an arrowhead. */
function ArcWave({ c, R, a0, a1, wavelength, amp, colour, width = 2.8 }: { c: Pt; R: number; a0: number; a1: number; wavelength: number; amp: number; colour: string; width?: number }) {
  const rad = (d: number) => d * Math.PI / 180
  const arcLen = Math.abs(rad(a1 - a0)) * R, dir = a1 > a0 ? 1 : -1
  const stopAt = arcLen - 16
  let d = ''
  for (let t = 0; t <= stopAt; t += 2) {
    const a = rad(a0) + dir * t / R, rr = R + Math.sin(t / wavelength * Math.PI * 2) * amp
    d += `${d ? 'L' : 'M'}${r1(c[0] + Math.cos(a) * rr)} ${r1(c[1] + Math.sin(a) * rr)}`
  }
  const aEnd = rad(a1), tip: Pt = [c[0] + Math.cos(aEnd) * R, c[1] + Math.sin(aEnd) * R]
  const aBase = rad(a0) + dir * stopAt / R, base: Pt = [c[0] + Math.cos(aBase) * R, c[1] + Math.sin(aBase) * R]
  return <g>
    <path d={d} stroke={colour} strokeWidth={width} fill="none" />
    <Arrow from={base} to={tip} colour={colour} width={width} />
  </g>
}
function LongScene() {
  const c: Pt = [270, 196], R = 96
  const clip = useId()
  return <PhysicsDiagram title="Long-wavelength radio waves can travel a long way. A wave from a mast on one side of the Earth travels around to a house on the other side.">
    <clipPath id={clip}><circle cx={c[0]} cy={c[1]} r={R} /></clipPath>
    <circle cx={c[0]} cy={c[1]} r={R} fill="#cfe6f5" stroke={P.waterLine} strokeWidth="2.2" />
    <g clipPath={`url(#${clip})`} fill={grass} stroke={grassLine} strokeWidth="1.6">
      <path d="M190 130Q220 110 250 124Q262 150 236 170Q214 190 196 170Q176 150 190 130Z" />
      <path d="M288 206Q320 190 348 214Q356 250 322 270Q296 258 290 236Z" />
      <path d="M300 110Q326 100 344 122Q334 140 312 134Z" />
    </g>
    <g transform={`rotate(-58 ${c[0]} ${c[1]})`}><Mast x={c[0]} y={c[1] - R + 2} h={44} /></g>
    <g transform={`rotate(58 ${c[0]} ${c[1]})`}><House x={c[0]} y={c[1] - R + 2} s={.5} /></g>
    <ArcWave c={c} R={R + 58} a0={-140} a1={-40} wavelength={46} amp={9} colour={radio} />
    <Lines x={270} y={24} anchor="middle" lines={['longer waves travel further, even around the world']} size={15} />
    <Lines x={96} y={138} anchor="middle" lines={['mast']} size={13} weight={650} colour={muted} />
    <Lines x={444} y={138} anchor="middle" lines={['far away']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

function Phone({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x="-22" y="-42" width="44" height="84" rx="9" fill="#3b5163" stroke="#26394a" strokeWidth="2" />
    <rect x="-17" y="-34" width="34" height="62" rx="3" fill="#a6cdef" />
    <path d="M-8 -14h16M-8 -6h10M-8 2h14" stroke="white" strokeWidth="2.4" opacity=".8" />
    <circle cx="0" cy="35" r="3" fill="#8a9aa7" />
  </g>
}
function Headphones({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-34 10V-4A34 34 0 0 1 34 -4V10" stroke="#5a6b79" strokeWidth="6" fill="none" />
    <rect x="-44" y="0" width="20" height="36" rx="9" fill="#e4d6f2" stroke="#7a56a6" strokeWidth="2" />
    <rect x="24" y="0" width="20" height="36" rx="9" fill="#e4d6f2" stroke="#7a56a6" strokeWidth="2" />
  </g>
}
function BluetoothScene() {
  return <PhysicsDiagram title="Bluetooth: a phone sends very short radio waves to wireless headphones a short distance away, without wires.">
    <Phone x={170} y={140} />
    <Headphones x={372} y={124} />
    {[-14, 14].map((dy, i) => <WaveArrow key={i} from={[204, 136 + dy]} to={[322, 136 + dy]} wavelength={10} amp={4.5} colour={radio} width={2.2} />)}
    <path d="M170 204V222M372 204V222M170 213H372" stroke={muted} strokeWidth="1.8" />
    <Lines x={271} y={240} anchor="middle" lines={['very short distance']} size={13} weight={650} colour={muted} />
    <Lines x={270} y={36} anchor="middle" lines={['Bluetooth: very short waves, very short distance']} size={15} />
  </PhysicsDiagram>
}

/* ---------- Section 3: satellites ---------- */

const D1: Pt = [96, 224], D2: Pt = [444, 224], SAT: Pt = [270, 58]
function SatScene({ step, question = false }: { step: number; question?: boolean }) {
  const up = { from: [D1[0] + 14, D1[1] - 40] as Pt, to: [SAT[0] - 22, SAT[1] + 26] as Pt }
  const down = { from: [SAT[0] + 22, SAT[1] + 26] as Pt, to: [D2[0] - 14, D2[1] - 40] as Pt }
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const m1 = mid(up.from, up.to), m2 = mid(down.from, down.to)
  const titles = [
    'A dish on the ground sends a microwave signal up through the atmosphere to a satellite. Arrow 1: signal sent up.',
    'The satellite sends the signal back down towards Earth in a different direction. Arrow 2.',
    'A second dish on the ground, far from the first, receives the signal, and the programme appears on a TV.',
  ]
  return <PhysicsDiagram title={question ? 'A dish on the ground, a satellite, and a second dish, with two numbered arrows.' : titles[step - 1]}>
    <EarthCurve />
    {!question && <Lines x={270} y={204} anchor="middle" lines={['atmosphere']} size={13} weight={650} colour="#4f86ad" />}
    <Satellite x={SAT[0]} y={SAT[1]} />
    <Dish x={D1[0]} y={D1[1]} face={-55} />
    {(step >= 3 || question) && <Dish x={D2[0]} y={D2[1]} face={-125} />}
    <WaveArrow from={up.from} to={up.to} wavelength={14} amp={5} colour={micro} />
    {(step >= 2 || question) && <WaveArrow from={down.from} to={down.to} wavelength={14} amp={5} colour={micro} />}
    <Num n={1} x={r1(m1[0] - 22)} y={r1(m1[1] - 14)} state={step === 1 && !question ? 'active' : 'on'} colour={ink} />
    {(step >= 2 || question) && <Num n={2} x={r1(m2[0] + 22)} y={r1(m2[1] - 14)} state={step === 2 && !question ? 'active' : 'on'} colour={ink} />}
    {!question && <g>
      <Lines x={SAT[0] + 78} y={SAT[1] + 5} lines={['satellite']} size={13} weight={650} colour={muted} />
      <Lines x={40} y={80} lines={['signal', 'sent up']} size={step === 1 ? 15 : 13} colour={step === 1 ? micro : muted} />
      {step >= 2 && <Lines x={500} y={80} anchor="end" lines={['sent back in a', 'different direction']} size={step === 2 ? 15 : 13} colour={step === 2 ? micro : muted} />}
      {step >= 3 && <g>
        <TV x={496} y={250} />
        <Lines x={444} y={284} anchor="middle" lines={['dish receives the signal']} size={14} />
      </g>}
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 4: microwave oven ---------- */

function Oven({ children, food = 'plain' }: { children?: ReactNode; food?: 'plain' | 'spots' | 'hot' }) {
  const grad = useId()
  return <g>
    <defs><radialGradient id={grad} cx=".5" cy=".6" r=".6"><stop offset="0" stopColor="#f5a66f" /><stop offset="1" stopColor="#f8cda0" /></radialGradient></defs>
    <rect x={24} y={50} width={330} height={210} rx="16" fill="#e7eaec" stroke="#6d7f8e" strokeWidth="2.4" />
    <rect x={40} y={66} width={228} height={178} rx="8" fill="#fbfcfd" stroke="#8a9aa7" strokeWidth="2" />
    <rect x={280} y={66} width={60} height={178} rx="8" fill="#d5dbe2" stroke="#8a9aa7" strokeWidth="1.6" />
    <rect x={290} y={78} width={40} height={20} rx="3" fill="#3b5163" />
    {[120, 150, 180].map(y => <circle key={y} cx={310} cy={y} r="9" fill="white" stroke="#8a9aa7" strokeWidth="1.6" />)}
    {/* plate and bowl of food */}
    <path d="M70 232H238" stroke="#b9c3cc" strokeWidth="5" />
    <path d="M94 194H214Q210 228 180 228H128Q98 228 94 194Z" fill="white" stroke="#8a9aa7" strokeWidth="2" />
    <path d="M98 194Q154 174 210 194Z" fill={food === 'hot' ? `url(#${grad})` : '#f3d9a8'} stroke="#c49a5a" strokeWidth="1.8" />
    {food !== 'hot' && [[124, 190], [150, 185], [178, 189], [198, 191]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill={food === 'spots' ? P.hotFill : P.water} stroke={food === 'spots' ? P.hot : P.waterLine} strokeWidth="1.4" />)}
    {children}
  </g>
}
function OvenScene({ step }: { step: number }) {
  const titles = [
    'A microwave oven cut open to show a bowl of food inside. Microwaves travel from the oven wall into the food. The food contains water, which absorbs the microwaves.',
    'Close up of the water in the food. Energy carried by the microwaves is transferred to the water molecules, so they move faster and heat up.',
    'The hot water heats the rest of the food around it. The whole food heats up and cooks.',
  ]
  const waves = [[60, 90, 110, 172], [150, 76, 150, 170], [250, 96, 200, 172]]
  return <PhysicsDiagram title={titles[step - 1]}>
    <Oven food={step === 3 ? 'hot' : step === 2 ? 'spots' : 'plain'}>
      {step < 3 && waves.map(([x1, y1, x2, y2], i) => <WaveArrow key={i} from={[x1, y1]} to={[x2, y2]} wavelength={13} amp={4.5} colour={micro} width={2.3} opacity={step === 2 ? .45 : 1} />)}
      {step === 3 && [[118, 176], [154, 170], [190, 176]].map(([x, y], i) => <path key={i} d={`M${x} ${y}c-6 -8 6 -12 0 -20s6 -12 0 -20`} stroke={P.hot} strokeWidth="2.2" fill="none" opacity=".75" />)}
    </Oven>
    {step === 1 && <g>
      <Lines x={140} y={36} anchor="middle" lines={['microwaves']} size={15} colour={micro} />
      <Leader from={[372, 176]} to={[190, 188]} colour={P.waterLine} />
      <Lines x={378} y={172} lines={['food contains', 'water']} size={15} colour={P.waterLine} />
      <Lines x={378} y={226} lines={['the water absorbs', 'the microwaves']} size={13} weight={650} colour={muted} />
    </g>}
    {step === 2 && <g>
      <Magnifier cx={448} cy={124} r={70} from={[178, 189]}>
        <rect x={370} y={50} width={160} height={150} fill="#eef6fb" />
        {[[420, 96], [466, 88], [440, 138], [490, 132], [404, 150], [470, 172]].map(([x, y], i) => <g key={i}>
          <circle cx={x} cy={y} r="11" fill={P.water} stroke={P.waterLine} strokeWidth="2" />
          <path d={`M${x - 16} ${y - 8}l-7 -4M${x - 17} ${y + 2}h-8`} stroke={P.hot} strokeWidth="2" />
        </g>)}
      </Magnifier>
      <EnergyStoreBadge store="thermal" x={448} y={228} label="Thermal store" />
      <Lines x={448} y={262} anchor="middle" lines={['energy to the water', 'molecules: they heat up']} size={13} />
    </g>}
    {step === 3 && <g>
      <Lines x={378} y={136} lines={['the rest of the', 'food heats up', 'and cooks']} size={15} colour={P.hot} />
      <Lines x={140} y={36} anchor="middle" lines={['hot water warms the food around it']} size={13} weight={650} colour={muted} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 5: infrared ---------- */

function Kettle({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-40 0Q-46 -60 -26 -74H26Q46 -60 40 0Z" fill={P.hotFill} stroke={P.hot} strokeWidth="2.4" />
    <path d="M40 -46Q62 -44 58 -20Q56 -8 42 -8" stroke={P.hot} strokeWidth="5" fill="none" />
    <path d="M-40 -46L-62 -64" stroke={P.hot} strokeWidth="7" />
    <rect x="-16" y="-84" width="32" height="10" rx="4" fill="#e7eaec" stroke="#7d8e9c" strokeWidth="1.8" />
    <g stroke="#b9c3cc" strokeWidth="2.2" fill="none"><path d="M-66 -70c-6 -8 6 -12 0 -22" /><path d="M-56 -76c-6 -8 6 -12 0 -22" /></g>
  </g>
}
function Jug({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-30 0L-34 -70H30L26 0Z" fill={P.coldFill} stroke={P.cold} strokeWidth="2.4" />
    <path d="M-32 -48H28" stroke={P.cold} strokeWidth="1.4" opacity=".6" />
    <path d="M30 -60Q48 -56 44 -34Q42 -22 28 -22" stroke={P.cold} strokeWidth="5" fill="none" />
    <rect x="-18" y="-40" width="14" height="14" rx="2" fill="white" stroke={P.cold} strokeWidth="1.4" />
  </g>
}
function IrOut() {
  return <PhysicsDiagram title="A hot kettle gives out lots of infrared radiation; a cold jug gives out only a little. All objects give out infrared, and hotter objects give out more.">
    <path d="M10 234H530" stroke={groundLine} strokeWidth="2.2" />
    <Kettle x={140} y={232} />
    {[[-40, -150], [0, -170], [40, -150], [70, -110], [-70, -110]].map(([dx, dy], i) => {
      const a = Math.atan2(dy, dx), from: Pt = [140 + Math.cos(a) * 62, 190 + Math.sin(a) * 62], to: Pt = [140 + Math.cos(a) * 150, 190 + Math.sin(a) * 138]
      return <WaveArrow key={i} from={from} to={to} wavelength={11} amp={4.5} colour={ir} width={3} />
    })}
    <Jug x={410} y={232} />
    {[[-30, -150], [30, -150]].map(([dx, dy], i) => {
      const a = Math.atan2(dy, dx), from: Pt = [410 + Math.cos(a) * 64, 196 + Math.sin(a) * 64], to: Pt = [410 + Math.cos(a) * 104, 196 + Math.sin(a) * 104]
      return <WaveArrow key={i} from={from} to={to} wavelength={11} amp={3.5} colour={ir} width={1.8} opacity={.8} />
    })}
    <Lines x={140} y={264} anchor="middle" lines={['hot: lots of infrared']} size={15} colour={P.hot} />
    <Lines x={410} y={264} anchor="middle" lines={['cold: a little']} size={15} colour={P.cold} />
  </PhysicsDiagram>
}
function IrIn() {
  return <PhysicsDiagram title="An object absorbs infrared radiation. Energy is transferred to its thermal energy store and it warms up; the thermometer reading rises.">
    {[-40, 0, 40].map((dy, i) => <WaveArrow key={i} from={[30, 150 + dy]} to={[196, 150 + dy]} wavelength={11} amp={4.5} colour={ir} width={2.8} />)}
    <rect x={206} y={96} width={110} height={110} rx="18" fill="#6d7f8e" stroke="#3b5163" strokeWidth="2.2" />
    <ellipse cx={261} cy={151} rx="66" ry="66" fill={P.thermal} opacity=".35" />
    <Thermometer x={374} y={214} h={130} level={.72} />
    <Arrow from={[396, 180]} to={[396, 118]} colour={P.hot} width={2.6} />
    <EnergyStoreBadge store="thermal" x={450} y={48} label="Thermal store" />
    <TransferArrow from={[300, 94]} to={[400, 58]} bend={-0.25} colour={P.thermalLine} width={3} />
    <Lines x={112} y={90} anchor="middle" lines={['infrared']} size={15} colour={ir} />
    <Lines x={270} y={262} anchor="middle" lines={['absorbed: energy to the thermal store, warms up']} size={14} />
  </PhysicsDiagram>
}
function IrCamera() {
  const grad = useId()
  const hotHouse = { wall: '#5d6fb8', roof: '#e0543e', window: '#f7c64a', door: '#e98a4a' }
  return <PhysicsDiagram title="An infrared camera image of a house: the roof and windows show red and yellow where energy is being lost. Beside it, a warm animal shows up brightly in the dark. Redder means more infrared.">
    <defs><linearGradient id={grad} x1="0" x2="1"><stop offset="0" stopColor="#3b3f8f" /><stop offset=".35" stopColor="#6a5fc1" /><stop offset=".65" stopColor="#e0543e" /><stop offset="1" stopColor="#f7d24a" /></linearGradient></defs>
    <rect x={20} y={30} width={250} height={200} rx="16" fill="#26305e" />
    <House x={138} y={214} s={1.8} aerial={false} colours={hotHouse} />
    <Arrow from={[150, 86]} to={[150, 44]} colour="#f7d24a" width={2.6} />
    <Arrow from={[92, 104]} to={[70, 66]} colour="#f7d24a" width={2.6} />
    <Lines x={176} y={56} lines={['energy', 'being lost']} size={13} colour="white" />
    {/* camera */}
    <g transform="translate(250 262)"><rect x="-22" y="-14" width="44" height="28" rx="6" fill="#3b5163" /><circle r="9" fill="#8fc2e6" stroke="#26394a" strokeWidth="2" /><rect x="-12" y="-19" width="14" height="6" rx="2" fill="#3b5163" /></g>
    <Lines x={200} y={266} anchor="end" lines={['infrared camera']} size={13} weight={650} colour={muted} />
    {/* dark panel with an animal */}
    <rect x={290} y={30} width={230} height={140} rx="16" fill="#1f2433" />
    <g transform="translate(404 120)">
      <ellipse cx="0" cy="0" rx="40" ry="22" fill="#e0543e" />
      <ellipse cx="0" cy="-2" rx="26" ry="12" fill="#f7a64a" />
      <circle cx="44" cy="-18" r="16" fill="#e0543e" /><circle cx="46" cy="-18" r="9" fill="#f7d24a" />
      <path d="M36 -30L40 -44L48 -32M50 -32L58 -42L58 -26" fill="#e0543e" />
      <path d="M-38 4Q-64 0 -70 -20" stroke="#6a5fc1" strokeWidth="9" fill="none" />
      <path d="M-24 18V32M-8 20V34M14 20V34M28 18V32" stroke="#e0543e" strokeWidth="7" />
    </g>
    <Lines x={405} y={58} anchor="middle" lines={['hot objects in the dark']} size={13} colour="white" />
    {/* key */}
    <rect x={300} y={196} width={210} height={16} rx="8" fill={`url(#${grad})`} />
    <Lines x={300} y={232} lines={['less']} size={12} weight={650} colour={muted} />
    <Lines x={510} y={232} anchor="end" lines={['more infrared']} size={12} weight={650} colour={muted} />
    <Lines x={405} y={264} anchor="middle" lines={['redder = more infrared']} size={14} />
  </PhysicsDiagram>
}
function IrHeat() {
  return <PhysicsDiagram title="Two uses of infrared: an electric heater gives out infrared that warms a room, and the glowing element in a toaster gives out infrared that cooks the bread.">
    <rect x={20} y={24} width={244} height={226} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <rect x={276} y={24} width={244} height={226} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    {/* heater */}
    <rect x={40} y={100} width={70} height={110} rx="10" fill="#e7eaec" stroke="#6d7f8e" strokeWidth="2.2" />
    {[124, 150, 176].map(y => <path key={y} d={`M52 ${y}H98`} stroke={P.hot} strokeWidth="6" />)}
    {[124, 150, 176].map(y => <path key={`g${y}`} d={`M52 ${y}H98`} stroke="#f7c64a" strokeWidth="2" />)}
    <path d="M50 210v12M100 210v12" stroke="#6d7f8e" strokeWidth="4" />
    {[110, 150, 190].map((y, i) => <WaveArrow key={i} from={[120, y]} to={[240, y - 10 + i * 10]} wavelength={11} amp={4.5} colour={ir} width={2.6} />)}
    <Lines x={142} y={62} anchor="middle" lines={['electric heater']} size={14} />
    <Lines x={142} y={238} anchor="middle" lines={['warms a room']} size={15} colour={P.hot} />
    {/* toaster, cut open */}
    <path d="M300 214V134Q300 116 318 116H478Q496 116 496 134V214Z" fill="#e7eaec" stroke="#6d7f8e" strokeWidth="2.2" />
    <rect x={338} y={96} width={40} height={70} rx="8" fill="#f3d9a8" stroke="#c49a5a" strokeWidth="2" />
    <rect x={418} y={96} width={40} height={70} rx="8" fill="#f3d9a8" stroke="#c49a5a" strokeWidth="2" />
    {[322, 398, 474].map(x => <path key={x} d={`M${x} 130V200`} stroke={P.hot} strokeWidth="5" />)}
    {[322, 398, 474].map(x => <path key={`g${x}`} d={`M${x} 130V200`} stroke="#f7c64a" strokeWidth="1.6" />)}
    {[[326, 150, 336], [394, 150, 382], [402, 150, 414], [470, 150, 460]].map(([x1, y, x2], i) => <WaveArrow key={i} from={[x1, y]} to={[x2, y]} wavelength={5} amp={2.5} colour={ir} width={2} />)}
    <Lines x={398} y={62} anchor="middle" lines={['toaster (cut open)']} size={14} />
    <Lines x={398} y={238} anchor="middle" lines={['cooks toast']} size={15} colour={P.hot} />
  </PhysicsDiagram>
}

export function EmUseVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  const views: Record<string, () => ReactNode> = {
    'emuse-radio': () => <RadioScene />,
    'emuse-short': () => <ShortScene />,
    'emuse-long': () => <LongScene />,
    'emuse-bluetooth': () => <BluetoothScene />,
    'emuse-sat1': () => <SatScene step={1} />,
    'emuse-sat2': () => <SatScene step={2} />,
    'emuse-sat3': () => <SatScene step={3} />,
    'emuse-oven1': () => <OvenScene step={1} />,
    'emuse-oven2': () => <OvenScene step={2} />,
    'emuse-oven3': () => <OvenScene step={3} />,
    'emuse-ir1': () => <IrOut />,
    'emuse-ir2': () => <IrIn />,
    'emuse-ircam': () => <IrCamera />,
    'emuse-irheat': () => <IrHeat />,
    'emuse-q-satellite': () => <SatScene step={3} question />,
  }
  return <>{views[focus]?.() ?? null}</>
}
