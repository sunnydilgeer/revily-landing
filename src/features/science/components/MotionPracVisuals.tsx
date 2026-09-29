import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, type Pt } from './PhysicsKit'
import { ink, muted, wood, woodLine, metal, metalLine, Caption, Tag, Arrow, Floor, Hand, Tick, CrossMark, Eq } from './EnergyStoreVisuals'
import { mo, Force, Note, DataTable, tw } from './VtGraphVisuals'
import { Trolley, Accel } from './NewtonLawVisuals'

/*
 * Physics Lesson 49: Investigating motion (required practical: force, mass and acceleration).
 * Original, code-native schematics; not to scale. Every focus id here starts with 'motionprac-'.
 *
 * One shared bench scene for the method sections: a trolley with a card on top, string over a pulley at the bench
 * edge to a hook with slotted masses, a light gate (an arch over the track) cabled to a data logger, and a starting
 * line. Frames fade, highlight or add parts. Masses are the motion-kit mass blue, forces violet, acceleration amber.
 */

const B = 200, PX = 452, PY = 188, PR = 12, SY = PY - PR, GX = 320, LINE = 70
const chalk = '#8fa4b3'
type Part = 'trolley' | 'hook' | 'gate' | 'logger' | 'line' | 'string'

/** A hook with `n` slotted masses; (x, y) is the top of the hook. */
function Hook({ x, y, n = 3, hot = false }: { x: number; y: number; n?: number; hot?: boolean }) {
  return <g>
    <path d={`M${x} ${y - 4}q-7 0 -7 6t7 6V${y + 12 + n * 10}`} stroke={metalLine} strokeWidth="2.4" fill="none" />
    {Array.from({ length: n }, (_, i) => <rect key={i} x={x - 16} y={y + 12 + i * 10} width={32} height={9} rx="3" fill={hot ? mo.massFill : '#e8eef3'} stroke={hot ? mo.mass : metalLine} strokeWidth="1.8" />)}
    <rect x={x - 12} y={y + 12 + n * 10} width={24} height={5} rx="2" fill={metal} stroke={metalLine} strokeWidth="1.6" />
  </g>
}
const hookBottom = (top: number, n: number) => top + 17 + n * 10

