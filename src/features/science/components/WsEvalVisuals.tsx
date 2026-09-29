import { WsDiagram, Tag, Panel, Tick, Cross, Arrow, Bracket, DataTable, NumberLine, numberScale, Dot, Stopwatch, tones, textW, wsPalette as W, ink, muted, r1, faded, type Pt } from './WsKit'
import { Lines } from './PhysicsKit'
import { Thermometer } from './EnergyStoreVisuals'
import { PlotCross } from './WsPresentVisuals'

/*
 * Working Scientifically Lesson 12: Uncertainty and evaluations. Original, code-native schematics; data invented and
 * friendly. Every focus id here starts with 'wseval-' and is routed from CellBiologyVisuals.tsx.
 *
 * The worked example is exact: trolley runs 4.2, 4.0 and 4.4 s; mean 4.2 s; range 4.4 − 4.0 = 0.4 s;
 * uncertainty 0.4 ÷ 2 = 0.2 s; written 4.2 ± 0.2 s. Colours from WsKit: readings brown-orange (the measured variable),
 * the true value violet, the range and the value to look at soft yellow, good green, poor or anomalous coral.
 */

/* ---------- Section 2: uncertainty ---------- */

function MmRuler({ x, y, w }: { x: number; y: number; w: number }) {
  const n = Math.floor((w - 12) / 18)
  return <g>
    <rect x={x} y={y} width={w} height="40" rx="4" fill="#f7ebc8" stroke="#b99a52" strokeWidth="1.8" />
    {Array.from({ length: n + 1 }, (_, i) => <path key={i} d={`M${x + 6 + i * 18} ${y}v${i % 5 === 0 ? 20 : 12}`} stroke="#9c8040" strokeWidth="1.4" />)}
  </g>
}
function Finger({ x, y }: { x: number; y: number }) {
  return <g transform={`rotate(24 ${x} ${y})`}>
    <rect x={x - 9} y={y - 44} width="18" height="44" rx="9" fill={W.skin} stroke={W.skinLine} strokeWidth="1.8" />
    <path d={`M${x - 5} ${y - 8}Q${x} ${y - 4} ${x + 5} ${y - 8}`} stroke={W.skinLine} strokeWidth="1.3" fill="none" />
  </g>
}
function Error() {
  const rx = 40, ry = 96, lineX = rx + 6 + 4 * 18 + 9
  return <WsDiagram schematic={false} title="A ruler marked in millimetres, with the end of a line falling between two marks: the equipment has a limit. A stopwatch with a finger pressing the button slightly late: a random error. Uncertainty is how far off a measurement might be.">
    <MmRuler x={rx} y={ry} w={200} />
    <path d={`M${rx - 10} ${ry - 18}H${lineX}`} stroke={ink} strokeWidth="3.4" />
    <path d={`M${lineX} ${ry - 26}V${ry + 30}`} stroke={tones.bad.line} strokeWidth="1.8" strokeDasharray="4 4" />
    <Lines x={lineX + 12} y={ry - 30} lines={['between two marks']} size={12} weight={650} colour={muted} />
    <text x={rx + 100} y={ry + 64} textAnchor="middle" fontSize="12" fontWeight="650" fill={muted}>marks every 1 mm</text>
    <Tag x={rx + 100} y={ry + 96} text="equipment limit" tone="keep" size={14} strong />
    <Stopwatch x={400} y={120} r={42} reading="2.37" />
    <Finger x={402} y={66} />
    <path d="M428 54l10 -6M432 66l12 -2" stroke={muted} strokeWidth="1.8" />
    <text x={400} y={186} textAnchor="middle" fontSize="12" fontWeight="650" fill={muted}>clicked a little late</text>
    <Tag x={400} y={216} text="random error" tone="bad" size={14} strong />
    <text x={270} y={284} textAnchor="middle" fontSize="15" fontWeight="750" fill={tones.mark.text}>uncertainty: how far off a measurement might be</text>
  </WsDiagram>
}

