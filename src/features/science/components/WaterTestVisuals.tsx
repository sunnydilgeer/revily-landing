import type { ReactNode } from 'react'
import { Arrow } from './InfectionVisuals'
import {
  waterPalette as W, r1, type Mode, type Pt, Diagram, Num, KeyRow, Pointer, Tag, Tick, Cross, Halo, Crystal, Steam, Bubbles,
  Beaker, Glass, HeatStand, Basin, Balance, Bench, Thermometer, Reading, Rig, RIG, rigAt, type RigFocus,
} from './PotableVisuals'

/*
 * Chemistry Lesson 54: testing and purifying water. Original, code-native schematics; not to scale. Focus ids start with
 * 'wtest-'. Uses the water kit from PotableVisuals.tsx (Lesson 53), so the colours and the distillation rig match the
 * potable-water and separation lessons: water = pale blue, dissolved solids = lavender, heat = orange, steam = grey-blue.
 * The evaporating-basin walkthrough reuses one layout (drawing on the left, the five steps on the right) and the
 * distillation walkthrough reuses one rig, highlighting a part per frame.
 */
const { ink, muted, panelFill, panelLine } = W

// ---------- Section: what is pure water like? ----------
function NoTaste({ x, y }: { x: number; y: number }) {
  return <g>
    <Glass cx={x} base={y + 26} w={34} h={46} level={.6} />
    <circle cx={x} cy={y} r="34" fill="none" stroke={W.bad} strokeWidth="4" />
    <path d={`M${x - 24} ${y - 24}L${x + 24} ${y + 24}`} stroke={W.bad} strokeWidth="4" />
  </g>
}
function PhPaper({ x, y, colour = '#7cc95d' }: { x: number; y: number; colour?: string }) {
  return <g><rect x={x} y={y} width={16} height={70} rx="3" fill="#fbf6ea" stroke="#b9a77a" strokeWidth="1.6" /><rect x={x + 1} y={y + 44} width={14} height={25} rx="2" fill={colour} opacity=".85" /></g>
}
function Intro() {
  return <Diagram viewBox="0 0 540 290" title="A beaker of water to be tested, with a thermometer, a strip of pH paper and a balance beside it. A cup crossed out in red says: never taste a sample.">
    <Bench x1={20} x2={520} y={244} />
    <Beaker x={196} y={110} w={110} h={132} level={.66} />
    <text x={251} y={92} textAnchor="middle" fontSize="15" fontWeight="700" fill={W.deep}>water sample</text>
    <Thermometer x={64} y1={110} bulbY={232} top={200} />
    <PhPaper x={136} y={170} />
    <Balance cx={424} y={192} reading="0.00 g" w={150} />
    <text x={64} y={270} textAnchor="middle" fontSize="13" fill={muted}>thermometer</text>
    <text x={146} y={270} textAnchor="middle" fontSize="13" fill={muted}>pH paper</text>
    <text x={424} y={270} textAnchor="middle" fontSize="13" fill={muted}>balance</text>
    <NoTaste x={420} y={74} />
    <text x={420} y={140} textAnchor="middle" fontSize="15" fontWeight="700" fill={W.bad}>never taste</text>
  </Diagram>
}
function PhScale({ x, y, w = 196, mark = 7 }: { x: number; y: number; w?: number; mark?: number }) {
  const cols = ['#e2524a', '#ea6c43', '#f08a3e', '#f4a63c', '#f3c13f', '#e6d24a', '#b9d552', '#7cc95d', '#4fb58a', '#3e9fae', '#3f82c2', '#4d64b8', '#5b4ea6', '#62418f']
  const cw = w / 14, xAt = (p: number) => x + (p - .5) * cw
  return <g>
    {cols.map((c, i) => <rect key={i} x={r1(x + i * cw)} y={y} width={r1(cw + .4)} height={22} fill={c} opacity=".8" />)}
    <rect x={x} y={y} width={w} height={22} rx="4" fill="none" stroke={muted} strokeWidth="1.4" />
    <rect x={r1(xAt(mark) - cw / 2 - 1)} y={y - 4} width={r1(cw + 2)} height={30} rx="4" fill="none" stroke={ink} strokeWidth="2.6" />
    {[1, 7, 14].map(p => <text key={p} x={r1(xAt(p))} y={y + 42} textAnchor="middle" fontSize="12" fontWeight={p === mark ? 700 : 400} fill={p === mark ? ink : muted}>{p}</text>)}
  </g>
}
/** The three properties, as three soft panels. `compact` shrinks them to the top of the frame. */
function PropertyPanels({ compact = false }: { compact?: boolean }) {
  const top = compact ? 10 : 24, h = compact ? 120 : 236, pw = 170
  const heads = ['boils at 100 °C', 'pH 7: neutral', 'no dissolved solids']
  return <g>{[0, 1, 2].map(i => { const x = 5 + i * 180, cx = x + pw / 2; return <g key={i}>
    <rect x={x} y={top} width={pw} height={h} rx="14" fill={panelFill} stroke={panelLine} strokeWidth="1.6" />
    <text x={cx} y={top + h - 14} textAnchor="middle" fontSize="14" fontWeight="700" fill={[W.heatLine, W.good, W.deep][i]}>{heads[i]}</text>
    {i === 0 && (compact
      ? <g><Thermometer x={cx - 30} y1={top + 12} bulbY={top + 84} top={top + 18} /><Reading x={cx + 22} y={top + 54} text="100 °C" /></g>
      : <g><Thermometer x={cx - 30} y1={top + 20} bulbY={top + 180} top={top + 30} /><Reading x={cx + 26} y={top + 60} text="100 °C" /></g>)}
    {i === 1 && <PhScale x={x + 12} y={compact ? top + 30 : top + 90} w={pw - 24} />}
    {i === 2 && (compact
      ? <Beaker x={cx - 30} y={top + 22} w={60} h={62} level={.7} />
      : <Beaker x={cx - 46} y={top + 50} w={92} h={130} level={.72} />)}
  </g> })}</g>
}
function Three() {
  return <Diagram viewBox="0 0 540 290" title="Three properties of pure water: it boils at 100 °C; it has a pH of 7, which is neutral; and it has no dissolved solids.">
    <PropertyPanels />
  </Diagram>
}
function Match() {
  return <Diagram viewBox="0 0 540 330" title="Each property has its own check. Boiling point: a thermometer in boiling water. pH: a pH probe in the sample. Dissolved solids: evaporate the sample in an evaporating basin and see what is left.">
    <PropertyPanels compact />
    {[0, 1, 2].map(i => <Arrow key={i} x1={90 + i * 180} y1={136} x2={90 + i * 180} y2={162} colour={ink} width={2.4} />)}
    {/* boiling point: thermometer in boiling water */}
    <HeatStand cx={94} gauzeY={262} ground={308} flame="gentle" width={70} />
    <Beaker x={66} y={206} w={56} h={56} level={.62}><Bubbles pts={[[82, 250], [100, 244], [92, 232]]} r={2.4} /></Beaker>
    <Thermometer x={104} y1={172} bulbY={246} top={180} />
    {/* pH: probe and meter */}
    <Beaker x={228} y={226} w={60} h={62} level={.7} />
    <path d="M258 248V182Q258 172 268 172H300" fill="none" stroke={muted} strokeWidth="2.4" />
    <rect x={252} y={196} width={12} height={62} rx="5" fill="#dbe6ee" stroke={W.metalLine} strokeWidth="1.6" />
    <rect x={296} y={166} width={60} height={42} rx="8" fill={panelFill} stroke={ink} strokeWidth="1.8" />
    <text x={326} y={193} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>7.0</text>
    {/* dissolved solids: evaporating basin over a flame */}
    <HeatStand cx={446} gauzeY={262} ground={308} flame="gentle" width={80} />
    <Basin cx={446} y={262} w={76} fill={.4} />
    <Steam cx={446} y={226} n={2} gap={20} />
    <text x={94} y={326} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>thermometer</text>
    <text x={270} y={326} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>pH probe</text>
    <text x={446} y={326} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>evaporate</text>
  </Diagram>
}

