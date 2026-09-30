import { WsDiagram, Tag, Tick, Cross, Arrow, Bracket, Bench, Stopwatch, WorkingCard, tones, wsPalette as W, ink, muted, r1, faded, type Pt } from './WsKit'
import { physicsPalette as P, Lines, Leader, Wire, Junction, CurrentArrow, Cell, Lamp, SwitchOpen, SwitchClosed, Ammeter, Voltmeter } from './PhysicsKit'

/*
 * Working Scientifically Lesson 20: Electrical meters and light gates. Original, code-native schematics.
 * Every focus id here starts with 'wselec-' and is routed from CellBiologyVisuals.tsx.
 *
 * Circuits use the AQA symbols from PhysicsKit: one cell-and-lamp loop is reused, with the voltmeter on a side branch
 * across the lamp (parallel, pd violet) and the ammeter in the main loop (series, current vermilion).
 * Meter leads are red (+) and black (−). Light gates are drawn from above (a post each side of the track, crossbar
 * dashed over it); the beam is a dotted yellow line and the card on the trolley is brown-orange.
 */

const red = { fill: '#e8594c', line: '#b23a2f' }, black = { fill: '#3a4650', line: '#1f282f' }
const beam = P.lightLine
const card = { fill: '#fbe6d2', line: '#b0601c' }

/* ---------- The cell-and-lamp loop ---------- */

const L = 90, R = 330, TOP = 70, BOT = 196, MID = (TOP + BOT) / 2, CX = (L + R) / 2
type LoopProps = { volt?: 'on' | 'dim' | 'none'; amm?: 'on' | 'dim' | 'none'; open?: boolean; blank?: boolean; arrows?: boolean }
/** The loop: cell on top, lamp at the bottom, an ammeter on the left side, a voltmeter branch under the lamp, a switch on the right. */
function Loop({ volt = 'none', amm = 'none', open, blank = false, arrows = false }: LoopProps) {
  const vC = volt === 'on' && !blank ? P.pd : P.wire, aC = amm === 'on' && !blank ? P.current : P.wire
  const sw = open !== undefined
  return <g>
    <Wire points={[[CX + 32, TOP], [R, TOP], [R, sw ? MID - 32 : BOT]]} />
    {sw && <Wire points={[[R, MID + 32], [R, BOT], [CX + 32, BOT]]} />}
    {!sw && <Wire points={[[R, BOT], [CX + 32, BOT]]} />}
    {amm === 'none' ? <Wire points={[[CX - 32, BOT], [L, BOT], [L, TOP], [CX - 32, TOP]]} /> : <g>
      <Wire points={[[CX - 32, BOT], [L, BOT], [L, MID + 32]]} />
      <Wire points={[[L, MID - 32], [L, TOP], [CX - 32, TOP]]} />
    </g>}
    <Cell x={CX} y={TOP} signs />
    <Lamp x={CX} y={BOT} lit={!open} />
    {sw && (open ? <SwitchOpen x={R} y={MID} rotate={90} /> : <SwitchClosed x={R} y={MID} rotate={90} />)}
    {amm !== 'none' && <g opacity={amm === 'dim' ? faded : 1}>
      {blank ? <Blank x={L} y={MID} n={2} vertical /> : <Ammeter x={L} y={MID} rotate={90} colour={aC} />}
    </g>}
    {volt !== 'none' && <g opacity={volt === 'dim' ? faded : 1}>
      <Wire points={[[CX - 56, BOT], [CX - 56, BOT + 58], [CX - 32, BOT + 58]]} colour={vC} />
      <Wire points={[[CX + 32, BOT + 58], [CX + 56, BOT + 58], [CX + 56, BOT]]} colour={vC} />
      <Junction x={CX - 56} y={BOT} colour={vC} />
      <Junction x={CX + 56} y={BOT} colour={vC} />
      {blank ? <Blank x={CX} y={BOT + 58} n={1} /> : <Voltmeter x={CX} y={BOT + 58} colour={vC} />}
    </g>}
    {arrows && <g>
      <CurrentArrow x={CX + 70} y={TOP} />
      <CurrentArrow x={R} y={MID} rotate={90} />
      <CurrentArrow x={CX - 70} y={BOT} rotate={180} />
      <CurrentArrow x={L} y={amm === 'none' ? MID : TOP + 18} rotate={-90} />
    </g>}
  </g>
}
/** A round meter with a number instead of a letter (question view). */
function Blank({ x, y, n, vertical = false }: { x: number; y: number; n: number; vertical?: boolean }) {
  return <g>
    <path d={vertical ? `M${x} ${y - 32}V${y - 14}M${x} ${y + 14}V${y + 32}` : `M${x - 32} ${y}H${x - 14}M${x + 14} ${y}H${x + 32}`} stroke={P.wire} strokeWidth="2.5" />
    <circle cx={x} cy={y} r="14" fill="white" stroke={P.wire} strokeWidth="2.5" />
    <text x={x} y={y + 5.5} textAnchor="middle" fontSize="16" fontWeight="750" fill={ink}>{n}</text>
  </g>
}

