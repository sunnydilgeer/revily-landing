import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C4 (Chemistry Lesson 24): the reactivity series and extracting metals. Original, code-native schematics;
 * not to scale. Focus ids start with 'react-'.
 *
 * Colour code (Chemistry convention from AtomVisuals): positive ions and metals in the coral tint, electrons in the
 * electron blue, oxygen in a teal tint, carbon in slate. The three reactivity bands use coral (very reactive), amber
 * (fairly reactive) and grey (not very reactive), the same tints the periodic-table slices use. Amber outlines mark
 * what a frame is about. In assessment view the band names and the carbon dividing line go; numbered badges stay.
 */
const { ink, muted, protonLine, electronFill, electronLine, panelFill, panelLine } = atomPalette
const metalFill = '#fbe1de', metalInk = '#8a332c'
const midFill = '#fff4e6', midLine = '#d9a55b', midInk = '#8a5a14'
const lowFill = '#eef1f3', lowLine = '#7f8c97'
const oxyFill = '#d3ede9', oxyLine = '#3a9a90'
const carbonFill = '#dfe4e9', carbonLine = '#5b6772'
const hot = '#d98a1c', good = '#3f9b6a'
const faded = 0.3

function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
/** A formula with real subscripts: "Fe2O3" gives Fe₂O₃; a number at the start is a coefficient and stays full size. */
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
function Arr({ x1, y1, x2, y2, colour = ink, width = 2.5, dash }: { x1: number; y1: number; x2: number; y2: number; colour?: string; width?: number; dash?: string }) {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 10
  const p = (t: number) => `${(x2 - h * Math.cos(a + t)).toFixed(1)} ${(y2 - h * Math.sin(a + t)).toFixed(1)}`
  return <g><path d={`M${x1} ${y1}L${(x2 - 6 * Math.cos(a)).toFixed(1)} ${(y2 - 6 * Math.sin(a)).toFixed(1)}`} stroke={colour} strokeWidth={width} strokeDasharray={dash} fill="none" /><path d={`M${x2} ${y2}L${p(.45)}L${p(-.45)}Z`} fill={colour} stroke={colour} strokeWidth="1" /></g>
}
function Num({ n, x, y }: { n: number; x: number; y: number }) {
  return <g><circle cx={x} cy={y} r="12" fill={hot} stroke={hot} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="white">{n}</text></g>
}

// ---------- The ladder ----------
type Row = { name: string; sym: string; band: 0 | 1 | 2 | 3 }
const ROWS: Row[] = [
  { name: 'Potassium', sym: 'K', band: 0 }, { name: 'Sodium', sym: 'Na', band: 0 }, { name: 'Lithium', sym: 'Li', band: 0 }, { name: 'Calcium', sym: 'Ca', band: 0 },
  { name: 'Magnesium', sym: 'Mg', band: 1 }, { name: 'Carbon', sym: 'C', band: 1 }, { name: 'Zinc', sym: 'Zn', band: 1 }, { name: 'Iron', sym: 'Fe', band: 1 },
  { name: 'Hydrogen', sym: 'H', band: 2 }, { name: 'Copper', sym: 'Cu', band: 2 },
  { name: 'Gold', sym: 'Au', band: 3 },
]
const NONMETAL = new Set(['Carbon', 'Hydrogen'])
const rowY = (i: number) => 46 + i * 29
const tint = (b: number) => b === 0 ? { f: metalFill, l: protonLine } : b === 1 ? { f: midFill, l: midLine } : { f: lowFill, l: lowLine }
type LadderMode = 'bands' | 'nonmetal' | 'cut' | 'gold' | 'question'

