import { useId, type ReactNode } from 'react'
import { atomPalette, Electron, Nucleus } from './AtomVisuals'

/*
 * Chemistry C1b (Chemistry Lesson 6): electronic structure. Original, code-native schematics; not to scale.
 * Focus ids start with 'shell-'. Atoms reuse the Chemistry palette and particle helpers from AtomVisuals.tsx
 * (proton coral, neutron grey, electron blue on thin circular shells), so they look the same as in Lesson 1.
 * Every drawn atom is real: its nucleus holds the protons and neutrons of the element's commonest isotope, and its
 * electrons are placed by the rules taught here (2, then up to 8, then up to 8, then a fourth shell), via structure().
 * Exam-style drawings (circles with crosses) are shown beside them as the way students draw it themselves.
 */
const { ink, muted, protonFill, protonLine, electronLine, shellLine, space, spaceLine, panelFill, panelLine } = atomPalette
const faded = 0.3
const r1 = (n: number) => Math.round(n * 10) / 10

// Atomic number and neutrons of the commonest isotope.
const ELEMENTS = {
  H: { name: 'hydrogen', z: 1, n: 0 }, He: { name: 'helium', z: 2, n: 2 }, Li: { name: 'lithium', z: 3, n: 4 }, Be: { name: 'beryllium', z: 4, n: 5 },
  N: { name: 'nitrogen', z: 7, n: 7 }, O: { name: 'oxygen', z: 8, n: 8 }, Ne: { name: 'neon', z: 10, n: 10 }, Na: { name: 'sodium', z: 11, n: 12 },
  Al: { name: 'aluminium', z: 13, n: 14 }, Si: { name: 'silicon', z: 14, n: 14 }, P: { name: 'phosphorus', z: 15, n: 16 }, Ar: { name: 'argon', z: 18, n: 22 },
} as const
type Symbol = keyof typeof ELEMENTS
const CAPACITY = [2, 8, 8, 2]
/** Electrons per shell for the first 20 elements: 2, then up to 8, then up to 8, then the rest. */
function structure(z: number) {
  const shells: number[] = []
  let left = z
  for (const cap of CAPACITY) { if (left <= 0) break; const k = Math.min(cap, left); shells.push(k); left -= k }
  return shells
}
const written = (s: number[]) => s.join(',')

