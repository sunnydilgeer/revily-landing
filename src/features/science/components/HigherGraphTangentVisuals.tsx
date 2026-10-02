import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, GraphAxes, graphScale, type GraphFrame, type Pt } from './PhysicsKit'
import { ink, muted, r1, Tag, StepStrip, Card, Eq } from './EnergyStoreVisuals'
import { ws, range, Grid } from './WsPresentVisuals'

/*
 * Higher-only diagrams for Working Scientifically Lesson 8 (WS 3.5, maths skill 4e HT: the gradient of a tangent to a curve).
 * Original, code-native graphs; not to scale. Focus ids start with 'hgrad-'.
 *
 * Same look as the Foundation graphs (WsGraphVisuals.tsx): faint grid, ink axes, the line in green, change in x blue and
 * change in y brown-orange. New here: the tangent (amber), a ruler and the equal gaps (teal).
 * One curve throughout: a cyclist speeding up from traffic lights, distance = time² ÷ 4 (0–20 s, 0–100 m). The tangent at
 * time T has gradient T ÷ 2, so every tangent below touches the drawn curve exactly:
 * at 10 s → through (6 s, 5 m) and (16 s, 55 m), 5 m/s (teaching); at 12 s → through (6 s, 0 m) and (16 s, 60 m), 6 m/s (question).
 * The question view shows the tangent and two dots, but no values and no triangle until feedback.
 */
const amber = '#d98a1c', amberInk = '#8a5a14', amberSoft = '#fdf0d8'
const teal = '#3f9a92', tealInk = '#23746d'
const rulerFill = '#fbf3df', rulerLine = '#b69457'

const F: GraphFrame = { x: 78, y: 54, width: 260, height: 196, xMax: 20, yMax: 100 }
const s = graphScale(F)
const dist = (t: number) => t * t / 4
const CURVE: Pt[] = range(0, 20, 0.5).map(t => [t, dist(t)])
const tan = (T: number) => (t: number) => dist(T) + (T / 2) * (t - T)

const dot = (p: Pt, colour = amber) => <circle cx={p[0]} cy={p[1]} r="6.5" fill={colour} stroke="white" strokeWidth="2.2" />

function Graph({ children, dim = false, hideX = [], hideY = [] }: { children?: ReactNode; dim?: boolean; hideX?: number[]; hideY?: number[] }) {
  return <g>
    <Grid frame={F} xs={range(1, 20, 1)} ys={range(5, 100, 5)} />
    <GraphAxes frame={F} xLabel="Time (s)" yLabel="Distance (m)" xTicks={range(2, 20, 2).filter(v => !hideX.includes(v))} yTicks={range(20, 100, 20).filter(v => !hideY.includes(v))} />
    <path d={s.path(CURVE)} stroke={ws.fit} strokeWidth="3.6" fill="none" opacity={dim ? 0.55 : 1} />
    {children}
  </g>
}
function TangentLine({ T, t1, t2, width = 3.2 }: { T: number; t1: number; t2: number; width?: number }) {
  const v = tan(T)
  return <path d={s.path([[t1, v(t1)], [t2, v(t2)]])} stroke={amber} strokeWidth={width} fill="none" />
}
/** Gradient triangle: across from a, then up to b, with the change in each labelled. */
function Triangle({ a, b, yText, xText }: { a: Pt; b: Pt; yText: string; xText: string }) {
  const A = s.pt(...a), B = s.pt(...b)
  return <g>
    <path d={`M${A[0]} ${A[1]}H${B[0]}`} stroke={ws.x} strokeWidth="2.6" strokeDasharray="7 5" />
    <path d={`M${B[0]} ${A[1]}V${B[1]}`} stroke={ws.y} strokeWidth="2.6" strokeDasharray="7 5" />
    <path d={`M${B[0] - 11} ${A[1]}v-11h11`} stroke={muted} strokeWidth="1.4" fill="none" />
    <text x={B[0] + 9} y={r1((A[1] + B[1]) / 2 + 5)} fontSize="14" fontWeight="750" fill={ws.y} stroke="white" strokeWidth="4" paintOrder="stroke">{yText}</text>
    <text x={r1((A[0] + B[0]) / 2 + 22)} y={A[1] - 9} textAnchor="middle" fontSize="14" fontWeight="750" fill={ws.x} stroke="white" strokeWidth="4" paintOrder="stroke">{xText}</text>
  </g>
}
/** A small cyclist, wheels on the line y; (x, y) is the middle of the bike at road level. */
function Cyclist({ x, y }: { x: number; y: number }) {
  const w = '#5a6b79'
  return <g transform={`translate(${x} ${y})`}>
    <circle cx="-22" cy="-15" r="14" fill="none" stroke={w} strokeWidth="2.6" />
    <circle cx="22" cy="-15" r="14" fill="none" stroke={w} strokeWidth="2.6" />
    <path d="M-22 -15L-4 -15L10 -36L-12 -36ZM-4 -15L-12 -40M22 -15L12 -42H20" stroke={P.kineticLine} strokeWidth="2.6" fill="none" />
    <path d="M-16 -42H-6" stroke={w} strokeWidth="3" />
    {/* rider */}
    <path d="M-10 -44Q-2 -66 10 -64" stroke={ws.x} strokeWidth="7" fill="none" />
    <path d="M10 -62L19 -44" stroke={ws.x} strokeWidth="4" />
    <path d="M-8 -44L4 -30L-4 -16" stroke="#6b7f92" strokeWidth="5" fill="none" />
    <circle cx="15" cy="-71" r="7" fill="#f3cfb0" stroke="#b8835e" strokeWidth="1.6" />
    <path d="M7 -74Q15 -84 23 -74Z" fill={P.kinetic} stroke={P.kineticLine} strokeWidth="1.6" />
    <path d="M-48 -26h-14M-46 -14h-20M-48 -2h-12" stroke={muted} strokeWidth="2" opacity=".6" />
  </g>
}

