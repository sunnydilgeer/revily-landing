import { useId, type ReactNode } from 'react'
import { Arrow, blob } from './InfectionVisuals'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry Lesson 33: measuring rates using gas. Original, code-native schematics; not to scale.
 * Focus ids start with 'gasrate-'. The lab pieces here (soft conical flask, stopwatch, balance, tables, pointers) are
 * also used by the disappearing-cross lesson (CrossVisuals.tsx).
 *
 * Colour code (the same in both rate-measuring lessons):
 *   colourless solutions (acid, sodium thiosulfate) = very pale blue-grey    water in the trough/cylinder = pale blue
 *   carbon dioxide gas = soft purple (arrows, gas space in a cylinder or syringe)
 *   marble chips = small grey lumps          sulfur precipitate = pale yellow        amber = the step or number in focus
 * Glassware has rounded shoulders and a soft outline; ink, greys and panels come from `atomPalette`.
 */
const { ink, muted, panelFill, panelLine } = atomPalette
export const labPalette = {
  ink, muted, panelFill, panelLine,
  glass: '#f2f8fc', glassLine: '#7f9fb4',
  sol: '#e6eef3', solLine: '#9bb2c2',
  water: '#d6eaf8', waterLine: '#4a93cf',
  gas: '#8267bd', gasSoft: '#f1ebfa',
  chip: '#d9d6d0', chipLine: '#8f8a80',
  amber: '#d98a1c', amberSoft: '#fdf0dc', amberInk: '#8a5a14',
  good: '#3f8a5f', goodSoft: '#e3f3e8',
  cork: '#dcc7a2', corkLine: '#9c835a',
}
const L = labPalette
type Pt = [number, number]
const r1 = (n: number) => Math.round(n * 10) / 10

export function Diagram({ title, children, viewBox = '0 0 540 320' }: { title: string; children: ReactNode; viewBox?: string }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{`${title} Original schematic, not to scale.`}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}

