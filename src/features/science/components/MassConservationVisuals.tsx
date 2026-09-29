import { useId, type ReactNode } from 'react'
import { Arrow } from './InfectionVisuals'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C3 (Chemistry Lesson 19): conservation of mass. Original, code-native schematics; not to scale.
 * Focus ids start with 'cons-'.
 *
 * Atoms use the same element colours as the relative-formula-mass lesson (H white · O soft red · Mg teal). Amber marks
 * what a frame is about (the numbers being used). Green is used only to say "the same on both sides". Ink, muted greys
 * and panels come from the Chemistry palette in AtomVisuals.tsx.
 */
const { ink, muted, panelFill, panelLine } = atomPalette
const amber = '#d98a1c', amberSoft = '#fdf0dc', amberInk = '#8a5a14'
const bad = '#c0504a', badSoft = '#fbe6e4', good = '#3f8a5f', goodSoft = '#e3f3e8', bondLine = '#7d8a94'

type El = 'H' | 'O' | 'Mg'
const EL: Record<El, { fill: string; line: string; text: string }> = {
  H: { fill: '#ffffff', line: '#8d9ba6', text: '#375a73' },
  O: { fill: '#f2a39b', line: '#c0625a', text: '#6e2621' },
  Mg: { fill: '#bfe3e0', line: '#4f9690', text: '#1f4f4b' },
}

