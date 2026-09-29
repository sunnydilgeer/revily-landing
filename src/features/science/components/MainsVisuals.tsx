import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Wire, CurrentArrow, Cell, Lamp, SwitchOpen, graphScale, type GraphFrame, type Pt } from './PhysicsKit'
import { Txt, Chip, Card, NumPointer, Heat } from './ParallelVisuals'

/*
 * Physics Lesson 23: electricity in the home. Original, code-native schematics; not to scale. Focus ids start with 'mains-'.
 * Wires use their real colours (live brown, neutral blue, earth green and yellow stripes). One plug, seen from behind with
 * the cover off, is reused for the three-wire walkthrough: the wire being taught is bright and the others fade.
 */

const { ink, muted } = P
const brown = '#8a5530', brownFill = '#f0dfd0', blue = '#2f6fb5', blueFill = '#dbe8f6', green = '#3d9a47', yellow = '#e9c83a', copper = '#c9853f'
const plastic = '#f7f4ee', plasticLine = '#a99d8a', brass = '#e2bf5c', brassLine = '#a27f1f'

type WireName = 'live' | 'neutral' | 'earth'

/** A thick insulated wire along a path. Earth gets green and yellow stripes. */
function Insulated({ d, kind, dim = false, width = 9 }: { d: string; kind: WireName; dim?: boolean; width?: number }) {
  const colour = kind === 'live' ? brown : kind === 'neutral' ? blue : green
  return <g opacity={dim ? .25 : 1}>
    <path d={d} fill="none" stroke={colour} strokeWidth={width} strokeLinecap="round" />
    {kind === 'earth' && <path d={d} fill="none" stroke={yellow} strokeWidth={width} strokeDasharray="7 7" strokeLinecap="butt" />}
  </g>
}

// ---------- The plug (from behind, cover off) ----------
const PLUG = { cx: 170, earth: [170, 70] as Pt, neutral: [104, 166] as Pt, live: [236, 166] as Pt }
const plugPaths: Record<WireName, string> = {
  earth: 'M170 238C170 200 166 150 170 92',
  neutral: 'M160 238C150 214 104 214 104 186',
  live: 'M180 238C190 214 236 214 236 186',
}
function Terminal({ at, dim }: { at: Pt; dim?: boolean }) {
  return <g opacity={dim ? .45 : 1}>
    <rect x={at[0] - 15} y={at[1] - 24} width={30} height={46} rx="5" fill={brass} stroke={brassLine} strokeWidth="1.8" />
    <circle cx={at[0]} cy={at[1] + 8} r="6" fill="#f3dc92" stroke={brassLine} strokeWidth="1.6" />
    <path d={`M${at[0] - 4} ${at[1] + 8}H${at[0] + 4}`} stroke={brassLine} strokeWidth="1.6" />
  </g>
}
function Plug({ show = 'all', flow = false }: { show?: WireName | 'all' | 'none'; flow?: boolean }) {
  const dim = (w: WireName) => show !== 'all' && show !== w
  return <g>
    <path d="M78 28H262Q292 28 292 58V236Q292 282 246 282H94Q48 282 48 236V58Q48 28 78 28Z" fill={plastic} stroke={plasticLine} strokeWidth="2.4" />
    {/* cable, sheath and cord grip */}
    <path d="M150 300V238Q150 230 158 230H182Q190 230 190 238V300" fill="#eceae4" stroke={plasticLine} strokeWidth="2" />
    <rect x={130} y={246} width={80} height={14} rx="5" fill="#d8d2c4" stroke={plasticLine} strokeWidth="1.8" />
    <Terminal at={PLUG.earth} dim={dim('earth')} />
    <Terminal at={PLUG.neutral} dim={dim('neutral')} />
    <Terminal at={PLUG.live} dim={dim('live')} />
    {(['earth', 'neutral', 'live'] as WireName[]).map(w => <Insulated key={w} d={plugPaths[w]} kind={w} dim={dim(w)} />)}
    {flow && <g>
      <CurrentArrow x={212} y={214} rotate={137} />
      <CurrentArrow x={126} y={212} rotate={-137} />
    </g>}
  </g>
}
function PlugView({ show, title, lines, colour, flow }: { show: WireName; title: string; lines: string[]; colour: string; flow?: boolean }) {
  const target = show === 'earth' ? PLUG.earth : show === 'live' ? PLUG.live : PLUG.neutral
  return <PhysicsDiagram title={title}>
    <Plug show={show} flow={flow} />
    <path d={`M${target[0] + 18} ${target[1] - 6}L318 ${show === 'earth' ? 76 : 150}`} stroke={colour} strokeWidth="1.6" fill="none" />
    <circle cx={target[0] + 18} cy={target[1] - 6} r="2.8" fill={colour} />
    <Card x={318} y={show === 'earth' ? 40 : 110} w={214} h={lines.length * 21 + 26} highlight={colour}>
      <Txt x={334} y={show === 'earth' ? 66 : 136} lines={lines} size={15} weight={750} colour={colour} />
    </Card>
    {flow && <Txt x={330} y={236} lines={['current: in by live,', 'out by neutral']} size={13} weight={700} colour={P.current} />}
    <Txt x={144} y={294} lines={['to the appliance']} size={12} colour={muted} anchor="end" />
  </PhysicsDiagram>
}

