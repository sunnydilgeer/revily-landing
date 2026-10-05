import { useId, type ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, Leader, type Pt } from './PhysicsKit'
import { Arrow, Tick } from './EnergyStoreVisuals'
import { WaveArrow, emGroups, r1 } from './EmSpectrumVisuals'

/*
 * Higher-only diagrams for Physics Lessons 56 (refraction explained with wave fronts, AQA 6.6.2.2 HT) and 58 (radio waves
 * made and absorbed by oscillating electrons, 6.6.2.3 HT). Original, code-native schematics; not to scale.
 * Focus ids start with 'hwave-'.
 *
 * Refraction: the same pale air and pale blue glass, boundary and dotted normal as RefractionVisuals.tsx. The light is a
 * pale yellow beam with its wave fronts in the light colour. Geometry is exact: glass slows light to 2/3 of its speed in
 * air (n = 1.5), so a 45° wave turns to 28°, the wavelength in glass is 2/3 as long, and every wave front meets the
 * boundary at the same points from both sides (the frequency does not change).
 * Radio: the radio-wave blue of Lesson 58, electrons blue as in the circuit lessons, alternating currents shown as traces
 * on small oscilloscope screens (as in the speed of sound practical). Equal frequency = equal number of waves on a screen.
 */
const { ink, muted } = P
const rad = (d: number) => d * Math.PI / 180
const air = '#f6fafd', glass = '#dcebf4', glassLine = '#7fa8c2', glassInk = '#4f7f9c'
const beam = P.light, front = P.lightLine, frontDark = '#8f6a05'
const slowCol = P.electrostaticLine, fastCol = P.kineticLine
const faded = 0.3

/* ================= Refraction with wave fronts ================= */

type Box = { x: number; y: number; w: number; h: number }
type Seg = [Pt, Pt]
/**
 * A beam of width W meets a horizontal boundary at `by`, centre ray through (ox, by) at angle i to the normal.
 * `ratio` = speed below ÷ speed above. Returns the wave front pieces (above and below), the beam outlines and the rays.
 */
function scene(box: Box, by: number, ox: number, i: number, ratio: number, lam: number, W: number, phase = 0) {
  const r = Math.asin(Math.min(1, Math.sin(rad(i)) * ratio)) * 180 / Math.PI
  const si = Math.sin(rad(i)), ci = Math.cos(rad(i)), sr = Math.sin(rad(r)), cr = Math.cos(rad(r))
  const lam2 = lam * ratio, W2 = W * cr / ci, D = lam / si
  const fronts: { k: number; top?: Seg; bottom?: Seg }[] = []
  for (let k = -12; k <= 12; k++) {
    const B: Pt = [ox + (k + phase) * D, by]
    const ak = (k + phase) * D * ci, bk = (k + phase) * D * cr
    const s0 = Math.max(0, -W / 2 - ak), s1 = W / 2 - ak
    const t0 = Math.max(0, bk - W2 / 2), t1 = bk + W2 / 2
    const f: { k: number; top?: Seg; bottom?: Seg } = { k }
    if (s1 > s0) f.top = [[B[0] + s0 * ci, by - s0 * si], [B[0] + s1 * ci, by - s1 * si]]
    if (t1 > t0) f.bottom = [[B[0] - t0 * cr, by + t0 * sr], [B[0] - t1 * cr, by + t1 * sr]]
    if (f.top || f.bottom) fronts.push(f)
  }
  const half = W / 2 / ci, L = 600
  const fl: Pt = [ox - half, by], fr: Pt = [ox + half, by]
  const d1: Pt = [si, ci], d2: Pt = [sr, cr]
  const topBand = [fl, fr, [fr[0] - L * d1[0], by - L * d1[1]], [fl[0] - L * d1[0], by - L * d1[1]]] as Pt[]
  const bottomBand = [fl, fr, [fr[0] + L * d2[0], by + L * d2[1]], [fl[0] + L * d2[0], by + L * d2[1]]] as Pt[]
  return { box, by, ox, i, r, lam, lam2, W, W2, si, ci, sr, cr, fronts, topBand, bottomBand, o: [ox, by] as Pt }
}
type Scene = ReturnType<typeof scene>
const poly = (pts: Pt[]) => `M${pts.map(p => `${r1(p[0])} ${r1(p[1])}`).join('L')}Z`
const line = ([a, b]: Seg) => `M${r1(a[0])} ${r1(a[1])}L${r1(b[0])} ${r1(b[1])}`

