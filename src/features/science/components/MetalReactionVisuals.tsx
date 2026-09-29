import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C4 (Chemistry Lesson 25): reactions of metals. Original, code-native schematics; not to scale.
 * Focus ids start with 'mrx-'.
 *
 * Colour code (Chemistry convention from AtomVisuals, as in the salts lesson): metals and hydrogen are the coral tint
 * (positive), the acid family in a salt is the electron-blue tint, acids sit on pale amber, hydroxides on pale grey, and
 * water and hydrogen gas are plain white chips. Amber outlines mark what a frame is about. Test tubes show bubbles of
 * hydrogen (more bubbles = faster reaction). In assessment view the descriptive words go; only the tubes, letters and
 * the numbers in the data stay.
 */
const { ink, muted, protonLine, electronLine, panelFill, panelLine } = atomPalette
const metalFill = '#fbe1de', metalLine = protonLine, metalInk = '#8a332c'
const restFill = '#dcecf8', restLine = electronLine, restInk = '#1d5787'
const acidFill = '#fff4e6', acidLine = '#d9a55b', acidInk = '#8a5a14'
const baseFill = '#eef1f3', baseLine = '#7f8c97'
const plainLine = '#9fb1bd'
const hot = '#d98a1c'
const glass = '#6f8798', liquid = '#eef4f8', copperCol = '#c9793a', copperFill = '#e8b48a'
const faded = 0.3

