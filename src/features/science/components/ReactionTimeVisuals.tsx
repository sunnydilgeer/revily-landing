import { physicsPalette as P, PhysicsDiagram, Lines } from './PhysicsKit'
import { Person, Ball, Hand, Tick, CrossMark, Num, Tag, Card, skin, skinLine, shirt, shirtLine, wood, woodLine } from './EnergyStoreVisuals'
import { Arrow } from './GasParticleVisuals'
import { Stopwatch } from './PowerVisuals'

/*
 * Physics Lesson 52: Reaction times. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'rtime-' and is routed from CellBiologyVisuals.tsx.
 *
 * One ruler-drop drawing is reused through the method: an arm resting on a table, the hand just past the edge with
 * the thumb in front of a hanging ruler and the finger behind it. The ruler's zero is at its bottom end, level with
 * the top of the finger, and the numbers go up the ruler, so the reading at the fingers is the distance it fell.
 * Time is teal-free: reaction time is shown in the violet used for time-like quantities in the step strip; the
 * distance fallen is always a vermilion double arrow.
 */
const { ink, muted } = P
const dist = P.current, time = P.pd
const rulerFill = '#fbeec4', rulerLine = '#b68d3c', clay = '#e79a86', clayLine = '#b25f4b'
const CM = 5 // pixels per centimetre on the ruler

/* ---------- The ruler and the hands ---------- */

/** A 30 cm ruler hanging upright, face on. (x, zeroY) is its zero mark; the numbers go up its right-hand side. */
function Ruler({ x, zeroY, cm = CM, length = 30, clayBlob = false, tilt = 0, labelsEvery = 5 }: { x: number; zeroY: number; cm?: number; length?: number; clayBlob?: boolean; tilt?: number; labelsEvery?: number }) {
  const w = 30, bottom = zeroY + 6, top = zeroY - length * cm - 6
  return <g transform={tilt ? `rotate(${tilt} ${x} ${(top + bottom) / 2})` : undefined}>
    <rect x={x - w / 2} y={top} width={w} height={bottom - top} rx="3" fill={rulerFill} stroke={rulerLine} strokeWidth="1.8" />
    {Array.from({ length: length + 1 }, (_, i) => {
      const y = zeroY - i * cm, big = i % 5 === 0
      return <path key={i} d={`M${x - w / 2} ${y}h${big ? 9 : 5}`} stroke={rulerLine} strokeWidth={big ? 1.6 : 1} />
    })}
    {Array.from({ length: Math.floor(length / labelsEvery) + 1 }, (_, k) => k * labelsEvery).map(v => <text key={v} x={x + 5} y={zeroY - v * cm + 4.5} textAnchor="middle" fontSize="12" fontWeight="700" fill="#7d5d1f">{v}</text>)}
    {clayBlob && <path d={`M${x - 15} ${bottom - 2}Q${x - 18} ${bottom + 16} ${x} ${bottom + 17}Q${x + 18} ${bottom + 16} ${x + 15} ${bottom - 2}Z`} fill={clay} stroke={clayLine} strokeWidth="1.8" />}
  </g>
}

/*
 * The catcher's hand, seen from the side like a handshake: the index finger is behind the ruler and the thumb in
 * front of it. Local origin: the middle of the ruler at the top edge of the finger (the zero level).
 */
