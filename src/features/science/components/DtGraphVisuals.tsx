import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, GraphAxes, graphScale, type GraphFrame, type Pt } from './PhysicsKit'
import { ink, muted, r1, Tag, Eq, Arrow, Car, Person, CrossMark } from './EnergyStoreVisuals'
import { motion as M, Mover } from './VelocityVisuals'

/*
 * Physics Lesson 45: Distance-time graphs. Original, code-native graphs; values are friendly and exact.
 * Focus ids start with 'dtgraph-'.
 *
 * Every graph uses the kit's axes: distance in m up the side, time in s along the bottom, a light grid wherever values
 * are read. The journey line is drawn in the speed green (its gradient is the speed); gradient triangles have a blue
 * time side and a brown-orange distance side, the same colours as t and s in the speed lesson. Marked points are dots.
 */

const LINE = M.speed
const dot = (p: Pt, key?: string | number) => <circle key={key} cx={p[0]} cy={p[1]} r="5" fill="white" stroke={ink} strokeWidth="2.4" />
const range = (a: number, b: number, step: number) => Array.from({ length: Math.round((b - a) / step) + 1 }, (_, i) => r1(a + i * step))

/** A graph panel: axes with units, optional grid and tick numbers, and the journey drawn from value points. */
function Graph({ frame, xStep, yStep, numbers = true, grid = true, children }: { frame: GraphFrame; xStep: number; yStep: number; numbers?: boolean; grid?: boolean; children?: ReactNode }) {
  const xt = range(xStep, frame.xMax, xStep), yt = range(yStep, frame.yMax, yStep)
  return <g>
    {!numbers && grid && <g stroke={P.grid} strokeWidth="1">
      {xt.map(v => <path key={`x${v}`} d={`M${graphScale(frame).x(v)} ${frame.y}V${frame.y + frame.height}`} />)}
      {yt.map(v => <path key={`y${v}`} d={`M${frame.x} ${graphScale(frame).y(v)}H${frame.x + frame.width}`} />)}
    </g>}
    <GraphAxes frame={frame} xLabel="Time" xUnit="s" yLabel="Distance" yUnit="m" xTicks={numbers ? xt : []} yTicks={numbers ? yt : []} grid={numbers && grid} origin={numbers} />
    {children}
  </g>
}
function Journey({ frame, pts, width = 3.6, colour = LINE, opacity = 1, dashed = false }: { frame: GraphFrame; pts: Pt[]; width?: number; colour?: string; opacity?: number; dashed?: boolean }) {
  return <path d={graphScale(frame).path(pts)} stroke={colour} strokeWidth={width} fill="none" opacity={opacity} strokeDasharray={dashed ? '8 6' : undefined} />
}
/** A smooth curve through y = f(x), sampled. */
function curve(frame: GraphFrame, f: (x: number) => number, x0: number, x1: number): string {
  const s = graphScale(frame)
  return range(x0, x1, (x1 - x0) / 40).map((x, i) => `${i ? 'L' : 'M'}${s.x(x)} ${s.y(f(x))}`).join('')
}
function Note({ x, y, lines, colour = ink, size = 14 }: { x: number; y: number; lines: string[]; colour?: string; size?: number }) {
  return <Lines x={x} y={y} lines={lines} size={size} colour={colour} />
}

/* ---------- Section 2: reading the graph ---------- */

