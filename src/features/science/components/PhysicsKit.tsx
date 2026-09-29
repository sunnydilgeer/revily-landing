import { useId, type ReactNode } from 'react'

/*
 * The Physics drawing kit. Every Physics visuals file (EnergyStoreVisuals … LatentVisuals) draws with these
 * pieces so the thirty lessons read as one set: the same ink, the same colour for each energy store, and
 * circuit symbols drawn to the AQA symbol sheet.
 *
 * House style (as in the Biology and Chemistry drawings): soft curves, gentle tints with a darker line of the
 * same hue, round caps and joins, text 12px or larger, nothing that needs a browser (renders with
 * react-dom/server). Ids for markers or gradients come from useId().
 *
 * Colour code, the same in every Physics lesson:
 *   energy stores: kinetic orange, thermal red, chemical purple, gravitational potential indigo,
 *   elastic potential magenta, electrostatic teal, magnetic steel grey, nuclear olive;
 *   yellow = light and the Sun, blue = water, green = plants (the course-wide code);
 *   circuits: wires ink, current arrows vermilion, charge (electrons) blue as in Chemistry, pd violet,
 *   resistance brown; useful energy green, wasted energy coral; hot red, cold blue.
 */

export type Pt = [number, number]
const r1 = (n: number) => Math.round(n * 10) / 10

const ink = '#375a73', muted = '#657a89', paper = '#ffffff', panel = '#f7fafc', panelLine = '#d5e2ea', grid = '#e4ebf0'

export const physicsPalette = {
  ink, muted, paper, panel, panelLine, grid,
  // Energy stores: one fill + line pair each.
  kinetic: '#fbdcbf', kineticLine: '#c8671f',
  thermal: '#f8cbc4', thermalLine: '#bf4a3f',
  chemical: '#e4d6f2', chemicalLine: '#7a56a6',
  gravitational: '#d6ddf4', gravitationalLine: '#4a5fa6',
  elastic: '#f6d2e5', elasticLine: '#ad4880',
  electrostatic: '#cdece8', electrostaticLine: '#23847d',
  magnetic: '#dfe5ea', magneticLine: '#5a6b79',
  nuclear: '#e5ebc4', nuclearLine: '#6f7f26',
  // Course-wide code.
  light: '#fde8a8', lightLine: '#c3930f',
  water: '#bfe0f1', waterLine: '#3f93bd',
  plant: '#cfe6c2', plantLine: '#4f8f5a',
  // Circuits.
  wire: '#3b5163',
  current: '#d65a2c',
  charge: '#3f8fd0', chargeLine: '#246aa3',
  pd: '#7a4fbd', pdFill: '#ebe2f7',
  resistance: '#8a6443', resistanceFill: '#f1e6d9',
  // Energy transfers.
  useful: '#4f9a74', usefulFill: '#dcefe3',
  wasted: '#c0675a', wastedFill: '#f8e0db',
  // Temperature.
  hot: '#d9533e', hotFill: '#fbe0d9',
  cold: '#3f8fc7', coldFill: '#dcecf8',
}
const P = physicsPalette

/* ---------- Diagram frame and small helpers ---------- */

/** The standard figure wrapper: role="img" with a title, round joins. */
export function PhysicsDiagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}

/** A leader line from a label to the thing it names, ending in a small dot. */
export function Leader({ from, to, colour = ink }: { from: Pt; to: Pt; colour?: string }) {
  return <g><path d={`M${from[0]} ${from[1]}L${to[0]} ${to[1]}`} stroke={colour} strokeWidth="1.4" fill="none" /><circle cx={to[0]} cy={to[1]} r="2.6" fill={colour} /></g>
}

/** Multi-line text; each line is a tspan. Sizes below 12 are raised to 12. */
export function Lines({ x, y, lines, anchor = 'start', size = 14, weight = 700, colour = ink }: { x: number; y: number; lines: string[]; anchor?: 'start' | 'middle' | 'end'; size?: number; weight?: number; colour?: string }) {
  const s = Math.max(12, size)
  return <text x={x} y={y} textAnchor={anchor} fontSize={s} fontWeight={weight} fill={colour}>{lines.map((l, i) => <tspan key={i} x={x} dy={i ? s + 3 : 0}>{l}</tspan>)}</text>
}

