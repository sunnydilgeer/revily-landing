import { useId, type ReactNode } from 'react'
import { physicsPalette, PhysicsDiagram, Lines, Leader, type Pt } from './PhysicsKit'
import { Arrow, Bust, Beaker, Eye, Numbered, tones } from './WsKit'
import { Note, Icon, Scale, wsTone, wsFaded, r1, type Tone } from './WsMethodVisuals'
import { Bunsen } from './IrAbsorbVisuals'

/*
 * Working Scientifically Lesson 3: Hazards and risk. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'wsrisk-' and is routed from CellBiologyVisuals.tsx.
 *
 * One school lab bench is reused: a Petri dish, two reagent bottles, a Bunsen burner under a tripod with a beaker,
 * and a power supply whose cable drapes over the front edge. Each frame shows or highlights only what it needs.
 * Hazard colours, the same in every frame: microorganisms green, chemicals purple, electricity yellow, fire and heat coral.
 */
const P = physicsPalette
const { ink, muted } = P
const W = { skin: '#f3d6bd', skinLine: '#c29274', wood: '#ecd2a6', woodLine: '#a57a43', glass: '#f3f8fb', glassLine: '#7f9db2', metal: '#dfe5ea', metalLine: '#7f95a6', copper: '#d98a3d' }

type Hazard = 'micro' | 'chemical' | 'electric' | 'fire'
const hz: Record<Hazard, Tone & { name: string }> = {
  micro: { fill: P.plant, line: P.plantLine, name: 'microorganisms' },
  chemical: { fill: P.chemical, line: P.chemicalLine, name: 'chemicals' },
  electric: { fill: P.light, line: P.lightLine, name: 'electricity' },
  fire: { fill: P.hotFill, line: P.hot, name: 'fire and heat' },
}
const good: Tone = wsTone.good, bad: Tone = wsTone.bad

/* ---------- Lab kit ---------- */