// ---------- Section: the evaporating basin test (one layout, five steps) ----------
type BasinStep = 'basin' | 'sample' | 'heat' | 'weigh' | 'change' | 'look'
const BASIN_STEP: Record<BasinStep, number> = { basin: 1, sample: 2, heat: 3, weigh: 4, change: 5, look: 6 }
const BASIN_ROWS = [['weigh the empty basin'], ['add a known volume'], ['heat until dry'], ['cool, then weigh again'], ['subtract the masses']]
const BASIN_TITLES: Record<BasinStep, string> = {
  basin: 'Step 1: a clean, dry evaporating basin on a balance. The balance reads 40.16 g.',
  sample: 'Step 2: a measuring cylinder pours a known volume of the water sample into the basin.',
  heat: 'Step 3: the basin is heated on a tripod and gauze over a Bunsen burner. Steam rises and the water level falls until the basin is completely dry.',
  weigh: 'Step 4: the cooled basin, with a thin ring of solid left in it, back on the balance. The balance now reads 40.22 g.',
  change: 'Step 5: subtract the masses. 40.22 g − 40.16 g = 0.06 g. The mass increased, so dissolved solids were present.',
  look: 'A close-up of the dry basin with a magnifying glass over a very faint ring of solid. Small amounts may be hard to see, so the mass is the better check.',
}
function Cylinder({ x, y, angle }: { x: number; y: number; angle: number }) {
  // A measuring cylinder, drawn upright with its foot at (x, y), then tipped by `angle` degrees about the foot.
  return <g transform={`rotate(${angle} ${x} ${y})`}>
    <rect x={x - 20} y={y - 6} width={40} height={8} rx="3" fill={W.glass} stroke={W.glassLine} strokeWidth="2" />
    <path d={`M${x - 13} ${y - 6}V${y - 84}H${x + 13}V${y - 6}Z`} fill={W.glass} />
    <path d={`M${x - 12} ${y - 58}V${y - 83}H${x + 12}V${y - 58}Z`} fill={W.water} />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${x + 13} ${y - 16 - i * 11}h-${i % 2 ? 6 : 10}`} stroke={W.glassLine} strokeWidth="1.3" />)}
    <path d={`M${x - 13} ${y - 6}V${y - 84}M${x + 13} ${y - 6}V${y - 84}l5 -4`} fill="none" stroke={W.glassLine} strokeWidth="2.2" />
  </g>
}
function Magnifier({ x, y, r = 34 }: { x: number; y: number; r?: number }) {
  return <g>
    <path d={`M${r1(x + r * .72)} ${r1(y + r * .72)}L${r1(x + r * 1.5)} ${r1(y + r * 1.5)}`} stroke="#8a6a44" strokeWidth="9" />
    <circle cx={x} cy={y} r={r} fill="white" fillOpacity=".35" stroke={W.metalLine} strokeWidth="4" />
  </g>
}
function BasinScene({ step }: { step: BasinStep }) {
  const n = BASIN_STEP[step]
  const mode = (k: number): Mode => n === 6 ? 'on' : k === n ? 'active' : k < n ? 'on' : 'off'
  let art: ReactNode = null
  if (step === 'basin') art = <g>
    <Balance cx={150} y={214} reading="40.16 g" hot />
    <Basin cx={150} y={214} w={120} />
    <Tag x={150} y={120} lines={['clean, dry', 'evaporating basin']} anchor="middle" to={[150, 190]} colour={ink} />
  </g>
  else if (step === 'sample') art = <g>
    <Bench x1={40} x2={300} y={262} />
    <Basin cx={170} y={262} w={130} fill={.35} />
    <Cylinder x={70} y={120} angle={108} />
    <path d="M150 150Q158 180 160 240" fill="none" stroke={W.waterLine} strokeWidth="3" />
    <Tag x={200} y={52} lines={['known volume', 'of sample']} anchor="middle" colour={W.deep} />
    <Tag x={24} y={200} lines={['measuring', 'cylinder']} to={[92, 150]} colour={muted} size={13} />
  </g>
  else if (step === 'heat') art = <g>
    <HeatStand cx={110} gauzeY={196} ground={286} width={120} />
    <Basin cx={110} y={196} w={120} fill={.3} />
    <Steam cx={110} y={150} n={3} />
    <text x={110} y={62} textAnchor="middle" fontSize="14" fontWeight="700" fill={W.heatLine}>heat until</text>
    <text x={110} y={80} textAnchor="middle" fontSize="14" fontWeight="700" fill={W.heatLine}>completely dry</text>
    {[.7, .35, 0].map((f, i) => <g key={i}><Basin cx={258} y={96 + i * 76} w={66} fill={f} /></g>)}
    <Arrow x1={258} y1={106} x2={258} y2={146} colour={muted} width={2} /><Arrow x1={258} y1={182} x2={258} y2={222} colour={muted} width={2} />
    <text x={258} y={268} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>dry</text>
  </g>
  else if (step === 'weigh') art = <g>
    <Balance cx={150} y={214} reading="40.22 g" hot />
    <Basin cx={150} y={214} w={120} ring />
    <Tag x={150} y={120} lines={['cooled basin with', 'solid left behind']} anchor="middle" to={[150, 208]} colour={ink} />
  </g>
  else if (step === 'change') art = <g>
    <Balance cx={80} y={120} reading="40.16 g" w={140} />
    <Basin cx={80} y={120} w={90} />
    <Balance cx={236} y={120} reading="40.22 g" w={140} />
    <Basin cx={236} y={120} w={90} ring />
    <text x={80} y={70} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>empty basin</text>
    <text x={236} y={70} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>after drying</text>
    <rect x={30} y={196} width={256} height={40} rx="20" fill="#fdf0dc" stroke="#d98a1c" strokeWidth="2" />
    <text x={158} y={222} textAnchor="middle" fontSize="17" fontWeight="700" fill={W.amberInk}>40.22 − 40.16 = 0.06 g</text>
    <path d="M36 262l6 -10l6 10z" fill={W.good} />
    <text x={56} y={264} fontSize="14" fontWeight="700" fill={W.good}>increase: dissolved solids</text>
    <text x={56} y={282} fontSize="14" fontWeight="700" fill={W.good}>were present</text>
  </g>
  else art = <g>
    <Basin cx={140} y={210} w={230} ring faint />
    <Magnifier x={120} y={196} r={40} />
    <Tag x={150} y={62} lines={['small amounts may', 'be hard to see']} anchor="middle" colour={ink} />
  </g>
  return <Diagram viewBox="0 0 540 300" title={BASIN_TITLES[step]}>
    {step === 'basin' || step === 'weigh' ? <Halo x={62} y={160} w={176} h={112} /> : null}
    {art}
    <text x={318} y={32} fontSize="14" fontWeight="700" fill={ink}>Testing for dissolved solids</text>
    {BASIN_ROWS.map((lines, i) => <KeyRow key={i} n={i + 1} x={330} y={68 + i * 46} lines={lines} mode={mode(i + 1)} colour={[ink, W.deep, W.heatLine, ink, W.amberInk][i]} />)}
    {step === 'look' && <text x={318} y={296} fontSize="13" fill={muted}>The mass is the better check.</text>}
  </Diagram>
}

// ---------- Section: pH and boiling point ----------
function Ph() {
  return <Diagram viewBox="0 0 540 290" title="Two ways to check pH. Left: a pH probe dipped in the water sample, wired to a meter reading 7.0. Right: a strip of universal indicator paper that has turned green, next to a colour scale where green means pH 7.">
    <Bench x1={20} x2={250} y={262} />
    <Beaker x={40} y={140} w={110} h={120} level={.68} />
    <path d="M95 226V96Q95 80 111 80H168" fill="none" stroke={muted} strokeWidth="2.6" />
    <rect x={88} y={120} width={14} height={112} rx="6" fill="#dbe6ee" stroke={W.metalLine} strokeWidth="1.8" />
    <rect x={164} y={56} width={84} height={58} rx="10" fill={panelFill} stroke={ink} strokeWidth="2" />
    <rect x={174} y={66} width={64} height={30} rx="5" fill="white" stroke={muted} strokeWidth="1.4" />
    <text x={206} y={88} textAnchor="middle" fontSize="18" fontWeight="700" fill={ink}>7.0</text>
    <text x={206} y={108} textAnchor="middle" fontSize="12" fill={muted}>pH</text>
    <text x={140} y={32} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>pH probe and meter</text>
    <path d="M270 30V270" stroke={panelLine} strokeWidth="1.5" strokeDasharray="4 6" />
    <text x={404} y={32} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>universal indicator</text>
    <PhPaper x={330} y={70} />
    <Arrow x1={354} y1={128} x2={380} y2={176} colour={muted} width={2} />
    <PhScale x={300} y={190} w={210} />
    <text x={404} y={266} textAnchor="middle" fontSize="14" fontWeight="700" fill={W.good}>green: pH 7</text>
    <text x={380} y={100} fontSize="13" fill={muted}>paper turns</text>
    <text x={380} y={116} fontSize="13" fill={muted}>green</text>
  </Diagram>
}
function BoilingPoint() {
  return <Diagram viewBox="0 0 540 300" title="A beaker of water being heated on a tripod and gauze over a Bunsen burner. The water is boiling, with bubbles, and a thermometer in it reads 100 °C: pure water boils at 100 °C.">
    <HeatStand cx={150} gauzeY={206} ground={290} width={130} />
    <Beaker x={96} y={96} w={108} h={110} level={.7}>
      <Bubbles pts={[[118, 196], [136, 186], [168, 192], [184, 178], [128, 160], [176, 150], [146, 170]]} r={3.4} />
    </Beaker>
    <Thermometer x={172} y1={30} bulbY={186} top={44} />
    <Reading x={246} y={62} text="100 °C" w={82} />
    <path d="M205 54H178" stroke={W.heatLine} strokeWidth="1.6" />
    <Steam cx={130} y={112} n={2} gap={26} />
    <text x={300} y={150} fontSize="16" fontWeight="700" fill={W.deep}>pure water boils</text>
    <text x={300} y={172} fontSize="16" fontWeight="700" fill={W.deep}>at 100 °C</text>
    <text x={300} y={206} fontSize="13" fill={muted}>A pure substance boils at</text>
    <text x={300} y={223} fontSize="13" fill={muted}>one fixed temperature.</text>
  </Diagram>
}
function Results() {
  const rows = ['solid left behind?', 'pH about 7?', 'boils at 100 °C?']
  const pure = ['no', 'yes', 'yes'], impure = ['yes', 'no', 'no']
  return <Diagram viewBox="0 0 540 290" schematic={false} title="A results checklist. Solid left behind? Pure water: no. pH about 7? Pure water: yes. Boils at 100 °C? Pure water: yes. Any failed check means the sample is not pure.">
    <rect x={20} y={16} width={500} height={218} rx="14" fill={panelFill} stroke={panelLine} strokeWidth="1.6" />
    <text x={40} y={48} fontSize="14" fontWeight="700" fill={muted}>check</text>
    <text x={330} y={48} textAnchor="middle" fontSize="14" fontWeight="700" fill={W.good}>pure water</text>
    <text x={448} y={48} textAnchor="middle" fontSize="14" fontWeight="700" fill={W.bad}>not pure</text>
    {rows.map((r, i) => { const y = 92 + i * 50; return <g key={i}>
      <path d={`M34 ${y - 28}H506`} stroke={panelLine} strokeWidth="1.2" />
      <text x={40} y={y + 5} fontSize="16" fontWeight="700" fill={ink}>{r}</text>
      <Tick x={306} y={y} r={13} /><text x={326} y={y + 5} fontSize="15" fontWeight="600" fill={ink}>{pure[i]}</text>
      <Cross x={424} y={y} r={13} /><text x={444} y={y + 5} fontSize="15" fontWeight="600" fill={ink}>{impure[i]}</text>
    </g> })}
    <text x={270} y={268} textAnchor="middle" fontSize="16" fontWeight="700" fill={W.bad}>any failed check: not pure</text>
  </Diagram>
}

// ---------- Section: distilling water in the lab (one rig) ----------
function Why() {
  const salt: Pt[] = [[-30, -20], [-6, -28], [22, -18], [-20, 6], [8, 0], [30, 14], [-32, 26], [-4, 24], [18, 34]]
  return <Diagram viewBox="0 0 540 280" title="Distillation separates pure water from impurities. Left: a beaker of salty water with dissolved solid particles. An arrow labelled boil, then condense leads to a beaker of pure water with no particles. The salt is left behind.">
    <Beaker x={40} y={80} w={116} h={140} level={.74}>
      {salt.map(([dx, dy], i) => <circle key={i} cx={98 + dx} cy={172 + dy} r="4.4" fill={W.salt} stroke={W.saltLine} strokeWidth="1.4" />)}
    </Beaker>
    <text x={98} y={56} textAnchor="middle" fontSize="15" fontWeight="700" fill={W.saltLine}>impure water</text>
    <Arrow x1={176} y1={150} x2={330} y2={150} colour={ink} width={3.4} />
    <text x={252} y={132} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>distil:</text>
    <text x={252} y={180} textAnchor="middle" fontSize="14" fill={ink}>boil, then condense</text>
    <Beaker x={356} y={80} w={116} h={140} level={.74} />
    <text x={414} y={56} textAnchor="middle" fontSize="15" fontWeight="700" fill={W.deep}>pure water</text>
    <text x={414} y={250} textAnchor="middle" fontSize="13" fill={muted}>no dissolved solids</text>
    <text x={98} y={250} textAnchor="middle" fontSize="13" fill={muted}>the salt is left behind</text>
    {[[-24, 0], [-8, 4], [8, 1], [24, 3]].map(([dx, dy], i) => <Crystal key={i} x={98 + dx} y={266 + dy} s={6} />)}
  </Diagram>
}
type DistStep = 'flask' | 'condenser' | 'collect' | 'setup'
const DIST_ROWS = [['heat: the water boils'], ['steam rises'], ['steam condenses'], ['pure water collected']]
const DIST_TITLES: Record<DistStep, string> = {
  flask: 'Distillation apparatus. Impure water in a round-bottomed flask is heated by a Bunsen burner until it boils; steam rises past the thermometer in the neck, which reads 100 °C. The dissolved solids stay behind in the flask.',
  condenser: 'The steam passes into the condenser, a sloping tube with an outer jacket of cold water. Cold water goes in at the bottom and out at the top. The steam cools and condenses back into liquid water.',
  collect: 'Liquid water drips out of the end of the condenser into a beaker: pure water is collected.',
  setup: 'The whole set-up: 1 heat the flask so the water boils, 2 steam rises, 3 the condenser cools it back to liquid water, 4 pure water is collected in the beaker. The dissolved solids stay in the flask.',
}
function Distillation({ step }: { step: DistStep }) {
  const n = ({ flask: 1, condenser: 3, collect: 4, setup: 0 } as const)[step]
  const mode = (k: number): Mode => step === 'setup' ? 'on' : step === 'flask' ? (k <= 2 ? 'active' : 'off') : k === n ? 'active' : k < n ? 'on' : 'off'
  const focus: RigFocus = step === 'flask' ? 'flask' : step === 'condenser' ? 'condense' : step === 'collect' ? 'collect' : 'plain'
  const [ex, ey] = rigAt(RIG.end)
  return <Diagram viewBox="0 0 540 340" title={DIST_TITLES[step]}>
    <Rig focus={focus} coldLabels={step === 'condenser' || step === 'setup'} collected={step !== 'flask'} />
    {step === 'flask' && <g>
      <Tag x={10} y={132} lines={['impure', 'water']} from={[30, 154]} to={[76, 216]} colour={W.saltLine} size={13} />
      <Tag x={168} y={250} lines={['solids stay behind']} to={[126, 224]} colour={W.saltLine} size={13} />
      <Tag x={168} y={300} lines={['heat until it boils']} to={[110, 262]} colour={W.heatLine} size={13} />
    </g>}
    {step === 'condenser' && <Tag x={200} y={214} lines={['steam cools and', 'condenses']} to={[250, 150]} colour={W.cold} size={13} />}
    {step === 'collect' && <Tag x={ex - 118} y={ey + 64} lines={['pure water', 'collected']} anchor="end" to={[ex - 30, ey + 90]} colour={W.deep} size={13} />}
    {step === 'setup' && <g>
      <Num n={1} x={40} y={272} /><Num n={2} x={126} y={146} /><Num n={3} x={250} y={198} /><Num n={4} x={ex - 58} y={ey + 50} />
      <text x={352} y={150} fontSize="13" fontWeight="700" fill={W.saltLine}>solids stay in the flask</text>
    </g>}
    {DIST_ROWS.map((lines, i) => <KeyRow key={i} n={i + 1} x={330} y={26 + i * 30} lines={lines} mode={mode(i + 1)} colour={[W.heatLine, W.vapourText, W.cold, W.deep][i]} />)}
  </Diagram>
}

// ---------- Question visuals ----------
function BasinQuestion() {
  return <Diagram viewBox="0 0 540 250" title="An evaporating basin weighed before and after evaporating a water sample: before 44.10 g, after 44.58 g.">
    <text x={140} y={34} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>before</text>
    <Balance cx={140} y={150} reading="44.10 g" />
    <Basin cx={140} y={150} w={110} />
    <Arrow x1={240} y1={170} x2={300} y2={170} colour={muted} width={2.6} />
    <text x={270} y={156} textAnchor="middle" fontSize="12" fill={muted}>evaporate</text>
    <text x={400} y={34} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>after</text>
    <Balance cx={400} y={150} reading="44.58 g" />
    <Basin cx={400} y={150} w={110} ring />
  </Diagram>
}
function ApparatusQuestion({ assessment }: { assessment: boolean }) {
  const [ex, ey] = rigAt(RIG.end)
  return <Diagram viewBox="0 0 540 340" title={assessment ? 'Distillation apparatus with four parts numbered 1 to 4.' : 'Distillation apparatus. Part 1 is the flask of impure water, part 2 is the condenser, part 3 is the beaker where the pure water is collected and part 4 is the Bunsen burner.'}>
    <Rig focus="plain" reading="" />
    <Pointer n={1} x={26} y={150} to={[76, 214]} />
    <Pointer n={2} x={rigAt(160)[0]} y={rigAt(160)[1] - 58} to={rigAt(160, -8)} />
    <Pointer n={3} x={512} y={262} to={[ex + 30, ey + 90]} />
    <Pointer n={4} x={30} y={306} to={[94, 300]} />
    {!assessment && <g>
      <KeyRow n={1} x={330} y={26} lines={['flask of impure water']} mode="on" />
      <KeyRow n={2} x={330} y={56} lines={['condenser']} mode="on" />
      <KeyRow n={3} x={330} y={86} lines={['beaker: pure water']} mode="active" colour={W.deep} />
      <KeyRow n={4} x={330} y={116} lines={['Bunsen burner']} mode="on" />
    </g>}
  </Diagram>
}

export function WaterTestVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'wtest-intro': return <Intro />
    case 'wtest-three': return <Three />
    case 'wtest-match': return <Match />
    case 'wtest-basin': case 'wtest-sample': case 'wtest-heat': case 'wtest-weigh': case 'wtest-change': case 'wtest-look':
      return <BasinScene step={focus.replace('wtest-', '') as BasinStep} />
    case 'wtest-ph': return <Ph />
    case 'wtest-bp': return <BoilingPoint />
    case 'wtest-results': return <Results />
    case 'wtest-why': return <Why />
    case 'wtest-flask': return <Distillation step="flask" />
    case 'wtest-condenser': return <Distillation step="condenser" />
    case 'wtest-collect': return <Distillation step="collect" />
    case 'wtest-setup': return <Distillation step="setup" />
    case 'wtest-q-basin': return <BasinQuestion />
    case 'wtest-q-apparatus': return <ApparatusQuestion assessment={assessment} />
    default: return <Distillation step="setup" />
  }
}
