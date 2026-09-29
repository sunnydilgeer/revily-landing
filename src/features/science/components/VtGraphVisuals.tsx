import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, GraphAxes, graphScale, type GraphFrame, type Pt } from './PhysicsKit'
import { ink, muted, r1, Caption, Tag, Num, Arrow, Floor, Ball, Motion, Car, Bike, Person, Tick, skin, skinLine } from './EnergyStoreVisuals'
import { qty } from './KineticVisuals'

/*
 * Physics Lesson 46: Velocity-time graphs and terminal velocity. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'vtgraph-' and is routed from CellBiologyVisuals.tsx.
 *
 * The small "motion kit" below (force and quantity colours, a labelled force arrow, a graph line, a table and a
 * skydiver) is exported so the Newton's laws, motion practical and stopping distance lessons draw with the same parts.
 * Colour code for Motion: velocity green (as speed in the kinetic energy lesson), acceleration amber, mass blue,
 * forces: driving/push violet-free green, resistive forces and drag coral red, weight indigo (gravity), normal
 * contact force teal, resultant force violet. Arrow length shows the size of a force within one picture.
 */

export const mo = {
  velocity: qty.speed, velocityFill: '#dcefe6',
  accel: '#a9740f', accelFill: '#fbefcf',
  mass: qty.mass, massFill: '#dbe8f3',
  time: '#4d6f8c', timeFill: '#e2ebf3',
  driving: P.useful, drivingFill: P.usefulFill,
  drag: '#c0675a', dragFill: '#f8e0db',
  weight: P.gravitationalLine, weightFill: P.gravitational,
  normal: P.electrostaticLine, normalFill: P.electrostatic,
  resultant: P.pd, resultantFill: P.pdFill,
}

/** Rough width of bold text. */
export const tw = (s: string, size = 13) => s.length * size * 0.56

/**
 * A thick force arrow with a label. The label sits beside the arrow: 'end' past the tip, 'start' before the tail,
 * 'above'/'below' at the middle of a horizontal arrow, 'left'/'right' at the middle of an upright one.
 */
export function Force({ from, to, colour, label, at = 'end', width = 5, size = 13, lines }: { from: Pt; to: Pt; colour: string; label?: string; at?: 'end' | 'start' | 'above' | 'below' | 'left' | 'right'; width?: number; size?: number; lines?: string[] }) {
  const text = lines ?? (label ? [label] : [])
  const dx = to[0] - from[0], dy = to[1] - from[1], len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len
  const mid: Pt = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2]
  let x = 0, y = 0, anchor: 'start' | 'middle' | 'end' = 'middle'
  const lh = size + 3, block = (text.length - 1) * lh
  if (at === 'end' || at === 'start') {
    const p = at === 'end' ? to : from, s = at === 'end' ? 1 : -1
    x = p[0] + ux * s * 10; y = p[1] + uy * s * 14 + 4.5
    anchor = Math.abs(ux) < 0.3 ? 'middle' : ux * s > 0 ? 'start' : 'end'
    if (Math.abs(uy) >= 0.7) y = uy * s > 0 ? p[1] + 22 : p[1] - 12 - block
    else y = p[1] + 4.5 - block / 2
  } else if (at === 'above') { x = mid[0]; y = mid[1] - 14 - block }
  else if (at === 'below') { x = mid[0]; y = mid[1] + 24 }
  else if (at === 'left') { x = mid[0] - 12; y = mid[1] + 4.5 - block / 2; anchor = 'end' }
  else { x = mid[0] + 12; y = mid[1] + 4.5 - block / 2; anchor = 'start' }
  return <g>
    <Arrow from={from} to={to} colour={colour} width={width} />
    {text.length > 0 && <text x={r1(x)} y={r1(y)} textAnchor={anchor} fontSize={size} fontWeight="700" fill={colour} stroke="white" strokeWidth="4" paintOrder="stroke">{text.map((l, i) => <tspan key={i} x={r1(x)} dy={i ? lh : 0}>{l}</tspan>)}</text>}
  </g>
}