function Diagram({ title, children, viewBox = '0 0 540 320', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function R({ l, size = 16 }: { l: 'A' | 'M'; size?: number }) {
  return <><tspan fontStyle="italic">{l}</tspan><tspan dy={size * .3} fontSize={Math.max(12, size * .75)}>r</tspan><tspan dy={-size * .3}>{'​'}</tspan></>
}
function Num({ n, x, y, colour = ink }: { n: number; x: number; y: number; colour?: string }) {
  return <g><circle cx={x} cy={y} r="13" fill="white" stroke={colour} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={colour}>{n}</text></g>
}
function Ball({ el, x, y, r }: { el: El; x: number; y: number; r?: number }) {
  const e = EL[el], rr = r ?? (el === 'H' ? 12 : 18)
  return <g><circle cx={x} cy={y} r={rr} fill={e.fill} stroke={e.line} strokeWidth="2" />
    <text x={x} y={y + (rr > 14 ? 6 : 5)} textAnchor="middle" fontSize={rr > 14 ? 15 : 13} fontWeight="700" fill={e.text}>{el}</text></g>
}
function Stick({ x1, x2, y }: { x1: number; x2: number; y: number }) { return <path d={`M${x1} ${y}H${x2}`} stroke={bondLine} strokeWidth="4" /> }
function Lines({ x, y, lines, gap = 20, anchor = 'start' }: { x: number; y: number; lines: Array<[ReactNode, 'b' | 'n' | 'm' | 'a' | 'good' | 'bad']>; gap?: number; anchor?: 'start' | 'middle' }) {
  const fill = { b: ink, n: ink, m: muted, a: amberInk, good, bad }
  return <g>{lines.map(([t, k], i) => t === '' ? null : <text key={i} x={x} y={y + i * gap} textAnchor={anchor} fontSize={k === 'm' ? 13 : 15} fontWeight={k === 'n' || k === 'm' ? 400 : 700} fill={fill[k]}>{t}</text>)}</g>
}
function Result({ x, y, w, children, tone = 'amber' }: { x: number; y: number; w: number; children: ReactNode; tone?: 'amber' | 'good' }) {
  return <g><rect x={x} y={y} width={w} height={36} rx="9" fill={tone === 'amber' ? amberSoft : goodSoft} stroke={tone === 'amber' ? amber : good} strokeWidth="2" />
    <text x={x + w / 2} y={y + 24} textAnchor="middle" fontSize="17" fontWeight="700" fill={tone === 'amber' ? amberInk : good}>{children}</text></g>
}
function Plus({ x, y }: { x: number; y: number }) { return <text x={x} y={y + 8} textAnchor="middle" fontSize="26" fontWeight="700" fill={ink}>+</text> }

// ---------- Section 1: 2Mg + O₂ → 2MgO, one picture built up frame by frame ----------
type AtomStage = 'move' | 'count' | 'balance' | 'mr'
const ATOM_TITLES: Record<AtomStage, string> = {
  move: 'The reaction 2Mg + O₂ → 2MgO drawn with atoms. Left: two separate magnesium atoms and one oxygen molecule of two joined oxygen atoms. Right: two magnesium oxide units, each a magnesium atom joined to an oxygen atom. Four atoms before and the same four atoms after.',
  count: 'The atoms in 2Mg + O₂ → 2MgO drawn above a tally. Magnesium: 2 atoms on the left and 2 on the right. Oxygen: 2 atoms on the left and 2 on the right. Both rows match.',
  balance: 'A level balance. The left pan holds the reactants: two magnesium atoms and two oxygen atoms. The right pan holds the products: two magnesium oxide units made of the same atoms. The beam is level, so the mass is the same.',
  mr: 'The equation 2Mg + O₂ → 2MgO with the total relative formula mass of each side. Left: 2 × 24 + 32 = 80. Right: 2 × 40 = 80. The totals are equal.',
}
function Reaction({ y, dim = false }: { y: number; dim?: boolean }) {
  return <g opacity={dim ? .55 : 1}>
    <Ball el="Mg" x={40} y={y} /><Ball el="Mg" x={90} y={y} />
    <Plus x={128} y={y} />
    <Stick x1={164} x2={200} y={y} /><Ball el="O" x={164} y={y} /><Ball el="O" x={200} y={y} />
    <Arrow x1={244} y1={y} x2={296} y2={y} />
    <Stick x1={344} x2={380} y={y} /><Ball el="Mg" x={344} y={y} /><Ball el="O" x={380} y={y} />
    <Stick x1={444} x2={480} y={y} /><Ball el="Mg" x={444} y={y} /><Ball el="O" x={480} y={y} />
  </g>
}
function Atoms({ stage }: { stage: AtomStage }) {
  if (stage === 'balance') return <Diagram title={ATOM_TITLES.balance}>
    <path d="M100 120H440" stroke={ink} strokeWidth="5" />
    <path d="M270 120V254M228 254H312" stroke={ink} strokeWidth="5" />
    <circle cx={270} cy={120} r="8" fill={amberSoft} stroke={amber} strokeWidth="2.5" />
    {[100, 440].map(x => <g key={x}><path d={`M${x} 120L${x - 85} 210M${x} 120L${x + 85} 210`} stroke={bondLine} strokeWidth="2" /><path d={`M${x - 92} 210H${x + 92}`} stroke={ink} strokeWidth="5" /></g>)}
    <Ball el="Mg" x={74} y={196} r={12} /><Ball el="Mg" x={100} y={196} r={12} /><Ball el="O" x={126} y={196} r={12} /><Ball el="O" x={152} y={196} r={12} />
    <Ball el="Mg" x={402} y={196} r={12} /><Ball el="O" x={426} y={196} r={12} /><Ball el="Mg" x={454} y={196} r={12} /><Ball el="O" x={478} y={196} r={12} />
    <Lines x={100} y={240} anchor="middle" lines={[['reactants', 'b']]} />
    <Lines x={440} y={240} anchor="middle" lines={[['products', 'b']]} />
    <Lines x={270} y={70} anchor="middle" lines={[['The beam stays level:', 'n'], ['the same atoms, so the same mass.', 'a']]} />
    <Result x={170} y={274} w={200} tone="good">mass is conserved</Result>
  </Diagram>
  if (stage === 'mr') return <Diagram title={ATOM_TITLES.mr}>
    <text x={270} y={56} textAnchor="middle" fontSize="30" fontWeight="700" fill={ink}>2Mg + O₂ <tspan fill={muted}>→</tspan> 2MgO</text>
    <Reaction y={110} dim />
    <rect x={20} y={158} width={230} height={96} rx="12" fill={panelFill} stroke={amber} strokeWidth="2" />
    <rect x={290} y={158} width={230} height={96} rx="12" fill={panelFill} stroke={amber} strokeWidth="2" />
    <Lines x={135} y={184} anchor="middle" lines={[['Left-hand side', 'm'], [<>(2 × 24) + 32</>, 'n'], ['= 80', 'a']]} gap={24} />
    <Lines x={405} y={184} anchor="middle" lines={[['Right-hand side', 'm'], [<>2 × (24 + 16)</>, 'n'], ['= 80', 'a']]} gap={24} />
    <text x={270} y={214} textAnchor="middle" fontSize="30" fontWeight="700" fill={good}>=</text>
    <Result x={130} y={270} w={280} tone="good">same total <R l="M" size={17} /> on both sides</Result>
  </Diagram>
  const count = stage === 'count'
  return <Diagram title={ATOM_TITLES[stage]}>
    <text x={270} y={46} textAnchor="middle" fontSize="28" fontWeight="700" fill={ink}>2Mg + O₂ <tspan fill={muted}>→</tspan> 2MgO</text>
    <Reaction y={110} />
    {stage === 'move' && <g>
      <path d="M26 142V152H104V142" stroke={amber} strokeWidth="2.5" fill="none" /><path d="M148 142V152H216V142" stroke={amber} strokeWidth="2.5" fill="none" />
      <path d="M330 142V152H494V142" stroke={amber} strokeWidth="2.5" fill="none" />
      <Lines x={120} y={178} anchor="middle" lines={[['4 atoms before', 'a']]} />
      <Lines x={412} y={178} anchor="middle" lines={[['the same 4 atoms after', 'a']]} />
      <Lines x={270} y={232} anchor="middle" lines={[['The atoms swap partners.', 'b'], ['None are lost. None are made.', 'b']]} gap={26} />
    </g>}
    {count && <g>
      <rect x={70} y={150} width={400} height={126} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
      <text x={190} y={178} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>before</text>
      <text x={350} y={178} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>after</text>
      {([['Mg', 2, 2], ['O', 2, 2]] as Array<[El, number, number]>).map(([el, a, b], i) => {
        const y = 214 + i * 42
        return <g key={el}><Ball el={el} x={112} y={y - 6} r={15} />
          <text x={190} y={y} textAnchor="middle" fontSize="22" fontWeight="700" fill={ink}>{a}</text>
          <text x={270} y={y} textAnchor="middle" fontSize="24" fontWeight="700" fill={good}>=</text>
          <text x={350} y={y} textAnchor="middle" fontSize="22" fontWeight="700" fill={ink}>{b}</text>
          <path d={`M420 ${y - 8}l8 9 16 -18`} stroke={good} strokeWidth="3.5" fill="none" /></g>
      })}
    </g>}
  </Diagram>
}

// Worked example set-up: 2H₂ + O₂ → 2H₂O (the sums are left for the steps).
function WaterExample() {
  const y = 130
  return <Diagram title="Worked example set-up: 2H₂ + O₂ → 2H₂O drawn with atoms. Two hydrogen molecules and one oxygen molecule on the left, two water molecules on the right. Relative atomic masses: hydrogen 1, oxygen 16. The two totals of relative formula mass are still to be worked out and compared.">
    <text x={270} y={46} textAnchor="middle" fontSize="28" fontWeight="700" fill={ink}>2H₂ + O₂ <tspan fill={muted}>→</tspan> 2H₂O</text>
    {[36, 96].map(x => <g key={x}><Stick x1={x} x2={x + 24} y={y} /><Ball el="H" x={x} y={y} /><Ball el="H" x={x + 24} y={y} /></g>)}
    <Plus x={148} y={y} />
    <Stick x1={190} x2={226} y={y} /><Ball el="O" x={190} y={y} /><Ball el="O" x={226} y={y} />
    <Arrow x1={262} y1={y} x2={306} y2={y} />
    {[352, 452].map(x => <g key={x}><Stick x1={x - 20} x2={x + 20} y={y} /><Ball el="H" x={x - 26} y={y - 12} /><Ball el="O" x={x} y={y + 4} /><Ball el="H" x={x + 26} y={y - 12} /></g>)}
    <text x={270} y={196} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}><R l="A" />: H = 1, O = 16</text>
    <Lines x={40} y={236} lines={[[<>Left: (2 × <R l="M" size={15} /> of H₂) + <R l="M" size={15} /> of O₂</>, 'n'], [<>Right: 2 × <R l="M" size={15} /> of H₂O</>, 'n']]} gap={28} />
  </Diagram>
}

// ---------- Section 2: finding a missing mass ----------
type MissData = { left: [string[], string]; left2: [string[], string]; right: [string[], string]; right2: [string[], string]; total: string; take: string; known: string; ans: string; k1: number; k2: number; k3: number; k4: number }
const ZN: MissData = { left: [['zinc'], '6.5'], left2: [['copper', 'sulfate'], '16.0'], right: [['copper'], '6.4'], right2: [['zinc', 'sulfate'], '16.1'], total: '6.5 + 16.0 = 22.5', take: '22.5 − 6.4 = 16.1', known: '6.4', ans: '16.1', k1: 6.5, k2: 16.0, k3: 6.4, k4: 16.1 }
const MG: MissData = { left: [['magnesium'], '2.4'], left2: [['copper', 'sulfate'], '16.0'], right: [['copper'], '6.4'], right2: [['magnesium', 'sulfate'], '12.0'], total: '2.4 + 16.0 = 18.4', take: '18.4 − 6.4 = 12.0', known: '6.4', ans: '12.0', k1: 2.4, k2: 16.0, k3: 6.4, k4: 12.0 }
type MissStage = 'setup' | 'left' | 'take' | 'bar'
const MISS_TITLES: Record<MissStage, string> = {
  setup: 'Four boxes for the reaction of zinc with copper sulfate: zinc 6.5 g plus copper sulfate 16.0 g makes copper 6.4 g plus zinc sulfate, whose mass is not known and shown as a question mark.',
  left: 'The same four boxes with the two reactant masses highlighted and added: 6.5 + 16.0 = 22.5 g. The zinc sulfate mass is still a question mark.',
  take: 'The same four boxes. The products must also total 22.5 g. The copper is 6.4 g, so zinc sulfate is 22.5 − 6.4 = 16.1 g.',
  bar: 'Two bars drawn to the same scale. The reactants bar is zinc 6.5 g and copper sulfate 16.0 g, 22.5 g in all. The products bar is copper 6.4 g and zinc sulfate 16.1 g, also 22.5 g. The bars are equally long.',
}
function MassBox({ x, y, names, mass, hot, unknown }: { x: number; y: number; names: string[]; mass: string; hot: boolean; unknown: boolean }) {
  return <g>
    <rect x={x} y={y} width={92} height={84} rx="12" fill={unknown ? 'white' : hot ? amberSoft : panelFill} stroke={hot || unknown ? amber : panelLine} strokeWidth={hot || unknown ? 2.5 : 1.5} strokeDasharray={unknown ? '6 5' : undefined} />
    {names.map((n, i) => <text key={i} x={x + 46} y={y + 22 + i * 17} textAnchor="middle" fontSize="14" fill={ink}>{n}</text>)}
    <text x={x + 46} y={y + 70} textAnchor="middle" fontSize="20" fontWeight="700" fill={unknown ? amberInk : hot ? amberInk : ink}>{unknown ? '? g' : `${mass} g`}</text>
  </g>
}
function Bars({ d }: { d: MissData }) {
  const total = d.k1 + d.k2, sc = 400 / total, x0 = 70
  const seg = (y: number, a: number, b: number, na: string, nb: string, hotB: boolean) => <g>
    <rect x={x0} y={y} width={a * sc} height={40} fill="#e8eef2" stroke={panelLine} strokeWidth="1.5" />
    <rect x={x0 + a * sc} y={y} width={b * sc} height={40} fill={hotB ? amberSoft : '#f2f6f8'} stroke={hotB ? amber : panelLine} strokeWidth={hotB ? 2.5 : 1.5} />
    <text x={x0 + a * sc / 2} y={y + 25} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{na}</text>
    <text x={x0 + a * sc + b * sc / 2} y={y + 25} textAnchor="middle" fontSize="15" fontWeight="700" fill={hotB ? amberInk : ink}>{nb}</text></g>
  return <g>
    <text x={x0} y={68} fontSize="15" fontWeight="700" fill={ink}>reactants: {total.toFixed(1)} g</text>
    {seg(78, d.k1, d.k2, `${d.k1.toFixed(1)} g`, `${d.k2.toFixed(1)} g`, false)}
    <text x={x0} y={162} fontSize="15" fontWeight="700" fill={ink}>products: {total.toFixed(1)} g</text>
    {seg(172, d.k3, d.k4, `${d.k3.toFixed(1)} g`, `${d.k4.toFixed(1)} g`, true)}
  </g>
}
function Missing({ stage, d, title }: { stage: MissStage; d: MissData; title: string }) {
  const hotL = stage === 'left', hotR = stage === 'take'
  const names = [d.left[0], d.left2[0], d.right[0], d.right2[0]]
  return <Diagram title={title}>
    {stage !== 'bar' && <g>
      <MassBox x={10} y={40} names={names[0]} mass={d.left[1]} hot={hotL} unknown={false} />
      <Plus x={118} y={82} />
      <MassBox x={134} y={40} names={names[1]} mass={d.left2[1]} hot={hotL} unknown={false} />
      <Arrow x1={238} y1={82} x2={278} y2={82} />
      <MassBox x={290} y={40} names={names[2]} mass={d.right[1]} hot={hotR} unknown={false} />
      <Plus x={398} y={82} />
      <MassBox x={414} y={40} names={names[3]} mass={d.right2[1]} hot={hotR} unknown={stage !== 'take'} />
      {stage === 'left' && <g>
        <path d="M20 138V150H226V138" stroke={amber} strokeWidth="2.5" fill="none" />
        <Lines x={124} y={178} anchor="middle" lines={[[d.total + ' g', 'a']]} />
        <Lines x={270} y={232} anchor="middle" lines={[['The products must add up', 'n'], ['to the same total.', 'n']]} />
      </g>}
      {stage === 'take' && <g>
        <path d="M300 138V150H506V138" stroke={amber} strokeWidth="2.5" fill="none" />
        <Lines x={404} y={178} anchor="middle" lines={[[`${d.total.split(' = ')[1]} g in all`, 'a']]} />
        <Result x={90} y={214} w={360}>{d.take} g</Result>
      </g>}
      {stage === 'setup' && <Lines x={270} y={170} anchor="middle" lines={[['Every mass is known except one.', 'b'], ['Mass is conserved, so it can be found.', 'n']]} gap={26} />}
    </g>}
    {stage === 'bar' && <g>
      <Bars d={d} />
      <text x={270} y={148} textAnchor="middle" fontSize="26" fontWeight="700" fill={good}>=</text>
      <Lines x={70} y={258} lines={[['1  total the side where every mass is known', 'n'], ['2  take away the known masses on the other side', 'n'], ['3  the difference is the missing mass', 'a']]} gap={24} />
    </g>}
  </Diagram>
}
function MgExample() {
  return <Missing stage="setup" d={MG} title="Worked example set-up: magnesium 2.4 g plus copper sulfate 16.0 g makes copper 6.4 g plus magnesium sulfate, whose mass is not known and shown as a question mark." />
}

// ---------- Question visuals ----------
function EquationQuestion({ assessment }: { assessment: boolean }) {
  const rows: Array<{ eq: ReactNode; ok: boolean; note: string }> = [
    { eq: '2Na + Cl₂ → 2NaCl', ok: true, note: 'Na 2 = 2, Cl 2 = 2' },
    { eq: 'Ca + O₂ → 2CaO', ok: false, note: 'Ca 1 ≠ 2' },
    { eq: '2Mg + O₂ → 2MgO', ok: true, note: 'Mg 2 = 2, O 2 = 2' },
    { eq: '2H₂ + O₂ → 2H₂O', ok: true, note: 'H 4 = 4, O 2 = 2' },
  ]
  return <Diagram viewBox="0 0 540 290" schematic={false} title={assessment
    ? 'Four symbol equations from a student, numbered 1 to 4. Line 1: 2Na + Cl₂ → 2NaCl. Line 2: Ca + O₂ → 2CaO. Line 3: 2Mg + O₂ → 2MgO. Line 4: 2H₂ + O₂ → 2H₂O.'
    : 'Four symbol equations from a student, numbered 1 to 4, with atom counts. Line 2, Ca + O₂ → 2CaO, is not balanced: one calcium atom on the left and two on the right. The other three lines have the same atoms on both sides.'}>
    <text x={20} y={30} fontSize="16" fontWeight="700" fill={ink}>A student’s four equations</text>
    {rows.map((r, i) => {
      const y = 48 + i * 58, wrong = !assessment && !r.ok
      return <g key={i}>
        <rect x={20} y={y} width={500} height={48} rx="10" fill={wrong ? badSoft : panelFill} stroke={wrong ? bad : panelLine} strokeWidth="1.5" />
        <Num n={i + 1} x={48} y={y + 24} colour={wrong ? bad : ink} />
        <text x={76} y={y + 31} fontSize="20" fontWeight="700" fill={wrong ? bad : ink}>{r.eq}</text>
        {!assessment && <text x={500} y={y + 30} textAnchor="end" fontSize="14" fontWeight="700" fill={r.ok ? good : bad}>{r.note}</text>}
      </g>
    })}
  </Diagram>
}
function SealedData() {
  const rows: Array<[string, string, string]> = [['A', '120.4', '120.4'], ['B', '135.0', '135.0'], ['C', '128.6', '128.6']]
  return <Diagram viewBox="0 0 540 230" schematic={false} title="A data table of three reactions, each carried out in a sealed flask. Mass of the flask and contents before and after the reaction, in grams. Run A: 120.4 before, 120.4 after. Run B: 135.0 before, 135.0 after. Run C: 128.6 before, 128.6 after.">
    <text x={30} y={26} fontSize="15" fontWeight="700" fill={ink}>Three reactions in sealed flasks</text>
    <rect x={20} y={40} width={500} height={176} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="14" fontWeight="700" fill={ink}>
      <text x={60} y={70} textAnchor="middle">run</text>
      <text x={230} y={62} textAnchor="middle">mass before</text><text x={230} y={78} textAnchor="middle">(g)</text>
      <text x={410} y={62} textAnchor="middle">mass after</text><text x={410} y={78} textAnchor="middle">(g)</text>
    </g>
    <path d="M32 90H508" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([n, a, b], i) => <g key={n} fontSize="16" fill={ink}><text x={60} y={122 + i * 34} textAnchor="middle" fontWeight="700">{n}</text><text x={230} y={122 + i * 34} textAnchor="middle">{a}</text><text x={410} y={122 + i * 34} textAnchor="middle">{b}</text></g>)}
  </Diagram>
}

export function MassConservationVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'cons-atoms-move': return <Atoms stage="move" />
    case 'cons-atoms-count': return <Atoms stage="count" />
    case 'cons-mass-balance': return <Atoms stage="balance" />
    case 'cons-mr-sum': return <Atoms stage="mr" />
    case 'cons-worked-water': return <WaterExample />
    case 'cons-miss-setup': return <Missing stage="setup" d={ZN} title={MISS_TITLES.setup} />
    case 'cons-miss-left': return <Missing stage="left" d={ZN} title={MISS_TITLES.left} />
    case 'cons-miss-take': return <Missing stage="take" d={ZN} title={MISS_TITLES.take} />
    case 'cons-miss-bar': return <Missing stage="bar" d={ZN} title={MISS_TITLES.bar} />
    case 'cons-worked-mg': return <MgExample />
    case 'cons-question-equations': return <EquationQuestion assessment={assessment} />
    case 'cons-data-sealed': return <SealedData />
    default: return <Atoms stage="move" />
  }
}
