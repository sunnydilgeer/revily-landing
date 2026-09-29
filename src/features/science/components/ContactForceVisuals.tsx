import type { ReactNode } from 'react'
import { physicsPalette, PhysicsDiagram, Lines, type Pt } from './PhysicsKit'
import { Chip, r1, faded } from './GasParticleVisuals'
import { Person, Crate, Hand, Book, Ball, ground, groundLine, wood, woodLine, metal, metalLine } from './EnergyStoreVisuals'

/*
 * Physics Lesson 38: Contact and non-contact forces. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'contact-' and is routed from CellBiologyVisuals.tsx.
 *
 * Force arrows (exported for the weight and resultant force lessons): a soft tinted block arrow with a darker
 * outline, one colour per kind of force, length in proportion to the size of the force within each drawing.
 *   push or applied force orange, a force the other way blue, friction brown, weight red, contact (support)
 *   green, tension teal, magnetic grey, electrostatic violet, resultant dark slate.
 */
const P = physicsPalette
const { ink, muted } = P

export const forceTone = {
  push: { line: '#cf6522', fill: '#fcdcc2' },
  back: { line: '#3f7fb8', fill: '#d6e7f6' },
  friction: { line: '#8a6443', fill: '#efe1d0' },
  weight: { line: '#c8463a', fill: '#f8d5d0' },
  contact: { line: '#4f8f5a', fill: '#d8ecd6' },
  tension: { line: '#23847d', fill: '#cdece8' },
  magnetic: { line: '#5a6b79', fill: '#dfe5ea' },
  electrostatic: { line: '#7a4fbd', fill: '#ebe2f7' },
  resultant: { line: '#24384a', fill: '#c3d1dd' },
}
export type ForceTone = keyof typeof forceTone

/**
 * A force arrow from `from` to `to`: a rounded block arrow in the force's colour. `label` sits beside the middle
 * (above a horizontal arrow, to the right of an upright one) unless `labelAt` places it.
 */
export function ForceArrow({ from, to, tone = 'push', width = 10, label, labelAt, labelAnchor = 'middle', labelSize = 15, dim = false }: {
  from: Pt; to: Pt; tone?: ForceTone; width?: number; label?: string; labelAt?: Pt; labelAnchor?: 'start' | 'middle' | 'end'; labelSize?: number; dim?: boolean
}) {
  const { line, fill } = forceTone[tone]
  const dx = to[0] - from[0], dy = to[1] - from[1], len = Math.hypot(dx, dy) || 1
  const ux = dx / len, uy = dy / len, nx = -uy, ny = ux
  const hl = Math.min(width * 1.7, len * 0.6), hw = width * 1.15, w = width / 2
  const neck: Pt = [to[0] - ux * hl, to[1] - uy * hl]
  const pts: Pt[] = [
    [from[0] + nx * w, from[1] + ny * w], [neck[0] + nx * w, neck[1] + ny * w], [neck[0] + nx * hw, neck[1] + ny * hw], to,
    [neck[0] - nx * hw, neck[1] - ny * hw], [neck[0] - nx * w, neck[1] - ny * w], [from[0] - nx * w, from[1] - ny * w],
  ]
  const horizontal = Math.abs(dx) >= Math.abs(dy)
  const mid: Pt = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2]
  const at: Pt = labelAt ?? (horizontal ? [mid[0], mid[1] - width - 8] : [mid[0] + width + 8, mid[1] + 5])
  const anchor = labelAt ? labelAnchor : horizontal ? 'middle' : 'start'
  return <g opacity={dim ? faded : 1}>
    <path d={pts.map((p, i) => `${i ? 'L' : 'M'}${r1(p[0])} ${r1(p[1])}`).join('') + 'Z'} fill={fill} stroke={line} strokeWidth="2.2" strokeLinejoin="round" />
    {label && <text x={r1(at[0])} y={r1(at[1])} textAnchor={anchor} fontSize={labelSize} fontWeight="800" fill={line} stroke="white" strokeWidth="4" paintOrder="stroke">{label}</text>}
  </g>
}

/** A soft ground line with a light fill under it. */
export function Ground({ y, x1 = 20, x2 = 520, fill = ground, line = groundLine }: { y: number; x1?: number; x2?: number; fill?: string; line?: string }) {
  return <g>
    <path d={`M${x1} ${y}Q${(x1 + x2) / 2} ${y - 3} ${x2} ${y}V${y + 14}H${x1}Z`} fill={fill} opacity=".8" />
    <path d={`M${x1} ${y}Q${(x1 + x2) / 2} ${y - 3} ${x2} ${y}`} stroke={line} strokeWidth="2.2" fill="none" />
  </g>
}

