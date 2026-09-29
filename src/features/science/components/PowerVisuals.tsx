import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, type Pt } from './PhysicsKit'

/*
 * Physics Lesson 6: Power. Original, code-native schematics; not to scale. Focus ids start with 'power-'.
 *
 * Colour code for the quantities in an equation (the same in Lessons 6, 7 and 9):
 *   power green, energy amber, time blue, mass slate, temperature red (hot) — each a soft fill with a darker line.
 * One scene per teaching section: the two hoists ("What is power?"), the equation card ("How do you work out power?")
 * and the turned-round card ("How do you find the energy?"). Each frame changes what is highlighted.
 *
 * The small pieces below (cards, chips, stopwatch, fraction, table, steps) are exported for the other Energy
 * lessons drawn in this style (ShcPracticalVisuals, EfficiencyVisuals).
 */

const { ink, muted } = P
export const r1 = (n: number) => Math.round(n * 10) / 10
export const faded = 0.28

/** The colours for the quantities in equations. */
export const qty = {
  power: { fill: '#d5eee4', line: '#2f8a6e' },
  energy: { fill: '#f7e6bd', line: '#b27c16' },
  time: { fill: '#dbe9f5', line: '#3f7fb0' },
  mass: { fill: '#e3e8ee', line: '#5b6f82' },
  temp: { fill: P.hotFill, line: P.hot },
  plain: { fill: P.panel, line: '#8aa0b0' },
  useful: { fill: P.usefulFill, line: P.useful },
  wasted: { fill: P.wastedFill, line: P.wasted },
  total: { fill: '#e8edf2', line: '#50657a' },
}
export type Qty = keyof typeof qty

/* ---------- Organic shapes ---------- */

