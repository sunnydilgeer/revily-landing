import type { ReactNode } from 'react'
import { physicsPalette, PhysicsDiagram, Lines, Leader, EnergyStoreBadge, GraphAxes, graphScale, type Pt, type GraphFrame } from './PhysicsKit'
import { Arrow, CrossMark, TickMark, r1 } from './GasParticleVisuals'

/*
 * Physics Lesson 26: The National Grid. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'grid-' and is routed from CellBiologyVisuals.tsx.
 *
 * One route picture is reused through the lesson, left to right: power station → step-up transformer → pylons and
 * transmission cables → step-down transformer → homes and a factory. The part being taught is drawn in full and the
 * rest is faded. Colours: electrical power flow in the circuit current vermilion; pd violet; current vermilion;
 * heat wasted in the thermal-store red; demand ink, supply green.
 */
const P = physicsPalette
const { ink, muted } = P
const faded = 0.28
const power = P.current
const steel = '#7f95a6', steelFill = '#eef2f5', ground = '#eef3e6', groundLine = '#b9cda3'
const wall = '#fbf6ee', wallLine = '#9c8a74', roof = '#d99a7c', roofLine = '#a5634a'
const towerFill = '#e8ecef', towerLine = '#8796a3'

/* ---------- Pieces of the route ---------- */

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M-14 4C-22 4 -22 -8 -13 -8C-12 -16 0 -18 4 -10C12 -14 20 -6 15 2C18 8 8 10 4 6C-2 10 -10 9 -14 4Z" fill="#f4f6f8" stroke="#b9c3cc" strokeWidth="1.4" />
}
/** Power station: two cooling towers and a building with a chimney. (x, y) = bottom-left, about 100 wide. */
function PowerStation({ x, y, dim = false, down = false }: { x: number; y: number; dim?: boolean; down?: boolean }) {
  const tower = (cx: number, w: number, h: number) => <path d={`M${cx - w / 2} ${y}C${cx - w / 2 + 8} ${y - h * .55} ${cx - w / 2 + 10} ${y - h * .7} ${cx - w / 2 + 6} ${y - h}H${cx + w / 2 - 6}C${cx + w / 2 - 10} ${y - h * .7} ${cx + w / 2 - 8} ${y - h * .55} ${cx + w / 2} ${y}Z`} fill={towerFill} stroke={towerLine} strokeWidth="2" />
  return <g opacity={dim ? faded : 1}>
    {!down && <><Cloud x={x + 22} y={y - 72} s={.9} /><Cloud x={x + 56} y={y - 80} s={1} /></>}
    {tower(x + 22, 34, 56)}
    {tower(x + 56, 36, 62)}
    <path d={`M${x + 72} ${y}V${y - 34}H${x + 104}V${y}Z`} fill="#e3d9cd" stroke={wallLine} strokeWidth="2" />
    <path d={`M${x + 92} ${y - 34}V${y - 66}H${x + 99}V${y - 34}`} fill="#d5cbbf" stroke={wallLine} strokeWidth="2" />
    <rect x={x + 78} y={y - 24} width={9} height={9} rx="2" fill={P.light} stroke={wallLine} strokeWidth="1.2" />
  </g>
}
/** A transformer: a rounded grey box with two coil symbols. No words, so it can appear unlabelled in a question. */
function Transformer({ x, y, on = true, glow }: { x: number; y: number; on?: boolean; glow?: string }) {
  const coil = (cx: number, sweep: 0 | 1) => <path d={`M${cx} ${y - 40}${'a4.5 4.5 0 0 SWEEP 0 9'.replace('SWEEP', String(sweep)).repeat(4)}`} fill="none" stroke={ink} strokeWidth="1.8" />
  return <g opacity={on ? 1 : faded}>
    {glow && <rect x={x - 30} y={y - 58} width={60} height={62} rx="14" fill={glow} opacity=".55" />}
    <rect x={x - 22} y={y - 50} width={44} height={50} rx="9" fill={steelFill} stroke={steel} strokeWidth="2.2" />
    <path d={`M${x - 3} ${y - 44}V${y - 6}M${x + 3} ${y - 44}V${y - 6}`} stroke={steel} strokeWidth="1.8" />
    {coil(x - 10, 0)}
    {coil(x + 10, 1)}
  </g>
}
/** A lattice pylon, base centred at (x, y), height h. Returns nothing but draws the tower. */
function Pylon({ x, y, h = 110, on = true }: { x: number; y: number; h?: number; on?: boolean }) {
  const top = y - h
  return <g opacity={on ? 1 : faded} stroke={towerLine} strokeWidth="2" fill="none">
    <path d={`M${x - 16} ${y}L${x - 4} ${top + 8}H${x + 4}L${x + 16} ${y}`} />
    <path d={`M${x - 13} ${y - 20}L${x + 10} ${y - 46}M${x + 13} ${y - 20}L${x - 10} ${y - 46}M${x - 9} ${y - 56}L${x + 7} ${y - 78}M${x + 9} ${y - 56}L${x - 7} ${y - 78}`} strokeWidth="1.3" />
    <path d={`M${x - 26} ${top + 26}H${x + 26}M${x - 20} ${top + 44}H${x + 20}`} strokeWidth="2.2" />
    <path d={`M${x} ${top + 8}V${top}`} />
  </g>
}
/** A house with a pitched roof; (x, y) bottom-left, 46 wide. `lit` gives warm windows. */
function House({ x, y, lit = false, s = 1 }: { x: number; y: number; lit?: boolean; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0V-34H46V0Z" fill={wall} stroke={wallLine} strokeWidth="2" />
    <path d="M-6 -32L23 -56L52 -32Q23 -36 -6 -32Z" fill={roof} stroke={roofLine} strokeWidth="2" />
    <rect x={7} y={-26} width={12} height={11} rx="2" fill={lit ? P.light : '#dfe9f0'} stroke={wallLine} strokeWidth="1.3" />
    <rect x={27} y={-22} width={11} height={22} rx="2" fill="#e2c9a8" stroke={wallLine} strokeWidth="1.3" />
  </g>
}
function Factory({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x} ${y}V${y - 26}L${x + 16} ${y - 38}V${y - 26}L${x + 32} ${y - 38}V${y - 26}L${x + 48} ${y - 38}V${y}Z`} fill="#e6e9ee" stroke="#7a8796" strokeWidth="2" />
    <path d={`M${x + 38} ${y - 34}V${y - 60}H${x + 45}V${y - 36}`} fill="#d5dbe2" stroke="#7a8796" strokeWidth="2" />
    <rect x={x + 7} y={y - 18} width={10} height={9} rx="2" fill={P.light} stroke="#7a8796" strokeWidth="1.2" />
  </g>
}

/* ---------- The route picture ---------- */

const GY = 218 // ground level
const PS_X = 6, SU_X = 140, SD_X = 400, PYLONS = [200, 272, 344]
type Part = 'station' | 'up' | 'cables' | 'down' | 'homes'
function Route({ on, title, children, cableColour, glowUp, glowDown, hot = false, viewBox }: { on: Part[]; title: string; children?: ReactNode; cableColour?: string; glowUp?: string; glowDown?: string; hot?: boolean; viewBox?: string }) {
  const o = (p: Part) => on.includes(p)
  const top = GY - 110 + 26, top2 = GY - 110 + 44
  const sag = (x1: number, x2: number, y: number) => `M${x1} ${y}Q${(x1 + x2) / 2} ${y + 16} ${x2} ${y}`
  const cable = cableColour ?? ink
  return <PhysicsDiagram title={title} viewBox={viewBox}>
    <path d={`M0 ${GY}Q140 ${GY - 4} 270 ${GY}T540 ${GY}V${GY + 24}H0Z`} fill={ground} stroke="none" />
    <path d={`M0 ${GY}Q140 ${GY - 4} 270 ${GY}T540 ${GY}`} stroke={groundLine} strokeWidth="2" fill="none" />
    <PowerStation x={PS_X} y={GY} dim={!o('station')} />
    {/* short links: station → step-up, step-down → homes */}
    <path d={`M${PS_X + 104} ${GY - 22}H${SU_X - 22}`} stroke={ink} strokeWidth="2.4" opacity={o('station') || o('up') ? 1 : faded} />
    <Transformer x={SU_X} y={GY} on={o('up')} glow={glowUp} />
    {/* transmission cables on the pylons */}
    <g opacity={o('cables') ? 1 : faded}>
      {PYLONS.map(x => <Pylon key={x} x={x} y={GY} />)}
      <g stroke={cable} strokeWidth={hot ? 4 : 2.2} fill="none">
        <path d={`M${SU_X + 22} ${GY - 40}Q${(SU_X + PYLONS[0]) / 2} ${top + 4} ${PYLONS[0] - 26} ${top}`} />
        {[0, 1].map(i => <path key={i} d={sag(PYLONS[i] - 26, PYLONS[i + 1] - 26, top)} />)}
        {[0, 1].map(i => <path key={`b${i}`} d={sag(PYLONS[i] + 26, PYLONS[i + 1] + 26, top)} />)}
        {[0, 1].map(i => <path key={`c${i}`} d={sag(PYLONS[i] - 20, PYLONS[i + 1] - 20, top2)} />)}
        <path d={`M${PYLONS[2] + 26} ${top}Q${(PYLONS[2] + SD_X) / 2} ${top + 4} ${SD_X - 22} ${GY - 40}`} />
      </g>
    </g>
    <Transformer x={SD_X} y={GY} on={o('down')} glow={glowDown} />
    <path d={`M${SD_X + 22} ${GY - 22}H${SD_X + 34}`} stroke={ink} strokeWidth="2.4" opacity={o('down') || o('homes') ? 1 : faded} />
    <g opacity={o('homes') ? 1 : faded}>
      <Factory x={430} y={GY} />
      <House x={486} y={GY} lit />
      <path d={`M${SD_X + 34} ${GY - 22}H${430}`} stroke={ink} strokeWidth="2.4" />
    </g>
    {children}
  </PhysicsDiagram>
}

/** A numbered circle. `solid` fills it (the step in focus). */
function Num({ n, x, y, solid = false }: { n: number; x: number; y: number; solid?: boolean }) {
  return <g><circle cx={x} cy={y} r="12.5" fill={solid ? P.pd : 'white'} stroke={solid ? P.pd : ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={solid ? 'white' : ink}>{n}</text></g>
}
/** A small vertical pd meter: `level` 0–1, with an arrow up or down beside it. */
function PdMeter({ x, y, level, dir, label }: { x: number; y: number; level: number; dir: 'up' | 'down'; label: string[] }) {
  const h = 54
  return <g>
    <rect x={x} y={y} width={16} height={h} rx="8" fill="white" stroke={P.pd} strokeWidth="1.8" />
    <rect x={x + 3} y={r1(y + 3 + (h - 6) * (1 - level))} width={10} height={r1((h - 6) * level)} rx="5" fill={P.pd} opacity=".75" />
    <Arrow from={[x + 30, dir === 'up' ? y + h - 6 : y + 6]} to={[x + 30, dir === 'up' ? y + 4 : y + h - 4]} colour={P.pd} width={2.6} />
    <Lines x={x + 44} y={y + 20} lines={label} size={13} colour={P.pd} />
  </g>
}

/* ---------- Section 2: what the grid is ---------- */

// A simplified outline of Great Britain, from rough coastline points (longitude, latitude), smoothed.
const GB: [number, number][] = [
  [-5.0, 58.6], [-3.4, 58.67], [-3.05, 58.45], [-4.1, 57.6], [-2.0, 57.68], [-1.8, 57.45], [-2.1, 57.1], [-2.9, 56.5], [-2.6, 56.3], [-3.2, 56.05],
  [-2.5, 56.0], [-2.0, 55.75], [-1.45, 55.0], [-0.6, 54.5], [-0.1, 54.1], [0.1, 53.6], [0.35, 53.15], [0.2, 52.9], [0.9, 52.95], [1.7, 52.6],
  [1.6, 52.1], [1.1, 51.8], [0.6, 51.5], [1.4, 51.35], [1.2, 51.1], [0.9, 50.9], [-0.2, 50.8], [-1.3, 50.75], [-2.4, 50.6], [-3.5, 50.25],
  [-4.4, 50.35], [-5.2, 50.0], [-5.7, 50.1], [-4.6, 50.95], [-3.4, 51.2], [-2.7, 51.55], [-3.3, 51.45], [-4.2, 51.55], [-5.2, 51.8], [-4.2, 52.3],
  [-4.1, 52.75], [-4.7, 52.85], [-4.3, 53.3], [-3.1, 53.35], [-3.0, 53.85], [-3.3, 54.2], [-3.6, 54.5], [-3.2, 54.95], [-4.4, 54.75], [-4.9, 54.7],
  [-5.0, 55.0], [-4.7, 55.5], [-4.9, 55.9], [-5.5, 55.5], [-5.6, 56.1], [-5.5, 56.5], [-6.1, 56.7], [-5.7, 57.3], [-5.8, 57.8], [-5.2, 58.2],
]
function gbPath(ox: number, oy: number, k: number) {
  const pts: Pt[] = GB.map(([lon, lat]) => [r1(ox + (lon + 6) * k * 0.59), r1(oy + (58.8 - lat) * k)])
  const n = pts.length
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n]
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`
  }
  return d + 'Z'
}
function MiniStation({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 9} ${y + 7}C${x - 6} ${y} ${x - 6} ${y - 3} ${x - 7} ${y - 8}H${x + 1}C${x} ${y - 3} ${x} ${y} ${x + 3} ${y + 7}Z`} fill={towerFill} stroke={towerLine} strokeWidth="1.5" /><rect x={x + 3} y={y - 1} width={8} height={8} rx="1.5" fill="#e3d9cd" stroke={wallLine} strokeWidth="1.4" /></g>
}
function Network() {
  const k = 26, ox = 70, oy = 22
  const at = (lon: number, lat: number): Pt => [r1(ox + (lon + 6) * k * 0.59), r1(oy + (58.8 - lat) * k)]
  const stations = [at(-3.2, 56.6), at(-2.0, 54.3), at(-1.0, 53.4), at(-3.5, 52.3), at(0.3, 51.8), at(-2.6, 51.0)]
  const towns = [at(-4.2, 57.4), at(-3.3, 55.9), at(-4.3, 55.8), at(-1.6, 54.9), at(-2.3, 53.5), at(-1.5, 53.8), at(-1.9, 52.5), at(-1.2, 52.9), at(-0.1, 51.5), at(-2.6, 51.45), at(-3.2, 51.5), at(1.2, 52.6), at(-1.4, 50.9), at(-3.5, 50.7), at(-2.9, 53.4)]
  const links: [Pt, Pt][] = []
  const all = [...stations, ...towns]
  all.forEach((p, i) => {
    const near = all.map((q, j) => [Math.hypot(q[0] - p[0], q[1] - p[1]), j]).filter(([, j]) => j !== i).sort((a, b) => a[0] - b[0]).slice(0, 2)
    near.forEach(([, j]) => { if (j > i || !near.length) links.push([p, all[j]]) ; else links.push([all[j], p]) })
  })
  return <PhysicsDiagram title="A simplified map of Great Britain. Power stations and towns are joined by a web of cables and transformers: the National Grid.">
    <path d={gbPath(ox, oy, k)} fill="#eef5ea" stroke={P.plantLine} strokeWidth="2" />
    <g stroke={power} strokeWidth="1.8" opacity=".85">{links.map(([a, b], i) => <path key={i} d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`} />)}</g>
    {towns.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4.2" fill="white" stroke={ink} strokeWidth="1.8" />)}
    {stations.map(([x, y], i) => <MiniStation key={i} x={x - 1} y={y} />)}
    <Lines x={290} y={70} lines={['The National Grid']} size={17} />
    <Lines x={290} y={96} lines={['a giant system of cables and', 'transformers covering', 'Great Britain']} size={14} weight={600} colour={muted} />
    <g transform="translate(292 176)">
      <MiniStation x={8} y={0} /><text x={30} y={5} fontSize="13" fontWeight="650" fill={ink}>power station</text>
      <circle cx={8} cy={28} r="4.2" fill="white" stroke={ink} strokeWidth="1.8" /><text x={30} y={33} fontSize="13" fontWeight="650" fill={ink}>town (consumers)</text>
      <path d="M-2 56H18" stroke={power} strokeWidth="2.2" /><text x={30} y={61} fontSize="13" fontWeight="650" fill={ink}>cables</text>
    </g>
  </PhysicsDiagram>
}

