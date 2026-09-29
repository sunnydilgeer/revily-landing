import type { ReactNode } from 'react'
import {
  physicsPalette as P, PhysicsDiagram, Wire, Junction, CurrentArrow, Cell, Resistor, SwitchOpen, SwitchClosed, Ammeter, GraphAxes, graphScale,
  type GraphFrame, type Pt,
} from './PhysicsKit'
import { quantity as Qc, quantityFill as Qf, Chip, Reading, Card, Runs, Txt, Badge, Heat } from './ParallelVisuals'

/*
 * Physics Lesson 22: investigating resistors in series and in parallel (required practical, preparation only).
 * Original, code-native schematics; not to scale. Focus ids start with 'rprac-'. One series loop and one parallel
 * loop are reused through the walkthroughs; resistors carry a soft amber tint, the cell's pd is violet and the
 * ammeter reading vermilion, matching the R = V ÷ I card. Graphs use the kit's axes.
 */

const { ink, muted } = P
const amber = '#f6e3c4', amberLine = '#b27a2c'

/** A resistor symbol with a soft amber body. `glow` rings it in a highlight. */
function Res({ x, y, vertical = false, glow = false, warm = false }: { x: number; y: number; vertical?: boolean; glow?: boolean; warm?: boolean }) {
  const [w, h] = vertical ? [15, 34] : [34, 15]
  return <g>
    {glow && <rect x={x - w / 2 - 8} y={y - h / 2 - 8} width={w + 16} height={h + 16} rx="10" fill={P.light} stroke={P.lightLine} strokeWidth="1.6" />}
    <Resistor x={x} y={y} rotate={vertical ? 90 : 0} length={vertical ? 50 : 54} />
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="2" fill={warm ? P.hotFill : amber} stroke={P.wire} strokeWidth="2.5" />
  </g>
}

/** The kit's cell, with a white break in the wire behind it. */
function CellAt({ x, y, glow }: { x: number; y: number; glow?: string }) {
  return <g>
    {glow && <circle cx={x} cy={y} r="26" fill={glow} opacity=".35" />}
    <rect x={x - 8} y={y - 8} width={16} height={16} fill="white" />
    <Cell x={x} y={y} rotate={90} length={50} />
  </g>
}
function SwitchAt({ x, y, open = false }: { x: number; y: number; open?: boolean }) {
  return <g>{open && <rect x={x - 9} y={y - 3} width={18} height={6} fill="white" />}{open ? <SwitchOpen x={x} y={y} length={40} /> : <SwitchClosed x={x} y={y} length={40} />}</g>
}

/*
 * The series loop: cell on the left, switch on the top wire, resistors along the top, ammeter on the bottom wire.
 * `n` resistors; the last one can be highlighted as "just added".
 */
function SeriesLoop({ ox = 0, oy = 0, n = 1, added = false, amm, ammStrong, cellText = '6.0 V', open = false, warm = false, glowCell, glowAmm, glowRes, arrows = true }: {
  ox?: number; oy?: number; n?: number; added?: boolean; amm?: string; ammStrong?: boolean; cellText?: string; open?: boolean; warm?: boolean; glowCell?: string; glowAmm?: string; glowRes?: string; arrows?: boolean
}) {
  const L = 60 + ox, R = 300 + ox, T = 60 + oy, B = 220 + oy, mid = (T + B) / 2
  const rx = n === 1 ? [220 + ox] : n === 2 ? [190 + ox, 255 + ox] : [170 + ox, 220 + ox, 270 + ox]
  return <g>
    <Wire points={[[L, mid], [L, T], [R, T], [R, B], [L, B], [L, mid]]} />
    <CellAt x={L} y={mid} glow={glowCell} />
    {cellText && <Chip x={L + 46} y={mid} text={cellText} colour={Qc.V} fill={Qf.V} size={13} />}
    <SwitchAt x={L + 55} y={T} open={open} />
    {glowRes && <rect x={rx[0] - 30} y={T - 22} width={rx[rx.length - 1] - rx[0] + 60} height={44} rx="16" fill={glowRes} opacity=".3" />}
    {rx.map((x, i) => <Res key={i} x={x} y={T} glow={added && i === rx.length - 1} warm={warm} />)}
    {glowAmm && <circle cx={(L + R) / 2} cy={B} r="26" fill={glowAmm} opacity=".35" />}
    <Ammeter x={(L + R) / 2} y={B} length={40} />
    {amm && <Reading x={(L + R) / 2} y={B + 34} text={amm} colour={Qc.I} anchor="middle" strong={ammStrong} />}
    {arrows && !open && <g><CurrentArrow x={R} y={mid} rotate={90} /><CurrentArrow x={L + 60} y={B} rotate={180} /><CurrentArrow x={L} y={T + 24} rotate={-90} /></g>}
  </g>
}