/** The bench scene. `dim` fades parts; `load` stacks masses on the trolley; `hookN` masses hang on the hook. */
function Bench({ tx = LINE + 44, load = 0, hookN = 3, dim = [], hide = [], hotMass = false, children, under }: { tx?: number; load?: number; hookN?: number; dim?: Part[]; hide?: Part[]; hotMass?: boolean; children?: ReactNode; under?: ReactNode }) {
  const o = (p: Part) => dim.includes(p) ? 0.28 : 1, show = (p: Part) => !hide.includes(p)
  const hookTop = 226
  return <g>
    {under}
    {/* bench */}
    <rect x={14} y={B} width={428} height={14} rx="3" fill={wood} stroke={woodLine} strokeWidth="2" />
    <path d={`M40 ${B + 14}V292M416 ${B + 14}V292`} stroke={woodLine} strokeWidth="8" />
    <path d={`M40 ${B + 14}V292M416 ${B + 14}V292`} stroke={wood} strokeWidth="4.5" />
    {/* pulley and clamp */}
    <path d={`M436 ${B + 14}H${PX}V${PY}`} stroke={metalLine} strokeWidth="4" fill="none" />
    <circle cx={PX} cy={PY} r={PR} fill={metal} stroke={metalLine} strokeWidth="2.2" /><circle cx={PX} cy={PY} r="3" fill={metalLine} />
    {show('line') && <g opacity={o('line')}><path d={`M${LINE} 150V${B + 14}`} stroke={P.hot} strokeWidth="2.6" strokeDasharray="5 4" /></g>}
    {show('gate') && <g opacity={o('gate')}>
      <path d={`M${GX - 16} ${B}V126H${GX + 16}V${B}`} stroke={P.ink} strokeWidth="5" fill="none" />
      <path d={`M${GX - 13} 146H${GX + 13}`} stroke={P.hot} strokeWidth="1.6" strokeDasharray="3 3" opacity=".8" />
    </g>}
    {show('logger') && <g opacity={o('logger')}>
      <path d={`M${GX} 126Q${GX} 90 280 76`} stroke={P.ink} strokeWidth="2" fill="none" />
      <rect x={178} y={26} width={104} height={54} rx="8" fill={P.panel} stroke={P.ink} strokeWidth="2" />
      <rect x={188} y={34} width={84} height={26} rx="4" fill="#e6f2ea" stroke={P.ink} strokeWidth="1.4" />
    </g>}
    {show('string') && <g opacity={o('string')}>
      <path d={`M${tx + 44} ${SY}H${PX}`} stroke={ink} strokeWidth="1.8" />
      <path d={`M${PX + PR} ${PY}V${hookTop - 4}`} stroke={ink} strokeWidth="1.8" />
    </g>}
    {show('trolley') && <g opacity={o('trolley')}>
      <rect x={tx + 31} y={134} width={6} height={27} rx="1.5" fill="#fff6d6" stroke={P.lightLine} strokeWidth="1.6" />
      <Trolley x={tx} y={B} load={load} />
    </g>}
    {show('hook') && <g opacity={o('hook')}><Hook x={PX + PR} y={hookTop} n={hookN} hot={hotMass} /></g>}
    {children}
  </g>
}
/** A label with a leader line to a point. */
function Label({ at, to, text, anchor = 'middle', colour = ink }: { at: Pt; to: Pt; text: string; anchor?: 'start' | 'middle' | 'end'; colour?: string }) {
  return <g>
    <path d={`M${to[0]} ${to[1]}L${at[0]} ${at[1] + (to[1] > at[1] ? 5 : -14)}`} stroke={colour} strokeWidth="1.3" />
    <circle cx={to[0]} cy={to[1]} r="2.6" fill={colour} />
    <text x={at[0]} y={at[1]} textAnchor={anchor} fontSize="13" fontWeight="700" fill={colour} stroke="white" strokeWidth="4" paintOrder="stroke">{text}</text>
  </g>
}
function Halo({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect x={x} y={y} width={w} height={h} rx="14" fill={mo.massFill} fillOpacity=".55" stroke={mo.mass} strokeWidth="1.8" strokeDasharray="6 4" />
}
function Balance({ x, y }: { x: number; y: number }) {
  return <g>
    <rect x={x - 34} y={y - 8} width={68} height={8} rx="4" fill="#dbe6ee" stroke={muted} strokeWidth="1.6" />
    <rect x={x - 40} y={y} width={80} height={26} rx="6" fill={P.panel} stroke={muted} strokeWidth="1.8" />
    <rect x={x - 24} y={y + 6} width={48} height={14} rx="3" fill="white" stroke={muted} strokeWidth="1.2" />
    <text x={x} y={y + 17} textAnchor="middle" fontSize="12" fontWeight="700" fill={ink}>g</text>
  </g>
}
function Stopwatch({ x, y, r = 20 }: { x: number; y: number; r?: number }) {
  return <g>
    <rect x={x - 4} y={y - r - 8} width="8" height="7" rx="2" fill={P.panel} stroke={ink} strokeWidth="1.6" />
    <circle cx={x} cy={y} r={r} fill={P.panel} stroke={ink} strokeWidth="2" />
    <path d={`M${x} ${y}V${y - r + 6}M${x} ${y}L${x + 8} ${y + 4}`} stroke={ink} strokeWidth="2" />
  </g>
}

/* ---------- Section 2: the aim, the kit, mass and force ---------- */

function Kit({ focus }: { focus: string }) {
  if (focus === 'motionprac-aim') return <PhysicsDiagram title="The practical set-up: a trolley on a bench pulled by a falling hook with masses. Two cards: change the mass, pointing at the trolley, and change the force, pointing at the hook. Your teacher runs this in the lab.">
    <Bench />
    <Label at={[114, 118]} to={[114, 164]} text="change the mass" colour={mo.mass} />
    <Label at={[500, 132]} to={[472, 244]} text="change the force" colour={mo.resultant} anchor="end" />
    <Tag x={400} y={40} text="your teacher runs this in the lab" colour={muted} size={12} />
  </PhysicsDiagram>
  if (focus === 'motionprac-kit') return <PhysicsDiagram title="The equipment with labels: trolley, card, string, pulley, hook and masses, light gate, data logger and starting line.">
    <Bench />
    <Label at={[114, 250]} to={[114, 186]} text="trolley" />
    <Label at={[196, 150]} to={[151, 142]} text="card" anchor="start" />
    <Label at={[380, 150]} to={[380, 176]} text="string" />
    <Label at={[500, 150]} to={[PX + 6, PY - 6]} text="pulley" anchor="end" />
    <Label at={[430, 262]} to={[448, 256]} text="hook and masses" anchor="end" />
    <Label at={[380, 110]} to={[GX + 16, 132]} text="light gate" anchor="start" />
    <Label at={[230, 108]} to={[230, 80]} text="data logger" />
    <Label at={[64, 118]} to={[LINE, 152]} text="starting line" />
  </PhysicsDiagram>
  if (focus === 'motionprac-mass') return <PhysicsDiagram title="The trolley, the hook and the masses are tinted together: they all move, so their total mass is the mass being accelerated. A mass balance measures each one.">
    <Bench dim={['gate', 'logger', 'line']} hotMass under={<g>
      <Halo x={62} y={126} w={104} h={80} />
      <Halo x={440} y={214} w={48} h={70} />
    </g>} />
    <Note x={290} y={228} w={200} size={13} lines={['total mass being', 'accelerated = trolley', '+ hook + masses']} colour={mo.mass} fill="white" line={mo.mass} />
    <Balance x={110} y={244} />
    <text x={110} y={290} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>mass balance</text>
  </PhysicsDiagram>
  if (focus === 'motionprac-force') return <PhysicsDiagram title="Only the hook and masses are highlighted, with a down arrow: the weight of the hook and masses is the force that accelerates the trolley. W equals m g. The trolley is faded.">
    <Bench dim={['trolley', 'gate', 'logger', 'line', 'string']} hotMass />
    <Force from={[505, 222]} to={[505, 292]} colour={mo.resultant} width={6} />
    <text x={530} y={124} textAnchor="end" fontSize="13" fontWeight="700" fill={mo.resultant}><tspan x={530}>weight of hook and masses</tspan><tspan x={530} dy={17}>= the force</tspan></text>
    <Note x={210} y={40} w={170} size={16} lines={['W = m g']} colour={mo.resultant} fill={mo.resultantFill} line={mo.resultant} />
    <text x={210} y={104} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>g = 9.8 N/kg</text>
  </PhysicsDiagram>
  // motionprac-w
  return <PhysicsDiagram title="Worked example: the hook and masses are 100 g, which is 0.10 kg. Weight equals 0.10 times 9.8, which is 0.98 N.">
    <rect x={30} y={40} width={300} height={200} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <Eq x={180} y={88} size={20} pieces={[['100 g = '], ['0.10 kg', mo.mass]]} />
    <text x={180} y={112} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>grams to kilograms first (÷ 1000)</text>
    <Eq x={180} y={156} size={20} pieces={[['W', mo.resultant], [' = '], ['0.10', mo.mass], [' × 9.8']]} />
    <rect x={96} y={180} width={168} height={42} rx="12" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <Eq x={180} y={208} size={20} pieces={[['W', mo.resultant], [' = 0.98 N']]} />
    <path d="M420 30V70" stroke={ink} strokeWidth="1.8" />
    <g transform="translate(0 -150)"><Hook x={420} y={226} n={4} hot /></g>
    <Tag x={372} y={106} text="100 g" colour={mo.mass} />
    <Force from={[420, 142]} to={[420, 212]} colour={mo.resultant} label="W = 0.98 N" at="end" width={5} />
  </PhysicsDiagram>
}

/* ---------- Section 3: the method ---------- */

function Method({ focus }: { focus: string }) {
  if (focus === 'motionprac-setup') return <PhysicsDiagram title="The set-up with the starting line highlighted. An arrow from the line to the light gate: the same distance to the light gate every time.">
    <Bench dim={['logger']} />
    <path d={`M${LINE} 150V${B + 14}`} stroke={P.hot} strokeWidth="4" />
    <path d={`M${LINE} 108H${GX}`} stroke={ink} strokeWidth="1.8" strokeDasharray="4 4" />
    <Arrow from={[LINE + 20, 108]} to={[LINE, 108]} colour={ink} width={2} />
    <Arrow from={[GX - 20, 108]} to={[GX, 108]} colour={ink} width={2} />
    <Tag x={195} y={84} text="same distance every time" colour={P.hot} />
    <Tag x={LINE} y={132} text="start" colour={P.hot} size={12} />
  </PhysicsDiagram>
  if (focus === 'motionprac-release') return <PhysicsDiagram title="A hand holds the trolley on the starting line with the string tight and not touching the table. Then let go.">
    <Bench dim={['logger', 'gate']} />
    <Hand x={52} y={172} s={0.9} />
    <Tick x={356} y={110} />
    <text x={374} y={106} fontSize="13" fontWeight="700" fill={P.useful}>string tight,</text>
    <text x={374} y={122} fontSize="13" fontWeight="700" fill={P.useful}>not touching the table</text>
    <path d="M400 130L400 174" stroke={P.useful} strokeWidth="1.4" />
    <Tag x={114} y={110} text="hold, then let go" colour={ink} />
  </PhysicsDiagram>
  if (focus === 'motionprac-record') return <PhysicsDiagram title="The trolley passes through the light gate. The data logger shows the acceleration. Repeat for each change.">
    <Bench tx={GX} dim={['line']} />
    <path d="M196 170H262" stroke={muted} strokeWidth="2.4" opacity=".6" />
    <path d="M210 182H262" stroke={muted} strokeWidth="2.4" opacity=".6" />
    <text x={170} y={52} textAnchor="end" fontSize="13" fontWeight="700" fill={ink}>acceleration</text>
    <text x={230} y={53} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>_ . _ m/s²</text>
    <Tag x={400} y={40} text="record it" colour={mo.accel} />
    <Tag x={400} y={76} text="repeat for each change" colour={muted} size={12} />
  </PhysicsDiagram>
  if (focus === 'motionprac-alt') return <PhysicsDiagram title="No light gate: chalk lines on the bench and a stopwatch to time the trolley between them.">
    <Bench hide={['gate', 'logger']} dim={['line']}>
      {[180, 250, 320, 390].map(x => <path key={x} d={`M${x} 190V${B + 14}`} stroke={chalk} strokeWidth="3" />)}
      {[180, 250, 320, 390].map(x => <path key={`t${x}`} d={`M${x} 190V${B}`} stroke="white" strokeWidth="1" opacity=".5" />)}
    </Bench>
    <Tag x={180} y={40} text="no light gate" colour={ink} />
    <Stopwatch x={300} y={100} />
    <Label at={[380, 150]} to={[320, 194]} text="chalk lines" anchor="start" colour={muted} />
    <text x={330} y={105} fontSize="13" fontWeight="700" fill={ink}>time between lines</text>
  </PhysicsDiagram>
  // motionprac-safety
  return <PhysicsDiagram title="Safety: a box under the hook and masses to catch them, feet kept clear, and a stop block at the end of the track before the pulley.">
    <Bench dim={['gate', 'logger', 'line', 'trolley']}>
      <rect x={410} y={188} width={14} height={12} rx="2" fill={P.hot} stroke="#a33b2b" strokeWidth="1.6" />
      <path d="M440 262H492L488 292H444Z" fill={wood} stroke={woodLine} strokeWidth="2" />
    </Bench>
    <Label at={[360, 150]} to={[416, 190]} text="stop block" anchor="end" colour={P.hot} />
    <Label at={[520, 236]} to={[488, 272]} text="box" anchor="end" colour={woodLine} />
    <g transform="translate(270 292)">
      {[-34, 4].map(dx => <path key={dx} d={`M${dx} -2H${dx + 34}Q${dx + 36} -12 ${dx + 26} -14L${dx + 14} -16Q${dx + 10} -24 ${dx + 2} -24H${dx}Z`} fill="#6b7f92" stroke="#3f4e5b" strokeWidth="1.6" />)}
    </g>
    <Tick x={320} y={270} s={0.9} />
    <text x={270} y={256} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.useful}>feet clear</text>
    <Tag x={150} y={40} text="masses can fall on feet" colour={P.hot} />
  </PhysicsDiagram>
}