function Materials({ s, top = 'air', bottom = 'glass', topFill = air, bottomFill = glass, boundary = glassLine, names = true, size = 14, nameColours = [muted, glassInk] }: { s: Scene; top?: string; bottom?: string; topFill?: string; bottomFill?: string; boundary?: string; names?: boolean; size?: number; nameColours?: [string, string] }) {
  const { box, by } = s
  return <g>
    <rect x={box.x} y={box.y} width={box.w} height={by - box.y} fill={topFill} />
    <rect x={box.x} y={by} width={box.w} height={box.y + box.h - by} fill={bottomFill} />
    <path d={`M${box.x} ${by}H${box.x + box.w}`} stroke={boundary} strokeWidth="2.8" />
    {names && <g fontSize={size} fontWeight="700">
      <text x={box.x + box.w - 12} y={box.y + size + 8} textAnchor="end" fill={nameColours[0]}>{top}</text>
      <text x={box.x + 12} y={box.y + box.h - 10} fill={nameColours[1]}>{bottom}</text>
    </g>}
  </g>
}
/** Clip everything to the rounded box and draw its border. */
function Panel({ s, children }: { s: Scene; children: ReactNode }) {
  const id = useId(), { box } = s
  return <g>
    <clipPath id={id}><rect x={box.x} y={box.y} width={box.w} height={box.h} rx="16" /></clipPath>
    <g clipPath={`url(#${id})`}>{children}</g>
    <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="16" fill="none" stroke={P.panelLine} strokeWidth="1.5" />
  </g>
}
function Beam({ s, top = true, bottom = true }: { s: Scene; top?: boolean; bottom?: boolean }) {
  return <g fill={beam} opacity=".55">
    {top && <path d={poly(s.topBand)} />}
    {bottom && <path d={poly(s.bottomBand)} />}
  </g>
}
function Fronts({ s, top = true, bottom = true, only, highlight, width = 3 }: { s: Scene; top?: boolean; bottom?: boolean; only?: (f: Scene['fronts'][number]) => boolean; highlight?: number; width?: number }) {
  return <g>
    {s.fronts.filter(f => !only || only(f)).map(f => {
      const hi = highlight === f.k, dim = highlight !== undefined && !hi
      const c = hi ? frontDark : front, w = hi ? width + 1.6 : width
      return <g key={f.k} opacity={dim ? faded + 0.15 : 1}>
        {top && f.top && <path d={line(f.top)} stroke={c} strokeWidth={w} />}
        {bottom && f.bottom && <path d={line(f.bottom)} stroke={c} strokeWidth={w} />}
      </g>
    })}
  </g>
}
function Normal({ s }: { s: Scene }) {
  const { box, o } = s
  return <g>
    <path d={`M${o[0]} ${box.y + 6}V${box.y + box.h - 6}`} stroke={ink} strokeWidth="2" strokeDasharray="2 6" />
    <path d={`M${o[0] + 10} ${o[1]}v-10h-10`} fill="none" stroke={ink} strokeWidth="1.5" />
  </g>
}
/** The direction of travel along the centre of the beam: in, and (optionally) out with the straight-on path dashed. */
function Rays({ s, out = true, straight = false, lenIn = 120, lenOut = 110 }: { s: Scene; out?: boolean; straight?: boolean; lenIn?: number; lenOut?: number }) {
  const { o, si, ci, sr, cr } = s
  const a: Pt = [o[0] - lenIn * si, o[1] - lenIn * ci], mid: Pt = [o[0] - lenIn * si * 0.35, o[1] - lenIn * ci * 0.35]
  const b: Pt = [o[0] + lenOut * sr, o[1] + lenOut * cr], b2: Pt = [o[0] + lenOut * si, o[1] + lenOut * ci]
  return <g>
    {straight && <path d={`M${o[0]} ${o[1]}L${r1(b2[0])} ${r1(b2[1])}`} stroke={ink} strokeWidth="1.8" strokeDasharray="4 6" opacity=".5" />}
    <path d={`M${r1(a[0])} ${r1(a[1])}L${o[0]} ${o[1]}`} stroke={ink} strokeWidth="2.2" />
    <Arrow from={a} to={mid.map(r1) as Pt} colour={ink} width={2.2} />
    {out && <Arrow from={o} to={b.map(r1) as Pt} colour={ink} width={2.2} />}
  </g>
}
/** A wavelength bracket between two neighbouring wave fronts, drawn along the direction of travel at point p. */
function LamBracket({ p, dir, len, colour, label, side = 1, labelAt }: { p: Pt; dir: Pt; len: number; colour: string; label?: string; side?: number; labelAt?: Pt }) {
  const n: Pt = [-dir[1] * side, dir[0] * side], q: Pt = [p[0] + dir[0] * len, p[1] + dir[1] * len]
  const tick = (c: Pt) => `M${r1(c[0] - n[0] * 6)} ${r1(c[1] - n[1] * 6)}L${r1(c[0] + n[0] * 6)} ${r1(c[1] + n[1] * 6)}`
  return <g>
    <path d={`M${r1(p[0])} ${r1(p[1])}L${r1(q[0])} ${r1(q[1])}${tick(p)}${tick(q)}`} stroke={colour} strokeWidth="2.6" />
    {label && labelAt && <text x={labelAt[0]} y={labelAt[1]} fontSize="13" fontWeight="750" fill={colour} stroke="white" strokeWidth="4" paintOrder="stroke">{label}</text>}
  </g>
}

