import { useId, type ReactNode } from 'react'
import { Arrow } from './InfectionVisuals'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C3, Higher-only lesson (Chemistry Lesson 20H): moles. Original, code-native schematics; not to scale.
 * Focus ids start with 'hmole-'.
 *
 * Same visual language as the relative-formula-mass and conservation-of-mass drawings (FormulaMassVisuals.tsx,
 * MassConservationVisuals.tsx): soft-filled atoms with a darker stroke of the same hue (H white · O soft red · Mg teal ·
 * Cl soft green), panels and ink from the Chemistry palette, and amber for whatever the frame is about. Each teaching
 * section keeps one drawing on screen and lights one numbered step at a time; the last frame lights them all.
 * Every number drawn is checked against the lesson (AQA Aᵣ values: H 1, N 14, O 16, Mg 24, Cl 35.5, Ca 40).
 */
const { ink, muted, panelFill, panelLine } = atomPalette
const amber = '#d98a1c', amberSoft = '#fdf0dc', amberInk = '#8a5a14'
const bad = '#c0504a', badSoft = '#fbe6e4', good = '#3f8a5f', bondLine = '#7d8a94'
const water = '#cfe6f5', waterLine = '#6aa6cc'
const faded = 0.3

type El = 'H' | 'O' | 'Mg' | 'Cl'
const EL: Record<El, { fill: string; line: string; text: string }> = {
  H: { fill: '#ffffff', line: '#8d9ba6', text: '#375a73' },
  O: { fill: '#f2a39b', line: '#c0625a', text: '#6e2621' },
  Mg: { fill: '#bfe3e0', line: '#4f9690', text: '#1f4f4b' },
  Cl: { fill: '#b2dea6', line: '#5a9a4c', text: '#2c5a22' },
}
const r1 = (n: number) => Math.round(n * 10) / 10