// A solid arrowhead with its tip at `tip`, pointing along `angle` (radians).
function head(tip: Pt, angle: number, size: number) {
  const back = (d: number, s: number): Pt => [r1(tip[0] - Math.cos(angle) * d + Math.cos(angle + Math.PI / 2) * s), r1(tip[1] - Math.sin(angle) * d + Math.sin(angle + Math.PI / 2) * s)]
  const [a, b, notch] = [back(size, size * 0.55), back(size, -size * 0.55), back(size * 0.72, 0)]
  return { d: `M${r1(tip[0])} ${r1(tip[1])}L${a[0]} ${a[1]}L${notch[0]} ${notch[1]}L${b[0]} ${b[1]}Z`, base: notch }
}

/* ---------- Wires ---------- */

/** A wire through `points`, with softly rounded corners (radius r). */
export function wirePath(points: Pt[], r = 6) {
  if (points.length < 2) return ''
  let d = `M${points[0][0]} ${points[0][1]}`
  for (let i = 1; i < points.length - 1; i++) {
    const [p0, p1, p2] = [points[i - 1], points[i], points[i + 1]]
    const l1 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), l2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1])
    const k = Math.min(r, l1 / 2, l2 / 2)
    const a: Pt = [p1[0] - (p1[0] - p0[0]) / l1 * k, p1[1] - (p1[1] - p0[1]) / l1 * k]
    const b: Pt = [p1[0] + (p2[0] - p1[0]) / l2 * k, p1[1] + (p2[1] - p1[1]) / l2 * k]
    d += `L${r1(a[0])} ${r1(a[1])}Q${p1[0]} ${p1[1]} ${r1(b[0])} ${r1(b[1])}`
  }
  const last = points[points.length - 1]
  return d + `L${last[0]} ${last[1]}`
}
export function Wire({ points, colour = P.wire, width = 2.5, radius = 6 }: { points: Pt[]; colour?: string; width?: number; radius?: number }) {
  return <path d={wirePath(points, radius)} stroke={colour} strokeWidth={width} fill="none" />
}
/** The dot where wires join. */
export function Junction({ x, y, colour = P.wire }: { x: number; y: number; colour?: string }) {
  return <circle cx={x} cy={y} r="3.6" fill={colour} />
}
/** A small arrowhead on a wire showing the direction of the (conventional) current. */
export function CurrentArrow({ x, y, rotate = 0, colour = P.current }: { x: number; y: number; rotate?: number; colour?: string }) {
  const { d } = head([6, 0], 0, 12)
  return <path d={d} transform={`translate(${x} ${y}) rotate(${rotate})`} fill={colour} stroke={colour} strokeWidth="1.2" />
}

/* ---------- Circuit symbols (AQA symbol sheet) ---------- */
/*
 * Each symbol is drawn along its own horizontal axis, centred on (x, y), with leads reaching ±length/2 so it
 * drops straight onto a wire. rotate = 90 stands it upright. Letters and +/− signs stay upright whatever the
 * rotation. `label` adds a caption beside the symbol (below it when horizontal, to its right when upright).
 */
export type SymbolProps = { x: number; y: number; rotate?: number; length?: number; colour?: string; label?: string; labelOffset?: number }
const SW = 2.5