function Brace({ from, to, x = 334 }: { from: number; to: number; x?: number }) {
  return <path d={`M${x} ${rowY(from) + 2}Q${x + 8} ${rowY(from) + 2} ${x + 8} ${rowY(from) + 10}V${(rowY(from) + rowY(to) + 24) / 2 - 6}L${x + 14} ${(rowY(from) + rowY(to) + 24) / 2}L${x + 8} ${(rowY(from) + rowY(to) + 24) / 2 + 6}V${rowY(to) + 14}Q${x + 8} ${rowY(to) + 22} ${x} ${rowY(to) + 22}`} fill="none" stroke={muted} strokeWidth="1.8" />
}
const LADDER_TITLES: Record<LadderMode, string> = {
  bands: 'The reactivity series as a ladder, most reactive at the top: potassium, sodium, lithium, calcium, magnesium, carbon, zinc, iron, hydrogen, copper. Potassium to calcium are very reactive, magnesium to iron are fairly reactive, hydrogen and copper are not very reactive.',
  nonmetal: 'The same ladder with carbon and hydrogen outlined. They are non-metals that are included in the series to help compare metals.',
  cut: 'The ladder with carbon marked. Metals above carbon, potassium to magnesium, are extracted by electrolysis, which is expensive because of the energy needed. Metals below carbon, zinc, iron and copper, are extracted by heating with carbon.',
  gold: 'The ladder with gold added at the very bottom. Gold is so unreactive that it is found in the ground as the metal itself.',
  question: 'The reactivity series as a ladder, most reactive at the top, with carbon in its place. Four metals have number badges: calcium 1, magnesium 2, zinc 3 and iron 4.',
}
function Ladder({ mode }: { mode: LadderMode }) {
  const rows = mode === 'gold' ? ROWS : ROWS.slice(0, 10)
  const q: Record<string, number> = { Calcium: 1, Magnesium: 2, Zinc: 3, Iron: 4 }
  const dim = (r: Row) => mode === 'nonmetal' ? !NONMETAL.has(r.name) : mode === 'gold' ? r.name !== 'Gold' : false
  return <Diagram title={LADDER_TITLES[mode]} viewBox="0 0 540 372">
    <Arr x1={44} y1={rowY(rows.length - 1) + 20} x2={44} y2={44} colour={muted} width={2.5} />
    <text x={0} y={0} transform="translate(30 210) rotate(-90)" textAnchor="middle" fontSize="13" fill={muted} fontWeight="700">more reactive</text>
    {rows.map((r, i) => {
      const t = tint(r.band), nm = NONMETAL.has(r.name), on = mode === 'nonmetal' ? nm : mode === 'gold' ? r.name === 'Gold' : mode === 'cut' && r.name === 'Carbon'
      return <g key={r.name} opacity={dim(r) ? faded : 1}>
        <rect x={mode === 'question' ? 130 : 110} y={rowY(i)} width={210} height={25} rx="8" fill={nm ? '#ffffff' : t.f} stroke={on ? hot : t.l} strokeWidth={on ? 3 : 1.8} strokeDasharray={nm && !on ? '5 4' : undefined} />
        <text x={(mode === 'question' ? 130 : 110) + 14} y={rowY(i) + 17.5} fontSize="15" fontWeight="600" fill={ink}>{r.name}</text>
        <text x={(mode === 'question' ? 130 : 110) + 196} y={rowY(i) + 17.5} textAnchor="end" fontSize="15" fontWeight="700" fill={ink}>{r.sym}</text>
        {mode === 'question' && q[r.name] && <Num n={q[r.name]} x={100} y={rowY(i) + 12.5} />}
      </g>
    })}
    {mode === 'bands' && <g fontSize="15" fontWeight="700" fill={ink}>
      <Brace from={0} to={3} /><text x={362} y={(rowY(0) + rowY(3) + 24) / 2 - 2}>very</text><text x={362} y={(rowY(0) + rowY(3) + 24) / 2 + 16}>reactive</text>
      <Brace from={4} to={7} /><text x={362} y={(rowY(4) + rowY(7) + 24) / 2 - 2}>fairly</text><text x={362} y={(rowY(4) + rowY(7) + 24) / 2 + 16}>reactive</text>
      <Brace from={8} to={9} /><text x={362} y={(rowY(8) + rowY(9) + 24) / 2 - 8}>not very</text><text x={362} y={(rowY(8) + rowY(9) + 24) / 2 + 10}>reactive</text>
    </g>}
    {mode === 'nonmetal' && <g fontSize="14" fill={ink}>
      <path d={`M322 ${rowY(5) + 12}H352`} stroke={hot} strokeWidth="2" /><path d={`M322 ${rowY(8) + 12}H340V${rowY(5) + 12}`} stroke={hot} strokeWidth="2" fill="none" />
      <text x={358} y={rowY(5) + 2} fontWeight="700">carbon and</text><text x={358} y={rowY(5) + 20} fontWeight="700">hydrogen</text>
      <text x={358} y={rowY(5) + 44}>are non-metals,</text><text x={358} y={rowY(5) + 62}>put in the series</text><text x={358} y={rowY(5) + 80}>to help compare</text>
    </g>}
    {mode === 'cut' && <g fontSize="14" fill={ink}>
      <path d={`M104 ${rowY(5) - 2}H326`} stroke={hot} strokeWidth="2.6" strokeDasharray="7 5" /><path d={`M104 ${rowY(5) + 27}H326`} stroke={hot} strokeWidth="2.6" strokeDasharray="7 5" />
      <Brace from={0} to={4} />
      <text x={362} y={rowY(2) - 22} fontWeight="700">electrolysis</text><text x={362} y={rowY(2) - 4}>costs a lot of</text><text x={362} y={rowY(2) + 14}>energy</text>
      <Brace from={6} to={9} />
      <text x={362} y={rowY(7) - 2} fontWeight="700">heat the oxide</text><text x={362} y={rowY(7) + 16} fontWeight="700">with carbon</text>
    </g>}
    {mode === 'gold' && <g fontSize="14" fill={ink}>
      <path d={`M322 ${rowY(10) + 12}H348`} stroke={hot} strokeWidth="2" />
      <text x={356} y={rowY(10) + 6} fontWeight="700">found as the</text><text x={356} y={rowY(10) + 24} fontWeight="700">metal itself</text>
    </g>}
  </Diagram>
}

