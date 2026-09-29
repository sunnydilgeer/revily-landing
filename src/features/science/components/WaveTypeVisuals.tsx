import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, type Pt } from './PhysicsKit'
import { Arrow } from './GasParticleVisuals'
import { Hand, Tag, Num, Card } from './EnergyStoreVisuals'
import { Stopwatch } from './PowerVisuals'

/*
 * Physics Lesson 53: Transverse and longitudinal waves. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'wavetype-' and is routed from CellBiologyVisuals.tsx.
 *
 * The wave colour code (exported, and used again by the wave speed and wave practical lessons):
 *   the wave itself blue; the direction the wave travels (and the energy it carries) vermilion;
 *   vibrations, displacement and amplitude violet; wavelength green; frequency gold; time and period indigo.
 * Particles are plain circles as in the particle-model lessons. A spring (slinky) is drawn as soft loops.
 * The labelled wave (section 4) sits on axes "Displacement" up and "Distance" along; the distance axis is the
 * rest position. Amplitude always runs from the rest position to a crest; wavelength from a crest to the next crest.
 */
const { ink, muted } = P
export const waveColours = {
  line: '#2f7fb5', fill: '#d7ebf7',
  travel: P.current,
  vibrate: P.pd, vibrateFill: P.pdFill,
  wavelength: '#3f8a5f', wavelengthFill: '#dcefe3',
  frequency: '#a8760a', frequencyFill: P.light,
  period: P.gravitationalLine, periodFill: P.gravitational,
}
const W = waveColours
const r1 = (n: number) => Math.round(n * 10) / 10

/* ---------- Shared wave pieces (exported) ---------- */

/** A smooth sine wave: rest line at y0, amplitude a (px), wavelength lam (px), from x0 to x1, starting at `phase` (0 = rising through the rest line). */
export function sinePath(x0: number, x1: number, y0: number, a: number, lam: number, phase = 0) {
  const pts: string[] = []
  const n = Math.max(8, Math.ceil((x1 - x0) / 3))
  for (let i = 0; i <= n; i++) {
    const x = x0 + (x1 - x0) * i / n
    const y = y0 - a * Math.sin(2 * Math.PI * ((x - x0) / lam + phase))
    pts.push(`${i ? 'L' : 'M'}${r1(x)} ${r1(y)}`)
  }
  return pts.join('')
}
export function Sine({ x0, x1, y0, a, lam, phase = 0, colour = W.line, width = 3.4, opacity = 1, dashed = false }: { x0: number; x1: number; y0: number; a: number; lam: number; phase?: number; colour?: string; width?: number; opacity?: number; dashed?: boolean }) {
  return <path d={sinePath(x0, x1, y0, a, lam, phase)} stroke={colour} strokeWidth={width} fill="none" opacity={opacity} strokeDasharray={dashed ? '7 6' : undefined} />
}
/** A double-headed measuring arrow with end stops. */
export function Measure({ from, to, colour, width = 2.4, stops = true, opacity = 1 }: { from: Pt; to: Pt; colour: string; width?: number; stops?: boolean; opacity?: number }) {
  const dx = to[0] - from[0], dy = to[1] - from[1], len = Math.hypot(dx, dy) || 1, nx = -dy / len * 8, ny = dx / len * 8
  const mid: Pt = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2]
  return <g opacity={opacity}>
    {stops && <path d={`M${r1(from[0] - nx)} ${r1(from[1] - ny)}L${r1(from[0] + nx)} ${r1(from[1] + ny)}M${r1(to[0] - nx)} ${r1(to[1] - ny)}L${r1(to[0] + nx)} ${r1(to[1] + ny)}`} stroke={colour} strokeWidth="2" />}
    <Arrow from={mid} to={from} colour={colour} width={width} />
    <Arrow from={mid} to={to} colour={colour} width={width} />
  </g>
}
/** A slinky spring as soft loops along a centre line. `centre(u)` gives the centre point for u in [0, 1]. */
export function Coil({ centre, loops, r = 16, colour = W.line, width = 2.6 }: { centre: (u: number) => Pt; loops: number; r?: number; colour?: string; width?: number }) {
  const n = loops * 24, pts: string[] = []
  for (let i = 0; i <= n; i++) {
    const u = i / n, t = 2 * Math.PI * loops * u, [cx, cy] = centre(u)
    pts.push(`${i ? 'L' : 'M'}${r1(cx - r * 0.45 * Math.sin(t))} ${r1(cy - r * Math.cos(t))}`)
  }
  return <path d={pts.join('')} stroke={colour} strokeWidth={width} fill="none" />
}
/** A round particle. */
export function Dot({ x, y, r = 9, fill = '#d3e3f3', line = '#4f7aa3', opacity = 1 }: { x: number; y: number; r?: number; fill?: string; line?: string; opacity?: number }) {
  return <circle cx={x} cy={y} r={r} fill={fill} stroke={line} strokeWidth="1.8" opacity={opacity} />
}
/** A small loudspeaker facing right; (x, y) is the middle of its cone. */
export function Speaker({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-24} y={-12} width={14} height={24} rx="3" fill="#dfe6eb" stroke="#5a6b79" strokeWidth="2" />
    <path d="M-10 -12L10 -28V28L-10 12Z" fill="#eef2f5" stroke="#5a6b79" strokeWidth="2" />
  </g>
}

