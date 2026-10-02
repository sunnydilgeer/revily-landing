import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Higher-only diagrams for Chemistry Lessons 26 and 27 (AQA 8464 5.4.3.2–5.4.3.4 HT: half equations at the electrodes).
 * Original, code-native schematics; not to scale. Focus ids start with 'helec-'.
 *
 * Same look as the Foundation cells (ElectrolysisVisuals.tsx for molten compounds, AqueousVisuals.tsx for solutions):
 * cathode (−) on the left, anode (+) on the right, coral positive ions, blue negative ions, grey uncharged atoms.
 * Under each electrode sits a card that collects its half equations, one line per frame. The line being taught is
 * picked out in amber. Electrons are drawn as a small arrow on the wire: into the cathode, out of the anode.
 * In assessment view the cards lose their equations.
 */
const { ink, muted, protonLine, electronLine, panelFill, panelLine } = atomPalette
const posFill = '#fbe1de', posLine = protonLine, posInk = '#8a332c'
const negFill = '#dcecf8', negLine = electronLine, negInk = '#1d5787'
const atomFill = '#e3e7ea', atomLine = '#7f8c97'
const hot = '#d98a1c', hotFill = '#fff4e6'
const glass = '#6f8798', moltenFill = '#eef5fa', aqFill = '#e6f1f8'
const electrodeFill = '#b9c2c9', electrodeLine = '#6f7d88', graphiteFill = '#4b5560', rod = '#59636d', copperFill = '#c9783a'
const faded = 0.28
const CX = 142, AX = 398

