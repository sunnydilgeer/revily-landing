import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C5, a lesson only some students get (Chemistry Lesson 30H): bond energies. Original, code-native
 * schematics; not to scale. Focus ids start with 'hbond-'.
 *
 * Same colour code as the reaction-profiles lesson (ProfileVisuals.tsx): blue = energy taken in (bonds broken,
 * endothermic), coral = energy given out (bonds made, exothermic), amber = the step the frame is about. Molecules in
 * the first section are ball models (H white, O soft coral, as in the hydrocarbons lesson); calculations use displayed
 * formulae (bold letters joined by one line per bond, two for a double bond, three for a triple bond).
 * Every molecule drawn is real and every sum is checked in the storyboard. Each teaching section keeps one drawing on
 * screen and lights one step at a time; the last frame shows it all. Assessment views never show the answer.
 */
const { ink, muted, protonLine, electronLine, panelFill, panelLine, glow } = atomPalette
const inLine = electronLine, inSoft = '#e4f0f9', inInk = '#1d5787'
const outLine = protonLine, outSoft = glow, outInk = '#8a332c'
const amber = '#d98a1c', amberSoft = '#fdf0dc', amberInk = '#8a5a14'
const bad = '#c0504a', badSoft = '#fbe6e4', good = '#3f8a5f', goodSoft = '#e6f3ea'
const faded = 0.3
const r1 = (n: number) => Math.round(n * 10) / 10

