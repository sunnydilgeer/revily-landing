import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry Lesson 40: Cracking. Original, code-native schematics; not to scale. Focus ids start with 'crack-'.
 *
 * Colour code (the same in every drawing here, and the chain beads match the fractional distillation lesson):
 *   alkane chain = warm tan beads, one bead per carbon atom (hydrogens left out)
 *   alkene chain = soft teal-green beads with one visibly doubled link (the C=C double bond)
 *   heat = orange flame; steam = blue wisps; aluminium oxide catalyst = pale grey specks
 *   bromine water = orange; colourless liquid = very pale glass tint
 * The worked equation uses decane → octane + ethene (C10H22 → C8H18 + C2H4), and the chain drawings use the same
 * molecules (10 → 8 + 2 beads), so the pictures and the arithmetic agree.
 */
const { ink, muted, panelFill, panelLine } = atomPalette
const alkane = '#e3c9a3', alkaneLine = '#8a6440'
const alkene = '#bfe3da', alkeneLine = '#3f8b80'
const flameOut = '#f5a54a', flameIn = '#fcd97d', heatLine = '#c8641e'
const steam = '#6fa8d6'
const speck = '#ebe7df', speckLine = '#968e80'
const glass = '#f5fafd', glassLine = '#6f8fa6'
const bromine = '#f39a36', bromineLine = '#c46a17'
const hydro = '#f6f0d8', hydroLine = '#b9a77a'
const halo = '#f8c979'
const good = '#4f9a74'
const cTint = '#f1e2cc', hTint = '#e1eef8', hLine = '#6f93b3'

type Pt = [number, number]
const r1 = (n: number) => Math.round(n * 10) / 10