/* ---------- Sections 4 and 5: changing mass, changing force ---------- */

function Twin({ light, heavy, big: top, small: bottom, note }: { light: ReactNode; heavy: ReactNode; big: number; small: number; note: string }) {
  return <g>
    <Floor x1={20} x2={520} y={120} />
    <Floor x1={20} x2={520} y={250} />
    {light}{heavy}
    <Accel x={290} y={92} len={top} />
    <Accel x={290} y={222} len={bottom} />
    <Caption text={note} y={288} colour={mo.accel} />
  </g>
}
function Changes({ focus }: { focus: string }) {
  if (focus === 'motionprac-mass1') return <PhysicsDiagram title="Investigating mass: a bracket over the trolley says mass changes. A label beside the hook says force stays the same.">
    <Bench dim={['logger']} />
    <path d="M62 112V102H166V112" stroke={mo.mass} strokeWidth="2.4" fill="none" />
    <Tag x={114} y={84} text="mass changes" colour={mo.mass} />
    <Tag x={410} y={236} text="force stays the same" colour={mo.resultant} />
  </PhysicsDiagram>
  if (focus === 'motionprac-mass2') return <PhysicsDiagram title="An extra mass heading for the hook is crossed out: do not add masses to the hook, because that would change the force.">
    <Bench dim={['logger', 'gate', 'line']} />
    <rect x={494} y={150} width={32} height={9} rx="3" fill={mo.massFill} stroke={mo.mass} strokeWidth="1.8" />
    <Arrow from={[510, 168]} to={[494, 222]} colour={mo.mass} width={2.4} />
    <CrossMark x={514} y={196} />
    <Note x={290} y={236} w={230} size={13} lines={['do not add masses', 'to the hook']} colour={P.hot} fill={P.hotFill} line={P.hot} />
  </PhysicsDiagram>
  if (focus === 'motionprac-mass3') return <PhysicsDiagram title="Masses are added to the trolley one at a time: a small stack grows, numbered 1, 2 and 3.">
    <Bench dim={['logger', 'gate', 'line']} load={3} />
    {[[100, 156], [128, 156], [100, 140]].map(([x, y], i) => <text key={i} x={x} y={y} textAnchor="middle" fontSize="12" fontWeight="800" fill={mo.mass}>{i + 1}</text>)}
    <rect x={140} y={70} width={24} height={15} rx="3" fill={mo.massFill} stroke={mo.mass} strokeWidth="1.8" />
    <text x={152} y={82} textAnchor="middle" fontSize="12" fontWeight="800" fill={mo.mass}>4</text>
    <Arrow from={[152, 92]} to={[140, 116]} colour={mo.mass} width={2.2} />
    <Tag x={330} y={60} text="add one at a time" colour={mo.mass} />
    <Tag x={330} y={94} text="record the acceleration each time" colour={muted} size={12} />
  </PhysicsDiagram>
  if (focus === 'motionprac-mass4') return <PhysicsDiagram title="A light trolley has a long acceleration arrow. A loaded trolley has a short one. More mass, less acceleration.">
    <Twin big={150} small={60} note="more mass, less acceleration"
      light={<g><Trolley x={200} y={120} /><text x={60} y={96} fontSize="13" fontWeight="700" fill={mo.mass}>light</text></g>}
      heavy={<g><Trolley x={200} y={250} load={4} /><text x={60} y={226} fontSize="13" fontWeight="700" fill={mo.mass}>loaded</text></g>} />
  </PhysicsDiagram>
  if (focus === 'motionprac-force1') return <PhysicsDiagram title="Investigating force: total mass stays the same over the whole system, and force changes at the hook.">
    <Bench dim={['logger']} load={2} />
    <rect x={56} y={100} width={450} height={196} rx="18" fill="none" stroke={mo.mass} strokeWidth="2" strokeDasharray="7 6" />
    <Tag x={200} y={100} text="total mass stays the same" colour={mo.mass} />
    <Tag x={380} y={262} text="force changes" colour={mo.resultant} />
  </PhysicsDiagram>
  if (focus === 'motionprac-force2') return <PhysicsDiagram title="Start with all the extra masses stacked on the trolley. The hook has only its own mass.">
    <Bench dim={['logger', 'gate', 'line']} load={4} hookN={0} />
    <Tag x={114} y={80} text="all extra masses on the trolley" colour={mo.mass} />
    <Tag x={400} y={286} text="hook only" colour={mo.resultant} />
  </PhysicsDiagram>
  if (focus === 'motionprac-force3') return <PhysicsDiagram title="A mass is lifted from the trolley and moved to the hook, shown by a curved arrow. A second one waits, faded. Move one at a time.">
    <Bench hide={['logger']} dim={['gate', 'line']} load={3} hookN={1} />
    <path d="M140 118Q520 0 500 226" stroke={mo.mass} strokeWidth="2.4" fill="none" strokeDasharray="6 4" />
    <Arrow from={[500, 222]} to={[486, 240]} colour={mo.mass} width={2.4} />
    <rect x={408} y={78} width={24} height={15} rx="3" fill={mo.massFill} stroke={mo.mass} strokeWidth="1.8" />
    <Tag x={296} y={26} text="move, one at a time" colour={mo.mass} />
    <Note x={250} y={228} w={170} size={13} lines={['same total mass,', 'bigger force']} colour={mo.resultant} fill="white" line={mo.resultant} />
  </PhysicsDiagram>
  if (focus === 'motionprac-force4') return <PhysicsDiagram title="A results table with two columns, force in newtons and acceleration in metres per second squared, with three empty rows to fill in.">
    <DataTable x={120} y={40} cols={[150, 150]} rowH={44} size={15} rows={[['force (N)', 'acceleration\n(m/s²)'], ['', ''], ['', ''], ['', '']]} />
    <Caption text="One row for each force." y={286} />
  </PhysicsDiagram>
  // motionprac-force5
  return <PhysicsDiagram title="Two trolleys: one pulled by a small hook weight has a short acceleration arrow; one pulled by a big hook weight has a long acceleration arrow. More force, more acceleration.">
    <Twin big={60} small={150} note="more force, more acceleration"
      light={<g><Trolley x={200} y={120} /><Force from={[126, 92]} to={[156, 92]} colour={mo.resultant} label="small force" at="start" /></g>}
      heavy={<g><Trolley x={200} y={250} /><Force from={[86, 222]} to={[156, 222]} colour={mo.resultant} label="big force" at="start" /></g>} />
  </PhysicsDiagram>
}

/* ---------- Question: results table only ---------- */

function QuestionTable() {
  return <PhysicsDiagram title="A results table: total mass 0.5 kg, acceleration 2.0 metres per second squared; 1.0 kg, 1.0; 1.5 kg, 0.7." schematic={false}>
    <DataTable x={110} y={50} cols={[160, 160]} rowH={46} size={17} rows={[['total mass (kg)', 'acceleration\n(m/s²)'], ['0.5', '2.0'], ['1.0', '1.0'], ['1.5', '0.7']]} />
  </PhysicsDiagram>
}

export function MotionPracVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment; void tw
  if (['motionprac-aim', 'motionprac-kit', 'motionprac-mass', 'motionprac-force', 'motionprac-w'].includes(focus)) return <Kit focus={focus} />
  if (['motionprac-setup', 'motionprac-release', 'motionprac-record', 'motionprac-alt', 'motionprac-safety'].includes(focus)) return <Method focus={focus} />
  if (/^motionprac-(mass|force)[1-5]$/.test(focus)) return <Changes focus={focus} />
  if (focus === 'motionprac-q-table') return <QuestionTable />
  return null
}
