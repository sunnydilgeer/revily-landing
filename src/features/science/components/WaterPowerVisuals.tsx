import type { ReactNode } from 'react'
import { physicsPalette as P, EnergyStoreBadge, TransferArrow, type Pt } from './PhysicsKit'
import { Fig, Say, Tag, Num, Panel, Clip, Sun, Cloud, Moon, Gust, Bolt, Cable, Pylon, House, Tree, Bird, Fish, Coin, blob, smooth, landPath, wavePath, gauss, scene as S } from './WindSolarVisuals'

/*
 * Physics Lesson 12: hydro-electricity, waves and tides. Original, code-native schematics; not to scale. Focus ids start 'waterpow-'.
 * Colour code as in the other energy-resource lessons: blue = water, green = land and plants, vermilion bolt = electricity,
 * indigo = gravitational potential store, orange = kinetic store, purple bubbles = greenhouse gas (carbon dioxide, as in Chemistry),
 * green tick tag = advantage, coral cross tag = disadvantage.
 * One valley-and-dam cut-away is reused through the hydro frames, one estuary map through the tidal frames.
 */
const { ink, muted } = P
const r1 = (n: number) => Math.round(n * 10) / 10
const concrete = '#e7e3dc', concreteLine = '#978d80'
const sand = '#f3e6c8', sandLine = '#c9ad74'
const mud = '#e3d3b8', mudLine = '#a88c62'
const gas = '#8f6fc4'

/* ---------- Hydro-electric: a valley cut-away ---------- */
const LAKE = 112, DAM_X = 292
const upland: Pt[] = [[0, 64], [40, 80], [90, 120], [150, 182], [210, 224], [256, 236], [300, 240]]
const lowland: Pt[] = [[290, 254], [320, 250], [380, 254], [440, 252], [490, 234], [520, 200], [540, 186]]