function Diagram({ title, children, viewBox = '0 0 540 320', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
/** Aᵣ or Mᵣ with an italic capital and a lowered r. */
function R({ l, size = 16 }: { l: 'A' | 'M'; size?: number }) {
  return <><tspan fontStyle="italic">{l}</tspan><tspan dy={size * .3} fontSize={Math.max(12, size * .75)}>r</tspan><tspan dy={-size * .3}>{'​'}</tspan></>
}
/** A numbered step badge: filled when it is the step being taught, an outline otherwise. */
function Num({ n, x, y, on = true, colour = amber }: { n: number; x: number; y: number; on?: boolean; colour?: string }) {
  return <g><circle cx={x} cy={y} r="12" fill={on ? colour : 'white'} stroke={on ? colour : muted} strokeWidth="2" />
    <text x={x} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill={on ? 'white' : muted}>{n}</text></g>
}
function Lines({ x, y, lines, gap = 19, anchor = 'start' }: { x: number; y: number; lines: Array<[ReactNode, 'b' | 'n' | 'm' | 'a' | 'bad' | 'good']>; gap?: number; anchor?: 'start' | 'middle' | 'end' }) {
  const fill = { b: ink, n: ink, m: muted, a: amberInk, bad, good }
  return <g>{lines.map(([t, k], i) => t === '' ? null : <text key={i} x={x} y={y + i * gap} textAnchor={anchor} fontSize={k === 'm' ? 13 : 15} fontWeight={k === 'n' || k === 'm' ? 400 : 700} fill={fill[k]}>{t}</text>)}</g>
}
function Chip({ x, y, w, children, hot = true, h = 30, size = 15 }: { x: number; y: number; w: number; children: ReactNode; hot?: boolean; h?: number; size?: number }) {
  return <g><rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="9" fill={hot ? amberSoft : panelFill} stroke={hot ? amber : panelLine} strokeWidth={hot ? 2 : 1.5} />
    <text x={x} y={y + size * .35} textAnchor="middle" fontSize={size} fontWeight="700" fill={hot ? amberInk : ink}>{children}</text></g>
}

// ---------- Atoms and molecules ----------
function Ball({ el, x, y, r }: { el: El; x: number; y: number; r?: number }) {
  const e = EL[el], rr = r ?? (el === 'H' ? 10 : 13)
  return <g><circle cx={x} cy={y} r={rr} fill={e.fill} stroke={e.line} strokeWidth="1.8" />
    <text x={x} y={y + 4.5} textAnchor="middle" fontSize="12" fontWeight="700" fill={e.text}>{el}</text></g>
}
type Mol = 'H2' | 'Cl2' | 'HCl'
/** A two-atom molecule, centred on (x, y) and tilted a little so a box of them looks loose rather than gridded. */
function Molecule({ kind, x, y, tilt = 0 }: { kind: Mol; x: number; y: number; tilt?: number }) {
  const [a, b]: [El, El] = kind === 'H2' ? ['H', 'H'] : kind === 'Cl2' ? ['Cl', 'Cl'] : ['H', 'Cl']
  const half = kind === 'H2' ? 8 : kind === 'Cl2' ? 10.5 : 9.5
  const shift = kind === 'HCl' ? 1.5 : 0
  return <g transform={`rotate(${tilt} ${x} ${y})`}>
    <path d={`M${x - half + shift} ${y}H${x + half + shift}`} stroke={bondLine} strokeWidth="3" />
    <Ball el={a} x={x - half + shift} y={y} /><Ball el={b} x={x + half + shift} y={y} />
  </g>
}

// ---------- Section 1: the mole, one bench built up frame by frame ----------
/** A soft heap of grey-white magnesium powder: an uneven mound, not a geometric triangle. */
const powder = { fill: '#f3f0e8', line: '#a89f8c' }
function Heap({ x, y, w = 92, h = 34, white = false }: { x: number; y: number; w?: number; h?: number; white?: boolean }) {
  const l = x - w / 2, rr = x + w / 2, c = white ? powder : EL.Mg
  return <g>
    <path d={`M${l} ${y}C${l + w * .12} ${y - h * .35} ${l + w * .22} ${y - h * .9} ${x - w * .06} ${y - h}C${x + w * .08} ${y - h * 1.04} ${x + w * .2} ${y - h * .74} ${rr - w * .16} ${y - h * .42}C${rr - w * .08} ${y - h * .22} ${rr - w * .03} ${y - h * .08} ${rr} ${y}Z`} fill={c.fill} stroke={c.line} strokeWidth="1.8" />
    {[[-.22, .3], [.02, .62], [.18, .3], [-.06, .22], [.3, .14], [-.32, .12]].map(([dx, dy], i) => <circle key={i} cx={r1(x + dx * w)} cy={r1(y - dy * h)} r="1.8" fill={c.line} opacity=".55" />)}
  </g>
}
/** A small glass beaker of water. */
function Beaker({ x, y, w = 56, h = 54 }: { x: number; y: number; w?: number; h?: number }) {
  const l = x - w / 2, rr = x + w / 2, top = y - h
  return <g>
    <path d={`M${l + 3} ${top + h * .36}H${rr - 3}V${y - 8}Q${rr - 3} ${y} ${rr - 11} ${y}H${l + 11}Q${l + 3} ${y} ${l + 3} ${y - 8}Z`} fill={water} />
    <path d={`M${l - 3} ${top}Q${l + 3} ${top + 2} ${l + 3} ${top + 8}V${y - 8}Q${l + 3} ${y} ${l + 11} ${y}H${rr - 11}Q${rr - 3} ${y} ${rr - 3} ${y - 8}V${top + 4}`} fill="none" stroke={waterLine} strokeWidth="2.2" />
    <path d={`M${l + 3} ${top + h * .36}Q${x} ${top + h * .36 + 3} ${rr - 3} ${top + h * .36}`} fill="none" stroke={waterLine} strokeWidth="1.4" />
  </g>
}
/** A top-pan balance with a display. `base` is the bench line. */
function Balance({ x, base, reading, hot = false, children }: { x: number; base: number; reading?: string; hot?: boolean; children?: ReactNode }) {
  const w = 150, bodyTop = base - 44
  return <g>
    <path d={`M${x - w / 2 + 6} ${base}Q${x - w / 2} ${base} ${x - w / 2 + 2} ${base - 8}L${x - w / 2 + 10} ${bodyTop + 6}Q${x - w / 2 + 12} ${bodyTop} ${x - w / 2 + 20} ${bodyTop}H${x + w / 2 - 20}Q${x + w / 2 - 12} ${bodyTop} ${x + w / 2 - 10} ${bodyTop + 6}L${x + w / 2 - 2} ${base - 8}Q${x + w / 2} ${base} ${x + w / 2 - 6} ${base}Z`} fill={panelFill} stroke={hot ? amber : panelLine} strokeWidth={hot ? 2.2 : 1.8} />
    <rect x={x - 38} y={bodyTop + 12} width={76} height={24} rx="5" fill={reading ? (hot ? amberSoft : 'white') : 'white'} stroke={hot ? amber : panelLine} strokeWidth="1.5" />
    <text x={x} y={bodyTop + 30} textAnchor="middle" fontSize="16" fontWeight="700" fill={reading ? (hot ? amberInk : ink) : muted}>{reading ?? '– – –'}</text>
    <path d={`M${x - 8} ${bodyTop}V${bodyTop - 6}H${x + 8}V${bodyTop}`} fill={panelLine} stroke={panelLine} strokeWidth="1.5" />
    <ellipse cx={x} cy={bodyTop - 8} rx={w / 2 - 14} ry={6} fill="white" stroke={panelLine} strokeWidth="1.8" />
    {children}
  </g>
}
/** A round magnifier showing the atoms in the heap. */
function Zoom({ x, y, r, from }: { x: number; y: number; r: number; from: [number, number] }) {
  const clip = useId()
  const atoms: Array<[number, number]> = []
  for (let row = -4; row <= 4; row++) for (let col = -4; col <= 4; col++) {
    const ax = x + col * 22 + (row % 2 ? 11 : 0), ay = y + row * 19
    if (Math.hypot(ax - x, ay - y) < r - 6) atoms.push([r1(ax), r1(ay)])
  }
  return <g>
    <path d={`M${from[0]} ${from[1]}L${x - r * .82} ${y - r * .55}M${from[0]} ${from[1] + 18}L${x - r * .8} ${y + r * .6}`} stroke={panelLine} strokeWidth="1.5" strokeDasharray="4 4" />
    <defs><clipPath id={clip}><circle cx={x} cy={y} r={r} /></clipPath></defs>
    <circle cx={x} cy={y} r={r} fill="white" />
    <g clipPath={`url(#${clip})`}>{atoms.map(([ax, ay], i) => <circle key={i} cx={ax} cy={ay} r={9.6} fill={EL.Mg.fill} stroke={EL.Mg.line} strokeWidth="1.6" />)}</g>
    <circle cx={x} cy={y} r={r} fill="none" stroke={ink} strokeWidth="2.5" />
  </g>
}

type MoleStage = 'avogadro' | 'one' | 'mass' | 'formula' | 'triangle'
const MOLE_TITLES: Record<MoleStage, string> = {
  avogadro: 'A heap of magnesium powder on a balance, with a magnifier showing that it is made of tightly packed magnesium atoms. Chemists count atoms in groups of 6.02 × 10²³, the Avogadro constant.',
  one: 'The same heap of magnesium, labelled as one mole: 6.02 × 10²³ magnesium atoms. The particles counted can be atoms, molecules, ions or electrons.',
  mass: 'Two balances. One mole of magnesium reads 24 g, because the relative atomic mass of magnesium is 24. One mole of water reads 18 g, because the relative formula mass of water is 18. Both hold 6.02 × 10²³ particles.',
  formula: 'The balance now holds 48 g of magnesium. Beside it: number of moles = mass in grams ÷ Mr. For magnesium, 48 ÷ 24 = 2 mol.',
  triangle: 'A formula triangle with mass at the top and number of moles × Mr at the bottom. Cover what you want to find: moles = mass ÷ Mr, mass = moles × Mr, Mr = mass ÷ moles.',
}
function MoleScene({ stage }: { stage: MoleStage }) {
  const base = 262, bx = 120
  const reading = stage === 'mass' ? '24 g' : stage === 'formula' || stage === 'triangle' ? '48 g' : undefined
  const big = stage === 'formula' || stage === 'triangle'
  return <Diagram title={MOLE_TITLES[stage]}>
    <path d={`M14 ${base}H526`} stroke={panelLine} strokeWidth="2" />
    <g opacity={stage === 'triangle' ? .5 : 1}>
      <Balance x={bx} base={base} reading={reading} hot={stage === 'mass' || stage === 'formula'}>
        <Heap x={bx} y={base - 56} w={big ? 108 : 86} h={big ? 44 : 32} />
      </Balance>
      <text x={bx} y={base + 22} textAnchor="middle" fontSize="13" fill={muted}>magnesium, Mg</text>
    </g>
    {(stage === 'one' || stage === 'mass') && <Chip x={bx} y={base - 128} w={96}>1 mol</Chip>}
    {big && <Chip x={bx} y={base - 136} w={96} hot={stage === 'formula'}>2 mol</Chip>}

    {(stage === 'avogadro' || stage === 'one') && <g>
      <Zoom x={380} y={102} r={78} from={[bx + 30, base - 80]} />
      {stage === 'avogadro'
        ? <g>
          <text x={380} y={214} textAnchor="middle" fontSize="24" fontWeight="700" fill={amberInk}>6.02 × 10²³</text>
          <text x={380} y={236} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>the Avogadro constant</text>
          <circle cx={292} cy={286} r="7" fill={EL.Mg.fill} stroke={EL.Mg.line} strokeWidth="1.4" />
          <text x={304} y={291} fontSize="13" fill={muted}>= one magnesium atom</text>
        </g>
        : <g>
          <text x={380} y={212} textAnchor="middle" fontSize="18" fontWeight="700" fill={amberInk}>1 mole = 6.02 × 10²³ atoms</text>
          <text x={380} y={290} textAnchor="middle" fontSize="13" fill={muted}>particles can be atoms, molecules,</text>
          <text x={380} y={306} textAnchor="middle" fontSize="13" fill={muted}>ions or electrons</text>
        </g>}
    </g>}

    {stage === 'mass' && <g>
      <Balance x={392} base={base} reading="18 g" hot><Beaker x={392} y={base - 54} w={50} h={50} /></Balance>
      <text x={392} y={base + 22} textAnchor="middle" fontSize="13" fill={muted}>water, H₂O</text>
      <Chip x={392} y={base - 128} w={96}>1 mol</Chip>
      <text x={bx} y={base - 160} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}><R l="A" size={15} /> of Mg = 24</text>
      <text x={392} y={base - 160} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}><R l="M" size={15} /> of H₂O = 18</text>
      <text x={256} y={42} textAnchor="middle" fontSize="15" fontWeight="700" fill={amberInk}>both hold 6.02 × 10²³ particles</text>
    </g>}

    {stage === 'formula' && <g>
      <rect x={250} y={46} width={274} height={98} rx="12" fill={amberSoft} stroke={amber} strokeWidth="2" />
      <text x={387} y={78} textAnchor="middle" fontSize="15" fontWeight="700" fill={amberInk}>number of moles =</text>
      <text x={387} y={104} textAnchor="middle" fontSize="15" fontWeight="700" fill={amberInk}>mass in g ÷ <R l="M" size={15} /></text>
      <text x={387} y={128} textAnchor="middle" fontSize="13" fill={amberInk}>(use <R l="A" size={13} /> for an element)</text>
      <Lines x={262} y={184} lines={[['48 g of magnesium:', 'n'], ['48 ÷ 24 = 2 mol', 'a']]} gap={24} />
    </g>}

    {stage === 'triangle' && <g>
      <path d="M392 26L470 150H314Z" fill={panelFill} stroke={panelLine} strokeWidth="2.5" />
      <path d="M340 108H444M392 108V150" stroke={panelLine} strokeWidth="2.5" />
      <text x={392} y={92} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>mass</text>
      <text x={363} y={136} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>moles</text>
      <text x={392} y={136} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>×</text>
      <text x={421} y={136} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}><R l="M" size={14} /></text>
      {([['find moles', <>mass ÷ <R l="M" size={14} /></>], ['find mass', <>moles × <R l="M" size={14} /></>], [<>find <R l="M" size={13} /></>, 'mass ÷ moles']] as Array<[ReactNode, ReactNode]>).map(([a, b], i) => <g key={i}>
        <rect x={258} y={164 + i * 32} width={266} height={28} rx="8" fill={i === 1 ? amberSoft : panelFill} stroke={i === 1 ? amber : panelLine} strokeWidth={i === 1 ? 2 : 1.5} />
        <text x={270} y={183 + i * 32} fontSize="13" fill={muted}>{a}</text>
        <text x={512} y={183 + i * 32} textAnchor="end" fontSize="14" fontWeight="700" fill={i === 1 ? amberInk : ink}>{b}</text>
      </g>)}
      <text x={120} y={44} textAnchor="middle" fontSize="13" fill={muted}>cover what you</text>
      <text x={120} y={60} textAnchor="middle" fontSize="13" fill={muted}>want to find</text>
    </g>}
  </Diagram>
}

