import { useId, type ReactNode } from 'react'
import { AnatomyFigure, Pointer, type AnatomyLabel } from './anatomy/AnatomyFigure'
import { Arrow, Badge } from './InfectionVisuals'

// Chapter B5 (Lessons 35–37): homeostasis, the nervous system, reflexes and reaction time. Original, code-native schematics. Not to scale.
// Focus ids start with 'nerve-'.
// Colour code for this chapter: blue = receptors and sensory neurones, purple = coordination centres (CNS) and relay neurones,
// red = effectors and motor neurones, teal = the chemicals that cross a synapse, green = the optimum level.
// Course colours kept: yellow = light, amber = glucose, blue = water.
type Pt = [number, number]
const r1 = (n: number) => Math.round(n * 10) / 10
const ink = '#375a73', muted = '#8aa0b0', faded = .3, panel = '#f7fafc', panelLine = '#cfdde7'
const sens = '#357eae', sensFill = '#dcebf7', relay = '#8555a4', relayFill = '#ece3f4', motor = '#c64c59', motorFill = '#f6d9d9'
const chem = '#2f9c95', opt = '#4f9a6a', optFill = '#e1f1e6'
const skin = '#f1dcc8', skinLine = '#b9906f', jumper = '#a9cbe0', jumperLine = '#7c9fb5'
const sun = '#f6d25e', sunLine = '#c9951c', amber = '#c98f2c', amberFill = '#f6dfa5', water = '#3f93bd', waterFill = '#dcf0f8'
const wood = '#ecd9b8', woodLine = '#b08a5a', enzymeFill = '#efd8e7', enzymeLine = '#a0678a', plantGreen = '#4f8f5a'

