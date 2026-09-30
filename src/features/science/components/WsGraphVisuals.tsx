import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, GraphAxes, graphScale, type GraphFrame, type Pt } from './PhysicsKit'
import { ink, muted, r1, Tag, StepStrip, Card, Eq } from './EnergyStoreVisuals'
import { Flask, Bubbles, Chips } from './GasRateVisuals'
import { ws, range, PlotCross, Grid, Glow } from './WsPresentVisuals'

/*
 * Working Scientifically Lesson 8: Interpreting graphs. Original, code-native graphs; every plotted value is exact and
 * matches the lesson text (worked example: (10 s, 6 cm³) and (30 s, 18 cm³), gradient 0.6 cm³/s; question graph:
 * A (20 s, 15 cm³) and B (60 s, 45 cm³), gradient 0.75 cm³/s). Focus ids start with 'wsgraph-'.
 *
 * Colours as in the presenting-data lesson: x and change in x blue, y and change in y brown-orange, the line green,
 * the gradient triangle dashed ink. Correlation graphs use pencil crosses with a faint trend line.
 */

const dot = (p: Pt, colour = ink) => <circle cx={p[0]} cy={p[1]} r="5.5" fill="white" stroke={colour} strokeWidth="2.6" />

/* ---------- Section 2: gradient ---------- */

function Panel({ x, kind, label, lines }: { x: number; kind: 'steep' | 'shallow' | 'flat'; label: string; lines: string[] }) {
  const ox = x + 26, oy = 200, w = 118, h = 130
  const end: Pt = kind === 'steep' ? [ox + 44, oy - h] : kind === 'shallow' ? [ox + w, oy - 42] : [ox + w, oy - 64]
  const start: Pt = kind === 'flat' ? [ox, oy - 64] : [ox, oy]
  return <g>
    <rect x={x} y={34} width={160} height={250} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <path d={`M${ox} ${oy - h - 10}V${oy}H${ox + w + 8}`} stroke={ink} strokeWidth="2" fill="none" />
    <path d={`M${start[0]} ${start[1]}L${end[0]} ${end[1]}`} stroke={ws.fit} strokeWidth="4" />
    <text x={x + 80} y={232} textAnchor="middle" fontSize="16" fontWeight="800" fill={ink}>{label}</text>
    <Lines x={x + 80} y={254} anchor="middle" lines={lines} size={13} weight={650} colour={muted} />
  </g>
}
function Steep() {
  return <PhysicsDiagram schematic={false} title="Three lines. A steep line: the dependent variable changes quickly. A shallow line: it changes slowly. A flat line: no change.">
    <Panel x={10} kind="steep" label="steep" lines={['changes quickly']} />
    <Panel x={190} kind="shallow" label="shallow" lines={['changes slowly']} />
    <Panel x={370} kind="flat" label="flat" lines={['no change']} />
    <text x={270} y={22} textAnchor="middle" fontSize="14" fontWeight="700" fill={muted}>gradient = how steep the line is</text>
  </PhysicsDiagram>
}

const CF: GraphFrame = { x: 96, y: 46, width: 250, height: 190, xMax: 60, yMax: 60 }
function Compare() {
  const s = graphScale(CF)
  return <PhysicsDiagram schematic={false} title="Volume of gas against time for two reactions. Line A is steeper than line B, so reaction A makes gas faster.">
    <GraphAxes frame={CF} xLabel="Time (s)" yLabel="Volume of gas (cm³)" />
    <path d={s.path([[0, 0], [30, 56]])} stroke={P.kineticLine} strokeWidth="3.6" fill="none" />
    <path d={s.path([[0, 0], [60, 30]])} stroke={P.chemicalLine} strokeWidth="3.6" fill="none" />
    <Tag x={s.x(30) + 18} y={s.y(56) + 4} text="A" colour={P.kineticLine} fill={P.kinetic} size={14} w={28} />
    <Tag x={s.x(60) - 4} y={s.y(30) - 22} text="B" colour={P.chemicalLine} fill={P.chemical} size={14} w={28} />
    <g>
      <Flask cx={410} base={126} h={80} w={66} level={26}><Chips cx={410} base={126} n={5} spread={40} size={0.7} /><Bubbles pts={[[398, 112], [414, 106], [424, 114], [404, 98], [418, 92], [410, 84]]} r={2.6} /></Flask>
      <text x={470} y={96} fontSize="16" fontWeight="800" fill={P.kineticLine}>A</text>
      <text x={470} y={116} fontSize="13" fontWeight="650" fill={muted}>faster</text>
      <Flask cx={410} base={250} h={80} w={66} level={26}><Chips cx={410} base={250} n={5} spread={40} size={0.7} /><Bubbles pts={[[402, 236], [418, 228]]} r={2.6} /></Flask>
      <text x={470} y={220} fontSize="16" fontWeight="800" fill={P.chemicalLine}>B</text>
      <text x={470} y={240} fontSize="13" fontWeight="650" fill={muted}>slower</text>
    </g>
  </PhysicsDiagram>
}

