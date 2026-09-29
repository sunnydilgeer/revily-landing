import { type ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, Leader, type Pt } from './PhysicsKit'
import { Num, Arrow, Tick, CrossMark, Caption } from './EnergyStoreVisuals'

/*
 * Physics Lesson 63: Magnets and magnetic fields. Original, code-native schematics; not to scale. Focus ids start with 'magnet-'.
 *
 * Field lines are not hand-drawn: they are traced through the field of two "poles" placed just inside the ends of the
 * magnet (a dipole), so the pattern is physically right: lines leave the north pole, curve round and enter the south
 * pole, and they crowd together at the poles where the field is strongest. The tracer, the bar magnet and the compass
 * are exported for Lesson 64 (ElectromagVisuals), which draws the solenoid's field the same way.
 *
 * Colours: north pole red, south pole blue (the usual school colours); field lines steel grey, the magnetic-store
 * colour in PhysicsKit; compass needles red at the north end.
 */
const { ink, muted } = P
const r1 = (n: number) => Math.round(n * 10) / 10

export const magnetColours = {
  n: '#ec8a7b', nLine: '#b5463a',
  s: '#83aedb', sLine: '#3b6c9f',
  field: '#56697a',
  iron: '#c9d0d6', ironLine: '#6b7883',
  halo: '#e7ecf5',
}
const M = magnetColours

/* ---------- Field tracing ---------- */

/** A point pole: x, y and strength (+ for a north pole, − for a south pole). */
export type Pole = [number, number, number]
export type Box = [number, number, number, number]

export function fieldAt(x: number, y: number, poles: Pole[]): Pt {
  let bx = 0, by = 0
  for (const [px, py, q] of poles) {
    const dx = x - px, dy = y - py, d2 = dx * dx + dy * dy + 1e-6, d3 = d2 * Math.sqrt(d2)
    bx += q * dx / d3; by += q * dy / d3
  }
  return [bx, by]
}
function unit([x, y]: Pt): Pt { const l = Math.hypot(x, y) || 1; return [x / l, y / l] }

/**
 * Follows the field from `start` (dir 1 = along the field, −1 = against it) in small steps until it leaves `box`,
 * reaches a pole of the opposite kind, or `stop` says so.
 */