// Where a point on the symbol's own axis ends up on the page.
function place(x: number, y: number, rotate: number, dx: number, dy: number): Pt {
  const a = rotate * Math.PI / 180
  return [r1(x + dx * Math.cos(a) - dy * Math.sin(a)), r1(y + dx * Math.sin(a) + dy * Math.cos(a))]
}
function Frame({ x, y, rotate = 0, length = 64, colour = P.wire, label, labelOffset = 30, children, gap, upright }: SymbolProps & { children?: ReactNode; gap: number; upright?: ReactNode }) {
  const h = length / 2
  const vertical = Math.abs(Math.round(rotate / 90)) % 2 === 1
  const labelPt: Pt = vertical ? [x + labelOffset, y + 5] : [x, y + labelOffset + 5]
  return <g>
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} stroke={colour} strokeWidth={SW} fill="none">
      {gap < h && <path d={`M${-h} 0H${-gap}M${gap} 0H${h}`} />}
      {children}
    </g>
    {upright}
    {label && <text x={labelPt[0]} y={labelPt[1]} textAnchor={vertical ? 'start' : 'middle'} fontSize="13" fontWeight="650" fill={ink} stroke="none">{label}</text>}
  </g>
}
function Letter({ at, text, colour }: { at: Pt; text: string; colour: string }) {
  return <text x={at[0]} y={at[1] + 5.5} textAnchor="middle" fontSize="16" fontWeight="750" fill={colour} stroke="none">{text}</text>
}

/** Cell: the long thin line is the positive terminal, the short thick line the negative. `flip` puts + on the right. */
export function Cell(props: SymbolProps & { flip?: boolean; signs?: boolean }) {
  const { x, y, rotate = 0, colour = P.wire, flip = false, signs = false } = props
  const s = flip ? -1 : 1
  return <Frame {...props} gap={4} upright={signs && <g fontSize="13" fontWeight="700" fill={colour} textAnchor="middle">
    <text x={place(x, y, rotate, -12 * s, -17)[0]} y={place(x, y, rotate, -12 * s, -17)[1] + 4.5}>+</text>
    <text x={place(x, y, rotate, 12 * s, -17)[0]} y={place(x, y, rotate, 12 * s, -17)[1] + 4.5}>−</text>
  </g>}>
    <path d={`M${-4 * s} -15V15`} />
    <path d={`M${4 * s} -7.5V7.5`} strokeWidth="6" strokeLinecap="butt" />
  </Frame>
}

/** Battery: two or more cells joined in series (dashed link = "more cells here"). + is on the left unless flipped. */
export function Battery(props: SymbolProps & { cells?: number; dashed?: boolean; flip?: boolean }) {
  const { cells = 2, dashed = false, flip = false } = props
  const s = flip ? -1 : 1, pitch = 22, width = (cells - 1) * pitch + 8
  const starts = Array.from({ length: cells }, (_, i) => -width / 2 + i * pitch)
  return <Frame {...props} length={Math.max(props.length ?? 64, width + 24)} gap={width / 2}>
    {starts.map((start, i) => <g key={i}>
      <path d={`M${s * start} -15V15`} />
      <path d={`M${s * (start + 8)} -7.5V7.5`} strokeWidth="6" strokeLinecap="butt" />
      {i < cells - 1 && <path d={`M${s * (start + 8)} 0H${s * (start + pitch)}`} strokeDasharray={dashed ? '3 4' : undefined} />}
    </g>)}
  </Frame>
}

/** Open switch: the lever is lifted off the right-hand contact. */
export function SwitchOpen(props: SymbolProps) {
  const colour = props.colour ?? P.wire
  return <Frame {...props} gap={12}>
    <path d="M-12 0L10 -14" />
    <circle cx={-12} cy={0} r="2.8" fill={colour} stroke="none" />
    <circle cx={12} cy={0} r="2.8" fill={colour} stroke="none" />
  </Frame>
}
/** Closed switch: the lever lies on both contacts. */
export function SwitchClosed(props: SymbolProps) {
  const colour = props.colour ?? P.wire
  return <Frame {...props} gap={12}>
    <path d="M-12 0L12 0" />
    <circle cx={-12} cy={0} r="2.8" fill={colour} stroke="none" />
    <circle cx={12} cy={0} r="2.8" fill={colour} stroke="none" />
  </Frame>
}

/** Filament lamp: a circle with a cross. `lit` adds a soft yellow glow. */
export function Lamp(props: SymbolProps & { lit?: boolean }) {
  return <Frame {...props} gap={13}>
    {props.lit && <circle r="20" fill={P.light} stroke="none" opacity=".75" />}
    <circle r="13" fill={props.lit ? '#fff6d6' : paper} />
    <path d="M-9.2 -9.2L9.2 9.2M9.2 -9.2L-9.2 9.2" />
  </Frame>
}

