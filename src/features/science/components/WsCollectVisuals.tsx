import { WsDiagram, Tag, Panel, Tick, Cross, Arrow, DataTable, Bust, Stopwatch, Bench, GasSyringe, NumberLine, numberScale, Dot, VBracket, Bracket, tones, wsPalette as W, ink, muted, r1, type Pt } from './WsKit'
import { Lines } from './PhysicsKit'
import { Cylinder, Balance } from './DensityVisuals'
import { Flask, Bung, Chips, Bubbles, labPalette as LB } from './GasRateVisuals'
import { blob } from './GasParticleVisuals'

/*
 * Working Scientifically Lesson 5: Collecting data. Original, code-native schematics; data invented and friendly.
 * Every focus id here starts with 'wscollect-' and is routed from CellBiologyVisuals.tsx.
 *
 * Drawn with WsKit: readings are brown-orange dots on number lines (the measured variable), the true value is violet,
 * good choices get a green tick and poor ones a coral cross; anomalies are circled in coral.
 * The precise/accurate number line (46–54 g, true value 50.0 g) is reused across its walkthrough.
 */

// Small pseudo-random numbers so scattered things (daisies, people, bars) are the same on every render.
const rand = (seed: number) => { const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }

/* ---------- Section 2: sample size ---------- */

function Daisy({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx="0" cy="-6.2" rx="2.6" ry="5" fill="white" stroke="#b8c4cc" strokeWidth="1" transform={`rotate(${i * 45})`} />)}
    <circle r="3.6" fill={W.light} stroke={W.lightLine} strokeWidth="1.2" />
  </g>
}
function SampleSize() {
  const pts: Pt[] = []
  for (let j = 0; j < 5; j++) for (let i = 0; i < 6; i++) pts.push([r1(70 + i * 46 + (rand(i * 7 + j) - 0.5) * 22 + (j % 2) * 12), r1(80 + j * 38 + (rand(j * 11 + i + 3) - 0.5) * 16)])
  return <WsDiagram title="A field with 30 daisies. Each daisy is one observation, so the sample size is 30.">
    <path d={blob(190, 158, 170, 116, 6, 0.06, 12)} fill="#e7f2df" stroke={W.plantLine} strokeWidth="1.8" opacity=".9" />
    {pts.map(([x, y], i) => <Daisy key={i} x={x} y={y} s={1.1} />)}
    <VBracket y1={52} y2={264} x={352} />
    <Tag x={450} y={150} text="sample size = 30" tone="mark" size={14} strong />
    <Lines x={450} y={188} anchor="middle" lines={['30 daisies']} size={14} weight={650} colour={muted} />
  </WsDiagram>
}

