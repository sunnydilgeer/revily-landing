import { useId, type ReactNode } from 'react'
import { AnatomyFigure, Pointer, type AnatomyLabel } from './anatomy/AnatomyFigure'
import { Arrow, blob, infectionPalette } from './InfectionVisuals'

// Higher-only diagrams for chapter B5: glucagon and the blood glucose feedback cycle, adrenaline, and thyroxine with TSH.
// Original, code-native schematics. Not to scale. Focus ids start with 'hhorm-'.
// Same colour code as the Foundation hormone diagrams: indigo diamond = insulin, adrenaline or thyroxine (the main hormone),
// plum diamond = the second hormone (glucagon or TSH), amber hexagon = glucose (clusters = glycogen), red = blood, teal = oxygen.
const { ink, skin, skinLine } = infectionPalette
const faded = 0.3
const hormone = '#4153a6', hormoneFill = '#aab4ea'
const plum = '#8b4a9c', plumFill = '#e3cbec'
const amber = '#c98f2c', amberFill = '#f6dfa5'
const bloodLine = '#b0414d', bloodFill = '#f7d4d7', red = '#c8505a'
const oxygen = '#087f83', oxygenFill = '#bfe6e3'
const gland = '#efc4b8', glandLine = '#b06c61'
const liverFill = '#d9a092', liverLine = '#9c5a4f'
const muted = '#657a89'

type Pt = [number, number]
const r1 = (n: number) => Math.round(n * 10) / 10

