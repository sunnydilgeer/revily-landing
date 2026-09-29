import { type ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, Leader, type Pt } from './PhysicsKit'
import { Num, Arrow, Hand } from './EnergyStoreVisuals'
import { WaveArrow, waveColour } from './EmSpectrumVisuals'

/*
 * Physics Lesson 60: Investigating infrared emission (Leslie cube). Original, code-native schematics; not to scale.
 * Focus ids start with 'iremit-'.
 *
 * One scene is reused through the lesson: a Leslie cube on a heat-proof mat, a pencilled square 10 cm out from the
 * cube, and an infrared detector with a meter standing on the line. The cube is drawn in a soft oblique view (front
 * face and right-hand face showing). Infrared is the wavy warm-red arrow used for infrared in Lessons 57–59: more
 * arrows and thicker arrows mean more infrared. Pieces that the absorption lesson (IrAbsorbVisuals) shares are exported.
 */
const { ink, muted } = P
const r1 = (n: number) => Math.round(n * 10) / 10
const ir = waveColour.ir

export type Surface = 'black' | 'white' | 'shiny' | 'dull'
export const surfaces: Record<Surface, { name: string; fill: string; line: string; text: string }> = {
  black: { name: 'matt black', fill: '#3d444b', line: '#22282d', text: 'white' },
  white: { name: 'matt white', fill: '#f7f6f1', line: '#9aa3aa', text: ink },
  shiny: { name: 'shiny metal', fill: '#e2e9ef', line: '#6f8494', text: ink },
  dull: { name: 'dull metal', fill: '#a9b1b7', line: '#6b757c', text: ink },
}
const mat = '#e9e1d2', matLine = '#a4927a', steel = '#c9d0d6', steelLine = '#6b7883'

/* ---------- Geometry for the oblique view ---------- */

