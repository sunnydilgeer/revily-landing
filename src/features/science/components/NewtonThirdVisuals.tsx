import { physicsPalette as P, PhysicsDiagram, type Pt } from './PhysicsKit'
const r1 = (n: number) => Math.round(n * 10) / 10
import { ink, muted, wood, woodLine, metal, metalLine, Caption, Tag, Floor, Person, CrossMark, Tick } from './EnergyStoreVisuals'
import { mo, Force, Note } from './VtGraphVisuals'
import { Accel } from './NewtonLawVisuals'

/*
 * Physics Lesson 48: Newton's Third Law. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'newton3-' and is routed from CellBiologyVisuals.tsx.
 *
 * Each force arrow is drawn on the object it acts on and is tinted in that object's colour, so a student can see at
 * a glance that the two forces of a Third Law pair act on different objects. The two forces of a pair are always
 * the same length. On the book, weight is indigo (gravity) and the normal contact force teal, as in the motion kit.
 */

const you = '#3f7a9c', trolleyC = '#c8671f', wall = '#a5634a'
const skaterA = { fill: '#cfe6c2', line: '#4f8f5a' }, skaterB = { fill: '#e4d6f2', line: '#7a56a6' }

/** A shopping trolley facing right, handle on the left; (x, y) is the floor under its middle. */
function ShopTrolley({ x, y, dim = false }: { x: number; y: number; dim?: boolean }) {
  return <g opacity={dim ? 0.35 : 1}>
    <path d={`M${x - 46} ${y - 92}H${x + 52}L${x + 40} ${y - 44}H${x - 38}Z`} fill={metal} fillOpacity=".6" stroke={metalLine} strokeWidth="2.4" />
    {[-22, 2, 26].map(dx => <path key={dx} d={`M${x + dx} ${y - 92}L${x + dx - 2} ${y - 44}`} stroke={metalLine} strokeWidth="1.3" opacity=".7" />)}
    <path d={`M${x - 43} ${y - 68}H${x + 46}`} stroke={metalLine} strokeWidth="1.3" opacity=".7" />
    <path d={`M${x - 46} ${y - 92}L${x - 62} ${y - 104}`} stroke={metalLine} strokeWidth="3" />
    <path d={`M${x - 36} ${y - 44}L${x - 32} ${y - 14}H${x + 34}L${x + 38} ${y - 44}`} stroke={metalLine} strokeWidth="2.2" fill="none" />
    {[-30, 32].map(dx => <circle key={dx} cx={x + dx} cy={y - 7} r="7" fill="#4f5d69" stroke="#33404b" strokeWidth="1.4" />)}
  </g>
}
/** A person pushing forwards with both arms straight out (facing right unless `flip`). */
function Pusher({ x, y, s = 1.25, flip = false, top, topLine, dim = false }: { x: number; y: number; s?: number; flip?: boolean; top?: string; topLine?: string; dim?: boolean }) {
  return <g opacity={dim ? 0.3 : 1}>
    <Person x={x} y={y} s={s} flip={flip} lean={4} top={top} topLine={topLine} arms={[[[18, -60], [34, -62]], [[16, -56], [33, -58]]]} legs={[[[-8, -16], [-16, 0]], [[6, -16], [10, 0]]]} />
  </g>
}
/** A skater: a pusher on a line of ice with blades under the feet. */
function Skater({ x, y, flip = false, c, dim = false, s = 1.2 }: { x: number; y: number; flip?: boolean; c: { fill: string; line: string }; dim?: boolean; s?: number }) {
  return <g opacity={dim ? 0.3 : 1}>
    <Pusher x={x} y={y - 5} s={s} flip={flip} top={c.fill} topLine={c.line} />
    <path d={`M${x - 26} ${y}H${x + 20}`} stroke={metalLine} strokeWidth="2.4" />
  </g>
}
function Ice({ y }: { y: number }) {
  return <g><rect x={20} y={y} width={500} height={16} rx="8" fill="#e6f2f9" /><path d={`M20 ${y}H520`} stroke="#9cc5dd" strokeWidth="2" /></g>
}
/** A brick wall standing on the floor; x is its left face. */
function Wall({ x, y, h = 170, w = 70, dim = false }: { x: number; y: number; h?: number; w?: number; dim?: boolean }) {
  const rows = Math.floor(h / 22)
  return <g opacity={dim ? 0.35 : 1}>
    <rect x={x} y={y - h} width={w} height={h} rx="3" fill="#f1d6c9" stroke={wall} strokeWidth="2.4" />
    {Array.from({ length: rows }, (_, i) => <g key={i} stroke={wall} strokeWidth="1.2" opacity=".55">
      <path d={`M${x} ${y - h + (i + 1) * 22}H${x + w}`} />
      <path d={`M${r1(x + w * (i % 2 ? 0.34 : 0.66))} ${y - h + i * 22}V${y - h + (i + 1) * 22}`} />
    </g>)}
  </g>
}

