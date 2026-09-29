import { useId, type ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, Leader, type Pt } from './PhysicsKit'
import { Num, Tick } from './EnergyStoreVisuals'

/*
 * Physics Lesson 56: Refraction. Original, code-native schematics; not to scale. Focus ids start with 'refract-'.
 *
 * One ray scene is reused everywhere: pale air above, pale blue glass (or deeper blue water) below, a solid
 * boundary, a dotted normal, rays in the light colour with small arrowheads half-way along. Light goes from air
 * into glass, so the refracted ray is drawn closer to the normal, with angles from Snell's law (glass n = 1.5,
 * water n = 1.33) so every bend is physically right even though the lesson never states the rule.
 * Angle of incidence: violet arc. Angle of refraction: teal arc. Parts not in focus are faded.
 */
const { ink, muted } = P
const r1 = (n: number) => Math.round(n * 10) / 10
const rad = (d: number) => d * Math.PI / 180
const refr = (i: number, n: number) => Math.asin(Math.sin(rad(i)) / n) * 180 / Math.PI

const ray = P.lightLine, rayGlow = P.light
const aoiColour = P.pd, aorColour = P.electrostaticLine
const air = '#f6fafd', glass = '#dcebf4', glassLine = '#7fa8c2'
const water = P.water
const faded = 0.26
const rulerFill = '#fbf3df', rulerLine = '#b69457'

/* ---------- Small pieces ---------- */

/** A straight ray from a to b with a small arrowhead half-way along (the direction the light travels). */
function Ray({ a, b, colour = ray, width = 3.2, opacity = 1, headAt = 0.55 }: { a: Pt; b: Pt; colour?: string; width?: number; opacity?: number; headAt?: number }) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0])
  const m: Pt = [a[0] + (b[0] - a[0]) * headAt, a[1] + (b[1] - a[1]) * headAt]
  const s = 9
  const p = (d: number, w: number): string => `${r1(m[0] - Math.cos(ang) * d + Math.cos(ang + Math.PI / 2) * w)} ${r1(m[1] - Math.sin(ang) * d + Math.sin(ang + Math.PI / 2) * w)}`
  return <g opacity={opacity}>
    <path d={`M${r1(a[0])} ${r1(a[1])}L${r1(b[0])} ${r1(b[1])}`} stroke={rayGlow} strokeWidth={width + 5} opacity=".55" />
    <path d={`M${r1(a[0])} ${r1(a[1])}L${r1(b[0])} ${r1(b[1])}`} stroke={colour} strokeWidth={width} />
    <path d={`M${r1(m[0] + Math.cos(ang) * s * .45)} ${r1(m[1] + Math.sin(ang) * s * .45)}L${p(s * .55, s * .6)}L${p(s * .25, 0)}L${p(s * .55, -s * .6)}Z`} fill={colour} stroke={colour} strokeWidth="1.2" />
  </g>
}

/** A thin angle arc centred on o from direction a1 to a2 (degrees, screen angles), sweeping the short way. */
function Arc({ o, r, a1, a2, colour, width = 2.6, opacity = 1 }: { o: Pt; r: number; a1: number; a2: number; colour: string; width?: number; opacity?: number }) {
  const s: Pt = [o[0] + r * Math.cos(rad(a1)), o[1] + r * Math.sin(rad(a1))]
  const e: Pt = [o[0] + r * Math.cos(rad(a2)), o[1] + r * Math.sin(rad(a2))]
  const sweep = ((a2 - a1 + 360) % 360) < 180 ? 1 : 0
  return <g opacity={opacity}>
    <path d={`M${o[0]} ${o[1]}L${r1(s[0])} ${r1(s[1])}A${r} ${r} 0 0 ${sweep} ${r1(e[0])} ${r1(e[1])}Z`} fill={colour} fillOpacity=".12" stroke="none" />
    <path d={`M${r1(s[0])} ${r1(s[1])}A${r} ${r} 0 0 ${sweep} ${r1(e[0])} ${r1(e[1])}`} fill="none" stroke={colour} strokeWidth={width} />
  </g>
}

