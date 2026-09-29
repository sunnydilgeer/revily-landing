import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C1a (Chemistry Lesson 2): compounds, formulas and chemical equations. Original, code-native schematics; not to scale.
 * Focus ids start with 'cmpd-'.
 *
 * Atoms are drawn as simple ball-and-stick models: one soft-filled circle per atom with its symbol inside and a darker
 * stroke of the same hue, joined by short grey sticks (chemical bonds). One colour per element, the same everywhere:
 *   H white · C dark grey · O soft red · N blue · Cl green · S yellow · Mg teal · Ar lilac
 * Ink, muted greys and panels come from the Chemistry palette in AtomVisuals.tsx. Amber marks the thing that has just
 * changed (a new number in front, a highlighted bond); green = matches, red = does not match.
 * Every drawn molecule is real and every equation's atom counts are correct.
 */
const { ink, muted, panelFill, panelLine, space, spaceLine } = atomPalette
const amber = '#d98a1c', amberSoft = '#fdf0dc', good = '#3f8a5f', goodSoft = '#e3f3e8', bad = '#c0504a', badSoft = '#fbe6e4', bondLine = '#7d8a94'
const faded = 0.35

type El = 'H' | 'C' | 'O' | 'N' | 'Cl' | 'S' | 'Mg' | 'Ar'
const EL: Record<El, { fill: string; line: string; text: string; r: number; name: string }> = {
  H: { fill: '#ffffff', line: '#8d9ba6', text: '#375a73', r: 12, name: 'hydrogen' },
  C: { fill: '#5f6b75', line: '#3c464e', text: '#ffffff', r: 16, name: 'carbon' },
  O: { fill: '#f2a39b', line: '#c0625a', text: '#6e2621', r: 16, name: 'oxygen' },
  N: { fill: '#9dbfec', line: '#4a78b8', text: '#1f3f6b', r: 16, name: 'nitrogen' },
  Cl: { fill: '#b2dea6', line: '#5a9a4c', text: '#2c5a22', r: 17, name: 'chlorine' },
  S: { fill: '#f6dc7c', line: '#b8962a', text: '#5e4a0c', r: 17, name: 'sulfur' },
  Mg: { fill: '#bfe3e0', line: '#4f9690', text: '#1f4f4b', r: 17, name: 'magnesium' },
  Ar: { fill: '#e6d2f0', line: '#9a6bb0', text: '#523063', r: 16, name: 'argon' },
}
const r1 = (n: number) => Math.round(n * 10) / 10

// Molecules at scale 1: atom positions (px from the centre) and bonds (index pairs). Bond length = rA + rB + 8.
type Spec = { atoms: Array<[El, number, number]>; bonds: Array<[number, number]> }
const pair = (el: El): Spec => { const d = EL[el].r + 4; return { atoms: [[el, -d, 0], [el, d, 0]], bonds: [[0, 1]] } }
const MOL: Record<string, Spec> = {
  H2: pair('H'), O2: pair('O'), N2: pair('N'), Cl2: pair('Cl'),
  HCl: { atoms: [['H', -18, 0], ['Cl', 19, 0]], bonds: [[0, 1]] },
  H2O: { atoms: [['O', 0, -8], ['H', -28.4, 14.2], ['H', 28.4, 14.2]], bonds: [[0, 1], [0, 2]] },
  CO2: { atoms: [['O', -40, 0], ['C', 0, 0], ['O', 40, 0]], bonds: [[0, 1], [1, 2]] },
  CO: { atoms: [['C', -20, 0], ['O', 20, 0]], bonds: [[0, 1]] },
  NH3: { atoms: [['N', 0, -6], ['H', -36, -6], ['H', 36, -6], ['H', 0, 30]], bonds: [[0, 1], [0, 2], [0, 3]] },
  NO2: { atoms: [['N', 0, -10], ['O', -34.6, 10], ['O', 34.6, 10]], bonds: [[0, 1], [0, 2]] },
  OH: { atoms: [['O', -10, 0], ['H', 26, 0]], bonds: [[0, 1]] },
  C: { atoms: [['C', 0, 0]], bonds: [] }, Ar: { atoms: [['Ar', 0, 0]], bonds: [] }, Mg: { atoms: [['Mg', 0, 0]], bonds: [] },
}
const molHeight = (f: string) => { const s = MOL[f]; return Math.max(...s.atoms.map(([el, , y]) => y + EL[el].r)) - Math.min(...s.atoms.map(([el, , y]) => y - EL[el].r)) }

function Ball({ el, x, y, s = 1 }: { el: El; x: number; y: number; s?: number }) {
  const e = EL[el], small = e.r * s < 11, size = small ? 12 : Math.round((el.length > 1 ? 13 : 14) * Math.max(1, Math.min(1.5, s)))
  return <g data-atom={el}><circle cx={r1(x)} cy={r1(y)} r={r1(e.r * s)} fill={e.fill} stroke={e.line} strokeWidth="1.8" />
    {e.r * s >= 8 && <text x={r1(x)} y={r1(y + size * .36)} textAnchor="middle" fontSize={size} fontWeight="700" fill={e.text}>{el}</text>}</g>
}
function Molecule({ f, x, y, s = 1, rs = s, bondColour = bondLine, bondWidth = 4 }: { f: string; x: number; y: number; s?: number; rs?: number; bondColour?: string; bondWidth?: number }) {
  const spec = MOL[f]
  return <g>
    {spec.bonds.map(([a, b], i) => <path key={i} d={`M${r1(x + spec.atoms[a][1] * s)} ${r1(y + spec.atoms[a][2] * s)}L${r1(x + spec.atoms[b][1] * s)} ${r1(y + spec.atoms[b][2] * s)}`} stroke={bondColour} strokeWidth={bondWidth} />)}
    {spec.atoms.map(([el, dx, dy], i) => <Ball key={i} el={el} x={x + dx * s} y={y + dy * s} s={rs} />)}
  </g>
}

