import { useId, type ReactNode } from 'react'
import { Arrow } from './InfectionVisuals'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C3 (Chemistry Lesson 18): relative formula mass. Original, code-native schematics; not to scale.
 * Focus ids start with 'mr-'.
 *
 * Atoms are soft-filled circles with their symbol inside and a darker stroke of the same hue, in the element colours
 * the formulas lesson uses (H white · C dark grey · O soft red · Mg teal), plus sand for sodium. Under each atom sits a
 * small tag with its relative atomic mass. Covalent bonds (C=O, O–H) are grey sticks; atoms in an ionic compound are
 * drawn apart with no sticks, because the lesson only counts them.
 * Amber marks what the frame is about (the numbers being used, the step being done). Ink, muted greys and panels come
 * from the Chemistry palette in AtomVisuals.tsx. Every number drawn is the real Aᵣ (AQA periodic table values).
 */
const { ink, muted, panelFill, panelLine } = atomPalette
const amber = '#d98a1c', amberSoft = '#fdf0dc', amberInk = '#8a5a14'
const bad = '#c0504a', badSoft = '#fbe6e4', good = '#3f8a5f', goodSoft = '#e3f3e8', bondLine = '#7d8a94'
const faded = 0.3

type El = 'H' | 'C' | 'O' | 'Mg' | 'Na'
const EL: Record<El, { fill: string; line: string; text: string; name: string; ar: number; z: number }> = {
  H: { fill: '#ffffff', line: '#8d9ba6', text: '#375a73', name: 'hydrogen', ar: 1, z: 1 },
  C: { fill: '#5f6b75', line: '#3c464e', text: '#ffffff', name: 'carbon', ar: 12, z: 6 },
  O: { fill: '#f2a39b', line: '#c0625a', text: '#6e2621', name: 'oxygen', ar: 16, z: 8 },
  Mg: { fill: '#bfe3e0', line: '#4f9690', text: '#1f4f4b', name: 'magnesium', ar: 24, z: 12 },
  Na: { fill: '#f3dfbf', line: '#b98646', text: '#5e3d12', name: 'sodium', ar: 23, z: 11 },
}