function Valley({ drained = false, cons = false }: { drained?: boolean; cons?: boolean }) {
  const level = drained ? 196 : LAKE
  return <Clip x={0} y={0} w={540} h={290} r={16}>
    <rect x={0} y={level} width={DAM_X + 4} height={300 - level} fill={P.water} />
    <path d={`M0 ${level}H${DAM_X}`} stroke={P.waterLine} strokeWidth="2" />
    <path d={`${smooth(upland)}L300 300H0Z`} fill={S.grass} />
    <path d={`${smooth(lowland)}L540 300H290Z`} fill={S.grass} />
    <path d={smooth(upland)} stroke={S.grassLine} strokeWidth="1.8" fill="none" />
    <path d={smooth(lowland)} stroke={S.grassLine} strokeWidth="1.8" fill="none" />
    <path d="M320 251C380 257 440 256 486 240L500 246C450 262 380 263 320 258Z" fill={P.water} stroke={P.waterLine} strokeWidth="1.2" />
    {cons && <g>
      {[[150, 176], [196, 214], [236, 226]].map(([x, y], i) => <g key={i}><path d={`M${x} ${y + 2}V${y - 14}M${x} ${y - 8}L${x - 6} ${y - 14}M${x} ${y - 10}L${x + 5} ${y - 17}`} stroke="#8a6443" strokeWidth="2.2" fill="none" /></g>)}
      {[[160, 150, 5], [150, 128, 4], [205, 176, 5], [212, 150, 4], [242, 196, 4.5], [236, 170, 3.5]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#e4d6f2" stroke={gas} strokeWidth="1.6" />)}
    </g>}
    {!drained && <><Tree x={16} y={70} s={.75} seed={60} /><Tree x={46} y={84} s={.65} seed={110} /></>}
    <path d={`M${DAM_X - 2} 96H${DAM_X + 16}C${DAM_X + 20} 150 ${DAM_X + 32} 204 ${DAM_X + 50} 252H${DAM_X - 2}Z`} fill={concrete} stroke={concreteLine} strokeWidth="2" />
    <path d={`M${DAM_X + 4} 120H${DAM_X + 18}M${DAM_X + 4} 160H${DAM_X + 24}M${DAM_X + 4} 200H${DAM_X + 32}`} stroke={concreteLine} strokeWidth="1" opacity=".6" />
  </Clip>
}
function Penstock({ open = true }: { open?: boolean }) {
  const d = `M${DAM_X - 4} 214L${DAM_X + 30} 232Q${DAM_X + 44} 240 ${DAM_X + 62} 240H${DAM_X + 80}`
  return <g>
    <path d={d} stroke={P.waterLine} strokeWidth="11" fill="none" />
    <path d={d} stroke={open ? P.water : '#e5eef3'} strokeWidth="6" fill="none" />
  </g>
}
function TurbineHouse({ x = DAM_X + 100, y = 252 }: { x?: number; y?: number }) {
  return <g>
    <path d={`M${x - 24} ${y}V${y - 30}L${x} ${y - 42}L${x + 24} ${y - 30}V${y}Z`} fill="#eef1f4" stroke={S.steel} strokeWidth="1.6" />
    <circle cx={x} cy={y - 14} r="9" fill="white" stroke={S.steel} strokeWidth="1.5" />
    {[0, 90, 180, 270].map(a => <path key={a} d={`M${x} ${y - 14}l${r1(7 * Math.cos(a * Math.PI / 180))} ${r1(7 * Math.sin(a * Math.PI / 180))}`} stroke={S.steel} strokeWidth="2" />)}
  </g>
}
function Hydro({ step }: { step: 'dam' | 'turbines' | 'pros' | 'cons' }) {
  const titles = {
    dam: 'A cut-away of a valley. A tall curved dam holds back a lake that fills the valley behind it, so a lot of water is stored high up. The water has a gravitational potential energy store.',
    turbines: 'The same valley. Water flows from the bottom of the lake through a pipe in the dam, down to a turbine house. Energy goes from the gravitational potential store to the kinetic store of the moving water, and the turbines generate electricity.',
    pros: 'The same valley and dam. A gate on the pipe controls how much water flows, so more electricity can be generated as soon as it is needed. No smoke comes from the plant.',
    cons: 'The same valley, with tree stumps and rotting plants under the lake giving off bubbles of greenhouse gas, a bird flying away, and a coin for the high cost of building.',
  }
  return <Fig title={titles[step]} h={290}>
    <Valley cons={step === 'cons'} />
    {step !== 'dam' && <><Penstock /><TurbineHouse /><Pylon x={472} y={246} h={62} /><Cable from={[DAM_X + 118, 226]} to={[468, 196]} sag={2} bolt={step === 'turbines'} /></>}
    {step === 'dam' && <>
      <Say x={DAM_X + 26} y={84} lines={['dam']} />
      <Say x={150} y={150} lines={['flooded valley']} anchor="middle" />
      <EnergyStoreBadge store="gravitational" x={170} y={82} label="Gravitational" />
      <path d={`M${DAM_X + 70} ${LAKE}H${DAM_X + 110}M${DAM_X + 90} ${LAKE + 4}V244M${DAM_X + 70} 250H${DAM_X + 110}`} stroke={muted} strokeWidth="1.5" strokeDasharray="4 4" />
      <path d={`M${DAM_X + 84} ${LAKE + 12}l6 -9 6 9z`} fill={muted} />
      <Say x={DAM_X + 118} y={146} lines={['water stored', 'high up']} />
    </>}
    {step === 'turbines' && <>
      <EnergyStoreBadge store="gravitational" x={170} y={82} label="Gravitational" />
      <EnergyStoreBadge store="kinetic" x={404} y={120} label="Kinetic" />
      <TransferArrow from={[248, 92]} to={[350, 118]} bend={-.18} colour={ink} width={2.4} />
      <Say x={DAM_X + 100} y={280} lines={['water flows out through the turbine']} size={13} anchor="middle" />
      <Say x={496} y={170} lines={['electricity']} colour={S.electric} anchor="middle" />
    </>}
    {step === 'pros' && <>
      <g transform={`translate(${DAM_X + 36} 222)`}><path d="M0 12V0" stroke="#b98a17" strokeWidth="2.4" /><circle r="8" fill="#fdf0cf" stroke="#b98a17" strokeWidth="2" /><path d="M-8 0H8M0 -8V8" stroke="#b98a17" strokeWidth="1.6" /></g>
      <Tag x={20} y={16} lines={['no pollution when running']} />
      <Tag x={520} y={16} lines={['flow can be controlled:', 'responds straight away', 'to extra demand']} anchor="end" />
      <path d={`M${DAM_X + 44} 214Q${DAM_X + 80} 170 ${DAM_X + 100} 82`} stroke={ink} strokeWidth="1.4" strokeDasharray="4 4" fill="none" />
    </>}
    {step === 'cons' && <>
      <Tag x={20} y={16} lines={['high initial costs']} kind="coin" />
      <Tag x={520} y={16} lines={['plants rot and release', 'greenhouse gases']} kind="con" anchor="end" />
      <Tag x={520} y={80} lines={['animals and plants', 'lose their habitats']} kind="con" anchor="end" />
      <Bird x={96} y={82} s={1.2} /><Bird x={122} y={66} s={.9} />
      <path d="M140 92Q170 70 206 70" stroke={muted} strokeWidth="1.4" strokeDasharray="3 5" fill="none" />
      <Say x={216} y={270} lines={['drowned trees']} size={13} colour="#8a6443" anchor="middle" />
    </>}
  </Fig>
}
function Rain() {
  const panel = (x0: number, wet: boolean) => {
    const ground = (x: number) => 160 - 60 * gauss(x, x0 + 30, 50) - 50 * gauss(x, x0 + 214, 46) + 40 * gauss(x, x0 + 122, 60)
    const level = wet ? 150 : 188
    return <Clip x={x0} y={20} w={244} h={196}>
      <rect x={x0} y={20} width={244} height={196} fill={wet ? '#f1f5f8' : '#fffaf0'} />
      <rect x={x0 + 60} y={level} width={124} height={80} fill={P.water} />
      <path d={`M${x0 + 60} ${level}H${x0 + 184}`} stroke={P.waterLine} strokeWidth="1.8" />
      <path d={landPath(ground, x0, x0 + 244, 230, 12)} fill={wet ? S.grass : '#f1e3c4'} stroke={wet ? S.grassLine : '#c9ad74'} strokeWidth="1.6" />
      <path d={`M${x0 + 176} ${ground(x0 + 176) - 60}V${ground(x0 + 176) + 2}`} stroke="none" />
      {!wet && [[x0 + 30, 150], [x0 + 208, 158], [x0 + 90, 206]].map(([x, y], i) => <path key={i} d={`M${x - 10} ${y}l6 4 3 -4 5 5 6 -3`} stroke="#b08a4a" strokeWidth="1.4" fill="none" />)}
    </Clip>
  }
  return <Fig title="Two small valleys, each holding a reservoir. In a rainy place, clouds and rain keep the lake full. In a dry place, under a hot Sun, the ground is cracked and the lake is low." h={286}>
    {panel(12, true)}{panel(284, false)}
    <rect x={12} y={20} width={244} height={196} rx="14" fill="none" stroke={P.panelLine} strokeWidth="1.4" />
    <rect x={284} y={20} width={244} height={196} rx="14" fill="none" stroke={P.panelLine} strokeWidth="1.4" />
    <Cloud x={90} y={52} s={.9} dark /><Cloud x={170} y={44} s={.75} dark />
    {[70, 84, 98, 112, 152, 166, 180].map((x, i) => <path key={x} d={`M${x} ${66 + (i % 2) * 6}l-4 12`} stroke={P.waterLine} strokeWidth="2" />)}
    <Sun x={406} y={58} r={18} />
    <Say x={134} y={246} lines={['high rainfall:', 'reliable']} anchor="middle" size={13} halo={false} />
    <Say x={406} y={246} lines={['dry climate or drought:', 'not suitable']} anchor="middle" size={13} halo={false} colour={P.wasted} />
  </Fig>
}

/* ---------- Wave power: a coast seen from the side ---------- */
function WaveFloat({ x, y, dim = false }: { x: number; y: number; dim?: boolean }) {
  return <g opacity={dim ? S.faded : 1}>
    <path d={`M${x - 18} ${y}Q${x} ${y + 10} ${x + 18} ${y}L${x + 14} ${y - 10}H${x - 14}Z`} fill="#fbe0c6" stroke={P.kineticLine} strokeWidth="1.6" />
    <rect x={x - 8} y={y - 22} width={16} height={12} rx="3" fill="#eef1f4" stroke={S.steel} strokeWidth="1.5" />
    <circle cx={x} cy={y - 16} r="3" fill="white" stroke={S.steel} strokeWidth="1.3" />
    <path d={`M${x} ${y + 5}V${y + 40}`} stroke={S.steel} strokeWidth="1.3" strokeDasharray="3 3" />
  </g>
}
const seaTop = (x: number) => 150 + 9 * Math.sin(x / 22)
function Coast({ children }: { children?: ReactNode }) {
  const cliff: Pt[] = [[392, 300], [396, 170], [410, 130], [440, 116], [500, 110], [540, 112]]
  return <Clip x={0} y={0} w={540} h={290} r={16}>
    <path d={`${landPath(seaTop, 0, 420, 300, 8)}`} fill={P.water} stroke={P.waterLine} strokeWidth="2" />
    <path d={landPath(x => 262 + 6 * Math.sin(x / 40), 0, 420, 300)} fill={sand} stroke={sandLine} strokeWidth="1.4" />
    <path d={`${smooth(cliff)}V300Z`} fill={S.grass} stroke={S.grassLine} strokeWidth="1.8" />
    {children}
  </Clip>
}
function Wave() {
  const floats = [70, 160, 250]
  return <Fig title="The sea beside a coast. Three floating wave turbines ride on the waves. The waves move them up and down and turn the turbines, and a cable along the seabed carries electricity to a pylon on the coast." h={290}>
    <Coast>
      {floats.map(x => <WaveFloat key={x} x={x} y={seaTop(x) + 2} />)}
      <path d={`M${floats[0]} ${seaTop(floats[0]) + 44}Q${floats[0]} 256 110 256H380Q400 256 404 200L410 140`} stroke={S.electric} strokeWidth="2" fill="none" strokeDasharray="1 5" />
      <Pylon x={470} y={112} h={62} />
    </Coast>
    <Gust from={[20, 44]} to={[100, 46]} />
    <Say x={20} y={30} lines={['wind makes waves']} colour={S.wind} size={13} />
    <path d="M300 100V140M294 108l6 -9 6 9M294 132l6 9 6 -9" stroke={ink} strokeWidth="2" fill="none" />
    <Say x={314} y={112} lines={['waves turn', 'the turbines']} size={13} />
    <Say x={120} y={228} lines={['turbines in the sea']} size={13} />
    <Say x={480} y={200} lines={['coast']} anchor="middle" colour={P.plantLine} halo={false} />
    <Bolt x={420} y={60} s={1.1} /><Say x={434} y={66} lines={['electricity']} colour={S.electric} size={13} />
  </Fig>
}
function Island() {
  const ring = Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return [r1(270 + Math.cos(a) * 170), r1(150 + Math.sin(a) * 92)] as Pt })
  return <Fig title="An island seen from above, with a long coastline. Small wave turbines float in the sea all the way round it." h={300}>
    <Clip x={0} y={0} w={540} h={300} r={16}>
      <rect x={0} y={0} width={540} height={300} fill={P.water} />
      {[40, 90, 250, 270].map((y, i) => <path key={y} d={wavePath(i % 2 ? 20 : 380, i % 2 ? 140 : 520, y, 3, 26)} stroke="#e8f4fa" strokeWidth="2" fill="none" />)}
      <path d={blob(270, 150, 140, 70, 17, .14, 12)} fill={sand} stroke={sandLine} strokeWidth="1.8" />
      <path d={blob(268, 148, 122, 56, 17, .14, 12)} fill={S.grass} stroke={S.grassLine} strokeWidth="1.6" />
      <Tree x={230} y={150} s={.8} seed={3} /><Tree x={320} y={140} s={.7} seed={5} /><House x={278} y={170} s={.9} lit />
    </Clip>
    {ring.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="7" fill="#fbe0c6" stroke={P.kineticLine} strokeWidth="1.6" /><circle cx={x} cy={y} r="2.2" fill={S.steel} /></g>)}
    <Tag x={16} y={14} lines={['no pollution']} />
    <Tag x={524} y={246} lines={['useful on islands:', 'lots of coastline']} anchor="end" />
  </Fig>
}
function WaveCons() {
  const px = [12, 188, 364], pw = 164, top = 20, ph = 180
  return <Fig title="Three small pictures. A wave turbine anchored to the seabed with a fish swimming away. A rough sea with wind, then a calm flat sea with no wind. A spanner and a coin for repairs." h={290}>
    {px.map(x => <Panel key={x} x={x} y={top} w={pw} h={ph} tint="white" />)}
    <Clip x={px[0]} y={top} w={pw} h={ph}>
      <path d={landPath(x => 70 + 4 * Math.sin(x / 14), px[0], px[0] + pw, 210, 6)} fill={P.water} stroke={P.waterLine} strokeWidth="1.6" />
      <path d={landPath(x => 170 + 6 * Math.sin(x / 20), px[0], px[0] + pw, 210)} fill={sand} stroke={sandLine} strokeWidth="1.4" />
      {[[50, 168], [70, 160], [104, 172]].map(([x, y], i) => <path key={i} d={blob(px[0] + x, y, 7, 4, i + 3)} fill="#e0cfa6" stroke={sandLine} strokeWidth="1.2" />)}
    </Clip>
    <WaveFloat x={px[0] + 82} y={72} />
    <path d={`M${px[0] + 82} 112V170`} stroke={S.steel} strokeWidth="2" /><rect x={px[0] + 72} y={168} width={20} height={8} rx="2" fill="#c3cad3" stroke={S.steel} strokeWidth="1.4" />
    <Fish x={px[0] + 130} y={130} s={.9} flip />
    <path d={`M${px[0] + 104} 132H${px[0] + 116}M${px[0] + 104} 124H${px[0] + 112}`} stroke={muted} strokeWidth="1.4" />
    <Clip x={px[1]} y={top} w={pw} h={ph}>
      <path d={landPath(x => 70 + 12 * Math.sin(x / 11), px[1], px[1] + 82, 210, 4)} fill={P.water} stroke={P.waterLine} strokeWidth="1.6" />
      <path d={landPath(() => 120, px[1] + 82, px[1] + pw, 210)} fill={P.water} stroke={P.waterLine} strokeWidth="1.6" />
    </Clip>
    <path d={`M${px[1] + 82} ${top}V${top + ph}`} stroke={P.panelLine} strokeWidth="1.4" strokeDasharray="4 4" />
    <Gust from={[px[1] + 10, 40]} to={[px[1] + 62, 40]} width={2.4} />
    <Say x={px[1] + 124} y={50} lines={['calm']} anchor="middle" size={13} colour={muted} />
    <WaveFloat x={px[1] + 40} y={78} /><WaveFloat x={px[1] + 124} y={120} />
    <Clip x={px[2]} y={top} w={pw} h={ph}><rect x={px[2]} y={top} width={pw} height={ph} fill="#fbfcfd" /></Clip>
    <g transform={`translate(${px[2] + 64} 104) rotate(-35)`}>
      <path d="M-6 -30A14 14 0 1 0 6 -30V-18H-6Z" fill="#dfe6ec" stroke={S.steel} strokeWidth="1.8" />
      <rect x="-6" y="-14" width="12" height="62" rx="5" fill="#dfe6ec" stroke={S.steel} strokeWidth="1.8" />
    </g>
    <Coin x={px[2] + 118} y={126} r={18} /><Coin x={px[2] + 128} y={96} r={14} />
    {[['disturbs the seabed', 'and habitats'], ['waves die out when', 'the wind drops'], ['difficult and expensive', 'to maintain']].map((l, i) => <Say key={i} x={px[i] + pw / 2} y={226} lines={l} anchor="middle" size={13} halo={false} />)}
    <Say x={px[1] + pw / 2} y={266} lines={['so fairly unreliable']} anchor="middle" size={13} colour={P.wasted} halo={false} />
  </Fig>
}

