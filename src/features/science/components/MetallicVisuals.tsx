import { useId, type ReactNode } from 'react'
import { Arrow } from './InfectionVisuals'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry Lesson 16: metallic bonding and alloys. Original, code-native schematics; not to scale.
 * Focus ids start with 'metal-'.
 *
 * One small square of metal (4 × 4 sites) is reused for bonding: first as atoms (core + one outer electron on a shell),
 * then as positive ions (coral with "+", the Chemistry positive-ion colour) in a sea of delocalised electrons (small
 * electron-blue dots). Each site gives up one electron, so the drawing always has 16 ions and 16 electrons.
 * Layers (side view) are plain coral circles, one per metal atom; alloy atoms of another element are larger amber circles.
 * Amber also marks thermal energy. Metal objects (pan, bars) use the soft grey from PeriodicVisuals.
 */
const { ink, muted, protonFill, protonLine, electronFill, electronLine, shellLine, space, spaceLine, glow, panelFill, panelLine } = atomPalette
const faded = 0.3
const amberFill = '#fff4e6', amberLine = '#d9a55b', amberInk = '#8a5a14'
const greyFill = '#eef1f3', greyLine = '#7f8c97'
const r1 = (n: number) => Math.round(n * 10) / 10

type Mode = 'on' | 'active' | 'off'

