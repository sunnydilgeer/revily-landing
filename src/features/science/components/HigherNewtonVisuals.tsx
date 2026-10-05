import { physicsPalette as P, PhysicsDiagram } from './PhysicsKit'
import { ink, muted, Arrow, Floor, Car, Tag, StepStrip, Eq, type Piece } from './EnergyStoreVisuals'
import { mo, Force } from './VtGraphVisuals'
import { Trolley, Accel } from './NewtonLawVisuals'

/*
 * Higher sections for Physics Lesson 47 (inertia and inertial mass) and Lesson 51 (estimating a braking force).
 * Original, code-native schematics; not to scale. Every focus id starts with 'hnewt-' and is routed from CellBiologyVisuals.tsx.
 *
 * Same parts and colours as the Foundation drawings: the lab trolleys of Lesson 47 (resultant force violet,
 * acceleration amber, mass blue, velocity green) and the road scene of Lesson 51 (braking force vermilion,
 * brake lights on, distance bracket under the road). Numbers: inertia scene 12 N → A 6 m/s² (2 kg), B 2 m/s² (6 kg);
 * worked 15 N, 3 m/s² → 5 kg; question 18 N, X 3 m/s², Y 9 m/s². Braking: 20 m/s, 40 m, ~1000 kg → 5 m/s², ~5000 N;
 * worked 10 m/s, 10 m, ~1200 kg → 5 m/s², ~6000 N.
 */

const brakeForce = P.current, road = '#e7ebee', roadLine = '#b7c2ca', brakeRed = '#e0513f'
const keep = mo.velocity

/* ---------- Section in Lesson 47: inertia and inertial mass (one drawing, five steps) ---------- */

type Step = 1 | 2 | 3 | 4 | 5

function Lane({ y, name, load, step }: { y: number; name: string; load: number; step: Step }) {
  const a = load ? 2 : 6, len = load ? 40 : 120
  return <g>
    <Floor x1={14} x2={336} y={y} />
    <text x={20} y={y - 72} fontSize="15" fontWeight="800" fill={ink}>{name}</text>
    <Trolley x={125} y={y} s={0.85} load={load} />
    {step <= 2 ? <g>
      <path d={`M172 ${y - 24}H296`} stroke={keep} strokeWidth="4" strokeDasharray="2 7" />
      <Arrow from={[292, y - 24]} to={[318, y - 24]} colour={keep} width={4} />
      <text x={245} y={y - 38} textAnchor="middle" fontSize="13" fontWeight="700" fill={keep}>same velocity</text>
    </g> : <g>
      <Force from={[16, y - 24]} to={[82, y - 24]} colour={mo.resultant} label={step === 3 ? 'same force' : '12 N'} at="above" />
      <Accel x={172} y={y - 24} len={len} />
      <text x={load ? 172 + len + 10 : 172 + len / 2} y={load ? y - 19 : y - 36} textAnchor={load ? 'start' : 'middle'} fontSize="13" fontWeight="700" fill={mo.accel}>{step === 3 ? (load ? 'small change' : 'big change') : `${a} m/s²`}</text>
    </g>}
  </g>
}

function Inertia({ step }: { step: Step }) {
  const titles = [
    'Step 1 of 5: an empty trolley A and a loaded trolley B roll along at the same velocity. No resultant force acts, so their motion stays the same.',
    'Step 2 of 5: the tendency to keep the same motion is called inertia.',
    'Step 3 of 5: the same force pushes both trolleys. A changes its velocity a lot; loaded B changes it only a little. B is harder to change: it has more inertial mass.',
    'Step 4 of 5: the force is 12 N. A accelerates at 6 metres per second squared and B at 2. Mass equals force divided by acceleration: A is 2 kg and B is 6 kg.',
    'Put together: inertia is the tendency to keep the same motion; inertial mass measures how hard it is to change velocity; m equals F divided by a.',
  ]
  const show = (n: number) => step >= n
  const op = (n: number) => step === 5 || step === n ? 1 : 0.45
  const cx = 439
  return <PhysicsDiagram title={titles[step - 1]}>
    <Lane y={135} name="A  empty" load={0} step={step} />
    <Lane y={265} name="B  loaded" load={4} step={step} />
    {step >= 3 && <Tag x={262} y={196} text={step >= 4 ? 'more inertial mass' : 'harder to change'} colour={mo.mass} fill={mo.massFill} />}
    <rect x={350} y={34} width={178} height={254} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <g opacity={op(1)}>
      <text x={cx} y={62} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>no resultant force:</text>
      <text x={cx} y={81} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>motion stays the same</text>
    </g>
    {show(2) && <g opacity={op(2)}>
      <text x={cx} y={118} textAnchor="middle" fontSize="21" fontWeight="800" fill={keep}>inertia</text>
    </g>}
    {show(3) && <g opacity={op(3)}>
      <text x={cx} y={152} textAnchor="middle" fontSize="14" fontWeight="800" fill={mo.mass}>inertial mass:</text>
      <text x={cx} y={171} textAnchor="middle" fontSize="13" fontWeight="600" fill={ink}>how hard it is to</text>
      <text x={cx} y={188} textAnchor="middle" fontSize="13" fontWeight="600" fill={ink}>change the velocity</text>
    </g>}
    {show(4) && <g opacity={op(4)}>
      <Eq x={cx} y={226} size={21} pieces={[['m', mo.mass], [' = '], ['F', mo.resultant], [' ÷ '], ['a', mo.accel]]} />
      <Eq x={cx} y={254} size={14} pieces={[['A: 12 ÷ 6 = '], ['2 kg', mo.mass]]} />
      <Eq x={cx} y={275} size={14} pieces={[['B: 12 ÷ 2 = '], ['6 kg', mo.mass]]} />
    </g>}
  </PhysicsDiagram>
}