/** A ruler lying from a to b, offset sideways by `off`, with tick marks. */
function Ruler({ a, b, off = 16, w = 20, opacity = 1 }: { a: Pt; b: Pt; off?: number; w?: number; opacity?: number }) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI
  const ticks = Math.floor(len / 10)
  return <g transform={`translate(${r1(a[0])} ${r1(a[1])}) rotate(${r1(ang)})`} opacity={opacity}>
    <rect x={0} y={off} width={r1(len)} height={w} rx="3" fill={rulerFill} stroke={rulerLine} strokeWidth="1.6" />
    {Array.from({ length: ticks }, (_, k) => <path key={k} d={`M${k * 10 + 5} ${off}v${k % 5 === 0 ? 8 : 4.5}`} stroke={rulerLine} strokeWidth="1.1" />)}
  </g>
}

/** A label in the right-hand column with a leader to what it names. */
function Callout({ x, y, lines, to, colour = ink, opacity = 1, size = 14 }: { x: number; y: number; lines: string[]; to?: Pt; colour?: string; opacity?: number; size?: number }) {
  return <g opacity={opacity}>
    {to && <Leader from={[x - 6, y - 5]} to={to} colour={colour} />}
    <Lines x={x} y={y} lines={lines} size={size} colour={colour} />
  </g>
}

/* ---------- The ray scene ---------- */

type Box = { x: number; y: number; w: number; h: number }
type Parts = { normal?: boolean; square?: boolean; incident?: boolean; refracted?: boolean; arcI?: boolean; arcR?: boolean; straight?: boolean }

function makeScene(box: Box, by: number, ox: number, i: number, n: number, lenIn: number, lenOut: number) {
  const r = refr(i, n)
  const o: Pt = [ox, by]
  const start: Pt = [ox - lenIn * Math.sin(rad(i)), by - lenIn * Math.cos(rad(i))]
  const end: Pt = [ox + lenOut * Math.sin(rad(r)), by + lenOut * Math.cos(rad(r))]
  const straightEnd: Pt = [ox + lenOut * Math.sin(rad(i)), by + lenOut * Math.cos(rad(i))]
  return { box, by, o, i, r, start, end, straightEnd }
}
type Scene = ReturnType<typeof makeScene>

/** Air above, a second material below, the boundary between. */
function Materials({ s, top = 'air', bottom = 'glass', fill = glass, line = glassLine, names = true, nameSize = 15 }: { s: Scene; top?: string; bottom?: string; fill?: string; line?: string; names?: boolean; nameSize?: number }) {
  const clip = useId()
  const { box, by } = s
  return <g>
    <clipPath id={clip}><rect x={box.x} y={box.y} width={box.w} height={box.h} rx="18" /></clipPath>
    <g clipPath={`url(#${clip})`}>
      <rect x={box.x} y={box.y} width={box.w} height={by - box.y} fill={air} />
      <rect x={box.x} y={by} width={box.w} height={box.y + box.h - by} fill={fill} />
      <path d={`M${box.x + 20} ${by + 16}h${box.w * .22}M${box.x + box.w * .62} ${by + 26}h${box.w * .2}`} stroke="white" strokeWidth="3" opacity=".7" />
    </g>
    <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="18" fill="none" stroke={P.panelLine} strokeWidth="1.5" />
    <path d={`M${box.x} ${by}H${box.x + box.w}`} stroke={line} strokeWidth="2.8" />
    {names && <g>
      <text x={box.x + 14} y={box.y + 24} fontSize={nameSize} fontWeight="700" fill={muted}>{top}</text>
      <text x={box.x + 14} y={box.y + box.h - 12} fontSize={nameSize} fontWeight="700" fill={line === glassLine ? '#4f7f9c' : P.waterLine}>{bottom}</text>
    </g>}
  </g>
}

function Normal({ s, square = true, opacity = 1, colour = ink }: { s: Scene; square?: boolean; opacity?: number; colour?: string }) {
  const { box, o } = s
  return <g opacity={opacity}>
    <path d={`M${o[0]} ${box.y + 8}V${box.y + box.h - 8}`} stroke={colour} strokeWidth="2" strokeDasharray="2 6" />
    {square && <path d={`M${o[0] + 11} ${o[1]}v-11h-11`} fill="none" stroke={colour} strokeWidth="1.6" />}
  </g>
}

