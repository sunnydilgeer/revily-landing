import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, GraphAxes, graphScale, LDR, Thermistor, Resistor, Diode, type GraphFrame } from './PhysicsKit'
import { Circuit, Tag, resTag, Caption, Arrow, Sun, Thermometer, BigSymbol, Card, type Part } from './OhmVisuals'

/*
 * Physics Lesson 19: LDRs, thermistors and sensing circuits. Original schematics; not to scale. Focus ids start with 'sensor-'.
 *
 * Colours (PhysicsKit): light yellow, hot red, cold blue, pd violet, resistance brown, wires ink.
 * The LDR and thermistor graphs share one shape: resistance falls steeply, then levels off (no numbers: Foundation
 * only needs the trend). The fan sensing circuit is reused through "How does a sensing circuit work?": battery on
 * the left, thermistor on the top wire, and the fixed resistor and fan side by side (fan across the fixed resistor).
 * A bar above it shows how the supply pd is shared out; the thermistor's share shrinks when the room warms up.
 */
const { ink, muted } = P
const wall = '#fbf6ee', wallLine = '#c9b89f', coolRoom = '#e9f3fb', warmRoom = '#fdf0e6'

// ---------- Resistance graphs ----------
const GF: GraphFrame = { x: 130, y: 44, width: 300, height: 180, xMax: 10, yMax: 10 }
const falling = (x: number) => 9.2 / (1 + 0.9 * x) + 0.5
function FallingGraph({ xName, low, high, tags, icons }: { xName: string; low: string; high: string; tags?: [string, string]; icons?: 'light' | 'heat' }) {
  const s = graphScale(GF), pts = Array.from({ length: 61 }, (_, i) => i / 6)
  return <g>
    <GraphAxes frame={GF} xLabel="" yLabel="Resistance" yUnit="Ω" origin={false} />
    <path d={pts.map((x, i) => `${i ? 'L' : 'M'}${s.x(x)} ${s.y(falling(x))}`).join('')} stroke={P.resistance} strokeWidth="3.2" fill="none" />
    <text x={GF.x + 4} y={GF.y + GF.height + 20} fontSize="13" fontWeight="700" fill={muted}>{low}</text>
    <text x={GF.x + GF.width} y={GF.y + GF.height + 20} textAnchor="end" fontSize="13" fontWeight="700" fill={muted}>{high}</text>
    <text x={GF.x + GF.width / 2} y={GF.y + GF.height + 44} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{xName}</text>
    {icons === 'light' && <g><circle cx={GF.x + 60} cy={GF.y + GF.height + 15} r="9" fill="#3e4a63" /><circle cx={GF.x + 64} cy={GF.y + GF.height + 12} r="8" fill="white" /><Sun x={GF.x + GF.width - 86} y={GF.y + GF.height + 15} r={7} /></g>}
    {icons === 'heat' && <g><Thermometer x={GF.x + 60} y={GF.y + GF.height + 22} h={26} level={0.2} colour={P.cold} /><Thermometer x={GF.x + GF.width - 52} y={GF.y + GF.height + 22} h={26} level={0.9} colour={P.hot} /></g>}
    {tags && <g>
      {resTag(s.x(0.6) + 14, s.y(falling(0)) + 4, tags[0], 'start')}
      {resTag(s.x(10), s.y(falling(10)) - 48, tags[1], 'end')}
    </g>}
  </g>
}