/* ---------- Section 2: equal and opposite, on different objects ---------- */

function Pairs({ focus }: { focus: string }) {
  if (focus === 'newton3-law' || focus === 'newton3-different') {
    const tint = focus === 'newton3-different'
    return <PhysicsDiagram title={tint ? 'The same picture with each arrow coloured like the object it acts on. The orange arrow acts on the trolley; the blue arrow acts on you.' : 'A person pushes a shopping trolley to the right. An arrow on the trolley: you push the trolley. An arrow on the person, the same length, pointing left: the trolley pushes you. Equal and opposite.'}>
      <Floor x1={20} x2={520} y={250} />
      <Pusher x={176} y={250} top={tint ? '#cfe2ef' : undefined} />
      <ShopTrolley x={278} y={250} />
      <Force from={[330, 150]} to={[430, 150]} colour={tint ? trolleyC : ink} lines={['you push', 'the trolley']} at="above" />
      <Force from={[150, 150]} to={[50, 150]} colour={tint ? you : ink} lines={['the trolley', 'pushes you']} at="above" />
      {tint ? <g>
        <Tag x={380} y={84} text="acts on the trolley" colour={trolleyC} />
        <Tag x={100} y={84} text="acts on you" colour={you} />
        <Caption text="Two forces, two different objects." y={286} />
      </g> : <Tag x={270} y={284} text="equal and opposite" colour={ink} />}
    </PhysicsDiagram>
  }
  if (focus === 'newton3-skaters') return <PhysicsDiagram title="Two ice skaters face each other with their hands touching. An arrow on each skater points away from the other, the same length. Labels: A pushes B, and B pushes A.">
    <Ice y={236} />
    <Skater x={222} y={236} c={skaterA} />
    <Skater x={318} y={236} c={skaterB} flip />
    <text x={214} y={116} textAnchor="middle" fontSize="18" fontWeight="800" fill={skaterA.line}>A</text>
    <text x={326} y={116} textAnchor="middle" fontSize="18" fontWeight="800" fill={skaterB.line}>B</text>
    <Force from={[196, 170]} to={[96, 170]} colour={skaterA.line} lines={['B pushes A']} at="above" />
    <Force from={[344, 170]} to={[444, 170]} colour={skaterB.line} lines={['A pushes B']} at="above" />
    <Caption text="Same size, opposite directions, on different skaters." y={284} />
  </PhysicsDiagram>
  // newton3-skater-acc
  return <PhysicsDiagram title="The skaters move apart. Skater A, 50 kg, has a long acceleration arrow. Skater B, 65 kg, has a short one. Smaller mass, bigger acceleration.">
    <Ice y={236} />
    <Skater x={176} y={236} c={skaterA} s={1.1} />
    <Skater x={364} y={236} c={skaterB} s={1.3} flip />
    <Tag x={176} y={96} text="A: 50 kg" colour={skaterA.line} />
    <Tag x={364} y={78} text="B: 65 kg" colour={skaterB.line} />
    <Accel x={140} y={150} len={110} dir={-1} />
    <Accel x={400} y={150} len={70} />
    <text x={84} y={138} textAnchor="middle" fontSize="13" fontWeight="700" fill={mo.accel}>big</text>
    <text x={436} y={138} textAnchor="middle" fontSize="13" fontWeight="700" fill={mo.accel}>small</text>
    <Tag x={270} y={276} text="smaller mass, bigger acceleration" colour={mo.accel} />
  </PhysicsDiagram>
}

/* ---------- Section 3: pushing a wall; why the forces do not cancel ---------- */