// ---------- Small pieces ----------

/** A three-pin mains plug seen from the front, as a small icon. */
function PlugIcon({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-26} y={-24} width={52} height={50} rx="12" fill={plastic} stroke={plasticLine} strokeWidth="2.2" />
    <rect x={-4} y={-17} width={8} height={14} rx="1.5" fill={brass} stroke={brassLine} strokeWidth="1.2" />
    <rect x={-17} y={6} width={12} height={7} rx="1.5" fill={brass} stroke={brassLine} strokeWidth="1.2" />
    <rect x={5} y={6} width={12} height={7} rx="1.5" fill={brass} stroke={brassLine} strokeWidth="1.2" />
  </g>
}
function Socket({ x, y }: { x: number; y: number }) {
  return <g>
    <rect x={x - 46} y={y - 46} width={92} height={92} rx="16" fill="white" stroke={plasticLine} strokeWidth="2.4" />
    <rect x={x - 5} y={y - 30} width={10} height={20} rx="2" fill={ink} opacity=".75" />
    <rect x={x - 26} y={y + 6} width={18} height={9} rx="2" fill={ink} opacity=".75" />
    <rect x={x + 8} y={y + 6} width={18} height={9} rx="2" fill={ink} opacity=".75" />
  </g>
}
/** A double-headed arrow along a wire (ac). */
function TwoWay({ x, y, rotate = 0, colour = P.current }: { x: number; y: number; rotate?: number; colour?: string }) {
  return <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    <path d="M-12 0H12" stroke={colour} strokeWidth="2.6" />
    <path d="M18 0L8 -6V6Z M-18 0L-8 -6V6Z" fill={colour} stroke={colour} strokeWidth="1" strokeLinejoin="round" />
  </g>
}
/** Supply + lamp loop. dc: a cell and one-way arrows. ac: a plug and two-way arrows. */
function Loop({ ox, oy = 0, kind, w = 160, h = 130 }: { ox: number; oy?: number; kind: 'dc' | 'ac'; w?: number; h?: number }) {
  const L = ox, R = ox + w, T = 40 + oy, B = 40 + oy + h, mid = (T + B) / 2
  return <g>
    <Wire points={[[L, mid], [L, T], [R, T], [R, B], [L, B], [L, mid]]} />
    {kind === 'dc'
      ? <g><rect x={L - 8} y={mid - 8} width={16} height={16} fill="white" /><Cell x={L} y={mid} rotate={90} length={48} /></g>
      : <g><rect x={L - 30} y={mid - 28} width={60} height={56} fill="white" /><PlugIcon x={L} y={mid} s={.9} /><text x={L - 32} y={mid + 5} textAnchor="end" fontSize="13" fontWeight="700" fill={muted}>mains</text></g>}
    <Lamp x={R} y={mid} rotate={90} length={44} lit />
    {kind === 'dc'
      ? <g><CurrentArrow x={(L + R) / 2} y={T} /><CurrentArrow x={(L + R) / 2} y={B} rotate={180} /></g>
      : <g><TwoWay x={(L + R) / 2} y={T} /><TwoWay x={(L + R) / 2} y={B} /></g>}
  </g>
}

