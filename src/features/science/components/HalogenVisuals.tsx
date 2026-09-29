import { useId, type ReactNode } from 'react'
import { Arrow } from './InfectionVisuals'
import { atomPalette, Electron } from './AtomVisuals'

/*
 * Chemistry C1b (Chemistry Lesson 10): Group 7, the halogens. Original, code-native schematics; not to scale.
 * Focus ids start with 'hal-'.
 *
 * Colours: the Chemistry palette from AtomVisuals. The halogens keep the blue family tint PeriodicVisuals gives them,
 * and negative (halide) ions use the same electron-blue tint; positive metal ions use the pale coral proton tint.
 * Electrons on atoms are the blue Lesson 1 electrons on thin shells; the nucleus is a pale coral disc with the symbol,
 * as in the exam-style drawings of Lesson 6. Dot-and-cross drawings: the first-named element's electrons are blue dots,
 * the other element's are ink crosses; ions sit in square brackets with the charge at the top right.
 * The only other colours are the real colours of the substances (pale yellow fluorine, pale green chlorine, red-brown
 * bromine, orange bromine water, brown iodine solution, dark grey iodine), because the colour change is the evidence.
 * Data: relative atomic masses as in the revision guide (F 19, Cl 35.5, Br 80, I 127, At 210); melting and boiling
 * points rounded to the nearest degree (F −220/−188, Cl −101/−34, Br −7/59, I 114/184 °C).
 */
const { ink, muted, protonLine, electronFill, electronLine, shellLine, space, spaceLine, glow, panelFill, panelLine } = atomPalette
const faded = 0.3
const blueFill = '#e4f0f9', blueLine = electronLine
const r1 = (n: number) => Math.round(n * 10) / 10

// Real appearance of each substance.
const SUB = {
  fluorine: { fill: '#fbf4c8', line: '#bfa93c', word: 'pale yellow' },
  chlorine: { fill: '#e2eeb6', line: '#86a03a', word: 'pale green' },
  chlorineWater: { fill: '#eef5d6', line: '#9db04e', word: 'pale green' },
  bromine: { fill: '#c9643a', line: '#8e3f1f', word: 'red-brown' },
  bromineWater: { fill: '#f6bf78', line: '#c77a1f', word: 'orange' },
  iodineWater: { fill: '#c08447', line: '#7d4f1f', word: 'brown' },
  iodine: { fill: '#4d525c', line: '#2c3038', word: 'dark grey' },
  clear: { fill: '#f4f8fb', line: '#b9cad6', word: 'colourless' },
} as const
type Sub = keyof typeof SUB

function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function T({ x, y, children, size = 14, bold = false, fill = ink, anchor = 'middle' }: { x: number; y: number; children: ReactNode; size?: number; bold?: boolean; fill?: string; anchor?: 'start' | 'middle' | 'end' }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={bold ? 700 : 400} fill={fill}>{children}</text>
}
const onCircle = (cx: number, cy: number, r: number, deg: number): [number, number] => [r1(cx + Math.cos(deg * Math.PI / 180) * r), r1(cy + Math.sin(deg * Math.PI / 180) * r)]

// ---------- Atoms and ions (Bohr style) ----------
const START = [180, -90, -45]
/**
 * A small atom or ion: shells with blue electrons, a coral nucleus disc with the symbol.
 * `slot` draws the outer shell as 8 places with a dashed empty place; `gained` rings the last outer electron;
 * `ion` gives the negative-ion blue wash, square brackets and a charge.
 */
function Bohr({ cx, cy, sym, shells, radii, er = 6.5, slot = false, gained = false, ion, outerOn = false }: { cx: number; cy: number; sym: string; shells: number[]; radii: number[]; er?: number; slot?: boolean; gained?: boolean; ion?: string; outerOn?: boolean }) {
  const outer = radii[shells.length - 1], cloud = r1(outer + er + 8), last = shells.length - 1
  return <g>
    <circle cx={cx} cy={cy} r={cloud} fill={ion ? blueFill : space} stroke={ion ? blueLine : spaceLine} strokeWidth="1.5" />
    {shells.map((_, i) => <circle key={`s${i}`} cx={cx} cy={cy} r={radii[i]} fill="none" stroke={outerOn && i === last ? electronLine : shellLine} strokeWidth={outerOn && i === last ? 2.8 : 1.8} />)}
    {shells.map((count, s) => {
      const places = slot && s === last ? 8 : count
      return Array.from({ length: places }, (_, j) => {
        const [x, y] = onCircle(cx, cy, radii[s], START[s] + j * 360 / places)
        if (j >= count) return <circle key={`${s}-${j}`} cx={x} cy={y} r={er} fill="white" stroke={electronLine} strokeWidth="1.5" strokeDasharray="3 3" />
        const ring = gained && s === last && j === count - 1
        return <g key={`${s}-${j}`}>{ring && <circle cx={x} cy={y} r={er + 5} fill="none" stroke={electronLine} strokeWidth="2" strokeDasharray="4 3" />}<Electron x={x} y={y} r={er} sign={false} icon /></g>
      })
    })}
    <circle cx={cx} cy={cy} r={17} fill={glow} stroke={protonLine} strokeWidth="1.5" />
    <T x={cx} y={cy + 5} size={14} bold>{sym}</T>
    {ion && <Brackets cx={cx} cy={cy} half={cloud + 6} charge={ion} />}
  </g>
}
/** Square brackets round an ion with its charge at the top right. */
function Brackets({ cx, cy, half, charge, colour = ink }: { cx: number; cy: number; half: number; charge: string; colour?: string }) {
  const l = cx - half, r = cx + half, t = cy - half, b = cy + half
  return <g fill="none" stroke={colour} strokeWidth="2.2">
    <path d={`M${l + 9} ${t}H${l}V${b}H${l + 9}`} /><path d={`M${r - 9} ${t}H${r}V${b}H${r - 9}`} />
    <text x={r + 4} y={t + 12} fontSize="18" fontWeight="700" fill={colour} stroke="none">{charge}</text>
  </g>
}

// ---------- Dot-and-cross pieces ----------
function Dot({ x, y }: { x: number; y: number }) {
  return <circle cx={r1(x)} cy={r1(y)} r={5.5} fill={electronFill} stroke={electronLine} strokeWidth="1.5" />
}
function Cross({ x, y, s = 5 }: { x: number; y: number; s?: number }) {
  return <path d={`M${r1(x - s)} ${r1(y - s)}L${r1(x + s)} ${r1(y + s)}M${r1(x + s)} ${r1(y - s)}L${r1(x - s)} ${r1(y + s)}`} stroke={ink} strokeWidth="2.4" />
}
function Legend({ x, y, first, second }: { x: number; y: number; first: string; second: string }) {
  return <g>
    <Dot x={x} y={y - 5} /><T x={x + 12} y={y} size={13} anchor="start">{first}</T>
    <Cross x={x + 190} y={y - 5} /><T x={x + 202} y={y} size={13} anchor="start">{second}</T>
  </g>
}

