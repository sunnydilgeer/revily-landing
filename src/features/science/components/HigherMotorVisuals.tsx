import { type ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, Leader, Cell, type Pt } from './PhysicsKit'
import { Num, Arrow, skin, skinLine, shirt, shirtLine } from './EnergyStoreVisuals'
import { magnetColours as M, Chevron } from './MagnetVisuals'

/*
 * Physics P7, a lesson only some students get (Physics Lesson 64H): the motor effect. Original, code-native schematics;
 * not to scale. Focus ids start with 'hmotor-'.
 *
 * One set-up all the way through: a north pole (red, as in the magnets lesson) facing a south pole (blue) across a gap,
 * drawn in a simple perspective. x runs to the right, y runs into the page (drawn going up and to the LEFT, so the
 * front of the set-up is at the lower right) and z runs up. The field lines (steel grey, as in the magnets and
 * electromagnetism lessons) lie flat in the middle of the gap and go from N to S. The wire crosses the gap from front
 * to back, so it is at 90° to the field.
 *
 * Directions are worked out, not guessed: F = I l × B. With N on the left the field is +x; a current towards you (−y)
 * gives (−y) × (+x) = +z, so the force is UP. Fleming's left hand is drawn with the same three directions: first finger
 * right (field), second finger towards you, drawn down and to the right (current), thumb up (motion).
 *
 * In the dc motor the current runs away from you along the left side of the coil and towards you along the right side,
 * so the left side is pushed down and the right side up: anticlockwise as you look into the page. The + contact is on
 * the left, touching (at this moment) the half-ring wired to the left side.
 *
 * Colours: current vermilion (the Physics current colour), field steel grey, force green, coil copper, the split ring's
 * two halves amber and teal. Amber marks what a frame is about; the rest is faded. Equation symbols are set in a serif
 * italic so that I (current) and l (length) look different. Question views show the set-up only: no force arrow, no
 * direction words and no part names.
 */
const { ink, muted } = P
const r1 = (n: number) => Math.round(n * 10) / 10
const force = '#2f8a57', forceSoft = '#e2f2e8'
const amber = '#d98a1c', amberInk = '#8a5a14', amberSoft = '#fdf0d8'
const copper = '#c47a3c'
const halfA = '#efbf6a', halfALine = '#a8741c', halfB = '#8fcbbf', halfBLine = '#2f7f73'
const serif = 'Georgia, "Times New Roman", serif'
const faded = 0.28

/* ---------- Perspective ---------- */

/** Local projection: x right, y into the page (drawn up and to the left), z up. */
const KX = 0.45, KY = 0.62
const pj = (x: number, y: number, z: number): Pt => [r1(x - KX * y), r1(-z - KY * y)]
type View = { o: Pt; s: number }
/** Where a local point lands on the page, for labels drawn outside the scaled group. */
const at = (v: View, x: number, y: number, z: number): Pt => { const [a, b] = pj(x, y, z); return [r1(v.o[0] + v.s * a), r1(v.o[1] + v.s * b)] }
const poly = (pts: Pt[]) => `M${pts.map(p => `${p[0]} ${p[1]}`).join('L')}Z`
const seg = (a: Pt, b: Pt) => `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`

const GAP = 120, OUT = 180, DEPTH = 110, HALF = 40
type Poles = 'NS' | 'SN'

/** One magnet block from x0 to x1: top, left-hand and front faces, with its pole letter on the front. */
function Block({ x0, x1, pole }: { x0: number; x1: number; pole: 'N' | 'S' }) {
  const [front, top, side, line] = pole === 'N' ? [M.n, '#f6b8ad', '#d9705f', M.nLine] : [M.s, '#b6cfea', '#6f9acb', M.sLine]
  const f = poly([pj(x0, 0, HALF), pj(x1, 0, HALF), pj(x1, 0, -HALF), pj(x0, 0, -HALF)])
  const t = poly([pj(x0, 0, HALF), pj(x1, 0, HALF), pj(x1, DEPTH, HALF), pj(x0, DEPTH, HALF)])
  const sd = poly([pj(x0, 0, HALF), pj(x0, DEPTH, HALF), pj(x0, DEPTH, -HALF), pj(x0, 0, -HALF)])
  const c = pj((x0 + x1) / 2, 0, 0)
  return <g>
    <path d={t} fill={top} stroke={line} strokeWidth="2.2" />
    <path d={sd} fill={side} stroke={line} strokeWidth="2.2" />
    <path d={f} fill={front} stroke={line} strokeWidth="2.2" />
    <path d={seg(pj(x0 + 8, 0, HALF - 7), pj(x1 - 8, 0, HALF - 7))} stroke="white" strokeWidth="2.5" opacity=".45" />
    <text x={c[0]} y={c[1] + 10} textAnchor="middle" fontSize="28" fontWeight="800" fill="white">{pole}</text>
  </g>
}
/** The field lines, flat in the middle of the gap, from N to S. */
function FieldSheet({ poles, depths, arrows = true, width = 2 }: { poles: Poles; depths: number[]; arrows?: boolean; width?: number }) {
  const dir = poles === 'NS' ? 0 : Math.PI
  return <g>
    {depths.map(y => <g key={y}>
      <path d={seg(pj(-GAP, y, 0), pj(GAP, y, 0))} stroke={M.field} strokeWidth={width} />
      {arrows && [-40, 70].map(x => <Chevron key={x} at={pj(x, y, 0)} angle={dir} size={10} />)}
    </g>)}
  </g>
}
/** An arrow between two local points (for use inside the scaled group). */
function LArrow({ a, b, colour, width = 3.2 }: { a: [number, number, number]; b: [number, number, number]; colour: string; width?: number }) {
  return <Arrow from={pj(...a)} to={pj(...b)} colour={colour} width={width} />
}

