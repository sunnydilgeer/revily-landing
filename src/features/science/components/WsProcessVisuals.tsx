import type { ReactNode } from 'react'
import { WsDiagram, Tag, Panel, Tick, Cross, Arrow, DataTable, NumberLine, numberScale, Dot, Bracket, tones, ink, muted, r1, faded, type Tone } from './WsKit'
import { Lines } from './PhysicsKit'

/*
 * Working Scientifically Lesson 6: Processing data. Original, code-native schematics; data invented and friendly.
 * Every focus id here starts with 'wsprocess-' and is routed from CellBiologyVisuals.tsx.
 *
 * Drawn with WsKit: neat rounded tables with units in the headings; values as small rounded chips; the value or column
 * to look at is soft yellow; anomalies and poor practice coral, good practice green. The five gas volumes
 * 10, 14, 8, 14, 19 are reused through the mean, median, mode and range frames and the worked example.
 */

const VALUES = [10, 14, 8, 14, 19]
const SORTED = [...VALUES].sort((a, b) => a - b)

/** A row of value chips centred on cx. `tone(i)` styles each one. */
function ChipRow({ cx, y, values, tone = () => 'plain', dim = () => false, gap = 62, size = 17 }: { cx: number; y: number; values: (number | string)[]; tone?: (i: number) => Tone; dim?: (i: number) => boolean; gap?: number; size?: number }) {
  const x0 = cx - (values.length - 1) * gap / 2
  return <g>{values.map((v, i) => <Tag key={i} x={x0 + i * gap} y={y} text={String(v)} tone={tone(i)} size={size} w={50} strong={tone(i) !== 'plain'} dim={dim(i)} />)}</g>
}
const chipX = (cx: number, n: number, i: number, gap = 62) => cx - (n - 1) * gap / 2 + i * gap

/* ---------- Section 2: tables ---------- */

