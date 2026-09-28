import { useId, type ReactNode } from 'react'
import { Diagram, Arrow, Label, Badge, blob, seeded } from './InfectionVisuals'

// Chapter B7 (Lessons 55–57): the water and carbon cycles, biodiversity, waste, global warming and land use. Original, code-native schematics. Not to scale.
// Focus ids start with 'earth-'.
// Colour code (same as the rest of the course): yellow = energy from the Sun, blue = water, purple = carbon dioxide,
// amber = food and carbon compounds, green = plants, olive = decay microorganisms, brown = soil and mineral ions, orange = energy given off by the Earth, grey = smoke.
const ink = '#375a73', muted = '#657a89', faded = 0.28
const water = '#55acd0', waterDeep = '#3f93bd', waterFill = '#d7edf7', sea = '#b5dcec'
const purple = '#8f6fc4', purpleFill = '#efe8f9'
const yellow = '#efc75d', sunLine = '#b8902e'
const amber = '#c98f2c', amberFill = '#f6dfa5'
const leafFill = '#acd79f', leafLine = '#4f8f5a', grass = '#cfe6bf', trunk = '#b08a5e', trunkLine = '#7d5d3a'
const soil = '#efe3cf', soilLine = '#c9ae84', mineral = '#b0683a'
const microbe = '#7c8b36', microbeFill = '#e8edca'
const heat = '#dd7f3e', smoke = '#8d98a2', smokeFill = '#e3e7ea', sky = '#f3f9fc'
const fur = '#dcc6a8', furLine = '#9c7e5c'

type Pt = [number, number]
type Mode = 'on' | 'active' | 'off'
const r1 = (n: number) => Math.round(n * 10) / 10

