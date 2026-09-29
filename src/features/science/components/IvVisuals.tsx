import { physicsPalette as P, PhysicsDiagram, GraphAxes, graphScale, Lamp, Diode, Resistor, type GraphFrame, type Pt } from './PhysicsKit'
import { Circuit, Tag, pdTag, currentTag, Caption, EqCard, Arrow, Bulb, BigSymbol, loop, faded, type Part } from './OhmVisuals'

/*
 * Physics Lesson 18: I–V characteristics (required practical). Original schematics; not to scale. Focus ids start with 'ivchar-'.
 *
 * Current is on the vertical axis and potential difference on the horizontal; the axes cross at the origin so the
 * reversed readings show. One colour per component, the same in every graph: ohmic conductor green, filament lamp
 * orange-red, diode blue. Curves are drawn from simple shapes (not measured data): a straight line, a curve that
 * flattens (lamp) and a curve that stays flat and then rises steeply on one side only (diode).
 * The test circuit is reused through "How do you collect the data?", the step highlighted and the rest plain.
 */
const { ink, muted } = P
const ohmicC = P.useful, lampC = '#d0622b', diodeC = P.chargeLine

type Curve = (v: number) => number
const ohmic: Curve = v => v / 8
const lamp: Curve = v => 0.293 * Math.asinh(v / 1.5)
const diode: Curve = v => v <= 0 ? -0.004 * (1 - Math.exp(v)) : 0.0136 * (Math.exp(v / 1.1) - 1)

function trace(frame: GraphFrame, f: Curve) {
  const s = graphScale(frame), lo = frame.xMin ?? 0, pts: string[] = []
  for (let v = lo; v <= frame.xMax + 1e-9; v += (frame.xMax - lo) / 120) {
    const i = f(v)
    if (i > frame.yMax || i < (frame.yMin ?? 0)) { if (pts.length) break; continue }
    pts.push(`${pts.length ? 'L' : 'M'}${s.x(v)} ${s.y(i)}`)
  }
  return pts.join('')
}
function Cross({ at: [x, y], colour = ink }: { at: Pt; colour?: string }) {
  return <path d={`M${x - 5} ${y - 5}l10 10M${x + 5} ${y - 5}l-10 10`} stroke={colour} strokeWidth="2.4" />
}

// A full four-quadrant I–V graph.
const BIG: GraphFrame = { x: 40, y: 40, width: 280, height: 200, xMin: -6, xMax: 6, yMin: -0.8, yMax: 0.8 }
function IVAxes({ frame = BIG, small = false }: { frame?: GraphFrame; small?: boolean }) {
  return small
    ? <GraphAxes frame={frame} xLabel="V" yLabel="I" />
    : <g>
      <GraphAxes frame={frame} xLabel="" yLabel="Current" yUnit="A" />
      <text x={graphScale(frame).x(0) + 12} y={graphScale(frame).y(0) + 24} textAnchor="start" fontSize="13" fontWeight="700" fill={ink}>Potential difference in V</text>
    </g>
}
function CurveLine({ frame = BIG, f, colour, width = 3, opacity = 1 }: { frame?: GraphFrame; f: Curve; colour: string; width?: number; opacity?: number }) {
  return <path d={trace(frame, f)} stroke={colour} strokeWidth={width} fill="none" opacity={opacity} />
}

// Notes in the column to the right of the big graph.
function SideNote({ y, lines, colour, weight = 700 }: { y: number; lines: string[]; colour: string; weight?: number }) {
  return <text x={350} y={y} fontSize="14" fontWeight={weight} fill={colour}>{lines.map((l, i) => <tspan key={i} x={350} dy={i ? 18 : 0}>{l}</tspan>)}</text>
}

// A small graph for the side-by-side pictures.
function Mini({ x, f, colour, label, number, symbol }: { x: number; f?: Curve; colour: string; label?: string[]; number?: number; symbol?: 'resistor' | 'lamp' | 'diode' }) {
  const frame: GraphFrame = { x, y: 44, width: 132, height: 150, xMin: -6, xMax: 6, yMin: -0.8, yMax: 0.8 }
  return <g>
    <IVAxes frame={frame} small />
    {f && <CurveLine frame={frame} f={f} colour={colour} />}
    {number && <g><circle cx={x + 8} cy={40} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x + 8} y={45} textAnchor="middle" fontSize="14" fontWeight="750" fill={ink}>{number}</text></g>}
    {label && label.map((l, i) => <text key={i} x={x + 66} y={232 + i * 17} textAnchor="middle" fontSize="13" fontWeight="700" fill={colour}>{l}</text>)}
    {symbol && <g transform={`translate(${x + 66} 266)`}>
      <path d="M-40 0H-20M20 0H40" stroke={P.wire} strokeWidth="2.5" />
      {symbol === 'resistor' ? <Resistor x={0} y={0} length={42} /> : symbol === 'lamp' ? <Lamp x={0} y={0} length={40} /> : <Diode x={0} y={0} length={40} />}
    </g>}
  </g>
}

