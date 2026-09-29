import { physicsPalette as P, TransferArrow, type Pt } from './PhysicsKit'
import { Fig, Say, Tag, Panel, Clip, Sun, Bolt, Pylon, Tree, Bird, Fish, blob, smooth, landPath, wavePath, PowerPlant, CoolingTower, scene as S } from './WindSolarVisuals'

/*
 * Physics Lesson 13: bio-fuels and fossil fuels. Original, code-native schematics; not to scale. Focus ids start 'biofuel-'.
 * Colour code: amber = fuels (coal, oil, gas, bio-fuel in its tank); green = crops and plants; purple = carbon dioxide (as in
 * Chemistry and Biology); mustard = sulfur dioxide; blue = water and rain; vermilion bolt = electricity; olive = nuclear;
 * green tick tag = advantage, coral cross tag = problem. Small pictures (chimney, barrel, fuel icons) are reused in the summary.
 */
const { ink, muted } = P
const r1 = (n: number) => Math.round(n * 10) / 10
const fuel = '#f6dfa5', fuelLine = '#c98f2c'
export const co2 = '#e4d6f2', co2Line = '#8f6fc4'
const so2 = '#efe6b0', so2Line = '#9a8a2a'
const coal = '#4d5660', coalLine = '#2f363d'
const nuke = P.nuclear, nukeLine = P.nuclearLine