function waveGraph(frame: GraphFrame, kind: 'dc' | 'ac', colour: string) {
  const s = graphScale(frame), x0 = frame.x, x1 = frame.x + frame.width, y0 = s.y(0)
  const d = kind === 'dc'
    ? `M${s.x(0)} ${s.y(1)}H${s.x(frame.xMax * .94)}`
    : Array.from({ length: 81 }, (_, i) => { const t = i / 80 * 2; return `${i ? 'L' : 'M'}${s.x(t)} ${s.y(Math.sin(t * Math.PI * 2) * 1.1).toFixed(1)}` }).join('')
  return <g>
    <g stroke={ink} strokeWidth="2" fill="none">
      <path d={`M${x0} ${frame.y + frame.height}V${frame.y - 4}`} /><path d={`M${x0} ${y0}H${x1 + 4}`} />
    </g>
    <path d={`M${x0} ${frame.y - 14}l-6 11h12z M${x1 + 14} ${y0}l-11 -6v12z`} fill={ink} stroke={ink} strokeWidth="1" strokeLinejoin="round" />
    <text x={x0 + 10} y={frame.y - 4} fontSize="13" fontWeight="700" fill={ink}>current</text>
    <text x={x1 + 20} y={y0 + 5} fontSize="13" fontWeight="700" fill={ink}>time</text>
    <text x={x0 - 8} y={y0 + 5} textAnchor="end" fontSize="12" fill={muted}>0</text>
    <path d={d} fill="none" stroke={colour} strokeWidth="3" />
  </g>
}

// ---------- Section: ac and dc ----------

function TwoTypes() {
  return <PhysicsDiagram title="Two kinds of supply. Left: a cell and a lamp, with current arrows all pointing one way: direct current, dc. Right: a mains plug and a lamp, with two-headed arrows: alternating current, ac.">
    <Loop ox={70} kind="dc" />
    <Loop ox={330} kind="ac" />
    <Txt x={150} y={222} lines={['direct current (dc)']} anchor="middle" size={15} weight={750} />
    <Txt x={410} y={222} lines={['alternating current (ac)']} anchor="middle" size={15} weight={750} />
    <Txt x={150} y={246} lines={['one direction']} anchor="middle" size={13} colour={muted} />
    <Txt x={410} y={246} lines={['changes direction']} anchor="middle" size={13} colour={muted} />
  </PhysicsDiagram>
}
function Dc() {
  return <PhysicsDiagram title="Direct current. A cell lights a lamp and the current arrows all point the same way. A graph of current against time is a flat line: dc flows in one direction.">
    <Loop ox={60} oy={20} kind="dc" />
    {waveGraph({ x: 300, y: 70, width: 180, height: 150, xMin: 0, xMax: 2, yMin: -1.4, yMax: 1.4 }, 'dc', P.current)}
    <Chip x={400} y={272} text="dc: one direction" colour={P.current} fill="white" size={14} />
  </PhysicsDiagram>
}
function Ac() {
  return <PhysicsDiagram title="Alternating current. A mains plug lights a lamp and the arrows on the wire point both ways. A graph of current against time is a smooth wave that crosses zero again and again: ac keeps changing direction.">
    <Loop ox={80} oy={20} kind="ac" />
    {waveGraph({ x: 300, y: 70, width: 180, height: 150, xMin: 0, xMax: 2, yMin: -1.4, yMax: 1.4 }, 'ac', P.current)}
    <Chip x={400} y={272} text="ac: keeps changing direction" colour={P.current} fill="white" size={14} />
  </PhysicsDiagram>
}
function Values() {
  const frame: GraphFrame = { x: 250, y: 130, width: 230, height: 120, xMin: 0, xMax: 2, yMin: -1.4, yMax: 1.4 }
  const s = graphScale(frame)
  return <PhysicsDiagram title="A wall socket. The UK mains supply is about 230 V and 50 Hz. On the wave graph one cycle is marked: the current goes through 50 of these cycles every second.">
    <Socket x={110} y={140} />
    <Chip x={110} y={220} text="UK mains" colour={ink} size={13} />
    <Chip x={300} y={48} text="about 230 V" colour={P.pd} fill={P.pdFill} size={18} />
    <Chip x={446} y={48} text="50 Hz" colour={P.current} fill="#fbe3d8" size={18} />
    {waveGraph(frame, 'ac', P.current)}
    <path d={`M${s.x(0)} ${s.y(-1.25)}V${s.y(-1.45)}M${s.x(1)} ${s.y(-1.25)}V${s.y(-1.45)}M${s.x(0)} ${s.y(-1.35)}H${s.x(1)}`} stroke={ink} strokeWidth="1.8" />
    <Txt x={(s.x(0) + s.x(1)) / 2} y={s.y(-1.35) + 20} lines={['1 cycle']} anchor="middle" size={13} weight={750} />
    <Txt x={372} y={100} lines={['50 cycles every second']} anchor="middle" size={14} weight={700} colour={P.current} />
  </PhysicsDiagram>
}

