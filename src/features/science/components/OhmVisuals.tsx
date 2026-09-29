import type { ReactNode } from 'react'
import {
  physicsPalette as P, PhysicsDiagram, Lines, Leader, wirePath, Junction, CurrentArrow,
  Cell, Battery, SwitchOpen, SwitchClosed, Lamp, Resistor, VariableResistor, Ammeter, Voltmeter, Diode, LDR, Thermistor,
  type Pt,
} from './PhysicsKit'

/*
 * Physics Lesson 16: Resistance and V = IR. Original, code-native schematics; not to scale. Focus ids start with 'ohm-'.
 *
 * The first part of this file is a small circuit toolkit built on PhysicsKit.tsx and shared by the electricity lessons
 * that follow (wire resistance, I–V characteristics, sensing circuits, series circuits): a circuit drawer that leaves
 * gaps in the wires for each symbol, value tags, meter faces, equation cards and a few drawn objects (bulb, thermometer).
 *
 * Colour code (PhysicsKit): pd violet, current vermilion, resistance brown, charge blue; wires ink.
 * The worked-example drawing (one circuit and an equation card) is reused through "How do you use V = IR?".
 */
const { ink, muted } = P
export const faded = 0.28
const hiFill = '#fff3cf', hiLine = '#e3b64a'

const r1 = (n: number) => Math.round(n * 10) / 10
/** Rough width of a line of text (DM Sans, bold). */
export const textWidth = (s: string, size = 13) => s.length * size * 0.58

/* ---------- Circuits ---------- */

export type PartKind = 'cell' | 'battery' | 'lamp' | 'litLamp' | 'resistor' | 'varres' | 'ammeter' | 'voltmeter' | 'milliammeter'
  | 'diode' | 'ldr' | 'thermistor' | 'switchOpen' | 'switchClosed' | 'motor' | 'box' | 'missing'
/** One symbol dropped onto a wire. rotate 90 stands it upright; a battery or cell at rotate 90 has + at the top. */
export type Part = { kind: PartKind; x: number; y: number; rotate?: number; length?: number; dim?: boolean; hi?: boolean; flip?: boolean; cells?: number; signs?: boolean; text?: string }
const defaultLength: Record<PartKind, number> = {
  cell: 46, battery: 64, lamp: 56, litLamp: 56, resistor: 58, varres: 58, ammeter: 50, voltmeter: 50, milliammeter: 54,
  diode: 44, ldr: 64, thermistor: 64, switchOpen: 50, switchClosed: 50, motor: 50, box: 92, missing: 56,
}
const partLength = (p: Part) => p.length ?? defaultLength[p.kind]
const isVertical = (p: Part) => Math.abs(Math.round((p.rotate ?? 0) / 90)) % 2 === 1

// A circle meter with letters (used for mA and the motor M), drawn like the kit's A and V.
function RoundSymbol({ x, y, rotate = 0, length = 50, letters, size = 16 }: { x: number; y: number; rotate?: number; length?: number; letters: string; size?: number }) {
  const h = length / 2, r = letters.length > 1 ? 16 : 14
  return <g>
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} stroke={P.wire} strokeWidth="2.5" fill="none">
      <path d={`M${-h} 0H${-r}M${r} 0H${h}`} />
      <circle r={r} fill="white" />
    </g>
    <text x={x} y={y + size * 0.36} textAnchor="middle" fontSize={size} fontWeight="750" fill={P.wire}>{letters}</text>
  </g>
}

function Symbol({ p }: { p: Part }) {
  const s = { x: p.x, y: p.y, rotate: p.rotate ?? 0, length: partLength(p) }
  switch (p.kind) {
    case 'cell': return <Cell {...s} flip={p.flip} signs={p.signs} />
    case 'battery': return <Battery {...s} cells={p.cells ?? 2} flip={p.flip} />
    case 'lamp': return <Lamp {...s} />
    case 'litLamp': return <Lamp {...s} lit />
    case 'resistor': return <Resistor {...s} />
    case 'varres': return <VariableResistor {...s} />
    case 'ammeter': return <Ammeter {...s} />
    case 'voltmeter': return <Voltmeter {...s} />
    case 'milliammeter': return <RoundSymbol {...s} letters="mA" size={14} />
    case 'motor': return <RoundSymbol {...s} letters="M" />
    case 'diode': return <Diode {...s} rotate={(p.rotate ?? 0) + (p.flip ? 180 : 0)} />
    case 'ldr': return <LDR {...s} />
    case 'thermistor': return <Thermistor {...s} />
    case 'switchOpen': return <SwitchOpen {...s} />
    case 'switchClosed': return <SwitchClosed {...s} />
    case 'box': {
      const v = isVertical(p), w = v ? 40 : s.length - 12, h = v ? s.length - 12 : 40
      return <g>
        <rect x={p.x - w / 2} y={p.y - h / 2} width={w} height={h} rx="10" fill="#fbf7f1" stroke={P.resistance} strokeWidth="2" strokeDasharray="5 4" />
        <text x={p.x} y={p.y + 4.5} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.resistance}>{p.text ?? 'component'}</text>
      </g>
    }
    case 'missing': {
      const v = isVertical(p), w = v ? 34 : s.length - 10, h = v ? s.length - 10 : 34
      return <rect x={p.x - w / 2} y={p.y - h / 2} width={w} height={h} rx="10" fill="none" stroke={muted} strokeWidth="1.8" strokeDasharray="4 5" />
    }
  }
}

