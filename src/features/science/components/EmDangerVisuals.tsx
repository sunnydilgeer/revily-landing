import { type ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, Leader, type Pt } from './PhysicsKit'
import { Arrow, Card, Eq, StepStrip, skin, skinLine, shirt, shirtLine, trousers } from './EnergyStoreVisuals'
import { SpectrumBar, WaveArrow, emGroups, waveColour, highEnergy } from './EmSpectrumVisuals'

/*
 * Physics Lesson 62: Dangers of electromagnetic waves. Original, code-native schematics; not to scale. Focus ids
 * start with 'emdanger-'.
 *
 * Uses the spectrum bar and wave arrows of Lesson 57 so the colours match: ultraviolet violet, X-rays and gamma rays
 * the deeper violets. "Harm" and "risk" are drawn in the coral used for wasted energy / warnings in Physics; doses are
 * a calm indigo so the numbers read clearly.
 */
const { ink, muted } = P
const r1 = (n: number) => Math.round(n * 10) / 10
const harm = P.wasted, harmFill = P.wastedFill
const dose = '#4a5fa6', doseFill = '#dfe4f6'
const uv = waveColour.uv

/* ---------- Pieces ---------- */

type Part = 'knee' | 'pelvis' | 'foot' | 'hand' | 'spine'
/** A simple front-facing person; (x, y) is between the feet. `mark` rings body parts. */
function Body({ x, y, s = 1, mark = [], glow = false }: { x: number; y: number; s?: number; mark?: Part[]; glow?: boolean }) {
  const spot: Record<Part, Pt> = { knee: [-10, -36], pelvis: [0, -78], foot: [9, -4], hand: [-33, -84], spine: [0, -118] }
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    {glow && <ellipse cx="0" cy="-90" rx="46" ry="96" fill={harmFill} />}
    <path d="M-9 -80L-11 -4M9 -80L11 -4" stroke={trousers} strokeWidth="13" />
    <path d="M-18 -4H-4M4 -4H18" stroke="#4f5d69" strokeWidth="6" />
    <path d="M-22 -148Q0 -156 22 -148L20 -80H-20Z" fill={shirt} stroke={shirtLine} strokeWidth="2" />
    <path d="M-22 -144L-32 -90M22 -144L32 -90" stroke={shirtLine} strokeWidth="10.5" />
    <path d="M-22 -144L-32 -90M22 -144L32 -90" stroke={shirt} strokeWidth="7" />
    <circle cx="-33" cy="-84" r="6" fill={skin} stroke={skinLine} strokeWidth="1.6" />
    <circle cx="33" cy="-84" r="6" fill={skin} stroke={skinLine} strokeWidth="1.6" />
    <rect x="-6" y="-160" width="12" height="10" fill={skin} />
    <circle cx="0" cy="-172" r="15" fill={skin} stroke={skinLine} strokeWidth="1.8" />
    <path d="M-15 -174Q-13 -190 0 -189Q14 -189 15 -174Q4 -182 -15 -174Z" fill="#6b4a35" />
    {mark.map(m => <circle key={m} cx={spot[m][0]} cy={spot[m][1]} r={m === 'pelvis' || m === 'spine' ? 17 : 11} fill="none" stroke={dose} strokeWidth="3" />)}
  </g>
}

function Sun({ x, y, r = 30 }: { x: number; y: number; r?: number }) {
  return <g>
    {Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5; return <path key={i} d={`M${r1(x + Math.cos(a) * (r + 7))} ${r1(y + Math.sin(a) * (r + 7))}L${r1(x + Math.cos(a) * (r + 17))} ${r1(y + Math.sin(a) * (r + 17))}`} stroke={P.lightLine} strokeWidth="3" /> })}
    <circle cx={x} cy={y} r={r} fill={P.light} stroke={P.lightLine} strokeWidth="2.2" />
  </g>
}