// Worked example set-ups (the sums are left for the steps).
function WorkedMoles() {
  const base = 250, bx = 130
  return <Diagram title="Worked example set-up: 60 g of magnesium oxide, MgO, on a balance. Relative atomic masses: magnesium 24, oxygen 16. The sum to do is number of moles = 60 ÷ Mr of MgO.">
    <path d={`M20 ${base}H250`} stroke={panelLine} strokeWidth="2" />
    <Balance x={bx} base={base} reading="60 g" hot><Heap x={bx} y={base - 56} w={96} h={36} white /></Balance>
    <text x={bx} y={base + 22} textAnchor="middle" fontSize="13" fill={muted}>magnesium oxide, MgO</text>
    <Lines x={280} y={70} lines={[[<><R l="A" size={15} />: Mg = 24, O = 16</>, 'b'], ['', 'n'], ['mass = 60 g', 'a'], [<><R l="M" size={15} /> of MgO = 24 + 16</>, 'a']]} gap={24} />
    <text x={280} y={210} fontSize="16" fontWeight="700" fill={ink}>moles = 60 ÷ <R l="M" size={16} /></text>
  </Diagram>
}
function WorkedMass() {
  return <Diagram title="Worked example set-up: 0.25 mol of calcium carbonate, CaCO₃, on a balance with an unknown reading. Relative atomic masses: calcium 40, carbon 12, oxygen 16. The sum to do is mass = 0.25 × Mr of CaCO₃.">
    <path d="M20 250H250" stroke={panelLine} strokeWidth="2" />
    <Balance x={130} base={250} reading="? g" hot><Heap x={130} y={194} w={72} h={26} white /></Balance>
    <Chip x={130} y={112} w={110}>0.25 mol</Chip>
    <text x={130} y={272} textAnchor="middle" fontSize="13" fill={muted}>calcium carbonate, CaCO₃</text>
    <Lines x={280} y={70} lines={[[<><R l="A" size={15} />: Ca = 40, C = 12, O = 16</>, 'b'], ['', 'n'], ['moles = 0.25 mol', 'a'], [<><R l="M" size={15} /> = 40 + 12 + (3 × 16)</>, 'a']]} gap={24} />
    <text x={280} y={210} fontSize="16" fontWeight="700" fill={ink}>mass = 0.25 × <R l="M" size={16} /></text>
  </Diagram>
}

