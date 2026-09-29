import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, TransferArrow, type Pt } from './PhysicsKit'
import { faded, r1, Card, Caption, DataTable, Marker, Label, Bulb, blob, fluffyRect, seeded } from './PowerVisuals'

/*
 * Physics Lesson 8: Reducing unwanted energy transfers. Original schematics; not to scale. Focus ids start with 'insul-'.
 *
 * Colours: useful transfers green, wasted transfers coral (as in every Physics lesson); energy leaving by heating is a
 * wavy red arrow; warm places a soft red tint, cold air a soft blue tint; lubricating oil a golden yellow; insulation
 * the same soft wool colour as the specific heat capacity practical. One lamp is reused through "Where does wasted
 * energy go?", one pair of rubbing surfaces through "How does lubrication help?", and one house through "How do we keep
 * a house warm?".
 */

const { ink, muted } = P
const wool = '#f4ecd9', woolLine = '#b39a6c'
const oil = '#f7d77a', oilLine = '#bf8f1d'
const metal = '#e4e9ee', metalLine = '#6f8292'

/** A wavy arrow: energy transferred by heating. */
function HeatArrow({ from, to, width = 3, colour = P.hot, opacity = 1, waves = 3 }: { from: Pt; to: Pt; width?: number; colour?: string; opacity?: number; waves?: number }) {
  const dx = to[0] - from[0], dy = to[1] - from[1], len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, nx = -uy, ny = ux
  const head = 7 + width * 1.6, bodyLen = len - head * 0.8, amp = 3 + width * 0.6
  let d = `M${from[0]} ${from[1]}`
  const n = waves * 2
  for (let i = 1; i <= n; i++) {
    const t0 = (i - 0.5) / n * bodyLen, t1 = i / n * bodyLen, s = i % 2 ? 1 : -1
    d += `Q${r1(from[0] + ux * t0 + nx * amp * s)} ${r1(from[1] + uy * t0 + ny * amp * s)} ${r1(from[0] + ux * t1)} ${r1(from[1] + uy * t1)}`
  }
  const b: Pt = [from[0] + ux * bodyLen, from[1] + uy * bodyLen]
  const tip = to, l: Pt = [tip[0] - ux * head + nx * head * 0.6, tip[1] - uy * head + ny * head * 0.6], rr: Pt = [tip[0] - ux * head - nx * head * 0.6, tip[1] - uy * head - ny * head * 0.6]
  return <g opacity={opacity}>
    <path d={d} stroke={colour} strokeWidth={width} fill="none" />
    <path d={`M${r1(tip[0])} ${r1(tip[1])}L${r1(l[0])} ${r1(l[1])}L${r1(b[0])} ${r1(b[1])}L${r1(rr[0])} ${r1(rr[1])}Z`} fill={colour} stroke={colour} strokeWidth="1" />
  </g>
}
/** Little rising heat marks. */
function Warmth({ x, y, n = 3, gap = 12, h = 16, opacity = 0.8 }: { x: number; y: number; n?: number; gap?: number; h?: number; opacity?: number }) {
  return <g opacity={opacity}>{Array.from({ length: n }, (_, i) => <path key={i} d={`M${x + (i - (n - 1) / 2) * gap} ${y}q-4 ${-h / 4} 0 ${-h / 2}t0 ${-h / 2}`} stroke={P.thermalLine} strokeWidth="2.2" fill="none" />)}</g>
}

/* ---------- Section 1: the lamp ---------- */