// Wires are cut wherever a part sits on them, so each symbol's own leads meet the wire.
// Works along the path length: gaps are intervals [s - half, s + half]; closed loops wrap round.
function cutRun(run: Pt[], parts: Part[], closed: boolean): Pt[][] {
  const pts = closed ? [...run, run[0]] : run
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const total = cum[cum.length - 1]
  const gaps: [number, number][] = []
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], len = cum[i] - cum[i - 1] || 1, ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len
    for (const p of parts) {
      const px = p.x - a[0], py = p.y - a[1], t = px * ux + py * uy
      if (Math.abs(px * uy - py * ux) < 1 && t >= 0 && t <= len) gaps.push([cum[i - 1] + t - partLength(p) / 2, cum[i - 1] + t + partLength(p) / 2])
    }
  }
  gaps.sort((m, n) => m[0] - n[0])
  // Position along the (doubled, for loops) path → point.
  const at = (s: number): Pt => {
    const k = closed ? ((s % total) + total) % total : Math.min(Math.max(s, 0), total)
    for (let i = 1; i < pts.length; i++) if (k <= cum[i] + 1e-6) {
      const f = (k - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1)
      return [r1(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f), r1(pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f)]
    }
    return pts[pts.length - 1]
  }
  const piece = (a: number, b: number): Pt[] => {
    const out: Pt[] = [at(a)]
    const laps = closed ? [0, total] : [0]
    for (const lap of laps) for (let i = 0; i < pts.length - (closed ? 1 : 0); i++) { const s = cum[i] + lap; if (s > a + 0.5 && s < b - 0.5) out.push(pts[i]) }
    out.push(at(b))
    return out
  }
  if (!gaps.length) return closed ? [piece(cum[1] / 2, cum[1] / 2 + total)] : [pts]
  const pieces: Pt[][] = []
  if (!closed) pieces.push(piece(0, gaps[0][0]))
  for (let i = 0; i < gaps.length - 1; i++) pieces.push(piece(gaps[i][1], gaps[i + 1][0]))
  pieces.push(closed ? piece(gaps[gaps.length - 1][1], gaps[0][0] + total) : piece(gaps[gaps.length - 1][1], total))
  return pieces.filter(r => r.length > 1 && Math.hypot(r[r.length - 1][0] - r[0][0], r[r.length - 1][1] - r[0][1]) + (r.length - 2) > 0.5)
}

