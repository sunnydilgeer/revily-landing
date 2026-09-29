import { useId, type ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, GraphAxes, graphScale, type GraphFrame, type Pt } from './PhysicsKit'
import { ink, muted, r1, Tag, Tick, CrossMark, Arrow, Spring } from './EnergyStoreVisuals'
import { Flask, Bubbles, Chips } from './GasRateVisuals'

/*
 * Working Scientifically Lesson 7: Presenting data. Original, code-native charts and graphs; data invented and friendly.
 * Focus ids start with 'wspresent-'. The small pieces at the top (colours, crosses, bars, mini charts) are shared with
 * the graph and units lessons (WsGraphVisuals, WsUnitVisuals) so the three read as one set.
 *
 * Colour code for these lessons: the independent variable / x-axis blue, the dependent variable / y-axis brown-orange
 * (the time and distance colours of the motion lessons), lines of best fit green, anomalies and "don't" coral.
 * Plotted points are small pencil crosses in ink.
 */

export const ws = {
  x: '#3f7fb0', xFill: '#dcecf8',
  y: '#b0601c', yFill: '#fbe6d2',
  fit: P.useful, fitFill: P.usefulFill,
  bad: '#c0675a', badFill: '#f8e0db',
  barA: '#bfe0f1', barALine: '#3f93bd',
  barB: '#cfe6c2', barBLine: '#4f8f5a',
  hi: '#fff3cf', hiLine: '#e0b04a',
}
export const range = (a: number, b: number, step: number) => Array.from({ length: Math.round((b - a) / step) + 1 }, (_, i) => r1(a + i * step))

