import { useId, type ReactNode } from 'react'

// Lessons 17–18: original, code-native plant schematics. Not to scale; not specimens or micrographs.
// Colour code used throughout: blue = water, amber = sugar/food, purple = carbon dioxide, yellow = light.
const ink = '#375a73', blue = '#3f93bd', water = '#55acd0', purple = '#8f6fc4', yellow = '#efc75d'
const amber = '#c98f2c', amberFill = '#f6dfa5', leafGreen = '#68ae92', deepGreen = '#4f8f5a', chloro = '#5c9d57'
const cellFill = '#e8f4e4', cellStroke = '#6c9f76', soil = '#efe3cf', root = '#b39463', faded = 0.3

type Pt = [number, number]
const r1 = (n: number) => Math.round(n * 10) / 10

// Deterministic pseudo-random numbers: shapes are identical on server and client.
function seeded(seed: number) {
  let s = (Math.abs(Math.floor(seed)) * 9973 + 7) % 2147483647 || 1
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}
function smoothClosed(points: Pt[]) {
  const n = points.length
  let d = `M${r1(points[0][0])} ${r1(points[0][1])}`
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n], p1 = points[i], p2 = points[(i + 1) % n], p3 = points[(i + 2) % n]
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])} ${r1(p2[1])}`
  }
  return d + 'Z'
}
// A gently irregular cell outline. squareness < 1 gives rounded-box cells (palisade); 1 gives rounder cells.
function blob(cx: number, cy: number, rx: number, ry: number, seed: number, wobble = 0.08, squareness = 1, count = 14) {
  const rand = seeded(seed)
  const points: Pt[] = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2, c = Math.cos(angle), s = Math.sin(angle)
    const k = 1 + (rand() - 0.5) * 2 * wobble
    return [cx + Math.sign(c) * Math.pow(Math.abs(c), squareness) * rx * k, cy + Math.sign(s) * Math.pow(Math.abs(s), squareness) * ry * k]
  })
  return smoothClosed(points)
}

function Diagram({ title, children, viewBox = '0 0 540 300', note }: { title: string; children: ReactNode; viewBox?: string; note?: string }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{title}</title>{children}</svg>{note && <p className="science-bio-note">{note}</p>}</div>
}
function Arrow({ x1, y1, x2, y2, colour = purple, width = 3 }: { x1: number; y1: number; x2: number; y2: number; colour?: string; width?: number }) {
  const angle = Math.atan2(y2 - y1, x2 - x1), head = 7 + width * 1.5
  const points = [[x2, y2], [x2 - head * Math.cos(angle - .5), y2 - head * Math.sin(angle - .5)], [x2 - head * Math.cos(angle + .5), y2 - head * Math.sin(angle + .5)]]
  return <g fill={colour} stroke={colour} strokeWidth={width} strokeLinecap="round"><line x1={x1} y1={y1} x2={r1(x2 - head * .7 * Math.cos(angle))} y2={r1(y2 - head * .7 * Math.sin(angle))} /><polygon strokeWidth="1" points={points.map(p => p.map(r1).join(',')).join(' ')} /></g>
}
// A label whose leader line ends exactly on the named feature (small dot marks the end point).
function leaderStart(x: number, y: number, lines: string[], anchor: 'start' | 'middle' | 'end', to: Pt): Pt {
  const width = Math.max(...lines.map(line => line.length)) * 7.4
  const left = anchor === 'start' ? x : anchor === 'end' ? x - width : x - width / 2, right = left + width
  if (to[0] >= right + 4) return [right + 4, y - 5]
  if (to[0] <= left - 4) return [left - 4, y - 5]
  const cx = Math.min(Math.max(to[0], left + 6), right - 6)
  return to[1] > y ? [cx, y + (lines.length - 1) * 16 + 6] : [cx, y - 17]
}
function Label({ x, y, to, lines, anchor = 'start', dim = false, strong = false, colour = ink }: { x: number; y: number; to?: Pt; lines: string[]; anchor?: 'start' | 'middle' | 'end'; dim?: boolean; strong?: boolean; colour?: string }) {
  const lineStart: Pt = to ? leaderStart(x, y, lines, anchor, to) : [x, y]
  return <g opacity={dim ? .4 : 1}>
    {to && <><path d={`M${lineStart[0]} ${lineStart[1]}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.5" fill="none" /><circle cx={to[0]} cy={to[1]} r="2.5" fill={ink} /></>}
    <text x={x} y={y} textAnchor={anchor} fill={colour} fontSize="14" fontWeight={strong ? 700 : 500}>{lines.map((line, i) => <tspan key={line} x={x} dy={i ? 16 : 0}>{line}</tspan>)}</text>
  </g>
}
function Marker({ n, x, y, to }: { n: number; x: number; y: number; to: Pt }) {
  return <g><path d={`M${x - 13} ${y}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.5" /><circle cx={to[0]} cy={to[1]} r="2.5" fill={ink} /><circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}
function Vapour({ x, y, length = 26, colour = water }: { x: number; y: number; length?: number; colour?: string }) {
  return <path d={`M${x} ${y}q5 ${length / 4} 0 ${length / 2}t0 ${length / 2}`} stroke={colour} strokeWidth="2.5" fill="none" strokeLinecap="round" />
}

// ---------- Leaf cross-section building blocks ----------
const LEAF_LEFT = 20, LEAF_RIGHT = 400
function Epidermis({ top, height, seed, gapX }: { top: number; height: number; seed: number; gapX?: number }) {
  const cells: ReactNode[] = []
  let x = LEAF_LEFT, i = 0
  const rand = seeded(seed)
  while (x < LEAF_RIGHT - 8) {
    const w = 24 + rand() * 10
    if (gapX !== undefined && x + w > gapX - 22 && x < gapX + 22) { x = gapX + 22; continue }
    const width = Math.min(w, LEAF_RIGHT - x)
    cells.push(<path key={i} d={blob(x + width / 2, top + height / 2, width / 2 - 1, height / 2 - 1, seed + i, .05, .45)} fill="#f4fbf6" stroke={cellStroke} strokeWidth="1.5" />)
    x += width; i++
  }
  return <g>{cells}</g>
}
function Palisade({ top, height, seed }: { top: number; height: number; seed: number }) {
  const rand = seeded(seed)
  const cells: ReactNode[] = []
  for (let i = 0, x = LEAF_LEFT + 12; x < LEAF_RIGHT - 8; i++, x += 23.5) {
    const h = height - 4 - rand() * 6, cy = top + 2 + h / 2 + rand() * 2
    cells.push(<g key={i}><path d={blob(x, cy, 10.5, h / 2, seed + i * 3, .05, .55)} fill={cellFill} stroke={cellStroke} strokeWidth="1.5" />
      {[.15, .32, .5, .68, .85].map((f, j) => <ellipse key={j} cx={r1(x + (j % 2 ? 5 : -5))} cy={r1(cy - h / 2 + f * h)} rx="3.2" ry="2.3" fill={chloro} />)}</g>)
  }
  return <g>{cells}</g>
}
function Spongy({ top, height, seed, avoid = [] }: { top: number; height: number; seed: number; avoid?: Array<[number, number, number]> }) {
  const rand = seeded(seed)
  const cells: ReactNode[] = []
  let i = 0
  for (let row = 0, y = top + 15; y < top + height - 10; row++, y += 27) for (let x = LEAF_LEFT + 18 + (row % 2) * 16; x < LEAF_RIGHT - 12; x += 34) {
    const cx = x + (rand() - .5) * 8, cy = y + (rand() - .5) * 5, rx = 11 + rand() * 4, ry = 9 + rand() * 3
    if (avoid.some(([ax, ay, ar]) => Math.hypot(cx - ax, cy - ay) < ar + rx)) continue
    cells.push(<g key={i}><path d={blob(cx, cy, rx, ry, seed + i * 5, .14)} fill={cellFill} stroke={cellStroke} strokeWidth="1.5" /><ellipse cx={r1(cx - 4)} cy={r1(cy + 2)} rx="2.8" ry="2" fill={chloro} /><ellipse cx={r1(cx + 4)} cy={r1(cy - 2)} rx="2.8" ry="2" fill={chloro} /></g>)
    i++
  }
  return <g>{cells}</g>
}
function Vein({ cx, cy }: { cx: number; cy: number }) {
  return <g>
    <path d={blob(cx, cy, 40, 32, 41, .06)} fill="#fbf7ea" stroke={cellStroke} strokeWidth="2" />
    {[[-18, -12, 7], [-3, -16, 8], [13, -12, 7], [-10, 0, 5.5], [6, -1, 6]].map(([dx, dy, r], i) => <circle key={i} cx={cx + dx} cy={cy + dy} r={r} fill="#e3f3fb" stroke={blue} strokeWidth="3" />)}
    {[[-16, 14, 4], [-6, 17, 4.5], [4, 15, 3.5], [13, 12, 4], [-1, 24, 3], [9, 22, 3]].map(([dx, dy, r], i) => <circle key={i} cx={cx + dx} cy={cy + dy} r={r} fill={amberFill} stroke={amber} strokeWidth="1.5" />)}
  </g>
}
// Two guard cells around one stoma, seen from below the leaf. Open = swollen and bowed apart; closed = floppy and together.
function GuardPair({ cx, cy, open, scale = 1 }: { cx: number; cy: number; open: boolean; scale?: number }) {
  const h = 40 * scale, bulge = (open ? 42 : 32) * scale, gap = open ? 12 * scale : 1
  const cell = (side: 1 | -1) => `M${cx + side * 2} ${cy - h}C${cx + side * bulge} ${cy - h * .95} ${cx + side * bulge} ${cy + h * .95} ${cx + side * 2} ${cy + h}C${cx + side * (2 + gap)} ${cy + h * .45} ${cx + side * (2 + gap)} ${cy - h * .45} ${cx + side * 2} ${cy - h}Z`
  return <g>
    {open && <path d={`M${cx} ${cy - h + 4}C${cx - gap} ${cy - h * .4} ${cx - gap} ${cy + h * .4} ${cx} ${cy + h - 4}C${cx + gap} ${cy + h * .4} ${cx + gap} ${cy - h * .4} ${cx} ${cy - h + 4}Z`} fill="#f7fbfd" />}
    {([-1, 1] as const).map(side => <g key={side}><path d={cell(side)} fill={open ? '#d6ecd0' : '#e6efe2'} stroke={deepGreen} strokeWidth="2.2" />
      {[-.5, -.15, .2, .52].map((f, i) => <ellipse key={i} cx={r1(cx + side * (open ? 16 : 13) * scale)} cy={r1(cy + f * h)} rx={2.8 * scale} ry={2 * scale} fill={chloro} />)}</g>)}
  </g>
}
function SmallStoma({ cx, cy, open }: { cx: number; cy: number; open: boolean }) {
  return <g>
    <path d={blob(cx - 8, cy, 8, 6.5, 91, .05)} fill="#d6ecd0" stroke={deepGreen} strokeWidth="1.8" />
    <path d={blob(cx + 8, cy, 8, 6.5, 92, .05)} fill="#d6ecd0" stroke={deepGreen} strokeWidth="1.8" />
    {!open && <path d={`M${cx} ${cy - 5}V${cy + 5}`} stroke={deepGreen} strokeWidth="2" />}
  </g>
}

// Layer geometry for the main leaf cross-section.
const L = { upper: [46, 16], palisade: [63, 70], spongy: [135, 88], lower: [225, 16] } as const
const STOMA_X = 150, AIR_GAP: Pt = [235, 192], VEIN: Pt = [322, 178]
const layerNames = { upper: 'upper epidermis', palisade: 'palisade mesophyll', spongy: 'spongy mesophyll', lower: 'lower epidermis' } as const
type Layer = keyof typeof layerNames | 'vein' | 'none'

function LeafLayers({ focus }: { focus: Layer }) {
  const o = (layer: Layer) => focus === 'none' || focus === layer ? 1 : faded
  return <g>
    <rect x={LEAF_LEFT} y={L.upper[0]} width={LEAF_RIGHT - LEAF_LEFT} height={L.lower[0] + L.lower[1] - L.upper[0]} rx="6" fill="#f7fbf8" stroke={cellStroke} strokeWidth="1" />
    <g opacity={o('upper')}><Epidermis top={L.upper[0]} height={L.upper[1]} seed={3} /></g>
    <g opacity={o('palisade')}><Palisade top={L.palisade[0]} height={L.palisade[1]} seed={11} /></g>
    <g opacity={o('spongy')}><Spongy top={L.spongy[0]} height={L.spongy[1]} seed={23} avoid={[[VEIN[0], VEIN[1], 44], [AIR_GAP[0], AIR_GAP[1], 10], [STOMA_X, 212, 16]]} /></g>
    <g opacity={o('vein')}><Vein cx={VEIN[0]} cy={VEIN[1]} /></g>
    <g opacity={o('lower')}><Epidermis top={L.lower[0]} height={L.lower[1]} seed={37} gapX={STOMA_X} /><GuardPair cx={STOMA_X} cy={L.lower[0] + 8} open scale={.3} /></g>
  </g>
}
const layerPoint: Record<keyof typeof layerNames, Pt> = { upper: [392, 54], palisade: [392, 98], spongy: [262, 150], lower: [392, 233] }

function LeafSection({ focus, assessment }: { focus: string; assessment: boolean }) {
  const part = focus.replace('plant-leaf-', '')
  if (part === 'question') {
    const names = Object.values(layerNames)
    return <Diagram viewBox="0 0 560 290" title={assessment ? 'A leaf cut across, showing four layers numbered 1 to 4 from top to bottom. Original schematic, not to scale.' : 'A leaf cut across with its four layers named: 1 upper epidermis, 2 palisade mesophyll, 3 spongy mesophyll, 4 lower epidermis. Original schematic, not to scale.'}>
      <LeafLayers focus="none" />
      {(Object.keys(layerNames) as Array<keyof typeof layerNames>).map((key, i) => <g key={key}><Marker n={i + 1} x={430} y={[54, 100, 152, 233][i]} to={layerPoint[key]} />{!assessment && <text x={450} y={[54, 100, 152, 233][i] + 5} fill={ink} fontSize="13" fontWeight="600">{names[i].split(' ').map((w, j) => <tspan key={w} x={450} dy={j ? 15 : 0}>{w}</tspan>)}</text>}</g>)}
    </Diagram>
  }
  if (part === 'drawing') return <StudentDrawing assessment={assessment} />
  const focusLayer: Layer = part === 'upper' || part === 'palisade' || part === 'spongy' || part === 'lower' || part === 'vein' ? part : 'none'
  const together = part === 'together'
  const titles: Record<string, string> = {
    overview: 'A leaf cut across. From top to bottom: a clear upper epidermis, tall palisade cells full of chloroplasts, loosely packed spongy cells with air gaps and a vein, and a lower epidermis with a stoma between two guard cells.',
    upper: 'A leaf cut across with the thin, clear upper epidermis highlighted along the top.',
    palisade: 'A leaf cut across with the palisade layer highlighted: tall, tightly packed cells full of chloroplasts just under the top layer.',
    spongy: 'A leaf cut across with the spongy layer highlighted: rounder, loosely packed cells with air gaps between them.',
    lower: 'A leaf cut across with the lower epidermis highlighted, showing a stoma between two guard cells.',
    together: 'A leaf cut across. Light passes down through the clear top layer. Carbon dioxide enters through a stoma at the bottom and moves through the air gaps. Both reach the middle layers.',
    vein: 'A leaf cut across with a vein highlighted. The vein contains xylem, which brings water in, and phloem, which carries sugar out.',
  }
  const dim = (layer: Layer) => focusLayer !== 'none' && focusLayer !== layer
  return <Diagram viewBox="0 0 560 290" title={`${titles[part] || titles.overview} Original schematic, not to scale.`}>
    <LeafLayers focus={focusLayer} />
    {together && <g>{[70, 140, 210, 280].map(x => <Arrow key={x} x1={x - 14} y1={8} x2={x} y2={84} colour={yellow} width={3.5} />)}<text x={300} y={22} fill={ink} fontSize="14" fontWeight="700">light</text>
      <path d={`M${STOMA_X} 284V214Q${STOMA_X} 196 170 188L218 168`} fill="none" stroke={purple} strokeWidth="3.5" strokeLinecap="round" /><Arrow x1={210} y1={172} x2={232} y2={136} colour={purple} width={3.5} /><text x={170} y={278} fill={ink} fontSize="14" fontWeight="700">carbon dioxide</text></g>}
    {!together && <>
      {focusLayer !== 'vein' && (Object.keys(layerNames) as Array<keyof typeof layerNames>).map(key => <Label key={key} x={414} y={{ upper: 58, palisade: 102, spongy: 147, lower: 237 }[key]} to={key === 'spongy' ? [404, 142] : layerPoint[key]} lines={layerNames[key].split(' ')} dim={dim(key)} strong={focusLayer === key} />)}
      {focusLayer === 'spongy' && <path d="M404 142L262 150" stroke={ink} strokeWidth="1.5" />}
      {focusLayer !== 'vein' && <Label x={414} y={188} to={[364, 180]} lines={['vein']} dim={dim('vein')} />}
      {(focusLayer === 'lower' || focusLayer === 'none') && <><Label x={40} y={272} to={[STOMA_X, L.lower[0] + 10]} lines={['stoma (tiny hole)']} strong={focusLayer === 'lower'} /><Label x={200} y={282} to={[STOMA_X + 10, L.lower[0] + 14]} lines={['guard cells']} /></>}
      {focusLayer === 'spongy' && <Label x={250} y={276} to={AIR_GAP} lines={['air gap']} strong />}
      {focusLayer === 'vein' && <g><Label x={414} y={142} to={[VEIN[0] + 13, VEIN[1] - 19]} lines={['xylem:', 'brings water in']} colour={blue} strong /><Label x={414} y={214} to={[VEIN[0] + 13, VEIN[1] + 16]} lines={['phloem:', 'carries sugar out']} colour={amber} strong /></g>}
    </>}
  </Diagram>
}

function StudentDrawing({ assessment }: { assessment: boolean }) {
  const pencil = '#6a7784'
  return <Diagram viewBox="0 0 560 290" title={'A student’s leaf drawing. From top to bottom the student has drawn and labelled: upper epidermis, spongy mesophyll with air gaps, palisade mesophyll with tall cells, then lower epidermis with a stoma. Original schematic, not to scale.'}>
    <text x={20} y={26} fill={pencil} fontSize="14" fontStyle="italic">A student’s drawing</text>
    <rect x={LEAF_LEFT} y={46} width={LEAF_RIGHT - LEAF_LEFT} height={195} rx="6" fill="#fbfcfb" stroke={pencil} strokeDasharray="4 3" />
    <Epidermis top={46} height={16} seed={3} />
    <Spongy top={63} height={86} seed={23} />
    <Palisade top={151} height={72} seed={11} />
    <Epidermis top={225} height={16} seed={37} gapX={STOMA_X} /><GuardPair cx={STOMA_X} cy={233} open scale={.3} />
    {[['upper', 'epidermis', 58, 54], ['spongy', 'mesophyll', 104, 104], ['palisade', 'mesophyll', 181, 186], ['lower', 'epidermis', 237, 233]].map(([a, b, y, to]) => <g key={String(a)}><path d={`M410 ${Number(y) - 5}L392 ${to}`} stroke={pencil} strokeWidth="1.5" /><text x={414} y={Number(y)} fill={pencil} fontSize="14" fontStyle="italic"><tspan x={414}>{a}</tspan><tspan x={414} dy={16}>{b}</tspan></text></g>)}
    {!assessment && <text x={20} y={264} fill="#a4475a" fontSize="14" fontWeight="700"><tspan x={20}>Fix: palisade cells belong just under the top layer,</tspan><tspan x={20} dy={16}>where there is most light.</tspan></text>}
  </Diagram>
}

// ---------- Whole plant ----------
type Pose = { node: Pt; angle: number; length: number; width: number }
const leaves: Pose[] = [
  { node: [252, 170], angle: 200, length: 78, width: 24 }, { node: [253, 140], angle: -18, length: 80, width: 25 },
  { node: [254, 108], angle: 196, length: 72, width: 22 }, { node: [255, 80], angle: -24, length: 66, width: 20 },
]
function leafPath({ node: [x, y], angle, length, width }: Pose) {
  const a = angle * Math.PI / 180, dx = Math.cos(a), dy = Math.sin(a), px = -dy, py = dx
  const tip: Pt = [x + dx * length, y + dy * length]
  const c1: Pt = [x + dx * length * .42 + px * width, y + dy * length * .42 + py * width]
  const c2: Pt = [x + dx * length * .5 - px * width * .85, y + dy * length * .5 - py * width * .85]
  return { outline: `M${x} ${y}Q${r1(c1[0])} ${r1(c1[1])} ${r1(tip[0])} ${r1(tip[1])}Q${r1(c2[0])} ${r1(c2[1])} ${x} ${y}Z`, rib: `M${x} ${y}L${r1(x + dx * length * .92)} ${r1(y + dy * length * .92)}`, mid: [r1(x + dx * length * .55), r1(y + dy * length * .55)] as Pt }
}
const stemPath = 'M250 214C247 170 257 120 252 90C249 70 256 54 256 44'
const rootPaths = ['M250 214C249 238 252 262 248 288', 'M250 226C236 236 214 238 196 252C186 260 176 262 166 272', 'M249 240C266 246 290 246 306 256C318 263 326 268 334 278', 'M251 258C238 264 226 272 220 286', 'M248 268C258 274 270 276 280 288']
const rootTips: Pt[] = [[248, 288], [166, 272], [334, 278], [220, 286], [280, 288]]
const SHOOT_TIP: Pt = [256, 40]

function PlantBase({ dimLeaves = false, dimStem = false, dimRoots = false, tuber = false }: { dimLeaves?: boolean; dimStem?: boolean; dimRoots?: boolean; tuber?: boolean }) {
  return <g>
    <path d="M10 214Q140 206 270 214T530 212V300H10Z" fill={soil} />
    <g opacity={dimRoots ? faded : 1} fill="none" stroke={root} strokeLinecap="round">{rootPaths.map((d, i) => <path key={d} d={d} strokeWidth={i ? 3 : 4.5} />)}{tuber && <path d={blob(180, 262, 22, 15, 77, .1)} fill="#d8b27a" stroke="#a37c3f" strokeWidth="2" />}</g>
    <g opacity={dimStem ? faded : 1}><path d={stemPath} fill="none" stroke={deepGreen} strokeWidth="12" strokeLinecap="round" /><path d={blob(SHOOT_TIP[0], SHOOT_TIP[1], 7, 9, 5, .1)} fill={leafGreen} stroke={deepGreen} strokeWidth="2" /></g>
    <g opacity={dimLeaves ? faded : 1}>{leaves.map((pose, i) => { const p = leafPath(pose); return <g key={i}><path d={p.outline} fill="#a9d49a" stroke={deepGreen} strokeWidth="2" /><path d={p.rib} stroke={deepGreen} strokeWidth="1.5" /></g> })}</g>
  </g>
}

function WholePlant({ focus }: { focus: string }) {
  if (focus === 'plant-whole') return <Diagram title="A whole plant with its roots in the soil, a stem and several leaves. Each of these parts is an organ. Original schematic, not to scale.">
    <PlantBase />
    <Label x={380} y={96} to={leafPath(leaves[1]).mid} lines={['leaves']} strong />
    <Label x={380} y={160} to={[255, 160]} lines={['stem']} strong />
    <Label x={380} y={256} to={[306, 256]} lines={['roots']} strong />
    <text x={20} y={30} fill={ink} fontSize="14" fontWeight="600"><tspan x={20}>Each part</tspan><tspan x={20} dy={17}>is an organ.</tspan></text>
  </Diagram>
  if (focus === 'plant-meristem') return <Diagram title="A whole plant with the growing tips highlighted: the tip of the shoot at the top and the tips of the roots. Meristem tissue is found at these tips. Original schematic, not to scale.">
    <PlantBase dimLeaves />
    {[SHOOT_TIP, ...rootTips.slice(0, 3)].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="11" fill={yellow} opacity=".55" stroke="#b8902e" strokeWidth="2" />)}
    <Label x={380} y={40} to={[268, 38]} lines={['shoot tip:', 'meristem']} strong />
    <Label x={380} y={250} to={[344, 276]} lines={['root tips:', 'meristem']} strong />
  </Diagram>
  const food = focus === 'plant-food-map'
  const xylemPath = 'M246 282C249 250 247 230 247 214C244 170 254 120 249 90C246 70 252 60 252 52'
  const phloemPath = 'M254 282C257 250 253 230 253 214C250 170 260 120 255 90C252 70 258 60 258 52'
  return <Diagram title={food ? 'A whole plant. Sugar made in the leaves is carried in the phloem up to the growing tip and down to the roots and a food store. Original schematic, not to scale.' : 'A whole plant with xylem and phloem running from the roots, up the stem and into the leaves. Water moves up in the xylem. Sugar moves both up and down in the phloem. Original schematic, not to scale.'}>
    <PlantBase tuber={food} />
    <path d={xylemPath} fill="none" stroke={water} strokeWidth="3" opacity={food ? .35 : 1} />
    <path d={phloemPath} fill="none" stroke={amber} strokeWidth="3" />
    {!food && <><Arrow x1={228} y1={200} x2={228} y2={150} colour={water} width={3} /><Arrow x1={228} y1={130} x2={230} y2={84} colour={water} width={3} /></>}
    <Arrow x1={274} y1={150} x2={274} y2={96} colour={amber} width={3} />
    <Arrow x1={274} y1={172} x2={272} y2={226} colour={amber} width={3} />
    {food && <><path d="M252 230C236 236 214 240 200 250" fill="none" stroke={amber} strokeWidth="3" /><Arrow x1={214} y1={242} x2={200} y2={250} colour={amber} width={3} /></>}
    {food ? <>
      <Label x={380} y={46} to={[266, 42]} lines={['growing tip']} strong />
      <Label x={380} y={130} to={leafPath(leaves[1]).mid} lines={['sugar made', 'in the leaves']} strong colour={amber} />
      <Label x={20} y={196} to={[168, 256]} lines={['food store', '(potato)']} strong />
      <Label x={380} y={262} to={[334, 276]} lines={['roots']} strong />
    </> : <>
      <Label x={20} y={124} to={[246, 126]} lines={['xylem: water and', 'mineral ions, up']} strong colour={blue} />
      <Label x={380} y={200} to={[256, 200]} lines={['phloem: sugar,', 'up and down']} strong colour={amber} />
    </>}
  </Diagram>
}

function Stream({ focus }: { focus: string }) {
  const step = { 'plant-stream-leaf': 1, 'plant-stream-xylem': 2, 'plant-stream-roots': 3 }[focus] || 0
  const on = (n: number) => step === 0 || step === n
  return <Diagram title={step === 1 ? 'Step 1: inside the leaves, water evaporates and water vapour escapes through the stomata.' : step === 2 ? 'Step 2: water moves up the xylem in the stem to replace the water lost from the leaves.' : step === 3 ? 'Step 3: the roots take in more water from the soil.' : 'The transpiration stream: water enters the roots, moves up the xylem in the stem, and leaves the leaves as water vapour.'}>
    <PlantBase />
    <g opacity={on(3) ? 1 : faded}>{rootTips.slice(0, 3).map(([x, y], i) => <Arrow key={i} x1={x + (i === 1 ? -22 : i === 2 ? 22 : 0)} y1={y + (i ? 6 : 10)} x2={x + (i === 1 ? -5 : i === 2 ? 5 : 0)} y2={y - (i ? 0 : 6)} colour={water} width={2.5} />)}</g>
    <g opacity={on(2) ? 1 : faded}><path d="M247 280C249 250 247 230 247 214C244 170 254 120 249 90" fill="none" stroke={water} strokeWidth="4" /><Arrow x1={232} y1={205} x2={232} y2={150} colour={water} width={3.5} /><Arrow x1={232} y1={132} x2={234} y2={86} colour={water} width={3.5} /></g>
    <g opacity={on(1) ? 1 : faded}>{leaves.map((pose, i) => { const [mx, my] = leafPath(pose).mid; return <Vapour key={i} x={mx + (i % 2 ? 6 : -6)} y={my + 12} length={24} /> })}{leaves.map((pose, i) => { const [mx, my] = leafPath(pose).mid; return <Arrow key={`a${i}`} x1={mx + (i % 2 ? 6 : -6)} y1={my + 34} x2={mx + (i % 2 ? 6 : -6)} y2={my + 44} colour={water} width={2.5} /> })}</g>
    <g>
      <g opacity={on(1) ? 1 : .45}><circle cx={378} cy={52} r="12" fill={step === 1 ? water : 'white'} stroke={ink} strokeWidth="2" /><text x={378} y={57} textAnchor="middle" fontSize="14" fontWeight="700" fill={step === 1 ? 'white' : ink}>1</text><Label x={398} y={50} lines={['water vapour', 'leaves the leaf']} strong={step === 1} /></g>
      <g opacity={on(2) ? 1 : .45}><circle cx={378} cy={132} r="12" fill={step === 2 ? water : 'white'} stroke={ink} strokeWidth="2" /><text x={378} y={137} textAnchor="middle" fontSize="14" fontWeight="700" fill={step === 2 ? 'white' : ink}>2</text><Label x={398} y={130} lines={['water pulled up', 'the xylem']} strong={step === 2} /></g>
      <g opacity={on(3) ? 1 : .45}><circle cx={378} cy={236} r="12" fill={step === 3 ? water : 'white'} stroke={ink} strokeWidth="2" /><text x={378} y={241} textAnchor="middle" fontSize="14" fontWeight="700" fill={step === 3 ? 'white' : ink}>3</text><Label x={398} y={234} lines={['roots take in', 'more water']} strong={step === 3} /></g>
    </g>
    {step === 0 && <text x={20} y={30} fill={blue} fontSize="15" fontWeight="700"><tspan x={20}>the transpiration</tspan><tspan x={20} dy={18}>stream</tspan></text>}
  </Diagram>
}

// ---------- Stomata and guard cells ----------
function Guard({ focus }: { focus: string }) {
  if (focus === 'plant-guard-underside') return <Diagram viewBox="0 0 540 250" title="A leaf cut across with the Sun shining on the top. The top surface is warmer and has few stomata. The shaded underside is cooler and has most of the stomata. Original schematic, not to scale.">
    <circle cx={60} cy={38} r="20" fill={yellow} stroke="#b8902e" strokeWidth="2" />
    {[[90, 44, 130, 88], [72, 64, 100, 92], [100, 28, 190, 86]].map(([x1, y1, x2, y2], i) => <Arrow key={i} x1={x1} y1={y1} x2={x2} y2={y2} colour={yellow} width={3} />)}
    <path d="M40 100Q270 86 500 100V164Q270 178 40 164Z" fill={cellFill} stroke={cellStroke} strokeWidth="2" />
    <path d="M40 100Q270 86 500 100" fill="none" stroke={deepGreen} strokeWidth="4" />
    <path d="M40 164Q270 178 500 164" fill="none" stroke={deepGreen} strokeWidth="4" />
    {[130, 250, 370, 460].map(x => <SmallStoma key={x} cx={x} cy={x === 460 ? 169 : 171} open />)}
    <SmallStoma cx={330} cy={93} open />
    <Label x={300} y={40} to={[330, 90]} lines={['top: sunny and warm,', 'few stomata']} strong />
    <Label x={60} y={214} to={[130, 176]} lines={['underside: cooler and shaded,', 'most stomata']} strong />
  </Diagram>
  if (focus === 'plant-guard-cells') return <Diagram viewBox="0 0 540 250" title="A close-up of one stoma seen from below the leaf: a small gap between two curved guard cells. Original schematic, not to scale.">
    <GuardPair cx={230} cy={125} open scale={2.2} />
    <Label x={40} y={60} to={[160, 90]} lines={['guard cell']} strong />
    <Label x={380} y={60} to={[300, 90]} lines={['guard cell']} strong />
    <Label x={380} y={210} to={[231, 150]} lines={['stoma (the gap)']} strong />
  </Diagram>
  const closedFocus = focus === 'plant-guard-closed'
  return <Diagram viewBox="0 0 540 260" title={closedFocus ? 'Two stomata side by side. Left: plenty of water, guard cells swollen and the stoma open. Right, highlighted: short of water, guard cells floppy and the stoma closed, so less water vapour escapes.' : 'Two stomata side by side. Left, highlighted: plenty of water, guard cells swollen and the stoma open, so carbon dioxide gets in and water vapour gets out. Right: short of water, guard cells floppy and the stoma closed.'}>
    <g opacity={closedFocus ? faded : 1}>
      <GuardPair cx={140} cy={118} open scale={1.8} />
      <Arrow x1={40} y1={70} x2={128} y2={108} colour={purple} width={3} />
      <text x={20} y={56} fill={purple} fontSize="14" fontWeight="700">carbon dioxide in</text>
      <path d="M150 128q10 12 22 12t24 14" fill="none" stroke={water} strokeWidth="3" /><Arrow x1={190} y1={150} x2={228} y2={172} colour={water} width={3} />
      <text x={170} y={200} fill={blue} fontSize="14" fontWeight="700">water vapour out</text>
      <text x={140} y={240} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">plenty of water: open</text>
    </g>
    <g opacity={closedFocus ? 1 : faded}>
      <GuardPair cx={400} cy={118} open={false} scale={1.8} />
      <text x={400} y={240} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">short of water: closed</text>
    </g>
  </Diagram>
}

// ---------- Factors affecting transpiration ----------
function Factor({ focus }: { focus: string }) {
  const kind = focus.replace('plant-factor-', '') as 'key' | 'warm' | 'wind' | 'humid' | 'light'
  const rand = seeded(kind.length * 13 + 5)
  const inside: Pt[] = Array.from({ length: 18 }, (_, i) => [60 + (i % 9) * 38 + rand() * 12, 84 + Math.floor(i / 9) * 16 + rand() * 6])
  const outsideCount = { key: 6, warm: 6, wind: 2, humid: 22, light: 6 }[kind]
  const outside: Pt[] = Array.from({ length: outsideCount }, () => [40 + rand() * 330, 150 + rand() * 70])
  const arrowWidth = kind === 'humid' ? 2 : kind === 'key' ? 4 : 6
  const titles = {
    key: 'A close-up of the underside of a leaf. There is lots of water vapour inside the leaf and less in the air outside, so water vapour moves out through the stoma.',
    warm: 'The same close-up in warm conditions. Water evaporates faster, so more water vapour moves out through the stoma.',
    wind: 'The same close-up in moving air. Wind blows water vapour away from the leaf, so the air near the leaf stays dry and more water vapour moves out.',
    humid: 'The same close-up in humid air. The air outside already has lots of water vapour, so there is only a small difference and water vapour moves out slowly.',
    light: 'The same close-up in bright light. The stoma is open for photosynthesis, so water vapour can escape. In the dark, most stomata close.',
  }
  const effect = { key: 'lots → less', warm: 'faster', wind: 'faster', humid: 'slower', light: 'faster' }[kind]
  return <Diagram viewBox="0 0 540 260" title={`${titles[kind]} Original schematic, not to scale.`}>
    <rect x={20} y={28} width={400} height={92} rx="6" fill="#f7fbf8" />
    <Spongy top={26} height={50} seed={61} avoid={[]} />
    <Epidermis top={120} height={16} seed={37} gapX={230} />
    <GuardPair cx={230} cy={128} open scale={.3} />
    {inside.map(([x, y], i) => <circle key={i} cx={r1(x)} cy={r1(y)} r="3.2" fill={water} />)}
    {outside.map(([x, y], i) => <circle key={i} cx={r1(x)} cy={r1(y)} r="3.2" fill={water} />)}
    <Arrow x1={230} y1={112} x2={kind === 'humid' ? 232 : 236} y2={kind === 'humid' ? 160 : 196} colour={blue} width={arrowWidth} />
    <text x={20} y={20} fill={ink} fontSize="14" fontWeight="600">inside the leaf: lots of water vapour</text>
    <text x={20} y={250} fill={ink} fontSize="14" fontWeight="600">{kind === 'humid' ? 'outside air: already damp' : kind === 'wind' ? 'outside air: blown away, stays dry' : 'outside air: less water vapour'}</text>
    <g>
      {kind === 'warm' && <g><rect x={462} y={40} width={14} height={90} rx="7" fill="white" stroke={ink} strokeWidth="2" /><rect x={466} y={60} width={6} height={70} fill="#d98080" /><circle cx={469} cy={140} r="13" fill="#d98080" stroke={ink} strokeWidth="2" />{[0, 1].map(i => <Vapour key={i} x={300 + i * 30} y={150} length={30} />)}</g>}
      {kind === 'wind' && <g stroke={ink} strokeWidth="2.5" fill="none" strokeLinecap="round">{[160, 185, 210].map(y => <path key={y} d={`M300 ${y}H470q18 0 18-12`} />)}</g>}
      {kind === 'humid' && <g>{[[470, 60], [495, 90], [450, 100]].map(([x, y], i) => <path key={i} d={`M${x} ${y - 14}Q${x + 9} ${y} ${x} ${y + 4}Q${x - 9} ${y} ${x} ${y - 14}Z`} fill={water} />)}</g>}
      {kind === 'light' && <g><circle cx={475} cy={70} r="22" fill={yellow} stroke="#b8902e" strokeWidth="2" />{Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return <path key={i} d={`M${r1(475 + Math.cos(a) * 29)} ${r1(70 + Math.sin(a) * 29)}L${r1(475 + Math.cos(a) * 38)} ${r1(70 + Math.sin(a) * 38)}`} stroke="#b8902e" strokeWidth="3" strokeLinecap="round" /> })}<text x={440} y={124} fill={ink} fontSize="13" fontWeight="600"><tspan x={440}>light:</tspan><tspan x={440} dy={15}>stomata open</tspan></text></g>}
      <text x={470} y={236} textAnchor="middle" fill={kind === 'humid' ? '#a4475a' : blue} fontSize="16" fontWeight="700">{effect}</text>
    </g>
  </Diagram>
}

// ---------- Rates and data ----------
function BaggedPlant({ x, reading }: { x: number; reading: string }) {
  return <g>
    <rect x={x - 60} y={168} width={120} height={36} rx="6" fill="#eef4f7" stroke={ink} strokeWidth="2" />
    <rect x={x - 34} y={176} width={68} height={20} rx="3" fill="white" stroke={ink} />
    <text x={x} y={191} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{reading}</text>
    <path d={`M${x - 26} 120H${x + 26}L${x + 20} 166H${x - 20}Z`} fill="#d7a27a" stroke="#9d6b46" strokeWidth="2" />
    <path d={`M${x - 32} 116Q${x} 106 ${x + 32} 116L${x + 26} 168H${x - 26}Z`} fill="none" stroke={ink} strokeDasharray="4 3" />
    <path d={`M${x} 120V64`} stroke={deepGreen} strokeWidth="5" strokeLinecap="round" />
    {[[-1, 100], [1, 86], [-1, 72]].map(([side, y], i) => <path key={i} d={leafPath({ node: [x, y], angle: side < 0 ? 205 : -25, length: 36, width: 11 }).outline} fill="#a9d49a" stroke={deepGreen} strokeWidth="1.5" />)}
  </g>
}
function RateExample() {
  return <Diagram viewBox="0 0 540 262" title="A plant in a sealed bag on a balance. At the start the balance reads 250.0 g. After 3 hours it reads 244.0 g, so the plant has lost 6.0 g of water. Original illustration of a model result.">
    <text x={130} y={34} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">start</text>
    <text x={410} y={34} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">after 3 hours</text>
    <BaggedPlant x={130} reading="250.0 g" /><BaggedPlant x={410} reading="244.0 g" />
    <Arrow x1={210} y1={140} x2={330} y2={140} colour={ink} width={2.5} />
    <text x={270} y={128} textAnchor="middle" fill={ink} fontSize="14">3 hours</text>
    <text x={270} y={228} textAnchor="middle" fill={ink} fontSize="12">The pot is sealed in a bag, so only the plant loses water.</text>
    <text x={270} y={252} textAnchor="middle" fill={blue} fontSize="15" fontWeight="700">water lost: 250.0 − 244.0 = 6.0 g</text>
  </Diagram>
}
function RateData() {
  const bars = [{ name: 'still air', value: 2.0 }, { name: 'moving air (fan)', value: 5.2 }]
  const base = 200, scale = 26
  return <Diagram viewBox="0 0 540 250" title="Results table and bar chart. Two similar plants were kept at the same temperature and light for 4 hours. The plant in still air lost 2.0 g of water. The plant in moving air from a fan lost 5.2 g of water.">
    <text x={20} y={24} fill={ink} fontSize="14" fontWeight="600">Two similar plants, same temperature and light, 4 hours.</text>
    <g fontSize="14" fill={ink}>
      <rect x={20} y={44} width={210} height={96} rx="8" fill="#f5faff" stroke="#c9dbe6" />
      <text x={32} y={70} fontWeight="700">condition</text><text x={218} y={70} textAnchor="end" fontWeight="700">water lost (g)</text>
      <path d="M28 80H222" stroke="#c9dbe6" />
      {bars.map((bar, i) => <g key={bar.name}><text x={32} y={104 + i * 26}>{bar.name}</text><text x={218} y={104 + i * 26} textAnchor="end">{bar.value.toFixed(1)}</text></g>)}
    </g>
    <path d={`M290 ${base}H520M290 ${base}V44`} stroke={ink} strokeWidth="2" />
    {[0, 2, 4, 6].map(v => <g key={v}><path d={`M284 ${base - v * scale}H290`} stroke={ink} /><text x={280} y={base - v * scale + 5} textAnchor="end" fontSize="12" fill={ink}>{v}</text></g>)}
    {bars.map((bar, i) => <g key={bar.name}><rect x={320 + i * 100} y={base - bar.value * scale} width={60} height={bar.value * scale} fill={i ? water : '#a9d3e6'} stroke={ink} strokeWidth="1.5" /><text x={350 + i * 100} y={base - bar.value * scale - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{bar.value.toFixed(1)} g</text><text x={350 + i * 100} y={base + 18} textAnchor="middle" fontSize="12" fill={ink}>{i ? 'moving air' : 'still air'}</text></g>)}
    <text x={300} y={242} fontSize="12" fill={ink}>water lost in 4 hours (g)</text>
  </Diagram>
}

function Compare() {
  const rows = [['carries', 'water and mineral ions', 'dissolved sugar'], ['direction', 'up only', 'up and down'], ['process', 'transpiration stream', 'translocation']]
  return <Diagram viewBox="0 0 540 290" title="Comparison. Xylem carries water and mineral ions, up only, as part of the transpiration stream. Phloem carries dissolved sugar, up and down, by translocation. Original schematic, not to scale.">
    <text x={230} y={24} textAnchor="middle" fill={blue} fontSize="16" fontWeight="700">xylem</text>
    <text x={430} y={24} textAnchor="middle" fill={amber} fontSize="16" fontWeight="700">phloem</text>
    <path d="M208 40V150M252 40V150" stroke={blue} strokeWidth="7" /><rect x={212} y={40} width={36} height={110} fill="#e3f3fb" />
    <Arrow x1={230} y1={140} x2={230} y2={54} colour={water} width={4} />
    <rect x={408} y={40} width={44} height={110} rx="4" fill="#fbf1d7" stroke={amber} strokeWidth="3" />
    {[76, 114].map(y => <g key={y}><path d={`M408 ${y}H452`} stroke={amber} strokeWidth="4" strokeDasharray="6 4" /></g>)}
    <Arrow x1={422} y1={136} x2={422} y2={52} colour={amber} width={3} /><Arrow x1={438} y1={54} x2={438} y2={138} colour={amber} width={3} />
    {rows.map(([name, x, p], i) => <g key={name} fontSize="14" fill={ink}>
      <text x={20} y={190 + i * 34} fontWeight="700">{name}</text>
      <text x={230} y={190 + i * 34} textAnchor="middle">{x}</text>
      <text x={430} y={190 + i * 34} textAnchor="middle">{p}</text>
      {i < 2 && <path d={`M20 ${200 + i * 34}H520`} stroke="#d9e6ee" />}
    </g>)}
  </Diagram>
}

// ---------- Organisation ladder ----------
function Ladder({ focus }: { focus: string }) {
  const system = focus === 'plant-ladder-system'
  const stage = (i: number) => (system ? i === 3 : i < 3) ? 1 : .35
  const cellCol = (x: number, seed: number) => <g><path d={blob(x, 80, 9, 30, seed, .05, .55)} fill={cellFill} stroke={cellStroke} strokeWidth="1.5" />{[.2, .4, .6, .8].map((f, j) => <ellipse key={j} cx={x + (j % 2 ? 4 : -4)} cy={50 + f * 60} rx="2.8" ry="2" fill={chloro} />)}</g>
  const leaf = leafPath({ node: [300, 108], angle: -38, length: 76, width: 24 })
  return <Diagram viewBox="0 0 540 212" title={system ? 'From cell to organ system: one palisade cell, a tissue of similar cells, a leaf organ, and the whole plant as an organ system, which is highlighted.' : 'From cell to organ: one palisade cell, then a tissue made of many similar cells, then a leaf, which is an organ made of several tissues.'}>
    <g opacity={stage(0)}>{cellCol(60, 1)}</g>
    <g opacity={stage(1)}>{[150, 170, 190, 210].map((x, i) => <g key={x}>{cellCol(x, 10 + i)}</g>)}</g>
    <g opacity={stage(2)}><path d={leaf.outline} fill="#a9d49a" stroke={deepGreen} strokeWidth="2" /><path d={leaf.rib} stroke={deepGreen} strokeWidth="1.5" /></g>
    <g opacity={stage(3)}><path d="M455 140C454 110 458 80 456 44" stroke={deepGreen} strokeWidth="5" fill="none" strokeLinecap="round" />{[[456, 110, 205], [456, 86, -20], [456, 62, 200]].map(([x, y, a], i) => <path key={i} d={leafPath({ node: [x, y], angle: a, length: 34, width: 11 }).outline} fill="#a9d49a" stroke={deepGreen} strokeWidth="1.5" />)}<path d="M455 140C446 150 438 150 430 158M455 140C464 150 474 150 482 160M455 140V164" stroke={root} strokeWidth="2.5" fill="none" />{system && <circle cx={456} cy={102} r="64" fill="none" stroke={purple} strokeWidth="3" strokeDasharray="6 4" />}</g>
    {[[88, 128], [236, 272], [376, 404]].map(([x1, x2], i) => <Arrow key={i} x1={x1} y1={84} x2={x2} y2={84} colour={ink} width={2} />)}
    {[['cell', 'one cell', 60], ['tissue', 'similar cells, one job', 180], ['organ', 'a leaf', 318], ['organ system', 'organs together', 456]].map(([name, sub, x], i) => <g key={String(name)} opacity={stage(i)} textAnchor="middle" fill={ink}><text x={Number(x)} y={186} fontSize="14" fontWeight="700">{name}</text><text x={Number(x)} y={204} fontSize="12">{sub}</text></g>)}
  </Diagram>
}

export function PlantOrganisationVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('plant-leaf-')) return <LeafSection focus={focus} assessment={assessment} />
  if (focus.startsWith('plant-ladder-')) return <Ladder focus={focus} />
  if (focus.startsWith('plant-stream-')) return <Stream focus={focus} />
  if (focus.startsWith('plant-guard-')) return <Guard focus={focus} />
  if (focus.startsWith('plant-factor-')) return <Factor focus={focus} />
  if (focus === 'plant-rate-example') return <RateExample />
  if (focus === 'plant-rate-data') return <RateData />
  if (focus === 'plant-compare') return <Compare />
  return <WholePlant focus={focus} />
}

// Shared with EnergyVisuals.tsx (Lesson 26 onwards) so leaf sections and leaves look the same as in Lessons 17–18.
export const plantPalette = { ink, blue, water, purple, yellow, amber, amberFill, leafGreen, deepGreen, chloro, cellFill, cellStroke, soil, root }
export { Epidermis, Palisade, Spongy, Vein, SmallStoma, leafPath, LEAF_LEFT, LEAF_RIGHT }
