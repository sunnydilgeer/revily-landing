import { useId, type ReactNode } from 'react'
import { Arrow } from './InfectionVisuals'
import { atomPalette, Electron, Nucleus } from './AtomVisuals'

/*
 * Chemistry C1b (Chemistry Lesson 8): the modern periodic table, and metals and non-metals. Original, code-native schematics.
 * Focus ids start with 'mtab-'.
 *
 * One drawing of the whole table is reused throughout (periods 1–6, plus francium and radium; the two starred boxes stand
 * for elements 57–71 and 89–103, and the heaviest elements after radium are left out, as on the source page). Every
 * symbol sits where it really is. Colour code: amber = "look here" (the frame's idea); metals = the coral proton tint
 * (metals form positive ions); non-metals = the electron-blue tint. The staircase line splits metals from non-metals
 * (B, Si, As, Te, At on the non-metal side). Atoms reuse the Chemistry particle helpers from AtomVisuals, drawn as in
 * the electronic-structure lesson (2, then up to 8, then up to 8, then a fourth shell).
 */
const { ink, muted, protonFill, protonLine, electronLine, shellLine, space, spaceLine, glow, panelFill, panelLine } = atomPalette
const faded = 0.3
const amberFill = '#fff4e6', amberLine = '#d9a55b', amberInk = '#8a5a14'
const metalFill = glow, metalLine = '#e0a49c', metalInk = protonLine
const blueFill = '#e4f0f9', blueLine = '#8fbbe0', blueInk = electronLine
const r1 = (n: number) => Math.round(n * 10) / 10

function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Lines({ x, y, lines, anchor = 'start', size = 14, gap = 18 }: { x: number; y: number; lines: Array<[string, string?, boolean?]>; anchor?: 'start' | 'middle' | 'end'; size?: number; gap?: number }) {
  return <g>{lines.map(([text, fill = ink, bold = true], i) => <text key={i} x={x} y={y + i * gap} textAnchor={anchor} fontSize={size} fontWeight={bold ? 700 : 400} fill={fill}>{text}</text>)}</g>
}

// ---------- The table ----------
const SYMS = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr',
  'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', '*', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', '*']