type WireOpts = {
  v: View; poles?: Poles; current?: 'toward' | 'away' | null; force?: 'up' | 'down' | null; rings?: boolean
  depths?: number[]; dimMagnets?: boolean; dimField?: boolean; dimWire?: boolean; wire?: boolean; length?: boolean; region?: boolean
}
const WIRE_Y = 55
const FIELD_DEPTHS = [12, 40, 70, 98]
/** The straight-wire set-up: two blocks, the field between them, and a wire across the gap. */
function WireScene({ v, poles = 'NS', current = 'toward', force: f = null, rings = false, depths = FIELD_DEPTHS, dimMagnets = false, dimField = false, dimWire = false, wire = true, length = false, region = false }: WireOpts) {
  const [left, right] = poles === 'NS' ? ['N', 'S'] as const : ['S', 'N'] as const
  const mid = pj(0, WIRE_Y, 0)
  // Right-hand thumb rule: current towards you → anticlockwise as you look at it.
  const anti = current !== 'away'
  return <g transform={`translate(${v.o[0]} ${v.o[1]}) scale(${v.s})`}>
    <g opacity={dimMagnets ? faded : 1}><Block x0={GAP} x1={OUT} pole={right} /></g>
    {region && <path d={poly([pj(-50, 24, 0), pj(50, 24, 0), pj(50, 92, 0), pj(-50, 92, 0)])} fill={amberSoft} stroke={amber} strokeWidth="2.6" strokeDasharray="7 6" />}
    <g opacity={dimField ? faded : 1}><FieldSheet poles={poles} depths={depths} arrows={!region} /></g>
    {wire && <g opacity={dimWire ? faded : 1}>
      {length && <path d={seg(pj(0, 0, 0), pj(0, DEPTH, 0))} stroke={amber} strokeWidth="16" opacity=".45" />}
      <path d={seg(pj(0, -90, 0), pj(0, 140, 0))} stroke={P.wire} strokeWidth="7" />
      <path d={seg(pj(0, -90, 0), pj(0, 140, 0))} stroke="#7d93a5" strokeWidth="2.4" />
      {rings && [18, 31].map(r => <g key={r}>
        <circle cx={mid[0]} cy={mid[1]} r={r} fill="none" stroke={M.field} strokeWidth="1.8" strokeDasharray="5 4" />
        <Chevron at={[mid[0], mid[1] - r]} angle={anti ? Math.PI : 0} size={9} />
        <Chevron at={[mid[0], mid[1] + r]} angle={anti ? 0 : Math.PI} size={9} />
      </g>)}
      {current === 'toward' && <LArrow a={[-16, -22, -16]} b={[-16, -84, -16]} colour={P.current} width={3.6} />}
      {current === 'away' && <LArrow a={[-16, -84, -16]} b={[-16, -22, -16]} colour={P.current} width={3.6} />}
    </g>}
    <g opacity={dimMagnets ? faded : 1}><Block x0={-OUT} x1={-GAP} pole={left} /></g>
    {f === 'up' && <Arrow from={[mid[0], mid[1] - 8]} to={[mid[0], mid[1] - 96]} colour={force} width={4.6} />}
    {f === 'down' && <Arrow from={[mid[0], mid[1] + 8]} to={[mid[0], mid[1] + 96]} colour={force} width={4.6} />}
  </g>
}

/** A rounded chip with one or more lines of text. */
function Chip({ x, y, w, lines, tone = 'plain', size = 14 }: { x: number; y: number; w: number; lines: string[]; tone?: 'plain' | 'hot' | 'force' | 'current' | 'field'; size?: number }) {
  const [fill, line, text] = {
    plain: [P.panel, P.panelLine, ink], hot: [amberSoft, amber, amberInk], force: [forceSoft, force, force],
    current: ['#fbe6dd', P.current, '#a8401c'], field: ['#eef1f4', M.field, M.field],
  }[tone]
  const h = 14 + lines.length * (size + 4)
  return <g>
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="12" fill={fill} stroke={line} strokeWidth={tone === 'plain' ? 1.5 : 2} />
    {lines.map((l, i) => <text key={i} x={x} y={r1(y + size * 0.36 - (lines.length - 1) * (size + 4) / 2 + i * (size + 4))} textAnchor="middle" fontSize={size} fontWeight="700" fill={text}>{l}</text>)}
  </g>
}
/** An equation symbol in serif italic, so I and l look different. */
function Sym({ x, y, children, size = 16, colour = ink, anchor = 'start' }: { x: number; y: number; children: ReactNode; size?: number; colour?: string; anchor?: 'start' | 'middle' | 'end' }) {
  return <text x={x} y={y} fontSize={size} fontWeight="700" fill={colour} textAnchor={anchor}>{children}</text>
}
const it = (t: string, colour: string) => <tspan fontFamily={serif} fontStyle="italic" fill={colour}>{t}</tspan>

/* ---------- Section: the motor effect ---------- */

type EffectStage = 'field' | 'current' | 'force' | 'all'
const EFFECT_TITLES: Record<EffectStage, string> = {
  field: 'A north pole on the left faces a south pole on the right, drawn in perspective. In the gap between them the magnetic field lines go straight across from N to S.',
  current: 'The same two poles. A wire now crosses the gap from front to back, at right angles to the field. A current flows along it towards you, and dashed circles show the wire’s own magnetic field around it.',
  force: 'The same set-up. A green arrow shows the force on the wire pointing up: at right angles to the field, which goes across, and to the current, which comes towards you. This is the motor effect.',
  all: 'The whole picture: field across from N to S, current towards you, force up. The force is at right angles to both, and is biggest when the wire is at 90° to the field.',
}
const EV: View = { o: [262, 172], s: 1 }
function EffectScene({ stage }: { stage: EffectStage }) {
  const wire = stage !== 'field'
  const mid = at(EV, 0, WIRE_Y, 0)
  const curTip = at(EV, -16, -84, -16)
  const fieldPt = at(EV, 40, 98, 0)
  return <PhysicsDiagram title={EFFECT_TITLES[stage]}>
    <WireScene v={EV} wire={wire} current={wire ? 'toward' : null} rings={stage === 'current'} force={stage === 'force' || stage === 'all' ? 'up' : null} dimMagnets={stage !== 'field'} dimField={stage === 'current' || stage === 'force'} />
    <g opacity={stage === 'current' || stage === 'force' ? 0.5 : 1}>
      <Leader from={[372, 46]} to={fieldPt} colour={M.field} />
      <Lines x={340} y={38} lines={['magnetic field: N to S']} size={14} colour={M.field} />
    </g>
    {wire && <g>
      <Leader from={[372, 268]} to={[curTip[0] + 2, curTip[1] + 4]} colour={P.current} />
      <Lines x={378} y={262} lines={['current:', 'towards you']} size={14} colour={P.current} />
    </g>}
    {stage === 'current' && <g>
      <Leader from={[120, 50]} to={[r1(mid[0] - 31 * Math.cos(0.35)), r1(mid[1] + 31 * Math.sin(0.35))]} colour={M.field} />
      <Lines x={20} y={40} lines={['the wire’s own field']} size={14} colour={M.field} />
      <Chip x={120} y={268} w={210} lines={['the two fields', 'act on each other']} tone="hot" />
    </g>}
    {(stage === 'force' || stage === 'all') && <g>
      <Lines x={mid[0] + 12} y={mid[1] - 80} lines={['force']} size={16} colour={force} />
      <Chip x={120} y={268} w={210} lines={stage === 'force' ? ['the motor effect'] : ['force at 90° to field', 'and to current']} tone={stage === 'force' ? 'hot' : 'force'} size={stage === 'force' ? 15 : 13} />
    </g>}
    {stage === 'all' && <Chip x={110} y={44} w={180} lines={['biggest when the wire', 'is at 90° to the field']} tone="hot" size={13} />}
    {stage === 'field' && <Chip x={150} y={268} w={260} lines={['straight across the gap']} tone="field" />}
  </PhysicsDiagram>
}

