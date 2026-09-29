import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry Lesson 51: Life cycle assessments. Original, code-native schematics; not to scale. Focus ids start with 'lca-'.
 *
 * One colour per LCA stage, the same here and in Lesson 52 (LcaCompareVisuals imports `lcaStages`):
 *   1 raw materials = soft blue, 2 manufacture and packaging = amber, 3 using the product = lilac, 4 product disposal = teal-grey.
 * Course colours: yellow = energy, purple = carbon dioxide / greenhouse gases, blue = water, green = plants. Grey clouds = other pollution.
 * The four stages sit in a ring (1 top, then clockwise). Stage frames show a small ring in the corner with the current stage bold.
 */
const { ink, muted, panelFill, panelLine } = atomPalette
export const lcaStages = [
  { n: 1, fill: '#dfeaf5', line: '#5a82ab', name: ['Raw materials'] },
  { n: 2, fill: '#fbe4c2', line: '#c07f26', name: ['Manufacture and', 'packaging'] },
  { n: 3, fill: '#ece3f7', line: '#8667b8', name: ['Using the', 'product'] },
  { n: 4, fill: '#d9ece9', line: '#4a8981', name: ['Product', 'disposal'] },
]
export const lcaInk = { ink, muted, panelFill, panelLine }
export const energy = '#f7d66b', energyLine = '#c3931b'
export const smoke = '#e3e7eb', smokeLine = '#98a4ae'
export const gas = '#e2d7f3', gasLine = '#8f6fc4'
const water = '#b9def0', waterLine = '#3f93bd'
const leaf = '#a9d4a0', leafLine = '#4f8f5a'
const ground = '#efe3cf', groundLine = '#b39463', groundDeep = '#e2d0b3'
const metal = '#e6eef4', metalLine = '#6f8fa6'
const rockFill = '#d8cfc2', rockLine = '#8d7f6b'
const flameOut = '#f5a54a', flameIn = '#fcd97d', heatLine = '#c8641e'
const faded = 0.32

type Pt = [number, number]
const r1 = (n: number) => Math.round(n * 10) / 10

export function Diagram({ title, children, viewBox = '0 0 600 320' }: { title: string; children: ReactNode; viewBox?: string }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{`${title} Original schematic, not to scale.`}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
export function Lines({ x, y, lines, anchor = 'start', size = 14, weight = 700, colour = ink }: { x: number; y: number; lines: string[]; anchor?: 'start' | 'middle' | 'end'; size?: number; weight?: number; colour?: string }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={colour}>{lines.map((l, i) => <tspan key={i} x={x} dy={i ? size + 3 : 0}>{l}</tspan>)}</text>
}
export function Caption({ text, x = 300, y = 308 }: { text: string; x?: number; y?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize="14" fontWeight="600" fill={muted}>{text}</text>
}
export function Arrow({ from, to, colour = ink, width = 2.4, dashed = false }: { from: Pt; to: Pt; colour?: string; width?: number; dashed?: boolean }) {
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]), h = 6 + width * 1.5
  const p = (d: number, s: number): Pt => [r1(to[0] - Math.cos(a) * d + Math.cos(a + Math.PI / 2) * s), r1(to[1] - Math.sin(a) * d + Math.sin(a + Math.PI / 2) * s)]
  const [b1, b2, base] = [p(h, h * .6), p(h, -h * .6), p(h * .7, 0)]
  return <g><path d={`M${from[0]} ${from[1]}L${base[0]} ${base[1]}`} stroke={colour} strokeWidth={width} fill="none" strokeDasharray={dashed ? '6 6' : undefined} /><path d={`M${to[0]} ${to[1]}L${b1[0]} ${b1[1]}L${b2[0]} ${b2[1]}Z`} fill={colour} stroke={colour} strokeWidth="1.2" /></g>
}
// A soft curved arrow: quadratic curve from → to, bending through the control point c.
export function CurveArrow({ from, c, to, colour = ink, width = 2.4, dashed = false }: { from: Pt; c: Pt; to: Pt; colour?: string; width?: number; dashed?: boolean }) {
  const a = Math.atan2(to[1] - c[1], to[0] - c[0]), h = 6 + width * 1.5
  const p = (d: number, s: number): Pt => [r1(to[0] - Math.cos(a) * d + Math.cos(a + Math.PI / 2) * s), r1(to[1] - Math.sin(a) * d + Math.sin(a + Math.PI / 2) * s)]
  const [b1, b2, base] = [p(h, h * .6), p(h, -h * .6), p(h * .7, 0)]
  return <g><path d={`M${from[0]} ${from[1]}Q${c[0]} ${c[1]} ${base[0]} ${base[1]}`} stroke={colour} strokeWidth={width} fill="none" strokeDasharray={dashed ? '6 6' : undefined} /><path d={`M${to[0]} ${to[1]}L${b1[0]} ${b1[1]}L${b2[0]} ${b2[1]}Z`} fill={colour} stroke={colour} strokeWidth="1.2" /></g>
}
export function Leader({ from, to, colour = ink }: { from: Pt; to: Pt; colour?: string }) {
  return <g><path d={`M${from[0]} ${from[1]}L${to[0]} ${to[1]}`} stroke={colour} strokeWidth="1.4" /><circle cx={to[0]} cy={to[1]} r="2.6" fill={colour} /></g>
}
export function Badge({ n, x, y, r = 12, on = true }: { n: number; x: number; y: number; r?: number; on?: boolean }) {
  const s = lcaStages[n - 1]
  return <g opacity={on ? 1 : faded}><circle cx={x} cy={y} r={r} fill={s.line} stroke="white" strokeWidth="2" /><text x={x} y={y + r * .4} textAnchor="middle" fontSize={r * 1.15} fontWeight="700" fill="white">{n}</text></g>
}

