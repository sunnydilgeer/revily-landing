import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, EnergyStoreBadge, TransferArrow, GraphAxes, graphScale, type GraphFrame, type Pt } from './PhysicsKit'
import { ink, muted, r1, faded, Caption, Tag, Eq, Arrow, Ball, Spring, Hand, StepStrip, Ring, wood, woodLine, metal, metalLine, type Piece } from './EnergyStoreVisuals'
import { Spaced, UnitBox, HBar } from './KineticVisuals'

/*
 * Physics Lesson 41: Forces and elasticity. Original, code-native schematics; not to scale. Focus ids start with 'elastic-'.
 *
 * Colour code for the Forces lessons: every force arrow is the same brick red (`forceColour`); springs are drawn in the
 * elastic potential magenta; in F = k × e, F is brick red, k violet and e green, and the same colours come back in the
 * worked examples, the graphs and the springs practical. The pieces below (support beam, wall, slotted masses, hanging
 * springs, dimension lines, crosses) are exported so the springs practical draws with exactly the same parts.
 */

export const forceColour = '#c2462e'
export const kColour = P.pd
export const eColour = '#1f8a6a'
const S = P.elasticLine

/* ---------- Shared pieces ---------- */

/** A force arrow in the course force colour, with an optional label beside its middle. */
export function Force({ from, to, label, labelAt, anchor = 'middle', width = 3.6 }: { from: Pt; to: Pt; label?: string; labelAt?: Pt; anchor?: 'start' | 'middle' | 'end'; width?: number }) {
  const at = labelAt ?? [r1((from[0] + to[0]) / 2), r1((from[1] + to[1]) / 2 - 10)]
  return <g>
    <Arrow from={from} to={to} colour={forceColour} width={width} />
    {label && <text x={at[0]} y={at[1]} textAnchor={anchor} fontSize="14" fontWeight="750" fill={forceColour} stroke="white" strokeWidth="4" paintOrder="stroke">{label}</text>}
  </g>
}
/** A wooden support beam; (x1..x2, y) is its underside. */
export function Beam({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return <g>
    <rect x={x1} y={y - 14} width={x2 - x1} height={14} rx="4" fill={wood} stroke={woodLine} strokeWidth="2" />
    {Array.from({ length: Math.floor((x2 - x1) / 18) }, (_, i) => <path key={i} d={`M${x1 + 10 + i * 18} ${y - 14}l8 -8`} stroke={woodLine} strokeWidth="1.4" opacity=".6" />)}
  </g>
}
/** A wall seen side on; (x, y1..y2) is its face. `side` says which way the face looks. */
export function Wall({ x, y1, y2, side = 'right' }: { x: number; y1: number; y2: number; side?: 'left' | 'right' }) {
  const d = side === 'right' ? -1 : 1
  return <g>
    <rect x={side === 'right' ? x - 16 : x} y={y1} width={16} height={y2 - y1} rx="3" fill="#e9edf1" stroke={metalLine} strokeWidth="2" />
    {Array.from({ length: Math.floor((y2 - y1) / 16) }, (_, i) => <path key={i} d={`M${x + d * 16} ${y1 + 12 + i * 16}l${-d * 8} -8`} stroke={metalLine} strokeWidth="1.3" opacity=".55" />)}
  </g>
}
/** A slotted mass hanging from its hook; (x, y) is the top of the hook. Returns its height through `h`. */
export function Weight({ x, y, label, w = 44, h = 28, dim = false }: { x: number; y: number; label?: string; w?: number; h?: number; dim?: boolean }) {
  return <g opacity={dim ? faded : 1}>
    <path d={`M${x} ${y}v8`} stroke={metalLine} strokeWidth="2.4" />
    <rect x={x - w / 2} y={y + 8} width={w} height={h} rx="6" fill={metal} stroke={metalLine} strokeWidth="2" />
    {!label && <path d={`M${x - w / 2 + 5} ${y + 8 + h / 2}H${x + w / 2 - 5}`} stroke={metalLine} strokeWidth="1.2" opacity=".5" />}
    {label && <text x={x} y={y + 8 + h / 2 + 5} textAnchor="middle" fontSize="14" fontWeight="750" fill={forceColour}>{label}</text>}
  </g>
}
/** A spring hanging straight down from (x, top) to (x, bottom), with a small eye at the bottom. */
export function HangSpring({ x, top, bottom, coils = 9, width = 15, colour = S, heavy = false }: { x: number; top: number; bottom: number; coils?: number; width?: number; colour?: string; heavy?: boolean }) {
  return <g>
    <g strokeWidth={heavy ? 2 : 1}><Spring a={[x, top]} b={[x, bottom]} coils={coils} width={width} colour={colour} /></g>
    {heavy && <g opacity=".9"><Spring a={[x + 1.4, top]} b={[x + 1.4, bottom]} coils={coils} width={width} colour={colour} /></g>}
    <circle cx={x} cy={bottom} r="3" fill="white" stroke={colour} strokeWidth="2" />
  </g>
}
/** A dimension line with arrowheads at both ends and small end bars; the label sits beside the middle. */
export function Dim({ from, to, label, colour = eColour, side = 1, size = 14, bars = true }: { from: Pt; to: Pt; label?: string; colour?: string; side?: number; size?: number; bars?: boolean }) {
  const dx = to[0] - from[0], dy = to[1] - from[1], len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, nx = -uy, ny = ux
  const h = Math.min(8, len / 3)
  const head = (p: Pt, s: number) => `M${p[0]} ${p[1]}l${r1(-s * ux * h + nx * h * 0.5)} ${r1(-s * uy * h + ny * h * 0.5)}M${p[0]} ${p[1]}l${r1(-s * ux * h - nx * h * 0.5)} ${r1(-s * uy * h - ny * h * 0.5)}`
  const vertical = Math.abs(dy) > Math.abs(dx)
  const mid: Pt = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2]
  const lp: Pt = vertical ? [mid[0] + side * 10, mid[1] + 5] : [mid[0], mid[1] + (side > 0 ? 20 : -9)]
  return <g>
    <path d={`M${from[0]} ${from[1]}L${to[0]} ${to[1]}${head(to, 1)}${head(from, -1)}`} stroke={colour} strokeWidth="2" fill="none" />
    {bars && <path d={`M${r1(from[0] - nx * 7)} ${r1(from[1] - ny * 7)}l${r1(nx * 14)} ${r1(ny * 14)}M${r1(to[0] - nx * 7)} ${r1(to[1] - ny * 7)}l${r1(nx * 14)} ${r1(ny * 14)}`} stroke={colour} strokeWidth="1.6" />}
    {label && <text x={r1(lp[0])} y={r1(lp[1])} textAnchor={vertical ? (side > 0 ? 'start' : 'end') : 'middle'} fontSize={size} fontWeight="750" fill={colour} stroke="white" strokeWidth="4" paintOrder="stroke">{label}</text>}
  </g>
}
/** A plotted cross, as on a results graph. */
export function Cross({ x, y, colour = ink, s = 6 }: { x: number; y: number; colour?: string; s?: number }) {
  return <path d={`M${x - s} ${y - s}L${x + s} ${y + s}M${x + s} ${y - s}L${x - s} ${y + s}`} stroke={colour} strokeWidth="2.4" />
}
/** A soft rounded panel with a heading. */
export function Panel({ x, y, w, h, title, colour = ink, children }: { x: number; y: number; w: number; h: number; title?: string; colour?: string; children?: ReactNode }) {
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    {title && <text x={x + w / 2} y={y + 26} textAnchor="middle" fontSize="15" fontWeight="750" fill={colour}>{title}</text>}
    {children}
  </g>
}
/** A horizontal spring fixed to a wall at the left, from x1 to x2 at height y. */
function WallSpring({ x1, x2, y, coils = 10, width = 12, dashed = false }: { x1: number; x2: number; y: number; coils?: number; width?: number; dashed?: boolean }) {
  if (dashed) return <g opacity=".5" strokeDasharray="4 5"><Spring a={[x1, y]} b={[x2, y]} coils={coils} width={width} colour={muted} /></g>
  return <g><Spring a={[x1, y]} b={[x2, y]} coils={coils} width={width} /><circle cx={x2} cy={y} r="3" fill="white" stroke={S} strokeWidth="2" /></g>
}

