import type { ReactNode } from 'react'
import { physicsPalette, PhysicsDiagram, Lines, Leader, GraphAxes, graphScale, type GraphFrame } from './PhysicsKit'
import { Chip, Arrow } from './GasParticleVisuals'
import { WorkCard, massColour, type CardLine } from './DensityVisuals'
import { Tick } from './EnergyStoreVisuals'
import { UnitBox } from './KineticVisuals'
import { ForceArrow, Ground, forceTone } from './ContactForceVisuals'

/*
 * Physics Lesson 39: Weight, mass and gravity. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'weight-' and is routed from CellBiologyVisuals.tsx.
 *
 * Weight is always the soft red force arrow from the contact lesson, pointing down from the centre of mass (a
 * small ink dot). Mass is brown (as in the density lesson), gravitational field strength g is indigo (the
 * gravitational potential colour). Worked examples use the density lesson's calculation card.
 */
const P = physicsPalette
const { ink, muted } = P
const wColour = forceTone.weight.line, gColour = P.gravitationalLine

/** A bag of sugar; (x, y) = middle of its base. Returns the centre of mass at (x, y - h/2). */
function Bag({ x, y, label = '1 kg', s = 1 }: { x: number; y: number; label?: string; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-34 0V-78L-28 -92H28L34 -78V0Q34 4 30 4H-30Q-34 4 -34 0Z" fill="#f7f1e3" stroke="#a89468" strokeWidth="2.2" />
    <path d="M-34 -78H34" stroke="#a89468" strokeWidth="1.6" />
    <path d="M-28 -92L-24 -100H24L28 -92" fill="#efe6cf" stroke="#a89468" strokeWidth="2" />
    <rect x={-28} y={-76} width={56} height={30} rx="6" fill="#bfe0f1" stroke="#3f93bd" strokeWidth="1.6" />
    <text x={0} y={-63} textAnchor="middle" fontSize="12" fontWeight="800" fill="#2f6f95">SUGAR</text>
    <text x={0} y={-50} textAnchor="middle" fontSize="12" fontWeight="800" fill={massColour}>{label}</text>
  </g>
}
function CoM({ x, y }: { x: number; y: number }) {
  return <g><circle cx={x} cy={y} r="6" fill="white" stroke={ink} strokeWidth="2" /><circle cx={x} cy={y} r="2.6" fill={ink} /></g>
}
/** A block with a mass written on it; (x, y) = middle of its base. */
function Block({ x, y, label, w = 70, h = 70 }: { x: number; y: number; label: string; w?: number; h?: number }) {
  return <g>
    <rect x={x - w / 2} y={y - h} width={w} height={h} rx="8" fill="#e3e8ee" stroke="#5b6f82" strokeWidth="2.2" />
    <path d={`M${x - w / 2 + 6} ${y - h + 6}H${x + w / 2 - 6}`} stroke="white" strokeWidth="3" opacity=".7" />
    <text x={x} y={y - h + 22} textAnchor="middle" fontSize="15" fontWeight="800" fill={massColour}>{label}</text>
  </g>
}

/* ---------- Section 2: mass, weight and g ---------- */

function MassWeight({ step }: { step: 'mass' | 'force' }) {
  const bx = 190, by = 226, cy = by - 32
  return <PhysicsDiagram title={step === 'mass' ? 'A 1 kg bag of sugar. Its mass, the amount of matter in it, is 1 kg. All its mass can be thought of as acting at one point, the centre of mass.' : 'The same bag of sugar with its weight: a force due to gravity, drawn as an arrow pointing down from the centre of mass. Weight is measured in newtons, N.'}>
    <Ground y={by} x1={60} x2={320} />
    <Bag x={bx} y={by} />
    {step === 'force' && <ForceArrow from={[bx, cy]} to={[bx, cy + 96]} tone="weight" width={12} />}
    <CoM x={bx} y={cy} />
    <Leader from={[92, 110]} to={[bx - 7, cy - 2]} />
    <Lines x={96} y={96} anchor="middle" lines={['centre of mass']} size={13} weight={650} colour={muted} />
    {step === 'mass'
      ? <g>
        <Lines x={330} y={120} lines={['mass: 1 kg']} size={20} colour={massColour} />
        <Lines x={330} y={150} lines={['the amount of matter', 'measured in kilograms, kg']} size={14} />
      </g>
      : <g>
        <Lines x={330} y={120} lines={['weight']} size={20} colour={wColour} />
        <Lines x={330} y={150} lines={['force due to gravity', 'measured in newtons, N']} size={14} />
      </g>}
  </PhysicsDiagram>
}

function Field() {
  const bx = 150, by = 150
  return <PhysicsDiagram title="Near the Earth, gravity pulls every kilogram of mass with a force of 9.8 N. The gravitational field strength g is 9.8 N/kg.">
    <path d="M-20 300Q270 180 560 300Z" fill="#bfe0f1" stroke="#3f93bd" strokeWidth="2.4" />
    <path d="M60 300Q120 262 200 262Q240 272 230 300Z M340 250Q400 236 460 256Q470 290 420 300H360Q330 280 340 250Z" fill="#cfe6c2" stroke="#4f8f5a" strokeWidth="1.6" />
    {[300, 380, 460].map(x => <Arrow key={x} from={[x, 60]} to={[x, 110 + Math.abs(x - 380) * 0.1]} colour="#9fb0c8" width={2} />)}
    <text x={380} y={50} textAnchor="middle" fontSize="12" fontWeight="650" fill={muted}>gravitational field</text>
    <Bag x={bx} y={by} s={0.8} />
    <ForceArrow from={[bx, by - 26]} to={[bx, by + 40]} tone="weight" width={11} label="9.8 N" labelAt={[bx + 16, by + 12]} labelAnchor="start" />
    <CoM x={bx} y={by - 26} />
    <text x={270} y={268} textAnchor="middle" fontSize="16" fontWeight="750" fill="#2f6f95">Earth</text>
    <rect x={250} y={132} width={276} height={64} rx="16" fill="white" stroke={gColour} strokeWidth="2" />
    <text x={388} y={158} textAnchor="middle" fontSize="18" fontWeight="800" fill={gColour}>g = 9.8 N/kg</text>
    <text x={388} y={182} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>each kilogram is pulled with 9.8 N</text>
  </PhysicsDiagram>
}

function Moon() {
  const panel = (x: number, name: string, g: string, weight: string, len: number, earth: boolean) => <g>
    <rect x={x} y={14} width={246} height={272} rx="18" fill={earth ? '#f2f8fb' : '#f4f4f1'} stroke={P.panelLine} strokeWidth="1.5" />
    <text x={x + 123} y={42} textAnchor="middle" fontSize="17" fontWeight="800" fill={ink}>{name}</text>
    <text x={x + 123} y={64} textAnchor="middle" fontSize="14" fontWeight="750" fill={gColour}>{g}</text>
    <path d={`M${x + 10} 200Q${x + 123} 190 ${x + 236} 200V240Q${x + 236} 250 ${x + 226} 250H${x + 20}Q${x + 10} 250 ${x + 10} 240Z`} fill={earth ? '#cfe6c2' : '#dcdcd4'} stroke={earth ? '#4f8f5a' : '#8a8a7e'} strokeWidth="2" />
    {!earth && <g fill="#c6c6bc">{[[x + 50, 222, 9], [x + 180, 230, 6], [x + 120, 238, 4]].map(([cx, cy, r]) => <ellipse key={cx} cx={cx} cy={cy} rx={r * 1.6} ry={r * 0.6} />)}</g>}
    <Block x={x + 80} y={196} label="10 kg" />
    <ForceArrow from={[x + 80, 164]} to={[x + 80, 164 + len]} tone="weight" width={12} />
    <CoM x={x + 80} y={164} />
    <text x={x + 130} y={126} fontSize="14" fontWeight="700" fill={massColour}>mass 10 kg</text>
    <text x={x + 130} y={150} fontSize="15" fontWeight="800" fill={wColour}>weight {weight}</text>
  </g>
  return <PhysicsDiagram schematic={false} viewBox="0 0 540 300" title="The same 10 kg block on the Earth and on the Moon. On the Earth, g = 9.8 N/kg and its weight is 98 N. On the Moon, g = 1.6 N/kg and its weight is only 16 N. The mass is 10 kg in both places.">
    {panel(14, 'on the Earth', 'g = 9.8 N/kg', '98 N', 118, true)}
    {panel(280, 'on the Moon', 'g = 1.6 N/kg', '16 N', 20, false)}
  </PhysicsDiagram>
}

/** A newtonmeter hanging from a stand, with a mass hanging from it. (x, top) = the top hook. */
function Newtonmeter({ x, top, max, reading, massLabel, readingLabel, h = 150 }: { x: number; top: number; max: number; reading: number; massLabel: string; readingLabel?: string; h?: number }) {
  const y0 = top + 26, y1 = y0 + h, scaleTop = y0 + 16, scaleBot = y1 - 16
  const at = (v: number) => scaleTop + (scaleBot - scaleTop) * v / max
  const py = at(reading), ticks = Array.from({ length: max / 5 + 1 }, (_, i) => i * 5)
  return <g>
    <path d={`M${x} ${top}V${top + 14}`} stroke="#5a6b79" strokeWidth="3" />
    <path d={`M${x - 8} ${top + 6}Q${x - 8} ${top - 6} ${x} ${top - 6}Q${x + 8} ${top - 6} ${x + 8} ${top + 2}`} stroke="#5a6b79" strokeWidth="3" fill="none" />
    <rect x={x - 22} y={y0 - 12} width={44} height={h + 12} rx="14" fill="#fdf6e4" stroke="#b08a3c" strokeWidth="2.4" />
    {ticks.map(v => <g key={v}>
      <path d={`M${x - 20} ${at(v)}h${v % 10 ? 7 : 11}`} stroke={ink} strokeWidth="1.4" />
      {v % 10 === 0 && <text x={x - 28} y={at(v) + 4} textAnchor="end" fontSize="12" fontWeight="650" fill={muted}>{v}</text>}
    </g>)}
    <path d={`M${x + 4} ${y0}L${x + 4} ${py - 6}`} stroke="#ad4880" strokeWidth="2.2" strokeDasharray="3 3" />
    <path d={`M${x - 20} ${py}H${x + 16}`} stroke={wColour} strokeWidth="3.2" />
    <path d={`M${x + 16} ${py - 6}L${x + 22} ${py}L${x + 16} ${py + 6}Z`} fill={wColour} />
    <path d={`M${x} ${y1}V${y1 + 22}`} stroke="#5a6b79" strokeWidth="3" />
    <path d={`M${x} ${y1 + 22}q-8 0 -8 8t8 8`} stroke="#5a6b79" strokeWidth="2.6" fill="none" />
    <rect x={x - 24} y={y1 + 40} width={48} height={40} rx="8" fill="#c9d0d8" stroke="#4f5b68" strokeWidth="2.2" />
    <text x={x} y={y1 + 66} textAnchor="middle" fontSize="14" fontWeight="800" fill={massColour}>{massLabel}</text>
    {readingLabel && <g>
      <rect x={x + 30} y={py - 15} width={72} height={30} rx="15" fill="white" stroke={wColour} strokeWidth="2" />
      <text x={x + 66} y={py + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill={wColour}>{readingLabel}</text>
    </g>}
    <text x={x - 28} y={y0 + 1} textAnchor="end" fontSize="12" fontWeight="700" fill={muted}>N</text>
  </g>
}
function Meter() {
  return <PhysicsDiagram title="A newtonmeter, a calibrated spring balance, with a 1 kg mass hanging from it. The pointer shows the weight on a scale in newtons: 9.8 N.">
    <path d="M150 20H320" stroke="#7d8e9c" strokeWidth="6" />
    <Newtonmeter x={220} top={24} max={20} reading={9.8} massLabel="1 kg" readingLabel="9.8 N" />
    <Lines x={350} y={90} lines={['newtonmeter']} size={20} />
    <Lines x={350} y={118} lines={['a calibrated spring', 'balance']} size={14} weight={650} colour={muted} />
    <Lines x={350} y={184} lines={['heavier object:', 'spring stretches more,', 'bigger reading']} size={14} />
  </PhysicsDiagram>
}

/* ---------- Section 3: W = mg worked example ---------- */

const Wt = ({ children }: { children: ReactNode }) => <tspan fill={wColour}>{children}</tspan>
const M = ({ children }: { children: ReactNode }) => <tspan fill={massColour}>{children}</tspan>
const G = ({ children }: { children: ReactNode }) => <tspan fill={gColour}>{children}</tspan>
function Equation() {
  return <PhysicsDiagram schematic={false} title="The equation for weight: weight = mass × gravitational field strength, or W = m g. W is weight in newtons, N; m is mass in kilograms, kg; g is gravitational field strength in newtons per kilogram, N/kg.">
    <rect x={20} y={16} width={500} height={50} rx="16" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <text x={270} y={48} textAnchor="middle" fontSize="17" fontWeight="750" fill={ink}><Wt>weight</Wt> = <M>mass</M> × <G>gravitational field strength</G></text>
    <text x={270} y={112} textAnchor="middle" fontSize="30" fontWeight="800" fill={ink}><Wt>W</Wt> = <M>m</M> <G>g</G></text>
    <UnitBox x={110} y={220} to={[244, 104]} name="weight" unit="newtons" symbol="N" colour={wColour} w={150} />
    <UnitBox x={270} y={220} to={[284, 106]} name="mass" unit="kilograms" symbol="kg" colour={massColour} w={150} />
    <UnitBox x={430} y={220} to={[306, 104]} name="field strength" unit="newtons per kg" symbol="N/kg" colour={gColour} w={150} />
  </PhysicsDiagram>
}
const W_LINES: CardLine[] = [
  { text: <><Wt>W</Wt> = <M>m</M> × <G>g</G></>, note: 'the equation' },
  { text: <><Wt>W</Wt> = <M>20</M> × <G>9.8</G></>, note: 'put the numbers in' },
  { text: <><Wt>W</Wt> = 196</>, note: 'work it out' },
  { text: <><Wt>W</Wt> = 196 N</>, note: 'add the unit: weight is a force' },
]
function Worked({ step }: { step: 1 | 2 | 3 }) {
  const titles = { 1: 'A 20 kg object on Earth, where g is 9.8 N/kg. Put the numbers in: W = 20 × 9.8.', 2: 'Work it out: 20 × 9.8 = 196.', 3: 'Weight is a force, so the unit is newtons. The weight is 196 N.' }
  return <PhysicsDiagram schematic={false} title={titles[step]}>
    <Ground y={214} x1={20} x2={170} />
    <Block x={92} y={212} label="20 kg" w={84} h={70} />
    <ForceArrow from={[92, 177]} to={[92, 262]} tone="weight" width={11} label={step === 3 ? '196 N' : 'W = ?'} labelAt={[108, 254]} labelAnchor="start" />
    <circle cx={92} cy={177} r="4" fill={ink} />
    <Lines x={92} y={60} anchor="middle" lines={['m = 20 kg']} size={14} colour={massColour} />
    <Lines x={92} y={82} anchor="middle" lines={['g = 9.8 N/kg']} size={14} colour={gColour} />
    <WorkCard x={196} y={34} w={330} lines={W_LINES} step={step} done={step === 3} />
    {step === 3 && <Tick x={498} y={196} />}
  </PhysicsDiagram>
}

/* ---------- Section 4: rearranging, proportion, graph ---------- */

function Rearrange() {
  return <PhysicsDiagram schematic={false} title="Rearranging W = m g to find mass: divide both sides by g, giving m = W ÷ g.">
    <rect x={30} y={90} width={180} height={80} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.8" />
    <text x={120} y={142} textAnchor="middle" fontSize="28" fontWeight="800" fill={ink}><Wt>W</Wt> = <M>m</M> × <G>g</G></text>
    <Arrow from={[222, 130]} to={[308, 130]} colour={ink} width={3} />
    <text x={265} y={116} textAnchor="middle" fontSize="15" fontWeight="800" fill={gColour}>÷ g</text>
    <rect x={320} y={90} width={196} height={80} rx="18" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <text x={418} y={142} textAnchor="middle" fontSize="28" fontWeight="800" fill={ink}><M>m</M> = <Wt>W</Wt> ÷ <G>g</G></text>
    <Chip x={270} y={236} text="divide both sides by g" size={15} line={gColour} colour={gColour} fill={P.gravitational} />
  </PhysicsDiagram>
}
const MASS_LINES: CardLine[] = [
  { text: <><M>m</M> = <Wt>W</Wt> ÷ <G>g</G></>, note: 'the rearranged equation' },
  { text: <><M>m</M> = <Wt>490</Wt> ÷ <G>9.8</G></>, note: 'put the numbers in' },
  { text: <><M>m</M> = 50 kg</>, note: 'work it out, unit kg' },
]
function MassCalc() {
  return <PhysicsDiagram schematic={false} title="A box weighs 490 N on the Earth. m = W ÷ g = 490 ÷ 9.8 = 50 kg.">
    <Ground y={214} x1={20} x2={170} />
    <Block x={92} y={212} label="m = ?" w={84} h={70} />
    <ForceArrow from={[92, 177]} to={[92, 262]} tone="weight" width={11} label="490 N" labelAt={[108, 254]} labelAnchor="start" />
    <circle cx={92} cy={177} r="4" fill={ink} />
    <Lines x={92} y={82} anchor="middle" lines={['g = 9.8 N/kg']} size={14} colour={gColour} />
    <WorkCard x={196} y={50} w={330} lines={MASS_LINES} step={2} done />
    <Tick x={498} y={166} />
  </PhysicsDiagram>
}
function Prop() {
  return <PhysicsDiagram title="Two newtonmeters on Earth: 1 kg reads 9.8 N and 2 kg reads 19.6 N. Double the mass gives double the weight: weight is directly proportional to mass, W ∝ m.">
    <path d="M60 20H300" stroke="#7d8e9c" strokeWidth="6" />
    <Newtonmeter x={96} top={24} max={20} reading={9.8} massLabel="1 kg" readingLabel="9.8 N" h={140} />
    <Newtonmeter x={262} top={24} max={20} reading={19.6} massLabel="2 kg" readingLabel="19.6 N" h={140} />
    <Lines x={452} y={100} anchor="middle" lines={['double the mass,', 'double the weight']} size={16} />
    <rect x={394} y={150} width={116} height={50} rx="16" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <text x={452} y={184} textAnchor="middle" fontSize="24" fontWeight="800" fill={ink}><Wt>W</Wt> ∝ <M>m</M></text>
    <Lines x={452} y={226} anchor="middle" lines={['∝ means "is directly', 'proportional to"']} size={12} weight={650} colour={muted} />
  </PhysicsDiagram>
}
const GF: GraphFrame = { x: 96, y: 40, width: 360, height: 196, xMax: 4.5, yMax: 45 }
function WeightGraph() {
  const s = graphScale(GF)
  return <PhysicsDiagram schematic={false} title="A graph of weight against mass for objects on Earth. The points (1 kg, 9.8 N), (2 kg, 19.6 N) and (4 kg, 39.2 N) lie on a straight line through the origin.">
    <GraphAxes frame={GF} xLabel="Mass" xUnit="kg" yLabel="Weight" yUnit="N" xTicks={[1, 2, 3, 4]} yTicks={[10, 20, 30, 40]} grid />
    <path d={s.path([[0, 0], [4.3, 4.3 * 9.8]])} stroke={wColour} strokeWidth="3" fill="none" />
    {[[1, 9.8], [2, 19.6], [4, 39.2]].map(([m, w]) => <g key={m}>
      <path d={`M${s.x(m) - 6} ${s.y(w) - 6}l12 12M${s.x(m) + 6} ${s.y(w) - 6}l-12 12`} stroke={ink} strokeWidth="2.6" />
    </g>)}
    <Lines x={s.x(2) + 16} y={s.y(19.6) + 22} lines={['(2 kg, 19.6 N)']} size={13} weight={650} colour={muted} />
    <Chip x={s.x(3)} y={s.y(4)} text="straight line through the origin" size={14} />
  </PhysicsDiagram>
}

export function WeightVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'weight-mass': return <MassWeight step="mass" />
    case 'weight-force': return <MassWeight step="force" />
    case 'weight-field': return <Field />
    case 'weight-moon': return <Moon />
    case 'weight-meter': return <Meter />
    case 'weight-eq': return <Equation />
    case 'weight-w2': return <Worked step={1} />
    case 'weight-w3': return <Worked step={2} />
    case 'weight-w4': return <Worked step={3} />
    case 'weight-rearrange': return <Rearrange />
    case 'weight-mass-calc': return <MassCalc />
    case 'weight-prop': return <Prop />
    case 'weight-graph': return <WeightGraph />
    default: return null
  }
}
