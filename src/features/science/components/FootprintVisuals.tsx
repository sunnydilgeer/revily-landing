import { useId, type ReactNode } from 'react'
import { blob } from './InfectionVisuals'

/*
 * Chemistry Lesson 47: Carbon footprints. Original, code-native schematics; not to scale. Focus ids start with 'footprint-'.
 * The small drawing kit at the top (puffs, Sun, clouds, chimneys, people, flames) is shared with PollutionVisuals.tsx
 * (Lesson 48), so both atmosphere lessons look alike.
 *
 * Colour code (as the rest of the course and the B7 greenhouse drawings in EarthVisuals.tsx):
 *   purple puffs = carbon dioxide; paler lilac puffs = methane (another greenhouse gas)
 *   yellow = the Sun and its light; green = plants; grey = smoke and buildings; blue = water vapour
 *   the footprint itself = a soft violet-grey sole, so it reads as "a measure of greenhouse gases"
 */
const ink = '#375a73', muted = '#657a89', faded = 0.3
const panelFill = '#f7fafc', panelLine = '#d5e2ea'
const purple = '#8f6fc4', purpleFill = '#efe8f9', purpleInk = '#6d51a6'
const methane = '#f8f4fc', methaneLine = '#b09bd8'
const footFill = '#e6e0f0', footLine = '#7d6aa6'
const yellow = '#efc75d', sunLine = '#b8902e'
const leafFill = '#acd79f', leafLine = '#4f8f5a', grass = '#cfe6bf'
const smoke = '#8d98a2', smokeFill = '#e3e7ea', sky = '#f3f9fc'
const build = '#d5dbe0', buildLine = '#7d8a95'
const water = '#55acd0', waterFill = '#dcf0f8'
const skin = '#f1dcc8', skinLine = '#b9906f', jumper = '#a9cbe0', jumperB = '#c6d9b4', jumperC = '#e8c9a8', trousers = '#5f6f7e'
const good = '#4f9a74', red = '#c8505a', amber = '#c98f2c', amberFill = '#f6dfa5'
const flameOut = '#f5a54a', flameIn = '#fcd97d', heatLine = '#c8641e'

type Pt = [number, number]
const r1 = (n: number) => Math.round(n * 10) / 10

