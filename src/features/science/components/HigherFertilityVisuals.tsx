import type { ReactNode } from 'react'
import { AnatomyFigure, Pointer, type AnatomyLabel } from './anatomy/AnatomyFigure'
import { blob, infectionPalette } from './InfectionVisuals'

// Higher-only diagrams for the menstrual cycle and contraception lessons (AQA 8464 4.5.3.3 HT and 4.5.3.5 HT).
// Original, code-native schematics, not to scale. Focus ids start with 'hfert-'.
// Same palette as the Foundation hormone diagrams (HormoneVisuals.tsx): pink-red = uterus lining, cream = eggs,
// grey-blue = sperm, gland pink = glands. Each hormone keeps one colour in every drawing here:
// FSH orange, LH magenta, oestrogen indigo, progesterone teal. Green chips = stimulates, red chips = inhibits.
const { ink } = infectionPalette
const muted = '#657a89', faded = 0.28
const gland = '#efc4b8', glandLine = '#b06c61'
const lining = '#c8505a', liningFill = '#f1b3b8', wall = '#f6dcd5', wallLine = '#bf8a80'
const eggFill = '#fff4d6', eggLine = '#c49a3c', sperm = '#5f7488'
const ovaryFill = '#f5e1d0'
const good = '#3f8f6a', goodFill = '#dff0e6', bad = '#b8434d', badFill = '#fbe3e5'
const panel = '#f7fafc', panelLine = '#cfdde7'
const H = {
  FSH: { line: '#c0702a', soft: '#fbe8d3' },
  LH: { line: '#b8417a', soft: '#f8dfea' },
  oestrogen: { line: '#4153a6', soft: '#e3e7fa' },
  progesterone: { line: '#2a8a87', soft: '#dcf1ef' },
} as const
type HormoneName = keyof typeof H

type Pt = [number, number]
const r1 = (n: number) => Math.round(n * 10) / 10

