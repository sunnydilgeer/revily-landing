import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Higher-only diagrams for Chemistry Lesson 35 (AQA 8464 5.6.1.1 HT: rate at a particular time from the gradient of a
 * tangent). Original, code-native schematics; not to scale. Focus ids start with 'hrate-'.
 *
 * Same look as the Foundation rate graphs (RateGraphVisuals.tsx): graph paper, ink crosses, an electron-blue curve
 * drawn as the same monotone cubic, amber chips for values being read. Teaching frames reuse the lesson's graph A
 * (0, 14, 22, 27, 29, 30, 30 cm³ every 10 s) so students meet a familiar curve; the y-axis is taller so the tangent fits.
 * New here: the tangent (amber), the ruler, and the gradient triangle (teal). With this curve, the slope at a data point
 * equals (next value − previous value) ÷ 20 s, so every tangent below touches the drawn curve exactly:
 * graph A at 20 s → 0.65 cm³/s, worked mass graph at 20 s → 0.10 g/s, question graph at 10 s → 1.5 cm³/s.
 * The question view shows the tangent and two dots on it, but no values and no triangle.
 */
const { ink, muted, electronLine, panelFill, panelLine, lightIso, darkIso, darkIsoLine } = atomPalette
const amber = '#d98a1c', amberInk = '#8a5a14', amberSoft = '#fdf0d8'
const teal = '#5aa6a0', tealInk = '#2f6f6a'
const gridMinor = '#e6eef4', gridMajor = '#cddbe6', paper = '#fbfdfe'
const ruler = '#f4e6c4', rulerLine = '#b99a55'

type Series = readonly number[]
const TIMES = [0, 10, 20, 30, 40, 50, 60] as const
const A: Series = [0, 14, 22, 27, 29, 30, 30]
const M: Series = [0, 1.8, 3.0, 3.8, 4.3, 4.5, 4.5]
const E: Series = [0, 20, 30, 36, 39, 40, 40]

function Diagram({ title, children, h = 360 }: { title: string; children: ReactNode; h?: number }) {
  const id = useId()
  return <div className="science-bio-model"><svg viewBox={`0 0 600 ${h}`} role="img" aria-labelledby={id}><title id={id}>{`${title} Original schematic, not to scale.`}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function T({ x, y, children, size = 14, bold = false, colour = ink, anchor = 'middle' }: { x: number; y: number; children: ReactNode; size?: number; bold?: boolean; colour?: string; anchor?: 'start' | 'middle' | 'end' }) {
  return <text x={x} y={y} fontSize={size} fontWeight={bold ? 700 : 400} fill={colour} textAnchor={anchor}>{children}</text>
}

// ---------- Monotone cubic, as in RateGraphVisuals.tsx ----------
function slopes(ys: Series) {
  const h = 10, d = ys.slice(1).map((y, i) => (y - ys[i]) / h)
  const m = ys.map((_, i) => i === 0 ? (d.length > 1 && d[0] > 0 ? Math.min(3 * d[0], Math.max(d[0], (3 * d[0] - (d[0] + d[1]) / 2) / 2)) : d[0]) : i === ys.length - 1 ? d[d.length - 1] : (d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2))
  for (let i = 0; i < d.length; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b
    if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i] }
  }
  return m
}

interface Box { x: number; y: number; w: number; h: number; yMax: number; major: number; minor: number; label: string; unit: string }
const scale = (b: Box) => ({ sx: (t: number) => b.x + (t / 60) * b.w, sy: (v: number) => b.y + b.h - (v / b.yMax) * b.h })
const fmt = (b: Box, v: number) => b.major < 1 || b.yMax <= 10 ? (Number.isInteger(v) ? `${v}` : v.toFixed(1)) : `${v}`

