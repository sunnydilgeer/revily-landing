import { useId, type ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, Leader, EnergyStoreBadge, TransferArrow, type Pt } from './PhysicsKit'
import { Num, Hand, Arrow } from './EnergyStoreVisuals'

/*
 * Physics Lesson 57: Electromagnetic waves. Original, code-native schematics; not to scale. Focus ids start with 'emspec-'.
 *
 * The spectrum bar, the wavy "EM wave" arrow and the group colours are exported so the two lessons on uses of EM
 * waves (EmUseVisuals, EmMoreVisuals) draw with exactly the same pieces. Group colours run cool → warm → violet:
 * radio blue, microwaves teal, infrared warm red (the thermal colour), visible light as a small rainbow,
 * ultraviolet violet, X-rays and gamma rays deeper violets (the high-energy end). Every bar is in the same order,
 * radio waves on the left (longest wavelength, lowest frequency) to gamma rays on the right (shortest, highest).
 */
const { ink, muted } = P
export const r1 = (n: number) => Math.round(n * 10) / 10

export type EmGroup = 'radio' | 'micro' | 'ir' | 'visible' | 'uv' | 'xray' | 'gamma'
export const EM_ORDER: EmGroup[] = ['radio', 'micro', 'ir', 'visible', 'uv', 'xray', 'gamma']
export const emGroups: Record<EmGroup, { name: string; lines: string[]; fill: string; line: string; wavelength: number }> = {
  radio: { name: 'radio waves', lines: ['radio', 'waves'], fill: '#d7e2f3', line: '#4f6fa6', wavelength: 60 },
  micro: { name: 'microwaves', lines: ['micro-', 'waves'], fill: '#d1ebe5', line: '#34877a', wavelength: 36 },
  ir: { name: 'infrared', lines: ['infra-', 'red'], fill: '#f8d2c8', line: '#bf4a3f', wavelength: 22 },
  visible: { name: 'visible light', lines: ['visible', 'light'], fill: '#fde8a8', line: '#b5870c', wavelength: 14 },
  uv: { name: 'ultraviolet', lines: ['ultra-', 'violet'], fill: '#e6daf5', line: '#7a4fbd', wavelength: 9.5 },
  xray: { name: 'X-rays', lines: ['X-rays'], fill: '#dcd8f0', line: '#584f9e', wavelength: 6.5 },
  gamma: { name: 'gamma rays', lines: ['gamma', 'rays'], fill: '#d9d0e8', line: '#4a3777', wavelength: 4.6 },
}
/** Colours used for waves by kind: infrared red, visible warm yellow, UV violet, X-rays and gamma the high-energy violet. */
export const waveColour = { radio: emGroups.radio.line, micro: emGroups.micro.line, ir: P.hot, visible: '#d49a0e', uv: emGroups.uv.line, xray: emGroups.xray.line, gamma: emGroups.gamma.line }
export const highEnergy = emGroups.gamma.line

/* ---------- Waves ---------- */

/** A sine-wave path from a to b with the given wavelength and amplitude (a squiggle with no arrowhead). */
export function wavePath(a: Pt, b: Pt, wavelength: number, amp: number, phase = 0) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len
  const step = Math.max(0.8, Math.min(3, wavelength / 10))
  let d = ''
  for (let t = 0; t <= len + 0.01; t += step) {
    const off = Math.sin((t / wavelength) * Math.PI * 2 + phase) * amp
    d += `${d ? 'L' : 'M'}${r1(a[0] + ux * t - uy * off)} ${r1(a[1] + uy * t + ux * off)}`
  }
  return d
}
/** An EM wave travelling from a to b: a squiggle with an arrowhead at b. `fade` tapers nothing; keep it simple. */
export function WaveArrow({ from, to, wavelength = 22, amp = 7, colour = waveColour.ir, width = 2.6, opacity = 1 }: { from: Pt; to: Pt; wavelength?: number; amp?: number; colour?: string; width?: number; opacity?: number }) {
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]) || 1, ux = (to[0] - from[0]) / len, uy = (to[1] - from[1]) / len
  const hs = 8 + width * 1.4
  const end: Pt = [to[0] - ux * (hs * 0.8 + 4), to[1] - uy * (hs * 0.8 + 4)]
  const p = (d: number, s: number) => `${r1(to[0] - ux * d - uy * s)} ${r1(to[1] - uy * d + ux * s)}`
  return <g opacity={opacity}>
    <path d={wavePath(from, end, wavelength, amp)} stroke={colour} strokeWidth={width} fill="none" />
    <path d={`M${r1(end[0])} ${r1(end[1])}L${p(hs * 0.72, 0)}`} stroke={colour} strokeWidth={width} />
    <path d={`M${to[0]} ${to[1]}L${p(hs, hs * 0.55)}L${p(hs * 0.72, 0)}L${p(hs, -hs * 0.55)}Z`} fill={colour} stroke={colour} strokeWidth="1.2" />
  </g>
}

