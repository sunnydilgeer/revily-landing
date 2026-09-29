import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, TransferArrow } from './PhysicsKit'
import { faded, r1, Card, Chip, Arrow, Caption, Marker, Tick, Cross, blob } from './PowerVisuals'

/*
 * Physics Lesson 10: Energy resources and their uses. Original schematics; not to scale. Focus ids start with 'eres-'.
 *
 * Two colour families for the resource lessons: non-renewable a warm brown, renewable a fresh green. Each resource has
 * one small rounded icon (coal, oil, natural gas, nuclear fuel; Sun, wind, waves, hydro-electricity, bio-fuel, tides,
 * geothermal) drawn the same way wherever it appears. The transport walkthrough keeps one road scene and swaps the fuel;
 * the heating walkthrough keeps one house and swaps the heat source.
 */

const { ink, muted } = P
export const resourceFamily = {
  nonRenewable: { fill: '#f3e6dc', line: '#94603f', text: '#7d4f33' },
  renewable: { fill: '#e2f1da', line: P.plantLine, text: '#3f7a4a' },
}
const NR = resourceFamily.nonRenewable, RN = resourceFamily.renewable
const steel = '#6b7f90', steelFill = '#e3e8ee'

/* ---------- Resource icons (each drawn in a box about ±24 around its centre) ---------- */