function HandBack({ x, y, closed, arm }: { x: number; y: number; closed: boolean; arm: 'table' | 'stub' }) {
  const tip = closed ? 18 : 26
  const armStart = arm === 'table' ? -236 : -104
  return <g transform={`translate(${x} ${y})`}>
    {arm === 'table' && <g>
      <path d="M-250 26H-52V42H-250Z" fill={wood} stroke={woodLine} strokeWidth="2" />
      <path d="M-76 42V96M-226 42V96" stroke={woodLine} strokeWidth="5" />
    </g>}
    {/* forearm (and sleeve when on the table) */}
    <path d={`M${armStart} 26V2Q${armStart} -4 ${armStart + 8} -4H-44Q-34 4 -40 26Z`} fill={skin} stroke={skinLine} strokeWidth="1.8" />
    {arm === 'table' && <path d={`M${armStart} 26V2Q${armStart} -4 ${armStart + 8} -4H-160V26Z`} fill={shirt} stroke={shirtLine} strokeWidth="1.8" />}
    {/* palm and the curled fingers under the index finger */}
    <path d="M-52 -6Q-36 -14 -22 -8L-14 2Q-8 14 -16 24Q-30 30 -52 26Z" fill={skin} stroke={skinLine} strokeWidth="1.8" />
    <ellipse cx="-10" cy="17" rx="9" ry="6.5" fill={skin} stroke={skinLine} strokeWidth="1.6" />
    {/* index finger, behind the ruler */}
    <path d={`M-24 0H${tip - 5}Q${tip} 0 ${tip} 5Q${tip} 10 ${tip - 5} 10H-24Z`} fill={skin} stroke={skinLine} strokeWidth="1.8" />
  </g>
}
function HandFront({ x, y, closed }: { x: number; y: number; closed: boolean }) {
  const t = closed ? 2 : -24
  return <g transform={`translate(${x} ${y})`}>
    <path d={`M-44 -3Q-32 -13 ${t - 6} -9Q${t} -8 ${t} -2Q${t} 4 ${t - 6} 4Q-30 7 -44 8Z`} fill={skin} stroke={skinLine} strokeWidth="1.8" />
    <path d={`M${t - 5} -7Q${t - 1} -6 ${t - 1} -2`} stroke={skinLine} strokeWidth="1.2" fill="none" opacity=".7" />
  </g>
}
/** The helper's hand at the top of the ruler: gripping it, or opened and pulled away. */
function HelperHand({ x, y, open }: { x: number; y: number; open: boolean }) {
  return open
    ? <g opacity=".85"><Hand x={x + 64} y={y - 20} rotate={200} s={0.95} /></g>
    : <Hand x={x + 32} y={y} rotate={180} s={0.95} />
}

type Stage = 'setup' | 'drop' | 'catch'
/** The whole ruler-drop scene. `fallen` is the reading in cm when caught (the distance the ruler fell). */
function DropScene({ stage, x, y, fallen = 15 }: { stage: Stage; x: number; y: number; fallen?: number }) {
  const shift = stage === 'catch' ? fallen * CM : stage === 'drop' ? 4 * CM : 0
  const topY = y - 30 * CM - 6
  return <g>
    <HandBack x={x} y={y} closed={stage === 'catch'} arm="table" />
    <Ruler x={x} zeroY={y + shift} />
    <HandFront x={x} y={y} closed={stage === 'catch'} />
    {stage !== 'catch' && <HelperHand x={x} y={topY + 18} open={stage === 'drop'} />}
  </g>
}

/** A vertical double arrow (distance fallen) with a label to the side. */
function Span({ x, y1, y2, label, side = 'right', colour = dist }: { x: number; y1: number; y2: number; label?: string[]; side?: 'left' | 'right'; colour?: string }) {
  return <g>
    <path d={`M${x - 8} ${y1}h16M${x - 8} ${y2}h16`} stroke={colour} strokeWidth="2" />
    <Arrow from={[x, (y1 + y2) / 2]} to={[x, y1 + 1]} colour={colour} width={2.4} />
    <Arrow from={[x, (y1 + y2) / 2]} to={[x, y2 - 1]} colour={colour} width={2.4} />
    {label && <Lines x={side === 'right' ? x + 14 : x - 14} y={(y1 + y2) / 2 - (label.length - 1) * 8 + 5} anchor={side === 'right' ? 'start' : 'end'} lines={label} size={14} colour={colour} />}
  </g>
}

/** The step strip at the right of the method drawings. */
const STEPS = ['arm on the table', 'ruler dropped', 'catch it', 'read the ruler']
function Steps({ active, x = 380, y = 70 }: { active: number; x?: number; y?: number }) {
  return <g>{STEPS.map((s, i) => <g key={s}>
    <Num n={i + 1} x={x} y={y + i * 44} state={i === active ? 'active' : i < active ? 'on' : 'off'} />
    <text x={x + 20} y={y + i * 44 + 5} fontSize="14" fontWeight={i === active ? 750 : 600} fill={ink} opacity={i > active ? 0.42 : 1}>{s}</text>
  </g>)}</g>
}

/* ---------- Section 2: what reaction time is ---------- */