// ---------- Why the order: atoms losing electrons ----------
function Ions() {
  const rows: Array<{ sym: string; ion: string; n: number; head: string; sub: string; strong: boolean; f: string; l: string }> = [
    { sym: 'K', ion: 'K', n: 1, head: 'very reactive', sub: 'loses its electron very easily', strong: true, f: metalFill, l: protonLine },
    { sym: 'Mg', ion: 'Mg', n: 2, head: 'fairly reactive', sub: 'loses electrons fairly easily', strong: true, f: midFill, l: midLine },
    { sym: 'Cu', ion: 'Cu', n: 2, head: 'not very reactive', sub: 'loses electrons less easily', strong: false, f: lowFill, l: lowLine },
  ]
  return <Diagram title="Three metal atoms each losing electrons to become positive ions. Potassium is very reactive and loses its one outer electron very easily, so it forms a K plus ion. Magnesium is fairly reactive and loses two electrons fairly easily. Copper is not very reactive and loses electrons less easily. The easier a metal loses electrons, the higher it is in the series." viewBox="0 0 540 316">
    {rows.map((r, i) => {
      const y = 24 + i * 96
      return <g key={r.sym}>
        <rect x={20} y={y} width={500} height={82} rx="14" fill={r.f} fillOpacity=".55" stroke={r.l} strokeWidth="1.6" />
        <circle cx={70} cy={y + 41} r="26" fill="#ffffff" stroke={carbonLine} strokeWidth="2.2" /><text x={70} y={y + 47} textAnchor="middle" fontSize="18" fontWeight="700" fill={ink}>{r.sym}</text>
        <Arr x1={106} y1={y + 41} x2={188} y2={y + 41} colour={r.strong ? ink : muted} width={r.strong ? 3 : 1.8} dash={r.strong ? undefined : '6 5'} />
        {Array.from({ length: r.n }).map((_, k) => <g key={k}><circle cx={132 + k * 26} cy={y + 24} r="8" fill={electronFill} stroke={electronLine} strokeWidth="1.8" /></g>)}
        <text x={132 + (r.n - 1) * 13} y={y + 12} textAnchor="middle" fontSize="12" fill={electronLine} fontWeight="700">{r.n === 1 ? 'electron' : 'electrons'}</text>
        <circle cx={224} cy={y + 41} r="26" fill={metalFill} stroke={protonLine} strokeWidth="2.4" />
        <text x={224} y={y + 46} textAnchor="middle" fontSize="17" fontWeight="700" fill={metalInk}>{r.ion}<tspan fontSize="12" dy="-8">{r.n === 1 ? '+' : '2+'}</tspan></text>
        <text x={272} y={y + 34} fontSize="16" fontWeight="700" fill={ink}>{r.head}</text>
        <text x={272} y={y + 56} fontSize="14" fill={ink}>{r.sub}</text>
      </g>
    })}
  </Diagram>
}