export type Resource = 'coal' | 'oil' | 'gas' | 'nuclear' | 'sun' | 'wind' | 'waves' | 'hydro' | 'biofuel' | 'tides' | 'geothermal'
export const resourceNames: Record<Resource, string> = {
  coal: 'coal', oil: 'oil', gas: 'natural|gas', nuclear: 'nuclear|fuel', sun: 'solar', wind: 'wind', waves: 'waves',
  hydro: 'hydro-|electric', biofuel: 'bio-fuel', tides: 'tides', geothermal: 'geothermal',
}
function Icon({ r, x, y, s = 1 }: { r: Resource; x: number; y: number; s?: number }) {
  const g: Record<Resource, ReactNode> = {
    coal: <g>
      <path d={blob(-9, 6, 11, 9, 3, 0.18, 7)} fill="#5f5853" stroke="#35302c" strokeWidth="1.8" />
      <path d={blob(9, 8, 10, 8, 5, 0.18, 7)} fill="#6d6560" stroke="#35302c" strokeWidth="1.8" />
      <path d={blob(0, -8, 10, 9, 8, 0.18, 7)} fill="#57504b" stroke="#35302c" strokeWidth="1.8" />
      <path d="M-4 -12l4 -2M-12 3l3 -2" stroke="#9a918a" strokeWidth="1.6" />
    </g>,
    oil: <g>
      <rect x={-15} y={-20} width={30} height={40} rx="5" fill="#d9cdbf" stroke="#6b5a4c" strokeWidth="2" />
      <path d="M-15 -8H15M-15 8H15" stroke="#6b5a4c" strokeWidth="2" />
      <path d="M0 -4c-4 5 -5 7 -5 9a5 5 0 0 0 10 0c0 -2 -1 -4 -5 -9Z" fill="#3b3430" transform="translate(0 -2) scale(.8)" />
    </g>,
    gas: <g>
      <path d="M0 20C-14 18 -16 4 -8 -6C-6 0 -2 2 -2 -4C-2 -12 4 -18 6 -22C8 -10 18 -4 14 8C12 16 6 20 0 20Z" fill="#a9cff0" stroke="#3f7fb0" strokeWidth="2" />
      <path d="M0 16C-6 14 -6 6 -2 2C0 6 4 6 4 2C8 6 8 14 0 16Z" fill="#e3f0fb" />
    </g>,
    nuclear: <g>
      <rect x={-9} y={-22} width={18} height={44} rx="9" fill={P.nuclear} stroke={P.nuclearLine} strokeWidth="2" />
      {[-12, -3, 6, 15].map(y => <rect key={y} x={-5} y={y - 3} width={10} height={7} rx="2" fill={P.nuclearLine} opacity=".55" />)}
    </g>,
    sun: <g>
      {Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return <path key={i} d={`M${r1(Math.cos(a) * 15)} ${r1(Math.sin(a) * 15)}L${r1(Math.cos(a) * 22)} ${r1(Math.sin(a) * 22)}`} stroke={P.lightLine} strokeWidth="2.6" /> })}
      <circle r="11" fill={P.light} stroke={P.lightLine} strokeWidth="2" />
    </g>,
    wind: <g>
      <path d="M-2 -6L-4 24H4L2 -6Z" fill="white" stroke={steel} strokeWidth="1.8" />
      {[0, 120, 240].map(a => <path key={a} d="M0 -8C3 -12 4 -22 1 -28C-2 -22 -3 -12 0 -8Z" fill="white" stroke={steel} strokeWidth="1.8" transform={`rotate(${a + 15} 0 -8)`} />)}
      <circle cx={0} cy={-8} r="3" fill={steel} />
    </g>,
    waves: <g>
      <path d="M-22 14V2C-14 -8 -8 -8 -2 0C4 -12 14 -12 22 -2V14Q22 20 16 20H-16Q-22 20 -22 14Z" fill={P.water} stroke={P.waterLine} strokeWidth="2" />
      <path d="M-16 8q6 -5 12 0t12 0" stroke={P.waterLine} strokeWidth="1.6" fill="none" />
    </g>,
    hydro: <g>
      <path d="M-22 20V-6Q-14 -10 -6 -6V20Z" fill={P.water} stroke={P.waterLine} strokeWidth="1.8" />
      <path d="M-6 -20H6L16 20H-6Z" fill="#dfe2e6" stroke={steel} strokeWidth="2" />
      <path d="M12 8q6 2 10 10" stroke={P.waterLine} strokeWidth="2.4" fill="none" />
    </g>,
    biofuel: <g>
      <path d="M0 20V-2" stroke={P.plantLine} strokeWidth="2.4" />
      <path d="M0 4C-4 -6 -14 -8 -20 -4C-14 4 -6 6 0 4Z" fill={P.plant} stroke={P.plantLine} strokeWidth="1.8" />
      <path d="M0 -2C4 -12 14 -14 20 -10C14 -2 6 0 0 -2Z" fill={P.plant} stroke={P.plantLine} strokeWidth="1.8" />
      <path d="M-14 20h28" stroke="#b39463" strokeWidth="2.4" />
      <path d="M10 6c-3 4 -4 6 -4 7.5a4 4 0 0 0 8 0c0 -1.5 -1 -3.5 -4 -7.5Z" fill="#f1c54f" stroke="#b58a12" strokeWidth="1.4" />
    </g>,
    tides: <g>
      <path d="M2 -24A11 11 0 1 0 12 -8A9 9 0 1 1 2 -24Z" fill="#eef1f6" stroke={steel} strokeWidth="1.8" />
      <path d="M-22 20V8C-12 2 -4 12 4 6C12 0 18 4 22 6V20Z" fill={P.water} stroke={P.waterLine} strokeWidth="2" />
      <path d="M-20 -4L-20 -16M-24 -12l4 -4l4 4" stroke={P.waterLine} strokeWidth="2" fill="none" />
    </g>,
    geothermal: <g>
      <path d="M-22 4H22V16Q22 22 16 22H-16Q-22 22 -22 16Z" fill="#f2c6b0" stroke={P.hot} strokeWidth="2" />
      <path d="M-22 -2H22" stroke="#b39463" strokeWidth="2.4" />
      <path d={blob(-10, 13, 6, 4, 2, 0.2, 7)} fill={P.hot} opacity=".5" />
      <path d={blob(9, 12, 7, 4, 4, 0.2, 7)} fill={P.hot} opacity=".5" />
      <path d="M-8 -6q-4 -5 0 -10t0 -9M6 -6q-4 -5 0 -10t0 -9" stroke={P.hot} strokeWidth="2.2" fill="none" />
    </g>,
  }
  return <g transform={`translate(${x} ${y}) scale(${s})`}>{g[r]}</g>
}
/** A rounded tile with an icon and its name. `family` tints it; `neutral` keeps it plain (question view). */
function Tile({ r, x, y, w = 70, family, dim = false }: { r: Resource; x: number; y: number; w?: number; family?: 'nonRenewable' | 'renewable'; dim?: boolean }) {
  const c = family ? resourceFamily[family] : { fill: '#fbfdfe', line: P.panelLine, text: ink }
  return <g opacity={dim ? faded : 1}>
    <rect x={x - w / 2} y={y - 38} width={w} height={96} rx="14" fill={c.fill} stroke={c.line} strokeWidth="1.8" />
    <Icon r={r} x={x} y={y - 6} s={0.95} />
    <Lines x={x} y={y + 36} anchor="middle" lines={resourceNames[r].split('|')} size={12} weight={700} colour={c.text} />
  </g>
}