/** A straight line with its gradient triangle: upright side = change in y, bottom side = change in x. */
function Triangle({ a, b, yText, xText, size = 14 }: { a: Pt; b: Pt; yText?: string; xText?: string; size?: number }) {
  return <g>
    <path d={`M${a[0]} ${a[1]}H${b[0]}`} stroke={ws.x} strokeWidth="2.6" strokeDasharray="7 5" />
    <path d={`M${b[0]} ${a[1]}V${b[1]}`} stroke={ws.y} strokeWidth="2.6" strokeDasharray="7 5" />
    <path d={`M${b[0] - 12} ${a[1]}v-12h12`} stroke={muted} strokeWidth="1.4" fill="none" />
    {yText && <text x={b[0] + 10} y={r1((a[1] + b[1]) / 2 + 5)} fontSize={size} fontWeight="750" fill={ws.y} stroke="white" strokeWidth="4" paintOrder="stroke">{yText}</text>}
    {xText && <text x={r1((a[0] + b[0]) / 2)} y={a[1] + 22} textAnchor="middle" fontSize={size} fontWeight="750" fill={ws.x} stroke="white" strokeWidth="4" paintOrder="stroke">{xText}</text>}
  </g>
}
function Formula() {
  const a: Pt = [120, 240], b: Pt = [320, 110]
  return <PhysicsDiagram schematic={false} title="Gradient equals change in y divided by change in x. On a straight line, a right-angled triangle shows the change in y going up and the change in x going across.">
    <Card x={60} y={14} w={420} h={50} hot>
      <Eq x={270} y={46} size={19} pieces={[['gradient = '], ['change in y', ws.y], [' ÷ '], ['change in x', ws.x]]} />
    </Card>
    <path d={`M${a[0] - 40} ${a[1] + 26}L${b[0] + 40} ${b[1] - 26}`} stroke={ws.fit} strokeWidth="3.6" />
    <Triangle a={a} b={b} yText="change in y" xText="change in x" size={15} />
    {dot(a)}{dot(b)}
    <Lines x={330} y={202} lines={['how far', 'it goes up']} size={13} weight={650} colour={ws.y} />
    <Lines x={220} y={290} anchor="middle" lines={['how far it goes across']} size={13} weight={650} colour={ws.x} />
  </PhysicsDiagram>
}
function Rate() {
  const F: GraphFrame = { x: 96, y: 50, width: 230, height: 180, xMax: 50, yMax: 30 }, s = graphScale(F)
  return <PhysicsDiagram schematic={false} title="A graph with time in seconds on the x-axis. Its gradient is a rate. The unit is the y unit divided by the x unit: cm³ ÷ s gives cm³/s.">
    <Glow x={F.x + F.width - 68} y={F.y + F.height + 5} w={76} h={24} colour={ws.x} fill={ws.xFill} />
    <GraphAxes frame={F} xLabel="Time (s)" yLabel="Volume of gas (cm³)" />
    <path d={s.path([[0, 0], [45, 27]])} stroke={ws.fit} strokeWidth="3.6" fill="none" />
    <Tag x={440} y={60} text="time on the x-axis" colour={ws.x} fill={ws.xFill} size={13} w={170} />
    <Lines x={440} y={92} anchor="middle" lines={['so the gradient', 'is a rate']} size={13} weight={650} colour={muted} />
    <Card x={362} y={140} w={160} h={100}>
      <text x={442} y={164} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>unit of the rate</text>
      <Eq x={442} y={196} size={18} pieces={[['cm³', ws.y], [' ÷ '], ['s', ws.x]]} />
      <Eq x={442} y={226} size={19} pieces={[['= cm³/s']]} />
    </Card>
  </PhysicsDiagram>
}

/* ---------- Section 3: worked example ---------- */