/** Fuse: a small box with the wire running through it. */
export function Fuse(props: SymbolProps) {
  const h = (props.length ?? 64) / 2
  return <Frame {...props} gap={h}>
    <rect x={-16} y={-6.5} width={32} height={13} rx="2" fill={paper} />
    <path d={`M${-h} 0H${h}`} />
  </Frame>
}

/** Fixed resistor: a rectangle. */
export function Resistor(props: SymbolProps) {
  return <Frame {...props} gap={17}>
    <rect x={-17} y={-7.5} width={34} height={15} rx="2" fill={paper} />
  </Frame>
}

/** Variable resistor: a resistor with a diagonal arrow through it. */
export function VariableResistor(props: SymbolProps) {
  const colour = props.colour ?? P.wire
  const tip: Pt = [17, -15], { d, base } = head(tip, Math.atan2(-30, 34), 9)
  return <Frame {...props} gap={17}>
    <rect x={-17} y={-7.5} width={34} height={15} rx="2" fill={paper} />
    <path d={`M-17 15L${base[0]} ${base[1]}`} />
    <path d={d} fill={colour} strokeWidth="1.2" />
  </Frame>
}

/** Ammeter: a circle with A. */
export function Ammeter(props: SymbolProps) {
  return <Frame {...props} gap={14} upright={<Letter at={[props.x, props.y]} text="A" colour={props.colour ?? P.wire} />}>
    <circle r="14" fill={paper} />
  </Frame>
}
/** Voltmeter: a circle with V. */
export function Voltmeter(props: SymbolProps) {
  return <Frame {...props} gap={14} upright={<Letter at={[props.x, props.y]} text="V" colour={props.colour ?? P.wire} />}>
    <circle r="14" fill={paper} />
  </Frame>
}

// Diode body: triangle pointing along +x (the direction current is allowed through) and a bar at its tip.
function DiodeBody({ size = 10, colour }: { size?: number; colour: string }) {
  return <g>
    <path d={`M${-size} 0H${size}`} />
    <path d={`M${-size} ${-size}L${size} 0L${-size} ${size}Z`} fill={colour} fillOpacity=".16" />
    <path d={`M${size} ${-size}V${size}`} />
  </g>
}
/** Diode: current flows in the direction the triangle points (left to right before rotation). */
export function Diode(props: SymbolProps) {
  return <Frame {...props} gap={10}><DiodeBody colour={props.colour ?? P.wire} /></Frame>
}

function SmallArrow({ from, to, colour }: { from: Pt; to: Pt; colour: string }) {
  const { d, base } = head(to, Math.atan2(to[1] - from[1], to[0] - from[0]), 7)
  return <g><path d={`M${from[0]} ${from[1]}L${base[0]} ${base[1]}`} strokeWidth="1.8" /><path d={d} fill={colour} strokeWidth="1" /></g>
}
/** LED: a diode in a circle, with two arrows pointing out (it gives out light). */
export function LED(props: SymbolProps) {
  const colour = props.colour ?? P.wire
  return <Frame {...props} gap={17}>
    <circle r="17" fill={paper} />
    <DiodeBody size={8} colour={colour} />
    <SmallArrow from={[2, -19]} to={[12, -31]} colour={colour} />
    <SmallArrow from={[10, -14]} to={[20, -26]} colour={colour} />
  </Frame>
}
/** LDR: a resistor in a circle, with two arrows pointing in (light falling on it). */
export function LDR(props: SymbolProps) {
  const colour = props.colour ?? P.wire
  return <Frame {...props} gap={19}>
    <circle r="19" fill={paper} />
    <rect x={-12} y={-5.5} width={24} height={11} rx="1.5" fill={paper} />
    <path d="M-19 0H-12M12 0H19" />
    <SmallArrow from={[-26, -32]} to={[-14, -18]} colour={colour} />
    <SmallArrow from={[-14, -36]} to={[-3, -22]} colour={colour} />
  </Frame>
}
/** Thermistor: a resistor with a diagonal line through it that has a flat foot at its lower end. */
export function Thermistor(props: SymbolProps) {
  return <Frame {...props} gap={17}>
    <rect x={-17} y={-7.5} width={34} height={15} rx="2" fill={paper} />
    <path d="M-27 15H-17L17 -15" fill="none" />
  </Frame>
}

