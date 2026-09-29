import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, EnergyStoreBadge, TransferArrow, type Pt } from './PhysicsKit'
import { qty, faded, r1, Card, Chip, Arrow, Stopwatch, Steps, DataTable, Marker, Label, Caption, fluffyRect, textWidth } from './PowerVisuals'

/*
 * Physics Lesson 7: Investigating specific heat capacity (required practical). Original schematics; not to scale.
 * Focus ids start with 'shcprac-'.
 *
 * One set-up is drawn once and reused through the lesson: a metal block with two holes, an electric heater in one
 * and a thermometer in the other, a fluffy layer of insulation round the block, and a power supply joined to the
 * heater by a cable (no circuit diagram: circuits come later). Frames change what is highlighted or added.
 * Colours: quantities as in the Power lesson (power green, energy amber, time blue, mass slate, temperature red);
 * the thermal store red; insulation a soft wool colour; the metal block cool grey (a second material copper).
 */

const { ink, muted } = P
const BENCH = 252
const BLOCK = { x: 150, y: 150, w: 120, h: 96 }
const HEATER_X = 186, THERMO_X = 236
const wool = '#f4ecd9', woolLine = '#b39a6c'
const materials = {
  metal: { fill: '#e4e9ee', line: '#6f8292', shine: '#f5f8fa' },
  copper: { fill: '#f1d3bd', line: '#ad6f47', shine: '#f9e7da' },
}
type Material = keyof typeof materials
type Part = 'supply' | 'heater' | 'thermo' | 'block' | 'insul'

/* ---------- The set-up ---------- */

