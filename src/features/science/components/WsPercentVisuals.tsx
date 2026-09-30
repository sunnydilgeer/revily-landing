import { WsDiagram, Tag, Arrow, DataTable, Bench, WorkingCard, tones, wsPalette as W, ink, muted, r1 } from './WsKit'
import { Lines } from './PhysicsKit'
import { Balance } from './DensityVisuals'

/*
 * Working Scientifically Lesson 22: Percentage change. Original, code-native schematics; masses invented and friendly.
 * Every focus id here starts with 'wspercent-' and is routed from CellBiologyVisuals.tsx.
 *
 * Potato cylinders are soft cream rods whose height matches their mass. The start (original value) is blue, the
 * change is shown green for an increase and coral for a decrease; the percentage answer sits in a soft yellow pill.
 */

const potato = { fill: '#f6e7b9', line: '#b8964a', top: '#fbf1d2' }
const up = tones.good, down = tones.bad, start = tones.change

/** A potato cylinder standing on `base`, centred on x, `h` tall. `extra` (+/−) shades a gained or lost piece at the top. */
function Cylinder({ x, base, h, w = 34, extra = 0, ghost = false }: { x: number; base: number; h: number; w?: number; extra?: number; ghost?: boolean }) {
  const top = base - h, ry = w * 0.22
  return <g opacity={ghost ? 0.45 : 1}>
    <path d={`M${x - w / 2} ${top}V${base}A${w / 2} ${ry} 0 0 0 ${x + w / 2} ${base}V${top}`} fill={potato.fill} stroke={potato.line} strokeWidth="2" />
    {extra > 0 && <path d={`M${x - w / 2} ${top}V${top + extra}A${w / 2} ${ry} 0 0 0 ${x + w / 2} ${top + extra}V${top}Z`} fill={up.fill} stroke={up.line} strokeWidth="1.8" />}
    <ellipse cx={x} cy={top} rx={w / 2} ry={ry} fill={potato.top} stroke={potato.line} strokeWidth="2" />
    {extra < 0 && <path d={`M${x - w / 2} ${top}V${top + extra}A${w / 2} ${ry} 0 0 1 ${x + w / 2} ${top + extra}V${top}`} fill="none" stroke={down.line} strokeWidth="2" strokeDasharray="4 4" />}
    <path d={`M${x - w / 2 + 6} ${top + 8}V${base - 4}`} stroke="white" strokeWidth="3" opacity=".7" />
  </g>
}

/* ---------- Section 2: why and how ---------- */

