import { WsDiagram, Tag, Panel, Tick, Cross, Arrow, DataTable, VBracket, Bust, tones, textW, wsPalette as W, ink, muted, r1, faded, type Cell, type Pt } from './WsKit'
import { Lines, GraphAxes, graphScale, type GraphFrame } from './PhysicsKit'
import { Icon, Sun } from './WsMethodVisuals'
import { PlotCross, Grid, range } from './WsPresentVisuals'

/*
 * Working Scientifically Lesson 11: Drawing conclusions. Original, code-native schematics; data invented and friendly.
 * Every focus id here starts with 'wsconclude-' and is routed from CellBiologyVisuals.tsx.
 *
 * One running example: a ball dropped on wood, carpet and sand (mean bounce 62, 41 and 12 cm). The same table, swatches
 * and bars are reused so the frames read as one story. Colours from WsKit: the value to look at soft yellow, the
 * hypothesis yellow with a bulb (as in the scientific-method lesson), good / supports green, bad / goes too far coral.
 */

const BOUNCE: [string, number][] = [['Wood', 62], ['Carpet', 41], ['Sand', 12]]
const TX = 40, TY = 62, COLS = [120, 170], HEAD = 56, ROW = 44
const rowMid = (i: number) => TY + HEAD + ROW * i + ROW / 2

/** The bounce table. `hi` lists the rows (0–2) whose cells are tinted. */
function BounceTable({ hi = [], x = TX, y = TY }: { hi?: number[]; x?: number; y?: number }) {
  const rows: Cell[][] = [['Surface', 'Mean bounce\nheight (cm)'], ...BOUNCE.map(([s, v], i): Cell[] => hi.includes(i) ? [{ t: s, tone: 'mark' }, { t: String(v), tone: 'mark' }] : [s, String(v)])]
  return <DataTable x={x} y={y} cols={COLS} headH={HEAD} rowH={ROW} size={16} rows={rows} />
}

/** A ball dropped onto a floor, with a dashed bounce path. */
function BounceScene({ x, floor, h }: { x: number; floor: number; h: number }) {
  return <g>
    <path d={`M${x - 46} ${floor}H${x + 56}`} stroke={W.woodLine} strokeWidth="3.2" />
    <rect x={x - 46} y={floor} width="102" height="12" rx="3" fill={W.wood} stroke={W.woodLine} strokeWidth="1.6" />
    <path d={`M${x - 30} ${floor - h}V${floor - 16}Q${x - 18} ${floor - h - 4} ${x + 6} ${floor - h * 0.75}`} stroke={muted} strokeWidth="1.8" strokeDasharray="5 5" fill="none" />
    <Arrow from={[x - 30, floor - h + 20]} to={[x - 30, floor - 40]} colour={muted} width={1.8} />
    <circle cx={x + 10} cy={r1(floor - h * 0.75 + 12)} r="13" fill="#f6c9a0" stroke="#b0601c" strokeWidth="2" />
    <path d={`M${x + 1} ${r1(floor - h * 0.75 + 6)}Q${x + 10} ${r1(floor - h * 0.75 + 14)} ${x + 19} ${r1(floor - h * 0.75 + 6)}`} stroke="#b0601c" strokeWidth="1.4" fill="none" />
  </g>
}

/* ---------- Section 2: what can you conclude? ---------- */

function See() {
  return <WsDiagram schematic={false} title="A table of mean bounce height for a ball on three surfaces: wood 62 cm, carpet 41 cm, sand 12 cm. The wood row is highlighted. Conclusion: the ball bounced highest on wood.">
    <BounceTable hi={[0]} />
    <BounceScene x={440} floor={118} h={84} />
    <Lines x={440} y={146} anchor="middle" lines={['same drop height']} size={12} weight={650} colour={muted} />
    <Panel x={356} y={176} w={170} h={86} tone="mark" strong>
      <text x={441} y={200} textAnchor="middle" fontSize="14" fontWeight="800" fill={tones.mark.text}>Conclusion</text>
      <Lines x={441} y={222} anchor="middle" lines={['the ball bounced', 'highest on wood']} size={14} weight={650} colour={ink} />
    </Panel>
    <Arrow from={[352, 196]} to={[334, rowMid(0) + 4]} colour={tones.mark.line} width={2.2} bend={-0.2} />
    <text x={40} y={34} fontSize="14" fontWeight="700" fill={muted}>look at the data, then say what it shows</text>
  </WsDiagram>
}