// ---------- The test circuit ----------
type CircuitShow = { hi?: 'varres' | 'battery' | 'component'; reversed?: boolean; diode?: boolean }
function TestCircuit({ s }: { s: CircuitShow }) {
  const L = 40, R = 330, T = 64, B = 186, VB = 248
  const dim = !!s.hi
  const parts: Part[] = [
    { kind: 'battery', x: 110, y: T, flip: s.reversed, hi: s.hi === 'battery', dim: dim && s.hi !== 'battery' },
    { kind: 'varres', x: 240, y: T, hi: s.hi === 'varres', dim: dim && s.hi !== 'varres' },
    { kind: s.diode ? 'milliammeter' : 'ammeter', x: R, y: 125, rotate: 90, dim },
  ]
  const [a, b] = s.diode ? [180, 260] : [127, 243]
  if (s.diode) parts.push({ kind: 'resistor', x: 100, y: B, hi: true }, { kind: 'diode', x: 220, y: B })
  else parts.push({ kind: 'box', x: 185, y: B, length: 92, dim })
  const mid = (a + b) / 2
  // Conventional current leaves the + terminal (long line). Normally + is on the left, so current runs anticlockwise here.
  const arrows = s.reversed
    ? [{ x: L, y: 125, rotate: -90 }, { x: 300, y: B, rotate: 180 }, { x: R, y: 90, rotate: 90 }]
    : [{ x: L, y: 125, rotate: 90 }, { x: 290, y: B, rotate: 0 }, { x: R, y: 90, rotate: -90 }]
  return <g>
    <Circuit loops={[loop(L, T, R, B)]} parts={parts} arrows={arrows} dim={dim && !s.diode} brightArrows={s.reversed} />
    <g opacity={dim && !s.diode ? faded : 1}>
      <Circuit runs={[[[a, B], [a, VB], [b, VB], [b, B]]]} parts={[{ kind: 'voltmeter', x: mid, y: VB }]} junctions={[[a, B], [b, B]]} />
      <text x={b + 10} y={VB + 5} fontSize="13" fontWeight="650" fill={muted}>voltmeter</text>
    </g>
    <text x={s.reversed ? 124 : 92} y={44} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>+</text>
    <g fontSize="13" fontWeight="650" fill={muted} opacity={dim ? 0.8 : 1}>
      <text x={110} y={100} textAnchor="middle">battery</text>
      <text x={240} y={34} textAnchor="middle">variable resistor</text>
      <text x={R - (s.diode ? 26 : 24)} y={130} textAnchor="end">{s.diode ? 'milliammeter' : 'ammeter'}</text>
    </g>
    {s.diode && <g>
      <text x={100} y={222} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.resistance}>protective</text>
      <text x={100} y={238} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.resistance}>resistor</text>
      <text x={220} y={170} textAnchor="middle" fontSize="13" fontWeight="700" fill={diodeC}>diode</text>
    </g>}
  </g>
}

