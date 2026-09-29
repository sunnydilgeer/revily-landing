import { useId, type ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, type Pt } from './PhysicsKit'
import { ink, muted, r1, Tag, StepStrip, Card, Eq, Arrow, Thermometer, Bike, Car } from './EnergyStoreVisuals'
import { Stopwatch } from './GasRateVisuals'
import { ws } from './WsPresentVisuals'

/*
 * Working Scientifically Lesson 9: Units and converting them. Original, code-native schematics.
 * Focus ids start with 'wsunit-'.
 *
 * Colour code: a bigger unit indigo, a smaller unit teal; "multiply" arrows (bigger unit to smaller unit) are drawn
 * above a chain of unit boxes and "divide" arrows below it, as curved rounded arrows. Distance brown-orange and time
 * blue as in the motion and graph lessons. Answers sit on a green highlight.
 */

const big = P.gravitationalLine, bigFill = P.gravitational, small = P.electrostaticLine, smallFill = P.electrostatic
const mul = ws.y, div = ws.x

/** A curved arrow from `from` to `to`, bowing up (bend > 0) or down (bend < 0), with a label at its top/bottom. */
function Curve({ from, to, bend, colour, label, width = 2.6 }: { from: Pt; to: Pt; bend: number; colour: string; label?: string; width?: number }) {
  const mx = (from[0] + to[0]) / 2, my = (from[1] + to[1]) / 2 - bend
  const a = Math.atan2(to[1] - my, to[0] - mx), h = 11
  const b1: Pt = [r1(to[0] - Math.cos(a) * h + Math.sin(a) * h * 0.55), r1(to[1] - Math.sin(a) * h - Math.cos(a) * h * 0.55)]
  const b2: Pt = [r1(to[0] - Math.cos(a) * h - Math.sin(a) * h * 0.55), r1(to[1] - Math.sin(a) * h + Math.cos(a) * h * 0.55)]
  const peak = r1((from[1] + to[1]) / 2 - bend / 2)
  return <g>
    <path d={`M${from[0]} ${from[1]}Q${r1(mx)} ${r1(my)} ${to[0]} ${to[1]}`} stroke={colour} strokeWidth={width} fill="none" />
    <path d={`M${to[0]} ${to[1]}L${b1[0]} ${b1[1]}L${b2[0]} ${b2[1]}Z`} fill={colour} stroke={colour} strokeWidth="1.2" />
    {label && <text x={r1(mx)} y={bend > 0 ? peak - 8 : peak + 20} textAnchor="middle" fontSize="14" fontWeight="750" fill={colour}>{label}</text>}
  </g>
}
/** A rounded unit box. */
function UnitBox({ x, y, text, w = 64, fill = P.panel, line = P.panelLine, colour = ink, size = 18 }: { x: number; y: number; text: string; w?: number; fill?: string; line?: string; colour?: string; size?: number }) {
  return <g>
    <rect x={x - w / 2} y={y - 20} width={w} height={40} rx="14" fill={fill} stroke={line} strokeWidth="2" />
    <text x={x} y={y + size * 0.36} textAnchor="middle" fontSize={size} fontWeight="800" fill={colour}>{text}</text>
  </g>
}
/** A chain of unit boxes, biggest first, with ×1000 above and ÷1000 below each link. */
function Chain({ x, y, units, gap = 130, factor = '1000' }: { x: number; y: number; units: string[]; gap?: number; factor?: string }) {
  return <g>
    {units.slice(1).map((_, i) => {
      const a = x + i * gap, b = a + gap
      return <g key={i}>
        <Curve from={[a + 20, y - 22]} to={[b - 20, y - 22]} bend={30} colour={mul} label={`× ${factor}`} />
        <Curve from={[b - 20, y + 22]} to={[a + 20, y + 22]} bend={-30} colour={div} label={`÷ ${factor}`} />
      </g>
    })}
    {units.map((u, i) => <UnitBox key={u} x={x + i * gap} y={y} text={u} />)}
  </g>
}
function Ruler({ x, y, w, marks = 10, label, colour = P.resistance, fill = '#f6ecd9' }: { x: number; y: number; w: number; marks?: number; label?: string; colour?: string; fill?: string }) {
  return <g>
    <rect x={x} y={y} width={w} height={24} rx="4" fill={fill} stroke={colour} strokeWidth="1.8" />
    {Array.from({ length: marks + 1 }, (_, i) => <path key={i} d={`M${r1(x + i * w / marks)} ${y}v${i % 5 === 0 ? 11 : 6}`} stroke={colour} strokeWidth="1.4" />)}
    {label && <text x={x + w / 2} y={y + 19} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={colour}>{label}</text>}
  </g>
}

