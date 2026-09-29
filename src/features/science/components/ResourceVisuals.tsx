import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'
import { blob } from './InfectionVisuals'

/*
 * Chemistry Lesson 49: Finite and renewable resources. Original, code-native schematics; not to scale.
 * Focus ids start with 'resource-'. The small hand-drawn objects here (trees, sheep, rocks, drums, bottles…) are
 * exported and reused by RecycleVisuals.tsx (Lesson 50), so both lessons share one look.
 *
 * Colour code: green = plants, timber and anything renewable; blue = water; yellow = energy;
 * warm grey-brown = finite resources (fossil fuels, ores, rock); soft grey = metal; pale blue-green = glass;
 * soft periwinkle = man-made polymers and fibres.
 */
const { ink, muted, panelFill, panelLine } = atomPalette
export const resPalette = {
  ink, muted, panelFill, panelLine,
  leaf: '#a9d49c', leafLight: '#cfe8c3', leafLine: '#4f8f5a', green: '#4f8a55', greenTint: '#eef7ea', greenEdge: '#a9cfa3',
  trunk: '#c9a276', trunkLine: '#80603c', woodEnd: '#efd8b2',
  water: '#d6ecf7', waterLine: '#4f9fc7', sky: '#f1f7fb',
  soil: '#efe3cf', soilLine: '#c5aa84',
  rock: '#ddd2c4', rockLine: '#97877a',
  finite: '#f4ece2', finiteEdge: '#d6c3ac', finiteInk: '#86684a', oil: '#8b6a4d', oilLine: '#5d4531', coal: '#6c6560', coalLine: '#443f3b',
  sun: '#f4cd5f', sunLine: '#bf952a',
  metal: '#dde2e7', metalLine: '#768694',
  glass: '#dff1ec', glassLine: '#5aa393',
  wool: '#f8f5ed', woolLine: '#a59b86', face: '#71675f',
  cotton: '#ffffff', cottonLine: '#a3aeb6',
  rubber: '#6c7076', rubberLine: '#3e4347',
  poly: '#d3dbf1', polyLine: '#5c6ea6',
  molten: '#f5a54a', moltenIn: '#fcd97d', heatLine: '#c8641e',
  brick: '#e9cfbb', brickLine: '#a4735a',
}
const P = resPalette

type Pt = [number, number]
const r1 = (n: number) => Math.round(n * 10) / 10

// ---------- Frame, text, arrows ----------
export function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
export function Lines({ x, y, lines, anchor = 'start', size = 14, weight = 700, colour = ink }: { x: number; y: number; lines: string[]; anchor?: 'start' | 'middle' | 'end'; size?: number; weight?: number; colour?: string }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={colour}>{lines.map((l, i) => <tspan key={i} x={x} dy={i ? size + 3 : 0}>{l}</tspan>)}</text>
}
export function Caption({ text, y = 288, x = 270 }: { text: string; y?: number; x?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize="14" fontWeight="600" fill={muted}>{text}</text>
}
export function Arrow({ from, to, colour = ink, width = 2.4, dashed = false }: { from: Pt; to: Pt; colour?: string; width?: number; dashed?: boolean }) {
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]), h = 6 + width * 1.5
  const p = (d: number, s: number): Pt => [r1(to[0] - Math.cos(a) * d + Math.cos(a + Math.PI / 2) * s), r1(to[1] - Math.sin(a) * d + Math.sin(a + Math.PI / 2) * s)]
  const [b1, b2, base] = [p(h, h * .6), p(h, -h * .6), p(h * .7, 0)]
  return <g><path d={`M${from[0]} ${from[1]}L${base[0]} ${base[1]}`} stroke={colour} strokeWidth={width} fill="none" strokeDasharray={dashed ? '6 6' : undefined} /><path d={`M${to[0]} ${to[1]}L${b1[0]} ${b1[1]}L${b2[0]} ${b2[1]}Z`} fill={colour} stroke={colour} strokeWidth="1.2" /></g>
}
// A curved arrow: quadratic curve from → to bending through the control point c; the head follows the curve's end.
export function CurveArrow({ from, c, to, colour = ink, width = 2.4, dashed = false }: { from: Pt; c: Pt; to: Pt; colour?: string; width?: number; dashed?: boolean }) {
  const a = Math.atan2(to[1] - c[1], to[0] - c[0]), h = 6 + width * 1.5
  const p = (d: number, s: number): Pt => [r1(to[0] - Math.cos(a) * d + Math.cos(a + Math.PI / 2) * s), r1(to[1] - Math.sin(a) * d + Math.sin(a + Math.PI / 2) * s)]
  const [b1, b2, base] = [p(h, h * .6), p(h, -h * .6), p(h * .7, 0)]
  return <g><path d={`M${from[0]} ${from[1]}Q${c[0]} ${c[1]} ${base[0]} ${base[1]}`} stroke={colour} strokeWidth={width} fill="none" strokeDasharray={dashed ? '6 6' : undefined} /><path d={`M${to[0]} ${to[1]}L${b1[0]} ${b1[1]}L${b2[0]} ${b2[1]}Z`} fill={colour} stroke={colour} strokeWidth="1.2" /></g>
}
export function Card({ x, y, w, h, fill = panelFill, line = panelLine, dim = false, children }: { x: number; y: number; w: number; h: number; fill?: string; line?: string; dim?: boolean; children?: ReactNode }) {
  return <g opacity={dim ? .35 : 1}><rect x={x} y={y} width={w} height={h} rx="18" fill={fill} stroke={line} strokeWidth="1.6" />{children}</g>
}
export function StepBadge({ n, x, y, colour = ink }: { n: number; x: number; y: number; colour?: string }) {
  return <g><circle cx={x} cy={y} r="12" fill={colour} /><text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="white">{n}</text></g>
}
const at = (x: number, y: number, s = 1) => `translate(${x} ${y}) scale(${s})`