/** Seen from above: the poles' edges, the field lines and a wire at an angle (degrees from the field). */
function TopPanel({ x, angle, label, bar }: { x: number; angle: number; label: string; bar: number }) {
  const cx = x + 82, cy = 128, w = 164
  const a = angle * Math.PI / 180, L = angle === 0 ? 46 : angle === 90 ? 64 : 56
  const ends = `M${r1(cx - L * Math.cos(a))} ${r1(cy + L * Math.sin(a))}L${r1(cx + L * Math.cos(a))} ${r1(cy - L * Math.sin(a))}`
  return <g>
    <rect x={x} y={34} width={w} height={232} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <rect x={x + 8} y={66} width={22} height={124} rx="5" fill={M.n} stroke={M.nLine} strokeWidth="2" />
    <rect x={x + w - 30} y={66} width={22} height={124} rx="5" fill={M.s} stroke={M.sLine} strokeWidth="2" />
    <text x={x + 19} y={133} textAnchor="middle" fontSize="15" fontWeight="800" fill="white">N</text>
    <text x={x + w - 19} y={133} textAnchor="middle" fontSize="15" fontWeight="800" fill="white">S</text>
    {[82, 105, 151, 174].concat(angle === 0 ? [] : [128]).map(y => <g key={y}>
      <path d={`M${x + 30} ${y}H${x + w - 30}`} stroke={M.field} strokeWidth="1.8" />
      <Chevron at={[x + 50, y]} angle={0} size={9} />
    </g>)}
    <path d={ends} stroke={P.wire} strokeWidth="6" />
    <path d={ends} stroke="#7d93a5" strokeWidth="2" />
    <Lines x={cx} y={218} anchor="middle" lines={[angle === 0 ? 'parallel' : `at ${angle}°`]} size={15} />
    <rect x={x + 22} y={232} width={w - 44} height={14} rx="7" fill="white" stroke={P.panelLine} strokeWidth="1.5" />
    {bar > 0 && <rect x={x + 22} y={232} width={r1((w - 44) * bar)} height={14} rx="7" fill={force} opacity=".85" />}
    <Lines x={cx} y={290} anchor="middle" lines={[label]} size={15} colour={bar > 0 ? force : muted} />
  </g>
}
function AngleView() {
  return <PhysicsDiagram title="Three views from above of the wire between the poles. At 90° to the field lines the force is full. At 45° there is some force. Parallel to the field lines there is no force.">
    <Lines x={270} y={22} anchor="middle" lines={['seen from above']} size={14} weight={650} colour={muted} />
    <TopPanel x={12} angle={90} label="full force" bar={1} />
    <TopPanel x={188} angle={45} label="some force" bar={0.6} />
    <TopPanel x={364} angle={0} label="no force" bar={0} />
  </PhysicsDiagram>
}

/* ---------- Fleming's left hand ---------- */

/**
 * A left hand, palm towards you, wrist on the left: thumb up (motion), first finger to the right (field) and second
 * finger pointing towards you, which this perspective draws down and to the right (current). Ring and little fingers
 * are curled into the palm. `arrows` lays a coloured arrow along each of the three.
 */
function LeftHand({ x, y, s = 1, arrows = true }: { x: number; y: number; s?: number; arrows?: boolean }) {
  const deg = r1(Math.atan2(KY, KX) * 180 / Math.PI)
  const ux = Math.cos(deg * Math.PI / 180), uy = Math.sin(deg * Math.PI / 180)
  const k: Pt = [6, 18] // knuckle of the second finger
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* sleeve and wrist */}
    <path d="M-160 -18Q-124 -28 -84 -24L-80 40Q-120 46 -160 36Z" fill={shirt} stroke={shirtLine} strokeWidth="2.4" />
    <path d="M-86 -24Q-92 10 -82 40" stroke={shirtLine} strokeWidth="2.4" fill="none" />
    {/* first finger, straight out to the right */}
    <path d="M0 -36Q40 -42 84 -36Q98 -34 98 -24Q98 -13 84 -13Q40 -11 2 -13Z" fill={skin} stroke={skinLine} strokeWidth="2.2" />
    <path d="M60 -36Q63 -24 60 -13" stroke={skinLine} strokeWidth="1.3" fill="none" opacity=".7" />
    {/* palm */}
    <path d="M-84 -22Q-74 -42 -40 -42Q-6 -44 10 -32Q24 -14 20 14Q16 40 -14 46Q-50 50 -80 38Q-90 10 -84 -22Z" fill={skin} stroke={skinLine} strokeWidth="2.2" />
    <path d="M-62 -4Q-40 4 -16 -2" stroke={skinLine} strokeWidth="1.3" fill="none" opacity=".6" />
    {/* thumb, up */}
    <path d="M-58 -38Q-64 -78 -52 -110Q-44 -124 -32 -118Q-22 -112 -26 -96Q-32 -68 -28 -40Z" fill={skin} stroke={skinLine} strokeWidth="2.2" />
    <path d="M-50 -98Q-42 -102 -34 -98" stroke={skinLine} strokeWidth="1.3" fill="none" opacity=".7" />
    {/* ring and little fingers curled into the palm */}
    <path d="M-34 26Q-20 20 -14 32Q-12 46 -28 46Q-40 44 -40 34Z" fill="#efc3a2" stroke={skinLine} strokeWidth="2" />
    <path d="M-58 22Q-44 18 -40 30Q-38 42 -54 42Q-64 40 -64 30Z" fill="#efc3a2" stroke={skinLine} strokeWidth="2" />
    {/* second finger, towards you: down and to the right */}
    <g transform={`translate(${k[0]} ${k[1]}) rotate(${deg})`}>
      <path d="M-14 -12H44Q60 -12 60 0Q60 12 44 12H-14Z" fill={skin} stroke={skinLine} strokeWidth="2.2" />
      <path d="M28 -12Q31 0 28 12" stroke={skinLine} strokeWidth="1.3" fill="none" opacity=".7" />
    </g>
    {arrows && <g>
      <Arrow from={[-40, -72]} to={[-40, -160]} colour={force} width={4.4} />
      <Arrow from={[40, -24]} to={[150, -24]} colour={M.field} width={4.4} />
      <Arrow from={[r1(k[0] + ux * 20), r1(k[1] + uy * 20)]} to={[r1(k[0] + ux * 118), r1(k[1] + uy * 118)]} colour={P.current} width={4.4} />
    </g>}
  </g>
}

