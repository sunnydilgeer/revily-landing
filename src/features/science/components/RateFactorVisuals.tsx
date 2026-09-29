import type { ReactNode } from 'react'
import {
  Diagram, Particle, Product, Moving, Collision, Burst, Badge, Head, VArrow, GraphAxes, GraphLine, KeyRow, type Kind, type Line,
  ink, muted, protonLine, electronLine, lightIso, darkIsoLine, panelFill, panelLine, space, spaceLine, glow, amber, amberInk, amberTint,
} from './RatesVisuals'

/*
 * Chemistry Lesson 32: Factors affecting the rate. Original, code-native schematics; not to scale.
 * Focus ids start with 'rfac-'.
 *
 * Same colour code as Lesson 31 (RatesVisuals): particle A blue, particle B coral, a product = A and B joined, amber = energy
 * and collision bursts. Warm tint = hot, cool tint = cold. Green = catalyst. Yellow-amber lumps = a solid reactant.
 * The reaction profile follows Lesson 30's ProfileVisuals (axes, curve shape, amber activation-energy arrows).
 * Assessment views keep numbers only: no concentration, temperature or catalyst words.
 */
const r1 = (n: number) => Math.round(n * 10) / 10
const cold = '#e4f0fa', coldLine = '#9fc3e0'
const solidFill = '#f5d77a', solidLine = '#b8902a'

// Well-spread spots in a unit square (for placing particles in a liquid). The first few are spread out on their own.
const SPOTS: [number, number][] = [
  [0.2, 0.25], [0.75, 0.3], [0.35, 0.75], [0.8, 0.8], [0.5, 0.5], [0.1, 0.55], [0.5, 0.12], [0.92, 0.55],
  [0.27, 0.5], [0.6, 0.82], [0.13, 0.88], [0.92, 0.1], [0.64, 0.34], [0.38, 0.28],
]
const ANGLES = [20, 160, -60, 200, 100, 250, 330, 60, 140, -20, 280, 190, 45, 120]

// A rounded beaker. The liquid fills from y + 34 down. Children are drawn inside.
function Beaker({ x, y, w = 190, h = 190, tint = space, line = spaceLine, children }: { x: number; y: number; w?: number; h?: number; tint?: string; line?: string; children?: ReactNode }) {
  const b = y + h, s = y + 34
  return <g>
    <path d={`M${x + 2} ${s}q${w / 4} -6 ${w / 2 - 2} 0t${w / 2 - 2} 0V${b - 22}q0 20 -22 20H${x + 24}q-22 0 -22 -20Z`} fill={tint} stroke={line} strokeWidth="1.5" />
    <path d={`M${x - 8} ${y}q8 0 8 8V${b - 22}q0 22 24 22H${x + w - 24}q24 0 24 -22V${y + 8}q0 -8 8 -8`} stroke={muted} strokeWidth="2.5" fill="none" />
    <path d={`M${x + 12} ${s + 16}V${b - 40}`} stroke="white" strokeWidth="4" opacity="0.8" fill="none" />
    {children}
  </g>
}
// Particles placed on the first n spots inside a box (x0, y0, w, h), skipping the spots listed in `skip`.
function Spread({ x0, y0, w, h, n, len, skip = [], kinds }: { x0: number; y0: number; w: number; h: number; n: number; len: number; skip?: number[]; kinds?: Kind[] }) {
  const out: ReactNode[] = []
  let i = 0, placed = 0
  while (placed < n && i < SPOTS.length) {
    if (!skip.includes(i)) {
      const [u, v] = SPOTS[i]
      out.push(<Moving key={i} x={x0 + u * w} y={y0 + v * h} kind={kinds ? kinds[placed % kinds.length] : placed % 2 ? 'b' : 'a'} angle={ANGLES[i]} len={len} />)
      placed++
    }
    i++
  }
  return <g>{out}</g>
}
const inner = (x: number, y: number) => ({ x0: x + 22, y0: y + 54, w: 146, h: 108 })
function Caption({ x, y, lines, colour = ink }: { x: number; y: number; lines: string[]; colour?: string }) {
  return <g textAnchor="middle" fill={colour} fontSize="15">{lines.map((l, i) => <text key={i} x={x} y={y + i * 18} fontWeight={i === 0 ? 700 : 400}>{l}</text>)}</g>
}