// ---------- Shared kit ----------
function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Lines({ x, y, lines, anchor = 'start', size = 14, weight = 700, colour = ink }: { x: number; y: number; lines: string[]; anchor?: 'start' | 'middle' | 'end'; size?: number; weight?: number; colour?: string }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={colour}>{lines.map((l, i) => <tspan key={i} x={x} dy={i ? size + 3 : 0}>{l}</tspan>)}</text>
}
function Caption({ text, y = 288 }: { text: string; y?: number }) {
  return <text x={270} y={y} textAnchor="middle" fontSize="14" fontWeight="600" fill={muted}>{text}</text>
}
function Arrow({ from, to, colour = ink, width = 2.4, dashed = false }: { from: Pt; to: Pt; colour?: string; width?: number; dashed?: boolean }) {
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]), h = 6 + width * 1.5
  const p = (d: number, s: number): Pt => [r1(to[0] - Math.cos(a) * d + Math.cos(a + Math.PI / 2) * s), r1(to[1] - Math.sin(a) * d + Math.sin(a + Math.PI / 2) * s)]
  const [b1, b2, base] = [p(h, h * .6), p(h, -h * .6), p(h * .7, 0)]
  return <g><path d={`M${from[0]} ${from[1]}L${base[0]} ${base[1]}`} stroke={colour} strokeWidth={width} fill="none" strokeDasharray={dashed ? '6 6' : undefined} /><path d={`M${to[0]} ${to[1]}L${b1[0]} ${b1[1]}L${b2[0]} ${b2[1]}Z`} fill={colour} stroke={colour} strokeWidth="1.2" /></g>
}
// A curved arrow: quadratic curve through a control point, with the head lined up with the end of the curve.
function Curve({ from, via, to, colour = ink, width = 2.4, dashed = false }: { from: Pt; via: Pt; to: Pt; colour?: string; width?: number; dashed?: boolean }) {
  const t = .9, q = (a: number, b: number, c: number) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c
  const near: Pt = [r1(q(from[0], via[0], to[0])), r1(q(from[1], via[1], to[1]))]
  return <g><path d={`M${from[0]} ${from[1]}Q${via[0]} ${via[1]} ${near[0]} ${near[1]}`} stroke={colour} strokeWidth={width} fill="none" strokeDasharray={dashed ? '6 6' : undefined} /><Arrow from={near} to={to} colour={colour} width={width} /></g>
}
function Panel({ x, y, w, h, children, fill = panelFill, line = panelLine }: { x: number; y: number; w: number; h: number; children?: ReactNode; fill?: string; line?: string }) {
  return <g><rect x={x} y={y} width={w} height={h} rx="18" fill={fill} stroke={line} strokeWidth="1.6" />{children}</g>
}
function Tick({ x, y, colour = good }: { x: number; y: number; colour?: string }) {
  return <g><circle cx={x} cy={y} r="13" fill="#e3f2e8" stroke={colour} strokeWidth="1.8" /><path d={`M${x - 6} ${y}l4 5l8 -10`} stroke={colour} strokeWidth="3" fill="none" /></g>
}
function Cross({ x, y, r = 30, colour = red }: { x: number; y: number; r?: number; colour?: string }) {
  return <path d={`M${x - r} ${y - r}L${x + r} ${y + r}M${x + r} ${y - r}L${x - r} ${y + r}`} stroke={colour} strokeWidth="5" opacity=".85" />
}
// A soft gas puff: overlapping bumps with an outline, like the clouds in the B7 drawings.
const PUFF: [number, number, number][] = [[-.55, .2, .48], [-.2, -.22, .6], [.3, -.14, .55], [.58, .22, .44], [.02, .28, .55]]
function Puff({ x, y, r = 14, fill = purpleFill, line = purple, opacity = 1, children }: { x: number; y: number; r?: number; fill?: string; line?: string; opacity?: number; children?: ReactNode }) {
  return <g opacity={opacity}>
    {PUFF.map(([dx, dy, k], i) => <circle key={`o${i}`} cx={r1(x + dx * r)} cy={r1(y + dy * r)} r={r1(k * r + 1.8)} fill={line} />)}
    {PUFF.map(([dx, dy, k], i) => <circle key={i} cx={r1(x + dx * r)} cy={r1(y + dy * r)} r={r1(k * r)} fill={fill} />)}
    {children}
  </g>
}
const Co2 = (p: { x: number; y: number; r?: number; opacity?: number }) => <Puff {...p} />
const Methane = (p: { x: number; y: number; r?: number; opacity?: number }) => <Puff {...p} fill={methane} line={methaneLine} />
function Sun({ x, y, r = 20 }: { x: number; y: number; r?: number }) {
  return <g>{Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2; return <line key={i} x1={r1(x + Math.cos(a) * (r + 4))} y1={r1(y + Math.sin(a) * (r + 4))} x2={r1(x + Math.cos(a) * (r + 10))} y2={r1(y + Math.sin(a) * (r + 10))} stroke={sunLine} strokeWidth="2.2" /> })}
    <circle cx={x} cy={y} r={r} fill={yellow} stroke={sunLine} strokeWidth="2" /></g>
}
const CLOUD_BUMPS = [[-46, 10, 14], [-28, -2, 20], [-4, -12, 24], [22, -6, 20], [42, 6, 15]]
function Cloud({ x, y, s = 1, fill = '#ffffff', line = '#9fb3c2' }: { x: number; y: number; s?: number; fill?: string; line?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    {CLOUD_BUMPS.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r + 2} fill={line} />)}<rect x={-62} y={6} width={120} height={22} rx="11" fill={line} />
    {CLOUD_BUMPS.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={fill} />)}<rect x={-60} y={8} width={116} height={18} rx="9" fill={fill} />
  </g>
}
function Flame({ x, y, s = 1, sooty = false }: { x: number; y: number; s?: number; sooty?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0C-9 -4 -8 -14 -2 -22C-1 -15 4 -14 3 -20C9 -13 10 -4 0 0Z" fill={sooty ? '#f3b45c' : flameOut} stroke={heatLine} strokeWidth={1.4 / s} />
    <path d="M0 -3C-4 -6 -3 -11 0 -14C1 -10 4 -8 0 -3Z" fill={flameIn} />
  </g>
}
// A power station or factory: a saw-tooth roof and one chimney. (x, y) = middle of the base. Returns the chimney top.
function Works({ x, y, s = 1, fill = build, line = buildLine }: { x: number; y: number; s?: number; fill?: string; line?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={10} y={-66} width={13} height={50} rx="2" fill="#c3cad0" stroke={line} strokeWidth={1.6 / s} />
    <path d="M-30 0V-24L-18 -34V-24L-6 -34V-24L6 -34V-24L26 -24V0Z" fill={fill} stroke={line} strokeWidth={1.6 / s} />
    {[-20, -6].map(wx => <rect key={wx} x={wx} y={-16} width={9} height={8} rx="2" fill="white" stroke={line} strokeWidth={1.2 / s} />)}
  </g>
}
const worksTop = (x: number, y: number, s = 1): Pt => [r1(x + 16.5 * s), r1(y - 68 * s)]
function Person({ x, y, s = 1, colour = jumper, arms = 'down', opacity = 1 }: { x: number; y: number; s?: number; colour?: string; arms?: 'down' | 'crossed' | 'shrug' | 'reach' | 'hold' | 'head'; opacity?: number }) {
  const armPath = {
    down: 'M-12 -46Q-19 -36 -18 -24M12 -46Q19 -36 18 -24',
    crossed: 'M-12 -46Q-16 -36 -6 -36H12M12 -46Q16 -40 8 -40H-10',
    shrug: 'M-12 -46Q-24 -44 -26 -56M12 -46Q24 -44 26 -56',
    reach: 'M-12 -46Q-19 -36 -18 -24M12 -46Q22 -54 28 -64',
    hold: 'M-12 -46Q-19 -36 -18 -24M12 -46Q20 -40 26 -34',
    head: 'M-12 -46Q-22 -54 -10 -70M12 -46Q19 -36 18 -24',
  }[arms]
  return <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
    <path d="M-7 -2V-26M7 -2V-26" stroke={trousers} strokeWidth="7" />
    <path d="M-14 -24V-44Q-14 -54 0 -54Q14 -54 14 -44V-24Z" fill={colour} stroke={ink} strokeWidth="1.6" />
    <path d={armPath} stroke={ink} strokeWidth="8.6" fill="none" /><path d={armPath} stroke={colour} strokeWidth="5.6" fill="none" />
    <circle cx="0" cy="-66" r="11" fill={skin} stroke={skinLine} strokeWidth="1.6" />
  </g>
}
function Bubble({ x, y, w, text }: { x: number; y: number; w: number; text: string }) {
  return <g><rect x={x - w / 2} y={y - 17} width={w} height={30} rx="15" fill="white" stroke={muted} strokeWidth="1.6" /><circle cx={x - 8} cy={y + 20} r="4" fill="white" stroke={muted} strokeWidth="1.4" /><circle cx={x - 14} cy={y + 29} r="2.5" fill="white" stroke={muted} strokeWidth="1.2" />
    <text x={x} y={y + 4} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{text}</text></g>
}
function Tree({ x, y, s = 1, seed = 3, bare = false }: { x: number; y: number; s?: number; seed?: number; bare?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-6 0L-5 -46H5L6 0Z" fill="#b08a5e" stroke="#7d5d3a" strokeWidth={1.6 / s} />
    {bare ? <path d="M0 -40L-18 -66M-10 -54L-22 -58M0 -44L16 -70M9 -58L22 -62M0 -46V-76" stroke="#7d5d3a" strokeWidth={3 / s} fill="none" />
      : <path d={blob(0, -70, 34, 30, seed, .1)} fill={leafFill} stroke={leafLine} strokeWidth={2 / s} />}
  </g>
}

// The footprint: a soft sole and five toes (a right foot; mirror for a left foot).
const TOES: [number, number, number][] = [[-9, -37, 6.5], [2, -41.5, 5], [10.5, -38.5, 4.4], [17, -33, 3.9], [21.5, -25.5, 3.4]]
function Foot({ x, y, s = 1, left = false, rot = 0, opacity = 1 }: { x: number; y: number; s?: number; left?: boolean; rot?: number; opacity?: number }) {
  const w = 1.8 / s
  return <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${left ? -s : s} ${s})`} opacity={opacity}>
    <path d="M-15 -20C-17 -33 13 -36 17 -21C20 -7 14 6 12 18C10 32 -12 33 -13 19C-14 7 -13 -8 -15 -20Z" fill={footFill} stroke={footLine} strokeWidth={w} />
    {TOES.map(([cx, cy, r], i) => <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 1.15} fill={footFill} stroke={footLine} strokeWidth={w} />)}
  </g>
}
function Feet({ x, y, s = 1, opacity = 1 }: { x: number; y: number; s?: number; opacity?: number }) {
  return <g opacity={opacity}><Foot x={x - 22 * s} y={y + 10 * s} s={s} left rot={-8} /><Foot x={x + 22 * s} y={y - 10 * s} s={s} rot={8} /></g>
}

// Small everyday objects
function Bus({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-42} y={-42} width={84} height={34} rx="9" fill="#bcd8ec" stroke="#3f6f93" strokeWidth={1.6 / s} />
    {[-34, -17, 0, 17].map(wx => <rect key={wx} x={wx} y={-36} width={13} height={11} rx="3" fill="white" stroke="#3f6f93" strokeWidth={1.2 / s} />)}
    <path d="M-42 -18H42" stroke="#3f6f93" strokeWidth={1.2 / s} />
    {[-24, 24].map(cx => <circle key={cx} cx={cx} cy={-8} r="7" fill="#4a4540" />)}
  </g>
}
function Car({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-24 -6V-14L-14 -16L-8 -26H10L16 -16L24 -14V-6Z" fill="#7fb0d4" stroke="#3f6f93" strokeWidth={1.5 / s} /><path d="M-6 -23H0V-17H-11ZM3 -23H8L12 -17H3Z" fill="white" /><circle cx={-13} cy={-5} r="5" fill="#4a4540" /><circle cx={13} cy={-5} r="5" fill="#4a4540" /></g>
}
function Train({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-44 -8V-38Q-44 -44 -38 -44H30Q44 -44 46 -24L46 -8Z" fill="#cfe3d6" stroke="#4f8a68" strokeWidth={1.6 / s} />
    {[-36, -20, -4, 12].map(wx => <rect key={wx} x={wx} y={-37} width={12} height={11} rx="3" fill="white" stroke="#4f8a68" strokeWidth={1.2 / s} />)}
    <path d="M30 -37Q40 -36 42 -26H30Z" fill="white" stroke="#4f8a68" strokeWidth={1.2 / s} />
    {[-30, -14, 18, 34].map(cx => <circle key={cx} cx={cx} cy={-6} r="5" fill="#4a4540" />)}
    <path d="M-52 0H54" stroke={muted} strokeWidth={2 / s} />
  </g>
}
function Toaster({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-17} y={-48} width={13} height={16} rx="4" fill="#ecc991" stroke="#a8763a" strokeWidth={1.3 / s} />
    <rect x={4} y={-46} width={13} height={14} rx="4" fill="#ecc991" stroke="#a8763a" strokeWidth={1.3 / s} />
    <rect x={-28} y={-38} width={56} height={36} rx="13" fill="#e4e9ee" stroke={buildLine} strokeWidth={1.6 / s} />
    <path d="M-18 -37H-3M5 -37H18" stroke={buildLine} strokeWidth={2.4 / s} />
    <rect x={28} y={-28} width={7} height={5} rx="2" fill="#9aa7b2" />
    <path d="M-22 -2V2M22 -2V2" stroke={buildLine} strokeWidth={3 / s} />
  </g>
}
function Stadium({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-44 -6V-26Q0 -40 44 -26V-6Q0 6 -44 -6Z" fill="#f3e4cf" stroke="#a58a6a" strokeWidth={1.6 / s} />
    <ellipse cx="0" cy="-27" rx="38" ry="8" fill={grass} stroke={leafLine} strokeWidth={1.3 / s} />
    <path d="M-36 -30V-58M36 -30V-58" stroke={muted} strokeWidth={1.6 / s} />
    <path d="M-36 -58L-20 -53L-36 -48Z" fill="#e8837a" stroke="#b4524a" strokeWidth={1.2 / s} /><path d="M36 -58L52 -53L36 -48Z" fill="#7fb0d4" stroke="#3f6f93" strokeWidth={1.2 / s} />
    <path d="M-36 -54Q0 -44 36 -54" stroke={muted} strokeWidth={1 / s} fill="none" />
    {[-22, -8, 8, 22].map((fx, i) => <path key={fx} d={`M${fx - 4} ${-51 + Math.abs(fx) * .1}l4 8l4 -8z`} fill={['#f5a54a', '#8f6fc4', '#4f9a74', '#e8837a'][i]} />)}
  </g>
}
function Bin({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-16 -34L-13 0H13L16 -34Z" fill="#c9d3c2" stroke="#6b7a5f" strokeWidth={1.6 / s} />
    <rect x={-19} y={-40} width={38} height={7} rx="3" fill="#b3bfa9" stroke="#6b7a5f" strokeWidth={1.4 / s} />
    <path d="M-6 -28L-5 -6M0 -28V-6M6 -28L5 -6" stroke="#6b7a5f" strokeWidth={1.2 / s} />
  </g>
}
function Lorry({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-28} y={-30} width={36} height={22} rx="3" fill="#f3e4cf" stroke="#a58a6a" strokeWidth={1.5 / s} />
    <path d="M8 -8V-24H18L26 -16V-8Z" fill="#7fb0d4" stroke="#3f6f93" strokeWidth={1.5 / s} />
    {[-18, 16].map(cx => <circle key={cx} cx={cx} cy={-6} r="5" fill="#4a4540" />)}
  </g>
}
function Shop({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-24} y={-30} width={48} height={30} rx="2" fill="#f7f1e6" stroke="#a58a6a" strokeWidth={1.5 / s} />
    <path d="M-28 -30L-24 -40H24L28 -30Z" fill="#e8837a" stroke="#b4524a" strokeWidth={1.4 / s} />
    <path d="M-12 -40L-14 -30M0 -40V-30M12 -40L14 -30" stroke="white" strokeWidth={3 / s} />
    <rect x={-6} y={-18} width={12} height={18} fill="#cfd8df" stroke="#a58a6a" strokeWidth={1.2 / s} />
  </g>
}
function Plug({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-22 -4Q-22 -16 -10 -16" stroke={ink} strokeWidth={2.4 / s} fill="none" />
    <rect x={-10} y={-26} width={22} height={20} rx="5" fill="white" stroke={ink} strokeWidth={1.6 / s} />
    <path d="M12 -21H20M12 -11H20" stroke={ink} strokeWidth={2.4 / s} />
    <path d="M-2 -21l-3 6h5l-3 6" stroke={amber} strokeWidth={1.6 / s} fill="none" />
  </g>
}

// ---------- Section 1: what a carbon footprint is ----------
function Meaning() {
  const chip = (x: number, y: number, text: string, w: number) => <g><rect x={x - w / 2} y={y - 14} width={w} height={26} rx="13" fill="white" stroke={muted} strokeWidth="1.5" /><text x={x} y={y + 4} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{text}</text></g>
  return <Diagram title="A carbon footprint: the carbon dioxide and other greenhouse gases, such as methane, released over the full life of something, from being made, to being used, to being thrown away.">
    <Co2 x={236} y={80} r={17} /><Co2 x={272} y={56} r={21} /><Co2 x={306} y={84} r={15} />
    <Methane x={206} y={112} r={10} /><Methane x={336} y={112} r={10} />
    <Lines x={332} y={50} lines={['carbon dioxide']} colour={purpleInk} />
    <Lines x={192} y={117} anchor="end" lines={['methane']} size={13} colour={purpleInk} weight={600} />
    <Feet x={270} y={176} s={.95} />
    <path d="M132 150A140 96 0 1 0 408 150" stroke={muted} strokeWidth="2.2" fill="none" strokeDasharray="7 6" />
    <Arrow from={[404, 160]} to={[410, 140]} colour={muted} width={2.2} />
    {chip(100, 136, 'made', 64)}{chip(270, 250, 'used', 60)}{chip(442, 126, 'thrown away', 104)}
    <text x={392} y={244} fontSize="13" fontWeight="600" fill={muted}>its full life</text>
    <Caption text="carbon footprint = greenhouse gases released" />
  </Diagram>
}
function Things() {
  const tiles = [
    { x: 20, name: 'a service', eg: 'the school bus', art: <Bus x={100} y={168} s={1.05} /> },
    { x: 190, name: 'an event', eg: 'a sports festival', art: <Stadium x={270} y={172} s={1.05} /> },
    { x: 360, name: 'a product', eg: 'a toaster', art: <Toaster x={440} y={172} s={1.25} /> },
  ]
  return <Diagram title="A carbon footprint can be worked out for a service, such as the school bus, an event, such as a sports festival, or a product, such as a toaster.">
    {tiles.map(t => <g key={t.x}>
      <Panel x={t.x} y={40} w={160} h={200} />
      <Foot x={t.x + 138} y={80} s={.42} rot={10} />
      {t.art}
      <text x={t.x + 80} y={206} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{t.name}</text>
      <text x={t.x + 80} y={226} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>{t.eg}</text>
    </g>)}
    <Caption y={276} text="Almost anything has a carbon footprint" />
  </Diagram>
}
const STOPS: { a: number; name: string; ask: boolean; lx: number; ly: number; anchor: 'start' | 'middle' | 'end' }[] = [
  { a: -140, name: 'make', ask: false, lx: 0, ly: -38, anchor: 'middle' },
  { a: -40, name: 'transport', ask: true, lx: 0, ly: -38, anchor: 'middle' },
  { a: 20, name: 'sell', ask: true, lx: 0, ly: 50, anchor: 'middle' },
  { a: 90, name: 'use', ask: false, lx: 34, ly: 6, anchor: 'start' },
  { a: 160, name: 'throw away', ask: true, lx: 0, ly: 50, anchor: 'middle' },
]
const stopAt = (a: number): Pt => [r1(270 + 186 * Math.cos(a * Math.PI / 180)), r1(146 + 84 * Math.sin(a * Math.PI / 180))]
function Tricky() {
  const icon = (i: number, [x, y]: Pt) => [<Works key={i} x={x - 3} y={y + 16} s={.55} />, <Lorry key={i} x={x} y={y + 13} s={.9} />, <Shop key={i} x={x} y={y + 16} s={.8} />, <Plug key={i} x={x} y={y + 16} s={.95} />, <Bin key={i} x={x} y={y + 16} s={.75} />][i]
  return <Diagram title="A toaster is made, transported, sold, used and thrown away. Every step releases some greenhouse gases, so the total is too hard to count exactly.">
    <path d={`M${stopAt(-140).join(' ')}A186 84 0 1 1 ${stopAt(160).join(' ')}`} fill="none" stroke={muted} strokeWidth="2" strokeDasharray="7 6" />
    {[-90, 55, 125].map(a => { const [x, y] = stopAt(a), [x2, y2] = stopAt(a + 4); return <Arrow key={a} from={[x, y]} to={[x2, y2]} colour={muted} width={2} /> })}
    <Toaster x={270} y={176} s={1.4} />
    {STOPS.map((st, i) => { const [x, y] = stopAt(st.a); return <g key={st.name}>
      <circle cx={x} cy={y} r={28} fill="white" stroke={panelLine} strokeWidth="2" />
      {icon(i, [x, y])}
      <Co2 x={x + 26} y={y - 24} r={9} />
      {st.ask && <text x={x + 26} y={y - 20} textAnchor="middle" fontSize="13" fontWeight="700" fill={purpleInk}>?</text>}
      <text x={x + st.lx} y={y + st.ly} textAnchor={st.anchor} fontSize="14" fontWeight="700" fill={ink}>{st.name}</text>
    </g> })}
    <Caption text="Too many steps to count exactly" />
  </Diagram>
}
function Rough() {
  return <Diagram title="A rough calculation for one journey per person: going by car releases the most greenhouse gases, by bus less, by train the least. The biggest can then be avoided.">
    <Lines x={270} y={30} anchor="middle" lines={['same journey, one person']} size={13} weight={600} colour={muted} />
    <Co2 x={96} y={82} r={20} /><Co2 x={130} y={70} r={22} /><Co2 x={112} y={112} r={19} />
    <Co2 x={258} y={104} r={17} /><Co2 x={286} y={96} r={14} />
    <Co2 x={430} y={112} r={11} />
    <ellipse cx={114} cy={90} rx={62} ry={50} fill="none" stroke={amber} strokeWidth="2.6" strokeDasharray="8 5" />
    <Lines x={186} y={62} lines={['biggest:', 'avoid it']} colour={amber} />
    <Car x={114} y={206} s={1.7} />
    <Bus x={272} y={206} s={.95} />
    <Train x={430} y={206} s={.9} />
    {[['by car', 114], ['by bus', 272], ['by train', 430]].map(([t, x]) => <text key={t} x={x} y={232} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{t}</text>)}
    <Caption y={276} text="A rough calculation is enough to find the biggest" />
  </Diagram>
}

// ---------- Section 2: reducing a footprint ----------
function ReduceAim() {
  return <Diagram title="Reducing a carbon footprint: a large footprint with many greenhouse gas puffs becomes a smaller footprint with fewer puffs, because less greenhouse gas is released.">
    <Co2 x={110} y={70} r={18} /><Co2 x={146} y={56} r={20} /><Co2 x={180} y={76} r={16} /><Co2 x={130} y={100} r={15} />
    <Feet x={146} y={188} s={1.25} />
    <Arrow from={[236, 160]} to={[318, 160]} width={3.5} />
    <text x={277} y={140} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>release less</text>
    <Co2 x={384} y={100} r={13} />
    <Feet x={384} y={186} s={.72} />
    <Arrow from={[424, 84]} to={[424, 128]} colour={purple} width={3} />
    <Lines x={438} y={100} lines={['fewer', 'greenhouse', 'gases']} size={13} weight={600} colour={purpleInk} />
    <Caption y={284} text="To reduce a footprint, release less greenhouse gas" />
  </Diagram>
}
function Capture() {
  return <Diagram title="Carbon capture and storage: carbon dioxide from a power station chimney is caught before it reaches the atmosphere and piped deep underground to be stored.">
    <rect x={4} y={4} width={532} height={168} rx="12" fill={sky} />
    <Cloud x={430} y={52} s={.7} />
    <path d="M4 168H536V252Q536 296 520 296H20Q4 296 4 252Z" fill="#efe3cf" />
    <path d="M4 196Q140 190 270 200T536 194V296H4Z" fill="#e6d8c2" />
    <path d="M4 236Q150 230 270 240T536 232V280Q536 296 520 296H20Q4 296 4 280Z" fill="#d9c9b0" />
    <path d="M4 168H536" stroke="#b39463" strokeWidth="2" />
    {[[60, 162], [520, 164], [380, 160]].map(([x, y]) => <path key={x} d={`M${x} ${y}q4 -12 8 0M${x + 6} ${y}q3 -9 7 0`} stroke={leafLine} strokeWidth="2" fill="none" />)}
    <Works x={96} y={168} s={1.25} />
    <Co2 x={118} y={70} r={11} /><Co2 x={146} y={58} r={10} />
    <path d="M124 76Q150 56 176 70" stroke={purple} strokeWidth="2.4" fill="none" strokeDasharray="4 5" />
    <rect x={180} y={50} width={96} height={48} rx="14" fill={purpleFill} stroke={purple} strokeWidth="2" />
    <text x={228} y={79} textAnchor="middle" fontSize="15" fontWeight="700" fill={purpleInk}>capture</text>
    <path d="M228 98V168V262H300" stroke="#8b96a0" strokeWidth="9" fill="none" /><path d="M228 98V262H300" stroke="#c3cad0" strokeWidth="5" fill="none" />
    <Arrow from={[240, 150]} to={[240, 208]} colour={purple} width={2.4} />
    <ellipse cx={354} cy={262} rx={64} ry={20} fill={purpleFill} stroke={purple} strokeWidth="2" />
    {[[320, 262], [338, 254], [356, 266], [372, 256], [390, 264], [346, 272], [364, 250]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4.5" fill={purple} />)}
    <Lines x={428} y={252} lines={['stored deep', 'underground']} colour={purpleInk} />
    <Lines x={334} y={112} lines={['kept out of', 'the atmosphere']} size={13} weight={600} colour={muted} />
    <Lines x={260} y={190} lines={['piped down']} size={13} weight={600} colour={muted} />
  </Diagram>
}
function Less() {
  return <Diagram title="Two ways to release less: processes that use less energy, so less fuel is burned, and processes that make less waste, so less methane is released as waste decomposes.">
    <Panel x={20} y={30} w={240} h={214} />
    <Panel x={280} y={30} w={240} h={214} />
    {/* less energy: a bulb and a low meter */}
    <path d="M104 118a26 26 0 1 1 30 0v12h-30z" fill="#fbf0c8" stroke={sunLine} strokeWidth="2" />
    <rect x={104} y={132} width={30} height={12} rx="4" fill="#cfd8df" stroke={buildLine} strokeWidth="1.5" />
    <path d="M112 116q7 -12 14 0" stroke={sunLine} strokeWidth="1.8" fill="none" />
    <path d="M160 140a26 26 0 0 1 52 0" fill="white" stroke={ink} strokeWidth="2" />
    <path d="M160 140a26 26 0 0 1 12 -22" stroke={good} strokeWidth="5" fill="none" />
    <path d="M186 140L168 126" stroke={ink} strokeWidth="2.6" /><circle cx={186} cy={140} r="3.5" fill={ink} />
    <Lines x={140} y={190} anchor="middle" lines={['less energy']} size={16} />
    <Lines x={140} y={212} anchor="middle" lines={['less fuel burned']} size={13} weight={600} colour={muted} />
    <Tick x={234} y={56} />
    {/* less waste: a small bin, a tiny methane puff */}
    <Bin x={384} y={150} s={1.1} />
    <Methane x={414} y={96} r={10} />
    <text x={430} y={100} fontSize="13" fontWeight="600" fill={purpleInk}>methane</text>
    <Lines x={400} y={190} anchor="middle" lines={['less waste']} size={16} />
    <Lines x={400} y={212} anchor="middle" lines={['less methane from rotting']} size={13} weight={600} colour={muted} />
    <Tick x={494} y={56} />
    <Caption y={280} text="Use less energy and make less waste" />
  </Diagram>
}
function Rules() {
  const factories = [312, 380, 448]
  return <Diagram title="Government rules: a tax on greenhouse gases released encourages less polluting processes. A cap limits total emissions, and companies can sell licences for emissions up to the cap.">
    <Panel x={20} y={24} w={210} h={228} />
    <Panel x={250} y={24} w={270} h={228} />
    <text x={125} y={52} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>tax</text>
    <Co2 x={72} y={98} r={16} />
    <Arrow from={[98, 98]} to={[146, 98]} width={2.4} />
    <circle cx={172} cy={98} r="20" fill={amberFill} stroke={amber} strokeWidth="2" /><text x={172} y={105} textAnchor="middle" fontSize="19" fontWeight="700" fill={amber}>£</text>
    <Lines x={125} y={140} anchor="middle" lines={['pay for gases released']} size={13} weight={600} colour={muted} />
    <Co2 x={72} y={188} r={20} />
    <Arrow from={[104, 188]} to={[148, 188]} width={2.4} />
    <Co2 x={174} y={190} r={11} />
    <Lines x={125} y={234} anchor="middle" lines={['so they release less']} size={13} weight={600} colour={muted} />
    <text x={385} y={52} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>cap and licences</text>
    <path d="M270 96H500" stroke={red} strokeWidth="3" strokeDasharray="10 6" />
    <text x={500} y={86} textAnchor="end" fontSize="14" fontWeight="700" fill={red}>cap</text>
    {factories.map((x, i) => <g key={x}><Works x={x} y={206} s={.8} /><Co2 x={x + 13} y={i === 1 ? 128 : 134} r={i === 1 ? 10 : 8} /></g>)}
    <g transform="translate(330 150) rotate(-8)"><rect x={0} y={0} width={34} height={24} rx="4" fill="white" stroke={ink} strokeWidth="1.6" /><path d="M6 8H28M6 15H20" stroke={muted} strokeWidth="1.6" /></g>
    <Curve from={[340, 180]} via={[354, 212]} to={[382, 186]} width={2} />
    <Lines x={385} y={234} anchor="middle" lines={['licences can be sold']} size={13} weight={600} colour={muted} />
  </Diagram>
}
function Turbine({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 4} ${y}L${x - 2} ${y - 96}H${x + 2}L${x + 4} ${y}Z`} fill="#eef2f5" stroke={buildLine} strokeWidth="1.5" />
    {[0, 120, 240].map(a => <path key={a} transform={`rotate(${a + 15} ${x} ${y - 98})`} d={`M${x} ${y - 98}C${x + 5} ${y - 112} ${x + 4} ${y - 132} ${x} ${y - 142}C${x - 3} ${y - 128} ${x - 3} ${y - 110} ${x} ${y - 98}Z`} fill="white" stroke={buildLine} strokeWidth="1.5" />)}
    <circle cx={x} cy={y - 98} r="4" fill="#cfd8df" stroke={buildLine} strokeWidth="1.4" /></g>
}
function Solar({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 30} ${y - 24}L${x - 18} ${y - 56}H${x + 34}L${x + 22} ${y - 24}Z`} fill="#c7dcef" stroke="#3f6f93" strokeWidth="1.6" />
    <path d={`M${x - 24} ${y - 40}H${x + 28}M${x - 1} ${y - 56}L${x - 7} ${y - 24}M${x + 16} ${y - 56}L${x + 10} ${y - 24}`} stroke="#3f6f93" strokeWidth="1.2" />
    <path d={`M${x} ${y - 24}V${y}`} stroke={buildLine} strokeWidth="3" /></g>
}
function Nuclear({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 26} ${y}Q${x - 18} ${y - 34} ${x - 22} ${y - 64}H${x + 22}Q${x + 18} ${y - 34} ${x + 26} ${y}Z`} fill="#e7ebee" stroke={buildLine} strokeWidth="1.6" />
    <rect x={x + 24} y={y - 26} width={30} height={26} rx="3" fill={build} stroke={buildLine} strokeWidth="1.5" /><path d={`M${x + 28} ${y - 26}a11 11 0 0 1 22 0`} fill={build} stroke={buildLine} strokeWidth="1.5" />
    {[-10, 4].map(d => <path key={d} d={`M${x + d} ${y - 70}q-6 -8 0 -16t0 -16`} stroke={water} strokeWidth="2.4" fill="none" opacity=".8" />)}</g>
}
function Clean() {
  return <Diagram title="Cleaner energy: wind turbines, solar panels and nuclear power stations can be used instead of power stations that burn fossil fuels, which release carbon dioxide.">
    <path d="M14 214Q180 204 350 214" stroke={leafLine} strokeWidth="2" fill="none" />
    <Sun x={150} y={44} r={16} />
    <Turbine x={60} y={212} />
    <Solar x={150} y={212} />
    <Nuclear x={262} y={212} />
    {[['wind', 60], ['solar', 150], ['nuclear', 272]].map(([t, x]) => <text key={t} x={x} y={238} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{t}</text>)}
    <path d="M364 30V250" stroke={panelLine} strokeWidth="1.6" strokeDasharray="4 5" />
    <g opacity=".75">
      <Works x={440} y={212} s={1.3} />
      <Co2 x={462} y={98} r={13} /><Co2 x={484} y={78} r={16} /><Co2 x={506} y={56} r={12} />
    </g>
    <Cross x={450} y={150} r={34} />
    <text x={450} y={238} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>fossil fuels</text>
    <Caption y={280} text="Renewable or nuclear energy instead of fossil fuels" />
  </Diagram>
}