// ---------- Hand-drawn objects (drawn around a bottom-centre anchor) ----------
export function Bottle({ x, y, s = 1, fill = metal, line = metalLine }: { x: number; y: number; s?: number; fill?: string; line?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-10 0q-4 0 -4 -5V-40q0 -9 8 -14V-60h12V-54q8 5 8 14V-5q0 5 -4 5Z" fill={fill} stroke={line} strokeWidth={1.8 / s} />
    <rect x={-7.5} y={-68} width={15} height={9} rx={3} fill={line} />
    <path d="M-8 -38V-8" stroke="white" strokeWidth={3 / s} opacity=".8" />
  </g>
}
export function Cloud({ x, y, s = 1, fill = smoke, line = smokeLine }: { x: number; y: number; s?: number; fill?: string; line?: string }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M-30 12q-14 -1 -12 -13q3 -10 15 -8q3 -14 19 -13q13 1 16 12q12 -7 21 3q9 11 -3 19Z" fill={fill} stroke={line} strokeWidth={1.8 / s} />
}
export function Bolt({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M5 -20L-9 2H0L-5 20L11 -4H2L7 -20Z" fill={energy} stroke={energyLine} strokeWidth={1.6 / s} />
}
export function Rock({ x, y, s = 1, fill = rockFill, line = rockLine }: { x: number; y: number; s?: number; fill?: string; line?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-24 0q-5 -13 6 -20q9 -11 22 -5q13 1 17 13q4 8 -2 12Z" fill={fill} stroke={line} strokeWidth={1.8 / s} />
    <path d="M-10 -12q5 -3 9 1M6 -6q4 -2 7 1" stroke={line} strokeWidth={1.3 / s} fill="none" />
  </g>
}
export function Factory({ x, y, s = 1, fill = lcaStages[1].fill, line = lcaStages[1].line }: { x: number; y: number; s?: number; fill?: string; line?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M44 -48V-74q0 -3 3 -3h5q3 0 3 3V-48" fill={fill} stroke={line} strokeWidth={1.8 / s} />
    <path d="M0 0V-36L19 -48V-36L38 -48V-36L58 -50V0Z" fill={fill} stroke={line} strokeWidth={1.8 / s} />
    {[8, 26, 44].map(wx => <rect key={wx} x={wx} y={-26} width={8} height={9} rx={2} fill="white" stroke={line} strokeWidth={1.2 / s} />)}
    <path d="M22 0V-12h12V0" fill="white" stroke={line} strokeWidth={1.2 / s} />
  </g>
}
export function Person({ x, y, s = 1, fill = lcaStages[2].fill, line = lcaStages[2].line }: { x: number; y: number; s?: number; fill?: string; line?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-52} r={9} fill="#f6e3cf" stroke={line} strokeWidth={1.6 / s} />
    <path d="M-13 0V-26q0 -15 13 -15q13 0 13 15V0Z" fill={fill} stroke={line} strokeWidth={1.8 / s} />
  </g>
}
export function Bin({ x, y, s = 1, fill = lcaStages[3].fill, line = lcaStages[3].line }: { x: number; y: number; s?: number; fill?: string; line?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-16 -36h32l-3 34q0 2 -3 2h-20q-3 0 -3 -2Z" fill={fill} stroke={line} strokeWidth={1.8 / s} />
    <rect x={-20} y={-43} width={40} height={7} rx={3.5} fill={fill} stroke={line} strokeWidth={1.8 / s} />
    <path d="M-5 -43q0 -5 5 -5q5 0 5 5M-7 -29V-7M0 -29V-7M7 -29V-7" stroke={line} strokeWidth={1.4 / s} fill="none" />
  </g>
}
export function Flame({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0C-9 -4 -8 -14 -2 -22C-1 -15 4 -14 3 -20C9 -13 10 -4 0 0Z" fill={flameOut} stroke={heatLine} strokeWidth={1.4 / s} />
    <path d="M0 -3C-4 -6 -3 -11 0 -14C1 -10 4 -8 0 -3Z" fill={flameIn} />
  </g>
}
function Digger({ x, y }: { x: number; y: number }) {
  const { fill, line } = lcaStages[0]
  return <g transform={`translate(${x} ${y})`}>
    <rect x={-32} y={-11} width={54} height={11} rx={5.5} fill="#8795a3" stroke={line} strokeWidth="1.6" />
    {[-24, -12, 0, 12].map(cx => <circle key={cx} cx={cx} cy={-5.5} r={2.6} fill="white" />)}
    <path d="M-28 -12V-30q0 -3 3 -3h40q3 0 3 3V-12Z" fill={fill} stroke={line} strokeWidth="1.8" />
    <path d="M-24 -33V-50q0 -3 3 -3h14q3 0 3 3V-33" fill={fill} stroke={line} strokeWidth="1.8" />
    <rect x={-20} y={-49} width={12} height={10} rx={2} fill="white" stroke={line} strokeWidth="1.2" />
    <path d="M14 -26L36 -46L54 -22" stroke={line} strokeWidth="5" fill="none" />
    <path d="M47 -24q12 -3 15 7q-7 8 -17 2Z" fill="#8795a3" stroke={line} strokeWidth="1.6" />
  </g>
}
function Stump({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 8} ${y}l2 -12q6 -3 12 0l2 12Z`} fill="#c9a77c" stroke="#8a6440" strokeWidth="1.5" /><ellipse cx={x} cy={y - 12} rx={6} ry={2} fill="#e8d2ad" stroke="#8a6440" strokeWidth="1.2" /></g>
}
function Box({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-26 0V-34h52V0Z" fill="#ecd7b4" stroke="#a57b45" strokeWidth={1.8 / s} />
    <path d="M-26 -34l-6 -9h26l6 9M26 -34l6 -9h-26l-6 9" fill="#f3e3c7" stroke="#a57b45" strokeWidth={1.6 / s} />
    <path d="M-6 -34V-20h12V-34" fill="none" stroke="#a57b45" strokeWidth={1.3 / s} />
  </g>
}
function Lorry({ x, y }: { x: number; y: number }) {
  const { fill, line } = lcaStages[3]
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-66 -8V-40q0 -4 4 -4h54q4 0 4 4V-8Z" fill={fill} stroke={line} strokeWidth="1.8" />
    <path d="M-4 -8V-32h16q6 0 9 6l5 10V-8Z" fill={fill} stroke={line} strokeWidth="1.8" />
    <path d="M2 -28h9q3 0 5 4l3 6H2Z" fill="white" stroke={line} strokeWidth="1.2" />
    <path d="M-58 -44l6 -8l8 4l6 -6l8 5l6 -4l6 9" fill="#cdbfae" stroke={rockLine} strokeWidth="1.4" />
    {[-50, 10].map(cx => <g key={cx}><circle cx={cx} cy={-6} r={8} fill="#5f6f7c" /><circle cx={cx} cy={-6} r={3} fill="#dfe5ea" /></g>)}
  </g>
}
function Fish({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 16} ${y}q12 -11 24 0q-12 11 -24 0Z`} fill="#f2c37c" stroke="#b9791a" strokeWidth="1.5" /><path d={`M${x + 8} ${y}l9 -7v14Z`} fill="#f2c37c" stroke="#b9791a" strokeWidth="1.5" /><circle cx={x - 9} cy={y - 1.5} r={1.6} fill={ink} /></g>
}
function Weed({ x, y }: { x: number; y: number }) {
  return <g fill={leaf} stroke={leafLine} strokeWidth="1.5"><path d={`M${x} ${y}q-6 -14 0 -30`} fill="none" strokeWidth="2" /><path d={`M${x - 1} ${y - 10}q-12 -6 -10 -14q8 2 10 14Z`} /><path d={`M${x + 1} ${y - 20}q12 -6 10 -14q-8 2 -10 14Z`} /></g>
}

// ---------- The ring of four stages ----------
const ringArc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const pt = (a: number): Pt => [r1(cx + r * Math.cos(a)), r1(cy + r * Math.sin(a))]
  const mid = (a0 + a1) / 2, k = 1 / Math.cos((a1 - a0) / 2)
  return { from: pt(a0), c: [r1(cx + r * k * Math.cos(mid)), r1(cy + r * k * Math.sin(mid))] as Pt, to: pt(a1) }
}
// Small ring for the stage frames: the current stage is bold, the others faded.
function MiniRing({ active, cx = 515, cy = 82 }: { active: number; cx?: number; cy?: number }) {
  const R = 40, angles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI]
  const s = lcaStages[active - 1]
  return <g>
    <circle cx={cx} cy={cy} r={R} fill="none" stroke={panelLine} strokeWidth="1.2" />
    {angles.map((a, i) => { const arc = ringArc(cx, cy, R, a + .5, a + Math.PI / 2 - .5); return <CurveArrow key={i} {...arc} colour={muted} width={1.6} /> })}
    {angles.map((a, i) => <Badge key={i} n={i + 1} x={r1(cx + R * Math.cos(a))} y={r1(cy + R * Math.sin(a))} r={i + 1 === active ? 17 : 13} on={i + 1 === active} />)}
    <Lines x={cx} y={cy + 76} anchor="middle" lines={[`Stage ${active}:`, ...s.name]} size={14} colour={s.line} />
  </g>
}
const PANELS: Pt[] = [[195, 18], [370, 128], [195, 238], [20, 128]]
function StageIcon({ n, x, y }: { n: number; x: number; y: number }) {
  if (n === 1) return <g><Rock x={x - 4} y={y} s={.9} /><Rock x={x + 14} y={y} s={.5} /></g>
  if (n === 2) return <Factory x={x - 22} y={y} s={.72} />
  if (n === 3) return <g><Person x={x - 6} y={y} s={.78} /><Bottle x={x + 12} y={y - 10} s={.42} /></g>
  return <Bin x={x} y={y} s={.9} />
}
function BigRing({ mode }: { mode: 'four' | 'cycle' | 'question' }) {
  const effects = ['energy, damage', 'energy, waste', 'fuel, lifespan', 'landfill, burning']
  return <g>
    <CurveArrow from={[409, 60]} c={[475, 60]} to={[475, 122]} colour={muted} />
    <CurveArrow from={[475, 216]} c={[475, 280]} to={[411, 280]} colour={muted} />
    <CurveArrow from={[191, 280]} c={[125, 280]} to={[125, 218]} colour={muted} />
    <CurveArrow from={[125, 124]} c={[125, 60]} to={[189, 60]} colour={muted} />
    {PANELS.map(([x, y], i) => { const s = lcaStages[i]; return <g key={i}>
      <rect x={x} y={y} width={210} height={84} rx={22} fill={s.fill} stroke={s.line} strokeWidth="2" />
      {mode !== 'question' && <Badge n={i + 1} x={x + 22} y={y + 22} r={12} />}
      {mode === 'question' && <text x={x + 105} y={y + 54} textAnchor="middle" fontSize="30" fontWeight="700" fill={s.line}>{i + 1}</text>}
      {mode !== 'question' && <g>
        <StageIcon n={i + 1} x={x + 46} y={y + 74} />
        <Lines x={x + 76} y={y + (s.name.length > 1 ? 30 : 38)} lines={s.name} size={14} colour={ink} />
        {mode === 'cycle' && <text x={x + 76} y={y + 72} fontSize="13" fontWeight="600" fill={s.line}>{effects[i]}</text>}
      </g>}
    </g> })}
    {mode === 'cycle'
      ? <g><ellipse cx={300} cy={172} rx={70} ry={46} fill="white" stroke={panelLine} strokeWidth="1.6" /><Lines x={300} y={160} anchor="middle" lines={['total', 'environmental', 'cost']} size={14} /></g>
      : <Bottle x={300} y={204} s={1.1} />}
  </g>
}
function Ring({ mode }: { mode: 'four' | 'cycle' | 'question' }) {
  const title = mode === 'question'
    ? 'A ring of four numbered stages joined by arrows, in order from 1 to 4.'
    : mode === 'four'
      ? 'The four stages of a life cycle assessment in a ring: 1 raw materials, 2 manufacture and packaging, 3 using the product, 4 product disposal.'
      : 'The whole life cycle. Stage 1 raw materials uses energy and can damage the environment. Stage 2 manufacture uses energy and makes waste. Stage 3 using the product may burn fuel, and how long it lasts matters. Stage 4 disposal means landfill or burning. An LCA adds these up to give the total environmental cost.'
  return <Diagram viewBox="0 0 600 340" title={title}><BigRing mode={mode} /></Diagram>
}

// ---------- Section 1: what an LCA is ----------
function Whole() {
  const rx = 170, ry = 96, cx = 300, cy = 186
  const pt = (deg: number): Pt => [r1(cx + rx * Math.cos(deg * Math.PI / 180)), r1(cy + ry * Math.sin(deg * Math.PI / 180))]
  const segs = [[152, 208], [222, 258], [282, 318], [332, 388]]
  return <Diagram title="A drinks bottle in the middle of a loop that runs from the ground, through the factory and being used, to the bin. A life cycle assessment (LCA) looks at every stage of its life. Impact means effect on the environment.">
    <Lines x={300} y={34} anchor="middle" lines={['life cycle assessment (LCA)']} size={17} />
    {segs.map(([a, b], i) => { const [p0, p1, pm] = [pt(a), pt(b), pt((a + b) / 2)]; const k = 1 / Math.cos((b - a) * Math.PI / 360); return <CurveArrow key={i} from={p0} c={[r1(cx + (pm[0] - cx) * k), r1(cy + (pm[1] - cy) * k)]} to={p1} colour={muted} width={2} dashed /> })}
    <Rock x={pt(146)[0]} y={pt(146)[1] + 12} />
    <Factory x={pt(215)[0] - 28} y={pt(215)[1] + 16} s={.8} />
    <g><Person x={pt(325)[0] - 6} y={pt(325)[1] + 20} s={.8} /><Bottle x={pt(325)[0] + 12} y={pt(325)[1] + 8} s={.4} /></g>
    <Bin x={pt(34)[0]} y={pt(34)[1] + 14} />
    <Lines x={pt(146)[0]} y={pt(146)[1] + 34} anchor="middle" lines={['from the ground']} size={13} weight={600} colour={lcaStages[0].line} />
    <Lines x={pt(34)[0]} y={pt(34)[1] + 36} anchor="middle" lines={['to the bin']} size={13} weight={600} colour={lcaStages[3].line} />
    <Lines x={300} y={80} anchor="middle" lines={['every stage of its life']} size={14} weight={600} colour={muted} />
    <Bottle x={300} y={236} s={1.45} />
    <Caption text="impact = effect on the environment" />
  </Diagram>
}
function Office({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M0 0V-150q0 -8 8 -8h104q8 0 8 8V0Z" fill={panelFill} stroke={muted} strokeWidth="1.8" />
    {[0, 1, 2, 3].map(r => [0, 1, 2].map(c => <rect key={`${r}${c}`} x={16 + c * 32} y={-140 + r * 28} width={22} height={16} rx={4} fill="#e4eef5" stroke={muted} strokeWidth="1.2" />))}
    <path d="M46 0V-22q0 -6 6 -6h16q6 0 6 6V0" fill="#e4eef5" stroke={muted} strokeWidth="1.4" />
  </g>
}
function Why() {
  const rows = [{ n: 1, t: 'the ground' }, { n: 2, t: 'the factory' }, { n: 3, t: 'using it' }, { n: 4, t: 'the bin' }]
  return <Diagram title="A company with a new drinks bottle. Beside it a checklist counts the ground, the factory, using it and the bin: the total environmental cost, not only the factory.">
    <Office x={36} y={266} />
    <path d="M168 232h118M180 232v34M274 232v34" stroke={muted} strokeWidth="3" fill="none" />
    <Bottle x={226} y={230} s={.9} />
    <rect x={196} y={140} width={62} height={24} rx={12} fill={energy} stroke={energyLine} strokeWidth="1.5" />
    <text x={227} y={157} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>new!</text>
    <rect x={330} y={36} width={240} height={236} rx={20} fill="white" stroke={panelLine} strokeWidth="1.8" />
    <Lines x={450} y={66} anchor="middle" lines={['total environmental cost']} size={15} />
    {rows.map((r, i) => { const s = lcaStages[i], y = 84 + i * 45; return <g key={i}>
      <rect x={346} y={y} width={208} height={36} rx={18} fill={s.fill} stroke={s.line} strokeWidth="1.4" />
      <Badge n={r.n} x={366} y={y + 18} r={10} />
      <text x={386} y={y + 23} fontSize="14" fontWeight="700" fill={ink}>{r.t}</text>
      <path d={`M${524} ${y + 18}l6 7l12 -14`} stroke="#4f9a74" strokeWidth="3" fill="none" />
    </g> })}
    <Caption text="Count the whole life, not just the factory" />
  </Diagram>
}

// ---------- Section 2: stages 1 and 2 ----------
function Raw() {
  return <Diagram title="Stage 1, raw materials: a digger extracts rock from a pit in the ground. This uses energy, can cause pollution and can damage the local environment.">
    <path d="M20 174Q80 166 128 172L156 172Q172 238 238 240Q300 240 316 174L434 170V296H20Z" fill={ground} stroke={groundLine} strokeWidth="1.8" />
    <path d="M156 172Q172 238 238 240Q300 240 316 174Z" fill={groundDeep} stroke={groundLine} strokeWidth="1.2" strokeDasharray="4 5" />
    <Stump x={52} y={172} /><Stump x={92} y={170} /><Stump x={128} y={172} />
    <Lines x={24} y={134} lines={['can damage the', 'local environment']} size={14} />
    <Digger x={216} y={236} />
    <Rock x={360} y={172} s={.9} /><Rock x={390} y={172} s={.7} /><Rock x={374} y={156} s={.6} />
    <Bolt x={214} y={116} s={1.1} />
    <Lines x={236} y={122} lines={['uses energy']} colour={energyLine} />
    <Cloud x={354} y={96} s={1.1} />
    <Lines x={354} y={62} anchor="middle" lines={['can cause pollution']} />
    <Lines x={227} y={278} anchor="middle" lines={['extracted from the ground']} size={15} />
    <MiniRing active={1} />
  </Diagram>
}
function Process() {
  return <Diagram title="Stage 1, processing: a raw material goes through a machine and comes out as a useful material. This needs lots of energy, for example extracting a metal from its ore or separating crude oil by fractional distillation.">
    <Rock x={70} y={196} s={1.4} />
    <Lines x={70} y={224} anchor="middle" lines={['raw material']} size={14} />
    <Arrow from={[112, 176]} to={[160, 176]} />
    <path d="M168 220V142q0 -12 12 -12h92q12 0 12 12V220Z" fill={lcaStages[0].fill} stroke={lcaStages[0].line} strokeWidth="2" />
    <path d="M196 130l-8 -18h76l-8 18" fill="white" stroke={lcaStages[0].line} strokeWidth="1.8" />
    {[200, 226, 252].map(cx => <g key={cx}><circle cx={cx} cy={176} r={9} fill="white" stroke={lcaStages[0].line} strokeWidth="1.8" /><path d={`M${cx - 6} ${176}h12M${cx} ${170}v12`} stroke={lcaStages[0].line} strokeWidth="1.4" /></g>)}
    <rect x={160} y={220} width={132} height={8} rx={4} fill="#b8c7d4" />
    <Bolt x={226} y={80} s={1.2} />
    <Lines x={248} y={86} lines={['lots of energy']} colour={energyLine} />
    <Arrow from={[292, 176]} to={[336, 176]} />
    <rect x={344} y={150} width={70} height={16} rx={5} fill={metal} stroke={metalLine} strokeWidth="1.8" />
    <path d="M344 196h62a8 11 0 0 1 0 22h-62a8 11 0 0 1 0 -22Z" fill={metal} stroke={metalLine} strokeWidth="1.8" />
    <ellipse cx={344} cy={207} rx={8} ry={11} fill="white" stroke={metalLine} strokeWidth="1.6" />
    <Lines x={380} y={244} anchor="middle" lines={['useful material']} size={14} />
    <rect x={40} y={262} width={176} height={28} rx={14} fill={panelFill} stroke={panelLine} strokeWidth="1.4" />
    <text x={128} y={281} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>e.g. a metal from its ore</text>
    <rect x={228} y={262} width={206} height={28} rx={14} fill={panelFill} stroke={panelLine} strokeWidth="1.4" />
    <text x={331} y={281} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>e.g. crude oil by distillation</text>
    <MiniRing active={1} />
  </Diagram>
}
function Make() {
  return <Diagram title="Stage 2, manufacture and packaging: a factory makes bottles and packs them in boxes. It uses energy and other resources and can cause pollution.">
    <Factory x={40} y={250} s={1.9} />
    <Cloud x={140} y={84} s={1.05} />
    <Lines x={184} y={70} lines={['pollution']} />
    <Bolt x={276} y={120} s={1.1} />
    <Lines x={296} y={112} lines={['energy and other', 'resources']} colour={energyLine} />
    <path d="M150 250h214" stroke={muted} strokeWidth="3" />
    {[172, 214, 256, 298, 340].map(cx => <circle key={cx} cx={cx} cy={256} r={5} fill="white" stroke={muted} strokeWidth="1.6" />)}
    <Bottle x={196} y={248} s={.6} /><Bottle x={244} y={248} s={.6} />
    <Arrow from={[268, 232]} to={[318, 232]} colour={muted} width={2} />
    <Box x={384} y={262} s={1.1} />
    <Lines x={384} y={290} anchor="middle" lines={['packaging']} />
    <MiniRing active={2} />
  </Diagram>
}
function Flask({ x, y, fill = '#cfe6d8', line = '#4f8f6f' }: { x: number; y: number; fill?: string; line?: string }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-9 -80V-56L-34 -10q-5 10 6 10h56q11 0 6 -10L9 -56V-80" fill="#f5fafd" stroke={metalLine} strokeWidth="2" />
    <path d="M-22 -32h44l10 20q4 8 -5 8h-54q-9 0 -5 -8Z" fill={fill} stroke={line} strokeWidth="1.2" />
    <rect x={-12} y={-86} width={24} height={7} rx={3} fill={metalLine} />
    <circle cx={-6} cy={-18} r={3} fill="white" opacity=".8" /><circle cx={6} cy={-24} r={2.2} fill="white" opacity=".8" />
  </g>
}
function Drum({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-24 -54V-4q0 4 24 4q24 0 24 -4V-54" fill="#dcdfe2" stroke="#7d8790" strokeWidth="1.8" />
    <ellipse cx={0} cy={-54} rx={24} ry={5} fill="#eceef0" stroke="#7d8790" strokeWidth="1.8" />
    <path d="M-24 -36q24 5 48 0M-24 -18q24 5 48 0" stroke="#7d8790" strokeWidth="1.4" fill="none" />
  </g>
}
function Waste() {
  return <Diagram title="Stage 2: the reactions used to make a product also make waste. Some waste can be turned into useful chemicals, so less ends up polluting the environment.">
    <Factory x={36} y={170} s={1.1} fill={panelFill} line={panelLine} />
    <Flask x={96} y={250} />
    <Lines x={96} y={276} anchor="middle" lines={['reaction']} size={14} />
    <Arrow from={[140, 214]} to={[204, 214]} />
    <Drum x={238} y={250} />
    <Lines x={238} y={276} anchor="middle" lines={['waste']} size={14} />
    <Lines x={176} y={124} anchor="middle" lines={['waste made by', 'reactions']} size={14} colour={muted} />
    <CurveArrow from={[268, 206]} c={[312, 150]} to={[352, 196]} colour="#4f9a74" />
    <Bottle x={376} y={250} s={.95} fill="#f7e1b8" line="#b07a2a" />
    <path d="M368 222l5 6l10 -12" stroke="#4f9a74" strokeWidth="2.6" fill="none" />
    <Lines x={376} y={276} anchor="middle" lines={['useful chemical']} size={14} />
    <Caption text="Some waste turned into useful chemicals: less pollution" x={228} />
    <MiniRing active={2} />
  </Diagram>
}

// ---------- Section 3: stages 3 and 4 ----------
function Car({ x, y }: { x: number; y: number }) {
  const { fill, line } = lcaStages[2]
  return <g transform={`translate(${x} ${y})`}>
    <path d="M0 -8V-26q0 -6 6 -7l20 -3l18 -16q4 -3 9 -3h36q6 0 10 5l14 16q14 1 16 10V-8Z" fill={fill} stroke={line} strokeWidth="1.8" />
    <path d="M52 -48h14v14H38Z M72 -48h12q3 0 5 2l10 12H72Z" fill="white" stroke={line} strokeWidth="1.3" />
    {[30, 104].map(cx => <g key={cx}><circle cx={cx} cy={-6} r={10} fill="#5f6f7c" /><circle cx={cx} cy={-6} r={3.5} fill="#dfe5ea" /></g>)}
    <path d="M0 -14h-8" stroke={line} strokeWidth="3" />
  </g>
}
function Use() {
  return <Diagram title="Stage 3, using the product: a car burning fuel gives out greenhouse gases and other harmful substances. Fertiliser spread on a field drains into a river and harms plants and animals.">
    <Lines x={20} y={36} lines={['greenhouse gases and', 'other harmful substances']} size={14} colour={gasLine} />
    <Cloud x={70} y={108} s={1.15} fill={gas} line={gasLine} />
    <Car x={70} y={186} /><circle cx={54} cy={164} r={4} fill={gas} stroke={gasLine} strokeWidth="1.2" /><circle cx={48} cy={148} r={5.5} fill={gas} stroke={gasLine} strokeWidth="1.2" />
    <Lines x={130} y={210} anchor="middle" lines={['burning fuel']} />
    <path d="M226 190Q300 176 434 184V236H226Z" fill="#dff0d6" stroke={leafLine} strokeWidth="1.6" />
    {[250, 290, 330, 370, 410].map(cx => <path key={cx} d={`M${cx} 204q-4 -10 0 -16q4 6 0 16`} fill={leaf} stroke={leafLine} strokeWidth="1.3" />)}
    <path d="M248 180q-6 -14 0 -26l4 -4l-3 -5h22l-3 5l4 4q6 12 0 26Z" fill="#f3ead8" stroke="#a88f5f" strokeWidth="1.6" /><text x={283} y={176} fontSize="13" fontWeight="600" fill={muted}>fertiliser</text>
    {[[256, 196], [268, 204], [262, 214]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={2.4} fill="#c9b27d" />)}
    <Lines x={250} y={82} lines={['fertiliser drains', 'into rivers: harms', 'plants and animals']} size={14} />
    <path d="M20 246Q120 238 220 248T434 244V290Q330 298 220 290T20 292Z" fill={water} stroke={waterLine} strokeWidth="1.6" />
    {[300, 350, 400].map(cx => <Arrow key={cx} from={[cx, 214]} to={[cx - 8, 252]} colour="#b5985c" width={1.8} dashed />)}
    <Fish x={330} y={274} /><Weed x={392} y={292} />
    <MiniRing active={3} />
  </Diagram>
}
function Lifespan() {
  const bar = lcaStages[2]
  return <Diagram title="Stage 3: two products over the same time. One is used for a short time and replaced again and again, so it ends in the bin many times. One is used for years and ends in the bin once: less waste in the long run.">
    <Lines x={24} y={40} lines={['used a short time: more waste']} size={14} />
    {[0, 1, 2, 3].map(i => { const x0 = 30 + i * 100; return <g key={i}>
      <Bottle x={x0 + 10} y={104} s={.55} />
      <rect x={x0 + 24} y={86} width={36} height={10} rx={5} fill={bar.fill} stroke={bar.line} strokeWidth="1.4" />
      <Bin x={x0 + 76} y={104} s={.55} />
    </g> })}
    <Lines x={24} y={152} lines={['used for ages: less waste in the long run']} size={14} />
    <Bottle x={40} y={216} s={.55} />
    <rect x={54} y={198} width={316} height={10} rx={5} fill={bar.fill} stroke={bar.line} strokeWidth="1.4" />
    <Bin x={406} y={216} s={.55} />
    <Arrow from={[30, 258]} to={[420, 258]} colour={muted} width={2} />
    <text x={225} y={282} textAnchor="middle" fontSize="14" fontWeight="600" fill={muted}>time</text>
    <MiniRing active={3} />
  </Diagram>
}
function Landfill() {
  return <Diagram title="Stage 4, product disposal: a lorry takes rubbish to a landfill site. Landfill takes up space and can pollute land and water. Transport uses energy and gives out pollutants.">
    <path d="M20 250H434" stroke={groundLine} strokeWidth="2" />
    <path d="M196 250Q230 150 312 144Q392 142 432 250Z" fill="#d8d0bf" stroke={groundLine} strokeWidth="1.8" />
    <path d="M214 212Q260 188 312 190Q380 190 414 214M232 178Q280 162 318 164Q364 166 394 180" stroke={groundLine} strokeWidth="1.3" fill="none" strokeDasharray="5 5" />
    {[[262, 196, '#e6c9a4'], [300, 176, '#c9dbe8'], [346, 184, '#ece3f7'], [370, 226, '#e7d2b6'], [282, 230, '#d9ece9'], [330, 214, '#f3dfb0']].map(([cx, cy, c], i) => <rect key={i} x={+cx - 8} y={+cy - 5} width={16} height={10} rx={3} fill={String(c)} stroke="#8e8574" strokeWidth="1.1" transform={`rotate(${i * 23 - 40} ${cx} ${cy})`} />)}
    <Lines x={314} y={126} anchor="middle" lines={['takes up space']} />
    <path d="M150 266Q250 258 330 268T434 264V290Q340 298 250 290T150 292Z" fill={water} stroke={waterLine} strokeWidth="1.6" />
    {[240, 300, 360].map(cx => <path key={cx} d={`M${cx} 252q-3 6 0 12`} stroke="#8a6f45" strokeWidth="2.4" fill="none" />)}
    <Lines x={292} y={314} anchor="middle" lines={['pollutes land and water']} />
    <Lorry x={138} y={250} />
    <Cloud x={42} y={214} s={.7} />
    <Lines x={20} y={148} lines={['transport uses energy', 'and gives out pollutants']} size={14} />
    <MiniRing active={4} />
  </Diagram>
}
function Burn() {
  return <Diagram title="Stage 4: some products are burnt in an incinerator. Burning them causes air pollution.">
    <path d="M150 150V80q0 -4 4 -4h16q4 0 4 4V150" fill={lcaStages[3].fill} stroke={lcaStages[3].line} strokeWidth="1.8" />
    <path d="M110 250V160q0 -12 12 -12h196q12 0 12 12V250Z" fill={lcaStages[3].fill} stroke={lcaStages[3].line} strokeWidth="2" />
    <path d="M190 250V214q0 -26 30 -26q30 0 30 26V250Z" fill="#5f5a55" stroke={lcaStages[3].line} strokeWidth="1.8" />
    <Flame x={208} y={248} s={1.1} /><Flame x={222} y={250} s={1.4} /><Flame x={236} y={248} s={1.1} />
    <Cloud x={150} y={56} s={.9} /><Cloud x={96} y={38} s={1.1} /><Cloud x={40} y={62} s={.8} />
    <Lines x={200} y={46} lines={['burnt (incinerated):', 'air pollution']} />
    <path d="M20 250H434" stroke={groundLine} strokeWidth="2" />
    <Bottle x={46} y={250} s={.6} /><Box x={80} y={250} s={.55} />
    <Arrow from={[100, 232]} to={[184, 232]} colour={muted} width={2} />
    <Lines x={220} y={280} anchor="middle" lines={['incinerator']} size={14} colour={muted} weight={600} />
    <MiniRing active={4} />
  </Diagram>
}

export function LcaVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus === 'lca-whole') return <Whole />
  if (focus === 'lca-why') return <Why />
  if (focus === 'lca-four') return <Ring mode="four" />
  if (focus === 'lca-raw') return <Raw />
  if (focus === 'lca-process') return <Process />
  if (focus === 'lca-make') return <Make />
  if (focus === 'lca-waste') return <Waste />
  if (focus === 'lca-use') return <Use />
  if (focus === 'lca-lifespan') return <Lifespan />
  if (focus === 'lca-landfill') return <Landfill />
  if (focus === 'lca-burn') return <Burn />
  if (focus === 'lca-cycle') return <Ring mode="cycle" />
  if (focus === 'lca-q-cycle') return <Ring mode={assessment ? 'question' : 'four'} />
  return <Ring mode="four" />
}