/* ---------- Section 2: changing shape ---------- */

function Sponge({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const holes: Pt[] = [[-0.3, -0.2], [0.1, -0.25], [0.32, 0.05], [-0.15, 0.2], [0.2, 0.28], [-0.36, 0.18], [0, 0.02]]
  return <g>
    <path d={`M${x - w / 2} ${y - h / 2 + 8}Q${x - w / 2} ${y - h / 2} ${x - w / 2 + 8} ${y - h / 2}Q${x} ${y - h / 2 + 7} ${x + w / 2 - 8} ${y - h / 2}Q${x + w / 2} ${y - h / 2} ${x + w / 2} ${y - h / 2 + 8}V${y + h / 2 - 8}Q${x + w / 2} ${y + h / 2} ${x + w / 2 - 8} ${y + h / 2}Q${x} ${y + h / 2 - 7} ${x - w / 2 + 8} ${y + h / 2}Q${x - w / 2} ${y + h / 2} ${x - w / 2} ${y + h / 2 - 8}Z`} fill="#fbe7a1" stroke="#c3930f" strokeWidth="2" />
    {holes.map(([a, b], i) => <ellipse key={i} cx={r1(x + a * w)} cy={r1(y + b * h)} rx={r1(w * 0.04)} ry={r1(h * 0.06)} fill="#e9c75a" opacity=".8" />)}
  </g>
}
function Shape() {
  return <PhysicsDiagram title="Left: one force on a ball makes it move. Right: two forces squash a sponge between them, changing its shape.">
    <Panel x={8} y={10} w={256} h={250} title="one force" />
    <Ball x={170} y={150} r={26} />
    <Force from={[50, 150]} to={[142, 150]} label="push" labelAt={[92, 138]} />
    <Arrow from={[150, 204]} to={[222, 204]} colour={ink} width={2.4} />
    <text x={186} y={228} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>it moves</text>
    <Panel x={276} y={10} w={256} h={250} title="two forces" />
    <Sponge x={404} y={150} w={96} h={70} />
    <Force from={[290, 150]} to={[348, 150]} />
    <Force from={[518, 150]} to={[460, 150]} />
    <text x={404} y={228} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>it changes shape</text>
    <Caption text="Changing shape needs more than one force." y={286} colour={ink} />
  </PhysicsDiagram>
}

function Deform() {
  return <PhysicsDiagram title="Three ways forces deform an object: two forces pulling outwards stretch a spring, two forces pushing inwards compress a spring, and two forces bend a ruler.">
    <Panel x={8} y={10} w={168} h={230} title="stretch" />
    <Spring a={[40, 120]} b={[144, 120]} coils={8} width={11} />
    <Force from={[42, 120]} to={[16, 120]} width={3} />
    <Force from={[142, 120]} to={[168, 120]} width={3} />
    <text x={92} y={176} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>pulled apart</text>
    <Panel x={186} y={10} w={168} h={230} title="compress" />
    <Spring a={[238, 120]} b={[302, 120]} coils={8} width={13} />
    <Force from={[196, 120]} to={[234, 120]} width={3} />
    <Force from={[344, 120]} to={[306, 120]} width={3} />
    <text x={270} y={176} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>squashed</text>
    <Panel x={364} y={10} w={168} h={230} title="bend" />
    <path d="M394 134Q448 76 502 134" stroke="#b27a2c" strokeWidth="11" fill="none" />
    <path d="M394 134Q448 76 502 134" stroke="#f6e3c4" strokeWidth="7" fill="none" />
    <Force from={[392, 168]} to={[398, 140]} width={3} />
    <Force from={[504, 168]} to={[498, 140]} width={3} />
    <Force from={[448, 70]} to={[448, 98]} width={3} />
    <text x={448} y={200} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>bent</text>
    <Tag x={270} y={272} text="a change of shape is called deformation" size={14} />
  </PhysicsDiagram>
}

function ElasticBack() {
  return <PhysicsDiagram title="A spring fixed to a wall is stretched by a pull. When the forces are removed it goes back to its original length. This is elastic deformation.">
    <Wall x={40} y1={50} y2={130} />
    <WallSpring x1={40} x2={330} y={90} coils={11} width={11} />
    <Force from={[334, 90]} to={[404, 90]} label="pull" labelAt={[370, 78]} />
    <Tag x={186} y={40} text="stretched" colour={S} />
    <Arrow from={[186, 126]} to={[186, 170]} colour={ink} width={2.6} />
    <text x={200} y={154} fontSize="13" fontWeight="700" fill={ink}>forces removed</text>
    <Wall x={40} y1={170} y2={250} />
    <WallSpring x1={40} x2={330} y={210} coils={11} width={11} dashed />
    <WallSpring x1={40} x2={200} y={210} coils={11} width={11} />
    <Tag x={120} y={262} text="back to its original length" colour={eColour} />
    <rect x={400} y={176} width={130} height={64} rx="16" fill="#f6d2e5" fillOpacity=".55" stroke={S} strokeWidth="2" />
    <Lines x={465} y={203} anchor="middle" lines={['elastic', 'deformation']} size={15} colour={S} />
  </PhysicsDiagram>
}

function Clip({ x, y, bent = false }: { x: number; y: number; bent?: boolean }) {
  const d = bent
    ? 'M0 0V-46Q0 -58 11 -58Q22 -58 22 -46V-18Q22 -8 14 -8Q6 -8 6 -18V-40M22 -46L56 -76Q64 -82 70 -74Q74 -68 66 -62L40 -40'
    : 'M0 0V-70Q0 -82 11 -82Q22 -82 22 -70V-10Q22 2 33 2Q44 2 44 -10V-58Q44 -66 37 -66Q30 -66 30 -58V-24'
  return <path d={d} transform={`translate(${x} ${y})`} stroke="#7d8e9c" strokeWidth="4" fill="none" />
}
function Plasticine({ x, y, squashed }: { x: number; y: number; squashed: boolean }) {
  return squashed
    ? <path d={`M${x - 46} ${y}Q${x - 50} ${y - 20} ${x - 20} ${y - 22}Q${x} ${y - 25} ${x + 22} ${y - 21}Q${x + 50} ${y - 19} ${x + 45} ${y}Z`} fill="#b7dcc8" stroke="#4f8f6e" strokeWidth="2" />
    : <path d={`M${x - 26} ${y}Q${x - 34} ${y - 36} ${x - 4} ${y - 46}Q${x + 30} ${y - 48} ${x + 28} ${y - 14}Q${x + 26} ${y} ${x} ${y}Z`} fill="#b7dcc8" stroke="#4f8f6e" strokeWidth="2" />
}
function Inelastic() {
  return <PhysicsDiagram title="A lump of plasticine is squashed between two forces. When the forces are removed it stays squashed. A paper clip that has been bent stays bent. This is inelastic deformation.">
    <Panel x={8} y={10} w={320} h={236} title="plasticine" />
    <Plasticine x={84} y={170} squashed />
    <Force from={[84, 80]} to={[84, 140]} width={3} />
    <Force from={[84, 222]} to={[84, 176]} width={3} />
    <Arrow from={[146, 150]} to={[196, 150]} colour={ink} width={2.6} />
    <Lines x={171} y={120} anchor="middle" lines={['forces', 'removed']} size={13} />
    <Plasticine x={260} y={170} squashed />
    <text x={260} y={216} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>stays squashed</text>
    <Panel x={340} y={10} w={192} h={236} title="paper clip" />
    <Clip x={400} y={190} bent />
    <text x={436} y={216} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>stays bent</text>
    <Tag x={270} y={274} text="inelastic deformation: does not go back" size={14} colour={forceColour} />
  </PhysicsDiagram>
}

function Energy() {
  return <PhysicsDiagram title="A hand pulls a spring fixed to a wall. The force does work on the spring, so energy is transferred to the spring's elastic potential store.">
    <Wall x={40} y1={70} y2={150} />
    <WallSpring x1={40} x2={300} y={110} coils={11} width={11} />
    <Hand x={330} y={110} rotate={180} s={1.1} />
    <Force from={[370, 110]} to={[450, 110]} label="pull" labelAt={[410, 98]} />
    <EnergyStoreBadge store="elastic" x={170} y={200} />
    <HBar x={100} y={244} w={150} value={0.8} store="elastic" />
    <TransferArrow from={[344, 86]} to={[250, 180]} bend={0.35} colour={S} width={3.4} />
    <Lines x={300} y={50} lines={['work done stores energy']} size={15} colour={S} />
  </PhysicsDiagram>
}

/* ---------- Section 3: extension, proportion, k ---------- */

function Extension() {
  const top = 50, nat = 150, str = 204
  return <PhysicsDiagram title="Two identical springs hang from a beam. The left one has nothing on it: its length is the natural length. A mass stretches the right one. The extension, e, is the difference between the stretched length and the natural length.">
    <Beam x1={60} x2={400} y={top} />
    <HangSpring x={170} top={top} bottom={nat} />
    <HangSpring x={340} top={top} bottom={str} coils={9} />
    <Weight x={340} y={str} />
    <Dim from={[130, top + 2]} to={[130, nat]} label="natural length" side={-1} colour={muted} size={13} />
    <path d={`M160 ${nat}H392`} stroke={muted} strokeWidth="1.5" strokeDasharray="5 5" />
    <path d={`M346 ${str}H392`} stroke={muted} strokeWidth="1.5" strokeDasharray="5 5" />
    <Dim from={[386, nat]} to={[386, str]} label="extension, e" colour={eColour} />
    <Dim from={[290, top + 2]} to={[290, str]} label="" colour={S} />
    <text x={282} y={132} textAnchor="end" fontSize="13" fontWeight="700" fill={S}>stretched</text>
    <text x={282} y={148} textAnchor="end" fontSize="13" fontWeight="700" fill={S}>length</text>
    <Caption text="extension = stretched length − natural length" y={284} colour={ink} />
  </PhysicsDiagram>
}

function Proportion() {
  const top = 44, nat = 118, px = 9
  const cols: Array<[number, string, number]> = [[160, '0 N', 0], [260, '2 N', 3], [360, '4 N', 6], [460, '6 N', 9]]
  return <PhysicsDiagram title="Four identical springs with forces of 0, 2, 4 and 6 newtons. The extensions are 0, 3, 6 and 9 centimetres: twice the force gives twice the extension.">
    <Beam x1={30} x2={510} y={top} />
    <path d={`M40 ${nat}H510`} stroke={muted} strokeWidth="1.5" strokeDasharray="5 5" />
    <Lines x={36} y={nat - 22} lines={['natural', 'length']} size={12} weight={650} colour={muted} />
    {cols.map(([x, f, e]) => {
      const b = nat + e * px
      return <g key={x}>
        <HangSpring x={x} top={top} bottom={b} coils={8} width={10} />
        {e > 0 ? <Weight x={x} y={b} label={f} w={46} /> : <text x={x} y={nat + 30} textAnchor="middle" fontSize="14" fontWeight="750" fill={muted}>{f}</text>}
        {e > 0 && <Dim from={[x + 34, nat]} to={[x + 34, b]} label={`${e} cm`} size={13} />}
      </g>
    })}
    <Tag x={270} y={278} text="twice the force, twice the extension" size={14} colour={eColour} />
  </PhysicsDiagram>
}

const wordsEq: Piece[] = [['force', forceColour], [' = '], ['spring constant', kColour], [' × '], ['extension', eColour]]
function EqCard() {
  return <PhysicsDiagram schematic={false} title="The equation: force equals spring constant times extension, F = k × e. F is force in newtons, N. k is the spring constant in newtons per metre, N/m. e is the extension in metres, m.">
    <rect x={40} y={10} width={460} height={40} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <Eq x={270} y={37} size={18} pieces={wordsEq} />
    <rect x={150} y={62} width={240} height={56} rx="16" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <Spaced y={101} size={28} items={[['F', forceColour, 200], ['=', ink, 238], ['k', kColour, 274], ['×', ink, 306], ['e', eColour, 340]]} />
    <UnitBox x={95} y={214} to={[200, 108]} name="force" unit="newtons" symbol="N" colour={forceColour} w={150} />
    <UnitBox x={270} y={214} to={[274, 108]} name="spring constant" unit="newtons per metre" symbol="N/m" colour={kColour} w={170} />
    <UnitBox x={445} y={214} to={[340, 108]} name="extension" unit="metres" symbol="m" colour={eColour} w={150} />
  </PhysicsDiagram>
}

function Stiffness() {
  const top = 44, nat = 124
  return <PhysicsDiagram title="Two springs of the same natural length are pulled by the same force. The stiff spring barely stretches: it has a large spring constant. The soft spring stretches a lot: it has a small spring constant.">
    <Beam x1={40} x2={500} y={top} />
    <path d={`M60 ${nat}H480`} stroke={muted} strokeWidth="1.5" strokeDasharray="5 5" />
    <HangSpring x={150} top={top} bottom={nat + 14} coils={8} width={13} heavy />
    <Weight x={150} y={nat + 14} label="5 N" w={50} />
    <Dim from={[196, nat]} to={[196, nat + 14]} bars={false} />
    <text x={206} y={nat + 13} fontSize="13" fontWeight="700" fill={eColour}>small e</text>
    <HangSpring x={370} top={top} bottom={nat + 76} coils={8} width={10} />
    <Weight x={370} y={nat + 76} label="5 N" w={50} />
    <Dim from={[416, nat]} to={[416, nat + 76]} label="large e" size={13} />
    <Tag x={150} y={264} text="stiff spring: large k" colour={kColour} />
    <Tag x={370} y={264} text="soft spring: small k" colour={kColour} />
  </PhysicsDiagram>
}

function Compress() {
  return <PhysicsDiagram title="A spring fixed to a wall is squashed by a push. The compression, e, is the natural length minus the squashed length.">
    <Wall x={50} y1={60} y2={220} />
    <WallSpring x1={50} x2={380} y={96} coils={11} width={11} dashed />
    <text x={390} y={101} fontSize="13" fontWeight="700" fill={muted}>natural length</text>
    <Spring a={[50, 180]} b={[250, 180]} coils={11} width={14} />
    <rect x={250} y={160} width={10} height={40} rx="3" fill={metal} stroke={metalLine} strokeWidth="1.8" />
    <Force from={[340, 180]} to={[266, 180]} label="push" labelAt={[304, 168]} />
    <path d="M380 108V166M255 204V226" stroke={muted} strokeWidth="1.5" strokeDasharray="5 5" />
    <Dim from={[50, 226]} to={[255, 226]} label="squashed length" colour={S} size={13} />
    <Dim from={[255, 136]} to={[380, 136]} label="e" colour={eColour} side={-1} />
    <Tag x={430} y={262} text="compression" colour={eColour} />
  </PhysicsDiagram>
}

/* ---------- Sections 4 and 5: worked examples ---------- */

function PullScene({ force, ext, extColour = eColour, k }: { force: string; ext: string; extColour?: string; k?: string }) {
  return <g>
    <Wall x={30} y1={100} y2={180} />
    <WallSpring x1={30} x2={190} y={140} coils={9} width={11} />
    <Hand x={214} y={140} rotate={180} s={0.9} />
    <path d="M110 150V206M190 150V206" stroke={muted} strokeWidth="1.4" strokeDasharray="4 4" />
    <Dim from={[110, 204]} to={[190, 204]} label={ext} colour={extColour} />
    <path d="M110 128V150" stroke={muted} strokeWidth="1.4" />
    <text x={110} y={120} textAnchor="middle" fontSize="12" fontWeight="650" fill={muted}>natural end</text>
    <Force from={[160, 86]} to={[226, 86]} label={force} labelAt={[193, 74]} />
    {k && <Tag x={120} y={256} text={k} colour={kColour} />}
  </g>
}
function WorkedF({ step }: { step: 1 | 2 | 3 }) {
  const titles = [
    'Step 1 of 3: a spring with spring constant 30 N/m is stretched by 0.2 m. The force is unknown. Write the equation F = k × e.',
    'Step 2 of 3: substitute the numbers. F = 30 × 0.2. The extension is already in metres.',
    'Step 3 of 3: 30 × 0.2 = 6, so the force is 6 N.',
  ]
  return <PhysicsDiagram title={titles[step - 1]}>
    <StepStrip steps={['write it', 'substitute', 'answer']} active={step} colour={forceColour} gap={160} />
    <PullScene force={step === 3 ? 'F = 6 N' : 'F = ?'} ext="e = 0.2 m" k="k = 30 N/m" />
    <rect x={262} y={56} width={266} height={220} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <g opacity={step === 1 ? 1 : 0.55}><Eq x={395} y={100} size={24} pieces={[['F', forceColour], [' = '], ['k', kColour], [' × '], ['e', eColour]]} /></g>
    {step >= 2 && <g opacity={step === 2 ? 1 : 0.55}><Eq x={395} y={150} size={24} pieces={[['F', forceColour], [' = '], ['30', kColour], [' × '], ['0.2', eColour]]} /></g>}
    {step === 2 && <text x={395} y={186} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>0.2 m is already in metres</text>}
    {step === 3 && <g>
      <rect x={315} y={180} width={160} height={50} rx="14" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
      <Spaced y={214} size={24} items={[['F', forceColour, 350], ['= 6', ink, 396], ['N', ink, 442]]} />
      <Ring x={442} y={205} rx={14} ry={15} />
    </g>}
    {step === 1 && <g>
      <text x={395} y={150} textAnchor="middle" fontSize="14" fontWeight="650" fill={ink}>k = 30 N/m</text>
      <text x={395} y={174} textAnchor="middle" fontSize="14" fontWeight="650" fill={ink}>e = 0.2 m</text>
      <text x={395} y={198} textAnchor="middle" fontSize="14" fontWeight="650" fill={forceColour}>F = ?</text>
    </g>}
  </PhysicsDiagram>
}
function WorkedK({ step }: { step: 1 | 2 | 3 }) {
  const titles = [
    'Step 1 of 3: start with F = k × e. Divide both sides by e to get k = F ÷ e.',
    'Step 2 of 3: a force of 10 N stretches a spring by 5 cm. Convert to metres: 5 cm ÷ 100 = 0.05 m.',
    'Step 3 of 3: k = 10 ÷ 0.05 = 200 N/m.',
  ]
  return <PhysicsDiagram title={titles[step - 1]}>
    <StepStrip steps={['rearrange', 'convert', 'divide']} active={step} colour={kColour} gap={160} />
    <PullScene force="10 N" ext="5 cm" k={step === 3 ? 'k = 200 N/m' : 'k = ?'} />
    <rect x={262} y={56} width={266} height={220} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    {step === 1 && <g>
      <Eq x={395} y={100} size={24} pieces={[['F', forceColour], [' = '], ['k', kColour], [' × '], ['e', eColour]]} />
      <Arrow from={[395, 118]} to={[395, 170]} colour={ink} width={2.6} />
      <text x={405} y={150} fontSize="13" fontWeight="700" fill={ink}>÷ e both sides</text>
      <rect x={315} y={180} width={160} height={50} rx="14" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
      <Eq x={395} y={214} size={24} pieces={[['k', kColour], [' = '], ['F', forceColour], [' ÷ '], ['e', eColour]]} />
    </g>}
    {step === 2 && <g>
      <g opacity=".55"><Eq x={395} y={96} size={20} pieces={[['k', kColour], [' = '], ['F', forceColour], [' ÷ '], ['e', eColour]]} /></g>
      <text x={395} y={130} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>e must be in metres</text>
      <rect x={272} y={144} width={246} height={48} rx="14" fill="#e3f3ec" stroke={eColour} strokeWidth="2" />
      <Eq x={395} y={175} size={18} pieces={[['5 cm '], ['÷ 100', eColour], [' = '], ['0.05 m', eColour]]} />
      <text x={395} y={222} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>100 cm in 1 m</text>
    </g>}
    {step === 3 && <g>
      <g opacity=".55"><Eq x={395} y={96} size={20} pieces={[['k', kColour], [' = '], ['F', forceColour], [' ÷ '], ['e', eColour]]} /></g>
      <Eq x={395} y={140} size={22} pieces={[['k', kColour], [' = '], ['10', forceColour], [' ÷ '], ['0.05', eColour]]} />
      <rect x={286} y={170} width={218} height={50} rx="14" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
      <Spaced y={204} size={24} items={[['k', kColour, 316], ['= 200', ink, 378], ['N/m', ink, 460]]} />
      <Ring x={460} y={196} rx={28} ry={15} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 6: the force-extension graph ---------- */

const GF: GraphFrame = { x: 70, y: 44, width: 280, height: 196, xMax: 0.5, yMax: 10 }
const gs = graphScale(GF)
const Axes = ({ ticks = true }: { ticks?: boolean }) => <GraphAxes frame={GF} xLabel="Extension" xUnit="m" yLabel="Force" yUnit="N" xTicks={ticks ? [0.1, 0.2, 0.3, 0.4, 0.5] : []} yTicks={ticks ? [2, 4, 6, 8, 10] : []} origin={ticks} />
const softPts: Pt[] = [[0.1, 2], [0.2, 4], [0.3, 6], [0.4, 8]]
// Straight to P at (0.3, 6), then bending over: extension grows faster than force.
const bendPath = `M${gs.x(0)} ${gs.y(0)}L${gs.x(0.3)} ${gs.y(6)}C${gs.x(0.36)} ${gs.y(7.2)} ${gs.x(0.42)} ${gs.y(7.7)} ${gs.x(0.48)} ${gs.y(7.95)}`
function Graph({ step }: { step: 1 | 2 | 3 }) {
  const titles = [
    'Axes of a force-extension graph: force in newtons up the side, extension in metres along the bottom. Four crosses rise in a straight line; each cross is one measurement.',
    'A straight line through the origin passes through all the crosses: force and extension are directly proportional.',
    'Two straight lines: the softer spring and a steeper dashed line for a stiffer spring with a bigger spring constant.',
  ]
  return <PhysicsDiagram schematic={false} title={titles[step - 1]}>
    <Axes />
    {step >= 2 && <path d={`M${gs.x(0)} ${gs.y(0)}L${gs.x(0.48)} ${gs.y(9.6)}`} stroke={forceColour} strokeWidth="3" />}
    {step === 3 && <path d={`M${gs.x(0)} ${gs.y(0)}L${gs.x(0.25)} ${gs.y(10)}`} stroke={kColour} strokeWidth="3" strokeDasharray="8 6" />}
    {softPts.map(([x, y]) => <Cross key={x} x={gs.x(x)} y={gs.y(y)} />)}
    {step === 1 && <Lines x={372} y={120} lines={['each cross is', 'one measurement']} size={14} />}
    {step === 2 && <Lines x={372} y={120} lines={['straight line', 'through the origin:', 'directly', 'proportional']} size={14} colour={forceColour} />}
    {step === 3 && <g>
      <Lines x={372} y={70} lines={['stiffer spring', '(bigger k)']} size={14} colour={kColour} />
      <Lines x={372} y={150} lines={['softer spring']} size={14} colour={forceColour} />
      <Lines x={372} y={200} lines={['steeper = stiffer']} size={13} weight={650} colour={muted} />
    </g>}
  </PhysicsDiagram>
}
function Limit() {
  const [px, py] = gs.pt(0.3, 6)
  return <PhysicsDiagram schematic={false} title="The force-extension line is straight from the origin up to point P, then curves over. P is the limit of proportionality. On the straight part F = ke works; on the curved part it does not.">
    <Axes ticks={false} />
    <path d={bendPath} stroke={forceColour} strokeWidth="3.2" fill="none" />
    <circle cx={px} cy={py} r="6" fill="white" stroke={ink} strokeWidth="2.4" />
    <text x={px + 10} y={py + 24} fontSize="16" fontWeight="800" fill={ink}>P</text>
    <Lines x={px - 20} y={py - 50} anchor="end" lines={['limit of', 'proportionality']} size={13} />
    <path d={`M${px - 18} ${py - 34}L${px - 6} ${py - 12}`} stroke={ink} strokeWidth="1.4" />
    <Tag x={gs.x(0.15) + 40} y={gs.y(3) + 34} text="F = ke works" colour={eColour} />
    <Lines x={gs.x(0.36)} y={gs.y(7.8) - 26} lines={['F = ke does', 'not work']} size={13} colour={muted} />
    <Lines x={372} y={180} lines={['straight, then', 'bends over']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

/* ---------- Question: which point is past the limit (no numbers, no limit marked) ---------- */

function QuestionGraph() {
  const pts: Array<[string, Pt]> = [['A', [0.08, 1.6]], ['B', [0.17, 3.4]], ['C', [0.26, 5.2]], ['D', [0.42, 7.7]]]
  return <PhysicsDiagram schematic={false} title="A force-extension graph with four labelled points.">
    <Axes ticks={false} />
    <path d={bendPath} stroke={ink} strokeWidth="2.6" fill="none" opacity=".75" />
    {pts.map(([n, [x, y]]) => <g key={n}>
      <Cross x={gs.x(x)} y={gs.y(y)} colour={forceColour} />
      <text x={gs.x(x) - 12} y={gs.y(y) - 10} textAnchor="end" fontSize="16" fontWeight="800" fill={ink}>{n}</text>
    </g>)}
  </PhysicsDiagram>
}

export function ElasticVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'elastic-shape': return <Shape />
    case 'elastic-deform': return <Deform />
    case 'elastic-elastic': return <ElasticBack />
    case 'elastic-inelastic': return <Inelastic />
    case 'elastic-energy': return <Energy />
    case 'elastic-extension': return <Extension />
    case 'elastic-proportion': return <Proportion />
    case 'elastic-eq': return <EqCard />
    case 'elastic-k': return <Stiffness />
    case 'elastic-compress': return <Compress />
    case 'elastic-w1': return <WorkedF step={1} />
    case 'elastic-w2': return <WorkedF step={2} />
    case 'elastic-w3': return <WorkedF step={3} />
    case 'elastic-r1': return <WorkedK step={1} />
    case 'elastic-r2': return <WorkedK step={2} />
    case 'elastic-r3': return <WorkedK step={3} />
    case 'elastic-graph1': return <Graph step={1} />
    case 'elastic-graph2': return <Graph step={2} />
    case 'elastic-graph3': return <Graph step={3} />
    case 'elastic-limit': return <Limit />
    case 'elastic-q-graph': return <QuestionGraph />
    default: return null
  }
}