/** A dose gauge: a half dial from low (green) to high (coral) with a needle at `level` 0–1. */
function Gauge({ x, y, r = 70, level }: { x: number; y: number; r?: number; level: number }) {
  const seg = (a0: number, a1: number, c: string) => {
    const p = (a: number, rr: number) => `${r1(x - Math.cos(a * Math.PI) * rr)} ${r1(y - Math.sin(a * Math.PI) * rr)}`
    return <path d={`M${p(a0, r)}A${r} ${r} 0 0 1 ${p(a1, r)}L${p(a1, r - 18)}A${r - 18} ${r - 18} 0 0 0 ${p(a0, r - 18)}Z`} fill={c} stroke="white" strokeWidth="2" />
  }
  const a = level * Math.PI
  return <g>
    {seg(0, 1 / 3, '#cfe8d8')}{seg(1 / 3, 2 / 3, '#fbe3b8')}{seg(2 / 3, 1, '#f5c9c0')}
    <path d={`M${x} ${y}L${r1(x - Math.cos(a) * (r - 8))} ${r1(y - Math.sin(a) * (r - 8))}`} stroke={ink} strokeWidth="3.4" />
    <circle cx={x} cy={y} r="6" fill={ink} />
    <Lines x={x - r} y={y + 20} anchor="middle" lines={['low']} size={13} weight={650} colour={P.useful} />
    <Lines x={x + r} y={y + 20} anchor="middle" lines={['high']} size={13} weight={650} colour={harm} />
  </g>
}

/** A dose table with a heading row. */
function DoseTable({ x, y, rows, w = 250 }: { x: number; y: number; rows: [string, string][]; w?: number }) {
  const rh = 36, c1 = w * 0.55
  return <g>
    <rect x={x} y={y} width={w} height={rh * (rows.length + 1)} rx="10" fill="white" stroke={P.panelLine} strokeWidth="1.6" />
    <path d={`M${x} ${y + rh}H${x + w}`} stroke={ink} strokeWidth="1.6" />
    <rect x={x + 1} y={y + 1} width={w - 2} height={rh - 1} rx="9" fill={P.panel} />
    <path d={`M${x + c1} ${y}V${y + rh * (rows.length + 1)}`} stroke={P.panelLine} strokeWidth="1.6" />
    {rows.slice(0, -1).map((_, i) => <path key={i} d={`M${x} ${y + rh * (i + 2)}H${x + w}`} stroke={P.panelLine} strokeWidth="1.2" />)}
    <Lines x={x + c1 / 2} y={y + 23} anchor="middle" lines={['Part of body']} size={14} />
    <Lines x={x + c1 + (w - c1) / 2} y={y + 23} anchor="middle" lines={['Dose (mSv)']} size={14} />
    {rows.map(([a, b], i) => <g key={a}>
      <Lines x={x + c1 / 2} y={y + rh * (i + 1) + 24} anchor="middle" lines={[a]} size={15} weight={600} />
      <Lines x={x + c1 + (w - c1) / 2} y={y + rh * (i + 1) + 24} anchor="middle" lines={[b]} size={15} colour={dose} />
    </g>)}
  </g>
}

/** Two dose bars (knee 2.0, pelvis 6.0 mSv) on a shared base. */
function DoseBars({ x = 70, base = 240, unit = 26 }: { x?: number; base?: number; unit?: number }) {
  const bars: [string, number][] = [['knee', 2], ['pelvis', 6]]
  return <g>
    <path d={`M${x - 20} ${base}H${x + 230}`} stroke={ink} strokeWidth="2" />
    {bars.map(([name, v], i) => {
      const bx = x + i * 120, h = v * unit
      return <g key={name}>
        <rect x={bx} y={base - h} width={80} height={h} rx="7" fill={doseFill} stroke={dose} strokeWidth="2" />
        <Lines x={bx + 40} y={base - h - 10} anchor="middle" lines={[`${v.toFixed(1)} mSv`]} size={15} colour={dose} />
        <Lines x={bx + 40} y={base + 22} anchor="middle" lines={[name]} size={15} />
      </g>
    })}
  </g>
}