/** A box (a plain parcel); (x, y) = middle of its base. */
export function Parcel({ x, y, w = 70, h = 54, label }: { x: number; y: number; w?: number; h?: number; label?: string }) {
  return <g>
    <rect x={x - w / 2} y={y - h} width={w} height={h} rx="7" fill="#f1ddb9" stroke="#a57a45" strokeWidth="2.2" />
    <path d={`M${x - w / 2 + 3} ${y - h + h * 0.34}H${x + w / 2 - 3}`} stroke="#c9a46b" strokeWidth="5" opacity=".6" />
    {label && <text x={x} y={y - h * 0.3} textAnchor="middle" fontSize="15" fontWeight="800" fill="#7a5530">{label}</text>}
  </g>
}

/** A trolley or cart: a tray on four wheels; (x, y) = the ground under its middle. */
export function Trolley({ x, y, w = 110 }: { x: number; y: number; w?: number }) {
  return <g>
    <rect x={x - w / 2} y={y - 44} width={w} height={26} rx="8" fill="#cfe0ee" stroke="#4f7aa3" strokeWidth="2.2" />
    <path d={`M${x - w / 2 + 8} ${y - 36}H${x + w / 2 - 8}`} stroke="white" strokeWidth="3" opacity=".7" />
    {[-w / 2 + 20, w / 2 - 20].map(dx => <g key={dx}><circle cx={x + dx} cy={y - 10} r="10" fill="#4f5d69" stroke="#33404b" strokeWidth="1.6" /><circle cx={x + dx} cy={y - 10} r="3.6" fill={metal} /></g>)}
  </g>
}