// ---------- Section 2: moles in equations, one table built up frame by frame ----------
const COLS = [204, 320, 440]
type EqStage = 'particles' | 'moles' | 'masses' | 'divide' | 'steps'
const EQ_TITLES: Record<EqStage, string> = {
  particles: 'The equation 2Mg + O₂ → 2MgO drawn with particles: two magnesium atoms, one oxygen molecule, and two magnesium oxide units, each one magnesium and one oxygen.',
  moles: 'The same equation with a moles row: 2 mol of magnesium, 1 mol of oxygen and 2 mol of magnesium oxide. The ratio 2 : 1 : 2 is the same for particles and for moles.',
  masses: 'Working backwards from reacting masses. Magnesium 4.8 g ÷ 24 = 0.2 mol. Oxygen 3.2 g ÷ 32 = 0.1 mol. Magnesium oxide 8.0 g ÷ 40 = 0.2 mol. The big numbers in the equation are still question marks.',
  divide: 'Each number of moles divided by the smallest, 0.1, gives 2, 1 and 2. These go in front of the formulas: 2Mg + O₂ → 2MgO.',
  steps: 'All four steps on the table: 1, divide each mass by its Mr to get moles; 2, divide by the smallest; 3, check they are whole numbers (multiply them all if not); 4, write them in the equation: 2Mg + O₂ → 2MgO.',
}
function EqHeader({ y, nums, hot }: { y: number; nums: [string, string, string]; hot: boolean }) {
  const f = (n: string) => <tspan fill={hot ? amberInk : ink}>{n}</tspan>
  return <g fontSize="26" fontWeight="700" fill={ink} textAnchor="middle">
    <text x={COLS[0]} y={y}>{f(nums[0])}Mg</text>
    <text x={262} y={y}>+</text>
    <text x={COLS[1]} y={y}>{f(nums[1])}O₂</text>
    <text x={374} y={y} fill={muted}>→</text>
    <text x={COLS[2]} y={y}>{f(nums[2])}MgO</text>
  </g>
}
function RowLabel({ y, n, on, children }: { y: number; n?: number; on: boolean; children: ReactNode }) {
  return <g opacity={on ? 1 : faded + .15}>
    {n !== undefined && <Num n={n} x={28} y={y - 5} on={on} />}
    <text x={48} y={y} fontSize="14" fontWeight="700" fill={on ? ink : muted}>{children}</text>
  </g>
}
function EqScene({ stage }: { stage: EqStage }) {
  const back = stage === 'masses' || stage === 'divide' || stage === 'steps'
  if (!back) {
    const y = 108
    return <Diagram title={EQ_TITLES[stage]}>
      <EqHeader y={48} nums={['2', '', '2']} hot={stage === 'particles'} />
      <RowLabel y={y + 5} on>particles</RowLabel>
      <Ball el="Mg" x={COLS[0] - 18} y={y} r={14} /><Ball el="Mg" x={COLS[0] + 18} y={y} r={14} />
      <path d={`M${COLS[1] - 14} ${y}H${COLS[1] + 14}`} stroke={bondLine} strokeWidth="3.5" /><Ball el="O" x={COLS[1] - 14} y={y} r={14} /><Ball el="O" x={COLS[1] + 14} y={y} r={14} />
      {[-32, 32].map(d => <g key={d}><path d={`M${COLS[2] + d - 14} ${y}H${COLS[2] + d + 14}`} stroke={bondLine} strokeWidth="3.5" /><Ball el="Mg" x={COLS[2] + d - 14} y={y} r={14} /><Ball el="O" x={COLS[2] + d + 14} y={y} r={14} /></g>)}
      {['2 atoms', '1 molecule', '2 lots of MgO'].map((t, i) => <text key={t} x={COLS[i]} y={y + 36} textAnchor="middle" fontSize="13" fill={muted}>{t}</text>)}
      <g opacity={stage === 'moles' ? 1 : faded}>
        <RowLabel y={198} on={stage === 'moles'}>moles</RowLabel>
        {['2 mol', '1 mol', '2 mol'].map((t, i) => <Chip key={t + i} x={COLS[i]} y={193} w={78} hot={stage === 'moles'}>{stage === 'moles' ? t : '?'}</Chip>)}
      </g>
      {stage === 'particles' && <Lines x={270} y={262} anchor="middle" lines={[['The big numbers count particles:', 'b'], ['2 atoms react with 1 molecule to make 2 MgO.', 'n']]} gap={24} />}
      {stage === 'moles' && <Lines x={270} y={252} anchor="middle" lines={[['Multiply every particle by 6.02 × 10²³:', 'n'], ['the ratio 2 : 1 : 2 stays the same.', 'a'], ['So the big numbers are numbers of moles.', 'b']]} gap={22} />}
    </Diagram>
  }
  const step = stage === 'masses' ? 1 : stage === 'divide' ? 2 : 4
  const all = stage === 'steps'
  const rows: Array<{ y: number; label: ReactNode; n?: number; on: boolean; cells: ReactNode[]; hot?: boolean }> = [
    { y: 96, label: 'mass', on: true, cells: ['4.8 g', '3.2 g', '8.0 g'] },
    { y: 132, label: <>÷ <R l="M" size={14} /></>, on: true, cells: ['÷ 24', '÷ 32', '÷ 40'] },
    { y: 172, label: 'moles', n: 1, on: step === 1 || all, cells: ['0.2', '0.1', '0.2'], hot: step === 1 },
    { y: 214, label: '÷ smallest', n: 2, on: step === 2 || all, cells: ['2', '1', '2'], hot: step === 2 },
  ]
  return <Diagram title={EQ_TITLES[stage]}>
    <EqHeader y={48} nums={step === 1 ? ['?', '?', '?'] : ['2', '', '2']} hot={step !== 1} />
    {step === 1 && <text x={COLS[1]} y={70} textAnchor="middle" fontSize="13" fill={muted}>what are the big numbers?</text>}
    {rows.map((r, i) => {
      const shown = i < 3 || step >= 2
      if (!shown) return null
      return <g key={i}>
        <RowLabel y={r.y + 5} n={r.n} on={r.on}>{r.label}</RowLabel>
        {r.cells.map((c, j) => r.n
          ? <Chip key={j} x={COLS[j]} y={r.y} w={78} hot={!!r.hot}>{c}</Chip>
          : <text key={j} x={COLS[j]} y={r.y + 5} textAnchor="middle" fontSize="16" fontWeight="700" fill={i === 1 ? muted : ink}>{c}</text>)}
      </g>
    })}
    {step === 1 && <Lines x={270} y={250} anchor="middle" lines={[[<>Divide each mass by its <R l="M" size={15} />.</>, 'n'], ['This gives the moles that reacted.', 'a']]} gap={24} />}
    {step === 2 && <Lines x={270} y={268} anchor="middle" lines={[['The smallest is 0.1: 0.2 ÷ 0.1 = 2 and 0.1 ÷ 0.1 = 1.', 'n'], ['These are the big numbers.', 'a']]} gap={24} />}
    {all && <g>
      <RowLabel y={254} n={3} on>whole numbers?</RowLabel>
      <text x={COLS[1] + 60} y={259} textAnchor="middle" fontSize="14" fill={ink}>yes (if not, multiply them all)</text>
      <RowLabel y={294} n={4} on>equation</RowLabel>
      <text x={COLS[1] + 60} y={300} textAnchor="middle" fontSize="20" fontWeight="700" fill={amberInk}>2Mg + O₂ → 2MgO</text>
    </g>}
  </Diagram>
}