function curvePath(b: Box, ys: Series) {
  const { sx, sy } = scale(b), m = slopes(ys), h = 10
  let d = `M${sx(0)} ${sy(ys[0])}`
  for (let i = 0; i < ys.length - 1; i++) {
    const t0 = TIMES[i], t1 = TIMES[i + 1]
    d += `C${sx(t0 + h / 3).toFixed(1)} ${sy(ys[i] + m[i] * h / 3).toFixed(1)} ${sx(t1 - h / 3).toFixed(1)} ${sy(ys[i + 1] - m[i + 1] * h / 3).toFixed(1)} ${sx(t1).toFixed(1)} ${sy(ys[i + 1]).toFixed(1)}`
  }
  return d
}

const BOX: Box = { x: 120, y: 24, w: 430, h: 260, yMax: 40, major: 5, minor: 1, label: 'Volume of gas (cm³)', unit: 'cm³' }
const BOX_M: Box = { ...BOX, yMax: 6, major: 1, minor: 0.2, label: 'Mass of product (g)', unit: 'g' }

function Axes({ b, xHide = [], yHide = [] }: { b: Box; xHide?: number[]; yHide?: number[] }) {
  const { sx, sy } = scale(b)
  const nMinor = Math.round(b.yMax / b.minor), per = Math.round(b.major / b.minor), nMajor = Math.round(b.yMax / b.major)
  return <g>
    <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={paper} />
    {Array.from({ length: 13 }, (_, i) => i * 5).filter(t => t % 10).map(t => <path key={`vx${t}`} d={`M${sx(t)} ${b.y}V${b.y + b.h}`} stroke={gridMinor} strokeWidth="1" />)}
    {Array.from({ length: nMinor + 1 }, (_, i) => i).filter(i => i % per).map(i => <path key={`hy${i}`} d={`M${b.x} ${sy(i * b.minor)}H${b.x + b.w}`} stroke={gridMinor} strokeWidth="1" />)}
    {TIMES.slice(1).map(t => <path key={`VX${t}`} d={`M${sx(t)} ${b.y}V${b.y + b.h}`} stroke={gridMajor} strokeWidth="1.3" />)}
    {Array.from({ length: nMajor }, (_, i) => (i + 1) * b.major).map(v => <path key={`HY${v}`} d={`M${b.x} ${sy(v)}H${b.x + b.w}`} stroke={gridMajor} strokeWidth="1.3" />)}
    <path d={`M${b.x} ${b.y - 12}V${b.y + b.h}H${b.x + b.w + 14}`} stroke={ink} strokeWidth="2.5" fill="none" />
    <path d={`M${b.x - 5} ${b.y - 4}L${b.x} ${b.y - 15}L${b.x + 5} ${b.y - 4}Z`} fill={ink} stroke={ink} strokeWidth="1" />
    <path d={`M${b.x + b.w + 6} ${b.y + b.h - 5}L${b.x + b.w + 17} ${b.y + b.h}L${b.x + b.w + 6} ${b.y + b.h + 5}Z`} fill={ink} stroke={ink} strokeWidth="1" />
    <g fontSize="13" fill={ink}>
      {TIMES.filter(t => !xHide.some(h => Math.abs(h - t) < 6)).map(t => <text key={`tx${t}`} x={sx(t)} y={b.y + b.h + 19} textAnchor="middle">{t}</text>)}
      {Array.from({ length: nMajor + 1 }, (_, i) => i * b.major).filter(v => !yHide.some(h => Math.abs(h - v) * b.h / b.yMax < 18)).map(v => <text key={`ty${v}`} x={b.x - 9} y={sy(v) + 4.5} textAnchor="end">{fmt(b, v)}</text>)}
    </g>
    <g fontSize="14" fontWeight="700" fill={ink}>
      <text x={b.x + b.w / 2} y={b.y + b.h + 42} textAnchor="middle">Time (s)</text>
      <text transform={`translate(${b.x - 84} ${b.y + b.h / 2}) rotate(-90)`} textAnchor="middle">{b.label}</text>
    </g>
  </g>
}
function Crosses({ b, ys }: { b: Box; ys: Series }) {
  const { sx, sy } = scale(b), r = 5
  return <g>{ys.map((v, i) => { const x = sx(TIMES[i]), y = sy(v); return <path key={i} d={`M${x - r} ${y - r}L${x + r} ${y + r}M${x - r} ${y + r}L${x + r} ${y - r}`} stroke={ink} strokeWidth="2.2" /> })}</g>
}
function Graph({ b, ys, xHide, yHide, children }: { b: Box; ys: Series; xHide?: number[]; yHide?: number[]; children?: ReactNode }) {
  return <g><Axes b={b} xHide={xHide} yHide={yHide} /><path d={curvePath(b, ys)} stroke={electronLine} strokeWidth="3.5" fill="none" />{children}<Crosses b={b} ys={ys} /></g>
}
function Guide({ b, t, v, colour = amber }: { b: Box; t: number; v: number; colour?: string }) {
  const { sx, sy } = scale(b)
  return <path d={`M${sx(t)} ${b.y + b.h}V${sy(v)}H${b.x}`} stroke={colour} strokeWidth="2" strokeDasharray="6 5" fill="none" />
}
function YChip({ b, v, text, colour = amber, ink2 = amberInk, fill = amberSoft }: { b: Box; v: number; text: string; colour?: string; ink2?: string; fill?: string }) {
  const { sy } = scale(b), w = text.length * 7.6 + 12
  return <g><rect x={b.x - 6 - w} y={sy(v) - 11} width={w} height={22} rx="11" fill={fill} stroke={colour} strokeWidth="1.8" /><T x={b.x - 6 - w / 2} y={sy(v) + 5} size={13} bold colour={ink2}>{text}</T></g>
}
function XChip({ b, t, text, colour = amber, ink2 = amberInk, fill = amberSoft }: { b: Box; t: number; text: string; colour?: string; ink2?: string; fill?: string }) {
  const { sx } = scale(b), w = text.length * 7.6 + 12, y = b.y + b.h + 14
  return <g><rect x={sx(t) - w / 2} y={y - 11} width={w} height={22} rx="11" fill={fill} stroke={colour} strokeWidth="1.8" /><T x={sx(t)} y={y + 5} size={13} bold colour={ink2}>{text}</T></g>
}
function Dot({ b, t, v, colour = amber }: { b: Box; t: number; v: number; colour?: string }) {
  const { sx, sy } = scale(b)
  return <circle cx={sx(t)} cy={sy(v)} r="6.5" fill={colour} stroke="white" strokeWidth="2.2" />
}
/** The tangent: a straight line through (t0, v0) with the given gradient, drawn from t1 to t2. */
function Tangent({ b, t0, v0, g, t1, t2, faint = false }: { b: Box; t0: number; v0: number; g: number; t1: number; t2: number; faint?: boolean }) {
  const { sx, sy } = scale(b), v = (t: number) => v0 + g * (t - t0)
  return <path d={`M${sx(t1)} ${sy(v(t1))}L${sx(t2)} ${sy(v(t2))}`} stroke={amber} strokeWidth={faint ? 2.5 : 3.2} opacity={faint ? 0.5 : 1} fill="none" />
}
/** Gradient triangle: across from p1, then up to p2, with the change in each labelled. */
function Triangle({ b, t1, v1, t2, v2, dy, dx }: { b: Box; t1: number; v1: number; t2: number; v2: number; dy: string; dx: string }) {
  const { sx, sy } = scale(b), x1 = sx(t1), y1 = sy(v1), x2 = sx(t2), y2 = sy(v2)
  const wy = dy.length * 8 + 14, wx = dx.length * 8 + 14
  return <g>
    <path d={`M${x1} ${y1}H${x2}V${y2}`} stroke={teal} strokeWidth="2.6" strokeDasharray="7 5" fill="none" />
    <rect x={x2 + 8} y={(y1 + y2) / 2 - 12} width={wy} height={24} rx="12" fill="white" stroke={teal} strokeWidth="1.8" />
    <T x={x2 + 8 + wy / 2} y={(y1 + y2) / 2 + 5} size={13.5} bold colour={tealInk}>{dy}</T>
    <rect x={(x1 + x2) / 2 - wx / 2} y={y1 + 6} width={wx} height={24} rx="12" fill="white" stroke={teal} strokeWidth="1.8" />
    <T x={(x1 + x2) / 2} y={y1 + 23} size={13.5} bold colour={tealInk}>{dx}</T>
  </g>
}
function Working({ y, children, x = 120, w = 430 }: { y: number; children: ReactNode; x?: number; w?: number }) {
  return <g><rect x={x} y={y} width={w} height={44} rx="14" fill={panelFill} stroke={panelLine} strokeWidth="1.5" /><T x={x + w / 2} y={y + 28} size={17} bold>{children}</T></g>
}

