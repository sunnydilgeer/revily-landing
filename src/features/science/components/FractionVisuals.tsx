import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry Lesson 39: Fractional distillation. Original, code-native schematics; not to scale. Focus ids start with 'frac-'.
 *
 * One soft, rounded fractionating column is reused in every frame and built up step by step (like the plant-transport lesson).
 * Colour code: the column's tint runs from warm orange-red at the bottom (very hot) to pale blue-white at the top (cool);
 * crude oil = dark brown; hydrocarbon chains = warm tan beads (one bead per carbon atom, hydrogens left out);
 * vapour = wavy grey-blue arrows; liquid fractions = amber drops; heat = orange flame.
 * Carbon numbers are the approximate values on the source page (about 3, 8, 15, 20, 40). Outlets from the top:
 * LPG, petrol, kerosene, diesel oil, heavy fuel oil, and bitumen leaving at the very bottom.
 */
const { ink, muted, panelFill, panelLine } = atomPalette
const colLine = '#8a7466'
const hot = '#ee8f6a', warm = '#f7c784', cool = '#eef5fb'
const oil = '#3d332c', oilLine = '#231d19'
const bead = '#e3c9a3', beadLine = '#8a6440'
const beadOnOil = '#efdfc7', beadOnOilLine = '#c8ab85'
const vapour = '#7f9fb8'
const liquid = '#f2b54f', liquidLine = '#b9791a'
const flameOut = '#f5a54a', flameIn = '#fcd97d', heatLine = '#c8641e'
const furnace = '#efe4da', furnaceLine = '#9c7a5d'
const pipe = '#d9d2cb', pipeLine = '#8a7d72'
const halo = '#f8c979'

type Pt = [number, number]
const r1 = (n: number) => Math.round(n * 10) / 10