function DeskLamp({ x, y, dim = false }: { x: number; y: number; dim?: boolean }) {
  // (x, y) is the centre of the bulb.
  return <g opacity={dim ? faded : 1}>
    <path d={`M${x} ${y + 36}V${y + 110}`} stroke="#6b7f90" strokeWidth="5" />
    <path d={`M${x - 40} ${y + 118}Q${x} ${y + 104} ${x + 40} ${y + 118}Z`} fill="#dfe5ea" stroke="#6b7f90" strokeWidth="2.2" />
    <path d={`M${x - 30} ${y + 116}C${x - 60} ${y + 120} ${x - 70} ${y + 112} ${x - 96} ${y + 114}`} stroke={P.wire} strokeWidth="2.4" fill="none" />
    <rect x={x - 112} y={y + 106} width={18} height={14} rx="3" fill="#dfe5ea" stroke="#6b7f90" strokeWidth="1.8" />
    <Bulb x={x} y={y} r={26} />
  </g>
}
function LampScene({ focus }: { focus: string }) {
  const split = focus === 'insul-useful-wasted', spread = focus === 'insul-dissipate', total = focus === 'insul-conserved'
  const bx = 128, by = 104
  const title = split ? 'A lamp is switched on. Energy is transferred to it electrically. Most arrives as the light we want, which is useful. Some goes to the thermal store of the lamp and the air, which is wasted.'
    : spread ? 'The wasted energy spreads out from the lamp into the room in fading rings. It is dissipated into the thermal stores of the surroundings.'
      : 'Energy is never destroyed: 100 joules go in; 60 joules are useful and 40 joules are wasted. There are still 100 joules altogether.'
  return <PhysicsDiagram title={title}>
    {spread && [124, 96, 70, 46].map((r, i) => <path key={r} d={blob(bx, by + 6, r, r * 0.74, 30 + i, 0.05, 14)} fill={P.thermal} fillOpacity={0.08 + i * 0.05} stroke={P.thermalLine} strokeOpacity={0.15 + i * 0.1} strokeWidth="1.6" strokeDasharray="5 6" />)}
    <DeskLamp x={bx} y={by} dim={total} />
    {!total && <Warmth x={bx} y={by - 38} n={3} gap={14} />}
    {split && <g>
      <TransferArrow from={[18, 196]} to={[72, 196]} bend={0} colour={P.wire} width={3} />
      <text x={18} y={182} fontSize="14" fontWeight="700" fill={ink}>electrically</text>
      <TransferArrow from={[170, 86]} to={[300, 64]} bend={0.08} colour={P.useful} width={7} />
      <TransferArrow from={[166, 120]} to={[300, 160]} bend={-0.08} colour={P.wasted} width={3} />
      <rect x={310} y={34} width={214} height={60} rx="14" fill={P.usefulFill} stroke={P.useful} strokeWidth="2" />
      <Lines x={326} y={60} lines={['useful: light', '(the part we want)']} size={14} weight={750} colour={P.useful} />
      <rect x={310} y={134} width={214} height={60} rx="14" fill={P.wastedFill} stroke={P.wasted} strokeWidth="2" />
      <Lines x={326} y={160} lines={['wasted: thermal store', 'of the lamp and the air']} size={14} weight={750} colour={P.wasted} />
    </g>}
    {spread && <g>
      {[[-40, 0], [0, -40], [40, 0], [30, 40], [-30, 40]].map(([dx, dy], i) => <HeatArrow key={i} from={[bx + dx * 1.5, by + 6 + dy * 1.2]} to={[bx + dx * 2.9, by + 6 + dy * 2.2]} width={2} opacity={0.75} waves={2} />)}
      <Card x={318} y={96} w={206} h={82} tone="temp">
        <Lines x={334} y={126} lines={['dissipated: spread', 'out into the', 'surroundings']} size={14} weight={750} colour={P.thermalLine} />
      </Card>
      <Caption x={421} y={214} text="hard to use again" />
    </g>}
    {total && <g>
      <rect x={240} y={48} width={274} height={40} rx="12" fill="#eef2f5" stroke={muted} strokeWidth="2" />
      <text x={375} y={74} textAnchor="middle" fontSize="16" fontWeight="750" fill={ink}>100 J in</text>
      <text x={375} y={124} textAnchor="middle" fontSize="26" fontWeight="800" fill={ink}>=</text>
      <rect x={240} y={144} width={150} height={40} rx="12" fill={P.usefulFill} stroke={P.useful} strokeWidth="2" />
      <text x={315} y={170} textAnchor="middle" fontSize="15" fontWeight="750" fill={P.useful}>60 J useful</text>
      <rect x={394} y={144} width={120} height={40} rx="12" fill={P.wastedFill} stroke={P.wasted} strokeWidth="2" />
      <text x={454} y={170} textAnchor="middle" fontSize="15" fontWeight="750" fill={P.wasted}>40 J wasted</text>
      <Card x={262} y={210} w={226} h={46} tone="power" strong>
        <text x={375} y={239} textAnchor="middle" fontSize="15" fontWeight="750" fill="#2f8a6e">still 100 J altogether</text>
      </Card>
    </g>}
  </PhysicsDiagram>
}

/* ---------- Two ways to waste less ---------- */