const WF: GraphFrame = { x: 96, y: 66, width: 236, height: 180, xMax: 40, yMax: 24 }
function Worked({ step }: { step: number }) {
  const s = graphScale(WF), a = s.pt(10, 6), b = s.pt(30, 18)
  const titles = [
    'Worked example, step 1. A straight line of gas volume against time passes through (10 s, 6 cm³) and (30 s, 18 cm³). These two points are marked.',
    'Step 2. A triangle is drawn: down from (30 s, 18 cm³) and across from (10 s, 6 cm³). The upright side is the change in y and the bottom side is the change in x.',
    'Step 3. Change in y = 18 − 6 = 12 cm³. Change in x = 30 − 10 = 20 s.',
    'Step 4. Gradient = 12 ÷ 20 = 0.6. The rate of reaction is 0.6 cm³/s.',
  ]
  const lines: { text: ReactNode; at: number }[] = [
    { at: 2, text: <Eq x={372} y={112} anchor="start" size={16} pieces={[['change in y', ws.y]]} /> },
    { at: 2, text: <Eq x={372} y={136} anchor="start" size={17} pieces={[['18 − 6 = 12 cm³', ws.y]]} /> },
    { at: 2, text: <Eq x={372} y={170} anchor="start" size={16} pieces={[['change in x', ws.x]]} /> },
    { at: 2, text: <Eq x={372} y={194} anchor="start" size={17} pieces={[['30 − 10 = 20 s', ws.x]]} /> },
  ]
  return <PhysicsDiagram schematic={false} title={titles[step - 1]}>
    <StepStrip steps={['points', 'triangle', 'changes', 'divide']} active={step} gap={132} y={20} />
    <Grid frame={WF} xs={range(5, 40, 5)} ys={range(3, 24, 3)} />
    <GraphAxes frame={WF} xLabel="Time (s)" yLabel="Volume of gas (cm³)" xTicks={range(10, 40, 10)} yTicks={range(6, 24, 6)} />
    <path d={s.path([[0, 0], [40, 24]])} stroke={ws.fit} strokeWidth="3.4" fill="none" />
    {step === 1 && <g>
      <path d={`M${WF.x} ${a[1]}H${a[0]}V${WF.y + WF.height}M${WF.x} ${b[1]}H${b[0]}V${WF.y + WF.height}`} stroke={muted} strokeWidth="1.4" strokeDasharray="4 4" fill="none" />
      <Tag x={a[0] + 62} y={a[1] + 20} text="(10 s, 6 cm³)" colour={ink} size={13} w={104} />
      <Tag x={b[0] - 72} y={b[1] - 20} text="(30 s, 18 cm³)" colour={ink} size={13} w={112} />
    </g>}
    {step >= 2 && <Triangle a={a} b={b} yText={step === 2 ? 'change in y' : '12 cm³'} xText={step === 2 ? 'change in x' : '20 s'} size={14} />}
    {dot(a)}{dot(b)}
    {step >= 3 && <Card x={358} y={86} w={174} h={step === 4 ? 204 : 124}>
      {lines.map((l, i) => <g key={i}>{l.text}</g>)}
    </Card>}
    {step === 4 && <g>
      <text x={372} y={230} fontSize="15" fontWeight="750" fill={ink}>12 ÷ 20 = 0.6</text>
      <rect x={366} y={244} width={158} height={36} rx="14" fill={ws.fitFill} stroke={ws.fit} strokeWidth="2.2" />
      <text x={445} y={268} textAnchor="middle" fontSize="15" fontWeight="800" fill={ws.fit}>rate = 0.6 cm³/s</text>
    </g>}
    {step <= 2 && <Lines x={390} y={112} lines={step === 1 ? ['pick two points', 'on the line:', 'easy to read,', 'far apart'] : ['down from the', 'higher point,', 'across from the', 'lower one']} size={14} weight={650} colour={muted} />}
  </PhysicsDiagram>
}

/* ---------- Section 4: correlation ---------- */

