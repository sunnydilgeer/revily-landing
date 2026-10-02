import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, GraphAxes, graphScale, type GraphFrame, type Pt } from './PhysicsKit'
import { ink, muted, r1, Tick, Num } from './EnergyStoreVisuals'
import { motion as M } from './VelocityVisuals'
import { Arrow, Chip } from './GasParticleVisuals'
import { radiation } from './HalfLifeVisuals'
import { mo } from './VtGraphVisuals'

/*
 * Higher-only diagrams for three Physics graph sections (AQA 8464 HT). Original, code-native graphs; values are friendly and exact.
 * Focus ids start with 'hgraph-' and are routed from CellBiologyVisuals.tsx.
 *
 *  - Lesson 36 Half-life (6.4.2.3 HT): net decline as a ratio, final : initial. Same orange-red bars as the Foundation
 *    halving chain (HalfLifeVisuals.tsx), violet for "one half-life". Teaching: 80 → 40 → 20 → 10 counts per second.
 *  - Lesson 45 Distance-time graphs (6.5.4.1.4 HT): speed at one moment = gradient of a tangent. Same axes, speed-green
 *    journey line and blue time / brown distance triangle sides as DtGraphVisuals.tsx; the tangent is amber.
 *    Teaching curve d = 0.25t²: the tangent at 4 s passes (2 s, 0 m) and (10 s, 16 m), so the speed is 2 m/s.
 *    Worked curve d = 5t − 0.25t²: tangent at 4 s through (0 s, 4 m) and (8 s, 28 m), 3 m/s.
 *    Question: d = 0.25t², tangent at 8 s through (4 s, 0 m) and (10 s, 24 m), 4 m/s (no values shown).
 *  - Lesson 46 Velocity-time graphs (6.5.4.1.5 HT): area under the line = distance. Same velocity-green line as
 *    VtGraphVisuals.tsx; areas are shaded in the course's distance brown. Teaching: 0 → 10 m/s in 4 s, then 10 m/s to 10 s:
 *    triangle 20 m + rectangle 60 m = 80 m = 40 squares of 2 m.
 */

const amber = '#d98a1c', amberInk = '#8a5a14', amberSoft = '#fdf0d8'
const timeColour = P.pd, timeFill = P.pdFill
const areaLine = M.distance, triFill = '#fbe2c8', rectFill = '#f3d2b2'
const range = (a: number, b: number, step: number) => Array.from({ length: Math.round((b - a) / step) + 1 }, (_, i) => r1(a + i * step))
const dot = (p: Pt, key?: string | number, colour = ink) => <circle key={key} cx={p[0]} cy={p[1]} r="5.5" fill="white" stroke={colour} strokeWidth="2.6" />
const halo = { stroke: 'white', strokeWidth: 4, paintOrder: 'stroke' as const }
function Panel({ x, y, w, h, children, hot = false }: { x: number; y: number; w: number; h: number; children?: ReactNode; hot?: boolean }) {
  return <g><rect x={x} y={y} width={w} height={h} rx="14" fill={hot ? amberSoft : P.panel} stroke={hot ? amber : P.panelLine} strokeWidth={hot ? 2 : 1.5} />{children}</g>
}
function Answer({ x, y, w, text }: { x: number; y: number; w: number; text: string }) {
  return <g>
    <rect x={x} y={y} width={w} height={40} rx="20" fill="white" stroke={P.useful} strokeWidth="2.2" />
    <Tick x={x + 22} y={y + 20} s={0.8} />
    <text x={x + 40} y={y + 25.5} fontSize="15" fontWeight="800" fill={ink}>{text}</text>
  </g>
}

/* ====================== Lesson 36: net decline as a ratio ====================== */