function Gear({ x, y, r = 28, teeth = 10, fill = metal, line = metalLine }: { x: number; y: number; r?: number; teeth?: number; fill?: string; line?: string }) {
  const pts: string[] = []
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2, rr = i % 2 ? r : r + 7
    pts.push(`${r1(x + Math.cos(a) * rr)} ${r1(y + Math.sin(a) * rr)}`)
  }
  return <g><path d={`M${pts.join('L')}Z`} fill={fill} stroke={line} strokeWidth="2" /><circle cx={x} cy={y} r={r * 0.3} fill="white" stroke={line} strokeWidth="2" /></g>
}
function OilCan({ x, y }: { x: number; y: number }) {
  // (x, y) is the middle of the can; the spout points down to the left.
  return <g>
    <path d={`M${x + 20} ${y - 14}C${x + 40} ${y - 16} ${x + 40} ${y + 16} ${x + 22} ${y + 14}`} stroke={metalLine} strokeWidth="3.4" fill="none" />
    <path d={`M${x - 22} ${y + 22}V${y - 8}Q${x - 22} ${y - 22} ${x - 8} ${y - 24}H${x + 8}Q${x + 22} ${y - 22} ${x + 22} ${y - 8}V${y + 22}Q${x + 22} ${y + 28} ${x + 14} ${y + 28}H${x - 14}Q${x - 22} ${y + 28} ${x - 22} ${y + 22}Z`} fill="#e6ecef" stroke={metalLine} strokeWidth="2" />
    <path d={`M${x - 16} ${y - 4}L${x - 50} ${y + 22}`} stroke={metalLine} strokeWidth="4" />
    <path d={`M${x - 54} ${y + 30}q4 8 0 14q-4 -6 0 -14Z`} fill={oil} stroke={oilLine} strokeWidth="1.4" />
  </g>
}
function TwoWays() {
  return <PhysicsDiagram title="Two ways to waste less energy: lubrication, such as oil on moving gears, reduces friction; insulation, such as a thick layer on a wall, slows down energy transfer by heating.">
    <Card x={20} y={24} w={240} h={220} strong />
    <Gear x={96} y={130} r={30} />
    <Gear x={160} y={154} r={22} teeth={8} />
    <OilCan x={206} y={80} />
    <Lines x={140} y={216} anchor="middle" lines={['lubrication:', 'less friction']} size={15} weight={750} colour={oilLine} />
    <Card x={280} y={24} w={240} h={220} strong />
    {/* wall with a thick insulating layer */}
    <rect x={330} y={50} width={40} height={130} rx="4" fill="#e9c8b4" stroke="#a4694b" strokeWidth="2" />
    {[66, 92, 118, 144, 170].map(y => <path key={y} d={`M332 ${y}H368`} stroke="#c49a80" strokeWidth="1.4" />)}
    <path d={fluffyRect(370, 50, 36, 130, 5, 3, 10)} fill={wool} stroke={woolLine} strokeWidth="2" />
    <HeatArrow from={[300, 100]} to={[344, 100]} width={4} waves={2} />
    <HeatArrow from={[412, 100]} to={[448, 100]} width={1.8} waves={2} opacity={0.6} />
    <text x={306} y={140} fontSize="13" fontWeight="650" fill={P.hot}>warm</text>
    <text x={462} y={140} fontSize="13" fontWeight="650" fill={P.cold}>cold</text>
    <Lines x={400} y={216} anchor="middle" lines={['insulation: slower', 'transfer by heating']} size={15} weight={750} colour={woolLine} />
  </PhysicsDiagram>
}

/* ---------- Section 2: friction and lubrication ---------- */

