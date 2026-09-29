import { useId, type ReactNode } from 'react'
import { Arrow } from './InfectionVisuals'
import { atomPalette, Electron } from './AtomVisuals'

/*
 * Chemistry C1b (Chemistry Lesson 9): Group 1, the alkali metals. Original, code-native schematics; not to scale.
 * Focus ids start with 'alk-'.
 *
 * Colours: the Chemistry palette from AtomVisuals (electrons blue on thin shells, the nucleus a small coral disc, positive
 * ions coral) plus the group tints PeriodicVisuals uses: Group 1 tiles are the soft metal grey, oxygen amber.
 * Coral red marks what the frame is about (a trend, a lost electron). Water is pale blue, chlorine gas pale green (its real
 * colour, in the isotope-green tint), hydrogen bubbles white. Potassium's flame is drawn lilac, its real colour.
 * Every symbol and electronic structure is real: Li 2,1; Na 2,8,1; K 2,8,8,1. Values are rounded data-book values:
 * relative atomic masses as on the source page (Li 7, Na 23, K 39, Rb 85, Cs 133, Fr 223); melting points 181, 98, 63,
 * 39, 28 °C; boiling points 1342, 883, 759, 688, 671 °C; densities 0.53, 0.97, 0.86 g/cm³.
 */
const { ink, muted, protonFill, protonLine, electronLine, shellLine, space, spaceLine, glow, lightIso, lightIsoLine, darkIsoLine, panelFill, panelLine, neutronFill, neutronLine } = atomPalette
const faded = 0.3
const greyFill = '#eef1f3', greyLine = '#7f8c97'
const amberFill = '#fff4e6', amberLine = '#d9a55b', amberInk = '#8a5a14'
const waterFill = '#e4f0f9'
const dull = '#a4adb5', dullLine = '#6f7c87'
const lilac = '#d9c4ee', lilacLine = '#8e62b5'
const r1 = (n: number) => Math.round(n * 10) / 10