/** A soft rounded card with one or more centred lines of text. */
export function Note({ x, y, w, lines, colour = ink, fill = P.panel, line = P.panelLine, size = 14, weight = 700 }: { x: number; y: number; w: number; lines: string[]; colour?: string; fill?: string; line?: string; size?: number; weight?: number }) {
  const lh = size + 5, h = lines.length * lh + 16
  return <g>
    <rect x={x - w / 2} y={y} width={w} height={h} rx="12" fill={fill} stroke={line} strokeWidth="1.6" />
    <text x={x} y={y + 8 + size} textAnchor="middle" fontSize={size} fontWeight={weight} fill={colour}>{lines.map((l, i) => <tspan key={i} x={x} dy={i ? lh : 0}>{l}</tspan>)}</text>
  </g>
}

/** A data table in the Physics palette. `cols` are column widths; the first row is the header. */
export function DataTable({ x, y, cols, rows, rowH = 36, size = 14, hiRow }: { x: number; y: number; cols: number[]; rows: string[][]; rowH?: number; size?: number; hiRow?: number }) {
  const xs = cols.reduce<number[]>((a, w, i) => [...a, i ? a[i - 1] + cols[i - 1] : x], [])
  const total = cols.reduce((a, b) => a + b, 0)
  const headH = rowH + (Math.max(...rows[0].map(c => c.split('\n').length)) - 1) * 16
  return <g>
    {rows.map((row, j) => row.map((c, i) => {
      const head = j === 0, lines = c.split('\n')
      const cy = head ? y : y + headH + (j - 1) * rowH, ch = head ? headH : rowH
      return <g key={`${j}-${i}`}>
        <rect x={xs[i]} y={cy} width={cols[i]} height={ch} fill={head ? '#e8f1f7' : j === hiRow ? mo.accelFill : 'white'} stroke={P.panelLine} strokeWidth="1.8" />
        <text x={xs[i] + cols[i] / 2} y={cy + ch / 2 + 5 - (lines.length - 1) * 8} textAnchor="middle" fontSize={head ? size - 1 : size} fontWeight={head ? 700 : 500} fill={ink}>{lines.map((l, k) => <tspan key={k} x={xs[i] + cols[i] / 2} dy={k ? 16 : 0}>{l}</tspan>)}</text>
      </g>
    }))}
    <rect x={x} y={y} width={total} height={headH + (rows.length - 1) * rowH} rx="3" fill="none" stroke={ink} strokeWidth="2" />
  </g>
}

/** A skydiver falling belly-down, seen from the front: arms and legs spread. (x, y) is the middle of the body. */
export function Skydiver({ x, y, s = 1, chute = false }: { x: number; y: number; s?: number; chute?: boolean }) {
  const suit = '#f2b36b', suitLine = '#b8742a'
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    {chute && <g />}
    {/* arms up and out, legs apart */}
    {[[-10, -14, -34, -34, -40, -52], [10, -14, 34, -34, 40, -52]].map((a, i) => <g key={i}>
      <path d={`M${a[0]} ${a[1]}L${a[2]} ${a[3]}L${a[4]} ${a[5]}`} stroke={suitLine} strokeWidth="11" fill="none" />
      <path d={`M${a[0]} ${a[1]}L${a[2]} ${a[3]}L${a[4]} ${a[5]}`} stroke={suit} strokeWidth="7.5" fill="none" />
      <circle cx={a[4]} cy={a[5]} r="5" fill={skin} stroke={skinLine} strokeWidth="1.6" />
    </g>)}
    {[[-6, 16, -22, 36, -30, 54], [6, 16, 22, 36, 30, 54]].map((l, i) => <g key={i}>
      <path d={`M${l[0]} ${l[1]}L${l[2]} ${l[3]}L${l[4]} ${l[5]}`} stroke={suitLine} strokeWidth="12" fill="none" />
      <path d={`M${l[0]} ${l[1]}L${l[2]} ${l[3]}L${l[4]} ${l[5]}`} stroke={suit} strokeWidth="8.5" fill="none" />
      <path d={`M${l[4] - 5} ${l[5] + 3}h10`} stroke="#4f5d69" strokeWidth="6" />
    </g>)}
    <rect x={-14} y={-22} width={28} height={44} rx="12" fill={suit} stroke={suitLine} strokeWidth="2" />
    <path d="M-10 -8H10" stroke={suitLine} strokeWidth="1.6" opacity=".6" />
    <circle cx={0} cy={-34} r="12" fill={skin} stroke={skinLine} strokeWidth="1.8" />
    <path d="M-12 -35Q-12 -48 0 -48Q12 -48 12 -35Q6 -40 0 -40Q-6 -40 -12 -35Z" fill="#6f8fa8" stroke="#4d6f8c" strokeWidth="1.5" />
    <rect x={-8} y={-37} width={16} height={6} rx="3" fill="#e8f4fb" stroke="#4d6f8c" strokeWidth="1.3" />
  </g>
}