// ---------- Small drawn things ----------
function Fan({ x, y, s = 1, spinning = false }: { x: number; y: number; s?: number; spinning?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 26V56M-18 58H18" stroke={ink} strokeWidth="3" />
    <circle r="28" fill="white" stroke={ink} strokeWidth="2.2" />
    {[0, 120, 240].map(a => <path key={a} transform={`rotate(${a})`} d="M0 0C4 -8 14 -20 6 -24C-2 -26 -4 -12 0 0Z" fill="#d6e6f3" stroke={P.chargeLine} strokeWidth="1.6" />)}
    <circle r="4" fill={ink} />
    {spinning && <g stroke={P.chargeLine} strokeWidth="2" fill="none" opacity=".8">
      <path d="M-36 -14A38 38 0 0 1 -14 -36" /><path d="M36 14A38 38 0 0 1 14 36" /><path d="M14 -36A38 38 0 0 1 36 -14" />
    </g>}
  </g>
}
function Radiator({ x, y, on }: { x: number; y: number; on: boolean }) {
  return <g>
    {[0, 1, 2, 3, 4].map(i => <rect key={i} x={x + i * 14} y={y} width={11} height={44} rx="5" fill={on ? P.hotFill : '#eef2f5'} stroke={on ? P.hot : '#8fa1ae'} strokeWidth="1.8" />)}
    {on && [10, 32, 54].map(dx => <path key={dx} d={`M${x + dx} ${y - 6}c-5 -6 5 -9 0 -16`} stroke={P.hot} strokeWidth="2" fill="none" />)}
  </g>
}
function Room({ x, w, fill, children }: { x: number; w: number; fill: string; children?: ReactNode }) {
  return <g>
    <rect x={x} y={24} width={w} height={214} rx="18" fill={fill} stroke={wallLine} strokeWidth="1.8" />
    <path d={`M${x + 10} 206H${x + w - 10}`} stroke={wallLine} strokeWidth="1.6" />
    {children}
  </g>
}
function Thermostat({ x, y }: { x: number; y: number }) {
  return <g>
    <rect x={x - 26} y={y - 18} width={52} height={36} rx="8" fill="white" stroke={ink} strokeWidth="1.8" />
    <g transform={`translate(${x} ${y}) scale(0.62)`}><path d="M-28 0H-17M17 0H28" stroke={P.wire} strokeWidth="2.5" /><Thermistor x={0} y={0} length={40} /></g>
  </g>
}

// ---------- The sensing circuit ----------
const L = 60, T = 120, B = 272, J = 320, F = 440
type Share = { therm: number; thermLabel?: string; restLabel?: string }
function PdBar({ share }: { share: Share }) {
  const x0 = 86, w = 420, cut = x0 + w * share.therm
  return <g>
    <text x={x0} y={24} fontSize="13" fontWeight="700" fill={P.pd}>supply pd, shared out:</text>
    <rect x={x0} y={34} width={w} height={30} rx="10" fill="#d9c8f0" stroke={P.pd} strokeWidth="1.8" />
    <path d={`M${x0 + 10} 34H${cut}V64H${x0 + 10}a10 10 0 0 1 -10 -10V44a10 10 0 0 1 10 -10Z`} fill={P.pdFill} />
    <rect x={x0} y={34} width={w} height={30} rx="10" fill="none" stroke={P.pd} strokeWidth="1.8" />
    <path d={`M${cut} 34V64`} stroke={P.pd} strokeWidth="2.2" />
    <text x={(x0 + cut) / 2} y={54} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.pd}>{share.thermLabel ?? 'thermistor'}</text>
    <text x={(cut + x0 + w) / 2} y={54} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.pd}>{share.restLabel ?? 'fixed resistor + fan'}</text>
  </g>
}
function SensingCircuit({ sensor = 'thermistor', load = 'fan', names = true, spinning = false }: { sensor?: 'thermistor' | 'ldr'; load?: 'fan' | 'lamp'; names?: boolean; spinning?: boolean }) {
  const parts: Part[] = [
    { kind: 'battery', x: L, y: 196, rotate: 90 },
    { kind: sensor, x: 190, y: T },
    { kind: 'resistor', x: J, y: 196, rotate: 90 },
    { kind: load === 'fan' ? 'motor' : 'lamp', x: F, y: 196, rotate: 90 },
  ]
  return <g>
    <Circuit loops={[loop4()]} runs={[[[J, T], [F, T], [F, B], [J, B]]]} parts={parts} junctions={[[J, T], [J, B]]} />
    {spinning && <g stroke={P.chargeLine} strokeWidth="2.2" fill="none">
      <path d={`M${F - 26} 178A30 30 0 0 1 ${F - 8} 168`} /><path d={`M${F + 26} 214A30 30 0 0 1 ${F + 8} 224`} />
      <path d={`M${F + 8} 168A30 30 0 0 1 ${F + 26} 178`} />
    </g>}
    {names && <g fontSize="13" fontWeight="700">
      <text x={190} y={T + 40} textAnchor="middle" fill={ink}>{sensor === 'ldr' ? 'LDR' : 'thermistor'}</text>
      <text x={J - 22} y={196} textAnchor="end" fill={ink} dy="-4">fixed</text>
      <text x={J - 22} y={196} textAnchor="end" fill={ink} dy="12">resistor</text>
      <text x={F + 22} y={200} fill={ink}>{load}</text>
    </g>}
  </g>
}
const loop4 = () => [[L, T], [J, T], [J, B], [L, B]] as [number, number][]