// ---------- Section: temperature ----------
function Temp({ stage }: { stage: 'move' | 'collide' }) {
  const L = 60, R = 290
  const hitsHot: [number, number, number][] = [[0.3, 0.2, 10], [0.75, 0.35, -25], [0.35, 0.8, 30], [0.8, 0.85, 0]]
  const place = (x: number, y: number, [u, v]: [number, number]) => { const q = inner(x, y); return [q.x0 + u * q.w, q.y0 + v * q.h] }
  return <Diagram title={stage === 'move'
    ? 'Two beakers of the same reacting mixture. In the cold beaker the particles move slowly. In the hot beaker the particles move fast.'
    : 'The same two beakers. The cold beaker has one collision. The hot beaker has four collisions at the same moment, so there are more collisions per second.'}>
    <Beaker x={L} y={36} tint={cold} line={coldLine}>
      {stage === 'move' ? <Spread {...inner(L, 36)} n={8} len={8} />
        : <g><Spread {...inner(L, 36)} n={6} len={8} skip={[4]} />{(() => { const [cx, cy] = place(L, 36, [0.5, 0.5]); return <Collision x={cx} y={cy} strong={false} /> })()}</g>}
    </Beaker>
    <Beaker x={R} y={36} tint={glow} line="#f0c2b8">
      {stage === 'move' ? <Spread {...inner(R, 36)} n={8} len={30} />
        : <g>{hitsHot.map(([u, v, a], i) => { const [cx, cy] = place(R, 36, [u, v]); return <Collision key={i} x={cx} y={cy} angle={a} /> })}</g>}
    </Beaker>
    <Caption x={L + 95} y={24} lines={['Cold']} colour={electronLine} />
    <Caption x={R + 95} y={24} lines={['Hot']} colour={protonLine} />
    {stage === 'move' ? <g><Caption x={L + 95} y={252} lines={['particles move', 'slowly']} /><Caption x={R + 95} y={252} lines={['particles move', 'fast']} /></g>
      : <g><Caption x={L + 95} y={252} lines={['1 collision']} /><Caption x={R + 95} y={252} lines={['4 collisions']} /><Caption x={270} y={290} lines={['more collisions per second']} colour={protonLine} /></g>}
  </Diagram>
}
function TempEnergy() {
  const x = 40, y = 30
  return <Diagram title="A hot beaker with two collisions. In one, the particles bump gently and bounce apart. In the other, they hit with enough energy and join to make a product. When hotter, more collisions have enough energy.">
    <Beaker x={x} y={y} w={230} h={220} tint={glow} line="#f0c2b8">
      <Moving x={90} y={112} kind="a" angle={20} len={26} /><Moving x={220} y={100} kind="b" angle={200} len={26} />
      <Moving x={96} y={228} kind="a" angle={-20} len={26} />
      {/* gentle: bounce apart */}
      <g><Particle x={104} y={176} kind="a" /><Particle x={128} y={176} kind="b" /><Burst x={116} y={160} size={0.5} />
        <path d="M92 172q-10 -4 -18 -12M140 172q10 -4 18 -12" stroke={muted} strokeWidth="2" fill="none" />
        <Head x={72} y={158} angle={-140} c={muted} s={0.7} /><Head x={160} y={158} angle={-40} c={muted} s={0.7} /></g>
      {/* energetic: product */}
      <g><Burst x={190} y={148} size={1} /><Product x={190} y={172} /></g>
    </Beaker>
    <path d="M128 190C170 240 270 232 318 222" stroke={muted} strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
    <path d="M204 170C240 120 290 104 318 104" stroke={muted} strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
    <g fontSize="15" fill={ink}>
      <text x={326} y={100} fontWeight="700">hard hit:</text><text x={326} y={118}>enough energy,</text><text x={326} y={136}>reaction</text>
      <text x={326} y={216} fontWeight="700">gentle bump:</text><text x={326} y={234}>bounces apart</text>
    </g>
    <text x={270} y={290} textAnchor="middle" fontSize="15" fontWeight="700" fill={protonLine}>hotter: more collisions have enough energy</text>
  </Diagram>
}
function TempGraph() {
  const coldL: Line = { n: 1, H: 150, tau: 250, colour: electronLine, badgeT: 110 }
  const hot: Line = { n: 2, H: 150, tau: 110, colour: protonLine, badgeT: 30 }
  return <Diagram title="A graph of amount of product formed against time. The line for the hot reaction is steeper at the start and goes flat sooner than the line for the cold reaction. Both finish at the same height.">
    <GraphAxes />
    <GraphLine line={coldL} /><GraphLine line={hot} />
    <KeyRow x={396} y={80} n={1} colour={electronLine} lines={['cold']} />
    <KeyRow x={396} y={124} n={2} colour={protonLine} lines={['hot: steeper,', 'flat sooner']} />
    <text x={396} y={196} fontSize="14" fill={ink}>same final height:</text><text x={396} y={213} fontSize="14" fill={ink}>same reactants</text>
  </Diagram>
}