/** Speed lines above something falling (air rushing past, upwards). */
export function FallLines({ x, y, n = 3, len = 22, gap = 14 }: { x: number; y: number; n?: number; len?: number; gap?: number }) {
  return <g stroke={P.muted} strokeWidth="2.2" opacity=".55">{Array.from({ length: n }, (_, i) => { const dx = (i - (n - 1) / 2) * gap; return <path key={i} d={`M${x + dx} ${y}v${-(len - Math.abs(i - (n - 1) / 2) * 6)}`} /> })}</g>
}

/* ---------- Graph helpers ---------- */

/** Standard velocity-time axes. */
function VtAxes({ frame, xTicks, yTicks, grid = true }: { frame: GraphFrame; xTicks: number[]; yTicks: number[]; grid?: boolean }) {
  return <GraphAxes frame={frame} xLabel="Time" xUnit="s" yLabel="Velocity" yUnit="m/s" xTicks={xTicks} yTicks={yTicks} grid={grid} />
}
/** A graph line through data points. `dim` fades it, `hot` thickens it on a soft band. */
function GLine({ frame, pts, colour = mo.velocity, dim = false, hot = false, width = 3.2 }: { frame: GraphFrame; pts: Pt[]; colour?: string; dim?: boolean; hot?: boolean; width?: number }) {
  const d = graphScale(frame).path(pts)
  return <g opacity={dim ? 0.3 : 1}>
    {hot && <path d={d} stroke={mo.velocityFill} strokeWidth="14" fill="none" />}
    <path d={d} stroke={colour} strokeWidth={hot ? width + 1.2 : width} fill="none" />
  </g>
}
const range = (a: number, b: number, step: number) => Array.from({ length: Math.round((b - a) / step) + 1 }, (_, i) => r1(a + i * step))
const curvePts = (f: (t: number) => number, t0: number, t1: number, n = 40): Pt[] => range(0, n, 1).map(i => { const t = t0 + (t1 - t0) * i / n; return [r1(t * 1000) / 1000, Math.round(f(t) * 1000) / 1000] as Pt })

/* ---------- Section 2: what the line shapes mean ---------- */