// ---------- Section: the cable ----------

function ThreeCore() {
  const ends: Array<[WireName, number]> = [['earth', 108], ['live', 150], ['neutral', 192]]
  return <PhysicsDiagram title="A three-core cable cut open. Inside a plastic outer sheath are three wires, each in its own coloured plastic insulation: brown, blue, and green and yellow. The copper cores show at the cut ends.">
    <path d="M24 118H240Q256 118 256 134V166Q256 182 240 182H24Z" fill="#eceae4" stroke={plasticLine} strokeWidth="2.2" />
    <path d="M24 118Q16 150 24 182" fill="none" stroke={plasticLine} strokeWidth="2.2" />
    {ends.map(([w, y], i) => <g key={w}>
      <Insulated d={`M246 ${138 + i * 12}C290 ${138 + i * 12} 300 ${y} 350 ${y}`} kind={w} width={12} />
      <path d={`M352 ${y}H378`} stroke={copper} strokeWidth="5" strokeLinecap="round" />
    </g>)}
    <Txt x={392} y={112} lines={['green and yellow']} size={13} weight={700} colour={green} />
    <Txt x={392} y={155} lines={['brown']} size={13} weight={700} colour={brown} />
    <Txt x={392} y={197} lines={['blue']} size={13} weight={700} colour={blue} />
    <Txt x={130} y={96} lines={['three-core cable']} anchor="middle" size={15} weight={750} />
    <path d="M300 236L300 206" stroke={ink} strokeWidth="1.4" /><circle cx={300} cy={204} r="2.6" fill={ink} />
    <Txt x={300} y={256} lines={['plastic insulation']} anchor="middle" size={14} weight={700} />
    <Txt x={130} y={214} lines={['outer plastic sheath']} anchor="middle" size={13} colour={muted} />
  </PhysicsDiagram>
}

// ---------- Section: danger ----------

