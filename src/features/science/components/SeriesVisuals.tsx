import { physicsPalette as P, PhysicsDiagram, Cell, wirePath, type Pt } from './PhysicsKit'
import { Circuit, Tag, pdTag, currentTag, resTag, Caption, EqCard, Arrow, MoreResistance, loop, faded, type Part } from './OhmVisuals'

/*
 * Physics Lesson 20: Series circuits. Original schematics; not to scale. Focus ids start with 'series-'.
 *
 * Colours (PhysicsKit): current vermilion, pd violet, resistance brown, wires ink. Ammeters sit in the loop and
 * voltmeters on their own branch across a component. The two-lamp loop is reused through "What is a series circuit?";
 * the worked example (24 V battery, 4.0 Ω and 8.0 Ω) is reused through "How do you calculate the current?".
 * Conventional current leaves the + terminal (the long line of the cell).
 */
const { ink, muted } = P
const I = (x: number, y: number, rotate: number) => ({ x, y, rotate })

// A soft band inside a loop showing the one path round (current direction, with arrowheads).
function PathBand({ left, top, right, bottom, width = 7, clockwise = false }: { left: number; top: number; right: number; bottom: number; width?: number; clockwise?: boolean }) {
  const pts: Pt[] = [[left, top], [right, top], [right, bottom], [left, bottom], [left, top]]
  const d = wirePath([[(left + right) / 2, top], ...pts.slice(1), [(left + right) / 2 - 1, top]], 22)
  const heads = clockwise
    ? [I((left + right) / 2, top, 0), I(right, (top + bottom) / 2, 90), I((left + right) / 2, bottom, 180), I(left, (top + bottom) / 2, -90)]
    : [I((left + right) / 2, top, 180), I(left, (top + bottom) / 2, 90), I((left + right) / 2, bottom, 0), I(right, (top + bottom) / 2, -90)]
  return <g>
    <path d={d} stroke={P.current} strokeWidth={width} fill="none" opacity=".22" />
    {heads.map((h, i) => <path key={i} transform={`translate(${h.x} ${h.y}) rotate(${h.rotate})`} d="M9 0L-6 -8L-3 0L-6 8Z" fill={P.current} />)}
  </g>
}

// ---------- The two-lamp loop ----------
const LL = 80, LR = 400, LT = 70, LB = 200
function LampLoop({ gap = false, voltmeter = false, lit = true, band = false }: { gap?: boolean; voltmeter?: boolean; lit?: boolean; band?: boolean }) {
  const parts: Part[] = [
    { kind: 'battery', x: 240, y: LT, dim: voltmeter },
    { kind: lit ? 'litLamp' : 'lamp', x: 170, y: LB, dim: voltmeter },
    gap ? { kind: 'missing', x: 310, y: LB } : { kind: lit ? 'litLamp' : 'lamp', x: 310, y: LB, dim: voltmeter },
  ]
  return <g>
    <Circuit loops={[loop(LL, LT, LR, LB)]} parts={parts} dim={voltmeter} />
    <text x={219} y={52} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink} opacity={voltmeter ? faded : 1}>+</text>
    {band && <PathBand left={LL + 22} top={LT + 22} right={LR - 22} bottom={LB - 22} />}
    {voltmeter && <Circuit runs={[[[130, LB], [130, 262], [210, 262], [210, LB]]]} parts={[{ kind: 'voltmeter', x: 170, y: 262, hi: true }]} junctions={[[130, LB], [210, LB]]} />}
  </g>
}

// ---------- The worked example ----------
function Worked({ ammeter, dim = false }: { ammeter?: string; dim?: boolean }) {
  return <g opacity={dim ? faded : 1}>
    <Circuit loops={[loop(40, 80, 260, 230)]} parts={[{ kind: 'battery', x: 40, y: 155, rotate: 90 }, { kind: 'resistor', x: 105, y: 80 }, { kind: 'resistor', x: 195, y: 80 }, { kind: 'ammeter', x: 260, y: 155, rotate: 90 }]} arrows={[{ x: 150, y: 80, rotate: 0 }]} />
    {pdTag(64, 155, '24 V', 'start')}
    {resTag(105, 48, '4.0 Ω')}
    {resTag(195, 48, '8.0 Ω')}
    {currentTag(236, 155, ammeter ?? 'I = ?', 'end')}
  </g>
}