export function seeded(seed: number) {
  let s = (Math.abs(Math.floor(seed)) * 9973 + 7) % 2147483647 || 1
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}
/** A smooth closed curve through the points (Catmull-Rom as cubic Béziers). */
export function smoothClosed(pts: Pt[]) {
  const n = pts.length
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n]
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])} ${r1(p2[1])}`
  }
  return d + 'Z'
}
/** A soft, slightly lumpy rounded rectangle (insulation, wool, soil). */
export function fluffyRect(x: number, y: number, w: number, h: number, seed: number, wobble = 3, step = 13) {
  const rand = seeded(seed), pts: Pt[] = []
  const edge = (x0: number, y0: number, x1: number, y1: number, nx: number, ny: number) => {
    const len = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.round(len / step))
    for (let i = 0; i < n; i++) { const t = i / n, k = (rand() - 0.3) * wobble; pts.push([x0 + (x1 - x0) * t + nx * k, y0 + (y1 - y0) * t + ny * k]) }
  }
  const c = 10
  edge(x + c, y, x + w - c, y, 0, -1); edge(x + w, y + c, x + w, y + h - c, 1, 0)
  edge(x + w - c, y + h, x + c, y + h, 0, 1); edge(x, y + h - c, x, y + c, -1, 0)
  return smoothClosed(pts)
}
/** A numbered marker with a leader to the thing it points at (as in the Biology drawings). */
export function Marker({ n, x, y, to }: { n: number | string; x: number; y: number; to: Pt }) {
  const a = Math.atan2(to[1] - y, to[0] - x), sx = r1(x + Math.cos(a) * 14), sy = r1(y + Math.sin(a) * 14)
  return <g><path d={`M${sx} ${sy}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="3" fill={ink} /><circle cx={x} cy={y} r="14" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="15" fontWeight="750">{n}</text></g>
}
/** A label with a leader line ending in a dot on the thing it names. */
export function Label({ x, y, to, lines, anchor = 'start', colour = ink, dim = false, size = 14 }: { x: number; y: number; to?: Pt; lines: string[]; anchor?: 'start' | 'middle' | 'end'; colour?: string; dim?: boolean; size?: number }) {
  const w = Math.max(...lines.map(l => textWidth(l, size))), h = (lines.length - 1) * (size + 3)
  const left = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2
  let from: Pt = [x, y]
  if (to) {
    if (to[0] > left + w + 4) from = [left + w + 5, y - 5]
    else if (to[0] < left - 4) from = [left - 5, y - 5]
    else from = [Math.min(Math.max(to[0], left + 6), left + w - 6), to[1] > y ? y + h + 6 : y - size - 2]
  }
  return <g opacity={dim ? faded : 1}>
    {to && <><path d={`M${r1(from[0])} ${r1(from[1])}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.4" /><circle cx={to[0]} cy={to[1]} r="2.6" fill={ink} /></>}
    <Lines x={x} y={y} lines={lines} anchor={anchor} size={size} weight={650} colour={colour} />
  </g>
}

/** A gently irregular closed outline around (cx, cy). */
export function blob(cx: number, cy: number, rx: number, ry: number, seed: number, wobble = 0.1, count = 10) {
  const rand = seeded(seed)
  const pts: Pt[] = Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2, k = 1 + (rand() - 0.5) * 2 * wobble
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]
  })
  return smoothClosed(pts)
}

/* ---------- Text, cards and chips ---------- */

/** Rough text width for bold DM Sans. */
export const textWidth = (text: string, size = 14) => text.length * size * 0.6

export function Caption({ text, y = 290, x = 270, colour = muted }: { text: string; y?: number; x?: number; colour?: string }) {
  return <text x={x} y={y} textAnchor="middle" fontSize="14" fontWeight="600" fill={colour}>{text}</text>
}
/** A soft rounded panel. */
export function Card({ x, y, w, h, tone = 'plain', dim = false, strong = false, children }: { x: number; y: number; w: number; h: number; tone?: Qty; dim?: boolean; strong?: boolean; children?: ReactNode }) {
  const c = qty[tone]
  return <g opacity={dim ? faded : 1}>
    <rect x={x} y={y} width={w} height={h} rx="14" fill={tone === 'plain' ? '#fbfdfe' : c.fill} fillOpacity={tone === 'plain' ? 1 : 0.5} stroke={c.line} strokeWidth={strong ? 2.4 : 1.6} />
    {children}
  </g>
}
/** A pill with centred text. */
export function Chip({ x, y, text, tone = 'plain', size = 14, dim = false, w }: { x: number; y: number; text: string; tone?: Qty; size?: number; dim?: boolean; w?: number }) {
  const c = qty[tone], width = w ?? text.length * size * 0.64 + 26
  return <g opacity={dim ? faded : 1}>
    <rect x={r1(x - width / 2)} y={y - size} width={r1(width)} height={size * 2} rx={size} fill={c.fill} stroke={c.line} strokeWidth="1.6" />
    <text x={x} y={y + size * 0.36} textAnchor="middle" fontSize={size} fontWeight="700" fill={tone === 'plain' ? ink : c.line}>{text}</text>
  </g>
}
/** A straight arrow with a solid head. */
export function Arrow({ from, to, colour = ink, width = 2.6, dashed = false, opacity = 1 }: { from: Pt; to: Pt; colour?: string; width?: number; dashed?: boolean; opacity?: number }) {
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]), h = 7 + width * 1.5
  const p = (d: number, s: number): Pt => [r1(to[0] - Math.cos(a) * d + Math.cos(a + Math.PI / 2) * s), r1(to[1] - Math.sin(a) * d + Math.sin(a + Math.PI / 2) * s)]
  const [b1, b2, base] = [p(h, h * 0.58), p(h, -h * 0.58), p(h * 0.72, 0)]
  return <g opacity={opacity}><path d={`M${from[0]} ${from[1]}L${base[0]} ${base[1]}`} stroke={colour} strokeWidth={width} fill="none" strokeDasharray={dashed ? '6 6' : undefined} /><path d={`M${to[0]} ${to[1]}L${b1[0]} ${b1[1]}L${base[0]} ${base[1]}L${b2[0]} ${b2[1]}Z`} fill={colour} stroke={colour} strokeWidth="1.2" /></g>
}
export function Tick({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><circle r="12" fill={P.usefulFill} stroke={P.useful} strokeWidth="2" /><path d="M-5.5 0l4 4.5l7.5 -9" stroke={P.useful} strokeWidth="3" fill="none" /></g>
}
export function Cross({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><circle r="12" fill={P.wastedFill} stroke={P.wasted} strokeWidth="2" /><path d="M-4.5 -4.5l9 9M4.5 -4.5l-9 9" stroke={P.wasted} strokeWidth="3" /></g>
}

/** A stopwatch; `frac` sets the hand (0 = top, 1 = a full turn). */
export function Stopwatch({ x, y, r = 22, frac = 0, label, tone = 'time', dim = false }: { x: number; y: number; r?: number; frac?: number; label?: string; tone?: Qty; dim?: boolean }) {
  const c = qty[tone], a = frac * Math.PI * 2 - Math.PI / 2
  return <g opacity={dim ? faded : 1}>
    <rect x={x - 5} y={y - r - 9} width={10} height={7} rx="2" fill={c.line} />
    <path d={`M${x + r * 0.62} ${y - r * 0.9}l5 -5`} stroke={c.line} strokeWidth="3" />
    <circle cx={x} cy={y} r={r} fill="white" stroke={c.line} strokeWidth="2.4" />
    {frac > 0 && <path d={`M${x} ${y}V${y - r + 4}A${r - 4} ${r - 4} 0 ${frac > 0.5 ? 1 : 0} 1 ${r1(x + Math.cos(a) * (r - 4))} ${r1(y + Math.sin(a) * (r - 4))}Z`} fill={c.fill} />}
    {[0, 0.25, 0.5, 0.75].map(t => <path key={t} d={`M${r1(x + Math.cos(t * Math.PI * 2) * (r - 2))} ${r1(y + Math.sin(t * Math.PI * 2) * (r - 2))}L${r1(x + Math.cos(t * Math.PI * 2) * (r - 6))} ${r1(y + Math.sin(t * Math.PI * 2) * (r - 6))}`} stroke={c.line} strokeWidth="1.6" />)}
    <path d={`M${x} ${y}L${r1(x + Math.cos(a) * (r - 6))} ${r1(y + Math.sin(a) * (r - 6))}`} stroke={ink} strokeWidth="2.4" />
    <circle cx={x} cy={y} r="2.6" fill={ink} />
    {label && <text x={x} y={y + r + 19} textAnchor="middle" fontSize="14" fontWeight="700" fill={c.line}>{label}</text>}
  </g>
}

/**
 * An equation with a fraction: `lhs = top / bottom`, centred on cx. Each part is a coloured term. y is the baseline
 * of the `lhs` and the equals sign; the fraction bar sits just above it. Widths are estimated from the text.
 */
export type Term = { text: string; tone: Qty; ring?: boolean; dim?: boolean }
export function Fraction({ cx, y, lhs, top, bottom, size = 22 }: { cx: number; y: number; lhs: Term; top: Term; bottom: Term; size?: number }) {
  const lw = textWidth(lhs.text, size), fw = Math.max(textWidth(top.text, size), textWidth(bottom.text, size)) + 16
  const x = cx - fractionWidth(lhs.text, top.text, bottom.text, size) / 2
  const eqX = x + lw + size * 0.75, fx = eqX + size * 0.75 + fw / 2, barY = y - size * 0.32
  const term = (t: Term, tx: number, ty: number, anchor: 'start' | 'middle') => {
    const w = textWidth(t.text, size), left = anchor === 'middle' ? tx - w / 2 : tx
    return <g opacity={t.dim ? faded : 1}>
      {t.ring && <rect x={r1(left - 9)} y={r1(ty - size * 1.02)} width={r1(w + 18)} height={r1(size * 1.42)} rx={r1(size * 0.6)} fill={qty[t.tone].fill} stroke={qty[t.tone].line} strokeWidth="2.2" />}
      <text x={tx} y={ty} textAnchor={anchor} fontSize={size} fontWeight="750" fill={qty[t.tone].line}>{t.text}</text>
    </g>
  }
  return <g>
    {term(lhs, x, y, 'start')}
    <text x={eqX} y={y} textAnchor="middle" fontSize={size} fontWeight="700" fill={ink}>=</text>
    {term(top, fx, barY - size * 0.42, 'middle')}
    <path d={`M${r1(fx - fw / 2)} ${r1(barY)}H${r1(fx + fw / 2)}`} stroke={ink} strokeWidth="2.4" />
    {term(bottom, fx, barY + size * 1.12, 'middle')}
  </g>
}
/** Width of a Fraction, for centring. */
export function fractionWidth(lhs: string, top: string, bottom: string, size = 22) {
  return textWidth(lhs, size) + size * 1.5 + Math.max(textWidth(top, size), textWidth(bottom, size)) + 16
}

/** A simple data table. The header row wraps onto two lines when given as 'line one|line two'. */
export function DataTable({ x, y, widths, head, rows, rowH = 34 }: { x: number; y: number; widths: number[]; head: string[]; rows: string[][]; rowH?: number }) {
  const total = widths.reduce((a, b) => a + b, 0), headH = head.some(h => h.includes('|')) ? 46 : 34
  const lefts = widths.map((_, i) => x + widths.slice(0, i).reduce((a, b) => a + b, 0))
  const h = headH + rows.length * rowH
  return <g>
    <rect x={x} y={y} width={total} height={h} rx="12" fill="white" stroke={P.panelLine} strokeWidth="1.8" />
    <path d={`M${x + 1} ${y + headH}V${y + 12}Q${x + 1} ${y + 1} ${x + 12} ${y + 1}H${x + total - 12}Q${x + total - 1} ${y + 1} ${x + total - 1} ${y + 12}V${y + headH}Z`} fill={P.panel} />
    <path d={`M${x} ${y + headH}H${x + total}`} stroke={P.panelLine} strokeWidth="1.8" />
    {rows.slice(1).map((_, i) => <path key={i} d={`M${x + 8} ${y + headH + (i + 1) * rowH}H${x + total - 8}`} stroke={P.grid} strokeWidth="1.4" />)}
    {lefts.slice(1).map((lx, i) => <path key={i} d={`M${lx} ${y + 6}V${y + h - 6}`} stroke={P.grid} strokeWidth="1.4" />)}
    {head.map((t, i) => {
      const parts = t.split('|'), cx = lefts[i] + widths[i] / 2
      return <text key={i} x={cx} y={y + (parts.length > 1 ? 20 : 22)} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{parts.map((p, j) => <tspan key={j} x={cx} dy={j ? 16 : 0}>{p}</tspan>)}</text>
    })}
    {rows.map((row, r) => row.map((t, i) => <text key={`${r}-${i}`} x={lefts[i] + widths[i] / 2} y={y + headH + r * rowH + rowH / 2 + 5} textAnchor="middle" fontSize="14" fontWeight={i === 0 ? 700 : 500} fill={ink}>{t}</text>))}
  </g>
}

/** A numbered list of short steps; `active` highlights one (the rest stay readable). `answer` puts the last step in a coloured pill. */
export function Steps({ x, y, steps, gap = 44, active, answer }: { x: number; y: number; steps: string[][]; gap?: number; active?: number; answer?: Qty }) {
  return <g>
    {steps.map((lines, i) => {
      const on = active === undefined || active === i
      return <g key={i} opacity={on ? 1 : 0.5}>
        <circle cx={x + 13} cy={y + i * gap} r="13" fill={on && active !== undefined ? '#e4f4ef' : 'white'} stroke={on && active !== undefined ? qty.power.line : ink} strokeWidth="2" />
        <text x={x + 13} y={y + i * gap + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{i + 1}</text>
        {answer && i === steps.length - 1 && <rect x={x + 30} y={y + i * gap - 18} width={r1(Math.max(...lines.map(l => textWidth(l, 16))) + 22)} height={36} rx="18" fill={qty[answer].fill} stroke={qty[answer].line} strokeWidth="2" />}
        {answer && i === steps.length - 1
          ? <text x={x + 41} y={y + i * gap + 6} fontSize="16" fontWeight="800" fill={qty[answer].line}>{lines[0]}</text>
          : <Lines x={x + 34} y={y + i * gap + 5 - (lines.length - 1) * 8.5} lines={lines} size={14} weight={600} />}
      </g>
    })}
  </g>
}

/* ---------- Objects ---------- */

export function Crate({ x, y, w = 46, h = 38, dim = false }: { x: number; y: number; w?: number; h?: number; dim?: boolean }) {
  return <g opacity={dim ? faded : 1}>
    <rect x={x} y={y} width={w} height={h} rx="5" fill="#efdcbc" stroke="#a37b4b" strokeWidth="2" />
    <path d={`M${x + 4} ${y + h / 2}H${x + w - 4}M${x + 5} ${y + 5}L${x + w - 5} ${y + h - 5}`} stroke="#c09a68" strokeWidth="1.8" />
  </g>
}
/** A small electric motor: a rounded body with a drum on the front. */
export function Motor({ x, y, label, s = 1 }: { x: number; y: number; label?: string; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-26} y={-16} width={52} height={32} rx="9" fill="#e3e8ee" stroke="#5b6f82" strokeWidth="2" />
    {[-14, -6, 2].map(dx => <path key={dx} d={`M${dx} -12V12`} stroke="#b5c0cb" strokeWidth="2" />)}
    <circle cx={16} cy={0} r="9" fill="white" stroke="#5b6f82" strokeWidth="2" />
    <circle cx={16} cy={0} r="3" fill="#5b6f82" />
    {label && <text x={0} y={36} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{label}</text>}
  </g>
}
/** A filament bulb, glowing when lit. (x, y) is the centre of the glass. */
export function Bulb({ x, y, r = 26, lit = true, dim = false }: { x: number; y: number; r?: number; lit?: boolean; dim?: boolean }) {
  return <g opacity={dim ? faded : 1}>
    {lit && <path d={blob(x, y, r * 1.75, r * 1.75, 12, 0.06, 12)} fill={P.light} opacity=".55" />}
    <path d={`M${x - r * 0.45} ${y + r * 0.85}C${x - r * 1.25} ${y + r * 0.2} ${x - r * 1.1} ${y - r} ${x} ${y - r}C${x + r * 1.1} ${y - r} ${x + r * 1.25} ${y + r * 0.2} ${x + r * 0.45} ${y + r * 0.85}Z`} fill={lit ? '#fff6d6' : 'white'} stroke={P.lightLine} strokeWidth="2" />
    <path d={`M${x - r * 0.3} ${y + r * 0.7}L${x - r * 0.22} ${y}Q${x - r * 0.11} ${y - r * 0.28} ${x} ${y}Q${x + r * 0.11} ${y - r * 0.28} ${x + r * 0.22} ${y}L${x + r * 0.3} ${y + r * 0.7}`} stroke={P.lightLine} strokeWidth="1.6" fill="none" />
    <rect x={x - r * 0.48} y={y + r * 0.85} width={r * 0.96} height={r * 0.5} rx="3" fill="#dfe5ea" stroke="#5a6b79" strokeWidth="1.8" />
    <path d={`M${x - r * 0.48} ${y + r * 1.02}H${x + r * 0.48}M${x - r * 0.48} ${y + r * 1.18}H${x + r * 0.48}`} stroke="#5a6b79" strokeWidth="1.3" />
  </g>
}

/* ---------- Section 1: two hoists lifting identical crates ---------- */

const FLOOR = 250, TOP_Y = 78
function Hoist({ cx, crateTop, name, takes, dim = false }: { cx: number; crateTop: number; name: string; takes: string; dim?: boolean }) {
  return <g opacity={dim ? faded : 1}>
    <path d={`M${cx - 52} ${FLOOR}V52Q${cx - 52} 44 ${cx - 44} 44H${cx + 44}Q${cx + 52} 44 ${cx + 52} 52V${FLOOR}`} fill="none" stroke="#8a9aa8" strokeWidth="5" />
    <path d={`M${cx - 52} 76L${cx - 30} 44M${cx + 52} 76L${cx + 30} 44`} stroke="#8a9aa8" strokeWidth="3" />
    <Motor x={cx - 16} y={26} />
    <path d={`M${cx} 35V${crateTop}`} stroke={ink} strokeWidth="1.8" />
    <path d={`M${cx - 8} ${crateTop}L${cx} ${crateTop - 8}L${cx + 8} ${crateTop}`} stroke={ink} strokeWidth="1.8" fill="none" />
    <Crate x={cx - 23} y={crateTop} />
    <circle cx={cx} cy={FLOOR + 22} r="13" fill="white" stroke={ink} strokeWidth="2" />
    <text x={cx} y={FLOOR + 27} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>{name}</text>
    <text x={cx + 20} y={FLOOR + 27} fontSize="13" fontWeight="600" fill={qty.time.line}>{takes}</text>
  </g>
}
function HoistScene({ focus }: { focus: string }) {
  const powerful = focus === 'power-powerful'
  const A = 88, B = 250
  const title = powerful
    ? 'The same two motors after 5 seconds, each with a bar showing the energy transferred to its crate so far. Motor A has transferred all the energy it needs; motor B has transferred half. Motor A transfers more energy in each second, so it is more powerful.'
    : 'Two motors lift identical crates to the same height. After 5 seconds motor A has finished, but motor B is only half way up and needs 10 seconds in all. Both crates gain the same energy; motor A transfers it faster.'
  return <PhysicsDiagram title={title}>
    <path d={`M8 ${FLOOR}Q170 ${FLOOR - 3} 332 ${FLOOR}`} stroke="#b9a58a" strokeWidth="3" fill="none" />
    <path d={`M30 ${TOP_Y}H310`} stroke={muted} strokeWidth="1.6" strokeDasharray="6 6" />
    <text x={2} y={TOP_Y + 5} fontSize="13" fontWeight="600" fill={muted}>top</text>
    <Hoist cx={A} crateTop={TOP_Y} name="A" takes="takes 5 s" />
    <Hoist cx={B} crateTop={160} name="B" takes="takes 10 s" />
    {!powerful && <g>
      <Arrow from={[B + 36, 196]} to={[B + 36, 150]} colour={P.gravitationalLine} width={2.4} />
      <Tick x={A + 38} y={TOP_Y + 20} s={0.85} />
    </g>}
    {powerful && <g>
      {[[A + 72, 1], [B + 72, 0.5]].map(([bx, f]) => <g key={bx}>
        <rect x={bx - 9} y={TOP_Y} width={18} height={FLOOR - TOP_Y - 10} rx="9" fill="white" stroke={P.gravitationalLine} strokeWidth="1.8" />
        <rect x={bx - 7} y={r1(FLOOR - 12 - (FLOOR - TOP_Y - 14) * f)} width={14} height={r1((FLOOR - TOP_Y - 14) * f)} rx="7" fill={P.gravitational} stroke={P.gravitationalLine} strokeWidth="1" />
      </g>)}
    </g>}
    <Stopwatch x={372} y={62} r={20} frac={5 / 60} />
    <text x={402} y={58} fontSize="15" fontWeight="750" fill={qty.time.line}>after 5 s</text>
    <text x={402} y={76} fontSize="13" fontWeight="600" fill={muted}>A done, B half way</text>
    {!powerful && <g>
      <Lines x={352} y={128} lines={['same crate', 'same height', 'same energy']} size={14} weight={650} />
      <Card x={346} y={196} w={186} h={58} tone="power" strong>
        <Lines x={360} y={220} lines={['A is faster:', 'more power']} size={15} weight={750} colour={qty.power.line} />
      </Card>
    </g>}
    {powerful && <g>
      <Lines x={352} y={124} lines={['bars: energy', 'transferred so far']} size={13} weight={600} colour={P.gravitationalLine} />
      <Card x={346} y={178} w={186} h={76} tone="power" strong>
        <Lines x={360} y={202} lines={['A: more energy in', 'each second, so it', 'is more powerful']} size={14} weight={700} colour={qty.power.line} />
      </Card>
    </g>}
  </PhysicsDiagram>
}

/* ---------- One watt ---------- */

function WattScene() {
  const bx = 96, by = 128
  return <PhysicsDiagram title="A lamp gives out energy. A 60 watt lamp transfers 60 joules of energy every second. One watt means one joule per second.">
    <Bulb x={bx} y={by} r={30} />
    <path d={`M${bx} ${by + 45}V${by + 90}`} stroke={P.wire} strokeWidth="3" />
    <path d={`M${bx - 36} ${by + 92}H${bx + 36}`} stroke={P.wire} strokeWidth="5" />
    {/* a stream of joules leaving in one second */}
    {Array.from({ length: 7 }, (_, i) => {
      const t = i / 6, x = 158 + t * 118, y = by - 2 + Math.sin(t * Math.PI * 2) * 8
      return <circle key={i} cx={r1(x)} cy={r1(y)} r={7 - t * 1.5} fill={qty.energy.fill} stroke={qty.energy.line} strokeWidth="1.6" />
    })}
    <path d={`M156 ${by - 30}Q156 ${by - 38} 164 ${by - 38}H272Q280 ${by - 38} 280 ${by - 30}`} stroke={qty.time.line} strokeWidth="2" fill="none" />
    <text x={218} y={by - 46} textAnchor="middle" fontSize="14" fontWeight="700" fill={qty.time.line}>in 1 second</text>
    <text x={218} y={by + 34} textAnchor="middle" fontSize="15" fontWeight="750" fill={qty.energy.line}>60 J</text>
    <Chip x={bx} y={by + 128} text="60 W lamp" tone="power" />
    <Card x={318} y={70} w={204} h={128} tone="power" strong>
      <text x={420} y={116} textAnchor="middle" fontSize="28" fontWeight="800" fill={qty.power.line}>1 W</text>
      <text x={420} y={146} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>=</text>
      <text x={420} y={176} textAnchor="middle" fontSize="17" fontWeight="750" fill={qty.energy.line}>1 J per second</text>
    </Card>
    <Lines x={420} y={232} anchor="middle" lines={['60 W = 60 J', 'every second']} size={15} weight={750} colour={ink} />
  </PhysicsDiagram>
}

/* ---------- Work done ---------- */

function Person({ x, y }: { x: number; y: number }) {
  // A simple rounded figure leaning forward to push; (x, y) is where the feet meet the floor.
  const skin = '#f1c9a5', skinLine = '#b88660', shirt = '#cfe0ee', shirtLine = '#4f7ea3'
  return <g>
    <path d={`M${x - 14} ${y}L${x - 2} ${y - 44}M${x + 12} ${y}L${x + 4} ${y - 44}`} stroke="#5b6f82" strokeWidth="9" />
    <path d={`M${x - 8} ${y - 40}C${x - 8} ${y - 70} ${x + 6} ${y - 92} ${x + 22} ${y - 96}L${x + 30} ${y - 84}C${x + 22} ${y - 70} ${x + 16} ${y - 56} ${x + 12} ${y - 40}Z`} fill={shirt} stroke={shirtLine} strokeWidth="2" />
    <path d={`M${x + 20} ${y - 86}L${x + 52} ${y - 62}`} stroke={shirtLine} strokeWidth="9" />
    <circle cx={x + 55} cy={y - 60} r="5" fill={skin} stroke={skinLine} strokeWidth="1.6" />
    <circle cx={x + 32} cy={y - 108} r="13" fill={skin} stroke={skinLine} strokeWidth="2" />
  </g>
}
function WorkScene() {
  const floor = 206
  return <PhysicsDiagram title="A person pushes a box along the floor with a force, so the box moves. Work is done, and work done equals energy transferred, in joules. So power is both the rate of energy transfer and the rate of doing work.">
    <path d={`M10 ${floor}Q130 ${floor - 3} 262 ${floor}`} stroke="#b9a58a" strokeWidth="3" fill="none" />
    <Person x={54} y={floor} />
    <Crate x={116} y={floor - 58} w={70} h={58} />
    <Arrow from={[190, floor - 30]} to={[250, floor - 30]} colour={P.current} width={3.4} />
    <text x={220} y={floor - 42} textAnchor="middle" fontSize="14" fontWeight="700" fill={P.current}>force</text>
    <Arrow from={[120, floor + 20]} to={[220, floor + 20]} colour={muted} width={2} />
    <text x={170} y={floor + 40} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>the box moves</text>
    <Card x={14} y={10} w={246} h={58} tone="energy">
      <Lines x={137} y={34} anchor="middle" lines={['work done =', 'energy transferred (J)']} size={14} weight={750} colour={qty.energy.line} />
    </Card>
    <text x={402} y={46} textAnchor="middle" fontSize="15" fontWeight="700" fill={muted}>power is the…</text>
    <Card x={292} y={64} w={220} h={62} tone="power" strong>
      <Lines x={402} y={90} anchor="middle" lines={['rate of', 'energy transfer']} size={15} weight={750} colour={qty.power.line} />
    </Card>
    <text x={402} y={154} textAnchor="middle" fontSize="26" fontWeight="800" fill={ink}>=</text>
    <Card x={292} y={170} w={220} h={62} tone="power" strong>
      <Lines x={402} y={196} anchor="middle" lines={['rate of', 'doing work']} size={15} weight={750} colour={qty.power.line} />
    </Card>
    <Caption x={402} y={262} text="both in watts" />
  </PhysicsDiagram>
}

/* ---------- Section 2: the equation card ---------- */

function EquationCard({ focus }: { focus: string }) {
  const words = focus === 'power-eq-words', symbols = focus === 'power-eq-symbols', work = focus === 'power-eq-work', units = focus === 'power-units'
  const titles: Record<string, string> = {
    'power-eq-words': 'The equation in words: power equals energy transferred divided by time. Energy is on top and time is underneath.',
    'power-eq-symbols': 'The equation in symbols: P equals E divided by t. P is power in watts, E is energy in joules and t is time in seconds.',
    'power-eq-work': 'Two versions of the equation: P equals E divided by t, and P equals W divided by t. They are the same, because work done equals energy transferred. W for work done is not the same as W for watts.',
    'power-units': 'Change the units before dividing: 2 minutes times 60 is 120 seconds, and 3 kilojoules times 1000 is 3000 joules. Then use P equals E divided by t.',
  }
  const sym = (size: number, x: number, y: number, top = 'E') => <Fraction cx={x} y={y} size={size} lhs={{ text: 'P', tone: 'power' }} top={{ text: top, tone: 'energy' }} bottom={{ text: 't', tone: 'time' }} />
  return <PhysicsDiagram title={titles[focus]}>
    {words && <g>
      <Card x={40} y={56} w={460} h={140} strong />
      <Fraction cx={270} y={138} size={24} lhs={{ text: 'power', tone: 'power' }} top={{ text: 'energy transferred', tone: 'energy' }} bottom={{ text: 'time', tone: 'time' }} />
      <text x={270} y={236} textAnchor="middle" fontSize="14" fontWeight="600" fill={muted}>energy on top, time underneath</text>
    </g>}
    {symbols && <g>
      <Card x={150} y={30} w={240} h={124} strong />
      {sym(32, 270, 110)}
      <Chip x={100} y={210} text="P: watts, W" tone="power" />
      <Chip x={270} y={210} text="E: joules, J" tone="energy" />
      <Chip x={440} y={210} text="t: seconds, s" tone="time" />
      <Caption y={262} text="power = energy transferred ÷ time" />
    </g>}
    {work && <g>
      <Card x={40} y={34} w={190} h={112} strong />
      {sym(28, 135, 100)}
      <Card x={310} y={34} w={190} h={112} strong />
      {sym(28, 405, 100, 'W')}
      <text x={270} y={98} textAnchor="middle" fontSize="28" fontWeight="800" fill={ink}>=</text>
      <Lines x={270} y={184} anchor="middle" lines={['same, because', 'work done = energy transferred']} size={15} weight={700} colour={qty.energy.line} />
      <Card x={150} y={230} w={240} h={44} tone="plain">
        <text x={270} y={257} textAnchor="middle" fontSize="14" fontWeight="700" fill={P.wasted}>W (work) is not W (watts)</text>
      </Card>
    </g>}
    {units && <g>
      <g opacity={0.3}><Card x={170} y={26} w={200} h={112} />{sym(28, 270, 92)}</g>
      <Tick x={374} y={40} />
      <Card x={30} y={160} w={230} h={96} tone="time">
        <text x={145} y={190} textAnchor="middle" fontSize="14" fontWeight="650" fill={muted}>time must be in seconds</text>
        <text x={145} y={226} textAnchor="middle" fontSize="18" fontWeight="750" fill={qty.time.line}>2 min × 60 = 120 s</text>
      </Card>
      <Card x={280} y={160} w={230} h={96} tone="energy">
        <text x={395} y={190} textAnchor="middle" fontSize="14" fontWeight="650" fill={muted}>energy must be in joules</text>
        <text x={395} y={226} textAnchor="middle" fontSize="18" fontWeight="750" fill={qty.energy.line}>3 kJ × 1000 = 3000 J</text>
      </Card>
      <Caption y={286} text="check the units first, then divide" />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 3: turning the equation round ---------- */

function RearrangeCard({ focus }: { focus: string }) {
  const find = focus === 'power-find-energy', turn = focus === 'power-rearrange'
  if (find) return <PhysicsDiagram title="The equation P equals E divided by t, with E circled and a question mark: you know the power and the time, and want the energy.">
    <Card x={150} y={40} w={240} h={140} strong />
    <Fraction cx={270} y={128} size={34} lhs={{ text: 'P', tone: 'power' }} top={{ text: 'E', tone: 'energy', ring: true }} bottom={{ text: 't', tone: 'time' }} />
    <text x={338} y={84} fontSize="30" fontWeight="800" fill={qty.energy.line}>?</text>
    <Chip x={140} y={226} text="know P" tone="power" />
    <Chip x={270} y={226} text="know t" tone="time" />
    <Chip x={400} y={226} text="want E" tone="energy" />
    <Caption y={282} text="E is not on its own yet, so turn the equation round" />
  </PhysicsDiagram>
  if (turn) return <PhysicsDiagram title="Rearranging: start with P equals E divided by t. Multiply both sides by t. The t on the right cancels, leaving E equals P times t.">
    <Fraction cx={270} y={72} size={26} lhs={{ text: 'P', tone: 'power' }} top={{ text: 'E', tone: 'energy' }} bottom={{ text: 't', tone: 'time' }} />
    <Arrow from={[270, 104]} to={[270, 128]} colour={muted} width={2.2} />
    <text x={286} y={121} fontSize="14" fontWeight="700" fill={muted}>× t on both sides</text>
    {/* P × t = (E ÷ t) × t, with the two t's cancelled */}
    <text x={258} y={162} textAnchor="end" fontSize="26" fontWeight="750" fill={qty.power.line}>P<tspan fill={ink}> × </tspan><tspan fill={qty.time.line}>t</tspan><tspan fill={ink}> =</tspan></text>
    <text x={290} y={143} textAnchor="middle" fontSize="26" fontWeight="750" fill={qty.energy.line}>E</text>
    <path d="M276 154H304" stroke={ink} strokeWidth="2.4" />
    <text x={290} y={183} textAnchor="middle" fontSize="26" fontWeight="750" fill={qty.time.line}>t</text>
    <text x={328} y={162} textAnchor="middle" fontSize="26" fontWeight="750" fill={ink}>×</text>
    <text x={354} y={162} textAnchor="middle" fontSize="26" fontWeight="750" fill={qty.time.line}>t</text>
    <path d="M281 188L300 164M345 166L364 142" stroke={P.wasted} strokeWidth="2.6" />
    <text x={380} y={170} fontSize="14" fontWeight="700" fill={P.wasted}>the t’s cancel</text>
    <Arrow from={[270, 194]} to={[270, 216]} colour={muted} width={2.2} />
    <Card x={160} y={222} w={220} h={56} tone="energy" strong>
      <text x={270} y={261} textAnchor="middle" fontSize="30" fontWeight="800" fill={qty.energy.line}>E<tspan fill={ink}> = </tspan><tspan fill={qty.power.line}>P</tspan><tspan fill={ink}> × </tspan><tspan fill={qty.time.line}>t</tspan></text>
    </Card>
  </PhysicsDiagram>
  // power-e-pt
  return <PhysicsDiagram title="A 20 watt lamp is on for 10 seconds. Energy equals power times time: 20 times 10 equals 200 joules. Watts times seconds gives joules.">
    <Bulb x={92} y={112} r={30} />
    <Chip x={92} y={210} text="20 W" tone="power" />
    <Stopwatch x={214} y={120} r={30} frac={10 / 60} label="10 s" />
    <Card x={300} y={30} w={210} h={62} tone="energy">
      <text x={405} y={70} textAnchor="middle" fontSize="26" fontWeight="800" fill={qty.energy.line}>E<tspan fill={ink}> = </tspan><tspan fill={qty.power.line}>P</tspan><tspan fill={ink}> × </tspan><tspan fill={qty.time.line}>t</tspan></text>
    </Card>
    <text x={405} y={138} textAnchor="middle" fontSize="22" fontWeight="750" fill={ink}><tspan fill={qty.power.line}>20</tspan> × <tspan fill={qty.time.line}>10</tspan> = <tspan fill={qty.energy.line}>200 J</tspan></text>
    <g>
      <Chip x={330} y={210} text="W" tone="power" w={44} />
      <text x={364} y={215} textAnchor="middle" fontSize="18" fontWeight="700" fill={ink}>×</text>
      <Chip x={398} y={210} text="s" tone="time" w={44} />
      <text x={432} y={215} textAnchor="middle" fontSize="18" fontWeight="700" fill={ink}>=</text>
      <Chip x={466} y={210} text="J" tone="energy" w={44} />
    </g>
    <Caption y={276} text="watts × seconds gives joules" />
  </PhysicsDiagram>
}

/* ---------- Worked examples ---------- */

function Pump({ x, y }: { x: number; y: number }) {
  return <g>
    {/* a pump lifting water from a tank up a pipe */}
    <path d={`M${x - 70} ${y + 40}V${y + 88}Q${x - 70} ${y + 96} ${x - 62} ${y + 96}H${x + 10}Q${x + 18} ${y + 96} ${x + 18} ${y + 88}V${y + 40}`} fill="white" stroke="#7f95a6" strokeWidth="2" />
    <path d={`M${x - 68} ${y + 62}Q${x - 26} ${y + 58} ${x + 16} ${y + 62}V${y + 88}Q${x + 16} ${y + 94} ${x + 10} ${y + 94}H${x - 62}Q${x - 68} ${y + 94} ${x - 68} ${y + 88}Z`} fill={P.water} />
    <path d={`M${x - 26} ${y + 80}V${y + 10}`} stroke="#7f95a6" strokeWidth="9" /><path d={`M${x - 26} ${y + 80}V${y + 10}`} stroke={P.water} strokeWidth="5" />
    <path d={`M${x - 26} ${y + 10}V${y - 50}Q${x - 26} ${y - 62} ${x - 14} ${y - 62}H${x + 30}`} stroke="#7f95a6" strokeWidth="9" fill="none" /><path d={`M${x - 26} ${y + 10}V${y - 50}Q${x - 26} ${y - 62} ${x - 14} ${y - 62}H${x + 30}`} stroke={P.water} strokeWidth="5" fill="none" />
    <path d={`M${x + 36} ${y - 58}q4 8 0 14q-4 -6 0 -14Z`} fill={P.water} stroke={P.waterLine} strokeWidth="1.4" />
    <Motor x={x - 26} y={y + 10} s={0.9} />
    <text x={x + 8} y={y + 16} fontSize="14" fontWeight="700" fill={ink}>pump</text>
  </g>
}
function WorkedPower() {
  return <PhysicsDiagram title="Worked example: a pump does 4500 joules of work in 30 seconds. Step 1, check the units: joules and seconds. Step 2, P equals 4500 divided by 30. Step 3, the power is 150 watts.">
    <Pump x={118} y={86} />
    <Chip x={118} y={228} text="4500 J of work" tone="energy" />
    <Chip x={118} y={268} text="in 30 s" tone="time" />
    <Steps x={262} y={70} gap={70} answer="power" steps={[['units: J and s, so', 'nothing to change'], ['P = W ÷ t', '= 4500 ÷ 30'], ['P = 150 W']]} />
  </PhysicsDiagram>
}
function WorkedEnergy() {
  return <PhysicsDiagram title="Worked example: a 250 watt motor runs for 40 seconds. Step 1, the units are watts and seconds. Step 2, E equals P times t, 250 times 40. Step 3, the energy is 10 000 joules.">
    <Motor x={78} y={110} s={1.5} label="" />
    <text x={78} y={156} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>motor</text>
    <Stopwatch x={196} y={110} r={30} frac={40 / 60} />
    <Chip x={78} y={220} text="250 W" tone="power" />
    <Chip x={196} y={220} text="runs for 40 s" tone="time" />
    <Steps x={276} y={70} gap={70} answer="energy" steps={[['units: W and s,', 'so nothing to change'], ['E = P × t', '= 250 × 40'], ['E = 10 000 J']]} />
  </PhysicsDiagram>
}

/* ---------- Question: three motors ---------- */

function MotorTable() {
  return <PhysicsDiagram schematic={false} viewBox="0 0 540 220" title="A table of energy transferred and time for three motors. Motor A: 3000 joules in 10 seconds. Motor B: 4000 joules in 20 seconds. Motor C: 2000 joules in 5 seconds.">
    <DataTable x={50} y={20} widths={[120, 190, 130]} head={['Motor', 'Energy|transferred (J)', 'Time (s)']} rows={[['A', '3000', '10'], ['B', '4000', '20'], ['C', '2000', '5']]} rowH={40} />
  </PhysicsDiagram>
}

export function PowerVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'power-rate': case 'power-powerful': return <HoistScene focus={focus} />
    case 'power-watt': return <WattScene />
    case 'power-work': return <WorkScene />
    case 'power-eq-words': case 'power-eq-symbols': case 'power-eq-work': case 'power-units': return <EquationCard focus={focus} />
    case 'power-find-energy': case 'power-rearrange': case 'power-e-pt': return <RearrangeCard focus={focus} />
    case 'power-worked-power': return <WorkedPower />
    case 'power-worked-energy': return <WorkedEnergy />
    case 'power-q-motors': return <MotorTable />
    default: return null
  }
}

