import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, wirePath, type Pt } from './PhysicsKit'
import { Arrow } from './GasParticleVisuals'
import { WorkCard, type CardLine } from './DensityVisuals'
import { Tick, Tag, Card, Hand } from './EnergyStoreVisuals'
import { waveColours as W, Sine, sinePath, Measure, Speaker } from './WaveTypeVisuals'

/*
 * Physics Lesson 54: Frequency, period and wave speed. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'wavespeed-' and is routed from CellBiologyVisuals.tsx.
 *
 * Quantity colours are the wave colours from the previous lesson: frequency f gold, wavelength λ green, period T
 * indigo, wave speed v vermilion (the colour of "the wave travels this way"). Worked examples use the same step card
 * as the other Physics calculation lessons. The speed-of-sound bench (signal generator, speaker, two microphones,
 * oscilloscope) is one drawing reused across section 5; its leads are plain lines, not circuit symbols.
 */
const { ink, muted } = P
const F = W.frequency, L = W.wavelength, T = W.period, V = W.travel
const mic1 = W.line, mic2 = P.electrostaticLine

const Fq = ({ children }: { children: ReactNode }) => <tspan fill={F}>{children}</tspan>
const Lm = ({ children }: { children: ReactNode }) => <tspan fill={L}>{children}</tspan>
const Tp = ({ children }: { children: ReactNode }) => <tspan fill={T}>{children}</tspan>
const Vs = ({ children }: { children: ReactNode }) => <tspan fill={V}>{children}</tspan>

/** A big equation with pointers from each symbol down to its name and unit. */
function EqPointers({ y, parts, names }: { y: number; parts: [number, string, string][]; names: [number, string[], string][] }) {
  return <g>
    {parts.map(([x, t, c], i) => <text key={i} x={x} y={y} textAnchor="middle" fontSize="36" fontWeight="750" fill={c}>{t}</text>)}
    {names.map(([x, l, c]) => <g key={x}>
      <path d={`M${x} ${y + 12}V${y + 34}`} stroke={c} strokeWidth="1.8" />
      <Lines x={x} y={y + 54} anchor="middle" lines={l} size={14} colour={c} />
    </g>)}
  </g>
}

/* ---------- Section 2: period ---------- */

function PeriodEq() {
  return <PhysicsDiagram schematic={false} title="Period equals 1 divided by frequency: T = 1 ÷ f, with the period in seconds and the frequency in hertz.">
    <Card x={40} y={40} w={250} h={80} />
    <EqPointers y={96} parts={[[90, 'T', T], [140, '=', ink], [180, '1', ink], [216, '÷', ink], [252, 'f', F]]} names={[[90, ['period', '(s)'], T], [252, ['frequency', '(Hz)'], F]]} />
    {/* a small wave with one complete wave shaded */}
    <path d={`${sinePath(380, 460, 110, 32, 80)}L460 110L380 110Z`} fill={W.periodFill} opacity=".75" />
    <Sine x0={340} x1={510} y0={110} a={32} lam={80} phase={0.5} />
    <Sine x0={380} x1={460} y0={110} a={32} lam={80} colour={T} width={3.6} />
    <path d="M330 110H516" stroke={muted} strokeWidth="1.3" strokeDasharray="5 5" />
    <Measure from={[380, 172]} to={[460, 172]} colour={T} />
    <Lines x={420} y={200} anchor="middle" lines={['one wave: time T']} size={14} colour={T} />
    <Lines x={270} y={276} anchor="middle" lines={['period = 1 ÷ frequency']} size={16} />
  </PhysicsDiagram>
}
const T_LINES: CardLine[] = [
  { text: <><Tp>T</Tp> = 1 ÷ <Fq>f</Fq></>, note: 'write the equation' },
  { text: <><Tp>T</Tp> = 1 ÷ <Fq>4</Fq></>, note: 'put in the frequency' },
  { text: <><Tp>T</Tp> = <Tp>0.25 s</Tp></>, note: 'work it out, with the unit' },
]
function TWorked() {
  return <PhysicsDiagram schematic={false} title="Worked example: a wave has a frequency of 4 Hz. T = 1 ÷ f = 1 ÷ 4 = 0.25 s.">
    <Lines x={96} y={110} anchor="middle" lines={['f = 4 Hz']} size={18} colour={F} />
    <Lines x={96} y={140} anchor="middle" lines={['find T']} size={15} colour={T} />
    <WorkCard x={190} y={54} w={320} lines={T_LINES} step={2} done />
  </PhysicsDiagram>
}
function TCheck() {
  const x0 = 60, x1 = 480, y0 = 120, lam = (x1 - x0) / 4
  return <PhysicsDiagram schematic={false} title="Four waves in one second: each wave takes a quarter of a second, 0.25 s.">
    {[0, 1, 2, 3].map(i => <rect key={i} x={x0 + i * lam + 2} y={52} width={lam - 4} height={136} rx="14" fill={i % 2 ? W.periodFill : 'white'} opacity=".55" />)}
    <Sine x0={x0} x1={x1} y0={y0} a={48} lam={lam} />
    <path d={`M${x0} 214H${x1}`} stroke={ink} strokeWidth="2.2" />
    {[0, 1, 2, 3, 4].map(i => <g key={i}>
      <path d={`M${x0 + i * lam} 208V220`} stroke={ink} strokeWidth="2" />
      <text x={x0 + i * lam} y={240} textAnchor="middle" fontSize="13" fontWeight="700" fill={T}>{['0', '0.25', '0.5', '0.75', '1 s'][i]}</text>
    </g>)}
    <Lines x={x0 + lam / 2} y={44} anchor="middle" lines={['0.25 s']} size={14} colour={T} />
    <Lines x={270} y={276} anchor="middle" lines={['4 waves in 1 s, so each wave takes 0.25 s']} size={15} />
  </PhysicsDiagram>
}