type Face = { o: Pt; u: Pt; v: Pt }
const at = (f: Face, a: number, b: number): Pt => [r1(f.o[0] + f.u[0] * a + f.v[0] * b), r1(f.o[1] + f.u[1] * a + f.v[1] * b)]
const poly = (pts: Pt[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join('') + 'Z'
const quad = (f: Face) => poly([at(f, 0, 0), at(f, 1, 0), at(f, 1, 1), at(f, 0, 1)])
/** Depth runs back and to the right. */
const DEPTH: Pt = [0.5, -0.34]

/** A face with its surface finish: shiny gets bright streaks, dull a fine speckle. */
function SurfaceFace({ face, surface, label = false, size = 13 }: { face: Face; surface: Surface; label?: boolean; size?: number }) {
  const S = surfaces[surface]
  return <g>
    <path d={quad(face)} fill={S.fill} stroke={S.line} strokeWidth="2" />
    {surface === 'shiny' && <g stroke="white" strokeWidth="4" opacity=".95">
      {[[0.18, 0.28, 0.5, 0.86], [0.42, 0.14, 0.78, 0.7]].map(([a1, b1, a2, b2], i) => { const p = at(face, a1, b1), q = at(face, a2, b2); return <path key={i} d={`M${p[0]} ${p[1]}L${q[0]} ${q[1]}`} /> })}
    </g>}
    {surface === 'dull' && <g fill="#8a939a">
      {[[0.2, 0.3], [0.5, 0.2], [0.75, 0.4], [0.3, 0.65], [0.62, 0.72], [0.85, 0.82], [0.14, 0.86], [0.45, 0.45]].map(([a, b], i) => { const p = at(face, a, b); return <circle key={i} cx={p[0]} cy={p[1]} r="1.6" /> })}
    </g>}
    {label && (() => { const c = at(face, 0.5, 0.5); return <Lines x={c[0]} y={c[1] + 5} anchor="middle" lines={[S.name]} size={size} colour={S.text} /> })()}
  </g>
}

/**
 * A Leslie cube in oblique view. (x, y) is the front bottom-left corner on the mat; s is the side. `front` and
 * `side` choose the two faces that show.
 */
export function LeslieCube({ x, y, s = 90, front = 'white', side = 'black', labels = false, lid = true }: { x: number; y: number; s?: number; front?: Surface; side?: Surface; labels?: boolean; lid?: boolean }) {
  const u: Pt = [s * DEPTH[0], s * DEPTH[1]]
  const F: Face = { o: [x, y], u: [s, 0], v: [0, -s] }
  const R: Face = { o: [x + s, y], u, v: [0, -s] }
  const T: Face = { o: [x, y - s], u: [s, 0], v: u }
  const hole = at(T, 0.5, 0.5)
  return <g>
    <SurfaceFace face={F} surface={front} label={labels} />
    <SurfaceFace face={R} surface={side} label={labels} size={12} />
    <path d={quad(T)} fill={steel} stroke={steelLine} strokeWidth="2" />
    <ellipse cx={hole[0]} cy={hole[1]} rx={s * 0.16} ry={s * 0.07} fill="#56636e" stroke={steelLine} strokeWidth="1.6" />
    {lid && <g>
      <ellipse cx={hole[0] + s * 0.36} cy={hole[1] - s * 0.02} rx={s * 0.15} ry={s * 0.065} fill="#e7eaec" stroke={steelLine} strokeWidth="1.6" />
      <path d={`M${hole[0] + s * 0.36} ${hole[1] - s * 0.08}v-6`} stroke={steelLine} strokeWidth="3" />
    </g>}
  </g>
}

/** The heat-proof mat, an oblique slab. (x, y) is its front-left corner; w wide, d deep. */
export function Mat({ x, y, w = 330, d = 150 }: { x: number; y: number; w?: number; d?: number }) {
  const top: Face = { o: [x, y], u: [w, 0], v: [d * DEPTH[0], d * DEPTH[1]] }
  return <g>
    <path d={`M${x} ${y}H${x + w}v8H${x}Z`} fill="#d3c7b1" stroke={matLine} strokeWidth="1.6" />
    <path d={poly([at(top, 0, 0), at(top, 1, 0), [at(top, 1, 0)[0] + d * DEPTH[0], at(top, 1, 0)[1] + d * DEPTH[1]], at(top, 0, 1)])} fill={mat} stroke={matLine} strokeWidth="1.8" />
    <path d={`M${x + w} ${y}l${r1(d * DEPTH[0])} ${r1(d * DEPTH[1])}v8l${r1(-d * DEPTH[0])} ${r1(-d * DEPTH[1])}Z`} fill="#cbbfa8" stroke={matLine} strokeWidth="1.6" />
  </g>
}

/** The pencilled square on the mat, `gap` out from the cube's footprint. */
function PencilSquare({ x, y, s, gap }: { x: number; y: number; s: number; gap: number }) {
  const dv: Pt = DEPTH
  const p = (a: number, b: number): Pt => [r1(x + a + b * dv[0]), r1(y + b * dv[1])]
  return <path d={poly([p(-gap, -gap), p(s + gap, -gap), p(s + gap, s + gap), p(-gap, s + gap)])} fill="none" stroke="#6c6c6c" strokeWidth="1.5" strokeDasharray="5 4" />
}

/**
 * An infrared detector with a meter, standing on the mat. (x, y) is its base; the sensor faces left (dir −1) or
 * right (dir 1). `level` 0–1 swings the meter needle.
 */
export function Detector({ x, y, dir = -1, level = 0.5, s = 1 }: { x: number; y: number; dir?: number; level?: number; s?: number }) {
  const a = Math.PI * (1 - level), nx = r1(Math.cos(a) * 17), ny = r1(-Math.sin(a) * 17)
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-5 0V-18M5 0V-18" stroke="#4f5d69" strokeWidth="3" />
    <ellipse cx="0" cy="0" rx="18" ry="4" fill="#9aa6b0" stroke="#4f5d69" strokeWidth="1.4" />
    <g transform={`scale(${dir > 0 ? -1 : 1} 1)`}>
      <path d="M-30 -44H-44Q-48 -44 -48 -40V-32Q-48 -28 -44 -28H-30Z" fill="#4f5d69" stroke="#33404b" strokeWidth="1.6" />
      <ellipse cx="-48" cy="-36" rx="3" ry="7" fill="#f3b2a5" stroke="#33404b" strokeWidth="1.4" />
    </g>
    <rect x="-30" y="-60" width="60" height="44" rx="8" fill="#e5ebf0" stroke="#4f5d69" strokeWidth="2" />
    <path d="M-19 -26A19 19 0 0 1 19 -26Z" fill="white" stroke="#7d8e9c" strokeWidth="1.4" />
    {[0.1, 0.3, 0.5, 0.7, 0.9].map(k => { const b = Math.PI * (1 - k); return <path key={k} d={`M${r1(Math.cos(b) * 15)} ${r1(-26 - Math.sin(b) * 15)}L${r1(Math.cos(b) * 19)} ${r1(-26 - Math.sin(b) * 19)}`} stroke="#7d8e9c" strokeWidth="1.3" /> })}
    <path d={`M0 -26L${nx} ${r1(-26 + ny)}`} stroke={P.hot} strokeWidth="2.4" />
    <circle cx="0" cy="-26" r="2.4" fill={ink} />
  </g>
}

/** A kettle; (x, y) is the middle of its base. `tilt` pours it to the right (degrees). */
export function Kettle({ x, y, s = 1, tilt = 0, steam = true }: { x: number; y: number; s?: number; tilt?: number; steam?: boolean }) {
  return <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s})`}>
    <path d="M-36 0Q-42 -54 -24 -66H24Q42 -54 36 0Z" fill="#eef2f5" stroke="#6b7883" strokeWidth="2.2" />
    <path d="M36 -40Q54 -42 58 -64" stroke="#6b7883" strokeWidth="7" fill="none" />
    <path d="M36 -40Q54 -42 58 -64" stroke="#eef2f5" strokeWidth="3.4" fill="none" />
    <path d="M-30 -56Q-58 -58 -54 -26Q-52 -12 -36 -12" stroke="#4f5d69" strokeWidth="6" fill="none" />
    <rect x="-14" y="-74" width="28" height="9" rx="4" fill="#dfe5ea" stroke="#6b7883" strokeWidth="1.8" />
    <rect x="-26" y="-6" width="52" height="6" rx="2" fill="#4f5d69" />
    {steam && <g stroke="#b9c3cc" strokeWidth="2.2" fill="none"><path d="M60 -72c-6 -8 6 -12 0 -22" /><path d="M70 -76c-6 -8 6 -12 0 -22" /></g>}
  </g>
}

/** Infrared arrows leaving a point sideways; n arrows, spread vertically. */
function IrOut({ from, to, n = 3, spread = 28, width = 2.8, opacity = 1 }: { from: Pt; to: Pt; n?: number; spread?: number; width?: number; opacity?: number }) {
  return <g>{Array.from({ length: n }, (_, i) => {
    const dy = n === 1 ? 0 : (i - (n - 1) / 2) * spread
    return <WaveArrow key={i} from={[from[0], from[1] + dy]} to={[to[0], to[1] + dy * 1.25]} wavelength={11} amp={4} colour={ir} width={width} opacity={opacity} />
  })}</g>
}

/* ---------- Section 1: the idea ---------- */

function Jug({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-26 0L-30 -64H26L22 0Z" fill={P.coldFill} stroke={P.cold} strokeWidth="2.2" />
    <path d="M-28 -42H24" stroke={P.cold} strokeWidth="1.4" opacity=".6" />
    <path d="M26 -54Q44 -50 40 -30Q38 -18 24 -18" stroke={P.cold} strokeWidth="5" fill="none" />
  </g>
}
function Temp() {
  return <PhysicsDiagram title="A hot kettle gives out lots of infrared radiation. A cool jug beside it gives out only a little. The hotter an object is, the more infrared it emits.">
    <path d="M10 236H530" stroke="#b9c7a8" strokeWidth="2.2" />
    <ellipse cx={132} cy={190} rx="70" ry="56" fill={P.hotFill} opacity=".8" />
    <Kettle x={126} y={234} steam={false} />
    {[[-150, -40], [-120, -95], [0, -125], [120, -95], [150, -40]].map(([dx, dy], i) => {
      const a = Math.atan2(dy, dx), c: Pt = [128, 190]
      return <WaveArrow key={i} from={[r1(c[0] + Math.cos(a) * 64), r1(c[1] + Math.sin(a) * 56)]} to={[r1(c[0] + Math.cos(a) * 128), r1(c[1] + Math.sin(a) * 118)]} wavelength={11} amp={4.5} colour={ir} width={3} />
    })}
    <Jug x={404} y={234} />
    <WaveArrow from={[436, 186]} to={[486, 160]} wavelength={11} amp={3} colour={ir} width={1.6} opacity={0.7} />
    <Lines x={128} y={264} anchor="middle" lines={['hot: lots of infrared']} size={15} colour={P.hot} />
    <Lines x={404} y={264} anchor="middle" lines={['cool: a little']} size={15} colour={P.cold} />
  </PhysicsDiagram>
}

function Can({ x, y, surface }: { x: number; y: number; surface: Surface }) {
  const S = surfaces[surface]
  return <g>
    <path d={`M${x - 40} ${y - 120}V${y}Q${x} ${y + 14} ${x + 40} ${y}V${y - 120}`} fill={S.fill} stroke={S.line} strokeWidth="2.2" />
    <ellipse cx={x} cy={y - 120} rx="40" ry="12" fill={steel} stroke={steelLine} strokeWidth="2" />
    {surface === 'shiny' && <path d={`M${x - 22} ${y - 104}V${y - 10}M${x - 10} ${y - 104}V${y - 6}`} stroke="white" strokeWidth="5" opacity=".95" />}
  </g>
}
function SurfaceView() {
  return <PhysicsDiagram title="Two cans of hot water at the same temperature. The matt black can gives out more infrared than the shiny silver can. Same temperature, different surface.">
    <path d="M10 236H530" stroke="#b9c7a8" strokeWidth="2.2" />
    <Can x={150} y={228} surface="black" />
    <IrOut from={[196, 158]} to={[268, 150]} n={4} spread={22} width={3} />
    <Can x={390} y={228} surface="shiny" />
    <IrOut from={[436, 158]} to={[490, 150]} n={1} width={1.8} opacity={0.75} />
    <Lines x={150} y={264} anchor="middle" lines={['matt black']} size={15} />
    <Lines x={390} y={264} anchor="middle" lines={['shiny silver']} size={15} />
    <rect x={150} y={20} width={240} height={50} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <Lines x={270} y={40} anchor="middle" lines={['same temperature,', 'different surface']} size={14} />
  </PhysicsDiagram>
}

function CubeView() {
  return <PhysicsDiagram title="A Leslie cube: a hollow metal cube filled with hot water through a hole in the top. Its four side faces are matt black, matt white, shiny metal and dull metal.">
    <LeslieCube x={130} y={240} s={150} front="white" side="black" labels />
    <Leader from={[330, 44]} to={[228, 70]} />
    <Lines x={336} y={40} lines={['fill with hot water here']} size={14} />
    <rect x={400} y={96} width={128} height={162} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <Lines x={464} y={118} anchor="middle" lines={['the other two:']} size={13} weight={650} colour={muted} />
    {(['shiny', 'dull'] as Surface[]).map((k, i) => <g key={k}>
      <SurfaceFace face={{ o: [436, 170 + i * 66], u: [56, 0], v: [0, -38] }} surface={k} />
      <Lines x={464} y={170 + i * 66 + 17} anchor="middle" lines={[surfaces[k].name]} size={13} />
    </g>)}
    <Lines x={205} y={276} anchor="middle" lines={['four side faces, four surfaces']} size={14} weight={650} colour={muted} />
  </PhysicsDiagram>
}

/* ---------- Section 2: the method ---------- */

/** The standard scene: mat, cube, pencilled square and detector on the line facing the right-hand face. */
const SC = { cx: 150, cy: 228, s: 96, gap: 50 }
const faceMid: Pt = [SC.cx + SC.s + SC.s * DEPTH[0] / 2, SC.cy + SC.s * DEPTH[1] / 2]
const lineMid: Pt = [faceMid[0] + SC.gap, faceMid[1]]
function Scene({ level = 0.6, square = true, detector = true, gapArrow = false }: { level?: number; square?: boolean; detector?: boolean; gapArrow?: boolean }) {
  const { cx, cy, s, gap } = SC, ds = 0.85
  return <g>
    <Mat x={36} y={258} w={336} d={250} />
    {square && <PencilSquare x={cx} y={cy} s={s} gap={gap} />}
    <LeslieCube x={cx} y={cy} s={s} front="white" side="black" />
    {detector && <Detector x={lineMid[0] + 48 * ds} y={lineMid[1]} level={level} s={ds} />}
    {gapArrow && <g>
      <path d={`M${faceMid[0] + 3} ${faceMid[1] + 22}H${lineMid[0] - 3}`} stroke={ink} strokeWidth="1.8" />
      <path d={`M${faceMid[0] + 3} ${faceMid[1] + 16}v12M${lineMid[0] - 3} ${faceMid[1] + 16}v12`} stroke={ink} strokeWidth="1.8" />
      <rect x={(faceMid[0] + lineMid[0]) / 2 - 26} y={faceMid[1] + 29} width={52} height={20} rx="10" fill="white" />
      <Lines x={(faceMid[0] + lineMid[0]) / 2} y={faceMid[1] + 44} anchor="middle" lines={['10 cm']} size={14} />
    </g>}
  </g>
}

function Kit() {
  return <PhysicsDiagram title="The equipment: a Leslie cube on a heat-proof mat, an infrared detector, a pencil to draw the square on the mat, and a kettle to boil the water.">
    <Scene />
    <Kettle x={470} y={272} s={0.8} steam={false} />
    <g transform="translate(410 44) rotate(18)"><rect x="0" y="0" width="90" height="10" rx="3" fill="#f1c95e" stroke="#b08a2e" strokeWidth="1.6" /><path d="M90 0L104 5L90 10Z" fill="#e8cfa6" stroke="#b08a2e" strokeWidth="1.4" /><path d="M100 3.6L104 5L100 6.4Z" fill={ink} /></g>
    <Leader from={[92, 72]} to={[172, 150]} />
    <Lines x={20} y={64} lines={['Leslie cube']} size={14} />
    <Leader from={[40, 282]} to={[70, 262]} />
    <Lines x={20} y={296} lines={['heat-proof mat']} size={14} />
    <Leader from={[330, 100]} to={[358, 160]} />
    <Lines x={276} y={92} lines={['infrared detector']} size={14} />
    <Lines x={456} y={34} anchor="middle" lines={['pencil']} size={14} />
    <Lines x={470} y={190} anchor="middle" lines={['kettle']} size={14} />
  </PhysicsDiagram>
}

function Safety() {
  // The kettle is tilted so its spout sits just above the hole in the top of the cube.
  return <PhysicsDiagram title="Filling the Leslie cube from a kettle of boiling water. Boiling water can scald. Do not pick up or move the cube just after filling it.">
    <Mat x={30} y={262} w={280} d={110} />
    <LeslieCube x={100} y={244} s={96} front="white" side="black" lid={false} />
    <Kettle x={104} y={120} s={0.85} tilt={40} />
    <path d="M178 112Q176 122 172 132" stroke={P.waterLine} strokeWidth="4.5" fill="none" />
    <g transform="translate(400 66)">
      <path d="M0 -40L42 34H-42Z" fill="#fde8a8" stroke="#c3930f" strokeWidth="3" />
      <text x="0" y="24" textAnchor="middle" fontSize="40" fontWeight="800" fill="#8a6a10">!</text>
    </g>
    <Lines x={400} y={124} anchor="middle" lines={['boiling water:', 'scalds']} size={15} colour={P.hot} />
    <g transform="translate(400 214)">
      <circle r="42" fill="white" stroke={P.wasted} strokeWidth="3.5" />
      <rect x="-17" y="-4" width="34" height="30" rx="3" fill={surfaces.white.fill} stroke={surfaces.white.line} strokeWidth="1.8" />
      <Arrow from={[0, -8]} to={[0, -32]} colour={ink} width={3} />
      <path d="M-30 -30L30 30" stroke={P.wasted} strokeWidth="4.5" />
    </g>
    <Lines x={400} y={280} anchor="middle" lines={['do not move it', 'just after filling']} size={14} colour={P.wasted} />
  </PhysicsDiagram>
}

function Detect() {
  return <PhysicsDiagram title="The detector stands on the pencilled line, 10 cm from one face of the cube, facing it. The meter shows the reading.">
    <Scene gapArrow level={0.7} />
    <IrOut from={[faceMid[0] + 6, faceMid[1] - 34]} to={[lineMid[0] - 8, faceMid[1] - 34]} n={2} spread={16} width={2} />
    <Leader from={[92, 72]} to={[120, 214]} />
    <Lines x={20} y={50} lines={['pencilled square,', '10 cm from every face']} size={13} weight={650} colour={muted} />
    <Leader from={[430, 80]} to={[362, 170]} />
    <Lines x={430} y={72} anchor="middle" lines={['reading']} size={15} colour={P.hot} />
  </PhysicsDiagram>
}

function Repeat() {
  const c: Pt = [190, 150], h = 42, g = 56
  const faces: { s: Surface; side: 'top' | 'right' | 'bottom' | 'left' }[] = [
    { s: 'black', side: 'right' }, { s: 'white', side: 'bottom' }, { s: 'shiny', side: 'left' }, { s: 'dull', side: 'top' },
  ]
  const out: Record<string, Pt> = { top: [0, -1], bottom: [0, 1], left: [-1, 0], right: [1, 0] }
  return <PhysicsDiagram title="Looking down on the cube. The detector is placed on the pencilled square facing each of the four faces in turn, always 10 cm away.">
    <rect x={c[0] - h - g} y={c[1] - h - g} width={2 * (h + g)} height={2 * (h + g)} fill="none" stroke="#6c6c6c" strokeWidth="1.5" strokeDasharray="5 4" />
    <rect x={c[0] - h} y={c[1] - h} width={2 * h} height={2 * h} rx="3" fill={steel} stroke={steelLine} strokeWidth="1.6" />
    <circle cx={c[0]} cy={c[1]} r="9" fill="#56636e" />
    {faces.map(({ s, side }) => {
      const S = surfaces[s], o = out[side], pp: Pt = [-o[1], o[0]]
      const mid: Pt = [c[0] + o[0] * h, c[1] + o[1] * h]
      const a: Pt = [mid[0] + pp[0] * h, mid[1] + pp[1] * h], b: Pt = [mid[0] - pp[0] * h, mid[1] - pp[1] * h]
      const inA: Pt = [a[0] - o[0] * 11, a[1] - o[1] * 11], inB: Pt = [b[0] - o[0] * 11, b[1] - o[1] * 11]
      const det: Pt = [mid[0] + o[0] * (g + 8), mid[1] + o[1] * (g + 8)]
      const ang = Math.atan2(o[1], o[0]) * 180 / Math.PI
      // A 10 cm marker beside the detector, from the face out to the line.
      const m0: Pt = [mid[0] + o[0] * 3 + pp[0] * 26, mid[1] + o[1] * 3 + pp[1] * 26], m1: Pt = [mid[0] + o[0] * (g - 3) + pp[0] * 26, mid[1] + o[1] * (g - 3) + pp[1] * 26]
      const tl: Pt = [(m0[0] + m1[0]) / 2 + pp[0] * 22, (m0[1] + m1[1]) / 2 + pp[1] * 22 + 4]
      return <g key={s}>
        <path d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}L${inB[0]} ${inB[1]}L${inA[0]} ${inA[1]}Z`} fill={S.fill} stroke={S.line} strokeWidth="1.8" />
        <g transform={`translate(${det[0]} ${det[1]}) rotate(${ang})`}>
          <rect x="0" y="-13" width="26" height="26" rx="5" fill="#e5ebf0" stroke="#4f5d69" strokeWidth="1.8" />
          <rect x="-8" y="-5" width="9" height="10" rx="2" fill="#4f5d69" />
        </g>
        <path d={`M${m0[0]} ${m0[1]}L${m1[0]} ${m1[1]}M${m0[0] - pp[0] * 5} ${m0[1] - pp[1] * 5}l${pp[0] * 10} ${pp[1] * 10}M${m1[0] - pp[0] * 5} ${m1[1] - pp[1] * 5}l${pp[0] * 10} ${pp[1] * 10}`} stroke={muted} strokeWidth="1.5" />
        <Lines x={tl[0]} y={tl[1]} anchor="middle" lines={['10 cm']} size={12} weight={650} colour={muted} />
      </g>
    })}
    <g>
      <Lines x={392} y={48} lines={['one face at a time']} size={14} weight={650} colour={muted} />
      {faces.map(({ s }, i) => <g key={s}>
        <rect x={392} y={70 + i * 42} width={26} height={26} rx="5" fill={surfaces[s].fill} stroke={surfaces[s].line} strokeWidth="1.8" />
        <Lines x={428} y={88 + i * 42} lines={[surfaces[s].name]} size={14} />
      </g>)}
      <Lines x={392} y={262} lines={['then repeat the', 'whole experiment']} size={13} weight={650} colour={muted} />
    </g>
  </PhysicsDiagram>
}