// ---------- Element tiles and the Group 7 column ----------
const HAL = [
  { sym: 'F', name: 'fluorine', ar: '19', z: 9 },
  { sym: 'Cl', name: 'chlorine', ar: '35.5', z: 17 },
  { sym: 'Br', name: 'bromine', ar: '80', z: 35 },
  { sym: 'I', name: 'iodine', ar: '127', z: 53 },
  { sym: 'At', name: 'astatine', ar: '210', z: 85 },
]
function Tile({ x, y, w = 150, h = 46, i, dim = false, showAr = true, dashed = false }: { x: number; y: number; w?: number; h?: number; i: number; dim?: boolean; showAr?: boolean; dashed?: boolean }) {
  const el = HAL[i]
  return <g opacity={dim ? faded : 1}>
    <rect x={x} y={y} width={w} height={h} rx="8" fill={dashed ? 'white' : blueFill} stroke={blueLine} strokeWidth="1.8" strokeDasharray={dashed ? '6 5' : undefined} />
    <T x={x + 30} y={y + h / 2 + 8} size={22} bold fill={blueLine}>{el.sym}</T>
    <T x={x + 60} y={y + (showAr ? h / 2 - 3 : h / 2 + 5)} size={14} bold anchor="start">{el.name}</T>
    {showAr && <T x={x + 60} y={y + h / 2 + 14} size={12} fill={muted} anchor="start">{`Ar ${el.ar}`}</T>}
  </g>
}

// A simplified periodic table: groups 1, 2, the transition block (squeezed), 3–7 and 0; rows 1–6.
function MiniTable({ x0, y0 }: { x0: number; y0: number }) {
  const step = 22, size = 20
  const cols: Array<{ label: string; rows: number[]; kind: 'main' | 'tb' | 'hal' }> = [
    { label: '1', rows: [1, 2, 3, 4, 5, 6], kind: 'main' }, { label: '2', rows: [2, 3, 4, 5, 6], kind: 'main' },
    ...[0, 1, 2, 3, 4].map(() => ({ label: '', rows: [4, 5, 6], kind: 'tb' as const })),
    { label: '3', rows: [2, 3, 4, 5, 6], kind: 'main' }, { label: '4', rows: [2, 3, 4, 5, 6], kind: 'main' }, { label: '5', rows: [2, 3, 4, 5, 6], kind: 'main' },
    { label: '6', rows: [2, 3, 4, 5, 6], kind: 'main' }, { label: '7', rows: [2, 3, 4, 5, 6], kind: 'hal' }, { label: '0', rows: [1, 2, 3, 4, 5, 6], kind: 'main' },
  ]
  return <g>
    {cols.map((col, c) => <g key={c}>
      {col.label && <T x={x0 + c * step + size / 2} y={y0 - 8} size={12} bold={col.kind === 'hal'} fill={col.kind === 'hal' ? blueLine : muted}>{col.label}</T>}
      {col.rows.map(r => <rect key={r} x={x0 + c * step} y={y0 + (r - 1) * step} width={size} height={size} rx="3"
        fill={col.kind === 'hal' ? blueFill : col.kind === 'tb' ? '#f1f4f6' : panelFill} stroke={col.kind === 'hal' ? blueLine : panelLine} strokeWidth={col.kind === 'hal' ? 2 : 1.2} />)}
    </g>)}
  </g>
}
function GroupView() {
  const x0 = 16, y0 = 78, colX = x0 + 11 * 22, tx = 364
  return <Diagram viewBox="0 0 540 310" schematic={false} title="A simplified periodic table with the Group 7 column highlighted, one column in from the right-hand edge. Beside it the column is enlarged: fluorine (relative atomic mass 19), chlorine (35.5), bromine (80), iodine (127) and astatine (210). These are the halogens, and they are all non-metals.">
    <T x={16} y={30} size={14} bold anchor="start">The periodic table (simplified)</T>
    <MiniTable x0={x0} y0={y0} />
    <path d={`M${colX + 21} ${y0 + 22}L${tx - 6} 40M${colX + 21} ${y0 + 130}L${tx - 6} 282`} stroke={blueLine} strokeWidth="1.4" strokeDasharray="5 4" />
    {HAL.map((_, i) => <Tile key={i} x={tx} y={40 + i * 50} i={i} />)}
    <T x={16} y={236} size={15} bold fill={blueLine} anchor="start">Group 7 = the halogens</T>
    <T x={16} y={258} size={14} anchor="start">all non-metals</T>
    <T x={16} y={286} size={12} fill={muted} anchor="start">Ar = relative atomic mass</T>
  </Diagram>
}

// ---------- Seven outer electrons ----------
function OuterView() {
  return <Diagram viewBox="0 0 540 350" title="A fluorine atom, 2,7, and a chlorine atom, 2,8,7. In each, the outer shell is highlighted: it holds 7 electrons and has one dashed empty place, room for one more electron. Bromine and iodine also have 7 electrons in their outer shell.">
    <Bohr cx={140} cy={128} sym="F" shells={[2, 7]} radii={[32, 62]} slot outerOn />
    <Bohr cx={396} cy={128} sym="Cl" shells={[2, 8, 7]} radii={[30, 56, 84]} slot outerOn />
    <T x={140} y={250} size={16} bold>fluorine <tspan fill={blueLine}>2,7</tspan></T>
    <T x={396} y={250} size={16} bold>chlorine <tspan fill={blueLine}>2,8,7</tspan></T>
    <T x={140} y={272} size={14} fill={muted}>outer shell: 7 electrons</T>
    <T x={396} y={272} size={14} fill={muted}>outer shell: 7 electrons</T>
    <T x={270} y={306} size={14} fill={ink} bold>Bromine and iodine also have 7 outer electrons.</T>
    <circle cx={172} cy={331} r={6.5} fill="white" stroke={electronLine} strokeWidth="1.5" strokeDasharray="3 3" />
    <T x={184} y={336} size={13} fill={muted} anchor="start">= room for one more electron</T>
  </Diagram>
}