const SF: GraphFrame = { x: 90, y: 50, width: 280, height: 180, xMax: 10, yMax: 10 }
const POS: Pt[] = [[1, 1.6], [1.8, 1.9], [2.6, 3.3], [3.3, 3.0], [4.1, 4.6], [5, 4.9], [5.8, 6.4], [6.6, 6.1], [7.5, 7.6], [8.4, 8.2]]
const NEG: Pt[] = POS.map(([x, y]) => [x, r1(9.6 - y)])
const NONE: Pt[] = [[1.2, 6.8], [2, 2.4], [2.8, 8.1], [3.5, 4.6], [4.4, 1.8], [5.1, 7.2], [5.9, 3.9], [6.8, 8.6], [7.4, 2.8], [8.3, 5.6], [4.8, 5.2]]
function Scatter({ pts, xLabel, yLabel, trend, tag, colour, note, title }: { pts: Pt[]; xLabel: string; yLabel: string; trend?: [Pt, Pt]; tag: string; colour: string; note: string[]; title: string }) {
  const s = graphScale(SF)
  return <PhysicsDiagram schematic={false} title={title}>
    <GraphAxes frame={SF} xLabel={xLabel} yLabel={yLabel} origin={false} />
    {trend && <path d={s.path(trend)} stroke={colour} strokeWidth="6" opacity=".28" fill="none" />}
    {pts.map(([x, y], i) => <PlotCross key={i} x={s.x(x)} y={s.y(y)} />)}
    <Tag x={455} y={80} text={tag} colour={colour} fill="white" size={14} w={150} />
    <Lines x={455} y={116} anchor="middle" lines={note} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

/* ---------- Question visuals ---------- */

function QLine() {
  const F: GraphFrame = { x: 90, y: 44, width: 360, height: 200, xMax: 80, yMax: 60 }, s = graphScale(F)
  const A = s.pt(20, 15), B = s.pt(60, 45)
  return <PhysicsDiagram schematic={false} title="A straight-line graph with two marked points A and B.">
    <Grid frame={F} xs={range(10, 80, 10)} ys={range(5, 60, 5)} />
    <GraphAxes frame={F} xLabel="Time (s)" yLabel="Volume of gas (cm³)" xTicks={range(10, 80, 10)} yTicks={range(10, 60, 10)} />
    <path d={s.path([[0, 0], [80, 60]])} stroke={ws.fit} strokeWidth="3.4" fill="none" />
    {dot(A)}{dot(B)}
    <text x={A[0] - 14} y={A[1] - 10} textAnchor="end" fontSize="17" fontWeight="800" fill={ink} stroke="white" strokeWidth="4" paintOrder="stroke">A</text>
    <text x={B[0] - 14} y={B[1] - 10} textAnchor="end" fontSize="17" fontWeight="800" fill={ink} stroke="white" strokeWidth="4" paintOrder="stroke">B</text>
  </PhysicsDiagram>
}
function QScatter() {
  const F: GraphFrame = { x: 90, y: 44, width: 360, height: 200, xMax: 80, yMax: 120 }, s = graphScale(F)
  const pts: Pt[] = [[12, 108], [18, 104], [24, 90], [30, 92], [36, 76], [44, 72], [50, 58], [58, 54], [64, 40], [72, 36], [78, 24]]
  return <PhysicsDiagram schematic={false} title="A scatter graph of the time for a tablet to dissolve against water temperature, with eleven crosses.">
    <Grid frame={F} xs={range(10, 80, 10)} ys={range(20, 120, 20)} />
    <GraphAxes frame={F} xLabel="Water temperature (°C)" yLabel="Time to dissolve (s)" xTicks={range(10, 80, 10)} yTicks={range(20, 120, 20)} />
    {pts.map(([x, y], i) => <PlotCross key={i} x={s.x(x)} y={s.y(y)} />)}
  </PhysicsDiagram>
}

export function WsGraphVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'wsgraph-steep': return <Steep />
    case 'wsgraph-compare': return <Compare />
    case 'wsgraph-formula': return <Formula />
    case 'wsgraph-rate': return <Rate />
    case 'wsgraph-work-1': return <Worked step={1} />
    case 'wsgraph-work-2': return <Worked step={2} />
    case 'wsgraph-work-3': return <Worked step={3} />
    case 'wsgraph-work-4': return <Worked step={4} />
    case 'wsgraph-positive': return <Scatter pts={POS} xLabel="Force (N)" yLabel="Extension (cm)" trend={[[0.6, 0.9], [9, 9]]} tag="positive" colour={ws.fit} note={['both increase']} title="Positive correlation: a scatter graph of extension against force. The crosses rise from left to right: as one variable increases, so does the other." />
    case 'wsgraph-negative': return <Scatter pts={NEG} xLabel="Distance from lamp (cm)" yLabel="Bubbles per minute" trend={[[0.6, 8.7], [9, 0.6]]} tag="negative" colour={ws.bad} note={['one increases,', 'the other', 'decreases']} title="Negative correlation: a scatter graph of bubbles per minute from pondweed against distance from a lamp. The crosses fall from left to right: as one variable increases, the other decreases." />
    case 'wsgraph-none': return <Scatter pts={NONE} xLabel="Shoe size" yLabel="Test mark (%)" tag="no correlation" colour={muted} note={['no pattern:', 'no relationship']} title="No correlation: a scatter graph of test mark against shoe size. The crosses are spread with no pattern." />
    case 'wsgraph-q-line': return <QLine />
    case 'wsgraph-q-scatter': return <QScatter />
    default: return null
  }
}