/* The parallel loop: same cell, switch and ammeter; `n` resistors on their own branches on the right. */
function ParallelLoop({ ox = 0, oy = 0, n = 2, added = false, amm, ammStrong, cellText = '6.0 V', glowCell, glowAmm, glowRes }: {
  ox?: number; oy?: number; n?: number; added?: boolean; amm?: string; ammStrong?: boolean; cellText?: string; glowCell?: string; glowAmm?: string; glowRes?: string
}) {
  const L = 60 + ox, T = 60 + oy, B = 220 + oy, mid = (T + B) / 2
  const xs = Array.from({ length: n }, (_, i) => 200 + ox + i * 50)
  const R = xs[xs.length - 1]
  return <g>
    <Wire points={[[L, mid], [L, T], [R, T], [R, B], [L, B], [L, mid]]} />
    {xs.slice(0, -1).map(x => <g key={x}><Wire points={[[x, T], [x, B]]} /><Junction x={x} y={T} /><Junction x={x} y={B} /></g>)}
    <CellAt x={L} y={mid} glow={glowCell} />
    {cellText && <Chip x={L + 46} y={mid} text={cellText} colour={Qc.V} fill={Qf.V} size={13} />}
    <SwitchAt x={L + 55} y={T} />
    {glowRes && <rect x={xs[0] - 22} y={mid - 38} width={R - xs[0] + 44} height={76} rx="16" fill={glowRes} opacity=".3" />}
    {xs.map((x, i) => <Res key={x} x={x} y={mid} vertical glow={added && i === xs.length - 1} />)}
    {glowAmm && <circle cx={L + 70} cy={B} r="26" fill={glowAmm} opacity=".35" />}
    <Ammeter x={L + 70} y={B} length={40} />
    {amm && <Reading x={L + 70} y={B + 34} text={amm} colour={Qc.I} anchor="middle" strong={ammStrong} />}
    <CurrentArrow x={L + 110} y={T} rotate={0} />
    <CurrentArrow x={L} y={T + 24} rotate={-90} />
  </g>
}

/** The R = V ÷ I card. */
function RCard({ x, y, w = 196, sum, result }: { x: number; y: number; w?: number; sum?: string[]; result?: string }) {
  const h = sum ? 124 : 70
  return <Card x={x} y={y} w={w} h={h}>
    <Runs x={x + w / 2} y={y + 30} runs={[['resistance = ', ink], ['pd', Qc.V], [' ÷ ', ink], ['current', Qc.I]]} size={13} />
    <Runs x={x + w / 2} y={y + 56} runs={[['R', Qc.R], [' = ', ink], ['V', Qc.V], [' ÷ ', ink], ['I', Qc.I]]} size={19} />
    {sum && <Runs x={x + w / 2} y={y + 86} runs={[['R = ', ink], [sum[0], Qc.V], [' ÷ ', ink], [sum[1], Qc.I]]} size={15} />}
    {result && <Runs x={x + w / 2} y={y + 112} runs={[['R = ', ink], [result, Qc.R]]} size={17} />}
  </Card>
}