function Diagram({ title, children, viewBox = '0 0 540 320', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
/** Aᵣ or Mᵣ with an italic capital and a lowered r. */
function R({ l, size = 16 }: { l: 'A' | 'M'; size?: number }) {
  return <><tspan fontStyle="italic">{l}</tspan><tspan dy={size * .3} fontSize={Math.max(12, size * .75)}>r</tspan><tspan dy={-size * .3}>{'​'}</tspan></>
}
function Num({ n, x, y, colour = ink, on = true }: { n: number; x: number; y: number; colour?: string; on?: boolean }) {
  return <g><circle cx={x} cy={y} r="12" fill={on ? colour : 'white'} stroke={colour} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill={on ? 'white' : colour}>{n}</text></g>
}

// ---------- Atoms, tags and periodic-table boxes ----------
function Ball({ el, x, y, r = 22 }: { el: El; x: number; y: number; r?: number }) {
  const e = EL[el]
  return <g data-atom={el}><circle cx={x} cy={y} r={el === 'H' ? r - 6 : r} fill={e.fill} stroke={e.line} strokeWidth="2" />
    <text x={x} y={y + 6} textAnchor="middle" fontSize={el.length > 1 ? 16 : 18} fontWeight="700" fill={e.text}>{el}</text></g>
}
function Tag({ x, y, value, hot = false, show = true }: { x: number; y: number; value: string; hot?: boolean; show?: boolean }) {
  if (!show) return null
  return <g><rect x={x - 20} y={y} width={40} height={26} rx="7" fill={hot ? amberSoft : panelFill} stroke={hot ? amber : panelLine} strokeWidth={hot ? 2 : 1.5} />
    <text x={x} y={y + 18} textAnchor="middle" fontSize="15" fontWeight="700" fill={hot ? amberInk : ink}>{value}</text></g>
}
function Stick({ x1, x2, y, double = false }: { x1: number; x2: number; y: number; double?: boolean }) {
  return double ? <path d={`M${x1} ${y - 4}H${x2}M${x1} ${y + 4}H${x2}`} stroke={bondLine} strokeWidth="3.5" /> : <path d={`M${x1} ${y}H${x2}`} stroke={bondLine} strokeWidth="4" />
}
/** A periodic-table box laid out like the AQA data sheet: relative atomic mass on top, atomic number at the bottom. */
function Box({ el, x, y, hot = false }: { el: El; x: number; y: number; hot?: boolean }) {
  const e = EL[el]
  return <g>
    <rect x={x} y={y} width={70} height={86} rx="8" fill={panelFill} stroke={hot ? amber : panelLine} strokeWidth={hot ? 2.5 : 1.8} />
    <text x={x + 35} y={y + 20} textAnchor="middle" fontSize="16" fontWeight="700" fill={hot ? amberInk : ink}>{e.ar}</text>
    <text x={x + 35} y={y + 47} textAnchor="middle" fontSize="24" fontWeight="700" fill={ink}>{el}</text>
    <text x={x + 35} y={y + 63} textAnchor="middle" fontSize="12" fill={ink}>{e.name}</text>
    <text x={x + 35} y={y + 79} textAnchor="middle" fontSize="12" fill={muted}>{e.z}</text>
  </g>
}
function Lines({ x, y, lines, gap = 19 }: { x: number; y: number; lines: Array<[ReactNode, 'b' | 'n' | 'm' | 'a' | 'bad' | 'good']>; gap?: number }) {
  const fill = { b: ink, n: ink, m: muted, a: amberInk, bad, good }
  return <g>{lines.map(([t, k], i) => t === '' ? null : <text key={i} x={x} y={y + i * gap} fontSize={k === 'm' ? 13 : 14} fontWeight={k === 'n' || k === 'm' ? 400 : 700} fill={fill[k]}>{t}</text>)}</g>
}
function Result({ x, y, w, children, tone = 'amber' }: { x: number; y: number; w: number; children: ReactNode; tone?: 'amber' | 'good' }) {
  return <g><rect x={x} y={y} width={w} height={36} rx="9" fill={tone === 'amber' ? amberSoft : goodSoft} stroke={tone === 'amber' ? amber : good} strokeWidth="2" />
    <text x={x + w / 2} y={y + 24} textAnchor="middle" fontSize="17" fontWeight="700" fill={tone === 'amber' ? amberInk : good}>{children}</text></g>
}

// ---------- Section 1: one molecule of carbon dioxide, built up frame by frame ----------
type Co2Stage = 'tiles' | 'add' | 'multiply' | 'method'
const CO2_TITLES: Record<Co2Stage, string> = {
  tiles: 'The periodic-table boxes for carbon and oxygen. The top number in each box is the relative atomic mass: carbon 12, oxygen 16. The bottom number is the atomic number. Below them is one molecule of carbon dioxide, CO₂: an oxygen atom, a carbon atom and another oxygen atom.',
  add: 'One molecule of carbon dioxide with the relative atomic mass under each atom: oxygen 16, carbon 12, oxygen 16. Adding them all gives 16 + 12 + 16 = 44. This total is the relative formula mass, Mr, of CO₂.',
  multiply: 'The same molecule with both oxygen tags highlighted. There are two oxygen atoms, so 2 × 16 = 32. Then add the carbon: 12 + 32 = 44, the same Mr as before.',
  method: 'The whole calculation in three numbered steps: 1, look up each relative atomic mass (carbon 12, oxygen 16); 2, count the atoms in CO₂ (one carbon, two oxygen); 3, multiply and add: Mr = 12 + (2 × 16) = 44.',
}
function Co2({ stage }: { stage: Co2Stage }) {
  const tiles = stage === 'tiles', method = stage === 'method'
  const atoms: Array<[El, number]> = [['O', 110], ['C', 180], ['O', 250]]
  const y = 170
  return <Diagram title={CO2_TITLES[stage]}>
    <text x={20} y={66} fontSize="34" fontWeight="700" fill={ink}>CO₂</text>
    <g opacity={tiles || method ? 1 : .55}><Box el="C" x={112} y={16} hot={tiles} /><Box el="O" x={196} y={16} hot={tiles} /></g>
    {/* the molecule: O=C=O */}
    <Stick x1={110} x2={180} y={y} double /><Stick x1={180} x2={250} y={y} double />
    {atoms.map(([el, x], i) => <Ball key={i} el={el} x={x} y={y} />)}
    {atoms.map(([el, x], i) => <Tag key={`t${i}`} x={x} y={y + 30} value={String(EL[el].ar)} show={!tiles} hot={stage === 'add' || (stage === 'multiply' && el === 'O')} />)}
    {tiles && <text x={180} y={y + 50} textAnchor="middle" fontSize="13" fill={muted}>one molecule of carbon dioxide</text>}
    {stage === 'add' && <text x={20} y={262} fontSize="20" fontWeight="700" fill={ink}>16 + 12 + 16 = 44</text>}
    {(stage === 'multiply' || method) && <text x={20} y={262} fontSize="20" fontWeight="700" fill={ink}>12 + (<tspan fill={amberInk}>2 × 16</tspan>) = 44</text>}
    {!tiles && <Result x={20} y={278} w={300}><R l="M" size={17} /> of CO₂ = 44</Result>}
    {tiles && <g>
      <Arrow x1={362} y1={32} x2={272} y2={32} colour={amber} width={2.5} />
      <Lines x={370} y={37} lines={[['relative atomic', 'a'], [<>mass, <R l="A" size={14} /></>, 'a']]} />
      <Arrow x1={362} y1={96} x2={272} y2={96} colour={muted} width={2} />
      <Lines x={370} y={101} lines={[['atomic number', 'm']]} />
      <Lines x={300} y={176} lines={[['C = 12', 'b'], ['O = 16', 'b']]} gap={22} />
    </g>}
    {stage === 'add' && <Lines x={340} y={150} lines={[[<>Add the <R l="A" size={14} /> of</>, 'n'], ['every atom.', 'n'], ['', 'n'], ['The total is the', 'a'], ['relative formula', 'a'], [<>mass, <R l="M" size={14} />.</>, 'a']]} />}
    {stage === 'multiply' && <Lines x={340} y={150} lines={[['Two oxygen atoms:', 'n'], ['2 × 16 = 32', 'a'], ['', 'n'], ['One carbon atom:', 'n'], ['12', 'b'], ['', 'n'], ['12 + 32 = 44', 'b']]} />}
    {method && <g>
      <Num n={1} x={352} y={50} colour={amber} /><Lines x={372} y={46} lines={[[<>look up each <R l="A" size={14} /></>, 'b'], ['C = 12, O = 16', 'n']]} />
      <Num n={2} x={352} y={160} colour={amber} /><Lines x={372} y={156} lines={[['count the atoms', 'b'], ['1 C, 2 O', 'n']]} />
      <Num n={3} x={352} y={256} colour={amber} /><Lines x={372} y={252} lines={[['multiply, then add', 'b'], ['12 + (2 × 16)', 'n']]} />
    </g>}
  </Diagram>
}

// Worked example: sodium oxide, Na₂O (set-up only; the steps give the answer).
function Na2oExample() {
  const atoms: Array<[El, number]> = [['Na', 90], ['Na', 150], ['O', 210]], y = 150
  return <Diagram title="Worked example set-up for sodium oxide, Na₂O. Relative atomic masses: sodium 23, oxygen 16. The formula has two sodium atoms and one oxygen atom, drawn in a row with 23, 23 and 16 under them. The sum to do is Mr = (2 × 23) + 16.">
    <text x={20} y={60} fontSize="34" fontWeight="700" fill={ink}>Na₂O</text>
    <text x={150} y={56} fontSize="16" fontWeight="700" fill={ink}><R l="A" />: Na = 23, O = 16</text>
    <rect x={50} y={100} width={200} height={100} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    {atoms.map(([el, x], i) => <g key={i}><Ball el={el} x={x} y={y - 12} /><Tag x={x} y={y + 18} value={String(EL[el].ar)} hot={el === 'Na'} /></g>)}
    <Lines x={290} y={136} lines={[['2 sodium atoms', 'a'], ['1 oxygen atom', 'b'], ['', 'n'], ['Count the atoms in', 'm'], ['the formula, then', 'm'], ['multiply and add.', 'm']]} />
    <text x={20} y={262} fontSize="20" fontWeight="700" fill={ink}><R l="M" size={20} /> = (<tspan fill={amberInk}>2 × 23</tspan>) + 16</text>
  </Diagram>
}

// ---------- Section 2: brackets, with magnesium hydroxide Mg(OH)₂ ----------
type BracketStage = 'count' | 'inside' | 'times' | 'total'
const BRACKET_TITLES: Record<BracketStage, string> = {
  count: 'The formula Mg(OH)₂ with the bracket and the small 2 highlighted. Below it: one magnesium atom and two OH groups, each an oxygen atom joined to a hydrogen atom. The 2 doubles everything inside the bracket.',
  inside: 'Mg(OH)₂ with relative atomic masses under each atom: magnesium 24, oxygen 16, hydrogen 1. The first OH group is highlighted: 16 + 1 = 17.',
  times: 'Both OH groups are highlighted, each worth 17. Two groups: 2 × 17 = 34.',
  total: 'Magnesium 24 plus the two OH groups 34 gives Mr = 58 for Mg(OH)₂. A crossed-out wrong answer, 24 + 16 + (2 × 1) = 42, shows the mistake of doubling only the hydrogen.',
}
function Bracket({ stage }: { stage: BracketStage }) {
  const y = 158, groups = [[110, 160], [236, 286]] as const
  const tags = stage !== 'count'
  const g1 = stage === 'inside' || stage === 'times', g2 = stage === 'times'
  return <Diagram title={BRACKET_TITLES[stage]}>
    <text x={20} y={60} fontSize="34" fontWeight="700" fill={ink}>Mg<tspan fill={stage === 'count' ? amberInk : ink}>(OH)₂</tspan></text>
    {stage === 'count'
      ? <Lines x={200} y={40} lines={[['The 2 after the bracket', 'a'], ['doubles everything inside it.', 'a']]} />
      : <text x={200} y={50} fontSize="16" fontWeight="700" fill={ink}><R l="A" />: Mg = 24, O = 16, H = 1</text>}
    <Ball el="Mg" x={50} y={y} />
    {groups.map(([ox, hx], i) => {
      const hot = i === 0 ? g1 || stage === 'count' : g2 || stage === 'count'
      return <g key={i} opacity={stage === 'inside' && i === 1 ? .45 : 1}>
        <rect x={ox - 32} y={y - 34} width={hx - ox + 64} height={68} rx="14" fill="none" stroke={hot ? amber : panelLine} strokeWidth={hot ? 2.2 : 1.6} strokeDasharray="6 5" />
        <Stick x1={ox} x2={hx} y={y} />
        <Ball el="O" x={ox} y={y} /><Ball el="H" x={hx} y={y} />
        <Tag x={ox} y={y + 44} value="16" show={tags} hot={i === 0 ? g1 : g2} /><Tag x={hx} y={y + 44} value="1" show={tags} hot={i === 0 ? g1 : g2} />
      </g>
    })}
    <Tag x={50} y={y + 44} value="24" show={tags} hot={stage === 'total'} />
    {stage === 'count' && <g>
      <text x={50} y={y + 62} textAnchor="middle" fontSize="13" fill={muted}>1 Mg</text>
      <text x={198} y={y + 62} textAnchor="middle" fontSize="13" fill={muted}>2 O and 2 H</text>
    </g>}
    {stage === 'inside' && <text x={20} y={272} fontSize="20" fontWeight="700" fill={ink}>one OH: <tspan fill={amberInk}>16 + 1 = 17</tspan></text>}
    {stage === 'times' && <text x={20} y={272} fontSize="20" fontWeight="700" fill={ink}>two OH: <tspan fill={amberInk}>2 × 17 = 34</tspan></text>}
    {stage === 'total' && <g>
      <text x={20} y={262} fontSize="20" fontWeight="700" fill={ink}>24 + 34 = 58</text>
      <Result x={20} y={278} w={250}><R l="M" size={17} /> of Mg(OH)₂ = 58</Result>
      <rect x={330} y={120} width={194} height={110} rx="10" fill={badSoft} stroke={bad} strokeWidth="1.5" />
      <Lines x={344} y={146} lines={[['Mistake:', 'bad'], ['24 + 16 + (2 × 1) = 42', 'n'], ['doubles only the H', 'bad'], ['The 2 doubles O too.', 'b']]} gap={21} />
      <path d="M344 162H508" stroke={bad} strokeWidth="2" />
    </g>}
    {(stage === 'inside' || stage === 'times') && <Lines x={340} y={150} lines={stage === 'inside'
      ? [['Start inside', 'n'], ['the bracket:', 'n'], ['O + H', 'a'], ['16 + 1 = 17', 'a']]
      : [['Then multiply by', 'n'], ['the small 2:', 'n'], ['2 × 17 = 34', 'a']]} />}
  </Diagram>
}

// ---------- Section 3: percentage mass, with magnesium oxide MgO ----------
type PcStage = 'share' | 'rule' | 'steps' | 'worked'
const PC_TITLES: Record<PcStage, string> = {
  share: 'A bar for the relative formula mass of magnesium oxide, MgO, which is 24 + 16 = 40. Magnesium makes up 24 of it and oxygen 16, so more than half the mass is magnesium.',
  rule: 'The rule: percentage mass of an element equals its Ar times its number of atoms in the formula, divided by the Mr of the compound, times 100.',
  steps: 'Three steps for magnesium in MgO: 1, work out Mr = 24 + 16 = 40; 2, magnesium’s part = 24 × 1 = 24; 3, divide by the Mr and multiply by 100.',
  worked: 'Worked example set-up for magnesium in MgO: percentage mass of magnesium = (24 × 1) divided by 40, times 100.',
}
function Fraction({ x, y, top, bottom, width, size = 16 }: { x: number; y: number; top: ReactNode; bottom: ReactNode; width: number; size?: number }) {
  return <g>
    <text x={x} y={y - 10} textAnchor="middle" fontSize={size} fontWeight="700" fill={ink}>{top}</text>
    <path d={`M${x - width / 2} ${y}H${x + width / 2}`} stroke={ink} strokeWidth="2" />
    <text x={x} y={y + size + 8} textAnchor="middle" fontSize={size} fontWeight="700" fill={ink}>{bottom}</text>
  </g>
}
function Percentage({ stage }: { stage: PcStage }) {
  const x0 = 40, w = 460, mgW = w * 24 / 40, barY = 96
  const bar = <g opacity={stage === 'rule' ? .45 : 1}>
    <text x={20} y={44} fontSize="30" fontWeight="700" fill={ink}>MgO</text>
    <text x={110} y={42} fontSize="16" fontWeight="700" fill={ink}><R l="M" /> = 24 + 16 = 40</text>
    <rect x={x0} y={barY} width={mgW} height={44} rx="6" fill={EL.Mg.fill} stroke={EL.Mg.line} strokeWidth="2" />
    <rect x={x0 + mgW} y={barY} width={w - mgW} height={44} rx="6" fill={EL.O.fill} stroke={EL.O.line} strokeWidth="2" />
    <text x={x0 + mgW / 2} y={barY + 28} textAnchor="middle" fontSize="16" fontWeight="700" fill={EL.Mg.text}>magnesium: 24</text>
    <text x={x0 + mgW + (w - mgW) / 2} y={barY + 28} textAnchor="middle" fontSize="16" fontWeight="700" fill={EL.O.text}>oxygen: 16</text>
    <path d={`M${x0} ${barY - 10}V${barY - 18}H${x0 + w}V${barY - 10}`} fill="none" stroke={ink} strokeWidth="1.8" />
    <text x={x0 + w / 2} y={barY - 24} textAnchor="middle" fontSize="13" fill={ink}>whole compound: 40</text>
  </g>
  return <Diagram title={PC_TITLES[stage]} schematic={false}>
    {bar}
    {stage === 'share' && <g>
      <path d={`M${x0} ${barY + 52}V${barY + 60}H${x0 + mgW}V${barY + 52}`} fill="none" stroke={amber} strokeWidth="2" />
      <text x={x0 + mgW / 2} y={barY + 80} textAnchor="middle" fontSize="14" fontWeight="700" fill={amberInk}>magnesium’s part</text>
      <Lines x={40} y={236} lines={[['24 out of 40 is more than half,', 'b'], ['so most of the mass of MgO is magnesium.', 'b'], ['The two parts add up to the whole: 24 + 16 = 40.', 'm']]} gap={22} />
    </g>}
    {stage === 'rule' && <g>
      <rect x={20} y={190} width={500} height={112} rx="12" fill={amberSoft} stroke={amber} strokeWidth="1.8" />
      <Lines x={36} y={232} lines={[['percentage', 'b'], ['mass', 'b']]} />
      <text x={122} y={252} fontSize="18" fontWeight="700" fill={ink}>=</text>
      <Fraction x={290} y={246} width={290} size={15} top={<><R l="A" size={15} /> × number of atoms</>} bottom={<><R l="M" size={15} /> of the compound</>} />
      <text x={446} y={252} fontSize="18" fontWeight="700" fill={ink}>× 100</text>
    </g>}
    {stage === 'steps' && <g>
      <Num n={1} x={40} y={196} colour={amber} /><text x={62} y={201} fontSize="15" fontWeight="700" fill={ink}>work out <R l="M" size={15} />: 24 + 16 = 40</text>
      <Num n={2} x={40} y={236} colour={amber} /><text x={62} y={241} fontSize="15" fontWeight="700" fill={ink}>element’s part: <R l="A" size={15} /> × atoms = 24 × 1 = 24</text>
      <Num n={3} x={40} y={276} colour={amber} /><text x={62} y={281} fontSize="15" fontWeight="700" fill={ink}>divide by <R l="M" size={15} />, then × 100</text>
    </g>}
    {stage === 'worked' && <g>
      <Lines x={36} y={236} lines={[['percentage mass', 'b'], ['of magnesium', 'b']]} />
      <text x={170} y={250} fontSize="18" fontWeight="700" fill={ink}>=</text>
      <Fraction x={260} y={244} width={110} size={18} top="24 × 1" bottom="40" />
      <text x={330} y={250} fontSize="18" fontWeight="700" fill={ink}>× 100</text>
    </g>}
  </Diagram>
}

// ---------- On your own ----------
// A student's working for magnesium nitrate, Mg(NO₃)₂. Line 3 doubles only the nitrogen (should be 2 × 62 = 124; Mr = 148).
function ErrorQuestion({ assessment }: { assessment: boolean }) {
  const lines: ReactNode[] = [<><R l="A" />: Mg = 24, N = 14, O = 16</>, 'inside the bracket: 14 + (3 × 16) = 62', 'the bracket × 2: (2 × 14) + 48 = 76', <><R l="M" /> = 24 + 76 = 100</>]
  return <Diagram viewBox={`0 0 540 ${assessment ? 250 : 300}`} schematic={false} title={assessment
    ? 'A student’s working for the Mr of magnesium nitrate, Mg(NO₃)₂, in four numbered lines. Line 1: Ar Mg = 24, N = 14, O = 16. Line 2: inside the bracket, 14 + (3 × 16) = 62. Line 3: the bracket × 2, (2 × 14) + 48 = 76. Line 4: Mr = 24 + 76 = 100.'
    : 'A student’s working for the Mr of magnesium nitrate, Mg(NO₃)₂, in four numbered lines. Line 3 is marked wrong: it doubles only the nitrogen. It should be 2 × 62 = 124, so Mr = 24 + 124 = 148.'}>
    <text x={20} y={34} fontSize="16" fontWeight="700" fill={ink}>A student’s working: <R l="M" /> of Mg(NO₃)₂</text>
    <rect x={20} y={50} width={500} height={186} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    {lines.map((l, i) => {
      const y = 90 + i * 42, wrong = !assessment && i === 2
      return <g key={i}>
        {wrong && <rect x={28} y={y - 21} width={484} height={38} rx="8" fill={badSoft} stroke={bad} strokeWidth="1.5" />}
        <Num n={i + 1} x={52} y={y - 2} colour={wrong ? bad : ink} on={false} />
        <text x={78} y={y + 4} fontSize="16" fontWeight="600" fill={wrong ? bad : ink}>{l}</text>
      </g>
    })}
    {!assessment && <Lines x={20} y={264} lines={[['Line 3 should double everything in the bracket: 2 × 62 = 124', 'good'], [<>So <R l="M" size={14} /> = 24 + 124 = 148</>, 'good']]} gap={22} />}
  </Diagram>
}
function ChlorideData() {
  const rows: Array<[string, string, string, string]> = [['hydrogen chloride', 'HCl', '1', '36.5'], ['sodium chloride', 'NaCl', '1', '58.5'], ['calcium chloride', 'CaCl₂', '2', '111'], ['aluminium chloride', 'AlCl₃', '3', '133.5']]
  return <Diagram viewBox="0 0 540 250" schematic={false} title="A data table of four compounds of chlorine. Hydrogen chloride, HCl: 1 chlorine atom, Mr 36.5. Sodium chloride, NaCl: 1 chlorine atom, Mr 58.5. Calcium chloride, CaCl₂: 2 chlorine atoms, Mr 111. Aluminium chloride, AlCl₃: 3 chlorine atoms, Mr 133.5.">
    <text x={30} y={26} fontSize="15" fontWeight="700" fill={ink}>Four compounds of chlorine</text>
    <rect x={20} y={40} width={500} height={196} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="14" fontWeight="700" fill={ink}>
      <text x={36} y={70}>compound</text><text x={262} y={70} textAnchor="middle">formula</text>
      <text x={368} y={62} textAnchor="middle">chlorine</text><text x={368} y={78} textAnchor="middle">atoms</text>
      <text x={464} y={70} textAnchor="middle"><R l="M" size={14} /></text>
    </g>
    <path d="M32 90H508" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([name, f, n, mr], i) => {
      const y = 120 + i * 34
      return <g key={f} fontSize="15" fill={ink}>
        <text x={36} y={y}>{name}</text><text x={262} y={y} textAnchor="middle" fontWeight="700">{f}</text>
        <text x={368} y={y} textAnchor="middle">{n}</text><text x={464} y={y} textAnchor="middle" fontWeight="700">{mr}</text>
      </g>
    })}
  </Diagram>
}

export function FormulaMassVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'mr-co2-tiles': return <Co2 stage="tiles" />
    case 'mr-co2-add': return <Co2 stage="add" />
    case 'mr-co2-multiply': return <Co2 stage="multiply" />
    case 'mr-co2-method': return <Co2 stage="method" />
    case 'mr-worked-na2o': return <Na2oExample />
    case 'mr-bracket-count': return <Bracket stage="count" />
    case 'mr-bracket-inside': return <Bracket stage="inside" />
    case 'mr-bracket-times': return <Bracket stage="times" />
    case 'mr-bracket-total': return <Bracket stage="total" />
    case 'mr-pc-share': return <Percentage stage="share" />
    case 'mr-pc-rule': return <Percentage stage="rule" />
    case 'mr-pc-steps': return <Percentage stage="steps" />
    case 'mr-worked-mgo': return <Percentage stage="worked" />
    case 'mr-question-error': return <ErrorQuestion assessment={assessment} />
    case 'mr-data-chlorides': return <ChlorideData />
    default: return <Co2 stage="method" />
  }
}