const RX = [86, 206, 326, 446], RBASE = 168, RMAX = 112
function RatioBars({ values, shown, hot, unit = 'counts per second' }: { values: number[]; shown: number; hot: number; unit?: string }) {
  return <g>
    <text x={20} y={26} fontSize="13" fontWeight="700" fill={muted}>{`count-rate in ${unit}`}</text>
    <path d={`M36 ${RBASE}H506`} stroke={ink} strokeWidth="2" />
    {values.map((v, i) => {
      const h = RMAX * v / values[0], on = i <= shown
      const strong = i === 0 || i === hot
      return <g key={i} opacity={on ? (strong ? 1 : 0.45) : 0.18}>
        <rect x={RX[i] - 30} y={r1(RBASE - h)} width={60} height={r1(h)} rx="10" fill={on ? radiation.fill : 'white'} stroke={radiation.line} strokeWidth="2" strokeDasharray={on ? undefined : '5 5'} />
        <text x={RX[i]} y={r1(RBASE - h - 9)} textAnchor="middle" fontSize="16" fontWeight="800" fill={radiation.line}>{on ? v : '?'}</text>
      </g>
    })}
    {RX.slice(0, 3).map((x, i) => <g key={x} opacity={i < shown ? 1 : 0.25}>
      <Arrow from={[x + 14, 190]} to={[RX[i + 1] - 14, 190]} colour={timeColour} width={2.4} />
      <text x={(x + RX[i + 1]) / 2} y={212} textAnchor="middle" fontSize="12" fontWeight="700" fill={timeColour}>one half-life</text>
    </g>)}
    <text x={RX[0]} y={RBASE - 12} textAnchor="middle" fontSize="13" fontWeight="750" fill={ink}>initial</text>
  </g>
}
/** A ratio card under bar i: "40 : 80" small, "1 : 2" big. */
function RatioCard({ i, top, bottom, hot, faint = false }: { i: number; top: string; bottom: string; hot: boolean; faint?: boolean }) {
  return <g opacity={faint ? 0.5 : 1}>
    <rect x={RX[i] - 52} y={226} width={104} height={56} rx="14" fill={hot ? radiation.soft : 'white'} stroke={radiation.line} strokeWidth={hot ? 2.2 : 1.5} />
    <text x={RX[i]} y={246} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>{top}</text>
    <text x={RX[i]} y={272} textAnchor="middle" fontSize="18" fontWeight="800" fill={radiation.line}>{bottom}</text>
  </g>
}
const TEACH = [80, 40, 20, 10]
function Ratio({ step }: { step: 1 | 2 | 3 | 4 | 5 }) {
  const titles = [
    'A source starts with a count-rate of 80 counts per second. Later bars are not yet known. The net decline compares the final count-rate with the initial one, as a ratio final : initial.',
    'After one half-life the count-rate is 40. Final : initial = 40 : 80, which simplifies to 1 : 2.',
    'After two half-lives the count-rate is 20. Final : initial = 20 : 80, which simplifies to 1 : 4.',
    'After three half-lives the count-rate is 10. Final : initial = 10 : 80, which simplifies to 1 : 8.',
    'The whole pattern: after one, two and three half-lives the ratios are 1 : 2, 1 : 4 and 1 : 8. The second number doubles for each half-life.',
  ]
  const shown = step === 1 ? 0 : Math.min(step - 1, 3)
  const cards: Array<[string, string]> = [['40 : 80', '1 : 2'], ['20 : 80', '1 : 4'], ['10 : 80', '1 : 8']]
  return <PhysicsDiagram schematic={false} title={titles[step - 1]}>
    <RatioBars values={TEACH} shown={step === 5 ? 3 : shown} hot={step === 5 ? -1 : shown} />
    {step === 1 && <g>
      <Panel x={170} y={226} w={330} h={56} hot>
        <text x={335} y={250} textAnchor="middle" fontSize="15" fontWeight="800" fill={amberInk}>net decline = final : initial</text>
        <text x={335} y={271} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>end count-rate first, start second</text>
      </Panel>
    </g>}
    {step > 1 && cards.slice(0, shown).map(([t, b], k) => <RatioCard key={k} i={k + 1} top={t} bottom={b} hot={step === 5 || k + 1 === shown} faint={step < 5 && k + 1 !== shown} />)}
    {step > 1 && step < 5 && <g>
      <rect x={RX[0] - 52} y={226} width={104} height={56} rx="14" fill="white" stroke={P.panelLine} strokeWidth="1.5" />
      <text x={RX[0]} y={248} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{`÷ ${TEACH[shown]}`}</text>
      <text x={RX[0]} y={268} textAnchor="middle" fontSize="12" fontWeight="650" fill={muted}>both sides</text>
    </g>}
    {step === 5 && <g>
      <rect x={RX[0] - 52} y={226} width={104} height={56} rx="14" fill={timeFill} stroke={timeColour} strokeWidth="1.8" />
      <text x={RX[0]} y={248} textAnchor="middle" fontSize="13" fontWeight="800" fill={timeColour}>× 2 each</text>
      <text x={RX[0]} y={268} textAnchor="middle" fontSize="13" fontWeight="800" fill={timeColour}>half-life</text>
    </g>}
  </PhysicsDiagram>
}
function RatioWorked() {
  const v = [120, 60, 30, 15]
  return <PhysicsDiagram schematic={false} title="Worked example: a count-rate of 120 counts per second halves three times, to 60, 30 and then 15. Final : initial = 15 : 120. Dividing both sides by 15 gives 1 : 8.">
    <RatioBars values={v} shown={3} hot={3} />
    <rect x={RX[0] - 52} y={226} width={104} height={56} rx="14" fill="white" stroke={P.panelLine} strokeWidth="1.5" />
    <text x={RX[0]} y={248} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>÷ 15</text>
    <text x={RX[0]} y={268} textAnchor="middle" fontSize="12" fontWeight="650" fill={muted}>both sides</text>
    <rect x={RX[1] - 52} y={226} width={224} height={56} rx="14" fill="white" stroke={P.panelLine} strokeWidth="1.5" />
    <text x={RX[1] + 60} y={248} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>final : initial</text>
    <text x={RX[1] + 60} y={272} textAnchor="middle" fontSize="17" fontWeight="800" fill={ink}>15 : 120</text>
    <RatioCard i={3} top="15 : 120" bottom="1 : 8" hot />
  </PhysicsDiagram>
}

