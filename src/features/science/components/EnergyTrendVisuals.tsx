import type { ReactNode } from 'react'
import { physicsPalette as P, GraphAxes, graphScale, TransferArrow, type GraphFrame, type Pt } from './PhysicsKit'
import { Fig, Say, Tag, Num, Panel, Clip, Sun, Bolt, Turbine, Pylon, House, PowerPlant, Person, Coin, Gust, blob, smooth, landPath, gauss, scene as S } from './WindSolarVisuals'
import { Car, Chimney, Puffs, Globe, Warning, co2, co2Line } from './BiofuelVisuals'

/*
 * Physics Lesson 14: trends in energy resource use. Original, code-native schematics; not to scale. Focus ids start 'etrend-'.
 * The electricity-use graph is schematic: the page gives its shape and dates, not values, so the y axis has no numbers.
 * Colour code as in the other resource lessons: green = renewables and advantages, coral = problems, amber = money and fuels,
 * purple = carbon dioxide, vermilion bolt = electricity. The pressure chain uses the same round icons in every frame.
 */
const { ink, muted } = P
const line = '#2f7fb3'
const govFill = '#eef0f6', govLine = '#5a6b8f'

/* ---------- The electricity-use graph ---------- */
const GF: GraphFrame = { x: 78, y: 44, width: 400, height: 170, xMin: 1900, xMax: 2025, yMin: 0, yMax: 110 }
// Schematic shape only: a steep rise through the 20th century, a rounded peak in the early 2000s, then a slow fall.
const data: Pt[] = [[1900, 4], [1920, 9], [1940, 20], [1960, 44], [1980, 70], [1995, 89], [2005, 98], [2012, 94], [2020, 87]]
const use = (t: number) => { for (let i = 1; i < data.length; i++) if (t <= data[i][0]) { const [t0, v0] = data[i - 1], [t1, v1] = data[i]; return v0 + (v1 - v0) * (t - t0) / (t1 - t0) } return data[data.length - 1][1] }
const curve = (t0: number, t1: number) => smooth(data.filter(([t]) => t >= t0 && t <= t1).map(([t, v]) => graphScale(GF).pt(t, v)))
function Graph({ upTo = 2020, highlight, band = false, children }: { upTo?: number; highlight?: 'rise' | 'fall'; band?: boolean; children?: ReactNode }) {
  const s = graphScale(GF)
  return <g>
    {band && <rect x={s.x(1900)} y={GF.y} width={s.x(2000) - s.x(1900)} height={GF.height} fill={P.light} opacity=".35" />}
    <GraphAxes frame={GF} xLabel="year" yLabel="electricity use" xTicks={[1900, 2000]} origin={false} />
    <path d={curve(1900, Math.min(upTo, 2005))} stroke={highlight === 'fall' ? '#9cc3dc' : line} strokeWidth={highlight === 'rise' ? 4 : 3} fill="none" />
    {upTo > 2005 && <path d={curve(2005, upTo)} stroke={highlight === 'rise' ? '#9cc3dc' : highlight === 'fall' ? P.wasted : line} strokeWidth={highlight === 'fall' ? 4.5 : 3} fill="none" />}
    {children}
  </g>
}
function Rise() {
  const s = graphScale(GF)
  return <Fig title="A schematic graph of UK electricity use against year, from 1900. Across the 20th century, shaded, the line rises steeply. Two notes: the population grew, and more things use electricity." h={290}>
    <Graph upTo={2000} highlight="rise" band />
    <Say x={(s.x(1900) + s.x(2000)) / 2} y={GF.y + 16} lines={['20th century']} anchor="middle" size={13} colour="#9a700f" halo={false} />
    <g transform={`translate(${s.x(1930)} ${GF.y + 86})`}><Person x={-14} y={0} s={.55} /><Person x={4} y={4} s={.5} fill="#f3e3d6" colour="#a0826a" /><Person x={20} y={0} s={.55} fill="#e0eadc" colour="#6f9164" /></g>
    <Say x={s.x(1930)} y={GF.y + 104} lines={['population grew']} anchor="middle" size={13} />
    <g transform={`translate(${s.x(1976)} ${GF.y + 110})`}>
      <rect x="-30" y="-24" width="26" height="18" rx="2" fill="#e6edf2" stroke={S.steel} strokeWidth="1.5" /><path d="M-17 -6V-2M-23 -2H-11" stroke={S.steel} strokeWidth="1.5" />
      <rect x="2" y="-30" width="16" height="26" rx="2" fill="white" stroke={S.steel} strokeWidth="1.5" /><path d="M2 -20H18" stroke={S.steel} strokeWidth="1.2" />
      <path d="M26 -18a6 6 0 1 1 8 0v4h-8z" fill={P.light} stroke={P.lightLine} strokeWidth="1.4" />
    </g>
    <Say x={s.x(1976)} y={GF.y + 126} lines={['more things use', 'electricity']} anchor="middle" size={13} />
  </Fig>
}
function Peak() {
  const s = graphScale(GF), pk = s.pt(2005, use(2005))
  return <Fig title="The same graph continued. The line peaks in the early 2000s, then bends gently downwards. The falling part is highlighted." h={290}>
    <Graph highlight="fall" />
    <circle cx={pk[0]} cy={pk[1]} r="6" fill="white" stroke={ink} strokeWidth="2.2" />
    <Say x={pk[0] - 12} y={pk[1] - 12} lines={['peak: early 2000s']} anchor="end" size={13} />
    <Say x={s.x(2012)} y={s.y(use(2015)) + 40} lines={['since the early', '2000s: decreasing', 'slowly']} anchor="middle" size={13} colour={P.wasted} />
  </Fig>
}
function WhyFall() {
  const s = graphScale(GF), mid = s.pt(2012, use(2012))
  return <Fig title="The graph with its falling part highlighted, and two reasons for the fall. A fridge with an energy label showing a top efficiency rating: efficient appliances waste less energy. A light switch turned off: people are more careful with their energy use." h={290}>
    <Graph highlight="fall" />
    <g transform="translate(112 84)">
      <rect x="-14" y="-34" width="28" height="44" rx="4" fill="white" stroke={S.steel} strokeWidth="1.6" /><path d="M-14 -18H14M9 -29V-22M9 -13V2" stroke={S.steel} strokeWidth="1.4" />
      {['#4f9a74', '#8fbf5a', '#e2c34a', '#e59a4a', '#c0675a'].map((c, i) => <rect key={c} x={22} y={-34 + i * 8} width={12 + i * 4} height={6} rx="1.5" fill={c} />)}
      <circle cx="44" cy="-31" r="7" fill="white" stroke={P.useful} strokeWidth="1.5" /><text x="44" y="-27" textAnchor="middle" fontSize="12" fontWeight="800" fill={P.useful}>A</text>
    </g>
    <Say x={172} y={64} lines={['more efficient appliances:', 'less energy wasted']} size={13} />
    <g transform="translate(112 148)">
      <rect x="-13" y="-20" width="26" height="34" rx="4" fill="white" stroke={S.steel} strokeWidth="1.6" />
      <rect x="-5" y="-12" width="10" height="17" rx="2" fill="#e6edf2" stroke={S.steel} strokeWidth="1.3" /><path d="M-5 1H5" stroke={S.steel} strokeWidth="3" />
    </g>
    <Say x={138} y={144} lines={['people more careful', 'with energy']} size={13} />
    <path d={`M${mid[0] - 10} ${mid[1] + 20}Q${mid[0] - 40} ${mid[1] + 70} ${mid[0] - 70} ${mid[1] + 80}`} stroke={P.wasted} strokeWidth="1.6" strokeDasharray="4 4" fill="none" />
    <Say x={mid[0] - 76} y={mid[1] + 96} lines={['two reasons', 'for the fall']} size={13} colour={P.wasted} anchor="middle" />
  </Fig>
}
function Round({ x, y, r = 50, children, tint = P.panel, edge = P.panelLine }: { x: number; y: number; r?: number; children: ReactNode; tint?: string; edge?: string }) {
  return <g><circle cx={x} cy={y} r={r} fill={tint} stroke={edge} strokeWidth="1.6" />{children}</g>
}
function Radiator({ x, y }: { x: number; y: number }) {
  return <g>{[0, 1, 2, 3, 4].map(i => <rect key={i} x={x - 25 + i * 10} y={y - 20} width={9} height={40} rx="4" fill="white" stroke={S.steel} strokeWidth="1.5" />)}<path d={`M${x - 26} ${y + 14}H${x + 26}`} stroke={S.steel} strokeWidth="1.5" />
    {[-10, 0, 10].map(d => <path key={d} d={`M${x + d} ${y - 28}c-3 -4 3 -6 0 -10`} stroke={P.hot} strokeWidth="1.8" fill="none" />)}</g>
}
function Still() {
  const items = [{ x: 90, name: 'electricity', el: <><PowerPlant x={90} y={116} s={.8} smoke /></> }, { x: 270, name: 'transport', el: <Car x={270} y={112} s={1} /> }, { x: 450, name: 'heating', el: <Radiator x={450} y={96} /> }]
  return <Fig title="Three round pictures: a power station for electricity, a car for transport and a radiator for heating. All three still use some non-renewable resources." h={270}>
    {items.map(i => <g key={i.name}><Round x={i.x} y={90} r={62}>{i.el}</Round><text x={i.x} y={176} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>{i.name}</text></g>)}
    {items.map(i => <Tag key={i.name} x={i.x} y={194} lines={['still uses some', 'non-renewables']} kind="note" anchor="middle" />)}
  </Fig>
}

