import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Wire, Cell, Battery, Lamp, TransferArrow, type Pt } from './PhysicsKit'
import { quantity as Qc, quantityFill as Qf, Chip, Card, Runs, Txt, StepChip, Clock, Arrow, Heat } from './ParallelVisuals'

/*
 * Physics Lesson 25: energy, charge and power (E = QV, P = VI, P = I²R). Original, code-native schematics; not to scale.
 * Focus ids start with 'qv-'. Every equation card uses one colour per quantity, the same as in the other electricity
 * lessons: energy green, charge blue, pd violet, current vermilion, resistance brown, power amber.
 */

const { ink, muted } = P
const body = '#eef2f5', bodyLine = '#5a6b79'

type Sym = [string, string, string?]
/** An equation card: the word equation, then the symbols spaced out with a unit chip under each quantity. */
function EquationCard({ x = 30, y = 40, w = 480, words, syms, size = 16 }: { x?: number; y?: number; w?: number; words: Array<[string, string?]>; syms: Sym[]; size?: number }) {
  const step = Math.min(64, (w - 60) / (syms.length - 1)), cx = x + w / 2
  return <Card x={x} y={y} w={w} h={160}>
    <Runs x={cx} y={y + 40} runs={words} size={size} />
    {syms.map(([t, c, unit], i) => { const sx = cx + (i - (syms.length - 1) / 2) * step; return <g key={i}>
      <text x={sx} y={y + 96} textAnchor="middle" fontSize="30" fontWeight="750" fill={c}>{t}</text>
      {unit && <Chip x={sx} y={y + 130} text={unit} colour={c} fill="white" size={13} w={unit.length * 9 + 26} />}
    </g> })}
  </Card>
}
/** A small meter: circle with a letter, and a reading beside it. */
function Meter({ x, y, letter, reading, colour = P.wire, unknown = false }: { x: number; y: number; letter: 'A' | 'V'; reading?: string; colour?: string; unknown?: boolean }) {
  return <g>
    <circle cx={x} cy={y} r="20" fill="white" stroke={unknown ? muted : P.wire} strokeWidth="2.5" strokeDasharray={unknown ? '5 4' : undefined} />
    <text x={x} y={y + 7} textAnchor="middle" fontSize="20" fontWeight="750" fill={unknown ? muted : P.wire}>{letter}</text>
    {reading && <g>
      <rect x={x + 28} y={y - 15} width={reading.length * 9.5 + 18} height={30} rx="8" fill="white" stroke={colour} strokeWidth="2" />
      <text x={x + 37 + reading.length * 4.75} y={y + 6} textAnchor="middle" fontSize="16" fontWeight="750" fill={colour}>{reading}</text>
    </g>}
  </g>
}

// ---------- Silhouettes ----------