/* ---------- Section 3: results ---------- */

function FacePanel({ x, surface, level, n }: { x: number; surface: Surface; level: number; n: number }) {
  return <g>
    <rect x={x} y={20} width={250} height={206} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <SurfaceFace face={{ o: [x + 26, 190], u: [60, 0], v: [0, -120] }} surface={surface} />
    <IrOut from={[x + 96, 130]} to={[x + 150, 130]} n={n} spread={20} width={n > 2 ? 3 : 1.8} opacity={n > 2 ? 1 : 0.75} />
    <Detector x={x + 200} y={196} level={level} s={1.05} />
    <Lines x={x + 56} y={212} anchor="middle" lines={[surfaces[surface].name]} size={13} />
  </g>
}
function Results() {
  return <PhysicsDiagram title="Left: the matt black face sends lots of infrared to the detector and the meter reads high. Right: the shiny face sends only a little and the meter reads low. The highest reading shows the face that emits the most.">
    <FacePanel x={14} surface="black" level={0.88} n={4} />
    <FacePanel x={276} surface="shiny" level={0.14} n={1} />
    <Lines x={214} y={40} anchor="middle" lines={['high']} size={14} colour={P.hot} />
    <Lines x={476} y={40} anchor="middle" lines={['low']} size={14} colour={P.cold} />
    <rect x={120} y={246} width={300} height={34} rx="17" fill="#fff6e3" stroke="#e7b75e" strokeWidth="1.8" />
    <Lines x={270} y={268} anchor="middle" lines={['highest reading = most emitted']} size={15} />
  </PhysicsDiagram>
}