// ---------- Molecules of two atoms ----------
function Pair({ x, y, sym, r = 17, dim = false }: { x: number; y: number; sym: string; r?: number; dim?: boolean }) {
  const d = r * 1.3
  return <g opacity={dim ? faded : 1}>
    <circle cx={x - d / 2} cy={y} r={r} fill={blueFill} stroke={blueLine} strokeWidth="1.8" />
    <circle cx={x + d / 2} cy={y} r={r} fill={blueFill} stroke={blueLine} strokeWidth="1.8" />
    <T x={x - d / 2 - (r > 20 ? 4 : 2)} y={y + 5} size={r > 20 ? 16 : 12} bold fill={blueLine}>{sym}</T>
    <T x={x + d / 2 + (r > 20 ? 4 : 2)} y={y + 5} size={r > 20 ? 16 : 12} bold fill={blueLine}>{sym}</T>
  </g>
}
function Jar({ x, y, w, h, sub, level = 1, vapour = false }: { x: number; y: number; w: number; h: number; sub: Sub; level?: number; vapour?: boolean }) {
  const s = SUB[sub], id = useId()
  const liquidTop = y + h * (1 - level)
  return <g>
    <defs><clipPath id={id}><rect x={x} y={y} width={w} height={h} rx="14" /></clipPath></defs>
    {vapour && <rect x={x} y={y} width={w} height={h} fill={s.fill} opacity=".18" clipPath={`url(#${id})`} />}
    <rect x={x} y={liquidTop} width={w} height={h - (liquidTop - y)} fill={s.fill} clipPath={`url(#${id})`} />
    <rect x={x} y={y} width={w} height={h} rx="14" fill="none" stroke="#8aa3b5" strokeWidth="2.2" />
    <rect x={x - 4} y={y - 10} width={w + 8} height={10} rx="3" fill="#dfe8ee" stroke="#8aa3b5" strokeWidth="1.8" />
  </g>
}
const JAR_PAIRS: Array<[number, number, number]> = [[44, 44, -20], [104, 40, 25], [148, 92, 60], [56, 110, 10], [112, 146, -35], [48, 176, 40], [140, 198, 0], [86, 214, -15]]
function MoleculeView() {
  return <Diagram viewBox="0 0 540 330" title="A gas jar of chlorine, pale green, containing chlorine molecules. Each molecule is two chlorine atoms joined together, written Cl₂. Every halogen is made of molecules of two atoms: F₂, Cl₂, Br₂ and I₂.">
    <Jar x={20} y={40} w={180} h={240} sub="chlorine" />
    {JAR_PAIRS.map(([x, y, a], i) => <g key={i} transform={`rotate(${a} ${20 + x} ${40 + y})`}><Pair x={20 + x} y={40 + y} sym="Cl" /></g>)}
    <T x={110} y={306} size={14} bold>chlorine gas</T>
    <circle cx={172} cy={132} r={30} fill="none" stroke={ink} strokeWidth="1.6" strokeDasharray="5 4" />
    <path d="M202 128L286 118" stroke={ink} strokeWidth="1.6" strokeDasharray="5 4" />
    <rect x={290} y={62} width={226} height={112} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <Pair x={403} y={104} sym="Cl" r={27} />
    <T x={403} y={160} size={15} bold>one molecule: Cl₂</T>
    <T x={403} y={206} size={14}>two atoms joined together</T>
    <T x={403} y={226} size={14}>The small 2 counts the atoms.</T>
    <T x={403} y={272} size={14} bold fill={blueLine}>F₂   Cl₂   Br₂   I₂</T>
    <T x={403} y={292} size={13} fill={muted}>every halogen: pairs of atoms</T>
  </Diagram>
}

// ---------- What they look like at room temperature ----------
function Crystals({ x, y }: { x: number; y: number }) {
  const bits: Array<[number, number, number]> = [[0, 0, 14], [22, 4, 11], [40, -2, 15], [12, -14, 10], [32, -16, 9], [54, 2, 10]]
  return <g>{bits.map(([dx, dy, s], i) => <path key={i} d={`M${x + dx} ${y + dy - s}L${x + dx + s * .8} ${y + dy - s * .2}L${x + dx + s * .5} ${y + dy + s * .6}L${x + dx - s * .6} ${y + dy + s * .5}L${x + dx - s * .8} ${y + dy - s * .3}Z`} fill={SUB.iodine.fill} stroke={SUB.iodine.line} strokeWidth="1.4" />)}</g>
}
function LooksView() {
  const cols: Array<{ name: string; f: string; sub: Sub; state: string; level: number; extra?: string }> = [
    { name: 'fluorine', f: 'F₂', sub: 'fluorine', state: 'gas', level: 1 },
    { name: 'chlorine', f: 'Cl₂', sub: 'chlorine', state: 'gas', level: 1, extra: 'poisonous' },
    { name: 'bromine', f: 'Br₂', sub: 'bromine', state: 'liquid', level: .38 },
    { name: 'iodine', f: 'I₂', sub: 'clear', state: 'solid', level: 0 },
  ]
  return <Diagram viewBox="0 0 540 300" title="The halogens at room temperature. Fluorine, F₂: a pale yellow gas. Chlorine, Cl₂: a pale green, poisonous gas. Bromine, Br₂: a red-brown liquid. Iodine, I₂: a dark grey solid.">
    <T x={270} y={26} size={15} bold>At room temperature</T>
    {cols.map((c, i) => {
      const cx = 72 + i * 132, x = cx - 42
      return <g key={c.name}>
        <Jar x={x} y={52} w={84} h={150} sub={c.sub} level={c.level} vapour={c.sub === 'bromine'} />
        {c.state === 'solid' && <Crystals x={cx - 26} y={188} />}
        <T x={cx} y={228} size={15} bold>{c.name} <tspan fill={blueLine}>{c.f}</tspan></T>
        <T x={cx} y={248} size={14}>{SUB[c.sub === 'clear' ? 'iodine' : c.sub].word}</T>
        <T x={cx} y={266} size={14} bold>{c.state}</T>
        {c.extra && <T x={cx} y={286} size={13} bold fill={protonLine}>{c.extra}</T>}
      </g>
    })}
  </Diagram>
}