function Consumers() {
  return <Route on={['station', 'up', 'cables', 'down', 'homes']} title="The route of the National Grid: electrical power is carried from a power station on the left to consumers, homes and a factory, on the right.">
    <Arrow from={[60, 52]} to={[500, 52]} colour={power} width={3.4} />
    <Lines x={280} y={40} anchor="middle" lines={['electrical power']} colour={power} size={14} />
    <Lines x={58} y={GY + 44} anchor="middle" lines={['power station']} size={14} />
    <Lines x={536} y={GY + 44} anchor="end" lines={['consumers']} size={14} />
    <Lines x={536} y={GY + 62} anchor="end" lines={['anyone using electricity']} size={12} weight={600} colour={muted} />
  </Route>
}
function Parts() {
  return <Route on={['up', 'cables', 'down']} cableColour={power} title="The two main parts of the grid: the cables carry the electrical power, and the transformers change the potential difference.">
    <Lines x={272} y={46} anchor="middle" lines={['cables carry the power']} colour={power} size={14} />
    <Leader from={[272, 54]} to={[236, 130]} colour={power} />
    <Lines x={270} y={GY + 46} anchor="middle" lines={['transformers change the pd']} colour={P.pd} size={14} />
    <Leader from={[190, GY + 32]} to={[SU_X + 12, GY - 6]} colour={P.pd} />
    <Leader from={[350, GY + 32]} to={[SD_X - 12, GY - 6]} colour={P.pd} />
  </Route>
}

