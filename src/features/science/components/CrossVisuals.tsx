import { useId, type ReactNode } from 'react'
import { Arrow, Person } from './InfectionVisuals'
import { Diagram, Flask, Stopwatch, Step, Tag, Pill, Pointer, Table, Bench, labPalette as L } from './GasRateVisuals'

/*
 * Chemistry Lesson 34: the disappearing cross. Original, code-native schematics; not to scale.
 * Focus ids start with 'cross-'. Lab pieces (soft conical flask, stopwatch, tables, pointers) and the colour code come
 * from GasRateVisuals.tsx: colourless solutions are very pale blue-grey, the sulfur precipitate is pale yellow, amber
 * marks the step in focus. The black cross is drawn in ink on a sheet of paper under the flask. Round "seen from above"
 * windows show what you see looking down through the liquid: the cross fades as the precipitate forms.
 */
const { ink, muted, panelFill, panelLine } = L
const yellow = '#f3dc7a', yellowLine = '#c9a227', yellowSoft = '#fbf1c7'
const paper = '#fbfaf4', so2 = '#8d98a2'
type Pt = [number, number]

// ---------- Pieces ----------
function Paper({ cx, base, w = 116, cross = true }: { cx: number; base: number; w?: number; cross?: boolean }) {
  const t = w * .52, b = w * .68
  return <g>
    <path d={`M${cx - t} ${base - 8}Q${cx} ${base - 10} ${cx + t} ${base - 8}L${cx + b} ${base + 22}Q${cx} ${base + 25} ${cx - b} ${base + 22}Z`} fill={paper} stroke={panelLine} strokeWidth="2" />
    {cross && <path d={`M${cx - 20} ${base + 3}L${cx + 20} ${base + 17}M${cx + 20} ${base + 3}L${cx - 20} ${base + 17}`} stroke={ink} strokeWidth="4.5" />}
  </g>
}
/** Specks of sulfur scattered through the liquid; `n` grows as more precipitate forms. */
function Specks({ cx, base, n, depth = 50, spread = 90 }: { cx: number; base: number; n: number; depth?: number; spread?: number }) {
  return <g>{Array.from({ length: n }, (_, i) => {
    const cols = 8, c = i % cols, row = Math.floor(i / cols), j = ((i * 7) % 5) - 2
    const x = cx - spread / 2 + (c + .5) * spread / cols + (row % 2) * 5 + j, y = base - 8 - ((row * 11 + (c % 3) * 4) % (depth - 10))
    return <circle key={i} cx={x} cy={y} r="2.4" fill={yellowLine} opacity=".85" />
  })}</g>
}
/** A flask of thiosulfate on the cross. `cloud` 0 = clear, 1 = fully cloudy yellow. */
function CrossFlask({ cx, base, cloud = 0, h = 140, w = 116, level = 52, paperOn = true, over }: { cx: number; base: number; cloud?: number; h?: number; w?: number; level?: number; paperOn?: boolean; over?: ReactNode }) {
  const fill = cloud > .7 ? yellow : cloud > .25 ? yellowSoft : L.sol, line = cloud > .25 ? yellowLine : L.solLine
  return <g>
    {paperOn && <Paper cx={cx} base={base} w={w} />}
    <Flask cx={cx} base={base} h={h} w={w} level={level} fill={fill} line={line}>
      {cloud > 0 && <Specks cx={cx} base={base} n={Math.round(cloud * 30)} depth={level} spread={w - 30} />}
    </Flask>
    {over}
  </g>
}
/** What you see looking down through the flask: the cross, hidden more as `cloud` rises. */
function TopView({ cx, cy, r = 34, cloud }: { cx: number; cy: number; r?: number; cloud: number }) {
  const clip = useId().replace(/:/g, '')
  const a = r * .55
  return <g>
    <defs><clipPath id={clip}><circle cx={cx} cy={cy} r={r} /></clipPath></defs>
    <circle cx={cx} cy={cy} r={r} fill={paper} />
    <path d={`M${cx - a} ${cy - a}L${cx + a} ${cy + a}M${cx + a} ${cy - a}L${cx - a} ${cy + a}`} stroke={ink} strokeWidth="6" />
    <g clipPath={`url(#${clip})`}>
      <circle cx={cx} cy={cy} r={r} fill={cloud > .25 ? yellow : L.sol} opacity={cloud > .25 ? Math.min(1, cloud) : .2} />
      {cloud > .25 && Array.from({ length: Math.round(cloud * 18) }, (_, i) => { const a = i * 2.39996, d = r * .9 * Math.sqrt((i + .5) / 18); return <circle key={i} cx={Math.round((cx + Math.cos(a) * d) * 10) / 10} cy={Math.round((cy + Math.sin(a) * d) * 10) / 10} r="2" fill={yellowLine} opacity=".8" /> })}
    </g>
    <circle cx={cx} cy={cy} r={r} fill="none" stroke={L.glassLine} strokeWidth="2.6" />
  </g>
}
function Eye({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 22} ${y}Q${x} ${y - 16} ${x + 22} ${y}Q${x} ${y + 16} ${x - 22} ${y}Z`} fill="white" stroke={ink} strokeWidth="2" />
    <circle cx={x} cy={y + 1} r="7" fill="#6c8fb0" stroke={ink} strokeWidth="1.5" /><circle cx={x} cy={y + 1} r="3" fill={ink} />
  </g>
}
function Bubble({ x, y, w, text, tail }: { x: number; y: number; w: number; text: string; tail: Pt }) {
  return <g>
    <path d={`M${x + w * .3} ${y + 40}L${tail[0]} ${tail[1]}L${x + w * .5} ${y + 40}`} fill="white" stroke={ink} strokeWidth="2" />
    <rect x={x} y={y} width={w} height={42} rx="20" fill="white" stroke={ink} strokeWidth="2" />
    <path d={`M${x + w * .3 + 2} ${y + 41}H${x + w * .5 - 2}`} stroke="white" strokeWidth="3" />
    <text x={x + w / 2} y={y + 27} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{text}</text>
  </g>
}

// ---------- Section 1 ----------
function Cloudy() {
  const base = 206
  return <Diagram viewBox="0 0 540 300" title="Two flasks of colourless solution, sodium thiosulfate and hydrochloric acid. When they are mixed, the mixture turns cloudy and pale yellow, because tiny specks of a yellow solid form. This solid is sulfur, a precipitate.">
    <Bench x1={16} x2={524} y={base + 9} />
    <CrossFlask cx={78} base={base} h={116} w={96} level={44} paperOn={false} />
    <text x={148} y={base - 42} textAnchor="middle" fontSize="26" fontWeight="700" fill={muted}>+</text>
    <CrossFlask cx={218} base={base} h={116} w={96} level={44} paperOn={false} />
    <Arrow x1={286} y1={base - 50} x2={344} y2={base - 50} colour={ink} width={3} />
    <CrossFlask cx={430} base={base} h={140} w={122} level={62} cloud={1} paperOn={false} />
    <Tag x={78} y={base + 34} lines={['sodium', 'thiosulfate']} anchor="middle" />
    <Tag x={218} y={base + 34} lines={['hydrochloric', 'acid']} anchor="middle" />
    <text x={148} y={base + 82} textAnchor="middle" fontSize="14" fill={muted}>both colourless</text>
    <Tag x={430} y={base + 34} lines={['yellow solid', '(precipitate)']} anchor="middle" to={[418, base - 22]} colour={L.amberInk} />
  </Diagram>
}

function SetUp({ q = false }: { q?: boolean }) {
  const cx = 160, base = 250, top = base - 140
  return <Diagram viewBox="0 0 540 310" title={q ? 'Side view of an experiment with four numbered parts: a conical flask, the liquid inside it, a mark on paper under the flask, and a stopwatch.' : 'A conical flask of sodium thiosulfate solution stands on a piece of paper with a black cross drawn on it. An eye above the flask looks down through the liquid at the cross. Step 1: sodium thiosulfate in the flask. Step 2: add the acid and start the stopwatch.'}>
    <Bench x1={16} x2={q ? 420 : 330} y={base + 26} />
    <CrossFlask cx={cx} base={base} />
    <Stopwatch x={q ? 330 : 286} y={base - 40} time="0 s" hot={!q} />
    {q ? <g>
      <Pointer n={1} x={60} y={110} to={[143, 136]} />
      <Pointer n={2} x={60} y={214} to={[128, 226]} />
      <Pointer n={3} x={60} y={290} to={[146, 262]} />
      <Pointer n={4} x={400} y={140} to={[344, 196]} />
    </g> : <g>
      <Eye x={cx} y={40} />
      <path d={`M${cx} 58V${top - 8}`} stroke={ink} strokeWidth="2" strokeDasharray="5 5" />
      <path d={`M${cx} ${top - 2}l-6 -11h12z`} fill={ink} />
      <Tag x={cx + 34} y={45} lines={['look from above']} />
      <Tag x={cx + 46} y={302} lines={['black cross on paper']} to={[cx + 22, base + 14]} />
      <Step n={1} x={356} y={92} lines={['Sodium thiosulfate', 'in the flask.']} />
      <Step n={2} x={356} y={156} lines={['Add the acid and', 'start the', 'stopwatch.']} active />
    </g>}
  </Diagram>
}

function Time() {
  const xs = [95, 270, 445], clouds = [0, .5, 1], names = ['start', 'part-way', 'cross gone'], times = ['0 s', '30 s', '60 s'], base = 262
  return <Diagram viewBox="0 0 540 330" title="Three stages of the same flask. At the start the liquid is clear and the cross is easy to see from above. Part-way, the liquid is cloudy and the cross is faint. At the end, the liquid is yellow and the cross can no longer be seen, so the stopwatch is stopped.">
    <text x={16} y={22} fontSize="13" fill={muted}>seen from above:</text>
    {xs.map((x, i) => <g key={x}>
      <TopView cx={x} cy={64} r={32} cloud={clouds[i]} />
      <path d={`M${x} 102v12`} stroke={panelLine} strokeWidth="2" strokeDasharray="3 4" />
      <CrossFlask cx={x} base={base} h={130} w={108} level={50} cloud={clouds[i]} />
      <Stopwatch x={x + 56} y={base - 112} r={19} time={times[i]} hot={i === 2} />
      <text x={x} y={base + 44} textAnchor="middle" fontSize="15" fontWeight="700" fill={i === 2 ? L.amberInk : ink}>{names[i]}</text>
    </g>)}
    <text x={445} y={base + 64} textAnchor="middle" fontSize="14" fontWeight="700" fill={L.amberInk}>stop the stopwatch</text>
  </Diagram>
}

function Subjective() {
  const base = 262
  return <Diagram viewBox="0 0 540 300" title="Two students look at the same flask. The liquid is very cloudy and the cross is very faint. One says 'Gone now!'. The other says 'I can still see it!'. People may disagree about the exact moment.">
    <Person x={62} y={150} facing={1} body={140} />
    <Person x={478} y={150} facing={-1} body={140} jumper="#9fc7a8" />
    <CrossFlask cx={270} base={base} h={130} w={110} level={52} cloud={.85} />
    <TopView cx={270} cy={70} r={34} cloud={.8} />
    <text x={270} y={24} textAnchor="middle" fontSize="13" fill={muted}>seen from above</text>
    <Bubble x={20} y={30} w={140} text="Gone now!" tail={[70, 112]} />
    <Bubble x={354} y={30} w={176} text="I can still see it!" tail={[462, 112]} />
  </Diagram>
}

// ---------- Section 2 ----------
function FairSet() {
  const xs = [95, 270, 445], names = ['low', 'medium', 'high'], base = 196
  return <Diagram viewBox="0 0 540 320" title="Three flasks of sodium thiosulfate, each standing on a cross. A different concentration of acid is added to each: low, medium and high. Change: the acid concentration. Keep the same: the volumes, the temperature and the flask.">
    {xs.map((x, i) => <g key={x}>
      <CrossFlask cx={x} base={base} h={130} w={108} level={48} />
      <text x={x} y={base + 44} textAnchor="middle" fontSize="16" fontWeight="700" fill={L.amberInk}>{names[i]}</text>
    </g>)}
    <rect x={14} y={258} width={250} height={50} rx="14" fill={L.amberSoft} stroke={L.amber} strokeWidth="2.5" />
    <text x={139} y={288} textAnchor="middle" fontSize="15" fontWeight="700" fill={L.amberInk}>change: acid concentration</text>
    <rect x={276} y={258} width={250} height={50} rx="14" fill={L.goodSoft} stroke={L.good} strokeWidth="2" />
    <text x={401} y={279} textAnchor="middle" fontSize="14" fontWeight="700" fill={L.good}>keep the same:</text>
    <text x={401} y={298} textAnchor="middle" fontSize="14" fill={ink}>volumes, temperature, flask</text>
  </Diagram>
}
const BOOK_ROWS = [['Concentration of\nhydrochloric acid\n(g/dm³)', '18', '36', '54', '72', '90'], ['Time for cross\nto disappear (s)', '193', '184', '178', '171', '164']]
const TABLE_TITLE = 'A results table. Concentration of hydrochloric acid in grams per cubic decimetre: 18, 36, 54, 72, 90. Time for the cross to disappear in seconds: 193, 184, 178, 171, 164.'
function Results() {
  return <Diagram viewBox="0 0 540 170" title={TABLE_TITLE}>
    <Table x={20} y={20} cols={[200, 60, 60, 60, 60, 60]} rowH={64} head="col" rows={BOOK_ROWS} size={15} />
  </Diagram>
}
function Trend() {
  return <Diagram viewBox="0 0 540 270" title={`${TABLE_TITLE} As the concentration goes up, the time gets shorter. A shorter time means a faster reaction.`}>
    <text x={370} y={24} textAnchor="middle" fontSize="14" fontWeight="700" fill={L.amberInk}>higher concentration</text>
    <Arrow x1={236} y1={38} x2={506} y2={38} colour={L.amber} width={3} />
    <Table x={20} y={54} cols={[200, 60, 60, 60, 60, 60]} rowH={64} head="col" rows={BOOK_ROWS} size={15} />
    <Arrow x1={236} y1={200} x2={506} y2={200} colour={L.good} width={3} />
    <text x={370} y={228} textAnchor="middle" fontSize="14" fontWeight="700" fill={L.good}>shorter time = faster reaction</text>
  </Diagram>
}
function QTable() {
  return <Diagram viewBox="0 0 540 170" title="A results table. Concentration of hydrochloric acid in grams per cubic decimetre: 20, 50, 80. Time for the cross to disappear in seconds: 150, 95, 60.">
    <Table x={40} y={20} cols={[200, 90, 90, 90]} rowH={64} head="col" rows={[['Concentration of\nhydrochloric acid\n(g/dm³)', '20', '50', '80'], ['Time for cross\nto disappear (s)', '150', '95', '60']]} size={16} />
  </Diagram>
}

// ---------- Section 3 ----------
function Same() {
  const items = ['same volume of thiosulfate', 'same volume of acid', 'same temperature', 'same size of flask', 'same cross', 'same lighting']
  return <Diagram viewBox="0 0 540 270" title="A checklist for a fair test: the same volume of sodium thiosulfate, the same volume of acid, the same temperature, the same size of flask, the same cross and the same lighting. Only the acid concentration changes.">
    <rect x={16} y={12} width={508} height={172} rx="16" fill={panelFill} stroke={panelLine} strokeWidth="2" />
    <text x={36} y={42} fontSize="16" fontWeight="700" fill={L.good}>Keep the same</text>
    {items.map((t, i) => {
      const x = i < 3 ? 36 : 290, y = 76 + (i % 3) * 36
      return <g key={t}>
        <circle cx={x + 10} cy={y - 5} r="10" fill={L.goodSoft} stroke={L.good} strokeWidth="2" />
        <path d={`M${x + 5} ${y - 5}l4 4l7 -8`} stroke={L.good} strokeWidth="2.4" fill="none" />
        <text x={x + 28} y={y} fontSize="15" fill={ink}>{t}</text>
      </g>
    })}
    <Pill x={90} y={206} w={360} text="only the acid concentration changes" size={15} />
  </Diagram>
}

function Goggles({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 46} ${y}Q${x - 60} ${y - 4} ${x - 58} ${y + 8}M${x + 46} ${y}Q${x + 60} ${y - 4} ${x + 58} ${y + 8}`} stroke={muted} strokeWidth="4" fill="none" />
    <path d={`M${x - 44} ${y - 14}Q${x - 44} ${y - 20} ${x - 36} ${y - 20}H${x + 36}Q${x + 44} ${y - 20} ${x + 44} ${y - 14}V${y + 10}Q${x + 44} ${y + 18} ${x + 34} ${y + 18}H${x + 12}Q${x + 6} ${y + 18} ${x + 4} ${y + 10}Q${x} ${y + 4} ${x - 4} ${y + 10}Q${x - 6} ${y + 18} ${x - 12} ${y + 18}H${x - 34}Q${x - 44} ${y + 18} ${x - 44} ${y + 10}Z`} fill="#dcecf7" stroke={ink} strokeWidth="2" />
    <path d={`M${x - 34} ${y - 12}q10 -2 16 6`} stroke="white" strokeWidth="3" fill="none" />
  </g>
}
function Safe() {
  const cx = 150, base = 258, top = base - 130
  const curl = (x: number, y: number, s: number) => `M${x} ${y}c${8 * s} -10 ${-6 * s} -18 ${4 * s} -28c${10 * s} -10 ${22 * s} -2 ${30 * s} -10c${8 * s} -8 ${4 * s} -16 ${14 * s} -22`
  return <Diagram viewBox="0 0 540 310" title="A cloudy flask on a bench next to an open window. Wisps of sulfur dioxide gas rise from the flask and drift towards the window. Safety goggles are shown. The experiment should be done in a well-ventilated place.">
    {/* window */}
    <rect x={370} y={24} width={150} height={170} rx="12" fill="#eaf4fb" stroke={L.glassLine} strokeWidth="3" />
    <path d={`M445 24V194M370 109H520`} stroke={L.glassLine} strokeWidth="3" />
    <path d={`M445 28L500 44V124L445 106Z`} fill="white" fillOpacity=".75" stroke={L.glassLine} strokeWidth="2.4" />
    <path d={`M388 60q14 -8 28 0t28 0M384 146q14 -8 28 0t28 0`} stroke={L.waterLine} strokeWidth="2" fill="none" opacity=".6" />
    <Bench x1={16} x2={360} y={base + 26} />
    <CrossFlask cx={cx} base={base} h={130} w={110} level={50} cloud={1} />
    {[[cx - 8, top - 6, 1], [cx + 10, top - 20, 1.1], [cx - 2, top - 44, 1.25]].map(([x, y, s], i) => <path key={i} d={curl(x, y, s)} stroke={so2} strokeWidth="3" fill="none" opacity={.9 - i * .15} />)}
    <path d={`M${cx + 64} ${top - 96}Q290 40 356 70`} stroke={so2} strokeWidth="2.5" fill="none" strokeDasharray="6 6" />
    <path d="M356 70l-12 -2l6 10z" fill={so2} />
    <Tag x={20} y={62} lines={['sulfur dioxide', 'gas']} colour="#5f6b75" />
    <Goggles x={290} y={214} />
    <text x={290} y={254} textAnchor="middle" fontSize="13" fill={muted}>wear goggles</text>
    <Pill x={372} y={214} w={148} text="well-ventilated" tone="good" />
  </Diagram>
}