type FlemStage = 'three' | 'use' | 'all'
const FLEM_TITLES: Record<FlemStage, string> = {
  three: 'The wire between the poles, faded, and beside it three arrows from one point, each at right angles to the other two: field to the right, current towards you, force up.',
  use: 'The wire between the poles with a left hand beside it, lined up with it: first finger along the field from N to S, second finger along the current towards you, thumb up along the force.',
  all: 'The left hand beside the wire, and the key: first finger, field; second finger, current; thumb, motion. Reversing the current or the field reverses the force.',
}
const FV: View = { o: [186, 180], s: 0.72 }
function FlemScene({ stage }: { stage: FlemStage }) {
  const mid = at(FV, 0, WIRE_Y, 0)
  const dim = stage === 'three'
  return <PhysicsDiagram title={FLEM_TITLES[stage]}>
    <WireScene v={FV} force="up" dimMagnets={dim} dimField={dim} dimWire={dim} depths={[12, 55, 98]} />
    <Lines x={mid[0] + 8} y={mid[1] - 64} lines={['force']} size={14} colour={force} />
    {stage === 'three' && <g>
      <g transform="translate(424 150)">
        <Arrow from={[0, 0]} to={[92, 0]} colour={M.field} width={4.4} />
        <Arrow from={[0, 0]} to={[0, -96]} colour={force} width={4.4} />
        <Arrow from={[0, 0]} to={[46, 63]} colour={P.current} width={4.4} />
        <circle r="5" fill={ink} />
      </g>
      <Lines x={482} y={140} lines={['field']} size={15} colour={M.field} />
      <Lines x={434} y={62} lines={['force']} size={15} colour={force} />
      <Lines x={420} y={240} lines={['current']} size={15} colour={P.current} />
      <Chip x={430} y={272} w={200} lines={['each at 90° to the others']} tone="hot" size={13} />
    </g>}
    {(stage === 'use' || stage === 'all') && <LeftHand x={426} y={186} s={0.6} />}
    {stage === 'use' && <Lines x={318} y={24} lines={['1 first finger: N to S', '2 second finger: current', '3 thumb: the force']} size={13} />}
    {stage === 'all' && <g>
      <Chip x={92} y={46} w={160} lines={['First: Field', 'seCond: Current', 'thuMb: Motion']} tone="plain" size={13} />
      <Chip x={150} y={270} w={200} lines={['flip current or field:', 'the force flips']} tone="hot" size={13} />
    </g>}
  </PhysicsDiagram>
}
function HandView() {
  return <PhysicsDiagram title="A left hand with the thumb, first finger and second finger at right angles. First finger: field. Second finger: current. Thumb: motion, the direction of the force.">
    <LeftHand x={250} y={176} s={1} />
    <Chip x={104} y={56} w={172} lines={['thuMb: Motion', '(the force)']} tone="force" />
    <Chip x={466} y={110} w={136} lines={['First finger:', 'Field']} tone="field" />
    <Chip x={448} y={262} w={164} lines={['seCond finger:', 'Current']} tone="current" />
    <Lines x={30} y={270} lines={['left hand']} size={16} />
  </PhysicsDiagram>
}
function FlemReverse() {
  const L: View = { o: [152, 172], s: 0.6 }, R: View = { o: [418, 172], s: 0.6 }
  return <PhysicsDiagram title="Two copies of the set-up. Left: the current now flows away from you, and the force on the wire points down. Right: the poles are swapped, so the field goes from right to left, and the force on the wire points down.">
    <rect x={8} y={8} width={258} height={284} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <rect x={274} y={8} width={258} height={284} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <WireScene v={L} current="away" force="down" depths={[12, 55, 98]} />
    <WireScene v={R} poles="SN" current="toward" force="down" depths={[12, 55, 98]} />
    <Lines x={137} y={36} anchor="middle" lines={['reverse the current']} size={15} colour={P.current} />
    <Lines x={403} y={36} anchor="middle" lines={['swap the poles']} size={15} colour={M.field} />
    <Lines x={137} y={278} anchor="middle" lines={['force reversed']} size={14} colour={force} />
    <Lines x={403} y={278} anchor="middle" lines={['force reversed']} size={14} colour={force} />
  </PhysicsDiagram>
}

/* ---------- Section: how big is the force? ---------- */