function Supply({ on, dim, watts }: { on: boolean; dim?: boolean; watts?: string }) {
  return <g opacity={dim ? faded : 1}>
    <rect x={20} y={172} width={98} height={78} rx="12" fill="#eef2f5" stroke="#6b7f90" strokeWidth="2.2" />
    <rect x={32} y={184} width={52} height={24} rx="5" fill={on ? '#e6f4ec' : '#f7f9fa'} stroke="#6b7f90" strokeWidth="1.6" />
    {watts && <text x={58} y={201} textAnchor="middle" fontSize="13" fontWeight="750" fill={qty.power.line}>{watts}</text>}
    <circle cx={100} cy={196} r="8" fill={on ? '#8fd0a6' : '#d6dde3'} stroke={on ? P.useful : '#8a9aa8'} strokeWidth="1.8" />
    <circle cx={44} cy={232} r="6" fill="#e3574a" stroke="#a8382e" strokeWidth="1.4" />
    <circle cx={66} cy={232} r="6" fill="#4a4f57" stroke="#2c3036" strokeWidth="1.4" />
    <rect x={86} y={224} width={22} height={14} rx="7" fill="white" stroke="#6b7f90" strokeWidth="1.6" />
    <circle cx={on ? 101 : 93} cy={231} r="5" fill="#6b7f90" />
  </g>
}
function Heater({ dim }: { dim?: boolean }) {
  return <g opacity={dim ? faded : 1}>
    {/* the part inside the block is drawn dashed */}
    <rect x={HEATER_X - 6} y={BLOCK.y} width={12} height={74} rx="6" fill="none" stroke="#9a5a3a" strokeWidth="1.6" strokeDasharray="4 4" />
    <rect x={HEATER_X - 6} y={112} width={12} height={40} rx="3" fill="#e8c7b2" stroke="#9a5a3a" strokeWidth="2" />
    <rect x={HEATER_X - 10} y={100} width={20} height={14} rx="4" fill="#d9dfe5" stroke="#6b7f90" strokeWidth="2" />
  </g>
}
function Thermo({ level, dim }: { level: number; dim?: boolean }) {
  const top = 50, bulbY = 214, liquidTop = r1(bulbY - 12 - level * (bulbY - 12 - top - 20))
  return <g opacity={dim ? faded : 1}>
    <rect x={THERMO_X - 6} y={top} width={12} height={bulbY - top} rx="6" fill="#fbfdfe" stroke="#7f95a6" strokeWidth="2" />
    <circle cx={THERMO_X} cy={bulbY} r="9" fill={P.hotFill} stroke="#7f95a6" strokeWidth="2" />
    <circle cx={THERMO_X} cy={bulbY} r="5.5" fill={P.hot} />
    <path d={`M${THERMO_X} ${bulbY - 6}V${liquidTop}`} stroke={P.hot} strokeWidth="4" />
    {[0, 1, 2, 3, 4, 5].map(i => <path key={i} d={`M${THERMO_X + 6} ${64 + i * 14}h6`} stroke="#7f95a6" strokeWidth="1.4" />)}
  </g>
}
/** The whole set-up. Parts in `dim` are faded; `heat` gives the heater and block a warm glow. */
function Rig({ material = 'metal', on = false, level = 0.15, heat = false, insulation = true, dim = [], watts, cable = true }: {
  material?: Material; on?: boolean; level?: number; heat?: boolean; insulation?: boolean; dim?: Part[]; watts?: string; cable?: boolean
}) {
  const m = materials[material], d = (p: Part) => dim.includes(p)
  const { x, y, w, h } = BLOCK
  return <g>
    <path d={`M8 ${BENCH}Q170 ${BENCH - 3} 330 ${BENCH}`} stroke="#b9a58a" strokeWidth="3" fill="none" />
    <Supply on={on} dim={d('supply')} watts={watts} />
    {cable && <path d={`M44 172C44 120 96 76 150 82C170 84 ${HEATER_X} 90 ${HEATER_X} 100`} stroke="#4a4f57" strokeWidth="3" fill="none" opacity={d('supply') && d('heater') ? faded : 1} />}
    {insulation && <g opacity={d('insul') ? faded : 1}>
      <path d={fluffyRect(x - 17, y - 17, w + 34, h + 17, 7, 4)} fill={wool} stroke={woolLine} strokeWidth="2" />
      {[[x - 9, y + 20], [x - 10, y + 60], [x + w + 9, y + 30], [x + w + 9, y + 72], [x + 30, y - 9], [x + 100, y - 9]].map(([fx, fy], i) =>
        <path key={i} d={`M${fx - 4} ${fy}q4 -5 8 0`} stroke={woolLine} strokeWidth="1.3" fill="none" />)}
    </g>}
    <g opacity={d('block') ? faded : 1}>
      <rect x={x} y={y} width={w} height={h} rx="10" fill={m.fill} stroke={m.line} strokeWidth="2.4" />
      {heat && <rect x={x + 3} y={y + 3} width={w - 6} height={h - 6} rx="8" fill={P.thermal} opacity=".55" />}
      <path d={`M${x + 12} ${y + 12}H${x + 50}`} stroke={m.shine} strokeWidth="4" />
      <ellipse cx={HEATER_X} cy={y + 1} rx="9" ry="3.5" fill={m.line} opacity=".5" />
      <ellipse cx={THERMO_X} cy={y + 1} rx="9" ry="3.5" fill={m.line} opacity=".5" />
    </g>
    {heat && <g>{[HEATER_X - 30, HEATER_X + 88].map((hx, i) => <path key={i} d={`M${hx} ${y - 26}q-5 -8 0 -16t0 -16`} stroke={P.thermalLine} strokeWidth="2.4" fill="none" opacity=".75" />)}</g>}
    <Heater dim={d('heater')} />
    <Thermo level={level} dim={d('thermo')} />
  </g>
}
const point = { supply: [70, 176] as Pt, heater: [HEATER_X, 128] as Pt, thermo: [THERMO_X, 92] as Pt, block: [252, 226] as Pt, insul: [BLOCK.x + BLOCK.w + 12, 196] as Pt }

