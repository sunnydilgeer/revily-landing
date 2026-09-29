import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C4 (Chemistry Lesson 26): electrolysis. Original, code-native schematics; not to scale.
 * Focus ids start with 'elec-'.
 *
 * Ion styling follows the Chemistry convention (see IonVisuals): positive ions are coral (proton tint), negative ions
 * are electron blue, charge shown at the top right with the real minus sign. Uncharged atoms and molecules are plain
 * grey circles. One cell drawing is reused for the whole first walkthrough (electrolyte, electrodes, poles, movement,
 * discharge) and again for molten lead bromide and for aluminium: the negative electrode (cathode) on the left, the
 * positive electrode (anode) on the right, with a cell symbol (long line +, short line −) for the power supply.
 * In assessment view the words go and only numbered pointers stay.
 */
const { ink, muted, protonLine, electronLine, panelFill, panelLine } = atomPalette
const posFill = '#fbe1de', posLine = protonLine, posInk = '#8a332c'
const negFill = '#dcecf8', negLine = electronLine, negInk = '#1d5787'
const atomFill = '#e3e7ea', atomLine = '#7f8c97'
const oxyFill = '#d9ecf0', oxyLine = '#5f9aa8'
const hot = '#d98a1c'
const glass = '#6f8798', liquidFill = '#eef5fa', electrodeFill = '#b9c2c9', electrodeLine = '#6f7d88', graphiteFill = '#4b5560'
const chipFill = '#eef1f3', chipLine = '#7f8c97'