// ---------- Shared pieces ----------
function Text({ x, y, children, anchor = 'start', size = 14, bold = false, colour = ink, opacity }: { x: number; y: number; children: ReactNode; anchor?: 'start' | 'middle' | 'end'; size?: number; bold?: boolean; colour?: string; opacity?: number }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={bold ? 700 : 500} fill={colour} opacity={opacity}>{children}</text>
}
function Lines({ x, y, lines, anchor = 'start', size = 13, bold = false, colour = ink }: { x: number; y: number; lines: string[]; anchor?: 'start' | 'middle' | 'end'; size?: number; bold?: boolean; colour?: string }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={bold ? 700 : 500} fill={colour}>{lines.map((line, i) => <tspan key={i} x={x} dy={i ? size + 4 : 0}>{line}</tspan>)}</text>
}
function Egg({ x, y, r = 7 }: { x: number; y: number; r?: number }) {
  return <g><circle cx={x} cy={y} r={r} fill={eggFill} stroke={eggLine} strokeWidth="1.6" /><circle cx={x - r * .15} cy={y - r * .1} r={r * .3} fill="#e7c77a" /></g>
}
function Sperm({ x, y, angle = 0 }: { x: number; y: number; angle?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    <path d="M-5 0q-5 -4 -9 0t-9 0" stroke={sperm} strokeWidth="1.3" fill="none" />
    <ellipse cx="0" cy="0" rx="4" ry="2.8" fill="#dfe6ec" stroke={sperm} strokeWidth="1.3" />
  </g>
}
// A small ball of cells: an early embryo.
function Embryo({ x, y, r = 12 }: { x: number; y: number; r?: number }) {
  const cells: Pt[] = [[-.42, -.38], [.4, -.4], [-.45, .38], [.42, .4], [0, -.05], [-.02, .52], [0, -.58]]
  return <g>
    <circle cx={x} cy={y} r={r + 3} fill="#fff8ec" stroke={eggLine} strokeWidth="1.4" />
    {cells.map(([dx, dy], i) => <circle key={i} cx={r1(x + dx * r)} cy={r1(y + dy * r)} r={r * .42} fill={eggFill} stroke={eggLine} strokeWidth="1.1" />)}
  </g>
}
// A hormone name tag in that hormone's colour.
function Tag({ x, y, name, opacity = 1, anchor = 'middle' }: { x: number; y: number; name: HormoneName; opacity?: number; anchor?: 'start' | 'middle' }) {
  const w = name.length * 8.6 + 22, left = anchor === 'middle' ? x - w / 2 : x
  return <g opacity={opacity}>
    <rect x={r1(left)} y={y - 13} width={r1(w)} height={25} rx={12.5} fill={H[name].soft} stroke={H[name].line} strokeWidth="1.6" />
    <Text x={r1(left + w / 2)} y={y + 4.5} anchor="middle" bold colour={H[name].line}>{name}</Text>
  </g>
}
// An effect chip: green for "stimulates", red for "inhibits", grey for a plain event.
// `dot` is the colour of the hormone causing the effect, so each chip links back to its arrow.
function Chip({ x, y, text, kind = 'plain', opacity = 1, dot }: { x: number; y: number; text: string; kind?: 'plus' | 'minus' | 'plain'; opacity?: number; dot?: string }) {
  const pad = dot ? 24 : 10, w = text.length * 8.4 + pad + 8
  const [fill, line, colour] = kind === 'plus' ? [goodFill, good, '#2c6b4f'] : kind === 'minus' ? [badFill, bad, '#8f2f38'] : [panel, panelLine, ink]
  return <g opacity={opacity}>
    <rect x={r1(x)} y={y - 13} width={r1(w)} height={24} rx={7} fill={fill} stroke={line} strokeWidth="1.4" />
    {dot && <path d={`M${x + 12} ${y - 6}L${x + 18} ${y}L${x + 12} ${y + 6}L${x + 6} ${y}Z`} fill={dot} />}
    <Text x={r1(x + pad)} y={y + 4} size={13} colour={colour} bold={kind !== 'plain'}>{text}</Text>
  </g>
}
// A curved arrow (cubic Bézier) with a head that follows the curve.
type Curve = [Pt, Pt, Pt, Pt]
function bez([p0, p1, p2, p3]: Curve, t: number): Pt {
  const u = 1 - t
  return [0, 1].map(k => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]) as Pt
}
function CurveArrow({ c, colour, width = 3, opacity = 1, dashed = false }: { c: Curve; colour: string; width?: number; opacity?: number; dashed?: boolean }) {
  const [p0, p1, p2, p3] = c
  const angle = Math.atan2(p3[1] - p2[1], p3[0] - p2[0]), head = 9 + width * 1.4
  const back: Pt = [p3[0] - head * .7 * Math.cos(angle), p3[1] - head * .7 * Math.sin(angle)]
  const pts = [p3, [p3[0] - head * Math.cos(angle - .45), p3[1] - head * Math.sin(angle - .45)], [p3[0] - head * Math.cos(angle + .45), p3[1] - head * Math.sin(angle + .45)]]
  return <g opacity={opacity}>
    <path d={`M${p0[0]} ${p0[1]}C${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${r1(back[0])} ${r1(back[1])}`} stroke={colour} strokeWidth={width} fill="none" strokeDasharray={dashed ? '7 6' : undefined} />
    <polygon points={pts.map(p => p.map(r1).join(',')).join(' ')} fill={colour} stroke={colour} strokeWidth="1" />
  </g>
}
function Ovary({ x, y, rx = 66, ry = 38, seed = 3 }: { x: number; y: number; rx?: number; ry?: number; seed?: number }) {
  return <g>
    <path d={blob(x, y, rx, ry, seed, .05)} fill={ovaryFill} stroke={wallLine} strokeWidth="2.2" />
    {[[-.55, -.15, 3.2], [-.3, .35, 2.6], [.05, -.42, 2.8], [-.62, .3, 2.4]].map(([dx, dy, r], i) => <circle key={i} cx={r1(x + dx * rx)} cy={r1(y + dy * ry)} r={r} fill={eggFill} stroke={eggLine} />)}
  </g>
}
function Follicle({ x, y, r = 17, egg = true, remains = false }: { x: number; y: number; r?: number; egg?: boolean; remains?: boolean }) {
  if (remains) return <path d={blob(x, y, r * .85, r * .7, 11, .14)} fill="#f3dc8e" stroke="#b8902e" strokeWidth="1.8" />
  return <g><circle cx={x} cy={y} r={r} fill="#fdf2e0" stroke={eggLine} strokeWidth="1.8" />{egg && <Egg x={x + 2} y={y - 1} r={7} />}</g>
}
// A small front-view uterus with its lining (local box about 0–120 × 0–130).
function Uterus({ x, y, s = 1, thick = true, children }: { x: number; y: number; s?: number; thick?: boolean; children?: ReactNode }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M8 18Q60 -6 112 18Q122 68 82 104L78 130L42 130L38 104Q-2 68 8 18Z" fill={wall} stroke={wallLine} strokeWidth="2.4" />
    <path d={thick ? 'M20 24Q60 8 100 24Q104 62 72 96L48 96Q16 62 20 24Z' : 'M28 28Q60 18 92 28Q94 60 68 92L52 92Q26 60 28 28Z'} fill={liningFill} stroke={lining} strokeWidth="1.8" />
    <path d="M40 34Q60 28 80 34Q80 56 63 84L57 84Q40 56 40 34Z" fill="#fff8f7" stroke={lining} strokeWidth="1.2" />
    {children}
  </g>
}