// ---------- Section 2: with metals and non-metals ----------
function IonView() {
  return <Diagram viewBox="0 0 540 320" title="A chlorine atom, 2,8,7, with 17 protons and 17 electrons and no overall charge, gains one electron from a metal. It becomes a chloride ion, 2,8,8, drawn in square brackets with a 1− charge: 17 protons and 18 electrons. The gained electron is ringed.">
    <Bohr cx={118} cy={138} sym="Cl" shells={[2, 8, 7]} radii={[26, 48, 70]} er={6} slot />
    <Electron x={236} y={62} r={6} sign={false} icon />
    <Arrow x1={228} y1={70} x2={186} y2={100} colour={electronLine} width={2.2} />
    <T x={214} y={34} size={13} fill={electronLine} bold>1 electron from a metal</T>
    <Arrow x1={228} y1={146} x2={286} y2={146} colour={ink} width={3} />
    <Bohr cx={400} cy={138} sym="Cl" shells={[2, 8, 8]} radii={[26, 48, 70]} er={6} gained ion="−" />
    <T x={118} y={248} size={15} bold>chlorine atom <tspan fill={blueLine}>2,8,7</tspan></T>
    <T x={118} y={270} size={13}>17 protons, 17 electrons</T>
    <T x={118} y={290} size={13} fill={muted}>no overall charge</T>
    <T x={400} y={248} size={15} bold>chloride ion Cl⁻ <tspan fill={blueLine}>2,8,8</tspan></T>
    <T x={400} y={270} size={13}>17 protons, 18 electrons</T>
    <T x={400} y={290} size={13} bold fill={blueLine}>full outer shell, charge 1−</T>
  </Diagram>
}
function HalidesView() {
  const rows = [['fluorine', 'fluoride', 'F⁻'], ['chlorine', 'chloride', 'Cl⁻'], ['bromine', 'bromide', 'Br⁻'], ['iodine', 'iodide', 'I⁻']]
  return <Diagram viewBox="0 0 540 250" schematic={false} title="Each halogen atom gains one electron to form an ion with a 1− charge. Fluorine forms fluoride, F⁻; chlorine forms chloride, Cl⁻; bromine forms bromide, Br⁻; iodine forms iodide, I⁻. The ending changes from -ine to -ide. These are the halide ions.">
    <T x={270} y={26} size={15} bold>each atom gains 1 electron → an ion with a 1− charge</T>
    {rows.map(([el, ion, f], i) => {
      const x = 14 + i * 130
      return <g key={el}>
        <T x={x + 58} y={62} size={14} fill={muted}>{el}</T>
        <Arrow x1={x + 58} y1={72} x2={x + 58} y2={100} colour={blueLine} width={2.2} />
        <rect x={x} y={108} width={116} height={82} rx="10" fill={blueFill} stroke={blueLine} strokeWidth="1.8" />
        <T x={x + 58} y={144} size={20} bold fill={blueLine}>{f}</T>
        <T x={x + 58} y={172} size={15} bold>{ion}</T>
      </g>
    })}
    <T x={270} y={222} size={14} bold>-ine → -ide: these are the halide ions</T>
  </Diagram>
}
function SaltView() {
  // Sodium ion 2,8 (all dots); chloride ion 2,8,8: crosses, plus one dot (the electron from sodium).
  const na = { cx: 132, cy: 150 }, cl = { cx: 384, cy: 150 }
  const naR = [26, 50], clR = [26, 50, 74]
  return <Diagram viewBox="0 0 540 330" title="Dot-and-cross diagram of sodium chloride. Left: a sodium ion in square brackets with a + charge, shells 2,8, all dots. Right: a chloride ion in square brackets with a − charge, shells 2,8,8, drawn as crosses except one dot in the outer shell: the electron that came from sodium. Sodium chloride is an ionic compound, a halide salt.">
    <T x={270} y={28} size={15} bold>sodium + chlorine → sodium chloride, NaCl</T>
    <circle cx={na.cx} cy={na.cy} r={62} fill={glow} stroke={protonLine} strokeWidth="1.5" />
    {naR.map((r, i) => <circle key={i} cx={na.cx} cy={na.cy} r={r} fill="none" stroke={ink} strokeWidth="1.5" />)}
    {[2, 8].map((n, s) => Array.from({ length: n }, (_, j) => { const [x, y] = onCircle(na.cx, na.cy, naR[s], START[s] + j * 360 / n); return <Dot key={`${s}-${j}`} x={x} y={y} /> }))}
    <T x={na.cx} y={na.cy + 6} size={17} bold>Na</T>
    <Brackets cx={na.cx} cy={na.cy} half={70} charge="+" />
    <circle cx={cl.cx} cy={cl.cy} r={86} fill={blueFill} stroke={blueLine} strokeWidth="1.5" />
    {clR.map((r, i) => <circle key={i} cx={cl.cx} cy={cl.cy} r={r} fill="none" stroke={ink} strokeWidth="1.5" />)}
    {[2, 8, 8].map((n, s) => Array.from({ length: n }, (_, j) => {
      const [x, y] = onCircle(cl.cx, cl.cy, clR[s], START[s] + j * 360 / n)
      return s === 2 && j === n - 1 ? <Dot key={`${s}-${j}`} x={x} y={y} /> : <Cross key={`${s}-${j}`} x={x} y={y} />
    }))}
    <T x={cl.cx} y={cl.cy + 6} size={17} bold>Cl</T>
    <Brackets cx={cl.cx} cy={cl.cy} half={94} charge="−" />
    <T x={132} y={250} size={14} bold fill={protonLine}>sodium ion Na⁺</T>
    <T x={384} y={266} size={14} bold fill={blueLine}>chloride ion Cl⁻</T>
    <T x={132} y={272} size={13} fill={muted}>lost its outer electron</T>
    <Legend x={40} y={306} first="sodium’s electrons" second="chlorine’s electrons" />
  </Diagram>
}
function ShareView() {
  const h = { cx: 196, cy: 150, r: 46 }, c = { cx: 292, cy: 150, r: 70 }, mid = 236
  return <Diagram viewBox="0 0 540 320" title="Dot-and-cross diagram of hydrogen chloride, HCl, showing outer shells only. The hydrogen circle overlaps the chlorine circle. In the overlap are one dot from hydrogen and one cross from chlorine: a shared pair of electrons, which is a covalent bond. Chlorine has six more crosses in three pairs.">
    <T x={270} y={28} size={15} bold>hydrogen + chlorine → hydrogen chloride, HCl</T>
    <circle cx={h.cx} cy={h.cy} r={h.r} fill={panelFill} stroke={ink} strokeWidth="1.8" />
    <circle cx={c.cx} cy={c.cy} r={c.r} fill={blueFill} fillOpacity=".7" stroke={ink} strokeWidth="1.8" />
    <T x={h.cx - 12} y={h.cy + 6} size={18} bold>H</T>
    <T x={c.cx + 12} y={c.cy + 6} size={18} bold>Cl</T>
    <Dot x={mid} y={h.cy - 11} />
    <Cross x={mid} y={h.cy + 11} />
    {[-78, -58, -10, 10, 58, 78].map(a => { const [x, y] = onCircle(c.cx, c.cy, c.r, a); return <Cross key={a} x={x} y={y} /> })}
    <path d={`M${mid} ${h.cy + 24}L${mid - 20} 252`} stroke={ink} strokeWidth="1.6" /><circle cx={mid} cy={h.cy + 24} r="2.8" fill={ink} />
    <T x={mid - 20} y={270} size={14} bold fill={blueLine}>shared pair = a covalent bond</T>
    <T x={386} y={96} size={13} fill={muted} anchor="start">outer shells</T>
    <T x={386} y={112} size={13} fill={muted} anchor="start">only</T>
    <Legend x={40} y={306} first="hydrogen’s electron" second="chlorine’s electrons" />
  </Diagram>
}
function BothView() {
  const box = (x: number, y: number, w: number, lines: string[], fill: string, line: string, bold = false) => <g>
    <rect x={x} y={y} width={w} height={lines.length * 18 + 16} rx="10" fill={fill} stroke={line} strokeWidth="1.6" />
    {lines.map((l, i) => <T key={i} x={x + w / 2} y={y + 24 + i * 18} size={14} bold={bold || i === 0}>{l}</T>)}
  </g>
  return <Diagram viewBox="0 0 540 340" schematic={false} title="Summary. A halogen atom has 7 outer electrons. With a metal, it gains one electron and becomes a halide ion; the product is an ionic compound, a halide salt such as sodium chloride. With a non-metal, it shares a pair of electrons in a covalent bond; the product is made of small molecules, such as hydrogen chloride. Either way the halogen ends up with a full outer shell.">
    {box(150, 14, 240, ['a halogen atom', '7 outer electrons'], blueFill, blueLine)}
    <Arrow x1={220} y1={66} x2={150} y2={100} colour={ink} width={2.5} />
    <Arrow x1={320} y1={66} x2={390} y2={100} colour={ink} width={2.5} />
    <T x={150} y={90} size={14} bold anchor="end">+ a metal</T>
    <T x={390} y={90} size={14} bold anchor="start">+ a non-metal</T>
    {box(20, 108, 240, ['gains 1 electron', '→ a halide ion, e.g. Cl⁻'], panelFill, panelLine)}
    {box(280, 108, 240, ['shares a pair of electrons', '→ a covalent bond'], panelFill, panelLine)}
    <Arrow x1={140} y1={164} x2={140} y2={190} colour={ink} width={2.5} />
    <Arrow x1={400} y1={164} x2={400} y2={190} colour={ink} width={2.5} />
    {box(20, 196, 240, ['an ionic compound', '(a halide salt)', 'e.g. sodium chloride, NaCl'], glow, protonLine)}
    {box(280, 196, 240, ['small molecules', '(covalent)', 'e.g. hydrogen chloride, HCl'], blueFill, blueLine)}
    <T x={270} y={310} size={15} bold fill={blueLine}>Either way: a full outer shell.</T>
  </Diagram>
}