/** A close-up thermometer with a scale from `min` to `max` °C, read at `temp`. (x, y) is the top of the tube. */
function ThermoCloseUp({ x, y, h = 170, temp, min = 10, max = 40, step = 5, label, dim = false }: { x: number; y: number; h?: number; temp: number; min?: number; max?: number; step?: number; label?: string; dim?: boolean }) {
  const scaleTop = y + 12, scaleBottom = y + h - 26
  const at = (t: number) => r1(scaleBottom - (t - min) / (max - min) * (scaleBottom - scaleTop))
  const ticks = Array.from({ length: Math.round((max - min) / step) + 1 }, (_, i) => min + i * step)
  return <g opacity={dim ? faded : 1}>
    <rect x={x - 9} y={y} width={18} height={h} rx="9" fill="#fbfdfe" stroke="#7f95a6" strokeWidth="2" />
    <circle cx={x} cy={y + h + 4} r="13" fill={P.hotFill} stroke="#7f95a6" strokeWidth="2" />
    <circle cx={x} cy={y + h + 4} r="8.5" fill={P.hot} />
    <path d={`M${x} ${y + h - 4}V${at(temp)}`} stroke={P.hot} strokeWidth="6" />
    {ticks.map(t => <g key={t}><path d={`M${x + 9} ${at(t)}h8`} stroke="#7f95a6" strokeWidth="1.6" /><text x={x + 21} y={at(t) + 4.5} fontSize="12" fill={muted}>{t}</text></g>)}
    <path d={`M${x - 16} ${at(temp)}h10`} stroke={P.hot} strokeWidth="2" />
    {label && <text x={x} y={y + h + 40} textAnchor="middle" fontSize="14" fontWeight="700" fill={P.hot}>{label}</text>}
  </g>
}
function Balance({ x, y, reading, children }: { x: number; y: number; reading?: string; children?: ReactNode }) {
  // (x, y) is the middle of the pan's top surface; the body sits below it.
  return <g>
    {children}
    <rect x={x - 42} y={y} width={84} height={6} rx="3" fill="#d9dfe5" stroke="#6b7f90" strokeWidth="1.8" />
    <path d={`M${x - 4} ${y + 6}V${y + 12}M${x + 4} ${y + 6}V${y + 12}`} stroke="#6b7f90" strokeWidth="2" />
    <rect x={x - 48} y={y + 12} width={96} height={30} rx="8" fill="#eef2f5" stroke="#6b7f90" strokeWidth="2" />
    <rect x={x - 30} y={y + 18} width={60} height={18} rx="4" fill="#e6f4ec" stroke="#6b7f90" strokeWidth="1.4" />
    {reading && <text x={x} y={y + 32} textAnchor="middle" fontSize="12" fontWeight="750" fill={qty.mass.line}>{reading}</text>}
  </g>
}

/* ---------- Section 1: what are we measuring? ---------- */