/* ---------- Section 2: SI units ---------- */

function Globe({ x, y, r }: { x: number; y: number; r: number }) {
  const clip = useId().replace(/:/g, '')
  return <g>
    <defs><clipPath id={clip}><circle cx={x} cy={y} r={r} /></clipPath></defs>
    <circle cx={x} cy={y} r={r} fill={P.water} stroke={P.waterLine} strokeWidth="2.4" />
    <g clipPath={`url(#${clip})`} fill={P.plant} stroke={P.plantLine} strokeWidth="1.8">
      <path d={`M${x - r * 0.75} ${y - r * 0.5}c${r * 0.2} ${-r * 0.3} ${r * 0.6} ${-r * 0.3} ${r * 0.7} ${-r * 0.05}s${-r * 0.05} ${r * 0.45} ${-r * 0.3} ${r * 0.5}s${-r * 0.5} ${-r * 0.2} ${-r * 0.4} ${-r * 0.45}z`} />
      <path d={`M${x + r * 0.1} ${y - r * 0.2}c${r * 0.25} ${-r * 0.25} ${r * 0.6} ${-r * 0.1} ${r * 0.65} ${r * 0.2}s${-r * 0.2} ${r * 0.5} ${-r * 0.35} ${r * 0.75}s${-r * 0.3} ${-r * 0.4} ${-r * 0.3} ${-r * 0.95}z`} />
      <path d={`M${x - r * 0.55} ${y + r * 0.35}c${r * 0.2} ${-r * 0.1} ${r * 0.35} ${r * 0.15} ${r * 0.3} ${r * 0.35}s${-r * 0.3} ${r * 0.25} ${-r * 0.4} ${r * 0.05}z`} />
    </g>
    <path d={`M${x - r} ${y}Q${x} ${y + r * 0.25} ${x + r} ${y}M${x} ${y - r}Q${x - r * 0.45} ${y} ${x} ${y + r}`} stroke="white" strokeWidth="1.4" fill="none" opacity=".7" />
  </g>
}
function Lab({ x, y, text }: { x: number; y: number; text: string }) {
  return <g>
    <rect x={x - 70} y={y - 30} width={140} height={60} rx="16" fill="white" stroke={P.panelLine} strokeWidth="1.6" />
    <Ruler x={x - 56} y={y - 18} w={112} />
    <text x={x} y={y + 22} textAnchor="middle" fontSize="13" fontWeight="750" fill={ink}>{text}</text>
  </g>
}
function Si() {
  return <PhysicsDiagram title="Scientists all over the world measure with the same standard units, called SI units, so a result from one laboratory can be compared with a result from another.">
    <Globe x={270} y={140} r={78} />
    <Lab x={90} y={70} text="1 m here" />
    <Lab x={450} y={70} text="1 m here" />
    <Lab x={90} y={214} text="1 m here" />
    <Lab x={450} y={214} text="1 m here" />
    {([[160, 84, 206, 110], [380, 84, 334, 110], [160, 200, 206, 176], [380, 200, 334, 176]] as number[][]).map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b}L${c} ${d}`} stroke={muted} strokeWidth="1.6" strokeDasharray="4 5" />)}
    <Tag x={270} y={276} text="same units everywhere: SI units" colour={ws.fit} fill={ws.fitFill} size={14} w={270} />
  </PhysicsDiagram>
}

function Weight({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 8} ${y - 34}a8 8 0 0 1 16 0`} stroke="#7d8e9c" strokeWidth="3" fill="none" />
    <path d={`M${x - 16} ${y - 32}H${x + 16}L${x + 24} ${y}H${x - 24}Z`} fill="#dfe5ea" stroke="#7d8e9c" strokeWidth="2" />
    <text x={x} y={y - 10} textAnchor="middle" fontSize="12" fontWeight="800" fill="#5a6b79">1 kg</text>
  </g>
}
function Base() {
  const cards: { q: string; unit: string; sym: string; icon: ReactNode; note?: string }[] = [
    { q: 'mass', unit: 'kilogram', sym: 'kg', icon: <Weight x={0} y={10} /> },
    { q: 'length', unit: 'metre', sym: 'm', icon: <Ruler x={-46} y={-10} w={92} /> },
    { q: 'time', unit: 'second', sym: 's', icon: <Stopwatch x={0} y={4} r={24} time="1 s" /> },
    { q: 'temperature', unit: 'kelvin', sym: 'K', icon: <Thermometer x={0} y={26} h={62} level={0.55} />, note: '(°C in school)' },
  ]
  return <PhysicsDiagram schematic={false} title="Four SI base units: mass in kilograms (kg), length in metres (m), time in seconds (s) and temperature in kelvin (K). In school practicals temperature is often in degrees Celsius.">
    {cards.map((c, i) => {
      const cx = 72 + i * 132
      return <g key={c.q}>
        <rect x={cx - 60} y={20} width={120} height={256} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.6" />
        <text x={cx} y={48} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>{c.q}</text>
        <g transform={`translate(${cx} 110)`}>{c.icon}</g>
        <text x={cx} y={196} textAnchor="middle" fontSize="30" fontWeight="800" fill={big}>{c.sym}</text>
        <text x={cx} y={224} textAnchor="middle" fontSize="14" fontWeight="650" fill={muted}>{c.unit}</text>
        {c.note && <text x={cx} y={252} textAnchor="middle" fontSize="12" fontWeight="650" fill={muted}>{c.note}</text>}
      </g>
    })}
  </PhysicsDiagram>
}