// ---------- Numbers, pointers, labels ----------
export function Num({ n, x, y, active = false, dim = false }: { n: number | string; x: number; y: number; active?: boolean; dim?: boolean }) {
  return <g opacity={dim ? .42 : 1}><circle cx={x} cy={y} r="12" fill={active ? L.amber : 'white'} stroke={active ? L.amber : ink} strokeWidth="2" />
    <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={active ? 'white' : ink}>{n}</text></g>
}
export function Pointer({ n, x, y, to }: { n: number; x: number; y: number; to: Pt }) {
  const a = Math.atan2(to[1] - y, to[0] - x)
  return <g><path d={`M${r1(x + Math.cos(a) * 13)} ${r1(y + Math.sin(a) * 13)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
    <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}
/** A short label, optionally with a leader line ending in a dot on the feature. Several lines stack 17px apart. */
export function Tag({ x, y, lines, to, anchor = 'start', colour = ink, size = 14, weight = 700 }: { x: number; y: number; lines: string[]; to?: Pt; anchor?: 'start' | 'middle' | 'end'; colour?: string; size?: number; weight?: number }) {
  const sx = anchor === 'start' ? x - 5 : anchor === 'end' ? x + 5 : x
  const sy = anchor === 'middle' ? (to && to[1] > y ? y + (lines.length - 1) * 17 + 6 : y - size - 2) : y - 5
  return <g>
    {to && <><path d={`M${r1(sx)} ${r1(sy)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.4" /><circle cx={to[0]} cy={to[1]} r="2.6" fill={ink} /></>}
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={colour}>{lines.map((l, i) => <tspan key={i} x={x} dy={i ? 17 : 0}>{l}</tspan>)}</text>
  </g>
}
/** A numbered step row; the active one is amber and bold, the others can be faded. */
export function Step({ n, x, y, lines, active = false, dim = false }: { n: number; x: number; y: number; lines: string[]; active?: boolean; dim?: boolean }) {
  return <g opacity={dim ? .38 : 1}>
    <Num n={n} x={x} y={y} active={active} />
    <text x={x + 21} y={y + 5 - (lines.length - 1) * 8.5} fontSize="14" fontWeight={active ? 700 : 600} fill={active ? L.amberInk : ink}>{lines.map((l, i) => <tspan key={i} x={x + 21} dy={i ? 17 : 0}>{l}</tspan>)}</text>
  </g>
}
export function Pill({ x, y, w, text, tone = 'amber', size = 14 }: { x: number; y: number; w: number; text: string; tone?: 'amber' | 'gas' | 'good' | 'plain'; size?: number }) {
  const [fill, line, colour] = tone === 'amber' ? [L.amberSoft, L.amber, L.amberInk] : tone === 'gas' ? [L.gasSoft, L.gas, L.gas] : tone === 'good' ? [L.goodSoft, L.good, L.good] : [panelFill, panelLine, ink]
  return <g><rect x={x} y={y} width={w} height={32} rx="16" fill={fill} stroke={line} strokeWidth="2" /><text x={x + w / 2} y={y + 21} textAnchor="middle" fontSize={size} fontWeight="700" fill={colour}>{text}</text></g>
}

// ---------- Glassware ----------
/** Outline of a soft conical flask standing on y = base. */
export function flaskPath(cx: number, base: number, h: number, w: number, neck = w * .28) {
  const top = base - h, nb = top + h * .3, n = neck / 2, W = w / 2
  return `M${r1(cx - n)} ${r1(top)}V${r1(nb)}C${r1(cx - n)} ${r1(nb + h * .14)} ${r1(cx - W + 3)} ${r1(base - h * .3)} ${r1(cx - W)} ${r1(base - 15)}Q${r1(cx - W - 1)} ${base} ${r1(cx - W + 15)} ${base}H${r1(cx + W - 15)}Q${r1(cx + W + 1)} ${base} ${r1(cx + W)} ${r1(base - 15)}C${r1(cx + W - 3)} ${r1(base - h * .3)} ${r1(cx + n)} ${r1(nb + h * .14)} ${r1(cx + n)} ${r1(nb)}V${r1(top)}`
}
/** A soft conical flask. `level` is the liquid depth in px; children are drawn inside (clipped to the glass). */
export function Flask({ cx, base, h = 150, w = 120, level = 0, fill = L.sol, line = L.solLine, liquidOpacity = 1, children, over }: { cx: number; base: number; h?: number; w?: number; level?: number; fill?: string; line?: string; liquidOpacity?: number; children?: ReactNode; over?: ReactNode }) {
  const clip = useId().replace(/:/g, '')
  const d = flaskPath(cx, base, h, w), top = base - h, n = w * .14, surf = base - level
  return <g>
    <defs><clipPath id={clip}><path d={d + 'Z'} /></clipPath></defs>
    <path d={d + 'Z'} fill={L.glass} fillOpacity=".85" />
    <g clipPath={`url(#${clip})`}>
      {level > 0 && <g opacity={liquidOpacity}><path d={`M${cx - w} ${surf}Q${cx - w / 4} ${surf - 3} ${cx} ${surf}T${cx + w} ${surf}V${base + 2}H${cx - w}Z`} fill={fill} />
        <path d={`M${cx - w} ${surf}Q${cx - w / 4} ${surf - 3} ${cx} ${surf}T${cx + w} ${surf}`} fill="none" stroke={line} strokeWidth="1.8" /></g>}
      {children}
    </g>
    <path d={d} fill="none" stroke={L.glassLine} strokeWidth="2.6" />
    <path d={`M${r1(cx - n - 4)} ${top}Q${cx} ${top - 3} ${r1(cx + n + 4)} ${top}`} fill="none" stroke={L.glassLine} strokeWidth="3.2" />
    <path d={`M${r1(cx - w * .32)} ${r1(base - h * .2)}Q${r1(cx - w * .36)} ${r1(base - h * .36)} ${r1(cx - n + 3)} ${r1(top + h * .42)}`} fill="none" stroke="white" strokeWidth="3" opacity=".9" />
    {over}
  </g>
}
export function Bung({ cx, top, w = 36 }: { cx: number; top: number; w?: number }) {
  return <path d={`M${r1(cx - w / 2 - 3)} ${top}Q${cx} ${top - 3} ${r1(cx + w / 2 + 3)} ${top}L${r1(cx + w / 2 - 3)} ${top + 24}Q${cx} ${top + 26} ${r1(cx - w / 2 + 3)} ${top + 24}Z`} fill={L.cork} stroke={L.corkLine} strokeWidth="2" />
}
/** Marble chips: small grey lumps sitting on the flask floor. */
export function Chips({ cx, base, n = 7, spread = 70, seed = 3, size = 1 }: { cx: number; base: number; n?: number; spread?: number; seed?: number; size?: number }) {
  return <g>{Array.from({ length: n }, (_, i) => {
    const x = cx - spread / 2 + (i + .5) * spread / n, row = i % 2, y = base - 7 * size - row * 8 * size
    return <path key={i} d={blob(x, y, 7.5 * size, 6 * size, seed * 17 + i * 5, .16, .9, 9)} fill={L.chip} stroke={L.chipLine} strokeWidth="1.6" />
  })}</g>
}
export function Bubbles({ pts, r = 3.2 }: { pts: Pt[]; r?: number }) {
  return <g>{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r * (.75 + (i % 3) * .2)} fill="white" stroke={L.glassLine} strokeWidth="1.3" />)}</g>
}
/** A soft wavy arrow of gas rising from (x, y) by `len` px. */
export function GasWisp({ x, y, len = 60, colour = L.gas, width = 3, flip = false }: { x: number; y: number; len?: number; colour?: string; width?: number; flip?: boolean }) {
  const s = flip ? -1 : 1, tip = y - len, e = tip + 11, amp = Math.min(9, len / 5)
  return <g>
    <path d={`M${x} ${y}C${x + amp * s} ${r1(y - (y - e) * .33)} ${x - amp * s} ${r1(y - (y - e) * .66)} ${x} ${r1(e)}`} fill="none" stroke={colour} strokeWidth={width} />
    <path d={`M${x} ${r1(tip)}l-6.5 12h13z`} fill={colour} stroke={colour} strokeWidth="1.5" />
  </g>
}
/** A stopwatch with its face showing `time`. */
export function Stopwatch({ x, y, r = 24, time = '0 s', hot = false }: { x: number; y: number; r?: number; time?: string; hot?: boolean }) {
  return <g>
    <rect x={x - 5} y={y - r - 9} width="10" height="9" rx="2" fill={L.amberSoft} stroke={hot ? L.amber : ink} strokeWidth="1.8" />
    <path d={`M${r1(x + r * .62)} ${r1(y - r * .9)}l6 -6`} stroke={hot ? L.amber : ink} strokeWidth="3" />
    <circle cx={x} cy={y} r={r} fill={L.amberSoft} stroke={hot ? L.amber : ink} strokeWidth="2.2" />
    <circle cx={x} cy={y} r={r - 6} fill="white" stroke={panelLine} strokeWidth="1.5" />
    <text x={x} y={y + 5} textAnchor="middle" fontSize={r > 20 ? 13 : 11} fontWeight="700" fill={hot ? L.amberInk : ink}>{time}</text>
  </g>
}
/** A digital top-pan balance; the pan is at y. */
export function Balance({ cx, y, reading, w = 180, hot = false }: { cx: number; y: number; reading: string; w?: number; hot?: boolean }) {
  return <g>
    <rect x={cx - w / 2 + 16} y={y} width={w - 32} height="10" rx="5" fill="#dbe6ee" stroke={muted} strokeWidth="1.8" />
    <path d={`M${cx - w / 2 + 6} ${y + 10}H${cx + w / 2 - 6}Q${cx + w / 2 + 4} ${y + 12} ${cx + w / 2} ${y + 30}L${cx + w / 2 - 4} ${y + 44}Q${cx + w / 2 - 6} ${y + 52} ${cx + w / 2 - 16} ${y + 52}H${cx - w / 2 + 16}Q${cx - w / 2 + 6} ${y + 52} ${cx - w / 2 + 4} ${y + 44}L${cx - w / 2} ${y + 30}Q${cx - w / 2 - 4} ${y + 12} ${cx - w / 2 + 6} ${y + 10}Z`} fill={panelFill} stroke={muted} strokeWidth="1.8" />
    <rect x={cx - 48} y={y + 18} width="96" height="26" rx="6" fill="white" stroke={hot ? L.amber : ink} strokeWidth={hot ? 2.5 : 1.8} />
    <text x={cx} y={y + 37} textAnchor="middle" fontSize="16" fontWeight="700" fill={hot ? L.amberInk : ink}>{reading}</text>
  </g>
}
/** A bench line. */
export function Bench({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return <path d={`M${x1} ${y}Q${(x1 + x2) / 2} ${y + 2} ${x2} ${y}`} stroke={panelLine} strokeWidth="3" fill="none" />
}

/** Table: `cols` widths; rows are arrays of cell text (a cell can hold two lines split by '\n'). First row is the header when `head`. */
export function Table({ x, y, cols, rows, rowH = 40, head = 'row', hiCol, hiRow, size = 15 }: { x: number; y: number; cols: number[]; rows: string[][]; rowH?: number; head?: 'row' | 'col'; hiCol?: number; hiRow?: number; size?: number }) {
  const xs = cols.reduce<number[]>((a, w, i) => [...a, i ? a[i - 1] + cols[i - 1] : x], [])
  return <g>{rows.map((row, j) => row.map((c, i) => {
    const isHead = head === 'row' ? j === 0 : i === 0, hi = i === hiCol || j === hiRow
    const fill = hi ? L.amberSoft : isHead ? '#e8f1f7' : 'white', lines = c.split('\n')
    return <g key={`${j}-${i}`}>
      <rect x={xs[i]} y={y + j * rowH} width={cols[i]} height={rowH} fill={fill} stroke={panelLine} strokeWidth="2" />
      <text x={xs[i] + cols[i] / 2} y={y + j * rowH + rowH / 2 + 5 - (lines.length - 1) * 8} textAnchor="middle" fontSize={isHead ? size - 1 : size} fontWeight={isHead || hi ? 700 : 400} fill={hi ? L.amberInk : ink}>{lines.map((l, k) => <tspan key={k} x={xs[i] + cols[i] / 2} dy={k ? 16 : 0}>{l}</tspan>)}</text>
    </g>
  }))}
    <rect x={x} y={y} width={cols.reduce((a, b) => a + b, 0)} height={rows.length * rowH} rx="4" fill="none" stroke={L.solLine} strokeWidth="2.4" />
  </g>
}

// ---------- Gas collection apparatus ----------
/** A trough (bowl of water), with an upturned measuring cylinder standing in it. `gas` is the height of the gas space. */
function Cylinder({ cx, top, mouth, w = 46, gas, ticks = true }: { cx: number; top: number; mouth: number; w?: number; gas: number; ticks?: boolean }) {
  const clip = useId().replace(/:/g, '')
  const x = cx - w / 2, d = `M${x} ${mouth}V${top + 14}Q${x} ${top} ${x + 14} ${top}H${x + w - 14}Q${x + w} ${top} ${x + w} ${top + 14}V${mouth}`
  return <g>
    <defs><clipPath id={clip}><path d={d + 'Z'} /></clipPath></defs>
    <g clipPath={`url(#${clip})`}>
      <rect x={x} y={top} width={w} height={mouth - top} fill={L.water} />
      <rect x={x} y={top} width={w} height={gas} fill={L.gasSoft} />
      <path d={`M${x} ${top + gas}H${x + w}`} stroke={L.waterLine} strokeWidth="1.8" />
    </g>
    {ticks && Array.from({ length: Math.floor((mouth - top - 30) / 16) }, (_, i) => <path key={i} d={`M${x + w - (i % 2 ? 9 : 15)} ${top + 18 + i * 16}H${x + w - 2}`} stroke={L.glassLine} strokeWidth="1.4" />)}
    <path d={d} fill="none" stroke={L.glassLine} strokeWidth="2.6" />
    <path d={`M${x - 5} ${mouth}H${x + 4}M${x + w - 4} ${mouth}H${x + w + 5}`} stroke={L.glassLine} strokeWidth="3" />
  </g>
}
function Trough({ x1, x2, top, bottom, water }: { x1: number; x2: number; top: number; bottom: number; water: number }) {
  const d = `M${x1} ${top}C${x1 + 2} ${bottom - 20} ${x1 + 4} ${bottom} ${x1 + 26} ${bottom}H${x2 - 26}C${x2 - 4} ${bottom} ${x2 - 2} ${bottom - 20} ${x2} ${top}`
  const clip = useId().replace(/:/g, '')
  return { back: <g><defs><clipPath id={clip}><path d={d + 'Z'} /></clipPath></defs><path d={d + 'Z'} fill={L.glass} /><g clipPath={`url(#${clip})`}><path d={`M${x1} ${water}Q${(x1 + x2) / 2} ${water + 3} ${x2} ${water}V${bottom}H${x1}Z`} fill={L.water} /><path d={`M${x1} ${water}Q${(x1 + x2) / 2} ${water + 3} ${x2} ${water}`} fill="none" stroke={L.waterLine} strokeWidth="1.8" /></g></g>,
    front: <path d={d} fill="none" stroke={L.glassLine} strokeWidth="2.6" /> }
}
function Tube({ d }: { d: string }) {
  return <g><path d={d} fill="none" stroke={L.glassLine} strokeWidth="8" /><path d={d} fill="none" stroke={L.glass} strokeWidth="3.6" /></g>
}

/** The flask – delivery tube – upturned cylinder set-up. Flask centre 92, bench at 290. */
const AP = { fx: 92, base: 282, cx: 262, top: 40, mouth: 252, t1: 178, t2: 340, tTop: 184, tBot: 290, water: 200 }
function GasCollection({ gas = 58, bubbles = true }: { gas?: number; bubbles?: boolean }) {
  const { fx, base, cx, top, mouth, t1, t2, tTop, tBot, water } = AP
  const tr = Trough({ x1: t1, x2: t2, top: tTop, bottom: tBot, water })
  const fTop = base - 150
  return <g>
    <Bench x1={16} x2={354} y={base + 9} />
    {tr.back}
    <Cylinder cx={cx} top={top} mouth={mouth} gas={gas} />
    <Tube d={`M${fx} ${fTop + 6}V${fTop - 20}Q${fx} ${fTop - 38} ${fx + 18} ${fTop - 38}H${t1 + 8}Q${t1 + 22} ${fTop - 38} ${t1 + 22} ${fTop - 24}V${tBot - 22}Q${t1 + 22} ${tBot - 12} ${t1 + 34} ${tBot - 12}H${cx - 8}Q${cx} ${tBot - 12} ${cx} ${tBot - 22}V${mouth - 12}`} />
    {bubbles && <Bubbles pts={[[cx - 2, mouth - 26], [cx + 5, mouth - 60], [cx - 6, mouth - 98], [cx + 3, top + gas + 14]]} />}
    {tr.front}
    <Flask cx={fx} base={base} level={58}>
      <Chips cx={fx} base={base} spread={78} />
      <Bubbles pts={[[fx - 20, base - 30], [fx + 12, base - 38], [fx - 4, base - 48], [fx + 26, base - 24]]} r={3} />
    </Flask>
    <Bung cx={fx} top={fTop - 4} w={30} />
    <Tube d={`M${fx} ${fTop + 20}V${fTop}`} />
  </g>
}

type SetStage = 'set' | 'start' | 'q'
const SET_TITLES: Record<SetStage, string> = {
  set: 'Collecting a gas. Marble chips react with acid in a conical flask. A delivery tube carries the gas into an upside-down measuring cylinder full of water, standing in a trough of water. Bubbles of gas push the water out of the cylinder.',
  start: 'The same gas-collection apparatus with a stopwatch. Step 1: add the marble chips. Step 2: attach the delivery tube and start the stopwatch at the same time. Step 3: read the volume of gas every 10 seconds. A blank results table has columns for time and volume.',
  q: 'Gas-collection apparatus with four numbered parts: a flask, a tube, an upside-down cylinder and a bowl of water.',
}
function SetUp({ stage }: { stage: SetStage }) {
  const pointers = stage !== 'start'
  return <Diagram viewBox="0 0 540 310" title={SET_TITLES[stage]}>
    <GasCollection />
    {pointers && <g>
      <Pointer n={1} x={30} y={168} to={[62, 214]} />
      <Pointer n={2} x={150} y={52} to={[150, 94]} />
      <Pointer n={3} x={322} y={56} to={[284, 76]} />
      <Pointer n={4} x={326} y={160} to={[312, 226]} />
    </g>}
    {stage === 'set' && <g>
      <Step n={1} x={374} y={62} lines={['conical flask']} />
      <Step n={2} x={374} y={108} lines={['delivery tube']} />
      <Step n={3} x={374} y={160} lines={['measuring', 'cylinder full', 'of water']} />
      <Step n={4} x={374} y={212} lines={['trough of water']} />
      <Tag x={374} y={262} lines={['gas pushes the', 'water out']} colour={L.gas} size={14} />
    </g>}
    {stage === 'start' && <g>
      <Stopwatch x={36} y={62} time="0 s" hot />
      <Step n={1} x={374} y={30} lines={['Add the chips.']} />
      <Step n={2} x={374} y={80} lines={['Attach the tube', 'and start the', 'stopwatch.']} active />
      <Step n={3} x={374} y={136} lines={['Read the volume', 'every 10 s.']} />
      <Table x={362} y={174} cols={[70, 102]} rowH={29} size={13} rows={[['Time (s)', 'Volume (cm³)'], ['0', ''], ['10', ''], ['20', '']]} />
    </g>}
  </Diagram>
}

function Syringe() {
  const fx = 90, base = 286, fTop = base - 150, x0 = 204, k = 2.2, gasEnd = x0 + 44 * k
  return <Diagram viewBox="0 0 540 320" title="A gas syringe. A delivery tube carries gas from the reacting flask into a syringe lying on its side. The gas pushes the plunger out along a scale in cubic centimetres. The syringe reads to the nearest cubic centimetre. If the reaction is too fast, the plunger can be pushed right out.">
    <Bench x1={16} x2={200} y={base + 9} />
    <Tube d={`M${fx} ${fTop + 20}V${fTop - 40}Q${fx} ${fTop - 58} ${fx + 18} ${fTop - 58}H${x0 - 14}`} />
    <Flask cx={fx} base={base} level={58}>
      <Chips cx={fx} base={base} spread={78} />
      <Bubbles pts={[[fx - 20, base - 30], [fx + 12, base - 38], [fx - 4, base - 48], [fx + 26, base - 24]]} r={3} />
    </Flask>
    <Bung cx={fx} top={fTop - 4} w={30} />
    {/* syringe */}
    <rect x={x0 - 16} y={73} width="18" height="10" rx="3" fill={L.glass} stroke={L.glassLine} strokeWidth="2" />
    <rect x={x0} y={60} width={gasEnd - x0} height="36" fill={L.gasSoft} />
    <rect x={gasEnd} y={62} width="8" height="32" rx="2" fill="#cfd8de" stroke={muted} strokeWidth="1.8" />
    <path d={`M${gasEnd + 8} 78H486`} stroke={muted} strokeWidth="7" /><rect x={484} y={62} width="9" height="32" rx="3" fill="#cfd8de" stroke={muted} strokeWidth="1.8" />
    <rect x={x0} y={58} width={234} height="40" rx="10" fill="none" stroke={L.glassLine} strokeWidth="2.6" />
    {[0, 20, 40, 60, 80, 100].map(v => <g key={v}><path d={`M${x0 + v * k} 58v9`} stroke={L.glassLine} strokeWidth="1.6" /><text x={x0 + v * k} y={50} textAnchor="middle" fontSize="12" fill={muted}>{v}</text></g>)}
    {[10, 30, 50, 70, 90].map(v => <path key={v} d={`M${x0 + v * k} 58v5`} stroke={L.glassLine} strokeWidth="1.4" />)}
    <text x={x0 + 234 + 6} y={50} fontSize="12" fill={muted}>cm³</text>
    <Bubbles pts={[[x0 + 18, 70], [x0 + 40, 86], [x0 + 64, 74]]} r={3} />
    <Tag x={236} y={134} lines={['gas syringe']} to={[236, 99]} />
    <Tag x={236} y={154} lines={['reads to the nearest cm³']} weight={400} size={14} colour={muted} />
    <Stopwatch x={460} y={150} time="10 s" />
    <rect x={196} y={200} width={320} height={84} rx="14" fill={L.amberSoft} stroke={L.amber} strokeWidth="2" />
    <text x={216} y={228} fontSize="15" fontWeight="700" fill={L.amberInk}>Take care</text>
    <text x={216} y={252} fontSize="14" fill={ink}>If the reaction is too fast, the gas</text>
    <text x={216} y={272} fontSize="14" fill={ink}>can push the plunger right out.</text>
  </Diagram>
}

function ReadingsTable() {
  return <Diagram viewBox="0 0 540 250" title="A table of readings. Time 0, 10, 20 and 30 seconds. Cylinder reading 2, 14, 22 and 27 cubic centimetres. Volume produced is the reading minus 2: 0, 12, 20 and 25 cubic centimetres. At 10 seconds, 14 minus 2 is 12 cubic centimetres.">
    <Table x={16} y={20} cols={[160, 72, 72, 72, 72]} rowH={44} hiCol={2} rows={[['Time (s)', '0', '10', '20', '30'], ['Reading (cm³)', '2', '14', '22', '27'], ['Volume\nproduced (cm³)', '0', '12', '20', '25']]} />
    <path d="M472 86C500 90 500 124 474 128" fill="none" stroke={L.amber} strokeWidth="3" /><path d="M474 128l9 -7v12z" fill={L.amber} stroke={L.amber} transform="rotate(-8 474 128)" />
    <text x={500} y={112} fontSize="16" fontWeight="700" fill={L.amberInk}>− 2</text>
    <rect x={120} y={176} width={300} height={50} rx="14" fill={L.amberSoft} stroke={L.amber} strokeWidth="2" />
    <text x={270} y={207} textAnchor="middle" fontSize="17" fontWeight="700" fill={L.amberInk}>At 10 s: 14 − 2 = 12 cm³</text>
  </Diagram>
}

function Why() {
  const fx = 160, base = 270
  return <Diagram viewBox="0 0 540 300" title="Marble chips fizz in dilute hydrochloric acid in a conical flask. Bubbles rise and carbon dioxide gas leaves the flask. More gas each second means a faster reaction.">
    <Bench x1={50} x2={290} y={base + 9} />
    <Flask cx={fx} base={base} h={180} w={150} level={72}>
      <Chips cx={fx} base={base} n={8} spread={100} size={1.15} />
      <Bubbles pts={[[fx - 34, base - 34], [fx - 10, base - 44], [fx + 18, base - 38], [fx + 40, base - 30], [fx - 22, base - 60], [fx + 6, base - 64], [fx + 28, base - 56]]} r={3.6} />
    </Flask>
    <GasWisp x={fx - 12} y={82} len={62} />
    <GasWisp x={fx + 14} y={78} len={62} flip />
    <Tag x={214} y={36} lines={['carbon dioxide gas']} colour={L.gas} />
    <Tag x={300} y={188} lines={['dilute hydrochloric acid']} to={[222, 214]} />
    <Tag x={300} y={250} lines={['marble chips']} to={[206, 258]} />
    <rect x={300} y={98} width={220} height={54} rx="14" fill={L.gasSoft} stroke={L.gas} strokeWidth="2" />
    <text x={410} y={120} textAnchor="middle" fontSize="15" fontWeight="700" fill={L.gas}>more gas each second</text>
    <text x={410} y={141} textAnchor="middle" fontSize="15" fontWeight="700" fill={L.gas}>= faster reaction</text>
  </Diagram>
}

// ---------- Balance ----------
function Cotton({ cx, y, w = 30, s = 1 }: { cx: number; y: number; w?: number; s?: number }) {
  const pts: Pt[] = [[-.3, 0], [.05, -.1], [.32, .05], [-.2, .55], [.2, .6], [0, .3], [-.32, 1], [.3, 1.05], [0, .95]]
  return <g>{pts.map(([a, b], i) => <circle key={i} cx={r1(cx + a * w)} cy={r1(y + b * w * .8)} r={9 * s} fill="white" stroke="#b9c3cb" strokeWidth={1.4 * s} />)}</g>
}
function OnBalance({ reading, hot = false, x = 130 }: { reading: string; hot?: boolean; x?: number }) {
  const base = 232, fTop = base - 150
  return <g>
    <Balance cx={x} y={base} reading={reading} hot={hot} />
    <Flask cx={x} base={base} level={54}>
      <Chips cx={x} base={base} spread={78} />
      <Bubbles pts={[[x - 20, base - 30], [x + 12, base - 38], [x - 4, base - 46], [x + 26, base - 24]]} r={3} />
    </Flask>
    <Cotton cx={x} y={fTop + 6} w={26} />
    <GasWisp x={x - 12} y={fTop - 8} len={52} />
    <GasWisp x={x + 12} y={fTop - 12} len={52} flip />
  </g>
}
function BalanceSetup() {
  return <Diagram viewBox="0 0 540 310" title="A conical flask of marble chips and acid stands on a balance, with a loose plug of cotton wool in its neck. Carbon dioxide gas escapes from the top, so the mass shown on the balance falls. A stopwatch times the readings.">
    <OnBalance reading="150.0 g" hot />
    <Tag x={172} y={30} lines={['gas escapes']} colour={L.gas} />
    <Tag x={262} y={276} lines={['balance']} to={[226, 266]} />
    <Stopwatch x={280} y={128} time="0 s" />
    <rect x={330} y={96} width={190} height={92} rx="14" fill={L.gasSoft} stroke={L.gas} strokeWidth="2" />
    <text x={425} y={128} textAnchor="middle" fontSize="15" fontWeight="700" fill={L.gas}>gas leaves the flask,</text>
    <text x={425} y={150} textAnchor="middle" fontSize="15" fontWeight="700" fill={L.gas}>so the mass</text>
    <text x={425} y={172} textAnchor="middle" fontSize="15" fontWeight="700" fill={L.gas}>goes down</text>
  </Diagram>
}
function CottonZoom() {
  const cx = 395, cy = 150, R = 118
  const clip = useId().replace(/:/g, '')
  return <Diagram viewBox="0 0 540 310" title="A close-up of the flask neck. A plug of cotton wool sits in the neck. Carbon dioxide gas passes up through the cotton wool and escapes. Drops of acid spitting up are stopped below the plug, so the acid stays in.">
    <OnBalance reading="149.6 g" />
    <circle cx={130} cy={90} r={30} fill="none" stroke={L.amber} strokeWidth="2.4" strokeDasharray="6 5" />
    <path d={`M158 78L${cx - R + 6} ${cy - 44}M158 104L${cx - R + 10} ${cy + 40}`} stroke={L.amber} strokeWidth="1.8" strokeDasharray="5 5" />
    <defs><clipPath id={clip}><circle cx={cx} cy={cy} r={R} /></clipPath></defs>
    <circle cx={cx} cy={cy} r={R} fill="white" />
    <g clipPath={`url(#${clip})`}>
      <rect x={cx - 42} y={cy - R} width={84} height={2 * R} fill={L.glass} />
      <path d={`M${cx - 42} ${cy - R}V${cy + R}M${cx + 42} ${cy - R}V${cy + R}`} stroke={L.glassLine} strokeWidth="4" />
      <Cotton cx={cx} y={cy - 30} w={62} s={1.9} />
      {[[-18, 76], [12, 92], [-4, 104], [22, 70]].map(([dx, dy], i) => <g key={i}><path d={blob(cx + dx, cy + dy, 5, 6.5, i + 4, .1, 1, 8)} fill={L.sol} stroke={L.solLine} strokeWidth="1.6" /><path d={`M${cx + dx} ${cy + dy - 11}v-8`} stroke={L.solLine} strokeWidth="2" strokeDasharray="2 3" /></g>)}
      <path d={`M${cx - 30} ${cy + 58}H${cx + 30}`} stroke="#c0504a" strokeWidth="3" strokeDasharray="7 5" />
    </g>
    <GasWisp x={cx - 14} y={cy + 100} len={200} width={3} />
    <GasWisp x={cx + 16} y={cy + 100} len={200} width={3} flip />
    <circle cx={cx} cy={cy} r={R} fill="none" stroke={L.amber} strokeWidth="2.6" />
    <Tag x={cx + 52} y={cy - 70} lines={['gas', 'escapes']} colour={L.gas} />
    <Tag x={cx - 52} y={cy - 18} lines={['cotton', 'wool']} anchor="end" />
    <Tag x={cx + 52} y={cy + 78} lines={['acid', 'stays in']} colour={L.amberInk} />
  </Diagram>
}
const MASS_ROWS = [['Time (s)', 'Mass (g)'], ['0', '150.0'], ['30', '148.8'], ['60', '148.2'], ['90', '148.0']]
function BalanceFall() {
  return <Diagram viewBox="0 0 540 310" title="Balance readings at regular intervals. At 0 seconds 150.0 g, at 30 seconds 148.8 g, at 60 seconds 148.2 g, at 90 seconds 148.0 g. The mass falls as gas escapes. The quicker it falls, the faster the reaction.">
    <OnBalance reading="148.8 g" hot />
    <Table x={268} y={24} cols={[90, 100]} rowH={40} rows={MASS_ROWS} />
    <Arrow x1={480} y1={70} x2={480} y2={222} colour={L.gas} width={3} />
    <text x={363} y={256} textAnchor="middle" fontSize="15" fontWeight="700" fill={L.gas}>mass falls as gas escapes</text>
    <text x={363} y={280} textAnchor="middle" fontSize="14" fill={ink}>quicker fall = faster reaction</text>
  </Diagram>
}
function MassQuestion() {
  return <Diagram viewBox="0 0 540 230" title="A table of balance readings: at 0 seconds 150.0 g, at 30 seconds 148.8 g, at 60 seconds 148.2 g, at 90 seconds 148.0 g.">
    <Table x={150} y={14} cols={[110, 130]} rowH={40} rows={MASS_ROWS} size={16} />
  </Diagram>
}

function Methods() {
  const panel = (x: number, head: string, lines: Array<[string, boolean]>, pic: ReactNode) => <g>
    <rect x={x} y={12} width={250} height={290} rx="16" fill={panelFill} stroke={panelLine} strokeWidth="2" />
    <text x={x + 125} y={40} textAnchor="middle" fontSize="17" fontWeight="700" fill={ink}>{head}</text>
    {pic}
    {lines.map(([t, good], i) => <g key={t}>
      <circle cx={x + 26} cy={230 + i * 28} r="9" fill={good ? L.goodSoft : L.amberSoft} stroke={good ? L.good : L.amber} strokeWidth="2" />
      <text x={x + 26} y={234 + i * 28} textAnchor="middle" fontSize="12" fontWeight="700" fill={good ? L.good : L.amberInk}>{good ? '✓' : '!'}</text>
      <text x={x + 42} y={235 + i * 28} fontSize="14" fill={ink}>{t}</text></g>)}
  </g>
  const tr = Trough({ x1: 86, x2: 184, top: 128, bottom: 186, water: 140 })
  return <Diagram viewBox="0 0 540 314" title="Two ways to measure gas. Collect the gas in an upside-down measuring cylinder or a gas syringe: this measures the volume of gas and keeps the gas in. Use a balance: this measures the mass lost, is very accurate, but lets the gas into the room.">
    {panel(14, 'Collect the gas', [['measures the volume', true], ['keeps the gas in', true]], <g>
      {tr.back}<Cylinder cx={135} top={60} mouth={170} w={34} gas={40} />{tr.front}
    </g>)}
    {panel(276, 'Use a balance', [['measures the mass lost', true], ['very accurate', true], ['gas goes into the room', false]], <g>
      <Balance cx={401} y={158} reading="148.8 g" w={150} />
      <Flask cx={401} base={158} h={78} w={72} level={26}><Chips cx={401} base={158} n={5} spread={46} size={.8} /></Flask>
      <GasWisp x={392} y={76} len={26} width={2.5} />
      <GasWisp x={410} y={74} len={26} width={2.5} flip />
    </g>)}
  </Diagram>
}

// ---------- Fair test ----------
function Dots({ cx, base, n, seed }: { cx: number; base: number; n: number; seed: number }) {
  return <g>{Array.from({ length: n }, (_, i) => {
    const cols = 7, c = i % cols, row = Math.floor(i / cols), j = ((i * 7 + seed * 3) % 5) - 2
    return <circle key={i} cx={r1(cx - 39 + c * 13 + (row % 2) * 6 + j)} cy={r1(base - 26 - row * 9 - (c % 2) * 3)} r="2.6" fill={L.solLine} />
  })}</g>
}
function Fair() {
  const xs = [96, 270, 444], names = ['low', 'medium', 'high'], dots = [5, 11, 19], base = 226
  return <Diagram viewBox="0 0 540 334" title="Three conical flasks in a row, each with the same mass of marble chips and the same volume of acid. The acid concentration is low, medium and high: the acid particles are more crowded in each flask. Each flask has its own stopwatch. The same method is used each time.">
    <Bench x1={20} x2={520} y={base + 9} />
    {xs.map((x, i) => <g key={x}>
      <Flask cx={x} base={base} h={140} w={112} level={56}>
        <Dots cx={x} base={base} n={dots[i]} seed={i + 2} />
        <Chips cx={x} base={base} n={6} spread={70} seed={4} />
      </Flask>
      <Stopwatch x={x + 64} y={base - 150} r={18} time="0 s" />
      <text x={x} y={base + 34} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{names[i]}</text>
    </g>)}
    <text x={270} y={base + 56} textAnchor="middle" fontSize="14" fill={muted}>acid concentration</text>
    <Pill x={160} y={base + 66} w={220} text="same method each time" />
  </Diagram>
}
function Vars() {
  const rows: Array<{ tag: string; fill: string; line: string; lines: string[]; hi?: boolean }> = [
    { tag: 'Change', fill: L.amberSoft, line: L.amber, lines: ['the concentration of the acid'], hi: true },
    { tag: 'Measure', fill: L.gasSoft, line: L.gas, lines: ['the volume of gas at regular times'] },
    { tag: 'Keep the same', fill: L.goodSoft, line: L.good, lines: ['the volume of acid', 'the mass of marble chips', 'the temperature'] },
  ]
  let y = 14
  return <Diagram viewBox="0 0 540 292" title="A fair-test table. Change: the concentration of the acid. Measure: the volume of gas at regular times. Keep the same: the volume of acid, the mass of marble chips and the temperature.">
    {rows.map(r => {
      const h = r.lines.length === 3 ? 104 : 62, top = y
      y += h + 14
      return <g key={r.tag}>
        <rect x="20" y={top} width="500" height={h} rx="14" fill={r.fill} stroke={r.line} strokeWidth={r.hi ? 3 : 2} />
        <text x="40" y={top + h / 2 + 6} fontSize="17" fontWeight="700" fill={r.hi ? L.amberInk : ink}>{r.tag}</text>
        {r.lines.map((l, i) => <text key={i} x="214" y={top + h / 2 - (r.lines.length - 1) * 12 + i * 24 + 5} fontSize="15" fontWeight={r.hi ? 700 : 400} fill={ink}>{l}</text>)}
      </g>
    })}
  </Diagram>
}
function Read() {
  const one = (x: number, gas: number, name: string) => {
    const tr = Trough({ x1: x - 80, x2: x + 80, top: 190, bottom: 262, water: 206 })
    return <g>{tr.back}<Cylinder cx={x} top={52} mouth={244} w={52} gas={gas} />{tr.front}
      <text x={x} y={288} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{name}</text></g>
  }
  return <Diagram viewBox="0 0 540 350" title="Two upside-down measuring cylinders after 30 seconds. With the weaker acid, about a third of the cylinder is full of gas. With the stronger acid, about two thirds is full of gas. More gas in the same time means a faster reaction.">
    <text x={270} y={30} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>After 30 s</text>
    {one(150, 62, 'weaker acid')}
    {one(390, 124, 'stronger acid')}
    <Tag x={440} y={104} lines={['gas']} colour={L.gas} to={[418, 100]} />
    <Tag x={200} y={104} lines={['gas']} colour={L.gas} to={[178, 80]} />
    <Pill x={120} y={306} w={300} text="more gas in the same time = faster" tone="gas" />
  </Diagram>
}

export function GasRateVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'gasrate-why': return <Why />
    case 'gasrate-set': return <SetUp stage={assessment ? 'q' : 'set'} />
    case 'gasrate-start': return <SetUp stage="start" />
    case 'gasrate-syringe': return <Syringe />
    case 'gasrate-table': return <ReadingsTable />
    case 'gasrate-balance': return <BalanceSetup />
    case 'gasrate-cotton': return <CottonZoom />
    case 'gasrate-balance-fall': return assessment ? <MassQuestion /> : <BalanceFall />
    case 'gasrate-methods': return <Methods />
    case 'gasrate-fair': return <Fair />
    case 'gasrate-vars': return <Vars />
    case 'gasrate-read': return <Read />
    case 'gasrate-q-set': return <SetUp stage="q" />
    case 'gasrate-q-table': return <MassQuestion />
    default: return <SetUp stage={assessment ? 'q' : 'set'} />
  }
}