// ---------- Shared pieces (drawn to match the Foundation glucose diagrams) ----------
function Text({ x, y, children, anchor = 'start', size = 14, bold = false, colour = ink, opacity }: { x: number; y: number; children: ReactNode; anchor?: 'start' | 'middle' | 'end'; size?: number; bold?: boolean; colour?: string; opacity?: number }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={bold ? 700 : 500} fill={colour} opacity={opacity}>{children}</text>
}
function Lines({ x, y, lines, anchor = 'start', size = 13, bold = false, colour = ink }: { x: number; y: number; lines: string[]; anchor?: 'start' | 'middle' | 'end'; size?: number; bold?: boolean; colour?: string }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={bold ? 700 : 500} fill={colour}>{lines.map((line, i) => <tspan key={i} x={x} dy={i ? size + 3 : 0}>{line}</tspan>)}</text>
}
function Diamond({ x, y, s = 6, colour = hormone, fill = hormoneFill }: { x: number; y: number; s?: number; colour?: string; fill?: string }) {
  return <path d={`M${x} ${y - s}L${x + s} ${y}L${x} ${y + s}L${x - s} ${y}Z`} fill={fill} stroke={colour} strokeWidth="1.6" />
}
function Glucose({ x, y, s = 5.5 }: { x: number; y: number; s?: number }) {
  const pts = Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 6 + i * Math.PI / 3; return `${r1(x + s * Math.cos(a))},${r1(y + s * Math.sin(a))}` }).join(' ')
  return <polygon points={pts} fill={amberFill} stroke={amber} strokeWidth="1.5" />
}
function Glycogen({ x, y }: { x: number; y: number }) {
  const pts: Pt[] = [[0, 0], [9, -3], [-8, 4], [3, 9], [-3, -9], [11, 7], [-11, -5]]
  return <g>{pts.map(([dx, dy], i) => <Glucose key={i} x={x + dx} y={y + dy} s={4.6} />)}</g>
}
function Oxygen({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r={5} fill={oxygenFill} stroke={oxygen} strokeWidth="1.6" />
}
function Pancreas({ x, y, s = 1, fill = '#f2d9c7', line = '#b88d72' }: { x: number; y: number; s?: number; fill?: string; line?: string }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M-52 10Q-40 -14 -8 -10Q20 -14 44 -22Q56 -12 44 0Q20 12 -10 14Q-40 22 -52 10Z" fill={fill} stroke={line} strokeWidth={2 / s} />
}
function Liver({ x, y, rx = 60, ry = 34 }: { x: number; y: number; rx?: number; ry?: number }) {
  return <path d={blob(x, y, rx, ry, 71, .06)} fill={liverFill} stroke={liverLine} strokeWidth="2.2" />
}
// A gently curved arrow (quadratic), with its head lined up with the end of the curve.
function Curve({ from, via, to, colour = muted, width = 2.4, dashed = false }: { from: Pt; via: Pt; to: Pt; colour?: string; width?: number; dashed?: boolean }) {
  const angle = Math.atan2(to[1] - via[1], to[0] - via[0]), head = 7 + width * 1.5
  const back: Pt = [to[0] - head * .7 * Math.cos(angle), to[1] - head * .7 * Math.sin(angle)]
  const points = [to, [to[0] - head * Math.cos(angle - .5), to[1] - head * Math.sin(angle - .5)], [to[0] - head * Math.cos(angle + .5), to[1] - head * Math.sin(angle + .5)]]
  return <g>
    <path d={`M${r1(from[0])} ${r1(from[1])}Q${r1(via[0])} ${r1(via[1])} ${r1(back[0])} ${r1(back[1])}`} fill="none" stroke={colour} strokeWidth={width} strokeDasharray={dashed ? '6 5' : undefined} />
    <polygon points={points.map(p => p.map(r1).join(',')).join(' ')} fill={colour} stroke={colour} strokeWidth="1" />
  </g>
}
function NumLabel({ n, x, y }: { n: string; x: number; y: number }) {
  return <g><circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{n}</text></g>
}
// A plain figure for data graphs, like the Foundation glucose graphs.
function Figure({ title, children, viewBox }: { title: string; children: ReactNode; viewBox: string }) {
  const titleId = useId()
  return <div className="science-bio-model">
    <svg viewBox={viewBox} role="img" aria-labelledby={titleId}>
      <title id={titleId}>{title}</title>
      <g strokeLinejoin="round" strokeLinecap="round">{children}</g>
    </svg>
  </div>
}
function smooth(p: Pt[]) {
  let d = `M${r1(p[0][0])} ${r1(p[0][1])}`
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)]
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])} ${r1(p2[1])}`
  }
  return d
}
// Keys only list what the drawing shows so far; the step being taught is highlighted.
function keyUpTo(items: Omit<AnatomyLabel, 'active'>[], step: number, shown: number) {
  return items.slice(0, shown).map((item, i) => ({ ...item, active: step === i + 1 }))
}

// ---------- Lesson 34 (Higher): glucagon, and insulin and glucagon as a feedback cycle ----------
// A blood glucose gauge sits in the middle. Right loop (built first): too low → pancreas → glucagon → liver turns glycogen
// into glucose → glucose into the blood → level rises. Left loop (added in the last frame): too high → pancreas → insulin →
// glucose into liver and muscle cells, stored as glycogen → level falls.
const glucagonKey = [
  { mark: '1', name: 'Level too low', detail: 'Blood glucose falls below normal. The pancreas detects it.' },
  { mark: '2', name: 'Glucagon released', detail: 'The pancreas releases glucagon into the blood.' },
  { mark: '3', name: 'Glycogen → glucose', detail: 'Glucagon makes liver cells turn glycogen back into glucose.' },
  { mark: '4', name: 'Level rises', detail: 'The liver releases glucose into the blood, back up to normal.' },
  { mark: '5', name: 'Level too high', detail: 'The pancreas releases insulin. Glucose moves into cells and is stored as glycogen.' },
]
const glucagonTitles: Record<string, string> = {
  low: 'Step 1: the blood glucose level has fallen below normal, and the pancreas detects it.',
  release: 'Step 2: the pancreas releases the hormone glucagon into the blood.',
  liver: 'Step 3: glucagon reaches the liver, where glycogen is turned back into glucose.',
  rise: 'Step 4: the liver releases glucose into the blood, so the level rises back to normal.',
  all: 'A negative feedback cycle for blood glucose. If the level is too high, the pancreas releases insulin and glucose is stored as glycogen in liver and muscle cells, so the level falls. If it is too low, the pancreas releases glucagon and the liver turns glycogen into glucose, so the level rises.',
}
function GlucagonCycle({ focus }: { focus: string }) {
  const stage = focus.replace('hhorm-glucagon-', '')
  const step = ({ low: 1, release: 2, liver: 3, rise: 4 } as Record<string, number>)[stage] || 0
  const shown = step || 5
  const on = (n: number) => step === 0 || step === n ? 1 : faded
  const seen = (n: number) => step === 0 || step >= n
  const level = step >= 1 && step <= 3 ? 268 : 195
  // Glucose in the gauge: two columns, filled up to the current level (the middle column is kept clear for words).
  const hexes: Pt[] = []
  for (let y = 290; y > level + 6; y -= 21) for (const x of [272, 328]) if (Math.abs(y - 195) > 9) hexes.push([x, y])
  const surface = `M256 ${level}Q278 ${level - 6} 300 ${level}T344 ${level}`
  return <AnatomyFigure title={step === 0 ? 'Insulin and glucagon: a feedback cycle' : 'When blood glucose is too low'} height={380}
    description={glucagonTitles[stage] || glucagonTitles.all}
    labels={keyUpTo(glucagonKey, step, shown)}
    note="Original schematic, not to scale. Diamonds are hormones; hexagons are glucose; clusters of hexagons are glycogen.">
    {ids => <>
      {/* The gauge: how much glucose is in the blood. */}
      <defs><clipPath id={ids.ref('gauge')}><rect x={258} y={56} width={84} height={274} rx={40} /></clipPath></defs>
      <Text x={300} y={40} anchor="middle" size={13} bold>blood glucose</Text>
      <rect x={258} y={56} width={84} height={274} rx={40} fill="#fbeef0" />
      <g clipPath={`url(#${ids.ref('gauge')})`}>
        <path d={`${surface}V340H256Z`} fill={amberFill} opacity=".75" />
        <path d={surface} fill="none" stroke={amber} strokeWidth="1.8" />
      </g>
      <rect x={258} y={56} width={84} height={274} rx={40} fill="none" stroke={bloodLine} strokeWidth="2" />
      {hexes.map(([x, y], i) => <Glucose key={i} x={x} y={y} />)}
      <path d="M260 195H340" stroke={ink} strokeWidth="2" strokeDasharray="5 4" />
      <Text x={300} y={214} anchor="middle" size={12} bold>normal</Text>
      <Text x={300} y={96} anchor="middle" size={12} colour={muted}>too high</Text>
      <Text x={300} y={308} anchor="middle" size={12} colour={step === 1 ? ink : muted} bold={step === 1}>too low</Text>
      {(step === 4 || step === 0) && <Arrow x1={300} y1={290} x2={300} y2={226} colour={amber} width={3} />}
      {step === 0 && <Arrow x1={300} y1={112} x2={300} y2={172} colour={amber} width={3} />}

      {/* Right loop: glucagon. */}
      <g opacity={on(1)}>
        <Curve from={[344, 284]} via={[372, 322]} to={[396, 322]} />
        <Pancreas x={452} y={322} s={.9} />
        <Text x={452} y={366} anchor="middle" size={13} bold={step === 1 || step === 2}>pancreas</Text>
        {step === 1 && <><circle cx={510} cy={296} r={13} fill="white" stroke={plum} strokeWidth="2" /><Text x={510} y={301} anchor="middle" bold colour={plum}>!</Text></>}
      </g>
      {seen(2) && <g opacity={on(2)}>
        <Arrow x1={470} y1={300} x2={470} y2={176} colour={plum} width={2.8} />
        <Diamond x={484} y={268} colour={plum} fill={plumFill} /><Diamond x={484} y={214} colour={plum} fill={plumFill} />
        <Text x={458} y={248} anchor="end" size={13} bold colour={plum}>glucagon</Text>
      </g>}
      <g opacity={on(3)}>
        <Liver x={478} y={128} />
        <Text x={478} y={80} anchor="middle" size={13} bold={step === 3}>liver</Text>
        {seen(3) ? <><Glycogen x={448} y={128} /><Arrow x1={466} y1={128} x2={490} y2={128} colour={ink} width={1.8} /><Glucose x={506} y={118} /><Glucose x={514} y={138} /></>
          : <><Glycogen x={458} y={128} /><Glycogen x={500} y={126} /></>}
      </g>
      {seen(4) && <g opacity={on(4)}>
        <Curve from={[416, 142]} via={[376, 152]} to={[348, 204]} colour={amber} width={3} />
        <Glucose x={386} y={156} />
      </g>}

      {/* Left loop: insulin, added once the glucagon story is complete. */}
      {step === 0 && <g>
        <Curve from={[258, 104]} via={[232, 76]} to={[206, 76]} />
        <Pancreas x={148} y={72} s={.9} />
        <Text x={148} y={36} anchor="middle" size={13}>pancreas</Text>
        <Arrow x1={132} y1={94} x2={132} y2={226} colour={hormone} width={2.8} />
        <Diamond x={118} y={130} /><Diamond x={118} y={190} />
        <Text x={144} y={164} size={13} bold colour={hormone}>insulin</Text>
        <Curve from={[256, 180]} via={[220, 204]} to={[190, 250]} colour={amber} width={3} />
        <Glucose x={226} y={210} />
        <Liver x={122} y={270} rx={62} ry={32} />
        <Glucose x={92} y={264} /><Glucose x={98} y={280} /><Arrow x1={108} y1={272} x2={130} y2={272} colour={ink} width={1.8} /><Glycogen x={150} y={270} />
        <Lines x={122} y={326} lines={['liver and', 'muscle cells']} anchor="middle" />
      </g>}

      {seen(1) && <Pointer mark="1" x={226} y={346} toX={262} toY={300} active={step === 1} />}
      {seen(2) && <Pointer mark="2" x={556} y={236} toX={474} toY={236} active={step === 2} />}
      {seen(3) && <Pointer mark="3" x={566} y={62} toX={526} toY={112} active={step === 3} />}
      {seen(4) && <Pointer mark="4" x={376} y={96} toX={392} toY={150} active={step === 4} />}
      {step === 0 && <Pointer mark="5" x={40} y={176} toX={112} toY={160} />}
    </>}
  </AnatomyFigure>
}