// ---------- Teaching graph: graph A, tangent at 20 s ----------
const P = { t: 20, v: 22, g: 0.65 }
const TAN = <Tangent b={BOX} t0={P.t} v0={P.v} g={P.g} t1={0} t2={46} />

function CurveFrame() {
  const { sx, sy } = scale(BOX)
  return <Diagram title="The volume of gas graph from the lesson: crosses and a smooth curve that rises steeply, then levels off at 30 cubic centimetres. A dashed line marks 20 seconds and asks how fast the reaction is at that moment.">
    <Graph b={BOX} ys={A} xHide={[20]}>
      <path d={`M${sx(20)} ${BOX.y + BOX.h}V${BOX.y + 20}`} stroke={amber} strokeWidth="2" strokeDasharray="6 5" />
      <XChip b={BOX} t={20} text="20 s" />
    </Graph>
    <rect x={sx(24)} y={sy(39) - 4} width={226} height={50} rx="14" fill={amberSoft} stroke={amber} strokeWidth="1.8" />
    <T x={sx(24) + 113} y={sy(39) + 16} size={14} bold colour={amberInk}>How fast is it going</T>
    <T x={sx(24) + 113} y={sy(39) + 35} size={14} bold colour={amberInk}>at exactly 20 s?</T>
    <T x={sx(44)} y={sy(18)} size={13} colour={muted}>a mean rate is an average</T>
    <T x={sx(44)} y={sy(18) + 18} size={13} colour={muted}>over a stretch of time</T>
  </Diagram>
}
function PointFrame() {
  const { sx, sy } = scale(BOX)
  return <Diagram title="The same graph. A dashed line goes up from 20 seconds to the curve and across to 22 cubic centimetres. The point on the curve at 20 seconds is marked with an amber dot.">
    <Graph b={BOX} ys={A} xHide={[20]} yHide={[22]}>
      <Guide b={BOX} t={20} v={22} /><XChip b={BOX} t={20} text="20 s" /><YChip b={BOX} v={22} text="22 cm³" />
    </Graph>
    <Dot b={BOX} t={20} v={22} />
    <path d={`M${sx(26)} ${sy(14)}Q${sx(23)} ${sy(17)} ${sx(20.8)} ${sy(20.6)}`} stroke={amber} strokeWidth="1.8" fill="none" />
    <T x={sx(26)} y={sy(14) + 16} size={14} bold colour={amberInk} anchor="start">the point you want</T>
  </Diagram>
}
function Ruler({ b, t0, v0, g }: { b: Box; t0: number; v0: number; g: number }) {
  const { sx, sy } = scale(b), x = sx(t0), y = sy(v0)
  const ang = Math.atan2(sy(v0 + g * 10) - y, sx(t0 + 10) - x) * 180 / Math.PI, L = 300
  return <g transform={`translate(${x} ${y}) rotate(${ang.toFixed(2)})`} opacity="0.92">
    <rect x={-L / 2} y={-30} width={L} height={30} rx="4" fill={ruler} fillOpacity="0.8" stroke={rulerLine} strokeWidth="1.8" />
    {Array.from({ length: 29 }, (_, i) => -L / 2 + 10 + i * 10).map((tx, i) => <path key={i} d={`M${tx} -1V${i % 5 ? -7 : -13}`} stroke={rulerLine} strokeWidth="1.3" />)}
  </g>
}
/** The equal gap between the tangent and the curve, either side of the point. */
function Gap({ b, t, v, lx, ly }: { b: Box; t: number; v: number; lx: number; ly: number }) {
  const { sx, sy } = scale(b)
  const top = sy(P.v + P.g * (t - P.t)), bottom = sy(v)
  return <g>
    <path d={`M${sx(t)} ${top + 1}V${bottom - 1}`} stroke={teal} strokeWidth="3" />
    <path d={`M${sx(t) - 6} ${top}H${sx(t) + 6}M${sx(t) - 6} ${bottom}H${sx(t) + 6}`} stroke={teal} strokeWidth="2.4" />
    <path d={`M${sx(t) + 5} ${(top + bottom) / 2}Q${sx(lx) - 6} ${(top + bottom) / 2} ${sx(lx)} ${sy(ly) - 15}`} stroke={teal} strokeWidth="1.6" fill="none" />
    <rect x={sx(lx) - 40} y={sy(ly) - 15} width={80} height={24} rx="12" fill="white" stroke={teal} strokeWidth="1.8" />
    <T x={sx(lx)} y={sy(ly) + 2} size={13} bold colour={tealInk}>same gap</T>
  </g>
}
function TangentFrame() {
  const { sx, sy } = scale(BOX)
  return <Diagram title="A ruler laid along the curve so it just touches at the 20 second point. The gap between the ruler and the curve is the same on both sides. A straight amber line drawn along the ruler is the tangent.">
    <Graph b={BOX} ys={A}>
      <Ruler b={BOX} t0={P.t} v0={P.v} g={P.g} />
      {TAN}
      <Gap b={BOX} t={10} v={14} lx={17} ly={8} /><Gap b={BOX} t={30} v={27} lx={35} ly={21} />
    </Graph>
    <Dot b={BOX} t={20} v={22} />
    <T x={sx(47)} y={sy(37) - 4} size={14} bold colour={amberInk} anchor="start">tangent</T>
    <T x={sx(50)} y={sy(12)} size={13} colour={muted}>touches the curve</T>
    <T x={sx(50)} y={sy(12) + 18} size={13} colour={muted}>at one point</T>
  </Diagram>
}
function GradientFrame() {
  return <Diagram title="The tangent with two easy points picked on it: 0 seconds, 9 cubic centimetres and 40 seconds, 35 cubic centimetres. A dashed teal triangle shows the change in y, 26 cubic centimetres, and the change in x, 40 seconds. Working: 26 divided by 40 equals 0.65 cubic centimetres per second." h={412}>
    <Graph b={BOX} ys={A} yHide={[9, 35]}>
      {TAN}
      <Triangle b={BOX} t1={0} v1={9} t2={40} v2={35} dy="change in y = 26 cm³" dx="change in x = 40 s" />
      <YChip b={BOX} v={9} text="9" /><YChip b={BOX} v={35} text="35" />
    </Graph>
    <Dot b={BOX} t={0} v={9} /><Dot b={BOX} t={40} v={35} />
    <Working y={356}>gradient = 26 ÷ 40 = 0.65 cm³/s</Working>
  </Diagram>
}
function AllFrame() {
  const { sx, sy } = scale(BOX)
  const units: [string, string][] = [['g/s', 'mass'], ['cm³/s', 'gas volume'], ['mol/s', 'moles']]
  return <Diagram title="Put it together: the tangent at 20 seconds and its gradient triangle. Rate at 20 seconds equals the gradient of the tangent, 0.65 cubic centimetres per second. The unit is the y-axis unit per second: grams per second for a mass, cubic centimetres per second for a gas volume, moles per second for an amount in moles." h={470}>
    <Graph b={BOX} ys={A} yHide={[9, 35]}>
      {TAN}
      <Triangle b={BOX} t1={0} v1={9} t2={40} v2={35} dy="26 cm³" dx="40 s" />
      <YChip b={BOX} v={9} text="9" /><YChip b={BOX} v={35} text="35" />
    </Graph>
    <Dot b={BOX} t={0} v={9} /><Dot b={BOX} t={40} v={35} /><Dot b={BOX} t={20} v={22} colour={electronLine} />
    <T x={sx(20) + 10} y={sy(22) + 24} size={13} bold colour={electronLine} anchor="start">the point at 20 s</T>
    <rect x={20} y={354} width={560} height={46} rx="14" fill={amberSoft} stroke={amber} strokeWidth="1.8" />
    <T x={300} y={383} size={17} bold colour={amberInk}>rate at 20 s = gradient of tangent = 0.65 cm³/s</T>
    {units.map(([u, what], i) => {
      const x = 20 + i * 190
      return <g key={u}><rect x={x} y={412} width={180} height={44} rx="22" fill={lightIso} stroke={darkIso} strokeWidth="1.8" />
        <T x={x + 20} y={440} size={16} bold colour={darkIsoLine} anchor="start">{u}</T><T x={x + 162} y={439} size={13} colour={muted} anchor="end">{what}</T></g>
    })}
  </Diagram>
}