/** A simple bar chart of detector readings. */
function Bars({ items, values, max = 90, showValues = false, x0 = 90, w = 420 }: { items: Surface[]; values: number[]; max?: number; showValues?: boolean; x0?: number; w?: number }) {
  const base = 236, top = 44, H = base - top, slot = w / items.length, bw = Math.min(78, slot * 0.6)
  return <g>
    <path d={`M${x0} ${top - 10}V${base}H${x0 + w}`} stroke={ink} strokeWidth="2" fill="none" />
    <path d={`M${x0 - 6} ${top - 4}L${x0} ${top - 14}L${x0 + 6} ${top - 4}Z`} fill={ink} />
    <text transform={`translate(${x0 - 18} ${(base + top) / 2}) rotate(-90)`} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>infrared detector reading</text>
    {items.map((s, i) => {
      const S = surfaces[s], h = r1(values[i] / max * H), cx = x0 + slot * (i + 0.5)
      return <g key={s}>
        <rect x={r1(cx - bw / 2)} y={r1(base - h)} width={r1(bw)} height={h} rx="6" fill={S.fill} stroke={S.line} strokeWidth="2" />
        {s === 'shiny' && <path d={`M${r1(cx - bw / 4)} ${r1(base - h + 6)}V${base - 6}`} stroke="white" strokeWidth="4" />}
        {showValues && <Lines x={cx} y={r1(base - h - 8)} anchor="middle" lines={[String(values[i])]} size={15} />}
        <Lines x={cx} y={base + 22} anchor="middle" lines={surfaces[s].name.split(' ')} size={13} />
      </g>
    })}
  </g>
}
function Compare() {
  return <PhysicsDiagram title="A bar chart of detector readings. The matt black face gives a taller bar than the matt white face: black is the better emitter.">
    <Bars items={['black', 'white']} values={[78, 45]} x0={100} w={300} />
    <Arrow from={[430, 196]} to={[430, 70]} colour={P.hot} width={3} />
    <Lines x={444} y={120} lines={['black', 'emits', 'more']} size={15} colour={P.hot} />
  </PhysicsDiagram>
}