/* ---------- Section 1: harm ---------- */

function Harm() {
  const x = 20, w = 400, sw = (w - 24) / 7
  const hx = x + 4 * (sw + 4) - 3
  return <PhysicsDiagram title="The electromagnetic spectrum from radio waves to gamma rays. Ultraviolet, X-rays and gamma rays, at the high frequency end, are highlighted: they can harm living tissue. A person on the right has these waves entering their body.">
    <SpectrumBar x={x} y={104} w={w} h={56} />
    <rect x={x - 3} y={96} width={hx - x - 2} height={100} fill="white" opacity=".62" />
    <rect x={hx} y={96} width={x + w - hx + 4} height={72} rx="14" fill="none" stroke={harm} strokeWidth="3" />
    <Lines x={hx + (x + w - hx) / 2 + 2} y={52} anchor="middle" lines={['high frequency:', 'can harm living tissue']} size={14} colour={harm} />
    <path d={`M${hx + (x + w - hx) / 2} 76V92`} stroke={harm} strokeWidth="2" />
    <Body x={484} y={284} s={0.72} glow />
    {[150, 196].map((y, i) => <WaveArrow key={y} from={[424, y + 50]} to={[468, y + 40]} wavelength={7} amp={3} colour={i ? highEnergy : uv} width={2.4} />)}
    <Arrow from={[40, 236]} to={[410, 236]} colour={ink} width={2.6} />
    <Lines x={40} y={262} lines={['frequency increases']} size={14} />
  </PhysicsDiagram>
}

function Icon({ x, y, kind, label }: { x: number; y: number; kind: 'burn' | 'age' | 'eye' | 'cancer'; label: string[] }) {
  return <g>
    <circle cx={x} cy={y} r="26" fill="white" stroke={P.panelLine} strokeWidth="1.8" />
    {kind === 'burn' && <g><circle cx={x} cy={y} r="17" fill={skin} stroke={skinLine} strokeWidth="1.4" /><ellipse cx={x} cy={y} rx="11" ry="9" fill="#ef9f8d" /></g>}
    {kind === 'age' && <g><circle cx={x} cy={y} r="17" fill={skin} stroke={skinLine} strokeWidth="1.4" /><path d={`M${x - 10} ${y - 5}q5 -4 10 0t10 0M${x - 10} ${y + 2}q5 -4 10 0t10 0M${x - 8} ${y + 9}q4 -3 8 0t8 0`} stroke={skinLine} strokeWidth="1.6" fill="none" /></g>}
    {kind === 'eye' && <g><path d={`M${x - 18} ${y}Q${x} ${y - 16} ${x + 18} ${y}Q${x} ${y + 16} ${x - 18} ${y}Z`} fill="white" stroke={ink} strokeWidth="1.8" /><circle cx={x} cy={y} r="6.5" fill="#6d8fb0" /><circle cx={x} cy={y} r="3" fill={ink} /><path d={`M${x - 16} ${y - 16}L${x + 16} ${y + 16}`} stroke={harm} strokeWidth="2.6" /></g>}
    {kind === 'cancer' && <g><circle cx={x} cy={y} r="17" fill={skin} stroke={skinLine} strokeWidth="1.4" /><path d={`M${x - 5} ${y - 7}Q${x + 6} ${y - 9} ${x + 7} ${y}Q${x + 4} ${y + 8} ${x - 4} ${y + 6}Q${x - 9} ${y} ${x - 5} ${y - 7}Z`} fill="#7a5238" /></g>}
    <Lines x={x + 36} y={y + (label.length > 1 ? -3 : 5)} lines={label} size={14} />
  </g>
}
function Uv() {
  return <PhysicsDiagram title="A person in the sunshine. Ultraviolet from the Sun hits their skin and eyes. UV can cause sunburn, make skin age faster, damage the eyes (even blindness) and raise the risk of skin cancer.">
    <Sun x={52} y={52} />
    {[[96, 72, 150, 136], [110, 50, 176, 110], [80, 96, 132, 170]].map(([a, b, c, d], i) => <WaveArrow key={i} from={[a, b]} to={[c, d]} wavelength={9} amp={3.5} colour={uv} width={2.6} />)}
    <Body x={184} y={286} s={0.95} />
    <Lines x={112} y={36} lines={['ultraviolet']} size={15} colour={uv} />
    <Icon x={318} y={52} kind="burn" label={['sunburn']} />
    <Icon x={318} y={118} kind="age" label={['skin ages', 'faster']} />
    <Icon x={318} y={184} kind="eye" label={['eye damage,', 'blindness']} />
    <Icon x={318} y={250} kind="cancer" label={['higher risk of', 'skin cancer']} />
  </PhysicsDiagram>
}