// ---------- Worked example: mass graph, tangent at 20 s ----------
function Worked() {
  return <Diagram title="A graph of mass of product in grams against time in seconds. A tangent touches the curve at 20 seconds. Two points on it are picked: 0 seconds, 1.0 gram and 40 seconds, 5.0 grams. A teal triangle shows the change in y, 4.0 grams, and the change in x, 40 seconds. Working: 4.0 divided by 40 equals 0.10 grams per second." h={412}>
    <Graph b={BOX_M} ys={M}>
      <Tangent b={BOX_M} t0={20} v0={3.0} g={0.1} t1={0} t2={50} />
      <Triangle b={BOX_M} t1={0} v1={1} t2={40} v2={5} dy="5.0 − 1.0 = 4.0 g" dx="40 − 0 = 40 s" />
    </Graph>
    <Dot b={BOX_M} t={0} v={1} /><Dot b={BOX_M} t={40} v={5} /><Dot b={BOX_M} t={20} v={3} colour={electronLine} />
    <Working y={356}>4.0 g ÷ 40 s = 0.10 g/s</Working>
  </Diagram>
}

// ---------- Question: graph E, tangent at 10 s (no values, no triangle) ----------
function QuestionTangent() {
  return <Diagram title="A graph of volume of gas in cubic centimetres against time in seconds. A straight tangent touches the curve at 10 seconds. Two dots are marked on the tangent where it crosses grid lines.">
    <Graph b={BOX} ys={E}>
      <Tangent b={BOX} t0={10} v0={20} g={1.5} t1={0} t2={23} />
    </Graph>
    <Dot b={BOX} t={0} v={5} /><Dot b={BOX} t={20} v={35} />
  </Diagram>
}

export function HigherRateTangentVisual({ focus }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'hrate-curve': return <CurveFrame />
    case 'hrate-point': return <PointFrame />
    case 'hrate-tangent': return <TangentFrame />
    case 'hrate-gradient': return <GradientFrame />
    case 'hrate-all': return <AllFrame />
    case 'hrate-worked': return <Worked />
    case 'hrate-question-tangent': return <QuestionTangent />
    default: return <AllFrame />
  }
}