function roughEdge(x0: number, x1: number, y: number, seed: number, up: boolean) {
  const rand = seeded(seed), pts: string[] = []
  for (let x = x0; x <= x1; x += 8) pts.push(`${x} ${r1(y + (up ? -1 : 1) * (rand() * 6))}`)
  return pts.join('L')
}
function Surfaces({ focus }: { focus: string }) {
  const lube = focus === 'insul-lubricant'
  const gap = lube ? 10 : 0, top = 150
  const title = lube ? 'The same two surfaces with a smooth layer of oil between them. The oil is a lubricant: the surfaces slide past each other easily, so there is less friction and far fewer heat marks.'
    : 'Two rough surfaces rubbing as one slides over the other. Friction at the rough contact warms the surfaces: energy is dissipated to the thermal store of the parts and the air.'
  return <PhysicsDiagram title={title}>
    {/* lower surface */}
    <path d={`M40 ${top + gap}L${roughEdge(40, 500, top + gap, 3, true)}L500 ${top + 90}Q500 ${top + 98} 492 ${top + 98}H48Q40 ${top + 98} 40 ${top + 90}Z`} fill="#dfe5ea" stroke={metalLine} strokeWidth="2.2" />
    {/* upper sliding block */}
    {lube && <path d={`M40 ${top - 3}C120 ${top - 7} 200 ${top + 1} 280 ${top - 4}S440 ${top - 8} 500 ${top - 3}V${top + gap + 4}H40Z`} fill={oil} stroke={oilLine} strokeWidth="1.6" />}
    {lube && [90, 200, 320, 450].map((x, i) => <ellipse key={x} cx={x} cy={top + 3} rx={8 + (i % 2) * 3} ry="3" fill="#fbe7a8" />)}
    <g transform={`translate(0 ${lube ? -6 : 0})`}><path d={`M140 ${top}L${roughEdge(140, 380, top, 8, false)}L380 ${top - 70}Q380 ${top - 80} 370 ${top - 80}H150Q140 ${top - 80} 140 ${top - 70}Z`} fill="#eef1f4" stroke={metalLine} strokeWidth="2.2" /></g>
    <TransferArrow from={[200, top - 104]} to={[330, top - 104]} bend={0} colour={ink} width={3} />
    <text x={265} y={top - 116} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>sliding</text>
    {!lube && <g>
      <Warmth x={180} y={top - 4} n={2} gap={14} h={18} />
      <Warmth x={260} y={top - 4} n={3} gap={14} h={20} />
      <Warmth x={340} y={top - 4} n={2} gap={14} h={18} />
      <Label x={420} y={100} to={[372, top - 2]} lines={['friction:', 'parts warm up']} colour={P.thermalLine} />
    </g>}
    {lube && <g>
      <Warmth x={260} y={top - 6} n={1} h={14} opacity={0.5} />
      <Label x={420} y={100} to={[430, top + 4]} lines={['lubricant', '(oil)']} colour={oilLine} />
    </g>}
    <Caption y={290} text={lube ? 'slides easily: less friction' : 'rough surfaces rub: friction'} />
  </PhysicsDiagram>
}
function LubeResult() {
  return <PhysicsDiagram title="Lubrication at work: oil on a bicycle chain and oil in a car engine reduce friction, so less energy is wasted.">
    {/* bicycle chain over a sprocket */}
    <Gear x={96} y={110} r={38} teeth={14} />
    <path d="M96 64H226M96 156H226" stroke="#4a4f57" strokeWidth="7" strokeDasharray="8 4" />
    <path d="M226 64A46 46 0 0 1 226 156" stroke="#4a4f57" strokeWidth="7" strokeDasharray="8 4" fill="none" />
    <Gear x={226} y={110} r={30} teeth={11} />
    <path d="M150 44q5 10 0 18q-5 -8 0 -18Z" fill={oil} stroke={oilLine} strokeWidth="1.6" />
    <text x={150} y={196} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>bicycle chain</text>
    {/* engine block */}
    <path d="M300 88H396V76H420V88H448Q458 88 458 98V160Q458 170 448 170H300Q290 170 290 160V98Q290 88 300 88Z" fill="#e3e8ee" stroke={metalLine} strokeWidth="2.2" />
    {[312, 340, 368, 396, 424].map(x => <path key={x} d={`M${x} 104V154`} stroke="#b5c0cb" strokeWidth="3" />)}
    <path d="M374 48q5 10 0 18q-5 -8 0 -18Z" fill={oil} stroke={oilLine} strokeWidth="1.6" />
    <text x={374} y={196} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>car engine</text>
    {/* before and after bars */}
    <text x={310} y={218} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>wasted energy</text>
    <text x={198} y={237} textAnchor="end" fontSize="13" fontWeight="650" fill={ink}>no oil</text>
    <rect x={210} y={224} width={200} height={16} rx="8" fill={P.wastedFill} stroke={P.wasted} strokeWidth="1.8" />
    <text x={198} y={267} textAnchor="end" fontSize="13" fontWeight="650" fill={ink}>with oil</text>
    <rect x={210} y={254} width={80} height={16} rx="8" fill={P.wastedFill} stroke={P.wasted} strokeWidth="1.8" />
    <text x={300} y={267} fontSize="14" fontWeight="750" fill={P.wasted}>less</text>
  </PhysicsDiagram>
}

/* ---------- Section 3: conduction and insulators ---------- */

