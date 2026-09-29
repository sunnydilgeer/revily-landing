import { type ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, Leader, Cell, Wire, CurrentArrow, type Pt } from './PhysicsKit'
import { Num, Arrow, skin, skinLine, shirt, shirtLine } from './EnergyStoreVisuals'
import { magnetColours as M, Chevron, Compass, FieldLine, linePath, apex } from './MagnetVisuals'

/*
 * Physics Lesson 64: Electromagnetism. Original, code-native schematics; not to scale. Focus ids start with 'emag-'.
 *
 * Straight wire: the wire stands upright through a flat card, seen from the front and a little above, so the circles
 * of field round it show as flattened rings. Everything on the card is drawn in top-view coordinates and squashed by
 * K, so compass needles and arrowheads stay tangent to the rings. With the current UP, the field is anticlockwise
 * seen from above (right-hand thumb rule), so on the near (lower) side of each ring the arrow points RIGHT.
 *
 * Solenoid: the field lines are traced numerically through the field of the coil cut along its axis (each turn
 * crosses the cut once at the top and once at the bottom, like a pair of straight wires with opposite currents).
 * That makes the pattern physically right by construction: straight, parallel, evenly spaced lines inside, and
 * outside a bar-magnet shape leaving the north end and returning to the south end. The helix is drawn so the current
 * runs DOWN the front of every turn; with that current the north pole is on the RIGHT (grip rule: fingers along the
 * current, thumb points to N), and the traced field agrees.
 *
 * Colours: current vermilion (the Physics current colour), field lines the magnetic steel grey of Lesson 63, coil
 * copper, north red and south blue as in Lesson 63.
 */
const { ink, muted } = P
const r1 = (n: number) => Math.round(n * 10) / 10
const K = 0.36
const copper = '#c47a3c', copperBack = '#e2b48c'
const card = '#fffdf6', cardLine = '#d9d2bd'

/* ---------- Straight wire ---------- */

/** Screen point and field direction on a ring of radius R at angle t (top-view angle, SVG sense). */
function ringPoint(cx: number, cy: number, R: number, t: number, dir: number) {
  const at: Pt = [r1(cx + R * Math.cos(t)), r1(cy + K * R * Math.sin(t))]
  // Anticlockwise from above for current up (dir 1): tangent (sin t, −cos t) in top view, squashed by K on screen.
  const tx = Math.sin(t) * dir, ty = -Math.cos(t) * dir * K
  return { at, angle: Math.atan2(ty, tx) }
}

type WireProps = {
  cx: number; cy: number; radii: number[]; dir?: 1 | -1; top?: number; bottom?: number
  current?: 'small' | 'normal' | 'large'; label?: boolean; ringWidth?: number; compasses?: number; arrows?: boolean
}
/** An upright wire through a card, with its rings of field. */
function WireScene({ cx, cy, radii, dir = 1, top = 30, bottom = 280, current = 'normal', label = true, ringWidth = 2, compasses = 0, arrows = true }: WireProps) {
  // The card: a square in top view, squashed by K and sheared a little so it reads as a flat sheet.
  const h = Math.max(...radii) + 14, sh = 0.18
  const c = (X: number, Y: number) => `${r1(cx + X + sh * Y)} ${r1(cy + K * Y)}`
  const w = current === 'large' ? 4.4 : current === 'small' ? 2.2 : 3.2
  const arrowTop = dir > 0 ? [cy - 60, cy - 116] : [cy - 116, cy - 60]
  const compassR = radii[Math.min(1, radii.length - 1)]
  return <g>
    <path d={`M${cx} ${cy}V${bottom}`} stroke={P.wire} strokeWidth="5" opacity=".45" />
    <path d={`M${c(-h, -h)}L${c(h, -h)}L${c(h, h)}L${c(-h, h)}Z`} fill={card} stroke={cardLine} strokeWidth="1.8" opacity=".92" />
    {radii.map((R, i) => <g key={R}>
      <ellipse cx={cx} cy={cy} rx={R} ry={r1(R * K)} fill="none" stroke={M.field} strokeWidth={ringWidth} />
      {arrows && <Chevron {...ringPoint(cx, cy, R, Math.PI / 2 + (i % 2 ? 0.35 : -0.35), dir)} size={9 + ringWidth} />}
      {arrows && R > 40 && <Chevron {...ringPoint(cx, cy, R, -Math.PI / 2, dir)} size={8 + ringWidth} />}
    </g>)}
    <ellipse cx={cx} cy={cy} rx="5" ry="2.4" fill={ink} />
    <path d={`M${cx} ${top}V${cy}`} stroke={P.wire} strokeWidth="5" />
    <Arrow from={[cx + 16, arrowTop[0]]} to={[cx + 16, arrowTop[1]]} colour={P.current} width={w} />
    {label && <Lines x={cx + 30} y={cy - 84} lines={['current']} size={14} colour={P.current} />}
    {Array.from({ length: compasses }, (_, i) => {
      const t = Math.PI / 4 + i * Math.PI / 2
      const { at, angle } = ringPoint(cx, cy, compassR, t, dir)
      return <Compass key={i} x={at[0]} y={at[1]} r={17} angle={angle} />
    })}
  </g>
}