type SizeStage = 'flux' | 'current' | 'equation' | 'all' | 'workedForce' | 'workedFlux'
const SIZE_TITLES: Record<SizeStage, string> = {
  flux: 'The two poles with the field lines between them. A dashed square marks a region of the field: the number of field lines in a region is the magnetic flux density, B. Beside it, a region with few lines (weaker) and one with many lines (stronger).',
  current: 'The wire across the gap with the current, I, flowing along it. The length of wire inside the field, l, between the front and back of the poles, is shaded.',
  equation: 'The set-up beside the equation F = B I l: force in newtons, magnetic flux density in tesla, current in amps, length in metres.',
  all: 'The set-up beside the equation F = B I l and its two rearrangements: B = F ÷ (I × l) and I = F ÷ (B × l). Lengths must be in metres.',
  workedForce: 'The wire between the poles with its values marked: magnetic flux density 0.25 T, current 3.0 A, length in the field 0.40 m. The force is to be found.',
  workedFlux: 'The wire between the poles with its values marked: current 2.5 A, length in the field 50 cm, force 0.25 N. The magnetic flux density is to be found.',
}
const SV: View = { o: [196, 180], s: 0.78 }
function SizeScene({ stage }: { stage: SizeStage }) {
  const flux = stage === 'flux'
  const worked = stage === 'workedForce' || stage === 'workedFlux'
  const showForce = worked || stage === 'equation' || stage === 'all'
  const mid = at(SV, 0, WIRE_Y, 0)
  const lenPt = at(SV, 0, 92, 0)
  const curTip = at(SV, -16, -84, -16)
  const fieldPt = at(SV, 40, 98, 0)
  const fLabel = stage === 'workedForce' ? 'F = ?' : stage === 'workedFlux' ? 'F = 0.25 N' : 'force'
  const iLabel = stage === 'workedForce' ? 'I = 3.0 A' : stage === 'workedFlux' ? 'I = 2.5 A' : 'current'
  const lLabel = stage === 'workedForce' ? 'l = 0.40 m' : stage === 'workedFlux' ? 'l = 50 cm' : 'length in the field'
  const bLabel = stage === 'workedForce' ? 'B = 0.25 T' : stage === 'workedFlux' ? 'B = ?' : 'field'
  const sym = (s: string): [string, string] => s.includes('=') ? [s.split(' = ')[0], ' = ' + s.split(' = ')[1]] : ['', s]
  const label = (x: number, y: number, s: string, symbol: string, colour: string, anchor: 'start' | 'end' = 'start') => {
    const [a, b] = sym(s)
    return <Sym x={x} y={y} colour={colour} anchor={anchor} size={15}>{a ? <>{it(a, colour)}{b}</> : <>{b}, {it(symbol, colour)}</>}</Sym>
  }
  return <PhysicsDiagram title={SIZE_TITLES[stage]}>
    <WireScene v={SV} wire={!flux} region={flux} force={showForce ? 'up' : null} depths={flux ? [8, 22, 36, 50, 64, 78, 92, 106] : [12, 55, 98]}
      dimMagnets={!flux} length={stage === 'current' || worked} dimField={stage === 'current'} />
    {flux && <g>
      <Leader from={[96, 56]} to={at(SV, -36, 88, 0)} colour={amber} />
      <Lines x={20} y={40} lines={['a region of the field']} size={14} colour={amberInk} />
      <g transform="translate(346 34)">
        {[0, 1].map(k => {
          const x = k * 98, n = k ? 6 : 3
          return <g key={k}>
            <rect x={x} y={0} width={80} height={80} rx="10" fill="white" stroke={amber} strokeWidth="2" strokeDasharray="6 5" />
            {Array.from({ length: n }, (_, i) => <path key={i} d={`M${x + 6} ${r1(80 * (i + 0.5) / n)}H${x + 74}`} stroke={M.field} strokeWidth="2" />)}
            <Lines x={x + 40} y={102} anchor="middle" lines={[k ? 'stronger' : 'weaker']} size={14} colour={k ? amberInk : muted} />
          </g>
        })}
      </g>
      <Chip x={430} y={196} w={196} lines={['magnetic flux density', 'unit: tesla, T']} tone="hot" size={14} />
      <Sym x={430} y={250} anchor="middle" size={18} colour={M.field}>symbol: {it('B', M.field)}</Sym>
    </g>}
    {!flux && <g>
      <Leader from={[256, 270]} to={[curTip[0] + 2, curTip[1] + 4]} colour={P.current} />
      {label(262, 276, iLabel, 'I', P.current)}
      {showForce && label(mid[0] + 12, mid[1] - 60, fLabel, 'F', force)}
      <Leader from={[324, 64]} to={fieldPt} colour={M.field} />
      {label(318, 56, bLabel, 'B', M.field)}
    </g>}
    {(stage === 'current' || worked) && <g>
      <Leader from={[86, 74]} to={lenPt} colour={amber} />
      {label(20, 62, lLabel, 'l', amberInk)}
    </g>}
    {stage === 'current' && <Chip x={436} y={196} w={180} lines={['more current or', 'more length', '→ bigger force']} tone="hot" size={14} />}
    {(stage === 'equation' || stage === 'all' || worked) && <g>
      <rect x={350} y={86} width={176} height={58} rx="14" fill={amberSoft} stroke={amber} strokeWidth="2" />
      <Sym x={438} y={125} anchor="middle" size={30}>{it('F', force)} = {it('B', M.field)} {it('I', P.current)} {it('l', amberInk)}</Sym>
    </g>}
    {stage === 'equation' && <g>
      {([['F', 'force (N)', force], ['B', 'flux density (T)', M.field], ['I', 'current (A)', P.current], ['l', 'length (m)', amberInk]] as const).map(([s, t, c], i) =>
        <Sym key={s} x={360} y={176 + i * 24} size={15} colour={ink}>{it(s, c)}   {t}</Sym>)}
      <Lines x={438} y={282} anchor="middle" lines={['wire at 90° to the field']} size={13} weight={650} colour={muted} />
    </g>}
    {stage === 'all' && <g>
      <rect x={350} y={158} width={176} height={70} rx="12" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
      <Sym x={438} y={186} anchor="middle" size={17}>{it('B', M.field)} = {it('F', force)} ÷ ({it('I', P.current)} × {it('l', amberInk)})</Sym>
      <Sym x={438} y={214} anchor="middle" size={17}>{it('I', P.current)} = {it('F', force)} ÷ ({it('B', M.field)} × {it('l', amberInk)})</Sym>
      <Chip x={438} y={262} w={176} lines={['lengths in metres:', '50 cm = 0.50 m']} tone="hot" size={13} />
    </g>}
    {worked && <Lines x={438} y={172} anchor="middle" lines={['wire at 90°', 'to the field']} size={13} weight={650} colour={muted} />}
  </PhysicsDiagram>
}

/* ---------- Section: the dc motor ---------- */

const CX = 60, CY0 = 4, CY1 = 96
const COM_Y0 = -62, COM_Y1 = -42, COM_R = 13
type MotorOpts = { v: View; current?: boolean; forces?: boolean; rotation?: boolean; poles?: Poles; dimMagnets?: boolean; dimCoil?: boolean; hiCommutator?: boolean }
/**
 * The simple dc motor: a coil on an axle between the poles, a split-ring commutator, two contacts and a cell. The
 * current goes away from you along the left side and towards you along the right side. With N on the left the left
 * side is pushed down and the right side up (anticlockwise as you look into the page); swapping the poles reverses
 * both forces and the turning.
 */