// A table of reacting masses and Mᵣ values (worked example and questions). Moles are left for the learner.
function MassTable({ title, formulas, masses, mrs, header, note }: { title: string; formulas: string[]; masses: string[]; mrs: string[]; header: ReactNode; note?: ReactNode }) {
  const n = formulas.length, left = 150, right = 520, step = (right - left) / n
  const xs = formulas.map((_, i) => left + step * (i + .5))
  const h = note ? 262 : 236
  return <Diagram viewBox={`0 0 540 ${h}`} schematic={false} title={title}>
    <text x={270} y={36} textAnchor="middle" fontSize="20" fontWeight="700" fill={ink}>{header}</text>
    <rect x={20} y={54} width={500} height={164} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={36} y={88} fontSize="14" fontWeight="700" fill={ink}>substance</text>
    <text x={36} y={132} fontSize="14" fontWeight="700" fill={ink}>mass (g)</text>
    <text x={36} y={166} fontSize="14" fontWeight="700" fill={ink}><R l="M" size={14} /></text>
    <text x={36} y={200} fontSize="14" fontWeight="700" fill={muted}>moles</text>
    <path d="M32 104H508" stroke={panelLine} strokeWidth="1.5" />
    {formulas.map((f, i) => <g key={f} textAnchor="middle">
      <text x={xs[i]} y={88} fontSize="17" fontWeight="700" fill={ink}>{f}</text>
      <text x={xs[i]} y={132} fontSize="16" fill={ink}>{masses[i]}</text>
      <text x={xs[i]} y={166} fontSize="16" fill={ink}>{mrs[i]}</text>
      <text x={xs[i]} y={200} fontSize="16" fill={muted}>?</text>
    </g>)}
    {note && <text x={270} y={244} textAnchor="middle" fontSize="13" fill={muted}>{note}</text>}
  </Diagram>
}