function Diagram({ title, children }: { title: string; children: ReactNode }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox="0 0 540 404" role="img" aria-labelledby={titleId}><title id={titleId}>{`${title} Original schematic, not to scale.`}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Arr({ x1, y1, x2, y2, colour = ink, width = 2.5 }: { x1: number; y1: number; x2: number; y2: number; colour?: string; width?: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 9
  const p = (t: number) => `${(x2 - h * Math.cos(a + t)).toFixed(1)} ${(y2 - h * Math.sin(a + t)).toFixed(1)}`
  return <g><path d={`M${x1} ${y1}L${(x2 - 5 * Math.cos(a)).toFixed(1)} ${(y2 - 5 * Math.sin(a)).toFixed(1)}`} stroke={colour} strokeWidth={width} fill="none" /><path d={`M${x2} ${y2}L${p(.45)}L${p(-.45)}Z`} fill={colour} stroke={colour} strokeWidth="1" /></g>
}
function Ion({ x, y, label, pos, op = 1 }: { x: number; y: number; label: string; pos: boolean; op?: number }) {
  return <g opacity={op}><circle cx={x} cy={y} r={label.length > 3 ? 17 : 15} fill={pos ? posFill : negFill} stroke={pos ? posLine : negLine} strokeWidth="2" />
    <text x={x} y={y + 4.5} textAnchor="middle" fontSize={label.length > 3 ? 10.5 : 12} fontWeight="700" fill={pos ? posInk : negInk}>{label}</text></g>
}
function Atom({ x, y, label }: { x: number; y: number; label: string }) {
  return <g><circle cx={x} cy={y} r="13" fill={atomFill} stroke={atomLine} strokeWidth="2" /><text x={x} y={y + 4.5} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={ink}>{label}</text></g>
}
function Pair({ x, y }: { x: number; y: number }) {
  return <g><circle cx={x - 8} cy={y} r="9.5" fill={atomFill} stroke={atomLine} strokeWidth="2" /><circle cx={x + 8} cy={y} r="9.5" fill={atomFill} stroke={atomLine} strokeWidth="2" /></g>
}
function Bubbles({ x, y }: { x: number; y: number }) {
  return <g fill="white" stroke={atomLine} strokeWidth="1.8"><circle cx={x} cy={y} r="5.5" /><circle cx={x + 7} cy={y - 24} r="7.5" /><circle cx={x - 3} cy={y - 50} r="5" /></g>
}
function Tag({ x, y, text }: { x: number; y: number; text: string }) {
  const w = text.length * 9 + 18
  return <g><rect x={x - w / 2} y={y - 14} width={w} height={26} rx="8" fill={hotFill} stroke={hot} strokeWidth="2" /><text x={x} y={y + 4.5} textAnchor="middle" fontSize="13.5" fontWeight="700" fill={ink}>{text}</text></g>
}

// ---------- What is in each cell ----------
type Side = 'cathode' | 'anode'
type CellKind = { aqueous: boolean; pos: string[]; neg: string[]; react: { cathode: string; anode: string }; cathodeProduct: 'atoms' | 'bubbles' | 'layer'; cathodeLabel: string; anodeProduct: 'pairs' | 'bubbles'; anodeLabel: string; graphite?: boolean; pool?: boolean; name: string; e: { cathode: string; anode: string } }
const CELLS: Record<'pbbr2' | 'al' | 'nacl' | 'cuso4', CellKind> = {
  pbbr2: { aqueous: false, pos: ['Pb²⁺', 'Pb²⁺'], neg: ['Br⁻', 'Br⁻', 'Br⁻'], react: { cathode: 'Pb²⁺', anode: 'Br⁻' }, cathodeProduct: 'atoms', cathodeLabel: 'Pb', anodeProduct: 'pairs', anodeLabel: 'Br₂', name: 'molten lead bromide', e: { cathode: '2e⁻', anode: '2e⁻' } },
  al: { aqueous: false, pos: ['Al³⁺', 'Al³⁺'], neg: ['O²⁻', 'O²⁻', 'O²⁻'], react: { cathode: 'Al³⁺', anode: 'O²⁻' }, cathodeProduct: 'atoms', cathodeLabel: 'Al', anodeProduct: 'pairs', anodeLabel: 'O₂', graphite: true, pool: true, name: 'molten aluminium oxide in cryolite', e: { cathode: '3e⁻', anode: '4e⁻' } },
  nacl: { aqueous: true, pos: ['Na⁺', 'H⁺', 'Na⁺'], neg: ['Cl⁻', 'OH⁻', 'Cl⁻'], react: { cathode: 'H⁺', anode: 'Cl⁻' }, cathodeProduct: 'bubbles', cathodeLabel: 'H₂', anodeProduct: 'bubbles', anodeLabel: 'Cl₂', name: 'sodium chloride solution', e: { cathode: '2e⁻', anode: '2e⁻' } },
  cuso4: { aqueous: true, pos: ['Cu²⁺', 'H⁺', 'Cu²⁺'], neg: ['SO₄²⁻', 'OH⁻', 'SO₄²⁻'], react: { cathode: 'Cu²⁺', anode: 'OH⁻' }, cathodeProduct: 'layer', cathodeLabel: 'Cu', anodeProduct: 'bubbles', anodeLabel: 'O₂', name: 'copper sulfate solution', e: { cathode: '2e⁻', anode: '4e⁻' } },
}
const ROWS = [146, 180, 214]

function Cell({ kind, active }: { kind: CellKind | null; active: Side | 'both' | null }) {
  const aq = kind?.aqueous ?? false
  const showC = active === 'cathode' || active === 'both', showA = active === 'anode' || active === 'both'
  const pos = kind?.pos ?? ['+', '+'], neg = kind?.neg ?? ['−', '−', '−']
  const ionOp = (label: string, isPos: boolean) => {
    if (!kind || active === 'both' || !active) return 1
    if (active === 'cathode') return isPos && label === kind.react.cathode ? 1 : faded
    return !isPos && label === kind.react.anode ? 1 : faded
  }
  const arrowFor = (label: string, isPos: boolean, i: number) => (!kind && active === 'both' && i === 0) || kind && ((showC && isPos && label === kind.react.cathode) || (showA && !isPos && label === kind.react.anode))
  const e = kind?.e ?? { cathode: 'e⁻', anode: 'e⁻' }
  return <g>
    {/* power supply and wires */}
    <text x={270} y={16} textAnchor="middle" fontSize="13" fill={muted}>{aq ? 'd.c. power supply' : 'power supply'}</text>
    <path d={`M${CX} 78V40H255M285 40H${AX}V78`} fill="none" stroke={ink} strokeWidth="2.4" />
    <path d="M255 29V51" stroke={ink} strokeWidth="5.5" /><path d="M285 24V56" stroke={ink} strokeWidth="2.4" />
    <text x={255} y={72} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>−</text><text x={285} y={72} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>+</text>
    {/* electrons: into the cathode, out of the anode */}
    {showC && <g><Arr x1={CX - 16} y1={44} x2={CX - 16} y2={76} colour={negLine} width={2.4} /><text x={CX - 24} y={66} textAnchor="end" fontSize="14" fontWeight="700" fill={negInk}>{e.cathode} in</text></g>}
    {showA && <g><Arr x1={AX + 16} y1={76} x2={AX + 16} y2={44} colour={negLine} width={2.4} /><text x={AX + 24} y={66} fontSize="14" fontWeight="700" fill={negInk}>{e.anode} out</text></g>}
    {/* beaker and electrolyte */}
    <rect x={62} y={116} width={416} height={120} rx="4" fill={aq ? aqFill : moltenFill} />
    <path d={aq ? 'M60 96V230Q60 238 68 238H472Q480 238 480 230V96' : 'M60 96V238H480V96'} fill="none" stroke={glass} strokeWidth="2.6" />
    {kind?.pool && <rect x={62} y={222} width={416} height={14} fill="#c5ccd2" stroke={atomLine} strokeWidth="1.4" />}
    {/* electrodes */}
    {kind?.cathodeProduct === 'layer' && showC && <rect x={CX - 14} y={116} width={28} height={104} rx="4" fill={copperFill} />}
    <rect x={CX - 9} y={78} width={18} height={142} rx="3" fill={aq ? rod : electrodeFill} stroke={aq ? 'none' : electrodeLine} strokeWidth="2" />
    <rect x={AX - 9} y={78} width={18} height={142} rx="3" fill={aq ? rod : kind?.graphite ? graphiteFill : electrodeFill} stroke={aq ? 'none' : electrodeLine} strokeWidth="2" />
    {/* ions */}
    {pos.map((l, i) => <g key={`p${i}`}><Ion x={222} y={ROWS[i]} label={l} pos op={ionOp(l, true)} />{arrowFor(l, true, i) && <Arr x1={203} y1={ROWS[i]} x2={CX + 18} y2={ROWS[i]} colour={posLine} width={2.4} />}</g>)}
    {neg.map((l, i) => <g key={`n${i}`}><Ion x={318} y={ROWS[i]} label={l} pos={false} op={ionOp(l, false)} />{arrowFor(l, false, i) && <Arr x1={338} y1={ROWS[i]} x2={AX - 18} y2={ROWS[i]} colour={negLine} width={2.4} />}</g>)}
    {/* products, on the outer side of each electrode */}
    {kind && showC && <g>
      {kind.cathodeProduct === 'atoms' && [150, 182].map(y => <Atom key={y} x={104} y={y} label={kind.cathodeLabel} />)}
      {kind.cathodeProduct === 'bubbles' && <Bubbles x={112} y={204} />}
      <Tag x={98} y={92} text={kind.cathodeLabel} />
    </g>}
    {kind && showA && <g>
      {kind.anodeProduct === 'pairs' && [154, 190].map(y => <Pair key={y} x={438} y={y} />)}
      {kind.anodeProduct === 'bubbles' && <Bubbles x={428} y={204} />}
      <Tag x={442} y={92} text={kind.anodeLabel} />
    </g>}
    {kind && <text x={270} y={256} textAnchor="middle" fontSize="13" fill={muted}>{kind.name}</text>}
  </g>
}

// ---------- The two cards of half equations ----------
type Line = { text: string; on: boolean }
function Card({ x, side, lines, footer, assessment }: { x: number; side: Side; lines: Line[]; footer: string | null; assessment: boolean }) {
  const w = 244, y = 268
  return <g>
    <rect x={x} y={y} width={w} height={126} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.6" />
    <text x={x + w / 2} y={y + 22} textAnchor="middle" fontSize="14.5" fontWeight="700" fill={side === 'cathode' ? posInk : negInk}>{side === 'cathode' ? 'cathode (−)' : 'anode (+)'}</text>
    {!assessment && lines.map((l, i) => <g key={i}>
      {l.on && <rect x={x + 8} y={y + 32 + i * 30} width={w - 16} height={26} rx="7" fill={hotFill} stroke={hot} strokeWidth="2" />}
      <text x={x + w / 2} y={y + 50 + i * 30} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{l.text}</text>
    </g>)}
    {!assessment && footer && <text x={x + w / 2} y={y + 114} textAnchor="middle" fontSize="13" fontWeight="700" fill={side === 'cathode' ? posInk : negInk}>{footer}</text>}
  </g>
}

// Each set of frames reveals: cathode 1, anode 1, cathode 2, anode 2, then all of it.
type Step = 0 | 1 | 2 | 3 | 'all'
type HalfSet = { cells: [CellKind, CellKind]; cathode: [string, string]; anode: [string, string]; titles: [string, string, string, string, string] }
const SETS: Record<'m' | 'aq', HalfSet> = {
  m: {
    cells: [CELLS.pbbr2, CELLS.al], cathode: ['Pb²⁺ + 2e⁻ → Pb', 'Al³⁺ + 3e⁻ → Al'], anode: ['2Br⁻ → Br₂ + 2e⁻', '2O²⁻ → O₂ + 4e⁻'],
    titles: [
      'Molten lead bromide. Lead ions move to the cathode and each gains two electrons to become a lead atom: Pb 2 plus plus 2 e minus gives Pb. Gaining electrons is reduction.',
      'Molten lead bromide. Bromide ions move to the anode. Two bromide ions each lose an electron and join to make one bromine molecule: 2 Br minus gives Br2 plus 2 e minus. Losing electrons is oxidation.',
      'Molten aluminium oxide in cryolite. Aluminium ions move to the cathode and each gains three electrons to become an aluminium atom: Al 3 plus plus 3 e minus gives Al.',
      'Molten aluminium oxide in cryolite. Oxide ions move to the graphite anode. Two oxide ions lose four electrons in all to make one oxygen molecule: 2 O 2 minus gives O2 plus 4 e minus.',
      'Summary. At the cathode, positive ions gain electrons, which is reduction: Pb 2 plus plus 2 e minus gives Pb, and Al 3 plus plus 3 e minus gives Al. At the anode, negative ions lose electrons, which is oxidation: 2 Br minus gives Br2 plus 2 e minus, and 2 O 2 minus gives O2 plus 4 e minus.',
    ],
  },
  aq: {
    cells: [CELLS.nacl, CELLS.cuso4], cathode: ['2H⁺ + 2e⁻ → H₂', 'Cu²⁺ + 2e⁻ → Cu'], anode: ['2Cl⁻ → Cl₂ + 2e⁻', '4OH⁻ → O₂ + 2H₂O + 4e⁻'],
    titles: [
      'Sodium chloride solution. Sodium ions stay in the solution. Hydrogen ions move to the cathode, gain electrons and make hydrogen gas: 2 H plus plus 2 e minus gives H2.',
      'Sodium chloride solution. Chloride ions move to the anode, lose electrons and make chlorine gas: 2 Cl minus gives Cl2 plus 2 e minus.',
      'Copper sulfate solution. Copper ions move to the cathode, gain two electrons each and coat it with copper: Cu 2 plus plus 2 e minus gives Cu.',
      'Copper sulfate solution. Sulfate ions stay in the solution. Hydroxide ions move to the anode and lose electrons, making oxygen gas and water: 4 OH minus gives O2 plus 2 H2O plus 4 e minus.',
      'Summary. At the cathode, ions gain electrons, which is reduction: 2 H plus plus 2 e minus gives H2, or Cu 2 plus plus 2 e minus gives Cu. At the anode, ions lose electrons, which is oxidation: 2 Cl minus gives Cl2 plus 2 e minus, or 4 OH minus gives O2 plus 2 H2O plus 4 e minus.',
    ],
  },
}

function HalfEquations({ set, step, assessment = false }: { set: HalfSet; step: Step; assessment?: boolean }) {
  const n = step === 'all' ? 4 : step + 1
  const cathodeLines: Line[] = set.cathode.slice(0, n >= 3 ? 2 : 1).map((text, i) => ({ text, on: step === i * 2 }))
  const anodeLines: Line[] = set.anode.slice(0, n >= 4 ? 2 : n >= 2 ? 1 : 0).map((text, i) => ({ text, on: step === i * 2 + 1 }))
  const kind = step === 'all' ? null : set.cells[step < 2 ? 0 : 1]
  const active: Side | 'both' = step === 'all' ? 'both' : step % 2 === 0 ? 'cathode' : 'anode'
  return <Diagram title={set.titles[step === 'all' ? 4 : step]}>
    <Cell kind={kind} active={active} />
    {step === 'all' && <text x={270} y={256} textAnchor="middle" fontSize="13" fill={muted}>positive ions gain electrons · negative ions lose electrons</text>}
    <Card x={20} side="cathode" lines={cathodeLines} footer="gains electrons: reduction" assessment={assessment} />
    <Card x={276} side="anode" lines={anodeLines} footer={anodeLines.length ? 'loses electrons: oxidation' : null} assessment={assessment} />
  </Diagram>
}

const STEPS: Record<string, Step> = { 'pb-cathode': 0, 'pb-anode': 1, 'al-cathode': 2, 'al-anode': 3, 'm-all': 'all', 'h-cathode': 0, 'cl-anode': 1, 'cu-cathode': 2, 'o-anode': 3, 'aq-all': 'all' }

export function HigherElectrolysisVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  const key = focus.replace(/^helec-/, '')
  const aq = ['h-cathode', 'cl-anode', 'cu-cathode', 'o-anode', 'aq-all'].includes(key)
  return <HalfEquations set={SETS[aq ? 'aq' : 'm']} step={STEPS[key] ?? 'all'} assessment={assessment} />
}