const MAIN: Box = { x: 20, y: 18, w: 316, h: 264 }
const BY = 150, OX = 170, LAM = 34, BEAM = 112
const main = (phase = 0) => scene(MAIN, BY, OX, 45, 2 / 3, LAM, BEAM, phase)

/** Point on the centre line of the beam, distance d before (negative) or after (positive) the boundary. */
const onCentre = (s: Scene, d: number): Pt => d < 0 ? [s.ox + d * s.si, s.by + d * s.ci] : [s.ox + d * s.sr, s.by + d * s.cr]

function FrontsFrame() {
  // Phase chosen so the leading wave front just touches the boundary at its lower end: (k + phase)·λ = −W/2 for k = −2.
  const s = scene(MAIN, BY, 250, 45, 2 / 3, LAM, BEAM, 2 - BEAM / 2 / LAM)
  const inAir = s.fronts.filter(f => f.top && !f.bottom)
  const lead = inAir[inAir.length - 1].top!, L = 400, d1: Pt = [s.si, s.ci]
  const band: Pt[] = [lead[0], lead[1], [lead[1][0] - L * d1[0], lead[1][1] - L * d1[1]], [lead[0][0] - L * d1[0], lead[0][1] - L * d1[1]]]
  const mid: Pt = [(lead[0][0] + lead[1][0]) / 2, (lead[0][1] + lead[1][1]) / 2]
  const back = (d: number, side = 0): Pt => [r1(mid[0] - d * d1[0] + side * s.ci), r1(mid[1] - d * d1[1] - side * s.si)]
  const b0 = back(s.lam, 44)
  return <PhysicsDiagram title="Light arriving at a boundary between air and glass, drawn as a beam with straight wave fronts across it, one along each crest. Neighbouring wave fronts are one wavelength apart. An arrow at right angles to the wave fronts shows the direction of travel.">
    <Panel s={s}>
      <Materials s={s} />
      <path d={poly(band)} fill={beam} opacity=".55" />
      <Fronts s={s} bottom={false} only={f => !!f.top && !f.bottom} />
      <path d={`M${back(150).join(' ')}L${back(40).join(' ')}`} stroke={ink} strokeWidth="2.2" />
      <Arrow from={back(40)} to={back(6)} colour={ink} width={2.4} />
    </Panel>
    <LamBracket p={b0} dir={d1} len={s.lam} colour={P.pd} side={-1} />
    <Lines x={b0[0] + 30} y={b0[1] + 18} lines={['one', 'wavelength']} size={13} colour={P.pd} />
    <Leader from={[352, 112]} to={[r1(lead[0][0] + 0.55 * (lead[1][0] - lead[0][0])), r1(lead[0][1] + 0.55 * (lead[1][1] - lead[0][1]))]} colour={frontDark} />
    <Lines x={358} y={100} lines={['wave fronts:', 'a line along', 'each crest']} size={14} colour={frontDark} />
    <Lines x={358} y={200} lines={['the arrow shows', 'the direction of', 'travel: at right', 'angles to the', 'wave fronts']} size={13} weight={650} colour={ink} />
  </PhysicsDiagram>
}