// ---------- Section 3: limiting reactants, H₂ + Cl₂ → 2HCl ----------
// Loose positions in a box: four columns, three rows, each with a small nudge and tilt so it reads as a jumble of molecules.
const SPOTS: Array<[number, number, number]> = [
  [34, 30, -8], [86, 24, 10], [140, 32, -4], [190, 26, 14],
  [30, 78, 12], [84, 72, -12], [138, 80, 6], [192, 74, -6],
  [36, 124, -4], [88, 120, 8], [142, 126, -14], [190, 120, 4],
]
function Box({ x, y, mols, label, ring }: { x: number; y: number; mols: Mol[]; label: string; ring?: Mol }) {
  return <g>
    <rect x={x} y={y} width={222} height={150} rx="16" fill="white" stroke={panelLine} strokeWidth="2" />
    {mols.map((m, i) => {
      const [dx, dy, t] = SPOTS[ORDER[i]]
      return <g key={i}>
        {ring === m && <ellipse cx={x + dx} cy={y + dy} rx={29} ry={19} fill={amberSoft} stroke={amber} strokeWidth="1.8" strokeDasharray="4 3" transform={`rotate(${t} ${x + dx} ${y + dy})`} />}
        <Molecule kind={m} x={x + dx} y={y + dy} tilt={t} />
      </g>
    })}
    <text x={x + 111} y={y + 172} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{label}</text>
  </g>
}
// Fill order: spread over the box rather than filling it row by row.
const ORDER = [0, 6, 9, 3, 5, 11, 2, 8, 4, 10, 1, 7]
const rep = (m: Mol, n: number): Mol[] => Array.from({ length: n }, () => m)
type LimitStage = 'used' | 'limiting' | 'excess' | 'double' | 'steps'
const LIMIT_TITLES: Record<LimitStage, string> = {
  used: 'Before: 2 hydrogen molecules and 5 chlorine molecules. After: 4 hydrogen chloride molecules and 3 chlorine molecules. There is no hydrogen left, so the reaction has stopped.',
  limiting: 'The same before and after boxes, with the 2 hydrogen molecules ringed. Hydrogen is all used up, so it is the limiting reactant.',
  excess: 'The same boxes, with the 3 chlorine molecules left over ringed. Chlorine is in excess.',
  double: 'Before: 4 hydrogen molecules and 5 chlorine molecules. After: 8 hydrogen chloride molecules and 1 chlorine molecule. Twice as much hydrogen made twice as much hydrogen chloride.',
  steps: 'Summary: hydrogen is the limiting reactant, chlorine is in excess, and the product is proportional to the limiting reactant. Below, five numbered steps to find a mass of product: write the balanced equation, find the Mr values, find the moles of the limiting reactant, use the equation ratio for the moles of product, then mass = moles × Mr.',
}
const POINTS: Array<[string, string]> = [['used up:', 'limiting reactant'], ['left over:', 'in excess'], ['double the H₂,', 'double the HCl']]
function Points({ x, y, on, gapX = 186, vertical = false }: { x: number; y: number; on: boolean[]; gapX?: number; vertical?: boolean }) {
  return <g>{POINTS.map(([a, b], i) => {
    const px = vertical ? x : x + i * gapX, py = vertical ? y + i * 46 : y
    return <g key={i} opacity={on[i] ? 1 : faded + .1}>
      <Num n={i + 1} x={px + 12} y={py} on={on[i]} />
      <text x={px + 32} y={py - 3} fontSize="13" fill={on[i] ? ink : muted}>{a}</text>
      <text x={px + 32} y={py + 14} fontSize="14" fontWeight="700" fill={on[i] ? amberInk : muted}>{b}</text>
    </g>
  })}</g>
}
function LimitScene({ stage }: { stage: LimitStage }) {
  const double = stage === 'double'
  const before: Mol[] = double ? [...rep('H2', 4), ...rep('Cl2', 5)] : [...rep('H2', 2), ...rep('Cl2', 5)]
  const after: Mol[] = double ? [...rep('HCl', 8), 'Cl2'] : [...rep('HCl', 4), ...rep('Cl2', 3)]
  if (stage === 'steps') {
    const steps: ReactNode[] = ['Write the balanced equation.', <>Work out the <R l="M" size={14} /> of the limiting reactant and the product.</>, <>Find the moles of the limiting reactant: mass ÷ <R l="M" size={14} />.</>, 'Use the equation ratio to find the moles of product.', <>Mass of product = moles × <R l="M" size={14} />.</>]
    return <Diagram viewBox="0 0 540 320" title={LIMIT_TITLES.steps}>
      <Points x={14} y={34} on={[true, true, true]} />
      <path d="M20 70H520" stroke={panelLine} strokeWidth="1.5" />
      <text x={20} y={100} fontSize="15" fontWeight="700" fill={amberInk}>Finding the mass of product</text>
      {steps.map((s, i) => <g key={i}>
        <Num n={i + 1} x={34} y={130 + i * 38} on />
        <text x={56} y={135 + i * 38} fontSize="15" fill={ink}>{s}</text>
      </g>)}
    </Diagram>
  }
  return <Diagram viewBox="0 0 540 320" title={LIMIT_TITLES[stage]}>
    <text x={270} y={34} textAnchor="middle" fontSize="24" fontWeight="700" fill={ink}>H₂ + Cl₂ <tspan fill={muted}>→</tspan> 2HCl</text>
    <Box x={16} y={50} mols={before} label={double ? 'before: 4 H₂, 5 Cl₂' : 'before: 2 H₂, 5 Cl₂'} ring={stage === 'limiting' ? 'H2' : undefined} />
    <Arrow x1={248} y1={125} x2={292} y2={125} colour={ink} />
    <Box x={302} y={50} mols={after} label={double ? 'after: 8 HCl, 1 Cl₂' : 'after: 4 HCl, 3 Cl₂'} ring={stage === 'excess' ? 'Cl2' : double ? 'HCl' : undefined} />
    {stage === 'used' && <Lines x={270} y={262} anchor="middle" lines={[['No hydrogen is left after,', 'b'], ['so the reaction has stopped.', 'a']]} gap={22} />}
    {stage !== 'used' && <Points x={14} y={272} on={[stage === 'limiting', stage === 'excess', double]} />}
  </Diagram>
}