function MotorScene({ v, current = true, forces = false, rotation = false, poles = 'NS', dimMagnets = false, dimCoil = false, hiCommutator = false }: MotorOpts) {
  const [left, right] = poles === 'NS' ? ['N', 'S'] as const : ['S', 'N'] as const
  const sense = poles === 'NS' ? 1 : -1 // 1: left side down, right side up
  const comF = pj(0, COM_Y0, 0), comB = pj(0, COM_Y1, 0)
  // The axle runs up and to the left on the page; n is at right angles to it, for the outline of the commutator.
  const len = Math.hypot(KX, KY), n: Pt = [KY / len, -KX / len]
  const tb = (p: Pt, k: number) => `${r1(p[0] + n[0] * COM_R * k)} ${r1(p[1] + n[1] * COM_R * k)}`
  const brushL: Pt = [comF[0] - COM_R - 8, comF[1]], brushR: Pt = [comF[0] + COM_R + 8, comF[1]]
  const cellY = comF[1] + 78
  const rotC = pj(0, 150, 0)
  return <g transform={`translate(${v.o[0]} ${v.o[1]}) scale(${v.s})`}>
    <g opacity={dimMagnets ? faded : 1}><Block x0={GAP} x1={OUT} pole={right} /></g>
    <g opacity={0.5}><FieldSheet poles={poles} depths={[24, 76]} /></g>
    {/* axle */}
    <path d={seg(pj(0, -70, 0), pj(0, 166, 0))} stroke="#9aa9b5" strokeWidth="4" />
    {rotation && <g>
      <path d={sense > 0 ? `M${rotC[0] + 22} ${rotC[1] + 2}A22 22 0 1 0 ${rotC[0] - 2} ${rotC[1] + 22}` : `M${rotC[0] - 22} ${rotC[1] + 2}A22 22 0 1 1 ${rotC[0] + 2} ${rotC[1] + 22}`} stroke={amber} strokeWidth="3.4" fill="none" />
      <Chevron at={sense > 0 ? [rotC[0] - 6, rotC[1] + 22] : [rotC[0] + 6, rotC[1] + 22]} angle={sense > 0 ? Math.PI : 0} colour={amber} size={13} />
    </g>}
    {/* coil */}
    <g opacity={dimCoil ? faded : 1}>
      <path d={`M${pj(-CX, CY0, 0).join(' ')}L${pj(-CX, CY1, 0).join(' ')}L${pj(CX, CY1, 0).join(' ')}L${pj(CX, CY0, 0).join(' ')}`} stroke={copper} strokeWidth="6.5" fill="none" />
      <path d={seg(pj(-CX, CY0, 0), pj(-7, COM_Y1 + 4, 0))} stroke={copper} strokeWidth="4" fill="none" />
      <path d={seg(pj(CX, CY0, 0), pj(7, COM_Y1 + 4, 0))} stroke={copper} strokeWidth="4" fill="none" />
      {current && <g>
        <LArrow a={[-CX + 15, 28, 0]} b={[-CX + 15, 76, 0]} colour={P.current} width={3.2} />
        <LArrow a={[CX - 15, 76, 0]} b={[CX - 15, 28, 0]} colour={P.current} width={3.2} />
        <LArrow a={[-24, CY1 - 13, 0]} b={[24, CY1 - 13, 0]} colour={P.current} width={3.2} />
      </g>}
    </g>
    {/* split-ring commutator: a short cylinder on the axle, split into two halves */}
    {hiCommutator && <circle cx={r1((comF[0] + comB[0]) / 2)} cy={r1((comF[1] + comB[1]) / 2)} r="34" fill={amberSoft} stroke={amber} strokeWidth="2.4" strokeDasharray="6 5" />}
    <circle cx={comB[0]} cy={comB[1]} r={COM_R} fill={halfA} stroke={halfALine} strokeWidth="1.8" />
    <path d={`M${tb(comB, -1)}L${tb(comF, -1)}L${tb(comF, 1)}L${tb(comB, 1)}Z`} fill={halfA} stroke="none" />
    <path d={`M${tb(comB, -1)}L${tb(comF, -1)}M${tb(comF, 1)}L${tb(comB, 1)}`} stroke={halfALine} strokeWidth="1.8" />
    <path d={`M${comF[0]} ${comF[1] - COM_R}A${COM_R} ${COM_R} 0 0 0 ${comF[0]} ${comF[1] + COM_R}Z`} fill={halfA} stroke={halfALine} strokeWidth="1.8" />
    <path d={`M${comF[0]} ${comF[1] - COM_R}A${COM_R} ${COM_R} 0 0 1 ${comF[0]} ${comF[1] + COM_R}Z`} fill={halfB} stroke={halfBLine} strokeWidth="1.8" />
    <path d={`M${comF[0]} ${comF[1] - COM_R - 2}V${comF[1] + COM_R + 2}`} stroke="white" strokeWidth="3" />
    {/* contacts and leads to the cell */}
    <path d={`M${brushL[0]} ${brushL[1]}V${cellY}H${comF[0] - 6}`} stroke={P.wire} strokeWidth="2.6" fill="none" />
    <path d={`M${brushR[0]} ${brushR[1]}V${cellY}H${comF[0] + 6}`} stroke={P.wire} strokeWidth="2.6" fill="none" />
    <rect x={brushL[0] - 7} y={brushL[1] - 6} width={14} height={12} rx="3" fill="#596b7a" stroke={ink} strokeWidth="1.4" />
    <rect x={brushR[0] - 7} y={brushR[1] - 6} width={14} height={12} rx="3" fill="#596b7a" stroke={ink} strokeWidth="1.4" />
    <Cell x={comF[0]} y={cellY} length={16} signs />
    <g opacity={dimMagnets ? faded : 1}><Block x0={-OUT} x1={-GAP} pole={left} /></g>
    {forces && <g>
      <Arrow from={pj(-CX - 18, 30, -8 * sense)} to={pj(-CX - 18, 30, -88 * sense)} colour={force} width={4.6} />
      <Arrow from={pj(CX + 18, 30, 8 * sense)} to={pj(CX + 18, 30, 88 * sense)} colour={force} width={4.6} />
    </g>}
  </g>
}

