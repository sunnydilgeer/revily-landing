import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry Lesson 35: Rate graphs and mean rate. Original, code-native schematics; not to scale.
 * Focus ids start with 'rgraph-'.
 *
 * One graph drawing is reused through the lesson. The line of best fit is a smooth monotone curve through the data,
 * so every value read off it matches the numbers in the lesson text. Colour code: electron-blue = the gas curve,
 * ink = crosses (the data), amber = the value being read, green = the finished part, soft teal = a slower part.
 * Question views show only the graph and any guides the question needs; no values, no finish labels.
 */
const { ink, muted, electronFill, electronLine, panelFill, panelLine, lightIso, darkIso, darkIsoLine } = atomPalette
const amber = '#d98a1c', amberInk = '#8a5a14', amberSoft = '#fdf0d8'
const teal = '#5aa6a0', tealInk = '#2f6f6a'
const gridMinor = '#e6eef4', gridMajor = '#cddbe6', paper = '#fbfdfe'
const glass = '#6f8798', liquid = '#e4eff6'

type Series = readonly number[]
const TIMES = [0, 10, 20, 30, 40, 50, 60] as const
const A: Series = [0, 14, 22, 27, 29, 30, 30]
const B: Series = [0, 10, 16, 19, 20, 20, 20]
const C: Series = [0, 16, 26, 32, 36, 36, 36]

function Diagram({ title, children, h = 340 }: { title: string; children: ReactNode; h?: number }) {
  const id = useId()
  return <div className="science-bio-model"><svg viewBox={`0 0 600 ${h}`} role="img" aria-labelledby={id}><title id={id}>{`${title} Original schematic, not to scale.`}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function T({ x, y, children, size = 14, bold = false, colour = ink, anchor = 'middle' }: { x: number; y: number; children: ReactNode; size?: number; bold?: boolean; colour?: string; anchor?: 'start' | 'middle' | 'end' }) {
  return <text x={x} y={y} fontSize={size} fontWeight={bold ? 700 : 400} fill={colour} textAnchor={anchor}>{children}</text>
}

// ---------- Monotone cubic (Fritsch–Carlson): smooth, never overshoots, flat where the data are flat ----------
function tangents(ys: Series) {
  const h = 10, d = ys.slice(1).map((y, i) => (y - ys[i]) / h)
  const m = ys.map((_, i) => i === 0 ? (d.length > 1 && d[0] > 0 ? Math.min(3 * d[0], Math.max(d[0], (3 * d[0] - (d[0] + d[1]) / 2) / 2)) : d[0]) : i === ys.length - 1 ? d[d.length - 1] : (d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2))
  for (let i = 0; i < d.length; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b
    if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i] }
  }
  return m
}

interface Box { x: number; y: number; w: number; h: number; yMax: number }
const scale = (b: Box) => ({ sx: (t: number) => b.x + (t / 60) * b.w, sy: (v: number) => b.y + b.h - (v / b.yMax) * b.h })

/** Path of the curve between data points i0 and i1 (indices into TIMES). */
function curvePath(b: Box, ys: Series, i0 = 0, i1 = ys.length - 1) {
  const { sx, sy } = scale(b), m = tangents(ys), h = 10
  let d = `M${sx(TIMES[i0]).toFixed(1)} ${sy(ys[i0]).toFixed(1)}`
  for (let i = i0; i < i1; i++) {
    const t0 = TIMES[i], t1 = TIMES[i + 1]
    d += `C${sx(t0 + h / 3).toFixed(1)} ${sy(ys[i] + m[i] * h / 3).toFixed(1)} ${sx(t1 - h / 3).toFixed(1)} ${sy(ys[i + 1] - m[i + 1] * h / 3).toFixed(1)} ${sx(t1).toFixed(1)} ${sy(ys[i + 1]).toFixed(1)}`
  }
  return d
}