// ---------- Section 3: trends down the group (one column, the right-hand panel changes) ----------
type TrendStage = 'mass' | 'bp' | 'react' | 'all'
const TROW = (i: number) => 52 + i * 60
function TrendColumn({ at = false }: { at?: boolean }) {
  return <g>
    {HAL.slice(0, at ? 5 : 4).map((_, i) => <Tile key={i} x={14} y={TROW(i)} w={140} h={48} i={i} showAr={false} dashed={i === 4} />)}
    <Arrow x1={170} y1={TROW(0) + 4} x2={170} y2={TROW(at ? 4 : 3) + 44} colour={ink} width={2.5} />
    <T x={14} y={34} size={14} bold anchor="start">down Group 7</T>
  </g>
}
const MP = [-220, -101, -7, 114], BP = [-188, -34, 59, 184]
// Temperature axis: −200 °C … 200 °C mapped across the panel.
const tx = (t: number) => r1(206 + (t + 220) * 0.72)
function TempChart({ values, label, hideLast = false, room = true, states = false }: { values: number[]; label: string; hideLast?: boolean; room?: boolean; states?: boolean }) {
  const axisY = 292
  const stateWords = ['gas', 'gas', 'liquid', 'solid']
  return <g>
    <T x={206} y={34} size={14} bold anchor="start">{label}</T>
    {room && <g><path d={`M${tx(20)} 44V${axisY}`} stroke={protonLine} strokeWidth="1.8" strokeDasharray="6 5" />
      <T x={tx(20) + 6} y={56} size={12} bold fill={protonLine} anchor="start">room temperature</T></g>}
    {values.map((v, i) => {
      const y = TROW(i) + 24
      if (hideLast && i === values.length - 1) return <T key={i} x={206} y={y + 5} size={15} bold fill={muted} anchor="start">? °C</T>
      return <g key={i}>
        <path d={`M${tx(-220)} ${y}H${tx(v)}`} stroke={blueLine} strokeWidth="2" strokeDasharray="2 5" opacity=".6" />
        <circle cx={tx(v)} cy={y} r={8} fill={blueFill} stroke={blueLine} strokeWidth="2.2" />
        <T x={tx(v)} y={y - 14} size={13} bold>{`${v} °C`.replace('-', '−')}</T>
        {states && <T x={tx(v)} y={y + 24} size={12} fill={muted}>{stateWords[i]}</T>}
      </g>
    })}
    <path d={`M${tx(-220)} ${axisY}H${tx(220)}`} stroke={ink} strokeWidth="1.6" />
    {[-200, -100, 0, 100, 200].map(t => <g key={t}><path d={`M${tx(t)} ${axisY}V${axisY + 6}`} stroke={ink} strokeWidth="1.6" /><T x={tx(t)} y={axisY + 20} size={12}>{String(t).replace('-', '−')}</T></g>)}
    <T x={tx(0)} y={axisY + 38} size={12} fill={muted}>temperature (°C)</T>
  </g>
}
const TREND_TITLES: Record<TrendStage, string> = {
  mass: 'Down Group 7 the relative atomic mass goes up: fluorine 19, chlorine 35.5, bromine 80, iodine 127. The bars get longer down the group.',
  bp: 'Boiling points of the halogens on a temperature scale with room temperature marked: fluorine −188 °C and chlorine −34 °C are below room temperature, so they are gases. Bromine boils at 59 °C and is a liquid; iodine boils at 184 °C and is a solid. Boiling points go up down the group.',
  react: 'Reactivity down Group 7: fluorine has the longest bar and is the most reactive, then chlorine, then bromine, and iodine is the least reactive of the four. Reactivity goes down down the group.',
  all: 'Summary of the trends down Group 7: relative atomic mass goes up, melting and boiling points go up, and reactivity goes down. Astatine, below iodine, is shown dashed: predicted to be a solid with a higher melting point than iodine.',
}
function TrendView({ stage }: { stage: TrendStage }) {
  const at = stage === 'all'
  return <Diagram viewBox={`0 0 540 ${at ? 360 : 340}`} schematic={stage === 'react'} title={TREND_TITLES[stage]}>
    <TrendColumn at={at} />
    {stage === 'mass' && <g>
      <T x={206} y={34} size={14} bold anchor="start">relative atomic mass</T>
      {HAL.slice(0, 4).map((el, i) => {
        const y = TROW(i) + 10, w = r1(Number(el.ar) * 2.1)
        return <g key={i}><rect x={206} y={y} width={w} height={28} rx="6" fill={blueFill} stroke={blueLine} strokeWidth="1.8" />
          <T x={206 + w + 8} y={y + 20} size={15} bold anchor="start">{el.ar}</T></g>
      })}
      <T x={206} y={310} size={14} bold fill={blueLine} anchor="start">goes up: heavier, bigger atoms</T>
    </g>}
    {stage === 'bp' && <TempChart values={BP} label="boiling point" states />}
    {stage === 'react' && <g>
      <T x={206} y={34} size={14} bold anchor="start">how reactive</T>
      {[260, 190, 120, 56].map((w, i) => {
        const y = TROW(i) + 10
        return <rect key={i} x={206} y={y} width={w} height={28} rx="6" fill={glow} stroke={protonLine} strokeWidth="1.8" />
      })}
      <T x={206 + 260 + 8} y={TROW(0) + 30} size={13} bold fill={protonLine} anchor="start">most</T>
      <T x={206 + 56 + 8} y={TROW(3) + 30} size={13} bold fill={protonLine} anchor="start">least of these four</T>
      <T x={206} y={310} size={14} bold fill={protonLine} anchor="start">goes down the group</T>
      <T x={206} y={330} size={12} fill={muted} anchor="start">bars show the order only</T>
    </g>}
    {stage === 'all' && <g>
      {[
        { x: 236, up: true, l1: 'relative', l2: 'atomic mass', c: blueLine },
        { x: 340, up: true, l1: 'melting and', l2: 'boiling points', c: blueLine },
        { x: 444, up: false, l1: 'reactivity', l2: '', c: protonLine },
      ].map(a => <g key={a.l1}>
        <T x={a.x} y={34} size={13} bold fill={a.c}>{a.l1}</T>
        {a.l2 && <T x={a.x} y={50} size={13} bold fill={a.c}>{a.l2}</T>}
        <path d={a.up ? `M${a.x - 3} 64L${a.x + 3} 64L${a.x + 26} 234L${a.x - 26} 234Z` : `M${a.x - 26} 64L${a.x + 26} 64L${a.x + 3} 234L${a.x - 3} 234Z`} fill={a.up ? blueFill : glow} stroke={a.c} strokeWidth="2" />
        <T x={a.x} y={258} size={14} bold fill={a.c}>{a.up ? 'goes up' : 'goes down'}</T>
      </g>)}
      <rect x={196} y={TROW(4) - 8} width={330} height={64} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
      <T x={210} y={TROW(4) + 14} size={14} bold anchor="start">predict astatine:</T>
      <T x={210} y={TROW(4) + 36} size={14} anchor="start">a solid, melting point above iodine’s</T>
    </g>}
  </Diagram>
}

