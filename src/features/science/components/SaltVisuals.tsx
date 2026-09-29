import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C4 (Chemistry Lesson 23): reactions of acids and making salts. Original, code-native schematics; not to scale.
 * Focus ids start with 'salt-'.
 *
 * Colour code (the Chemistry convention from AtomVisuals): the metal (or hydrogen) part of a name is a positive ion,
 * drawn in the coral tint; the acid-family part (chloride, sulfate, nitrate) is a negative ion, drawn in the
 * electron-blue tint. Acids sit on a pale amber chip (the amber the periodic-table slices use), bases on pale grey.
 * A base or salt chip is split in two: the metal word on the coral half, the second word on the grey or blue half.
 * Water and carbon dioxide are plain white chips. Amber outlines mark what the frame is about.
 * The method diagram (the required practical) is four panels of apparatus with numbered steps 1 to 6 and a key list
 * under it; a frame lights the steps it teaches and fades the rest. In assessment view the words go and only the
 * panel numbers 1 to 4 stay.
 */
const { ink, muted, protonLine, electronLine, panelFill, panelLine } = atomPalette
const metalFill = '#fbe1de', metalLine = protonLine, metalInk = '#8a332c'
const restFill = '#dcecf8', restLine = electronLine, restInk = '#1d5787'
const acidFill = '#fff4e6', acidLine = '#d9a55b', acidInk = '#8a5a14'
const baseFill = '#eef1f3', baseLine = '#7f8c97'
const plainLine = '#9fb1bd', saltLine = '#7d92a3'
const hot = '#d98a1c'
const solidFill = '#4b5560', acidLiquid = '#eef4f8', solutionFill = '#c9e2f3', glass = '#6f8798'
const flameOuter = '#f5b04c', flameInner = '#fbe0a0'
const faded = 0.28

function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}