const warmScale = ['#d9533e', '#e27a5f', '#eba184', '#f2c6b0', '#f4dccf', '#eef2f5']
function Conduction() {
  return <PhysicsDiagram title="A metal spoon stands in a bowl of hot soup. The end in the soup is hot; the colour fades along the handle as energy passes gradually through the spoon. This is conduction.">
    {/* the spoon, coloured in stages from hot to cool */}
    {warmScale.map((c, i) => {
      const t0 = i / warmScale.length, t1 = (i + 1) / warmScale.length
      const a: Pt = [210 + t0 * 190, 200 - t0 * 150], b: Pt = [210 + t1 * 190, 200 - t1 * 150]
      return <path key={i} d={`M${r1(a[0])} ${r1(a[1])}L${r1(b[0])} ${r1(b[1])}`} stroke={c} strokeWidth="14" strokeLinecap={i === warmScale.length - 1 ? 'round' : 'butt'} />
    })}
    <path d="M210 200L400 50" stroke={metalLine} strokeWidth="1.4" fill="none" opacity=".6" />
    {/* bowl and soup */}
    <path d="M90 170H330Q326 250 210 256Q94 250 90 170Z" fill="#f6efe6" stroke="#a4694b" strokeWidth="2.4" />
    <path d="M96 176Q210 170 324 176Q318 228 210 234Q102 228 96 176Z" fill="#f1b37e" stroke="#c8671f" strokeWidth="1.6" />
    <Warmth x={160} y={160} n={4} gap={16} />
    <TransferArrow from={[262, 128]} to={[352, 58]} bend={-0.18} colour={P.hot} width={3} />
    <Label x={372} y={130} lines={['energy passes', 'along:', 'conduction']} colour={P.hot} />
    <text x={404} y={34} textAnchor="middle" fontSize="13" fontWeight="650" fill={P.cold}>cooler end</text>
    <text x={150} y={282} textAnchor="middle" fontSize="13" fontWeight="650" fill={P.hot}>hot soup</text>
  </PhysicsDiagram>
}
function Rod({ y, reach, label, sub, time }: { y: number; reach: number; label: string; sub: string; time: string }) {
  const x0 = 110, x1 = 400, n = 12, w = (x1 - x0) / n
  return <g>
    {Array.from({ length: n }, (_, i) => {
      const t = i / (n - 1), heat = Math.max(0, 1 - t / reach)
      const c = heat > 0.66 ? '#e27a5f' : heat > 0.33 ? '#eba184' : heat > 0.02 ? '#f4d2c3' : '#eef2f5'
      return <rect key={i} x={r1(x0 + i * w)} y={y - 9} width={r1(w + 0.5)} height={18} fill={c} />
    })}
    <rect x={x0} y={y - 9} width={x1 - x0} height={18} rx="9" fill="none" stroke={metalLine} strokeWidth="2" />
    {/* small flame */}
    <path d={`M${x0 + 8} ${y + 36}C${x0 - 4} ${y + 30} ${x0} ${y + 18} ${x0 + 8} ${y + 10}C${x0 + 10} ${y + 18} ${x0 + 18} ${y + 22} ${x0 + 8} ${y + 36}Z`} fill="#f5a54a" stroke="#c8641e" strokeWidth="1.4" />
    <text x={x1 + 14} y={y - 2} fontSize="14" fontWeight="750" fill={ink}>{label}</text>
    <text x={x1 + 14} y={y + 16} fontSize="13" fontWeight="600" fill={muted}>{sub}</text>
    <text x={x0 + 30} y={y + 32} fontSize="13" fontWeight="650" fill={muted}>{time}</text>
  </g>
}
function Conductivity() {
  return <PhysicsDiagram title="Two rods are heated at one end for the same short time. In the rod with high thermal conductivity the warmth has reached the far end; in the rod with low thermal conductivity it has only just started to spread.">
    <text x={255} y={40} textAnchor="middle" fontSize="14" fontWeight="700" fill={muted}>both heated for the same short time</text>
    <Rod y={96} reach={1.2} label="high thermal" sub="conductivity" time="warm all along" />
    <Rod y={196} reach={0.3} label="low thermal" sub="conductivity" time="still cool at the far end" />
    <Caption y={284} text="thermal conductivity: how quickly energy passes through" />
  </PhysicsDiagram>
}
function Saucepan() {
  return <PhysicsDiagram title="A saucepan on a flame. Its metal body has a high thermal conductivity and gets hot. Its plastic handle has a low thermal conductivity, so it is a thermal insulator and stays cooler.">
    <path d="M110 210C150 216 190 216 226 210" stroke="#b9a58a" strokeWidth="3" fill="none" />
    {[130, 160, 190].map(x => <path key={x} d={`M${x} 226C${x - 10} 220 ${x - 6} 210 ${x} 200C${x + 4} 210 ${x + 12} 214 ${x} 226Z`} fill="#f5a54a" stroke="#c8641e" strokeWidth="1.4" />)}
    <path d="M86 110H256V180Q256 196 240 196H102Q86 196 86 180Z" fill="#f2c6b0" stroke={P.hot} strokeWidth="2.6" />
    <path d="M80 110H262" stroke={P.hot} strokeWidth="4" />
    <Warmth x={170} y={100} n={3} gap={16} />
    <path d="M256 128H300" stroke={metalLine} strokeWidth="8" />
    <rect x={296} y={116} width={150} height={24} rx="12" fill={P.coldFill} stroke={P.cold} strokeWidth="2.4" />
    <Label x={60} y={260} to={[120, 180]} lines={['metal body: high', 'thermal conductivity']} colour={P.hot} />
    <Label x={330} y={196} to={[380, 140]} lines={['plastic handle: low', 'thermal conductivity', '= thermal insulator']} colour={P.cold} />
  </PhysicsDiagram>
}
function WoollyHat() {
  return <PhysicsDiagram title="A person in a woolly hat on a cold day. The hat is a thermal insulator: it slows the transfer of energy from the warm head to the cold air, so the person stays warmer.">
    {[[60, 60], [440, 230], [90, 250]].map(([cx, cy], i) => <path key={i} d={`M${cx - 30} ${cy}q15 -10 30 0t30 0`} stroke={P.cold} strokeWidth="2" fill="none" opacity=".5" />)}
    {/* shoulders and head */}
    <path d="M110 300C110 240 150 214 200 214C250 214 290 240 290 300Z" fill="#cfe0ee" stroke="#4f7ea3" strokeWidth="2.2" />
    <path d={blob(200, 158, 50, 56, 4, 0.03)} fill="#f1c9a5" stroke="#b88660" strokeWidth="2.2" />
    <circle cx={183} cy={160} r="3.4" fill={ink} /><circle cx={217} cy={160} r="3.4" fill={ink} />
    <path d="M186 186q14 8 28 0" stroke="#b88660" strokeWidth="2" fill="none" />
    {/* hat */}
    <path d="M146 136C146 76 254 76 254 136Z" fill="#e8b9c9" stroke="#ad4880" strokeWidth="2.4" />
    <path d={fluffyRect(140, 124, 120, 24, 2, 3, 9)} fill="#f3d3de" stroke="#ad4880" strokeWidth="2.2" />
    <path d={blob(200, 78, 14, 13, 6, 0.15)} fill="#f3d3de" stroke="#ad4880" strokeWidth="2" />
    {[164, 184, 204, 224, 244].map(x => <path key={x} d={`M${x} 96V124`} stroke="#c97fa0" strokeWidth="1.6" opacity=".7" />)}
    {/* energy: slowed through the hat */}
    <HeatArrow from={[168, 102]} to={[140, 44]} width={1.6} waves={2} opacity={0.6} />
    <HeatArrow from={[252, 170]} to={[318, 170]} width={3.4} waves={2} />
    <text x={330} y={176} fontSize="13" fontWeight="650" fill={P.hot}>bare skin: faster</text>
    <text x={420} y={40} textAnchor="middle" fontSize="15" fontWeight="700" fill={P.cold}>cold air</text>
    <Card x={322} y={70} w={200} h={64} tone="plain" strong>
      <Lines x={336} y={96} lines={['thermal insulator:', 'slows the transfer']} size={14} weight={750} colour="#ad4880" />
    </Card>
    <path d="M322 100L240 96" stroke={ink} strokeWidth="1.4" /><circle cx={240} cy={96} r="2.6" fill={ink} />
  </PhysicsDiagram>
}

