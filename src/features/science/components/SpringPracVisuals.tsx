import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, Leader, EnergyStoreBadge, GraphAxes, graphScale, type GraphFrame, type Pt } from './PhysicsKit'
import { ink, muted, r1, faded, Tag, Eq, Arrow, StepStrip, Ring, Person, wood, woodLine, metal, metalLine, type Piece } from './EnergyStoreVisuals'
import { Spaced, UnitBox } from './KineticVisuals'
import { Balance } from './DensityVisuals'
import { forceColour, kColour, eColour, Force, HangSpring, Dim, Cross, Beam } from './ElasticVisuals'

/*
 * Physics Lesson 42: Investigating springs (required practical, preparation only). Original, code-native schematics;
 * not to scale. Focus ids start with 'springprac-'.
 *
 * One apparatus drawing (`Rig`) is reused through the method, variables and safety sections: a clamp stand with a
 * weighted base, a spring hanging beside an upright ruler (0 cm level with the top of the spring), a tape marker on the
 * spring's end, a mass holder with slotted masses and a soft tray on the bench. Colours follow the elasticity lesson:
 * force brick red, spring magenta, extension green, spring constant violet.
 */

const S = P.elasticLine, EeColour = P.elasticLine, tape = '#f2c230', tapeLine = '#b88a0c'
const Y0 = 50, CM = 7, BENCH = 274, SX = 250, RX = 280

/** Page y of a ruler reading in cm (0 cm is level with the top of the spring). */
const yAt = (cm: number) => r1(Y0 + cm * CM)