/** A skateboard; (x, y) = the ground under its middle. */
function Skateboard({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 34} ${y - 16}Q${x - 38} ${y - 20} ${x - 36} ${y - 22}H${x + 36}Q${x + 38} ${y - 20} ${x + 34} ${y - 16}Z`} fill="#e7a98b" stroke="#a5634a" strokeWidth="2" />
    {[-22, 22].map(dx => <circle key={dx} cx={x + dx} cy={y - 7} r="6" fill="#4f5d69" />)}
  </g>
}

/* ---------- Small scenes (shared by the contact / non-contact frames and the sorting frame) ---------- */

type Mini = { x: number; y: number; s?: number; arrows?: boolean }
/** A bicycle wheel with a brake block pressing on the rim: friction. (x, y) = wheel centre. */
function BrakeScene({ x, y, s = 1, arrows = true }: Mini) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r="40" fill="none" stroke="#4f5d69" strokeWidth="7" />
    <circle r="33" fill="none" stroke={metalLine} strokeWidth="2" />
    {[0, 45, 90, 135].map(a => <path key={a} d={`M${r1(Math.cos(a * Math.PI / 180) * 33)} ${r1(Math.sin(a * Math.PI / 180) * 33)}L${r1(-Math.cos(a * Math.PI / 180) * 33)} ${r1(-Math.sin(a * Math.PI / 180) * 33)}`} stroke={metalLine} strokeWidth="1.2" />)}
    <circle r="5" fill="#4f5d69" />
    <rect x={30} y={-48} width={12} height={20} rx="3" transform="rotate(38 36 -38)" fill={forceTone.friction.fill} stroke={forceTone.friction.line} strokeWidth="2" />
    {arrows && <ForceArrow from={[4, -54]} to={[-30, -54]} tone="friction" width={8} />}
  </g>
}
/** A rope pulling a sledge: tension. (x, y) = ground under the sledge. */
function SledgeScene({ x, y, s = 1, arrows = true }: Mini) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-44 -6H30Q42 -6 42 -18" stroke="#8a6443" strokeWidth="3.4" fill="none" />
    <rect x={-40} y={-24} width={66} height={12} rx="4" fill={wood} stroke={woodLine} strokeWidth="2" />
    <path d="M-30 -12V-6M16 -12V-6" stroke="#8a6443" strokeWidth="3" />
    <path d="M26 -18L70 -34" stroke={forceTone.tension.line} strokeWidth="2.6" strokeDasharray="1 0" />
    {arrows && <ForceArrow from={[36, -44]} to={[72, -57]} tone="tension" width={8} />}
  </g>
}
/** A book resting on a table, with the table's upward push: a contact force. (x, y) = floor under the table. */
function TableScene({ x, y, s = 1, arrows = true }: Mini) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-48} y={-50} width={96} height={9} rx="3" fill={wood} stroke={woodLine} strokeWidth="2" />
    <path d="M-40 -41V0M40 -41V0" stroke={woodLine} strokeWidth="4" />
    <Book x={0} y={-50} />
    {arrows && <ForceArrow from={[0, -66]} to={[0, -100]} tone="contact" width={8} />}
  </g>
}
/** A bar magnet pulling a paper clip across a gap: magnetic force. (x, y) = middle. */
function MagnetScene({ x, y, s = 1, arrows = true }: Mini) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-56} y={-12} width={34} height={24} rx="3" fill="#e9a3a0" stroke="#a8493f" strokeWidth="2" />
    <rect x={-22} y={-12} width={34} height={24} rx="3" fill="#b9cde6" stroke="#46699a" strokeWidth="2" />
    <text x={-39} y={5} textAnchor="middle" fontSize="13" fontWeight="800" fill="#a8493f">N</text>
    <text x={-5} y={5} textAnchor="middle" fontSize="13" fontWeight="800" fill="#46699a">S</text>
    <path d="M40 -8H56Q62 -8 62 -2Q62 4 56 4H44Q40 4 40 0Q40 -4 44 -4H54" stroke={metalLine} strokeWidth="2.4" fill="none" />
    <path d="M18 18H38" stroke={muted} strokeWidth="1.4" />
    <path d="M18 14v8M38 14v8" stroke={muted} strokeWidth="1.4" />
    {arrows && <ForceArrow from={[38, -22]} to={[18, -22]} tone="magnetic" width={8} />}
  </g>
}
/** A ball falling towards the Earth: gravity. (x, y) = ground. */
function FallScene({ x, y, s = 1, arrows = true }: Mini) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-60 0Q0 -14 60 0V10H-60Z" fill="#cfe6c2" stroke={P.plantLine} strokeWidth="2" />
    <Ball x={0} y={-76} r={14} />
    <path d="M-10 -100v-10M0 -102v-12M10 -100v-10" stroke={muted} strokeWidth="1.8" opacity=".6" />
    {arrows && <ForceArrow from={[0, -58]} to={[0, -24]} tone="weight" width={8} />}
  </g>
}
/** A rubbed balloon pulling on hair across a gap: electrostatic force. (x, y) = middle. */
function BalloonScene({ x, y, s = 1, arrows = true }: Mini) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={30} cy={-18} rx="22" ry="27" fill="#f3b3c9" stroke="#b0476f" strokeWidth="2" />
    <path d="M30 9l-4 6h8Z" fill="#b0476f" />
    <path d="M30 15Q24 30 32 44" stroke="#b0476f" strokeWidth="1.4" fill="none" />
    <circle cx={-40} cy={-4} r="20" fill="#f3cfb0" stroke="#b8835e" strokeWidth="2" />
    {[-18, -10, -2, 6].map((dy, i) => <path key={i} d={`M-26 ${dy - 14}Q-12 ${dy - 20} ${-2} ${dy - 22}`} stroke="#6b4a35" strokeWidth="2.2" fill="none" />)}
    {arrows && <ForceArrow from={[-6, -46]} to={[-26, -46]} tone="electrostatic" width={8} />}
  </g>
}

/* ---------- Section 2: vectors and scalars ---------- */

function VectorBox() {
  return <PhysicsDiagram title="A box with a force arrow pushing it to the right. The force has a size, 20 N, and a direction, to the right: it is a vector.">
    <Chip x={270} y={40} text="vector: size and direction" size={16} />
    <Ground y={200} />
    <Parcel x={170} y={198} w={90} h={70} />
    <ForceArrow from={[218, 164]} to={[358, 164]} tone="push" width={14} />
    <Lines x={380} y={150} lines={['size: 20 N']} size={16} colour={forceTone.push.line} />
    <Lines x={380} y={178} lines={['direction: right']} size={16} colour={forceTone.push.line} />
    <Lines x={270} y={258} anchor="middle" lines={['force is a vector']} size={14} weight={650} colour={muted} />
  </PhysicsDiagram>
}
function ScalarCards() {
  const card = (x: number, title: string, sub: string, items: string[], tone: { line: string; fill: string }, icon: ReactNode) => <g>
    <rect x={x} y={20} width={236} height={258} rx="20" fill={tone.fill} fillOpacity=".45" stroke={tone.line} strokeWidth="2" />
    {icon}
    <text x={x + 118} y={100} textAnchor="middle" fontSize="18" fontWeight="800" fill={tone.line}>{title}</text>
    <text x={x + 118} y={122} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{sub}</text>
    {items.map((t, i) => <g key={t}>
      <circle cx={x + 42} cy={152 + i * 26} r="4" fill={tone.line} />
      <text x={x + 56} y={157 + i * 26} fontSize="15" fontWeight="650" fill={ink}>{t}</text>
    </g>)}
  </g>
  const sc = { line: '#5b6f82', fill: '#e3e8ee' }
  return <PhysicsDiagram schematic={false} title="Scalar quantities have size only: mass, time, speed, distance, temperature. Vector quantities have size and direction: force, velocity, acceleration, displacement.">
    {card(22, 'scalar', 'size only', ['mass', 'time', 'speed', 'distance', 'temperature'], sc,
      <g><rect x={108} y={42} width={48} height={28} rx="14" fill="white" stroke={sc.line} strokeWidth="2" /><text x={132} y={61} textAnchor="middle" fontSize="15" fontWeight="800" fill={sc.line}>5</text></g>)}
    {card(282, 'vector', 'size and direction', ['force', 'velocity', 'acceleration', 'displacement'], forceTone.push,
      <ForceArrow from={[364, 56]} to={[436, 56]} tone="push" width={10} />)}
  </PhysicsDiagram>
}
function ArrowRules() {
  return <PhysicsDiagram title="A trolley with a force arrow. The length of the arrow shows the size of the force; the arrow points the way the force acts.">
    <Ground y={220} />
    <Trolley x={150} y={218} />
    <ForceArrow from={[208, 186]} to={[378, 186]} tone="push" width={14} />
    <path d={`M208 222H378`} stroke={muted} strokeWidth="1.6" />
    <path d={`M208 214v16M378 214v16`} stroke={muted} strokeWidth="1.6" />
    <Lines x={293} y={250} anchor="middle" lines={['length = size']} size={15} />
    <path d="M368 172Q420 150 430 118" stroke={ink} strokeWidth="1.4" fill="none" />
    <circle cx={368} cy={172} r="2.8" fill={ink} />
    <Lines x={350} y={80} lines={['arrow points the way', 'the force acts']} size={15} />
  </PhysicsDiagram>
}
function Compare() {
  const k = 14 // px per newton
  return <PhysicsDiagram title="A box with a 10 N arrow to the right and a 5 N arrow to the left. The 10 N arrow is twice as long: twice as big a force.">
    <Ground y={214} />
    <Parcel x={270} y={212} w={96} h={76} />
    <ForceArrow from={[318, 172]} to={[318 + 10 * k, 172]} tone="push" width={13} label="10 N" />
    <ForceArrow from={[222, 172]} to={[222 - 5 * k, 172]} tone="back" width={13} label="5 N" />
    <Chip x={270} y={262} text="twice as long, twice as big" size={15} />
  </PhysicsDiagram>
}

/* ---------- Section 3: contact and non-contact forces ---------- */

function PushPull() {
  return <PhysicsDiagram title="A hand pushing a crate and a hand pulling a crate with a rope. A force is a push or a pull, measured in newtons, N.">
    <Ground y={200} x1={20} x2={250} />
    <Ground y={200} x1={290} x2={520} />
    <Hand x={78} y={170} />
    <Crate x={140} y={198} w={70} h={56} />
    <ForceArrow from={[180, 132]} to={[236, 132]} tone="push" width={11} />
    <Lines x={135} y={60} anchor="middle" lines={['push']} size={18} colour={forceTone.push.line} />
    <Crate x={350} y={198} w={70} h={56} />
    <path d="M385 172H442" stroke="#8a6443" strokeWidth="3.4" />
    <Hand x={466} y={172} rotate={180} />
    <ForceArrow from={[394, 132]} to={[450, 132]} tone="tension" width={11} />
    <Lines x={405} y={60} anchor="middle" lines={['pull']} size={18} colour={forceTone.tension.line} />
    <Chip x={270} y={262} text="force: measured in newtons (N)" size={15} />
  </PhysicsDiagram>
}
function Panel({ x, w = 164, y = 56, h = 196, children, label, sub }: { x: number; w?: number; y?: number; h?: number; children: ReactNode; label: string; sub?: string }) {
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    {children}
    <text x={x + w / 2} y={y + h - 28} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>{label}</text>
    {sub && <text x={x + w / 2} y={y + h - 10} textAnchor="middle" fontSize="12" fontWeight="650" fill={muted}>{sub}</text>}
  </g>
}
function Touch() {
  return <PhysicsDiagram title="Contact forces act when objects touch: friction between a brake block and a wheel, tension in a rope pulling a sledge, and the upward push of a table on a book.">
    <Chip x={270} y={30} text="contact forces: objects touch" size={15} line={forceTone.contact.line} colour={forceTone.contact.line} fill={forceTone.contact.fill} />
    <Panel x={12} label="friction" sub="brake on a wheel"><BrakeScene x={94} y={142} s={1.25} /></Panel>
    <Panel x={188} label="tension" sub="rope pulls a sledge"><SledgeScene x={262} y={186} s={1.25} /></Panel>
    <Panel x={364} label="contact force" sub="table pushes the book"><TableScene x={446} y={202} s={1.25} /></Panel>
  </PhysicsDiagram>
}
function NonTouch() {
  return <PhysicsDiagram title="Non-contact forces act across a gap: a magnet pulling a paper clip, gravity pulling a ball towards the Earth, and a charged balloon pulling on hair.">
    <Chip x={270} y={30} text="non-contact forces: a gap between objects" size={15} line={forceTone.electrostatic.line} colour={forceTone.electrostatic.line} fill={forceTone.electrostatic.fill} />
    <Panel x={12} label="magnetic" sub="magnet and paper clip"><MagnetScene x={90} y={140} s={1.25} /></Panel>
    <Panel x={188} label="gravitational" sub="ball pulled to Earth"><FallScene x={270} y={190} s={1.15} /></Panel>
    <Panel x={364} label="electrostatic" sub="charged balloon, hair"><BalloonScene x={448} y={146} s={1.25} /></Panel>
  </PhysicsDiagram>
}
function Sort() {
  return <PhysicsDiagram viewBox="0 0 540 320" title="Forces sorted into two columns. Touch needed: friction, tension, the push of a table. No touch needed: magnetic, gravitational, electrostatic.">
    <rect x={12} y={16} width={252} height={292} rx="20" fill={forceTone.contact.fill} fillOpacity=".4" stroke={forceTone.contact.line} strokeWidth="2" />
    <rect x={276} y={16} width={252} height={292} rx="20" fill={forceTone.electrostatic.fill} fillOpacity=".4" stroke={forceTone.electrostatic.line} strokeWidth="2" />
    <text x={138} y={44} textAnchor="middle" fontSize="17" fontWeight="800" fill={forceTone.contact.line}>touch needed</text>
    <text x={402} y={44} textAnchor="middle" fontSize="17" fontWeight="800" fill={forceTone.electrostatic.line}>no touch needed</text>
    <BrakeScene x={78} y={112} s={0.85} />
    <text x={78} y={172} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>friction</text>
    <SledgeScene x={190} y={148} s={0.85} />
    <text x={196} y={172} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>tension</text>
    <TableScene x={138} y={274} s={0.85} />
    <text x={138} y={294} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>table pushes book</text>
    <MagnetScene x={340} y={116} s={0.85} />
    <text x={340} y={172} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>magnetic</text>
    <FallScene x={464} y={150} s={0.8} />
    <text x={466} y={172} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>gravitational</text>
    <BalloonScene x={404} y={238} s={0.9} />
    <text x={404} y={294} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>electrostatic</text>
  </PhysicsDiagram>
}

/* ---------- Section 4: interaction pairs ---------- */

function Skaters() {
  return <PhysicsDiagram title="Two people on skateboards push each other's hands. A force acts on each person: one to the left and one to the right, the same size.">
    <Ground y={236} />
    <Skateboard x={230} y={236} />
    <Person x={230} y={214} arms={[[[16, -58], [36, -60]], [[14, -54], [36, -54]]]} lean={4} />
    <Skateboard x={302} y={236} />
    <Person x={302} y={214} arms={[[[16, -58], [36, -60]], [[14, -54], [36, -54]]]} lean={4} flip top="#f3c7a4" topLine="#b8703f" />
    <ForceArrow from={[196, 128]} to={[120, 128]} tone="back" width={12} label="force on A" labelAt={[158, 108]} />
    <ForceArrow from={[336, 128]} to={[412, 128]} tone="push" width={12} label="force on B" labelAt={[374, 108]} />
    <text x={230} y={268} textAnchor="middle" fontSize="15" fontWeight="800" fill={ink}>A</text>
    <text x={302} y={268} textAnchor="middle" fontSize="15" fontWeight="800" fill={ink}>B</text>
    <Chip x={270} y={40} text="a force on each" size={16} />
  </PhysicsDiagram>
}
function Pair() {
  return <PhysicsDiagram title="A book on a table. The book pushes down on the table and the table pushes up on the book. The two forces are equal in size and opposite in direction: an interaction pair.">
    <rect x={120} y={170} width={200} height={14} rx="4" fill={wood} stroke={woodLine} strokeWidth="2" />
    <path d="M138 184V262M302 184V262" stroke={woodLine} strokeWidth="6" />
    <path d="M60 262H380" stroke={groundLine} strokeWidth="2.2" />
    <g transform="translate(220 170) scale(2 2)"><Book x={0} y={0} /></g>
    <ForceArrow from={[244, 172]} to={[244, 232]} tone="weight" width={12} />
    <ForceArrow from={[196, 170]} to={[196, 110]} tone="contact" width={12} />
    <Lines x={182} y={96} anchor="end" lines={['table pushes', 'up on book']} size={14} colour={forceTone.contact.line} />
    <Lines x={316} y={222} lines={['book pushes', 'down on table']} size={14} colour={forceTone.weight.line} />
    <Lines x={384} y={88} lines={['equal size,', 'opposite', 'directions']} size={16} />
    <Chip x={446} y={176} text="interaction pair" size={14} />
  </PhysicsDiagram>
}
function EarthMoon() {
  return <PhysicsDiagram title="The Earth and the Moon attract each other with gravitational forces. The force on the Moon and the force on the Earth are the same size and opposite in direction.">
    <circle cx={120} cy={150} r="78" fill="#bfe0f1" stroke="#3f93bd" strokeWidth="2.4" />
    <path d="M70 110Q92 92 118 104Q132 124 110 138Q84 146 74 132Z M132 170Q160 158 178 178Q170 204 144 206Q126 194 132 170Z M70 176Q84 172 90 186Q80 196 70 190Z" fill="#cfe6c2" stroke="#4f8f5a" strokeWidth="1.6" />
    <circle cx={444} cy={150} r="30" fill="#e3e3dc" stroke="#8a8a7e" strokeWidth="2.2" />
    <circle cx={436} cy={140} r="6" fill="#cfcfc6" /><circle cx={452} cy={160} r="4.5" fill="#cfcfc6" /><circle cx={448} cy={134} r="3" fill="#cfcfc6" />
    <ForceArrow from={[206, 150]} to={[296, 150]} tone="weight" width={12} label="pull on Earth" labelAt={[262, 186]} />
    <ForceArrow from={[406, 150]} to={[316, 150]} tone="weight" width={12} label="pull on Moon" labelAt={[361, 126]} />
    <text x={120} y={254} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>Earth</text>
    <text x={444} y={206} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>Moon</text>
    <Chip x={300} y={272} text="same size, opposite directions" size={15} />
  </PhysicsDiagram>
}

/* ---------- Question: two unlabelled arrows ---------- */

function QArrows() {
  const cm = 40
  return <PhysicsDiagram title="A box with two force arrows in opposite directions.">
    <Ground y={206} />
    <Parcel x={250} y={204} w={96} h={76} />
    <ForceArrow from={[298, 166]} to={[298 + 3 * cm, 166]} tone="push" width={12} label="X" />
    <ForceArrow from={[202, 166]} to={[202 - 1 * cm, 166]} tone="back" width={12} label="Y" />
  </PhysicsDiagram>
}

export function ContactForceVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'contact-vector': return <VectorBox />
    case 'contact-scalar': return <ScalarCards />
    case 'contact-arrow': return <ArrowRules />
    case 'contact-compare': return <Compare />
    case 'contact-force': return <PushPull />
    case 'contact-touch': return <Touch />
    case 'contact-nontouch': return <NonTouch />
    case 'contact-sort': return <Sort />
    case 'contact-interact': return <Skaters />
    case 'contact-pair': return <Pair />
    case 'contact-earthmoon': return <EarthMoon />
    case 'contact-q-arrows': return <QArrows />
    default: return null
  }
}