/* ---------- Energy stores and transfers ---------- */

export type EnergyStore = 'kinetic' | 'thermal' | 'chemical' | 'gravitational' | 'elastic' | 'electrostatic' | 'magnetic' | 'nuclear'
export const energyStores: Record<EnergyStore, { name: string; short: string; fill: string; line: string }> = {
  kinetic: { name: 'Kinetic', short: 'Kinetic', fill: P.kinetic, line: P.kineticLine },
  thermal: { name: 'Thermal', short: 'Thermal', fill: P.thermal, line: P.thermalLine },
  chemical: { name: 'Chemical', short: 'Chemical', fill: P.chemical, line: P.chemicalLine },
  gravitational: { name: 'Gravitational potential', short: 'Gravitational', fill: P.gravitational, line: P.gravitationalLine },
  elastic: { name: 'Elastic potential', short: 'Elastic', fill: P.elastic, line: P.elasticLine },
  electrostatic: { name: 'Electrostatic', short: 'Electrostatic', fill: P.electrostatic, line: P.electrostaticLine },
  magnetic: { name: 'Magnetic', short: 'Magnetic', fill: P.magnetic, line: P.magneticLine },
  nuclear: { name: 'Nuclear', short: 'Nuclear', fill: P.nuclear, line: P.nuclearLine },
}

/** The small picture for each store, drawn in a ±8 box in the store's line colour. */
export function StoreIcon({ store, x = 0, y = 0, scale = 1 }: { store: EnergyStore; x?: number; y?: number; scale?: number }) {
  const c = energyStores[store].line
  const glyph: Record<EnergyStore, ReactNode> = {
    // A ball with speed lines behind it.
    kinetic: <g><path d="M-8 -3H-3M-9 1.5H-4M-7 6H-3" strokeWidth="1.7" /><circle cx="3" cy="0" r="4.6" fill={c} stroke="none" /></g>,
    // Rising heat waves.
    thermal: <g strokeWidth="1.8"><path d="M-5 7C-8 3.5 -2 1 -5 -2.5S-2 -7 -4 -8" /><path d="M0 7C-3 3.5 3 1 0 -2.5S3 -7 1 -8" /><path d="M5 7C2 3.5 8 1 5 -2.5S8 -7 6 -8" /></g>,
    // Two bonded atoms.
    chemical: <g><path d="M-3 2.5L3.5 -2.5" strokeWidth="2" /><circle cx="-3.8" cy="3" r="3.8" fill={c} stroke="none" /><circle cx="4" cy="-3" r="3.4" fill="white" strokeWidth="1.7" /></g>,
    // A raised mass with a downward pull.
    gravitational: <g><rect x="-5" y="-8.5" width="10" height="7" rx="1.6" fill={c} stroke="none" /><path d="M0 0V5.5" strokeWidth="1.8" /><path d="M-3.5 4.5L0 8.5L3.5 4.5Z" fill={c} strokeWidth="1" /></g>,
    // A stretched spring.
    elastic: <path d="M-9 0H-6.5L-4.5 -5L-1.5 5L1.5 -5L4.5 5L6.5 0H9" strokeWidth="1.8" />,
    // Opposite charges.
    electrostatic: <g strokeWidth="1.9"><circle cx="-4.2" cy="0" r="4.2" fill="white" strokeWidth="1.5" /><path d="M-6.4 0H-2M-4.2 -2.2V2.2" /><circle cx="4.6" cy="0" r="4.2" fill={c} stroke="none" /><path d="M2.6 0H6.6" stroke="white" /></g>,
    // A horseshoe magnet.
    magnetic: <g><path d="M-5 -7V1A5 5 0 0 0 5 1V-7" strokeWidth="3.4" strokeLinecap="butt" /><path d="M-5 -7V-4M5 -7V-4" stroke="white" strokeWidth="3.4" strokeLinecap="butt" opacity=".75" /></g>,
    // A nucleus: a small cluster.
    nuclear: <g stroke="none"><circle cx="-2.6" cy="-2" r="3.2" fill={c} /><circle cx="2.8" cy="-1.6" r="3.2" fill="white" stroke={c} strokeWidth="1.4" /><circle cx="0" cy="3" r="3.2" fill={c} /></g>,
  }
  return <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={c} fill="none">{glyph[store]}</g>
}