// ---------- Lesson 34 (Higher): rate of release of insulin and glucagon against blood glucose ----------
const S = { left: 92, right: 560, top: 30, bottom: 226 }
const sx = (v: number) => S.left + v * (S.right - S.left) / 10, sy = (r: number) => S.bottom - r * (S.bottom - S.top) / 10
const sample = (fn: (v: number) => number) => Array.from({ length: 21 }, (_, i) => { const v = .3 + i * 9.4 / 20; return [sx(v), sy(fn(v))] as Pt })
const glucagonRate = (v: number) => .6 + 8 / (1 + Math.exp((v - 4.2) / .75))
const insulinRate = (v: number) => .6 + 8 / (1 + Math.exp(-(v - 5.8) / .75))
function Secretion({ assessment }: { assessment: boolean }) {
  return <Figure viewBox="0 0 600 290" title={assessment
    ? 'A graph of rate of release against blood glucose level, with two lines labelled 1 and 2. Line 1 starts high and falls as blood glucose rises. Line 2 starts low and rises as blood glucose rises. Invented data for practice.'
    : 'A graph of rate of release against blood glucose level. Glucagon release is high when blood glucose is low and falls as it rises. Insulin release is low when blood glucose is low and rises as it rises. Invented data for practice.'}>
    <path d={`M${S.left} ${S.top - 6}V${S.bottom}H${S.right + 6}`} stroke={ink} strokeWidth="2" fill="none" />
    <Text x={S.left + 4} y={S.bottom + 22} size={12} colour={muted}>low</Text>
    <Text x={S.right} y={S.bottom + 22} anchor="end" size={12} colour={muted}>high</Text>
    <Text x={(S.left + S.right) / 2} y={S.bottom + 46} anchor="middle" size={13}>blood glucose level (a.u.)</Text>
    <text transform={`translate(40 ${(S.top + S.bottom) / 2}) rotate(-90)`} textAnchor="middle" fontSize="13" fill={ink}>rate of release (a.u.)</text>
    <path d={`M${sx(5)} ${S.top}V${S.bottom}`} stroke={muted} strokeWidth="1.5" strokeDasharray="4 5" />
    <Text x={sx(5) + 6} y={S.top + 10} size={12} colour={muted}>normal</Text>
    <path d={smooth(sample(glucagonRate))} stroke={assessment ? ink : plum} strokeWidth="3.5" fill="none" />
    <path d={smooth(sample(insulinRate))} stroke={assessment ? ink : hormone} strokeWidth="3.5" fill="none" strokeDasharray={assessment ? '9 6' : undefined} />
    {assessment ? <><NumLabel n="1" x={sx(1.4)} y={sy(8.6) - 18} /><NumLabel n="2" x={sx(8.6)} y={sy(8.6) - 18} /></>
      : <><Text x={sx(1.4)} y={sy(8.6) - 12} anchor="middle" bold colour={plum}>glucagon</Text><Text x={sx(8.6)} y={sy(8.6) - 12} anchor="middle" bold colour={hormone}>insulin</Text></>}
  </Figure>
}