function Diagram({ title, children, viewBox = '0 0 540 400', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Lines({ x, y, lines, anchor = 'start', size = 14, weight = 700, colour = ink }: { x: number; y: number; lines: string[]; anchor?: 'start' | 'middle' | 'end'; size?: number; weight?: number; colour?: string }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={colour}>{lines.map((l, i) => <tspan key={i} x={x} dy={i ? size + 3 : 0}>{l}</tspan>)}</text>
}
function Caption({ text }: { text: string }) {
  return <text x={270} y={390} textAnchor="middle" fontSize="14" fontWeight="600" fill={muted}>{text}</text>
}
function Pointer({ n, x, y, to }: { n: number; x: number; y: number; to: Pt }) {
  const angle = Math.atan2(to[1] - y, to[0] - x)
  return <g><path d={`M${r1(x + Math.cos(angle) * 13)} ${r1(y + Math.sin(angle) * 13)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
    <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}
/** A label with a thin leader ending in a dot on the feature. */
function Leader({ from, to, colour = ink }: { from: Pt; to: Pt; colour?: string }) {
  return <g><path d={`M${from[0]} ${from[1]}L${to[0]} ${to[1]}`} stroke={colour} strokeWidth="1.4" /><circle cx={to[0]} cy={to[1]} r="2.6" fill={colour} /></g>
}
/** Straight soft arrow. */
function Arrow({ from, to, colour = ink, width = 2.4 }: { from: Pt; to: Pt; colour?: string; width?: number }) {
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]), h = 6 + width * 1.5
  const p = (d: number, s: number): Pt => [r1(to[0] - Math.cos(a) * d + Math.cos(a + Math.PI / 2) * s), r1(to[1] - Math.sin(a) * d + Math.sin(a + Math.PI / 2) * s)]
  const [b1, b2, base] = [p(h, h * .6), p(h, -h * .6), p(h * .7, 0)]
  return <g><path d={`M${from[0]} ${from[1]}L${base[0]} ${base[1]}`} stroke={colour} strokeWidth={width} fill="none" /><path d={`M${to[0]} ${to[1]}L${b1[0]} ${b1[1]}L${b2[0]} ${b2[1]}Z`} fill={colour} stroke={colour} strokeWidth="1.2" /></g>
}
/** Wavy rising vapour arrow. */
function Vapour({ x, y1, y2, opacity = 1 }: { x: number; y1: number; y2: number; opacity?: number }) {
  const steps = Math.max(1, Math.floor((y1 - y2 - 10) / 14))
  let d = `M${x} ${y1}`
  for (let i = 0; i < steps; i++) d += `q${i % 2 ? 6 : -6} -7 0 -14`
  const top = y1 - steps * 14
  return <g opacity={opacity}><path d={d} stroke={vapour} strokeWidth="2.2" fill="none" /><path d={`M${x} ${top - 9}L${x - 5} ${top + 1}L${x + 5} ${top + 1}Z`} fill={vapour} stroke={vapour} strokeWidth="1.2" /></g>
}

// ---------- Hydrocarbon chain: one bead per carbon atom, folded into rows when long ----------
const GAP = 6.4
function chainWidth(n: number, per: number) { return (Math.min(n, per) - 1) * GAP }
function Chain({ x, y, n, per = 16, r = 3.2, fill = bead, line = beadLine, rowGap = 12 }: { x: number; y: number; n: number; per?: number; r?: number; fill?: string; line?: string; rowGap?: number }) {
  const pts = Array.from({ length: n }, (_, i) => {
    const row = Math.floor(i / per), c = i % per, col = row % 2 ? per - 1 - c : c
    return [r1(x + col * GAP), r1(y + row * rowGap + (i % 2 ? -1.6 : 1.6))] as Pt
  })
  return <g>
    <path d={pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join('')} stroke={line} strokeWidth="1.6" fill="none" />
    {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={r} fill={fill} stroke={line} strokeWidth="1.2" />)}
  </g>
}

// ---------- The column ----------
const CX = 245, LEFT = 200, RIGHT = 290, BOTTOM = 346
const SIDE = [60, 108, 156, 204, 252]          // outlet heights: LPG, petrol, kerosene, diesel oil, heavy fuel oil
const BIT_Y = 362                              // bitumen (the bottom outlet) runs out along here
const colPath = `M${LEFT} 330C${LEFT - 2} 250 ${LEFT + 2} 160 ${LEFT} 76A45 45 0 0 1 ${RIGHT} 76C${RIGHT + 2} 160 ${RIGHT - 2} 250 ${RIGHT} 330Q${RIGHT} ${BOTTOM} ${RIGHT - 16} ${BOTTOM}H${LEFT + 16}Q${LEFT} ${BOTTOM} ${LEFT} 330Z`
const edge = (y: number) => y < 76 ? r1(CX + Math.sqrt(45 * 45 - (76 - y) ** 2)) : RIGHT

type ColumnProps = {
  tint?: boolean; faint?: boolean; outlets?: number[]; bottom?: boolean; trays?: boolean; furnaceOn?: boolean; crudeLabel?: boolean
  dim?: [number, number][]; glowBand?: [number, number]; flowing?: number[]; children?: ReactNode
}
function Column({ tint = true, faint = false, outlets = SIDE, bottom = true, trays = true, furnaceOn = true, crudeLabel = false, dim = [], glowBand, flowing = [], children }: ColumnProps) {
  const uid = useId().replace(/:/g, '')
  const grad = `fracTint${uid}`, clip = `fracClip${uid}`
  return <g opacity={faint ? .38 : 1}>
    <defs>
      <linearGradient id={grad} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={cool} /><stop offset=".35" stopColor="#fbeecd" /><stop offset=".65" stopColor={warm} /><stop offset="1" stopColor={hot} />
      </linearGradient>
      <clipPath id={clip}><path d={colPath} /></clipPath>
    </defs>
    {glowBand && <rect x={LEFT - 10} y={glowBand[0] - 8} width={RIGHT - LEFT + 20} height={glowBand[1] - glowBand[0] + 16} rx="30" fill={halo} opacity=".45" />}
    {/* side outlet pipes */}
    {outlets.map((y, i) => <g key={y}>
      <path d={`M${edge(y) - 4} ${y}H336`} stroke={pipeLine} strokeWidth="11" /><path d={`M${edge(y) - 4} ${y}H336`} stroke={pipe} strokeWidth="7.5" />
      {flowing.includes(i) && <Arrow from={[322, y]} to={[346, y]} colour={liquidLine} width={2} />}
    </g>)}
    {bottom && <g>
      <path d={`M262 ${BOTTOM - 4}V${BIT_Y}H336`} stroke={pipeLine} strokeWidth="11" fill="none" /><path d={`M262 ${BOTTOM - 4}V${BIT_Y}H336`} stroke={pipe} strokeWidth="7.5" fill="none" />
      {flowing.includes(5) && <Arrow from={[322, BIT_Y]} to={[346, BIT_Y]} colour={liquidLine} width={2} />}
    </g>}
    {/* body */}
    <path d={colPath} fill={tint ? `url(#${grad})` : panelFill} stroke={colLine} strokeWidth="2.4" />
    {trays && outlets.filter(y => y > 90).map(y => <path key={y} d={`M${LEFT + 3} ${y + 8}Q${CX - 20} ${y + 11} ${CX - 8} ${y + 8}q8 -9 16 0Q${CX + 20} ${y + 11} ${RIGHT - 3} ${y + 8}`} stroke={colLine} strokeWidth="1.8" fill="none" opacity=".75" />)}
    <g clipPath={`url(#${clip})`}>
      {children}
      {dim.map(([a, b], i) => <rect key={i} x={LEFT - 5} y={a} width={RIGHT - LEFT + 10} height={b - a} fill="white" opacity=".62" />)}
    </g>
    <path d={colPath} fill="none" stroke={colLine} strokeWidth="2.4" />
    {furnaceOn && <Furnace label={crudeLabel} />}
  </g>
}
function Flame({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0C-9 -4 -8 -14 -2 -22C-1 -15 4 -14 3 -20C9 -13 10 -4 0 0Z" fill={flameOut} stroke={heatLine} strokeWidth="1.4" />
    <path d="M0 -3C-4 -6 -3 -11 0 -14C1 -10 4 -8 0 -3Z" fill={flameIn} />
  </g>
}
function Furnace({ label = false }: { label?: boolean }) {
  return <g>
    {/* crude oil feed pipe, furnace with a coil, pipe on into the column */}
    <path d="M24 324H116" stroke={oilLine} strokeWidth="11" /><path d="M24 324H116" stroke={oil} strokeWidth="7.5" />
    <rect x={112} y={282} width={64} height={54} rx="13" fill={furnace} stroke={furnaceLine} strokeWidth="2" />
    <path d="M116 324H160q9 0 9 -8t-9 -8H130q-9 0 -9 -8t9 -8H176" stroke={oil} strokeWidth="5" fill="none" />
    <path d="M176 292H202" stroke={pipeLine} strokeWidth="11" /><path d="M174 292H203" stroke={pipe} strokeWidth="7.5" />
    <Flame x={132} y={352} s={.8} /><Flame x={146} y={352} s={.95} /><Flame x={160} y={352} s={.8} />
    {label && <text x={24} y={312} fontSize="14" fontWeight="700" fill={ink}>crude oil</text>}
  </g>
}

// Chains on the left, one per side outlet, getting longer downwards (about 3, 8, 15, 20 and 40 carbons).
const LEFT_CHAINS: { n: number; per: number }[] = [{ n: 3, per: 16 }, { n: 8, per: 16 }, { n: 15, per: 16 }, { n: 20, per: 20 }, { n: 40, per: 14 }]
function SideChains({ faded = false }: { faded?: boolean }) {
  return <g opacity={faded ? .35 : 1}>{LEFT_CHAINS.map(({ n, per }, i) => {
    const w = chainWidth(n, per), rows = Math.ceil(n / per)
    return <Chain key={n} x={r1(184 - w)} y={SIDE[i] - (rows - 1) * 6} n={n} per={per} />
  })}</g>
}
function Drops({ y }: { y: number }) {
  return <g>{[CX - 26, CX - 4, CX + 20].map((x, i) => <ellipse key={i} cx={x} cy={y + 4} rx={i === 1 ? 7 : 5} ry="3" fill={liquid} stroke={liquidLine} strokeWidth="1" />)}</g>
}

// ---------- Icons for uses (small, soft, original) ----------
function Icon({ kind, x, y }: { kind: string; x: number; y: number }) {
  const t = `translate(${x} ${y})`
  if (kind === 'flame') return <g transform={t}><rect x={-10} y={6} width={20} height={6} rx="3" fill="#b8c2ca" stroke="#7f8c97" strokeWidth="1.2" /><Flame x={0} y={6} s={.85} /></g>
  if (kind === 'car') return <g transform={t}><path d="M-18 6V-1Q-17 -5 -12 -6L-7 -12Q-5 -14 -1 -14H6Q10 -14 12 -11L16 -6Q19 -5 19 -1V6Z" fill="#e8837a" stroke="#b4524a" strokeWidth="1.4" /><path d="M-5 -7L-2 -11H4L8 -7Z" fill="#e8f3fb" stroke="#b4524a" strokeWidth="1" /><circle cx={-10} cy={7} r="4.5" fill="#56616b" /><circle cx={11} cy={7} r="4.5" fill="#56616b" /></g>
  if (kind === 'plane') return <g transform={t}><path d="M-20 0Q-20 -4 -14 -4H14Q21 -4 22 0Q21 4 14 4H-14Q-20 4 -20 0Z" fill="#dbe9f5" stroke="#5f86a8" strokeWidth="1.4" /><path d="M-2 -3L-10 -14H-5L7 -3ZM-2 3L-10 14H-5L7 3ZM-17 -3L-21 -11H-17L-11 -3Z" fill="#9fc0dc" stroke="#5f86a8" strokeWidth="1.2" /></g>
  if (kind === 'lorry') return <g transform={t}><rect x={-21} y={-12} width={27} height={17} rx="3" fill="#d8e6c8" stroke="#6f8f52" strokeWidth="1.4" /><path d="M7 5V-7H14L20 -1V5Z" fill="#f2c26b" stroke="#b9791a" strokeWidth="1.4" /><circle cx={-13} cy={7} r="4" fill="#56616b" /><circle cx={0} cy={7} r="4" fill="#56616b" /><circle cx={14} cy={7} r="4" fill="#56616b" /></g>
  if (kind === 'ship') return <g transform={t}><path d="M-22 0H22L16 9H-17Z" fill="#7e9bb3" stroke="#4f6f89" strokeWidth="1.4" /><rect x={-10} y={-7} width={16} height={7} rx="2" fill="#f5fafd" stroke="#4f6f89" strokeWidth="1.2" /><rect x={-4} y={-15} width={6} height={9} rx="1.5" fill="#e8837a" stroke="#b4524a" strokeWidth="1.2" /><path d="M-22 13q5.5 -3 11 0t11 0t11 0t11 0" stroke="#8fb9dc" strokeWidth="1.6" fill="none" /></g>
  return <g transform={t}><path d="M-8 -13H8L22 11H-22Z" fill="#5e6770" stroke="#3e464d" strokeWidth="1.4" /><path d="M0 -10V-5M0 0V5" stroke="#f5d56b" strokeWidth="2.2" /></g>
}

// ---------- Frames ----------
const FRACTIONS = ['LPG', 'petrol', 'kerosene', 'diesel oil', 'heavy fuel oil', 'bitumen']
const CARBONS = ['about 3', 'about 8', 'about 15', 'about 20', 'about 40', 'longest']
const ICONS = ['flame', 'car', 'plane', 'lorry', 'ship', 'road']
const OUT_Y = [...SIDE, BIT_Y]

function Mixture() {
  const chains: { x: number; y: number; n: number; per?: number }[] = [
    { x: 46, y: 210, n: 3 }, { x: 80, y: 206, n: 10 }, { x: 44, y: 248, n: 11 }, { x: 124, y: 244, n: 4 },
    { x: 58, y: 274, n: 6 }, { x: 110, y: 270, n: 7 }, { x: 44, y: 302, n: 22, per: 11 }, { x: 128, y: 310, n: 3 },
  ]
  return <Diagram title="Crude oil is a mixture of many hydrocarbons with chains of different lengths. It goes to a fractionating column to be separated.">
    <Lines x={96} y={138} anchor="middle" lines={['Crude oil: a mixture', 'of hydrocarbons']} />
    {/* oil drum */}
    <ellipse cx={96} cy={184} rx={66} ry={14} fill="#6d5a4c" stroke={oilLine} strokeWidth="2" />
    <path d="M30 184V320Q30 334 96 334Q162 334 162 320V184" fill={oil} stroke={oilLine} strokeWidth="2" />
    <ellipse cx={96} cy={184} rx={58} ry={9} fill={oil} />
    {chains.map((c, i) => <Chain key={i} x={c.x} y={c.y} n={c.n} per={c.per} r={3} fill={beadOnOil} line={beadOnOilLine} />)}
    <Arrow from={[172, 250]} to={[210, 250]} width={3} />
    <Column faint tint={false} bottom={false} furnaceOn={false} />
    <Lines x={352} y={128} lines={['fractionating', 'column']} />
    <Leader from={[348, 134]} to={[292, 134]} />
    <Caption text="Many different hydrocarbons, mixed together" />
  </Diagram>
}
function Heat() {
  return <Diagram title="Crude oil is heated in a furnace until most of it evaporates. The vapour goes into the bottom of the column. Liquid left behind drains off at the bottom.">
    <Column tint={false} outlets={SIDE} crudeLabel flowing={[5]}>
      <Vapour x={CX - 20} y1={300} y2={236} /><Vapour x={CX + 8} y1={312} y2={250} />
    </Column>
    <Arrow from={[178, 292]} to={[216, 292]} colour={vapour} width={2.4} />
    <text x={104} y={352} textAnchor="end" fontSize="15" fontWeight="700" fill={heatLine}>Heat</text>
    <Lines x={112} y={236} anchor="middle" lines={['vapour goes', 'into the column']} colour="#4f7390" />
    <Leader from={[150, 254]} to={[188, 288]} colour="#4f7390" />
    <path d="M358 330q-6 8 0 12q6 -4 0 -12Z" fill={liquid} stroke={liquidLine} strokeWidth="1.2" />
    <Lines x={370} y={336} lines={['liquid left behind', 'is drained off']} size={13} />
    <Caption text="Heat the crude oil, then pass the vapour into the column" />
  </Diagram>
}
function Gradient() {
  const uid = useId().replace(/:/g, ''), g = `fracWedge${uid}`
  return <Diagram title="The fractionating column is very hot at the bottom and gets cooler towards the top.">
    <defs><linearGradient id={g} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bcd6ea" /><stop offset=".5" stopColor={warm} /><stop offset="1" stopColor={hot} /></linearGradient></defs>
    <Column crudeLabel />
    <path d="M394 56L398 56Q410 190 414 322H378Q382 190 394 56Z" fill={`url(#${g})`} stroke={colLine} strokeWidth="1.6" />
    <text x={396} y={44} textAnchor="middle" fontSize="15" fontWeight="700" fill="#4f7390">Cool</text>
    <text x={396} y={344} textAnchor="middle" fontSize="15" fontWeight="700" fill="#c0512f">Very hot</text>
    <Lines x={430} y={180} lines={['cooler as', 'you go up']} size={13} weight={600} colour={muted} />
    <Arrow from={[440, 216]} to={[440, 150]} colour={muted} width={1.8} />
    <Caption text="Hot at the bottom, cooler towards the top" />
  </Diagram>
}
function Rise() {
  return <Diagram title="Vapour rises up the column and cools. Each part condenses to a liquid on a tray when it is cool enough and is drained off.">
    <Column crudeLabel flowing={[1, 3, 4]}>
      <Vapour x={CX - 24} y1={300} y2={120} /><Vapour x={CX + 22} y1={310} y2={170} /><Vapour x={CX - 2} y1={240} y2={70} />
      <Drops y={SIDE[1] + 2} /><Drops y={SIDE[3] + 2} /><Drops y={SIDE[4] + 2} />
    </Column>
    <Lines x={20} y={120} lines={['vapour rises', 'and cools']} colour="#4f7390" />
    <Leader from={[106, 124]} to={[CX - 26, 150]} colour="#4f7390" />
    <Lines x={20} y={196} lines={['condenses to', 'a liquid']} colour={liquidLine} />
    <Leader from={[112, 200]} to={[CX - 26, 214]} colour={liquidLine} />
    <Lines x={354} y={210} lines={['liquid', 'drained off']} />
    <Caption text="Rise, cool, condense, drain off" />
  </Diagram>
}
function ShortLong({ long }: { long: boolean }) {
  return <Diagram title={long ? 'Long hydrocarbon chains have high boiling points, so they condense near the hot bottom of the column.' : 'Short hydrocarbon chains have low boiling points, so they stay as gases until the cool top of the column.'}>
    <Column crudeLabel dim={long ? [[20, 232]] : [[92, 350]]} glowBand={long ? [232, 346] : [31, 92]}>
      {long ? <Chain x={CX - 29} y={276} n={40} per={10} r={3.2} /> : <Chain x={CX - 6} y={60} n={3} r={4.2} />}
    </Column>
    {long
      ? <Lines x={352} y={284} lines={['Long chains:', 'high boiling point,', 'condense while hot']} />
      : <Lines x={352} y={42} lines={['Short chains:', 'low boiling point,', 'stay gas until cool']} />}
    <Caption text={long ? 'Long chain: leaves near the bottom' : 'Short chain: leaves near the top'} />
  </Diagram>
}
function Heights() {
  return <Diagram title="Chains of five lengths line up with the outlets: the shortest at the top, the longest at the bottom. Chains get shorter going up; boiling points get higher going down.">
    <Column crudeLabel />
    <SideChains />
    <Arrow from={[354, 250]} to={[354, 56]} width={2.4} />
    <Lines x={366} y={66} lines={['chains get', 'shorter']} />
    <Arrow from={[520, 56]} to={[520, 250]} colour="#c0512f" width={2.4} />
    <Lines x={508} y={226} anchor="end" lines={['boiling points', 'get higher']} colour="#c0512f" />
    <Caption text="Short chains near the top, long chains near the bottom" />
  </Diagram>
}
function Similar() {
  return <Diagram title="A magnifier shows one fraction: a few chains of nearly the same length, so similar boiling points.">
    <Column crudeLabel dim={[[20, 136], [180, 350]]} glowBand={[136, 180]} />
    <path d={`M150 102L200 136M150 238L200 180`} stroke={muted} strokeWidth="1.4" strokeDasharray="4 4" />
    <line x1={48} y1={230} x2={24} y2={262} stroke="#8a7d72" strokeWidth="8" />
    <circle cx={96} cy={170} r={74} fill="white" stroke="#7f9fb8" strokeWidth="4" />
    <Chain x={52} y={142} n={14} /><Chain x={46} y={170} n={16} /><Chain x={55} y={198} n={15} />
    <Lines x={352} y={148} lines={['One fraction:', 'similar chain lengths,', 'similar boiling points']} />
    <Caption text="Each fraction is still a mixture, of similar molecules" />
  </Diagram>
}
function Named({ mode }: { mode: 'list' | 'trend' | 'uses' }) {
  const title = mode === 'list' ? 'The six main fractions from the top of the column: LPG, petrol, kerosene, diesel oil, heavy fuel oil, and bitumen at the bottom.'
    : mode === 'trend' ? 'Going down the column the chains get longer: about 3 carbons in LPG, 8 in petrol, 15 in kerosene, 20 in diesel oil, 40 in heavy fuel oil, and bitumen is longest. Boiling points get higher.'
      : 'Uses: LPG for heating and cooking, petrol for cars, kerosene for aircraft, diesel oil for lorries, heavy fuel oil for ships, bitumen for roads.'
  return <Diagram title={title}>
    <Column crudeLabel flowing={[0, 1, 2, 3, 4, 5]} />
    {mode === 'trend' && <SideChains />}
    {OUT_Y.map((y, i) => {
      if (mode === 'uses') return <g key={i}><Icon kind={ICONS[i]} x={374} y={y} /><text x={404} y={y + 5} fontSize="14" fontWeight="700" fill={ink}>{FRACTIONS[i]}</text></g>
      if (mode === 'trend') return i === 5
        ? <text key={i} x={354} y={y + 5} fontSize="14" fontWeight="700" fill={ink}>{FRACTIONS[i]}<tspan fontWeight="600" fill={muted}>{`: ${CARBONS[i]}`}</tspan></text>
        : <g key={i}><text x={354} y={y + 2} fontSize="14" fontWeight="700" fill={ink}>{FRACTIONS[i]}</text><text x={354} y={y + 18} fontSize="13" fontWeight="600" fill={muted}>{CARBONS[i]}</text></g>
      return <g key={i}><text x={354} y={y + 5} fontSize="15" fontWeight="700" fill={ink}>{FRACTIONS[i]}</text>
        {i === 0 && <text x={354} y={y + 22} fontSize="12" fontWeight="600" fill={muted}>(liquefied petroleum gas)</text>}</g>
    })}
    {mode === 'trend' && <g>
      <Arrow from={[522, 62]} to={[522, 336]} colour="#c0512f" width={2.4} />
      <Lines x={510} y={300} anchor="end" lines={['longer chains,', 'higher boiling points']} size={13} colour="#c0512f" />
    </g>}
    <Caption text={mode === 'list' ? 'Six main fractions, top to bottom' : mode === 'trend' ? 'Approximate carbon atoms per molecule' : 'Each fraction has its own job'} />
  </Diagram>
}
function Question({ assessment }: { assessment: boolean }) {
  const outs = [60, 124, 188, 252], nums = [3, 1, 4, 2]
  return <Diagram viewBox="0 0 540 372" title={assessment ? 'A fractionating column with four numbered outlets.' : 'A fractionating column with four numbered outlets. From the top down they are outlets 3, 1, 4 and 2. Outlet 3, at the top, collects the fraction with the lowest boiling points.'}>
    <Column outlets={outs} bottom={false} flowing={[0, 1, 2, 3]} />
    {outs.map((y, i) => <Pointer key={y} n={nums[i]} x={384} y={y} to={[348, y]} />)}
    {!assessment && <Lines x={410} y={64} lines={['lowest boiling', 'points']} size={13} />}
  </Diagram>
}

export function FractionVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus === 'frac-mixture') return <Mixture />
  if (focus === 'frac-heat') return <Heat />
  if (focus === 'frac-gradient') return <Gradient />
  if (focus === 'frac-rise') return <Rise />
  if (focus === 'frac-short') return <ShortLong long={false} />
  if (focus === 'frac-long') return <ShortLong long />
  if (focus === 'frac-heights') return <Heights />
  if (focus === 'frac-similar') return <Similar />
  if (focus === 'frac-list') return <Named mode="list" />
  if (focus === 'frac-trend') return <Named mode="trend" />
  if (focus === 'frac-uses') return <Named mode="uses" />
  if (focus === 'frac-q-column') return <Question assessment={assessment} />
  return <Named mode="list" />
}
