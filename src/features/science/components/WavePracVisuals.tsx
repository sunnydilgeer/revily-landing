import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, wirePath, type Pt } from './PhysicsKit'
import { Tick, CrossMark, Tag, Card, Hand } from './EnergyStoreVisuals'
import { waveColours as W, Measure, sinePath } from './WaveTypeVisuals'

/*
 * Physics Lesson 55: Investigating waves (required practical preparation). Original, code-native schematics; not to scale.
 * Every focus id here starts with 'waveprac-' and is routed from CellBiologyVisuals.tsx.
 *
 * Two reused drawings: the ripple tank (side view: tray of water on legs, dipper, signal generator, and later a lamp
 * above and a screen below with the shadow lines seen from above) and the vibrating string (vibration generator,
 * string over a pulley at the bench edge, hanging masses). Water blue, lamp light yellow; the wave quantities keep the
 * wave colours: frequency gold, wavelength green, wave speed vermilion. Electrical leads are plain lines.
 */
const { ink, muted } = P
const F = W.frequency, L = W.wavelength, V = W.travel
const kit = '#5a6b79', kitFill = '#eef2f5', stringColour = P.resistance
const Fq = ({ children }: { children: ReactNode }) => <tspan fill={F}>{children}</tspan>
const Lm = ({ children }: { children: ReactNode }) => <tspan fill={L}>{children}</tspan>
const Vs = ({ children }: { children: ReactNode }) => <tspan fill={V}>{children}</tspan>

/* ---------- Shared equipment ---------- */

function Lead({ pts }: { pts: Pt[] }) {
  return <path d={wirePath(pts, 10)} stroke={kit} strokeWidth="2.2" fill="none" />
}
function SignalGen({ x, y, reading, hot = false }: { x: number; y: number; reading?: string; hot?: boolean }) {
  return <g>
    <rect x={x} y={y} width={96} height={58} rx="10" fill={kitFill} stroke={hot ? F : kit} strokeWidth={hot ? 2.8 : 2.2} />
    <rect x={x + 10} y={y + 10} width={50} height={20} rx="4" fill="white" stroke="#8aa0b1" strokeWidth="1.4" />
    {reading && <text x={x + 35} y={y + 25} textAnchor="middle" fontSize="13" fontWeight="750" fill={F}>{reading}</text>}
    <circle cx={x + 76} cy={y + 21} r="10" fill="white" stroke={kit} strokeWidth="2" />
    <path d={`M${x + 76} ${y + 21}L${x + 81} ${y + 14}`} stroke={kit} strokeWidth="2" />
    <circle cx={x + 20} cy={y + 45} r="4" fill={P.current} /><circle cx={x + 36} cy={y + 45} r="4" fill={ink} />
  </g>
}
/** A desk lamp head pointing down; (x, y) is the bulb. */
function LampHead({ x, y, hot = false }: { x: number; y: number; hot?: boolean }) {
  return <g>
    {hot && <circle cx={x} cy={y} r="30" fill={P.hotFill} />}
    <path d={`M${x} ${y - 30}V${y - 44}`} stroke={kit} strokeWidth="3" />
    <path d={`M${x - 26} ${y + 2}Q${x - 24} ${y - 26} ${x} ${y - 28}Q${x + 24} ${y - 26} ${x + 26} ${y + 2}Z`} fill={hot ? '#f6c1b4' : '#dfe6eb'} stroke={hot ? P.hot : kit} strokeWidth="2.2" />
    <circle cx={x} cy={y + 2} r="9" fill="#fff6d6" stroke={P.lightLine} strokeWidth="1.8" />
  </g>
}
/** A metre ruler lying flat, from x0 to x1 (px), with centimetre ticks every `cmPx`. */
function MetreRuler({ x0, x1, y, cmPx = 8, labelEvery = 5 }: { x0: number; x1: number; y: number; cmPx?: number; labelEvery?: number }) {
  const n = Math.floor((x1 - x0 - 8) / cmPx)
  return <g>
    <rect x={x0} y={y} width={x1 - x0} height={20} rx="3" fill="#fbeec4" stroke="#b68d3c" strokeWidth="1.6" />
    {Array.from({ length: n + 1 }, (_, i) => <path key={i} d={`M${x0 + 4 + i * cmPx} ${y}v${i % labelEvery === 0 ? 8 : 4}`} stroke="#b68d3c" strokeWidth={i % labelEvery === 0 ? 1.5 : 1} />)}
    {Array.from({ length: Math.floor(n / labelEvery) + 1 }, (_, k) => k * labelEvery).map(v => <text key={v} x={x0 + 4 + v * cmPx} y={y + 18} textAnchor="middle" fontSize="12" fontWeight="700" fill="#7d5d1f">{v}</text>)}
  </g>
}