const toY = (cm: number) => r1(232 - (cm - 120) * 1.9)
function Heights({ x, w, cms, barW, gap, title }: { x: number; w: number; cms: number[]; barW: number; gap: number; title: string }) {
  const mean = cms.reduce((a, b) => a + b, 0) / cms.length
  const start = x + (w - (cms.length * barW + (cms.length - 1) * gap)) / 2
  return <g>
    {cms.map((cm, i) => {
      const tall = cm > 185
      const thin = barW < 6
      return <rect key={i} x={r1(start + i * (barW + gap))} y={toY(cm)} width={barW} height={r1(232 - toY(cm))} rx={thin ? 0 : 4} fill={thin ? (tall ? tones.bad.line : '#e9bf98') : tall ? tones.bad.fill : tones.measure.fill} stroke={thin ? 'none' : tall ? tones.bad.line : tones.measure.line} strokeWidth="1.8" />
    })}
    <path d={`M${x + 4} 232H${x + w - 4}`} stroke={ink} strokeWidth="2" />
    <path d={`M${x + 4} ${toY(mean)}H${x + w - 4}`} stroke={ink} strokeWidth="2.2" strokeDasharray="7 5" />
    <text x={x + w - 8} y={toY(mean) - 8} textAnchor="end" fontSize="13" fontWeight="750" fill={ink} stroke="white" strokeWidth="4" paintOrder="stroke">mean</text>
    <Lines x={x + w / 2} y={54} anchor="middle" lines={[title]} size={15} />
  </g>
}
function Bigger() {
  const crowd = Array.from({ length: 100 }, (_, i) => i === 57 ? 196 : r1(146 + rand(i + 5) * 14))
  return <WsDiagram schematic={false} title="Left: the heights of 3 students, one very tall, so the mean is pulled up a lot. Right: the heights of 100 students with the same tall student among them; the mean hardly changes.">
    <Panel x={16} y={24} w={246} h={262} />
    <Panel x={278} y={24} w={246} h={262} />
    <Heights x={16} w={246} cms={[150, 154, 196]} barW={36} gap={20} title="3 students" />
    <Heights x={278} w={246} cms={crowd} barW={1.7} gap={0.44} title="100 students" />
    <Lines x={139} y={256} anchor="middle" lines={['one tall student moves', 'the mean a lot']} size={13} weight={650} colour={muted} />
    <Lines x={401} y={256} anchor="middle" lines={['one tall student', 'hardly matters']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}
function Representative() {
  const pop: { p: Pt; kind: number; s: number }[] = []
  for (let j = 0; j < 5; j++) for (let i = 0; i < 8; i++) {
    const x = 50 + i * 31 + (j % 2) * 14 + (rand(i + j * 9) - 0.5) * 8, y = 88 + j * 38
    if (((x - 162) / 132) ** 2 + ((y - 150) / 108) ** 2 < 0.95) pop.push({ p: [r1(x), y], kind: (i * 3 + j) % 4, s: rand(i * 5 + j) > 0.72 ? 0.34 : 0.44 })
  }
  const sample: Pt[] = [[404, 124], [440, 124], [476, 124], [386, 162], [422, 162], [458, 162], [494, 162], [404, 200], [440, 200], [476, 200]]
  return <WsDiagram schematic={false} title="A big population of mixed people, and a smaller sample drawn from it with a similar mix of ages and backgrounds.">
    <path d={blob(162, 150, 142, 118, 3, 0.05, 12)} fill={W.panel} stroke={W.panelLine} strokeWidth="2" />
    {pop.map(({ p, kind, s }, i) => <Bust key={i} x={p[0]} y={p[1] + 12} s={s} kind={kind} />)}
    <circle cx={440} cy={158} r={80} fill={W.panel} stroke={tones.mark.line} strokeWidth="2.2" />
    {sample.map((p, i) => <Bust key={i} x={p[0]} y={p[1] + 12} s={i % 4 === 3 ? 0.34 : 0.44} kind={i % 4} />)}
    <Arrow from={[300, 150]} to={[352, 150]} width={2.8} />
    <Lines x={162} y={288} anchor="middle" lines={['population: the whole city']} size={14} colour={muted} />
    <Lines x={440} y={264} anchor="middle" lines={['sample of 1000:', 'a mix of ages', 'and backgrounds']} size={13} />
  </WsDiagram>
}

/* ---------- Section 3: precise and accurate ---------- */

const NL = { x: 70, w: 400, min: 46, max: 54, y: 214 }
const nx = numberScale(NL.x, NL.w, NL.min, NL.max)
function Cluster({ values, tone, dim = false }: { values: number[]; tone: 'measure' | 'good' | 'keep'; dim?: boolean }) {
  return <g>{values.map((v, i) => <Dot key={i} x={nx(v)} y={NL.y - 22 - i * 20} tone={tone} dim={dim} />)}</g>
}
function Precise({ accurate = false }: { accurate?: boolean }) {
  const B = [52.0, 52.1, 51.9], A = [50.1, 49.9, 50.0]
  return <WsDiagram schematic={false} title={accurate
    ? 'A number line of mass in grams with the true value 50.0 g marked. Readings of 50.1, 49.9 and 50.0 g sit right on it: they are accurate. Readings near 52 g are precise but not accurate.'
    : 'A number line of mass in grams. Three readings, 52.0, 52.1 and 51.9 g, are very close together: they are precise.'}>
    <NumberLine x={NL.x} y={NL.y} w={NL.w} min={NL.min} max={NL.max} step={1} unit="g" />
    {accurate && <g>
      <path d={`M${nx(50)} ${NL.y + 6}V104`} stroke={tones.truth.line} strokeWidth="2.6" strokeDasharray="6 5" />
      <Tag x={nx(50)} y={90} text="true value 50.0 g" tone="truth" size={13} />
    </g>}
    <Cluster values={B} tone={accurate ? 'keep' : 'measure'} dim={accurate} />
    {accurate ? <Cluster values={A} tone="good" /> : null}
    {!accurate && <g>
      <Bracket x1={nx(51.9) - 16} x2={nx(52.1) + 16} y={116} />
      <Lines x={nx(52)} y={100} anchor="middle" lines={['close together']} size={15} colour={tones.measure.text} />
      {['52.0 g', '52.1 g', '51.9 g'].map((t, i) => <Lines key={t} x={nx(52.1) + 18} y={NL.y - 17 - i * 20} lines={[t]} size={12} weight={650} colour={muted} />)}
    </g>}
    {accurate && <g>
      <Lines x={nx(50) - 34} y={NL.y - 58} anchor="end" lines={['close to the', 'true value']} size={14} colour={tones.good.text} />
      <Lines x={nx(52) + 22} y={NL.y - 44} lines={['precise, not', 'accurate']} size={13} weight={650} colour={muted} />
    </g>}
    <Tag x={90} y={36} text={accurate ? 'accurate' : 'precise'} tone="mark" size={14} strong />
    <Lines x={270} y={276} anchor="middle" lines={['mass of the same block, weighed three times']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}
function StudentTable({ tags }: { tags: boolean }) {
  const cols = tags ? [100, 86, 86, 86, 164] : [136, 110, 110, 110]
  const x = (540 - cols.reduce((a, b) => a + b, 0)) / 2, y = 78, rowH = tags ? 50 : 52
  const head = tags ? ['', 'Reading 1\n(g)', 'Reading 2\n(g)', 'Reading 3\n(g)', ''] : ['', 'Reading 1\n(cm)', 'Reading 2\n(cm)', 'Reading 3\n(cm)']
  const data = tags
    ? [['Student A', '50.1', '49.9', '50.0'], ['Student B', '52.0', '52.1', '51.9'], ['Student C', '47.0', '53.0', '50.0']]
    : [['Student A', '18.5', '21.5', '20.0'], ['Student B', '21.0', '21.1', '20.9'], ['Student C', '20.1', '19.9', '20.0']]
  const labels: [string, 'good' | 'mark' | 'bad'][] = [['precise and accurate', 'good'], ['precise, not accurate', 'mark'], ['not precise', 'bad']]
  return <WsDiagram schematic={false} title={tags
    ? 'A table of three students weighing the same block of true mass 50.0 g. Student A: 50.1, 49.9, 50.0 g, precise and accurate. Student B: 52.0, 52.1, 51.9 g, precise but not accurate. Student C: 47.0, 53.0, 50.0 g, not precise.'
    : 'A table of three readings for each of three students. The true length is 20.0 cm.'}>
    <DataTable x={x} y={y} cols={cols} rowH={rowH} headH={54} size={tags ? 15 : 16} title={tags ? 'True mass 50.0 g' : 'True length 20.0 cm'} titleTone="truth"
      rows={[head, ...data.map(r => tags ? [...r, ''] : r)]} />
    {tags && labels.map(([t, tone], i) => <Tag key={t} x={x + 358 + 82} y={y + 54 + rowH * i + rowH / 2} text={t} tone={tone} size={12} w={152} />)}
  </WsDiagram>
}
function Method() {
  return <WsDiagram title="Left: gas from a reaction bubbles through water and the bubbles are counted; you might miss some. Right: the gas collects in a gas syringe with a scale, which is more accurate.">
    <Panel x={14} y={16} w={250} h={270} />
    <Panel x={276} y={16} w={250} h={270} />
    {/* counting bubbles */}
    <path d="M80 104V72Q80 64 88 64H186Q194 64 194 72V200" fill="none" stroke={LB.glassLine} strokeWidth="5" />
    <path d="M80 104V72Q80 64 88 64H186Q194 64 194 72V200" fill="none" stroke="white" strokeWidth="2" />
    <Flask cx={80} base={212} h={112} w={90} level={34}><Chips cx={80} base={212} n={5} spread={50} size={0.8} /></Flask>
    <Bung cx={80} top={98} w={24} />
    <path d="M156 148V206Q156 214 164 214H226Q234 214 234 206V148" fill={W.glass} stroke={LB.glassLine} strokeWidth="2.4" />
    <path d="M158 164H232V206Q232 212 226 212H164Q158 212 158 206Z" fill={LB.water} />
    <path d="M158 164H232" stroke={LB.waterLine} strokeWidth="1.6" />
    <Bubbles pts={[[194, 190], [198, 176], [192, 168]]} r={3.4} />
    <Bench x1={24} x2={254} y={216} />
    <Tag x={139} y={242} text="counting bubbles" size={13} />
    <Cross x={80} y={272} s={0.9} />
    <Lines x={96} y={277} lines={['might miss some']} size={13} colour={tones.bad.text} />
    {/* gas syringe */}
    <path d="M338 104V72Q338 64 346 64H372" fill="none" stroke={LB.glassLine} strokeWidth="5" />
    <path d="M338 104V72Q338 64 346 64H372" fill="none" stroke="white" strokeWidth="2" />
    <Flask cx={338} base={212} h={112} w={90} level={34}><Chips cx={338} base={212} n={5} spread={50} size={0.8} /></Flask>
    <Bung cx={338} top={98} w={24} />
    <GasSyringe x={370} y={64} w={144} fill={0.42} />
    <Lines x={440} y={112} anchor="middle" lines={['reads the volume', 'on a scale']} size={12} weight={650} colour={muted} />
    <Bench x1={286} x2={516} y={216} />
    <Tag x={401} y={242} text="gas syringe" size={13} />
    <Tick x={342} y={272} s={0.9} />
    <Lines x={358} y={277} lines={['more accurate']} size={13} colour={tones.good.text} />
  </WsDiagram>
}
function Equipment() {
  return <WsDiagram title="To measure 11 cm³, a measuring cylinder with 1 cm³ steps is better than one with 10 cm³ steps. Before weighing, check that the balance reads zero.">
    <Tag x={140} y={28} text="to measure 11 cm³" size={13} />
    <Cylinder x={84} y={226} h={170} w={40} level={0.4} marks={10} />
    <Cylinder x={196} y={226} h={170} w={40} level={0.4} marks={1} />
    <Tick x={84} y={250} s={0.9} />
    <Lines x={84} y={286} anchor="middle" lines={['1 cm³ steps']} size={13} colour={tones.good.text} />
    <Cross x={196} y={250} s={0.9} />
    <Lines x={196} y={286} anchor="middle" lines={['10 cm³ steps']} size={13} colour={tones.bad.text} />
    <path d="M280 40V270" stroke={W.panelLine} strokeWidth="1.6" strokeDasharray="4 6" />
    <Balance x={410} y={150} reading="0.0 g" w={150} />
    <Lines x={410} y={134} anchor="middle" lines={['nothing on it']} size={13} weight={650} colour={muted} />
    <Tick x={344} y={236} s={0.9} />
    <Lines x={360} y={241} lines={['check it reads zero']} size={14} />
  </WsDiagram>
}

/* ---------- Section 4: errors and anomalies ---------- */

function Systematic() {
  return <WsDiagram title="Left: an empty balance reads 2 g. Right: a block with a true mass of 10 g reads 12 g. Every reading is 2 g too high: a systematic error.">
    <Balance x={140} y={160} reading="2 g" w={150} />
    <Lines x={140} y={140} anchor="middle" lines={['nothing on it']} size={13} weight={650} colour={muted} />
    <rect x={362} y={122} width={56} height={38} rx="6" fill={W.metal} stroke={W.metalLine} strokeWidth="2" />
    <Balance x={390} y={160} reading="12 g" w={150} />
    <Lines x={390} y={104} anchor="middle" lines={['true mass 10 g']} size={13} colour={tones.truth.text} />
    <Tag x={270} y={260} text="always 2 g too high" tone="bad" size={15} strong />
    <Tag x={140} y={52} text="empty" size={13} />
    <Tag x={390} y={52} text="with a 10 g block" size={13} />
  </WsDiagram>
}
const RN = { x: 150, w: 330, min: 4.8, max: 5.5, y: 214 }
const rx = numberScale(RN.x, RN.w, RN.min, RN.max)
const fmt1 = (v: number) => v.toFixed(1)
function RandomLine({ reduce = false }: { reduce?: boolean }) {
  const vals = reduce ? [5.1, 5.4, 4.9, 5.0, 5.1] : [5.1, 5.4, 4.9]
  const stackAt: Record<string, number> = {}
  return <WsDiagram schematic={false} title={reduce
    ? 'Five repeat times: 5.1, 5.4, 4.9, 5.0 and 5.1 s. Some are a little high and some a little low, so they partly cancel. The mean, 5.1 s, is in the middle.'
    : 'Three repeat times, 5.1 s, 5.4 s and 4.9 s, on a number line. Pressing the stopwatch a little early or late makes some readings a bit high and some a bit low.'}>
    <Stopwatch x={70} y={150} r={34} />
    <NumberLine x={RN.x} y={RN.y} w={RN.w} min={RN.min} max={RN.max} step={0.1} unit="s" fmt={fmt1} />
    {vals.map((v, i) => { const k = String(v); stackAt[k] = (stackAt[k] ?? 0) + 1; return <Dot key={i} x={rx(v)} y={RN.y - 18 - (stackAt[k] - 1) * 20} /> })}
    {!reduce && <g>
      <path d={`M${rx(5.13)} ${RN.y - 4}V108`} stroke={muted} strokeWidth="1.8" strokeDasharray="5 5" />
      <Arrow from={[rx(5.13) - 8, 132]} to={[rx(4.9), 132]} colour={tones.measure.line} width={2.4} />
      <Arrow from={[rx(5.13) + 8, 132]} to={[rx(5.4), 132]} colour={tones.measure.line} width={2.4} />
      <Lines x={rx(4.95)} y={116} anchor="middle" lines={['a bit low']} size={14} colour={tones.measure.text} />
      <Lines x={rx(5.33)} y={116} anchor="middle" lines={['a bit high']} size={14} colour={tones.measure.text} />
      <Lines x={rx(5.13)} y={96} anchor="middle" lines={['middle']} size={13} weight={650} colour={muted} />
      <Lines x={270} y={278} anchor="middle" lines={['readings vary a little each time']} size={14} weight={650} colour={muted} />
    </g>}
    {reduce && <g>
      <path d={`M${rx(5.1)} ${RN.y + 6}V104`} stroke={tones.mark.line} strokeWidth="2.6" />
      <Tag x={rx(5.1)} y={88} text="mean 5.1 s" tone="mark" size={14} strong />
      <Arrow from={[rx(4.9), 140]} to={[rx(5.1) - 10, 140]} colour={muted} width={2} />
      <Arrow from={[rx(5.4), 140]} to={[rx(5.1) + 10, 140]} colour={muted} width={2} />
      <Lines x={270} y={278} anchor="middle" lines={['highs and lows partly cancel out']} size={14} weight={650} colour={muted} />
    </g>}
  </WsDiagram>
}
function Anomalous() {
  const vals = [14, 15, 14, 26, 15]
  const ax = numberScale(70, 390, 12, 28)
  const seen: Record<number, number> = {}
  return <WsDiagram schematic={false} title="Five repeat times: 14, 15, 14, 26 and 15 s. The 26 s reading does not fit the pattern: it is anomalous. Find the cause, then ignore it.">
    {vals.map((v, i) => <g key={i}>
      <Tag x={150 + i * 60} y={40} text={String(v)} tone={v === 26 ? 'bad' : 'plain'} size={15} w={48} strong={v === 26} />
    </g>)}
    <NumberLine x={70} y={214} w={390} min={12} max={28} step={1} labels={[12, 14, 16, 18, 20, 22, 24, 26, 28]} unit="s" />
    {vals.map((v, i) => { seen[v] = (seen[v] ?? 0) + 1; return <Dot key={i} x={ax(v)} y={214 - 18 - (seen[v] - 1) * 20} tone={v === 26 ? 'bad' : 'measure'} ring={v === 26} /> })}
    <Lines x={ax(26)} y={164} anchor="middle" lines={['anomalous']} size={16} colour={tones.bad.text} />
    <Lines x={ax(26)} y={114} anchor="middle" lines={['find the cause,', 'then ignore it']} size={14} weight={650} colour={muted} />
    <Lines x={270} y={276} anchor="middle" lines={['five repeat times, in seconds']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}

export function WsCollectVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'wscollect-samplesize': return <SampleSize />
    case 'wscollect-bigger': return <Bigger />
    case 'wscollect-representative': return <Representative />
    case 'wscollect-precise': return <Precise />
    case 'wscollect-accurate': return <Precise accurate />
    case 'wscollect-table': return <StudentTable tags />
    case 'wscollect-method': return <Method />
    case 'wscollect-equipment': return <Equipment />
    case 'wscollect-systematic': return <Systematic />
    case 'wscollect-random': return <RandomLine />
    case 'wscollect-reduce': return <RandomLine reduce />
    case 'wscollect-anomalous': return <Anomalous />
    case 'wscollect-q-students': return <StudentTable tags={false} />
    default: return null
  }
}