const BT = 196 // bench top
function BenchTop({ x1 = 14, x2 = 526, legs = true }: { x1?: number; x2?: number; legs?: boolean }) {
  return <g>
    <path d={`M0 ${BT + 88}H540`} stroke={P.panelLine} strokeWidth="2.4" />
    {legs && [x1 + 26, x2 - 26].map(lx => <rect key={lx} x={lx - 6} y={BT + 10} width="12" height="78" rx="3" fill="#d9c09a" stroke={W.woodLine} strokeWidth="1.6" />)}
    <rect x={x1} y={BT} width={x2 - x1} height="14" rx="5" fill={W.wood} stroke={W.woodLine} strokeWidth="2" />
    <path d={`M${x1 + 12} ${BT + 5}H${x2 - 60}`} stroke="white" strokeWidth="2" opacity=".5" />
  </g>
}
/** A Petri dish on the bench; (x, y) is the middle of its base. */
function PetriDish({ x, y, lid = false, s = 1 }: { x: number; y: number; lid?: boolean; s?: number }) {
  const col: [number, number, number, string, string][] = [[-12, -8, 5, '#f3dc8c', '#b99a2a'], [6, -10, 4, '#f4b8b0', '#c0675a'], [14, -6, 3.4, '#cfe6c2', '#4f8f5a'], [-2, -5, 3.6, '#cfe6c2', '#4f8f5a'], [-18, -5, 2.6, '#f4b8b0', '#c0675a']]
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-30 -8V-2Q-30 2 -26 2H26Q30 2 30 -2V-8" fill={W.glass} stroke={W.glassLine} strokeWidth="1.8" />
    <ellipse cx="0" cy="-8" rx="30" ry="8" fill="#f6efd6" stroke={W.glassLine} strokeWidth="1.8" />
    {col.map(([cx, cy, r, f, l], i) => <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * .55} fill={f} stroke={l} strokeWidth="1.2" />)}
    {lid && <g>
      <path d="M-33 -12V-6Q-33 -2 -29 -2H29Q33 -2 33 -6V-12" fill={W.glass} fillOpacity=".4" stroke={W.glassLine} strokeWidth="1.8" />
      <ellipse cx="0" cy="-12" rx="33" ry="9" fill={W.glass} fillOpacity=".45" stroke={W.glassLine} strokeWidth="1.8" />
      <rect x="-35" y="-10" width="8" height="10" rx="2" fill="#f7ebc8" stroke="#b99a52" strokeWidth="1.2" />
      <rect x="27" y="-10" width="8" height="10" rx="2" fill="#f7ebc8" stroke="#b99a52" strokeWidth="1.2" />
    </g>}
  </g>
}
function FlameSign({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -11L11 0L0 11L-11 0Z" fill="white" stroke={P.hot} strokeWidth="2" />
    <path d="M0 6C-5 6 -5 1 -2 -3C-2 0 0 0 0 -1C0 -3 1 -5 0 -7C4 -4 5 0 4 3C3 5 2 6 0 6Z" fill={ink} />
  </g>
}
function DropSign({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -11L11 0L0 11L-11 0Z" fill="white" stroke={P.hot} strokeWidth="2" />
    <path d="M-3 -6V-1M3 -6V-1" stroke={ink} strokeWidth="1.8" /><path d="M-6 4H6" stroke={ink} strokeWidth="2.4" />
  </g>
}
/** A reagent bottle; (x, y) is the middle of its base. */
function Bottle({ x, y, kind, open = false, liquid = P.chemical }: { x: number; y: number; kind: 'flammable' | 'acid' | 'water'; open?: boolean; liquid?: string }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-7 -52V-44Q-17 -40 -17 -30V-4Q-17 0 -13 0H13Q17 0 17 -4V-30Q17 -40 7 -44V-52Z" fill={W.glass} stroke="none" />
    <path d="M-17 -22V-4Q-17 0 -13 0H13Q17 0 17 -4V-22Z" fill={liquid} opacity=".75" />
    <path d="M-7 -52V-44Q-17 -40 -17 -30V-4Q-17 0 -13 0H13Q17 0 17 -4V-30Q17 -40 7 -44V-52" fill="none" stroke={W.glassLine} strokeWidth="2" />
    {!open && <path d="M-8 -52H8V-60Q8 -62 6 -62H-6Q-8 -62 -8 -60Z" fill="#c9d4dd" stroke={W.metalLine} strokeWidth="1.6" />}
    <rect x="-13" y="-36" width="26" height="24" rx="3" fill="white" stroke="#c3d0da" strokeWidth="1.2" />
    {kind === 'flammable' && <FlameSign x={0} y={-24} s={.9} />}
    {kind === 'acid' && <DropSign x={0} y={-24} s={.9} />}
    {kind === 'water' && <path d="M-7 -24H7M-7 -18H3" stroke="#b8c7d2" strokeWidth="2" />}
  </g>
}
/** A tripod with a gauze on top; (x, y) is the middle of the ground between its legs. Top at y − 70. */
function Tripod({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 34} ${y}L${x - 27} ${y - 70}M${x + 34} ${y}L${x + 27} ${y - 70}M${x + 4} ${y - 6}L${x + 2} ${y - 70}`} stroke="#5a6b79" strokeWidth="3.6" />
    <rect x={x - 36} y={y - 75} width="72" height="6" rx="2" fill="#c9d4dd" stroke="#5a6b79" strokeWidth="1.6" />
    <path d={`M${x - 30} ${y - 72}H${x + 30}`} stroke="#8a9aa7" strokeWidth="1" strokeDasharray="2 2" />
  </g>
}
function Steam({ x, y, n = 3 }: { x: number; y: number; n?: number }) {
  return <g>{Array.from({ length: n }, (_, i) => {
    const sx = x + (i - (n - 1) / 2) * 12
    return <path key={i} d={`M${sx} ${y}q-6 -8 0 -14q6 -7 0 -14`} stroke="#9fb3c2" strokeWidth="2" fill="none" opacity=".85" />
  })}</g>
}
/** The Bunsen, tripod and a beaker of hot water; (x, y) is the middle of the base on the bench. */
function HotSetUp({ x, y, lit = true, beaker = true, mat = false }: { x: number; y: number; lit?: boolean; beaker?: boolean; mat?: boolean }) {
  return <g>
    {mat && <rect x={x - 48} y={y - 7} width="96" height="8" rx="3" fill="#e7e2d8" stroke="#8d8373" strokeWidth="1.6" />}
    <Bunsen x={x} y={mat ? y - 7 : y} s={.5} lit={lit} />
    <Tripod x={x} y={mat ? y - 7 : y} />
    {beaker && <g>
      <Beaker x={x} y={(mat ? y - 7 : y) - 75} w={48} h={50} level={.6} marks={false} />
      {lit && <Steam x={x} y={(mat ? y - 7 : y) - 132} />}
    </g>}
  </g>
}
/** A bench power supply with its cable over the front edge to a plug on the floor; (x, y) the middle of its base. */
function PowerSupply({ x, y, frayed = true, tidy = false }: { x: number; y: number; frayed?: boolean; tidy?: boolean }) {
  const cable = tidy
    ? `M${x + 32} ${y - 20}H${x + 44}Q${x + 52} ${y - 20} ${x + 54} ${y - 8}L${x + 56} ${y}`
    : `M${x + 32} ${y - 20}H${x + 46}Q${x + 60} ${y - 20} ${x + 62} ${y + 6}Q${x + 62} ${y + 40} ${x + 48} ${y + 58}Q${x + 38} ${y + 72} ${x + 42} ${y + 84}`
  return <g>
    <rect x={x - 32} y={y - 44} width="64" height="44" rx="6" fill="#e8eef3" stroke="#6f8292" strokeWidth="2" />
    <rect x={x - 24} y={y - 36} width="26" height="14" rx="2" fill="#dff0e0" stroke="#6f8292" strokeWidth="1.2" />
    <circle cx={x + 16} cy={y - 29} r="7" fill="white" stroke="#6f8292" strokeWidth="1.6" /><path d={`M${x + 16} ${y - 29}l3 -4`} stroke={ink} strokeWidth="1.6" />
    <circle cx={x - 14} cy={y - 11} r="4" fill={P.hot} stroke="#8a3a30" strokeWidth="1.2" />
    <circle cx={x + 2} cy={y - 11} r="4" fill="#3b5163" stroke="#22313d" strokeWidth="1.2" />
    <path d={cable} stroke="#3b5163" strokeWidth="4.6" fill="none" />
    {tidy && <g>{[0, 1, 2].map(i => <ellipse key={i} cx={x + 60} cy={y - 5 - i * 3} rx="12" ry="4" fill="none" stroke="#3b5163" strokeWidth="3" />)}</g>}
    {!tidy && frayed && <g>
      <rect x={x + 54} y={y + 22} width="14" height="14" rx="3" fill="white" stroke="none" />
      <path d={`M${x + 56} ${y + 24}l-5 -4M${x + 58} ${y + 27}l-6 1M${x + 62} ${y + 30}l6 -3M${x + 60} ${y + 33}l5 3`} stroke={W.copper} strokeWidth="2" />
      <path d={`M${x + 58} ${y + 24}Q${x + 61} ${y + 29} ${x + 58} ${y + 34}`} stroke={W.copper} strokeWidth="2.2" fill="none" />
    </g>}
    {!tidy && <g>
      <rect x={x + 32} y={y + 82} width="22" height="12" rx="3" fill="#3b5163" />
      <path d={`M${x + 36} ${y + 82}v-4M${x + 44} ${y + 82}v-4M${x + 50} ${y + 82}v-4`} stroke="#b0b8c0" strokeWidth="2" />
    </g>}
  </g>
}
function Puddle({ x, y, rx = 36, dim = false }: { x: number; y: number; rx?: number; dim?: boolean }) {
  return <g opacity={dim ? wsFaded : 1}>
    <path d={`M${x - rx} ${y}C${x - rx} ${y - 7} ${x - rx * .4} ${y - 6} ${x - rx * .1} ${y - 8}C${x + rx * .4} ${y - 10} ${x + rx} ${y - 6} ${x + rx} ${y - 1}C${x + rx} ${y + 4} ${x + rx * .3} ${y + 3} ${x} ${y + 4}C${x - rx * .5} ${y + 5} ${x - rx} ${y + 4} ${x - rx} ${y}Z`} fill={P.water} fillOpacity=".8" stroke={P.waterLine} strokeWidth="1.6" />
    <path d={`M${x - rx * .5} ${y - 3}H${x - rx * .15}`} stroke="white" strokeWidth="2" />
  </g>
}
/** An open hand reaching down; (x, y) the fingertips. */
function Hand({ x, y, s = 1, angle = 0 }: { x: number; y: number; s?: number; angle?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`}>
    <path d="M-16 -54C-18 -38 -18 -26 -14 -14C-14 -6 -10 -2 -8 -8L-7 -18L-5 -2C-4 4 2 4 2 -2L2 -18L4 0C5 6 11 5 11 -1L10 -18L12 -8C13 -3 19 -4 18 -10C16 -24 16 -40 14 -54Z" fill={W.skin} stroke={W.skinLine} strokeWidth="1.8" />
    <path d="M-16 -54H14" stroke={W.skinLine} strokeWidth="1.8" />
    <rect x="-20" y="-70" width="38" height="18" rx="4" fill={P.water} stroke={P.waterLine} strokeWidth="1.8" />
  </g>
}
function Bolt({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M4 -18L-10 3H0L-4 18L10 -3H0Z" fill={P.light} stroke={P.lightLine} strokeWidth="1.8" />
}
function SmallFlame({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0C-12 0 -13 -12 -6 -22C-5 -15 -2 -15 -1 -18C-1 -25 2 -30 0 -34C10 -26 13 -14 10 -6C8 -2 5 0 0 0Z" fill="#fbc47a" stroke={P.hot} strokeWidth="1.8" />
    <path d="M0 -3C-5 -3 -5 -9 -2 -13C0 -10 2 -12 2 -15C5 -11 5 -3 0 -3Z" fill="#fff1c2" />
  </g>
}

/* ---------- Section 2: hazard or risk? ---------- */

function HazardScene() {
  return <PhysicsDiagram title="A lab bench with a beaker of water heated by a Bunsen burner on a tripod, a power supply whose cable is frayed, and a pool of spilt liquid on the floor. Each of these is a hazard: something that could cause harm.">
    <BenchTop />
    <HotSetUp x={300} y={BT} />
    <PowerSupply x={420} y={BT} />
    <Puddle x={176} y={BT + 86} rx={44} />
    <Note x={120} y={40} lines={['hazard', 'something that could cause harm']} tone={hz.fire} head w={236} />
    <Note x={182} y={146} lines={['hot flame']} tone={hz.fire} size={13} />
    <Leader from={[226, 146]} to={[290, 150]} colour={hz.fire.line} />
    <Note x={292} y={252} lines={['spilt liquid']} tone={wsTone.test} size={13} />
    <Leader from={[240, 256]} to={[206, 278]} colour={P.waterLine} />
    <Note x={470} y={110} lines={['frayed cable']} tone={hz.electric} size={13} />
    <Leader from={[482, 124]} to={[480, 224]} colour={hz.electric.line} />
  </PhysicsDiagram>
}
function MiniBench({ x, crowded }: { x: number; crowded: boolean }) {
  const top = 214
  return <g>
    <rect x={x} y={top} width={236} height="12" rx="5" fill={W.wood} stroke={W.woodLine} strokeWidth="2" />
    {crowded
      ? <g>
        <Bottle x={x + 34} y={top} kind="water" liquid={P.water} />
        <Bottle x={x + 72} y={top} kind="acid" />
        <rect x={x + 98} y={top - 30} width="56" height="30" rx="4" fill="#dce6f4" stroke={P.gravitationalLine} strokeWidth="1.8" />
        <path d={`M${x + 104} ${top - 20}H${x + 146}M${x + 104} ${top - 12}H${x + 138}`} stroke={P.gravitationalLine} strokeWidth="1.6" />
        <Beaker x={x + 206} y={top} w={46} h={50} level={.6} marks={false} />
        <Steam x={x + 206} y={top - 56} />
        <Bust x={x + 180} y={top + 72} s={.9} kind={1} />
      </g>
      : <g>
        <Beaker x={x + 118} y={top} w={46} h={50} level={.6} marks={false} />
        <Steam x={x + 118} y={top - 56} />
      </g>}
  </g>
}
function RiskScene() {
  return <PhysicsDiagram title="Two benches, each with a beaker of hot water. On the left the beaker sits alone in the middle of the bench: low risk. On the right it is at the edge of a crowded bench with someone passing: higher risk. Risk is the chance that the harm happens.">
    <Note x={270} y={30} lines={['risk', 'the chance the harm happens']} tone={wsTone.hypothesis} head />
    <rect x={12} y={70} width={252} height={218} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.6" />
    <rect x={276} y={70} width={252} height={218} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.6" />
    <MiniBench x={20} crowded={false} />
    <MiniBench x={284} crowded />
    <Note x={138} y={100} lines={['low risk']} tone={good} icon="tick" size={13} />
    <Note x={402} y={100} lines={['higher risk']} tone={bad} icon="warn" size={13} />
    <Lines x={138} y={254} anchor="middle" lines={['middle of the bench,', 'left to cool']} size={12.5} weight={650} colour={muted} />
  </PhysicsDiagram>
}
function DecideScene() {
  const ox = 200, oy = 238, w = 280, h = 190
  return <PhysicsDiagram title="Two questions, how likely is the harm and how bad would it be, make the two sides of a grid. Three events are plotted. One is rare but very bad, and still needs care.">
    <rect x={ox} y={oy - h} width={w} height={h} rx="6" fill={P.panel} />
    <path d={`M${ox + w / 2} ${oy - h}V${oy}M${ox} ${oy - h / 2}H${ox + w}`} stroke={P.grid} strokeWidth="1.6" />
    <Arrow from={[ox, oy]} to={[ox + w + 14, oy]} colour={ink} width={2.2} />
    <Arrow from={[ox, oy]} to={[ox, oy - h - 14]} colour={ink} width={2.2} />
    <Note x={ox + w / 2} y={oy + 32} lines={['how likely?']} tone={wsTone.test} icon="question" size={13.5} />
    <text x={ox + 8} y={oy + 20} fontSize="12.5" fontWeight="650" fill={muted}>rare</text>
    <text x={ox + w} y={oy + 20} textAnchor="end" fontSize="12.5" fontWeight="650" fill={muted}>common</text>
    <Note x={98} y={oy - h + 14} lines={['how bad?']} tone={bad} icon="question" size={13.5} />
    <text x={ox - 10} y={oy - h + 50} textAnchor="end" fontSize="12.5" fontWeight="650" fill={muted}>very bad</text>
    <text x={ox - 10} y={oy - 8} textAnchor="end" fontSize="12.5" fontWeight="650" fill={muted}>mild</text>
    {/* three events */}
    <circle cx={ox + 50} cy={oy - 38} r="9" fill={tones.good.fill} stroke={tones.good.line} strokeWidth="2" />
    <text x={ox + 66} y={oy - 34} fontSize="12.5" fontWeight="700" fill={ink}>rare and mild</text>
    <circle cx={ox + 224} cy={oy - 56} r="9" fill={P.light} stroke={P.lightLine} strokeWidth="2" />
    <text x={ox + 224} y={oy - 74} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={ink}>common, mild</text>
    <circle cx={ox + 50} cy={oy - 150} r="16" fill="none" stroke={P.wasted} strokeWidth="2.2" />
    <circle cx={ox + 50} cy={oy - 150} r="9" fill={tones.bad.fill} stroke={tones.bad.line} strokeWidth="2" />
    <Note x={ox + 164} y={oy - 150} lines={['rare but very bad:', 'still needs care']} tone={bad} size={13} />
  </PhysicsDiagram>
}
function PeopleBlock({ x, y, hurt, name, dim = false }: { x: number; y: number; hurt: number; name: string; dim?: boolean }) {
  const cols = 40, rows = 25, gap = 5.6
  const dots: ReactNode[] = []
  for (let i = 0; i < cols * rows; i++) {
    const c = i % cols, r = Math.floor(i / cols), on = i < hurt
    dots.push(<circle key={i} cx={r1(x + c * gap)} cy={r1(y + r * gap)} r={on ? 2.5 : 1.7} fill={on ? P.hot : '#c3d0da'} />)
  }
  return <g opacity={dim ? wsFaded : 1}>
    <text x={x + (cols - 1) * gap / 2} y={y - 34} textAnchor="middle" fontSize="15" fontWeight="800" fill={ink}>{name}</text>
    <text x={x + (cols - 1) * gap / 2} y={y - 16} textAnchor="middle" fontSize="12.5" fontWeight="650" fill={muted}>1000 visitors, one dot each</text>
    <rect x={x - 5} y={y - 5} width={r1(hurt * gap + 4.5)} height="10" rx="5" fill="none" stroke={P.hot} strokeWidth="1.6" />
    {dots}
  </g>
}
function EstimateScene() {
  return <PhysicsDiagram title="Two blocks of 1000 dots, one dot per visitor. In park A, 12 dots are red: 12 injuries in 1000 visitors. In park B, 2 dots are red: 2 in 1000, a lower risk.">
    <PeopleBlock x={28} y={78} hurt={12} name="park A" />
    <PeopleBlock x={296} y={78} hurt={2} name="park B" />
    <Note x={137} y={248} lines={['12 in 1000 injured']} tone={bad} size={14} />
    <Note x={405} y={248} lines={['2 in 1000 injured']} tone={good} size={14} />
    <text x={405} y={287} textAnchor="middle" fontSize="13" fontWeight="750" fill={P.useful}>lower risk</text>
  </PhysicsDiagram>
}

/* ---------- Section 3: judging risk ---------- */

/** A thought bubble with its trailing dots going down towards (tx, ty). */
function Thought({ x, y, w, h, tail, tone, children }: { x: number; y: number; w: number; h: number; tail: Pt; tone: Tone; children?: ReactNode }) {
  const bx = x + w / 2, by = y + h
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="24" fill="white" stroke={tone.line} strokeWidth="2" />
    {[0.35, 0.7].map((f, i) => <circle key={i} cx={r1(bx + (tail[0] - bx) * f)} cy={r1(by + (tail[1] - by) * f)} r={7 - i * 2.5} fill="white" stroke={tone.line} strokeWidth="1.8" />)}
    {children}
  </g>
}
function Thinker() {
  return <g>
    <Bust x={270} y={292} s={1.3} kind={2} />
  </g>
}
function Road({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x="-80" y="-20" width="160" height="40" rx="4" fill="#9aa7b2" />
    {[-30, -16, -2, 12, 26].map(zx => <rect key={zx} x={zx - 2} y="-17" width="9" height="34" rx="1.5" fill="white" />)}
    <g transform="translate(-58 -2)">
      <rect x="-16" y="-10" width="34" height="14" rx="5" fill={P.hot} stroke="#8a3a30" strokeWidth="1.4" />
      <path d="M-8 -10L-4 -18H8L12 -10Z" fill="#dcecf8" stroke="#8a3a30" strokeWidth="1.4" />
      <circle cx="-7" cy="5" r="4" fill="#3b5163" /><circle cx="10" cy="5" r="4" fill="#3b5163" />
    </g>
  </g>
}
function Plane({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-60 12q20 -8 40 -2q20 -10 36 -2" stroke="#c9d6df" strokeWidth="6" fill="none" />
    <path d="M-44 0C-44 -6 -38 -8 -30 -8H36C46 -8 52 -4 54 0C52 4 46 6 36 6H-30C-38 6 -44 4 -44 0Z" fill="white" stroke="#6f8292" strokeWidth="2" />
    <path d="M-2 -6L-22 -26H-12L14 -6Z M-2 4L-18 22H-8L14 4Z M-36 -6L-44 -22H-36L-26 -8Z" fill="#dcecf8" stroke="#6f8292" strokeWidth="1.8" />
    {[4, 14, 24, 34].map(wx => <circle key={wx} cx={wx} cy={-1} r="2" fill="#6f8292" />)}
  </g>
}
function FamiliarScene() {
  return <PhysicsDiagram title='A person thinks about two activities. Crossing a road is familiar, so it feels safe. Flying is unfamiliar, so it feels risky. A tag says: not always true.'>
    <Thinker />
    <Thought x={12} y={14} w={244} h={150} tail={[244, 216]} tone={good}>
      <Road x={134} y={72} />
      <Lines x={134} y={120} anchor="middle" lines={['crossing the road']} size={14} />
      <Lines x={134} y={142} anchor="middle" lines={['familiar: feels safe']} size={13} weight={700} colour={P.useful} />
    </Thought>
    <Thought x={284} y={14} w={244} h={150} tail={[296, 216]} tone={bad}>
      <Plane x={406} y={64} />
      <Lines x={406} y={120} anchor="middle" lines={['flying']} size={14} />
      <Lines x={406} y={142} anchor="middle" lines={['unfamiliar: feels risky']} size={13} weight={700} colour={P.wasted} />
    </Thought>
    <Note x={430} y={250} lines={['not always true']} tone={wsTone.hypothesis} icon="warn" size={13.5} />
  </PhysicsDiagram>
}
function Climber({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-70 60C-66 20 -60 -10 -40 -40C-30 -54 -10 -58 0 -50C10 -44 14 -30 12 -10C10 20 20 40 22 60Z" fill="#d8cbb8" stroke="#8d7a5f" strokeWidth="2" />
    <path d="M-40 -30l6 3M-50 0l7 2M-20 10l6 2M-8 -20l6 1" stroke="#8d7a5f" strokeWidth="2" />
    <path d="M-2 -52C8 -30 30 -10 34 30" stroke={P.hot} strokeWidth="1.8" fill="none" strokeDasharray="4 3" />
    {/* the climber */}
    <circle cx="26" cy="-6" r="7" fill={W.skin} stroke={W.skinLine} strokeWidth="1.4" />
    <path d="M19 -8Q26 -17 33 -8Z" fill={P.hot} stroke="#8a3a30" strokeWidth="1.2" />
    <path d="M24 1L20 22" stroke={P.waterLine} strokeWidth="5" />
    <path d="M23 6L10 -6M22 8L10 12M20 22L10 34M20 22L26 38" stroke={P.waterLine} strokeWidth="3" />
  </g>
}
function HouseFactory({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-78 40V8L-56 -10L-34 8V40Z" fill="#f7ebe0" stroke="#a57a43" strokeWidth="2" />
    <path d="M-82 10L-56 -14L-30 10" fill="none" stroke="#a05a3c" strokeWidth="3" />
    <rect x="-64" y="14" width="16" height="14" rx="2" fill="#dcecf8" stroke="#8aa0b1" strokeWidth="1.4" />
    <path d="M-10 40V0L10 12V0L30 12V-30H42V12L62 0V40Z" fill="#e8eef3" stroke="#6f8292" strokeWidth="2" />
    {[[-4, 22], [16, 22], [40, 22]].map(([cx, cy]) => <ellipse key={cx} cx={cx + 6} cy={cy} rx="7" ry="10" fill={P.chemical} stroke={P.chemicalLine} strokeWidth="1.4" />)}
    <path d="M36 -34q-8 -8 0 -16q8 -8 0 -14" stroke="#b8c7d2" strokeWidth="3" fill="none" />
    <path d="M-86 40H70" stroke={P.plantLine} strokeWidth="2.4" />
  </g>
}
function ChoiceScene() {
  return <PhysicsDiagram title="A person thinks about two risks. Rock climbing is a risk they chose. A chemical store built next to their house is a risk they did not choose, so it is harder to accept.">
    <Thinker />
    <Thought x={12} y={14} w={244} h={176} tail={[244, 216]} tone={good}>
      <Climber x={124} y={96} />
      <Note x={134} y={170} lines={['I chose this']} tone={good} icon="tick" size={13} />
    </Thought>
    <Thought x={284} y={14} w={244} h={176} tail={[296, 216]} tone={bad}>
      <HouseFactory x={412} y={82} />
      <Note x={406} y={170} lines={['not my choice']} tone={bad} icon="cross" size={13} />
    </Thought>
  </PhysicsDiagram>
}
function Clock({ x, y, r = 24 }: { x: number; y: number; r?: number }) {
  return <g>
    <circle cx={x} cy={y} r={r} fill="white" stroke={ink} strokeWidth="2.4" />
    {Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return <path key={i} d={`M${r1(x + Math.cos(a) * (r - 4))} ${r1(y + Math.sin(a) * (r - 4))}L${r1(x + Math.cos(a) * (r - 8))} ${r1(y + Math.sin(a) * (r - 8))}`} stroke={muted} strokeWidth="1.6" /> })}
    <path d={`M${x} ${y}V${y - r + 9}M${x} ${y}L${x + r * .45} ${y + r * .2}`} stroke={ink} strokeWidth="2.4" />
  </g>
}
function VisibleScene() {
  const clip = useId().replace(/:/g, '')
  return <PhysicsDiagram title="A person relaxing on a sunny beach. A faint warning glow shows the Sun's harm to their skin, which cannot be felt now. An arrow leads to a clock: years later. The harm builds up out of sight.">
    <defs><clipPath id={clip}><rect x="8" y="8" width="524" height="284" rx="20" /></clipPath></defs>
    <g clipPath={`url(#${clip})`}>
      <rect x="8" y="8" width="524" height="284" fill="#f3f9fd" />
      <path d="M0 146Q120 138 250 146T540 140V178Q400 170 280 178T0 182Z" fill={P.water} stroke={P.waterLine} strokeWidth="1.4" />
      <path d="M0 180Q140 168 280 178T540 174V300H0Z" fill="#f4e3bf" stroke="#c9a86a" strokeWidth="1.6" />
    </g>
    <rect x="8" y="8" width="524" height="284" rx="20" fill="none" stroke={P.panelLine} strokeWidth="1.6" />
    {Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return <path key={i} d={`M${r1(70 + Math.cos(a) * 36)} ${r1(64 + Math.sin(a) * 36)}L${r1(70 + Math.cos(a) * 50)} ${r1(64 + Math.sin(a) * 50)}`} stroke={P.lightLine} strokeWidth="3" /> })}
    <circle cx={70} cy={64} r="28" fill="#fcd97d" stroke={P.lightLine} strokeWidth="2.2" />
    {[[132, 112], [164, 146]].map(([ax, ay], i) => <path key={i} d={`M${ax - 20} ${ay - 20}L${ax} ${ay}`} stroke={P.lightLine} strokeWidth="2.4" strokeDasharray="5 5" opacity=".8" />)}
    <ellipse cx={210} cy={210} rx="50" ry="54" fill={P.hot} opacity=".16" />
    <Bust x={210} y={256} s={1.25} kind={1} />
    <path d="M196 202H206M214 202H224" stroke="#3b5163" strokeWidth="5" />
    <path d="M206 202H214" stroke="#3b5163" strokeWidth="1.6" />
    <Note x={210} y={276} lines={['feels fine now']} tone={wsTone.plain} size={12.5} />
    <Arrow from={[284, 222]} to={[396, 176]} bend={-.2} colour={muted} width={2.4} dashed />
    <Clock x={446} y={116} />
    <Lines x={446} y={164} anchor="middle" lines={['years later']} size={14} />
    <Note x={404} y={48} lines={['harm builds up', 'out of sight']} tone={bad} icon="warn" size={13.5} />
  </PhysicsDiagram>
}

/* ---------- Section 4: lab hazards ---------- */

const POS = { petri: 72, bottles: 152, bunsen: 262, power: 408 }
function LabScene({ on, q = false }: { on?: Hazard; q?: boolean }) {
  const d = (h: Hazard) => on !== undefined && on !== h
  return <g>
    <BenchTop />
    <g opacity={d('micro') ? wsFaded : 1}><PetriDish x={POS.petri} y={BT} lid={q} /></g>
    <g opacity={d('chemical') ? wsFaded : 1}>
      {q
        ? <Bottle x={POS.bunsen + 70} y={BT} kind="flammable" open liquid={P.chemical} />
        : <g><Bottle x={POS.bottles - 18} y={BT} kind="acid" /><Bottle x={POS.bottles + 22} y={BT} kind="flammable" open={on === 'chemical'} /></g>}
    </g>
    <g opacity={d('fire') ? wsFaded : 1}><HotSetUp x={POS.bunsen} y={BT} beaker={!q} /></g>
    <g opacity={d('electric') ? wsFaded : 1}>
      <PowerSupply x={POS.power + (q ? 18 : 0)} y={BT} />
      {!q && <Puddle x={POS.power + 88} y={BT - 1} rx={22} />}
    </g>
    {q && <Puddle x={200} y={BT + 86} rx={40} />}
  </g>
}
function LabHazard({ on }: { on: Hazard }) {
  const t = hz[on]
  const titles: Record<Hazard, string> = {
    micro: 'A lab bench. A Petri dish of bacteria colonies is highlighted; a hand reaching to touch it is crossed out: do not touch. The other hazards are faded.',
    chemical: 'The same bench with the chemical bottles highlighted. Acid splashes on a hand: it burns skin. An open bottle of alcohol near a flame: it catches fire.',
    electric: 'The same bench with the power supply highlighted. Its cable is frayed and there is a puddle beside it: an electric shock hazard.',
    fire: 'The same bench with the Bunsen burner highlighted. It is lit with nobody beside it, and the beaker above it is hot and steaming: fire and hot glass.',
  }
  return <PhysicsDiagram title={titles[on]}>
    <LabScene on={on} />
    <Note x={16} y={28} anchor="start" lines={[t.name]} tone={t} size={15} />
    {on === 'micro' && <g>
      <Note x={112} y={244} lines={['bacteria']} tone={t} size={13} />
      <Leader from={[96, 230]} to={[72, 190]} colour={t.line} />
      <Hand x={104} y={166} s={.8} angle={-30} />
      <g transform="translate(142 104)"><circle r="13" fill={tones.bad.fill} stroke={tones.bad.line} strokeWidth="2" /><path d="M-5 -5l10 10M5 -5l-10 10" stroke={tones.bad.line} strokeWidth="3" /></g>
      <Lines x={162} y={109} lines={['do not touch']} size={13} weight={750} colour={P.wasted} />
    </g>}
    {on === 'chemical' && <g>
      <Hand x={88} y={146} s={.75} angle={-12} />
      {[[96, 132], [106, 124], [90, 122]].map(([sx, sy], i) => <circle key={i} cx={sx} cy={sy} r={3.2 - i * .6} fill={P.chemical} stroke={P.chemicalLine} strokeWidth="1.2" />)}
      <Note x={66} y={70} lines={['burns skin']} tone={t} size={13} />
      <SmallFlame x={206} y={BT} s={.8} />
      <Note x={206} y={110} lines={['catches fire']} tone={t} size={13} />
      <Leader from={[196, 124]} to={[180, 150]} colour={t.line} />
    </g>}
    {on === 'electric' && <g>
      <Bolt x={478} y={86} s={1.3} />
      <Note x={454} y={40} lines={['electric shock']} tone={t} size={13.5} />
      <Note x={336} y={250} lines={['frayed cable']} tone={t} size={12.5} />
      <Leader from={[384, 246]} to={[462, 226]} colour={t.line} />
      <Lines x={496} y={180} anchor="middle" lines={['water']} size={12.5} weight={700} colour={P.waterLine} />
    </g>}
    {on === 'fire' && <g>
      <Note x={160} y={112} lines={['fire']} tone={t} size={13} />
      <Leader from={[180, 122]} to={[256, 146]} colour={t.line} />
      <Note x={372} y={80} lines={['hot glass']} tone={t} size={13} />
      <Leader from={[334, 88]} to={[284, 100]} colour={t.line} />
      <Lines x={262} y={252} anchor="middle" lines={['nobody watching']} size={13} weight={700} colour={P.wasted} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 5: reducing risk ---------- */

function Clipboard({ x, y }: { x: number; y: number }) {
  return <g>
    <rect x={x} y={y} width="206" height="236" rx="12" fill="#d9c09a" stroke={W.woodLine} strokeWidth="2" />
    <rect x={x + 12} y={y + 16} width="182" height="208" rx="6" fill="white" stroke="#c3d0da" strokeWidth="1.4" />
    <rect x={x + 73} y={y - 8} width="60" height="20" rx="6" fill="#c9d4dd" stroke={W.metalLine} strokeWidth="1.8" />
    <text x={x + 103} y={y + 46} textAnchor="middle" fontSize="15" fontWeight="850" fill={ink}>risk assessment</text>
    <path d={`M${x + 26} ${y + 58}H${x + 180}`} stroke="#c3d0da" strokeWidth="1.6" />
    {[['1', 'identify hazards'], ['2', 'reduce the risks']].map(([n, t], i) => <g key={n}>
      <circle cx={x + 38} cy={y + 88 + i * 46} r="12" fill={i ? wsTone.good.fill : wsTone.bad.fill} stroke={i ? wsTone.good.line : wsTone.bad.line} strokeWidth="2" />
      <text x={x + 38} y={y + 93 + i * 46} textAnchor="middle" fontSize="13" fontWeight="800" fill={ink}>{n}</text>
      <text x={x + 58} y={y + 93 + i * 46} fontSize="14" fontWeight="750" fill={ink}>{t}</text>
    </g>)}
    {[0, 1, 2].map(i => <path key={i} d={`M${x + 28} ${y + 176 + i * 14}H${x + 162 - i * 20}`} stroke="#d5e0e8" strokeWidth="3" />)}
  </g>
}
function PlanScene() {
  return <PhysicsDiagram title="A clipboard headed risk assessment lists two steps: 1 identify the hazards, 2 reduce the risks. Beside it, two steps joined by an arrow: spot each hazard, then choose a way to reduce its risk.">
    <Clipboard x={18} y={38} />
    <Panel2 x={260} y={40} w={256} h={78} tone={bad}>
      <Icon kind="eye" x={292} y={79} colour={bad.line} s={1.4} />
      <Lines x={318} y={73} lines={['1  identify', 'every hazard']} size={15} />
    </Panel2>
    <Arrow from={[388, 124]} to={[388, 162]} colour={muted} width={2.8} />
    <Panel2 x={260} y={168} w={256} h={78} tone={good}>
      <Icon kind="tick" x={292} y={207} colour={good.line} s={1.4} />
      <Lines x={318} y={201} lines={['2  reduce the', 'risk from each']} size={15} />
    </Panel2>
    <Lines x={388} y={280} anchor="middle" lines={['do this before you start']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}
function Panel2({ x, y, w, h, tone, children }: { x: number; y: number; w: number; h: number; tone: Tone; children?: ReactNode }) {
  return <g><rect x={x} y={y} width={w} height={h} rx="16" fill={tone.fill} fillOpacity=".45" stroke={tone.line} strokeWidth="2" />{children}</g>
}
/* control icons, centred on (0, 0), about 40 across */
function Goggles() {
  return <g>
    <path d="M-26 -2Q-26 -12 -16 -12H16Q26 -12 26 -2V4Q26 12 16 12Q8 12 4 5Q0 1 -4 5Q-8 12 -16 12Q-26 12 -26 4Z" fill="#dcecf8" stroke={P.waterLine} strokeWidth="2" />
    <path d="M-26 -2H-32M26 -2H32" stroke={P.waterLine} strokeWidth="3" />
    <path d="M-18 -6Q-14 -8 -10 -6M8 -6Q12 -8 16 -6" stroke="white" strokeWidth="2" />
  </g>
}
function Mat() {
  return <g>
    <rect x="-28" y="-6" width="56" height="12" rx="3" fill="#e7e2d8" stroke="#8d8373" strokeWidth="1.8" />
    <Beaker x={0} y={-6} w={26} h={28} level={.6} marks={false} />
  </g>
}
function FumeCupboard() {
  return <g>
    <rect x="-24" y="-24" width="48" height="46" rx="4" fill="#e8eef3" stroke="#6f8292" strokeWidth="2" />
    <rect x="-18" y="-10" width="36" height="26" rx="2" fill="#f3f8fb" stroke="#9fb3c2" strokeWidth="1.4" />
    <path d="M-6 -30V-40M6 -30V-40" stroke={P.chemicalLine} strokeWidth="2" /><path d="M-10 -36L-6 -42L-2 -36M2 -36L6 -42L10 -36" fill="none" stroke={P.chemicalLine} strokeWidth="2" />
  </g>
}
function Tap() {
  return <g>
    <path d="M-20 -22H6Q14 -22 14 -14V-8" fill="none" stroke="#7f95a6" strokeWidth="6" />
    <rect x="-24" y="-28" width="8" height="12" rx="2" fill="#c9d4dd" stroke="#6f8292" strokeWidth="1.4" />
    {[0, 1, 2].map(i => <path key={i} d={`M${12 + i * 3} ${-2 + i * 7}C${13 + i * 3} ${1 + i * 7} ${16 + i * 3} ${2 + i * 7} ${14 + i * 3} ${4 + i * 7}`} stroke={P.waterLine} strokeWidth="2.4" fill="none" />)}
    <path d="M-10 16Q-4 6 4 12Q10 6 20 18" fill={W.skin} stroke={W.skinLine} strokeWidth="1.6" />
  </g>
}
function SplashIcon() {
  return <g>{[[-8, 6, 5], [4, -4, 6], [10, 10, 4], [-4, -12, 3.4]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={P.chemical} stroke={P.chemicalLine} strokeWidth="1.6" />)}</g>
}
function GasIcon() {
  return <g>{[-10, 0, 10].map((x, i) => <path key={i} d={`M${x} 16q-7 -8 0 -16q7 -8 0 -16`} stroke={P.chemicalLine} strokeWidth="2.6" fill="none" />)}</g>
}
function HotIcon() {
  return <g><Beaker x={0} y={16} w={30} h={32} level={.6} marks={false} /><path d="M-6 -20q-4 -5 0 -9M6 -20q-4 -5 0 -9" stroke={P.hot} strokeWidth="2.2" fill="none" /></g>
}
function Germ() {
  return <g>
    {Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return <path key={i} d={`M${r1(Math.cos(a) * 11)} ${r1(Math.sin(a) * 11)}L${r1(Math.cos(a) * 17)} ${r1(Math.sin(a) * 17)}`} stroke={P.plantLine} strokeWidth="2.4" /> })}
    <circle r="12" fill={P.plant} stroke={P.plantLine} strokeWidth="2" /><circle cx="-4" cy="-3" r="2.4" fill={P.plantLine} /><circle cx="4" cy="3" r="2" fill={P.plantLine} />
  </g>
}
function ControlScene() {
  const rows: { hazard: string; icon: ReactNode; tone: Tone; control: string; cicon: ReactNode }[] = [
    { hazard: 'splashes', icon: <SplashIcon />, tone: hz.chemical, control: 'safety goggles', cicon: <Goggles /> },
    { hazard: 'hot beaker', icon: <HotIcon />, tone: hz.fire, control: 'heat-proof mat', cicon: <Mat /> },
    { hazard: 'harmful gas', icon: <GasIcon />, tone: hz.chemical, control: 'fume cupboard', cicon: <FumeCupboard /> },
    { hazard: 'bacteria', icon: <Germ />, tone: hz.micro, control: 'wash your hands', cicon: <Tap /> },
  ]
  return <PhysicsDiagram title="A table matching each hazard to a control. Splashes: safety goggles. A hot beaker: a heat-proof mat. A harmful gas: a fume cupboard. Bacteria: wash your hands.">
    <text x={130} y={24} textAnchor="middle" fontSize="14" fontWeight="800" fill={bad.line}>hazard</text>
    <text x={396} y={24} textAnchor="middle" fontSize="14" fontWeight="800" fill={good.line}>control</text>
    {rows.map((r, i) => {
      const y = 36 + i * 64
      return <g key={r.hazard}>
        <rect x={16} y={y} width={228} height={56} rx="14" fill={r.tone.fill} fillOpacity=".4" stroke={r.tone.line} strokeWidth="1.8" />
        <g transform={`translate(52 ${y + 28})`}>{r.icon}</g>
        <text x={88} y={y + 33} fontSize="15" fontWeight="750" fill={ink}>{r.hazard}</text>
        <Arrow from={[252, y + 28]} to={[284, y + 28]} colour={muted} width={2.6} />
        <rect x={292} y={y} width={232} height={56} rx="14" fill={good.fill} fillOpacity=".4" stroke={good.line} strokeWidth="1.8" />
        <g transform={`translate(332 ${y + 30})`}>{r.cicon}</g>
        <text x={372} y={y + 33} fontSize="15" fontWeight="750" fill={ink}>{r.control}</text>
      </g>
    })}
  </PhysicsDiagram>
}
function SafeUseScene() {
  return <PhysicsDiagram title="The bench made safe. A student with long hair tied back watches the flame of a Bunsen burner standing on a heat-proof mat. The bench is dry and the power supply cable is checked and tidy. At the end, switch off the power and the gas.">
    {/* student behind the bench, long hair tied back in a ponytail */}
    <path d="M106 128C92 132 86 146 90 166C92 174 100 174 100 164C98 150 102 140 110 136Z" fill="#6b5446" />
    <path d="M100 138L108 132" stroke={P.hot} strokeWidth="4" />
    <Bust x={124} y={206} s={1.5} kind={4} />
    <BenchTop />
    <HotSetUp x={262} y={BT} mat />
    <PowerSupply x={420} y={BT} tidy />
    <path d="M140 140L246 138" stroke={muted} strokeWidth="2" strokeDasharray="5 5" />
    <Note x={360} y={58} lines={['watch the flame']} tone={hz.fire} icon="eye" size={12.5} />
    <Note x={70} y={60} lines={['hair tied back']} tone={good} size={12.5} />
    <Leader from={[80, 74]} to={[94, 142]} colour={good.line} />
    <Note x={226} y={252} lines={['heat-proof mat']} tone={good} size={12.5} />
    <Leader from={[250, 238]} to={[258, 193]} colour={good.line} />
    <Note x={446} y={108} lines={['cable checked,', 'bench dry']} tone={hz.electric} size={12.5} />
    <Note x={424} y={250} lines={['switch off power', 'and gas at the end']} tone={wsTone.test} icon="tick" size={12.5} />
  </PhysicsDiagram>
}
function BenefitScene() {
  return <PhysicsDiagram title="Left: carbon dioxide from a factory chimney is piped deep underground and stored in rock, with a small chance it leaks out. Right: a level balance weighs the risk, a leak, against the benefit, lower emissions.">
    {/* ground cross-section */}
    <path d="M12 104Q130 98 250 104V280Q250 290 240 290H22Q12 290 12 280Z" fill="#e6d6bd" stroke="#a88b64" strokeWidth="1.6" />
    <path d="M12 104Q130 98 250 104" stroke={P.plantLine} strokeWidth="3" fill="none" />
    <path d="M12 156Q130 146 250 158M12 212Q130 206 250 214" stroke="#b9a07c" strokeWidth="1.6" fill="none" />
    <path d="M40 234Q130 222 226 236Q232 262 200 270Q130 280 60 268Q30 262 40 234Z" fill="#c9b594" stroke="#8d7a5f" strokeWidth="1.6" />
    {[[70, 250], [98, 258], [126, 248], [154, 258], [182, 250], [110, 238], [166, 240]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="5.5" fill={P.chemical} stroke={P.chemicalLine} strokeWidth="1.4" />)}
    <rect x={40} y={46} width="60" height="58" rx="3" fill="#e8eef3" stroke="#6f8292" strokeWidth="2" />
    <rect x={76} y={18} width="14" height="30" fill="#c9d4dd" stroke="#6f8292" strokeWidth="1.8" />
    <path d="M100 86H130V234" stroke="#6f8292" strokeWidth="7" fill="none" />
    <path d="M100 86H130V234" stroke="#c9d4dd" strokeWidth="3" fill="none" />
    <Arrow from={[146, 150]} to={[146, 206]} colour={P.chemicalLine} width={2.2} />
    <text x={130} y={286} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#6d5a40">stored deep in rock</text>
    <text x={160} y={184} fontSize="13" fontWeight="750" fill={P.chemicalLine}>CO₂</text>
    <path d="M206 232Q214 180 222 108" stroke={P.wasted} strokeWidth="2" strokeDasharray="4 5" fill="none" />
    <text x={214} y={96} textAnchor="middle" fontSize="18" fontWeight="850" fill={P.wasted}>?</text>
    {/* the balance */}
    <Scale x={402} y={96} tilt={0} span={176} leftTone={bad} rightTone={good}
      leftLabel="risk" rightLabel="benefit"
      left={<g><text y="-8" textAnchor="middle" fontSize="12.5" fontWeight="750" fill={ink}>leak</text></g>}
      right={<g><text y="-24" textAnchor="middle" fontSize="12.5" fontWeight="750" fill={ink}>lower</text><text y="-8" textAnchor="middle" fontSize="12.5" fontWeight="750" fill={ink}>emissions</text></g>} />
    <Note x={402} y={34} lines={['weigh them up']} tone={wsTone.hypothesis} size={14} />
  </PhysicsDiagram>
}

/* ---------- Question visual ---------- */

function QBench() {
  return <PhysicsDiagram title="A lab bench with four numbered items.">
    <LabScene q />
    <Numbered n={1} at={[72, 128]} to={[72, 184]} />
    <Numbered n={2} at={[500, 112]} to={[486, 226]} />
    <Numbered n={3} at={[196, 72]} to={[256, 132]} />
    <Numbered n={4} at={[112, 250]} to={[180, 280]} />
  </PhysicsDiagram>
}

export function WsRiskVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'wsrisk-hazard': return <HazardScene />
    case 'wsrisk-risk': return <RiskScene />
    case 'wsrisk-decide': return <DecideScene />
    case 'wsrisk-estimate': return <EstimateScene />
    case 'wsrisk-familiar': return <FamiliarScene />
    case 'wsrisk-choice': return <ChoiceScene />
    case 'wsrisk-visible': return <VisibleScene />
    case 'wsrisk-micro': return <LabHazard on="micro" />
    case 'wsrisk-chemical': return <LabHazard on="chemical" />
    case 'wsrisk-electric': return <LabHazard on="electric" />
    case 'wsrisk-fire': return <LabHazard on="fire" />
    case 'wsrisk-plan': return <PlanScene />
    case 'wsrisk-control': return <ControlScene />
    case 'wsrisk-safeuse': return <SafeUseScene />
    case 'wsrisk-benefit': return <BenefitScene />
    case 'wsrisk-q-bench': return <QBench />
    default: return null
  }
}