// ---------- Lesson 35: how the four hormones affect one another (pituitary gland ↔ ovary → uterus) ----------
const loopOrder = ['fsh', 'oestrogen', 'lh', 'progesterone'] as const
const loopKey = [
  { mark: '1', id: 'pituitary', name: 'Pituitary gland', detail: 'A small gland under the brain. Releases FSH and LH.' },
  { mark: '2', id: 'ovary', name: 'Ovary', detail: 'Makes oestrogen. Eggs mature here.' },
  { mark: '3', id: 'follicle', name: 'Follicle', detail: 'A sac around a maturing egg. After ovulation, what is left makes progesterone.' },
  { mark: '4', id: 'lining', name: 'Uterus lining', detail: 'Grows, is kept thick, then breaks down.' },
]
const loopActive: Record<string, string[]> = { fsh: ['pituitary', 'follicle'], oestrogen: ['ovary', 'lining'], lh: ['pituitary', 'follicle'], progesterone: ['follicle', 'lining'], all: [] }
const loopTitles: Record<string, string> = {
  fsh: 'The pituitary gland under the brain releases FSH. FSH travels in the blood to an ovary, where an egg matures inside a follicle and the ovary is stimulated to make oestrogen.',
  oestrogen: 'The ovary releases oestrogen. Oestrogen makes the uterus lining grow. At the pituitary gland it stimulates the release of LH and inhibits the release of FSH.',
  lh: 'The pituitary gland releases LH. LH travels to the ovary and makes the follicle release its egg at about day 14. This is ovulation.',
  progesterone: 'After ovulation, what is left of the follicle releases progesterone. Progesterone keeps the uterus lining thick and inhibits the release of both FSH and LH.',
  all: 'The whole loop. FSH from the pituitary gland makes an egg mature and stimulates oestrogen. Oestrogen grows the lining, stimulates LH and inhibits FSH. LH triggers ovulation. Progesterone keeps the lining thick and inhibits FSH and LH. When progesterone falls, the lining breaks down and FSH is released again.',
}
const C = {
  FSH: [[282, 116], [150, 150], [150, 262], [250, 296]] as Curve,
  LH: [[296, 122], [262, 170], [262, 236], [282, 282]] as Curve,
  oestrogen: [[316, 282], [384, 244], [386, 166], [316, 116]] as Curve,
  progesterone: [[352, 300], [470, 262], [462, 128], [322, 106]] as Curve,
  oToU: [[366, 314], [400, 304], [420, 300], [452, 300]] as Curve,
  pToU: [[362, 332], [400, 340], [424, 342], [454, 338]] as Curve,
}
function Loop({ focus }: { focus: string }) {
  const stage = focus.replace('hfert-loop-', '')
  const step = stage === 'all' ? 5 : loopOrder.indexOf(stage as typeof loopOrder[number]) + 1
  const op = (k: number) => step === 5 || step === k ? 1 : k < step ? faded : 0
  const at = (c: Curve, t: number) => bez(c, t)
  const fshTag = at(C.FSH, .5), lhTag = at(C.LH, .52), oTag = at(C.oestrogen, .3), pTag = at(C.progesterone, .62)
  const active = loopActive[stage] || []
  const eggState = step <= 2 ? 'inside' : step === 3 ? 'leaving' : 'gone'
  return <AnatomyFigure title="How the four hormones work together" height={420}
    description={`${loopTitles[stage] || loopTitles.all} Original schematic, not to scale.`}
    labels={loopKey.map((k): AnatomyLabel => ({ mark: k.mark, name: k.name, detail: k.detail, active: active.includes(k.id) }))}
    note="Original schematic, not to scale. Hormones travel in the blood; each arrow shows where a hormone goes. Green = stimulates, red = inhibits.">
    {() => <>
      {/* brain and pituitary gland */}
      <path d={blob(300, 52, 96, 38, 7, .05)} fill="#f1eef4" stroke="#b9aec4" strokeWidth="2" />
      <path d="M232 52q20 -14 40 -2t40 -4t44 6" stroke="#cdc3d6" strokeWidth="1.6" fill="none" />
      <Text x={300} y={40} anchor="middle" size={12} colour={muted}>brain</Text>
      <path d="M300 88L300 98" stroke={glandLine} strokeWidth="3" />
      <path d={blob(300, 108, 20, 12, 5, .06)} fill={gland} stroke={glandLine} strokeWidth="2" />
      {/* ovary and follicle */}
      <Ovary x={300} y={318} />
      {eggState === 'gone' ? <Follicle x={330} y={312} remains /> : <Follicle x={330} y={312} egg={eggState === 'inside'} />}
      {eggState === 'leaving' && <g><Egg x={354} y={282} r={8.5} /><path d="M342 298L347 292" stroke={eggLine} strokeWidth="1.6" /></g>}
      {/* uterus */}
      <Uterus x={448} y={262} s={.92} />
      {/* hormone arrows */}
      <CurveArrow c={C.FSH} colour={H.FSH.line} opacity={op(1)} />
      <CurveArrow c={C.oestrogen} colour={H.oestrogen.line} opacity={op(2)} />
      <CurveArrow c={C.oToU} colour={H.oestrogen.line} opacity={op(2)} width={2.6} />
      <CurveArrow c={C.LH} colour={H.LH.line} opacity={op(3)} />
      <CurveArrow c={C.progesterone} colour={H.progesterone.line} opacity={op(4)} />
      <CurveArrow c={C.pToU} colour={H.progesterone.line} opacity={op(4)} width={2.6} />
      <Tag x={fshTag[0]} y={fshTag[1]} name="FSH" opacity={op(1)} />
      <Tag x={lhTag[0]} y={lhTag[1]} name="LH" opacity={op(3)} />
      <Tag x={oTag[0]} y={oTag[1]} name="oestrogen" opacity={op(2)} />
      <Tag x={pTag[0] + 4} y={pTag[1]} name="progesterone" opacity={op(4)} />
      {/* effects in the ovary */}
      <Text x={24} y={276} size={12} colour={muted}>in the ovary:</Text>
      <Chip x={24} y={300} text="egg matures" kind="plus" dot={H.FSH.line} opacity={op(1)} />
      <Chip x={24} y={330} text="oestrogen made" kind="plus" dot={H.FSH.line} opacity={op(1)} />
      <Chip x={24} y={360} text="egg released" kind="plus" dot={H.LH.line} opacity={op(3)} />
      {/* effects at the pituitary gland */}
      <Text x={404} y={30} size={12} colour={muted} opacity={step >= 2 ? 1 : 0}>at the pituitary gland:</Text>
      <Chip x={404} y={54} text="more LH" kind="plus" dot={H.oestrogen.line} opacity={op(2)} />
      <Chip x={404} y={84} text="less FSH" kind="minus" dot={H.oestrogen.line} opacity={op(2)} />
      <Chip x={404} y={114} text="less FSH and LH" kind="minus" dot={H.progesterone.line} opacity={op(4)} />
      {/* effects on the lining */}
      <Text x={409} y={293} anchor="middle" size={12} bold colour={H.oestrogen.line} opacity={op(2)}>grows</Text>
      <Text x={409} y={360} anchor="middle" size={12} bold colour={H.progesterone.line} opacity={op(4)}>kept thick</Text>
      {step === 5 && <g><rect x={14} y={14} width={178} height={64} rx={9} fill={panel} stroke={panelLine} strokeWidth="1.4" /><Lines x={24} y={34} lines={['progesterone falls →', 'lining breaks down →', 'FSH released again']} size={12} /></g>}
      <Pointer mark="1" x={186} y={108} toX={280} toY={110} active={active.includes('pituitary')} />
      <Pointer mark="2" x={230} y={392} toX={262} toY={340} active={active.includes('ovary')} />
      <Pointer mark="3" x={330} y={392} toX={330} toY={326} active={active.includes('follicle')} />
      <Pointer mark="4" x={572} y={232} toX={530} toY={290} active={active.includes('lining')} />
    </>}
  </AnatomyFigure>
}