function Diagram({ title, children, viewBox = '0 0 540 270', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
/** Formula with real subscripts; a leading number is a coefficient and stays full size. */
function Fm({ f, size = 17 }: { f: string; size?: number }) {
  const out: ReactNode[] = []
  let prev = ''
  ;[...f].forEach((ch, i) => {
    if (/\d/.test(ch) && /[A-Za-z)]/.test(prev)) out.push(<tspan key={i} fontSize={Math.max(12, Math.round(size * .72))} dy={size * .28}>{ch}</tspan>, <tspan key={`${i}r`} dy={-size * .28}>{'​'}</tspan>)
    else out.push(<tspan key={i}>{ch}</tspan>)
    prev = ch
  })
  return <>{out}</>
}
function Arr({ x1, y1, x2, y2, colour = ink, width = 2.5 }: { x1: number; y1: number; x2: number; y2: number; colour?: string; width?: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 10
  const p = (t: number) => `${(x2 - h * Math.cos(a + t)).toFixed(1)} ${(y2 - h * Math.sin(a + t)).toFixed(1)}`
  return <g><path d={`M${x1} ${y1}L${(x2 - 6 * Math.cos(a)).toFixed(1)} ${(y2 - 6 * Math.sin(a)).toFixed(1)}`} stroke={colour} strokeWidth={width} fill="none" /><path d={`M${x2} ${y2}L${p(.45)}L${p(-.45)}Z`} fill={colour} stroke={colour} strokeWidth="1" /></g>
}
const Head = ({ children, y = 30 }: { children: ReactNode; y?: number }) => <text x={270} y={y} textAnchor="middle" fontSize="17" fontWeight="700" fill={ink}>{children}</text>
const Note = ({ children, y }: { children: ReactNode; y: number }) => <text x={270} y={y} textAnchor="middle" fontSize="14" fill={muted}>{children}</text>

// ---------- Chips and equation rows ----------
type Kind = 'acid' | 'metal' | 'salt' | 'plain' | 'hydroxide' | 'none'
type Item = { a: string; b?: string; kind: Kind; f?: string; on?: boolean; split?: [string, string] }
const CH = 8.7
const chipW = (it: Item) => Math.max(58, Math.max(it.a.length, it.b?.length ?? 0) * CH + 18)
const fills: Record<Kind, [string, string, string]> = { acid: [acidFill, acidLine, acidInk], metal: [metalFill, metalLine, metalInk], salt: [restFill, restLine, restInk], plain: ['#ffffff', plainLine, ink], hydroxide: [baseFill, baseLine, ink], none: ['#ffffff', plainLine, muted] }
function Chip({ it, x, y, w, h = 46 }: { it: Item; x: number; y: number; w: number; h?: number }) {
  const [fill, line, text] = fills[it.kind]
  const stroke = it.on ? hot : line
  return <g>
    {it.split ? <g>
      <path d={`M${x} ${y + h / 2}V${y + 9}Q${x} ${y} ${x + 9} ${y}H${x + w - 9}Q${x + w} ${y} ${x + w} ${y + 9}V${y + h / 2}Z`} fill={metalFill} />
      <path d={`M${x} ${y + h / 2}V${y + h - 9}Q${x} ${y + h} ${x + 9} ${y + h}H${x + w - 9}Q${x + w} ${y + h} ${x + w} ${y + h - 9}V${y + h / 2}Z`} fill={restFill} />
      <path d={`M${x} ${y + h / 2}H${x + w}`} stroke={stroke} strokeWidth="1.2" />
      <g fontSize="14" fontWeight="700" textAnchor="middle"><text x={x + w / 2} y={y + 19} fill={metalInk}>{it.split[0]}</text><text x={x + w / 2} y={y + 37} fill={restInk}>{it.split[1]}</text></g>
    </g> : <g>
      <rect x={x} y={y} width={w} height={h} rx="9" fill={fill} />
      {it.b !== undefined
        ? <g fontSize="14" fontWeight="700" textAnchor="middle" fill={text}><text x={x + w / 2} y={y + 19}>{it.a}</text><text x={x + w / 2} y={y + 37}>{it.b}</text></g>
        : <text x={x + w / 2} y={y + 28} textAnchor="middle" fontSize="14" fontWeight="700" fill={text}>{it.a}</text>}
    </g>}
    <rect x={x} y={y} width={w} height={h} rx="9" fill="none" stroke={stroke} strokeWidth={it.on ? 3.2 : 1.8} strokeDasharray={it.kind === 'none' ? '5 4' : undefined} />
  </g>
}
function EqRow({ items, y, arrowAfter, gap = 26, formulas = false, big = false }: { items: Item[]; y: number; arrowAfter: number; gap?: number; formulas?: boolean; big?: boolean }) {
  const ws = items.map(chipW)
  let x = (540 - (ws.reduce((s, w) => s + w, 0) + gap * (items.length - 1))) / 2
  const pos = ws.map(w => { const o = { x, w }; x += w + gap; return o })
  const fs = big ? 15 : 17
  return <g>{items.map((it, i) => <g key={i}>
    <Chip it={it} x={pos[i].x} y={y} w={pos[i].w} />
    {formulas && it.f && <text x={pos[i].x + pos[i].w / 2} y={y + 76} textAnchor="middle" fontSize={fs} fontWeight="700" fill={ink}><Fm f={it.f} size={fs} /></text>}
    {i < items.length - 1 && <text x={pos[i].x + pos[i].w + gap / 2} y={formulas ? y + 76 : y + 29} textAnchor="middle" fontSize="19" fontWeight="700" fill={muted}>{i + 1 === arrowAfter ? '→' : '+'}</text>}
  </g>)}</g>
}

// ---------- Test tubes ----------
const metalCol: Record<string, string> = { Mg: '#c5ccd3', Zn: '#aab5be', Fe: '#7b8791', Cu: copperCol }
const BUB: Array<[number, number]> = [[-8, -16], [7, -32], [-5, -50], [8, -66], [-7, -80]]
function Tube({ cx, y = 46, metal, bubbles, on = true, tag }: { cx: number; y?: number; metal: string; bubbles: number; on?: boolean; tag?: ReactNode }) {
  const bottom = y + 122
  return <g opacity={on ? 1 : faded}>
    <path d={`M${cx - 22} ${y - 6}V${bottom}a22 22 0 0 0 44 0V${y - 6}`} fill="white" fillOpacity=".6" stroke={glass} strokeWidth="2.6" />
    <path d={`M${cx - 19} ${y + 24}H${cx + 19}V${bottom}a19 19 0 0 1 -38 0Z`} fill={liquid} />
    <rect x={cx - 11} y={bottom + 6} width={22} height={9} rx="3" fill={metalCol[metal] ?? '#b9c2c9'} stroke="#6a7680" strokeWidth="1.4" />
    {BUB.slice(0, bubbles).map(([dx, dy], i) => <circle key={i} cx={cx + dx} cy={bottom + dy} r={4 + (i % 2)} fill="white" stroke="#8aa4b6" strokeWidth="1.5" />)}
    {tag}
  </g>
}
const TubeLabel = ({ cx, y, a, b }: { cx: number; y: number; a: string; b?: string }) => <g textAnchor="middle"><text x={cx} y={y} fontSize="16" fontWeight="700" fill={ink}>{a}</text>{b && <text x={cx} y={y + 18} fontSize="13" fill={muted}>{b}</text>}</g>

// ---------- Acid + metal ----------
function AcidWord() {
  return <Diagram title="A word equation in chips: acid plus metal makes a salt plus hydrogen. Acid is amber, the metal coral, the salt blue and hydrogen is a white chip, with a few bubbles rising from it.">
    <Head>acid + metal → salt + hydrogen</Head>
    <EqRow y={66} arrowAfter={2} items={[{ a: 'acid', kind: 'acid' }, { a: 'metal', kind: 'metal' }, { a: 'salt', kind: 'salt' }, { a: 'hydrogen', kind: 'plain' }]} />
    <text x={270} y={160} textAnchor="middle" fontSize="15" fill={ink}>The metal takes the place of the hydrogen in the acid.</text>
    <text x={270} y={184} textAnchor="middle" fontSize="15" fill={ink}>The hydrogen is given off as a gas.</text>
    <Note y={230}>Hydrochloric acid makes chlorides. Sulfuric acid makes sulfates.</Note>
  </Diagram>
}
function AcidEq() {
  return <Diagram viewBox="0 0 540 290" title="Two examples. Hydrochloric acid plus zinc makes zinc chloride plus hydrogen, with the symbol equation 2HCl + Zn → ZnCl2 + H2. Sulfuric acid plus magnesium makes magnesium sulfate plus hydrogen, H2SO4 + Mg → MgSO4 + H2.">
    <EqRow y={18} arrowAfter={2} formulas items={[{ a: 'hydrochloric', b: 'acid', kind: 'acid', f: '2HCl' }, { a: 'zinc', kind: 'metal', f: 'Zn' }, { a: 'zinc', b: 'chloride', kind: 'salt', f: 'ZnCl2' }, { a: 'hydrogen', kind: 'plain', f: 'H2' }]} />
    <path d="M30 128H510" stroke={panelLine} strokeWidth="1.5" />
    <EqRow y={152} arrowAfter={2} formulas items={[{ a: 'sulfuric', b: 'acid', kind: 'acid', f: 'H2SO4' }, { a: 'magnesium', kind: 'metal', f: 'Mg' }, { a: 'magnesium', b: 'sulfate', kind: 'salt', f: 'MgSO4' }, { a: 'hydrogen', kind: 'plain', f: 'H2' }]} />
    <Note y={274}>The metal gives the first word of the salt; the acid gives the second.</Note>
  </Diagram>
}
function AcidRate() {
  const xs = [90, 220, 350, 480]
  const rows: Array<[string, string, number, string]> = [['Mg', 'magnesium', 5, 'many bubbles'], ['Zn', 'zinc', 3, 'some bubbles'], ['Fe', 'iron', 2, 'few bubbles'], ['Cu', 'copper', 0, 'no bubbles']]
  return <Diagram viewBox="0 0 570 250" title="Four test tubes of the same dilute acid, each with a different metal. Magnesium makes many bubbles of hydrogen, zinc some, iron a few, and copper none.">
    <text x={285} y={24} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>Same acid, same amount of metal</text>
    {rows.map(([m, name, n, d], i) => <g key={m}><Tube cx={xs[i] + 0} y={40} metal={m} bubbles={n} /><TubeLabel cx={xs[i]} y={212} a={name} b={d} /></g>)}
  </Diagram>
}

// ---------- Water ----------
function WaterWord() {
  return <Diagram title="A word equation in chips: metal plus water makes a metal hydroxide plus hydrogen. The metal is coral, the hydroxide grey, water and hydrogen white.">
    <Head>metal + water → metal hydroxide + hydrogen</Head>
    <EqRow y={66} arrowAfter={2} items={[{ a: 'metal', kind: 'metal' }, { a: 'water', kind: 'plain' }, { a: 'metal', b: 'hydroxide', kind: 'hydroxide' }, { a: 'hydrogen', kind: 'plain' }]} />
    <text x={270} y={160} textAnchor="middle" fontSize="15" fill={ink}>Only the more reactive metals react with water.</text>
    <text x={270} y={184} textAnchor="middle" fontSize="15" fill={ink}>The hydrogen escapes as bubbles of gas.</text>
    <Note y={230}>Water is H₂O, so the new compound has hydroxide, OH, in it.</Note>
  </Diagram>
}
function WaterCa() {
  return <Diagram title="Calcium plus water makes calcium hydroxide plus hydrogen. Symbol equation with state symbols: Ca(s) + 2H2O(l) → Ca(OH)2(aq) + H2(g). State symbols: s is solid, l is liquid, aq is dissolved in water, g is gas.">
    <EqRow y={44} arrowAfter={2} formulas big items={[{ a: 'calcium', kind: 'metal', f: 'Ca(s)' }, { a: 'water', kind: 'plain', f: '2H2O(l)' }, { a: 'calcium', b: 'hydroxide', kind: 'hydroxide', f: 'Ca(OH)2(aq)' }, { a: 'hydrogen', kind: 'plain', f: 'H2(g)' }]} gap={40} />
    <g fontSize="14" fill={ink}>
      <rect x={70} y={166} width={400} height={78} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
      <text x={100} y={192} fontWeight="700">State symbols</text>
      <text x={100} y={214}><tspan fontWeight="700">(s)</tspan> solid   <tspan fontWeight="700">(l)</tspan> liquid</text>
      <text x={100} y={234}><tspan fontWeight="700">(aq)</tspan> dissolved in water   <tspan fontWeight="700">(g)</tspan> gas</text>
    </g>
  </Diagram>
}
function WaterList() {
  const yes = [['K', 'potassium'], ['Na', 'sodium'], ['Li', 'lithium'], ['Ca', 'calcium']], no = [['Zn', 'zinc'], ['Fe', 'iron'], ['Cu', 'copper']]
  return <Diagram viewBox="0 0 540 290" title="Two columns. Potassium, sodium, lithium and calcium react with water. Zinc, iron and copper do not react with water.">
    <text x={140} y={30} textAnchor="middle" fontSize="16" fontWeight="700" fill={metalInk}>react with water</text>
    <text x={400} y={30} textAnchor="middle" fontSize="16" fontWeight="700" fill={muted}>do not react with water</text>
    {yes.map(([s, n], i) => <g key={s}><rect x={40} y={46 + i * 56} width={200} height={46} rx="10" fill={metalFill} stroke={metalLine} strokeWidth="1.8" /><text x={60} y={76 + i * 56} fontSize="20" fontWeight="700" fill={metalInk}>{s}</text><text x={110} y={75 + i * 56} fontSize="15" fill={ink}>{n}</text>
      <g fill="white" stroke="#8aa4b6" strokeWidth="1.4"><circle cx={210} cy={78 + i * 56} r="4" /><circle cx={222} cy={66 + i * 56} r="3.5" /></g></g>)}
    {no.map(([s, n], i) => <g key={s}><rect x={300} y={46 + i * 56} width={200} height={46} rx="10" fill={baseFill} stroke={baseLine} strokeWidth="1.8" /><text x={320} y={76 + i * 56} fontSize="20" fontWeight="700" fill={ink}>{s}</text><text x={370} y={75 + i * 56} fontSize="15" fill={ink}>{n}</text></g>)}
    <text x={400} y={252} textAnchor="middle" fontSize="13" fill={muted}>no bubbles</text>
  </Diagram>
}

// ---------- Ordering ----------
function OrderBubbles() {
  const rows: Array<[string, string, number, number]> = [['Mg', 'magnesium', 5, 1], ['Zn', 'zinc', 3, 2], ['Fe', 'iron', 2, 3]]
  const xs = [120, 250, 380]
  return <Diagram viewBox="0 0 540 260" title="Three test tubes of the same acid with magnesium, zinc and iron. Magnesium bubbles fastest and is numbered 1, zinc is 2 and iron is 3. Faster bubbles mean a more reactive metal.">
    <text x={270} y={24} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>Faster bubbles = more reactive</text>
    {rows.map(([m, name, n, r], i) => <g key={m}><Tube cx={xs[i]} y={40} metal={m} bubbles={n} />
      <circle cx={xs[i]} cy={214} r="13" fill={r === 1 ? hot : 'white'} stroke={hot} strokeWidth="2" /><text x={xs[i]} y={219} textAnchor="middle" fontSize="14" fontWeight="700" fill={r === 1 ? 'white' : hot}>{r}</text>
      <text x={xs[i]} y={244} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{name}</text></g>)}
    <text x={418} y={110} fontSize="13" fill={muted}>1 = fastest</text><text x={418} y={128} fontSize="13" fill={muted}>bubbles</text>
  </Diagram>
}
function OrderTemp() {
  const bars: Array<[string, number]> = [['magnesium', 18], ['zinc', 9], ['iron', 4]]
  const base = 224, k = 8.5
  return <Diagram viewBox="0 0 540 290" schematic={false} title="A bar chart of invented data. Temperature rise in the same acid after the same time: magnesium 18 degrees Celsius, zinc 9 degrees, iron 4 degrees. The more reactive the metal, the bigger the rise.">
    <text x={270} y={24} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>Temperature rise in the same acid</text>
    <path d={`M84 44V${base}H500`} stroke={ink} strokeWidth="2" fill="none" />
    <text x={20} y={140} fontSize="13" fill={muted} transform="rotate(-90 20 140)" textAnchor="middle">temperature rise (°C)</text>
    {[0, 5, 10, 15, 20].map(v => <g key={v}><path d={`M78 ${base - v * k}H84`} stroke={ink} strokeWidth="1.5" /><text x={72} y={base - v * k + 5} textAnchor="end" fontSize="12" fill={muted}>{v}</text></g>)}
    {bars.map(([n, v], i) => <g key={n}><rect x={120 + i * 130} y={base - v * k} width={76} height={v * k} rx="4" fill="#f8dfae" stroke={hot} strokeWidth="2" /><text x={158 + i * 130} y={base - v * k - 8} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{v}</text><text x={158 + i * 130} y={base + 22} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{n}</text></g>)}
    <text x={290} y={272} textAnchor="middle" fontSize="13" fill={muted}>same time, same mass, same acid</text>
  </Diagram>
}
function OrderFair() {
  const rows = ['mass of metal', 'size of the pieces (surface area)', 'volume and strength of the acid', 'starting temperature']
  return <Diagram viewBox="0 0 540 290" title="A fair test. Change only the metal. Keep the same: the mass of metal, the surface area of the pieces, the volume and strength of the acid, and the starting temperature.">
    <rect x={40} y={20} width={460} height={44} rx="10" fill="#fdf0d6" stroke={hot} strokeWidth="2.4" /><text x={64} y={48} fontSize="16" fontWeight="700" fill={ink}>Change: the metal</text>
    <text x={64} y={92} fontSize="15" fontWeight="700" fill={ink}>Keep the same:</text>
    {rows.map((r, i) => <g key={r}><rect x={40} y={104 + i * 44} width={460} height={36} rx="9" fill={panelFill} stroke={panelLine} strokeWidth="1.5" /><circle cx={64} cy={122 + i * 44} r="7" fill="white" stroke={electronLine} strokeWidth="2" /><text x={84} y={127 + i * 44} fontSize="15" fill={ink}>{r}</text></g>)}
  </Diagram>
}
function Series({ on = 'all' }: { on?: 'all' }) {
  void on
  const rows: Array<[string, string, number]> = [['K', 'potassium', 0], ['Na', 'sodium', 0], ['Li', 'lithium', 0], ['Ca', 'calcium', 0], ['Mg', 'magnesium', 1], ['Zn', 'zinc', 1], ['Fe', 'iron', 1], ['Cu', 'copper', 2]]
  const col = [[metalFill, metalLine, metalInk], [acidFill, acidLine, acidInk], [baseFill, baseLine, ink]]
  const grp = [['very reactive', 0, 3], ['fairly reactive', 4, 6], ['not very reactive', 7, 7]] as const
  return <Diagram viewBox="0 0 540 290" title="The reactivity series of metals, most reactive at the top: potassium, sodium, lithium, calcium (very reactive), then magnesium, zinc, iron (fairly reactive), then copper (not very reactive).">
    <Arr x1={44} y1={262} x2={44} y2={22} colour={hot} width={3} />
    <text x={28} y={146} fontSize="13" fill={muted} transform="rotate(-90 28 146)" textAnchor="middle">more reactive</text>
    {rows.map(([s, n, g], i) => <g key={s}><rect x={70} y={16 + i * 32} width={220} height={28} rx="8" fill={col[g][0]} stroke={col[g][1]} strokeWidth="1.8" /><text x={90} y={36 + i * 32} fontSize="17" fontWeight="700" fill={col[g][2]}>{s}</text><text x={140} y={35 + i * 32} fontSize="15" fill={ink}>{n}</text></g>)}
    {grp.map(([t, a, b]) => <g key={t}><path d={`M304 ${18 + a * 32}V${42 + b * 32}`} stroke={muted} strokeWidth="2" fill="none" /><text x={318} y={(18 + a * 32 + 42 + b * 32) / 2 + 5} fontSize="15" fontWeight="700" fill={ink}>{t}</text></g>)}
  </Diagram>
}

// ---------- Displacement ----------
function Beaker({ x, y, fill, title }: { x: number; y: number; fill: string; title: string }) {
  return <g><path d={`M${x} ${y}V${y + 96}Q${x} ${y + 106} ${x + 10} ${y + 106}H${x + 110}Q${x + 120} ${y + 106} ${x + 120} ${y + 96}V${y}`} fill="white" fillOpacity=".6" stroke={glass} strokeWidth="2.6" />
    <path d={`M${x + 3} ${y + 30}H${x + 117}V${y + 96}Q${x + 117} ${y + 103} ${x + 110} ${y + 103}H${x + 10}Q${x + 3} ${y + 103} ${x + 3} ${y + 96}Z`} fill={fill} />
    <title>{title}</title></g>
}
function DispWhat() {
  const nail = (x: number, coat: boolean) => <g transform={`rotate(-8 ${x + 60} 120)`}><rect x={x + 52} y={54} width={14} height={92} rx="3" fill={coat ? copperFill : '#8a95a0'} stroke={coat ? copperCol : '#5f6a74'} strokeWidth="2" /><rect x={x + 48} y={50} width={22} height={8} rx="3" fill={coat ? copperFill : '#8a95a0'} stroke={coat ? copperCol : '#5f6a74'} strokeWidth="2" /></g>
  return <Diagram viewBox="0 0 540 290" title="Before and after. Before: an iron nail in blue copper sulfate solution. After: the nail is coated with brown copper, and the solution has become pale green iron sulfate solution. Iron has pushed copper out of the compound.">
    <text x={100} y={30} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>before</text><text x={440} y={30} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>after</text>
    <Beaker x={40} y={44} fill="#a9d0ee" title="beaker" />{nail(40, false)}
    <Beaker x={380} y={44} fill="#d6ecd0" title="beaker" />{nail(380, true)}
    <Arr x1={190} y1={100} x2={330} y2={100} />
    <text x={260} y={90} textAnchor="middle" fontSize="13" fill={muted}>iron pushes out copper</text>
    <g fontSize="14" fontWeight="700" textAnchor="middle" fill={ink}><text x={100} y={178}>copper sulfate</text><text x={100} y={196}>solution (blue)</text><text x={440} y={178}>iron sulfate</text><text x={440} y={196}>solution (pale green)</text></g>
    <text x={440} y={224} textAnchor="middle" fontSize="14" fontWeight="700" fill={copperCol}>brown copper on the nail</text>
    <Note y={268}>Copper sulfate is a compound of copper. Iron takes copper’s place.</Note>
  </Diagram>
}
function DispRule() {
  return <Diagram viewBox="0 0 540 290" title="Block diagram of displacement. The more reactive metal, iron, joins the sulfate and pushes the less reactive metal, copper, out of copper sulfate. Iron sits above copper in the reactivity series.">
    <EqRow y={40} arrowAfter={2} items={[{ a: 'iron', kind: 'metal', on: true }, { a: 'copper', b: 'sulfate', kind: 'salt', split: ['copper', 'sulfate'] }, { a: 'iron', b: 'sulfate', kind: 'salt', split: ['iron', 'sulfate'] }, { a: 'copper', kind: 'metal', on: true }]} />
    <rect x={70} y={130} width={400} height={52} rx="12" fill="#fdf0d6" stroke={hot} strokeWidth="2.2" />
    <text x={270} y={153} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>A more reactive metal displaces</text>
    <text x={270} y={172} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>a less reactive metal from its compound.</text>
    <g fontSize="15" fontWeight="700"><rect x={170} y={204} width={90} height={32} rx="8" fill={metalFill} stroke={hot} strokeWidth="2.4" /><text x={215} y={226} textAnchor="middle" fill={metalInk}>iron</text><rect x={280} y={204} width={90} height={32} rx="8" fill={baseFill} stroke={baseLine} strokeWidth="1.8" /><text x={325} y={226} textAnchor="middle" fill={ink}>copper</text></g>
    <text x={158} y={226} textAnchor="end" fontSize="13" fill={muted}>higher</text><text x={382} y={226} fontSize="13" fill={muted}>lower</text>
    <Note y={264}>Iron is higher in the reactivity series than copper.</Note>
  </Diagram>
}
function DispEq() {
  return <Diagram viewBox="0 0 540 250" title="Iron plus copper sulfate makes iron sulfate plus copper. Symbol equation with state symbols: Fe(s) + CuSO4(aq) → FeSO4(aq) + Cu(s). Iron sulfate solution and solid copper are the products.">
    <EqRow y={24} arrowAfter={2} formulas big gap={46} items={[{ a: 'iron', kind: 'metal', f: 'Fe(s)' }, { a: 'copper', b: 'sulfate', kind: 'salt', split: ['copper', 'sulfate'], f: 'CuSO4(aq)' }, { a: 'iron', b: 'sulfate', kind: 'salt', split: ['iron', 'sulfate'], f: 'FeSO4(aq)' }, { a: 'copper', kind: 'metal', f: 'Cu(s)' }]} />
    <g fontSize="14" fill={ink} textAnchor="middle"><text x={270} y={160}>solid iron + copper sulfate solution</text><text x={270} y={182}>→ iron sulfate solution + solid copper</text></g>
    <Note y={224}>Fe is more reactive than Cu, so Fe takes the sulfate.</Note>
  </Diagram>
}
function DispNone() {
  return <Diagram viewBox="0 0 540 270" title="Copper plus iron sulfate solution: no reaction. Copper is less reactive than iron, so it cannot push iron out of iron sulfate.">
    <EqRow y={40} arrowAfter={2} items={[{ a: 'copper', kind: 'metal', on: true }, { a: 'iron', b: 'sulfate', kind: 'salt', split: ['iron', 'sulfate'] }, { a: 'no', b: 'reaction', kind: 'none' }]} />
    <g fontSize="15" fill={ink} textAnchor="middle"><text x={270} y={140} fontWeight="700">A less reactive metal cannot displace</text><text x={270} y={162} fontWeight="700">a more reactive one.</text></g>
    <g fontSize="15" fontWeight="700"><rect x={170} y={190} width={90} height={32} rx="8" fill={baseFill} stroke={hot} strokeWidth="2.4" /><text x={215} y={212} textAnchor="middle" fill={ink}>copper</text><rect x={280} y={190} width={90} height={32} rx="8" fill={metalFill} stroke={metalLine} strokeWidth="1.8" /><text x={325} y={212} textAnchor="middle" fill={metalInk}>iron</text></g>
    <text x={158} y={212} textAnchor="end" fontSize="13" fill={muted}>lower</text><text x={382} y={212} fontSize="13" fill={muted}>higher</text>
  </Diagram>
}

// ---------- Question visuals ----------
function QuestionTubes() {
  const xs = [110, 270, 430], t: Array<[string, number]> = [['P', 2], ['Q', 5], ['R', 0]]
  return <Diagram viewBox="0 0 540 250" schematic title="Three test tubes of the same dilute acid, each with a different metal labelled P, Q and R. The bubbles in each tube are shown. Each tube started at the same time with the same amount of metal.">
    {t.map(([l, n], i) => <g key={l}><Tube cx={xs[i]} y={30} metal="Zn" bubbles={n} /><circle cx={xs[i]} cy={206} r="14" fill="white" stroke={ink} strokeWidth="2" /><text x={xs[i]} y={212} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{l}</text></g>)}
  </Diagram>
}
function QuestionDisplace() {
  const rows: Array<[string, string, string]> = [['1', 'magnesium in zinc sulfate solution', 'zinc metal forms'], ['2', 'zinc in copper sulfate solution', 'copper metal forms'], ['3', 'copper in magnesium sulfate solution', 'no change']]
  return <Diagram viewBox="0 0 540 250" schematic={false} title="A results table. Experiment 1: magnesium in zinc sulfate solution, zinc metal forms. Experiment 2: zinc in copper sulfate solution, copper metal forms. Experiment 3: copper in magnesium sulfate solution, no change.">
    <text x={24} y={28} fontSize="15" fontWeight="700" fill={ink}>A metal in a salt solution</text>
    <rect x={20} y={42} width={500} height={192} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="14" fontWeight="700" fill={ink}><text x={36} y={70}>test</text><text x={352} y={70}>what was seen</text></g>
    <path d="M32 82H508" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([n, a, b], i) => <g key={n} fontSize="14" fill={ink}><text x={36} y={112 + i * 42} fontWeight="700">{n}</text><text x={58} y={112 + i * 42}>{a}</text><text x={352} y={112 + i * 42} fontWeight="700">{b}</text></g>)}
  </Diagram>
}
export function MetalReactionVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'mrx-acid-word': return <AcidWord />
    case 'mrx-acid-eq': return <AcidEq />
    case 'mrx-acid-rate': return <AcidRate />
    case 'mrx-water-word': return <WaterWord />
    case 'mrx-water-ca': return <WaterCa />
    case 'mrx-water-list': return <WaterList />
    case 'mrx-order-bubbles': return <OrderBubbles />
    case 'mrx-order-temp': return <OrderTemp />
    case 'mrx-order-fair': return <OrderFair />
    case 'mrx-series': return <Series />
    case 'mrx-disp-what': return <DispWhat />
    case 'mrx-disp-rule': return <DispRule />
    case 'mrx-disp-eq': return <DispEq />
    case 'mrx-disp-none': return <DispNone />
    case 'mrx-question-tubes': return <QuestionTubes />
    case 'mrx-question-displace': return <QuestionDisplace />
    default: return assessment ? <QuestionTubes /> : <Series />
  }
}