type Cell = { sym: string; row: number; col: number; star: boolean }
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i)
const ROW_COLS = [[1, 18], [1, 2, ...range(13, 18)], [1, 2, ...range(13, 18)], range(1, 18), range(1, 18), range(1, 18), [1, 2, 3]]
const CELLS: Cell[] = (() => {
  const out: Cell[] = []
  let i = 0
  ROW_COLS.forEach((cols, r) => cols.forEach(col => { const sym = SYMS[i++]; out.push({ sym, row: r + 1, col, star: sym === '*' }) }))
  return out
})()
const NONMETALS = new Set(['H', 'He', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Si', 'P', 'S', 'Cl', 'Ar', 'As', 'Se', 'Br', 'Kr', 'Te', 'I', 'Xe', 'At', 'Rn'])
const isMetal = (c: Cell) => !NONMETALS.has(c.sym)
const GROUP_OF: Record<number, string> = { 1: '1', 2: '2', 13: '3', 14: '4', 15: '5', 16: '6', 17: '7', 18: '0' }
type Look = 'plain' | 'metal' | 'nonmetal' | 'hot' | 'faded' | 'blank'
const LOOK: Record<Look, { fill: string; line: string; text: string; width: number }> = {
  plain: { fill: panelFill, line: panelLine, text: ink, width: 1.2 },
  blank: { fill: 'white', line: panelLine, text: muted, width: 1.2 },
  faded: { fill: panelFill, line: panelLine, text: ink, width: 1.2 },
  metal: { fill: metalFill, line: metalLine, text: metalInk, width: 1.2 },
  nonmetal: { fill: blueFill, line: blueLine, text: blueInk, width: 1.2 },
  hot: { fill: amberFill, line: amberLine, text: amberInk, width: 2.2 },
}
type TableProps = { x0: number; y0: number; s: number; look?: (c: Cell) => Look; symbols?: boolean | ((c: Cell) => boolean); heads?: boolean; periods?: boolean | number; stair?: boolean; badges?: Record<string, number> }
const cellX = (x0: number, s: number, col: number) => x0 + (col - 1) * s
const cellY = (y0: number, s: number, row: number) => y0 + (row - 1) * s
function Table({ x0, y0, s, look = () => 'plain', symbols = true, heads = false, periods = false, stair = false, badges }: TableProps) {
  const fs = s >= 26 ? 12 : 0
  const headRow = (col: number) => (col === 1 || col === 18 ? 1 : 2)
  const stairPath = () => {
    const x = (col: number) => cellX(x0, s, col) - 1, y = (row: number) => cellY(y0, s, row) - 1
    let d = `M${x(13)} ${y(2)}`
    for (let row = 2; row <= 6; row++) { d += `V${y(row + 1)}`; if (row < 6) d += `H${x(row + 12)}` }
    return d
  }
  return <g>
    {CELLS.map(c => {
      const l = look(c), st = LOOK[l], x = cellX(x0, s, c.col), y = cellY(y0, s, c.row)
      const showSym = typeof symbols === 'function' ? symbols(c) : symbols
      return <g key={`${c.row}-${c.col}`} opacity={l === 'faded' ? faded : 1}>
        <rect x={x} y={y} width={s - 2} height={s - 2} rx={s >= 26 ? 4 : 2.5} fill={st.fill} stroke={st.line} strokeWidth={st.width} />
        {c.star && fs > 0 ? <text x={x + (s - 2) / 2} y={y + s / 2 + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={muted}>*</text>
          : showSym && fs > 0 && <text x={x + (s - 2) / 2} y={y + s / 2 + 3} textAnchor="middle" fontSize={fs} fontWeight="700" fill={st.text}>{c.sym}</text>}
        {badges?.[`${c.row}-${c.col}`] !== undefined && <g>
          <circle cx={x + (s - 2) / 2} cy={y + (s - 2) / 2} r={s / 2 - 2} fill="white" stroke={ink} strokeWidth="2" />
          <text x={x + (s - 2) / 2} y={y + (s - 2) / 2 + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{badges[`${c.row}-${c.col}`]}</text>
        </g>}
      </g>
    })}
    {heads && Object.entries(GROUP_OF).map(([col, g]) => <text key={col} x={cellX(x0, s, +col) + (s - 2) / 2} y={cellY(y0, s, headRow(+col)) - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill={ink}>{g}</text>)}
    {periods !== false && range(1, 7).map(p => <text key={p} x={x0 - 9} y={cellY(y0, s, p) + s / 2 + 3} textAnchor="middle" fontSize="12" fontWeight="700" fill={periods === p ? amberInk : muted}>{p}</text>)}
    {stair && <path d={stairPath()} fill="none" stroke={ink} strokeWidth="3" />}
  </g>
}

// Section 1: the layout of the whole table
const T = { x0: 40, y0: 52, s: 27 }
const NOTCH_X = cellX(T.x0, T.s, 3) + 4, NOTCH_W = 10 * T.s - 8
function StarNote({ y }: { y: number }) {
  return <text x={526} y={y} textAnchor="end" fontSize="12" fill={muted}>* each starred box stands for 15 more elements</text>
}
const STRIP: Array<[string, number]> = [['Li', 3], ['Be', 4], ['B', 5], ['C', 6], ['N', 7], ['O', 8], ['F', 9], ['Ne', 10]]
function Order() {
  const row2 = (c: Cell) => c.row === 2
  const tw = 44, step = 50, sx = 40
  return <Diagram viewBox="0 0 540 350" schematic={false} title="The modern periodic table with about 100 elements, each in its own box, in order of atomic number. Row 2 is highlighted: lithium 3, beryllium 4, boron 5, carbon 6, nitrogen 7, oxygen 8, fluorine 9, neon 10. Sodium, 11, starts the next row. Heaviest elements after radium are not shown.">
    <text x={12} y={24} fontSize="15" fontWeight="700" fill={ink}>The modern periodic table</text>
    <Table {...T} look={c => (row2(c) ? 'hot' : 'plain')} />
    <Lines x={NOTCH_X + NOTCH_W / 2} y={T.y0 + 22} anchor="middle" lines={[['about 100 elements,'], ['one box each, in order'], ['of atomic number']]} />
    <StarNote y={T.y0 + 7 * T.s + 16} />
    <text x={sx} y={272} fontSize="14" fontWeight="700" fill={amberInk}>row 2, read from left to right:</text>
    {STRIP.map(([sym, z], i) => <g key={sym}>
      <rect x={sx + i * step} y={284} width={tw} height={48} rx="6" fill={amberFill} stroke={amberLine} strokeWidth="1.8" />
      <text x={sx + i * step + tw / 2} y={306} textAnchor="middle" fontSize="16" fontWeight="700" fill={amberInk}>{sym}</text>
      <text x={sx + i * step + tw / 2} y={324} textAnchor="middle" fontSize="12" fontWeight="700" fill={ink}>{z}</text>
    </g>)}
    <Arrow x1={sx + 8 * step - 2} y1={308} x2={sx + 8 * step + 26} y2={308} colour={ink} width={2} />
    <Lines x={sx + 8 * step + 32} y={304} lines={[['Na 11'], ['next row', muted, false]]} size={13} gap={16} />
  </Diagram>
}

function ElementBox({ x, y, top, sym, name, bottom, w = 150, h = 176 }: { x: number; y: number; top: string; sym: string; name: string; bottom: string; w?: number; h?: number }) {
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="10" fill={amberFill} stroke={amberLine} strokeWidth="2.2" />
    <text x={x + 16} y={y + 34} fontSize="24" fontWeight="700" fill={ink}>{top}</text>
    <text x={x + w / 2} y={y + 100} textAnchor="middle" fontSize="52" fontWeight="700" fill={amberInk}>{sym}</text>
    <text x={x + w / 2} y={y + 124} textAnchor="middle" fontSize="15" fill={ink}>{name}</text>
    <text x={x + 16} y={y + h - 14} fontSize="24" fontWeight="700" fill={ink}>{bottom}</text>
  </g>
}
function Pointer({ n, x, y, to }: { n: number; x: number; y: number; to: [number, number] }) {
  const angle = Math.atan2(to[1] - y, to[0] - x)
  return <g><path d={`M${r1(x + Math.cos(angle) * 13)} ${r1(y + Math.sin(angle) * 13)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
    <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}
function Leader({ from, to, lines }: { from: [number, number]; to: [number, number]; lines: Array<[string, string?, boolean?]> }) {
  return <g>
    <path d={`M${from[0]} ${from[1]}L${to[0] + 8} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={from[0]} cy={from[1]} r="2.8" fill={ink} />
    <Lines x={to[0] + 14} y={to[1] + 5} lines={lines} />
  </g>
}
function BoxDiagram() {
  const x = 60, y = 40
  return <Diagram viewBox="0 0 540 270" schematic={false} title="The box for sodium, enlarged. The number at the top, 23, is the relative atomic mass. The symbol Na and the name sodium are in the middle. The number at the bottom, 11, is the atomic number, the number of protons.">
    <ElementBox x={x} y={y} top="23" sym="Na" name="sodium" bottom="11" />
    <Leader from={[x + 50, y + 26]} to={[250, y + 26]} lines={[['relative atomic mass'], ['average mass of its atoms', muted, false]]} />
    <Leader from={[x + 120, y + 84]} to={[250, y + 98]} lines={[['symbol and name']]} />
    <Leader from={[x + 50, y + 154]} to={[250, y + 154]} lines={[['atomic number', amberInk], ['number of protons: the order', muted, false], ['of the table', muted, false]]} />
    <text x={270} y={256} textAnchor="middle" fontSize="13" fill={muted}>Sodium is element 11: the 11th box in the table.</text>
  </Diagram>
}
function BoxQuestion({ assessment }: { assessment: boolean }) {
  const x = assessment ? 220 : 150, y = 30
  return <Diagram viewBox="0 0 540 240" schematic={false} title={assessment ? 'The periodic table box for magnesium, Mg. Pointer 1 marks the number 24 at the top. Pointer 2 marks the number 12 at the bottom.' : 'The periodic table box for magnesium. The top number, 24, is the relative atomic mass. The bottom number, 12, is the atomic number.'}>
    <ElementBox x={x} y={y} top="24" sym="Mg" name="magnesium" bottom="12" />
    <Pointer n={1} x={x - 50} y={y + 26} to={[x + 12, y + 26]} />
    <Pointer n={2} x={x - 50} y={y + 154} to={[x + 12, y + 154]} />
    {!assessment && <Lines x={x + 180} y={y + 60} lines={[['1 relative atomic mass'], ['2 atomic number', amberInk]]} gap={22} />}
  </Diagram>
}
function Periods() {
  const y3 = cellY(T.y0, T.s, 3) + T.s / 2 - 1
  return <Diagram viewBox="0 0 540 290" schematic={false} title="The periodic table with its seven rows numbered 1 to 7 down the left side. Row 3, sodium to argon, is highlighted: a row is called a period, so sodium is in period 3.">
    <text x={12} y={24} fontSize="15" fontWeight="700" fill={ink}>Rows go across</text>
    <Table {...T} look={c => (c.row === 3 ? 'hot' : 'plain')} periods={3} />
    <path d={`M${cellX(T.x0, T.s, 3) + 4} ${y3}H${cellX(T.x0, T.s, 13) - 6}`} stroke={amberLine} strokeWidth="3" strokeDasharray="2 7" />
    <Lines x={NOTCH_X + NOTCH_W / 2} y={T.y0 + 18} anchor="middle" lines={[['a row = a period', amberInk], ['7 periods', ink, false]]} />
    <StarNote y={T.y0 + 7 * T.s + 16} />
    <text x={270} y={276} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>Sodium (Na) is in the third row, so it is in period 3.</text>
  </Diagram>
}
const inGroup1 = (c: Cell) => c.col === 1 && c.row >= 2
function Groups() {
  const numbered = (c: Cell) => GROUP_OF[c.col] !== undefined
  return <Diagram viewBox="0 0 540 290" schematic={false} title="The periodic table with group numbers above the columns: 1 and 2 on the left, then 3, 4, 5, 6, 7 and 0 on the right. The wide middle block has no group numbers. The Group 1 column, lithium to francium, is highlighted: a column of similar elements is a group.">
    <text x={12} y={24} fontSize="15" fontWeight="700" fill={ink}>Columns go down</text>
    <text x={526} y={24} textAnchor="end" fontSize="12" fill={muted}>group numbers along the top</text>
    <Table {...T} look={c => (inGroup1(c) ? 'hot' : numbered(c) ? 'plain' : 'faded')} heads />
    <Lines x={NOTCH_X + NOTCH_W / 2} y={T.y0 + 18} anchor="middle" lines={[['a column = a group', amberInk], ['similar elements', ink, false]]} />
    <text x={cellX(T.x0, T.s, 8.5)} y={cellY(T.y0, T.s, 7) + 18} textAnchor="middle" fontSize="12" fill={muted}>middle block: no group number</text>
    <text x={270} y={276} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>Group 1: lithium, sodium, potassium, rubidium, caesium, francium</text>
  </Diagram>
}
function Repeat() {
  const look = (c: Cell): Look => (c.row >= 2 && c.row <= 6 ? (c.col === 1 ? 'metal' : c.col === 18 ? 'nonmetal' : 'plain') : 'plain')
  return <Diagram viewBox="0 0 540 300" schematic={false} title="The periodic table. In rows 2 to 6, the first box (lithium, sodium, potassium, rubidium, caesium) is a very reactive metal and the last box (neon, argon, krypton, xenon, radon) is an unreactive gas. The same pattern repeats row after row: it is periodic.">
    <text x={12} y={24} fontSize="15" fontWeight="700" fill={ink}>A pattern that repeats</text>
    <Table {...T} look={look} periods />
    <Lines x={NOTCH_X + NOTCH_W / 2} y={T.y0 + 18} anchor="middle" lines={[['each row, 2 to 6:'], ['starts: very reactive metal', metalInk], ['ends: unreactive gas', blueInk]]} />
    <StarNote y={T.y0 + 7 * T.s + 16} />
    <text x={270} y={272} textAnchor="middle" fontSize="14" fontWeight="700" fill={amberInk}>The pattern repeats row after row: it is periodic.</text>
  </Diagram>
}

// ---------- Atoms (Section 2 onwards) ----------
const ATOMS = {
  He: { name: 'helium', z: 2, n: 2 }, Li: { name: 'lithium', z: 3, n: 4 }, Ne: { name: 'neon', z: 10, n: 10 }, Na: { name: 'sodium', z: 11, n: 12 },
  Cl: { name: 'chlorine', z: 17, n: 18 }, Ar: { name: 'argon', z: 18, n: 22 }, K: { name: 'potassium', z: 19, n: 20 },
} as const
type Sym = keyof typeof ATOMS
function structure(z: number) {
  const shells: number[] = []
  let left = z
  for (const cap of [2, 8, 8, 2]) { if (left <= 0) break; const k = Math.min(cap, left); shells.push(k); left -= k }
  return shells
}
const START = [180, -90, -45, -90]
const RADII = [17, 31, 45, 59]
/** A Bohr atom in the electronic-structure lesson's style. `show` overrides the electrons drawn (e.g. an ion). */
function Bohr({ cx, cy, sym, radii = RADII, er = 5, outer = false, hotLast = false, show, empty = 0 }: { cx: number; cy: number; sym: Sym; radii?: number[]; er?: number; outer?: boolean; hotLast?: boolean; show?: number[]; empty?: number }) {
  const el = ATOMS[sym], counts = show ?? structure(el.z), shellCount = counts.length
  const total = el.z + el.n
  const nr = Math.min(er * 1.25, (radii[0] - er - 3) / (1.1 * Math.sqrt(Math.max(total - 0.7, .3)) + 1.7))
  const last = shellCount - 1
  return <g>
    <circle cx={cx} cy={cy} r={r1(radii[last] + er + 7)} fill={space} stroke={spaceLine} strokeWidth="1.5" />
    {counts.map((_, i) => <circle key={`s${i}`} cx={cx} cy={cy} r={radii[i]} fill="none" stroke={outer && i === last ? electronLine : shellLine} strokeWidth={outer && i === last ? 3 : 1.8} />)}
    {counts.map((count, s) => {
      const places = s === last ? count + empty : count
      return Array.from({ length: places }, (_, j) => {
        const a = (START[s] + j * 360 / places) * Math.PI / 180, x = cx + Math.cos(a) * radii[s], y = cy + Math.sin(a) * radii[s]
        if (j >= count) return <circle key={`${s}-${j}`} cx={r1(x)} cy={r1(y)} r={er} fill="white" stroke={electronLine} strokeWidth="1.5" strokeDasharray="3 3" />
        return <g key={`${s}-${j}`}>
          {hotLast && s === last && <circle cx={r1(x)} cy={r1(y)} r={er + 5} fill={amberFill} stroke={amberLine} strokeWidth="1.5" />}
          <Electron x={x} y={y} r={er} sign={false} />
        </g>
      })
    })}
    <Nucleus cx={cx} cy={cy} protons={el.z} neutrons={el.n} r={r1(nr)} mode="full" signs={false} />
  </g>
}
function Structure({ x, y, shells, hot = 'last', size = 18 }: { x: number; y: number; shells: number[]; hot?: 'last' | 'none'; size?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={size} fontWeight="700" fill={ink}>
    {shells.map((n, i) => <tspan key={i} fill={hot === 'last' && i === shells.length - 1 ? amberInk : ink}>{i ? ',' : ''}{n}</tspan>)}
  </text>
}

const G1: Sym[] = ['Li', 'Na', 'K']
function GroupOneAtoms({ mode }: { mode: 'outer' | 'shells' }) {
  const xs = [90, 270, 450], cy = 124
  const outer = mode === 'outer'
  return <Diagram viewBox="0 0 540 300" title={outer
    ? 'Three Group 1 atoms. Lithium 2,1, sodium 2,8,1 and potassium 2,8,8,1. Each has one electron in its outer shell, highlighted. So they are in Group 1.'
    : 'The same three atoms. Lithium has electrons in 2 shells and is in period 2. Sodium has 3 shells and is in period 3. Potassium has 4 shells and is in period 4.'}>
    <text x={270} y={26} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{outer ? 'Three elements in Group 1' : 'Count the shells'}</text>
    {G1.map((sym, i) => {
      const shells = structure(ATOMS[sym].z)
      return <g key={sym}>
        <Bohr cx={xs[i]} cy={cy} sym={sym} outer={outer} hotLast={outer} />
        <text x={xs[i]} y={222} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{ATOMS[sym].name}</text>
        {outer ? <Structure x={xs[i]} y={246} shells={shells} />
          : <g><text x={xs[i]} y={246} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{shells.length} shells</text>
            <text x={xs[i]} y={268} textAnchor="middle" fontSize="15" fontWeight="700" fill={amberInk}>period {shells.length}</text></g>}
      </g>
    })}
    {outer && <text x={270} y={284} textAnchor="middle" fontSize="14" fontWeight="700" fill={amberInk}>1 electron in the outer shell → Group 1</text>}
  </Diagram>
}

const P2: Array<[string, number[], string]> = [['Li', [2, 1], '1'], ['Be', [2, 2], '2'], ['B', [2, 3], '3'], ['C', [2, 4], '4'], ['N', [2, 5], '5'], ['O', [2, 6], '6'], ['F', [2, 7], '7'], ['Ne', [2, 8], '0']]
function PeriodTwo() {
  const w = 56, step = 64, x0 = 16
  return <Diagram viewBox="0 0 540 300" schematic={false} title="Period 2 from lithium to neon, with each element's group and electronic structure. Lithium, Group 1, 2,1. Beryllium, Group 2, 2,2. Boron, Group 3, 2,3. Carbon, Group 4, 2,4, highlighted. Nitrogen, Group 5, 2,5. Oxygen, Group 6, 2,6. Fluorine, Group 7, 2,7. Neon, Group 0, 2,8. The outer shell gains one electron each step.">
    <text x={270} y={22} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>group number</text>
    {P2.map(([sym, shells, g], i) => {
      const x = x0 + i * step, cx = x + w / 2, hot = sym === 'C', ne = sym === 'Ne'
      const outer = shells[1]
      return <g key={sym}>
        <text x={cx} y={48} textAnchor="middle" fontSize="16" fontWeight="700" fill={hot ? amberInk : ink}>{g}</text>
        <rect x={x} y={60} width={w} height={52} rx="7" fill={hot ? amberFill : panelFill} stroke={hot ? amberLine : panelLine} strokeWidth={hot ? 2.2 : 1.6} />
        <text x={cx} y={93} textAnchor="middle" fontSize="20" fontWeight="700" fill={hot ? amberInk : ink}>{sym}</text>
        <Structure x={cx} y={136} shells={shells} size={15} />
        {Array.from({ length: outer }, (_, j) => <Electron key={j} x={cx - 9 + (j % 2) * 18} y={160 + Math.floor(j / 2) * 18} r={6} sign={false} icon />)}
        <text x={cx} y={250} textAnchor="middle" fontSize="15" fontWeight="700" fill={ne ? muted : amberInk}>{outer}</text>
      </g>
    })}
    <text x={16} y={276} fontSize="13" fill={muted}>outer-shell electrons (neon: a full outer shell)</text>
  </Diagram>
}

const G0: Sym[] = ['He', 'Ne', 'Ar']
function GroupZero() {
  const xs = [90, 270, 450], cy = 110
  const labels = ['2: one shell, full', '8 in the outer shell', '8 in the outer shell']
  return <Diagram viewBox="0 0 540 290" title="Three Group 0 atoms, each with a full outer shell, highlighted. Helium 2: it has only one shell, which is full with 2 electrons. Neon 2,8 and argon 2,8,8 each have 8 electrons in the outer shell.">
    <text x={270} y={24} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>Group 0: a full outer shell</text>
    {G0.map((sym, i) => <g key={sym}>
      <Bohr cx={xs[i]} cy={cy + 8} sym={sym} outer />
      <text x={xs[i]} y={214} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{ATOMS[sym].name}</text>
      <Structure x={xs[i]} y={238} shells={structure(ATOMS[sym].z)} hot="none" />
      <text x={xs[i]} y={262} textAnchor="middle" fontSize="13" fontWeight="700" fill={blueInk}>{labels[i]}</text>
    </g>)}
  </Diagram>
}
function Chlorine() {
  const s = 15, x0 = 262, y0 = 58
  return <Diagram viewBox="0 0 540 290" title="A chlorine atom, 2,8,7, with 7 electrons in its outer shell and electrons in 3 shells. Beside it, a small periodic table with chlorine highlighted in Group 7, period 3.">
    <Bohr cx={120} cy={126} sym="Cl" outer hotLast />
    <text x={120} y={226} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>chlorine</text>
    <Structure x={120} y={250} shells={[2, 8, 7]} />
    <Table x0={x0} y0={y0} s={s} symbols={false} look={c => (c.row === 3 && c.col === 17 ? 'hot' : 'plain')} />
    <text x={cellX(x0, s, 17) + 6} y={y0 - 8} textAnchor="middle" fontSize="12" fontWeight="700" fill={amberInk}>7</text>
    <text x={x0 - 9} y={cellY(y0, s, 3) + 11} textAnchor="middle" fontSize="12" fontWeight="700" fill={amberInk}>3</text>
    <Lines x={262} y={196} lines={[['7 outer electrons → Group 7', amberInk], ['3 shells → period 3', amberInk]]} gap={22} />
    <text x={262} y={256} fontSize="13" fill={muted}>group and period give 2,8,7</text>
  </Diagram>
}

// ---------- Section 3: predicting down Group 1 ----------
const COLUMN: Array<[string, string]> = [['Li', 'lithium'], ['Na', 'sodium'], ['K', 'potassium'], ['Rb', 'rubidium'], ['Cs', 'caesium'], ['Fr', 'francium']]
type ColStage = 'similar' | 'predict' | 'trend' | 'next'
function Bubbles({ x, y, n }: { x: number; y: number; n: number }) {
  const spots = [[0, 0], [12, -6], [22, 2], [6, -14], [30, -10], [18, -18], [36, -2], [28, -22], [42, -14]]
  return <g>{spots.slice(0, n).map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r={i % 2 ? 4 : 5} fill="white" stroke={electronLine} strokeWidth="1.5" />)}</g>
}
function GroupColumn({ stage }: { stage: ColStage }) {
  const x = 40, w = 70, h = 38, step = 44, y0 = 40
  const on = (i: number) => stage === 'similar' || (stage === 'predict' && i <= 2) || (stage === 'trend' && i <= 2) || (stage === 'next' && i <= 3)
  const titles: Record<ColStage, string> = {
    similar: 'Group 1 drawn as a column: lithium, sodium, potassium, rubidium, caesium, francium. Each has one electron in its outer shell. All are metals and they react in similar ways.',
    predict: 'Group 1 column. Sodium is known to react with water, making hydrogen. Arrows from sodium to lithium and potassium show the prediction that they react with water too.',
    trend: 'Group 1 column with lithium, sodium and potassium. Bubbles beside each show the reaction with water: a few for lithium, more for sodium, many for potassium. A downward arrow: the reaction gets more violent down the group.',
    next: 'Group 1 column. Beside rubidium, below potassium, a question mark and the prediction: rubidium should react with water even more violently than potassium.',
  }
  return <Diagram viewBox="0 0 540 320" schematic={false} title={titles[stage]}>
    <text x={x} y={26} fontSize="15" fontWeight="700" fill={ink}>Group 1</text>
    {COLUMN.map(([sym, name], i) => {
      const y = y0 + i * step, hot = (stage === 'predict' && i === 1) || (stage === 'next' && i === 3)
      return <g key={sym} opacity={on(i) ? 1 : faded}>
        <rect x={x} y={y} width={w} height={h} rx="7" fill={hot ? amberFill : metalFill} stroke={hot ? amberLine : metalLine} strokeWidth={hot ? 2.4 : 1.6} />
        <text x={x + 22} y={y + 25} textAnchor="middle" fontSize="18" fontWeight="700" fill={hot ? amberInk : metalInk}>{sym}</text>
        <Electron x={x + 52} y={y + h / 2} r={7} sign={false} icon />
        <text x={x + w + 12} y={y + 24} fontSize="14" fontWeight="700" fill={ink}>{name}</text>
      </g>
    })}
    {stage === 'similar' && <g>
      <Lines x={312} y={70} lines={[['every element:'], ['1 outer electron', blueInk], [''], ['all are metals', metalInk], ['all react in similar ways', amberInk]]} gap={22} />
      <Electron x={298} y={87} r={6} sign={false} icon />
    </g>}
    {stage === 'predict' && <g>
      <rect x={290} y={62} width={236} height={60} rx="10" fill={amberFill} stroke={amberLine} strokeWidth="1.5" />
      <Lines x={302} y={86} lines={[['known: sodium reacts with', amberInk], ['water, making hydrogen', amberInk]]} />
      <path d={`M${x + w + 90} ${y0 + step + 20}C${x + w + 150} ${y0 + step - 10} ${x + w + 150} ${y0 + 10} ${x + w + 94} ${y0 + 16}`} fill="none" stroke={ink} strokeWidth="2" strokeDasharray="6 5" />
      <Arrow x1={x + w + 100} y1={y0 + 17} x2={x + w + 84} y2={y0 + 19} colour={ink} width={2} />
      <path d={`M${x + w + 90} ${y0 + step + 22}C${x + w + 150} ${y0 + step + 40} ${x + w + 150} ${y0 + 2 * step + 10} ${x + w + 110} ${y0 + 2 * step + 18}`} fill="none" stroke={ink} strokeWidth="2" strokeDasharray="6 5" />
      <Arrow x1={x + w + 116} y1={y0 + 2 * step + 17} x2={x + w + 100} y2={y0 + 2 * step + 20} colour={ink} width={2} />
      <Lines x={302} y={170} lines={[['predict: lithium and'], ['potassium react with'], ['water too']]} />
    </g>}
    {(stage === 'trend' || stage === 'next') && <g>
      {[2, 5, 9].map((n, i) => <Bubbles key={i} x={260} y={y0 + i * step + 26} n={n} />)}
      <Arrow x1={336} y1={y0 + 4} x2={336} y2={y0 + 2 * step + h + (stage === 'next' ? step : 0)} colour={amberLine} width={3} />
      <Lines x={352} y={y0 + 30} lines={[['reaction with water', amberInk], ['gets more violent', amberInk], ['down the group', amberInk]]} />
    </g>}
    {stage === 'next' && <g>
      <text x={272} y={y0 + 3 * step + 27} textAnchor="middle" fontSize="24" fontWeight="700" fill={amberInk}>?</text>
      <rect x={352} y={y0 + 3 * step - 14} width={174} height={66} rx="10" fill={amberFill} stroke={amberLine} strokeWidth="1.5" />
      <Lines x={362} y={y0 + 3 * step + 8} lines={[['prediction: even', amberInk], ['more violent than', amberInk], ['potassium', amberInk]]} gap={17} />
    </g>}
    <text x={x} y={308} fontSize="12" fill={muted}>{stage === 'similar' ? 'The blue dot beside each symbol is its 1 outer electron.' : 'Group 1 reactions with water are only shown as teacher demonstrations.'}</text>
  </Diagram>
}
const MELT: Array<[string, string, number | null]> = [['Li', 'lithium', 181], ['Na', 'sodium', 98], ['K', 'potassium', 63], ['Rb', 'rubidium', null]]
function MeltData({ assessment }: { assessment: boolean }) {
  const x0 = 250, scale = 1.25
  return <Diagram viewBox="0 0 540 250" schematic={false} title={assessment ? 'Melting points of Group 1 elements, top to bottom: lithium 181 °C, sodium 98 °C, potassium 63 °C, rubidium unknown, shown as a question mark.' : 'Melting points down Group 1: lithium 181 °C, sodium 98 °C, potassium 63 °C, rubidium 39 °C. They fall down the group.'}>
    <text x={20} y={26} fontSize="14" fontWeight="700" fill={ink}>Group 1, top to bottom</text>
    <text x={x0} y={26} fontSize="14" fontWeight="700" fill={ink}>melting point (°C)</text>
    {MELT.map(([sym, name, mp], i) => {
      const y = 44 + i * 48, val = mp ?? (assessment ? null : 39)
      return <g key={sym}>
        <rect x={20} y={y} width={58} height={36} rx="7" fill={metalFill} stroke={metalLine} strokeWidth="1.6" />
        <text x={49} y={y + 24} textAnchor="middle" fontSize="17" fontWeight="700" fill={metalInk}>{sym}</text>
        <text x={92} y={y + 23} fontSize="14" fontWeight="700" fill={ink}>{name}</text>
        {val !== null ? <g>
          <rect x={x0} y={y + 6} width={val * scale} height={24} rx="4" fill={mp === null ? amberFill : metalFill} stroke={mp === null ? amberLine : metalLine} strokeWidth="1.6" />
          <text x={x0 + val * scale + 8} y={y + 23} fontSize="14" fontWeight="700" fill={mp === null ? amberInk : ink}>{val}</text>
        </g> : <text x={x0 + 4} y={y + 24} fontSize="20" fontWeight="700" fill={amberInk}>?</text>}
      </g>
    })}
  </Diagram>
}

// ---------- Section 4: metals and non-metals on the table ----------
function MetalsTable({ stage }: { stage: 'metals' | 'nonmetals' }) {
  const both = stage === 'nonmetals'
  const look = (c: Cell): Look => (isMetal(c) ? 'metal' : both ? 'nonmetal' : 'blank')
  return <Diagram viewBox="0 0 540 290" schematic={false} title={both
    ? 'The periodic table with metals shaded coral and non-metals shaded blue. A thick staircase line separates them. The non-metals are at the top right: boron, carbon, nitrogen, oxygen, fluorine, neon, silicon, phosphorus, sulfur, chlorine, argon and the elements below them to the right of the line. Hydrogen, at the top left, is also a non-metal.'
    : 'The periodic table with the metals shaded coral. They fill the left of the table and the bottom. Most elements are metals. The boxes at the top right are left white.'}>
    <text x={12} y={24} fontSize="15" fontWeight="700" fill={both ? blueInk : metalInk}>{both ? 'Non-metals: top right' : 'Metals: left and towards the bottom'}</text>
    <Table {...T} look={look} stair={both} />
    <Lines x={NOTCH_X + NOTCH_W / 2} y={T.y0 + 18} anchor="middle" lines={both ? [['staircase line:'], ['metals ← | → non-metals']] : [['most elements', metalInk], ['are metals', metalInk]]} />
    <StarNote y={T.y0 + 7 * T.s + 16} />
    <g>
      <rect x={40} y={258} width={22} height={18} rx="3" fill={metalFill} stroke={metalLine} />
      <text x={70} y={272} fontSize="13" fontWeight="700" fill={metalInk}>metal</text>
      {both && <g><rect x={130} y={258} width={22} height={18} rx="3" fill={blueFill} stroke={blueLine} />
        <text x={160} y={272} fontSize="13" fontWeight="700" fill={blueInk}>non-metal (hydrogen too)</text></g>}
    </g>
  </Diagram>
}
function Bracket({ x, y, w, h, charge }: { x: number; y: number; w: number; h: number; charge: string }) {
  return <g fill="none" stroke={ink} strokeWidth="2.5">
    <path d={`M${x + 10} ${y}H${x}V${y + h}H${x + 10}`} /><path d={`M${x + w - 10} ${y}H${x + w}V${y + h}H${x + w - 10}`} />
    <text x={x + w + 6} y={y + 14} fontSize="20" fontWeight="700" fill={protonLine} stroke="none">{charge}</text>
  </g>
}
function LoseElectron() {
  return <Diagram viewBox="0 0 540 300" title="A sodium atom, 2,8,1, with 11 protons and 11 electrons, loses its one outer electron. It becomes a sodium ion, 2,8, in square brackets with a plus charge: 11 protons and 10 electrons, with a full outer shell. A positive ion.">
    <Bohr cx={110} cy={130} sym="Na" hotLast outer />
    <text x={110} y={230} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>sodium atom</text>
    <Structure x={110} y={252} shells={[2, 8, 1]} size={15} />
    <text x={110} y={274} textAnchor="middle" fontSize="13" fill={muted}>11 protons, 11 electrons</text>
    <Arrow x1={200} y1={130} x2={290} y2={130} colour={ink} width={2.5} />
    <text x={245} y={116} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>loses 1</text>
    <path d="M146 92Q200 40 250 58" fill="none" stroke={electronLine} strokeWidth="2" strokeDasharray="5 5" />
    <Electron x={258} y={62} r={6} sign={false} icon />
    <Bohr cx={405} cy={130} sym="Na" show={[2, 8]} />
    <Bracket x={335} y={66} w={140} h={128} charge="+" />
    <text x={405} y={230} textAnchor="middle" fontSize="15" fontWeight="700" fill={protonLine}>sodium ion: positive</text>
    <Structure x={405} y={252} shells={[2, 8]} size={15} hot="none" />
    <text x={405} y={274} textAnchor="middle" fontSize="13" fill={muted}>11 protons, 10 electrons</text>
  </Diagram>
}
function GainElectron() {
  return <Diagram viewBox="0 0 540 290" title="A chlorine atom, 2,8,7. Its outer shell has 7 electrons and one empty place, drawn dashed. An electron arrives to fill it, giving a full outer shell. Non-metals gain or share electrons; they do not usually form positive ions.">
    <Bohr cx={140} cy={128} sym="Cl" outer empty={1} />
    <Electron x={236} y={36} r={6} sign={false} icon />
    <path d="M228 38Q180 36 158 64" fill="none" stroke={electronLine} strokeWidth="2" strokeDasharray="5 5" />
    <Arrow x1={160} y1={61} x2={150} y2={74} colour={electronLine} width={2} />
    <text x={140} y={226} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>chlorine</text>
    <Structure x={140} y={250} shells={[2, 8, 7]} size={15} />
    <Lines x={290} y={112} lines={[['7 outer electrons:'], ['1 more fills the shell', blueInk], [''], ['non-metals gain or', blueInk], ['share electrons', blueInk], [''], ['they do not usually', protonLine], ['form positive ions', protonLine]]} gap={19} />
  </Diagram>
}
function Sides() {
  const s = 20, x0 = 90, y0 = 30
  return <Diagram viewBox="0 0 540 300" schematic={false} title="A small periodic table with metals shaded coral on the left and bottom and non-metals shaded blue at the top right, split by the staircase line. Metals: few outer electrons, lose them, form positive ions. Non-metals: gain or share electrons to get a full outer shell.">
    <Table x0={x0} y0={y0} s={s} symbols={false} look={c => (isMetal(c) ? 'metal' : 'nonmetal')} stair />
    <rect x={14} y={188} width={250} height={96} rx="10" fill={metalFill} stroke={metalLine} strokeWidth="1.5" />
    <Lines x={28} y={214} lines={[['metals (left)', metalInk], ['few outer electrons', ink, false], ['lose them easily', ink, false], ['→ positive ions', metalInk]]} gap={19} />
    <rect x={276} y={188} width={250} height={96} rx="10" fill={blueFill} stroke={blueLine} strokeWidth="1.5" />
    <Lines x={290} y={214} lines={[['non-metals (right)', blueInk], ['more outer electrons', ink, false], ['gain or share electrons', ink, false], ['→ full outer shell', blueInk]]} gap={19} />
  </Diagram>
}

// ---------- Section 5: properties ----------
type PropStage = 'strong' | 'conduct' | 'melt' | 'brittle' | 'other' | 'all'
function Icon({ kind, x, y }: { kind: string; x: number; y: number }) {
  switch (kind) {
    case 'bend': return <path d={`M${x} ${y + 30}Q${x + 20} ${y - 6} ${x + 40} ${y + 30}`} fill="none" stroke={metalLine} strokeWidth="9" />
    case 'bulb': case 'bulbOff': {
      const lit = kind === 'bulb'
      return <g>
        {lit && <path d={`M${x + 20} ${y - 4}V${y + 1}M${x + 4} ${y + 4}L${x + 8} ${y + 8}M${x + 36} ${y + 4}L${x + 32} ${y + 8}`} stroke={amberLine} strokeWidth="2" />}
        <circle cx={x + 20} cy={y + 18} r="11" fill={lit ? '#ffe7a8' : 'white'} stroke={lit ? amberLine : muted} strokeWidth="1.8" />
        <rect x={x + 14} y={y + 29} width={12} height={8} rx="2" fill={panelLine} stroke={muted} strokeWidth="1.2" />
      </g>
    }
    case 'hot': return <g>
      <rect x={x + 14} y={y} width={12} height={30} rx="6" fill="white" stroke={muted} strokeWidth="1.6" />
      <circle cx={x + 20} cy={y + 34} r="7" fill={protonFill} stroke={protonLine} strokeWidth="1.5" />
      <rect x={x + 17} y={y + 5} width={6} height={28} rx="3" fill={protonFill} />
    </g>
    case 'break': return <g fill="#fbf1c7" stroke="#b59a2e" strokeWidth="1.6">
      <path d={`M${x} ${y + 12}L${x + 17} ${y + 8}L${x + 14} ${y + 18}L${x + 19} ${y + 30}L${x + 2} ${y + 32}Z`} />
      <path d={`M${x + 23} ${y + 6}L${x + 40} ${y + 10}L${x + 38} ${y + 30}L${x + 25} ${y + 31}L${x + 20} ${y + 19}Z`} />
    </g>
    case 'gas': return <g fill="white" stroke={blueLine} strokeWidth="1.6">
      {[[6, 26], [18, 10], [30, 24], [36, 6], [10, 4]].map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy + 4} r="5" />)}
    </g>
    default: return <g>
      <path d={`M${x + 6} ${y + 34}L${x + 12} ${y + 12}H${x + 28}L${x + 34} ${y + 34}Z`} fill="white" stroke={muted} strokeWidth="1.6" />
      <circle cx={x + 20} cy={y + 7} r="5" fill="none" stroke={muted} strokeWidth="1.6" />
    </g>
  }
}
const METAL_ROWS: Array<[string, string, string]> = [['bend', 'strong, but can be', 'bent or hammered'], ['bulb', 'conduct heat and', 'electricity well'], ['hot', 'high melting and', 'boiling points']]
const NONMETAL_ROWS: Array<[string, string, string]> = [['break', 'dull and brittle', 'when solid'], ['gas', 'not always solid:', 'many are gases'], ['bulbOff', 'do not usually', 'conduct electricity'], ['weight', 'lower density', 'than metals']]
const PROP_ACTIVE: Record<PropStage, string[]> = { strong: ['m0'], conduct: ['m1'], melt: ['m2'], brittle: ['n0'], other: ['n1', 'n2', 'n3'], all: ['m0', 'm1', 'm2', 'n0', 'n1', 'n2', 'n3'] }
const PROP_TITLES: Record<PropStage, string> = {
  strong: 'Two panels, metals and non-metals. Highlighted: metals are strong but can be bent or hammered into shape, which is called malleable.',
  conduct: 'Metals panel, second row highlighted: metals conduct heat and electricity well. A lit bulb shows electricity passing.',
  melt: 'Metals panel, third row highlighted: metals have high melting and boiling points, shown by a thermometer reading high.',
  brittle: 'Non-metals panel, first row highlighted: solid non-metals are dull and brittle. A piece broken in two shows it breaks instead of bending.',
  other: 'Non-metals panel, rows highlighted: not always solid, many are gases; do not usually conduct electricity, shown by an unlit bulb; lower density than metals.',
  all: 'Both panels in full. Metals: strong but can be bent or hammered; conduct heat and electricity well; high melting and boiling points. Non-metals: dull and brittle when solid; not always solid, many are gases; do not usually conduct electricity; lower density than metals.',
}
function Properties({ stage }: { stage: PropStage }) {
  const active = PROP_ACTIVE[stage]
  const panel = (x: number, head: string, rows: Array<[string, string, string]>, key: 'm' | 'n', fill: string, line: string, text: string) => {
    const anyOn = rows.some((_, i) => active.includes(`${key}${i}`))
    return <g>
      <rect x={x} y={36} width={252} height={4 * 58 + 10} rx="12" fill={anyOn ? fill : panelFill} stroke={anyOn ? line : panelLine} strokeWidth="1.5" />
      <text x={x + 126} y={26} textAnchor="middle" fontSize="16" fontWeight="700" fill={text}>{head}</text>
      {rows.map(([icon, a, b], i) => {
        const on = active.includes(`${key}${i}`), y = 46 + i * 58
        return <g key={i} opacity={on ? 1 : faded}>
          {on && stage !== 'all' && <rect x={x + 6} y={y - 2} width={240} height={54} rx="9" fill="white" stroke={amberLine} strokeWidth="2" />}
          <Icon kind={icon} x={x + 14} y={y + 6} />
          <text x={x + 66} y={y + 22} fontSize="14" fontWeight="700" fill={ink}>{a}</text>
          <text x={x + 66} y={y + 40} fontSize="14" fontWeight="700" fill={ink}>{b}</text>
        </g>
      })}
    </g>
  }
  return <Diagram viewBox={stage === 'all' ? '0 0 540 310' : '0 0 540 286'} schematic={false} title={PROP_TITLES[stage]}>
    {panel(12, 'metals', METAL_ROWS, 'm', metalFill, metalLine, metalInk)}
    {panel(276, 'non-metals', NONMETAL_ROWS, 'n', blueFill, blueLine, blueInk)}
    {stage === 'all' && <text x={270} y={302} textAnchor="middle" fontSize="13" fill={muted}>Metals and non-metals have opposite properties.</text>}
  </Diagram>
}

// ---------- On your own ----------
const MARKED: Record<string, number> = { '3-1': 1, '4-8': 2, '3-16': 3, '4-1': 4 }
function Positions({ assessment }: { assessment: boolean }) {
  return <Diagram viewBox={assessment ? '0 0 540 250' : '0 0 540 290'} schematic={false} title={assessment ? 'An outline of the periodic table with four boxes numbered 1 to 4. Box 1 is the first box of row 3. Box 2 is in the middle block of row 4. Box 3 is near the right end of row 3. Box 4 is the first box of row 4.' : 'An outline of the periodic table with four numbered boxes: 1 sodium (Group 1, period 3), 2 iron (middle block, period 4), 3 sulfur (Group 6, period 3), 4 potassium (Group 1, period 4). Sodium and potassium are in the same group.'}>
    <Table {...T} symbols={false} look={c => (MARKED[`${c.row}-${c.col}`] ? 'hot' : 'plain')} badges={MARKED} heads={!assessment} />
    {!assessment && <text x={270} y={272} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>1 sodium · 2 iron · 3 sulfur · 4 potassium</text>}
  </Diagram>
}
const SAMPLES: string[][] = [['A', 'shiny grey', 'yes', '1538', 'flattens'], ['B', 'dull yellow', 'no', '115', 'shatters'], ['C', 'shiny, reddish', 'yes', '1085', 'flattens']]
function Samples() {
  const cols = [54, 154, 272, 372, 468], heads = [['sample'], ['appearance'], ['conducts', 'electricity?'], ['melting', 'point (°C)'], ['when', 'hammered']]
  return <Diagram viewBox="0 0 540 230" schematic={false} title="Results for three solid elements. Sample A: shiny grey, conducts electricity, melting point 1538 °C, flattens when hammered. Sample B: dull yellow, does not conduct, melting point 115 °C, shatters. Sample C: shiny and reddish, conducts, melting point 1085 °C, flattens.">
    <rect x={10} y={10} width={520} height={206} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    {heads.map((lines, i) => lines.map((l, j) => <text key={`${i}-${j}`} x={cols[i]} y={38 + j * 17} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{l}</text>))}
    <path d="M22 66H518" stroke={panelLine} strokeWidth="1.5" />
    {SAMPLES.map((row, r) => <g key={r}>
      {row.map((v, i) => <text key={i} x={cols[i]} y={104 + r * 46} textAnchor="middle" fontSize={i === 0 ? 17 : 14} fontWeight={i === 0 ? 700 : 400} fill={ink}>{v}</text>)}
      {r < SAMPLES.length - 1 && <path d={`M22 ${122 + r * 46}H518`} stroke={panelLine} />}
    </g>)}
  </Diagram>
}

export function TableVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'mtab-order': return <Order />
    case 'mtab-box': return <BoxDiagram />
    case 'mtab-box-q': return <BoxQuestion assessment={assessment} />
    case 'mtab-periods': return <Periods />
    case 'mtab-groups': return <Groups />
    case 'mtab-repeat': return <Repeat />
    case 'mtab-g1': return <GroupOneAtoms mode="outer" />
    case 'mtab-period2': return <PeriodTwo />
    case 'mtab-g0': return <GroupZero />
    case 'mtab-shells': return <GroupOneAtoms mode="shells" />
    case 'mtab-cl': return <Chlorine />
    case 'mtab-similar': return <GroupColumn stage="similar" />
    case 'mtab-predict': return <GroupColumn stage="predict" />
    case 'mtab-trend': return <GroupColumn stage="trend" />
    case 'mtab-next': return <GroupColumn stage="next" />
    case 'mtab-melt': return <MeltData assessment={assessment} />
    case 'mtab-metals': return <MetalsTable stage="metals" />
    case 'mtab-nonmetals': return <MetalsTable stage="nonmetals" />
    case 'mtab-lose': return <LoseElectron />
    case 'mtab-gain': return <GainElectron />
    case 'mtab-sides': return <Sides />
    case 'mtab-prop-strong': return <Properties stage="strong" />
    case 'mtab-prop-conduct': return <Properties stage="conduct" />
    case 'mtab-prop-melt': return <Properties stage="melt" />
    case 'mtab-prop-brittle': return <Properties stage="brittle" />
    case 'mtab-prop-other': return <Properties stage="other" />
    case 'mtab-prop-all': return <Properties stage="all" />
    case 'mtab-q-positions': return <Positions assessment={assessment} />
    case 'mtab-q-samples': return <Samples />
    default: return <Order />
  }
}