// ---------- Section 3: why it is still difficult ----------
function HardIntro() {
  const steps = Array.from({ length: 6 }, (_, i) => [150 + i * 50, 240 - i * 26] as Pt)
  const d = `M40 240H150` + steps.map(([x, y]) => `V${y - 26}H${x + 50}`).join('') + `V240Z`
  return <Diagram title="Reducing emissions is not simple: a person climbs a flight of steps towards a smaller footprint.">
    <path d={d} fill="#eef3f6" stroke={panelLine} strokeWidth="2" />
    <path d={`M40 240H500`} stroke={muted} strokeWidth="2" />
    <Person x={226} y={188} s={.95} arms="reach" />
    <Feet x={414} y={58} s={.45} />
    <path d="M444 84V36" stroke={muted} strokeWidth="2" /><path d="M444 36L466 43L444 50Z" fill={good} stroke={good} strokeWidth="1.2" />
    <Lines x={420} y={20} anchor="middle" lines={['smaller footprint']} size={13} weight={600} colour={muted} />
    <text x={60} y={80} fontSize="24" fontWeight="700" fill={ink}>not simple</text>
    <Caption y={280} text="Several things make it difficult" />
  </Diagram>
}
function HardTech() {
  return <Diagram title="New technology that releases less carbon dioxide is still being developed: a half-built machine on a laboratory bench.">
    <rect x={70} y={214} width={400} height={14} rx="5" fill="#d9c9b0" stroke="#a58a6a" strokeWidth="1.6" />
    <path d="M92 228V272M448 228V272" stroke="#a58a6a" strokeWidth="6" />
    {/* the finished half */}
    <rect x={170} y={120} width={96} height={94} rx="14" fill="#e4e9ee" stroke={buildLine} strokeWidth="2" />
    <circle cx={218} cy={160} r="20" fill="white" stroke={buildLine} strokeWidth="2" />
    <path d="M218 160L230 150" stroke={ink} strokeWidth="2.4" />
    <path d="M198 120V96H240" stroke="#8b96a0" strokeWidth="7" fill="none" />
    {/* the unfinished half: dashed outline */}
    <rect x={266} y={120} width={96} height={94} rx="14" fill="none" stroke={buildLine} strokeWidth="2" strokeDasharray="8 7" />
    <circle cx={314} cy={168} r="16" fill="#f3e4cf" stroke={amber} strokeWidth="2" />
    {Array.from({ length: 8 }, (_, i) => { const a = i / 8 * Math.PI * 2; return <rect key={i} x={r1(314 + Math.cos(a) * 18 - 3)} y={r1(168 + Math.sin(a) * 18 - 3)} width="6" height="6" rx="1.5" fill="#f3e4cf" stroke={amber} strokeWidth="1.2" transform={`rotate(${i * 45} ${r1(314 + Math.cos(a) * 18)} ${r1(168 + Math.sin(a) * 18)})`} /> })}
    <path d="M392 208L424 190" stroke={muted} strokeWidth="6" /><circle cx={430} cy={186} r="9" fill={muted} /><path d="M432 176L436 190" stroke="white" strokeWidth="6" />
    <g transform="translate(300 56) rotate(-4)"><rect x={0} y={0} width={172} height={32} rx="10" fill={amberFill} stroke={amber} strokeWidth="1.8" /><text x={86} y={21} textAnchor="middle" fontSize="14" fontWeight="700" fill="#8a5f16">still being developed</text></g>
    <path d="M340 88L322 120" stroke={amber} strokeWidth="1.6" />
    <Caption y={290} text="New technology still needs a lot of work" />
  </Diagram>
}
function Flag({ x, y, colours }: { x: number; y: number; colours: [string, string] }) {
  return <g><path d={`M${x} ${y}V${y - 70}`} stroke={muted} strokeWidth="2.4" /><path d={`M${x} ${y - 70}Q${x + 20} ${y - 76} ${x + 42} ${y - 68}V${y - 44}Q${x + 20} ${y - 52} ${x} ${y - 46}Z`} fill={colours[0]} stroke={colours[1]} strokeWidth="1.5" /></g>
}
function HardEconomy() {
  return <Diagram title="A balance: on one side the economies of communities and people's well-being, on the other side cutting greenhouse gases. Two countries find it hard to agree.">
    <path d="M178 228L190 90H198L210 228Z" fill="#e4e9ee" stroke={buildLine} strokeWidth="1.6" />
    <rect x={146} y={226} width={96} height={12} rx="5" fill={build} stroke={buildLine} strokeWidth="1.6" />
    <path d="M70 92H318" stroke={ink} strokeWidth="4" /><circle cx={194} cy={92} r="6" fill={ink} />
    {[70, 318].map(x => <g key={x}><path d={`M${x} 92L${x - 40} 168M${x} 92L${x + 40} 168`} stroke={muted} strokeWidth="1.5" /><path d={`M${x - 50} 168H${x + 50}Q${x + 44} 184 ${x} 184Q${x - 44} 184 ${x - 50} 168Z`} fill={panelFill} stroke={buildLine} strokeWidth="1.8" /></g>)}
    {/* a small town on the left pan */}
    <path d="M42 166V148L54 138L66 148V166Z" fill="#f3e4cf" stroke="#a58a6a" strokeWidth="1.4" />
    <path d="M68 166V144L80 134L92 144V166Z" fill="#f3e4cf" stroke="#a58a6a" strokeWidth="1.4" />
    <Works x={104} y={166} s={.5} />
    <Lines x={70} y={206} anchor="middle" lines={['economies and', 'well-being']} size={14} />
    <Co2 x={318} y={146} r={18} />
    <Arrow from={[352, 132]} to={[352, 160]} colour={purple} width={2.4} />
    <Lines x={318} y={206} anchor="middle" lines={['cutting', 'emissions']} size={14} colour={purpleInk} />
    <path d="M384 30V250" stroke={panelLine} strokeWidth="1.6" strokeDasharray="4 5" />
    <Flag x={410} y={170} colours={['#e8837a', '#b4524a']} /><Flag x={474} y={170} colours={['#7fb0d4', '#3f6f93']} />
    <path d="M430 186Q450 200 480 186" stroke={muted} strokeWidth="2" strokeDasharray="4 4" fill="none" />
    <text x={452} y={66} textAnchor="middle" fontSize="22" fontWeight="700" fill={muted}>?</text>
    <Lines x={452} y={220} anchor="middle" lines={['hard to agree']} size={14} />
    <Caption y={284} text="Changes cost money, so countries worry" />
  </Diagram>
}
function Bicycle({ x, y }: { x: number; y: number }) {
  return <g stroke={ink} strokeWidth="2" fill="none"><circle cx={x - 20} cy={y - 14} r="14" /><circle cx={x + 20} cy={y - 14} r="14" />
    <path d={`M${x - 20} ${y - 14}L${x - 6} ${y - 36}H${x + 14}L${x + 20} ${y - 14}M${x - 6} ${y - 36}L${x + 2} ${y - 14}L${x + 14} ${y - 36}M${x - 10} ${y - 40}H${x - 2}M${x + 14} ${y - 36}L${x + 12} ${y - 44}H${x + 18}`} /></g>
}
function HardLifestyle() {
  return <Diagram title="Changing lifestyles is tricky: one person does not want to change, one does not understand why or how, and one has started cycling.">
    <Person x={110} y={200} arms="crossed" />
    <Person x={270} y={200} arms="shrug" colour={jumperB} />
    <Bubble x={302} y={80} w={100} text="why? how?" />
    <Bicycle x={452} y={200} />
    <Person x={410} y={200} arms="hold" colour={jumperC} />
    <path d="M40 202H500" stroke={muted} strokeWidth="2" />
    <Lines x={110} y={228} anchor="middle" lines={['does not', 'want to']} size={13} weight={600} colour={muted} />
    <Lines x={270} y={228} anchor="middle" lines={['does not', 'understand']} size={13} weight={600} colour={muted} />
    <Lines x={430} y={228} anchor="middle" lines={['has started', 'to change']} size={13} weight={600} colour={muted} />
    <Caption y={284} text="Changing lifestyles is tricky" />
  </Diagram>
}