function Diagram({ title, children, viewBox = '0 0 540 340', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function T({ x, y, children, size = 14, colour = ink, bold = false, anchor = 'middle' }: { x: number; y: number; children: ReactNode; size?: number; colour?: string; bold?: boolean; anchor?: 'start' | 'middle' | 'end' }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={bold ? 700 : 500} fill={colour}>{children}</text>
}
type Tone = 'hot' | 'plain' | 'in' | 'out' | 'good'
const TONES: Record<Tone, [string, string, string]> = { hot: [amberSoft, amber, amberInk], plain: [panelFill, panelLine, ink], in: [inSoft, inLine, inInk], out: [outSoft, outLine, outInk], good: [goodSoft, good, '#2b6343'] }
function Chip({ x, y, w, children, tone = 'hot', h = 28, size = 14 }: { x: number; y: number; w: number; children: ReactNode; tone?: Tone; h?: number; size?: number }) {
  const [fill, line, text] = TONES[tone]
  return <g><rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="9" fill={fill} stroke={line} strokeWidth={tone === 'plain' ? 1.5 : 2} />
    <text x={x} y={y + size * .35} textAnchor="middle" fontSize={size} fontWeight="700" fill={text}>{children}</text></g>
}
function Num({ n, x, y, colour = ink, filled = false }: { n: number; x: number; y: number; colour?: string; filled?: boolean }) {
  return <g><circle cx={x} cy={y} r="12" fill={filled ? colour : 'white'} stroke={colour} strokeWidth="2" />
    <text x={x} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill={filled ? 'white' : colour}>{n}</text></g>
}
function Arrow({ x1, y1, x2, y2, colour = ink, width = 2.6 }: { x1: number; y1: number; x2: number; y2: number; colour?: string; width?: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1), head = 9 + width * 1.4
  const pts = [[x2, y2], [x2 - head * Math.cos(a - .42), y2 - head * Math.sin(a - .42)], [x2 - head * Math.cos(a + .42), y2 - head * Math.sin(a + .42)]]
  return <g fill={colour} stroke={colour} strokeWidth={width}><line x1={x1} y1={y1} x2={r1(x2 - head * .7 * Math.cos(a))} y2={r1(y2 - head * .7 * Math.sin(a))} /><polygon strokeWidth="1" points={pts.map(p => p.map(r1).join(',')).join(' ')} /></g>
}

// ---------- Ball models (section 1) ----------
type El = 'H' | 'O'
const BALL: Record<El, { fill: string; line: string; text: string; r: number }> = {
  H: { fill: '#ffffff', line: '#8d9ba6', text: '#375a73', r: 13 },
  O: { fill: '#f2a39b', line: '#c0625a', text: '#6e2621', r: 17 },
}
function Ball({ el, x, y }: { el: El; x: number; y: number }) {
  const b = BALL[el]
  return <g>
    <circle cx={x} cy={y} r={b.r} fill={b.fill} stroke={b.line} strokeWidth="1.8" />
    {el === 'O' && <ellipse cx={r1(x - b.r * .32)} cy={r1(y - b.r * .38)} rx={r1(b.r * .32)} ry={r1(b.r * .2)} fill="white" opacity=".3" />}
    <text x={x} y={y + 5} textAnchor="middle" fontSize={el === 'O' ? 15 : 13} fontWeight="700" fill={b.text}>{el}</text>
  </g>
}
/** A bond as a stick (or two for a double bond). `tone` colours it; `snip` draws a break mark across it. */
function Stick({ a, b, order = 1, colour = '#9aa6b0', snip = false }: { a: [number, number]; b: [number, number]; order?: number; colour?: string; snip?: boolean }) {
  const d = Math.hypot(b[0] - a[0], b[1] - a[1]), px = -(b[1] - a[1]) / d, py = (b[0] - a[0]) / d
  const offs = order === 1 ? [0] : [-3.5, 3.5]
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
  return <g>
    {offs.map((o, i) => <path key={i} d={`M${r1(a[0] + px * o)} ${r1(a[1] + py * o)}L${r1(b[0] + px * o)} ${r1(b[1] + py * o)}`} stroke={colour} strokeWidth={order === 1 ? 5 : 3.5} />)}
    {snip && <path d={`M${r1(mx + px * 11 - 3)} ${r1(my + py * 11 - 3)}L${r1(mx - px * 11 + 3)} ${r1(my - py * 11 + 3)}`} stroke="white" strokeWidth="4" />}
  </g>
}
type Pt = [number, number]
function H2({ at, tone, snip }: { at: Pt; tone?: string; snip?: boolean }) {
  const a: Pt = [at[0] - 20, at[1]], b: Pt = [at[0] + 20, at[1]]
  return <g><Stick a={a} b={b} colour={tone} snip={snip} /><Ball el="H" x={a[0]} y={a[1]} /><Ball el="H" x={b[0]} y={b[1]} /></g>
}
function O2({ at, tone, snip }: { at: Pt; tone?: string; snip?: boolean }) {
  const a: Pt = [at[0] - 23, at[1]], b: Pt = [at[0] + 23, at[1]]
  return <g><Stick a={a} b={b} order={2} colour={tone} snip={snip} /><Ball el="O" x={a[0]} y={a[1]} /><Ball el="O" x={b[0]} y={b[1]} /></g>
}
function Water({ at, tone }: { at: Pt; tone?: string }) {
  const o = at, h1: Pt = [at[0] - 25, at[1] + 19], h2: Pt = [at[0] + 25, at[1] + 19]
  return <g><Stick a={o} b={h1} colour={tone} /><Stick a={o} b={h2} colour={tone} /><Ball el="H" x={h1[0]} y={h1[1]} /><Ball el="H" x={h2[0]} y={h2[1]} /><Ball el="O" x={o[0]} y={o[1]} /></g>
}

// ---------- Section 1: breaking and making bonds in 2H₂ + O₂ → 2H₂O ----------
type BStage = 'rearrange' | 'break' | 'make' | 'compare'
const B_TITLES: Record<BStage, string> = {
  rearrange: 'Hydrogen burning: two H₂ molecules and one O₂ molecule on the left, the same atoms as separate atoms in the middle, and two water molecules on the right. Old bonds break, the atoms rearrange and new bonds form.',
  break: 'The bonds in the reactants, two H–H and one O=O, are coloured blue and snipped. A blue arrow to the separate atoms is labelled energy in: breaking bonds is endothermic.',
  make: 'The separate atoms join to form two water molecules with four new O–H bonds, coloured coral. A coral arrow is labelled energy out: making bonds is exothermic.',
  compare: 'Both steps with two bars below: a shorter blue bar for the energy taken in breaking bonds and a longer coral bar for the energy given out making bonds. More out than in, so burning hydrogen is exothermic overall.',
}
const RX = 80, AX = 270, PX = 460
function BondScene({ stage }: { stage: BStage }) {
  const breakOn = stage !== 'make' && stage !== 'rearrange', makeOn = stage === 'make' || stage === 'compare'
  const left = stage === 'make' ? faded : 1, right = stage === 'break' ? faded : 1
  return <Diagram title={B_TITLES[stage]}>
    <T x={270} y={28} size={17} bold>hydrogen + oxygen <tspan fill={muted}>→</tspan> water</T>
    {/* reactants */}
    <g opacity={left}>
      <H2 at={[RX, 70]} tone={breakOn ? inLine : undefined} snip={breakOn} />
      <H2 at={[RX, 110]} tone={breakOn ? inLine : undefined} snip={breakOn} />
      <O2 at={[RX, 152]} tone={breakOn ? inLine : undefined} snip={breakOn} />
      <T x={RX} y={200} bold>reactants</T>
      <T x={RX} y={220} size={13} colour={muted}>2H₂ + O₂</T>
    </g>
    {/* separate atoms */}
    <g opacity={stage === 'rearrange' ? .75 : 1}>
      <ellipse cx={AX} cy={114} rx={56} ry={70} fill={stage === 'rearrange' ? 'none' : panelFill} stroke={panelLine} strokeWidth="1.5" strokeDasharray="5 5" />
      <Ball el="H" x={244} y={68} /><Ball el="H" x={296} y={62} />
      <Ball el="O" x={248} y={116} /><Ball el="O" x={300} y={118} />
      <Ball el="H" x={246} y={162} /><Ball el="H" x={294} y={166} />
      <T x={AX} y={200} bold>separate atoms</T>
      <T x={AX} y={220} size={13} colour={muted}>4H + 2O</T>
    </g>
    {/* products */}
    <g opacity={right}>
      <Water at={[PX, 74]} tone={makeOn ? outLine : undefined} />
      <Water at={[PX, 134]} tone={makeOn ? outLine : undefined} />
      <T x={PX} y={200} bold>products</T>
      <T x={PX} y={220} size={13} colour={muted}>2H₂O</T>
    </g>
    {/* the two steps */}
    <g opacity={left}>
      <Arrow x1={132} y1={112} x2={202} y2={112} colour={breakOn ? inLine : muted} />
      <T x={167} y={96} size={12} bold colour={breakOn ? inInk : muted}>bonds break</T>
      {breakOn && <Chip x={167} y={136} w={76} tone="in" size={12} h={24}>energy in</Chip>}
    </g>
    <g opacity={right}>
      <Arrow x1={340} y1={112} x2={404} y2={112} colour={makeOn ? outLine : muted} />
      <T x={372} y={96} size={12} bold colour={makeOn ? outInk : muted}>bonds form</T>
      {makeOn && <Chip x={372} y={136} w={84} tone="out" size={12} h={24}>energy out</Chip>}
    </g>
    {/* lower panel */}
    {stage === 'rearrange' && <g>
      {['old bonds break', 'atoms rearrange', 'new bonds form'].map((s, i) => <g key={i}><Num n={i + 1} x={34 + i * 172} y={272} colour={amber} filled /><T x={52 + i * 172} y={277} anchor="start" bold>{s}</T></g>)}
      <T x={270} y={316} size={13} colour={muted}>Atoms are not made or destroyed, only rearranged.</T>
    </g>}
    {stage === 'break' && <g>
      <Chip x={270} y={266} w={420} tone="in" h={34} size={15}>Breaking bonds takes energy in: endothermic</Chip>
      <T x={270} y={310} size={13} colour={muted}>2 H–H bonds and 1 O=O bond are broken.</T>
    </g>}
    {stage === 'make' && <g>
      <Chip x={270} y={266} w={420} tone="out" h={34} size={15}>Making bonds gives energy out: exothermic</Chip>
      <T x={270} y={310} size={13} colour={muted}>4 new O–H bonds form, 2 in each water molecule.</T>
    </g>}
    {stage === 'compare' && <g>
      <T x={30} y={256} anchor="start" size={13} bold colour={inInk}>energy in: breaking bonds</T>
      <rect x={226} y={243} width={190} height={18} rx="6" fill={inSoft} stroke={inLine} strokeWidth="2" />
      <T x={30} y={290} anchor="start" size={13} bold colour={outInk}>energy out: making bonds</T>
      <rect x={226} y={277} width={260} height={18} rx="6" fill={outSoft} stroke={outLine} strokeWidth="2" />
      <T x={270} y={326} size={14} bold colour={amberInk}>More out than in, so it is exothermic overall.</T>
    </g>}
  </Diagram>
}

// ---------- Energy levels: up to separate atoms, down to products (section 1 last frame and a question) ----------
const LV = { react: 186, atoms: 52, prod: 238 }
function EnergyLevels({ labels, numbered = false, ring, names }: { labels: boolean; numbered?: boolean; ring?: number; names?: [string, string, string] }) {
  return <g>
    <path d="M50 300V26" stroke={ink} strokeWidth="2.5" fill="none" />
    <path d="M44 38L50 24L56 38Z" fill={ink} />
    <text transform="translate(34 170) rotate(-90)" textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>Energy</text>
    {/* levels */}
    <path d={`M64 ${LV.react}H196`} stroke={ink} strokeWidth="4" />
    <path d={`M200 ${LV.atoms}H350`} stroke={ink} strokeWidth="4" />
    <path d={`M354 ${LV.prod}H470`} stroke={ink} strokeWidth="4" />
    <path d={`M196 ${LV.react}H500`} stroke={ink} strokeWidth="1.5" strokeDasharray="6 5" opacity=".5" />
    <path d={`M170 ${LV.atoms}H200M350 ${LV.atoms}H380`} stroke={ink} strokeWidth="1.5" strokeDasharray="6 5" opacity=".5" />
    <T x={130} y={LV.react + 22} bold>reactants{names ? <tspan fontWeight={500} fill={muted}>: {names[0]}</tspan> : null}</T>
    <T x={275} y={LV.atoms - 12} bold>separate atoms{names ? <tspan fontWeight={500} fill={muted}>: {names[1]}</tspan> : null}</T>
    <T x={412} y={LV.prod + 22} bold>products{names ? <tspan fontWeight={500} fill={muted}>: {names[2]}</tspan> : null}</T>
    {/* arrows */}
    <Arrow x1={170} y1={LV.react - 4} x2={170} y2={LV.atoms + 2} colour={numbered ? ink : inLine} width={3} />
    <Arrow x1={380} y1={LV.atoms + 4} x2={380} y2={LV.prod - 2} colour={ring === 2 ? good : numbered ? ink : outLine} width={ring === 2 ? 4.5 : 3} />
    <Arrow x1={490} y1={LV.react + 2} x2={490} y2={LV.prod - 2} colour={numbered ? ink : outLine} width={3} />
    {numbered && <g><Num n={1} x={146} y={120} /><Num n={2} x={404} y={110} colour={ring === 2 ? good : ink} filled={ring === 2} /><Num n={3} x={516} y={212} /></g>}
    {labels && <g>
      <T x={182} y={112} anchor="start" size={13} bold colour={inInk}>bonds broken:</T>
      <T x={182} y={129} anchor="start" size={13} colour={inInk}>energy in</T>
      <T x={368} y={130} anchor="end" size={13} bold colour={outInk}>bonds made:</T>
      <T x={368} y={147} anchor="end" size={13} colour={outInk}>energy out</T>
    </g>}
  </g>
}
function LevelsTogether() {
  return <Diagram title="Energy diagram for burning hydrogen. A blue arrow goes up from the reactants, 2H₂ + O₂, to separate atoms: bonds broken, energy in. A longer coral arrow goes down from the atoms to the products, 2H₂O: bonds made, energy out. The products are lower than the reactants; the gap is the energy given out.">
    <EnergyLevels labels names={['2H₂ + O₂', '4H + 2O', '2H₂O']} />
    <T x={478} y={208} anchor="end" size={13} bold colour={outInk}>overall:</T>
    <T x={478} y={225} anchor="end" size={13} colour={outInk}>given out</T>
    <T x={290} y={292} size={14} bold colour={amberInk}>Down arrow longer than up arrow → exothermic</T>
    <T x={290} y={318} size={13} colour={muted}>The gap between reactants and products is the overall energy change.</T>
  </Diagram>
}
function ArrowsQuestion({ assessment }: { assessment: boolean }) {
  return <Diagram viewBox={`0 0 540 ${assessment ? 300 : 340}`} title={assessment
    ? 'An energy diagram with three levels: reactants, separate atoms higher up, and products lowest. Arrow 1 goes up from the reactants to the atoms, arrow 2 goes down from the atoms to the products, and arrow 3 goes from the reactant level down to the product level.'
    : 'The same energy diagram with arrow 2 ringed: it goes down from the separate atoms to the products, so it is the energy released as new bonds form. Arrow 1 is energy taken in to break bonds; arrow 3 is the overall energy change.'}>
    <EnergyLevels labels={!assessment} numbered ring={assessment ? undefined : 2} />
    {!assessment && <T x={270} y={326} size={14} bold colour={good}>2: down from the atoms to the products = bonds made</T>}
  </Diagram>
}

// ---------- Displayed formulae (sections 2 and 3, worked example and questions) ----------
type At = { el: string; x: number; y: number }
type Bd = [number, number, number?]
type Mol = { atoms: At[]; bonds: Bd[] }
function Displayed({ mol, size = 20, tone, opacity = 1 }: { mol: Mol; size?: number; tone?: string; opacity?: number }) {
  const gap = size * .52
  return <g opacity={opacity}>
    {mol.bonds.map(([p, q, order = 1], i) => {
      const A = mol.atoms[p], B = mol.atoms[q], d = Math.hypot(B.x - A.x, B.y - A.y), ux = (B.x - A.x) / d, uy = (B.y - A.y) / d
      const ga = A.el.length > 1 ? size * .8 : gap, gb = B.el.length > 1 ? size * .8 : gap
      const offs = order === 1 ? [0] : order === 2 ? [-3, 3] : [-5, 0, 5]
      return <g key={i} stroke={tone ?? ink} strokeWidth={tone ? 3.2 : 2.2}>
        {offs.map((o, j) => <path key={j} d={`M${r1(A.x + ux * ga - uy * o)} ${r1(A.y + uy * ga + ux * o)}L${r1(B.x - ux * gb - uy * o)} ${r1(B.y - uy * gb + ux * o)}`} />)}
      </g>
    })}
    {mol.atoms.map((a, i) => <text key={i} x={a.x} y={r1(a.y + size * .36)} textAnchor="middle" fontSize={size} fontWeight="700" fill={a.el === 'O' ? '#a8473f' : ink}>{a.el}</text>)}
  </g>
}
/** A straight molecule: atoms in a row g apart, centred on cx, with the given bond orders between neighbours. */
function row(els: string[], orders: number[], cx: number, y: number, g = 34): Mol {
  const x0 = cx - (els.length - 1) * g / 2
  return { atoms: els.map((el, i) => ({ el, x: r1(x0 + i * g), y })), bonds: orders.map((o, i) => [i, i + 1, o] as Bd) }
}
function methane(cx: number, y: number, g = 34): Mol {
  return { atoms: [{ el: 'C', x: cx, y }, { el: 'H', x: cx, y: y - g }, { el: 'H', x: cx, y: y + g }, { el: 'H', x: cx - g, y }, { el: 'H', x: cx + g, y }], bonds: [[0, 1], [0, 2], [0, 3], [0, 4]] }
}
function propane(cx: number, y: number, g = 46, v = 40): Mol {
  const x0 = cx - g, atoms: At[] = [], bonds: Bd[] = []
  for (let i = 0; i < 3; i++) atoms.push({ el: 'C', x: x0 + i * g, y })
  bonds.push([0, 1], [1, 2])
  const addH = (x: number, hy: number, c: number) => { atoms.push({ el: 'H', x, y: hy }); bonds.push([c, atoms.length - 1]) }
  addH(x0 - g, y, 0)
  for (let i = 0; i < 3; i++) { addH(x0 + i * g, y - v, i); addH(x0 + i * g, y + v, i) }
  addH(x0 + 3 * g, y, 2)
  return { atoms, bonds }
}
function Plus({ x, y }: { x: number; y: number }) { return <T x={x} y={y + 6} size={20} bold colour={muted}>+</T> }
function Yields({ x, y }: { x: number; y: number }) { return <T x={x} y={y + 7} size={22} bold colour={muted}>→</T> }
function DataTable({ x, y, w, rows, hot = false, title = 'bond energies (kJ/mol)' }: { x: number; y: number; w: number; rows: Array<[string, string]>; hot?: boolean; title?: string }) {
  const h = 34 + rows.length * 26
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="12" fill={hot ? amberSoft : panelFill} stroke={hot ? amber : panelLine} strokeWidth={hot ? 2 : 1.5} />
    <T x={x + w / 2} y={y + 22} size={12} bold colour={hot ? amberInk : muted}>{title}</T>
    {rows.map(([bond, value], i) => <g key={i}>
      <T x={x + 22} y={y + 48 + i * 26} anchor="start" size={16} bold>{bond}</T>
      <T x={x + w - 22} y={y + 48 + i * 26} anchor="end" size={16} bold>{value}</T>
    </g>)}
  </g>
}

// ---------- Section 2: the calculation board for 2H₂ + O₂ → 2H₂O ----------
type CStage = 'table' | 'broken' | 'made' | 'subtract' | 'sign'
const C_TITLES: Record<CStage, string> = {
  table: 'Displayed formulae for hydrogen burning: two H–H molecules plus O=O makes two H–O–H molecules. A table gives the bond energies in kJ/mol: H–H 436, O=O 498, O–H 464.',
  broken: 'The bonds in the reactants are coloured blue: 2 H–H and 1 O=O. Bonds broken = (2 × 436) + 498 = 1370 kJ/mol.',
  made: 'The bonds in the products are coloured coral: 4 O–H, two in each water molecule. Bonds made = 4 × 464 = 1856 kJ/mol.',
  subtract: 'Overall energy change = bonds broken − bonds made = 1370 − 1856 = −486 kJ/mol.',
  sign: 'The whole calculation, with −486 kJ/mol marked exothermic. A negative energy change means exothermic; a positive energy change means endothermic.',
}
const CROWS = [
  { y: 196, label: 'bonds broken', sum: '(2 × 436) + 498 = 1370 kJ/mol', tone: 'in' as const },
  { y: 240, label: 'bonds made', sum: '4 × 464 = 1856 kJ/mol', tone: 'out' as const },
  { y: 284, label: 'overall change', sum: '1370 − 1856 = −486 kJ/mol', tone: 'hot' as const },
]
function CalcScene({ stage }: { stage: CStage }) {
  const step = { table: 0, broken: 1, made: 2, subtract: 3, sign: 3 }[stage]
  const rIn = stage === 'broken' || stage === 'subtract' || stage === 'sign', rOut = stage === 'made' || stage === 'subtract' || stage === 'sign'
  return <Diagram viewBox="0 0 540 350" title={C_TITLES[stage]}>
    <Displayed mol={row(['H', 'H'], [1], 56, 50, 40)} tone={rIn ? inLine : undefined} />
    <Displayed mol={row(['H', 'H'], [1], 56, 96, 40)} tone={rIn ? inLine : undefined} />
    <Plus x={110} y={73} />
    <Displayed mol={row(['O', 'O'], [2], 156, 73, 44)} tone={rIn ? inLine : undefined} />
    <Yields x={212} y={73} />
    <Displayed mol={row(['H', 'O', 'H'], [1, 1], 290, 50, 40)} tone={rOut ? outLine : undefined} />
    <Displayed mol={row(['H', 'O', 'H'], [1, 1], 290, 96, 40)} tone={rOut ? outLine : undefined} />
    <T x={56} y={136} size={13} colour={muted}>2H₂</T>
    <T x={156} y={136} size={13} colour={muted}>O₂</T>
    <T x={290} y={136} size={13} colour={muted}>2H₂O</T>
    {(stage === 'broken') && <g><T x={56} y={156} size={13} bold colour={inInk}>2 × H–H</T><T x={156} y={156} size={13} bold colour={inInk}>1 × O=O</T></g>}
    {(stage === 'made') && <T x={290} y={156} size={13} bold colour={outInk}>4 × O–H</T>}
    <DataTable x={364} y={24} w={164} rows={[['H–H', '436'], ['O=O', '498'], ['O–H', '464']]} hot={stage === 'table'} />

    {CROWS.map((r, i) => {
      const shown = i < step, on = (i === step - 1 && stage !== 'sign') || (stage === 'sign' && i === 2)
      const [fill, line, text] = TONES[r.tone]
      return <g key={i} opacity={shown || stage === 'table' ? 1 : .35}>
        {on && <rect x={18} y={r.y - 24} width={504} height={36} rx="10" fill={fill} stroke={line} strokeWidth="2" />}
        <T x={32} y={r.y} anchor="start" size={14} bold colour={shown ? text : muted}>{r.label}</T>
        <T x={180} y={r.y} anchor="start" size={16} bold colour={shown ? ink : muted}>{shown ? r.sum : '?'}</T>
      </g>
    })}
    {stage === 'table' && <T x={270} y={330} size={13} colour={muted}>One bond energy for each kind of bond. Next: count the bonds.</T>}
    {stage === 'subtract' && <T x={270} y={330} size={14} bold colour={amberInk}>bonds broken − bonds made</T>}
    {stage === 'sign' && <g>
      <Chip x={150} y={326} w={240} tone="out" size={13}>negative → exothermic</Chip>
      <Chip x={400} y={326} w={240} tone="in" size={13}>positive → endothermic</Chip>
    </g>}
  </Diagram>
}

// ---------- Worked example set-up: methane burning ----------
function WorkedMethane() {
  return <Diagram viewBox="0 0 540 300" schematic={false} title="Worked example set-up: methane burns, CH₄ + 2O₂ → CO₂ + 2H₂O, drawn as displayed formulae: CH₄ with four C–H bonds, O=O, O=C=O and H–O–H. Bond energies in kJ/mol: C–H 413, O=O 498, C=O 805, O–H 464. Bonds broken, bonds made and the overall change still to find.">
    <Displayed mol={methane(62, 76, 34)} />
    <Plus x={124} y={76} />
    <T x={150} y={83} size={20} bold>2</T>
    <Displayed mol={row(['O', 'O'], [2], 190, 76, 40)} />
    <Yields x={244} y={76} />
    <Displayed mol={row(['O', 'C', 'O'], [2, 2], 316, 76, 38)} />
    <Plus x={376} y={76} />
    <T x={400} y={83} size={20} bold>2</T>
    <Displayed mol={row(['H', 'O', 'H'], [1, 1], 458, 76, 36)} />
    <T x={62} y={140} size={13} colour={muted}>CH₄</T>
    <T x={180} y={140} size={13} colour={muted}>2O₂</T>
    <T x={316} y={140} size={13} colour={muted}>CO₂</T>
    <T x={450} y={140} size={13} colour={muted}>2H₂O</T>
    {[['C–H', '413'], ['O=O', '498'], ['C=O', '805'], ['O–H', '464']].map(([b, v], i) => <Chip key={i} x={78 + i * 128} y={176} w={114} tone="plain" size={14}>{`${b}  ${v}`}</Chip>)}
    <T x={270} y={206} size={12} colour={muted}>bond energies in kJ/mol</T>
    <rect x={20} y={220} width={500} height={70} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <T x={40} y={246} anchor="start" size={14} bold colour={inInk}>bonds broken = ?</T>
    <T x={290} y={246} anchor="start" size={14} bold colour={outInk}>bonds made = ?</T>
    <T x={270} y={276} size={14} bold colour={amberInk}>overall change = bonds broken − bonds made</T>
  </Diagram>
}

// ---------- Section 3: hydrogen with bromine beside hydrogen with iodine ----------
type PStage = 'pair' | 'break' | 'make' | 'together'
const P_TITLES: Record<PStage, string> = {
  pair: 'Two similar reactions side by side: H₂ + Br₂ → 2HBr and H₂ + I₂ → 2HI. Each breaks one H–H bond and one halogen bond, and makes two bonds to hydrogen. Bond energies in kJ/mol: H–H 436, Br–Br 193, H–Br 366, I–I 151, H–I 299.',
  break: 'Blue bars for the energy to break bonds: bromine 629 kJ/mol, iodine 587 kJ/mol. The iodine reaction needs less energy to break its bonds.',
  make: 'Coral bars added for the energy released making bonds: bromine 732 kJ/mol, iodine 598 kJ/mol. The iodine reaction also releases less.',
  together: 'Overall energy changes: bromine 629 − 732 = −103 kJ/mol, iodine 587 − 598 = −11 kJ/mol. Both are exothermic, but the bromine reaction gives out far more energy.',
}
const PAIR = [
  { cx: 140, x: 'Br', name: 'hydrogen + bromine', eq: 'H₂ + Br₂ → 2HBr', xx: 193, hx: 366, brk: 629, mk: 732, total: '−103' },
  { cx: 400, x: 'I', name: 'hydrogen + iodine', eq: 'H₂ + I₂ → 2HI', xx: 151, hx: 299, brk: 587, mk: 598, total: '−11' },
]
const BAR = .26
function CompareScene({ stage }: { stage: PStage }) {
  const showBreak = stage !== 'pair', showMake = stage === 'make' || stage === 'together'
  return <Diagram viewBox="0 0 540 340" title={P_TITLES[stage]}>
    <path d="M270 16V318" stroke={panelLine} strokeWidth="1.5" strokeDasharray="5 5" />
    {PAIR.map((p, k) => {
      const x0 = p.cx - 110, iodine = k === 1
      return <g key={k}>
        <T x={p.cx} y={30} size={15} bold>{p.name}</T>
        <T x={p.cx} y={56} size={17} bold>{p.eq}</T>
        <T x={p.cx} y={80} size={12} colour={muted}>{`H–H 436 · ${p.x}–${p.x} ${p.xx} · H–${p.x} ${p.hx}`}</T>
        {/* break row */}
        <g opacity={stage === 'make' ? .55 : 1}>
          <T x={x0} y={114} anchor="start" size={13} bold colour={inInk}>{showBreak ? 'energy to break bonds' : `break: H–H and ${p.x}–${p.x}`}</T>
          {showBreak && <g>
            <rect x={x0} y={124} width={r1(p.brk * BAR)} height={22} rx="6" fill={inSoft} stroke={inLine} strokeWidth="2" />
            <T x={x0 + 8} y={140} anchor="start" size={13} bold colour={inInk}>{`${p.brk}`}</T>
            {stage === 'break' && <T x={x0} y={164} anchor="start" size={12} colour={muted}>{`436 + ${p.xx}`}</T>}
          </g>}
        </g>
        {/* make row */}
        <g opacity={stage === 'break' ? .35 : 1}>
          <T x={x0} y={196} anchor="start" size={13} bold colour={outInk}>{showMake ? 'energy released making bonds' : `make: 2 × H–${p.x}`}</T>
          {showMake && <g>
            <rect x={x0} y={206} width={r1(p.mk * BAR)} height={22} rx="6" fill={outSoft} stroke={outLine} strokeWidth="2" />
            <T x={x0 + 8} y={222} anchor="start" size={13} bold colour={outInk}>{`${p.mk}`}</T>
            {stage === 'make' && <T x={x0} y={246} anchor="start" size={12} colour={muted}>{`2 × ${p.hx}`}</T>}
          </g>}
        </g>
        {stage === 'pair' && <g>
          <Displayed mol={row(['H', 'H'], [1], x0 + 30, 142, 38)} size={18} tone={inLine} />
          <Displayed mol={row([p.x, p.x], [1], x0 + 124, 142, p.x === 'I' ? 38 : 52)} size={18} tone={inLine} />
          <Displayed mol={row(['H', p.x], [1], x0 + 34, 224, p.x === 'I' ? 38 : 45)} size={18} tone={outLine} />
          <Displayed mol={row(['H', p.x], [1], x0 + 124, 224, p.x === 'I' ? 38 : 45)} size={18} tone={outLine} />
        </g>}
        {iodine && stage === 'break' && <Chip x={p.cx} y={282} w={170} tone="in" size={13}>less to break</Chip>}
        {iodine && stage === 'make' && <Chip x={p.cx} y={282} w={170} tone="out" size={13}>less released too</Chip>}
        {stage === 'together' && <g>
          <Chip x={p.cx} y={278} w={210} tone={iodine ? 'plain' : 'hot'} size={14} h={32}>{`${p.brk} − ${p.mk} = ${p.total}`}</Chip>
          <T x={p.cx} y={312} size={12} colour={muted}>kJ/mol, exothermic</T>
        </g>}
      </g>
    })}
    {stage === 'pair' && <T x={270} y={300} size={14} bold colour={amberInk}>Same pattern, different bond energies</T>}
    {stage === 'together' && <T x={270} y={334} size={13} bold colour={amberInk}>Bromine gives out far more energy. You need the actual numbers.</T>}
  </Diagram>
}

// ---------- Question visuals ----------
function PropaneQuestion({ assessment }: { assessment: boolean }) {
  const m = propane(270, 100)
  const hi: Mol = { atoms: m.atoms, bonds: m.bonds.slice(2) }
  return <Diagram viewBox={`0 0 540 ${assessment ? 196 : 226}`} title={assessment
    ? 'The displayed formula of propane, C₃H₈: three carbon atoms in a chain, with hydrogen atoms joined above, below and at each end.'
    : 'Propane with its eight C–H bonds coloured coral. The two C–C bonds stay black.'}>
    <Displayed mol={m} size={22} />
    {!assessment && <Displayed mol={hi} size={22} tone={outLine} />}
    <T x={270} y={182} size={14} colour={muted}>propane, C₃H₈</T>
    {!assessment && <T x={270} y={212} size={14} bold colour={good}>8 C–H bonds (and 2 C–C bonds)</T>}
  </Diagram>
}
function TotalsTable({ rows, assessment, overall }: { rows: Array<[string, number, number]>; assessment: boolean; overall: number }) {
  const y0 = 24, rh = 44, cols = [36, 200, 346, 470]
  const h = 56 + rows.length * rh
  return <g>
    <rect x={16} y={y0} width={508} height={h} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <T x={cols[0]} y={y0 + 24} anchor="start" size={12} bold colour={muted}>reaction</T>
    <T x={cols[1]} y={y0 + 18} size={12} bold colour={inInk}>energy to break</T>
    <T x={cols[1]} y={y0 + 34} size={12} bold colour={inInk}>bonds (kJ/mol)</T>
    <T x={cols[2]} y={y0 + 18} size={12} bold colour={outInk}>energy released making</T>
    <T x={cols[2]} y={y0 + 34} size={12} bold colour={outInk}>bonds (kJ/mol)</T>
    {!assessment && <T x={cols[3]} y={y0 + 24} size={12} bold colour={good}>overall</T>}
    <path d={`M28 ${y0 + 46}H512`} stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([name, b, m], i) => {
      const y = y0 + 76 + i * rh, ans = !assessment && i === overall, d = b - m
      return <g key={i}>
        {ans && <rect x={24} y={y - 26} width={492} height={38} rx="9" fill={goodSoft} stroke={good} strokeWidth="2" />}
        <T x={cols[0]} y={y} anchor="start" size={16} bold>{name}</T>
        <T x={cols[1]} y={y} size={17} bold>{b}</T>
        <T x={cols[2]} y={y} size={17} bold>{m}</T>
        {!assessment && <T x={cols[3]} y={y} size={16} bold colour={d > 0 ? inInk : outInk}>{`${d > 0 ? '+' : '−'}${Math.abs(d)}`}</T>}
      </g>
    })}
  </g>
}
function AbQuestion({ assessment }: { assessment: boolean }) {
  return <Diagram viewBox={`0 0 540 ${assessment ? 176 : 206}`} schematic={false} title={assessment
    ? 'A table of bond energy totals. Reaction A: 600 kJ/mol to break bonds, 700 kJ/mol released making bonds. Reaction B: 900 kJ/mol to break bonds, 950 kJ/mol released making bonds.'
    : 'The same table with the overall changes: reaction A 600 − 700 = −100 kJ/mol, reaction B 900 − 950 = −50 kJ/mol. Reaction A is highlighted: it gives out more energy overall.'}>
    <TotalsTable rows={[['Reaction A', 600, 700], ['Reaction B', 900, 950]]} assessment={assessment} overall={0} />
    {!assessment && <T x={270} y={196} size={13} bold colour={good}>A gives out 100 kJ/mol, B only 50, though B releases more making bonds.</T>}
  </Diagram>
}
function TableQuestion({ assessment }: { assessment: boolean }) {
  return <Diagram viewBox={`0 0 540 ${assessment ? 220 : 250}`} schematic={false} title={assessment
    ? 'A table of bond energy totals for three reactions. P: 2000 kJ/mol to break bonds and 2400 released making bonds. Q: 1500 and 1300. R: 900 and 1000.'
    : 'The same table with the overall changes: P −400, Q +200, R −100 kJ/mol. Q is highlighted: it is the only positive one, so it is endothermic.'}>
    <TotalsTable rows={[['Reaction P', 2000, 2400], ['Reaction Q', 1500, 1300], ['Reaction R', 900, 1000]]} assessment={assessment} overall={1} />
    {!assessment && <T x={270} y={240} size={13} bold colour={good}>Only Q takes in more energy than it gives out.</T>}
  </Diagram>
}
function PeroxideQuestion({ assessment }: { assessment: boolean }) {
  return <Diagram viewBox={`0 0 540 ${assessment ? 236 : 300}`} schematic={false} title={assessment
    ? 'Hydrogen peroxide decomposing, 2H₂O₂ → 2H₂O + O₂, drawn as displayed formulae: H–O–O–H makes H–O–H and O=O. Bond energies in kJ/mol: O–H 464, O–O 146, O=O 498.'
    : 'The worked answer: bonds broken 2 × ((2 × 464) + 146) = 2148 kJ/mol; bonds made (4 × 464) + 498 = 2354 kJ/mol; overall 2148 − 2354 = −206 kJ/mol, exothermic.'}>
    <T x={28} y={66} size={20} bold>2</T>
    <Displayed mol={row(['H', 'O', 'O', 'H'], [1, 1, 1], 112, 60, 36)} />
    <Yields x={208} y={60} />
    <T x={244} y={66} size={20} bold>2</T>
    <Displayed mol={row(['H', 'O', 'H'], [1, 1], 310, 60, 36)} />
    <Plus x={384} y={60} />
    <Displayed mol={row(['O', 'O'], [2], 450, 60, 44)} />
    <T x={112} y={100} size={13} colour={muted}>2H₂O₂</T>
    <T x={300} y={100} size={13} colour={muted}>2H₂O</T>
    <T x={450} y={100} size={13} colour={muted}>O₂</T>
    {[['O–H', '464'], ['O–O', '146'], ['O=O', '498']].map(([b, v], i) => <Chip key={i} x={110 + i * 160} y={146} w={130} tone="plain" size={15}>{`${b}  ${v}`}</Chip>)}
    <T x={270} y={180} size={12} colour={muted}>bond energies in kJ/mol</T>
    <T x={270} y={214} size={13} colour={muted}>O–O is a single bond between two oxygen atoms.</T>
    {!assessment && <g>
      <T x={30} y={248} anchor="start" size={13} bold colour={inInk}>broken: 2 × ((2 × 464) + 146) = 2148</T>
      <T x={30} y={270} anchor="start" size={13} bold colour={outInk}>made: (4 × 464) + 498 = 2354</T>
      <T x={30} y={292} anchor="start" size={13} bold colour={good}>overall: 2148 − 2354 = −206 kJ/mol, exothermic</T>
    </g>}
  </Diagram>
}
function WorkingQuestion({ assessment }: { assessment: boolean }) {
  const lines = ['Bonds broken: (2 × 1077) + 498 = 2652', 'Bonds made: 2 × 805 = 1610', 'Energy change: 2652 − 1610 = +1042 kJ/mol', 'So the reaction is endothermic.']
  return <Diagram viewBox={`0 0 540 ${assessment ? 270 : 326}`} schematic={false} title={assessment
    ? 'A student’s working for 2CO + O₂ → 2CO₂ with bond energies C≡O 1077, O=O 498 and C=O 805 kJ/mol, in four numbered lines. Line 1: bonds broken (2 × 1077) + 498 = 2652. Line 2: bonds made 2 × 805 = 1610. Line 3: energy change 2652 − 1610 = +1042 kJ/mol. Line 4: so the reaction is endothermic.'
    : 'The student’s working with line 2 marked wrong. Each CO₂ molecule, O=C=O, has two C=O bonds, so 2CO₂ has four: bonds made = 4 × 805 = 3220. The energy change is 2652 − 3220 = −568 kJ/mol, exothermic.'}>
    <T x={270} y={28} size={17} bold>2CO + O₂ <tspan fill={muted}>→</tspan> 2CO₂</T>
    <T x={270} y={52} size={13} colour={muted}>bond energies (kJ/mol): C≡O 1077 · O=O 498 · C=O 805</T>
    <rect x={20} y={66} width={500} height={192} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    {lines.map((l, i) => {
      const y = 106 + i * 44, wrong = !assessment && i === 1
      return <g key={i}>
        {wrong && <rect x={28} y={y - 26} width={484} height={38} rx="8" fill={badSoft} stroke={bad} strokeWidth="1.5" />}
        <Num n={i + 1} x={52} y={y - 6} colour={wrong ? bad : ink} />
        <T x={78} y={y} anchor="start" size={16} bold colour={wrong ? bad : ink}>{l}</T>
      </g>
    })}
    {!assessment && <g>
      <T x={20} y={288} anchor="start" size={13} bold colour={good}>Each O=C=O has 2 C=O bonds, so 2CO₂ has 4: 4 × 805 = 3220.</T>
      <T x={20} y={312} anchor="start" size={13} bold colour={good}>2652 − 3220 = −568 kJ/mol, so it is exothermic.</T>
    </g>}
  </Diagram>
}