// ---------- Section: series method ----------

function Kit() {
  const label = (x: number, y: number, t: string[]) => <Txt x={x} y={y} lines={t} anchor="middle" size={13} colour={muted} weight={650} />
  return <PhysicsDiagram viewBox="0 0 540 290" title="The equipment: a cell, a switch, four identical resistors, an ammeter and connecting wires. Identical resistors all have the same resistance.">
    <Card x={16} y={20} w={508} h={250} />
    <CellAt x={80} y={100} />
    {label(80, 160, ['cell'])}
    <SwitchOpen x={180} y={104} length={40} />
    {label(180, 160, ['switch'])}
    <Ammeter x={280} y={100} length={40} />
    {label(280, 160, ['ammeter'])}
    <path d="M360 118c-6 -34 30 -40 36 -14s34 20 38 -8s36 -26 40 4" fill="none" stroke={P.wire} strokeWidth="2.5" />
    <circle cx={360} cy={118} r="4" fill={P.hot} /><circle cx={474} cy={100} r="4" fill={P.hot} />
    {label(418, 160, ['wires'])}
    {[0, 1, 2, 3].map(i => <Res key={i} x={150 + i * 80} y={206} />)}
    <Chip x={270} y={246} text="identical resistors: same resistance" colour={amberLine} fill={amber} size={13} />
  </PhysicsDiagram>
}
function OneResistor() {
  return <PhysicsDiagram title="A series circuit: a 6.0 V cell, a closed switch, one resistor and an ammeter, all in the same loop. The ammeter is in series. The pd of the cell is 6.0 V.">
    <SeriesLoop ox={110} cellText="" />
    <Txt x={144} y={136} lines={['pd of cell:', '6.0 V']} size={14} colour={Qc.V} weight={750} anchor="end" />
    <Txt x={290} y={262} lines={['ammeter in series']} size={14} weight={750} anchor="middle" colour={Qc.I} />
  </PhysicsDiagram>
}
function Calculate() {
  return <PhysicsDiagram title="The same circuit with the ammeter reading 0.50 A. A card shows resistance = pd ÷ current, R = V ÷ I. Open the switch after each reading.">
    <SeriesLoop amm="0.50 A" ammStrong />
    <RCard x={330} y={44} />
    <Card x={330} y={140} w={196} h={60} fill={P.hotFill} line={P.hot}>
      <Txt x={346} y={165} lines={['open the switch', 'after each reading']} size={13} colour={P.hot} weight={700} />
    </Card>
  </PhysicsDiagram>
}
function WorkedPair() {
  const col = (ox: number, n: number, amm: string, sum: string[], res: string) => <g>
    <SeriesLoop ox={ox} oy={6} n={n} amm={amm} arrows={false} />
    <Card x={ox + 80} y={290} w={200} h={64}>
      <Runs x={ox + 180} y={314} runs={[['R = ', ink], [sum[0], Qc.V], [' ÷ ', ink], [sum[1], Qc.I]]} size={14} />
      <Runs x={ox + 180} y={340} runs={[['R = ', ink], [res, Qc.R]]} size={16} />
    </Card>
  </g>
  return <PhysicsDiagram viewBox="0 0 580 366" title="Worked example. Left: one resistor with a 6.0 V cell; the current is 0.50 A, so R = 6.0 ÷ 0.50 = 12 ohms. Right: two resistors in series with the same cell; the current is 0.25 A, so R = 6.0 ÷ 0.25 = 24 ohms.">
    <Txt x={140} y={28} lines={['one resistor']} anchor="middle" size={15} weight={750} />
    <Txt x={440} y={28} lines={['two in series']} anchor="middle" size={15} weight={750} />
    {col(-40, 1, '0.50 A', ['6.0', '0.50'], '12 Ω')}
    {col(260, 2, '0.25 A', ['6.0', '0.25'], '24 Ω')}
    <path d="M290 44V270" stroke={P.panelLine} strokeWidth="1.6" strokeDasharray="5 6" />
  </PhysicsDiagram>
}
function AddSeries() {
  const cols = ['number of resistors', 'current (A)', 'total resistance (Ω)'], x0 = 316, w = [72, 62, 82]
  return <PhysicsDiagram viewBox="0 0 540 300" title="The series circuit with a second resistor just added, highlighted. Beside it, an empty results table with columns for the number of resistors, the current in amps and the total resistance in ohms.">
    <SeriesLoop n={2} added />
    <Txt x={222} y={28} lines={['add one more']} anchor="middle" size={13} colour={amberLine} weight={750} />
    <g>
      <rect x={x0} y={40} width={216} height={216} rx="10" fill="white" stroke={P.panelLine} strokeWidth="1.6" />
      <rect x={x0} y={40} width={216} height={62} rx="10" fill={P.panel} stroke={P.panelLine} strokeWidth="1.6" />
      {[[x0 + 36, ['number of', 'resistors']], [x0 + 72 + 31, ['current', '(A)']], [x0 + 134 + 41, ['total', 'resistance', '(Ω)']]].map(([x, l], i) =>
        <Txt key={i} x={x as number} y={i === 2 ? 58 : 66} lines={l as string[]} anchor="middle" size={12} weight={700} colour={[ink, Qc.I, Qc.R][i]} />)}
      <path d={`M${x0 + w[0]} 40V256M${x0 + w[0] + w[1]} 40V256`} stroke={P.panelLine} strokeWidth="1.4" />
      {[1, 2, 3, 4].map(k => <g key={k}><path d={`M${x0} ${102 + (k - 1) * 38.5}H${x0 + 216}`} stroke={P.panelLine} strokeWidth="1.2" /><text x={x0 + 36} y={127 + (k - 1) * 38.5} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{k}</text></g>)}
    </g>
    {void cols}
  </PhysicsDiagram>
}