// ---------- Particle equations ----------
type Sym = 'Mg' | 'O' | 'Cu' | 'C'
const SYM: Record<Sym, { f: string; l: string; t: string }> = {
  Mg: { f: metalFill, l: protonLine, t: metalInk }, Cu: { f: metalFill, l: protonLine, t: metalInk },
  O: { f: oxyFill, l: oxyLine, t: '#1f6b63' }, C: { f: carbonFill, l: carbonLine, t: ink },
}
type Item = { g: Sym[] } | { op: string }
type Note = { at: number; to?: number; lines: string[]; colour?: string }
function Particles({ items, y, notes = [] }: { items: Item[]; y: number; notes?: Note[] }) {
  const gw = (g: Sym[]) => 33 * (g.length - 1) + 32 + 8
  const widths = items.map(it => 'g' in it ? gw(it.g) : 34)
  const total = widths.reduce((s, w) => s + w, 0)
  let x = (540 - total) / 2
  const pos = widths.map(w => { const o = x; x += w; return o })
  return <g>
    {items.map((it, i) => 'g' in it
      ? <g key={i}>{it.g.map((s, k) => <g key={k}><circle cx={pos[i] + 20 + k * 33} cy={y} r="16" fill={SYM[s].f} stroke={SYM[s].l} strokeWidth="2.2" /><text x={pos[i] + 20 + k * 33} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={SYM[s].t}>{s}</text></g>)}</g>
      : <text key={i} x={pos[i] + 17} y={y + 7} textAnchor="middle" fontSize="22" fontWeight="700" fill={muted}>{it.op}</text>)}
    {notes.map((n, k) => {
      const e = n.to ?? n.at, cx = (pos[n.at] + pos[e] + widths[e]) / 2
      return <g key={k} fontSize="14" fontWeight="700" textAnchor="middle" fill={n.colour ?? ink}>{n.lines.map((l, j) => <text key={j} x={cx} y={y + 44 + j * 18}>{l}</text>)}</g>
    })}
  </g>
}
function RuleBox({ y, head, body, tone }: { y: number; head: string; body: string; tone: 'ox' | 'red' }) {
  return <g><rect x={70} y={y} width={400} height={58} rx="12" fill={tone === 'ox' ? midFill : lowFill} stroke={tone === 'ox' ? midLine : lowLine} strokeWidth="1.8" />
    <text x={270} y={y + 25} textAnchor="middle" fontSize="17" fontWeight="700" fill={ink}>{head}</text>
    <text x={270} y={y + 46} textAnchor="middle" fontSize="14" fill={ink}>{body}</text></g>
}