function Diagram({ title, children, viewBox = '0 0 540 340', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Pointer({ n, x, y, to }: { n: number; x: number; y: number; to: [number, number] }) {
  const angle = Math.atan2(to[1] - y, to[0] - x)
  return <g><path d={`M${r1(x + Math.cos(angle) * 13)} ${r1(y + Math.sin(angle) * 13)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
    <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}
function Badge({ n, x, y, colour = ink }: { n: number; x: number; y: number; colour?: string }) {
  return <g><circle cx={x} cy={y} r="12" fill="white" stroke={colour} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={colour}>{n}</text></g>
}
type Line = [string, 'b' | 'n' | 'm' | 'r' | 'blue' | 'amber' | 'green']
function Notes({ x, y, lines, anchor = 'start' }: { x: number; y: number; lines: Line[]; anchor?: 'start' | 'middle' | 'end' }) {
  const fill = { b: ink, n: ink, m: muted, r: protonLine, blue: electronLine, amber: amberInk, green: darkIsoLine }
  let dy = 0
  return <g fontSize="14" textAnchor={anchor}>{lines.map(([text, kind], i) => {
    const gap = text === '' ? 10 : 19
    const el = text === '' ? null : <text key={i} x={x} y={y + dy} fontWeight={kind === 'n' || kind === 'm' ? 400 : 700} fontSize={kind === 'm' ? 13 : 14} fill={fill[kind]}>{text}</text>
    dy += gap
    return el
  })}</g>
}

// ---------- The group ----------
const G1 = [
  { sym: 'Li', name: 'lithium', ar: '7', mp: '181', bp: '1342' },
  { sym: 'Na', name: 'sodium', ar: '23', mp: '98', bp: '883' },
  { sym: 'K', name: 'potassium', ar: '39', mp: '63', bp: '759' },
  { sym: 'Rb', name: 'rubidium', ar: '85', mp: '39', bp: '688' },
  { sym: 'Cs', name: 'caesium', ar: '133', mp: '28', bp: '671' },
  { sym: 'Fr', name: 'francium', ar: '223', mp: '', bp: '' },
]
type TileLook = 'on' | 'active' | 'faded'
const COL = { x: 20, w: 150, y0: 44, h: 42, gap: 6 }
const rowY = (i: number) => COL.y0 + i * (COL.h + COL.gap)
const rowMid = (i: number) => rowY(i) + COL.h / 2
/** Group 1 as a column of tiles, lithium at the top. */
function Column({ look = () => 'on', ar = false }: { look?: (i: number) => TileLook; ar?: boolean }) {
  return <g>
    <text x={COL.x} y={28} fontSize="15" fontWeight="700" fill={ink}>Group 1{ar && <tspan fontSize="13" fontWeight="400" fill={muted}> with relative atomic masses</tspan>}</text>
    {G1.map((el, i) => {
      const l = look(i), y = rowY(i), hot = l === 'active'
      return <g key={el.sym} opacity={l === 'faded' ? faded : 1}>
        <rect x={COL.x} y={y} width={COL.w} height={COL.h} rx="8" fill={hot ? glow : greyFill} stroke={hot ? protonLine : greyLine} strokeWidth={hot ? 2.6 : 1.6} />
        <text x={COL.x + 14} y={y + 29} fontSize="21" fontWeight="700" fill={ink}>{el.sym}</text>
        {ar ? <text x={COL.x + COL.w - 14} y={y + 28} textAnchor="end" fontSize="17" fontWeight="700" fill={ink}>{el.ar}</text> : <text x={COL.x + 52} y={y + 26} fontSize="13" fill={ink}>{el.name}</text>}
      </g>
    })}
  </g>
}

// ---------- Atoms: blue electrons on thin shells round a small coral nucleus ----------
const START = [180, -90, -45, -90]
function ShellAtom({ cx, cy, shells, step = 12, er = 4, outerOn = false, outerAngle = -50, sym, lost = false }: { cx: number; cy: number; shells: number[]; step?: number; er?: number; outerOn?: boolean; outerAngle?: number; sym?: string; lost?: boolean }) {
  const n = shells.length, outer = n * step, nr = step - er - 3
  return <g>
    <circle cx={cx} cy={cy} r={outer + er + 6} fill={space} stroke={spaceLine} strokeWidth="1.5" />
    {shells.map((_, i) => {
      const hot = outerOn && i === n - 1
      return <circle key={i} cx={cx} cy={cy} r={(i + 1) * step} fill="none" stroke={hot ? electronLine : shellLine} strokeWidth={hot ? 2.6 : 1.6} strokeDasharray={lost && i === n - 1 ? '5 5' : undefined} />
    })}
    {shells.map((count, s) => Array.from({ length: count }, (_, j) => {
      if (lost && s === n - 1) return null
      const deg = count === 1 && s === n - 1 ? outerAngle : START[s] + j * 360 / count
      const a = deg * Math.PI / 180
      return <Electron key={`${s}-${j}`} x={cx + Math.cos(a) * (s + 1) * step} y={cy + Math.sin(a) * (s + 1) * step} r={er} sign={er >= 7.5} icon />
    }))}
    <circle cx={cx} cy={cy} r={nr} fill={protonFill} stroke={protonLine} strokeWidth="1.5" />
    {sym && nr >= 10 && <text x={cx} y={cy + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="white">{sym}</text>}
  </g>
}
const outerPoint = (cx: number, cy: number, n: number, step: number, deg: number): [number, number] => [r1(cx + Math.cos(deg * Math.PI / 180) * n * step), r1(cy + Math.sin(deg * Math.PI / 180) * n * step)]

// ---------- Section 1: meet the group ----------
// A small outline of the whole periodic table (18 columns, 7 rows) with Group 1 picked out.
function MiniTable({ x0, y0, c = 15 }: { x0: number; y0: number; c?: number }) {
  const cells: Array<[number, number]> = []
  for (let r = 0; r < 7; r++) for (let col = 0; col < 18; col++) {
    const present = r === 0 ? col === 0 || col === 17 : r < 3 ? col < 2 || col > 11 : true
    if (present) cells.push([r, col])
  }
  return <g>
    {cells.map(([r, col]) => {
      const g1 = col === 0 && r > 0
      return <rect key={`${r}-${col}`} x={x0 + col * c} y={y0 + r * c} width={c - 1.5} height={c - 1.5} rx="2" fill={g1 ? glow : panelFill} stroke={g1 ? protonLine : panelLine} strokeWidth={g1 ? 1.6 : 1} />
    })}
    <text x={x0 + c / 2 - .5} y={y0 + c / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill={muted}>H</text>
  </g>
}
function GroupTable() {
  const x0 = 236, y0 = 64, c = 15
  return <Diagram title="Group 1 is the first column of the periodic table: lithium, sodium, potassium, rubidium, caesium and francium, shown as a column of tiles and picked out on a small outline of the whole table. Hydrogen sits above lithium but is not an alkali metal." schematic={false}>
    <Column />
    <MiniTable x0={x0} y0={y0} />
    <path d={`M${x0 - 2} ${y0 + c}L${COL.x + COL.w + 6} ${COL.y0}M${x0 - 2} ${y0 + 7 * c}L${COL.x + COL.w + 6} ${rowY(5) + COL.h}`} stroke={muted} strokeWidth="1.4" strokeDasharray="5 5" />
    <text x={x0} y={y0 - 14} fontSize="13" fill={muted}>the whole periodic table</text>
    <Notes x={236} y={214} lines={[['Group 1: the first column', 'b'], ['These metals are called', 'n'], ['the alkali metals.', 'r'], ['', 'n'], ['Hydrogen (H) sits above lithium', 'm'], ['on many tables, but it is not', 'm'], ['an alkali metal.', 'm']]} />
  </Diagram>
}
const TRIO = [{ sym: 'Li', name: 'lithium', shells: [2, 1] }, { sym: 'Na', name: 'sodium', shells: [2, 8, 1] }, { sym: 'K', name: 'potassium', shells: [2, 8, 8, 1] }]
function GroupElectron() {
  const xs = [248, 350, 468], cy = 112
  return <Diagram title="Lithium 2,1, sodium 2,8,1 and potassium 2,8,8,1, the first three alkali metals. Each atom's outer shell is highlighted and holds just one electron, so they react in similar ways.">
    <Column look={i => i < 3 ? 'active' : 'faded'} />
    {TRIO.map((a, i) => <g key={a.sym}>
      <ShellAtom cx={xs[i]} cy={cy} shells={a.shells} outerOn />
      <text x={xs[i]} y={200} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{a.name}</text>
      <text x={xs[i]} y={220} textAnchor="middle" fontSize="15" fontWeight="700" fill={electronLine}>{a.shells.join(',')}</text>
    </g>)}
    <rect x={200} y={246} width={326} height={70} rx="10" fill="#e8f2fa" stroke={electronLine} strokeWidth="1.5" />
    <text x={363} y={272} textAnchor="middle" fontSize="14" fontWeight="700" fill={electronLine}>1 electron in the outer shell</text>
    <text x={363} y={298} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>→ they react in similar ways</text>
  </Diagram>
}
/** A piece of alkali metal seen face-on. 'fresh' = just cut and shiny; 'dull' = tarnished. */
function Slice({ x, y, w = 120, h = 80, kind }: { x: number; y: number; w?: number; h?: number; kind: 'fresh' | 'dull' }) {
  const id = useId()
  if (kind === 'dull') return <g>
    <rect x={x} y={y} width={w} height={h} rx="10" fill={dull} stroke={dullLine} strokeWidth="2" />
    <rect x={x + 5} y={y + 5} width={w - 10} height={h - 10} rx="7" fill="none" stroke={amberLine} strokeWidth="1.5" strokeDasharray="3 4" />
  </g>
  return <g>
    <clipPath id={id}><rect x={x} y={y} width={w} height={h} rx="10" /></clipPath>
    <rect x={x} y={y} width={w} height={h} rx="10" fill={spaceLine} stroke={greyLine} strokeWidth="2" />
    <g clipPath={`url(#${id})`} stroke="white" strokeWidth="9"><path d={`M${x + w * .2} ${y + h + 10}L${x + w * .55} ${y - 10}`} /><path d={`M${x + w * .5} ${y + h + 10}L${x + w * .75} ${y - 10}`} strokeWidth="5" /></g>
    <rect x={x} y={y} width={w} height={h} rx="10" fill="none" stroke={greyLine} strokeWidth="2" />
  </g>
}
function GroupSoft() {
  const bx = 214, by = 150
  return <Diagram title="A block of sodium on a tile, cut through with a knife. The metal is soft enough to cut easily. Label 1: the outside of the block is dull. Label 2: the freshly cut face is shiny.">
    <Column look={i => i < 3 ? 'active' : 'faded'} />
    <rect x={bx - 8} y={by + 76} width={318} height={12} rx="3" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <rect x={bx} y={by} width={150} height={76} rx="10" fill={dull} stroke={dullLine} strokeWidth="2" />
    <path d={`M${bx + 158} ${by + 76}L${bx + 150} ${by - 54}L${bx + 170} ${by - 54}L${bx + 164} ${by + 76}Z`} fill={greyFill} stroke={greyLine} strokeWidth="1.8" />
    <rect x={bx + 146} y={by - 100} width={28} height={48} rx="6" fill={ink} />
    <Slice x={bx + 186} y={by - 4} w={112} kind="fresh" />
    <text x={bx + 150} y={30} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>soft: a knife cuts it easily</text>
    <Pointer n={1} x={bx + 60} y={by + 124} to={[bx + 60, by + 60]} />
    <Pointer n={2} x={bx + 242} y={by + 124} to={[bx + 242, by + 60]} />
    <g fontSize="13" fill={ink}>
      <text x={bx + 60} y={by + 160} textAnchor="middle">dull outside</text>
      <text x={bx + 242} y={by + 160} textAnchor="middle" fontWeight="700">shiny cut face</text>
    </g>
  </Diagram>
}
function GroupLight() {
  const ax = 262, base = 270, top = 70, max = 1.2, y = (v: number) => r1(base - (v / max) * (base - top))
  const bars = [{ sym: 'Li', name: 'lithium', v: .53 }, { sym: 'Na', name: 'sodium', v: .97 }, { sym: 'K', name: 'potassium', v: .86 }]
  return <Diagram schematic={false} title="Bar chart of density in grams per cubic centimetre. Lithium 0.53, sodium 0.97, potassium 0.86. A dashed line at 1.00 marks water. All three bars are below the line: they are less dense than water, so they float. Iron, at 7.9, would be far off the top.">
    <Column look={i => i < 3 ? 'active' : 'faded'} />
    <path d={`M${ax} ${top - 10}V${base}H522`} fill="none" stroke={ink} strokeWidth="2" />
    {[0, .2, .4, .6, .8, 1, 1.2].map(v => <g key={v}><path d={`M${ax - 6} ${y(v)}H${ax}`} stroke={ink} strokeWidth="1.5" /><text x={ax - 10} y={y(v) + 4} textAnchor="end" fontSize="12" fill={ink}>{v.toFixed(1)}</text></g>)}
    <text transform={`translate(${214} ${(top + base) / 2}) rotate(-90)`} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>density (g/cm³)</text>
    {bars.map((b, i) => {
      const x = 290 + i * 76
      return <g key={b.sym}>
        <rect x={x} y={y(b.v)} width={48} height={r1(base - y(b.v))} fill={greyFill} stroke={greyLine} strokeWidth="1.8" />
        <text x={x + 24} y={y(b.v) + 22} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{b.v.toFixed(2)}</text>
        <text x={x + 24} y={base + 20} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{b.name}</text>
      </g>
    })}
    <path d={`M${ax} ${y(1)}H522`} stroke={electronLine} strokeWidth="2.5" strokeDasharray="7 5" />
    <text x={520} y={y(1) - 8} textAnchor="end" fontSize="13" fontWeight="700" fill={electronLine}>water 1.00</text>
    <text x={392} y={316} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>less dense than water, so they float</text>
    <text x={392} y={335} textAnchor="middle" fontSize="12" fill={muted}>(iron is 7.9 g/cm³, far above the top)</text>
  </Diagram>
}

// ---------- Section 2: trends down the group ----------
function TrendIon() {
  const cy = 130, step = 22, er = 6.5
  const [ex, ey] = outerPoint(120, cy, 3, step, -50)
  return <Diagram viewBox="0 0 540 320" title="A sodium atom, 2,8,1, loses its one outer electron. It becomes a sodium ion, Na+, drawn in square brackets with a plus charge. The ion has 2,8 electrons, a full outer shell.">
    <ShellAtom cx={120} cy={cy} shells={[2, 8, 1]} step={step} er={er} outerOn sym="Na" />
    <circle cx={ex} cy={ey} r={er + 5} fill="none" stroke={protonLine} strokeWidth="2.5" />
    <path d={`M${ex + 12} ${ey - 8}Q${ex + 80} ${ey - 60} 290 44`} fill="none" stroke={protonLine} strokeWidth="2.5" strokeDasharray="6 5" />
    <Electron x={300} y={40} r={8} icon />
    <text x={316} y={45} fontSize="13" fontWeight="700" fill={electronLine}>the outer electron is lost</text>
    <Arrow x1={220} y1={cy + 10} x2={300} y2={cy + 10} colour={ink} width={3} />
    <ShellAtom cx={410} cy={cy + 10} shells={[2, 8]} step={step} er={er} sym="Na" />
    <path d={`M346 ${cy - 58}Q334 ${cy + 10} 346 ${cy + 78}M474 ${cy - 58}Q486 ${cy + 10} 474 ${cy + 78}`} fill="none" stroke={ink} strokeWidth="2.2" />
    <text x={486} y={cy - 50} fontSize="24" fontWeight="700" fill={protonLine}>+</text>
    <text x={120} y={240} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>sodium atom <tspan fill={electronLine}>2,8,1</tspan></text>
    <text x={410} y={240} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>sodium ion, Na⁺ <tspan fill={electronLine}>2,8</tspan></text>
    <text x={410} y={258} textAnchor="middle" fontSize="13" fill={muted}>full outer shell</text>
    <rect x={20} y={274} width={500} height={38} rx="10" fill={glow} stroke={protonLine} strokeWidth="1.5" />
    <text x={270} y={298} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>Every alkali metal atom loses 1 electron → a <tspan fill={protonLine}>1+ ion</tspan></text>
  </Diagram>
}
function TrendReactive() {
  return <Diagram title="Group 1 with a coral arrow pointing down the group: the metals get more reactive going down. Lithium fizzes steadily in water; potassium reacts so fast that the hydrogen catches fire. A pattern like this down a group is called a trend." schematic={false}>
    <Column />
    <Arrow x1={190} y1={50} x2={190} y2={322} colour={protonLine} width={4} />
    <text transform="translate(212 186) rotate(90)" textAnchor="middle" fontSize="14" fontWeight="700" fill={protonLine}>more reactive</text>
    <Notes x={244} y={60} lines={[['Going down Group 1, the', 'b'], ['metals get more reactive.', 'r'], ['', 'n'], ['In water:', 'n'], ['lithium fizzes steadily', 'n'], ['potassium fizzes so fast', 'n'], ['that the hydrogen made', 'n'], ['catches fire', 'n'], ['', 'n'], ['A pattern like this down', 'b'], ['a group is called a trend.', 'b']]} />
  </Diagram>
}
function TrendWhy() {
  const xs = [90, 250, 430], cy = 118, step = 15, deg = -40
  return <Diagram viewBox="0 0 540 320" title="Lithium, sodium and potassium atoms drawn at the same scale. Lithium's outer electron is 2 shells out, sodium's 3 and potassium's 4, so it is further from the nucleus each time. It is less strongly attracted to the nucleus, so it is lost more easily, and the metal is more reactive.">
    {TRIO.map((a, i) => {
      const [ex, ey] = outerPoint(xs[i], cy, a.shells.length, step, deg)
      return <g key={a.sym}>
        <ShellAtom cx={xs[i]} cy={cy} shells={a.shells} step={step} er={4.5} outerOn outerAngle={deg} />
        <path d={`M${xs[i]} ${cy}L${ex} ${ey}`} stroke={protonLine} strokeWidth="2.5" strokeDasharray="5 4" />
        <text x={xs[i]} y={cy + 92} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{a.name} <tspan fill={electronLine}>{a.shells.join(',')}</tspan></text>
        <text x={xs[i]} y={cy + 111} textAnchor="middle" fontSize="13" fill={protonLine} fontWeight="700">{a.shells.length} shells out</text>
      </g>
    })}
    <path d="M150 24H176" stroke={protonLine} strokeWidth="2.5" strokeDasharray="5 4" />
    <text x={184} y={29} fontSize="13" fill={ink}>distance from the nucleus to the outer electron</text>
    <rect x={20} y={252} width={500} height={60} rx="10" fill={glow} stroke={protonLine} strokeWidth="1.5" />
    <text x={270} y={276} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>further from the nucleus → less strongly attracted</text>
    <text x={270} y={298} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>→ lost more easily → <tspan fill={protonLine}>more reactive</tspan></text>
  </Diagram>
}
function TrendMelt() {
  const c1 = 280, c2 = 420
  return <Diagram schematic={false} title="Melting and boiling points down Group 1, in degrees Celsius. Lithium 181 and 1342, sodium 98 and 883, potassium 63 and 759, rubidium 39 and 688, caesium 28 and 671. Francium is too rare to measure. Both get lower going down the group.">
    <Column look={i => i === 5 ? 'faded' : 'on'} />
    <text x={c1} y={28} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>melting point (°C)</text>
    <text x={c2} y={28} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>boiling point (°C)</text>
    {G1.map((el, i) => el.mp
      ? <g key={el.sym} fontSize="17" fontWeight="700" fill={ink} textAnchor="middle"><text x={c1} y={rowMid(i) + 6}>{el.mp}</text><text x={c2} y={rowMid(i) + 6}>{el.bp}</text></g>
      : <text key={el.sym} x={(c1 + c2) / 2} y={rowMid(i) + 5} textAnchor="middle" fontSize="13" fill={muted}>too rare to measure</text>)}
    {G1.slice(0, 5).map((_, i) => i < 4 && <path key={i} d={`M190 ${rowY(i) + COL.h + 3}H500`} stroke={panelLine} strokeWidth="1" />)}
    <Arrow x1={512} y1={50} x2={512} y2={270} colour={protonLine} width={3.5} />
    <text transform="translate(530 160) rotate(90)" textAnchor="middle" fontSize="14" fontWeight="700" fill={protonLine}>lower</text>
  </Diagram>
}
function TrendAll() {
  const rows: Array<[string, string, string, string]> = [['reactivity', 'increases', '↑', protonLine], ['melting and boiling points', 'decrease', '↓', electronLine], ['relative atomic mass', 'increases', '↑', ink]]
  return <Diagram schematic={false} title="Group 1 with relative atomic masses: lithium 7, sodium 23, potassium 39, rubidium 85, caesium 133, francium 223. Going down the group: reactivity increases, melting and boiling points decrease, and relative atomic mass increases. These patterns are called trends.">
    <Column ar />
    <Arrow x1={190} y1={50} x2={190} y2={322} colour={ink} width={3} />
    <text x={214} y={60} fontSize="15" fontWeight="700" fill={ink}>Going down Group 1:</text>
    {rows.map(([what, change, sign, colour], i) => {
      const y = 82 + i * 70
      return <g key={what}>
        <rect x={210} y={y} width={312} height={58} rx="10" fill={panelFill} stroke={colour} strokeWidth="1.8" />
        <text x={236} y={y + 40} textAnchor="middle" fontSize="26" fontWeight="700" fill={colour}>{sign}</text>
        <text x={258} y={y + 25} fontSize="14" fontWeight="700" fill={ink}>{what}</text>
        <text x={258} y={y + 45} fontSize="14" fontWeight="700" fill={colour}>{change}</text>
      </g>
    })}
    <text x={366} y={316} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>These patterns are called trends.</text>
  </Diagram>
}

// ---------- Section 3: water ----------
function Bubbles({ pts, r = 5 }: { pts: Array<[number, number]>; r?: number }) {
  return <g>{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? r + 1.5 : r} fill="white" stroke={electronLine} strokeWidth="1.4" />)}</g>
}
function Piece({ x, y, w = 36, h = 18 }: { x: number; y: number; w?: number; h?: number }) {
  return <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill={neutronFill} stroke={neutronLine} strokeWidth="1.8" />
}
function Flame({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g><path d={`M${x} ${y}C${x - 22 * s} ${y - 10 * s} ${x - 14 * s} ${y - 36 * s} ${x - 2 * s} ${y - 58 * s}C${x + 2 * s} ${y - 40 * s} ${x + 20 * s} ${y - 32 * s} ${x + 14 * s} ${y - 12 * s}C${x + 12 * s} ${y - 4 * s} ${x + 6 * s} ${y} ${x} ${y}Z`} fill={lilac} stroke={lilacLine} strokeWidth="1.8" /></g>
}
/** A glass trough of water; surface at y. */
function Trough({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="8" fill={waterFill} />
    <path d={`M${x} ${y}H${x + w}`} stroke={electronLine} strokeWidth="2" />
    <path d={`M${x} ${y - 34}V${y + h - 8}Q${x} ${y + h} ${x + 8} ${y + h}H${x + w - 8}Q${x + w} ${y + h} ${x + w} ${y + h - 8}V${y - 34}`} fill="none" stroke={shellLine} strokeWidth="3" />
  </g>
}
const SEE_BUBBLES: Array<[number, number]> = [[268, 184], [286, 172], [306, 180], [322, 168], [296, 156], [314, 148], [276, 160], [300, 138]]
function WaterSee() {
  const s = 190, px = 296
  return <Diagram title="A small piece of sodium in a trough of water. 1: it floats on the surface. 2: it moves around the surface, shown by a dashed trail. 3: it fizzes, giving off bubbles of gas.">
    <Trough x={30} y={s} w={480} h={110} />
    <path d={`M${px - 24} ${s - 2}C${px - 90} ${s + 8} ${px - 150} ${s - 8} ${px - 196} ${s + 6}`} fill="none" stroke={muted} strokeWidth="2" strokeDasharray="6 6" />
    <Bubbles pts={SEE_BUBBLES} />
    <Piece x={px} y={s + 2} />
    <Pointer n={1} x={px + 90} y={s + 64} to={[px + 16, s + 6]} />
    <Pointer n={2} x={120} y={s - 50} to={[140, s + 2]} />
    <Pointer n={3} x={px + 96} y={s - 70} to={[px + 21, s - 20]} />
    <g fontSize="14" fill={ink}>
      <Badge n={1} x={42} y={34} /><text x={60} y={39}><tspan fontWeight="700">floats</tspan> on the water</text>
      <Badge n={2} x={42} y={70} /><text x={60} y={75}><tspan fontWeight="700">moves</tspan> around the surface</text>
      <Badge n={3} x={42} y={106} /><text x={60} y={111}><tspan fontWeight="700">fizzes</tspan>: a gas is made</text>
    </g>
    <text x={270} y={330} textAnchor="middle" fontSize="12" fill={muted}>A teacher shows this with a tiny piece, behind a safety screen.</text>
  </Diagram>
}
function WaterProducts() {
  const s = 200, px = 296
  return <Diagram title="The word equation: sodium plus water gives sodium hydroxide plus hydrogen. In the trough, the bubbles are hydrogen gas and the sodium hydroxide dissolves in the water, making an alkaline solution. The general form: alkali metal plus water gives metal hydroxide plus hydrogen.">
    <rect x={20} y={14} width={500} height={82} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={270} y={46} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>sodium + water → <tspan fill={protonLine}>sodium hydroxide</tspan> + <tspan fill={electronLine}>hydrogen</tspan></text>
    <text x={270} y={76} textAnchor="middle" fontSize="13" fill={muted}>alkali metal + water → metal hydroxide + hydrogen</text>
    <Trough x={30} y={s} w={480} h={100} />
    <Bubbles pts={SEE_BUBBLES.map(([x, y]) => [x, y + 10])} />
    <Piece x={px} y={s + 2} />
    <path d={`M${px + 30} ${s - 40}L410 ${s - 62}`} stroke={ink} strokeWidth="1.5" /><circle cx={px + 30} cy={s - 40} r="2.8" fill={ink} />
    <text x={416} y={s - 58} fontSize="14" fontWeight="700" fill={electronLine}>hydrogen gas</text>
    <path d={`M150 ${s + 50}L150 ${s + 116}`} stroke={ink} strokeWidth="1.5" /><circle cx={150} cy={s + 50} r="2.8" fill={ink} />
    <text x={160} y={s + 122} fontSize="13" fill={ink}><tspan fontWeight="700" fill={protonLine}>sodium hydroxide</tspan> dissolves: an alkaline solution</text>
  </Diagram>
}
function Atomic({ x, y, kind }: { x: number; y: number; kind: 'Na' | 'O' | 'H' | 'Cl' }) {
  const look = { Na: { r: 15, fill: neutronFill, line: neutronLine, text: ink }, O: { r: 13, fill: amberFill, line: amberLine, text: amberInk }, H: { r: 9, fill: 'white', line: ink, text: ink }, Cl: { r: 15, fill: lightIso, line: lightIsoLine, text: darkIsoLine } }[kind]
  return <g><circle cx={x} cy={y} r={look.r} fill={look.fill} stroke={look.line} strokeWidth="1.8" />{kind !== 'H' ? <text x={x} y={y + 5} textAnchor="middle" fontSize="12" fontWeight="700" fill={look.text}>{kind}</text> : <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill={ink}>H</text>}</g>
}
function Plus({ x, y }: { x: number; y: number }) { return <text x={x} y={y + 7} textAnchor="middle" fontSize="22" fontWeight="700" fill={ink}>+</text> }
function Water({ x, y }: { x: number; y: number }) { return <g><Atomic x={x - 14} y={y + 14} kind="H" /><Atomic x={x + 14} y={y + 14} kind="H" /><Atomic x={x} y={y} kind="O" /></g> }
function NaOH({ x, y }: { x: number; y: number }) { return <g><Atomic x={x + 44} y={y} kind="H" /><Atomic x={x + 24} y={y} kind="O" /><Atomic x={x} y={y} kind="Na" /></g> }
function WaterEquation() {
  const y = 150
  return <Diagram viewBox="0 0 540 300" title="The balanced symbol equation 2Na + 2H2O → 2NaOH + H2, with a particle picture: two sodium atoms and two water molecules on the left; two units of sodium hydroxide and one hydrogen molecule on the right. Counting atoms: 2 sodium, 4 hydrogen and 2 oxygen on each side." schematic={false}>
    <text x={270} y={50} textAnchor="middle" fontSize="28" fontWeight="700" fill={ink}>2Na + 2H₂O → 2NaOH + H₂</text>
    <Atomic x={36} y={y - 22} kind="Na" /><Atomic x={36} y={y + 22} kind="Na" />
    <Plus x={70} y={y} />
    <Water x={110} y={y - 34} /><Water x={110} y={y + 14} />
    <Arrow x1={150} y1={y} x2={204} y2={y} colour={ink} width={3} />
    <NaOH x={236} y={y - 22} /><NaOH x={236} y={y + 22} />
    <Plus x={318} y={y} />
    <g><Atomic x={346} y={y} kind="H" /><Atomic x={364} y={y} kind="H" /></g>
    <g fontSize="13" fill={muted} textAnchor="middle"><text x={36} y={y + 58}>2 Na</text><text x={110} y={y + 58}>2 H₂O</text><text x={258} y={y + 58}>2 NaOH</text><text x={355} y={y + 58}>H₂</text></g>
    <rect x={396} y={80} width={128} height={140} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={460} y={104} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>left · right</text>
    {[['Na', '2', '2'], ['H', '4', '4'], ['O', '2', '2']].map(([el, a, b], i) => <text key={el} x={408} y={134 + i * 28} fontSize="15" fontWeight="700" fill={ink}>{el}<tspan x={466} textAnchor="middle">{a} · {b}</tspan><tspan x={512} textAnchor="end" fill={darkIsoLine}>✓</tspan></text>)}
    <text x={270} y={250} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>The same atoms on each side: the equation is balanced.</text>
    <text x={270} y={274} textAnchor="middle" fontSize="13" fill={muted}>Hydrogen gas is made of H₂ molecules, so 2 sodium atoms are needed.</text>
  </Diagram>
}
function WaterTrend() {
  const cols = [
    { name: 'lithium', x: 20, bubbles: [[88, 186], [104, 176]] as Array<[number, number]>, lines: ['fizzes steadily'], flame: false, trail: false },
    { name: 'sodium', x: 196, bubbles: [[252, 186], [268, 174], [286, 184], [296, 170], [262, 160], [280, 150]] as Array<[number, number]>, lines: ['fizzes fast,', 'moves quickly'], flame: false, trail: true },
    { name: 'potassium', x: 372, bubbles: [[424, 186], [440, 176], [470, 186], [478, 172], [432, 160], [484, 156], [418, 170]] as Array<[number, number]>, lines: ['hydrogen catches', 'fire: lilac flame'], flame: true, trail: true },
  ]
  const s = 200
  return <Diagram viewBox="0 40 540 300" title="Lithium, sodium and potassium each added to water. Lithium fizzes steadily. Sodium fizzes fast and moves quickly. Potassium reacts so vigorously that the hydrogen catches fire with a lilac flame. The reaction gets more vigorous going down the group.">
    <Arrow x1={40} y1={70} x2={500} y2={70} colour={protonLine} width={3} />
    <text x={270} y={98} textAnchor="middle" fontSize="14" fontWeight="700" fill={protonLine}>more vigorous going down the group</text>
    {cols.map(c => <g key={c.name}>
      <Trough x={c.x} y={s} w={148} h={64} />
      {c.trail && <path d={`M${c.x + 56} ${s - 2}C${c.x + 36} ${s + 6} ${c.x + 24} ${s - 6} ${c.x + 12} ${s + 4}`} fill="none" stroke={muted} strokeWidth="2" strokeDasharray="5 5" />}
      <Bubbles pts={c.bubbles} r={4} />
      {c.flame && <Flame x={c.x + 76} y={s - 8} s={1.1} />}
      <Piece x={c.x + 76} y={s + 2} w={30} h={15} />
      <text x={c.x + 74} y={s + 94} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{c.name}</text>
      {c.lines.map((l, j) => <text key={j} x={c.x + 74} y={s + 114 + j * 17} textAnchor="middle" fontSize="13" fill={ink}>{l}</text>)}
    </g>)}
  </Diagram>
}

// ---------- Section 4: chlorine and oxygen ----------
function GasJar({ dim = false }: { dim?: boolean }) {
  const x = 50, w = 130, top = 90, bottom = 310
  const specks: Array<[number, number]> = [[70, 300], [92, 302], [120, 300], [150, 302], [164, 296], [62, 250], [170, 232], [66, 196]]
  return <g opacity={dim ? faded : 1}>
    <rect x={x} y={top} width={w} height={bottom - top} rx="8" fill={lightIso} opacity=".75" />
    <path d={`M${x} ${top}V${bottom - 8}Q${x} ${bottom} ${x + 8} ${bottom}H${x + w - 8}Q${x + w} ${bottom} ${x + w} ${bottom - 8}V${top}`} fill="none" stroke={shellLine} strokeWidth="3" />
    <rect x={x - 10} y={top - 8} width={w + 20} height={10} rx="3" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <path d={`M${x + w / 2} 24V190`} stroke={ink} strokeWidth="3" />
    <path d={`M${x + w / 2 - 22} 190Q${x + w / 2} 214 ${x + w / 2 + 22} 190Z`} fill={greyFill} stroke={ink} strokeWidth="2" />
    <ellipse cx={x + w / 2} cy={193} rx={13} ry={7} fill={neutronFill} stroke={protonLine} strokeWidth="2.2" />
    {[[x + w / 2 - 24, 166], [x + w / 2 + 22, 160], [x + w / 2 - 6, 150], [x + w / 2 + 30, 180], [x + w / 2 - 34, 186]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={i % 2 ? 9 : 11} fill="white" stroke={shellLine} strokeWidth="1.5" />)}
    {specks.map(([sx, sy], i) => <rect key={i} x={sx} y={sy - 4} width={8} height={5} rx="2" fill="white" stroke={shellLine} strokeWidth="1" />)}
  </g>
}
function ChlorineReact() {
  return <Diagram title="Hot sodium on a spoon is lowered into a gas jar of pale green chlorine gas. It reacts vigorously and white clouds of solid form, settling as a white powder: sodium chloride. Word equation: sodium plus chlorine gives sodium chloride.">
    <GasJar />
    <Pointer n={1} x={30} y={262} to={[64, 240]} />
    <Pointer n={2} x={30} y={140} to={[108, 192]} />
    <Pointer n={3} x={206} y={128} to={[147, 158]} />
    <g fontSize="14" fill={ink}>
      <Badge n={1} x={240} y={40} /><text x={260} y={45}><tspan fontWeight="700" fill={darkIsoLine}>chlorine gas</tspan> (pale green)</text>
      <Badge n={2} x={240} y={76} /><text x={260} y={81}><tspan fontWeight="700">hot sodium</tspan> on a spoon</text>
      <Badge n={3} x={240} y={112} /><text x={260} y={117}><tspan fontWeight="700">white solid</tspan> forms</text>
    </g>
    <rect x={226} y={170} width={296} height={104} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={374} y={200} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>sodium + chlorine</text>
    <text x={374} y={224} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>→ <tspan fill={protonLine}>sodium chloride</tspan></text>
    <text x={374} y={254} textAnchor="middle" fontSize="13" fill={muted}>alkali metal + chlorine → metal chloride</text>
    <text x={374} y={306} textAnchor="middle" fontSize="13" fill={ink}>Metal chlorides are <tspan fontWeight="700">white salts</tspan>.</text>
  </Diagram>
}
function ChlorineEquation() {
  const y = 138
  return <Diagram viewBox="0 0 540 290" schematic={false} title="The balanced symbol equation 2Na + Cl2 → 2NaCl, with a particle picture: two sodium atoms and one chlorine molecule, made of two chlorine atoms, give two units of sodium chloride. 2 sodium and 2 chlorine on each side. Going down the group, the reaction with chlorine gets more vigorous.">
    <text x={270} y={52} textAnchor="middle" fontSize="28" fontWeight="700" fill={ink}>2Na + Cl₂ → 2NaCl</text>
    <Atomic x={100} y={y - 22} kind="Na" /><Atomic x={100} y={y + 22} kind="Na" />
    <Plus x={142} y={y} />
    <Atomic x={180} y={y} kind="Cl" /><Atomic x={208} y={y} kind="Cl" />
    <Arrow x1={244} y1={y} x2={306} y2={y} colour={ink} width={3} />
    <g><Atomic x={346} y={y - 22} kind="Na" /><Atomic x={374} y={y - 22} kind="Cl" /></g>
    <g><Atomic x={346} y={y + 22} kind="Na" /><Atomic x={374} y={y + 22} kind="Cl" /></g>
    <g fontSize="13" fill={muted} textAnchor="middle"><text x={100} y={y + 60}>2 Na</text><text x={194} y={y + 60}>Cl₂</text><text x={360} y={y + 60}>2 NaCl</text></g>
    <text x={440} y={y - 4} fontSize="15" fontWeight="700" fill={ink}>Na 2 · 2 <tspan fill={darkIsoLine}>✓</tspan></text>
    <text x={440} y={y + 20} fontSize="15" fontWeight="700" fill={ink}>Cl 2 · 2 <tspan fill={darkIsoLine}>✓</tspan></text>
    <rect x={20} y={222} width={500} height={52} rx="10" fill={glow} stroke={protonLine} strokeWidth="1.5" />
    <text x={270} y={253} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>Going down the group, this reaction gets <tspan fill={protonLine}>more vigorous</tspan>.</text>
  </Diagram>
}
function Tarnish() {
  return <Diagram viewBox="0 0 540 310" title="Left: a freshly cut piece of lithium, shiny. Right: the same piece a few minutes later, dull, because a thin layer of lithium oxide has formed on it. Lithium plus oxygen gives lithium oxide. This dulling is called tarnishing.">
    <text x={120} y={36} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>just cut</text>
    <Slice x={50} y={56} w={140} h={92} kind="fresh" />
    <text x={120} y={172} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>shiny</text>
    <Arrow x1={210} y1={102} x2={320} y2={102} colour={amberLine} width={3} />
    <text x={265} y={82} textAnchor="middle" fontSize="13" fontWeight="700" fill={amberInk}>oxygen in the air</text>
    <text x={265} y={130} textAnchor="middle" fontSize="13" fill={muted}>a few minutes</text>
    <text x={392} y={36} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>later</text>
    <Slice x={350} y={56} w={140} h={92} kind="dull" />
    <text x={420} y={172} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>dull: <tspan fill={amberInk}>tarnished</tspan></text>
    <path d={`M486 60L510 30`} stroke={ink} strokeWidth="1.5" /><circle cx={486} cy={60} r="2.8" fill={ink} />
    <text x={530} y={22} textAnchor="end" fontSize="13" fill={amberInk} fontWeight="700">thin oxide layer</text>
    <rect x={20} y={200} width={500} height={96} rx="10" fill={amberFill} stroke={amberLine} strokeWidth="1.5" />
    <text x={270} y={232} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>lithium + oxygen → <tspan fill={amberInk}>lithium oxide</tspan></text>
    <text x={270} y={258} textAnchor="middle" fontSize="13" fill={muted}>alkali metal + oxygen → metal oxide</text>
    <text x={270} y={282} textAnchor="middle" fontSize="13" fill={ink}>The dull surface is called a tarnish.</text>
  </Diagram>
}
function ReactAll() {
  const cards = [
    { head: 'water', fill: waterFill, line: electronLine, lines: ['metal hydroxide', '+ hydrogen'] },
    { head: 'chlorine', fill: '#eaf5ee', line: lightIsoLine, lines: ['metal chloride', '(a white salt)'] },
    { head: 'oxygen', fill: amberFill, line: amberLine, lines: ['metal oxide', '(a tarnish)'] },
  ]
  return <Diagram viewBox="0 0 540 300" schematic={false} title="Summary of the three reactions of an alkali metal. With water: metal hydroxide and hydrogen. With chlorine: metal chloride, a white salt. With oxygen: metal oxide, a tarnish. In every reaction the metal atom loses its one outer electron to form a 1+ ion, so the products are ionic compounds.">
    <text x={270} y={30} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>An alkali metal reacts with…</text>
    {cards.map((c, i) => {
      const x = 20 + i * 172
      return <g key={c.head}>
        <rect x={x} y={48} width={156} height={130} rx="12" fill={c.fill} stroke={c.line} strokeWidth="2" />
        <text x={x + 78} y={80} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{c.head}</text>
        <path d={`M${x + 78} 92V112`} stroke={ink} strokeWidth="2" /><path d={`M${x + 71} 106L${x + 78} 115L${x + 85} 106`} fill="none" stroke={ink} strokeWidth="2" />
        {c.lines.map((l, j) => <text key={j} x={x + 78} y={138 + j * 20} textAnchor="middle" fontSize="14" fontWeight={j ? 400 : 700} fill={ink}>{l}</text>)}
      </g>
    })}
    <rect x={20} y={200} width={500} height={86} rx="10" fill={glow} stroke={protonLine} strokeWidth="1.5" />
    <text x={270} y={230} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>Each time, the metal atom loses its 1 outer electron</text>
    <text x={270} y={252} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>and forms a <tspan fill={protonLine}>1+ ion</tspan>.</text>
    <text x={270} y={274} textAnchor="middle" fontSize="13" fill={muted}>So the products are ionic compounds.</text>
  </Diagram>
}

// ---------- On your own ----------
function WaterQuestion({ assessment }: { assessment: boolean }) {
  const s = 150, px = assessment ? 270 : 200, tx = assessment ? 50 : 20, tw = assessment ? 440 : 330
  return <Diagram viewBox="0 0 540 270" title={assessment ? 'A small piece of potassium in a trough of water, with three parts numbered 1, 2 and 3. Part 2 is a lilac flame just above the metal.' : 'A small piece of potassium in water. 1 is the potassium, floating. 2 is hydrogen gas burning with a lilac flame. 3 is the water, which now contains dissolved potassium hydroxide.'}>
    <Trough x={tx} y={s} w={tw} h={100} />
    <Bubbles pts={[[px - 30, s - 6], [px + 30, s - 8], [px - 18, s - 26], [px + 34, s - 30], [px - 40, s - 34]]} r={4.5} />
    <Flame x={px} y={s - 8} s={1.3} />
    <Piece x={px} y={s + 2} />
    <Pointer n={1} x={px + 80} y={s + 70} to={[px + 16, s + 6]} />
    <Pointer n={2} x={px - 100} y={s - 90} to={[px - 10, s - 40]} />
    <Pointer n={3} x={px - 110} y={s + 70} to={[px - 60, s + 50]} />
    {!assessment && <g fontSize="14" fill={ink}>
      <Badge n={1} x={386} y={50} /><text x={404} y={55} fontWeight="700">potassium</text>
      <Badge n={2} x={386} y={96} /><text x={404} y={92} fontWeight="700" fill={electronLine}>hydrogen</text><text x={404} y={110}>burning</text>
      <Badge n={3} x={386} y={146} /><text x={404} y={142} fontWeight="700" fill={protonLine}>potassium</text><text x={404} y={160}>hydroxide solution</text>
    </g>}
  </Diagram>
}
function DataQuestion() {
  const rows: Array<[string, string]> = [['lithium', '40'], ['sodium', '11'], ['potassium', '3']]
  return <Diagram viewBox="0 0 540 220" schematic={false} title="A table of example results. Same-sized pieces of each metal were added to water, and the time until each stopped fizzing was recorded. Lithium 40 seconds, sodium 11 seconds, potassium 3 seconds.">
    <text x={30} y={26} fontSize="14" fontWeight="700" fill={ink}>Same-sized pieces added to water (example results)</text>
    <rect x={20} y={40} width={500} height={164} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="14" fontWeight="700" fill={ink}><text x={40} y={70}>metal</text><text x={380} y={70} textAnchor="middle">time to stop fizzing (s)</text></g>
    <path d="M32 82H508" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([m, t], i) => <g key={m} fontSize="15" fill={ink}>
      <text x={40} y={116 + i * 36}>{m}</text><text x={380} y={116 + i * 36} textAnchor="middle" fontWeight="700">{t}</text>
      {i < 2 && <path d={`M32 ${128 + i * 36}H508`} stroke={panelLine} />}
    </g>)}
  </Diagram>
}

export function AlkaliVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'alk-group-table': return <GroupTable />
    case 'alk-group-electron': return <GroupElectron />
    case 'alk-group-soft': return <GroupSoft />
    case 'alk-group-light': return <GroupLight />
    case 'alk-trend-ion': return <TrendIon />
    case 'alk-trend-reactive': return <TrendReactive />
    case 'alk-trend-why': return <TrendWhy />
    case 'alk-trend-melt': return <TrendMelt />
    case 'alk-trend-all': return <TrendAll />
    case 'alk-water-see': return <WaterSee />
    case 'alk-water-products': return <WaterProducts />
    case 'alk-water-equation': return <WaterEquation />
    case 'alk-water-trend': return <WaterTrend />
    case 'alk-cl-react': return <ChlorineReact />
    case 'alk-cl-equation': return <ChlorineEquation />
    case 'alk-ox-tarnish': return <Tarnish />
    case 'alk-react-all': return <ReactAll />
    case 'alk-q-water': return <WaterQuestion assessment={assessment} />
    case 'alk-q-data': return <DataQuestion />
    default: return <GroupTable />
  }
}