// ---------- Section: parallel method ----------

function ParallelBuild() {
  return <PhysicsDiagram title="The same circuit, but the second resistor is on a new branch, in parallel with the first. It is highlighted. The ammeter stays next to the cell.">
    <ParallelLoop ox={30} added />
    <Txt x={330} y={122} lines={['new resistor', 'goes in parallel']} size={14} colour={amberLine} weight={750} />
    <Txt x={160} y={258} lines={['ammeter next to the cell']} size={13} colour={muted} weight={650} anchor="middle" />
  </PhysicsDiagram>
}
function ParallelMeasure() {
  return <PhysicsDiagram title="The parallel circuit with the ammeter highlighted, reading 1.0 A, the total current. A card shows R = V ÷ I: 6.0 ÷ 1.0 = 6.0 ohms.">
    <ParallelLoop glowAmm={Qc.I} amm="1.0 A" ammStrong />
    <Txt x={166} y={259} lines={['total current']} size={13} colour={Qc.I} weight={750} />
    <RCard x={316} y={60} w={210} sum={['6.0', '1.0']} result="6.0 Ω" />
  </PhysicsDiagram>
}
function Fair() {
  const same = [P.pd, amberLine, P.current]
  return <PhysicsDiagram viewBox="0 0 540 300" title="A series circuit and a parallel circuit side by side. Both use the same cell, the same identical resistors and the same ammeter, shown in matching colours: same equipment for both.">
    <Txt x={130} y={24} lines={['series']} anchor="middle" size={14} weight={750} />
    <Txt x={400} y={24} lines={['parallel']} anchor="middle" size={14} weight={750} />
    <g transform="translate(6 20) scale(.78)"><SeriesLoop n={2} cellText="" glowCell={same[0]} glowRes={same[1]} glowAmm={same[2]} arrows={false} /></g>
    <g transform="translate(290 20) scale(.78)"><ParallelLoop n={2} cellText="" glowCell={same[0]} glowRes={same[1]} glowAmm={same[2]} /></g>
    {[['same cell', 0], ['same resistors', 1], ['same ammeter', 2]].map(([t, i]) =>
      <Chip key={i as number} x={96 + (i as number) * 174} y={246} text={t as string} colour={same[i as number]} fill="white" size={13} />)}
    <Txt x={270} y={288} lines={['only the way the resistors are joined changes']} anchor="middle" size={14} weight={700} />
  </PhysicsDiagram>
}