function Bubble({ x, y, text }: { x: number; y: number; text: string }) {
  const w = r1(text.length * 14 * 0.56 + 58)
  return <g>
    <rect x={x - w / 2} y={y - 22} width={w} height={44} rx="22" fill="white" stroke={tones.bad.line} strokeWidth="1.8" strokeDasharray="5 4" />
    <text x={r1(x - w / 2 + 40)} y={y + 5} fontSize="14" fontWeight="700" fill={tones.bad.text}>{text}</text>
    <Cross x={x - w / 2 + 20} y={y} s={0.8} />
  </g>
}
function Limit() {
  return <WsDiagram schematic={false} title="The bounce table sits inside a dotted boundary labelled stay inside the data. Outside it, two crossed-out questions: other balls? and other surfaces?">
    <g opacity={faded + 0.3}><BounceTable /></g>
    <rect x={TX - 16} y={TY - 16} width={COLS[0] + COLS[1] + 32} height={HEAD + 3 * ROW + 32} rx="22" fill="none" stroke={tones.good.line} strokeWidth="2.6" strokeDasharray="8 6" />
    <Tag x={TX + 145} y={TY - 20} text="stay inside the data" tone="good" size={14} strong />
    <Bubble x={448} y={110} text="other balls?" />
    <Bubble x={448} y={190} text="other surfaces?" />
    <Lines x={452} y={244} anchor="middle" lines={['not tested, so no', 'conclusion about them']} size={13} weight={650} colour={muted} />
    <text x={40} y={286} fontSize="13" fontWeight="650" fill={muted}>one ball, three surfaces</text>
  </WsDiagram>
}

function Justify() {
  const yTop = rowMid(0), yBot = rowMid(1), bx = TX + COLS[0] + COLS[1] + 16
  return <WsDiagram schematic={false} title="The bounce table with the wood (62 cm) and carpet (41 cm) rows highlighted. A bracket joins them: 62 − 41 = 21 cm higher on wood.">
    <BounceTable hi={[0, 1]} />
    <VBracket x={bx} y1={yTop - 14} y2={yBot + 14} dir={-1} colour={tones.mark.line} width={2.4} />
    <text x={bx + 20} y={r1((yTop + yBot) / 2 - 4)} fontSize="18" fontWeight="800" fill={ink}>62 − 41 = 21</text>
    <text x={bx + 20} y={r1((yTop + yBot) / 2 + 18)} fontSize="14" fontWeight="700" fill={tones.mark.text}>cm higher on wood</text>
    <Tag x={428} y={244} text="back it up with numbers" tone="mark" size={14} strong />
    <text x={40} y={34} fontSize="14" fontWeight="700" fill={muted}>use the results to justify the conclusion</text>
  </WsDiagram>
}

/* ---------- Section 3: does the data support the hypothesis? ---------- */