function Order() {
  const list: Surface[] = ['black', 'white', 'dull', 'shiny']
  return <PhysicsDiagram title="The four faces in order, from the most infrared emitted to the least: matt black, matt white, dull metal, shiny metal. The three matt (dull) surfaces emit more than the shiny one.">
    <path d="M40 66H364" stroke={P.useful} strokeWidth="2.2" fill="none" />
    <path d="M40 66v10M364 66v10" stroke={P.useful} strokeWidth="2.2" />
    <Lines x={202} y={52} anchor="middle" lines={['matt (not shiny)']} size={14} colour={P.useful} />
    {list.map((s, i) => {
      const x = 48 + i * 122
      return <g key={s}>
        <SurfaceFace face={{ o: [x, 180], u: [96, 0], v: [0, -90] }} surface={s} />
        <Num n={i + 1} x={x + 48} y={135} />
        <Lines x={x + 48} y={204} anchor="middle" lines={[surfaces[s].name]} size={14} />
      </g>
    })}
    <path d="M414 220H508" stroke={P.wasted} strokeWidth="2.2" />
    <path d="M414 220v-8M508 220v-8" stroke={P.wasted} strokeWidth="2.2" />
    <Lines x={461} y={238} anchor="middle" lines={['shiny']} size={14} colour={P.wasted} />
    <Arrow from={[60, 268]} to={[380, 268]} colour={ink} width={3} />
    <Lines x={40} y={294} lines={['more infrared']} size={14} colour={P.hot} />
    <Lines x={400} y={294} anchor="middle" lines={['less infrared']} size={14} colour={P.cold} />
  </PhysicsDiagram>
}