/** A soft highlighter glow behind a part. */
export function Halo({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={Math.min(w, h) / 2} fill={hiFill} stroke={hiLine} strokeWidth="1.6" />
}

/**
 * A circuit: closed loops (corner lists) and open wire runs (polylines), drawn with rounded corners, with parts dropped
 * onto them. Wires are cut where a part sits. `dim` fades the wires; each part can be dimmed or highlighted on its own.
 */
export function Circuit({ loops = [], runs = [], parts, junctions = [], dim = false, arrows = [], brightArrows = false }: { loops?: Pt[][]; runs?: Pt[][]; parts: Part[]; junctions?: Pt[]; dim?: boolean; arrows?: { x: number; y: number; rotate: number }[]; brightArrows?: boolean }) {
  const wires = [...loops.flatMap(l => cutRun(l, parts, true)), ...runs.flatMap(r => cutRun(r, parts, false))]
  return <g>
    {parts.filter(p => p.hi).map((p, i) => {
      const l = partLength(p) + 14, t = p.kind === 'box' ? 58 : 52
      return <Halo key={`h${i}`} x={p.x} y={p.y} w={isVertical(p) ? t : l} h={isVertical(p) ? l : t} />
    })}
    <g opacity={dim ? faded : 1}>
      {wires.map((r, i) => <path key={i} d={wirePath(r, 8)} stroke={P.wire} strokeWidth="2.5" fill="none" />)}
      {junctions.map(([x, y], i) => <Junction key={i} x={x} y={y} />)}
      {!brightArrows && arrows.map((a, i) => <CurrentArrow key={i} {...a} />)}
    </g>
    {brightArrows && arrows.map((a, i) => <CurrentArrow key={i} {...a} />)}
    {parts.map((p, i) => <g key={i} opacity={p.dim ? faded : 1}><Symbol p={p} /></g>)}
  </g>
}

/** The four corners of a rectangular loop, for Circuit's `loops`. */
export function loop(left: number, top: number, right: number, bottom: number): Pt[] {
  return [[left, top], [right, top], [right, bottom], [left, bottom]]
}

/* ---------- Labels ---------- */

/** A rounded value tag, e.g. "4.0 Ω" beside a resistor. */
export function Tag({ x, y, text, colour = ink, fill = 'white', anchor = 'middle', size = 13, dim = false }: { x: number; y: number; text: string; colour?: string; fill?: string; anchor?: 'start' | 'middle' | 'end'; size?: number; dim?: boolean }) {
  const w = r1(textWidth(text, size) + 18), h = size + 13
  const left = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2
  return <g opacity={dim ? faded : 1}>
    <rect x={r1(left)} y={r1(y - h / 2)} width={w} height={h} rx={h / 2} fill={fill} stroke={colour} strokeWidth="1.6" />
    <text x={r1(left + w / 2)} y={r1(y + size * 0.36)} textAnchor="middle" fontSize={size} fontWeight="700" fill={colour}>{text}</text>
  </g>
}
export const pdTag = (x: number, y: number, text: string, anchor: 'start' | 'middle' | 'end' = 'middle', dim = false) => <Tag x={x} y={y} text={text} colour={P.pd} fill={P.pdFill} anchor={anchor} dim={dim} />
export const currentTag = (x: number, y: number, text: string, anchor: 'start' | 'middle' | 'end' = 'middle', dim = false) => <Tag x={x} y={y} text={text} colour={P.current} fill="#fbe5dc" anchor={anchor} dim={dim} />
export const resTag = (x: number, y: number, text: string, anchor: 'start' | 'middle' | 'end' = 'middle', dim = false) => <Tag x={x} y={y} text={text} colour={P.resistance} fill={P.resistanceFill} anchor={anchor} dim={dim} />

export function Caption({ text, y = 286, x = 270, colour = muted }: { text: string; y?: number; x?: number; colour?: string }) {
  return <text x={x} y={y} textAnchor="middle" fontSize="14" fontWeight="600" fill={colour}>{text}</text>
}
export function Note({ x, y, lines, colour = ink, anchor = 'start', size = 14 }: { x: number; y: number; lines: string[]; colour?: string; anchor?: 'start' | 'middle' | 'end'; size?: number }) {
  return <Lines x={x} y={y} lines={lines} colour={colour} anchor={anchor} size={size} />
}
export { Leader }

/** A soft card. */
export function Card({ x, y, w, h, fill = P.panel, line = P.panelLine, children }: { x: number; y: number; w: number; h: number; fill?: string; line?: string; children?: ReactNode }) {
  return <g><rect x={x} y={y} width={w} height={h} rx="16" fill={fill} stroke={line} strokeWidth="1.6" />{children}</g>
}

export type EqRow = { text: string; state?: 'on' | 'hi' | 'dim'; colour?: string; size?: number }
/** An equation card: a small heading and one working line per row. The 'hi' row gets the highlighter. */
export function EqCard({ x, y, w, title, rows, rowGap = 40 }: { x: number; y: number; w: number; title: string; rows: EqRow[]; rowGap?: number }) {
  const h = 58 + rows.length * rowGap
  return <Card x={x} y={y} w={w} h={h} fill="white">
    <text x={x + 18} y={y + 30} fontSize="14" fontWeight="700" fill={muted}>{title}</text>
    {rows.map((r, i) => {
      const cy = y + 62 + i * rowGap, size = r.size ?? 20
      return <g key={i} opacity={r.state === 'dim' ? 0.4 : 1}>
        {r.state === 'hi' && <rect x={x + 10} y={cy - 22} width={w - 20} height={34} rx="12" fill={hiFill} stroke={hiLine} strokeWidth="1.4" />}
        <text x={x + 20} y={cy + 1} fontSize={size} fontWeight="750" fill={r.colour ?? ink}>{r.text}</text>
      </g>
    })}
  </Card>
}

/** A straight band arrow whose thickness shows how big the current is. */
export function FlowArrow({ from, to, width, colour = P.current }: { from: Pt; to: Pt; width: number; colour?: string }) {
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]), hl = 10 + width * 1.1, hw = width / 2 + 6 + width * 0.3
  const ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux
  const bx = to[0] - ux * hl, by = to[1] - uy * hl
  const pts: Pt[] = [
    [from[0] + nx * width / 2, from[1] + ny * width / 2], [bx + nx * width / 2, by + ny * width / 2], [bx + nx * hw, by + ny * hw], to,
    [bx - nx * hw, by - ny * hw], [bx - nx * width / 2, by - ny * width / 2], [from[0] - nx * width / 2, from[1] - ny * width / 2],
  ]
  return <path d={pts.map((p, i) => `${i ? 'L' : 'M'}${r1(p[0])} ${r1(p[1])}`).join('') + 'Z'} fill={colour} fillOpacity=".85" stroke={colour} strokeWidth="1.5" />
}