/* ---------- Tidal barrage: an estuary map ---------- */
const BAR_Y = 150
function Estuary({ cons = false, flow = 'both' }: { cons?: boolean; flow?: 'both' | 'none' }) {
  const bankL: Pt[] = [[150, 0], [170, 50], [160, 100], [120, 160], [60, 210], [0, 226]]
  const bankR: Pt[] = [[210, 0], [228, 50], [250, 100], [330, 150], [430, 196], [540, 214]]
  const water = `${smooth(bankL)}L0 300H540L540 214${smooth([...bankR].reverse()).replace(/^M[^C]+/, '')}Z`
  const bx0 = 128, bx1 = 322
  return <Clip x={0} y={0} w={540} h={300} r={16}>
    <rect x={0} y={0} width={540} height={300} fill={S.grass} />
    <path d={water} fill={P.water} stroke={P.waterLine} strokeWidth="1.8" />
    {cons && <g>
      <path d={blob(150, 116, 26, 12, 4)} fill={mud} stroke={mudLine} strokeWidth="1.4" />
      <path d={blob(262, 120, 30, 13, 8)} fill={mud} stroke={mudLine} strokeWidth="1.4" />
    </g>}
    <path d={`M${bx0} ${BAR_Y + 8}L${bx1} ${BAR_Y - 6}`} stroke={concreteLine} strokeWidth="14" />
    <path d={`M${bx0} ${BAR_Y + 8}L${bx1} ${BAR_Y - 6}`} stroke={concrete} strokeWidth="10" />
    {[0.25, 0.5, 0.75].map(f => { const x = bx0 + (bx1 - bx0) * f, y = BAR_Y + 8 - 14 * f; return <g key={f}><rect x={x - 9} y={y - 9} width={18} height={18} rx="4" fill="white" stroke={S.steel} strokeWidth="1.5" /><circle cx={x} cy={y} r="4" fill="none" stroke={S.steel} strokeWidth="1.5" /></g> })}
    {flow !== 'none' && [0.25, 0.5, 0.75].map(f => { const x = bx0 + (bx1 - bx0) * f, y = BAR_Y + 8 - 14 * f; return <g key={f} stroke={P.waterLine} fill={P.waterLine}>
      <path d={`M${x} ${y + 44}V${y + 14}M${x} ${y - 14}V${y - 44}`} strokeWidth="2.6" />
      <path d={`M${x - 6} ${y + 42}L${x} ${y + 52}L${x + 6} ${y + 42}ZM${x - 6} ${y - 42}L${x} ${y - 52}L${x + 6} ${y - 42}Z`} strokeWidth="1" />
    </g> })}
  </Clip>
}
function Barrage() {
  return <Fig title="A map of an estuary, where a river widens and meets the sea. A tidal barrage with turbines is built across it. Arrows show the tide moving water in through the turbines, and a pylon on the bank carries the electricity away." h={300}>
    <Estuary />
    <Pylon x={420} y={120} h={56} />
    <Cable from={[322, 138]} to={[416, 72]} sag={-6} />
    <Say x={196} y={30} lines={['river']} anchor="middle" colour={P.waterLine} />
    <Say x={260} y={100} lines={['estuary']} colour={P.waterLine} />
    <Say x={20} y={130} lines={['tidal', 'barrage']} />
    <path d="M86 138L130 154" stroke={ink} strokeWidth="1.4" /><circle cx="130" cy="154" r="2.6" fill={ink} />
    <Say x={270} y={262} lines={['sea']} anchor="middle" colour={P.waterLine} />
    <Say x={300} y={210} lines={['tide comes in and', 'goes out through', 'the turbines']} size={13} />
    <Say x={446} y={44} lines={['electricity']} colour={S.electric} size={13} anchor="middle" />
  </Fig>
}
function TideStrip({ x, y, w, h, level, label, dim = false }: { x: number; y: number; w: number; h: number; level: number; label?: string; dim?: boolean }) {
  const wl = y + h - level
  return <g opacity={dim ? .4 : 1}>
    <Clip x={x} y={y} w={w} h={h} r={10}>
      <rect x={x} y={y} width={w} height={h} fill="#f7fafc" />
      <path d={`${wavePath(x, x + w, wl, 2.5, 24)}V${y + h}H${x}Z`} fill={P.water} stroke={P.waterLine} strokeWidth="1.6" />
      <path d={landPath(xx => y + h - 14 - (xx - x) * .5, x, x + w, y + h + 4)} fill={sand} stroke={sandLine} strokeWidth="1.4" />
    </Clip>
    <rect x={x} y={y} width={w} height={h} rx="10" fill="none" stroke={P.panelLine} strokeWidth="1.3" />
    <path d={`M${x + w - 18} ${y + 12}V${y + h - 6}`} stroke={S.steel} strokeWidth="3" />
    {[0.2, 0.4, 0.6, 0.8].map(f => <path key={f} d={`M${x + w - 24} ${r1(y + 12 + f * (h - 18))}h6`} stroke={S.steel} strokeWidth="1.4" />)}
    {label && <text x={x + w / 2} y={y + h + 20} textAnchor="middle" fontSize="13" fontWeight="650" fill={ink}>{label}</text>}
  </g>
}
function Tides() {
  const xs = [20, 146, 272, 398], w = 118, levels = [74, 26, 74, 26], names = ['high tide', 'low tide', 'high tide', 'low tide']
  return <Fig title="Four pictures of the same beach through one day: high tide, low tide, high tide, low tide. The sea rises and falls twice a day, pulled by the gravity of the Moon and the Sun." h={290}>
    <Moon x={40} y={40} r={16} /><Sun x={96} y={40} r={13} rays={false} />
    <Say x={122} y={45} lines={["the Moon's and Sun's gravity pull on the sea"]} size={13} colour={muted} halo={false} />
    {xs.map((x, i) => <TideStrip key={x} x={x} y={76} w={w} h={100} level={levels[i]} label={names[i]} />)}
    {[0, 2].map(i => <text key={i} x={xs[i] + w / 2} y={68} textAnchor="middle" fontSize="13" fontWeight="750" fill={P.waterLine}>{i ? '2' : '1'}</text>)}
    <Say x={20} y={236} lines={['the sea rises and', 'falls twice a day']} size={13.5} colour={P.waterLine} halo={false} />
    <Tag x={524} y={226} lines={['no pollution once running']} anchor="end" />
  </Fig>
}
function BarrageCons() {
  return <Fig title="The estuary map again, with wading birds and crabs on mud flats beside the barrage. The barrage changes the habitats of wildlife, and there are not many suitable estuaries." h={300}>
    <Estuary cons flow="none" />
    <Bird x={140} y={80} s={1.1} /><Bird x={170} y={66} s={.9} /><Bird x={290} y={78} s={1} />
    {[[146, 114], [268, 118]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}><ellipse rx="6" ry="4" fill="#f5b9ae" stroke="#c0675a" strokeWidth="1.4" /><path d="M-6 -1l-4 -4M6 -1l4 -4M-4 3l-3 4M4 3l3 4" stroke="#c0675a" strokeWidth="1.4" /></g>)}
    <Say x={216} y={126} lines={['mud flats']} size={13} anchor="middle" colour="#8a6443" />
    <Tag x={524} y={16} lines={['changes the habitats', 'of wildlife']} kind="con" anchor="end" />
    <Tag x={524} y={242} lines={['not many suitable', 'estuaries']} kind="con" anchor="end" />
  </Fig>
}
function TideSize() {
  return <Fig title="Two tides compared, each showing how far the sea rises and falls. A big tide, with a large rise and fall of the sea, gives a tall energy bar. A small tide, with a small rise and fall, gives a short energy bar." h={270}>
    {[[20, 94, 10, 'bigger tide, more energy', 150], [282, 64, 28, 'smaller tide, less energy', 60]].map(([x, hi, lo, label, bar], i) => {
      const X = x as number, H = hi as number, L = lo as number, B = bar as number
      return <g key={i}>
        <TideStrip x={X} y={40} w={150} h={110} level={H} />
        <path d={`M${X + 4} ${150 - H}H${X + 128}`} stroke={P.waterLine} strokeWidth="1.8" strokeDasharray="5 4" />
        <path d={`M${X + 4} ${150 - L}H${X + 128}`} stroke={P.waterLine} strokeWidth="1.8" strokeDasharray="5 4" />
        <path d={`M${X + 60} ${150 - H + 4}V${150 - L - 4}`} stroke={ink} strokeWidth="2" />
        <path d={`M${X + 55} ${150 - H + 10}l5 -7 5 7M${X + 55} ${150 - L - 10}l5 7 5 -7`} stroke={ink} strokeWidth="2" fill="none" />
        <rect x={X + 176} y={150 - B * .7} width={34} height={B * .7} rx="4" fill={P.kinetic} stroke={P.kineticLine} strokeWidth="1.6" />
        <text x={X + 193} y={170} textAnchor="middle" fontSize="12.5" fontWeight="650" fill={muted}>energy</text>
        <path d={`M${X + 166} 150H${X + 220}`} stroke={ink} strokeWidth="1.6" />
        <Say x={X + 108} y={208} lines={[label as string]} anchor="middle" size={13.5} halo={false} colour={i ? P.wasted : P.useful} />
      </g>
    })}
    <Say x={270} y={250} lines={['the tides still always happen']} anchor="middle" size={13} colour={muted} halo={false} />
  </Fig>
}