const K0 = 0 // the wave front that passes through the centre of the beam at the boundary
function SlowFrame() {
  const s = main()
  const f = s.fronts.find(x => x.k === K0)!
  const topEnd = f.top![1], bottomEnd = f.bottom![1]
  const fast: Pt = [topEnd[0] + 38 * s.si, topEnd[1] + 38 * s.ci], slow: Pt = [bottomEnd[0] + 25 * s.sr, bottomEnd[1] + 25 * s.cr]
  return <PhysicsDiagram title="Wave fronts crossing the boundary from air into glass at an angle. One wave front is picked out: its lower end is already in the glass and moving slowly (short arrow), while its upper end is still in the air and moving faster (long arrow).">
    <Panel s={s}>
      <Materials s={s} />
      <Beam s={s} />
      <Fronts s={s} highlight={K0} />
    </Panel>
    <Arrow from={topEnd} to={fast.map(r1) as Pt} colour={fastCol} width={3} />
    <Arrow from={bottomEnd} to={slow.map(r1) as Pt} colour={slowCol} width={3} />
    <Leader from={[366, 74]} to={[r1(topEnd[0] + 22 * s.si + 3), r1(topEnd[1] + 22 * s.ci - 3)]} colour={fastCol} />
    <Lines x={372} y={66} lines={['this end is', 'still in the air:', 'faster']} size={14} colour={fastCol} />
    <path d={`M366 206Q${r1(slow[0] + 60)} 220 ${r1(slow[0] + 8)} ${r1(slow[1] + 2)}`} stroke={slowCol} strokeWidth="1.4" fill="none" />
    <Lines x={372} y={198} lines={['this end reached', 'the glass first:', 'slower']} size={14} colour={slowCol} />
  </PhysicsDiagram>
}