/* ---------- Why people want more renewables ---------- */
function Face({ x, y, happy }: { x: number; y: number; happy: boolean }) {
  return <g><circle cx={x - 8} cy={y - 5} r="2.4" fill={ink} /><circle cx={x + 8} cy={y - 5} r="2.4" fill={ink} />
    <path d={happy ? `M${x - 10} ${y + 5}Q${x} ${y + 14} ${x + 10} ${y + 5}` : `M${x - 10} ${y + 11}Q${x} ${y + 2} ${x + 10} ${y + 11}`} stroke={ink} strokeWidth="2.2" fill="none" /></g>
}
function Damage() {
  return <Fig title="On the left, a smoking power station chimney gives out carbon dioxide next to a sad, warming Earth. On the right, a wind turbine next to a happy Earth." h={290}>
    <Panel x={12} y={14} w={244} h={196} tint="#fdf6f3" /><Panel x={284} y={14} w={244} h={196} tint="#f3faf5" />
    <path d="M24 190H244M296 190H516" stroke={S.grassLine} strokeWidth="2" />
    <Chimney x={70} y={190} h={96} /><Puffs x={70} y={94} fill={co2} line={co2Line} n={3} label="CO₂" />
    <PowerPlant x={100} y={190} s={.7} chimney={false} />
    <Globe x={190} y={120} r={34} warm /><Face x={190} y={120} happy={false} />
    <Turbine x={346} y={190} h={100} angle={20} />
    <Gust from={[300, 60]} to={[334, 58]} width={2.2} />
    <Globe x={452} y={120} r={34} /><Face x={452} y={120} happy />
    <Say x={134} y={234} lines={['fossil fuels: very', 'damaging']} anchor="middle" size={13} colour={P.wasted} halo={false} />
    <Say x={406} y={234} lines={['renewables: better for', 'the environment']} anchor="middle" size={13} colour={P.useful} halo={false} />
  </Fig>
}
function Government({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={1.6 / s}>
    <path d="M-44 -46L0 -70L44 -46Z" fill={govFill} stroke={govLine} />
    <rect x="-40" y="-46" width="80" height="8" fill={govFill} stroke={govLine} />
    {[-30, -15, 0, 15, 30].map(c => <rect key={c} x={c - 4} y={-38} width={8} height={32} fill="white" stroke={govLine} />)}
    <rect x="-46" y="-6" width="92" height="6" fill={govFill} stroke={govLine} />
    <path d="M0 -70V-88" stroke={govLine} /><path d="M0 -88H14L11 -83L14 -78H0" fill={P.gravitational} stroke={govLine} />
  </g>
}
function Provider({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={1.6 / s}>
    <rect x="-30" y="-64" width="60" height="64" rx="3" fill="#f3f6f9" stroke={S.steel} />
    {[-50, -34, -18].map(yy => [-20, -4, 12].map(xx => <rect key={`${xx}${yy}`} x={xx} y={yy} width={9} height={9} rx="1" fill="#dbe6ee" stroke={S.steel} strokeWidth={1 / s} />))}
    <circle cx="0" cy="-82" r="12" fill="white" stroke={S.electric} /><Bolt x={0} y={-82} s={.65} />
  </g>
}
function Flag({ x, y, c1, c2 }: { x: number; y: number; c1: string; c2: string }) {
  return <g><path d={`M${x} ${y}V${y - 46}`} stroke={muted} strokeWidth="2" /><path d={`M${x} ${y - 46}Q${x + 12} ${y - 50} ${x + 24} ${y - 44}V${y - 28}Q${x + 12} ${y - 34} ${x} ${y - 30}Z`} fill={c1} stroke={c2} strokeWidth="1.5" /></g>
}
function Pressure() {
  return <Fig title="On the left, members of the public and flags standing for other countries. Arrows push from them to a government building on the right, which sets targets for renewables." h={290}>
    <Person x={40} y={140} s={.9} /><Person x={70} y={146} s={.85} fill="#f3e3d6" colour="#a0826a" /><Person x={100} y={140} s={.9} fill="#e0eadc" colour="#6f9164" />
    <Say x={70} y={164} lines={['the public']} anchor="middle" size={13} halo={false} />
    <Flag x={44} y={262} c1="#dce8f5" c2="#5a7fae" /><Flag x={84} y={262} c1="#f7e3c4" c2="#b98a17" /><Flag x={124} y={262} c1="#e4efdc" c2="#6f9164" />
    <path d="M24 262H150" stroke={muted} strokeWidth="1.6" />
    <Say x={84} y={284} lines={['other countries']} anchor="middle" size={13} halo={false} />
    <TransferArrow from={[150, 110]} to={[330, 150]} bend={-.08} colour={ink} width={3} label="pressure" labelColour={ink} />
    <TransferArrow from={[160, 236]} to={[330, 190]} bend={.08} colour={ink} width={3} />
    <Government x={410} y={210} s={1.2} />
    <Say x={410} y={236} lines={['government']} anchor="middle" size={13.5} halo={false} />
    <Tag x={410} y={36} lines={['sets targets for', 'renewables']} kind="pro" anchor="middle" />
  </Fig>
}
function WindFarm({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g>{[-1, 0, 1].map(i => <Turbine key={i} x={x + i * 36 * s} y={y - (i === 0 ? 6 : 0)} h={64 * s} angle={i * 35 + 10} />)}</g>
}
function Providers() {
  return <Fig title="A government building sends a target to an energy company. The company builds a wind farm. If it does not, it could lose business and money, shown by a coin and a down arrow." h={290}>
    <path d="M20 200H520" stroke={S.grassLine} strokeWidth="2" />
    <Government x={80} y={200} s={.95} />
    <Say x={80} y={226} lines={['government']} anchor="middle" size={13} halo={false} />
    <TransferArrow from={[134, 150]} to={[214, 150]} bend={0} colour={ink} width={3} />
    <Say x={174} y={136} lines={['target']} anchor="middle" size={13} halo={false} />
    <Provider x={260} y={200} />
    <Say x={260} y={226} lines={['energy provider']} anchor="middle" size={13} halo={false} />
    <TransferArrow from={[300, 150]} to={[372, 150]} bend={0} colour={P.useful} width={3} />
    <Say x={336} y={136} lines={['builds']} anchor="middle" size={13} colour={P.useful} halo={false} />
    <WindFarm x={440} y={200} s={1.1} />
    <Say x={440} y={226} lines={['renewable power']} anchor="middle" size={13} colour={P.useful} halo={false} />
    <Coin x={220} y={262} r={13} /><path d="M246 250V274M239 266l7 10 7 -10" stroke={P.wasted} strokeWidth="2.4" fill="none" />
    <Say x={262} y={268} lines={['if not: could lose business and money']} size={13} colour={P.wasted} halo={false} />
  </Fig>
}
function Plug({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x} ${y}Q${x + 10} ${y + 20} ${x + 26} ${y + 20}`} stroke={ink} strokeWidth="2" fill="none" /><rect x={x + 24} y={y + 13} width={12} height={14} rx="2" fill="white" stroke={ink} strokeWidth="1.6" /><path d={`M${x + 36} ${y + 17}h5M${x + 36} ${y + 23}h5`} stroke={ink} strokeWidth="1.6" /></g>
}
function Cars() {
  return <Fig title="Three cars in a row: a petrol car with a fuel pump, a hybrid car that uses petrol and electricity, and an electric car plugged in." h={250}>
    <path d="M20 150H520" stroke={S.grassLine} strokeWidth="2" />
    <Car x={90} y={150} s={1.25} colour="#eef1f4" /><Car x={270} y={150} s={1.25} colour="#e7f1e4" line="#5f8a66" /><Car x={450} y={150} s={1.25} colour="#dcefe3" line={P.useful} />
    <g transform="translate(90 70)"><rect x="-10" y="-14" width="20" height="28" rx="3" fill={'#f6dfa5'} stroke="#c98f2c" strokeWidth="1.6" /><rect x="-6" y="-9" width="12" height="7" rx="1" fill="white" stroke="#c98f2c" strokeWidth="1.2" /></g>
    <g transform="translate(248 70)"><rect x="-10" y="-14" width="20" height="28" rx="3" fill={'#f6dfa5'} stroke="#c98f2c" strokeWidth="1.6" /><rect x="-6" y="-9" width="12" height="7" rx="1" fill="white" stroke="#c98f2c" strokeWidth="1.2" /></g>
    <Say x={270} y={76} lines={['+']} anchor="middle" size={16} halo={false} />
    <g transform="translate(294 70)"><circle r="13" fill="white" stroke={S.electric} strokeWidth="1.6" /><Bolt x={0} y={0} s={.75} /></g>
    <g transform="translate(450 70)"><circle r="13" fill="white" stroke={S.electric} strokeWidth="1.6" /><Bolt x={0} y={0} s={.75} /></g>
    <Plug x={496} y={118} />
    <Say x={90} y={184} lines={['petrol']} anchor="middle" halo={false} />
    <Say x={270} y={184} lines={['hybrid: two fuels']} anchor="middle" halo={false} />
    <Say x={450} y={184} lines={['electric']} anchor="middle" halo={false} />
    <Say x={360} y={220} lines={['becoming more popular']} anchor="middle" size={13} colour={P.useful} halo={false} />
    <path d="M226 212H490" stroke={P.useful} strokeWidth="1.4" strokeDasharray="4 4" opacity=".0" />
  </Fig>
}
const chainIcons = (x: number, i: number): ReactNode => [
  <g key="p"><Person x={x - 14} y={62 + 20} s={.62} mood="sad" /><Person x={x + 14} y={62 + 22} s={.58} fill="#f3e3d6" colour="#a0826a" mood="sad" /></g>,
  <g key="g"><Government x={x} y={96} s={.62} /></g>,
  <g key="w"><Turbine x={x - 12} y={100} h={50} angle={20} /><Turbine x={x + 16} y={100} h={42} angle={60} /></g>,
  <g key="c"><PowerPlant x={x - 14} y={98} s={.5} dim /><path d={`M${x - 2} 80h10`} stroke={ink} strokeWidth="2" /><path d={`M${x + 7} 76l6 4 -6 4z`} fill={ink} /><Turbine x={x + 24} y={100} h={40} angle={30} /></g>,
][i]
function Chain() {
  const xs = [72, 204, 336, 468], names = [['people worry', 'about the', 'environment'], ['government', 'sets targets'], ['providers build', 'renewables'], ['the resources', 'we use change']]
  return <Fig title="A chain of four round pictures joined by arrows: 1 worried people, 2 a government sets targets, 3 energy providers build renewable power plants, 4 the energy resources we use change." h={250}>
    {xs.map((x, i) => <g key={x}>
      <Round x={x} y={80} r={52} tint={i === 3 ? '#f3faf5' : P.panel} edge={i === 3 ? P.useful : P.panelLine}>{chainIcons(x, i)}</Round>
      <Num n={i + 1} x={x - 44} y={36} />
      <Say x={x} y={162} lines={names[i]} anchor="middle" size={13} halo={false} />
      {i < 3 && <TransferArrow from={[x + 56, 80]} to={[xs[i + 1] - 56, 80]} bend={0} colour={ink} width={2.6} />}
    </g>)}
    <Say x={270} y={222} lines={['each push leads to the next']} anchor="middle" size={13} colour={muted} halo={false} />
  </Fig>
}

/* ---------- What limits renewables ---------- */
function Bubble({ x, y, w, text, tail = 'left', colour = P.panelLine }: { x: number; y: number; w: number; text: string; tail?: 'left' | 'right'; colour?: string }) {
  const tx = tail === 'left' ? x + 18 : x + w - 18
  return <g><path d={`M${x + 12} ${y}H${x + w - 12}Q${x + w} ${y} ${x + w} ${y + 12}V${y + 22}Q${x + w} ${y + 34} ${x + w - 12} ${y + 34}H${tx + 8}L${tx - (tail === 'left' ? 4 : -4)} ${y + 46}L${tx - 4} ${y + 34}H${x + 12}Q${x} ${y + 34} ${x} ${y + 22}V${y + 12}Q${x} ${y} ${x + 12} ${y}Z`} fill="white" stroke={colour} strokeWidth="1.6" />
    <text x={x + w / 2} y={y + 22} textAnchor="middle" fontSize="13" fontWeight="650" fill={ink}>{text}</text></g>
}
function Scientist({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g><Person x={x} y={y} s={s} fill="white" colour="#6d8394" />
    <rect x={x + 8 * s} y={y - 24 * s} width={16 * s} height={20 * s} rx="2" fill="#f6ecd9" stroke="#9c8a74" strokeWidth="1.4" />
    <path d={`M${x + 11 * s} ${y - 18 * s}h10M${x + 11 * s} ${y - 13 * s}h10M${x + 11 * s} ${y - 8 * s}h7`} stroke="#9c8a74" strokeWidth="1.1" /></g>
}
function Evidence() {
  return <Fig title="A scientist holding a report says: advice. An arrow from the scientist towards a government building, a company and a group of people is broken, because scientists cannot make them change. Three tags below: money, politics and people." h={290}>
    <path d="M20 180H520" stroke={S.grassLine} strokeWidth="2" />
    <Scientist x={70} y={180} s={1.3} />
    <Bubble x={20} y={40} w={96} text="advice" />
    <Say x={70} y={202} lines={['scientist']} anchor="middle" size={13} halo={false} />
    <path d="M122 130H200M218 130H286" stroke={ink} strokeWidth="2.6" strokeDasharray="10 0" />
    <path d="M200 120L208 140M210 120L218 140" stroke={P.wasted} strokeWidth="2.2" />
    <path d="M284 122l12 8 -12 8z" fill={ink} />
    <Government x={340} y={180} s={.6} /><Provider x={416} y={180} s={.72} />
    <Person x={476} y={180} s={.62} /><Person x={500} y={184} s={.58} fill="#f3e3d6" colour="#a0826a" />
    <Say x={270} y={96} lines={['scientists can only', 'give advice']} anchor="middle" size={13} halo={false} />
    <Say x={270} y={228} lines={['limited by:']} anchor="middle" size={13} colour={muted} halo={false} />
    <Tag x={120} y={242} lines={['money']} kind="coin" anchor="middle" /><Tag x={270} y={242} lines={['politics']} kind="note" anchor="middle" /><Tag x={420} y={242} lines={['people']} kind="note" anchor="middle" />
  </Fig>
}
function PriceTag({ x, y, text }: { x: number; y: number; text: string }) {
  const w = text.length * 9 + 18
  return <g><path d={`M${x} ${y}L${x + 10} ${y - 11}H${x + w}V${y + 11}H${x + 10}Z`} fill="#fdf0cf" stroke="#b98a17" strokeWidth="1.6" /><circle cx={x + 9} cy={y} r="2.4" fill="white" stroke="#b98a17" strokeWidth="1.2" /><text x={x + 14 + (w - 14) / 2} y={y + 5} textAnchor="middle" fontSize="13.5" fontWeight="800" fill="#9a700f">{text}</text></g>
}
function Money() {
  return <Fig title="Three pictures about money. A pile of coins beside a new power plant: building costs money. A test tube: more research is needed. An electric car with a bigger price tag than a similar petrol car." h={280}>
    {[14, 190, 366].map(x => <Panel key={x} x={x} y={14} w={160} h={176} tint="white" />)}
    <path d="M24 160H164" stroke={S.grassLine} strokeWidth="2" />
    <WindFarm x={112} y={160} s={.75} />
    {[0, 1, 2, 3].map(i => <ellipse key={i} cx={46} cy={156 - i * 6} rx="16" ry="5" fill="#fbe7a8" stroke="#b98a17" strokeWidth="1.5" />)}
    <g transform="translate(270 104)">
      <path d="M-10 -52H10M-7 -52V26A7 7 0 0 0 7 26V-52" fill="white" stroke={S.steel} strokeWidth="1.8" />
      <path d="M-6.2 0H6.2V26A6.2 6.2 0 0 1 -6.2 26Z" fill="#cfe3fa" stroke="none" />
      <circle cx="-1" cy="14" r="2" fill="white" /><circle cx="2" cy="6" r="1.5" fill="white" />
      <text x="26" y="-14" fontSize="20" fontWeight="800" fill={muted}>?</text>
    </g>
    <Car x={446} y={110} s={.95} colour="#dcefe3" line={P.useful} /><PriceTag x={410} y={48} text="£££" />
    <Car x={446} y={176} s={.95} colour="#eef1f4" /><PriceTag x={420} y={130} text="££" />
    <Say x={94} y={214} lines={['building costs', 'money']} anchor="middle" size={13} halo={false} />
    <Say x={270} y={214} lines={['more research', 'needed']} anchor="middle" size={13} halo={false} />
    <Say x={446} y={214} lines={['electric cars usually', 'cost more']} anchor="middle" size={13} halo={false} />
  </Fig>
}
function Scale({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} stroke={ink} strokeWidth={1.8 / s} fill="none">
    <path d="M0 0V-44M-14 0H14M-30 -40L30 -34" />
    <path d="M-30 -40L-40 -20H-20ZM30 -34L20 -14H40Z" fill="#fdf0cf" stroke="#b98a17" />
    <circle cx="0" cy="-44" r="3" fill={ink} />
  </g>
}
function Paper({ x, y, title }: { x: number; y: number; title: string }) {
  return <g><path d={`M${x} ${y}H${x + 54}L${x + 66} ${y + 12}V${y + 76}H${x}Z`} fill="white" stroke={S.steel} strokeWidth="1.6" />
    <text x={x + 8} y={y + 20} fontSize="12" fontWeight="750" fill={ink}>{title}</text>
    {[34, 44, 54].map(d => <path key={d} d={`M${x + 8} ${y + d}H${x + 50}`} stroke="#c3cdd5" strokeWidth="1.4" />)}
    <text x={x + 52} y={y + 70} textAnchor="end" fontSize="13" fontWeight="800" fill="#9a700f">£</text></g>
}
function Politics() {
  return <Fig title="An energy bill and a tax form with a coin: the cost of switching is paid through bills or taxes. Two people say: I don't want to pay, and I can't afford to pay. A balance asks: is it ethical?" h={280}>
    <Paper x={24} y={40} title="bill" /><Paper x={100} y={54} title="tax" />
    <Coin x={176} y={128} r={15} />
    <Say x={100} y={172} lines={['paid through bills', 'or taxes']} anchor="middle" size={13} halo={false} />
    <Person x={268} y={210} s={.95} mood="sad" /><Person x={378} y={210} s={.95} fill="#f3e3d6" colour="#a0826a" mood="sad" />
    <Bubble x={230} y={104} w={150} text="don't want to pay" />
    <Bubble x={340} y={40} w={166} text="can't afford to pay" />
    <path d="M220 210H420" stroke={S.grassLine} strokeWidth="2" />
    <Scale x={480} y={180} s={1} />
    <Say x={480} y={206} lines={['ethical?']} anchor="middle" size={13.5} halo={false} />
    <Say x={480} y={224} lines={['right or wrong']} anchor="middle" size={12.5} colour={muted} halo={false} />
  </Fig>
}
function People() {
  return <Fig title="A house close to a wind farm and a hydro-electric dam. A person outside the house frowns: they do not want to live near a power plant. A balance asks whether it is ethical to make them put up with it." h={290}>
    <Clip x={0} y={0} w={540} h={290} r={16}><path d={landPath(x => 200 - 40 * gauss(x, 150, 90) + 4 * Math.sin(x / 30), 0, 540, 300)} fill={S.grass} stroke={S.grassLine} strokeWidth="1.6" /></Clip>
    <WindFarm x={120} y={166} s={1} />
    <Say x={120} y={56} lines={['wind farm']} anchor="middle" size={13} />
    <Say x={244} y={120} lines={['dam']} anchor="middle" size={13} />
    <g><path d="M232 132H254C256 150 260 170 268 192H232Z" fill="#e7e3dc" stroke="#978d80" strokeWidth="1.6" /><path d={`${smooth([[186, 188], [206, 150], [232, 136]])}L232 192Z`} fill={P.water} stroke={P.waterLine} strokeWidth="1.4" /></g>
    <House x={330} y={202} s={1.4} />
    <Person x={386} y={206} s={.95} mood="sad" />
    <Say x={386} y={234} lines={["don't want to live near", 'a power plant']} anchor="middle" size={13} />
    <Scale x={476} y={110} s={.9} />
    <Say x={476} y={132} lines={['ethical to make', 'people put up', 'with it?']} anchor="middle" size={12.5} halo={false} />
  </Fig>
}
function Demand() {
  return <Fig title="Three bars. Demand rises. The bar for a fossil-fuel power station rises to meet it. The bar for a wind turbine stays flat and is locked, because its output cannot be increased on demand." h={280}>
    <path d="M30 200H510" stroke={ink} strokeWidth="1.8" />
    <rect x={60} y={60} width={50} height={140} rx="5" fill={P.kinetic} stroke={P.kineticLine} strokeWidth="1.6" />
    <path d="M60 110H110" stroke={P.kineticLine} strokeWidth="1.2" strokeDasharray="4 3" /><path d="M126 110V64M118 74l8 -11 8 11" stroke={P.kineticLine} strokeWidth="2.6" fill="none" />
    <Say x={85} y={224} lines={['demand rises']} anchor="middle" size={13} halo={false} />
    <PowerPlant x={250} y={62} s={.6} />
    <rect x={225} y={70} width={50} height={130} rx="5" fill={P.usefulFill} stroke={P.useful} strokeWidth="1.6" />
    <path d="M225 116H275" stroke={P.useful} strokeWidth="1.2" strokeDasharray="4 3" /><path d="M291 116V74M283 84l8 -11 8 11" stroke={P.useful} strokeWidth="2.6" fill="none" />
    <Say x={250} y={224} lines={['fossil fuel: output', 'can rise to meet it']} anchor="middle" size={13} halo={false} />
    <Turbine x={420} y={134} h={60} angle={0} />
    <rect x={395} y={140} width={50} height={60} rx="5" fill={P.panel} stroke={S.steel} strokeWidth="1.6" />
    <g transform="translate(466 150)"><path d="M-7 -2V-8A7 7 0 0 1 7 -8V-2" stroke={S.steel} strokeWidth="2.4" fill="none" /><rect x="-10" y="-2" width="20" height="16" rx="3" fill="#fdf0cf" stroke="#b98a17" strokeWidth="1.6" /></g>
    <Say x={420} y={224} lines={['some renewables: cannot', 'increase on demand']} anchor="middle" size={13} colour={P.wasted} halo={false} />
  </Fig>
}
function QGraph({ assessment }: { assessment: boolean }) {
  const s = graphScale(GF)
  const pts: [string, number][] = [['A', 1900], ['B', 2005], ['C', 2020]]
  return <Fig title={assessment ? 'A graph of electricity use over time with three marked points A, B and C.' : 'A graph of UK electricity use over time. A is around 1900, B is the peak in the early 2000s, and C is the latest year, after a slow fall.'} h={270}>
    <Graph />
    {pts.map(([n, t]) => { const [x, y] = s.pt(t, use(t)); return <g key={n}><circle cx={x} cy={y} r="5.5" fill="white" stroke={ink} strokeWidth="2.2" /><text x={x + (n === 'A' ? 12 : n === 'C' ? 10 : 0)} y={y - (n === 'A' ? 4 : 12)} textAnchor={n === 'B' ? 'middle' : 'start'} fontSize="15" fontWeight="800" fill={ink}>{n}</text></g> })}
  </Fig>
}

export function EnergyTrendVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'etrend-rise': return <Rise />
    case 'etrend-graph': return <Peak />
    case 'etrend-why-fall': return <WhyFall />
    case 'etrend-still': return <Still />
    case 'etrend-damage': return <Damage />
    case 'etrend-pressure': return <Pressure />
    case 'etrend-providers': return <Providers />
    case 'etrend-cars': return <Cars />
    case 'etrend-chain': return <Chain />
    case 'etrend-evidence': return <Evidence />
    case 'etrend-money': return <Money />
    case 'etrend-politics': return <Politics />
    case 'etrend-people': return <People />
    case 'etrend-demand': return <Demand />
    case 'etrend-q-graph': return <QGraph assessment={assessment} />
    default: return null
  }
}
