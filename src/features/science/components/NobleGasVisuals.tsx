import { useId, type ReactNode } from 'react'
import { Arrow } from './InfectionVisuals'
import { atomPalette, Electron, Nucleus } from './AtomVisuals'

/*
 * Chemistry C1b (Chemistry Lesson 11): Group 0, the noble gases. Original, code-native schematics.
 * Focus ids start with 'noble-'.
 *
 * Colour code (the Chemistry palette from AtomVisuals, plus the group tints PeriodicVisuals uses):
 *   Group 0 tiles and noble gas atoms in particle pictures = soft grey (the tint PeriodicVisuals gives carbon's group),
 *   because noble gases are the "quiet", unreactive family. Coral red (the proton colour) marks what a frame is about.
 *   Oxygen molecules = amber (oxygen's group tint), water = electron blue (water is blue across the course),
 *   nitrogen = plain panel white. Bohr atoms use the Lesson 1 particle colours (proton coral, neutron grey, electron blue).
 * Data are real: relative atomic masses as on the source page (He 4 … Rn 222); boiling points rounded to the nearest °C.
 */
const { ink, muted, protonFill, protonLine, electronLine, shellLine, space, spaceLine, glow, panelFill, panelLine } = atomPalette
const faded = 0.3
const r1 = (n: number) => Math.round(n * 10) / 10
const greyFill = '#eef1f3', greyLine = '#7f8c97', atomGrey = '#dfe5ea'
const amberFill = '#fde3bd', amberLine = '#d9a55b', amberInk = '#8a5a14'
const waterFill = '#cfe4f5'
const good = '#35785a', goodFill = '#eaf5ee'

const NOBLE = [
  { sym: 'He', name: 'helium', mass: '4', z: 2, n: 2, bp: -269 },
  { sym: 'Ne', name: 'neon', mass: '20', z: 10, n: 10, bp: -246 },
  { sym: 'Ar', name: 'argon', mass: '40', z: 18, n: 22, bp: -186 },
  { sym: 'Kr', name: 'krypton', mass: '84', z: 36, n: 48, bp: -153 },
  { sym: 'Xe', name: 'xenon', mass: '131', z: 54, n: 77, bp: -108 },
  { sym: 'Rn', name: 'radon', mass: '222', z: 86, n: 136, bp: -62 },
] as const
const deg = (t: number) => `${t < 0 ? '−' : ''}${Math.abs(t)}`

