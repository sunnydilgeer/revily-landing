import type { ReactNode } from 'react'
import { physicsPalette, PhysicsDiagram, Lines, GraphAxes, graphScale, type Pt, type GraphFrame } from './PhysicsKit'
import { Arrow, CurveArrow, Magnifier, Chip, seeded, r1, faded } from './GasParticleVisuals'
import { Tick } from './EnergyStoreVisuals'

/*
 * Physics Lesson 36: Half-life. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'halflife-' and is routed from CellBiologyVisuals.tsx.
 *
 * The radiation pieces (unstable nucleus, decayed nucleus, wavy rays, a sealed source, the trefoil sign) are
 * exported so the irradiation and contamination lesson draws with exactly the same parts and colours:
 * unstable (radioactive) nuclei are orange-red, decayed nuclei are grey, radiation is a thin wavy orange-red ray.
 * Activity bars and readings use the same orange-red; time uses the violet the course uses for "how long".
 */
const P = physicsPalette
const { ink, muted } = P
export const radiation = { fill: '#f8c9ad', line: '#c9542c', ray: '#d0603a', soft: '#fdeee4' }
export const decayed = { fill: '#e6ebef', line: '#9aabb8' }
const timeColour = P.pd, timeFill = P.pdFill

/* ---------- Radiation pieces (shared with the irradiation lesson) ---------- */

/** A nucleus: orange-red while unstable, grey once it has decayed. */
export function Nucleus({ x, y, r = 10, done = false, strong = false }: { x: number; y: number; r?: number; done?: boolean; strong?: boolean }) {
  const c = done ? decayed : radiation
  return <g>
    <circle cx={x} cy={y} r={r} fill={c.fill} stroke={c.line} strokeWidth={strong ? 2.6 : 1.8} />
    {!done && <circle cx={r1(x - r * 0.35)} cy={r1(y - r * 0.38)} r={r1(r * 0.28)} fill="white" opacity=".75" />}
  </g>
}

/** A thin wavy ray of radiation from `from` to `to`, with a small arrowhead. */
export function Ray({ from, to, colour = radiation.ray, width = 2.2, waves = 4, amp = 4 }: { from: Pt; to: Pt; colour?: string; width?: number; waves?: number; amp?: number }) {
  const dx = to[0] - from[0], dy = to[1] - from[1], len = Math.hypot(dx, dy) || 1
  const ux = dx / len, uy = dy / len, nx = -uy, ny = ux, head = 7 + width
  const body = len - head * 0.7, n = Math.max(12, Math.round(body / 3))
  let d = ''
  for (let i = 0; i <= n; i++) {
    const t = body * i / n, fade = Math.min(1, t / 8, (body - t) / 8 + 0.15)
    const w = Math.sin(t / body * waves * Math.PI * 2) * amp * fade
    d += `${i ? 'L' : 'M'}${r1(from[0] + ux * t + nx * w)} ${r1(from[1] + uy * t + ny * w)}`
  }
  const b1: Pt = [to[0] - ux * head + nx * head * 0.55, to[1] - uy * head + ny * head * 0.55]
  const b2: Pt = [to[0] - ux * head - nx * head * 0.55, to[1] - uy * head - ny * head * 0.55]
  return <g>
    <path d={d} stroke={colour} strokeWidth={width} fill="none" />
    <path d={`M${to[0]} ${to[1]}L${r1(b1[0])} ${r1(b1[1])}L${r1(to[0] - ux * head * 0.7)} ${r1(to[1] - uy * head * 0.7)}L${r1(b2[0])} ${r1(b2[1])}Z`} fill={colour} stroke={colour} strokeWidth="1" />
  </g>
}