/** A small pencil cross centred on (x, y). */
export function PlotCross({ x, y, size = 6, colour = ink, width = 2.2 }: { x: number; y: number; size?: number; colour?: string; width?: number }) {
  return <path d={`M${r1(x - size)} ${r1(y - size)}L${r1(x + size)} ${r1(y + size)}M${r1(x + size)} ${r1(y - size)}L${r1(x - size)} ${r1(y + size)}`} stroke={colour} strokeWidth={width} />
}
/** Faint gridlines at the given values (drawn under the axes). */
export function Grid({ frame, xs = [], ys = [] }: { frame: GraphFrame; xs?: number[]; ys?: number[] }) {
  const s = graphScale(frame)
  return <g stroke={P.grid} strokeWidth="1">
    {xs.map(v => <path key={`x${v}`} d={`M${s.x(v)} ${frame.y}V${frame.y + frame.height}`} />)}
    {ys.map(v => <path key={`y${v}`} d={`M${frame.x} ${s.y(v)}H${frame.x + frame.width}`} />)}
  </g>
}
/** A highlight band behind a piece of text or an axis. */
export function Glow({ x, y, w, h, colour = ws.hiLine, fill = ws.hi }: { x: number; y: number; w: number; h: number; colour?: string; fill?: string }) {
  return <rect x={x} y={y} width={w} height={h} rx={Math.min(14, h / 2)} fill={fill} stroke={colour} strokeWidth="1.6" />
}
/** A small caption line centred at the bottom. */
export function Note({ text, y = 288, x = 270, colour = muted, size = 14 }: { text: string; y?: number; x?: number; colour?: string; size?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={size} fontWeight="650" fill={colour}>{text}</text>
}

/** Two tiny charts used as icons: a bar chart and a line graph with crosses. (x, y) is the corner where the axes meet. */
export function MiniBars({ x, y, w = 110, h = 70, values = [0.6, 0.95, 0.35, 0.75] }: { x: number; y: number; w?: number; h?: number; values?: number[] }) {
  const n = values.length, slot = (w - 8) / n
  return <g>
    {values.map((v, i) => <rect key={i} x={r1(x + 8 + i * slot + slot * 0.18)} y={r1(y - v * h)} width={r1(slot * 0.64)} height={r1(v * h)} rx="3" fill={ws.barA} stroke={ws.barALine} strokeWidth="1.6" />)}
    <path d={`M${x} ${y - h - 8}V${y}H${x + w}`} stroke={ink} strokeWidth="2" fill="none" />
  </g>
}
export function MiniGraph({ x, y, w = 110, h = 70, curve = false }: { x: number; y: number; w?: number; h?: number; curve?: boolean }) {
  const pts: Pt[] = [0.12, 0.3, 0.48, 0.66, 0.84].map((k, i) => {
    const t = curve ? 1 - (1 - k) ** 2 : k
    return [r1(x + k * w), r1(y - t * h * 0.9 + [3, -3, 2, -2, 1][i])]
  })
  const line = curve ? `M${x} ${y}Q${r1(x + w * 0.45)} ${r1(y - h * 0.95)} ${x + w - 4} ${r1(y - h * 0.9)}` : `M${x} ${y}L${x + w - 4} ${r1(y - h * 0.92 * (w - 4) / w)}`
  return <g>
    <path d={line} stroke={ws.fit} strokeWidth="2.6" fill="none" />
    {pts.map(([px, py], i) => <PlotCross key={i} x={px} y={py} size={4} width={1.8} />)}
    <path d={`M${x} ${y - h - 8}V${y}H${x + w}`} stroke={ink} strokeWidth="2" fill="none" />
  </g>
}

/* ---------- Bar charts ---------- */

type BarSet = { values: number[]; fill: string; line: string; name?: string }
/** A bar chart: category labels under the bars, the axis titles drawn by hand so they can be highlighted. */
function BarChart({ frame, groups, sets, yStep, xTitle, yTitle, gridStep, hiScale = false, hiTitles = false, hiGaps = false, dim = false }: {
  frame: GraphFrame; groups: string[]; sets: BarSet[]; yStep: number; xTitle: string; yTitle: string; gridStep?: number; hiScale?: boolean; hiTitles?: boolean; hiGaps?: boolean; dim?: boolean
}) {
  const s = graphScale(frame), slot = frame.width / groups.length, n = sets.length
  const barW = n === 1 ? slot * 0.56 : slot * 0.3
  const base = frame.y + frame.height
  const yt = range(yStep, frame.yMax, yStep)
  return <g>
    {gridStep && <Grid frame={frame} ys={range(gridStep, frame.yMax, gridStep)} />}
    {hiScale && <Glow x={frame.x - 40} y={frame.y - 8} w={36} h={frame.height + 16} />}
    {hiGaps && groups.slice(1).map((_, i) => {
      const gx = frame.x + (i + 1) * slot
      return <rect key={i} x={r1(gx - slot * 0.13)} y={frame.y + 4} width={r1(slot * 0.26)} height={frame.height - 4} rx="8" fill={ws.hi} stroke={ws.hiLine} strokeWidth="1.4" strokeDasharray="4 4" />
    })}
    <GraphAxes frame={frame} xLabel="" yLabel="" yTicks={yt} />
    <g opacity={dim ? 0.45 : 1}>
      {groups.map((g, gi) => sets.map((set, si) => {
        const cx = frame.x + (gi + 0.5) * slot + (si - (n - 1) / 2) * barW
        const top = s.y(set.values[gi])
        return <rect key={`${gi}-${si}`} x={r1(cx - barW / 2)} y={top} width={r1(barW)} height={r1(base - top)} rx="3" fill={set.fill} stroke={set.line} strokeWidth="1.8" />
      }))}
    </g>
    {groups.map((g, gi) => <text key={g} x={r1(frame.x + (gi + 0.5) * slot)} y={base + 18} textAnchor="middle" fontSize="12.5" fontWeight="650" fill={ink}>{g}</text>)}
    {hiTitles && <g>
      <Glow x={frame.x + frame.width / 2 - 50} y={base + 26} w={100} h={24} />
      <Glow x={frame.x - 66} y={frame.y - 36} w={yTitle.length * 7.6 + 16} h={24} />
    </g>}
    <text x={frame.x + frame.width / 2} y={base + 43} textAnchor="middle" fontSize="13.5" fontWeight="750" fill={ink}>{xTitle}</text>
    <text x={frame.x - 58} y={frame.y - 19} fontSize="13.5" fontWeight="750" fill={ink}>{yTitle}</text>
  </g>
}

/* ---------- Section 2: types of data ---------- */

function Drop({ x, y, letter }: { x: number; y: number; letter: string }) {
  return <g>
    <path d={`M${x} ${y - 34}C${x + 6} ${y - 20} ${x + 24} ${y - 6} ${x + 24} ${y + 10}A24 24 0 0 1 ${x - 24} ${y + 10}C${x - 24} ${y - 6} ${x - 6} ${y - 20} ${x} ${y - 34}Z`} fill={P.thermal} stroke={P.thermalLine} strokeWidth="2" />
    <path d={`M${x - 13} ${y + 2}Q${x - 14} ${y + 16} ${x - 6} ${y + 22}`} stroke="white" strokeWidth="3" fill="none" opacity=".75" />
    <text x={x} y={y + 18} textAnchor="middle" fontSize="17" fontWeight="800" fill={P.thermalLine}>{letter}</text>
  </g>
}
function Flower({ x, y, petals }: { x: number; y: number; petals: number }) {
  return <g>
    {Array.from({ length: petals }, (_, i) => <ellipse key={i} cx={x} cy={y - 13} rx="6.5" ry="11" transform={`rotate(${r1(i * 360 / petals)} ${x} ${y})`} fill="#f6d2e5" stroke="#ad4880" strokeWidth="1.5" />)}
    <circle cx={x} cy={y} r="6.5" fill={P.light} stroke={P.lightLine} strokeWidth="1.6" />
  </g>
}
function Categoric() {
  const groups = ['A', 'B', 'AB', 'O']
  return <PhysicsDiagram title="Categoric data comes in separate groups: blood groups A, B, AB and O are four separate cards. Counts of whole things, such as flowers with 4, 5 or 6 petals, also come as separate values.">
    <text x={270} y={24} textAnchor="middle" fontSize="14" fontWeight="700" fill={muted}>blood group</text>
    {groups.map((g, i) => <g key={g}>
      <rect x={42 + i * 120} y={36} width={96} height={100} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.6" />
      <Drop x={90 + i * 120} y={84} letter={g} />
    </g>)}
    {[0, 1, 2].map(i => <text key={i} x={150 + i * 120} y={92} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>gap</text>)}
    <text x={270} y={170} textAnchor="middle" fontSize="14" fontWeight="700" fill={muted}>number of petals: whole numbers only</text>
    {[4, 5, 6].map((n, i) => <g key={n}>
      <Flower x={170 + i * 100} y={210} petals={n} />
      <text x={170 + i * 100} y={250} textAnchor="middle" fontSize="14" fontWeight="750" fill={ink}>{n}</text>
    </g>)}
    <Tag x={270} y={282} text="separate groups: nothing in between" colour={ws.x} fill={ws.xFill} size={14} w={300} />
  </PhysicsDiagram>
}

function Continuous() {
  const id = useId().replace(/:/g, '')
  const x0 = 80, x1 = 460, y = 150, at = (v: number) => r1(x0 + (v - 20) * (x1 - x0))
  const marks = range(20, 21, 0.1)
  return <PhysicsDiagram title="Continuous data can take any value in a range. A scale from 20 °C to 21 °C has endless values in between, such as 20.4 °C or 20.75 °C.">
    <defs><linearGradient id={id} x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor={P.coldFill} /><stop offset="1" stopColor={P.hotFill} /></linearGradient></defs>
    <rect x={x0 - 14} y={y - 34} width={x1 - x0 + 28} height={34} rx="17" fill={`url(#${id})`} stroke={P.panelLine} strokeWidth="1.6" />
    <path d={`M${x0} ${y}H${x1}`} stroke={ink} strokeWidth="2.4" />
    {marks.map((v, i) => {
      const big = i === 0 || i === 10, mid = i === 5
      return <path key={i} d={`M${at(v)} ${y}v${big ? 14 : mid ? 10 : 7}`} stroke={ink} strokeWidth={big ? 2.2 : 1.5} />
    })}
    <text x={x0} y={y + 34} textAnchor="middle" fontSize="16" fontWeight="750" fill={ink}>20 °C</text>
    <text x={x1} y={y + 34} textAnchor="middle" fontSize="16" fontWeight="750" fill={ink}>21 °C</text>
    <text x={at(20.5)} y={y + 30} textAnchor="middle" fontSize="12.5" fontWeight="650" fill={muted}>20.5</text>
    {[[20.4, '20.4 °C', 70], [20.75, '20.75 °C', 70]].map(([v, t, h]) => <g key={t as string}>
      <path d={`M${at(v as number)} ${y - 36}V${y - (h as number)}`} stroke={ws.y} strokeWidth="1.6" />
      <path d={`M${at(v as number)} ${y - 2}l-7 -12h14z`} fill={ws.y} />
      <Tag x={at(v as number)} y={y - (h as number) - 12} text={t as string} colour={ws.y} fill={ws.yFill} size={14} />
    </g>)}
    <text x={at(20.2)} y={y - 12} textAnchor="middle" fontSize="12.5" fontWeight="650" fill={muted}>…</text>
    <text x={at(20.9)} y={y - 12} textAnchor="middle" fontSize="12.5" fontWeight="650" fill={muted}>…</text>
    <Lines x={270} y={232} anchor="middle" lines={['temperature, time, volume, length']} size={14} weight={650} colour={muted} />
    <Tag x={270} y={272} text="any value in a range: continuous" colour={ws.fit} fill={ws.fitFill} size={14} w={280} />
  </PhysicsDiagram>
}

function Branch({ from, to, colour }: { from: Pt; to: Pt; colour: string }) {
  return <path d={`M${from[0]} ${from[1]}C${from[0]} ${r1((from[1] + to[1]) / 2)} ${to[0]} ${r1((from[1] + to[1]) / 2 - 10)} ${to[0]} ${to[1]}`} stroke={colour} strokeWidth="2.6" fill="none" />
}
function Choose() {
  return <PhysicsDiagram schematic={false} title="Choosing a display. If the independent variable comes in separate groups, draw a bar chart. If both variables can take any value in a range, plot a graph.">
    <rect x={150} y={12} width={240} height={36} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.6" />
    <text x={270} y={35} textAnchor="middle" fontSize="14" fontWeight="750" fill={ink}>What type is the data?</text>
    <Branch from={[230, 48]} to={[135, 80]} colour={ws.barALine} />
    <Branch from={[310, 48]} to={[405, 80]} colour={ws.fit} />
    <Tag x={135} y={92} text="separate groups" colour={ws.barALine} fill="white" size={14} />
    <Tag x={405} y={92} text="any value in a range" colour={ws.fit} fill="white" size={14} />
    <rect x={55} y={112} width={160} height={124} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.4" />
    <MiniBars x={80} y={214} w={115} h={70} />
    <rect x={325} y={112} width={160} height={124} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.4" />
    <MiniGraph x={350} y={214} w={115} h={70} />
    <text x={135} y={266} textAnchor="middle" fontSize="16" fontWeight="800" fill={ws.barALine}>bar chart</text>
    <text x={405} y={266} textAnchor="middle" fontSize="16" fontWeight="800" fill={ws.fit}>graph</text>
    <text x={405} y={286} textAnchor="middle" fontSize="12.5" fontWeight="650" fill={muted}>(both variables continuous)</text>
  </PhysicsDiagram>
}

function Woodlouse({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-12, -4, 4, 12].map(lx => <path key={lx} d={`M${lx} 6l-3 7M${lx} -6l-3 -7`} stroke="#6f6a63" strokeWidth="1.8" />)}
    <ellipse cx="0" cy="0" rx="22" ry="11" fill="#b8b2a8" stroke="#6f6a63" strokeWidth="1.8" />
    {[-12, -5, 2, 9].map(sx => <path key={sx} d={`M${sx} -10Q${sx - 2} 0 ${sx} 10`} stroke="#6f6a63" strokeWidth="1.3" fill="none" />)}
    <path d="M21 -3l9 -6M21 3l9 6" stroke="#6f6a63" strokeWidth="1.6" />
  </g>
}
function Examples() {
  const cards: { title: string[]; kind: string; icon: ReactNode; chart: ReactNode; colour: string }[] = [
    { title: ['woodlice in', 'four habitats'], kind: 'bar chart', colour: ws.barALine, icon: <Woodlouse x={0} y={0} s={1.1} />, chart: <MiniBars x={-50} y={0} w={105} h={62} values={[0.9, 0.75, 0.2, 0.45]} /> },
    { title: ['gas volume', 'over time'], kind: 'graph', colour: ws.fit, icon: <g><Flask cx={0} base={22} h={56} w={46} level={16}><Chips cx={0} base={22} n={4} spread={28} size={0.6} /><Bubbles pts={[[-6, 6], [5, 2], [0, -4]]} r={2.2} /></Flask></g>, chart: <MiniGraph x={-50} y={0} w={105} h={62} curve /> },
    { title: ['spring stretch', 'against force'], kind: 'graph', colour: ws.fit, icon: <g><path d="M-18 -30H18" stroke={ink} strokeWidth="3" /><Spring a={[0, -30]} b={[0, 6]} coils={6} width={7} /><rect x={-10} y={6} width={20} height={16} rx="3" fill="#dfe5ea" stroke="#7d8e9c" strokeWidth="1.8" /></g>, chart: <MiniGraph x={-50} y={0} w={105} h={62} /> },
  ]
  return <PhysicsDiagram schematic={false} title="Three examples. Woodlice counted in four habitats: bar chart. Volume of gas measured over time: graph. Stretch of a spring against force: graph.">
    {cards.map((c, i) => {
      const cx = 95 + i * 175
      return <g key={i}>
        <rect x={cx - 82} y={10} width={164} height={280} rx="20" fill={P.panel} stroke={P.panelLine} strokeWidth="1.6" />
        <g transform={`translate(${cx} 58)`}>{c.icon}</g>
        <Lines x={cx} y={112} anchor="middle" lines={c.title} size={14} />
        <g transform={`translate(${cx} 226)`}>{c.chart}</g>
        <Tag x={cx} y={260} text={c.kind} colour={c.colour} fill="white" size={14} />
      </g>
    })}
  </PhysicsDiagram>
}

