import { useId, type ReactNode } from 'react'
import { Arrow, Badge, Diagram, Label, blob } from './InfectionVisuals'
import { leafPath, plantPalette as P } from './PlantOrganisationVisuals'

// Chapter B4 (Lessons 32–34): rate of photosynthesis, respiration, exercise and metabolism. Original, code-native schematics. Not to scale.
// Focus ids start with 'energy-'. Same colour code as the photosynthesis lesson (EnergyVisuals.tsx): yellow = light and energy,
// purple = carbon dioxide, blue = water, amber = glucose and food, teal = oxygen, green = plant tissue. New here: orange = temperature,
// brick = lactic acid, slate = ethanol, rose = muscle. Molecules are simple glyphs, not real structures.
type Pt = [number, number]
const ink = P.ink, teal = '#2f9c95', tealFill = '#d5efec', co2 = P.purple, co2Fill = '#e9e0f6', h2o = P.blue, h2oFill = '#dcf0f8'
const sugar = P.amber, sugarFill = P.amberFill, sunFill = '#f6d25e', sunLine = '#c9951c', lightInk = '#a77c12'
const warm = '#cf6a33', warmFill = '#fbe1d1', lactic = '#b4533a', lacticFill = '#f6dcd2', ethanol = '#5d6d93', ethanolFill = '#e2e7f2'
const muscle = '#c96f68', muscleFill = '#f4d3cc', skin = '#f1dcc8', skinLine = '#b9906f', panel = '#f7fafc', panelLine = '#cfdde7'
const faded = .3