function Hairdryer({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-10 20L-22 92Q-23 100 -14 100H4Q12 100 11 92L16 20Z" fill={body} stroke={bodyLine} strokeWidth="2.6" />
    <path d="M-60 -24H40Q66 -24 66 4Q66 32 40 32H-60Z" fill={body} stroke={bodyLine} strokeWidth="2.6" />
    <path d="M40 -24V32" stroke={bodyLine} strokeWidth="2" />
    <path d="M-60 -16H-80V24H-60" fill="#dbe4ea" stroke={bodyLine} strokeWidth="2.4" />
    <path d="M-4 100Q-6 124 22 128" fill="none" stroke={bodyLine} strokeWidth="3" />
  </g>
}
function Heater({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-80} y={-40} width={160} height={80} rx="14" fill={body} stroke={bodyLine} strokeWidth="2.6" />
    <path d="M-60 0q7.5 -18 15 0t15 0t15 0t15 0t15 0t15 0t15 0t15 0" fill="none" stroke={P.hot} strokeWidth="4" />
    <path d="M-80 0H-100M80 0H100" stroke={P.wire} strokeWidth="2.5" />
  </g>
}
function Appliance({ x, y }: { x: number; y: number }) {
  return <g>
    <rect x={x - 50} y={y - 38} width={100} height={76} rx="16" fill={body} stroke={bodyLine} strokeWidth="2.6" />
    <circle cx={x + 26} cy={y - 14} r="8" fill="white" stroke={bodyLine} strokeWidth="2" />
    <rect x={x - 36} y={y - 24} width={44} height={30} rx="6" fill="#dbe8f0" stroke={bodyLine} strokeWidth="1.6" />
  </g>
}
/** A charge bead, optionally carrying an energy "bag" of a given size. */
function Bead({ x, y, bag = 0, dim = false }: { x: number; y: number; bag?: number; dim?: boolean }) {
  return <g opacity={dim ? .35 : 1}>
    {bag > 0 && <g>
      <path d={`M${x} ${y - 8}L${x} ${y - 14}`} stroke={Qc.E} strokeWidth="2" />
      <circle cx={x} cy={y - 14 - bag} r={bag} fill={Qf.E} stroke={Qc.E} strokeWidth="2" />
      <text x={x} y={y - 14 - bag + 5} textAnchor="middle" fontSize={Math.max(12, bag * .8)} fontWeight="750" fill={Qc.E}>E</text>
    </g>}
    <circle cx={x} cy={y} r="8" fill={P.charge} stroke={P.chargeLine} strokeWidth="1.8" />
  </g>
}

// ---------- Section: E = QV ----------

function Carries() {
  const L = 80, R = 320, T = 70, B = 230, mid = 150
  const beads: Pt[] = [[130, T], [190, T], [250, T], [R, 106], [R, 194], [260, B], [200, B], [140, B], [L, 104]]
  return <PhysicsDiagram title="A cell, a lamp and wires with charges drawn as small beads on the wire. Energy is transferred from the cell to the charge, then from the charge to the lamp.">
    <Wire points={[[L, mid], [L, T], [R, T], [R, B], [L, B], [L, mid]]} />
    <rect x={L - 8} y={mid - 8} width={16} height={16} fill="white" />
    <Cell x={L} y={mid} rotate={90} length={50} />
    <Lamp x={R} y={mid} rotate={90} length={44} lit />
    {beads.map(([x, y], i) => <Bead key={i} x={x} y={y} />)}
    <TransferArrow from={[100, 140]} to={[180, 84]} bend={-.2} colour={Qc.E} width={3.4} />
    <TransferArrow from={[260, 86]} to={[300, 136]} bend={-.25} colour={Qc.E} width={3.4} />
    <Txt x={200} y={132} lines={['energy to', 'the charge']} anchor="middle" size={13} weight={750} colour={Qc.E} />
    <Card x={356} y={70} w={172} h={70}><Txt x={370} y={98} lines={['cell → charge:', 'energy transferred']} size={13} weight={700} colour={Qc.E} /></Card>
    <Card x={356} y={160} w={172} h={70}><Txt x={370} y={188} lines={['charge → lamp:', 'energy transferred']} size={13} weight={700} colour={Qc.E} /></Card>
    <Txt x={200} y={262} lines={['charge']} anchor="middle" size={13} weight={700} colour={P.chargeLine} />
  </PhysicsDiagram>
}
function PdMeaning() {
  const col = (x: number, v: string, cells: number, bag: number) => <g>
    <rect x={x - 70} y={40} width={140} height={200} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.6" />
    <Battery x={x} y={200} cells={cells} length={cells * 22 + 30} />
    <Chip x={x} y={232} text={v} colour={Qc.V} fill={Qf.V} size={14} />
    <Bead x={x} y={150} bag={bag} />
    <Arrow from={[x - 40, 172]} to={[x - 14, 156]} colour={muted} width={2} />
    <Txt x={x} y={30} lines={['1 coulomb']} anchor="middle" size={12} colour={P.chargeLine} weight={700} />
  </g>
  return <PhysicsDiagram title="Two batteries, 12 V and 3 V. Each sends out one coulomb of charge. The charge from the 12 V battery carries a much bigger energy bag: a bigger pd means more energy for each coulomb.">
    {col(120, '3 V', 1, 10)}
    {col(300, '12 V', 4, 30)}
    <Card x={392} y={100} w={140} h={92} highlight={Qc.V}>
      <Txt x={404} y={126} lines={['bigger pd:', 'more energy for', 'each coulomb']} size={13} weight={750} colour={Qc.V} />
    </Card>
  </PhysicsDiagram>
}
function EqQV() {
  return <PhysicsDiagram title="Energy transferred = charge flow × potential difference. E = Q × V, with energy in joules (J), charge in coulombs (C) and pd in volts (V).">
    <EquationCard y={60} words={[['energy transferred', Qc.E], [' = ', ink], ['charge flow', Qc.Q], [' × ', ink], ['pd', Qc.V]]} syms={[['E', Qc.E, 'J'], ['=', ink], ['Q', Qc.Q, 'C'], ['×', ink], ['V', Qc.V, 'V']]} />
    <Txt x={270} y={256} lines={['pd = potential difference']} anchor="middle" size={13} colour={muted} weight={650} />
  </PhysicsDiagram>
}
function Torch({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 70} ${y - 18}H${x + 30}L${x + 56} ${y - 34}V${y + 34}L${x + 30} ${y + 18}H${x - 70}Q${x - 80} ${y + 18} ${x - 80} ${y + 8}V${y - 8}Q${x - 80} ${y - 18} ${x - 70} ${y - 18}Z`} fill={body} stroke={bodyLine} strokeWidth="2.6" />
    <path d={`M${x + 56} ${y - 34}V${y + 34}`} stroke={P.lightLine} strokeWidth="5" />
    <path d={`M${x + 62} ${y - 24}L${x + 96} ${y - 40}M${x + 62} ${y}H${x + 100}M${x + 62} ${y + 24}L${x + 96} ${y + 40}`} stroke={P.lightLine} strokeWidth="2.6" opacity=".7" />
    <rect x={x - 26} y={y - 28} width={28} height={10} rx="3" fill={bodyLine} />
  </g>
}
function WorkedQV() {
  return <PhysicsDiagram title="Worked example. A 6.0 V torch battery passes 50 C of charge. E = Q × V = 50 × 6.0 = 300 J. No conversion is needed.">
    <Torch x={120} y={90} />
    <Chip x={70} y={150} text="6.0 V" colour={Qc.V} fill={Qf.V} size={15} />
    <Chip x={160} y={150} text="50 C" colour={Qc.Q} fill={Qf.Q} size={15} />
    <Card x={280} y={40} w={240} h={140} highlight={Qc.E}>
      <Runs x={400} y={76} runs={[['E', Qc.E], [' = ', ink], ['Q', Qc.Q], [' × ', ink], ['V', Qc.V]]} size={20} />
      <Runs x={400} y={116} runs={[['E', Qc.E], [' = ', ink], ['50', Qc.Q], [' × ', ink], ['6.0', Qc.V]]} size={20} />
      <Runs x={400} y={158} runs={[['E', Qc.E], [' = ', ink], ['300 J', Qc.E]]} size={24} />
    </Card>
    <Chip x={400} y={222} text="no conversion needed" colour={muted} fill="white" size={13} />
  </PhysicsDiagram>
}

// ---------- Section: P = VI ----------

function PowerAgain() {
  return <PhysicsDiagram title="An appliance with a clock: power is the energy transferred each second. An ammeter and a voltmeter show that current and pd are easy to measure.">
    <Appliance x={110} y={120} />
    <Clock x={220} y={110} r={30} minutes={10} />
    <Chip x={165} y={196} text="energy each second" colour={Qc.P} fill={Qf.P} size={14} />
    <Card x={320} y={50} w={206} h={190}>
      <Txt x={423} y={80} lines={['easy to measure']} anchor="middle" size={14} weight={750} />
      <Meter x={356} y={124} letter="A" colour={Qc.I} />
      <Txt x={386} y={129} lines={['current']} size={14} weight={700} colour={Qc.I} />
      <Meter x={356} y={194} letter="V" colour={Qc.V} />
      <Txt x={386} y={199} lines={['pd']} size={14} weight={700} colour={Qc.V} />
    </Card>
  </PhysicsDiagram>
}
function EqVI() {
  return <PhysicsDiagram title="Power = potential difference × current. P = V × I, with power in watts (W), pd in volts (V) and current in amperes (A).">
    <EquationCard y={60} words={[['power', Qc.P], [' = ', ink], ['potential difference', Qc.V], [' × ', ink], ['current', Qc.I]]} syms={[['P', Qc.P, 'W'], ['=', ink], ['V', Qc.V, 'V'], ['×', ink], ['I', Qc.I, 'A']]} />
  </PhysicsDiagram>
}
function WorkedVI() {
  return <PhysicsDiagram title="Worked example. A hairdryer has 230 V across it and a current of 5.0 A. P = V × I = 230 × 5.0 = 1150 W.">
    <Hairdryer x={110} y={110} s={.95} />
    <Meter x={40} y={240} letter="V" reading="230 V" colour={Qc.V} />
    <Meter x={170} y={240} letter="A" reading="5.0 A" colour={Qc.I} />
    <Card x={280} y={40} w={240} h={150} highlight={Qc.P}>
      <Runs x={400} y={78} runs={[['P', Qc.P], [' = ', ink], ['V', Qc.V], [' × ', ink], ['I', Qc.I]]} size={20} />
      <Runs x={400} y={120} runs={[['P', Qc.P], [' = ', ink], ['230', Qc.V], [' × ', ink], ['5.0', Qc.I]]} size={20} />
      <Runs x={400} y={164} runs={[['P', Qc.P], [' = ', ink], ['1150 W', Qc.P]]} size={24} />
    </Card>
  </PhysicsDiagram>
}
function Bar({ x, y, frac, colour, fill, max = 170, label }: { x: number; y: number; frac: number; colour: string; fill: string; max?: number; label: string }) {
  return <g>
    <text x={x - 10} y={y + 15} textAnchor="end" fontSize="13" fontWeight="700" fill={colour}>{label}</text>
    <rect x={x} y={y} width={max} height={20} rx="10" fill="white" stroke={P.panelLine} strokeWidth="1.4" />
    <rect x={x} y={y} width={max * frac} height={20} rx="10" fill={fill} stroke={colour} strokeWidth="1.8" />
  </g>
}
function CompareVI() {
  const row = (y: number, name: string, cur: number) => <g>
    <Appliance x={120} y={y + 30} />
    <circle cx={36} cy={y + 30} r="18" fill="white" stroke={ink} strokeWidth="2" />
    <text x={36} y={y + 37} textAnchor="middle" fontSize="20" fontWeight="750" fill={ink}>{name}</text>
    <Bar x={240} y={y} frac={1} colour={Qc.V} fill={Qf.V} label="pd" />
    <Bar x={240} y={y + 28} frac={cur} colour={Qc.I} fill={Qf.I} label="current" />
    <Bar x={240} y={y + 56} frac={cur} colour={Qc.P} fill={Qf.P} label="power" />
  </g>
  return <PhysicsDiagram title="Two appliances, X and Y, with the same pd. X has the longer current bar and so the longer power bar: same pd, larger current, larger power.">
    {row(20, 'X', .9)}
    {row(128, 'Y', .45)}
    <Chip x={460} y={30} text="same V" colour={Qc.V} fill={Qf.V} size={13} />
    <Card x={40} y={236} w={460} h={44} highlight={Qc.P}>
      <Txt x={270} y={264} lines={['same pd, larger current: larger power']} anchor="middle" size={15} weight={750} colour={Qc.P} />
    </Card>
  </PhysicsDiagram>
}

// ---------- Section: P = I²R ----------

function NoPd() {
  return <PhysicsDiagram title="An appliance with an ammeter reading of the current and a label giving its resistance R. The place where a voltmeter would go has a big question mark: the pd is unknown.">
    <Heater x={180} y={120} />
    <Chip x={180} y={52} text="resistance R" colour={Qc.R} fill={Qf.R} size={14} />
    <Meter x={60} y={220} letter="A" reading="3.0 A" colour={Qc.I} />
    <Meter x={250} y={220} letter="V" unknown />
    <circle cx={292} cy={194} r="20" fill={P.light} stroke={P.lightLine} strokeWidth="2" />
    <text x={292} y={203} textAnchor="middle" fontSize="26" fontWeight="800" fill={P.lightLine}>?</text>
    <Card x={350} y={92} w={176} h={60} highlight={P.lightLine}>
      <Txt x={438} y={128} lines={['pd unknown']} anchor="middle" size={17} weight={750} colour={ink} />
    </Card>
  </PhysicsDiagram>
}
function EqI2R() {
  return <PhysicsDiagram title="Power = current squared × resistance. P = I² × R, with power in watts (W), current in amperes (A) and resistance in ohms (Ω).">
    <EquationCard y={60} words={[['power', Qc.P], [' = ', ink], ['current²', Qc.I], [' × ', ink], ['resistance', Qc.R]]} syms={[['P', Qc.P, 'W'], ['=', ink], ['I²', Qc.I, 'A'], ['×', ink], ['R', Qc.R, 'Ω']]} />
    <Txt x={270} y={256} lines={['square the current first, then multiply']} anchor="middle" size={14} colour={Qc.I} weight={700} />
  </PhysicsDiagram>
}
function Squared() {
  const x0 = 60, y0 = 70, c = 42
  return <PhysicsDiagram title="3.0 squared = 3.0 × 3.0 = 9.0. A square 3 units by 3 units is made of 9 small squares: squared means multiplied by itself.">
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={x0 + (i % 3) * c} y={y0 + Math.floor(i / 3) * c} width={c - 4} height={c - 4} rx="6" fill={Qf.I} stroke={Qc.I} strokeWidth="1.8" />)}
    <Txt x={x0 + 61} y={y0 - 14} lines={['3']} anchor="middle" size={15} weight={750} colour={Qc.I} />
    <Txt x={x0 - 16} y={y0 + 68} lines={['3']} anchor="middle" size={15} weight={750} colour={Qc.I} />
    <Txt x={x0 + 61} y={y0 + 150} lines={['9 squares']} anchor="middle" size={13} weight={700} colour={muted} />
    <Card x={236} y={60} w={290} h={100} highlight={Qc.I}>
      <Runs x={381} y={120} runs={[['3.0²', Qc.I], [' = ', ink], ['3.0 × 3.0', Qc.I], [' = ', ink], ['9.0', Qc.I]]} size={21} />
    </Card>
    <Txt x={381} y={206} lines={['squared means', 'multiplied by itself']} anchor="middle" size={15} weight={750} />
  </PhysicsDiagram>
}
function WorkedI2R() {
  return <PhysicsDiagram title="Worked example. A heating element with a current of 3.0 A and a resistance of 4.0 ohms. Step 1: 3.0 × 3.0 = 9.0. Step 2: 9.0 × 4.0 = 36 W.">
    <Heater x={130} y={100} s={.9} />
    <Heat x={130} y={52} n={3} gap={14} h={20} />
    <Chip x={80} y={170} text="3.0 A" colour={Qc.I} fill={Qf.I} size={15} />
    <Chip x={180} y={170} text="4.0 Ω" colour={Qc.R} fill={Qf.R} size={15} />
    <StepChip x={280} y={44} text="Step 1: square the current" colour={Qc.I} />
    <Card x={280} y={64} w={240} h={56}><Runs x={400} y={100} runs={[['I²', Qc.I], [' = 3.0 × 3.0 = ', ink], ['9.0', Qc.I]]} size={18} /></Card>
    <StepChip x={280} y={148} text="Step 2: multiply by R" colour={Qc.P} />
    <Card x={280} y={168} w={240} h={96} highlight={Qc.P}>
      <Runs x={400} y={202} runs={[['P', Qc.P], [' = ', ink], ['9.0', Qc.I], [' × ', ink], ['4.0', Qc.R]]} size={19} />
      <Runs x={400} y={242} runs={[['P', Qc.P], [' = ', ink], ['36 W', Qc.P]]} size={23} />
    </Card>
  </PhysicsDiagram>
}

export function ChargeEnergyVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  const views: Record<string, () => ReactNode> = {
    'qv-carries': Carries,
    'qv-pd-meaning': PdMeaning,
    'qv-equation': EqQV,
    'qv-worked': WorkedQV,
    'qv-power-again': PowerAgain,
    'qv-pvi-equation': EqVI,
    'qv-pvi-worked': WorkedVI,
    'qv-pvi-compare': CompareVI,
    'qv-no-pd': NoPd,
    'qv-i2r-equation': EqI2R,
    'qv-squared': Squared,
    'qv-i2r-worked': WorkedI2R,
  }
  const View = views[focus]
  return View ? <View /> : null
}
