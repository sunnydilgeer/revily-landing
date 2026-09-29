import { useId, type ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, Leader, type Pt } from './PhysicsKit'
import { Num, Arrow, CrossMark, skin, skinLine } from './EnergyStoreVisuals'
import { WaveArrow, waveColour, emGroups, highEnergy, r1 } from './EmSpectrumVisuals'

/*
 * Physics Lesson 59: Uses of visible light, UV, X-rays and gamma rays. Original, code-native schematics; not to scale.
 * Focus ids start with 'emmore-'.
 *
 * EM waves are the wavy arrows of the EM spectrum lesson in the same group colours: visible light warm yellow,
 * ultraviolet violet, X-rays and gamma rays the deep high-energy violet. Straight-line rays (the optical fibre) are
 * drawn in the light colour like the refraction lesson. Medical drawings are simple outlines, never graphic.
 */
const { ink, muted } = P
const light = waveColour.visible, uv = emGroups.uv.line, hi = highEnergy
const glassFill = '#dcebf4', glassLine = '#7fa8c2'
const cellCool = '#d3e6f3', cellCoolLine = '#5a8fb5', cellWarm = '#f8cfb8', cellWarmLine = '#c0673f'
const flesh = '#f3cfb0', fleshLine = '#b8835e', bone = '#f7f3e6', boneLine = '#a89a78'

/* ---------- Shared pieces ---------- */