function Ground({ y = 262, x1 = 20, x2 = 520 }: { y?: number; x1?: number; x2?: number }) {
  return <g>
    <path d={`M${x1} ${y}H${x2}V${y + 30}H${x1}Z`} fill="#efe4d2" />
    <path d={`M${x1} ${y}H${x2}`} stroke="#b89b72" strokeWidth="2.4" />
  </g>
}
function PdLiveEarth() {
  return <PhysicsDiagram title="A live wire at about 230 V above the ground, which is at 0 V. A double-headed arrow between them shows the large potential difference between live and earth.">
    <Insulated d="M40 70H330" kind="live" width={12} />
    <path d="M332 70H356" stroke={copper} strokeWidth="5" />
    <Chip x={130} y={40} text="live: about 230 V" colour={brown} fill={brownFill} size={14} />
    <Ground />
    <Chip x={130} y={278} text="earth: 0 V" colour={green} fill="white" size={14} />
    <g><path d="M250 92V238" stroke={P.pd} strokeWidth="4" />
      <path d="M250 82L240 98H260Z M250 248L240 232H260Z" fill={P.pd} stroke={P.pd} strokeWidth="1" strokeLinejoin="round" /></g>
    <Card x={290} y={130} w={220} h={70} highlight={P.pd}>
      <Txt x={306} y={158} lines={['large pd between', 'live and earth']} size={15} weight={750} colour={P.pd} />
    </Card>
  </PhysicsDiagram>
}
function Person({ x, y }: { x: number; y: number }) {
  // A simple friendly figure: head, rounded body, arm raised to the right.
  const skin = '#f2d3b8', skinLine = '#b98563', cloth = '#cfe0ee', clothLine = '#5b7c95'
  return <g>
    <path d={`M${x - 16} ${y + 70}L${x - 20} ${y + 150}M${x + 16} ${y + 70}L${x + 20} ${y + 150}`} stroke={clothLine} strokeWidth="14" />
    <path d={`M${x - 26} ${y + 80}V${y + 20}Q${x - 26} ${y} ${x} ${y}Q${x + 26} ${y} ${x + 26} ${y + 20}V${y + 80}Z`} fill={cloth} stroke={clothLine} strokeWidth="2.2" />
    <path d={`M${x + 18} ${y + 12}Q${x + 50} ${y - 6} ${x + 76} ${y - 40}`} fill="none" stroke={clothLine} strokeWidth="12" />
    <circle cx={x + 80} cy={y - 46} r="8" fill={skin} stroke={skinLine} strokeWidth="1.8" />
    <path d={`M${x - 20} ${y + 16}Q${x - 36} ${y + 44} ${x - 30} ${y + 74}`} fill="none" stroke={clothLine} strokeWidth="12" />
    <circle cx={x} cy={y - 22} r="20" fill={skin} stroke={skinLine} strokeWidth="2" />
  </g>
}
function Shock() {
  return <PhysicsDiagram title="A person reaches up and touches a bare live wire. A current arrow runs from the wire, through the arm and body, down to the ground. The body provides a link between the live wire and the earth.">
    <Insulated d="M300 60H440" kind="live" width={12} />
    <path d="M300 60H262" stroke={copper} strokeWidth="5" />
    <Chip x={410} y={30} text="live: about 230 V" colour={brown} fill={brownFill} size={13} />
    <Ground y={250} />
    <Person x={180} y={96} />
    <path d="M258 60Q232 80 218 96Q196 120 188 180Q186 214 200 246" fill="none" stroke={P.current} strokeWidth="3.2" strokeDasharray="8 6" />
    <path d="M200 252L192 236L208 238Z" fill={P.current} stroke={P.current} strokeWidth="1" strokeLinejoin="round" />
    <Chip x={200} y={274} text="earth: 0 V" colour={green} fill="white" size={13} />
    <Card x={330} y={120} w={196} h={70} highlight={P.current}>
      <Txt x={346} y={148} lines={['your body links', 'live to earth']} size={15} weight={750} colour={P.current} />
    </Card>
  </PhysicsDiagram>
}
function SwitchOff() {
  return <PhysicsDiagram title="A lamp circuit from the mains with the switch in the live wire turned off (open). The live wire between the supply and the switch is still at about 230 V; the wire on the lamp side is at 0 V.">
    <rect x={30} y={96} width={70} height={90} rx="12" fill={P.panel} stroke={ink} strokeWidth="2" />
    <Txt x={65} y={136} lines={['mains', 'supply']} anchor="middle" size={13} weight={700} />
    <Insulated d="M100 116H206" kind="live" width={8} />
    <Insulated d="M254 116H346V132" kind="live" width={8} />
    <Insulated d="M346 170V200H100" kind="neutral" width={8} />
    <SwitchOpen x={230} y={116} length={48} colour={ink} />
    <Lamp x={346} y={151} rotate={90} length={40} />
    <Chip x={150} y={80} text="about 230 V" colour={brown} fill={brownFill} size={13} />
    <Chip x={300} y={80} text="0 V" colour={muted} fill="white" size={13} />
    <Txt x={230} y={150} lines={['switch off']} anchor="middle" size={13} colour={muted} weight={700} />
    <Card x={40} y={226} w={460} h={60} highlight={P.hot}>
      <Txt x={270} y={250} lines={['switch off: the wire near the supply', 'can still have a pd']} anchor="middle" size={14} weight={750} colour={P.hot} />
    </Card>
  </PhysicsDiagram>
}
function Flame({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x} ${y}c-16 -6 -20 -26 -8 -40c0 10 6 14 8 8c-2 -12 4 -22 12 -28c-2 12 12 20 8 38c-2 14 -10 22 -20 22z`} fill="#f7b453" stroke="#d9713a" strokeWidth="2" />
    <path d={`M${x + 2} ${y - 4}c-6 -4 -6 -14 0 -20c2 6 8 8 6 16c-1 4 -3 5 -6 4z`} fill="#fde8a8" />
  </g>
}
function Fire() {
  return <PhysicsDiagram title="A bare live wire touching a bare earth wire. Heat lines and a small flame show that a huge current could flow and start a fire.">
    <Insulated d="M40 110H200" kind="live" width={12} />
    <Insulated d="M500 190H340" kind="earth" width={12} />
    <path d="M200 110Q244 118 290 162" stroke={copper} strokeWidth="5" fill="none" />
    <path d="M340 190Q294 176 256 130" stroke={copper} strokeWidth="5" fill="none" />
    <circle cx={272} cy={146} r="16" fill={P.light} opacity=".7" />
    <Heat x={272} y={124} n={3} gap={12} />
    <Flame x={318} y={132} />
    <Chip x={110} y={78} text="live" colour={brown} fill={brownFill} size={13} />
    <Chip x={440} y={224} text="earth" colour={green} fill="white" size={13} />
    <Card x={60} y={216} w={250} h={58} highlight={P.hot}>
      <Txt x={185} y={250} lines={['huge current: fire risk']} anchor="middle" size={16} weight={750} colour={P.hot} />
    </Card>
  </PhysicsDiagram>
}

// ---------- On your own ----------

function QPlug() {
  return <PhysicsDiagram title="A plug with three numbered wires.">
    <Plug show="all" />
    <NumPointer x={40} y={196} n={1} to={[118, 214]} />
    <NumPointer x={330} y={110} n={2} to={[172, 150]} />
    <NumPointer x={330} y={220} n={3} to={[222, 214]} />
  </PhysicsDiagram>
}

export function MainsVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  const views: Record<string, () => ReactNode> = {
    'mains-two-types': TwoTypes,
    'mains-dc': Dc,
    'mains-ac': Ac,
    'mains-values': Values,
    'mains-three-core': ThreeCore,
    'mains-live': () => <PlugView show="live" colour={brown} lines={['live: brown', 'about 230 V']} title="The inside of a plug with the brown live wire highlighted and the other two wires faded. The live wire is brown and is at about 230 V." />,
    'mains-neutral': () => <PlugView show="neutral" colour={blue} flow lines={['neutral: blue', 'about 0 V', 'completes the circuit']} title="The inside of a plug with the blue neutral wire highlighted. The neutral wire is at about 0 V and completes the circuit: current goes in by the live wire and out by the neutral wire." />,
    'mains-earth': () => <PlugView show="earth" colour={green} lines={['earth: green and', 'yellow, 0 V,', 'safety wire']} title="The inside of a plug with the green and yellow earth wire highlighted. The earth wire is at 0 V and is a safety wire." />,
    'mains-pd-live-earth': PdLiveEarth,
    'mains-shock': Shock,
    'mains-switch-off': SwitchOff,
    'mains-fire': Fire,
    'mains-q-plug': QPlug,
  }
  const View = views[focus]
  return View ? <View /> : null
}