function WorkedWater() {
  const steps: ReactNode[] = ['balanced equation', <><R l="M" size={14} /> of O₂ and of H₂O</>, 'moles of O₂', 'ratio: 1 O₂ makes 2 H₂O', <>mass of H₂O = moles × <R l="M" size={14} /></>]
  return <Diagram viewBox="0 0 540 300" schematic={false} title="Worked example set-up: 2H₂ + O₂ → 2H₂O. 8.0 g of oxygen reacts with hydrogen in excess, so oxygen is the limiting reactant. Relative atomic masses: hydrogen 1, oxygen 16. Five numbered steps to follow: balanced equation; Mr of O₂ and of H₂O; moles of O₂; the ratio 1 O₂ makes 2 H₂O; mass of water = moles × Mr.">
    <text x={270} y={40} textAnchor="middle" fontSize="26" fontWeight="700" fill={ink}>2H₂ + <tspan fill={amberInk}>O₂</tspan> <tspan fill={muted}>→</tspan> 2H₂O</text>
    <Chip x={160} y={78} w={200} size={14}>8.0 g of O₂: limiting</Chip>
    <Chip x={380} y={78} w={180} size={14} hot={false}>H₂ is in excess</Chip>
    <text x={270} y={122} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}><R l="A" size={15} />: H = 1, O = 16</text>
    <rect x={20} y={138} width={500} height={150} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    {steps.map((s, i) => <g key={i}><Num n={i + 1} x={44} y={160 + i * 27} on={false} colour={ink} /><text x={66} y={165 + i * 27} fontSize="14" fill={ink}>{s}</text></g>)}
  </Diagram>
}
function Nh3Card() {
  return <Diagram viewBox="0 0 540 210" schematic={false} title="Question card: N₂ + 3H₂ → 2NH₃. 5.6 g of nitrogen reacts with hydrogen in excess. Relative atomic masses: nitrogen 14, hydrogen 1. The mass of ammonia made is to be found.">
    <rect x={20} y={14} width={500} height={182} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={270} y={58} textAnchor="middle" fontSize="26" fontWeight="700" fill={ink}>N₂ + 3H₂ <tspan fill={muted}>→</tspan> 2NH₃</text>
    <Chip x={160} y={98} w={170} size={14}>5.6 g of N₂</Chip>
    <Chip x={380} y={98} w={170} size={14} hot={false}>H₂ is in excess</Chip>
    <text x={270} y={142} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}><R l="A" size={15} />: N = 14, H = 1</text>
    <text x={270} y={174} textAnchor="middle" fontSize="15" fill={muted}>mass of NH₃ made = ?</text>
  </Diagram>
}
// Question: which reactant is limiting? Before 5 H₂ + 2 Cl₂; after 4 HCl + 3 H₂. Chlorine is used up.
function LimitingQuestion({ assessment }: { assessment: boolean }) {
  return <Diagram viewBox={`0 0 540 ${assessment ? 264 : 300}`} title={assessment
    ? 'Two boxes of molecules for the reaction H₂ + Cl₂ → 2HCl. Before: 5 hydrogen molecules and 2 chlorine molecules. After: 4 hydrogen chloride molecules and 3 hydrogen molecules.'
    : 'Before: 5 hydrogen molecules and 2 chlorine molecules. After: 4 hydrogen chloride molecules and 3 hydrogen molecules left over. Chlorine is all used up, so it is the limiting reactant; hydrogen is in excess.'}>
    <text x={270} y={34} textAnchor="middle" fontSize="24" fontWeight="700" fill={ink}>H₂ + Cl₂ <tspan fill={muted}>→</tspan> 2HCl</text>
    <Box x={16} y={50} mols={[...rep('H2', 5), ...rep('Cl2', 2)]} label="before" ring={assessment ? undefined : 'Cl2'} />
    <Arrow x1={248} y1={125} x2={292} y2={125} colour={ink} />
    <Box x={302} y={50} mols={[...rep('HCl', 4), ...rep('H2', 3)]} label="after" ring={assessment ? undefined : 'H2'} />
    <g transform="translate(150 250)"><Ball el="H" x={0} y={0} /><text x={16} y={5} fontSize="13" fill={muted}>hydrogen atom</text>
      <Ball el="Cl" x={150} y={0} /><text x={170} y={5} fontSize="13" fill={muted}>chlorine atom</text></g>
    {!assessment && <Lines x={270} y={286} anchor="middle" lines={[['Cl₂ is used up (limiting); H₂ is left over (in excess).', 'good']]} />}
  </Diagram>
}