/* ---------- Teaching frames: tangent at 10 s ---------- */

const T0 = 10
function CurveFrame() {
  const p1 = s.pt(4, dist(4)), p2 = s.pt(17, dist(17))
  return <PhysicsDiagram schematic={false} title="A distance–time graph for a cyclist speeding up from traffic lights. The green line curves upwards: gentle at first, then steeper. Its gradient keeps changing, so one triangle cannot give it.">
    <Graph />
    <path d={`M${p1[0] + 6} ${p1[1] - 12}q12 -26 34 -30`} stroke={muted} strokeWidth="1.6" fill="none" />
    <Lines x={p1[0] + 44} y={p1[1] - 40} lines={['gentle']} size={13} weight={650} colour={muted} />
    <path d={`M${p2[0] - 12} ${p2[1] + 2}q-24 -2 -40 -16`} stroke={muted} strokeWidth="1.6" fill="none" />
    <Lines x={p2[0] - 56} y={p2[1] - 20} anchor="end" lines={['steeper']} size={13} weight={650} colour={muted} />
    <Cyclist x={444} y={128} />
    <path d={`M372 128H520`} stroke={P.panelLine} strokeWidth="3" />
    <Lines x={446} y={156} anchor="middle" lines={['speeding up', 'from the lights']} size={13} weight={650} colour={muted} />
    <Card x={366} y={204} w={160} h={64} hot>
      <Lines x={446} y={230} anchor="middle" lines={['the gradient', 'keeps changing']} size={14} colour={amberInk} />
    </Card>
  </PhysicsDiagram>
}
function PointFrame() {
  const p = s.pt(T0, dist(T0))
  return <PhysicsDiagram schematic={false} title="The same graph. A dashed line goes up from 10 seconds to the curve and across to 25 metres. The point on the curve at 10 seconds is marked with an amber dot.">
    <Graph hideX={[8, 10, 12]} hideY={[20]}>
      <path d={`M${p[0]} ${F.y + F.height}V${p[1]}H${F.x}`} stroke={amber} strokeWidth="2" strokeDasharray="6 5" fill="none" />
    </Graph>
    <Tag x={p[0]} y={F.y + F.height + 15} text="10 s" colour={amberInk} fill={amberSoft} size={13} w={50} />
    <Tag x={F.x - 30} y={p[1]} text="25 m" colour={amberInk} fill={amberSoft} size={13} w={52} />
    {dot(p)}
    <path d={`M${p[0] + 8} ${p[1] + 6}Q${p[0] + 24} ${p[1] + 20} ${p[0] + 46} ${p[1] + 16}`} stroke={amber} strokeWidth="1.8" fill="none" />
    <Lines x={p[0] + 52} y={p[1] + 14} lines={['the point', 'you want']} size={14} colour={amberInk} />
    <Lines x={446} y={110} anchor="middle" lines={['How steep is', 'the curve at', 'exactly 10 s?']} size={15} colour={ink} />
  </PhysicsDiagram>
}
function Ruler({ T }: { T: number }) {
  const a = s.pt(T - 3, tan(T)(T - 3)), b = s.pt(T + 9, tan(T)(T + 9))
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI
  return <g transform={`translate(${a[0]} ${a[1]}) rotate(${r1(ang)})`} opacity="0.92">
    <rect x={0} y={3} width={r1(len)} height={22} rx="3" fill={rulerFill} fillOpacity=".85" stroke={rulerLine} strokeWidth="1.6" />
    {Array.from({ length: Math.floor(len / 10) }, (_, k) => <path key={k} d={`M${k * 10 + 5} 3v${k % 5 === 0 ? 8 : 4.5}`} stroke={rulerLine} strokeWidth="1.1" />)}
  </g>
}
/** The equal gap between the tangent and the curve at time t. */
function Gap({ t }: { t: number }) {
  const top = s.y(dist(t)), bottom = s.y(tan(T0)(t)), x = s.x(t)
  return <g>
    <path d={`M${x} ${top + 1}V${bottom - 1}`} stroke={teal} strokeWidth="3" />
    <path d={`M${x - 6} ${top}H${x + 6}M${x - 6} ${bottom}H${x + 6}`} stroke={teal} strokeWidth="2.4" />
  </g>
}
function TangentFrame() {
  const p = s.pt(T0, dist(T0)), g1 = s.pt(5, 0), g2 = s.pt(15, dist(15))
  return <PhysicsDiagram schematic={false} title="A ruler laid on the graph so it just touches the curve at the 10 second point. The gap between the ruler and the curve is the same on both sides. A straight amber line drawn along the ruler is the tangent.">
    <Graph>
      <Ruler T={T0} />
      <TangentLine T={T0} t1={5} t2={20} />
      <Gap t={5} /><Gap t={15} />
    </Graph>
    {dot(p)}
    <Tag x={g1[0] - 4} y={g1[1] - 40} text="same gap" colour={tealInk} size={13} w={84} />
    <path d={`M${g1[0]} ${g1[1] - 28}V${g1[1] - 10}`} stroke={teal} strokeWidth="1.5" />
    <Tag x={g2[0] - 58} y={g2[1] - 30} text="same gap" colour={tealInk} size={13} w={84} />
    <path d={`M${g2[0] - 16} ${g2[1] - 30}H${g2[0] - 4}V${g2[1] - 4}`} stroke={teal} strokeWidth="1.5" fill="none" />
    <Lines x={s.x(20) + 8} y={s.y(75) + 5} lines={['tangent']} size={15} colour={amberInk} />
    <Lines x={410} y={150} lines={['a straight line', 'that just touches', 'the curve at', 'one point']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}
function GradientFrame({ all = false }: { all?: boolean }) {
  const a = s.pt(6, 5), b = s.pt(16, 55), p = s.pt(T0, dist(T0))
  return <PhysicsDiagram schematic={false} viewBox={all ? '0 0 540 330' : '0 0 540 300'} title={all
    ? 'Put it together: the tangent at 10 seconds with its gradient triangle, 50 metres up and 10 seconds across. Steps: mark the point, draw the tangent, pick two points far apart, divide the change in y by the change in x. The gradient at 10 seconds is 5 metres per second, the cyclist’s speed at that moment.'
    : 'Two points far apart on the tangent: 6 seconds, 5 metres and 16 seconds, 55 metres. A dashed triangle shows the change in y, 50 metres, and the change in x, 10 seconds. 50 divided by 10 equals 5 metres per second.'}>
    {all && <StepStrip steps={['point', 'tangent', 'two points', 'divide']} active={4} gap={128} y={18} x0={274} />}
    <g transform={all ? 'translate(0 22)' : undefined}>
      <Graph>
        <TangentLine T={T0} t1={5} t2={20} />
        <Triangle a={[6, 5]} b={[16, 55]} yText="50 m" xText="10 s" />
      </Graph>
      {dot(a)}{dot(b)}
      {all && <circle cx={p[0]} cy={p[1]} r="5" fill="white" stroke={ws.fit} strokeWidth="2.6" />}
      {!all && <g>
        <Tag x={a[0] - 46} y={a[1] - 16} text="(6 s, 5 m)" colour={amberInk} fill={amberSoft} size={13} w={84} />
        <Tag x={b[0] - 56} y={b[1] - 6} text="(16 s, 55 m)" colour={amberInk} fill={amberSoft} size={13} w={98} />
      </g>}
    </g>
    {all ? <g>
      <Card x={368} y={78} w={164} h={84}>
        <text x={450} y={102} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>the unit</text>
        <Eq x={450} y={128} size={17} pieces={[['m', ws.y], [' ÷ '], ['s', ws.x], [' = m/s']]} />
        <text x={450} y={150} textAnchor="middle" fontSize="12.5" fontWeight="650" fill={muted}>y unit ÷ x unit</text>
      </Card>
      <rect x={364} y={180} width={172} height={96} rx="16" fill={ws.fitFill} stroke={ws.fit} strokeWidth="2.2" />
      <Lines x={450} y={206} anchor="middle" lines={['gradient at 10 s', '= 5 m/s']} size={16} colour={ws.fit} />
      <Lines x={450} y={258} anchor="middle" lines={['the speed then']} size={13} weight={650} colour={muted} />
    </g> : <Card x={366} y={72} w={166} h={196}>
      <Eq x={380} y={100} anchor="start" size={15} pieces={[['change in y', ws.y]]} />
      <Eq x={380} y={124} anchor="start" size={16} pieces={[['55 − 5 = 50 m', ws.y]]} />
      <Eq x={380} y={156} anchor="start" size={15} pieces={[['change in x', ws.x]]} />
      <Eq x={380} y={180} anchor="start" size={16} pieces={[['16 − 6 = 10 s', ws.x]]} />
      <text x={380} y={212} fontSize="15" fontWeight="750" fill={ink}>50 ÷ 10 = 5</text>
      <rect x={376} y={226} width={146} height={32} rx="13" fill={ws.fitFill} stroke={ws.fit} strokeWidth="2.2" />
      <text x={449} y={247} textAnchor="middle" fontSize="14" fontWeight="800" fill={ws.fit}>gradient = 5 m/s</text>
    </Card>}
  </PhysicsDiagram>
}

/* ---------- Question: tangent at 12 s (no values, no triangle until feedback) ---------- */

function QuestionTangent({ assessment }: { assessment: boolean }) {
  const a = s.pt(6, 0), b = s.pt(16, 60), p = s.pt(12, dist(12))
  return <PhysicsDiagram schematic={false} title={assessment
    ? 'The cyclist’s distance–time graph. A straight amber tangent touches the curve at 12 seconds. Two amber dots are marked on the tangent where it crosses grid lines.'
    : 'The tangent at 12 seconds passes through 6 seconds, 0 metres and 16 seconds, 60 metres. Change in y 60 metres, change in x 10 seconds, gradient 6 metres per second.'}>
    <Graph>
      <TangentLine T={12} t1={6} t2={19} />
      {!assessment && <Triangle a={[6, 0]} b={[16, 60]} yText="60 m" xText="10 s" />}
    </Graph>
    <circle cx={p[0]} cy={p[1]} r="5" fill="white" stroke={ws.fit} strokeWidth="2.6" />
    {dot(a)}{dot(b)}
    <Lines x={s.x(19) + 8} y={s.y(tan(12)(19)) + 5} lines={['tangent at 12 s']} size={14} colour={amberInk} />
    {!assessment && <g>
      <rect x={380} y={200} width={140} height={34} rx="14" fill={ws.fitFill} stroke={ws.fit} strokeWidth="2.2" />
      <text x={450} y={222} textAnchor="middle" fontSize="15" fontWeight="800" fill={ws.fit}>60 ÷ 10 = 6 m/s</text>
    </g>}
  </PhysicsDiagram>
}

export function HigherGraphTangentVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'hgrad-curve': return <CurveFrame />
    case 'hgrad-point': return <PointFrame />
    case 'hgrad-tangent': return <TangentFrame />
    case 'hgrad-gradient': return <GradientFrame />
    case 'hgrad-all': return <GradientFrame all />
    case 'hgrad-q-tangent': return <QuestionTangent assessment={assessment} />
    default: return <GradientFrame all />
  }
}