function Ionising() {
  const ax = 170, ay = 150
  const e = (deg: number, r: number): Pt => [r1(ax + Math.cos(deg * Math.PI / 180) * r), r1(ay + Math.sin(deg * Math.PI / 180) * r)]
  const electrons = [e(30, 32), e(210, 32), e(150, 60), e(250, 60), e(60, 60)]
  const gone = e(-40, 60)
  return <PhysicsDiagram title="An X-ray or gamma ray hits an atom and knocks an electron off it: the atom is ionised. In a cell this can damage the cell or mutate its genes, which may lead to cancer.">
    <WaveArrow from={[20, 70]} to={[gone[0] - 16, gone[1] - 4]} wavelength={7} amp={3.4} colour={highEnergy} width={2.8} />
    <Lines x={20} y={50} lines={['X-ray or gamma ray']} size={14} colour={highEnergy} />
    <circle cx={ax} cy={ay} r="60" fill="none" stroke={P.panelLine} strokeWidth="2" />
    <circle cx={ax} cy={ay} r="32" fill="none" stroke={P.panelLine} strokeWidth="2" />
    {[[-4, -3, 1], [4, -4, 0], [0, 4, 1], [-5, 5, 0], [6, 4, 1]].map(([px, py, k], i) => <circle key={i} cx={ax + px} cy={ay + py} r="5" fill={k ? P.thermal : '#e4e8ec'} stroke={k ? P.thermalLine : '#7d8e9c'} strokeWidth="1.4" />)}
    {electrons.map(([px, py], i) => <circle key={i} cx={px} cy={py} r="5.5" fill={P.charge} stroke={P.chargeLine} strokeWidth="1.4" />)}
    <circle cx={gone[0]} cy={gone[1]} r="5.5" fill="white" stroke={P.chargeLine} strokeWidth="1.4" strokeDasharray="2 2" />
    <Arrow from={[gone[0] + 8, gone[1] - 6]} to={[gone[0] + 64, gone[1] - 44]} colour={P.chargeLine} width={2.4} />
    <circle cx={gone[0] + 72} cy={gone[1] - 50} r="6" fill={P.charge} stroke={P.chargeLine} strokeWidth="1.4" />
    <Lines x={170} y={244} anchor="middle" lines={['electron knocked off:', 'the atom is ionised']} size={14} />
    <path d="M318 40V270" stroke={P.panelLine} strokeWidth="1.6" strokeDasharray="5 5" />
    <path d="M360 150Q352 86 424 78Q500 76 506 144Q512 214 432 222Q362 222 360 150Z" fill="#f4e6ec" stroke="#b77a93" strokeWidth="2" />
    <path d="M410 130L420 116L432 128L446 118L452 134L444 148L452 162L436 164L426 176L416 160L402 158L408 144Z" fill="#dcc2e8" stroke="#7a56a6" strokeWidth="2" />
    <path d="M418 138l10 10M436 132l-6 14" stroke={harm} strokeWidth="2.4" />
    <Lines x={432} y={250} anchor="middle" lines={['cell damaged or mutated:', 'may lead to cancer']} size={14} colour={harm} />
  </PhysicsDiagram>
}