/** A formula with real subscripts: "Na2CO3" gives Na₂CO₃; a number at the start is a coefficient and stays full size. */
function Fm({ f, size = 16 }: { f: string; size?: number }) {
  const out: ReactNode[] = []
  let prev = ''
  ;[...f].forEach((ch, i) => {
    if (/\d/.test(ch) && /[A-Za-z)]/.test(prev)) out.push(<tspan key={i} fontSize={Math.max(12, Math.round(size * .72))} dy={size * .28}>{ch}</tspan>, <tspan key={`${i}r`} dy={-size * .28}>{'​'}</tspan>)
    else out.push(<tspan key={i}>{ch === ' ' ? ' ' : ch}</tspan>)
    prev = ch
  })
  return <>{out}</>
}
function Num({ n, x, y, on = true, plain = false }: { n: number; x: number; y: number; on?: boolean; plain?: boolean }) {
  const colour = plain ? ink : on ? hot : muted
  return <g><circle cx={x} cy={y} r="12" fill={on ? colour : 'white'} stroke={colour} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill={on ? 'white' : colour}>{n}</text></g>
}
function Arr({ x1, y1, x2, y2, colour = ink, width = 2.5 }: { x1: number; y1: number; x2: number; y2: number; colour?: string; width?: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 10
  const p = (t: number) => `${(x2 - h * Math.cos(a + t)).toFixed(1)} ${(y2 - h * Math.sin(a + t)).toFixed(1)}`
  return <g><path d={`M${x1} ${y1}L${(x2 - 6 * Math.cos(a)).toFixed(1)} ${(y2 - 6 * Math.sin(a)).toFixed(1)}`} stroke={colour} strokeWidth={width} fill="none" /><path d={`M${x2} ${y2}L${p(.45)}L${p(-.45)}Z`} fill={colour} stroke={colour} strokeWidth="1" /></g>
}
function Legend({ y, items }: { y: number; items: Array<[string, string, string]> }) {
  const widths = items.map(([, , label]) => label.length * 7 + 40)
  const total = widths.reduce((s, w) => s + w, 0)
  let x = (540 - total) / 2
  return <g>{items.map(([fill, line, label], i) => {
    const x0 = x; x += widths[i]
    return <g key={label}><rect x={x0} y={y - 10} width={16} height={16} rx="4" fill={fill} stroke={line} strokeWidth="1.8" /><text x={x0 + 22} y={y + 3} fontSize="13" fill={ink}>{label}</text></g>
  })}</g>
}
const KEY_METAL: [string, string, string] = [metalFill, metalLine, 'metal, from the base']
const KEY_REST: [string, string, string] = [restFill, restLine, 'family, from the acid']

// ---------- Word-equation chips ----------
type Kind = 'acid' | 'base' | 'salt' | 'plain'
type Item = { a: string; b?: string; kind: Kind; f?: string; on?: boolean }
const CH = 7.8
const chipW = (it: Item) => Math.max(54, Math.max(it.a.length, it.b?.length ?? 0) * CH + 16)
const layout = (items: Item[], gap: number) => {
  const ws = items.map(chipW)
  let x = (540 - (ws.reduce((s, w) => s + w, 0) + gap * (items.length - 1))) / 2
  return ws.map(w => { const o = { x, w }; x += w + gap; return o })
}
function Chip({ it, x, y, w, h = 46 }: { it: Item; x: number; y: number; w: number; h?: number }) {
  const two = it.b !== undefined
  const topFill = it.kind === 'acid' ? acidFill : it.kind === 'plain' ? '#ffffff' : metalFill
  const bottomFill = it.kind === 'acid' ? acidFill : it.kind === 'base' ? baseFill : it.kind === 'salt' ? restFill : '#ffffff'
  const line = it.on ? hot : it.kind === 'acid' ? acidLine : it.kind === 'base' ? baseLine : it.kind === 'salt' ? saltLine : plainLine
  const r = 9, split = two && (it.kind === 'base' || it.kind === 'salt')
  const topText = it.kind === 'acid' ? acidInk : split ? metalInk : ink
  const bottomText = it.kind === 'acid' ? acidInk : it.kind === 'salt' ? restInk : ink
  return <g>
    <rect x={x} y={y} width={w} height={h} rx={r} fill={bottomFill} />
    {split && <path d={`M${x} ${y + h / 2}V${y + r}Q${x} ${y} ${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h / 2}Z`} fill={topFill} />}
    {!two && <rect x={x} y={y} width={w} height={h} rx={r} fill={topFill} />}
    {split && <path d={`M${x} ${y + h / 2}H${x + w}`} stroke={line} strokeWidth="1.2" />}
    <rect x={x} y={y} width={w} height={h} rx={r} fill="none" stroke={line} strokeWidth={it.on ? 3.2 : 1.8} />
    {two ? <g fontSize="14" fontWeight="700" textAnchor="middle"><text x={x + w / 2} y={y + 19} fill={topText}>{it.a}</text><text x={x + w / 2} y={y + 37} fill={bottomText}>{it.b}</text></g>
      : <text x={x + w / 2} y={y + 28} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{it.a}</text>}
  </g>
}
/** A row of chips joined by + and →, with the formulas centred under them when the items carry one. */
function EqRow({ items, y, arrowAfter, gap = 28, formulas = false }: { items: Item[]; y: number; arrowAfter: number; gap?: number; formulas?: boolean }) {
  const pos = layout(items, gap)
  return <g>
    {items.map((it, i) => <g key={i}>
      <Chip it={it} x={pos[i].x} y={y} w={pos[i].w} />
      {formulas && it.f && <text x={pos[i].x + pos[i].w / 2} y={y + 46 + 30} textAnchor="middle" fontSize="17" fontWeight="700" fill={ink}><Fm f={it.f} size={17} /></text>}
      {i < items.length - 1 && <text x={pos[i].x + pos[i].w + gap / 2} y={formulas ? y + 46 + 30 : y + 29} textAnchor="middle" fontSize="19" fontWeight="700" fill={muted}>{i + 1 === arrowAfter ? '→' : '+'}</text>}
    </g>)}
    {formulas && <g />}
  </g>
}
function Header({ y = 30, children }: { y?: number; children: ReactNode }) {
  return <text x={270} y={y} textAnchor="middle" fontSize="17" fontWeight="700" fill={ink}>{children}</text>
}

// ---------- Section 2: naming salts ----------
type NameStage = 'what' | 'acid' | 'metal' | 'join'
const NAME_TITLES: Record<NameStage, string> = {
  what: 'Hydrochloric acid, H then Cl, on the left with H in coral and Cl in blue. An arrow says replace H with Na. On the right is sodium chloride, Na then Cl. A salt is an acid whose hydrogen has been replaced by a metal.',
  acid: 'Three acids and the salts they make. Hydrochloric acid, HCl, makes chlorides, for example copper chloride. Sulfuric acid, H2SO4, makes sulfates, for example potassium sulfate. Nitric acid, HNO3, makes nitrates, for example sodium nitrate.',
  metal: 'Three bases and the first word of the salts they make. Sodium hydroxide, NaOH, gives sodium salts. Copper oxide, CuO, gives copper salts. Potassium hydroxide, KOH, gives potassium salts.',
  join: 'A word equation: sulfuric acid plus sodium hydroxide makes sodium sulfate plus water. A coral arrow shows the metal, sodium, coming from the base. A blue arrow shows the family, sulfate, coming from the acid.',
}
function MapRows({ rows, kind }: { rows: Array<[string, string, string, string]>; kind: 'acid' | 'base' }) {
  return <g>{rows.map(([name, formula, result, e], i) => {
    const y = 26 + i * 90
    const left = kind === 'acid' ? { fill: acidFill, line: acidLine, text: acidInk } : { fill: baseFill, line: baseLine, text: ink }
    const right = kind === 'acid' ? { fill: restFill, line: restLine, text: restInk } : { fill: metalFill, line: metalLine, text: metalInk }
    return <g key={name}>
      <rect x={28} y={y} width={210} height={64} rx="11" fill={left.fill} stroke={left.line} strokeWidth="1.8" />
      <text x={133} y={y + 27} textAnchor="middle" fontSize="17" fontWeight="700" fill={left.text}>{name}</text>
      <text x={133} y={y + 51} textAnchor="middle" fontSize="16" fill={ink}><Fm f={formula} size={16} /></text>
      <Arr x1={248} y1={y + 32} x2={298} y2={y + 32} />
      <rect x={308} y={y} width={204} height={64} rx="11" fill={right.fill} stroke={right.line} strokeWidth="1.8" />
      <text x={410} y={y + 28} textAnchor="middle" fontSize="19" fontWeight="700" fill={right.text}>{result}</text>
      <text x={410} y={y + 51} textAnchor="middle" fontSize="13" fill={ink}>{e}</text>
    </g>
  })}</g>
}
function Naming({ stage }: { stage: NameStage }) {
  const uid = useId().replace(/:/g, '')
  if (stage === 'what') return <Diagram title={NAME_TITLES.what} viewBox="0 0 540 290">
    <rect x={24} y={24} width={200} height={170} rx="14" fill={acidFill} stroke={acidLine} strokeWidth="2" />
    <text x={124} y={52} textAnchor="middle" fontSize="14" fill={acidInk} fontWeight="700">acid</text>
    <rect x={64} y={78} width={52} height={58} rx="8" fill={metalFill} stroke={metalLine} strokeWidth="2.2" /><text x={90} y={116} textAnchor="middle" fontSize="24" fontWeight="700" fill={metalInk}>H</text>
    <rect x={120} y={78} width={60} height={58} rx="8" fill={restFill} stroke={restLine} strokeWidth="2.2" /><text x={150} y={116} textAnchor="middle" fontSize="24" fontWeight="700" fill={restInk}>Cl</text>
    <text x={124} y={170} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>hydrochloric acid</text>
    <rect x={316} y={24} width={200} height={170} rx="14" fill={panelFill} stroke={panelLine} strokeWidth="2" />
    <text x={416} y={52} textAnchor="middle" fontSize="14" fill={muted} fontWeight="700">salt</text>
    <rect x={352} y={78} width={64} height={58} rx="8" fill={metalFill} stroke={hot} strokeWidth="3" /><text x={384} y={116} textAnchor="middle" fontSize="24" fontWeight="700" fill={metalInk}>Na</text>
    <rect x={420} y={78} width={60} height={58} rx="8" fill={restFill} stroke={restLine} strokeWidth="2.2" /><text x={450} y={116} textAnchor="middle" fontSize="24" fontWeight="700" fill={restInk}>Cl</text>
    <text x={416} y={170} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>sodium chloride</text>
    <text x={270} y={98} textAnchor="middle" fontSize="13" fontWeight="700" fill={hot}>replace H</text>
    <text x={270} y={114} textAnchor="middle" fontSize="13" fontWeight="700" fill={hot}>with Na</text>
    <Arr x1={236} y1={134} x2={304} y2={134} colour={hot} />
    <text x={270} y={240} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>A salt is an acid whose hydrogen</text>
    <text x={270} y={260} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>has been replaced by a metal.</text>
  </Diagram>
  if (stage === 'acid') return <Diagram title={NAME_TITLES.acid} viewBox="0 0 540 290">
    <MapRows kind="acid" rows={[['hydrochloric acid', 'HCl', 'chlorides', 'e.g. copper chloride'], ['sulfuric acid', 'H2SO4', 'sulfates', 'e.g. potassium sulfate'], ['nitric acid', 'HNO3', 'nitrates', 'e.g. sodium nitrate']]} />
  </Diagram>
  if (stage === 'metal') return <Diagram title={NAME_TITLES.metal} viewBox="0 0 540 290">
    <MapRows kind="base" rows={[['sodium hydroxide', 'NaOH', 'sodium …', 'e.g. sodium chloride'], ['copper oxide', 'CuO', 'copper …', 'e.g. copper sulfate'], ['potassium hydroxide', 'KOH', 'potassium …', 'e.g. potassium nitrate']]} />
  </Diagram>
  const items: Item[] = [{ a: 'sulfuric', b: 'acid', kind: 'acid' }, { a: 'sodium', b: 'hydroxide', kind: 'base' }, { a: 'sodium', b: 'sulfate', kind: 'salt', on: true }, { a: 'water', kind: 'plain' }]
  const pos = layout(items, 28), y = 96
  const mid = (i: number) => pos[i].x + pos[i].w / 2
  return <Diagram title={NAME_TITLES.join} viewBox="0 0 540 250">
    <defs>
      <marker id={`${uid}m`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill={metalLine} /></marker>
      <marker id={`${uid}r`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill={restLine} /></marker>
    </defs>
    <EqRow items={items} y={y} arrowAfter={3} />
    <path d={`M${mid(1)} ${y - 4}Q${(mid(1) + mid(2)) / 2} ${y - 46} ${mid(2) - 6} ${y - 6}`} fill="none" stroke={metalLine} strokeWidth="2.6" markerEnd={`url(#${uid}m)`} />
    <text x={(mid(1) + mid(2)) / 2} y={y - 54} textAnchor="middle" fontSize="14" fontWeight="700" fill={metalInk}>metal, from the base</text>
    <path d={`M${mid(0)} ${y + 50}Q${(mid(0) + mid(2)) / 2} ${y + 110} ${mid(2) - 4} ${y + 52}`} fill="none" stroke={restLine} strokeWidth="2.6" markerEnd={`url(#${uid}r)`} />
    <text x={(mid(0) + mid(2)) / 2} y={y + 124} textAnchor="middle" fontSize="14" fontWeight="700" fill={restInk}>family, from the acid</text>
  </Diagram>
}

// ---------- Section 3: metal oxides and hydroxides ----------
function BaseTypes() {
  const card = (x: number, title: string, rows: Array<[string, string]>) => <g>
    <rect x={x} y={20} width={236} height={164} rx="14" fill={baseFill} stroke={baseLine} strokeWidth="2" />
    <text x={x + 118} y={50} textAnchor="middle" fontSize="17" fontWeight="700" fill={ink}>{title}</text>
    {rows.map(([n, f], i) => <g key={n}><rect x={x + 16} y={70 + i * 56} width={204} height={46} rx="9" fill="white" stroke={panelLine} strokeWidth="1.5" />
      <text x={x + 118} y={90 + i * 56} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{n}</text>
      <text x={x + 118} y={108 + i * 56} textAnchor="middle" fontSize="14" fill={muted}><Fm f={f} size={14} /></text></g>)}
  </g>
  return <Diagram title="Two cards. Metal oxides, for example copper oxide, CuO, and magnesium oxide, MgO. Metal hydroxides, for example sodium hydroxide, NaOH, and calcium hydroxide, Ca(OH)2. Under them: both are bases, and acid plus base makes salt plus water." viewBox="0 0 540 290">
    {card(20, 'metal oxides', [['copper oxide', 'CuO'], ['magnesium oxide', 'MgO']])}
    {card(284, 'metal hydroxides', [['sodium hydroxide', 'NaOH'], ['calcium hydroxide', 'Ca(OH)2']])}
    <rect x={20} y={204} width={500} height={70} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.8" />
    <text x={270} y={232} textAnchor="middle" fontSize="19" fontWeight="700" fill={ink}>acid + base → salt + water</text>
    <text x={270} y={256} textAnchor="middle" fontSize="14" fill={muted}>Both kinds of metal compound are bases.</text>
  </Diagram>
}
type EqStage = 'oxide' | 'hydroxide' | 'count'
function Equation({ stage }: { stage: EqStage }) {
  if (stage === 'oxide') return <Diagram title="Word equation: hydrochloric acid plus copper oxide makes copper chloride plus water. Copper is in the coral half of the oxide and the salt; chloride comes from the acid." viewBox="0 0 540 200">
    <Header>acid + metal oxide → salt + water</Header>
    <EqRow arrowAfter={2} y={54} items={[{ a: 'hydrochloric', b: 'acid', kind: 'acid' }, { a: 'copper', b: 'oxide', kind: 'base' }, { a: 'copper', b: 'chloride', kind: 'salt' }, { a: 'water', kind: 'plain' }]} />
    <Legend y={160} items={[[acidFill, acidLine, 'acid'], [baseFill, baseLine, 'base'], KEY_METAL, KEY_REST]} />
  </Diagram>
  if (stage === 'hydroxide') return <Diagram title="Word equation with formulas: sulfuric acid, H2SO4, plus potassium hydroxide, 2KOH, makes potassium sulfate, K2SO4, plus water, 2H2O." viewBox="0 0 540 210">
    <Header>acid + metal hydroxide → salt + water</Header>
    <EqRow arrowAfter={2} y={50} formulas items={[{ a: 'sulfuric', b: 'acid', kind: 'acid', f: 'H2SO4' }, { a: 'potassium', b: 'hydroxide', kind: 'base', f: '2KOH' }, { a: 'potassium', b: 'sulfate', kind: 'salt', f: 'K2SO4' }, { a: 'water', kind: 'plain', f: '2H2O' }]} />
    <Legend y={172} items={[[acidFill, acidLine, 'acid'], [baseFill, baseLine, 'base'], KEY_METAL, KEY_REST]} />
  </Diagram>
  const cols: Array<[string, number, number]> = [['Cu', 1, 1], ['O', 1, 1], ['H', 2, 2], ['Cl', 2, 2]]
  return <Diagram title="The balanced symbol equation CuO(s) + 2HCl(aq) → CuCl2(aq) + H2O(l). A table counts each atom: copper 1 and 1, oxygen 1 and 1, hydrogen 2 and 2, chlorine 2 and 2, so both sides match. Key: s solid, aq dissolved in water, l liquid." viewBox="0 0 540 300">
    <text x={270} y={46} textAnchor="middle" fontSize="22" fontWeight="700" fill={ink}>
      <Fm f="CuO" size={22} /><tspan fontSize="13" fill={muted}>(s)</tspan><tspan>{' + '}</tspan><Fm f="2HCl" size={22} /><tspan fontSize="13" fill={muted}>(aq)</tspan><tspan>{' → '}</tspan><Fm f="CuCl2" size={22} /><tspan fontSize="13" fill={muted}>(aq)</tspan><tspan>{' + '}</tspan><Fm f="H2O" size={22} /><tspan fontSize="13" fill={muted}>(l)</tspan>
    </text>
    <rect x={40} y={76} width={460} height={130} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.8" />
    <text x={58} y={100} fontSize="13" fill={muted} fontWeight="700">atoms counted</text>
    {cols.map(([el, l, r], i) => {
      const x = 200 + i * 74
      return <g key={el} textAnchor="middle"><text x={x} y={100} fontSize="16" fontWeight="700" fill={ink}>{el}</text>
        <text x={x} y={140} fontSize="18" fontWeight="700" fill={ink}>{l}</text><text x={x} y={178} fontSize="18" fontWeight="700" fill={ink}>{r}</text>
        <text x={x + 26} y={178} fontSize="17" fontWeight="700" fill="#3f8a5f">✓</text></g>
    })}
    <path d="M52 112H488" stroke={panelLine} strokeWidth="1.5" /><path d="M52 152H488" stroke={panelLine} strokeWidth="1.5" />
    <text x={58} y={140} fontSize="14" fill={ink}>left side</text><text x={58} y={178} fontSize="14" fill={ink}>right side</text>
    <text x={270} y={248} textAnchor="middle" fontSize="14" fill={ink}>(s) solid · (aq) dissolved in water · (l) liquid</text>
  </Diagram>
}

// ---------- Section 4: carbonates ----------
function Beaker({ cx, top, w, h, level, fill, children }: { cx: number; top: number; w: number; h: number; level: number; fill: string; children?: ReactNode }) {
  const l = cx - w / 2, r = cx + w / 2, b = top + h, liq = b - level * h
  return <g>
    <path d={`M${l} ${top}V${b - 10}Q${l} ${b} ${l + 10} ${b}H${r - 10}Q${r} ${b} ${r} ${b - 10}V${top}`} fill="white" fillOpacity=".5" stroke={glass} strokeWidth="2.6" />
    {level > 0 && <path d={`M${l + 1.3} ${liq}H${r - 1.3}V${b - 10}Q${r - 1.3} ${b - 1.3} ${r - 11} ${b - 1.3}H${l + 11}Q${l + 1.3} ${b - 1.3} ${l + 1.3} ${b - 10}Z`} fill={fill} />}
    <path d={`M${l - 5} ${top}H${l + 5}M${r - 5} ${top}H${r + 5}`} stroke={glass} strokeWidth="2.6" />
    {children}
  </g>
}
function CarbWord() {
  return <Diagram title="Word equation: hydrochloric acid plus sodium carbonate makes sodium chloride plus water plus carbon dioxide. Carbon dioxide, the gas, is highlighted as the third product." viewBox="0 0 540 210">
    <Header>acid + metal carbonate → salt + water + carbon dioxide</Header>
    <EqRow arrowAfter={2} gap={24} y={70} items={[{ a: 'hydrochloric', b: 'acid', kind: 'acid' }, { a: 'sodium', b: 'carbonate', kind: 'base' }, { a: 'sodium', b: 'chloride', kind: 'salt' }, { a: 'water', kind: 'plain' }, { a: 'carbon', b: 'dioxide', kind: 'plain', on: true }]} />
    <g fill="white" stroke={plainLine} strokeWidth="1.6"><circle cx={452} cy={56} r="4" /><circle cx={464} cy={46} r="3" /><circle cx={444} cy={44} r="2.6" /></g>
    <text x={270} y={150} textAnchor="middle" fontSize="14" fill={ink}>Three products: a salt, water and a gas.</text>
    <Legend y={184} items={[[acidFill, acidLine, 'acid'], [baseFill, baseLine, 'carbonate'], KEY_METAL, KEY_REST]} />
  </Diagram>
}
function CarbFizz() {
  const bubbles: Array<[number, number, number]> = [[252, 126, 4], [270, 112, 5], [292, 128, 3.5], [262, 96, 4.5], [286, 90, 3.5], [274, 72, 5], [256, 60, 4], [292, 56, 3.5]]
  return <Diagram title="A beaker with acid and a white metal carbonate powder at the bottom. Bubbles of carbon dioxide gas rise through the liquid and escape from the top. Labels: acid, metal carbonate powder, fizzing bubbles of carbon dioxide." viewBox="0 0 540 290">
    <Beaker cx={270} top={70} w={150} h={150} level={.72} fill={acidLiquid}>
      <path d="M212 219C224 204 246 196 270 196C296 196 318 204 328 219Z" fill="#f7f7f2" stroke="#9aa5ad" strokeWidth="2" />
      <g fill="white" stroke={glass} strokeWidth="1.6">{bubbles.map(([x, y, r], i) => <circle key={i} cx={x} cy={y + 30} r={r} />)}</g>
    </Beaker>
    <Arr x1={270} y1={62} x2={270} y2={26} colour={hot} />
    <text x={292} y={38} fontSize="14" fontWeight="700" fill={acidInk}>carbon dioxide</text>
    <text x={292} y={54} fontSize="14" fontWeight="700" fill={acidInk}>gas escapes</text>
    <path d="M210 160H150" stroke={muted} strokeWidth="1.6" /><text x={144} y={158} textAnchor="end" fontSize="14" fontWeight="700" fill={ink}>acid</text><text x={144} y={175} textAnchor="end" fontSize="13" fill={muted}>(liquid)</text>
    <path d="M250 208L174 246" stroke={muted} strokeWidth="1.6" /><text x={168} y={244} textAnchor="end" fontSize="14" fontWeight="700" fill={ink}>metal carbonate</text><text x={168} y={261} textAnchor="end" fontSize="13" fill={muted}>(solid powder)</text>
    <path d="M300 150L376 150" stroke={muted} strokeWidth="1.6" /><text x={384} y={148} fontSize="14" fontWeight="700" fill={ink}>fizzing</text><text x={384} y={165} fontSize="13" fill={muted}>bubbles of gas</text>
  </Diagram>
}
function CarbSymbols() {
  return <Diagram title="Word equation with formulas: sulfuric acid, H2SO4, plus calcium carbonate, CaCO3, makes calcium sulfate, CaSO4, plus water, H2O, plus carbon dioxide, CO2." viewBox="0 0 540 220">
    <Header>acid + metal carbonate → salt + water + carbon dioxide</Header>
    <EqRow arrowAfter={2} gap={24} y={52} formulas items={[{ a: 'sulfuric', b: 'acid', kind: 'acid', f: 'H2SO4' }, { a: 'calcium', b: 'carbonate', kind: 'base', f: 'CaCO3' }, { a: 'calcium', b: 'sulfate', kind: 'salt', f: 'CaSO4' }, { a: 'water', kind: 'plain', f: 'H2O' }, { a: 'carbon', b: 'dioxide', kind: 'plain', f: 'CO2' }]} />
    <Legend y={176} items={[[acidFill, acidLine, 'acid'], [baseFill, baseLine, 'carbonate'], KEY_METAL, KEY_REST]} />
  </Diagram>
}

// ---------- Section 5: making a pure, dry sample of a soluble salt ----------
function Solubility() {
  return <Diagram title="Two beakers. Left: copper sulfate in water is a soluble salt; it dissolves and makes a clear blue solution. Right: copper oxide in water is an insoluble base; the black powder sinks and stays as a solid." viewBox="0 0 540 290">
    <text x={140} y={34} textAnchor="middle" fontSize="17" fontWeight="700" fill={restInk}>soluble salt</text>
    <text x={400} y={34} textAnchor="middle" fontSize="17" fontWeight="700" fill={ink}>insoluble base</text>
    <Beaker cx={140} top={56} w={140} h={130} level={.8} fill={solutionFill} />
    <Beaker cx={400} top={56} w={140} h={130} level={.8} fill="#eef4f8">
      <path d="M338 184C352 170 372 164 400 164C428 164 448 170 462 184Z" fill={solidFill} stroke="#2f3941" strokeWidth="1.6" />
      <g fill={solidFill}><circle cx={384} cy={120} r="2.6" /><circle cx={420} cy={138} r="2.6" /><circle cx={402} cy={152} r="2.6" /></g>
    </Beaker>
    <text x={140} y={216} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>copper sulfate in water</text>
    <text x={140} y={236} textAnchor="middle" fontSize="14" fill={ink}>dissolves: a clear blue solution</text>
    <text x={400} y={216} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>copper oxide in water</text>
    <text x={400} y={236} textAnchor="middle" fontSize="14" fill={ink}>does not dissolve: sinks as a solid</text>
  </Diagram>
}
function Plan() {
  const bases = ['copper oxide', 'copper hydroxide', 'copper carbonate']
  return <Diagram title="To make copper sulfate: pick sulfuric acid, which has the same negative ion, sulfate; and pick an insoluble base with the same metal, copper: copper oxide, copper hydroxide or copper carbonate." viewBox="0 0 540 332">
    <Chip it={{ a: 'copper', b: 'sulfate', kind: 'salt', on: true }} x={205} y={16} w={130} />
    <text x={270} y={86} textAnchor="middle" fontSize="13" fill={muted}>the salt you want</text>
    <Arr x1={230} y1={94} x2={140} y2={196} colour={restLine} />
    <text x={182} y={132} textAnchor="end" fontSize="14" fontWeight="700" fill={restInk}>same negative ion:</text>
    <text x={170} y={150} textAnchor="end" fontSize="14" fontWeight="700" fill={restInk}>sulfate</text>
    <Chip it={{ a: 'sulfuric', b: 'acid', kind: 'acid' }} x={72} y={206} w={110} />
    <Arr x1={310} y1={94} x2={370} y2={186} colour={metalLine} />
    <text x={358} y={128} fontSize="14" fontWeight="700" fill={metalInk}>same metal:</text>
    <text x={368} y={146} fontSize="14" fontWeight="700" fill={metalInk}>copper</text>
    {bases.map((b, i) => <g key={b}><rect x={300} y={194 + i * 36} width={200} height={30} rx="8" fill={baseFill} stroke={baseLine} strokeWidth="1.8" /><text x={400} y={214 + i * 36} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{b}</text></g>)}
    <text x={127} y={278} textAnchor="middle" fontSize="13" fill={muted}>the acid</text>
    <text x={400} y={324} textAnchor="middle" fontSize="13" fill={muted}>any one insoluble base</text>
  </Diagram>
}

const STEP_TEXT = ['Warm the dilute acid, then turn the burner off', 'Add the insoluble base until some is left at the bottom', 'Filter out the excess solid', 'Heat the solution gently to evaporate some water', 'Stop heating and leave to cool: crystals form', 'Filter off the crystals and dry them']
const METHOD_TITLE = 'A required-practical method drawn as four panels of apparatus. Panel with steps 1: a flask of dilute acid warmed on a tripod with a Bunsen burner. Panel with step 2: a spatula adding insoluble base to the flask; excess solid stays at the bottom. Panel with step 3: a filter funnel with filter paper over a flask, holding back the excess solid so the salt solution runs through. Panel with steps 4 to 6: an evaporating basin over hot water, then crystals, then dry crystals on filter paper.'
function flaskGeo(cx: number, top: number, h: number, w: number) {
  const nb = top + 30, base = nb + h
  return { nb, base, half: (y: number) => 14 + (w / 2 - 14) * ((y - nb) / h), w, cx, top }
}
function Flask({ cx, top, h, w, level, fill, children }: { cx: number; top: number; h: number; w: number; level: number; fill: string; children?: ReactNode }) {
  const g = flaskGeo(cx, top, h, w), ly = g.base - level * h, hw = g.half(ly)
  return <g>
    <path d={`M${cx - 14} ${top}V${g.nb}L${cx - w / 2} ${g.base}H${cx + w / 2}L${cx + 14} ${g.nb}V${top}`} fill="white" fillOpacity=".55" stroke={glass} strokeWidth="2.6" />
    {level > 0 && <path d={`M${cx - hw + 1} ${ly}H${cx + hw - 1}L${cx + w / 2 - 1.4} ${g.base - 1.4}H${cx - w / 2 + 1.4}Z`} fill={fill} />}
    <path d={`M${cx - 19} ${top}H${cx + 19}`} stroke={glass} strokeWidth="3" />
    {children}
  </g>
}
function Flame({ cx, y }: { cx: number; y: number }) {
  return <g><path d={`M${cx} ${y}C${cx + 9} ${y + 10} ${cx + 8} ${y + 22} ${cx} ${y + 24}C${cx - 8} ${y + 22} ${cx - 9} ${y + 10} ${cx} ${y}Z`} fill={flameOuter} /><path d={`M${cx} ${y + 9}C${cx + 4} ${y + 14} ${cx + 4} ${y + 20} ${cx} ${y + 22}C${cx - 4} ${y + 20} ${cx - 4} ${y + 14} ${cx} ${y + 9}Z`} fill={flameInner} /></g>
}
function Label({ x, y, lines, anchor = 'start', show = true }: { x: number; y: number; lines: string[]; anchor?: 'start' | 'end'; show?: boolean }) {
  if (!show) return null
  return <text x={x} y={y} textAnchor={anchor} fontSize="12.5" fontWeight="700" fill={ink}>{lines.map((l, i) => <tspan key={i} x={x} dy={i ? 15 : 0}>{l}</tspan>)}</text>
}
function Crystal({ x, y, s = 7, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return <rect x={x - s / 2} y={y - s / 2} width={s} height={s} rx="1.5" fill="#f4f9fd" stroke="#6f9ec0" strokeWidth="1.4" transform={`rotate(${rot} ${x} ${y})`} />
}

function Method({ on, assessment = false }: { on: number[]; assessment?: boolean }) {
  const o = (...steps: number[]) => (assessment || steps.some(s => on.includes(s)) ? 1 : faded)
  const words = !assessment
  const W = 258, H = 170
  const ax = 8, ay = 8, bx = 274, by = 8, cx0 = 8, cy0 = 186, dx = 274, dy = 186
  const panel = (x: number, y: number, op: number) => <rect x={x} y={y} width={W} height={H} rx="14" fill={panelFill} stroke={panelLine} strokeWidth="1.8" opacity={op} />
  const badge = (n: number, x: number, y: number, id: number) => <Num n={n} x={x} y={y} on={assessment || on.includes(n)} plain={assessment} />
  // Panel A
  const fa = { cx: ax + 108, top: ay + 26 }
  // Panel B
  const fb = { cx: bx + 96, top: by + 40 }
  const gb = flaskGeo(fb.cx, fb.top, 54, 88)
  // Panel C
  const fcx = cx0 + 100
  // Panel D
  const dcx = dx + 84
  return <Diagram title={METHOD_TITLE} schematic viewBox={`0 0 540 ${assessment ? 366 : 544}`}>
    {/* A: warm the acid */}
    {panel(ax, ay, o(1))}
    <g opacity={o(1)}>
      <Flask cx={fa.cx} top={fa.top} h={54} w={88} level={.6} fill={acidLiquid} />
      <path d={`M${fa.cx - 60} ${ay + 114}H${fa.cx + 60}`} stroke="#7d8a94" strokeWidth="3.5" />
      <path d={`M${fa.cx - 52} ${ay + 114}L${fa.cx - 64} ${ay + 162}M${fa.cx + 52} ${ay + 114}L${fa.cx + 64} ${ay + 162}`} stroke="#7d8a94" strokeWidth="3" />
      <Flame cx={fa.cx} y={ay + 126} />
      <rect x={fa.cx - 5} y={ay + 150} width={10} height={14} fill="#9aa5ad" />
      <rect x={fa.cx - 18} y={ay + 163} width={36} height={5} rx="2" fill="#7d8a94" />
      <Label x={ax + 176} y={ay + 96} lines={['dilute acid']} show={words} />
      <path d={`M${fa.cx + 28} ${ay + 92}H${ax + 172}`} stroke={muted} strokeWidth="1.4" opacity={words ? 1 : 0} />
      <Label x={fa.cx + 74} y={ay + 152} lines={['Bunsen', 'burner']} show={words} /><path d={`M${fa.cx + 8} ${ay + 157}H${fa.cx + 70}`} stroke={muted} strokeWidth="1.4" opacity={words ? 1 : 0} />
    </g>
    {badge(1, ax + 20, ay + 20, 1)}
    {/* B: add the base */}
    {panel(bx, by, o(2))}
    <g opacity={o(2)}>
      <Flask cx={fb.cx} top={fb.top} h={54} w={88} level={.62} fill={acidLiquid}>
        <path d={`M${fb.cx - 32} ${gb.base - 1.5}L${fb.cx - 16} ${gb.base - 9}L${fb.cx + 4} ${gb.base - 13}L${fb.cx + 22} ${gb.base - 8}L${fb.cx + 32} ${gb.base - 1.5}Z`} fill={solidFill} />
      </Flask>
      <path d={`M${fb.cx + 74} ${by + 12}L${fb.cx + 8} ${by + 36}`} stroke="#7d8a94" strokeWidth="4" />
      <path d={`M${fb.cx + 74} ${by + 12}L${fb.cx + 88} ${by + 8}`} stroke="#9aa5ad" strokeWidth="6" />
      <g fill={solidFill}><circle cx={fb.cx + 3} cy={by + 48} r="2.6" /><circle cx={fb.cx - 3} cy={by + 62} r="2.6" /><circle cx={fb.cx + 4} cy={by + 74} r="2.6" /></g>
      <Label x={bx + 144} y={by + 88} lines={['insoluble base', 'being added']} show={words} />
      <Label x={bx + 152} y={by + 150} lines={['excess solid']} show={words} />
      <path d={`M${fb.cx + 30} ${gb.base - 6}L${bx + 148} ${by + 146}`} stroke={muted} strokeWidth="1.4" opacity={words ? 1 : 0} />
    </g>
    {badge(2, bx + 20, by + 20, 2)}
    {/* C: filter */}
    {panel(cx0, cy0, o(3))}
    <g opacity={o(3)}>
      <path d={`M${fcx - 48} ${cy0 + 24}L${fcx - 5} ${cy0 + 72}V${cy0 + 108}H${fcx + 5}V${cy0 + 72}L${fcx + 48} ${cy0 + 24}`} fill="#f3f6f8" stroke={glass} strokeWidth="2.6" />
      <path d={`M${fcx - 40} ${cy0 + 28}L${fcx - 3} ${cy0 + 70}H${fcx + 3}L${fcx + 40} ${cy0 + 28}Z`} fill="white" stroke="#b9c6ce" strokeWidth="1.6" />
      <g fill={solidFill}><circle cx={fcx - 9} cy={cy0 + 62} r="3" /><circle cx={fcx + 2} cy={cy0 + 66} r="3" /><circle cx={fcx + 11} cy={cy0 + 59} r="3" /><circle cx={fcx - 1} cy={cy0 + 56} r="2.6" /></g>
      <Flask cx={fcx} top={cy0 + 100} h={36} w={76} level={.4} fill={solutionFill} />
      <Arr x1={fcx} y1={cy0 + 3} x2={fcx} y2={cy0 + 22} colour={muted} width={2} />
      <Label x={fcx + 10} y={cy0 + 14} lines={['reaction mixture']} show={words} />
      <Label x={cx0 + 154} y={cy0 + 62} lines={['filter paper', 'holds back', 'the solid']} show={words} />
      <path d={`M${fcx + 32} ${cy0 + 44}L${cx0 + 150} ${cy0 + 60}`} stroke={muted} strokeWidth="1.4" opacity={words ? 1 : 0} />
      <Label x={cx0 + 150} y={cy0 + 146} lines={['salt solution']} show={words} />
      <path d={`M${fcx + 28} ${cy0 + 148}L${cx0 + 146} ${cy0 + 142}`} stroke={muted} strokeWidth="1.4" opacity={words ? 1 : 0} />
    </g>
    {badge(3, cx0 + 20, cy0 + 20, 3)}
    {/* D: crystallise */}
    {panel(dx, dy, o(4, 5, 6))}
    {assessment ? badge(4, dx + 20, dy + 20, 4) : <>{badge(4, dx + 20, dy + 20, 4)}{badge(5, dx + 48, dy + 20, 5)}{badge(6, dx + 76, dy + 20, 6)}</>}
    <g opacity={assessment ? 1 : on.some(s => s >= 4) ? 1 : faded}>
      <g opacity={o(4)} fill="none" stroke="#b9c6ce" strokeWidth="2.4"><path d={`M${dcx - 16} ${dy + 74}q-6 -8 0 -16t0 -16`} /><path d={`M${dcx} ${dy + 74}q-6 -8 0 -16t0 -16`} /><path d={`M${dcx + 16} ${dy + 74}q-6 -8 0 -16t0 -16`} /></g>
      <path d={`M${dcx - 52} ${dy + 86}H${dcx + 52}Q${dcx + 48} ${dy + 122} ${dcx} ${dy + 122}Q${dcx - 48} ${dy + 122} ${dcx - 52} ${dy + 86}Z`} fill="white" fillOpacity=".7" stroke={glass} strokeWidth="2.6" />
      <path d={`M${dcx - 47} ${dy + 92}H${dcx + 47}Q${dcx + 44} ${dy + 116} ${dcx} ${dy + 116}Q${dcx - 44} ${dy + 116} ${dcx - 47} ${dy + 92}Z`} fill={solutionFill} />
      <g opacity={o(5, 6)}><Crystal x={dcx - 22} y={dy + 106} rot={12} /><Crystal x={dcx - 6} y={dy + 111} s={8} rot={-10} /><Crystal x={dcx + 12} y={dy + 108} rot={20} /><Crystal x={dcx + 26} y={dy + 102} s={6} rot={-6} /><Crystal x={dcx - 1} y={dy + 100} s={6} rot={30} /></g>
      <path d={`M${dcx - 44} ${dy + 124}V${dy + 154}Q${dcx - 44} ${dy + 158} ${dcx - 40} ${dy + 158}H${dcx + 40}Q${dcx + 44} ${dy + 158} ${dcx + 44} ${dy + 154}V${dy + 124}`} fill="none" stroke={glass} strokeWidth="2.4" />
      <path d={`M${dcx - 42} ${dy + 132}H${dcx + 42}V${dy + 154}Q${dcx + 42} ${dy + 156} ${dcx + 40} ${dy + 156}H${dcx - 40}Q${dcx - 42} ${dy + 156} ${dcx - 42} ${dy + 154}Z`} fill="#cfe0ec" />
      <g opacity={o(4)} stroke={hot} strokeWidth="2.6" fill="none"><path d={`M${dcx - 20} ${dy + 166}V${dy + 161}M${dcx} ${dy + 166}V${dy + 161}M${dcx + 20} ${dy + 166}V${dy + 161}`} /></g>
      <g opacity={o(6)}>
        <path d={`M${dx + 172} ${dy + 138}L${dx + 236} ${dy + 132}L${dx + 240} ${dy + 158}L${dx + 176} ${dy + 164}Z`} fill="white" stroke="#b9c6ce" strokeWidth="1.8" />
        <Crystal x={dx + 192} y={dy + 148} rot={10} /><Crystal x={dx + 206} y={dy + 145} s={8} rot={-8} /><Crystal x={dx + 220} y={dy + 148} rot={25} /><Crystal x={dx + 202} y={dy + 156} s={6} rot={5} />
      </g>
      <Label x={dx + 150} y={dy + 62} lines={['evaporating', 'basin']} show={words} />
      <path d={`M${dcx + 52} ${dy + 88}L${dx + 146} ${dy + 66}`} stroke={muted} strokeWidth="1.4" opacity={words ? 1 : 0} />
      <Label x={dx + 168} y={dy + 126} lines={['dry crystals']} show={words && on.some(s => s === 6 || on.length === 6)} />
    </g>
    {words && <g>{STEP_TEXT.map((t, i) => <g key={t} opacity={on.includes(i + 1) ? 1 : faded}>
      <Num n={i + 1} x={34} y={386 + i * 26} on={on.includes(i + 1)} />
      <text x={56} y={391 + i * 26} fontSize="14" fontWeight={on.includes(i + 1) ? 700 : 500} fill={ink}>{t}</text></g>)}</g>}
  </Diagram>
}

// ---------- On your own: data table ----------
function PortionData() {
  const rows: Array<[string, string]> = [['1', 'none'], ['2', 'none'], ['3', 'none'], ['4', 'some'], ['5', 'more']]
  return <Diagram schematic={false} viewBox="0 0 540 290" title="A data table. Copper oxide was added to warm dilute sulfuric acid in 1 gram portions, stirring each time. Solid left at the bottom after stirring: portion 1 none, portion 2 none, portion 3 none, portion 4 some, portion 5 more.">
    <text x={24} y={28} fontSize="15" fontWeight="700" fill={ink}>Copper oxide added to warm sulfuric acid</text>
    <text x={24} y={47} fontSize="13" fill={muted}>1 g portions, stirred after each one</text>
    <rect x={20} y={60} width={500} height={216} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="14" fontWeight="700" fill={ink}><text x={40} y={90}>portion added</text><text x={296} y={82}>solid left at the bottom</text><text x={296} y={98}>after stirring</text></g>
    <path d="M32 108H508" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([n, s], i) => <g key={n} fontSize="15" fill={ink}><text x={40} y={136 + i * 30}>portion {n}</text><text x={296} y={136 + i * 30} fontWeight="700">{s}</text></g>)}
  </Diagram>
}

export function SaltVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'salt-name-what': return <Naming stage="what" />
    case 'salt-name-acid': return <Naming stage="acid" />
    case 'salt-name-metal': return <Naming stage="metal" />
    case 'salt-name-join': return <Naming stage="join" />
    case 'salt-base-types': return <BaseTypes />
    case 'salt-eq-oxide': return <Equation stage="oxide" />
    case 'salt-eq-hydroxide': return <Equation stage="hydroxide" />
    case 'salt-eq-count': return <Equation stage="count" />
    case 'salt-carb-word': return <CarbWord />
    case 'salt-carb-fizz': return <CarbFizz />
    case 'salt-carb-symbols': return <CarbSymbols />
    case 'salt-solubility': return <Solubility />
    case 'salt-plan': return <Plan />
    case 'salt-m-react': return <Method on={[1, 2]} />
    case 'salt-m-filter': return <Method on={[3]} />
    case 'salt-m-crystal': return <Method on={[4, 5, 6]} />
    case 'salt-m-all': return <Method on={[1, 2, 3, 4, 5, 6]} />
    case 'salt-question-method': return <Method on={[1, 2, 3, 4, 5, 6]} assessment />
    case 'salt-question-data': return <PortionData />
    default: return <Method on={[1, 2, 3, 4, 5, 6]} assessment={assessment} />
  }
}