/* ---------- The spectrum bar ---------- */

export type BarProps = {
  x?: number; y?: number; w?: number; h?: number
  names?: boolean; waves?: boolean; numbers?: boolean
  highlight?: EmGroup; missing?: EmGroup; dimOthers?: boolean
}
/** Seven adjoining rounded segments in spectrum order with a wave squiggle under each (tighter to the right). */
export function SpectrumBar({ x = 20, y = 96, w = 500, h = 58, names = true, waves = true, numbers = false, highlight, missing, dimOthers = false }: BarProps) {
  const grad = useId()
  const gap = 4, sw = (w - gap * 6) / 7
  return <g>
    <defs>
      <linearGradient id={grad} x1="0" x2="1" y1="0" y2="0">
        {['#f4a3a0', '#f7c58e', '#f8e38c', '#b9e0a5', '#a6cdef', '#c3b1ea'].map((c, i) => <stop key={c} offset={i / 5} stopColor={c} />)}
      </linearGradient>
    </defs>
    {EM_ORDER.map((g, i) => {
      const sx = r1(x + i * (sw + gap)), cx = r1(sx + sw / 2), G = emGroups[g]
      const off = dimOthers && highlight && g !== highlight
      const lit = highlight === g
      if (missing === g) return <g key={g}>
        <rect x={sx} y={y} width={r1(sw)} height={h} rx="11" fill="white" stroke={muted} strokeWidth="2" strokeDasharray="5 5" />
        <text x={cx} y={y + h / 2 + 8} textAnchor="middle" fontSize="24" fontWeight="800" fill={ink}>?</text>
        {numbers && <Num n={i + 1} x={cx} y={y - 20} />}
        {waves && <path d={wavePath([sx + 5, y + h + 22], [sx + sw - 5, y + h + 22], G.wavelength, 7)} stroke={muted} strokeWidth="2.2" fill="none" />}
      </g>
      return <g key={g} opacity={off ? 0.3 : 1}>
        <rect x={sx} y={y} width={r1(sw)} height={h} rx="11" fill={g === 'visible' ? `url(#${grad})` : G.fill} stroke={G.line} strokeWidth={lit ? 3.2 : 1.8} />
        {names && <text x={cx} y={y + (G.lines.length === 1 ? h / 2 + 5 : h / 2 - 3)} textAnchor="middle" fontSize="13" fontWeight="750" fill={ink} stroke={g === 'visible' ? 'white' : 'none'} strokeWidth="3" paintOrder="stroke">
          {G.lines.map((l, k) => <tspan key={k} x={cx} dy={k ? 16 : 0}>{l}</tspan>)}
        </text>}
        {numbers && <Num n={i + 1} x={cx} y={y - 20} />}
        {waves && <path d={wavePath([sx + 5, y + h + 22], [sx + sw - 5, y + h + 22], G.wavelength, 7)} stroke={G.line} strokeWidth="2.2" fill="none" />}
      </g>
    })}
  </g>
}

/** A long arrow under the bar: wavelength shorter and frequency higher to the right. */
function DirectionArrow({ y = 216, left, right, x1 = 24, x2 = 516 }: { y?: number; left: string[]; right: string[]; x1?: number; x2?: number }) {
  return <g>
    <Arrow from={[x1, y]} to={[x2, y]} colour={ink} width={3} />
    <Lines x={x1} y={y + 26} lines={left} size={14} />
    <Lines x={x2} y={y + 26} anchor="end" lines={right} size={14} />
  </g>
}