/* ---------- Section 4: the house ---------- */

type HouseOpts = { x: number; y: number; s?: number; wall?: number; loft?: boolean; arrows?: { roof?: number; wall?: number; window?: number; floor?: number }; wallFill?: string; wallLine?: string; numbered?: boolean; children?: ReactNode }
/** A house cut in half: roof and loft, two walls with a window on the right, and a floor. (x, y) is the bottom-left corner of the floor. */
function House({ x, y, s = 1, wall = 12, loft = false, arrows = {}, wallFill = '#e9c8b4', wallLine = '#a4694b', numbered = false }: HouseOpts) {
  const W = 240, H = 110, left = 0, right = W, ceiling = -H, apex = -H - 80
  const A = { roof: 3, wall: 3, window: 3, floor: 3, ...arrows }
  const arrow = (w: number, from: Pt, to: Pt) => w > 0 && <HeatArrow from={from} to={to} width={w} waves={2} opacity={w < 2 ? 0.6 : 1} />
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* warm inside */}
    <rect x={left + wall} y={ceiling} width={W - 2 * wall} height={H} fill={P.hotFill} />
    {/* loft space */}
    <path d={`M${left - 6} ${ceiling}L${W / 2} ${apex}L${right + 6} ${ceiling}Z`} fill="#f7f1ea" />
    {loft && <path d={fluffyRect(left + 14, ceiling - 22, W - 28, 22, 9, 3, 11)} fill={wool} stroke={woolLine} strokeWidth="2" />}
    <path d={`M${left - 18} ${ceiling + 4}L${W / 2} ${apex - 8}L${right + 18} ${ceiling + 4}`} stroke="#a5634a" strokeWidth="12" fill="none" />
    <path d={`M${left - 18} ${ceiling + 4}L${W / 2} ${apex - 8}L${right + 18} ${ceiling + 4}`} stroke="#d99a7c" strokeWidth="7" fill="none" />
    <path d={`M${left} ${ceiling}H${right}`} stroke="#b9a58a" strokeWidth="4" />
    {/* walls */}
    <rect x={left} y={ceiling} width={wall} height={H} fill={wallFill} stroke={wallLine} strokeWidth="2" />
    <rect x={right - wall} y={ceiling} width={wall} height={H} fill={wallFill} stroke={wallLine} strokeWidth="2" />
    {/* window in the right wall */}
    <rect x={right - wall - 1} y={ceiling + 26} width={wall + 2} height={40} fill={P.water} stroke="#3f93bd" strokeWidth="2" />
    {/* floor */}
    <rect x={left} y={0} width={W} height={10} rx="3" fill="#d8cbb8" stroke="#9c8a74" strokeWidth="2" />
    {/* a radiator */}
    <rect x={40} y={-44} width={36} height={30} rx="4" fill="white" stroke={P.hot} strokeWidth="2" />
    {[48, 56, 64].map(rx => <path key={rx} d={`M${rx} -40V-18`} stroke={P.hot} strokeWidth="1.6" />)}
    {arrow(A.roof, [W / 2 - 40, ceiling + 16], [W / 2 - 66, apex - 22])}
    {arrow(A.wall, [wall + 8, -60], [-48, -60])}
    {arrow(A.window, [right - wall - 8, ceiling + 46], [right + 48, ceiling + 46])}
    {arrow(A.floor, [W / 2 + 40, -8], [W / 2 + 40, 44])}
    {numbered && <g>
      <Marker n={1} x={W / 2 - 110} y={apex - 12} to={[W / 2 - 66, apex - 16]} />
      <Marker n={2} x={-62} y={-92} to={[-40, -64]} />
      <Marker n={3} x={right + 70} y={ceiling + 12} to={[right + 40, ceiling + 42]} />
      <Marker n={4} x={W / 2 + 84} y={40} to={[W / 2 + 46, 34]} />
    </g>}
  </g>
}
function Outside({ children, title }: { children: ReactNode; title: string }) {
  return <PhysicsDiagram title={title}>
    <rect x={0} y={0} width={540} height={300} rx="14" fill={P.coldFill} opacity=".5" />
    <path d="M0 252Q270 246 540 252V286Q540 300 526 300H14Q0 300 0 286Z" fill="#efe3cf" />
    {children}
  </PhysicsDiagram>
}
function HouseScene({ focus }: { focus: string }) {
  if (focus === 'insul-house-cools') return <Outside title="A house cut in half on a cold day. It is warm inside and cold outside. Wavy arrows show energy leaving through the roof, the walls, the window and the floor. How fast this happens is the rate of cooling.">
    <House x={150} y={242} />
    <text x={270} y={196} textAnchor="middle" fontSize="15" fontWeight="750" fill={P.hot}>warm</text>
    <text x={60} y={40} fontSize="15" fontWeight="750" fill={P.cold}>cold outside</text>
    <Card x={404} y={24} w={126} h={56} tone="temp">
      <Lines x={467} y={48} anchor="middle" lines={['rate of', 'cooling']} size={14} weight={750} colour={P.hot} />
    </Card>
  </Outside>
  if (focus === 'insul-thickness') return <Outside title="Two houses. The house with thin walls loses energy quickly through its walls, shown by thick arrows. The house with thick walls loses energy slowly, shown by thin arrows.">
    <House x={36} y={236} s={0.72} wall={8} arrows={{ roof: 0, floor: 0, window: 0, wall: 3.6 }} />
    <House x={316} y={236} s={0.72} wall={30} arrows={{ roof: 0, floor: 0, window: 0, wall: 1.4 }} />
    <Lines x={122} y={276} anchor="middle" lines={['thin walls: cools quickly']} size={14} weight={750} colour={P.hot} />
    <Lines x={402} y={276} anchor="middle" lines={['thick walls: cools slowly']} size={14} weight={750} colour={P.useful} />
  </Outside>
  if (focus === 'insul-wall-material') return <Outside title="Two pieces of wall, the same thickness. Energy passes quickly through the wall with a high thermal conductivity (many arrows) and slowly through the wall with a low thermal conductivity (few arrows).">
    {[0, 1].map(i => {
      const x = 90 + i * 270, low = i === 1
      return <g key={i}>
        <rect x={x - 70} y={40} width={70} height={180} fill={P.hotFill} />
        <rect x={x} y={40} width={50} height={180} rx="4" fill={low ? '#f1ead9' : '#dfe5ea'} stroke={low ? woolLine : metalLine} strokeWidth="2.2" />
        {low ? [60, 100, 140, 180].map(y => <path key={y} d={`M${x + 8} ${y}q8 -8 17 0t17 0`} stroke={woolLine} strokeWidth="1.4" fill="none" />) : [70, 110, 150, 190].map(y => <path key={y} d={`M${x} ${y}H${x + 50}`} stroke="#b5c0cb" strokeWidth="1.4" />)}
        {(low ? [130] : [70, 110, 150, 190]).map(y => <HeatArrow key={y} from={[x - 46, y]} to={[x + 100, y]} width={low ? 1.8 : 3} waves={3} opacity={low ? 0.7 : 1} />)}
        <text x={x - 35} y={34} textAnchor="middle" fontSize="13" fontWeight="650" fill={P.hot}>inside</text>
        <text x={x + 85} y={34} textAnchor="middle" fontSize="13" fontWeight="650" fill={P.cold}>outside</text>
        <Lines x={x + 25} y={250} anchor="middle" lines={[low ? 'low thermal' : 'high thermal', 'conductivity']} size={14} weight={750} colour={low ? P.useful : P.hot} />
      </g>
    })}
  </Outside>
  // insul-loft
  return <Outside title="The same house with a thick fluffy layer of loft insulation above the ceiling. Much less energy now leaves through the roof.">
    <House x={150} y={242} loft arrows={{ roof: 1.3 }} />
    <Label x={30} y={60} to={[190, 110]} lines={['loft insulation']} colour={woolLine} />
    <Card x={404} y={24} w={126} h={56} tone="power">
      <Lines x={467} y={48} anchor="middle" lines={['less lost', 'through roof']} size={14} weight={750} colour="#2f8a6e" />
    </Card>
  </Outside>
}