function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Num({ n, x, y, mode, colour = ink }: { n: number; x: number; y: number; mode: Mode; colour?: string }) {
  const active = mode === 'active'
  return <g>
    <circle cx={x} cy={y} r="12" fill={active ? colour : 'white'} stroke={active ? colour : ink} strokeWidth="2" />
    <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={active ? 'white' : ink}>{n}</text>
  </g>
}
function KeyRow({ n, x, y, lines, mode, colour = ink }: { n: number; x: number; y: number; lines: string[]; mode: Mode; colour?: string }) {
  const active = mode === 'active'
  return <g opacity={mode === 'off' ? .42 : 1}>
    <Num n={n} x={x} y={y} mode={mode === 'off' ? 'on' : mode} colour={colour} />
    <text x={x + 22} y={y + 5 - (lines.length - 1) * 8} fontSize="14" fontWeight={active ? 700 : 600} fill={active ? colour : ink}>{lines.map((l, j) => <tspan key={j} x={x + 22} dy={j ? 16 : 0}>{l}</tspan>)}</text>
  </g>
}
function Pointer({ n, x, y, to }: { n: number; x: number; y: number; to: [number, number] }) {
  const angle = Math.atan2(to[1] - y, to[0] - x)
  return <g><path d={`M${r1(x + Math.cos(angle) * 13)} ${r1(y + Math.sin(angle) * 13)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
    <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}
type NoteKind = 'b' | 'n' | 'm' | 'r' | 'blue' | 'amber'
function Notes({ x, y, lines, anchor = 'start' }: { x: number; y: number; lines: Array<[string, NoteKind]>; anchor?: 'start' | 'middle' }) {
  const fill = { b: ink, n: ink, m: muted, r: protonLine, blue: electronLine, amber: amberInk }
  let dy = 0
  return <g fontSize="14">{lines.map(([text, kind], i) => {
    const gap = text === '' ? 10 : 18
    const el = text === '' ? null : <text key={i} x={x} y={y + dy} textAnchor={anchor} fontWeight={kind === 'n' || kind === 'm' ? 400 : 700} fontSize={kind === 'm' ? 13 : 14} fill={fill[kind]}>{text}</text>
    dy += gap
    return el
  })}</g>
}

// ---------- Particles ----------
function Ion({ x, y, r = 16, sign = true }: { x: number; y: number; r?: number; sign?: boolean }) {
  return <g><circle cx={r1(x)} cy={r1(y)} r={r} fill={protonFill} stroke={protonLine} strokeWidth="1.5" />{sign && <text x={r1(x)} y={r1(y + 5)} textAnchor="middle" fontSize="14" fontWeight="700" fill="white">+</text>}</g>
}
function Free({ x, y, r = 6 }: { x: number; y: number; r?: number }) {
  return <circle cx={r1(x)} cy={r1(y)} r={r} fill={electronFill} stroke={electronLine} strokeWidth="1.5" />
}
/** A dashed "pull" line from an electron to an ion, stopping short of both. */
function Pull({ from, to }: { from: [number, number]; to: [number, number] }) {
  const dx = to[0] - from[0], dy = to[1] - from[1], d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d
  return <path d={`M${r1(from[0] + ux * 8)} ${r1(from[1] + uy * 8)}L${r1(to[0] - ux * 18)} ${r1(to[1] - uy * 18)}`} stroke={ink} strokeWidth="2" strokeDasharray="3 4" />
}

// ---------- Sections 1, 2 and 4: a small square of metal (16 sites, 16 delocalised electrons) ----------
const STEP = 58, SX = 62, SY = 74
const SITES = Array.from({ length: 16 }, (_, i) => [SX + (i % 4) * STEP, SY + Math.floor(i / 4) * STEP] as [number, number])
const DELOC: Array<[number, number]> = [
  [91, 103], [149, 103], [207, 103], [91, 161], [149, 161], [207, 161], [91, 219], [149, 219], [207, 219],
  [91, 45], [207, 45], [33, 132], [33, 219], [265, 103], [265, 190], [149, 277],
]
const around = (e: [number, number]) => SITES.filter(s => Math.abs(s[0] - e[0]) < 40 && Math.abs(s[1] - e[1]) < 40)

type LatticeStage = 'atoms' | 'free' | 'ions' | 'bond' | 'whole' | 'strong' | 'plain'
/** The square of metal; drawn at (0,0)–(290,300) and moved with `dx`. */
function Lattice({ stage, dx = 0 }: { stage: LatticeStage; dx?: number }) {
  const atoms = stage === 'atoms'
  const ionOpacity = stage === 'free' ? .4 : 1
  const eOpacity = stage === 'ions' ? .35 : 1
  const pulls = stage === 'bond' ? [4] : stage === 'whole' ? [0, 4, 8] : stage === 'strong' ? [0, 2, 4, 6, 8] : []
  return <g transform={dx ? `translate(${dx} 0)` : undefined}>
    <rect x={22} y={34} width={254} height={254} rx="14" fill={space} stroke={spaceLine} strokeWidth="1.5" />
    {atoms ? SITES.map(([x, y], i) => <g key={i}>
      <circle cx={x} cy={y} r={26} fill="white" stroke={spaceLine} strokeWidth="1.5" />
      <circle cx={x} cy={y} r={20} fill="none" stroke={shellLine} strokeWidth="1.8" />
      <Ion x={x} y={y} r={12} sign={false} />
      <Free x={x + 14.1} y={y - 14.1} r={5} />
    </g>) : <>
      {stage === 'free' && SITES.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={20} fill="none" stroke={shellLine} strokeWidth="1.5" strokeDasharray="4 4" opacity={.7} />)}
      <g opacity={ionOpacity}>{SITES.map(([x, y], i) => <Ion key={i} x={x} y={y} />)}</g>
      <g opacity={eOpacity}>{DELOC.map(([x, y], i) => <Free key={i} x={x} y={y} />)}</g>
      {stage === 'free' && <g>
        <Arrow x1={100} y1={103} x2={136} y2={103} colour={electronLine} width={2} />
        <Arrow x1={207} y1={170} x2={207} y2={204} colour={electronLine} width={2} />
        <Arrow x1={149} y1={228} x2={149} y2={264} colour={electronLine} width={2} />
        <Arrow x1={200} y1={45} x2={166} y2={45} colour={electronLine} width={2} />
      </g>}
      {pulls.map(k => around(DELOC[k]).map((s, j) => <Pull key={`${k}-${j}`} from={DELOC[k]} to={s} />))}
    </>}
  </g>
}
const LATTICE_KEY: Array<{ lines: string[]; colour: string }> = [
  { lines: ['metal atoms in a', 'regular pattern'], colour: ink },
  { lines: ['outer electrons', 'move freely:', 'delocalised'], colour: electronLine },
  { lines: ['positive metal ions', 'left behind'], colour: protonLine },
  { lines: ['ions and electrons', 'attract: a', 'metallic bond'], colour: ink },
]
const BOND_STEP: Record<string, number> = { 'metal-bond-atoms': 1, 'metal-bond-free': 2, 'metal-bond-ions': 3, 'metal-bond-bond': 4, 'metal-bond-whole': 5 }
const BOND_TITLES = [
  '',
  'Step 1: a small part of a metal. Sixteen metal atoms are packed in neat rows and columns, a regular pattern. Each atom is drawn with one electron on its outer shell.',
  'Step 2: the outer electrons have left their atoms and are spread between them. Small arrows show they are free to move through the whole structure: they are delocalised electrons.',
  'Step 3: the atoms that lost an electron are highlighted. Each is now a positive metal ion, marked with a plus sign, still in its regular row.',
  'Step 4: dashed lines join one delocalised electron to the four positive ions around it. Opposite charges attract: this strong attraction between metal ions and delocalised electrons is a metallic bond.',
  'The whole picture: a giant structure of positive metal ions in a regular pattern, with delocalised electrons shared through it. Dashed lines from three electrons show the attraction to the ions around them: the metallic bond.',
]
function BondWalk({ focus }: { focus: string }) {
  const step = BOND_STEP[focus] ?? 5
  const stage: LatticeStage = (['atoms', 'atoms', 'free', 'ions', 'bond', 'whole'] as const)[step]
  const mode = (n: number): Mode => step === 5 ? 'on' : n === step ? 'active' : n < step ? 'on' : 'off'
  return <Diagram title={BOND_TITLES[step]}>
    <text x={22} y={22} fontSize="13" fontWeight="700" fill={muted}>a tiny part of a metal, seen from above</text>
    <Lattice stage={stage} />
    {LATTICE_KEY.map((k, i) => <KeyRow key={i} n={i + 1} x={316} y={62 + i * 66} lines={k.lines} mode={mode(i + 1)} colour={k.colour} />)}
  </Diagram>
}
function Strong() {
  return <Diagram title="The square of metal again: positive metal ions in a regular pattern with delocalised electrons between them. Dashed lines from several electrons to the ions around them show that metallic bonds pull in every direction. Melting the metal means breaking many strong bonds, so a lot of energy is needed.">
    <text x={22} y={22} fontSize="13" fontWeight="700" fill={muted}>a tiny part of a metal</text>
    <Lattice stage="strong" />
    <Notes x={306} y={70} lines={[['Metallic bonds pull', 'b'], ['in every direction.', 'b'], ['', 'n'], ['To melt the metal,', 'n'], ['many strong bonds', 'n'], ['must break.', 'n'], ['', 'n'], ['So a lot of energy', 'r'], ['is needed: a high', 'r'], ['melting point.', 'r']]} />
  </Diagram>
}
function MetalQuestion({ assessment }: { assessment: boolean }) {
  const dx = 120
  return <Diagram title={assessment
    ? 'A diagram of the particles in a small part of a metal: large circles with plus signs in neat rows, and small dots between them. Pointer 1 points to one of the large circles; pointer 2 points to one of the small dots.'
    : 'The particles in a small part of a metal. Pointer 1: a positive metal ion, fixed in a regular pattern. Pointer 2: a delocalised electron, free to move through the metal.'}>
    <Lattice stage="plain" dx={dx} />
    <Pointer n={1} x={80} y={74} to={[SX + dx - 9, 74]} />
    <Pointer n={2} x={470} y={161} to={[207 + dx + 2, 161]} />
    {!assessment && <g>
      <Notes x={80} y={112} anchor="middle" lines={[['positive', 'r'], ['metal ion', 'r']]} />
      <Notes x={470} y={199} anchor="middle" lines={[['delocalised', 'blue'], ['electron', 'blue']]} />
    </g>}
  </Diagram>
}

// ---------- Section 2: conducting electricity and heat ----------
const BAR = { x: 70, y: 70, w: 400, h: 120 }
const BAR_IONS = Array.from({ length: 16 }, (_, i) => [BAR.x + 32 + (i % 8) * 48, BAR.y + 32 + Math.floor(i / 8) * 56] as [number, number])
// 16 electrons: 7 in the middle channel, 4 along the top, 5 along the bottom.
const between = (i: number) => BAR.x + 56 + i * 48
const BAR_E: Array<[number, number]> = [
  ...[0, 1, 2, 3, 4, 5, 6].map(i => [between(i), BAR.y + 60] as [number, number]),
  ...[0, 2, 4, 6].map(i => [between(i), BAR.y + 10] as [number, number]),
  ...[0, 1, 3, 5, 6].map(i => [between(i), BAR.y + 110] as [number, number]),
]
function MetalBar({ tint }: { tint?: string }) {
  return <g>
    <rect x={BAR.x} y={BAR.y} width={BAR.w} height={BAR.h} rx="14" fill={tint ?? space} stroke={greyLine} strokeWidth="2" />
    {BAR_IONS.map(([x, y], i) => <Ion key={i} x={x} y={y} r={15} />)}
    {BAR_E.map(([x, y], i) => <Free key={i} x={x} y={y} />)}
  </g>
}
function Conduct() {
  const drift = [0, 2, 4, 6, 8, 10, 12, 14]
  return <Diagram title="A piece of metal wire connected to a cell. The metal holds positive ions in fixed rows and delocalised electrons between them. Arrows show the delocalised electrons drifting through the wire towards the positive terminal of the cell, carrying charge. The ions stay in place.">
    <text x={BAR.x} y={56} fontSize="14" fontWeight="700" fill={ink}>a piece of metal wire</text>
    <path d={`M${BAR.x} ${BAR.y + 60}H32V264H258M280 264H508V${BAR.y + 60}H${BAR.x + BAR.w}`} fill="none" stroke={ink} strokeWidth="2.5" />
    <path d="M262 252V276" stroke={ink} strokeWidth="6" />
    <path d="M278 242V286" stroke={ink} strokeWidth="2.5" />
    <text x={250} y={252} textAnchor="end" fontSize="16" fontWeight="700" fill={ink}>−</text>
    <text x={288} y={248} fontSize="16" fontWeight="700" fill={ink}>+</text>
    <text x={300} y={284} fontSize="13" fontWeight="700" fill={muted}>cell</text>
    <MetalBar />
    {drift.map(k => { const [x, y] = BAR_E[k]; return <Arrow key={k} x1={x + 8} y1={y} x2={x + 30} y2={y} colour={electronLine} width={2} /> })}
    <Notes x={270} y={214} anchor="middle" lines={[['delocalised electrons drift towards +', 'blue'], ['carrying charge; the ions stay in place', 'r']]} />
  </Diagram>
}
function Heat() {
  const id = useId().replace(/:/g, '')
  const drift = [0, 2, 4, 6, 7, 9, 11, 13]
  return <Diagram title="A metal bar heated at its left end by a flame. The left end is shaded warm. Arrows show delocalised electrons moving along the bar, passing thermal energy from the hot end towards the cold end.">
    <defs><linearGradient id={`warm${id}`} x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor={amberFill} /><stop offset=".08" stopColor="#ffe2b8" /><stop offset=".6" stopColor={amberFill} /><stop offset="1" stopColor={space} /></linearGradient></defs>
    <text x={BAR.x} y={56} fontSize="14" fontWeight="700" fill={ink}>a metal bar, heated at one end</text>
    <MetalBar tint={`url(#warm${id})`} />
    {drift.map(k => { const [x, y] = BAR_E[k]; return <Arrow key={k} x1={x + 8} y1={y} x2={x + 30} y2={y} colour={amberLine} width={2.5} /> })}
    <path d="M108 252C88 230 100 214 110 198C114 214 128 218 124 202C140 216 142 238 128 252Z" fill="#ffd27a" stroke={amberLine} strokeWidth="2" />
    <path d="M114 250C106 238 112 228 116 220C120 230 126 234 124 250Z" fill="#fff4e6" stroke={amberLine} strokeWidth="1.5" />
    <text x={116} y={276} textAnchor="middle" fontSize="14" fontWeight="700" fill={amberInk}>hot end</text>
    <text x={430} y={222} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>cold end,</text>
    <text x={430} y={240} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>soon warm</text>
    <Arrow x1={200} y1={230} x2={330} y2={230} colour={amberLine} width={3} />
    <text x={265} y={258} textAnchor="middle" fontSize="14" fontWeight="700" fill={amberInk}>thermal energy carried</text>
    <text x={265} y={276} textAnchor="middle" fontSize="14" fontWeight="700" fill={amberInk}>by delocalised electrons</text>
  </Diagram>
}
function Uses() {
  return <Diagram title="Two everyday uses. Left: a copper wire inside plastic covering, carrying electric charge. Right: a metal saucepan on a hob, carrying heat from the hob to the food. Both work because delocalised electrons move through the metal.">
    <rect x={14} y={20} width={250} height={220} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <rect x={276} y={20} width={250} height={220} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={139} y={48} textAnchor="middle" fontSize="15" fontWeight="700" fill={electronLine}>electricity</text>
    <text x={401} y={48} textAnchor="middle" fontSize="15" fontWeight="700" fill={amberInk}>heat</text>
    {/* cable: plastic covering with the copper core showing at the end */}
    <rect x={36} y={104} width={140} height={34} rx="17" fill="#dfe8ef" stroke={greyLine} strokeWidth="2" />
    <rect x={170} y={112} width={64} height={18} rx="9" fill={amberFill} stroke={amberLine} strokeWidth="2" />
    <path d="M180 117H226M180 125H226" stroke={amberLine} strokeWidth="1.5" />
    <Notes x={139} y={176} anchor="middle" lines={[['copper wire:', 'b'], ['carries charge', 'blue']]} />
    {/* saucepan on a hob */}
    <path d="M330 110H470L462 176H338Z" fill={greyFill} stroke={greyLine} strokeWidth="2" />
    <path d="M470 118H514" stroke={greyLine} strokeWidth="8" />
    <rect x={320} y={184} width={160} height={10} rx="4" fill={glow} stroke={protonLine} strokeWidth="1.5" />
    <Arrow x1={372} y1={176} x2={372} y2={134} colour={amberLine} width={2.5} />
    <Arrow x1={428} y1={176} x2={428} y2={134} colour={amberLine} width={2.5} />
    <Notes x={401} y={214} anchor="middle" lines={[['pan: carries heat to the food', 'amber']]} />
    <text x={270} y={272} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>Both use delocalised electrons that move through the metal.</text>
  </Diagram>
}

// ---------- Section 3: melting points ----------
function Bars({ rows, max, ticks, axis, x0 = 150, width = 340, y0 = 44, fill, line, marker }: { rows: Array<[string, number]>; max: number; ticks: number[]; axis: string; x0?: number; width?: number; y0?: number; fill: string; line: string; marker?: [number, string] }) {
  const sx = (v: number) => r1(x0 + v / max * width), bottom = y0 + rows.length * 52
  return <g>
    {ticks.map(t => <g key={t}><path d={`M${sx(t)} ${y0 - 6}V${bottom}`} stroke={panelLine} strokeWidth="1" /><text x={sx(t)} y={bottom + 20} textAnchor="middle" fontSize="12" fill={ink}>{t}</text></g>)}
    <path d={`M${x0} ${y0 - 6}V${bottom}H${x0 + width}`} fill="none" stroke={ink} strokeWidth="1.8" />
    {rows.map(([label, v], i) => { const y = y0 + i * 52 + 8; return <g key={label}>
      <text x={x0 - 10} y={y + 23} textAnchor="end" fontSize="14" fontWeight="700" fill={ink}>{label}</text>
      <rect x={x0} y={y} width={sx(v) - x0} height={34} rx="4" fill={fill} stroke={line} strokeWidth="1.8" />
      <text x={sx(v) + 8} y={y + 23} fontSize="14" fontWeight="700" fill={ink}>{v}</text>
    </g> })}
    {marker && <g><path d={`M${sx(marker[0])} ${y0 - 14}V${bottom}`} stroke={electronLine} strokeWidth="2" strokeDasharray="5 4" /><text x={sx(marker[0]) + 6} y={y0 - 16} fontSize="13" fontWeight="700" fill={electronLine}>{marker[1]}</text></g>}
    <text x={x0 + width / 2} y={bottom + 42} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{axis}</text>
  </g>
}
function Melting() {
  return <Diagram schematic={false} title="A bar chart of melting points: iron 1538 °C, copper 1085 °C, aluminium 660 °C. A dashed line marks room temperature, about 25 °C, far below all three. So all three metals are solid at room temperature.">
    <Bars rows={[['iron', 1538], ['copper', 1085], ['aluminium', 660]]} max={1600} ticks={[0, 400, 800, 1200, 1600]} axis="melting point (°C)" y0={52} fill={greyFill} line={greyLine} marker={[25, 'room temperature, about 25 °C']} />
    <text x={270} y={290} textAnchor="middle" fontSize="13" fill={muted}>All three melt far above room temperature, so all are solid.</text>
  </Diagram>
}

// ---------- Sections 3 and 4: layers seen from the side ----------
const LS = 38
type Push = 'none' | 'arrow' | 'slide' | 'blocked'
/** Three layers of atoms. `big` lists [row, col] positions taken by larger atoms of another element (an alloy). */
function Layers({ x0, y0, cols, big = [], push = 'none', guides = false }: { x0: number; y0: number; cols: number; big?: Array<[number, number]>; push?: Push; guides?: boolean }) {
  const pos = (r: number, c: number): [number, number] => {
    let x = x0 + c * LS, y = y0 + r * LS
    if (push === 'slide' && r === 0) x += LS
    // Atoms in the layer above or below a larger atom are pushed out of line: straight above/below by 7, diagonally by 3.
    for (const [br, bc] of big) if (Math.abs(r - br) === 1 && Math.abs(c - bc) <= 1) y += Math.sign(r - br) * (c === bc ? 7 : 3)
    return [r1(x), r1(y)]
  }
  const isBig = (r: number, c: number) => big.some(([br, bc]) => br === r && bc === c)
  const rows = [0, 1, 2].map(r => Array.from({ length: cols }, (_, c) => ({ r, c, big: isBig(r, c), xy: isBig(r, c) ? [x0 + c * LS, y0 + r * LS] as [number, number] : pos(r, c) })))
  const arrowY = y0
  return <g>
    {rows.flat().filter(a => !a.big).map(a => <Ion key={`${a.r}-${a.c}`} x={a.xy[0]} y={a.xy[1]} r={16} sign={false} />)}
    {rows.flat().filter(a => a.big).map(a => <circle key={`b${a.r}-${a.c}`} cx={a.xy[0]} cy={a.xy[1]} r={21} fill={amberFill} stroke={amberLine} strokeWidth="2" />)}
    {guides && rows.map((row, r) => <path key={`g${r}`} d={`M${row.map(a => `${a.xy[0]} ${a.xy[1]}`).join('L')}`} fill="none" stroke={ink} strokeWidth="1.6" strokeDasharray="5 4" />)}
    {push !== 'none' && <Arrow x1={x0 - 66} y1={arrowY} x2={x0 - (push === 'blocked' ? 32 : 24)} y2={arrowY} colour={protonLine} width={3} />}
    {push === 'blocked' && <path d={`M${x0 - 26} ${arrowY - 14}V${arrowY + 14}`} stroke={protonLine} strokeWidth="4" />}
  </g>
}
const ALLOY_BIG: Array<[number, number]> = [[1, 1], [0, 4], [2, 5]]
function LayerFrame({ kind }: { kind: 'layers' | 'slide' | 'pure' | 'mix' | 'distort' | 'hard' }) {
  const alloy = kind === 'mix' || kind === 'distort' || kind === 'hard'
  const push: Push = kind === 'slide' ? 'slide' : kind === 'pure' ? 'arrow' : kind === 'hard' ? 'blocked' : 'none'
  const titles = {
    layers: 'A side view of a pure metal: three flat layers of atoms, all the same size, stacked neatly on top of each other.',
    slide: 'The same pure metal after a push from the left: the whole top layer has slid one place to the right over the layer below, so the metal has changed shape.',
    pure: 'A pure metal seen from the side: three neat, flat layers of atoms of the same size. An arrow pushes the top layer, which can slide easily, so the metal is soft.',
    mix: 'An alloy seen from the side: the same layers of metal atoms, with three larger atoms of another element mixed in.',
    distort: 'The alloy with dashed lines drawn through each layer. Around the larger atoms the lines bend up and down: the layers are distorted, no longer flat.',
    hard: 'The alloy being pushed from the left. A bar at the arrow tip shows the distorted layers catch on each other and cannot slide easily, so the alloy is harder.',
  }
  const notes: Record<typeof kind, Array<[string, NoteKind]>> = {
    layers: [['Pure metal:', 'b'], ['every atom the', 'n'], ['same size', 'n'], ['', 'n'], ['They pack in', 'n'], ['flat, neat layers.', 'r']],
    slide: [['Push:', 'b'], ['the top layer', 'n'], ['slides over the', 'n'], ['one below', 'n'], ['', 'n'], ['The metal bends', 'r'], ['into a new shape.', 'r']],
    pure: [['Pure metal:', 'b'], ['neat layers', 'n'], ['slide easily', 'n'], ['', 'n'], ['so it is soft', 'r']],
    mix: [['Alloy:', 'b'], ['a metal mixed', 'n'], ['with another', 'n'], ['element', 'n']],
    distort: [['Different-sized', 'b'], ['atoms push the', 'b'], ['layers out of line.', 'b'], ['', 'n'], ['The layers are', 'n'], ['distorted.', 'r']],
    hard: [['Distorted layers', 'b'], ['catch on each', 'b'], ['other, so they', 'b'], ['cannot slide', 'b'], ['easily.', 'b'], ['', 'n'], ['So the alloy', 'r'], ['is harder.', 'r']],
  }
  const x0 = 92, y0 = 108
  return <Diagram title={titles[kind]}>
    <text x={22} y={30} fontSize="13" fontWeight="700" fill={muted}>{alloy ? 'an alloy, seen from the side' : 'a pure metal, seen from the side'}</text>
    <rect x={22} y={52} width={362} height={170} rx="14" fill={space} stroke={spaceLine} strokeWidth="1.5" />
    <Layers x0={x0} y0={y0} cols={7} big={alloy ? ALLOY_BIG : []} push={push} guides={kind === 'distort'} />
    <Notes x={396} y={82} lines={notes[kind]} />
    {kind === 'mix' && <g fontSize="14" fontWeight="700">
      <circle cx={400} cy={170} r="8" fill={protonFill} stroke={protonLine} strokeWidth="1.5" /><text x={414} y={175} fill={protonLine}>metal atom</text>
      <circle cx={400} cy={196} r="10" fill={amberFill} stroke={amberLine} strokeWidth="2" /><text x={414} y={201} fill={amberInk}>atom of the</text><text x={414} y={219} fill={amberInk}>other element</text>
    </g>}
    <text x={22} y={252} fontSize="13" fill={muted}>Each circle is one atom. The delocalised electrons are not shown.</text>
  </Diagram>
}
function AlloyCompare() {
  return <Diagram title="Side by side. Left, a pure metal: its top layer has slid across after a push, so it is soft. Right, an alloy with a larger atom distorting the layers: the push is blocked, so the alloy is harder.">
    <rect x={14} y={20} width={252} height={200} rx="12" fill={space} stroke={spaceLine} strokeWidth="1.5" />
    <rect x={274} y={20} width={252} height={200} rx="12" fill={space} stroke={spaceLine} strokeWidth="1.5" />
    <text x={140} y={46} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>pure metal</text>
    <text x={400} y={46} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>alloy</text>
    <Layers x0={86} y0={92} cols={4} push="slide" />
    <Layers x0={356} y0={92} cols={4} big={[[1, 1]]} push="blocked" guides />
    <Notes x={140} y={250} anchor="middle" lines={[['layers slide easily', 'n'], ['→ soft', 'r']]} />
    <Notes x={400} y={250} anchor="middle" lines={[['layers distorted, stuck', 'n'], ['→ harder, more useful', 'r']]} />
  </Diagram>
}

// ---------- On your own: invented dent-test results ----------
function DentData() {
  return <Diagram schematic={false} title="A bar chart of invented results from one test: the force needed to make a dent in three samples. Pure copper 50 newtons, brass (an alloy) 120 newtons, bronze (an alloy) 140 newtons.">
    <Bars rows={[['pure copper', 50], ['brass (alloy)', 120], ['bronze (alloy)', 140]]} max={160} ticks={[0, 40, 80, 120, 160]} axis="force needed to make a dent (N)" y0={40} fill={glow} line={protonLine} />
    <text x={270} y={290} textAnchor="middle" fontSize="13" fill={muted}>Invented results from one test on one sample of each.</text>
  </Diagram>
}

export function MetallicVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'metal-bond-atoms': case 'metal-bond-free': case 'metal-bond-ions': case 'metal-bond-bond': case 'metal-bond-whole': return <BondWalk focus={focus} />
    case 'metal-conduct-charge': return <Conduct />
    case 'metal-conduct-heat': return <Heat />
    case 'metal-conduct-uses': return <Uses />
    case 'metal-shape-strong': return <Strong />
    case 'metal-shape-melt': return <Melting />
    case 'metal-shape-layers': return <LayerFrame kind="layers" />
    case 'metal-shape-slide': return <LayerFrame kind="slide" />
    case 'metal-alloy-pure': return <LayerFrame kind="pure" />
    case 'metal-alloy-mix': return <LayerFrame kind="mix" />
    case 'metal-alloy-distort': return <LayerFrame kind="distort" />
    case 'metal-alloy-hard': return <LayerFrame kind="hard" />
    case 'metal-alloy-compare': return <AlloyCompare />
    case 'metal-question': return <MetalQuestion assessment={assessment} />
    case 'metal-dent-data': return <DentData />
    default: return <BondWalk focus="metal-bond-whole" />
  }
}