const NL = { x: 70, y: 196, w: 400, min: 3.8, max: 4.6 }
const nx = numberScale(NL.x, NL.w, NL.min, NL.max)
const RUNS: [number, string][] = [[4.2, 'run 1'], [4.0, 'run 2'], [4.4, 'run 3']]
const fmt1 = (v: number) => v.toFixed(1)
function RunLine({ dim = false }: { dim?: boolean }) {
  return <g>
    <NumberLine x={NL.x} y={NL.y} w={NL.w} min={NL.min} max={NL.max} step={0.1} fmt={fmt1} />
    <text x={NL.x + NL.w + 20} y={NL.y + 22} fontSize="13" fontWeight="700" fill={muted}>s</text>
    {RUNS.map(([v, t]) => <g key={t} opacity={dim ? 0.55 : 1}>
      <Dot x={nx(v)} y={NL.y - 20} />
      <text x={nx(v)} y={NL.y - 38} textAnchor="middle" fontSize="12" fontWeight="650" fill={muted}>{t}</text>
    </g>)}
  </g>
}
function MeanMark() {
  return <g>
    <path d={`M${nx(4.2)} ${NL.y + 30}l-7 11h14Z`} fill={tones.measure.line} />
    <text x={nx(4.2)} y={NL.y + 60} textAnchor="middle" fontSize="14" fontWeight="750" fill={tones.measure.text}>mean 4.2 s</text>
  </g>
}
function Range() {
  return <WsDiagram schematic={false} title="A number line in seconds with three trolley times: 4.2 s, 4.0 s and 4.4 s. A bracket from 4.0 to 4.4 shows the range: 4.4 − 4.0 = 0.4 s. The mean, 4.2 s, is marked.">
    <RunLine />
    <Bracket x1={nx(4.0)} x2={nx(4.4)} y={112} colour={tones.mark.line} width={2.4} />
    <text x={nx(4.2)} y={92} textAnchor="middle" fontSize="17" fontWeight="800" fill={tones.mark.text}>range = 4.4 − 4.0 = 0.4 s</text>
    <MeanMark />
    <Tag x={100} y={36} text="step 1: the range" tone="mark" size={13} />
  </WsDiagram>
}
function Unc() {
  return <WsDiagram schematic={false} title="The same number line. The range bracket from 4.0 to 4.4 is faded. Half of it, from 4.2 to 4.4, is highlighted: uncertainty = range ÷ 2 = 0.4 ÷ 2 = 0.2 s.">
    <RunLine dim />
    <g opacity={faded}><Bracket x1={nx(4.0)} x2={nx(4.4)} y={112} colour={tones.mark.line} width={2.4} /></g>
    <path d={`M${nx(4.2)} 146V130H${nx(4.4)}V146`} fill="none" stroke={tones.measure.line} strokeWidth="2.8" />
    <text x={nx(4.4) + 12} y={144} fontSize="15" fontWeight="800" fill={tones.measure.text}>0.2 s</text>
    <rect x={120} y={52} width={300} height={38} rx="14" fill={tones.mark.fill} stroke={tones.mark.line} strokeWidth="2" />
    <text x={270} y={77} textAnchor="middle" fontSize="16" fontWeight="800" fill={ink}>uncertainty = 0.4 ÷ 2 = 0.2 s</text>
    <Tag x={100} y={22} text="step 2: range ÷ 2" tone="mark" size={13} />
    <MeanMark />
  </WsDiagram>
}
function Band({ lo, hi, y, tone, h = 26 }: { lo: number; hi: number; y: number; tone: 'truth' | 'bad'; h?: number }) {
  const c = tones[tone]
  return <rect x={nx(lo)} y={y - h / 2} width={r1(nx(hi) - nx(lo))} height={h} rx={h / 2} fill={c.fill} stroke={c.line} strokeWidth="1.8" opacity=".9" />
}
function PlusMinus() {
  return <WsDiagram schematic={false} title="The trolley time written as 4.2 ± 0.2 s: a shaded band from 4.0 to 4.4 s around the mean of 4.2 s, where the true value probably lies. A wider band below, 4.2 ± 0.4 s, shows less precise results with a bigger uncertainty.">
    <NumberLine x={NL.x} y={236} w={NL.w} min={NL.min} max={NL.max} step={0.1} fmt={fmt1} />
    <text x={NL.x + NL.w + 20} y={258} fontSize="13" fontWeight="700" fill={muted}>s</text>
    <Band lo={4.0} hi={4.4} y={92} tone="truth" />
    <Dot x={nx(4.2)} y={92} r={7} />
    <text x={nx(4.2)} y={60} textAnchor="middle" fontSize="19" fontWeight="800" fill={ink}>4.2 ± 0.2 s</text>
    <text x={nx(4.4) + 14} y={97} fontSize="12" fontWeight="650" fill={tones.truth.text}>true value</text>
    <text x={nx(4.4) + 14} y={112} fontSize="12" fontWeight="650" fill={tones.truth.text}>probably in here</text>
    <path d={`M${nx(4.0)} 106V222M${nx(4.4)} 106V222`} stroke={tones.truth.line} strokeWidth="1.4" strokeDasharray="4 4" opacity=".7" />
    <Band lo={3.8} hi={4.6} y={170} tone="bad" h={22} />
    <Dot x={nx(4.2)} y={170} r={6} />
    <text x={nx(4.2)} y={146} textAnchor="middle" fontSize="14" fontWeight="750" fill={tones.bad.text}>4.2 ± 0.4 s: less precise, bigger uncertainty</text>
  </WsDiagram>
}