// ---------- On your own: a bar chart of three trips ----------
function Trips() {
  const x0 = 110, y0 = 236, top = 40, max = 140, sc = (y0 - top) / max
  const bars: [string, number][] = [['Trip 1', 40], ['Trip 2', 120], ['Trip 3', 75]]
  return <Diagram schematic={false} viewBox="0 0 540 290" title="Bar chart of greenhouse gas released by three trips.">
    {Array.from({ length: 8 }, (_, i) => i * 20).map(v => { const y = r1(y0 - v * sc); return <g key={v}>
      {v > 0 && <path d={`M${x0} ${y}H500`} stroke="#e6edf2" strokeWidth="1.2" />}
      <path d={`M${x0 - 6} ${y}H${x0}`} stroke={ink} strokeWidth="1.6" />
      <text x={x0 - 10} y={y + 4} textAnchor="end" fontSize="12" fontWeight="600" fill={muted}>{v}</text>
    </g> })}
    {bars.map(([name, v], i) => { const x = 160 + i * 120, h = r1(v * sc); return <g key={name}>
      <rect x={x} y={r1(y0 - h)} width={70} height={h} rx="6" fill={purpleFill} stroke={purple} strokeWidth="2" />
      <text x={x + 35} y={y0 + 22} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{name}</text>
    </g> })}
    <path d={`M${x0} ${top - 10}V${y0}H504`} stroke={ink} strokeWidth="2" fill="none" />
    <text transform={`translate(34 ${(top + y0) / 2}) rotate(-90)`} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}><tspan x="0">Greenhouse gas released</tspan><tspan x="0" dy="17">in one year (kg)</tspan></text>
  </Diagram>
}