/* ---------- Section 3: bar charts ---------- */

const BF: GraphFrame = { x: 96, y: 56, width: 280, height: 170, xMax: 4, yMax: 20 }
const WOODLICE: BarSet = { values: [18, 15, 4, 9], fill: ws.barA, line: ws.barALine }
const HABITATS = ['leaf litter', 'logs', 'grass', 'stones']
function BarScale() {
  const s = graphScale(BF)
  return <PhysicsDiagram schematic={false} title="A bar chart of the number of woodlice in four habitats. The vertical scale goes 0, 5, 10, 15, 20 in equal steps, and the chart fills most of the space.">
    <BarChart frame={BF} groups={HABITATS} sets={[WOODLICE]} yStep={5} xTitle="Habitat" yTitle="Number of woodlice" hiScale />
    {[0, 5, 10, 15].map(v => <path key={v} d={`M${BF.x - 50} ${s.y(v) - 2}V${s.y(v + 5) + 2}`} stroke={ws.y} strokeWidth="2.4" />)}
    {[0, 5, 10, 15].map(v => <path key={`c${v}`} d={`M${BF.x - 54} ${s.y(v + 5)}h8`} stroke={ws.y} strokeWidth="2.4" />)}
    <path d={`M${BF.x - 54} ${s.y(0)}h8`} stroke={ws.y} strokeWidth="2.4" />
    <Tag x={462} y={80} text="equal steps" colour={ws.y} fill={ws.yFill} size={14} />
    <Lines x={462} y={112} anchor="middle" lines={['each step', 'is 5']} size={13} weight={650} colour={muted} />
    <Tag x={462} y={180} text="draw it big" colour={ws.fit} fill={ws.fitFill} size={14} />
    <Lines x={462} y={212} anchor="middle" lines={['use at least', 'half the paper']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}
function BarLabels() {
  return <PhysicsDiagram schematic={false} title="The same bar chart with both axis titles highlighted: Habitat along the bottom and Number of woodlice up the side.">
    <BarChart frame={BF} groups={HABITATS} sets={[WOODLICE]} yStep={5} xTitle="Habitat" yTitle="Number of woodlice" hiTitles dim />
    <Tag x={462} y={80} text="label both axes" colour={ink} fill={ws.hi} size={14} />
    <Lines x={402} y={126} lines={['up the side:', 'what you counted', 'or measured', '(and its units)']} size={13} weight={650} colour={muted} />
    <Lines x={402} y={222} lines={['along the bottom:', 'the groups']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}
function BarKey() {
  const F: GraphFrame = { x: 96, y: 56, width: 280, height: 170, xMax: 4, yMax: 15 }
  const A: BarSet = { values: [12, 8, 5, 10], fill: ws.barA, line: ws.barALine, name: 'pond A' }
  const B: BarSet = { values: [6, 14, 9, 3], fill: ws.barB, line: ws.barBLine, name: 'pond B' }
  return <PhysicsDiagram schematic={false} title="A bar chart comparing animals found in pond A and pond B. Each animal has two bars in two colours, there are gaps between the groups, and a key shows which colour is which pond.">
    <BarChart frame={F} groups={['snails', 'shrimps', 'beetles', 'worms']} sets={[A, B]} yStep={5} xTitle="Animal" yTitle="Number of animals" hiGaps />
    <rect x={400} y={52} width={124} height={82} rx="14" fill="white" stroke={ink} strokeWidth="1.8" />
    <text x={462} y={74} textAnchor="middle" fontSize="13" fontWeight="750" fill={ink}>Key</text>
    {[A, B].map((set, i) => <g key={i}>
      <rect x={414} y={86 + i * 24} width={22} height={16} rx="3" fill={set.fill} stroke={set.line} strokeWidth="1.6" />
      <text x={444} y={99 + i * 24} fontSize="13.5" fontWeight="700" fill={ink}>{set.name}</text>
    </g>)}
    <Tag x={462} y={180} text="gaps between groups" colour="#9a6c12" fill={ws.hi} size={13} w={172} />
    <Lines x={462} y={214} anchor="middle" lines={['two sets of data:', 'add a key']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

/* ---------- Section 4: plotting a graph ---------- */

const GF: GraphFrame = { x: 84, y: 48, width: 290, height: 190, xMax: 50, yMax: 30 }
const GAS: Pt[] = [[5, 3.4], [10, 5.7], [15, 9.3], [20, 11.6], [25, 15.3], [30, 17.6], [35, 21.3], [40, 23.8], [46, 27.4]]
function GasAxes({ frame = GF, numbers = true, grid = true }: { frame?: GraphFrame; numbers?: boolean; grid?: boolean }) {
  const xt = range(10, frame.xMax, 10), yt = range(5, frame.yMax, 5)
  return <g>
    {grid && <Grid frame={frame} xs={range(5, frame.xMax, 5)} ys={yt} />}
    <GraphAxes frame={frame} xLabel="Time (s)" yLabel="Volume of gas (cm³)" xTicks={numbers ? xt : []} yTicks={numbers ? yt : []} origin={numbers} />
  </g>
}
function PlotAxes() {
  const F: GraphFrame = { x: 150, y: 60, width: 250, height: 160, xMax: 50, yMax: 30 }
  return <PhysicsDiagram schematic={false} title="Empty graph axes. The independent variable, time in seconds, goes along the horizontal x-axis. The dependent variable, volume of gas in cm³, goes up the vertical y-axis.">
    <Glow x={F.x + F.width - 78} y={F.y + F.height + 8} w={96} h={26} colour={ws.x} fill={ws.xFill} />
    <Glow x={F.x - 82} y={F.y - 34} w={164} h={26} colour={ws.y} fill={ws.yFill} />
    <GraphAxes frame={F} xLabel="Time (s)" yLabel="Volume of gas (cm³)" />
    <Lines x={F.x - 6} y={270} lines={['x-axis (across): independent variable']} size={13} colour={ws.x} />
    <Lines x={24} y={108} lines={['y-axis (up):', 'dependent', 'variable']} size={13} colour={ws.y} />
    <Arrow from={[F.x - 16, F.y + 40]} to={[F.x - 16, F.y + 4]} colour={ws.y} width={2.4} />
    <Arrow from={[F.x + 282, 265]} to={[F.x + 320, 265]} colour={ws.x} width={2.4} />
    <Lines x={416} y={120} lines={['include the', 'units in', 'brackets']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}
function PlotScale() {
  const bad: GraphFrame = { x: 58, y: 70, width: 180, height: 150, xMax: 500, yMax: 30 }
  const good: GraphFrame = { x: 318, y: 70, width: 180, height: 150, xMax: 50, yMax: 30 }
  const pts = GAS.filter((_, i) => i % 2 === 0)
  const sb = graphScale(bad), sg = graphScale(good)
  return <PhysicsDiagram schematic={false} title="Two ways to draw the time axis. With a scale to 500 seconds the points are squashed into one corner. With a scale from 0 to 50 seconds in steps of 10 the points, up to 46 seconds, spread across the graph.">
    <GraphAxes frame={bad} xLabel="Time (s)" yLabel="Volume (cm³)" xTicks={[100, 200, 300, 400, 500]} yTicks={[10, 20, 30]} />
    {pts.map(([x, y], i) => <PlotCross key={i} x={sb.x(x)} y={sb.y(y)} size={4} width={1.8} />)}
    <GraphAxes frame={good} xLabel="Time (s)" yLabel="Volume (cm³)" xTicks={[10, 20, 30, 40, 50]} yTicks={[10, 20, 30]} />
    {pts.map(([x, y], i) => <PlotCross key={i} x={sg.x(x)} y={sg.y(y)} size={5} />)}
    <path d={`M${sg.x(46) - 8} ${sg.y(27.4) - 8}L${sg.x(46) - 30} ${sg.y(27.4) - 26}`} stroke={ws.x} strokeWidth="1.6" />
    <Tag x={sg.x(46) - 52} y={sg.y(27.4) - 34} text="46 s" colour={ws.x} fill={ws.xFill} size={13} />
    <CrossMark x={200} y={100} />
    <Tick x={505} y={170} />
    <text x={148} y={28} textAnchor="middle" fontSize="14" fontWeight="750" fill={ws.bad}>squashed in a corner</text>
    <text x={408} y={28} textAnchor="middle" fontSize="14" fontWeight="750" fill={ws.fit}>fills the paper</text>
  </PhysicsDiagram>
}
function Pencil({ x, y, angle = -40 }: { x: number; y: number; angle?: number }) {
  // (x, y) is the point of the pencil; it lies along `angle` degrees back from the tip.
  return <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    <path d="M0 0L22 -8V8Z" fill="#f1dcb9" stroke="#a57a45" strokeWidth="1.8" />
    <path d="M0 0L8 -3V3Z" fill="#4f5d69" />
    <rect x={22} y={-8} width={120} height={16} rx="2" fill="#f7cf5d" stroke="#c3930f" strokeWidth="1.8" />
    <path d="M22 0H142" stroke="#c3930f" strokeWidth="1.2" opacity=".6" />
    <rect x={142} y={-8} width={16} height={16} rx="2" fill="#d9dfe4" stroke="#7d8e9c" strokeWidth="1.8" />
    <rect x={158} y={-8} width={16} height={16} rx="5" fill="#f3b7b0" stroke="#c0675a" strokeWidth="1.8" />
  </g>
}
function PlotPoints() {
  const px = 40, py = 40, w = 300, h = 210, step = 30
  return <PhysicsDiagram schematic={false} title="A close-up of graph paper. A small, neat pencil cross marks one point exactly; a smudged blob beside it is hard to read.">
    <rect x={px} y={py} width={w} height={h} rx="16" fill="white" stroke={P.panelLine} strokeWidth="1.6" />
    <g stroke={P.grid} strokeWidth="1">
      {range(1, w / step - 1, 1).map(i => <path key={`v${i}`} d={`M${px + i * step} ${py + 4}V${py + h - 4}`} />)}
      {range(1, h / step - 1, 1).map(i => <path key={`h${i}`} d={`M${px + 4} ${py + i * step}H${px + w - 4}`} />)}
    </g>
    <path d={`M${px + 4} ${py + 5 * step}H${px + 4 * step}V${py + h - 4}`} stroke={ws.x} strokeWidth="1.4" strokeDasharray="4 4" fill="none" opacity=".8" />
    <PlotCross x={px + 4 * step} y={py + 5 * step} size={7} width={2.4} />
    <Pencil x={px + 4 * step - 8} y={py + 5 * step - 8} angle={-135} />
    <path d={`M${px + 7 * step} ${py + 2 * step}m-14 0c2 -10 18 -14 26 -4c8 8 2 20 -10 18c-10 0 -20 -4 -16 -14z`} fill="#7d8791" opacity=".55" />
    <path d={`M${px + 7 * step - 6} ${py + 2 * step + 12}q10 10 22 6`} stroke="#7d8791" strokeWidth="5" opacity=".35" fill="none" />
    <Tick x={390} y={170} />
    <Lines x={410} y={166} lines={['small, neat', 'cross']} size={14} colour={ws.fit} />
    <Lines x={410} y={212} lines={['sharp pencil', 'centre marks', 'the value']} size={12.5} weight={650} colour={muted} />
    <CrossMark x={390} y={70} />
    <Lines x={410} y={66} lines={['blob: hard', 'to read']} size={14} colour={ws.bad} />
  </PhysicsDiagram>
}
function BestFit({ frame, pts, anomaly, numbers, assessment }: { frame: GraphFrame; pts: Pt[]; anomaly?: Pt; numbers?: string[]; assessment?: boolean }) {
  const s = graphScale(frame)
  const end = Math.min(frame.xMax, frame.yMax / 0.6)
  return <g>
    <path d={`M${s.x(0)} ${s.y(0)}L${s.x(end)} ${s.y(end * 0.6)}`} stroke={ws.fit} strokeWidth="3" />
    {pts.map(([x, y], i) => <PlotCross key={i} x={s.x(x)} y={s.y(y)} />)}
    {numbers && pts.map(([x, y], i) => {
      const above = y > x * 0.6
      return <g key={`n${i}`}><circle cx={s.x(x) + (above ? -16 : 16)} cy={s.y(y) + (above ? -16 : 16)} r="11" fill="white" stroke={ink} strokeWidth="1.8" /><text x={s.x(x) + (above ? -16 : 16)} y={s.y(y) + (above ? -16 : 16) + 4.5} textAnchor="middle" fontSize="13" fontWeight="750" fill={ink}>{numbers[i]}</text></g>
    })}
    {anomaly && !assessment && <g>
      <PlotCross x={s.x(anomaly[0])} y={s.y(anomaly[1])} colour={ws.bad} />
      <ellipse cx={s.x(anomaly[0])} cy={s.y(anomaly[1])} rx="14" ry="13" fill="none" stroke={ws.bad} strokeWidth="2.2" />
    </g>}
  </g>
}
function PlotLine() {
  return <PhysicsDiagram schematic={false} title="A graph of volume of gas against time with nine crosses. A straight line of best fit passes through or close to as many crosses as possible. A small picture beside it shows a zig-zag line joining the dots, crossed out.">
    <GasAxes />
    <BestFit frame={GF} pts={GAS} />
    <Tick x={410} y={62} />
    <Lines x={430} y={58} lines={['line of', 'best fit']} size={14} colour={ws.fit} />
    <rect x={402} y={128} width={126} height={106} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.4" />
    <path d="M414 220L434 196L446 206L462 172L476 182L494 150L512 158" stroke={ws.bad} strokeWidth="2" fill="none" opacity=".75" />
    {[[414, 220], [434, 196], [446, 206], [462, 172], [476, 182], [494, 150], [512, 158]].map(([x, y], i) => <PlotCross key={i} x={x} y={y} size={3.5} width={1.6} />)}
    <CrossMark x={506} y={206} s={0.9} />
    <Lines x={465} y={256} anchor="middle" lines={["don't join", 'the dots']} size={13} colour={ws.bad} />
  </PhysicsDiagram>
}
function PlotAnomaly() {
  const s = graphScale(GF), odd: Pt = [25, 5]
  const pts = GAS.filter(([x]) => x !== 25)
  return <PhysicsDiagram schematic={false} title="The same graph with one cross far below the line at 25 seconds. It is circled and labelled as an anomalous result: ignore it when drawing the line of best fit.">
    <GasAxes />
    <BestFit frame={GF} pts={pts} anomaly={odd} />
    <path d={`M${s.x(25) + 14} ${s.y(5)}H${s.x(25) + 26}`} stroke={ws.bad} strokeWidth="1.6" />
    <rect x={s.x(25) + 26} y={s.y(5) - 26} width={120} height={46} rx="12" fill="white" stroke={ws.bad} strokeWidth="1.6" />
    <Lines x={s.x(25) + 36} y={s.y(5) - 7} lines={['anomalous', 'result: ignore it']} size={13} colour={ws.bad} />
    <Lines x={410} y={70} lines={['circle it and', 'leave it out', 'of the line']} size={13} weight={650} colour={ws.bad} />
    <Lines x={410} y={170} lines={['the line follows', 'the other points']} size={12.5} weight={650} colour={ws.fit} />
  </PhysicsDiagram>
}

/* ---------- Question visuals ---------- */

function QGraph() {
  const F: GraphFrame = { x: 96, y: 48, width: 340, height: 190, xMax: 60, yMax: 36 }
  const pts: Pt[] = [[10, 6], [20, 20], [30, 18], [40, 24], [50, 30]]
  return <PhysicsDiagram schematic={false} title="A graph with five numbered points and a line.">
    <Grid frame={F} xs={range(10, 60, 10)} ys={range(6, 36, 6)} />
    <GraphAxes frame={F} xLabel="Time (s)" yLabel="Volume of gas (cm³)" xTicks={range(10, 60, 10)} yTicks={range(6, 36, 6)} />
    <BestFit frame={F} pts={pts} numbers={['1', '2', '3', '4', '5']} assessment />
  </PhysicsDiagram>
}
function QBars() {
  const F: GraphFrame = { x: 110, y: 56, width: 300, height: 180, xMax: 4, yMax: 20 }
  return <PhysicsDiagram schematic={false} title="A bar chart of the number of daisies in four fields, A to D.">
    <BarChart frame={F} groups={['A', 'B', 'C', 'D']} sets={[{ values: [12, 20, 8, 16], fill: ws.barB, line: ws.barBLine }]} yStep={4} gridStep={4} xTitle="Field" yTitle="Number of daisies" />
  </PhysicsDiagram>
}

export function WsPresentVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'wspresent-categoric': return <Categoric />
    case 'wspresent-continuous': return <Continuous />
    case 'wspresent-choose': return <Choose />
    case 'wspresent-examples': return <Examples />
    case 'wspresent-bar-scale': return <BarScale />
    case 'wspresent-bar-labels': return <BarLabels />
    case 'wspresent-bar-key': return <BarKey />
    case 'wspresent-plot-axes': return <PlotAxes />
    case 'wspresent-plot-scale': return <PlotScale />
    case 'wspresent-plot-points': return <PlotPoints />
    case 'wspresent-plot-line': return <PlotLine />
    case 'wspresent-plot-anomaly': return <PlotAnomaly />
    case 'wspresent-q-graph': return <QGraph />
    case 'wspresent-q-bars': return <QBars />
    default: void assessment; return null
  }
}