function FlatRuler({ x, y, w, angle = -8 }: { x: number; y: number; w: number; angle?: number }) {
  const n = Math.floor((w - 8) / 9)
  return <g transform={`rotate(${angle} ${x + w / 2} ${y})`}>
    <rect x={x} y={y - 12} width={w} height={24} rx="3" fill="#f7ebc8" stroke="#b99a52" strokeWidth="1.8" />
    {Array.from({ length: n }, (_, i) => <path key={i} d={`M${x + 6 + i * 9} ${y - 12}v${i % 5 === 0 ? 10 : 6}`} stroke="#9c8040" strokeWidth="1.2" />)}
  </g>
}
function Table() {
  return <WsDiagram schematic={false} title="A results table drawn with a ruler. Both columns have a heading: Height of ramp (cm) and Time (s).">
    <DataTable x={50} y={72} cols={[170, 130]} headH={60} rowH={44} size={16} hiHead
      rows={[['Height of ramp\n(cm)', 'Time\n(s)'], ['10', '3.2'], ['20', '2.4'], ['30', '2.0']]} />
    <Lines x={420} y={70} anchor="middle" lines={['a heading on', 'every column']} size={16} colour={tones.mark.text} />
    <Arrow from={[360, 88]} to={[328, 100]} colour={tones.mark.line} width={2.6} />
    <FlatRuler x={370} y={200} w={140} />
    <Lines x={440} y={252} anchor="middle" lines={['draw it with a ruler']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}
function Units() {
  return <WsDiagram schematic={false} title="Left: a table headed Time with 5 s and 6 s written in the cells, which is untidy. Right: a table headed Time (s) with just 5 and 6 in the cells: the unit is written once, in the heading.">
    <DataTable x={50} y={70} cols={[80, 110]} headH={50} rowH={46} size={17} rows={[['Trial', 'Time'], ['1', { t: '5 s', tone: 'bad' }], ['2', { t: '6 s', tone: 'bad' }]]} />
    <DataTable x={300} y={70} cols={[80, 110]} headH={50} rowH={46} size={17} rows={[['Trial', { t: 'Time (s)', tone: 'mark' }], ['1', '5'], ['2', '6']]} />
    <Cross x={145} y={236} s={1.1} />
    <Lines x={145} y={278} anchor="middle" lines={['unit after every number']} size={13} colour={tones.bad.text} />
    <Tick x={395} y={236} s={1.1} />
    <Lines x={395} y={278} anchor="middle" lines={['unit once, in the heading']} size={13} colour={tones.good.text} />
  </WsDiagram>
}
function Repeats() {
  return <WsDiagram schematic={false} title="A table with columns Height (cm), Repeat 1 (s), Repeat 2 (s), Repeat 3 (s) and Mean (s). The mean column is highlighted.">
    <DataTable x={36} y={62} cols={[100, 92, 92, 92, 92]} headH={58} rowH={50} size={16} hiCol={4}
      rows={[['Height\n(cm)', 'Repeat 1\n(s)', 'Repeat 2\n(s)', 'Repeat 3\n(s)', 'Mean\n(s)'], ['20', '2.4', '2.6', '2.5', '2.5'], ['40', '1.8', '1.7', '1.9', '1.8']]} />
    <Bracket x1={140} x2={410} y={238} dir={-1} />
    <Lines x={275} y={266} anchor="middle" lines={['one column for each repeat']} size={14} weight={650} colour={muted} />
    <Lines x={458} y={270} anchor="middle" lines={['then the mean']} size={14} colour={tones.mark.text} />
    <Arrow from={[458, 252]} to={[458, 226]} colour={tones.mark.line} width={2.4} />
  </WsDiagram>
}

/* ---------- Section 3: averages and range ---------- */

function Bars({ x, values, unit = 7.6, base = 238, tone = 'measure', labels = true }: { x: number; values: number[]; unit?: number; base?: number; tone?: Tone; labels?: boolean }) {
  const c = tones[tone]
  return <g>{values.map((v, i) => {
    const bx = x + i * 40, h = v * unit
    return <g key={i}>
      <rect x={bx} y={r1(base - h)} width={30} height={r1(h)} rx="5" fill={c.fill} stroke={c.line} strokeWidth="1.8" />
      {labels && <text x={bx + 15} y={r1(base - h - 8)} textAnchor="middle" fontSize="14" fontWeight="750" fill={ink}>{v}</text>}
    </g>
  })}</g>
}
function Mean() {
  const base = 238, u = 7.6
  return <WsDiagram schematic={false} title="Five bars of 10, 14, 8, 14 and 19 are added up to make 65, then shared out equally into five bars of 13. The mean is 13.">
    <Bars x={36} values={VALUES} />
    <path d={`M28 ${base}H232M306 ${base}H510`} stroke={ink} strokeWidth="2" />
    <Arrow from={[244, 150]} to={[296, 150]} width={3} />
    <Lines x={270} y={116} anchor="middle" lines={['add up,', 'then divide']} size={14} />
    <Bars x={314} values={[13, 13, 13, 13, 13]} tone="mark" labels={false} />
    <path d={`M306 ${r1(base - 13 * u)}H510`} stroke={ink} strokeWidth="2" strokeDasharray="6 5" />
    <text x={510} y={r1(base - 13 * u - 8)} textAnchor="end" fontSize="14" fontWeight="750" fill={ink}>mean = 13</text>
    <Lines x={130} y={272} anchor="middle" lines={['total = 65']} size={15} weight={650} colour={muted} />
    <Lines x={408} y={272} anchor="middle" lines={['65 ÷ 5 = 13']} size={15} colour={tones.mark.text} />
  </WsDiagram>
}
function Median() {
  return <WsDiagram schematic={false} title="The values 10, 14, 8, 14, 19 are put in order: 8, 10, 14, 14, 19. The middle value, 14, is the median. With an even number of values, the median is halfway between the middle two.">
    <ChipRow cx={270} y={36} values={VALUES} dim={() => true} size={15} gap={56} />
    <Arrow from={[270, 56]} to={[270, 90]} width={2.4} />
    <Lines x={284} y={80} lines={['put in order']} size={13} weight={650} colour={muted} />
    <ChipRow cx={270} y={122} values={SORTED} tone={i => i === 2 ? 'mark' : 'plain'} />
    <Lines x={270} y={176} anchor="middle" lines={['median = 14']} size={17} colour={tones.mark.text} />
    <Panel x={70} y={200} w={400} h={80} />
    <Lines x={90} y={230} lines={['Even number of values? Halfway between', 'the middle two: 4, 6, 8, 10 → median 7']} size={14} weight={650} />
  </WsDiagram>
}
function Mode() {
  return <WsDiagram schematic={false} title="In 8, 10, 14, 14, 19 the value 14 appears twice, more often than any other. The mode is 14.">
    <Bracket x1={chipX(270, 5, 2) - 26} x2={chipX(270, 5, 3) + 26} y={84} />
    <Lines x={chipX(270, 5, 2.5)} y={66} anchor="middle" lines={['most often']} size={15} colour={tones.mark.text} />
    <ChipRow cx={270} y={122} values={SORTED} tone={i => i === 2 || i === 3 ? 'mark' : 'plain'} />
    <Lines x={270} y={186} anchor="middle" lines={['mode = 14']} size={18} colour={tones.mark.text} />
    <Lines x={270} y={240} anchor="middle" lines={['MOde: the MOst common value']} size={14} weight={650} colour={muted} />
  </WsDiagram>
}
function Range() {
  const s = numberScale(70, 390, 5, 20)
  const seen: Record<number, number> = {}
  return <WsDiagram schematic={false} title="The five values on a number line. The smallest is 8 and the largest is 19. The range is 19 − 8 = 11.">
    <NumberLine x={70} y={200} w={390} min={5} max={20} step={1} labels={[5, 8, 10, 15, 19, 20]} />
    {VALUES.map((v, i) => { seen[v] = (seen[v] ?? 0) + 1; return <Dot key={i} x={s(v)} y={200 - 18 - (seen[v] - 1) * 20} tone={v === 8 || v === 19 ? 'mark' : 'measure'} /> })}
    <Bracket x1={s(8)} x2={s(19)} y={136} />
    <Lines x={(s(8) + s(19)) / 2} y={116} anchor="middle" lines={['range = 19 − 8 = 11']} size={17} colour={tones.mark.text} />
    <Lines x={s(8)} y={254} anchor="middle" lines={['smallest']} size={13} weight={650} colour={muted} />
    <Lines x={s(19)} y={254} anchor="middle" lines={['largest']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}
function Anomaly() {
  const vals = [31, 29, 52, 30, 34]
  return <WsDiagram schematic={false} title="Five readings: 31, 29, 52, 30 and 34. The 52 does not fit, so it is crossed out and left out. The other four add up to 124, and 124 ÷ 4 = 31. Divide by 4, not 5.">
    <ChipRow cx={270} y={50} values={vals} tone={i => i === 2 ? 'bad' : 'plain'} dim={i => i === 2} />
    <path d={`M${chipX(270, 5, 2) - 22} 62L${chipX(270, 5, 2) + 22} 38`} stroke={tones.bad.line} strokeWidth="3" />
    <Lines x={chipX(270, 5, 2)} y={92} anchor="middle" lines={['left out']} size={14} colour={tones.bad.text} />
    <Lines x={270} y={150} anchor="middle" lines={['31 + 29 + 30 + 34 = 124']} size={18} />
    <Lines x={270} y={190} anchor="middle" lines={['124 ÷ 4 = 31']} size={18} />
    <Tag x={270} y={244} text="divide by 4, not 5" tone="mark" size={15} strong />
  </WsDiagram>
}

/* ---------- Section 4: significant figures ---------- */

function SfCount() {
  const chars: [string, number | null][] = [['0', null], ['.', null], ['0', null], ['4', 1], ['0', 2], ['6', 3]]
  const x0 = 150, step = 48
  let x = x0
  const placed = chars.map(([c, n]) => { const w = c === '.' ? 22 : step; const cx = x + w / 2; x += w; return { c, n, cx } })
  const ord = ['1st', '2nd', '3rd']
  return <WsDiagram schematic={false} title="The number 0.0406. The leading zeros do not count. The 4 is the first significant figure, then 0 and 6: three significant figures.">
    {placed.map(({ c, n, cx }, i) => <g key={i}>
      {n && <rect x={cx - 21} y={78} width={42} height={70} rx="12" fill={tones.mark.fill} stroke={tones.mark.line} strokeWidth="2" />}
      <text x={cx} y={134} textAnchor="middle" fontSize="54" fontWeight="750" fill={n ? ink : '#b3c1cb'}>{c}</text>
      {n && <Tag x={cx} y={180} text={ord[n - 1]} tone="mark" size={13} w={46} />}
    </g>)}
    <Lines x={placed[0].cx + 20} y={206} anchor="middle" lines={['zeros at the', 'start do not count']} size={13} weight={650} colour={muted} />
    <Lines x={270} y={268} anchor="middle" lines={['0.0406 has 3 significant figures']} size={16} />
  </WsDiagram>
}
function SfRound() {
  return <WsDiagram schematic={false} title="The calculation 2.5 ÷ 0.60. Both numbers have 2 significant figures, so the answer is rounded to 2 significant figures.">
    <text x={170} y={110} textAnchor="middle" fontSize="44" fontWeight="750" fill={ink}>2.5</text>
    <text x={260} y={108} textAnchor="middle" fontSize="40" fontWeight="600" fill={muted}>÷</text>
    <text x={360} y={110} textAnchor="middle" fontSize="44" fontWeight="750" fill={ink}>0.60</text>
    <Tag x={170} y={150} text="2 s.f." size={14} />
    <Tag x={360} y={150} text="2 s.f." size={14} />
    <Arrow from={[170, 168]} to={[250, 214]} colour={muted} width={2.2} bend={0.12} />
    <Arrow from={[360, 168]} to={[290, 214]} colour={muted} width={2.2} bend={-0.12} />
    <Tag x={270} y={240} text="answer: 2 s.f." tone="mark" size={16} strong />
  </WsDiagram>
}
function SfFinal() {
  return <WsDiagram schematic={false} title="A two-step calculation. Step 1: 2.5 ÷ 0.60 = 4.1666…, keep all the digits. Step 2: 4.1666… × 4.0 = 16.666…. Round only here, at the end: 17 (2 significant figures).">
    <Panel x={30} y={28} w={480} h={64} />
    <Lines x={50} y={67} lines={['Step 1']} size={14} colour={muted} />
    <text x={124} y={68} fontSize="20" fontWeight="700" fill={ink}>2.5 ÷ 0.60 = <tspan fill={tones.measure.text}>4.1666…</tspan></text>
    <Tag x={448} y={60} text="keep all digits" tone="measure" size={12} />
    <Arrow from={[270, 96]} to={[270, 118]} width={2.4} />
    <Panel x={30} y={122} w={480} h={64} />
    <Lines x={50} y={161} lines={['Step 2']} size={14} colour={muted} />
    <text x={124} y={162} fontSize="20" fontWeight="700" fill={ink}><tspan fill={tones.measure.text}>4.1666…</tspan> × 4.0 = 16.666…</text>
    <Arrow from={[270, 190]} to={[270, 212]} width={2.4} />
    <Panel x={120} y={216} w={300} h={62} tone="mark" strong />
    <Lines x={140} y={253} lines={['round here:']} size={15} colour={tones.mark.text} />
    <text x={256} y={255} fontSize="22" fontWeight="750" fill={ink}>17 <tspan fontSize="14" fill={muted}>(2 s.f.)</tspan></text>
  </WsDiagram>
}

/* ---------- Worked examples ---------- */

function Row({ y, label, children, tone = 'mark' }: { y: number; label: string; children: ReactNode; tone?: Tone }) {
  return <g>
    <Tag x={92} y={y} text={label} tone={tone} size={14} w={96} />
    <text x={160} y={y + 6} fontSize="17" fontWeight="700" fill={ink}>{children}</text>
  </g>
}
function WorkedAverage() {
  return <WsDiagram schematic={false} title="Worked example for the gas volumes 10, 14, 8, 14 and 19 cm³. Mean: 65 ÷ 5 = 13 cm³. Median: 14 cm³. Mode: 14 cm³. Range: 19 − 8 = 11 cm³.">
    <Lines x={270} y={32} anchor="middle" lines={['Gas volumes: 10, 14, 8, 14, 19 cm³']} size={15} colour={muted} />
    <Row y={72} label="mean">65 ÷ 5 = <tspan fill={tones.mark.text}>13 cm³</tspan></Row>
    <Row y={126} label="median">8, 10, <tspan fill={tones.mark.text}>14</tspan>, 14, 19 → <tspan fill={tones.mark.text}>14 cm³</tspan></Row>
    <Row y={180} label="mode">14 appears twice → <tspan fill={tones.mark.text}>14 cm³</tspan></Row>
    <Row y={234} label="range">19 − 8 = <tspan fill={tones.mark.text}>11 cm³</tspan></Row>
  </WsDiagram>
}
function WorkedSf() {
  return <WsDiagram schematic={false} title="Worked example: speed = 2.5 ÷ 0.60 = 4.1666… m/s. Both numbers have 2 significant figures, so the speed is rounded to 4.2 m/s.">
    <Lines x={270} y={36} anchor="middle" lines={['speed = distance ÷ time']} size={16} colour={muted} />
    <text x={270} y={96} textAnchor="middle" fontSize="30" fontWeight="750" fill={ink}>2.5 ÷ 0.60</text>
    <Tag x={200} y={126} text="2 s.f." size={12} />
    <Tag x={322} y={126} text="2 s.f." size={12} />
    <g opacity={faded + 0.25}>
      <text x={146} y={196} textAnchor="middle" fontSize="24" fontWeight="700" fill={ink}>4.1666… m/s</text>
    </g>
    <Lines x={146} y={228} anchor="middle" lines={['calculator']} size={13} weight={650} colour={muted} />
    <Arrow from={[254, 188]} to={[314, 188]} width={2.6} />
    <Lines x={284} y={172} anchor="middle" lines={['round']} size={12} weight={650} colour={muted} />
    <Panel x={322} y={156} w={176} h={56} tone="mark" strong />
    <text x={410} y={193} textAnchor="middle" fontSize="24" fontWeight="750" fill={ink}>4.2 m/s</text>
    <Lines x={410} y={236} anchor="middle" lines={['2 s.f.']} size={14} colour={tones.mark.text} />
  </WsDiagram>
}

/* ---------- On your own ---------- */

function QTable() {
  return <WsDiagram schematic={false} title="A table of three repeat gas volumes for each of two test tubes.">
    <DataTable x={40} y={90} cols={[136, 108, 108, 108]} rowH={52} size={17} title="Volume of gas (cm³)"
      rows={[['', 'Repeat 1', 'Repeat 2', 'Repeat 3'], ['Tube A', '31', '33', '32'], ['Tube B', '45', '47', '62']]} />
  </WsDiagram>
}

export function WsProcessVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'wsprocess-table': return <Table />
    case 'wsprocess-units': return <Units />
    case 'wsprocess-repeats': return <Repeats />
    case 'wsprocess-mean': return <Mean />
    case 'wsprocess-median': return <Median />
    case 'wsprocess-mode': return <Mode />
    case 'wsprocess-range': return <Range />
    case 'wsprocess-anomaly': return <Anomaly />
    case 'wsprocess-sf-count': return <SfCount />
    case 'wsprocess-sf-round': return <SfRound />
    case 'wsprocess-sf-final': return <SfFinal />
    case 'wsprocess-worked-average': return <WorkedAverage />
    case 'wsprocess-worked-sf': return <WorkedSf />
    case 'wsprocess-q-table': return <QTable />
    default: return null
  }
}