// Why reactivity falls: fluorine v chlorine gaining an electron.
function WhyView() {
  const atom = (cx: number, sym: string, shells: number[], radii: number[], strong: boolean) => {
    const outer = radii[radii.length - 1], slotAt = onCircle(cx, 140, outer, START[shells.length - 1] + 7 * 45)
    return <g>
      <Bohr cx={cx} cy={140} sym={sym} shells={shells} radii={radii} slot outerOn />
      <path d={`M${onCircle(cx, 140, 18, 22.5).join(' ')}L${onCircle(cx, 140, outer, 22.5).join(' ')}`} stroke={protonLine} strokeWidth="2.2" strokeDasharray="4 3" />
      <Electron x={slotAt[0] - 40} y={slotAt[1] - 40} r={6.5} sign={false} icon />
      <Arrow x1={slotAt[0] - 33} y1={slotAt[1] - 33} x2={slotAt[0] - 10} y2={slotAt[1] - 10} colour={strong ? protonLine : '#d9a8a2'} width={strong ? 3 : 1.8} dashed={!strong} />
    </g>
  }
  return <Diagram viewBox="0 0 540 330" title="Fluorine (2,7) and chlorine (2,8,7), each with an electron arriving at the empty place in the outer shell. In fluorine the outer shell is close to the nucleus, so the pull on the new electron is strong. In chlorine the outer shell is further from the nucleus, so the pull is weaker and chlorine gains an electron less easily. So chlorine is less reactive than fluorine.">
    {atom(138, 'F', [2, 7], [32, 62], true)}
    {atom(392, 'Cl', [2, 8, 7], [30, 56, 84], false)}
    <T x={138} y={262} size={15} bold>fluorine</T>
    <T x={138} y={282} size={13}>outer shell close to nucleus</T>
    <T x={138} y={300} size={13} bold fill={protonLine}>strong pull: gains easily</T>
    <T x={392} y={262} size={15} bold>chlorine</T>
    <T x={392} y={282} size={13}>outer shell further away</T>
    <T x={392} y={300} size={13} bold fill={protonLine}>weaker pull: gains less easily</T>
    <T x={270} y={324} size={12} fill={muted}>dashed red line: distance from nucleus to outer shell</T>
  </Diagram>
}