function InertiaWorked() {
  return <PhysicsDiagram title="Worked example: a resultant force of 15 N gives a trolley an acceleration of 3 metres per second squared. m equals F divided by a, which is 15 divided by 3, so the inertial mass is 5 kg.">
    <Floor x1={14} x2={300} y={190} />
    <Trolley x={130} y={190} s={0.95} />
    <Force from={[14, 163]} to={[82, 163]} colour={mo.resultant} label="15 N" at="above" />
    <Accel x={182} y={163} len={90} label="3 m/s²" />
    <text x={130} y={232} textAnchor="middle" fontSize="14" fontWeight="700" fill={mo.mass}>mass = ?</text>
    <rect x={318} y={60} width={208} height={182} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <Eq x={422} y={100} size={20} pieces={[['m', mo.mass], [' = '], ['F', mo.resultant], [' ÷ '], ['a', mo.accel]]} />
    <Eq x={422} y={142} size={20} pieces={[['m', mo.mass], [' = '], ['15', mo.resultant], [' ÷ '], ['3', mo.accel]]} />
    <rect x={358} y={164} width={128} height={44} rx="12" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <Eq x={422} y={193} size={20} pieces={[['m', mo.mass], [' = 5 kg']]} />
  </PhysicsDiagram>
}

function InertiaQuestion() {
  return <PhysicsDiagram schematic={false} title="Two trolleys, X and Y, each pushed by a resultant force of 18 N. X accelerates at 3 metres per second squared and Y at 9 metres per second squared.">
    {[{ y: 130, n: 'X', len: 50, l: '3 m/s²' }, { y: 270, n: 'Y', len: 150, l: '9 m/s²' }].map(r => <g key={r.n}>
      <Floor x1={20} x2={520} y={r.y} />
      <Trolley x={200} y={r.y} />
      <text x={200} y={r.y - 52} textAnchor="middle" fontSize="18" fontWeight="800" fill={ink}>{r.n}</text>
      <Force from={[80, r.y - 28]} to={[154, r.y - 28]} colour={mo.resultant} label="18 N" at="above" />
      <Accel x={258} y={r.y - 28} len={r.len} />
      <text x={258 + r.len + 10} y={r.y - 23} fontSize="15" fontWeight="800" fill={mo.accel}>{r.l}</text>
    </g>)}
  </PhysicsDiagram>
}

/* ---------- Section in Lesson 51: estimating a braking force (one road scene, five steps) ---------- */

function Road({ y, x1 = 14, x2 = 526 }: { y: number; x1?: number; x2?: number }) {
  return <g>
    <path d={`M${x1} ${y}H${x2}V${y + 22}Q${(x1 + x2) / 2} ${y + 25} ${x1} ${y + 22}Z`} fill={road} />
    <path d={`M${x1} ${y}H${x2}`} stroke={roadLine} strokeWidth="2" />
    <path d={`M${x1 + 10} ${y + 12}H${x2 - 10}`} stroke="white" strokeWidth="3" strokeDasharray="18 16" />
  </g>
}
function BrakingCar({ x, y, s = 1, ghost = false }: { x: number; y: number; s?: number; ghost?: boolean }) {
  return <g opacity={ghost ? 0.32 : 1}>
    <Car x={x} y={y} s={s} />
    {!ghost && <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="-46" cy="-24" r="9" fill={brakeRed} opacity=".25" />
      <rect x="-50" y="-28" width="6" height="8" rx="2.5" fill={brakeRed} stroke="#a8392b" strokeWidth="1.2" />
    </g>}
  </g>
}
function Bracket({ x1, x2, y, label, colour = ink }: { x1: number; x2: number; y: number; label: string; colour?: string }) {
  return <g>
    <path d={`M${x1} ${y - 8}V${y + 8}M${x2} ${y - 8}V${y + 8}`} stroke={colour} strokeWidth="2.2" />
    <Arrow from={[x1 + 1, y]} to={[x2 - 1, y]} colour={colour} width={2.2} head={0.75} />
    <Arrow from={[x2 - 1, y]} to={[x1 + 1, y]} colour={colour} width={2.2} head={0.75} />
    <text x={(x1 + x2) / 2} y={y + 24} textAnchor="middle" fontSize="14" fontWeight="700" fill={colour}>{label}</text>
  </g>
}