/** Rough width of a badge, for laying badges out in a row. */
export function badgeWidth(store: EnergyStore, label?: string) {
  return Math.round((label ?? energyStores[store].name).length * 7.9 + 46)
}
/** A rounded chip naming an energy store, centred on (x, y). `dim` fades it (a store not in play). */
export function EnergyStoreBadge({ store, x, y, label, dim = false }: { store: EnergyStore; x: number; y: number; label?: string; dim?: boolean }) {
  const { name, fill, line } = energyStores[store]
  const w = badgeWidth(store, label), left = x - w / 2
  return <g opacity={dim ? 0.35 : 1}>
    <rect x={left} y={y - 15} width={w} height={30} rx="15" fill={fill} fillOpacity=".55" stroke={line} strokeWidth="1.6" />
    <circle cx={left + 16} cy={y} r="11" fill="white" stroke={line} strokeWidth="1.4" />
    <StoreIcon store={store} x={left + 16} y={y} scale={0.95} />
    <text x={left + 32} y={y + 4.6} fontSize="13" fontWeight="700" fill={ink}>{label ?? name}</text>
  </g>
}

/**
 * A soft curved arrow for energy transfers, from `from` to `to`. `bend` bows it sideways (a fraction of its
 * length; negative bows the other way). `label` sits beside the middle of the curve on the outside.
 */
export function TransferArrow({ from, to, bend = 0.2, colour = ink, width = 3, label, labelColour, dashed = false }: { from: Pt; to: Pt; bend?: number; colour?: string; width?: number; label?: string; labelColour?: string; dashed?: boolean }) {
  const dx = to[0] - from[0], dy = to[1] - from[1], len = Math.hypot(dx, dy) || 1
  const nx = -dy / len, ny = dx / len
  const c: Pt = [(from[0] + to[0]) / 2 + nx * bend * len, (from[1] + to[1]) / 2 + ny * bend * len]
  const { d, base } = head(to, Math.atan2(to[1] - c[1], to[0] - c[0]), 8 + width * 1.6)
  const mid: Pt = [0.25 * from[0] + 0.5 * c[0] + 0.25 * to[0], 0.25 * from[1] + 0.5 * c[1] + 0.25 * to[1]]
  const side = bend >= 0 ? 1 : -1
  const lp: Pt = [r1(mid[0] + nx * side * 14), r1(mid[1] + ny * side * 14 + 4.5)]
  const anchor = Math.abs(nx) < 0.3 ? 'middle' : nx * side > 0 ? 'start' : 'end'
  return <g>
    <path d={`M${from[0]} ${from[1]}Q${r1(c[0])} ${r1(c[1])} ${base[0]} ${base[1]}`} stroke={colour} strokeWidth={width} fill="none" strokeDasharray={dashed ? '7 6' : undefined} />
    <path d={d} fill={colour} stroke={colour} strokeWidth="1.2" />
    {label && <text x={lp[0]} y={lp[1]} textAnchor={anchor} fontSize="13" fontWeight="650" fill={labelColour ?? colour} stroke="white" strokeWidth="4" paintOrder="stroke">{label}</text>}
  </g>
}

/* ---------- Graphs ---------- */