function VoltFrame() {
  return <WsDiagram title="A circuit with a cell and a lamp. A voltmeter is connected on a side branch across the lamp: it is in parallel with the lamp.">
    <Loop volt="on" />
    <Lines x={372} y={214} lines={['voltmeter:', 'across the lamp,', 'in parallel']} size={14} colour={P.pd} />
    <Leader from={[368, 230]} to={[CX + 15, BOT + 58]} colour={P.pd} />
    <Lines x={CX} y={TOP - 34} anchor="middle" lines={['cell']} size={13} weight={650} colour={muted} />
    <Lines x={CX - 60} y={BOT - 22} anchor="end" lines={['lamp']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}
function AmmFrame() {
  return <WsDiagram title="The same circuit with an ammeter in the main loop, one after the other with the lamp: it is in series, so the same current flows through it.">
    <Loop amm="on" arrows />
    <Lines x={16} y={34} lines={['ammeter: in the loop, in series']} size={14} colour={P.current} />
    <Leader from={[46, 42]} to={[L - 10, MID - 8]} colour={P.current} />
    <Lines x={372} y={100} lines={['the same current', 'flows through', 'the ammeter', 'and the lamp']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}
function OffFrame() {
  return <WsDiagram title="The circuit with its switch open between readings. No current flows, so the wires stay cool and their resistance does not change.">
    <Loop amm="dim" open />
    <g opacity={faded}>
      {[0, 1, 2].map(i => <path key={i} d={`M${CX + 80 + i * 16} ${TOP - 12}c-5 -8 5 -12 0 -20s5 -12 0 -20`} fill="none" stroke={P.hot} strokeWidth="2.4" />)}
    </g>
    <Cross x={CX + 136} y={TOP - 30} s={0.8} />
    <Lines x={R + 30} y={MID - 4} lines={['switch off', 'between readings']} size={14} />
    <Leader from={[R + 26, MID - 8]} to={[R + 10, MID - 4]} />
    <Tag x={CX} y={BOT + 66} text="wires stay cool" tone="change" size={14} strong />
  </WsDiagram>
}

/* ---------- Meters with leads ---------- */

function Port({ x, y, tone, label }: { x: number; y: number; tone: typeof red; label?: string }) {
  return <g>
    <circle cx={x} cy={y} r="10" fill={tone.fill} stroke={tone.line} strokeWidth="2" />
    <circle cx={x} cy={y} r="4" fill={black.line} />
    {label && <text x={x} y={y - 16} textAnchor="middle" fontSize="12" fontWeight="750" fill={ink}>{label}</text>}
  </g>
}
function Lead({ d, tone }: { d: string; tone: typeof red }) {
  return <g><path d={d} fill="none" stroke={tone.line} strokeWidth="6" /><path d={d} fill="none" stroke={tone.fill} strokeWidth="3" /></g>
}
function Screen({ x, y, w, text }: { x: number; y: number; w: number; text: string }) {
  return <g>
    <rect x={x} y={y} width={w} height={40} rx="7" fill="#26394a" />
    <text x={x + w / 2} y={y + 27} textAnchor="middle" fontSize="20" fontWeight="700" fill="#bff0c9" fontFamily="ui-monospace, monospace">{text}</text>
  </g>
}
function PortsFrame() {
  const x = 150, y = 40
  return <WsDiagram title="A digital meter. The red wire plugs into the red port, which is positive, and the black wire into the black port, which is negative. The value is read from the screen.">
    <rect x={x} y={y} width={170} height={160} rx="18" fill="#f1d9a6" stroke="#b08a3c" strokeWidth="2.2" />
    <Screen x={x + 20} y={y + 20} w={130} text="1.5 V" />
    <Port x={x + 55} y={y + 124} tone={red} />
    <Port x={x + 115} y={y + 124} tone={black} />
    <Lines x={x + 55} y={y + 100} anchor="middle" lines={['+']} size={16} colour={red.line} />
    <Lines x={x + 115} y={y + 100} anchor="middle" lines={['−']} size={16} colour={black.line} />
    <Lead d={`M${x + 55} ${y + 124}C${x + 55} ${y + 200} ${x - 20} ${y + 190} ${x - 60} ${y + 230}`} tone={red} />
    <Lead d={`M${x + 115} ${y + 124}C${x + 115} ${y + 210} ${x + 60} ${y + 220} ${x + 30} ${y + 250}`} tone={black} />
    <Lines x={370} y={y + 45} lines={['read the screen']} size={15} />
    <Leader from={[366, y + 40]} to={[x + 150, y + 40]} />
    <Lines x={370} y={y + 150} lines={['red port (+)']} size={15} colour={red.line} />
    <Leader from={[366, y + 146]} to={[x + 60, y + 132]} colour={red.line} />
    <Lines x={370} y={y + 190} lines={['black port (−)']} size={15} colour={black.line} />
    <Leader from={[366, y + 186]} to={[x + 122, y + 132]} colour={black.line} />
  </WsDiagram>
}

type Dial = 'V' | 'A' | 'Ω'
/** A multimeter centred on x with its top at y (140 wide, 240 tall). */
function Multimeter({ x, y, dial = 'V', reading = '', hi }: { x: number; y: number; dial?: Dial; reading?: string; hi?: 'V' | 'A' }) {
  const c: Pt = [x, y + 124], ang: Record<Dial, number> = { V: -150, A: -30, 'Ω': -90 }
  const at = (deg: number, r: number): Pt => [r1(c[0] + Math.cos(deg * Math.PI / 180) * r), r1(c[1] + Math.sin(deg * Math.PI / 180) * r)]
  const tip = at(ang[dial], 26)
  return <g>
    <rect x={x - 70} y={y} width={140} height={240} rx="18" fill="#f1d9a6" stroke="#b08a3c" strokeWidth="2.2" />
    <Screen x={x - 52} y={y + 16} w={104} text={reading} />
    {(['V', 'A', 'Ω'] as Dial[]).map(k => { const p = at(ang[k], 48); return <text key={k} x={p[0]} y={p[1] + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill={hi && k === dial ? tones.change.text : muted}>{k}</text> })}
    <circle cx={c[0]} cy={c[1]} r="32" fill="#4a5864" stroke={black.line} strokeWidth="2" />
    <path d={`M${c[0]} ${c[1]}L${tip[0]} ${tip[1]}`} stroke="white" strokeWidth="5" />
    <circle cx={c[0]} cy={c[1]} r="6" fill="#dfe5ea" />
    <Port x={x - 42} y={y + 196} tone={red} label="A" />
    <Port x={x} y={y + 196} tone={black} label="COM" />
    <Port x={x + 42} y={y + 196} tone={red} label="V" />
    {hi && <circle cx={hi === 'A' ? x - 42 : x + 42} cy={y + 196} r="16" fill="none" stroke={tones.mark.line} strokeWidth="2.6" />}
  </g>
}
function MultimeterFrame() {
  const x = 190, y = 30
  return <WsDiagram title="A multimeter: one device with a screen, a dial to choose volts, amps or ohms, and ports for the wires.">
    <Multimeter x={x} y={y} dial="V" reading="0.00" />
    <Lines x={320} y={y + 42} lines={['screen']} size={15} />
    <Leader from={[316, y + 38]} to={[x + 52, y + 36]} />
    <Lines x={320} y={y + 128} lines={['dial: chooses', 'V, A or Ω']} size={15} />
    <Leader from={[316, y + 124]} to={[x + 32, y + 124]} />
    <Lines x={320} y={y + 206} lines={['ports']} size={15} />
    <Leader from={[316, y + 202]} to={[x + 52, y + 196]} />
  </WsDiagram>
}

/** A small cell-and-lamp loop on the right: cell on top, lamp standing on the left side. */
const SL = 330, SR = 500, ST = 64, SB = 224, SM = (ST + SB) / 2
function MultiV() {
  const mx = 130, my = 30
  return <WsDiagram title="Measuring potential difference with a multimeter. The dial is on V, the red wire is in the V port, and the two wires connect across the lamp, in parallel.">
    <Wire points={[[(SL + SR) / 2 - 32, ST], [SL, ST], [SL, SM - 32]]} />
    <Wire points={[[SL, SM + 32], [SL, SB], [SR, SB], [SR, ST], [(SL + SR) / 2 + 32, ST]]} />
    <Cell x={(SL + SR) / 2} y={ST} signs />
    <Lamp x={SL} y={SM} rotate={90} lit />
    <Junction x={SL} y={SM - 44} />
    <Junction x={SL} y={SM + 44} />
    <Multimeter x={mx} y={my} dial="V" reading="1.5 V" hi="V" />
    <Lead d={`M${mx + 42} ${my + 196}C${mx + 42} ${my + 250} ${250} ${SM - 44} ${SL} ${SM - 44}`} tone={red} />
    <Lead d={`M${mx} ${my + 196}C${mx} ${my + 268} ${260} ${SM + 44} ${SL} ${SM + 44}`} tone={black} />
    <Tag x={420} y={SB + 38} text="volts: in parallel" tone="truth" size={14} strong />
  </WsDiagram>
}
function MultiA() {
  const mx = 130, my = 30, cx = (SL + SR) / 2
  return <WsDiagram title="Measuring current with a multimeter. The dial is on A, the red wire is in the A port, and the multimeter is part of the loop with the lamp, in series.">
    <Wire points={[[cx - 32, ST], [SL, ST], [SL, SM - 40]]} />
    <Wire points={[[SL, SM + 40], [SL, SB], [cx - 32, SB]]} />
    <Wire points={[[cx + 32, SB], [SR, SB], [SR, ST], [cx + 32, ST]]} />
    <Cell x={cx} y={ST} signs />
    <Lamp x={cx} y={SB} lit />
    <circle cx={SL} cy={SM - 40} r="4" fill={P.wire} />
    <circle cx={SL} cy={SM + 40} r="4" fill={P.wire} />
    <Multimeter x={mx} y={my} dial="A" reading="0.2 A" hi="A" />
    <Lead d={`M${mx} ${my + 196}C${mx} ${my + 256} ${262} ${SM + 76} ${SL} ${SM + 40}`} tone={black} />
    <Lead d={`M${mx - 42} ${my + 196}C${mx - 42} ${my + 276} ${300} ${SM + 30} ${SL} ${SM - 40}`} tone={red} />
    <Tag x={420} y={SB + 38} text="amps: in series" tone="measure" size={14} strong />
    <Lines x={420} y={SM + 4} anchor="middle" lines={['the loop goes', 'through the meter']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}

/* ---------- Light gates (seen from above: the track runs left to right, the beam crosses it) ---------- */

const TY = 150, TH = 64 // track centre line and width
/** A light gate over the track at x: two posts either side, a crossbar over the top, the beam across. */
function Gate({ x, y = TY, lit = true, blocked = false }: { x: number; y?: number; lit?: boolean; blocked?: boolean }) {
  const top = y - TH / 2 - 26, bot = y + TH / 2 + 26
  return <g>
    {lit && <path d={`M${x} ${top + 18}V${blocked ? y - 6 : bot - 18}`} stroke={beam} strokeWidth="3.2" strokeDasharray="3 5" />}
    <rect x={x - 12} y={top - 8} width={24} height={bot - top + 16} rx="8" fill="#eef4d6" fillOpacity=".45" stroke="#8a9a3c" strokeWidth="1.6" strokeDasharray="5 4" />
    <rect x={x - 18} y={top - 10} width={36} height={28} rx="7" fill="#e8f0c8" stroke="#8a9a3c" strokeWidth="2" />
    <rect x={x - 18} y={bot - 18} width={36} height={28} rx="7" fill="#e8f0c8" stroke="#8a9a3c" strokeWidth="2" />
    <circle cx={x} cy={top + 14} r="5" fill={P.light} stroke={beam} strokeWidth="2" />
    <rect x={x - 7} y={bot - 18} width={14} height={8} rx="2" fill={black.fill} />
  </g>
}
/** A trolley seen from above with a card standing along its middle; (x, y) is its centre. `gap` cuts a gap in the card. */
function Trolley({ x, y = TY, cw = 70, gap = false, dim = false }: { x: number; y?: number; cw?: number; gap?: boolean; dim?: boolean }) {
  const g = gap ? cw * 0.3 : 0, side = (cw - g) / 2
  return <g opacity={dim ? faded : 1}>
    {[[-38, -25], [38, -25], [-38, 25], [38, 25]].map(([dx, dy], i) => <rect key={i} x={x + dx - 10} y={y + dy - 5} width={20} height={10} rx="4" fill="#dfe5ea" stroke={ink} strokeWidth="1.8" />)}
    <rect x={x - 55} y={y - 22} width={110} height={44} rx="10" fill={P.gravitational} stroke={P.gravitationalLine} strokeWidth="2" />
    {gap ? <g>
      <rect x={x - cw / 2} y={y - 5} width={side} height={10} rx="3" fill={card.fill} stroke={card.line} strokeWidth="2" />
      <rect x={x - cw / 2 + side + g} y={y - 5} width={side} height={10} rx="3" fill={card.fill} stroke={card.line} strokeWidth="2" />
    </g> : <rect x={x - cw / 2} y={y - 5} width={cw} height={10} rx="3" fill={card.fill} stroke={card.line} strokeWidth="2" />}
  </g>
}
function Track({ x1 = 20, x2 = 520 }: { x1?: number; x2?: number }) {
  return <rect x={x1} y={TY - TH / 2} width={x2 - x1} height={TH} rx="10" fill={W.panel} stroke={W.panelLine} strokeWidth="1.6" />
}
function Laptop({ x, y, text }: { x: number; y: number; text: string }) {
  return <g>
    <rect x={x - 50} y={y - 64} width={100} height={62} rx="6" fill="#dfe5ea" stroke={ink} strokeWidth="2" />
    <rect x={x - 42} y={y - 57} width={84} height={48} rx="3" fill="#26394a" />
    <text x={x} y={y - 28} textAnchor="middle" fontSize="14" fontWeight="700" fill="#bff0c9" fontFamily="ui-monospace, monospace">{text}</text>
    <path d={`M${x - 60} ${y}H${x + 60}L${x + 52} ${y + 8}H${x - 52}Z`} fill="#c3ced7" stroke={ink} strokeWidth="2" />
  </g>
}
function GateFrame() {
  const gx = 300
  return <WsDiagram title="A light gate seen from above. A post on each side of the track: a beam of light crosses the gap from one side to a detector on the other. A trolley with a card on top is about to pass through and interrupt the beam.">
    <Track />
    <Trolley x={130} />
    <Arrow from={[196, TY]} to={[244, TY]} colour={muted} width={2.4} />
    <Gate x={gx} />
    <Lines x={gx} y={TY - 76} anchor="middle" lines={['light gate']} size={15} />
    <Lines x={400} y={TY + 4} lines={['beam of light']} size={15} colour={beam} />
    <Leader from={[396, TY]} to={[gx + 3, TY + 8]} colour={beam} />
    <Lines x={400} y={TY + 66} lines={['detector']} size={15} />
    <Leader from={[396, TY + 62]} to={[gx + 8, TY + 44]} />
    <Lines x={130} y={TY + 58} anchor="middle" lines={['card on the trolley']} size={13} weight={650} colour={card.line} />
    <Lines x={270} y={282} anchor="middle" lines={['seen from above']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}
function SpeedFrame() {
  const gx = 200, tx = gx + 10
  return <WsDiagram title="Seen from above: the card on a trolley passes through a light gate and interrupts the beam. The gate is connected to a computer. You type in the length of the card; the computer divides it by the time the beam was interrupted to give the speed.">
    <Track x1={20} x2={380} />
    <Trolley x={tx} />
    <Gate x={gx} blocked />
    <Bracket x1={tx - 35} x2={tx + 35} y={TY - 82} />
    <Lines x={tx} y={TY - 96} anchor="middle" lines={['length of card']} size={14} colour={card.line} />
    <path d={`M${tx - 35} ${TY - 74}V${TY - 8}M${tx + 35} ${TY - 74}V${TY - 8}`} stroke={card.line} strokeWidth="1.4" strokeDasharray="3 4" />
    <path d={`M${gx + 18} ${TY + 70}C${gx + 100} ${TY + 90} ${340} ${TY + 60} ${392} ${TY + 48}`} fill="none" stroke={ink} strokeWidth="2" />
    <Laptop x={452} y={TY + 44} text="0.25 s" />
    <Tag x={410} y={TY + 116} text="speed = length ÷ time" tone="mark" size={14} strong />
    <Lines x={452} y={TY - 44} anchor="middle" lines={['beam interrupted', 'for 0.25 s']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}
function AccelFrame() {
  const gx = 190
  return <WsDiagram title="Seen from above: a card with a gap cut in the middle passes through the light gate. The beam is blocked, then clear through the gap, then blocked again: it is interrupted twice, so the gate measures two speeds.">
    <Track x1={20} x2={330} />
    <Trolley x={gx} cw={90} gap />
    <Gate x={gx} />
    <Lines x={gx} y={TY - 76} anchor="middle" lines={['card with a gap']} size={14} colour={card.line} />
    <Tag x={430} y={60} text="beam interrupted twice" tone="mark" size={13} strong />
    <g transform="translate(368 104)">
      <rect x={0} y={0} width={44} height={22} rx="5" fill={card.fill} stroke={card.line} strokeWidth="2" />
      <rect x={48} y={0} width={30} height={22} rx="5" fill="white" stroke={W.tableLine} strokeWidth="2" />
      <rect x={82} y={0} width={44} height={22} rx="5" fill={card.fill} stroke={card.line} strokeWidth="2" />
      <Lines x={22} y={42} anchor="middle" lines={['speed 1']} size={12} colour={muted} />
      <Lines x={104} y={42} anchor="middle" lines={['speed 2']} size={12} colour={muted} />
    </g>
    <Lines x={431} y={190} anchor="middle" lines={['two speeds give', 'the acceleration']} size={14} weight={650} colour={muted} />
    <Lines x={170} y={282} anchor="middle" lines={['seen from above']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}
function ErrorsFrame() {
  return <WsDiagram title="Left: a person pressing a stopwatch may press too early or too late, which is a timing error. Right: a light gate times the object itself, with no reaction time.">
    <g opacity={0.5}>
      <Stopwatch x={130} y={140} r={50} reading="0.31 s" size={16} />
    </g>
    <Lines x={130} y={52} anchor="middle" lines={['pressed by hand:', 'too early or too late?']} size={13} weight={650} colour={muted} />
    <Cross x={130} y={230} />
    <Lines x={130} y={272} anchor="middle" lines={['reaction time']} size={14} colour={tones.bad.text} />
    <path d="M270 40V270" stroke={W.panelLine} strokeWidth="1.6" strokeDasharray="4 6" />
    <Track x1={320} x2={500} />
    <Trolley x={372} dim />
    <Gate x={440} />
    <Tick x={410} y={230} />
    <Lines x={410} y={272} anchor="middle" lines={['no reaction time']} size={14} colour={tones.good.text} />
  </WsDiagram>
}
function WorkedSpeed() {
  const cx = 110
  return <WsDiagram schematic={false} title="Worked example. A card 0.05 m long interrupts the beam for 0.02 s. Speed = length ÷ time = 0.05 ÷ 0.02 = 2.5 m/s.">
    <rect x={cx - 40} y={96} width={80} height={52} rx="4" fill={card.fill} stroke={card.line} strokeWidth="2" />
    <Bracket x1={cx - 40} x2={cx + 40} y={80} />
    <Lines x={cx} y={64} anchor="middle" lines={['0.05 m']} size={16} colour={card.line} />
    <path d={`M${cx - 80} 122H${cx + 80}`} stroke={beam} strokeWidth="3" strokeDasharray="3 5" />
    <Tag x={cx} y={186} text="beam blocked 0.02 s" tone="plain" size={13} />
    <WorkingCard x={204} y={42} w={322} rowH={52} size={17} lines={[
      { text: 'speed = length ÷ time' },
      { text: 'length 0.05 m, time 0.02 s' },
      { text: '0.05 ÷ 0.02 = 2.5' },
      { text: 'speed = 2.5 m/s', answer: true },
    ]} />
  </WsDiagram>
}
function QCircuit({ assessment }: { assessment: boolean }) {
  return <WsDiagram title={assessment ? 'A circuit with a cell, a lamp and two numbered meters.' : 'A circuit with a cell and a lamp. Meter 1 is across the lamp, in parallel: it is a voltmeter. Meter 2 is in the main loop, in series: it is an ammeter.'}>
    <Loop volt="on" amm="on" blank />
    <Lines x={CX - 60} y={BOT - 22} anchor="end" lines={['lamp']} size={13} weight={650} colour={muted} />
    <Lines x={CX} y={TOP - 34} anchor="middle" lines={['cell']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}

export function WsElecVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'wselec-voltmeter': return <VoltFrame />
    case 'wselec-ports': return <PortsFrame />
    case 'wselec-ammeter': return <AmmFrame />
    case 'wselec-off': return <OffFrame />
    case 'wselec-multimeter': return <MultimeterFrame />
    case 'wselec-multi-v': return <MultiV />
    case 'wselec-multi-a': return <MultiA />
    case 'wselec-gate': return <GateFrame />
    case 'wselec-speed': return <SpeedFrame />
    case 'wselec-accel': return <AccelFrame />
    case 'wselec-errors': return <ErrorsFrame />
    case 'wselec-worked-speed': return <WorkedSpeed />
    case 'wselec-q-circuit': return <QCircuit assessment={assessment} />
    default: return null
  }
}