/* ---------- Small pictures ---------- */
export function Car({ x, y, s = 1, colour = '#dfe9f2', line = '#5d7486', exhaust = false }: { x: number; y: number; s?: number; colour?: string; line?: string; exhaust?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={1.7 / s}>
    {exhaust && <path d="M-40 -8H-46" stroke={line} strokeWidth={3 / s} />}
    <path d="M-40 -6V-18Q-40 -22 -35 -22H-22L-12 -34H14L26 -22H36Q40 -22 40 -17V-6Z" fill={colour} stroke={line} />
    <path d="M-9 -31H1V-23H-18ZM5 -31H12L20 -23H5Z" fill="white" stroke={line} strokeWidth={1.2 / s} />
    <circle cx="-24" cy="-6" r="7" fill="#3e4c58" stroke={line} /><circle cx="24" cy="-6" r="7" fill="#3e4c58" stroke={line} />
    <circle cx="-24" cy="-6" r="2.5" fill="#dfe6ec" /><circle cx="24" cy="-6" r="2.5" fill="#dfe6ec" />
  </g>
}
function Cow({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={1.6 / s} stroke="#7d6a58">
    <path d="M-8 0V-14M-2 0V-14M14 0V-14M20 0V-14" strokeWidth={3 / s} />
    <path d={blob(6, -22, 22, 12, 3, .06)} fill="white" />
    <path d={blob(-2, -24, 6, 5, 8, .1)} fill="#6f6255" stroke="none" /><path d={blob(14, -20, 5, 4, 9, .1)} fill="#6f6255" stroke="none" />
    <path d="M-16 -30Q-28 -32 -28 -22Q-28 -14 -20 -16Z" fill="#f4d8cf" />
    <path d="M-18 -32L-22 -38M-14 -31L-12 -37" />
  </g>
}
function Dung({ x, y }: { x: number; y: number }) {
  return <path d={`M${x - 12} ${y}Q${x - 12} ${y - 7} ${x - 5} ${y - 7}Q${x - 4} ${y - 13} ${x + 2} ${y - 12}Q${x + 9} ${y - 11} ${x + 7} ${y - 6}Q${x + 13} ${y - 5} ${x + 12} ${y}Z`} fill="#b7976c" stroke="#7d6346" strokeWidth="1.5" />
}
function Crop({ x, y, h = 36, dim = false }: { x: number; y: number; h?: number; dim?: boolean }) {
  return <g opacity={dim ? .35 : 1} stroke={P.plantLine} strokeWidth="1.6" fill="none">
    <path d={`M${x} ${y}V${y - h}`} />
    <path d={`M${x} ${y - h * .45}Q${x - 9} ${y - h * .6} ${x - 11} ${y - h * .8}Q${x - 3} ${y - h * .7} ${x} ${y - h * .5}`} fill={P.plant} />
    <path d={`M${x} ${y - h * .65}Q${x + 9} ${y - h * .8} ${x + 10} ${y - h}Q${x + 2} ${y - h * .9} ${x} ${y - h * .7}`} fill={P.plant} />
    <path d={blob(x, y - h - 5, 3.2, 7, x, .05)} fill="#e8d27a" stroke="#b39a33" />
  </g>
}
function Tank({ x, y, w = 56, h = 60, label, level = .7, tick = false }: { x: number; y: number; w?: number; h?: number; label?: string; level?: number; tick?: boolean }) {
  const top = y - h, fillTop = y - h * level
  return <g>
    <rect x={x - w / 2} y={top} width={w} height={h} rx="8" fill="#f7f4ee" stroke={fuelLine} strokeWidth="1.8" />
    <path d={`M${x - w / 2 + 1.5} ${fillTop}H${x + w / 2 - 1.5}V${y - 8}Q${x + w / 2 - 1.5} ${y - 1.5} ${x + w / 2 - 8} ${y - 1.5}H${x - w / 2 + 8}Q${x - w / 2 + 1.5} ${y - 1.5} ${x - w / 2 + 1.5} ${y - 8}Z`} fill={fuel} />
    <ellipse cx={x} cy={top} rx={w / 2 - 2} ry="5" fill="#fbf8f2" stroke={fuelLine} strokeWidth="1.5" />
    {label && <text x={x} y={y + 18} textAnchor="middle" fontSize="13.5" fontWeight="700" fill={ink}>{label}</text>}
    {tick && <g><circle cx={x + w / 2} cy={top + 4} r="11" fill="white" stroke={P.useful} strokeWidth="2" /><path d={`M${x + w / 2 - 5} ${top + 4}l3.5 3.5 6 -7`} stroke={P.useful} strokeWidth="2.4" fill="none" /></g>}
  </g>
}
export function CoalPile({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const lumps: [number, number, number][] = [[-22, -6, 8], [-8, -7, 9], [8, -6, 8], [22, -5, 7], [-14, -18, 8], [2, -19, 9], [16, -16, 7], [-5, -29, 8], [9, -29, 6]]
  return <g transform={`translate(${x} ${y}) scale(${s})`}>{lumps.map(([dx, dy, r], i) => <path key={i} d={blob(dx, dy, r, r * .85, i * 7 + 3, .18, 6)} fill={coal} stroke={coalLine} strokeWidth={1.3 / s} />)}</g>
}
function OilDrop({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -20C6 -10 13 -3 13 5A13 13 0 0 1 -13 5C-13 -3 -6 -10 0 -20Z" fill="#6b5a3f" stroke="#3f3424" strokeWidth={1.6 / s} />
}
function GasFlame({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={1.6 / s}>
    <path d="M0 -22C8 -12 12 -6 12 2A12 12 0 0 1 -12 2C-12 -6 -6 -10 -4 -16C-2 -10 0 -10 0 -22Z" fill="#cfe3fa" stroke="#3f7fc7" />
    <path d="M0 -6C4 -2 5 1 5 4A5 5 0 0 1 -5 4C-5 1 -3 -2 0 -6Z" fill="#fdf0cf" stroke="#d99a2a" />
  </g>
}
function FuelRod({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={1.6 / s}>
    <rect x="-6" y="-26" width="12" height="46" rx="5" fill={nuke} stroke={nukeLine} />
    {[-16, -6, 4].map(d => <path key={d} d={`M-6 ${d + 6}H6`} stroke={nukeLine} strokeWidth={1 / s} />)}
  </g>
}
function Trefoil({ x, y, r = 10 }: { x: number; y: number; r?: number }) {
  const blade = (a: number) => { const a1 = (a - 30) * Math.PI / 180, a2 = (a + 30) * Math.PI / 180, ri = r * .3; return `M${r1(x + Math.cos(a1) * ri)} ${r1(y + Math.sin(a1) * ri)}L${r1(x + Math.cos(a1) * r)} ${r1(y + Math.sin(a1) * r)}A${r} ${r} 0 0 1 ${r1(x + Math.cos(a2) * r)} ${r1(y + Math.sin(a2) * r)}L${r1(x + Math.cos(a2) * ri)} ${r1(y + Math.sin(a2) * ri)}A${ri} ${ri} 0 0 0 ${r1(x + Math.cos(a1) * ri)} ${r1(y + Math.sin(a1) * ri)}Z` }
  return <g fill="#3a3a2a">{[-90, 30, 150].map(a => <path key={a} d={blade(a)} />)}<circle cx={x} cy={y} r={r * .18} /></g>
}
export function Barrel({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={1.8 / s}>
    <path d="M-20 -52Q-24 -26 -20 0H20Q24 -26 20 -52Z" fill="#f4ecb8" stroke="#8f7f1f" />
    <ellipse cx="0" cy="-52" rx="20" ry="5" fill="#faf5d8" stroke="#8f7f1f" />
    <path d="M-22 -36H22M-22 -14H22" stroke="#8f7f1f" strokeWidth={1.3 / s} />
    <circle cx="0" cy="-25" r="9" fill="#fbe28a" stroke="#8f7f1f" strokeWidth={1.2 / s} />
    <Trefoil x={0} y={-25} r={7.5} />
  </g>
}
export function Warning({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M0 -16L15 10H-15Z" fill="#fdf0cf" stroke="#b98a17" strokeWidth={2 / s} /><text x="0" y="7" textAnchor="middle" fontSize="15" fontWeight="800" fill="#9a700f">!</text></g>
}
/** Puffs of gas coming out of a chimney top at (x, y), drifting up and right. */
export function Puffs({ x, y, fill, line, n = 3, label }: { x: number; y: number; fill: string; line: string; n?: number; label?: string }) {
  return <g>{Array.from({ length: n }, (_, i) => <path key={i} d={blob(x + 6 + i * 14, y - 12 - i * 18, 9 + i * 5, 7 + i * 3.5, i * 5 + 2, .1)} fill={fill} stroke={line} strokeWidth="1.5" />)}
    {label && <text x={x + 6 + (n - 1) * 14} y={y - 12 - (n - 1) * 18 + 4.5} textAnchor="middle" fontSize="12" fontWeight="750" fill={line}>{label}</text>}</g>
}
export function Chimney({ x, y, h = 70 }: { x: number; y: number; h?: number }) {
  return <g><path d={`M${x - 9} ${y}L${x - 7} ${y - h}H${x + 7}L${x + 9} ${y}Z`} fill="#eef1f4" stroke={S.steel} strokeWidth="1.6" /><path d={`M${x - 7.4} ${y - h + 10}H${x + 7.4}`} stroke={P.wasted} strokeWidth="3" /></g>
}
export function Thermometer({ x, y, level = .7 }: { x: number; y: number; level?: number }) {
  const h = 60
  return <g>
    <rect x={x - 6} y={y - h} width={12} height={h} rx="6" fill="white" stroke={muted} strokeWidth="1.6" />
    <circle cx={x} cy={y + 4} r="10" fill={P.hot} stroke={muted} strokeWidth="1.6" />
    <rect x={x - 2.5} y={y - h * level} width={5} height={h * level} fill={P.hot} />
    {[.25, .5, .75].map(f => <path key={f} d={`M${x + 6} ${y - h * f}h5`} stroke={muted} strokeWidth="1.2" />)}
  </g>
}
export function Globe({ x, y, r = 30, warm = false }: { x: number; y: number; r?: number; warm?: boolean }) {
  return <g>
    {warm && <circle cx={x} cy={y} r={r + 7} fill={P.hotFill} stroke={P.hot} strokeWidth="1.4" strokeDasharray="4 4" />}
    <circle cx={x} cy={y} r={r} fill={P.water} stroke={P.waterLine} strokeWidth="1.8" />
    <path d={blob(x - r * .3, y - r * .2, r * .38, r * .45, 5, .2, 7)} fill={P.plant} stroke={P.plantLine} strokeWidth="1.4" />
    <path d={blob(x + r * .4, y + r * .35, r * .3, r * .25, 9, .2, 7)} fill={P.plant} stroke={P.plantLine} strokeWidth="1.4" />
  </g>
}
function Arrow({ from, to, colour = ink, width = 2.4, bend = 0 }: { from: Pt; to: Pt; colour?: string; width?: number; bend?: number }) {
  return <TransferArrow from={from} to={to} bend={bend} colour={colour} width={width} />
}
export function Tick({ x, y }: { x: number; y: number }) {
  return <g><circle cx={x} cy={y} r="11" fill="white" stroke={P.useful} strokeWidth="2" /><path d={`M${x - 5} ${y}l3.5 3.5 6 -7`} stroke={P.useful} strokeWidth="2.4" fill="none" /></g>
}

/* ---------- Bio-fuels ---------- */
function What() {
  return <Fig title="A field of crops and a cow with a pile of dung. Both are made into bio-fuel, stored in a tank. The bio-fuel is burnt in a power station to generate electricity, or used to run a car." h={300}>
    <path d={blob(68, 156, 66, 9, 4, .08)} fill={S.grass} stroke={S.grassLine} strokeWidth="1.6" />
    <path d={blob(84, 262, 78, 9, 7, .08)} fill={S.grass} stroke={S.grassLine} strokeWidth="1.6" />
    {[24, 46, 68, 90, 112].map((x, i) => <Crop key={x} x={x} y={154 + (i % 2) * 2} h={40} />)}
    <Cow x={60} y={262} s={1.25} /><Dung x={122} y={262} />
    <Say x={70} y={100} lines={['plant products']} anchor="middle" size={13} />
    <Say x={78} y={290} lines={['animal dung']} anchor="middle" size={13} />
    <Arrow from={[140, 136]} to={[222, 180]} colour={fuelLine} bend={-.1} />
    <Arrow from={[140, 248]} to={[222, 214]} colour={fuelLine} bend={.1} />
    <Tank x={262} y={236} w={64} h={76} label="bio-fuel" />
    <Arrow from={[300, 180]} to={[376, 116]} colour={fuelLine} bend={-.12} />
    <Arrow from={[300, 226]} to={[376, 244]} colour={fuelLine} bend={.08} />
    <PowerPlant x={430} y={120} s={.95} />
    <Bolt x={498} y={96} s={1.1} />
    <Say x={434} y={146} lines={['burnt to make', 'electricity']} anchor="middle" size={13} />
    <Car x={440} y={262} s={1.1} />
    <Say x={440} y={290} lines={['runs cars']} anchor="middle" size={13} />
  </Fig>
}
function Pros() {
  const seasons = ['spring', 'summer', 'autumn', 'winter']
  return <Fig title="Four small tiles for the seasons, each with crops growing. The crops are made into bio-fuel all year round. Extra bio-fuel goes into a storage tank and is used when it is needed." h={280}>
    {seasons.map((n, i) => <g key={n}>
      <Panel x={14 + i * 78} y={40} w={70} h={110} tint={i === 3 ? '#f1f5f9' : '#f7fbf4'} />
      <path d={`M${20 + i * 78} 128H${78 + i * 78}`} stroke={S.grassLine} strokeWidth="2" />
      <Crop x={36 + i * 78} y={128} h={30 + i * 3} /><Crop x={58 + i * 78} y={128} h={34 + i * 2} />
      <text x={49 + i * 78} y={62} textAnchor="middle" fontSize="12.5" fontWeight="650" fill={muted}>{n}</text>
    </g>)}
    <path d="M14 172H320" stroke={P.plantLine} strokeWidth="2" /><path d="M318 166l10 6 -10 6z" fill={P.plantLine} />
    <Say x={167} y={196} lines={['crops grown all year']} anchor="middle" size={13.5} colour={P.plantLine} halo={false} />
    <Arrow from={[330, 110]} to={[392, 110]} colour={fuelLine} />
    <Tank x={440} y={150} w={70} h={96} level={.85} tick />
    <Say x={440} y={176} lines={['stored bio-fuel']} anchor="middle" size={13} halo={false} />
    <Tag x={270} y={216} lines={['extra can be made and stored,', 'then used when needed']} />
  </Fig>
}
function Forest() {
  const edge = 250
  return <Fig title="A forest on the left and a field of bio-fuel crops on the right, where the forest has been cleared. Tree stumps stand at the edge, and a bird and a small animal are leaving." h={290}>
    <Clip x={0} y={0} w={540} h={290} r={16}>
      <path d={landPath(x => 200 + 5 * Math.sin(x / 50), 0, 540, 300)} fill={S.grass} stroke={S.grassLine} strokeWidth="1.6" />
      <path d={landPath(x => 202 + 5 * Math.sin(x / 50), edge + 10, 540, 300)} fill="#efe3c6" />
      <path d={smooth(Array.from({ length: 15 }, (_, i) => [edge + 10 + i * 20, 202 + 5 * Math.sin((edge + 10 + i * 20) / 50)] as Pt))} stroke="#c9ad74" strokeWidth="1.6" fill="none" />
    </Clip>
    {[[30, 1.3], [74, 1.5], [118, 1.2], [160, 1.45], [204, 1.25], [52, 1.1], [140, 1.05]].map(([x, s], i) => <Tree key={i} x={x} y={204 + 5 * Math.sin(x / 50)} s={s} seed={i * 3 + 1} />)}
    {[262, 296, 330].map(x => <path key={x} d={`M${x - 6} ${204 + 5 * Math.sin(x / 50)}V${192 + 5 * Math.sin(x / 50)}H${x + 6}V${204 + 5 * Math.sin(x / 50)}Z`} fill="#d9b98c" stroke="#8a6443" strokeWidth="1.5" />)}
    {[370, 396, 422, 448, 474, 500].map((x, i) => <Crop key={x} x={x} y={204 + 5 * Math.sin(x / 50) - (i % 2)} h={34} />)}
    <Bird x={320} y={70} s={1.3} /><Bird x={356} y={52} s={1} />
    <path d="M248 96Q290 70 306 72" stroke={muted} strokeWidth="1.4" strokeDasharray="3 5" fill="none" />
    <g transform="translate(300 238)"><path d="M-12 0C-12 -9 -4 -13 4 -12C10 -11 13 -6 12 0Z" fill="#d8c1a3" stroke="#8a6443" strokeWidth="1.5" /><circle cx="12" cy="-9" r="5" fill="#d8c1a3" stroke="#8a6443" strokeWidth="1.5" /><path d="M-12 -4Q-20 -8 -18 -14" stroke="#8a6443" strokeWidth="1.5" fill="none" /></g>
    <path d="M320 240H356" stroke={muted} strokeWidth="1.6" strokeDasharray="3 4" /><path d="M354 235l8 5 -8 5z" fill={muted} />
    <Say x={120} y={30} lines={['forest']} anchor="middle" colour={P.plantLine} halo={false} />
    <Say x={430} y={30} lines={['forest cleared', 'for crops']} anchor="middle" halo={false} />
    <Tag x={524} y={112} lines={['habitats lost']} kind="con" anchor="end" />
  </Fig>
}
function Co2() {
  return <Fig title="Two steps. First, a growing crop takes in carbon dioxide from the air. Later, the bio-fuel made from it is burnt in a car engine, which gives carbon dioxide back out into the air." h={290}>
    <Clip x={0} y={0} w={540} h={290} r={16}><path d={landPath(x => 216 + 3 * Math.sin(x / 40), 0, 540, 300)} fill={S.grass} stroke={S.grassLine} strokeWidth="1.6" /></Clip>
    <Sun x={40} y={46} r={16} />
    {[110, 140, 170].map((x, i) => <Crop key={x} x={x} y={216} h={56 + (i % 2) * 8} />)}
    {[[70, 110], [150, 88], [214, 110]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="13" fill={co2} stroke={co2Line} strokeWidth="1.5" /><text x={x} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="750" fill={co2Line}>CO₂</text></g>)}
    <Arrow from={[80, 122]} to={[104, 150]} colour={co2Line} width={2.2} />
    <Arrow from={[150, 104]} to={[146, 140]} colour={co2Line} width={2.2} />
    <Arrow from={[206, 124]} to={[182, 152]} colour={co2Line} width={2.2} />
    <Say x={140} y={254} lines={['absorbs carbon dioxide', 'while growing']} anchor="middle" size={13} />
    <Say x={262} y={150} lines={['later']} anchor="middle" size={13} colour={muted} halo={false} />
    <Arrow from={[238, 168]} to={[288, 168]} colour={muted} width={2} />
    <Car x={452} y={218} s={1.3} exhaust />
    {[[384, 196, 12], [364, 166, 14], [352, 132, 15]].map(([x, y, r], i) => <g key={i}><circle cx={x} cy={y} r={r} fill={co2} stroke={co2Line} strokeWidth="1.5" /><text x={x} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="750" fill={co2Line}>CO₂</text></g>)}
    <Say x={420} y={254} lines={['releases carbon dioxide', 'when burnt']} anchor="middle" size={13} />
  </Fig>
}

/* ---------- Fossil fuels and nuclear fuel ---------- */
function Reliable() {
  const icons = [{ x: 70, el: <CoalPile x={70} y={92} s={1.1} />, name: 'coal' }, { x: 170, el: <OilDrop x={170} y={78} s={1.4} />, name: 'oil' }, { x: 270, el: <GasFlame x={270} y={80} s={1.4} />, name: 'natural gas' }, { x: 370, el: <FuelRod x={370} y={76} s={1.2} />, name: 'nuclear fuel' }]
  return <Fig title="Coal, oil, natural gas and nuclear fuel all feed a power station, which keeps up a steady supply of electricity. There is enough of these fuels to meet current demand." h={290}>
    {icons.map(i => <g key={i.name}>{i.el}<text x={i.x} y={122} textAnchor="middle" fontSize="13" fontWeight="650" fill={ink}>{i.name}</text></g>)}
    {icons.map(i => <Arrow key={i.name} from={[i.x, 134]} to={[250 + (i.x - 220) * .25, 196]} colour={fuelLine} width={2} bend={0} />)}
    <PowerPlant x={250} y={260} s={1.1} />
    <Pylon x={340} y={260} h={58} />
    <Bolt x={312} y={218} />
    <path d="M40 260H500" stroke={S.grassLine} strokeWidth="2" />
    <Tag x={524} y={150} lines={['reliable: enough', 'for current demand']} anchor="end" />
  </Fig>
}
function Stock() {
  return <Fig title="A power station beside a big stockpile of coal. When the demand bar rises, more coal is taken from the stock and burnt straight away, so the power station can respond quickly." h={290}>
    <path d="M20 240H520" stroke={S.grassLine} strokeWidth="2" />
    <CoalPile x={90} y={240} s={2} />
    <Say x={90} y={266} lines={['stock of fuel']} anchor="middle" size={13} halo={false} />
    <Arrow from={[140, 196]} to={[214, 196]} colour={fuelLine} width={3} />
    <PowerPlant x={270} y={240} s={1.15} />
    <Bolt x={332} y={196} />
    <Arrow from={[344, 190]} to={[392, 160]} colour={S.electric} width={2.4} bend={-.1} />
    <rect x={420} y={96} width={40} height={144} rx="4" fill={P.kinetic} stroke={P.kineticLine} strokeWidth="1.6" />
    <rect x={420} y={140} width={40} height={100} rx="4" fill="#f6e3d0" stroke="none" />
    <path d="M420 140H460" stroke={P.kineticLine} strokeWidth="1.2" strokeDasharray="4 3" />
    <path d="M478 136V100M471 108l7 -10 7 10" stroke={P.kineticLine} strokeWidth="2.4" fill="none" />
    <Say x={440} y={266} lines={['demand rises']} anchor="middle" size={13} halo={false} />
    <Say x={177} y={184} lines={['more burnt']} anchor="middle" size={12.5} colour={fuelLine} halo={false} />
    <Say x={260} y={40} lines={['responds quickly to', 'changes in demand']} anchor="middle" size={14} halo={false} />
  </Fig>
}
function RunningOut() {
  const piles = [{ x: 90, s: 2 }, { x: 270, s: 1.35 }, { x: 450, s: .7 }]
  return <Fig title="Three pictures of the same stockpile of fossil fuel over time: large, then smaller, then nearly gone. Fossil fuels are slowly running out." h={270} note="Some fossil fuels may run out within a hundred years, if no new ones are found.">
    <path d="M20 170H520" stroke={S.grassLine} strokeWidth="2" />
    {piles.map((p, i) => <g key={i}><CoalPile x={p.x} y={170} s={p.s} /><text x={p.x} y={196} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>{['now', 'later', 'much later'][i]}</text></g>)}
    <Arrow from={[170, 126]} to={[204, 126]} colour={muted} width={2} /><Arrow from={[340, 126]} to={[384, 126]} colour={muted} width={2} />
    <Say x={270} y={40} lines={['non-renewable: slowly running out']} anchor="middle" size={14.5} colour={P.wasted} halo={false} />
    <Say x={270} y={232} lines={['once used, it cannot be replaced']} anchor="middle" size={13} halo={false} />
  </Fig>
}

/* ---------- Problems ---------- */
function Warming() {
  return <Fig title="Power station chimneys give out carbon dioxide, which rises into the atmosphere. The Earth, with a warm glow round it, warms up, and a thermometer shows the temperature rising." h={290}>
    <path d="M20 250H300" stroke={S.grassLine} strokeWidth="2" />
    <Chimney x={70} y={250} h={96} /><Chimney x={120} y={250} h={110} />
    <PowerPlant x={200} y={250} s={1} chimney={false} />
    <Puffs x={70} y={154} fill={co2} line={co2Line} n={3} />
    <Puffs x={120} y={140} fill={co2} line={co2Line} n={3} label="CO₂" />
    <path d="M20 40Q270 -6 520 40" stroke={co2Line} strokeWidth="2" strokeDasharray="5 6" fill="none" />
    {[[200, 50], [250, 44], [300, 44], [350, 50]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill={co2} stroke={co2Line} strokeWidth="1.3" />)}
    <Say x={270} y={78} lines={['carbon dioxide in the atmosphere']} anchor="middle" size={13} colour={co2Line} halo={false} />
    <Globe x={400} y={180} r={42} warm />
    <Thermometer x={480} y={210} level={.8} />
    <path d="M498 176V140M491 148l7 -10 7 10" stroke={P.hot} strokeWidth="2.4" fill="none" />
    <Say x={410} y={268} lines={['Earth warms up:', 'global warming']} anchor="middle" size={13.5} colour={P.hot} halo={false} />
  </Fig>
}
function Acid() {
  return <Fig title="A chimney gives out sulfur dioxide, which forms a cloud. Rain from the cloud is acidic. It falls on a lake, where a fish is dying, and on a tree that has lost its leaves." h={300}>
    <Clip x={0} y={0} w={540} h={300} r={16}>
      <path d={landPath(x => 232 + 4 * Math.sin(x / 40), 0, 540, 310)} fill={S.grass} stroke={S.grassLine} strokeWidth="1.6" />
      <path d="M300 236Q300 272 380 274Q470 276 470 238Z" fill="#cfe2d4" stroke={P.waterLine} strokeWidth="1.8" />
    </Clip>
    <Chimney x={60} y={234} h={120} />
    <Puffs x={60} y={114} fill={so2} line={so2Line} n={2} />
    <path d={blob(250, 64, 110, 30, 12, .12, 11)} fill={so2} stroke={so2Line} strokeWidth="1.8" />
    <Say x={250} y={69} lines={['sulfur dioxide']} anchor="middle" size={13.5} colour="#6d6118" halo={false} />
    {[190, 220, 250, 280, 310, 340, 370, 400, 430].map((x, i) => <g key={x}>{[0, 44, 88].map(dy => <path key={dy} d={`M${x - dy * .3} ${108 + dy + (i % 2) * 18}l-5 14`} stroke={so2Line} strokeWidth="2.2" />)}</g>)}
    <Say x={454} y={140} lines={['acid rain']} size={14} colour="#6d6118" halo />
    <Tree x={200} y={234} s={1.7} seed={4} dead />
    <g transform="rotate(180 386 256)"><Fish x={386} y={256} s={1} colour="#b3a38f" /></g>
    <Say x={200} y={276} lines={['trees and soils', 'damaged']} anchor="middle" size={13} />
    <Say x={385} y={220} lines={['lakes and rivers', 'become acidic']} anchor="middle" size={13} />
  </Fig>
}
function Habitat() {
  return <Fig title="Two pictures. A coal mine: a big terraced hole cut into green land. An oil spill: a dark slick spreading on the sea, with a seabird covered in oil." h={280}>
    <Panel x={12} y={16} w={244} h={196} tint="white" /><Panel x={284} y={16} w={244} h={196} tint="white" />
    <Clip x={12} y={16} w={244} h={196}>
      <path d={landPath(x => 92 + 3 * Math.sin(x / 20), 12, 256, 220)} fill={S.grass} stroke={S.grassLine} strokeWidth="1.6" />
      <path d="M40 94L60 118H80L96 140H170L186 118H206L226 94Z" fill="#d9c7a8" stroke="#8a6443" strokeWidth="1.6" />
      <path d="M96 140L112 164H154L170 140Z" fill="#b89f7a" stroke="#8a6443" strokeWidth="1.6" />
      <CoalPile x={133} y={162} s={.6} />
      <Tree x={24} y={94} s={.7} seed={2} /><Tree x={240} y={94} s={.8} seed={6} />
    </Clip>
    <Clip x={284} y={16} w={244} h={196}>
      <path d={`${wavePath(284, 528, 92, 3, 30)}V220H284Z`} fill={P.water} stroke={P.waterLine} strokeWidth="1.6" />
      <path d={blob(410, 100, 92, 16, 14, .18, 11)} fill="#3e3a33" fillOpacity=".8" stroke="#2c2924" strokeWidth="1.2" />
      <Fish x={460} y={170} s={.9} colour="#b3a38f" />
    </Clip>
    <g transform="translate(340 82)"><ellipse cx="0" cy="0" rx="15" ry="8" fill="#7d786f" stroke="#3e3a33" strokeWidth="1.6" /><path d="M-6 -3Q2 -12 10 -4" stroke="#3e3a33" strokeWidth="1.4" fill="none" /><circle cx="14" cy="-10" r="6.5" fill="#7d786f" stroke="#3e3a33" strokeWidth="1.6" /><path d="M20 -11L29 -8L20 -7Z" fill="#c9a24a" stroke="#3e3a33" strokeWidth="1.2" /><circle cx="15" cy="-11.5" r="1.3" fill="white" /></g>
    <Say x={134} y={236} lines={['coal mining']} anchor="middle" halo={false} />
    <Say x={406} y={236} lines={['oil spills']} anchor="middle" halo={false} />
    <Say x={134} y={256} lines={['destroys habitats']} anchor="middle" size={13} colour={P.wasted} halo={false} />
    <Say x={406} y={256} lines={['harm sea creatures']} anchor="middle" size={13} colour={P.wasted} halo={false} />
  </Fig>
}
function Nuclear() {
  return <Fig title="A nuclear power station with a cooling tower and no carbon dioxide. Beside it, a sealed barrel of nuclear waste with a radiation symbol, and a warning sign for the risk of an accident." h={290}>
    <path d="M20 200H520" stroke={S.grassLine} strokeWidth="2" />
    <CoolingTower x={90} y={200} s={1.2} /><PowerPlant x={170} y={200} s={.9} chimney={false} />
    <Tag x={40} y={222} lines={['no carbon dioxide: clean']} />
    <Barrel x={320} y={200} s={1.25} /><Barrel x={372} y={200} s={1.05} />
    <Tag x={300} y={222} lines={['waste is very dangerous', 'and hard to get rid of']} kind="con" anchor="start" />
    <Warning x={470} y={110} s={1.6} />
    <Say x={470} y={160} lines={['risk of a big', 'accident: radiation']} anchor="middle" size={13} colour={P.wasted} halo={false} />
  </Fig>
}
function Whole() {
  const boxes = [
    { x: 14, y: 14, title: 'carbon dioxide', what: 'global warming', from: 'coal, oil and gas', icon: <g><Chimney x={46} y={100} h={50} /><Puffs x={46} y={50} fill={co2} line={co2Line} n={2} /></g> },
    { x: 276, y: 14, title: 'sulfur dioxide', what: 'acid rain', from: 'coal and oil', icon: <g><path d={blob(312, 60, 32, 13, 12, .12)} fill={so2} stroke={so2Line} strokeWidth="1.6" />{[296, 310, 324].map(x => <path key={x} d={`M${x} 80l-4 12`} stroke={so2Line} strokeWidth="2" />)}</g> },
    { x: 14, y: 146, title: 'mining and spills', what: 'habitats destroyed', from: 'coal and oil', icon: <g><CoalPile x={46} y={226} s={.9} /></g> },
    { x: 276, y: 146, title: 'nuclear power', what: 'radiation risk', from: 'nuclear fuel', icon: <Barrel x={312} y={232} s={.95} /> },
  ]
  return <Fig title="A summary card with four boxes. Carbon dioxide from coal, oil and gas: global warming. Sulfur dioxide from coal and oil: acid rain. Mining and oil spills: habitats destroyed. Nuclear power: dangerous waste and a risk of radiation." h={280}>
    {boxes.map(b => <g key={b.title}>
      <Panel x={b.x} y={b.y} w={250} h={120} />
      {b.icon}
      <text x={b.x + 82} y={b.y + 36} fontSize="14" fontWeight="750" fill={ink}>{b.title}</text>
      <text x={b.x + 82} y={b.y + 58} fontSize="12.5" fontWeight="600" fill={muted}>from {b.from}</text>
      <path d={`M${b.x + 82} ${b.y + 84}h12`} stroke={P.wasted} strokeWidth="2.2" /><path d={`M${b.x + 93} ${b.y + 79}l7 5 -7 5z`} fill={P.wasted} />
      <text x={b.x + 105} y={b.y + 89} fontSize="13" fontWeight="750" fill={P.wasted}>{b.what}</text>
    </g>)}
  </Fig>
}

export function BiofuelVisual({ focus }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'biofuel-what': return <What />
    case 'biofuel-pros': return <Pros />
    case 'biofuel-con': return <Forest />
    case 'biofuel-co2': return <Co2 />
    case 'biofuel-reliable': return <Reliable />
    case 'biofuel-stock': return <Stock />
    case 'biofuel-running-out': return <RunningOut />
    case 'biofuel-warming': return <Warming />
    case 'biofuel-acid': return <Acid />
    case 'biofuel-habitat': return <Habitat />
    case 'biofuel-nuclear': return <Nuclear />
    case 'biofuel-whole': return <Whole />
    default: return null
  }
}