// ---------- Section: concentration and pressure ----------
function Conc({ stage }: { stage: 'more' | 'collide' }) {
  const L = 60, R = 290
  const hitsHigh: [number, number, number][] = [[0.22, 0.2, 10], [0.75, 0.22, -20], [0.5, 0.52, 25], [0.2, 0.84, -10], [0.8, 0.84, 15]]
  const at = (x: number, [u, v]: [number, number]) => { const q = inner(x, 36); return [q.x0 + u * q.w, q.y0 + v * q.h] }
  return <Diagram title={stage === 'more'
    ? 'Two beakers with the same volume of solution. The low concentration beaker has 4 reactant particles. The high concentration beaker has 12 in the same volume.'
    : 'The same two beakers. The low concentration beaker has 1 collision. The high concentration beaker has 5 collisions at the same moment, so collisions are more frequent.'}>
    <Beaker x={L} y={36}>
      {stage === 'more' ? <Spread {...inner(L, 36)} n={4} len={14} />
        : <g><Spread {...inner(L, 36)} n={2} len={14} skip={[0, 1, 2, 3]} />{(() => { const [cx, cy] = at(L, [0.6, 0.12]); return <Collision x={cx} y={cy} strong={false} /> })()}</g>}
    </Beaker>
    <Beaker x={R} y={36}>
      {stage === 'more' ? <Spread {...inner(R, 36)} n={12} len={14} />
        : <g>{hitsHigh.map(([u, v, a], i) => { const [cx, cy] = at(R, [u, v]); return <Collision key={i} x={cx} y={cy} angle={a} strong={false} /> })}<Moving x={at(R, [0.5, 0.05])[0]} y={at(R, [0.5, 0.05])[1]} kind="a" angle={160} len={14} /><Moving x={at(R, [0.95, 0.55])[0]} y={at(R, [0.95, 0.55])[1]} kind="b" angle={250} len={14} /></g>}
    </Beaker>
    <Caption x={L + 95} y={24} lines={['Low concentration']} />
    <Caption x={R + 95} y={24} lines={['High concentration']} />
    {stage === 'more' ? <Caption x={270} y={260} lines={['same volume of solution', 'more particles in the same space']} />
      : <g><Caption x={L + 95} y={252} lines={['1 collision']} /><Caption x={R + 95} y={252} lines={['5 collisions']} /><Caption x={270} y={290} lines={['more frequent collisions']} colour={protonLine} /></g>}
  </Diagram>
}
function Pressure() {
  // gas cylinders with a piston; the gas space is below the piston
  const pts = (x: number, top: number, bottom: number) => {
    const w = 120, h = bottom - top
    const spots: [number, number][] = [[0.2, 0.2], [0.72, 0.28], [0.45, 0.52], [0.18, 0.8], [0.8, 0.76], [0.5, 0.9]]
    return spots.map(([u, v], i) => <Moving key={i} x={x + 20 + u * w} y={top + 12 + v * (h - 24)} kind={i % 2 ? 'b' : 'a'} angle={ANGLES[i]} len={12} />)
  }
  const cyl = (x: number, piston: number, label: string, push: boolean) => <g>
    <rect x={x + 10} y={piston} width={140} height={250 - piston} rx="4" fill={space} />
    <path d={`M${x} 30V236q0 14 14 14H${x + 146}q14 0 14 -14V30`} stroke={muted} strokeWidth="2.5" fill="none" />
    <rect x={x + 6} y={piston - 14} width={148} height={14} rx="5" fill="#dde3e8" stroke="#7f8c97" strokeWidth="2" />
    <path d={`M${x + 80} ${piston - 14}V${Math.max(8, piston - 90)}`} stroke="#7f8c97" strokeWidth="6" fill="none" />
    {push && <g><path d={`M${x + 118} ${piston - 70}V${piston - 26}`} stroke={amber} strokeWidth="3.5" fill="none" /><Head x={x + 118} y={piston - 20} angle={90} c={amber} /></g>}
    {pts(x, piston, 250)}
    <text x={x + 80} y={278} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{label}</text>
  </g>
  return <Diagram title="Two gas cylinders, each with the same 6 gas particles. At low pressure the particles have a large space and are far apart. At high pressure the piston is pushed in, so the same particles are squeezed close together and collide more often.">
    {cyl(40, 60, 'low pressure', false)}
    {cyl(340, 150, 'high pressure', true)}
    <text x={270} y={100} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>same number</text>
    <text x={270} y={118} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>of particles</text>
    <text x={270} y={200} textAnchor="middle" fontSize="14" fill={ink}>smaller space:</text>
    <text x={270} y={218} textAnchor="middle" fontSize="14" fill={ink}>more collisions</text>
  </Diagram>
}