function Repeat() {
  const xs = [232, 342, 452], times = ['62 s', '60 s', '61 s'], base = 216
  return <Diagram viewBox="0 0 540 310" title="One student judges three repeat runs of the same flask, each time timing with the same stopwatch until the cross has gone. The times are 62, 60 and 61 seconds. The same person judges each time.">
    <Person x={64} y={120} facing={1} body={150} />
    <Stopwatch x={142} y={250} r={22} time="61 s" />
    {xs.map((x, i) => <g key={x}>
      <CrossFlask cx={x} base={base} h={112} w={88} level={44} cloud={1} />
      <text x={x} y={base + 46} textAnchor="middle" fontSize="14" fill={muted}>run {i + 1}</text>
      <text x={x} y={base + 66} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{times[i]}</text>
    </g>)}
    <Pill x={180} y={30} w={320} text="same person judges each time" />
  </Diagram>
}

export function CrossVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'cross-cloudy': return <Cloudy />
    case 'cross-set': return <SetUp q={assessment} />
    case 'cross-time': return <Time />
    case 'cross-subjective': return <Subjective />
    case 'cross-fair': return <FairSet />
    case 'cross-table': return <Results />
    case 'cross-trend': return assessment ? <Results /> : <Trend />
    case 'cross-same': return <Same />
    case 'cross-safe': return <Safe />
    case 'cross-repeat': return <Repeat />
    case 'cross-q-set': return <SetUp q />
    case 'cross-q-table': return <QTable />
    default: return <SetUp q={assessment} />
  }
}