/* ---------- Section 3: prefixes ---------- */

function Prefix() {
  return <PhysicsDiagram schematic={false} title="The word kilometre split into two parts: kilo, the prefix, and metre, the base unit. The symbol km is k for kilo and m for metre.">
    <text x={270} y={112} textAnchor="middle" fontSize="44" fontWeight="800" fill={ink}><tspan fill={P.pd}>kilo</tspan><tspan fill={big}>metre</tspan></text>
    <path d="M128 128H232" stroke={P.pd} strokeWidth="3" /><path d="M244 128H412" stroke={big} strokeWidth="3" />
    <Tag x={180} y={158} text="prefix" colour={P.pd} fill={P.pdFill} size={15} w={90} />
    <Tag x={328} y={158} text="base unit" colour={big} fill={bigFill} size={15} w={110} />
    <Lines x={180} y={196} anchor="middle" lines={['changes the size']} size={13} weight={650} colour={muted} />
    <Lines x={328} y={196} anchor="middle" lines={['what is measured']} size={13} weight={650} colour={muted} />
    <text x={270} y={262} textAnchor="middle" fontSize="30" fontWeight="800"><tspan fill={P.pd}>k</tspan><tspan fill={big}>m</tspan></text>
    <text x={330} y={258} fontSize="13" fontWeight="650" fill={muted}>the symbol</text>
  </PhysicsDiagram>
}
function Big() {
  return <PhysicsDiagram schematic={false} title="1 kilometre is made of 1000 metres, shown as a road split into ten 100 m pieces. Kilo (k) means 1000 times bigger and mega (M) means 1 000 000 times bigger.">
    <text x={40} y={40} fontSize="16" fontWeight="800" fill={big}>1 km</text>
    <text x={500} y={40} textAnchor="end" fontSize="16" fontWeight="800" fill={small}>= 1000 m</text>
    <path d="M40 70H500" stroke="#b9c7a8" strokeWidth="26" />
    <path d="M40 70H500" stroke="white" strokeWidth="2" strokeDasharray="14 10" />
    {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${40 + i * 46} 52v36`} stroke={ink} strokeWidth={i % 10 === 0 ? 2.4 : 1.4} />)}
    <text x={63} y={108} textAnchor="middle" fontSize="12" fontWeight="650" fill={muted}>100 m</text>
    <Bike x={430} y={57} s={0.36} />
    <UnitBox x={150} y={170} text="kilo (k)" w={150} fill={bigFill} line={big} colour={big} />
    <text x={150} y={214} textAnchor="middle" fontSize="18" fontWeight="800" fill={mul}>× 1000</text>
    <UnitBox x={390} y={170} text="mega (M)" w={150} fill={bigFill} line={big} colour={big} />
    <text x={390} y={214} textAnchor="middle" fontSize="18" fontWeight="800" fill={mul}>× 1 000 000</text>
    <Lines x={270} y={262} anchor="middle" lines={['1 kg = 1000 g     1 MW = 1 000 000 W']} size={14} weight={700} colour={muted} />
  </PhysicsDiagram>
}
function Small() {
  const x = 40, w = 460, zx = 200, zw = 46
  return <PhysicsDiagram schematic={false} title="A metre ruler with one small part magnified to show millimetre marks. Centi (c) means 100 times smaller, milli (m) 1000 times smaller and micro (µ) 1 000 000 times smaller.">
    <text x={x} y={26} fontSize="15" fontWeight="800" fill={big}>1 m</text>
    <Ruler x={x} y={36} w={w} marks={100} />
    <rect x={zx - 2} y={32} width={zw + 4} height={32} rx="4" fill="none" stroke={small} strokeWidth="2.2" />
    <path d={`M${zx} 64L120 100M${zx + zw} 64L420 100`} stroke={small} strokeWidth="1.4" strokeDasharray="4 4" />
    <rect x={120} y={100} width={300} height={34} rx="6" fill="#f6ecd9" stroke={P.resistance} strokeWidth="1.8" />
    {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${120 + i * 30} 100v${i % 5 === 0 ? 16 : 10}`} stroke={P.resistance} strokeWidth="1.6" />)}
    <text x={270} y={128} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={small}>each tiny step is 1 mm: 1000 in a metre</text>
    {[['centi (c)', '÷ 100', 95], ['milli (m)', '÷ 1000', 270], ['micro (µ)', '÷ 1 000 000', 445]].map(([n, f, cx]) => <g key={n as string}>
      <UnitBox x={cx as number} y={186} text={n as string} w={140} fill={smallFill} line={small} colour={small} size={17} />
      <text x={cx as number} y={230} textAnchor="middle" fontSize="18" fontWeight="800" fill={div}>{f}</text>
    </g>)}
    <Lines x={270} y={278} anchor="middle" lines={['deci (d) ÷ 10 is used rarely, e.g. dm³']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

/* ---------- Section 4: converting ---------- */

function Direction() {
  return <PhysicsDiagram schematic={false} title="Two steps: a bigger unit on the top step and a smaller unit on the lower step. Going down, from a bigger unit to a smaller unit, multiply. Going up, from a smaller unit to a bigger unit, divide.">
    <path d="M60 110H250V230H480" stroke={ink} strokeWidth="3" fill="none" />
    <path d="M60 110H250V230H480V250H60Z" fill={P.panel} opacity=".7" />
    <UnitBox x={150} y={82} text="km" w={90} fill={bigFill} line={big} colour={big} />
    <text x={150} y={134} textAnchor="middle" fontSize="13" fontWeight="700" fill={big}>bigger unit</text>
    <UnitBox x={380} y={202} text="m" w={90} fill={smallFill} line={small} colour={small} />
    <text x={380} y={254} textAnchor="middle" fontSize="13" fontWeight="700" fill={small}>smaller unit</text>
    <Curve from={[200, 60]} to={[378, 170]} bend={60} colour={mul} width={3.2} />
    <text x={346} y={62} fontSize="16" fontWeight="800" fill={mul}>× multiply</text>
    <Curve from={[334, 206]} to={[150, 110]} bend={-40} colour={div} width={3.2} />
    <text x={150} y={196} fontSize="16" fontWeight="800" fill={div}>÷ divide</text>
    <Lines x={400} y={100} lines={['more small units,', 'so the number', 'gets bigger']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}
function Chains() {
  return <PhysicsDiagram schematic={false} title="Three conversion chains, each step × 1000 going to the smaller unit and ÷ 1000 going back: kilograms and grams; metres, millimetres and micrometres; cubic metres, cubic decimetres and cubic centimetres.">
    <text x={20} y={30} fontSize="13" fontWeight="700" fill={muted}>mass</text>
    <Chain x={90} y={62} units={['kg', 'g']} gap={130} />
    <text x={280} y={30} fontSize="13" fontWeight="700" fill={muted}>length</text>
    <Chain x={300} y={62} units={['m', 'mm', 'µm']} gap={110} />
    <text x={20} y={176} fontSize="13" fontWeight="700" fill={muted}>volume</text>
    <Chain x={120} y={210} units={['m³', 'dm³', 'cm³']} gap={150} />
    <Lines x={500} y={204} anchor="middle" lines={['1 dm³', '= 1 litre']} size={12.5} weight={650} colour={muted} />
  </PhysicsDiagram>
}
function Work({ step }: { step: 1 | 2 }) {
  return <PhysicsDiagram schematic={false} title={step === 1 ? 'Worked example: a cyclist rides 2.5 km. Going from kilometres to metres is going from a bigger unit to a smaller unit, so multiply by 1000.' : 'Worked example answer: 2.5 km × 1000 = 2500 m. Metres are smaller, so the number is bigger.'}>
    <StepStrip steps={['choose', 'multiply']} active={step} gap={170} y={22} />
    <path d="M30 128Q270 122 510 128" stroke="#b9c7a8" strokeWidth="3" fill="none" />
    <Bike x={90} y={126} s={0.62} />
    <path d="M150 104H470" stroke={ws.y} strokeWidth="2.4" strokeDasharray="7 6" />
    <path d="M470 96v16" stroke={ws.y} strokeWidth="2.4" />
    <text x={310} y={94} textAnchor="middle" fontSize="18" fontWeight="800" fill={ws.y}>2.5 km</text>
    {step === 1 && <g>
      <UnitBox x={170} y={196} text="km" w={80} fill={bigFill} line={big} colour={big} />
      <Curve from={[212, 182]} to={[308, 182]} bend={26} colour={mul} label="× 1000" />
      <UnitBox x={350} y={196} text="m" w={80} fill={smallFill} line={small} colour={small} />
      <Lines x={270} y={262} anchor="middle" lines={['bigger unit to smaller unit: multiply']} size={15} colour={mul} />
    </g>}
    {step === 2 && <g>
      <Card x={70} y={164} w={400} h={60}>
        <Eq x={270} y={202} size={22} pieces={[['2.5 km × 1000 = '], ['2500 m', ws.fit]]} />
      </Card>
      <rect x={336} y={176} width={110} height={36} rx="14" fill="none" stroke={ws.fit} strokeWidth="2.4" />
      <Lines x={270} y={262} anchor="middle" lines={['check: smaller unit, bigger number']} size={14} weight={650} colour={muted} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 5: converting before an equation ---------- */

function Eq1() {
  return <PhysicsDiagram schematic={false} title="The equation v = s ÷ t: distance s in metres, time t in seconds, speed v in metres per second. Convert values into these units first.">
    <Card x={130} y={40} w={280} h={70} hot>
      <Eq x={270} y={86} size={30} pieces={[['v', ws.fit], [' = '], ['s', ws.y], [' ÷ '], ['t', ws.x]]} />
    </Card>
    <Tag x={130} y={160} text="s in m" colour={ws.y} fill={ws.yFill} size={15} w={90} />
    <Tag x={270} y={160} text="t in s" colour={ws.x} fill={ws.xFill} size={15} w={90} />
    <Tag x={410} y={160} text="v in m/s" colour={ws.fit} fill={ws.fitFill} size={15} w={100} />
    <UnitBox x={130} y={236} text="cm, km…" w={110} size={16} />
    <Arrow from={[192, 236]} to={[262, 236]} colour={mul} width={3} />
    <text x={228} y={222} textAnchor="middle" fontSize="13" fontWeight="750" fill={mul}>convert first</text>
    <UnitBox x={300} y={236} text="m" w={64} fill={smallFill} line={small} colour={small} />
    <Arrow from={[340, 236]} to={[400, 236]} colour={ink} width={3} />
    <text x={418} y={242} fontSize="15" fontWeight="750" fill={ink}>substitute</text>
  </PhysicsDiagram>
}
function Toy({ step }: { step: 2 | 3 }) {
  const x0 = 70, w = 300
  return <PhysicsDiagram schematic={false} title={step === 2 ? 'Worked example: a toy car travels 60 cm in 2 s. Step 1, convert: 60 cm ÷ 100 = 0.6 m.' : 'Step 2, substitute: v = s ÷ t = 0.6 ÷ 2 = 0.3 m/s. For weight, W = m × g, the mass must be in kilograms first.'}>
    <StepStrip steps={['convert', 'substitute']} active={step - 1} gap={170} y={22} />
    <Ruler x={x0} y={104} w={w} marks={60} />
    {[0, 20, 40, 60].map(v => <text key={v} x={x0 + v * 5} y={144} textAnchor="middle" fontSize="12" fontWeight="650" fill={muted}>{v}</text>)}
    <text x={x0 + w + 8} y={144} fontSize="12" fontWeight="650" fill={muted}>cm</text>
    <g opacity=".35"><Car x={x0 + 18} y={102} s={0.36} /></g>
    <Car x={x0 + w - 16} y={102} s={0.36} />
    <path d={`M${x0} 60H${x0 + w}`} stroke={ws.y} strokeWidth="2.4" />
    <path d={`M${x0} 52v16M${x0 + w} 52v16`} stroke={ws.y} strokeWidth="2.4" />
    <text x={x0 + w / 2} y={54} textAnchor="middle" fontSize="16" fontWeight="800" fill={ws.y} stroke="white" strokeWidth="5" paintOrder="stroke">60 cm</text>
    <Stopwatch x={460} y={84} r={26} time="2 s" />
    {step === 2 && <Card x={60} y={176} w={420} h={60} hot>
      <Eq x={270} y={214} size={22} pieces={[['60 cm ÷ 100 = '], ['0.6 m', ws.y]]} />
    </Card>}
    {step === 2 && <Lines x={270} y={272} anchor="middle" lines={['cm is smaller than m, so divide']} size={14} weight={650} colour={muted} />}
    {step === 3 && <g>
      <Card x={40} y={170} w={460} h={60}>
        <Eq x={260} y={208} size={21} pieces={[['v = s ÷ t = '], ['0.6', ws.y], [' ÷ '], ['2', ws.x], [' = '], ['0.3 m/s', ws.fit]]} />
      </Card>
      <rect x={370} y={186} width={96} height={32} rx="12" fill="none" stroke={ws.fit} strokeWidth="2.4" />
      <Lines x={270} y={268} anchor="middle" lines={['same idea: W = m × g needs the mass in kg']} size={13.5} weight={650} colour={muted} />
    </g>}
  </PhysicsDiagram>
}

export function WsUnitVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'wsunit-si': return <Si />
    case 'wsunit-base': return <Base />
    case 'wsunit-prefix': return <Prefix />
    case 'wsunit-big': return <Big />
    case 'wsunit-small': return <Small />
    case 'wsunit-direction': return <Direction />
    case 'wsunit-chains': return <Chains />
    case 'wsunit-work-1': return <Work step={1} />
    case 'wsunit-work-2': return <Work step={2} />
    case 'wsunit-eq-1': return <Eq1 />
    case 'wsunit-eq-2': return <Toy step={2} />
    case 'wsunit-eq-3': return <Toy step={3} />
    default: return null
  }
}
