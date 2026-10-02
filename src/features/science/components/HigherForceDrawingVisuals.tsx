import type { ReactNode } from 'react'
import { physicsPalette, PhysicsDiagram, type Pt } from './PhysicsKit'
import { Arrow } from './GasParticleVisuals'
import { ForceArrow, Ground, forceTone, type ForceTone } from './ContactForceVisuals'
import { Hand } from './EnergyStoreVisuals'

/*
 * Physics P5, a lesson only some students get (Physics Lesson 40H): calculating forces with scale drawings.
 * Original, code-native schematics; not to scale except where the drawing says so. Focus ids start with 'hfdraw-'.
 *
 * Same force colours as the resultant-forces lesson (ContactForceVisuals forceTone): the first force orange, the second
 * blue, the resultant dark slate, a third (balancing or missing) force purple. Components: horizontal teal, vertical
 * purple (the third-force colour is not used in that section). On the left of most drawings is the object with its
 * force arrows (arrow length ∝ force); on the right is the scale drawing on squared paper, drawn with thin pencil-style arrows, where 1 grid square really is 1 cm (or 1 N).
 * Every number is a 3-4-5 triangle, so each measurement is whole; angles are rounded to the nearest degree.
 * Assessment views never show the answer.
 */
const P = physicsPalette
const { ink, muted } = P
const amber = '#d98a1c', amberSoft = '#fdf0dc', amberInk = '#8a5a14'
const one = forceTone.push.line, two = forceTone.back.line, res = forceTone.resultant.line, third = forceTone.electrostatic.line
const hor = forceTone.tension.line, ver = forceTone.electrostatic.line
const paper = '#fbfcf7', paperLine = '#dfe7d6', paperEdge = '#c9d6c0'
const faded = 0.28
const r1 = (n: number) => Math.round(n * 10) / 10
const rad = (deg: number) => (deg * Math.PI) / 180

function T({ x, y, children, size = 14, colour = ink, bold = true, anchor = 'middle', halo = false }: { x: number; y: number; children: ReactNode; size?: number; colour?: string; bold?: boolean; anchor?: 'start' | 'middle' | 'end'; halo?: boolean }) {
  return <text x={r1(x)} y={r1(y)} textAnchor={anchor} fontSize={size} fontWeight={bold ? 750 : 550} fill={colour} stroke={halo ? 'white' : undefined} strokeWidth={halo ? 4 : undefined} paintOrder={halo ? 'stroke' : undefined}>{children}</text>
}
/** A rounded label card. `tone` amber marks the step the frame is about. */
function Card({ x, y, w, children, tone = 'plain', size = 14, h = 30 }: { x: number; y: number; w: number; children: ReactNode; tone?: 'plain' | 'hot' | 'good'; size?: number; h?: number }) {
  const [fill, line, text] = tone === 'hot' ? [amberSoft, amber, amberInk] : tone === 'good' ? ['#e6f3ea', '#3f8a5f', '#2b6343'] : ['white', P.panelLine, ink]
  return <g><rect x={r1(x - w / 2)} y={r1(y - h / 2)} width={w} height={h} rx={h / 2} fill={fill} stroke={line} strokeWidth={tone === 'plain' ? 1.5 : 2} />
    <text x={x} y={r1(y + size * 0.36)} textAnchor="middle" fontSize={size} fontWeight="750" fill={text}>{children}</text></g>
}
function Num({ n, x, y }: { n: number; x: number; y: number }) {
  return <g><circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="750" fill={ink}>{n}</text></g>
}
/** A soft amber glow that marks the place the frame is about. */
const Glow = ({ x, y, r = 16 }: { x: number; y: number; r?: number }) => <circle cx={x} cy={y} r={r} fill={amberSoft} stroke={amber} strokeWidth="2" strokeDasharray="4 4" />