// ---------- Cells in a row ----------
function CellRow({ x, y, n }: { x: number; y: number; n: number }) {
  const pitch = 64, start = x - ((n - 1) * pitch) / 2
  const xs = Array.from({ length: n }, (_, i) => start + i * pitch)
  const left = xs[0] - 32, right = xs[n - 1] + 32
  return <g>
    <path d={`M${left - 16} ${y}H${right + 16}`} stroke={P.wire} strokeWidth="2.5" />
    {xs.map(cx => <g key={cx}>
      <rect x={cx - 14} y={y - 20} width={28} height={40} fill="white" />
      <Cell x={cx} y={y} length={40} signs />
      <text x={cx} y={y - 32} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.pd}>1.5 V</text>
    </g>)}
    <path d={`M${left} ${y + 26}v8H${right}v-8M${x} ${y + 34}v8`} stroke={P.pd} strokeWidth="2" fill="none" />
    {pdTag(x, y + 60, `${(1.5 * n).toFixed(1)} V`)}
  </g>
}

export function SeriesVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'series-loop': return <PhysicsDiagram title="A series circuit: a battery and two lamps connected one after another in a single loop. The charge has only one path to follow.">
      <LampLoop band />
      <Tag x={240} y={136} text="one loop, one path" colour={P.current} fill="#fbe5dc" size={14} />
      <Caption text="components one after another" y={270} />
    </PhysicsDiagram>
    case 'series-break': return <PhysicsDiagram title="One lamp taken out leaves a gap in the loop. The circuit is broken, so the other lamp goes out too.">
      <LampLoop gap lit={false} />
      <Tag x={240} y={136} text="one gap: all stop" colour={P.wasted} fill={P.wastedFill} size={14} />
      <text x={310} y={246} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>lamp removed</text>
      <text x={170} y={246} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>goes out</text>
    </PhysicsDiagram>
    case 'series-voltmeter': return <PhysicsDiagram title="A voltmeter connected across one lamp, on its own branch. Voltmeters are always connected in parallel, so they are not part of the series loop.">
      <LampLoop voltmeter lit={false} />
      <text x={420} y={206} fontSize="14" fontWeight="700" fill={P.pd}>voltmeter:</text>
      <text x={420} y={226} fontSize="14" fontWeight="700" fill={P.pd}>in parallel,</text>
      <text x={420} y={250} fontSize="13" fontWeight="650" fill={muted}>not part of the</text>
      <text x={420} y={268} fontSize="13" fontWeight="650" fill={muted}>series loop</text>
    </PhysicsDiagram>
    case 'series-uses': return <PhysicsDiagram title="A small test circuit: a battery, a component and an ammeter in series, with a voltmeter across the component. Series circuits are used for measuring and testing.">
      <g transform="translate(60 0)">
      <Circuit loops={[loop(90, 110, 330, 240)]} parts={[{ kind: 'battery', x: 90, y: 175, rotate: 90 }, { kind: 'resistor', x: 210, y: 110 }, { kind: 'ammeter', x: 330, y: 175, rotate: 90 }]} />
      <Circuit runs={[[[160, 110], [160, 50], [260, 50], [260, 110]]]} parts={[{ kind: 'voltmeter', x: 210, y: 50 }]} junctions={[[160, 110], [260, 110]]} />
      <text x={210} y={140} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>component</text>
      <Tag x={210} y={278} text="used for measuring and testing" colour={P.useful} fill={P.usefulFill} size={14} />
      </g>
    </PhysicsDiagram>
    case 'series-current': {
      const parts: Part[] = [
        { kind: 'battery', x: 60, y: 150, rotate: 90 },
        { kind: 'litLamp', x: 150, y: 80 }, { kind: 'ammeter', x: 240, y: 80 }, { kind: 'litLamp', x: 330, y: 80 },
        { kind: 'ammeter', x: 420, y: 150, rotate: 90 }, { kind: 'ammeter', x: 240, y: 220 },
      ]
      return <PhysicsDiagram title="Three ammeters in different places in one series loop all read 0.30 A. The current is the same everywhere: I₁ = I₂ = I₃.">
        <PathBand left={82} top={102} right={398} bottom={198} width={6} clockwise />
        <Circuit loops={[loop(60, 80, 420, 220)]} parts={parts} />
        {currentTag(240, 44, 'A₁: 0.30 A')}
        {currentTag(470, 110, 'A₂: 0.30 A')}
        {currentTag(240, 256, 'A₃: 0.30 A')}
        <text x={470} y={228} textAnchor="middle" fontSize="15" fontWeight="750" fill={P.current}>I₁ = I₂ = I₃</text>
      </PhysicsDiagram>
    }
    case 'series-pd': {
      const T = 100, B = 184
      return <PhysicsDiagram title="The 9 V supply pd is shared between two lamps: 4 V across one and 5 V across the other. 4 V + 5 V = 9 V, so V total = V₁ + V₂.">
        <text x={100} y={20} fontSize="13" fontWeight="700" fill={P.pd}>supply: 9 V</text>
        <rect x={100} y={28} width={340} height={28} rx="10" fill="#d9c8f0" stroke={P.pd} strokeWidth="1.8" />
        <path d={`M110 28H${100 + 340 * 4 / 9}V56H110a10 10 0 0 1 -10 -10V38a10 10 0 0 1 10 -10Z`} fill={P.pdFill} />
        <rect x={100} y={28} width={340} height={28} rx="10" fill="none" stroke={P.pd} strokeWidth="1.8" />
        <path d={`M${100 + 340 * 4 / 9} 28V56`} stroke={P.pd} strokeWidth="2.2" />
        <text x={100 + 170 * 4 / 9} y={47} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.pd}>V₁ = 4 V</text>
        <text x={100 + 340 * 4 / 9 + 170 * 5 / 9} y={47} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.pd}>V₂ = 5 V</text>
        <Circuit loops={[loop(60, T, 440, B)]} parts={[{ kind: 'battery', x: 250, y: T }, { kind: 'litLamp', x: 150, y: B }, { kind: 'litLamp', x: 350, y: B }]} />
        <text x={229} y={84} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>+</text>
        {pdTag(250, T + 32, '9 V')}
        <Circuit runs={[[[110, B], [110, 250], [190, 250], [190, B]], [[310, B], [310, 250], [390, 250], [390, B]]]} parts={[{ kind: 'voltmeter', x: 150, y: 250 }, { kind: 'voltmeter', x: 350, y: 250 }]} junctions={[[110, B], [190, B], [310, B], [390, B]]} />
        {pdTag(206, 250, '4 V', 'start')}
        {pdTag(406, 250, '5 V', 'start')}
        <text x={494} y={140} textAnchor="middle" fontSize="15" fontWeight="750" fill={P.pd}>V total</text>
        <text x={494} y={160} textAnchor="middle" fontSize="15" fontWeight="750" fill={P.pd}>= V₁ + V₂</text>
      </PhysicsDiagram>
    }
    case 'series-resistance': return <PhysicsDiagram title="A 2 Ω resistor and a 3 Ω resistor in series act like one 5 Ω resistor: R total = R₁ + R₂.">
      <path d="M60 90H112M168 90H212M268 90H320" stroke={P.wire} strokeWidth="2.5" />
      <Circuit runs={[]} parts={[{ kind: 'resistor', x: 140, y: 90, length: 56 }, { kind: 'resistor', x: 240, y: 90, length: 56 }]} />
      {resTag(140, 56, 'R₁ = 2 Ω')}
      {resTag(240, 56, 'R₂ = 3 Ω')}
      <path d="M100 116v10H280v-10" stroke={P.resistance} strokeWidth="2" fill="none" />
      <Arrow from={[190, 126]} to={[190, 178]} colour={P.resistance} />
      <path d="M110 210H162M218 210H270" stroke={P.wire} strokeWidth="2.5" />
      <Circuit runs={[]} parts={[{ kind: 'resistor', x: 190, y: 210, length: 56 }]} />
      {resTag(190, 246, 'R total = 5 Ω')}
      <text x={420} y={130} textAnchor="middle" fontSize="16" fontWeight="750" fill={P.resistance}>R total</text>
      <text x={420} y={154} textAnchor="middle" fontSize="16" fontWeight="750" fill={P.resistance}>= R₁ + R₂</text>
      <text x={420} y={190} textAnchor="middle" fontSize="14" fontWeight="650" fill={muted}>2 Ω + 3 Ω = 5 Ω</text>
    </PhysicsDiagram>
    case 'series-why': return <PhysicsDiagram title="Same battery: with one resistor the current is bigger; adding a second resistor in series raises the total resistance, so the current is smaller.">
      <MoreResistance bottomLabel="less current" />
    </PhysicsDiagram>
    case 'series-wk-total': return <PhysicsDiagram title="Worked example: a 24 V battery with a 4.0 ohm and an 8.0 ohm resistor in series. Total resistance = 4.0 + 8.0 = 12 Ω.">
      <Worked />
      <EqCard x={296} y={40} w={232} title="Step 1: total resistance" rows={[{ text: 'R = 4.0 + 8.0' }, { text: 'R = 12 Ω', state: 'hi', colour: P.resistance }]} />
    </PhysicsDiagram>
    case 'series-wk-eq': return <PhysicsDiagram title="Step 2: V = IR rearranged for the current is I = V ÷ R. Use the battery pd and the total resistance." schematic={false}>
      <Worked dim />
      <EqCard x={296} y={40} w={232} title="Step 2: the equation" rows={[{ text: 'V = I × R', state: 'dim' }, { text: '÷ R on both sides', size: 15, colour: P.pd }, { text: 'I = V ÷ R', state: 'hi', colour: P.current }]} />
    </PhysicsDiagram>
    case 'series-wk-sub': return <PhysicsDiagram title="Step 3: I = 24 ÷ 12 = 2.0 A. The ammeter reads 2.0 A, the same everywhere in the loop.">
      <Worked ammeter="2.0 A" />
      <EqCard x={296} y={40} w={232} title="Step 3: substitute" rows={[{ text: 'I = V ÷ R', state: 'dim' }, { text: 'I = 24 ÷ 12' }, { text: 'I = 2.0 A', state: 'hi', colour: P.current }]} />
    </PhysicsDiagram>
    case 'series-cells': return <PhysicsDiagram title="Cells in series, all facing the same way, add their pds: two 1.5 V cells give 3.0 V, and four give 6.0 V.">
      <CellRow x={130} y={110} n={2} />
      <CellRow x={380} y={110} n={4} />
      <Caption text="long line (+) on the same side each time" y={250} />
    </PhysicsDiagram>
    case 'series-q-circuit': return <PhysicsDiagram title="A series circuit with a battery, three resistors and an ammeter.">
      <Circuit loops={[loop(90, 90, 450, 230)]} parts={[{ kind: 'battery', x: 90, y: 160, rotate: 90 }, { kind: 'resistor', x: 170, y: 90 }, { kind: 'resistor', x: 270, y: 90 }, { kind: 'resistor', x: 370, y: 90 }, { kind: 'ammeter', x: 270, y: 230 }]} />
      {pdTag(114, 160, '? V', 'start')}
      {resTag(170, 56, '3.0 Ω')}
      {resTag(270, 56, '4.0 Ω')}
      {resTag(370, 56, '5.0 Ω')}
      {currentTag(270, 268, '0.50 A')}
    </PhysicsDiagram>
    case 'series-q-voltmeters': {
      const T = 60, B = 160
      return <PhysicsDiagram title="A series circuit with three resistors and three voltmeters.">
        <Circuit loops={[loop(30, T, 510, B)]} parts={[{ kind: 'battery', x: 270, y: T }, { kind: 'resistor', x: 115, y: B }, { kind: 'resistor', x: 270, y: B }, { kind: 'resistor', x: 425, y: B }]} />
        {pdTag(270, T + 34, '12 V')}
        <Circuit runs={[70, 225, 380].map(a => [[a, B], [a, 224], [a + 90, 224], [a + 90, B]] as Pt[])} parts={[115, 270, 425].map(x => ({ kind: 'voltmeter' as const, x, y: 224 }))} junctions={[70, 160, 225, 315, 380, 470].map(x => [x, B] as Pt)} />
        {pdTag(115, 264, '2.0 V')}
        {pdTag(270, 264, '4.0 V')}
        {pdTag(425, 264, '? V')}
      </PhysicsDiagram>
    }
    default: return null
  }
}