/** A simple arrow line with a head. */
export function Arrow({ from, to, colour = ink, width = 2.2, dashed = false }: { from: Pt; to: Pt; colour?: string; width?: number; dashed?: boolean }) {
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]), h = 6 + width * 1.6
  const p = (d: number, s: number): Pt => [r1(to[0] - Math.cos(a) * d + Math.cos(a + Math.PI / 2) * s), r1(to[1] - Math.sin(a) * d + Math.sin(a + Math.PI / 2) * s)]
  const [b1, b2, base] = [p(h, h * 0.6), p(h, -h * 0.6), p(h * 0.7, 0)]
  return <g><path d={`M${from[0]} ${from[1]}L${base[0]} ${base[1]}`} stroke={colour} strokeWidth={width} fill="none" strokeDasharray={dashed ? '6 6' : undefined} /><path d={`M${to[0]} ${to[1]}L${b1[0]} ${b1[1]}L${b2[0]} ${b2[1]}Z`} fill={colour} stroke={colour} strokeWidth="1.2" /></g>
}

/* ---------- Drawn objects ---------- */

/** A thermometer, bulb at the bottom. `level` 0–1 is how full the tube is. */
export function Thermometer({ x, y, h = 70, level = 0.5, colour = P.hot }: { x: number; y: number; h?: number; level?: number; colour?: string }) {
  const top = y - h, fillTop = r1(y - 10 - (h - 16) * level)
  return <g>
    <path d={`M${x - 5} ${y - 8}V${top + 5}a5 5 0 0 1 10 0V${y - 8}`} fill="white" stroke={ink} strokeWidth="2" />
    <path d={`M${x} ${y - 6}V${fillTop}`} stroke={colour} strokeWidth="4.5" />
    <circle cx={x} cy={y} r="9" fill={colour} stroke={ink} strokeWidth="2" />
    {[0.25, 0.5, 0.75].map(k => <path key={k} d={`M${x + 5} ${r1(y - 10 - (h - 16) * k)}h5`} stroke={ink} strokeWidth="1.4" />)}
  </g>
}

/** A light bulb with a coiled filament. `glow` 0–1 sets how brightly it shines. Centre of the glass at (x, y). */
export function Bulb({ x, y, s = 1, glow = 1 }: { x: number; y: number; s?: number; glow?: number }) {
  const coil = Array.from({ length: 7 }, (_, i) => `${i ? 'L' : 'M'}${-12 + i * 4} ${i % 2 ? -6 : 0}`).join('')
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    {glow > 0 && <circle r={44 + glow * 10} fill={P.light} opacity={0.35 + glow * 0.35} />}
    {glow > 0 && <circle r={36} fill={P.light} opacity={0.4 * glow} />}
    <path d="M-14 34C-14 22 -34 12 -34 -6A34 34 0 0 1 34 -6C34 12 14 22 14 34Z" fill={glow > 0 ? '#fffbe9' : '#f4f7f9'} stroke={ink} strokeWidth="2" />
    <path d="M-7 34V6M7 34V6" stroke={muted} strokeWidth="1.6" />
    <path d={`M-7 6L-12 0${coil.replace(/^M-12 0/, '')}L12 0L7 6`} stroke={glow > 0 ? P.kineticLine : muted} strokeWidth="2.4" fill="none" />
    <rect x={-15} y={34} width={30} height={22} rx="4" fill="#dfe5ea" stroke={ink} strokeWidth="2" />
    <path d="M-15 41H15M-15 48H15" stroke={ink} strokeWidth="1.4" />
    <path d="M-7 56Q0 64 7 56" fill="#c9d2da" stroke={ink} strokeWidth="1.8" />
  </g>
}