// ---------- Living things (green) ----------
export function Tree({ x, y, s = 1, seed = 3 }: { x: number; y: number; s?: number; seed?: number }) {
  return <g transform={at(x, y, s)}>
    <path d="M-7 0C-5 -16 -5 -30 -4 -46L4 -46C5 -30 5 -16 7 0Z" fill={P.trunk} stroke={P.trunkLine} strokeWidth="1.6" />
    <path d={blob(0, -70, 34, 30, seed, .13, 1, 9)} fill={P.leaf} stroke={P.leafLine} strokeWidth="1.8" />
    <path d={blob(-9, -78, 13, 9, seed + 5, .1)} fill={P.leafLight} opacity=".8" />
  </g>
}
export function Sapling({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={at(x, y, s)}>
    <path d="M-16 2Q0 -6 16 2Z" fill={P.soil} stroke={P.soilLine} strokeWidth="1.4" />
    <path d="M0 0C1 -10 -1 -18 0 -30" stroke={P.leafLine} strokeWidth="2.4" fill="none" />
    <path d="M0 -16C-6 -16 -14 -20 -15 -28C-8 -28 -2 -24 0 -16Z" fill={P.leaf} stroke={P.leafLine} strokeWidth="1.4" />
    <path d="M0 -24C6 -24 13 -29 14 -36C7 -36 1 -32 0 -24Z" fill={P.leaf} stroke={P.leafLine} strokeWidth="1.4" />
  </g>
}
export function Stump({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={at(x, y, s)}>
    <path d="M-11 0C-9 -6 -9 -12 -8 -16H8C9 -12 9 -6 11 0Z" fill={P.trunk} stroke={P.trunkLine} strokeWidth="1.6" />
    <ellipse cx={0} cy={-16} rx={8} ry={3.2} fill={P.woodEnd} stroke={P.trunkLine} strokeWidth="1.4" />
  </g>
}
export function Log({ x, y, w = 60 }: { x: number; y: number; w?: number }) {
  return <g>
    <rect x={x} y={y - 8} width={w} height={16} rx="8" fill={P.trunk} stroke={P.trunkLine} strokeWidth="1.6" />
    <path d={`M${x + 12} ${y - 2}h${w * .35}M${x + w * .4} ${y + 3}h${w * .3}`} stroke={P.trunkLine} strokeWidth="1.2" opacity=".6" />
    <ellipse cx={x + w - 6} cy={y} rx={6} ry={8} fill={P.woodEnd} stroke={P.trunkLine} strokeWidth="1.4" />
    <circle cx={x + w - 6} cy={y} r={2.6} fill="none" stroke={P.trunkLine} strokeWidth="1" />
  </g>
}
export function Logs({ x, y }: { x: number; y: number }) {
  return <g><Log x={x - 34} y={y - 8} w={62} /><Log x={x - 30} y={y - 24} w={56} /></g>
}
export function Cotton({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={at(x, y, s)}>
    <path d="M0 0C1 -14 -1 -28 0 -42M0 -20C6 -24 12 -28 14 -36M0 -28C-6 -31 -11 -36 -13 -42" stroke={P.leafLine} strokeWidth="2.2" fill="none" />
    <path d="M1 -10C8 -12 14 -10 16 -4C9 -3 4 -6 1 -10Z" fill={P.leaf} stroke={P.leafLine} strokeWidth="1.2" />
    {([[0, -49, 11], [15, -42, 20], [-14, -48, 31]] as const).map(([bx, by, sd]) => <path key={sd} d={blob(bx, by, 8.5, 7.5, sd, .16, 1, 8)} fill={P.cotton} stroke={P.cottonLine} strokeWidth="1.4" />)}
  </g>
}
export function Wheat({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const grains = [-26, -32, -38, -44, -50]
  return <g transform={at(x, y, s)}>
    <path d="M0 0C1 -16 0 -34 1 -54" stroke="#b8903e" strokeWidth="2" fill="none" />
    <path d="M0 -12C-7 -15 -12 -21 -13 -28C-6 -25 -1 -20 0 -12Z" fill={P.leaf} stroke={P.leafLine} strokeWidth="1.2" />
    {grains.map((gy, i) => <g key={gy}><ellipse cx={-4} cy={gy - (i % 2)} rx={3.4} ry={5.4} transform={`rotate(-24 -4 ${gy})`} fill="#f0d898" stroke="#b8903e" strokeWidth="1.1" />
      <ellipse cx={5} cy={gy - 3} rx={3.4} ry={5.4} transform={`rotate(24 5 ${gy - 3})`} fill="#f0d898" stroke="#b8903e" strokeWidth="1.1" /></g>)}
  </g>
}
export function Sheep({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={at(x, y, s)}>
    {[-18, -8, 10, 20].map(lx => <path key={lx} d={`M${lx} -14V0`} stroke={P.face} strokeWidth="3.2" />)}
    <path d={blob(0, -28, 30, 19, 17, .1, 1, 16)} fill={P.wool} stroke={P.woolLine} strokeWidth="1.8" />
    {[[-12, -32], [2, -36], [-2, -24], [14, -28]].map(([cx, cy], i) => <path key={i} d={`M${cx - 4} ${cy}q4 -4 8 0`} stroke={P.woolLine} strokeWidth="1.2" fill="none" />)}
    <ellipse cx={33} cy={-33} rx={8.5} ry={11} transform="rotate(-20 33 -33)" fill={P.face} />
    <path d="M27 -41q-9 -3 -11 3q6 2 11 -3Z" fill={P.face} />
    <circle cx={36} cy={-36} r={1.6} fill="white" />
  </g>
}

// ---------- Earth, sea, air ----------
export function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path transform={at(x, y, s)} d="M-34 10C-47 10 -46 -9 -31 -8C-31 -25 -9 -29 -3 -16C3 -31 29 -28 28 -12C42 -12 44 10 30 10Z" fill="white" stroke="#a9bccb" strokeWidth="1.8" />
}
export function Sea({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const n = Math.round(w / 36), seg = w / n
  let d = `M${x} ${y}`
  for (let i = 0; i < n; i++) d += `q${r1(seg / 4)} -6 ${r1(seg / 2)} 0t${r1(seg / 2)} 0`
  return <path d={`${d}V${y + h}H${x}Z`} fill={P.water} stroke={P.waterLine} strokeWidth="1.8" />
}
export function Fish({ x, y }: { x: number; y: number }) {
  return <g transform={at(x, y)}><path d="M-14 0C-8 -8 6 -8 10 0C6 8 -8 8 -14 0ZM10 0L18 -6V6Z" fill="#f3d9b0" stroke="#b58a52" strokeWidth="1.4" /><circle cx={-7} cy={-1} r={1.5} fill={ink} /></g>
}
export function Drop({ x, y, r = 10, fill = P.water, line = P.waterLine }: { x: number; y: number; r?: number; fill?: string; line?: string }) {
  return <g transform={at(x, y)}>
    <path d={`M0 ${-1.7 * r}C${.5 * r} ${-r} ${r} ${-.5 * r} ${r} ${.15 * r}A${r} ${r} 0 0 1 ${-r} ${.15 * r}C${-r} ${-.5 * r} ${-.5 * r} ${-r} 0 ${-1.7 * r}Z`} fill={fill} stroke={line} strokeWidth="1.6" />
    <path d={`M${-.45 * r} ${-.1 * r}q0 ${.45 * r} ${.4 * r} ${.6 * r}`} stroke="white" strokeWidth="2" fill="none" opacity=".75" />
  </g>
}
export const OilDrop = ({ x, y, r = 10 }: { x: number; y: number; r?: number }) => <Drop x={x} y={y} r={r} fill={P.oil} line={P.oilLine} />
export function Rock({ x, y, rx = 24, ry = 16, seed = 5, specks = false }: { x: number; y: number; rx?: number; ry?: number; seed?: number; specks?: boolean }) {
  return <g><path d={blob(x, y, rx, ry, seed, .14, .8, 10)} fill={P.rock} stroke={P.rockLine} strokeWidth="1.6" />
    {specks && [[-.4, -.2], [.2, -.35], [.35, .25], [-.1, .35]].map(([dx, dy], i) => <path key={i} d={`M${r1(x + dx * rx)} ${r1(y + dy * ry - 3)}l3 3l-3 3l-3 -3Z`} fill="#f4f6f8" stroke={P.metalLine} strokeWidth="1" />)}</g>
}
export function Heap({ x, y, w, h, fill = P.rock, line = P.rockLine, lumps = true, dashed = false }: { x: number; y: number; w: number; h: number; fill?: string; line?: string; lumps?: boolean; dashed?: boolean }) {
  return <g>
    <path d={`M${x - w / 2} ${y}C${x - w / 3} ${y - h * .9} ${x - w / 8} ${y - h} ${x} ${y - h}C${x + w / 8} ${y - h} ${x + w / 3} ${y - h * .9} ${x + w / 2} ${y}Z`} fill={dashed ? 'none' : fill} stroke={line} strokeWidth={dashed ? 1.5 : 1.8} strokeDasharray={dashed ? '6 5' : undefined} />
    {lumps && !dashed && [[-.22, .35], [.12, .55], [.25, .25], [-.05, .2]].map(([dx, dy], i) => <path key={i} d={`M${r1(x + dx * w - 4)} ${r1(y - h * dy)}q4 -4 8 0`} stroke={line} strokeWidth="1.2" fill="none" />)}
  </g>
}
export function Spark({ x, y, s = 1, dim = false }: { x: number; y: number; s?: number; dim?: boolean }) {
  // A soft lightning bolt: the course's sign for energy.
  return <path transform={at(x, y, s)} opacity={dim ? .45 : 1} d="M3 -20L-11 3H-1L-5 20L11 -4H1Z" fill={dim ? 'none' : P.sun} stroke={P.sunLine} strokeWidth={dim ? 1.2 : 1.7} strokeDasharray={dim ? '3 3' : undefined} />
}
export function Flame({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={at(x, y, s)}>
    <path d="M0 0C-9 -4 -8 -14 -2 -22C-1 -15 4 -14 3 -20C9 -13 10 -4 0 0Z" fill={P.molten} stroke={P.heatLine} strokeWidth="1.4" />
    <path d="M0 -3C-4 -6 -3 -11 0 -14C1 -10 4 -8 0 -3Z" fill={P.moltenIn} />
  </g>
}

// ---------- Made things ----------
export function TShirt({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path transform={at(x, y, s)} d="M-10 -24L-26 -18L-34 -4L-24 1L-20 -6V24H20V-6L24 1L34 -4L26 -18L10 -24Q0 -16 -10 -24Z" fill="#f2f4f6" stroke={P.cottonLine} strokeWidth="1.8" />
}
export function Jumper({ x, y, s = 1, fill = '#e8dcc2', line = '#a08a62' }: { x: number; y: number; s?: number; fill?: string; line?: string }) {
  return <g transform={at(x, y, s)}>
    <path d="M-11 -26L-26 -20Q-34 -16 -36 -4L-40 22L-30 24L-22 -2V26H22V-2L30 24L40 22L36 -4Q34 -16 26 -20L11 -26Q0 -18 -11 -26Z" fill={fill} stroke={line} strokeWidth="1.8" />
    <path d="M-22 19H22M-39 16L-30 18M39 16L30 18" stroke={line} strokeWidth="1.4" />
  </g>
}
export function House({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={at(x, y, s)}>
    <rect x={-30} y={-32} width={60} height={32} rx="3" fill="#ead3ae" stroke={P.trunkLine} strokeWidth="1.6" />
    <path d="M-30 -21H30M-30 -11H30" stroke={P.trunkLine} strokeWidth="1" opacity=".5" />
    <rect x={-7} y={-19} width={14} height={19} rx="3" fill={P.trunk} stroke={P.trunkLine} strokeWidth="1.4" />
    <path d="M-38 -30L0 -56L38 -30Z" fill="#b98c5d" stroke={P.trunkLine} strokeWidth="1.8" />
  </g>
}
export function Car({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={at(x, y, s)}>
    <path d="M-38 -4V-13Q-38 -19 -30 -20L-20 -21L-11 -32Q-8 -35 -3 -35H14Q20 -35 23 -31L30 -21L36 -20Q40 -19 40 -13V-4Z" fill="#f1c0ad" stroke="#b8624c" strokeWidth="1.8" />
    <path d="M-7 -30H4V-22H-15ZM9 -30H17L22 -22H9Z" fill="white" stroke="#b8624c" strokeWidth="1.2" />
    {[-22, 24].map(wx => <g key={wx}><circle cx={wx} cy={-3} r={8} fill={P.rubber} stroke={P.rubberLine} strokeWidth="1.4" /><circle cx={wx} cy={-3} r={3} fill={P.metal} /></g>)}
  </g>
}
export function Bread({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={at(x, y, s)}>
    <path d="M-30 0Q-35 -22 -12 -25Q0 -31 12 -25Q35 -22 30 0Z" fill="#ecc88f" stroke="#b07f3c" strokeWidth="1.8" />
    <path d="M-14 -20l-5 8M-2 -23l-5 9M10 -21l-5 8" stroke="#b07f3c" strokeWidth="1.4" />
  </g>
}
export function Tyre({ x, y, r = 26 }: { x: number; y: number; r?: number }) {
  return <g>
    <circle cx={x} cy={y} r={r} fill={P.rubber} stroke={P.rubberLine} strokeWidth="2" />
    <circle cx={x} cy={y} r={r - 4} fill="none" stroke="#8d9298" strokeWidth="2" strokeDasharray="4 5" />
    <circle cx={x} cy={y} r={r * .45} fill={P.metal} stroke={P.metalLine} strokeWidth="1.6" />
    <circle cx={x} cy={y} r={3} fill={P.metalLine} />
  </g>
}
export function PolymerChain({ x, y, n = 7, gap = 13 }: { x: number; y: number; n?: number; gap?: number }) {
  const pts = Array.from({ length: n }, (_, i) => [x + i * gap, y + (i % 2 ? -4 : 4)] as Pt)
  return <g>
    <path d={`M${pts.map(p => p.join(' ')).join('L')}`} stroke={P.polyLine} strokeWidth="2" fill="none" />
    {pts.map(([px, py], i) => <circle key={i} cx={px} cy={py} r={5.5} fill={P.poly} stroke={P.polyLine} strokeWidth="1.5" />)}
  </g>
}
export function Spool({ x, y }: { x: number; y: number }) {
  return <g transform={at(x, y)}>
    <rect x={-16} y={-20} width={32} height={40} rx="5" fill={P.poly} stroke={P.polyLine} strokeWidth="1.6" />
    {[-12, -6, 0, 6, 12].map(ty => <path key={ty} d={`M-15 ${ty}H15`} stroke={P.polyLine} strokeWidth="1" opacity=".55" />)}
    <rect x={-22} y={-26} width={44} height={8} rx="4" fill="#efe6d6" stroke="#a08a62" strokeWidth="1.5" />
    <rect x={-22} y={18} width={44} height={8} rx="4" fill="#efe6d6" stroke="#a08a62" strokeWidth="1.5" />
    <path d="M16 4C28 6 30 16 38 14" stroke={P.polyLine} strokeWidth="1.6" fill="none" />
  </g>
}
export function Drum({ x, y, s = 1, label = false }: { x: number; y: number; s?: number; label?: boolean }) {
  return <g transform={at(x, y, s)}>
    <rect x={-20} y={-50} width={40} height={50} rx="6" fill="#b0927a" stroke={P.oilLine} strokeWidth="1.8" />
    <path d="M-20 -34H20M-20 -16H20" stroke={P.oilLine} strokeWidth="1.6" />
    <ellipse cx={0} cy={-50} rx={20} ry={4} fill="#c7ad96" stroke={P.oilLine} strokeWidth="1.6" />
    {label && <OilDrop x={0} y={-22} r={5} />}
  </g>
}
export function FuelCan({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={at(x, y, s)}>
    <path d="M-20 0V-36L-12 -44H14Q20 -44 20 -38V0Z" fill="#f1c0ad" stroke="#b8624c" strokeWidth="1.8" />
    <path d="M-8 -38H8" stroke="#b8624c" strokeWidth="4" />
    <path d="M-12 -44L-18 -54L-12 -56L-6 -46" fill="#f1c0ad" stroke="#b8624c" strokeWidth="1.6" />
    <path d="M-12 -24L12 -10M12 -24L-12 -10" stroke="#b8624c" strokeWidth="1.4" opacity=".5" />
  </g>
}
export function Column({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={at(x, y, s)}>
    <rect x={-17} y={-92} width={34} height={86} rx="12" fill="#eef3f7" stroke="#6f8fa6" strokeWidth="1.8" />
    {[-76, -60, -44, -28].map(ty => <path key={ty} d={`M-17 ${ty}H17M17 ${ty}h10`} stroke="#6f8fa6" strokeWidth="1.4" />)}
    <Flame x={-6} y={4} s={.7} /><Flame x={6} y={4} s={.8} />
  </g>
}
export function Ingot({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={at(x, y, s)}>
    <path d="M-28 0L-20 -18H20L28 0Z" fill={P.metal} stroke={P.metalLine} strokeWidth="1.8" />
    <path d="M-14 -13H10" stroke="white" strokeWidth="2.4" opacity=".9" />
  </g>
}
export function Crucible({ x, y, s = 1, molten = true }: { x: number; y: number; s?: number; molten?: boolean }) {
  return <g transform={at(x, y, s)}>
    <path d="M-24 -34L-19 -4Q-18 2 -11 2H11Q18 2 19 -4L24 -34Z" fill="#d6ccc1" stroke="#7d7065" strokeWidth="1.8" />
    {molten && <path d="M-22 -24H22L20 -12Q10 -8 0 -12Q-10 -8 -20 -12Z" fill={P.molten} stroke={P.heatLine} strokeWidth="1.2" />}
    <Flame x={-10} y={24} s={.8} /><Flame x={2} y={26} s={.95} /><Flame x={14} y={24} s={.8} />
  </g>
}
export function Crystal({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={at(x, y, s)}>
    <path d="M0 -26L12 -14L9 4H-9L-12 -14Z" fill="#e6eef0" stroke="#7fa0a8" strokeWidth="1.6" />
    <path d="M0 -26L-3 -12L0 4M-12 -14L-3 -12L12 -14" stroke="#7fa0a8" strokeWidth="1.1" fill="none" />
    <path d="M14 -4L20 -14L25 -2L21 6H14Z" fill="#e6eef0" stroke="#7fa0a8" strokeWidth="1.4" />
  </g>
}
export function FuelRod({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={at(x, y, s)}>
    <rect x={-8} y={-44} width={16} height={44} rx="8" fill="#e4e6d4" stroke="#7d8568" strokeWidth="1.6" />
    {[-33, -22, -11].map(ty => <path key={ty} d={`M-8 ${ty}H8`} stroke="#7d8568" strokeWidth="1.2" />)}
    <rect x={10} y={-16} width={10} height={16} rx="3" fill="#b9bca8" stroke="#7d8568" strokeWidth="1.4" />
  </g>
}
export function CoalLumps({ x, y }: { x: number; y: number }) {
  return <g><path d={blob(x - 9, y - 8, 11, 9, 4, .16, .8, 8)} fill={P.coal} stroke={P.coalLine} strokeWidth="1.4" /><path d={blob(x + 8, y - 6, 9, 7, 9, .16, .8, 8)} fill={P.coal} stroke={P.coalLine} strokeWidth="1.4" /><path d={blob(x, y - 20, 8, 7, 13, .16, .8, 8)} fill={P.coal} stroke={P.coalLine} strokeWidth="1.4" /></g>
}
function Clock({ x, y, r = 13 }: { x: number; y: number; r?: number }) {
  return <g><circle cx={x} cy={y} r={r} fill="white" stroke={ink} strokeWidth="1.8" /><path d={`M${x} ${y - r * .65}V${y}L${x + r * .5} ${y + r * .25}`} stroke={ink} strokeWidth="1.8" fill="none" /></g>
}
function FertBag({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={at(x, y, s)}>
    <path d="M-26 0Q-31 -26 -24 -46Q-22 -51 -16 -49Q0 -45 16 -49Q22 -51 24 -46Q31 -26 26 0Z" fill="#efe3c9" stroke="#a58c5e" strokeWidth="1.8" />
    <path d={blob(0, -24, 13, 9, 7, .12)} fill={P.leaf} stroke={P.leafLine} strokeWidth="1.3" />
    {[[-38, -6], [-44, -2], [-34, -1], [34, -3], [40, -1]].map(([gx, gy], i) => <circle key={i} cx={gx} cy={gy} r={2} fill="#d9c8a4" stroke="#a58c5e" strokeWidth=".8" />)}
  </g>
}

// ---------- Section 2: natural resources ----------
function Natural() {
  const panels = [{ x: 18, name: 'Earth', items: ['wood, cotton,', 'oil'] }, { x: 192, name: 'sea', items: ['water, fish'] }, { x: 366, name: 'air', items: ['gases such', 'as oxygen'] }]
  return <Diagram viewBox="0 0 540 300" title="Natural resources come from three places: the Earth, which gives wood, cotton and oil; the sea, which gives water and fish; and the air, which gives gases such as oxygen.">
    <path d="M30 60V50Q30 44 36 44H262L270 36L278 44H504Q510 44 510 50V60" stroke={P.green} strokeWidth="2" fill="none" />
    <text x={270} y={26} textAnchor="middle" fontSize="16" fontWeight="700" fill={P.green}>natural resources</text>
    {panels.map(p => <g key={p.name}>
      <rect x={p.x} y={68} width={156} height={140} rx="18" fill={P.sky} stroke={panelLine} strokeWidth="1.6" />
      <text x={p.x + 78} y={232} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{p.name}</text>
      <Lines x={p.x + 78} y={252} anchor="middle" lines={p.items} size={13} weight={600} colour={muted} />
    </g>)}
    {/* Earth: ground with a tree, a cotton plant and oil trapped in rock below */}
    <path d="M19 150Q60 138 96 146Q140 154 173 144V190Q173 207 156 207H36Q19 207 19 190Z" fill={P.soil} stroke={P.soilLine} strokeWidth="1.6" />
    <path d="M19 150Q60 138 96 146Q140 154 173 144" stroke={P.leafLine} strokeWidth="2.4" fill="none" />
    <Tree x={64} y={146} s={.78} seed={3} />
    <Cotton x={132} y={151} s={.9} />
    <ellipse cx={104} cy={184} rx={24} ry={9} fill={P.oil} stroke={P.oilLine} strokeWidth="1.4" />
    {/* sea */}
    <Sea x={193} y={138} w={154} h={50} />
    <path d="M193 186H347V190Q347 207 330 207H210Q193 207 193 190Z" fill={P.water} />
    <Fish x={250} y={170} /><Fish x={300} y={186} />
    <Drop x={316} y={116} r={9} />
    {/* air */}
    <Cloud x={420} y={104} s={.8} /><Cloud x={480} y={130} s={.65} />
    {[[400, 170], [446, 182], [492, 168]].map(([ox, oy], i) => <g key={i}><circle cx={ox - 6} cy={oy} r={6} fill="#bfe3da" stroke="#3f8b80" strokeWidth="1.4" /><circle cx={ox + 6} cy={oy} r={6} fill="#bfe3da" stroke="#3f8b80" strokeWidth="1.4" /></g>)}
    <Caption y={290} text="From the Earth, the sea or the air" />
  </Diagram>
}
function Uses() {
  const cards: { src: string; use: string; top: ReactNode; bottom: ReactNode }[] = [
    { src: 'cotton', use: 'clothing', top: <Cotton x={0} y={100} s={.95} />, bottom: <TShirt x={0} y={170} s={.95} /> },
    { src: 'wood', use: 'shelter', top: <Logs x={0} y={98} />, bottom: <House x={0} y={194} s={.95} /> },
    { src: 'oil', use: 'fuel', top: <Drum x={0} y={102} s={.9} label />, bottom: <Car x={0} y={190} s={.95} /> },
    { src: 'wheat', use: 'food', top: <Wheat x={0} y={102} s={.95} />, bottom: <Bread x={0} y={188} s={.95} /> },
  ]
  return <Diagram viewBox="0 0 540 290" title="What we use natural resources for: cotton for clothing, wood for shelter, oil for fuel and wheat for food.">
    {cards.map((c, i) => {
      const cx = 72 + i * 132
      return <g key={c.use}>
        <rect x={cx - 60} y={14} width={120} height={226} rx="18" fill={i === 3 ? P.greenTint : panelFill} stroke={panelLine} strokeWidth="1.6" />
        <text x={cx} y={38} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>{c.src}</text>
        <g transform={`translate(${cx} 0)`}>{c.top}</g>
        <Arrow from={[cx, 112]} to={[cx, 136]} width={2} colour={muted} />
        <g transform={`translate(${cx} 0)`}>{c.bottom}</g>
        <text x={cx} y={224} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{c.use}</text>
      </g>
    })}
    <Caption y={272} text="Natural resources give us what we need" />
  </Diagram>
}
function Replace() {
  const row = (y: number, natural: ReactNode, product: ReactNode, made: ReactNode, nLabel: string, pLabel: string, mLabel: string) => <g>
    {natural}{product}{made}
    <Arrow from={[132, y]} to={[216, y]} colour={P.green} width={2.4} />
    <Arrow from={[410, y]} to={[326, y]} colour={P.polyLine} width={2.4} />
    <Lines x={70} y={y + 50} anchor="middle" lines={[nLabel]} size={13} weight={600} colour={P.green} />
    <Lines x={270} y={y + 50} anchor="middle" lines={[pLabel]} size={14} />
    <Lines x={470} y={y + 50} anchor="middle" lines={[mLabel]} size={13} weight={600} colour={P.polyLine} />
    <text x={368} y={y - 10} textAnchor="middle" fontSize="12" fontWeight="600" fill={P.polyLine}>can replace</text>
  </g>
  return <Diagram viewBox="0 0 540 316" title="Man-made materials can replace natural ones. Natural rubber from tree sap makes tyres, and man-made polymers can make tyres too. Wool from sheep makes jumpers, and synthetic fibres can make jumpers too.">
    <text x={70} y={24} textAnchor="middle" fontSize="15" fontWeight="700" fill={P.green}>natural</text>
    <text x={470} y={24} textAnchor="middle" fontSize="15" fontWeight="700" fill={P.polyLine}>man-made</text>
    {row(88,
      <g><Tree x={70} y={118} s={.85} seed={8} /><path d="M66 102l8 -5M66 108l8 -5" stroke={P.trunkLine} strokeWidth="1.2" /><path d="M75 104h11l-2 9h-7z" fill="white" stroke={P.cottonLine} strokeWidth="1.3" /></g>,
      <Tyre x={270} y={86} />,
      <PolymerChain x={430} y={88} n={6} />,
      'rubber tree sap', 'tyre', 'polymer')}
    <path d="M24 164H516" stroke={panelLine} strokeWidth="1.4" strokeDasharray="4 5" />
    {row(222,
      <Sheep x={64} y={242} s={.85} />,
      <Jumper x={270} y={220} s={.9} />,
      <Spool x={462} y={222} />,
      'sheep wool', 'jumper', 'synthetic fibres')}
    <Caption y={306} text="Some natural products can be replaced" />
  </Diagram>
}
function Field({ x, crops, big }: { x: number; crops: number; big: boolean }) {
  const w = 190, gap = w / (crops + 1)
  return <g>
    <path d={`M${x} 196Q${x + w / 2} 186 ${x + w} 196V214Q${x + w} 226 ${x + w - 12} 226H${x + 12}Q${x} 226 ${x} 214Z`} fill={P.soil} stroke={P.soilLine} strokeWidth="1.6" />
    {Array.from({ length: crops }, (_, i) => <Wheat key={i} x={x + gap * (i + 1)} y={198} s={big ? 1.05 : .75} />)}
  </g>
}
function Agri() {
  return <Diagram viewBox="0 0 540 300" title="Two fields of the same size. Without fertiliser a few small crops grow. With fertiliser more crop grows in the same area.">
    <text x={119} y={60} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>no fertiliser</text>
    <text x={359} y={60} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>with fertiliser</text>
    <Field x={24} crops={4} big={false} />
    <Field x={264} crops={7} big />
    <FertBag x={500} y={222} s={.8} />
    <text x={500} y={246} textAnchor="middle" fontSize="12" fontWeight="600" fill={muted}>fertiliser</text>
    {/* same width brackets */}
    {[24, 264].map(x => <path key={x} d={`M${x} 236v6h190v-6`} stroke={muted} strokeWidth="1.5" fill="none" />)}
    <text x={119} y={260} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>same area</text>
    <text x={359} y={260} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>same area</text>
    <Caption y={288} text="Fertiliser: more crop in the same area" />
  </Diagram>
}

// ---------- Section 3: renewable or finite ----------
function Renewable() {
  return <Diagram viewBox="0 0 540 300" title="Timber is renewable. A grown tree is cut down for timber, a sapling is planted, and it grows back in a few years.">
    <text x={270} y={28} textAnchor="middle" fontSize="16" fontWeight="700" fill={P.green}>renewable: replaced fairly quickly</text>
    <path d="M40 186Q270 176 500 186" stroke={P.soilLine} strokeWidth="2" fill="none" />
    <Tree x={100} y={184} s={1.15} seed={3} />
    <Stump x={250} y={183} /><Logs x={300} y={184} />
    <Sapling x={440} y={184} s={1.1} />
    <text x={100} y={210} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>grown tree</text>
    <text x={280} y={210} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>timber</text>
    <text x={440} y={210} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>new sapling</text>
    <Arrow from={[160, 120]} to={[236, 140]} colour={muted} width={2} />
    <text x={202} y={112} textAnchor="middle" fontSize="13" fontWeight="600" fill={ink}>cut down</text>
    <Arrow from={[334, 140]} to={[410, 124]} colour={muted} width={2} />
    <text x={372} y={112} textAnchor="middle" fontSize="13" fontWeight="600" fill={ink}>plant</text>
    <CurveArrow from={[440, 222]} c={[270, 262]} to={[104, 224]} colour={P.green} width={2.6} />
    <Clock x={170} y={276} r={11} />
    <text x={188} y={281} fontSize="14" fontWeight="700" fill={P.green}>grows back in a few years</text>
  </Diagram>
}
function Tank({ x, level, label }: { x: number; level: number; label: string }) {
  const clip = useId(), top = 86, h = 112, y = top + h * (1 - level)
  return <g>
    <clipPath id={clip}><rect x={x - 38} y={top} width={76} height={h} rx="16" /></clipPath>
    <rect x={x - 38} y={top} width={76} height={h} rx="16" fill="white" />
    <rect x={x - 40} y={y} width={80} height={h} fill={P.oil} clipPath={`url(#${clip})`} />
    <path d={`M${x - 38} ${y}H${x + 38}`} stroke={P.oilLine} strokeWidth="1.4" clipPath={`url(#${clip})`} />
    <rect x={x - 38} y={top} width={76} height={h} rx="16" fill="none" stroke={P.finiteInk} strokeWidth="2" />
    <path d={`M${x - 26} ${top + 12}V${top + h - 14}`} stroke="white" strokeWidth="3" opacity=".6" />
    <text x={x} y={224} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{label}</text>
  </g>
}
function Finite() {
  return <Diagram viewBox="0 0 540 300" title="A finite resource such as crude oil is used up over time. The store gets smaller and smaller because it is remade very slowly, or not at all.">
    <text x={270} y={28} textAnchor="middle" fontSize="16" fontWeight="700" fill={P.finiteInk}>finite: will eventually run out</text>
    <Tank x={96} level={.85} label="now" />
    <Tank x={270} level={.45} label="later" />
    <Tank x={444} level={.1} label="much later" />
    <Arrow from={[146, 142]} to={[222, 142]} colour={muted} width={2} /><Arrow from={[320, 142]} to={[396, 142]} colour={muted} width={2} />
    <text x={184} y={130} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>used</text>
    <text x={358} y={130} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>used</text>
    {/* the slow top-up */}
    <path d="M96 52V70" stroke={P.oilLine} strokeWidth="1.6" strokeDasharray="3 4" />
    <OilDrop x={96} y={80} r={4} />
    <Lines x={112} y={62} lines={['remade very slowly, or not at all']} size={13} weight={600} colour={P.finiteInk} />
    <Caption y={262} text="A store of crude oil is used up faster than it forms" />
  </Diagram>
}
function Process() {
  const rows = [
    { y: 110, a: <Drum x={96} y={132} s={.9} label />, aL: 'crude oil', b: <Column x={270} y={124} s={.82} />, bL: 'fractional distillation', c: <FuelCan x={444} y={134} s={.9} />, cL: 'petrol' },
    { y: 222, a: <Rock x={96} y={222} rx={30} ry={20} specks />, aL: 'metal ore', b: <Crucible x={270} y={222} s={.85} />, bL: 'reduced', c: <Ingot x={444} y={232} s={1.1} />, cL: 'pure metal' },
  ]
  return <Diagram viewBox="0 0 540 300" title="Finite resources are processed into useful products: crude oil is separated by fractional distillation to make petrol, and a metal ore is reduced to give a pure metal.">
    <text x={96} y={24} textAnchor="middle" fontSize="14" fontWeight="700" fill={P.finiteInk}>finite resource</text>
    <text x={270} y={24} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>process</text>
    <text x={444} y={24} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>useful product</text>
    {rows.map(r => <g key={r.y}>
      {r.a}{r.b}{r.c}
      <Arrow from={[146, r.y]} to={[218, r.y]} colour={muted} width={2} /><Arrow from={[322, r.y]} to={[394, r.y]} colour={muted} width={2} />
      <text x={96} y={r.y + 40} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>{r.aL}</text>
      <text x={270} y={r.y + 46} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{r.bL}</text>
      <text x={444} y={r.y + 40} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>{r.cL}</text>
    </g>)}
    <path d="M24 170H516" stroke={panelLine} strokeWidth="1.4" strokeDasharray="4 5" />
  </Diagram>
}
function Sorted() {
  const renew: [string, ReactNode][] = [['water', <Drop x={0} y={0} r={13} />], ['food', <Bread x={0} y={10} s={.8} />], ['timber', <Logs x={4} y={14} />]]
  const finite: [string[], ReactNode][] = [[['fossil', 'fuels'], <g><CoalLumps x={-6} y={12} /><OilDrop x={16} y={6} r={7} /></g>], [['nuclear', 'fuels'], <FuelRod x={-4} y={16} s={.85} />], [['metals'], <Ingot x={0} y={12} s={.8} />], [['minerals'], <Crystal x={-4} y={14} s={.9} />]]
  return <Diagram viewBox="0 0 540 280" title="Sorting resources. Renewable: water, food and timber. Finite: fossil fuels, nuclear fuels, metals and minerals.">
    <rect x={14} y={20} width={210} height={200} rx="18" fill={P.greenTint} stroke={P.greenEdge} strokeWidth="1.8" />
    <text x={119} y={50} textAnchor="middle" fontSize="16" fontWeight="700" fill={P.green}>Renewable</text>
    {renew.map(([name, icon], i) => <g key={name}><g transform={`translate(${52 + i * 62} 124)`}>{icon}</g><text x={52 + i * 62} y={178} textAnchor="middle" fontSize="13" fontWeight="600" fill={ink}>{name}</text></g>)}
    <rect x={238} y={20} width={288} height={200} rx="18" fill={P.finite} stroke={P.finiteEdge} strokeWidth="1.8" />
    <text x={382} y={50} textAnchor="middle" fontSize="16" fontWeight="700" fill={P.finiteInk}>Finite</text>
    {finite.map(([name, icon], i) => <g key={name[0]}><g transform={`translate(${274 + i * 72} 124)`}>{icon}</g><Lines x={274 + i * 72} y={178} anchor="middle" lines={name} size={13} weight={600} /></g>)}
    <Caption y={252} text="Renewable: replaced fairly quickly" />
    <Caption y={272} text="Finite: will eventually run out" />
  </Diagram>
}

// ---------- Section 4: reading a table of forming times ----------
type Row = { name: string; time: ReactNode; tag?: 'renewable' | 'finite' }
const Power = ({ n, unit }: { n: number; unit: string }) => <>10<tspan fontSize="13" dy="-8">{n}</tspan><tspan dy="8"> {unit}</tspan></>
function Table({ rows, x = 110, highlightTime = false, showTags = false, head = 'Resource' }: { rows: Row[]; x?: number; highlightTime?: boolean; showTags?: boolean; head?: string }) {
  const w1 = 150, w2 = 170, top = 46, rh = 44
  return <g>
    <text x={x + (w1 + w2) / 2} y={30} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>Forming times</text>
    {highlightTime && <rect x={x + w1 - 4} y={top - 6} width={w2 + 10} height={rh * (rows.length + 1) + 12} rx="14" fill={P.sun} opacity=".3" />}
    <rect x={x} y={top} width={w1 + w2} height={rh} rx="12" fill="#e8f0f5" />
    <rect x={x} y={top} width={w1 + w2} height={rh * (rows.length + 1)} rx="12" fill="none" stroke={panelLine} strokeWidth="1.8" />
    <path d={`M${x + w1} ${top}V${top + rh * (rows.length + 1)}`} stroke={panelLine} strokeWidth="1.6" />
    {rows.map((_, i) => <path key={i} d={`M${x} ${top + rh * (i + 1)}H${x + w1 + w2}`} stroke={panelLine} strokeWidth="1.6" />)}
    <text x={x + w1 / 2} y={top + 28} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{head}</text>
    <text x={x + w1 + w2 / 2} y={top + 28} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>Time to form</text>
    {rows.map((r, i) => {
      const y = top + rh * (i + 1), finite = showTags && r.tag === 'finite'
      return <g key={r.name}>
        {finite && <rect x={x + 3} y={y + 3} width={w1 + w2 - 6} height={rh - 6} rx="10" fill={P.finite} stroke={P.finiteInk} strokeWidth="2" />}
        <text x={x + w1 / 2} y={y + 28} textAnchor="middle" fontSize="15" fontWeight="600" fill={ink}>{r.name}</text>
        <text x={x + w1 + w2 / 2} y={y + 28} textAnchor="middle" fontSize="15" fontWeight={finite ? 700 : 600} fill={ink}>{r.time}</text>
        {showTags && r.tag && <text x={x + w1 + w2 + 16} y={y + 28} fontSize="14" fontWeight="700" fill={r.tag === 'finite' ? P.finiteInk : P.green}>{r.tag === 'finite' ? 'far longest: finite' : 'renewable'}</text>}
      </g>
    })}
  </g>
}
const EXAMPLE: Row[] = [{ name: 'Resource 1', time: '60 days', tag: 'renewable' }, { name: 'Resource 2', time: '25 years', tag: 'renewable' }, { name: 'Resource 3', time: <Power n={7} unit="years" />, tag: 'finite' }]
function TableSetup() {
  return <Diagram viewBox="0 0 540 280" schematic={false} title="A table of three resources and the time each takes to form: resource 1, 60 days; resource 2, 25 years; resource 3, 10 to the power 7 years. The time column is highlighted.">
    <Table rows={EXAMPLE} x={80} highlightTime />
    <Lines x={424} y={116} lines={['read the', 'time column']} size={13} weight={700} colour={P.sunLine} />
    <Caption y={262} text="Days or years: renewable. Millions of years: finite" />
  </Diagram>
}
function TableAnswer() {
  return <Diagram viewBox="0 0 540 280" schematic={false} title="The same table. 60 days and 25 years are short, so resources 1 and 2 are renewable. 10 to the power 7 years is far longest, so resource 3 is finite.">
    <Table rows={EXAMPLE} x={40} showTags />
    <Caption y={262} text="The far longest time is the finite resource" />
  </Diagram>
}
function Standard() {
  const bars: { label: string; w: number; y: number; long?: boolean }[] = [{ label: 'days', w: 8, y: 196 }, { label: 'years', w: 40, y: 222 }, { label: 'a million years', w: 330, y: 248, long: true }]
  return <Diagram viewBox="0 0 540 290" title="Standard form: 10 to the power 6 means 1 000 000, so 10 to the power 6 years is one million years. Bars show days, years and a million years getting longer.">
    <text x={120} y={92} textAnchor="middle" fontSize="54" fontWeight="700" fill={ink}>10<tspan fontSize="30" dy="-24">6</tspan></text>
    <Arrow from={[190, 76]} to={[262, 76]} width={3} />
    <text x={392} y={90} textAnchor="middle" fontSize="38" fontWeight="700" fill={ink}>1 000 000</text>
    <text x={392} y={124} textAnchor="middle" fontSize="15" fontWeight="600" fill={muted}>one million</text>
    <text x={270} y={160} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>10<tspan fontSize="12" dy="-7">6</tspan><tspan dy="7"> years = one million years</tspan></text>
    {bars.map(b => <g key={b.label}>
      <text x={150} y={b.y + 5} textAnchor="end" fontSize="13" fontWeight="600" fill={muted}>{b.label}</text>
      <rect x={162} y={b.y - 8} width={b.w} height={16} rx="8" fill={b.long ? P.finite : P.leafLight} stroke={b.long ? P.finiteInk : P.leafLine} strokeWidth="1.5" />
      {b.long && <path d={`M${162 + b.w - 30} ${b.y - 12}l-6 24M${162 + b.w - 22} ${b.y - 12}l-6 24`} stroke={P.finiteInk} strokeWidth="1.6" />}
    </g>)}
    <text x={500} y={270} textAnchor="end" fontSize="12" fontWeight="600" fill={muted}>bars not to scale: far longer</text>
  </Diagram>
}
function QuestionTable({ rows }: { rows: Row[] }) {
  return <Diagram viewBox="0 0 540 250" schematic={false} title="A table of three resources with the time each takes to form.">
    <Table rows={rows} />
  </Diagram>
}

export function ResourceVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment // the question tables never carry renewable/finite words, in either view
  if (focus === 'resource-natural') return <Natural />
  if (focus === 'resource-use') return <Uses />
  if (focus === 'resource-replace') return <Replace />
  if (focus === 'resource-agri') return <Agri />
  if (focus === 'resource-renewable') return <Renewable />
  if (focus === 'resource-finite') return <Finite />
  if (focus === 'resource-process') return <Process />
  if (focus === 'resource-sorted') return <Sorted />
  if (focus === 'resource-table-setup') return <TableSetup />
  if (focus === 'resource-table-std') return <Standard />
  if (focus === 'resource-table-answer') return <TableAnswer />
  if (focus === 'resource-q-table') return <QuestionTable rows={[{ name: 'X', time: '3 months' }, { name: 'Y', time: <Power n={7} unit="years" /> }, { name: 'Z', time: '25 years' }]} />
  if (focus === 'resource-q-table-guided') return <QuestionTable rows={[{ name: 'A', time: '40 days' }, { name: 'B', time: <Power n={6} unit="years" /> }, { name: 'C', time: '15 years' }]} />
  return <Sorted />
}