/** Where a graph sits on the page and the values its axes cover. */
export type GraphFrame = { x: number; y: number; width: number; height: number; xMin?: number; xMax: number; yMin?: number; yMax: number }
/** Value → page position for a graph frame (x, y are the frame's top-left corner). */
export function graphScale(frame: GraphFrame) {
  const { x, y, width, height, xMin = 0, xMax, yMin = 0, yMax } = frame
  const sx = (v: number) => r1(x + (v - xMin) / (xMax - xMin) * width)
  const sy = (v: number) => r1(y + height - (v - yMin) / (yMax - yMin) * height)
  return { x: sx, y: sy, pt: (vx: number, vy: number): Pt => [sx(vx), sy(vy)], path: (points: Pt[]) => points.map(([vx, vy], i) => `${i ? 'L' : 'M'}${sx(vx)} ${sy(vy)}`).join('') }
}

/**
 * Labelled axes with units (AQA style "Current in A"), tick numbers, optional light gridlines, and the origin.
 * Axes cross at zero, so a frame with xMin/yMin below zero (an I–V graph) draws all four quadrants.
 */
export function GraphAxes({ frame, xLabel, yLabel, xUnit, yUnit, xTicks = [], yTicks = [], grid: showGrid = false, origin = true, colour = ink }: {
  frame: GraphFrame; xLabel: string; yLabel: string; xUnit?: string; yUnit?: string; xTicks?: number[]; yTicks?: number[]; grid?: boolean; origin?: boolean; colour?: string
}) {
  const s = graphScale(frame)
  const { x, y, width, height, xMin = 0, yMin = 0, xMax, yMax } = frame
  const ax = s.y(Math.min(Math.max(0, yMin), yMax)), ay = s.x(Math.min(Math.max(0, xMin), xMax))
  const right = x + width + 10, top = y - 10
  const fmt = (v: number) => (Number.isInteger(v) ? String(v) : String(r1(v))).replace('-', '−')
  const xText = xUnit ? `${xLabel} in ${xUnit}` : xLabel, yText = yUnit ? `${yLabel} in ${yUnit}` : yLabel
  const quadrants = xMin < 0 || yMin < 0
  return <g>
    {showGrid && <g stroke={P.grid} strokeWidth="1">
      {xTicks.map(v => <path key={`gx${v}`} d={`M${s.x(v)} ${y}V${y + height}`} />)}
      {yTicks.map(v => <path key={`gy${v}`} d={`M${x} ${s.y(v)}H${x + width}`} />)}
    </g>}
    <g stroke={colour} strokeWidth="2" fill="none">
      <path d={`M${x - (xMin < 0 ? 10 : 0)} ${ax}H${right - 8}`} />
      <path d={`M${ay} ${y + height + (yMin < 0 ? 10 : 0)}V${top + 8}`} />
    </g>
    <path d={head([right, ax], 0, 11).d} fill={colour} stroke={colour} strokeWidth="1" />
    <path d={head([ay, top], -Math.PI / 2, 11).d} fill={colour} stroke={colour} strokeWidth="1" />
    <g fontSize="12" fill={muted}>
      {xTicks.filter(v => v !== 0).map(v => <g key={`tx${v}`}><path d={`M${s.x(v)} ${ax}v5`} stroke={colour} strokeWidth="1.5" /><text x={s.x(v)} y={ax + 18} textAnchor="middle">{fmt(v)}</text></g>)}
      {yTicks.filter(v => v !== 0).map(v => <g key={`ty${v}`}><path d={`M${ay} ${s.y(v)}h-5`} stroke={colour} strokeWidth="1.5" /><text x={ay - 8} y={s.y(v) + 4} textAnchor="end">{fmt(v)}</text></g>)}
      {origin && !quadrants && <text x={ay - 7} y={ax + 17} textAnchor="end">0</text>}
    </g>
    <text x={x + width} y={ax + (xTicks.length ? 38 : 22)} textAnchor="end" fontSize="13" fontWeight="700" fill={colour}>{xText}</text>
    <text x={ay + (quadrants ? 10 : 0)} y={top - 8} textAnchor={quadrants ? 'start' : 'middle'} fontSize="13" fontWeight="700" fill={colour}>{yText}</text>
  </g>
}