/** A small sun: light (yellow in every lesson). */
export function Sun({ x, y, r = 16 }: { x: number; y: number; r?: number }) {
  return <g>
    {Array.from({ length: 8 }, (_, i) => {
      const a = i * Math.PI / 4
      return <path key={i} d={`M${r1(x + Math.cos(a) * (r + 5))} ${r1(y + Math.sin(a) * (r + 5))}L${r1(x + Math.cos(a) * (r + 12))} ${r1(y + Math.sin(a) * (r + 12))}`} stroke={P.lightLine} strokeWidth="2.6" />
    })}
    <circle cx={x} cy={y} r={r} fill={P.light} stroke={P.lightLine} strokeWidth="2" />
  </g>
}

/** A symbol drawn larger than circuit size, for "meet the symbol" pictures. */
export function BigSymbol({ x, y, scale = 1.8, children }: { x: number; y: number; scale?: number; children: ReactNode }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>{children}</g>
}

/* ---------- Lesson 16 drawings ---------- */

// Three cards: push, flow, slow down.
function ThreeCards() {
  const cards = [
    { x: 12, name: ['Potential', 'difference'], colour: P.pd, fill: P.pdFill, unit: 'V, in volts', idea: 'the push' },
    { x: 186, name: ['Current'], colour: P.current, fill: '#fbe5dc', unit: 'I, in amperes', idea: 'the flow' },
    { x: 360, name: ['Resistance'], colour: P.resistance, fill: P.resistanceFill, unit: 'R, in ohms', idea: 'slows the flow' },
  ]
  return <g>
    {cards.map(c => <g key={c.x}>
      <Card x={c.x} y={16} w={168} h={262} fill="white" line={c.colour} />
      <path d={`M${c.x} ${76}V32a16 16 0 0 1 16 -16H${c.x + 152}a16 16 0 0 1 16 16V76Z`} fill={c.fill} />
      <Lines x={c.x + 84} y={c.name.length > 1 ? 42 : 52} lines={c.name} anchor="middle" size={16} colour={c.colour} />
      <text x={c.x + 84} y={220} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{c.unit}</text>
      <text x={c.x + 84} y={250} textAnchor="middle" fontSize="15" fontWeight="700" fontStyle="italic" fill={c.colour}>{c.idea}</text>
    </g>)}
    {/* pd: a battery with a push arrow */}
    <path d="M40 150H64M128 150H152" stroke={P.wire} strokeWidth="2.5" />
    <Battery x={96} y={150} length={64} />
    <Arrow from={[62, 112]} to={[134, 112]} colour={P.pd} width={3.4} />
    {/* current: charge moving along a wire */}
    <path d="M206 150H346" stroke={P.wire} strokeWidth="2.5" />
    {[220, 246, 272, 298, 324].map(x => <circle key={x} cx={x} cy={150} r="6" fill={P.charge} stroke={P.chargeLine} strokeWidth="1.4" />)}
    <Arrow from={[222, 118]} to={[336, 118]} colour={P.current} width={3.4} />
    {/* resistance: a resistor with charge bunching up before it */}
    <path d="M378 150H412M480 150H512" stroke={P.wire} strokeWidth="2.5" />
    <Resistor x={446} y={150} length={68} />
    {[384, 398].map(x => <circle key={x} cx={x} cy={150} r="5.5" fill={P.charge} stroke={P.chargeLine} strokeWidth="1.4" />)}
    <circle cx={500} cy={150} r="5.5" fill={P.charge} stroke={P.chargeLine} strokeWidth="1.4" />
  </g>
}