// ---------- Section: results ----------

function Expect() {
  const col = (x: number, head: string, cur: 'up' | 'down', colour: string) => <g>
    <Card x={x} y={24} w={250} h={250} />
    <Txt x={x + 125} y={56} lines={[head]} anchor="middle" size={15} weight={750} colour={colour} />
    {[[cur, 'current', Qc.I, Qf.I, 'I'], [cur === 'up' ? 'down' : 'up', 'total resistance', Qc.R, Qf.R, 'R']].map(([dir, word, c, f, s], i) => { const y = 124 + i * 86; return <g key={i}>
      <circle cx={x + 44} cy={y} r="24" fill={f} stroke={c} strokeWidth="2" />
      <text x={x + 44} y={y + 7} textAnchor="middle" fontSize="20" fontWeight="750" fill={c}>{s}</text>
      <path d={dir === 'up' ? `M${x + 92} ${y + 18}V${y - 12}m-10 10l10 -12l10 12` : `M${x + 92} ${y - 18}V${y + 12}m-10 -10l10 12l10 -12`} fill="none" stroke={c} strokeWidth="4" />
      <Txt x={x + 116} y={y - 3} lines={[word, dir]} size={14} weight={700} colour={c} />
    </g> })}
  </g>
  return <PhysicsDiagram viewBox="0 0 540 300" title="What to expect. Adding resistors in series: the current goes down and the total resistance goes up. Adding resistors in parallel: the current goes up and the total resistance goes down.">
    {col(12, 'adding in series', 'down', ink)}
    {col(278, 'adding in parallel', 'up', ink)}
  </PhysicsDiagram>
}

const seriesPts: Pt[] = [[1, 12], [2, 24], [3, 36], [4, 48]]
const parallelPts: Pt[] = [[1, 12], [2, 6], [3, 4], [4, 3]]
function smooth(points: Pt[]) {
  // Catmull-Rom through the points, as cubic Béziers.
  let d = `M${points[0][0]} ${points[0][1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i], p1 = points[i], p2 = points[i + 1], p3 = points[i + 2] ?? p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${c1.map(v => v.toFixed(1)).join(' ')} ${c2.map(v => v.toFixed(1)).join(' ')} ${p2[0]} ${p2[1]}`
  }
  return d
}
function ResGraph({ kind }: { kind: 'series' | 'parallel' }) {
  const frame: GraphFrame = { x: 90, y: 50, width: 300, height: 190, xMin: 0, xMax: 5, yMax: kind === 'series' ? 60 : 15 }
  const s = graphScale(frame), pts = (kind === 'series' ? seriesPts : parallelPts).map(([a, b]) => s.pt(a, b))
  const line = kind === 'series' ? `M${s.x(0)} ${s.y(0)}L${s.x(4.6)} ${s.y(55.2)}` : smooth([...pts, s.pt(4.8, 2.5)])
  return <PhysicsDiagram viewBox="0 0 540 300" title={kind === 'series'
    ? 'Graph of total resistance in ohms against the number of identical resistors, added in series. The points for 1, 2, 3 and 4 resistors lie on a straight line sloping upwards: more resistors, larger total resistance.'
    : 'Graph of total resistance in ohms against the number of identical resistors, added in parallel. The points lie on a smooth curve sloping downwards that flattens out but does not reach zero: more resistors, smaller total resistance.'} schematic={false}>
    <GraphAxes frame={frame} xLabel="Number of identical resistors" yLabel="Total resistance" yUnit="Ω" xTicks={[1, 2, 3, 4]} yTicks={kind === 'series' ? [12, 24, 36, 48] : [3, 6, 9, 12]} grid />
    <path d={line} fill="none" stroke={kind === 'series' ? P.pd : P.useful} strokeWidth="3" />
    {pts.map(([x, y], i) => <g key={i} stroke={ink} strokeWidth="2.2"><path d={`M${x - 5} ${y - 5}L${x + 5} ${y + 5}M${x + 5} ${y - 5}L${x - 5} ${y + 5}`} /></g>)}
    <Card x={400} y={70} w={134} h={92} highlight={kind === 'series' ? P.pd : P.useful}>
      <Txt x={413} y={96} lines={kind === 'series' ? ['more resistors', '= larger total', 'resistance'] : ['more resistors', '= smaller total', 'resistance']} size={13} weight={700} colour={kind === 'series' ? P.pd : P.useful} />
    </Card>
  </PhysicsDiagram>
}