const F40: GraphFrame = { x: 70, y: 40, width: 300, height: 200, xMax: 40, yMax: 40 }
function Axes() {
  const s = graphScale(F40)
  return <PhysicsDiagram schematic={false} title="Empty distance-time axes: distance in metres up the vertical axis, time in seconds along the horizontal axis. A runner starts at the origin, and a faint line rising shows a journey.">
    <Graph frame={F40} xStep={10} yStep={10} />
    <Journey frame={F40} pts={[[0, 0], [40, 32]]} opacity={0.4} />
    <g transform={`translate(${s.x(0) + 26} ${s.y(0) - 6})`}><Mover x={0} y={0} s={0.5} run /></g>
    <Arrow from={[40, 150]} to={[40, 70]} colour={M.distance} width={3} />
    <Note x={392} y={80} lines={['distance', 'goes up']} colour={M.distance} />
    <Note x={392} y={160} lines={['time goes', 'across']} colour={M.time} />
    <Arrow from={[400, 186]} to={[470, 186]} colour={M.time} width={3} />
  </PhysicsDiagram>
}
function Flat() {
  const s = graphScale(F40)
  return <PhysicsDiagram schematic={false} title="A distance-time graph that rises from the origin to 20 m at 10 s, then stays flat at 20 m until 30 s. The flat part means the object is stationary.">
    <Graph frame={F40} xStep={10} yStep={10} />
    <rect x={s.x(10)} y={s.y(20) - 12} width={s.x(30) - s.x(10)} height={24} rx="12" fill="#fff6d0" />
    <Journey frame={F40} pts={[[0, 0], [10, 20]]} opacity={0.5} />
    <Journey frame={F40} pts={[[10, 20], [30, 20]]} width={5} />
    <text x={(s.x(10) + s.x(30)) / 2} y={s.y(20) - 22} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>flat: stationary</text>
    <Person x={460} y={220} s={1.1} arms={[[[-14, -40], [-18, -20]], [[14, -40], [18, -20]]]} />
    <Note x={400} y={70} lines={['time passes,', 'distance stays', 'the same']} size={13} />
  </PhysicsDiagram>
}
const F10: GraphFrame = { x: 70, y: 40, width: 300, height: 200, xMax: 10, yMax: 20 }
function Straight() {
  const s = graphScale(F10)
  return <PhysicsDiagram schematic={false} title="A straight line from the origin rising 2 m every second, to 20 m at 10 s. Small steps under the line show the same distance each second: a steady speed.">
    <Graph frame={F10} xStep={2} yStep={4} />
    {range(0, 9, 1).map(t => <path key={t} d={`M${s.x(t)} ${s.y(2 * t)}H${s.x(t + 1)}V${s.y(2 * t + 2)}`} stroke={M.distance} strokeWidth="1.8" fill="none" strokeDasharray="3 3" opacity=".8" />)}
    <Journey frame={F10} pts={[[0, 0], [10, 20]]} />
    <Tag x={455} y={80} text="steady speed" colour={LINE} />
    <Note x={392} y={130} lines={['same distance', 'every second']} colour={M.distance} size={13} />
    <Note x={392} y={190} lines={['1 s across,', '2 m up, each', 'step']} colour={muted} size={13} />
  </PhysicsDiagram>
}
function Steeper() {
  const s = graphScale(F10)
  return <PhysicsDiagram schematic={false} title="Two straight lines from the origin. The steep one is labelled faster, the gentle one slower. A steeper line means a bigger gradient, which means a faster speed.">
    <Graph frame={F10} xStep={2} yStep={4} />
    <Journey frame={F10} pts={[[0, 0], [5, 20]]} />
    <Journey frame={F10} pts={[[0, 0], [10, 8]]} colour="#7fbba6" />
    <text x={s.x(4.6) - 10} y={s.y(18)} textAnchor="end" fontSize="15" fontWeight="750" fill={LINE}>faster</text>
    <text x={s.x(8)} y={s.y(6.4) + 26} textAnchor="middle" fontSize="15" fontWeight="750" fill="#4f9a82">slower</text>
    <Note x={392} y={90} lines={['steeper line', '= bigger', 'gradient', '= faster']} />
  </PhysicsDiagram>
}

/* ---------- Section 3: curves ---------- */