function Oxide() {
  const boxes: Array<[string, number, number, string, string]> = [['metal', 40, 118, lowFill, lowLine], ['oxygen', 206, 118, oxyFill, oxyLine], ['metal oxide', 372, 128, lowFill, lowLine]]
  return <Diagram title="A word equation: metal plus oxygen makes a metal oxide. Below it, a lump of rock with dark specks inside, labelled ore, meaning rock that contains a metal compound such as an oxide. Iron and aluminium are examples of metals that react with oxygen this way." viewBox="0 0 540 300">
    {boxes.map(([t, x, w, f, l]) => <g key={t}><rect x={x} y={34} width={w} height={48} rx="10" fill={f} stroke={l} strokeWidth="1.8" /><text x={x + w / 2} y={64} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{t}</text></g>)}
    <text x={174} y={66} textAnchor="middle" fontSize="22" fontWeight="700" fill={muted}>+</text><text x={339} y={66} textAnchor="middle" fontSize="22" fontWeight="700" fill={muted}>→</text>
    <text x={270} y={112} textAnchor="middle" fontSize="14" fill={ink}>for example iron or aluminium reacting with oxygen</text>
    <path d="M64 258L84 196Q96 166 140 160L214 158Q252 162 262 196L276 250Q262 268 222 268L98 270Q72 270 64 258Z" fill="#e6e9ec" stroke={carbonLine} strokeWidth="2.4" />
    {[[118, 210], [160, 190], [196, 226], [138, 244], [232, 200], [176, 254]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="8" fill="#b7c1c9" stroke={lowLine} strokeWidth="1.6" />)}
    <text x={306} y={196} fontSize="17" fontWeight="700" fill={ink}>ore</text>
    <text x={306} y={220} fontSize="14" fill={ink}>rock that contains a</text><text x={306} y={238} fontSize="14" fill={ink}>metal compound, such</text><text x={306} y={256} fontSize="14" fill={ink}>as iron oxide</text>
    <path d="M292 190H278" stroke={muted} strokeWidth="1.6" />
  </Diagram>
}
function Oxidation() {
  return <Diagram title="Magnesium reacting with oxygen. Two magnesium atoms and an oxygen molecule made of two oxygen atoms give two magnesium oxide units, each a magnesium atom joined to an oxygen atom. The formula line reads 2Mg plus O2 gives 2MgO. Magnesium gains oxygen, so it is oxidised. Oxidation means gain of oxygen." viewBox="0 0 540 300">
    <Particles y={62} items={[{ g: ['Mg'] }, { g: ['Mg'] }, { op: '+' }, { g: ['O', 'O'] }, { op: '→' }, { g: ['Mg', 'O'] }, { g: ['Mg', 'O'] }]} notes={[{ at: 5, to: 6, lines: ['magnesium', 'gains oxygen'], colour: metalInk }]} />
    <text x={270} y={150} textAnchor="middle" fontSize="20" fontWeight="700" fill={ink}><Fm f="2Mg + O2 → 2MgO" size={20} /></text>
    <RuleBox y={190} head="Oxidation = gain of oxygen" body="Magnesium is oxidised to make magnesium oxide." tone="ox" />
    <text x={270} y={276} textAnchor="middle" fontSize="13" fill={muted}>the oxygen is shown in teal</text>
  </Diagram>
}
function Reduction({ full }: { full?: boolean }) {
  return <Diagram title="Copper oxide reacting with carbon. Two copper oxide units, each a copper atom joined to an oxygen atom, plus a carbon atom give two copper atoms and a carbon dioxide molecule, an oxygen, a carbon and an oxygen in a row. The formula line reads 2CuO plus C gives 2Cu plus CO2. Copper oxide loses oxygen, so it is reduced. Reduction means loss of oxygen." viewBox="0 0 540 300">
    <Particles y={62} items={[{ g: ['Cu', 'O'] }, { g: ['Cu', 'O'] }, { op: '+' }, { g: ['C'] }, { op: '→' }, { g: ['Cu'] }, { g: ['Cu'] }, { op: '+' }, { g: ['O', 'C', 'O'] }]} notes={[{ at: 0, to: 1, lines: ['copper oxide', 'loses oxygen'], colour: metalInk }, ...(full ? [{ at: 3, lines: ['carbon', 'gains oxygen'], colour: '#3f4a54' }] : [])]} />
    <text x={270} y={150} textAnchor="middle" fontSize="20" fontWeight="700" fill={ink}><Fm f="2CuO + C → 2Cu + CO2" size={20} /></text>
    <RuleBox y={190} head="Reduction = loss of oxygen" body="Copper oxide is reduced to make copper." tone="red" />
    <text x={270} y={276} textAnchor="middle" fontSize="13" fill={muted}>the oxygen is shown in teal</text>
  </Diagram>
}