export function IvVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'ivchar-meaning': return <PhysicsDiagram title="An I–V characteristic: a graph with current on the vertical axis and potential difference on the horizontal axis, crossing at the origin." schematic={false}>
      <IVAxes />
      <CurveLine f={lamp} colour={muted} opacity={0.35} />
      <Tag x={356} y={60} text="current: up the side" colour={P.current} fill="#fbe5dc" anchor="start" />
      <Tag x={356} y={214} text="pd: along the bottom" colour={P.pd} fill={P.pdFill} anchor="start" />
      <Caption text="an I–V characteristic" y={288} x={180} />
    </PhysicsDiagram>
    case 'ivchar-linear': {
      const f1: GraphFrame = { x: 50, y: 44, width: 170, height: 170, xMax: 6, yMax: 0.8 }
      const f2: GraphFrame = { x: 320, y: 44, width: 170, height: 170, xMax: 6, yMax: 0.8 }
      return <PhysicsDiagram title="A straight-line graph means a linear component, such as a fixed resistor. A curved graph means a non-linear component, such as a filament lamp or a diode." schematic={false}>
        <GraphAxes frame={f1} xLabel="V" yLabel="I" origin={false} />
        <CurveLine frame={f1} f={ohmic} colour={ohmicC} />
        <GraphAxes frame={f2} xLabel="V" yLabel="I" origin={false} />
        <CurveLine frame={f2} f={lamp} colour={lampC} />
        <Tag x={135} y={262} text="linear: fixed resistor" colour={ohmicC} fill={P.usefulFill} />
        <Tag x={405} y={262} text="non-linear: lamp, diode" colour={lampC} fill="#fbe3d6" />
        <text x={135} y={236} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>straight</text>
        <text x={405} y={236} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>curved</text>
      </PhysicsDiagram>
    }
    case 'ivchar-point':
    case 'ivchar-calc': {
      const calc = focus === 'ivchar-calc'
      const f: GraphFrame = calc ? { x: 60, y: 40, width: 190, height: 190, xMax: 6, yMax: 0.8 } : { x: 110, y: 40, width: 300, height: 190, xMax: 6, yMax: 0.8 }
      const s = graphScale(f), p = s.pt(4, 0.5)
      return <PhysicsDiagram title={calc ? 'At the point where V = 4.0 V and I = 0.50 A, R = V ÷ I = 4.0 ÷ 0.50 = 8.0 Ω.' : 'Read off a point on the graph: dashed lines down to the pd axis give V = 4.0 V, and across to the current axis give I = 0.50 A.'} schematic={false}>
        <GraphAxes frame={f} xLabel={calc ? 'V' : 'Potential difference'} xUnit="V" yLabel={calc ? 'I' : 'Current'} yUnit="A" xTicks={[1, 2, 3, 4, 5, 6]} yTicks={[0.2, 0.4, 0.6, 0.8]} />
        <CurveLine frame={f} f={lamp} colour={lampC} />
        <g opacity={calc ? 0.45 : 1}>
          <path d={`M${f.x} ${p[1]}H${p[0]}V${f.y + f.height}`} stroke={ink} strokeWidth="1.8" strokeDasharray="5 5" fill="none" />
          <circle cx={p[0]} cy={p[1]} r="6" fill="white" stroke={ink} strokeWidth="2.4" />
        </g>
        {!calc && <g>
          {pdTag(p[0] + 8, f.y + f.height - 22, 'V = 4.0 V', 'start')}
          {currentTag(f.x + 8, p[1] - 22, 'I = 0.50 A', 'start')}
        </g>}
        {calc && <EqCard x={290} y={40} w={238} title="Resistance at this point" rows={[{ text: 'R = V ÷ I', state: 'dim' }, { text: 'R = 4.0 ÷ 0.50' }, { text: 'R = 8.0 Ω', state: 'hi', colour: P.resistance }]} />}
      </PhysicsDiagram>
    }
    case 'ivchar-circuit': return <PhysicsDiagram title="The test circuit: a battery, a variable resistor, the component and an ammeter in series, with a voltmeter in parallel across the component only.">
      <TestCircuit s={{}} />
      <Tag x={452} y={200} text="ammeter: in series" colour={ink} />
      <Tag x={452} y={238} text="voltmeter: across it" colour={ink} />
    </PhysicsDiagram>
    case 'ivchar-vary': return <PhysicsDiagram title="Change the variable resistor to change the current and the pd. At each setting, read both meters and write them down.">
      <TestCircuit s={{ hi: 'varres' }} />
      <g transform="translate(368 58)">
        <rect x={0} y={0} width={156} height={126} rx="14" fill="white" stroke={P.panelLine} strokeWidth="1.6" />
        <text x={40} y={26} textAnchor="middle" fontSize="13" fontWeight="750" fill={P.pd}>V in V</text>
        <text x={116} y={26} textAnchor="middle" fontSize="13" fontWeight="750" fill={P.current}>I in A</text>
        <path d="M0 38H156M78 8V118" stroke={P.panelLine} strokeWidth="1.4" />
        {[['2.0', '0.32'], ['4.0', '0.50'], ['…', '…']].map(([v, i], k) => <g key={k}>
          <text x={40} y={62 + k * 26} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{v}</text>
          <text x={116} y={62 + k * 26} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{i}</text>
        </g>)}
      </g>
      <Caption text="switch off between readings: lamps and wires get hot" x={270} y={290} />
    </PhysicsDiagram>
    case 'ivchar-reverse': return <PhysicsDiagram title="Swap over the two wires at the battery: + is now on the other side and the current flows the other way round. Take more readings.">
      <TestCircuit s={{ hi: 'battery', reversed: true }} />
      <path d="M86 112Q110 130 134 112" stroke={P.current} strokeWidth="2.2" fill="none" />
      <Arrow from={[128, 117]} to={[136, 110]} colour={P.current} />
      <Arrow from={[92, 117]} to={[84, 110]} colour={P.current} />
      <Tag x={452} y={98} text="swap the wires" colour={P.current} fill="#fbe5dc" />
      <Tag x={452} y={130} text="at the battery" colour={P.current} fill="#fbe5dc" />
      <text x={452} y={176} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>current now flows</text>
      <text x={452} y={194} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>the other way</text>
    </PhysicsDiagram>
    case 'ivchar-plot': {
      const s = graphScale(BIG)
      return <PhysicsDiagram title="Plot current against pd. Readings with the current reversed go on the other side of the origin. Draw a smooth curve of best fit through the crosses." schematic={false}>
        <IVAxes />
        <CurveLine f={lamp} colour={lampC} />
        {[-5, -3.5, -2, -1, 1, 2, 3.5, 5].map(v => <Cross key={v} at={s.pt(v, lamp(v) + (v % 2 ? 0.02 : -0.02))} />)}
        <Tag x={336} y={70} text="normal direction" colour={muted} anchor="start" />
        <Tag x={50} y={262} text="reversed" colour={muted} anchor="start" />
        <SideNote y={196} lines={['smooth curve', 'of best fit']} colour={lampC} />
      </PhysicsDiagram>
    }
    case 'ivchar-diode-circuit': return <PhysicsDiagram title="Testing a diode: a protective resistor in series with the diode, a milliammeter for the small currents, and the voltmeter across the diode only.">
      <TestCircuit s={{ diode: true }} />
      <Tag x={452} y={200} text="small currents: mA" colour={P.current} fill="#fbe5dc" />
    </PhysicsDiagram>
    case 'ivchar-ohmic': return <PhysicsDiagram title="Ohmic conductor, such as a resistor at constant temperature: a straight line through the origin, so the resistance is constant." schematic={false}>
      <IVAxes />
      <CurveLine f={ohmic} colour={ohmicC} width={3.4} />
      <SideNote y={70} lines={['ohmic conductor']} colour={ohmicC} />
      <SideNote y={94} lines={['e.g. a resistor at', 'constant temperature']} colour={muted} weight={650} />
      <SideNote y={210} lines={['straight line:', 'resistance constant']} colour={ohmicC} />
    </PhysicsDiagram>
    case 'ivchar-lamp': return <PhysicsDiagram title="Filament lamp: a curve through the origin that gets less steep as the pd increases, in both directions, because the filament heats up and its resistance increases." schematic={false}>
      <IVAxes />
      <CurveLine f={lamp} colour={lampC} width={3.4} />
      <Bulb x={380} y={96} s={0.42} glow={0.25} />
      <Bulb x={480} y={96} s={0.5} glow={1} />
      <Arrow from={[408, 96]} to={[446, 96]} colour={lampC} />
      <text x={430} y={148} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>more pd, hotter</text>
      <SideNote y={196} lines={['less steep:', 'resistance increases', 'as it heats up']} colour={lampC} />
    </PhysicsDiagram>
    case 'ivchar-diode': return <PhysicsDiagram title="Diode: almost no current in the reverse direction, so the graph is flat; in the forward direction it curves up steeply. Current flows one way only." schematic={false}>
      <IVAxes />
      <CurveLine f={diode} colour={diodeC} width={3.4} />
      <SideNote y={62} lines={['forward:', 'rises steeply']} colour={diodeC} />
      <SideNote y={194} lines={['reverse: flat,', 'almost no current']} colour={diodeC} />
      <BigSymbol x={430} y={122} scale={1.2}><path d="M-26 0H26" stroke={P.wire} strokeWidth="2.5" /><Diode x={0} y={0} length={40} /></BigSymbol>
      <Tag x={430} y={276} text="one direction only" colour={diodeC} fill="#e3eef8" />
    </PhysicsDiagram>
    case 'ivchar-three': return <PhysicsDiagram title="The three I–V graphs: a straight line through the origin for an ohmic conductor, a curve that flattens for a filament lamp, and flat then a steep rise for a diode." schematic={false}>
      <Mini x={24} f={ohmic} colour={ohmicC} label={['ohmic conductor']} symbol="resistor" />
      <Mini x={204} f={lamp} colour={lampC} label={['filament lamp']} symbol="lamp" />
      <Mini x={384} f={diode} colour={diodeC} label={['diode']} symbol="diode" />
    </PhysicsDiagram>
    case 'ivchar-q-graphs': return <PhysicsDiagram title="Three I–V graphs, numbered 1 to 3." schematic={false} viewBox="0 0 540 214">
      <Mini x={24} f={diode} colour={ink} number={1} />
      <Mini x={204} f={lamp} colour={ink} number={2} />
      <Mini x={384} f={ohmic} colour={ink} number={3} />
    </PhysicsDiagram>
    default: return null
  }
}
