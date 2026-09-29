import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry Lesson 13: ionic bonding and ionic compounds. Original, code-native schematics; not to scale.
 * Focus ids start with 'ionic-'. Colours come from the Chemistry palette in AtomVisuals.tsx (plus the amber and blue
 * tints PeriodicVisuals.tsx already uses). Dot-and-cross convention for every Chemistry lesson: the first-named atom's
 * electrons are blue dots, the other atom's electrons are ink crosses; ions sit in square brackets with the charge at
 * top right. Positive ions have a pale coral wash, negative ions a pale electron-blue wash, atoms the pale "space" wash.
 * Every drawn particle is real: Na 2,8,1 → Na⁺ 2,8; Cl 2,8,7 → Cl⁻ 2,8,8; Mg loses 2 outer electrons; O gains 2;
 * Li loses 1. Lattices keep the 1 : 1 alternation of sodium chloride (9 Na⁺ and 9 Cl⁻ in the ball-and-stick model).
 */
const { ink, muted, protonFill, protonLine, electronFill, electronLine, shellLine, space, spaceLine, glow, lightIsoLine, panelFill, panelLine } = atomPalette
const blueFill = '#e4f0f9', amberFill = '#fff4e6', amberLine = '#d9a55b', amberInk = '#8a5a14', greyFill = '#eef1f3', greyLine = '#7f8c97'
const posFill = '#f7cdc8', negFill = '#cfe3f4'
const faded = 0.3
const r1 = (n: number) => Math.round(n * 10) / 10
const at = (cx: number, cy: number, r: number, deg: number): [number, number] => [r1(cx + Math.cos(deg * Math.PI / 180) * r), r1(cy + Math.sin(deg * Math.PI / 180) * r)]

function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}