/* ---------- Questions ---------- */

function QReadings() {
  return <PhysicsDiagram title="A bar chart of infrared detector readings for the four faces: matt black 78, matt white 45, dull metal 40, shiny metal 12.">
    <Bars items={['black', 'white', 'dull', 'shiny']} values={[78, 45, 40, 12]} showValues x0={96} w={420} />
  </PhysicsDiagram>
}

function QSetup({ assessment }: { assessment: boolean }) {
  const names = ['Leslie cube', 'infrared detector', 'heat-proof mat', 'kettle']
  const tags: [Pt, Pt][] = [[[80, 60], [168, 120]], [[330, 70], [370, 150]], [[40, 286], [100, 262]], [[510, 150], [466, 214]]]
  return <PhysicsDiagram title={assessment ? 'The set-up for the infrared emission practical, with four parts numbered 1 to 4.' : 'The set-up: 1 is the Leslie cube, 2 is the infrared detector, 3 is the heat-proof mat and 4 is the kettle.'}>
    <Scene />
    <Kettle x={462} y={276} s={0.8} steam={false} />
    {tags.map(([p, q], i) => <g key={i}>
      <path d={`M${p[0]} ${p[1]}L${q[0]} ${q[1]}`} stroke={ink} strokeWidth="1.4" /><circle cx={q[0]} cy={q[1]} r="2.6" fill={ink} />
      <Num n={i + 1} x={p[0]} y={p[1]} />
      {!assessment && <Lines x={p[0] + 18} y={p[1] + 5} lines={[names[i]]} size={13} />}
    </g>)}
  </PhysicsDiagram>
}

export function IrEmitVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  const views: Record<string, () => ReactNode> = {
    'iremit-temp': () => <Temp />,
    'iremit-surface': () => <SurfaceView />,
    'iremit-cube': () => <CubeView />,
    'iremit-kit': () => <Kit />,
    'iremit-safety': () => <Safety />,
    'iremit-detect': () => <Detect />,
    'iremit-repeat': () => <Repeat />,
    'iremit-results': () => <Results />,
    'iremit-compare': () => <Compare />,
    'iremit-order': () => <Order />,
    'iremit-q-readings': () => <QReadings />,
    'iremit-q-setup': () => <QSetup assessment={assessment} />,
  }
  return <>{views[focus]?.() ?? null}</>
}