// ---------- Section 4: displacement ----------
function Tube({ x, y, sub, h = 150, w = 44, level = .55, dim = false }: { x: number; y: number; sub: Sub; h?: number; w?: number; level?: number; dim?: boolean }) {
  const s = SUB[sub], id = useId(), r = w / 2
  const body = `M${x} ${y}V${y + h - r}A${r} ${r} 0 0 0 ${x + w} ${y + h - r}V${y}`
  return <g opacity={dim ? faded : 1}>
    <defs><clipPath id={id}><path d={`${body}Z`} /></clipPath></defs>
    <rect x={x} y={y + h * (1 - level)} width={w} height={h * level} fill={s.fill} clipPath={`url(#${id})`} />
    <path d={body} fill="none" stroke="#8aa3b5" strokeWidth="2.2" />
    <path d={`M${x - 5} ${y}H${x + w + 5}`} stroke="#8aa3b5" strokeWidth="2.2" />
  </g>
}
function Dropper({ x, y, sub }: { x: number; y: number; sub: Sub }) {
  const s = SUB[sub]
  return <g>
    <rect x={x - 9} y={y} width={18} height={22} rx="7" fill="#d7dee4" stroke="#8aa3b5" strokeWidth="1.6" />
    <path d={`M${x - 6} ${y + 22}V${y + 58}L${x} ${y + 70}L${x + 6} ${y + 58}V${y + 22}Z`} fill={s.fill} stroke="#8aa3b5" strokeWidth="1.6" />
    <path d={`M${x} ${y + 78}q-5 8 0 12q5 -4 0 -12Z`} fill={s.fill} stroke={s.line} strokeWidth="1.2" />
  </g>
}
function Swatch({ x, y, sub }: { x: number; y: number; sub: Sub }) {
  const s = SUB[sub]
  return <rect x={x} y={y} width={16} height={16} rx="4" fill={s.fill} stroke={s.line} strokeWidth="1.5" />
}
function MixView() {
  return <Diagram viewBox="0 0 540 320" title="Chlorine water, pale green, is dripped into colourless potassium bromide solution. The mixture turns orange, the colour of bromine in water, so bromine has been made.">
    <Dropper x={120} y={20} sub="chlorineWater" />
    <T x={140} y={40} size={14} bold anchor="start">chlorine water</T>
    <T x={140} y={58} size={13} fill={muted} anchor="start">pale green</T>
    <Tube x={98} y={112} sub="clear" />
    <T x={120} y={288} size={14} bold>potassium bromide</T>
    <T x={120} y={306} size={13} fill={muted}>solution: colourless</T>
    <Arrow x1={200} y1={190} x2={320} y2={190} colour={ink} width={3} />
    <T x={260} y={178} size={13} bold>mix</T>
    <Tube x={378} y={112} sub="bromineWater" level={.6} />
    <T x={400} y={288} size={14} bold fill={SUB.bromineWater.line}>turns orange</T>
    <T x={400} y={306} size={13} fill={muted}>bromine has been made</T>
  </Diagram>
}
function Ion({ x, y, label, pos, r = 19, ring = false }: { x: number; y: number; label: string; pos: boolean; r?: number; ring?: boolean }) {
  return <g>
    {ring && <circle cx={x} cy={y} r={r + 5} fill="none" stroke={protonLine} strokeWidth="2.2" strokeDasharray="4 3" />}
    <circle cx={x} cy={y} r={r} fill={pos ? glow : blueFill} stroke={pos ? protonLine : blueLine} strokeWidth="1.8" />
    <T x={x} y={y + 5} size={13} bold fill={pos ? protonLine : blueLine}>{label}</T>
  </g>
}
function Molecule({ x, y, sym, ring = false }: { x: number; y: number; sym: string; ring?: boolean }) {
  return <g>
    {ring && <ellipse cx={x} cy={y} rx={48} ry={26} fill="none" stroke={protonLine} strokeWidth="2.2" strokeDasharray="4 3" />}
    <circle cx={x - 13} cy={y} r={19} fill={blueFill} stroke={blueLine} strokeWidth="1.8" /><circle cx={x + 13} cy={y} r={19} fill={blueFill} stroke={blueLine} strokeWidth="1.8" />
    <T x={x - 15} y={y + 5} size={13} bold fill={blueLine}>{sym}</T><T x={x + 15} y={y + 5} size={13} bold fill={blueLine}>{sym}</T>
  </g>
}
function SwapView() {
  const pair = (x: number, y: number, hal: string, ring = false) => <g><Ion x={x} y={y} label="K⁺" pos /><Ion x={x + 42} y={y} label={`${hal}⁻`} pos={false} ring={ring} /></g>
  return <Diagram viewBox="0 0 540 290" title="Particle picture of the swap. Before: one chlorine molecule, Cl₂, and potassium bromide, drawn as two pairs of K⁺ and Br⁻ ions. After: one bromine molecule, Br₂, and potassium chloride, two pairs of K⁺ and Cl⁻ ions. The chlorine has taken bromine’s place next to the potassium ions. Chlorine is ringed each time.">
    <T x={128} y={30} size={14} bold>before</T>
    <T x={420} y={30} size={14} bold>after</T>
    <Molecule x={48} y={130} sym="Cl" ring />
    <T x={108} y={136} size={20} bold>+</T>
    {pair(140, 100, 'Br')}{pair(140, 160, 'Br')}
    <Arrow x1={228} y1={130} x2={290} y2={130} colour={ink} width={3} />
    <Molecule x={336} y={130} sym="Br" />
    <T x={396} y={136} size={20} bold>+</T>
    {pair(428, 100, 'Cl', true)}{pair(428, 160, 'Cl', true)}
    <T x={48} y={210} size={13} bold>chlorine</T>
    <T x={160} y={210} size={13} bold>potassium</T><T x={160} y={226} size={13} bold>bromide</T>
    <T x={336} y={210} size={13} bold fill={SUB.bromineWater.line}>bromine</T><T x={336} y={226} size={13} fill={muted}>(orange)</T>
    <T x={448} y={210} size={13} bold>potassium</T><T x={448} y={226} size={13} bold>chloride</T>
    <T x={270} y={266} size={14} bold fill={protonLine}>more reactive chlorine takes bromine’s place</T>
  </Diagram>
}
function EquationView() {
  const parts: Array<{ x: number; f: string; word: string; sub: Sub }> = [
    { x: 64, f: 'Cl₂', word: 'chlorine', sub: 'chlorineWater' }, { x: 196, f: '2KBr', word: 'potassium bromide', sub: 'clear' },
    { x: 344, f: 'Br₂', word: 'bromine', sub: 'bromineWater' }, { x: 470, f: '2KCl', word: 'potassium chloride', sub: 'clear' },
  ]
  const count: Array<[string, string, string]> = [['chlorine', '2', '2'], ['potassium', '2', '2'], ['bromine', '2', '2']]
  return <Diagram viewBox="0 0 540 300" schematic={false} title="The balanced symbol equation Cl₂ + 2KBr → Br₂ + 2KCl, with the word equation chlorine + potassium bromide → bromine + potassium chloride. Colours in solution: chlorine pale green, potassium bromide colourless, bromine orange, potassium chloride colourless. Atom check: 2 chlorine, 2 potassium and 2 bromine atoms on each side.">
    {parts.map(p => <g key={p.f}>
      <T x={p.x} y={60} size={26} bold>{p.f}</T>
      <Swatch x={p.x - 8} y={76} sub={p.sub} />
      <T x={p.x} y={112} size={12} fill={muted}>{SUB[p.sub].word}</T>
      <T x={p.x} y={22} size={12} fill={muted}>{p.word}</T>
    </g>)}
    <T x={130} y={58} size={24} bold>+</T>
    <Arrow x1={250} y1={50} x2={296} y2={50} colour={ink} width={3} />
    <T x={408} y={58} size={24} bold>+</T>
    <rect x={120} y={140} width={300} height={140} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <T x={220} y={166} size={13} bold anchor="end">atoms</T>
    <T x={290} y={166} size={13} bold>left</T>
    <T x={370} y={166} size={13} bold>right</T>
    <path d="M132 176H408" stroke={panelLine} strokeWidth="1.5" />
    {count.map(([el, l, r], i) => <g key={el}>
      <T x={220} y={200 + i * 26} size={14} anchor="end">{el}</T>
      <T x={290} y={200 + i * 26} size={14} bold>{l}</T>
      <T x={370} y={200 + i * 26} size={14} bold>{r}</T>
    </g>)}
  </Diagram>
}
function NoneView() {
  return <Diagram viewBox="0 0 540 320" title="Bromine water, orange, is dripped into colourless potassium chloride solution. Nothing happens: the mixture is just the colour of the bromine water that was added, and no new substance is made, because bromine is less reactive than chlorine.">
    <Dropper x={120} y={20} sub="bromineWater" />
    <T x={140} y={40} size={14} bold anchor="start">bromine water</T>
    <T x={140} y={58} size={13} fill={muted} anchor="start">orange</T>
    <Tube x={98} y={112} sub="clear" />
    <T x={120} y={288} size={14} bold>potassium chloride</T>
    <T x={120} y={306} size={13} fill={muted}>solution: colourless</T>
    <Arrow x1={200} y1={190} x2={320} y2={190} colour={ink} width={3} />
    <T x={260} y={178} size={13} bold>mix</T>
    <Tube x={378} y={112} sub="bromineWater" level={.6} />
    <g stroke={protonLine} strokeWidth="4"><path d="M452 120L476 144M476 120L452 144" /></g>
    <T x={400} y={288} size={14} bold fill={protonLine}>no reaction</T>
    <T x={400} y={306} size={13} fill={muted}>only the colour of what was added</T>
  </Diagram>
}
// Results grid: rows = halogen solution added, columns = salt solution.
const GRID: Array<Array<'same' | Sub | 'none'>> = [
  ['same', 'bromineWater', 'iodineWater'],
  ['none', 'same', 'iodineWater'],
  ['none', 'none', 'same'],
]
function RuleView() {
  const colX = [132, 262, 392], rowY = [66, 134, 202], adds: Array<[string, Sub]> = [['chlorine', 'chlorineWater'], ['bromine', 'bromineWater'], ['iodine', 'iodineWater']]
  const salts = ['potassium chloride', 'potassium bromide', 'potassium iodide']
  return <Diagram viewBox="0 0 540 306" schematic={false} title="A results grid. Chlorine water added to potassium bromide turns orange (bromine made) and to potassium iodide turns brown (iodine made). Bromine water added to potassium chloride: no reaction; to potassium iodide: brown, iodine made. Iodine solution: no reaction with potassium chloride or potassium bromide. A halogen displaces the halogens below it in Group 7.">
    <T x={14} y={26} size={13} bold anchor="start">add ↓ to →</T>
    {salts.map((s, c) => <g key={s}><T x={colX[c] + 64} y={30} size={13} bold>{s.split(' ')[0]}</T><T x={colX[c] + 64} y={46} size={13} bold>{s.split(' ')[1]}</T></g>)}
    {adds.map(([name, sub], r) => <g key={name}>
      <Swatch x={14} y={rowY[r] + 12} sub={sub} />
      <T x={38} y={rowY[r] + 25} size={14} bold anchor="start">{name}</T>
      {GRID[r].map((cell, c) => {
        const x = colX[c], y = rowY[r]
        if (cell === 'same') return <g key={c}><rect x={x} y={y} width={128} height={56} rx="8" fill="#f1f4f6" stroke={panelLine} /><T x={x + 64} y={y + 33} size={13} fill={muted}>same halogen</T></g>
        if (cell === 'none') return <g key={c}><rect x={x} y={y} width={128} height={56} rx="8" fill="white" stroke={panelLine} strokeWidth="1.5" /><T x={x + 64} y={y + 33} size={13} bold fill={muted}>no reaction</T></g>
        return <g key={c}><rect x={x} y={y} width={128} height={56} rx="8" fill={SUB[cell].fill} stroke={SUB[cell].line} strokeWidth="1.8" />
          <T x={x + 64} y={y + 24} size={13} bold fill={cell === 'iodineWater' ? 'white' : ink}>{SUB[cell].word}</T>
          <T x={x + 64} y={y + 42} size={12} fill={cell === 'iodineWater' ? 'white' : ink}>{cell === 'iodineWater' ? 'iodine made' : 'bromine made'}</T></g>
      })}
    </g>)}
    <T x={270} y={290} size={14} bold fill={blueLine}>A halogen displaces the ones below it in Group 7.</T>
  </Diagram>
}