function RayParts({ s, parts, dim = [] as (keyof Parts)[], arcR = 42 }: { s: Scene; parts: Parts; dim?: (keyof Parts)[]; arcR?: number }) {
  const op = (k: keyof Parts) => dim.includes(k) ? faded : 1
  const { o, i, r } = s
  return <g>
    {parts.normal && <Normal s={s} square={parts.square} opacity={op('normal')} />}
    {parts.straight && <path d={`M${o[0]} ${o[1]}L${r1(s.straightEnd[0])} ${r1(s.straightEnd[1])}`} stroke={ray} strokeWidth="2" strokeDasharray="4 6" opacity=".55" />}
    {parts.arcI && <Arc o={o} r={arcR} a1={-90} a2={-90 - i} colour={aoiColour} opacity={op('arcI')} />}
    {parts.arcR && <Arc o={o} r={arcR} a1={90} a2={90 - r} colour={aorColour} opacity={op('arcR')} />}
    {parts.incident && <Ray a={s.start} b={o} opacity={op('incident')} />}
    {parts.refracted && <Ray a={o} b={s.end} opacity={op('refracted')} headAt={0.5} />}
    {(parts.incident || parts.refracted) && <circle cx={o[0]} cy={o[1]} r="3.2" fill={ray} />}
  </g>
}

/* ---------- Section 2: what is refraction? ---------- */

const MAIN: Box = { x: 24, y: 24, w: 300, h: 252 }

function Straw({ x, y }: { x: number; y: number }) {
  // A glass of water with a straw that looks bent (kinked) at the water surface.
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-44 -70L-38 60Q-37 70 -27 70H27Q37 70 38 60L44 -70" fill="#f4f9fc" stroke={glassLine} strokeWidth="2.2" />
    <path d="M-41.5 -26L-38 60Q-37 67 -27 67H27Q37 67 38 60L41.5 -26Z" fill={water} opacity=".85" />
    <path d="M-41.5 -26H41.5" stroke={P.waterLine} strokeWidth="2" />
    {/* straw above the water: steep; below the water: looks less steep */}
    <path d="M-22 -104L6 -26" stroke="#e98f7a" strokeWidth="8" />
    <path d="M6 -26L30 48" stroke="#e98f7a" strokeWidth="8" opacity=".9" transform="rotate(-26 6 -26)" />
    <path d="M-22 -104L6 -26" stroke="white" strokeWidth="2" opacity=".6" />
    <circle cx="6" cy="-26" r="7" fill="none" stroke={ink} strokeWidth="1.4" strokeDasharray="3 3" />
  </g>
}

function BoundaryScene({ step }: { step: 'boundary' | 'idea' }) {
  const s = makeScene(MAIN, 146, 174, 45, 1.5, 150, 132)
  const idea = step === 'idea'
  return <PhysicsDiagram title={idea
    ? 'A ray of light crosses the boundary from air into glass and changes direction there. This is refraction. Beside it, a straw in a glass of water looks bent at the water surface.'
    : 'Air above and glass below, with the boundary between them. A ray of light arrives from the top left and reaches the boundary.'}>
    <Materials s={s} />
    <RayParts s={s} parts={{ incident: true, refracted: idea, straight: idea }} />
    {idea ? <Lines x={314} y={138} anchor="end" lines={['boundary']} size={13} colour={muted} /> : <Callout x={340} y={151} lines={['boundary']} to={[300, 146]} size={15} />}
    {!idea && <Lines x={340} y={70} lines={['a ray of light', 'arrives at the', 'boundary']} size={14} weight={650} colour={muted} />}
    {idea && <g>
      <Lines x={60} y={200} lines={['changes', 'direction']} size={14} colour={ray} />
      <path d="M126 196Q160 190 176 168" stroke={ray} strokeWidth="1.6" fill="none" strokeDasharray="3 4" />
      <Straw x={444} y={160} />
      <Lines x={444} y={262} anchor="middle" lines={['a straw looks bent', 'at the surface']} size={13} weight={650} colour={muted} />
      <text x={174} y={17} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>refraction: the ray changes direction</text>
    </g>}
  </PhysicsDiagram>
}