/* ---------- Scene pieces ---------- */

/** A light bulb glowing, centred on (x, y). */
export function Bulb({ x, y, s = 1, glow = true }: { x: number; y: number; s?: number; glow?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    {glow && <circle r="40" fill={P.light} opacity=".55" />}
    <path d="M-20 -4A22 22 0 1 1 20 -4C20 8 10 12 9 24H-9C-10 12 -20 8 -20 -4Z" fill="#fff5cf" stroke={P.lightLine} strokeWidth="2.2" />
    <path d="M-7 14L-3 -2L0 6L3 -2L7 14" stroke={P.lightLine} strokeWidth="1.8" fill="none" />
    <rect x="-10" y="24" width="20" height="14" rx="3" fill="#dfe5ea" stroke="#7d8e9c" strokeWidth="1.8" />
    <path d="M-10 29H10M-10 34H10" stroke="#7d8e9c" strokeWidth="1.3" />
  </g>
}
/** A campfire: crossed logs and a soft flame; (x, y) is the middle of the logs. */
export function Campfire({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-2 0C-34 -8 -30 -46 -10 -72C-8 -52 4 -54 2 -66C24 -48 30 -12 -2 0Z" fill="#f7a54a" stroke="#c8641e" strokeWidth="2" />
    <path d="M-2 -4C-18 -10 -16 -30 -4 -44C-2 -32 8 -30 6 -38C16 -26 14 -8 -2 -4Z" fill="#fcd97d" />
    <path d="M-40 14L36 -6" stroke="#8a6443" strokeWidth="12" />
    <path d="M-36 -6L40 14" stroke="#a57a45" strokeWidth="12" />
    <path d="M-40 14L36 -6M-36 -6L40 14" stroke="#e8cfa6" strokeWidth="3" opacity=".6" />
  </g>
}
/** A simple atom: nucleus and two electron shells. */
export function Atom({ x, y, s = 1, jump = false, glowNucleus = false }: { x: number; y: number; s?: number; jump?: boolean; glowNucleus?: boolean }) {
  const e = (a: number, r: number): Pt => [r1(Math.cos(a * Math.PI / 180) * r), r1(Math.sin(a * Math.PI / 180) * r)]
  const inner = [30, 210].map(a => e(a, 30)), outer = [-60, 60, 150, 250].map(a => e(a, 54))
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r="54" fill="none" stroke={P.panelLine} strokeWidth="2" />
    <circle r="30" fill="none" stroke={P.panelLine} strokeWidth="2" />
    {glowNucleus && <circle r="17" fill={P.nuclear} opacity=".9" />}
    {[[-4, -3, 1], [4, -4, 0], [0, 4, 1], [-5, 5, 0], [6, 4, 1]].map(([px, py, k], i) => <circle key={i} cx={px} cy={py} r="5" fill={k ? P.thermal : '#e4e8ec'} stroke={k ? P.thermalLine : '#7d8e9c'} strokeWidth="1.4" />)}
    {inner.map(([px, py], i) => <circle key={`i${i}`} cx={px} cy={py} r="5" fill={P.charge} stroke={P.chargeLine} strokeWidth="1.4" />)}
    {outer.map(([px, py], i) => jump && i === 0 ? null : <circle key={`o${i}`} cx={px} cy={py} r="5" fill={P.charge} stroke={P.chargeLine} strokeWidth="1.4" />)}
    {jump && <g>
      <circle cx={outer[0][0]} cy={outer[0][1]} r="5" fill="white" stroke={P.chargeLine} strokeWidth="1.4" strokeDasharray="2 2" />
      <circle cx={r1(Math.cos(-50 * Math.PI / 180) * 30)} cy={r1(Math.sin(-50 * Math.PI / 180) * 30)} r="5" fill={P.charge} stroke={P.chargeLine} strokeWidth="1.4" />
      <TransferArrow from={[outer[0][0] + 7, outer[0][1] + 3]} to={[r1(Math.cos(-50 * Math.PI / 180) * 30) + 7, r1(Math.sin(-50 * Math.PI / 180) * 30) - 3]} bend={-0.4} colour={P.chargeLine} width={1.4} />
    </g>}
  </g>
}
function Hands({ x, y, glow = false }: { x: number; y: number; glow?: boolean }) {
  // Two hands held out towards the left (towards the fire), palms facing it.
  return <g>
    {glow && <ellipse cx={x + 4} cy={y + 20} rx="62" ry="52" fill={P.thermal} opacity=".55" />}
    {[0, 1].map(k => <g key={k}>
      <path d={`M${x + 38 + k * 6} ${y + k * 42}H${x + 140}`} stroke="#3f7a9c" strokeWidth="23" />
      <path d={`M${x + 38 + k * 6} ${y + k * 42}H${x + 140}`} stroke="#9cc3d9" strokeWidth="19" />
      <g transform={`translate(${x + k * 6} ${y + k * 42}) scale(-1 1)`}><Hand x={0} y={0} s={1.45} /></g>
    </g>)}
  </g>
}

/* ---------- Section 2: EM waves carry energy ---------- */

function SourceAbsorber() {
  return <PhysicsDiagram title="A lamp, the source, gives out electromagnetic waves. The waves travel to an object, the absorber, which takes them in. EM waves carry energy from a source to an absorber.">
    <Bulb x={92} y={132} />
    {[-34, 0, 34].map((dy, i) => <WaveArrow key={i} from={[150, 132 + dy]} to={[372, 132 + dy]} wavelength={22} colour={waveColour.visible} />)}
    <path d="M396 94Q394 86 402 86H470Q478 86 478 94V176Q478 184 470 184H402Q394 184 396 176Z" fill="#5c6f7e" stroke="#3b5163" strokeWidth="2" />
    <path d="M404 100V168" stroke="white" strokeWidth="3" opacity=".25" />
    <Lines x={92} y={214} anchor="middle" lines={['source']} size={16} />
    <Lines x={92} y={234} anchor="middle" lines={['gives out waves']} size={13} weight={600} colour={muted} />
    <Lines x={262} y={70} anchor="middle" lines={['EM waves carry energy']} size={15} colour={P.lightLine} />
    <Lines x={437} y={214} anchor="middle" lines={['absorber']} size={16} />
    <Lines x={437} y={234} anchor="middle" lines={['takes them in']} size={13} weight={600} colour={muted} />
  </PhysicsDiagram>
}

function Fire({ absorb }: { absorb: boolean }) {
  return <PhysicsDiagram title={absorb
    ? 'The hands absorb the infrared radiation from the campfire. Energy is transferred to the thermal energy store of the hands, so they warm up.'
    : 'A campfire is a source of infrared radiation. Infrared waves travel sideways from the fire to a pair of hands held out beside it.'}>
    <Campfire x={96} y={210} s={1.15} />
    {[-30, 4, 38].map((dy, i) => <WaveArrow key={i} from={[150, 150 + dy]} to={[346, 150 + dy]} wavelength={22} colour={waveColour.ir} opacity={absorb ? .75 : 1} />)}
    <Hands x={384} y={128} glow={absorb} />
    <path d="M20 236Q270 230 520 236" stroke="#b9c7a8" strokeWidth="2.2" fill="none" />
    {!absorb && <g>
      <Lines x={96} y={264} anchor="middle" lines={['source: campfire']} size={15} />
      <Lines x={248} y={96} anchor="middle" lines={['infrared radiation']} size={15} colour={waveColour.ir} />
      <Lines x={400} y={220} anchor="middle" lines={['hands beside the fire']} size={13} weight={600} colour={muted} />
    </g>}
    {absorb && <g>
      <EnergyStoreBadge store="thermal" x={440} y={46} label="Thermal store" />
      <TransferArrow from={[402, 110]} to={[430, 66]} bend={-0.25} colour={P.thermalLine} width={3} />
      <Lines x={248} y={96} anchor="middle" lines={['energy to the thermal store']} size={14} colour={P.thermalLine} />
      <Lines x={400} y={224} anchor="middle" lines={['absorbed by the hands:', 'warms up']} size={14} />
    </g>}
  </PhysicsDiagram>
}

function Speed() {
  return <PhysicsDiagram title="Lightning and thunder. The EM wave (the flash of light) reaches the listener very fast; the sound is much slower and arrives later. Below: all EM waves travel at the same speed through air or a vacuum.">
    {/* cloud and bolt */}
    <path d="M30 70Q26 46 50 44Q58 24 82 32Q100 20 116 38Q140 38 136 62Q140 80 118 80H44Q28 80 30 70Z" fill="#e6ebef" stroke="#8a9aa7" strokeWidth="2" />
    <path d="M78 80L64 112H80L68 146L102 100H84L96 80Z" fill={P.light} stroke={P.lightLine} strokeWidth="2" />
    {/* listener: a simple head with an ear, facing left */}
    <circle cx={470} cy={96} r="26" fill="#f3cfb0" stroke="#b8835e" strokeWidth="2" />
    <path d="M444 92Q446 66 472 68Q494 70 496 92Q486 80 470 82Q456 82 444 92Z" fill="#6b4a35" />
    <ellipse cx={478} cy={100} rx="6" ry="9" fill="#f3cfb0" stroke="#b8835e" strokeWidth="1.8" />
    <path d="M430 130Q470 118 510 130V150H430Z" fill="#9cc3d9" stroke="#3f7a9c" strokeWidth="2" />
    <Arrow from={[120, 100]} to={[430, 100]} colour={P.lightLine} width={3.4} />
    <Lines x={150} y={90} lines={['EM wave: very fast']} size={14} colour={P.lightLine} />
    <Arrow from={[120, 140]} to={[258, 140]} colour={muted} width={3} />
    <path d="M268 128q6 12 0 24M278 122q9 18 0 36" stroke={muted} strokeWidth="2" fill="none" />
    <Lines x={150} y={166} lines={['sound: much slower']} size={14} colour={muted} />
    {/* same speed strip */}
    <rect x={20} y={186} width={500} height={100} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <Lines x={36} y={210} lines={['air or vacuum:', 'same speed for', 'all EM waves']} size={14} />
    {(['radio', 'visible', 'gamma'] as EmGroup[]).map((g, i) => <WaveArrow key={g} from={[176, 212 + i * 26]} to={[470, 212 + i * 26]} wavelength={[40, 16, 7][i]} amp={[7, 6, 4.5][i]} colour={emGroups[g].line} width={2.2} />)}
    <path d="M472 198V278" stroke={ink} strokeWidth="2" strokeDasharray="4 5" />
  </PhysicsDiagram>
}

/* ---------- Section 3: the spectrum ---------- */

function Many() {
  return <PhysicsDiagram schematic={false} title="Two EM waves: one with a long wavelength and a low frequency, one with a short wavelength and a high frequency.">
    <path d={wavePath([40, 96], [500, 96], 150, 26)} stroke={emGroups.radio.line} strokeWidth="3.2" fill="none" />
    <path d="M40 142H190" stroke={emGroups.radio.line} strokeWidth="1.6" />
    <path d="M40 136v12M190 136v12" stroke={emGroups.radio.line} strokeWidth="1.6" />
    <Lines x={200} y={148} lines={['one wavelength']} size={12} weight={600} colour={muted} />
    <Lines x={500} y={46} anchor="end" lines={['long wavelength, low frequency']} size={15} colour={emGroups.radio.line} />
    <path d={wavePath([40, 214], [500, 214], 22, 20)} stroke={emGroups.gamma.line} strokeWidth="2.8" fill="none" />
    <Lines x={500} y={272} anchor="end" lines={['short wavelength, high frequency']} size={15} colour={emGroups.gamma.line} />
  </PhysicsDiagram>
}

function Continuous() {
  const grad = useId()
  const stops = ['#b8c9e8', '#b8e0d7', '#f5b8a8', '#f8e38c', '#b9e0a5', '#a6cdef', '#c9b3ec', '#b3a6d6', '#9d8cc4']
  return <PhysicsDiagram schematic={false} title="The electromagnetic spectrum is continuous: a smooth band with no gaps, with a wave of every wavelength within the range.">
    <defs><linearGradient id={grad} x1="0" x2="1" y1="0" y2="0">{stops.map((c, i) => <stop key={i} offset={i / (stops.length - 1)} stopColor={c} />)}</linearGradient></defs>
    <path d="M24 92Q24 70 46 70H494Q516 70 516 92" stroke={ink} strokeWidth="2.2" fill="none" />
    <path d="M270 70V58" stroke={ink} strokeWidth="2.2" />
    <Lines x={270} y={40} anchor="middle" lines={['every wavelength in a range: continuous spectrum']} size={15} />
    <rect x={20} y={104} width={500} height={62} rx="14" fill={`url(#${grad})`} stroke="#8a9aa7" strokeWidth="1.8" />
    <path d={wavePath([26, 206], [514, 206], 60, 9)} stroke="#8a9aa7" strokeWidth="1" fill="none" opacity="0" />
    {/* a squiggle that gets steadily tighter from left to right */}
    <path d={(() => { let d = '', ph = 0; for (let x = 26; x <= 514; x += 1) { const wl = 64 * Math.pow(4.6 / 64, (x - 26) / 488); ph += 2 * Math.PI / wl; d += `${d ? 'L' : 'M'}${x} ${r1(210 + Math.sin(ph) * 9)}` } return d })()} stroke={ink} strokeWidth="1.8" fill="none" />
    <Lines x={270} y={262} anchor="middle" lines={['no gaps: it runs smoothly from one end to the other']} size={13} weight={600} colour={muted} />
  </PhysicsDiagram>
}

function Order() {
  return <PhysicsDiagram schematic={false} title="The electromagnetic spectrum split into seven groups, in order: 1 radio waves, 2 microwaves, 3 infrared, 4 visible light, 5 ultraviolet, 6 X-rays, 7 gamma rays.">
    <Lines x={270} y={30} anchor="middle" lines={['seven groups, always in this order']} size={15} />
    <SpectrumBar numbers y={100} />
    <Lines x={270} y={242} anchor="middle" lines={['Really Massive Ice-creams Vanish Under X-mas Grins']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

function Direction() {
  return <PhysicsDiagram schematic={false} title="Along the spectrum from radio waves to gamma rays, the wavelength gets shorter and the frequency gets higher. Radio waves: longest wavelength, lowest frequency. Gamma rays: shortest wavelength, highest frequency.">
    <SpectrumBar y={40} />
    <DirectionArrow y={146} left={['longest wavelength,', 'lowest frequency']} right={['shortest wavelength,', 'highest frequency']} />
    <Lines x={270} y={250} anchor="middle" lines={['wavelength gets shorter, frequency gets higher']} size={14} colour={ink} />
  </PhysicsDiagram>
}

function Eye({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-26 0Q0 -24 26 0Q0 24 -26 0Z" fill="white" stroke={ink} strokeWidth="2.2" />
    <circle r="10" fill="#7fa9c9" stroke={ink} strokeWidth="1.8" />
    <circle r="4.5" fill={ink} />
    <circle cx="-3" cy="-3" r="2" fill="white" />
  </g>
}
function Visible() {
  const sw = (500 - 24) / 7, vx = 20 + 3 * (sw + 4) + sw / 2
  return <PhysicsDiagram schematic={false} title="Visible light is highlighted: it is the only part of the spectrum our eyes can detect, and it is a small part of the whole spectrum. The other groups are faded.">
    <SpectrumBar y={110} highlight="visible" dimOthers />
    <Eye x={vx} y={52} />
    <Arrow from={[vx, 76]} to={[vx, 102]} colour={ink} width={2.4} />
    <Lines x={vx + 44} y={48} lines={['our eyes detect', 'only this part']} size={15} />
    <Lines x={270} y={250} anchor="middle" lines={['the other six groups are invisible to us']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

/* ---------- Section 4: atoms ---------- */

function Atoms() {
  return <PhysicsDiagram title="An atom with EM waves going out of it and one coming in. Changes inside atoms can produce and absorb EM waves.">
    <Atom x={250} y={128} s={1.25} />
    <WaveArrow from={[330, 88]} to={[480, 40]} wavelength={20} colour={waveColour.visible} />
    <WaveArrow from={[334, 150]} to={[490, 196]} wavelength={14} colour={emGroups.uv.line} />
    <WaveArrow from={[40, 200]} to={[172, 158]} wavelength={24} colour={waveColour.ir} />
    <Lines x={490} y={66} lines={['out']} size={13} weight={650} colour={muted} />
    <Lines x={490} y={222} lines={['out']} size={13} weight={650} colour={muted} />
    <Lines x={40} y={226} lines={['in']} size={13} weight={650} colour={muted} />
    <Lines x={270} y={270} anchor="middle" lines={['atoms produce and absorb EM waves']} size={15} />
  </PhysicsDiagram>
}
function Changes() {
  return <PhysicsDiagram title="Two changes inside an atom. An electron moves between energy levels and an EM wave is given out. A change in the nucleus gives out gamma rays.">
    <Atom x={170} y={156} s={1.5} jump glowNucleus />
    {/* electron callout */}
    <WaveArrow from={[226, 104]} to={[330, 50]} wavelength={18} colour={waveColour.visible} />
    <Leader from={[338, 76]} to={[214, 90]} colour={P.chargeLine} />
    <Lines x={344} y={72} lines={['electron moves', 'between energy levels']} size={14} colour={P.chargeLine} />
    {/* nucleus callout */}
    <WaveArrow from={[196, 170]} to={[330, 226]} wavelength={5} amp={6} colour={highEnergy} />
    <Lines x={344} y={218} lines={['change in the nucleus:', 'gamma rays']} size={14} colour={highEnergy} />
  </PhysicsDiagram>
}
function Range() {
  const atoms: [number, number, string][] = [[100, 40, emGroups.radio.line], [270, 16, emGroups.visible.line], [440, 6, highEnergy]]
  const sw = (500 - 24) / 7
  const marks = [0, 3, 6].map(i => 20 + i * (sw + 4) + sw / 2)
  return <PhysicsDiagram title="Three atoms, each with a different change, give out waves of different wavelength. They land at different places on the spectrum: different change, different frequency.">
    {atoms.map(([x, wl, c], i) => <g key={i}>
      <Atom x={x} y={54} s={0.62} />
      <path d={wavePath([x, 96], [x, 170], wl, 7, Math.PI / 2)} stroke={c} strokeWidth="2.6" fill="none" />
      <path d={`M${x} 170L${r1(marks[i])} 206`} stroke={c} strokeWidth="1.6" strokeDasharray="3 4" />
      <circle cx={r1(marks[i])} cy={206} r="5" fill={c} />
    </g>)}
    <SpectrumBar y={214} h={34} names={false} waves={false} />
    <Lines x={270} y={282} anchor="middle" lines={['different change, different frequency']} size={15} />
  </PhysicsDiagram>
}

/* ---------- Question visual ---------- */

function MissingQuestion() {
  return <PhysicsDiagram schematic={false} title="The electromagnetic spectrum in order, with one group missing.">
    <SpectrumBar y={80} missing="ir" />
    <DirectionArrow y={190} left={['long wavelength']} right={['short wavelength']} />
  </PhysicsDiagram>
}

export function EmSpectrumVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  const views: Record<string, () => ReactNode> = {
    'emspec-source': () => <SourceAbsorber />,
    'emspec-fire': () => <Fire absorb={false} />,
    'emspec-absorb': () => <Fire absorb />,
    'emspec-speed': () => <Speed />,
    'emspec-many': () => <Many />,
    'emspec-continuous': () => <Continuous />,
    'emspec-order': () => <Order />,
    'emspec-direction': () => <Direction />,
    'emspec-visible': () => <Visible />,
    'emspec-atoms': () => <Atoms />,
    'emspec-changes': () => <Changes />,
    'emspec-range': () => <Range />,
    'emspec-q-spectrum': () => <MissingQuestion />,
  }
  return <>{views[focus]?.() ?? null}</>
}