/* ---------- Questions ---------- */

function QuestionHouse() {
  return <Outside title="A house with four numbered arrows showing energy leaving it.">
    <House x={150} y={232} arrows={{ roof: 2.6, wall: 2.6, window: 2.6, floor: 2.6 }} numbered />
  </Outside>
}
function QuestionCooling() {
  return <PhysicsDiagram schematic={false} viewBox="0 0 540 210" title="A table for three materials wrapped round identical beakers of hot water. Each started at 80 degrees Celsius. After 10 minutes: material A 52 degrees, material B 66 degrees, material C 71 degrees.">
    <DataTable x={60} y={20} widths={[140, 130, 150]} head={['Material', 'Start (°C)', 'After 10|minutes (°C)']} rows={[['A', '80', '52'], ['B', '80', '66'], ['C', '80', '71']]} rowH={40} />
  </PhysicsDiagram>
}

export function InsulationVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'insul-useful-wasted': case 'insul-dissipate': case 'insul-conserved': return <LampScene focus={focus} />
    case 'insul-two-ways': return <TwoWays />
    case 'insul-friction': case 'insul-lubricant': return <Surfaces focus={focus} />
    case 'insul-lubricate-result': return <LubeResult />
    case 'insul-conduction': return <Conduction />
    case 'insul-conductivity': return <Conductivity />
    case 'insul-conductors': return <Saucepan />
    case 'insul-insulators-use': return <WoollyHat />
    case 'insul-house-cools': case 'insul-thickness': case 'insul-wall-material': case 'insul-loft': return <HouseScene focus={focus} />
    case 'insul-q-house': return <QuestionHouse />
    case 'insul-q-cooling': return <QuestionCooling />
    default: return null
  }
}