type Surface = 'wood' | 'carpet' | 'sand'
const SW: Record<Surface, { fill: string; line: string; name: string }> = {
  wood: { fill: W.wood, line: W.woodLine, name: 'Wood' },
  carpet: { fill: '#d9c9e6', line: '#7d6296', name: 'Carpet' },
  sand: { fill: '#f3e3b5', line: '#b39650', name: 'Sand' },
}
/** A surface swatch centred on x, top at y. */
function Swatch({ kind, x, y, w = 96, h = 34 }: { kind: Surface; x: number; y: number; w?: number; h?: number }) {
  const c = SW[kind], l = x - w / 2
  return <g>
    <rect x={l} y={y} width={w} height={h} rx="8" fill={c.fill} stroke={c.line} strokeWidth="1.8" />
    {kind === 'wood' && [0.3, 0.62].map(k => <path key={k} d={`M${l + 8} ${r1(y + h * k)}Q${l + w * 0.4} ${r1(y + h * k - 5)} ${l + w * 0.6} ${r1(y + h * k + 1)}T${l + w - 8} ${r1(y + h * k)}`} stroke={c.line} strokeWidth="1.2" fill="none" opacity=".7" />)}
    {kind === 'carpet' && Array.from({ length: Math.floor((w - 14) / 12) }, (_, i) => <path key={i} d={`M${l + 10 + i * 12} ${y + h - 5}q3 ${-Math.min(14, h - 9)} 6 0`} stroke={c.line} strokeWidth="1.3" fill="none" />)}
    {kind === 'sand' && Array.from({ length: Math.round(w / 6) }, (_, i) => <circle key={i} cx={r1(l + 9 + (i * 37) % (w - 16))} cy={r1(y + 5 + (i * 7) % (h - 9))} r="1.7" fill={c.line} opacity=".75" />)}
    <text x={x} y={y + h + 20} textAnchor="middle" fontSize="14" fontWeight="750" fill={ink}>{c.name}</text>
  </g>
}
const SX = [150, 270, 390], KINDS: Surface[] = ['wood', 'carpet', 'sand']
function HypoCard({ y = 18 }: { y?: number }) {
  return <g>
    <rect x={70} y={y} width={400} height={48} rx="16" fill={tones.mark.fill} stroke={tones.mark.line} strokeWidth="2" />
    <Icon kind="bulb" x={98} y={y + 24} colour={tones.mark.text} />
    <text x={118} y={y + 20} fontSize="12" fontWeight="800" fill={tones.mark.text}>HYPOTHESIS</text>
    <text x={118} y={y + 38} fontSize="15" fontWeight="700" fill={ink}>harder surfaces give a higher bounce</text>
  </g>
}
function Hypo() {
  return <WsDiagram schematic={false} title="Hypothesis: harder surfaces give a higher bounce. Below, three surfaces in order from hardest to softest: wood, carpet, sand.">
    <HypoCard y={30} />
    {KINDS.map((k, i) => <Swatch key={k} kind={k} x={SX[i]} y={150} />)}
    <Arrow from={[110, 124]} to={[430, 124]} colour={muted} width={2.2} />
    <text x={102} y={116} fontSize="13" fontWeight="700" fill={muted}>hardest</text>
    <text x={438} y={116} textAnchor="end" fontSize="13" fontWeight="700" fill={muted}>softest</text>
    <text x={270} y={250} textAnchor="middle" fontSize="14" fontWeight="650" fill={muted}>so the prediction: wood highest, sand lowest</text>
  </WsDiagram>
}
const BASE = 230, UNIT = 1.8
function BarsOnSwatches({ heights, labels }: { heights: number[]; labels: boolean }) {
  return <g>
    {heights.map((v, i) => {
      const h = r1(v * UNIT)
      return <g key={i}>
        <rect x={SX[i] - 26} y={r1(BASE - h)} width="52" height={h} rx="6" fill={tones.measure.fill} stroke={tones.measure.line} strokeWidth="1.8" />
        {labels && <text x={SX[i]} y={r1(BASE - h - 8)} textAnchor="middle" fontSize="15" fontWeight="800" fill={tones.measure.text}>{v} cm</text>}
      </g>
    })}
    <path d={`M${SX[0] - 60} ${BASE}H${SX[2] + 60}`} stroke={ink} strokeWidth="2" />
    {KINDS.map((k, i) => <Swatch key={k} kind={k} x={SX[i]} y={BASE + 4} w={84} h={20} />)}
  </g>
}
function Support({ ok }: { ok: boolean }) {
  return <WsDiagram schematic={false} title={ok
    ? 'Bars of mean bounce height above each surface: wood 62 cm, carpet 41 cm, sand 12 cm. The heights fall from hardest to softest, which matches the hypothesis: the data supports it.'
    : 'Imagined results: bars above wood, carpet and sand where sand has the tallest bar. This does not match the hypothesis: the data does not support it.'}>
    <BarsOnSwatches heights={ok ? BOUNCE.map(b => b[1]) : [24, 35, 58]} labels={ok} />
    {ok ? <Tick x={476} y={96} s={1.3} /> : <Cross x={476} y={96} s={1.3} />}
    <Lines x={476} y={134} anchor="middle" lines={ok ? ['matches the', 'hypothesis'] : ['does not', 'match']} size={14} colour={ok ? tones.good.text : tones.bad.text} />
    <Lines x={476} y={180} anchor="middle" lines={ok ? ['the data', 'supports it'] : ['the data does', 'not support it']} size={13} weight={650} colour={muted} />
    {!ok && <Tag x={270} y={28} text="imagine the results were…" tone="plain" size={13} />}
    {ok && <Tag x={270} y={28} text="harder surface, higher bounce?" tone="mark" size={13} />}
  </WsDiagram>
}