function Carbon() {
  const items: Array<[string, string, number, number, string, string]> = [['iron oxide', 'iron oxide', 14, 112, metalFill, protonLine], ['carbon', 'carbon', 152, 84, carbonFill, carbonLine], ['iron', 'iron', 292, 64, lowFill, lowLine], ['carbon dioxide', 'CO', 384, 142, carbonFill, carbonLine]]
  return <Diagram title="Iron oxide plus carbon makes iron plus carbon dioxide, with the balanced formula 2Fe2O3 plus 3C gives 4Fe plus 3CO2. An arc shows oxygen moving from the iron oxide to the carbon. The iron oxide loses oxygen, so it is reduced. The carbon gains oxygen, so it is oxidised." viewBox="0 0 540 300">
    {items.map(([t, , x, w, f, l]) => <g key={t}><rect x={x} y={90} width={w} height={46} rx="10" fill={f} stroke={l} strokeWidth="1.8" /><text x={x + w / 2} y={118} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{t}</text></g>)}
    <text x={139} y={121} textAnchor="middle" fontSize="20" fontWeight="700" fill={muted}>+</text><text x={264} y={121} textAnchor="middle" fontSize="20" fontWeight="700" fill={muted}>→</text><text x={370} y={121} textAnchor="middle" fontSize="20" fontWeight="700" fill={muted}>+</text>
    <path d="M70 84Q70 36 270 36Q470 36 455 84" fill="none" stroke={oxyLine} strokeWidth="2.6" strokeDasharray="7 5" /><path d="M449 74L455 86L462 74" fill="none" stroke={oxyLine} strokeWidth="2.6" />
    <rect x={180} y={22} width={180} height={26} rx="13" fill={oxyFill} stroke={oxyLine} strokeWidth="1.6" /><text x={270} y={40} textAnchor="middle" fontSize="14" fontWeight="700" fill="#1f6b63">oxygen moves across</text>
    <text x={270} y={176} textAnchor="middle" fontSize="18" fontWeight="700" fill={ink}><Fm f="2Fe2O3 + 3C → 4Fe + 3CO2" size={18} /></text>
    <g fontSize="14" fontWeight="700" textAnchor="middle"><text x={70} y={214} fill={metalInk}>loses oxygen:</text><text x={70} y={234} fill={metalInk}>reduced</text>
      <text x={194} y={214} fill="#3f4a54">gains oxygen:</text><text x={194} y={234} fill="#3f4a54">oxidised</text></g>
    <text x={270} y={280} textAnchor="middle" fontSize="13" fill={muted}>carried out in a blast furnace</text>
  </Diagram>
}

