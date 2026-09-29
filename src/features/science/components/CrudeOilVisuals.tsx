import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry Lesson 38: Crude oil. Original, code-native schematics; not to scale.
 * Focus ids start with 'crude-'.
 *
 * Hydrocarbon molecules are drawn as chains of grey carbon discs (the Chemistry carbon colour) with small white
 * hydrogen dots around them; every carbon has four bonds in total. Crude oil itself is a dark brown-black liquid;
 * short-chain hydrocarbons are pale gold, long-chain ones dark amber. Rock layers are soft sandy browns, sea is pale blue.
 */
const { ink, muted, panelFill, panelLine, protonLine, glow } = atomPalette
const coral = protonLine, amber = '#c98a1c', amberFill = '#fdf0cf'
const oil = '#3d332c', oilLine = '#231c17', seaFill = '#dcecf8', seaLine = '#7fb3d9'
const rockA = '#f1e6cf', rockB = '#e6d5b4', rockC = '#dac59f', rockD = '#cdb48b', rockLine = '#b59c72'
const shortFill = '#f4d78a', shortLine = '#c9a24a', longFill = '#9a6433', longLine = '#643f1c'
const barrelFill = '#5f7d95', barrelLine = '#3f5a70', metal = '#c8d3db', metalLine = '#7f8c97'
const r1 = (n: number) => Math.round(n * 10) / 10

function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function T({ x, y, children, size = 14, colour = ink, bold = false, anchor = 'middle' }: { x: number; y: number; children: ReactNode; size?: number; colour?: string; bold?: boolean; anchor?: 'start' | 'middle' | 'end' }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={bold ? 700 : 500} fill={colour}>{children}</text>
}
function Arrow({ x1, y1, x2, y2, colour = ink, width = 2.5, dashed = false }: { x1: number; y1: number; x2: number; y2: number; colour?: string; width?: number; dashed?: boolean }) {
  const a = Math.atan2(y2 - y1, x2 - x1), head = 8 + width * 1.5
  const pts = [[x2, y2], [x2 - head * Math.cos(a - .45), y2 - head * Math.sin(a - .45)], [x2 - head * Math.cos(a + .45), y2 - head * Math.sin(a + .45)]]
  return <g fill={colour} stroke={colour} strokeWidth={width}><line x1={x1} y1={y1} x2={r1(x2 - head * .7 * Math.cos(a))} y2={r1(y2 - head * .7 * Math.sin(a))} strokeDasharray={dashed ? '6 6' : undefined} /><polygon strokeWidth="1" points={pts.map(p => p.map(r1).join(',')).join(' ')} /></g>
}
function Panel({ x, y, w, h, fill = panelFill, line = panelLine }: { x: number; y: number; w: number; h: number; fill?: string; line?: string }) {
  return <rect x={x} y={y} width={w} height={h} rx="16" fill={fill} stroke={line} strokeWidth="1.5" />
}
function Num({ n, x, y }: { n: number | string; x: number; y: number }) {
  return <g><circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><T x={x} y={y + 5} size={14} bold>{n}</T></g>
}

// ---------- Hydrocarbon chains ----------
type Pt = [number, number]
/** Carbon positions in a row, or wrapped back and forth over several rows when longer than perRow. */
function chainPts(n: number, cx: number, cy: number, s = 30, perRow = n, rowGap = 56): Pt[] {
  const rows = Math.ceil(n / perRow), width = (Math.min(n, perRow) - 1) * s, top = cy - (rows - 1) * rowGap / 2
  return Array.from({ length: n }, (_, i) => {
    const row = Math.floor(i / perRow), k = i % perRow, col = row % 2 ? perRow - 1 - k : k
    return [r1(cx - width / 2 + col * s), r1(top + row * rowGap)] as Pt
  })
}
const DIRS: Array<[number, number]> = [[0, -1], [0, 1], [-1, 0], [1, 0]]
/** A carbon chain: grey C discs, bonds between them, and white H dots filling each carbon's four bonds. `double` = index of a C=C bond. */
function Chain({ pts, r = 10, letters = true, double = -1, opacity = 1 }: { pts: Pt[]; r?: number; letters?: boolean; double?: number; opacity?: number }) {
  const hd = r + 8, hr = r * .42
  const order = (i: number) => (i === double ? 2 : 1)
  const hs: Array<{ c: Pt; h: Pt }> = []
  pts.forEach((p, i) => {
    const used: Array<[number, number]> = [], nb: number[] = []
    if (i > 0) nb.push(i - 1)
    if (i < pts.length - 1) nb.push(i + 1)
    let bonds = 0
    nb.forEach(j => { used.push([Math.sign(pts[j][0] - p[0]), Math.sign(pts[j][1] - p[1])]); bonds += order(Math.min(i, j)) })
    const free = DIRS.filter(d => !used.some(u => u[0] === d[0] && u[1] === d[1]))
    free.slice(0, 4 - bonds).forEach(d => hs.push({ c: p, h: [r1(p[0] + d[0] * hd), r1(p[1] + d[1] * hd)] }))
  })
  return <g opacity={opacity}>
    {hs.map(({ c, h }, i) => <path key={`hb${i}`} d={`M${c[0]} ${c[1]}L${h[0]} ${h[1]}`} stroke="#9aa6b0" strokeWidth="2.2" />)}
    {pts.slice(1).map((p, i) => {
      const q = pts[i]
      if (i !== double) return <path key={`b${i}`} d={`M${q[0]} ${q[1]}L${p[0]} ${p[1]}`} stroke="#6c7780" strokeWidth="3.2" />
      const vx = p[0] === q[0] ? 4 : 0, vy = p[1] === q[1] ? 4 : 0
      return <g key={`b${i}`} stroke="#6c7780" strokeWidth="2.6"><path d={`M${q[0] + vx} ${q[1] - vy}L${p[0] + vx} ${p[1] - vy}`} /><path d={`M${q[0] - vx} ${q[1] + vy}L${p[0] - vx} ${p[1] + vy}`} /></g>
    })}
    {hs.map(({ h }, i) => <circle key={`h${i}`} cx={h[0]} cy={h[1]} r={r1(hr)} fill="white" stroke="#8d9ba6" strokeWidth="1.4" />)}
    {pts.map((p, i) => <g key={`c${i}`}><circle cx={p[0]} cy={p[1]} r={r} fill="#5f6b75" stroke="#3c464e" strokeWidth="1.6" />
      {letters && r >= 9 && <text x={p[0]} y={r1(p[1] + 4.3)} textAnchor="middle" fontSize="12" fontWeight="700" fill="white">C</text>}</g>)}
  </g>
}