// ---------- On your own ----------
// A student's working for 4.6 g of sodium in excess oxygen. Line 3 multiplies by 2 instead of halving (4 Na make 2 Na₂O).
function ErrorQuestion({ assessment }: { assessment: boolean }) {
  const lines: ReactNode[] = [<><R l="M" />: Na = 23, Na₂O = 62</>, 'moles of Na = 4.6 ÷ 23 = 0.2', 'moles of Na₂O = 0.2 × 2 = 0.4', 'mass of Na₂O = 0.4 × 62 = 24.8 g']
  return <Diagram viewBox={`0 0 540 ${assessment ? 270 : 320}`} schematic={false} title={assessment
    ? 'A student’s working for the mass of sodium oxide made when 4.6 g of sodium burns in excess oxygen, 4Na + O₂ → 2Na₂O, in four numbered lines. Line 1: Mr Na = 23, Na₂O = 62. Line 2: moles of Na = 4.6 ÷ 23 = 0.2. Line 3: moles of Na₂O = 0.2 × 2 = 0.4. Line 4: mass of Na₂O = 0.4 × 62 = 24.8 g.'
    : 'The student’s working with line 3 marked wrong. 4 Na make 2 Na₂O, so the moles of Na₂O are 0.2 ÷ 2 = 0.1, and the mass is 0.1 × 62 = 6.2 g.'}>
    <text x={20} y={30} fontSize="16" fontWeight="700" fill={ink}>4.6 g of sodium burns in excess oxygen</text>
    <text x={20} y={56} fontSize="18" fontWeight="700" fill={ink}>4Na + O₂ <tspan fill={muted}>→</tspan> 2Na₂O</text>
    <rect x={20} y={70} width={500} height={186} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    {lines.map((l, i) => {
      const y = 108 + i * 42, wrong = !assessment && i === 2
      return <g key={i}>
        {wrong && <rect x={28} y={y - 21} width={484} height={38} rx="8" fill={badSoft} stroke={bad} strokeWidth="1.5" />}
        <Num n={i + 1} x={52} y={y - 2} on={false} colour={wrong ? bad : ink} />
        <text x={78} y={y + 4} fontSize="16" fontWeight="600" fill={wrong ? bad : ink}>{l}</text>
      </g>
    })}
    {!assessment && <Lines x={20} y={284} lines={[['4 Na make 2 Na₂O, so halve: 0.2 ÷ 2 = 0.1 mol', 'good'], ['mass of Na₂O = 0.1 × 62 = 6.2 g', 'good']]} gap={22} />}
  </Diagram>
}
function MagnesiumData() {
  const rows: Array<[string, string, string]> = [['1', '0.6', '1.0'], ['2', '1.2', '2.0'], ['3', '2.4', '4.0']]
  return <Diagram viewBox="0 0 540 236" schematic={false} title="A data table of three runs of burning magnesium in excess oxygen. Run 1: 0.6 g of magnesium made 1.0 g of magnesium oxide. Run 2: 1.2 g made 2.0 g. Run 3: 2.4 g made 4.0 g.">
    <text x={30} y={26} fontSize="15" fontWeight="700" fill={ink}>Burning magnesium in excess oxygen</text>
    <rect x={20} y={40} width={500} height={182} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="14" fontWeight="700" fill={ink} textAnchor="middle">
      <text x={90} y={72}>run</text>
      <text x={250} y={64}>mass of</text><text x={250} y={82}>magnesium (g)</text>
      <text x={420} y={64}>mass of magnesium</text><text x={420} y={82}>oxide made (g)</text>
    </g>
    <path d="M32 96H508" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([run, mg, mgo], i) => {
      const y = 132 + i * 34
      return <g key={run} fontSize="16" fill={ink} textAnchor="middle">
        <text x={90} y={y}>{run}</text><text x={250} y={y} fontWeight="700">{mg}</text><text x={420} y={y} fontWeight="700">{mgo}</text>
      </g>
    })}
  </Diagram>
}

export function HigherMolesVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'hmole-mole-avogadro': return <MoleScene stage="avogadro" />
    case 'hmole-mole-one': return <MoleScene stage="one" />
    case 'hmole-mole-mass': return <MoleScene stage="mass" />
    case 'hmole-mole-formula': return <MoleScene stage="formula" />
    case 'hmole-mole-triangle': return <MoleScene stage="triangle" />
    case 'hmole-worked-moles': return <WorkedMoles />
    case 'hmole-worked-mass': return <WorkedMass />
    case 'hmole-eq-particles': return <EqScene stage="particles" />
    case 'hmole-eq-moles': return <EqScene stage="moles" />
    case 'hmole-eq-masses': return <EqScene stage="masses" />
    case 'hmole-eq-divide': return <EqScene stage="divide" />
    case 'hmole-eq-steps': return <EqScene stage="steps" />
    case 'hmole-worked-balance': return <MassTable header={<>?Fe + ?Cl₂ <tspan fill={muted}>→</tspan> ?FeCl₃</>} formulas={['Fe', 'Cl₂', 'FeCl₃']} masses={['11.2', '21.3', '32.5']} mrs={['56', '71', '162.5']} note={<>Divide each mass by its <R l="M" size={13} />, then divide by the smallest.</>}
      title="Worked example set-up: iron reacts with chlorine to make iron chloride, with the big numbers in the equation unknown. Masses: iron 11.2 g, chlorine Cl₂ 21.3 g, iron chloride FeCl₃ 32.5 g. Mr values: 56, 71 and 162.5. The moles are still to be worked out." />
    case 'hmole-question-al': return <MassTable header={<>?Al + ?Cl₂ <tspan fill={muted}>→</tspan> ?AlCl₃</>} formulas={['Al', 'Cl₂', 'AlCl₃']} masses={['5.4', '21.3', '26.7']} mrs={['27', '71', '133.5']}
      title="A table of reacting masses for aluminium, chlorine Cl₂ and aluminium chloride AlCl₃: 5.4 g, 21.3 g and 26.7 g. Mr values: 27, 71 and 133.5. The moles and the big numbers in the equation are unknown." />
    case 'hmole-data-methane': return <MassTable header={<>methane burning in oxygen</>} formulas={['CH₄', 'O₂', 'CO₂', 'H₂O']} masses={['1.6', '6.4', '4.4', '3.6']} mrs={['16', '32', '44', '18']}
      title="A table of reacting masses when methane burns. Methane CH₄ 1.6 g, Mr 16. Oxygen O₂ 6.4 g, Mr 32. Carbon dioxide CO₂ 4.4 g, Mr 44. Water H₂O 3.6 g, Mr 18. The moles are unknown." />
    case 'hmole-limit-used': return <LimitScene stage="used" />
    case 'hmole-limit-limiting': return <LimitScene stage="limiting" />
    case 'hmole-limit-excess': return <LimitScene stage="excess" />
    case 'hmole-limit-double': return <LimitScene stage="double" />
    case 'hmole-limit-steps': return <LimitScene stage="steps" />
    case 'hmole-worked-water': return <WorkedWater />
    case 'hmole-question-nh3': return <Nh3Card />
    case 'hmole-question-limiting': return <LimitingQuestion assessment={assessment} />
    case 'hmole-question-error': return <ErrorQuestion assessment={assessment} />
    case 'hmole-data-magnesium': return <MagnesiumData />
    default: return <MoleScene stage="triangle" />
  }
}