/* ---------- Section 3: wave speed ---------- */

function SpeedEq() {
  return <PhysicsDiagram schematic={false} title="Wave speed equals frequency times wavelength: v = f × λ, with v in m/s, f in Hz and λ in m. λ is the Greek letter lambda. It applies to all waves.">
    <Card x={110} y={36} w={320} h={80} />
    <EqPointers y={92} parts={[[160, 'v', V], [214, '=', ink], [262, 'f', F], [314, '×', ink], [366, 'λ', L]]} names={[[160, ['wave speed', '(m/s)'], V], [262, ['frequency', '(Hz)'], F], [366, ['wavelength', '(m)'], L]]} />
    <Tag x={150} y={236} text="λ is the Greek letter lambda" colour={L} />
    <Tag x={410} y={236} text="applies to all waves" colour={muted} />
    <Lines x={270} y={282} anchor="middle" lines={['wave speed = frequency × wavelength']} size={15} />
  </PhysicsDiagram>
}
const V_LINES: CardLine[] = [
  { text: <><Vs>v</Vs> = <Fq>f</Fq> × <Lm>λ</Lm></>, note: 'write the equation' },
  { text: <><Vs>v</Vs> = <Fq>5</Fq> × <Lm>0.4</Lm></>, note: 'put in the values' },
  { text: <><Vs>v</Vs> = <Vs>2 m/s</Vs></>, note: 'multiply, then add the unit' },
]
function Rope({ x0 = 40, x1 = 250, y0 = 110 }: { x0?: number; x1?: number; y0?: number }) {
  const lam = 84, c1 = x0 + 20 + lam / 4, c2 = c1 + lam
  return <g>
    <Hand x={x0 - 4} y={y0} s={0.75} />
    <Sine x0={x0 + 20} x1={x1} y0={y0} a={24} lam={lam} colour={P.resistance} width={3.4} />
    <path d={`M${c1} ${y0 - 28}V${y0 - 48}M${c2} ${y0 - 28}V${y0 - 48}`} stroke={L} strokeWidth="1.5" strokeDasharray="3 4" />
    <Measure from={[c1, y0 - 42]} to={[c2, y0 - 42]} colour={L} stops={false} />
    <Lines x={(c1 + c2) / 2} y={y0 - 54} anchor="middle" lines={['λ = 0.4 m']} size={15} colour={L} />
    <Lines x={(x0 + x1) / 2} y={y0 + 62} anchor="middle" lines={['f = 5 Hz']} size={15} colour={F} />
  </g>
}
function VWorked({ step }: { step: 1 | 2 }) {
  return <PhysicsDiagram schematic={false} title={step === 1 ? 'A wave on a rope has a frequency of 5 Hz and a wavelength of 0.4 m. v = f × λ, so v = 5 × 0.4.' : 'v = 5 × 0.4 = 2. The wave speed is 2 m/s.'}>
    <Rope />
    <WorkCard x={270} y={54} w={250} lines={V_LINES} step={step} done={step === 2} />
    {step === 2 && <Lines x={270} y={250} anchor="middle" lines={['Hz × m gives m/s']} size={14} colour={muted} />}
  </PhysicsDiagram>
}