type BrakeNumbers = { u: number; s: number; m: number; a: number; F: number }
const scene: BrakeNumbers = { u: 20, s: 40, m: 1000, a: 5, F: 5000 }
const workedScene: BrakeNumbers = { u: 10, s: 10, m: 1200, a: 5, F: 6000 }

function Braking({ step, n = scene, worked = false }: { step: Step; n?: BrakeNumbers; worked?: boolean }) {
  const y = 140, x1 = 90, x2 = 440
  const op = (k: number) => step === 5 || step === k ? 1 : 0.45
  const titles = [
    `Step 1 of 4: typical values. A car of mass about ${n.m} kg is travelling at about ${n.u} m/s. It brakes and stops in ${n.s} m.`,
    'Step 2 of 4: rearrange v squared minus u squared equals 2 a s. a equals v squared minus u squared, divided by 2 s.',
    `Step 3 of 4: a equals 0 minus ${n.u * n.u}, divided by ${2 * n.s}, which is minus ${n.a} metres per second squared: a deceleration of ${n.a}.`,
    `Step 4 of 4: F equals m times a, which is ${n.m} times ${n.a}, so the braking force is about ${n.F} N.`,
    `Put together: a car at about ${n.u} m/s stops in ${n.s} m. Its deceleration is ${n.a} metres per second squared and the braking force is about ${n.F} N. Very large decelerations can overheat the brakes or make the car skid.`,
  ]
  const title = worked ? `Worked example: a car of mass about ${n.m} kg at ${n.u} m/s stops in ${n.s} m. a equals 0 minus ${n.u * n.u}, divided by ${2 * n.s}, which is minus ${n.a}. F equals ${n.m} times ${n.a}, about ${n.F} N.` : titles[step - 1]
  return <PhysicsDiagram title={title} viewBox="0 0 540 350">
    <StepStrip steps={['values', 'rearrange', 'find a', 'find F']} active={step} colour={brakeForce} gap={124} x0={270} />
    <Road y={y} />
    <g stroke="#6d7780" strokeWidth="4" opacity=".5" fill="none">
      <path d={`M${x1 + 40} ${y + 4}Q${(x1 + x2) / 2} ${y + 2} ${x2 - 30} ${y + 4}`} />
      <path d={`M${x1 + 46} ${y + 10}Q${(x1 + x2) / 2} ${y + 8} ${x2 - 30} ${y + 10}`} />
    </g>
    <path d={`M${x1} ${y - 62}V${y + 38}M${x2} ${y - 62}V${y + 38}`} stroke={muted} strokeWidth="1.6" strokeDasharray="4 5" />
    <BrakingCar x={x1} y={y} s={0.9} ghost />
    <BrakingCar x={x2} y={y} s={0.9} />
    <Tag x={x1} y={64} text={`u ≈ ${n.u} m/s`} colour={mo.velocity} />
    <Tag x={x2} y={64} text="v = 0 m/s" colour={mo.velocity} />
    <Tag x={265} y={64} text={`m ≈ ${n.m} kg`} colour={mo.mass} fill={mo.massFill} />
    <Bracket x1={x1} x2={x2} y={y + 42} label={`s = ${n.s} m`} colour={muted} />
    {step >= 4 && <Force from={[x2 - 44, 112]} to={[x2 - 124, 112]} colour={brakeForce} lines={['braking force', `≈ ${n.F} N`]} at="end" />}
    <rect x={20} y={222} width={500} height={98} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    {step === 1 && <text x={270} y={276} textAnchor="middle" fontSize="15" fontWeight="650" fill={muted}>Plan: find the deceleration, then use F = ma</text>}
    {step >= 2 && <g opacity={op(2)}><Eq x={270} y={250} size={17} pieces={[['a', mo.accel], [' = (v² − u²) ÷ 2s']]} /></g>}
    {step >= 3 && <g opacity={op(3)}><Eq x={270} y={279} size={17} pieces={[['a', mo.accel], [` = (0² − ${n.u}²) ÷ (2 × ${n.s}) = `], [`−${n.a} m/s²`, mo.accel]] as Piece[]} /></g>}
    {step >= 4 && <g opacity={op(4)}><Eq x={270} y={308} size={17} pieces={[['F', brakeForce], [' = '], ['m', mo.mass], [' × '], ['a', mo.accel], [` = ${n.m} × ${n.a} = `], [`${n.F} N`, brakeForce]]} /></g>}
    {step === 5 && !worked && <text x={270} y={342} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.thermalLine}>Very big decelerations: brakes can overheat, or the car can skid.</text>}
  </PhysicsDiagram>
}

export function HigherNewtonVisual({ focus }: { focus: string; assessment?: boolean }) {
  const inertia = /^hnewt-inertia-([1-5])$/.exec(focus)
  if (inertia) return <Inertia step={Number(inertia[1]) as Step} />
  const brake = /^hnewt-brake-([1-5])$/.exec(focus)
  if (brake) return <Braking step={Number(brake[1]) as Step} />
  switch (focus) {
    case 'hnewt-inertia-worked': return <InertiaWorked />
    case 'hnewt-inertia-question': return <InertiaQuestion />
    case 'hnewt-brake-worked': return <Braking step={5} n={workedScene} worked />
    default: return null
  }
}