const shapeFrame: GraphFrame = { x: 62, y: 48, width: 250, height: 180, xMax: 10, yMax: 10 }
function ShapeGraph({ title, children, side }: { title: string; children: ReactNode; side: ReactNode }) {
  return <PhysicsDiagram title={title}>
    <VtAxes frame={shapeFrame} xTicks={range(0, 10, 2)} yTicks={range(0, 10, 2)} />
    {children}
    {side}
  </PhysicsDiagram>
}
/** A small car on a strip of road with a speed arrow above it; `speeds` draws a row of ghosted positions. */
function CarStrip({ x, y, arrows, dim = false }: { x: number; y: number; arrows: number[]; dim?: boolean }) {
  return <g opacity={dim ? 0.4 : 1}>
    <Floor x1={x - 90} x2={x + 90} y={y} />
    <Car x={x} y={y} s={0.72} />
    {arrows.map((len, i) => <g key={i} opacity={i === arrows.length - 1 ? 1 : 0.35}><Arrow from={[x - 60, y - 52 - i * 0]} to={[x - 60 + len, y - 52]} colour={mo.velocity} width={3} /></g>)}
  </g>
}
function Shapes({ focus }: { focus: string }) {
  const s = graphScale(shapeFrame)
  if (focus === 'vtgraph-axes') return <ShapeGraph title="Empty velocity-time axes. Time in seconds goes along the bottom and velocity in metres per second goes up the side. A small car: velocity means how fast, and which way." side={<g>
    <CarStrip x={440} y={150} arrows={[70]} />
    <text x={440} y={80} textAnchor="middle" fontSize="13" fontWeight="700" fill={mo.velocity}>velocity</text>
    <Note x={440} y={184} w={176} size={13} lines={['velocity =', 'how fast,', 'and which way']} colour={ink} />
  </g>}>{null}</ShapeGraph>
  if (focus === 'vtgraph-uphill') return <ShapeGraph title="A straight line rising from the origin: the car speeds up by the same amount every second. Straight and sloping up means constant acceleration." side={<g>
    <Floor x1={342} x2={530} y={138} />
    <Car x={436} y={138} s={0.72} />
    {[28, 52, 76].map((l, i) => <g key={i} opacity={0.4 + i * 0.3}><Arrow from={[392, 60 + i * 14]} to={[392 + l, 60 + i * 14]} colour={mo.velocity} width={3} /></g>)}
    <text x={436} y={46} textAnchor="middle" fontSize="13" fontWeight="700" fill={mo.velocity}>getting faster</text>
    <Note x={436} y={160} w={184} size={13} lines={['straight, sloping up:', 'constant acceleration']} colour={mo.velocity} fill={mo.velocityFill} line={mo.velocity} />
  </g>}>
    <GLine frame={shapeFrame} pts={[[0, 0], [8, 8]]} hot />
  </ShapeGraph>
  if (focus === 'vtgraph-flat') return <ShapeGraph title="A line that rises, then goes flat. The flat part is highlighted: the velocity is not changing. Flat means a steady speed and no acceleration." side={<g>
    <Floor x1={342} x2={530} y={138} />
    <Car x={436} y={138} s={0.72} />
    {[0, 1].map(i => <Arrow key={i} from={[376, 50 + i * 22]} to={[450, 50 + i * 22]} colour={mo.velocity} width={3} />)}
    <text x={462} y={66} fontSize="13" fontWeight="700" fill={mo.velocity}>same</text>
    <Note x={436} y={160} w={184} size={13} lines={['flat: steady speed,', 'no acceleration']} colour={mo.velocity} fill={mo.velocityFill} line={mo.velocity} />
  </g>}>
    <GLine frame={shapeFrame} pts={[[0, 0], [3, 6]]} dim />
    <GLine frame={shapeFrame} pts={[[3, 6], [9.5, 6]]} hot />
  </ShapeGraph>
  if (focus === 'vtgraph-downhill') return <ShapeGraph title="A straight line falling to the time axis. It is highlighted: the car loses the same amount of speed every second. Sloping down means deceleration." side={<g>
    <Floor x1={342} x2={530} y={138} />
    <Car x={436} y={138} s={0.72} />
    {[76, 52, 28].map((l, i) => <g key={i} opacity={1 - i * 0.3}><Arrow from={[392, 60 + i * 14]} to={[392 + l, 60 + i * 14]} colour={mo.velocity} width={3} /></g>)}
    <text x={436} y={46} textAnchor="middle" fontSize="13" fontWeight="700" fill={mo.velocity}>slowing down</text>
    <Note x={436} y={160} w={184} size={13} lines={['sloping down:', 'deceleration']} colour={mo.drag} fill={mo.dragFill} line={mo.drag} />
  </g>}>
    <GLine frame={shapeFrame} pts={[[0, 8], [8, 0]]} hot />
    <circle cx={s.x(8)} cy={s.y(0)} r="4.5" fill={mo.velocity} />
    <text x={s.x(8) + 8} y={s.y(0) - 10} fontSize="12" fontWeight="700" fill={mo.velocity}>stopped</text>
  </ShapeGraph>
  // vtgraph-curve
  return <ShapeGraph title="Two curves. One gets steeper: the object speeds up faster and faster. A fainter one levels off: its acceleration gets smaller. A curved line means the acceleration is changing." side={<g>
    <Note x={436} y={70} w={184} size={13} lines={['curve: the', 'acceleration', 'is changing']} colour={mo.velocity} fill={mo.velocityFill} line={mo.velocity} />
    <path d="M358 170h30" stroke={mo.velocity} strokeWidth="4" /><text x={396} y={175} fontSize="13" fontWeight="700" fill={ink}>gets steeper</text>
    <g opacity=".45"><path d="M358 200h30" stroke={mo.velocity} strokeWidth="4" strokeDasharray="7 5" /><text x={396} y={205} fontSize="13" fontWeight="700" fill={ink}>levels off</text></g>
  </g>}>
    <GLine frame={shapeFrame} pts={curvePts(t => 0.13 * t * t, 0, 8.4)} hot />
    <g opacity=".5"><path d={s.path(curvePts(t => 7 * (1 - Math.exp(-t / 2.4)), 0, 9.5))} stroke={mo.velocity} strokeWidth="3.2" fill="none" strokeDasharray="7 5" /></g>
  </ShapeGraph>
}