/* ---------- Section 3: demand ---------- */

const DF: GraphFrame = { x: 80, y: 56, width: 400, height: 170, xMax: 24, yMax: 10 }
const DEMAND: Pt[] = [[0, 4], [2, 3.2], [4, 2.9], [6, 3.6], [8, 6.6], [10, 6.0], [12, 6.2], [14, 5.9], [16, 6.4], [18, 8.6], [20, 7.6], [22, 5.6], [24, 4.2]]
function smoothGraph(s: ReturnType<typeof graphScale>, pts: Pt[], lift = 0) {
  const p = pts.map(([vx, vy]) => s.pt(vx, vy + lift))
  let d = `M${p[0][0]} ${p[0][1]}`
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)]
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`
  }
  return d
}
function Kettle({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-12 10C-14 -2 -10 -10 0 -10C10 -10 14 -2 12 10Z" fill="#dfe9f0" stroke={steel} strokeWidth="1.8" />
    <path d="M12 0l8 -6" stroke={steel} strokeWidth="2.4" /><path d="M-6 -10q6 -8 12 0" stroke={steel} strokeWidth="1.8" fill="none" />
    <path d="M18 -12q3 -5 0 -9M23 -12q3 -5 0 -9" stroke={P.waterLine} strokeWidth="1.6" fill="none" />
  </g>
}
function Lamp({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <circle cx={0} cy={-8} r={14} fill={P.light} opacity=".6" />
    <path d="M-9 -2L-5 -16H5L9 -2Z" fill="#fff3c9" stroke={P.lightLine} strokeWidth="1.6" />
    <path d="M0 -2V10M-7 11H7" stroke={steel} strokeWidth="2" />
  </g>
}
function DemandGraph({ supply = false }: { supply?: boolean }) {
  const s = graphScale(DF)
  const times = [[0, 'midnight'], [6, '6 am'], [12, 'noon'], [18, '6 pm'], [24, 'midnight']] as const
  return <PhysicsDiagram schematic={false} title={supply ? 'Demand for electricity through one day, with a second line for the electricity produced by power stations, which follows the demand as it rises and falls.' : 'Demand for electricity through one day: low at night, a rise in the morning, and the highest peak in the evening. Schematic, no values.'}>
    <GraphAxes frame={DF} xLabel="" yLabel="Demand" xTicks={[]} yTicks={[]} origin={false} />
    <text x={DF.x + DF.width} y={DF.y + DF.height + 42} textAnchor="end" fontSize="13" fontWeight="700" fill={ink}>Time of day</text>
    {times.map(([t, name]) => <g key={t}><path d={`M${s.x(t)} ${DF.y + DF.height}v5`} stroke={ink} strokeWidth="1.5" /><text x={s.x(t)} y={DF.y + DF.height + 19} textAnchor="middle" fontSize="12" fill={muted}>{name}</text></g>)}
    {supply && <path d={smoothGraph(s, DEMAND, 0.35)} stroke={P.useful} strokeWidth="3" fill="none" strokeDasharray="8 6" />}
    <path d={smoothGraph(s, DEMAND)} stroke={ink} strokeWidth="3.2" fill="none" />
    <Kettle x={s.x(8) - 14} y={s.y(6.6) - 26} />
    <Lamp x={s.x(18) + 2} y={s.y(8.6) - 18} />
    {!supply && <g>
      <Lines x={s.x(3.4)} y={s.y(2.9) + 30} anchor="middle" lines={['low at night']} size={13} weight={650} colour={muted} />
      <Lines x={s.x(8) - 32} y={s.y(6.6) - 20} anchor="end" lines={['breakfast']} size={13} weight={650} colour={muted} />
      <Lines x={s.x(18) + 28} y={s.y(8.6) - 10} lines={['dark evening:', 'highest']} size={13} weight={650} colour={muted} />
    </g>}
    {supply && <g>
      <path d={`M${s.x(11)} ${s.y(2.6)}h34`} stroke={P.useful} strokeWidth="3" strokeDasharray="8 6" />
      <text x={s.x(11) + 44} y={s.y(2.6) + 5} fontSize="13" fontWeight="700" fill={P.useful}>electricity produced</text>
      <path d={`M${s.x(11)} ${s.y(1.2)}h34`} stroke={ink} strokeWidth="3.2" />
      <text x={s.x(11) + 44} y={s.y(1.2) + 5} fontSize="13" fontWeight="700" fill={ink}>demand</text>
    </g>}
  </PhysicsDiagram>
}
function Spare() {
  const bars = [{ x: 90, level: .62 }, { x: 210, level: .55 }, { x: 330, level: .68 }]
  const top = 62, bottom = 214, h = bottom - top
  return <PhysicsDiagram title="Three power stations, each running below its maximum power output. The gap between what they make and their maximum is room to spare.">
    <path d={`M40 ${top}H384`} stroke={P.hot} strokeWidth="2" strokeDasharray="7 6" />
    <Lines x={210} y={top - 14} anchor="middle" lines={['maximum power output']} colour={P.hot} size={14} />
    {bars.map(({ x, level }, i) => <g key={i}>
      <rect x={x - 32} y={top} width={64} height={h} rx="12" fill="white" stroke={P.panelLine} strokeWidth="1.6" />
      <rect x={x - 32} y={r1(bottom - h * level)} width={64} height={r1(h * level)} rx="12" fill={P.usefulFill} stroke={P.useful} strokeWidth="1.8" />
      <g transform={`translate(${x - 22} ${bottom + 46}) scale(.42)`}><PowerStation x={0} y={0} down /></g>
    </g>)}
    <Lines x={90} y={r1(bottom - h * .62 + 28)} anchor="middle" lines={['output']} size={13} weight={650} colour={P.useful} />
    <path d={`M374 ${top + 4}V${r1(bottom - h * .68 - 4)}M368 ${top + 4}H380M368 ${r1(bottom - h * .68 - 4)}H380`} stroke={ink} strokeWidth="1.8" />
    <Lines x={392} y={96} lines={['room to spare']} size={15} />
    <Lines x={392} y={118} lines={['they can increase', 'output quickly']} size={13} weight={600} colour={muted} />
    <Lines x={210} y={288} anchor="middle" lines={['power stations']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}
function Cope() {
  return <PhysicsDiagram title="One power station shuts down without warning. The other two increase their output, so homes still have electricity.">
    {[{ x: 14, down: true }, { x: 168, down: false }, { x: 322, down: false }].map(({ x, down }) => <g key={x}>
      <PowerStation x={x} y={170} dim={down} down={down} />
      {down ? <g><CrossMark x={x + 52} y={82} s={1.2} /><Lines x={x + 52} y={206} anchor="middle" lines={['shuts down']} colour={P.wasted} size={14} /></g>
        : <g><Arrow from={[x + 122, 164]} to={[x + 122, 100]} colour={P.useful} width={4} /><Lines x={x + 60} y={206} anchor="middle" lines={['increases output']} colour={P.useful} size={14} /></g>}
    </g>)}
    <path d="M0 170H540" stroke={groundLine} strokeWidth="2" />
    <g transform="translate(0 0)"><House x={480} y={170} lit /></g>
    <Lines x={503} y={206} anchor="middle" lines={['still lit']} size={13} weight={650} colour={P.lightLine} />
    <Lines x={270} y={262} anchor="middle" lines={['Stations running below maximum can make more when needed.']} size={13} weight={600} colour={muted} />
  </PhysicsDiagram>
}

/* ---------- Section 4: why a high pd and a low current ---------- */

function Tile({ x, y, w, top, bottom, colour, fill }: { x: number; y: number; w: number; top: string; bottom: string; colour: string; fill: string }) {
  return <g><rect x={x - w / 2} y={y} width={w} height={62} rx="14" fill={fill} stroke={colour} strokeWidth="2" />
    <text x={x} y={y + 32} textAnchor="middle" fontSize="24" fontWeight="750" fill={colour}>{top}</text>
    <text x={x} y={y + 52} textAnchor="middle" fontSize="12" fontWeight="650" fill={ink}>{bottom}</text></g>
}
function Pvi() {
  return <PhysicsDiagram schematic={false} title="Power equals potential difference times current, P = V I. For the same power, if the pd goes up the current goes down.">
    <Lines x={270} y={36} anchor="middle" lines={['power = potential difference × current']} size={15} />
    <Tile x={110} y={56} w={100} top="P" bottom="power" colour={P.useful} fill={P.usefulFill} />
    <text x={178} y={96} textAnchor="middle" fontSize="24" fontWeight="700" fill={ink}>=</text>
    <Tile x={270} y={56} w={156} top="V" bottom="potential difference" colour={P.pd} fill={P.pdFill} />
    <text x={362} y={96} textAnchor="middle" fontSize="24" fontWeight="700" fill={ink}>×</text>
    <Tile x={430} y={56} w={100} top="I" bottom="current" colour={power} fill="#fbe3d8" />
    {/* see-saw: V side up, I side down, P fixed */}
    <path d="M270 209L254 236H286Z" fill={P.usefulFill} stroke={P.useful} strokeWidth="2" />
    <text x={270} y={256} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.useful}>same power</text>
    <path d="M150 196L390 214" stroke={ink} strokeWidth="5" />
    <Chip2 x={156} y={180} text="V up" colour={P.pd} />
    <Chip2 x={384} y={198} text="I down" colour={power} />
    <Arrow from={[108, 204]} to={[108, 168]} colour={P.pd} width={3} />
    <Arrow from={[432, 186]} to={[432, 224]} colour={power} width={3} />
  </PhysicsDiagram>
}
function Chip2({ x, y, text, colour }: { x: number; y: number; text: string; colour: string }) {
  const w = text.length * 9 + 24
  return <g><rect x={x - w / 2} y={y - 18} width={w} height={28} rx="14" fill="white" stroke={colour} strokeWidth="2" /><text x={x} y={y + 1} textAnchor="middle" fontSize="14" fontWeight="750" fill={colour}>{text}</text></g>
}
/** A cable span between two posts, with current arrows and heat waves. */
function Span({ y, thick, current, heat, on = true }: { y: number; thick: number; current: 'high' | 'low'; heat: number; on?: boolean }) {
  const waves = heat === 1 ? [270] : Array.from({ length: heat }, (_, i) => 130 + i * (280 / (heat - 1)))
  const cableY = (x: number) => { const t = (x - 66) / 408; return y - 18 + 48 * t * (1 - t) / 2 }
  return <g opacity={on ? 1 : faded}>
    <rect x={52} y={y - 26} width={14} height={60} rx="4" fill={towerFill} stroke={towerLine} strokeWidth="2" />
    <rect x={474} y={y - 26} width={14} height={60} rx="4" fill={towerFill} stroke={towerLine} strokeWidth="2" />
    <path d={`M66 ${y - 18}Q270 ${y + 6} 474 ${y - 18}`} stroke={current === 'high' ? '#c9a08f' : '#9fb0bd'} strokeWidth={thick + 4} fill="none" />
    <path d={`M66 ${y - 18}Q270 ${y + 6} 474 ${y - 18}`} stroke={current === 'high' ? P.hot : '#6f8596'} strokeWidth={thick} fill="none" opacity=".85" />
    {(current === 'high' ? [120, 250, 380] : [250]).map(x => <Arrow key={x} from={[x - (current === 'high' ? 28 : 14), y + 18]} to={[x + (current === 'high' ? 28 : 14), y + 18]} colour={power} width={current === 'high' ? 4.2 : 2.2} />)}
    {waves.map((x, i) => <path key={i} d={heat > 2 ? `M${r1(x)} ${r1(cableY(x) - 10)}c-6 -7 6 -11 0 -18s6 -11 0 -18` : `M${r1(x)} ${r1(cableY(x) - 10)}c-4 -5 4 -8 0 -13`} stroke={P.hot} strokeWidth="2.2" fill="none" opacity={heat > 2 ? 1 : .7} />)}
  </g>
}
function Cables({ show }: { show: 'hot' | 'cool' | 'both' }) {
  const both = show === 'both'
  const hotY = both ? 96 : 140, coolY = both ? 222 : 140
  const title = show === 'hot' ? 'A cable carrying a high current heats up: lots of energy is lost to the thermal energy store of the surroundings.'
    : show === 'cool' ? 'At a very high pd the current is low, so the cable heats up much less and little energy is lost.'
      : 'Two cables carrying the same power. Low pd and high current: a hot cable and lots of energy wasted. High pd and low current: a cool cable and little energy wasted.'
  return <PhysicsDiagram title={title}>
    {show !== 'cool' && <g>
      <Span y={hotY} thick={9} current="high" heat={5} />
      <Lines x={both ? 270 : 270} y={hotY + 58} anchor="middle" lines={[both ? 'low pd, high current: hot cable, lots wasted' : 'high current']} colour={both ? P.hot : power} size={14} />
      {!both && <EnergyStoreBadge store="thermal" x={270} y={60} label="Thermal store of the surroundings" />}
      {!both && <Lines x={270} y={232} anchor="middle" lines={['the cable heats up: energy is wasted']} size={14} weight={650} colour={muted} />}
    </g>}
    {show !== 'hot' && <g>
      <Span y={coolY} thick={5} current="low" heat={1} />
      <Lines x={270} y={coolY + 58} anchor="middle" lines={[both ? 'high pd, low current: cool cable, little wasted' : 'low current']} colour={both ? P.useful : power} size={14} />
      {!both && <Lines x={270} y={70} anchor="middle" lines={['very high pd']} colour={P.pd} size={16} />}
      {!both && <Lines x={270} y={232} anchor="middle" lines={['the cable stays cool: little energy is lost']} size={14} weight={650} colour={muted} />}
      {both && <TickMark x={60} y={coolY + 52} />}
    </g>}
    {both && <CrossMark x={60} y={hotY + 52} />}
  </PhysicsDiagram>
}

/* ---------- Section 5: transformers along the route ---------- */

function StepUp() {
  return <Route on={['station', 'up']} glowUp={P.pdFill} title="A step-up transformer sits between the power station and the transmission cables. It increases the pd.">
    <Lines x={SU_X} y={GY + 44} anchor="middle" lines={['step-up transformer']} colour={P.pd} size={14} />
    <PdMeter x={SU_X + 34} y={40} level={.9} dir="up" label={['pd', 'goes up']} />
  </Route>
}
function CurrentDown() {
  return <Route on={['up', 'cables']} cableColour="#6f8596" title="After the step-up transformer the current in the transmission cables is low, so the cables stay cool and little energy is lost.">
    <Arrow from={[258, 72]} to={[318, 72]} colour={power} width={2.2} />
    <Lines x={288} y={50} anchor="middle" lines={['low current: cool cables']} colour={power} size={14} />
    <Lines x={288} y={GY + 44} anchor="middle" lines={['power transmitted efficiently']} colour={P.useful} size={14} />
  </Route>
}
function StepDown() {
  return <Route on={['down', 'homes']} glowDown={P.pdFill} title="A step-down transformer near the homes brings the pd back down to a safe level. The current goes up.">
    <Lines x={SD_X - 20} y={GY + 44} anchor="middle" lines={['step-down transformer']} colour={P.pd} size={14} />
    <PdMeter x={SD_X - 34} y={40} level={.25} dir="down" label={['pd goes down:', 'safe for homes']} />
    <Lines x={SD_X - 20} y={GY + 64} anchor="middle" lines={['current goes up']} colour={power} size={13} />
  </Route>
}
function Journey() {
  const steps: [number, number, number, string][] = [[1, 66, GY + 26, 'power station'], [2, SU_X, GY + 26, 'step-up transformer'], [3, 290, 70, 'transmission cables'], [4, SD_X, GY + 26, 'step-down transformer'], [5, 500, GY + 26, 'consumers']]
  return <Route viewBox="0 0 540 350" on={['station', 'up', 'cables', 'down', 'homes']} title="The whole journey: 1 power station, 2 step-up transformer, 3 transmission cables, 4 step-down transformer, 5 consumers.">
    {steps.map(([n, x, y]) => <Num key={n} n={n} x={x} y={y} />)}
    <path d="M20 256H520" stroke={P.panelLine} strokeWidth="1.4" />
    <g transform="translate(0 280)">
      {steps.map(([n, , , name], i) => <g key={n} transform={`translate(${i < 3 ? 40 : 290} ${(i < 3 ? i : i - 3) * 28})`}>
        <Num n={n} x={12} y={0} /><text x={30} y={5} fontSize="13" fontWeight="650" fill={ink}>{name}</text>
      </g>)}
    </g>
  </Route>
}
function QRoute() {
  return <Route on={['station', 'up', 'cables', 'down', 'homes']} title="A power station, pylons and cables, and houses, with two numbered points along the route.">
    <Num n={1} x={SU_X} y={GY + 30} />
    <Num n={2} x={SD_X} y={GY + 30} />
  </Route>
}

export function GridVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'grid-network': return <Network />
    case 'grid-consumers': return <Consumers />
    case 'grid-parts': return <Parts />
    case 'grid-demand': return <DemandGraph />
    case 'grid-enough': return <DemandGraph supply />
    case 'grid-spare': return <Spare />
    case 'grid-cope': return <Cope />
    case 'grid-pvi': return <Pvi />
    case 'grid-hotcable': return <Cables show="hot" />
    case 'grid-highpd': return <Cables show="cool" />
    case 'grid-compare': return <Cables show="both" />
    case 'grid-stepup': return <StepUp />
    case 'grid-currentdown': return <CurrentDown />
    case 'grid-stepdown': return <StepDown />
    case 'grid-journey': return <Journey />
    case 'grid-q-route': return <QRoute />
    default: return null
  }
}