// The word equation (or symbol equation) as three tinted chips.
const chips = [
  { left: 14, w: 210, word: 'potential difference', sym: 'V', colour: P.pd, fill: P.pdFill, unit: 'volts, V', idea: 'the push' },
  { left: 262, w: 96, word: 'current', sym: 'I', colour: P.current, fill: '#fbe5dc', unit: 'amperes, A', idea: 'the flow' },
  { left: 394, w: 132, word: 'resistance', sym: 'R', colour: P.resistance, fill: P.resistanceFill, unit: 'ohms, Ω', idea: 'slows the flow' },
]
function Chips({ symbols }: { symbols: boolean }) {
  const cy = symbols ? 100 : 130, h = symbols ? 64 : 50
  return <g>
    {chips.map(c => <g key={c.word}>
      <rect x={c.left} y={cy - h / 2} width={c.w} height={h} rx={h / 2.4} fill={c.fill} stroke={c.colour} strokeWidth="2" />
      <text x={c.left + c.w / 2} y={cy + (symbols ? 12 : 6)} textAnchor="middle" fontSize={symbols ? 34 : 17} fontWeight="750" fill={c.colour}>{symbols ? c.sym : c.word}</text>
      {symbols ? <g>
        <text x={c.left + c.w / 2} y={cy + 58} textAnchor="middle" fontSize="14" fontWeight="700" fill={c.colour}>{c.word}</text>
        <Tag x={c.left + c.w / 2} y={cy + 94} text={c.unit} colour={ink} />
      </g> : <text x={c.left + c.w / 2} y={cy + 52} textAnchor="middle" fontSize="14" fontWeight="650" fontStyle="italic" fill={muted}>{c.idea}</text>}
    </g>)}
    <text x={243} y={cy + 10} textAnchor="middle" fontSize="28" fontWeight="700" fill={ink}>=</text>
    <text x={376} y={cy + 9} textAnchor="middle" fontSize="26" fontWeight="700" fill={ink}>×</text>
  </g>
}

/** Two loops with the same battery: one resistor (big current) above two resistors (small current). Reused in series circuits. */
export function MoreResistance({ topNote = '1 resistor', bottomNote = '2 resistors', bottomLabel = 'smaller current' }: { topNote?: string; bottomNote?: string; bottomLabel?: string }) {
  const L = 60, R = 300
  return <g>
    <Circuit loops={[loop(L, 34, R, 124)]} parts={[{ kind: 'battery', x: L, y: 79, rotate: 90 }, { kind: 'resistor', x: 180, y: 34 }]} arrows={[{ x: 180, y: 124, rotate: 180 }]} />
    <text x={180} y={84} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>{topNote}</text>
    <Circuit loops={[loop(L, 176, R, 266)]} parts={[{ kind: 'battery', x: L, y: 221, rotate: 90 }, { kind: 'resistor', x: 140, y: 176 }, { kind: 'resistor', x: 222, y: 176 }]} arrows={[{ x: 180, y: 266, rotate: 180 }]} />
    <text x={180} y={226} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>{bottomNote}</text>
    <Tag x={L} y={150} text="same battery" colour={P.pd} fill={P.pdFill} />
    <FlowArrow from={[338, 79]} to={[500, 79]} width={18} />
    <text x={420} y={124} textAnchor="middle" fontSize="14" fontWeight="700" fill={P.current}>bigger current</text>
    <FlowArrow from={[338, 221]} to={[500, 221]} width={5} />
    <text x={420} y={254} textAnchor="middle" fontSize="14" fontWeight="700" fill={P.current}>{bottomLabel}</text>
  </g>
}

// The worked-example circuit: battery on the left, resistor on top, ammeter on the right.
function ExampleCircuit({ pd, r, i, dim = false }: { pd: string; r: string; i?: string; dim?: boolean }) {
  return <g opacity={dim ? faded : 1}>
    <Circuit loops={[loop(40, 80, 250, 230)]} parts={[{ kind: 'battery', x: 40, y: 155, rotate: 90 }, { kind: 'resistor', x: 145, y: 80 }, { kind: 'ammeter', x: 250, y: 155, rotate: 90 }]} arrows={[{ x: 90, y: 80, rotate: 0 }]} />
    {pdTag(64, 155, pd, 'start')}
    {resTag(145, 48, r)}
    {i && currentTag(226, 155, i, 'end')}
  </g>
}

