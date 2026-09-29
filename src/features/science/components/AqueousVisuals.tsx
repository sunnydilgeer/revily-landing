import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C4 (Chemistry Lesson 27): electrolysis of aqueous solutions. Original, code-native schematics; not to scale.
 * Focus ids start with 'aqel-'.
 *
 * Colour code (Chemistry convention): positive ions (metal ions, H+) are coral; negative ions (halide, OH-, sulfate) are
 * electron-blue. Inert electrodes are dark grey rods. The cell is drawn with the cathode (-) on the left and the anode (+)
 * on the right; the lab rig (required practical) has upside-down test tubes over each electrode and a key of numbered steps.
 * In assessment view the rig loses its words; only the numbered pointers and the + and - on the power supply stay.
 */
const { ink, muted, protonLine, electronLine, panelFill, panelLine } = atomPalette
const posFill = '#fbe1de', posLine = protonLine, posInk = '#8a332c'
const negFill = '#dcecf8', negLine = electronLine, negInk = '#1d5787'
const hot = '#d98a1c', hotFill = '#fff4e6'
const rod = '#59636d', glass = '#6f8798', liquid = '#e6f1f8', copperFill = '#c9783a'
const faded = 0.28

function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Arr({ x1, y1, x2, y2, colour = ink, width = 2.5 }: { x1: number; y1: number; x2: number; y2: number; colour?: string; width?: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 9
  const p = (t: number) => `${(x2 - h * Math.cos(a + t)).toFixed(1)} ${(y2 - h * Math.sin(a + t)).toFixed(1)}`
  return <g><path d={`M${x1} ${y1}L${(x2 - 5 * Math.cos(a)).toFixed(1)} ${(y2 - 5 * Math.sin(a)).toFixed(1)}`} stroke={colour} strokeWidth={width} fill="none" /><path d={`M${x2} ${y2}L${p(.45)}L${p(-.45)}Z`} fill={colour} stroke={colour} strokeWidth="1" /></g>
}
function Num({ n, x, y, on = true, plain = false }: { n: number; x: number; y: number; on?: boolean; plain?: boolean }) {
  const colour = plain ? ink : on ? hot : muted
  return <g><circle cx={x} cy={y} r="12" fill={on ? colour : 'white'} stroke={colour} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill={on ? 'white' : colour}>{n}</text></g>
}
function Chip({ x, y, w, h = 34, text, kind, size = 16, on = false }: { x: number; y: number; w: number; h?: number; text: string; kind: 'pos' | 'neg' | 'plain' | 'hot'; size?: number; on?: boolean }) {
  const fill = kind === 'pos' ? posFill : kind === 'neg' ? negFill : kind === 'hot' ? hotFill : 'white'
  const line = on ? hot : kind === 'pos' ? posLine : kind === 'neg' ? negLine : kind === 'hot' ? hot : '#9fb1bd'
  const col = kind === 'pos' ? posInk : kind === 'neg' ? negInk : ink
  return <g><rect x={x} y={y} width={w} height={h} rx="9" fill={fill} stroke={line} strokeWidth={on ? 3.2 : 1.8} /><text x={x + w / 2} y={y + h / 2 + size * .35} textAnchor="middle" fontSize={size} fontWeight="700" fill={col}>{text}</text></g>
}
function Ion({ x, y, label, pos, op = 1 }: { x: number; y: number; label: string; pos: boolean; op?: number }) {
  return <g opacity={op}><circle cx={x} cy={y} r={label.length > 4 ? 21 : 18} fill={pos ? posFill : negFill} stroke={pos ? posLine : negLine} strokeWidth="2" /><text x={x} y={y + 4.5} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={pos ? posInk : negInk}>{label}</text></g>
}
function Bubbles({ x, y, dir = 1 }: { x: number; y: number; dir?: 1 | -1 }) {
  return <g fill="white" stroke="#7f8c97" strokeWidth="1.8"><circle cx={x} cy={y} r="6" /><circle cx={x + 8 * dir} cy={y - 26} r="8" /><circle cx={x - 2 * dir} cy={y - 54} r="5" /><circle cx={x + 6 * dir} cy={y - 78} r="7" /></g>
}

// ---------- Section 2: the ions in a solution ----------
function Water() {
  return <Diagram viewBox="0 0 540 250" title="Water splits a little into ions. A white chip H2O has a two-way arrow to a coral chip H plus and a blue chip OH minus. Only a tiny fraction of the water molecules are split at any moment.">
    <text x={270} y={34} textAnchor="middle" fontSize="17" fontWeight="700" fill={ink}>Water splits a little into ions</text>
    <Chip x={40} y={78} w={120} h={60} text="H₂O" kind="plain" size={26} />
    <text x={214} y={118} textAnchor="middle" fontSize="34" fontWeight="700" fill={muted}>⇌</text>
    <Chip x={258} y={78} w={100} h={60} text="H⁺" kind="pos" size={26} />
    <text x={382} y={118} textAnchor="middle" fontSize="26" fontWeight="700" fill={muted}>+</text>
    <Chip x={406} y={78} w={100} h={60} text="OH⁻" kind="neg" size={26} />
    <text x={270} y={176} textAnchor="middle" fontSize="14" fill={ink}>The ⇌ arrow means the change can go both ways.</text>
    <text x={270} y={200} textAnchor="middle" fontSize="14" fill={ink}>Only a tiny fraction of the water molecules are split.</text>
    <text x={270} y={232} textAnchor="middle" fontSize="13" fill={muted}>coral = positive ion · blue = negative ion</text>
  </Diagram>
}
function Ions() {
  return <Diagram viewBox="0 0 540 320" title="Two sources of ions. The dissolved salt, sodium chloride, gives Na plus and Cl minus. Water gives H plus and OH minus. So the solution contains four kinds of ion: two positive, Na plus and H plus, and two negative, Cl minus and OH minus.">
    <rect x={24} y={20} width={232} height={112} rx="14" fill={panelFill} stroke={panelLine} strokeWidth="1.8" />
    <text x={140} y={46} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>from the salt, NaCl</text>
    <Ion x={102} y={92} label="Na⁺" pos /><Ion x={178} y={92} label="Cl⁻" pos={false} />
    <rect x={284} y={20} width={232} height={112} rx="14" fill={panelFill} stroke={panelLine} strokeWidth="1.8" />
    <text x={400} y={46} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>from the water, H₂O</text>
    <Ion x={362} y={92} label="H⁺" pos /><Ion x={438} y={92} label="OH⁻" pos={false} />
    <Arr x1={140} y1={138} x2={220} y2={172} colour={muted} /><Arr x1={400} y1={138} x2={320} y2={172} colour={muted} />
    <rect x={24} y={180} width={492} height={120} rx="14" fill={liquid} stroke={glass} strokeWidth="2.2" />
    <text x={270} y={206} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>the solution contains four kinds of ion</text>
    <Ion x={130} y={252} label="Na⁺" pos /><Ion x={210} y={252} label="H⁺" pos /><Ion x={330} y={252} label="Cl⁻" pos={false} /><Ion x={410} y={252} label="OH⁻" pos={false} />
    <text x={170} y={287} textAnchor="middle" fontSize="13" fontWeight="700" fill={posInk}>positive</text><text x={370} y={287} textAnchor="middle" fontSize="13" fontWeight="700" fill={negInk}>negative</text>
  </Diagram>
}

// ---------- The electrolysis cell (worked examples and the ion movement) ----------
type Salt = 'cuso4' | 'nacl'
type CellStage = 'ions' | 'move' | 'cathode' | 'anode'
const SLOTS: Array<[number, number]> = [[225, 172], [225, 216], [225, 260], [315, 172], [315, 216], [315, 260]]
const SALTS: Record<Salt, Array<[string, boolean]>> = {
  cuso4: [['Cu²⁺', true], ['H⁺', true], ['Cu²⁺', true], ['SO₄²−', false], ['OH⁻', false], ['SO₄²−', false]],
  nacl: [['Na⁺', true], ['H⁺', true], ['Na⁺', true], ['Cl⁻', false], ['OH⁻', false], ['Cl⁻', false]],
}
const CAPTIONS: Record<Salt, Record<CellStage, string[]>> = {
  cuso4: {
    ions: ['Copper sulfate solution: Cu²⁺ and SO₄²− from the salt,', 'H⁺ and OH⁻ from the water.'],
    move: ['Positive ions go to the cathode. Negative ions go to the anode.'],
    cathode: ['Cu²⁺ and H⁺ go to the cathode. Copper is less reactive', 'than hydrogen, so a layer of copper metal forms.'],
    anode: ['SO₄²− and OH⁻ go to the anode. There are no halide ions,', 'so oxygen and water form.'],
  },
  nacl: {
    ions: ['Sodium chloride solution: Na⁺ and Cl⁻ from the salt,', 'H⁺ and OH⁻ from the water.'],
    move: ['Positive ions go to the cathode. Negative ions go to the anode.'],
    cathode: ['Na⁺ and H⁺ go to the cathode. Sodium is more reactive', 'than hydrogen, so hydrogen gas forms.'],
    anode: ['Cl⁻ and OH⁻ go to the anode. Chloride is a halide ion,', 'so chlorine gas forms.'],
  },
}
const CELL_TITLES: Record<Salt, string> = {
  cuso4: 'An electrolysis cell containing copper sulfate solution. Cathode on the left is negative, anode on the right is positive, both inert electrodes joined to a d.c. power supply. The solution holds Cu 2 plus, SO4 2 minus, H plus and OH minus ions. Positive ions go to the cathode, where copper metal forms. Negative ions go to the anode, where oxygen forms.',
  nacl: 'An electrolysis cell containing sodium chloride solution. Cathode on the left is negative, anode on the right is positive, both inert electrodes joined to a d.c. power supply. The solution holds Na plus, Cl minus, H plus and OH minus ions. Positive ions go to the cathode, where hydrogen forms. Negative ions go to the anode, where chlorine forms.',
}
function Cell({ salt, stage }: { salt: Salt; stage: CellStage }) {
  const ions = SALTS[salt]
  const cat = stage === 'cathode', an = stage === 'anode', mv = stage === 'move'
  const opFor = (pos: boolean) => (cat && !pos) || (an && pos) ? faded : 1
  const cathodeProduct = salt === 'cuso4' ? 'copper' : 'H₂', anodeProduct = salt === 'cuso4' ? 'O₂' : 'Cl₂'
  const cx1 = 159, cx2 = 381
  return <Diagram viewBox="0 0 540 384" title={CELL_TITLES[salt]}>
    {/* power supply and wires */}
    <text x={270} y={14} textAnchor="middle" fontSize="13" fill={ink}>d.c. power supply</text>
    <path d={`M${cx1} 84V40H255M285 40H${cx2}V84`} fill="none" stroke={ink} strokeWidth="2.4" />
    <path d="M255 28V52" stroke={ink} strokeWidth="6" /><path d="M285 22V58" stroke={ink} strokeWidth="2.4" />
    <text x={255} y={72} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>−</text><text x={285} y={72} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>+</text>
    {/* beaker and liquid */}
    <rect x={72} y={140} width={396} height={140} rx="6" fill={liquid} />
    <path d="M72 110V274Q72 282 80 282H460Q468 282 468 274V110" fill="none" stroke={glass} strokeWidth="2.6" />
    {/* electrodes */}
    <rect x={cx1 - 9} y={84} width={18} height={178} rx="3" fill={rod} />
    <rect x={cx2 - 9} y={84} width={18} height={178} rx="3" fill={rod} />
    {cat && <rect x={cx1 - 15} y={140} width={30} height={122} rx="4" fill={salt === 'cuso4' ? copperFill : 'none'} opacity={salt === 'cuso4' ? .95 : 0} />}
    {/* ions */}
    {ions.map(([label, pos], i) => {
      const [x, y] = SLOTS[i]
      return <g key={i}><Ion x={x} y={y} label={label} pos={pos} op={opFor(pos)} />
        {(mv || (cat && pos) || (an && !pos)) && (pos ? <Arr x1={x - 21} y1={y} x2={x - 39} y2={y} colour={posLine} width={2.2} /> : <Arr x1={x + 23} y1={y} x2={x + 41} y2={y} colour={negLine} width={2.2} />)}
      </g>
    })}
    {/* products */}
    {cat && <g>
      {salt === 'nacl' && <Bubbles x={135} y={252} dir={-1} />}
      <Chip x={80} y={108} w={salt === 'cuso4' ? 64 : 48} h={28} text={cathodeProduct} kind="hot" size={14} />
    </g>}
    {an && <g><Bubbles x={405} y={252} dir={1} /><Chip x={398} y={108} w={48} h={28} text={anodeProduct} kind="hot" size={14} /></g>}
    {/* electrode names */}
    <text x={cx1} y={304} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>cathode (−)</text>
    <text x={cx2} y={304} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>anode (+)</text>
    {/* caption */}
    <rect x={20} y={318} width={500} height={56} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.6" />
    <text fontSize="13.5" fontWeight="700" fill={ink} textAnchor="middle">{CAPTIONS[salt][stage].map((l, i) => <tspan key={i} x={270} y={i ? 361 : 343 - (CAPTIONS[salt][stage].length === 1 ? -9 : 0)}>{l}</tspan>)}</text>
  </Diagram>
}

// ---------- Section 3: the cathode rule ----------
type CathStage = 'strip' | 'more' | 'less'
const SERIES = ['K', 'Na', 'Ca', 'Mg', 'Al', 'Zn', 'Fe', 'H', 'Cu', 'Ag', 'Au']
function Cathode({ stage }: { stage: CathStage }) {
  const w = 42, x0 = 39, y0 = 72
  const isMore = (i: number) => i < 7, isLess = (i: number) => i > 7
  const hi = (i: number) => stage === 'strip' || (stage === 'more' && isMore(i)) || (stage === 'less' && isLess(i)) || i === 7
  return <Diagram viewBox="0 0 540 330" title="The reactivity series as a strip of eleven boxes from most reactive on the left, potassium, sodium, calcium, magnesium, aluminium, zinc, iron, to hydrogen in the middle, then copper, silver and gold, least reactive on the right. A metal more reactive than hydrogen gives hydrogen gas at the cathode. A metal less reactive than hydrogen gives a layer of the pure metal.">
    <text x={270} y={28} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>At the cathode: the metal or hydrogen?</text>
    <Arr x1={100} y1={52} x2={40} y2={52} colour={muted} width={2} /><text x={112} y={57} fontSize="13" fill={muted}>more reactive</text>
    <text x={428} y={57} textAnchor="end" fontSize="13" fill={muted}>less reactive</text><Arr x1={440} y1={52} x2={500} y2={52} colour={muted} width={2} />
    {SERIES.map((s, i) => {
      const h = i === 7
      return <g key={s} opacity={hi(i) ? 1 : faded}><rect x={x0 + i * w} y={y0} width={w - 4} height={44} rx="8" fill={h ? hotFill : posFill} stroke={h ? hot : posLine} strokeWidth={h ? 3.2 : 1.8} /><text x={x0 + i * w + (w - 4) / 2} y={y0 + 29} textAnchor="middle" fontSize="16" fontWeight="700" fill={h ? '#8a5a14' : posInk}>{s}</text></g>
    })}
    <text x={x0 + 7 * w + (w - 4) / 2} y={y0 + 64} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#8a5a14">hydrogen</text>
    {stage !== 'strip' && <g>
      {stage === 'more' ? <g>
        <path d={`M${x0} ${y0 + 78}V${y0 + 92}H${x0 + 7 * w - 4}V${y0 + 78}`} fill="none" stroke={hot} strokeWidth="2.4" />
        <rect x={40} y={190} width={230} height={100} rx="12" fill={panelFill} stroke={hot} strokeWidth="3" />
        <text x={155} y={220} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>hydrogen gas forms</text>
        <text x={155} y={246} textAnchor="middle" fontSize="20" fontWeight="700" fill={ink}>H₂</text>
        <text x={155} y={274} textAnchor="middle" fontSize="13" fill={muted}>bubbles at the cathode</text>
      </g> : <g>
        <path d={`M${x0 + 8 * w} ${y0 + 78}V${y0 + 92}H${x0 + 11 * w - 4}V${y0 + 78}`} fill="none" stroke={hot} strokeWidth="2.4" />
        <rect x={270} y={190} width={230} height={100} rx="12" fill={panelFill} stroke={hot} strokeWidth="3" />
        <text x={385} y={220} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>a layer of metal forms</text>
        <rect x={310} y={238} width={16} height={44} fill={rod} /><rect x={300} y={238} width={10} height={44} fill={copperFill} /><rect x={326} y={238} width={10} height={44} fill={copperFill} />
        <text x={348} y={256} fontSize="13" fill={muted}>solid metal</text><text x={348} y={272} fontSize="13" fill={muted}>on the electrode</text>
      </g>}
    </g>}
    {stage === 'strip' && <text x={270} y={182} textAnchor="middle" fontSize="15" fill={ink}>Compare the metal in the salt with hydrogen from the water.</text>}
    <text x={270} y={300} textAnchor="middle" fontSize="12.5" fill={muted}>K potassium · Na sodium · Ca calcium · Mg magnesium · Al aluminium · Zn zinc</text><text x={270} y={316} textAnchor="middle" fontSize="12.5" fill={muted}>Fe iron · Cu copper · Ag silver · Au gold</text>
  </Diagram>
}

// ---------- Section 4: the anode rule ----------
type AnStage = 'q' | 'yes' | 'no'
function Anode({ stage }: { stage: AnStage }) {
  const yesOn = stage === 'yes', noOn = stage === 'no'
  return <Diagram viewBox="0 0 540 320" title="A decision at the anode. Question: does the solution contain halide ions, Cl minus, Br minus or I minus? If yes, chlorine, bromine or iodine forms at the anode. If no, the OH minus ions react and oxygen and water form.">
    <text x={270} y={28} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>At the anode: is there a halide ion?</text>
    <rect x={110} y={44} width={320} height={82} rx="14" fill={negFill} stroke={stage === 'q' ? hot : negLine} strokeWidth={stage === 'q' ? 3.2 : 1.8} />
    <text x={270} y={72} textAnchor="middle" fontSize="15" fontWeight="700" fill={negInk}>Does the salt contain halide ions?</text>
    <Ion x={195} y={102} label="Cl⁻" pos={false} /><Ion x={270} y={102} label="Br⁻" pos={false} /><Ion x={345} y={102} label="I⁻" pos={false} />
    <Arr x1={210} y1={130} x2={145} y2={178} colour={muted} width={2.4} /><Arr x1={330} y1={130} x2={395} y2={178} colour={muted} width={2.4} />
    <text x={168} y={164} fontSize="15" fontWeight="700" fill={ink}>yes</text><text x={358} y={164} fontSize="15" fontWeight="700" fill={ink}>no</text>
    <g opacity={stage === 'q' || yesOn ? 1 : faded}>
      <rect x={24} y={186} width={236} height={116} rx="12" fill={panelFill} stroke={yesOn ? hot : panelLine} strokeWidth={yesOn ? 3.2 : 1.8} />
      <text x={142} y={214} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>the halogen forms</text>
      <text x={142} y={244} textAnchor="middle" fontSize="19" fontWeight="700" fill={ink}>Cl₂  Br₂  I₂</text>
      <text x={142} y={274} textAnchor="middle" fontSize="13" fill={muted}>chlorine, bromine or iodine</text>
    </g>
    <g opacity={stage === 'q' || noOn ? 1 : faded}>
      <rect x={280} y={186} width={236} height={116} rx="12" fill={panelFill} stroke={noOn ? hot : panelLine} strokeWidth={noOn ? 3.2 : 1.8} />
      <text x={398} y={214} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>OH⁻ ions react</text>
      <text x={398} y={244} textAnchor="middle" fontSize="19" fontWeight="700" fill={ink}>oxygen and water</text>
      <text x={398} y={274} textAnchor="middle" fontSize="13" fill={muted}>O₂ and H₂O form</text>
    </g>
  </Diagram>
}

// ---------- Section 6: the practical rig ----------
const STEP_TEXT = [['Set up the solution and electrodes, with an upside-down', 'test tube over each electrode'], ['Work out which is the anode: it is on the same side', 'as the positive terminal'], ['Switch on and let it run for a few minutes'], ['Record what you see: a metal forming or bubbles of gas']]
const RIG_TITLE = 'A lab rig for electrolysis of an aqueous solution: a beaker of the solution with two inert graphite electrodes rising from the floor, each with an upside-down test tube full of solution over it to collect gas. The electrodes are wired to a d.c. power supply. The cathode is joined to the negative terminal and the anode to the positive terminal.'
const RIG_ASSESS_TITLE = 'A lab rig for electrolysis of a solution. Four numbered parts: 1 the left electrode, 2 the right electrode, 3 the test tube over the left electrode, 4 the test tube over the right electrode. The electrodes are joined to a d.c. power supply whose two terminals are marked plus and minus.'
function Rig({ on, assessment = false }: { on: number[]; assessment?: boolean }) {
  const o = (...s: number[]) => (assessment || s.some(n => on.includes(n)) ? 1 : faded)
  const cx1 = 170, cx2 = 330
  // in assessment view the left electrode is the anode, so the answer is not the one on the same side as the book's diagram
  const leftPositive = assessment
  const gas = !assessment && (on.includes(3) || on.includes(4))
  const tube = (cx: number) => <g>
    <path d={`M${cx - 26} 250V112Q${cx - 26} 100 ${cx - 14} 100H${cx + 14}Q${cx + 26} 100 ${cx + 26} 112V250`} fill="white" fillOpacity=".5" stroke={glass} strokeWidth="2.6" />
    <path d={`M${cx - 24} ${gas ? 146 : 104}V248H${cx + 24}V${gas ? 146 : 104}Z`} fill={liquid} />
    {gas && <path d={`M${cx - 24} 108Q${cx - 24} 102 ${cx - 14} 102H${cx + 14}Q${cx + 24} 102 ${cx + 24} 108V146H${cx - 24}Z`} fill="white" />}
  </g>
  const leftSign = leftPositive ? '+' : '−', rightSign = leftPositive ? '−' : '+'
  return <Diagram title={assessment ? RIG_ASSESS_TITLE : RIG_TITLE} viewBox={`0 0 540 ${assessment ? 400 : 604}`}>
    <g opacity={o(1)}>
      <rect x={80} y={150} width={340} height={148} fill={liquid} />
      <path d="M80 96V292Q80 300 88 300H412Q420 300 420 292V96" fill="none" stroke={glass} strokeWidth="2.8" />
      {tube(cx1)}{tube(cx2)}
      <rect x={cx1 - 7} y={196} width={14} height={104} rx="2" fill={rod} /><rect x={cx2 - 7} y={196} width={14} height={104} rx="2" fill={rod} />
      {!assessment && <g fontSize="12.5" fontWeight="700" fill={ink}>
        <text x={434} y={104}>test tube full</text><text x={434} y={120}>of solution</text><path d={`M430 112H${cx2 + 28}`} stroke={muted} strokeWidth="1.4" />
        <text x={434} y={234}>solution</text><text x={434} y={250}>(electrolyte)</text><path d="M430 242H400" stroke={muted} strokeWidth="1.4" />
        <text x={14} y={326}>inert graphite</text><text x={14} y={342}>electrode</text><path d={`M60 318L${cx1 - 9} 296`} stroke={muted} strokeWidth="1.4" />
      </g>}
    </g>
    {/* wires and power supply */}
    <g opacity={o(1, 2, 3)}>
      <path d={`M${cx1} 300V346H218M${cx2} 300V346H322`} fill="none" stroke={ink} strokeWidth="2.4" />
      <rect x={218} y={324} width={104} height={44} rx="8" fill={panelFill} stroke={panelLine} strokeWidth="1.8" />
      {leftPositive ? <><path d="M254 330V362" stroke={ink} strokeWidth="2.4" /><path d="M286 338V354" stroke={ink} strokeWidth="6" /></> : <><path d="M254 338V354" stroke={ink} strokeWidth="6" /><path d="M286 330V362" stroke={ink} strokeWidth="2.4" /></>}
      <text x={236} y={351} fontSize="15" fontWeight="700" fill={ink} textAnchor="middle">{leftSign}</text>
      <text x={304} y={351} fontSize="15" fontWeight="700" fill={ink} textAnchor="middle">{rightSign}</text>
      {!assessment && <text x={270} y={388} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={ink}>d.c. power supply</text>}
    </g>
    {/* the labels for step 2 */}
    {!assessment && <g opacity={o(2)}>
      <text x={cx1} y={80} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>cathode (−)</text>
      <text x={cx2} y={80} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>anode (+)</text>
    </g>}
    {gas && <g opacity={o(3, 4)}><Bubbles x={cx1 - 12} y={236} dir={-1} /><Bubbles x={cx2 + 12} y={236} dir={1} />
      <g fontSize="12.5" fontWeight="700" fill={ink}><text x={cx1 - 34} y={130} textAnchor="end">gas</text><text x={cx2 + 34} y={130}>gas</text></g>
    </g>}
    {assessment ? <g>
      <Num n={1} x={cx1 - 36} y={276} plain /><Num n={2} x={cx2 + 36} y={276} plain /><Num n={3} x={cx1 - 46} y={122} plain /><Num n={4} x={cx2 + 46} y={122} plain />
    </g> : <g>
      <Num n={1} x={50} y={130} on={on.includes(1)} /><Num n={2} x={cx1 - 62} y={72} on={on.includes(2)} /><Num n={3} x={196} y={346} on={on.includes(3)} /><Num n={4} x={cx2 + 62} y={72} on={on.includes(4)} />
    </g>}
    {!assessment && <g>{STEP_TEXT.map((lines, i) => <g key={i} opacity={on.includes(i + 1) ? 1 : faded}>
      <Num n={i + 1} x={32} y={430 + i * 46} on={on.includes(i + 1)} />
      <text fontSize="13" fontWeight={on.includes(i + 1) ? 700 : 500} fill={ink}>{lines.map((l, j) => <tspan key={j} x={54} y={430 + i * 46 + 5 + j * 17 - (lines.length - 1) * 8}>{l}</tspan>)}</text></g>)}</g>}
  </Diagram>
}

// ---------- On your own: data table ----------
function ProductData() {
  const rows: Array<[string, string, string]> = [['P', 'copper metal', 'oxygen'], ['Q', 'hydrogen', 'oxygen'], ['R', 'hydrogen', 'chlorine']]
  return <Diagram schematic={false} viewBox="0 0 540 250" title="A data table. Three solutions were electrolysed with inert electrodes. Solution P: copper metal at the cathode, oxygen at the anode. Solution Q: hydrogen at the cathode, oxygen at the anode. Solution R: hydrogen at the cathode, chlorine at the anode.">
    <text x={24} y={28} fontSize="15" fontWeight="700" fill={ink}>Three solutions, electrolysed with inert electrodes</text>
    <rect x={20} y={44} width={500} height={188} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="14" fontWeight="700" fill={ink}><text x={40} y={76}>solution</text><text x={176} y={76}>made at the cathode</text><text x={376} y={76}>made at the anode</text></g>
    <path d="M32 92H508" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([s, c, a], i) => <g key={s} fontSize="15" fill={ink}><text x={40} y={128 + i * 40} fontWeight="700">{s}</text><text x={176} y={128 + i * 40}>{c}</text><text x={376} y={128 + i * 40}>{a}</text></g>)}
  </Diagram>
}