/** Squared paper: a soft panel with grid lines every `size`, lined up so (ox, oy) sits on a grid corner. */
function Paper({ x, y, w, h, ox, oy, size }: { x: number; y: number; w: number; h: number; ox: number; oy: number; size: number }) {
  const xs: number[] = [], ys: number[] = []
  for (let gx = ox - Math.floor((ox - x) / size) * size; gx <= x + w; gx += size) if (gx > x + 2 && gx < x + w - 2) xs.push(gx)
  for (let gy = oy - Math.floor((oy - y) / size) * size; gy <= y + h; gy += size) if (gy > y + 2 && gy < y + h - 2) ys.push(gy)
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="14" fill={paper} stroke={paperEdge} strokeWidth="1.6" />
    <path d={xs.map(gx => `M${gx} ${y + 2}V${y + h - 2}`).join('') + ys.map(gy => `M${x + 2} ${gy}H${x + w - 2}`).join('')} stroke={paperLine} strokeWidth="1.2" fill="none" />
  </g>
}
/** An angle arc at `o` from the direction `fromDeg` to `toDeg` (degrees, anticlockwise on screen = up), with a label. */
function AngleArc({ o, fromDeg, toDeg, r = 38, label, colour = amberInk }: { o: Pt; fromDeg: number; toDeg: number; r?: number; label?: string; colour?: string }) {
  const p = (d: number, rr: number): Pt => [r1(o[0] + rr * Math.cos(rad(d))), r1(o[1] - rr * Math.sin(rad(d)))]
  const [a, b] = [p(fromDeg, r), p(toDeg, r)]
  const sweep = toDeg > fromDeg ? 0 : 1
  const mid = p((fromDeg + toDeg) / 2, r + 20)
  return <g>
    <path d={`M${a[0]} ${a[1]}A${r} ${r} 0 0 ${sweep} ${b[0]} ${b[1]}`} stroke={colour} strokeWidth="2.4" fill="none" />
    {label && <T x={mid[0]} y={mid[1] + 5} size={14} colour={colour} halo>{label}</T>}
  </g>
}
/** A label placed beside the middle of the line from a to b, on the left-hand side going from a to b. */
function sideLabel(a: Pt, b: Pt, gap: number): Pt {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1
  return [(a[0] + b[0]) / 2 + (dy / l) * gap, (a[1] + b[1]) / 2 - (dx / l) * gap]
}

/* ---------- The object: a metal ring pulled by strings ---------- */

type Pull = { deg: number; n: number; tone: ForceTone; label: string; dim?: boolean; labelAt?: Pt; anchor?: 'start' | 'middle' | 'end' }
function Ring({ c, pulls, k }: { c: Pt; pulls: Pull[]; k: number }) {
  return <g>
    {pulls.map((p, i) => {
      const u: Pt = [Math.cos(rad(p.deg)), -Math.sin(rad(p.deg))]
      const from: Pt = [c[0] + u[0] * 14, c[1] + u[1] * 14], to: Pt = [from[0] + u[0] * p.n * k, from[1] + u[1] * p.n * k]
      return <g key={i}>
        <path d={`M${r1(c[0] + u[0] * 10)} ${r1(c[1] + u[1] * 10)}L${r1(to[0])} ${r1(to[1])}`} stroke="#b9a98f" strokeWidth="1.6" opacity={p.dim ? faded : 0.9} />
        <ForceArrow from={from} to={to} tone={p.tone} width={9} label={p.label} labelAt={p.labelAt} labelAnchor={p.anchor} dim={p.dim} />
      </g>
    })}
    <circle cx={c[0]} cy={c[1]} r="11" fill="white" stroke="#6b7c88" strokeWidth="4.5" />
    <circle cx={c[0]} cy={c[1]} r="11" fill="none" stroke="#c9d3da" strokeWidth="1.5" />
  </g>
}

/* ---------- Section 2: the resultant by scale drawing ---------- */