// ---------- The graph ----------
const BOX: Box = { x: 120, y: 22, w: 430, h: 240, yMax: 30 }
function Axes({ b, yStep = 5, xHide = [], yHide = [] }: { b: Box; yStep?: number; xHide?: number[]; yHide?: number[] }) {
  const { sx, sy } = scale(b)
  const minorY = b.yMax > 30 ? 2 : 1
  return <g>
    <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={paper} />
    {Array.from({ length: 13 }, (_, i) => i * 5).filter(t => t % 10).map(t => <path key={`vx${t}`} d={`M${sx(t)} ${b.y}V${b.y + b.h}`} stroke={gridMinor} strokeWidth="1" />)}
    {Array.from({ length: b.yMax / minorY + 1 }, (_, i) => i * minorY).filter(v => v % yStep).map(v => <path key={`hy${v}`} d={`M${b.x} ${sy(v)}H${b.x + b.w}`} stroke={gridMinor} strokeWidth="1" />)}
    {TIMES.slice(1).map(t => <path key={`VX${t}`} d={`M${sx(t)} ${b.y}V${b.y + b.h}`} stroke={gridMajor} strokeWidth="1.3" />)}
    {Array.from({ length: b.yMax / yStep }, (_, i) => (i + 1) * yStep).map(v => <path key={`HY${v}`} d={`M${b.x} ${sy(v)}H${b.x + b.w}`} stroke={gridMajor} strokeWidth="1.3" />)}
    <path d={`M${b.x} ${b.y - 12}V${b.y + b.h}H${b.x + b.w + 14}`} stroke={ink} strokeWidth="2.5" fill="none" />
    <path d={`M${b.x - 5} ${b.y - 4}L${b.x} ${b.y - 15}L${b.x + 5} ${b.y - 4}Z`} fill={ink} stroke={ink} strokeWidth="1" />
    <path d={`M${b.x + b.w + 6} ${b.y + b.h - 5}L${b.x + b.w + 17} ${b.y + b.h}L${b.x + b.w + 6} ${b.y + b.h + 5}Z`} fill={ink} stroke={ink} strokeWidth="1" />
    <g fontSize="13" fill={ink}>
      {TIMES.filter(t => !xHide.some(h => Math.abs(h - t) < 6)).map(t => <text key={`tx${t}`} x={sx(t)} y={b.y + b.h + 19} textAnchor="middle">{t}</text>)}
      {Array.from({ length: b.yMax / yStep + 1 }, (_, i) => i * yStep).filter(v => !yHide.some(h => Math.abs(h - v) * b.h / b.yMax < 20)).map(v => <text key={`ty${v}`} x={b.x - 9} y={sy(v) + 4.5} textAnchor="end">{v}</text>)}
    </g>
    <g fontSize="14" fontWeight="700" fill={ink}>
      <text x={b.x + b.w / 2} y={b.y + b.h + 42} textAnchor="middle">Time (s)</text>
      <text transform={`translate(${b.x - 94} ${b.y + b.h / 2}) rotate(-90)`} textAnchor="middle">Volume of gas (cm³)</text>
    </g>
  </g>
}
function Crosses({ b, ys, hi }: { b: Box; ys: Series; hi?: number }) {
  const { sx, sy } = scale(b)
  return <g>{ys.map((v, i) => {
    const x = sx(TIMES[i]), y = sy(v), c = i === hi ? amber : ink, r = i === hi ? 6.5 : 5
    return <path key={i} d={`M${x - r} ${y - r}L${x + r} ${y + r}M${x - r} ${y + r}L${x + r} ${y - r}`} stroke={c} strokeWidth={i === hi ? 3 : 2.2} />
  })}</g>
}
function Curve({ b, ys, colour = electronLine, width = 3.5, opacity = 1, i0, i1 }: { b: Box; ys: Series; colour?: string; width?: number; opacity?: number; i0?: number; i1?: number }) {
  return <path d={curvePath(b, ys, i0, i1)} stroke={colour} strokeWidth={width} fill="none" opacity={opacity} />
}
/** Dashed read-off guide: up from the time to the value, then across to the y-axis. */
function Guide({ b, t, v, colour = amber, up = true, across = true }: { b: Box; t: number; v: number; colour?: string; up?: boolean; across?: boolean }) {
  const { sx, sy } = scale(b)
  return <g stroke={colour} strokeWidth="2" strokeDasharray="6 5" fill="none">
    {up && <path d={`M${sx(t)} ${b.y + b.h}V${sy(v)}`} />}
    {across && <path d={`M${sx(t)} ${sy(v)}H${b.x}`} />}
  </g>
}
/** A value chip on an axis, covering the tick number there. */
function YChip({ b, v, text, colour = amber, ink2 = amberInk, fill = amberSoft }: { b: Box; v: number; text: string; colour?: string; ink2?: string; fill?: string }) {
  const { sy } = scale(b), w = text.length * 7.6 + 12
  return <g><rect x={b.x - 6 - w} y={sy(v) - 11} width={w} height={22} rx="11" fill={fill} stroke={colour} strokeWidth="1.8" /><T x={b.x - 6 - w / 2} y={sy(v) + 5} size={13} bold colour={ink2}>{text}</T></g>
}
function XChip({ b, t, text, colour = amber, ink2 = amberInk, fill = amberSoft }: { b: Box; t: number; text: string; colour?: string; ink2?: string; fill?: string }) {
  const { sx } = scale(b), w = text.length * 7.6 + 12, y = b.y + b.h + 14
  return <g><rect x={sx(t) - w / 2} y={y - 11} width={w} height={22} rx="11" fill={fill} stroke={colour} strokeWidth="1.8" /><T x={sx(t)} y={y + 5} size={13} bold colour={ink2}>{text}</T></g>
}
function Graph({ b = BOX, ys = A, cross = true, curve = true, hi, xHide, yHide, children }: { b?: Box; ys?: Series; cross?: boolean; curve?: boolean; hi?: number; xHide?: number[]; yHide?: number[]; children?: ReactNode }) {
  return <g><Axes b={b} xHide={xHide} yHide={yHide} />{curve && <Curve b={b} ys={ys} />}{children}{cross && <Crosses b={b} ys={ys} hi={hi} />}</g>
}
/** A working panel under the graph. */
function Working({ y, children }: { y: number; children: ReactNode }) {
  return <g><rect x={120} y={y} width={410} height={44} rx="14" fill={panelFill} stroke={panelLine} strokeWidth="1.5" /><T x={325} y={y + 28} size={17} bold>{children}</T></g>
}
function Table({ y, ys, hi }: { y: number; ys: Series; hi?: number }) {
  const x0 = 30, lw = 150, cw = 56, rh = 30
  return <g>
    <rect x={x0} y={y} width={lw + cw * 7} height={rh * 2} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    {hi !== undefined && <rect x={x0 + lw + cw * hi + 3} y={y + 3} width={cw - 6} height={rh * 2 - 6} rx="8" fill={amberSoft} stroke={amber} strokeWidth="1.8" />}
    <path d={`M${x0} ${y + rh}H${x0 + lw + cw * 7}`} stroke={panelLine} strokeWidth="1.2" />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${x0 + lw + cw * i} ${y}V${y + rh * 2}`} stroke={panelLine} strokeWidth="1.2" />)}
    <T x={x0 + 12} y={y + 20} size={13} bold anchor="start">Time (s)</T>
    <T x={x0 + 12} y={y + rh + 20} size={13} bold anchor="start">Volume of gas (cm³)</T>
    {TIMES.map((t, i) => <T key={`t${i}`} x={x0 + lw + cw * i + cw / 2} y={y + 20} size={14} colour={i === hi ? amberInk : ink} bold={i === hi}>{t}</T>)}
    {ys.map((v, i) => <T key={`v${i}`} x={x0 + lw + cw * i + cw / 2} y={y + rh + 20} size={14} colour={i === hi ? amberInk : ink} bold={i === hi}>{v}</T>)}
  </g>
}
const low = (dy: number): Box => ({ ...BOX, y: BOX.y + dy })

// ---------- Section: drawing the graph ----------
function AxesFrame() {
  const b = low(86)
  return <Diagram title="A results table: time 0, 10, 20, 30, 40, 50 and 60 seconds; volume of gas 0, 14, 22, 27, 29, 30 and 30 cubic centimetres. Below it, empty axes: time in seconds along the bottom, volume of gas in cubic centimetres going up." h={424}>
    <Table y={8} ys={A} />
    <Graph b={b} cross={false} curve={false} />
  </Diagram>
}
function PointsFrame() {
  const b = low(86), { sx, sy } = scale(b)
  return <Diagram title="The same table and axes with the seven results plotted as small crosses. The cross at 10 seconds and 14 cubic centimetres is highlighted, with dashed guides to both axes." h={424}>
    <Table y={8} ys={A} hi={1} />
    <Graph b={b} curve={false} hi={1} xHide={[10]} yHide={[14]}><Guide b={b} t={10} v={14} /><XChip b={b} t={10} text="10" /><YChip b={b} v={14} text="14" /></Graph>
    <T x={sx(10) + 14} y={sy(14) + 22} size={13} bold colour={amberInk} anchor="start">one cross for each result</T>
  </Diagram>
}
function CurveFrame() {
  const { sx, sy } = scale(BOX)
  return <Diagram title="The seven crosses with one smooth curve of best fit. It rises steeply, then levels off at 30 cubic centimetres.">
    <Graph />
    <path d={`M${sx(33)} ${sy(27.8) + 6}Q${sx(36)} ${sy(22)} ${sx(38)} ${sy(19)}`} stroke={electronLine} strokeWidth="1.8" fill="none" />
    <T x={sx(38)} y={sy(19) + 18} size={14} bold colour={electronLine}>line of best fit</T>
    <T x={sx(38)} y={sy(19) + 36} size={13} colour={muted}>smooth, not dot-to-dot</T>
  </Diagram>
}
function LinesFrame() {
  const { sx, sy } = scale(BOX), knee = 26
  return <Diagram title="The seven crosses with two straight lines of best fit: a sloping line from the origin for the rising part, and a flat line at 30 cubic centimetres for the flat part. The smooth curve is shown faintly behind as the other way to do it.">
    <Graph curve={false}>
      <Curve b={BOX} ys={A} opacity={0.25} />
      <path d={`M${sx(0)} ${sy(0)}L${sx(knee)} ${sy(30)}`} stroke={darkIso} strokeWidth="3.5" fill="none" />
      <path d={`M${sx(knee)} ${sy(30)}H${sx(60)}`} stroke={darkIso} strokeWidth="3.5" fill="none" />
    </Graph>
    <T x={sx(42)} y={sy(17)} size={14} bold colour={darkIsoLine}>two straight lines</T>
    <T x={sx(42)} y={sy(17) + 18} size={14} bold colour={darkIsoLine}>of best fit</T>
    <T x={sx(42)} y={sy(17) + 38} size={13} colour={muted}>drawn with a ruler</T>
    <T x={sx(42)} y={sy(17) + 56} size={13} colour={muted}>faint line: the curve</T>
  </Diagram>
}

// ---------- Section: reading the graph ----------
function SteepFrame() {
  const { sx, sy } = scale(BOX)
  return <Diagram title="The curve of best fit. The first part, from 0 to 10 seconds, is steep and highlighted amber: the reaction is fast. A later part, from 30 to 40 seconds, is less steep and highlighted teal: the reaction is slower.">
    <Graph>
      <Curve b={BOX} ys={A} i0={0} i1={1} colour={amber} width={7} />
      <Curve b={BOX} ys={A} i0={3} i1={4} colour={teal} width={7} />
    </Graph>
    <T x={sx(11.5)} y={sy(6)} size={14} bold colour={amberInk} anchor="start">steep:</T>
    <T x={sx(11.5)} y={sy(6) + 18} size={14} bold colour={amberInk} anchor="start">fast</T>
    <T x={sx(35)} y={sy(22)} size={14} bold colour={tealInk}>less steep:</T>
    <T x={sx(35)} y={sy(22) + 18} size={14} bold colour={tealInk}>slower</T>
  </Diagram>
}
function FlatPart({ b = BOX, label }: { b?: Box; label: string[] }) {
  const { sx, sy } = scale(b)
  return <g>
    <Curve b={b} ys={A} i0={5} i1={6} colour={darkIso} width={7} />
    <Guide b={b} t={50} v={30} colour={darkIso} across={false} />
    <XChip b={b} t={50} text="50 s" colour={darkIso} ink2={darkIsoLine} fill={lightIso} />
    <path d={`M${sx(55.5)} ${sy(22) - 16}Q${sx(56.5)} ${sy(26)} ${sx(55.5)} ${sy(29.2)}`} stroke={darkIso} strokeWidth="1.8" fill="none" />
    {label.map((l, i) => <T key={i} x={sx(55.5)} y={sy(22) + i * 18} size={14} bold colour={darkIsoLine}>{l}</T>)}
  </g>
}
function FlatFrame() {
  return <Diagram title="The curve of best fit with the flat part, from 50 to 60 seconds, highlighted green. A dashed line goes down from where it first goes flat to 50 seconds. Flat means the reaction has finished.">
    <Graph xHide={[50]}><FlatPart label={['flat:', 'finished']} /></Graph>
  </Diagram>
}
function ValuesFrame() {
  const { sx, sy } = scale(BOX)
  return <Diagram title="Reading a value. A dashed amber line goes up from 20 seconds to the curve, then across to the volume axis at 22 cubic centimetres.">
    <Graph xHide={[20]} yHide={[22]}><Guide b={BOX} t={20} v={22} /><circle cx={sx(20)} cy={sy(22)} r="6" fill={amber} stroke="white" strokeWidth="2" /><XChip b={BOX} t={20} text="20" /><YChip b={BOX} v={22} text="22 cm³" /></Graph>
    <T x={sx(23)} y={sy(8)} size={13} bold colour={amberInk} anchor="start">1 up from 20 s</T>
    <T x={sx(23)} y={sy(8) + 18} size={13} bold colour={amberInk} anchor="start">2 across to the axis</T>
  </Diagram>
}

// ---------- Section: mean rate ----------
function Flask({ x, y, s = 1, bubbles = true }: { x: number; y: number; s?: number; bubbles?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-14 0V34C-14 40 -18 44 -24 52L-46 88C-52 98 -46 108 -34 108H34C46 108 52 98 46 88L24 52C18 44 14 40 14 34V0" fill="white" stroke={glass} strokeWidth="3" />
    <path d="M-35 78H35L45 92C49 99 45 104 36 104H-36C-45 104 -49 99 -45 92Z" fill={liquid} />
    <path d="M-17 -2H17" stroke={glass} strokeWidth="4" />
    {bubbles && [[-12, 90, 4], [8, 86, 3], [0, 64, 3.5], [-4, 40, 3], [4, 18, 3.5], [-2, -14, 3], [6, -30, 2.5]].map(([bx, by, r], i) => <circle key={i} cx={bx} cy={by} r={r} fill={electronFill} fillOpacity="0.25" stroke={electronLine} strokeWidth="1.5" />)}
  </g>
}
function FormulaFrame() {
  return <Diagram title="The rule for mean rate: mean rate equals the amount of product formed, or the amount of reactant used up, divided by the time." h={250}>
    <Flask x={70} y={80} s={0.95} />
    <rect x={140} y={36} width={450} height={170} rx="20" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <T x={224} y={128} size={19} bold>mean rate =</T>
    <T x={452} y={92} size={16} bold colour={electronLine}>amount of product formed</T>
    <T x={452} y={113} size={13} colour={muted}>or amount of reactant used up</T>
    <path d="M330 124H574" stroke={ink} strokeWidth="2.5" />
    <T x={452} y={156} size={17} bold colour={amberInk}>time</T>
  </Diagram>
}
function UnitsFrame() {
  const row = (y: number, a: string, b: string, u: string, c: string) => <g>
    <rect x={16} y={y} width={568} height={62} rx="16" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <T x={36} y={y + 37} size={16} bold anchor="start" colour={c}>{a}</T>
    <T x={244} y={y + 37} size={18} bold>÷</T>
    <T x={266} y={y + 37} size={16} bold anchor="start" colour={amberInk}>{b}</T>
    <path d={`M384 ${y + 31}H440`} stroke={ink} strokeWidth="2.5" /><path d={`M434 ${y + 25}L446 ${y + 31}L434 ${y + 37}Z`} fill={ink} stroke={ink} />
    <rect x={462} y={y + 14} width={104} height={34} rx="17" fill="white" stroke={darkIso} strokeWidth="2" />
    <T x={514} y={y + 37} size={17} bold colour={darkIsoLine}>{u}</T>
  </g>
  return <Diagram title="Units of rate. A mass in grams divided by a time in seconds gives grams per second. A volume of gas in cubic centimetres divided by a time in seconds gives cubic centimetres per second." h={186}>
    {row(20, 'mass in g', 'time in s', 'g/s', ink)}
    {row(100, 'volume of gas in cm³', 'time in s', 'cm³/s', electronLine)}
  </Diagram>
}
function StepsFrame() {
  const steps = [['Find the', 'amount'], ['Find the', 'time'], ['Divide']]
  return <Diagram title="Four steps: 1 find the amount, 2 find the time, 3 divide the amount by the time, 4 write the unit." h={200}>
    {steps.map((s, i) => {
      const x = 14 + i * 146
      return <g key={i}>
        <rect x={x} y={40} width={124} height={84} rx="18" fill={i === 2 ? amberSoft : panelFill} stroke={i === 2 ? amber : panelLine} strokeWidth="1.8" />
        <circle cx={x + 62} cy={40} r="15" fill="white" stroke={ink} strokeWidth="2" /><T x={x + 62} y={45} size={15} bold>{i + 1}</T>
        {s.map((l, j) => <T key={j} x={x + 62} y={(s.length === 1 ? 94 : 84) + j * 20} size={15} bold colour={i === 2 ? amberInk : ink}>{l}</T>)}
        <path d={`M${x + 128} 82H${x + 142}`} stroke={muted} strokeWidth="2.5" />
      </g>
    })}
    <rect x={458} y={52} width={124} height={60} rx="26" fill={lightIso} stroke={darkIso} strokeWidth="1.8" />
    <circle cx={464} cy={54} r="13" fill="white" stroke={ink} strokeWidth="2" /><T x={464} y={59} size={14} bold>4</T>
    <T x={522} y={80} size={14} bold colour={darkIsoLine}>Write</T>
    <T x={522} y={98} size={14} bold colour={darkIsoLine}>the unit</T>
    <T x={300} y={168} size={14} colour={muted}>for example, g/s or cm³/s</T>
  </Diagram>
}
function Clock({ x, y }: { x: number; y: number }) {
  return <g><circle cx={x} cy={y} r="30" fill="white" stroke={glass} strokeWidth="3" /><path d={`M${x} ${y - 36}V${y - 30}M${x - 6} ${y - 38}H${x + 6}`} stroke={glass} strokeWidth="3" /><path d={`M${x} ${y}V${y - 18}M${x} ${y}L${x + 12} ${y + 7}`} stroke={ink} strokeWidth="2.5" /><circle cx={x} cy={y} r="3" fill={ink} /></g>
}
function WorkedMean() {
  return <Diagram title="A flask where 3.6 grams of product formed, and a clock showing 90 seconds. The set-up: mean rate equals 3.6 divided by 90." h={250}>
    <Flask x={100} y={46} s={0.95} bubbles={false} />
    <rect x={22} y={170} width={156} height={30} rx="15" fill={panelFill} stroke={electronLine} strokeWidth="1.8" />
    <T x={100} y={190} size={14} bold colour={electronLine}>3.6 g of product</T>
    <Clock x={260} y={100} />
    <rect x={220} y={170} width={80} height={30} rx="15" fill={amberSoft} stroke={amber} strokeWidth="1.8" />
    <T x={260} y={190} size={14} bold colour={amberInk}>90 s</T>
    <rect x={340} y={72} width={240} height={104} rx="18" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <T x={460} y={112} size={16} bold>mean rate =</T>
    <T x={460} y={146} size={18} bold>3.6 g ÷ 90 s</T>
  </Diagram>
}

// ---------- Section: mean rate from a graph ----------
const PANEL_H = 392
function WholeFinish() {
  return <Diagram title="The graph with the flat part highlighted green and a dashed line down to 50 seconds. The reaction finished at 50 seconds.">
    <Graph xHide={[50]}><FlatPart label={['finished', 'at 50 s']} /></Graph>
  </Diagram>
}
function WholeDivide() {
  return <Diagram title="The graph with dashed guides from where it first goes flat: down to 50 seconds and across to 30 cubic centimetres. Working: 30 cubic centimetres divided by 50 seconds equals 0.60 cubic centimetres per second." h={PANEL_H}>
    <Graph xHide={[50]} yHide={[30]}>
      <Curve b={BOX} ys={A} i0={5} i1={6} colour={darkIso} width={7} />
      <Guide b={BOX} t={50} v={30} colour={amber} />
      <XChip b={BOX} t={50} text="50 s" /><YChip b={BOX} v={30} text="30 cm³" />
    </Graph>
    <Working y={338}>30 cm³ ÷ 50 s = 0.60 cm³/s</Working>
  </Diagram>
}
function Brace({ b, v1, v2, text }: { b: Box; v1: number; v2: number; text: string }) {
  const { sy } = scale(b), x = b.x + 10, y1 = sy(v2), y2 = sy(v1), m = (y1 + y2) / 2
  return <g>
    <path d={`M${x} ${y1}Q${x + 8} ${y1} ${x + 8} ${y1 + 8}V${m - 6}Q${x + 8} ${m} ${x + 14} ${m}Q${x + 8} ${m} ${x + 8} ${m + 6}V${y2 - 8}Q${x + 8} ${y2} ${x} ${y2}`} stroke={teal} strokeWidth="2.5" fill="none" />
    <rect x={x + 18} y={m - 12} width={text.length * 8 + 12} height={24} rx="12" fill="white" stroke={teal} strokeWidth="1.8" />
    <T x={x + 24} y={m + 5} size={14} bold colour={tealInk} anchor="start">{text}</T>
  </g>
}
function XBrace({ b, t1, t2, text }: { b: Box; t1: number; t2: number; text: string }) {
  const { sx } = scale(b), y = b.y + b.h - 10, x1 = sx(t1), x2 = sx(t2), m = (x1 + x2) / 2
  return <g>
    <path d={`M${x1} ${y}Q${x1} ${y - 8} ${x1 + 8} ${y - 8}H${m - 6}Q${m} ${y - 8} ${m} ${y - 14}Q${m} ${y - 8} ${m + 6} ${y - 8}H${x2 - 8}Q${x2} ${y - 8} ${x2} ${y}`} stroke={teal} strokeWidth="2.5" fill="none" />
    <rect x={m - 26} y={y - 42} width={52} height={24} rx="12" fill="white" stroke={teal} strokeWidth="1.8" />
    <T x={m} y={y - 25} size={14} bold colour={tealInk}>{text}</T>
  </g>
}
function BetweenGuides() {
  return <g>
    <Guide b={BOX} t={20} v={22} /><Guide b={BOX} t={40} v={29} />
    <XChip b={BOX} t={20} text="20 s" /><XChip b={BOX} t={40} text="40 s" />
    <YChip b={BOX} v={22} text="22 cm³" /><YChip b={BOX} v={29} text="29 cm³" />
    <Brace b={BOX} v1={22} v2={29} text="7 cm³" />
  </g>
}
function BetweenRead() {
  return <Diagram title="The graph with dashed guides up from 20 seconds to 22 cubic centimetres and from 40 seconds to 29 cubic centimetres. A bracket on the volume axis shows the difference: 29 minus 22 is 7 cubic centimetres.">
    <Graph xHide={[20, 40]} yHide={[22, 29]}><BetweenGuides /></Graph>
  </Diagram>
}
function BetweenDivide() {
  return <Diagram title="The same graph with the 7 cubic centimetre bracket and a 20 second bracket on the time axis. Working: 7 cubic centimetres divided by 20 seconds equals 0.35 cubic centimetres per second." h={PANEL_H}>
    <Graph xHide={[20, 40]} yHide={[22, 29]}><BetweenGuides /><XBrace b={BOX} t1={20} t2={40} text="20 s" /></Graph>
    <Working y={338}>7 cm³ ÷ 20 s = 0.35 cm³/s</Working>
  </Diagram>
}

// ---------- Graph B and C (worked example and questions) ----------
const BOX_B: Box = { ...BOX, yMax: 25 }
const BOX_C: Box = { ...BOX, yMax: 40 }
function WorkedBetween() {
  return <Diagram title="A graph of volume of gas against time for a reaction that levels off at 20 cubic centimetres. Dashed guides go up from 10 seconds and 30 seconds to the curve and across to the volume axis, at 10 and 19 cubic centimetres.">
    <Graph b={BOX_B} ys={B} xHide={[10, 30]} yHide={[10, 19]}>
      <Guide b={BOX_B} t={10} v={10} /><Guide b={BOX_B} t={30} v={19} />
      <XChip b={BOX_B} t={10} text="10 s" /><XChip b={BOX_B} t={30} text="30 s" />
      <YChip b={BOX_B} v={10} text="10 cm³" /><YChip b={BOX_B} v={19} text="19 cm³" />
    </Graph>
  </Diagram>
}
function QuestionRead() {
  return <Diagram title="A graph of volume of gas in cubic centimetres against time in seconds, from 0 to 60 seconds. The crosses and curve rise, then level off.">
    <Graph b={BOX_B} ys={B} />
  </Diagram>
}
function QuestionBetween() {
  return <Diagram title="The same graph of volume of gas against time. Dashed guides go up from 20 seconds and from 40 seconds to the curve, then across to the volume axis.">
    <Graph b={BOX_B} ys={B}><Guide b={BOX_B} t={20} v={16} colour={muted} /><Guide b={BOX_B} t={40} v={20} colour={muted} /></Graph>
  </Diagram>
}
function QuestionWhole() {
  return <Diagram title="A graph of volume of gas in cubic centimetres, from 0 to 40, against time in seconds, from 0 to 60. The crosses and curve rise, then level off.">
    <Graph b={BOX_C} ys={C} />
  </Diagram>
}

export function RateGraphVisual({ focus }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'rgraph-axes': return <AxesFrame />
    case 'rgraph-points': return <PointsFrame />
    case 'rgraph-curve': return <CurveFrame />
    case 'rgraph-lines': return <LinesFrame />
    case 'rgraph-read-steep': return <SteepFrame />
    case 'rgraph-read-flat': return <FlatFrame />
    case 'rgraph-read-values': return <ValuesFrame />
    case 'rgraph-formula': return <FormulaFrame />
    case 'rgraph-units': return <UnitsFrame />
    case 'rgraph-steps': return <StepsFrame />
    case 'rgraph-worked-mean': return <WorkedMean />
    case 'rgraph-whole-finish': return <WholeFinish />
    case 'rgraph-whole-divide': return <WholeDivide />
    case 'rgraph-between-read': return <BetweenRead />
    case 'rgraph-between-divide': return <BetweenDivide />
    case 'rgraph-worked-between': return <WorkedBetween />
    case 'rgraph-question-read': return <QuestionRead />
    case 'rgraph-question-between': return <QuestionBetween />
    case 'rgraph-question-whole': return <QuestionWhole />
    default: return <CurveFrame />
  }
}