export function AqueousVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'aqel-water': return <Water />
    case 'aqel-ions': return <Ions />
    case 'aqel-move': return <Cell salt="nacl" stage="move" />
    case 'aqel-cath-strip': return <Cathode stage="strip" />
    case 'aqel-cath-more': return <Cathode stage="more" />
    case 'aqel-cath-less': return <Cathode stage="less" />
    case 'aqel-an-q': return <Anode stage="q" />
    case 'aqel-an-yes': return <Anode stage="yes" />
    case 'aqel-an-no': return <Anode stage="no" />
    case 'aqel-cu-ions': return <Cell salt="cuso4" stage="ions" />
    case 'aqel-cu-cathode': return <Cell salt="cuso4" stage="cathode" />
    case 'aqel-cu-anode': return <Cell salt="cuso4" stage="anode" />
    case 'aqel-na-ions': return <Cell salt="nacl" stage="ions" />
    case 'aqel-na-cathode': return <Cell salt="nacl" stage="cathode" />
    case 'aqel-na-anode': return <Cell salt="nacl" stage="anode" />
    case 'aqel-m-set': return <Rig on={[1]} />
    case 'aqel-m-which': return <Rig on={[1, 2]} />
    case 'aqel-m-run': return <Rig on={[1, 2, 3, 4]} />
    case 'aqel-m-all': return <Rig on={[1, 2, 3, 4]} />
    case 'aqel-question-rig': return <Rig on={[1, 2, 3, 4]} assessment />
    case 'aqel-question-data': return <ProductData />
    default: return <Rig on={[1, 2, 3, 4]} assessment={assessment} />
  }
}