function Idea() {
  return <PhysicsDiagram title="A ball is thrown towards a person. The time between the ball being thrown and the person's hands moving is the reaction time, typically 0.2 to 0.9 seconds.">
    <Person x={440} y={176} s={1.25} arms={[[[-14, -58], [-24, -90]], [[14, -58], [24, -90]]]} />
    <Ball x={120} y={70} r={14} />
    <path d="M140 72Q280 50 400 80" stroke={muted} strokeWidth="2" strokeDasharray="5 7" fill="none" />
    <Arrow from={[372, 72]} to={[398, 80]} colour={muted} width={2} />
    {/* timeline */}
    <path d="M60 226H480" stroke={P.panelLine} strokeWidth="4" />
    <circle cx={120} cy={226} r="8" fill="white" stroke={ink} strokeWidth="2.4" />
    <circle cx={330} cy={226} r="8" fill={ink} />
    <Lines x={120} y={206} anchor="middle" lines={['ball thrown']} size={13} />
    <Lines x={330} y={206} anchor="middle" lines={['hands move']} size={13} />
    <path d={`M128 250H322`} stroke={time} strokeWidth="2.4" />
    <path d="M128 243V257M322 243V257" stroke={time} strokeWidth="2.4" />
    <Lines x={225} y={276} anchor="middle" lines={['reaction time']} size={15} colour={time} />
    <Lines x={470} y={262} anchor="end" lines={['typically', '0.2 to 0.9 s']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

function StopwatchIdea() {
  return <PhysicsDiagram title="Timing a reaction with a stopwatch: your own delay in pressing the button is about as long as the reaction time you are trying to measure, so the result is poor.">
    <Stopwatch x={130} y={160} r={62} frac={0.3} />
    <Hand x={130} y={62} rotate={90} s={1.1} />
    <Lines x={300} y={78} lines={['time to measure']} size={14} colour={time} />
    <rect x={300} y={90} width={160} height={20} rx="10" fill={P.pdFill} stroke={time} strokeWidth="2" />
    <Lines x={300} y={146} lines={['your delay pressing']} size={14} colour={P.wasted} />
    <rect x={300} y={158} width={146} height={20} rx="10" fill={P.wastedFill} stroke={P.wasted} strokeWidth="2" />
    <Lines x={300} y={218} lines={['about the same size,', 'so the result is poor']} size={14} />
    <CrossMark x={486} y={132} s={1.2} />
  </PhysicsDiagram>
}

function Laptop({ x, y, screen }: { x: number; y: number; screen: string }) {
  return <g>
    <rect x={x - 70} y={y - 92} width={140} height={90} rx="8" fill="#e9eef2" stroke="#6f8494" strokeWidth="2.2" />
    <rect x={x - 60} y={y - 83} width={120} height={72} rx="4" fill={screen} stroke="#9fb0bd" strokeWidth="1.4" />
    <path d={`M${x - 86} ${y}H${x + 86}L${x + 76} ${y + 10}H${x - 76}Z`} fill="#dfe6eb" stroke="#6f8494" strokeWidth="2" />
  </g>
}
function Mouse({ x, y, clicked = false }: { x: number; y: number; clicked?: boolean }) {
  return <g>
    <path d={`M${x} ${y - 18}Q${x + 14} ${y - 18} ${x + 14} ${y}Q${x + 14} ${y + 16} ${x} ${y + 16}Q${x - 14} ${y + 16} ${x - 14} ${y}Q${x - 14} ${y - 18} ${x} ${y - 18}Z`} fill="white" stroke="#6f8494" strokeWidth="2" />
    <path d={`M${x} ${y - 18}V${y - 4}M${x - 14} ${y - 4}H${x + 14}`} stroke="#6f8494" strokeWidth="1.6" />
    {clicked && <path d={`M${x - 14} ${y - 4}V${y - 4}Q${x - 14} ${y - 18} ${x} ${y - 18}V${y - 4}Z`} fill={P.usefulFill} stroke={P.useful} strokeWidth="1.6" />}
  </g>
}
function Computer() {
  return <PhysicsDiagram title="A computer-based test: the screen changes from white to green and you click the mouse as fast as you can. The computer measures the time in between.">
    <Laptop x={110} y={170} screen="white" />
    <Lines x={110} y={210} anchor="middle" lines={['wait…']} size={14} colour={muted} />
    <Arrow from={[206, 124]} to={[266, 124]} colour={ink} width={2.6} />
    <Laptop x={360} y={170} screen={P.usefulFill} />
    <Mouse x={476} y={150} clicked />
    <Tick x={476} y={104} />
    <Lines x={360} y={210} anchor="middle" lines={['colour changes: click!']} size={14} colour={P.useful} />
    <Lines x={270} y={264} anchor="middle" lines={['the computer measures the time in between']} size={14} />
  </PhysicsDiagram>
}

/* ---------- Section 3: the ruler drop test ---------- */

const SX = 240
function Setup() {
  const x = SX, y = 190
  return <PhysicsDiagram title="Getting ready for the ruler drop test: the arm rests on the table, the thumb and finger are open, and a helper holds the ruler with its zero level with the finger.">
    <DropScene stage="setup" x={x} y={y} />
    <path d={`M${x - 20} ${y}H${x + 40}`} stroke={dist} strokeWidth="1.8" strokeDasharray="5 4" />
    <Lines x={x + 30} y={y + 38} lines={['zero level', 'with finger']} size={13} colour={dist} />
    <path d={`M${x + 36} ${y + 24}L${x + 34} ${y + 3}`} stroke={dist} strokeWidth="1.5" />
    <Lines x={x - 170} y={y - 16} anchor="middle" lines={['arm on the table']} size={13} colour={muted} />
    <Lines x={x + 60} y={34} lines={["helper's hand"]} size={13} colour={muted} />
    <Steps active={0} x={384} y={84} />
  </PhysicsDiagram>
}
function Drop() {
  const x = SX, y = 190
  return <PhysicsDiagram title="The helper lets go of the ruler without any warning, and it starts to fall.">
    <DropScene stage="drop" x={x} y={y} />
    <Arrow from={[x - 42, 64]} to={[x - 42, 124]} colour={dist} width={3} />
    <Lines x={x - 54} y={66} anchor="end" lines={['dropped', 'without', 'warning']} size={14} colour={dist} />
    <Steps active={1} x={384} y={84} />
  </PhysicsDiagram>
}
function Catch() {
  const x = SX, y = 140, fallen = 15
  return <PhysicsDiagram title="The thumb and finger close to catch the ruler. The reading at the finger is how far the ruler fell before the catch: here 15 cm.">
    <DropScene stage="catch" x={x} y={y} fallen={fallen} />
    <Span x={x + 40} y1={y} y2={y + fallen * CM} label={['distance', 'fallen']} />
    <Tag x={x - 130} y={y - 62} text="read here: 15 cm" colour={dist} />
    <path d={`M${x - 90} ${y - 50}L${x - 6} ${y - 6}`} stroke={dist} strokeWidth="1.6" />
    <Steps active={3} x={384} y={84} />
  </PhysicsDiagram>
}

/** A caught ruler on its own (hand at y, ruler fallen `fallen` cm), with the distance-fallen arrow. */
function Caught({ x, y, fallen, reading = true, cm = CM }: { x: number; y: number; fallen: number; reading?: boolean; cm?: number }) {
  return <g>
    <HandBack x={x} y={y} closed arm="stub" />
    <Ruler x={x} zeroY={y + fallen * cm} cm={cm} />
    <HandFront x={x} y={y} closed />
    <path d={`M${x + 16} ${y}H${x + 50}`} stroke={muted} strokeWidth="1.4" strokeDasharray="4 4" />
    <Span x={x + 44} y1={y} y2={y + fallen * cm} />
    {reading && <Tag x={x + 90} y={y + fallen * cm / 2} text={`${fallen} cm`} colour={dist} />}
  </g>
}
function Compare() {
  const cm = 4, y = 140
  return <PhysicsDiagram title="Two caught rulers. A short distance fallen means a quick reaction; a long distance fallen means a slow reaction.">
    <Caught x={160} y={y} fallen={6} cm={cm} reading={false} />
    <Caught x={400} y={y} fallen={24} cm={cm} reading={false} />
    <Lines x={140} y={268} anchor="middle" lines={['short distance:', 'quick reaction']} size={14} colour={P.useful} />
    <Lines x={380} y={268} anchor="middle" lines={['long distance:', 'slow reaction']} size={14} colour={P.wasted} />
  </PhysicsDiagram>
}
function TwoPeople({ assessment }: { assessment: boolean }) {
  void assessment
  const cm = 4.4, y = 150
  return <PhysicsDiagram title="Two people take the ruler drop test. Person A catches the ruler at 12 cm and person B at 20 cm.">
    <Caught x={150} y={y} fallen={12} cm={cm} />
    <Caught x={390} y={y} fallen={20} cm={cm} />
    <Lines x={120} y={30} anchor="middle" lines={['Person A']} size={16} />
    <Lines x={360} y={30} anchor="middle" lines={['Person B']} size={16} />
  </PhysicsDiagram>
}

/* ---------- Section 4: improving the test ---------- */

function Mean() {
  const readings = [12, 15, 18], cm = 3.6
  return <PhysicsDiagram schematic={false} title="Three drops fell 12 cm, 15 cm and 18 cm. Add them to get 45, then divide by 3: the mean is 15 cm.">
    {readings.map((r, i) => {
      const x = 60 + i * 72, y0 = 104
      return <g key={r}>
        <Ruler x={x} zeroY={y0 + r * cm} cm={cm} labelsEvery={10} />
        <path d={`M${x - 24} ${y0}H${x + 24}`} stroke={dist} strokeWidth="3" />
        <Tag x={x} y={206} text={`${r} cm`} colour={dist} />
      </g>
    })}
    <Lines x={132} y={250} anchor="middle" lines={['three drops']} size={14} colour={muted} />
    <Card x={270} y={70} w={250} h={150} />
    <text x={288} y={114} fontSize="18" fontWeight="700" fill={ink}>12 + 15 + 18 = 45</text>
    <text x={288} y={156} fontSize="18" fontWeight="700" fill={ink}>45 ÷ 3 = <tspan fill={dist}>15 cm</tspan></text>
    <Lines x={288} y={196} lines={['this is the mean']} size={14} colour={muted} />
    <Lines x={395} y={52} anchor="middle" lines={['add, then divide by 3']} size={14} />
  </PhysicsDiagram>
}

function Clay() {
  return <PhysicsDiagram title="A ruler with a blob of modelling clay on its bottom falls straight down. A ruler without it can twist as it falls.">
    <Ruler x={150} zeroY={216} cm={4.8} clayBlob />
    <Arrow from={[196, 110]} to={[196, 190]} colour={dist} width={3} />
    <Tick x={150} y={40} />
    <Lines x={150} y={278} anchor="middle" lines={['with clay: falls straight']} size={14} colour={P.useful} />
    <Ruler x={390} zeroY={216} cm={4.8} tilt={16} />
    <path d="M440 110q26 20 6 50" stroke={muted} strokeWidth="2.4" fill="none" strokeDasharray="5 5" />
    <Arrow from={[446, 150]} to={[438, 172]} colour={muted} width={2.4} />
    <CrossMark x={390} y={40} />
    <Lines x={390} y={278} anchor="middle" lines={['without: can twist']} size={14} colour={P.wasted} />
  </PhysicsDiagram>
}

function Fair() {
  const items = ['same ruler every time', 'same person drops it', 'change one thing only']
  return <PhysicsDiagram schematic={false} title="A fair test: use the same ruler every time, have the same person drop it, and change only one thing.">
    <Card x={110} y={40} w={320} h={210} />
    <Lines x={270} y={78} anchor="middle" lines={['a fair test']} size={17} />
    {items.map((t, i) => <g key={t}>
      <Tick x={150} y={124 + i * 42} />
      <text x={174} y={129 + i * 42} fontSize="16" fontWeight="700" fill={ink}>{t}</text>
    </g>)}
    <Lines x={270} y={282} anchor="middle" lines={['for example, only change who catches the ruler']} size={13} weight={600} colour={muted} />
  </PhysicsDiagram>
}

export function ReactionTimeVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'rtime-idea': return <Idea />
    case 'rtime-stopwatch': return <StopwatchIdea />
    case 'rtime-computer': return <Computer />
    case 'rtime-setup': return <Setup />
    case 'rtime-drop': return <Drop />
    case 'rtime-catch': return <Catch />
    case 'rtime-compare': return <Compare />
    case 'rtime-mean': return <Mean />
    case 'rtime-clay': return <Clay />
    case 'rtime-fair': return <Fair />
    case 'rtime-q-two': return <TwoPeople assessment={assessment} />
    default: return null
  }
}