type ResStage = 'forces' | 'scale' | 'tiptotail' | 'line' | 'measure'
const RES_ORDER: ResStage[] = ['forces', 'scale', 'tiptotail', 'line', 'measure']
const CM = 30
function ResScene({ stage, f1 = 8, f2 = 6, per = 2, angle = 37, worked = false }: { stage: ResStage; f1?: number; f2?: number; per?: number; angle?: number; worked?: boolean }) {
  const at = RES_ORDER.indexOf(stage)
  const a = f1 / per, b = f2 / per, rcm = Math.round(Math.hypot(a, b) * 10) / 10, R = rcm * per
  const O: Pt = [300, 250], A: Pt = [O[0] + a * CM, O[1]], B: Pt = [A[0], A[1] - b * CM]
  const k = 84 / Math.max(f1, f2), C: Pt = [100, 178]
  const rl = sideLabel(O, B, 26)
  const title = worked
    ? `Worked example. Two strings pull a ring, ${f1} N to the right and ${f2} N up. Scale 1 cm = ${per} N: a ${a} cm arrow, then a ${b} cm arrow tip-to-tail. The resultant measures ${rcm} cm, so it is ${R} N at ${angle}° above the horizontal.`
    : {
      forces: `A ring pulled by two strings, ${f1} N to the right and ${f2} N straight up. The forces are at right angles, so the resultant is not ${f1 + f2} N. Beside it, empty squared paper.`,
      scale: `Choosing a scale of 1 cm = ${per} N: ${f1} N becomes a ${a} cm arrow and ${f2} N a ${b} cm arrow. The ${a} cm arrow is drawn to the right on squared paper.`,
      tiptotail: `Tip-to-tail: the ${b} cm arrow for ${f2} N starts at the tip of the ${a} cm arrow for ${f1} N and goes straight up.`,
      line: `The resultant is drawn as a straight line from the start of the first arrow to the tip of the last arrow.`,
      measure: `The resultant measures ${rcm} cm, which is ${R} N at a scale of 1 cm = ${per} N. A protractor gives ${angle}° from the horizontal. On the ring it is one ${R} N force pulling up and to the right.`,
    }[stage]
  const pulls: Pull[] = [
    { deg: 0, n: f1, tone: 'push', label: `${f1} N`, labelAt: [C[0] + 14 + f1 * k * 0.5, C[1] + 34], dim: at === 4 },
    { deg: 90, n: f2, tone: 'back', label: `${f2} N`, labelAt: [C[0] - 14, C[1] - 14 - f2 * k * 0.5], anchor: 'end', dim: at === 4 },
  ]
  if (at === 4) pulls.push({ deg: angle, n: R, tone: 'resultant', label: `${R} N`, labelAt: [C[0] + (14 + R * k) * Math.cos(rad(angle)) + 8, C[1] - (14 + R * k) * Math.sin(rad(angle)) - 4], anchor: 'start' })
  return <PhysicsDiagram title={title} viewBox="0 0 540 320">
    <T x={115} y={30} size={15}>the forces on the ring</T>
    <Ring c={C} pulls={pulls} k={k} />
    {at === 0 && <Card x={120} y={270} w={226} tone="hot" size={14}>{`at right angles: not ${f1 + f2} N`}</Card>}
    {at >= 1 && at < 4 && <g>
      <Card x={115} y={250} w={150} tone={at === 1 ? 'hot' : 'plain'}><tspan fill={one}>{f1} N</tspan> → {a} cm</Card>
      <Card x={115} y={288} w={150} tone={at === 1 ? 'hot' : 'plain'}><tspan fill={two}>{f2} N</tspan> → {b} cm</Card>
    </g>}

    <Paper x={252} y={48} w={276} h={258} ox={O[0]} oy={O[1]} size={CM} />
    <T x={262} y={30} size={15} anchor="start">scale drawing</T>
    <Card x={472} y={25} w={104} tone={at === 1 ? 'hot' : 'plain'} h={28} size={13}>{`1 cm = ${per} N`}</Card>
    {at === 0 && <T x={390} y={182} size={30} colour={muted}>?</T>}
    {at === 2 && <Glow x={A[0]} y={A[1]} r={17} />}
    {at === 3 && <><Glow x={O[0]} y={O[1]} r={14} /><Glow x={B[0]} y={B[1]} r={14} /></>}
    {at >= 1 && <g>
      <Arrow from={O} to={A} colour={one} width={3} />
      <T x={(O[0] + A[0]) / 2} y={O[1] + 24} size={14} colour={one} halo>{`${a} cm`}</T>
      <circle cx={O[0]} cy={O[1]} r="4" fill={ink} />
    </g>}
    {at >= 2 && <g>
      <Arrow from={A} to={B} colour={two} width={3} />
      <T x={A[0] + 12} y={(A[1] + B[1]) / 2 + 5} size={14} colour={two} anchor="start" halo>{`${b} cm`}</T>
      {at === 2 && <T x={A[0] + 12} y={A[1] + 28} size={14} colour={amberInk} anchor="start" halo>tip-to-tail</T>}
    </g>}
    {at >= 3 && <g>
      <Arrow from={O} to={B} colour={res} width={3.6} />
      {at === 3 && <T x={rl[0]} y={rl[1]} size={14} colour={res} anchor="end" halo>resultant</T>}
    </g>}
    {at === 4 && <g>
      <AngleArc o={O} fromDeg={0} toDeg={angle} r={40} label={`${angle}°`} />
      <T x={rl[0]} y={rl[1] - 8} size={14} colour={res} anchor="end" halo>{`${rcm} cm`}</T>
      <T x={rl[0]} y={rl[1] + 11} size={14} colour={res} anchor="end" halo>{`→ ${R} N`}</T>
    </g>}
    {at === 4 && <g>
      <Card x={120} y={262} w={200} tone="good" size={15}>{`${R} N at ${angle}°`}</Card>
      <T x={120} y={296} size={14} colour={muted} bold={false}>above the horizontal</T>
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 3: equilibrium ---------- */

type EqStage = 'balanced' | 'triangle' | 'missing' | 'together'
function EqScene({ stage }: { stage: EqStage }) {
  const O: Pt = [300, 250], A: Pt = [420, 250], B: Pt = [420, 160], C: Pt = [124, 146], k = 8
  const known = stage !== 'balanced' && stage !== 'triangle'
  const title = {
    balanced: 'The ring pulled by three strings: 8 N to the right, 6 N up, and 10 N down and to the left. The ring stays still: the resultant is zero, so it is in equilibrium.',
    triangle: 'The three forces drawn tip-to-tail to scale, 1 cm = 2 N: 4 cm right, 3 cm up, then 5 cm back to the start. The arrows make a closed triangle.',
    missing: 'Finding a missing force: the 8 N and 6 N forces are drawn tip-to-tail, and a dashed line joins the tip of the last arrow back to the start of the first.',
    together: 'The missing force measures 5 cm, so it is 10 N, pointing down and to the left at 37° below the horizontal: the same size as the resultant of the others but opposite.',
  }[stage]
  const pulls: Pull[] = [
    { deg: 0, n: 8, tone: 'push', label: '8 N' },
    { deg: 90, n: 6, tone: 'back', label: '6 N', labelAt: [C[0] - 14, C[1] - 40], anchor: 'end' },
    { deg: 217, n: 10, tone: 'electrostatic', label: stage === 'missing' ? '' : '10 N', labelAt: [C[0] - 40, C[1] + 92], anchor: 'middle', dim: stage === 'missing' },
  ]
  return <PhysicsDiagram title={title} viewBox="0 0 540 320">
    <T x={120} y={30} size={15}>the forces on the ring</T>
    <Ring c={C} pulls={pulls} k={k} />
    {stage === 'missing' && <T x={C[0] - 40} y={C[1] + 92} size={18} colour={third}>?</T>}
    <Card x={120} y={278} w={196} tone={stage === 'balanced' ? 'hot' : 'plain'} size={14}>resultant = 0 N</Card>
    <T x={120} y={308} size={13} colour={muted} bold={false}>the ring stays still</T>

    <Paper x={252} y={48} w={276} h={258} ox={O[0]} oy={O[1]} size={CM} />
    <T x={262} y={30} size={15} anchor="start">scale drawing</T>
    <Card x={472} y={25} w={104} h={28} size={13}>1 cm = 2 N</Card>
    {stage === 'balanced' && <g>
      <T x={390} y={160} size={17}>forces balanced</T>
      <T x={390} y={186} size={15} colour={muted} bold={false}>this is called</T>
      <Card x={390} y={218} w={140} tone="hot" size={16}>equilibrium</Card>
    </g>}
    {stage !== 'balanced' && <g>
      {stage === 'triangle' && <Glow x={O[0]} y={O[1]} r={15} />}
      {stage === 'missing' && <Glow x={B[0]} y={B[1]} r={14} />}
      <Arrow from={O} to={A} colour={one} width={3} />
      <T x={360} y={O[1] + 24} size={14} colour={one} halo>4 cm</T>
      <Arrow from={A} to={B} colour={two} width={3} />
      <T x={A[0] + 12} y={210} size={14} colour={two} anchor="start" halo>3 cm</T>
      {stage === 'triangle' && <g>
        <Arrow from={B} to={O} colour={third} width={3} />
        <T x={340} y={186} size={14} colour={third} anchor="end" halo>5 cm</T>
        <T x={266} y={294} size={14} colour={amberInk} anchor="start" halo>ends where it started</T>
        <Card x={410} y={92} w={170} tone="hot" size={14}>closed triangle</Card>
      </g>}
      {known && <g>
        <Arrow from={B} to={O} colour={third} width={3} dashed={stage === 'missing'} />
        {stage === 'missing' && <><T x={344} y={186} size={14} colour={third} anchor="end" halo>missing force</T>
          <Card x={398} y={92} w={236} tone="hot" size={14}>tip of last → start of first</Card></>}
        {stage === 'together' && <g>
          <AngleArc o={O} fromDeg={0} toDeg={37} r={40} label="37°" />
          <T x={344} y={176} size={14} colour={third} anchor="end" halo>5 cm</T>
          <T x={344} y={195} size={14} colour={third} anchor="end" halo>→ 10 N</T>
          <Card x={394} y={92} w={240} tone="good" size={14}>10 N, down and to the left</Card>
        </g>}
      </g>}
      <circle cx={O[0]} cy={O[1]} r="4" fill={ink} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 4: components on a square grid ---------- */

type CompStage = 'pull' | 'grid' | 'lines' | 'together'
function Sledge({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 40} ${y - 4}H${x + 40}Q${x + 58} ${y - 4} ${x + 60} ${y - 20}`} stroke="#7a5530" strokeWidth="4" fill="none" />
    <path d={`M${x - 30} ${y - 4}V${y - 16}M${x + 30} ${y - 4}V${y - 16}`} stroke="#7a5530" strokeWidth="3.5" />
    <rect x={x - 40} y={y - 28} width={80} height={13} rx="5" fill="#e9b97a" stroke="#a57a45" strokeWidth="2" />
  </g>
}
function CompScene({ stage }: { stage: CompStage }) {
  const at = ['pull', 'grid', 'lines', 'together'].indexOf(stage)
  const S = 20, O: Pt = [270, 262], Tp: Pt = [O[0] + 8 * S, O[1] - 6 * S], H: Pt = [Tp[0], O[1]]
  const title = {
    pull: 'A sledge pulled by a rope at an angle with a 10 N force. The pull acts partly forwards and partly upwards.',
    grid: 'The 10 N force drawn to scale on a square grid, 1 square = 1 N, starting at a corner of a square.',
    lines: 'The horizontal component is drawn across along a grid line, then the vertical component goes straight up to the tip.',
    together: 'Counting squares: the horizontal component is 8 squares, 8 N, and the vertical component is 6 squares, 6 N. Together they have the same effect as the 10 N pull.',
  }[stage]
  const A: Pt = [110, 220], u: Pt = [Math.cos(rad(37)), -Math.sin(rad(37))], L = 110
  const ropeTo: Pt = [A[0] + u[0] * 142, A[1] + u[1] * 142], tip: Pt = [A[0] + u[0] * L, A[1] + u[1] * L], corner: Pt = [tip[0], A[1]]
  const fl = sideLabel(A, tip, 22)
  return <PhysicsDiagram title={title} viewBox="0 0 540 320">
    <T x={120} y={30} size={15}>pulling a sledge</T>
    <Ground y={240} x1={10} x2={240} fill="#eef4f8" line="#b9cbd8" />
    <Sledge x={50} y={240} />
    <path d={`M${A[0]} ${A[1]}L${r1(ropeTo[0])} ${r1(ropeTo[1])}`} stroke="#8a6443" strokeWidth="2.4" />
    <Hand x={r1(ropeTo[0] + 2)} y={r1(ropeTo[1] - 1)} rotate={-37} s={0.75} />
    {at === 0 && <g>
      <Arrow from={A} to={corner} colour={hor} width={2.6} dashed />
      <Arrow from={corner} to={tip} colour={ver} width={2.6} dashed />
      <T x={(A[0] + corner[0]) / 2} y={272} size={14} colour={hor}>forwards</T>
      <T x={corner[0] + 10} y={(A[1] + tip[1]) / 2 + 5} size={14} colour={ver} anchor="start">up</T>
    </g>}
    {at === 3 && <g>
      <ForceArrow from={A} to={corner} tone="tension" width={7} />
      <ForceArrow from={corner} to={tip} tone="electrostatic" width={7} />
      <T x={(A[0] + corner[0]) / 2} y={272} size={14} colour={hor}>8 N</T>
      <T x={corner[0] + 12} y={(A[1] + tip[1]) / 2 + 5} size={14} colour={ver} anchor="start">6 N</T>
    </g>}
    <ForceArrow from={A} to={tip} tone="push" width={8} label="10 N" labelAt={[fl[0], fl[1]]} labelAnchor="end" dim={at === 3} />

    <Paper x={252} y={48} w={276} h={258} ox={O[0]} oy={O[1]} size={S} />
    <T x={262} y={30} size={15} anchor="start">square grid</T>
    <Card x={462} y={25} w={130} h={28} size={13} tone={at === 1 ? 'hot' : 'plain'}>1 square = 1 N</Card>
    {at === 0 && <T x={390} y={190} size={30} colour={muted}>?</T>}
    {at >= 1 && <g>
      {at === 1 && <Glow x={O[0]} y={O[1]} r={13} />}
      {at >= 2 && <g>
        <Arrow from={O} to={H} colour={hor} width={3} />
        <Arrow from={H} to={Tp} colour={ver} width={3} />
        <path d={`M${H[0] - 12} ${H[1]}V${H[1] - 12}H${H[0]}`} stroke={muted} strokeWidth="1.5" fill="none" />
        {at === 2 && <g>
          <T x={(O[0] + H[0]) / 2} y={O[1] + 26} size={14} colour={hor} halo>horizontal component</T>
          <T x={H[0] + 12} y={(H[1] + Tp[1]) / 2 - 8} size={14} colour={ver} anchor="start" halo>vertical</T>
          <T x={H[0] + 12} y={(H[1] + Tp[1]) / 2 + 10} size={14} colour={ver} anchor="start" halo>component</T>
        </g>}
        {at === 3 && <g>
          <T x={(O[0] + H[0]) / 2} y={O[1] + 26} size={14} colour={hor} halo>8 squares = 8 N</T>
          <T x={H[0] + 12} y={(H[1] + Tp[1]) / 2 - 8} size={14} colour={ver} anchor="start" halo>6 squares</T>
          <T x={H[0] + 12} y={(H[1] + Tp[1]) / 2 + 10} size={14} colour={ver} anchor="start" halo>= 6 N</T>
        </g>}
      </g>}
      <Arrow from={O} to={Tp} colour={one} width={3.4} />
      <T x={sideLabel(O, Tp, 20)[0]} y={sideLabel(O, Tp, 20)[1]} size={15} colour={one} anchor="end" halo>F = 10 N</T>
      <circle cx={O[0]} cy={O[1]} r="4" fill={ink} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Question drawings ---------- */

/** A grid question: force F on a square grid, with its components shown only after answering. */
function GridQuestion({ assessment, per, dx, dy, ask, title }: { assessment: boolean; per: number; dx: number; dy: number; ask: 'horizontal' | 'vertical'; title: string }) {
  const S = 30, O: Pt = [dx > 0 ? 160 : 400, 240], Tp: Pt = [O[0] + dx * S, O[1] - dy * S], H: Pt = [Tp[0], O[1]]
  const lab = sideLabel(O, Tp, 18)
  return <PhysicsDiagram title={assessment ? title : `${title} The horizontal component is ${Math.abs(dx)} squares, ${Math.abs(dx) * per} N; the vertical component is ${dy} squares, ${dy * per} N.`} viewBox="0 0 540 300">
    <Paper x={70} y={40} w={400} h={236} ox={O[0]} oy={O[1]} size={S} />
    <Card x={270} y={22} w={140} h={28} size={13}>{`1 square = ${per} N`}</Card>
    {!assessment && <g>
      <Arrow from={O} to={H} colour={hor} width={3} />
      <Arrow from={H} to={Tp} colour={ver} width={3} />
      <T x={(O[0] + H[0]) / 2} y={O[1] + 26} size={14} colour={hor} halo>{`${Math.abs(dx)} squares = ${Math.abs(dx) * per} N`}</T>
      <T x={H[0] + (dx > 0 ? 12 : -12)} y={(H[1] + Tp[1]) / 2 + 5} size={14} colour={ver} anchor={dx > 0 ? 'start' : 'end'} halo>{`${dy} squares = ${dy * per} N`}</T>
    </g>}
    <Arrow from={O} to={Tp} colour={one} width={3.4} />
    <T x={lab[0]} y={lab[1]} size={16} colour={one} anchor={dx > 0 ? 'end' : 'start'} halo>F</T>
    <circle cx={O[0]} cy={O[1]} r="4" fill={ink} />
    {assessment && <T x={270} y={296} size={13} colour={muted} bold={false}>{`find the ${ask} component`}</T>}
  </PhysicsDiagram>
}

function MissingQuestion({ assessment }: { assessment: boolean }) {
  const S = 30, O: Pt = [380, 90], A: Pt = [O[0] - 4 * S, O[1]], B: Pt = [A[0], A[1] + 3 * S]
  return <PhysicsDiagram title={assessment ? 'Two forces drawn tip-to-tail on a grid, 1 square = 1 N: 4 N to the left, then 3 N down. A dashed line, labelled 5 squares long, joins the end of the second arrow to the start of the first.' : 'The missing force goes from the tip of the last arrow back to the start of the first: 5 N, up and to the right.'} viewBox="0 0 540 260">
    <Paper x={140} y={40} w={300} h={196} ox={O[0]} oy={O[1]} size={S} />
    <Card x={290} y={22} w={140} h={28} size={13}>1 square = 1 N</Card>
    <circle cx={O[0]} cy={O[1]} r="4" fill={ink} />
    <Arrow from={O} to={A} colour={one} width={3} />
    <T x={(O[0] + A[0]) / 2} y={O[1] - 12} size={14} colour={one} halo>4 N</T>
    <Arrow from={A} to={B} colour={two} width={3} />
    <T x={A[0] - 12} y={(A[1] + B[1]) / 2 + 5} size={14} colour={two} anchor="end" halo>3 N</T>
    {assessment
      ? <path d={`M${B[0]} ${B[1]}L${O[0]} ${O[1]}`} stroke={third} strokeWidth="3" strokeDasharray="7 6" fill="none" />
      : <Arrow from={B} to={O} colour={third} width={3} />}
    <T x={sideLabel(B, O, -20)[0]} y={sideLabel(B, O, -20)[1] + 5} size={15} colour={third} anchor="start" halo>{assessment ? '5 squares long' : '5 N'}</T>
    <T x={O[0] + 10} y={O[1] - 10} size={13} colour={muted} anchor="start" bold={false}>start</T>
  </PhysicsDiagram>
}

function ArrowsQuestion({ assessment }: { assessment: boolean }) {
  const O: Pt = [120, 230], A: Pt = [330, 230], B: Pt = [420, 110]
  const n1 = sideLabel(O, B, 22), n2: Pt = [(O[0] + A[0]) / 2, O[1] + 28], n3 = sideLabel(A, B, -24)
  return <PhysicsDiagram title={assessment ? 'A student’s scale drawing with three numbered arrows. Arrow 2 goes to the right, arrow 3 starts at its tip and goes up and to the right, and arrow 1 joins the start of arrow 2 to the tip of arrow 3.' : 'Arrows 2 and 3 are the two forces, tip-to-tail. Arrow 1 goes from the start of the first force to the tip of the last, so it is the resultant.'} viewBox="0 0 540 280">
    <Paper x={60} y={40} w={420} h={226} ox={O[0]} oy={O[1]} size={30} />
    <Arrow from={O} to={A} colour={ink} width={3} />
    <Arrow from={A} to={B} colour={ink} width={3} />
    <Arrow from={O} to={B} colour={assessment ? ink : res} width={3} />
    <Num n={1} x={n1[0]} y={n1[1]} />
    <Num n={2} x={n2[0]} y={n2[1]} />
    <Num n={3} x={n3[0]} y={n3[1]} />
    {!assessment && <T x={n1[0] - 20} y={n1[1] + 5} size={14} colour={res} anchor="end" halo>resultant</T>}
  </PhysicsDiagram>
}

export function HigherForceDrawingVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'hfdraw-res-forces': return <ResScene stage="forces" />
    case 'hfdraw-res-scale': return <ResScene stage="scale" />
    case 'hfdraw-res-tiptotail': return <ResScene stage="tiptotail" />
    case 'hfdraw-res-line': return <ResScene stage="line" />
    case 'hfdraw-res-measure': return <ResScene stage="measure" />
    case 'hfdraw-worked-ring': return <ResScene stage="measure" f1={15} f2={20} per={5} angle={53} worked />
    case 'hfdraw-eq-balanced': return <EqScene stage="balanced" />
    case 'hfdraw-eq-triangle': return <EqScene stage="triangle" />
    case 'hfdraw-eq-missing': return <EqScene stage="missing" />
    case 'hfdraw-eq-together': return <EqScene stage="together" />
    case 'hfdraw-comp-pull': return <CompScene stage="pull" />
    case 'hfdraw-comp-grid': return <CompScene stage="grid" />
    case 'hfdraw-comp-lines': return <CompScene stage="lines" />
    case 'hfdraw-comp-together': return <CompScene stage="together" />
    case 'hfdraw-q-missing': return <MissingQuestion assessment={assessment} />
    case 'hfdraw-q-grid': return <GridQuestion assessment={assessment} per={2} dx={4} dy={3} ask="horizontal" title="Force F drawn on a square grid where each square is 2 N. F goes 4 squares to the right and 3 squares up." />
    case 'hfdraw-q-comp': return <GridQuestion assessment={assessment} per={5} dx={-4} dy={3} ask="vertical" title="Force F drawn on a square grid where each square is 5 N. F goes 4 squares to the left and 3 squares up." />
    case 'hfdraw-q-arrows': return <ArrowsQuestion assessment={assessment} />
    default: return <ResScene stage="forces" />
  }
}