export function SensorVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'sensor-ldr': return <PhysicsDiagram title="The LDR symbol: a resistor in a circle with two arrows pointing in, for light falling on it. LDR stands for light dependent resistor: its resistance changes with light.">
      <Sun x={96} y={64} r={20} />
      {[[124, 86], [112, 100]].map(([x, y], i) => <path key={i} d={`M${x} ${y}l${24 + i * 6} ${20 + i * 4}`} stroke={P.lightLine} strokeWidth="2" strokeDasharray="4 5" />)}
      <BigSymbol x={210} y={170} scale={1.75}><path d="M-44 0H-32M32 0H44" stroke={P.wire} strokeWidth="2.5" /><LDR x={0} y={0} length={64} /></BigSymbol>
      <Card x={328} y={90} w={200} h={130} fill="white">
        <text x={428} y={124} textAnchor="middle" fontSize="16" fontWeight="750" fill={ink}>LDR</text>
        <text x={428} y={150} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>light dependent resistor</text>
        <text x={428} y={180} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.resistance}>resistance changes</text>
        <text x={428} y={198} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.resistance}>with light</text>
      </Card>
    </PhysicsDiagram>
    case 'sensor-ldr-graph': return <PhysicsDiagram title="Resistance of an LDR against light intensity: highest in the dark, falling steeply as it gets brighter, then levelling off in bright light." schematic={false}>
      <FallingGraph xName="Light intensity" low="dark" high="bright" icons="light" tags={['dark: highest resistance', 'bright: resistance falls']} />
    </PhysicsDiagram>
    case 'sensor-ldr-uses': return <PhysicsDiagram title="Uses of LDRs: an automatic night light, an outdoor light that comes on at dusk, and a burglar detector that notices a change in light.">
      {[{ x: 14, t: 'night light' }, { x: 190, t: 'outdoor light' }, { x: 366, t: 'burglar detector' }].map(c => <g key={c.x}>
        <Card x={c.x} y={24} w={160} h={220} fill="white" />
        <text x={c.x + 80} y={270} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{c.t}</text>
      </g>)}
      {/* night light: a plug-in light glowing under a crescent moon */}
      <circle cx={70} cy={70} r="14" fill="#3e4a63" /><circle cx={77} cy={65} r="12" fill="white" />
      <rect x={60} y={120} width={68} height={96} rx="10" fill="#f2f5f7" stroke={ink} strokeWidth="1.8" />
      <circle cx={94} cy={168} r="30" fill={P.light} opacity=".55" />
      <circle cx={94} cy={168} r="16" fill="#fff6d6" stroke={P.lightLine} strokeWidth="2" />
      <rect x={82} y={132} width={24} height={10} rx="3" fill="white" stroke={ink} strokeWidth="1.4" />
      {/* outdoor light on a house wall, at dusk */}
      <rect x={204} y={100} width={96} height={128} rx="6" fill={wall} stroke={wallLine} strokeWidth="1.8" />
      <path d="M198 104L252 60L306 104Z" fill="#d99a7c" stroke="#a5634a" strokeWidth="1.8" />
      <rect x={236} y={176} width={30} height={52} rx="4" fill="#e2c9a8" stroke={wallLine} strokeWidth="1.6" />
      <path d="M288 140h14v-12" stroke={ink} strokeWidth="2" fill="none" />
      <path d="M300 146L320 196H296Z" fill={P.light} opacity=".6" />
      <rect x={294} y={136} width={16} height={12} rx="3" fill="#fff6d6" stroke={P.lightLine} strokeWidth="1.8" />
      <circle cx={322} cy={56} r="12" fill="#f3b77a" opacity=".85" />
      {/* burglar detector: a light beam across a doorway */}
      <rect x={392} y={72} width={108} height={156} rx="6" fill={wall} stroke={wallLine} strokeWidth="1.8" />
      <rect x={414} y={92} width={64} height={136} rx="4" fill="#eef2f5" stroke={wallLine} strokeWidth="1.6" />
      <rect x={400} y={166} width={12} height={20} rx="3" fill="#fff6d6" stroke={P.lightLine} strokeWidth="1.6" />
      <rect x={480} y={166} width={12} height={20} rx="3" fill="white" stroke={ink} strokeWidth="1.6" />
      <path d="M412 176H480" stroke={P.lightLine} strokeWidth="3" strokeDasharray="6 5" />
      <text x={486} y={206} textAnchor="middle" fontSize="12" fontWeight="700" fill={muted}>LDR</text>
    </PhysicsDiagram>
    case 'sensor-thermistor': return <PhysicsDiagram title="The thermistor symbol: a resistor with a bent line through it. A thermistor is a temperature-dependent resistor.">
      <Thermometer x={94} y={124} h={80} level={0.6} />
      <BigSymbol x={210} y={170} scale={1.75}><path d="M-44 0H-32M32 0H44" stroke={P.wire} strokeWidth="2.5" /><Thermistor x={0} y={0} length={64} /></BigSymbol>
      <Card x={328} y={90} w={200} h={140} fill="white">
        <text x={428} y={124} textAnchor="middle" fontSize="16" fontWeight="750" fill={ink}>thermistor</text>
        <text x={428} y={152} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>temperature-dependent</text>
        <text x={428} y={170} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>resistor</text>
        <text x={428} y={194} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.resistance}>resistance changes</text>
        <text x={428} y={212} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.resistance}>with temperature</text>
      </Card>
    </PhysicsDiagram>
    case 'sensor-thermistor-graph': return <PhysicsDiagram title="Resistance of a thermistor against temperature: greater when cool, dropping as it gets hotter." schematic={false}>
      <FallingGraph xName="Temperature" low="cold" high="hot" icons="heat" tags={['cool: greater resistance', 'hot: resistance drops']} />
    </PhysicsDiagram>
    case 'sensor-thermostat': return <PhysicsDiagram title="A thermostat uses a thermistor to detect the temperature. When the room is cool the heating is on; when the room is warm the heating is off.">
      <Room x={16} w={244} fill={coolRoom}>
        <Radiator x={120} y={150} on />
        <Thermostat x={62} y={96} />
        <Thermometer x={210} y={120} h={60} level={0.25} colour={P.cold} />
        <text x={138} y={228} textAnchor="middle" fontSize="14" fontWeight="700" fill={P.cold}>cool: heating on</text>
      </Room>
      <Room x={280} w={244} fill={warmRoom}>
        <Radiator x={384} y={150} on={false} />
        <Thermostat x={326} y={96} />
        <Thermometer x={474} y={120} h={60} level={0.85} colour={P.hot} />
        <text x={402} y={228} textAnchor="middle" fontSize="14" fontWeight="700" fill={P.hot}>warm: heating off</text>
      </Room>
      <text x={62} y={134} textAnchor="middle" fontSize="12" fontWeight="700" fill={muted}>thermostat</text>
      <text x={326} y={134} textAnchor="middle" fontSize="12" fontWeight="700" fill={muted}>thermostat</text>
      <Caption text="the thermistor inside senses the temperature" y={272} />
    </PhysicsDiagram>
    case 'sensor-what': return <PhysicsDiagram title="A hot room with a fan and a thermometer. A sensing circuit lets the conditions, here the temperature, change what the fan does.">
      <Room x={40} w={300} fill={warmRoom}>
        <rect x={70} y={54} width={80} height={70} rx="8" fill="#e6f2fb" stroke={wallLine} strokeWidth="1.8" />
        <path d="M110 54V124M70 89H150" stroke={wallLine} strokeWidth="1.6" />
        <Sun x={94} y={76} r={11} />
        <Fan x={250} y={130} s={1.1} spinning />
        <Thermometer x={170} y={190} h={60} level={0.85} />
      </Room>
      <Tag x={440} y={96} text="temperature" colour={P.hot} fill={P.hotFill} />
      <Arrow from={[440, 116]} to={[440, 150]} />
      <Tag x={440} y={172} text="fan speed" colour={P.chargeLine} fill="#e3eef8" />
      <text x={440} y={212} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>conditions change</text>
      <text x={440} y={230} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>what the fan does</text>
    </PhysicsDiagram>
    case 'sensor-circuit': return <PhysicsDiagram title="The sensing circuit: a thermistor in series with a fixed resistor, and the fan connected across the fixed resistor. The supply pd is shared between the thermistor and the fixed resistor with the fan.">
      <PdBar share={{ therm: 0.5 }} />
      <SensingCircuit />
    </PhysicsDiagram>
    case 'sensor-share': return <PhysicsDiagram title="The bigger a component's resistance, the bigger its share of the pd. Here the thermistor has a large resistance and a big share. The fan always has the same pd as the fixed resistor.">
      <PdBar share={{ therm: 0.7, restLabel: 'resistor + fan' }} />
      <SensingCircuit names={false} />
      {resTag(190, T + 42, 'large resistance: big share')}
      <text x={J - 22} y={236} textAnchor="end" fontSize="13" fontWeight="700" fill={P.resistance}>small resistance:</text>
      <text x={J - 22} y={253} textAnchor="end" fontSize="13" fontWeight="700" fill={P.resistance}>small share</text>
      <text x={F + 22} y={200} fontSize="13" fontWeight="700" fill={ink}>fan</text>
      <Tag x={(J + F) / 2} y={196} text="same pd" colour={P.pd} fill={P.pdFill} size={12} />
    </PhysicsDiagram>
    case 'sensor-hot': return <PhysicsDiagram title="The room gets hotter: the thermistor's resistance decreases, so it takes a smaller share of the pd. The pd across the fixed resistor and fan rises.">
      <PdBar share={{ therm: 0.26 }} />
      <SensingCircuit names={false} />
      <Thermometer x={120} y={250} h={50} level={0.9} />
      {resTag(190, T + 42, 'hot: resistance falls')}
      <text x={F + 22} y={200} fontSize="13" fontWeight="700" fill={ink}>fan</text>
      <Tag x={J - 20} y={236} text="more pd" colour={P.pd} fill={P.pdFill} anchor="end" />
    </PhysicsDiagram>
    case 'sensor-fan': return <PhysicsDiagram title="More pd across the fan means more energy, so the fan goes faster in a hotter room.">
      <PdBar share={{ therm: 0.26 }} />
      <SensingCircuit names={false} spinning />
      <text x={F + 34} y={200} fontSize="13" fontWeight="700" fill={ink}>fan</text>
      <text x={190} y={196} textAnchor="middle" fontSize="14" fontWeight="700" fill={P.chargeLine}>more pd across the fan:</text>
      <text x={190} y={216} textAnchor="middle" fontSize="14" fontWeight="700" fill={P.chargeLine}>more energy, faster</text>
    </PhysicsDiagram>
    case 'sensor-q-ldr': return <PhysicsDiagram title="A graph of the resistance of a component against light intensity." schematic={false}>
      <FallingGraph xName="Light intensity" low="dark" high="bright" icons="light" />
    </PhysicsDiagram>
    case 'sensor-q-circuit': return <PhysicsDiagram title="A circuit: a battery, an LDR in series with a fixed resistor, and a lamp connected across the fixed resistor.">
      <SensingCircuit sensor="ldr" load="lamp" />
    </PhysicsDiagram>
    case 'sensor-q-symbols': return <PhysicsDiagram title="Four circuit symbols, numbered 1 to 4." schematic={false} viewBox="0 0 540 200">
      {[0, 1, 2, 3].map(i => {
        const x = 14 + i * 130
        return <g key={i}>
          <Card x={x} y={24} w={118} h={150} fill="white" />
          <circle cx={x + 22} cy={46} r="13" fill="white" stroke={ink} strokeWidth="2" />
          <text x={x + 22} y={51} textAnchor="middle" fontSize="14" fontWeight="750" fill={ink}>{i + 1}</text>
          <g transform={`translate(${x + 59} 112)`}>
            <path d="M-50 0H-34M34 0H50" stroke={P.wire} strokeWidth="2.5" />
            {i === 0 && <Resistor x={0} y={0} length={68} />}
            {i === 1 && <LDR x={0} y={0} length={68} />}
            {i === 2 && <Diode x={0} y={0} length={68} />}
            {i === 3 && <Thermistor x={0} y={0} length={68} />}
          </g>
        </g>
      })}
    </PhysicsDiagram>
    default: return null
  }
}