// ---------- Section: surface area ----------
function Lump({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M-40 -8C-44 -30 -20 -44 2 -38C22 -46 44 -30 40 -10C50 8 34 34 12 32C-6 44 -34 36 -38 16C-50 8 -46 -2 -40 -8Z" fill={solidFill} stroke={solidLine} strokeWidth={2 / s} />
}
function Piece({ x, y, a = 0 }: { x: number; y: number; a?: number }) {
  return <path transform={`translate(${x} ${y}) rotate(${a})`} d="M-9 -3C-10 -9 -2 -11 3 -9C9 -10 11 -3 9 2C10 8 3 10 -1 9C-7 11 -11 5 -9 -3Z" fill={solidFill} stroke={solidLine} strokeWidth="1.8" />
}
// Positions are local to a beaker's top-left corner (beaker 200 wide; liquid from y 40 to about 210).
const PIECES: [number, number, number][] = [[40, 66, 0], [86, 60, 40], [132, 68, 80], [168, 92, 60], [54, 106, 120], [100, 102, 20], [146, 118, 150], [40, 150, 100], [90, 146, 10], [140, 158, 70]]
const LUMP_LOOSE: [number, number, number][] = [[34, 64, 20], [170, 66, 160], [30, 168, -30], [172, 170, 210]]
const PIECE_LOOSE: [number, number, number][] = [[24, 128, -40], [176, 140, 200], [118, 134, 250], [62, 176, 20]]
// Particle A hitting piece `p` from direction `deg` (0 = from the right).
const HITS: [number, number][] = [[1, 0], [4, 180], [6, 90], [8, 90]]
function SurfaceArea({ stage }: { stage: 'pieces' | 'collide' }) {
  const L = 40, R = 300, Y = 36
  const loose = (bx: number, list: [number, number, number][]) => list.map(([px, py, a], i) => <Moving key={i} x={bx + px} y={Y + py} kind="a" angle={a} len={12} />)
  const hit = (bx: number, cx: number, cy: number, deg: number, gap: number, key: number) => {
    const c = Math.cos(deg * Math.PI / 180), sn = Math.sin(deg * Math.PI / 180)
    return <g key={key}><Moving x={bx + cx + (gap + 8) * c} y={Y + cy + (gap + 8) * sn} kind="a" angle={deg + 180} len={14} /><Burst x={bx + cx + gap * c} y={Y + cy + gap * sn - 3} size={0.55} /></g>
  }
  return <Diagram title={stage === 'pieces'
    ? 'Two beakers with the same mass of solid. One has a single large lump with a small surface area. The other has many small pieces with a large surface area. Particles of the other reactant move around them.'
    : 'The same two beakers. One particle hits the large lump. Four particles hit the small pieces at the same moment, so collisions are more frequent.'}>
    <Beaker x={L} y={Y} w={200}><Lump x={L + 100} y={Y + 112} s={1.1} />
      {stage === 'pieces' ? loose(L, LUMP_LOOSE) : <g>{loose(L, LUMP_LOOSE.slice(1))}{hit(L, 56, 104, 180, 12, 9)}</g>}
    </Beaker>
    <Beaker x={R} y={Y} w={200}>
      {PIECES.map(([px, py, a], i) => <Piece key={i} x={R + px} y={Y + py} a={a} />)}
      {stage === 'pieces' ? loose(R, PIECE_LOOSE) : HITS.map(([p, deg], i) => hit(R, PIECES[p][0], PIECES[p][1], deg, 14, i))}
    </Beaker>
    {stage === 'pieces' ? <g><Caption x={L + 100} y={256} lines={['large lump:', 'small surface area']} /><Caption x={R + 100} y={256} lines={['small pieces:', 'large surface area']} /></g>
      : <g><Caption x={L + 100} y={256} lines={['1 collision']} /><Caption x={R + 100} y={256} lines={['4 collisions']} /><Caption x={270} y={292} lines={['more frequent collisions']} colour={protonLine} /></g>}
    <Caption x={270} y={22} lines={['same mass of solid']} colour={muted} />
  </Diagram>
}
function Exposed() {
  const d = 14, rr = 6.2
  const lump = [] as ReactNode[]
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
    const edge = i === 0 || j === 0 || i === 7 || j === 7
    lump.push(<circle key={`${i}-${j}`} cx={70 + i * d} cy={60 + j * d} r={rr} fill={edge ? solidFill : '#f6ecd0'} stroke={edge ? solidLine : '#d9c79a'} strokeWidth="1.3" />)
  }
  const bits = [] as ReactNode[]
  const clusters: [number, number][] = []
  for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) clusters.push([316 + a * 48 + ((b * 7) % 10), 58 + b * 38 + ((a * 5) % 8)])
  clusters.forEach(([cx, cy], k) => {
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) bits.push(<circle key={`${k}-${i}-${j}`} cx={cx + i * d} cy={cy + j * d} r={rr} fill={solidFill} stroke={solidLine} strokeWidth="1.3" />)
  })
  return <Diagram title="Left: a cut through one lump of 64 particles. Only the particles on the outside are exposed; most are buried inside. Right: the same 64 particles as 16 small pieces, and every particle is on a surface.">
    {lump}{bits}
    <text x={119} y={200} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>one lump</text>
    <text x={119} y={218} textAnchor="middle" fontSize="14" fill={ink}>most particles buried</text>
    <text x={410} y={218} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>small pieces</text>
    <text x={410} y={236} textAnchor="middle" fontSize="14" fill={ink}>every particle on a surface</text>
    <g transform="translate(150 262)">
      <circle cx={0} cy={0} r={rr} fill={solidFill} stroke={solidLine} strokeWidth="1.3" /><text x={12} y={5} fontSize="14" fill={ink}>exposed particles</text>
      <circle cx={150} cy={0} r={rr} fill="#f6ecd0" stroke="#d9c79a" strokeWidth="1.3" /><text x={162} y={5} fontSize="14" fill={ink}>buried inside</text>
    </g>
    <text x={270} y={292} textAnchor="middle" fontSize="13" fill={muted}>Same 64 particles in both.</text>
  </Diagram>
}