/* ---------- Section 4: correlation and cause ---------- */

const RISE: Pt[] = [[1.2, 2.0], [2.1, 2.4], [3.0, 3.8], [3.9, 3.5], [4.8, 5.3], [5.7, 5.0], [6.6, 6.7], [7.6, 7.2], [8.5, 8.4]]
function Corr() {
  const F: GraphFrame = { x: 70, y: 50, width: 260, height: 190, xMax: 10, yMax: 10 }, s = graphScale(F)
  return <WsDiagram schematic={false} title="A scatter graph of variable 2 against variable 1. The crosses rise from left to right with a faint trend line: the two variables change together. This is a correlation, but it does not show a cause.">
    <GraphAxes frame={F} xLabel="variable 1" yLabel="variable 2" origin={false} />
    <path d={s.path([[0.8, 1.6], [9.2, 9.0]])} stroke={tones.good.line} strokeWidth="6" opacity=".25" fill="none" />
    {RISE.map(([x, y], i) => <PlotCross key={i} x={s.x(x)} y={s.y(y)} />)}
    <Tag x={440} y={84} text="correlation" tone="good" size={15} strong />
    <Lines x={440} y={118} anchor="middle" lines={['they change', 'together']} size={14} weight={650} colour={muted} />
    <circle cx={440} cy={196} r="22" fill="white" stroke={tones.bad.line} strokeWidth="2" strokeDasharray="5 4" />
    <text x={440} y={204} textAnchor="middle" fontSize="22" fontWeight="800" fill={tones.bad.text}>?</text>
    <text x={440} y={242} textAnchor="middle" fontSize="14" fontWeight="750" fill={tones.bad.text}>a cause?</text>
  </WsDiagram>
}