/* ---------- Section 4: rearranging and standard form ---------- */

function Rearrange() {
  const strike = (x: number, y: number) => <path d={`M${x - 11} ${y + 8}L${x + 11} ${y - 20}`} stroke={P.wasted} strokeWidth="2.6" />
  return <PhysicsDiagram schematic={false} title="Rearranging: start with v = f × λ, divide both sides by f, and the f on the right cancels, leaving λ = v ÷ f.">
    <text x={40} y={70} fontSize="15" fontWeight="700" fill={muted}>start</text>
    <text x={270} y={72} textAnchor="middle" fontSize="28" fontWeight="750" fill={ink}><Vs>v</Vs> = <Fq>f</Fq> × <Lm>λ</Lm></text>
    <text x={40} y={146} fontSize="15" fontWeight="700" fill={muted}>÷ both sides by f</text>
    {/* v / f = (f × λ) / f */}
    <text x={226} y={130} textAnchor="middle" fontSize="26" fontWeight="750" fill={V}>v</text>
    <path d="M208 140H244" stroke={ink} strokeWidth="2.4" />
    <text x={226} y={168} textAnchor="middle" fontSize="26" fontWeight="750" fill={F}>f</text>
    <text x={270} y={150} textAnchor="middle" fontSize="26" fontWeight="750" fill={ink}>=</text>
    <text x={338} y={130} textAnchor="middle" fontSize="26" fontWeight="750" fill={ink}><Fq>f</Fq> × <Lm>λ</Lm></text>
    <path d="M298 140H378" stroke={ink} strokeWidth="2.4" />
    <text x={338} y={168} textAnchor="middle" fontSize="26" fontWeight="750" fill={F}>f</text>
    {strike(314, 130)}{strike(338, 168)}
    <text x={40} y={238} fontSize="15" fontWeight="700" fill={muted}>so</text>
    <rect x={180} y={206} width={180} height={50} rx="16" fill="white" stroke={L} strokeWidth="2.4" />
    <text x={270} y={240} textAnchor="middle" fontSize="28" fontWeight="750" fill={ink}><Lm>λ</Lm> = <Vs>v</Vs> ÷ <Fq>f</Fq></text>
  </PhysicsDiagram>
}
function Mast({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 26} ${y}L${x} ${y - 130}L${x + 26} ${y}M${x - 18} ${y - 40}H${x + 18}M${x - 10} ${y - 80}H${x + 10}M${x - 18} ${y - 40}L${x + 10} ${y - 80}M${x + 18} ${y - 40}L${x - 10} ${y - 80}`} stroke="#5a6b79" strokeWidth="3" fill="none" />
    <circle cx={x} cy={y - 134} r="6" fill={P.current} />
    {[22, 40, 58].map(r => <path key={r} d={`M${x + r * 0.6} ${y - 134 - r * 0.8}Q${x + r * 1.2} ${y - 134} ${x + r * 0.6} ${y - 134 + r * 0.8}`} stroke={W.line} strokeWidth="2.4" fill="none" />)}
  </g>
}
function Std1() {
  return <PhysicsDiagram schematic={false} title="A radio wave has a frequency of 6.0 × 10⁷ Hz and a speed of 3.0 × 10⁸ m/s. λ = (3.0 × 10⁸) ÷ (6.0 × 10⁷), with brackets round each standard form number.">
    <Mast x={76} y={200} />
    <Lines x={150} y={62} lines={['f = 6.0 × 10⁷ Hz']} size={15} colour={F} />
    <Lines x={150} y={90} lines={['v = 3.0 × 10⁸ m/s']} size={15} colour={V} />
    <Card x={150} y={124} w={370} h={78} />
    <text x={335} y={170} textAnchor="middle" fontSize="20" fontWeight="750" fill={ink}><Lm>λ</Lm> = <tspan fill={P.pd}>(</tspan><Vs>3.0 × 10⁸</Vs><tspan fill={P.pd}>)</tspan> ÷ <tspan fill={P.pd}>(</tspan><Fq>6.0 × 10⁷</Fq><tspan fill={P.pd}>)</tspan></text>
    <Lines x={335} y={236} anchor="middle" lines={['brackets round each number']} size={14} colour={P.pd} />
    <Lines x={335} y={260} anchor="middle" lines={['λ = v ÷ f']} size={14} colour={muted} />
  </PhysicsDiagram>
}
function Calculator({ x, y, display }: { x: number; y: number; display: string }) {
  const keys = ['7', '8', '9', '×10ˣ', '4', '5', '6', '÷', '1', '2', '3', '=']
  return <g>
    <rect x={x} y={y} width={170} height={230} rx="18" fill="#e9eef2" stroke="#6f8494" strokeWidth="2.2" />
    <rect x={x + 14} y={y + 16} width={142} height={46} rx="8" fill="#eaf4e6" stroke="#8aa0b1" strokeWidth="1.6" />
    <text x={x + 146} y={y + 50} textAnchor="end" fontSize="26" fontWeight="750" fill={ink}>{display}</text>
    {keys.map((k, i) => {
      const cx = x + 14 + (i % 4) * 37, cy = y + 80 + Math.floor(i / 4) * 44, hot = k === '×10ˣ'
      return <g key={k}>
        <rect x={cx} y={cy} width={32} height={36} rx="8" fill={hot ? '#fff6e3' : 'white'} stroke={hot ? '#e7b75e' : '#8aa0b1'} strokeWidth={hot ? 2.4 : 1.4} />
        <text x={cx + 16} y={cy + 23} textAnchor="middle" fontSize={hot ? 12 : 15} fontWeight="700" fill={ink}>{k}</text>
      </g>
    })}
  </g>
}
function Std2() {
  return <PhysicsDiagram schematic={false} title="On the calculator, enter each standard form number with the ×10ˣ button and keep the brackets. The display shows 5, so the wavelength is 5 m.">
    <Calculator x={60} y={36} display="5" />
    <Lines x={250} y={82} lines={['use the ×10ˣ (or EXP) button']} size={15} />
    <Lines x={250} y={108} lines={['and keep the brackets']} size={15} colour={muted} />
    <rect x={250} y={150} width={180} height={56} rx="18" fill="white" stroke={L} strokeWidth="2.4" />
    <text x={340} y={186} textAnchor="middle" fontSize="26" fontWeight="750" fill={ink}><Lm>λ</Lm> = <Lm>5 m</Lm></text>
    <Tick x={452} y={178} />
    <Lines x={250} y={246} lines={['wavelength is in metres']} size={14} colour={muted} />
  </PhysicsDiagram>
}

/* ---------- Section 5: speed of sound with an oscilloscope ---------- */

/** An oscilloscope screen with two traces, one from each microphone. `shift` is how far out of step trace 2 is (fraction of a wave). */
function ScopeScreen({ x, y, w, h, shift = 0, waves = 2.5, labels = false }: { x: number; y: number; w: number; h: number; shift?: number; waves?: number; labels?: boolean }) {
  const lam = w / waves, a = h * 0.14
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="10" fill="#1f3340" stroke="#5a6b79" strokeWidth="2.4" />
    {Array.from({ length: Math.floor(waves) + 1 }, (_, i) => <path key={i} d={`M${x + lam * (i + 0.25)} ${y + 6}V${y + h - 6}`} stroke="#48606f" strokeWidth="1.2" strokeDasharray="4 4" />)}
    <Sine x0={x + 4} x1={x + w - 4} y0={y + h * 0.3} a={a} lam={lam} phase={-4 / lam} colour="#7cc3ee" width={2.8} />
    <Sine x0={x + 4} x1={x + w - 4} y0={y + h * 0.72} a={a} lam={lam} phase={-4 / lam - shift} colour="#6fd3c6" width={2.8} />
    {labels && <g fontSize="13" fontWeight="700">
      <text x={x + w + 10} y={y + h * 0.3 + 5} fill={mic1}>microphone 1</text>
      <text x={x + w + 10} y={y + h * 0.72 + 5} fill={mic2}>microphone 2</text>
    </g>}
  </g>
}
function Mic({ x, y, colour }: { x: number; y: number; colour: string }) {
  return <g>
    <path d={`M${x} ${y}V${y + 42}M${x - 14} ${y + 44}H${x + 14}`} stroke="#5a6b79" strokeWidth="3" />
    <rect x={x - 9} y={y - 18} width={18} height={24} rx="9" fill="white" stroke={colour} strokeWidth="2.4" />
    <path d={`M${x - 5} ${y - 10}H${x + 5}M${x - 5} ${y - 4}H${x + 5}`} stroke={colour} strokeWidth="1.4" />
  </g>
}
function SignalGenerator({ x, y, reading, hot = false }: { x: number; y: number; reading?: string; hot?: boolean }) {
  return <g>
    <rect x={x} y={y} width={96} height={60} rx="10" fill="#eef2f5" stroke={hot ? F : '#5a6b79'} strokeWidth={hot ? 2.6 : 2.2} />
    <rect x={x + 10} y={y + 10} width={48} height={20} rx="4" fill="white" stroke="#8aa0b1" strokeWidth="1.4" />
    {reading && <text x={x + 34} y={y + 25} textAnchor="middle" fontSize="12" fontWeight="750" fill={F}>{reading}</text>}
    <circle cx={x + 76} cy={y + 22} r="10" fill="white" stroke="#5a6b79" strokeWidth="2" />
    <path d={`M${x + 76} ${y + 22}L${x + 81} ${y + 15}`} stroke="#5a6b79" strokeWidth="2" />
    <circle cx={x + 20} cy={y + 46} r="4" fill={P.current} /><circle cx={x + 36} cy={y + 46} r="4" fill={ink} />
  </g>
}
const BENCH = 214
function Bench({ mic2x, shift = 0, highlight, children }: { mic2x: number; shift?: number; highlight?: 'labels' | 'move' | 'speed'; children?: ReactNode }) {
  const lead = (pts: Pt[], c = '#5a6b79') => <path d={wirePath(pts, 10)} stroke={c} strokeWidth="2" fill="none" />
  const m1 = 176
  return <g>
    <path d={`M14 ${BENCH}H526`} stroke={P.panelLine} strokeWidth="4" />
    <SignalGenerator x={18} y={BENCH - 62} reading="1000 Hz" hot={highlight === 'speed'} />
    <Speaker x={140} y={BENCH - 36} s={0.9} />
    {lead([[56, BENCH - 16], [56, BENCH - 6], [110, BENCH - 6], [120, BENCH - 30]])}
    <Mic x={m1} y={BENCH - 44} colour={mic1} />
    <Mic x={mic2x} y={BENCH - 44} colour={mic2} />
    {/* leads from each microphone up to the oscilloscope */}
    {lead([[m1, BENCH - 62], [m1, 70], [360, 70]], mic1)}
    {lead([[mic2x, BENCH - 62], [mic2x, 90], [360, 90]], mic2)}
    <rect x={360} y={30} width={160} height={120} rx="12" fill="#eef2f5" stroke="#5a6b79" strokeWidth="2.2" />
    <ScopeScreen x={372} y={40} w={136} h={96} shift={shift} />
    {children}
  </g>
}
function ScopeSetup() {
  return <PhysicsDiagram title="Measuring the speed of sound: a signal generator drives a speaker; two microphones on the bench are both connected to an oscilloscope, which shows their waves.">
    <Bench mic2x={210} shift={0} />
    <Lines x={66} y={BENCH + 24} anchor="middle" lines={['signal', 'generator']} size={13} />
    <Lines x={138} y={BENCH - 70} anchor="middle" lines={['speaker']} size={13} />
    <Lines x={194} y={BENCH + 24} anchor="middle" lines={['microphones']} size={13} />
    <Lines x={440} y={172} anchor="middle" lines={['oscilloscope']} size={13} />
  </PhysicsDiagram>
}
function ScopeLine() {
  return <PhysicsDiagram title="Both microphones start next to the speaker. The two waves on the oscilloscope screen line up.">
    <Bench mic2x={210} shift={0} />
    <Lines x={194} y={BENCH + 24} anchor="middle" lines={['both next to the speaker']} size={13} />
    <Tag x={440} y={176} text="waves line up" colour={P.useful} />
  </PhysicsDiagram>
}
function ScopeMove({ speed = false }: { speed?: boolean }) {
  const m2 = 318
  return <PhysicsDiagram title={speed ? 'Work out the speed with v = f × λ: the frequency is set on the signal generator and λ is the distance between the microphones. Sound in air travels at about 330 m/s.' : 'One microphone is moved away until the waves line up again. The microphones are now one wavelength apart.'}>
    <Bench mic2x={m2} shift={0} highlight={speed ? 'speed' : 'move'} />
    <Measure from={[176, BENCH + 16]} to={[m2, BENCH + 16]} colour={L} />
    <Lines x={(176 + m2) / 2} y={BENCH + 40} anchor="middle" lines={['one wavelength']} size={14} colour={L} />
    {!speed && <g>
      <Arrow from={[236, BENCH - 84]} to={[290, BENCH - 84]} colour={ink} width={2.4} />
      <Lines x={262} y={BENCH - 94} anchor="middle" lines={['move']} size={13} colour={muted} />
      <Tag x={440} y={176} text="line up again" colour={P.useful} />
    </g>}
    {speed && <g>
      <Lines x={66} y={BENCH + 24} anchor="middle" lines={['frequency set', 'on the signal', 'generator']} size={12} colour={F} />
      <rect x={380} y={166} width={146} height={40} rx="14" fill="white" stroke={V} strokeWidth="2.2" />
      <text x={453} y={193} textAnchor="middle" fontSize="18" fontWeight="750" fill={ink}><Vs>v</Vs> = <Fq>f</Fq> × <Lm>λ</Lm></text>
      <Lines x={453} y={236} anchor="middle" lines={['about 330 m/s', 'in air']} size={13} colour={V} />
    </g>}
  </PhysicsDiagram>
}
function QuestionScope() {
  return <PhysicsDiagram schematic={false} title="An oscilloscope screen showing two traces of the same wavelength, one from microphone 1 and one from microphone 2.">
    <rect x={40} y={30} width={320} height={240} rx="16" fill="#eef2f5" stroke="#5a6b79" strokeWidth="2.2" />
    <ScopeScreen x={56} y={46} w={288} h={208} shift={0.25} waves={2.5} />
    <g fontSize="14" fontWeight="700">
      <text x={372} y={46 + 208 * 0.3 + 5} fill={mic1}>microphone 1</text>
      <text x={372} y={46 + 208 * 0.72 + 5} fill={mic2}>microphone 2</text>
    </g>
  </PhysicsDiagram>
}

export function WaveSpeedVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'wavespeed-period': return <PeriodEq />
    case 'wavespeed-t-worked': return <TWorked />
    case 'wavespeed-t-check': return <TCheck />
    case 'wavespeed-equation': return <SpeedEq />
    case 'wavespeed-v1': return <VWorked step={1} />
    case 'wavespeed-v2': return <VWorked step={2} />
    case 'wavespeed-rearrange': return <Rearrange />
    case 'wavespeed-std1': return <Std1 />
    case 'wavespeed-std2': return <Std2 />
    case 'wavespeed-scope-setup': return <ScopeSetup />
    case 'wavespeed-scope-line': return <ScopeLine />
    case 'wavespeed-scope-move': return <ScopeMove />
    case 'wavespeed-scope-speed': return <ScopeMove speed />
    case 'wavespeed-q-scope': return <QuestionScope />
    default: return null
  }
}