/* ====================== Lesson 45: tangent on a distance-time graph ====================== */

const DF: GraphFrame = { x: 62, y: 40, width: 270, height: 200, xMax: 10, yMax: 28 }
const LINE = M.speed
function DtAxes({ frame = DF }: { frame?: GraphFrame }) {
  return <GraphAxes frame={frame} xLabel="Time" xUnit="s" yLabel="Distance" yUnit="m" xTicks={range(2, frame.xMax, 2)} yTicks={range(4, frame.yMax, 4)} grid />
}
function curve(frame: GraphFrame, f: (t: number) => number, t0: number, t1: number) {
  const s = graphScale(frame)
  return range(0, 48, 1).map(i => { const t = t0 + (t1 - t0) * i / 48; return `${i ? 'L' : 'M'}${s.x(t)} ${s.y(f(t))}` }).join('')
}
/** A ruler lying along the line a → b, on its lower-right side (away from the curve), with small marks along its edge. */
function Ruler({ a, b, w = 18 }: { a: Pt; b: Pt; w?: number }) {
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy), nx = -dy / len * w, ny = dx / len * w
  const ex = dx / len * 14, ey = dy / len * 14
  const p: Pt[] = [[a[0] - ex, a[1] - ey], [b[0] + ex, b[1] + ey], [b[0] + ex + nx, b[1] + ey + ny], [a[0] - ex + nx, a[1] - ey + ny]]
  const ticks = range(1, 19, 1).map(k => { const t = k / 20, x = a[0] + dx * t, y = a[1] + dy * t, m = k % 5 ? 0.3 : 0.55; return `M${r1(x)} ${r1(y)}L${r1(x + nx * m)} ${r1(y + ny * m)}` }).join('')
  return <g>
    <path d={`M${p.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L')}Z`} fill="#f4e6c4" stroke="#b99a55" strokeWidth="1.6" opacity=".95" />
    <path d={ticks} stroke="#b99a55" strokeWidth="1.2" />
  </g>
}
const up = (t: number) => 0.25 * t * t
function Tangent({ step }: { step: 1 | 2 | 3 | 4 | 5 }) {
  const s = graphScale(DF)
  const P0 = s.pt(4, 4), A = s.pt(2, 0), B = s.pt(10, 16), C = s.pt(10, 0)
  const titles = [
    'A curved distance-time graph that gets steeper and steeper: the object is speeding up. The question is how fast it is going at exactly 4 s.',
    'A dashed line goes up from 4 s on the time axis to the curve. The point on the curve is marked at 4 s, 4 m.',
    'A ruler is laid so that it just touches the curve at the marked point. A straight line drawn along it is the tangent.',
    'A large triangle on the tangent from 2 s, 0 m to 10 s, 16 m. Change in distance 16 m, change in time 8 s. Gradient = 16 ÷ 8 = 2 m/s.',
    'The whole method on one graph: mark the point, draw the tangent, use a large triangle, divide. The speed at 4 s is 2 m/s.',
  ]
  const tan = <path d={`M${s.x(1.6)} ${s.y(-0.8)}L${s.x(10.3)} ${s.y(16.6)}`} stroke={amber} strokeWidth="3.4" />
  return <PhysicsDiagram schematic={false} title={titles[step - 1]}>
    <DtAxes />
    {step >= 4 && <g>
      <path d={`M${A[0]} ${A[1]}L${C[0]} ${C[1]}L${B[0]} ${B[1]}Z`} fill={P.light} fillOpacity=".4" stroke="none" />
      <path d={`M${A[0]} ${A[1]}H${C[0]}`} stroke={M.time} strokeWidth="3" strokeDasharray="6 5" />
      <path d={`M${C[0]} ${C[1]}V${B[1]}`} stroke={M.distance} strokeWidth="3" strokeDasharray="6 5" />
    </g>}
    {step === 3 && <Ruler a={s.pt(1.6, -0.8)} b={s.pt(10.3, 16.6)} />}
    <path d={curve(DF, up, 0, 10)} stroke={LINE} strokeWidth="3.6" fill="none" />
    {step >= 3 && tan}
    {step === 1 && <g>
      <path d={`M${s.x(4)} ${s.y(0)}V${s.y(14)}`} stroke={muted} strokeWidth="1.8" strokeDasharray="5 5" />
      <circle cx={s.x(4)} cy={s.y(17)} r="14" fill="white" stroke={ink} strokeWidth="2" />
      <text x={s.x(4)} y={s.y(17) + 6} textAnchor="middle" fontSize="18" fontWeight="800" fill={ink}>?</text>
    </g>}
    {step === 2 && <path d={`M${s.x(4)} ${s.y(0)}V${P0[1]}`} stroke={amber} strokeWidth="2.4" strokeDasharray="6 5" />}
    {step >= 2 && dot(P0, 'p', step === 2 ? amberInk : ink)}
    {step === 2 && <text x={P0[0] - 12} y={P0[1] - 12} textAnchor="end" fontSize="13" fontWeight="750" fill={amberInk} {...halo}>4 s, 4 m</text>}
    {step >= 4 && <g>{dot(A, 'a')}{dot(B, 'b')}</g>}
    {step === 4 && <g>
      <text x={(A[0] + C[0]) / 2 + 30} y={C[1] - 10} textAnchor="middle" fontSize="13" fontWeight="750" fill={M.time} {...halo}>10 − 2 = 8 s</text>
      <Lines x={C[0] + 12} y={(B[1] + C[1]) / 2 + 2} lines={['16 − 0', '= 16 m']} size={13} colour={M.distance} />
    </g>}
    {/* side panel */}
    {step === 1 && <g>
      <Lines x={358} y={84} lines={['steeper and', 'steeper: the', 'speed keeps', 'changing']} size={14} />
      <Lines x={358} y={182} lines={['how fast at 4 s?']} size={15} colour={amberInk} />
    </g>}
    {step === 2 && <Lines x={358} y={96} lines={['go up from', '4 s to the', 'curve and', 'mark a point']} size={14} colour={amberInk} />}
    {step === 3 && <Lines x={358} y={84} lines={['tangent:', 'a straight line', 'that just', 'touches the', 'curve at', 'one point']} size={14} colour={amberInk} />}
    {step === 4 && <Panel x={410} y={46} w={124} h={104}>
      <Lines x={472} y={72} anchor="middle" lines={['gradient', '= 16 ÷ 8', '= 2 m/s']} size={15} />
    </Panel>}
    {step === 5 && <g>
      {['mark the point', 'draw a tangent', 'large triangle', 'up ÷ across'].map((t, i) => <g key={t}>
        <Num n={i + 1} x={372} y={64 + i * 34} state="active" colour={i === 1 ? amber : ink} />
        <text x={392} y={69 + i * 34} fontSize="14" fontWeight="700" fill={ink}>{t}</text>
      </g>)}
      <Answer x={354} y={210} w={180} text="speed = 2 m/s" />
    </g>}
  </PhysicsDiagram>
}
const slow = (t: number) => 5 * t - 0.25 * t * t
function TangentWorked() {
  const s = graphScale(DF)
  const P0 = s.pt(4, 16), A = s.pt(0, 4), B = s.pt(8, 28), C = s.pt(8, 4)
  return <PhysicsDiagram schematic={false} title="Worked example: a curved distance-time graph that levels off. A tangent touches it at 4 s, 16 m and passes through 0 s, 4 m and 8 s, 28 m. Change in distance 24 m, change in time 8 s, so the speed at 4 s is 3 m/s.">
    <DtAxes />
    <path d={`M${A[0]} ${A[1]}L${C[0]} ${C[1]}L${B[0]} ${B[1]}Z`} fill={P.light} fillOpacity=".4" stroke="none" />
    <path d={`M${A[0]} ${A[1]}H${C[0]}`} stroke={M.time} strokeWidth="3" strokeDasharray="6 5" />
    <path d={`M${C[0]} ${C[1]}V${B[1]}`} stroke={M.distance} strokeWidth="3" strokeDasharray="6 5" />
    <path d={curve(DF, slow, 0, 10)} stroke={LINE} strokeWidth="3.6" fill="none" />
    <path d={`M${A[0]} ${A[1]}L${s.x(8.2)} ${s.y(28.6)}`} stroke={amber} strokeWidth="3.4" />
    {dot(P0, 'p', amberInk)}{dot(A, 'a')}{dot(B, 'b')}
    <text x={P0[0] + 12} y={P0[1] + 20} fontSize="13" fontWeight="750" fill={amberInk} {...halo}>4 s</text>
    <text x={(A[0] + C[0]) / 2} y={C[1] + 20} textAnchor="middle" fontSize="13" fontWeight="750" fill={M.time} {...halo}>8 − 0 = 8 s</text>
    <Lines x={C[0] + 10} y={(B[1] + C[1]) / 2 + 30} lines={['28 − 4', '= 24 m']} size={13} colour={M.distance} />
    <Panel x={400} y={46} w={134} h={104}>
      <Lines x={467} y={72} anchor="middle" lines={['gradient', '= 24 ÷ 8', '= 3 m/s']} size={15} />
    </Panel>
    <Answer x={364} y={200} w={170} text="3 m/s at 4 s" />
  </PhysicsDiagram>
}
function TangentQuestion() {
  const s = graphScale(DF)
  return <PhysicsDiagram schematic={false} title="A curved distance-time graph. A tangent touches the curve at 8 s. Two dots are marked on the tangent.">
    <DtAxes />
    <path d={curve(DF, up, 0, 9.5)} stroke={LINE} strokeWidth="3.6" fill="none" />
    <path d={`M${s.x(3.7)} ${s.y(-1.2)}L${s.x(10.2)} ${s.y(24.8)}`} stroke={amber} strokeWidth="3.4" />
    <path d={`M${s.x(8)} ${s.y(0)}V${s.y(16)}`} stroke={muted} strokeWidth="1.6" strokeDasharray="5 5" />
    <circle cx={s.x(8)} cy={s.y(16)} r="4" fill={amberInk} />
    {dot(s.pt(4, 0), 'a')}{dot(s.pt(10, 24), 'b')}
    <Lines x={362} y={96} lines={['tangent', 'drawn at 8 s']} size={14} colour={amberInk} />
  </PhysicsDiagram>
}

