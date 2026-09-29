import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C5 (Chemistry Lesson 28): exothermic and endothermic reactions. Original, code-native schematics; not to scale.
 * Focus ids start with 'exo-'.
 *
 * Energy is drawn as amber blocks ("units of stored energy"). Energy given out to the surroundings uses coral (warm) and
 * energy taken in uses electron-blue (cold), from the Chemistry palette. A dashed block marks energy that has moved away.
 * Bars are a simple energy tally, not a reaction profile (that comes later). In assessment view the words exothermic and
 * endothermic and any arrows that give the answer are removed; numbered panels stay.
 */
const { ink, muted, protonFill, protonLine, electronFill, electronLine, panelFill, panelLine } = atomPalette
const energyFill = '#fde3a7', energyLine = '#d9a55b', hot = '#d98a1c'
const warmFill = '#fbe1de', coldFill = '#dcecf8', warmInk = '#8a332c', coldInk = '#1d5787'
const glass = '#6f8798', liquid = '#e4eff6', faded = 0.28

function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Arr({ x1, y1, x2, y2, colour = ink, width = 3 }: { x1: number; y1: number; x2: number; y2: number; colour?: string; width?: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 11
  const p = (t: number) => `${(x2 - h * Math.cos(a + t)).toFixed(1)} ${(y2 - h * Math.sin(a + t)).toFixed(1)}`
  return <g><path d={`M${x1} ${y1}L${(x2 - 6 * Math.cos(a)).toFixed(1)} ${(y2 - 6 * Math.sin(a)).toFixed(1)}`} stroke={colour} strokeWidth={width} fill="none" /><path d={`M${x2} ${y2}L${p(.45)}L${p(-.45)}Z`} fill={colour} stroke={colour} strokeWidth="1" /></g>
}
function T({ x, y, children, size = 14, bold = false, colour = ink, anchor = 'middle' }: { x: number; y: number; children: ReactNode; size?: number; bold?: boolean; colour?: string; anchor?: 'start' | 'middle' | 'end' }) {
  return <text x={x} y={y} fontSize={size} fontWeight={bold ? 700 : 400} fill={colour} textAnchor={anchor}>{children}</text>
}

// ---------- Energy blocks ----------
const U = 22, GAP = 3, BASE = 250, BW = 84
/** A stack of energy blocks standing on the baseline. `solid` full blocks, then `ghost` dashed blocks (energy that left) or `fresh` highlighted blocks (energy that arrived). */
function Stack({ x, solid, ghost = 0, fresh = 0, label, sub, freshColour = hot }: { x: number; solid: number; ghost?: number; fresh?: number; label: string; sub?: string; freshColour?: string }) {
  const y = (i: number) => BASE - (i + 1) * (U + GAP) + GAP
  return <g>
    {Array.from({ length: solid }, (_, i) => <rect key={`s${i}`} x={x} y={y(i)} width={BW} height={U} rx="4" fill={energyFill} stroke={energyLine} strokeWidth="1.8" />)}
    {Array.from({ length: fresh }, (_, i) => <rect key={`f${i}`} x={x} y={y(solid + i)} width={BW} height={U} rx="4" fill={energyFill} stroke={freshColour} strokeWidth="3" />)}
    {Array.from({ length: ghost }, (_, i) => <rect key={`g${i}`} x={x} y={y(solid + i)} width={BW} height={U} rx="4" fill="none" stroke={muted} strokeWidth="1.8" strokeDasharray="5 4" />)}
    <path d={`M${x - 6} ${BASE + 2}H${x + BW + 6}`} stroke={ink} strokeWidth="2.5" />
    <T x={x + BW / 2} y={BASE + 22} bold>{label}</T>
    {sub && <T x={x + BW / 2} y={BASE + 40} size={13} colour={muted}>{sub}</T>}
  </g>
}
const top = (n: number) => BASE - n * (U + GAP) + GAP

function StoreFrame() {
  return <Diagram title="Two stacks of energy blocks. The reactants store 4 units of energy and the products store 2 units." viewBox="0 0 540 300">
    <T x={270} y={28} size={15} bold>Chemicals store energy</T>
    <T x={270} y={48} size={13} colour={muted}>Different chemicals store different amounts</T>
    <Stack x={110} solid={4} label="Reactants" />
    <Arr x1={225} y1={170} x2={305} y2={170} />
    <T x={265} y={158} size={13} colour={muted}>react</T>
    <Stack x={340} solid={2} label="Products" />
    <rect x={118} y={264} width={0} height={0} fill="none" />
  </Diagram>
}
function GivesFrame() {
  return <Diagram title="Reactants store 5 units and products store 3 units. The 2 extra units move to the surroundings.">
    <Stack x={40} solid={5} label="Reactants" />
    <Arr x1={140} y1={190} x2={190} y2={190} />
    <Stack x={205} solid={3} ghost={2} label="Products" sub="store less" />
    <Arr x1={300} y1={top(4) + 4} x2={378} y2={top(4) + 4} colour={protonLine} width={4} />
    <T x={340} y={top(4) - 12} size={13} bold colour={warmInk}>given out</T>
    <rect x={385} y={62} width={130} height={236} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <Stack x={408} solid={1} fresh={2} label="Surroundings" sub="gain 2 units" freshColour={protonLine} />
  </Diagram>
}
function TakesFrame() {
  return <Diagram title="Reactants store 3 units and products store 5 units. The 2 extra units come from the surroundings.">
    <Stack x={40} solid={3} label="Reactants" />
    <Arr x1={140} y1={190} x2={190} y2={190} />
    <Stack x={205} solid={3} fresh={2} label="Products" sub="store more" freshColour={electronLine} />
    <Arr x1={378} y1={top(4) + 4} x2={300} y2={top(4) + 4} colour={electronLine} width={4} />
    <T x={340} y={top(4) - 12} size={13} bold colour={coldInk}>taken in</T>
    <rect x={385} y={62} width={130} height={236} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <Stack x={408} solid={3} ghost={2} label="Surroundings" sub="lose 2 units" />
  </Diagram>
}
function ConserveFrame() {
  return <Diagram title="Before the reaction: reactants 5 units plus surroundings 2 units makes 7. After: products 3 units plus surroundings 4 units makes 7.">
    <T x={135} y={28} size={15} bold>Before</T>
    <T x={405} y={28} size={15} bold>After</T>
    <path d="M270 12V284" stroke={panelLine} strokeWidth="2" strokeDasharray="6 6" />
    <Stack x={50} solid={5} label="Reactants" />
    <Stack x={160} solid={2} label="Surroundings" />
    <Stack x={320} solid={3} label="Products" />
    <Stack x={430} solid={2} fresh={2} label="Surroundings" freshColour={protonLine} />
    <rect x={40} y={60} width={214} height={30} rx="8" fill={warmFill} stroke="none" opacity="0" />
    <T x={135} y={72} size={15} bold>5 + 2 = 7 units</T>
    <T x={405} y={72} size={15} bold>3 + 4 = 7 units</T>
  </Diagram>
}

// ---------- Beakers and thermometers ----------
function Thermo({ x, y, temp, on = true }: { x: number; y: number; temp: number; on?: boolean }) {
  const h = 96, level = Math.max(8, Math.min(h, (temp / 40) * h))
  return <g opacity={on ? 1 : faded}>
    <rect x={x - 6} y={y} width={12} height={h} rx="6" fill="white" stroke={glass} strokeWidth="2" />
    <rect x={x - 3} y={y + h - level} width={6} height={level} fill={protonFill} />
    <circle cx={x} cy={y + h + 6} r="10" fill={protonFill} stroke={glass} strokeWidth="2" />
  </g>
}
function Beaker({ x, y, temp, label, colour }: { x: number; y: number; temp: number; label: string; colour: string }) {
  return <g>
    <path d={`M${x} ${y}V${y + 110}Q${x} ${y + 120} ${x + 10} ${y + 120}H${x + 90}Q${x + 100} ${y + 120} ${x + 100} ${y + 110}V${y}`} fill="none" stroke={glass} strokeWidth="3" />
    <path d={`M${x + 2} ${y + 60}H${x + 98}V${y + 110}Q${x + 98} ${y + 118} ${x + 90} ${y + 118}H${x + 10}Q${x + 2} ${y + 118} ${x + 2} ${y + 110}Z`} fill={liquid} />
    <Thermo x={x + 62} y={y - 30} temp={temp} />
    <T x={x + 50} y={y + 146} size={15} bold>{label}</T>
    <T x={x + 50} y={y + 166} size={15} bold colour={colour}>{temp} °C</T>
  </g>
}
function Squiggle({ x, y, dir, colour }: { x: number; y: number; dir: 'up' | 'down'; colour: string }) {
  const s = dir === 'up' ? -1 : 1
  return <path d={`M${x} ${y}q8 ${6 * s} 0 ${14 * s}t0 ${14 * s}`} stroke={colour} strokeWidth="3" fill="none" />
}
function BeakerPair({ kind }: { kind: 'exo' | 'endo' }) {
  const exo = kind === 'exo'
  return <Diagram title={exo ? 'A beaker starts at 20 degrees Celsius and ends at 31 degrees. Energy is given out to the surroundings.' : 'A beaker starts at 20 degrees Celsius and ends at 9 degrees. Energy is taken in from the surroundings.'}>
    <Beaker x={70} y={70} temp={20} label="Start" colour={ink} />
    <Arr x1={196} y1={140} x2={286} y2={140} />
    <T x={241} y={128} size={13} colour={muted}>reaction</T>
    <Beaker x={340} y={70} temp={exo ? 31 : 9} label="End" colour={exo ? warmInk : coldInk} />
    {exo ? <g>
      {[0, 1, 2].map(i => <Squiggle key={i} x={462 + i * 22} y={190} dir="up" colour={protonLine} />)}
      <Arr x1={446} y1={140} x2={510} y2={140} colour={protonLine} width={4} />
      <T x={478} y={124} size={13} bold colour={warmInk}>energy out</T>
    </g> : <g>
      <Arr x1={516} y1={140} x2={452} y2={140} colour={electronLine} width={4} />
      <T x={484} y={124} size={13} bold colour={coldInk}>energy in</T>
    </g>}
    <T x={270} y={278} size={15} bold colour={exo ? warmInk : coldInk}>{exo ? 'Exothermic: the temperature rises' : 'Endothermic: the temperature falls'}</T>
  </Diagram>
}

function CompareTable() {
  const col = (x: number, fill: string, line: string, ink2: string, head: string, rows: string[], word: string) => <g>
    <rect x={x} y={54} width={236} height={196} rx="12" fill={fill} stroke={line} strokeWidth="2" />
    <T x={x + 118} y={82} size={17} bold colour={ink2}>{head}</T>
    {rows.map((r, i) => <T key={r} x={x + 118} y={118 + i * 34} size={14}>{r}</T>)}
    <T x={x + 118} y={228} size={14} bold colour={ink2}>{word}</T>
  </g>
  return <Diagram title="A two-column comparison of exothermic and endothermic reactions: what happens to energy, what happens to temperature, and the meaning of the word start." >
    <T x={270} y={28} size={15} bold>Same idea, opposite direction</T>
    {col(20, warmFill, protonLine, warmInk, 'Exothermic', ['Energy is given out', 'to the surroundings', 'Temperature rises'], 'exo- means out')}
    {col(284, coldFill, electronLine, coldInk, 'Endothermic', ['Energy is taken in', 'from the surroundings', 'Temperature falls'], 'endo- means in')}
    <T x={270} y={282} size={13} colour={muted}>the surroundings include the solution and the air around it</T>
  </Diagram>
}

// ---------- Example cards ----------
function Card({ x, y = 50, w, h = 210, tone, title, lines, children }: { x: number; y?: number; w: number; h?: number; tone: 'warm' | 'cold'; title: string; lines: string[]; children?: ReactNode }) {
  const warm = tone === 'warm'
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="12" fill={warm ? warmFill : coldFill} stroke={warm ? protonLine : electronLine} strokeWidth="2" />
    {children}
    <T x={x + w / 2} y={y + h - 62} size={15} bold colour={warm ? warmInk : coldInk}>{title}</T>
    {lines.map((l, i) => <T key={l} x={x + w / 2} y={y + h - 38 + i * 18} size={13}>{l}</T>)}
  </g>
}
function Flame({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x} ${y}C${x - 24} ${y - 26} ${x - 6} ${y - 46} ${x - 4} ${y - 70}C${x + 14} ${y - 52} ${x + 28} ${y - 30} ${x} ${y}Z`} fill="#f5b04c" stroke={hot} strokeWidth="2.5" />
    <path d={`M${x} ${y}C${x - 10} ${y - 12} ${x - 2} ${y - 22} ${x} ${y - 32}C${x + 8} ${y - 22} ${x + 12} ${y - 12} ${x} ${y}Z`} fill="#fbe0a0" stroke="none" /></g>
}
function MiniBeaker({ x, y, fill = liquid, w = 56, h = 64 }: { x: number; y: number; fill?: string; w?: number; h?: number }) {
  return <g><path d={`M${x} ${y}V${y + h - 8}Q${x} ${y + h} ${x + 8} ${y + h}H${x + w - 8}Q${x + w} ${y + h} ${x + w} ${y + h - 8}V${y}`} fill="none" stroke={glass} strokeWidth="2.5" />
    <path d={`M${x + 1} ${y + 22}H${x + w - 1}V${y + h - 8}Q${x + w - 1} ${y + h - 1} ${x + w - 8} ${y + h - 1}H${x + 8}Q${x + 1} ${y + h - 1} ${x + 1} ${y + h - 8}Z`} fill={fill} /></g>
}
function ExampleExo() {
  return <Diagram title="Three examples of exothermic reactions: burning fuels, neutralisation of an acid by an alkali, and many oxidation reactions such as rusting.">
    <T x={270} y={30} size={15} bold colour={warmInk}>Exothermic reactions: energy given out</T>
    <Card x={16} w={164} tone="warm" title="Burning fuels" lines={['also called combustion']}>
      <rect x={82} y={134} width={20} height={40} rx="3" fill="white" stroke={glass} strokeWidth="2" />
      <Flame x={92} y={132} />
    </Card>
    <Card x={188} w={164} tone="warm" title="Neutralisation" lines={['acid + alkali']}>
      <MiniBeaker x={222} y={100} w={40} h={58} fill="#fde9c8" />
      <MiniBeaker x={278} y={100} w={40} h={58} fill="#dcecf8" />
      <Arr x1={244} y1={92} x2={262} y2={110} colour={muted} width={2} />
    </Card>
    <Card x={360} w={164} tone="warm" title="Oxidation" lines={['many reactions,', 'such as rusting']}>
      <rect x={410} y={112} width={64} height={14} rx="6" fill="#b9805a" stroke="#7a4d2d" strokeWidth="2" />
      <rect x={434} y={124} width={16} height={46} rx="4" fill="#b9805a" stroke="#7a4d2d" strokeWidth="2" />
    </Card>
  </Diagram>
}
function Waves({ x, y, colour, n = 3 }: { x: number; y: number; colour: string; n?: number }) {
  return <g>{Array.from({ length: n }, (_, i) => <Squiggle key={i} x={x + i * 20} y={y} dir="up" colour={colour} />)}</g>
}
function UseExo() {
  return <Diagram title="Two uses of exothermic reactions: a hand warmer and a self-heating can of a hot drink.">
    <T x={270} y={30} size={15} bold colour={warmInk}>Uses of exothermic reactions</T>
    <Card x={30} w={230} tone="warm" title="Hand warmer" lines={['reaction inside gives out energy']}>
      <rect x={95} y={118} width={100} height={60} rx="18" fill="white" stroke={protonLine} strokeWidth="2.5" />
      <Waves x={115} y={112} colour={protonLine} n={4} />
    </Card>
    <Card x={280} w={230} tone="warm" title="Self-heating drinks can" lines={['chemicals in its base react']}>
      <path d="M375 120V172Q375 180 395 180Q415 180 415 172V120" fill="white" stroke={protonLine} strokeWidth="2.5" />
      <ellipse cx="395" cy="120" rx="20" ry="6" fill="white" stroke={protonLine} strokeWidth="2.5" />
      <rect x={378} y={166} width={34} height={12} rx="3" fill={energyFill} stroke={energyLine} strokeWidth="1.8" />
      <Waves x={430} y={168} colour={protonLine} n={3} />
    </Card>
  </Diagram>
}
function ExampleEndo() {
  return <Diagram title="Two examples of endothermic reactions: citric acid with sodium hydrogencarbonate, and thermal decomposition.">
    <T x={270} y={30} size={15} bold colour={coldInk}>Endothermic reactions: energy taken in</T>
    <Card x={30} w={230} tone="cold" title="Citric acid mixed with" lines={['sodium hydrogencarbonate', 'the mixture gets colder']}>
      <MiniBeaker x={125} y={98} w={64} h={70} />
      {[[140, 128], [158, 118], [172, 134], [150, 146]].map(([cx, cy]) => <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="4" fill="white" stroke={glass} strokeWidth="1.8" />)}
      <Arr x1={218} y1={130} x2={196} y2={130} colour={electronLine} width={3} />
    </Card>
    <Card x={280} w={230} tone="cold" title="Thermal decomposition" lines={['a substance breaks down', 'when it is heated']}>
      <path d="M375 72V108Q375 120 395 120Q415 120 415 108V72" fill="white" stroke={glass} strokeWidth="2.5" />
      <rect x={378} y={100} width={34} height={16} rx="6" fill={energyFill} stroke={energyLine} strokeWidth="1.8" />
      <g transform="translate(395 158) scale(.55)"><Flame x={0} y={0} /></g>
    </Card>
  </Diagram>
}
function UseEndo() {
  return <Diagram title="A sports injury pack that gets cold when the reaction inside takes in energy, with a thermometer falling.">
    <T x={270} y={30} size={15} bold colour={coldInk}>A use of an endothermic reaction</T>
    <Card x={110} w={320} tone="cold" title="Sports injury pack" lines={['reaction inside takes in energy', 'so the pack gets colder']}>
      <rect x={205} y={98} width={90} height={70} rx="14" fill="white" stroke={electronLine} strokeWidth="2.5" />
      <g stroke={electronLine} strokeWidth="3" fill="none"><path d="M250 112V154M231 133H269M237 119L263 147M263 119L237 147" /></g>
      <Arr x1={352} y1={133} x2={306} y2={133} colour={electronLine} width={3} />
      <T x={352} y={122} size={13} bold colour={coldInk} anchor="start">energy in</T>
    </Card>
  </Diagram>
}
function SortFrame() {
  const col = (x: number, tone: 'warm' | 'cold', head: string, items: string[]) => <g>
    <rect x={x} y={50} width={250} height={230} rx="12" fill={tone === 'warm' ? warmFill : coldFill} stroke={tone === 'warm' ? protonLine : electronLine} strokeWidth="2" />
    <T x={x + 125} y={80} size={16} bold colour={tone === 'warm' ? warmInk : coldInk}>{head}</T>
    {items.map((it, i) => <g key={it}>{!it.startsWith(' ') && <circle cx={x + 22} cy={112 + i * 30} r="4" fill={tone === 'warm' ? protonFill : electronFill} />}<T x={x + 36} y={117 + i * 30} size={14} anchor="start">{it.trim()}</T></g>)}
  </g>
  return <Diagram title="A sorted list. Exothermic: burning fuels, neutralisation, oxidation, hand warmers, self-heating cans. Endothermic: citric acid with sodium hydrogencarbonate, thermal decomposition, sports injury packs.">
    <T x={270} y={30} size={15} bold>Sort them</T>
    {col(10, 'warm', 'Exothermic', ['Burning fuels', 'Neutralisation', 'Many oxidation reactions', 'Hand warmers', 'Self-heating cans'])}
    {col(280, 'cold', 'Endothermic', ['Citric acid + sodium', '   hydrogencarbonate', 'Thermal decomposition', 'Sports injury packs'])}
  </Diagram>
}

// ---------- Questions ----------
function QuestionBars({ assessment }: { assessment: boolean }) {
  // Three panels of before/after bars. Panel 3 is the one where products store more.
  const panels: Array<[number, number]> = [[5, 3], [4, 1], [2, 4]]
  const w = 40, u = 14
  return <Diagram title={assessment ? 'Three numbered pairs of bars showing the energy stored in the reactants and in the products of three reactions.' : 'Three numbered pairs of bars. In pair 3 the products store more energy than the reactants.'}>
    {panels.map(([r, p], i) => {
      const x0 = 24 + i * 172, base = 232
      return <g key={i}>
        <rect x={x0} y={20} width={156} height={256} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
        <circle cx={x0 + 78} cy={44} r="13" fill="white" stroke={ink} strokeWidth="2" /><T x={x0 + 78} y={49} size={14} bold>{i + 1}</T>
        {[[r, x0 + 22, 'Reactants'], [p, x0 + 92, 'Products']].map(([n, bx, name]) => <g key={String(name)}>
          {Array.from({ length: n as number }, (_, k) => <rect key={k} x={bx as number} y={base - (k + 1) * (u + 3)} width={w} height={u} rx="3" fill={energyFill} stroke={energyLine} strokeWidth="1.6" />)}
          <T x={(bx as number) + w / 2} y={base + 20} size={12}>{String(name)}</T>
        </g>)}
        <path d={`M${x0 + 14} ${base + 2}H${x0 + 142}`} stroke={ink} strokeWidth="2" />
      </g>
    })}
    <T x={270} y={292} size={12} colour={muted}>each block = one unit of stored energy</T>
  </Diagram>
}
function QuestionData() {
  const rows: Array<[string, string, string]> = [['A', '21 °C', '35 °C (highest)'], ['B', '22 °C', '14 °C (lowest)'], ['C', '20 °C', '26 °C (highest)']]
  return <Diagram schematic={false} viewBox="0 0 540 260" title="A data table. Three reactions were mixed in a polystyrene cup. Reaction A: start 21 degrees Celsius, highest 35. Reaction B: start 22, lowest 14. Reaction C: start 20, highest 26.">
    <T x={24} y={28} size={15} bold anchor="start">Three reactions in a polystyrene cup</T>
    <rect x={20} y={44} width={500} height={196} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="14" fontWeight="700" fill={ink}><text x={40} y={78}>reaction</text><text x={170} y={70}>start</text><text x={170} y={88}>temperature</text><text x={330} y={70}>highest or lowest</text><text x={330} y={88}>temperature reached</text></g>
    <path d="M32 100H508" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([n, a, b], i) => <g key={n} fontSize="15" fill={ink}><text x={40} y={134 + i * 36} fontWeight="700">{n}</text><text x={170} y={134 + i * 36}>{a}</text><text x={330} y={134 + i * 36}>{b}</text></g>)}
  </Diagram>
}

export function ExoEndoVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'exo-store': return <StoreFrame />
    case 'exo-gives': return <GivesFrame />
    case 'exo-takes': return <TakesFrame />
    case 'exo-conserve': return <ConserveFrame />
    case 'exo-def-exo': return <BeakerPair kind="exo" />
    case 'exo-def-endo': return <BeakerPair kind="endo" />
    case 'exo-def-table': return <CompareTable />
    case 'exo-ex-exo': return <ExampleExo />
    case 'exo-use-exo': return <UseExo />
    case 'exo-ex-endo': return <ExampleEndo />
    case 'exo-use-endo': return <UseEndo />
    case 'exo-sort': return <SortFrame />
    case 'exo-question-bars': return <QuestionBars assessment />
    case 'exo-question-data': return <QuestionData />
    default: return <QuestionBars assessment={assessment} />
  }
}