function Figure({ title, viewBox = '0 0 540 300', children, schematic = true }: { title: string; viewBox?: string; children: ReactNode; schematic?: boolean }) {
  const id = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={id}><title id={id}>{schematic ? `${title} Original schematic, not to scale.` : title}</title>
    <g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
// A small arrowhead placed along a nerve path, pointing the way the impulse travels.
function Chevron({ at, angle, colour, size = 8 }: { at: Pt; angle: number; colour: string; size?: number }) {
  const a = angle * Math.PI / 180, [x, y] = at
  const p = (d: number, s: number) => `${r1(x + Math.cos(a + s) * d)} ${r1(y + Math.sin(a + s) * d)}`
  return <path d={`M${p(size, 0)}L${p(size, 2.4)}L${p(size * .25, Math.PI)}L${p(size, -2.4)}Z`} fill={colour} />
}
function Nerve({ d, colour, width = 4, marks = [], dashed = false }: { d: string; colour: string; width?: number; marks?: Array<[number, number, number]>; dashed?: boolean }) {
  return <g><path d={d} fill="none" stroke={colour} strokeWidth={width} strokeDasharray={dashed ? '7 6' : undefined} />{marks.map(([x, y, a], i) => <Chevron key={i} at={[x, y]} angle={a} colour={colour} size={width + 5} />)}</g>
}
function Tile({ x, y, w, h, on = true, tint = panel, line = panelLine, children }: { x: number; y: number; w: number; h: number; on?: boolean; tint?: string; line?: string; children?: ReactNode }) {
  return <g opacity={on ? 1 : faded}><rect x={x} y={y} width={w} height={h} rx="12" fill={on ? tint : panel} stroke={on ? line : panelLine} strokeWidth="1.8" />{children}</g>
}
function Text({ x, y, lines, size = 14, bold = false, colour = ink, anchor = 'middle' }: { x: number; y: number; lines: string[]; size?: number; bold?: boolean; colour?: string; anchor?: 'start' | 'middle' | 'end' }) {
  return <text x={x} y={y} textAnchor={anchor} fill={colour} fontSize={size} fontWeight={bold ? 700 : 500}>{lines.map((line, i) => <tspan key={i} x={x} dy={i ? size + 3 : 0}>{line}</tspan>)}</text>
}

// A label with a leader line that ends in a dot on the named feature. Width is estimated generously for bold text.
function Label({ x, y, to, lines, anchor = 'start', strong = false, colour = ink, size = 14 }: { x: number; y: number; to?: Pt; lines: string[]; anchor?: 'start' | 'middle' | 'end'; strong?: boolean; colour?: string; size?: number }) {
  const width = Math.max(...lines.map(line => line.length)) * size * (strong ? .62 : .56)
  const left = anchor === 'start' ? x : anchor === 'end' ? x - width : x - width / 2, right = left + width
  let start: Pt = [x, y]
  if (to) {
    if (to[0] >= right + 6) start = [right + 5, y - size * .35]
    else if (to[0] <= left - 6) start = [left - 5, y - size * .35]
    else { const cx = Math.min(Math.max(to[0], left + 6), right - 6); start = to[1] > y ? [cx, y + (lines.length - 1) * (size + 3) + 6] : [cx, y - size - 3] }
  }
  return <g>
    {to && <><path d={`M${r1(start[0])} ${r1(start[1])}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.5" fill="none" /><circle cx={to[0]} cy={to[1]} r="2.5" fill={ink} /></>}
    <Text x={x} y={y} lines={lines} size={size} bold={strong} colour={colour} anchor={anchor} />
  </g>
}

// ---------- Small icons ----------
function Brain({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${k})`}>
    <path d="M-24 4C-30-8-22-22-10-22C-6-28 6-28 10-22C22-24 30-10 25 2C28 12 18 20 8 18C2 22-8 22-12 17C-22 18-28 12-24 4Z" fill={relayFill} stroke={relay} strokeWidth="2.2" />
    <path d="M-14-12C-8-8-12-2-6 2M4-16C0-8 8-6 4 2M14-10C10-4 18 0 14 8M-16 8C-8 6-4 12 2 10" fill="none" stroke={relay} strokeWidth="1.6" />
  </g>
}
function Eye({ x, y, k = 1, lit = false }: { x: number; y: number; k?: number; lit?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${k})`}>
    <path d="M-26 0C-14-16 14-16 26 0C14 16-14 16-26 0Z" fill="white" stroke={lit ? sens : ink} strokeWidth="2.2" />
    <circle r="10" fill={lit ? sensFill : '#d7e3ea'} stroke={lit ? sens : ink} strokeWidth="2" /><circle r="4.5" fill={ink} />
  </g>
}
function Ball({ x, y, r = 18 }: { x: number; y: number; r?: number }) {
  const pent = Array.from({ length: 5 }, (_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return `${r1(x + Math.cos(a) * r * .38)} ${r1(y + Math.sin(a) * r * .38)}` })
  return <g><circle cx={x} cy={y} r={r} fill="white" stroke={ink} strokeWidth="2" /><path d={`M${pent.join('L')}Z`} fill={ink} />
    {Array.from({ length: 5 }, (_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return <path key={i} d={`M${r1(x + Math.cos(a) * r * .38)} ${r1(y + Math.sin(a) * r * .38)}L${r1(x + Math.cos(a) * r)} ${r1(y + Math.sin(a) * r)}`} stroke={ink} strokeWidth="1.6" /> })}</g>
}
function MiniNeurone({ x, y, w = 80, colour, fill }: { x: number; y: number; w?: number; colour: string; fill: string }) {
  return <g>
    <path d={`M${x + 8} ${y}L${x + w - 10} ${y}M${x + w - 10} ${y}l8 -8M${x + w - 10} ${y}l9 0M${x + w - 10} ${y}l8 8`} stroke={colour} strokeWidth="3.5" fill="none" />
    <path d={`M${x - 2} ${y - 4}l-8 -6M${x - 2} ${y + 4}l-8 6`} stroke={colour} strokeWidth="2.5" />
    <circle cx={x} cy={y} r="8" fill={fill} stroke={colour} strokeWidth="2.2" />
    <Chevron at={[x + w / 2 + 6, y]} angle={0} colour={colour} size={8} />
  </g>
}
function ArmMuscle({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${k})`}>
    <path d="M-34 18L4 18L20-18" fill="none" stroke={skinLine} strokeWidth="19" /><path d="M-34 18L4 18L20-18" fill="none" stroke={skin} strokeWidth="15" />
    <circle cx="23" cy="-24" r="10" fill={skin} stroke={skinLine} strokeWidth="2" />
    <path d="M-28 12C-20 0-4-2 2 10C-6 16-20 16-28 12Z" fill={motorFill} stroke={motor} strokeWidth="2" />
  </g>
}
function Cup({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${k})`}>
    <path d="M-16-16H16L12 18H-12Z" fill="#f4e8de" stroke="#8a6d45" strokeWidth="2" /><path d="M-14-8H14" stroke="#8a6d45" strokeWidth="1.5" />
    <path d="M16-8C26-8 26 6 14 6" fill="none" stroke="#8a6d45" strokeWidth="2.2" />
    <path d="M-6-22q4-5 0-10M4-22q4-5 0-10" fill="none" stroke={muted} strokeWidth="2" />
  </g>
}
function Clock({ x, y, r = 18 }: { x: number; y: number; r?: number }) {
  return <g><circle cx={x} cy={y} r={r} fill="white" stroke={ink} strokeWidth="2.2" /><path d={`M${x} ${y}V${y - r * .62}M${x} ${y}L${x + r * .45} ${y + r * .2}`} stroke={ink} strokeWidth="2.2" />
    <path d={`M${x} ${y - r}A${r} ${r} 0 0 1 ${r1(x + r * Math.sin(Math.PI / 3))} ${r1(y - r * Math.cos(Math.PI / 3))}L${x} ${y}Z`} fill={sensFill} opacity=".9" /></g>
}
function Sun({ x, y, r = 16 }: { x: number; y: number; r?: number }) {
  return <g><circle cx={x} cy={y} r={r} fill={sun} stroke={sunLine} strokeWidth="1.8" />{Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return <path key={i} d={`M${r1(x + Math.cos(a) * (r + 5))} ${r1(y + Math.sin(a) * (r + 5))}L${r1(x + Math.cos(a) * (r + 11))} ${r1(y + Math.sin(a) * (r + 11))}`} stroke={sunLine} strokeWidth="2.5" /> })}</g>
}

// ---------- The body (front view), shared by Lessons 35 and 36 ----------
type Seg = { p: Pt; c?: [Pt, Pt] }
function mirrorPath(start: Pt, segs: Seg[], cx = 300) {
  const m = ([x, y]: Pt): Pt => [2 * cx - x, y], f = ([x, y]: Pt) => `${x} ${y}`
  let d = `M${f(start)}`
  for (const s of segs) d += s.c ? `C${f(s.c[0])} ${f(s.c[1])} ${f(s.p)}` : `L${f(s.p)}`
  const pts = [start, ...segs.map(s => s.p)]
  for (let i = segs.length - 1; i >= 0; i--) { const s = segs[i], to = m(pts[i]); d += s.c ? `C${f(m(s.c[1]))} ${f(m(s.c[0]))} ${f(to)}` : `L${f(to)}` }
  return d + 'Z'
}
const BODY = mirrorPath([309, 80], [
  { p: [310, 96] }, { c: [[330, 98], [349, 103]], p: [357, 116] }, { c: [[364, 127], [367, 141]], p: [369, 156] }, { p: [386, 244] },
  { c: [[389, 262], [386, 278]], p: [376, 282] }, { c: [[366, 285], [359, 278]], p: [358, 266] }, { p: [352, 250] }, { p: [343, 170] },
  { c: [[342, 164], [339, 163]], p: [337, 168] }, { p: [336, 246] }, { c: [[338, 262], [339, 272]], p: [337, 284] }, { p: [334, 398] },
  { c: [[336, 406], [346, 408]], p: [348, 416] }, { p: [306, 416] }, { p: [304, 302] }, { c: [[303, 295], [301, 293]], p: [300, 293] },
])
const FINGER: Pt = [373, 274], BRAIN: Pt = [300, 42], MUSCLE: Pt = [243, 192], GLAND: Pt = [319, 216], PANCREAS: Pt = [318, 204]
const SENSORY_ARM = 'M372 270C368 248 362 212 357 182C353 160 336 151 302 152'
const MOTOR_ARM = 'M298 162C282 160 266 166 256 176L249 184'
type BodyPart = 'cns' | 'eyes' | 'ears' | 'skin' | 'sensory' | 'motor' | 'muscle' | 'gland' | 'pancreas' | 'legs'
function Body({ parts, on, neutral = false, flow = false, cns = true }: { parts: BodyPart[]; on: (p: BodyPart) => boolean; neutral?: boolean; flow?: boolean; cns?: boolean }) {
  const has = (p: BodyPart) => parts.includes(p)
  const o = (p: BodyPart) => on(p) ? 1 : faded
  const sColour = neutral ? ink : sens, mColour = neutral ? ink : motor
  return <g>
    <path d={BODY} fill={skin} stroke={skinLine} strokeWidth="2" />
    <circle cx={300} cy={54} r={29} fill={skin} stroke={skinLine} strokeWidth="2" />
    <g>{[-1, 1].map(s => <path key={s} d={`M${300 + s * 28} 48C${300 + s * 36} 46 ${300 + s * 37} 62 ${300 + s * 28} 64`} fill={skin} stroke={on('ears') && has('ears') ? sens : skinLine} strokeWidth={on('ears') && has('ears') ? 3 : 2} />)}</g>
    <g>{[-1, 1].map(s => <g key={s}><path d={`M${300 + s * 11 - 6} 64Q${300 + s * 11} 57 ${300 + s * 11 + 6} 64Q${300 + s * 11} 69 ${300 + s * 11 - 6} 64Z`} fill="white" stroke={on('eyes') && has('eyes') ? sens : ink} strokeWidth="1.6" /><circle cx={300 + s * 11} cy={64} r="2.6" fill={on('eyes') && has('eyes') ? sens : ink} /></g>)}</g>
    {has('legs') && <g opacity={o('legs')} fill="none" stroke={neutral ? ink : muted} strokeWidth="2.2"><path d="M300 248C292 284 287 330 285 396" /><path d="M300 248C308 284 313 330 315 396" /></g>}
    {has('pancreas') && <g opacity={o('pancreas')}><path d={`M${PANCREAS[0] - 20} ${PANCREAS[1] + 3}C${PANCREAS[0] - 12} ${PANCREAS[1] - 6} ${PANCREAS[0] + 10} ${PANCREAS[1] - 10} ${PANCREAS[0] + 20} ${PANCREAS[1] - 6}C${PANCREAS[0] + 22} ${PANCREAS[1] + 2} ${PANCREAS[0] + 4} ${PANCREAS[1] + 6} ${PANCREAS[0] - 20} ${PANCREAS[1] + 3}Z`} fill={relayFill} stroke={relay} strokeWidth="2" /></g>}
    {has('gland') && <g opacity={o('gland')}>{!neutral && has('motor') && <path d={`M300 206C308 208 312 212 ${GLAND[0] - 6} ${GLAND[1] - 2}`} fill="none" stroke={mColour} strokeWidth="2.5" />}<path d={`M${GLAND[0] - 8} ${GLAND[1] + 6}C${GLAND[0] - 10} ${GLAND[1] - 4} ${GLAND[0] - 2} ${GLAND[1] - 9} ${GLAND[0] + 6} ${GLAND[1] - 6}C${GLAND[0] + 12} ${GLAND[1] - 2} ${GLAND[0] + 10} ${GLAND[1] + 8} ${GLAND[0] - 8} ${GLAND[1] + 6}Z`} fill={motorFill} stroke={motor} strokeWidth="2" /></g>}
    {has('muscle') && <g opacity={o('muscle')}><ellipse cx={MUSCLE[0]} cy={MUSCLE[1]} rx="7.5" ry="21" transform={`rotate(8 ${MUSCLE[0]} ${MUSCLE[1]})`} fill={motorFill} stroke={motor} strokeWidth="2" /></g>}
    {cns && <g opacity={o('cns')}>
      <path d="M300 54V250" stroke={relay} strokeWidth="5.5" />
      <ellipse cx={BRAIN[0]} cy={BRAIN[1]} rx="20" ry="13" fill={relayFill} stroke={relay} strokeWidth="2.2" />
      <path d="M288 38C292 42 290 46 294 48M300 32C298 38 304 40 302 46M311 36C308 42 314 44 312 49" fill="none" stroke={relay} strokeWidth="1.5" />
    </g>}
    {has('sensory') && <g opacity={o('sensory')}>
      <Nerve d={SENSORY_ARM} colour={sColour} width={3} dashed={flow} marks={neutral || flow ? [] : [[365, 226, -98], [330, 153, 178]]} />
      {!neutral && !flow && <Nerve d="M311 62C310 56 307 53 304 50" colour={sColour} width={2.5} />}
    </g>}
    {has('motor') && <g opacity={o('motor')}><Nerve d={MOTOR_ARM} colour={mColour} width={3} dashed={flow} marks={neutral || flow ? [] : [[276, 163, 165]]} /></g>}
    {has('skin') && <g opacity={o('skin')}>{[[370, 272], [376, 276], [372, 279], [377, 270]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.6" fill={sens} />)}</g>}
  </g>
}

// ---------- Lesson 36: the nervous system on the body ----------
function NervousBody({ focus, assessment }: { focus: string; assessment: boolean }) {
  const step = focus.replace('nerve-ns-', '')
  if (step === 'question') {
    return <AnatomyFigure title="Parts of the nervous system" height={430}
      description={assessment ? 'A front view of a person with four numbered parts: 1 in the face, 2 in the head, 3 in the upper arm and 4 running down the back. Original schematic, not to scale.' : 'A front view of a person. 1 is an eye, a receptor. 2 is the brain and 4 is the spinal cord; together they form the CNS. 3 is a muscle in the arm, an effector. Original schematic, not to scale.'}
      labels={assessment ? undefined : [
        { mark: '1', name: 'Eye', detail: 'Contains receptors that detect light.' },
        { mark: '2', name: 'Brain', detail: 'Part of the CNS.', active: true },
        { mark: '3', name: 'Arm muscle', detail: 'An effector: it contracts.' },
        { mark: '4', name: 'Spinal cord', detail: 'Part of the CNS.', active: true },
      ]} note={assessment ? 'Original schematic, not to scale.' : 'The brain and spinal cord together make up the CNS. Original schematic, not to scale.'}>
      {() => <>
        <Body parts={['muscle', 'legs']} on={() => true} />
        <Pointer mark="1" x={440} y={96} toX={313} toY={65} />
        <Pointer mark="2" x={150} y={34} toX={281} toY={40} />
        <Pointer mark="3" x={150} y={206} toX={241} toY={196} />
        <Pointer mark="4" x={440} y={150} toX={301} toY={136} />
      </>}
    </AnatomyFigure>
  }
  const lit: Record<string, BodyPart[]> = {
    cns: ['cns'], receptors: ['eyes', 'ears', 'skin'], neurones: ['sensory', 'motor', 'legs'], sensory: ['sensory', 'eyes', 'skin'], motor: ['motor'], effectors: ['muscle', 'gland'],
  }
  const activeMarks: Record<string, string[]> = { cns: ['1'], receptors: ['2'], neurones: ['3', '4'], sensory: ['3'], motor: ['4'], effectors: ['5'] }
  const on = (p: BodyPart) => (lit[step] || []).includes(p)
  const act = (m: string) => (activeMarks[step] || []).includes(m)
  const labels: AnatomyLabel[] = [
    { mark: '1', name: 'CNS: brain and spinal cord', detail: 'The coordination centre of the nervous system.', active: act('1') },
    { mark: '2', name: 'Receptors', detail: 'Detect stimuli: light in the eyes, sound in the ears, touch in the skin.', active: act('2') },
    { mark: '3', name: 'Sensory neurone', detail: step === 'neurones' ? 'A nerve cell carrying impulses into the CNS.' : 'Carries impulses from receptors to the CNS.', active: act('3') },
    { mark: '4', name: 'Motor neurone', detail: step === 'neurones' ? 'A nerve cell carrying impulses out of the CNS.' : 'Carries impulses from the CNS to effectors.', active: act('4') },
    { mark: '5', name: 'Effectors', detail: 'Muscles contract; glands release hormones.', active: act('5') },
  ]
  const descriptions: Record<string, string> = {
    cns: 'A front view of a person. The brain and the spinal cord, running down the back, are highlighted: together they are the central nervous system (CNS).',
    receptors: 'A front view of a person. Receptors are highlighted in the eyes, which detect light, the ears, which detect sound, and the skin of a fingertip, which detects touch.',
    neurones: 'A front view of a person. Neurones, long thin nerve cells, run from the spinal cord out to the arms and legs.',
    sensory: 'A front view of a person. A sensory neurone carries impulses from receptors in a fingertip up the arm to the spinal cord. Another runs from the eye to the brain.',
    motor: 'A front view of a person. A motor neurone carries impulses from the spinal cord out to a muscle in the other arm.',
    effectors: 'A front view of a person. Effectors are highlighted: a muscle in the arm, which contracts, and a gland, which releases hormones.',
  }
  const parts: BodyPart[] = ['eyes', 'ears', 'skin', 'sensory', 'motor', 'muscle', 'gland', 'legs']
  return <AnatomyFigure title="The nervous system" height={430} description={`${descriptions[step] || descriptions.cns} Original schematic, not to scale.`} labels={labels}
    note="Neurones are drawn as single lines. Blue = towards the CNS; red = away from the CNS. Original schematic, not to scale.">
    {() => <>
      <Body parts={parts} on={p => p === 'cns' ? step === 'cns' || step === 'neurones' || step === 'sensory' || step === 'motor' : on(p)} neutral={step === 'neurones'} />
      {step === 'receptors' && <g>
        {[[222, 90], [230, 106]].map(([x, y], i) => <Arrow key={i} x1={x} y1={y} x2={283 + i * 2} y2={67 + i * 2} colour={sunLine} width={1.8} />)}
        <Text x={216} y={100} lines={['light']} size={13} bold colour={sunLine} anchor="end" />
        {[12, 20, 28].map(r => <path key={r} d={`M${340 + r * .4} ${56 - r}A${r} ${r} 0 0 1 ${340 + r * .4} ${56 + r}`} fill="none" stroke={sens} strokeWidth="2" opacity=".75" />)}
        <Text x={392} y={30} lines={['sound']} size={13} bold colour={sens} anchor="start" />
        <Text x={396} y={300} lines={['touch']} size={13} bold colour={sens} anchor="start" />
      </g>}
      <Pointer mark="1" x={150} y={34} toX={281} toY={40} active={act('1')} />
      <Pointer mark="1" x={450} y={138} toX={301} toY={132} active={act('1')} />
      <Pointer mark="2" x={450} y={78} toX={333} toY={60} active={act('2')} />
      <Pointer mark="3" x={450} y={196} toX={361} toY={204} active={act('3')} />
      <Pointer mark="4" x={150} y={124} toX={268} toY={164} active={act('4')} />
      <Pointer mark="5" x={150} y={236} toX={243} toY={206} active={act('5')} />
      <Pointer mark="5" x={450} y={262} toX={327} toY={218} active={act('5')} />
    </>}
  </AnatomyFigure>
}

// ---------- Lesson 35: the three parts of a control system on the body ----------
function Wind({ on = true }: { on?: boolean }) {
  return <g opacity={on ? 1 : faded} fill="none" stroke={water} strokeWidth="2.6">
    {[250, 272, 294].map((y, i) => <path key={y} d={`M${470 - i * 8} ${y}C${452 - i * 8} ${y - 8} ${440 - i * 8} ${y + 8} ${420 - i * 8} ${y}`} />)}
    <Arrow x1={420} y1={272} x2={398} y2={272} colour={water} width={2.6} />
    {[[478, 238], [486, 262], [480, 300]].map(([x, y], i) => <g key={i} stroke={water} strokeWidth="1.8"><path d={`M${x - 5} ${y}H${x + 5}M${x} ${y - 5}V${y + 5}M${x - 3.5} ${y - 3.5}L${x + 3.5} ${y + 3.5}M${x - 3.5} ${y + 3.5}L${x + 3.5} ${y - 3.5}`} /></g>)}
  </g>
}
function ControlBody({ focus, assessment }: { focus: string; assessment: boolean }) {
  const step = focus.replace('nerve-parts-', '')
  if (step === 'question') {
    return <AnatomyFigure title="A control system in the body" height={430}
      description={assessment ? 'A front view of a person standing in a cold wind, with three numbered parts: 1 in the skin of a fingertip, 2 in the head and 3 in the upper arm. Original schematic, not to scale.' : 'A front view of a person standing in a cold wind. 1 is a receptor in the skin of a fingertip. 2 is the brain, a coordination centre. 3 is a muscle in the arm, an effector. Original schematic, not to scale.'}
      labels={assessment ? undefined : [
        { mark: '1', name: 'Receptor', detail: 'In the skin: detects the drop in temperature.' },
        { mark: '2', name: 'Coordination centre', detail: 'The brain: processes the information and organises a response.', active: true },
        { mark: '3', name: 'Effector', detail: 'A muscle: produces the response.' },
      ]} note="Original schematic, not to scale.">
      {() => <>
        <Body parts={['skin', 'muscle']} on={() => true} />
        <Wind />
        <Pointer mark="1" x={470} y={352} toX={375} toY={278} />
        <Pointer mark="2" x={150} y={34} toX={281} toY={40} />
        <Pointer mark="3" x={150} y={206} toX={241} toY={196} />
      </>}
    </AnatomyFigure>
  }
  const all = step === 'all'
  const on = (p: BodyPart) => all || (step === 'receptor' && p === 'skin') || (step === 'centre' && (p === 'cns' || p === 'pancreas')) || (step === 'effector' && p === 'muscle')
  const act = (m: string) => all || { stimulus: '1', receptor: '2', centre: '3', effector: '4' }[step] === m
  const descriptions: Record<string, string> = {
    stimulus: 'A person stands in a cold wind. The drop in temperature around them, shown by wind lines and snowflakes, is the stimulus.',
    receptor: 'The same person. Receptors in the skin of a fingertip are highlighted: they detect the drop in temperature.',
    centre: 'The same person. The coordination centres are highlighted: the brain, the spinal cord and the pancreas.',
    effector: 'The same person. A muscle in the arm is highlighted: it is an effector, which produces a response.',
    all: 'The whole control system. Receptors in the skin detect the cold. Information goes to the brain, a coordination centre. The brain organises a response, and information goes on to a muscle, the effector.',
  }
  return <AnatomyFigure title="The three parts of a control system" height={430} description={`${descriptions[step] || descriptions.all} Original schematic, not to scale.`}
    labels={[
      { mark: '1', name: 'Stimulus', detail: 'A change in the environment: here the air gets colder.', active: act('1') },
      { mark: '2', name: 'Receptors', detail: 'Cells that detect the stimulus, here in the skin.', active: act('2') },
      { mark: '3', name: 'Coordination centres', detail: 'The brain, spinal cord and pancreas. They process information and organise a response.', active: act('3') },
      { mark: '4', name: 'Effectors', detail: 'Parts that produce the response, such as muscles.', active: act('4') },
    ]} note={all ? 'Dashed lines show the route of the information: receptor → coordination centre → effector. Original schematic, not to scale.' : 'Original schematic, not to scale.'}>
    {() => <>
      <Body parts={['skin', 'muscle', 'pancreas', ...(all ? ['sensory', 'motor'] as BodyPart[] : [])]} on={p => (all && (p === 'sensory' || p === 'motor')) || on(p)} flow />
      <Wind on={step === 'stimulus' || all} />
      <Pointer mark="1" x={500} y={200} toX={452} toY={252} active={act('1')} />
      <Pointer mark="2" x={470} y={352} toX={375} toY={278} active={act('2')} />
      <Pointer mark="3" x={150} y={34} toX={281} toY={40} active={act('3')} />
      <Pointer mark="3" x={150} y={110} toX={300} toY={120} active={act('3')} />
      <Pointer mark="3" x={470} y={150} toX={330} toY={200} active={act('3')} />
      <Pointer mark="4" x={150} y={206} toX={241} toY={196} active={act('4')} />
    </>}
  </AnatomyFigure>
}

// ---------- Lesson 35: why levels are kept steady ----------
function Gauge({ y, title, icon, level = 0, dim = false }: { y: number; title: string; icon: ReactNode; level?: number; dim?: boolean }) {
  const x0 = 300, w = 210, band: [number, number] = [x0 + 72, x0 + 138], mx = x0 + w / 2 + level
  return <g opacity={dim ? faded : 1}>
    {icon}
    <text x={x0} y={y - 20} fill={ink} fontSize="14" fontWeight="700">{title}</text>
    <rect x={x0} y={y} width={w} height={16} rx="8" fill="#eef2f5" stroke={panelLine} strokeWidth="1.5" />
    <rect x={band[0]} y={y} width={band[1] - band[0]} height={16} fill={optFill} stroke={opt} strokeWidth="1.8" />
    <path d={`M${mx} ${y - 1}l-6 -9h12z`} fill={ink} />
    <text x={x0} y={y + 32} fill={muted} fontSize="12">low</text><text x={x0 + w} y={y + 32} textAnchor="end" fill={muted} fontSize="12">high</text>
    <text x={(band[0] + band[1]) / 2} y={y + 32} textAnchor="middle" fill={opt} fontSize="12" fontWeight="700">right level</text>
  </g>
}
function Thermo({ x, y }: { x: number; y: number }) {
  return <g><rect x={x - 5} y={y - 22} width="10" height="30" rx="5" fill="white" stroke={ink} strokeWidth="1.8" /><circle cx={x} cy={y + 12} r="8" fill={motor} stroke={ink} strokeWidth="1.8" /><rect x={x - 2} y={y - 10} width="4" height="18" fill={motor} /></g>
}
function Hex({ x, y, r = 11 }: { x: number; y: number; r?: number }) {
  return <path d={Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 6 + i * Math.PI / 3; return `${i ? 'L' : 'M'}${r1(x + Math.cos(a) * r)} ${r1(y + Math.sin(a) * r)}` }).join('') + 'Z'} fill={amberFill} stroke={amber} strokeWidth="2" />
}
function Drop({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return <path d={`M${x} ${y - 16 * k}C${x + 6 * k} ${y - 6 * k} ${x + 11 * k} ${y} ${x + 11 * k} ${y + 5 * k}A${11 * k} ${11 * k} 0 0 1 ${x - 11 * k} ${y + 5 * k}C${x - 11 * k} ${y} ${x - 6 * k} ${y - 6 * k} ${x} ${y - 16 * k}Z`} fill={waterFill} stroke={water} strokeWidth="2" />
}
function EnzymeShape({ x, y, hot = false }: { x: number; y: number; hot?: boolean }) {
  const d = hot
    ? `M${x - 36} ${y - 6}C${x - 40} ${y - 30} ${x - 6} ${y - 40} ${x + 18} ${y - 30}C${x + 30} ${y - 22} ${x + 22} ${y - 10} ${x + 30} ${y - 2}C${x + 40} ${y + 10} ${x + 34} ${y + 30} ${x + 8} ${y + 34}C${x - 20} ${y + 38} ${x - 34} ${y + 20} ${x - 36} ${y - 6}Z`
    : `M${x - 36} ${y - 6}C${x - 38} ${y - 30} ${x - 6} ${y - 38} ${x + 26} ${y - 26}L${x + 26} ${y - 12}L${x + 10} ${y - 12}L${x + 10} ${y + 12}L${x + 26} ${y + 12}L${x + 26} ${y + 26}C${x - 6} ${y + 38} ${x - 38} ${y + 22} ${x - 36} ${y - 6}Z`
  return <path d={d} fill={enzymeFill} stroke={enzymeLine} strokeWidth="2.2" />
}
const HOME_BODY = 'translate(-105 5) scale(.66)'
function HomeScene({ focus }: { focus: string }) {
  const step = focus.replace('nerve-home-', '')
  const titles: Record<string, string> = {
    levels: 'A person, with three gauges beside them: body temperature (about 37 °C), blood glucose and water level. Each pointer sits in the green band, at the right level.',
    enzyme: 'Two close-ups of an enzyme. At the right temperature, the substrate fits the active site. When much too hot, the enzyme has changed shape, the substrate no longer fits and the enzyme stops working.',
    changes: 'The person on a hot day while their muscles work hard. These are changes outside and inside the body, but all three gauges still show the right level. This is homeostasis.',
    control: 'The person with their nervous system highlighted in purple, and a blood vessel carrying hormones, shown as small dots. Control systems use nerves or hormones.',
  }
  const gaugeDim = step === 'control'
  return <Figure title={titles[step] || titles.levels}>
    <g transform={HOME_BODY}>
      <Body parts={step === 'control' ? ['legs'] : []} on={() => true} cns={step === 'control'} />
      {step === 'changes' && <g><ellipse cx={287} cy={340} rx="10" ry="34" fill={motorFill} stroke={motor} strokeWidth="2.4" /><ellipse cx={313} cy={340} rx="10" ry="34" fill={motorFill} stroke={motor} strokeWidth="2.4" /></g>}
      {step === 'control' && <g>
        <path d="M322 110C340 150 342 230 330 300C320 330 312 360 314 396" fill="none" stroke={motor} strokeWidth="5" opacity=".75" />
        {[[331, 150], [338, 200], [334, 250], [322, 330]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill="#d0679a" stroke="#9b3f6c" strokeWidth="1.5" />)}
        <path d="M300 150C280 150 262 160 250 190M300 150C320 150 336 160 348 190" fill="none" stroke={relay} strokeWidth="3" />
      </g>}
    </g>
    {step === 'enzyme' ? <g>
      <Tile x={236} y={40} w={140} h={220} tint="#f5fbf6" line={opt}>
        <Text x={306} y={66} lines={['right', 'temperature']} size={14} bold colour={opt} />
        <EnzymeShape x={298} y={160} /><rect x={309} y={148} width={15} height={24} rx="2" fill="#b9cdd9" stroke={ink} strokeWidth="1.5" /><text x={292} y={212} textAnchor="middle" fill={muted} fontSize="12">enzyme</text><Label x={352} y={112} to={[322, 150]} lines={['substrate']} size={12} anchor="middle" />
        <Text x={306} y={232} lines={['substrate fits:', 'enzyme works']} size={12.5} />
      </Tile>
      <Tile x={388} y={40} w={140} h={220} tint="#fdf3f1" line={motor}>
        <Text x={458} y={66} lines={['much too', 'hot']} size={14} bold colour={motor} />
        <EnzymeShape x={450} y={160} hot /><rect x={494} y={108} width={15} height={24} rx="2" fill="#b9cdd9" stroke={ink} strokeWidth="1.5" transform="rotate(20 501 120)" /><text x={450} y={212} textAnchor="middle" fill={muted} fontSize="12">enzyme</text>
        <Text x={458} y={232} lines={['shape changed:', 'stops working']} size={12.5} />
      </Tile>
      <Text x={306} y={28} lines={['inside a cell']} size={13} bold anchor="middle" />
    </g> : <g>
      <Gauge y={62} title="temperature: about 37 °C" icon={<Thermo x={272} y={62} />} level={step === 'changes' ? 6 : 0} dim={gaugeDim} />
      <Gauge y={146} title="blood glucose" icon={<Hex x={272} y={152} />} level={step === 'changes' ? -5 : -3} dim={gaugeDim} />
      <Gauge y={230} title="water level" icon={<Drop x={272} y={236} k={.9} />} level={step === 'changes' ? -6 : 4} dim={gaugeDim} />
    </g>}
    {step === 'changes' && <g>
      <Sun x={192} y={42} r={15} />
      <Text x={192} y={92} lines={['outside:', 'a hot day']} size={13} bold />
      <Label x={192} y={206} to={[99, 228]} lines={['inside:', 'muscles', 'working hard']} anchor="middle" strong size={13} />
    </g>}
    {step === 'control' && <g>
      <Label x={176} y={78} to={[93, 104]} lines={['nerves']} strong colour={relay} size={13} />
      <Label x={176} y={184} to={[117, 174]} lines={['hormones', 'in the blood']} strong colour="#9b3f6c" size={13} />
    </g>}
  </Figure>
}

// ---------- Lesson 35: too high, too low and the optimum ----------
function LoopBox({ y, n, name, action, colour, fill, on, hide = false }: { y: number; n?: number; name: string; action: string; colour: string; fill: string; on: boolean; hide?: boolean }) {
  return <g opacity={on ? 1 : faded}>
    <rect x={290} y={y} width={236} height={62} rx="12" fill={hide ? panel : fill} stroke={hide ? ink : colour} strokeWidth="2" />
    {n !== undefined && <Badge n={n} x={312} y={y + 31} />}
    {!hide && <><text x={n !== undefined ? 336 : 306} y={y + 26} fill={colour} fontSize="15" fontWeight="700">{name}</text><text x={n !== undefined ? 336 : 306} y={y + 46} fill={ink} fontSize="13">{action}</text></>}
  </g>
}
function Loop({ focus, assessment }: { focus: string; assessment: boolean }) {
  const step = focus.replace('nerve-loop-', '')
  const question = step === 'question', hide = question && assessment
  const level = step === 'high' || step === 'question' ? 70 : step === 'low' ? 230 : 150
  const boxesOn = step !== 'optimum'
  const titles: Record<string, string> = {
    optimum: 'A level gauge with a green band in the middle: the optimum, or ideal, level. The pointer is at the optimum. Beside it, the three parts of a control system are faded.',
    high: 'The level has risen too high. A receptor detects the change, the coordination centre organises a response, and the effector decreases the level back towards the optimum.',
    low: 'The level has fallen too low. A receptor detects the change, the coordination centre organises a response, and the effector increases the level back towards the optimum.',
    all: 'The whole control system. If the level is too high, it is decreased; if it is too low, it is increased. Either way it is brought back towards the optimum.',
    question: assessment ? 'A level gauge showing the level too high, and three numbered boxes joined by arrows: from the gauge to box 3, from box 3 to box 1, from box 1 to box 2, and from box 2 back to the gauge. The box names are hidden.' : 'A level gauge showing the level too high, and the three parts of a control system: 3 is the receptor, which detects the change; 1 is the coordination centre; 2 is the effector, which brings the level back to the optimum.',
  }
  const order = question ? [3, 1, 2] : [undefined, undefined, undefined]
  const returnText = step === 'high' ? ['level', 'decreases'] : step === 'low' ? ['level', 'increases'] : ['back to the', 'optimum']
  return <Figure title={titles[step] || titles.all} viewBox="0 0 540 300">
    <g>
      <text x={132} y={30} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">level</text>
      <rect x={112} y={42} width={40} height={216} rx="10" fill="#eef2f5" stroke={ink} strokeWidth="1.8" />
      <rect x={112} y={122} width={40} height={56} fill={optFill} stroke={opt} strokeWidth="2" />
      <text x={100} y={86} textAnchor="end" fill={muted} fontSize="13" fontWeight="600">too high</text>
      <text x={100} y={155} textAnchor="end" fill={opt} fontSize="14" fontWeight="700">optimum</text>
      <text x={100} y={226} textAnchor="end" fill={muted} fontSize="13" fontWeight="600">too low</text>
      <path d={`M112 ${level}H152`} stroke={ink} strokeWidth="3" />
      <path d={`M154 ${level}l12 -7v14z`} fill={ink} />
      {(step === 'high' || step === 'all' || step === 'question') && <Arrow x1={132} y1={step === 'all' ? 60 : level + 8} x2={132} y2={116} colour={ink} width={3.5} />}
      {(step === 'low' || step === 'all') && <Arrow x1={132} y1={step === 'all' ? 240 : level - 8} x2={132} y2={184} colour={ink} width={3.5} />}
      {step === 'optimum' && <Text x={132} y={284} lines={['the ideal level']} size={13} bold colour={opt} />}
    </g>
    <g opacity={boxesOn ? 1 : faded}>
      <path d={`M178 ${level}C230 ${level} 236 56 276 56`} fill="none" stroke={ink} strokeWidth="2.2" strokeDasharray="6 5" />
      <Arrow x1={276} y1={56} x2={288} y2={56} colour={ink} width={2.2} />
      <Arrow x1={408} y1={90} x2={408} y2={118} colour={ink} width={2.5} />
      <Arrow x1={408} y1={184} x2={408} y2={212} colour={ink} width={2.5} />
      <path d="M288 244C230 244 200 200 178 164" fill="none" stroke={ink} strokeWidth="2.5" />
      <Arrow x1={180} y1={168} x2={170} y2={152} colour={ink} width={2.5} />
      {boxesOn && !question && <Text x={226} y={270} lines={returnText} size={13} bold colour={step === 'all' ? opt : ink} />}
    </g>
    <LoopBox y={26} n={order[0]} name="receptor" action="detects the change" colour={sens} fill={sensFill} on={boxesOn} hide={hide} />
    <LoopBox y={120} n={order[1]} name="coordination centre" action="organises a response" colour={relay} fill={relayFill} on={boxesOn} hide={hide} />
    <LoopBox y={214} n={order[2]} name="effector" action="produces a response" colour={motor} fill={motorFill} on={boxesOn} hide={hide} />
  </Figure>
}

// ---------- Lesson 35: one person's temperature (invented data) ----------
function TempData() {
  const data: Array<[number, number]> = [[8, 36.7], [10, 36.9], [12, 37.1], [14, 37.2], [16, 36.9], [18, 37.3], [20, 37.0]]
  const X = (h: number) => 80 + (h - 8) * 36, Y = (t: number) => 230 - (t - 36) * 90
  return <Figure schematic={false} title="Line graph of one person’s body temperature, measured every 2 hours from 08:00 to 20:00. The vertical axis runs from 36.0 to 38.0 degrees Celsius, with a dashed line at 37.0. The readings are 36.7, 36.9, 37.1, 37.2, 36.9, 37.3 and 37.0. Invented data for practice.">
    <text x={80} y={24} fill={ink} fontSize="14" fontWeight="700">One person’s body temperature during a day</text>
    <path d={`M80 230H528M80 230V44`} stroke={ink} strokeWidth="2" />
    {[36, 36.5, 37, 37.5, 38].map(t => <g key={t}><path d={`M74 ${Y(t)}H80`} stroke={ink} /><text x={70} y={Y(t) + 4} textAnchor="end" fill={ink} fontSize="12">{t.toFixed(1)}</text></g>)}
    <path d={`M80 ${Y(37)}H520`} stroke={opt} strokeWidth="1.8" strokeDasharray="6 5" />
    <text x={88} y={Y(37) - 8} fill={opt} fontSize="12" fontWeight="700">37.0 °C</text>
    {data.map(([h]) => <g key={h}><path d={`M${X(h)} 230V236`} stroke={ink} /><text x={X(h)} y={250} textAnchor="middle" fill={ink} fontSize="12">{`${String(h).padStart(2, '0')}:00`}</text></g>)}
    <path d={data.map(([h, t], i) => `${i ? 'L' : 'M'}${X(h)} ${r1(Y(t))}`).join('')} fill="none" stroke={motor} strokeWidth="3" />
    {data.map(([h, t]) => <circle key={h} cx={X(h)} cy={r1(Y(t))} r="4.5" fill={motor} />)}
    <text x={300} y={274} textAnchor="middle" fill={ink} fontSize="13">time of day</text>
    <text x={18} y={137} textAnchor="middle" fill={ink} fontSize="13" transform="rotate(-90 18 137)">temperature (°C)</text>
  </Figure>
}

// ---------- Lesson 36: stimulus to response (a goalkeeper) ----------
const PATH_TILES: Array<{ n: number; name: string[]; sub: string; x: number; y: number }> = [
  { n: 1, name: ['stimulus'], sub: 'the moving ball', x: 12, y: 30 }, { n: 2, name: ['receptor'], sub: 'light receptors', x: 144, y: 30 },
  { n: 3, name: ['sensory', 'neurone'], sub: '', x: 276, y: 30 }, { n: 4, name: ['CNS'], sub: 'the brain decides', x: 408, y: 30 },
  { n: 5, name: ['motor', 'neurone'], sub: '', x: 78, y: 176 }, { n: 6, name: ['effector'], sub: 'arm muscles', x: 210, y: 176 },
  { n: 7, name: ['response'], sub: 'catches the ball', x: 342, y: 176 },
]
function PathwayChain({ focus }: { focus: string }) {
  const step = focus.replace('nerve-path-', '')
  const lit: Record<string, number[]> = { receptor: [1, 2], sensory: [3], cns: [4], motor: [5, 6], all: [1, 2, 3, 4, 5, 6, 7] }
  const on = (n: number) => (lit[step] || lit.all).includes(n)
  const tints = ['#f4f6f8', sensFill, sensFill, relayFill, motorFill, motorFill, '#eef6ee']
  const lines = [panelLine, sens, sens, relay, motor, motor, opt]
  const titles: Record<string, string> = {
    receptor: 'Step 1 and 2: the moving football is the stimulus, and light receptors in the goalkeeper’s eyes detect it.',
    sensory: 'Step 3: a sensory neurone carries electrical impulses from the receptors to the CNS.',
    cns: 'Step 4: the CNS, here the brain, receives the information and coordinates a response.',
    motor: 'Steps 5 and 6: motor neurones carry impulses from the CNS to the arm muscles, the effectors, which contract.',
    all: 'The whole pathway: stimulus, receptor, sensory neurone, CNS, motor neurone, effector, response. The goalkeeper catches the ball.',
  }
  const icon = (n: number, cx: number, cy: number) => {
    if (n === 1) return <g><Ball x={cx + 8} y={cy} r={17} /><path d={`M${cx - 30} ${cy - 8}H${cx - 14}M${cx - 36} ${cy}H${cx - 14}M${cx - 30} ${cy + 8}H${cx - 14}`} stroke={muted} strokeWidth="2.2" /></g>
    if (n === 2) return <Eye x={cx} y={cy} k={1.05} lit />
    if (n === 3) return <MiniNeurone x={cx - 30} y={cy} w={70} colour={sens} fill={sensFill} />
    if (n === 4) return <Brain x={cx} y={cy + 2} k={1.05} />
    if (n === 5) return <MiniNeurone x={cx - 30} y={cy} w={70} colour={motor} fill={motorFill} />
    if (n === 6) return <ArmMuscle x={cx + 4} y={cy + 2} k={.95} />
    return <g><Ball x={cx} y={cy} r={14} />{[-1, 1].map(s => <path key={s} d={`M${cx + s * 14} ${cy - 20}C${cx + s * 30} ${cy - 16} ${cx + s * 30} ${cy + 16} ${cx + s * 14} ${cy + 20}C${cx + s * 22} ${cy + 8} ${cx + s * 22} ${cy - 8} ${cx + s * 14} ${cy - 20}Z`} fill={jumper} stroke={jumperLine} strokeWidth="2" />)}</g>
  }
  return <Figure title={titles[step] || titles.all} viewBox="0 0 540 300">
    {PATH_TILES.map((t, i) => <Tile key={t.n} x={t.x} y={t.y} w={118} h={108} on={on(t.n)} tint={tints[i]} line={lines[i]}>
      <Badge n={t.n} x={t.x + 18} y={t.y + 18} />
      {icon(t.n, t.x + 59, t.y + 42)}
      <Text x={t.x + 59} y={t.name.length > 1 ? t.y + 78 : t.y + 84} lines={t.name} size={14} bold colour={lines[i] === panelLine ? ink : lines[i]} />
      {t.sub && <Text x={t.x + 59} y={t.y + 100} lines={[t.sub]} size={12} />}
    </Tile>)}
    {[[130, 274], [262, 406], [394, 538]].map(([a], i) => <g key={i} opacity={on(i + 1) && on(i + 2) ? 1 : .45}><Arrow x1={a + 1} y1={84} x2={a + 13} y2={84} colour={ink} width={2.5} /></g>)}
    <g opacity={on(4) && on(5) ? 1 : .45}><path d="M467 138C467 160 137 150 137 170" fill="none" stroke={ink} strokeWidth="2.5" /><Arrow x1={137} y1={164} x2={137} y2={175} colour={ink} width={2.5} /></g>
    {[[196, 208], [328, 340]].map(([a], i) => <g key={i} opacity={on(i + 5) && on(i + 6) ? 1 : .45}><Arrow x1={a + 1} y1={230} x2={a + 13} y2={230} colour={ink} width={2.5} /></g>)}
  </Figure>
}

// ---------- Lesson 36: the synapse ----------
function Synapse({ focus }: { focus: string }) {
  const step = focus.replace('nerve-syn-', '')
  const vesicles: Pt[] = [[226, 112], [236, 136], [226, 158], [252, 110], [254, 154]]
  const titles: Record<string, string> = {
    gap: 'Close-up of a synapse. The swollen end of neurone one, in blue, and the start of neurone two, in purple, are separated by a tiny gap.',
    release: 'An electrical impulse arrives at the end of neurone one. Small sacs at the end release chemicals, shown as teal dots, into the gap.',
    diffuse: 'The chemicals diffuse across the gap, from the end of neurone one towards the start of neurone two.',
    new: 'The chemicals reach neurone two and set off a new electrical impulse, which travels on along neurone two.',
  }
  const inGap: Pt[] = step === 'release' ? [[274, 112], [276, 132], [273, 150], [279, 122]] : step === 'diffuse' ? [[274, 100], [281, 116], [288, 106], [276, 132], [285, 140], [292, 126], [279, 156], [290, 160], [284, 90], [293, 148]] : step === 'new' ? [[295, 104], [296, 122], [295, 140], [296, 156], [294, 114], [295, 132]] : []
  return <Figure title={titles[step] || titles.gap} viewBox="0 0 540 250">
    {step === 'gap' && <rect x={268} y={72} width={32} height={116} rx="6" fill="#fff6d9" stroke={sunLine} strokeWidth="1.5" strokeDasharray="4 4" />}
    <path d="M10 118H190C214 112 226 84 252 80C266 80 270 102 270 130C270 158 266 180 252 180C226 176 214 148 190 142H10Z" fill={sensFill} stroke={sens} strokeWidth="2.4" />
    <path d="M298 130C298 96 302 80 316 80C340 84 360 110 382 116H530V144H382C360 150 340 176 316 180C302 180 298 164 298 130Z" fill={relayFill} stroke={relay} strokeWidth="2.4" />
    {vesicles.map(([x, y], i) => {
      const open = (step === 'release' || step === 'diffuse' || step === 'new') && i >= 3
      return <g key={i} opacity={open ? .5 : 1}><circle cx={x} cy={y} r="9" fill="white" stroke={sens} strokeWidth="1.8" />{!open && [[-3, -2], [3, -1], [0, 3]].map(([dx, dy], j) => <circle key={j} cx={x + dx} cy={y + dy} r="2.2" fill={chem} />)}</g>
    })}
    {inGap.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.2" fill={chem} />)}
    {step === 'diffuse' && [[272, 196, 294, 196]].map(([x1, y1, x2, y2], i) => <Arrow key={i} x1={x1} y1={y1} x2={x2} y2={y2} colour={chem} width={2.5} />)}
    {(step === 'release' || step === 'diffuse' || step === 'new') && <g opacity={step === 'release' ? 1 : .45}><Arrow x1={28} y1={130} x2={176} y2={130} colour={sens} width={3.5} /></g>}
    {step === 'new' && <Arrow x1={340} y1={130} x2={512} y2={130} colour={relay} width={3.5} />}
    <Label x={150} y={50} to={[222, 100]} lines={['end of neurone one']} anchor="middle" strong colour={sens} />
    <Label x={336} y={56} to={[326, 86]} lines={['start of neurone two']} strong colour={relay} />
    {step === 'gap' && <Label x={284} y={226} to={[284, 186]} lines={['a synapse, with a tiny gap']} anchor="middle" strong />}
    {step === 'release' && <><Text x={100} y={172} lines={['electrical impulse']} size={13} bold colour={sens} /><Label x={284} y={226} to={[276, 158]} lines={['chemicals released']} anchor="middle" strong colour={chem} /></>}
    {step === 'diffuse' && <Text x={284} y={226} lines={['chemicals diffuse across the gap']} size={14} bold colour={chem} />}
    {step === 'new' && <><Text x={430} y={172} lines={['new impulse']} size={13} bold colour={relay} /><Label x={284} y={226} to={[296, 158]} lines={['chemicals reach neurone two']} anchor="middle" strong colour={chem} /></>}
  </Figure>
}

// ---------- Lesson 36: the reflex arc (a rose thorn) ----------
const CORD: Pt = [480, 190], DORSAL: Pt = [444, 154], VENTRAL: Pt = [444, 230]
const R_SENSORY = `M90 286C100 274 108 264 120 252L232 142L350 112C396 100 432 120 ${DORSAL[0]} ${DORSAL[1]}`
const R_RELAY = `M${DORSAL[0]} ${DORSAL[1]}C466 172 466 212 ${VENTRAL[0]} ${VENTRAL[1]}`
const R_MOTOR = `M${VENTRAL[0]} ${VENTRAL[1]}C430 246 410 252 392 252C360 252 334 196 312 160`
type ReflexPart = 'receptor' | 'sensory' | 'relay' | 'motor' | 'muscle' | 'move'
function ReflexScene({ lit }: { lit: (p: ReflexPart) => boolean }) {
  const o = (p: ReflexPart) => lit(p) ? 1 : faded
  const [cx, cy] = CORD
  const grey = `M${cx} ${cy - 6}C${cx - 6} ${cy - 30} ${cx - 30} ${cy - 52} ${cx - 40} ${cy - 40}C${cx - 48} ${cy - 30} ${cx - 30} ${cy - 14} ${cx - 34} ${cy}C${cx - 40} ${cy + 16} ${cx - 54} ${cy + 36} ${cx - 40} ${cy + 46}C${cx - 26} ${cy + 54} ${cx - 8} ${cy + 28} ${cx} ${cy + 8}C${cx + 8} ${cy + 28} ${cx + 26} ${cy + 54} ${cx + 40} ${cy + 46}C${cx + 54} ${cy + 36} ${cx + 40} ${cy + 16} ${cx + 34} ${cy}C${cx + 30} ${cy - 14} ${cx + 48} ${cy - 30} ${cx + 40} ${cy - 40}C${cx + 30} ${cy - 52} ${cx + 6} ${cy - 30} ${cx} ${cy - 6}Z`
  return <g>
    {/* rose stem with thorns: one thorn touches the fingertip */}
    <path d="M72 404C74 360 70 330 74 296C76 270 72 250 76 222" fill="none" stroke={plantGreen} strokeWidth="7" />
    {[[74, 298, 1], [72, 246, -1], [73, 350, -1]].map(([x, y, s], i) => <path key={i} d={`M${x} ${y - 6}L${x + s * 17} ${y - 7}L${x} ${y + 5}Z`} fill={plantGreen} />)}
    <path d="M76 222C64 210 62 194 70 184C82 190 84 210 76 222Z" fill="#a9d49a" stroke={plantGreen} strokeWidth="1.6" />
    {/* the arm: upper arm, forearm, hand and pointing finger */}
    <path d="M360 118L232 150L138 234" fill="none" stroke={skinLine} strokeWidth="52" />
    <path d="M360 118L232 150L138 234" fill="none" stroke={skin} strokeWidth="48" />
    <g transform="translate(138 234) rotate(138)">
      <path d="M38 -15C54 -16 68 -14 73 -10C77 -6 75 0 68 0L38 1Z" fill={skin} stroke={skinLine} strokeWidth="2" />
      <path d="M-8 -23C10 -28 32 -26 42 -16C50 -8 50 12 42 21C32 29 8 29 -8 23Z" fill={skin} stroke={skinLine} strokeWidth="2" />
      <path d="M30 20C40 22 50 26 52 32C48 36 38 34 28 28" fill={skin} stroke={skinLine} strokeWidth="2" />
      <path d="M42 2C46 4 46 9 42 11" fill="none" stroke={skinLine} strokeWidth="1.6" />
    </g>
    <ellipse cx={298} cy={146} rx="44" ry="13" transform="rotate(-14 298 146)" fill={motorFill} stroke={motor} strokeWidth="2.2" opacity={o('muscle')} />
    {/* spinal cord, cut across */}
    <ellipse cx={cx} cy={cy} rx="86" ry="70" fill="#faf7fc" stroke={relay} strokeWidth="2.4" />
    <path d={grey} fill={relayFill} stroke={relay} strokeWidth="1.5" />
    <circle cx={cx} cy={cy + 1} r="3" fill="white" stroke={relay} strokeWidth="1.2" />
    <text x={cx} y={cy + 94} textAnchor="middle" fill={relay} fontSize="14" fontWeight="700">spinal cord (cut across)</text>
    {/* neurones */}
    <g opacity={o('sensory')}><Nerve d={R_SENSORY} colour={sens} width={3.5} marks={[[175, 199, -45], [292, 127, -14], [416, 116, 28]]} /></g>
    <g opacity={o('relay')}><Nerve d={R_RELAY} colour={relay} width={3.5} marks={[[461, 196, 95]]} /></g>
    <g opacity={o('motor')}><Nerve d={R_MOTOR} colour={motor} width={3.5} marks={[[412, 250, 172], [338, 204, -117]]} /></g>
    {[DORSAL, VENTRAL].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4.5" fill="white" stroke={ink} strokeWidth="1.8" opacity={lit('relay') ? 1 : faded} />)}
    <g opacity={o('receptor')}>{[[89, 289], [86, 285], [93, 284], [92, 291]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.6" fill={sens} />)}</g>
    <g opacity={lit('move') ? 1 : 0}><path d="M156 318C182 312 200 296 206 274" fill="none" stroke={motor} strokeWidth="3" /><Arrow x1={204} y1={284} x2={207} y2={266} colour={motor} width={3} />
      <Text x={218} y={300} lines={['hand pulls', 'away']} size={14} bold colour={motor} anchor="start" /></g>
  </g>
}
function Reflex({ focus, assessment }: { focus: string; assessment: boolean }) {
  const step = focus.replace('nerve-reflex-', '')
  if (step === 'question') {
    return <AnatomyFigure title="A reflex arc" height={410}
      description={assessment ? 'A finger touching a thorn, the arm, and the spinal cord cut across, with four numbered parts along the path between the finger and the arm muscle. Original schematic, not to scale.' : 'A reflex arc. 1 is the receptors in the fingertip. 4 is the sensory neurone running from the finger to the spinal cord. 3 is the relay neurone inside the spinal cord. 2 is the motor neurone running from the spinal cord to the arm muscle. Original schematic, not to scale.'}
      labels={assessment ? undefined : [
        { mark: '1', name: 'Receptors', detail: 'In the skin of the fingertip.' },
        { mark: '2', name: 'Motor neurone', detail: 'From the spinal cord to the muscle.' },
        { mark: '3', name: 'Relay neurone', detail: 'In the spinal cord: connects the sensory and motor neurones.', active: true },
        { mark: '4', name: 'Sensory neurone', detail: 'From the receptors to the spinal cord.' },
      ]} note="Original schematic, not to scale.">
      {() => <>
        <ReflexScene lit={p => p !== 'move'} />
        <Pointer mark="1" x={130} y={384} toX={90} toY={290} />
        <Pointer mark="2" x={360} y={320} toX={380} toY={250} />
        <Pointer mark="3" x={570} y={70} toX={462} toY={186} />
        <Pointer mark="4" x={130} y={120} toX={175} toY={199} />
      </>}
    </AnatomyFigure>
  }
  const lit: Record<string, string[]> = { quick: ['move', 'receptor'], sensory: ['receptor', 'sensory'], relay: ['relay'], motor: ['motor', 'muscle', 'move'], arc: ['receptor', 'sensory', 'relay', 'motor', 'muscle', 'move'] }
  const on = (p: string) => (lit[step] || lit.arc).includes(p)
  const act = (m: string) => ({ quick: [] as string[], sensory: ['1', '2'], relay: ['3'], motor: ['4', '5'], arc: ['1', '2', '3', '4', '5'] }[step] || []).includes(m)
  const titles: Record<string, string> = {
    quick: 'A finger touches a rose thorn and the hand pulls away at once, shown by curved arrows. The nerve pathway is faded.',
    sensory: 'Receptors in the fingertip detect the prick of the thorn. A sensory neurone, in blue, carries impulses up the arm to the spinal cord.',
    relay: 'Inside the spinal cord, a relay neurone, in purple, passes the impulses from the sensory neurone to the motor neurone. Small circles mark the synapses.',
    motor: 'A motor neurone, in red, carries impulses from the spinal cord to the muscle in the upper arm, the effector. The muscle contracts and the hand pulls away.',
    arc: 'The whole reflex arc: receptors in the fingertip, sensory neurone, relay neurone in the spinal cord, motor neurone, and the arm muscle, which pulls the hand away.',
  }
  return <AnatomyFigure title="A reflex arc" height={410} description={`${titles[step] || titles.arc} Original schematic, not to scale.`}
    labels={[
      { mark: '1', name: 'Receptors', detail: 'In the skin of the fingertip: detect the prick.', active: act('1') },
      { mark: '2', name: 'Sensory neurone', detail: 'Carries impulses to the spinal cord.', active: act('2') },
      { mark: '3', name: 'Relay neurone', detail: 'In the spinal cord: connects the sensory neurone to the motor neurone.', active: act('3') },
      { mark: '4', name: 'Motor neurone', detail: 'Carries impulses to the effector.', active: act('4') },
      { mark: '5', name: 'Effector', detail: 'The arm muscle contracts and pulls the hand away.', active: act('5') },
    ]} note="Small circles mark synapses. The thinking part of the brain is not involved. Original schematic, not to scale.">
    {() => <>
      <ReflexScene lit={p => on(p as ReflexPart)} />
      <Pointer mark="1" x={130} y={384} toX={90} toY={290} active={act('1')} />
      <Pointer mark="2" x={130} y={120} toX={175} toY={199} active={act('2')} />
      <Pointer mark="3" x={570} y={70} toX={462} toY={186} active={act('3')} />
      <Pointer mark="4" x={360} y={320} toX={380} toY={250} active={act('4')} />
      <Pointer mark="5" x={290} y={56} toX={298} toY={140} active={act('5')} />
    </>}
  </AnatomyFigure>
}

function ReflexData() {
  const bars = [{ name: ['blinking when a puff', 'of air hits the eye'], value: 50, colour: sens }, { name: ['pressing a button when', 'a light comes on'], value: 250, colour: motor }]
  const x0 = 200, scale = 1.05
  return <Figure schematic={false} viewBox="0 0 540 240" title="Bar chart of one person’s response times. Blinking when a puff of air hits the eye took 50 milliseconds. Pressing a button when a light comes on took 250 milliseconds. Invented data for practice.">
    <text x={20} y={24} fill={ink} fontSize="14" fontWeight="700">One person’s response times</text>
    {bars.map((b, i) => <g key={i}>
      <Text x={188} y={74 + i * 70} lines={b.name} size={13} anchor="end" />
      <rect x={x0} y={58 + i * 70} width={b.value * scale} height={34} rx="3" fill={i ? motorFill : sensFill} stroke={b.colour} strokeWidth="2" />
      <text x={x0 + b.value * scale + 8} y={81 + i * 70} fill={ink} fontSize="13" fontWeight="700">{b.value} ms</text>
    </g>)}
    <path d={`M${x0} 200H${x0 + 315}M${x0} 200V44`} stroke={ink} strokeWidth="2" />
    {[0, 100, 200, 300].map(v => <g key={v}><path d={`M${x0 + v * scale} 200V206`} stroke={ink} /><text x={x0 + v * scale} y={220} textAnchor="middle" fill={ink} fontSize="12">{v}</text></g>)}
    <text x={x0 + 158} y={236} textAnchor="middle" fill={ink} fontSize="13">time to respond (ms)</text>
  </Figure>
}

// ---------- Lesson 37: reaction time on a timeline ----------
function Timeline({ focus }: { focus: string }) {
  const step = focus.replace('nerve-rt-', '')
  const titles: Record<string, string> = {
    time: 'A timeline. At the stimulus, a ruler starts to fall. Later, at the response, the fingers close on it. The time between them is the reaction time.',
    ms: 'A time axis from 0 to 1000 milliseconds, which is 1 second. A reaction time of about 200 milliseconds is marked near the start, well under one second.',
    factors: 'The same timeline, with three factors pointing at the reaction time: age, gender and drugs. Each can make the reaction time longer or shorter.',
    caffeine: 'The same timeline with two brackets. The reaction time after caffeine can be shorter than the reaction time without caffeine.',
  }
  if (step === 'ms') {
    const X = (ms: number) => 50 + ms * .44
    return <Figure title={titles.ms} viewBox="0 0 540 220">
      <path d={`M${X(0)} 130H${X(1000) + 20}`} stroke={ink} strokeWidth="2.5" /><Arrow x1={X(1000) + 6} y1={130} x2={X(1000) + 24} y2={130} colour={ink} width={2.5} />
      {[0, 250, 500, 750, 1000].map(v => <g key={v}><path d={`M${X(v)} 122V138`} stroke={ink} strokeWidth="2" /><text x={X(v)} y={158} textAnchor="middle" fill={ink} fontSize="13">{v === 1000 ? '1000 ms' : v}</text></g>)}
      <rect x={X(0)} y={78} width={X(200) - X(0)} height={30} rx="6" fill={sensFill} stroke={sens} strokeWidth="2" />
      <Text x={X(200) + 10} y={98} lines={['a reaction time of about 200 ms']} size={14} bold colour={sens} anchor="start" />
      <path d={`M${X(0)} 184V194H${X(1000)}V184`} fill="none" stroke={muted} strokeWidth="2" />
      <Text x={X(500)} y={214} lines={['1 second = 1000 milliseconds (ms)']} size={13} bold />
      <Text x={X(0)} y={40} lines={['time since the stimulus']} size={13} anchor="start" />
    </Figure>
  }
  if (step === 'caffeine') {
    const S = 150, R = 400, Rc = 330
    const row = (y: number, end: number, name: string, colour: string, dashed: boolean) => <g>
      <path d={`M${S - 30} ${y}H${R + 70}`} stroke={ink} strokeWidth="2.2" /><Arrow x1={R + 60} y1={y} x2={R + 80} y2={y} colour={ink} width={2.2} />
      <circle cx={S} cy={y} r="6" fill={sens} /><circle cx={end} cy={y} r="6" fill={motor} />
      <path d={`M${S} ${y - 14}V${y - 22}H${end}V${y - 14}`} fill="none" stroke={colour} strokeWidth="2.4" strokeDasharray={dashed ? '6 4' : undefined} />
      <Text x={(S + end) / 2} y={y - 30} lines={['reaction time']} size={13} bold colour={colour} />
      <Text x={S - 40} y={y + 5} lines={[name]} size={13} bold anchor="end" />
    </g>
    return <Figure title={titles.caffeine} viewBox="0 0 540 250">
      {row(84, R, 'no caffeine', ink, false)}
      {row(184, Rc, 'after caffeine', sens, true)}
      <Cup x={506} y={180} k={1} />
      <Text x={Rc + 6} y={216} lines={['can be shorter']} size={13} bold colour={sens} anchor="start" />
      <circle cx={170} cy={236} r="5" fill={sens} /><text x={182} y={241} fill={ink} fontSize="12">stimulus</text>
      <circle cx={262} cy={236} r="5" fill={motor} /><text x={274} y={241} fill={ink} fontSize="12">response</text>
    </Figure>
  }
  const S = 110, R = 340, Rc = 290
  return <Figure title={titles[step] || titles.time} viewBox="0 0 540 250">
    <path d="M40 170H500" stroke={ink} strokeWidth="2.5" /><Arrow x1={490} y1={170} x2={512} y2={170} colour={ink} width={2.5} />
    <text x={512} y={194} textAnchor="end" fill={ink} fontSize="13">time</text>
    <circle cx={S} cy={170} r="6" fill={sens} /><circle cx={R} cy={170} r="6" fill={motor} />
    {/* stimulus: a ruler starting to fall */}
    <g><rect x={S - 10} y={62} width={20} height={70} rx="3" fill="#fbf3dc" stroke={ink} strokeWidth="1.8" />{[74, 86, 98, 110, 122].map(y => <path key={y} d={`M${S + 10} ${y}h-7`} stroke={ink} strokeWidth="1.4" />)}<Arrow x1={S + 26} y1={74} x2={S + 26} y2={120} colour={ink} width={2.5} /></g>
    <Text x={S} y={214} lines={['stimulus:', 'the ruler falls']} size={13} bold colour={sens} />
    {/* response: finger and thumb closed */}
    <g><rect x={R - 10} y={62} width={20} height={70} rx="3" fill="#fbf3dc" stroke={ink} strokeWidth="1.8" />{[74, 86, 98, 110, 122].map(y => <path key={y} d={`M${R + 10} ${y}h-7`} stroke={ink} strokeWidth="1.4" />)}
      <path d={`M${R - 34} 110C${R - 26} 100 ${R - 16} 98 ${R - 9} 102`} fill="none" stroke={skinLine} strokeWidth="13" /><path d={`M${R - 34} 110C${R - 26} 100 ${R - 16} 98 ${R - 9} 102`} fill="none" stroke={skin} strokeWidth="10" />
      <path d={`M${R + 34} 110C${R + 26} 100 ${R + 16} 98 ${R + 9} 102`} fill="none" stroke={skinLine} strokeWidth="13" /><path d={`M${R + 34} 110C${R + 26} 100 ${R + 16} 98 ${R + 9} 102`} fill="none" stroke={skin} strokeWidth="10" /></g>
    <Text x={R} y={214} lines={['response:', 'fingers close']} size={13} bold colour={motor} />
    {step === 'caffeine' ? <g>
      <path d={`M${S} 150V142H${R}V150`} fill="none" stroke={ink} strokeWidth="2.2" /><Text x={(S + R) / 2 + 30} y={136} lines={['without caffeine']} size={13} bold />
      <path d={`M${S} 40V32H${Rc}V40`} fill="none" stroke={sens} strokeWidth="2.2" strokeDasharray="6 4" /><Text x={(S + Rc) / 2} y={26} lines={['after caffeine: can be shorter']} size={13} bold colour={sens} />
      <Cup x={444} y={92} k={1.2} />
    </g> : <g>
      <path d={`M${S} 150V142H${R}V150`} fill="none" stroke={ink} strokeWidth="2.2" />
      <Text x={(S + R) / 2 + 20} y={136} lines={['reaction time']} size={15} bold />
    </g>}
    {step === 'factors' && <g>
      {[['age', 406, 48], ['gender', 406, 88], ['drugs', 406, 128]].map(([name, x, y]) => <g key={String(name)}><rect x={Number(x)} y={Number(y) - 20} width={96} height={30} rx="15" fill={panel} stroke={panelLine} strokeWidth="1.8" /><text x={Number(x) + 48} y={Number(y)} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{name}</text></g>)}
      <Arrow x1={404} y1={88} x2={366} y2={132} colour={muted} width={2.2} />
    </g>}
  </Figure>
}

// ---------- Lesson 37: the ruler drop ----------
const CM = 6
function Ruler({ x, zero, dim = false, highlight }: { x: number; zero: number; dim?: boolean; highlight?: number }) {
  const top = zero - 30 * CM - 6
  return <g opacity={dim ? faded : 1}>
    <rect x={x} y={top} width={32} height={30 * CM + 12} rx="3" fill="#fbf3dc" stroke={ink} strokeWidth="2" />
    {Array.from({ length: 31 }, (_, cm) => <path key={cm} d={`M${x + 32} ${zero - cm * CM}h-${cm % 5 ? 6 : 12}`} stroke={ink} strokeWidth={cm % 5 ? 1 : 1.6} />)}
    {[0, 5, 10, 15, 20, 25, 30].map(cm => <text key={cm} x={x + 11} y={zero - cm * CM + 4.5} textAnchor="middle" fill={ink} fontSize="12" fontWeight={cm === highlight ? 700 : 500}>{cm}</text>)}
  </g>
}
const THUMB_TOP = 212, RX = 300
function CatchHand({ closed = false }: { closed?: boolean }) {
  // Fingers pass behind the ruler; the thumb is drawn in front, with its top level with the ruler's zero.
  return {
    back: <g><path d={`M246 238C270 240 300 244 ${closed ? 332 : 342} 240`} fill="none" stroke={skinLine} strokeWidth="17" /><path d={`M246 238C270 240 300 244 ${closed ? 332 : 342} 240`} fill="none" stroke={skin} strokeWidth="14" /></g>,
    front: <g><path d={`M250 226C268 220 ${closed ? 300 : 290} ${THUMB_TOP + 7} ${closed ? 322 : 314} ${THUMB_TOP + 7}`} fill="none" stroke={skinLine} strokeWidth="15" /><path d={`M250 226C268 220 ${closed ? 300 : 290} ${THUMB_TOP + 7} ${closed ? 322 : 314} ${THUMB_TOP + 7}`} fill="none" stroke={skin} strokeWidth="12" /></g>,
  }
}
function RulerDrop({ focus }: { focus: string }) {
  const step = focus.replace('nerve-drop-', '')
  if (step === 'compare') {
    const catches = [{ x: 120, cm: 8, name: 'catch A', note: ['fell less:', 'faster reaction'], colour: opt }, { x: 360, cm: 18, name: 'catch B', note: ['fell further:', 'slower reaction'], colour: motor }]
    return <Figure viewBox="0 0 540 300" title="Two catches compared. In catch A the ruler fell 8 centimetres before it was caught: a faster reaction. In catch B it fell 18 centimetres: a slower reaction.">
      {catches.map(c => { const thumb = 170, zero = thumb + c.cm * CM
        return <g key={c.name}>
          <text x={c.x + 16} y={24} textAnchor="middle" fill={ink} fontSize="15" fontWeight="700">{c.name}</text>
          <g clipPath={undefined}><Ruler x={c.x} zero={zero} highlight={c.cm % 5 === 0 ? c.cm : undefined} /></g>
          <path d={`M${c.x - 26} ${thumb + 8}H${c.x + 30}`} stroke={skinLine} strokeWidth="15" /><path d={`M${c.x - 26} ${thumb + 8}H${c.x + 30}`} stroke={skin} strokeWidth="12" />
          <path d={`M${c.x + 36} ${thumb}H${c.x + 60}`} stroke={c.colour} strokeWidth="2" />
          <Text x={c.x + 66} y={thumb + 5} lines={[`${c.cm} cm`]} size={16} bold colour={c.colour} anchor="start" />
          <Text x={c.x + 66} y={thumb + 30} lines={c.note} size={13} bold colour={c.colour} anchor="start" />
        </g> })}
    </Figure>
  }
  const read = step === 'read', fall = step === 'fall'
  const zero = read ? THUMB_TOP + 14 * CM : fall ? THUMB_TOP + 10 : THUMB_TOP
  const hand = CatchHand({ closed: read })
  const titles: Record<string, string> = {
    setup: 'Side view of the ruler drop. The person’s forearm rests on a table, with the hand over the edge. A partner holds a ruler upright between the person’s thumb and first finger.',
    zero: 'Close to the hand: the zero mark at the bottom of the ruler is level with the top of the thumb. The thumb and finger are open, not gripping the ruler.',
    fall: 'The partner lets go of the ruler without warning. The ruler falls, and the person tries to catch it as fast as they can.',
    read: 'The ruler has been caught. The number level with the top of the thumb is 14, so the ruler fell 14 centimetres.',
  }
  return <Figure viewBox="0 0 540 330" title={titles[step] || titles.setup}>
    {/* table and arm */}
    <g opacity={step === 'setup' || step === 'zero' ? 1 : .75}>
      <rect x={0} y={252} width={252} height={14} fill={wood} stroke={woodLine} strokeWidth="2" /><rect x={216} y={266} width={16} height={64} fill={wood} stroke={woodLine} strokeWidth="2" />
      <path d="M60 236H236" stroke={skinLine} strokeWidth="32" /><path d="M60 236H236" stroke={skin} strokeWidth="29" />
      <path d="M0 214H78V252H0Z" fill={jumper} stroke={jumperLine} strokeWidth="2" />
      <path d="M236 236L250 232" stroke={skin} strokeWidth="26" />
    </g>
    {hand.back}
    <Ruler x={RX} zero={zero} />
    {hand.front}
    {/* partner's hand at the top */}
    <g>
      <path d="M420 44C400 40 368 42 350 46" fill="none" stroke={skinLine} strokeWidth="26" /><path d="M420 44C400 40 368 42 350 46" fill="none" stroke={skin} strokeWidth="23" />
      {fall || read ? <path d="M352 56L346 74" stroke={skinLine} strokeWidth="11" /> : <path d={`M348 56L${RX + 22} 56`} stroke={skinLine} strokeWidth="11" />}
      {fall || read ? <path d="M352 56L346 74" stroke={skin} strokeWidth="8" /> : <path d={`M348 56L${RX + 22} 56`} stroke={skin} strokeWidth="8" />}
      <text x={420} y={84} textAnchor="middle" fill={muted} fontSize="12">partner’s hand</text>
    </g>
    {step === 'setup' && <><Label x={24} y={196} to={[140, 226]} lines={['forearm rests', 'on the table']} strong /><Label x={410} y={250} to={[330, 240]} lines={['hand over', 'the edge']} strong /></>}
    {step === 'zero' && <><Label x={390} y={226} to={[RX + 2, THUMB_TOP]} lines={['0 is level with the', 'top of the thumb']} strong colour={sens} /><path d={`M${RX - 40} ${THUMB_TOP}H${RX + 40}`} stroke={sens} strokeWidth="1.8" strokeDasharray="5 4" /><Label x={24} y={196} to={[268, 222]} lines={['thumb and finger', 'open, not gripping']} strong /></>}
    {fall && <><Arrow x1={372} y1={110} x2={372} y2={176} colour={ink} width={3.5} /><Text x={384} y={138} lines={['let go:', 'no warning']} size={14} bold anchor="start" />{[108, 124, 140].map(y => <path key={y} d={`M${RX - 12} ${y}v14`} stroke={muted} strokeWidth="2" />)}</>}
    {read && <><path d={`M${RX - 46} ${THUMB_TOP}H${RX + 40}`} stroke={motor} strokeWidth="1.8" strokeDasharray="5 4" /><Label x={24} y={172} to={[RX - 46, THUMB_TOP]} lines={['read at the top', 'of the thumb: 14 cm']} strong colour={motor} /><Text x={400} y={200} lines={['the ruler fell', '14 cm']} size={14} bold colour={motor} anchor="start" /></>}
  </Figure>
}

// ---------- Lesson 37: making it a fair test ----------
function FairTest({ focus }: { focus: string }) {
  const step = focus.replace('nerve-fair-', '')
  const planOn = step === 'plan', varsOn = step === 'variables', controlsOn = step === 'controls'
  const titles: Record<string, string> = {
    plan: 'The plan in four steps: several ruler drops, a drink with caffeine, a 10-minute wait, then the ruler drops again. A teacher is in charge and no one has to have caffeine.',
    variables: 'What changes and what stays the same. You change whether the person has had caffeine. You measure the distance the ruler falls. You keep the control variables the same.',
    controls: 'Three control variables: the same person, the same hand and the same drop height, every time.',
  }
  const steps = [{ name: ['ruler drops,', 'several times'] }, { name: ['a drink with', 'caffeine'] }, { name: ['wait', '10 minutes'] }, { name: ['ruler drops', 'again'] }]
  const miniRuler = (cx: number, cy: number) => <g><rect x={cx - 7} y={cy - 22} width={14} height={44} rx="2" fill="#fbf3dc" stroke={ink} strokeWidth="1.6" />{[-14, -6, 2, 10].map(d => <path key={d} d={`M${cx + 7} ${cy + d}h-5`} stroke={ink} />)}</g>
  return <Figure viewBox="0 0 540 340" title={titles[step] || titles.plan}>
    {steps.map((s, i) => { const x = 10 + i * 131, cx = x + 57
      return <Tile key={i} x={x} y={14} w={114} h={112} on={planOn}>
        <Badge n={i + 1} x={x + 16} y={30} />
        {i === 0 || i === 3 ? <g>{miniRuler(cx - 8, 58)}<Arrow x1={cx + 14} y1={42} x2={cx + 14} y2={72} colour={ink} width={2} /></g> : i === 1 ? <Cup x={cx} y={62} k={1} /> : <Clock x={cx} y={58} r={18} />}
        <Text x={cx} y={98} lines={s.name} size={13} bold />
      </Tile> })}
    {[0, 1, 2].map(i => <g key={i} opacity={planOn ? 1 : faded}><Arrow x1={126 + i * 131} y1={70} x2={139 + i * 131} y2={70} colour={ink} width={2.2} /></g>)}
    <g opacity={planOn ? 1 : faded}><rect x={10} y={138} width={520} height={30} rx="15" fill="#fdf7e6" stroke={sunLine} strokeWidth="1.5" />
      <text x={270} y={158} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">Teacher in charge. No one has to have caffeine.</text></g>
    <Tile x={10} y={184} w={170} h={146} on={varsOn}>
      <text x={24} y={210} fill={ink} fontSize="13" fontWeight="700">you change:</text>
      <text x={24} y={230} fill={ink} fontSize="13">caffeine or none</text>
      <text x={24} y={264} fill={ink} fontSize="13" fontWeight="700">you measure:</text>
      <text x={24} y={284} fill={ink} fontSize="13">distance the ruler</text><text x={24} y={301} fill={ink} fontSize="13">falls (cm)</text>
    </Tile>
    <Tile x={192} y={184} w={338} h={146} on={varsOn || controlsOn} tint={optFill} line={opt}>
      <text x={361} y={208} textAnchor="middle" fill={opt} fontSize="14" fontWeight="700">you keep the same: control variables</text>
      {[['same', 'person'], ['same', 'hand'], ['same drop', 'height']].map((name, i) => { const cx = 250 + i * 111
        return <g key={i} opacity={varsOn || controlsOn ? 1 : faded}>
          <circle cx={cx} cy={252} r="26" fill="white" stroke={controlsOn ? opt : panelLine} strokeWidth="2" />
          {i === 0 && <g><circle cx={cx} cy={244} r="8" fill={skin} stroke={skinLine} strokeWidth="1.6" /><path d={`M${cx - 14} 268C${cx - 14} 256 ${cx + 14} 256 ${cx + 14} 268`} fill={jumper} stroke={jumperLine} strokeWidth="1.6" /></g>}
          {i === 1 && <g>{[-7.5, -2.5, 2.5, 7.5].map(d => <g key={d}><path d={`M${cx + d} 250V${d === -7.5 || d === 7.5 ? 238 : 234}`} stroke={skinLine} strokeWidth="6.5" /><path d={`M${cx + d} 250V${d === -7.5 || d === 7.5 ? 238 : 234}`} stroke={skin} strokeWidth="4" /></g>)}<path d={`M${cx - 10} 262L${cx - 18} 250`} stroke={skinLine} strokeWidth="7" /><path d={`M${cx - 10} 262L${cx - 18} 250`} stroke={skin} strokeWidth="4.5" /><rect x={cx - 11} y={246} width={22} height={24} rx="7" fill={skin} stroke={skinLine} strokeWidth="1.6" /></g>}
          {i === 2 && <g>{miniRuler(cx - 6, 252)}<path d={`M${cx + 12} 232V272M${cx + 8} 236l4 -4l4 4M${cx + 8} 268l4 4l4 -4`} stroke={ink} strokeWidth="1.8" fill="none" /></g>}
          <Text x={cx} y={296} lines={name} size={13} bold />
        </g> })}
    </Tile>
  </Figure>
}

// ---------- Lesson 37: means ----------
function MeanChart({ focus }: { focus: string }) {
  const step = focus.replace('nerve-mean-', '')
  if (step === 'compare') {
    const bars = [{ name: 'before caffeine', value: 15 }, { name: 'after caffeine', value: 12 }]
    const base = 236, k = 9
    return <Figure viewBox="0 0 540 270" title="Bar chart comparing two means for one person: 15 centimetres before caffeine and 12 centimetres after. The smaller mean distance means a faster reaction.">
      <path d={`M90 ${base}H400M90 ${base}V50`} stroke={ink} strokeWidth="2" />
      {[0, 5, 10, 15, 20].map(v => <g key={v}><path d={`M84 ${base - v * k}H90`} stroke={ink} /><text x={80} y={base - v * k + 4} textAnchor="end" fill={ink} fontSize="12">{v}</text></g>)}
      {bars.map((b, i) => <g key={b.name}><rect x={130 + i * 150} y={base - b.value * k} width={90} height={b.value * k} fill={i ? sensFill : '#eef2f5'} stroke={i ? sens : ink} strokeWidth="2" />
        <text x={175 + i * 150} y={base - b.value * k - 8} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{b.value} cm</text>
        <text x={175 + i * 150} y={base + 18} textAnchor="middle" fill={ink} fontSize="13">{b.name}</text></g>)}
      <text x={24} y={143} textAnchor="middle" fill={ink} fontSize="13" transform="rotate(-90 24 143)">mean distance (cm)</text>
      <Text x={414} y={110} lines={['smaller mean', 'distance', '= faster', 'reaction']} size={13} bold colour={sens} anchor="start" />
    </Figure>
  }
  const values = [16, 13, 17, 14, 15]
  const base = 230, k = 9, idea = step === 'idea'
  return <Figure viewBox="0 0 540 270" title={idea ? 'Bar chart of five ruler-drop catches by one person: 16, 13, 17, 14 and 15 centimetres. A dashed line shows the mean, in the middle of the results.' : 'Bar chart of five ruler-drop catches by one person: 16, 13, 17, 14 and 15 centimetres. Each catch is a little different.'}>
    <path d={`M80 ${base}H470M80 ${base}V40`} stroke={ink} strokeWidth="2" />
    {[0, 5, 10, 15, 20].map(v => <g key={v}><path d={`M74 ${base - v * k}H80`} stroke={ink} /><text x={70} y={base - v * k + 4} textAnchor="end" fill={ink} fontSize="12">{v}</text></g>)}
    {values.map((v, i) => <g key={i}><rect x={104 + i * 72} y={base - v * k} width={46} height={v * k} fill="#eef2f5" stroke={ink} strokeWidth="1.8" opacity={idea ? .6 : 1} />
      <text x={127 + i * 72} y={base - 10} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{v}</text>
      <text x={127 + i * 72} y={base + 18} textAnchor="middle" fill={ink} fontSize="12">{i + 1}</text></g>)}
    <text x={275} y={base + 36} textAnchor="middle" fill={ink} fontSize="13">catch number</text>
    <text x={22} y={135} textAnchor="middle" fill={ink} fontSize="13" transform="rotate(-90 22 135)">distance fallen (cm)</text>
    {idea && <g><path d={`M80 ${base - 15 * k}H470`} stroke={sens} strokeWidth="3" strokeDasharray="8 6" /><Text x={478} y={base - 15 * k + 5} lines={['mean']} size={14} bold colour={sens} anchor="start" /></g>}
    {!idea && <Text x={290} y={28} lines={['each catch is a little different']} size={14} bold />}
  </Figure>
}
function MeanWorked() {
  const values = [12, 15, 11, 14, 13]
  return <Figure viewBox="0 0 540 250" schematic={false} title="Worked example table. Five catches: 12, 15, 11, 14 and 13 centimetres. The total is 65 centimetres. 65 divided by 5 is 13, so the mean is 13 centimetres.">
    <rect x={20} y={16} width={240} height={220} rx="10" fill={panel} stroke={panelLine} strokeWidth="1.5" />
    <text x={40} y={44} fill={ink} fontSize="14" fontWeight="700">catch</text><text x={240} y={44} textAnchor="end" fill={ink} fontSize="14" fontWeight="700">distance (cm)</text>
    <path d="M32 54H248" stroke={panelLine} strokeWidth="1.5" />
    {values.map((v, i) => <g key={i}><text x={40} y={76 + i * 26} fill={ink} fontSize="14">{i + 1}</text><text x={240} y={76 + i * 26} textAnchor="end" fill={ink} fontSize="14">{v}</text></g>)}
    <path d="M32 196H248" stroke={ink} strokeWidth="1.5" />
    <text x={40} y={220} fill={ink} fontSize="14" fontWeight="700">total</text><text x={240} y={220} textAnchor="end" fill={ink} fontSize="14" fontWeight="700">65</text>
    <Text x={284} y={40} lines={['1  add them up:', '12 + 15 + 11 + 14 + 13 = 65']} size={14} anchor="start" />
    <Text x={284} y={96} lines={['2  count them: 5 catches']} size={14} anchor="start" />
    <Text x={284} y={132} lines={['3  divide: 65 ÷ 5 = 13']} size={14} anchor="start" />
    <rect x={284} y={180} width={236} height={40} rx="20" fill={sensFill} stroke={sens} strokeWidth="2" />
    <text x={402} y={206} textAnchor="middle" fill={sens} fontSize="16" fontWeight="700">mean = 13 cm</text>
  </Figure>
}
function CaffeineData() {
  const bars = [{ name: 'before caffeine', value: 13 }, { name: 'after caffeine', value: 11 }]
  const base = 226, k = 11
  return <Figure schematic={false} viewBox="0 0 540 270" title="Bar chart of one person’s mean ruler-drop distance: 13 centimetres before caffeine and 11 centimetres after caffeine. Invented data for practice.">
    <text x={90} y={24} fill={ink} fontSize="14" fontWeight="700">One person’s mean ruler-drop distance</text>
    <path d={`M90 ${base}H440M90 ${base}V44`} stroke={ink} strokeWidth="2" />
    {[0, 5, 10, 15].map(v => <g key={v}><path d={`M84 ${base - v * k}H90`} stroke={ink} /><text x={80} y={base - v * k + 4} textAnchor="end" fill={ink} fontSize="12">{v}</text></g>)}
    {bars.map((b, i) => <g key={b.name}><rect x={140 + i * 160} y={base - b.value * k} width={90} height={b.value * k} fill={i ? sensFill : '#eef2f5'} stroke={i ? sens : ink} strokeWidth="2" />
      <text x={185 + i * 160} y={base - b.value * k - 8} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{b.value} cm</text>
      <text x={185 + i * 160} y={base + 18} textAnchor="middle" fill={ink} fontSize="13">{b.name}</text></g>)}
    <text x={24} y={135} textAnchor="middle" fill={ink} fontSize="13" transform="rotate(-90 24 135)">mean distance (cm)</text>
    <text x={265} y={262} textAnchor="middle" fill={muted} fontSize="12">each mean is from five catches</text>
  </Figure>
}

export function NervousVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('nerve-home-')) return <HomeScene focus={focus} />
  if (focus.startsWith('nerve-parts-')) return <ControlBody focus={focus} assessment={assessment} />
  if (focus.startsWith('nerve-loop-')) return <Loop focus={focus} assessment={assessment} />
  if (focus === 'nerve-temp-data') return <TempData />
  if (focus.startsWith('nerve-ns-')) return <NervousBody focus={focus} assessment={assessment} />
  if (focus.startsWith('nerve-path-')) return <PathwayChain focus={focus} />
  if (focus.startsWith('nerve-syn-')) return <Synapse focus={focus} />
  if (focus === 'nerve-reflex-data') return <ReflexData />
  if (focus.startsWith('nerve-reflex-')) return <Reflex focus={focus} assessment={assessment} />
  if (focus.startsWith('nerve-rt-')) return <Timeline focus={focus} />
  if (focus.startsWith('nerve-drop-')) return <RulerDrop focus={focus} />
  if (focus.startsWith('nerve-fair-')) return <FairTest focus={focus} />
  if (focus === 'nerve-mean-worked') return <MeanWorked />
  if (focus === 'nerve-caffeine-data') return <CaffeineData />
  if (focus.startsWith('nerve-mean-')) return <MeanChart focus={focus} />
  return null
}