function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Lines({ x, y, lines, anchor = 'start', size = 14, weight = 700, colour = ink }: { x: number; y: number; lines: string[]; anchor?: 'start' | 'middle' | 'end'; size?: number; weight?: number; colour?: string }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={colour}>{lines.map((l, i) => <tspan key={i} x={x} dy={i ? size + 3 : 0}>{l}</tspan>)}</text>
}
function Caption({ text, y = 288 }: { text: string; y?: number }) {
  return <text x={270} y={y} textAnchor="middle" fontSize="14" fontWeight="600" fill={muted}>{text}</text>
}
function Leader({ from, to, colour = ink }: { from: Pt; to: Pt; colour?: string }) {
  return <g><path d={`M${from[0]} ${from[1]}L${to[0]} ${to[1]}`} stroke={colour} strokeWidth="1.4" /><circle cx={to[0]} cy={to[1]} r="2.6" fill={colour} /></g>
}
function Arrow({ from, to, colour = ink, width = 2.4, dashed = false }: { from: Pt; to: Pt; colour?: string; width?: number; dashed?: boolean }) {
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]), h = 6 + width * 1.5
  const p = (d: number, s: number): Pt => [r1(to[0] - Math.cos(a) * d + Math.cos(a + Math.PI / 2) * s), r1(to[1] - Math.sin(a) * d + Math.sin(a + Math.PI / 2) * s)]
  const [b1, b2, base] = [p(h, h * .6), p(h, -h * .6), p(h * .7, 0)]
  return <g><path d={`M${from[0]} ${from[1]}L${base[0]} ${base[1]}`} stroke={colour} strokeWidth={width} fill="none" strokeDasharray={dashed ? '6 6' : undefined} /><path d={`M${to[0]} ${to[1]}L${b1[0]} ${b1[1]}L${b2[0]} ${b2[1]}Z`} fill={colour} stroke={colour} strokeWidth="1.2" /></g>
}
function Pointer({ n, x, y, to }: { n: number; x: number; y: number; to: Pt }) {
  const angle = Math.atan2(to[1] - y, to[0] - x)
  return <g><path d={`M${r1(x + Math.cos(angle) * 13)} ${r1(y + Math.sin(angle) * 13)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
    <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}
function Flame({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0C-9 -4 -8 -14 -2 -22C-1 -15 4 -14 3 -20C9 -13 10 -4 0 0Z" fill={flameOut} stroke={heatLine} strokeWidth="1.4" />
    <path d="M0 -3C-4 -6 -3 -11 0 -14C1 -10 4 -8 0 -3Z" fill={flameIn} />
  </g>
}
function Wisp({ x, y, colour = steam }: { x: number; y: number; colour?: string }) {
  return <path d={`M${x} ${y}q-5 -6 0 -12t0 -12`} stroke={colour} strokeWidth="2.2" fill="none" />
}

// ---------- Chains: one bead per carbon atom. An alkene has one doubled link (C=C). ----------
function Chain({ x, y, n, kind = 'alkane', r = 6, gap = 16, zig = 3 }: { x: number; y: number; n: number; kind?: 'alkane' | 'alkene'; r?: number; gap?: number; zig?: number }) {
  const fill = kind === 'alkene' ? alkene : alkane, line = kind === 'alkene' ? alkeneLine : alkaneLine
  const z = kind === 'alkene' && n === 2 ? 0 : zig
  const pts = Array.from({ length: n }, (_, i) => [r1(x + i * gap), r1(y + (i % 2 ? -z : z))] as Pt)
  const double = kind === 'alkene' && n > 1
  let links = pts.slice(1).map((p, i) => <path key={i} d={`M${pts[i][0]} ${pts[i][1]}L${p[0]} ${p[1]}`} stroke={line} strokeWidth="2" />)
  if (double) {
    const [a, b] = pts, ang = Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2, o = Math.max(2.4, r * .45)
    const off = (p: Pt, s: number) => `${r1(p[0] + Math.cos(ang) * o * s)} ${r1(p[1] + Math.sin(ang) * o * s)}`
    links = [<path key="d" d={`M${off(a, 1)}L${off(b, 1)}M${off(a, -1)}L${off(b, -1)}`} stroke={line} strokeWidth="2" />, ...links.slice(1)]
  }
  return <g>{links}{pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={r} fill={fill} stroke={line} strokeWidth="1.5" />)}</g>
}
const chainW = (n: number, gap = 16) => (n - 1) * gap

// ---------- Section 1: why crack, and what it makes ----------
function Pump({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={0} width={54} height={96} rx="10" fill="#e8f1f7" stroke={glassLine} strokeWidth="2" />
    <rect x={9} y={12} width={36} height={24} rx="5" fill="white" stroke={glassLine} strokeWidth="1.6" />
    <rect x={-6} y={94} width={66} height={10} rx="4" fill="#cfd8df" stroke={glassLine} strokeWidth="1.6" />
    <path d="M54 30q16 4 16 22v24q0 8 -8 8" stroke={ink} strokeWidth="3.5" fill="none" />
    <path d="M56 80h10v12h-10z" fill="#9aa7b2" stroke={ink} strokeWidth="1.4" />
    <path d="M27 52q-8 11 0 16q8 -5 0 -16z" fill="#f2b54f" stroke="#b9791a" strokeWidth="1.3" />
  </g>
}
function Demand() {
  const bars: { x: number; h: number; long: boolean }[] = [{ x: 318, h: 130, long: true }, { x: 358, h: 44, long: false }, { x: 428, h: 44, long: true }, { x: 468, h: 130, long: false }]
  return <Diagram title="Short-chain molecules make better fuels and are in high demand. Crude oil has more long chains than we need and fewer short chains than we need.">
    <Chain x={30} y={82} n={3} r={5.5} gap={13} />
    <Arrow from={[72, 82]} to={[186, 112]} width={4.5} />
    <Lines x={30} y={44} lines={['small molecules:', 'high demand']} />
    <Chain x={24} y={196} n={9} r={5} gap={12} />
    <Arrow from={[128, 190]} to={[186, 162]} colour={muted} width={1.8} dashed />
    <Lines x={24} y={226} lines={['long chains: not', 'wanted as much']} weight={600} colour={muted} />
    <Pump x={196} y={88} />
    {/* schematic bars, no numbers */}
    <path d="M304 62V210H522" stroke={muted} strokeWidth="1.6" fill="none" />
    {bars.map((b, i) => <g key={i}>
      <rect x={b.x} y={210 - b.h} width={34} height={b.h} rx="7" fill={b.long ? '#d7b588' : alkane} stroke={alkaneLine} strokeWidth="1.5" opacity={b.long ? 1 : .95} />
      <text x={b.x + 17} y={228} textAnchor="middle" fontSize="12" fontWeight="600" fill={muted}>{b.long ? 'long' : 'short'}</text>
    </g>)}
    <text x={352} y={252} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>what oil has</text>
    <text x={480} y={252} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>what we need</text>
    <Caption text="Not enough short chains in crude oil" />
  </Diagram>
}
function Split({ labels }: { labels: boolean }) {
  const title = labels
    ? 'Cracking splits a long-chain alkane into a shorter alkane, used as fuel such as petrol, and an alkene, which has a C=C double bond.'
    : 'Cracking: one long hydrocarbon chain is heated and split into smaller molecules.'
  return <Diagram title={title}>
    <Chain x={28} y={128} n={10} />
    <Flame x={80} y={186} /><Flame x={100} y={190} s={1.15} /><Flame x={120} y={186} />
    <text x={100} y={214} textAnchor="middle" fontSize="14" fontWeight="700" fill={heatLine}>heat</text>
    <Arrow from={[190, 128]} to={[262, 128]} width={3} />
    <text x={226} y={112} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>cracking</text>
    <Chain x={290} y={106} n={8} />
    <Chain x={330} y={176} n={2} kind="alkene" gap={24} />
    {labels && <g>
      <Lines x={290} y={62} lines={['alkane: fuel, e.g. petrol']} colour={alkaneLine} />
      <Lines x={374} y={182} lines={['alkene']} colour={alkeneLine} />
      <Lines x={374} y={214} lines={['C=C double bond']} size={13} weight={600} colour={muted} />
      <Leader from={[370, 210]} to={[342, 179]} colour={muted} />
    </g>}
    <Caption text={labels ? 'Cracking makes an alkane and an alkene' : 'A long chain is split into smaller molecules'} />
  </Diagram>
}
function AlkeneUses() {
  return <Diagram viewBox="0 0 540 310" title="Alkenes are more reactive than alkanes. They are a starting material for other compounds and are used to make polymers.">
    <Chain x={253} y={120} n={2} kind="alkene" r={11} gap={36} zig={0} />
    <text x={271} y={154} textAnchor="middle" fontSize="14" fontWeight="700" fill={alkeneLine}>alkene</text>
    <Arrow from={[236, 108]} to={[182, 76]} />
    <Arrow from={[306, 108]} to={[340, 86]} />
    <Arrow from={[271, 166]} to={[271, 204]} />
    {/* reactive: a little spark */}
    <path d="M40 60l6 -12l4 10l8 -4l-5 10l9 4l-11 2l1 10l-7 -8l-7 7l2 -10l-10 -2z" fill="#fcd97d" stroke={heatLine} strokeWidth="1.3" />
    <Lines x={76} y={56} lines={['more reactive', 'than alkanes']} />
    {/* starting material: a small flask */}
    <path d="M358 40h12v14l12 22q3 7 -5 7h-26q-8 0 -5 -7l12 -22z" fill="#e8f1f7" stroke={glassLine} strokeWidth="1.8" />
    <path d="M350 70h28l4 7q2 5 -4 5h-28q-6 0 -4 -5z" fill={alkene} stroke="none" />
    <Lines x={392} y={56} lines={['starting material', 'for other', 'compounds']} />
    {/* polymer: a long repeating chain made from many alkenes */}
    <path d="M172 226H364" stroke={alkeneLine} strokeWidth="2" />
    <g>{Array.from({ length: 13 }, (_, i) => <circle key={i} cx={172 + i * 16} cy={226} r={5.5} fill={alkene} stroke={alkeneLine} strokeWidth="1.5" />)}</g>
    <text x={160} y={231} textAnchor="end" fontSize="16" fill={alkeneLine}>…</text>
    <text x={378} y={231} fontSize="16" fill={alkeneLine}>…</text>
    <text x={271} y={258} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>used to make polymers</text>
    <Caption y={296} text="Reactive, so a useful starting material" />
  </Diagram>
}

// ---------- Section 2: how cracking is done ----------
function Thermal() {
  return <Diagram title="Thermal decomposition: a long chain is heated over a flame and breaks into smaller pieces.">
    <Lines x={270} y={42} anchor="middle" lines={['thermal decomposition:', 'broken down by heating']} />
    <Chain x={34} y={140} n={10} />
    <Flame x={86} y={196} /><Flame x={106} y={200} s={1.15} /><Flame x={126} y={196} />
    <Arrow from={[196, 140]} to={[262, 140]} width={3} />
    <Chain x={290} y={140} n={8} />
    <path d="M418 126l-6 7l7 3l-5 8" stroke={heatLine} strokeWidth="2" fill="none" />
    <Chain x={432} y={140} n={2} kind="alkene" gap={24} />
    <Flame x={342} y={196} /><Flame x={362} y={200} s={1.15} /><Flame x={382} y={196} />
    <Caption text="Two methods: steam cracking and catalytic cracking" />
  </Diagram>
}
function Cloud({ x, y, w = 110, h = 62, children }: { x: number; y: number; w?: number; h?: number; children?: ReactNode }) {
  return <g><rect x={x} y={y} width={w} height={h} rx={h / 2} fill="#f2f6fa" stroke="#9fb4c6" strokeWidth="1.8" strokeDasharray="5 4" />{children}</g>
}
function Speck({ x, y, r = 4.5 }: { x: number; y: number; r?: number }) {
  return <path d={`M${x - r} ${y}q0 -${r} ${r} -${r}q${r} 0 ${r} ${r * .9}q-.3 ${r} -${r} ${r}q-${r} .2 -${r} -${r * .9}z`} fill={speck} stroke={speckLine} strokeWidth="1.2" />
}
function StepCard({ n, x, title, children, active = true }: { n: number; x: number; title: string[]; children: ReactNode; active?: boolean }) {
  return <g opacity={active ? 1 : .4}>
    <rect x={x} y={46} width={150} height={176} rx="18" fill={panelFill} stroke={panelLine} strokeWidth="1.6" />
    <circle cx={x + 22} cy={68} r="12" fill={ink} /><text x={x + 22} y={73} textAnchor="middle" fontSize="14" fontWeight="700" fill="white">{n}</text>
    {children}
    <Lines x={x + 75} y={186} anchor="middle" lines={title} size={14} />
  </g>
}
function Steam() {
  return <Diagram title="Steam cracking in three steps: vaporise the long-chain hydrocarbons, mix the vapour with steam, then heat to a very high temperature so the molecules split.">
    <StepCard n={1} x={16} title={['vaporise']}>
      <Cloud x={36} y={90} />
      <Chain x={56} y={118} n={7} r={4} gap={10} zig={2} /><Chain x={66} y={140} n={6} r={4} gap={10} zig={2} />
    </StepCard>
    <StepCard n={2} x={195} title={['mix with', 'steam']}>
      <Chain x={222} y={114} n={7} r={4} gap={10} zig={2} /><Chain x={232} y={144} n={6} r={4} gap={10} zig={2} />
      <Wisp x={218} y={160} /><Wisp x={300} y={160} /><Wisp x={262} y={104} />
    </StepCard>
    <StepCard n={3} x={374} title={['heat to a very', 'high temperature']}>
      <Chain x={396} y={100} n={5} r={4} gap={10} zig={2} /><Chain x={456} y={100} n={2} kind="alkene" r={4} gap={14} zig={0} />
      <Chain x={404} y={124} n={4} r={4} gap={10} zig={2} /><Chain x={452} y={124} n={2} kind="alkene" r={4} gap={14} zig={0} />
      <Flame x={430} y={166} /><Flame x={449} y={170} s={1.15} /><Flame x={468} y={166} />
    </StepCard>
    <Arrow from={[168, 134]} to={[192, 134]} /><Arrow from={[347, 134]} to={[371, 134]} />
    <Caption y={262} text="Long chains split into smaller molecules" />
  </Diagram>
}
const SPECKS: Pt[] = [[150, 108], [172, 111], [196, 107], [220, 111], [244, 108], [268, 111], [292, 107], [316, 111], [340, 108], [364, 111], [388, 107]]
function Catalytic() {
  return <Diagram viewBox="0 0 540 310" title="Catalytic cracking: vapour of long-chain hydrocarbons passes over hot powdered aluminium oxide catalyst in a tube. The long molecules split apart on the surface of the catalyst specks.">
    {/* heated tube */}
    <rect x={126} y={70} width={290} height={50} rx="25" fill={glass} stroke={glassLine} strokeWidth="2.2" />
    {SPECKS.map(([x, y], i) => <g key={i}><Speck x={x} y={y} r={6} /><Speck x={x + 11} y={y + 3} r={5} /></g>)}
    {[176, 236, 296, 356].map(x => <Flame key={x} x={x} y={150} s={.9} />)}
    <Chain x={20} y={94} n={8} r={4} gap={10} zig={2} />
    <Arrow from={[98, 94]} to={[140, 94]} colour={muted} width={2} />
    <Lines x={20} y={124} lines={['long-chain', 'vapour']} size={13} weight={600} colour={muted} />
    <Arrow from={[400, 94]} to={[440, 94]} colour={muted} width={2} />
    <Chain x={450} y={82} n={4} r={4} gap={10} zig={2} /><Chain x={452} y={104} n={2} kind="alkene" r={4} gap={14} zig={0} /><Chain x={482} y={104} n={3} r={4} gap={10} zig={2} />
    <text x={450} y={134} fontSize="13" fontWeight="600" fill={muted}>smaller</text><text x={450} y={150} fontSize="13" fontWeight="600" fill={muted}>molecules</text>
    <Lines x={20} y={196} lines={['hot powdered', 'aluminium oxide', 'catalyst']} />
    <Leader from={[128, 190]} to={[150, 110]} />
    {/* magnified speck */}
    <path d="M268 111L262 186M268 111L322 186" stroke={muted} strokeWidth="1.3" strokeDasharray="4 4" />
    <circle cx={292} cy={230} r={52} fill="white" stroke="#7f9fb8" strokeWidth="3" />
    <path d="M252 262q-2 -26 16 -32q24 -8 48 2q14 8 12 30z" fill={speck} stroke={speckLine} strokeWidth="1.6" />
    <Chain x={254} y={222} n={4} r={4.5} gap={11} zig={1.5} />
    <Chain x={308} y={222} n={2} kind="alkene" r={4.5} gap={15} zig={0} />
    <path d="M298 208l-3 6l5 2l-3 6" stroke={heatLine} strokeWidth="1.8" fill="none" />
    <Lines x={356} y={224} lines={['molecules split apart', 'on the surface']} />
    <Caption y={300} text="A catalyst speeds up the reaction and is not used up" />
  </Diagram>
}
function MethodRow({ y, x, icon, text, highlight = false }: { y: number; x: number; icon: ReactNode; text: string[]; highlight?: boolean }) {
  return <g>
    {highlight && <rect x={x - 6} y={y - 6} width={222} height={64} rx="20" fill={halo} opacity=".5" />}
    <rect x={x} y={y} width={210} height={52} rx="15" fill={panelFill} stroke={highlight ? heatLine : panelLine} strokeWidth={highlight ? 2 : 1.6} />
    {icon}
    <Lines x={x + 66} y={y + (text.length > 1 ? 22 : 31)} lines={text} size={14} />
  </g>
}
function Methods() {
  const cols = [30, 300], rows = [58, 142, 226]
  const cloud = (x: number, y: number) => <g><Cloud x={x + 8} y={y + 8} w={48} h={36} /></g>
  const flame = (x: number, y: number) => <g><Flame x={x + 24} y={y + 42} /><Flame x={x + 38} y={y + 44} s={1.1} /></g>
  return <Diagram viewBox="0 0 540 340" title="Steam cracking and catalytic cracking side by side. Both vaporise the hydrocarbons and both use heat. Steam cracking mixes the vapour with steam; catalytic cracking passes it over a catalyst.">
    <text x={cols[0] + 105} y={34} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>Steam cracking</text>
    <text x={cols[1] + 105} y={34} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>Catalytic cracking</text>
    {cols.map((x, c) => <g key={x}>
      <MethodRow x={x} y={rows[0]} icon={cloud(x, rows[0])} text={['vaporise']} />
      <MethodRow x={x} y={rows[1]} highlight icon={c === 0
        ? <g><Wisp x={x + 20} y={rows[1] + 42} /><Wisp x={x + 34} y={rows[1] + 44} /><Wisp x={x + 48} y={rows[1] + 42} /></g>
        : <g>{[[18, 34], [30, 38], [42, 33], [24, 22], [38, 20], [50, 26]].map(([dx, dy], i) => <Speck key={i} x={x + dx} y={rows[1] + dy} />)}</g>}
        text={c === 0 ? ['mix with steam'] : ['pass over', 'a catalyst']} />
      <MethodRow x={x} y={rows[2]} icon={flame(x, rows[2])} text={c === 0 ? ['heat: very high', 'temperature'] : ['heat: hot', 'catalyst']} />
      <Arrow from={[x + 105, rows[0] + 54]} to={[x + 105, rows[1] - 6]} width={2} colour={muted} />
      <Arrow from={[x + 105, rows[1] + 58]} to={[x + 105, rows[2] - 2]} width={2} colour={muted} />
    </g>)}
    <Caption y={328} text="Same start and heat; the difference is what is added" />
  </Diagram>
}

// ---------- Section 3: bromine water test ----------
function Tube({ x, fill, line = glassLine, top = 64, h = 124, level = 60, children }: { x: number; fill: string; line?: string; top?: number; h?: number; level?: number; children?: ReactNode }) {
  const w = 34, b = top + h, lv = b - level - w / 2
  return <g>
    <path d={`M${x - w / 2} ${lv}V${b - w / 2}a${w / 2} ${w / 2} 0 0 0 ${w} 0V${lv}Z`} fill={fill} stroke={line} strokeWidth="1.4" />
    <path d={`M${x - w / 2 - 3} ${top}H${x - w / 2}V${b - w / 2}a${w / 2} ${w / 2} 0 0 0 ${w} 0V${top}H${x + w / 2 + 3}`} fill="none" stroke={glassLine} strokeWidth="2.2" />
    <path d={`M${x - 9} ${top + 12}V${b - 24}`} stroke="white" strokeWidth="3" opacity=".7" />
    {children}
  </g>
}
function BrSetup() {
  return <Diagram title="The bromine water test set-up: a small amount of hydrocarbon is added to orange bromine water and shaken.">
    <Tube x={110} fill={hydro} line={hydroLine} level={46} />
    <text x={110} y={218} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>hydrocarbon</text>
    <Arrow from={[146, 120]} to={[262, 120]} width={2.6} />
    <text x={204} y={104} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>add and shake</text>
    <Tube x={330} fill={bromine} line={bromineLine} level={64}>
      <path d="M292 88q-8 8 0 16M368 88q8 8 0 16M286 80q-12 16 0 32M374 80q12 16 0 32" stroke={muted} strokeWidth="1.8" fill="none" />
    </Tube>
    <text x={330} y={218} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>bromine water</text>
    <Lines x={396} y={160} lines={['orange']} colour={bromineLine} />
    <Leader from={[392, 156]} to={[340, 160]} colour={bromineLine} />
    <Caption y={262} text="Done by, or with, a teacher" />
  </Diagram>
}
function BrResult({ focus }: { focus: string }) {
  const alkeneOn = focus === 'crack-br-alkene'
  const group = (x: number, name: string, after: string, afterLine: string, result: string[], colour: string, active: boolean, showResult: boolean) => <g opacity={active ? 1 : .45}>
    <text x={x + 60} y={36} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{name}</text>
    <Tube x={x} fill={bromine} line={bromineLine} top={56} h={112} level={56} />
    <text x={x} y={192} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>before</text>
    <Arrow from={[x + 26, 110]} to={[x + 94, 110]} width={2.2} colour={muted} />
    <text x={x + 60} y={98} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>shake</text>
    {showResult ? <Tube x={x + 120} fill={after} line={afterLine} top={56} h={112} level={56} />
      : <Tube x={x + 120} fill="none" line="none" top={56} h={112} level={56}><text x={x + 120} y={140} textAnchor="middle" fontSize="20" fontWeight="700" fill={muted}>?</text></Tube>}
    <text x={x + 120} y={192} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>after</text>
    {showResult && <Lines x={x + 60} y={222} anchor="middle" lines={result} colour={colour} />}
  </g>
  return <Diagram title={alkeneOn ? 'Bromine water shaken with an alkane stays orange. Bromine water shaken with an alkene turns colourless.' : 'Bromine water shaken with an alkane: no reaction, it stays orange.'}>
    {group(56, '+ alkane', bromine, bromineLine, ['no reaction:', 'stays orange'], bromineLine, !alkeneOn, true)}
    <path d="M270 30V250" stroke={panelLine} strokeWidth="1.5" strokeDasharray="4 5" />
    {group(344, '+ alkene', '#f7fbfd', glassLine, ['bromine reacts:', 'goes colourless'], good, alkeneOn, alkeneOn)}
    <Caption y={284} text={alkeneOn ? 'Only an alkene turns bromine water colourless' : 'An alkane leaves bromine water orange'} />
  </Diagram>
}
function TubesQuestion({ assessment }: { assessment: boolean }) {
  const tubes: [number, boolean][] = [[150, true], [270, false], [390, true]]
  return <Diagram viewBox="0 0 540 230" title={assessment ? 'Three numbered test tubes; two contain an orange liquid and one is colourless.' : 'Three numbered test tubes after shaking with bromine water. Tubes 1 and 3 are still orange, so they held alkanes. Tube 2 is colourless, so it held an alkene.'}>
    {tubes.map(([x, orange], i) => <g key={x}>
      <Tube x={x} fill={orange ? bromine : '#f7fbfd'} line={orange ? bromineLine : glassLine} top={64} h={124} level={62} />
      <Pointer n={i + 1} x={x + 44} y={40} to={[x + 6, 150]} />
      {!assessment && <text x={x} y={214} textAnchor="middle" fontSize="14" fontWeight="700" fill={orange ? bromineLine : good}>{orange ? 'alkane' : 'alkene'}</text>}
    </g>)}
  </Diagram>
}

// ---------- Section 4: the cracking equation ----------
function Formula({ x, y, c, h, size = 30, colour = ink }: { x: number; y: number; c: number; h: number; size?: number; colour?: string }) {
  const sub = Math.round(size * .6)
  return <text x={x} y={y} textAnchor="middle" fontSize={size} fontWeight="700" fill={colour}>C<tspan fontSize={sub} dy={size * .22}>{c}</tspan><tspan dy={-size * .22}>H</tspan><tspan fontSize={sub} dy={size * .22}>{h}</tspan></text>
}
function Pill({ x, y, text, kind, on = true }: { x: number; y: number; text: string; kind: 'C' | 'H'; on?: boolean }) {
  return <g opacity={on ? 1 : .35}>
    <rect x={x - 38} y={y - 15} width={76} height={28} rx="14" fill={kind === 'C' ? cTint : hTint} stroke={kind === 'C' ? alkaneLine : hLine} strokeWidth={on ? 1.8 : 1.2} />
    <text x={x} y={y + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{text}</text>
  </g>
}
function Equation({ focus }: { focus: string }) {
  const step = ['crack-eq-setup', 'crack-eq-carbon', 'crack-eq-hydrogen', 'crack-eq-answer'].indexOf(focus)
  const cOn = step !== 2, hOn = step !== 1
  const boxC = step >= 1 ? '2 C' : '? C', boxH = step >= 2 ? '4 H' : '? H'
  const title = [
    'Decane, C10H22, cracks into octane, C8H18, and a missing product. Left: 10 carbon and 22 hydrogen atoms. Right: 8 carbon and 18 hydrogen atoms plus the unknown.',
    'Carbon atoms: 10 − 8 = 2, so the missing product has 2 carbon atoms.',
    'Hydrogen atoms: 22 − 18 = 4, so the missing product has 2 carbon and 4 hydrogen atoms.',
    'The full equation: C10H22 → C8H18 + C2H4. Check: 8 + 2 = 10 carbons and 18 + 4 = 22 hydrogens.',
  ][step]
  return <Diagram viewBox="0 0 540 280" title={title}>
    <Formula x={96} y={70} c={10} h={22} />
    <Arrow from={[160, 60]} to={[212, 60]} width={2.6} />
    <Formula x={280} y={70} c={8} h={18} />
    <text x={354} y={70} textAnchor="middle" fontSize="30" fontWeight="700" fill={ink}>+</text>
    {step < 3
      ? <g><rect x={392} y={28} width={120} height={56} rx="14" fill="white" stroke={muted} strokeWidth="2" strokeDasharray="7 6" />
        <text x={452} y={63} textAnchor="middle" fontSize={step ? 18 : 24} fontWeight="700" fill={step ? good : muted}>{step === 0 ? '?' : step === 1 ? '2 C' : '2 C, 4 H'}</text></g>
      : <g><rect x={392} y={28} width={120} height={56} rx="14" fill="#e3f2e8" stroke={good} strokeWidth="2" /><Formula x={452} y={70} c={2} h={4} colour={good} /></g>}
    <Pill x={96} y={120} text="10 C" kind="C" on={cOn} /><Pill x={96} y={156} text="22 H" kind="H" on={hOn} />
    <Pill x={280} y={120} text="8 C" kind="C" on={cOn} /><Pill x={280} y={156} text="18 H" kind="H" on={hOn} />
    <Pill x={452} y={120} text={boxC} kind="C" on={cOn} /><Pill x={452} y={156} text={boxH} kind="H" on={hOn} />
    <path d="M30 190H510" stroke={panelLine} strokeWidth="1.4" />
    {step === 0 && <Lines x={270} y={226} anchor="middle" lines={['Same number of C and H atoms on each side']} size={15} />}
    {step === 1 && <text x={270} y={230} textAnchor="middle" fontSize="22" fontWeight="700" fill={alkaneLine}>carbon: 10 − 8 = 2</text>}
    {step === 2 && <text x={270} y={230} textAnchor="middle" fontSize="22" fontWeight="700" fill={hLine}>hydrogen: 22 − 18 = 4</text>}
    {step === 3 && <g>
      <text x={150} y={230} textAnchor="middle" fontSize="18" fontWeight="700" fill={alkaneLine}>8 + 2 = 10 C</text>
      <text x={390} y={230} textAnchor="middle" fontSize="18" fontWeight="700" fill={hLine}>18 + 4 = 22 H</text>
      <path d="M216 222l6 7l12 -14M462 222l6 7l12 -14" stroke={good} strokeWidth="3" fill="none" />
    </g>}
    <Caption y={268} text={['Find the missing product', 'Subtract the carbons', 'Subtract the hydrogens', 'Both sides balance'][step]} />
  </Diagram>
}

export function CrackingVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus === 'crack-demand') return <Demand />
  if (focus === 'crack-split') return <Split labels={false} />
  if (focus === 'crack-products') return <Split labels />
  if (focus === 'crack-alkene-uses') return <AlkeneUses />
  if (focus === 'crack-thermal') return <Thermal />
  if (focus === 'crack-steam') return <Steam />
  if (focus === 'crack-catalytic') return <Catalytic />
  if (focus === 'crack-methods') return <Methods />
  if (focus === 'crack-br-setup') return <BrSetup />
  if (focus === 'crack-br-alkane' || focus === 'crack-br-alkene') return <BrResult focus={focus} />
  if (focus.startsWith('crack-eq-')) return <Equation focus={focus} />
  if (focus === 'crack-q-tubes') return <TubesQuestion assessment={assessment} />
  return <Split labels />
}