/* ---------- Everyday objects ---------- */

function PowerStation({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  // (x, y) is the middle of the ground line under it.
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-40 0V-30H-8V0Z" fill="#e6e9ee" stroke={steel} strokeWidth="2" />
    <path d="M-6 0C-2 -20 -4 -40 -10 -52H22C16 -40 14 -20 18 0Z" fill="#eef1f4" stroke={steel} strokeWidth="2" />
    <path d={blob(8, -62, 14, 8, 3, 0.15)} fill="white" stroke="#c3ccd4" strokeWidth="1.6" />
    <rect x={-32} y={-22} width={8} height={8} rx="1.5" fill={P.water} stroke={steel} strokeWidth="1.2" />
    <rect x={-20} y={-22} width={8} height={8} rx="1.5" fill={P.water} stroke={steel} strokeWidth="1.2" />
  </g>
}
function Pylon({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} stroke={steel} strokeWidth="2" fill="none">
    <path d="M-12 0L-3 -60H3L12 0M-8 -24H8M-10 -12H10M-3 -60L-5 -48M3 -60L5 -48" />
    <path d="M-18 -48H18M-14 -38H14" />
    <path d="M-18 -48v5M18 -48v5M-14 -38v5M14 -38v5" strokeWidth="1.6" />
  </g>
}
function Car({ x, y, s = 1, plug = false }: { x: number; y: number; s?: number; plug?: boolean }) {
  // (x, y) is the middle of the ground under the wheels.
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-40 -10V-20Q-40 -26 -34 -27L-22 -29L-12 -42Q-9 -45 -4 -45H14Q20 -45 24 -40L33 -29Q42 -28 42 -20V-10Q42 -6 38 -6H-36Q-40 -6 -40 -10Z" fill="#cfe0ee" stroke="#4f7ea3" strokeWidth="2" />
    <path d="M-9 -30L-3 -39H10L16 -30Z" fill="white" stroke="#4f7ea3" strokeWidth="1.6" />
    <circle cx={-22} cy={-6} r="8" fill="#4a4f57" stroke="#2c3036" strokeWidth="1.6" /><circle cx={-22} cy={-6} r="3" fill="#c3ccd4" />
    <circle cx={24} cy={-6} r="8" fill="#4a4f57" stroke="#2c3036" strokeWidth="1.6" /><circle cx={24} cy={-6} r="3" fill="#c3ccd4" />
    {plug && <path d="M-40 -18h-8" stroke={P.wire} strokeWidth="3" />}
  </g>
}
function Train({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-50 -8V-44Q-50 -50 -44 -50H30Q48 -50 52 -30L54 -14Q54 -8 48 -8Z" fill="#f3e3c2" stroke="#b07d2a" strokeWidth="2" />
    {[-40, -20, 0].map(wx => <rect key={wx} x={wx} y={-42} width={14} height={12} rx="2" fill="white" stroke="#b07d2a" strokeWidth="1.4" />)}
    <path d="M22 -42H36Q44 -42 46 -32H22Z" fill="white" stroke="#b07d2a" strokeWidth="1.4" />
    {[-36, -12, 30].map(wx => <circle key={wx} cx={wx} cy={-6} r="6" fill="#4a4f57" />)}
    <path d="M-60 0H64" stroke="#8a7a66" strokeWidth="2.4" />
    <path d="M-10 -50L0 -64L10 -50M0 -64V-70" stroke={steel} strokeWidth="2" fill="none" />
  </g>
}
function HouseIcon({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-34 0V-40H34V0Z" fill="#fbf6ee" stroke="#9c8a74" strokeWidth="2" />
    <path d="M-42 -38L0 -68L42 -38Q0 -44 -42 -38Z" fill="#d99a7c" stroke="#a5634a" strokeWidth="2" />
    <Radiator x={-6} y={-6} s={0.8} />
  </g>
}
function Radiator({ x, y, s = 1, warm = true }: { x: number; y: number; s?: number; warm?: boolean }) {
  // (x, y) is the bottom-left of the radiator.
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={0} y={-28} width={40} height={24} rx="4" fill={warm ? P.hotFill : 'white'} stroke={P.hot} strokeWidth="2" />
    {[8, 16, 24, 32].map(rx => <path key={rx} d={`M${rx} -24V-8`} stroke={P.hot} strokeWidth="1.6" />)}
    <path d="M4 -4V0M36 -4V0" stroke={P.hot} strokeWidth="2" />
  </g>
}
function FuelPump({ x, y, label, colour = NR.line, fill = NR.fill }: { x: number; y: number; label?: string; colour?: string; fill?: string }) {
  return <g>
    <rect x={x - 18} y={y - 64} width={36} height={64} rx="6" fill={fill} stroke={colour} strokeWidth="2" />
    <rect x={x - 11} y={y - 56} width={22} height={14} rx="3" fill="white" stroke={colour} strokeWidth="1.4" />
    <path d={`M${x + 18} ${y - 40}h8v26q0 6 -5 6`} stroke={P.wire} strokeWidth="2.4" fill="none" />
    {label && <text x={x} y={y + 18} textAnchor="middle" fontSize="13" fontWeight="700" fill={colour}>{label}</text>}
  </g>
}

/* ---------- Section 1: which resources run out? ---------- */

function Uses() {
  const panel = (x: number, title: string, child: ReactNode) => <g>
    <Card x={x} y={34} w={160} h={200} strong />
    {child}
    <Lines x={x + 80} y={206} anchor="middle" lines={title.split('|')} size={14} weight={750} />
  </g>
  return <PhysicsDiagram title="Three main uses of energy resources: generating electricity at a power station, transport such as cars and trains, and heating buildings.">
    {panel(14, 'generating|electricity', <g><PowerStation x={74} y={168} /><Pylon x={138} y={168} s={0.9} /><path d="M20 168H168" stroke="#b9a58a" strokeWidth="2.4" /></g>)}
    {panel(190, 'transport', <g><Car x={236} y={112} s={0.8} /><Train x={294} y={172} s={0.72} /></g>)}
    {panel(366, 'heating', <g><HouseIcon x={446} y={168} s={1.2} /><path d="M380 168H512" stroke="#b9a58a" strokeWidth="2.4" /></g>)}
    <Caption y={272} text="energy resources are used in three main ways" />
  </PhysicsDiagram>
}
function Gauge({ x, y, level, refill = false, colour }: { x: number; y: number; level: number; refill?: boolean; colour: string }) {
  // A fuel gauge: an arc from empty (left) to full (right) with a needle.
  const a = Math.PI + level * Math.PI, nx = r1(x + Math.cos(a) * 26), ny = r1(y + Math.sin(a) * 26)
  return <g>
    <path d={`M${x - 32} ${y}A32 32 0 0 1 ${x + 32} ${y}`} stroke={P.grid} strokeWidth="9" fill="none" />
    <path d={`M${x - 32} ${y}A32 32 0 0 1 ${r1(x + Math.cos(a) * 32)} ${r1(y + Math.sin(a) * 32)}`} stroke={colour} strokeWidth="9" fill="none" strokeLinecap="butt" opacity=".7" />
    <path d={`M${x} ${y}L${nx} ${ny}`} stroke={ink} strokeWidth="2.6" /><circle cx={x} cy={y} r="4" fill={ink} />
    <text x={x - 36} y={y + 16} textAnchor="middle" fontSize="12" fontWeight="700" fill={muted}>E</text>
    <text x={x + 36} y={y + 16} textAnchor="middle" fontSize="12" fontWeight="700" fill={muted}>F</text>
    {refill && <path d={`M${x + 44} ${y - 30}a14 14 0 1 1 -6 -12`} stroke={colour} strokeWidth="2.4" fill="none" />}
    {refill && <path d={`M${x + 34} ${y - 48}l6 7l-9 3`} stroke={colour} strokeWidth="2.4" fill="none" />}
  </g>
}
function NonRenewable() {
  const list: Resource[] = ['coal', 'oil', 'gas', 'nuclear']
  return <PhysicsDiagram title="Non-renewable energy resources: coal, oil and natural gas, which are the fossil fuels, and nuclear fuel. They will run out one day, shown by a fuel gauge near empty.">
    <text x={24} y={30} fontSize="16" fontWeight="800" fill={NR.text}>non-renewable</text>
    <path d="M22 80V70Q22 64 28 64H300Q306 64 306 70V80" stroke={NR.line} strokeWidth="2" fill="none" />
    <text x={164} y={56} textAnchor="middle" fontSize="13" fontWeight="700" fill={NR.text}>fossil fuels</text>
    {list.map((r, i) => <Tile key={r} r={r} x={66 + i * 100} y={132} family="nonRenewable" w={88} />)}
    <Gauge x={470} y={132} level={0.12} colour={NR.line} />
    <Lines x={470} y={176} anchor="middle" lines={['will run out', 'one day']} size={14} weight={750} colour={NR.text} />
    <Caption y={262} x={200} text="used faster than they can be replaced" />
  </PhysicsDiagram>
}
function Renewable() {
  const list: Resource[] = ['sun', 'wind', 'waves', 'hydro', 'biofuel', 'tides', 'geothermal']
  return <PhysicsDiagram title="Renewable energy resources: solar, wind, waves, hydro-electricity, bio-fuel, tides and geothermal. They are replaced as they are used, so they never run out, shown by a gauge that stays full.">
    <text x={24} y={30} fontSize="16" fontWeight="800" fill={RN.text}>renewable</text>
    {list.map((r, i) => <Tile key={r} r={r} x={i < 4 ? 58 + i * 96 : 106 + (i - 4) * 96} y={i < 4 ? 86 : 196} family="renewable" w={88} />)}
    <Gauge x={470} y={128} level={0.94} refill colour={RN.line} />
    <Lines x={470} y={172} anchor="middle" lines={['replaced as', 'it is used']} size={14} weight={750} colour={RN.text} />
  </PhysicsDiagram>
}
function Compare() {
  const col = (x: number, title: string, fam: typeof NR, items: [boolean, string][]) => <g>
    <rect x={x} y={20} width={240} height={260} rx="16" fill={fam.fill} fillOpacity=".5" stroke={fam.line} strokeWidth="2" />
    <text x={x + 120} y={50} textAnchor="middle" fontSize="16" fontWeight="800" fill={fam.text}>{title}</text>
    {items.map(([good, t], i) => <g key={t}>{good ? <Tick x={x + 28} y={90 + i * 46} /> : <Cross x={x + 28} y={90 + i * 46} />}
      <Lines x={x + 50} y={95 + i * 46 - (t.includes('|') ? 8 : 0)} lines={t.split('|')} size={14} weight={650} /></g>)}
  </g>
  return <PhysicsDiagram title="Good and bad points. Non-renewable: reliable (good), but will run out and damage the environment. Renewable: never run out and usually less harmful (good), but most cause some damage and some are unreliable because they depend on the weather.">
    {col(20, 'non-renewable', NR, [[true, 'reliable'], [false, 'will run out'], [false, 'damage the|environment']])}
    {col(280, 'renewable', RN, [[true, 'never run out'], [true, 'usually less|harmful'], [false, 'most cause|some damage'], [false, 'some unreliable|(weather)']])}
  </PhysicsDiagram>
}

/* ---------- Section 2: transport (one road scene) ---------- */

const ROAD = 236
function Road() {
  return <g><path d={`M10 ${ROAD}Q270 ${ROAD - 4} 530 ${ROAD}`} stroke="#8a7a66" strokeWidth="3" fill="none" /><path d={`M340 ${ROAD + 10}H520`} stroke="#c9bca8" strokeWidth="2" strokeDasharray="12 10" /></g>
}
function Transport({ focus }: { focus: string }) {
  if (focus === 'eres-electric') return <PhysicsDiagram title="Electric vehicles: a train and a car are powered by electricity from the pylons. The electricity is generated first, from either renewable or non-renewable resources.">
    <Road />
    <Pylon x={200} y={ROAD} s={1.2} />
    <path d={`M222 ${ROAD - 58}C300 ${ROAD - 50} 380 ${ROAD - 56} 452 ${ROAD - 58}`} stroke={steel} strokeWidth="1.8" fill="none" />
    <Train x={452} y={ROAD - 4} s={0.8} />
    <rect x={250} y={ROAD - 40} width={14} height={40} rx="4" fill={steelFill} stroke={steel} strokeWidth="2" />
    <path d={`M264 ${ROAD - 28}C276 ${ROAD - 28} 276 ${ROAD - 18} 288 ${ROAD - 18}`} stroke={P.wire} strokeWidth="3" fill="none" />
    <Car x={328} y={ROAD} s={0.9} />
    <Card x={16} y={40} w={150} h={120} tone="plain" strong>
      <text x={91} y={64} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>generated first</text>
      <g transform="translate(58 100)"><rect x={-26} y={-26} width={52} height={52} rx="10" fill={RN.fill} stroke={RN.line} strokeWidth="1.6" /><Icon r="wind" x={0} y={2} s={0.8} /></g>
      <g transform="translate(124 100)"><rect x={-26} y={-26} width={52} height={52} rx="10" fill={NR.fill} stroke={NR.line} strokeWidth="1.6" /><Icon r="coal" x={0} y={0} s={0.8} /></g>
      <text x={91} y={148} textAnchor="middle" fontSize="12" fontWeight="700" fill={muted}>renewable or not</text>
    </Card>
    <TransferArrow from={[168, 110]} to={[196, 160]} bend={-0.2} colour={steel} width={2.6} />
    <Caption y={284} text="only as green as the resource that made the electricity" />
  </PhysicsDiagram>
  const bio = focus === 'eres-biofuel'
  return <PhysicsDiagram title={bio ? 'Bio-fuel is made from plants or waste and goes to the pump. Many cars run on a mix of bio-fuel with petrol or diesel. Bio-fuel is renewable.' : 'Petrol and diesel are made from oil, a fossil fuel, and go from the pump into the car. They are non-renewable.'}>
    <Road />
    {bio ? <g>
      <rect x={30} y={92} width={100} height={100} rx="16" fill={RN.fill} stroke={RN.line} strokeWidth="2" />
      <Icon r="biofuel" x={80} y={136} s={1.6} />
      <text x={80} y={214} textAnchor="middle" fontSize="13" fontWeight="700" fill={RN.text}>plants or waste</text>
    </g> : <g>
      <rect x={30} y={92} width={100} height={100} rx="16" fill={NR.fill} stroke={NR.line} strokeWidth="2" />
      <Icon r="oil" x={80} y={140} s={1.7} />
      <text x={80} y={214} textAnchor="middle" fontSize="13" fontWeight="700" fill={NR.text}>oil (a fossil fuel)</text>
    </g>}
    <Arrow from={[140, 150]} to={[188, 170]} colour={bio ? RN.line : NR.line} width={3} />
    {bio ? <FuelPump x={230} y={ROAD} label="bio-fuel" colour={RN.line} fill={RN.fill} />
      : <g><FuelPump x={214} y={ROAD} label="petrol" /><FuelPump x={264} y={ROAD} label="diesel" /></g>}
    <Arrow from={[300, 196]} to={[340, 196]} colour={bio ? RN.line : NR.line} width={3} />
    <Car x={410} y={ROAD} s={1.2} />
    {bio ? <g>
      <Chip x={380} y={112} text="often mixed with petrol or diesel" tone="plain" size={13} />
      <Chip x={380} y={60} text="renewable" tone="useful" size={16} />
    </g> : <Chip x={380} y={70} text="made from oil: non-renewable" tone="plain" size={14} />}
  </PhysicsDiagram>
}

/* ---------- Section 3: heating (one house) ---------- */

const G = 226 // ground level
function HeatingHouse({ focus }: { focus: string }) {
  const boiler = focus === 'eres-boiler', geo = focus === 'eres-geothermal', solar = focus === 'eres-solar-heater', elec = focus === 'eres-electric-heat'
  const titles: Record<string, string> = {
    'eres-boiler': 'Natural gas is burnt in a boiler to heat water. The hot water is pumped through pipes to a radiator, which warms the room.',
    'eres-geothermal': 'A geothermal heat pump: pipes run down into the ground, where hot rocks supply energy to heat the building. No fuel is burnt.',
    'eres-solar-heater': 'A solar water heater on the roof: sunlight heats water, which is pumped to a radiator in the room. No fuel is burnt.',
    'eres-electric-heat': 'An electric heater plugged into a socket. The electricity comes from a power station that may use renewable or non-renewable resources.',
  }
  const pipe = (d: string) => <g fill="none"><path d={d} stroke="#9a5a3a" strokeWidth="7" /><path d={d} stroke={P.hotFill} strokeWidth="3.4" /></g>
  return <PhysicsDiagram title={titles[focus]}>
    {/* ground, with hot rocks deep down when geothermal */}
    <path d={`M0 ${G}Q270 ${G - 4} 540 ${G}V290Q540 300 530 300H10Q0 300 0 290Z`} fill="#efe3cf" />
    {geo && <path d={`M0 262Q140 256 270 264T540 260V290Q540 300 530 300H10Q0 300 0 290Z`} fill="#f2c6b0" stroke={P.hot} strokeWidth="1.6" />}
    {geo && [60, 180, 420, 500].map((x, i) => <path key={x} d={blob(x, 282, 16, 7, i + 2, 0.2, 8)} fill={P.hot} opacity=".35" />)}
    {/* house */}
    <path d={`M150 ${G}V${G - 110}H370V${G}Z`} fill="#fbf6ee" stroke="#9c8a74" strokeWidth="2.4" />
    <path d={`M136 ${G - 106}L260 ${G - 178}L384 ${G - 106}Q260 ${G - 114} 136 ${G - 106}Z`} fill="#d99a7c" stroke="#a5634a" strokeWidth="2.4" />
    {!elec && <Radiator x={300} y={G - 10} s={1.2} warm />}
    {(elec ? [210, 224, 238] : [316, 332, 348]).map(x => <path key={x} d={`M${x} ${G - 52 - (elec ? 12 : 0)}q-4 -6 0 -12t0 -12`} stroke={P.thermalLine} strokeWidth="2" fill="none" opacity=".7" />)}
    {boiler && <g>
      <rect x={172} y={G - 88} width={44} height={60} rx="6" fill="white" stroke={steel} strokeWidth="2.2" />
      <path d={`M186 ${G - 36}C180 ${G - 40} 182 ${G - 48} 186 ${G - 52}C188 ${G - 46} 192 ${G - 46} 192 ${G - 50}C198 ${G - 44} 196 ${G - 38} 190 ${G - 36}Z`} fill="#a9cff0" stroke="#3f7fb0" strokeWidth="1.4" />
      {pipe(`M216 ${G - 70}H262V${G - 30}H300`)}
      <path d={`M150 ${G - 40}H172`} stroke="#3f7fb0" strokeWidth="3" />
      <text x={100} y={G - 70} textAnchor="middle" fontSize="13" fontWeight="700" fill="#3f7fb0">natural gas</text>
      <text x={100} y={G - 54} textAnchor="middle" fontSize="13" fontWeight="700" fill="#3f7fb0">burnt</text>
      <path d={`M100 ${G - 48}V${G - 40}H150`} stroke="#3f7fb0" strokeWidth="1.6" fill="none" strokeDasharray="4 4" />
      <text x={194} y={G - 96} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>boiler</text>
      <text x={262} y={G - 76} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.hot}>hot water</text>
    </g>}
    {geo && <g>
      {pipe(`M300 ${G - 30}H240V${G + 52}Q240 ${G + 60} 248 ${G + 60}H262Q270 ${G + 60} 270 ${G + 52}V${G}`)}
      <rect x={228} y={G - 44} width={40} height={30} rx="5" fill="white" stroke={steel} strokeWidth="2" />
      <text x={248} y={G - 50} textAnchor="middle" fontSize="12" fontWeight="700" fill={ink}>pump</text>
      {[200, 310].map(x => <path key={x} d={`M${x} ${G + 60}q-4 -6 0 -12t0 -12`} stroke={P.hot} strokeWidth="2.2" fill="none" />)}
      <Lines x={330} y={G + 24} lines={['hot rocks deep below']} size={14} weight={750} colour={P.hot} />
    </g>}
    {solar && <g>
      <g transform={`rotate(-30 196 ${G - 142})`}><rect x={166} y={G - 150} width={62} height={16} rx="3" fill="#cfe0ee" stroke="#4f7ea3" strokeWidth="2" />
        {[178, 190, 202, 214].map(x => <path key={x} d={`M${x} ${G - 150}v16`} stroke="#4f7ea3" strokeWidth="1.2" />)}</g>
      {pipe(`M222 ${G - 150}V${G - 30}H300`)}
      <Icon r="sun" x={56} y={50} s={1.4} />
      <Arrow from={[90, 62]} to={[170, 80]} colour={P.lightLine} width={3} />
      <text x={100} y={50} fontSize="13" fontWeight="700" fill={P.lightLine}>sunlight</text>
      <Lines x={120} y={140} anchor="end" lines={['solar water', 'heater']} size={13} weight={700} colour="#4f7ea3" />
      <path d="M124 136L178 100" stroke={ink} strokeWidth="1.4" /><circle cx={178} cy={100} r="2.6" fill={ink} />
    </g>}
    {elec && <g>
      <rect x={196} y={G - 50} width={56} height={40} rx="6" fill={P.hotFill} stroke={P.hot} strokeWidth="2" />
      {[206, 216, 226, 236].map(x => <path key={x} d={`M${x} ${G - 44}V${G - 16}`} stroke={P.hot} strokeWidth="1.6" />)}
      <rect x={160} y={G - 40} width={14} height={18} rx="3" fill="white" stroke={steel} strokeWidth="1.8" />
      <path d={`M196 ${G - 22}C186 ${G - 22} 186 ${G - 30} 174 ${G - 30}`} stroke={P.wire} strokeWidth="2.6" fill="none" />
      <path d={`M160 ${G - 32}C130 ${G - 36} 110 ${G - 52} 86 ${G - 50}`} stroke={steel} strokeWidth="1.8" fill="none" strokeDasharray="5 5" />
      <PowerStation x={60} y={G} s={0.9} />
      <Lines x={14} y={70} lines={['power station:', 'renewable or', 'non-renewable']} size={13} weight={700} colour={muted} />
      <text x={262} y={G - 24} fontSize="13" fontWeight="700" fill={P.hot}>electric heater</text>
    </g>}
    {!elec && <text x={336} y={G - 94} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.hot}>radiator</text>}
    {!elec && <g>{(geo || solar) && <Chip x={460} y={60} text="no fuel burnt" tone="useful" size={14} />}</g>}
    {elec && <Chip x={124} y={G - 80} text="electricity" tone="plain" size={13} />}
  </PhysicsDiagram>
}

/* ---------- Question: four numbered cards ---------- */

function QuestionCards() {
  const cards: Resource[] = ['coal', 'wind', 'nuclear', 'tides']
  return <PhysicsDiagram schematic={false} viewBox="0 0 540 200" title="Four numbered energy resource cards: 1 coal, 2 wind turbine, 3 nuclear fuel, 4 tides.">
    {cards.map((r, i) => <g key={r}>
      <Tile r={r} x={78 + i * 128} y={100} w={100} />
      <Marker n={i + 1} x={78 + i * 128 - 44} y={42} to={[78 + i * 128 - 30, 66]} />
    </g>)}
  </PhysicsDiagram>
}

export function EnergyResourceVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'eres-uses': return <Uses />
    case 'eres-nonrenew': return <NonRenewable />
    case 'eres-renew': return <Renewable />
    case 'eres-compare': return <Compare />
    case 'eres-fuels': case 'eres-biofuel': case 'eres-electric': return <Transport focus={focus} />
    case 'eres-boiler': case 'eres-geothermal': case 'eres-solar-heater': case 'eres-electric-heat': return <HeatingHouse focus={focus} />
    case 'eres-q-cards': return <QuestionCards />
    default: return null
  }
}