function Why() {
  const k = 8, base = 226
  return <WsDiagram title="Two potato cylinders. The small one starts at 4 g and the big one at 20 g. Each gains 2 g: that is half of 4 g but only a tenth of 20 g.">
    <Bench x1={40} x2={500} y={base + 8} />
    <Cylinder x={150} base={base} h={(4 + 2) * k} extra={2 * k} />
    <Cylinder x={380} base={base} h={(20 + 2) * k} extra={2 * k} />
    <Tag x={150} y={base - 6 * k - 34} text="+2 g" tone="good" size={14} strong />
    <Tag x={380} y={base - 22 * k - 34} text="+2 g" tone="good" size={14} strong />
    <Lines x={150} y={base + 34} anchor="middle" lines={['started at 4 g']} size={14} colour={start.text} />
    <Lines x={380} y={base + 34} anchor="middle" lines={['started at 20 g']} size={14} colour={start.text} />
    <Lines x={184} y={base - 30} lines={['2 g is half', 'of 4 g']} size={14} colour={muted} />
    <Lines x={352} y={base - 120} anchor="end" lines={['2 g is only', 'a tenth of 20 g']} size={14} colour={muted} />
    <Tag x={150} y={46} text="same gain, different start" tone="mark" size={14} w={250} strong />
  </WsDiagram>
}
function Equation() {
  const cx = 300
  return <WsDiagram schematic={false} title="Percentage change equals final value minus original value, divided by the original value, times 100. Step 1: find the change. Step 2: divide by the original value. Step 3: multiply by 100.">
    <Lines x={24} y={116} lines={['percentage', 'change =']} size={18} />
    <rect x={cx - 150} y={60} width={300} height={42} rx="21" fill={up.fill} stroke={up.line} strokeWidth="2" />
    <text x={cx} y={87} textAnchor="middle" fontSize="16.5" fontWeight="750" fill={ink}>final value − original value</text>
    <path d={`M${cx - 152} 118H${cx + 152}`} stroke={ink} strokeWidth="3" />
    <rect x={cx - 76} y={134} width={152} height={42} rx="21" fill={start.fill} stroke={start.line} strokeWidth="2" />
    <text x={cx} y={162} textAnchor="middle" fontSize="18" fontWeight="750" fill={ink}>original value</text>
    <rect x={cx + 162} y={97} width={78} height={42} rx="21" fill={tones.mark.fill} stroke={tones.mark.line} strokeWidth="2" />
    <text x={cx + 201} y={125} textAnchor="middle" fontSize="18" fontWeight="750" fill={ink}>× 100</text>
    {([[1, 'find the change', up], [2, 'divide by the original value', start], [3, 'multiply by 100', tones.mark]] as const).map(([n, t, c], i) => <g key={n}>
      <circle cx={70 + i * 0} cy={214 + i * 30} r="11" fill={c.fill} stroke={c.line} strokeWidth="2" />
      <text x={70} y={219 + i * 30} textAnchor="middle" fontSize="12.5" fontWeight="750" fill={ink}>{n}</text>
      <text x={90} y={219 + i * 30} fontSize="14" fontWeight="700" fill={ink}>{t}</text>
    </g>)}
  </WsDiagram>
}
function Original() {
  return <WsDiagram title="A potato cylinder weighed at the start: 8.0 g, the original value. After the investigation it is weighed again: 10.0 g, the final value.">
    <Cylinder x={130} base={150} h={64} />
    <Balance x={130} y={150} reading="8.0 g" w={140} />
    <Cylinder x={400} base={150} h={80} />
    <Balance x={400} y={150} reading="10.0 g" w={140} />
    <Arrow from={[220, 150]} to={[312, 150]} width={2.6} />
    <Lines x={266} y={112} anchor="middle" lines={['after the', 'investigation']} size={12} weight={650} colour={muted} />
    <Tag x={130} y={230} text="original value" tone="change" size={14} strong />
    <Lines x={130} y={266} anchor="middle" lines={['mass at the start']} size={14} colour={muted} />
    <Tag x={400} y={230} text="final value" tone="plain" size={14} strong />
    <Lines x={400} y={266} anchor="middle" lines={['mass at the end']} size={14} colour={muted} />
  </WsDiagram>
}

/* ---------- Section 3: positive and negative ---------- */

function Bars({ from, to, unit = 'g', k = 16 }: { from: number; to: number; unit?: string; k?: number }) {
  const base = 240, rise = to > from, c = rise ? up : down, x1 = 110, x2 = 250, bw = 80
  const h1 = from * k, h2 = to * k
  return <g>
    <path d={`M60 ${base}H320`} stroke={ink} strokeWidth="2" />
    <rect x={x1 - bw / 2} y={base - h1} width={bw} height={h1} rx="6" fill={start.fill} stroke={start.line} strokeWidth="2" />
    <rect x={x2 - bw / 2} y={base - h2} width={bw} height={h2} rx="6" fill={c.fill} stroke={c.line} strokeWidth="2" />
    <path d={`M${x1 + bw / 2} ${base - h1}H${x2 + bw / 2}`} stroke={muted} strokeWidth="1.8" strokeDasharray="5 5" />
    <Lines x={x1} y={base - h1 - 12} anchor="middle" lines={[`${from.toFixed(1)} ${unit}`]} size={15} colour={start.text} />
    <Lines x={x2} y={base - h2 - 12} anchor="middle" lines={[`${to.toFixed(1)} ${unit}`]} size={15} colour={c.text} />
    <Lines x={x1} y={base + 24} anchor="middle" lines={['start']} size={14} weight={650} colour={muted} />
    <Lines x={x2} y={base + 24} anchor="middle" lines={['end']} size={14} weight={650} colour={muted} />
    <Arrow from={[x2 + bw / 2 + 18, base - h1]} to={[x2 + bw / 2 + 18, base - h2 + (rise ? 0 : 0)]} colour={c.line} width={2.8} />
  </g>
}
function Signed({ rise }: { rise: boolean }) {
  const c = rise ? up : down
  return <WsDiagram schematic={false} title={rise
    ? 'A mass that goes up from 8.0 g to 10.0 g. The percentage change is +25%: positive, so the value increased.'
    : 'A mass that goes down from 5.0 g to 4.0 g. The percentage change is −20%: negative, so the value decreased.'}>
    {rise ? <Bars from={8} to={10} /> : <Bars from={5} to={4} k={26} />}
    <Tag x={430} y={110} text={rise ? '+25%' : '−20%'} tone={rise ? 'good' : 'bad'} size={24} w={130} strong />
    <Lines x={430} y={160} anchor="middle" lines={[rise ? 'positive:' : 'negative:', rise ? 'increased' : 'decreased']} size={16} colour={c.text} />
  </WsDiagram>
}