// ---------- Small scene pieces ----------
function Barrel({ x, y, s = 1, label = true }: { x: number; y: number; s?: number; label?: boolean }) {
  const w = 36 * s, h = 52 * s, e = 9 * s
  return <g>
    <path d={`M${x - w} ${y - h}V${y + h}A${w} ${e} 0 0 0 ${x + w} ${y + h}V${y - h}`} fill={barrelFill} stroke={barrelLine} strokeWidth="2.2" />
    <ellipse cx={x} cy={y - h} rx={w} ry={e} fill="#8aa3b6" stroke={barrelLine} strokeWidth="2.2" />
    {[-.4, .4].map(k => <path key={k} d={`M${x - w} ${y + h * k}A${w} ${e} 0 0 0 ${x + w} ${y + h * k}`} fill="none" stroke={barrelLine} strokeWidth="2" />)}
    <path d={`M${x - w + 8 * s} ${y - h + 14 * s}V${y + h - 6 * s}`} stroke="white" strokeWidth={3 * s} opacity=".25" />
    <Drop x={x} y={y + 6 * s} s={.7 * s} fill="#ffffff" line="#ffffff" />
    {label && <T x={x} y={y + h + e + 22} size={14} bold>crude oil</T>}
  </g>
}
function Drop({ x, y, s = 1, fill = oil, line = oilLine }: { x: number; y: number; s?: number; fill?: string; line?: string }) {
  return <path d={`M${x} ${y - 22 * s}C${x + 4 * s} ${y - 12 * s} ${x + 14 * s} ${y - 4 * s} ${x + 14 * s} ${y + 6 * s}A${14 * s} ${14 * s} 0 0 1 ${x - 14 * s} ${y + 6 * s}C${x - 14 * s} ${y - 4 * s} ${x - 4 * s} ${y - 12 * s} ${x} ${y - 22 * s}Z`} fill={fill} stroke={line} strokeWidth="1.8" />
}
function Flame({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g><path d={`M${x} ${y}C${x - 24 * s} ${y - 20 * s} ${x - 8 * s} ${y - 44 * s} ${x - 3 * s} ${y - 64 * s}C${x + 14 * s} ${y - 46 * s} ${x + 26 * s} ${y - 26 * s} ${x} ${y}Z`} fill="#f5b04c" stroke="#d9822b" strokeWidth="2" />
    <path d={`M${x} ${y}C${x - 10 * s} ${y - 10 * s} ${x - 3 * s} ${y - 22 * s} ${x} ${y - 32 * s}C${x + 7 * s} ${y - 22 * s} ${x + 11 * s} ${y - 10 * s} ${x} ${y}Z`} fill="#fbe0a0" /></g>
}
function Plankton({ x, y, k }: { x: number; y: number; k: number }) {
  return k % 2
    ? <g><ellipse cx={x} cy={y} rx="6" ry="4" fill="#bfe0ad" stroke="#5a9a4c" strokeWidth="1.4" /><circle cx={x} cy={y} r="1.5" fill="#5a9a4c" /></g>
    : <g><circle cx={x} cy={y} r="4.5" fill="#d7ecc9" stroke="#5a9a4c" strokeWidth="1.4" /><path d={`M${x - 7} ${y - 3}L${x - 4} ${y - 1}M${x + 7} ${y - 3}L${x + 4} ${y - 1}`} stroke="#5a9a4c" strokeWidth="1.2" /></g>
}
function Car({ x, y, s = 1, colour = '#e8837a', line = coral }: { x: number; y: number; s?: number; colour?: string; line?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-52 10V-4Q-50 -14 -38 -16L-24 -18L-10 -33Q-6 -37 2 -37H20Q28 -37 32 -32L44 -18Q54 -16 55 -6V10Z" fill={colour} stroke={line} strokeWidth="2.2" />
    <path d="M-18 -18L-6 -30H6V-18ZM12 -30H20Q25 -30 28 -26L34 -18H12Z" fill="#eaf4fb" stroke={line} strokeWidth="1.6" />
    {[-30, 32].map(w => <g key={w}><circle cx={w} cy={11} r="11" fill="#4b5660" /><circle cx={w} cy={11} r="4.5" fill={metal} /></g>)}
  </g>
}
function Lorry({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x={-56} y={-40} width={72} height={48} rx="5" fill="#f7e3b0" stroke={amber} strokeWidth="2.2" />
    <path d="M20 8V-26Q20 -30 24 -30H40Q45 -30 48 -24L56 -10V8Z" fill="#9dbfec" stroke="#4a78b8" strokeWidth="2.2" />
    <path d="M28 -24H40L46 -12H28Z" fill="#eaf4fb" stroke="#4a78b8" strokeWidth="1.4" />
    {[-40, -16, 40].map(w => <g key={w}><circle cx={w} cy={10} r="9.5" fill="#4b5660" /><circle cx={w} cy={10} r="4" fill={metal} /></g>)}
  </g>
}
function Train({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-60 6V-30Q-60 -36 -54 -36H34Q52 -36 58 -14L60 6Z" fill="#b2dea6" stroke="#5a9a4c" strokeWidth="2.2" />
    {[-50, -28, -6, 16].map(w => <rect key={w} x={w} y={-28} width={16} height={14} rx="3" fill="#eaf4fb" stroke="#5a9a4c" strokeWidth="1.4" />)}
    <path d="M38 -28H46Q51 -26 53 -16H38Z" fill="#eaf4fb" stroke="#5a9a4c" strokeWidth="1.4" />
    {[-44, -26, 26, 44].map(w => <circle key={w} cx={w} cy={10} r="6.5" fill="#4b5660" />)}
    <path d="M-66 18H66" stroke={metalLine} strokeWidth="3" />
  </g>
}
function Plane({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-10 -2L-30 28H-16L16 -2Z" fill="#c9d6e0" stroke={metalLine} strokeWidth="2" />
    <path d="M-60 -8Q-60 -16 -50 -16H40Q60 -14 62 -6Q60 2 40 4H-50Q-60 4 -60 -4Z" fill="#eef3f7" stroke={metalLine} strokeWidth="2.2" />
    <path d="M-52 -14L-62 -36H-50L-36 -14Z" fill="#9dbfec" stroke="#4a78b8" strokeWidth="2" />
    {[-30, -18, -6, 6, 18].map(w => <circle key={w} cx={w} cy={-7} r="2.6" fill="#4a78b8" />)}
    <path d="M44 -12Q52 -11 56 -7H44Z" fill="#4a78b8" />
  </g>
}
function Ship({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x={-28} y={-24} width={40} height={24} rx="3" fill="white" stroke={metalLine} strokeWidth="2" />
    {[-22, -10, 2].map(w => <rect key={w} x={w} y={-18} width={7} height={7} rx="1.5" fill="#9dbfec" />)}
    <rect x={18} y={-38} width={14} height={38} rx="2" fill="#f2a39b" stroke={coral} strokeWidth="2" />
    <path d="M18 -30H32" stroke="white" strokeWidth="3" />
    <path d="M-60 0H60L48 22H-50Z" fill="#5f7d95" stroke={barrelLine} strokeWidth="2.2" />
    <path d="M-66 28q8 -5 16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0" fill="none" stroke={seaLine} strokeWidth="2.4" />
  </g>
}
function Cylinder({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x={-8} y={-50} width={16} height={12} rx="3" fill={metal} stroke={metalLine} strokeWidth="2" />
    <path d="M-16 -54H16" stroke={metalLine} strokeWidth="3.5" />
    <rect x={-24} y={-40} width={48} height={62} rx="20" fill="#f2a39b" stroke={coral} strokeWidth="2.2" />
    <path d="M-24 -8H24" stroke={coral} strokeWidth="2" opacity=".7" />
    <rect x={-18} y={20} width={36} height={6} rx="2" fill={metal} stroke={metalLine} strokeWidth="1.5" />
  </g>
}
function Clock({ x, y, r = 16 }: { x: number; y: number; r?: number }) {
  return <g><circle cx={x} cy={y} r={r} fill="white" stroke={muted} strokeWidth="2.2" /><path d={`M${x} ${y}V${y - r * .62}M${x} ${y}L${x + r * .45} ${y + r * .25}`} stroke={ink} strokeWidth="2.2" /></g>
}
function Factory({ x, y }: { x: number; y: number }) {
  // x, y = bottom-left corner.
  return <g>
    <rect x={x + 92} y={y - 118} width={16} height={60} rx="3" fill="#b8c3cc" stroke={metalLine} strokeWidth="2" />
    <path d={`M${x + 96} ${y - 124}q-6 -8 2 -14t2 -14`} fill="none" stroke="#c6ced5" strokeWidth="4" />
    <path d={`M${x} ${y}V${y - 64}L${x + 30} ${y - 84}V${y - 64}L${x + 60} ${y - 84}V${y - 64}L${x + 90} ${y - 84}V${y - 64}H${x + 124}V${y}Z`} fill="#e5ebf0" stroke={metalLine} strokeWidth="2.2" />
    <rect x={x + 14} y={y - 50} width={18} height={16} rx="3" fill="#eaf4fb" stroke={metalLine} strokeWidth="1.5" />
    <rect x={x + 92} y={y - 50} width={18} height={16} rx="3" fill="#eaf4fb" stroke={metalLine} strokeWidth="1.5" />
    <path d={`M${x + 55} ${y - 52}V${y - 40}L${x + 44} ${y - 18}Q${x + 42} ${y - 12} ${x + 48} ${y - 12}H${x + 76}Q${x + 82} ${y - 12} ${x + 80} ${y - 18}L${x + 69} ${y - 40}V${y - 52}Z`} fill="white" stroke={ink} strokeWidth="1.8" />
    <path d={`M${x + 49} ${y - 22}H${x + 75}L${x + 79} ${y - 16}Q${x + 80} ${y - 13} ${x + 76} ${y - 13}H${x + 48}Q${x + 44} ${y - 13} ${x + 45} ${y - 16}Z`} fill={shortFill} />
  </g>
}

// ---------- Section 1: what crude oil is and how it formed ----------
function RockLayers({ x, w, top, bottom }: { x: number; w: number; top: number; bottom: number }) {
  const h = (bottom - top) / 4, fills = [rockA, rockB, rockC, rockD]
  return <g>{fills.map((f, i) => { const y0 = top + i * h
    return <path key={f} d={`M${x} ${y0 + (i ? 4 : 0)}C${x + w * .3} ${y0 - (i ? 6 : 2)} ${x + w * .6} ${y0 + (i ? 10 : 2)} ${x + w} ${y0}V${bottom}H${x}Z`} fill={f} stroke={i ? rockLine : 'none'} strokeWidth="1.4" /> })}</g>
}
function FossilScene() {
  return <Diagram title="A cross-section under the sea. Sea water at the top, layers of rock beneath the seabed, and a dark pool of crude oil trapped in the rock. An oil rig stands on the sea with a drill pipe reaching down to the oil. Labels: crude oil is a fossil fuel, found in rocks, and a source of energy.">
    <path d="M14 70q14 -6 28 0t28 0t28 0t28 0t28 0t28 0t28 0t28 0t28 0t28 0t28 0t28 0t28 0t28 0t28 0t28 0t28 0t28 0V124H14Z" fill={seaFill} stroke={seaLine} strokeWidth="2" />
    <RockLayers x={14} w={512} top={120} bottom={286} />
    <path d="M300 216Q340 176 400 172Q468 170 506 214Q470 236 400 238Q336 238 300 216Z" fill={oil} stroke={oilLine} strokeWidth="2" />
    <path d="M334 206Q372 190 410 188" fill="none" stroke="#6d5e52" strokeWidth="3" opacity=".7" />
    <path d="M280 214Q330 152 400 148Q480 146 526 206" fill="none" stroke={rockLine} strokeWidth="5" opacity=".5" />
    <path d="M428 56V186" stroke={metalLine} strokeWidth="4" />
    {[398, 458].map(l => <path key={l} d={`M${l} 56V124`} stroke={metalLine} strokeWidth="4" />)}
    <rect x={386} y={46} width={84} height={12} rx="3" fill={metal} stroke={metalLine} strokeWidth="2" />
    <path d="M414 46L428 10L442 46M419 34H437M423 22H433" fill="none" stroke={metalLine} strokeWidth="2.5" />
    <T x={42} y={100} size={13} colour="#2f6f9e" anchor="start">sea</T>
    <path d="M240 232L310 214" stroke={ink} strokeWidth="1.6" /><circle cx={310} cy={214} r="2.8" fill={ink} />
    <T x={236} y={238} size={15} bold anchor="end" colour={oil}>crude oil</T>
    <T x={40} y={170} size={14} bold anchor="start">found in rocks</T>
    <T x={40} y={188} size={13} anchor="start" colour={muted}>deep under the ground</T>
    <T x={40} y={204} size={13} anchor="start" colour={muted}>or under the sea</T>
    <rect x={22} y={14} width={116} height={32} rx="16" fill={amberFill} stroke={amber} strokeWidth="2" />
    <T x={80} y={35} size={14} bold colour={amber}>fossil fuel</T>
    <Flame x={172} y={46} s={.48} />
    <T x={188} y={36} size={14} bold anchor="start" colour={amber}>source of energy</T>
  </Diagram>
}
const PLANKTON: Pt[] = [[40, 60], [66, 50], [96, 64], [124, 54], [52, 84], [110, 90], [140, 76], [80, 104]]
function Formed() {
  const p = [14, 196, 378], w = 148, top = 30, bottom = 222
  return <Diagram title="How crude oil formed, in three steps. 1: tiny plankton living in the sea die and sink to the seabed. 2: layers of mud bury their remains. 3: millions of years later, the buried remains have changed into crude oil, a dark pool in the rock.">
    <defs><clipPath id="crude-formed-clip"><rect x={0} y={top} width={540} height={bottom - top} /></clipPath></defs>
    {p.map(x => <rect key={x} x={x} y={top} width={w} height={bottom - top} rx="16" fill="white" stroke={panelLine} strokeWidth="1.5" />)}
    <g>
      <rect x={p[0] + 1.5} y={top + 1.5} width={w - 3} height={160} rx="14" fill={seaFill} />
      {PLANKTON.map(([x, y], k) => <Plankton key={k} x={x + 4} y={y + 6} k={k} />)}
      {[52, 92, 132].map(x => <Arrow key={x} x1={x} y1={130} x2={x} y2={166} colour="#5a9a4c" width={2} />)}
      <path d={`M${p[0] + 1.5} 186C60 180 110 190 ${p[0] + w - 1.5} 184V${bottom - 12}Q${p[0] + w - 1.5} ${bottom - 1.5} ${p[0] + w - 14} ${bottom - 1.5}H${p[0] + 14}Q${p[0] + 1.5} ${bottom - 1.5} ${p[0] + 1.5} ${bottom - 12}Z`} fill={rockA} stroke={rockLine} strokeWidth="1.4" />
      {[34, 58, 84, 110, 136].map((x, k) => <Plankton key={x} x={x} y={188 + (k % 2) * 3} k={k} />)}
    </g>
    <g>
      <rect x={p[1] + 1.5} y={top + 1.5} width={w - 3} height={60} rx="14" fill={seaFill} />
      <path d={`M${p[1] + 1.5} 62H${p[1] + w - 1.5}V${bottom - 12}Q${p[1] + w - 1.5} ${bottom - 1.5} ${p[1] + w - 14} ${bottom - 1.5}H${p[1] + 14}Q${p[1] + 1.5} ${bottom - 1.5} ${p[1] + 1.5} ${bottom - 12}Z`} fill={rockB} />
      {[92, 122, 152].map(y => <path key={y} d={`M${p[1] + 1.5} ${y}C${p[1] + 50} ${y - 6} ${p[1] + 100} ${y + 6} ${p[1] + w - 1.5} ${y}`} fill="none" stroke={rockLine} strokeWidth="1.4" />)}
      <path d={`M${p[1] + 1.5} 176C${p[1] + 50} 170 ${p[1] + 100} 182 ${p[1] + w - 1.5} 176V196C${p[1] + 100} 202 ${p[1] + 50} 190 ${p[1] + 1.5} 196Z`} fill="#c9d9b4" stroke="#8aa86e" strokeWidth="1.4" />
      {[20, 44, 70, 96, 122].map((dx, k) => <Plankton key={dx} x={p[1] + dx} y={186} k={k} />)}
      <T x={p[1] + w / 2} y={82} size={12} colour={muted}>mud</T>
    </g>
    <g>
      <path d={`M${p[2] + 1.5} ${top + 14}Q${p[2] + 1.5} ${top + 1.5} ${p[2] + 14} ${top + 1.5}H${p[2] + w - 14}Q${p[2] + w - 1.5} ${top + 1.5} ${p[2] + w - 1.5} ${top + 14}V${bottom - 12}Q${p[2] + w - 1.5} ${bottom - 1.5} ${p[2] + w - 14} ${bottom - 1.5}H${p[2] + 14}Q${p[2] + 1.5} ${bottom - 1.5} ${p[2] + 1.5} ${bottom - 12}Z`} fill={rockC} />
      {[70, 110, 150, 196].map(y => <path key={y} d={`M${p[2] + 1.5} ${y}C${p[2] + 50} ${y - 6} ${p[2] + 100} ${y + 6} ${p[2] + w - 1.5} ${y}`} fill="none" stroke={rockLine} strokeWidth="1.4" />)}
      <path d={`M${p[2] + 22} 176Q${p[2] + 74} 140 ${p[2] + 126} 176Q${p[2] + 74} 196 ${p[2] + 22} 176Z`} fill={oil} stroke={oilLine} strokeWidth="2" />
      <path d={`M${p[2] + 46} 168Q${p[2] + 70} 158 ${p[2] + 92} 160`} fill="none" stroke="#6d5e52" strokeWidth="2.5" />
    </g>
    {p.map((x, i) => <Num key={x} n={i + 1} x={x + 20} y={top + 20} />)}
    <Arrow x1={166} y1={126} x2={192} y2={126} colour={muted} />
    <Clock x={361} y={96} />
    <Arrow x1={348} y1={132} x2={374} y2={132} colour={muted} />
    <T x={p[0] + w / 2} y={248} size={14} bold>Plankton die</T><T x={p[0] + w / 2} y={266} size={14} bold>and sink</T>
    <T x={p[1] + w / 2} y={248} size={14} bold>Mud buries</T><T x={p[1] + w / 2} y={266} size={14} bold>the remains</T>
    <T x={p[2] + w / 2} y={248} size={14} bold>Millions of years</T><T x={p[2] + w / 2} y={266} size={14} bold colour={oil}>later: crude oil</T>
  </Diagram>
}
function RateScene() {
  return <Diagram viewBox="0 0 540 270" title="Two arrows compared. Forming crude oil: a very long arrow, millions of years. Using it: a very short arrow, burned in a few minutes by a car. Crude oil is used faster than it forms, so it is non-renewable.">
    <Drop x={40} y={80} s={1.1} />
    <T x={70} y={50} size={14} bold anchor="start">forming crude oil</T>
    <path d="M72 76H500" stroke={rockLine} strokeWidth="12" opacity=".35" />
    <Arrow x1={72} y1={76} x2={514} y2={76} colour={longLine} width={4} />
    <Clock x={470} y={44} r={13} />
    <T x={446} y={50} size={14} anchor="end" colour={muted}>millions of years</T>
    <Car x={52} y={164} s={.72} />
    <T x={104} y={134} size={14} bold anchor="start">using it</T>
    <Arrow x1={104} y1={160} x2={140} y2={160} colour={coral} width={4} />
    <T x={150} y={166} size={14} anchor="start" colour={muted}>burned in a few minutes</T>
    <rect x={40} y={210} width={460} height={42} rx="21" fill={glow} stroke={coral} strokeWidth="2" />
    <T x={270} y={237} size={15} bold colour={coral}>used faster than it forms = non-renewable</T>
  </Diagram>
}
function FiniteScene() {
  return <Diagram title="A large storage tank of crude oil with only a little oil left at the bottom. A dashed line near the top shows where it was once full, and a warning sign shows it is running out: crude oil is finite, it will run out one day.">
    <path d="M150 64Q150 50 164 50H316Q330 50 330 64V252Q330 262 318 262H162Q150 262 150 252Z" fill="#f7fafc" stroke={metalLine} strokeWidth="2.5" />
    <path d="M152 222H328V252Q328 260 318 260H162Q152 260 152 252Z" fill={oil} />
    <path d="M152 222H328" stroke={oilLine} strokeWidth="2" />
    <T x={240} y={247} size={14} bold colour="white">crude oil</T>
    <path d="M156 76H324" stroke={muted} strokeWidth="1.8" strokeDasharray="6 6" />
    <T x={240} y={70} size={12} colour={muted}>once full</T>
    <Arrow x1={240} y1={96} x2={240} y2={206} colour={muted} width={2.5} dashed />
    <path d="M330 244H360V256" fill="none" stroke={metalLine} strokeWidth="6" />
    <Drop x={360} y={278} s={.4} />
    <path d="M430 60L476 140H384Z" fill={amberFill} stroke={amber} strokeWidth="3" />
    <T x={430} y={130} size={30} bold colour={amber}>!</T>
    <T x={430} y={180} size={16} bold colour={coral}>finite:</T>
    <T x={430} y={202} size={14} bold>it will run out</T>
    <T x={430} y={220} size={14} bold>one day</T>
  </Diagram>
}

// ---------- Section 2: uses ----------
const TRANSPORT: Array<{ name: string; fuel: string; icon: (x: number, y: number) => ReactNode }> = [
  { name: 'car', fuel: 'petrol', icon: (x, y) => <Car x={x} y={y} /> },
  { name: 'lorry', fuel: 'diesel oil', icon: (x, y) => <Lorry x={x} y={y} /> },
  { name: 'train', fuel: 'diesel oil', icon: (x, y) => <Train x={x} y={y} /> },
  { name: 'plane', fuel: 'kerosene', icon: (x, y) => <Plane x={x} y={y} /> },
  { name: 'ship', fuel: 'heavy fuel oil', icon: (x, y) => <Ship x={x} y={y} /> },
  { name: 'gas cylinder', fuel: 'LPG', icon: (x, y) => <Cylinder x={x} y={y + 4} /> },
]
function Fuels() {
  return <Diagram viewBox="0 0 540 340" title="Fuels from crude oil. A car runs on petrol, a lorry and a train on diesel oil, a plane on kerosene and a ship on heavy fuel oil. A gas cylinder holds LPG, liquefied petroleum gas.">
    {TRANSPORT.map((t, i) => { const x = 14 + (i % 3) * 174, y = 14 + Math.floor(i / 3) * 162, cx = x + 82
      return <g key={t.name}>
        <Panel x={x} y={y} w={164} h={150} />
        {t.icon(cx, y + 62)}
        <T x={cx} y={y + 112} size={13} colour={muted}>{t.name}</T>
        <rect x={cx - 62} y={y + 118} width={124} height={24} rx="12" fill={amberFill} stroke={amber} strokeWidth="1.6" />
        <T x={cx} y={y + 135} size={14} bold colour="#8a5a0c">{t.fuel}</T>
      </g> })}
  </Diagram>
}
function Bottle({ x, y }: { x: number; y: number }) {
  return <g><rect x={x - 5} y={y - 26} width={10} height={6} rx="2" fill="#4a78b8" /><path d={`M${x - 5} ${y - 20}Q${x - 12} ${y - 14} ${x - 12} ${y - 6}V${y + 16}Q${x - 12} ${y + 20} ${x - 8} ${y + 20}H${x + 8}Q${x + 12} ${y + 20} ${x + 12} ${y + 16}V${y - 6}Q${x + 12} ${y - 14} ${x + 5} ${y - 20}Z`} fill="#dcecf8" stroke="#4a78b8" strokeWidth="1.8" /></g>
}
function Solvent({ x, y }: { x: number; y: number }) {
  return <g><rect x={x - 12} y={y - 12} width={24} height={32} rx="5" fill="#f3ecfb" stroke="#7d5aa6" strokeWidth="1.8" /><rect x={x - 5} y={y - 20} width={10} height={8} rx="2" fill="#7d5aa6" /><path d={`M${x} ${y - 2}c3 5 5 7 5 10a5 5 0 0 1 -10 0c0 -3 2 -5 5 -10z`} fill="#b9a2d8" /></g>
}
function OilCan({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x + 8} ${y - 6}L${x + 24} ${y - 20}`} stroke={amber} strokeWidth="3" /><path d={`M${x - 14} ${y - 8}H${x + 10}V${y + 18}H${x - 14}Z`} fill={amberFill} stroke={amber} strokeWidth="1.8" /><path d={`M${x - 14} ${y - 2}Q${x - 24} ${y + 4} ${x - 14} ${y + 12}`} fill="none" stroke={amber} strokeWidth="2.2" /><circle cx={x + 26} cy={y - 14} r="2.5" fill={amber} /></g>
}
function Detergent({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 11} ${y - 12}H${x + 11}V${y + 18}Q${x + 11} ${y + 20} ${x + 8} ${y + 20}H${x - 8}Q${x - 11} ${y + 20} ${x - 11} ${y + 18}Z`} fill="#d4ecdd" stroke="#4f9a74" strokeWidth="1.8" /><path d={`M${x - 3} ${y - 12}V${y - 20}H${x + 8}`} fill="none" stroke="#4f9a74" strokeWidth="2.5" />
    {[[x + 16, y - 20, 4], [x + 22, y - 10, 3], [x + 14, y - 30, 3]].map(([bx, by, br], i) => <circle key={i} cx={bx} cy={by} r={br} fill="white" stroke="#8fbfe0" strokeWidth="1.4" />)}</g>
}
const PRODUCTS: Array<{ label: string; y: number; icon: (x: number, y: number) => ReactNode }> = [
  { label: 'polymers (plastics)', y: 52, icon: (x, y) => <Bottle x={x} y={y} /> },
  { label: 'solvents', y: 114, icon: (x, y) => <Solvent x={x} y={y} /> },
  { label: 'lubricants', y: 176, icon: (x, y) => <OilCan x={x} y={y} /> },
  { label: 'detergents', y: 238, icon: (x, y) => <Detergent x={x} y={y} /> },
]
function Petrochem({ step }: { step: 'feedstock' | 'products' }) {
  const prod = step === 'products'
  return <Diagram title={prod
    ? 'The petrochemical industry, drawn as a factory, turns compounds from crude oil into new products: polymers such as plastics, solvents, lubricants and detergents.'
    : 'A barrel of crude oil with an arrow into a factory labelled petrochemical industry. The arrow is labelled feedstock: a raw material for a chemical process. The factory uses it to make new compounds.'}>
    <g opacity={prod ? .4 : 1}>
      <Barrel x={62} y={140} s={.9} />
      <Arrow x1={104} y1={160} x2={176} y2={160} width={3} />
      <rect x={96} y={110} width={92} height={28} rx="14" fill={amberFill} stroke={amber} strokeWidth="2" />
      <T x={142} y={129} size={14} bold colour="#8a5a0c">feedstock</T>
      <T x={142} y={188} size={13} colour={muted}>= raw</T><T x={142} y={204} size={13} colour={muted}>material</T>
    </g>
    <Factory x={190} y={214} />
    <T x={252} y={240} size={14} bold>petrochemical</T><T x={252} y={258} size={14} bold>industry</T>
    {prod
      ? PRODUCTS.map(p => <g key={p.label}>
        <Arrow x1={318} y1={170} x2={372} y2={p.y + 2} colour={muted} width={2} />
        <circle cx={400} cy={p.y + 2} r="24" fill="white" stroke={panelLine} strokeWidth="1.5" />
        {p.icon(400, p.y)}
        <T x={432} y={p.y + 7} size={14} bold anchor="start">{p.label.split(' ')[0]}</T>
        {p.label.includes(' ') && <T x={432} y={p.y + 23} size={12} anchor="start" colour={muted}>{p.label.split(' ')[1]}</T>}
      </g>)
      : <g><Arrow x1={320} y1={170} x2={380} y2={170} colour={muted} width={2.5} dashed /><T x={392} y={166} size={14} bold anchor="start">new</T><T x={392} y={184} size={14} bold anchor="start">compounds</T></g>}
  </Diagram>
}
function Organic() {
  return <Diagram title="A barrel of crude oil, with a ring showing what is inside: hydrocarbon molecules of different lengths, chains of carbon atoms with hydrogen atoms around them. They contain carbon atoms, so they are organic compounds, and most of them are hydrocarbons.">
    <Barrel x={80} y={120} s={.95} />
    <path d="M118 90L252 40M118 160L252 210" stroke={amber} strokeWidth="1.8" strokeDasharray="5 5" />
    <circle cx={360} cy={126} r="112" fill="#fdf7e8" stroke={amber} strokeWidth="2.2" />
    <Chain pts={chainPts(4, 360, 60)} />
    <Chain pts={chainPts(2, 296, 124)} />
    <Chain pts={chainPts(3, 418, 124)} />
    <Chain pts={chainPts(5, 360, 188)} />
    <T x={270} y={268} size={15} bold colour={coral}>contain carbon atoms = organic compounds</T>
    <T x={270} y={290} size={14} colour={muted}>most are hydrocarbons</T>
  </Diagram>
}
function Homologous() {
  return <Diagram title="Two families of compounds side by side. Alkanes: three chains of different lengths, 2, 3 and 4 carbon atoms, all with single bonds. Alkenes: a chain with a double bond between two carbon atoms. Each family is a homologous series: similar compounds with similar properties.">
    <Panel x={14} y={14} w={250} h={212} />
    <T x={139} y={42} size={16} bold>alkanes</T>
    <Chain pts={chainPts(2, 139, 84)} />
    <Chain pts={chainPts(3, 139, 138)} />
    <Chain pts={chainPts(4, 139, 192)} />
    <Panel x={276} y={14} w={250} h={212} fill="#f4f8f1" line="#cfe0c6" />
    <T x={401} y={42} size={16} bold>alkenes</T>
    <Chain pts={chainPts(3, 401, 124, 40)} double={0} />
    <T x={401} y={196} size={13} colour={muted}>a different family</T>
    <rect x={40} y={238} width={460} height={52} rx="20" fill={amberFill} stroke={amber} strokeWidth="1.8" />
    <T x={270} y={259} size={15} bold colour="#8a5a0c">each family = a homologous series</T>
    <T x={270} y={280} size={13} colour={ink}>similar compounds, similar properties</T>
  </Diagram>
}

// ---------- Section 3: chain length and properties ----------
const RANGE = [{ n: 3, y: 34 }, { n: 5, y: 90 }, { n: 8, y: 146 }]
function RangeScene() {
  return <Diagram title="A barrel of crude oil with arrows fanning out to hydrocarbon chains of different lengths: 3, 5 and 8 carbon atoms, and a long one of 14 carbon atoms folded over two rows. Crude oil is a mixture of hydrocarbons of different sizes.">
    <Barrel x={66} y={116} s={.95} />
    <T x={66} y={242} size={14} bold colour={coral}>a mixture of</T>
    <T x={66} y={260} size={14} bold colour={coral}>different sizes</T>
    {[...RANGE.map(r => r.y), 242].map(y => <Arrow key={y} x1={112} y1={118} x2={178} y2={r1(118 + (y - 118) * .5)} colour={muted} width={2} />)}
    {RANGE.map(r => <g key={r.n}>
      <Chain pts={chainPts(r.n, 206 + (r.n - 1) * 15, r.y)} />
      <T x={526} y={r.y + 5} size={13} anchor="end" colour={muted}>{`${r.n} carbons`}</T>
    </g>)}
    <Chain pts={chainPts(14, 206 + 6 * 15, 242, 30, 7)} />
    <T x={526} y={247} size={13} anchor="end" colour={muted}>14 carbons</T>
  </Diagram>
}
type Side = { cx: number }
function Heads({ l, r, arrow = true }: { l: Side; r: Side; arrow?: boolean }) {
  return <g>
    <Chain pts={chainPts(3, l.cx, 62)} />
    <Chain pts={chainPts(12, r.cx, 62, 28, 6, 56)} />
    <T x={l.cx} y={130} size={14} bold colour={muted}>short chain</T>
    <T x={r.cx} y={130} size={14} bold colour={muted}>long chain</T>
    {arrow && <g><Arrow x1={(l.cx + r.cx) / 2 + 30} y1={62} x2={(l.cx + r.cx) / 2 - 44} y2={62} colour={coral} width={2.2} /><T x={(l.cx + r.cx) / 2 - 7} y={50} size={12} bold colour={coral}>shorter</T></g>}
  </g>
}
const L = { cx: 140 }, R = { cx: 400 }
function PropLabels({ left, right }: { left: [string, string]; right: [string, string] }) {
  return <g>
    <T x={L.cx} y={290} size={15} bold colour="#8a5a0c">{left[0]}</T><T x={L.cx} y={308} size={13} colour={muted}>{left[1]}</T>
    <T x={R.cx} y={290} size={15} bold colour={longLine}>{right[0]}</T><T x={R.cx} y={308} size={13} colour={muted}>{right[1]}</T>
  </g>
}
function Funnel({ x, fill, line }: { x: number; fill: string; line: string }) {
  return <g>
    <path d={`M${x - 34} 124H${x + 34}L${x + 6} 156V172H${x - 6}V156Z`} fill="white" stroke={metalLine} strokeWidth="2.2" />
    <path d={`M${x - 26} 130H${x + 26}L${x + 5} 154V170H${x - 5}V154Z`} fill={fill} stroke={line} strokeWidth="1" />
  </g>
}
function Beaker({ x, level, fill, line }: { x: number; level: number; fill: string; line: string }) {
  const top = 206, bottom = 268
  return <g>
    <path d={`M${x - 36} ${bottom - level}H${x + 36}V${bottom - 8}Q${x + 36} ${bottom} ${x + 28} ${bottom}H${x - 28}Q${x - 36} ${bottom} ${x - 36} ${bottom - 8}Z`} fill={fill} stroke={line} strokeWidth="1" />
    <path d={`M${x - 38} ${top}V${bottom - 8}Q${x - 38} ${bottom + 2} ${x - 28} ${bottom + 2}H${x + 28}Q${x + 38} ${bottom + 2} ${x + 38} ${bottom - 8}V${top}`} fill="none" stroke={metalLine} strokeWidth="2.4" />
  </g>
}
function Viscosity() {
  return <Diagram viewBox="0 0 540 340" title="Two hydrocarbons flowing through funnels. Short chain: a runny liquid pours in a quick, steady stream and the beaker fills fast: less viscous. Long chain: a thick liquid oozes out as one slow drip and the beaker has only a little in it: more viscous.">
    <Heads l={L} r={R} />
    <g transform="translate(0 20)">
    <path d="M270 120V270" stroke={panelLine} strokeWidth="2" strokeDasharray="6 6" />
    <Funnel x={L.cx} fill={shortFill} line={shortLine} />
    <path d={`M${L.cx - 2} 170Q${L.cx - 3} 200 ${L.cx - 2} 236H${L.cx + 2}Q${L.cx + 3} 200 ${L.cx + 2} 170Z`} fill={shortFill} stroke={shortLine} strokeWidth="1.2" />
    <Beaker x={L.cx} level={34} fill={shortFill} line={shortLine} />
    <Funnel x={R.cx} fill={longFill} line={longLine} />
    <path d={`M${R.cx - 5} 170Q${R.cx - 9} 184 ${R.cx} 190Q${R.cx + 9} 184 ${R.cx + 5} 170Z`} fill={longFill} stroke={longLine} strokeWidth="1.4" />
    <Drop x={R.cx} y={214} s={.35} fill={longFill} line={longLine} />
    <Beaker x={R.cx} level={8} fill={longFill} line={longLine} />
    <PropLabels left={['runny', 'less viscous']} right={['thick', 'more viscous']} />
      </g>
  </Diagram>
}
function TestTube({ x, fill, line, level }: { x: number; fill: string; line: string; level: number }) {
  return <g>
    <path d={`M${x - 14} ${238 - level}H${x + 14}V224A14 14 0 0 1 ${x - 14} 224Z`} fill={fill} stroke={line} strokeWidth="1" />
    <path d={`M${x - 16} 128V224A16 16 0 0 0 ${x + 16} 224V128`} fill="none" stroke={metalLine} strokeWidth="2.4" />
    {[[-5, 222], [5, 212], [-3, 200], [4, 190]].map(([dx, y], i) => <circle key={i} cx={x + dx} cy={y} r="3.4" fill="white" stroke={line} strokeWidth="1.2" />)}
    {[-7, 3, -4].map((dx, i) => <circle key={i} cx={x + dx} cy={236 - level - 12 - i * 14} r="3" fill="none" stroke={muted} strokeWidth="1.2" opacity=".7" />)}
  </g>
}
function Thermo({ x, level }: { x: number; level: number }) {
  return <g>
    <rect x={x - 7} y={126} width={14} height={116} rx="7" fill="white" stroke={metalLine} strokeWidth="2" />
    <circle cx={x} cy={248} r="11" fill="#e8837a" stroke={coral} strokeWidth="2" />
    <rect x={x - 3} y={242 - level} width={6} height={level + 2} rx="3" fill="#e8837a" />
    {[150, 172, 194, 216].map(y => <path key={y} d={`M${x + 7} ${y}H${x + 12}`} stroke={metalLine} strokeWidth="1.6" />)}
  </g>
}
function Boiling() {
  return <Diagram viewBox="0 0 540 340" title="Two test tubes of hydrocarbon being heated until they boil, each with a thermometer beside it. The short-chain hydrocarbon boils while its thermometer reading is still low: a lower boiling point. The long-chain hydrocarbon only boils when its thermometer reading is high: a higher boiling point.">
    <Heads l={L} r={R} />
    <g transform="translate(0 20)">
    <path d="M270 120V270" stroke={panelLine} strokeWidth="2" strokeDasharray="6 6" />
    {[L, R].map((s, i) => <g key={s.cx}>
      <TestTube x={s.cx - 20} fill={i ? longFill : shortFill} line={i ? longLine : shortLine} level={50} />
      <Flame x={s.cx - 20} y={270} s={.42} />
      <Thermo x={s.cx + 36} level={i ? 100 : 26} />
    </g>)}
    <PropLabels left={['lower boiling point', 'boils at a lower temperature']} right={['higher boiling point', 'needs a higher temperature']} />
      </g>
  </Diagram>
}
function Dish({ x, fill, line }: { x: number; fill: string; line: string }) {
  return <g>
    <path d={`M${x - 44} 226Q${x} 272 ${x + 44} 226Z`} fill="white" stroke={metalLine} strokeWidth="2.4" />
    <path d={`M${x - 36} 232Q${x} 262 ${x + 36} 232Z`} fill={fill} stroke={line} strokeWidth="1" />
  </g>
}
function Splint({ x }: { x: number }) {
  return <g><path d={`M${x - 92} 150L${x - 30} 222`} stroke="#c9a46a" strokeWidth="5" /><Flame x={x - 28} y={228} s={.28} /></g>
}
function Flammable() {
  return <Diagram viewBox="0 0 540 340" title="A lit splint held to a dish of each hydrocarbon. The short-chain hydrocarbon catches fire at once with a big flame: more flammable. The long-chain hydrocarbon only gives a tiny flame and is hard to set alight: harder to ignite.">
    <Heads l={L} r={R} />
    <g transform="translate(0 20)">
    <path d="M270 120V270" stroke={panelLine} strokeWidth="2" strokeDasharray="6 6" />
    <Flame x={L.cx + 4} y={234} s={1.5} />
    <Dish x={L.cx + 4} fill={shortFill} line={shortLine} />
    <Splint x={L.cx + 4} />
    <Dish x={R.cx + 4} fill={longFill} line={longLine} />
    <Flame x={R.cx + 12} y={234} s={.3} />
    <Splint x={R.cx + 4} />
    <PropLabels left={['more flammable', 'catches fire easily']} right={['harder to ignite', 'hard to set alight']} />
      </g>
  </Diagram>
}
const CL = { cx: 118 }, CR = { cx: 422 }
function Compare() {
  const rows: Array<[string, string, string]> = [['flow', 'runny', 'thick'], ['boiling point', 'low', 'high'], ['burning', 'flammable', 'harder to ignite']]
  return <Diagram viewBox="0 0 540 350" title="Summary. Short chains: runny, low boiling point, flammable. Long chains: thick, high boiling point, harder to ignite. An arrow along the bottom shows the chain length increasing from short to long.">
    <Heads l={CL} r={CR} arrow={false} />
    <g transform="translate(0 20)">
    {rows.map(([what, s, l], i) => { const y = 150 + i * 44
      return <g key={what}>
        <rect x={CL.cx - 98} y={y - 20} width={196} height={34} rx="17" fill="#fcf3dc" stroke={shortLine} strokeWidth="1.6" />
        <T x={CL.cx} y={y + 3} size={15} bold colour="#8a5a0c">{s}</T>
        <T x={270} y={y + 3} size={13} colour={muted}>{what}</T>
        <rect x={CR.cx - 98} y={y - 20} width={196} height={34} rx="17" fill="#f3e7da" stroke={longLine} strokeWidth="1.6" />
        <T x={CR.cx} y={y + 3} size={15} bold colour={longLine}>{l}</T>
      </g> })}
    <Arrow x1={40} y1={298} x2={500} y2={298} colour={muted} width={3} />
    <T x={270} y={320} size={13} bold colour={muted}>chain gets longer</T>
      </g>
  </Diagram>
}

// ---------- Question visuals ----------
function QChains() {
  return <Diagram viewBox="0 0 540 240" title="Two hydrocarbon molecules drawn as chains of carbon atoms with hydrogen atoms around them. Molecule A has 3 carbon atoms. Molecule B has 12 carbon atoms, drawn over two rows.">
    <Panel x={20} y={30} w={200} h={190} />
    <Num n="A" x={120} y={30} />
    <Chain pts={chainPts(3, 120, 126)} />
    <Panel x={240} y={30} w={280} h={190} />
    <Num n="B" x={380} y={30} />
    <Chain pts={chainPts(12, 380, 126, 30, 6)} />
  </Diagram>
}
function QTable() {
  const rows: Array<[string, number, number]> = [['P', 5, 36], ['Q', 10, 174], ['R', 16, 287]]
  const cols = [110, 270, 430]
  return <Diagram viewBox="0 0 540 210" schematic={false} title="A table with three hydrocarbons. P has 5 carbon atoms and a boiling point of 36 °C. Q has 10 carbon atoms and a boiling point of 174 °C. R has 16 carbon atoms and a boiling point of 287 °C.">
    <rect x={30} y={20} width={480} height={172} rx="14" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <rect x={30} y={20} width={480} height={44} rx="14" fill="#e8f0f5" />
    <T x={cols[0]} y={48} size={14} bold>Hydrocarbon</T>
    <T x={cols[1]} y={48} size={14} bold>Carbon atoms</T>
    <T x={cols[2]} y={48} size={14} bold>Boiling point (°C)</T>
    {rows.map(([h, c, b], i) => { const y = 64 + i * 42
      return <g key={h}>
        {i > 0 && <path d={`M40 ${y}H500`} stroke={panelLine} strokeWidth="1.5" />}
        <T x={cols[0]} y={y + 27} size={17} bold>{h}</T>
        <T x={cols[1]} y={y + 27} size={17}>{c}</T>
        <T x={cols[2]} y={y + 27} size={17}>{b}</T>
      </g> })}
    <path d="M190 30V182M350 30V182" stroke={panelLine} strokeWidth="1.5" />
  </Diagram>
}

export function CrudeOilVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'crude-fossil': return <FossilScene />
    case 'crude-formed': return <Formed />
    case 'crude-rate': return <RateScene />
    case 'crude-finite': return <FiniteScene />
    case 'crude-fuels': return <Fuels />
    case 'crude-feedstock': return <Petrochem step="feedstock" />
    case 'crude-products': return <Petrochem step="products" />
    case 'crude-organic': return <Organic />
    case 'crude-homologous': return <Homologous />
    case 'crude-range': return <RangeScene />
    case 'crude-viscosity': return <Viscosity />
    case 'crude-boiling': return <Boiling />
    case 'crude-flammable': return <Flammable />
    case 'crude-compare': return <Compare />
    case 'crude-q-chains': return <QChains />
    case 'crude-q-table': return <QTable />
    default: return <FossilScene />
  }
}