function TurnFrame() {
  const s = main()
  return <PhysicsDiagram title="The whole beam crossing from air into glass. Each wave front turns at the boundary, so the direction of travel changes. The ray after the boundary is closer to the dotted normal than the straight-on path: the wave bends towards the normal.">
    <Panel s={s}>
      <Materials s={s} />
      <Beam s={s} />
      <Fronts s={s} />
      <Normal s={s} />
      <Rays s={s} straight lenIn={150} lenOut={140} />
    </Panel>
    <Lines x={OX + 8} y={36} lines={['normal']} size={13} colour={ink} />
    <Lines x={350} y={60} lines={['each wave front', 'turns at the', 'boundary']} size={14} colour={frontDark} />
    <Lines x={350} y={170} lines={['slows down →', 'bends towards', 'the normal']} size={15} colour={slowCol} />
    <Lines x={350} y={248} lines={['dashed: the path', 'with no bend']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

function WavelengthFrame() {
  const s = main()
  const pa = onCentre(s, -s.lam * 2 - 0.5), pb = onCentre(s, s.lam2 * 2 + 0.3)
  const offA = 44, offB = 52
  const a: Pt = [pa[0] + offA * s.ci, pa[1] - offA * s.si], b: Pt = [pb[0] + offB * s.cr, pb[1] - offB * s.sr]
  return <PhysicsDiagram title="Wave fronts in air and in glass. In the glass the wave fronts are closer together, so the wavelength is shorter. The same number of wave fronts arrive at the boundary each second as leave it, so the frequency stays the same.">
    <Panel s={s}>
      <Materials s={s} />
      <Beam s={s} />
      <Fronts s={s} />
    </Panel>
    <LamBracket p={a} dir={[s.si, s.ci]} len={s.lam} colour={P.pd} side={-1} />
    <LamBracket p={b} dir={[s.sr, s.cr]} len={s.lam2} colour={P.pd} side={-1} />
    <Leader from={[352, 82]} to={[r1(a[0] + s.lam * s.si / 2 + 4), r1(a[1] + s.lam * s.ci / 2 - 4)]} colour={P.pd} />
    <Lines x={358} y={74} lines={['wavelength', 'in air']} size={14} colour={P.pd} />
    <Leader from={[352, 196]} to={[r1(b[0] + s.lam2 * s.sr / 2 + 4), r1(b[1] + s.lam2 * s.cr / 2 - 3)]} colour={P.pd} />
    <Lines x={358} y={188} lines={['shorter', 'wavelength', 'in glass']} size={14} colour={P.pd} />
    <rect x={350} y={128} width={176} height={30} rx="15" fill="white" stroke={front} strokeWidth="1.8" />
    <text x={438} y={148} textAnchor="middle" fontSize="13" fontWeight="750" fill={frontDark}>frequency: the same</text>
  </PhysicsDiagram>
}

/** Small panel: a wave going straight along the normal (fronts parallel to the boundary). */
function AlongNormal({ box, by }: { box: Box; by: number }) {
  const id = useId(), cx = box.x + box.w / 2, W = 64, l1 = 16, l2 = l1 * 2 / 3
  const tops = Array.from({ length: 8 }, (_, k) => by - l1 * (k + 0.5)).filter(y => y > box.y)
  const bots = Array.from({ length: 10 }, (_, k) => by + l2 * (k + 0.5)).filter(y => y < box.y + box.h)
  return <g>
    <clipPath id={id}><rect x={box.x} y={box.y} width={box.w} height={box.h} rx="14" /></clipPath>
    <g clipPath={`url(#${id})`}>
      <rect x={box.x} y={box.y} width={box.w} height={by - box.y} fill={air} />
      <rect x={box.x} y={by} width={box.w} height={box.y + box.h - by} fill={glass} />
      <rect x={cx - W / 2} y={box.y} width={W} height={box.h} fill={beam} opacity=".55" />
      {[...tops, ...bots].map((y, k) => <path key={k} d={`M${cx - W / 2} ${r1(y)}H${cx + W / 2}`} stroke={front} strokeWidth="2.6" />)}
      <path d={`M${box.x} ${by}H${box.x + box.w}`} stroke={glassLine} strokeWidth="2.4" />
    </g>
    <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="14" fill="none" stroke={P.panelLine} strokeWidth="1.5" />
    <Arrow from={[cx + W / 2 + 14, box.y + 12]} to={[cx + W / 2 + 14, box.y + box.h - 10]} colour={ink} width={2} />
  </g>
}

function AllFrame() {
  const s = main()
  const up = scene({ x: 352, y: 34, w: 196, h: 112 }, 90, 450, 28.13, 1.5, 15, 46)
  const nb: Box = { x: 352, y: 184, w: 196, h: 100 }
  return <PhysicsDiagram viewBox="0 0 560 320" title="Put it together. Left: light slows down going from air into glass at an angle, so its wave fronts turn and it bends towards the normal, with a shorter wavelength and the same frequency. Top right: light going from glass into air speeds up and bends away from the normal. Bottom right: a wave travelling along the normal changes speed and wavelength but does not change direction.">
    <Panel s={s}>
      <Materials s={s} />
      <Beam s={s} />
      <Fronts s={s} />
      <Normal s={s} />
      <Rays s={s} lenIn={150} lenOut={140} />
    </Panel>
    <rect x={20} y={290} width={316} height={26} rx="13" fill="white" stroke={slowCol} strokeWidth="1.6" />
    <text x={178} y={308} textAnchor="middle" fontSize="13" fontWeight="750" fill={slowCol}>slows down → bends towards the normal</text>
    <text x={450} y={24} textAnchor="middle" fontSize="13" fontWeight="750" fill={fastCol}>speeds up → bends away</text>
    <Panel s={up}>
      <Materials s={up} top="glass" bottom="air" topFill={glass} bottomFill={air} size={12} nameColours={[glassInk, muted]} />
      <Beam s={up} />
      <Fronts s={up} width={2.4} />
      <Normal s={up} />
    </Panel>
    <text x={450} y={172} textAnchor="middle" fontSize="13" fontWeight="750" fill={ink}>along the normal → no bend</text>
    <AlongNormal box={nb} by={234} />
    <text x={362} y={nb.y + 20} fontSize="12" fontWeight="700" fill={muted}>air</text>
    <text x={362} y={nb.y + nb.h - 10} fontSize="12" fontWeight="700" fill={glassInk}>glass</text>
  </PhysicsDiagram>
}

/** Question: wave fronts from material 1 into material 2 (slower). Neutral names and colours; no "slower" until feedback. */
function QuestionFronts({ assessment }: { assessment: boolean }) {
  const s = scene({ x: 70, y: 18, w: 400, h: 264 }, 150, 250, 40, 2 / 3, 34, 120)
  return <PhysicsDiagram title={assessment
    ? 'Wave fronts crossing a boundary from material 1, above, into material 2, below. A dotted normal is drawn where the centre of the beam meets the boundary.'
    : 'In material 2 the wave fronts are closer together and the wave bends towards the normal: the wave is slower in material 2.'}>
    <Panel s={s}>
      <Materials s={s} top="material 1" bottom="material 2" topFill="#f5f6f1" bottomFill="#efeaf5" boundary="#8f8aa6" size={15} nameColours={[ink, ink]} />
      <Beam s={s} />
      <Fronts s={s} />
      <Normal s={s} />
    </Panel>
    {!assessment && <g>
      <rect x={330} y={170} width={130} height={34} rx="14" fill={P.electrostatic} stroke={slowCol} strokeWidth="2" />
      <text x={395} y={192} textAnchor="middle" fontSize="14" fontWeight="800" fill={slowCol}>closer: slower</text>
    </g>}
  </PhysicsDiagram>
}

/* ================= Radio waves from oscillating electrons ================= */

const radio = emGroups.radio.line
const rodFill = '#dfe5ea', rodLine = '#7d8e9c', screenFill = '#1f3340', trace = '#7cc3ee', wire = P.wire

/** A small oscilloscope-style screen with `waves` cycles of a sine trace (0 = a flat direct-current line). */
function Screen({ x, y, w = 96, h = 62, waves = 2, amp = 0.3, label }: { x: number; y: number; w?: number; h?: number; waves?: number; amp?: number; label?: string }) {
  const n = 120, a = h * amp
  const d = waves === 0
    ? `M${x + 6} ${r1(y + h / 2 - h * 0.22)}H${x + w - 6}`
    : Array.from({ length: n + 1 }, (_, k) => { const t = k / n; return `${k ? 'L' : 'M'}${r1(x + 6 + t * (w - 12))} ${r1(y + h / 2 - Math.sin(t * waves * Math.PI * 2) * a)}` }).join('')
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="8" fill={screenFill} stroke="#5a6b79" strokeWidth="2.2" />
    <path d={`M${x + 4} ${y + h / 2}H${x + w - 4}`} stroke="#48606f" strokeWidth="1.2" strokeDasharray="4 4" />
    <path d={d} stroke={trace} strokeWidth="2.6" fill="none" />
    {label && <text x={x + w / 2} y={y - 8} textAnchor="middle" fontSize="14" fontWeight="800" fill={ink}>{label}</text>}
  </g>
}
function Electron({ x, y }: { x: number; y: number }) {
  return <g>
    <circle cx={x} cy={y} r="6.5" fill={P.charge} stroke={P.chargeLine} strokeWidth="1.5" />
    <path d={`M${x - 3} ${y}h6`} stroke="white" strokeWidth="1.8" />
  </g>
}
/** A double-headed arrow showing to-and-fro motion. */
function ToFro({ x, y, len = 30, colour = P.chargeLine }: { x: number; y: number; len?: number; colour?: string }) {
  return <g>
    <Arrow from={[x, y]} to={[x, y - len / 2]} colour={colour} width={2} head={0.8} />
    <Arrow from={[x, y]} to={[x, y + len / 2]} colour={colour} width={2} head={0.8} />
  </g>
}
/** An aerial rod on a short stand, with oscillating electrons in it. */
function Aerial({ x, top = 70, bottom = 236, electrons = true }: { x: number; top?: number; bottom?: number; electrons?: boolean }) {
  return <g>
    <rect x={x - 7} y={top} width={14} height={bottom - top} rx="7" fill={rodFill} stroke={rodLine} strokeWidth="2" />
    {electrons && [0.25, 0.5, 0.75].map(f => { const y = r1(top + (bottom - top) * f); return <g key={f}><Electron x={x} y={y} /><ToFro x={x + 20} y={y} /></g> })}
  </g>
}
function Box({ x, y, w, h, title, hot = false }: { x: number; y: number; w: number; h: number; title: string; hot?: boolean }) {
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="12" fill={hot ? '#fff6e3' : '#eef2f5'} stroke={hot ? '#e7b75e' : '#5a6b79'} strokeWidth="2" />
    <text x={x + w / 2} y={y + h + 20} textAnchor="middle" fontSize="14" fontWeight="750" fill={ink}>{title}</text>
  </g>
}

type RadioStep = 'ac' | 'make' | 'receive' | 'same' | 'all'
const TX = 150, RX = 390
function RadioScene({ step }: { step: RadioStep }) {
  const n = ['ac', 'make', 'receive', 'same', 'all'].indexOf(step)
  const waves = n >= 1, rx = n >= 2, rxScreen = n >= 3, all = step === 'all'
  const titles: Record<RadioStep, string> = {
    ac: 'A transmitter sends an alternating current, shown as a wave trace on its screen, into a tall metal aerial. The electrons in the aerial move up and down, again and again: they oscillate.',
    make: 'The electrons oscillating in the transmitter aerial produce radio waves, which travel away from the aerial and transfer energy.',
    receive: 'The radio waves reach a receiver aerial and are absorbed. They make the electrons in the receiver aerial oscillate too.',
    same: 'The oscillating electrons make an alternating current in the receiver. Its screen shows a trace with the same number of waves as the transmitter screen: the same frequency as the radio wave.',
    all: 'Put it together: an alternating current in the transmitter makes electrons in its aerial oscillate, producing radio waves. The radio waves are absorbed by the receiver aerial, making its electrons oscillate and giving an alternating current with the same frequency.',
  }
  return <PhysicsDiagram viewBox={all ? '0 0 540 340' : '0 0 540 300'} title={titles[step]}>
    {/* transmitter */}
    <g opacity={n === 2 ? faded + 0.25 : 1}>
      <Box x={18} y={168} w={108} h={84} title="transmitter" hot={step === 'ac' || step === 'same'} />
      <Screen x={24} y={176} w={96} h={56} waves={2.5} />
      <path d={`M126 214H${TX - 16}Q${TX} 214 ${TX} 236`} stroke={wire} strokeWidth="2.6" fill="none" />
      <Aerial x={TX} top={60} bottom={240} />
    </g>
    {/* radio waves */}
    {waves && <g opacity={step === 'ac' ? 0 : 1}>
      <WaveArrow from={[TX + 36, 108]} to={[rx ? RX - 18 : RX - 30, 108]} wavelength={48} amp={11} colour={radio} width={3} />
      <WaveArrow from={[TX + 36, 168]} to={[rx ? RX - 18 : RX - 30, 168]} wavelength={48} amp={11} colour={radio} width={3} opacity={0.55} />
      <text x={240} y={82} textAnchor="middle" fontSize="15" fontWeight="750" fill={radio}>radio waves</text>
      {step === 'make' && <text x={(TX + RX) / 2} y={214} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>transfer energy</text>}
    </g>}
    {/* receiver */}
    {rx && <g>
      <Aerial x={RX} top={88} bottom={240} />
      <path d={`M${RX} 236Q${RX} 214 ${RX + 16} 214H424`} stroke={wire} strokeWidth="2.6" fill="none" />
      <Box x={424} y={168} w={108} h={84} title="receiver" hot={step === 'same'} />
      {rxScreen ? <Screen x={430} y={176} w={96} h={56} waves={2.5} amp={0.22} /> : <rect x={430} y={176} width={96} height={56} rx="8" fill={screenFill} stroke="#5a6b79" strokeWidth="2.2" />}
    </g>}
    {/* labels per step */}
    {step === 'ac' && <g>
      <Lines x={196} y={92} lines={['electrons move', 'up and down,', 'again and again:']} size={14} colour={P.chargeLine} />
      <Lines x={196} y={150} lines={['they oscillate']} size={16} colour={P.chargeLine} />
      <Lines x={196} y={196} lines={['alternating current', 'from the transmitter']} size={13} weight={650} colour={muted} />
      <Lines x={TX} y={44} anchor="middle" lines={['aerial']} size={14} colour={ink} />
    </g>}
    {step === 'make' && <Lines x={TX} y={44} anchor="middle" lines={['oscillating electrons']} size={13} colour={P.chargeLine} />}
    {step === 'receive' && <g>
      <Lines x={RX + 20} y={52} anchor="middle" lines={['absorbed: electrons', 'oscillate here too']} size={13} colour={P.chargeLine} />
    </g>}
    {step === 'same' && <g>
      <rect x={196} y={222} width={150} height={32} rx="15" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
      <text x={271} y={243} textAnchor="middle" fontSize="15" fontWeight="800" fill="#8a5a14">same frequency</text>
      <Lines x={RX + 20} y={52} anchor="middle" lines={['alternating current', 'in the receiver']} size={13} colour={ink} />
    </g>}
    {all && <g>
      {['ac', 'electrons oscillate', 'radio waves', 'electrons oscillate', 'ac'].map((t, k) => {
        const w = [44, 150, 100, 150, 44][k], gap = 10
        const xs = [0, 44, 194, 294, 444].map((v, j) => v + j * gap + 6)
        const x = xs[k], c = k === 2 ? radio : k % 2 ? P.chargeLine : ink
        return <g key={k}>
          <rect x={x} y={292} width={w} height={32} rx="16" fill="white" stroke={c} strokeWidth="1.8" />
          <text x={x + w / 2} y={313} textAnchor="middle" fontSize="12.5" fontWeight="750" fill={c}>{t}</text>
          {k < 4 && <path d={`M${x + w + 2} 308h${gap - 4}`} stroke={muted} strokeWidth="2" />}
        </g>
      })}
      <Lines x={TX} y={44} anchor="middle" lines={['oscillate']} size={13} colour={P.chargeLine} />
      <Lines x={RX} y={74} anchor="middle" lines={['oscillate']} size={13} colour={P.chargeLine} />
      <rect x={206} y={222} width={130} height={28} rx="14" fill="#fff6e3" stroke="#e7b75e" strokeWidth="1.8" />
      <text x={271} y={241} textAnchor="middle" fontSize="13" fontWeight="750" fill="#8a5a14">same frequency</text>
    </g>}
  </PhysicsDiagram>
}

/** Question: which receiver screen matches transmitter screen X? A has twice the frequency, B the same, C is a direct current. */
function QuestionTraces({ assessment }: { assessment: boolean }) {
  return <PhysicsDiagram schematic={false} title={assessment
    ? 'Screen X shows the alternating current in a transmitter aerial. Below it are three more screens, A, B and C, each showing a different trace.'
    : 'Screen B has the same number of waves as screen X, so the same frequency. Screen A has twice as many waves. Screen C is a flat line: a direct current.'}>
    <Screen x={200} y={34} w={140} h={74} waves={2} amp={0.3} />
    <text x={186} y={78} textAnchor="end" fontSize="16" fontWeight="800" fill={ink}>X</text>
    <text x={270} y={128} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>transmitter</text>
    {([['A', 4, 0.3], ['B', 2, 0.22], ['C', 0, 0]] as [string, number, number][]).map(([l, w, a], k) => {
      const x = 22 + k * 174
      return <g key={l}>
        <Screen x={x} y={170} w={150} h={78} waves={w} amp={a} />
        <text x={x + 75} y={160} textAnchor="middle" fontSize="16" fontWeight="800" fill={ink}>{l}</text>
        {!assessment && l === 'B' && <Tick x={x + 75} y={274} />}
      </g>
    })}
  </PhysicsDiagram>
}

export function HigherWaveVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'hwave-fronts': return <FrontsFrame />
    case 'hwave-slow': return <SlowFrame />
    case 'hwave-turn': return <TurnFrame />
    case 'hwave-wavelength': return <WavelengthFrame />
    case 'hwave-all': return <AllFrame />
    case 'hwave-q-fronts': return <QuestionFronts assessment={assessment} />
    case 'hwave-radio-ac': return <RadioScene step="ac" />
    case 'hwave-radio-make': return <RadioScene step="make" />
    case 'hwave-radio-receive': return <RadioScene step="receive" />
    case 'hwave-radio-same': return <RadioScene step="same" />
    case 'hwave-radio-all': return <RadioScene step="all" />
    case 'hwave-q-traces': return <QuestionTraces assessment={assessment} />
    default: return focus.startsWith('hwave-radio') ? <RadioScene step="all" /> : <AllFrame />
  }
}