/* ---------- Section 2: waves transfer energy, not matter ---------- */

const pulse = (x: number, at: number, h = 34, w = 44) => h * Math.exp(-((x - at) ** 2) / (2 * w * w))
function Row({ y, at, mark, dots = 17, x0 = 60, gap = 26, arrows = false, opacity = 1 }: { y: number; at: number; mark?: number; dots?: number; x0?: number; gap?: number; arrows?: boolean; opacity?: number }) {
  return <g opacity={opacity}>
    {Array.from({ length: dots }, (_, i) => {
      const x = x0 + i * gap, dy = pulse(x, at), marked = i === mark
      return <g key={i}>
        {arrows && i % 3 === 1 && dy > 6 && <Measure from={[x, y - dy - 16]} to={[x, y + 12]} colour={W.vibrate} width={1.8} stops={false} />}
        <Dot x={x} y={y - dy} r={marked ? 10 : 8.5} fill={marked ? P.hotFill : undefined} line={marked ? P.hot : undefined} />
      </g>
    })}
  </g>
}
function EnergyNotMatter() {
  return <PhysicsDiagram title="A row of particles in a medium with a wave pulse passing along it. The energy travels along the row while each particle only vibrates up and down.">
    <Row y={160} at={260} arrows />
    <Lines x={260} y={84} anchor="middle" lines={['particles vibrate']} size={14} colour={W.vibrate} />
    <Arrow from={[80, 222]} to={[470, 222]} colour={W.travel} width={4} />
    <Lines x={275} y={252} anchor="middle" lines={['energy travels this way']} size={15} colour={W.travel} />
    <Lines x={275} y={282} anchor="middle" lines={['no matter is carried along']} size={13} weight={600} colour={muted} />
  </PhysicsDiagram>
}
function Stay() {
  const rows = [{ y: 90, at: 150 }, { y: 172, at: 270 }, { y: 254, at: 390 }]
  const mark = 8, mx = 60 + mark * 26
  return <PhysicsDiagram title="The same row of particles at three moments. The pulse moves along to the right, but the marked particle stays in the same place, only moving up and down.">
    <path d={`M${mx} 34V272`} stroke={P.hot} strokeWidth="1.6" strokeDasharray="4 5" />
    {rows.map((r, i) => <g key={i}>
      <Row y={r.y} at={r.at} mark={mark} dots={15} />
      <text x={30} y={r.y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>{i + 1}</text>
    </g>)}
    <Arrow from={[150, 36]} to={[390, 36]} colour={W.travel} width={3} />
    <Lines x={400} y={41} lines={['pulse moves on']} size={13} colour={W.travel} />
    <Tag x={mx + 2} y={288} text="the particle stays put" colour={P.hot} />
  </PhysicsDiagram>
}
function Twig({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 22} ${y + 2}L${x + 22} ${y - 3}`} stroke="#8a6443" strokeWidth="5" /><path d={`M${x + 4} ${y}l8 -8`} stroke="#8a6443" strokeWidth="3" /></g>
}
function Guitar({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y}) rotate(-28)`}>
    <path d="M-10 -8H70V8H-10Z" fill="#c69a6a" stroke="#8a6443" strokeWidth="2" />
    <rect x={68} y={-11} width={22} height={22} rx="4" fill="#a57a45" stroke="#7a5a33" strokeWidth="2" />
    <path d="M-30 -30C-12 -34 -6 -18 0 -14C6 -30 30 -32 30 0C30 32 6 30 0 14C-6 18 -12 34 -30 30C-56 28 -60 -26 -30 -30Z" transform="translate(-26 0)" fill="#f0c98f" stroke="#a57a45" strokeWidth="2.2" />
    <circle cx={-26} cy={0} r={9} fill="#6d5236" />
    <path d="M-48 -3H80M-48 3H80" stroke="#7a5a33" strokeWidth="1" />
  </g>
}
function Examples() {
  return <PhysicsDiagram title="Left: ripples spread across a pond but the twig only bobs up and down; the ripples do not carry it away. Right: sound spreads out from a guitar, but no wind blows the air away.">
    <rect x={20} y={40} width={240} height={200} rx="22" fill={P.panel} stroke={P.panelLine} strokeWidth="1.6" />
    {[36, 64, 92].map((rx, i) => <ellipse key={rx} cx={140} cy={150} rx={rx} ry={rx * 0.38} fill="none" stroke={W.line} strokeWidth="2.4" opacity={1 - i * 0.25} />)}
    <ellipse cx={140} cy={150} rx={110} ry={46} fill={P.water} opacity=".35" />
    <Twig x={176} y={130} />
    <Measure from={[210, 104]} to={[210, 146]} colour={W.vibrate} width={2} stops={false} />
    <Lines x={140} y={272} anchor="middle" lines={['ripples do not', 'carry the twig away']} size={13} />
    <rect x={280} y={40} width={240} height={200} rx="22" fill={P.panel} stroke={P.panelLine} strokeWidth="1.6" />
    <Guitar x={350} y={160} />
    {[26, 44, 62].map((r, i) => <path key={r} d={`M${420 + r * 0.5} ${116 - r * 0.8}Q${420 + r * 1.1} 116 ${420 + r * 0.5} ${116 + r * 0.8}`} stroke={W.line} strokeWidth="2.4" fill="none" opacity={1 - i * 0.22} />)}
    <Tag x={446} y={214} text="no wind" colour={muted} />
    <Lines x={400} y={272} anchor="middle" lines={['sound does not', 'carry the air away']} size={13} />
  </PhysicsDiagram>
}