// ---------- Lesson 35: the four hormone levels over one 28-day cycle ----------
const G = { left: 70, right: 566, top: 34, bottom: 236 }
const gx = (d: number) => G.left + (d - 1) * (G.right - G.left) / 27, gy = (v: number) => G.bottom - v * (G.bottom - G.top) / 10
function curve(points: Pt[]) {
  const p = points.map(([d, v]) => [gx(d), gy(v)] as Pt)
  let d = `M${r1(p[0][0])} ${r1(p[0][1])}`
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)]
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])} ${r1(p2[1])}`
  }
  return d
}
// Illustrative shapes only (relative levels, no units): FSH raised early then low; oestrogen peaks just before day 14;
// a sharp LH peak at day 14; progesterone high in the second half, falling before day 28.
const levels: Record<HormoneName, Pt[]> = {
  FSH: [[1, 4.4], [3, 5], [5, 4.6], [8, 3.4], [11, 2.4], [14, 2], [17, 1.6], [21, 1.3], [24, 1.4], [26, 2], [28, 3.8]],
  oestrogen: [[1, 1.5], [4, 1.9], [7, 2.8], [10, 4.8], [12, 6.8], [13, 7], [14, 5.2], [16, 3], [19, 3.2], [22, 3.2], [25, 2.4], [28, 1.6]],
  LH: [[1, 1.4], [6, 1.5], [10, 1.8], [12, 2.6], [13, 5], [14, 9], [15, 5], [16, 2.4], [18, 1.6], [23, 1.3], [28, 1.4]],
  progesterone: [[1, .9], [8, .9], [13, 1], [15, 1.6], [17, 3.6], [19, 5.6], [21, 6.4], [23, 6.2], [25, 4.4], [27, 1.8], [28, 1.1]],
}
const graphOrder: HormoneName[] = ['FSH', 'oestrogen', 'LH', 'progesterone']
const dash: Record<HormoneName, string | undefined> = { FSH: '3 6', oestrogen: '16 5 3 5', LH: undefined, progesterone: '12 7' }
// Question numbering: 1 FSH, 2 progesterone, 3 LH, 4 oestrogen.
const qNumber: Record<HormoneName, string> = { FSH: '1', progesterone: '2', LH: '3', oestrogen: '4' }
const nameAt: Record<HormoneName, Pt> = { FSH: [gx(3) + 4, gy(5) - 14], oestrogen: [gx(12) - 8, gy(7) - 6], LH: [gx(14) + 16, gy(9) + 4], progesterone: [gx(21), gy(6.4) - 14] }
const numberAt: Record<HormoneName, Pt> = { FSH: [gx(3), gy(5) - 22], oestrogen: [gx(11) - 8, gy(6.6) - 16], LH: [gx(15.6), gy(8.6)], progesterone: [gx(21), gy(6.4) - 22] }
function liningShape() {
  const top = 262, base = 296
  const t = (d: number) => d <= 4 ? 9 - d * 1.6 : d <= 14 ? 3 + (d - 4) * 2.2 : d <= 26 ? 25 + (d - 14) * .4 : 30 - (d - 26) * 11
  const pts: string[] = []
  for (let d = 1; d <= 28; d += .5) pts.push(`L${r1(gx(d))} ${r1(base - Math.max(3, t(d)) - (d <= 4 || d >= 27 ? (Math.round(d * 2) % 2 ? 2.5 : -1.5) : Math.sin(d * 1.9)))}`)
  return { d: `M${gx(1)} ${base}${pts.join('')}L${gx(28)} ${base}Z`, top }
}
function HormoneGraph({ focus, assessment }: { focus: string; assessment: boolean }) {
  const stage = focus.replace('hfert-graph-', '')
  const question = stage === 'question'
  const step = question || stage === 'all' ? 5 : graphOrder.findIndex(h => h.toLowerCase() === stage) + 1
  const op = (k: number) => step === 5 || step === k ? 1 : k < step ? .3 : 0
  const titles: Record<string, string> = {
    fsh: 'A graph of hormone levels in the blood over a 28-day cycle. The FSH line is raised early in the cycle, then falls.',
    oestrogen: 'The oestrogen line rises through the first half of the cycle and peaks just before day 14. The FSH line falls as oestrogen rises.',
    lh: 'The LH line stays low, then shoots up to a sharp peak at about day 14, which triggers ovulation, then falls quickly.',
    progesterone: 'The progesterone line is low in the first half, rises after ovulation, stays high in the second half, then falls before day 28. When it falls, the uterus lining breaks down.',
    all: 'All four hormone levels over one cycle: FSH raised early, oestrogen peaking just before day 14, a sharp LH peak at day 14, and progesterone high in the second half. The uterus lining is shown underneath.',
    question: 'A graph of four hormone levels in the blood over a 28-day cycle. The lines are numbered 1 to 4. Line 1 is raised early and near the end. Line 2 is low in the first half and high in the second half. Line 3 has a sharp peak at day 14. Line 4 peaks just before day 14.',
  }
  const showLining = step >= 4
  const lin = liningShape()
  return <AnatomyFigure title="Hormone levels in one cycle" height={340}
    description={`${titles[stage] || titles.all} Illustrative shapes, not real data.`}
    note={question || assessment ? 'Illustrative shapes, not real data. Day 1 is the first day of a period.' : 'Illustrative shapes, not real data. Hormone levels are relative, so the axis has no units. Day 1 is the first day of a period.'}>
    {() => <>
      {[7, 14, 21].map(d => <path key={d} d={`M${gx(d)} ${G.top}V${G.bottom}`} stroke="#e3ebf1" strokeWidth="1.2" />)}
      {step >= 3 && <g opacity={question ? .7 : 1}><path d={`M${gx(14)} ${G.top - 6}V${G.bottom}`} stroke={muted} strokeWidth="1.5" strokeDasharray="5 5" />{!question && <Text x={gx(14) - 6} y={G.top - 12} anchor="end" size={12} colour={muted}>ovulation</Text>}</g>}
      {graphOrder.map((h, i) => {
        const o = op(i + 1)
        if (!o) return null
        const colour = question ? ink : H[h].line
        return <g key={h} opacity={o}>
          <path d={curve(levels[h])} stroke={colour} strokeWidth={question ? 3 : h === 'LH' ? 3.2 : 3.6} fill="none" strokeDasharray={question ? dash[h] : undefined} />
          {question ? <g><circle cx={numberAt[h][0]} cy={numberAt[h][1]} r="12" fill="white" stroke={ink} strokeWidth="2" /><text x={numberAt[h][0]} y={numberAt[h][1] + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{qNumber[h]}</text></g>
            : <Text x={nameAt[h][0]} y={nameAt[h][1]} anchor={h === 'oestrogen' ? 'end' : 'start'} bold colour={colour}>{h}</Text>}
        </g>
      })}
      <path d={`M${G.left} ${G.top - 10}V${G.bottom}H${G.right + 10}`} stroke={ink} strokeWidth="2" fill="none" />
      <path d={`M${G.left - 5} ${G.top - 2}L${G.left} ${G.top - 11}L${G.left + 5} ${G.top - 2}`} stroke={ink} strokeWidth="2" fill="none" />
      <text transform={`translate(28 ${(G.top + G.bottom) / 2}) rotate(-90)`} textAnchor="middle" fontSize="13" fill={ink}>hormone level in blood</text>
      <g opacity={showLining ? 1 : .35}>
        <path d={lin.d} fill={liningFill} stroke={lining} strokeWidth="1.6" />
        <Text x={G.left - 8} y={290} anchor="end" size={12} colour={lining}>lining</Text>
      </g>
      <path d={`M${G.left} 296H${G.right}`} stroke={wallLine} strokeWidth="1.5" />
      {[1, 7, 14, 21, 28].map(d => <g key={d}><path d={`M${gx(d)} 296v5`} stroke={ink} /><Text x={gx(d)} y={316} anchor="middle" size={12}>{d}</Text></g>)}
      <Text x={(G.left + G.right) / 2} y={334} anchor="middle" size={13}>day of the cycle</Text>
    </>}
  </AnatomyFigure>
}

// ---------- Lesson 36: FSH and LH as a fertility drug ----------
const drugOrder = ['low', 'given', 'pro', 'cons'] as const
const drugKey = [
  { mark: '1', id: 'drug', name: 'Fertility drug', detail: 'A medicine containing FSH and LH.' },
  { mark: '2', id: 'ovary', name: 'Ovary', detail: 'Where eggs mature and are released.' },
  { mark: '3', id: 'egg', name: 'Egg', detail: 'Matures inside a follicle, then is released.' },
]
function Syringe({ x, y }: { x: number; y: number }) {
  return <g>
    <rect x={x} y={y} width={92} height={30} rx={6} fill="#f2f5f8" stroke={muted} strokeWidth="2" />
    <rect x={x + 6} y={y + 6} width={58} height={18} rx={3} fill="#efe3f4" stroke="#9c7bb0" strokeWidth="1.2" />
    <path d={`M${x - 26} ${y + 15}H${x}M${x - 26} ${y + 4}V${y + 26}M${x + 92} ${y + 15}H${x + 122}`} stroke={muted} strokeWidth="2.4" />
    {[16, 28, 40, 52].map(dx => <path key={dx} d={`M${x + dx} ${y}v7`} stroke={muted} strokeWidth="1.4" />)}
  </g>
}
function FertilityDrug({ focus }: { focus: string }) {
  const stage = focus.replace('hfert-drug-', '')
  const step = drugOrder.indexOf(stage as typeof drugOrder[number]) + 1 || 4
  const low = step === 1, multi = step === 4
  const titles: Record<string, string> = {
    low: 'An ovary in a woman who makes too little FSH. Her eggs stay small and do not mature, so no egg is released.',
    given: 'A fertility drug containing FSH and LH is given. FSH makes an egg mature in a follicle, and LH makes the egg be released.',
    pro: 'The benefit: many women who could not get pregnant before become pregnant after taking a fertility drug.',
    cons: 'The drawbacks: it does not always work, so many attempts may be needed, which can be expensive. Too many eggs may mature and be released, leading to a multiple pregnancy such as twins or triplets.',
  }
  const active = low ? ['ovary'] : step === 2 ? ['drug', 'egg'] : multi ? ['egg'] : []
  return <AnatomyFigure title="A fertility drug" height={330}
    description={`${titles[stage] || titles.cons} Original schematic, not to scale.`}
    labels={drugKey.map((k): AnatomyLabel => ({ mark: k.mark, name: k.name, detail: k.detail, active: active.includes(k.id) }))}
    note="Original schematic, not to scale. Eggs and follicles are drawn much larger than life.">
    {() => <>
      {/* the drug */}
      <g opacity={low ? .18 : 1}>
        <Syringe x={58} y={64} />
        <Tag x={54} y={124} name="FSH" anchor="start" />
        <Tag x={116} y={124} name="LH" anchor="start" />
      </g>
      {!low && <CurveArrow c={[[120, 146], [128, 186], [150, 206], [184, 214]]} colour={muted} width={2.4} />}
      {low && <g><Chip x={34} y={186} text="too little FSH" kind="minus" dot={H.FSH.line} /><Text x={34} y={214} size={12} colour={muted}>eggs stay small</Text></g>}
      {/* the ovary */}
      <Ovary x={262} y={226} rx={74} ry={44} seed={9} />
      {low ? [[244, 222], [270, 238], [286, 214]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4.5} fill={eggFill} stroke={eggLine} strokeWidth="1.4" />)
        : multi ? <>{[[250, 230], [288, 222]].map(([x, y], i) => <Follicle key={i} x={x} y={y} r={14} egg={false} />)}
            {[[312, 178], [340, 188], [326, 152]].map(([x, y], i) => <Egg key={i} x={x} y={y} r={9} />)}
            <path d="M296 206L312 190" stroke={eggLine} strokeWidth="1.8" /></>
          : <><Follicle x={282} y={222} r={17} egg={false} /><Egg x={314} y={170} r={10} /><path d="M292 206L304 186" stroke={eggLine} strokeWidth="1.8" /></>}
      {low ? <Text x={262} y={296} anchor="middle" size={13} colour={bad} bold>no egg released</Text>
        : <Text x={262} y={296} anchor="middle" size={13} colour={good} bold>{multi ? 'several eggs released' : 'egg matures and is released'}</Text>}
      {/* pros and cons */}
      <g opacity={step === 3 ? 1 : step === 4 ? .45 : 0}>
        <rect x={378} y={34} width={204} height={74} rx={10} fill={goodFill} stroke={good} strokeWidth="1.6" />
        <Text x={392} y={58} bold colour={good}>+ benefit</Text>
        <Lines x={392} y={80} lines={['many women can now', 'get pregnant']} />
      </g>
      <g opacity={step === 4 ? 1 : 0}>
        <rect x={378} y={124} width={204} height={160} rx={10} fill={badFill} stroke={bad} strokeWidth="1.6" />
        <Text x={392} y={148} bold colour={bad}>− drawbacks</Text>
        <Lines x={392} y={172} lines={['may need many attempts,', 'which can be expensive']} />
        <Lines x={392} y={222} lines={['too many eggs →', 'twins or triplets', '(a multiple pregnancy)']} />
      </g>
      <Pointer mark="1" x={34} y={44} toX={70} toY={70} active={active.includes('drug')} />
      <Pointer mark="2" x={150} y={256} toX={198} toY={236} active={active.includes('ovary')} />
      <Pointer mark="3" x={multi ? 276 : 350} y={multi ? 142 : 128} toX={low ? 286 : multi ? 304 : 314} toY={low ? 214 : multi ? 172 : 170} active={active.includes('egg')} />
    </>}
  </AnatomyFigure>
}

// ---------- Lesson 36: the four steps of IVF (ovary → lab dish → embryo → uterus) ----------
const ivfOrder = ['eggs', 'lab', 'embryo', 'uterus'] as const
const ivfKey = [
  { mark: '1', name: 'Hormones', detail: 'FSH and LH make several eggs mature in the ovaries.' },
  { mark: '2', name: 'Lab dish', detail: 'The eggs are collected and fertilised with sperm.' },
  { mark: '3', name: 'Incubator', detail: 'Each fertilised egg grows into an embryo, a tiny ball of cells.' },
  { mark: '4', name: 'Uterus', detail: 'One or two embryos are placed in the uterus.' },
]
function Ivf({ focus, assessment }: { focus: string; assessment: boolean }) {
  const stage = focus.replace('hfert-ivf-', '')
  const question = stage === 'question'
  const step = question || stage === 'all' ? 5 : ivfOrder.indexOf(stage as typeof ivfOrder[number]) + 1
  const op = (k: number) => step === 5 || step === k ? 1 : k < step ? .4 : .14
  const hide = assessment || question
  const cx = [78, 228, 378, 518]
  const titles: Record<string, string> = {
    eggs: 'Step 1 of IVF: the woman is given FSH and LH, so several eggs mature in her ovaries.',
    lab: 'Step 2: the eggs are collected and mixed with sperm in a lab dish, where some are fertilised.',
    embryo: 'Step 3: in a warm incubator, each fertilised egg divides into a tiny ball of cells, an embryo.',
    uterus: 'Step 4: one or two embryos are placed in the uterus. A pregnancy starts if one settles into the lining.',
    all: 'The four steps of IVF: hormones make several eggs mature, the eggs are fertilised in a lab dish, they grow into embryos in an incubator, and one or two embryos are placed in the uterus.',
    question: 'Four steps of a fertility treatment, numbered 1 to 4 from left to right: an ovary with several eggs, a dish with eggs and sperm, a ball of cells, and a uterus.',
  }
  return <AnatomyFigure title={hide ? 'Four steps' : 'The steps of IVF'} height={290}
    description={`${titles[stage] || titles.all} Original schematic, not to scale.`}
    labels={hide ? undefined : ivfKey.map((k, i): AnatomyLabel => ({ ...k, active: step === i + 1 }))}
    note="Original schematic, not to scale. Eggs, sperm and embryos are drawn much larger than life.">
    {() => <>
      {/* arrows between the steps */}
      {[0, 1, 2].map(i => <g key={i} opacity={step === 5 || step > i + 1 ? 1 : .2}>
        <CurveArrow c={[[cx[i] + 52, 150], [cx[i] + 66, 132], [cx[i + 1] - 66, 132], [cx[i + 1] - 54, 148]]} colour={muted} width={2.4} />
      </g>)}
      {!hide && <Text x={(cx[0] + cx[1]) / 2} y={122} anchor="middle" size={12} colour={muted} opacity={step >= 2 ? 1 : .2}>eggs collected</Text>}
      {/* 1: ovary, several maturing eggs, FSH and LH */}
      <g opacity={op(1)}>
        <Ovary x={cx[0]} y={170} rx={54} ry={34} seed={4} />
        {[[-24, -6], [0, 8], [22, -8]].map(([dx, dy], i) => <Follicle key={i} x={cx[0] + dx} y={170 + dy} r={11} egg={false} />)}
        {[[-24, -6], [0, 8], [22, -8]].map(([dx, dy], i) => <Egg key={i} x={cx[0] + dx} y={170 + dy} r={5} />)}
        {!hide && <><Tag x={cx[0] - 28} y={232} name="FSH" /><Tag x={cx[0] + 32} y={232} name="LH" /></>}
      </g>
      {/* 2: lab dish with eggs and sperm */}
      <g opacity={op(2)}>
        <ellipse cx={cx[1]} cy={182} rx={58} ry={18} fill="#e8f2f7" stroke="#7fa3b8" strokeWidth="2" />
        <path d={`M${cx[1] - 58} 182v-14a58 18 0 0 1 116 0v14`} fill="none" stroke="#7fa3b8" strokeWidth="2" />
        <ellipse cx={cx[1]} cy={168} rx={58} ry={18} fill="#f4f9fc" stroke="#7fa3b8" strokeWidth="1.6" />
        {[[-24, 168], [6, 164], [30, 172]].map(([dx, y], i) => <Egg key={i} x={cx[1] + dx} y={y} r={6.5} />)}
        <Sperm x={cx[1] - 36} y={160} angle={20} /><Sperm x={cx[1] - 4} y={176} angle={-30} /><Sperm x={cx[1] + 22} y={160} angle={150} /><Sperm x={cx[1] + 44} y={166} angle={200} />
        {!hide && <Text x={cx[1]} y={236} anchor="middle" size={13}>lab dish</Text>}
      </g>
      {/* 3: incubator with an embryo */}
      <g opacity={op(3)}>
        <rect x={cx[2] - 54} y={128} width={108} height={82} rx={12} fill="#fdf5e8" stroke="#c9a46a" strokeWidth="2" />
        <path d={`M${cx[2] - 54} 146H${cx[2] + 54}`} stroke="#e2c99d" strokeWidth="1.5" />
        <Embryo x={cx[2]} y={180} r={15} />
        {!hide && <Text x={cx[2]} y={236} anchor="middle" size={13}>embryo</Text>}
      </g>
      {/* 4: uterus with an embryo in the lining */}
      <g opacity={op(4)}>
        <Uterus x={cx[3] - 46} y={112} s={.78}><Embryo x={86} y={52} r={7} /></Uterus>
        {!hide && <Text x={cx[3]} y={236} anchor="middle" size={13}>uterus</Text>}
      </g>
      {[0, 1, 2, 3].map(i => <g key={i} opacity={step === 5 || step === i + 1 ? 1 : .45}>
        <circle cx={cx[i]} cy={58} r={15} fill={!hide && step === i + 1 ? lining : 'white'} stroke={ink} strokeWidth="2" />
        <text x={cx[i]} y={64} textAnchor="middle" fontSize="16" fontWeight="700" fill={!hide && step === i + 1 ? 'white' : ink}>{i + 1}</text>
        <path d={`M${cx[i]} 74V${i === 3 ? 108 : 120}`} stroke={muted} strokeWidth="1.4" strokeDasharray="3 4" />
      </g>)}
      {!hide && step === 5 && <Text x={300} y={274} anchor="middle" size={12} colour={muted}>hormones → fertilised in a lab → embryo grows → one or two placed in the uterus</Text>}
    </>}
  </AnatomyFigure>
}

// ---------- Lesson 36: weighing up IVF (benefit and drawbacks on a level balance, then two views) ----------
const weighOrder = ['benefit', 'multiple', 'success', 'tools', 'ethics'] as const
function Microscope({ x, y }: { x: number; y: number }) {
  return <g stroke={muted} strokeWidth="2.2" fill="none">
    <path d={`M${x} ${y + 34}h30M${x + 18} ${y + 34}v-10M${x + 6} ${y + 24}h24M${x + 20} ${y + 24}l-8 -20`} />
    <rect x={x + 6} y={y - 6} width={10} height={16} rx={3} transform={`rotate(-22 ${x + 11} ${y + 2})`} fill="#eef1f4" />
  </g>
}
function Camera({ x, y }: { x: number; y: number }) {
  return <g><rect x={x} y={y} width={30} height={20} rx={4} fill="#eef1f4" stroke={muted} strokeWidth="2" /><circle cx={x + 15} cy={y + 10} r={6} fill="white" stroke={muted} strokeWidth="2" /><rect x={x + 5} y={y - 5} width={9} height={5} rx={1.5} fill={muted} /></g>
}
function Weigh({ focus }: { focus: string }) {
  const stage = focus.replace('hfert-weigh-', '')
  const step = weighOrder.indexOf(stage as typeof weighOrder[number]) + 1 || 5
  const op = (k: number) => step === 5 || step === k ? 1 : k < step ? .4 : 0
  const titles: Record<string, string> = {
    benefit: 'A level balance. On one side, the benefit of IVF: a couple who could not have a baby may now have one.',
    multiple: 'A drawback is added to the other side: multiple births, which carry more risks for the mother and the babies.',
    success: 'More drawbacks: a low success rate, and stress on the body and mind, including side effects from the hormones.',
    tools: 'Under the balance: fine tools used under a microscope and time-lapse imaging have improved the success rate of IVF.',
    ethics: 'The whole picture: the benefit and the drawbacks of IVF, the techniques that improve it, and two views on its ethical issues, unused embryos and testing embryos, set out side by side.',
  }
  return <AnatomyFigure title="Weighing up IVF" height={410}
    description={`${titles[stage] || titles.ethics} Original schematic. The balance is drawn level: it does not show which side wins.`}
    note="Original schematic. The balance is drawn level on purpose: people weigh these points up differently.">
    {() => <>
      {/* the balance */}
      <path d="M300 40V176M262 190Q300 168 338 190Z" stroke={muted} strokeWidth="3" fill="#eef1f4" />
      <path d="M110 40H490" stroke={muted} strokeWidth="5" />
      <circle cx={300} cy={40} r={7} fill="white" stroke={muted} strokeWidth="2.5" />
      {[150, 450].map(x => <g key={x}><path d={`M${x} 40L${x - 78} 174M${x} 40L${x + 78} 174`} stroke="#b7c4ce" strokeWidth="1.4" /><path d={`M${x - 92} 174Q${x} 196 ${x + 92} 174Z`} fill="#eef1f4" stroke={muted} strokeWidth="2.2" /></g>)}
      {/* white backings, so faded chips do not show the pan strings through them */}
      {([[74, 128, 152, 40, 1], [362, 128, 176, 40, 2], [362, 82, 176, 40, 3], [362, 52, 176, 24, 3]] as const).map(([x, y, w, h, k], i) => op(k) ? <rect key={i} x={x} y={y} width={w} height={h} rx={9} fill="white" /> : null)}
      {/* benefit */}
      <g opacity={op(1)}>
        <rect x={74} y={128} width={152} height={40} rx={9} fill={goodFill} stroke={good} strokeWidth={step === 1 ? 2.4 : 1.6} />
        <path d="M94 154c-8 -6 -10 -14 -4 -17c3 -1.5 6 0 7 3c1 -3 4 -4.5 7 -3c6 3 4 11 -4 17l-3 2z" fill="#f4b9be" stroke={bad} strokeWidth="1.4" />
        <Lines x={114} y={143} lines={['a chance of', 'having a child']} size={13} bold colour="#2c6b4f" />
      </g>
      {/* drawbacks */}
      <g opacity={op(2)}>
        <rect x={362} y={128} width={176} height={40} rx={9} fill={badFill} stroke={bad} strokeWidth={step === 2 ? 2.4 : 1.6} />
        <Embryo x={381} y={148} r={6} /><Embryo x={398} y={148} r={6} />
        <Lines x={416} y={143} lines={['multiple', 'births']} size={13} bold colour="#8f2f38" />
      </g>
      <g opacity={op(3)}>
        <rect x={362} y={82} width={176} height={40} rx={9} fill={badFill} stroke={bad} strokeWidth={step === 3 ? 2.4 : 1.6} />
        <Lines x={376} y={98} lines={['low success rate,', 'stress and upset']} size={13} bold colour="#8f2f38" />
        <rect x={362} y={52} width={176} height={24} rx={8} fill={badFill} stroke={bad} strokeWidth={step === 3 ? 2.4 : 1.6} />
        <Text x={376} y={69} size={13} bold colour="#8f2f38">hormone side effects</Text>
      </g>
      {/* improving the odds */}
      <g opacity={op(4)}>
        <rect x={150} y={206} width={300} height={50} rx={10} fill={panel} stroke={step === 4 ? good : panelLine} strokeWidth={step === 4 ? 2.2 : 1.5} />
        <Microscope x={164} y={214} /><Camera x={204} y={220} />
        <Lines x={246} y={226} lines={['fine tools + time-lapse imaging', '→ a higher success rate']} size={13} />
      </g>
      {/* two views on the ethical issues */}
      <g opacity={op(5)}>
        <Text x={300} y={282} anchor="middle" size={13} bold>Ethical issues: two views</Text>
        {[{ x: 20, head: 'Some people think…', lines: ['• unused embryos are destroyed,', 'and an embryo is, or could', 'become, a human life', '• testing could be used to', 'choose features, like eye colour'] },
          { x: 306, head: 'Others think…', lines: ['• IVF is acceptable, because it', 'helps people to have children', '• testing can help to avoid', 'serious genetic disorders'] }].map(v => <g key={v.x}>
          <rect x={v.x} y={292} width={274} height={112} rx={10} fill="#f3f1f8" stroke="#a99bbd" strokeWidth={step === 5 ? 1.8 : 1.4} />
          <Text x={v.x + 14} y={312} size={13} bold colour="#5e4b7a">{v.head}</Text>
          {v.lines.map((line, i) => <Text key={i} x={v.x + (line.startsWith('•') ? 14 : 25)} y={332 + i * 16} size={12}>{line}</Text>)}
        </g>)}
      </g>
    </>}
  </AnatomyFigure>
}

export function HigherFertilityVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('hfert-loop-')) return <Loop focus={focus} />
  if (focus.startsWith('hfert-graph-')) return <HormoneGraph focus={focus} assessment={assessment} />
  if (focus.startsWith('hfert-drug-')) return <FertilityDrug focus={focus} />
  if (focus.startsWith('hfert-ivf-')) return <Ivf focus={focus} assessment={assessment} />
  if (focus.startsWith('hfert-weigh-')) return <Weigh focus={focus} />
  return null
}