/** A straight ray segment list with a small arrowhead in the middle of each piece. */
function Zigzag({ pts, colour = P.lightLine, width = 3, heads = true }: { pts: Pt[]; colour?: string; width?: number; heads?: boolean }) {
  return <g>
    <path d={pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join('')} stroke={P.light} strokeWidth={width + 5} fill="none" opacity=".6" />
    <path d={pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join('')} stroke={colour} strokeWidth={width} fill="none" />
    {heads && pts.slice(1).map((b, i) => {
      const a = pts[i], ang = Math.atan2(b[1] - a[1], b[0] - a[0]), m: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], s = 9
      const q = (d: number, w: number) => `${r1(m[0] - Math.cos(ang) * d + Math.cos(ang + Math.PI / 2) * w)} ${r1(m[1] - Math.sin(ang) * d + Math.sin(ang + Math.PI / 2) * w)}`
      return <path key={i} d={`M${r1(m[0] + Math.cos(ang) * 4)} ${r1(m[1] + Math.sin(ang) * 4)}L${q(s * .55, s * .6)}L${q(s * .25, 0)}L${q(s * .55, -s * .6)}Z`} fill={colour} />
    })}
  </g>
}
/** A simple person seen from the front; (x, y) is between the feet. */
function Figure({ x, y, s = 1, children }: { x: number; y: number; s?: number; children?: ReactNode }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-14 -70L-18 0M14 -70L18 0" stroke="#6b7f92" strokeWidth="14" />
    <path d="M-26 -150Q-44 -120 -40 -84M26 -150Q44 -120 40 -84" stroke={skinLine} strokeWidth="11" fill="none" />
    <path d="M-26 -150Q-44 -120 -40 -84M26 -150Q44 -120 40 -84" stroke={skin} strokeWidth="8" fill="none" />
    <path d="M-30 -150Q-30 -162 -18 -162H18Q30 -162 30 -150V-70Q30 -62 22 -62H-22Q-30 -62 -30 -70Z" fill="#dce9f2" stroke="#6b93b0" strokeWidth="2" />
    <circle cx="0" cy="-180" r="17" fill={skin} stroke={skinLine} strokeWidth="2" />
    <path d="M-17 -184Q-14 -200 0 -199Q14 -200 17 -184Q8 -192 -17 -184Z" fill="#6b4a35" />
    {children}
  </g>
}
function Doctor({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-24 0V-30Q-24 -48 0 -48Q24 -48 24 -30V0Z" fill="white" stroke="#8a9aa7" strokeWidth="2" />
    <path d="M-6 -48L0 -30L6 -48" stroke="#3f8fc7" strokeWidth="2.5" fill="none" />
    <circle cx="0" cy="-62" r="13" fill={skin} stroke={skinLine} strokeWidth="1.8" />
    <path d="M-13 -64Q-12 -78 0 -77Q12 -78 13 -64Q4 -72 -13 -64Z" fill="#3b3f58" />
    <path d="M-12 -40Q-16 -22 -6 -18" stroke={ink} strokeWidth="1.8" fill="none" /><circle cx="-5" cy="-17" r="3" fill={ink} />
  </g>
}

/* ---------- Section 2: optical fibres ---------- */

const FIBRE = 'M96 170C170 170 180 96 270 96S370 170 444 170'
function Laptop({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x="-36" y="-56" width="72" height="48" rx="5" fill="#3b5163" stroke="#26394a" strokeWidth="2" />
    <rect x="-30" y="-50" width="60" height="36" rx="2" fill="#a6cdef" />
    <path d="M-46 -6H46L40 4H-40Z" fill="#dfe5ea" stroke="#7d8e9c" strokeWidth="2" />
  </g>
}
function Phone({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x="-18" y="-34" width="36" height="68" rx="8" fill="#3b5163" stroke="#26394a" strokeWidth="2" />
    <rect x="-13" y="-27" width="26" height="50" rx="3" fill="#a6cdef" />
  </g>
}
function FibreScene({ pulses }: { pulses: boolean }) {
  return <PhysicsDiagram title={pulses
    ? 'The same optical fibre with short pulses of visible light travelling along it from the phone to the computer. The pulses carry the data.'
    : 'An optical fibre, a long thin tube of glass, joins a phone to a computer. It carries data over long distances.'}>
    <path d={FIBRE} stroke={glassLine} strokeWidth="16" fill="none" />
    <path d={FIBRE} stroke={glassFill} strokeWidth="12" fill="none" />
    <path d={FIBRE} stroke="white" strokeWidth="2.5" fill="none" opacity=".8" transform="translate(0 -3)" />
    {pulses && <g>
      <path d={FIBRE} stroke={P.light} strokeWidth="10" fill="none" strokeDasharray="14 22" />
      <path d={FIBRE} stroke={light} strokeWidth="5" fill="none" strokeDasharray="14 22" />
      <Arrow from={[222, 64]} to={[318, 64]} colour={light} width={2.6} />
    </g>}
    <Phone x={64} y={172} />
    <Laptop x={482} y={194} />
    {!pulses && <g>
      <Leader from={[290, 146]} to={[272, 104]} />
      <Lines x={270} y={166} anchor="middle" lines={['optical fibre']} size={15} />
      <Lines x={270} y={262} anchor="middle" lines={['carries data over long distances']} size={15} />
    </g>}
    {pulses && <Lines x={270} y={262} anchor="middle" lines={['data as pulses of visible light']} size={15} colour={P.lightLine} />}
  </PhysicsDiagram>
}
/** An enlarged straight piece of fibre with a ray reflecting back and forth off its inside wall. */
function ReflectScene({ question = false }: { question?: boolean }) {
  const top = 96, bot = 190, x0 = 40, x1 = 500
  const pts: Pt[] = [[x0, 164], [118, top + 4], [228, bot - 4], [338, top + 4], [448, bot - 4], [x1, 150]]
  return <PhysicsDiagram title={question ? 'A section of an optical fibre with a light ray travelling along it and two numbered points.' : 'An enlarged piece of optical fibre. The light ray is reflected off the inside wall again and again, so it stays in the fibre all the way along.'}>
    <rect x={x0 - 10} y={top - 8} width={x1 - x0 + 20} height={bot - top + 16} rx="10" fill={glassFill} stroke={glassLine} strokeWidth="2.4" />
    <path d={`M${x0} ${top + 8}H${x1}`} stroke="white" strokeWidth="4" opacity=".8" />
    <Zigzag pts={pts} />
    {!question && <g>
      {pts.slice(1, -1).map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="4" fill={P.lightLine} />)}
      <Lines x={270} y={42} anchor="middle" lines={['the ray is reflected back and forth along the fibre']} size={15} />
      <Leader from={[176, 236]} to={[176, top + 60]} />
      <Lines x={176} y={256} anchor="middle" lines={['glass fibre']} size={14} />
      <Leader from={[430, 236]} to={[448, bot - 2]} />
      <Lines x={420} y={256} anchor="middle" lines={['reflected at the wall']} size={14} colour={P.lightLine} />
    </g>}
    {question && <g>
      <Leader from={[176, 240]} to={[176, bot + 8]} />
      <Num n={1} x={176} y={254} />
      <Leader from={[338, 50]} to={[338, top - 2]} />
      <Num n={2} x={338} y={38} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 3: ultraviolet ---------- */

function UvGlow() {
  return <PhysicsDiagram title="Ultraviolet radiation hits a material. The material absorbs the UV and gives off visible light.">
    <WaveArrow from={[36, 150]} to={[208, 150]} wavelength={9.5} amp={6} colour={uv} width={2.8} />
    <rect x={216} y={96} width={108} height={108} rx="20" fill="#fdf2c4" stroke={P.lightLine} strokeWidth="2.4" />
    <circle cx={270} cy={150} r="72" fill={P.light} opacity=".35" />
    <WaveArrow from={[334, 150]} to={[504, 150]} wavelength={15} amp={7} colour={light} width={2.8} />
    <Lines x={122} y={120} anchor="middle" lines={['UV']} size={15} colour={uv} />
    <Lines x={122} y={196} anchor="middle" lines={['absorbs UV']} size={15} colour={uv} />
    <Lines x={420} y={120} anchor="middle" lines={['visible light']} size={15} colour={P.lightLine} />
    <Lines x={420} y={196} anchor="middle" lines={['gives off', 'visible light']} size={15} colour={P.lightLine} />
    <Lines x={270} y={250} anchor="middle" lines={['material']} size={14} weight={650} colour={muted} />
  </PhysicsDiagram>
}
function Lamp() {
  return <PhysicsDiagram title="A fluorescent lamp cut open. UV radiation is produced inside the tube. A coating on the glass absorbs it and gives off visible light. These lamps are energy-efficient.">
    {/* tube */}
    <rect x={60} y={100} width={420} height={90} rx="45" fill="#f4f0fb" stroke={glassLine} strokeWidth="2.4" />
    <rect x={67} y={107} width={406} height={76} rx="38" fill="none" stroke="#f3e39b" strokeWidth="7" />
    <rect x={40} y={116} width={24} height={58} rx="5" fill="#dfe5ea" stroke="#7d8e9c" strokeWidth="2" />
    <rect x={476} y={116} width={24} height={58} rx="5" fill="#dfe5ea" stroke="#7d8e9c" strokeWidth="2" />
    {/* UV inside, hitting the coating */}
    {[[150, 150, 128, 114], [200, 150, 224, 176], [340, 150, 318, 114], [400, 150, 424, 176]].map(([x1, y1, x2, y2], i) => <WaveArrow key={i} from={[x1, y1]} to={[x2, y2]} wavelength={6} amp={3} colour={uv} width={2} />)}
    {/* visible light leaving */}
    {[[128, 96, 116, 50], [318, 96, 318, 46], [224, 194, 212, 244], [424, 96, 436, 50]].map(([x1, y1, x2, y2], i) => <WaveArrow key={`v${i}`} from={[x1, y1]} to={[x2, y2]} wavelength={12} amp={4.5} colour={light} width={2.4} />)}
    <Leader from={[330, 234]} to={[330, 186]} />
    <Lines x={338} y={240} lines={['coating gives off', 'visible light']} size={14} colour={P.lightLine} />
    <Lines x={270} y={156} anchor="middle" lines={['UV inside']} size={14} colour={uv} />
    <Lines x={40} y={40} lines={['energy-efficient']} size={14} colour={P.useful} />
  </PhysicsDiagram>
}
function BikeFrame({ x, y, glow }: { x: number; y: number; glow: boolean }) {
  return <g transform={`translate(${x} ${y})`}>
    {[-54, 54].map(wx => <g key={wx}><circle cx={wx} cy="0" r="30" fill="none" stroke="#4f5d69" strokeWidth="4" /><circle cx={wx} cy="0" r="3" fill="#4f5d69" /></g>)}
    <path d="M-54 0L-18 -44H36L54 0M-18 -44L4 0L36 -44M4 0H-54M36 -44L40 -58M28 -60H50M-18 -44L-22 -56M-32 -58H-12" stroke="#3f8f7d" strokeWidth="5" fill="none" />
    {glow && <text x="9" y="-49" textAnchor="middle" fontSize="13" fontWeight="800" fill="#b7f0ff" stroke="#6fe0ff" strokeWidth=".6" style={{ letterSpacing: '1px' }}>SAM</text>}
  </g>
}
function Pen() {
  return <PhysicsDiagram title="Left: a name written on a bicycle with a security pen cannot be seen in normal light. Right: under a UV lamp the name glows, so police can identify it.">
    <rect x={20} y={30} width={244} height={206} rx="18" fill="#fffdf4" stroke={P.panelLine} strokeWidth="1.5" />
    <rect x={276} y={30} width={244} height={206} rx="18" fill="#2b2446" stroke="#4a3777" strokeWidth="1.5" />
    <Lines x={142} y={58} anchor="middle" lines={['normal light']} size={14} />
    <BikeFrame x={142} y={180} glow={false} />
    <Lines x={142} y={228} anchor="middle" lines={['nothing to see']} size={13} weight={650} colour={muted} />
    <Lines x={398} y={58} anchor="middle" lines={['under a UV lamp']} size={14} colour="white" />
    <rect x={430} y={70} width={70} height={16} rx="8" fill="#b9a3f0" stroke="#e6daf5" strokeWidth="1.5" />
    {[[440, 88, 408, 118], [470, 88, 456, 118]].map(([x1, y1, x2, y2], i) => <WaveArrow key={i} from={[x1, y1]} to={[x2, y2]} wavelength={6} amp={3} colour="#c9b3ec" width={2} />)}
    <BikeFrame x={398} y={180} glow />
    <Lines x={398} y={228} anchor="middle" lines={['the name glows']} size={13} colour="#e6daf5" />
    <Lines x={270} y={270} anchor="middle" lines={['glows under UV light: police can identify it']} size={14} />
  </PhysicsDiagram>
}
function Tan() {
  return <PhysicsDiagram title="The Sun gives out UV radiation, which gives a person on a beach chair a suntan. Too much is dangerous. A sunbed with UV lamps can also tan the skin, but it is dangerous.">
    {/* Sun */}
    <circle cx={60} cy={60} r="30" fill={P.light} stroke={P.lightLine} strokeWidth="2.2" />
    {Array.from({ length: 8 }, (_, k) => { const a = k * Math.PI / 4; return <path key={k} d={`M${r1(60 + Math.cos(a) * 38)} ${r1(60 + Math.sin(a) * 38)}L${r1(60 + Math.cos(a) * 48)} ${r1(60 + Math.sin(a) * 48)}`} stroke={P.lightLine} strokeWidth="2.4" /> })}
    {[[104, 72, 184, 160], [104, 52, 226, 132]].map(([x1, y1, x2, y2], i) => <WaveArrow key={i} from={[x1, y1]} to={[x2, y2]} wavelength={9} amp={4} colour={uv} width={2.4} />)}
    {/* beach chair and person */}
    <path d="M20 250Q150 244 290 250" stroke="#e2cf9e" strokeWidth="10" fill="none" />
    <path d="M150 236L250 236M168 236L150 170M250 236L262 200" stroke="#3f8fc7" strokeWidth="4" fill="none" />
    <path d="M148 172L170 234H254L262 204" stroke="#9cc3d9" strokeWidth="7" fill="none" />
    <path d="M168 224L248 224" stroke={skinLine} strokeWidth="11" /><path d="M168 224L248 224" stroke={skin} strokeWidth="8" />
    <path d="M166 222L156 182" stroke="#f0b64a" strokeWidth="15" />
    <circle cx={152} cy={166} r="11" fill={skin} stroke={skinLine} strokeWidth="1.8" />
    <path d="M142 164Q144 152 156 154Q164 156 162 164Q154 158 142 164Z" fill="#6b4a35" />
    <Lines x={20} y={134} lines={['UV from the Sun', 'gives a suntan']} size={14} colour={uv} />
    <Lines x={150} y={282} anchor="middle" lines={['too much is dangerous']} size={13} colour={P.wasted} />
    {/* sunbed */}
    <rect x={318} y={40} width={200} height={206} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <path d="M338 98H498" stroke="#7d8e9c" strokeWidth="14" />
    {[358, 398, 438, 478].map(x => <rect key={x} x={x - 14} y={104} width={28} height={8} rx="4" fill="#c9b3ec" stroke={uv} strokeWidth="1.4" />)}
    {[358, 418, 478].map(x => <WaveArrow key={x} from={[x, 116]} to={[x, 170]} wavelength={8} amp={3.5} colour={uv} width={2} />)}
    <rect x={338} y={186} width={160} height={16} rx="8" fill="#dfe5ea" stroke="#7d8e9c" strokeWidth="2" />
    <path d="M348 202V220M488 202V220" stroke="#7d8e9c" strokeWidth="4" />
    <Lines x={418} y={70} anchor="middle" lines={['sunbed']} size={14} />
    <CrossMark x={348} y={236} s={.8} />
    <Lines x={364} y={241} lines={['UV lamps: dangerous']} size={13} colour={P.wasted} />
  </PhysicsDiagram>
}

/* ---------- Section 4: X-ray images ---------- */

/** A forearm seen from the side with the bones inside. `crack` puts a small break in the lower bone. */
function Arm({ x, y, image = false, crack = false }: { x: number; y: number; image?: boolean; crack?: boolean }) {
  const outline = 'M-110 -24Q-60 -30 0 -28Q60 -26 104 -20Q120 -18 120 0Q120 18 104 20Q60 26 0 28Q-60 30 -110 24Z'
  return <g transform={`translate(${x} ${y})`}>
    {image
      ? <path d={outline} fill="#3a4f63" opacity=".9" />
      : <path d={outline} fill={flesh} stroke={fleshLine} strokeWidth="2" />}
    {[-9, 10].map((dy, k) => {
      const c = image ? '#eef3f6' : bone, l = image ? '#c8d5de' : boneLine
      const d = `M-104 ${dy - 5}Q-110 ${dy} -104 ${dy + 5}H96Q102 ${dy} 96 ${dy - 5}Z`
      return <g key={k}>
        <path d={d} fill={c} stroke={l} strokeWidth="1.8" />
        {crack && k === 1 && <path d={`M14 ${dy - 6}L8 ${dy - 1}L16 ${dy + 1}L10 ${dy + 6}`} stroke={image ? '#26394a' : boneLine} strokeWidth="2.6" fill="none" />}
      </g>
    })}
  </g>
}
function XraySource({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x="-34" y="-40" width="56" height="80" rx="10" fill="#dfe5ea" stroke="#5a6b79" strokeWidth="2.2" />
    <rect x="22" y="-18" width="14" height="36" rx="3" fill="#b3bcc5" stroke="#5a6b79" strokeWidth="2" />
  </g>
}
function Xray1() {
  const ys = [108, 128, 146, 164, 182, 200]
  return <PhysicsDiagram title="X-rays travel from a source on the left towards a plate on the right. They pass through the flesh of an arm but are blocked by the bone.">
    <XraySource x={56} y={154} />
    <rect x={446} y={80} width={34} height={150} rx="6" fill="#3a4f63" stroke="#26394a" strokeWidth="2" />
    <Arm x={270} y={154} />
    {ys.map(y => {
      const hitsBone = y > 138 && y < 172
      const endX = hitsBone ? 166 : 440
      return <WaveArrow key={y} from={[100, y]} to={[endX, y]} wavelength={6.5} amp={3} colour={hi} width={2} opacity={hitsBone ? 1 : 1} />
    })}
    <Lines x={56} y={220} anchor="middle" lines={['X-ray', 'source']} size={13} weight={650} colour={muted} />
    <Lines x={463} y={70} anchor="middle" lines={['plate']} size={13} weight={650} colour={muted} />
    <Lines x={270} y={60} anchor="middle" lines={['X-rays pass through flesh']} size={15} colour={hi} />
    <Leader from={[230, 240]} to={[220, 164]} colour={boneLine} />
    <Lines x={250} y={258} anchor="middle" lines={['bone and metal block them']} size={15} colour="#7a6a48" />
  </PhysicsDiagram>
}
function XrayImage({ crack }: { crack: boolean }) {
  return <PhysicsDiagram title={crack
    ? 'The X-ray image shows a crack in one of the bones, circled. A doctor looks at the image to check for a broken bone.'
    : 'An X-ray image of the arm: the bones show up as clear pale shapes on a dark background, because they block the X-rays.'}>
    <rect x={60} y={40} width={300} height={210} rx="12" fill="#1f2c3a" stroke="#26394a" strokeWidth="2" />
    <Arm x={210} y={146} image crack={crack} />
    {crack && <g>
      <circle cx={222} cy={156} r="22" fill="none" stroke={P.wasted} strokeWidth="3" />
      <Doctor x={450} y={228} />
      <Leader from={[378, 110]} to={[242, 150]} colour={P.wasted} />
      <Lines x={384} y={96} lines={['a break shows as', 'a crack or gap']} size={14} colour={P.wasted} />
    </g>}
    {!crack && <g>
      <Leader from={[378, 120]} to={[260, 138]} />
      <Lines x={384} y={116} lines={['bones show up', 'on the image']} size={15} />
      <Lines x={384} y={186} lines={['bone blocks X-rays,', 'so it looks pale']} size={13} weight={650} colour={muted} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 5: radiotherapy and tracers ---------- */

function LyingPerson({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-120 -8H130" stroke="#6b7f92" strokeWidth="0" />
    <path d="M40 -14L126 -12M40 -2L126 0" stroke="#6b7f92" strokeWidth="12" />
    <path d="M-80 -30Q-80 -38 -70 -38H44Q52 -38 52 -30V8Q52 14 44 14H-70Q-80 14 -80 6Z" fill="#dce9f2" stroke="#6b93b0" strokeWidth="2" />
    <circle cx={-102} cy={-12} r="18" fill={skin} stroke={skinLine} strokeWidth="2" />
    <path d="M-118 -18Q-116 -32 -102 -31Q-92 -30 -88 -22Q-104 -26 -118 -18Z" fill="#6b4a35" />
  </g>
}
function Radio1() {
  return <PhysicsDiagram title="Radiotherapy: a person lies on a bed under a machine that sends X-rays or gamma rays at a small tumour inside the body.">
    {/* machine */}
    <path d="M150 30H390Q406 30 406 46V70Q406 84 392 84H148Q134 84 134 70V46Q134 30 150 30Z" fill="#e7eaec" stroke="#5a6b79" strokeWidth="2.2" />
    <rect x={244} y={84} width={52} height={22} rx="4" fill="#b3bcc5" stroke="#5a6b79" strokeWidth="2" />
    <LyingPerson x={270} y={200} />
    <circle cx={262} cy={190} r="8" fill={cellWarm} stroke={cellWarmLine} strokeWidth="2" />
    {[[250, 110], [270, 110], [290, 110]].map(([x, y], i) => <WaveArrow key={i} from={[x, y]} to={[262 + (i - 1) * 4, 176]} wavelength={6} amp={2.6} colour={hi} width={2} />)}
    <rect x={120} y={216} width={300} height={14} rx="6" fill="#dfe5ea" stroke="#7d8e9c" strokeWidth="2" />
    <path d="M160 230V262M380 230V262" stroke="#7d8e9c" strokeWidth="5" />
    <Leader from={[430, 150]} to={[270, 190]} colour={cellWarmLine} />
    <Lines x={436} y={146} lines={['tumour']} size={14} colour={cellWarmLine} />
    <Lines x={270} y={286} anchor="middle" lines={['radiotherapy: X-rays or gamma rays treat cancer']} size={14} />
  </PhysicsDiagram>
}
function Radio2() {
  const cells: ReactNode[] = []
  const c: Pt = [270, 150]
  for (let row = 0; row < 7; row++) for (let col = 0; col < 11; col++) {
    const x = 40 + col * 46 + (row % 2) * 23, y = 36 + row * 36
    const inTumour = Math.hypot(x - c[0], y - c[1]) < 48
    if (x > 520) continue
    cells.push(<ellipse key={`${row}-${col}`} cx={x} cy={y} rx="20" ry="15" fill={inTumour ? cellWarm : cellCool} stroke={inTumour ? cellWarmLine : cellCoolLine} strokeWidth="1.6" opacity={inTumour ? 1 : .8} />)
    cells.push(<circle key={`n${row}-${col}`} cx={x + 3} cy={y} r="4" fill={inTumour ? cellWarmLine : cellCoolLine} opacity=".6" />)
  }
  const beams: Pt[] = [[40, 30], [500, 30], [40, 270], [500, 270]]
  return <PhysicsDiagram title="A tumour of cancer cells, in a warm colour, among healthy cells, in a cool colour. Several narrow beams are aimed so they meet on the tumour only.">
    <rect x={14} y={14} width={512} height={272} rx="18" fill="#f5f9fc" />
    {cells}
    {beams.map((b, i) => {
      const ang = Math.atan2(c[1] - b[1], c[0] - b[0]), to: Pt = [c[0] - Math.cos(ang) * 30, c[1] - Math.sin(ang) * 30]
      return <g key={i}>
        <path d={`M${b[0]} ${b[1]}L${r1(to[0])} ${r1(to[1])}`} stroke="white" strokeWidth="9" opacity=".8" />
        <Arrow from={b} to={to} colour={hi} width={3} />
      </g>
    })}
    <rect x={186} y={206} width={170} height={52} rx="12" fill="white" opacity=".92" />
    <Lines x={271} y={228} anchor="middle" lines={['aimed at the', 'cancer cells']} size={15} colour={cellWarmLine} />
    <rect x={28} y={122} width={130} height={52} rx="12" fill="white" opacity=".92" />
    <Lines x={93} y={144} anchor="middle" lines={['avoid', 'healthy cells']} size={14} colour={cellCoolLine} />
  </PhysicsDiagram>
}
function Syringe({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y}) rotate(-30)`}>
    <rect x="-34" y="-8" width="52" height="16" rx="3" fill="white" stroke="#7d8e9c" strokeWidth="2" />
    <rect x="-30" y="-5" width="28" height="10" rx="2" fill={P.nuclear} />
    <path d="M18 0H40M-34 0H-48M-48 -10V10" stroke="#7d8e9c" strokeWidth="2.4" />
  </g>
}
function Tracer({ step }: { step: number }) {
  const organ = 'M-22 -118Q-30 -132 -16 -136Q0 -138 4 -128Q16 -138 24 -126Q30 -112 14 -106Q0 -100 -14 -106Q-22 -110 -22 -118Z'
  const dots: Pt[] = [[-10, -122], [-2, -126], [6, -120], [12, -126], [-4, -114], [4, -112]]
  return <PhysicsDiagram title={step === 1
    ? 'A medical tracer: a small amount of a substance that gives out gamma rays is injected into the body and collects in an organ.'
    : 'Gamma rays from the tracer pass out of the body to a detector outside, which tracks where the tracer goes. This shows whether the organ is working.'}>
    <Figure x={200} y={272} s={1.1}>
      <path d={organ} fill="#f6d2e5" stroke="#ad4880" strokeWidth="1.8" transform="translate(0 6)" />
      {dots.map(([dx, dy], i) => <circle key={i} cx={dx} cy={dy + 6} r="3.2" fill={P.nuclearLine} />)}
      {step === 2 && <path d="M-38 -86Q-30 -100 -14 -106" stroke={P.nuclearLine} strokeWidth="2" fill="none" strokeDasharray="3 4" />}
    </Figure>
    {step === 1 && <g>
      <Syringe x={80} y={150} />
      <Leader from={[330, 120]} to={[208, 136]} colour={P.nuclearLine} />
      <Lines x={336} y={116} lines={['medical tracer']} size={15} colour={P.nuclearLine} />
      <Lines x={336} y={170} lines={['a small amount of a', 'gamma-emitting', 'substance']} size={14} />
    </g>}
    {step === 2 && <g>
      {[[-40, 100], [-10, 118], [20, 136]].map(([dy, x2], i) => <WaveArrow key={i} from={[226, 136 + dy / 3]} to={[410, 72 + i * 40]} wavelength={5} amp={2.6} colour={hi} width={2.2} />)}
      <rect x={412} y={52} width={40} height={120} rx="8" fill="#dfe5ea" stroke="#5a6b79" strokeWidth="2.2" />
      <path d="M452 112H478V250" stroke="#5a6b79" strokeWidth="3" fill="none" />
      <rect x={456} y={224} width={66} height={44} rx="6" fill="#3b5163" />
      <circle cx={476} cy={240} r="5" fill={P.nuclear} /><circle cx={492} cy={248} r="4" fill={P.nuclear} />
      <Lines x={320} y={36} anchor="middle" lines={['gamma rays pass out']} size={14} colour={hi} />
      <Lines x={432} y={196} anchor="middle" lines={['detector', 'tracks it']} size={14} />
      <Leader from={[92, 110]} to={[180, 136]} colour="#ad4880" />
      <Lines x={20} y={100} lines={['organ', 'working?']} size={14} colour="#ad4880" />
    </g>}
  </PhysicsDiagram>
}

export function EmMoreVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  const views: Record<string, () => ReactNode> = {
    'emmore-fibre': () => <FibreScene pulses={false} />,
    'emmore-pulses': () => <FibreScene pulses />,
    'emmore-reflect': () => <ReflectScene />,
    'emmore-uvglow': () => <UvGlow />,
    'emmore-lamp': () => <Lamp />,
    'emmore-pen': () => <Pen />,
    'emmore-tan': () => <Tan />,
    'emmore-xray1': () => <Xray1 />,
    'emmore-xray2': () => <XrayImage crack={false} />,
    'emmore-xray3': () => <XrayImage crack />,
    'emmore-radio1': () => <Radio1 />,
    'emmore-radio2': () => <Radio2 />,
    'emmore-tracer1': () => <Tracer step={1} />,
    'emmore-tracer2': () => <Tracer step={2} />,
    'emmore-q-fibre': () => <ReflectScene question />,
  }
  return <>{views[focus]?.() ?? null}</>
}