/* ---------- Section 3: quality of results ---------- */

function Target({ x, y, hits }: { x: number; y: number; hits: Pt[] }) {
  return <g>
    {[54, 40, 26].map((r, i) => <circle key={r} cx={x} cy={y} r={r} fill={i % 2 ? '#f4eefb' : 'white'} stroke={W.tableLine} strokeWidth="1.8" />)}
    <circle cx={x} cy={y} r="11" fill={tones.truth.fill} stroke={tones.truth.line} strokeWidth="2" />
    {hits.map(([a, b], i) => <circle key={i} cx={x + a} cy={y + b} r="5.5" fill={tones.measure.line} stroke="white" strokeWidth="1.6" />)}
  </g>
}
function Accurate() {
  const y = 130
  return <WsDiagram schematic={false} title="Three targets. The centre is the true value. First: three hits close together but away from the centre, precise but not accurate. Second: three hits spread around the centre, not precise. Third: three hits close together on the centre, accurate and precise.">
    <Target x={95} y={y} hits={[[26, -24], [33, -17], [24, -14]]} />
    <Target x={270} y={y} hits={[[-30, -20], [28, -12], [4, 34]]} />
    <Target x={445} y={y} hits={[[-4, -3], [5, 2], [-2, 6]]} />
    <Tag x={270} y={40} text="centre = true value" tone="truth" size={13} />
    <Lines x={95} y={214} anchor="middle" lines={['precise,', 'not accurate']} size={14} colour={tones.measure.text} />
    <Lines x={270} y={214} anchor="middle" lines={['spread out,', 'not precise']} size={14} colour={tones.bad.text} />
    <Lines x={445} y={214} anchor="middle" lines={['accurate and', 'precise']} size={14} colour={tones.good.text} />
    <text x={270} y={284} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>accurate: close to the true value · precise: close together</text>
  </WsDiagram>
}
function Anomaly() {
  const s = numberScale(70, 400, 1.5, 4.5), y = 196
  return <WsDiagram schematic={false} title="A number line of four timings: 2.0, 2.1 and 2.2 s close together, and 3.9 s far away. The 3.9 s result is ringed as anomalous, with a thought: a timing slip?">
    <NumberLine x={70} y={y} w={400} min={1.5} max={4.5} step={0.5} fmt={fmt1} />
    <text x={490} y={y + 22} fontSize="13" fontWeight="700" fill={muted}>s</text>
    {[2.0, 2.1, 2.2].map(v => <Dot key={v} x={s(v)} y={y - 20} r={6} />)}
    <Bracket x1={s(2.0) - 10} x2={s(2.2) + 10} y={y - 42} />
    <Lines x={s(2.1)} y={y - 60} anchor="middle" lines={['fit the pattern']} size={13} weight={650} colour={muted} />
    <Dot x={s(3.9)} y={y - 20} r={6} tone="bad" ring />
    <Tag x={s(3.9)} y={y - 62} text="anomalous" tone="bad" size={14} strong />
    <g>
      <rect x={s(3.9) - 150} y={46} width={140} height={40} rx="20" fill="white" stroke={muted} strokeWidth="1.6" />
      <circle cx={s(3.9) - 22} cy={96} r="5" fill="white" stroke={muted} strokeWidth="1.4" />
      <circle cx={s(3.9) - 12} cy={108} r="3" fill="white" stroke={muted} strokeWidth="1.4" />
      <text x={s(3.9) - 80} y={71} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>a timing slip?</text>
    </g>
    <text x={270} y={272} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>four repeat timings</text>
  </WsDiagram>
}
function MiniAxes({ x, y, w = 170, h = 130 }: { x: number; y: number; w?: number; h?: number }) {
  return <path d={`M${x} ${y - h - 8}V${y}H${x + w + 8}`} stroke={ink} strokeWidth="2" fill="none" />
}
function Evidence() {
  const few: Pt[] = [[34, -40], [96, -72], [142, -58]]
  const many: Pt[] = Array.from({ length: 10 }, (_, i) => [14 + i * 17, r1(-16 - i * 11.4 + [3, -2, 2, -3, 3, -1, 2, -3, 2, -1][i])])
  return <WsDiagram schematic={false} title="Two small graphs. Left: only three points, not much evidence. Right: ten points making a clear pattern, more evidence.">
    <MiniAxes x={60} y={210} />
    {few.map(([a, b], i) => <PlotCross key={i} x={60 + a} y={210 + b} />)}
    <MiniAxes x={320} y={210} />
    <path d="M326 202L500 88" stroke={tones.good.line} strokeWidth="6" opacity=".25" />
    {many.map(([a, b], i) => <PlotCross key={i} x={320 + a} y={210 + b} />)}
    <Tag x={145} y={48} text="not much evidence" tone="bad" size={14} />
    <Tag x={405} y={48} text="more evidence" tone="good" size={14} strong />
    <text x={145} y={244} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>3 readings</text>
    <text x={405} y={244} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>10 readings, a clear pattern</text>
  </WsDiagram>
}