function OhmProp() {
  const one = (x: number, v: string, i: string) => <g>
    <Circuit loops={[loop(x, 92, x + 170, 196)]} parts={[{ kind: 'battery', x: x + 85, y: 92 }, { kind: 'resistor', x: x + 170, y: 144, rotate: 90 }, { kind: 'ammeter', x: x + 85, y: 196 }]} />
    {pdTag(x + 85, 56, v)}
    {currentTag(x + 85, 240, i)}
  </g>
  return <g>
    {one(24, 'pd 2.0 V', '0.50 A')}
    {one(346, 'pd 4.0 V', '1.0 A')}
    <path d="M130 38Q270 6 410 38" stroke={P.pd} strokeWidth="2.2" fill="none" />
    <Arrow from={[402, 34]} to={[414, 40]} colour={P.pd} />
    <Tag x={270} y={20} text="× 2" colour={P.pd} fill="white" />
    <path d="M130 258Q270 290 410 258" stroke={P.current} strokeWidth="2.2" fill="none" />
    <Arrow from={[402, 262]} to={[414, 256]} colour={P.current} />
    <Tag x={270} y={274} text="× 2" colour={P.current} fill="white" />
    <Lines x={270} y={132} lines={['same resistor,', 'fixed', 'temperature']} anchor="middle" size={13} colour={muted} weight={650} />
  </g>
}

function OhmDiode() {
  const row = (y: number, forward: boolean) => <g>
    <path d={`M60 ${y}H138M202 ${y}H280`} stroke={P.wire} strokeWidth="2.5" />
    <BigSymbol x={170} y={y} scale={1.6}><Diode x={0} y={0} length={40} rotate={forward ? 0 : 180} /></BigSymbol>
    {forward
      ? <FlowArrow from={[70, y - 42]} to={[272, y - 42]} width={8} colour={P.useful} />
      : <g><FlowArrow from={[70, y - 42]} to={[146, y - 42]} width={8} colour={P.wasted} /><path d={`M156 ${y - 60}V${y - 24}`} stroke={P.wasted} strokeWidth="5" /></g>}
    <text x={300} y={y + 5} fontSize="15" fontWeight="700" fill={forward ? P.useful : P.wasted}>{forward ? 'current flows easily' : 'very high resistance:'}</text>
    {!forward && <text x={300} y={y + 25} fontSize="15" fontWeight="700" fill={P.wasted}>almost no current</text>}
  </g>
  return <g>
    {row(100, true)}
    {row(220, false)}
    <text x={170} y={26} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>diode, one way round…</text>
    <text x={170} y={148} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>…and turned round</text>
  </g>
}

function OhmLamp() {
  const step = (y: number, text: string, colour: string, fill: string) => <Tag x={428} y={y} text={text} colour={colour} fill={fill} size={14} />
  return <g transform="translate(0 22)">
    <BigSymbol x={90} y={130} scale={1.6}><Lamp x={0} y={0} length={60} /></BigSymbol>
    <text x={90} y={196} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>circuit symbol</text>
    <Bulb x={240} y={112} s={1.35} />
    <Leader from={[168, 44]} to={[232, 104]} colour={P.kineticLine} />
    <text x={150} y={36} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.kineticLine}>thin filament</text>
    {step(58, 'current rises', P.current, '#fbe5dc')}
    <Arrow from={[428, 76]} to={[428, 104]} />
    {step(124, 'filament gets hotter', P.hot, P.hotFill)}
    <Arrow from={[428, 142]} to={[428, 170]} />
    {step(190, 'resistance rises', P.resistance, P.resistanceFill)}
  </g>
}

function OhmOhmic() {
  return <g>
    <Card x={24} y={24} w={230} h={150} fill="white" />
    <path d="M52 100H104M168 100H226" stroke={P.wire} strokeWidth="2.5" />
    <BigSymbol x={136} y={100} scale={1.5}><Resistor x={0} y={0} length={44} /></BigSymbol>
    <text x={139} y={152} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>fixed resistor</text>
    <Card x={286} y={24} w={230} h={150} fill="white" />
    <path d="M310 100C340 66 370 134 402 100S462 66 494 100" stroke={P.resistance} strokeWidth="3.4" fill="none" />
    <circle cx={310} cy={100} r="4" fill={P.resistance} /><circle cx={494} cy={100} r="4" fill={P.resistance} />
    <text x={401} y={152} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>a length of wire</text>
    <Tag x={270} y={208} text="ohmic conductor: resistance stays the same" colour={P.useful} fill={P.usefulFill} size={14} />
    <Thermometer x={184} y={272} h={44} level={0.45} colour={P.hot} />
    <text x={202} y={264} fontSize="14" fontWeight="650" fill={muted}>at a fixed temperature</text>
  </g>
}