/* ---------- Section 4: comparing ---------- */

const K = 11
function Pair({ x, label, from, to, pct }: { x: number; label: string; from: number; to: number; pct?: string }) {
  const base = 218
  return <g>
    <Cylinder x={x - 30} base={base} h={from * K} />
    <Cylinder x={x + 30} base={base} h={to * K} extra={r1((to - from) * K)} />
    <Lines x={x - 30} y={base + 28} anchor="middle" lines={[`${from.toFixed(1)} g`]} size={14} colour={start.text} />
    <Lines x={x + 30} y={base + 28} anchor="middle" lines={[`${to.toFixed(1)} g`]} size={14} colour={up.text} />
    <Lines x={x - 30} y={base + 46} anchor="middle" lines={['start']} size={12} weight={650} colour={muted} />
    <Lines x={x + 30} y={base + 46} anchor="middle" lines={['end']} size={12} weight={650} colour={muted} />
    <Tag x={x} y={42} text={pct ? `${label}: ${pct}` : label} tone={pct ? 'mark' : 'plain'} size={17} w={pct ? 130 : 60} strong />
      </g>
}
function Compare() {
  return <WsDiagram title="Cylinder A goes from 6.0 g to 7.2 g, a change of +20%. Cylinder B goes from 10.0 g to 11.5 g, a change of +15%.">
    <Bench x1={40} x2={500} y={226} />
    <Pair x={150} label="A" from={6} to={7.2} pct="+20%" />
    <Pair x={390} label="B" from={10} to={11.5} pct="+15%" />
  </WsDiagram>
}
function MiniBars({ x, title, a, b, max, fmt }: { x: number; title: string; a: number; b: number; max: number; fmt: (v: number) => string }) {
  const base = 230, k = 150 / max
  return <g>
    <Lines x={x + 80} y={40} anchor="middle" lines={[title]} size={15} />
    <path d={`M${x} ${base}H${x + 160}`} stroke={ink} strokeWidth="2" />
    {[a, b].map((v, i) => {
      const bx = x + 20 + i * 70, big = v === Math.max(a, b)
      return <g key={i}>
        <rect x={bx} y={r1(base - v * k)} width={50} height={r1(v * k)} rx="6" fill={big ? tones.mark.fill : up.fill} stroke={big ? tones.mark.line : up.line} strokeWidth="2" />
        <Lines x={bx + 25} y={r1(base - v * k - 10)} anchor="middle" lines={[fmt(v)]} size={14} colour={ink} />
        <Lines x={bx + 25} y={base + 22} anchor="middle" lines={[i ? 'B' : 'A']} size={15} />
      </g>
    })}
  </g>
}
function Fair() {
  return <WsDiagram schematic={false} title="Left: gain in grams, A 1.2 g and B 1.5 g, so B gained more grams. Right: percentage change, A 20% and B 15%, so A changed more compared with its start.">
    <MiniBars x={40} title="gain in grams" a={1.2} b={1.5} max={1.6} fmt={v => `${v} g`} />
    <MiniBars x={320} title="percentage change" a={20} b={15} max={22} fmt={v => `${v}%`} />
    <path d="M270 40V250" stroke={W.panelLine} strokeWidth="1.6" strokeDasharray="4 6" />
    <Tag x={270} y={278} text="grams and percentages can disagree" tone="mark" size={13} w={320} />
  </WsDiagram>
}