/* ---------- Section 3: gradient = acceleration (one graph) ---------- */

const gFrame: GraphFrame = { x: 70, y: 44, width: 220, height: 196, xMax: 4.6, yMax: 13.5 }
function Gradient({ step }: { step: 1 | 2 | 3 | 4 | 5 }) {
  const s = graphScale(gFrame)
  const titles = [
    'A velocity-time graph: a car speeds up in a straight line from 0 m/s to 12 m/s in 4 s. The gradient, or steepness, of the line is the acceleration.',
    'A large right-angled triangle is drawn under the line, with the line as its slanted side. A small faded triangle is too small to read accurately.',
    'The triangle sides are read: the upright side is 12 minus 0, which is 12 m/s. The flat side is 4 minus 0, which is 4 s.',
    'Gradient equals change in velocity divided by change in time: 12 divided by 4 equals 3.',
    'The acceleration of the car is 3 metres per second squared.',
  ]
  const o: Pt = s.pt(0, 0), c: Pt = s.pt(4, 0), t: Pt = s.pt(4, 12)
  return <PhysicsDiagram title={titles[step - 1]}>
    <VtAxes frame={gFrame} xTicks={range(0, 4, 1)} yTicks={range(0, 12, 4)} />
    {step >= 2 && <path d={`M${o[0]} ${o[1]}L${c[0]} ${c[1]}L${t[0]} ${t[1]}Z`} fill={mo.accelFill} fillOpacity=".7" stroke={mo.accel} strokeWidth="2" strokeDasharray="6 4" />}
    {step >= 2 && <path d={`M${c[0] - 12} ${c[1]}V${c[1] - 12}H${c[0]}`} stroke={mo.accel} strokeWidth="1.6" fill="none" />}
    {step === 2 && <g opacity=".5">
      <path d={`M${s.x(1)} ${s.y(3)}L${s.x(1.6)} ${s.y(3)}L${s.x(1.6)} ${s.y(4.8)}Z`} fill="white" stroke={muted} strokeWidth="1.6" />
      <text x={s.x(1.6) + 8} y={s.y(3.4)} fontSize="12" fontWeight="700" fill={muted}>too small</text>
    </g>}
    <GLine frame={gFrame} pts={[[0, 0], [4, 12]]} hot={step === 1} />
    {step >= 3 && <g>
      <path d={`M${t[0]} ${t[1]}V${c[1]}`} stroke={mo.velocity} strokeWidth="4" />
      <path d={`M${o[0]} ${o[1]}H${c[0]}`} stroke={mo.time} strokeWidth="4" />
    </g>}
    {step === 1 && <g>
      <Note x={420} y={70} w={200} size={14} lines={['gradient =', 'steepness =', 'acceleration']} colour={mo.accel} fill={mo.accelFill} line={mo.accel} />
      <Tag x={420} y={200} text="0 to 12 m/s in 4 s" colour={mo.velocity} />
    </g>}
    {step === 2 && <g>
      <Note x={420} y={70} w={200} size={14} lines={['draw a big', 'triangle under', 'the line']} colour={mo.accel} fill={mo.accelFill} line={mo.accel} />
      <text x={420} y={196} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>bigger triangle,</text>
      <text x={420} y={214} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>more accurate answer</text>
    </g>}
    {step >= 3 && <g>
      <rect x={326} y={52} width={200} height={100} rx="12" fill={P.panel} stroke={P.panelLine} strokeWidth="1.6" />
      <text x={336} y={76} fontSize="13" fontWeight="700" fill={mo.velocity}>upright side:</text>
      <text x={336} y={96} fontSize="15" fontWeight="700" fill={mo.velocity}>12 − 0 = 12 m/s</text>
      <text x={336} y={120} fontSize="13" fontWeight="700" fill={mo.time}>flat side:</text>
      <text x={336} y={140} fontSize="15" fontWeight="700" fill={mo.time}>4 − 0 = 4 s</text>
      <text x={t[0] + 8} y={(t[1] + c[1]) / 2 + 5} fontSize="13" fontWeight="700" fill={mo.velocity} stroke="white" strokeWidth="4" paintOrder="stroke">12 m/s</text>
      <text x={(o[0] + c[0]) / 2 + 20} y={c[1] - 10} textAnchor="middle" fontSize="13" fontWeight="700" fill={mo.time} stroke="white" strokeWidth="4" paintOrder="stroke">4 s</text>
    </g>}
        {step >= 4 && <g>
      <rect x={320} y={166} width={212} height={46} rx="12" fill={mo.accelFill} stroke={mo.accel} strokeWidth="2" />
      <text x={426} y={195} textAnchor="middle" fontSize="15" fontWeight="800" fill={mo.accel}>gradient = 12 ÷ 4 = 3</text>
      {step === 5 && <g>
        <rect x={320} y={224} width={212} height={46} rx="12" fill="white" stroke={P.useful} strokeWidth="2" />
        <Tick x={340} y={247} s={0.8} />
        <text x={358} y={252} fontSize="14" fontWeight="800" fill={ink}>acceleration = 3 m/s²</text>
      </g>}
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 4: fluids and drag ---------- */

function Glass({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 52} ${y - 150}L${x - 44} ${y}H${x + 44}L${x + 52} ${y - 150}`} fill="none" stroke="#8fa4b3" strokeWidth="2.6" />
    <path d={`M${x - 50} ${y - 128}L${x - 44} ${y - 2}H${x + 44}L${x + 50} ${y - 128}Z`} fill={P.water} stroke="none" />
    <path d={`M${x - 50} ${y - 128}q12 -5 25 0t25 0t25 0t25 0`} stroke={P.waterLine} strokeWidth="2" fill="none" />
  </g>
}
function Puff({ x, y }: { x: number; y: number }) {
  return <g fill="#f1f5f8" stroke="#b9c7d2" strokeWidth="2">
    <path d={`M${x - 60} ${y + 30}Q${x - 82} ${y + 4} ${x - 54} ${y - 16}Q${x - 50} ${y - 50} ${x - 14} ${y - 44}Q${x + 6} ${y - 70} ${x + 34} ${y - 46}Q${x + 72} ${y - 44} ${x + 64} ${y - 8}Q${x + 86} ${y + 20} ${x + 54} ${y + 34}Q${x} ${y + 48} ${x - 60} ${y + 30}Z`} />
  </g>
}
function Drag({ focus }: { focus: string }) {
  if (focus === 'vtgraph-fluid') return <PhysicsDiagram title="A glass of water and a puff of air side by side. Both are fluids. A ball moves through each one, and the fluid pushes back on it.">
    <Glass x={140} y={236} />
    <Ball x={140} y={170} r={16} />
    <path d="M132 146q8 -8 0 -16M148 146q-8 -8 0 -16" stroke={P.waterLine} strokeWidth="1.8" fill="none" opacity=".7" />
    <Arrow from={[140, 196]} to={[140, 226]} colour={ink} width={2.6} />
    <Tag x={140} y={270} text="water: a liquid" colour={P.waterLine} />
    <Puff x={396} y={140} />
    <Ball x={404} y={130} r={16} />
    <Motion x={372} y={130} len={28} colour={muted} />
    <Tag x={396} y={270} text="air: a gas" colour={muted} />
    <Tag x={140} y={40} text="fluid" colour={ink} fill={P.panel} />
    <Tag x={396} y={40} text="fluid" colour={ink} fill={P.panel} />
  </PhysicsDiagram>
  if (focus === 'vtgraph-drag') return <PhysicsDiagram title="A ball falling through air. A small arrow on the ball points up: drag, which in air is called air resistance. The ball is moving down.">
    <Ball x={220} y={150} r={30} />
    <FallLines x={220} y={116} n={2} len={34} gap={52} />
    <Force from={[220, 110]} to={[220, 60]} colour={mo.drag} lines={['drag', '(air resistance)']} at="right" />
    <Arrow from={[300, 130]} to={[300, 230]} colour={mo.velocity} width={3} />
    <text x={312} y={186} fontSize="13" fontWeight="700" fill={mo.velocity}>moving down</text>
    <Caption text="Drag pushes against the movement." y={284} />
  </PhysicsDiagram>
  if (focus === 'vtgraph-drag-dir') return <PhysicsDiagram title="A car moving to the right. A long arrow to the right shows the movement. A red arrow to the left shows drag, in the opposite direction.">
    <Floor x1={40} x2={500} y={200} />
    <Car x={270} y={200} s={1.3} />
        <Arrow from={[200, 72]} to={[400, 72]} colour={mo.velocity} width={4} />
    <text x={300} y={58} textAnchor="middle" fontSize="14" fontWeight="700" fill={mo.velocity}>movement</text>
    <Force from={[200, 164]} to={[110, 164]} colour={mo.drag} label="drag" at="end" />
    <Caption text="Drag acts in the opposite direction to the movement." y={250} />
  </PhysicsDiagram>
  // vtgraph-drag-speed
  return <PhysicsDiagram title="Two cyclists. The slow cyclist at 3 m/s has a short drag arrow. The fast cyclist at 10 m/s has a long drag arrow. Faster means more drag.">
    {[{ y: 130, v: '3 m/s', len: 34, name: 'slow' }, { y: 272, v: '10 m/s', len: 110, name: 'fast' }].map(c => <g key={c.name}>
      <Floor x1={140} x2={520} y={c.y} />
      <Bike x={340} y={c.y} s={0.9} />
      <Tag x={460} y={c.y - 96} text={c.v} colour={mo.velocity} />
      <Force from={[322, c.y - 66]} to={[322 - c.len, c.y - 66]} colour={mo.drag} label="drag" at="end" />
    </g>)}
  </PhysicsDiagram>
}

/* ---------- Section 5: terminal velocity (skydiver + growing graph) ---------- */

const tFrame: GraphFrame = { x: 300, y: 44, width: 210, height: 172, xMax: 12, yMax: 60 }
const vTerm = (t: number) => 55 * (1 - Math.exp(-t / 2.6))
function Terminal({ step }: { step: 1 | 2 | 3 | 4 | 5 }) {
  const s = graphScale(tFrame)
  const drag = [16, 38, 60, 74, 74][step - 1], weight = 74
  const tEnd = [0.8, 2.6, 5.2, 12, 12][step - 1]
  const titles = [
    'A skydiver has just jumped. Her weight arrow down is long and the drag arrow up is tiny, so she speeds up. The velocity-time graph starts steeply.',
    'She is falling faster. The drag arrow has grown, and her weight is the same. The graph line keeps rising.',
    'The drag arrow is nearly as long as the weight arrow. The resultant force gets smaller, so the graph gets flatter.',
    'The drag and weight arrows are equal. Drag equals weight, so the resultant force is zero and the graph line is flat.',
    'The whole velocity-time curve. It rises steeply, curves over and becomes flat. The flat part is labelled terminal velocity.',
  ]
  const cx = 120, cy = 160
  const end = s.pt(tEnd, vTerm(tEnd))
  return <PhysicsDiagram title={titles[step - 1]}>
    <Skydiver x={cx} y={cy} s={0.92} />
    <FallLines x={cx - 62} y={cy - 66} n={2} gap={12} len={step === 1 ? 14 : 26} />
    <FallLines x={cx + 62} y={cy - 66} n={2} gap={12} len={step === 1 ? 14 : 26} />
    <Force from={[cx, cy - 58]} to={[cx, cy - 58 - drag]} colour={mo.drag} label="drag" at="end" width={6} />
    <Force from={[cx, cy + 10]} to={[cx, cy + 10 + weight]} colour={mo.weight} label="weight" at="end" width={6} />
    <GraphAxes frame={tFrame} xLabel="Time" xUnit="s" yLabel="Velocity" yUnit="m/s" xTicks={[0, 4, 8, 12]} yTicks={[0, 20, 40, 60]} grid />
    {step === 5 && <path d={`M${s.x(6.5)} ${s.y(55)}H${s.x(12)}`} stroke={mo.velocityFill} strokeWidth="14" />}
    <GLine frame={tFrame} pts={curvePts(vTerm, 0, tEnd)} />
    {step < 5 && <circle cx={end[0]} cy={end[1]} r="5" fill={mo.velocity} stroke="white" strokeWidth="1.6" />}
    {step === 3 && <Tag x={405} y={286} text="resultant force gets smaller" colour={mo.resultant} />}
    {step === 4 && <Tag x={405} y={286} text="drag = weight: resultant force zero" colour={mo.resultant} size={12} />}
    {step === 1 && <Tag x={405} y={286} text="weight bigger than drag" colour={mo.weight} />}
    {step === 2 && <Tag x={405} y={286} text="faster, so more drag" colour={mo.drag} />}
    {step === 5 && <g>
      <text x={s.x(9.2)} y={s.y(55) - 14} textAnchor="middle" fontSize="13" fontWeight="800" fill={mo.velocity}>terminal velocity</text>
      <Tag x={405} y={286} text="falls at a steady speed" colour={mo.velocity} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Question visuals (no triangles, no answers) ---------- */

function QLine({ title, frame, pts, xTicks, yTicks }: { title: string; frame: GraphFrame; pts: Pt[]; xTicks: number[]; yTicks: number[] }) {
  const s = graphScale(frame)
  return <PhysicsDiagram title={title} schematic={false}>
    <VtAxes frame={frame} xTicks={xTicks} yTicks={yTicks} />
    <GLine frame={frame} pts={pts} />
    {pts.map(([x, y], i) => <circle key={i} cx={s.x(x)} cy={s.y(y)} r="4.5" fill={mo.velocity} />)}
  </PhysicsDiagram>
}
function Journey() {
  const f: GraphFrame = { x: 80, y: 44, width: 400, height: 200, xMax: 11, yMax: 10 }, s = graphScale(f)
  const pts: Pt[] = [[0, 0], [4, 8], [8, 8], [10, 0]]
  const marks: Array<[number, Pt, Pt]> = [[1, [1.2, 7.4], [2, 4]], [2, [6, 9.6], [6, 8]], [3, [10.4, 6.4], [9, 4]]]
  return <PhysicsDiagram title="A velocity-time graph of a journey in three numbered parts: part 1 from 0 to 4 s, part 2 from 4 to 8 s, and part 3 from 8 to 10 s." schematic={false}>
    <VtAxes frame={f} xTicks={range(0, 10, 2)} yTicks={range(0, 10, 2)} />
    <GLine frame={f} pts={pts} />
    {marks.map(([n, at, to]) => <g key={n}>
      <path d={`M${s.x(at[0])} ${s.y(at[1])}L${s.x(to[0])} ${s.y(to[1])}`} stroke={ink} strokeWidth="1.4" />
      <circle cx={s.x(to[0])} cy={s.y(to[1])} r="2.8" fill={ink} />
      <Num n={n} x={s.x(at[0])} y={s.y(at[1])} state="active" />
    </g>)}
  </PhysicsDiagram>
}

export function VtGraphVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  if (['vtgraph-axes', 'vtgraph-uphill', 'vtgraph-flat', 'vtgraph-downhill', 'vtgraph-curve'].includes(focus)) return <Shapes focus={focus} />
  const g = /^vtgraph-g([1-5])$/.exec(focus)
  if (g) return <Gradient step={Number(g[1]) as 1 | 2 | 3 | 4 | 5} />
  if (['vtgraph-fluid', 'vtgraph-drag', 'vtgraph-drag-dir', 'vtgraph-drag-speed'].includes(focus)) return <Drag focus={focus} />
  const t = /^vtgraph-term([1-5])$/.exec(focus)
  if (t) return <Terminal step={Number(t[1]) as 1 | 2 | 3 | 4 | 5} />
  if (focus === 'vtgraph-q-cyclist') return <QLine title="A velocity-time graph for a cyclist: a straight line from 2 m/s at 0 s to 10 m/s at 4 s." frame={{ x: 80, y: 44, width: 380, height: 196, xMax: 5, yMax: 12 }} pts={[[0, 2], [4, 10]]} xTicks={range(0, 5, 1)} yTicks={range(0, 12, 2)} />
  if (focus === 'vtgraph-q-bike') return <QLine title="A velocity-time graph for a motorbike: a straight line from 4 m/s at 0 s to 24 m/s at 5 s." frame={{ x: 80, y: 44, width: 380, height: 196, xMax: 6, yMax: 28 }} pts={[[0, 4], [5, 24]]} xTicks={range(0, 6, 1)} yTicks={range(0, 28, 4)} />
  if (focus === 'vtgraph-q-journey') return <Journey />
  return null
}