// ---------- Section: catalysts ----------
function Catalyst({ x, y, s = 1, shape = 0, opacity = 1 }: { x: number; y: number; s?: number; shape?: 0 | 1; opacity?: number }) {
  const d = shape === 0
    ? 'M-16 -6C-16 -16 -6 -18 0 -14C6 -18 16 -16 16 -6C18 4 12 14 0 14C-12 14 -18 4 -16 -6Z'
    : 'M-15 -12C-8 -16 8 -16 15 -12C18 -2 18 4 14 12C6 16 -6 16 -14 12C-18 4 -18 -4 -15 -12Z'
  return <g opacity={opacity} transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={d} fill={lightIso} stroke={darkIsoLine} strokeWidth={2 / s} />
  </g>
}
function CatWhat() {
  return <Diagram title="Reactant particles change into products. A green catalyst sits above the reaction arrow. After the reaction the same catalyst is still there, unchanged, because it is not used up.">
    <Particle x={70} y={130} kind="a" /><Particle x={104} y={150} kind="b" /><Particle x={76} y={170} kind="b" /><Particle x={110} y={112} kind="a" />
    <text x={90} y={210} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>reactants</text>
    <path d="M160 142H320" stroke={muted} strokeWidth="3" fill="none" /><Head x={328} y={142} angle={0} c={muted} />
    <Catalyst x={244} y={106} s={1.5} />
    <text x={244} y={68} textAnchor="middle" fontSize="15" fontWeight="700" fill={darkIsoLine}>catalyst</text>
    <text x={244} y={176} textAnchor="middle" fontSize="14" fill={ink}>speeds it up</text>
    <Product x={362} y={122} /><Product x={374} y={162} angle={-20} />
    <text x={366} y={210} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>products</text>
    <Catalyst x={470} y={140} s={1.5} />
    <text x={470} y={186} textAnchor="middle" fontSize="15" fontWeight="700" fill={darkIsoLine}>catalyst</text>
    <text x={470} y={204} textAnchor="middle" fontSize="14" fill={ink}>not used up</text>
    <text x={270} y={268} textAnchor="middle" fontSize="14" fill={muted}>The same catalyst is left at the end.</text>
  </Diagram>
}
function CatPathway() {
  const ground = 'M30 214H130'
  const high = 'M130 214C190 214 196 50 262 50C330 50 330 236 400 236'
  const low = 'M130 214C190 214 200 132 262 132C326 132 330 236 400 236'
  return <Diagram title="Two routes over a hill from reactants to products. The route without a catalyst goes over a high hill. The route with a catalyst goes over a lower hill, so it has a lower activation energy.">
    <path d={`${ground}L${high.slice(1)}V272H30Z`} fill={space} />
    <path d={`M130 214${low.slice(8)}H510V272H30V214Z`} fill={lightIso} opacity="0.7" />
    <path d={`${ground}M400 236H510`} stroke={ink} strokeWidth="3" fill="none" />
    <path d={high} stroke={muted} strokeWidth="3" strokeDasharray="9 6" fill="none" />
    <path d={low} stroke={darkIsoLine} strokeWidth="3.5" fill="none" />
    <Moving x={96} y={204} kind="a" angle={0} len={20} />
    <path d="M60 50H250M60 132H250" stroke={ink} strokeWidth="1.5" strokeDasharray="5 5" opacity="0.45" fill="none" />
    <VArrow x={48} y1={214} y2={52} c={muted} w={2.5} />
    <VArrow x={74} y1={214} y2={134} c={amber} />
    <g fontSize="14" fontWeight="700"><text x={276} y={40} fill={muted}>no catalyst: high hill</text><text x={372} y={146} fill={darkIsoLine}>with catalyst:</text><text x={372} y={163} fill={darkIsoLine}>lower hill</text></g>
    <g fontSize="13" fill={muted}><text x={40} y={236}>reactants</text><text x={440} y={258} textAnchor="middle">products</text></g>
    <text x={270} y={292} textAnchor="middle" fontSize="15" fontWeight="700" fill={amberInk}>catalyst route: lower activation energy</text>
  </Diagram>
}
// Reaction profile in Lesson 30's style: energy axis at local x = 0, progress axis at local y = 240.
const R0 = 110, P0 = 185, KH = 30, KL = 85
const pcurve = (K: number) => `M10 ${R0}H150C200 ${R0} 200 ${K} 250 ${K}C300 ${K} 300 ${P0} 350 ${P0}H440`
function ProfileAxes() {
  return <g>
    <g fontSize="14" fontWeight="700" fill={ink}><text transform="translate(28 140) rotate(-90)" textAnchor="middle">Energy</text><text x={297} y={290} textAnchor="middle">Progress of reaction</text></g>
    <g transform="translate(72 20)"><path d="M0 -6V240H450" stroke={ink} strokeWidth="2.5" fill="none" /><Head x={0} y={-8} angle={-90} c={ink} /><Head x={452} y={240} angle={0} c={ink} /></g>
  </g>
}
function CatProfile({ assessment }: { assessment: boolean }) {
  const dash = (y: number, x2: number) => <path d={`M40 ${y}H${x2}`} stroke={ink} strokeWidth="1.5" strokeDasharray="6 5" opacity="0.55" fill="none" />
  return <Diagram title={assessment
    ? 'A reaction profile with two curves that start at the same reactants level and end at the same lower products level. One curve has a high peak and the other a lower peak. Arrow 1 goes from the reactants up to the high peak, arrow 2 from the reactants up to the lower peak, and arrow 3 from the reactants down to the products.'
    : 'A reaction profile with and without a catalyst. Both curves start at the same reactants level and end at the same products level. The curve with a catalyst has a lower peak, so its activation energy is smaller.'}>
    <ProfileAxes />
    <g transform="translate(72 20)">
      {dash(R0, 430)}{dash(KH, 250)}{dash(KL, 250)}{assessment && <path d={`M350 ${P0}H430`} stroke={ink} strokeWidth="1.5" strokeDasharray="6 5" opacity="0.55" fill="none" />}
      <path d={pcurve(KH)} stroke={assessment ? ink : muted} strokeWidth="4" fill="none" />
      <path d={pcurve(KL)} stroke={assessment ? ink : darkIsoLine} strokeWidth="4" fill="none" strokeDasharray={assessment ? '10 6' : undefined} />
      <g fontSize="13" fontWeight="700" fill={ink}><text x={56} y={R0 + 21}>Reactants</text><text x={350} y={P0 + 21}>Products</text></g>
      {assessment ? <g>
        <VArrow x={40} y1={R0} y2={KH} c={ink} /><Badge x={20} y={(R0 + KH) / 2 - 10} n={1} />
        <VArrow x={110} y1={R0} y2={KL} c={ink} /><Badge x={132} y={(R0 + KL) / 2 + 2} n={2} />
        <VArrow x={420} y1={R0} y2={P0} c={ink} /><Badge x={440} y={(R0 + P0) / 2} n={3} />
      </g> : <g>
        <VArrow x={40} y1={R0} y2={KH} c={muted} w={2.5} />
        <VArrow x={110} y1={R0} y2={KL} c={amber} />
        <g fontSize="13" fontWeight="700"><text x={262} y={20} fill={muted}>Without catalyst</text><text x={276} y={78} fill={darkIsoLine}>With catalyst</text></g>
        <g fontSize="13" fill={amberInk} fontWeight="700"><text x={124} y={58}>lower activation</text><text x={124} y={74}>energy</text></g>
      </g>}
    </g>
  </Diagram>
}
function CatNotes() {
  const tile = (x: number, title: string[], art: ReactNode) => <g transform={`translate(${x} 40)`}>
    <rect x={0} y={0} width={160} height={210} rx="20" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    {art}
    <g textAnchor="middle" fontSize="14" fill={ink}>{title.map((t, i) => <text key={i} x={80} y={150 + i * 18} fontWeight={i === 0 ? 700 : 400}>{t}</text>)}</g>
  </g>
  return <Diagram title="Three facts about catalysts. A catalyst is not written in the equation. Different reactions need different catalysts. Enzymes are biological catalysts, found in living things.">
    {tile(tileX(0), ['Not in the', 'equation'], <g>
      <text x={80} y={82} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>A + B → AB</text>
      <Catalyst x={96} y={56} s={0.8} />
    </g>)}
    {tile(tileX(1), ['Different reactions', 'need different', 'catalysts'], <g>
      <Catalyst x={52} y={70} s={1.3} /><Catalyst x={108} y={70} s={1.3} shape={1} />
    </g>)}
    {tile(tileX(2), ['Enzymes:', 'biological', 'catalysts'], <g transform="translate(80 72)">
      <path d="M-34 -8C-36 -30 -8 -40 12 -32C34 -26 40 -4 30 10L8 0L10 22C-10 34 -32 18 -34 -8Z" fill={lightIso} stroke={darkIsoLine} strokeWidth="2" />
      <path d="M-18 -18q-4 10 4 16" stroke={darkIsoLine} strokeWidth="1.6" fill="none" />
    </g>)}
  </Diagram>
}
const tileX = (i: number) => 20 + i * 176