/** A formula with real subscripts: "Mg(OH)2" → Mg(OH)₂. Digits after a letter or ')' are drawn small and low. */
function Formula({ f, size = 22, colour = ink, subColour, coef, coefColour = amber }: { f: string; size?: number; colour?: string; subColour?: string; coef?: number; coefColour?: string }) {
  const parts = f.match(/[A-Z][a-z]?|\d+|[()]/g) ?? []
  const sub = Math.max(13, Math.round(size * .68)), drop = r1(size * .3)
  const out: ReactNode[] = []
  if (coef && coef > 1) out.push(<tspan key="coef" fill={coefColour}>{coef}</tspan>)
  let low = false
  parts.forEach((p, i) => {
    const digit = /^\d+$/.test(p)
    if (digit) { out.push(<tspan key={i} dy={drop} fontSize={sub} fill={subColour ?? colour}>{p}</tspan>); low = true }
    else { out.push(<tspan key={i} dy={low ? -drop : undefined}>{p}</tspan>); low = false }
  })
  if (low) out.push(<tspan key="end" dy={-drop}>{'​'}</tspan>)
  return <tspan fill={colour} fontSize={size}>{out}</tspan>
}

function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}

// ---------- Numbered key (as in the atom lesson) ----------
type Mode = 'on' | 'active' | 'off'
function Num({ n, x, y, mode, colour = ink }: { n: number | string; x: number; y: number; mode: Mode; colour?: string }) {
  const active = mode === 'active'
  return <g opacity={mode === 'off' ? .42 : 1}>
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
function RightArrow({ x1, x2, y, colour = ink }: { x1: number; x2: number; y: number; colour?: string }) {
  return <g><path d={`M${x1} ${y}H${x2 - 4}`} stroke={colour} strokeWidth="3" /><path d={`M${x2 - 12} ${y - 8}L${x2} ${y}L${x2 - 12} ${y + 8}`} fill="none" stroke={colour} strokeWidth="3" /></g>
}
function Tick({ x, y, ok }: { x: number; y: number; ok: boolean }) {
  return ok ? <path d={`M${x - 7} ${y}L${x - 2} ${y + 5}L${x + 8} ${y - 6}`} fill="none" stroke={good} strokeWidth="3" />
    : <path d={`M${x - 6} ${y - 6}L${x + 6} ${y + 6}M${x + 6} ${y - 6}L${x - 6} ${y + 6}`} stroke={bad} strokeWidth="3" />
}

// ---------- Section 1: what is a compound? One water story, a numbered key on the right ----------
const COMPOUND_STEPS: Record<string, number> = { 'cmpd-compound-new': 1, 'cmpd-compound-compound': 2, 'cmpd-compound-fixed': 3, 'cmpd-compound-bonds': 4, 'cmpd-compound-split': 5, 'cmpd-compound-all': 6 }
const COMPOUND_KEY = [['new substance'], ['compound'], ['fixed proportions'], ['chemical bonds'], ['split only by a', 'chemical reaction']]
const COMPOUND_TITLES = [
  '',
  'Step 1: a box of hydrogen molecules (pairs of H atoms) and oxygen molecules (pairs of O atoms) reacts to make a box of water molecules, a new substance. The reaction gets hot: an energy change.',
  'Step 2: one water molecule, enlarged. It has 2 hydrogen atoms and 1 oxygen atom joined together: atoms of two different elements, so water is a compound.',
  'Step 3: three water molecules, from a tap, a river and a cloud. Each has 2 hydrogen atoms for every 1 oxygen atom: fixed proportions.',
  'Step 4: the water molecule again, with its two bonds highlighted. The lines joining the atoms are chemical bonds that hold them together.',
  'Step 5: boiling water only makes steam, which is still water molecules. A chemical reaction is needed to split water into hydrogen and oxygen.',
  'Water, a compound: made by a reaction, atoms of two elements, 2 hydrogen to 1 oxygen, held by chemical bonds, split only by a chemical reaction.',
]
function CompoundBuild({ focus }: { focus: string }) {
  const step = COMPOUND_STEPS[focus] ?? 6
  const keyMode = (n: number): Mode => step === 6 ? 'on' : n === step ? 'active' : n < step ? 'on' : 'off'
  const kx = 376
  return <Diagram viewBox="0 0 540 300" title={COMPOUND_TITLES[step]}>
    <path d="M356 22V278" stroke={panelLine} strokeWidth="2" strokeDasharray="5 5" />
    {COMPOUND_KEY.map((lines, i) => <KeyRow key={i} n={i + 1} x={kx} y={42 + i * 52} lines={lines} mode={keyMode(i + 1)} colour={amber} />)}
    {step === 1 && <NewSubstance />}
    {(step === 2 || step === 4 || step === 6) && <BigWater bonds={step === 4} whole={step === 6} />}
    {step === 3 && <FixedWater />}
    {step === 5 && <SplitWater />}
  </Diagram>
}
function Box({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) {
  return <g><rect x={x} y={y} width={w} height={h} rx="12" fill={space} stroke={spaceLine} strokeWidth="1.5" /><text x={x + w / 2} y={y - 10} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{label}</text></g>
}
function NewSubstance() {
  // 4 H2 + 2 O2 → 4 H2O: 8 H and 4 O on both sides.
  const before: Array<[string, number, number]> = [['H2', 58, 76], ['O2', 110, 104], ['H2', 54, 140], ['H2', 112, 172], ['O2', 56, 206], ['H2', 108, 232]]
  const after: Array<[string, number, number]> = [['H2O', 240, 88], ['H2O', 300, 126], ['H2O', 238, 170], ['H2O', 298, 216]]
  return <g>
    <Box x={14} y={48} w={140} h={210} label="hydrogen + oxygen" />
    <Box x={200} y={48} w={140} h={210} label="water" />
    {before.map(([f, x, y], i) => <Molecule key={i} f={f} x={x} y={y} s={.8} />)}
    {after.map(([f, x, y], i) => <Molecule key={i} f={f} x={x} y={y} s={.8} />)}
    <RightArrow x1={160} x2={194} y={150} />
    <text x={270} y={284} textAnchor="middle" fontSize="14" fontWeight="700" fill={amber}>a new substance</text>
    <g><rect x={24} y={268} width={120} height={24} rx="12" fill={amberSoft} stroke={amber} strokeWidth="1.5" /><text x={84} y={285} textAnchor="middle" fontSize="13" fontWeight="700" fill={amber}>gets hot</text></g>
  </g>
}
function BigWater({ bonds, whole }: { bonds: boolean; whole: boolean }) {
  const cx = 176, cy = 128, s = 2.9, rs = 1.75
  const o: [number, number] = [cx, r1(cy - 8 * s)], hl: [number, number] = [r1(cx - 28.4 * s), r1(cy + 14.2 * s)], hr: [number, number] = [r1(cx + 28.4 * s), r1(cy + 14.2 * s)]
  const mid = (a: [number, number], b: [number, number]): [number, number] => [r1((a[0] + b[0]) / 2), r1((a[1] + b[1]) / 2)]
  return <g>
    <circle cx={cx} cy={cy + 6} r="118" fill={space} stroke={spaceLine} strokeWidth="1.5" />
    <Molecule f="H2O" x={cx} y={cy} s={s} rs={rs} bondColour={bonds ? amber : bondLine} bondWidth={bonds ? 10 : 8} />
    {!bonds && <g fontSize="14" fontWeight="700" fill={ink}>
      <text x={cx + 44} y={48}>oxygen atom</text>
      <path d={`M${cx + 40} 44L${cx + 22} ${o[1] - 18}`} stroke={ink} strokeWidth="1.5" />
      <text x={hl[0]} y={hl[1] + 50} textAnchor="middle">hydrogen atom</text>
      <text x={hr[0]} y={hr[1] + 50} textAnchor="middle">hydrogen atom</text>
    </g>}
    {bonds && <g fontSize="15" fontWeight="700" fill={amber}>
      <text x={24} y={70}>chemical</text><text x={24} y={88}>bond</text>
      <path d={`M60 94L${mid(o, hl)[0] - 6} ${mid(o, hl)[1] - 6}`} stroke={amber} strokeWidth="1.5" />
      <text x={330} y={70} textAnchor="end">chemical</text><text x={330} y={88} textAnchor="end">bond</text>
      <path d={`M294 94L${mid(o, hr)[0] + 6} ${mid(o, hr)[1] - 6}`} stroke={amber} strokeWidth="1.5" />
    </g>}
    {whole ? <g>
      <text x={cx} y={274} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>water: a compound</text>
      <text x={cx} y={293} textAnchor="middle" fontSize="13" fill={ink}>2 H : 1 O, held by chemical bonds</text>
    </g> : <text x={cx} y={290} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{bonds ? 'bonds hold the atoms together' : 'atoms of 2 elements joined: a compound'}</text>}
  </g>
}
function FixedWater() {
  return <g>
    {[['tap', 60], ['river', 176], ['cloud', 292]].map(([where, x]) => <g key={where}>
      <rect x={Number(x) - 53} y={60} width={106} height={150} rx="12" fill={space} stroke={spaceLine} strokeWidth="1.5" />
      <text x={Number(x)} y={48} textAnchor="middle" fontSize="14" fontWeight="700" fill={muted}>{where}</text>
      <Molecule f="H2O" x={Number(x)} y={116} s={1.15} />
      <text x={Number(x)} y={182} textAnchor="middle" fontSize="15" fontWeight="700" fill={amber}>2 H : 1 O</text>
    </g>)}
    <text x={176} y={250} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>always 2 hydrogen atoms</text>
    <text x={176} y={270} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>for every 1 oxygen atom</text>
  </g>
}
function SplitWater() {
  return <g>
    <Molecule f="H2O" x={50} y={150} s={1.1} />
    <text x={50} y={196} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>water</text>
    <path d="M92 130Q110 84 140 80" fill="none" stroke={ink} strokeWidth="2.5" /><path d="M130 72L142 80L130 88" fill="none" stroke={ink} strokeWidth="2.5" />
    <path d="M92 170Q110 216 140 220" fill="none" stroke={ink} strokeWidth="2.5" /><path d="M130 212L142 220L130 228" fill="none" stroke={ink} strokeWidth="2.5" />
    <text x={96} y={70} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>boil</text>
    <text x={96} y={246} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>react</text>
    <rect x={150} y={30} width={190} height={104} rx="12" fill={badSoft} stroke={bad} strokeWidth="1.5" />
    <Molecule f="H2O" x={194} y={62} s={.8} /><Molecule f="H2O" x={296} y={62} s={.8} /><Molecule f="H2O" x={245} y={92} s={.8} />
    <text x={245} y={127} textAnchor="middle" fontSize="13" fontWeight="700" fill={bad}>steam: still water</text>
    <rect x={150} y={168} width={190} height={96} rx="12" fill={goodSoft} stroke={good} strokeWidth="1.5" />
    <Molecule f="H2" x={196} y={200} s={.85} /><Molecule f="H2" x={196} y={230} s={.85} /><Molecule f="O2" x={290} y={214} s={.85} />
    <text x={245} y={256} textAnchor="middle" fontSize="13" fontWeight="700" fill={good}>hydrogen + oxygen</text>
    <text x={245} y={290} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>only a reaction splits a compound</text>
  </g>
}

// ---------- Section 2: formulas ----------
function FormulaCO2({ focus }: { focus: string }) {
  const numbers = focus === 'cmpd-formula-number'
  return <Diagram viewBox="0 0 540 290" title={numbers ? 'The formula CO₂ with its small 2 highlighted. The 2 comes after O, so there are 2 oxygen atoms. There is no number after C, so there is 1 carbon atom. Below, a carbon dioxide molecule: one carbon atom joined to two oxygen atoms.' : 'The formula of carbon dioxide, CO₂, written large. The symbol C stands for carbon and O for oxygen. Below, a carbon dioxide molecule: one carbon atom joined to two oxygen atoms.'}>
    <text x={270} y={78} textAnchor="middle" fontWeight="700"><Formula f="CO" size={64} /><tspan dy={19} fontSize={44} fill={numbers ? amber : ink}>2</tspan></text>
    {numbers && <rect x={303} y={60} width={34} height={42} rx="8" fill="none" stroke={amber} strokeWidth="2.5" />}
    <Molecule f="CO2" x={270} y={170} s={1.7} />
    {!numbers && <g fontSize="15" fontWeight="700">
      <text x={160} y={62} textAnchor="end" fill={EL.C.line}>C = carbon</text>
      <path d="M168 57H214" stroke={muted} strokeWidth="1.5" strokeDasharray="4 4" />
      <text x={372} y={62} fill={EL.O.line}>O = oxygen</text>
      <path d="M364 57H330" stroke={muted} strokeWidth="1.5" strokeDasharray="4 4" />
      <text x={270} y={250} textAnchor="middle" fill={ink}>the symbols show which elements</text>
      <text x={270} y={272} textAnchor="middle" fontSize="14" fontWeight="600" fill={muted}>carbon dioxide</text>
    </g>}
    {numbers && <g fontSize="14" fontWeight="700">
      <text x={202} y={226} textAnchor="middle" fill={amber}>oxygen</text>
      <text x={270} y={226} textAnchor="middle" fill={ink}>carbon</text>
      <text x={338} y={226} textAnchor="middle" fill={amber}>oxygen</text>
      <text x={270} y={262} textAnchor="middle" fontSize="15"><tspan fill={amber}>small 2: 2 oxygen atoms</tspan><tspan fill={ink}> · no number: 1 carbon atom</tspan></text>
    </g>}
  </Diagram>
}
function Pairs() {
  const items: Array<[string, string]> = [['O2', 'oxygen'], ['H2', 'hydrogen'], ['N2', 'nitrogen'], ['Cl2', 'chlorine']]
  return <Diagram viewBox="0 0 540 250" title="Four elements made of pairs of atoms: oxygen O₂, hydrogen H₂, nitrogen N₂ and chlorine Cl₂. Each pair of joined atoms is a molecule, with only one kind of atom in it.">
    {items.map(([f, name], i) => {
      const x = 76 + i * 130
      return <g key={f}>
        <rect x={x - 56} y={24} width={112} height={150} rx="12" fill={space} stroke={spaceLine} strokeWidth="1.5" />
        <Molecule f={f} x={x} y={74} s={1.15} />
        <text x={x} y={138} textAnchor="middle" fontWeight="700"><Formula f={f} size={26} /></text>
        <text x={x} y={162} textAnchor="middle" fontSize="14" fill={ink}>{name}</text>
      </g>
    })}
    <text x={270} y={206} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>atoms joined together = a <tspan fill={amber}>molecule</tspan></text>
    <text x={270} y={228} textAnchor="middle" fontSize="14" fill={muted}>one kind of atom in each, so these are still elements</text>
  </Diagram>
}
function Brackets() {
  const rows: Array<[El, string, string]> = [['Mg', '1', 'outside the bracket'], ['O', '2', '2 × 1 inside'], ['H', '2', '2 × 1 inside']]
  return <Diagram viewBox="0 0 540 290" title="The formula of magnesium hydroxide, Mg(OH)₂. The 2 after the bracket doubles everything inside it. Below: 1 magnesium atom and two OH groups, each an oxygen atom joined to a hydrogen atom. A table counts 1 magnesium, 2 oxygen and 2 hydrogen atoms: 5 atoms in all.">
    <text x={270} y={60} textAnchor="middle" fontWeight="700"><Formula f="Mg(OH)" size={44} /><tspan dy={13} fontSize={30} fill={amber}>2</tspan></text>
    <Ball el="Mg" x={46} y={170} />
    <Molecule f="OH" x={128} y={148} /><Molecule f="OH" x={128} y={192} />
    <path d="M96 128Q88 170 96 212M176 128Q184 170 176 212" fill="none" stroke={amber} strokeWidth="2.5" />
    <text x={192} y={176} fontSize="18" fontWeight="700" fill={amber}>× 2</text>
    <rect x={250} y={100} width={276} height={140} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={278} y={124} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>atom</text><text x={344} y={124} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>number</text>
    <path d="M260 134H516" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([el, n, why], i) => <g key={el}>
      <Ball el={el} x={278} y={156 + i * 30} s={.8} />
      <text x={344} y={161 + i * 30} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{n}</text>
      <text x={378} y={161 + i * 30} fontSize="13" fill={muted}>{why}</text>
    </g>)}
    <text x={388} y={270} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>1 + 2 + 2 = 5 atoms</text>
  </Diagram>
}
function Common() {
  const tiles: Array<[string, string]> = [['H2O', 'water'], ['CO2', 'carbon dioxide'], ['NaCl', 'sodium chloride'], ['HCl', 'hydrogen chloride'], ['NH3', 'ammonia'], ['CH4', 'methane']]
  return <Diagram viewBox="0 0 540 250" schematic={false} title="Six formulas worth knowing on tiles: water H₂O, carbon dioxide CO₂, sodium chloride NaCl, hydrogen chloride HCl, ammonia NH₃ and methane CH₄.">
    {tiles.map(([f, name], i) => {
      const x = 22 + (i % 3) * 170, y = 16 + Math.floor(i / 3) * 112
      return <g key={f}>
        <rect x={x} y={y} width={156} height={98} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="2" />
        <text x={x + 78} y={y + 52} textAnchor="middle" fontWeight="700"><Formula f={f} size={32} /></text>
        <text x={x + 78} y={y + 80} textAnchor="middle" fontSize="14" fill={ink}>{name}</text>
      </g>
    })}
  </Diagram>
}