/* ---------- Section 4: evaluating ---------- */

function Method() {
  const rows: [string, boolean][] = [['valid method?', true], ['same apparatus', true], ['room temperature', false]]
  return <WsDiagram schematic={false} title="An evaluation checklist for the method: valid method, ticked; same apparatus, ticked; room temperature kept the same, crossed. A thermometer shows the room warmed from 18 °C to 24 °C during the test.">
    <Panel x={40} y={40} w={290} h={220}>
      <text x={62} y={72} fontSize="15" fontWeight="800" fill={ink}>Method: a fair test?</text>
      {rows.map(([t, ok], i) => <g key={t}>
        {ok ? <Tick x={76} y={112 + i * 50} s={0.9} /> : <Cross x={76} y={112 + i * 50} s={0.9} />}
        <text x={100} y={117 + i * 50} fontSize="15" fontWeight="700" fill={ok ? ink : tones.bad.text}>{t}</text>
      </g>)}
      <text x={100} y={234} fontSize="13" fontWeight="650" fill={tones.bad.text}>not kept the same</text>
    </Panel>
    <Thermometer x={416} y={210} h={120} level={0.35} reading="18 °C" side="left" />
    <Thermometer x={464} y={210} h={120} level={0.7} reading="24 °C" />
    <text x={440} y={62} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>start → end</text>
    <text x={440} y={252} textAnchor="middle" fontSize="13" fontWeight="700" fill={tones.bad.text}>the room warmed up</text>
  </WsDiagram>
}
function Confidence() {
  const cx = 380, cy = 196, R = 92, r = 58
  const seg = (a0: number, a1: number) => {
    const p = (a: number, rr: number) => `${r1(cx - Math.cos(a) * rr)} ${r1(cy - Math.sin(a) * rr)}`
    return `M${p(a0, R)}A${R} ${R} 0 0 1 ${p(a1, R)}L${p(a1, r)}A${r} ${r} 0 0 0 ${p(a0, r)}Z`
  }
  const parts: ['bad' | 'mark' | 'good', number, number][] = [['bad', 0, Math.PI / 3], ['mark', Math.PI / 3, 2 * Math.PI / 3], ['good', 2 * Math.PI / 3, Math.PI]]
  const needle = Math.PI * 0.83
  return <WsDiagram schematic={false} title="Three inputs, the method, anomalous results and uncertainty, point to a confidence scale with three parts: not very confident, fairly confident and confident. The needle points to confident.">
    {parts.map(([t, a0, a1]) => <path key={t} d={seg(a0 + 0.02, a1 - 0.02)} fill={tones[t].fill} stroke={tones[t].line} strokeWidth="2" />)}
    <path d={`M${cx} ${cy}L${r1(cx - Math.cos(needle) * (R - 12))} ${r1(cy - Math.sin(needle) * (R - 12))}`} stroke={ink} strokeWidth="4" />
    <circle cx={cx} cy={cy} r="7" fill={ink} />
    <Lines x={cx - R + 16} y={cy + 24} anchor="middle" lines={['not very', 'confident']} size={12} colour={tones.bad.text} />
    <text x={cx} y={cy - R - 10} textAnchor="middle" fontSize="12" fontWeight="700" fill={tones.mark.text}>fairly confident</text>
    <text x={cx + R - 16} y={cy + 24} textAnchor="middle" fontSize="12" fontWeight="700" fill={tones.good.text}>confident</text>
    {['method', 'anomalous results', 'uncertainty'].map((t, i) => <g key={t}>
      <Tag x={100} y={96 + i * 56} text={t} tone="plain" size={13} w={textW(t, 13) + 30} />
      <Arrow from={[r1(100 + (textW(t, 13) + 30) / 2 + 6), 96 + i * 56]} to={[cx - R - 10, r1(cy - 40 + i * 20)]} colour={muted} width={2} />
    </g>)}
    <text x={270} y={276} textAnchor="middle" fontSize="14" fontWeight="650" fill={muted}>put them together: how confident are you?</text>
  </WsDiagram>
}
function Improve() {
  const s = numberScale(90, 380, 0.4, 1.6), top = 100, bot = 214
  const before = [0.5, 1.0, 1.5], after = [0.8, 0.9, 1.0, 1.1, 1.2]
  return <WsDiagram schematic={false} title="Two number lines of concentration in mol/dm³. Before: tests at 0.5, 1.0 and 1.5, with 1.0 ringed as the fastest. After: tests at 0.8, 0.9, 1.0, 1.1 and 1.2, narrower intervals around 1.0.">
    <text x={16} y={top + 5} fontSize="14" fontWeight="800" fill={muted}>before</text>
    <NumberLine x={90} y={top} w={380} min={0.4} max={1.6} step={0.1} labels={before} fmt={fmt1} />
    {before.map(v => <Dot key={v} x={s(v)} y={top - 18} r={7} ring={v === 1} tone={v === 1 ? 'good' : 'measure'} />)}
    <text x={s(1.0) + 26} y={top - 26} fontSize="13" fontWeight="750" fill={tones.good.text}>fastest</text>
    <text x={16} y={bot + 5} fontSize="14" fontWeight="800" fill={tones.good.text}>after</text>
    <NumberLine x={90} y={bot} w={380} min={0.4} max={1.6} step={0.1} labels={after} fmt={fmt1} />
    {after.map(v => <Dot key={v} x={s(v)} y={bot - 18} r={7} tone="good" />)}
    <Bracket x1={s(0.8) - 8} x2={s(1.2) + 8} y={bot - 40} colour={tones.good.line} />
    <Arrow from={[s(1.0), top + 34]} to={[s(1.0), bot - 50]} colour={tones.good.line} width={2.4} />
    <Tag x={s(1.0) + 118} y={(top + bot) / 2 - 8} text="narrower intervals" tone="good" size={14} strong />
    <text x={270} y={286} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>concentration of acid (mol/dm³)</text>
  </WsDiagram>
}
function Step({ x, y, head, lines, tone }: { x: number; y: number; head: string; lines: string[]; tone: 'mark' | 'change' | 'good' }) {
  const c = tones[tone]
  return <g>
    <rect x={x - 88} y={y - 34} width="176" height="68" rx="16" fill={c.fill} stroke={c.line} strokeWidth="2" />
    <text x={x} y={y - 10} textAnchor="middle" fontSize="14" fontWeight="800" fill={c.text}>{head}</text>
    <Lines x={x} y={y + 10} anchor="middle" lines={lines} size={12} weight={650} colour={ink} />
  </g>
}
function Predict() {
  return <WsDiagram schematic={false} title="A loop of three steps: a conclusion leads to a new prediction, which leads to a further experiment, which leads back to a new conclusion.">
    <Step x={270} y={56} head="conclusion" lines={['acid A: fastest', 'at 1.0 mol/dm³']} tone="mark" />
    <Step x={430} y={214} head="new prediction" lines={['acid B will', 'behave the same']} tone="change" />
    <Step x={110} y={214} head="further experiment" lines={['test acid B', 'to check']} tone="good" />
    <Arrow from={[362, 60]} to={[438, 172]} colour={ink} width={2.4} bend={-0.2} />
    <Arrow from={[338, 232]} to={[202, 232]} colour={ink} width={2.4} bend={-0.15} />
    <Arrow from={[102, 172]} to={[178, 60]} colour={ink} width={2.4} bend={-0.2} />
    <text x={270} y={150} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>and round again</text>
  </WsDiagram>
}