function AnglePanels() {
  const L: Box = { x: 18, y: 44, w: 246, h: 200 }, R: Box = { x: 276, y: 44, w: 246, h: 200 }
  const a = makeScene(L, 144, 141, 45, 1.5, 120, 104)
  const b = makeScene(R, 144, 399, 0, 1.5, 96, 96)
  return <PhysicsDiagram title="Left: a ray meets the boundary at an angle and changes direction. Right: a ray goes straight in, at a right angle to the boundary, and carries on with no change of direction.">
    <Lines x={141} y={17} anchor="middle" lines={['meets the boundary', 'at an angle']} size={13} />
    <Lines x={399} y={17} anchor="middle" lines={['goes straight in,', 'at a right angle']} size={13} />
    <Materials s={a} nameSize={13} />
    <RayParts s={a} parts={{ incident: true, refracted: true, straight: true }} />
    <Materials s={b} nameSize={13} />
    <RayParts s={b} parts={{ incident: true, refracted: true }} />
    <path d={`M${399 + 10} 144v-10h-10`} fill="none" stroke={ink} strokeWidth="1.5" />
    <Tick x={141} y={272} />
    <Lines x={160} y={277} lines={['direction changes']} size={13} colour={P.useful} />
    <Lines x={399} y={277} anchor="middle" lines={['no change of direction']} size={13} colour={ink} />
  </PhysicsDiagram>
}