// ---------- On your own ----------
function Flask({ x, n, num }: { x: number; n: number; num: number }) {
  // conical flask: neck 30 wide at top, body widening to 100 at the base
  const top = 44, shoulder = 96, base = 236
  const cx = x + 55
  const widthAt = (y: number) => 30 + (y - shoulder) / (base - shoulder) * 74
  const surface = 130
  // 12 spots in rows that fit the widening cone, ordered so that small numbers are spread out
  const spots: [number, number][] = [[-24, 172], [30, 194], [0, 214], [10, 152], [-30, 194], [24, 172], [-24, 214], [0, 172], [-10, 152], [-10, 194], [10, 194], [24, 214]]
  const placed = spots.slice(0, n).map(([dx, y], i) => <Particle key={i} x={cx + dx + ((i * 3) % 5) - 2} y={y + ((i * 7) % 5) - 2} kind={i % 2 ? 'b' : 'a'} r={7} />)
  const wS = widthAt(surface)
  return <g>
    <path d={`M${cx - wS / 2} ${surface}q${wS / 4} -5 ${wS / 2} 0t${wS / 2} 0L${cx + 52} ${base - 10}q2 10 -10 10H${cx - 42}q-12 0 -10 -10Z`} fill={space} stroke={spaceLine} strokeWidth="1.5" />
    <path d={`M${cx - 20} ${top}h4V${shoulder}L${cx - 54} ${base - 10}q-2 12 12 12H${cx + 42}q14 0 12 -12L${cx + 16} ${shoulder}V${top}h4`} stroke={muted} strokeWidth="2.5" fill="none" />
    {placed}
    <Badge x={cx} y={top - 18} n={num} />
  </g>
}
function QFlasks() {
  return <Diagram title="Four conical flasks, numbered 1 to 4, with the same volume of solution. Flask 1 has 3 particles, flask 2 has 5, flask 3 has 8 and flask 4 has 12.">
    <Flask x={12} n={3} num={1} /><Flask x={144} n={5} num={2} /><Flask x={276} n={8} num={3} /><Flask x={408} n={12} num={4} />
    <text x={270} y={276} textAnchor="middle" fontSize="14" fill={muted}>Same volume in each flask.</text>
  </Diagram>
}
function QGraph() {
  const orig: Line = { n: '', H: 130, tau: 190, colour: muted, badgeT: 0, dashed: true }
  const lines: Line[] = [
    { n: 1, H: 130, tau: 80, colour: ink, badgeT: 90 },
    { n: 2, H: 190, tau: 170, colour: ink, badgeT: 200 },
    { n: 3, H: 130, tau: 290, colour: ink, badgeT: 110 },
  ]
  return <Diagram title="A graph of amount of product formed against time. A dashed line shows the original reaction. Three numbered lines: line 1 is steeper and goes flat sooner at the same height, line 2 finishes higher, and line 3 is less steep and goes flat later at the same height.">
    <GraphAxes />
    <GraphLine line={orig} badge={false} width={3} />
    {lines.map((l) => <GraphLine key={String(l.n)} line={l} />)}
    <g transform="translate(396 60)"><path d="M0 0H34" stroke={muted} strokeWidth="3" strokeDasharray="10 7" /><text x={42} y={5} fontSize="14" fill={ink}>original</text></g>
  </Diagram>
}

export function RateFactorVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'rfac-temp-move': return <Temp stage="move" />
    case 'rfac-temp-collide': return <Temp stage="collide" />
    case 'rfac-temp-energy': return <TempEnergy />
    case 'rfac-temp-graph': return <TempGraph />
    case 'rfac-conc-more': return <Conc stage="more" />
    case 'rfac-conc-collide': return <Conc stage="collide" />
    case 'rfac-pressure': return <Pressure />
    case 'rfac-sa-pieces': return <SurfaceArea stage="pieces" />
    case 'rfac-sa-exposed': return <Exposed />
    case 'rfac-sa-collide': return <SurfaceArea stage="collide" />
    case 'rfac-cat-what': return <CatWhat />
    case 'rfac-cat-pathway': return <CatPathway />
    case 'rfac-cat-profile': return <CatProfile assessment={false} />
    case 'rfac-cat-notes': return <CatNotes />
    case 'rfac-q-flasks': return <QFlasks />
    case 'rfac-q-profile': return <CatProfile assessment={true} />
    case 'rfac-q-graph': return <QGraph />
    default: return assessment ? <QFlasks /> : <Temp stage="move" />
  }
}