/** The radiation warning sign (trefoil) on a yellow disc. */
export function Trefoil({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  const blade = (a: number) => {
    const a1 = (a - 30) * Math.PI / 180, a2 = (a + 30) * Math.PI / 180, ri = r * 0.26, ro = r * 0.86
    return `M${r1(x + Math.cos(a1) * ri)} ${r1(y + Math.sin(a1) * ri)}L${r1(x + Math.cos(a1) * ro)} ${r1(y + Math.sin(a1) * ro)}A${ro} ${ro} 0 0 1 ${r1(x + Math.cos(a2) * ro)} ${r1(y + Math.sin(a2) * ro)}L${r1(x + Math.cos(a2) * ri)} ${r1(y + Math.sin(a2) * ri)}A${ri} ${ri} 0 0 0 ${r1(x + Math.cos(a1) * ri)} ${r1(y + Math.sin(a1) * ri)}Z`
  }
  return <g>
    <circle cx={x} cy={y} r={r} fill="#fde07a" stroke="#b58a0e" strokeWidth="1.6" />
    <g fill="#3b3b3b">{[-90, 30, 150].map(a => <path key={a} d={blade(a)} />)}</g>
    <circle cx={x} cy={y} r={r * 0.16} fill="#3b3b3b" />
  </g>
}

/** A small sealed school source: a metal capsule on a handle, the radioactive end facing right. (x, y) = the end. */
export function Source({ x, y, s = 1, sign = true }: { x: number; y: number; s?: number; sign?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-92 -5H-44V5H-92Q-96 5 -96 0Q-96 -5 -92 -5Z" fill="#dfe5ea" stroke="#7d8e9c" strokeWidth="1.8" />
    <rect x={-46} y={-17} width={46} height={34} rx="8" fill="#dfe5ea" stroke="#7d8e9c" strokeWidth="2" />
    <path d="M-2 -12Q6 -12 6 0Q6 12 -2 12Z" fill={radiation.fill} stroke={radiation.line} strokeWidth="1.8" />
    {sign && <Trefoil x={-23} y={0} r={11} />}
  </g>
}

/** A soft legend chip for the nucleus colours. */
function NucleusKey({ x, y, dim = false }: { x: number; y: number; dim?: boolean }) {
  return <g opacity={dim ? faded : 1}>
    <Nucleus x={x} y={y} r={8} />
    <text x={x + 14} y={y + 5} fontSize="13" fontWeight="650" fill={ink}>unstable nucleus</text>
    <Nucleus x={x + 168} y={y} r={8} done />
    <text x={x + 182} y={y + 5} fontSize="13" fontWeight="650" fill={ink}>decayed</text>
  </g>
}

/** Organic, slightly jittered positions for n nuclei in a cols × rows block centred on (cx, cy). */
function cluster(cx: number, cy: number, cols: number, rows: number, gap: number, seed: number, jitter = 0.18): Pt[] {
  const rand = seeded(seed), pts: Pt[] = []
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const off = j % 2 ? gap * 0.25 : -gap * 0.25
    pts.push([r1(cx + (i - (cols - 1) / 2) * gap + off + (rand() - 0.5) * gap * jitter * 2), r1(cy + (j - (rows - 1) / 2) * gap * 0.9 + (rand() - 0.5) * gap * jitter * 2)])
  }
  return pts
}
/** Which of n nuclei have decayed: a fixed, random-looking choice of `k` of them. */
function pick(n: number, k: number, seed: number) {
  const rand = seeded(seed), order = Array.from({ length: n }, (_, i) => [rand(), i]).sort((a, b) => a[0] - b[0]).map(p => p[1])
  return new Set(order.slice(0, k))
}

/* ---------- Section 2: count-rate, activity, random decay ---------- */

function GMTube({ x, y }: { x: number; y: number }) {
  // (x, y) = the window end, facing left.
  return <g>
    <rect x={x} y={y - 15} width={110} height={30} rx="12" fill="#eef2f5" stroke="#7d8e9c" strokeWidth="2.2" />
    <path d={`M${x + 4} ${y - 11}Q${x - 3} ${y} ${x + 4} ${y + 11}`} stroke="#5a6b79" strokeWidth="3" fill="none" />
    <path d={`M${x + 20} ${y - 6}H${x + 96}`} stroke="white" strokeWidth="3" opacity=".8" />
  </g>
}
function Counter({ x, y, reading }: { x: number; y: number; reading: string }) {
  return <g>
    <rect x={x} y={y - 44} width={136} height={88} rx="14" fill={P.panel} stroke="#7d8e9c" strokeWidth="2.2" />
    <rect x={x + 26} y={y - 32} width={84} height={40} rx="8" fill="#26343f" />
    <text x={x + 68} y={y - 4} textAnchor="middle" fontSize="24" fontWeight="800" fill="#9ff0c9" fontFamily="monospace">{reading}</text>
    <text x={x + 68} y={y + 28} textAnchor="middle" fontSize="12" fontWeight="700" fill={muted}>counts each second</text>
  </g>
}
function Counting() {
  return <PhysicsDiagram title="A radioactive source gives out radiation. A Geiger-Muller tube picks it up and a counter shows the number of counts each second: the count-rate.">
    <Source x={120} y={150} />
    {[[-26, 0], [0, 0], [26, 0]].map(([dy], i) => <Ray key={i} from={[134, 150 + dy * 0.3]} to={[226, 150 + dy * 0.55]} waves={3} />)}
    <GMTube x={232} y={150} />
    <path d="M342 150C372 150 366 150 390 150" stroke="#5a6b79" strokeWidth="3" fill="none" />
    <Counter x={390} y={150} reading="24" />
    <Lines x={287} y={116} anchor="middle" lines={['Geiger-Muller tube']} size={13} weight={650} colour={muted} />
    <Lines x={458} y={88} anchor="middle" lines={['counter']} size={13} weight={650} colour={muted} />
    <Lines x={70} y={200} anchor="middle" lines={['source']} size={13} weight={650} colour={muted} />
    <Chip x={270} y={262} text="count-rate = counts each second" size={15} line={radiation.line} colour={radiation.line} fill={radiation.soft} />
  </PhysicsDiagram>
}
const INSIDE = cluster(262, 150, 4, 4, 34, 11, 0.12)
function ActivityScene() {
  const burst = new Set([5, 10])
  return <PhysicsDiagram title="Inside the source, unstable nuclei decay one at a time. The activity is the number of decays each second, measured in becquerels, Bq. 1 Bq is 1 decay per second.">
    <Source x={100} y={196} />
    <Magnifier cx={262} cy={146} r={82} from={[104, 196]}>
      <rect x={170} y={54} width={184} height={184} fill={radiation.soft} />
      {INSIDE.map(([x, y], i) => <Nucleus key={i} x={x} y={y} r={11} />)}
      {[...burst].map(i => <g key={i}>
        <circle cx={INSIDE[i][0]} cy={INSIDE[i][1]} r="16" fill="none" stroke={radiation.line} strokeWidth="1.8" strokeDasharray="3 4" />
      </g>)}
    </Magnifier>
    <Ray from={[INSIDE[5][0] + 12, INSIDE[5][1] - 8]} to={[INSIDE[5][0] + 62, INSIDE[5][1] - 52]} waves={2.5} amp={3} />
    <Ray from={[INSIDE[10][0] + 14, INSIDE[10][1] + 4]} to={[INSIDE[10][0] + 82, INSIDE[10][1] + 30]} waves={2.5} amp={3} />
    <Lines x={362} y={64} lines={['activity']} size={20} colour={radiation.line} />
    <Lines x={362} y={92} lines={['decays each second']} size={14} />
    <Lines x={362} y={128} lines={['unit: becquerel, Bq']} size={14} />
    <rect x={362} y={214} width={164} height={52} rx="16" fill="white" stroke={radiation.line} strokeWidth="2" />
    <Lines x={444} y={236} anchor="middle" lines={['1 Bq =', '1 decay per second']} size={13} colour={radiation.line} />
    <Lines x={52} y={246} anchor="middle" lines={['source']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

const TWELVE: Pt[] = [[92, 104], [140, 84], [188, 100], [232, 88], [74, 152], [124, 142], [172, 150], [222, 140], [100, 198], [150, 196], [198, 200], [244, 190]]
function Random() {
  const gone = new Set([1, 6, 8]), next = 11
  return <PhysicsDiagram title="A group of twelve nuclei. Three have already decayed. There is no way to know which of the others will decay next, or when.">
    <path d="M60 92Q70 58 140 62Q226 58 262 88Q284 150 262 210Q220 236 140 232Q62 232 52 180Q44 130 60 92Z" fill={radiation.soft} stroke={P.panelLine} strokeWidth="1.6" />
    {TWELVE.map(([x, y], i) => <Nucleus key={i} x={x} y={y} r={14} done={gone.has(i)} />)}
    <circle cx={TWELVE[next][0]} cy={TWELVE[next][1]} r="20" fill="none" stroke={ink} strokeWidth="2" strokeDasharray="4 4" />
    <path d={`M${TWELVE[next][0] + 16} ${TWELVE[next][1] - 14}L${TWELVE[next][0] + 30} ${TWELVE[next][1] - 28}`} stroke={ink} strokeWidth="2" />
    <circle cx={TWELVE[next][0] + 42} cy={TWELVE[next][1] - 40} r="16" fill="white" stroke={ink} strokeWidth="2" />
    <text x={TWELVE[next][0] + 42} y={TWELVE[next][1] - 33} textAnchor="middle" fontSize="19" fontWeight="800" fill={ink}>?</text>
    <Lines x={330} y={110} lines={['which one next?']} size={17} />
    <Lines x={330} y={146} lines={['when?']} size={17} />
    <Lines x={330} y={190} lines={['no way to know:', 'decay is random']} size={15} colour={radiation.line} />
    <NucleusKey x={64} y={270} />
  </PhysicsDiagram>
}

const MANY = cluster(170, 144, 8, 5, 30, 23, 0.16)
const HALF_OF_MANY = pick(MANY.length, MANY.length / 2, 5)
function Clock({ x, y, r = 26 }: { x: number; y: number; r?: number }) {
  return <g>
    <circle cx={x} cy={y} r={r} fill="white" stroke={timeColour} strokeWidth="2.6" />
    {Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return <path key={i} d={`M${r1(x + Math.cos(a) * (r - 3))} ${r1(y + Math.sin(a) * (r - 3))}L${r1(x + Math.cos(a) * (r - (i % 3 ? 6 : 8)))} ${r1(y + Math.sin(a) * (r - (i % 3 ? 6 : 8)))}`} stroke={timeColour} strokeWidth="1.6" /> })}
    <path d={`M${x} ${y}V${y - r * 0.62}M${x} ${y}L${r1(x + r * 0.45)} ${r1(y + r * 0.2)}`} stroke={ink} strokeWidth="2.6" />
    <circle cx={x} cy={y} r="2.8" fill={ink} />
  </g>
}
function Predict() {
  return <PhysicsDiagram title="A big sample of forty nuclei: after a certain time, half of them have decayed. For a big sample the overall pattern is predictable. That time is the half-life.">
    <path d={`M40 96Q52 60 170 62Q292 60 304 100Q318 150 300 196Q282 228 170 228Q56 230 40 190Q28 146 40 96Z`} fill={radiation.soft} stroke={P.panelLine} strokeWidth="1.6" />
    {MANY.map(([x, y], i) => <Nucleus key={i} x={x} y={y} r={10} done={HALF_OF_MANY.has(i)} />)}
    <Clock x={376} y={82} />
    <Lines x={412} y={78} lines={['after one', 'half-life']} size={14} colour={timeColour} />
    <Lines x={340} y={150} lines={['half have decayed']} size={17} />
    <Lines x={340} y={180} lines={['predictable for a', 'big sample']} size={14} weight={650} colour={muted} />
    <NucleusKey x={64} y={270} />
  </PhysicsDiagram>
}

/* ---------- Section 3: what half-life means ---------- */

const LEFT16 = cluster(126, 118, 4, 4, 34, 41, 0.12), RIGHT16 = cluster(414, 118, 4, 4, 34, 41, 0.12)
const HALF16 = pick(16, 8, 3)
function Meter({ x, y, value, frac }: { x: number; y: number; value: string; frac: number }) {
  return <g>
    <rect x={x - 70} y={y - 20} width={140} height={40} rx="20" fill="white" stroke={radiation.line} strokeWidth="2" />
    <rect x={x - 62} y={y + 6} width={124} height={8} rx="4" fill={radiation.soft} />
    <rect x={x - 62} y={y + 6} width={r1(124 * frac)} height={8} rx="4" fill={radiation.line} />
    <text x={x} y={y + 1} textAnchor="middle" fontSize="16" fontWeight="800" fill={radiation.line}>{value}</text>
  </g>
}
function Halving({ activity }: { activity: boolean }) {
  return <PhysicsDiagram title={activity ? 'After one half-life, half of the unstable nuclei have decayed, so the activity also halves: 800 Bq falls to 400 Bq.' : 'Sixteen unstable nuclei at the start. After one half-life, eight have decayed and eight unstable nuclei are left: the number halves.'}>
    <Lines x={126} y={34} anchor="middle" lines={['start: 16 unstable']} size={14} />
    <Lines x={414} y={34} anchor="middle" lines={['8 unstable left']} size={14} />
    {LEFT16.map(([x, y], i) => <Nucleus key={`l${i}`} x={x} y={y} r={12} />)}
    {RIGHT16.map(([x, y], i) => <Nucleus key={`r${i}`} x={x} y={y} r={12} done={HALF16.has(i)} />)}
    <Clock x={270} y={84} r={20} />
    <CurveArrow from={[214, 128]} to={[326, 128]} bend={0.18} colour={timeColour} width={3.2} />
    <Lines x={270} y={172} anchor="middle" lines={['one half-life']} size={14} colour={timeColour} />
    {activity
      ? <g>
        <Meter x={126} y={222} value="800 Bq" frac={1} />
        <Meter x={414} y={222} value="400 Bq" frac={0.5} />
        <Lines x={270} y={228} anchor="middle" lines={['activity']} size={13} weight={650} colour={muted} />
        <Chip x={270} y={282} text="activity halves too" size={15} line={radiation.line} colour={radiation.line} fill={radiation.soft} />
      </g>
      : <Chip x={270} y={250} text="the number of unstable nuclei halves" size={15} line={radiation.line} colour={radiation.line} fill={radiation.soft} />}
  </PhysicsDiagram>
}

function Chain() {
  const values = [800, 400, 200, 100], xs = [96, 212, 328, 444], base = 214, maxH = 164
  return <PhysicsDiagram schematic={false} title="The activity of a source halving again and again: 800 Bq, 400 Bq, 200 Bq, 100 Bq. Each step takes one half-life.">
    <path d={`M40 ${base}H500`} stroke={ink} strokeWidth="2" />
    {values.map((v, i) => {
      const h = maxH * v / 800
      return <g key={v}>
        <rect x={xs[i] - 30} y={r1(base - h)} width={60} height={r1(h)} rx="10" fill={radiation.fill} stroke={radiation.line} strokeWidth="2" />
        <text x={xs[i]} y={r1(base - h - 10)} textAnchor="middle" fontSize="16" fontWeight="800" fill={radiation.line}>{v} Bq</text>
      </g>
    })}
    {xs.slice(0, 3).map((x, i) => <g key={x}>
      <Arrow from={[x + 12, 242]} to={[xs[i + 1] - 12, 242]} colour={timeColour} width={2.6} />
      <text x={(x + xs[i + 1]) / 2} y={270} textAnchor="middle" fontSize="13" fontWeight="700" fill={timeColour}>one half-life</text>
    </g>)}
    <Lines x={270} y={294} anchor="middle" lines={['each step takes the same time']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

function Same() {
  const xs = [150, 302, 454], rows: Array<[string, number[]]> = [['A', [800, 400, 200]], ['B', [80, 40, 20]]]
  return <PhysicsDiagram schematic={false} title="Two sources of the same isotope, one starting at 800 Bq and one at 80 Bq. Each halves in the same time: one half-life, whatever the starting activity.">
    {xs.map(x => <path key={x} d={`M${x} 44V214`} stroke={P.panelLine} strokeWidth="1.6" strokeDasharray="5 6" />)}
    {rows.map(([name, vals], j) => {
      const y = 82 + j * 92
      return <g key={name}>
        <circle cx={38} cy={y} r="15" fill="white" stroke={ink} strokeWidth="2" />
        <text x={38} y={y + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill={ink}>{name}</text>
        {vals.map((v, i) => <g key={v}>
          <rect x={xs[i] - 46} y={y - 18} width={92} height={36} rx="18" fill={radiation.soft} stroke={radiation.line} strokeWidth="2" />
          <text x={xs[i]} y={y + 6} textAnchor="middle" fontSize="16" fontWeight="800" fill={radiation.line}>{v} Bq</text>
          {i < 2 && <Arrow from={[xs[i] + 52, y]} to={[xs[i + 1] - 52, y]} colour={ink} width={2.2} />}
        </g>)}
      </g>
    })}
    <path d={`M${xs[0]} 232H${xs[2]}`} stroke={timeColour} strokeWidth="2.4" />
    {xs.map(x => <path key={x} d={`M${x} 224V240`} stroke={timeColour} strokeWidth="2.4" />)}
    {[0, 1].map(i => <text key={i} x={(xs[i] + xs[i + 1]) / 2} y={256} textAnchor="middle" fontSize="13" fontWeight="700" fill={timeColour}>one half-life</text>)}
    <Chip x={302} y={288} text="same time each step" size={14} line={timeColour} colour={timeColour} fill={timeFill} />
  </PhysicsDiagram>
}

/* ---------- Section 4: reading half-life off a graph ---------- */

const GF: GraphFrame = { x: 96, y: 40, width: 384, height: 196, xMax: 7, yMax: 900 }
const decay = (a0: number, half: number, tMax: number, steps = 60): Pt[] => Array.from({ length: steps + 1 }, (_, i) => { const t = tMax * i / steps; return [t, a0 * Math.pow(0.5, t / half)] })
function ReadGraph({ step }: { step: 1 | 2 | 3 | 4 }) {
  const s = graphScale(GF), accent = radiation.line, old = muted
  const guide = (pts: Pt[], on: boolean) => <path d={s.path(pts)} stroke={on ? accent : old} strokeWidth={on ? 2.4 : 1.6} strokeDasharray="6 5" fill="none" opacity={on ? 1 : 0.7} />
  const titles = {
    1: 'An activity-time graph for a source. At time zero the activity is 800 Bq: that is the starting activity.',
    2: 'Half of 800 Bq is 400 Bq. A dashed line goes across from 400 Bq on the activity axis to the curve.',
    3: 'From the curve, a dashed line goes straight down to the time axis at 2 s. The half-life is 2 s.',
    4: 'Halving again: 400 Bq to 200 Bq is reached at 4 s, another 2 s later. The half-life stays the same, 2 s.',
  }
  return <PhysicsDiagram schematic={false} title={titles[step]}>
    <GraphAxes frame={GF} xLabel="Time" xUnit="s" yLabel="Activity" yUnit="Bq" xTicks={[1, 2, 3, 4, 5, 6]} yTicks={[200, 400, 600, 800]} grid />
    <path d={s.path(decay(800, 2, 7))} stroke={ink} strokeWidth="3.2" fill="none" />
    {/* step 1: the start */}
    <circle cx={s.x(0)} cy={s.y(800)} r="7" fill="white" stroke={step === 1 ? accent : old} strokeWidth="2.6" />
    {step === 1 && <Lines x={s.x(0) + 18} y={s.y(800) + 5} lines={['start: 800 Bq']} size={15} colour={accent} />}
    {/* step 2: across from 400 */}
    {step >= 2 && guide([[0, 400], [2, 400]], step === 2)}
    {step === 2 && <Lines x={s.x(2) + 14} y={s.y(400) - 10} lines={['half of 800 = 400']} size={15} colour={accent} />}
    {/* step 3: down to 2 s */}
    {step >= 3 && guide([[2, 400], [2, 0]], step === 3)}
    {step >= 2 && <circle cx={s.x(2)} cy={s.y(400)} r="5" fill={step <= 3 ? accent : old} />}
    {step === 3 && <g>
      <circle cx={s.x(2)} cy={s.y(0)} r="6" fill={accent} />
      <rect x={s.x(3)} y={s.y(600) - 20} width={138} height={32} rx="16" fill="white" stroke={accent} strokeWidth="2" />
      <text x={s.x(3) + 69} y={s.y(600) + 1} textAnchor="middle" fontSize="15" fontWeight="800" fill={accent}>half-life = 2 s</text>
    </g>}
    {/* step 4: check with 200 Bq at 4 s */}
    {step === 4 && <g>
      {guide([[0, 200], [4, 200], [4, 0]], true)}
      <circle cx={s.x(4)} cy={s.y(200)} r="5" fill={accent} />
      {[[0, 2], [2, 4]].map(([a, b]) => <g key={a}>
        <path d={`M${s.x(a) + 3} ${s.y(0) - 16}H${s.x(b) - 3}`} stroke={timeColour} strokeWidth="2.4" />
        <path d={`M${s.x(a) + 3} ${s.y(0) - 22}v12M${s.x(b) - 3} ${s.y(0) - 22}v12`} stroke={timeColour} strokeWidth="2.4" />
        <text x={(s.x(a) + s.x(b)) / 2} y={s.y(0) - 24} textAnchor="middle" fontSize="14" fontWeight="800" fill={timeColour} stroke="white" strokeWidth="4" paintOrder="stroke">2 s</text>
      </g>)}
      <Lines x={s.x(4) + 14} y={s.y(200) - 10} lines={['half of 400 = 200']} size={14} colour={accent} />
    </g>}
  </PhysicsDiagram>
}

/** The question graph: 400 Bq at the start, halving every 10 minutes; gridlines every 5 minutes and 100 Bq. */
const QF: GraphFrame = { x: 96, y: 40, width: 390, height: 196, xMax: 32, yMax: 440 }
function QuestionGraph() {
  const s = graphScale(QF)
  return <PhysicsDiagram schematic={false} title="Graph of activity against time for a radioactive source.">
    <g stroke={P.grid} strokeWidth="1">
      {[5, 10, 15, 20, 25, 30].map(v => <path key={v} d={`M${s.x(v)} ${QF.y + 8}V${QF.y + QF.height}`} />)}
      {[100, 200, 300, 400].map(v => <path key={v} d={`M${QF.x} ${s.y(v)}H${QF.x + QF.width}`} />)}
    </g>
    <GraphAxes frame={QF} xLabel="Time" xUnit="minutes" yLabel="Activity" yUnit="Bq" xTicks={[10, 20, 30]} yTicks={[100, 200, 300, 400]} />
    <path d={s.path(decay(400, 10, 32))} stroke={ink} strokeWidth="3.2" fill="none" />
  </PhysicsDiagram>
}

/* ---------- Section 5: worked example, 96 Bq to 12 Bq in 15 minutes ---------- */

function Worked({ step }: { step: 1 | 2 | 3 | 4 }) {
  const values = [96, 48, 24, 12], xs = [96, 212, 328, 444], base = 164, maxH = 116
  const titles = {
    1: 'A source falls from 96 Bq to 12 Bq in 15 minutes. Halve 96 again and again: 96, 48, 24, 12.',
    2: 'Count the halvings: 96 to 48 is one, 48 to 24 is two, 24 to 12 is three. So 15 minutes is three half-lives.',
    3: 'Share the 15 minutes equally between the three half-lives: 15 ÷ 3.',
    4: '15 ÷ 3 = 5. Each half-life is 5 minutes, so the half-life is 5 minutes.',
  }
  const parts: ReactNode[] = []
  for (let i = 0; i < 3; i++) {
    const a = xs[i], b = xs[i + 1], on = step === 4 && i === 0
    parts.push(<g key={i}>
      {step >= 3 && <rect x={a + 2} y={228} width={b - a - 4} height={26} rx="10" fill={on ? timeColour : timeFill} stroke={timeColour} strokeWidth="1.8" opacity={step === 4 && !on ? 0.75 : 1} />}
      {step === 3 && <text x={(a + b) / 2} y={246} textAnchor="middle" fontSize="14" fontWeight="800" fill={timeColour}>?</text>}
      {step === 4 && <text x={(a + b) / 2} y={246} textAnchor="middle" fontSize="14" fontWeight="800" fill={on ? 'white' : timeColour}>5 min</text>}
    </g>)
  }
  return <PhysicsDiagram schematic={false} title={titles[step]}>
    <path d={`M44 ${base}H496`} stroke={ink} strokeWidth="2" />
    {values.map((v, i) => {
      const h = maxH * v / 96
      return <g key={v}>
        <rect x={xs[i] - 26} y={r1(base - h)} width={52} height={r1(h)} rx="9" fill={radiation.fill} stroke={radiation.line} strokeWidth="2" />
        <text x={xs[i]} y={r1(base - h - 9)} textAnchor="middle" fontSize="16" fontWeight="800" fill={radiation.line}>{v} Bq</text>
      </g>
    })}
    {xs.slice(0, 3).map((x, i) => <g key={x}>
      <Arrow from={[x + 14, 192]} to={[xs[i + 1] - 14, 192]} colour={ink} width={2.4} />
      <text x={(x + xs[i + 1]) / 2 + (step >= 2 ? 12 : 0)} y={184} textAnchor="middle" fontSize="14" fontWeight="800" fill={ink}>÷ 2</text>
      {step >= 2 && <g>
        <circle cx={(x + xs[i + 1]) / 2 - 22} cy={179} r="10" fill={step === 2 ? timeColour : 'white'} stroke={timeColour} strokeWidth="1.8" />
        <text x={(x + xs[i + 1]) / 2 - 22} y={183.5} textAnchor="middle" fontSize="12" fontWeight="800" fill={step === 2 ? 'white' : timeColour}>{i + 1}</text>
      </g>}
    </g>)}
    {step === 2 && <Chip x={270} y={236} text="3 halvings = 3 half-lives" size={15} line={timeColour} colour={timeColour} fill={timeFill} />}
    {step !== 2 && <g>
      {step < 3 && <rect x={xs[0] + 2} y={228} width={xs[3] - xs[0] - 4} height={26} rx="10" fill={timeFill} stroke={timeColour} strokeWidth="1.8" />}
      {parts}
      <text x={270} y={276} textAnchor="middle" fontSize="14" fontWeight="750" fill={timeColour}>{step === 3 ? '15 minutes ÷ 3 half-lives' : 'total time: 15 minutes'}</text>
    </g>}
    {step === 4 && <g>
      <rect x={282} y={14} width={248} height={38} rx="19" fill="white" stroke={P.useful} strokeWidth="2.2" />
      <text x={392} y={39} textAnchor="middle" fontSize="16" fontWeight="800" fill={ink}>half-life = 5 minutes</text>
      <Tick x={510} y={33} s={0.8} />
    </g>}
  </PhysicsDiagram>
}

export function HalfLifeVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'halflife-count': return <Counting />
    case 'halflife-activity': return <ActivityScene />
    case 'halflife-random': return <Random />
    case 'halflife-predict': return <Predict />
    case 'halflife-def': return <Halving activity={false} />
    case 'halflife-steps': return <Halving activity />
    case 'halflife-chain': return <Chain />
    case 'halflife-same': return <Same />
    case 'halflife-graph-initial': return <ReadGraph step={1} />
    case 'halflife-graph-half': return <ReadGraph step={2} />
    case 'halflife-graph-time': return <ReadGraph step={3} />
    case 'halflife-graph-check': return <ReadGraph step={4} />
    case 'halflife-w-halve': return <Worked step={1} />
    case 'halflife-w-count': return <Worked step={2} />
    case 'halflife-w-divide': return <Worked step={3} />
    case 'halflife-w-answer': return <Worked step={4} />
    case 'halflife-q-graph': return <QuestionGraph />
    default: return null
  }
}