function Die({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s}) rotate(-10)`}>
    <rect x="-16" y="-16" width="32" height="32" rx="7" fill="white" stroke={ink} strokeWidth="2" />
    {[[-7, -7], [7, 7], [0, 0], [7, -7], [-7, 7]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r="2.8" fill={ink} />)}
  </g>
}
function MiniScatter({ x, pts, label, sub, tone }: { x: number; pts: Pt[]; label: string; sub: string; tone: 'bad' | 'plain' }) {
  const F: GraphFrame = { x, y: 70, width: 180, height: 130, xMax: 10, yMax: 10 }, s = graphScale(F)
  return <g>
    <path d={`M${x} ${F.y - 8}V${F.y + F.height}H${x + F.width + 8}`} stroke={ink} strokeWidth="2" fill="none" />
    {pts.map(([a, b], i) => <PlotCross key={i} x={s.x(a)} y={s.y(b)} size={5} />)}
    <Tag x={x + 90} y={36} text={label} tone={tone} size={14} strong={tone === 'bad'} />
    <text x={x + 90} y={228} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>{sub}</text>
  </g>
}
function Chance() {
  const weak: Pt[] = [[1, 3], [2, 5], [3, 3.5], [4, 6], [5, 4.5], [6, 7], [7, 5.5], [8, 7.5], [9, 6.5]]
  const none: Pt[] = [[1, 6], [2, 3], [3, 7.5], [4, 4.5], [5, 2.5], [6, 6.5], [7, 3.5], [8, 7], [9, 4]]
  return <WsDiagram schematic={false} title="Two small scatter graphs. Study 1 shows a weak rising pattern. When the study is repeated, study 2 shows no pattern at all. A die shows the first result was down to chance.">
    <MiniScatter x={50} pts={weak} label="study 1" sub="a weak link?" tone="bad" />
    <MiniScatter x={310} pts={none} label="repeat study" sub="no link" tone="plain" />
    <Arrow from={[244, 136]} to={[296, 136]} colour={muted} width={2.4} />
    <Die x={270} y={96} s={0.9} />
    <text x={270} y={276} textAnchor="middle" fontSize="15" fontWeight="750" fill={tones.bad.text}>chance: it does not repeat</text>
  </WsDiagram>
}

function IceCream({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-14 -8L0 30L14 -8Z" fill="#ecc68f" stroke="#a9773a" strokeWidth="2" />
    <path d="M-9 0L4 -6M-6 9L8 3M-3 18L6 14" stroke="#a9773a" strokeWidth="1.1" opacity=".7" />
    <path d="M-17 -8C-20 -22 -8 -30 0 -27C8 -32 21 -22 17 -8Z" fill="#f7d0dc" stroke="#c0758c" strokeWidth="2" />
  </g>
}
function Third() {
  const L: Pt = [120, 212], R: Pt = [420, 212], T: Pt = [270, 64]
  return <WsDiagram schematic={false} title="A triangle. Sunny weather at the top, with arrows down to ice cream sales and to sunburn cases at the bottom corners. A dotted line with a question mark joins ice cream sales and sunburn cases: ice cream does not cause sunburn.">
    <Sun x={T[0]} y={T[1] - 10} r={18} />
    <Tag x={T[0]} y={T[1] + 34} text="sunny weather" tone="mark" size={14} strong />
    <Arrow from={[T[0] - 40, T[1] + 50]} to={[L[0] + 36, L[1] - 48]} colour={tones.mark.line} width={3} />
    <Arrow from={[T[0] + 40, T[1] + 50]} to={[R[0] - 36, R[1] - 48]} colour={tones.mark.line} width={3} />
    <IceCream x={L[0]} y={L[1] - 22} />
    <Tag x={L[0]} y={L[1] + 30} text="ice cream sales" tone="plain" size={14} />
    <Bust x={R[0]} y={R[1] + 6} s={0.9} kind={1} />
    <circle cx={R[0]} cy={r1(R[1] + 6 - 41 * 0.9)} r="11" fill="#ef8f7e" opacity=".45" />
    <path d={`M${R[0] - 22} ${R[1] - 20}l-7 -4M${R[0] + 22} ${R[1] - 20}l7 -4M${R[0] - 20} ${R[1] - 40}l-8 0M${R[0] + 20} ${R[1] - 40}l8 0`} stroke="#e07a68" strokeWidth="2" />
    <Tag x={R[0]} y={R[1] + 30} text="sunburn cases" tone="plain" size={14} />
    <path d={`M${L[0] + 80} ${L[1] - 6}H${R[0] - 80}`} stroke={tones.bad.line} strokeWidth="2.4" strokeDasharray="6 6" />
    <circle cx={270} cy={L[1] - 6} r="15" fill="white" stroke={tones.bad.line} strokeWidth="2" />
    <text x={270} y={L[1]} textAnchor="middle" fontSize="17" fontWeight="800" fill={tones.bad.text}>?</text>
    <text x={270} y={L[1] + 30} textAnchor="middle" fontSize="13" fontWeight="700" fill={tones.bad.text}>not a cause</text>
    <text x={270} y={286} textAnchor="middle" fontSize="14" fontWeight="650" fill={muted}>a third variable is linked to both</text>
  </WsDiagram>
}

/** A dial turned towards `level` (0–1). */
function Dial({ x, y, level, tone }: { x: number; y: number; level: number; tone: 'change' | 'measure' }) {
  const c = tones[tone], a = Math.PI * (1 - level), r = 34
  return <g>
    <path d={`M${x - r - 8} ${y}A${r + 8} ${r + 8} 0 0 1 ${x + r + 8} ${y}Z`} fill={c.fill} stroke={c.line} strokeWidth="2" />
    {Array.from({ length: 6 }, (_, i) => { const t = Math.PI * (1 - i / 5); return <path key={i} d={`M${r1(x + Math.cos(t) * (r - 4))} ${r1(y - Math.sin(t) * (r - 4))}L${r1(x + Math.cos(t) * r)} ${r1(y - Math.sin(t) * r)}`} stroke={c.line} strokeWidth="1.6" /> })}
    <path d={`M${x} ${y}L${r1(x + Math.cos(a) * (r - 8))} ${r1(y - Math.sin(a) * (r - 8))}`} stroke={ink} strokeWidth="3" />
    <circle cx={x} cy={y} r="4" fill={ink} />
  </g>
}
function Cause() {
  return <WsDiagram schematic={false} title="A fair test. The voltage dial is turned up and the current meter reading rises. An arrow goes from voltage to current. Everything else is kept the same: the same wire, the same length and the same temperature. Because it was controlled, the voltage is the cause.">
    <Dial x={130} y={112} level={0.8} tone="change" />
    <Tag x={130} y={140} text="voltage up" tone="change" size={14} strong />
    <Dial x={410} y={112} level={0.75} tone="measure" />
    <Tag x={410} y={140} text="current up" tone="measure" size={14} strong />
    <Arrow from={[196, 96]} to={[344, 96]} colour={ink} width={3.2} />
    <text x={270} y={84} textAnchor="middle" fontSize="14" fontWeight="800" fill={ink}>causes</text>
    <Panel x={60} y={176} w={420} h={64} tone="keep">
      <text x={270} y={198} textAnchor="middle" fontSize="13" fontWeight="800" fill={tones.keep.text}>everything else kept the same</text>
      {([['same wire', 138], ['same length', 262], ['same temperature', 400]] as const).map(([t, x]) => <Tag key={t} x={x} y={222} text={t} tone="plain" size={12} w={textW(t, 12) + 34} />)}
    </Panel>
    <text x={270} y={272} textAnchor="middle" fontSize="15" fontWeight="750" fill={tones.good.text}>controlled, so it is the cause</text>
  </WsDiagram>
}

/* ---------- Question visuals (assessment view: no highlighting, no conclusions) ---------- */

function Ramp({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x} ${y}L${x + 130} ${y}L${x} ${y - 70}Z`} fill={W.wood} stroke={W.woodLine} strokeWidth="2" />
    <g transform={`rotate(28.3 ${x + 34} ${y - 52})`}>
      <rect x={x + 16} y={y - 70} width="40" height="16" rx="4" fill="#9cc3d9" stroke="#3f7a9c" strokeWidth="1.8" />
      <circle cx={x + 25} cy={y - 51} r="4.5" fill="white" stroke="#3f7a9c" strokeWidth="1.6" />
      <circle cx={x + 47} cy={y - 51} r="4.5" fill="white" stroke="#3f7a9c" strokeWidth="1.6" />
    </g>
  </g>
}
function QTable() {
  return <WsDiagram schematic={false} title="A table of the time for a trolley to roll down a ramp covered with three surfaces: smooth 1.8 s, cloth 2.6 s, sandpaper 3.4 s.">
    <DataTable x={40} y={62} cols={[140, 170]} headH={56} rowH={46} size={16}
      rows={[['Surface', 'Time to roll down\nramp (s)'], ['Smooth', '1.8'], ['Cloth', '2.6'], ['Sandpaper', '3.4']]} />
    <Ramp x={380} y={220} />
    <path d="M370 220H530" stroke={W.panelLine} strokeWidth="3" />
  </WsDiagram>
}
function QScatter() {
  const F: GraphFrame = { x: 90, y: 46, width: 380, height: 200, xMin: 0, xMax: 7, yMax: 110 }, s = graphScale(F)
  const pts: Pt[] = [[1, 22], [1.5, 30], [2, 28], [2.5, 41], [3, 46], [3.5, 44], [4, 58], [4.5, 63], [5, 70], [6, 78]]
  return <WsDiagram schematic={false} title="A scatter graph of reading score against shoe size for a group of children, with ten crosses.">
    <Grid frame={F} xs={range(1, 6, 1)} ys={range(20, 100, 20)} />
    <GraphAxes frame={F} xLabel="Shoe size" yLabel="Reading score" xTicks={range(1, 6, 1)} yTicks={range(20, 100, 20)} />
    {pts.map(([x, y], i) => <PlotCross key={i} x={s.x(x)} y={s.y(y)} />)}
  </WsDiagram>
}

export function WsConcludeVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'wsconclude-see': return <See />
    case 'wsconclude-limit': return <Limit />
    case 'wsconclude-justify': return <Justify />
    case 'wsconclude-hypo': return <Hypo />
    case 'wsconclude-support': return <Support ok />
    case 'wsconclude-notsupport': return <Support ok={false} />
    case 'wsconclude-corr': return <Corr />
    case 'wsconclude-chance': return <Chance />
    case 'wsconclude-third': return <Third />
    case 'wsconclude-cause': return <Cause />
    case 'wsconclude-q-table': return <QTable />
    case 'wsconclude-q-scatter': return <QScatter />
    default: return null
  }
}
