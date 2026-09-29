import type { ReactNode } from 'react'
import { physicsPalette, PhysicsDiagram, Lines, EnergyStoreBadge } from './PhysicsKit'
import { Chip, Arrow } from './GasParticleVisuals'
import { WorkCard, type CardLine } from './DensityVisuals'
import { Person, Hand, Car, Tick, shirt, shirtLine } from './EnergyStoreVisuals'
import { UnitBox } from './KineticVisuals'
import { ForceArrow, Ground, Parcel, Trolley, forceTone } from './ContactForceVisuals'

/*
 * Physics Lesson 40: Resultant forces and work done. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'resultant-' and is routed from CellBiologyVisuals.tsx.
 *
 * Force arrows come from the contact forces lesson (push orange, the other way blue, friction brown); the resultant
 * is the dark slate arrow, drawn below the object. Within one drawing, arrow length is proportional to force.
 * Work done: energy amber (J), force orange (N), distance green (m). Energy stores keep the PhysicsKit badges.
 */
const P = physicsPalette
const { ink, muted } = P
const jColour = '#b27c16', nColour = forceTone.push.line, sColour = '#1f8a6a'
const J = ({ children }: { children: ReactNode }) => <tspan fill={jColour}>{children}</tspan>
const F = ({ children }: { children: ReactNode }) => <tspan fill={nColour}>{children}</tspan>
const S = ({ children }: { children: ReactNode }) => <tspan fill={sColour}>{children}</tspan>

/** A distance marker: a thin double-headed line with end stops and a label under it. */
function Distance({ x1, x2, y, label, colour = sColour }: { x1: number; x2: number; y: number; label: string; colour?: string }) {
  return <g>
    <Arrow from={[(x1 + x2) / 2, y]} to={[x2, y]} colour={colour} width={2.2} />
    <Arrow from={[(x1 + x2) / 2, y]} to={[x1, y]} colour={colour} width={2.2} />
    <path d={`M${x1} ${y - 9}v18M${x2} ${y - 9}v18`} stroke={colour} strokeWidth="2" />
    <text x={(x1 + x2) / 2} y={y + 22} textAnchor="middle" fontSize="14" fontWeight="800" fill={colour}>{label}</text>
  </g>
}

/* ---------- Section 2: resultant force ---------- */