function MaterialPanels() {
  const L: Box = { x: 18, y: 44, w: 246, h: 200 }, R: Box = { x: 276, y: 44, w: 246, h: 200 }
  const a = makeScene(L, 132, 141, 55, 1.5, 104, 118)
  const b = makeScene(R, 132, 399, 55, 1.33, 104, 118)
  return <PhysicsDiagram title="The same ray going from air into glass, and from air into water. It bends by a different amount in each, so the bend depends on the two materials.">
    <Lines x={141} y={30} anchor="middle" lines={['air to glass']} size={15} />
    <Lines x={399} y={30} anchor="middle" lines={['air to water']} size={15} />
    <Materials s={a} nameSize={13} />
    <RayParts s={a} parts={{ incident: true, refracted: true, straight: true }} />
    <Materials s={b} bottom="water" fill={water} line={P.waterLine} nameSize={13} />
    <RayParts s={b} parts={{ incident: true, refracted: true, straight: true }} />
    <Lines x={141} y={272} anchor="middle" lines={['two materials, one bend']} size={13} weight={650} colour={muted} />
    <Lines x={399} y={272} anchor="middle" lines={['different materials, different bend']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

/* ---------- Section 3: what the lines mean ---------- */

const LAB: Box = { x: 24, y: 24, w: 316, h: 252 }
type LabelStep = 'rays' | 'normal' | 'incident' | 'aoi' | 'aor'
const labelTitles: Record<LabelStep, string> = {
  rays: 'A ray drawn with a ruler: a straight line with an arrow, travelling towards the boundary between air and glass.',
  normal: 'The normal is a dotted line drawn at right angles to the boundary, where the ray meets it.',
  incident: 'The incident ray is the ray that travels towards the boundary. It meets the boundary where the normal crosses it.',
  aoi: 'The angle of incidence is the angle between the incident ray and the normal. It is measured from the normal.',
  aor: 'The complete ray diagram: the refracted ray carries on in the glass in a new direction. The angle of refraction is between the refracted ray and the normal.',
}
function LabelScene({ step }: { step: LabelStep }) {
  const s = makeScene(LAB, 150, 190, 40, 1.5, 140, 124)
  const k = ['rays', 'normal', 'incident', 'aoi', 'aor'].indexOf(step)
  const on = (name: LabelStep) => step === name
  const parts: Parts = { incident: true, normal: k >= 1, square: k >= 1, arcI: k >= 3, refracted: k >= 4, arcR: k >= 4 }
  const dim: (keyof Parts)[] = step === 'incident' ? ['normal'] : step === 'aoi' ? ['incident', 'normal'] : step === 'aor' ? ['incident', 'arcI'] : []
  const midIn: Pt = [s.start[0] + (s.o[0] - s.start[0]) * .3, s.start[1] + (s.o[1] - s.start[1]) * .3]
  return <PhysicsDiagram title={labelTitles[step]}>
    <Materials s={s} />
    <RayParts s={s} parts={parts} dim={dim} arcR={46} />
    {step === 'rays' && <g>
      <Ruler a={s.start} b={s.o} off={14} />
      <Callout x={362} y={70} lines={['ray: a straight', 'line']} to={[midIn[0] + 4, midIn[1] - 2]} size={15} />
      <Lines x={362} y={128} lines={['drawn with a ruler,', 'with an arrow for', 'the direction']} size={13} weight={650} colour={muted} />
    </g>}
    {k >= 1 && <Callout x={362} y={46} lines={['normal', '(at right angles)']} to={[190, 42]} opacity={on('normal') ? 1 : .55} size={on('normal') ? 15 : 13} />}
    {k >= 1 && <Callout x={362} y={156} lines={['boundary']} to={[330, 150]} opacity={on('normal') ? 1 : .55} size={on('normal') ? 15 : 13} />}
    {k >= 2 && <g opacity={on('incident') ? 1 : .55}>
      <Lines x={40} y={on('incident') ? 124 : 122} lines={['incident', 'ray']} size={on('incident') ? 15 : 13} colour={ray} />
    </g>}
    {k >= 3 && <Callout x={362} y={96} lines={['angle of', 'incidence']} to={[174, 106]} colour={aoiColour} opacity={on('aoi') ? 1 : .55} size={on('aoi') ? 15 : 13} />}
    {on('aoi') && <Lines x={362} y={220} lines={['measured from', 'the normal,', 'not the boundary']} size={13} weight={650} colour={muted} />}
    {k >= 4 && <g>
      <Callout x={362} y={206} lines={['angle of', 'refraction']} to={[200, 194]} colour={aorColour} size={15} />
      <Callout x={362} y={254} lines={['refracted ray']} to={[228, 232]} colour={ray} size={15} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 4: five drawing steps ---------- */

const STEP_WORDS = ['boundary', 'normal', 'incident ray', 'refracted ray', 'angles']
function Steps({ active }: { active: number }) {
  return <g>
    {STEP_WORDS.map((w, k) => {
      const n = k + 1, cx = 60 + k * 105
      const state = n === active ? 'active' : n < active ? 'on' : 'off'
      return <g key={w}>
        {k > 0 && <path d={`M${cx - 105 + 16} 20H${cx - 16}`} stroke={P.panelLine} strokeWidth="2" />}
        <Num n={n} x={cx} y={20} state={state} />
        <text x={cx} y={48} textAnchor="middle" fontSize="13" fontWeight={n === active ? 750 : 600} fill={ink} opacity={n > active ? .42 : 1}>{w}</text>
      </g>
    })}
  </g>
}
const STEP_BOX: Box = { x: 24, y: 64, w: 316, h: 226 }
const stepTitles = [
  'Step 1: use a ruler to draw a straight boundary line. Write air above it and glass below it.',
  'Step 2: draw a dotted normal at right angles to the boundary.',
  'Step 3: draw the incident ray with a ruler so it meets the normal at the boundary, with an arrow.',
  'Step 4: draw the refracted ray from the same point into the glass, with an arrow pointing away from the boundary.',
  'Step 5: mark the angle of incidence and the angle of refraction. Both are measured from the normal.',
]
function StepScene({ step }: { step: number }) {
  const s = makeScene(STEP_BOX, 172, 190, 40, 1.5, 128, 108)
  const parts: Parts = { normal: step >= 2, square: step >= 2, incident: step >= 3, refracted: step >= 4, arcI: step >= 5, arcR: step >= 5 }
  const dim: (keyof Parts)[] = step === 5 ? ['normal'] : (['normal', 'incident', 'refracted'] as (keyof Parts)[]).filter((p, k) => step > k + 2)
  return <PhysicsDiagram title={stepTitles[step - 1]}>
    <Steps active={step} />
    <Materials s={s} nameSize={step === 1 ? 17 : 15} />
    {step === 1 && <g>
      <Ruler a={[44, 172]} b={[320, 172]} off={4} w={22} />
      <Lines x={362} y={150} lines={['a ruler-straight', 'boundary line']} size={15} />
      <Lines x={362} y={200} lines={['name the material', 'on each side']} size={13} weight={650} colour={muted} />
    </g>}
    <RayParts s={s} parts={parts} dim={dim} arcR={50} />
    {step === 2 && <g>
      <Callout x={362} y={96} lines={['dotted normal']} to={[190, 92]} size={15} />
      <Callout x={362} y={150} lines={['90° to the', 'boundary']} to={[204, 164]} size={15} />
    </g>}
    {step === 3 && <g>
      <Callout x={362} y={110} lines={['incident ray', 'with an arrow']} to={[s.start[0] + 30, s.start[1] + 36]} colour={ray} size={15} />
      <Callout x={362} y={176} lines={['meets the normal', 'at the boundary']} to={[194, 168]} size={13} colour={muted} />
    </g>}
    {step === 4 && <g>
      <Callout x={362} y={236} lines={['refracted ray,', 'same starting point']} to={[222, 240]} colour={ray} size={15} />
    </g>}
    {step === 5 && <g>
      <Callout x={362} y={122} lines={['angle of', 'incidence']} to={[172, 126]} colour={aoiColour} size={15} />
      <Callout x={362} y={214} lines={['angle of', 'refraction']} to={[202, 218]} colour={aorColour} size={15} />
      <Lines x={362} y={272} lines={['both from the normal']} size={13} weight={650} colour={muted} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 5: using a protractor ---------- */

const PROT_BOX: Box = { x: 24, y: 14, w: 330, h: 280 }
const PR = 126
/** A clear half-circle protractor. Local frame: base line along +x, dome towards −y; `turn` rotates it (degrees). */
function Protractor({ o, turn, highlight }: { o: Pt; turn: number; highlight?: number }) {
  const t = rad(turn)
  const w = (lx: number, ly: number): Pt => [r1(o[0] + lx * Math.cos(t) - ly * Math.sin(t)), r1(o[1] + lx * Math.sin(t) + ly * Math.cos(t))]
  const polar = (deg: number, r: number) => w(r * Math.cos(rad(deg)), -r * Math.sin(rad(deg)))
  const a = w(PR, 0), b = w(-PR, 0), top = polar(90, PR)
  const ticks: ReactNode[] = []
  for (let d = 0; d <= 180; d += 5) {
    const long = d % 10 === 0
    const p1 = polar(d, PR), p2 = polar(d, PR - (long ? 10 : 6))
    ticks.push(<path key={d} d={`M${p1[0]} ${p1[1]}L${p2[0]} ${p2[1]}`} stroke={d === highlight ? aoiColour : muted} strokeWidth={d === highlight ? 2.6 : 1.1} />)
  }
  const nums: ReactNode[] = []
  for (let d = 0; d <= 180; d += 20) {
    const at = d === 0 ? 5 : d === 180 ? 175 : d
    const pIn = polar(at, PR - 40), pOut = polar(at, PR - 22)
    const hot = d === highlight
    nums.push(<text key={`i${d}`} x={pIn[0]} y={pIn[1] + 4.5} textAnchor="middle" fontSize={hot ? 14 : 12} fontWeight={hot ? 800 : 650} fill={hot ? aoiColour : ink}>{d}</text>)
    nums.push(<text key={`o${d}`} x={pOut[0]} y={pOut[1] + 4} textAnchor="middle" fontSize="12" fontWeight="500" fill={muted} opacity=".7">{180 - d}</text>)
  }
  return <g>
    <path d={`M${a[0]} ${a[1]}A${PR} ${PR} 0 0 ${turn === 0 ? 0 : 0} ${b[0]} ${b[1]}Z`} fill="#fdfdf4" fillOpacity=".86" stroke={rulerLine} strokeWidth="2" />
    <path d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`} stroke={rulerLine} strokeWidth="2.6" />
    {ticks}{nums}
    <path d={`M${o[0]} ${o[1]}L${top[0]} ${top[1]}`} stroke={muted} strokeWidth=".8" opacity=".35" />
    <circle cx={o[0]} cy={o[1]} r="5" fill="none" stroke={ink} strokeWidth="1.8" />
    <path d={`M${w(0, -9)[0]} ${w(0, -9)[1]}L${w(0, 0)[0]} ${w(0, 0)[1]}`} stroke={ink} strokeWidth="2" />
  </g>
}
const protTitles = [
  'Using a protractor to draw a 40 degree angle of incidence. Put the centre mark of the protractor on the point where the boundary and the normal cross.',
  'Turn the protractor so its flat base line lies along the normal.',
  'Start from 0 degrees on the normal and make a small dot at 40 degrees.',
  'Take the protractor away. Use a ruler to join the dot to the crossing point, and add an arrow. The angle of incidence is 40 degrees.',
]
function ProtScene({ step }: { step: number }) {
  const s = makeScene(PROT_BOX, 158, 218, 40, 1.5, 136, 100)
  const o = s.o
  const dot: Pt = [r1(o[0] - PR * Math.sin(rad(40))), r1(o[1] - PR * Math.cos(rad(40)))]
  return <PhysicsDiagram title={protTitles[step - 1]}>
    <Materials s={s} />
    <Normal s={s} />
    {step === 1 && <g>
      <Protractor o={o} turn={0} />
      <Callout x={374} y={196} lines={['centre mark on', 'the crossing']} to={[o[0] + 4, o[1] + 4]} size={15} />
      <Lines x={374} y={70} lines={['goal: an angle', 'of incidence', 'of 40°']} size={13} weight={650} colour={muted} />
    </g>}
    {(step === 2 || step === 3) && <g>
      <Protractor o={o} turn={-90} highlight={step === 3 ? 40 : undefined} />
      {step === 2 && <g>
        <Callout x={374} y={80} lines={['base line on', 'the normal']} to={[o[0] + 3, o[1] - 70]} size={15} />
        <Lines x={374} y={200} lines={['centre mark', 'still on the', 'crossing']} size={13} weight={650} colour={muted} />
      </g>}
      {step === 3 && <g>
        <circle cx={dot[0]} cy={dot[1]} r="5" fill={aoiColour} stroke="white" strokeWidth="1.5" />
        <Callout x={374} y={60} lines={['0° on the normal,', 'dot at 40°']} to={[dot[0] + 4, dot[1] - 3]} colour={aoiColour} size={15} />
        <Lines x={374} y={200} lines={['two scales: count', 'up from 0 on the', 'normal']} size={13} weight={650} colour={muted} />
      </g>}
    </g>}
    {step === 4 && <g>
      <Arc o={o} r={50} a1={-90} a2={-130} colour={aoiColour} />
      <Ruler a={s.start} b={o} off={12} />
      <Ray a={s.start} b={o} headAt={0.4} />
      <circle cx={dot[0]} cy={dot[1]} r="4.5" fill={aoiColour} stroke="white" strokeWidth="1.5" />
      <circle cx={o[0]} cy={o[1]} r="3.2" fill={ray} />
      <text x={o[0] - 20} y={o[1] - 62} textAnchor="middle" fontSize="16" fontWeight="800" fill={aoiColour}>40°</text>
      <Callout x={374} y={196} lines={['ruler through', 'the dot and', 'the crossing']} to={[s.o[0] - 32, s.o[1] - 4]} size={15} />
      <Lines x={374} y={80} lines={['angle of', 'incidence 40°']} size={15} colour={aoiColour} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Question visual ---------- */

function LabelQuestion() {
  const s = makeScene({ x: 96, y: 24, w: 300, h: 252 }, 150, 250, 42, 1.5, 140, 124)
  const onIn: Pt = [s.start[0] + (s.o[0] - s.start[0]) * .35, s.start[1] + (s.o[1] - s.start[1]) * .35]
  const onOut: Pt = [s.o[0] + (s.end[0] - s.o[0]) * .7, s.o[1] + (s.end[1] - s.o[1]) * .7]
  return <PhysicsDiagram title="A ray diagram at a boundary with four numbered lines.">
    <Materials s={s} />
    <RayParts s={s} parts={{ normal: true, square: true, incident: true, refracted: true }} />
    <Leader from={[62, 110]} to={onIn} />
    <Num n={1} x={48} y={110} />
    <Leader from={[440, 50]} to={[250, 50]} />
    <Num n={2} x={454} y={50} />
    <Leader from={[440, 232]} to={onOut} />
    <Num n={3} x={454} y={232} />
    <Leader from={[440, 150]} to={[380, 150]} />
    <Num n={4} x={454} y={150} />
  </PhysicsDiagram>
}

export function RefractionVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'refract-boundary': return <BoundaryScene step="boundary" />
    case 'refract-idea': return <BoundaryScene step="idea" />
    case 'refract-angle': return <AnglePanels />
    case 'refract-materials': return <MaterialPanels />
    case 'refract-rays': return <LabelScene step="rays" />
    case 'refract-normal': return <LabelScene step="normal" />
    case 'refract-incident': return <LabelScene step="incident" />
    case 'refract-aoi': return <LabelScene step="aoi" />
    case 'refract-aor': return <LabelScene step="aor" />
    case 'refract-step1': return <StepScene step={1} />
    case 'refract-step2': return <StepScene step={2} />
    case 'refract-step3': return <StepScene step={3} />
    case 'refract-step4': return <StepScene step={4} />
    case 'refract-step5': return <StepScene step={5} />
    case 'refract-prot1': return <ProtScene step={1} />
    case 'refract-prot2': return <ProtScene step={2} />
    case 'refract-prot3': return <ProtScene step={3} />
    case 'refract-prot4': return <ProtScene step={4} />
    case 'refract-q-label': return <LabelQuestion />
    default: return null
  }
}