// ---------- Small pieces ----------
function Dot({ x, y, r = 4.6 }: { x: number; y: number; r?: number }) {
  return <circle data-particle="electron" cx={x} cy={y} r={r} fill={electronFill} stroke={electronLine} strokeWidth="1.4" />
}
function X({ x, y, s = 4.2, colour = ink }: { x: number; y: number; s?: number; colour?: string }) {
  return <path data-particle="electron" d={`M${r1(x - s)} ${r1(y - s)}L${r1(x + s)} ${r1(y + s)}M${r1(x + s)} ${r1(y - s)}L${r1(x - s)} ${r1(y + s)}`} stroke={colour} strokeWidth="2.2" />
}
function Slot({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r={4.6} fill="white" stroke={electronLine} strokeWidth="1.3" strokeDasharray="2.5 2.5" />
}
function Head({ x, y, angle, colour = ink, size = 9 }: { x: number; y: number; angle: number; colour?: string; size?: number }) {
  const a = angle * Math.PI / 180, b = 0.45
  const p1 = [x - Math.cos(a - b) * size, y - Math.sin(a - b) * size], p2 = [x - Math.cos(a + b) * size, y - Math.sin(a + b) * size]
  return <path d={`M${r1(p1[0])} ${r1(p1[1])}L${x} ${y}L${r1(p2[0])} ${r1(p2[1])}Z`} fill={colour} stroke={colour} strokeWidth="1.5" />
}
/** A quadratic curved arrow from `from` to `to`, bending through `via`. */
function Curve({ from, via, to, colour = ink, width = 2 }: { from: [number, number]; via: [number, number]; to: [number, number]; colour?: string; width?: number }) {
  const angle = Math.atan2(to[1] - via[1], to[0] - via[0]) * 180 / Math.PI
  return <g><path d={`M${from[0]} ${from[1]}Q${via[0]} ${via[1]} ${to[0]} ${to[1]}`} fill="none" stroke={colour} strokeWidth={width} /><Head x={to[0]} y={to[1]} angle={angle} colour={colour} /></g>
}
function Line({ from, to, colour = ink, width = 2, both = false }: { from: [number, number]; to: [number, number]; colour?: string; width?: number; both?: boolean }) {
  const angle = Math.atan2(to[1] - from[1], to[0] - from[0]) * 180 / Math.PI
  return <g><path d={`M${from[0]} ${from[1]}L${to[0]} ${to[1]}`} stroke={colour} strokeWidth={width} /><Head x={to[0]} y={to[1]} angle={angle} colour={colour} />{both && <Head x={from[0]} y={from[1]} angle={angle + 180} colour={colour} />}</g>
}
function Badge({ n, x, y, active = false, colour = ink }: { n: number | string; x: number; y: number; active?: boolean; colour?: string }) {
  return <g><circle cx={x} cy={y} r={12} fill={active ? colour : 'white'} stroke={active ? colour : ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={active ? 'white' : ink}>{n}</text></g>
}
type Mode = 'on' | 'active' | 'off'
function KeyRow({ n, x, y, lines, mode }: { n: number; x: number; y: number; lines: string[]; mode: Mode }) {
  const active = mode === 'active'
  return <g opacity={mode === 'off' ? .4 : 1}>
    <Badge n={n} x={x} y={y} active={active} />
    <text x={x + 22} y={y + 5 - (lines.length - 1) * 8} fontSize="14" fontWeight={active ? 700 : 600} fill={ink}>{lines.map((l, j) => <tspan key={j} x={x + 22} dy={j ? 16 : 0}>{l}</tspan>)}</text>
  </g>
}
function Pointer({ n, x, y, to }: { n: number; x: number; y: number; to: [number, number] }) {
  const angle = Math.atan2(to[1] - y, to[0] - x)
  return <g><path d={`M${r1(x + Math.cos(angle) * 13)} ${r1(y + Math.sin(angle) * 13)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
    <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}
function Label({ x, y, lines, colour = ink }: { x: number; y: number; lines: string[]; colour?: string }) {
  return <text x={x} y={y} textAnchor="middle" fontSize="13" fill={colour}>{lines.map((l, j) => <tspan key={j} x={x} dy={j ? 16 : 0} fontWeight={j ? 400 : 700} fill={j ? muted : colour}>{l}</tspan>)}</text>
}
function Legend({ x, y, icon, text }: { x: number; y: number; icon: 'dot' | 'cross'; text: string }) {
  return <g>{icon === 'dot' ? <Dot x={x} y={y - 4} r={5} /> : <X x={x} y={y - 4} s={4.6} />}<text x={x + 14} y={y} fontSize="13" fontWeight="600" fill={ink}>{text}</text></g>
}
function Tick({ x, y, ok }: { x: number; y: number; ok: boolean }) {
  return ok
    ? <path d={`M${x - 6} ${y - 4}L${x - 1} ${y + 2}L${x + 7} ${y - 9}`} fill="none" stroke={lightIsoLine} strokeWidth="3" />
    : <path d={`M${x - 5} ${y - 9}L${x + 5} ${y + 1}M${x + 5} ${y - 9}L${x - 5} ${y + 1}`} stroke={protonLine} strokeWidth="3" />
}

// ---------- A dot-and-cross particle (atom or ion) ----------
// A shell is a radius and a row of marks spaced evenly from `start` (degrees): d = dot, x = cross, o = empty place, ' ' = nothing.
type Shell = { r: number; marks: string; start?: number; step?: number }
type Look = 'atom' | 'pos' | 'neg'
function Particle({ cx, cy, sym, shells, look, charge, strongBrackets = false, symSize }: { cx: number; cy: number; sym: string; shells: Shell[]; look: Look; charge?: string; strongBrackets?: boolean; symSize?: number }) {
  const outer = shells.length ? shells[shells.length - 1].r : 14
  const R = outer + 9
  const fill = look === 'pos' ? glow : look === 'neg' ? blueFill : space
  const line = look === 'pos' ? posFill : look === 'neg' ? '#b7d3ea' : spaceLine
  const inner = shells.length > 1
  const bx = R + 6, by = R + 3, tick = 7
  const bColour = strongBrackets ? (look === 'pos' ? protonLine : electronLine) : ink
  return <g>
    <circle cx={cx} cy={cy} r={R} fill={fill} stroke={line} strokeWidth="1.5" />
    {shells.map((s, i) => <circle key={`s${i}`} cx={cx} cy={cy} r={s.r} fill="none" stroke={shellLine} strokeWidth="1.6" />)}
    {shells.map((s, i) => s.marks.split('').map((m, j) => {
      const [x, y] = at(cx, cy, s.r, (s.start ?? 180) + j * (s.step ?? 360 / s.marks.length))
      return m === 'd' ? <Dot key={`${i}-${j}`} x={x} y={y} /> : m === 'x' ? <X key={`${i}-${j}`} x={x} y={y} /> : m === 'o' ? <Slot key={`${i}-${j}`} x={x} y={y} /> : null
    }))}
    {inner && <circle cx={cx} cy={cy} r={11.5} fill="white" stroke={shellLine} strokeWidth="1.4" />}
    <text x={cx} y={cy + (inner ? 4.5 : 5.5)} textAnchor="middle" fontSize={symSize ?? (inner ? 12 : 16)} fontWeight="700" fill={ink}>{sym}</text>
    {charge && <g>
      <path d={`M${r1(cx - bx + tick)} ${r1(cy - by)}H${r1(cx - bx)}V${r1(cy + by)}H${r1(cx - bx + tick)}M${r1(cx + bx - tick)} ${r1(cy - by)}H${r1(cx + bx)}V${r1(cy + by)}H${r1(cx + bx - tick)}`} fill="none" stroke={bColour} strokeWidth={strongBrackets ? 3 : 2.2} />
      <text x={r1(cx + bx + 3)} y={r1(cy - by + 8)} fontSize={strongBrackets ? 18 : 16} fontWeight="700" fill={look === 'pos' ? protonLine : electronLine}>{charge}</text>
    </g>}
  </g>
}

// ---------- Sections 1 and 2: sodium + chlorine → sodium chloride (full shells) ----------
const NA_X = 95, CL_X = 275, MID = 185, ROW1 = 66, ROW2 = 228
const RADII = [20, 34, 48]
const NA_ATOM: Shell[] = [{ r: RADII[0], marks: 'dd' }, { r: RADII[1], marks: 'dddddddd', start: -90 }, { r: RADII[2], marks: 'd', start: 0 }]
const NA_ION: Shell[] = [{ r: RADII[0], marks: 'dd' }, { r: RADII[1], marks: 'dddddddd', start: -90 }]
const clAtom = (slot: boolean): Shell[] => [{ r: RADII[0], marks: 'xx' }, { r: RADII[1], marks: 'xxxxxxxx', start: -90 }, { r: RADII[2], marks: slot ? 'oxxxxxxx' : ' xxxxxxx', start: 180 }]
const CL_ION: Shell[] = [{ r: RADII[0], marks: 'xx' }, { r: RADII[1], marks: 'xxxxxxxx', start: -90 }, { r: RADII[2], marks: 'dxxxxxxx', start: 180 }]

const BOND_STEP: Record<string, number> = { 'ionic-bond-atoms': 0, 'ionic-bond-transfer': 1, 'ionic-bond-ions': 2, 'ionic-bond-attract': 3, 'ionic-bond-all': 4 }
const BOND_TITLES = [
  'Step 1: a sodium atom (electrons 2,8,1, drawn as dots) and a chlorine atom (electrons 2,8,7, drawn as crosses). Neither outer shell is full.',
  'Step 2: sodium’s one outer electron moves across to the empty place in chlorine’s outer shell. This is electron transfer.',
  'Step 3: the sodium atom has become a sodium ion, Na⁺, with electrons 2,8. The chlorine atom has become a chloride ion, Cl⁻, with electrons 2,8,8. Both have full outer shells.',
  'Step 4: the positive sodium ion and the negative chloride ion attract each other strongly. This is an electrostatic force.',
  'Put together: sodium gives one electron to chlorine, the ions formed attract each other, and this attraction is an ionic bond. The ions make the ionic compound sodium chloride.',
]
function NaClScene({ focus }: { focus: string }) {
  const bond = focus.startsWith('ionic-bond-')
  const step = bond ? (BOND_STEP[focus] ?? 4) : 4
  const brackets = focus === 'ionic-dc-brackets'
  const showIons = step >= 2
  const keyMode = (n: number): Mode => step === 4 ? 'on' : n === step ? 'active' : n < step ? 'on' : 'off'
  const title = bond ? BOND_TITLES[step] : brackets
    ? 'Dot and cross diagram for sodium chloride. Each ion is drawn inside square brackets with its charge at the top right: [Na]⁺ and [Cl]⁻.'
    : 'Dot and cross diagram for sodium chloride. Sodium’s electrons are dots and chlorine’s are crosses. After the transfer, the chloride ion has 7 crosses and 1 dot in its outer shell.'
  return <Diagram viewBox="0 0 540 330" title={title}>
    {/* Row 1: the atoms */}
    <g opacity={bond && step >= 2 ? .55 : 1}>
      <Particle cx={NA_X} cy={ROW1} sym="Na" shells={NA_ATOM} look="atom" />
      <Particle cx={CL_X} cy={ROW1} sym="Cl" shells={clAtom(step >= 1)} look="atom" />
      <Label x={NA_X} y={138} lines={['sodium atom 2,8,1']} />
      <Label x={CL_X} y={138} lines={['chlorine atom 2,8,7']} />
    </g>
    {step >= 1 && <g opacity={bond && step >= 2 ? .55 : 1}>
      <Curve from={[NA_X + 52, ROW1 - 8]} via={[MID, 0]} to={[CL_X - 54, ROW1 - 8]} colour={electronLine} width={2.4} />
      {bond && step === 1 && <text x={MID} y={16} textAnchor="middle" fontSize="13" fontWeight="700" fill={electronLine}>1 electron</text>}
    </g>}
    {/* Row 2: the ions */}
    {showIons ? <g>
      <Line from={[MID, 146]} to={[MID, 166]} colour={muted} width={2.2} />
      <Particle cx={NA_X} cy={ROW2} sym="Na" shells={NA_ION} look="pos" charge="+" strongBrackets={brackets} />
      <Particle cx={CL_X} cy={ROW2} sym="Cl" shells={CL_ION} look="neg" charge="−" strongBrackets={brackets} />
      <Label x={NA_X} y={306} lines={['sodium ion, Na⁺', '2,8']} />
      <Label x={CL_X} y={306} lines={['chloride ion, Cl⁻', '2,8,8']} />
      {step >= 3 && <g>
        <Line from={[NA_X + 62, ROW2]} to={[CL_X - 66, ROW2]} colour={step === 3 ? protonLine : ink} width={2.6} both />
        <text x={MID - 2} y={ROW2 + 26} textAnchor="middle" fontSize="13" fontWeight="700" fill={step === 3 ? protonLine : ink}>{step === 3 || !bond ? 'attract' : 'ionic'}</text>
        {bond && step === 4 && <text x={MID - 2} y={ROW2 + 42} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>bond</text>}
      </g>}
    </g> : <g opacity={faded}>
      <rect x={30} y={170} width={310} height={124} rx={14} fill="none" stroke={panelLine} strokeWidth="1.6" strokeDasharray="6 6" />
      <text x={MID} y={238} textAnchor="middle" fontSize="14" fontWeight="600" fill={muted}>what forms?</text>
    </g>}
    {/* Right: numbered steps (walkthrough) or the dot-and-cross key */}
    {bond ? <g>
      <KeyRow n={1} x={384} y={46} lines={['metal and', 'non-metal atoms']} mode={keyMode(0)} />
      <KeyRow n={2} x={384} y={106} lines={['electron', 'transfer']} mode={keyMode(1)} />
      <KeyRow n={3} x={384} y={160} lines={['ions form']} mode={keyMode(2)} />
      <KeyRow n={4} x={384} y={214} lines={['opposites', 'attract']} mode={keyMode(3)} />
      {step === 4 && <g><path d="M384 256H532" stroke={panelLine} strokeWidth="1.5" /><text x={384} y={282} fontSize="14" fontWeight="700" fill={ink}>ionic compound:</text><text x={384} y={300} fontSize="14" fill={ink}>sodium chloride</text></g>}
    </g> : <g>
      <rect x={382} y={40} width={150} height={brackets ? 190 : 108} rx={12} fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
      <Legend x={398} y={74} icon="dot" text="sodium’s" />
      <text x={412} y={90} fontSize="13" fill={ink}>electrons</text>
      <Legend x={398} y={120} icon="cross" text="chlorine’s" />
      <text x={412} y={136} fontSize="13" fill={ink}>electrons</text>
      {brackets && <g>
        <path d="M394 154H520" stroke={panelLine} strokeWidth="1.5" />
        <text x={398} y={178} fontSize="13" fontWeight="700" fill={ink}>[ ] = one ion</text>
        <text x={398} y={200} fontSize="13" fill={ink}>charge at the</text>
        <text x={398} y={216} fontSize="13" fill={ink}>top right</text>
      </g>}
    </g>}
  </Diagram>
}

// ---------- Section 2: magnesium oxide (outer shells only) ----------
function MgOScene() {
  const mgX = 110, oX = 290, r = 32
  const mgDots = [at(mgX, ROW1, r, -22.5), at(mgX, ROW1, r, 22.5)], oSlots = [at(oX, ROW1, r, 202.5), at(oX, ROW1, r, 157.5)]
  return <Diagram viewBox="0 0 540 330" title="Dot and cross diagram for magnesium oxide, outer shells only. The magnesium atom’s two outer electrons (dots) move to the oxygen atom, which has six crosses. This makes a magnesium ion, Mg²⁺, and an oxide ion, O²⁻, with 6 crosses and 2 dots.">
    <Particle cx={mgX} cy={ROW1} sym="Mg" shells={[{ r, marks: 'dd', start: -22.5, step: 45 }]} look="atom" />
    <Particle cx={oX} cy={ROW1} sym="O" shells={[{ r, marks: 'ooxxxxxx', start: 157.5 }]} look="atom" />
    <Curve from={[mgDots[0][0] + 6, mgDots[0][1] - 4]} via={[200, 6]} to={[oSlots[0][0] - 7, oSlots[0][1] - 5]} colour={electronLine} width={2.2} />
    <Curve from={[mgDots[1][0] + 6, mgDots[1][1] + 4]} via={[200, 130]} to={[oSlots[1][0] - 7, oSlots[1][1] + 5]} colour={electronLine} width={2.2} />
    <Label x={mgX} y={132} lines={['magnesium atom']} />
    <Label x={oX} y={132} lines={['oxygen atom']} />
    <Line from={[200, 146]} to={[200, 170]} colour={muted} width={2.2} />
    <Particle cx={mgX} cy={ROW2} sym="Mg" shells={[]} look="pos" charge="2+" />
    <Particle cx={oX} cy={ROW2} sym="O" shells={[{ r, marks: 'ddxxxxxx', start: 157.5 }]} look="neg" charge="2−" />
    <Label x={mgX} y={300} lines={['magnesium ion, Mg²⁺']} />
    <Label x={oX} y={300} lines={['oxide ion, O²⁻']} />
    <rect x={382} y={40} width={150} height={170} rx={12} fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <Legend x={398} y={74} icon="dot" text="magnesium’s" />
    <text x={412} y={90} fontSize="13" fill={ink}>electrons</text>
    <Legend x={398} y={120} icon="cross" text="oxygen’s" />
    <text x={412} y={136} fontSize="13" fill={ink}>electrons</text>
    <path d="M394 154H520" stroke={panelLine} strokeWidth="1.5" />
    <text x={398} y={178} fontSize="13" fontWeight="700" fill={ink}>outer shells only</text>
    <text x={398} y={196} fontSize="13" fill={muted}>Mg loses 2, O gains 2</text>
  </Diagram>
}

// ---------- Section 2: magnesium chloride (outer shells only) ----------
function MgCl2Scene() {
  const c1 = 65, mg = 195, c2 = 325, r = 30
  const clShell = (slotAt: number, fill: 'o' | 'd'): Shell[] => [{ r, marks: `${fill}xxxxxxx`, start: slotAt }]
  return <Diagram viewBox="0 0 540 330" title="Dot and cross diagram for magnesium chloride, outer shells only. One magnesium atom gives one of its two outer electrons (dots) to each of two chlorine atoms. This makes one Mg²⁺ ion and two Cl⁻ ions, so the formula is MgCl₂.">
    <Particle cx={c1} cy={ROW1} sym="Cl" shells={clShell(0, 'o')} look="atom" />
    <Particle cx={mg} cy={ROW1} sym="Mg" shells={[{ r, marks: 'dd', start: 0 }]} look="atom" />
    <Particle cx={c2} cy={ROW1} sym="Cl" shells={clShell(180, 'o')} look="atom" />
    <Curve from={[mg - r - 2, ROW1 - 8]} via={[130, 16]} to={[c1 + r + 3, ROW1 - 8]} colour={electronLine} width={2.2} />
    <Curve from={[mg + r + 2, ROW1 - 8]} via={[260, 16]} to={[c2 - r - 3, ROW1 - 8]} colour={electronLine} width={2.2} />
    <Label x={c1} y={132} lines={['chlorine atom']} />
    <Label x={mg} y={132} lines={['magnesium atom']} />
    <Label x={c2} y={132} lines={['chlorine atom']} />
    <Line from={[195, 146]} to={[195, 170]} colour={muted} width={2.2} />
    <Particle cx={c1} cy={ROW2} sym="Cl" shells={clShell(0, 'd')} look="neg" charge="−" />
    <Particle cx={mg} cy={ROW2} sym="Mg" shells={[]} look="pos" charge="2+" />
    <Particle cx={c2} cy={ROW2} sym="Cl" shells={clShell(180, 'd')} look="neg" charge="−" />
    <Label x={c1} y={300} lines={['chloride ion']} />
    <Label x={mg} y={300} lines={['magnesium ion']} />
    <Label x={c2} y={300} lines={['chloride ion']} />
    <rect x={392} y={40} width={140} height={196} rx={12} fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <Legend x={406} y={74} icon="dot" text="magnesium’s" />
    <text x={420} y={90} fontSize="13" fill={ink}>electrons</text>
    <Legend x={406} y={120} icon="cross" text="chlorine’s" />
    <text x={420} y={136} fontSize="13" fill={ink}>electrons</text>
    <path d="M402 154H522" stroke={panelLine} strokeWidth="1.5" />
    <text x={406} y={178} fontSize="13" fontWeight="700" fill={ink}>1 Mg²⁺ : 2 Cl⁻</text>
    <text x={406} y={200} fontSize="16" fontWeight="700" fill={electronLine}>MgCl₂</text>
  </Diagram>
}

// ---------- Section 2: what dot and cross diagrams leave out ----------
function LimitsScene() {
  const rows: Array<[boolean, string[]]> = [[true, ['which atom each', 'electron came from']], [false, ['how big the', 'ions are']], [false, ['how the ions are', 'arranged']], [false, ['that all electrons', 'are really the same']]]
  return <Diagram viewBox="0 0 540 280" title="A dot and cross diagram for sodium chloride. It shows which atom each electron came from. It does not show how big the ions are, how they are arranged, or that all electrons are really the same.">
    <Particle cx={95} cy={130} sym="Na" shells={NA_ION} look="pos" charge="+" />
    <Particle cx={255} cy={130} sym="Cl" shells={CL_ION} look="neg" charge="−" />
    <Label x={95} y={220} lines={['Na⁺']} />
    <Label x={255} y={220} lines={['Cl⁻']} />
    <rect x={346} y={22} width={186} height={236} rx={12} fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={360} y={48} fontSize="13" fontWeight="700" fill={muted}>The diagram shows…</text>
    {rows.map(([ok, lines], i) => <g key={i}>
      <Tick x={368} y={80 + i * 50} ok={ok} />
      <text x={384} y={76 + i * 50} fontSize="13" fontWeight={ok ? 700 : 600} fill={ink}>{lines.map((l, j) => <tspan key={j} x={384} dy={j ? 16 : 0}>{l}</tspan>)}</text>
    </g>)}
  </Diagram>
}

// ---------- Ions for lattices ----------
function Ion({ x, y, kind, r, signs = true }: { x: number; y: number; kind: '+' | '-'; r?: number; signs?: boolean }) {
  const pos = kind === '+', rr = r ?? (pos ? 11 : 17)
  return <g data-particle={pos ? 'positive-ion' : 'negative-ion'}>
    <circle cx={r1(x)} cy={r1(y)} r={rr} fill={pos ? posFill : negFill} stroke={pos ? protonLine : electronLine} strokeWidth="1.6" />
    {signs && <text x={r1(x)} y={r1(y + 5)} textAnchor="middle" fontSize="14" fontWeight="700" fill={pos ? protonLine : electronLine}>{pos ? '+' : '−'}</text>}
  </g>
}
function IonKey({ x, y, extra, same = false }: { x: number; y: number; extra?: ReactNode; same?: boolean }) {
  return <g>
    <Ion x={x + 14} y={y} kind="+" r={same ? 12 : undefined} />
    <text x={x + 38} y={y + 5} fontSize="13" fontWeight="600" fill={ink}>sodium ion, Na⁺</text>
    <Ion x={x + 14} y={y + 42} kind="-" r={same ? 12 : undefined} />
    <text x={x + 38} y={y + 47} fontSize="13" fontWeight="600" fill={ink}>chloride ion, Cl⁻</text>
    {extra}
  </g>
}

// ---------- Section 3: one layer of the lattice ----------
const COLS = 6, ROWS = 4, GAP = 48, LX = 52, LY = 62
function Layer({ highlight = false, bonds = false, x0 = LX, y0 = LY }: { highlight?: boolean; bonds?: boolean; x0?: number; y0?: number }) {
  const tc = 2, tr = 2
  const cells = Array.from({ length: ROWS }, (_, r) => Array.from({ length: COLS }, (_, c) => ({ c, r, x: x0 + c * GAP, y: y0 + r * GAP, kind: ((c + r) % 2 === 0 ? '+' : '-') as '+' | '-' }))).flat()
  const near = (c: number, r: number) => Math.abs(c - tc) + Math.abs(r - tr) === 1
  return <g>
    {bonds && cells.map(a => cells.filter(b => (b.c === a.c + 1 && b.r === a.r) || (b.r === a.r + 1 && b.c === a.c)).map(b => <path key={`${a.c}${a.r}${b.c}${b.r}`} d={`M${a.x} ${a.y}L${b.x} ${b.y}`} stroke={amberLine} strokeWidth="3" />))}
    {highlight && cells.filter(c => near(c.c, c.r)).map(c => <path key={`h${c.c}${c.r}`} d={`M${x0 + tc * GAP} ${y0 + tr * GAP}L${c.x} ${c.y}`} stroke={protonLine} strokeWidth="4" />)}
    {cells.map(cell => <g key={`${cell.c}-${cell.r}`} opacity={highlight && !(near(cell.c, cell.r) || (cell.c === tc && cell.r === tr)) ? faded + .1 : 1}><Ion x={cell.x} y={cell.y} kind={cell.kind} /></g>)}
    {highlight && <circle cx={x0 + tc * GAP} cy={y0 + tr * GAP} r={19} fill="none" stroke={protonLine} strokeWidth="2.5" strokeDasharray="4 4" />}
  </g>
}
function LatticeLayer({ focus }: { focus: string }) {
  const dirs = focus === 'ionic-lattice-directions'
  return <Diagram viewBox="0 0 540 300" title={dirs
    ? 'One sodium ion in the lattice is picked out. It is attracted by the four chloride ions around it in this layer, and by one above and one below. The ionic bonds act in all directions.'
    : 'One flat layer of sodium chloride. Positive sodium ions and negative chloride ions alternate in a regular pattern that carries on in every direction: a giant ionic lattice.'}>
    <rect x={24} y={34} width={296} height={200} rx={14} fill={panelFill} stroke={panelLine} strokeWidth="1.5" strokeDasharray={dirs ? undefined : '7 6'} />
    <Layer highlight={dirs} />
    <text x={172} y={262} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>one layer of the lattice</text>
    {!dirs && <text x={172} y={280} textAnchor="middle" fontSize="13" fill={muted}>the pattern carries on in every direction</text>}
    <IonKey x={350} y={62} />
    {dirs ? <g>
      <path d="M350 130H530" stroke={panelLine} strokeWidth="1.5" />
      <text x={352} y={156} fontSize="13" fontWeight="700" fill={protonLine}>one Na⁺ is attracted by</text>
      <text x={352} y={176} fontSize="13" fill={ink}>4 Cl⁻ in this layer</text>
      <text x={352} y={196} fontSize="13" fill={ink}>+ 1 above, + 1 below</text>
      <text x={352} y={222} fontSize="13" fontWeight="700" fill={ink}>bonds in all directions</text>
    </g> : <g>
      <path d="M350 130H530" stroke={panelLine} strokeWidth="1.5" />
      <text x={352} y={156} fontSize="13" fontWeight="700" fill={ink}>+ and − alternate</text>
      <text x={352} y={176} fontSize="13" fill={ink}>a regular, repeating</text>
      <text x={352} y={194} fontSize="13" fill={ink}>pattern</text>
    </g>}
  </Diagram>
}

// ---------- Sections 3 and 4: ball-and-stick model, 3 × 3 × 2 = 9 Na⁺ and 9 Cl⁻ ----------
type P3 = { x: number; y: number; z: number; kind: '+' | '-' }
const BS: P3[] = []
for (let z = 1; z >= 0; z--) for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) BS.push({ x, y, z, kind: (x + y + z) % 2 === 0 ? '+' : '-' })
function BallStick({ x0 = 62, y0 = 224, s = 72, dim = false }: { x0?: number; y0?: number; s?: number; dim?: boolean }) {
  const px = (p: P3): [number, number] => [r1(x0 + p.x * s + p.z * s * .55), r1(y0 - p.y * s - p.z * s * .45)]
  const sticks: Array<[P3, P3]> = []
  for (const a of BS) for (const b of BS) if (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z) === 1 && (a.x < b.x || a.y < b.y || a.z < b.z)) sticks.push([a, b])
  return <g opacity={dim ? .45 : 1}>
    {[1, 0].map(z => <g key={z}>
      {sticks.filter(([a, b]) => Math.max(a.z, b.z) === z && Math.min(a.z, b.z) === z).map(([a, b], i) => { const [ax, ay] = px(a), [bx, by] = px(b); return <path key={i} d={`M${ax} ${ay}L${bx} ${by}`} stroke={greyLine} strokeWidth="2.4" /> })}
      {z === 0 && sticks.filter(([a, b]) => a.z !== b.z).map(([a, b], i) => {
        const [back, front] = a.z > b.z ? [a, b] : [b, a], [ax, ay] = px(back), [bx, by] = px(front)
        const len = Math.hypot(bx - ax, by - ay), rb = 12
        return <path key={`z${i}`} d={`M${r1(ax + (bx - ax) * rb / len)} ${r1(ay + (by - ay) * rb / len)}L${bx} ${by}`} stroke={greyLine} strokeWidth="2.4" />
      })}
      {BS.filter(p => p.z === z).map((p, i) => { const [x, y] = px(p); return <Ion key={i} x={x} y={y} kind={p.kind} r={12} /> })}
    </g>)}
  </g>
}
function BallStickScene() {
  const rows: Array<[boolean, string[]]> = [[true, ['shows how the', 'ions are arranged']], [false, ['makes the ions', 'look far apart']], [false, ['does not show', 'the ions’ sizes']]]
  return <Diagram viewBox="0 0 540 300" title="A ball-and-stick model of part of the sodium chloride lattice: 9 sodium ions and 9 chloride ions alternate in a 3D pattern, joined by sticks. It shows the arrangement, but the gaps and sticks are not real and the sizes are not shown.">
    <BallStick />
    <text x={176} y={286} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>ball-and-stick model (part of the lattice)</text>
    <IonKey x={352} y={34} same />
    <path d="M352 100H530" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([ok, lines], i) => <g key={i}>
      <Tick x={362} y={132 + i * 48} ok={ok} />
      <text x={378} y={128 + i * 48} fontSize="13" fontWeight={ok ? 700 : 600} fill={ink}>{lines.map((l, j) => <tspan key={j} x={378} dy={j ? 16 : 0}>{l}</tspan>)}</text>
    </g>)}
  </Diagram>
}

// ---------- Section 3: space-filling model (4 × 4 × 4, ions touching) ----------
function SpaceFillScene() {
  const s = 32, rNeg = 20, rPos = 12, x0 = 70, y0 = 250
  const balls: P3[] = []
  for (let z = 3; z >= 0; z--) for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) balls.push({ x, y, z, kind: (x + y + z) % 2 === 0 ? '+' : '-' })
  const rows: Array<[boolean, string[]]> = [[true, ['shows the ions’', 'relative sizes']], [true, ['shows the pattern']], [false, ['only the outside', 'can be seen']]]
  return <Diagram viewBox="0 0 540 300" title="A space-filling model of part of the sodium chloride lattice. The ions touch. Chloride ions are drawn bigger than sodium ions, as they really are, but only the ions on the outside can be seen.">
    <path d={`M${x0 - 14} ${y0 + 14}H${x0 + 3 * s + 14}L${x0 + 4.5 * s + 14} ${y0 - 1.5 * s + 14}V${y0 - 4.5 * s - 14}H${x0 + 1.5 * s - 14}L${x0 - 14} ${y0 - 3 * s - 14}Z`} fill="#dfe8ee" stroke={panelLine} strokeWidth="1.5" />
    {balls.filter(p => p.z === 0 || p.y === 3 || p.x === 3).map((p, i) => <Ion key={i} x={x0 + p.x * s + p.z * s * .5} y={y0 - p.y * s - p.z * s * .5} kind={p.kind} r={p.kind === '+' ? rPos : rNeg} signs={p.z === 0} />)}
    <text x={150} y={290} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>space-filling model</text>
    <IonKey x={352} y={34} />
    <path d="M352 100H530" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([ok, lines], i) => <g key={i}>
      <Tick x={362} y={132 + i * 48} ok={ok} />
      <text x={378} y={128 + i * 48} fontSize="13" fontWeight={ok ? 700 : 600} fill={ink}>{lines.map((l, j) => <tspan key={j} x={378} dy={j ? 16 : 0}>{l}</tspan>)}</text>
    </g>)}
  </Diagram>
}

// ---------- Section 4: formula from a diagram ----------
function CountScene({ focus }: { focus: string }) {
  const ratio = focus === 'ionic-formula-ratio'
  return <Diagram viewBox="0 0 540 300" title={ratio
    ? 'Finding the formula: 9 sodium ions and 9 chloride ions cancel to the simplest ratio 1 : 1, so the empirical formula is NaCl.'
    : 'Finding the formula: count each kind of ion in the ball-and-stick model. There are 9 sodium ions and 9 chloride ions.'}>
    <BallStick dim={ratio} />
    <rect x={346} y={30} width={186} height={236} rx={12} fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <Badge n={1} x={366} y={58} active={!ratio} />
    <text x={386} y={63} fontSize="14" fontWeight="700" fill={ink}>count</text>
    <Ion x={372} y={98} kind="+" r={12} />
    <text x={392} y={103} fontSize="14" fontWeight="600" fill={ink}>Na⁺ ions: <tspan fontWeight="700">9</tspan></text>
    <Ion x={372} y={136} kind="-" r={12} />
    <text x={392} y={141} fontSize="14" fontWeight="600" fill={ink}>Cl⁻ ions: <tspan fontWeight="700">9</tspan></text>
    <g opacity={ratio ? 1 : .4}>
      <path d="M358 164H520" stroke={panelLine} strokeWidth="1.5" />
      <Badge n={2} x={366} y={188} active={ratio} />
      <text x={386} y={193} fontSize="14" fontWeight="700" fill={ink}>cancel down</text>
      <text x={366} y={222} fontSize="15" fontWeight="700" fill={ink}>9 : 9 → 1 : 1</text>
      {ratio && <text x={366} y={250} fontSize="18" fontWeight="700" fill={electronLine}>NaCl</text>}
    </g>
  </Diagram>
}

// ---------- Section 4: formula from charges (K⁺ and O²⁻) ----------
function ChargeTile({ x, y, w, label, charge, pos, empty = false }: { x: number; y: number; w: number; label: string; charge: string; pos: boolean; empty?: boolean }) {
  if (empty) return <g><rect x={x} y={y} width={w} height={48} rx={10} fill="white" stroke={protonLine} strokeWidth="1.8" strokeDasharray="5 5" /><text x={x + w / 2} y={y + 30} textAnchor="middle" fontSize="18" fontWeight="700" fill={protonLine}>?</text></g>
  return <g><rect x={x} y={y} width={w} height={48} rx={10} fill={pos ? glow : blueFill} stroke={pos ? protonLine : electronLine} strokeWidth="1.8" />
    <text x={x + w / 2} y={y + 22} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{label}</text>
    <text x={x + w / 2} y={y + 40} textAnchor="middle" fontSize="13" fontWeight="700" fill={pos ? protonLine : electronLine}>{charge}</text></g>
}
function ChargeScene({ focus }: { focus: string }) {
  const done = focus === 'ionic-formula-balance', x0 = 120, unit = 72
  return <Diagram viewBox="0 0 540 290" title={done
    ? 'Two potassium ions, each 1+, balance one oxide ion, 2−. The total charge is zero, so the formula of potassium oxide is K₂O.'
    : 'Potassium forms K⁺ ions (Group 1) and oxygen forms O²⁻ ions (Group 6). One K⁺ ion does not balance one O²⁻ ion: the total charge would be 1−.'} schematic={false}>
    <text x={x0 - 14} y={92} textAnchor="end" fontSize="13" fontWeight="700" fill={protonLine}>positive</text>
    <text x={x0 - 14} y={164} textAnchor="end" fontSize="13" fontWeight="700" fill={electronLine}>negative</text>
    <ChargeTile x={x0} y={62} w={unit - 6} label="K⁺" charge="+1" pos />
    <ChargeTile x={x0 + unit} y={62} w={unit - 6} label="K⁺" charge="+1" pos empty={!done} />
    <ChargeTile x={x0} y={134} w={unit * 2 - 6} label="O²⁻" charge="−2" pos={false} />
    <path d={`M${x0} 206H${x0 + unit * 2 - 6}`} stroke={panelLine} strokeWidth="1.5" />
    <text x={x0 + unit - 3} y={234} textAnchor="middle" fontSize="15" fontWeight="700" fill={done ? lightIsoLine : protonLine}>{done ? '+1 + 1 − 2 = 0' : '+1 − 2 = −1'}</text>
    <text x={x0 + unit - 3} y={256} textAnchor="middle" fontSize="13" fill={muted}>{done ? 'balanced' : 'not balanced yet'}</text>
    <rect x={338} y={30} width={194} height={236} rx={12} fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={354} y={60} fontSize="13" fontWeight="700" fill={ink}>potassium oxide</text>
    <text x={354} y={86} fontSize="13" fill={ink}>K: Group 1 → <tspan fontWeight="700" fill={protonLine}>K⁺</tspan></text>
    <text x={354} y={108} fontSize="13" fill={ink}>O: Group 6 → <tspan fontWeight="700" fill={electronLine}>O²⁻</tspan></text>
    <path d="M350 126H520" stroke={panelLine} strokeWidth="1.5" />
    <text x={354} y={152} fontSize="13" fontWeight="600" fill={ink}>total charge must be 0</text>
    {done ? <g>
      <text x={354} y={180} fontSize="13" fill={ink}>2 K⁺ for every 1 O²⁻</text>
      <text x={354} y={222} fontSize="22" fontWeight="700" fill={electronLine}>K₂O</text>
      <text x={354} y={246} fontSize="13" fill={muted}>small 2 = two K⁺ ions</text>
    </g> : <text x={354} y={180} fontSize="13" fill={muted}>how many K⁺ ions?</text>}
  </Diagram>
}

// ---------- Section 5: properties ----------
function Thermometer({ x, y }: { x: number; y: number }) {
  return <g>
    <rect x={x - 9} y={y} width={18} height={170} rx={9} fill="white" stroke={ink} strokeWidth="1.8" />
    <rect x={x - 4} y={y + 22} width={8} height={150} rx={4} fill={protonFill} />
    <circle cx={x} cy={y + 184} r={16} fill={protonFill} stroke={ink} strokeWidth="1.8" />
    {[0, 1, 2, 3, 4].map(i => <path key={i} d={`M${x + 9} ${y + 30 + i * 30}H${x + 16}`} stroke={ink} strokeWidth="1.5" />)}
  </g>
}
function MeltScene() {
  return <Diagram viewBox="0 0 540 300" title="The sodium chloride lattice with every ionic bond between neighbouring ions drawn in. Melting means breaking lots of strong bonds, so it needs a lot of energy: sodium chloride melts at 801 °C.">
    <rect x={24} y={34} width={296} height={200} rx={14} fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <Layer bonds />
    <text x={172} y={262} textAnchor="middle" fontSize="13" fontWeight="600" fill={amberInk}>lines show the strong ionic bonds</text>
    <Thermometer x={370} y={40} />
    <text x={398} y={78} fontSize="16" fontWeight="700" fill={protonLine}>801 °C</text>
    <text x={398} y={98} fontSize="13" fill={ink}>melting point of</text>
    <text x={398} y={114} fontSize="13" fill={ink}>sodium chloride</text>
    <text x={398} y={176} fontSize="13" fontWeight="700" fill={ink}>many strong bonds</text>
    <text x={398} y={194} fontSize="13" fill={ink}>→ lots of energy</text>
    <text x={398} y={212} fontSize="13" fill={ink}>→ high melting point</text>
  </Diagram>
}
type Stage = 'solid' | 'molten' | 'dissolved'
const LOOSE: Array<[number, number, '+' | '-']> = [[120, 188, '-'], [165, 188, '+'], [110, 214, '+'], [175, 214, '-'], [130, 240, '-'], [170, 240, '+'], [105, 266, '+'], [165, 266, '-']]
const SPREAD: Array<[number, number, '+' | '-']> = [[118, 194, '+'], [178, 190, '-'], [148, 226, '-'], [112, 258, '-'], [180, 240, '+'], [150, 268, '+']]
function Cell({ stage, mini = false }: { stage: Stage; mini?: boolean }) {
  const on = stage !== 'solid', lx = 80, rx = 220, top = 150, bottom = 282
  const fill = stage === 'molten' ? amberFill : stage === 'dissolved' ? blueFill : 'none'
  const ions = stage === 'molten' ? LOOSE : SPREAD
  return <g>
    {/* wires, bulb and cell */}
    <path d={`M${lx} 112V40H136M154 40H${rx}V112`} fill="none" stroke={ink} strokeWidth="2" />
    <path d="M138 26V54M152 33V47" stroke={ink} strokeWidth="3" />
    {on && <circle cx={lx} cy={76} r={26} fill={amberFill} stroke={amberLine} strokeWidth="1.5" />}
    <circle cx={lx} cy={76} r={14} fill={on ? '#ffe2a8' : 'white'} stroke={on ? amberLine : greyLine} strokeWidth="2" />
    <path d={`M${lx - 7} ${76 - 7}L${lx + 7} ${76 + 7}M${lx + 7} ${76 - 7}L${lx - 7} ${76 + 7}`} stroke={on ? amberInk : greyLine} strokeWidth="1.8" />
    {/* beaker and contents */}
    {stage !== 'solid' && <path d={`M${lx - 32} 168V${bottom - 14}Q${lx - 32} ${bottom} ${lx - 18} ${bottom}H${rx + 18}Q${rx + 32} ${bottom} ${rx + 32} ${bottom - 14}V168Z`} fill={fill} />}
    {stage !== 'solid' && <path d={`M${lx - 32} 168H${rx + 32}`} stroke={stage === 'molten' ? amberLine : electronLine} strokeWidth="1.5" opacity=".7" />}
    <path d={`M${lx - 32} ${top}V${bottom - 14}Q${lx - 32} ${bottom} ${lx - 18} ${bottom}H${rx + 18}Q${rx + 32} ${bottom} ${rx + 32} ${bottom - 14}V${top}`} fill="none" stroke={ink} strokeWidth="2.2" />
    {stage === 'solid' ? [0, 1, 2].map(r => [0, 1, 2, 3].map(c => <Ion key={`${r}${c}`} x={122 + c * 22} y={222 + r * 20} kind={(r + c) % 2 === 0 ? '-' : '+'} r={(r + c) % 2 === 0 ? 10 : 7} signs={false} />))
      : ions.map(([x, y, k], i) => <g key={i}>
        <Ion x={x} y={y} kind={k} r={k === '+' ? 7 : 10} signs={false} />
        {!mini && <Line from={[x + (k === '+' ? 9 : -12), y]} to={[x + (k === '+' ? 20 : -23), y]} colour={k === '+' ? protonLine : electronLine} width={1.6} />}
      </g>)}
    <rect x={lx - 5} y={112} width={10} height={150} rx={3} fill={greyFill} stroke={greyLine} strokeWidth="1.5" />
    <rect x={rx - 5} y={112} width={10} height={150} rx={3} fill={greyFill} stroke={greyLine} strokeWidth="1.5" />
    {!mini && <g>
      <text x={133} y={24} textAnchor="end" fontSize="13" fontWeight="700" fill={ink}>+</text>
      <text x={158} y={24} fontSize="13" fontWeight="700" fill={ink}>−</text>
      <text x={lx - 12} y={128} textAnchor="end" fontSize="14" fontWeight="700" fill={protonLine}>+</text>
      <text x={rx + 12} y={128} fontSize="14" fontWeight="700" fill={electronLine}>−</text>
    </g>}
  </g>
}
const STAGES: Stage[] = ['solid', 'molten', 'dissolved']
const STAGE_TEXT: Record<Stage, [string, string]> = { solid: ['solid', 'ions held in place'], molten: ['molten', 'ions free to move'], dissolved: ['dissolved', 'ions move in water'] }
const STAGE_TITLES: Record<Stage, string> = {
  solid: 'Solid sodium chloride between two electrodes in a circuit. The ions are held in place in the lattice, so they cannot move and carry charge. The bulb stays off.',
  molten: 'Molten sodium chloride in the same circuit. The ions are free to move: positive ions drift towards the negative electrode and negative ions towards the positive one. The bulb lights.',
  dissolved: 'Sodium chloride dissolved in water in the same circuit. The ions spread through the water and can move, so they carry charge. The bulb lights.',
}
function CircuitScene({ stage }: { stage: Stage }) {
  const idx = STAGES.indexOf(stage)
  return <Diagram viewBox="0 0 540 300" title={STAGE_TITLES[stage]}>
    <Cell stage={stage} />
    <text x={150} y={298} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>{stage === 'solid' ? 'solid sodium chloride' : stage === 'molten' ? 'molten sodium chloride' : 'sodium chloride solution'}</text>
    {STAGES.map((s, i) => {
      const mode: Mode = i === idx ? 'active' : i < idx ? 'on' : 'off', y = 64 + i * 72
      return <g key={s} opacity={mode === 'off' ? .4 : 1}>
        {mode === 'active' && <rect x={282} y={y - 28} width={250} height={60} rx={12} fill={panelFill} stroke={panelLine} strokeWidth="1.5" />}
        <Badge n={i + 1} x={304} y={y} active={mode === 'active'} />
        <text x={326} y={y - 3} fontSize="14" fontWeight="700" fill={ink}>{STAGE_TEXT[s][0]}</text>
        <text x={326} y={y + 16} fontSize="13" fill={ink}>{STAGE_TEXT[s][1]}</text>
        <Tick x={506} y={y + 4} ok={s !== 'solid'} />
      </g>
    })}
    <text x={290} y={272} fontSize="13" fill={muted}>ions that can move carry charge</text>
  </Diagram>
}
function PropSummary() {
  return <Diagram viewBox="0 0 540 250" title="Summary: solid sodium chloride does not conduct because its ions cannot move. Molten sodium chloride and sodium chloride solution both conduct because their ions can move.">
    {STAGES.map((s, i) => <g key={s}>
      <g transform={`translate(${6 + i * 178} 0) scale(.62)`}><Cell stage={s} mini /></g>
      <Tick x={34 + i * 178} y={206} ok={s !== 'solid'} />
      <text x={50 + i * 178} y={206} fontSize="14" fontWeight="700" fill={ink}>{STAGE_TEXT[s][0]}</text>
      <text x={24 + i * 178} y={228} fontSize="13" fill={muted}>{s === 'solid' ? 'ions held in place' : 'ions can move'}</text>
    </g>)}
  </Diagram>
}

// ---------- On your own: lithium oxide (outer shells only), numbered ----------
function LiOQuestion({ assessment }: { assessment: boolean }) {
  const oX = 270, cy = 120, r = 36
  return <Diagram viewBox="0 0 540 270" title={assessment
    ? 'A dot and cross diagram of lithium oxide with outer shells only, showing three ions in square brackets with numbered pointers 1, 2 and 3.'
    : 'Lithium oxide, outer shells only: two lithium ions, Li⁺, and one oxide ion, O²⁻. Each lithium atom gave its one outer electron to the oxygen atom, so the oxide ion has 6 crosses and 2 dots.'}>
    <Particle cx={95} cy={cy} sym="Li" shells={[]} look="pos" charge="+" />
    <Particle cx={oX} cy={cy} sym="O" shells={[{ r, marks: 'dxxxdxxx', start: 180 }]} look="neg" charge="2−" />
    <Particle cx={445} cy={cy} sym="Li" shells={[]} look="pos" charge="+" />
    <Pointer n={1} x={50} y={40} to={[80, 100]} />
    <Pointer n={2} x={352} y={36} to={at(oX, cy, r, -60)} />
    <Pointer n={3} x={180} y={206} to={[oX - r - 5, cy + 5]} />
    <text x={95} y={186} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>lithium ion</text>
    <text x={445} y={186} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>lithium ion</text>
    <text x={oX} y={186} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>oxide ion</text>
    {!assessment && <g>
      <rect x={236} y={206} width={296} height={54} rx={12} fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
      <Legend x={252} y={230} icon="dot" text="electrons from lithium" />
      <Legend x={252} y={250} icon="cross" text="oxygen’s own electrons" />
    </g>}
  </Diagram>
}

// ---------- On your own: invented data for four substances ----------
const DATA: Array<[string, string, string, string]> = [['A', '770', 'no', 'yes'], ['B', '−95', 'no', 'no'], ['C', '1085', 'yes', 'yes'], ['D', '44', 'no', 'no']]
function DataTable() {
  const cols = [30, 140, 280, 400]
  return <Diagram viewBox="0 0 540 250" schematic={false} title="A table of invented data for four substances, A to D. A: melting point 770 °C, does not conduct as a solid, conducts when molten. B: −95 °C, no, no. C: 1085 °C, yes, yes. D: 44 °C, no, no.">
    <rect x={16} y={16} width={508} height={214} rx={12} fill="white" stroke={panelLine} strokeWidth="1.5" />
    <rect x={16} y={16} width={508} height={52} rx={12} fill={panelFill} />
    {['Substance', 'Melting point', 'Conducts as', 'Conducts when'].map((h, i) => <text key={h} x={cols[i]} y={38} fontSize="13" fontWeight="700" fill={ink}>{h}</text>)}
    {['', '(°C)', 'a solid?', 'molten?'].map((h, i) => h && <text key={h} x={cols[i]} y={56} fontSize="13" fontWeight="700" fill={ink}>{h}</text>)}
    {DATA.map((row, r) => <g key={row[0]}>
      {r > 0 && <path d={`M28 ${68 + r * 38}H512`} stroke={panelLine} strokeWidth="1" />}
      {row.map((v, i) => <text key={i} x={cols[i] + (i === 0 ? 30 : 0)} y={93 + r * 38} fontSize="15" fontWeight={i === 0 ? 700 : 500} fill={ink}>{v}</text>)}
    </g>)}
    <text x={30} y={246} fontSize="12" fill={muted}>invented data</text>
  </Diagram>
}

export function IonicVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('ionic-bond-') || focus === 'ionic-dc-nacl' || focus === 'ionic-dc-brackets') return <NaClScene focus={focus} />
  if (focus === 'ionic-dc-mgo') return <MgOScene />
  if (focus === 'ionic-dc-mgcl2') return <MgCl2Scene />
  if (focus === 'ionic-dc-limits') return <LimitsScene />
  if (focus === 'ionic-lattice-layer' || focus === 'ionic-lattice-directions') return <LatticeLayer focus={focus} />
  if (focus === 'ionic-lattice-ballstick') return <BallStickScene />
  if (focus === 'ionic-lattice-spacefill') return <SpaceFillScene />
  if (focus === 'ionic-formula-count' || focus === 'ionic-formula-ratio') return <CountScene focus={focus} />
  if (focus === 'ionic-formula-charges' || focus === 'ionic-formula-balance') return <ChargeScene focus={focus} />
  if (focus === 'ionic-prop-melt') return <MeltScene />
  if (focus === 'ionic-prop-solid') return <CircuitScene stage="solid" />
  if (focus === 'ionic-prop-molten') return <CircuitScene stage="molten" />
  if (focus === 'ionic-prop-dissolved') return <CircuitScene stage="dissolved" />
  if (focus === 'ionic-prop-summary') return <PropSummary />
  if (focus === 'ionic-question') return <LiOQuestion assessment={assessment} />
  if (focus === 'ionic-data') return <DataTable />
  return <NaClScene focus="ionic-bond-all" />
}