/* ---------- Worked examples ---------- */

function WorkedPair({ from, to, title, lines }: { from: number; to: number; title: string; lines: { text: string; answer?: boolean }[] }) {
  const k = 16, base = 232, rise = to > from
  return <WsDiagram schematic={false} title={title}>
    <Cylinder x={46} base={base} h={from * k} />
    <Cylinder x={116} base={base} h={to * k} extra={rise ? r1((to - from) * k) : r1((to - from) * k)} />
    <Lines x={46} y={base + 30} anchor="middle" lines={[`${from.toFixed(1)} g`]} size={14} colour={start.text} />
    <Lines x={116} y={base + 30} anchor="middle" lines={[`${to.toFixed(1)} g`]} size={14} colour={rise ? up.text : down.text} />
    <Lines x={46} y={base + 48} anchor="middle" lines={['start']} size={12} weight={650} colour={muted} />
    <Lines x={116} y={base + 48} anchor="middle" lines={['end']} size={12} weight={650} colour={muted} />
    <WorkingCard x={166} y={40} w={362} rowH={54} size={17} lines={lines} />
  </WsDiagram>
}
function WorkedCompare() {
  return <WsDiagram schematic={false} title="Worked example. Cylinder A: 1.2 ÷ 6.0 × 100 = 20%. Cylinder B: 1.5 ÷ 10.0 × 100 = 15%. 20% is larger than 15%, so A had the larger percentage change.">
    <WorkingCard x={50} y={14} w={440} rowH={52} size={18} lines={[
      { text: 'A: change = 7.2 − 6.0 = 1.2 g' },
      { text: 'A: 1.2 ÷ 6.0 × 100 = +20%' },
      { text: 'B: change = 11.5 − 10.0 = 1.5 g' },
      { text: 'B: 1.5 ÷ 10.0 × 100 = +15%' },
      { text: '20% > 15%, so A changed more', answer: true },
    ]} />
  </WsDiagram>
}
function QTable() {
  return <WsDiagram schematic={false} title="A table of the start and end masses of two potato cylinders.">
    <DataTable x={80} y={80} cols={[130, 130, 130]} rowH={56} headH={62} size={18} title="Potato cylinders"
      rows={[['Cylinder', 'Mass at\nstart (g)', 'Mass at\nend (g)'], ['1', '5.0', '6.0'], ['2', '8.0', '9.2']]} />
  </WsDiagram>
}

export function WsPercentVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'wspercent-why': return <Why />
    case 'wspercent-equation': return <Equation />
    case 'wspercent-original': return <Original />
    case 'wspercent-positive': return <Signed rise />
    case 'wspercent-negative': return <Signed rise={false} />
    case 'wspercent-compare': return <Compare />
    case 'wspercent-fair': return <Fair />
    case 'wspercent-worked-increase': return <WorkedPair from={8} to={10} title="Worked example. A potato cylinder goes from 8.0 g to 10.0 g. Change = 2.0 g; 2.0 ÷ 8.0 = 0.25; 0.25 × 100 = 25; the percentage change is +25%." lines={[
      { text: 'change = 10.0 − 8.0 = 2.0 g' },
      { text: '2.0 ÷ 8.0 = 0.25' },
      { text: '0.25 × 100 = 25' },
      { text: 'percentage change = +25%', answer: true },
    ]} />
    case 'wspercent-worked-decrease': return <WorkedPair from={5} to={4} title="Worked example. A potato cylinder goes from 5.0 g to 4.0 g. Change = −1.0 g; −1.0 ÷ 5.0 = −0.2; −0.2 × 100 = −20; the percentage change is −20%, a decrease." lines={[
      { text: 'change = 4.0 − 5.0 = −1.0 g' },
      { text: '−1.0 ÷ 5.0 = −0.2' },
      { text: '−0.2 × 100 = −20' },
      { text: 'percentage change = −20%', answer: true },
    ]} />
    case 'wspercent-worked-compare': return <WorkedCompare />
    case 'wspercent-q-table': return <QTable />
    default: return null
  }
}