function Why() {
  const panels = [
    { y: 26, metal: 'copper oxide', ok: true, top: 'carbon is more reactive than copper', res: 'carbon takes the oxygen: copper is made' },
    { y: 158, metal: 'magnesium oxide', ok: false, top: 'carbon is less reactive than magnesium', res: 'carbon cannot take the oxygen: no reaction' },
  ]
  return <Diagram title="Two cases. Carbon heated with copper oxide: carbon is more reactive than copper, so it takes the oxygen and copper is made, shown with a tick. Carbon heated with magnesium oxide: carbon is less reactive than magnesium, so it cannot take the oxygen and there is no reaction, shown with a cross." viewBox="0 0 540 300">
    {panels.map(p => <g key={p.metal}>
      <rect x={20} y={p.y} width={500} height={118} rx="14" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
      <rect x={40} y={p.y + 16} width={90} height={38} rx="9" fill={carbonFill} stroke={carbonLine} strokeWidth="1.8" /><text x={85} y={p.y + 40} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>carbon</text>
      <text x={146} y={p.y + 42} textAnchor="middle" fontSize="20" fontWeight="700" fill={muted}>+</text>
      <rect x={162} y={p.y + 16} width={160} height={38} rx="9" fill={p.ok ? metalFill : lowFill} stroke={p.ok ? protonLine : lowLine} strokeWidth="1.8" /><text x={242} y={p.y + 40} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{p.metal}</text>
      <text x={342} y={p.y + 42} textAnchor="middle" fontSize="20" fontWeight="700" fill={muted}>→</text>
      <circle cx={394} cy={p.y + 35} r="20" fill={p.ok ? '#dff2e7' : metalFill} stroke={p.ok ? good : protonLine} strokeWidth="2.4" />
      {p.ok ? <path d={`M383 ${p.y + 35}L391 ${p.y + 43}L406 ${p.y + 26}`} fill="none" stroke={good} strokeWidth="3.6" /> : <path d={`M385 ${p.y + 26}L403 ${p.y + 44}M403 ${p.y + 26}L385 ${p.y + 44}`} fill="none" stroke={protonLine} strokeWidth="3.6" />}
      <text x={422} y={p.y + 41} fontSize="15" fontWeight="700" fill={ink}>{p.ok ? 'works' : 'no change'}</text>
      <text x={40} y={p.y + 82} fontSize="15" fontWeight="700" fill={ink}>{p.top}</text>
      <text x={40} y={p.y + 103} fontSize="14" fill={ink}>{p.res}</text>
    </g>)}
  </Diagram>
}

function DataTable() {
  const rows: Array<[string, string]> = [['P oxide', 'metal P made'], ['Q oxide', 'no change'], ['R oxide', 'metal R made'], ['S oxide', 'no change']]
  return <Diagram schematic={false} viewBox="0 0 540 270" title="A data table. Four metal oxides were each heated strongly with carbon. P oxide: metal P made. Q oxide: no change. R oxide: metal R made. S oxide: no change.">
    <text x={24} y={28} fontSize="15" fontWeight="700" fill={ink}>Four metal oxides heated strongly with carbon</text>
    <text x={24} y={47} fontSize="13" fill={muted}>P, Q, R and S are different metals</text>
    <rect x={20} y={60} width={500} height={188} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="14" fontWeight="700" fill={ink}><text x={40} y={90}>oxide heated</text><text x={296} y={90}>what was seen</text></g>
    <path d="M32 102H508" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([a, b], i) => <g key={a} fontSize="15" fill={ink}><text x={40} y={130 + i * 30}>{a}</text><text x={296} y={130 + i * 30} fontWeight="700">{b}</text></g>)}
  </Diagram>
}

export function ReactivityVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'react-series': return <Ladder mode="bands" />
    case 'react-ions': return <Ions />
    case 'react-nonmetals': return <Ladder mode="nonmetal" />
    case 'react-oxide': return <Oxide />
    case 'react-oxidation': return <Oxidation />
    case 'react-reduction': return <Reduction />
    case 'react-carbon': return <Carbon />
    case 'react-cut': return <Ladder mode="cut" />
    case 'react-why': return <Why />
    case 'react-gold': return <Ladder mode="gold" />
    case 'react-question-series': return <Ladder mode="question" />
    case 'react-question-data': return <DataTable />
    default: return <Ladder mode={assessment ? 'question' : 'bands'} />
  }
}