// ---------- Section 3: word and symbol equations (hydrogen + chlorine → hydrogen chloride) ----------
const EQ_STEPS: Record<string, number> = { 'cmpd-equation-word': 0, 'cmpd-equation-reactants': 1, 'cmpd-equation-products': 2, 'cmpd-equation-symbol': 3 }
const EQ_TITLES = [
  'The word equation hydrogen + chlorine → hydrogen chloride. The arrow means “react to make”. Under each name is a model: a hydrogen molecule, a chlorine molecule and a hydrogen chloride molecule.',
  'The same word equation with the left side highlighted: hydrogen and chlorine, the chemicals that react, are the reactants.',
  'The same word equation with the right side highlighted: hydrogen chloride, the new substance made, is the product.',
  'Under the word equation is the symbol equation H₂ + Cl₂ → HCl. The left side has 2 H and 2 Cl atoms; the right side has only 1 H and 1 Cl, so it does not balance yet.',
]
function Equations({ focus }: { focus: string }) {
  const step = EQ_STEPS[focus] ?? 3
  const xs = { a: 72, plus: 150, b: 222, arrowFrom: 292, arrowTo: 340, c: 440 }
  const leftOp = step === 2 ? faded : 1, rightOp = step === 1 ? faded : 1
  return <Diagram viewBox="0 0 540 320" title={EQ_TITLES[step]}>
    <g opacity={leftOp}>
      {step === 1 && <rect x={16} y={20} width={262} height={160} rx="12" fill={amberSoft} stroke={amber} strokeWidth="1.5" />}
      <text x={xs.a} y={58} textAnchor="middle" fontSize="19" fontWeight="700" fill={ink}>hydrogen</text>
      <text x={xs.plus} y={58} textAnchor="middle" fontSize="22" fontWeight="700" fill={ink}>+</text>
      <text x={xs.b} y={58} textAnchor="middle" fontSize="19" fontWeight="700" fill={ink}>chlorine</text>
      <Molecule f="H2" x={xs.a} y={112} /><Molecule f="Cl2" x={xs.b} y={112} />
      {step !== 0 && <text x={147} y={166} textAnchor="middle" fontSize="15" fontWeight="700" fill={step === 1 ? amber : muted}>reactants</text>}
    </g>
    <RightArrow x1={xs.arrowFrom} x2={xs.arrowTo} y={52} />
    {step === 0 && <text x={316} y={86} textAnchor="middle" fontSize="13" fontWeight="700" fill={amber}><tspan x={316}>react</tspan><tspan x={316} dy={16}>to make</tspan></text>}
    <g opacity={rightOp}>
      {step === 2 && <rect x={356} y={20} width={168} height={160} rx="12" fill={amberSoft} stroke={amber} strokeWidth="1.5" />}
      <text x={xs.c} y={48} textAnchor="middle" fontSize="19" fontWeight="700" fill={ink}>hydrogen</text>
      <text x={xs.c} y={70} textAnchor="middle" fontSize="19" fontWeight="700" fill={ink}>chloride</text>
      <Molecule f="HCl" x={xs.c} y={112} />
      {step >= 2 && <text x={xs.c} y={166} textAnchor="middle" fontSize="15" fontWeight="700" fill={step === 2 ? amber : muted}>product</text>}
    </g>
    {step === 0 && <text x={270} y={226} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>names of the chemicals: a word equation</text>}
    {step === 3 && <g>
      <rect x={16} y={192} width={508} height={112} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
      <text x={xs.a} y={232} textAnchor="middle" fontWeight="700"><Formula f="H2" size={26} /></text>
      <text x={xs.plus} y={232} textAnchor="middle" fontSize="24" fontWeight="700" fill={ink}>+</text>
      <text x={xs.b} y={232} textAnchor="middle" fontWeight="700"><Formula f="Cl2" size={26} /></text>
      <RightArrow x1={xs.arrowFrom} x2={xs.arrowTo} y={224} />
      <text x={xs.c} y={232} textAnchor="middle" fontWeight="700"><Formula f="HCl" size={26} /></text>
      <text x={147} y={270} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>2 H, 2 Cl</text>
      <text x={xs.c} y={270} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>1 H, 1 Cl</text>
      <text x={270} y={294} textAnchor="middle" fontSize="14" fontWeight="700" fill={bad}>formulas: a symbol equation (not balanced yet)</text>
    </g>}
    {step !== 3 && step !== 0 && <text x={270} y={226} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{step === 1 ? 'left of the arrow: what reacts' : 'right of the arrow: what is made'}</text>}
  </Diagram>
}

