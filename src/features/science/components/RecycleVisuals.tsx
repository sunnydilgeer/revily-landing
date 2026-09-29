import type { ReactNode } from 'react'
import { Mini } from './InfectionVisuals'
import { resPalette as P, Diagram, Lines, Caption, Arrow, CurveArrow, Card, StepBadge, Heap, Rock, Spark, Flame, Crucible, Ingot, Drum, Tree } from './ResourceVisuals'

/*
 * Chemistry Lesson 50: Reuse and recycling. Original, code-native schematics; not to scale. Focus ids start with 'recycle-'.
 * Shares the hand-drawn objects and colours of Lesson 49 (ResourceVisuals.tsx):
 *   yellow sparks = energy; green arrows = recycling or reuse; warm grey-brown = finite raw materials and fuel;
 *   soft grey = metal; pale blue-green = glass; orange = molten material and flames.
 */
const { ink, muted, panelLine } = P
const loop = P.green

// ---------- Small objects ----------
function Bottle({ x, y, s = 1, full = false, dim = false }: { x: number; y: number; s?: number; full?: boolean; dim?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} opacity={dim ? .4 : 1}>
    <path d="M-5 -50V-40Q-5 -34 -12 -28Q-14 -26 -14 -20V-3Q-14 0 -11 0H11Q14 0 14 -3V-20Q14 -26 12 -28Q5 -34 5 -40V-50Z" fill={P.glass} stroke={P.glassLine} strokeWidth="1.8" />
    {full && <path d="M-12 -20H12V-4Q12 -2 10 -2H-10Q-12 -2 -12 -4Z" fill="#9fd3c4" />}
    <rect x={-6.5} y={-54} width={13} height={6} rx="2" fill="#c8d6d2" stroke={P.glassLine} strokeWidth="1.4" />
    <path d="M-8 -22V-8" stroke="white" strokeWidth="2.4" opacity=".8" />
  </g>
}
function Jar({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-15} y={-32} width={30} height={32} rx="7" fill={P.glass} stroke={P.glassLine} strokeWidth="1.8" />
    <rect x={-13} y={-40} width={26} height={9} rx="3" fill="#c8d6d2" stroke={P.glassLine} strokeWidth="1.5" />
    <path d="M-9 -26V-8" stroke="white" strokeWidth="2.4" opacity=".8" />
  </g>
}
function Can({ x, y, s = 1, crushed = false }: { x: number; y: number; s?: number; crushed?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    {crushed
      ? <path d="M-10 0L-11 -10L-7 -14L-11 -20L-9 -28H9L11 -20L7 -14L11 -10L10 0Z" fill={P.metal} stroke={P.metalLine} strokeWidth="1.6" />
      : <><rect x={-10} y={-28} width={20} height={28} rx="3" fill={P.metal} stroke={P.metalLine} strokeWidth="1.6" /><path d="M-10 -21H10M-10 -7H10" stroke={P.metalLine} strokeWidth="1" opacity=".6" /></>}
    <path d="M-5 -24V-5" stroke="white" strokeWidth="2" opacity=".8" />
  </g>
}
function Bin({ x, y, s = 1, fill = '#dcefd6', line = P.leafLine }: { x: number; y: number; s?: number; fill?: string; line?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-20 -40H20L16 0H-16Z" fill={fill} stroke={line} strokeWidth="1.8" />
    <rect x={-24} y={-48} width={48} height={9} rx="4" fill={fill} stroke={line} strokeWidth="1.8" />
    <path d="M-8 -32V-8M0 -32V-8M8 -32V-8" stroke={line} strokeWidth="1.2" opacity=".5" />
  </g>
}
function Crate({ x, y }: { x: number; y: number }) {
  return <g>
    {[-22, -8, 6, 20].map(bx => <Bottle key={bx} x={x + bx} y={y - 14} s={.6} />)}
    <rect x={x - 34} y={y - 24} width={68} height={24} rx="5" fill="#e6d3b3" stroke={P.trunkLine} strokeWidth="1.8" />
    <path d={`M${x - 34} ${y - 12}H${x + 34}`} stroke={P.trunkLine} strokeWidth="1.2" />
  </g>
}
function Furnace({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={14} y={-84} width={14} height={30} rx="3" fill={P.brick} stroke={P.brickLine} strokeWidth="1.6" />
    <path d="M-36 0V-40Q-36 -66 0 -66Q36 -66 36 -40V0Z" fill={P.brick} stroke={P.brickLine} strokeWidth="1.8" />
    <path d="M-36 -22H36M-36 -44H36M-12 0V-22M12 -22V-44M-14 -44V-60" stroke={P.brickLine} strokeWidth="1" opacity=".45" />
    <path d="M-17 0V-18Q-17 -32 0 -32Q17 -32 17 -18V0Z" fill="#fbe2b8" stroke={P.brickLine} strokeWidth="1.6" />
    <Flame x={-6} y={-2} s={.8} /><Flame x={6} y={-2} s={1} />
  </g>
}
function BlastFurnace({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 26} ${y}L${x - 32} ${y - 40}L${x - 18} ${y - 120}H${x + 18}L${x + 32} ${y - 40}L${x + 26} ${y}Z`} fill={P.brick} stroke={P.brickLine} strokeWidth="1.8" />
    <path d={`M${x - 30} ${y - 40}H${x + 30}M${x - 24} ${y - 80}H${x + 24}`} stroke={P.brickLine} strokeWidth="1.1" opacity=".5" />
    <path d={`M${x - 22} ${y - 6}Q${x} ${y - 22} ${x + 22} ${y - 6}Z`} fill={P.molten} stroke={P.heatLine} strokeWidth="1.3" />
    <rect x={x - 22} y={y - 128} width={44} height={10} rx="4" fill={P.brick} stroke={P.brickLine} strokeWidth="1.6" />
  </g>
}
function Digger({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-30} y={-12} width={52} height={12} rx="6" fill={P.rubber} stroke={P.rubberLine} strokeWidth="1.5" />
    <rect x={-26} y={-32} width={38} height={20} rx="5" fill="#f2c08d" stroke="#b97434" strokeWidth="1.6" />
    <rect x={-22} y={-46} width={18} height={16} rx="4" fill="#f2c08d" stroke="#b97434" strokeWidth="1.6" />
    <rect x={-18} y={-43} width={10} height={8} rx="2" fill="white" stroke="#b97434" strokeWidth="1" />
    <path d="M10 -26L30 -44L44 -22" stroke="#b97434" strokeWidth="4" fill="none" />
    <path d="M38 -24L50 -26L46 -12Q40 -12 38 -24Z" fill="#c9cfd4" stroke={P.metalLine} strokeWidth="1.4" />
  </g>
}
function Mine({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 64} ${y}Q${x - 40} ${y - 70} ${x} ${y - 72}Q${x + 44} ${y - 70} ${x + 64} ${y}Z`} fill={P.soil} stroke={P.soilLine} strokeWidth="1.8" />
    <path d={`M${x - 18} ${y}V${y - 20}Q${x - 18} ${y - 36} ${x} ${y - 36}Q${x + 18} ${y - 36} ${x + 18} ${y - 20}V${y}Z`} fill="#5a524c" stroke={P.trunkLine} strokeWidth="1.8" />
    <path d={`M${x - 22} ${y}V${y - 22}Q${x - 22} ${y - 40} ${x} ${y - 40}Q${x + 22} ${y - 40} ${x + 22} ${y - 22}V${y}`} stroke={P.trunk} strokeWidth="4" fill="none" />
    <Rock x={x + 44} y={y - 8} rx={12} ry={8} specks />
  </g>
}
function Magnet({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 16} ${y}V${y - 14}A16 16 0 0 1 ${x + 16} ${y - 14}V${y}`} stroke="#d27a6d" strokeWidth="9" fill="none" strokeLinecap="butt" />
    <path d={`M${x - 20.5} ${y}h9M${x + 11.5} ${y}h9`} stroke={P.metalLine} strokeWidth="5" strokeLinecap="butt" />
    <path d={`M${x} ${y - 30}V${y - 44}`} stroke={muted} strokeWidth="1.6" />
  </g>
}
function Cullet({ x, y }: { x: number; y: number }) {
  const shards = [[-24, -4, 0], [-12, -10, 1], [0, -4, 2], [12, -12, 0], [22, -3, 1], [-4, -18, 2], [8, -24, 0], [-18, -16, 1]]
  const shapes = ['l8 -6l6 8l-10 4z', 'l10 2l-2 9l-9 -3z', 'l7 -8l5 7l-8 5z']
  return <g>{shards.map(([dx, dy, k], i) => <path key={i} d={`M${x + dx} ${y + dy}${shapes[k]}`} fill={P.glass} stroke={P.glassLine} strokeWidth="1.3" />)}</g>
}
function Scrap({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 40} ${y}C${x - 28} ${y - 26} ${x + 28} ${y - 26} ${x + 40} ${y}Z`} fill="#c9ced3" stroke={P.metalLine} strokeWidth="1.6" />
    <rect x={x - 30} y={y - 30} width={40} height={9} rx="3" transform={`rotate(-14 ${x - 10} ${y - 26})`} fill="#aab3bb" stroke={P.metalLine} strokeWidth="1.4" />
    <circle cx={x + 16} cy={y - 18} r={9} fill="none" stroke={P.metalLine} strokeWidth="3" />
    <rect x={x - 8} y={y - 16} width={22} height={7} rx="3" fill="#b9a89a" stroke="#86705e" strokeWidth="1.3" />
  </g>
}
const person = { a: '#a9cbe0', b: '#c6d9b4', c: '#f0d3a8', d: '#d8c6e6' }

// ---------- Section 2: sustainable development ----------
function Sustain() {
  return <Diagram viewBox="0 0 540 300" title="Sustainable development meets the needs of people today without damaging the lives of people in the future. One arch covers both groups.">
    <CurveArrow from={[270, 62]} c={[120, 62]} to={[80, 128]} colour={loop} width={2.8} />
    <CurveArrow from={[270, 62]} c={[420, 62]} to={[460, 128]} colour={loop} width={2.8} />
    <text x={270} y={46} textAnchor="middle" fontSize="15" fontWeight="700" fill={loop}>meet the needs of both</text>
    <Mini x={100} y={156} jumper={person.a} /><Mini x={150} y={164} facing={-1} jumper={person.b} scale={.36} />
    <Mini x={390} y={156} jumper={person.c} /><Mini x={440} y={170} facing={-1} jumper={person.d} scale={.3} />
    <Tree x={270} y={220} s={.8} seed={11} />
    <text x={124} y={244} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>people today</text>
    <text x={416} y={244} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>people in the future</text>
    <Arrow from={[70, 272]} to={[470, 272]} colour={muted} width={1.8} />
    <text x={270} y={292} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>time</text>
  </Diagram>
}
function Unsustain() {
  const panels = [{ x: 12, title: ['finite raw', 'materials'] }, { x: 188, title: ['extraction: energy', 'and waste'] }, { x: 364, title: ['processing: energy', 'from finite fuels'] }]
  return <Diagram viewBox="0 0 540 280" title="Why using resources can be unsustainable. 1: the raw materials are finite. 2: extracting them uses energy and makes waste. 3: processing them uses energy from finite fuels.">
    {panels.map((p, i) => <Card key={i} x={p.x} y={16} w={164} h={236}>
      <StepBadge n={i + 1} x={p.x + 24} y={40} />
      <Lines x={p.x + 82} y={212} anchor="middle" lines={p.title} size={13} />
    </Card>)}
    {/* 1 a pile that has shrunk: dashed line shows how big it was */}
    <Heap x={94} y={176} w={128} h={96} dashed line={P.finiteInk} />
    <Heap x={94} y={176} w={80} h={46} fill={P.rock} line={P.rockLine} />
    <Arrow from={[94, 100]} to={[94, 118]} colour={P.finiteInk} width={1.8} />
    {/* 2 digger, energy and a waste heap */}
    <Digger x={236} y={176} s={.95} />
    <Spark x={238} y={92} s={.9} />
    <Heap x={318} y={176} w={50} h={28} fill="#d8cbbb" line={P.rockLine} />
    <text x={318} y={194} textAnchor="middle" fontSize="12" fontWeight="600" fill={muted}>waste</text>
    {/* 3 furnace fed by a fuel drum */}
    <Furnace x={416} y={176} s={.85} />
    <Drum x={492} y={176} s={.7} label />
    <Spark x={416} y={82} s={.9} />
  </Diagram>
}
function UseLess() {
  const side = (x: number, left: number, title: string, spark: number) => <g>
    <text x={x} y={40} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{title}</text>
    <Heap x={x - 26} y={200} w={150} h={110} dashed line={P.finiteInk} />
    <Heap x={x - 26} y={200} w={150 * Math.sqrt(left)} h={110 * Math.sqrt(left)} fill={P.rock} line={P.rockLine} />
    <Spark x={x + 84} y={110} s={spark} />
    <text x={x + 84} y={150} textAnchor="middle" fontSize="12" fontWeight="600" fill={muted}>energy</text>
    <text x={x - 26} y={224} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>{left > .5 ? 'more left' : 'little left'}</text>
  </g>
  return <Diagram viewBox="0 0 540 290" title="Using less of a finite resource. When a lot is used, little of the pile is left and a lot of energy is needed. When less is used, more of the pile is left and less energy is needed.">
    {side(130, .18, 'use a lot', 1.3)}
    <path d="M270 28V236" stroke={panelLine} strokeWidth="1.4" strokeDasharray="4 5" />
    {side(410, .7, 'use less', .7)}
    <Caption y={264} text="Use less: saves the resource" />
    <Caption y={282} text="and the energy to make it" />
  </Diagram>
}
function LoopScene({ title, stations, centre, extra }: { title: string; stations: { at: [number, number]; icon: ReactNode; label: string; lx?: number; ly?: number; anchor?: 'start' | 'middle' | 'end' }[]; centre: string[]; extra?: ReactNode }) {
  // Four stations round an oval (top, right, bottom, left); arrows run clockwise between them.
  const cx = 270, cy = 152, rx = 178, ry = 104
  const arc = (a0: number, a1: number) => {
    const p = (a: number): [number, number] => [Math.round(cx + rx * Math.cos(a)), Math.round(cy + ry * Math.sin(a))]
    const m = (a0 + a1) / 2, c = p(m), k = 1.1
    return <CurveArrow key={a0} from={p(a0)} c={[Math.round(cx + (c[0] - cx) * k), Math.round(cy + (c[1] - cy) * k)]} to={p(a1)} colour={loop} width={2.6} />
  }
  const d = Math.PI / 180
  return <Diagram viewBox="0 0 540 310" title={title}>
    {arc(-66 * d, -24 * d)}{arc(24 * d, 66 * d)}{arc(114 * d, 156 * d)}{arc(204 * d, 246 * d)}
    {stations.map(s => <g key={s.label}>{s.icon}<Lines x={s.lx ?? s.at[0]} y={s.ly ?? s.at[1] + 22} anchor={s.anchor ?? 'middle'} lines={[s.label]} size={14} /></g>)}
    <Lines x={cx} y={cy - 4} anchor="middle" lines={centre} size={16} colour={loop} />
    {extra}
  </Diagram>
}
function RecycleLoop() {
  return <LoopScene title="Recycling loop: a new product is used, collected, then processed to make a new product. Reuse is a short cut: the item is used again as it is."
    centre={['recycling']}
    stations={[
      { at: [270, 60], icon: <Bottle x={270} y={62} full />, label: 'new product', lx: 294, ly: 44, anchor: 'start' },
      { at: [448, 152], icon: <Bottle x={448} y={160} />, label: 'used', lx: 448, ly: 184 },
      { at: [270, 256], icon: <Bin x={270} y={262} s={.9} />, label: 'collected', lx: 270, ly: 292 },
      { at: [92, 152], icon: <Furnace x={92} y={170} s={.62} />, label: 'processed', lx: 92, ly: 194 },
    ]}
    extra={<g>
      <CurveArrow from={[430, 110]} c={[380, 70]} to={[300, 64]} colour={loop} width={2} dashed />
      <Lines x={352} y={112} anchor="middle" lines={['reuse: use it', 'again as it is']} size={13} weight={700} colour={loop} />
    </g>} />
}

// ---------- Section 3: metals ----------
function MetalEnergy() {
  return <Diagram viewBox="0 0 540 290" title="Making a new metal: the ore is mined, then the metal is extracted in a hot furnace. Both use lots of energy, and most of it comes from burning fossil fuels.">
    <Mine x={96} y={196} />
    <Arrow from={[168, 170]} to={[214, 170]} colour={muted} width={2.2} />
    <Furnace x={276} y={196} />
    <Spark x={96} y={96} s={.8} /><Spark x={234} y={96} s={.8} /><Spark x={276} y={82} s={1.05} /><Spark x={320} y={96} s={.8} />
    <Drum x={456} y={196} label />
    <Arrow from={[428, 170]} to={[336, 170]} colour={P.finiteInk} width={2.2} />
    <text x={96} y={222} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>mine the ore</text>
    <text x={276} y={222} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>extract the metal</text>
    <Lines x={456} y={222} anchor="middle" lines={['fossil fuel']} size={14} colour={P.finiteInk} />
    <Caption y={262} text="Most energy comes from burning fossil fuels" />
  </Diagram>
}
function MetalBenefits() {
  const cards: { x: number; icon: ReactNode; label: string[] }[] = [
    { x: 14, icon: <g><Spark x={94} y={124} s={2.2} dim /><Spark x={94} y={124} s={.9} /></g>, label: ['much less', 'energy'] },
    { x: 190, icon: <g><Heap x={270} y={160} w={110} h={66} fill={P.rock} line={P.rockLine} /><Rock x={250} y={138} rx={14} ry={9} specks /><Rock x={290} y={146} rx={13} ry={8} seed={9} specks /></g>, label: ['saves some of', 'the limited metal'] },
    { x: 366, icon: <g><Heap x={446} y={160} w={130} h={60} dashed line={muted} /><Heap x={446} y={160} w={70} h={30} fill="#d8cbbb" line={P.rockLine} /><Can x={462} y={150} s={.7} crushed /></g>, label: ['less waste', 'to landfill'] },
  ]
  return <Diagram viewBox="0 0 540 270" title="Three benefits of recycling metals: it often uses much less energy, it saves some of the limited metal in the Earth, and it sends less waste to landfill.">
    <text x={270} y={24} textAnchor="middle" fontSize="15" fontWeight="700" fill={loop}>Recycling metals</text>
    {cards.map((c, i) => <Card key={i} x={c.x} y={38} w={160} h={196}>
      {c.icon}
      <Lines x={c.x + 80} y={198} anchor="middle" lines={c.label} size={14} />
    </Card>)}
    <Caption y={260} text="Better than making new metal from ore" />
  </Diagram>
}
function MetalSteps() {
  const titles = [['separate'], ['melt down'], ['recast: mould', 'a new shape']]
  return <Diagram viewBox="0 0 540 270" title="Recycling metals in three steps: 1 separate the metal from other waste, 2 melt it down, 3 pour it into a mould to recast it as a new product.">
    {titles.map((t, i) => <Card key={i} x={14 + i * 176} y={20} w={160} h={210}>
      <StepBadge n={i + 1} x={38 + i * 176} y={44} />
      <Lines x={94 + i * 176} y={200} anchor="middle" lines={t} size={14} />
    </Card>)}
    {/* 1 a magnet lifts cans out of mixed waste */}
    <Magnet x={94} y={94} />
    <Can x={94} y={126} s={.9} />
    <path d="M40 176C52 150 136 150 148 176Z" fill="#e7dccd" stroke={P.rockLine} strokeWidth="1.6" />
    <Bottle x={68} y={170} s={.5} /><Can x={120} y={168} s={.6} crushed />
    {/* 2 molten metal */}
    <Crucible x={270} y={140} s={1.1} />
    {/* 3 pour into a mould, get a new bar */}
    <g transform="rotate(38 420 84)"><path d="M404 72L407 92Q408 96 412 96H428Q432 96 433 92L436 72Z" fill="#d6ccc1" stroke="#7d7065" strokeWidth="1.6" /><path d="M405 78H435L434 86H406Z" fill={P.molten} /></g>
    <path d="M430 98Q433 106 433 118" stroke={P.molten} strokeWidth="4" fill="none" />
    <rect x={400} y={116} width={66} height={30} rx="6" fill="#cfc6bb" stroke="#7d7065" strokeWidth="1.6" />
    <rect x={410} y={122} width={46} height={14} rx="4" fill={P.molten} stroke={P.heatLine} strokeWidth="1.2" />
    <Ingot x={450} y={178} s={.8} />
    <Arrow from={[430, 150]} to={[438, 158]} colour={muted} width={1.6} />
    <Arrow from={[176, 124]} to={[186, 124]} colour={muted} width={2} /><Arrow from={[352, 124]} to={[362, 124]} colour={muted} width={2} />
  </Diagram>
}
function MetalMixed() {
  return <Diagram viewBox="0 0 540 290" title="Waste steel and iron can stay together: both are added to iron in a blast furnace, so less iron ore is needed. Other metals are separated only if the new product needs it.">
    <Scrap x={90} y={196} />
    <text x={90} y={222} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>steel and iron</text>
    <text x={90} y={240} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>kept together</text>
    <CurveArrow from={[120, 164]} c={[170, 80]} to={[222, 86]} colour={loop} width={2.4} />
    <BlastFurnace x={256} y={210} />
    <text x={256} y={232} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>blast furnace</text>
    <Heap x={256} y={60} w={64} h={32} dashed line={P.finiteInk} />
    <Heap x={256} y={60} w={36} h={16} fill={P.rock} line={P.rockLine} lumps={false} />
    <Arrow from={[256, 64]} to={[256, 78]} colour={P.finiteInk} width={1.6} />
    <Lines x={294} y={42} lines={['less iron ore', 'needed']} size={13} colour={P.finiteInk} />
    <path d="M386 100V250" stroke={panelLine} strokeWidth="1.4" strokeDasharray="4 5" />
    <Bin x={462} y={186} s={1.1} fill={P.metal} line={P.metalLine} />
    <Can x={448} y={140} s={.7} /><Can x={474} y={142} s={.7} crushed />
    <Lines x={462} y={210} anchor="middle" lines={['other metals:', 'separate if the', 'product needs it']} size={13} weight={600} colour={muted} />
    <Caption y={282} text="How much to separate depends on the product" />
  </Diagram>
}

// ---------- Section 4: glass ----------
function GlassBenefits() {
  return <Diagram viewBox="0 0 540 260" title="Reusing or recycling glass means less energy is used to make new glass and less glass is thrown away.">
    <Card x={24} y={20} w={236} h={190}>
      <Furnace x={110} y={150} s={.75} />
      <Spark x={186} y={82} s={1.8} dim /><Spark x={186} y={82} s={.8} />
      <Jar x={200} y={150} />
      <Lines x={142} y={184} anchor="middle" lines={['less energy to make', 'new glass']} size={14} />
    </Card>
    <Card x={280} y={20} w={236} h={190}>
      <Heap x={398} y={150} w={150} h={70} dashed line={muted} />
      <Heap x={398} y={150} w={80} h={30} fill="#d8cbbb" line={P.rockLine} />
      <Bottle x={404} y={124} s={.5} />
      <Lines x={398} y={184} anchor="middle" lines={['less glass', 'thrown away']} size={14} />
    </Card>
    <Caption y={242} text="Reuse and recycling both help" />
  </Diagram>
}
function GlassReuse() {
  return <LoopScene title="Reusing a glass bottle: it is filled, used, collected and washed, then filled again. It keeps the same shape."
    centre={['reuse:', 'same shape']}
    stations={[
      { at: [270, 60], icon: <Bottle x={270} y={62} full />, label: 'filled', lx: 294, ly: 44, anchor: 'start' },
      { at: [448, 152], icon: <Bottle x={448} y={160} />, label: 'used', lx: 448, ly: 184 },
      { at: [270, 256], icon: <Crate x={270} y={262} />, label: 'collected', lx: 270, ly: 292 },
      { at: [92, 152], icon: <g><Bottle x={92} y={160} /><circle cx={70} cy={128} r={4} fill={P.water} stroke={P.waterLine} strokeWidth="1.2" /><circle cx={114} cy={120} r={5} fill={P.water} stroke={P.waterLine} strokeWidth="1.2" /><circle cx={110} cy={140} r={3.5} fill={P.water} stroke={P.waterLine} strokeWidth="1.2" /></g>, label: 'washed', lx: 92, ly: 184 },
    ]} />
}
function GlassRecycle() {
  const xs = [70, 204, 338, 470]
  return <Diagram viewBox="0 0 540 250" title="Recycling glass that cannot be reused: old glass is crushed, melted and reshaped into new jars.">
    <Bottle x={xs[0] - 12} y={150} /><Bottle x={xs[0] + 14} y={150} s={.8} />
    <Cullet x={xs[1]} y={146} />
    <Crucible x={xs[2]} y={128} s={1} />
    <Jar x={xs[3] - 18} y={150} /><Jar x={xs[3] + 18} y={150} />
    {[0, 1, 2].map(i => <Arrow key={i} from={[xs[i] + 40, 124]} to={[xs[i + 1] - 42, 124]} colour={loop} width={2.4} />)}
    <text x={xs[0]} y={180} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>old glass</text>
    <text x={xs[1]} y={180} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>crush</text>
    <text x={xs[2]} y={180} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>melt</text>
    <text x={xs[3]} y={180} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>reshape</text>
    <text x={xs[3]} y={198} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>new jars</text>
    <Caption y={236} text="Crush, melt, reshape" />
  </Diagram>
}

// ---------- On your own: energy bar chart ----------
function EnergyChart() {
  const x0 = 110, y0 = 240, h = 170, max = 100, yAt = (v: number) => y0 - (v / max) * h
  const bars = [{ label: 'from ore', v: 100, x: 190, fill: P.finite, line: P.finiteInk }, { label: 'from recycled scrap', v: 10, x: 350, fill: P.metal, line: P.metalLine }]
  return <Diagram viewBox="0 0 540 300" schematic={false} title="A bar chart comparing the energy used to make a metal from ore, 100 units, and from recycled scrap, 10 units.">
    <text x={300} y={26} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>Energy used to make 1 tonne of metal</text>
    {[0, 20, 40, 60, 80, 100].map(v => <g key={v}>
      <path d={`M${x0} ${yAt(v)}H500`} stroke={panelLine} strokeWidth="1" />
      <text x={x0 - 8} y={yAt(v) + 4} textAnchor="end" fontSize="12" fontWeight="600" fill={muted}>{v}</text>
    </g>)}
    {bars.map(b => <g key={b.label}>
      <rect x={b.x - 40} y={yAt(b.v)} width={80} height={(b.v / max) * h} rx="3" fill={b.fill} stroke={b.line} strokeWidth="1.8" />
      <text x={b.x} y={yAt(b.v) - 8} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{b.v}</text>
      <text x={b.x} y={y0 + 22} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{b.label}</text>
    </g>)}
    <path d={`M${x0} ${yAt(100) - 6}V${y0}H500`} stroke={ink} strokeWidth="1.8" fill="none" />
    <text x={48} y={156} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink} transform="rotate(-90 48 156)">energy used (units)</text>
  </Diagram>
}

export function RecycleVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment // the chart carries data only, never a conclusion, in either view
  if (focus === 'recycle-sustain') return <Sustain />
  if (focus === 'recycle-unsustain') return <Unsustain />
  if (focus === 'recycle-less') return <UseLess />
  if (focus === 'recycle-loop') return <RecycleLoop />
  if (focus === 'recycle-metal-energy') return <MetalEnergy />
  if (focus === 'recycle-metal-benefits') return <MetalBenefits />
  if (focus === 'recycle-metal-steps') return <MetalSteps />
  if (focus === 'recycle-metal-mixed') return <MetalMixed />
  if (focus === 'recycle-glass-benefits') return <GlassBenefits />
  if (focus === 'recycle-glass-reuse') return <GlassReuse />
  if (focus === 'recycle-glass-recycle') return <GlassRecycle />
  if (focus === 'recycle-q-energy') return <EnergyChart />
  return <RecycleLoop />
}