function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Badge({ n, x, y, active = false, colour = ink, r = 12 }: { n: number | string; x: number; y: number; active?: boolean; colour?: string; r?: number }) {
  return <g><circle cx={x} cy={y} r={r} fill={active ? colour : 'white'} stroke={active ? colour : ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={active ? 'white' : ink}>{n}</text></g>
}
function Pointer({ n, x, y, to }: { n: number; x: number; y: number; to: [number, number] }) {
  const angle = Math.atan2(to[1] - y, to[0] - x)
  return <g><path d={`M${r1(x + Math.cos(angle) * 13)} ${r1(y + Math.sin(angle) * 13)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
    <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}
const onCircle = (cx: number, cy: number, r: number, deg: number): [number, number] => [r1(cx + Math.cos(deg * Math.PI / 180) * r), r1(cy + Math.sin(deg * Math.PI / 180) * r)]

// ---------- A Bohr atom in the Lesson 1 style ----------
// Same start angles as Lesson 1 for shells 1–3 (so lithium etc. look identical), plus one for a fourth shell.
const START = [180, -90, -45, -90]
type ShellLook = 'on' | 'active' | 'empty'
/**
 * `show` is how many electrons to draw on each shell (defaults to the full structure).
 * `slots` draws the outer shell on an 8-place grid with dashed empty places (to show room left).
 */
function BohrAtom({ cx, cy, symbol, radii, er = 8, show, looks, slots = false, cloud = true, highlightOuter = false }: { cx: number; cy: number; symbol: Symbol; radii: number[]; er?: number; show?: number[]; looks?: ShellLook[]; slots?: boolean; cloud?: boolean; highlightOuter?: boolean }) {
  const el = ELEMENTS[symbol], full = structure(el.z), counts = show ?? full
  const shellCount = looks ? looks.length : full.length
  const total = el.z + el.n
  const nr = Math.min(er * 1.25, (radii[0] - er - 3) / (1.1 * Math.sqrt(Math.max(total - 0.7, .3)) + 1.7))
  const outer = radii[shellCount - 1]
  const signs = er >= 7.5
  return <g>
    {cloud && <circle cx={cx} cy={cy} r={r1(outer + er + 7)} fill={space} stroke={spaceLine} strokeWidth="1.5" />}
    {radii.slice(0, shellCount).map((radius, i) => {
      const look = looks?.[i] ?? 'on', isOuter = highlightOuter && i === shellCount - 1
      return <circle key={`s${i}`} cx={cx} cy={cy} r={radius} fill="none" stroke={look === 'active' || isOuter ? electronLine : shellLine} strokeWidth={look === 'active' || isOuter ? 3 : 1.8} strokeDasharray={look === 'empty' ? '5 6' : undefined} opacity={look === 'empty' ? .55 : 1} />
    })}
    {counts.map((count, s) => {
      const gridded = slots && s === full.length - 1 && CAPACITY[s] > count
      const places = gridded ? CAPACITY[s] : count
      return Array.from({ length: places }, (_, j) => {
        const a = (START[s] + j * 360 / places) * Math.PI / 180, x = cx + Math.cos(a) * radii[s], y = cy + Math.sin(a) * radii[s]
        if (j >= count) return <circle key={`${s}-${j}`} cx={r1(x)} cy={r1(y)} r={er} fill="white" stroke={electronLine} strokeWidth="1.5" strokeDasharray="3 3" />
        return <Electron key={`${s}-${j}`} x={x} y={y} r={er} sign={signs} />
      })
    })}
    <Nucleus cx={cx} cy={cy} protons={el.z} neutrons={el.n} r={r1(nr)} mode="full" signs={false} />
  </g>
}

// ---------- Exam-style drawing: circles, crosses and the symbol ----------
function Cross({ x, y, s = 5.5 }: { x: number; y: number; s?: number }) {
  return <path data-particle="electron" d={`M${r1(x - s)} ${r1(y - s)}L${r1(x + s)} ${r1(y + s)}M${r1(x + s)} ${r1(y - s)}L${r1(x - s)} ${r1(y + s)}`} stroke={electronLine} strokeWidth="2.6" />
}
function ExamAtom({ cx, cy, symbol, radii, badges = false }: { cx: number; cy: number; symbol: Symbol; radii: number[]; badges?: boolean }) {
  const shells = structure(ELEMENTS[symbol].z)
  return <g>
    {shells.map((_, i) => <circle key={i} cx={cx} cy={cy} r={radii[i]} fill="none" stroke={ink} strokeWidth="1.6" />)}
    {shells.map((count, s) => Array.from({ length: count }, (_, j) => {
      const [x, y] = onCircle(cx, cy, radii[s], START[s] + j * 360 / count)
      return <Cross key={`${s}-${j}`} x={x} y={y} />
    }))}
    <circle cx={cx} cy={cy} r={18} fill={protonFill} stroke={protonLine} strokeWidth="1.5" opacity=".35" />
    <text x={cx} y={cy + 6} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{symbol}</text>
    {badges && shells.map((_, i) => { const [x, y] = onCircle(cx, cy, radii[i], -67.5 + (i === 0 ? -22.5 : 0)); return <Badge key={`b${i}`} n={i + 1} x={x} y={y} r={11} /> })}
  </g>
}

// ---------- Section 1: filling one silicon atom (14 electrons: 2, 8, 4) ----------
const FILL_STEP: Record<string, number> = { 'shell-fill-shells': 0, 'shell-fill-first': 1, 'shell-fill-second': 2, 'shell-fill-third': 3, 'shell-fill-all': 4 }
const FILL_SHOW = [[], [2], [2, 8], [2, 8, 4], [2, 8, 4]]
const FILL_TITLES = [
  'A silicon atom with its nucleus and three empty electron shells drawn as dashed circles. A table beside it shows the first shell holds 2 electrons and the second and third hold up to 8. 14 electrons are still to place.',
  'Step 1: the first shell, closest to the nucleus, fills first. It holds 2 electrons, now full. 12 electrons are still to place.',
  'Step 2: the second shell fills next with 8 electrons, now full. 10 electrons are placed and 4 are still to place.',
  'Step 3: the last 4 electrons go into the third shell, which can hold up to 8, so it is only partly filled. This is the outer shell.',
  'The whole silicon atom: 2 electrons in the first shell, 8 in the second and 4 in the third. 2 + 8 + 4 = 14 electrons. Potassium and calcium, elements 19 and 20, start a fourth shell.',
]
function SlotRow({ x, y, capacity, filled, active, r = 7, gap = 23, dim = false }: { x: number; y: number; capacity: number; filled: number; active: boolean; r?: number; gap?: number; dim?: boolean }) {
  return <g opacity={dim ? faded + .15 : 1}>{Array.from({ length: capacity }, (_, j) => j < filled
    ? <Electron key={j} x={x + j * gap} y={y} r={r} sign={false} icon />
    : <circle key={j} cx={x + j * gap} cy={y} r={r} fill="white" stroke={active ? electronLine : shellLine} strokeWidth="1.5" strokeDasharray="3 3" />)}</g>
}
function FillAtom({ focus }: { focus: string }) {
  const step = FILL_STEP[focus] ?? 4
  const show = FILL_SHOW[step], placed = show.reduce((a, b) => a + b, 0)
  const looks: ShellLook[] = [0, 1, 2].map(i => step === 4 ? 'on' : i + 1 === step ? 'active' : i + 1 < step ? 'on' : 'empty')
  const rows = [{ label: '1st shell', cap: 'holds 2' }, { label: '2nd shell', cap: 'up to 8' }, { label: '3rd shell', cap: 'up to 8' }]
  const kx = 330
  return <Diagram viewBox="0 0 540 310" title={FILL_TITLES[step]}>
    <BohrAtom cx={160} cy={155} symbol="Si" radii={[58, 96, 134]} show={show} looks={looks} />
    <text x={kx - 6} y={30} fontSize="15" fontWeight="700" fill={ink}>silicon: 14 electrons</text>
    {rows.map((row, i) => {
      const y = 62 + i * 66, active = step === i + 1, dim = step > 0 && step < 4 && i + 1 > step
      return <g key={row.label}>
        {active && <rect x={kx - 12} y={y - 18} width={206} height={60} rx="8" fill="#e8f2fa" />}
        <text x={kx - 4} y={y} fontSize="14" fontWeight="700" fill={active ? electronLine : ink} opacity={dim ? .55 : 1}>{row.label}</text>
        <text x={kx + 188} y={y} textAnchor="end" fontSize="13" fill={muted} opacity={dim ? .55 : 1}>{row.cap}</text>
        <SlotRow x={kx + 6} y={y + 22} capacity={CAPACITY[i]} filled={show[i] ?? 0} active={active} dim={dim} />
      </g>
    })}
    <path d={`M${kx - 12} 262H${kx + 194}`} stroke={panelLine} strokeWidth="1.5" />
    {step < 4
      ? <text x={kx - 4} y={286} fontSize="14" fill={ink}>placed <tspan fontWeight="700">{placed}</tspan> · still to place <tspan fontWeight="700">{14 - placed}</tspan></text>
      : <g><text x={kx - 4} y={284} fontSize="15" fontWeight="700" fill={ink}>2 + 8 + 4 = 14 electrons</text>
        <text x={kx - 4} y={303} fontSize="12" fill={muted}>elements 19 and 20: a 4th shell</text></g>}
  </Diagram>
}

// ---------- Section 2: writing it down ----------
function WriteDiagram() {
  return <Diagram viewBox="0 0 540 290" title="Two drawings of the same silicon atom. Left: the course drawing, with blue electrons on shells. Right: the way to draw it yourself, a circle for each shell and a cross for each electron: 2 on the first shell, 8 on the second and 4 on the third, with Si in the middle.">
    <BohrAtom cx={128} cy={130} symbol="Si" radii={[36, 62, 88]} er={5.5} />
    <text x={128} y={262} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>in these lessons</text>
    <path d="M246 130H280" stroke={ink} strokeWidth="2.5" /><path d="M272 121L284 130L272 139" fill="none" stroke={ink} strokeWidth="2.5" />
    <ExamAtom cx={400} cy={130} symbol="Si" radii={[34, 64, 94]} />
    <text x={400} y={262} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>how you draw it</text>
    <text x={400} y={282} textAnchor="middle" fontSize="13" fill={muted}>circle = shell · dot or × = electron</text>
  </Diagram>
}
function WriteNumbers() {
  const digits = [{ d: '2', x: 330 }, { d: '8', x: 400 }, { d: '4', x: 470 }]
  return <Diagram viewBox="0 0 540 280" schematic={false} title="The silicon drawing with its shells numbered 1, 2 and 3 from the inside out. Beside it the electronic structure is written as numbers, 2,8,4: 2 electrons in shell 1, 8 in shell 2 and 4 in shell 3. The numbers add up to 14.">
    <ExamAtom cx={140} cy={140} symbol="Si" radii={[40, 76, 112]} badges />
    <g fontSize="60" fontWeight="700" fill={ink} textAnchor="middle">
      {digits.map(({ d, x }) => <text key={x} x={x} y={120}>{d}</text>)}
      <text x={365} y={120}>,</text><text x={435} y={120}>,</text>
    </g>
    {digits.map(({ x }, i) => <g key={x}><Badge n={i + 1} x={x} y={152} r={11} /><text x={x} y={184} textAnchor="middle" fontSize="13" fill={muted}>{['1st', '2nd', '3rd'][i]} shell</text></g>)}
    <path d="M320 206H474" stroke={muted} strokeWidth="1.8" /><path d="M466 200L476 206L466 212" fill="none" stroke={muted} strokeWidth="1.8" />
    <text x={400} y={228} textAnchor="middle" fontSize="13" fill={muted}>inner shell first, outwards</text>
    <text x={400} y={262} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>2 + 8 + 4 = 14 electrons</text>
  </Diagram>
}
const ROW: Symbol[] = ['H', 'Be', 'O', 'Ne', 'Na']
function WriteExamples() {
  return <Diagram viewBox="0 0 600 240" title="Five atoms with their electronic structures written underneath: hydrogen 1, beryllium 2,2, oxygen 2,6, neon 2,8 and sodium 2,8,1. In each, the numbers add up to the atomic number.">
    {ROW.map((sym, i) => {
      const el = ELEMENTS[sym], cx = 60 + i * 120
      return <g key={sym}>
        <text x={cx} y={24} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{el.name}</text>
        <BohrAtom cx={cx} cy={98} symbol={sym} radii={[23, 36, 48]} er={4.5} />
        <text x={cx} y={190} textAnchor="middle" fontSize="22" fontWeight="700" fill={electronLine}>{written(structure(el.z))}</text>
        <text x={cx} y={214} textAnchor="middle" fontSize="12" fill={muted}>atomic number {el.z}</text>
      </g>
    })}
  </Diagram>
}

// ---------- Section 3: full and not-full outer shells ----------
function StableFull() {
  const atoms: Array<{ sym: Symbol; radii: number[] }> = [{ sym: 'He', radii: [34] }, { sym: 'Ne', radii: [30, 54] }, { sym: 'Ar', radii: [30, 52, 74] }]
  return <Diagram viewBox="0 0 540 270" title="Helium 2, neon 2,8 and argon 2,8,8. The outer shell of each is highlighted and is full, so these atoms are stable and hardly react.">
    {atoms.map(({ sym, radii }, i) => {
      const cx = 90 + i * 180, el = ELEMENTS[sym]
      return <g key={sym}>
        <BohrAtom cx={cx} cy={110} symbol={sym} radii={radii} er={6} highlightOuter />
        <text x={cx} y={214} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{el.name} <tspan fill={electronLine}>{written(structure(el.z))}</tspan></text>
      </g>
    })}
    <rect x={120} y={230} width={300} height={32} rx="16" fill="#e8f2fa" stroke={electronLine} strokeWidth="1.5" />
    <text x={270} y={251} textAnchor="middle" fontSize="14" fontWeight="700" fill={electronLine}>full outer shell → stable</text>
  </Diagram>
}
function StableNotFull() {
  const atoms: Array<{ sym: Symbol; note: string }> = [{ sym: 'Li', note: '1 electron, room for 7 more' }, { sym: 'O', note: '6 electrons, room for 2 more' }]
  return <Diagram viewBox="0 0 540 300" title="Lithium 2,1 and oxygen 2,6. Their outer shells are highlighted and are not full: dashed empty places show the room left. Lithium's outer shell has 1 electron and room for 7 more; oxygen's has 6 and room for 2 more. Atoms like these react.">
    {atoms.map(({ sym, note }, i) => {
      const cx = 135 + i * 270, el = ELEMENTS[sym]
      return <g key={sym}>
        <BohrAtom cx={cx} cy={112} symbol={sym} radii={[40, 76]} er={7} slots highlightOuter />
        <text x={cx} y={222} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{el.name} <tspan fill={electronLine}>{written(structure(el.z))}</tspan></text>
        {note.split(', ').map((l, j) => <text key={j} x={cx} y={242 + j * 17} textAnchor="middle" fontSize="13" fill={muted}>{j ? l : `outer shell: ${l}`}</text>)}
      </g>
    })}
    <circle cx={186} cy={286} r={6} fill="white" stroke={electronLine} strokeWidth="1.5" strokeDasharray="3 3" />
    <text x={198} y={290} fontSize="12" fill={muted}>= room for one more electron</text>
  </Diagram>
}
function StableAll() {
  const sides: Array<{ sym: Symbol; radii: number[]; head: string; lines: string[]; fill: string; line: string }> = [
    { sym: 'Ne', radii: [32, 58], head: 'outer shell full', lines: ['stable:', 'hardly reacts'], fill: '#e8f2fa', line: electronLine },
    { sym: 'Na', radii: [26, 48, 70], head: 'outer shell not full', lines: ['reacts to get a', 'full outer shell'], fill: '#fde8e4', line: protonLine },
  ]
  return <Diagram viewBox="0 0 540 290" title="Neon, 2,8, has a full outer shell, so it is stable and hardly reacts. Sodium, 2,8,1, has only 1 electron in its outer shell, so it is not full and sodium reacts to get a full outer shell.">
    {sides.map((side, i) => {
      const cx = 135 + i * 270, el = ELEMENTS[side.sym]
      return <g key={side.sym}>
        <BohrAtom cx={cx} cy={98} symbol={side.sym} radii={side.radii} er={6} highlightOuter />
        <text x={cx} y={198} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{el.name} <tspan fill={electronLine}>{written(structure(el.z))}</tspan></text>
        <rect x={cx - 110} y={210} width={220} height={70} rx="10" fill={side.fill} stroke={side.line} strokeWidth="1.5" />
        <text x={cx} y={232} textAnchor="middle" fontSize="14" fontWeight="700" fill={side.line}>{side.head}</text>
        {side.lines.map((l, j) => <text key={j} x={cx} y={252 + j * 18} textAnchor="middle" fontSize="14" fill={ink}>{l}</text>)}
      </g>
    })}
    <path d="M270 30V270" stroke={panelLine} strokeWidth="2" strokeDasharray="5 5" />
  </Diagram>
}

// ---------- Section 4: working it out from the atomic number (nitrogen 2,5; aluminium set-up) ----------
const RULE_STEP: Record<string, number> = { 'shell-rule-count': 1, 'shell-rule-fill': 2, 'shell-rule-check': 3 }
function Tile({ x, y, symbol, highlight }: { x: number; y: number; symbol: Symbol; highlight: boolean }) {
  const el = ELEMENTS[symbol]
  return <g>
    <rect x={x} y={y} width={104} height={104} rx="10" fill={panelFill} stroke={highlight ? electronLine : panelLine} strokeWidth={highlight ? 2.5 : 2} />
    <text x={x + 10} y={y + 24} fontSize="16" fontWeight="700" fill={protonLine}>{el.z}</text>
    <text x={x + 52} y={y + 70} textAnchor="middle" fontSize="40" fontWeight="700" fill={ink}>{symbol}</text>
    <text x={x + 52} y={y + 94} textAnchor="middle" fontSize="13" fill={ink}>{el.name}</text>
  </g>
}
function Strip({ x, y, filled, highlight }: { x: number; y: number; filled: number[]; highlight: boolean }) {
  return <g>
    <rect x={x - 10} y={y - 22} width={206} height={146} rx="10" fill={panelFill} stroke={highlight ? electronLine : panelLine} strokeWidth={highlight ? 2.5 : 1.5} />
    {[0, 1, 2].map(i => <g key={i}>
      <text x={x} y={y + 5 + i * 44} fontSize="13" fontWeight="700" fill={ink}>{['1st', '2nd', '3rd'][i]}</text>
      <SlotRow x={x + 46} y={y + i * 44} capacity={CAPACITY[i]} filled={filled[i] ?? 0} active={highlight} r={6} gap={19} />
    </g>)}
  </g>
}
function RuleSteps({ focus }: { focus: string }) {
  const worked = focus === 'shell-worked'
  const step = worked ? 1 : RULE_STEP[focus] ?? 3
  const sym: Symbol = worked ? 'Al' : 'N', el = ELEMENTS[sym]
  const filled = step >= 2 ? structure(el.z) : []
  const panel = (n: number) => worked ? (n === 1 ? 1 : .5) : step === n ? 1 : step > n ? .9 : faded
  const heads = ['count', 'fill in order', 'check']
  const title = worked
    ? 'Aluminium, atomic number 13, on an element tile, and an empty set of shells beside it: the first shell holds 2 and the second and third hold up to 8. Work out how the 13 electrons fill them.'
    : ['', 'Step 1: nitrogen\'s tile shows atomic number 7, so a nitrogen atom has 7 protons and 7 electrons.',
      'Step 2: the 7 electrons fill the shells in order: 2 in the first shell, then the other 5 in the second. So nitrogen is 2,5.',
      'Step 3: check. 2 + 5 = 7, the atomic number, and no shell holds more than it is allowed. The nitrogen atom is drawn with 2 electrons on its first shell and 5 on its second.'][step]
  return <Diagram viewBox="0 0 540 250" schematic={!worked} title={title}>
    {heads.map((h, i) => <g key={h} opacity={panel(i + 1)}>
      <Badge n={i + 1} x={[30, 176, 406][i]} y={24} active={!worked && step === i + 1} colour={electronLine} />
      <text x={[48, 194, 424][i]} y={29} fontSize="14" fontWeight="700" fill={ink}>{h}</text>
    </g>)}
    <g opacity={panel(1)}>
      <Tile x={20} y={50} symbol={sym} highlight={step === 1 && !worked} />
      <text x={72} y={182} textAnchor="middle" fontSize="13" fill={ink}>atomic number {el.z}</text>
      <text x={72} y={202} textAnchor="middle" fontSize="14" fontWeight="700" fill={electronLine}>→ {el.z} electrons</text>
    </g>
    <g opacity={panel(2)}>
      <Strip x={186} y={78} filled={filled} highlight={step === 2 && !worked} />
      {!worked && step >= 2 && <text x={283} y={232} textAnchor="middle" fontSize="18" fontWeight="700" fill={electronLine}>{written(filled)}</text>}
      {worked && <text x={283} y={232} textAnchor="middle" fontSize="14" fill={muted}>2, then up to 8, then up to 8</text>}
    </g>
    <g opacity={panel(3)}>
      {!worked && step >= 3
        ? <><BohrAtom cx={462} cy={112} symbol="N" radii={[30, 52]} er={5.5} />
          <text x={462} y={202} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>2 + 5 = 7 ✓</text>
          <text x={462} y={222} textAnchor="middle" fontSize="13" fill={muted}>no shell over its limit ✓</text></>
        : <><circle cx={462} cy={112} r={62} fill={panelFill} stroke={panelLine} strokeWidth="1.5" strokeDasharray="6 6" />
          <text x={462} y={120} textAnchor="middle" fontSize="26" fontWeight="700" fill={muted}>?</text></>}
    </g>
  </Diagram>
}

// ---------- On your own: a phosphorus atom (2,8,5) with numbered shells ----------
function ShellQuestion({ assessment }: { assessment: boolean }) {
  const cx = assessment ? 250 : 160, cy = 150, radii = [50, 86, 122]
  return <Diagram viewBox="0 0 540 300" title={assessment ? 'A drawing of an atom with three electron shells numbered 1, 2 and 3.' : 'A phosphorus atom. Shell 1 has 2 electrons, shell 2 has 8 and shell 3 has 5, so its electronic structure is 2,8,5, 15 electrons in all.'}>
    <BohrAtom cx={cx} cy={cy} symbol="P" radii={radii} er={7.5} />
    <Pointer n={1} x={cx - 36} y={18} to={onCircle(cx, cy, radii[0], -115)} />
    <Pointer n={2} x={cx + 48} y={18} to={onCircle(cx, cy, radii[1], -67.5)} />
    <Pointer n={3} x={cx + 150} y={cy + 118} to={onCircle(cx, cy, radii[2], 63)} />
    {!assessment && <g>
      {[['shell 1: 2 electrons'], ['shell 2: 8 electrons'], ['shell 3: 5 electrons']].map(([l], i) => <g key={l}><Badge n={i + 1} x={352} y={70 + i * 44} /><text x={372} y={75 + i * 44} fontSize="14" fontWeight="600" fill={ink}>{l}</text></g>)}
      <path d="M340 190H530" stroke={panelLine} strokeWidth="1.5" />
      <text x={344} y={218} fontSize="16" fontWeight="700" fill={electronLine}>2,8,5</text>
      <text x={344} y={240} fontSize="14" fill={ink}>15 electrons: phosphorus</text>
    </g>}
  </Diagram>
}

export function ElectronVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('shell-fill-')) return <FillAtom focus={focus} />
  if (focus === 'shell-write-diagram') return <WriteDiagram />
  if (focus === 'shell-write-numbers') return <WriteNumbers />
  if (focus === 'shell-write-examples') return <WriteExamples />
  if (focus === 'shell-stable-full') return <StableFull />
  if (focus === 'shell-stable-notfull') return <StableNotFull />
  if (focus === 'shell-stable-all') return <StableAll />
  if (focus.startsWith('shell-rule-') || focus === 'shell-worked') return <RuleSteps focus={focus} />
  if (focus === 'shell-question') return <ShellQuestion assessment={assessment} />
  return <FillAtom focus="shell-fill-all" />
}