function WallScene({ push, label = true }: { push: number; label?: boolean }) {
  return <g>
    <Wall x={330} y={250} />
    <Pusher x={284} y={250} />
    <Force from={[400, 160]} to={[400 + push, 160]} colour={wall} label={label ? 'push' : undefined} at="above" />
    <Force from={[252, 160]} to={[252 - push, 160]} colour={you} lines={label ? ['normal', 'contact force'] : undefined} at="above" />
  </g>
}
function WallAndPuzzle({ focus }: { focus: string }) {
  if (focus === 'newton3-wall') return <PhysicsDiagram title="A man pushes a brick wall. An arrow on the wall: his push. An arrow on the man, the same length, pointing back: the normal contact force from the wall.">
    <Floor x1={20} x2={520} y={250} />
    <WallScene push={90} />
    <Tag x={446} y={194} text="on the wall" colour={wall} />
    <Tag x={206} y={194} text="on the man" colour={you} />
    <Caption text="The wall pushes back on him." y={284} />
  </PhysicsDiagram>
  if (focus === 'newton3-wall-equal') return <PhysicsDiagram title="Two panels. A gentle push: both arrows are short. A hard push: both arrows are longer. Push harder, pushed back harder.">
    {[{ x0: 6, push: 28, t: 'gentle push' }, { x0: 274, push: 56, t: 'hard push' }].map(p => <g key={p.t}>
      <rect x={p.x0} y={10} width={260} height={250} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
      <text x={p.x0 + 130} y={36} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{p.t}</text>
      <Floor x1={p.x0 + 10} x2={p.x0 + 250} y={236} />
      <Wall x={p.x0 + 150} y={236} h={150} w={40} />
      <Pusher x={p.x0 + 110} y={236} s={1.05} />
      <Force from={[p.x0 + 190, 140]} to={[p.x0 + 190 + p.push, 140]} colour={wall} width={5} />
      <Force from={[p.x0 + 90, 140]} to={[p.x0 + 90 - p.push, 140]} colour={you} width={5} />
    </g>)}
    <Caption text="Push harder, and the wall pushes back harder." y={286} />
  </PhysicsDiagram>
  const one = focus === 'newton3-one-object'
  return <PhysicsDiagram title={one ? 'Skater A is highlighted with only the arrow acting on her: B pushes A, to the left. Skater B is faded. To see how one object moves, look at the forces on that object.' : 'Two skaters with a question mark. Each arrow is coloured like the skater it acts on. The forces act on different objects, so they do not cancel.'}>
    <Ice y={236} />
    <Skater x={222} y={236} c={skaterA} />
    <Skater x={318} y={236} c={skaterB} flip dim={one} />
    <text x={214} y={116} textAnchor="middle" fontSize="18" fontWeight="800" fill={skaterA.line}>A</text>
    <text x={326} y={116} textAnchor="middle" fontSize="18" fontWeight="800" fill={skaterB.line} opacity={one ? 0.3 : 1}>B</text>
    <Force from={[196, 170]} to={[96, 170]} colour={skaterA.line} lines={['on A']} at="above" />
    <g opacity={one ? 0.15 : 1}><Force from={[344, 170]} to={[444, 170]} colour={skaterB.line} lines={['on B']} at="above" /></g>
    {one ? <g>
      <Note x={120} y={20} w={220} size={13} lines={['look at the forces', 'on one object']} colour={skaterA.line} fill={skaterA.fill} line={skaterA.line} />
      <Tag x={270} y={276} text="A moves left" colour={skaterA.line} />
    </g> : <g>
      <circle cx={270} cy={48} r="24" fill="white" stroke={muted} strokeWidth="2" />
      <text x={270} y={58} textAnchor="middle" fontSize="28" fontWeight="800" fill={muted}>?</text>
      <Note x={270} y={250} w={330} size={13} lines={['forces on different objects do not cancel']} colour={ink} fill="white" />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 4: the book on the table (one scene) ---------- */

function Table({ dim = false, tint = false }: { dim?: boolean; tint?: boolean }) {
  return <g opacity={dim ? 0.35 : 1}>
    <rect x={120} y={170} width={300} height={16} rx="4" fill={wood} stroke={tint ? mo.normal : woodLine} strokeWidth={tint ? 3 : 2} />
    <path d="M144 186V270M396 186V270" stroke={woodLine} strokeWidth="10" />
    <path d="M144 186V270M396 186V270" stroke={wood} strokeWidth="6" />
  </g>
}
function BigBook({ tint = false }: { tint?: boolean }) {
  return <g>
    <rect x={214} y={138} width={112} height={32} rx="5" fill="#9fb8e6" stroke={tint ? mo.normal : P.gravitationalLine} strokeWidth={tint ? 3 : 2.2} />
    <path d="M222 150H318M222 158H318" stroke="white" strokeWidth="3" opacity=".8" />
    <path d="M326 142V166" stroke={P.gravitationalLine} strokeWidth="1.4" opacity=".5" />
  </g>
}
function Book({ focus }: { focus: string }) {
  const W = { from: [256, 154] as Pt, to: [256, 238] as Pt }, N = { from: [288, 170] as Pt, to: [288, 86] as Pt }
  const titles: Record<string, string> = {
    'newton3-book': 'A book resting on a table. It is in equilibrium: the resultant force on it is zero.',
    'newton3-book-forces': 'The book on the table with two arrows on the book, the same length: weight pulling down and the normal contact force from the table pushing up.',
    'newton3-book-trap': 'The same two arrows with a caution badge: equal and opposite, but not a Third Law pair.',
    'newton3-book-why': 'Both arrows are circled on the book. Tags: different types of force, and both act on the book.',
    'newton3-real-pair': 'The real Third Law pair: the table pushes up on the book, and the book pushes down on the table with an equal force. The weight arrow is faded. Same type, different objects.',
  }
  const real = focus === 'newton3-real-pair'
  return <PhysicsDiagram title={titles[focus]}>
    <Floor x1={20} x2={520} y={270} />
    <Table tint={real} />
    <BigBook tint={real} />
    {focus === 'newton3-book' && <g>
      <Note x={270} y={40} w={260} size={14} lines={['equilibrium:', 'resultant force zero']} colour={mo.resultant} fill={mo.resultantFill} line={mo.resultant} />
    </g>}
    {focus !== 'newton3-book' && <g opacity={real ? 0.2 : 1}><Force from={W.from} to={W.to} colour={mo.weight} label="weight" at="end" width={6} /></g>}
    {focus !== 'newton3-book' && <Force from={N.from} to={N.to} colour={mo.normal} lines={real ? ['table pushes book'] : ['normal contact force']} at="end" width={6} />}
    {real && <Force from={[340, 172]} to={[340, 256]} colour={mo.normal} lines={['book pushes', 'table']} at="right" width={6} />}
    {focus === 'newton3-book-trap' && <g>
      <rect x={24} y={10} width={492} height={40} rx="20" fill="#fdf1d8" stroke="#c3930f" strokeWidth="2.2" />
      <path d="M40 41L53 18L66 41Z" fill="#fde8a8" stroke="#c3930f" strokeWidth="2" />
      <text x={53} y={38} textAnchor="middle" fontSize="13" fontWeight="800" fill="#8a6a0a">!</text>
      <text x={290} y={36} textAnchor="middle" fontSize="14" fontWeight="800" fill="#8a6a0a">equal and opposite, but NOT a Third Law pair</text>
    </g>}
    {focus === 'newton3-book-why' && <g>
      <ellipse cx={272} cy={166} rx={62} ry={84} fill="none" stroke={ink} strokeWidth="2" strokeDasharray="6 5" />
      <Tag x={110} y={130} text="different types" colour={ink} />
      <Tag x={110} y={158} text="(gravity and contact)" colour={muted} size={12} />
      <Tag x={440} y={130} text="both act on the book" colour={ink} />
      <CrossMark x={392} y={96} />
      <text x={410} y={101} fontSize="13" fontWeight="700" fill={muted}>not a pair</text>
    </g>}
    {real && <g>
      <Tag x={110} y={40} text="same type: contact" colour={mo.normal} />
      <Tag x={110} y={70} text="different objects" colour={mo.normal} />
      <Tick x={214} y={40} s={0.8} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Question: two skaters with masses, no arrows ---------- */

function QuestionSkaters() {
  return <PhysicsDiagram title="Two skaters face each other with their hands touching. Skater A has a mass of 50 kg and skater B has a mass of 65 kg." schematic={false}>
    <Ice y={236} />
    <Skater x={222} y={236} c={skaterA} />
    <Skater x={318} y={236} c={skaterB} flip />
    <Tag x={150} y={100} text="A: 50 kg" colour={skaterA.line} size={15} />
    <Tag x={390} y={100} text="B: 65 kg" colour={skaterB.line} size={15} />
  </PhysicsDiagram>
}

export function NewtonThirdVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  if (['newton3-law', 'newton3-different', 'newton3-skaters', 'newton3-skater-acc'].includes(focus)) return <Pairs focus={focus} />
  if (['newton3-wall', 'newton3-wall-equal', 'newton3-puzzle', 'newton3-one-object'].includes(focus)) return <WallAndPuzzle focus={focus} />
  if (['newton3-book', 'newton3-book-forces', 'newton3-book-trap', 'newton3-book-why', 'newton3-real-pair'].includes(focus)) return <Book focus={focus} />
  if (focus === 'newton3-q-skaters') return <QuestionSkaters />
  return null
}