/* ---------- Section 2: dose ---------- */

function Dose() {
  return <PhysicsDiagram title="A person exposed to radiation, and a gauge for the risk of harm from low to high. Radiation dose, measured in sieverts (Sv), tells you the risk of harm.">
    <Body x={110} y={278} s={0.95} />
    {[0, 1].map(i => <WaveArrow key={i} from={[10, 110 + i * 50]} to={[80, 124 + i * 40]} wavelength={7} amp={3} colour={highEnergy} width={2.4} />)}
    <Gauge x={370} y={176} r={92} level={0.62} />
    <Lines x={370} y={60} anchor="middle" lines={['risk of harm']} size={16} colour={harm} />
    <rect x={250} y={222} width={240} height={36} rx="18" fill={doseFill} stroke={dose} strokeWidth="1.8" />
    <Lines x={370} y={246} anchor="middle" lines={['radiation dose (sieverts, Sv)']} size={14} colour={dose} />
    <Lines x={370} y={286} anchor="middle" lines={['bigger dose = bigger risk']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

function Depends() {
  return <PhysicsDiagram title="The risk depends on two things: how much radiation is absorbed (shown as a bucket filling up) and how harmful the type of radiation is (shown as arrows of different weights). Both feed into the risk.">
    <rect x={14} y={14} width={240} height={180} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <rect x={286} y={14} width={240} height={180} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <Lines x={134} y={42} anchor="middle" lines={['how much radiation', 'is absorbed']} size={14} />
    <path d="M94 112L104 180H164L174 112Z" fill="white" stroke={ink} strokeWidth="2.2" />
    <path d="M98 140L104 180H164L170 140Z" fill={doseFill} stroke={dose} strokeWidth="1.6" />
    {[114, 134, 154].map((x, i) => <WaveArrow key={x} from={[x - 4, 72 + (i % 2) * 6]} to={[x, 136]} wavelength={6} amp={2.4} colour={highEnergy} width={1.8} />)}
    <Lines x={406} y={42} anchor="middle" lines={['how harmful', 'the type is']} size={14} />
    {[1.2, 2.4, 4].map((wd, i) => <WaveArrow key={i} from={[320, 90 + i * 34]} to={[488, 90 + i * 34]} wavelength={10} amp={3.5} colour={highEnergy} width={wd} opacity={0.5 + i * 0.25} />)}
    <Arrow from={[134, 200]} to={[240, 244]} colour={ink} width={2.6} />
    <Arrow from={[406, 200]} to={[300, 244]} colour={ink} width={2.6} />
    <rect x={220} y={240} width={100} height={42} rx="21" fill={harmFill} stroke={harm} strokeWidth="2" />
    <Lines x={270} y={267} anchor="middle" lines={['risk']} size={18} colour={harm} />
  </PhysicsDiagram>
}

function Units() {
  return <PhysicsDiagram title="Changing units of dose. To go from sieverts to millisieverts, multiply by 1000. To go from millisieverts to sieverts, divide by 1000. 1000 mSv = 1 Sv.">
    <circle cx={110} cy={128} r="52" fill={doseFill} stroke={dose} strokeWidth="2.4" />
    <Lines x={110} y={138} anchor="middle" lines={['Sv']} size={30} colour={dose} />
    <Lines x={110} y={206} anchor="middle" lines={['sieverts']} size={14} weight={650} colour={muted} />
    <circle cx={430} cy={128} r="52" fill={doseFill} stroke={dose} strokeWidth="2.4" />
    <Lines x={430} y={138} anchor="middle" lines={['mSv']} size={30} colour={dose} />
    <Lines x={430} y={206} anchor="middle" lines={['millisieverts']} size={14} weight={650} colour={muted} />
    <path d="M168 102Q270 52 372 102" stroke={P.useful} strokeWidth="3" fill="none" />
    <Arrow from={[352, 92]} to={[374, 104]} colour={P.useful} width={3} />
    <Lines x={270} y={64} anchor="middle" lines={['× 1000']} size={20} colour={P.useful} />
    <path d="M372 156Q270 206 168 156" stroke={harm} strokeWidth="3" fill="none" />
    <Arrow from={[188, 166]} to={[166, 154]} colour={harm} width={3} />
    <Lines x={270} y={206} anchor="middle" lines={['÷ 1000']} size={20} colour={harm} />
    <rect x={170} y={236} width={200} height={46} rx="14" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <Lines x={270} y={266} anchor="middle" lines={['1000 mSv = 1 Sv']} size={20} />
  </PhysicsDiagram>
}

/* ---------- Section 3: weighing risk ---------- */

function Weigh() {
  const tilt = 12, cx = 270, cy = 96, arm = 170
  const a = tilt * Math.PI / 180
  const L: Pt = [r1(cx - Math.cos(a) * arm), r1(cy + Math.sin(a) * arm)], R: Pt = [r1(cx + Math.cos(a) * arm), r1(cy - Math.sin(a) * arm)]
  const Pan = ({ at, fill, line, lines, colour }: { at: Pt; fill: string; line: string; lines: string[]; colour: string }) => <g>
    <path d={`M${at[0]} ${at[1]}L${at[0] - 58} ${at[1] + 70}M${at[0]} ${at[1]}L${at[0] + 58} ${at[1] + 70}`} stroke={muted} strokeWidth="1.8" />
    <path d={`M${at[0] - 76} ${at[1] + 70}H${at[0] + 76}Q${at[0] + 62} ${at[1] + 96} ${at[0]} ${at[1] + 96}Q${at[0] - 62} ${at[1] + 96} ${at[0] - 76} ${at[1] + 70}Z`} fill={fill} stroke={line} strokeWidth="2.2" />
    <Lines x={at[0]} y={at[1] + 122} anchor="middle" lines={lines} size={14} colour={colour} />
  </g>
  return <PhysicsDiagram title="A balance. On the lower, heavier side: the benefit, an injury found and treated. On the higher, lighter side: the risk from a very small dose. Here the benefit outweighs the risk.">
    <path d={`M${cx} ${cy}V270`} stroke={ink} strokeWidth="5" />
    <path d={`M${cx - 50} 276H${cx + 50}`} stroke={ink} strokeWidth="6" />
    <path d={`M${L[0]} ${L[1]}L${R[0]} ${R[1]}`} stroke={ink} strokeWidth="5" />
    <circle cx={cx} cy={cy} r="8" fill="white" stroke={ink} strokeWidth="2.6" />
    <Pan at={L} fill={P.usefulFill} line={P.useful} lines={['benefit:', 'injury found', 'and treated']} colour={P.useful} />
    <Pan at={R} fill={harmFill} line={harm} lines={['risk:', 'very small dose']} colour={harm} />
    <g transform={`translate(${L[0] - 18} ${L[1] + 34})`}>
      <path d="M0 0H36V30H0Z" fill="white" stroke={P.useful} strokeWidth="2" />
      <path d="M18 6V24M9 15H27" stroke={P.useful} strokeWidth="4" />
    </g>
    <circle cx={R[0]} cy={R[1] + 60} r="6" fill={harm} />
  </PhysicsDiagram>
}

function Table() {
  return <PhysicsDiagram title="A person with the knee and pelvis ringed, and a table of CT scan doses: knee 2.0 mSv, pelvis 6.0 mSv.">
    <Body x={120} y={284} s={1.25} mark={['knee', 'pelvis']} />
    <Leader from={[196, 178]} to={[141, 186]} colour={dose} />
    <Lines x={200} y={176} lines={['pelvis']} size={14} colour={dose} />
    <Leader from={[196, 238]} to={[122, 234]} colour={dose} />
    <Lines x={200} y={242} lines={['knee']} size={14} colour={dose} />
    <Lines x={392} y={68} anchor="middle" lines={['CT scan doses']} size={16} />
    <DoseTable x={270} y={86} rows={[['Knee', '2.0'], ['Pelvis', '6.0']]} w={244} />
  </PhysicsDiagram>
}

function Compare() {
  return <PhysicsDiagram title="Two bars: the knee scan dose 2.0 mSv and the pelvis scan dose 6.0 mSv. 6.0 ÷ 2.0 = 3, so the pelvis scan has 3 times the risk.">
    <DoseBars x={70} />
    <path d={`M306 ${240 - 156}H320V240H306`} stroke={harm} strokeWidth="2.2" fill="none" />
    <Lines x={332} y={150} lines={['3 times', 'the risk']} size={16} colour={harm} />
    <Card x={330} y={206} w={196} h={48}><Eq x={428} y={237} pieces={[['6.0 ÷ 2.0 = '], ['3', harm]]} size={20} /></Card>
  </PhysicsDiagram>
}

function WorkedConvert() {
  return <PhysicsDiagram title="Worked example: 0.005 Sv multiplied by 1000 gives 5 mSv.">
    <StepStrip steps={['units', 'multiply', 'answer']} active={3} />
    <rect x={40} y={100} width={160} height={70} rx="16" fill={doseFill} stroke={dose} strokeWidth="2" />
    <Lines x={120} y={144} anchor="middle" lines={['0.005 Sv']} size={24} colour={dose} />
    <Arrow from={[212, 135]} to={[326, 135]} colour={P.useful} width={3.4} />
    <Lines x={269} y={120} anchor="middle" lines={['× 1000']} size={20} colour={P.useful} />
    <rect x={340} y={100} width={160} height={70} rx="16" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <Lines x={420} y={144} anchor="middle" lines={['5 mSv']} size={24} />
    <Lines x={270} y={220} anchor="middle" lines={['millisieverts are smaller,', 'so there are more of them']} size={14} weight={650} colour={muted} />
  </PhysicsDiagram>
}

function WorkedRatio() {
  return <PhysicsDiagram title="Worked example: the pelvis dose 6.0 mSv and the knee dose 2.0 mSv. 6.0 mSv ÷ 2.0 mSv = 3. The units cancel.">
    <DoseBars x={60} />
    <Card x={320} y={70} w={206} h={120}>
      <Eq x={423} y={110} pieces={[['6.0 mSv ÷ 2.0 mSv']]} size={17} />
      <Eq x={423} y={146} pieces={[['= '], ['3', harm]]} size={26} />
      <Lines x={423} y={176} anchor="middle" lines={['same units: they cancel']} size={12} weight={650} colour={muted} />
    </Card>
    <Lines x={423} y={230} anchor="middle" lines={['pelvis: 3 times the dose,', 'so 3 times the risk']} size={14} colour={harm} />
  </PhysicsDiagram>
}

/* ---------- Question ---------- */

function QTable() {
  return <PhysicsDiagram title="A table of CT scan doses: foot 3.0 mSv, hand 1.5 mSv, spine 12 mSv.">
    <DoseTable x={140} y={60} rows={[['Foot', '3.0'], ['Hand', '1.5'], ['Spine', '12']]} w={260} />
  </PhysicsDiagram>
}

export function EmDangerVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  const views: Record<string, () => ReactNode> = {
    'emdanger-harm': () => <Harm />,
    'emdanger-uv': () => <Uv />,
    'emdanger-ionising': () => <Ionising />,
    'emdanger-dose': () => <Dose />,
    'emdanger-depends': () => <Depends />,
    'emdanger-units': () => <Units />,
    'emdanger-weigh': () => <Weigh />,
    'emdanger-table': () => <Table />,
    'emdanger-compare': () => <Compare />,
    'emdanger-worked-convert': () => <WorkedConvert />,
    'emdanger-worked-ratio': () => <WorkedRatio />,
    'emdanger-q-table': () => <QTable />,
  }
  return <>{views[focus]?.() ?? null}</>
}
void emGroups