/* ---------- Question visual (assessment view: no ranges, no uncertainties) ---------- */

function QTable() {
  return <WsDiagram schematic={false} title="A table of trolley times in seconds for two groups. Group A: 3.2, 3.0 and 3.1, mean 3.1. Group B: 2.6, 3.6 and 3.1, mean 3.1.">
    <DataTable x={40} y={84} cols={[100, 90, 90, 90, 90]} headH={58} rowH={50} size={17} title="Time for a trolley to roll down a ramp"
      rows={[['Group', 'Run 1\n(s)', 'Run 2\n(s)', 'Run 3\n(s)', 'Mean\n(s)'], ['A', '3.2', '3.0', '3.1', '3.1'], ['B', '2.6', '3.6', '3.1', '3.1']]} />
  </WsDiagram>
}

export function WsEvalVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'wseval-error': return <Error />
    case 'wseval-range': return <Range />
    case 'wseval-unc': return <Unc />
    case 'wseval-plusminus': return <PlusMinus />
    case 'wseval-accurate': return <Accurate />
    case 'wseval-anomaly': return <Anomaly />
    case 'wseval-evidence': return <Evidence />
    case 'wseval-method': return <Method />
    case 'wseval-confidence': return <Confidence />
    case 'wseval-improve': return <Improve />
    case 'wseval-predict': return <Predict />
    case 'wseval-q-table': return <QTable />
    default: return null
  }
}