// ---------- Glyphs (drawn like the photosynthesis lesson's, so the chapter matches) ----------
function CO2({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g>{[-9, 9].map(d => <circle key={d} cx={x + d * s} cy={y} r={5.5 * s} fill={co2Fill} stroke={co2} strokeWidth={1.6} />)}<circle cx={x} cy={y} r={5 * s} fill={co2} /></g>
}
function H2O({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g><circle cx={x} cy={y} r={6.5 * s} fill={h2oFill} stroke={h2o} strokeWidth={1.6} />{[-1, 1].map(d => <circle key={d} cx={x + d * 7.5 * s} cy={y + 5.5 * s} r={3.6 * s} fill="white" stroke={h2o} strokeWidth={1.4} />)}</g>
}
function O2({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g>{[-4.5, 4.5].map(d => <circle key={d} cx={x + d * s} cy={y} r={5.5 * s} fill={tealFill} stroke={teal} strokeWidth={1.6} />)}</g>
}
function hexPath(x: number, y: number, r: number) { return Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 6 + i * Math.PI / 3; return `${i ? 'L' : 'M'}${(x + Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r).toFixed(1)}` }).join('') + 'Z' }
function Glucose({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path d={hexPath(x, y, 8 * s)} fill={sugarFill} stroke={sugar} strokeWidth="2" strokeLinejoin="round" />
}
// Lactic acid: half a glucose hexagon, because the glucose is only partly broken down.
function Lactic({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const r = 8 * s, h = r * Math.sqrt(3) / 2
  return <path d={`M${x - r} ${y + h / 2}L${x - r / 2} ${y - h / 2}L${x + r / 2} ${y - h / 2}L${x + r} ${y + h / 2}Z`} fill={lacticFill} stroke={lactic} strokeWidth="2" strokeLinejoin="round" />
}
function Ethanol({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g><path d={`M${x - 6 * s} ${y + 3 * s}L${x + 6 * s} ${y - 3 * s}`} stroke={ethanol} strokeWidth="2" />{[-6, 6].map(d => <circle key={d} cx={x + d * s} cy={y - d * s / 2} r={5 * s} fill={ethanolFill} stroke={ethanol} strokeWidth="1.6" />)}</g>
}
function Spark({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return <path transform={`translate(${x} ${y}) scale(${k})`} d="M0 -12l-6 11h6l-4 12l11 -15h-6l4 -8z" fill={sunFill} stroke={sunLine} strokeWidth="1.2" strokeLinejoin="round" />
}
function Zoom({ cx, cy, r, children, fill = '#f6fbf4' }: { cx: number; cy: number; r: number; children: ReactNode; fill?: string }) {
  const id = useId().replace(/:/g, '')
  return <g><clipPath id={id}><circle cx={cx} cy={cy} r={r - 1} /></clipPath><circle cx={cx} cy={cy} r={r} fill={fill} stroke={ink} strokeWidth="2" /><g clipPath={`url(#${id})`}>{children}</g></g>
}
function SunIcon({ x, y, r = 12, dim = false }: { x: number; y: number; r?: number; dim?: boolean }) {
  return <g opacity={dim ? .55 : 1}><circle cx={x} cy={y} r={r} fill={dim ? '#f8e7a8' : sunFill} stroke={sunLine} strokeWidth="1.6" />{Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return <path key={i} d={`M${x + Math.cos(a) * (r + 4)} ${y + Math.sin(a) * (r + 4)}L${x + Math.cos(a) * (r + 9)} ${y + Math.sin(a) * (r + 9)}`} stroke={sunLine} strokeWidth="2" strokeLinecap="round" /> })}</g>
}
function Thermometer({ x, y, level = .6, h = 46 }: { x: number; y: number; level?: number; h?: number }) {
  return <g><rect x={x - 5} y={y - h} width={10} height={h} rx="5" fill="white" stroke={ink} strokeWidth="1.6" /><rect x={x - 2} y={y - 4 - (h - 8) * level} width={4} height={(h - 8) * level + 6} fill={warm} /><circle cx={x} cy={y + 5} r="8" fill={warm} stroke={ink} strokeWidth="1.6" /></g>
}
function Clock({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  return <g><circle cx={x} cy={y} r={r} fill="white" stroke={ink} strokeWidth="1.8" /><path d={`M${x} ${y}V${y - r * .65}M${x} ${y}L${x + r * .5} ${y + r * .2}`} stroke={ink} strokeWidth="1.8" strokeLinecap="round" /></g>
}
function Mito({ x, y, a = 0, k = 1 }: { x: number; y: number; a?: number; k?: number }) {
  return <g transform={`rotate(${a} ${x} ${y})`}><ellipse cx={x} cy={y} rx={16 * k} ry={8 * k} fill="#f3d6cc" stroke="#b86e57" strokeWidth="1.4" /><path d={`M${x - 11 * k} ${y}q${3 * k} ${-5 * k} ${6 * k} 0t${6 * k} 0t${6 * k} 0t${5 * k} 0`} stroke="#b86e57" strokeWidth="1.2" fill="none" /></g>
}
function Tag({ x, y, text, colour, fill = 'white', anchor = 'start' }: { x: number; y: number; text: string; colour: string; fill?: string; anchor?: 'start' | 'middle' }) {
  const w = text.length * 7.2 + 16, left = anchor === 'middle' ? x - w / 2 : x
  return <g><rect x={left} y={y - 15} width={w} height={22} rx="11" fill={fill} stroke={colour} strokeWidth="1.8" /><text x={left + w / 2} y={y + 1} textAnchor="middle" fill={colour} fontSize="12.5" fontWeight="700">{text}</text></g>
}
function Card({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children?: ReactNode }) {
  return <g><rect x={x} y={y} width={w} height={h} rx="10" fill={panel} stroke={panelLine} strokeWidth="1.6" />{children}</g>
}
// A numbered walkthrough step, as in the plant transport lesson: the current step is filled, the others fade.
function Step({ n, x, y, lines, on, current, colour = ink }: { n: number; x: number; y: number; lines: string[]; on: boolean; current: boolean; colour?: string }) {
  return <g opacity={on ? 1 : .45}><circle cx={x} cy={y} r="12" fill={current ? colour : 'white'} stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={current ? 'white' : ink}>{n}</text>
    <Label x={x + 20} y={y - 2} lines={lines} strong={current} /></g>
}

// ---------- Graph helpers ----------
type Axes = { x0: number; y0: number; w: number; h: number }
function GraphAxes({ g, xLabel, yLabel = 'rate of photosynthesis', ticks }: { g: Axes; xLabel: string; yLabel?: string; ticks?: Array<[number, string]> }) {
  return <g>
    <path d={`M${g.x0} ${g.y0 - g.h}V${g.y0}H${g.x0 + g.w}`} stroke={ink} strokeWidth="2" fill="none" />
    <text transform={`translate(${g.x0 - 14} ${g.y0 - g.h / 2}) rotate(-90)`} textAnchor="middle" fill={ink} fontSize="12.5">{yLabel}</text>
    {ticks?.map(([t, s]) => <g key={s}><path d={`M${g.x0 + t * g.w} ${g.y0}v6`} stroke={ink} /><text x={g.x0 + t * g.w} y={g.y0 + 19} textAnchor="middle" fill={ink} fontSize="12">{s}</text></g>)}
    <text x={g.x0 + g.w / 2} y={g.y0 + (ticks ? 38 : 20)} textAnchor="middle" fill={ink} fontSize="12.5">{xLabel}</text>
  </g>
}
// Rate rises in a straight line, bends, then levels off. Returned as two pieces so either can be highlighted.
function plateau(g: Axes) {
  const { x0, y0, w, h } = g, bend: Pt = [x0 + w * .62, y0 - h * .8]
  return {
    rise: `M${x0} ${y0}L${x0 + w * .36} ${y0 - h * .6}C${x0 + w * .45} ${y0 - h * .74} ${x0 + w * .52} ${y0 - h * .8} ${bend[0]} ${bend[1]}`,
    flat: `M${bend[0]} ${bend[1]}L${x0 + w} ${y0 - h * .8}`,
    at: (t: number): Pt => t <= .36 ? [x0 + w * t, y0 - h * .6 * t / .36] : t >= .62 ? [x0 + w * t, y0 - h * .8] : [x0 + w * t, y0 - h * (.6 + .2 * Math.sin((t - .36) / .26 * Math.PI / 2))],
  }
}
function Curve({ d, colour, on = true }: { d: string; colour: string; on?: boolean }) {
  return <path d={d} stroke={colour} strokeWidth={on ? 4 : 3} fill="none" strokeLinecap="round" opacity={on ? 1 : faded} />
}

// ---------- Lesson 32, section 1: what holds photosynthesis back ----------
const LEAF = { node: [236, 150] as Pt, angle: 0, length: 160, width: 54 }
const SUPPLY: Array<{ key: 'light' | 'co2' | 'temp'; y: number; name: string; colour: string }> = [
  { key: 'light', y: 70, name: 'light intensity', colour: lightInk }, { key: 'co2', y: 150, name: 'carbon dioxide', colour: co2 }, { key: 'temp', y: 230, name: 'temperature', colour: warm },
]
function LimitScene({ focus }: { focus: string }) {
  const step = focus.replace('energy-limit-', '')
  const low = step === 'limiting' ? 'light' : ''
  const level = (k: string) => k === low ? .22 : k === 'light' ? .86 : k === 'co2' ? .8 : .74
  const rate = step === 'limiting' || step === 'chlorophyll' ? .26 : .72
  const leaf = leafPath(LEAF)
  const titles: Record<string, string> = {
    rate: 'A leaf takes in its supplies and makes glucose and oxygen. A gauge on the right shows the rate of photosynthesis: how fast glucose is made.',
    factors: 'Three supply bars feed into the leaf: light intensity, carbon dioxide and temperature. The rate gauge on the right shows how fast glucose is made.',
    limiting: 'The light bar is very short while the carbon dioxide and temperature bars are long. The rate gauge is low: light is the limiting factor, holding the rate back.',
    chlorophyll: 'All three supply bars are long, but the leaf has pale yellow patches where chlorophyll is missing. It absorbs less light, so the rate gauge is low.',
  }
  return <Diagram title={titles[step] || titles.rate}>
    <g opacity={step === 'rate' ? faded : 1}>{SUPPLY.map(s => <g key={s.key}>
      {s.key === 'light' ? <SunIcon x={34} y={s.y} r={10} dim={low === 'light'} /> : s.key === 'co2' ? <CO2 x={34} y={s.y} /> : <Thermometer x={34} y={s.y + 12} h={36} level={.55} />}
      <text x={60} y={s.y - 10} fill={s.colour} fontSize="13" fontWeight="700">{s.name}</text>
      <rect x={60} y={s.y - 2} width={120} height={14} rx="7" fill="white" stroke={panelLine} strokeWidth="1.6" />
      <rect x={60} y={s.y - 2} width={120 * level(s.key)} height={14} rx="7" fill={s.colour} opacity=".75" />
      <path d={`M188 ${s.y + 5}Q214 ${s.y + 5} 232 ${150 + (s.y - 150) * .12}`} stroke={s.colour} strokeWidth="2.2" fill="none" strokeDasharray={s.key === low ? '4 5' : undefined} />
    </g>)}</g>
    {step === 'limiting' && <Tag x={60} y={104} text="limiting factor" colour={lightInk} fill="#fff8df" />}
    <path d={leaf.outline} fill={step === 'chlorophyll' ? '#bcd99a' : '#a9d49a'} stroke={P.deepGreen} strokeWidth="2.4" /><path d={leaf.rib} stroke={P.deepGreen} strokeWidth="1.6" />
    {step === 'chlorophyll' && [[286, 132, 14, 9], [330, 164, 16, 9], [270, 164, 10, 7], [356, 138, 11, 7]].map(([x, y, rx, ry], i) => <path key={i} d={blob(x, y, rx, ry, 40 + i, .18)} fill="#ecdf8f" stroke="#c9b04a" strokeWidth="1.2" />)}
    <g opacity={step === 'factors' ? faded : 1}>
      <Arrow x1={400} y1={150} x2={446} y2={150} colour={ink} width={2.4} /><Glucose x={414} y={120} /><text x={426} y={124} fill={sugar} fontSize="12" fontWeight="700">glucose</text><O2 x={416} y={180} /><text x={428} y={184} fill={teal} fontSize="12" fontWeight="700">oxygen</text>
      <text x={500} y={30} textAnchor="middle" fill={ink} fontSize="12.5" fontWeight="700">rate</text>
      <rect x={482} y={40} width={36} height={210} rx="18" fill="white" stroke={ink} strokeWidth="2" />
      <rect x={486} y={44 + 202 * (1 - rate)} width={28} height={202 * rate} rx="14" fill={sugar} opacity=".8" />
    </g>
    {step === 'rate' && <Label x={530} y={280} anchor="end" lines={['rate: how fast glucose is made']} strong colour={sugar} />}
    {(step === 'limiting' || step === 'chlorophyll') && <Label x={530} y={280} anchor="end" lines={['rate held back']} strong colour={sugar} />}
    {step === 'chlorophyll' && <Label x={226} y={236} to={[292, 132]} lines={['less chlorophyll:', 'less light absorbed']} strong colour={P.deepGreen} />}
  </Diagram>
}

// ---------- Lesson 32, section 2: reading the light and carbon dioxide graphs ----------
const G: Axes = { x0: 70, y0: 240, w: 270, h: 190 }
function GraphScene({ focus }: { focus: string }) {
  const step = focus.replace('energy-graph-', '')
  if (step === 'both') {
    const L: Axes = { x0: 50, y0: 214, w: 190, h: 150 }, C: Axes = { x0: 320, y0: 214, w: 190, h: 150 }
    const pl = plateau(L), pc = plateau(C)
    return <Diagram title="Two graphs side by side. Left: rate of photosynthesis against light intensity. Right: rate against carbon dioxide concentration. Both rise, then level off. On the rising part, the factor on the bottom axis is limiting. On the flat part, another factor is limiting.">
      <GraphAxes g={L} xLabel="light intensity →" /><GraphAxes g={C} xLabel="carbon dioxide concentration →" />
      <Curve d={pl.rise} colour={lightInk} /><Curve d={pl.flat} colour={lightInk} /><Curve d={pc.rise} colour={co2} /><Curve d={pc.flat} colour={co2} />
      {[[L, lightInk], [C, co2]].map(([g, c], i) => { const ax = g as Axes, p = plateau(ax); return <g key={i}>
        <Label x={ax.x0 + 56} y={ax.y0 - 34} to={p.at(.24)} lines={['still rising:', 'this factor limits']} colour={c as string} />
        <Label x={ax.x0 + ax.w - 4} y={ax.y0 - ax.h + 4} anchor="end" to={p.at(.86)} lines={['flat: another', 'factor limits']} colour={ink} /></g> })}
      <text x={270} y={286} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">Plenty of light and carbon dioxide? Then temperature probably limits.</text>
    </Diagram>
  }
  const isCO2 = step === 'co2', colour = isCO2 ? co2 : lightInk, p = plateau(G)
  const onRise = step !== 'flat', onFlat = step !== 'rise'
  const titles: Record<string, string> = {
    rise: 'Graph of rate of photosynthesis against light intensity. The first part of the line rises steadily and is highlighted: here light is the limiting factor.',
    flat: 'The same graph. The line rises, then goes flat. The flat part is highlighted: more light makes no difference, so carbon dioxide or temperature is now limiting.',
    co2: 'Graph of rate of photosynthesis against carbon dioxide concentration. It has the same shape: it rises while carbon dioxide is limiting, then levels off when light or temperature is limiting.',
  }
  return <Diagram title={titles[step] || titles.rise}>
    <GraphAxes g={G} xLabel={isCO2 ? 'carbon dioxide concentration →' : 'light intensity →'} />
    <Curve d={p.rise} colour={colour} on={onRise} /><Curve d={p.flat} colour={colour} on={onFlat} />
    {step === 'rise' && <><Label x={86} y={74} to={p.at(.3)} lines={['more light,', 'faster']} strong colour={lightInk} /><Tag x={372} y={150} text="light is limiting" colour={lightInk} fill="#fff8df" /></>}
    {step === 'flat' && <><Label x={372} y={98} to={p.at(.84)} lines={['more light:', 'no faster']} strong colour={ink} /><Label x={372} y={160} lines={['now carbon dioxide', 'or temperature', 'is limiting']} strong colour={co2} /></>}
    {isCO2 && <><Label x={86} y={74} to={p.at(.3)} lines={['more carbon', 'dioxide, faster']} strong colour={co2} /><Label x={372} y={60} to={p.at(.86)} lines={['flat: light or', 'temperature limits']} strong colour={ink} /></>}
  </Diagram>
}
function GraphQuestion({ assessment }: { assessment: boolean }) {
  const p = plateau(G), pts = [.12, .3, .82].map(t => p.at(t))
  return <Diagram title={assessment ? 'Graph of rate of photosynthesis against light intensity, with three numbered points on the line: 1 and 2 on the first part, 3 further along.' : 'Graph of rate of photosynthesis against light intensity. Points 1 and 2 are on the rising part, where light is limiting. Point 3 is on the flat part, where light is no longer limiting.'}>
    <GraphAxes g={G} xLabel="light intensity →" />
    <Curve d={p.rise} colour={lightInk} /><Curve d={p.flat} colour={lightInk} />
    {pts.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="4.5" fill={ink} /><Badge n={i + 1} x={x - (i === 2 ? 0 : 22)} y={y - (i === 2 ? 28 : 4)} /></g>)}
    {!assessment && <><Label x={372} y={150} lines={['1 and 2: still rising,', 'light is limiting']} strong colour={lightInk} /><Label x={372} y={210} lines={['3: flat, light is', 'no longer limiting']} strong colour={ink} /></>}
  </Diagram>
}

// ---------- Lesson 32, section 3: temperature ----------
const TG: Axes = { x0: 70, y0: 232, w: 280, h: 180 }
const tx = (c: number) => TG.x0 + c / 50 * TG.w
const TEMP_RISE = `M${tx(0)} ${TG.y0 - 10}C${tx(14)} ${TG.y0 - 30} ${tx(25)} ${TG.y0 - 164} ${tx(33)} ${TG.y0 - 164}`
const TEMP_FALL = `M${tx(33)} ${TG.y0 - 164}C${tx(38)} ${TG.y0 - 164} ${tx(42)} ${TG.y0 - 70} ${tx(45)} ${TG.y0}L${tx(50)} ${TG.y0}`
function TempScene({ focus }: { focus: string }) {
  const step = focus.replace('energy-temp-', '')
  const titles: Record<string, string> = {
    cold: 'Graph of rate of photosynthesis against temperature from 0 to 50 °C. The left, rising part is highlighted: at low temperatures enzymes work slowly, so photosynthesis is slow.',
    hot: 'The same temperature graph. The line rises to a peak, then falls. The falling part is highlighted: when the plant is too hot, its enzymes are damaged.',
    45: 'The whole temperature graph: the rate rises, peaks, then falls to zero at about 45 °C, where photosynthesis stops.',
  }
  return <Diagram title={titles[step] || titles.cold}>
    <GraphAxes g={TG} xLabel="temperature (°C)" ticks={[0, 10, 20, 30, 40, 50].map(c => [c / 50, String(c)] as [number, string])} />
    <Curve d={TEMP_RISE} colour={warm} on={step !== 'hot'} /><Curve d={TEMP_FALL} colour={warm} on={step !== 'cold'} />
    {step === 'cold' && <><Label x={86} y={74} to={[tx(9), TG.y0 - 30]} lines={['too cold:', 'enzymes', 'work slowly']} strong colour={h2o} /><Label x={382} y={150} lines={['warmer =', 'faster']} strong colour={warm} /></>}
    {step === 'hot' && <><Label x={382} y={96} to={[tx(40.5), TG.y0 - 100]} lines={['too hot:', 'enzymes damaged']} strong colour={warm} /><Label x={382} y={160} lines={['the rate falls', 'quickly']} colour={ink} /></>}
    {step === '45' && <><circle cx={tx(45)} cy={TG.y0} r="5" fill={warm} stroke={ink} strokeWidth="1.5" /><Label x={382} y={200} to={[tx(45), TG.y0 - 2]} lines={['stops at', 'about 45 °C']} strong colour={warm} /><Label x={382} y={80} lines={['not too cold,', 'not too hot']} strong colour={ink} /></>}
  </Diagram>
}

// ---------- Lesson 32, section 4: the pondweed practical ----------
const TUBE = { x: 236, top: 110, bottom: 246, w: 34 }
function Pondweed() {
  const x = TUBE.x
  return <g>
    <path d={`M${x} 238C${x - 2} 212 ${x + 3} 186 ${x} 150`} stroke={P.deepGreen} strokeWidth="3" fill="none" strokeLinecap="round" />
    {[226, 214, 202, 190, 178, 166, 156].map((y, i) => <g key={y}><path d={`M${x} ${y}q${i % 2 ? 10 : -10} -4 ${i % 2 ? 13 : -13} -11`} stroke={P.deepGreen} strokeWidth="2.4" fill="none" strokeLinecap="round" /><path d={`M${x} ${y + 3}q${i % 2 ? -8 : 8} -3 ${i % 2 ? -11 : 11} -9`} stroke="#6fae63" strokeWidth="2.4" fill="none" strokeLinecap="round" /></g>)}
  </g>
}
function Rig({ lit, distance = true, bubbleLength = 44 }: { lit: (part: 'lamp' | 'ruler' | 'tube' | 'capillary') => boolean; distance?: boolean; bubbleLength?: number }) {
  const o = (p: 'lamp' | 'ruler' | 'tube' | 'capillary') => lit(p) ? 1 : faded
  const { x, top, bottom, w } = TUBE
  return <g>
    <path d="M14 262H526" stroke="#b8a283" strokeWidth="3" />
    <g opacity={o('lamp')}>
      <rect x={28} y={252} width={54} height={10} rx="3" fill="#dfe6ec" stroke={ink} strokeWidth="1.6" /><path d="M54 252V150" stroke={ink} strokeWidth="4" />
      <path d="M54 150L62 146" stroke={ink} strokeWidth="4" /><path d="M60 136L98 118V178L60 158Z" fill="#c9d6e0" stroke={ink} strokeWidth="1.8" strokeLinejoin="round" /><rect x={54} y={136} width={9} height={22} rx="3" fill="#c9d6e0" stroke={ink} strokeWidth="1.6" />
      <ellipse cx={98} cy={148} rx={6} ry={28} fill={sunFill} stroke={sunLine} strokeWidth="1.6" />
      {[[108, 130, 198, 140], [108, 150, 198, 170], [108, 168, 198, 202]].map(([x1, y1, x2, y2], i) => <path key={i} d={`M${x1} ${y1}L${x2} ${y2}`} stroke={sunLine} strokeWidth="2" strokeDasharray="5 5" />)}
    </g>
    <g opacity={o('ruler')}>
      <rect x={60} y={264} width={190} height={14} fill="#fbf3dc" stroke="#b39463" strokeWidth="1.4" />
      {Array.from({ length: 20 }, (_, i) => <path key={i} d={`M${64 + i * 9.4} 264v${i % 5 ? 4 : 8}`} stroke="#8a6d45" strokeWidth="1" />)}
      {distance && <><path d="M98 292H236" stroke={ink} strokeWidth="1.6" /><path d="M98 286v12M236 286v12" stroke={ink} strokeWidth="1.6" /></>}
    </g>
    <g opacity={o('tube')}>
      <path d="M296 262V122M296 150H254" stroke="#8aa0b0" strokeWidth="4" /><rect x={286} y={252} width={40} height={10} rx="3" fill="#dfe6ec" stroke={ink} strokeWidth="1.4" />
      <path d={`M${x - w / 2} ${top}V${bottom - w / 2}A${w / 2} ${w / 2} 0 0 0 ${x + w / 2} ${bottom - w / 2}V${top}`} fill={h2oFill} stroke={ink} strokeWidth="2" />
      <rect x={x - w / 2 - 3} y={top - 10} width={w + 6} height={14} rx="3" fill="#b9c4cc" stroke={ink} strokeWidth="1.6" />
      <Pondweed />
      {[[x - 4, 140], [x + 6, 128], [x - 2, 118], [x + 8, 150], [x - 8, 162]].map(([bx, by], i) => <circle key={i} cx={bx} cy={by} r={2.6 + (i % 2)} fill={tealFill} stroke={teal} strokeWidth="1.3" />)}
    </g>
    <g opacity={o('capillary')}>
      <path d={`M${x} ${top - 10}V70H466`} stroke="#9fb5c4" strokeWidth="7" fill="none" strokeLinejoin="round" /><path d={`M${x} ${top - 10}V70H466`} stroke="#eef6fa" strokeWidth="3" fill="none" strokeLinejoin="round" />
      <rect x={420 - bubbleLength} y={67.5} width={bubbleLength} height={5} rx="2.5" fill={teal} />
      <rect x={466} y={60} width={50} height={20} rx="3" fill="white" stroke={ink} strokeWidth="1.8" /><path d="M516 70H532M532 62V78" stroke={ink} strokeWidth="2.4" />
      <rect x={300} y={78} width={160} height={13} fill="#fbf3dc" stroke="#b39463" strokeWidth="1.4" />
      {Array.from({ length: 17 }, (_, i) => <path key={i} d={`M${304 + i * 9.4} 78v${i % 5 ? 4 : 7}`} stroke="#8a6d45" strokeWidth="1" />)}
    </g>
  </g>
}
function RigScene({ focus }: { focus: string }) {
  const step = focus.replace('energy-rp-', '')
  const n = { distance: 1, collect: 2, repeat: 3 }[step] || 0
  const lit = (p: string) => step === 'idea' ? p === 'tube' : step === 'distance' ? p === 'lamp' || p === 'ruler' || p === 'tube' : step === 'collect' ? p === 'capillary' || p === 'tube' : true
  const titles: Record<string, string> = {
    idea: 'Pondweed in a tube of water gives off small bubbles of oxygen as it photosynthesises. A lamp shines on it.',
    distance: 'Step 1: a lamp shines on pondweed in a tube of water. A ruler on the bench sets the distance from the lamp to the pondweed. The pondweed is left for a set time.',
    collect: 'Step 2: oxygen from the pondweed collects in a thin capillary tube. A syringe pulls the gas bubble along the tube next to a ruler, and its length is measured.',
    repeat: 'Step 3: the test is repeated twice more at the same distance and a mean is worked out; then the lamp is moved to other distances.',
    fair: 'The whole set-up. Control variables such as temperature and time are kept the same; only the lamp distance changes.',
  }
  return <Diagram title={titles[step] || titles.idea}>
    <Rig lit={lit} distance={step !== 'idea'} />
    {step === 'idea' && <><Label x={20} y={40} to={[TUBE.x + 6, 128]} lines={['bubbles of oxygen']} strong colour={teal} /><Card x={330} y={112} w={196} h={78}><text x={428} y={140} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700"><tspan x={428}>more oxygen =</tspan><tspan x={428} dy={18}>faster photosynthesis</tspan></text></Card></>}
    {step === 'distance' && <><Tag x={167} y={250} text="set distance" colour={ink} anchor="middle" /><Clock x={30} y={40} /><text x={52} y={45} fill={ink} fontSize="13" fontWeight="700">set time</text></>}
    {step === 'collect' && <><path d="M376 52H420M376 46v12M420 46v12" stroke={teal} strokeWidth="1.8" /><text x={398} y={40} textAnchor="middle" fill={teal} fontSize="13" fontWeight="700">bubble length</text><Label x={20} y={40} to={[TUBE.x - 3, 80]} lines={['capillary tube']} strong colour={ink} /><text x={520} y={100} textAnchor="end" fill={ink} fontSize="12.5">syringe</text></>}
    {step === 'fair' && <><Card x={330} y={112} w={196} h={128}><Thermometer x={400} y={214} h={30} level={.5} /><Clock x={456} y={216} r={13} /><text x={428} y={138} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700"><tspan x={428}>change: lamp distance</tspan><tspan x={428} dy={22} fill={warm}>keep the same:</tspan><tspan x={428} dy={18} fill={warm}>temperature, time</tspan></text></Card></>}
    {n > 0 && <g><Step n={1} x={344} y={124} lines={['lamp at a set distance']} on={n === 1} current={n === 1} /><Step n={2} x={344} y={164} lines={['measure the bubble']} on={n === 2} current={n === 2} colour={teal} />
      <Step n={3} x={344} y={204} lines={['repeat, find the mean,', 'then move the lamp']} on={n === 3} current={n === 3} /></g>}
  </Diagram>
}
function RigQuestion({ assessment }: { assessment: boolean }) {
  const parts: Array<{ to: Pt; badge: Pt; name: string }> = [
    { to: [70, 150], badge: [30, 96], name: 'lamp' }, { to: [150, 272], badge: [120, 234], name: 'ruler' },
    { to: [TUBE.x + 10, 210], badge: [330, 214], name: 'pondweed' }, { to: [360, 70], badge: [360, 30], name: 'capillary tube' },
  ]
  return <Diagram title={assessment ? 'The pondweed set-up with four numbered parts: 1 on the left, 2 on the bench, 3 inside the tube, 4 at the top.' : 'The pondweed set-up: 1 the lamp, 2 the ruler that sets the distance, 3 the pondweed in water, 4 the capillary tube where the oxygen collects.'}>
    <Rig lit={() => true} distance={false} />
    {parts.map((p, i) => <g key={i}><path d={`M${p.badge[0]} ${p.badge[1]}L${p.to[0]} ${p.to[1]}`} stroke={ink} strokeWidth="1.5" /><circle cx={p.to[0]} cy={p.to[1]} r="2.5" fill={ink} /><Badge n={i + 1} x={p.badge[0]} y={p.badge[1]} />
      {!assessment && <text x={p.badge[0] + 18} y={p.badge[1] + 5} fill={ink} fontSize="13" fontWeight="700">{p.name}</text>}</g>)}
  </Diagram>
}
function ResultsTable({ rows, x, y, highlight }: { rows: Array<[string, string, string, string, string]>; x: number; y: number; highlight?: number }) {
  const cols = [0, 124, 188, 252, 316], head = ['lamp distance', 'test 1', 'test 2', 'test 3', 'mean']
  return <g>
    <rect x={x} y={y} width={384} height={36 + rows.length * 30} rx="10" fill={panel} stroke={panelLine} strokeWidth="1.6" />
    {head.map((h, i) => <text key={h} x={x + 16 + cols[i]} y={y + 24} fill={ink} fontSize="12.5" fontWeight="700">{h}</text>)}
    <path d={`M${x + 10} ${y + 34}H${x + 374}`} stroke={panelLine} strokeWidth="1.4" />
    {rows.map((r, j) => <g key={j}>{j === highlight && <rect x={x + 6} y={y + 38 + j * 30} width={372} height={26} rx="6" fill="#fff4dc" />}
      {r.map((c, i) => <text key={i} x={x + 16 + cols[i]} y={y + 56 + j * 30} fill={i === 4 ? teal : ink} fontSize="13" fontWeight={i === 4 ? 700 : 500}>{c}</text>)}</g>)}
  </g>
}
function MeanWorked() {
  return <Diagram title="Worked example. With the lamp 10 cm away, three tests gave bubble lengths of 1.2 cm, 1.5 cm and 1.2 cm. Total 3.9 cm, divided by 3, gives a mean of 1.3 cm.">
    <text x={20} y={30} fill={ink} fontSize="14" fontWeight="700">Bubble length after 5 minutes (cm)</text>
    <ResultsTable x={20} y={46} rows={[['10 cm', '1.2', '1.5', '1.2', '?']]} highlight={0} />
    <Card x={20} y={148} w={384} h={112}>
      <text x={36} y={176} fill={ink} fontSize="13.5"><tspan x={36}>add: 1.2 + 1.5 + 1.2 = 3.9 cm</tspan><tspan x={36} dy={26}>divide by 3 tests: 3.9 ÷ 3 = 1.3</tspan><tspan x={36} dy={26} fontWeight="700" fill={teal}>mean = 1.3 cm</tspan></text>
    </Card>
    <g transform="translate(424 46)"><rect x={0} y={0} width={100} height={214} rx="10" fill="white" stroke={panelLine} strokeWidth="1.4" />
      <text x={50} y={22} textAnchor="middle" fill={ink} fontSize="12" fontWeight="700">the bubbles</text>
      {[1.2, 1.5, 1.2].map((v, i) => <g key={i}><text x={12} y={50 + i * 40} fill={ink} fontSize="12">{`test ${i + 1}`}</text><rect x={12} y={56 + i * 40} width={v * 50} height={8} rx="4" fill={teal} /></g>)}
      <path d="M77 36V170" stroke={teal} strokeWidth="1.8" strokeDasharray="4 4" /><text x={68} y={188} textAnchor="middle" fill={teal} fontSize="12" fontWeight="700">mean</text>
      <path d="M12 200H87" stroke={ink} strokeWidth="1.4" /><text x={12} y={212} fill={ink} fontSize="11.5">0</text><text x={87} y={212} textAnchor="end" fill={ink} fontSize="11.5">1.5 cm</text></g>
  </Diagram>
}
function RigData() {
  return <Diagram viewBox="0 0 540 250" title="Results table for the pondweed practical: bubble length in centimetres after 5 minutes, three tests at each lamp distance. 10 cm: 1.2, 1.5, 1.2, mean 1.3. 20 cm: 0.8, 0.9, 1.0, mean 0.9. 30 cm: 0.5, 0.7, 0.6, mean not given. 40 cm: 0.3, 0.4, 0.2, mean 0.3.">
    <text x={20} y={30} fill={ink} fontSize="14" fontWeight="700">Pondweed: bubble length after 5 minutes (cm)</text>
    <ResultsTable x={20} y={44} rows={[['10 cm', '1.2', '1.5', '1.2', '1.3'], ['20 cm', '0.8', '0.9', '1.0', '0.9'], ['30 cm', '0.5', '0.7', '0.6', '?'], ['40 cm', '0.3', '0.4', '0.2', '0.3']]} />
    <Card x={420} y={44} w={104} h={186}><text x={472} y={70} textAnchor="middle" fill={ink} fontSize="12.5" fontWeight="700"><tspan x={472}>kept the</tspan><tspan x={472} dy={16}>same:</tspan></text>
      <text x={472} y={114} textAnchor="middle" fill={ink} fontSize="12.5"><tspan x={472}>pondweed</tspan><tspan x={472} dy={18}>temperature</tspan><tspan x={472} dy={18}>time</tspan></text><Clock x={472} y={196} r={13} /></Card>
    <text x={20} y={228} fill={ink} fontSize="12.5">Only the lamp distance was changed.</text>
  </Diagram>
}

// ---------- Lesson 33: respiration ----------
const cellFill = '#fbeee6', cellLine = '#c9a48c', nucFill = '#e2d9ee', nucLine = '#8a7aa8'
function BodyCell({ cx, cy, rx, ry, seed = 3, mito = true, litMito = false }: { cx: number; cy: number; rx: number; ry: number; seed?: number; mito?: boolean; litMito?: boolean }) {
  const spots: Array<[number, number, number]> = [[-.45, -.1, 20], [.35, -.42, -30], [.5, .2, 40], [-.05, .5, 10], [-.5, .45, -20], [.1, -.05, 70]]
  return <g><path d={blob(cx, cy, rx, ry, seed, .05)} fill={cellFill} stroke={cellLine} strokeWidth="3" />
    <circle cx={cx - rx * .15} cy={cy - ry * .3} r={Math.min(rx, ry) * .22} fill={nucFill} stroke={nucLine} strokeWidth="1.6" />
    {mito && spots.map(([dx, dy, a], i) => <g key={i}>{litMito && <ellipse cx={cx + dx * rx} cy={cy + dy * ry} rx="21" ry="13" fill="#fde7a8" opacity=".8" transform={`rotate(${a} ${cx + dx * rx} ${cy + dy * ry})`} />}<Mito x={cx + dx * rx} y={cy + dy * ry} a={a} /></g>)}</g>
}
function MiniPlant({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${k})`}><path d="M0 0V-34" stroke={P.deepGreen} strokeWidth="3" /><path d="M0 -14q-16 -12 -22 -2q10 9 22 2zM0 -26q16 -12 22 -2q-10 9 -22 2z" fill="#a9d49a" stroke={P.deepGreen} strokeWidth="1.4" /><path d="M-14 0H14" stroke={P.root} strokeWidth="3" strokeLinecap="round" /></g>
}
function YeastCell({ x, y, r = 12, bud = true }: { x: number; y: number; r?: number; bud?: boolean }) {
  return <g><ellipse cx={x} cy={y} rx={r} ry={r * .82} fill="#f4ecd6" stroke="#a8894f" strokeWidth="1.6" />{bud && <ellipse cx={x + r * .95} cy={y - r * .55} rx={r * .38} ry={r * .32} fill="#f4ecd6" stroke="#a8894f" strokeWidth="1.4" />}<circle cx={x - r * .2} cy={y + r * .1} r={r * .28} fill="#e6d8b4" /></g>
}
function Bird({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 4} ${y + 22}v10M${x + 6} ${y + 22}v10`} stroke="#8a6d45" strokeWidth="2" /><ellipse cx={x} cy={y + 6} rx={22} ry={17} fill="#b7916b" stroke="#7a5a36" strokeWidth="1.6" /><ellipse cx={x + 6} cy={y + 10} rx={12} ry={11} fill="#e8a56c" />
    <circle cx={x + 16} cy={y - 10} r={10} fill="#b7916b" stroke="#7a5a36" strokeWidth="1.6" /><path d={`M${x + 25} ${y - 11}l9 3l-9 3z`} fill="#e0b24a" stroke="#a77c12" strokeWidth="1" /><circle cx={x + 19} cy={y - 12} r="1.8" fill={ink} /><path d={`M${x - 20} ${y + 2}q-10 4 -14 12`} stroke="#7a5a36" strokeWidth="2" fill="none" /></g>
}
function Warmth({ x, y, n = 3, dx = 14 }: { x: number; y: number; n?: number; dx?: number }) {
  return <g>{Array.from({ length: n }, (_, i) => <path key={i} d={`M${x + i * dx} ${y}q-5 -7 0 -14t0 -14`} stroke={warm} strokeWidth="2.2" fill="none" strokeLinecap="round" />)}</g>
}
const RZ = { cx: 400, cy: 150, r: 110 }
function RespScene({ focus }: { focus: string }) {
  const step = focus.replace('energy-resp-', '')
  if (step === 'uses') return <Diagram title="Three ways organisms use the energy from respiration. Building larger molecules from smaller ones, shown as small units joining into a chain. Moving, shown as a muscle getting shorter. Keeping warm, shown as a bird giving off warmth: mammals and birds do this.">
    {[{ x: 14, t: ['build larger', 'molecules'] }, { x: 190, t: ['move', '(animals)'] }, { x: 366, t: ['keep warm', '(mammals, birds)'] }].map(c => <Card key={c.x} x={c.x} y={40} w={160} h={220}><text x={c.x + 80} y={214} textAnchor="middle" fill={ink} fontSize="13.5" fontWeight="700"><tspan x={c.x + 80}>{c.t[0]}</tspan><tspan x={c.x + 80} dy={17}>{c.t[1]}</tspan></text></Card>)}
    <Spark x={270} y={24} k={1.1} /><text x={290} y={28} fill={lightInk} fontSize="13" fontWeight="700">energy from respiration</text>
    {[50, 78, 106].map(x => <Glucose key={x} x={x} y={92} />)}<Arrow x1={94} y1={108} x2={94} y2={130} colour={ink} width={2} />
    {Array.from({ length: 6 }, (_, i) => <g key={i}>{i > 0 && <path d={`M${44 + (i - 1) * 20 + 7} 158L${44 + i * 20 - 7} 158`} stroke={sugar} strokeWidth="2" />}<Glucose x={44 + i * 20} y={158} s={.85} /></g>)}
    <text x={94} y={190} textAnchor="middle" fill={ink} fontSize="12">small → large</text>
    <path d={blob(270, 100, 58, 16, 5, .04)} fill={muscleFill} stroke={muscle} strokeWidth="2" /><path d={blob(270, 168, 36, 24, 6, .04)} fill={muscleFill} stroke={muscle} strokeWidth="2.4" />
    <Arrow x1={216} y1={168} x2={232} y2={168} colour={muscle} width={2} /><Arrow x1={324} y1={168} x2={308} y2={168} colour={muscle} width={2} />
    <text x={270} y={132} textAnchor="middle" fill={ink} fontSize="12">relaxed → contracted</text>
    <Bird x={440} y={140} /><Warmth x={482} y={122} /><Warmth x={392} y={112} n={2} />
  </Diagram>
  const titles: Record<string, string> = {
    breathing: 'Left: a person breathing, with air moving in and out of the mouth. Right: one body cell, zoomed in, where respiration happens. Breathing and respiration are different. Plants and yeast respire too.',
    energy: 'A body cell, zoomed in. Glucose goes in and is broken down in the mitochondria, transferring energy, shown as sparks. This happens in every cell, all the time.',
    exothermic: 'A body cell, zoomed in, respiring. Energy is transferred out of the cell to the surroundings, shown as warm wavy arrows: respiration is exothermic.',
  }
  return <Diagram title={titles[step] || titles.breathing}>
    <g opacity={step === 'breathing' ? 1 : .55}><g transform="translate(0 30) scale(.9)"><PersonShape /></g></g>
    {step === 'breathing' && <><Arrow x1={96} y1={46} x2={130} y2={40} colour={ink} width={2.2} /><Arrow x1={130} y1={60} x2={98} y2={55} colour={ink} width={2.2} /><text x={136} y={46} fill={ink} fontSize="12.5">air out</text><text x={136} y={64} fill={ink} fontSize="12.5">air in</text>
      <Label x={20} y={250} lines={['breathing: air in and', 'out of the lungs']} strong colour={ink} /></>}
    <path d={`M86 160L${RZ.cx - 104} ${RZ.cy - 40}M86 160L${RZ.cx - 100} ${RZ.cy + 48}`} stroke={ink} strokeWidth="1.2" strokeDasharray="3 3" /><circle cx={86} cy={160} r="5" fill="none" stroke={ink} strokeWidth="1.6" />
    <Zoom {...RZ} fill="#fffaf6">
      <BodyCell cx={RZ.cx} cy={RZ.cy} rx={82} ry={74} />
      {step === 'energy' && <><Glucose x={332} y={118} /><Arrow x1={340} y1={126} x2={358} y2={140} colour={sugar} width={2} /><Glucose x={326} y={190} s={.8} /><Spark x={400} y={98} /><Spark x={470} y={150} /><Spark x={420} y={214} /></>}
      {step === 'exothermic' && <><Spark x={400} y={150} /><Warmth x={322} y={100} n={2} dx={-12} /><Warmth x={484} y={110} n={2} /><Warmth x={380} y={70} n={3} /><Warmth x={396} y={246} n={3} /></>}
    </Zoom>
    <text x={RZ.cx} y={RZ.cy - RZ.r - 10} textAnchor="middle" fill={ink} fontSize="12">one body cell, zoomed in</text>
    {step === 'breathing' && <><Label x={530} y={284} anchor="end" lines={['respiration: a reaction in cells']} strong colour={sugar} />
      <Card x={214} y={204} w={84} h={60}><MiniPlant x={234} y={242} k={.7} /><YeastCell x={270} y={224} r={9} /><text x={256} y={256} textAnchor="middle" fill={ink} fontSize="12">respire too</text></Card></>}
    {step === 'energy' && <Label x={530} y={284} anchor="end" lines={['energy transferred from glucose']} strong colour={lightInk} />}
    {step === 'exothermic' && <Label x={530} y={284} anchor="end" lines={['exothermic: energy out to the surroundings']} strong colour={warm} />}
  </Diagram>
}
function PersonShape() {
  return <g><path d="M40 200V74Q40 44 68 42H92Q120 44 120 74V200Z" fill="#a9cbe0" stroke={ink} strokeWidth="1.6" /><circle cx={80} cy={10} r={25} fill={skin} stroke={skinLine} strokeWidth="1.6" transform="translate(0 0)" />
    <path d="M55 12C50 -16 82 -26 102 -4C88 -10 74 -4 70 14Z" fill="#6d5a4b" /><circle cx={91} cy={6} r="2.3" fill={ink} /><path d="M93 22q5 2 8 -1" stroke={skinLine} strokeWidth="1.6" fill="none" strokeLinecap="round" /></g>
}

// Aerobic respiration in one cell: inputs from the left, outputs to the right.
const AC = { cx: 200, cy: 150, rx: 100, ry: 86 }
const FLOWS: Array<{ key: 'glucose' | 'oxygen' | 'co2' | 'water'; from: Pt; to: Pt; glyph: Pt; name: string; colour: string }> = [
  { key: 'glucose', from: [24, 124], to: [100, 130], glyph: [30, 100], name: 'glucose', colour: sugar },
  { key: 'oxygen', from: [24, 180], to: [100, 174], glyph: [30, 204], name: 'oxygen', colour: teal },
  { key: 'co2', from: [300, 128], to: [360, 118], glyph: [382, 110], name: 'carbon dioxide', colour: co2 },
  { key: 'water', from: [300, 174], to: [360, 184], glyph: [382, 192], name: 'water', colour: h2o },
]
function FlowGlyph({ k, x, y }: { k: string; x: number; y: number }) {
  return k === 'glucose' ? <Glucose x={x} y={y} /> : k === 'oxygen' ? <O2 x={x} y={y} /> : k === 'co2' ? <CO2 x={x} y={y} /> : <H2O x={x} y={y} />
}
function AerobicCell({ lit, names = true, litMito = false, numbered = false, plain = false }: { lit: (k: string) => boolean; names?: boolean; litMito?: boolean; numbered?: boolean; plain?: boolean }) {
  return <g>
    <BodyCell cx={AC.cx} cy={AC.cy} rx={AC.rx} ry={AC.ry} seed={8} litMito={litMito} />
    {!plain && <><Spark x={AC.cx + 30} y={AC.cy + 4} /><Spark x={AC.cx - 44} y={AC.cy + 40} k={.8} /></>}
    {FLOWS.map((f, i) => <g key={f.key} opacity={lit(f.key) ? 1 : faded}>
      <Arrow x1={f.from[0]} y1={f.from[1]} x2={f.to[0]} y2={f.to[1]} colour={plain ? ink : f.colour} width={2.6} />
      {numbered ? <Badge n={i + 1} x={f.glyph[0]} y={f.glyph[1]} /> : <FlowGlyph k={f.key} x={f.glyph[0]} y={f.glyph[1]} />}
      {names && <text x={f.glyph[0] + 18} y={f.glyph[1] + 5} fill={f.colour} fontSize="13" fontWeight="700">{f.name}</text>}
    </g>)}
  </g>
}
function AerobicScene({ focus }: { focus: string }) {
  const step = focus.replace('energy-aerobic-', '')
  if (step === 'summary') {
    const cols: Array<{ x: number; word: string; sym: string; colour: string; glyph: ReactNode }> = [
      { x: 70, word: 'glucose', sym: 'C₆H₁₂O₆', colour: sugar, glyph: <Glucose x={70} y={150} s={2} /> },
      { x: 180, word: 'oxygen', sym: 'O₂', colour: teal, glyph: <O2 x={180} y={150} s={1.7} /> },
      { x: 362, word: 'carbon dioxide', sym: 'CO₂', colour: co2, glyph: <CO2 x={362} y={150} s={1.7} /> },
      { x: 484, word: 'water', sym: 'H₂O', colour: h2o, glyph: <H2O x={484} y={146} s={1.7} /> },
    ]
    return <Diagram title="Summary card for aerobic respiration. Word equation: glucose plus oxygen gives carbon dioxide plus water. Chemical symbols: glucose C₆H₁₂O₆, oxygen O₂, carbon dioxide CO₂, water H₂O. Most of it happens in mitochondria, and it transfers energy to the environment.">
      <rect x={14} y={14} width={512} height={272} rx="12" fill="#fffaf6" stroke={cellLine} strokeWidth="1.6" />
      <text x={270} y={46} textAnchor="middle" fill={ink} fontSize="16" fontWeight="700">Aerobic respiration</text>
      {cols.map(c => <g key={c.word}><text x={c.x} y={96} textAnchor="middle" fill={c.colour} fontSize="14" fontWeight="700">{c.word}</text>{c.glyph}<text x={c.x} y={206} textAnchor="middle" fill={c.colour} fontSize="17" fontWeight="700">{c.sym}</text></g>)}
      {[125, 432].map(x => <text key={x} x={x} y={96} textAnchor="middle" fill={ink} fontSize="16" fontWeight="700">+</text>)}
      <Arrow x1={222} y1={92} x2={292} y2={92} colour={ink} width={2.2} />
      <text x={270} y={248} textAnchor="middle" fill={ink} fontSize="13">mostly in mitochondria · energy transferred out: exothermic</text>
      <text x={270} y={270} textAnchor="middle" fill={ink} fontSize="11.5">Molecules drawn as simple symbols, not real shapes.</text>
    </Diagram>
  }
  const titles: Record<string, string> = {
    oxygen: 'A body cell with glucose and oxygen going in on the left, and carbon dioxide and water coming out on the right. The oxygen arrow is highlighted: aerobic respiration uses oxygen.',
    equation: 'The same cell: glucose and oxygen go in; carbon dioxide and water come out. A card shows the word equation: glucose plus oxygen gives carbon dioxide plus water.',
    where: 'The same cell with its mitochondria highlighted: most of the reactions of aerobic respiration happen inside mitochondria. It goes on all the time in plants and animals.',
  }
  return <Diagram title={titles[step] || titles.oxygen}>
    <AerobicCell lit={k => step === 'oxygen' ? k === 'oxygen' : step === 'where' ? false : true} litMito={step === 'where'} names={step !== 'where'} />
    {step === 'oxygen' && <><Tag x={430} y={246} text="aerobic = uses oxygen" colour={teal} fill="#effaf8" anchor="middle" /><text x={430} y={272} textAnchor="middle" fill={ink} fontSize="12.5"><tspan x={430}>the most efficient way</tspan><tspan x={430} dy={16}>to transfer energy</tspan></text></>}
    {step === 'equation' && <Card x={332} y={236} w={196} h={54}><text x={430} y={258} textAnchor="middle" fontSize="12.5" fontWeight="700"><tspan fill={sugar}>glucose</tspan><tspan fill={ink}> + </tspan><tspan fill={teal}>oxygen</tspan><tspan fill={ink}> →</tspan></text><text x={430} y={278} textAnchor="middle" fontSize="12.5" fontWeight="700"><tspan fill={co2}>carbon dioxide</tspan><tspan fill={ink}> + </tspan><tspan fill={h2o}>water</tspan></text></Card>}
    {step === 'where' && <><Label x={340} y={44} to={[AC.cx + .35 * AC.rx, AC.cy - .42 * AC.ry]} lines={['mitochondria: most', 'reactions happen here']} strong colour="#a2553f" />
      <Card x={336} y={222} w={190} h={66}><MiniPlant x={362} y={272} /><g transform="translate(404 254) scale(.62)"><Bird x={0} y={0} /></g><text x={438} y={248} fill={ink} fontSize="12.5"><tspan x={436}>all the time,</tspan><tspan x={436} dy={16}>in plants and</tspan><tspan x={436} dy={16}>animals</tspan></text></Card></>}
  </Diagram>
}
function CellQuestion({ assessment }: { assessment: boolean }) {
  const cx = 250, cy = 150, rx = 150, ry = 110
  const parts: Array<{ to: Pt; badge: Pt; name: string }> = [
    { to: [cx - rx * .15, cy - ry * .3], badge: [60, 60], name: 'nucleus' }, { to: [cx + rx * .7, cy - ry * .72], badge: [470, 40], name: 'cell membrane' },
    { to: [cx - rx * .3, cy + ry * .15], badge: [50, 230], name: 'cytoplasm' }, { to: [cx + rx * .5, cy + ry * .2], badge: [480, 230], name: 'mitochondrion' },
  ]
  return <Diagram title={assessment ? 'An animal cell with four numbered parts: 1 top left, 2 on the edge at the top right, 3 lower left, 4 lower right.' : 'An animal cell: 1 the nucleus, 2 the cell membrane, 3 the cytoplasm, 4 a mitochondrion, where most aerobic respiration happens.'}>
    <BodyCell cx={cx} cy={cy} rx={rx} ry={ry} seed={12} />
    {parts.map((p, i) => <g key={i}><path d={`M${p.badge[0]} ${p.badge[1]}L${p.to[0]} ${p.to[1]}`} stroke={ink} strokeWidth="1.5" /><circle cx={p.to[0]} cy={p.to[1]} r="3" fill={ink} /><Badge n={i + 1} x={p.badge[0]} y={p.badge[1]} />
      {!assessment && <text x={p.badge[0] + (p.badge[0] > 300 ? -18 : 18)} y={p.badge[1] + 5 + (i === 3 ? 26 : 0)} textAnchor={p.badge[0] > 300 ? 'end' : 'start'} fill={ink} fontSize="13" fontWeight="700">{p.name}</text>}</g>)}
  </Diagram>
}
function AerobicQuestion({ assessment }: { assessment: boolean }) {
  return <Diagram title={assessment ? 'A body cell with four numbered arrows: 1 and 2 going into the cell on the left, 3 and 4 coming out on the right.' : 'A body cell respiring aerobically: 1 glucose in, 2 oxygen in, 3 carbon dioxide out, 4 water out.'}>
    <AerobicCell lit={() => true} names={!assessment} numbered plain={assessment} />
  </Diagram>
}

// Anaerobic respiration in a muscle cell.
function MuscleFibre({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <g><rect x={x} y={y} width={w} height={h} rx={h / 2} fill={muscleFill} stroke={muscle} strokeWidth="3" />
    {Array.from({ length: Math.floor(w / 16) - 1 }, (_, i) => <path key={i} d={`M${x + 16 + i * 16} ${y + 6}v${h - 12}`} stroke={muscle} strokeWidth="1.4" opacity=".45" />)}</g>
}
function AnaerobicScene({ focus }: { focus: string }) {
  const step = focus.replace('energy-anaerobic-', '')
  if (step === 'less') {
    return <Diagram title="Energy compared. Aerobic respiration, glucose plus oxygen giving carbon dioxide and water, has a long energy bar. Anaerobic respiration in muscles, glucose giving lactic acid, has a very short energy bar: it transfers much less energy.">
      <text x={20} y={34} fill={ink} fontSize="14" fontWeight="700">Energy transferred from one glucose</text>
      <Card x={14} y={52} w={512} h={96}><text x={30} y={80} fill={teal} fontSize="13.5" fontWeight="700">aerobic (with oxygen)</text>
        <Glucose x={40} y={112} /><text x={58} y={117} textAnchor="middle" fill={ink} fontSize="13">+</text><O2 x={78} y={112} /><Arrow x1={94} y1={112} x2={120} y2={112} colour={ink} width={2} /><CO2 x={144} y={112} /><text x={172} y={117} textAnchor="middle" fill={ink} fontSize="13">+</text><H2O x={196} y={108} />
        <rect x={226} y={102} width={280} height={20} rx="10" fill={sunFill} stroke={sunLine} strokeWidth="1.6" /><text x={366} y={140} textAnchor="middle" fill={lightInk} fontSize="12.5" fontWeight="700">much more energy</text></Card>
      <Card x={14} y={164} w={512} h={96}><text x={30} y={192} fill={lactic} fontSize="13.5" fontWeight="700">anaerobic in muscles (not enough oxygen)</text>
        <Glucose x={40} y={224} /><Arrow x1={56} y1={224} x2={82} y2={224} colour={ink} width={2} /><Lactic x={100} y={226} /><Lactic x={120} y={226} />
        <rect x={226} y={214} width={26} height={20} rx="10" fill={sunFill} stroke={sunLine} strokeWidth="1.6" /><text x={262} y={229} fill={lightInk} fontSize="12.5" fontWeight="700">much less energy</text>
        <text x={30} y={252} fill={ink} fontSize="12">glucose not combined with oxygen: breakdown incomplete</text></Card>
      <text x={270} y={286} textAnchor="middle" fill={ink} fontSize="11.5">Bar lengths show the idea, not exact amounts.</text>
    </Diagram>
  }
  const titles: Record<string, string> = {
    short: 'A muscle cell during hard exercise. Only a little oxygen reaches it, shown by a thin dashed arrow, so the cell also respires without oxygen: anaerobic respiration.',
    lactic: 'The same muscle cell. Glucose goes in and is only partly broken down, into lactic acid, shown as half-hexagons. Word equation: glucose gives lactic acid.',
  }
  return <Diagram title={titles[step] || titles.short}>
    <MuscleFibre x={40} y={100} w={300} h={100} />
    <text x={190} y={88} textAnchor="middle" fill={muscle} fontSize="13" fontWeight="700">a muscle cell, hard at work</text>
    <Arrow x1={12} y1={236} x2={80} y2={194} colour={teal} width={1.6} dashed /><O2 x={20} y={256} /><text x={36} y={276} fill={teal} fontSize="12.5" fontWeight="700">not enough oxygen</text>
    <Glucose x={82} y={150} /><Arrow x1={96} y1={150} x2={150} y2={150} colour={sugar} width={2.2} />
    {step === 'lactic' ? <>{[[180, 132], [206, 162], [236, 134], [262, 164], [290, 138]].map(([x, y], i) => <Lactic key={i} x={x} y={y} />)}<Spark x={316} y={170} k={.7} /></> : <><Glucose x={196} y={140} s={.9} /><Glucose x={250} y={164} s={.9} /><Spark x={300} y={150} k={.8} /></>}
    {step === 'short' && <><Tag x={440} y={130} text="anaerobic respiration" colour={lactic} fill="#fdf1ec" anchor="middle" /><text x={440} y={166} textAnchor="middle" fill={ink} fontSize="12.5"><tspan x={440}>respiring without oxygen,</tspan><tspan x={440} dy={16}>as well as with it</tspan></text></>}
    {step === 'lactic' && <><Card x={364} y={100} w={162} h={64}><text x={445} y={128} textAnchor="middle" fontSize="14" fontWeight="700"><tspan fill={sugar}>glucose</tspan><tspan fill={ink}> →</tspan></text><text x={445} y={150} textAnchor="middle" fill={lactic} fontSize="14" fontWeight="700">lactic acid</text></Card>
      <Label x={364} y={200} to={[236, 140]} lines={['lactic acid: glucose', 'partly broken down']} strong colour={lactic} /></>}
  </Diagram>
}

// Anaerobic respiration in yeast (and plants): fermentation.
function Flask({ x, y, bubbles = true }: { x: number; y: number; bubbles?: boolean }) {
  return <g><path d={`M${x - 12} ${y - 2}C${x - 44} ${y - 30} ${x - 34} ${y - 76} ${x} ${y - 76}C${x + 34} ${y - 76} ${x + 44} ${y - 30} ${x + 12} ${y - 2}Z`} fill={bubbles ? co2Fill : '#f3eff9'} stroke={co2} strokeWidth="1.8" /><rect x={x - 17} y={y - 4} width={34} height={8} rx="3" fill="#c9b8e6" stroke={co2} strokeWidth="1.4" /><path d={`M${x - 14} ${y}V${y + 40}L${x - 60} ${y + 130}Q${x - 64} ${y + 140} ${x - 52} ${y + 140}H${x + 52}Q${x + 64} ${y + 140} ${x + 60} ${y + 130}L${x + 14} ${y + 40}V${y}`} fill="white" stroke={ink} strokeWidth="2" />
    <path d={`M${x - 36} ${y + 88}L${x - 60} ${y + 130}Q${x - 64} ${y + 140} ${x - 52} ${y + 140}H${x + 52}Q${x + 64} ${y + 140} ${x + 60} ${y + 130}L${x + 36} ${y + 88}Z`} fill="#fbf1d2" stroke="none" />
    {[[-30, 124], [-8, 112], [18, 128], [36, 118], [0, 132]].map(([dx, dy], i) => <YeastCell key={i} x={x + dx} y={y + dy} r={6} bud={i % 2 === 0} />)}
    {bubbles && [[-6, 96], [8, 80], [-2, 60], [10, 40], [0, 22]].map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r={3 + (i % 2)} fill={co2Fill} stroke={co2} strokeWidth="1.3" />)}</g>
}
function YeastScene({ focus }: { focus: string }) {
  const step = focus.replace('energy-yeast-', '')
  if (step === 'compare') {
    const rows: Array<{ name: string; colour: string; eq: ReactNode }> = [
      { name: 'aerobic (with oxygen)', colour: teal, eq: <><tspan fill={sugar}>glucose</tspan><tspan fill={ink}> + </tspan><tspan fill={teal}>oxygen</tspan><tspan fill={ink}> → </tspan><tspan fill={co2}>carbon dioxide</tspan><tspan fill={ink}> + </tspan><tspan fill={h2o}>water</tspan></> },
      { name: 'anaerobic in muscles', colour: lactic, eq: <><tspan fill={sugar}>glucose</tspan><tspan fill={ink}> → </tspan><tspan fill={lactic}>lactic acid</tspan></> },
      { name: 'anaerobic in plants and yeast', colour: ethanol, eq: <><tspan fill={sugar}>glucose</tspan><tspan fill={ink}> → </tspan><tspan fill={ethanol}>ethanol</tspan><tspan fill={ink}> + </tspan><tspan fill={co2}>carbon dioxide</tspan></> },
    ]
    return <Diagram title="Three word equations compared. Aerobic: glucose plus oxygen gives carbon dioxide plus water. Anaerobic in muscles: glucose gives lactic acid. Anaerobic in plants and yeast: glucose gives ethanol plus carbon dioxide. Only aerobic respiration uses oxygen.">
      <text x={20} y={32} fill={ink} fontSize="15" fontWeight="700">Three kinds of respiration</text>
      {rows.map((r, i) => <Card key={r.name} x={14} y={48 + i * 78} w={512} h={66}><text x={30} y={72 + i * 78} fill={r.colour} fontSize="13" fontWeight="700">{r.name}</text><text x={30} y={98 + i * 78} fontSize="14.5" fontWeight="700">{r.eq}</text>
        {i === 0 && <Tag x={410} y={72} text="most energy" colour={lightInk} fill="#fff8df" />}</Card>)}
      <text x={20} y={290} fill={ink} fontSize="12.5">Only aerobic respiration uses oxygen.</text>
    </Diagram>
  }
  if (step === 'uses') return <Diagram title="Two uses of fermentation. Left: bread dough in a tin, before and after rising; carbon dioxide bubbles make it rise. Right: a jar of fruit juice fermenting; the ethanol stays in the drink, as in beer and wine.">
    <Card x={14} y={20} w={250} h={262}><text x={139} y={46} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">bread</text>
      {[[40, 'before'], [148, 'after']].map(([x, t], i) => <g key={String(t)}><path d={`M${Number(x)} 150h80v70h-80z`} fill="#dfe6ec" stroke={ink} strokeWidth="1.8" /><path d={i ? `M${Number(x) + 2} 150C${Number(x) - 4} 84 ${Number(x) + 84} 84 ${Number(x) + 78} 150Z` : `M${Number(x) + 2} 150C${Number(x) + 6} 132 ${Number(x) + 74} 132 ${Number(x) + 78} 150Z`} fill="#f3dfb4" stroke="#b8862b" strokeWidth="1.8" />
        {i === 1 && [[18, 126], [40, 112], [58, 130], [30, 140], [52, 146]].map(([dx, dy], j) => <circle key={j} cx={Number(x) + dx} cy={dy} r="4" fill={co2Fill} stroke={co2} strokeWidth="1.2" />)}
        <text x={Number(x) + 40} y={244} textAnchor="middle" fill={ink} fontSize="12.5">{t}</text></g>)}
      <Arrow x1={124} y1={186} x2={144} y2={186} colour={ink} width={2} />
      <text x={139} y={268} textAnchor="middle" fill={co2} fontSize="12.5" fontWeight="700">carbon dioxide makes it rise</text></Card>
    <Card x={276} y={20} w={250} h={262}><text x={401} y={46} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">beer and wine</text>
      <path d="M366 80h70v18q20 10 20 40v90q0 12 -12 12h-86q-12 0 -12 -12v-90q0 -30 20 -40z" fill="white" stroke={ink} strokeWidth="2" /><path d="M348 150h106v78q0 12 -12 12h-82q-12 0 -12 -12z" fill="#f6e7c4" />
      {[[372, 180], [398, 206], [424, 176], [410, 224], [380, 216]].map(([x, y], i) => <Ethanol key={i} x={x} y={y} s={.9} />)}{[[392, 130], [404, 112], [396, 94]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.5" fill={co2Fill} stroke={co2} strokeWidth="1.2" />)}
      <text x={401} y={268} textAnchor="middle" fill={ethanol} fontSize="12.5" fontWeight="700">ethanol: the alcohol</text></Card>
  </Diagram>
  const titles: Record<string, string> = {
    cells: 'Yeast cells, zoomed in, in a sugary liquid. Glucose is broken down without oxygen into ethanol and carbon dioxide. Plant cells can do this too.',
    ferment: 'A flask of sugary liquid with yeast at the bottom. Bubbles of carbon dioxide rise as the yeast respires without oxygen. This is fermentation.',
  }
  return <Diagram title={titles[step] || titles.cells}>
    <Flask x={120} y={110} bubbles={step === 'ferment'} />
    <text x={120} y={274} textAnchor="middle" fill={ink} fontSize="12.5">yeast in sugary liquid</text>
    {step === 'cells' ? <><path d={`M140 236L${RZ.cx - 100} ${RZ.cy + 46}M140 236L${RZ.cx - 104} ${RZ.cy - 36}`} stroke={ink} strokeWidth="1.2" strokeDasharray="3 3" />
      <Zoom {...RZ} fill="#fffbf0">{[[352, 110, 22], [440, 96, 20], [470, 176, 22], [384, 196, 20]].map(([x, y, r], i) => <YeastCell key={i} x={x} y={y} r={r} />)}
        <Glucose x={320} y={160} /><Arrow x1={334} y1={160} x2={366} y2={156} colour={sugar} width={2} /><Ethanol x={420} y={150} /><CO2 x={436} y={226} /><Ethanol x={346} y={236} s={.9} /><CO2 x={498} y={126} s={.9} /></Zoom>
      <text x={RZ.cx} y={RZ.cy - RZ.r - 10} textAnchor="middle" fill={ink} fontSize="12">yeast cells, zoomed in</text>
      <Card x={186} y={12} w={120} h={78}><YeastCell x={214} y={38} r={10} /><MiniPlant x={270} y={56} k={.7} /><text x={246} y={80} textAnchor="middle" fill={ink} fontSize="12">yeast and plants</text></Card>
      <text x={530} y={292} textAnchor="end" fontSize="13" fontWeight="700"><tspan fill={sugar}>glucose</tspan><tspan fill={ink}> → </tspan><tspan fill={ethanol}>ethanol</tspan><tspan fill={ink}> + </tspan><tspan fill={co2}>carbon dioxide</tspan></text></>
      : <><Label x={186} y={56} to={[146, 52]} lines={['carbon dioxide', 'fills the balloon']} strong colour={co2} /><Tag x={400} y={150} text="fermentation" colour={ethanol} fill="#f1f3f9" anchor="middle" />
        <text x={400} y={186} textAnchor="middle" fill={ink} fontSize="12.5"><tspan x={400}>anaerobic respiration</tspan><tspan x={400} dy={16}>in yeast</tspan></text></>}
  </Diagram>
}
function YeastData() {
  const bars: Array<[string, string, number]> = [['A', 'yeast + sugar solution', 38], ['B', 'yeast + water only', 2], ['C', 'sugar solution, no yeast', 0]]
  const Y = (v: number) => 230 - v * 4
  return <Diagram title="Bar chart of gas collected in 30 minutes, all at the same temperature. Flask A, yeast with sugar solution: 38 cm³. Flask B, yeast with water only: 2 cm³. Flask C, sugar solution with no yeast: 0 cm³.">
    <text x={20} y={26} fill={ink} fontSize="14" fontWeight="700">Gas collected in 30 minutes (same temperature)</text>
    <path d="M70 70V230H370" stroke={ink} strokeWidth="2" fill="none" />
    {[0, 10, 20, 30, 40].map(v => <g key={v}><path d={`M64 ${Y(v)}h6`} stroke={ink} /><text x={60} y={Y(v) + 4} textAnchor="end" fill={ink} fontSize="12">{v}</text></g>)}
    <text transform="translate(26 150) rotate(-90)" textAnchor="middle" fill={ink} fontSize="12.5">gas (cm³)</text>
    {bars.map(([k, , v], i) => <g key={k}><rect x={96 + i * 92} y={Y(v)} width={56} height={v * 4 || 1} fill={i ? '#cdbde9' : co2} stroke={co2} strokeWidth="1.4" /><text x={124 + i * 92} y={Y(v) - 8} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">{`${v} cm³`}</text><text x={124 + i * 92} y={250} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">{`flask ${k}`}</text></g>)}
    <Card x={388} y={70} w={144} h={160}>{bars.map(([k, t], i) => <text key={k} x={398} y={94 + i * 48} fill={ink} fontSize="12.5"><tspan x={398} fontWeight="700">{`${k}:`}</tspan>{t.split(', ').length > 1 ? <><tspan x={416}>{t.split(', ')[0] + ','}</tspan><tspan x={416} dy={15}>{t.split(', ')[1]}</tspan></> : <><tspan x={416}>{t.split(' + ')[0] + ' +'}</tspan><tspan x={416} dy={15}>{t.split(' + ')[1]}</tspan></>}</text>)}</Card>
  </Diagram>
}

// ---------- Lesson 34: exercise, oxygen debt and metabolism ----------
const lungFill = '#f3c9c0', lungLine = '#c77f75', heartFill = '#e98f95', heartLine = '#b8424f', blood = '#c8505a'
type BodyPart = 'lungs' | 'heart' | 'muscle' | 'blood'
function Limb({ d, w }: { d: string; w: number }) {
  return <g><path d={d} stroke={skinLine} strokeWidth={w + 3} fill="none" strokeLinecap="round" /><path d={d} stroke={skin} strokeWidth={w} fill="none" strokeLinecap="round" /></g>
}
// A simple front-view body: lungs, heart, one thigh muscle and the blood route to it. Positions only, not anatomy detail.
function Body({ lit = () => true, deep = false, fast = false }: { lit?: (p: BodyPart) => boolean; deep?: boolean; fast?: boolean }) {
  const o = (p: BodyPart) => lit(p) ? 1 : faded, k = deep ? 1.2 : 1
  return <g>
    <Limb d="M128 176L122 284" w={26} /><Limb d="M172 176L178 284" w={26} /><Limb d="M110 80L94 170" w={17} /><Limb d="M190 80L206 170" w={17} />
    <path d="M110 74Q150 62 190 74L196 176Q150 188 104 176Z" fill={skin} stroke={skinLine} strokeWidth="1.8" /><rect x={142} y={56} width={16} height={14} fill={skin} />
    <circle cx={150} cy={36} r={22} fill={skin} stroke={skinLine} strokeWidth="1.8" /><path d="M129 30C128 8 170 6 172 30C164 20 138 20 129 30Z" fill="#6d5a4b" /><circle cx={142} cy={38} r="2.2" fill={ink} /><circle cx={158} cy={38} r="2.2" fill={ink} /><path d="M145 47q5 3 10 0" stroke={skinLine} strokeWidth="1.6" fill="none" strokeLinecap="round" />
    <g opacity={o('lungs')}><path d="M150 62V84M150 84L138 94M150 84L162 94" stroke={lungLine} strokeWidth="3" fill="none" strokeLinecap="round" />
      {[-1, 1].map(s => <path key={s} d={blob(150 + s * 22, 118, 17 * k, 32 * k, 60 + s, .04, .9)} fill={lungFill} stroke={lungLine} strokeWidth="1.8" />)}</g>
    <g opacity={o('blood')}><path d="M160 138C172 150 172 176 172 200" stroke={blood} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeDasharray={fast ? '9 5' : undefined} /></g>
    <g opacity={o('heart')}><path d="M158 146c-14 -9 -18 -20 -10 -26c5 -3 9 0 10 3c1 -3 5 -6 10 -3c8 6 4 17 -10 26z" fill={heartFill} stroke={heartLine} strokeWidth="1.8" strokeLinejoin="round" /></g>
    <g opacity={o('muscle')}><path d={blob(175, 222, 10, 30, 70, .04)} fill={muscleFill} stroke={muscle} strokeWidth="2.2" /></g>
  </g>
}
function ExerciseScene({ focus }: { focus: string }) {
  const step = focus.replace('energy-exercise-', '')
  const n = { muscle: 1, rate: 2, volume: 3, heart: 4 }[step] || 0
  const on = (i: number) => n === 0 || n === i
  const lit = (p: BodyPart) => n === 0 ? true : n === 1 ? p === 'muscle' : n === 4 ? p === 'heart' || p === 'blood' || p === 'muscle' : p === 'lungs'
  const titles: Record<string, string> = {
    muscle: 'Step 1: a body with the thigh muscle highlighted. The muscle contracts more often during exercise, so it needs more energy from respiration, and so more oxygen.',
    rate: 'Step 2: the lungs are highlighted. Breathing rate, how fast you breathe, increases.',
    volume: 'Step 3: the lungs are drawn larger. Breath volume, how deep each breath is, increases, so more oxygen gets into the blood.',
    heart: 'Step 4: the heart and the blood route to the thigh muscle are highlighted. Heart rate increases, so oxygenated blood reaches the muscles faster.',
    all: 'The whole response to exercise: 1 muscles need more energy and oxygen; 2 breathing rate goes up; 3 breath volume goes up; 4 heart rate goes up.',
  }
  return <Diagram title={titles[step] || titles.all}>
    <Body lit={lit} deep={n === 3 || n === 0} fast={n === 4 || n === 0} />
    {(n === 1 || n === 0) && <><Spark x={200} y={226} k={.8} /><O2 x={204} y={254} s={.9} /></>}
    {n === 2 && <><Arrow x1={160} y1={46} x2={200} y2={38} colour={ink} width={2} /><Arrow x1={202} y1={56} x2={162} y2={52} colour={teal} width={2} /><text x={206} y={42} fill={ink} fontSize="12">out</text><text x={206} y={62} fill={teal} fontSize="12">in</text></>}
    <Step n={1} x={294} y={50} lines={['muscles need more', 'energy and oxygen']} on={on(1)} current={n === 1} colour={muscle} />
    <Step n={2} x={294} y={116} lines={['breathing rate up:', 'breathe faster']} on={on(2)} current={n === 2} colour={teal} />
    <Step n={3} x={294} y={182} lines={['breath volume up:', 'breathe deeper']} on={on(3)} current={n === 3} colour={teal} />
    <Step n={4} x={294} y={248} lines={['heart rate up: blood', 'to muscles faster']} on={on(4)} current={n === 4} colour={blood} />
  </Diagram>
}
const HZ = { cx: 432, cy: 150, r: 104 }
function HardScene({ focus }: { focus: string }) {
  const step = focus.replace('energy-hard-', '')
  const titles: Record<string, string> = {
    short: 'A body with its thigh muscle zoomed in. Very little oxygen reaches the muscle cells during really hard exercise, so they respire anaerobically as well.',
    lactic: 'The zoomed-in thigh muscle. Lactic acid, shown as half-hexagons, builds up between the muscle cells. This is painful.',
    fatigue: 'The zoomed-in thigh muscle after a long time exercising. The muscle cells are tired and contract less well: muscle fatigue.',
  }
  const nLactic = step === 'short' ? 3 : 11
  const spots: Pt[] = [[366, 100], [404, 124], [452, 96], [500, 118], [376, 176], [430, 204], [484, 180], [506, 214], [392, 236], [460, 250], [520, 158]]
  return <Diagram title={titles[step] || titles.short}>
    <g transform="translate(-76 0)"><Body lit={p => p === 'muscle'} /></g>
    <path d={`M109 222L${HZ.cx - 96} ${HZ.cy - 40}M109 222L${HZ.cx - 90} ${HZ.cy + 52}`} stroke={ink} strokeWidth="1.2" strokeDasharray="3 3" />
    <Zoom {...HZ} fill="#fff8f6">
      {[70, 130, 190, 250].map((y, i) => <g key={y} opacity={step === 'fatigue' && i % 2 ? .55 : 1}><MuscleFibre x={322} y={y - 22} w={230} h={40} /></g>)}
      {spots.slice(0, nLactic).map(([x, y], i) => <Lactic key={i} x={x} y={y - 12} s={1.1} />)}
      {step === 'short' && <><O2 x={500} y={110} /><Spark x={460} y={150} k={.8} /></>}
    </Zoom>
    <text x={HZ.cx} y={HZ.cy - HZ.r - 10} textAnchor="middle" fill={ink} fontSize="12">thigh muscle, zoomed in</text>
    {step === 'short' && <><Label x={160} y={80} lines={['really hard', 'exercise: not', 'enough oxygen']} strong colour={teal} /><Tag x={160} y={288} text="anaerobic as well as aerobic" colour={lactic} fill="#fdf1ec" /></>}
    {step === 'lactic' && <><Label x={160} y={80} lines={['lactic acid', 'builds up:', 'painful']} strong colour={lactic} /><Lactic x={168} y={286} /><text x={182} y={290} fill={lactic} fontSize="12.5" fontWeight="700">lactic acid</text></>}
    {step === 'fatigue' && <><Label x={160} y={80} lines={['muscle fatigue:', 'tired, not', 'contracting well']} strong colour={muscle} /><text x={160} y={290} fill={ink} fontSize="12.5">after long periods of exercise</text></>}
  </Diagram>
}
// Breathing rate before, during and after a run. The shaded part after stopping is the extra breathing that repays the oxygen debt.
const DG: Axes = { x0: 60, y0: 236, w: 300, h: 180 }
const dx = (t: number) => DG.x0 + t * DG.w, dy = (v: number) => DG.y0 - v * DG.h
const DEBT_LINE = `M${dx(0)} ${dy(.2)}H${dx(.2)}C${dx(.24)} ${dy(.2)} ${dx(.26)} ${dy(.8)} ${dx(.32)} ${dy(.8)}H${dx(.55)}C${dx(.62)} ${dy(.8)} ${dx(.66)} ${dy(.26)} ${dx(.88)} ${dy(.21)}H${dx(1)}`
const DEBT_AREA = `M${dx(.55)} ${dy(.2)}V${dy(.8)}C${dx(.62)} ${dy(.8)} ${dx(.66)} ${dy(.26)} ${dx(.88)} ${dy(.21)}L${dx(.9)} ${dy(.2)}Z`
function DebtScene({ focus }: { focus: string }) {
  const step = focus.replace('energy-debt-', '')
  const titles: Record<string, string> = {
    after: 'Graph of breathing rate against time. Breathing rate is low at rest, rises during a run, and stays high for a while after the run stops before falling back. The part after stopping is highlighted.',
    name: 'The same graph with the area after the run shaded. This extra breathing after exercise takes in the extra oxygen the body needs: the oxygen debt.',
    repay: 'The same graph beside a chain: breathing hard gets more oxygen into the lungs, the blood carries it, and it reaches the muscle cells.',
  }
  return <Diagram title={titles[step] || titles.after}>
    <rect x={dx(.2)} y={DG.y0 - DG.h} width={dx(.55) - dx(.2)} height={DG.h} fill="#fbeee9" />
    <text x={(dx(.2) + dx(.55)) / 2} y={DG.y0 - DG.h + 18} textAnchor="middle" fill={muscle} fontSize="12.5" fontWeight="700">running</text>
    {step !== 'after' && <path d={DEBT_AREA} fill={tealFill} stroke="none" />}
    <GraphAxes g={DG} xLabel="time →" yLabel="breathing rate" />
    <path d={DEBT_LINE} stroke={teal} strokeWidth="3.4" fill="none" strokeLinecap="round" opacity={step === 'after' ? faded : 1} />
    {step === 'after' && <path d={`M${dx(.55)} ${dy(.8)}C${dx(.62)} ${dy(.8)} ${dx(.66)} ${dy(.26)} ${dx(.88)} ${dy(.21)}`} stroke={teal} strokeWidth="4.4" fill="none" strokeLinecap="round" />}
    <path d={`M${dx(.55)} ${DG.y0}v-${DG.h}`} stroke={ink} strokeWidth="1.4" strokeDasharray="4 4" /><text x={dx(.55) + 5} y={DG.y0 - DG.h + 18} fill={ink} fontSize="12.5" fontWeight="700">stop</text>
    <text x={dx(.08)} y={dy(.2) - 10} fill={ink} fontSize="12">rest</text>
    {step === 'after' && <Label x={384} y={120} to={[dx(.64), dy(.56)]} lines={['still breathing', 'hard after you stop']} strong colour={teal} />}
    {step === 'name' && <Label x={384} y={120} to={[dx(.61), dy(.4)]} lines={['oxygen debt: extra', 'oxygen needed', 'after exercise']} strong colour={teal} />}
    {step === 'repay' && <g>
      <path d={blob(410, 64, 14, 24, 61, .04, .9)} fill={lungFill} stroke={lungLine} strokeWidth="1.8" /><path d={blob(442, 64, 14, 24, 62, .04, .9)} fill={lungFill} stroke={lungLine} strokeWidth="1.8" /><text x={466} y={68} fill={ink} fontSize="12.5" fontWeight="700">lungs</text>
      <Arrow x1={426} y1={96} x2={426} y2={122} colour={teal} width={2.2} />
      <ellipse cx={426} cy={142} rx={16} ry={10} fill="#c95e68" stroke="#a74454" strokeWidth="1.3" /><ellipse cx={426} cy={142} rx={8} ry={4} fill="#edb1af" /><O2 x={452} y={136} s={.8} /><text x={466} y={160} fill={ink} fontSize="12.5" fontWeight="700">blood</text>
      <Arrow x1={426} y1={160} x2={426} y2={186} colour={teal} width={2.2} />
      <MuscleFibre x={392} y={196} w={70} h={28} /><text x={466} y={216} fill={ink} fontSize="12.5" fontWeight="700">muscle</text>
      <text x={384} y={252} fill={teal} fontSize="12.5" fontWeight="700"><tspan x={384}>oxygen repaid to</tspan><tspan x={384} dy={16}>the muscle cells</tspan></text></g>}
  </Diagram>
}
function BodyQuestion({ assessment }: { assessment: boolean }) {
  const parts: Array<{ to: Pt; badge: Pt; name: string }> = [{ to: [128, 112], badge: [150, 90], name: 'lungs' }, { to: [158, 134], badge: [380, 110], name: 'heart' }, { to: [176, 226], badge: [380, 226], name: 'thigh muscle' }]
  return <Diagram title={assessment ? 'A body with three numbered parts: 1 in the upper chest on the left, 2 in the middle of the chest, 3 in the upper leg.' : 'A body with three numbered parts: 1 the lungs, 2 the heart, 3 a thigh muscle.'}>
    <g transform="translate(120 0)"><Body /></g>
    {parts.map((p, i) => <g key={i}><path d={`M${p.badge[0]} ${p.badge[1]}L${p.to[0] + 120} ${p.to[1]}`} stroke={ink} strokeWidth="1.5" /><circle cx={p.to[0] + 120} cy={p.to[1]} r="3" fill={ink} /><Badge n={i + 1} x={p.badge[0]} y={p.badge[1]} />
      {!assessment && <text x={p.badge[0] + (i ? 18 : -18)} y={p.badge[1] + 5} textAnchor={i ? 'start' : 'end'} fill={ink} fontSize="13" fontWeight="700">{p.name}</text>}</g>)}
  </Diagram>
}
function HeartData() {
  const A: Array<[number, number]> = [[0, 68], [2, 68], [3, 108], [4, 118], [5, 120], [6, 120], [7, 92], [8, 76], [9, 70], [10, 68], [11, 68], [12, 68]]
  const B: Array<[number, number]> = [[0, 72], [2, 72], [3, 128], [4, 146], [5, 150], [6, 150], [7, 138], [8, 120], [9, 104], [10, 92], [11, 82], [12, 76]]
  const X = (m: number) => 80 + m * 30, Y = (b: number) => 240 - (b - 50) * 1.6
  const line = (d: Array<[number, number]>) => d.map(([m, b], i) => `${i ? 'L' : 'M'}${X(m)} ${Y(b)}`).join('')
  return <Diagram title="Line graph of heart rate in beats per minute against time in minutes for two students, A and B. Both run from minute 2 to minute 6. A rises from 68 to 120 and is back to 68 by minute 10. B rises from 72 to 150 and is still at 76 at minute 12.">
    <text x={20} y={24} fill={ink} fontSize="14" fontWeight="700">Heart rate before, during and after a run</text>
    <rect x={X(2)} y={48} width={X(6) - X(2)} height={192} fill="#fbeee9" /><text x={X(4)} y={64} textAnchor="middle" fill={muscle} fontSize="12.5" fontWeight="700">running</text>
    <path d={`M80 48V240H${X(12)}`} stroke={ink} strokeWidth="2" fill="none" />
    {[50, 75, 100, 125, 150].map(b => <g key={b}><path d={`M74 ${Y(b)}h6`} stroke={ink} /><text x={70} y={Y(b) + 4} textAnchor="end" fill={ink} fontSize="12">{b}</text></g>)}
    {[0, 2, 4, 6, 8, 10, 12].map(m => <g key={m}><path d={`M${X(m)} 240v6`} stroke={ink} /><text x={X(m)} y={259} textAnchor="middle" fill={ink} fontSize="12">{m}</text></g>)}
    <text x={X(6)} y={280} textAnchor="middle" fill={ink} fontSize="12.5">time (minutes)</text>
    <text transform="translate(26 144) rotate(-90)" textAnchor="middle" fill={ink} fontSize="12.5">heart rate (beats per minute)</text>
    <path d={line(A)} stroke={teal} strokeWidth="3" fill="none" strokeLinejoin="round" />{A.map(([m, b]) => <circle key={m} cx={X(m)} cy={Y(b)} r="3.2" fill={teal} />)}
    <path d={line(B)} stroke={blood} strokeWidth="3" fill="none" strokeLinejoin="round" strokeDasharray="7 4" />{B.map(([m, b]) => <rect key={m} x={X(m) - 3.2} y={Y(b) - 3.2} width="6.4" height="6.4" fill={blood} />)}
    <Card x={452} y={90} w={76} h={70}><path d="M462 112h22" stroke={teal} strokeWidth="3" /><text x={490} y={117} fill={teal} fontSize="13" fontWeight="700">A</text><path d="M462 140h22" stroke={blood} strokeWidth="3" strokeDasharray="7 4" /><text x={490} y={145} fill={blood} fontSize="13" fontWeight="700">B</text></Card>
  </Diagram>
}

// Metabolism: building up (left) and breaking down (right). All these reactions are controlled by enzymes.
function Glycerol({ x, y }: { x: number; y: number }) { return <rect x={x - 5} y={y - 20} width={10} height={40} rx="4" fill="#dfe8c9" stroke="#78904a" strokeWidth="1.8" /> }
function FattyAcid({ x, y, len = 34 }: { x: number; y: number; len?: number }) {
  return <path d={`M${x} ${y}` + Array.from({ length: Math.round(len / 6) }, (_, i) => `l6 ${i % 2 ? 4 : -4}`).join('')} stroke="#b8862b" strokeWidth="2.4" fill="none" strokeLinejoin="round" strokeLinecap="round" />
}
function Bead({ x, y }: { x: number; y: number }) { return <circle cx={x} cy={y} r="5.5" fill="#f6dbe2" stroke="#c77b8f" strokeWidth="1.8" /> }
function Nitrate({ x, y }: { x: number; y: number }) {
  return <g>{[0, 120, 240].map(a => { const r = a * Math.PI / 180; return <circle key={a} cx={x + Math.cos(r - Math.PI / 2) * 7} cy={y + Math.sin(r - Math.PI / 2) * 7} r="3.4" fill="#f1e7d6" stroke="#8a6d45" strokeWidth="1.3" /> })}<circle cx={x} cy={y} r="4.2" fill="#8a6d45" /></g>
}
function Urea({ x, y }: { x: number; y: number }) { return <g><circle cx={x} cy={y} r="7" fill="#f3e9b8" stroke="#a08a2c" strokeWidth="1.8" /><circle cx={x - 8} cy={y + 5} r="3.4" fill="white" stroke="#a08a2c" strokeWidth="1.3" /><circle cx={x + 8} cy={y + 5} r="3.4" fill="white" stroke="#a08a2c" strokeWidth="1.3" /></g> }
function MetaScene({ focus }: { focus: string }) {
  const step = focus.replace('energy-meta-', '')
  const on = (row: string) => step === 'all' || step === row || (step === 'break' && (row === 'resp' || row === 'urea'))
  const titles: Record<string, string> = {
    reactions: 'A chart of reactions in cells, faded: building up on the left and breaking down on the right. All of them are controlled by enzymes.',
    build: 'Building up: glucose molecules are joined into long chains to make starch, glycogen and cellulose.',
    lipid: 'Building up: one glycerol and three fatty acids join to make a lipid molecule.',
    protein: 'Building up: glucose and nitrate ions make amino acids, which join into a chain to make a protein.',
    break: 'Breaking down: glucose is broken down in respiration into carbon dioxide and water, transferring energy. Extra protein is broken down into urea, which leaves the body in urine.',
    all: 'The whole chart. Building up: starch, glycogen and cellulose from glucose; lipids from glycerol and fatty acids; proteins from amino acids. Breaking down: glucose in respiration; extra protein to urea. Together these are metabolism.',
  }
  const T = (x: number, y: number, t: string, c = ink) => <text x={x} y={y} textAnchor="middle" fill={c} fontSize="12.5" fontWeight="700">{t}</text>
  return <Diagram viewBox="0 0 540 320" title={titles[step] || titles.all}>
    <text x={139} y={26} textAnchor="middle" fill={P.deepGreen} fontSize="14" fontWeight="700">building up</text><text x={405} y={26} textAnchor="middle" fill={warm} fontSize="14" fontWeight="700">breaking down</text>
    <path d="M272 16V272" stroke={panelLine} strokeWidth="2" />
    <g opacity={on('build') ? 1 : faded}>{[34, 54, 74].map(x => <Glucose key={x} x={x} y={70} />)}<Arrow x1={90} y1={70} x2={114} y2={70} colour={ink} width={2} />
      {Array.from({ length: 7 }, (_, i) => <g key={i}>{i > 0 && <path d={`M${128 + (i - 1) * 19 + 7} 70L${128 + i * 19 - 7} 70`} stroke={sugar} strokeWidth="2" />}<Glucose x={128 + i * 19} y={70} s={.85} /></g>)}
      {T(139, 102, 'starch · glycogen · cellulose', sugar)}</g>
    <g opacity={on('lipid') ? 1 : faded}><Glycerol x={36} y={154} />{[-12, 0, 12].map(d => <FattyAcid key={d} x={52} y={154 + d} len={26} />)}<Arrow x1={92} y1={154} x2={116} y2={154} colour={ink} width={2} />
      <Glycerol x={136} y={154} />{[-12, 0, 12].map(d => <FattyAcid key={d} x={141} y={154 + d} len={46} />)}
      {T(139, 194, '1 glycerol + 3 fatty acids → lipid', '#8a6d2a')}</g>
    <g opacity={on('protein') ? 1 : faded}><Glucose x={28} y={236} /><text x={46} y={241} textAnchor="middle" fill={ink} fontSize="13">+</text><Nitrate x={64} y={236} /><Arrow x1={78} y1={236} x2={96} y2={236} colour={ink} width={2} /><Bead x={108} y={236} />
      <Arrow x1={120} y1={236} x2={140} y2={236} colour={ink} width={2} />{Array.from({ length: 6 }, (_, i) => <g key={i}>{i > 0 && <path d={`M${152 + (i - 1) * 18 + 5} ${236 + Math.sin(i - 1) * 6}L${152 + i * 18 - 5} ${236 + Math.sin(i) * 6}`} stroke="#c77b8f" strokeWidth="2" />}<Bead x={152 + i * 18} y={236 + Math.sin(i) * 6} /></g>)}
      {T(139, 272, 'amino acids → protein', '#a25a6d')}</g>
    <g opacity={on('resp') ? 1 : faded}><Glucose x={298} y={84} /><text x={316} y={89} textAnchor="middle" fill={ink} fontSize="13">+</text><O2 x={336} y={84} /><Arrow x1={352} y1={84} x2={378} y2={84} colour={ink} width={2} /><CO2 x={402} y={84} /><text x={426} y={89} textAnchor="middle" fill={ink} fontSize="13">+</text><H2O x={446} y={80} /><Spark x={482} y={84} />
      {T(405, 122, 'glucose broken down in respiration', warm)}</g>
    <g opacity={on('urea') ? 1 : faded}>{Array.from({ length: 5 }, (_, i) => <g key={i}>{i > 0 && <path d={`M${296 + (i - 1) * 16 + 5} 190L${296 + i * 16 - 5} 190`} stroke="#c77b8f" strokeWidth="2" />}<Bead x={296 + i * 16} y={190} /></g>)}<Arrow x1={372} y1={190} x2={398} y2={190} colour={ink} width={2} /><Urea x={418} y={188} />
      <Arrow x1={434} y1={190} x2={458} y2={190} colour={ink} width={2} /><path d="M480 174c9 12 12 18 12 23a12 12 0 0 1 -24 0c0 -5 3 -11 12 -23z" fill="#f6ec9f" stroke="#b89b2c" strokeWidth="1.6" />
      {T(405, 228, 'extra protein → urea → urine', '#8a7a2a')}</g>
    {(step === 'reactions' || step === 'all') && <Tag x={270} y={302} text={step === 'all' ? 'all of these together = metabolism' : 'every reaction is controlled by enzymes'} colour={ink} fill="white" anchor="middle" />}
  </Diagram>
}

export function RespirationVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus === 'energy-graph-question') return <GraphQuestion assessment={assessment} />
  if (focus === 'energy-rp-question') return <RigQuestion assessment={assessment} />
  if (focus === 'energy-rp-mean') return <MeanWorked />
  if (focus === 'energy-rp-data') return <RigData />
  if (focus === 'energy-cell-question') return <CellQuestion assessment={assessment} />
  if (focus === 'energy-aerobic-question') return <AerobicQuestion assessment={assessment} />
  if (focus === 'energy-yeast-data') return <YeastData />
  if (focus === 'energy-body-question') return <BodyQuestion assessment={assessment} />
  if (focus === 'energy-heart-data') return <HeartData />
  if (focus.startsWith('energy-resp-')) return <RespScene focus={focus} />
  if (focus.startsWith('energy-aerobic-')) return <AerobicScene focus={focus} />
  if (focus.startsWith('energy-anaerobic-')) return <AnaerobicScene focus={focus} />
  if (focus.startsWith('energy-yeast-')) return <YeastScene focus={focus} />
  if (focus.startsWith('energy-exercise-')) return <ExerciseScene focus={focus} />
  if (focus.startsWith('energy-hard-')) return <HardScene focus={focus} />
  if (focus.startsWith('energy-debt-')) return <DebtScene focus={focus} />
  if (focus.startsWith('energy-meta-')) return <MetaScene focus={focus} />
  if (focus.startsWith('energy-limit-')) return <LimitScene focus={focus} />
  if (focus.startsWith('energy-graph-')) return <GraphScene focus={focus} />
  if (focus.startsWith('energy-temp-')) return <TempScene focus={focus} />
  if (focus.startsWith('energy-rp-')) return <RigScene focus={focus} />
  return <LimitScene focus="energy-limit-rate" />
}