// ---------- Shared pieces ----------
function Sun({ x, y, r = 20 }: { x: number; y: number; r?: number }) {
  return <g>{Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2; return <line key={i} x1={r1(x + Math.cos(a) * (r + 4))} y1={r1(y + Math.sin(a) * (r + 4))} x2={r1(x + Math.cos(a) * (r + 10))} y2={r1(y + Math.sin(a) * (r + 10))} stroke={sunLine} strokeWidth="2.2" strokeLinecap="round" /> })}
    <circle cx={x} cy={y} r={r} fill={yellow} stroke={sunLine} strokeWidth="2" /></g>
}
const CLOUD_BUMPS = [[-46, 10, 14], [-28, -2, 20], [-4, -12, 24], [22, -6, 20], [42, 6, 15]]
function Cloud({ x, y, s = 1, fill = '#ffffff', line = '#9fb3c2' }: { x: number; y: number; s?: number; fill?: string; line?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    {CLOUD_BUMPS.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r + 2} fill={line} />)}<rect x={-62} y={6} width={120} height={22} rx="11" fill={line} />
    {CLOUD_BUMPS.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={fill} />)}<rect x={-60} y={8} width={116} height={18} rx="9" fill={fill} />
  </g>
}
function Tree({ x, y, s = 1, seed = 3, stump = false }: { x: number; y: number; s?: number; seed?: number; stump?: boolean }) {
  if (stump) return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-8 0V-14L-4 -18L0 -14L4 -19L8 -15V0Z" fill={trunk} stroke={trunkLine} strokeWidth="1.6" /><ellipse cx="0" cy="-15" rx="8" ry="3" fill="#dcc095" stroke={trunkLine} strokeWidth="1.2" /></g>
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-6 0L-5 -46H5L6 0Z" fill={trunk} stroke={trunkLine} strokeWidth="1.6" />
    <path d={blob(0, -70, 34, 30, seed, .1)} fill={leafFill} stroke={leafLine} strokeWidth="2" />
  </g>
}
function Rabbit({ x, y, s = 1, facing = -1 }: { x: number; y: number; s?: number; facing?: 1 | -1 }) {
  return <g transform={`translate(${x} ${y}) scale(${facing * s} ${s})`} stroke={furLine} strokeWidth="1.6">
    <ellipse cx="-2" cy="-20" rx="24" ry="17" fill={fur} />
    <ellipse cx="-8" cy="-4" rx="14" ry="5" fill={fur} />
    <ellipse cx="17" cy="-54" rx="4.5" ry="14" transform="rotate(-12 17 -54)" fill={fur} /><ellipse cx="25" cy="-53" rx="4.5" ry="14" transform="rotate(10 25 -53)" fill={fur} />
    <circle cx="22" cy="-33" r="12" fill={fur} />
    <circle cx="-25" cy="-24" r="6" fill="#fffaf2" />
    <circle cx="27" cy="-35" r="1.8" fill={ink} stroke="none" /><circle cx="33.5" cy="-31" r="1.6" fill="#b87a7a" stroke="none" />
  </g>
}
function Plant({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0C0 20 -14 30 -26 40M0 0C2 22 4 32 2 48M0 0C4 18 18 26 28 36" fill="none" stroke="#b39463" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M0 0C-2 -30 2 -60 0 -92" fill="none" stroke={leafLine} strokeWidth="4" strokeLinecap="round" />
    {[[-1, -30, -1], [1, -50, 1], [-1, -68, -1], [1, -82, 1]].map(([side, ly], i) => <path key={i} d={`M0 ${ly}C${side * 10} ${ly - 18} ${side * 34} ${ly - 20} ${side * 42} ${ly - 12}C${side * 32} ${ly} ${side * 12} ${ly + 4} 0 ${ly}Z`} fill={leafFill} stroke={leafLine} strokeWidth="1.8" />)}
  </g>
}
function Microbes({ x, y, r = 30, seed = 4 }: { x: number; y: number; r?: number; seed?: number }) {
  const rand = seeded(seed)
  return <g>
    <circle cx={x} cy={y} r={r} fill="#fdfdf6" stroke={microbe} strokeWidth="2.2" />
    <path d={`M${x - r * .7} ${y + r * .35}C${x - r * .3} ${y + r * .1} ${x - r * .1} ${y + r * .5} ${x + r * .3} ${y + r * .3}S${x + r * .6} ${y - r * .1} ${x + r * .72} ${y - r * .2}`} fill="none" stroke={microbe} strokeWidth="2" opacity=".7" />
    {Array.from({ length: 5 }, (_, i) => { const a = i / 5 * Math.PI * 2 + rand(), d = r * (.25 + rand() * .3); return <rect key={i} x={r1(x + Math.cos(a) * d - 6)} y={r1(y + Math.sin(a) * d - 3)} width="12" height="6" rx="3" fill={microbeFill} stroke={microbe} strokeWidth="1.6" transform={`rotate(${Math.round(rand() * 180)} ${r1(x + Math.cos(a) * d)} ${r1(y + Math.sin(a) * d)})`} /> })}
  </g>
}
function Vapour({ x, y, length = 26, colour = water }: { x: number; y: number; length?: number; colour?: string }) {
  return <path d={`M${x} ${y}q5 ${-length / 4} 0 ${-length / 2}t0 ${-length / 2}`} stroke={colour} strokeWidth="2.5" fill="none" strokeLinecap="round" />
}
function Drop({ x, y, r = 5, colour = water }: { x: number; y: number; r?: number; colour?: string }) {
  return <path d={`M${x} ${y - r * 1.7}C${x + r * .4} ${y - r} ${x + r} ${y - r * .4} ${x + r} ${y + r * .2}A${r} ${r} 0 0 1 ${x - r} ${y + r * .2}C${x - r} ${y - r * .4} ${x - r * .4} ${y - r} ${x} ${y - r * 1.7}Z`} fill={waterFill} stroke={colour} strokeWidth="1.5" />
}
// A numbered marker that sits next to an arrow or part of the scene. Active = filled with the step colour.
function Num({ n, x, y, mode, colour = ink }: { n: number; x: number; y: number; mode: Mode; colour?: string }) {
  const active = mode === 'active'
  return <g opacity={mode === 'off' ? .45 : 1}>
    <circle cx={x} cy={y} r="11.5" fill={active ? colour : 'white'} stroke={active ? colour : ink} strokeWidth="2" />
    <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={active ? 'white' : ink}>{n}</text>
  </g>
}
type KeyItem = { n: number; lines: string[]; colour?: string }
// The numbered key beside a scene (like the step list in the plant-transport lesson). Hidden in assessment view.
function Key({ items, modes, x = 392, y = 56, gap = 50 }: { items: KeyItem[]; modes: Mode[]; x?: number; y?: number; gap?: number }) {
  return <g>{items.map((item, i) => {
    const mode = modes[i], active = mode === 'active', colour = item.colour || ink, cy = y + i * gap
    return <g key={item.n} opacity={mode === 'off' ? .42 : 1}>
      <circle cx={x} cy={cy} r="12" fill={active ? colour : 'white'} stroke={active ? colour : ink} strokeWidth="2" />
      <text x={x} y={cy + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={active ? 'white' : ink}>{item.n}</text>
      <text x={x + 20} y={cy + 5 - (item.lines.length - 1) * 8} fontSize="14" fontWeight={active ? 700 : 600} fill={active ? colour : ink}>{item.lines.map((l, j) => <tspan key={j} x={x + 20} dy={j ? 16 : 0}>{l}</tspan>)}</text>
    </g>
  })}</g>
}
const modeOf = (steps: number[], n: number): Mode => steps.length === 0 ? 'on' : steps.includes(n) ? 'active' : 'off'
const show = (steps: number[], n: number) => steps.length === 0 || steps.includes(n) ? 1 : faded
const modes = (steps: number[], count: number) => Array.from({ length: count }, (_, i) => modeOf(steps, i + 1))

// ---------- Lesson 55: the water cycle ----------
const WATER_STEPS: Record<string, number[]> = { 'earth-water-evaporate': [1], 'earth-water-transpire': [2], 'earth-water-condense': [3], 'earth-water-precip': [4], 'earth-water-runoff': [5] }
const WATER_KEY: KeyItem[] = [{ n: 1, lines: ['evaporation'], colour: waterDeep }, { n: 2, lines: ['transpiration'], colour: waterDeep }, { n: 3, lines: ['condensation'], colour: waterDeep }, { n: 4, lines: ['precipitation'], colour: waterDeep }, { n: 5, lines: ['run-off back', 'to the sea'], colour: waterDeep }]
const LAND = 'M146 240C184 232 212 224 242 212C282 196 300 152 330 144C348 140 362 146 368 150V292H146Z'
const RIVER = 'M354 160C334 180 304 198 266 214C230 230 194 242 158 250'
function WaterCycle({ focus, assessment }: { focus: string; assessment: boolean }) {
  const steps = assessment ? [] : WATER_STEPS[focus] || []
  const s = steps[0] || 0
  const titles: Record<number, string> = {
    1: 'Step 1: energy from the Sun makes water in the sea evaporate into water vapour.',
    2: 'Step 2: plants lose water vapour from their leaves. This is transpiration.',
    3: 'Step 3: the warm water vapour rises, cools and condenses into droplets that form clouds.',
    4: 'Step 4: water falls from the clouds as rain, snow or hail. This is precipitation.',
    5: 'Step 5: water runs off the land into streams and rivers and drains back to the sea.',
    0: assessment ? 'The water cycle: a sea, land with a tree, a cloud with rain and a river, with five numbered arrows.' : 'The water cycle: water evaporates from the sea and transpires from plants, condenses into clouds, falls as precipitation and runs back to the sea, again and again.',
  }
  return <Diagram viewBox="0 0 540 300" title={titles[s]}>
    <rect x="4" y="4" width="366" height="292" rx="12" fill={sky} />
    <path d="M6 240Q40 234 76 240T150 240V292H6Z" fill={sea} stroke={waterDeep} strokeWidth="1.5" />
    <path d="M22 262q9 -5 18 0t18 0M86 272q9 -5 18 0t18 0" fill="none" stroke={waterDeep} strokeWidth="1.5" opacity=".6" />
    <path d={LAND} fill={soil} stroke={soilLine} strokeWidth="1.5" />
    <path d="M146 240C184 232 212 224 242 212C282 196 300 152 330 144C348 140 362 146 368 150" fill="none" stroke={leafLine} strokeWidth="4" opacity=".55" />
    <Tree x={196} y={228} s={.8} seed={5} />
    <Sun x={34} y={36} r={16} />
    <Cloud x={272} y={56} s={.88} />
    <g opacity={show(steps, 1)}>
      <Arrow x1={48} y1={62} x2={64} y2={212} colour={yellow} width={3} /><Arrow x1={58} y1={56} x2={88} y2={212} colour={yellow} width={3} />
      {[100, 118, 136].map(x => <Vapour key={x} x={x} y={234} length={34} />)}<Arrow x1={118} y1={194} x2={118} y2={176} colour={water} width={3} />
    </g>
    <g opacity={show(steps, 2)}>{[186, 204].map(x => <Vapour key={x} x={x} y={142} length={28} />)}<Arrow x1={195} y1={112} x2={195} y2={96} colour={water} width={3} /></g>
    <g opacity={show(steps, 3)}><path d="M122 168C124 120 158 80 206 66" fill="none" stroke={water} strokeWidth="3" strokeDasharray="7 6" /><Arrow x1={200} y1={68} x2={216} y2={63} colour={water} width={3} /></g>
    <g opacity={show(steps, 4)}>{Array.from({ length: 10 }, (_, i) => { const x = 250 + (i % 5) * 13 + (i > 4 ? 6 : 0), y = 94 + (i > 4 ? 26 : 0) + (i % 2) * 6; return <line key={i} x1={x} y1={y} x2={x - 3} y2={y + 14} stroke={waterDeep} strokeWidth="2.4" strokeLinecap="round" /> })}
      <Arrow x1={316} y1={96} x2={316} y2={140} colour={waterDeep} width={3} /></g>
    <g opacity={show(steps, 5)}><path d={RIVER} fill="none" stroke={water} strokeWidth="6" /><Arrow x1={186} y1={243} x2={156} y2={251} colour={waterDeep} width={3} /></g>
    <Num n={1} x={146} y={196} mode={modeOf(steps, 1)} colour={waterDeep} />
    <Num n={2} x={228} y={118} mode={modeOf(steps, 2)} colour={waterDeep} />
    <Num n={3} x={146} y={72} mode={modeOf(steps, 3)} colour={waterDeep} />
    <Num n={4} x={342} y={112} mode={modeOf(steps, 4)} colour={waterDeep} />
    <Num n={5} x={262} y={238} mode={modeOf(steps, 5)} colour={waterDeep} />
    {!assessment && <><text x="20" y="286" fontSize="13" fill={waterDeep} fontWeight="700">sea</text>
      <Key items={WATER_KEY} modes={modes(steps, 5)} />
      {s === 0 && <text x="392" y="290" fontSize="13" fontWeight="600" fill={muted}>…and round again</text>}</>}
  </Diagram>
}

// ---------- Lesson 55: water for living things, and recycling by decay (one garden scene) ----------
function Garden({ children, drops = false, ions = false }: { children?: ReactNode; drops?: boolean; ions?: boolean }) {
  const rand = seeded(12)
  return <g>
    <rect x="4" y="4" width="366" height="272" rx="12" fill={sky} />
    <path d="M4 196H370V264Q370 276 358 276H16Q4 276 4 264Z" fill={soil} stroke={soilLine} strokeWidth="1.5" />
    <path d="M4 196H370" stroke={leafLine} strokeWidth="4" opacity=".55" />
    {drops && Array.from({ length: 8 }, (_, i) => <Drop key={i} x={r1(24 + i * 44 + rand() * 10)} y={r1(228 + (i % 2) * 22 + rand() * 6)} r={4} />)}
    {ions && Array.from({ length: 11 }, (_, i) => <circle key={i} cx={r1(20 + i * 32 + rand() * 10)} cy={r1(214 + (i % 3) * 18 + rand() * 6)} r="4" fill={mineral} opacity=".85" />)}
    <Plant x={92} y={196} s={1.05} />
    <Rabbit x={262} y={194} s={1.05} facing={-1} />
    {children}
  </g>
}
const NEED_STEPS: Record<string, number[]> = { 'earth-need-plant': [1], 'earth-need-food': [2], 'earth-need-animal': [] }
const NEED_KEY: KeyItem[] = [{ n: 1, lines: ['roots take in', 'water'], colour: waterDeep }, { n: 2, lines: ['the rabbit', 'eats the plant'], colour: amber }, { n: 3, lines: ['water returned', 'in waste'], colour: waterDeep }]
function WaterForLife({ focus }: { focus: string }) {
  const steps = NEED_STEPS[focus] ?? []
  const s = steps[0] || 0
  const titles: Record<number, string> = {
    1: 'A plant takes in water from the soil through its roots and uses it in photosynthesis.',
    2: 'Some water becomes part of the plant. A rabbit gets this water when it eats the plant.',
    0: 'Water in living things: roots take in water, water in the plant passes to the rabbit that eats it, and the rabbit returns water to the soil and air in its waste.',
  }
  return <Diagram viewBox="0 0 540 280" title={titles[s]}>
    <Garden drops>
      <g opacity={show(steps, 1)}><Arrow x1={120} y1={252} x2={100} y2={216} colour={waterDeep} width={3} /><Arrow x1={64} y1={252} x2={84} y2={216} colour={waterDeep} width={3} />
        <Arrow x1={80} y1={186} x2={80} y2={132} colour={waterDeep} width={3} /></g>
      <g opacity={show(steps, 2)}><Arrow x1={140} y1={148} x2={214} y2={158} colour={amber} width={3.5} /></g>
      <g opacity={show(steps, 3)}><Drop x={290} y={214} r={4.5} /><Drop x={296} y={232} r={4.5} /><Arrow x1={286} y1={196} x2={288} y2={250} colour={waterDeep} width={2.5} />
        <Vapour x={250} y={126} length={26} /><Vapour x={266} y={130} length={26} /></g>
      <Num n={1} x={50} y={146} mode={modeOf(steps, 1)} colour={waterDeep} />
      <Num n={2} x={176} y={128} mode={modeOf(steps, 2)} colour={amber} />
      <Num n={3} x={322} y={214} mode={steps.length ? 'off' : 'on'} colour={waterDeep} />
      <Key items={NEED_KEY} modes={steps.length ? modes(steps, 3) : ['on', 'on', 'active']} y={70} gap={62} />
    </Garden>
  </Diagram>
}
const DECAY_STEPS: Record<string, number[]> = { 'earth-decay-take': [1], 'earth-decay-eat': [2], 'earth-decay-return': [3], 'earth-decay-microbes': [4], 'earth-decay-cycle': [] }
const DECAY_KEY: KeyItem[] = [{ n: 1, lines: ['mineral ions', 'taken in'], colour: mineral }, { n: 2, lines: ['eaten'], colour: amber }, { n: 3, lines: ['waste and', 'dead leaves'], colour: amber }, { n: 4, lines: ['decay by', 'microorganisms'], colour: microbe }]
function Decay({ focus }: { focus: string }) {
  const steps = DECAY_STEPS[focus] ?? []
  const s = steps[0] || 0
  const titles: Record<number, string> = {
    1: 'Step 1: a plant takes in mineral ions from the soil and uses them to make the molecules it is built from.',
    2: 'Step 2: a rabbit eats the plant, so the materials pass along the food chain.',
    3: 'Step 3: materials return to the soil in waste, such as droppings, and when living things die, such as fallen leaves.',
    4: 'Step 4: microorganisms in the soil, shown enlarged, break down the waste and dead material. This is decay. Mineral ions go back into the soil.',
    0: 'Materials are recycled: mineral ions go from the soil into the plant, into the rabbit, back to the soil in waste and dead leaves, and microorganisms return them to the soil by decay.',
  }
  return <Diagram viewBox="0 0 540 280" title={titles[s]}>
    <Garden ions>
      <g opacity={show(steps, 1)}><Arrow x1={122} y1={254} x2={102} y2={216} colour={mineral} width={3} /><Arrow x1={62} y1={254} x2={82} y2={216} colour={mineral} width={3} /></g>
      <g opacity={show(steps, 2)}><Arrow x1={140} y1={148} x2={214} y2={158} colour={amber} width={3.5} /></g>
      <g opacity={show(steps, 3)}>
        <path d="M128 192C134 184 150 184 156 192C150 196 134 196 128 192Z" fill="#d9b86a" stroke={amber} strokeWidth="1.6" />
        <path d="M160 193C166 186 180 187 186 193C180 197 166 197 160 193Z" fill="#c9a14f" stroke={amber} strokeWidth="1.6" />
        {[[306, 192], [316, 190], [312, 185]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.6" fill="#8a6a45" />)}
        <Arrow x1={112} y1={160} x2={136} y2={184} colour={amber} width={2.5} /><Arrow x1={290} y1={182} x2={304} y2={184} colour={amber} width={2.5} />
      </g>
      <g opacity={show(steps, 4)}><path d="M158 198L196 224M308 196L232 226" stroke={microbe} strokeWidth="1.5" strokeDasharray="4 4" /><Microbes x={214} y={238} r={24} />
        <Arrow x1={188} y1={252} x2={150} y2={258} colour={mineral} width={2.5} /><Arrow x1={240} y1={252} x2={278} y2={258} colour={mineral} width={2.5} /></g>
      <Num n={1} x={30} y={232} mode={modeOf(steps, 1)} colour={mineral} />
      <Num n={2} x={176} y={128} mode={modeOf(steps, 2)} colour={amber} />
      <Num n={3} x={340} y={170} mode={modeOf(steps, 3)} colour={amber} />
      <Num n={4} x={214} y={184} mode={modeOf(steps, 4)} colour={microbe} />
      <Key items={DECAY_KEY} modes={modes(steps, 4)} y={60} gap={52} />
      {s === 0 && <text x="20" y="32" fontSize="14" fontWeight="700" fill={mineral}>materials are recycled</text>}
    </Garden>
  </Diagram>
}

// ---------- Lesson 55: the carbon cycle ----------
const CARBON_STEPS: Record<string, number[]> = { 'earth-carbon-photo': [1], 'earth-carbon-eat': [2], 'earth-carbon-resp': [3], 'earth-carbon-decay': [4, 5], 'earth-carbon-burn': [6] }
const CARBON_KEY: KeyItem[] = [{ n: 1, lines: ['photosynthesis'], colour: purple }, { n: 2, lines: ['eating'], colour: amber }, { n: 3, lines: ['respiration'], colour: purple }, { n: 4, lines: ['death and', 'waste'], colour: amber }, { n: 5, lines: ['decay by', 'microorganisms'], colour: microbe }, { n: 6, lines: ['burning'], colour: purple }]
function Flame({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x} ${y - 30}C${x + 16} ${y - 14} ${x + 16} ${y} ${x} ${y}C${x - 16} ${y} ${x - 16} ${y - 14} ${x} ${y - 30}Z`} fill="#f4b35c" stroke="#c9662e" strokeWidth="1.8" />
    <path d={`M${x} ${y - 16}C${x + 7} ${y - 8} ${x + 6} ${y} ${x} ${y}C${x - 6} ${y} ${x - 7} ${y - 8} ${x} ${y - 16}Z`} fill={yellow} /></g>
}
function CarbonCycle({ focus, assessment }: { focus: string; assessment: boolean }) {
  const steps = assessment ? [] : CARBON_STEPS[focus] || []
  const s = steps[0] || 0
  const titles: Record<number, string> = {
    1: 'Step 1: plants take in carbon dioxide from the air for photosynthesis and use the carbon to make carbon compounds.',
    2: 'Step 2: animals eat plants, so the carbon compounds pass along the food chain.',
    3: 'Step 3: plants and animals respire and release carbon dioxide into the air.',
    4: 'Steps 4 and 5: plants and animals die or produce waste. Microorganisms break these down and release carbon dioxide as they respire.',
    6: 'Step 6: burning wood and fossil fuels releases carbon dioxide into the air.',
    0: assessment ? 'The carbon cycle: air at the top, a tree, a rabbit, soil with microorganisms, a fire and fossil fuels, joined by six numbered arrows.' : 'The carbon cycle: photosynthesis takes carbon dioxide out of the air; eating passes carbon on; respiration, decay and burning return carbon dioxide to the air.',
  }
  return <Diagram viewBox="0 0 540 330" title={titles[s]}>
    <rect x="4" y="8" width="366" height="40" rx="10" fill={purpleFill} stroke={purple} strokeWidth="1.5" />
    <text x="187" y="33" textAnchor="middle" fontSize="14" fontWeight="700" fill={purple}>carbon dioxide in the air</text>
    <path d="M4 238H370V316Q370 324 362 324H12Q4 324 4 316Z" fill={soil} stroke={soilLine} strokeWidth="1.5" />
    <path d="M4 238H370" stroke={leafLine} strokeWidth="4" opacity=".55" />
    <rect x="12" y="286" width="112" height="30" rx="6" fill="#4a4540" /><text x="68" y="306" textAnchor="middle" fontSize="13" fontWeight="700" fill="white">fossil fuels</text>
    <Tree x={120} y={236} s={1.1} seed={8} />
    <Rabbit x={256} y={234} s={1} facing={-1} />
    <Microbes x={300} y={282} r={22} seed={9} />
    <text x="300" y="318" textAnchor="middle" fontSize="12" fontWeight="700" fill={microbe}>microorganisms</text>
    <g opacity={show(steps, 1)}><Arrow x1={98} y1={52} x2={98} y2={126} colour={purple} width={5} /></g>
    <g opacity={show(steps, 2)}><Arrow x1={160} y1={176} x2={212} y2={194} colour={amber} width={3.5} /></g>
    <g opacity={show(steps, 3)}><Arrow x1={140} y1={128} x2={140} y2={54} colour={purple} width={3} /><Arrow x1={266} y1={172} x2={266} y2={54} colour={purple} width={3} /></g>
    <g opacity={show(steps, 4)}><Arrow x1={150} y1={234} x2={272} y2={272} colour={amber} width={2.5} dashed /><Arrow x1={282} y1={234} x2={292} y2={256} colour={amber} width={2.5} dashed /></g>
    <g opacity={show(steps, 5)}><Arrow x1={330} y1={268} x2={330} y2={54} colour={purple} width={3} /></g>
    <g opacity={show(steps, 6)}><Arrow x1={40} y1={284} x2={40} y2={246} colour="#4a4540" width={2.5} /><Flame x={40} y={236} /><Arrow x1={40} y1={200} x2={40} y2={54} colour={purple} width={3} /></g>
    <Num n={1} x={76} y={92} mode={modeOf(steps, 1)} colour={purple} />
    <Num n={2} x={186} y={164} mode={modeOf(steps, 2)} colour={amber} />
    <Num n={3} x={158} y={92} mode={modeOf(steps, 3)} colour={purple} />
    <Num n={3} x={284} y={120} mode={modeOf(steps, 3)} colour={purple} />
    <Num n={4} x={204} y={272} mode={modeOf(steps, 4)} colour={amber} />
    <Num n={5} x={352} y={150} mode={modeOf(steps, 5)} colour={microbe} />
    <Num n={6} x={60} y={150} mode={modeOf(steps, 6)} colour={purple} />
    {!assessment && <Key items={CARBON_KEY} modes={modes(steps, 6)} y={64} gap={46} />}
  </Diagram>
}

// ---------- Lesson 56: biodiversity (a small wood and its food web) ----------
const SPECIES: Record<string, { x: number; y: number; name: string }> = {
  grass: { x: 70, y: 232, name: 'grass' }, flower: { x: 210, y: 232, name: 'flowers' }, oak: { x: 380, y: 232, name: 'oak tree' },
  rabbit: { x: 70, y: 140, name: 'rabbit' }, mouse: { x: 210, y: 140, name: 'mouse' }, caterpillar: { x: 380, y: 140, name: 'caterpillar' },
  fox: { x: 120, y: 48, name: 'fox' }, owl: { x: 290, y: 48, name: 'owl' }, bird: { x: 470, y: 90, name: 'thrush' },
}
const WEB: Array<[string, string]> = [['grass', 'rabbit'], ['flower', 'mouse'], ['oak', 'caterpillar'], ['caterpillar', 'bird'], ['rabbit', 'fox'], ['mouse', 'fox'], ['mouse', 'owl'], ['bird', 'owl']]
function SpeciesIcon({ kind }: { kind: string }) {
  switch (kind) {
    case 'grass': return <g stroke={leafLine} strokeWidth="2.4" fill="none">{[-12, -6, 0, 6, 12].map((x, i) => <path key={i} d={`M${x} 14Q${x + (i % 2 ? 4 : -4)} 0 ${x + (i % 2 ? 2 : -3)} ${-12 - (i % 3) * 3}`} />)}</g>
    case 'flower': return <g><path d="M0 16V-2M0 8Q-8 4 -10 -2M0 10Q7 6 9 1" stroke={leafLine} strokeWidth="2.2" fill="none" />{[0, 72, 144, 216, 288].map(a => <circle key={a} cx={r1(Math.cos(a * Math.PI / 180) * 7)} cy={r1(-8 + Math.sin(a * Math.PI / 180) * 7)} r="5" fill="#f4b8cc" stroke="#c7668a" strokeWidth="1.3" />)}<circle cx="0" cy="-8" r="4" fill={yellow} stroke={sunLine} strokeWidth="1" /></g>
    case 'oak': return <Tree x={0} y={18} s={.36} seed={21} />
    case 'rabbit': return <Rabbit x={-2} y={14} s={.5} facing={1} />
    case 'mouse': return <g stroke="#7d746b" strokeWidth="1.5"><path d="M13 7C22 8 24 14 18 16" fill="none" /><ellipse cx="2" cy="6" rx="13" ry="8" fill="#c4bdb4" /><circle cx="-9" cy="-1" r="5.5" fill="#d9d2c9" /><circle cx="-12" cy="4" r="1.4" fill={ink} stroke="none" /><path d="M-14 6L-19 8" /></g>
    case 'caterpillar': return <g>{[-14, -7, 0, 7, 14].map((x, i) => <circle key={x} cx={x} cy={4 + (i % 2 ? -3 : 2)} r={i === 4 ? 6 : 5.5} fill={i === 4 ? '#7fb34d' : '#a9d47c'} stroke="#5f8f35" strokeWidth="1.3" />)}<circle cx="16" cy="3" r="1.3" fill={ink} /></g>
    case 'bird': return <g stroke="#8a6440" strokeWidth="1.4"><path d="M-12 4L-22 0L-20 8Z" fill="#b98c5e" /><ellipse cx="-2" cy="4" rx="13" ry="9" fill="#c79a6b" /><ellipse cx="0" cy="8" rx="8" ry="5" fill="#f1dfc4" stroke="none" /><circle cx="10" cy="-4" r="7" fill="#c79a6b" /><path d="M16 -5L23 -3L16 -1Z" fill={amber} /><circle cx="12" cy="-6" r="1.4" fill={ink} stroke="none" /><path d="M-6 3Q2 -2 6 6" fill="none" /><path d="M-2 13V18M3 13V18" /></g>
    case 'fox': return <g stroke="#a85a25" strokeWidth="1.5"><path d="M-15 -14L-8 -2L8 -2L15 -14L6 -6H-6Z" fill="#e08a4a" /><path d="M-14 -8Q-15 6 0 16Q15 6 14 -8Q0 -2 -14 -8Z" fill="#e08a4a" /><path d="M-9 6Q0 18 9 6Q0 10 -9 6Z" fill="#fff6ea" /><circle cx="-5" cy="1" r="1.6" fill={ink} stroke="none" /><circle cx="5" cy="1" r="1.6" fill={ink} stroke="none" /><circle cx="0" cy="13" r="2" fill={ink} stroke="none" /></g>
    case 'owl': return <g stroke="#7a5a3c" strokeWidth="1.4"><path d="M-12 -12L-8 -18L-4 -12M12 -12L8 -18L4 -12" fill="#b08968" /><ellipse cx="0" cy="2" rx="14" ry="17" fill="#b08968" /><ellipse cx="0" cy="-3" rx="11" ry="9" fill="#ead8c0" /><circle cx="-5" cy="-4" r="4.5" fill="white" /><circle cx="5" cy="-4" r="4.5" fill="white" /><circle cx="-5" cy="-4" r="2" fill={ink} stroke="none" /><circle cx="5" cy="-4" r="2" fill={ink} stroke="none" /><path d="M-2 1L0 5L2 1Z" fill={amber} /></g>
  }
  return null
}
function SpeciesNode({ id, mode = 'on', gone = false }: { id: string; mode?: Mode; gone?: boolean }) {
  const { x, y, name } = SPECIES[id]
  const active = mode === 'active'
  return <g opacity={mode === 'off' || gone ? .3 : 1}>
    <circle cx={x} cy={y} r="25" fill={active ? '#fff7e2' : 'white'} stroke={active ? amber : '#b7c7d2'} strokeWidth={active ? 3 : 1.8} />
    <g transform={`translate(${x} ${y})`}><SpeciesIcon kind={id} /></g>
    {id === 'fox' || id === 'owl' ? <text x={x + 31} y={y + 5} fontSize="13" fontWeight="600" fill={ink}>{name}</text>
      : id === 'bird' ? <text x={x} y={y + 42} textAnchor="middle" fontSize="13" fontWeight="600" fill={ink}>{name}</text>
      : <text x={x + 31} y={y + 22} fontSize="13" fontWeight="600" fill={ink}>{name}</text>}
    {gone && <path d={`M${x - 18} ${y - 18}L${x + 18} ${y + 18}M${x + 18} ${y - 18}L${x - 18} ${y + 18}`} stroke="#c8505a" strokeWidth="4" />}
  </g>
}
function webArrow(from: string, to: string) {
  const a = SPECIES[from], b = SPECIES[to], d = Math.hypot(b.x - a.x, b.y - a.y), ux = (b.x - a.x) / d, uy = (b.y - a.y) / d
  return { x1: r1(a.x + ux * 28), y1: r1(a.y + uy * 28), x2: r1(b.x - ux * 29), y2: r1(b.y - uy * 29) }
}
function Biodiversity({ focus }: { focus: string }) {
  const stage = { 'earth-bio-variety': 1, 'earth-bio-links': 2, 'earth-bio-conditions': 3, 'earth-bio-stable': 4 }[focus] || 2
  const titles: Record<number, string> = {
    1: 'Nine different species living in one small wood: grass, flowers, an oak tree, a rabbit, a mouse, a caterpillar, a fox, an owl and a thrush.',
    2: 'The same wood as a food web. Arrows show what each animal eats. The fox eats rabbits and mice, so it depends on more than one species.',
    3: 'The wood with soil underneath. The oak tree gives shelter, and microorganisms in the soil return mineral ions to it.',
    4: 'The rabbits have gone from the wood. The fox can still eat mice, so the food web keeps going.',
  }
  const foxLinks = (f: string, t: string) => t === 'fox'
  return <Diagram viewBox="0 0 540 330" title={titles[stage]}>
    <rect x="4" y="4" width="532" height="322" rx="12" fill="#f6fbf4" />
    <path d="M4 288H536V314Q536 326 524 326H16Q4 326 4 314Z" fill={soil} stroke={soilLine} strokeWidth="1.5" opacity={stage === 3 ? 1 : .6} />
    {stage === 3 && <><Microbes x={210} y={307} r={15} seed={31} /><text x="232" y="312" fontSize="13" fontWeight="700" fill={microbe}>microorganisms recycle mineral ions</text>
      <text x="420" y="196" fontSize="13" fontWeight="700" fill={leafLine}>shelter</text><Arrow x1={440} y1={200} x2={414} y2={216} colour={leafLine} width={2} /></>}
    {stage >= 2 && WEB.map(([f, t]) => { const w = webArrow(f, t), hot = stage === 4 ? (f === 'mouse' && t === 'fox') : stage === 2 && foxLinks(f, t)
      const dim = stage === 4 && (f === 'rabbit' || t === 'rabbit')
      return <g key={f + t} opacity={dim ? .2 : stage === 3 ? .45 : 1}><Arrow {...w} colour={hot ? amber : '#8aa0b0'} width={hot ? 3.5 : 2.2} /></g> })}
    {Object.keys(SPECIES).map(id => <SpeciesNode key={id} id={id} mode={(stage === 2 || stage === 4) && id === 'fox' ? 'active' : stage === 3 && id === 'oak' ? 'active' : 'on'} gone={stage === 4 && id === 'rabbit'} />)}
    {stage === 1 && <text x="520" y="34" textAnchor="end" fontSize="14" fontWeight="700" fill={leafLine}><tspan x="520">9 species:</tspan><tspan x="520" dy="17">high biodiversity</tspan></text>}
    {stage === 2 && <text x="520" y="30" textAnchor="end" fontSize="13" fontWeight="600" fill={muted}><tspan x="520">arrow points to</tspan><tspan x="520" dy="16">the eater</tspan></text>}
    {stage === 4 && <text x="520" y="190" textAnchor="end" fontSize="13" fontWeight="700" fill={amber}><tspan x="520">no rabbits:</tspan><tspan x="520" dy="16">the fox eats</tspan><tspan x="520" dy="16">more mice</tspan></text>}
  </Diagram>
}

// ---------- Lesson 56: more people, more demands ----------
function Pictogram({ x, y, s = 1, colour = '#8fb3cc' }: { x: number; y: number; s?: number; colour?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><circle cx="0" cy="-26" r="6" fill={colour} /><path d="M-8 0V-12Q-8 -18 -2 -18H2Q8 -18 8 -12V0Z" fill={colour} /></g>
}
function House({ x, y, w = 40, colour = '#f3e4cf' }: { x: number; y: number; w?: number; colour?: string }) {
  return <g><rect x={x - w / 2} y={y - w * .7} width={w} height={w * .7} fill={colour} stroke="#a58a6a" strokeWidth="1.5" /><path d={`M${x - w / 2 - 5} ${y - w * .7}L${x} ${y - w * 1.15}L${x + w / 2 + 5} ${y - w * .7}Z`} fill="#c97c5d" stroke="#9e5a40" strokeWidth="1.5" />
    <rect x={x - 5} y={y - w * .38} width="10" height={w * .38} fill="#a58a6a" /></g>
}
function Car({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 24} ${y - 6}V${y - 14}L${x - 14} ${y - 16}L${x - 8} ${y - 26}H${x + 10}L${x + 16} ${y - 16}L${x + 24} ${y - 14}V${y - 6}Z`} fill="#7fb0d4" stroke="#3f6f93" strokeWidth="1.5" /><circle cx={x - 13} cy={y - 5} r="5" fill="#4a4540" /><circle cx={x + 13} cy={y - 5} r="5" fill="#4a4540" /></g>
}
function Laptop({ x, y }: { x: number; y: number }) {
  return <g><rect x={x - 14} y={y - 24} width="28" height="18" rx="2" fill="#dbe8f2" stroke={ink} strokeWidth="1.5" /><path d={`M${x - 19} ${y - 6}H${x + 19}L${x + 16} ${y}H${x - 16}Z`} fill="#b7c7d2" stroke={ink} strokeWidth="1.5" /></g>
}
function PowerStation({ x, y }: { x: number; y: number }) {
  return <g><rect x={x - 28} y={y - 34} width="56" height="34" fill="#d5dbe0" stroke="#7d8a95" strokeWidth="1.5" /><rect x={x + 6} y={y - 70} width="12" height="36" fill="#c3cad0" stroke="#7d8a95" strokeWidth="1.5" />
    <path d={`M${x + 12} ${y - 74}q-6 -8 4 -14t6 -14`} fill="none" stroke={smoke} strokeWidth="5" strokeLinecap="round" opacity=".6" />
    <path d={`M${x - 14} ${y - 26}l-6 10h6l-4 10l10 -13h-6l4 -7Z`} fill={yellow} stroke={sunLine} strokeWidth="1" /></g>
}
function Quarry({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 46} ${y - 8}L${x - 34} ${y + 6}H${x - 22}L${x - 14} ${y + 20}H${x + 14}L${x + 22} ${y + 6}H${x + 34}L${x + 46} ${y - 8}Z`} fill="#c9c1b4" stroke="#857a6b" strokeWidth="1.5" />
    {[[-6, 14], [2, 12], [8, 15]].map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r="3" fill="#a79d8f" />)}</g>
}
const PEOPLE_STEPS: Record<string, number[]> = { 'earth-people-more': [1], 'earth-people-living': [2], 'earth-people-resources': [3], 'earth-people-biodiversity': [] }
const PEOPLE_KEY: KeyItem[] = [{ n: 1, lines: ['more people'], colour: '#3f6f93' }, { n: 2, lines: ['higher standard', 'of living'], colour: '#3f6f93' }, { n: 3, lines: ['more materials', 'and energy'], colour: '#3f6f93' }, { n: 4, lines: ['less space for', 'other species'], colour: leafLine }]
function People({ focus }: { focus: string }) {
  const steps = PEOPLE_STEPS[focus] ?? []
  const s = steps[0] || 0
  const titles: Record<number, string> = {
    1: 'A growing town: more houses and more people.',
    2: 'People in the town want more things, such as cars and computers. This is a higher standard of living.',
    3: 'Making those things uses more raw materials from a quarry and more energy from a power station.',
    0: 'The whole town: more people, more things each, more raw materials and energy, and less space left for other species in the small wood at the edge.',
  }
  return <Diagram viewBox="0 64 540 216" title={titles[s]}>
    <rect x="4" y="68" width="366" height="208" rx="12" fill={sky} />
    <path d="M4 206H370V264Q370 276 358 276H16Q4 276 4 264Z" fill={grass} stroke={leafLine} strokeWidth="1.2" />
    <g opacity={show(steps, 1)}>{[[34, 204], [80, 204], [126, 204], [56, 150], [102, 150]].map(([x, y], i) => <House key={i} x={x} y={y} w={i > 2 ? 32 : 38} colour={i % 2 ? '#f3e4cf' : '#eadcf2'} />)}
      {[24, 44, 64, 84, 104, 124].map((x, i) => <Pictogram key={i} x={x} y={250} s={.85} />)}</g>
    <g opacity={show(steps, 2)}><Car x={176} y={206} /><Laptop x={176} y={160} /></g>
    <g opacity={show(steps, 3)}><Quarry x={250} y={234} /><PowerStation x={244} y={206} /><text x="250" y="270" textAnchor="middle" fontSize="12" fontWeight="600" fill={muted}>quarry</text></g>
    <g opacity={s === 0 ? 1 : faded}>{[[326, 206, 41], [352, 206, 42]].map(([x, y, seed]) => <Tree key={seed} x={x} y={y} s={.55} seed={seed} />)}
      <SpeciesNodeMini x={344} y={232} /></g>
    <Num n={1} x={134} y={104} mode={modeOf(steps, 1)} colour="#3f6f93" />
    <Num n={2} x={176} y={120} mode={modeOf(steps, 2)} colour="#3f6f93" />
    <Num n={3} x={292} y={128} mode={modeOf(steps, 3)} colour="#3f6f93" />
    <Num n={4} x={340} y={120} mode={s === 0 ? 'active' : 'off'} colour={leafLine} />
    <Key items={PEOPLE_KEY} modes={s === 0 ? ['on', 'on', 'on', 'active'] : [...modes(steps, 3), 'off']} y={96} gap={50} />
  </Diagram>
}
function SpeciesNodeMini({ x, y }: { x: number; y: number }) {
  return <g><g transform={`translate(${x} ${y}) scale(.7)`}><SpeciesIcon kind="bird" /></g></g>
}

// ---------- Lesson 56: pollution in water, on land and in the air ----------
const POLL_STEPS: Record<string, number[]> = { 'earth-pollution-water': [1], 'earth-pollution-land': [2], 'earth-pollution-air': [3], 'earth-pollution-all': [] }
const POLL_KEY: KeyItem[] = [{ n: 1, lines: ['water: sewage,', 'fertiliser, toxic', 'chemicals'], colour: waterDeep }, { n: 2, lines: ['land: landfill,', 'toxic chemicals'], colour: '#8a6a45' }, { n: 3, lines: ['air: smoke,', 'acidic gases'], colour: '#6b7680' }]
function Fish({ x, y, dead = false }: { x: number; y: number; dead?: boolean }) {
  return <g transform={`translate(${x} ${y}) ${dead ? 'scale(1 -1)' : ''}`}><path d="M-12 0Q0 -8 10 0Q0 8 -12 0ZM-12 0L-19 -5V5Z" fill={dead ? '#c9ccd0' : '#f0b36a'} stroke={dead ? '#8d98a2' : '#b87a33'} strokeWidth="1.3" /><circle cx="5" cy="-1" r="1.3" fill={ink} /></g>
}
function Pollution({ focus, assessment }: { focus: string; assessment: boolean }) {
  const steps = assessment ? [] : POLL_STEPS[focus] ?? []
  const waste = focus === 'earth-pollution-waste' && !assessment
  const all = focus === 'earth-pollution-all' && !assessment
  const s = waste ? -1 : steps[0] || 0
  const o = (n: number) => waste ? faded : show(steps, n)
  const titles: Record<number, string> = {
    [-1]: 'A landscape with a factory, a farm, houses, a river and a landfill site. The factory makes waste, including toxic chemicals, and homes throw away rubbish.',
    1: 'Water pollution: sewage from a pipe, fertiliser washed off a field and toxic chemicals from a factory get into the river.',
    2: 'Land pollution: household waste is dumped in a landfill site, and toxic chemicals such as pesticides are sprayed on a field.',
    3: 'Air pollution: smoke and acidic gases from the factory chimney.',
    0: assessment ? 'A landscape with a factory, a farm field, a pipe, a river and a landfill site, with four numbered places.' : 'Pollution in water, on land and in the air. Pollution kills plants and animals, such as fish in the river, and this can reduce biodiversity.',
  }
  const W = assessment ? 540 : 372
  return <Diagram viewBox="0 0 540 290" title={titles[s]}>
    <rect x="4" y="4" width={W - 6} height="282" rx="12" fill={sky} />
    <path d={`M4 150C80 140 150 150 210 164C262 176 310 170 ${W - 2} 160V286H4Z`} fill={grass} stroke={leafLine} strokeWidth="1.2" />
    {/* field on the hill */}
    <path d="M18 152C70 144 120 150 168 160L150 196C110 188 60 186 18 190Z" fill="#e8dcae" stroke="#b39a5a" strokeWidth="1.2" />
    {[30, 56, 82, 108, 134].map(x => <path key={x} d={`M${x} 160Q${x + 4} 176 ${x + 2} 190`} stroke="#9fbf6a" strokeWidth="3" fill="none" />)}
    {/* river along the bottom */}
    <path d={`M4 238C80 226 150 250 220 244C280 238 330 250 ${W - 2} 244V272C330 278 280 266 220 272C150 278 80 256 4 266Z`} fill={sea} stroke={waterDeep} strokeWidth="1.5" />
    {!all && <><Fish x={70} y={252} /><Fish x={280} y={258} /></>}
    {all && <><Fish x={70} y={252} dead /><Fish x={280} y={258} dead /></>}
    {/* factory */}
    <rect x="196" y="88" width="70" height="56" fill="#d5dbe0" stroke="#7d8a95" strokeWidth="1.5" /><rect x="244" y="58" width="14" height="30" fill="#c3cad0" stroke="#7d8a95" strokeWidth="1.5" />
    <path d="M196 88L214 74V88L232 74V88" fill="#d5dbe0" stroke="#7d8a95" strokeWidth="1.5" />
    {[[208, 122], [222, 124]].map(([x, y], i) => <g key={i} opacity={waste ? 1 : .9}><rect x={x - 5} y={y} width="10" height="14" rx="2" fill="#e9c46a" stroke="#a37d1f" strokeWidth="1.2" /><path d={`M${x - 3} ${y + 6}h6`} stroke="#a37d1f" strokeWidth="1.2" /></g>)}
    {/* house with sewage pipe */}
    <House x={120} y={228} w={34} />
    {/* landfill site */}
    <g opacity={waste ? 1 : o(2)}><path d={`M${W - 110} 214Q${W - 70} 176 ${W - 26} 212Z`} fill="#b9a88f" stroke="#83735c" strokeWidth="1.5" />
      {[[W - 90, 204], [W - 72, 196], [W - 56, 204], [W - 78, 208], [W - 44, 208]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="8" ry="6" fill={i % 2 ? '#5b6770' : '#3f4a52'} />)}</g>
    <g opacity={o(1)}>
      <path d="M142 226H170V236" fill="none" stroke="#7d8a95" strokeWidth="5" /><path d="M170 238q2 6 -1 10" stroke="#8a7a52" strokeWidth="4" fill="none" />
      {[[152, 196], [138, 204], [160, 210]].map(([x, y], i) => <Drop key={i} x={x} y={y} r={3.6} colour="#6aa84f" />)}<Arrow x1={140} y1={196} x2={150} y2={234} colour="#6aa84f" width={2.5} />
      <path d="M232 144V236" stroke="#7d8a95" strokeWidth="4" fill="none" /><path d="M232 236q4 6 0 10" stroke="#a37d1f" strokeWidth="3.5" fill="none" />
    </g>
    <g opacity={o(2)}><rect x="22" y="116" width="20" height="16" rx="3" fill="#c3cad0" stroke="#6b7680" strokeWidth="1.5" /><path d="M42 126H124" stroke="#6b7680" strokeWidth="3" />
      {[54, 72, 90, 108, 124].map(x => <g key={x}><path d={`M${x} 127v4`} stroke="#6b7680" strokeWidth="2" />{[0, 1].map(j => <circle key={j} cx={x + (j ? 3 : -3)} cy={136 + j * 6} r="2" fill="#8a6a45" />)}</g>)}</g>
    <g opacity={o(3)}>{[[251, 48, 0], [262, 37, 1], [276, 30, 2]].map(([x, y, i]) => <circle key={i} cx={x} cy={y} r={10 + i * 3} fill={smokeFill} stroke={smoke} strokeWidth="1.5" />)}</g>
    {assessment ? <>
      <Num n={1} x={186} y={218} mode="on" /><Num n={2} x={306} y={46} mode="on" /><Num n={3} x={W - 68} y={164} mode="on" /><Num n={4} x={146} y={120} mode="on" />
    </> : <>
      <Num n={1} x={190} y={216} mode={waste ? 'off' : modeOf(steps, 1)} colour={waterDeep} />
      <Num n={2} x={W - 68} y={164} mode={waste ? 'off' : modeOf(steps, 2)} colour="#8a6a45" />
      <Num n={2} x={146} y={120} mode={waste ? 'off' : modeOf(steps, 2)} colour="#8a6a45" />
      <Num n={3} x={310} y={46} mode={waste ? 'off' : modeOf(steps, 3)} colour="#6b7680" />
      <Key items={POLL_KEY} modes={waste ? ['off', 'off', 'off'] : modes(steps, 3)} y={52} gap={64} />
      {waste && <text x="392" y="252" fontSize="14" fontWeight="700" fill={ink}><tspan x="392">more things made</tspan><tspan x="392" dy="17">= more waste</tspan></text>}
      {all && <text x="392" y="236" fontSize="14" fontWeight="700" fill="#c8505a"><tspan x="392">pollution kills</tspan><tspan x="392" dy="17">plants and</tspan><tspan x="392" dy="17">animals</tspan></text>}
    </>}
  </Diagram>
}

// ---------- Lesson 57: greenhouse gases keep the Earth warm ----------
// The Earth's surface and the top of the atmosphere are two arcs of one circle, drawn much thinner than real life.
const EARTH_C = 760, EARTH_R = 540, AIR_R = 620
const arcY = (x: number, r = EARTH_R) => r1(EARTH_C - Math.sqrt(r * r - (x - 187) ** 2))
const GREEN_KEY: KeyItem[] = [{ n: 1, lines: ['energy from', 'the Sun'], colour: sunLine }, { n: 2, lines: ['some escapes', 'into space'], colour: heat }, { n: 3, lines: ['some trapped', 'by gases'], colour: heat }, { n: 4, lines: ['the Earth', 'heats up'], colour: '#c8505a' }]
const GAS = [[34, 178], [92, 164], [160, 160], [244, 164], [300, 168], [352, 190]], MORE_GAS = [[70, 162], [182, 182], [306, 204], [40, 226]]
function Bounce({ x1, x2, x3, width = 3.5 }: { x1: number; x2: number; x3: number; width?: number }) {
  const apex = arcY(x2, AIR_R) + 4
  return <g><line x1={x1} y1={arcY(x1) - 3} x2={x2} y2={apex} stroke={heat} strokeWidth={width} strokeLinecap="round" /><Arrow x1={x2} y1={apex} x2={x3} y2={arcY(x3) - 5} colour={heat} width={width} /></g>
}
function Greenhouse({ focus, assessment }: { focus: string; assessment: boolean }) {
  const stage = assessment ? 0 : ({ 'earth-green-sun': 1, 'earth-green-trap': 2, 'earth-green-more': 3, 'earth-green-warming': 4 } as Record<string, number>)[focus] ?? 4
  const steps = stage === 1 ? [1, 2] : stage === 2 || stage === 3 ? [3] : []
  const gases = stage !== 1
  const titles: Record<number, string> = {
    1: 'Energy from the Sun passes through the atmosphere and warms the Earth. The warm Earth gives off energy back towards space.',
    2: 'Greenhouse gases in the atmosphere trap some of the energy given off by the Earth, so not all of it escapes into space.',
    3: 'More carbon dioxide and methane in the atmosphere trap more energy, so less escapes into space.',
    4: 'With more energy trapped, the Earth heats up. This is global warming.',
    0: 'The Sun, the Earth and its atmosphere, with three numbered arrows showing energy.',
  }
  const outer = `M4 ${arcY(4, AIR_R)}A${AIR_R} ${AIR_R} 0 0 1 370 ${arcY(370, AIR_R)}`
  const surface = `M4 ${arcY(4)}A${EARTH_R} ${EARTH_R} 0 0 1 370 ${arcY(370)}`
  return <Diagram viewBox="0 0 540 300" title={titles[stage]}>
    <rect x="4" y="4" width="366" height="292" rx="12" fill="#eef1f8" />
    <text x="187" y="28" textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>space</text>
    <path d={`${outer}V${arcY(370)}A${EARTH_R} ${EARTH_R} 0 0 0 4 ${arcY(4)}Z`} fill="#e3f1f8" />
    <path d={outer} fill="none" stroke={gases ? purple : '#b9d3e2'} strokeWidth={gases ? 2 : 1.5} strokeDasharray={gases ? '6 5' : undefined} />
    <path d={`${surface}V296H4Z`} fill={stage === 4 ? '#f6dcc6' : grass} stroke={stage === 4 ? heat : leafLine} strokeWidth="2" />
    <text x="14" y="210" fontSize="13" fontWeight="600" fill={waterDeep}>atmosphere</text>
    {gases && GAS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4.5" fill={purpleFill} stroke={purple} strokeWidth="2" />)}
    {(stage === 3 || stage === 4) && MORE_GAS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4.5" fill={purpleFill} stroke={purple} strokeWidth="2" />)}
    {stage >= 2 && <g><circle cx="106" cy="76" r="5" fill={purpleFill} stroke={purple} strokeWidth="2" />
      <text x="116" y="81" fontSize="13" fontWeight="700" fill={purple}>{stage === 2 ? <tspan>greenhouse gases</tspan> : <><tspan x="116">more carbon dioxide</tspan><tspan x="116" dy="16">and methane</tspan></>}</text></g>}
    <Sun x={40} y={42} r={18} />
    <g opacity={show(steps, 1)}><Arrow x1={54} y1={64} x2={118} y2={220} colour={yellow} width={3.5} /><Arrow x1={64} y1={60} x2={150} y2={218} colour={yellow} width={3.5} /></g>
    <g opacity={show(steps, 2)}><Arrow x1={320} y1={233} x2={340} y2={54} colour={heat} width={stage === 3 || stage === 4 ? 2.5 : 3.5} /></g>
    <g opacity={show(steps, 3)}><Bounce x1={190} x2={214} x3={238} />{(stage === 3 || stage === 4) && <Bounce x1={248} x2={272} x3={296} />}</g>
    <text x="187" y="272" textAnchor="middle" fontSize="14" fontWeight="700" fill={stage === 4 ? '#c8505a' : leafLine}>{stage === 4 ? 'the Earth heats up' : 'Earth'}</text>
    <Num n={1} x={60} y={128} mode={modeOf(steps, 1)} colour={sunLine} />
    <Num n={2} x={356} y={130} mode={modeOf(steps, 2)} colour={heat} />
    <Num n={3} x={214} y={122} mode={modeOf(steps, 3)} colour={heat} />
    {stage === 4 && <Num n={4} x={98} y={268} mode="active" colour="#c8505a" />}
    {!assessment && <Key items={stage === 4 ? GREEN_KEY : GREEN_KEY.slice(0, 3)} modes={stage === 4 ? ['on', 'on', 'on', 'active'] : modes(steps, 3)} y={60} gap={62} />}
  </Diagram>
}

// ---------- Lesson 57: four effects of global warming (one panel each) ----------
const EFFECT_STAGE: Record<string, number> = { 'earth-effect-sea': 1, 'earth-effect-spread': 2, 'earth-effect-extinct': 3, 'earth-effect-migrate': 4, 'earth-effect-all': 0 }
const EFFECT_KEY: KeyItem[] = [{ n: 1, lines: ['sea level rises'], colour: waterDeep }, { n: 2, lines: ['species spread', 'or shrink'], colour: amber }, { n: 3, lines: ['some species', 'die out'], colour: '#c8505a' }, { n: 4, lines: ['migration', 'changes'], colour: '#3f6f93' }]
function Panel({ x, y, n, mode, colour, children }: { x: number; y: number; n: number; mode: Mode; colour: string; children: ReactNode }) {
  const clip = useId().replace(/:/g, '')
  const active = mode === 'active'
  return <g opacity={mode === 'off' ? .35 : 1}>
    <clipPath id={clip}><rect x={x} y={y} width="176" height="138" rx="10" /></clipPath>
    <rect x={x} y={y} width="176" height="138" rx="10" fill={sky} />
    <g clipPath={`url(#${clip})`}><g transform={`translate(${x} ${y})`}>{children}</g></g>
    <rect x={x} y={y} width="176" height="138" rx="10" fill="none" stroke={active ? colour : '#cfdde7'} strokeWidth={active ? 2.5 : 1.5} />
    <Num n={n} x={x + 18} y={y + 18} mode={mode === 'off' ? 'on' : mode} colour={colour} />
  </g>
}
const slope = (y: number) => .76 * (y - 30)
function Effects({ focus }: { focus: string }) {
  const stage = EFFECT_STAGE[focus] ?? 0
  const m = (n: number): Mode => stage === 0 ? 'on' : stage === n ? 'active' : 'off'
  const titles: Record<number, string> = {
    1: 'Effect 1: ice melts and seawater expands, so the sea level rises and a house on low-lying land by the coast is flooded.',
    2: 'Effect 2: on a warming mountain, the area where warm-loving species live spreads uphill, and the area left for cool-loving species at the top gets smaller.',
    3: 'Effect 3: some species cannot survive the change in climate and become extinct, so biodiversity falls.',
    4: 'Effect 4: a bird that used to migrate a short way north now migrates further north.',
    0: 'Four possible effects of global warming: rising sea level and flooding, species spreading or losing space, some species becoming extinct, and changing migration.',
  }
  return <Diagram viewBox="0 0 540 300" title={titles[stage]}>
    <Panel x={6} y={8} n={1} mode={m(1)} colour={waterDeep}>
      <path d="M56 140V90C78 88 98 86 114 82C132 78 146 52 178 42V140Z" fill={soil} stroke={soilLine} strokeWidth="1.5" />
      <path d="M56 90C78 88 98 86 114 82C132 78 146 52 178 42" fill="none" stroke={leafLine} strokeWidth="3" opacity=".6" />
      <House x={88} y={88} w={30} />
      <path d="M0 90H58V140H0Z" fill={sea} />
      <path d="M0 68H128L114 82C98 86 78 88 56 90H0Z" fill={water} opacity=".5" />
      <path d="M4 90H54" stroke={waterDeep} strokeWidth="2" strokeDasharray="5 4" />
      <path d="M0 68H128" stroke={waterDeep} strokeWidth="2.2" />
      <Arrow x1={30} y1={120} x2={30} y2={72} colour={waterDeep} width={3} />
    </Panel>
    <Panel x={190} y={8} n={2} mode={m(2)} colour={amber}>
      <path d="M12 130L88 30L164 130Z" fill="#e9efe4" stroke="#9fb39a" strokeWidth="1.5" />
      <path d={`M12 130L${r1(88 - slope(92))} 92H${r1(88 + slope(92))}L164 130Z`} fill={amberFill} stroke={amber} strokeWidth="1.5" />
      <path d={`M${r1(88 - slope(110))} 110H${r1(88 + slope(110))}`} stroke={amber} strokeWidth="2" strokeDasharray="5 4" />
      <path d={`M88 30L${r1(88 - slope(60))} 60H${r1(88 + slope(60))}Z`} fill={waterFill} stroke={waterDeep} strokeWidth="1.5" />
      <path d={`M88 30L${r1(88 - slope(76))} 76H${r1(88 + slope(76))}Z`} fill="none" stroke={waterDeep} strokeWidth="1.8" strokeDasharray="5 4" />
      <Arrow x1={48} y1={110} x2={48} y2={95} colour={amber} width={2.5} /><Arrow x1={128} y1={110} x2={128} y2={95} colour={amber} width={2.5} />
      <text x="170" y="24" textAnchor="end" fontSize="12" fontWeight="700" fill={waterDeep}>cool-loving</text>
      <text x="88" y="124" textAnchor="middle" fontSize="12" fontWeight="700" fill={amber}>warm-loving</text>
    </Panel>
    <Panel x={6} y={154} n={3} mode={m(3)} colour="#c8505a">
      {(['flower', 'caterpillar', 'bird'] as const).map((kind, i) => { const cx = 44 + i * 44
        return <g key={kind} opacity={i === 2 ? .45 : 1}><circle cx={cx} cy={66} r="20" fill="white" stroke="#b7c7d2" strokeWidth="1.6" /><g transform={`translate(${cx} 66) scale(.78)`}><SpeciesIcon kind={kind} /></g></g> })}
      <path d="M118 52L146 80M146 52L118 80" stroke="#c8505a" strokeWidth="4" strokeLinecap="round" />
      <text x="88" y="118" textAnchor="middle" fontSize="12" fontWeight="700" fill="#c8505a">biodiversity falls</text>
    </Panel>
    <Panel x={190} y={154} n={4} mode={m(4)} colour="#3f6f93">
      <path d="M0 118C40 112 70 124 110 116C140 110 160 118 176 114V140H0Z" fill={grass} />
      <Arrow x1={156} y1={60} x2={156} y2={30} colour={ink} width={2} /><text x="156" y="22" textAnchor="middle" fontSize="12" fontWeight="700" fill={ink}>N</text>
      <Arrow x1={48} y1={114} x2={48} y2={72} colour="#9fb3c2" width={2.5} dashed />
      <Arrow x1={112} y1={114} x2={112} y2={46} colour="#3f6f93" width={3} />
      <g transform="translate(112 30) scale(.75)"><SpeciesIcon kind="bird" /></g>
      <text x="48" y="132" textAnchor="middle" fontSize="12" fontWeight="600" fill={muted}>before</text>
      <text x="112" y="132" textAnchor="middle" fontSize="12" fontWeight="700" fill="#3f6f93">now</text>
    </Panel>
    <Key items={EFFECT_KEY} modes={[1, 2, 3, 4].map(n => stage === 0 ? 'on' : stage === n ? 'active' : 'off')} y={60} gap={60} />
  </Diagram>
}

// ---------- Lesson 57: how humans use land ----------
const LAND_STEPS: Record<string, number[]> = { 'earth-land-build': [1, 2], 'earth-land-farm': [3, 4], 'earth-land-less': [] }
const LAND_KEY: KeyItem[] = [{ n: 1, lines: ['building'], colour: '#3f6f93' }, { n: 2, lines: ['quarrying'], colour: '#3f6f93' }, { n: 3, lines: ['farming'], colour: '#3f6f93' }, { n: 4, lines: ['dumping waste'], colour: '#3f6f93' }, { n: 5, lines: ['less land for', 'other species'], colour: leafLine }]
function LandUse({ focus }: { focus: string }) {
  const steps = LAND_STEPS[focus] ?? []
  const less = steps.length === 0
  const titles: Record<string, string> = {
    'earth-land-build': 'Land used for building houses, and a quarry where rock is dug out of the ground.',
    'earth-land-farm': 'Land used for farming, with a field and a barn, and a landfill site where waste is dumped.',
    'earth-land-less': 'Houses, a quarry, a farm and a landfill site take up most of the land. Only a small patch of trees is left for other species.',
  }
  const blue = '#3f6f93'
  return <Diagram viewBox="0 62 540 198" title={titles[focus] ?? titles['earth-land-less']}>
    <rect x="4" y="66" width="366" height="190" rx="12" fill={sky} />
    <path d="M4 172H370V244Q370 256 358 256H16Q4 256 4 244Z" fill={grass} stroke={leafLine} strokeWidth="1.2" />
    <g opacity={show(steps, 1)}><House x={52} y={132} w={30} colour="#eadcf2" /><House x={30} y={172} w={34} /><House x={76} y={172} w={34} colour="#eadcf2" />
      <path d="M4 180H100" stroke="#9aa5ae" strokeWidth="8" /></g>
    <g opacity={show(steps, 2)}><Quarry x={150} y={180} /></g>
    <g opacity={show(steps, 3)}>
      <path d="M236 180H300L306 212H230Z" fill="#e8dcae" stroke="#b39a5a" strokeWidth="1.2" />
      {[244, 258, 272, 286].map(x => <path key={x} d={`M${x} 184Q${x + 3} 196 ${x + 1} 208`} stroke="#8fb85a" strokeWidth="3" fill="none" />)}
      <rect x="254" y="150" width="30" height="22" fill="#c97c5d" stroke="#9e5a40" strokeWidth="1.5" /><path d="M250 150L269 136L288 150Z" fill="#b5654a" stroke="#9e5a40" strokeWidth="1.5" /><rect x="263" y="158" width="12" height="14" fill="#9e5a40" /></g>
    <g opacity={show(steps, 4)}><path d="M310 200Q338 150 368 200Z" fill="#b9a88f" stroke="#83735c" strokeWidth="1.5" />
      {[[324, 192], [336, 184], [348, 192], [340, 195], [358, 196]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="7" ry="5" fill={i % 2 ? '#5b6770' : '#3f4a52'} />)}</g>
    <g><Tree x={206} y={172} s={.55} seed={61} /><Tree x={228} y={172} s={.5} seed={62} /><g transform="translate(222 104) scale(.6)"><SpeciesIcon kind="bird" /></g></g>
    {less && <rect x="182" y="86" width="68" height="92" rx="12" fill="none" stroke={leafLine} strokeWidth="2.5" strokeDasharray="6 5" />}
    <Num n={1} x={110} y={120} mode={modeOf(steps, 1)} colour={blue} />
    <Num n={2} x={150} y={224} mode={modeOf(steps, 2)} colour={blue} />
    <Num n={3} x={268} y={232} mode={modeOf(steps, 3)} colour={blue} />
    <Num n={4} x={338} y={148} mode={modeOf(steps, 4)} colour={blue} />
    {less && <Num n={5} x={268} y={108} mode="active" colour={leafLine} />}
    <Key items={LAND_KEY} modes={less ? ['on', 'on', 'on', 'on', 'active'] : [...modes(steps, 4), 'off']} y={88} gap={38} />
  </Diagram>
}

// ---------- Lesson 57: a peat bog, then the same bog drained ----------
const BOG_KEY: KeyItem[] = [{ n: 1, lines: ['bog plants die'], colour: leafLine }, { n: 2, lines: ['wet and acidic:', 'they only', 'partly rot'], colour: waterDeep }, { n: 3, lines: ['peat stores', 'carbon'], colour: '#7d5a3a' }, { n: 4, lines: ['microorganisms', 'release carbon', 'dioxide'], colour: purple }, { n: 5, lines: ['burning peat', 'releases carbon', 'dioxide'], colour: purple }]
const layer = (top: number) => `M4 ${top}H370V264Q370 276 358 276H16Q4 276 4 264Z`
function Bog({ focus }: { focus: string }) {
  const drained = focus === 'earth-bog-drain'
  const rand = seeded(57)
  const bits = Array.from({ length: 26 }, () => [r1(14 + rand() * 340), r1(132 + rand() * 132), r1(rand() * 40 - 20)])
  const title = drained
    ? 'The bog has been drained by a ditch. Peat is dug up and sold as compost. Microorganisms break down the drained peat and release carbon dioxide, and burning peat releases carbon dioxide too.'
    : 'A peat bog in cross-section: living bog plants on top of waterlogged, acidic ground. Dead plants only partly rot and build up in layers as peat, which stores carbon.'
  return <Diagram viewBox="0 0 540 280" title={title}>
    <rect x="4" y="4" width="366" height="272" rx="12" fill={sky} />
    {drained && <><rect x="4" y="8" width="366" height="34" rx="10" fill={purpleFill} stroke={purple} strokeWidth="1.5" /><text x="187" y="30" textAnchor="middle" fontSize="14" fontWeight="700" fill={purple}>carbon dioxide in the air</text></>}
    <path d={layer(120)} fill="#b48b5e" /><path d={layer(172)} fill="#9a7048" /><path d={layer(224)} fill="#7d5a3a" />
    {bits.map(([x, y, a], i) => <path key={i} d={`M${x - 7} ${y}h14`} stroke="#e2cba6" strokeWidth="2" strokeLinecap="round" opacity=".55" transform={`rotate(${a} ${x} ${y})`} />)}
    <path d={layer(drained ? 240 : 126)} fill={water} opacity={drained ? .28 : .12} />
    {!drained && [[150, 172], [250, 196], [60, 208], [300, 150], [180, 232]].map(([x, y], i) => <path key={i} d={`M${x} ${y}q5 -4 10 0t10 0t10 0`} fill="none" stroke="#bfe0f0" strokeWidth="2" strokeLinecap="round" />)}
    <path d={`M4 ${drained ? 240 : 126}${Array.from({ length: 12 }, () => 'q7.6 -4 15.25 0t15.25 0').join('')}`} fill="none" stroke={waterDeep} strokeWidth="2" opacity=".8" />
    <text x="16" y={drained ? 262 : 150} fontSize="13" fontWeight="700" fill={drained ? '#e6f3fa' : waterDeep}>{drained ? 'water drained away' : 'waterlogged'}</text>
    <text x="354" y="264" textAnchor="end" fontSize="14" fontWeight="700" fill="#fbf1e2">peat</text>
    <path d="M4 120H370" stroke={drained ? '#6b4a2e' : leafLine} strokeWidth="4" />
    {!drained && <g>
      {Array.from({ length: 11 }, (_, i) => <path key={i} d={blob(20 + i * 33, 114, 17, 8, 70 + i, .15)} fill={leafFill} stroke={leafLine} strokeWidth="1.6" />)}
      {[70, 190, 300].map(x => <g key={x}><path d={`M${x} 110V82`} stroke={leafLine} strokeWidth="2" /><circle cx={x} cy={78} r="6" fill="white" stroke="#b7c7d2" strokeWidth="1.5" /></g>)}
      <path d="M140 110C148 104 160 104 166 110C158 114 148 114 140 110Z" fill="#c9b27a" stroke="#8a7440" strokeWidth="1.5" /><Arrow x1={153} y1={118} x2={153} y2={156} colour={leafLine} width={2.5} />
      <Num n={1} x={112} y={92} mode="active" colour={leafLine} />
      <Num n={2} x={220} y={150} mode="active" colour={waterDeep} />
      <Num n={3} x={34} y={246} mode="active" colour="#7d5a3a" />
      <text x="52" y="251" fontSize="13" fontWeight="700" fill="#fbf1e2">carbon stored</text>
    </g>}
    {drained && <g>
      <path d="M312 120L322 236H342L352 120Z" fill={sky} stroke="#6b4a2e" strokeWidth="1.5" /><path d="M322 230H342L341 236H323Z" fill={water} />
      <rect x="84" y="94" width="42" height="26" rx="7" fill="#8a6a45" stroke="#5e452c" strokeWidth="1.5" />
      <rect x="30" y="88" width="60" height="32" rx="8" fill="#6b4a2e" stroke="#4a3320" strokeWidth="1.5" /><text x="60" y="109" textAnchor="middle" fontSize="12" fontWeight="700" fill="white">compost</text>
      <Microbes x={250} y={172} r={18} seed={58} />
      <Arrow x1={250} y1={152} x2={250} y2={48} colour={purple} width={3} />
      <Flame x={172} y={120} /><Arrow x1={172} y1={86} x2={172} y2={48} colour={purple} width={3} />
      <Num n={4} x={274} y={100} mode="active" colour={purple} />
      <Num n={5} x={196} y={72} mode="active" colour={purple} />
    </g>}
    <Key items={drained ? BOG_KEY : BOG_KEY.slice(0, 3)} modes={drained ? ['off', 'off', 'off', 'active', 'active'] : ['active', 'active', 'active']} y={40} gap={52} />
  </Diagram>
}

// ---------- Lesson 57: deforestation ----------
const FOREST_STEPS: Record<string, number[]> = { 'earth-forest-clear': [1], 'earth-forest-fuel': [2], 'earth-forest-less': [3], 'earth-forest-release': [4, 5], 'earth-forest-species': [6], 'earth-forest-all': [] }
const FOREST_KEY: KeyItem[] = [{ n: 1, lines: ['cleared for', 'farming'], colour: '#3f6f93' }, { n: 2, lines: ['crops for', 'biofuels'], colour: '#3f6f93' }, { n: 3, lines: ['less carbon', 'dioxide', 'taken in'], colour: purple }, { n: 4, lines: ['burning', 'releases carbon', 'dioxide'], colour: purple }, { n: 5, lines: ['microorganisms', 'decay dead', 'wood'], colour: microbe }, { n: 6, lines: ['fewer species'], colour: leafLine }]
function Butterfly({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}><ellipse cx="-7" cy="-4" rx="7" ry="9" fill="#f2b36b" stroke="#b87a33" strokeWidth="1.3" transform="rotate(-20 -7 -4)" /><ellipse cx="7" cy="-4" rx="7" ry="9" fill="#f2b36b" stroke="#b87a33" strokeWidth="1.3" transform="rotate(20 7 -4)" />
    <ellipse cx="-5" cy="7" rx="5" ry="5" fill="#f6cf95" stroke="#b87a33" strokeWidth="1.3" /><ellipse cx="5" cy="7" rx="5" ry="5" fill="#f6cf95" stroke="#b87a33" strokeWidth="1.3" /><path d="M0 -8V12" stroke="#5e452c" strokeWidth="2.4" strokeLinecap="round" /></g>
}
function Cow({ x, y }: { x: number; y: number }) {
  return <g stroke="#5e5a55" strokeWidth="1.4"><path d={`M${x - 10} ${y - 8}V${y}M${x - 4} ${y - 8}V${y}M${x + 6} ${y - 8}V${y}M${x + 12} ${y - 8}V${y}`} strokeWidth="2.4" />
    <rect x={x - 14} y={y - 22} width="30" height="16" rx="7" fill="#f7f4ee" /><path d={`M${x - 6} ${y - 22}q6 6 0 12`} fill="none" /><ellipse cx={x + 4} cy={y - 16} rx="4" ry="3.5" fill="#4a4540" stroke="none" />
    <rect x={x + 14} y={y - 28} width="10" height="12" rx="4" fill="#f7f4ee" /><circle cx={x + 21} cy={y - 24} r="1.2" fill={ink} stroke="none" /></g>
}
function Forest({ focus, assessment }: { focus: string; assessment: boolean }) {
  const steps = assessment ? [] : FOREST_STEPS[focus] ?? []
  const s = steps[0] || 0
  const titles: Record<number, string> = {
    1: 'Part of a rainforest has been cut down and the land cleared for farming cattle.',
    2: 'Crops are grown on cleared land and made into fuel. These are biofuels.',
    3: 'Trees take in carbon dioxide for photosynthesis. Where the trees have been cut down, less carbon dioxide is taken in.',
    4: 'Burning the trees releases carbon dioxide, and microorganisms feeding on the dead wood release carbon dioxide as they respire.',
    6: 'The standing forest is home to many species. The cleared land has far fewer.',
    0: assessment ? 'A rainforest with a cleared area, a fire, fallen logs with microorganisms and a farm. Three numbered arrows join them to the carbon dioxide in the air.' : 'Deforestation: less carbon dioxide is taken in, more is released by burning and decay, and biodiversity falls.',
  }
  return <Diagram viewBox="0 0 540 320" title={titles[s]}>
    <rect x="4" y="4" width="366" height="312" rx="12" fill={sky} />
    <rect x="4" y="8" width="366" height="36" rx="10" fill={purpleFill} stroke={purple} strokeWidth="1.5" />
    <text x="187" y="31" textAnchor="middle" fontSize="14" fontWeight="700" fill={purple}>carbon dioxide in the air</text>
    <path d="M4 256H370V306Q370 316 360 316H14Q4 316 4 306Z" fill={soil} stroke={soilLine} strokeWidth="1.5" />
    <path d="M4 256H370" stroke={leafLine} strokeWidth="4" opacity=".55" />
    {/* standing forest */}
    <Tree x={38} y={256} s={.95} seed={51} /><Tree x={84} y={256} s={1.05} seed={52} /><Tree x={130} y={256} s={.95} seed={53} />
    <g opacity={s === 6 || s === 0 ? 1 : .8}><g transform="translate(100 146) scale(.8)"><SpeciesIcon kind="bird" /></g><Butterfly x={150} y={142} /><g transform="translate(61 244) scale(.62)"><SpeciesIcon kind="flower" /></g><g transform="translate(107 249) scale(.6)"><SpeciesIcon kind="caterpillar" /></g></g>
    {/* cleared land: stumps and logs */}
    <Tree x={178} y={256} s={1} stump /><Tree x={256} y={256} s={.9} stump />
    <rect x="196" y="244" width="50" height="11" rx="5.5" fill={trunk} stroke={trunkLine} strokeWidth="1.5" /><rect x="202" y="233" width="40" height="11" rx="5.5" fill={trunk} stroke={trunkLine} strokeWidth="1.5" />
    <g opacity={show(steps, 5)}><Microbes x={222} y={218} r={15} seed={59} /><Arrow x1={222} y1={200} x2={222} y2={50} colour={purple} width={3} /></g>
    <g opacity={show(steps, 4)}><path d="M262 256l12 -7l12 7M266 256l16 -9" stroke={trunkLine} strokeWidth="4" strokeLinecap="round" /><Flame x={274} y={250} /><Arrow x1={274} y1={214} x2={274} y2={50} colour={purple} width={3} /></g>
    {/* farm on the cleared land */}
    <g opacity={show(steps, 1)}><Cow x={314} y={254} /></g>
    <g opacity={show(steps, 2)}>{[336, 348, 360].map(x => <path key={x} d={`M${x} 256V236M${x} 246l-6 -6M${x} 242l6 -6`} stroke="#6aa84f" strokeWidth="2.4" strokeLinecap="round" fill="none" />)}
      <Arrow x1={348} y1={228} x2={348} y2={212} colour="#6aa84f" width={2} />
      <path d="M338 180h16l6 6v22h-22Z" fill="#e0a13c" stroke="#9c6a1c" strokeWidth="1.5" /><path d="M354 180l6 -6h4v6" fill="none" stroke="#9c6a1c" strokeWidth="2" /></g>
    <g opacity={show(steps, 3)}><Arrow x1={62} y1={50} x2={62} y2={158} colour={purple} width={5} />
      {!assessment && <g opacity={s === 3 ? 1 : .6}><Arrow x1={178} y1={50} x2={178} y2={212} colour="#c4b2e0" width={3} dashed /><path d="M168 118l20 20M188 118l-20 20" stroke="#c8505a" strokeWidth="4" strokeLinecap="round" /></g>}</g>
    {assessment ? <>
      <Num n={1} x={296} y={120} mode="on" /><Num n={2} x={244} y={150} mode="on" /><Num n={3} x={40} y={100} mode="on" />
    </> : <>
      <Num n={1} x={314} y={214} mode={modeOf(steps, 1)} colour="#3f6f93" />
      <Num n={2} x={320} y={170} mode={modeOf(steps, 2)} colour="#3f6f93" />
      <Num n={3} x={40} y={100} mode={modeOf(steps, 3)} colour={purple} />
      <Num n={4} x={296} y={120} mode={modeOf(steps, 4)} colour={purple} />
      <Num n={5} x={244} y={150} mode={modeOf(steps, 5)} colour={microbe} />
      <Num n={6} x={124} y={112} mode={modeOf(steps, 6)} colour={leafLine} />
      <Key items={FOREST_KEY} modes={modes(steps, 6)} y={32} gap={54} />
    </>}
  </Diagram>
}

// ---------- Simple bar chart for invented data ----------
function BarChart({ title, bars, yMax, yStep, yLabel, xLabel, colour = amber, fill = amberFill }: { title: string; bars: Array<[string, number]>; yMax: number; yStep: number; yLabel: string; xLabel: string; colour?: string; fill?: string }) {
  const left = 90, right = 510, top = 24, bottom = 220, h = bottom - top
  const w = (right - left) / bars.length
  const ticks = Array.from({ length: Math.floor(yMax / yStep) + 1 }, (_, i) => i * yStep)
  return <Diagram viewBox="0 0 540 280" title={title}>
    {ticks.map(t => { const y = bottom - t / yMax * h; return <g key={t}><line x1={left} y1={y} x2={right} y2={y} stroke="#dde7ee" strokeWidth="1" /><text x={left - 8} y={y + 4} textAnchor="end" fontSize="12" fill={ink}>{t}</text></g> })}
    {bars.map(([name, v], i) => { const bh = v / yMax * h, x = left + i * w + w * .22; return <g key={name}>
      <rect x={r1(x)} y={r1(bottom - bh)} width={r1(w * .56)} height={r1(bh)} rx="3" fill={fill} stroke={colour} strokeWidth="2" />
      <text x={r1(x + w * .28)} y={r1(bottom - bh - 6)} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{v}</text>
      <text x={r1(x + w * .28)} y={bottom + 18} textAnchor="middle" fontSize="13" fill={ink}>{name}</text></g> })}
    <line x1={left} y1={bottom} x2={right} y2={bottom} stroke={ink} strokeWidth="1.8" /><line x1={left} y1={top - 6} x2={left} y2={bottom} stroke={ink} strokeWidth="1.8" />
    <text x={(left + right) / 2} y={bottom + 44} textAnchor="middle" fontSize="13" fontWeight="600" fill={ink}>{xLabel}</text>
    <text transform={`translate(26 ${(top + bottom) / 2}) rotate(-90)`} textAnchor="middle" fontSize="13" fontWeight="600" fill={ink}>{yLabel}</text>
  </Diagram>
}

export function EarthVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('earth-water-')) return <WaterCycle focus={focus} assessment={assessment || focus === 'earth-water-question'} />
  if (focus.startsWith('earth-need-')) return <WaterForLife focus={focus} />
  if (focus.startsWith('earth-decay-')) return <Decay focus={focus} />
  if (focus.startsWith('earth-carbon-')) return <CarbonCycle focus={focus} assessment={assessment || focus === 'earth-carbon-question'} />
  if (focus.startsWith('earth-bio-')) return <Biodiversity focus={focus} />
  if (focus.startsWith('earth-people-')) return <People focus={focus} />
  if (focus.startsWith('earth-pollution-')) return <Pollution focus={focus} assessment={assessment || focus === 'earth-pollution-question'} />
  if (focus === 'earth-survey-data') return <BarChart title="Bar chart: number of kinds of small river animals found at three places. Upstream of the pipe: 12; at the pipe: 3; 1 km downstream: 7. Invented data." bars={[['upstream', 12], ['at the pipe', 3], ['1 km downstream', 7]]} yMax={14} yStep={2} yLabel="kinds of animal found" xLabel="place in the river" colour={waterDeep} fill={waterFill} />
  if (focus === 'earth-leaf-data') return <BarChart title="Bar chart: mass of leaves left in one mesh bag on a woodland floor. 0 months: 40 g; 2 months: 31 g; 4 months: 22 g; 6 months: 15 g. Invented data." bars={[['0', 40], ['2', 31], ['4', 22], ['6', 15]]} yMax={40} yStep={10} yLabel="mass of leaves (g)" xLabel="time on the woodland floor (months)" />
  if (focus.startsWith('earth-green-')) return <Greenhouse focus={focus} assessment={assessment || focus === 'earth-green-question'} />
  if (focus.startsWith('earth-effect-')) return <Effects focus={focus} />
  if (focus.startsWith('earth-land-')) return <LandUse focus={focus} />
  if (focus.startsWith('earth-bog-')) return <Bog focus={focus} />
  if (focus.startsWith('earth-forest-')) return <Forest focus={focus} assessment={assessment || focus === 'earth-forest-question'} />
  if (focus === 'earth-bird-data') return <BarChart title="Bar chart: number of kinds of bird found in three areas of one forest. Untouched forest: 42; partly cleared: 25; cleared for farming: 8. Invented data." bars={[['untouched forest', 42], ['partly cleared', 25], ['cleared for farming', 8]]} yMax={50} yStep={10} yLabel="kinds of bird found" xLabel="area of the forest" colour={leafLine} fill="#dcefd3" />
  void Label; void Badge; void Tree
  return null
}