/* ---------- Section 3: transverse and longitudinal ---------- */

function Transverse() {
  const x0 = 70, x1 = 470, y0 = 150, lam = 200, a = 42
  return <PhysicsDiagram title="A spring wiggled up and down makes a transverse wave: the vibrations go up and down, at right angles to the direction the wave travels along the spring.">
    <Coil centre={u => { const x = x0 + (x1 - x0) * u; return [x, y0 - a * Math.sin(2 * Math.PI * (x - x0) / lam)] }} loops={34} r={11} />
    <Hand x={x0 - 24} y={y0} rotate={0} s={0.9} />
    <Measure from={[170, 60]} to={[170, 120]} colour={W.vibrate} width={3} stops={false} />
    <Lines x={186} y={74} lines={['vibrations go', 'up and down']} size={14} colour={W.vibrate} />
    <Arrow from={[150, 244]} to={[430, 244]} colour={W.travel} width={4} />
    <Lines x={290} y={276} anchor="middle" lines={['wave travels this way']} size={15} colour={W.travel} />
    {/* right-angle mark between the two directions */}
    <Arrow from={[440, 96]} to={[440, 40]} colour={W.vibrate} width={2.6} />
    <Arrow from={[440, 96]} to={[500, 96]} colour={W.travel} width={2.6} />
    <path d="M440 82H454V96" stroke={ink} strokeWidth="1.8" fill="none" />
    <Lines x={470} y={120} anchor="middle" lines={['at right angles']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}
function Bulb({ x, y }: { x: number; y: number }) {
  return <g>
    <circle cx={x} cy={y} r="30" fill={P.light} opacity=".6" />
    <path d={`M${x - 14} ${y + 4}C${x - 20} ${y - 18} ${x + 20} ${y - 18} ${x + 14} ${y + 4}Q${x + 8} ${y + 10} ${x + 8} ${y + 16}H${x - 8}Q${x - 8} ${y + 10} ${x - 14} ${y + 4}Z`} fill="#fff6d6" stroke={P.lightLine} strokeWidth="2" />
    <rect x={x - 8} y={y + 16} width={16} height={10} rx="2" fill="#c9d3db" stroke="#7d8e9c" strokeWidth="1.6" />
  </g>
}
function TransverseExamples() {
  return <PhysicsDiagram title="Examples of transverse waves: light and all other electromagnetic waves, ripples on water, and a wave on a string.">
    {/* light */}
    <Bulb x={70} y={110} />
    <Sine x0={104} x1={170} y0={110} a={9} lam={22} colour={P.lightLine} width={2.6} />
    <Lines x={100} y={214} anchor="middle" lines={['light and all', 'electromagnetic', 'waves']} size={14} />
    {/* ripples */}
    <path d={`${sinePath(200, 340, 130, 10, 46)}L340 170Q270 176 200 170Z`} fill={P.water} opacity=".6" />
    <Sine x0={200} x1={340} y0={130} a={10} lam={46} />
    <Lines x={270} y={214} anchor="middle" lines={['ripples on water']} size={14} />
    {/* string */}
    <rect x={500} y={84} width={12} height={56} rx="3" fill="#dfe6eb" stroke="#5a6b79" strokeWidth="2" />
    <Sine x0={384} x1={500} y0={112} a={16} lam={58} colour={P.resistance} width={2.8} />
    <Hand x={362} y={112} s={0.8} />
    <Lines x={440} y={214} anchor="middle" lines={['a wave on', 'a string']} size={14} />
  </PhysicsDiagram>
}
/** Centre-line positions for a longitudinal coil: loops bunch up at compressions. */
const longCentre = (x0: number, x1: number, y: number, waves: number, squash = 0.55) => (u: number): Pt => {
  const k = 2 * Math.PI * waves
  return [x0 + (x1 - x0) * (u + squash * Math.sin(k * u) / k), y]
}
function Longitudinal() {
  const x0 = 70, x1 = 480, y = 140
  return <PhysicsDiagram title="A spring pushed in and out along its length makes a longitudinal wave: the vibrations are in the same direction as the wave travels.">
    <Coil centre={longCentre(x0, x1, y, 3, 0.7)} loops={32} r={24} />
    <Hand x={x0 - 26} y={y} s={0.9} />
    <Measure from={[36, 206]} to={[110, 206]} colour={W.vibrate} width={3} stops={false} />
    <Lines x={128} y={211} lines={['vibrations in the same direction']} size={14} colour={W.vibrate} />
    <Arrow from={[150, 244]} to={[430, 244]} colour={W.travel} width={4} />
    <Lines x={290} y={276} anchor="middle" lines={['wave travels this way']} size={15} colour={W.travel} />
  </PhysicsDiagram>
}
function Compress() {
  const x0 = 70, x1 = 480, y = 120, waves = 3
  // Compressions are where the loops bunch up: sin(k u) ≈ 0 with cos(k u) = −1, i.e. u = (n + ½)/waves.
  const cAt = (n: number) => x0 + (x1 - x0) * (n + 0.5) / waves
  const rAt = (n: number) => x0 + (x1 - x0) * n / waves
  return <PhysicsDiagram title="A longitudinal wave on a spring has compressions, where the loops are squashed together, and rarefactions, where they are spread out. Sound is a longitudinal wave.">
    <Coil centre={longCentre(x0, x1, y, waves, 0.7)} loops={32} r={24} />
    {[0, 1, 2].map(n => <g key={n}>
      <rect x={cAt(n) - 22} y={y - 34} width={44} height={68} rx="12" fill={W.vibrateFill} />
    </g>)}
    <Coil centre={longCentre(x0, x1, y, waves, 0.7)} loops={32} r={24} />
    <path d={`M${cAt(1)} ${y - 36}V${y - 56}`} stroke={W.vibrate} strokeWidth="1.6" />
    <Lines x={cAt(1)} y={y - 62} anchor="middle" lines={['compression']} size={14} colour={W.vibrate} />
    <path d={`M${rAt(2)} ${y + 32}V${y + 52}`} stroke={ink} strokeWidth="1.6" />
    <Lines x={rAt(2)} y={y + 70} anchor="middle" lines={['rarefaction']} size={14} />
    <Speaker x={96} y={236} s={0.9} />
    {[20, 34, 48].map(r => <path key={r} d={`M${110 + r * 0.6} ${236 - r * 0.8}Q${110 + r * 1.2} 236 ${110 + r * 0.6} ${236 + r * 0.8}`} stroke={W.line} strokeWidth="2.2" fill="none" />)}
    <Lines x={180} y={242} lines={['a sound wave is longitudinal']} size={14} />
  </PhysicsDiagram>
}

/* ---------- Section 4: describing a wave ---------- */

// One labelled wave: rest line (the distance axis) at Y0; crests at X0 + LAM/4 + n·LAM.
const X0 = 80, X1 = 500, Y0 = 150, A = 70, LAM = 180
const crest = (n: number): Pt => [X0 + LAM / 4 + n * LAM, Y0 - A]
const trough = (n: number): Pt => [X0 + 3 * LAM / 4 + n * LAM, Y0 + A]
function WaveAxes({ restLabel = true }: { restLabel?: boolean }) {
  return <g>
    <path d={`M${X0} ${Y0 + A + 34}V${Y0 - A - 34}`} stroke={ink} strokeWidth="2" />
    <path d={`M${X0 - 5} ${Y0 - A - 26}L${X0} ${Y0 - A - 38}L${X0 + 5} ${Y0 - A - 26}Z`} fill={ink} stroke={ink} />
    <path d={`M${X0} ${Y0}H${X1 + 14}`} stroke={ink} strokeWidth="2" strokeDasharray={restLabel ? '7 5' : undefined} />
    <path d={`M${X1 + 8} ${Y0 - 5}L${X1 + 20} ${Y0}L${X1 + 8} ${Y0 + 5}Z`} fill={ink} stroke={ink} />
    <text x={X0 + 8} y={Y0 - A - 26} fontSize="13" fontWeight="700" fill={ink}>Displacement</text>
    <text x={X1 + 18} y={Y0 + 24} textAnchor="end" fontSize="13" fontWeight="700" fill={ink}>Distance</text>
    {restLabel && <text x={X0 - 8} y={Y0 + 4} textAnchor="end" fontSize="12" fontWeight="700" fill={muted}><tspan x={X0 - 8} dy="-6">rest</tspan><tspan x={X0 - 8} dy="14">position</tspan></text>}
  </g>
}
function LabelledWave({ show, title, extra, dimWave = false }: { show: ('displacement' | 'amplitude' | 'wavelength')[]; title: string; extra?: ReactNode; dimWave?: boolean }) {
  const has = (k: 'displacement' | 'amplitude' | 'wavelength') => show.includes(k)
  const dx = X0 + LAM * 1.1, dy = Y0 - A * Math.sin(2 * Math.PI * 1.1)
  return <PhysicsDiagram schematic={false} title={title}>
    <WaveAxes />
    <Sine x0={X0} x1={X1} y0={Y0} a={A} lam={LAM} opacity={dimWave ? 0.5 : 1} />
    {has('displacement') && <g>
      <Measure from={[dx, Y0]} to={[dx, r1(dy)]} colour={W.vibrate} width={2.4} stops={false} />
      <circle cx={dx} cy={r1(dy)} r="4.5" fill={W.vibrate} />
      <Lines x={dx + 12} y={Y0 - 12} lines={['displacement']} size={14} colour={W.vibrate} />
    </g>}
    {has('amplitude') && <g>
      <Measure from={[crest(0)[0], Y0]} to={crest(0)} colour={W.vibrate} width={2.6} />
      <Lines x={crest(0)[0] + 14} y={Y0 - A / 2 + 5} lines={['amplitude']} size={15} colour={W.vibrate} />
      <Lines x={crest(1)[0]} y={Y0 - A - 12} anchor="middle" lines={['crest']} size={14} />
      <Lines x={trough(0)[0]} y={Y0 + A + 24} anchor="middle" lines={['trough']} size={14} />
    </g>}
    {has('wavelength') && <g>
      <path d={`M${crest(1)[0]} ${Y0 - A - 4}V${Y0 - A - 30}M${crest(2)[0]} ${Y0 - A - 4}V${Y0 - A - 30}`} stroke={W.wavelength} strokeWidth="1.6" strokeDasharray="3 4" />
      <Measure from={[crest(1)[0], Y0 - A - 22]} to={[crest(2)[0], Y0 - A - 22]} colour={W.wavelength} width={2.6} stops={false} />
      <rect x={(crest(1)[0] + crest(2)[0]) / 2 - 46} y={Y0 - A - 36} width={92} height={24} rx="12" fill="white" />
      <Lines x={(crest(1)[0] + crest(2)[0]) / 2} y={Y0 - A - 19} anchor="middle" lines={['wavelength']} size={14} colour={W.wavelength} />
      <path d={`M${trough(0)[0]} ${Y0 + A + 4}V${Y0 + A + 28}M${trough(1)[0]} ${Y0 + A + 4}V${Y0 + A + 28}`} stroke={W.wavelength} strokeWidth="1.4" strokeDasharray="3 4" opacity=".5" />
      <Measure from={[trough(0)[0], Y0 + A + 20]} to={[trough(1)[0], Y0 + A + 20]} colour={W.wavelength} width={2} stops={false} opacity={0.45} />
    </g>}
    {extra}
  </PhysicsDiagram>
}

function Frequency() {
  const mx = 360
  return <PhysicsDiagram schematic={false} title="Frequency: the number of complete waves passing a fixed point each second. Here 3 waves pass the marker in 1 second, so the frequency is 3 Hz. 1 Hz is 1 wave per second.">
    <Sine x0={40} x1={500} y0={120} a={46} lam={120} />
    <Arrow from={[40, 44]} to={[140, 44]} colour={W.travel} width={3} />
    <Lines x={150} y={49} lines={['wave travels']} size={13} colour={W.travel} />
    <path d={`M${mx} 56V190`} stroke={W.frequency} strokeWidth="3" />
    <circle cx={mx} cy={56} r="7" fill={W.frequency} />
    <Lines x={mx + 12} y={62} lines={['fixed point']} size={13} colour={W.frequency} />
    <Card x={40} y={206} w={300} h={80} />
    <Stopwatch x={84} y={246} r={24} frac={1} />
    <text x={124} y={240} fontSize="15" fontWeight="750" fill={W.frequency}>3 waves pass in 1 s</text>
    <text x={124} y={266} fontSize="15" fontWeight="750" fill={ink}>frequency = <tspan fill={W.frequency}>3 Hz</tspan></text>
    <rect x={360} y={222} width={160} height={46} rx="23" fill="white" stroke={W.frequency} strokeWidth="2" />
    <Lines x={440} y={242} anchor="middle" lines={['1 Hz =', '1 wave per second']} size={13} colour={W.frequency} />
  </PhysicsDiagram>
}
function Period() {
  const x0 = 60, lam = 150, y0 = 120, a = 50
  return <PhysicsDiagram schematic={false} title="The period is the time taken for one complete wave to pass a point, measured in seconds. One complete wave is shaded.">
    <path d={`${sinePath(x0 + lam, x0 + 2 * lam, y0, a, lam)}L${x0 + 2 * lam} ${y0}L${x0 + lam} ${y0}Z`} fill={W.periodFill} opacity=".7" />
    <Sine x0={x0} x1={x0 + 3 * lam} y0={y0} a={a} lam={lam} />
    <path d={`M${x0} ${y0}H${x0 + 3 * lam}`} stroke={muted} strokeWidth="1.4" strokeDasharray="5 5" />
    <Measure from={[x0 + lam, y0 + a + 20]} to={[x0 + 2 * lam, y0 + a + 20]} colour={W.period} width={2.4} />
    <Lines x={x0 + 1.5 * lam} y={y0 + a + 42} anchor="middle" lines={['one complete wave']} size={14} colour={W.period} />
    <Stopwatch x={84} y={250} r={22} frac={0.35} tone="time" />
    <Lines x={118} y={248} lines={['period: the time for one complete', 'wave to pass a point, in seconds']} size={14} colour={W.period} />
    <Lines x={270} y={290} anchor="middle" lines={['high frequency means a short period']} size={13} weight={600} colour={muted} />
  </PhysicsDiagram>
}

/* ---------- Question visuals ---------- */

function QuestionWave({ assessment }: { assessment: boolean }) {
  const names = !assessment
  const restPt: Pt = [X0 + LAM + 22, Y0]
  return <PhysicsDiagram schematic={false} title={assessment ? 'A wave on displacement–distance axes with four numbered arrows.' : 'A wave with four numbered arrows: 1 amplitude, 2 wavelength, 3 a trough, 4 the rest position.'}>
    <WaveAxes restLabel={false} />
    <Sine x0={X0} x1={X1} y0={Y0} a={A} lam={LAM} />
    {/* 1: amplitude, rest position to crest */}
    <Measure from={[crest(0)[0], Y0]} to={crest(0)} colour={ink} width={2.4} />
    <Num n={1} x={crest(0)[0] + 24} y={Y0 - A / 2} />
    {/* 2: wavelength, crest to next crest */}
    <path d={`M${crest(1)[0]} ${Y0 - A - 4}V${Y0 - A - 30}M${crest(2)[0]} ${Y0 - A - 4}V${Y0 - A - 30}`} stroke={ink} strokeWidth="1.4" strokeDasharray="3 4" />
    <Measure from={[crest(1)[0], Y0 - A - 22]} to={[crest(2)[0], Y0 - A - 22]} colour={ink} width={2.4} stops={false} />
    <Num n={2} x={(crest(1)[0] + crest(2)[0]) / 2} y={Y0 - A - 22} />
    {/* 3: a trough */}
    <Arrow from={[trough(1)[0] + 50, Y0 + A + 30]} to={[trough(1)[0] + 6, Y0 + A + 4]} colour={ink} width={2.2} />
    <Num n={3} x={trough(1)[0] + 64} y={Y0 + A + 36} />
    {/* 4: the rest position */}
    <Arrow from={[restPt[0] + 26, Y0 + 44]} to={[restPt[0] + 4, Y0 + 4]} colour={ink} width={2.2} />
    <Num n={4} x={restPt[0] + 34} y={Y0 + 58} />
    {names && <g fontSize="12" fontWeight="700" fill={muted}>
      <text x={crest(0)[0] + 40} y={Y0 - A / 2 + 5}>amplitude</text>
      <text x={trough(1)[0] + 80} y={Y0 + A + 41}>trough</text>
      <text x={restPt[0] + 50} y={Y0 + 63}>rest position</text>
    </g>}
  </PhysicsDiagram>
}
function QuestionCompare() {
  const x0 = 80, x1 = 500, y0 = 150
  return <PhysicsDiagram schematic={false} title="Two waves drawn on the same axes: wave A and wave B, with different heights and different wavelengths.">
    <path d={`M${x0} ${y0 + 110}V${y0 - 110}`} stroke={ink} strokeWidth="2" />
    <path d={`M${x0 - 5} ${y0 - 102}L${x0} ${y0 - 114}L${x0 + 5} ${y0 - 102}Z`} fill={ink} stroke={ink} />
    <path d={`M${x0} ${y0}H${x1 + 14}`} stroke={ink} strokeWidth="2" />
    <path d={`M${x1 + 8} ${y0 - 5}L${x1 + 20} ${y0}L${x1 + 8} ${y0 + 5}Z`} fill={ink} stroke={ink} />
    <text x={x0 + 8} y={y0 - 104} fontSize="13" fontWeight="700" fill={ink}>Displacement</text>
    <text x={x1 + 18} y={y0 + 24} textAnchor="end" fontSize="13" fontWeight="700" fill={ink}>Distance</text>
    <Sine x0={x0} x1={x1} y0={y0} a={36} lam={280} colour={P.kineticLine} width={3.4} />
    <Sine x0={x0} x1={x1} y0={y0} a={84} lam={140} colour={W.line} width={3.4} />
    <Tag x={x0 + 250} y={y0 - 110} text="Wave B" colour={W.line} />
    <path d={`M${x0 + 226} ${y0 - 100}L${x0 + 184} ${y0 - 86}`} stroke={W.line} strokeWidth="1.5" />
    <Tag x={x0 + 418} y={y0 - 38} text="Wave A" colour={P.kineticLine} />
    <path d={`M${x0 + 386} ${y0 - 38}L${x0 + 362} ${y0 - 36}`} stroke={P.kineticLine} strokeWidth="1.5" />
  </PhysicsDiagram>
}

export function WaveTypeVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'wavetype-energy': return <EnergyNotMatter />
    case 'wavetype-stay': return <Stay />
    case 'wavetype-examples': return <Examples />
    case 'wavetype-transverse': return <Transverse />
    case 'wavetype-transverse-eg': return <TransverseExamples />
    case 'wavetype-longitudinal': return <Longitudinal />
    case 'wavetype-compress': return <Compress />
    case 'wavetype-displacement': return <LabelledWave show={['displacement']} title="A wave on displacement–distance axes. The dashed line is the rest position. Displacement is how far a point on the wave is from the rest position." />
    case 'wavetype-amplitude': return <LabelledWave show={['amplitude']} title="The highest point of the wave is a crest and the lowest a trough. The amplitude is the maximum displacement: from the rest position up to a crest." />
    case 'wavetype-wavelength': return <LabelledWave show={['wavelength']} title="The wavelength is the distance from one crest to the next crest; it is also the distance from one trough to the next." />
    case 'wavetype-frequency': return <Frequency />
    case 'wavetype-period': return <Period />
    case 'wavetype-q-wave': return <QuestionWave assessment={assessment} />
    case 'wavetype-q-compare': return <QuestionCompare />
    default: return null
  }
}