// ---------- Section 4: balancing. Balls for every molecule, and an atom-count table that updates ----------
type Term = { f: string; n: number; changed?: boolean }
const countAtoms = (terms: Term[]) => {
  const c: Partial<Record<El, number>> = {}
  for (const t of terms) for (const [el] of MOL[t.f].atoms) c[el] = (c[el] ?? 0) + t.n
  return c
}
function slots(n: number, from: number, to: number) { return Array.from({ length: n }, (_, i) => r1(from + (to - from) * (i + .5) / n)) }
/** Draws one symbol equation, its molecules (a stack of n copies under each formula) and the atom counts on each side. */
function BalanceEquation({ left, right, elements, y = 0, s = 1, table = true, rowGap = 44, eqY = 40, ballsY = 110, tableY = 172 }: { left: Term[]; right: Term[]; elements: El[]; y?: number; s?: number; table?: boolean; rowGap?: number; eqY?: number; ballsY?: number; tableY?: number }) {
  const lx = slots(left.length, 20, 290), rx = slots(right.length, 340, 520)
  const lc = countAtoms(left), rc = countAtoms(right)
  const term = (t: Term, x: number, i: number) => <g key={`${t.f}-${i}`}>
    <text x={x} y={y + eqY} textAnchor="middle" fontWeight="700"><Formula f={t.f} size={26} coef={t.n} coefColour={t.changed ? amber : ink} /></text>
    {t.changed && <rect x={x - 46} y={y + eqY - 28} width={92} height={40} rx="8" fill="none" stroke={amber} strokeWidth="2" />}
    {Array.from({ length: t.n }, (_, k) => <Molecule key={k} f={t.f} x={x} y={y + ballsY + (k - (t.n - 1) / 2) * rowGap} s={s} />)}
  </g>
  return <g>
    {left.map((t, i) => term(t, lx[i], i))}
    {lx.slice(1).map((x, i) => <text key={i} x={r1((x + lx[i]) / 2)} y={y + eqY} textAnchor="middle" fontSize="24" fontWeight="700" fill={ink}>+</text>)}
    <RightArrow x1={296} x2={334} y={y + eqY - 8} />
    {right.map((t, i) => term(t, rx[i], i))}
    {rx.slice(1).map((x, i) => <text key={i} x={r1((x + rx[i]) / 2)} y={y + eqY} textAnchor="middle" fontSize="24" fontWeight="700" fill={ink}>+</text>)}
    {table && <g>
      <rect x={90} y={y + tableY} width={360} height={36 + elements.length * 28} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
      <text x={150} y={y + tableY + 23} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>atom</text>
      <text x={250} y={y + tableY + 23} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>left side</text>
      <text x={350} y={y + tableY + 23} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>right side</text>
      <path d={`M100 ${y + tableY + 32}H440`} stroke={panelLine} strokeWidth="1.5" />
      {elements.map((el, i) => {
        const ry = y + tableY + 55 + i * 28, a = lc[el] ?? 0, b = rc[el] ?? 0
        return <g key={el}>
          <Ball el={el} x={150} y={ry - 5} s={.72} />
          <text x={250} y={ry} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{a}</text>
          <text x={350} y={ry} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{b}</text>
          <Tick x={414} y={ry - 5} ok={a === b} />
        </g>
      })}
    </g>}
  </g>
}
function Balance({ focus }: { focus: string }) {
  const balanced = focus === 'cmpd-balance-front'
  return <Diagram viewBox="0 0 540 300" title={balanced ? 'The balanced equation H₂ + Cl₂ → 2HCl. The new 2 in front of HCl means two hydrogen chloride molecules. The table shows 2 H and 2 Cl on the left and 2 H and 2 Cl on the right: every atom matches.' : 'The symbol equation H₂ + Cl₂ → HCl with a model of each molecule. The table shows 2 H and 2 Cl atoms on the left but only 1 H and 1 Cl on the right: the atoms do not match, so it is not balanced.'}>
    <BalanceEquation left={[{ f: 'H2', n: 1 }, { f: 'Cl2', n: 1 }]} right={[{ f: 'HCl', n: balanced ? 2 : 1, changed: balanced }]} elements={['H', 'Cl']} />
    <text x={270} y={290} textAnchor="middle" fontSize="15" fontWeight="700" fill={balanced ? good : bad}>{balanced ? 'every atom matches: balanced' : 'the atoms do not match: not balanced'}</text>
  </Diagram>
}
function NeverChange() {
  return <Diagram viewBox="0 0 540 300" title="Two ways to try to balance H₂ + Cl₂ → HCl. Wrong: changing HCl to H₂Cl₂, crossed out, because that is a different substance. Right: writing 2HCl, two molecules of hydrogen chloride, with a number in front.">
    <rect x={20} y={20} width={240} height={236} rx="12" fill={badSoft} stroke={bad} strokeWidth="1.5" />
    <text x={140} y={50} textAnchor="middle" fontSize="15" fontWeight="700" fill={bad}>change the formula</text>
    <text x={140} y={104} textAnchor="middle" fontWeight="700"><Formula f="H2Cl2" size={34} colour={ink} subColour={bad} /></text>
    <path d="M86 84L194 112" stroke={bad} strokeWidth="3.5" />
    <text x={140} y={150} textAnchor="middle" fontSize="14" fill={ink}>not hydrogen chloride:</text>
    <text x={140} y={170} textAnchor="middle" fontSize="14" fill={ink}>a different substance</text>
    <Tick x={140} y={214} ok={false} />
    <rect x={280} y={20} width={240} height={236} rx="12" fill={goodSoft} stroke={good} strokeWidth="1.5" />
    <text x={400} y={50} textAnchor="middle" fontSize="15" fontWeight="700" fill={good}>number in front</text>
    <text x={400} y={104} textAnchor="middle" fontWeight="700"><Formula f="HCl" size={34} coef={2} /></text>
    <Molecule f="HCl" x={400} y={140} s={.9} /><Molecule f="HCl" x={400} y={176} s={.9} />
    <text x={400} y={206} textAnchor="middle" fontSize="14" fill={ink}>two molecules of HCl</text>
    <Tick x={400} y={232} ok />
    <text x={270} y={286} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>only ever change the numbers in front</text>
  </Diagram>
}
function Method() {
  return <Diagram viewBox="0 0 540 270" schematic={false} title="The balancing method in three steps: 1 count each kind of atom on both sides; 2 put a number in front of a formula where one does not match; 3 count again, and repeat until every atom matches. Below, the balanced equation H₂ + Cl₂ → 2HCl.">
    <KeyRow n={1} x={40} y={40} lines={['Count each kind of atom on both sides.']} mode="on" colour={amber} />
    <KeyRow n={2} x={40} y={88} lines={['One does not match? Put a number', 'in front of a formula.']} mode="on" colour={amber} />
    <KeyRow n={3} x={40} y={144} lines={['Count again. Repeat until every', 'atom matches.']} mode="on" colour={amber} />
    <rect x={20} y={180} width={500} height={72} rx="12" fill={goodSoft} stroke={good} strokeWidth="1.5" />
    <text x={200} y={226} textAnchor="middle" fontWeight="700"><Formula f="H2" size={28} /><tspan fontSize={28} fill={ink}> + </tspan><Formula f="Cl2" size={28} /><tspan fontSize={28} fill={ink}> → </tspan><Formula f="HCl" size={28} coef={2} /></text>
    <text x={440} y={212} textAnchor="middle" fontSize="14" fontWeight="700" fill={good}>2 H, 2 Cl</text>
    <text x={440} y={232} textAnchor="middle" fontSize="14" fontWeight="700" fill={good}>on each side</text>
  </Diagram>
}
// Worked example: N2 + H2 → NH3, three stages with the counts after each change.
function AmmoniaExample() {
  const stages: Array<{ left: Term[]; right: Term[]; note: string }> = [
    { left: [{ f: 'N2', n: 1 }, { f: 'H2', n: 1 }], right: [{ f: 'NH3', n: 1 }], note: 'start: count' },
    { left: [{ f: 'N2', n: 1 }, { f: 'H2', n: 1 }], right: [{ f: 'NH3', n: 2, changed: true }], note: '2 in front of NH₃' },
    { left: [{ f: 'N2', n: 1 }, { f: 'H2', n: 3, changed: true }], right: [{ f: 'NH3', n: 2 }], note: '3 in front of H₂' },
  ]
  return <Diagram viewBox="0 0 540 330" schematic={false} title="Balancing N₂ + H₂ → NH₃ in three rows. Row 1: N₂ + H₂ → NH₃, left 2 N and 2 H, right 1 N and 3 H, neither matches. Row 2: N₂ + H₂ → 2NH₃, nitrogen now 2 and 2, hydrogen 2 and 6. Row 3: N₂ + 3H₂ → 2NH₃, 2 N and 6 H on each side: balanced.">
    <text x={40} y={22} fontSize="13" fontWeight="700" fill={muted}>equation</text>
    <text x={400} y={22} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>left</text>
    <text x={470} y={22} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>right</text>
    {stages.map((st, i) => {
      const y = 36 + i * 98, lc = countAtoms(st.left), rc = countAtoms(st.right), done = i === 2
      const terms = [...st.left, ...st.right]
      return <g key={i}>
        <rect x={14} y={y} width={512} height={88} rx="12" fill={done ? goodSoft : panelFill} stroke={done ? good : panelLine} strokeWidth="1.5" />
        <Num n={i + 1} x={34} y={y + 22} mode="on" />
        {terms.map((t, k) => <text key={k} x={[56, 144, 256][k]} y={y + 50} fontWeight="700"><Formula f={t.f} size={24} coef={t.n} coefColour={t.changed ? amber : ink} /></text>)}
        <text x={120} y={y + 48} textAnchor="middle" fontSize="22" fontWeight="700" fill={ink}>+</text>
        <RightArrow x1={204} x2={240} y={y + 42} />
        <text x={60} y={y + 78} fontSize="13" fontWeight="700" fill={terms.some(t => t.changed) ? amber : muted}>{st.note}</text>
        {(['N', 'H'] as El[]).map((el, k) => {
          const ry = y + 34 + k * 30, a = lc[el] ?? 0, b = rc[el] ?? 0
          return <g key={el}>
            <Ball el={el} x={356} y={ry - 5} s={.7} />
            <text x={400} y={ry} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{a}</text>
            <text x={470} y={ry} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{b}</text>
            <Tick x={508} y={ry - 5} ok={a === b} />
          </g>
        })}
      </g>
    })}
  </Diagram>
}
function PracticeStart({ focus }: { focus: string }) {
  const co = focus === 'cmpd-question-co'
  return <Diagram viewBox="0 0 540 270" title={co ? 'The unbalanced symbol equation C + O₂ → CO with a model of each particle. The table shows 1 C and 2 O on the left, and 1 C and 1 O on the right.' : 'The unbalanced symbol equation N₂ + O₂ → NO₂ with a model of each molecule. The table shows 2 N and 2 O on the left, and 1 N and 2 O on the right.'}>
    {co ? <BalanceEquation left={[{ f: 'C', n: 1 }, { f: 'O2', n: 1 }]} right={[{ f: 'CO', n: 1 }]} elements={['C', 'O']} />
      : <BalanceEquation left={[{ f: 'N2', n: 1 }, { f: 'O2', n: 1 }]} right={[{ f: 'NO2', n: 1 }]} elements={['N', 'O']} />}
  </Diagram>
}