/** End view of the commutator, looking along the axle: the two halves, the contacts and the coil, now and half a turn later. */
function EndView({ x, y, flipped }: { x: number; y: number; flipped: boolean }) {
  const R = 20
  const [lf, ll, rf, rl] = flipped ? [halfB, halfBLine, halfA, halfALine] : [halfA, halfALine, halfB, halfBLine]
  return <g>
    <path d={`M${x - 50} ${y}H${x + 50}`} stroke={copper} strokeWidth="5" />
    <circle cx={x - 50} cy={y} r="6" fill={flipped ? halfB : halfA} stroke={flipped ? halfBLine : halfALine} strokeWidth="2" />
    <circle cx={x + 50} cy={y} r="6" fill={flipped ? halfA : halfB} stroke={flipped ? halfALine : halfBLine} strokeWidth="2" />
    <path d={`M${x - 3} ${y - R}A${R} ${R} 0 0 0 ${x - 3} ${y + R}Z`} fill={lf} stroke={ll} strokeWidth="2" />
    <path d={`M${x + 3} ${y - R}A${R} ${R} 0 0 1 ${x + 3} ${y + R}Z`} fill={rf} stroke={rl} strokeWidth="2" />
    <rect x={x - R - 12} y={y - 6} width={10} height={12} rx="3" fill="#596b7a" />
    <rect x={x + R + 2} y={y - 6} width={10} height={12} rx="3" fill="#596b7a" />
    <path d={`M${x - R - 7} ${y + 6}V${y + 30}M${x + R + 7} ${y + 6}V${y + 30}`} stroke="#596b7a" strokeWidth="2.6" />
    <text x={x - R - 7} y={y + 46} textAnchor="middle" fontSize="16" fontWeight="800" fill={P.current}>+</text>
    <text x={x + R + 7} y={y + 46} textAnchor="middle" fontSize="16" fontWeight="800" fill={ink}>−</text>
  </g>
}