export function OhmVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'ohm-three': return <PhysicsDiagram title="Three quantities in a circuit: potential difference, V, in volts, is the push; current, I, in amperes, is the flow of charge; resistance, R, in ohms, slows the flow."><ThreeCards /></PhysicsDiagram>
    case 'ohm-words': return <PhysicsDiagram title="The word equation: potential difference = current × resistance." schematic={false}>
      <text x={270} y={50} textAnchor="middle" fontSize="15" fontWeight="650" fill={muted}>One equation links all three</text>
      <Chips symbols={false} />
      <Caption text="Learn it in words first." y={250} />
    </PhysicsDiagram>
    case 'ohm-symbols': return <PhysicsDiagram title="In symbols: V = I × R, usually written V = IR. V is in volts, I in amperes and R in ohms, symbol Ω." schematic={false}>
      <Chips symbols={true} />
      <Caption text="usually written  V = IR" y={278} colour={ink} />
    </PhysicsDiagram>
    case 'ohm-more-r': return <PhysicsDiagram title="Two circuits with the same battery. With one resistor the current is bigger; with two resistors in the loop the current is smaller."><MoreResistance /></PhysicsDiagram>
    case 'ohm-wk1-eq': return <PhysicsDiagram title="Worked example: a battery, a 4.0 ohm resistor and an ammeter reading 3.0 A. To find the pd, start with V = I × R.">
      <ExampleCircuit pd="V = ?" r="4.0 Ω" i="3.0 A" />
      <EqCard x={296} y={40} w={230} title="Find the pd, V" rows={[{ text: 'V = I × R', state: 'hi', colour: P.pd }]} />
    </PhysicsDiagram>
    case 'ohm-wk1-sub': return <PhysicsDiagram title="Substitute: V = 3.0 × 4.0 = 12 V.">
      <ExampleCircuit pd="V = ?" r="4.0 Ω" i="3.0 A" />
      <EqCard x={296} y={40} w={230} title="Find the pd, V" rows={[{ text: 'V = I × R', state: 'dim' }, { text: 'V = 3.0 × 4.0' }, { text: 'V = 12 V', state: 'hi', colour: P.pd }]} />
    </PhysicsDiagram>
    case 'ohm-rearrange': return <PhysicsDiagram title="Divide both sides of V = I × R by R to get I = V ÷ R." schematic={false}>
      <ExampleCircuit pd="V" r="R" dim />
      <EqCard x={296} y={24} w={230} title="Need the current, I?" rowGap={44} rows={[{ text: 'V = I × R' }, { text: '÷ R on both sides', size: 15, colour: P.pd }, { text: 'V ÷ R = I' }, { text: 'I = V ÷ R', state: 'hi', colour: P.current }]} />
    </PhysicsDiagram>
    case 'ohm-wk2': return <PhysicsDiagram title="Worked example: a 12 V battery across a 6.0 ohm resistor. I = V ÷ R = 12 ÷ 6.0 = 2.0 A.">
      <ExampleCircuit pd="12 V" r="6.0 Ω" i="I = ?" />
      <EqCard x={296} y={40} w={230} title="Find the current, I" rows={[{ text: 'I = V ÷ R', state: 'dim' }, { text: 'I = 12 ÷ 6.0' }, { text: 'I = 2.0 A', state: 'hi', colour: P.current }]} />
    </PhysicsDiagram>
    case 'ohm-ohmic': return <PhysicsDiagram title="A fixed resistor and a length of wire are ohmic conductors: their resistance stays the same at a fixed temperature."><OhmOhmic /></PhysicsDiagram>
    case 'ohm-prop': return <PhysicsDiagram title="The same resistor at a fixed temperature: 2.0 V gives 0.50 A and 4.0 V gives 1.0 A. Double the pd, double the current."><OhmProp /></PhysicsDiagram>
    case 'ohm-diode': return <PhysicsDiagram title="A diode lets current flow easily one way. Turned round, its resistance is very high and almost no current flows."><OhmDiode /></PhysicsDiagram>
    case 'ohm-lamp': return <PhysicsDiagram title="A filament lamp: as the current rises the thin filament gets hotter, and its resistance rises."><OhmLamp /></PhysicsDiagram>
    case 'ohm-q-circuit': return <PhysicsDiagram title="A circuit with a battery, a resistor and an ammeter.">
      <Circuit loops={[loop(150, 70, 390, 230)]} parts={[{ kind: 'battery', x: 150, y: 150, rotate: 90 }, { kind: 'resistor', x: 270, y: 70 }, { kind: 'ammeter', x: 390, y: 150, rotate: 90 }]} />
      {pdTag(174, 150, '24 V', 'start')}
      {resTag(270, 38, '8.0 Ω')}
    </PhysicsDiagram>
    default: return null
  }
}