// ---------- On your own: three numbered particles ----------
function ParticlesQuestion({ assessment }: { assessment: boolean }) {
  const items: Array<[string, number, string]> = [['N2', 90, 'nitrogen, N₂: element'], ['NH3', 270, 'ammonia, NH₃: compound'], ['Ar', 450, 'argon, Ar: element']]
  return <Diagram viewBox="0 0 540 250" title={assessment ? 'Three particles numbered 1, 2 and 3, each drawn as coloured balls with element symbols inside. Particle 1 is two N atoms joined; particle 2 is one N atom joined to three H atoms; particle 3 is a single Ar atom.' : 'Three particles. 1: two nitrogen atoms joined, N₂, an element. 2: one nitrogen atom joined to three hydrogen atoms, NH₃, a compound. 3: one argon atom, Ar, an element.'}>
    {items.map(([f, x, label], i) => <g key={f}>
      <rect x={x - 76} y={50} width={152} height={130} rx="12" fill={space} stroke={spaceLine} strokeWidth="1.5" />
      <Molecule f={f} x={x} y={f === 'NH3' ? 106 : 115} s={1.3} />
      <Num n={i + 1} x={x - 58} y={30} mode="on" />
      {!assessment && <text x={x} y={210} textAnchor="middle" fontSize="13" fontWeight="700" fill={f === 'NH3' ? amber : ink}>{label}</text>}
    </g>)}
    {assessment && <text x={270} y={214} textAnchor="middle" fontSize="13" fill={muted}>each ball is one atom, labelled with its symbol</text>}
  </Diagram>
}

export function CompoundVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('cmpd-compound-')) return <CompoundBuild focus={focus} />
  if (focus === 'cmpd-formula-symbols' || focus === 'cmpd-formula-number') return <FormulaCO2 focus={focus} />
  if (focus === 'cmpd-formula-pairs') return <Pairs />
  if (focus === 'cmpd-formula-brackets') return <Brackets />
  if (focus === 'cmpd-formula-common') return <Common />
  if (focus.startsWith('cmpd-equation-')) return <Equations focus={focus} />
  if (focus === 'cmpd-balance-count' || focus === 'cmpd-balance-front') return <Balance focus={focus} />
  if (focus === 'cmpd-balance-formula') return <NeverChange />
  if (focus === 'cmpd-balance-method') return <Method />
  if (focus === 'cmpd-balance-example') return <AmmoniaExample />
  if (focus === 'cmpd-balance-practice' || focus === 'cmpd-question-co') return <PracticeStart focus={focus} />
  if (focus === 'cmpd-question-particles') return <ParticlesQuestion assessment={assessment} />
  return <CompoundBuild focus="cmpd-compound-all" />
}