function Glow({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect x={x} y={y} width={w} height={h} rx="12" fill={P.light} opacity=".55" />
}
/** A stack of slotted masses on a holder, hanging from (x, y). Returns nothing; draws hook, stem, discs, base plate. */
function Holder({ x, y, n, dim = false }: { x: number; y: number; n: number; dim?: boolean }) {
  const discs = Math.max(n, 0), plate = y + 16 + Math.max(discs, 1) * 10
  return <g opacity={dim ? faded : 1}>
    <path d={`M${x} ${y}v6q0 4 -4 4`} stroke={metalLine} strokeWidth="2.2" fill="none" />
    <path d={`M${x} ${y + 8}V${plate}`} stroke={metalLine} strokeWidth="2.6" />
    {Array.from({ length: discs }, (_, i) => <rect key={i} x={x - 17} y={plate - 10 * (i + 1)} width={34} height={9} rx="3" fill={metal} stroke={metalLine} strokeWidth="1.6" />)}
    <rect x={x - 19} y={plate} width={38} height={5} rx="2" fill="#b9c6d1" stroke={metalLine} strokeWidth="1.6" />
  </g>
}
const holderBottom = (y: number, n: number) => y + 21 + Math.max(n, 1) * 10
function Discs({ x, y, n }: { x: number; y: number; n: number }) {
  return <g>{Array.from({ length: n }, (_, i) => <rect key={i} x={x - 17} y={y - 10 * (i + 1)} width={34} height={9} rx="3" fill={metal} stroke={metalLine} strokeWidth="1.6" />)}</g>
}
function Eye({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
    <path d="M-16 0Q0 -13 16 0Q0 13 -16 0Z" fill="white" stroke={ink} strokeWidth="2" />
    <circle cx="-3" r="5" fill={ink} />
  </g>
}

type RigProps = {
  masses?: number; length?: number; glow?: string[]; ghost?: number[]; natural?: boolean; wobble?: boolean; tray?: boolean; spare?: boolean; extra?: ReactNode
}
/** The apparatus. `length` is the ruler reading at the tape mark in cm (natural length 12.0 cm). */
function Rig({ masses = 0, length = 12, glow = [], ghost = [], natural = false, wobble = false, tray = true, spare = true }: RigProps) {
  const bottom = yAt(length), g = (k: string) => glow.includes(k)
  return <g>
    {/* glows go underneath */}
    {g('clamp') && <Glow x={86} y={28} w={180} h={24} />}
    {g('spring') && <Glow x={SX - 20} y={Y0 - 4} w={40} h={bottom - Y0 + 8} />}
    {g('ruler') && <Glow x={RX - 8} y={Y0 - 12} w={60} h={224} />}
    {g('tape') && <Glow x={SX - 8} y={bottom - 12} w={RX - SX + 30} h={24} />}
    {g('masses') && <Glow x={SX - 28} y={bottom + 4} w={56} h={holderBottom(bottom, masses) - bottom + 4} />}
    {g('base') && <Glow x={62} y={236} w={156} h={44} />}
    {g('tray') && <Glow x={SX - 42} y={254} w={84} h={24} />}
    {g('spare') && <Glow x={22} y={236} w={48} h={42} />}
    {/* bench */}
    <rect x={10} y={BENCH} width={520} height={12} rx="4" fill={wood} stroke={woodLine} strokeWidth="1.8" />
    {/* stand: weighted base, rod, boss and clamp arm */}
    <rect x={70} y={BENCH - 12} width={140} height={12} rx="4" fill="#9aa8b4" stroke={metalLine} strokeWidth="2" />
    <rect x={150} y={BENCH - 32} width={52} height={20} rx="5" fill="#5f6f7d" stroke="#3f4d59" strokeWidth="2" />
    <path d={`M100 ${BENCH - 12}V24`} stroke={metalLine} strokeWidth="6" />
    <rect x={92} y={32} width={18} height={16} rx="3" fill="#7d8e9c" stroke="#56636e" strokeWidth="1.6" />
    <path d={`M110 40H${SX + 6}`} stroke={metalLine} strokeWidth="6" />
    <path d={`M${SX} 40V${Y0}`} stroke={metalLine} strokeWidth="2.4" />
    {/* ruler standing on the bench, 0 cm level with the top of the spring */}
    <rect x={RX} y={Y0 - 6} width={20} height={BENCH - Y0 + 6} rx="2" fill="#fbf3dc" stroke="#b8a06a" strokeWidth="1.6" />
    {Array.from({ length: 31 }, (_, i) => <path key={i} d={`M${RX} ${yAt(i)}h${i % 5 === 0 ? 10 : 5}`} stroke="#8a744a" strokeWidth={i % 5 === 0 ? 1.6 : 1} />)}
    {[0, 5, 10, 15, 20, 25, 30].map(v => <text key={v} x={RX + 26} y={yAt(v) + 4} fontSize="12" fill={muted}>{v}</text>)}
    {/* ghost tape positions from earlier readings */}
    {ghost.map(v => <path key={v} d={`M${SX + 4} ${yAt(v)}H${RX}`} stroke={tapeLine} strokeWidth="2" strokeDasharray="3 4" opacity=".6" />)}
    {natural && <path d={`M${SX - 30} ${yAt(12)}H${RX}`} stroke={muted} strokeWidth="1.6" strokeDasharray="5 5" />}
    {/* spring, tape marker, masses */}
    <HangSpring x={SX} top={Y0} bottom={bottom} coils={10} width={13} />
    <path d={`M${SX + 3} ${bottom}H${RX + 4}`} stroke={tapeLine} strokeWidth="5" />
    <path d={`M${SX + 3} ${bottom}H${RX + 4}`} stroke={tape} strokeWidth="3" />
    <Holder x={SX} y={bottom + 2} n={masses} />
    {wobble && <g stroke={muted} strokeWidth="2" opacity=".8"><path d={`M${SX - 30} ${bottom + 20}q-5 8 0 16`} fill="none" /><path d={`M${SX + 30} ${bottom + 20}q5 8 0 16`} fill="none" /></g>}
    {tray && <g><rect x={SX - 36} y={BENCH - 12} width={72} height={12} rx="4" fill="#dfe9f0" stroke="#8aa0b1" strokeWidth="1.6" /><path d={`M${SX - 30} ${BENCH - 6}q6 -4 12 0t12 0t12 0t12 0t12 0`} stroke="#8aa0b1" strokeWidth="1.2" fill="none" /></g>}
    {spare && <Discs x={46} y={BENCH} n={3} />}
  </g>
}
/** A rounded callout with a leader to what it names. */
function Callout({ x, y, lines, colour = ink, to, w, fill = 'white' }: { x: number; y: number; lines: string[]; colour?: string; to?: Pt; w?: number; fill?: string }) {
  const width = w ?? Math.max(...lines.map(l => l.length)) * 7.6 + 22, h = lines.length * 17 + 12
  return <g>
    {to && <Leader from={[x, y + h / 2]} to={to} colour={colour} />}
    <rect x={x} y={y} width={width} height={h} rx="12" fill={fill} stroke={colour} strokeWidth="1.8" />
    <Lines x={x + 11} y={y + 21} lines={lines} size={13} colour={colour} />
  </g>
}
function Reading({ x, y, text }: { x: number; y: number; text: string }) {
  return <g>
    <rect x={x} y={y - 15} width={78} height={30} rx="10" fill="#fff6d0" stroke={tapeLine} strokeWidth="1.8" />
    <text x={x + 39} y={y + 5} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>{text}</text>
  </g>
}

/* ---------- Section 2: the aim, the apparatus, the variables ---------- */

function Aim() {
  const b = yAt(15.5)
  return <PhysicsDiagram title="The apparatus with one mass hanging. The weight of the mass is a force pulling the spring down; the spring stretches, and the extension is how much longer it gets.">
    <Rig masses={1} length={15.5} natural />
    <Force from={[SX, holderBottom(b + 2, 1) + 4]} to={[SX, holderBottom(b + 2, 1) + 46]} label="force" labelAt={[SX - 10, holderBottom(b + 2, 1) + 34]} anchor="end" />
    <Dim from={[SX - 26, yAt(12)]} to={[SX - 26, b]} label="extension" side={-1} size={13} />
    <rect x={350} y={60} width={176} height={44} rx="22" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <Eq x={438} y={88} size={16} pieces={[['force', forceColour], [' ➜ '], ['extension', eColour]]} />
    <Lines x={352} y={150} lines={['add force:', 'hang masses']} size={14} colour={forceColour} />
    <Lines x={352} y={210} lines={['measure the', 'extension']} size={14} colour={eColour} />
  </PhysicsDiagram>
}
function Kit() {
  const b = yAt(12)
  return <PhysicsDiagram title="The apparatus: a clamp on a stand with a weighted base holds a spring. A ruler stands upright beside it. A tape mark on the end of the spring points to the ruler. A mass holder hangs from the spring, and extra masses wait on the bench.">
    <Rig masses={1} length={12} />
    <Callout x={126} y={2} lines={['clamp']} to={[180, 40]} />
    <Callout x={380} y={36} lines={['fixed ruler']} to={[300, 70]} />
    <Callout x={380} y={82} lines={['spring']} to={[SX + 12, 100]} />
    <Callout x={380} y={124} lines={['tape mark']} to={[RX - 6, b]} colour={tapeLine} />
    <Callout x={380} y={172} lines={['mass holder']} to={[SX + 18, b + 30]} />
    <Callout x={12} y={186} lines={['extra', 'masses']} to={[40, BENCH - 32]} />
    <Callout x={380} y={220} lines={['weighted stand']} to={[196, BENCH - 22]} />
  </PhysicsDiagram>
}
function Vars() {
  const b = yAt(15.5)
  return <PhysicsDiagram title="The variables: the masses are changed, so the force is the independent variable. The ruler reading gives the extension, which is measured: the dependent variable.">
    <Rig masses={1} length={15.5} glow={['masses', 'tape']} />
    <Callout x={344} y={20} lines={['measure: extension', '(dependent variable)']} colour={eColour} to={[RX + 6, b]} />
    <Callout x={344} y={170} lines={['change: force', '(independent variable)']} colour={forceColour} to={[SX + 20, b + 36]} />
  </PhysicsDiagram>
}
function Control() {
  const b = yAt(15.5)
  return <PhysicsDiagram title="Keeping it fair: use the same spring and the same ruler every time, and read the tape mark with your eye level with it.">
    <Rig masses={1} length={15.5} />
    <Eye x={420} y={b} flip />
    <path d={`M${RX + 22} ${b}H400`} stroke={ink} strokeWidth="1.8" strokeDasharray="6 5" />
    <Tag x={440} y={b + 34} text="eye level" />
    <Tag x={440} y={48} text="same ruler" colour={kColour} />
    <Leader from={[400, 48]} to={[RX + 20, 66]} colour={kColour} />
    <Tag x={150} y={96} text="same spring" colour={S} />
    <Leader from={[196, 96]} to={[SX - 10, 96]} colour={S} />
  </PhysicsDiagram>
}

/* ---------- Section 3: the method (one drawing, step strip) ---------- */

const methodSteps = ['natural', 'force', 'wait', 'extension', 'repeat']
function Method({ step }: { step: 1 | 2 | 3 | 4 | 5 }) {
  const titles = [
    'Step 1: with no masses on the spring, read the tape mark on the ruler: 12.0 cm. This is the natural length.',
    'Step 2: the force is the weight of the masses. A 200 g mass on a balance: 200 g ÷ 1000 = 0.2 kg, then W = 0.2 × 9.8 = 1.96 N.',
    'Step 3: hang one mass and wait until the spring is at rest. The tape mark now reads 15.5 cm.',
    'Step 4: the extension is the new length minus the natural length: 15.5 − 12.0 = 3.5 cm.',
    'Step 5: add masses one at a time, reading the length after each and writing the results in a table.',
  ]
  const one = yAt(15.5)
  let body: ReactNode
  if (step === 1) body = <g>
    <Rig length={12} glow={['tape']} />
    <Reading x={340} y={yAt(12)} text="12.0 cm" />
    <Lines x={340} y={yAt(12) + 44} lines={['natural length', '(no masses)']} size={14} />
  </g>
  else if (step === 2) body = <g>
    <Balance x={120} y={180} reading="200 g" w={150} />
    <Discs x={120} y={180} n={1} />
    <Arrow from={[210, 190]} to={[262, 190]} colour={ink} width={2.6} />
    <rect x={276} y={70} width={250} height={196} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <Eq x={401} y={106} size={17} pieces={[['200 g ÷ 1000 = '], ['0.2 kg', '#2f6f9f']]} />
    <Eq x={401} y={148} size={17} pieces={[['W', forceColour], [' = m × g']]} />
    <Eq x={401} y={186} size={17} pieces={[['W', forceColour], [' = 0.2 × 9.8']]} />
    <rect x={320} y={206} width={162} height={44} rx="14" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <Eq x={401} y={235} size={20} pieces={[['W', forceColour], [' = 1.96 N']]} />
    <text x={120} y={258} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>g = 9.8 N/kg</text>
  </g>
  else if (step === 3) body = <g>
    <Rig masses={1} length={15.5} wobble glow={['masses']} />
    <Tag x={150} y={one + 42} text="wait until at rest" />
    <Reading x={340} y={one} text="15.5 cm" />
  </g>
  else if (step === 4) body = <g>
    <Rig masses={1} length={15.5} natural />
    <Dim from={[SX - 26, yAt(12)]} to={[SX - 26, one]} side={-1} />
    <text x={SX - 36} y={one - 6} textAnchor="end" fontSize="13" fontWeight="750" fill={eColour}>extension</text>
    <text x={SX - 36} y={yAt(12) - 6} textAnchor="end" fontSize="12" fontWeight="650" fill={muted}>natural 12.0 cm</text>
    <rect x={334} y={120} width={198} height={96} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <text x={433} y={146} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>new − natural</text>
    <rect x={342} y={160} width={182} height={42} rx="12" fill="#e3f3ec" stroke={eColour} strokeWidth="2" />
    <Eq x={433} y={187} size={15} pieces={[['15.5 − 12.0 = '], ['3.5 cm', eColour]]} />
  </g>
  else body = <g>
    <Rig masses={3} length={22.5} ghost={[15.5, 19]} />
    <rect x={338} y={60} width={192} height={150} rx="14" fill="white" stroke={P.panelLine} strokeWidth="1.5" />
    {[['masses', ''], ['length', '(cm)'], ['ext.', '(cm)']].map(([h, u], i) => <g key={h}><text x={370 + i * 62} y={82} textAnchor="middle" fontSize="12" fontWeight="750" fill={ink}>{h}</text><text x={370 + i * 62} y={97} textAnchor="middle" fontSize="12" fontWeight="600" fill={muted}>{u}</text></g>)}
    {[['1', '15.5', '3.5'], ['2', '19.0', '7.0'], ['3', '22.5', '10.5']].map((row, j) => <g key={j}>
      {j === 2 && <rect x={344} y={108 + j * 30} width={180} height={26} rx="8" fill="#fff6d0" stroke={tapeLine} strokeWidth="1.4" />}
      {row.map((c, i) => <text key={i} x={370 + i * 62} y={126 + j * 30} textAnchor="middle" fontSize="14" fontWeight="700" fill={i === 2 ? eColour : ink}>{c}</text>)}
    </g>)}
    <Arrow from={[434, 250]} to={[360, 250]} colour={ink} width={2.6} />
    <text x={444} y={255} fontSize="14" fontWeight="750" fill={ink}>repeat</text>
    <text x={434} y={230} textAnchor="middle" fontSize="12" fontWeight="650" fill={muted}>one mass at a time</text>
  </g>
  return <PhysicsDiagram title={titles[step - 1]} viewBox="0 -34 540 334">
    <g transform="translate(0 -30)"><StepStrip steps={methodSteps} active={step} colour={eColour} gap={112} x0={272} /></g>
    {body}
  </PhysicsDiagram>
}

/* ---------- Section 4: safety ---------- */

function Goggles({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 16} ${y}H${x + 16}`} stroke="#3f7a9c" strokeWidth="3" />
    <rect x={x - 13} y={y - 6} width={13} height={11} rx="4" fill="#cfe8f5" stroke="#3f7a9c" strokeWidth="2" />
    <rect x={x + 1} y={y - 6} width={13} height={11} rx="4" fill="#cfe8f5" stroke="#3f7a9c" strokeWidth="2" />
  </g>
}
function Safety({ which }: { which: 1 | 2 | 3 }) {
  if (which === 1) {
    const b = yAt(15.5)
    return <PhysicsDiagram title="Wear safety goggles for the whole practical. A stretched spring is under tension and can spring back if a hook slips.">
      <Rig masses={1} length={15.5} />
      <Person x={430} y={BENCH - 2} s={1.9} arms={[[[-14, -40], [-18, -20]], [[14, -40], [18, -20]]]} flip />
      <Goggles x={429} y={BENCH - 2 - 76 * 1.9 + 2} />
      <Tag x={430} y={40} text="goggles on" colour="#3f7a9c" />
      <path d={`M${SX - 24} ${b - 6}q-24 -16 -10 -44`} stroke={forceColour} strokeWidth="2.6" fill="none" strokeDasharray="5 4" />
      <Arrow from={[SX - 36, b - 40]} to={[SX - 30, b - 60]} colour={forceColour} width={2.6} />
      <Lines x={SX - 40} y={b - 80} anchor="end" lines={['can spring', 'back']} size={13} colour={forceColour} />
    </PhysicsDiagram>
  }
  if (which === 2) return <PhysicsDiagram title="Make the stand stable with a weighted base, put a tray with a soft lining under the masses, and keep your feet clear in case the masses fall." viewBox="0 0 540 340">
    <Rig masses={1} length={15.5} glow={['base', 'tray']} />
    <rect x={20} y={286} width={30} height={46} fill={wood} stroke={woodLine} strokeWidth="1.6" />
    <rect x={490} y={286} width={30} height={46} fill={wood} stroke={woodLine} strokeWidth="1.6" />
    <path d="M10 334H530" stroke={P.panelLine} strokeWidth="2" />
    {[396, 426].map(x => <path key={x} d={`M${x} 332h22q6 0 6 -6q0 -5 -8 -6l-12 -2q-8 -2 -8 6Z`} fill="#4f5d69" />)}
    <Callout x={12} y={186} lines={['stable stand']} to={[150, BENCH - 22]} />
    <Callout x={360} y={196} lines={['soft tray']} to={[SX + 36, BENCH - 6]} />
    <Callout x={290} y={294} lines={['feet clear']} />
    <Tag x={440} y={60} text="masses may fall" colour={forceColour} />
  </PhysicsDiagram>
  const b = yAt(15.5)
  return <PhysicsDiagram title="Read the ruler with your eye level with the tape mark and do not add more masses than your teacher says. This lesson prepares you; the real practical is where you do it.">
    <Rig masses={1} length={15.5} glow={['tape']} />
    <Eye x={440} y={b} flip />
    <path d={`M${RX + 22} ${b}H420`} stroke={ink} strokeWidth="1.8" strokeDasharray="6 5" />
    <Tag x={440} y={b + 34} text="eye level" />
    <Tag x={430} y={48} text="do not overload" colour={forceColour} />
    <Lines x={346} y={232} lines={['the real practical is', 'where you do it']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

/* ---------- Section 5: results, graph ---------- */

function Table() {
  const cols = ['Mass (kg)', 'Force (N)', 'Length (cm)', 'Extension (cm)'], colour = [ink, forceColour, ink, eColour]
  const rows = [['0.1', '0.98', '14.0', '2.0'], ['0.2', '1.96', '16.0', '4.0'], ['0.3', '2.94', '18.0', '6.0']]
  const x0 = 20, cw = 125
  return <PhysicsDiagram schematic={false} title="A results table with columns mass in kg, force in N, length in cm and extension in cm. Rows: 0.1 kg, 0.98 N, 14.0 cm, 2.0 cm; 0.2 kg, 1.96 N, 16.0 cm, 4.0 cm; 0.3 kg, 2.94 N, 18.0 cm, 6.0 cm. The natural length is 12.0 cm.">
    <rect x={x0} y={30} width={cw * 4} height={196} rx="14" fill="white" stroke={P.panelLine} strokeWidth="1.8" />
    <rect x={x0} y={30} width={cw * 4} height={46} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.8" />
    {[1, 2, 3].map(i => <path key={i} d={`M${x0 + i * cw} 30V226`} stroke={P.panelLine} strokeWidth="1.5" />)}
    {cols.map((c, i) => <text key={c} x={x0 + cw * i + cw / 2} y={59} textAnchor="middle" fontSize="13" fontWeight="750" fill={colour[i]}>{c}</text>)}
    {rows.map((r, j) => <g key={j}>
      {j === 2 && <rect x={x0 + 4} y={82 + j * 48} width={cw * 4 - 8} height={42} rx="10" fill="#fff6d0" stroke={tapeLine} strokeWidth="1.6" />}
      {j < 2 && <path d={`M${x0} ${126 + j * 48}H${x0 + cw * 4}`} stroke={P.grid} strokeWidth="1.2" />}
      {r.map((c, i) => <text key={i} x={x0 + cw * i + cw / 2} y={109 + j * 48} textAnchor="middle" fontSize="16" fontWeight="700" fill={colour[i]}>{c}</text>)}
    </g>)}
    <text x={270} y={256} textAnchor="middle" fontSize="14" fontWeight="650" fill={muted}>natural length 12.0 cm · units go in the headings</text>
    <text x={270} y={282} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>extension = length − 12.0</text>
  </PhysicsDiagram>
}

const PF: GraphFrame = { x: 70, y: 40, width: 290, height: 200, xMax: 8, yMax: 4 }
function Plot() {
  const s = graphScale(PF)
  return <PhysicsDiagram schematic={false} title="A graph with force in newtons on the vertical axis and extension in centimetres on the horizontal axis. Crosses at 2.0 cm and 0.98 N, 4.0 cm and 1.96 N, 6.0 cm and 2.94 N lie on a straight line through the origin.">
    <GraphAxes frame={PF} xLabel="Extension" xUnit="cm" yLabel="Force" yUnit="N" xTicks={[2, 4, 6, 8]} yTicks={[1, 2, 3, 4]} grid />
    <path d={`M${s.x(0)} ${s.y(0)}L${s.x(7.6)} ${s.y(3.72)}`} stroke={forceColour} strokeWidth="2.6" opacity=".5" />
    {[[2, 0.98], [4, 1.96], [6, 2.94]].map(([x, y]) => <Cross key={x} x={s.x(x)} y={s.y(y)} />)}
    <Lines x={382} y={80} lines={['force on the', 'vertical axis']} size={14} colour={forceColour} />
    <Lines x={382} y={160} lines={['extension', 'across']} size={14} colour={eColour} />
    <Lines x={382} y={222} lines={['one cross', 'per result']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}
const GF2: GraphFrame = { x: 70, y: 40, width: 290, height: 200, xMax: 18, yMax: 8 }
const g2 = graphScale(GF2)
const seven: Pt[] = [[2, 0.98], [4, 1.96], [6, 2.94], [8, 3.92], [10, 4.9], [13, 5.88], [17, 6.86]]
const straight = `M${g2.x(0)} ${g2.y(0)}L${g2.x(10)} ${g2.y(4.9)}`
const curl = `M${g2.x(10)} ${g2.y(4.9)}C${g2.x(11.5)} ${g2.y(5.5)} ${g2.x(13)} ${g2.y(5.88)} ${g2.x(13)} ${g2.y(5.88)}S${g2.x(15.5)} ${g2.y(6.55)} ${g2.x(17)} ${g2.y(6.86)}`
function Points({ read }: { read: boolean }) {
  const [px, py] = g2.pt(10, 4.9)
  return <PhysicsDiagram schematic={false} title={read
    ? 'The straight part through the origin shows that extension is directly proportional to force. Point P, where the line starts to bend, is the limit of proportionality. A steeper straight part means a stiffer spring.'
    : 'Seven crosses: the first five lie on a straight line through the origin, then the last two curve away. Take at least five points before the line curves.'}>
    <GraphAxes frame={GF2} xLabel="Extension" xUnit="cm" yLabel="Force" yUnit="N" xTicks={[3, 6, 9, 12, 15, 18]} yTicks={[2, 4, 6, 8]} grid />
    <path d={straight} stroke={forceColour} strokeWidth="2.8" />
    <path d={curl} stroke={forceColour} strokeWidth="2.8" fill="none" strokeDasharray={read ? undefined : '6 5'} />
    {seven.map(([x, y]) => <Cross key={x} x={g2.x(x)} y={g2.y(y)} />)}
    {!read && <g>
      <path d={`M${g2.x(1.2) - 12} ${g2.y(0.6) - 10}L${g2.x(9.6) - 18} ${g2.y(4.7) - 16}`} stroke={eColour} strokeWidth="2" />
      <path d={`M${g2.x(1.2) - 12} ${g2.y(0.6) - 10}l6 8M${g2.x(9.6) - 18} ${g2.y(4.7) - 16}l6 8`} stroke={eColour} strokeWidth="2" />
      <Lines x={382} y={180} lines={['at least five', 'points before', 'it curves']} size={14} colour={eColour} />
    </g>}
    {read && <g>
      <circle cx={px} cy={py} r="6" fill="white" stroke={ink} strokeWidth="2.4" />
      <text x={px + 8} y={py + 24} fontSize="16" fontWeight="800" fill={ink}>P</text>
      <Lines x={px - 16} y={py - 46} anchor="end" lines={['limit of', 'proportionality']} size={13} />
      <path d={`M${px - 14} ${py - 30}L${px - 5} ${py - 10}`} stroke={ink} strokeWidth="1.4" />
      <Tag x={g2.x(12)} y={g2.y(1.6)} text="directly proportional" colour={eColour} />
    </g>}
    <Lines x={382} y={90} lines={read ? ['steeper =', 'stiffer spring'] : ['draw the line', 'through the', 'origin']} size={14} colour={read ? kColour : ink} />
  </PhysicsDiagram>
}

/* ---------- Section 6: energy stored ---------- */

function EeCard() {
  const b = 196
  return <PhysicsDiagram schematic={false} title="Energy in a stretched spring's elastic potential store: Ee = ½ × k × e². Ee is in joules, J; k is the spring constant in newtons per metre, N/m; e is the extension in metres, m.">
    <Beam x1={20} x2={120} y={40} />
    <HangSpring x={70} top={40} bottom={b} coils={12} width={13} />
    <Holder x={70} y={b + 2} n={2} />
    <EnergyStoreBadge store="elastic" x={326} y={28} />
    <rect x={186} y={52} width={280} height={56} rx="16" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <Spaced y={91} size={26} items={[['Ee', EeColour, 216], ['=', ink, 258], ['½', ink, 290], ['×', ink, 320], ['k', kColour, 350], ['×', ink, 380], ['e²', eColour, 414]]} />
    <UnitBox x={190} y={210} to={[216, 100]} name="energy" unit="joules" symbol="J" colour={EeColour} w={116} />
    <UnitBox x={330} y={210} to={[350, 100]} name="spring constant" unit="newtons per metre" symbol="N/m" colour={kColour} w={152} />
    <UnitBox x={470} y={210} to={[414, 100]} name="extension" unit="metres" symbol="m" colour={eColour} w={116} />
  </PhysicsDiagram>
}
function EeWorked({ step }: { step: 1 | 2 }) {
  const titles = [
    'A spring with k = 200 N/m extends by 5 cm. Convert first: 5 cm ÷ 100 = 0.05 m. Then square: 0.05 × 0.05 = 0.0025.',
    'Ee = ½ × 200 × 0.0025. Half of 200 is 100, and 100 × 0.0025 = 0.25. The energy stored is 0.25 J.',
  ]
  const top = 60, nat = 150, b = 200
  const conv: Piece[] = [['5 cm '], ['÷ 100', eColour], [' = '], ['0.05 m', eColour]]
  return <PhysicsDiagram title={titles[step - 1]}>
    <StepStrip steps={['convert, square', 'answer']} active={step} colour={EeColour} gap={220} />
    <Beam x1={40} x2={170} y={top} />
    <HangSpring x={100} top={top} bottom={b} coils={11} width={13} />
    <Holder x={100} y={b + 2} n={2} />
    <path d={`M80 ${nat}H176`} stroke={muted} strokeWidth="1.5" strokeDasharray="5 5" />
    <path d={`M108 ${b}H176`} stroke={muted} strokeWidth="1.5" strokeDasharray="5 5" />
    <Dim from={[170, nat]} to={[170, b]} label="5 cm" size={14} />
    <Tag x={100} y={284} text="k = 200 N/m" colour={kColour} />
    <rect x={250} y={50} width={280} height={228} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <g opacity={step === 1 ? 1 : 0.55}><Eq x={390} y={88} size={20} pieces={[['Ee', EeColour], [' = ½ × '], ['k', kColour], [' × '], ['e²', eColour]]} /></g>
    {step === 1 && <g>
      <rect x={262} y={106} width={256} height={46} rx="14" fill="#e3f3ec" stroke={eColour} strokeWidth="2" />
      <Eq x={390} y={136} size={18} pieces={conv} />
      <text x={390} y={178} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>then square the extension</text>
      <Eq x={390} y={214} size={18} pieces={[['0.05 × 0.05 = '], ['0.0025', eColour]]} />
    </g>}
    {step === 2 && <g>
      <Eq x={390} y={130} size={19} pieces={[['Ee', EeColour], [' = ½ × '], ['200', kColour], [' × '], ['0.0025', eColour]]} />
      <text x={390} y={162} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>½ × 200 = 100, 100 × 0.0025</text>
      <rect x={306} y={184} width={170} height={50} rx="14" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
      <Spaced y={218} size={24} items={[['Ee', EeColour, 324], ['= 0.25', ink, 394], ['J', ink, 462]]} />
      <Ring x={462} y={210} rx={13} ry={15} />
    </g>}
  </PhysicsDiagram>
}

export function SpringPracVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'springprac-aim': return <Aim />
    case 'springprac-kit': return <Kit />
    case 'springprac-vars': return <Vars />
    case 'springprac-control': return <Control />
    case 'springprac-m1': return <Method step={1} />
    case 'springprac-m2': return <Method step={2} />
    case 'springprac-m3': return <Method step={3} />
    case 'springprac-m4': return <Method step={4} />
    case 'springprac-m5': return <Method step={5} />
    case 'springprac-s1': return <Safety which={1} />
    case 'springprac-s2': return <Safety which={2} />
    case 'springprac-s3': return <Safety which={3} />
    case 'springprac-table': return <Table />
    case 'springprac-plot': return <Plot />
    case 'springprac-points': return <Points read={false} />
    case 'springprac-read': return <Points read />
    case 'springprac-ee': return <EeCard />
    case 'springprac-ee2': return <EeWorked step={1} />
    case 'springprac-ee3': return <EeWorked step={2} />
    default: return null
  }
}