export function HigherBondEnergyVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'hbond-bond-rearrange': return <BondScene stage="rearrange" />
    case 'hbond-bond-break': return <BondScene stage="break" />
    case 'hbond-bond-make': return <BondScene stage="make" />
    case 'hbond-bond-compare': return <BondScene stage="compare" />
    case 'hbond-bond-together': return <LevelsTogether />
    case 'hbond-calc-table': return <CalcScene stage="table" />
    case 'hbond-calc-broken': return <CalcScene stage="broken" />
    case 'hbond-calc-made': return <CalcScene stage="made" />
    case 'hbond-calc-subtract': return <CalcScene stage="subtract" />
    case 'hbond-calc-sign': return <CalcScene stage="sign" />
    case 'hbond-compare-pair': return <CompareScene stage="pair" />
    case 'hbond-compare-break': return <CompareScene stage="break" />
    case 'hbond-compare-make': return <CompareScene stage="make" />
    case 'hbond-compare-together': return <CompareScene stage="together" />
    case 'hbond-worked-methane': return <WorkedMethane />
    case 'hbond-q-propane': return <PropaneQuestion assessment={assessment} />
    case 'hbond-q-ab': return <AbQuestion assessment={assessment} />
    case 'hbond-q-table': return <TableQuestion assessment={assessment} />
    case 'hbond-q-peroxide': return <PeroxideQuestion assessment={assessment} />
    case 'hbond-q-arrows': return <ArrowsQuestion assessment={assessment} />
    case 'hbond-q-working': return <WorkingQuestion assessment={assessment} />
    default: return <BondScene stage="rearrange" />
  }
}