type DcStage = 'coil' | 'forces' | 'commutator' | 'reverse' | 'all'
const DC_TITLES: Record<DcStage, string> = {
  coil: 'A simple dc motor in perspective: a rectangular copper coil on an axle between a north pole on the left and a south pole on the right. A cell drives a current through two contacts and a split ring. The current goes away from you along the left side of the coil and towards you along the right side.',
  forces: 'The same motor. A green arrow pushes the left side of the coil down and another pushes the right side up, so the coil turns, shown by a curved arrow round the axle.',
  commutator: 'The same motor with the split ring on the axle ringed. Two small end views show the ring now and half a turn later: the two halves have swapped which contact, plus or minus, they touch.',
  reverse: 'The same motor with its poles swapped: south on the left and north on the right. Now the left side of the coil is pushed up and the right side down, so it turns the other way. Reversing the current would do the same.',
  all: 'The whole motor: opposite forces on the two sides turn the coil, the split-ring commutator keeps it turning one way, and more current, more turns or a stronger field make it faster.',
}
const MV: View = { o: [290, 150], s: 1 }
function DcScene({ stage }: { stage: DcStage }) {
  const wide = stage === 'reverse' || stage === 'all'
  const v: View = stage === 'commutator' ? { o: [236, 150], s: 0.86 } : wide ? { o: [356, 150], s: 0.86 } : MV
  const sideL = at(v, -CX + 15, 52, 0), sideR = at(v, CX - 15, 52, 0)
  const com = at(v, 0, COM_Y0, 0)
  const showF = stage !== 'coil'
  const swapped = stage === 'reverse'
  const dn = at(v, -CX - 18, 30, swapped ? 88 : -88), up = at(v, CX + 18, 30, swapped ? -88 : 88)
  return <PhysicsDiagram title={DC_TITLES[stage]}>
    <MotorScene v={v} forces={showF} rotation={showF} poles={swapped ? 'SN' : 'NS'} dimMagnets={stage !== 'coil' && !swapped} hiCommutator={stage === 'commutator'} dimCoil={stage === 'commutator'} />
    {stage === 'coil' && <g>
      <Leader from={[180, 38]} to={[sideL[0] - 2, sideL[1] - 4]} colour={P.current} />
      <Lines x={14} y={30} lines={['current: away from you']} size={13} colour={P.current} />
      <Leader from={[420, 252]} to={[sideR[0] + 4, sideR[1] + 2]} colour={P.current} />
      <Lines x={424} y={262} lines={['current:', 'towards you']} size={13} colour={P.current} />
      <Leader from={[236, 280]} to={[com[0] - 12, com[1] + 78]} />
      <Lines x={160} y={285} lines={['dc supply']} size={13} />
      <Lines x={318} y={24} lines={['coil on an axle']} size={14} colour={copper} />
      <Leader from={[350, 32]} to={at(v, 24, CY1, 0)} colour={copper} />
    </g>}
    {stage === 'forces' && <g>
      <Lines x={dn[0] - 64} y={dn[1] - 20} lines={['pushed', 'down']} size={14} colour={force} />
      <Lines x={up[0] + 10} y={up[1] + 14} lines={['pushed up']} size={14} colour={force} />
      <Chip x={444} y={270} w={170} lines={['the coil rotates']} tone="hot" />
    </g>}
    {stage === 'commutator' && <g>
      <Leader from={[150, 268]} to={at(v, -24, COM_Y0 + 10, -24)} colour={amber} />
      <Lines x={14} y={284} lines={['split-ring commutator']} size={13} colour={amberInk} />
      <rect x={398} y={10} width={136} height={280} rx="16" fill="white" stroke={P.panelLine} strokeWidth="1.5" />
      <Lines x={466} y={34} anchor="middle" lines={['now']} size={13} weight={650} colour={muted} />
      <EndView x={466} y={74} flipped={false} />
      <Lines x={466} y={160} anchor="middle" lines={['half a turn later']} size={13} weight={650} colour={muted} />
      <EndView x={466} y={200} flipped />
      <Lines x={466} y={278} anchor="middle" lines={['contacts swapped']} size={13} colour={amberInk} />
    </g>}
    {stage === 'reverse' && <g>
      <Lines x={14} y={30} lines={['to turn it the', 'other way:']} size={14} />
      <Chip x={70} y={98} w={118} lines={['reverse', 'the current']} tone="current" size={13} />
      <Lines x={70} y={146} anchor="middle" lines={['or']} size={13} colour={muted} />
      <Chip x={70} y={186} w={118} lines={['swap', 'the poles']} tone="field" size={13} />
      <Lines x={70} y={250} anchor="middle" lines={['here: poles', 'swapped']} size={13} weight={650} colour={muted} />
    </g>}
    {stage === 'all' && <g>
      <Chip x={70} y={88} w={124} lines={['faster:', 'more current', 'more turns', 'stronger field']} tone="hot" size={13} />
      <Lines x={14} y={246} lines={['split ring:', 'keeps it turning', 'one way']} size={13} colour={amberInk} />
      <Leader from={[140, 272]} to={[com[0] - 2, com[1] + 13]} colour={amber} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Questions ---------- */

function LeftHandQuestion({ poles, current }: { poles: Poles; current: 'toward' | 'away' }) {
  const v: View = { o: [262, 172], s: 1 }
  const curMid = at(v, -16, -53, -16)
  return <PhysicsDiagram title={`A wire crosses the gap between two magnetic poles, ${poles === 'NS' ? 'north on the left and south on the right' : 'south on the left and north on the right'}. A current flows along the wire ${current === 'toward' ? 'towards you' : 'away from you'}. Which way is the force?`}>
    <WireScene v={v} poles={poles} current={current} />
    <Leader from={[372, 268]} to={[curMid[0] + 2, curMid[1] + 4]} colour={P.current} />
    <Lines x={378} y={274} lines={['current']} size={14} colour={P.current} />
    <Leader from={[372, 46]} to={at(v, 40, 98, 0)} colour={M.field} />
    <Lines x={360} y={38} lines={['field']} size={14} colour={M.field} />
  </PhysicsDiagram>
}

function PartsQuestion({ assessment }: { assessment: boolean }) {
  const v = MV
  const pts: [number, Pt][] = [
    [1, [at(v, CX, 50, 0)[0] + 22, at(v, CX, 50, 0)[1] - 48]], [2, at(v, -150, 0, 62)], [3, [at(v, 0, COM_Y0, 0)[0], at(v, 0, COM_Y0, 0)[1] + 40]], [4, [at(v, 0, COM_Y0, 0)[0] - 52, at(v, 0, COM_Y0, 0)[1] + 26]],
  ]
  const targets: Pt[] = [at(v, CX, 50, 0), at(v, -150, 0, 62), [at(v, 0, COM_Y0, 0)[0], at(v, 0, COM_Y0, 0)[1] + 13], [at(v, 0, COM_Y0, 0)[0] - COM_R - 12, at(v, 0, COM_Y0, 0)[1] + 4]]
  const names = ['side of the coil', 'magnetic pole', 'split-ring commutator', 'contact']
  return <PhysicsDiagram title={assessment ? 'A simple dc motor with four numbered parts.' : 'A simple dc motor with four numbered parts: 1, a side of the coil; 2, a magnetic pole; 3, the split-ring commutator; 4, a contact.'}>
    <MotorScene v={v} current />
    {pts.map(([n, p], i) => <path key={n} d={seg(p, targets[i])} stroke={ink} strokeWidth="1.6" />)}
    {pts.map(([n, [x, y]]) => <Num key={n} n={n} x={x} y={y} state="active" />)}
    {!assessment && <Lines x={20} y={34} lines={names.map((s, i) => `${i + 1} ${s}`)} size={13} />}
  </PhysicsDiagram>
}

function DataTable() {
  const rows: [string, string][] = [['1.0', '0.05'], ['2.0', '0.10'], ['3.0', '0.15'], ['4.0', '0.20']]
  const x0 = 150, w = 120, top = 54, rh = 40
  return <PhysicsDiagram title="A table of results for one wire at 90° to the same magnetic field. Current 1.0 A, force 0.05 N; 2.0 A, 0.10 N; 3.0 A, 0.15 N; 4.0 A, 0.20 N." schematic={false}>
    <Lines x={270} y={30} anchor="middle" lines={['same wire, same magnets, wire at 90° to the field']} size={13} weight={650} colour={muted} />
    <rect x={x0} y={top} width={w * 2} height={rh * 5} rx="12" fill="white" stroke={P.panelLine} strokeWidth="1.5" />
    <path d={`M${x0 + 12} ${top}H${x0 + w * 2 - 12}Q${x0 + w * 2} ${top} ${x0 + w * 2} ${top + 12}V${top + rh}H${x0}V${top + 12}Q${x0} ${top} ${x0 + 12} ${top}Z`} fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <path d={`M${x0 + w} ${top}V${top + rh * 5}`} stroke={P.panelLine} strokeWidth="1.5" />
    {rows.map((_, i) => <path key={i} d={`M${x0} ${top + rh * (i + 1)}H${x0 + w * 2}`} stroke={P.panelLine} strokeWidth="1.5" />)}
    <Lines x={x0 + w / 2} y={top + 26} anchor="middle" lines={['current (A)']} size={15} colour={P.current} />
    <Lines x={x0 + w * 1.5} y={top + 26} anchor="middle" lines={['force (N)']} size={15} colour={force} />
    {rows.map(([a, f], i) => <g key={a}>
      <Lines x={x0 + w / 2} y={top + rh * (i + 1) + 26} anchor="middle" lines={[a]} size={16} weight={650} />
      <Lines x={x0 + w * 1.5} y={top + rh * (i + 1) + 26} anchor="middle" lines={[f]} size={16} weight={650} />
    </g>)}
  </PhysicsDiagram>
}

export function HigherMotorVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  const views: Record<string, () => ReactNode> = {
    'hmotor-effect-field': () => <EffectScene stage="field" />,
    'hmotor-effect-current': () => <EffectScene stage="current" />,
    'hmotor-effect-force': () => <EffectScene stage="force" />,
    'hmotor-effect-angle': () => <AngleView />,
    'hmotor-effect-all': () => <EffectScene stage="all" />,
    'hmotor-flem-three': () => <FlemScene stage="three" />,
    'hmotor-flem-hand': () => <HandView />,
    'hmotor-flem-use': () => <FlemScene stage="use" />,
    'hmotor-flem-reverse': () => <FlemReverse />,
    'hmotor-flem-all': () => <FlemScene stage="all" />,
    'hmotor-size-flux': () => <SizeScene stage="flux" />,
    'hmotor-size-current': () => <SizeScene stage="current" />,
    'hmotor-size-equation': () => <SizeScene stage="equation" />,
    'hmotor-size-all': () => <SizeScene stage="all" />,
    'hmotor-worked-force': () => <SizeScene stage="workedForce" />,
    'hmotor-worked-flux': () => <SizeScene stage="workedFlux" />,
    'hmotor-dc-coil': () => <DcScene stage="coil" />,
    'hmotor-dc-forces': () => <DcScene stage="forces" />,
    'hmotor-dc-commutator': () => <DcScene stage="commutator" />,
    'hmotor-dc-reverse': () => <DcScene stage="reverse" />,
    'hmotor-dc-all': () => <DcScene stage="all" />,
    'hmotor-question-left-hand': () => <LeftHandQuestion poles="NS" current="away" />,
    'hmotor-question-poles-swapped': () => <LeftHandQuestion poles="SN" current="away" />,
    'hmotor-question-parts': () => <PartsQuestion assessment={assessment} />,
    'hmotor-data-current': () => <DataTable />,
  }
  return <>{views[focus]?.() ?? <PhysicsDiagram title={`A diagram for the motor effect (${focus}).`}><g /></PhysicsDiagram>}</>
}