function Diagram({ title, children, viewBox = '0 0 540 320', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Pointer({ n, x, y, to }: { n: number; x: number; y: number; to: [number, number] }) {
  const angle = Math.atan2(to[1] - y, to[0] - x)
  return <g><path d={`M${r1(x + Math.cos(angle) * 13)} ${r1(y + Math.sin(angle) * 13)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
    <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}
type Kind = 'b' | 'n' | 'm' | 'r' | 'g'
function Notes({ x, y, lines, anchor = 'start' }: { x: number; y: number; lines: Array<[string, Kind]>; anchor?: 'start' | 'middle' }) {
  const fill = { b: ink, n: ink, m: muted, r: protonLine, g: good }
  let dy = 0
  return <g>{lines.map(([text, kind], i) => {
    const el = text === '' ? null : <text key={i} x={x} y={y + dy} textAnchor={anchor} fontWeight={kind === 'n' || kind === 'm' ? 400 : 700} fontSize={kind === 'm' ? 13 : 14} fill={fill[kind]}>{text}</text>
    dy += text === '' ? 10 : 18
    return el
  })}</g>
}
function Tick({ x, y, colour = good }: { x: number; y: number; colour?: string }) {
  return <g><circle cx={x} cy={y} r="11" fill={colour} /><path d={`M${x - 5} ${y}L${x - 1} ${y + 4}L${x + 5} ${y - 4}`} fill="none" stroke="white" strokeWidth="2.4" /></g>
}
function Bang({ x, y }: { x: number; y: number }) {
  return <g><circle cx={x} cy={y} r="11" fill={protonFill} stroke={protonLine} strokeWidth="1.5" /><text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="white">!</text></g>
}

// ---------- A Group 0 tile ----------
type TileLook = 'plain' | 'active' | 'faded' | 'blank'
function Tile({ x, y, w = 56, h = 36, sym, look = 'plain' }: { x: number; y: number; w?: number; h?: number; sym: string; look?: TileLook }) {
  const hot = look === 'active'
  return <g opacity={look === 'faded' ? faded + .1 : 1}>
    <rect x={x} y={y} width={w} height={h} rx="7" fill={hot ? glow : greyFill} stroke={hot ? protonLine : greyLine} strokeWidth={hot ? 2.6 : 1.8} />
    {look !== 'blank' && <text x={x + w / 2} y={y + h / 2 + 7} textAnchor="middle" fontSize="20" fontWeight="700" fill={hot ? protonLine : ink}>{sym}</text>}
  </g>
}

// ---------- Section 1: where Group 0 is, and who is in it ----------
// Periods 1–6 of the table outline (lanthanides and actinides left out): which of the 18 columns hold an element.
const hasCell = (period: number, col: number) => period === 1 ? col === 1 || col === 18 : period <= 3 ? col <= 2 || col >= 13 : true
function TableOutline() {
  const w = 24, step = 26, x0 = 36, y0 = 58
  return <Diagram viewBox="0 0 540 290" schematic={false} title="An outline of the periodic table, periods 1 to 6. The column on the far right is highlighted: Group 0, holding helium, neon, argon, krypton, xenon and radon. Group 1 is the column on the far left.">
    <text x={x0} y={24} fontSize="15" fontWeight="700" fill={ink}>The periodic table (outline)</text>
    <text x={x0 + w / 2} y={50} textAnchor="middle" fontSize="12" fontWeight="700" fill={muted}>1</text>
    <text x={x0 + 17 * step + w / 2} y={50} textAnchor="middle" fontSize="13" fontWeight="700" fill={protonLine}>0</text>
    {Array.from({ length: 6 }, (_, p) => Array.from({ length: 18 }, (_, c) => {
      if (!hasCell(p + 1, c + 1)) return null
      const x = x0 + c * step, y = y0 + p * step
      if (c === 17) return <g key={`${p}-${c}`}>
        <rect x={x} y={y} width={w} height={w} rx="4" fill={glow} stroke={protonLine} strokeWidth="2" />
        <text x={x + w / 2} y={y + 17} textAnchor="middle" fontSize="12" fontWeight="700" fill={protonLine}>{NOBLE[p].sym}</text>
      </g>
      return <rect key={`${p}-${c}`} x={x} y={y} width={w} height={w} rx="4" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    }))}
    <text x={x0 - 8} y={y0 + 17} textAnchor="end" fontSize="12" fill={muted}>1</text>
    <text x={x0 - 8} y={y0 + 5 * step + 17} textAnchor="end" fontSize="12" fill={muted}>6</text>
    <text x={x0 - 8} y={y0 + 2.5 * step + 17} textAnchor="end" fontSize="12" fill={muted}>…</text>
    <path d={`M${x0 + 17 * step + w / 2} ${y0 + 6 * step + 4}V${y0 + 6 * step + 26}`} stroke={protonLine} strokeWidth="1.6" />
    <text x={x0 + 17 * step + w} y={y0 + 6 * step + 44} textAnchor="end" fontSize="14" fontWeight="700" fill={protonLine}>Group 0: the column on the far right</text>
    <text x={x0} y={y0 + 6 * step + 44} fontSize="13" fill={muted}>Group 1 is on the far left.</text>
  </Diagram>
}

// The Group 0 column as a table: tiles, names, then optional data columns.
type ColKey = 'mass' | 'e' | 'bp'
const COLS: Record<ColKey, { cx: number; head: [string, string]; value: (i: number) => string }> = {
  mass: { cx: 258, head: ['relative', 'atomic mass'], value: i => NOBLE[i].mass },
  e: { cx: 362, head: ['electrons', 'in each atom'], value: i => String(NOBLE[i].z) },
  bp: { cx: 462, head: ['boiling', 'point (°C)'], value: i => deg(NOBLE[i].bp) },
}
const ROW_Y = (i: number) => 84 + i * 42
function GroupTable({ show, active, title, names = true, rowLooks, extra, heading = 26 }: { show: ColKey[]; active?: ColKey; title: string; names?: boolean; rowLooks?: TileLook[]; extra?: ReactNode; heading?: number }) {
  return <Diagram viewBox={`0 0 540 ${active ? 364 : 340}`} schematic={false} title={title}>
    <text x={24} y={heading} fontSize="15" fontWeight="700" fill={ink}>Group 0, top to bottom</text>
    {show.map(k => {
      const col = COLS[k], on = !active || active === k
      return <g key={k} opacity={on ? 1 : .55}>
        {active === k && <rect x={col.cx - 50} y={38} width={100} height={ROW_Y(5) + 44 - 38} rx="10" fill={glow} />}
        <text x={col.cx} y={54} textAnchor="middle" fontSize="13" fontWeight="700" fill={active === k ? protonLine : ink}>{col.head[0]}</text>
        <text x={col.cx} y={70} textAnchor="middle" fontSize="13" fontWeight="700" fill={active === k ? protonLine : ink}>{col.head[1]}</text>
        {NOBLE.map((_, i) => <text key={i} x={col.cx} y={ROW_Y(i) + 24} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{col.value(i)}</text>)}
        {active === k && <g>
          <Arrow x1={col.cx + 40} y1={ROW_Y(0) + 8} x2={col.cx + 40} y2={ROW_Y(5) + 30} colour={protonLine} width={2.5} />
          <text x={col.cx} y={ROW_Y(5) + 70} textAnchor="middle" fontSize="14" fontWeight="700" fill={protonLine}>increases</text>
        </g>}
      </g>
    })}
    {NOBLE.map((el, i) => <g key={el.sym}>
      <Tile x={24} y={ROW_Y(i)} sym={el.sym} look={rowLooks?.[i] ?? 'plain'} />
      {names && <text x={92} y={ROW_Y(i) + 24} fontSize="15" fontWeight="600" fill={ink} opacity={rowLooks?.[i] === 'faded' ? faded + .1 : 1}>{el.name}</text>}
    </g>)}
    {extra}
  </Diagram>
}
function Members() {
  return <GroupTable show={[]} heading={62} title="The six elements of Group 0, top to bottom: helium (He), neon (Ne), argon (Ar), krypton (Kr), xenon (Xe) and radon (Rn). Together they are called the noble gases." extra={<g>
    <path d="M186 88H198V314H186" fill="none" stroke={protonLine} strokeWidth="2.5" />
    <Notes x={216} y={176} lines={[['the noble gases', 'r'], ['', 'n'], ['all six are gases', 'n'], ['they rarely react with anything', 'n']]} />
  </g>} />
}
function Jar({ x, name }: { x: number; name: string }) {
  const y = 50, w = 104, h = 150
  return <g>
    <rect x={x + 30} y={y - 16} width={w - 60} height={20} rx="4" fill={greyFill} stroke={greyLine} strokeWidth="1.8" />
    <rect x={x} y={y} width={w} height={h} rx="16" fill={space} stroke={spaceLine} strokeWidth="2.5" />
    <path d={`M${x + 14} ${y + 20}V${y + h - 30}`} stroke="white" strokeWidth="6" opacity=".9" />
    <text x={x + w / 2} y={y + h + 26} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{name}</text>
  </g>
}
function Colourless() {
  return <Diagram viewBox="0 0 540 290" title="Three sealed glass jars, each full of a noble gas: helium, neon and argon. All three look empty because the gases are colourless. Every noble gas is a gas at room temperature.">
    <Jar x={40} name="helium" />
    <Jar x={218} name="neon" />
    <Jar x={396} name="argon" />
    <text x={270} y={256} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>Each jar is full of gas, but looks empty.</text>
    <text x={270} y={278} textAnchor="middle" fontSize="13" fill={muted}>At room temperature every noble gas is a colourless gas.</text>
  </Diagram>
}

// ---------- Section 2: full outer shells ----------
const START = [180, -90, -45]
function NobleAtom({ cx, cy, i, radii, er = 6, active, look }: { cx: number; cy: number; i: 0 | 1 | 2; radii: number[]; er?: number; active: boolean; look: 'on' | 'faded' }) {
  const el = NOBLE[i], shells = [[2], [2, 8], [2, 8, 8]][i], outer = radii[shells.length - 1]
  const total = el.z + el.n, nr = Math.min(er * 1.25, (radii[0] - er - 3) / (1.1 * Math.sqrt(total - 0.7) + 1.7))
  return <g opacity={look === 'faded' ? faded : 1}>
    <circle cx={cx} cy={cy} r={r1(outer + er + 7)} fill={space} stroke={spaceLine} strokeWidth="1.5" />
    {shells.map((_, s) => <circle key={s} cx={cx} cy={cy} r={radii[s]} fill="none" stroke={active && s === shells.length - 1 ? electronLine : shellLine} strokeWidth={active && s === shells.length - 1 ? 3 : 1.8} />)}
    {shells.map((count, s) => Array.from({ length: count }, (_, j) => {
      const a = (START[s] + j * 360 / count) * Math.PI / 180
      return <Electron key={`${s}-${j}`} x={cx + Math.cos(a) * radii[s]} y={cy + Math.sin(a) * radii[s]} r={er} sign={false} />
    }))}
    <Nucleus cx={cx} cy={cy} protons={el.z} neutrons={el.n} r={r1(nr)} mode="full" signs={false} />
  </g>
}
type ShellStage = 'he' | 'ne-ar' | 'stable'
const SHELL_TITLES: Record<ShellStage, string> = {
  he: 'Three atoms: helium, neon and argon. Helium is highlighted: 2 electrons, both in the first shell, which is full with 2.',
  'ne-ar': 'Neon (electrons 2,8) and argon (2,8,8) are highlighted. Each has 8 electrons in its outer shell, which is full.',
  stable: 'Helium, neon and argon, each with a full outer shell highlighted. A full outer shell is stable, so the noble gases are very unreactive (inert).',
}
function Shells({ stage }: { stage: ShellStage }) {
  const radii = [30, 52, 74]
  const on = (i: number) => stage === 'stable' || (stage === 'he' ? i === 0 : i > 0)
  const atoms: Array<{ cx: number; label: string; outer: string }> = [
    { cx: 78, label: '2', outer: '2 in the outer shell' },
    { cx: 252, label: '2,8', outer: '8 in the outer shell' },
    { cx: 446, label: '2,8,8', outer: '8 in the outer shell' },
  ]
  return <Diagram viewBox="0 0 540 330" title={SHELL_TITLES[stage]}>
    {atoms.map((a, i) => <g key={i}>
      <NobleAtom cx={a.cx} cy={116} i={i as 0 | 1 | 2} radii={radii} active={on(i)} look={on(i) || stage === 'ne-ar' ? 'on' : 'faded'} />
      <g opacity={on(i) ? 1 : .45}>
        <text x={a.cx} y={228} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{NOBLE[i].name} {a.label}</text>
        <text x={a.cx} y={250} textAnchor="middle" fontSize="13" fontWeight={on(i) ? 700 : 400} fill={on(i) ? electronLine : muted}>{a.outer}</text>
        {on(i) && <text x={a.cx} y={268} textAnchor="middle" fontSize="13" fontWeight="700" fill={electronLine}>full</text>}
      </g>
    </g>)}
    {stage === 'he' && <text x={270} y={306} textAnchor="middle" fontSize="13" fill={muted}>The first shell can only hold 2 electrons.</text>}
    {stage === 'ne-ar' && <text x={270} y={306} textAnchor="middle" fontSize="13" fill={muted}>Krypton, xenon and radon also have 8 outer electrons.</text>}
    {stage === 'stable' && <g>
      <rect x={60} y={284} width={420} height={36} rx="10" fill={glow} stroke={protonLine} strokeWidth="1.5" />
      <text x={270} y={307} textAnchor="middle" fontSize="14" fontWeight="700" fill={protonLine}>full outer shell → stable → very unreactive (inert)</text>
    </g>}
  </Diagram>
}

// Particle pictures: noble gas atoms are single grey circles; oxygen molecules are amber pairs.
function GasAtom({ x, y, r = 11 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill={atomGrey} stroke={greyLine} strokeWidth="1.8" />
}
function Pair({ x, y, a = 0, fill, line, r = 10 }: { x: number; y: number; a?: number; fill: string; line: string; r?: number }) {
  const dx = Math.cos(a * Math.PI / 180) * r * .8, dy = Math.sin(a * Math.PI / 180) * r * .8
  return <g><circle cx={r1(x - dx)} cy={r1(y - dy)} r={r} fill={fill} stroke={line} strokeWidth="1.8" /><circle cx={r1(x + dx)} cy={r1(y + dy)} r={r} fill={fill} stroke={line} strokeWidth="1.8" /></g>
}
function Water({ x, y, a = 0 }: { x: number; y: number; a?: number }) {
  const h = (d: number): [number, number] => [r1(x + Math.cos((a + d) * Math.PI / 180) * 12), r1(y + Math.sin((a + d) * Math.PI / 180) * 12)]
  const [x1, y1] = h(-52), [x2, y2] = h(52)
  return <g><circle cx={x1} cy={y1} r="6.5" fill="white" stroke={electronLine} strokeWidth="1.6" /><circle cx={x2} cy={y2} r="6.5" fill="white" stroke={electronLine} strokeWidth="1.6" /><circle cx={x} cy={y} r="10" fill={waterFill} stroke={electronLine} strokeWidth="1.8" /></g>
}
const SPOTS: Array<[number, number, number]> = [[40, 44, 20], [104, 36, -30], [168, 52, 60], [60, 104, -10], [132, 100, 40], [190, 118, 0], [36, 160, 70], [100, 158, -45], [166, 172, 15], [70, 214, 30], [140, 216, -20], [196, 222, 50]]
function Single() {
  const box = (x: number) => <rect x={x} y={40} width={230} height={250} rx="14" fill={panelFill} stroke={panelLine} strokeWidth="1.8" />
  return <Diagram viewBox="0 0 540 350" title="Two boxes of gas, particles shown far bigger than life. Oxygen gas: particles are pairs of atoms joined together (molecules). Argon gas: every particle is a single atom on its own, because noble gas atoms do not easily bond.">
    <text x={140} y={26} textAnchor="middle" fontSize="15" fontWeight="700" fill={amberInk}>oxygen gas</text>
    {box(25)}
    {SPOTS.map(([x, y, a], i) => <Pair key={i} x={25 + x - 5} y={40 + y} a={a} fill={amberFill} line={amberLine} />)}
    <text x={140} y={314} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>molecules: atoms joined in pairs</text>
    <text x={400} y={26} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>argon gas</text>
    {box(285)}
    {SPOTS.map(([x, y], i) => <GasAtom key={i} x={285 + x - 5} y={40 + y} />)}
    <text x={400} y={314} textAnchor="middle" fontSize="14" fontWeight="700" fill={protonLine}>single atoms, not joined</text>
    <text x={270} y={340} textAnchor="middle" fontSize="12" fill={muted}>Real gas particles are much further apart.</text>
  </Diagram>
}

// ---------- Section 3: an unreactive atmosphere ----------
function Flask({ x, look, gas }: { x: number; look: 'on' | 'active' | 'faded'; gas: 'air' | 'argon' }) {
  const cx = x + 115, cy = 176, r = 70
  const clipId = useId()
  const body = `M${cx - 16} 60V${cy - r + 8}A${r} ${r} 0 1 0 ${cx + 16} ${cy - r + 8}V60Z`
  const air: Array<['o' | 'n' | 'w', number, number, number]> = [['n', -42, 164, 20], ['o', 28, 144, -30], ['w', -2, 176, 0], ['n', 44, 190, 70], ['o', -46, 196, 10], ['n', 10, 206, 0], ['w', -18, 134, 0]]
  const argon: Array<[number, number]> = [[-42, 158], [28, 142], [-4, 176], [44, 192], [-46, 198], [12, 208], [0, 88], [-18, 132]]
  return <g opacity={look === 'faded' ? faded + .1 : 1}>
    {look === 'active' && <rect x={x + 4} y={30} width={222} height={300} rx="16" fill={gas === 'air' ? '#fdf0ee' : goodFill} />}
    <text x={cx} y={52} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{gas === 'air' ? 'in air' : 'in argon'}</text>
    <clipPath id={clipId}><path d={body} /></clipPath>
    <path d={body} fill={space} stroke={spaceLine} strokeWidth="2.5" />
    <g clipPath={`url(#${clipId})`}>
      {gas === 'air' ? air.map(([k, dx, y, a], i) => k === 'o' ? <Pair key={i} x={cx + dx} y={y} a={a} r={8} fill={amberFill} line={amberLine} /> : k === 'n' ? <Pair key={i} x={cx + dx} y={y} a={a} r={8} fill="white" line={muted} /> : <Water key={i} x={cx + dx} y={y} a={a} />)
        : argon.map(([dx, y], i) => <GasAtom key={i} x={cx + dx} y={y} r={9} />)}
      <path d={`M${cx - 36} 240Q${cx - 20} 222 ${cx} 226Q${cx + 22} 222 ${cx + 38} 240Z`} fill={greyLine} stroke={ink} strokeWidth="1.5" />
    </g>
    <path d={body} fill="none" stroke={spaceLine} strokeWidth="2.5" />
    {gas === 'air' ? <g><Bang x={cx + 46} y={226} /><text x={cx} y={274} textAnchor="middle" fontSize="14" fontWeight="700" fill={protonLine}>oxygen and water</text><text x={cx} y={292} textAnchor="middle" fontSize="14" fontWeight="700" fill={protonLine}>react with the chemical</text></g>
      : <g><Tick x={cx + 46} y={226} /><text x={cx} y={274} textAnchor="middle" fontSize="14" fontWeight="700" fill={good}>argon does not react,</text><text x={cx} y={292} textAnchor="middle" fontSize="14" fontWeight="700" fill={good}>so the chemical is safe</text></g>}
  </g>
}
type UseStage = 'air' | 'argon' | 'both'
const USE_TITLES: Record<UseStage, string> = {
  air: 'A flask of air around a grey chemical at the bottom. The air holds nitrogen, oxygen and water molecules. Oxygen and water react with the chemical, marked with a warning sign.',
  argon: 'The same flask filled with argon atoms instead of air. Argon does not react, so the chemical is protected, marked with a tick.',
  both: 'Side by side: in air, oxygen and water react with the chemical; in argon, nothing reacts with it. A noble gas makes an unreactive (inert) atmosphere.',
}
function Atmosphere({ stage }: { stage: UseStage }) {
  const key = (x: number, node: ReactNode, label: string) => <g>{node}<text x={x + 16} y={363} fontSize="13" fill={ink}>{label}</text></g>
  return <Diagram viewBox="0 0 540 380" title={USE_TITLES[stage]}>
    <Flask x={20} gas="air" look={stage === 'air' ? 'active' : stage === 'argon' ? 'faded' : 'on'} />
    <Flask x={290} gas="argon" look={stage === 'argon' ? 'active' : stage === 'air' ? 'faded' : 'on'} />
    {stage === 'both' && <Arrow x1={252} y1={180} x2={292} y2={180} colour={ink} width={2.5} />}
    {key(36, <Pair x={24} y={358} r={7} fill={amberFill} line={amberLine} />, 'oxygen')}
    {key(142, <Water x={134} y={358} />, 'water')}
    {key(246, <Pair x={236} y={358} r={7} fill="white" line={muted} />, 'nitrogen')}
    {key(362, <GasAtom x={358} y={358} r={8} />, 'argon')}
    <text x={516} y={363} textAnchor="end" fontSize="12" fill={muted}>not to scale</text>
  </Diagram>
}

// ---------- Section 4: trends down the group ----------
const TREND_TITLES = {
  mass: 'Group 0 from helium to radon with relative atomic masses 4, 20, 40, 84, 131 and 222. Relative atomic mass increases down the group.',
  e: 'The same table with electrons in each atom added: 2, 10, 18, 36, 54 and 86. The number of electrons increases down the group.',
  bp: 'The same table with boiling points added: helium −269, neon −246, argon −186, krypton −153, xenon −108 and radon −62 degrees Celsius. Boiling point increases down the group.',
}
function Forces() {
  const pair = (cx: number, r: number, width: number, colour: string) => <g>
    <GasAtom x={cx - r - 26} y={130} r={r} />
    <GasAtom x={cx + r + 26} y={130} r={r} />
    <Arrow x1={cx - 30} y1={130} x2={cx - 6} y2={130} colour={colour} width={width} />
    <Arrow x1={cx + 30} y1={130} x2={cx + 6} y2={130} colour={colour} width={width} />
  </g>
  return <Diagram viewBox="0 0 540 280" title="Two helium atoms with thin arrows pulling them together: 2 electrons each, weak forces between the atoms. Two larger xenon atoms with thick arrows: 54 electrons each, stronger forces between the atoms.">
    <text x={135} y={34} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>helium</text>
    <text x={135} y={54} textAnchor="middle" fontSize="13" fill={muted}>2 electrons each</text>
    {pair(135, 14, 1.8, muted)}
    <text x={135} y={206} textAnchor="middle" fontSize="14" fontWeight="700" fill={muted}>weak forces</text>
    <text x={135} y={224} textAnchor="middle" fontSize="14" fontWeight="700" fill={muted}>between atoms</text>
    <path d="M270 40V230" stroke={panelLine} strokeWidth="1.5" />
    <text x={405} y={34} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>xenon</text>
    <text x={405} y={54} textAnchor="middle" fontSize="13" fill={muted}>54 electrons each</text>
    {pair(405, 30, 4.5, protonLine)}
    <text x={405} y={206} textAnchor="middle" fontSize="14" fontWeight="700" fill={protonLine}>stronger forces</text>
    <text x={405} y={224} textAnchor="middle" fontSize="14" fontWeight="700" fill={protonLine}>between atoms</text>
    <text x={270} y={264} textAnchor="middle" fontSize="13" fill={muted}>Arrows show the pull between neighbouring atoms. They are not bonds.</text>
  </Diagram>
}
function Chain() {
  const steps: Array<[string, string]> = [['relative atomic mass increases', ink], ['more electrons in each atom', ink], ['stronger forces between atoms', ink], ['more energy needed to separate them', ink], ['higher boiling point', protonLine]]
  const x = 146, w = 370, h = 38, y0 = 22, step = 56
  return <Diagram viewBox="0 0 540 312" schematic={false} title="A chain explaining the trend down Group 0: relative atomic mass increases, so there are more electrons in each atom, so stronger forces between atoms, so more energy is needed to separate them, so a higher boiling point.">
    {NOBLE.map((el, i) => <Tile key={el.sym} x={24} y={20 + i * 44} w={48} h={36} sym={el.sym} />)}
    <Arrow x1={92} y1={30} x2={92} y2={262} colour={ink} width={2.5} />
    <text x={24} y={300} fontSize="13" fontWeight="700" fill={ink}>down the group</text>
    {steps.map(([label, colour], i) => {
      const y = y0 + i * step, last = i === steps.length - 1
      return <g key={label}>
        <rect x={x} y={y} width={w} height={h} rx="10" fill={last ? glow : panelFill} stroke={last ? protonLine : panelLine} strokeWidth={last ? 2.2 : 1.6} />
        <text x={x + w / 2} y={y + 25} textAnchor="middle" fontSize="15" fontWeight="700" fill={colour}>{label}</text>
        {!last && <Arrow x1={x + w / 2} y1={y + h + 2} x2={x + w / 2} y2={y + step - 2} colour={muted} width={2} />}
      </g>
    })}
  </Diagram>
}

// ---------- Section 5: predicting from the pattern ----------
function PredictState() {
  const looks: TileLook[] = ['active', 'active', 'plain', 'faded', 'faded', 'faded']
  return <GroupTable show={[]} rowLooks={looks} title="Group 0 table. Argon is known to be a gas at 25 °C. Helium and neon, above argon, have lower boiling points, so they are predicted to be gases at 25 °C too." extra={<g>
    <text x={236} y={54} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>at 25 °C</text>
    <text x={236} y={ROW_Y(0) + 24} textAnchor="middle" fontSize="15" fontWeight="700" fill={protonLine}>gas?</text>
    <text x={236} y={ROW_Y(1) + 24} textAnchor="middle" fontSize="15" fontWeight="700" fill={protonLine}>gas?</text>
    <text x={236} y={ROW_Y(2) + 24} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>gas</text>
    <text x={236} y={ROW_Y(2) + 42} textAnchor="middle" fontSize="12" fill={muted}>(known)</text>
    <Arrow x1={282} y1={ROW_Y(2) + 10} x2={282} y2={ROW_Y(0) + 14} colour={protonLine} width={2.5} />
    <Notes x={304} y={ROW_Y(0) + 12} lines={[['Helium and neon are', 'n'], ['above argon, so they', 'n'], ['boil at even lower', 'n'], ['temperatures.', 'n'], ['', 'n'], ['Argon boils below 25 °C,', 'n'], ['so they do too:', 'n'], ['both are gases.', 'r']]} />
  </g>} />
}
type RangeStage = 'range' | 'check'
function Range({ stage }: { stage: RangeStage }) {
  const X = (t: number) => r1(40 + (t + 280) * 460 / 160), axis = 170
  const mark = (t: number, sym: string, colour: string, above = true) => <g>
    <circle cx={X(t)} cy={axis} r="7" fill={colour} stroke="white" strokeWidth="2" />
    <Tile x={X(t) - 26} y={above ? 58 : 58} w={52} h={34} sym={sym} look={colour === protonLine ? 'active' : 'plain'} />
    <path d={`M${X(t)} 96V${axis - 10}`} stroke={colour} strokeWidth="1.6" strokeDasharray="4 4" />
    <text x={X(t)} y={axis + 48} textAnchor="middle" fontSize="14" fontWeight="700" fill={colour}>{deg(t)} °C</text>
  </g>
  return <Diagram viewBox="0 0 540 260" schematic={false} title={stage === 'range'
    ? 'A temperature line from −280 to −120 °C. Neon boils at −246 °C and krypton at −153 °C. Argon lies between them in Group 0, so its boiling point is predicted to lie in the shaded range between them, about −200 °C.'
    : 'The same temperature line. Argon’s real boiling point, −186 °C, is marked inside the shaded range between neon (−246 °C) and krypton (−153 °C), as predicted.'}>
    <text x={20} y={30} fontSize="15" fontWeight="700" fill={ink}>Boiling points (°C)</text>
    <rect x={X(-246)} y={axis - 14} width={X(-153) - X(-246)} height={28} rx="6" fill={glow} />
    <path d={`M40 ${axis}H500`} stroke={ink} strokeWidth="2" />
    {[-280, -240, -200, -160, -120].map(t => <g key={t}>
      <path d={`M${X(t)} ${axis - 6}V${axis + 6}`} stroke={ink} strokeWidth="1.6" />
      <text x={X(t)} y={axis + 24} textAnchor="middle" fontSize="12" fill={muted}>{deg(t)}</text>
    </g>)}
    <text x={500} y={axis - 22} textAnchor="end" fontSize="12" fill={muted}>hotter →</text>
    {mark(-246, 'Ne', ink)}
    {mark(-153, 'Kr', ink)}
    {stage === 'range'
      ? <g>
        <Tile x={X(-200) - 26} y={58} w={52} h={34} sym="Ar" look="active" />
        <text x={X(-200)} y={124} textAnchor="middle" fontSize="14" fontWeight="700" fill={protonLine}>somewhere</text>
        <text x={X(-200)} y={142} textAnchor="middle" fontSize="14" fontWeight="700" fill={protonLine}>in here?</text>
        <text x={270} y={250} textAnchor="middle" fontSize="13" fill={ink}>Prediction: between −246 °C and −153 °C, about −200 °C.</text>
      </g>
      : <g>
        {mark(-186, 'Ar', protonLine)}
        <text x={270} y={250} textAnchor="middle" fontSize="13" fontWeight="700" fill={good}>Argon really boils at −186 °C: inside the range, as predicted.</text>
      </g>}
  </Diagram>
}

// ---------- On your own ----------
function GroupQuestion({ assessment }: { assessment: boolean }) {
  const x = 230, ys = NOBLE.map((_, i) => 24 + i * 46)
  return <Diagram viewBox="0 0 540 310" schematic={false} title={assessment
    ? 'Group 0 drawn as a column of six boxes numbered 1 to 6, from the top of the group to the bottom.'
    : 'Group 0 as six numbered boxes: 1 helium, 2 neon, 3 argon, 4 krypton, 5 xenon, 6 radon. Boiling point increases down the group, so box 6, radon, has the highest boiling point.'}>
    {NOBLE.map((el, i) => <g key={el.sym}>
      <Tile x={x} y={ys[i]} w={70} h={38} sym={el.sym} look={assessment ? 'blank' : i === 5 ? 'active' : 'plain'} />
      <Pointer n={i + 1} x={x - 56} y={ys[i] + 19} to={[x - 4, ys[i] + 19]} />
      {!assessment && <text x={x + 86} y={ys[i] + 25} fontSize="14" fontWeight={i === 5 ? 700 : 400} fill={i === 5 ? protonLine : ink}>{el.name}, {deg(el.bp)} °C</text>}
    </g>)}
    {assessment && <g><text x={x + 90} y={ys[0] + 24} fontSize="13" fill={muted}>top of Group 0</text><text x={x + 90} y={ys[5] + 24} fontSize="13" fill={muted}>bottom of Group 0</text></g>}
  </Diagram>
}
function DataTable() {
  const rows = NOBLE.slice(0, 4)
  return <Diagram viewBox="0 0 540 250" schematic={false} title="A student’s data table for four noble gases. Helium: relative atomic mass 4, boiling point −269 °C. Neon: 20, −246 °C. Argon: 40, −186 °C. Krypton: 84, −153 °C.">
    <text x={30} y={24} fontSize="14" fontWeight="700" fill={ink}>A student’s table (boiling points to the nearest °C)</text>
    <rect x={20} y={38} width={500} height={200} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="14" fontWeight="700" fill={ink}>
      <text x={40} y={68}>noble gas</text><text x={245} y={68} textAnchor="middle">relative atomic mass</text><text x={428} y={68} textAnchor="middle">boiling point (°C)</text>
    </g>
    <path d="M32 82H508" stroke={panelLine} strokeWidth="1.5" />
    {rows.map((el, i) => <g key={el.sym} fontSize="15" fill={ink}>
      <text x={40} y={114 + i * 36}>{el.name}</text><text x={245} y={114 + i * 36} textAnchor="middle">{el.mass}</text><text x={428} y={114 + i * 36} textAnchor="middle">{deg(el.bp)}</text>
      {i < rows.length - 1 && <path d={`M32 ${126 + i * 36}H508`} stroke={panelLine} />}
    </g>)}
  </Diagram>
}

export function NobleGasVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'noble-table': return <TableOutline />
    case 'noble-members': return <Members />
    case 'noble-colourless': return <Colourless />
    case 'noble-shell-he': return <Shells stage="he" />
    case 'noble-shell-ne-ar': return <Shells stage="ne-ar" />
    case 'noble-shell-stable': return <Shells stage="stable" />
    case 'noble-single': return <Single />
    case 'noble-air': return <Atmosphere stage="air" />
    case 'noble-argon': return <Atmosphere stage="argon" />
    case 'noble-atmosphere': return <Atmosphere stage="both" />
    case 'noble-trend-mass': return <GroupTable show={['mass']} active="mass" title={TREND_TITLES.mass} />
    case 'noble-trend-electrons': return <GroupTable show={['mass', 'e']} active="e" title={TREND_TITLES.e} />
    case 'noble-trend-forces': return <Forces />
    case 'noble-trend-bp': return <GroupTable show={['mass', 'e', 'bp']} active="bp" title={TREND_TITLES.bp} />
    case 'noble-trend-chain': return <Chain />
    case 'noble-predict-state': return <PredictState />
    case 'noble-predict-range': return <Range stage="range" />
    case 'noble-predict-check': return <Range stage="check" />
    case 'noble-question': return <GroupQuestion assessment={assessment} />
    case 'noble-data': return <DataTable />
    default: return <Members />
  }
}