function Diagram({ title, children, viewBox = '0 0 540 330', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Pointer({ n, x, y, to }: { n: number; x: number; y: number; to: [number, number] }) {
  const a = Math.atan2(to[1] - y, to[0] - x)
  return <g><path d={`M${(x + Math.cos(a) * 13).toFixed(1)} ${(y + Math.sin(a) * 13).toFixed(1)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
    <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}
function Arr({ x1, y1, x2, y2, colour = ink, width = 2.5 }: { x1: number; y1: number; x2: number; y2: number; colour?: string; width?: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 10
  const p = (t: number) => `${(x2 - h * Math.cos(a + t)).toFixed(1)} ${(y2 - h * Math.sin(a + t)).toFixed(1)}`
  return <g><path d={`M${x1} ${y1}L${(x2 - 6 * Math.cos(a)).toFixed(1)} ${(y2 - 6 * Math.sin(a)).toFixed(1)}`} stroke={colour} strokeWidth={width} fill="none" /><path d={`M${x2} ${y2}L${p(.45)}L${p(-.45)}Z`} fill={colour} stroke={colour} strokeWidth="1" /></g>
}
/** A formula with real subscripts: a digit after a letter or bracket drops; a leading digit is a coefficient. */
function Fm({ f, size = 16 }: { f: string; size?: number }) {
  const out: ReactNode[] = []
  let prev = ''
  ;[...f].forEach((ch, i) => {
    if (/\d/.test(ch) && /[A-Za-z)]/.test(prev)) out.push(<tspan key={i} fontSize={Math.max(12, Math.round(size * .72))} dy={size * .28}>{ch}</tspan>, <tspan key={`${i}r`} dy={-size * .28}>{'​'}</tspan>)
    else out.push(<tspan key={i}>{ch}</tspan>)
    prev = ch
  })
  return <>{out}</>
}

function Ion({ x, y, label, pos, r = 17 }: { x: number; y: number; label: string; pos: boolean; r?: number }) {
  return <g><circle cx={x} cy={y} r={r} fill={pos ? posFill : negFill} stroke={pos ? posLine : negLine} strokeWidth="2" />
    <text x={x} y={y + 4.5} textAnchor="middle" fontSize={label.length > 1 ? 12 : 17} fontWeight="700" fill={pos ? posInk : negInk}>{label}</text></g>
}
function Atom({ x, y, label = '', r = 14 }: { x: number; y: number; label?: string; r?: number }) {
  return <g><circle cx={x} cy={y} r={r} fill={atomFill} stroke={atomLine} strokeWidth="2" />{label && <text x={x} y={y + 4.5} textAnchor="middle" fontSize="12" fontWeight="700" fill={ink}>{label}</text>}</g>
}
function Pair({ x, y }: { x: number; y: number }) {
  return <g><circle cx={x - 8} cy={y} r="10" fill={atomFill} stroke={atomLine} strokeWidth="2" /><circle cx={x + 8} cy={y} r="10" fill={atomFill} stroke={atomLine} strokeWidth="2" /></g>
}

// ---------- The cell ----------
type CellLabel = { side: 'l' | 'r'; y: number; lines: string[]; to: [number, number] }
type CellProps = {
  mode: 'mixed' | 'move' | 'done'; pos: string; neg: string; nPos: number; nNeg: number; title: string
  labels?: CellLabel[]; caption?: string; cathodeAtom?: string; pool?: boolean; anodeDark?: boolean; hl?: 'liquid' | 'electrodes'
  assessment?: boolean; flip?: boolean
}
const L = 169, R = 371
// Slots for ions: mixed (spread out), move (positives left, negatives right), done (what is left in the middle).
const MIXED_GENERIC = { pos: [[215, 175], [300, 232], [262, 190]], neg: [[318, 178], [228, 238], [345, 235]] }
const MIXED_2_4 = { pos: [[222, 178], [300, 225]], neg: [[268, 178], [330, 185], [240, 240], [335, 245]] }
const MOVE = { pos: [[208, 185], [240, 222], [208, 258]], neg: [[335, 185], [300, 222], [335, 258]] }
const DONE = { pos: [[240, 200], [240, 247]], neg: [[298, 186], [326, 220], [298, 250]] }

function Cell({ mode, pos, neg, nPos, nNeg, title, labels = [], caption, cathodeAtom = '', pool = false, anodeDark = false, hl, assessment = false, flip = false }: CellProps) {
  const mixed = nPos === 2 && nNeg === 4 ? MIXED_2_4 : MIXED_GENERIC
  const slots = mode === 'mixed' ? mixed : mode === 'move' ? MOVE : DONE
  const leftPositive = flip
  const line = (long: boolean) => long ? { h: 13, w: 2.5 } : { h: 7, w: 5 }
  const ll = line(leftPositive), rl = line(!leftPositive)
  const plus = '+', minus = '−'
  const labelEls = assessment ? null : labels.map((l, i) => {
    const x = l.side === 'l' ? 8 : 532, anchor = l.side === 'l' ? 'start' : 'end'
    const wid = Math.max(...l.lines.map(t => t.length)) * 7 + 8
    const y0 = l.y - (l.lines.length - 1) * 8
    const sx = l.side === 'l' ? x + wid : x - wid
    return <g key={i}><text x={x} y={y0} textAnchor={anchor} fontSize="13" fontWeight="700" fill={ink}>{l.lines.map((t, k) => <tspan key={k} x={x} dy={k === 0 ? 0 : 16}>{t}</tspan>)}</text>
      <path d={`M${sx} ${l.y - 4}L${l.to[0]} ${l.to[1]}`} stroke={muted} strokeWidth="1.5" /><circle cx={l.to[0]} cy={l.to[1]} r="2.6" fill={muted} /></g>
  })
  return <Diagram title={title} viewBox="0 0 540 330">
    {/* wires and power supply */}
    <path d={`M${L} 78V44H258M${R} 78V44H282`} stroke={ink} strokeWidth="2.5" fill="none" />
    <path d={`M258 ${44 - ll.h}V${44 + ll.h}`} stroke={ink} strokeWidth={ll.w} />
    <path d={`M282 ${44 - rl.h}V${44 + rl.h}`} stroke={ink} strokeWidth={rl.w} />
    <text x={258} y={72} textAnchor="middle" fontSize="20" fontWeight="700" fill={ink}>{leftPositive ? plus : minus}</text>
    <text x={282} y={72} textAnchor="middle" fontSize="20" fontWeight="700" fill={ink}>{leftPositive ? minus : plus}</text>
    {!assessment && <text x={270} y={20} textAnchor="middle" fontSize="13" fill={muted}>power supply</text>}
    {/* beaker and liquid */}
    <rect x={112} y={140} width={316} height={148} fill={liquidFill} stroke={hl === 'liquid' ? hot : 'none'} strokeWidth="4" strokeDasharray={hl === 'liquid' ? '8 5' : undefined} />
    <path d="M110 110V290H430V110" stroke={glass} strokeWidth="3" fill="none" />
    {pool && <rect x={112} y={268} width={316} height={20} fill="#c5ccd2" stroke={atomLine} strokeWidth="1.5" />}
    {/* electrodes */}
    <rect x={L - 9} y={78} width={18} height={172} rx="3" fill={electrodeFill} stroke={hl === 'electrodes' ? hot : electrodeLine} strokeWidth={hl === 'electrodes' ? 4 : 2} />
    <rect x={R - 9} y={78} width={18} height={172} rx="3" fill={anodeDark ? graphiteFill : electrodeFill} stroke={hl === 'electrodes' ? hot : electrodeLine} strokeWidth={hl === 'electrodes' ? 4 : 2} />
    {/* ions */}
    {slots.pos.slice(0, nPos).map(([x, y], i) => <Ion key={`p${i}`} x={x} y={y} label={pos} pos />)}
    {slots.neg.slice(0, nNeg).map(([x, y], i) => <Ion key={`n${i}`} x={x} y={y} label={neg} pos={false} />)}
    {mode === 'move' && <g><Arr x1={252} y1={156} x2={196} y2={156} colour={posLine} width={3.5} /><Arr x1={288} y1={156} x2={344} y2={156} colour={negLine} width={3.5} /></g>}
    {mode === 'done' && <g>
      {[180, 212, 244].map(y => <Atom key={y} x={196} y={y} label={cathodeAtom} />)}
      <Pair x={406} y={188} /><Pair x={406} y={228} />
    </g>}
    {caption && !assessment && <text x={270} y={318} textAnchor="middle" fontSize="14" fill={muted}>{caption}</text>}
    {labelEls}
    {assessment && <g><Pointer n={1} x={56} y={120} to={[L, 120]} /><Pointer n={2} x={484} y={120} to={[R, 120]} /><Pointer n={3} x={484} y={215} to={[410, 215]} /><Pointer n={4} x={350} y={18} to={[285, 36]} /></g>}
  </Diagram>
}

// ---------- Solid and molten ----------
function MoltenWhy() {
  const grid = [0, 1, 2].flatMap(r => [0, 1, 2].map(c => ({ x: 96 + c * 44, y: 96 + r * 44, pos: (r + c) % 2 === 0 })))
  const loose: Array<[number, number, boolean, number, number]> = [[326, 90, true, 1, -1], [400, 84, false, 1, 0], [470, 100, true, 0, 1], [356, 140, false, -1, 1], [428, 140, true, 1, 1], [490, 165, false, -1, 0], [330, 195, true, 1, 0], [395, 190, false, 0, 1], [455, 200, true, -1, 0]]
  return <Diagram title="Two panels. In a solid ionic compound, positive and negative ions sit in a fixed pattern and cannot move, so no current flows. In a molten ionic compound, the ions are spread out and free to move, so current can flow." viewBox="0 0 540 300">
    <rect x={20} y={16} width={240} height={268} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <rect x={280} y={16} width={240} height={268} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={140} y={46} textAnchor="middle" fontSize="17" fontWeight="700" fill={ink}>solid</text>
    <text x={400} y={46} textAnchor="middle" fontSize="17" fontWeight="700" fill={ink}>molten</text>
    {grid.map((g, i) => <Ion key={i} x={g.x} y={g.y + 4} label={g.pos ? '+' : '−'} pos={g.pos} />)}
    {loose.map(([x, y, p, dx, dy], i) => <g key={i}><Ion x={x} y={y - 6} label={p ? '+' : '−'} pos={p} r={15} /><Arr x1={x + dx * 17} y1={y - 6 + dy * 17} x2={x + dx * 31} y2={y - 6 + dy * 31} colour={muted} width={2} /></g>)}
    <text x={140} y={236} textAnchor="middle" fontSize="14" fill={ink}>ions held in place</text>
    <text x={140} y={258} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>no current</text>
    <text x={400} y={236} textAnchor="middle" fontSize="14" fill={ink}>ions free to move</text>
    <text x={400} y={258} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>current can flow</text>
  </Diagram>
}

// ---------- Metal at the cathode, non-metal at the anode ----------
function MoltenRule() {
  const rows: Array<[string, string, string]> = [['lead bromide', 'lead', 'bromine'], ['sodium chloride', 'sodium', 'chlorine'], ['zinc iodide', 'zinc', 'iodine']]
  return <Diagram title="A table of three molten ionic compounds. Lead bromide gives lead at the cathode and bromine at the anode. Sodium chloride gives sodium and chlorine. Zinc iodide gives zinc and iodine. The metal always forms at the cathode and the non-metal at the anode." viewBox="0 0 540 290">
    <rect x={10} y={16} width={520} height={262} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <rect x={190} y={28} width={160} height={54} rx="8" fill={posFill} stroke={posLine} strokeWidth="2" />
    <rect x={360} y={28} width={160} height={54} rx="8" fill={negFill} stroke={negLine} strokeWidth="2" />
    <text x={30} y={60} fontSize="14" fontWeight="700" fill={ink}>molten compound</text>
    <text x={270} y={50} textAnchor="middle" fontSize="15" fontWeight="700" fill={posInk}>cathode (−)</text><text x={270} y={69} textAnchor="middle" fontSize="13" fill={posInk}>metal forms</text>
    <text x={440} y={50} textAnchor="middle" fontSize="15" fontWeight="700" fill={negInk}>anode (+)</text><text x={440} y={69} textAnchor="middle" fontSize="13" fill={negInk}>non-metal forms</text>
    {rows.map(([c, m, n], i) => <g key={c}>
      <path d={`M24 ${100 + i * 62}H516`} stroke={panelLine} strokeWidth="1.5" />
      <text x={30} y={121 + i * 62} fontSize="15" fill={ink}>{c}</text>
      <text x={270} y={121 + i * 62} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{m}</text>
      <text x={440} y={121 + i * 62} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{n}</text>
    </g>)}
  </Diagram>
}

// ---------- Aluminium ----------
function AlWhy() {
  return <Diagram title="Two bars compare melting points, not to scale. Aluminium oxide alone has a very high melting point. Aluminium oxide dissolved in molten cryolite has a much lower melting point, so less energy is needed." viewBox="0 0 540 320">
    <text x={24} y={30} fontSize="14" fontWeight="700" fill={ink}>melting point</text>
    <Arr x1={34} y1={230} x2={34} y2={44} colour={muted} width={2} />
    <path d="M34 230H520" stroke={muted} strokeWidth="2" />
    <rect x={110} y={70} width={110} height={160} rx="6" fill="#f7d9a8" stroke={hot} strokeWidth="2.5" />
    <rect x={330} y={160} width={110} height={70} rx="6" fill="#f7d9a8" stroke={hot} strokeWidth="2.5" />
    <text x={165} y={262} textAnchor="middle" fontSize="14" fill={ink}>aluminium oxide</text><text x={165} y={280} textAnchor="middle" fontSize="14" fill={ink}>on its own</text>
    <text x={385} y={262} textAnchor="middle" fontSize="14" fill={ink}>aluminium oxide</text><text x={385} y={280} textAnchor="middle" fontSize="14" fill={ink}>in molten cryolite</text>
    <Arr x1={240} y1={100} x2={318} y2={150} colour={ink} width={3} />
    <text x={290} y={92} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>cryolite lowers it</text>
  </Diagram>
}
function AlGraphite() {
  return <Diagram title="Oxygen made at the graphite anode reacts with the carbon of the anode to make carbon dioxide. So the anode wears away and has to be replaced." viewBox="0 0 540 290">
    <rect x={10} y={16} width={520} height={190} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <Pair x={62} y={100} /><text x={62} y={140} textAnchor="middle" fontSize="14" fill={ink}>oxygen</text><text x={62} y={158} textAnchor="middle" fontSize="14" fill={ink}>O₂</text>
    <text x={122} y={106} textAnchor="middle" fontSize="24" fontWeight="700" fill={ink}>+</text>
    <rect x={150} y={72} width={110} height={56} rx="6" fill={graphiteFill} stroke={ink} strokeWidth="2" />
    <text x={205} y={106} textAnchor="middle" fontSize="15" fontWeight="700" fill="white">carbon, C</text>
    <text x={205} y={148} textAnchor="middle" fontSize="14" fill={ink}>graphite anode</text>
    <Arr x1={284} y1={100} x2={344} y2={100} width={3.5} />
    <g><circle cx={380} cy={100} r="13" fill={oxyFill} stroke={oxyLine} strokeWidth="2" /><circle cx={420} cy={100} r="17" fill={graphiteFill} stroke={ink} strokeWidth="2" /><circle cx={460} cy={100} r="13" fill={oxyFill} stroke={oxyLine} strokeWidth="2" />
      <text x={380} y={105} textAnchor="middle" fontSize="12" fontWeight="700" fill={ink}>O</text><text x={420} y={105} textAnchor="middle" fontSize="12" fontWeight="700" fill="white">C</text><text x={460} y={105} textAnchor="middle" fontSize="12" fontWeight="700" fill={ink}>O</text></g>
    <text x={420} y={148} textAnchor="middle" fontSize="14" fill={ink}>carbon dioxide</text><text x={420} y={166} textAnchor="middle" fontSize="14" fill={ink}>CO₂</text>
    <text x={270} y={250} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>The anode is used up, so it is replaced regularly.</text>
  </Diagram>
}
function AlEquation() {
  const chip = (x: number, top: string, bottom: string) => <g><rect x={x} y={36} width={148} height={60} rx="10" fill={chipFill} stroke={chipLine} strokeWidth="2" /><text x={x + 74} y={62} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{top}</text><text x={x + 74} y={82} textAnchor="middle" fontSize="15" fill={ink}><Fm f={bottom} /></text></g>
  return <Diagram title="Aluminium oxide splits into aluminium and oxygen. The balanced symbol equation is 2 Al2O3 (liquid) gives 4 Al (liquid) plus 3 O2 (gas). A count shows 4 aluminium atoms and 6 oxygen atoms on each side." viewBox="0 0 540 320">
    {chip(12, 'aluminium oxide', 'Al2O3')}
    <Arr x1={166} y1={66} x2={196} y2={66} width={3.5} />
    {chip(204, 'aluminium', 'Al')}
    <text x={366} y={74} textAnchor="middle" fontSize="24" fontWeight="700" fill={ink}>+</text>
    {chip(380, 'oxygen', 'O2')}
    <rect x={20} y={124} width={500} height={56} rx="10" fill="#5b3d7a" />
    <text x={270} y={160} textAnchor="middle" fontSize="20" fontWeight="700" fill="white"><Fm f="2Al2O3(l)" size={20} /> → <Fm f="4Al(l)" size={20} /> + <Fm f="3O2(g)" size={20} /></text>
    <rect x={130} y={200} width={280} height={104} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="14" fill={ink} textAnchor="middle" fontWeight="700"><text x={230} y={226}>left</text><text x={330} y={226}>right</text></g>
    <path d="M144 234H396" stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="15" fill={ink}><text x={150} y={260}>Al</text><text x={230} y={260} textAnchor="middle">4</text><text x={330} y={260} textAnchor="middle">4</text>
      <text x={150} y={288}>O</text><text x={230} y={288} textAnchor="middle">6</text><text x={330} y={288} textAnchor="middle">6</text></g>
  </Diagram>
}

// ---------- On your own: results table ----------
function ResultsTable() {
  const rows: Array<[string, string, string]> = [['A', 'silver-grey solid forms', 'green gas forms'], ['B', 'grey solid forms', 'red-brown vapour forms']]
  return <Diagram schematic={false} viewBox="0 0 540 250" title="A results table. Two molten compounds were electrolysed with inert electrodes. Compound A: at the negative electrode a silver-grey solid forms, at the positive electrode a green gas forms. Compound B: at the negative electrode a grey solid forms, at the positive electrode a red-brown vapour forms.">
    <text x={24} y={30} fontSize="15" fontWeight="700" fill={ink}>Two molten compounds electrolysed</text>
    <rect x={20} y={46} width={500} height={188} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="14" fontWeight="700" fill={ink}><text x={36} y={92}>compound</text><text x={140} y={76}>at the negative</text><text x={140} y={94}>electrode</text><text x={330} y={76}>at the positive</text><text x={330} y={94}>electrode</text></g>
    <path d="M32 108H508" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([c, a, b], i) => <g key={c} fontSize="14" fill={ink}><text x={36} y={148 + i * 50} fontWeight="700">{c}</text><text x={140} y={148 + i * 50}>{a}</text><text x={330} y={148 + i * 50}>{b}</text></g>)}
  </Diagram>
}

const GENERIC = { pos: '+', neg: '−', nPos: 3, nNeg: 3 }
const PBBR2 = { pos: 'Pb²⁺', neg: 'Br⁻' }

export function ElectrolysisVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'elec-electrolyte': return <Cell mode="mixed" {...GENERIC} hl="liquid" title="An electrolysis cell: a beaker of liquid with two solid rods dipping in, joined by wires to a power supply. The liquid holds moving positive and negative ions. The liquid is the electrolyte." labels={[{ side: 'r', y: 205, lines: ['electrolyte'], to: [412, 205] }]} caption="a liquid or solution that conducts" />
    case 'elec-electrode': return <Cell mode="mixed" {...GENERIC} hl="electrodes" title="An electrolysis cell. The two solid rods that dip into the liquid and connect to the power supply are the electrodes." labels={[{ side: 'l', y: 96, lines: ['electrode'], to: [L, 96] }, { side: 'r', y: 96, lines: ['electrode'], to: [R, 96] }]} />
    case 'elec-poles': return <Cell mode="mixed" {...GENERIC} title="An electrolysis cell. The electrode joined to the negative side of the power supply is the cathode, on the left. The electrode joined to the positive side is the anode, on the right." labels={[{ side: 'l', y: 96, lines: ['cathode', '(negative)'], to: [L, 96] }, { side: 'r', y: 96, lines: ['anode', '(positive)'], to: [R, 96] }]} />
    case 'elec-move': return <Cell mode="move" {...GENERIC} title="Positive ions move left towards the negative cathode, where they gain electrons. Negative ions move right towards the positive anode, where they lose electrons." labels={[{ side: 'l', y: 205, lines: ['gain', 'electrons'], to: [L - 9, 205] }, { side: 'r', y: 205, lines: ['lose', 'electrons'], to: [R + 9, 205] }]} />
    case 'elec-discharge': return <Cell mode="done" {...GENERIC} nPos={2} nNeg={3} title="At the cathode the positive ions have become uncharged atoms. At the anode the negative ions have become uncharged atoms joined in pairs. The ions have been discharged." labels={[{ side: 'l', y: 205, lines: ['uncharged', 'atoms'], to: [182, 212] }, { side: 'r', y: 205, lines: ['uncharged', 'element'], to: [420, 208] }]} caption="the ions are discharged" />
    case 'elec-molten-why': return <MoltenWhy />
    case 'elec-molten-pbbr2': return <Cell mode="done" {...PBBR2} nPos={1} nNeg={2} cathodeAtom="Pb" title="Molten lead bromide is electrolysed. Positive lead ions, Pb 2 plus, move to the cathode and become lead atoms. Negative bromide ions, Br minus, move to the anode and become bromine molecules." labels={[{ side: 'l', y: 205, lines: ['lead', '(a metal)'], to: [182, 212] }, { side: 'r', y: 205, lines: ['bromine', '(Br₂)'], to: [420, 208] }, { side: 'l', y: 96, lines: ['cathode'], to: [L, 96] }, { side: 'r', y: 96, lines: ['anode'], to: [R, 96] }]} caption="molten lead bromide" />
    case 'elec-molten-rule': return <MoltenRule />
    case 'elec-molten-inert': return <Cell mode="mixed" {...PBBR2} nPos={2} nNeg={4} hl="electrodes" title="Molten lead bromide with two inert electrodes. Inert electrodes do not react with the electrolyte or the products." labels={[{ side: 'l', y: 96, lines: ['inert', 'electrode'], to: [L, 96] }, { side: 'r', y: 96, lines: ['inert', 'electrode'], to: [R, 96] }]} caption="molten lead bromide" />
    case 'elec-al-why': return <AlWhy />
    case 'elec-al-cell': return <Cell mode="done" pos="Al³⁺" neg="O²⁻" nPos={2} nNeg={3} cathodeAtom="Al" pool anodeDark title="An aluminium cell. Positive aluminium ions move to the cathode and become aluminium atoms, which sink as a liquid to the bottom. Negative oxide ions move to the graphite anode and become oxygen gas." labels={[{ side: 'l', y: 279, lines: ['aluminium', '(liquid)'], to: [130, 279] }, { side: 'l', y: 205, lines: ['aluminium', 'atoms'], to: [182, 212] }, { side: 'r', y: 96, lines: ['graphite', 'anode'], to: [R, 96] }, { side: 'r', y: 205, lines: ['oxygen', '(O₂)'], to: [420, 208] }]} caption="aluminium oxide dissolved in molten cryolite" />
    case 'elec-al-graphite': return <AlGraphite />
    case 'elec-al-equation': return <AlEquation />
    case 'elec-question-cell': return <Cell mode="mixed" {...GENERIC} assessment title="An electrolysis cell with four numbered parts. Part 1 is the left electrode, part 2 is the right electrode, part 3 is the liquid and part 4 is the power supply, drawn as a cell symbol with the plus sign on the right." />
    case 'elec-question-data': return <ResultsTable />
    default: return <Cell mode="mixed" {...GENERIC} assessment={assessment} title="An electrolysis cell with two electrodes dipping into a liquid." />
  }
}