function Aim() {
  return <PhysicsDiagram title="The aim: energy goes into a metal block from a heater, and a thermometer shows how much the block's temperature rises. Your teacher runs this practical in the lab.">
    <Rig on level={0.55} heat />
    <Arrow from={[THERMO_X + 22, 116]} to={[THERMO_X + 22, 66]} colour={P.hot} width={2.6} />
    <Label x={120} y={70} to={[HEATER_X - 12, 122]} anchor="end" lines={['energy in']} colour={qty.energy.line} />
    <Card x={322} y={60} w={206} h={78} tone="temp" strong>
      <Lines x={425} y={92} anchor="middle" lines={['how much does the', 'temperature rise?']} size={15} weight={750} colour={P.hot} />
    </Card>
    <Lines x={425} y={184} anchor="middle" lines={['then use the results', 'to find the specific', 'heat capacity']} size={14} weight={600} colour={ink} />
    <Caption x={425} y={250} text="your teacher runs" />
    <Caption x={425} y={268} text="this in the lab" />
  </PhysicsDiagram>
}
function Kit() {
  return <PhysicsDiagram title="The equipment: a metal block with two holes, an electric heater in one hole, a thermometer in the other, insulation wrapped round the block, and a power supply. A balance and a stopwatch are also needed.">
    <Rig />
    <Label x={272} y={34} to={point.thermo} lines={['thermometer']} />
    <Label x={120} y={60} anchor="end" to={[HEATER_X - 6, 118]} lines={['heater']} />
    <Label x={330} y={150} to={[BLOCK.x + BLOCK.w + 12, 170]} lines={['insulation']} />
    <Label x={330} y={214} to={[250, 222]} lines={['metal block']} />
    <Label x={24} y={290} to={[60, 250]} lines={['power supply']} />
    <Balance x={400} y={60} reading="0.00 kg" />
    <text x={400} y={124} textAnchor="middle" fontSize="14" fontWeight="650" fill={ink}>balance</text>
    <Stopwatch x={488} y={78} r={20} />
    <text x={488} y={124} textAnchor="middle" fontSize="14" fontWeight="650" fill={ink}>stopwatch</text>
  </PhysicsDiagram>
}
function EnergyPath() {
  return <PhysicsDiagram title="Where the energy goes: energy is transferred electrically from the power supply to the heater, then by heating from the heater to the thermal store of the block. A little escapes through the insulation to the air.">
    <Rig on heat level={0.5} />
    <TransferArrow from={[112, 164]} to={[168, 114]} bend={0.25} colour={qty.power.line} width={3} />
    <text x={92} y={112} textAnchor="end" fontSize="14" fontWeight="700" fill={qty.power.line}>electrically</text>
    <TransferArrow from={[HEATER_X + 4, 196]} to={[HEATER_X + 30, 214]} bend={-0.4} colour={P.thermalLine} width={3} />
    <Label x={330} y={176} to={[HEATER_X + 32, 214]} lines={['by heating,', 'into the block']} colour={P.thermalLine} />
    <Arrow from={[BLOCK.x + BLOCK.w + 20, 232]} to={[BLOCK.x + BLOCK.w + 60, 240]} colour={P.wasted} width={2} dashed opacity={0.7} />
    <text x={336} y={246} fontSize="13" fontWeight="650" fill={P.wasted}>a little escapes</text>
    <EnergyStoreBadge store="thermal" x={410} y={50} label="Thermal store of heater" />
    <path d="M410 68V90" stroke={P.thermalLine} strokeWidth="2.4" />
    <path d="M404 86l6 8l6 -8" stroke={P.thermalLine} strokeWidth="2.4" fill="none" />
    <EnergyStoreBadge store="thermal" x={410} y={112} label="Thermal store of block" />
    <Caption x={270} y={288} text="insulation cuts the energy lost to the air" />
  </PhysicsDiagram>
}
function Variables() {
  const tags = ['same mass', 'same power', 'same time']
  return <PhysicsDiagram title="Comparing two materials: block A and block B are made of different materials. Keep the mass, the heater power and the heating time the same. Measure the temperature rise of each.">
    {(['metal', 'copper'] as const).map((mat, i) => <g key={mat}>
      <g transform={`translate(${i ? 306 : -4} 44) scale(.56)`}><Rig material={mat} on level={0.35} /></g>
      <text x={i ? 424 : 114} y={206} textAnchor="middle" fontSize="15" fontWeight="750" fill={materials[mat].line}>block {i ? 'B' : 'A'}</text>
    </g>)}
    {tags.map((t, i) => <Chip key={t} x={236} y={60 + i * 40} text={t} tone={i === 0 ? 'mass' : i === 1 ? 'power' : 'time'} w={128} />)}
    <Chip x={270} y={30} text="different material" w={170} />
    <Card x={120} y={234} w={300} h={50} tone="temp" strong>
      <text x={270} y={266} textAnchor="middle" fontSize="15" fontWeight="750" fill={P.hot}>temperature rise: measure this</text>
    </Card>
  </PhysicsDiagram>
}