// ---------- Lesson 33 (Higher): adrenaline, heart rate, and oxygen and glucose to the brain and muscles ----------
const adrenalineKey = [
  { mark: '1', name: 'Adrenal glands', detail: 'In fear or stress, they release adrenaline into the blood.' },
  { mark: '2', name: 'Heart', detail: 'Adrenaline makes it beat faster: the heart rate rises.' },
  { mark: '3', name: 'Brain and muscles', detail: 'More blood brings them more oxygen and glucose, ready for fight or flight.' },
]
const adrenalineTitles: Record<string, string> = {
  glands: 'Step 1: in fear or stress, the adrenal gland on top of each kidney releases adrenaline into the blood.',
  heart: 'Step 2: adrenaline reaches the heart, which beats faster, so the heart rate rises.',
  deliver: 'Step 3: the faster heart pumps more blood, so more oxygen and glucose reach the brain and muscles.',
  all: 'Adrenaline and fight or flight: the adrenal glands release adrenaline, the heart rate rises, and more oxygen and glucose are delivered to the brain and muscles.',
}
function Heart({ x, y }: { x: number; y: number }) {
  const d = `M${x} ${y + 44}C${x - 26} ${y + 24} ${x - 52} ${y + 6} ${x - 48} ${y - 18}C${x - 44} ${y - 40} ${x - 14} ${y - 44} ${x} ${y - 20}C${x + 14} ${y - 44} ${x + 46} ${y - 40} ${x + 48} ${y - 16}C${x + 50} ${y + 8} ${x + 24} ${y + 26} ${x} ${y + 44}Z`
  return <g>
    <path d={d} fill="#eca3aa" stroke={bloodLine} strokeWidth="2.2" />
    <path d={`M${x - 30} ${y - 18}Q${x - 26} ${y - 30} ${x - 14} ${y - 30}`} stroke="white" strokeWidth="3" fill="none" opacity=".6" />
  </g>
}
function Brain({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={blob(x, y, 52, 34, 8, .06)} fill="#f4e6ea" stroke="#b98a9b" strokeWidth="2" />
    {[`M${x - 34} ${y - 4}q10 -14 22 -4t20 -2`, `M${x - 20} ${y + 16}q12 -10 24 0t20 -4`, `M${x + 6} ${y - 18}q10 6 24 0`].map(d => <path key={d} d={d} stroke="#b98a9b" strokeWidth="1.6" fill="none" opacity=".8" />)}
  </g>
}
function Muscle({ x, y, w = 116, h = 50 }: { x: number; y: number; w?: number; h?: number }) {
  return <g><path d={blob(x, y, w / 2, h / 2, 61, .04, .5)} fill="#e7aaa2" stroke="#a8605b" strokeWidth="2" />
    {[-12, -4, 4, 12].map(d => <path key={d} d={`M${x - w / 2 + 12} ${y + d}Q${x} ${y + d - 4} ${x + w / 2 - 12} ${y + d}`} stroke="#a8605b" strokeWidth="1" fill="none" opacity=".55" />)}</g>
}
function Adrenaline({ focus }: { focus: string }) {
  const stage = focus.replace('hhorm-adrenaline-', '')
  const step = ({ glands: 1, heart: 2, deliver: 3 } as Record<string, number>)[stage] || 0
  const on = (n: number) => step === 0 || step === n ? 1 : faded
  const seen = (n: number) => step === 0 || step >= n
  const fast = seen(2)
  // A heart-rate trace: calm beats, then (once adrenaline arrives) closer, taller beats.
  const trace = (() => {
    let d = 'M232 84'
    const beats = fast ? [246, 266, 286, 306, 326, 346] : [252, 300, 348]
    let x = 232
    for (const b of beats) { d += `H${b}l4 -${fast ? 18 : 12}l4 ${fast ? 30 : 20}l4 -${fast ? 12 : 8}`; x = b + 12 }
    return `${d}H${Math.max(x, 368)}`
  })()
  return <AnatomyFigure title="Adrenaline: fight or flight" height={360}
    description={adrenalineTitles[stage] || adrenalineTitles.all}
    labels={keyUpTo(adrenalineKey, step, step || 3)}
    note="Original schematic, not to scale. Only one kidney and adrenal gland are drawn.">
    {() => <>
      <g transform="translate(20 22)">
        <Diamond x={8} y={8} /><Text x={22} y={13} size={12}>adrenaline</Text>
        {seen(3) && <><Oxygen x={8} y={32} /><Text x={22} y={37} size={12}>oxygen</Text><Glucose x={8} y={56} /><Text x={22} y={61} size={12}>glucose</Text></>}
      </g>
      <g opacity={on(1)}>
        <path d="M78 248C52 248 44 280 52 304C60 328 92 336 110 322C122 312 112 296 116 286C120 276 130 266 122 254C114 246 96 246 78 248Z" fill="#e0b6ab" stroke="#a87064" strokeWidth="2" />
        <path d="M60 252Q66 226 86 222Q108 222 116 246Q90 238 60 252Z" fill={step === 1 || step === 0 ? hormoneFill : gland} stroke={step === 1 || step === 0 ? hormone : glandLine} strokeWidth="2.2" />
        <Text x={86} y={350} anchor="middle" size={13} colour={muted}>kidney</Text>
        <Text x={86} y={208} anchor="middle" size={13} bold={step === 1}>adrenal gland</Text>
        <Curve from={[120, 232]} via={[170, 200]} to={[244, 196]} colour={hormone} width={2.8} />
        <Diamond x={160} y={208} /><Diamond x={204} y={196} />
      </g>
      <g opacity={on(2)}>
        <Heart x={296} y={190} />
        <Text x={296} y={262} anchor="middle" size={13} bold={step === 2}>heart</Text>
        <path d={trace} fill="none" stroke={fast ? red : muted} strokeWidth="2" />
        <Text x={300} y={60} anchor="middle" size={12} colour={fast ? red : muted} bold={step === 2}>{fast ? 'heart rate rises' : 'heart rate'}</Text>
      </g>
      <g opacity={on(3)}>
        <Brain x={486} y={92} />
        <Text x={486} y={44} anchor="middle" size={13} bold={step === 3}>brain</Text>
        <Muscle x={486} y={290} />
        <Text x={486} y={338} anchor="middle" size={13} bold={step === 3}>muscle</Text>
        {seen(3) && <>
          <Curve from={[342, 162]} via={[392, 112]} to={[430, 104]} colour={red} width={seen(3) ? 4 : 2.4} />
          <Curve from={[342, 214]} via={[392, 272]} to={[424, 282]} colour={red} width={4} />
          <Oxygen x={374} y={118} /><Glucose x={396} y={102} />
          <Oxygen x={372} y={266} /><Glucose x={394} y={284} />
        </>}
      </g>
      {seen(1) && <Pointer mark="1" x={156} y={290} toX={110} toY={238} active={step === 1} />}
      {seen(2) && <Pointer mark="2" x={210} y={140} toX={262} toY={170} active={step === 2} />}
      {seen(3) && <Pointer mark="3" x={566} y={190} toX={520} toY={272} active={step === 3} />}
    </>}
  </AnatomyFigure>
}

// ---------- Lesson 33 (Higher): thyroxine, TSH and negative feedback ----------
// Left: head and neck with the pituitary gland, TSH, the thyroid gland and thyroxine, and the level being detected.
// Right: the thyroxine level over time, rising and falling around a dashed normal level.
const thyroxineKey = [
  { mark: '1', name: 'Thyroid gland', detail: 'Releases thyroxine, which controls the basal metabolic rate.' },
  { mark: '2', name: 'Pituitary gland', detail: 'Releases TSH, which makes the thyroid release thyroxine.' },
  { mark: '3', name: 'Level too high', detail: 'Less TSH is released, so less thyroxine: the level falls.' },
  { mark: '4', name: 'Level too low', detail: 'More TSH is released, so more thyroxine: the level rises.' },
]
const thyroxineTitles: Record<string, string> = {
  thyroid: 'Step 1: the thyroid gland in the neck releases thyroxine into the blood.',
  tsh: 'Step 2: the pituitary gland under the brain releases TSH, which makes the thyroid gland release thyroxine.',
  high: 'Step 3: when the thyroxine level rises above normal, less TSH is released, so less thyroxine is released and the level falls.',
  low: 'Step 4: when the thyroxine level falls below normal, more TSH is released, so more thyroxine is released and the level rises.',
  all: 'Negative feedback: the thyroxine level is detected. Too high, and less TSH is released; too low, and more TSH is released. So the level rises and falls but stays close to the normal level.',
}
const T = { left: 330, right: 572, top: 34, bottom: 270, normal: 150, amp: 72 }
const waveX = (t: number) => T.left + 22 + t * (T.right - T.left - 40) / 1.25
const waveY = (t: number) => T.normal - T.amp * Math.sin(2 * Math.PI * t) * (1 - .14 * t)
const wave = (a: number, b: number) => smooth(Array.from({ length: 25 }, (_, i) => { const t = a + (b - a) * i / 24; return [waveX(t), waveY(t)] as Pt }))
function LevelGraph({ highlight, fade = false, points = false }: { highlight?: 'high' | 'low'; fade?: boolean; points?: boolean }) {
  return <g opacity={fade ? faded : 1}>
    <path d={`M${T.left} ${T.top - 6}V${T.bottom}H${T.right + 4}`} stroke={ink} strokeWidth="2" fill="none" />
    <text transform={`translate(${T.left - 14} ${(T.top + T.bottom) / 2}) rotate(-90)`} textAnchor="middle" fontSize="13" fill={ink}>thyroxine level in blood</text>
    <Text x={(T.left + T.right) / 2} y={T.bottom + 22} anchor="middle" size={13}>time</Text>
    <path d={`M${T.left + 2} ${T.normal}H${T.right}`} stroke={muted} strokeWidth="2" strokeDasharray="7 6" />
    <Text x={T.right} y={T.normal - 8} anchor="end" size={13} colour={muted} bold>normal</Text>
    <path d={wave(0, 1)} fill="none" stroke={highlight ? '#9fb0bd' : hormone} strokeWidth="3.5" />
    {highlight === 'high' && <path d={wave(.18, .5)} fill="none" stroke={hormone} strokeWidth="4.5" />}
    {highlight === 'low' && <path d={wave(.68, 1)} fill="none" stroke={hormone} strokeWidth="4.5" />}
    {highlight === 'high' && <><Arrow x1={waveX(.25) + 26} y1={waveY(.25) - 2} x2={waveX(.25) + 40} y2={waveY(.25) + 26} colour={plum} width={2.2} /><Text x={waveX(.25) + 46} y={waveY(.25) + 4} size={13} bold colour={plum}>less TSH</Text></>}
    {highlight === 'low' && <><Arrow x1={waveX(.75) + 24} y1={waveY(.75) + 2} x2={waveX(.75) + 38} y2={waveY(.75) - 26} colour={plum} width={2.2} /><Text x={waveX(.75) + 20} y={T.bottom - 10} size={13} bold colour={plum}>more TSH</Text></>}
    {points && <>{[0, .25, .75].map((t, i) => <g key={t}><circle cx={waveX(t)} cy={waveY(t)} r="4.5" fill={ink} /><NumLabel n={String(i + 1)} x={waveX(t) + (i === 0 ? 16 : 0)} y={waveY(t) + (i === 0 ? 30 : i === 2 ? 28 : -26)} /></g>)}</>}
  </g>
}
function Thyroxine({ focus }: { focus: string }) {
  const stage = focus.replace('hhorm-thyroxine-', '')
  const step = ({ thyroid: 1, tsh: 2, high: 3, low: 4 } as Record<string, number>)[stage] || 0
  const seen = (n: number) => step === 0 || step >= n
  const on = (n: number | number[]) => step === 0 || (Array.isArray(n) ? n.includes(step) : step === n) ? 1 : faded
  const tshWidth = step === 3 ? 1.6 : step === 4 ? 4.2 : 2.8
  const thyWidth = step === 3 ? 1.6 : step === 4 ? 4.2 : 2.8
  const tshLabel = step === 3 ? 'less TSH' : step === 4 ? 'more TSH' : 'TSH'
  const thyLabel = step === 3 ? 'less thyroxine' : step === 4 ? 'more thyroxine' : 'thyroxine'
  return <AnatomyFigure title="Thyroxine and negative feedback" height={330}
    description={thyroxineTitles[stage] || thyroxineTitles.all}
    labels={keyUpTo(thyroxineKey, step, step === 1 ? 1 : step === 2 ? 2 : step === 3 ? 3 : 4)}
    note="Original schematic, not to scale. The graph shows the pattern only, not real data.">
    {() => <>
      {/* Head and neck. */}
      <path d="M108 140Q110 180 106 212Q64 220 44 244Q32 262 30 322H246Q244 262 232 244Q212 220 170 212Q166 180 168 140Z" fill={skin} stroke={skinLine} strokeWidth="2" />
      <path d={blob(138, 90, 58, 64, 5, .03)} fill={skin} stroke={skinLine} strokeWidth="2" />
      <path d={blob(138, 76, 42, 30, 8, .06)} fill="#f4e6ea" stroke="#cfa9b6" strokeWidth="1.5" />
      <g opacity={on([2, 3, 4])}><circle cx={138} cy={114} r={7} fill={seen(2) ? plumFill : gland} stroke={seen(2) ? plum : glandLine} strokeWidth="2" /></g>
      <g opacity={on([1, 3, 4])}><path d="M138 204Q134 194 125 195Q116 197 118 206Q120 214 129 213Q136 212 138 207Q140 212 147 213Q156 214 158 206Q160 197 151 195Q142 194 138 204Z" fill={hormoneFill} stroke={hormone} strokeWidth="2" /></g>
      {seen(2) && <g opacity={on([2, 3, 4])}>
        <Arrow x1={138} y1={124} x2={138} y2={190} colour={plum} width={tshWidth} dashed={step === 3} />
        <Diamond x={126} y={158} s={5} colour={plum} fill={plumFill} />
        <Text x={176} y={168} size={13} bold colour={plum}>{tshLabel}</Text>
      </g>}
      <g opacity={on([1, 3, 4])}>
        <Arrow x1={160} y1={226} x2={262} y2={226} colour={hormone} width={thyWidth} dashed={step === 3} />
        <Diamond x={196} y={226} s={5} /><Diamond x={232} y={226} s={5} />
        <Text x={212} y={252} anchor="middle" size={13} bold colour={hormone}>{thyLabel}</Text>
      </g>
      {seen(3) && <g opacity={on([3, 4])}>
        <Curve from={[272, 212]} via={[300, 96]} to={[150, 110]} colour={muted} width={2} dashed />
        <Lines x={258} y={52} lines={['level', 'detected']} anchor="middle" size={12} colour={muted} />
      </g>}
      <LevelGraph fade={step === 1 || step === 2} highlight={step === 3 ? 'high' : step === 4 ? 'low' : undefined} />
      <Pointer mark="1" x={40} y={196} toX={118} toY={204} active={step === 1} />
      {seen(2) && <Pointer mark="2" x={40} y={128} toX={130} toY={114} active={step === 2} />}
      {seen(3) && <Pointer mark="3" x={waveX(.25) - 34} y={T.top + 8} toX={waveX(.25) - 6} toY={waveY(.25) + 2} active={step === 3} />}
      {seen(4) && <Pointer mark="4" x={waveX(.75) - 40} y={T.bottom - 12} toX={waveX(.75) - 6} toY={waveY(.75) + 2} active={step === 4} />}
    </>}
  </AnatomyFigure>
}
function ThyroxineQuestion() {
  return <Figure viewBox="300 0 290 300" title="A graph of the thyroxine level in the blood over time. The line rises above a dashed normal level, falls below it, then rises back. Three points are numbered: point 1 where the line starts at the normal level, point 2 at the highest point, and point 3 at the lowest point. Original schematic, not real data.">
    <LevelGraph points />
  </Figure>
}

export function HigherHormoneVisual({ focus }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('hhorm-glucagon-')) return <GlucagonCycle focus={focus} />
  if (focus === 'hhorm-secretion-question') return <Secretion assessment />
  if (focus === 'hhorm-secretion') return <Secretion assessment={false} />
  if (focus.startsWith('hhorm-adrenaline-')) return <Adrenaline focus={focus} />
  if (focus === 'hhorm-thyroxine-question') return <ThyroxineQuestion />
  if (focus.startsWith('hhorm-thyroxine-')) return <Thyroxine focus={focus} />
  return null
}