function QSchemes({ assessment }: { assessment: boolean }) {
  return <Fig title={assessment ? 'Three water power schemes, numbered 1 to 3.' : 'Three water power schemes: 1 wave turbines floating by a coast, 2 a barrage across an estuary, 3 a dam holding back a lake in a valley.'} h={250}>
    {[14, 190, 366].map(x => <Panel key={x} x={x} y={14} w={160} h={196} tint="white" />)}
    <Clip x={14} y={14} w={160} h={196}>
      <path d={landPath(x => 110 + 6 * Math.sin(x / 12), 14, 174, 214, 5)} fill={P.water} stroke={P.waterLine} strokeWidth="1.6" />
      <path d={landPath(x => 190 + 4 * Math.sin(x / 20), 14, 174, 214)} fill={sand} stroke={sandLine} strokeWidth="1.3" />
      <path d={`${smooth([[132, 214], [136, 120], [150, 90], [174, 84]])}L174 214Z`} fill={S.grass} stroke={S.grassLine} strokeWidth="1.6" />
    </Clip>
    <WaveFloat x={48} y={112} /><WaveFloat x={100} y={110} />
    <Clip x={190} y={14} w={160} h={196}>
      <rect x={190} y={14} width={160} height={196} fill={S.grass} />
      <path d={`${smooth([[250, 14], [256, 60], [230, 110], [190, 140]])}L190 214H350V150${smooth([[350, 150], [310, 120], [282, 70], [284, 14]]).replace(/^M[^C]+/, '')}Z`} fill={P.water} stroke={P.waterLine} strokeWidth="1.6" />
      <path d="M214 132L314 118" stroke={concreteLine} strokeWidth="11" /><path d="M214 132L314 118" stroke={concrete} strokeWidth="7" />
      {[240, 264, 288].map((x, i) => <rect key={x} x={x - 6} y={128 - i * 3.4 - 6} width={12} height={12} rx="3" fill="white" stroke={S.steel} strokeWidth="1.3" />)}
    </Clip>
    <Clip x={366} y={14} w={160} h={196}>
      <rect x={366} y={96} width={98} height={120} fill={P.water} /><path d="M366 96H464" stroke={P.waterLine} strokeWidth="1.6" />
      <path d={`${smooth([[366, 70], [400, 120], [440, 170], [466, 180]])}L466 214H366Z`} fill={S.grass} stroke={S.grassLine} strokeWidth="1.6" />
      <path d={`${smooth([[462, 198], [500, 194], [526, 160]])}L526 214H462Z`} fill={S.grass} stroke={S.grassLine} strokeWidth="1.6" />
      <path d="M462 84H474C476 120 484 160 496 198H462Z" fill={concrete} stroke={concreteLine} strokeWidth="1.8" />
    </Clip>
    {[94, 270, 446].map((x, i) => <Num key={i} n={i + 1} x={x} y={232} />)}
  </Fig>
}

export function WaterPowerVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'waterpow-dam': return <Hydro step="dam" />
    case 'waterpow-turbines': return <Hydro step="turbines" />
    case 'waterpow-hydro-pros': return <Hydro step="pros" />
    case 'waterpow-hydro-cons': return <Hydro step="cons" />
    case 'waterpow-rain': return <Rain />
    case 'waterpow-wave': return <Wave />
    case 'waterpow-wave-pros': return <Island />
    case 'waterpow-wave-cons': return <WaveCons />
    case 'waterpow-barrage': return <Barrage />
    case 'waterpow-tides': return <Tides />
    case 'waterpow-barrage-cons': return <BarrageCons />
    case 'waterpow-tide-size': return <TideSize />
    case 'waterpow-q-schemes': return <QSchemes assessment={assessment} />
    default: return null
  }
}