/* ---------- The ripple tank ---------- */

const TX0 = 170, TX1 = 420, TY = 118 // tank inner left, right, water surface
function Tank({ stage, sg = true, hz, hotGen = false, lampHot = false, dimRest = false }: { stage: 'tank' | 'shadows'; sg?: boolean; hz?: string; hotGen?: boolean; lampHot?: boolean; dimRest?: boolean }) {
  const surf = sinePath(TX0 + 30, TX1, TY, 3.2, 26)
  return <g>
    {stage === 'shadows' && <g>
      <LampHead x={295} y={52} hot={lampHot} />
      <path d={`M295 62L${TX0 + 8} 214H${TX1 - 8}Z`} fill={P.light} opacity=".35" />
    </g>}
    <g opacity={dimRest ? 0.45 : 1}>
      {/* legs and the tray with water */}
      <path d={`M${TX0 + 6} ${TY + 18}V${TY + 90}M${TX1 - 6} ${TY + 18}V${TY + 90}`} stroke={kit} strokeWidth="4" />
      <path d={`M${TX0 - 6} ${TY - 12}V${TY + 16}Q${TX0 - 6} ${TY + 22} ${TX0} ${TY + 22}H${TX1}Q${TX1 + 6} ${TY + 22} ${TX1 + 6} ${TY + 16}V${TY - 12}`} fill="rgba(230,240,246,.5)" stroke={kit} strokeWidth="2.4" />
      <path d={`M${TX0 - 3} ${TY}H${TX0 + 30}${surf.replace(/^M[^L]+/, '')}V${TY + 19}H${TX0 - 3}Z`} fill={P.water} opacity=".85" />
      <path d={`M${TX0 - 3} ${TY}H${TX0 + 30}`} stroke={P.waterLine} strokeWidth="2" />
      <path d={surf} stroke={P.waterLine} strokeWidth="2" fill="none" />
      {/* dipper on its arm */}
      <rect x={TX0 + 10} y={TY - 12} width={12} height={16} rx="3" fill="#c9d3db" stroke={kit} strokeWidth="1.8" />
      <path d={`M${TX0 + 16} ${TY - 12}V${TY - 40}H${TX0 - 26}`} stroke={kit} strokeWidth="3" fill="none" />
      <rect x={TX0 - 50} y={TY - 52} width={26} height={24} rx="5" fill={kitFill} stroke={kit} strokeWidth="2" />
    </g>
    {sg && <g opacity={dimRest ? 0.45 : 1}>
      <SignalGen x={20} y={170} reading={hz} hot={hotGen} />
      <Lead pts={[[TX0 - 37, TY - 28], [TX0 - 37, 150], [68, 150], [68, 170]]} />
    </g>}
  </g>
}
/** The screen under the tank, seen from above: pale sheet with shadow lines (bright lines between dark shadows). */
function ShadowScreen({ x, y, w, h, gap, n, ruler = true, numbers = false }: { x: number; y: number; w: number; h: number; gap: number; n: number; ruler?: boolean; numbers?: boolean }) {
  const start = x + (w - gap * (n - 1)) / 2
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="6" fill="#f3f6f8" stroke="#b9c3cc" strokeWidth="1.6" />
    {Array.from({ length: n }, (_, i) => <rect key={i} x={start + i * gap - gap * 0.18} y={y + 5} width={gap * 0.36} height={h - 10} rx={gap * 0.18} fill="#9fb3c2" opacity=".75" />)}
    {numbers && Array.from({ length: n }, (_, i) => <text key={i} x={start + i * gap} y={y - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill={muted}>{i}</text>)}
    {ruler && <MetreRuler x0={x} x1={x + w} y={y + h + 4} />}
  </g>
}

function TankFrame() {
  return <PhysicsDiagram title="A ripple tank: a shallow tray of water on legs. A dipper touching the water is attached to a signal generator; when it is on, the dipper makes ripples.">
    <Tank stage="tank" />
    <Lines x={TX1 + 14} y={TY + 4} lines={['ripple tank']} size={14} />
    <Lines x={TX0 + 26} y={TY - 46} lines={['dipper']} size={14} />
    <Lines x={68} y={250} anchor="middle" lines={['signal generator']} size={13} />
    <Lines x={320} y={TY - 20} anchor="middle" lines={['ripples']} size={13} colour={P.waterLine} />
  </PhysicsDiagram>
}
function FrequencyFrame() {
  return <PhysicsDiagram title="The signal generator is set to 10 Hz, so the dipper makes ripples with a frequency of 10 Hz.">
    <Tank stage="tank" hz="10 Hz" hotGen />
    <Tag x={320} y={62} text="ripples have this frequency" colour={F} />
    <path d="M320 74V108" stroke={F} strokeWidth="1.6" strokeDasharray="5 4" />
    <Lines x={68} y={250} anchor="middle" lines={['set to 10 Hz']} size={13} colour={F} />
  </PhysicsDiagram>
}
function ShadowsFrame() {
  return <PhysicsDiagram title="A lamp above the tank shines through the water and makes shadows of the ripples on a screen below. A metre ruler lies beside the shadows.">
    <Tank stage="shadows" sg={false} />
    <ShadowScreen x={TX0} y={220} w={TX1 - TX0} h={34} gap={24} n={10} />
    <Lines x={332} y={40} lines={['lamp']} size={14} colour={P.lightLine} />
    <Lines x={TX1 + 14} y={TY + 4} lines={['ripple tank']} size={13} colour={muted} />
    <Lines x={TX1 + 14} y={234} lines={['screen']} size={14} />
    <Lines x={TX0 - 14} y={272} anchor="end" lines={['metre ruler']} size={14} colour="#7d5d1f" />
    <Lines x={TX0 - 14} y={230} anchor="end" lines={['shadows']} size={14} colour={muted} />
  </PhysicsDiagram>
}
function LinesFrame() {
  const x = 60, w = 420, gap = 70, start = x + (w - gap * 5) / 2
  return <PhysicsDiagram title="Close-up of the shadow lines on the screen: the distance from one line to the next is one wavelength.">
    <ShadowScreen x={x} y={70} w={w} h={120} gap={gap} n={6} ruler={false} />
    <Measure from={[start + gap * 2, 220]} to={[start + gap * 3, 220]} colour={L} />
    <path d={`M${start + gap * 2} 190V212M${start + gap * 3} 190V212`} stroke={L} strokeWidth="1.5" strokeDasharray="3 4" />
    <Lines x={start + gap * 2.5} y={250} anchor="middle" lines={['one wavelength']} size={15} colour={L} />
    <Lines x={270} y={52} anchor="middle" lines={['each shadow line is one ripple']} size={14} colour={muted} />
  </PhysicsDiagram>
}

/* ---------- Section 3: measuring and calculating ---------- */

// Ten wavelengths drawn as 11 lines, 0 to 10, spread over 0.20 m of the metre ruler (20 cm).
const TEN_X = 70, CM = 20 // px per cm on this close-up ruler
function TenSpan({ y = 90, span = true, one = false }: { y?: number; span?: boolean; one?: boolean }) {
  const gap = CM * 2, start = TEN_X + 10
  return <g>
    <rect x={TEN_X - 20} y={y} width={440} height={80} rx="6" fill="#f3f6f8" stroke="#b9c3cc" strokeWidth="1.6" />
    {Array.from({ length: 11 }, (_, i) => <g key={i}>
      <rect x={start + i * gap - 6} y={y + 6} width={12} height={68} rx="6" fill="#9fb3c2" opacity=".75" />
      <text x={start + i * gap} y={y - 8} textAnchor="middle" fontSize="12" fontWeight="700" fill={muted}>{i}</text>
    </g>)}
    {/* metre ruler, zero lined up with line 0 */}
    <rect x={TEN_X - 20} y={y + 84} width={440} height={24} rx="3" fill="#fbeec4" stroke="#b68d3c" strokeWidth="1.6" />
    {Array.from({ length: 21 }, (_, i) => <path key={i} d={`M${start + i * CM} ${y + 84}v${i % 5 === 0 ? 10 : 6}`} stroke="#b68d3c" strokeWidth={i % 5 === 0 ? 1.6 : 1} />)}
    {[0, 5, 10, 15, 20].map(v => <text key={v} x={start + v * CM} y={y + 104} textAnchor="middle" fontSize="12" fontWeight="700" fill="#7d5d1f">{v === 20 ? '20 cm' : v}</text>)}
    {span && <g>
      <Measure from={[start, y + 128]} to={[start + 10 * gap, y + 128]} colour={L} />
      <Lines x={start + 5 * gap} y={y + 152} anchor="middle" lines={['ten wavelengths = 0.20 m']} size={14} colour={L} />
    </g>}
    {one && <g>
      <Measure from={[start, y + 128]} to={[start + gap, y + 128]} colour={L} />
      <Lines x={start + gap / 2} y={y + 152} anchor="middle" lines={['one']} size={13} colour={L} />
    </g>}
  </g>
}
function TenFrame() {
  return <PhysicsDiagram title="The shadow lines numbered 0 to 10 beside a ruler: the distance across ten wavelengths is 0.20 m.">
    <TenSpan />
    <Lines x={270} y={40} anchor="middle" lines={['measure across ten wavelengths, not one']} size={14} />
  </PhysicsDiagram>
}
function DivideFrame() {
  return <PhysicsDiagram schematic={false} title="Ten wavelengths measure 0.20 m, so one wavelength is 0.20 m ÷ 10 = 0.020 m.">
    <g transform="translate(0 -30) scale(1)">
      <TenSpan y={60} span={false} one />
    </g>
    <Measure from={[TEN_X + 10, 60 - 30 + 128 + 0]} to={[TEN_X + 10 + 400, 60 - 30 + 128]} colour={L} opacity={0.35} />
    <Card x={110} y={200} w={320} h={60} />
    <text x={270} y={238} textAnchor="middle" fontSize="20" fontWeight="750" fill={ink}><Lm>0.20 m</Lm> ÷ 10 = <Lm>0.020 m</Lm></text>
    <Lines x={270} y={284} anchor="middle" lines={['one wavelength is 0.020 m']} size={14} colour={L} />
  </PhysicsDiagram>
}
function SpeedFrame() {
  return <PhysicsDiagram schematic={false} title="Wave speed = frequency × wavelength = 10 × 0.020 = 0.20 m/s.">
    <SignalGen x={40} y={50} reading="10 Hz" hot />
    <Lines x={88} y={134} anchor="middle" lines={['f = 10 Hz']} size={15} colour={F} />
    <g transform="translate(0 0)">
      <rect x={40} y={170} width={96} height={48} rx="6" fill="#f3f6f8" stroke="#b9c3cc" strokeWidth="1.4" />
      {[0, 1].map(i => <rect key={i} x={62 + i * 44} y={176} width={10} height={36} rx="5" fill="#9fb3c2" />)}
      <Measure from={[67, 232]} to={[111, 232]} colour={L} width={2} />
      <Lines x={88} y={258} anchor="middle" lines={['λ = 0.020 m']} size={15} colour={L} />
    </g>
    <Card x={190} y={76} w={320} h={150} />
    <text x={350} y={120} textAnchor="middle" fontSize="22" fontWeight="750" fill={ink}><Vs>v</Vs> = <Fq>f</Fq> × <Lm>λ</Lm></text>
    <text x={350} y={160} textAnchor="middle" fontSize="22" fontWeight="750" fill={ink}><Vs>v</Vs> = <Fq>10</Fq> × <Lm>0.020</Lm></text>
    <text x={350} y={200} textAnchor="middle" fontSize="22" fontWeight="750" fill={ink}><Vs>v</Vs> = <Vs>0.20 m/s</Vs></text>
    <Tick x={494} y={194} />
  </PhysicsDiagram>
}
function SuitableFrame() {
  return <PhysicsDiagram title="The ripple tank is suitable because the shadows let you measure the wavelength without touching and disturbing the waves.">
    <Tank stage="shadows" sg={false} />
    <ShadowScreen x={TX0} y={220} w={TX1 - TX0} h={34} gap={24} n={10} ruler={false} />
    <Hand x={330} y={96} rotate={60} s={0.9} />
    <CrossMark x={370} y={70} />
    <Tick x={TX0 - 24} y={237} />
    <Lines x={TX0 - 44} y={233} anchor="end" lines={['measure', 'the shadows']} size={13} colour={P.useful} />
    <Lines x={450} y={40} anchor="middle" lines={['do not touch the water']} size={13} colour={P.wasted} />
    <Lines x={80} y={150} anchor="middle" lines={['measure without', 'disturbing', 'the waves']} size={14} />
  </PhysicsDiagram>
}

/* ---------- Section 4: the vibrating string ---------- */

const SX0 = 104, SX1 = 450, SY = 150, BENCH = 196 // string from the vibration generator pin to the pulley top
function StandingWave({ x0 = SX0, x1 = SX1, y = SY, loops, a = 26, colour = stringColour, fill = true }: { x0?: number; x1?: number; y?: number; loops: number; a?: number; colour?: string; fill?: boolean }) {
  const n = 120, up: string[] = [], down: string[] = []
  for (let i = 0; i <= n; i++) {
    const x = x0 + (x1 - x0) * i / n, d = a * Math.sin(Math.PI * loops * i / n)
    up.push(`${i ? 'L' : 'M'}${x.toFixed(1)} ${(y - d).toFixed(1)}`); down.push(`${i ? 'L' : 'M'}${x.toFixed(1)} ${(y + d).toFixed(1)}`)
  }
  return <g>
    {fill && <path d={`${up.join('')}${down.slice().reverse().map(s => 'L' + s.slice(1)).join('')}Z`} fill="#f1e6d9" opacity=".7" />}
    <path d={`M${x0} ${y}H${x1}`} stroke={colour} strokeWidth="1.2" opacity=".35" />
    <path d={up.join('')} stroke={colour} strokeWidth="3" fill="none" />
    <path d={down.join('')} stroke={colour} strokeWidth="3" fill="none" opacity=".55" />
  </g>
}
function StringRig({ loops = 0, hz, hotGen = false, masses = true, dropZone = false }: { loops?: number; hz?: string; hotGen?: boolean; masses?: boolean; dropZone?: boolean }) {
  return <g>
    <path d={`M14 ${BENCH}H${SX1 + 8}`} stroke={P.panelLine} strokeWidth="5" />
    <path d={`M20 ${BENCH + 3}V${BENCH + 70}M${SX1 - 10} ${BENCH + 3}V${BENCH + 70}`} stroke={P.panelLine} strokeWidth="5" />
    {/* vibration generator with its pin */}
    <rect x={70} y={SY + 4} width={48} height={BENCH - SY - 4} rx="8" fill={kitFill} stroke={kit} strokeWidth="2.2" />
    <path d={`M${SX0} ${SY + 4}V${SY}`} stroke={kit} strokeWidth="4" />
    <circle cx={SX0} cy={SY} r="4" fill={kit} />
    {/* pulley clamped to the bench edge */}
    <path d={`M${SX1 - 4} ${BENCH}V${SY + 10}`} stroke={kit} strokeWidth="5" />
    <circle cx={SX1 + 8} cy={SY + 8} r="12" fill="white" stroke={kit} strokeWidth="2.4" />
    <circle cx={SX1 + 8} cy={SY + 8} r="3" fill={kit} />
    {/* the string, then down over the pulley to the masses */}
    {loops > 0 ? <StandingWave loops={loops} /> : <path d={`M${SX0} ${SY}H${SX1 + 6}`} stroke={stringColour} strokeWidth="2.6" />}
    <path d={`M${SX1 + 6} ${SY - 4}Q${SX1 + 20} ${SY - 2} ${SX1 + 20} ${SY + 8}V${BENCH + 34}`} stroke={stringColour} strokeWidth="2.6" fill="none" />
    {masses && <g>
      <path d={`M${SX1 + 20} ${BENCH + 34}V${BENCH + 42}`} stroke={kit} strokeWidth="2" />
      {[0, 1, 2].map(i => <rect key={i} x={SX1 + 6} y={BENCH + 42 + i * 14} width={28} height={12} rx="3" fill="#c9d3db" stroke={kit} strokeWidth="1.8" />)}
    </g>}
    {dropZone && <rect x={SX1 - 4} y={BENCH + 86} width={48} height={12} rx="6" fill={P.wastedFill} stroke={P.wasted} strokeWidth="1.8" strokeDasharray="5 4" />}
    <SignalGen x={20} y={40} reading={hz} hot={hotGen} />
    <Lead pts={[[68, 98], [68, 120], [94, 120], [94, SY + 4]]} />
  </g>
}
function StringFrame() {
  return <PhysicsDiagram title="The string set-up: a vibration generator, connected to a signal generator, shakes one end of a string. The string runs over a pulley at the bench edge and holds hanging masses.">
    <StringRig />
    <Lines x={94} y={BENCH + 24} anchor="middle" lines={['vibration generator']} size={13} />
    <Lines x={280} y={SY - 14} anchor="middle" lines={['string']} size={14} colour={stringColour} />
    <Lines x={SX1 - 4} y={SY - 28} anchor="middle" lines={['pulley']} size={14} />
    <Lines x={SX1 - 20} y={BENCH + 64} anchor="end" lines={['masses']} size={14} />
    <Lines x={128} y={64} lines={['signal generator']} size={13} />
  </PhysicsDiagram>
}
function ClearFrame() {
  return <PhysicsDiagram title="The string vibrating in a clear pattern. Adjust the frequency on the signal generator until the wave on the string is clear.">
    <StringRig loops={4} hz="25 Hz" hotGen />
    <Tag x={270} y={272} text="adjust the frequency until the wave is clear" colour={F} />
    <Lines x={128} y={64} lines={['turn the dial']} size={13} colour={F} />
  </PhysicsDiagram>
}
function LoopsFrame() {
  const seg = (SX1 - SX0) / 4
  return <PhysicsDiagram title="Each loop on the string is half a wavelength. Loops are numbered 1 to 4; two loops make one wavelength. An inset shows 3 loops, which is 1.5 wavelengths.">
    <StandingWave loops={4} y={120} a={30} />
    {[0, 1, 2, 3].map(i => <g key={i}>
      <circle cx={SX0 + seg * (i + 0.5)} cy={120} r="12" fill="white" stroke={ink} strokeWidth="2" />
      <text x={SX0 + seg * (i + 0.5)} y={125} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{i + 1}</text>
    </g>)}
    <path d={`M${SX0} 158V178M${SX0 + 2 * seg} 158V178`} stroke={L} strokeWidth="1.5" strokeDasharray="3 4" />
    <Measure from={[SX0, 172]} to={[SX0 + 2 * seg, 172]} colour={L} stops={false} />
    <Lines x={SX0 + seg} y={196} anchor="middle" lines={['2 loops = one wavelength']} size={14} colour={L} />
    <Lines x={(SX0 + SX1) / 2} y={62} anchor="middle" lines={['each loop is half a wavelength']} size={14} colour={muted} />
    {/* inset: 3 loops */}
    <rect x={150} y={218} width={240} height={70} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <StandingWave x0={166} x1={292} y={252} loops={3} a={14} />
    <Lines x={306} y={249} lines={['3 loops =', '1.5 wavelengths']} size={13} colour={L} />
  </PhysicsDiagram>
}
function LengthFrame() {
  return <PhysicsDiagram schematic={false} title="The vibrating string is 0.80 m long with 4 loops, which is 2 wavelengths. One wavelength is 0.80 ÷ 2 = 0.40 m.">
    <StandingWave loops={4} y={90} a={30} />
    <MetreRuler x0={SX0 - 4} x1={SX1 + 5} y={134} cmPx={(SX1 - SX0) / 80} labelEvery={10} />
    <Measure from={[SX0, 176]} to={[SX1, 176]} colour={ink} />
    <Lines x={(SX0 + SX1) / 2} y={200} anchor="middle" lines={['whole string 0.80 m, 4 loops = 2 wavelengths']} size={14} />
    <Card x={150} y={216} w={240} h={56} />
    <text x={270} y={251} textAnchor="middle" fontSize="20" fontWeight="750" fill={ink}>0.80 ÷ 2 = <Lm>0.40 m</Lm></text>
  </PhysicsDiagram>
}

/* ---------- Section 5: safety ---------- */

function Mop({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x} ${y}L${x + 30} ${y - 70}`} stroke="#a57a45" strokeWidth="4" />
    <path d={`M${x - 14} ${y}Q${x} ${y - 12} ${x + 14} ${y}L${x + 16} ${y + 10}H${x - 16}Z`} fill="#e6edf2" stroke={kit} strokeWidth="1.8" />
  </g>
}
function Plug({ x, y }: { x: number; y: number }) {
  return <g>
    <rect x={x} y={y} width={30} height={40} rx="6" fill="white" stroke={kit} strokeWidth="2" />
    <rect x={x + 8} y={y + 10} width={4} height={10} fill={kit} /><rect x={x + 18} y={y + 10} width={4} height={10} fill={kit} />
  </g>
}
function SafeWater() {
  return <PhysicsDiagram title="Water near electrics: keep the plug and signal generator away from the water. If water is spilled, switch off and unplug first, then wipe it up.">
    <Tank stage="tank" sg={false} />
    <ellipse cx={300} cy={TY + 104} rx="40" ry="8" fill={P.water} stroke={P.waterLine} strokeWidth="1.6" />
    <Mop x={350} y={TY + 100} />
    <rect x={436} y={70} width={92} height={14} rx="4" fill="#e8cfa6" stroke="#a57a45" strokeWidth="1.8" />
    <SignalGen x={434} y={12} />
    <Plug x={496} y={124} />
    <Lead pts={[[TX0 - 37, TY - 52], [TX0 - 37, 40], [434, 40]]} />
    <Lead pts={[[520, 70], [520, 100], [511, 100], [511, 124]]} />
    <Lines x={482} y={186} anchor="middle" lines={['kept up high,', 'away from water']} size={12} colour={muted} />
    <Tag x={400} y={276} text="keep water away from electrics" colour={P.wasted} />
    <Lines x={20} y={214} lines={['spill? switch off', 'and unplug first,', 'then wipe up']} size={14} />
  </PhysicsDiagram>
}
function Goggles({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 34} ${y}H${x + 34}`} stroke={kit} strokeWidth="4" />
    <rect x={x - 28} y={y - 12} width={24} height={22} rx="9" fill="#dff1fb" stroke={kit} strokeWidth="2.2" />
    <rect x={x + 4} y={y - 12} width={24} height={22} rx="9" fill="#dff1fb" stroke={kit} strokeWidth="2.2" />
  </g>
}
function Foot({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y}Q${x - 2} ${y - 16} ${x + 10} ${y - 16}H${x + 22}Q${x + 38} ${y - 12} ${x + 40} ${y}Z`} fill="#6b7f92" stroke="#4f5d69" strokeWidth="1.8" />
}
function SafeMasses() {
  return <PhysicsDiagram title="Hanging masses can fall if the string slips or snaps. Wear goggles and keep your feet out of the space underneath.">
    <StringRig dropZone />
    <Foot x={SX1 - 70} y={BENCH + 98} />
    <Goggles x={250} y={80} />
    <Lines x={250} y={116} anchor="middle" lines={['goggles, feet clear']} size={14} colour={P.useful} />
    <Lines x={SX1 - 20} y={BENCH + 40} anchor="end" lines={['masses', 'can fall']} size={14} colour={P.wasted} />
  </PhysicsDiagram>
}
function SafeLamp() {
  return <PhysicsDiagram title="The lamp above the ripple tank gets hot, so do not touch it. Follow your teacher's instructions and risk assessment.">
    <LampHead x={130} y={120} hot />
    <Tag x={130} y={186} text="hot: do not touch" colour={P.hot} />
    <Card x={250} y={70} w={260} h={120} />
    <Lines x={380} y={116} anchor="middle" lines={["follow your teacher's", 'instructions']} size={16} />
    <Lines x={380} y={164} anchor="middle" lines={['and risk assessment']} size={14} colour={muted} />
    <Lines x={270} y={250} anchor="middle" lines={['this lesson prepares you: you still do the real practical']} size={13} weight={600} colour={muted} />
  </PhysicsDiagram>
}

/* ---------- Question visual ---------- */

function QuestionString() {
  return <PhysicsDiagram title="A vibrating string between a vibration generator and a pulley, with a metre ruler beside it marking the whole vibrating length as 1.2 m.">
    <StringRig loops={4} masses />
    <Measure from={[SX0, SY - 62]} to={[SX1, SY - 62]} colour={ink} />
    <path d={`M${SX0} ${SY - 8}V${SY - 70}M${SX1} ${SY - 8}V${SY - 70}`} stroke={muted} strokeWidth="1.4" strokeDasharray="4 4" />
    <rect x={(SX0 + SX1) / 2 - 34} y={SY - 76} width={68} height={28} rx="14" fill="white" stroke={ink} strokeWidth="1.8" />
    <text x={(SX0 + SX1) / 2} y={SY - 56} textAnchor="middle" fontSize="16" fontWeight="750" fill={ink}>1.2 m</text>
  </PhysicsDiagram>
}

export function WavePracVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'waveprac-tank': return <TankFrame />
    case 'waveprac-frequency': return <FrequencyFrame />
    case 'waveprac-shadows': return <ShadowsFrame />
    case 'waveprac-lines': return <LinesFrame />
    case 'waveprac-ten': return <TenFrame />
    case 'waveprac-divide': return <DivideFrame />
    case 'waveprac-speed': return <SpeedFrame />
    case 'waveprac-suitable': return <SuitableFrame />
    case 'waveprac-string': return <StringFrame />
    case 'waveprac-clear': return <ClearFrame />
    case 'waveprac-loops': return <LoopsFrame />
    case 'waveprac-length': return <LengthFrame />
    case 'waveprac-safe-water': return <SafeWater />
    case 'waveprac-safe-masses': return <SafeMasses />
    case 'waveprac-safe-lamp': return <SafeLamp />
    case 'waveprac-q-string': return <QuestionString />
    default: return null
  }
}