/* ---------- Section 2: running it ---------- */

function Setup() {
  return <PhysicsDiagram title="Setting up, in three steps. Step 1: measure the mass of the block on a balance, in kilograms. Step 2: wrap the block in insulation. Step 3: put the heater and thermometer into the holes and connect the heater to the power supply, switched off.">
    {/* 1: block on a balance */}
    <Balance x={88} y={176} reading="1.00 kg">
      <rect x={56} y={120} width={64} height={56} rx="7" fill={materials.metal.fill} stroke={materials.metal.line} strokeWidth="2.2" />
    </Balance>
    <Marker n={1} x={24} y={36} to={[60, 126]} />
    <Lines x={88} y={260} anchor="middle" lines={['measure the', 'mass in kg']} size={14} weight={650} />
    {/* 2: wrapping */}
    <path d={fluffyRect(196, 110, 92, 74, 3, 4)} fill={wool} stroke={woolLine} strokeWidth="2" />
    <rect x={210} y={122} width={64} height={62} rx="7" fill={materials.metal.fill} stroke={materials.metal.line} strokeWidth="2.2" />
    <path d="M186 186H298" stroke="#b9a58a" strokeWidth="3" />
    <path d="M292 120q18 14 4 40" stroke={woolLine} strokeWidth="2" fill="none" strokeDasharray="4 4" />
    <Marker n={2} x={196} y={36} to={[204, 118]} />
    <Lines x={242} y={260} anchor="middle" lines={['wrap it in', 'insulation']} size={14} weight={650} />
    {/* 3: the full rig, power off */}
    <g transform="translate(300 10) scale(.8)"><Rig /></g>
    <Marker n={3} x={348} y={36} to={[445, 95]} />
    <Lines x={420} y={260} anchor="middle" lines={['heater and thermometer', 'in; power off']} size={14} weight={650} />
  </PhysicsDiagram>
}
function Start() {
  return <PhysicsDiagram title="Starting: read the starting temperature, 20 degrees Celsius. Then switch on the power supply and start the stopwatch at the same moment. The heater power is given, for example 50 watts.">
    <Rig on level={0.18} watts="50 W" />
    <ThermoCloseUp x={362} y={28} h={170} temp={20} label="start: 20 °C" />
    <Stopwatch x={476} y={84} r={26} frac={0} label="0 s" />
    <Chip x={176} y={32} text="heater power given: 50 W" tone="power" />
    <Lines x={470} y={176} anchor="middle" lines={['switch on and', 'start the clock', 'together']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}
function End() {
  return <PhysicsDiagram title="After a set time, 10 minutes, read the final temperature, then switch the power supply off.">
    <Rig on={false} level={0.62} heat watts="50 W" />
    <ThermoCloseUp x={362} y={28} h={170} temp={32} label="final temperature" />
    <Stopwatch x={476} y={84} r={26} frac={1 / 6} label="10 min" />
    <Lines x={470} y={176} anchor="middle" lines={['read, then', 'switch off']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}
function Safety() {
  return <PhysicsDiagram title="Safety: the heater and block get hot, so do not touch them and let them cool before moving them. Keep water away from the electrical equipment. Take care with the glass thermometer.">
    <Rig heat level={0.6} />
    {/* hot sign */}
    <g transform="translate(330 30)">
      <path d="M0 52L30 0L60 52Z" fill="#fde8a8" stroke="#c3930f" strokeWidth="2.4" />
      <path d="M22 42q-6 -8 0 -16t0 -14M34 42q-6 -8 0 -16t0 -14" stroke={P.thermalLine} strokeWidth="2.4" fill="none" />
    </g>
    <Lines x={400} y={56} lines={['hot: do not', 'touch']} size={15} weight={750} colour={P.thermalLine} />
    <Lines x={400} y={116} lines={['let it cool', 'before moving it']} size={14} weight={650} />
    {/* no water near electrics */}
    <Label x={390} y={180} to={[THERMO_X + 6, 104]} lines={['take care with', 'the glass']} />
    <path d="M404 244c0 -8 8 -18 10 -24c2 6 10 16 10 24a10 10 0 0 1 -20 0Z" fill={P.water} stroke={P.waterLine} strokeWidth="1.8" />
    <path d="M396 220L432 258" stroke={P.wasted} strokeWidth="3" />
    <Lines x={440} y={238} lines={['keep water', 'away']} size={13} weight={650} colour={P.wasted} />
  </PhysicsDiagram>
}
function Repeat() {
  return <PhysicsDiagram title="Trying another material: repeat with a block of a different material, or put the heater and thermometer into an insulated beaker holding a known mass of liquid.">
    <g transform="translate(2 60) scale(.66)"><Rig material="copper" /></g>
    <text x={120} y={250} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>another block</text>
    {/* insulated beaker of liquid */}
    <g>
      <path d={fluffyRect(342, 92, 136, 128, 11, 4)} fill={wool} stroke={woolLine} strokeWidth="2" />
      <path d="M356 104V204Q356 214 366 214H454Q464 214 464 204V104" fill="white" stroke="#7f95a6" strokeWidth="2.4" />
      <path d="M358 134Q410 128 462 134V204Q462 212 454 212H366Q358 212 358 204Z" fill={P.water} />
      <rect x={384} y={58} width={12} height={130} rx="6" fill="#e8c7b2" stroke="#9a5a3a" strokeWidth="2" />
      <rect x={380} y={48} width={20} height={14} rx="4" fill="#d9dfe5" stroke="#6b7f90" strokeWidth="2" />
      <rect x={428} y={40} width={10} height={160} rx="5" fill="#fbfdfe" stroke="#7f95a6" strokeWidth="2" />
      <circle cx={433} cy={198} r="7" fill={P.hot} stroke="#7f95a6" strokeWidth="1.6" />
      <path d="M433 192V150" stroke={P.hot} strokeWidth="3.4" />
      <path d="M270 224H500" stroke="#b9a58a" strokeWidth="3" />
    </g>
    <text x={410} y={250} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>a known mass of liquid</text>
    <Caption y={288} text="keep the mass, power and time the same each time" />
  </PhysicsDiagram>
}

/* ---------- Section 3: finding c ---------- */

function EnergyPt() {
  return <PhysicsDiagram title="Energy from the heater: a 50 watt heater on for 10 minutes. 10 minutes is 600 seconds. E equals P times t equals 50 times 600 equals 30 000 joules.">
    <g transform="translate(-6 74) scale(.7)"><Rig on heat level={0.5} watts="50 W" /></g>
    <Stopwatch x={250} y={66} r={26} frac={1 / 6} />
    <Chip x={250} y={128} text="10 min = 600 s" tone="time" />
    <Card x={334} y={36} w={186} h={62} tone="energy">
      <text x={427} y={76} textAnchor="middle" fontSize="26" fontWeight="800" fill={qty.energy.line}>E<tspan fill={ink}> = </tspan><tspan fill={qty.power.line}>P</tspan><tspan fill={ink}> × </tspan><tspan fill={qty.time.line}>t</tspan></text>
    </Card>
    <text x={427} y={144} textAnchor="middle" fontSize="18" fontWeight="750" fill={ink}><tspan fill={qty.power.line}>50</tspan> × <tspan fill={qty.time.line}>600</tspan> = <tspan fill={qty.energy.line}>30 000 J</tspan></text>
    <Chip x={363} y={206} text="W" tone="power" w={44} />
    <text x={395} y={211} textAnchor="middle" fontSize="18" fontWeight="700" fill={ink}>×</text>
    <Chip x={427} y={206} text="s" tone="time" w={44} />
    <text x={459} y={211} textAnchor="middle" fontSize="18" fontWeight="700" fill={ink}>=</text>
    <Chip x={491} y={206} text="J" tone="energy" w={44} />
    <Caption x={427} y={262} text="time in seconds first" />
  </PhysicsDiagram>
}
function Assume() {
  return <PhysicsDiagram title="We assume all the energy from the heater goes into the block, so the energy from the heater equals the change in the block's thermal energy, delta E. In real life a little escapes through the insulation.">
    <Rig heat level={0.5} />
    <TransferArrow from={[HEATER_X + 6, 176]} to={[HEATER_X + 38, 236]} bend={-0.35} colour={P.thermalLine} width={5} />
    <Card x={322} y={56} w={206} h={84} tone="energy" strong>
      <Lines x={425} y={88} anchor="middle" lines={['E from heater = ΔE', '(assume all of it)']} size={15} weight={750} colour={qty.energy.line} />
    </Card>
    <path d="M340 140L216 196" stroke={ink} strokeWidth="1.4" /><circle cx={216} cy={196} r="2.6" fill={ink} />
    <Arrow from={[BLOCK.x + BLOCK.w + 4, 222]} to={[BLOCK.x + BLOCK.w + 58, 236]} colour={P.wasted} width={1.6} dashed opacity={0.8} />
    <Lines x={338} y={206} lines={['in real life a', 'little escapes']} size={13} weight={650} colour={P.wasted} />
  </PhysicsDiagram>
}
function DeltaTheta() {
  return <PhysicsDiagram title="The temperature rise: the start temperature is 20 degrees Celsius and the final temperature is 26 degrees Celsius. Delta theta equals 26 minus 20 equals 6 degrees Celsius.">
    <ThermoCloseUp x={110} y={30} h={180} temp={20} min={15} max={30} label="start 20 °C" />
    <ThermoCloseUp x={250} y={30} h={180} temp={26} min={15} max={30} label="final 26 °C" />
    <path d="M126 137H300" stroke={P.hot} strokeWidth="1.4" strokeDasharray="4 4" />
    <path d="M298 137H310V80H298" stroke={P.hot} strokeWidth="2.2" fill="none" />
    <Card x={332} y={92} w={188} h={76} tone="temp" strong>
      <text x={426} y={122} textAnchor="middle" fontSize="18" fontWeight="800" fill={P.hot}>Δθ = 26 − 20</text>
      <text x={426} y={152} textAnchor="middle" fontSize="18" fontWeight="800" fill={P.hot}>= 6 °C</text>
    </Card>
    <Caption x={426} y={206} text="final − start" />
  </PhysicsDiagram>
}
function Rearrange() {
  const E = qty.energy.line, M = qty.mass.line, C = qty.power.line, T = P.hot
  return <PhysicsDiagram title="Rearranging: delta E equals m times c times delta theta. Divide both sides by m times delta theta. This gives c equals delta E divided by m times delta theta. The unit of c is joules per kilogram per degree Celsius.">
    <text x={270} y={70} textAnchor="middle" fontSize="26" fontWeight="750" fill={ink}><tspan fill={E}>ΔE</tspan> = <tspan fill={M}>m</tspan> × <tspan fill={C}>c</tspan> × <tspan fill={T}>Δθ</tspan></text>
    <Arrow from={[270, 90]} to={[270, 128]} colour={muted} width={2.2} />
    <text x={286} y={115} fontSize="14" fontWeight="700" fill={muted}>÷ (m × Δθ) on both sides</text>
    <Card x={112} y={144} w={316} h={70} tone="plain" strong />
    <text x={270} y={190} textAnchor="middle" fontSize="28" fontWeight="800" fill={ink}><tspan fill={C}>c</tspan> = <tspan fill={E}>ΔE</tspan> ÷ (<tspan fill={M}>m</tspan> × <tspan fill={T}>Δθ</tspan>)</text>
    <Chip x={270} y={252} text="c in J/kg°C" tone="power" />
  </PhysicsDiagram>
}
function Worked() {
  return <PhysicsDiagram title="Worked example: a 2.0 kilogram block, a 100 watt heater, 3 minutes, 20 to 29 degrees Celsius. Step 1: 3 minutes is 180 seconds. Step 2: energy is 100 times 180, 18 000 joules. Step 3: the rise is 9 degrees. Step 4: c is 18 000 divided by 2.0 times 9, which is 1000 joules per kilogram per degree Celsius.">
    <g transform="translate(-6 36) scale(.72)"><Rig on heat level={0.5} watts="100 W" /></g>
    <Chip x={70} y={26} text="2.0 kg" tone="mass" />
    <Chip x={170} y={26} text="3 min" tone="time" />
    <Chip x={120} y={274} text="20 °C → 29 °C" tone="temp" />
    <Steps x={262} y={44} gap={52} steps={[['t = 3 × 60 = 180 s'], ['E = 100 × 180 = 18 000 J'], ['Δθ = 29 − 20 = 9 °C'], ['c = 18 000 ÷ (2.0 × 9)']]} />
    <Chip x={400} y={246} text="c = 1000 J/kg°C" tone="power" size={17} />
  </PhysicsDiagram>
}

/* ---------- Questions ---------- */

function QuestionSetup({ assessment }: { assessment: boolean }) {
  const names = ['heater', 'thermometer', 'block', 'insulation']
  return <PhysicsDiagram title={assessment ? 'A block with a heater, a thermometer and a layer wrapped round it, with four numbered parts.' : 'The set-up with four numbered parts: 1 heater, 2 thermometer, 3 block, 4 insulation.'}>
    <Rig />
    <Marker n={1} x={130} y={60} to={[HEATER_X - 5, 124]} />
    <Marker n={2} x={300} y={50} to={[THERMO_X + 6, 80]} />
    <Marker n={3} x={330} y={236} to={[250, 224]} />
    <Marker n={4} x={330} y={160} to={[BLOCK.x + BLOCK.w + 12, 170]} />
    {!assessment && names.map((n, i) => <text key={n} x={360} y={[64, 54, 240, 164][i]} fontSize="14" fontWeight="650" fill={ink}>{n}</text>)}
  </PhysicsDiagram>
}
function QuestionResults() {
  return <PhysicsDiagram schematic={false} viewBox="0 0 540 200" title="A table of results for two blocks, X and Y. Both have a mass of 1.0 kilograms, a 50 watt heater and 5 minutes of heating. The temperature rise is 10 degrees Celsius for X and 20 degrees Celsius for Y.">
    <DataTable x={14} y={20} widths={[88, 100, 118, 108, 98]} head={['Block', 'Mass (kg)', 'Heater|power (W)', 'Heating|time (min)', 'Temperature|rise (°C)']} rows={[['X', '1.0', '50', '5', '10'], ['Y', '1.0', '50', '5', '20']]} rowH={42} />
  </PhysicsDiagram>
}

export function ShcPracticalVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'shcprac-aim': return <Aim />
    case 'shcprac-kit': return <Kit />
    case 'shcprac-energy': return <EnergyPath />
    case 'shcprac-variables': return <Variables />
    case 'shcprac-setup': return <Setup />
    case 'shcprac-start': return <Start />
    case 'shcprac-end': return <End />
    case 'shcprac-safety': return <Safety />
    case 'shcprac-repeat': return <Repeat />
    case 'shcprac-energy-pt': return <EnergyPt />
    case 'shcprac-assume': return <Assume />
    case 'shcprac-dtheta': return <DeltaTheta />
    case 'shcprac-rearrange': return <Rearrange />
    case 'shcprac-worked': return <Worked />
    case 'shcprac-q-setup': return <QuestionSetup assessment={assessment} />
    case 'shcprac-q-results': return <QuestionResults />
    default: return null
  }
}

