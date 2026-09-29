import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Wire, CurrentArrow, Cell, Lamp, EnergyStoreBadge, TransferArrow, type Pt } from './PhysicsKit'
import { quantity as Qc, quantityFill as Qf, Chip, Card, Runs, Txt, Badge, StepChip, Clock, Arrow, Heat } from './ParallelVisuals'

/*
 * Physics Lesson 24: power of electrical appliances. Original, code-native schematics; not to scale. Focus ids start with
 * 'appower-'. Energy stores use the kit's badges and colours; on every card energy is green, power amber and time steel
 * blue, as in the other electricity lessons. Appliances are soft, simple silhouettes.
 */

const { ink, muted } = P
const body = '#eef2f5', bodyLine = '#5a6b79'

// ---------- Silhouettes ----------

function Kettle({ x, y, s = 1, water = false }: { x: number; y: number; s?: number; water?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-40 50L-33 -30Q-31 -46 -14 -46H18Q34 -46 36 -30L42 50Z" fill={body} stroke={bodyLine} strokeWidth="2.6" />
    {water && <path d="M-37 22L-35 0H38L40 22L42 50H-40Z" fill={P.water} opacity=".8" />}
    <path d="M36 -26Q66 -22 62 8Q58 26 42 28" fill="none" stroke={bodyLine} strokeWidth="5" />
    <path d="M-33 -18L-56 -34" stroke={bodyLine} strokeWidth="7" />
    <rect x={-48} y={50} width={96} height={11} rx="5" fill={bodyLine} />
    <path d="M-14 -46Q2 -60 18 -46" fill="none" stroke={bodyLine} strokeWidth="3" />
  </g>
}
function Toaster({ x, y, dim = false, s = 1 }: { x: number; y: number; dim?: boolean; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} opacity={dim ? .35 : 1}>
    <path d="M-58 44V-14Q-58 -36 -34 -36H34Q58 -36 58 -14V44Z" fill={body} stroke={bodyLine} strokeWidth="2.6" />
    <rect x={-40} y={-42} width={30} height={8} rx="4" fill={bodyLine} /><rect x={10} y={-42} width={30} height={8} rx="4" fill={bodyLine} />
    <path d="M-44 -8H44" stroke={P.panelLine} strokeWidth="2" />
    <rect x={62} y={-2} width={12} height={20} rx="3" fill={bodyLine} />
    <rect x={-62} y={44} width={124} height={8} rx="4" fill={bodyLine} />
  </g>
}
function Microwave({ x, y, w = 150 }: { x: number; y: number; w?: number }) {
  const h = w * .6
  return <g>
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="12" fill={body} stroke={bodyLine} strokeWidth="2.6" />
    <rect x={x - w / 2 + 12} y={y - h / 2 + 12} width={w * .6} height={h - 24} rx="8" fill="#dbe8f0" stroke={bodyLine} strokeWidth="1.8" />
    <circle cx={x + w / 2 - 24} cy={y - 8} r="9" fill="white" stroke={bodyLine} strokeWidth="2" />
    <rect x={x + w / 2 - 34} y={y + 10} width={20} height={8} rx="3" fill={bodyLine} opacity=".7" />
  </g>
}
function Fan({ x, y }: { x: number; y: number }) {
  return <g>
    <rect x={x - 11} y={y + 40} width={22} height={82} rx="11" fill={body} stroke={bodyLine} strokeWidth="2.6" />
    <rect x={x - 7} y={y + 70} width={14} height={30} rx="5" fill={P.chemical} stroke={P.chemicalLine} strokeWidth="1.8" />
    <circle cx={x} cy={y} r="46" fill="white" stroke={bodyLine} strokeWidth="2.6" />
    {[0, 120, 240].map(a => <path key={a} d={`M${x} ${y}c10 -10 32 -24 30 -8c-2 12 -18 12 -30 8z`} transform={`rotate(${a} ${x} ${y})`} fill={P.kinetic} stroke={P.kineticLine} strokeWidth="1.8" />)}
    <circle cx={x} cy={y} r="8" fill={bodyLine} />
    <path d={`M${x - 46} ${y}H${x + 46}M${x} ${y - 46}V${y + 46}`} stroke={bodyLine} strokeWidth="1" opacity=".35" />
  </g>
}
/** A generic appliance: a soft box with a cable and plug. */
function Box({ x, y, variant = 0 }: { x: number; y: number; variant?: number }) {
  const shapes = [
    <rect key="a" x={x - 44} y={y - 40} width={88} height={80} rx="14" fill={body} stroke={bodyLine} strokeWidth="2.6" />,
    <path key="b" d={`M${x - 40} ${y + 40}L${x - 34} ${y - 30}Q${x - 32} ${y - 44} ${x - 16} ${y - 44}H${x + 16}Q${x + 32} ${y - 44} ${x + 34} ${y - 30}L${x + 40} ${y + 40}Z`} fill={body} stroke={bodyLine} strokeWidth="2.6" />,
    <rect key="c" x={x - 50} y={y - 30} width={100} height={70} rx="22" fill={body} stroke={bodyLine} strokeWidth="2.6" />,
  ]
  return <g>
    <path d={`M${x + 30} ${y + 40}Q${x + 44} ${y + 62} ${x + 62} ${y + 58}`} fill="none" stroke={bodyLine} strokeWidth="3" />
    <rect x={x + 60} y={y + 50} width={18} height={16} rx="3" fill="white" stroke={bodyLine} strokeWidth="2" />
    {shapes[variant % 3]}
  </g>
}
/** A small rating plate (sticker). */
function Plate({ x, y, text, w }: { x: number; y: number; text: string; w?: number }) {
  const width = w ?? text.length * 10 + 26
  return <g>
    <rect x={x - width / 2} y={y - 16} width={width} height={32} rx="6" fill="#fffbee" stroke={Qc.P} strokeWidth="2" />
    <text x={x} y={y + 6} textAnchor="middle" fontSize="16" fontWeight="750" fill={Qc.P}>{text}</text>
  </g>
}
/** A mains supply chip with a small plug. */
function MainsChip({ x, y }: { x: number; y: number }) {
  return <g>
    <rect x={x - 74} y={y - 16} width={148} height={32} rx="16" fill="white" stroke={ink} strokeWidth="1.6" />
    <rect x={x - 62} y={y - 10} width={20} height={20} rx="4" fill="#f7f4ee" stroke="#a99d8a" strokeWidth="1.6" />
    <path d={`M${x - 52} ${y - 6}v6M${x - 57} ${y + 5}h4M${x - 51} ${y + 5}h4`} stroke="#a27f1f" strokeWidth="2" />
    <text x={x + 12} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>mains supply</text>
  </g>
}

// ---------- Section: how appliances transfer energy ----------

function LampLoop({ dots = false, dimDots = false }: { dots?: boolean; dimDots?: boolean }) {
  const L = 80, R = 300, T = 70, B = 230, mid = 150
  const dotPts: Pt[] = [[130, T], [180, T], [230, T], [R, 110], [R, 190], [250, B], [200, B], [150, B], [L, 110]]
  return <g>
    <Wire points={[[L, mid], [L, T], [R, T], [R, B], [L, B], [L, mid]]} />
    <rect x={L - 8} y={mid - 8} width={16} height={16} fill="white" />
    <Cell x={L} y={mid} rotate={90} length={50} />
    <Lamp x={R} y={mid} rotate={90} length={44} lit />
    {dots && dotPts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6" fill={P.charge} stroke={P.chargeLine} strokeWidth="1.6" opacity={dimDots ? .35 : 1} />)}
    <CurrentArrow x={255} y={T} /><CurrentArrow x={110} y={B} rotate={180} />
  </g>
}
function Work() {
  return <PhysicsDiagram title="A cell and a lamp. Charges, drawn as small blue dots, move around the circuit. Work is done against the resistance, and work done equals energy transferred.">
    <LampLoop dots />
    <Txt x={190} y={44} lines={['moving charge']} anchor="middle" size={13} colour={P.chargeLine} weight={700} />
    <Card x={340} y={70} w={186} h={70}>
      <Txt x={354} y={98} lines={['work is done', 'against resistance']} size={14} weight={700} />
    </Card>
    <Chip x={433} y={186} text="work done =" colour={P.useful} fill={P.usefulFill} size={13} w={170} />
    <Chip x={433} y={222} text="energy transferred" colour={P.useful} fill={P.usefulFill} size={13} w={170} />
  </PhysicsDiagram>
}
function Electrically() {
  return <PhysicsDiagram title="The same cell and lamp circuit with a green arrow from the cell to the lamp labelled electrically: energy is transferred electrically.">
    <LampLoop dots dimDots />
    <TransferArrow from={[102, 124]} to={[276, 132]} bend={-.28} colour={P.useful} width={4} label="electrically" />
    <Card x={340} y={110} w={186} h={70} highlight={P.useful}>
      <Txt x={354} y={138} lines={['energy transferred', 'electrically']} size={14} weight={750} colour={P.useful} />
    </Card>
  </PhysicsDiagram>
}
function KettleView() {
  return <PhysicsDiagram title="A kettle. Energy is transferred electrically from the mains supply to the thermal store of the heating element. The hot element then heats the water.">
    <Kettle x={140} y={140} s={1.25} water />
    <path d="M100 186Q120 176 140 186T180 186" fill="none" stroke={P.hot} strokeWidth="4" />
    <Heat x={140} y={170} n={3} gap={14} h={20} />
    <MainsChip x={410} y={50} />
    <EnergyStoreBadge store="thermal" x={410} y={176} label="Thermal store of element" />
    <TransferArrow from={[410, 70]} to={[410, 156]} bend={0} colour={P.useful} width={4} label="electrically" />
    <path d="M296 180L184 187" stroke={ink} strokeWidth="1.4" strokeDasharray="4 4" /><circle cx={182} cy={187} r="2.8" fill={ink} />
    <Txt x={140} y={262} lines={['the hot element heats the water']} anchor="middle" size={13} colour={P.hot} weight={700} />
  </PhysicsDiagram>
}
function FanView() {
  return <PhysicsDiagram title="A handheld fan. Energy is transferred electrically from the chemical store of the battery in the handle to the kinetic store of the motor.">
    <Fan x={120} y={100} />
    <EnergyStoreBadge store="kinetic" x={390} y={70} label="Kinetic store (motor)" />
    <EnergyStoreBadge store="chemical" x={390} y={230} label="Chemical store (battery)" />
    <TransferArrow from={[390, 210]} to={[390, 90]} bend={0} colour={P.useful} width={4} label="electrically" />
    <path d="M130 100L292 70" stroke={ink} strokeWidth="1.4" strokeDasharray="4 4" /><circle cx={130} cy={100} r="2.8" fill={ink} />
    <path d="M130 185L286 230" stroke={ink} strokeWidth="1.4" strokeDasharray="4 4" /><circle cx={130} cy={185} r="2.8" fill={ink} />
  </PhysicsDiagram>
}

// ---------- Section: E = P × t ----------

function QBox({ x, y, w, top, unit, colour, fill }: { x: number; y: number; w: number; top: string; unit: string; colour: string; fill: string }) {
  return <g>
    <rect x={x} y={y} width={w} height={62} rx="14" fill={fill} stroke={colour} strokeWidth="2" />
    <text x={x + w / 2} y={y + 27} textAnchor="middle" fontSize="15" fontWeight="750" fill={colour}>{top}</text>
    <text x={x + w / 2} y={y + 48} textAnchor="middle" fontSize="13" fontWeight="650" fill={colour}>{unit}</text>
  </g>
}
function Depends() {
  return <PhysicsDiagram title="An appliance with a power label and a clock. How powerful it is, in watts, times how long it is on, in seconds, gives the energy transferred, in joules.">
    <Toaster x={200} y={96} s={.8} />
    <Plate x={200} y={30} text="800 W" />
    <Clock x={350} y={90} r={32} minutes={20} />
    <QBox x={24} y={186} w={148} top="how powerful" unit="power (W)" colour={Qc.P} fill={Qf.P} />
    <text x={188} y={225} textAnchor="middle" fontSize="24" fontWeight="750" fill={ink}>×</text>
    <QBox x={204} y={186} w={128} top="how long" unit="time (s)" colour={Qc.t} fill={Qf.t} />
    <Arrow from={[340, 217]} to={[368, 217]} colour={ink} width={3} />
    <QBox x={374} y={186} w={156} top="energy" unit="transferred (J)" colour={Qc.E} fill={Qf.E} />
  </PhysicsDiagram>
}
function EqCard({ x = 40, y = 34, w = 460, fill }: { x?: number; y?: number; w?: number; fill?: [string, string, string] }) {
  return <Card x={x} y={y} w={w} h={fill ? 200 : 150}>
    <Runs x={x + w / 2} y={y + 42} runs={[['energy transferred', Qc.E], [' = ', ink], ['power', Qc.P], [' × ', ink], ['time', Qc.t]]} size={17} />
    {([['E', Qc.E, -110], ['=', ink, -55], ['P', Qc.P, 0], ['×', ink, 55], ['t', Qc.t, 110]] as Array<[string, string, number]>).map(([t, c, dx]) =>
      <text key={t} x={x + w / 2 + dx} y={y + 94} textAnchor="middle" fontSize="30" fontWeight="750" fill={c}>{t}</text>)}
    {!fill && <g>
      <Chip x={x + w / 2 - 110} y={y + 126} text="J" colour={Qc.E} fill={Qf.E} size={13} w={40} />
      <Chip x={x + w / 2} y={y + 126} text="W" colour={Qc.P} fill={Qf.P} size={13} w={40} />
      <Chip x={x + w / 2 + 110} y={y + 126} text="s" colour={Qc.t} fill={Qf.t} size={13} w={40} />
    </g>}
    {fill && <Runs x={x + w / 2} y={y + 150} runs={[['E', Qc.E], [' = ', ink], [fill[0], Qc.P], [' × ', ink], [fill[1], Qc.t]]} size={22} />}
    {fill && <Runs x={x + w / 2} y={y + 184} runs={[['E', Qc.E], [' = ', ink], [fill[2], Qc.E]]} size={24} />}
  </Card>
}
function Equation() {
  return <PhysicsDiagram title="Energy transferred = power × time. E = P × t, with energy in joules (J), power in watts (W) and time in seconds (s).">
    <EqCard y={50} />
    <Txt x={270} y={250} lines={['time must be in seconds']} anchor="middle" size={14} colour={Qc.t} weight={750} />
  </PhysicsDiagram>
}
function Timer({ x, y, text }: { x: number; y: number; text: string }) {
  return <g>
    <rect x={x - 50} y={y - 30} width={100} height={60} rx="14" fill="white" stroke={Qc.t} strokeWidth="2.4" />
    <rect x={x - 38} y={y - 19} width={76} height={38} rx="7" fill={Qf.t} />
    <text x={x} y={y + 10} textAnchor="middle" fontSize="26" fontWeight="750" fill={Qc.t}>{text}</text>
    <rect x={x - 10} y={y - 38} width={20} height={8} rx="3" fill={Qc.t} />
  </g>
}
function WorkedTime() {
  return <PhysicsDiagram title="Worked example, step 1. A toaster rated 800 W is used for 2 minutes. Change the time to seconds: 2 × 60 = 120 s.">
    <StepChip x={20} y={28} text="Step 1: time in seconds" colour={Qc.t} />
    <Toaster x={110} y={150} />
    <Plate x={110} y={232} text="800 W" />
    <Timer x={262} y={140} text="2:00" />
    <Txt x={262} y={196} lines={['2 minutes']} anchor="middle" size={14} weight={750} colour={Qc.t} />
    <Card x={340} y={96} w={186} h={96} highlight={Qc.t}>
      <Txt x={433} y={126} lines={['60 s in a minute']} anchor="middle" size={13} colour={muted} weight={650} />
      <Runs x={433} y={164} runs={[['2 × 60 = 120 s', Qc.t]]} size={19} />
    </Card>
  </PhysicsDiagram>
}
function WorkedSub() {
  return <PhysicsDiagram viewBox="0 0 540 300" title="Worked example, step 2. E = P × t = 800 × 120 = 96 000 J. The toaster is shown faded to the side.">
    <StepChip x={20} y={28} text="Step 2: substitute" colour={Qc.E} />
    <Toaster x={80} y={180} dim s={.8} />
    <EqCard x={160} y={50} w={364} fill={['800', '120', '96 000 J']} />
  </PhysicsDiagram>
}

// ---------- Section: power ratings ----------

function Rating() {
  return <PhysicsDiagram title="A kettle with a rating plate reading 2000 W. The power rating is the maximum safe power.">
    <Kettle x={150} y={140} s={1.3} />
    <Plate x={150} y={160} text="2000 W" />
    <Leaderline from={[196, 160]} to={[330, 150]} />
    <Card x={332} y={112} w={190} h={76} highlight={Qc.P}>
      <Txt x={348} y={142} lines={['power rating:', 'maximum safe power']} size={14} weight={750} colour={Qc.P} />
    </Card>
  </PhysicsDiagram>
}
function Leaderline({ from, to }: { from: Pt; to: Pt }) {
  return <g><path d={`M${from[0]} ${from[1]}L${to[0]} ${to[1]}`} stroke={Qc.P} strokeWidth="1.6" /><circle cx={from[0]} cy={from[1]} r="2.8" fill={Qc.P} /></g>
}
function Bar({ x, y, frac, colour, fill, label, max = 200 }: { x: number; y: number; frac: number; colour: string; fill: string; label: string; max?: number }) {
  return <g>
    <rect x={x} y={y} width={max} height={20} rx="10" fill="white" stroke={P.panelLine} strokeWidth="1.4" />
    <rect x={x} y={y} width={max * frac} height={20} rx="10" fill={fill} stroke={colour} strokeWidth="1.8" />
    <text x={x + max + 10} y={y + 15} fontSize="13" fontWeight="700" fill={colour}>{label}</text>
  </g>
}
function TwoMicrowaves({ mode }: { mode: 'cost' | 'faster' }) {
  const rows: Array<[string, number]> = [['600 W', 600], ['850 W', 850]]
  return <PhysicsDiagram viewBox="0 0 540 300" title={mode === 'cost'
    ? 'Two microwaves rated 600 W and 850 W, each used for 5 minutes. The 850 W microwave has the longer energy bar: in the same time, more power means more energy transferred.'
    : 'The same two microwaves doing the same job. The 850 W microwave has the shorter time bar: higher power transfers energy faster, so it needs less time.'}>
    {rows.map(([label, p], i) => { const y = 58 + i * 112; return <g key={label}>
      <Microwave x={84} y={y} w={112} />
      <Plate x={84} y={y + 50} text={label} />
      {mode === 'cost'
        ? <g><Bar x={170} y={y - 30} frac={1} colour={Qc.t} fill={Qf.t} label="5 min" max={180} />
          <Bar x={170} y={y + 6} frac={p / 850} colour={Qc.E} fill={Qf.E} label={p === 850 ? 'more energy' : 'energy'} max={180} /></g>
        : <g><Bar x={170} y={y - 30} frac={1} colour={Qc.E} fill={Qf.E} label="same job" max={180} />
          <Bar x={170} y={y + 6} frac={600 / p} colour={Qc.t} fill={Qf.t} label={p === 850 ? 'less time' : 'time'} max={180} /></g>}
    </g> })}
    <Card x={40} y={252} w={460} h={40} highlight={mode === 'cost' ? Qc.E : Qc.t}>
      <Txt x={270} y={278} lines={[mode === 'cost' ? 'same time: more power, more energy' : 'higher power: faster, so less time']} anchor="middle" size={15} weight={750} colour={mode === 'cost' ? Qc.E : Qc.t} />
    </Card>
  </PhysicsDiagram>
}

// ---------- On your own ----------

function QLabels() {
  const plates = ['400 W', '2200 W', '1100 W']
  return <PhysicsDiagram title="Three numbered appliances with power ratings.">
    {plates.map((t, i) => { const x = 90 + i * 180; return <g key={t}>
      <Box x={x} y={150} variant={i} />
      <Plate x={x} y={150} text={t} />
      <Badge x={x - 62} y={88} n={i + 1} />
    </g> })}
  </PhysicsDiagram>
}

export function AppliancePowerVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  const views: Record<string, () => ReactNode> = {
    'appower-work': Work,
    'appower-electrically': Electrically,
    'appower-kettle': KettleView,
    'appower-fan': FanView,
    'appower-depends': Depends,
    'appower-equation': Equation,
    'appower-worked-time': WorkedTime,
    'appower-worked-sub': WorkedSub,
    'appower-rating': Rating,
    'appower-cost': () => <TwoMicrowaves mode="cost" />,
    'appower-faster': () => <TwoMicrowaves mode="faster" />,
    'appower-q-labels': QLabels,
  }
  const View = views[focus]
  return View ? <View /> : null
}