export function FootprintVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  if (focus === 'footprint-meaning') return <Meaning />
  if (focus === 'footprint-things') return <Things />
  if (focus === 'footprint-tricky') return <Tricky />
  if (focus === 'footprint-rough') return <Rough />
  if (focus === 'footprint-reduce-aim') return <ReduceAim />
  if (focus === 'footprint-capture') return <Capture />
  if (focus === 'footprint-less') return <Less />
  if (focus === 'footprint-rules') return <Rules />
  if (focus === 'footprint-clean') return <Clean />
  if (focus === 'footprint-hard-intro') return <HardIntro />
  if (focus === 'footprint-hard-tech') return <HardTech />
  if (focus === 'footprint-hard-economy') return <HardEconomy />
  if (focus === 'footprint-hard-lifestyle') return <HardLifestyle />
  if (focus === 'footprint-q-trips') return <Trips />
  return <Meaning />
}

// Shared with PollutionVisuals.tsx (Lesson 48).
export const footprintPalette = { ink, muted, faded, panelFill, panelLine, purple, purpleFill, purpleInk, yellow, sunLine, leafFill, leafLine, grass, smoke, smokeFill, sky, build, buildLine, water, waterFill, skin, skinLine, jumper, jumperB, jumperC, good, red, amber, amberFill, flameOut, flameIn, heatLine }
export { Diagram, Lines, Caption, Arrow, Curve, Panel, Tick, Cross, Puff, Co2, Sun, Cloud, Flame, Works, worksTop, Person, Bubble, Tree }