const up = (x: number) => 0.2 * x * x
const down = (x: number) => 20 - 0.2 * (10 - x) * (10 - x)
function Curve({ kind }: { kind: 'curve' | 'up' | 'down' }) {
  const s = graphScale(F10)
  const f = kind === 'down' ? down : up
  const slope = (x: number) => kind === 'down' ? 0.4 * (10 - x) : 0.4 * x
  const tangents = kind === 'curve' ? [2, 5, 8] : []
  const titles = {
    curve: 'A curved distance-time line. Short tangent lines at three points have different steepness: the speed is changing.',
    up: 'A curve that gets steeper and steeper: the object is speeding up (accelerating).',
    down: 'A curve that starts steep and levels off until it is flat: the object is slowing down (decelerating).',
  }
  return <PhysicsDiagram schematic={false} title={titles[kind]}>
    <Graph frame={F10} xStep={2} yStep={4} numbers={false} />
    <path d={curve(F10, f, 0, 10)} stroke={LINE} strokeWidth="3.6" fill="none" />
    {tangents.map(x => {
      // a 70 px segment touching the curve, drawn in page units so every tick has the same length
      const [cx, cy] = s.pt(x, f(x)), dx = s.x(1) - s.x(0), dy = s.y(0) - s.y(1)
      const px = dx, py = -slope(x) * dy, len = Math.hypot(px, py), ux = px / len * 35, uy = py / len * 35
      const nx = uy / 35 * 18, ny = -ux / 35 * 18
      return <g key={x}><path d={`M${r1(cx + nx - ux)} ${r1(cy + ny - uy)}L${r1(cx + nx + ux)} ${r1(cy + ny + uy)}`} stroke={M.distance} strokeWidth="3.4" />{dot([cx, cy])}</g>
    })}
    {kind === 'curve' && <g>
      <text x={s.x(2) + 4} y={s.y(up(2)) + 26} fontSize="13" fontWeight="700" fill={muted}>gentle</text>
      <text x={s.x(8) + 16} y={s.y(up(8)) + 20} fontSize="13" fontWeight="700" fill={muted}>steep</text>
      <Note x={392} y={90} lines={['steepness', 'changes:', 'speed changes']} />
    </g>}
    {kind === 'up' && <g>
      <Car x={452} y={200} s={0.7} />
      <Arrow from={[410, 222]} to={[500, 222]} colour={LINE} width={3.4} />
      <Note x={400} y={80} lines={['steeper and', 'steeper:', 'speeding up']} colour={LINE} />
    </g>}
    {kind === 'down' && <g>
      <Car x={452} y={200} s={0.7} />
      <Arrow from={[500, 222]} to={[440, 222]} colour={P.wasted} width={3} />
      <Note x={400} y={80} lines={['flatter and', 'flatter:', 'slowing down']} colour={P.wasted} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 4: speed from the gradient (line through (2, 4) and (8, 16)) ---------- */

function Gradient({ step }: { step: 1 | 2 | 3 | 4 }) {
  const s = graphScale(F10)
  const A = s.pt(2, 4), B = s.pt(8, 16), C = s.pt(8, 4)
  const titles = [
    'A straight distance-time line through the origin. Speed = gradient = change in distance ÷ change in time.',
    'A large right-angled triangle drawn on the line from 2 s, 4 m to 8 s, 16 m, using most of the line. A tiny triangle near the origin is crossed out: too small.',
    'The triangle sides: change in time = 8 − 2 = 6 s; change in distance = 16 − 4 = 12 m.',
    'Gradient: speed = 12 ÷ 6 = 2 m/s.',
  ]
  return <PhysicsDiagram schematic={false} title={titles[step - 1]}>
    <Graph frame={F10} xStep={2} yStep={4} />
    {step >= 2 && <g>
      <path d={`M${A[0]} ${A[1]}L${C[0]} ${C[1]}L${B[0]} ${B[1]}Z`} fill={P.light} fillOpacity=".35" stroke="none" />
      <path d={`M${A[0]} ${A[1]}H${C[0]}`} stroke={M.time} strokeWidth="2.6" strokeDasharray="6 5" />
      <path d={`M${C[0]} ${C[1]}V${B[1]}`} stroke={M.distance} strokeWidth="2.6" strokeDasharray="6 5" />
    </g>}
    <Journey frame={F10} pts={[[0, 0], [10, 20]]} />
    {step >= 2 && <g>{dot(A)}{dot(B)}</g>}
    {step === 2 && <g>
      <path d={`M${s.x(0.5)} ${s.y(1)}H${s.x(1)}V${s.y(2)}`} stroke={muted} strokeWidth="2" fill="none" />
      <CrossMark x={s.x(1.6)} y={s.y(0.4) - 16} s={0.75} />
      <text x={s.x(2.3)} y={s.y(0.4) - 12} fontSize="12" fontWeight="700" fill={P.wasted}>too small</text>
      <Note x={392} y={80} lines={['large triangle:', 'use most of', 'the line']} colour={ink} />
    </g>}
    {step >= 3 && <g>
      <text x={(A[0] + C[0]) / 2} y={C[1] + 22} textAnchor="middle" fontSize="13" fontWeight="750" fill={M.time} stroke="white" strokeWidth="4" paintOrder="stroke">8 − 2 = 6 s</text>
      <Lines x={C[0] + 12} y={(B[1] + C[1]) / 2 - 4} lines={['16 − 4', '= 12 m']} size={13} colour={M.distance} />
    </g>}
    {step === 3 && <g>
      <Note x={400} y={70} lines={['change in time', '(across)']} colour={M.time} size={13} />
      <Note x={400} y={200} lines={['change in', 'distance (up)']} colour={M.distance} size={13} />
    </g>}
    {(step === 1 || step === 4) && <g>
      <rect x={380} y={46} width={152} height={step === 1 ? 118 : 150} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
      <Lines x={456} y={70} anchor="middle" lines={['speed', '= gradient', '= change in', 'distance ÷', 'change in time']} size={13} />
      {step === 4 && <g>
        <rect x={390} y={150} width={132} height={38} rx="12" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
        <Eq x={456} y={175} size={15} pieces={[['12', M.distance], [' ÷ '], ['6', M.time], [' = 2 m/s']]} />
      </g>}
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 5: drawing a graph from a journey ---------- */

const FD: GraphFrame = { x: 70, y: 124, width: 300, height: 170, xMax: 40, yMax: 40 }
const DPTS: Pt[] = [[0, 0], [10, 20], [20, 20], [40, 40]]
function Strip() {
  const cards: Array<[string, string, ReactNode]> = [
    ['1', 'walks 20 m in 10 s', <Mover key="a" x={0} y={0} s={0.42} />],
    ['2', 'stops for 10 s', <Person key="b" x={0} y={0} s={0.42} arms={[[[-14, -40], [-18, -20]], [[14, -40], [18, -20]]]} />],
    ['3', 'walks 20 m in 20 s', <Mover key="c" x={0} y={0} s={0.42} />],
  ]
  return <g>
    {cards.map(([n, t, pic], i) => {
      const x = 10 + i * 176
      return <g key={n}>
        <rect x={x} y={6} width={168} height={66} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
        <circle cx={x + 18} cy={24} r="11" fill={ink} /><text x={x + 18} y={29} textAnchor="middle" fontSize="13" fontWeight="750" fill="white">{n}</text>
        <g transform={`translate(${x + 146} 66)`}>{pic}</g>
        <Lines x={x + 36} y={32} lines={t.split(' in ').length > 1 ? [t.split(' in ')[0], `in ${t.split(' in ')[1]}`] : [t]} size={13} />
      </g>
    })}
  </g>
}
function Drawn({ step }: { step: 1 | 2 | 3 }) {
  const s = graphScale(FD)
  const titles = [
    'A journey in three stages: walks 20 m in 10 s, stops for 10 s, then walks 20 m in 20 s. Empty distance-time axes below.',
    'The graph: from the origin up to 20 m at 10 s, flat at 20 m until 20 s, then up to 40 m at 40 s. The stages are numbered 1, 2 and 3.',
    'The finished graph with each axis labelled with its quantity and unit. Stage 1 is steeper than stage 3, so the walker is faster in stage 1.',
  ]
  const p = DPTS.map(([x, y]) => s.pt(x, y))
  return <PhysicsDiagram schematic={false} viewBox="0 0 540 340" title={titles[step - 1]}>
    <Strip />
    <Graph frame={FD} xStep={10} yStep={10} />
    {step === 3 && <g>
      <path d={`M${p[0][0]} ${p[0][1]}H${p[1][0]}V${p[1][1]}`} stroke={M.time} strokeWidth="1.8" strokeDasharray="4 4" fill="none" />
      <path d={`M${p[2][0]} ${p[2][1]}H${p[3][0]}V${p[3][1]}`} stroke={M.time} strokeWidth="1.8" strokeDasharray="4 4" fill="none" />
      <path d={`M${p[0][0]} ${p[0][1]}L${p[1][0]} ${p[1][1]}L${p[1][0]} ${p[0][1]}Z`} fill={P.light} fillOpacity=".4" />
      <path d={`M${p[2][0]} ${p[2][1]}L${p[3][0]} ${p[3][1]}L${p[3][0]} ${p[2][1]}Z`} fill={P.light} fillOpacity=".4" />
    </g>}
    {step >= 2 && <g>
      <Journey frame={FD} pts={DPTS} />
      {p.map((q, i) => dot(q, i))}
      {[[5, 10, '1'], [15, 20, '2'], [30, 30, '3']].map(([x, y, n]) => {
        const [cx, cy] = s.pt(x as number, y as number)
        const at: Pt = n === '2' ? [cx, cy - 22] : [cx - 20, cy - 12]
        return <g key={n as string}><circle cx={at[0]} cy={at[1]} r="11" fill="white" stroke={ink} strokeWidth="2" /><text x={at[0]} y={at[1] + 5} textAnchor="middle" fontSize="13" fontWeight="750" fill={ink}>{n}</text></g>
      })}
    </g>}
    {step === 1 && <Note x={392} y={190} lines={['each stage', 'becomes one', 'part of the line']} colour={muted} size={13} />}
    {step === 2 && <Note x={392} y={170} lines={['start at the', 'origin', '', 'flat = stopped']} size={13} />}
    {step === 3 && <g>
      <Tag x={196} y={102} text="quantity and unit" colour={M.distance} />
      <Tag x={456} y={328} text="quantity and unit" colour={M.time} />
      <Note x={392} y={180} lines={['stage 1 is', 'steeper:', 'faster']} colour={LINE} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Question visuals (assessment view: no answers) ---------- */

function QJourney() {
  const F: GraphFrame = { x: 70, y: 40, width: 360, height: 210, xMax: 12, yMax: 40 }
  const s = graphScale(F)
  const pts: Pt[] = [[0, 0], [3, 12], [5, 12], [9, 16], [11, 36]]
  const labels: Array<[string, number, number]> = [['A', 1.5, 6], ['B', 4, 12], ['C', 7, 14], ['D', 10, 26]]
  return <PhysicsDiagram schematic={false} title="A distance-time graph in four labelled parts.">
    <Graph frame={F} xStep={1} yStep={4} numbers={false} />
    <Journey frame={F} pts={pts} />
    {pts.map((q, i) => dot(s.pt(q[0], q[1]), i))}
    {labels.map(([n, x, y]) => <text key={n} x={s.x(x) - (n === 'B' ? 0 : 14)} y={s.y(y) - (n === 'B' ? 14 : 6)} textAnchor={n === 'B' ? 'middle' : 'end'} fontSize="17" fontWeight="800" fill={ink}>{n}</text>)}
  </PhysicsDiagram>
}
function QSpeed() {
  const F: GraphFrame = { x: 70, y: 40, width: 380, height: 210, xMax: 8, yMax: 32 }
  const s = graphScale(F)
  return <PhysicsDiagram schematic={false} title="A straight distance-time line on a grid.">
    <Graph frame={F} xStep={1} yStep={4} />
    <Journey frame={F} pts={[[0, 0], [8, 32]]} />
    {dot(s.pt(1, 4))}{dot(s.pt(6, 24))}
  </PhysicsDiagram>
}
function QOwn() {
  const F: GraphFrame = { x: 70, y: 40, width: 380, height: 216, xMax: 12, yMax: 36 }
  const s = graphScale(F)
  const pts: Pt[] = [[0, 0], [4, 8], [8, 8], [12, 32]]
  const labels: Array<[string, Pt]> = [['P', [2, 4]], ['Q', [6, 8]], ['R', [10, 20]]]
  return <PhysicsDiagram schematic={false} title="A distance-time graph in three labelled parts P, Q and R.">
    <Graph frame={F} xStep={2} yStep={4} />
    <Journey frame={F} pts={pts} />
    {pts.map((q, i) => dot(s.pt(q[0], q[1]), i))}
    {labels.map(([n, [x, y]]) => <text key={n} x={s.x(x) - (n === 'Q' ? 0 : 14)} y={s.y(y) - (n === 'Q' ? 14 : 6)} textAnchor={n === 'Q' ? 'middle' : 'end'} fontSize="17" fontWeight="800" fill={ink} stroke="white" strokeWidth="4" paintOrder="stroke">{n}</text>)}
  </PhysicsDiagram>
}

export function DtGraphVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'dtgraph-axes': return <Axes />
    case 'dtgraph-flat': return <Flat />
    case 'dtgraph-straight': return <Straight />
    case 'dtgraph-steeper': return <Steeper />
    case 'dtgraph-curve': return <Curve kind="curve" />
    case 'dtgraph-curve-up': return <Curve kind="up" />
    case 'dtgraph-curve-down': return <Curve kind="down" />
    case 'dtgraph-g1': return <Gradient step={1} />
    case 'dtgraph-g2': return <Gradient step={2} />
    case 'dtgraph-g3': return <Gradient step={3} />
    case 'dtgraph-g4': return <Gradient step={4} />
    case 'dtgraph-d1': return <Drawn step={1} />
    case 'dtgraph-d2': return <Drawn step={2} />
    case 'dtgraph-d3': return <Drawn step={3} />
    case 'dtgraph-q-journey': return <QJourney />
    case 'dtgraph-q-speed': return <QSpeed />
    case 'dtgraph-q-own': return <QOwn />
    default: return null
  }
}