function Idea() {
  const k = 4
  return <PhysicsDiagram title="Several forces on a box, 20 N and 15 N to the right and 10 N to the left, have the same effect as one resultant force of 25 N to the right.">
    <Ground y={196} x1={20} x2={250} />
    <Parcel x={124} y={194} w={76} h={70} />
    <ForceArrow from={[164, 142]} to={[164 + 20 * k, 142]} tone="push" width={10} label="20 N" labelAt={[164 + 10 * k, 130]} />
    <ForceArrow from={[164, 176]} to={[164 + 15 * k, 176]} tone="push" width={10} label="15 N" labelAt={[164 + 7.5 * k + 50, 181]} />
    <ForceArrow from={[84, 160]} to={[84 - 10 * k, 160]} tone="back" width={10} label="10 N" />
    <text x={290} y={172} textAnchor="middle" fontSize="34" fontWeight="800" fill={ink}>=</text>
    <Ground y={196} x1={320} x2={530} />
    <Parcel x={370} y={194} w={76} h={70} />
    <ForceArrow from={[410, 160]} to={[410 + 25 * k, 160]} tone="resultant" width={14} label="25 N" />
    <Lines x={130} y={244} anchor="middle" lines={['several forces']} size={15} />
    <Lines x={420} y={244} anchor="middle" lines={['one resultant force']} size={15} colour={forceTone.resultant.line} />
    <Lines x={270} y={286} anchor="middle" lines={['same effect as all the forces together']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

function Add() {
  const k = 0.32
  const armsA: [[number, number][], [number, number][]] = [[[18, -52], [40, -50]], [[16, -48], [40, -46]]]
  return <PhysicsDiagram title="Two people push a car to the right with forces of 200 N and 300 N. The forces are in the same direction, so they add: the resultant force is 500 N to the right.">
    <Ground y={206} />
    <Car x={336} y={206} s={1.25} />
    <Person x={236} y={200} arms={armsA} lean={8} top="#f3c7a4" topLine="#b8703f" s={0.95} />
    <Person x={214} y={206} arms={[[[20, -54], [48, -52]], [[18, -50], [48, -48]]]} lean={8} top={shirt} topLine={shirtLine} />
    <ForceArrow from={[36, 100]} to={[36 + 200 * k, 100]} tone="push" width={10} label="200 N" labelAt={[36 + 200 * k + 10, 105]} labelAnchor="start" />
    <ForceArrow from={[36, 134]} to={[36 + 300 * k, 134]} tone="push" width={10} label="300 N" labelAt={[36 + 300 * k + 10, 139]} labelAnchor="start" />
    <ForceArrow from={[150, 250]} to={[150 + 500 * k, 250]} tone="resultant" width={14} label="resultant: 500 N" labelAt={[150 + 500 * k + 14, 256]} labelAnchor="start" />
    <Chip x={270} y={40} text="same direction: add   200 N + 300 N = 500 N" size={14} />
  </PhysicsDiagram>
}

function Subtract() {
  const k = 4
  return <PhysicsDiagram title="Left: two 15 N forces in opposite directions cancel, so the resultant is 0 N. Right: 20 N to the right and 5 N to the left give a resultant of 15 N to the right.">
    <Ground y={176} x1={20} x2={250} />
    <Parcel x={135} y={174} w={70} h={62} />
    <ForceArrow from={[170, 140]} to={[170 + 15 * k, 140]} tone="push" width={10} label="15 N" />
    <ForceArrow from={[100, 140]} to={[100 - 15 * k, 140]} tone="back" width={10} label="15 N" />
    <Lines x={135} y={216} anchor="middle" lines={['15 N − 15 N']} size={15} />
    <Chip x={135} y={254} text="resultant: 0 N" size={15} line={forceTone.resultant.line} />
    <Ground y={176} x1={290} x2={520} />
    <Parcel x={380} y={174} w={70} h={62} />
    <ForceArrow from={[415, 140]} to={[415 + 20 * k, 140]} tone="push" width={10} label="20 N" />
    <ForceArrow from={[345, 140]} to={[345 - 5 * k, 140]} tone="back" width={10} label="5 N" labelAt={[322, 128]} labelAnchor="end" />
    <Lines x={400} y={216} anchor="middle" lines={['20 N − 5 N = 15 N']} size={15} />
    <ForceArrow from={[360, 250]} to={[360 + 15 * k, 250]} tone="resultant" width={12} label="15 N right" labelAt={[360 + 15 * k + 12, 256]} labelAnchor="start" />
    <Lines x={270} y={36} anchor="middle" lines={['opposite directions: subtract']} size={16} />
  </PhysicsDiagram>
}

function TrolleyScene() {
  const k = 10
  return <PhysicsDiagram title="A trolley pulled 12 N to the right and 8 N to the left. Subtract: 12 N − 8 N = 4 N. The resultant is 4 N to the right, the direction of the bigger force.">
    <Ground y={200} />
    <Trolley x={250} y={198} w={110} />
    <ForceArrow from={[305, 168]} to={[305 + 12 * k, 168]} tone="push" width={11} label="12 N" />
    <ForceArrow from={[195, 168]} to={[195 - 8 * k, 168]} tone="back" width={11} label="8 N" />
    <ForceArrow from={[230, 244]} to={[230 + 4 * k, 244]} tone="resultant" width={13} label="resultant: 4 N to the right" labelAt={[230 + 4 * k + 14, 250]} labelAnchor="start" />
    <rect x={150} y={24} width={240} height={50} rx="16" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <text x={270} y={56} textAnchor="middle" fontSize="20" fontWeight="800" fill={ink}><F>12 N</F> − <tspan fill={forceTone.back.line}>8 N</tspan> = 4 N</text>
  </PhysicsDiagram>
}

/* ---------- Section 3: work done ---------- */

/** A box pushed along the floor from `x1` to `x2` (its middle), with a ghost where it started. */
function PushScene({ x1, x2, floor, force, dist, arrowLen = 90, hand = true }: { x1: number; x2: number; floor: number; force: string; dist: string; arrowLen?: number; hand?: boolean }) {
  return <g>
    <Ground y={floor} x1={20} x2={520} />
    <rect x={x1 - 35} y={floor - 58} width={70} height={56} rx="7" fill="none" stroke={muted} strokeWidth="1.8" strokeDasharray="6 5" />
    <Parcel x={x2} y={floor - 2} w={70} h={56} />
    {hand && <Hand x={x2 - 58} y={floor - 30} />}
    <ForceArrow from={[x2 + 40, floor - 30]} to={[x2 + 40 + arrowLen, floor - 30]} tone="push" width={11} label={force} />
    <Distance x1={x1} x2={x2} y={floor + 30} label={dist} />
  </g>
}
function Work() {
  return <PhysicsDiagram title="A hand pushes a box along the floor. The force moves the box through a distance, so work is done: energy is transferred.">
    <PushScene x1={130} x2={330} floor={170} force="force" dist="distance moved" />
    <Chip x={270} y={40} text="energy transferred = work done" size={16} line={jColour} colour={jColour} fill="#f7e6bd" />
  </PhysicsDiagram>
}
function Equation() {
  return <PhysicsDiagram schematic={false} title="The equation for work done: work done = force × distance, or W = F s. W is work done in joules, J; F is force in newtons, N; s is distance in metres, m.">
    <rect x={20} y={16} width={500} height={50} rx="16" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <text x={270} y={48} textAnchor="middle" fontSize="18" fontWeight="750" fill={ink}><J>work done</J> = <F>force</F> × <S>distance</S></text>
    <text x={270} y={112} textAnchor="middle" fontSize="30" fontWeight="800" fill={ink}><J>W</J> = <F>F</F> <S>s</S></text>
    <UnitBox x={110} y={220} to={[244, 104]} name="work done" unit="joules" symbol="J" colour={jColour} w={150} />
    <UnitBox x={270} y={220} to={[282, 106]} name="force" unit="newtons" symbol="N" colour={nColour} w={150} />
    <UnitBox x={430} y={220} to={[304, 104]} name="distance" unit="metres" symbol="m" colour={sColour} w={150} />
  </PhysicsDiagram>
}
function Example() {
  return <PhysicsDiagram title="A force of 40 N pushes a box 3 m along the floor. W = 40 × 3 = 120 J.">
    <PushScene x1={120} x2={320} floor={150} force="40 N" dist="3 m" />
    <rect x={90} y={226} width={360} height={52} rx="18" fill="white" stroke={P.useful} strokeWidth="2.2" />
    <text x={256} y={259} textAnchor="middle" fontSize="20" fontWeight="800" fill={ink}><J>W</J> = <F>40</F> × <S>3</S> = <J>120 J</J></text>
    <Tick x={424} y={252} />
  </PhysicsDiagram>
}
function Joule() {
  return <PhysicsDiagram title="One joule of work is done when a force of one newton moves an object one metre: 1 J = 1 N m.">
    <PushScene x1={150} x2={330} floor={150} force="1 N" dist="1 m" arrowLen={60} hand={false} />
    <rect x={100} y={222} width={340} height={60} rx="18" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <text x={270} y={250} textAnchor="middle" fontSize="19" fontWeight="800" fill={ink}><J>1 J</J> = <F>1 N</F> × <S>1 m</S> = 1 Nm</text>
    <text x={270} y={272} textAnchor="middle" fontSize="12" fontWeight="650" fill={muted}>a joule is a newton-metre</text>
  </PhysicsDiagram>
}

/* ---------- Section 4: cm to m, friction and heating ---------- */

function Convert() {
  const x0 = 70, w = 400, y = 110
  return <PhysicsDiagram schematic={false} title="A metre rule: 50 cm is half of 100 cm. Divide centimetres by 100 to get metres: 50 cm ÷ 100 = 0.5 m.">
    <rect x={x0 - 10} y={y} width={w + 20} height={44} rx="8" fill="#f6e7c4" stroke="#b08a3c" strokeWidth="2" />
    <rect x={x0} y={y + 4} width={w / 2} height={36} rx="4" fill="#cfe9dc" opacity=".9" />
    {Array.from({ length: 21 }, (_, i) => <path key={i} d={`M${x0 + i * w / 20} ${y}v${i % 2 ? 10 : 18}`} stroke="#7a5a26" strokeWidth="1.4" />)}
    {[0, 50, 100].map(v => <text key={v} x={x0 + v * w / 100} y={y + 36} textAnchor="middle" fontSize="12" fontWeight="700" fill="#7a5a26">{v}</text>)}
    <text x={x0 + w + 14} y={y - 8} textAnchor="end" fontSize="12" fontWeight="700" fill={muted}>cm</text>
    <Distance x1={x0} x2={x0 + w / 2} y={y - 28} label="" />
    <text x={x0 + w / 4} y={y - 42} textAnchor="middle" fontSize="16" fontWeight="800" fill={sColour}>50 cm</text>
    <rect x={120} y={196} width={120} height={46} rx="23" fill="white" stroke={sColour} strokeWidth="2" />
    <text x={180} y={226} textAnchor="middle" fontSize="18" fontWeight="800" fill={sColour}>50 cm</text>
    <Arrow from={[250, 219]} to={[318, 219]} colour={ink} width={2.6} />
    <text x={284} y={208} textAnchor="middle" fontSize="15" fontWeight="800" fill={ink}>÷ 100</text>
    <rect x={328} y={196} width={120} height={46} rx="23" fill="#cfe9dc" stroke={sColour} strokeWidth="2" />
    <text x={388} y={226} textAnchor="middle" fontSize="18" fontWeight="800" fill={sColour}>0.5 m</text>
    <Lines x={270} y={278} anchor="middle" lines={['100 cm = 1 m']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}
const CM_LINES: CardLine[] = [
  { text: <><S>s</S> = 50 ÷ 100 = <S>0.5 m</S></>, note: 'convert cm to m' },
  { text: <><J>W</J> = <F>30</F> × <S>0.5</S></>, note: 'substitute into W = F s' },
  { text: <><J>W</J> = <J>15 J</J></>, note: 'work it out, unit J' },
]
function ConvertExample() {
  return <PhysicsDiagram title="A force of 30 N pushes a box 50 cm. First 50 cm = 0.5 m, then W = 30 × 0.5 = 15 J.">
    <Ground y={150} x1={16} x2={200} />
    <rect x={30} y={92} width={50} height={56} rx="7" fill="none" stroke={muted} strokeWidth="1.8" strokeDasharray="6 5" />
    <Parcel x={110} y={148} w={50} h={56} />
    <ForceArrow from={[138, 104]} to={[196, 104]} tone="push" width={10} label="30 N" />
    <Distance x1={55} x2={110} y={178} label="50 cm" />
    <WorkCard x={214} y={44} w={312} lines={CM_LINES} step={2} done />
    <Tick x={498} y={166} />
  </PhysicsDiagram>
}

/** A rough carpet: a soft strip with little zig-zag tufts. */
function Carpet({ y }: { y: number }) {
  return <g>
    <rect x={20} y={y} width={500} height={18} rx="4" fill="#e6cdd6" stroke="#a36f84" strokeWidth="1.8" />
    <path d={Array.from({ length: 62 }, (_, i) => `${i ? 'L' : 'M'}${24 + i * 8} ${y - (i % 2 ? 5 : 0)}`).join('')} stroke="#a36f84" strokeWidth="1.8" fill="none" />
  </g>
}
function Friction({ heat }: { heat: boolean }) {
  const y = 190, bx = 250
  return <PhysicsDiagram title={heat ? 'Work done against friction also transfers energy to the thermal store of the box and the carpet, so their temperature rises.' : 'A box pushed along a rough carpet. Friction acts the opposite way to the motion. Some energy goes to the kinetic store of the moving box.'}>
    <Carpet y={y} />
    <Parcel x={bx} y={y - 4} w={80} h={62} />
    <ForceArrow from={[bx - 150, y - 46]} to={[bx - 44, y - 46]} tone="push" width={11} label="push" />
    <Arrow from={[bx - 26, y - 84]} to={[bx + 34, y - 84]} colour={muted} width={2} />
    <text x={bx + 42} y={y - 79} fontSize="13" fontWeight="700" fill={muted}>moving</text>
    <ForceArrow from={[bx - 42, y - 10]} to={[bx - 122, y - 10]} tone="friction" width={9} label="friction" labelAt={[bx - 82, y + 42]} />
    {heat && <g>
      <ellipse cx={bx} cy={y + 1} rx="56" ry="7" fill={P.thermal} opacity=".9" />
      <g stroke={P.thermalLine} strokeWidth="2.2" fill="none">
        {[50, 62, 74].map(dx => <path key={dx} d={`M${bx + dx} ${y - 4}c-5 -7 5 -11 0 -18`} />)}
      </g>
    </g>}
    <EnergyStoreBadge store="kinetic" x={150} y={44} dim={heat} />
    {heat && <EnergyStoreBadge store="thermal" x={380} y={44} />}
    {heat && <Lines x={380} y={88} anchor="middle" lines={['temperature rises']} size={15} colour={P.thermalLine} />}
    {!heat && <Lines x={150} y={88} anchor="middle" lines={['the box moves']} size={14} weight={650} colour={muted} />}
  </PhysicsDiagram>
}

/* ---------- Question visual ---------- */

function QCart() {
  const k = 5
  return <PhysicsDiagram title="A cart with two forces in opposite directions.">
    <Ground y={206} />
    <Trolley x={250} y={204} w={110} />
    <ForceArrow from={[305, 174]} to={[305 + 20 * k, 174]} tone="push" width={11} label="20 N" />
    <ForceArrow from={[195, 174]} to={[195 - 6 * k, 174]} tone="back" width={11} label="6 N" labelAt={[160, 162]} labelAnchor="end" />
  </PhysicsDiagram>
}

export function ResultantVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'resultant-idea': return <Idea />
    case 'resultant-add': return <Add />
    case 'resultant-subtract': return <Subtract />
    case 'resultant-trolley': return <TrolleyScene />
    case 'resultant-work': return <Work />
    case 'resultant-eq': return <Equation />
    case 'resultant-example': return <Example />
    case 'resultant-joule': return <Joule />
    case 'resultant-convert': return <Convert />
    case 'resultant-convert-eg': return <ConvertExample />
    case 'resultant-friction': return <Friction heat={false} />
    case 'resultant-heat': return <Friction heat />
    case 'resultant-q-cart': return <QCart />
    default: return null
  }
}