function Safety() {
  return <PhysicsDiagram title="A small series circuit with a warm resistor giving off heat. The switch is open, labelled: open between readings. Warm parts can change the results and cause burns.">
    <SeriesLoop ox={10} oy={24} open warm cellText="" />
    <Heat x={230} y={66} n={3} gap={11} />
    <Txt x={125} y={34} lines={['open between', 'readings']} anchor="middle" size={13} weight={750} colour={ink} />
    <Card x={330} y={110} w={196} h={90} fill={P.hotFill} line={P.hot}>
      <Txt x={346} y={138} lines={['warm parts can', 'change results and', 'cause burns']} size={14} weight={700} colour={P.hot} />
    </Card>
  </PhysicsDiagram>
}

// ---------- On your own ----------

function QGraphs() {
  const shapes: string[] = [
    'M0 100L100 10',
    'M0 55H100',
    'M0 96C40 92 72 70 100 8',
    'M6 8C18 70 50 88 100 94',
  ]
  const cell = (i: number) => {
    const x = 34 + (i % 2) * 256, y = 16 + Math.floor(i / 2) * 140
    return <g key={i}>
      <Badge x={x - 14} y={y + 10} n={i + 1} />
      <g transform={`translate(${x + 40} ${y + 12})`}>
        <path d="M0 0V100H150" fill="none" stroke={ink} strokeWidth="2" />
        <path d="M-5 8L0 -2L5 8M142 95L152 100L142 105" fill="none" stroke={ink} strokeWidth="2" />
        <g transform="translate(14 0) scale(1.2 0.9)"><path d={shapes[i]} fill="none" stroke={P.pd} strokeWidth="2.6" /></g>
        <text x={-8} y={50} textAnchor="middle" fontSize="12" fill={muted} transform={`rotate(-90 -8 50)`}>resistance (Ω)</text>
        <text x={75} y={118} textAnchor="middle" fontSize="12" fill={muted}>number of resistors</text>
      </g>
    </g>
  }
  return <PhysicsDiagram viewBox="0 0 540 300" title="Four graphs of total resistance against number of identical resistors, numbered 1 to 4." schematic={false}>
    {[0, 1, 2, 3].map(cell)}
  </PhysicsDiagram>
}

export function ResistorPracVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  const views: Record<string, () => ReactNode> = {
    'rprac-kit': Kit,
    'rprac-one-resistor': OneResistor,
    'rprac-calculate': Calculate,
    'rprac-worked': WorkedPair,
    'rprac-add-series': AddSeries,
    'rprac-parallel-build': ParallelBuild,
    'rprac-parallel-measure': ParallelMeasure,
    'rprac-fair': Fair,
    'rprac-expect': Expect,
    'rprac-graph-series': () => <ResGraph kind="series" />,
    'rprac-graph-parallel': () => <ResGraph kind="parallel" />,
    'rprac-safety': Safety,
    'rprac-q-graphs': QGraphs,
  }
  const View = views[focus]
  return View ? <View /> : null
}