// ---------- On your own ----------
const Q_TUBES: Array<{ add: string; sub: Sub; salt: string; react: boolean; made?: Sub }> = [
  { add: 'chlorine', sub: 'chlorineWater', salt: 'potassium iodide', react: true, made: 'iodineWater' },
  { add: 'iodine', sub: 'iodineWater', salt: 'potassium chloride', react: false },
  { add: 'bromine', sub: 'bromineWater', salt: 'potassium iodide', react: true, made: 'iodineWater' },
  { add: 'bromine', sub: 'bromineWater', salt: 'potassium chloride', react: false },
]
function TubesQuestion({ assessment }: { assessment: boolean }) {
  return <Diagram viewBox="0 0 540 330" title={assessment
    ? 'Four test tubes numbered 1 to 4, each holding a colourless salt solution, with a dropper of halogen solution above. Tube 1: chlorine water into potassium iodide. Tube 2: iodine solution into potassium chloride. Tube 3: bromine water into potassium iodide. Tube 4: bromine water into potassium chloride.'
    : 'Results. Tube 1, chlorine water into potassium iodide: turns brown, iodine made, displacement. Tube 2, iodine solution into potassium chloride: no reaction. Tube 3, bromine water into potassium iodide: turns brown, iodine made, displacement. Tube 4, bromine water into potassium chloride: no reaction.'}>
    {Q_TUBES.map((t, i) => {
      const cx = 70 + i * 133
      return <g key={i}>
        <circle cx={cx - 44} cy={30} r={13} fill="white" stroke={ink} strokeWidth="2" /><T x={cx - 44} y={35} size={14} bold>{i + 1}</T>
        <Dropper x={cx} y={14} sub={t.sub} />
        <Tube x={cx - 22} y={110} h={130} sub={assessment ? 'clear' : t.react ? t.made! : 'clear'} level={.5} />
        <T x={cx} y={262} size={13} bold>{`${t.add} +`}</T>
        <T x={cx} y={280} size={13}>{t.salt.split(' ')[0]}</T>
        <T x={cx} y={296} size={13}>{t.salt.split(' ')[1]}</T>
        {!assessment && <T x={cx} y={320} size={13} bold fill={t.react ? SUB.iodineWater.line : muted}>{t.react ? 'iodine made' : 'no reaction'}</T>}
      </g>
    })}
  </Diagram>
}
function MeltQuestion({ assessment }: { assessment: boolean }) {
  return <Diagram viewBox="0 0 540 340" schematic={false} title={assessment
    ? 'Melting points of Group 7 elements on a temperature scale: fluorine −220 °C, chlorine −101 °C, bromine −7 °C. Iodine’s melting point is shown as a question mark.'
    : 'Melting points of Group 7 elements: fluorine −220 °C, chlorine −101 °C, bromine −7 °C and iodine 114 °C. They go up down the group.'}>
    <TrendColumn />
    <TempChart values={assessment ? MP.slice(0, 3).concat(0) : MP} label="melting point" hideLast={assessment} room={false} />
  </Diagram>
}

export function HalogenVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'hal-group': return <GroupView />
    case 'hal-outer': return <OuterView />
    case 'hal-molecule': return <MoleculeView />
    case 'hal-looks': return <LooksView />
    case 'hal-ion': return <IonView />
    case 'hal-halides': return <HalidesView />
    case 'hal-salt': return <SaltView />
    case 'hal-share': return <ShareView />
    case 'hal-both': return <BothView />
    case 'hal-trend-mass': return <TrendView stage="mass" />
    case 'hal-trend-bp': return <TrendView stage="bp" />
    case 'hal-trend-react': return <TrendView stage="react" />
    case 'hal-trend-why': return <WhyView />
    case 'hal-trend-all': return <TrendView stage="all" />
    case 'hal-disp-mix': return <MixView />
    case 'hal-disp-swap': return <SwapView />
    case 'hal-disp-equation': return <EquationView />
    case 'hal-disp-none': return <NoneView />
    case 'hal-disp-rule': return <RuleView />
    case 'hal-q-tubes': return <TubesQuestion assessment={assessment} />
    case 'hal-q-melt': return <MeltQuestion assessment={assessment} />
    default: return <GroupView />
  }
}