export function traceField(start: Pt, poles: Pole[], { dir = 1, step = 2, max = 1600, box, stop }: { dir?: number; step?: number; max?: number; box: Box; stop?: (p: Pt) => boolean }): Pt[] {
  const pts: Pt[] = [start]
  let [x, y] = start
  for (let i = 0; i < max; i++) {
    const [ax, ay] = unit(fieldAt(x, y, poles))
    const [bx, by] = unit(fieldAt(x + ax * dir * step / 2, y + ay * dir * step / 2, poles))
    x += bx * dir * step; y += by * dir * step
    pts.push([x, y])
    if (x < box[0] || x > box[2] || y < box[1] || y > box[3]) break
    if (poles.some(([px, py, q]) => q * dir < 0 && Math.hypot(x - px, y - py) < step * 1.6)) break
    if (stop?.([x, y])) break
  }
  return pts
}
export function linePath(pts: Pt[], every = 2) {
  let d = ''
  pts.forEach((p, i) => { if (i % every === 0 || i === pts.length - 1) d += `${d ? 'L' : 'M'}${r1(p[0])} ${r1(p[1])}` })
  return d
}
/** Where a fraction of the way along a traced line is, and which way the line runs there. */
export function along(pts: Pt[], frac: number): { at: Pt; angle: number } {
  const seg: number[] = [0]
  for (let i = 1; i < pts.length; i++) seg.push(seg[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const target = seg[seg.length - 1] * frac
  let i = seg.findIndex(s => s >= target); if (i < 1) i = 1
  const a = pts[Math.max(0, i - 2)], b = pts[Math.min(pts.length - 1, i + 1)]
  return { at: pts[i], angle: Math.atan2(b[1] - a[1], b[0] - a[0]) }
}
/** The point of a traced line farthest from a centre line y = cy (the top of a loop), and the direction there. */
export function apex(pts: Pt[], cy: number): { at: Pt; angle: number } {
  let best = 0
  pts.forEach((p, i) => { if (Math.abs(p[1] - cy) > Math.abs(pts[best][1] - cy)) best = i })
  const a = pts[Math.max(0, best - 2)], b = pts[Math.min(pts.length - 1, best + 2)]
  return { at: pts[best], angle: Math.atan2(b[1] - a[1], b[0] - a[0]) }
}

/** A small solid arrowhead centred on `at`, pointing along `angle`. */
export function Chevron({ at, angle, colour = M.field, size = 9 }: { at: Pt; angle: number; colour?: string; size?: number }) {
  const c = Math.cos(angle), s = Math.sin(angle)
  const p = (d: number, w: number) => `${r1(at[0] + c * d - s * w)} ${r1(at[1] + s * d + c * w)}`
  return <path d={`M${p(size * 0.55, 0)}L${p(-size * 0.5, size * 0.52)}L${p(-size * 0.25, 0)}L${p(-size * 0.5, -size * 0.52)}Z`} fill={colour} stroke={colour} strokeWidth="1" />
}
/** One traced field line with an arrowhead. */
export function FieldLine({ pts, arrow, colour = M.field, width = 1.8, opacity = 1 }: { pts: Pt[]; arrow?: { at: Pt; angle: number } | null; colour?: string; width?: number; opacity?: number }) {
  return <g opacity={opacity}>
    <path d={linePath(pts)} stroke={colour} strokeWidth={width} fill="none" />
    {arrow && <Chevron at={arrow.at} angle={arrow.angle} colour={colour} size={7 + width * 1.4} />}
  </g>
}

/**
 * The field lines of a bar magnet lying along the x axis (north on the left unless `flip`), centred on (cx, cy).
 * Lines start round the north pole at the given angles (degrees away from the magnet's axis) and are traced to the
 * south pole. A line that leaves the box is traced back from the south pole too, so both halves show.
 */
export function barField({ cx, cy, half = 80, angles = [22, 48, 76, 108, 140], box, flip = false, axial = true }: { cx: number; cy: number; half?: number; angles?: number[]; box: Box; flip?: boolean; axial?: boolean }) {
  const inset = half * 0.8, sn = flip ? 1 : -1
  const poles: Pole[] = [[cx + sn * inset, cy, 1], [cx - sn * inset, cy, -1]]
  const lines: { pts: Pt[]; arrow: { at: Pt; angle: number } | null }[] = []
  const inBox = (p: Pt) => p[0] >= box[0] && p[0] <= box[2] && p[1] >= box[1] && p[1] <= box[3]
  for (const deg of angles) for (const side of [-1, 1]) {
    const a = deg * Math.PI / 180
    const start: Pt = [cx + sn * inset + sn * 4 * Math.cos(a), cy + side * 4 * Math.sin(a)]
    const pts = traceField(start, poles, { box })
    if (inBox(pts[pts.length - 1])) lines.push({ pts, arrow: apex(pts, cy) })
    else {
      lines.push({ pts, arrow: along(pts, 0.55) })
      const back = traceField([cx - sn * inset - sn * 4 * Math.cos(a), cy + side * 4 * Math.sin(a)], poles, { dir: -1, box }).reverse()
      lines.push({ pts: back, arrow: along(back, 0.45) })
    }
  }
  if (axial) {
    const out = traceField([cx + sn * (inset + 4), cy], poles, { box })
    const into = traceField([cx - sn * (inset + 4), cy], poles, { dir: -1, box }).reverse()
    lines.push({ pts: out, arrow: along(out, 0.6) }, { pts: into, arrow: along(into, 0.4) })
  }
  return { poles, lines }
}

/* ---------- Pieces ---------- */

/**
 * A bar magnet centred on (x, y), north half red and south half blue. `angle` (degrees) turns it; at 0 the north pole
 * is on the left. The letters stay upright.
 */
export function BarMagnet({ x, y, len = 160, h = 40, angle = 0, letters = true, opacity = 1 }: { x: number; y: number; len?: number; h?: number; angle?: number; letters?: boolean; opacity?: number }) {
  const a = angle * Math.PI / 180, lx = Math.cos(a) * len / 4, ly = Math.sin(a) * len / 4
  const fs = Math.max(13, Math.min(22, h * 0.52))
  return <g opacity={opacity}>
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path d={`M0 ${-h / 2}H${-len / 2 + 7}Q${-len / 2} ${-h / 2} ${-len / 2} ${-h / 2 + 7}V${h / 2 - 7}Q${-len / 2} ${h / 2} ${-len / 2 + 7} ${h / 2}H0Z`} fill={M.n} stroke={M.nLine} strokeWidth="2.2" />
      <path d={`M0 ${-h / 2}H${len / 2 - 7}Q${len / 2} ${-h / 2} ${len / 2} ${-h / 2 + 7}V${h / 2 - 7}Q${len / 2} ${h / 2} ${len / 2 - 7} ${h / 2}H0Z`} fill={M.s} stroke={M.sLine} strokeWidth="2.2" />
      {Math.abs(angle) !== 180 && <path d={`M${-len / 2 + 8} ${-h / 2 + 6}H${len / 2 - 8}`} stroke="white" strokeWidth="2.5" opacity=".45" />}
    </g>
    {letters && <g fontSize={fs} fontWeight="800" fill="white" textAnchor="middle">
      <text x={r1(x - lx * 1.45)} y={r1(y - ly * 1.45 + fs * 0.36)}>N</text>
      <text x={r1(x + lx * 1.45)} y={r1(y + ly * 1.45 + fs * 0.36)}>S</text>
    </g>}
  </g>
}

/** A compass: a round case with a needle whose red (north) end points along `angle` (radians, SVG directions). */
export function Compass({ x, y, r = 16, angle, dim = false }: { x: number; y: number; r?: number; angle: number; dim?: boolean }) {
  const deg = r1(angle * 180 / Math.PI), l = r * 0.8, w = r * 0.26
  return <g opacity={dim ? 0.4 : 1}>
    <circle cx={x} cy={y} r={r} fill="white" stroke={ink} strokeWidth="1.8" />
    <circle cx={x} cy={y} r={r - 3.5} fill="none" stroke={P.panelLine} strokeWidth="1" />
    <g transform={`translate(${x} ${y}) rotate(${deg})`}>
      <path d={`M${l} 0L0 ${w}L0 ${-w}Z`} fill={M.nLine} />
      <path d={`M${-l} 0L0 ${w}L0 ${-w}Z`} fill="#dfe5ea" stroke="#7d8e9c" strokeWidth="1" />
    </g>
    <circle cx={x} cy={y} r="2" fill={ink} />
  </g>
}

const BOX: Box = [6, 6, 534, 294]

/** A whole bar magnet with its traced field lines. */
function FieldedMagnet({ cx = 270, cy = 150, half = 80, h = 40, angles, box = BOX, width = 1.8, opacity = 1 }: { cx?: number; cy?: number; half?: number; h?: number; angles?: number[]; box?: Box; width?: number; opacity?: number }) {
  const { lines } = barField({ cx, cy, half, angles, box })
  return <g>
    {lines.map((l, i) => <FieldLine key={i} pts={l.pts} arrow={l.arrow} width={width} opacity={opacity} />)}
    <BarMagnet x={cx} y={cy} len={half * 2} h={h} />
  </g>
}

/* ---------- Section: poles and forces ---------- */

function Poles() {
  return <PhysicsDiagram title="A bar magnet. The north pole is at one end and the south pole at the other end. The poles are where the magnetism is strongest.">
    <ellipse cx={170} cy={140} rx="44" ry="50" fill={M.n} opacity=".22" />
    <ellipse cx={370} cy={140} rx="44" ry="50" fill={M.s} opacity=".25" />
    <BarMagnet x={270} y={140} len={240} h={56} />
    <Leader from={[120, 66]} to={[166, 116]} colour={M.nLine} />
    <Lines x={120} y={58} anchor="middle" lines={['north pole']} size={16} colour={M.nLine} />
    <Leader from={[420, 66]} to={[374, 116]} colour={M.sLine} />
    <Lines x={420} y={58} anchor="middle" lines={['south pole']} size={16} colour={M.sLine} />
    <Lines x={270} y={218} anchor="middle" lines={['the poles are at the ends:', 'this is where the magnetism is strongest']} size={14} weight={650} colour={muted} />
  </PhysicsDiagram>
}

function Forces() {
  const rows: { y: number; left: 'NS' | 'SN'; right: 'NS' | 'SN'; word: string; together: boolean }[] = [
    { y: 58, left: 'SN', right: 'NS', word: 'repel', together: false },
    { y: 142, left: 'NS', right: 'SN', word: 'repel', together: false },
    { y: 226, left: 'SN', right: 'SN', word: 'attract', together: true },
  ]
  const Mag = ({ x, y, order }: { x: number; y: number; order: 'NS' | 'SN' }) => <BarMagnet x={x} y={y} len={120} h={30} angle={order === 'NS' ? 0 : 180} />
  return <PhysicsDiagram title="Three pairs of bar magnets. North facing north: they repel. South facing south: they repel. North facing south: they attract. The magnets do not need to touch.">
    {rows.map(r => {
      const c = r.together ? P.useful : P.wasted
      return <g key={r.y}>
        <Mag x={96} y={r.y} order={r.left} />
        <Mag x={266} y={r.y} order={r.right} />
        {r.together
          ? <g><Arrow from={[72, r.y - 26]} to={[120, r.y - 26]} colour={c} width={2.6} /><Arrow from={[290, r.y - 26]} to={[242, r.y - 26]} colour={c} width={2.6} /></g>
          : <g><Arrow from={[120, r.y - 26]} to={[72, r.y - 26]} colour={c} width={2.6} /><Arrow from={[242, r.y - 26]} to={[290, r.y - 26]} colour={c} width={2.6} /></g>}
        <Lines x={352} y={r.y + 6} lines={[r.word]} size={17} colour={c} />
        <Lines x={432} y={r.y + 5} lines={[r.together ? 'unlike poles' : 'like poles']} size={13} weight={600} colour={muted} />
      </g>
    })}
    <Caption text="no contact needed: a non-contact force" y={288} size={13} />
  </PhysicsDiagram>
}

/* ---------- Section: magnetic materials ---------- */

function Nail({ x, y, len = 70, angle = 90, fill = M.iron, line = M.ironLine }: { x: number; y: number; len?: number; angle?: number; fill?: string; line?: string }) {
  // (x, y) is the head of the nail; it points along `angle` degrees.
  return <g transform={`translate(${x} ${y}) rotate(${angle - 90})`}>
    <path d={`M-4 4H4V${len - 10}L0 ${len}L-4 ${len - 10}Z`} fill={fill} stroke={line} strokeWidth="1.8" />
    <rect x={-10} y={-2} width={20} height={7} rx="3" fill={fill} stroke={line} strokeWidth="1.8" />
  </g>
}
function Clip({ x, y }: { x: number; y: number }) {
  return <path d={`M${x - 5} ${y}V${y + 42}Q${x - 5} ${y + 50} ${x + 2} ${y + 50}Q${x + 9} ${y + 50} ${x + 9} ${y + 42}V${y + 10}Q${x + 9} ${y + 5} ${x + 5} ${y + 5}Q${x + 1} ${y + 5} ${x + 1} ${y + 10}V${y + 38}`} stroke={M.ironLine} strokeWidth="2.6" fill="none" />
}
function Materials() {
  const yes: [string, ReactNode][] = [
    ['iron', <Nail key="n" x={62} y={96} len={62} />],
    ['steel', <Clip key="c" x={120} y={94} />],
    ['nickel', <g key="k"><ellipse cx={186} cy={112} rx="17" ry="17" fill="#e3e6da" stroke="#8b8f76" strokeWidth="2" /><circle cx={186} cy={112} r="11" fill="none" stroke="#8b8f76" strokeWidth="1.2" /></g>],
    ['cobalt', <path key="b" d="M236 96H270L274 124Q256 132 234 124Z" fill="#c5cde4" stroke="#56628f" strokeWidth="2" />],
  ]
  return <PhysicsDiagram title="Iron, steel, nickel and cobalt are pulled onto a magnet: they are magnetic materials. Copper and aluminium are metals, but they are not attracted.">
    <rect x={14} y={14} width={300} height={272} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <rect x={326} y={14} width={200} height={272} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <Lines x={164} y={42} anchor="middle" lines={['attracted']} size={15} colour={P.useful} />
    <Lines x={426} y={42} anchor="middle" lines={['not attracted']} size={15} colour={P.wasted} />
    <BarMagnet x={164} y={78} len={260} h={34} />
    {yes.map(([name, pic], i) => <g key={name}>{pic}<Lines x={[62, 124, 186, 254][i]} y={190} anchor="middle" lines={[name]} size={15} /></g>)}
    <Tick x={164} y={236} />
    <BarMagnet x={426} y={78} len={160} h={34} />
    <path d="M354 170q10 -18 22 0t22 0t22 0" stroke="#b56a32" strokeWidth="3.4" fill="none" />
    <path d="M444 160L470 152L500 162L494 178L462 184L446 176Z" fill="#eef1f4" stroke="#8a98a5" strokeWidth="1.8" />
    <path d="M454 166L476 162M462 176L488 170" stroke="#b8c2cb" strokeWidth="1.3" />
    <Lines x={386} y={210} anchor="middle" lines={['copper']} size={15} />
    <Lines x={472} y={210} anchor="middle" lines={['aluminium']} size={15} />
    <CrossMark x={426} y={246} />
  </PhysicsDiagram>
}

/* ---------- Section: fields and field lines ---------- */

function Field() {
  return <PhysicsDiagram title="A bar magnet with a shaded region round it: its magnetic field. Two paper clips inside the region feel a pull towards the magnet. A clip far away, outside the region, feels no force.">
    <ellipse cx={230} cy={150} rx="196" ry="118" fill={M.halo} />
    <ellipse cx={230} cy={150} rx="140" ry="82" fill={M.halo} />
    <ellipse cx={230} cy={150} rx="196" ry="118" fill="none" stroke="#a9b6cc" strokeWidth="1.6" strokeDasharray="6 6" />
    <BarMagnet x={230} y={150} len={160} h={40} />
    <g transform="rotate(90 90 150)"><Clip x={84} y={126} /></g>
    <Arrow from={[98, 150]} to={[134, 150]} colour={M.field} width={2.6} />
    <g transform="rotate(-30 300 70)"><Clip x={296} y={50} /></g>
    <Arrow from={[300, 86]} to={[282, 112]} colour={M.field} width={2.6} />
    <Clip x={478} y={222} />
    <Lines x={484} y={290} anchor="middle" lines={['no force']} size={13} weight={650} colour={muted} />
    <Lines x={230} y={26} anchor="middle" lines={['magnetic field: where a force is felt']} size={15} />
  </PhysicsDiagram>
}

function FieldLines({ marker }: { marker: boolean }) {
  const { lines } = barField({ cx: 270, cy: 170, half: 80, box: BOX })
  // The probe is the loop whose top is nearest (270, 96): its apex is where the tiny north pole sits.
  const probe = lines.reduce((best, l) => {
    const d = (x: typeof l) => { const a = apex(x.pts, 170).at; return Math.hypot(a[0] - 270, a[1] - 96) }
    return d(l) < d(best) ? l : best
  }, lines[0])
  const at = apex(probe.pts, 170).at
  return <PhysicsDiagram title={marker
    ? 'Field lines round a bar magnet go from the north pole round to the south pole. A tiny north pole placed on a line is pushed along the line, the way the arrow points.'
    : 'Field lines round a bar magnet, with arrows, going from the north pole round to the south pole.'}>
    {lines.map((l, i) => <FieldLine key={i} pts={l.pts} arrow={marker && l === probe ? null : l.arrow} width={l === probe && marker ? 2.6 : 1.8} />)}
    <BarMagnet x={270} y={170} len={160} h={40} />
    {marker && <g>
      <Arrow from={[at[0] + 10, at[1]]} to={[at[0] + 50, at[1]]} colour={M.nLine} width={2.8} />
      <circle cx={at[0]} cy={at[1]} r="10" fill={M.n} stroke={M.nLine} strokeWidth="1.8" />
      <text x={at[0]} y={at[1] + 4.5} textAnchor="middle" fontSize="12" fontWeight="800" fill="white">N</text>
      <rect x={at[0] - 90} y={at[1] - 44} width={180} height={24} rx="12" fill="white" opacity=".9" />
      <Lines x={at[0]} y={at[1] - 27} anchor="middle" lines={['force on a north pole']} size={14} colour={M.nLine} />
    </g>}
    <rect x={160} y={8} width={220} height={24} rx="12" fill="white" />
    <Lines x={270} y={25} anchor="middle" lines={['field lines go from N to S']} size={15} />
  </PhysicsDiagram>
}

function Strength({ assessment }: { assessment: boolean }) {
  void assessment
  return <PhysicsDiagram title="The field lines of a bar magnet. Near the poles the lines are close together, so the field is strong. Far from the magnet the lines are far apart, so the field is weak.">
    <FieldedMagnet cx={290} cy={156} />
    <circle cx={186} cy={156} r="32" fill="none" stroke={P.hot} strokeWidth="2.6" />
    <circle cx={460} cy={56} r="36" fill="none" stroke={P.cold} strokeWidth="2.6" strokeDasharray="6 5" />
    <rect x={10} y={236} width={196} height={50} rx="12" fill="white" stroke={P.hot} strokeWidth="1.6" />
    <Lines x={108} y={256} anchor="middle" lines={['lines close together:', 'strong field']} size={13} colour={P.hot} />
    <path d="M150 236L176 186" stroke={P.hot} strokeWidth="1.6" />
    <rect x={14} y={14} width={196} height={50} rx="12" fill="white" stroke={P.cold} strokeWidth="1.6" />
    <Lines x={112} y={34} anchor="middle" lines={['lines far apart:', 'weak field']} size={13} colour={P.cold} />
    <path d="M210 40Q330 30 424 52" stroke={P.cold} strokeWidth="1.6" fill="none" />
  </PhysicsDiagram>
}

/* ---------- Section: compasses ---------- */

function CompassView() {
  const cx = 230, cy = 170
  const { lines, poles } = barField({ cx, cy, half: 80, box: BOX })
  const spot: Pt = [236, 88]
  const f = fieldAt(spot[0], spot[1], poles)
  return <PhysicsDiagram title="A compass beside a bar magnet. The compass needle is a tiny magnet: it lines up along the field line, with its north end pointing the way the field goes, towards the south pole.">
    {lines.map((l, i) => <FieldLine key={i} pts={l.pts} arrow={l.arrow} opacity={0.4} />)}
    <BarMagnet x={cx} y={cy} len={160} h={40} />
    <Compass x={spot[0]} y={spot[1]} r={28} angle={Math.atan2(f[1], f[0])} />
    <Leader from={[330, 44]} to={[250, 86]} />
    <Lines x={336} y={40} lines={['needle is a tiny magnet']} size={15} />
    <Lines x={336} y={60} lines={['red end = north end']} size={13} weight={650} colour={M.nLine} />
    <Lines x={400} y={190} lines={['it lines up', 'with the field']} size={14} weight={650} colour={muted} />
  </PhysicsDiagram>
}

function Plot() {
  const cx = 270, cy = 180, box: Box = [20, 20, 520, 280]
  const poles: Pole[] = [[cx - 64, cy, 1], [cx + 64, cy, -1]]
  const a = 100 * Math.PI / 180
  const pts = traceField([cx - 64 - 4 * Math.cos(a), cy - 4 * Math.sin(a)], poles, { box, step: 1 })
  // Distances along the line where the dots go: start just outside the magnet, then one needle length each time.
  const seg: number[] = [0]
  for (let i = 1; i < pts.length; i++) seg.push(seg[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const at = (s: number) => pts[Math.max(0, seg.findIndex(v => v >= s))]
  const s0 = 26, step = 42
  const dots = [0, 1, 2, 3].map(k => at(s0 + k * step))
  const iEnd = seg.findIndex(v => v >= s0 + 2 * step), iStart = seg.findIndex(v => v >= s0)
  return <PhysicsDiagram title="Plotting a field line on paper. The compass is at position 1, then 2, then 3: each time the tail of the needle sits on the dot where the tip was before. The dots are joined to make a field line.">
    <rect x={20} y={40} width={500} height={250} rx="10" fill="#fffdf6" stroke="#d9d2bd" strokeWidth="1.6" />
    <rect x={cx - 86} y={cy - 26} width={172} height={52} rx="6" fill="none" stroke={muted} strokeWidth="1.6" strokeDasharray="5 4" />
    <BarMagnet x={cx} y={cy} len={160} h={40} />
    <path d={linePath(pts.slice(iStart, iEnd + 1), 1)} stroke={ink} strokeWidth="2" fill="none" />
    {[0, 1, 2].map(k => {
      const [p, q] = [dots[k], dots[k + 1]], mid: Pt = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
      const ang = Math.atan2(q[1] - p[1], q[0] - p[0])
      const off: Pt = [Math.sin(ang) * 34, -Math.cos(ang) * 34]
      return <g key={k}>
        <Compass x={r1(mid[0])} y={r1(mid[1])} r={19} angle={ang} dim={k < 2} />
        <Num n={k + 1} x={r1(mid[0] + off[0])} y={r1(mid[1] + off[1])} state={k === 2 ? 'active' : 'on'} />
      </g>
    })}
    {dots.map((p, i) => <circle key={i} cx={r1(p[0])} cy={r1(p[1])} r="3.6" fill={ink} />)}
    <Lines x={30} y={26} lines={['tail goes where the tip was; then join the dots']} size={14} />
    <Lines x={cx} y={cy + 52} anchor="middle" lines={['draw round the magnet first']} size={13} weight={600} colour={muted} />
  </PhysicsDiagram>
}

function Earth() {
  const cx = 250, cy = 160, R = 88
  // Traced as a horizontal magnet (north pole on the left) and turned a quarter turn, so the north pole of the
  // magnet points down, to the geographic south: the Earth's field goes out near the South Pole, round, and in near
  // the North Pole. A compass on the surface therefore points north.
  const { lines } = barField({ cx, cy, half: 40, angles: [34, 50, 70], box: [cx - 150, cy - 240, cx + 150, cy + 240], axial: false })
  return <PhysicsDiagram title="The Earth drawn with a bar magnet inside it: the Earth's core is magnetic. Field lines loop round the Earth. Compasses on the surface point north. The magnet's south pole is under the geographic North Pole.">
    <g transform={`rotate(-90 ${cx} ${cy})`}>
      {lines.map((l, i) => <FieldLine key={i} pts={l.pts} arrow={l.arrow} opacity={0.75} />)}
    </g>
    <circle cx={cx} cy={cy} r={R} fill="#cfe6f3" stroke={P.waterLine} strokeWidth="2.2" />
    <path d="M190 112Q214 84 246 98Q262 120 236 136Q226 162 204 152Q180 138 190 112Z" fill={P.plant} stroke={P.plantLine} strokeWidth="1.6" />
    <path d="M272 178Q300 166 314 190Q318 218 292 228Q270 216 272 178Z" fill={P.plant} stroke={P.plantLine} strokeWidth="1.6" />
    <circle cx={cx} cy={cy} r="38" fill="#f1d9b8" opacity=".85" />
    <BarMagnet x={cx} y={cy} len={92} h={26} angle={-90} />
    <path d={`M${cx} ${cy - R}V${cy - R - 14}`} stroke={ink} strokeWidth="2" />
    <Lines x={cx} y={cy - R - 20} anchor="middle" lines={['North Pole']} size={14} />
    <Compass x={cx - R - 18} y={cy} r={15} angle={-Math.PI / 2} />
    <Compass x={cx + R + 18} y={cy} r={15} angle={-Math.PI / 2} />
    <Leader from={[400, 80]} to={[cx + 14, cy - 18]} />
    <Lines x={404} y={76} lines={['core is magnetic']} size={14} />
    <Lines x={420} y={236} lines={['compasses', 'point north']} size={14} />
    <path d="M430 216Q400 196 372 172" stroke={ink} strokeWidth="1.4" fill="none" />
  </PhysicsDiagram>
}

/* ---------- Section: permanent and induced ---------- */

function Types() {
  const L = barField({ cx: 136, cy: 150, half: 56, angles: [40, 75, 115], box: [22, 64, 250, 250] })
  const R = barField({ cx: 342, cy: 150, half: 50, angles: [40, 75, 115], box: [282, 64, 520, 250] })
  return <PhysicsDiagram title="Left: a permanent magnet with its own magnetic field. Right: an iron nail next to a magnet. The nail sits in the magnet's field and becomes an induced magnet.">
    <rect x={14} y={14} width={244} height={272} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <rect x={274} y={14} width={252} height={272} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    {L.lines.map((l, i) => <FieldLine key={i} pts={l.pts} arrow={l.arrow} width={1.6} />)}
    <BarMagnet x={136} y={150} len={112} h={30} />
    {R.lines.map((l, i) => <FieldLine key={i} pts={l.pts} arrow={null} width={1.4} opacity={0.35} />)}
    <BarMagnet x={342} y={150} len={100} h={28} />
    <Nail x={404} y={150} len={96} angle={0} />
    <Lines x={136} y={264} anchor="middle" lines={['its own field']} size={13} weight={650} colour={muted} />
    <Lines x={136} y={42} anchor="middle" lines={['permanent magnet']} size={15} />
    <Lines x={400} y={42} anchor="middle" lines={['induced magnet']} size={15} />
    <Leader from={[462, 206]} to={[450, 154]} />
    <Lines x={462} y={222} anchor="middle" lines={['iron nail']} size={13} />
    <Lines x={400} y={264} anchor="middle" lines={['needs a field']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

function Pin({ x, y, angle = 90 }: { x: number; y: number; angle?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${angle - 90})`}>
    <path d="M0 0V40" stroke="#8a98a5" strokeWidth="2.2" />
    <circle cx={0} cy={0} r="4" fill="#f0c56a" stroke="#b08a2e" strokeWidth="1.4" />
  </g>
}
function Induced() {
  return <PhysicsDiagram title="Left: a magnet holds an iron nail, and the nail holds a pin: the nail is an induced magnet. Right: the nail is taken away from the magnet and the pin drops off: the field is gone, so the magnetism is gone.">
    <rect x={14} y={14} width={250} height={272} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <rect x={276} y={14} width={250} height={272} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <BarMagnet x={100} y={80} len={96} h={30} angle={-90} />
    <Nail x={100} y={132} len={78} />
    <Pin x={100} y={214} />
    <Leader from={[168, 160]} to={[106, 168]} />
    <Lines x={172} y={154} lines={['nail is an', 'induced magnet']} size={14} />
    <Lines x={140} y={278} anchor="middle" lines={['in the field']} size={13} weight={650} colour={muted} />
    <BarMagnet x={320} y={80} len={96} h={30} angle={-90} opacity={0.35} />
    <Nail x={430} y={78} len={78} angle={70} />
    <Pin x={446} y={206} angle={60} />
    <Arrow from={[476, 176]} to={[476, 236]} colour={muted} width={2.4} />
    <Lines x={400} y={262} anchor="middle" lines={['field gone,', 'magnetism gone']} size={14} />
  </PhysicsDiagram>
}

/* ---------- Question ---------- */

function QuestionField() {
  const pts: [number, Pt][] = [[1, [168, 150]], [2, [40, 40]], [3, [270, 76]], [4, [510, 216]]]
  return <PhysicsDiagram title="A bar magnet with its field lines and four numbered points around it.">
    <FieldedMagnet cx={270} cy={150} />
    {pts.map(([n, [x, y]]) => <Num key={n} n={n} x={x} y={y} />)}
  </PhysicsDiagram>
}

export function MagnetVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  const views: Record<string, () => ReactNode> = {
    'magnet-poles': () => <Poles />,
    'magnet-forces': () => <Forces />,
    'magnet-materials': () => <Materials />,
    'magnet-field': () => <Field />,
    'magnet-lines': () => <FieldLines marker />,
    'magnet-strength': () => <Strength assessment={assessment} />,
    'magnet-compass': () => <CompassView />,
    'magnet-plot': () => <Plot />,
    'magnet-earth': () => <Earth />,
    'magnet-types': () => <Types />,
    'magnet-induced': () => <Induced />,
    'magnet-q-field': () => <QuestionField />,
  }
  return <>{views[focus]?.() ?? null}</>
}