function WireView() {
  return <PhysicsDiagram title="A straight wire standing upright through a card, with the current flowing up. The magnetic field is made of circles round the wire. Seen from above, the circles go anticlockwise.">
    <WireScene cx={210} cy={180} radii={[34, 64, 98]} />
    <Leader from={[400, 236]} to={[300, 200]} />
    <Lines x={404} y={240} lines={['magnetic field:', 'circles round', 'the wire']} size={14} colour={M.field} />
    <Lines x={400} y={60} lines={['no current,', 'no field']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

function CompassView() {
  return <PhysicsDiagram title="Four small compasses placed round the wire on the card. Each needle lines up along the circle, pointing the way the field goes.">
    <WireScene cx={210} cy={180} radii={[40, 100]} compasses={4} arrows={false} ringWidth={1.6} />
    <Leader from={[398, 110]} to={[282, 162]} />
    <Lines x={402} y={100} lines={['compass needle', 'points along', 'the field']} size={14} />
    <Lines x={402} y={250} lines={['red end = north']} size={13} weight={650} colour={M.nLine} />
  </PhysicsDiagram>
}

/** A simple right hand gripping an upright wire at (x, y): thumb up the wire, fingers across the front. */
function RightHand({ x, y }: { x: number; y: number }) {
  // Fingers wrap round the front of the wire from the back of the hand (left) to the fingertips (right): the same
  // way as the field on the near side when the current is up.
  return <g>
    <path d={`M${x - 70} ${y + 110}L${x - 44} ${y + 56}`} stroke={shirtLine} strokeWidth="30" />
    <path d={`M${x - 70} ${y + 110}L${x - 44} ${y + 56}`} stroke={shirt} strokeWidth="25" />
    <path d={`M${x - 56} ${y - 34}Q${x - 62} ${y + 10} ${x - 50} ${y + 60}Q${x - 30} ${y + 72} ${x - 12} ${y + 58}L${x - 14} ${y - 36}Q${x - 36} ${y - 44} ${x - 56} ${y - 34}Z`} fill={skin} stroke={skinLine} strokeWidth="2" />
    {[0, 1, 2, 3].map(i => {
      const fy = y - 30 + i * 22
      return <path key={i} d={`M${x - 40} ${fy}H${x + 18}Q${x + 30} ${fy} ${x + 30} ${fy + 10}Q${x + 30} ${fy + 20} ${x + 18} ${fy + 20}H${x - 40}Z`} fill={skin} stroke={skinLine} strokeWidth="2" />
    })}
    <path d={`M${x - 26} ${y - 30}Q${x - 30} ${y - 70} ${x - 14} ${y - 92}Q${x - 2} ${y - 100} ${x + 2} ${y - 84}Q${x - 2} ${y - 60} ${x - 4} ${y - 32}Z`} fill={skin} stroke={skinLine} strokeWidth="2" />
    <path d={`M${x - 9} ${y - 88}Q${x - 4} ${y - 90} ${x - 2} ${y - 84}`} stroke={skinLine} strokeWidth="1.4" fill="none" />
  </g>
}
function Thumb() {
  const hx = 390, hy = 170
  return <PhysicsDiagram title="Left: the wire with the current up and the circular field. Right: a right hand gripping the wire. The thumb points along the current; the curled fingers point the way the field goes.">
    <WireScene cx={130} cy={180} radii={[40, 80]} />
    <path d={`M${hx} 24V286`} stroke={P.wire} strokeWidth="5" />
    <ellipse cx={hx} cy={hy + 16} rx="66" ry="22" fill="none" stroke={M.field} strokeWidth="2.4" strokeDasharray="6 5" />
    <RightHand x={hx} y={hy} />
    <path d={`M${hx - 66} ${hy + 16}A66 22 0 0 0 ${hx + 66} ${hy + 16}`} fill="none" stroke={M.field} strokeWidth="2.6" />
    <Chevron at={[hx + 34, r1(hy + 16 + 22 * Math.sqrt(1 - (34 / 66) ** 2))]} angle={-0.2} size={12} />
    <Arrow from={[hx + 18, 70]} to={[hx + 18, 30]} colour={P.current} width={3.2} />
    <Leader from={[476, 60]} to={[hx - 6, hy - 70]} />
    <Lines x={472} y={40} anchor="middle" lines={['thumb:', 'current']} size={14} colour={P.current} />
    <Leader from={[478, 250]} to={[hx + 56, hy + 28]} />
    <Lines x={478} y={268} anchor="middle" lines={['fingers: field']} size={14} colour={M.field} />
  </PhysicsDiagram>
}

function Reverse() {
  return <PhysicsDiagram title="Two wires. Left: current up, and the field goes anticlockwise seen from above. Right: current down, and the field goes the other way, clockwise.">
    <rect x={10} y={10} width={256} height={280} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <rect x={274} y={10} width={256} height={280} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <WireScene cx={138} cy={176} radii={[36, 76]} top={34} bottom={262} label={false} />
    <WireScene cx={402} cy={176} radii={[36, 76]} top={34} bottom={262} dir={-1} label={false} />
    <Lines x={138} y={280} anchor="middle" lines={['current up']} size={15} colour={P.current} />
    <Lines x={402} y={280} anchor="middle" lines={['current down']} size={15} colour={P.current} />
  </PhysicsDiagram>
}

/* ---------- Strength ---------- */

function Distance() {
  const cx = 230, cy = 170
  return <PhysicsDiagram title="Field rings round a wire: close together near the wire and further apart further out. A point close to the wire has a strong field; a point far away has a weak field.">
    <WireScene cx={cx} cy={cy} radii={[20, 32, 50, 78, 120]} ringWidth={1.8} />
    <circle cx={cx + 26} cy={cy + 12} r="6" fill={P.hot} stroke="white" strokeWidth="2" />
    <Leader from={[330, 262]} to={[cx + 28, cy + 16]} colour={P.hot} />
    <Lines x={334} y={276} lines={['close: strong']} size={15} colour={P.hot} />
    <circle cx={cx + 150} cy={cy - 10} r="6" fill={P.cold} stroke="white" strokeWidth="2" />
    <Lines x={cx + 150} y={cy - 26} anchor="middle" lines={['far: weak']} size={15} colour={P.cold} />
  </PhysicsDiagram>
}

function CurrentView() {
  return <PhysicsDiagram title="Two wires. Left: a small current, with a few rings far apart. Right: a larger current, with more rings closer together: a stronger field.">
    <rect x={10} y={10} width={256} height={280} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <rect x={274} y={10} width={256} height={280} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <WireScene cx={138} cy={180} radii={[40, 90]} top={36} bottom={256} current="small" label={false} ringWidth={1.6} />
    <WireScene cx={402} cy={180} radii={[18, 30, 45, 64, 90]} top={36} bottom={256} current="large" label={false} ringWidth={2} />
    <Lines x={138} y={280} anchor="middle" lines={['small current']} size={15} />
    <Lines x={402} y={280} anchor="middle" lines={['larger current']} size={15} colour={P.current} />
  </PhysicsDiagram>
}

/* ---------- Solenoid ---------- */

type Solenoid = { x0: number; x1: number; cy: number; a: number; turns: number }
type Wire2 = [number, number, number]
/**
 * Where the coil crosses the cut along its axis: out of the page at the top, into the page at the bottom. Each turn's
 * top and bottom crossings are put at the same x (the slight slant of the helix is left out), so the pattern is symmetric.
 */
function crossings({ x0, x1, cy, a, turns }: Solenoid): Wire2[] {
  const p = (x1 - x0) / turns, w: Wire2[] = []
  for (let i = 0; i < turns; i++) { w.push([x0 + (i + 0.5) * p, cy - a, 1]); w.push([x0 + (i + 0.5) * p, cy + a, -1]) }
  return w
}
/** Field of straight wires in screen coordinates (y down); I = +1 is out of the page. */
function field2(x: number, y: number, wires: Wire2[]): Pt {
  let bx = 0, by = 0
  for (const [wx, wy, I] of wires) { const dx = x - wx, dy = y - wy, d2 = dx * dx + dy * dy + 1e-6; bx += I * dy / d2; by += -I * dx / d2 }
  return [bx, by]
}
function trace2(start: Pt, wires: Wire2[], box: [number, number, number, number], dir = 1, step = 1.5): { pts: Pt[]; closed: boolean } {
  const pts: Pt[] = [start]
  let [x, y] = start, len = 0
  const u = (v: Pt): Pt => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
  for (let i = 0; i < 6000; i++) {
    const [ax, ay] = u(field2(x, y, wires))
    const [bx, by] = u(field2(x + ax * dir * step / 2, y + ay * dir * step / 2, wires))
    x += bx * dir * step; y += by * dir * step; len += step
    pts.push([x, y])
    if (x < box[0] || x > box[2] || y < box[1] || y > box[3]) return { pts, closed: false }
    if (len > 60 && Math.hypot(x - start[0], y - start[1]) < step * 1.2) { pts.push(start); return { pts, closed: true } }
    if (wires.some(([wx, wy]) => Math.hypot(x - wx, y - wy) < 3)) return { pts, closed: false }
  }
  return { pts, closed: false }
}
type Traced = { pts: Pt[]; arrows: { at: Pt; angle: number }[] }
function solenoidField(s: Solenoid, fracs: number[], box: [number, number, number, number] = [6, 6, 534, 294]): Traced[] {
  // Start each line inside, halfway between a front and a back half-turn, so its inside arrowhead is not hidden.
  const wires = crossings(s), cx = s.x0 + (Math.floor(s.turns / 2) + 0.5) * (s.x1 - s.x0) / s.turns
  return fracs.map(f => {
    const start: Pt = [cx, s.cy + f * s.a]
    const fwd = trace2(start, wires, box)
    const inside = { at: start, angle: Math.atan2(...(([bx, by]) => [by, bx] as [number, number])(field2(start[0], start[1], wires))) }
    if (fwd.closed) return { pts: fwd.pts, arrows: [inside, apex(fwd.pts, s.cy)] }
    const back = trace2(start, wires, box, -1).pts.reverse()
    const pts = [...back, ...fwd.pts.slice(1)]
    // Outside arrows: near where each half leaves the drawing, pointing along the line.
    const outA = fwd.pts[Math.max(0, fwd.pts.length - 40)], outA2 = fwd.pts[Math.max(0, fwd.pts.length - 34)]
    const outB = back[34] ?? back[0], outB2 = back[40] ?? back[back.length - 1]
    return { pts, arrows: [inside, { at: outA2, angle: Math.atan2(outA2[1] - outA[1], outA2[0] - outA[0]) }, { at: outB, angle: Math.atan2(outB2[1] - outB[1], outB2[0] - outB[0]) }] }
  })
}

/** The coil: back halves of the turns (pale), then `middle` (field lines, core), then the front halves with current arrows. */
function Coil({ s, middle, arrows = true, leads = false }: { s: Solenoid; middle?: ReactNode; arrows?: boolean; leads?: boolean }) {
  const { x0, x1, cy, a, turns } = s, p = (x1 - x0) / turns
  const ang = Math.atan2(2 * a, p / 2) * 180 / Math.PI
  return <g>
    {Array.from({ length: turns }, (_, i) => <path key={`b${i}`} d={`M${r1(x0 + (i + 0.5) * p)} ${cy + a}Q${r1(x0 + (i + 0.85) * p)} ${cy} ${r1(x0 + (i + 1) * p)} ${cy - a}`} stroke={copperBack} strokeWidth="4" fill="none" />)}
    {middle}
    {Array.from({ length: turns }, (_, i) => <path key={`f${i}`} d={`M${r1(x0 + i * p)} ${cy - a}Q${r1(x0 + (i + 0.15) * p)} ${cy} ${r1(x0 + (i + 0.5) * p)} ${cy + a}`} stroke={copper} strokeWidth="5" fill="none" />)}
    {arrows && [1, turns - 2].map(i => <CurrentArrow key={i} x={r1(x0 + (i + 0.3) * p)} y={cy + a * 0.2} rotate={r1(ang)} />)}
    {leads && <g>
      <Wire points={[[x0, cy - a], [x0 - 30, cy - a], [x0 - 30, cy + a + 70], [x0 + (x1 - x0) / 2 - 30, cy + a + 70]]} colour={copper} width={3} />
      <Wire points={[[x1, cy - a], [x1 + 30, cy - a], [x1 + 30, cy + a + 70], [x0 + (x1 - x0) / 2 + 30, cy + a + 70]]} colour={copper} width={3} />
    </g>}
  </g>
}
function Poles({ s, big = false }: { s: Solenoid; big?: boolean }) {
  const fs = big ? 22 : 18
  return <g fontSize={fs} fontWeight="800" textAnchor="middle">
    <circle cx={s.x0 - 34} cy={s.cy} r={fs * 0.72} fill="white" stroke={M.sLine} strokeWidth="2" />
    <text x={s.x0 - 34} y={s.cy + fs * 0.36} fill={M.sLine}>S</text>
    <circle cx={s.x1 + 34} cy={s.cy} r={fs * 0.72} fill="white" stroke={M.nLine} strokeWidth="2" />
    <text x={s.x1 + 34} y={s.cy + fs * 0.36} fill={M.nLine}>N</text>
  </g>
}
function FieldSet({ lines, width = 1.8, arrowsOn = true }: { lines: Traced[]; width?: number; arrowsOn?: boolean }) {
  return <g>
    {lines.map((l, i) => <g key={i}>
      <FieldLine pts={l.pts} width={width} />
      {arrowsOn && l.arrows.map((a, k) => <Chevron key={k} at={a.at} angle={a.angle} size={7 + width * 1.4} />)}
    </g>)}
  </g>
}

const SOL: Solenoid = { x0: 150, x1: 390, cy: 150, a: 44, turns: 8 }
const FRACS = [-0.52, -0.26, 0, 0.26, 0.52]

function CoilView() {
  const s: Solenoid = { x0: 160, x1: 380, cy: 110, a: 44, turns: 8 }
  return <PhysicsDiagram title="A coil of wire, called a solenoid, joined to a cell. The current flows from the cell round and round the coil.">
    <Coil s={s} leads />
    <Cell x={270} y={s.cy + s.a + 70} length={60} />
    <CurrentArrow x={s.x0 - 30} y={s.cy + 40} rotate={-90} />
    <Lines x={270} y={32} anchor="middle" lines={['solenoid: a coil of wire']} size={16} />
    <Lines x={270} y={s.cy + s.a + 108} anchor="middle" lines={['cell']} size={13} weight={650} colour={muted} />
    <Lines x={452} y={s.cy + 4} lines={['current']} size={14} colour={P.current} />
    <Leader from={[450, s.cy - 2]} to={[s.x1 - 14, s.cy + 8]} colour={P.current} />
  </PhysicsDiagram>
}

function SolenoidView({ assessment = false, question = false }: { assessment?: boolean; question?: boolean }) {
  const lines = solenoidField(SOL, FRACS)
  const cx = (SOL.x0 + SOL.x1) / 2
  const pts: [number, Pt][] = [[1, [SOL.x1 + 92, SOL.cy]], [2, [cx + 50, SOL.cy - SOL.a - 24]], [3, [cx, 22]], [4, [cx + 12, SOL.cy + 2]]]
  return <PhysicsDiagram title={question
    ? 'A solenoid with its field lines, and four numbered points: 1 beyond one end, 2 just outside beside the coil, 3 far above the coil, 4 inside the coil in the middle.'
    : 'The field of a solenoid. Outside, the field lines loop from the north end round to the south end, just like a bar magnet. Inside, the lines are straight, parallel and close together: the field is strong and uniform.'}>
    <Coil s={SOL} middle={<FieldSet lines={lines} arrowsOn={!question} />} arrows={!question} />
    {question && <FieldSet lines={lines.map(l => ({ ...l, arrows: [] }))} width={0} arrowsOn={false} />}
    <Poles s={SOL} />
    {!question && <g>
      <rect x={196} y={236} width={148} height={46} rx="14" fill="white" stroke={P.panelLine} strokeWidth="1.5" />
      <Lines x={270} y={255} anchor="middle" lines={['inside: strong', 'and uniform']} size={13} />
      <path d="M270 236V196" stroke={ink} strokeWidth="1.4" />
      <rect x={390} y={10} width={140} height={46} rx="14" fill="white" stroke={P.panelLine} strokeWidth="1.5" />
      <Lines x={460} y={29} anchor="middle" lines={['outside: like', 'a bar magnet']} size={13} />
    </g>}
    {question && pts.map(([n, [x, y]]) => <Num key={n} n={n} x={x} y={y} />)}
    {void assessment}
  </PhysicsDiagram>
}

function Loops() {
  const cy = 150, a = 64, xs = [150, 210, 270, 330, 390]
  const r = 17
  const Ring = ({ x, y, out }: { x: number; y: number; out: boolean }) => {
    // Out of the page (top): anticlockwise on the page; into the page (bottom): clockwise.
    const s = out ? 1 : -1
    return <g>
      <circle cx={x} cy={y} r={r} fill="none" stroke={M.field} strokeWidth="1.8" />
      <Chevron at={[x, y + s * r]} angle={0} size={8} />
      <Chevron at={[x, y - s * r]} angle={Math.PI} size={8} />
    </g>
  }
  return <PhysicsDiagram title="A few turns of the coil seen from the side. Each turn has its own small circles of field round the wire. Inside the coil the fields of the turns all point the same way, so they add up into straight lines close together.">
    {xs.map(x => <ellipse key={`b${x}`} cx={x} cy={cy} rx="12" ry={a} fill="none" stroke={copperBack} strokeWidth="4" />)}
    {xs.map(x => <path key={`f${x}`} d={`M${x} ${cy - a}A12 ${a} 0 0 0 ${x} ${cy + a}`} fill="none" stroke={copper} strokeWidth="5" />)}
    {xs.map(x => <g key={`r${x}`}><Ring x={x} y={cy - a} out /><Ring x={x} y={cy + a} out={false} /></g>)}
    {[-24, 0, 24].map(dy => <g key={dy}>
      <path d={`M112 ${cy + dy}H428`} stroke={M.field} strokeWidth="2.4" />
      <Chevron at={[436, cy + dy]} angle={0} size={12} />
    </g>)}
    <Leader from={[92, 50]} to={[140, cy - a - 6]} />
    <Lines x={20} y={40} lines={['each turn']} size={14} />
    <Lines x={456} y={cy - 18} lines={['lines', 'line up']} size={14} colour={M.field} />
    <Lines x={456} y={cy + 30} lines={['close', 'together']} size={14} colour={M.field} />
    <Lines x={270} y={282} anchor="middle" lines={['the small fields add up inside the coil']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

function Core() {
  const s = SOL
  const lines = solenoidField(s, [-0.54, -0.36, -0.18, 0, 0.18, 0.36, 0.54])
  return <PhysicsDiagram title="A solenoid with a block of iron inside it: an electromagnet. The field lines are closer together and the field is stronger.">
    <Coil s={s} middle={<g>
      <rect x={s.x0 - 12} y={s.cy - s.a + 8} width={s.x1 - s.x0 + 24} height={2 * s.a - 16} rx="6" fill={M.iron} stroke={M.ironLine} strokeWidth="2" />
      <FieldSet lines={lines} width={2.4} />
    </g>} />
    <Poles s={s} />
    <Leader from={[110, 262]} to={[s.x0 + 10, s.cy + 18]} />
    <Lines x={20} y={278} lines={['iron core']} size={15} />
    <rect x={318} y={244} width={210} height={46} rx="14" fill="#fff6e3" stroke="#e7b75e" strokeWidth="1.8" />
    <Lines x={423} y={263} anchor="middle" lines={['electromagnet:', 'stronger field']} size={14} />
  </PhysicsDiagram>
}

/* ---------- Questions ---------- */

function QWire() {
  const cx = 230, cy = 170
  return <PhysicsDiagram title="A wire with a current and rings of magnetic field round it. Point 1 is close to the wire. Point 2 is far from the wire.">
    <WireScene cx={cx} cy={cy} radii={[24, 48, 84, 130]} />
    <circle cx={cx + 30} cy={cy + 8} r="4.5" fill={ink} />
    <Num n={1} x={cx + 30} y={cy + 30} />
    <circle cx={cx + 160} cy={cy - 6} r="4.5" fill={ink} />
    <Num n={2} x={cx + 160} y={cy - 28} />
  </PhysicsDiagram>
}

export function ElectromagVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  const views: Record<string, () => ReactNode> = {
    'emag-wire': () => <WireView />,
    'emag-compass': () => <CompassView />,
    'emag-thumb': () => <Thumb />,
    'emag-reverse': () => <Reverse />,
    'emag-distance': () => <Distance />,
    'emag-current': () => <CurrentView />,
    'emag-coil': () => <CoilView />,
    'emag-solenoid': () => <SolenoidView />,
    'emag-loops': () => <Loops />,
    'emag-core': () => <Core />,
    'emag-q-wire': () => <QWire />,
    'emag-q-solenoid': () => <SolenoidView question assessment={assessment} />,
  }
  return <>{views[focus]?.() ?? null}</>
}
void linePath