/* ====================== Lesson 46: area under a velocity-time graph ====================== */

const VF: GraphFrame = { x: 62, y: 40, width: 280, height: 200, xMax: 10, yMax: 12 }
function VtAxes({ frame, xStep = 1, yStep = 2, xLabelStep }: { frame: GraphFrame; xStep?: number; yStep?: number; xLabelStep?: number }) {
  const s = graphScale(frame)
  const xs = range(xStep, frame.xMax, xStep)
  const labelled = xLabelStep ? xs.filter(v => Math.abs(v / xLabelStep - Math.round(v / xLabelStep)) < 1e-6) : xs
  return <g>
    <g stroke={P.grid} strokeWidth="1">{xs.filter(v => !labelled.includes(v)).map(v => <path key={v} d={`M${s.x(v)} ${frame.y}V${frame.y + frame.height}`} />)}</g>
    <GraphAxes frame={frame} xLabel="Time" xUnit="s" yLabel="Velocity" yUnit="m/s" xTicks={labelled} yTicks={range(yStep, frame.yMax, yStep)} grid />
  </g>
}
function VLine({ frame, pts }: { frame: GraphFrame; pts: Pt[] }) {
  return <path d={graphScale(frame).path(pts)} stroke={mo.velocity} strokeWidth="3.4" fill="none" />
}
function Area({ step }: { step: 1 | 2 | 3 | 4 | 5 }) {
  const s = graphScale(VF)
  const O = s.pt(0, 0), T = s.pt(4, 10), F = s.pt(4, 0), E = s.pt(10, 10), G = s.pt(10, 0)
  const titles = [
    'A velocity-time graph: a car speeds up from 0 to 10 m/s in 4 s, then goes at a steady 10 m/s until 10 s. All the area under the line is shaded: it is the distance travelled.',
    'A dashed line at 4 s splits the area into a triangle (0 to 4 s) and a rectangle (4 to 10 s).',
    'The triangle: base 4 s, height 10 m/s. Area = half × 4 × 10 = 20 m.',
    'The rectangle: width 6 s, height 10 m/s. Area = 6 × 10 = 60 m. Total distance = 20 + 60 = 80 m.',
    'Both ways together. Triangle 20 m plus rectangle 60 m is 80 m. One grid square is 1 s by 2 m/s, which is 2 m. There are 40 squares under the line, and 40 × 2 = 80 m.',
  ]
  const triOn = step === 2 || step === 3 || step === 5, rectOn = step === 2 || step === 4 || step === 5
  const sq = s.pt(6, 4), sq2 = s.pt(7, 2)
  return <PhysicsDiagram schematic={false} title={titles[step - 1]}>
    <VtAxes frame={VF} xLabelStep={2} />
    {step === 1 && <path d={`M${O[0]} ${O[1]}L${T[0]} ${T[1]}L${E[0]} ${E[1]}L${G[0]} ${G[1]}Z`} fill={triFill} stroke="none" opacity=".85" />}
    {step >= 2 && <g>
      <path d={`M${O[0]} ${O[1]}L${T[0]} ${T[1]}L${F[0]} ${F[1]}Z`} fill={triFill} stroke={areaLine} strokeWidth={step === 3 ? 2.4 : 1.4} opacity={triOn ? 0.95 : 0.3} />
      <path d={`M${F[0]} ${F[1]}L${T[0]} ${T[1]}L${E[0]} ${E[1]}L${G[0]} ${G[1]}Z`} fill={rectFill} stroke={areaLine} strokeWidth={step === 4 ? 2.4 : 1.4} opacity={rectOn ? 0.8 : 0.3} />
      <path d={`M${F[0]} ${F[1]}V${T[1]}`} stroke={areaLine} strokeWidth="2.2" strokeDasharray="6 5" />
    </g>}
    <g stroke={ink} strokeWidth="0.8" opacity={step === 5 ? 0.35 : 0.12}>
      {range(1, 9, 1).map(v => <path key={`ox${v}`} d={`M${s.x(v)} ${s.y(0)}V${s.y(10)}`} />)}
      {range(2, 8, 2).map(v => <path key={`oy${v}`} d={`M${s.x(0)} ${s.y(v)}H${s.x(10)}`} />)}
    </g>
    {step === 5 && <g>
      <rect x={sq[0]} y={sq[1]} width={sq2[0] - sq[0]} height={sq2[1] - sq[1]} fill="white" stroke={ink} strokeWidth="2.4" />
      <text x={(sq[0] + sq2[0]) / 2} y={(sq[1] + sq2[1]) / 2 + 5} textAnchor="middle" fontSize="12" fontWeight="800" fill={ink}>2 m</text>
    </g>}
    <VLine frame={VF} pts={[[0, 0], [4, 10], [10, 10]]} />
    {step === 1 && <text x={s.x(6.6)} y={s.y(5) + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill={areaLine} {...halo}>area = distance</text>}
    {step === 2 && <g>
      <text x={s.x(2.9)} y={s.y(2.4)} textAnchor="middle" fontSize="13" fontWeight="800" fill={areaLine} {...halo}>triangle</text>
      <text x={s.x(7)} y={s.y(5) + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill={areaLine} {...halo}>rectangle</text>
    </g>}
    {step === 3 && <g>
      <text x={(O[0] + F[0]) / 2} y={O[1] - 10} textAnchor="middle" fontSize="13" fontWeight="800" fill={M.time} {...halo}>4 s</text>
      <text x={F[0] + 8} y={s.y(5) + 5} fontSize="13" fontWeight="800" fill={mo.velocity} {...halo}>10 m/s</text>
    </g>}
    {step === 4 && <g>
      <text x={(F[0] + G[0]) / 2} y={F[1] - 10} textAnchor="middle" fontSize="13" fontWeight="800" fill={M.time} {...halo}>10 − 4 = 6 s</text>
      <text x={G[0] - 8} y={s.y(6)} textAnchor="end" fontSize="13" fontWeight="800" fill={mo.velocity} {...halo}>10 m/s</text>
    </g>}
    {/* side panel */}
    {step === 1 && <Lines x={366} y={84} lines={['area under', 'the line', '= distance', 'travelled']} size={15} colour={areaLine} />}
    {step === 2 && <Lines x={366} y={84} lines={['split the area', 'into shapes', 'you know:', 'a triangle and', 'a rectangle']} size={14} />}
    {step === 3 && <Panel x={360} y={60} w={174} h={92}>
      <Lines x={447} y={86} anchor="middle" lines={['½ × base × height', '= ½ × 4 × 10', '= 20 m']} size={14} />
    </Panel>}
    {step === 4 && <g>
      <Panel x={360} y={46} w={174} h={64}>
        <Lines x={447} y={72} anchor="middle" lines={['width × height', '= 6 × 10 = 60 m']} size={14} />
      </Panel>
      <Panel x={360} y={126} w={174} h={64} hot>
        <Lines x={447} y={152} anchor="middle" lines={['total', '20 + 60 = 80 m']} size={14} colour={amberInk} />
      </Panel>
    </g>}
    {step === 5 && <g>
      <Panel x={360} y={40} w={174} h={58}>
        <Lines x={447} y={64} anchor="middle" lines={['shapes:', '20 + 60 = 80 m']} size={13} />
      </Panel>
      <Panel x={360} y={108} w={174} h={92}>
        <Lines x={447} y={130} anchor="middle" lines={['one square:', '1 s × 2 m/s = 2 m', '40 squares:', '40 × 2 = 80 m']} size={13} />
      </Panel>
      <Answer x={360} y={210} w={174} text="both: 80 m" />
    </g>}
  </PhysicsDiagram>
}
const WF: GraphFrame = { x: 62, y: 40, width: 280, height: 200, xMax: 8, yMax: 8 }
function AreaWorked() {
  const s = graphScale(WF)
  const O = s.pt(0, 0), T = s.pt(3, 6), F = s.pt(3, 0), E = s.pt(8, 6), G = s.pt(8, 0)
  return <PhysicsDiagram schematic={false} title="Worked example: a cyclist speeds up from 0 to 6 m/s in 3 s, then rides at 6 m/s until 8 s. Triangle = half × 3 × 6 = 9 m. Rectangle = 5 × 6 = 30 m. Distance = 39 m.">
    <VtAxes frame={WF} yStep={1} />
    <path d={`M${O[0]} ${O[1]}L${T[0]} ${T[1]}L${F[0]} ${F[1]}Z`} fill={triFill} stroke={areaLine} strokeWidth="1.6" />
    <path d={`M${F[0]} ${F[1]}L${T[0]} ${T[1]}L${E[0]} ${E[1]}L${G[0]} ${G[1]}Z`} fill={rectFill} stroke={areaLine} strokeWidth="1.6" opacity=".85" />
    <VLine frame={WF} pts={[[0, 0], [3, 6], [8, 6]]} />
    <text x={s.x(2.1)} y={s.y(1.2)} textAnchor="middle" fontSize="13" fontWeight="800" fill={areaLine} {...halo}>9 m</text>
    <text x={s.x(5.5)} y={s.y(3) + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill={areaLine} {...halo}>30 m</text>
    <Panel x={366} y={46} w={168} h={92}>
      <Lines x={450} y={72} anchor="middle" lines={['½ × 3 × 6 = 9 m', '5 × 6 = 30 m', '9 + 30 = 39 m']} size={14} />
    </Panel>
    <Answer x={366} y={160} w={168} text="total = 39 m" />
  </PhysicsDiagram>
}
function AreaScooter() {
  const f: GraphFrame = { x: 70, y: 40, width: 400, height: 200, xMax: 10, yMax: 6 }
  const s = graphScale(f)
  const pts: Pt[] = [[0, 4], [5, 4], [9, 0]]
  return <PhysicsDiagram schematic={false} title="A velocity-time graph for a scooter: a flat line at 4 m/s from 0 to 5 s, then a straight line down to 0 m/s at 9 s.">
    <VtAxes frame={f} yStep={1} />
    <VLine frame={f} pts={pts} />
    {pts.map(([x, y], i) => <circle key={i} cx={s.x(x)} cy={s.y(y)} r="4.5" fill={mo.velocity} />)}
  </PhysicsDiagram>
}
const terminal = (t: number) => 8 * (1 - Math.exp(-t / 3))
function AreaSquares() {
  const f: GraphFrame = { x: 70, y: 40, width: 400, height: 200, xMax: 10, yMax: 9 }
  const s = graphScale(f)
  const pts: Pt[] = range(0, 40, 1).map(i => [i / 4, terminal(i / 4)])
  return <PhysicsDiagram schematic={false} title="A curved velocity-time graph on a grid. Each grid square is 2 s wide and 1 m/s tall. The area under the curve is shaded.">
    <path d={`${s.path(pts)}L${s.x(10)} ${s.y(0)}L${s.x(0)} ${s.y(0)}Z`} fill={triFill} opacity=".7" />
    <GraphAxes frame={f} xLabel="Time" xUnit="s" yLabel="Velocity" yUnit="m/s" xTicks={range(2, 10, 2)} yTicks={range(1, 9, 1)} grid />
    <path d={s.path(pts)} stroke={mo.velocity} strokeWidth="3.4" fill="none" />
  </PhysicsDiagram>
}

export function HigherMotionGraphVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  const ratio = /^hgraph-ratio-([1-5])$/.exec(focus)
  if (ratio) return <Ratio step={Number(ratio[1]) as 1 | 2 | 3 | 4 | 5} />
  const tan = /^hgraph-tan-([1-5])$/.exec(focus)
  if (tan) return <Tangent step={Number(tan[1]) as 1 | 2 | 3 | 4 | 5} />
  const area = /^hgraph-area-([1-5])$/.exec(focus)
  if (area) return <Area step={Number(area[1]) as 1 | 2 | 3 | 4 | 5} />
  switch (focus) {
    case 'hgraph-ratio-worked': return <RatioWorked />
    case 'hgraph-tan-worked': return <TangentWorked />
    case 'hgraph-tan-q': return <TangentQuestion />
    case 'hgraph-area-worked': return <AreaWorked />
    case 'hgraph-area-q-scooter': return <AreaScooter />
    case 'hgraph-area-q-squares': return <AreaSquares />
    default: return null
  }
}
