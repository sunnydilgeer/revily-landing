import type { ReactNode } from 'react'
import { AnatomyFigure, Pointer, type AnatomyLabel } from './anatomy/AnatomyFigure'
import { Arrow, blob } from './InfectionVisuals'
import { leafPath, plantPalette as P } from './PlantOrganisationVisuals'

// Higher-only diagrams for chapter B4 (focus ids start with 'hphoto-'). Original, code-native schematics; not to scale.
// Same colour code as the Foundation B4 diagrams: yellow = light, purple = carbon dioxide, blue = water, amber = glucose,
// teal = oxygen, green = plant, orange = temperature, brick = lactic acid. Each section reuses one drawing and highlights
// one part per frame, with numbered pointers and a key underneath (as in the anatomy figures).
type Pt = [number, number]
const r1 = (n: number) => Math.round(n * 10) / 10
const ink = '#304659', faded = .28
const sunFill = '#f6d25e', sunLine = '#c9951c', lightInk = '#a77c12', lightWash = '#fbe9a6'
const co2 = P.purple, co2Fill = '#e9e0f6', teal = '#2f9c95', tealFill = '#d5efec', h2o = P.blue, h2oFill = '#dcf0f8'
const sugar = P.amber, sugarFill = P.amberFill, warm = '#cf6a33', warmFill = '#fbe1d1', cool = '#4f86b5'
const lactic = '#b4533a', lacticFill = '#f6dcd2', green = P.deepGreen, leafFill = '#a9d49a'
const panel = '#f7fafc', panelLine = '#cfdde7'

// ---------- Small shared pieces ----------
function T({ x, y, lines, size = 13, bold = false, colour = ink, anchor = 'start' }: { x: number; y: number; lines: string[]; size?: number; bold?: boolean; colour?: string; anchor?: 'start' | 'middle' | 'end' }) {
  return <text x={x} y={y} textAnchor={anchor} fill={colour} fontSize={size} fontWeight={bold ? 700 : 500}>{lines.map((l, i) => <tspan key={i} x={x} dy={i ? size + 3 : 0}>{l}</tspan>)}</text>
}
function Card({ x, y, w, h, children, tint = panel, line = panelLine }: { x: number; y: number; w: number; h: number; children?: ReactNode; tint?: string; line?: string }) {
  return <g><rect x={x} y={y} width={w} height={h} rx="12" fill={tint} stroke={line} strokeWidth="1.6" />{children}</g>
}
function CO2({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g>{[-9, 9].map(d => <circle key={d} cx={x + d * s} cy={y} r={5.5 * s} fill={co2Fill} stroke={co2} strokeWidth={1.6} />)}<circle cx={x} cy={y} r={5 * s} fill={co2} /></g>
}
function O2({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g>{[-4.5, 4.5].map(d => <circle key={d} cx={x + d * s} cy={y} r={5.5 * s} fill={tealFill} stroke={teal} strokeWidth={1.6} />)}</g>
}
function H2O({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g><circle cx={x} cy={y} r={6.5 * s} fill={h2oFill} stroke={h2o} strokeWidth={1.6} />{[-1, 1].map(d => <circle key={d} cx={x + d * 7.5 * s} cy={y + 5.5 * s} r={3.6 * s} fill="white" stroke={h2o} strokeWidth={1.4} />)}</g>
}
function hexPath(x: number, y: number, r: number) { return Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 6 + i * Math.PI / 3; return `${i ? 'L' : 'M'}${r1(x + Math.cos(a) * r)} ${r1(y + Math.sin(a) * r)}` }).join('') + 'Z' }
function Glucose({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path d={hexPath(x, y, 8 * s)} fill={sugarFill} stroke={sugar} strokeWidth="2" strokeLinejoin="round" />
}
// Lactic acid: half a glucose hexagon, as in the Foundation respiration diagrams (glucose only partly broken down).
function Lactic({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const r = 8 * s, h = r * Math.sqrt(3) / 2
  return <path d={`M${r1(x - r)} ${r1(y + h / 2)}L${r1(x - r / 2)} ${r1(y - h / 2)}L${r1(x + r / 2)} ${r1(y - h / 2)}L${r1(x + r)} ${r1(y + h / 2)}Z`} fill={lacticFill} stroke={lactic} strokeWidth="2" strokeLinejoin="round" />
}
function SunIcon({ x, y, r = 8 }: { x: number; y: number; r?: number }) {
  return <g><circle cx={x} cy={y} r={r} fill={sunFill} stroke={sunLine} strokeWidth="1.5" />{Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return <path key={i} d={`M${r1(x + Math.cos(a) * (r + 3))} ${r1(y + Math.sin(a) * (r + 3))}L${r1(x + Math.cos(a) * (r + 7))} ${r1(y + Math.sin(a) * (r + 7))}`} stroke={sunLine} strokeWidth="1.8" strokeLinecap="round" /> })}</g>
}

// ---------- Graph helpers ----------
type Axes = { x0: number; y0: number; w: number; h: number }
function Axes({ g, xLabel, yLabel, xIcon }: { g: Axes; xLabel: string; yLabel: string; xIcon?: ReactNode }) {
  return <g>
    <path d={`M${g.x0} ${g.y0 - g.h - 6}V${g.y0}H${g.x0 + g.w + 6}`} stroke={ink} strokeWidth="2" fill="none" />
    <path d={`M${g.x0 - 5} ${g.y0 - g.h}L${g.x0} ${g.y0 - g.h - 9}L${g.x0 + 5} ${g.y0 - g.h}M${g.x0 + g.w} ${g.y0 - 5}L${g.x0 + g.w + 9} ${g.y0}L${g.x0 + g.w} ${g.y0 + 5}`} stroke={ink} strokeWidth="2" fill="none" />
    <text transform={`translate(${g.x0 - 14} ${g.y0 - g.h / 2}) rotate(-90)`} textAnchor="middle" fill={ink} fontSize="13">{yLabel}</text>
    <text x={g.x0 + g.w / 2} y={g.y0 + 24} textAnchor="middle" fill={ink} fontSize="13">{xLabel}</text>
    {xIcon}
  </g>
}
// Rate against light as a smoothed "rise, then level off" (a non-rectangular hyperbola). Every line starts with the same
// slope, because light limits all of them at first, and levels off at its own height, set by the other factor.
function lightCurve(g: Axes, top: number, k = 2.6, bend = .93) {
  const rate = (t: number) => { const s = k * t + top; return (s - Math.sqrt(s * s - 4 * bend * k * t * top)) / (2 * bend) }
  const at = (t: number): Pt => [r1(g.x0 + t * g.w), r1(g.y0 - rate(t) * g.h)]
  const path = (from = 0, to = 1) => Array.from({ length: 41 }, (_, i) => at(from + (to - from) * i / 40)).map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('')
  return { at, path }
}
function Line({ d, colour, dashed = false, on = true, width = 4 }: { d: string; colour: string; dashed?: boolean; on?: boolean; width?: number }) {
  return <path d={d} stroke={colour} strokeWidth={on ? width : width - 1} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? '9 7' : undefined} opacity={on ? 1 : faded} />
}

// ---------- Section 1: two limiting factors on one graph ----------
type Pair = { hi: string; lo: string; hiColour: string; loColour: string; same: string }
const TEMP_PAIR: Pair = { hi: '25 °C', lo: '15 °C', hiColour: warm, loColour: cool, same: '' }
const CO2_PAIR: Pair = { hi: '0.1% CO₂', lo: '0.04% CO₂', hiColour: co2, loColour: '#b59bd8', same: 'both at 25 °C' }
const HI = .82, LO = .5
function TwoLineGraph({ g, pair, step, numbered = true, small = false }: { g: Axes; pair: Pair; step: string; numbered?: boolean; small?: boolean }) {
  const hi = lightCurve(g, HI), lo = lightCurve(g, LO)
  const rising = step === 'rise', flat = step === 'flat', gap = step === 'gap' || step === 'co2'
  const all = step === 'all' || step === 'question'
  // Split each line into its rising part (t < .22, where the two lines lie together) and the rest.
  const split = .13
  const fs = small ? 12 : 13
  const gapX = g.x0 + g.w * .9
  return <g>
    {(rising || step === 'all') && <path d={`M${g.x0} ${g.y0}L${hi.at(split)[0]} ${g.y0}L${hi.at(split)[0]} ${g.y0 - g.h}L${g.x0} ${g.y0 - g.h}Z`} fill={lightWash} opacity={rising ? .55 : .3} />}
    <Axes g={g} yLabel="rate of photosynthesis" xLabel="light intensity" xIcon={<SunIcon x={g.x0 + g.w / 2 + (small ? 62 : 70)} y={g.y0 + 19} r={small ? 6 : 7} />} />
    <Line d={hi.path(0, split)} colour={pair.hiColour} on={!flat} />
    <Line d={lo.path(0, split)} colour={pair.loColour} dashed on={!flat} />
    <Line d={hi.path(split, 1)} colour={pair.hiColour} on={!rising} />
    <Line d={lo.path(split, 1)} colour={pair.loColour} dashed on={!rising} />
    <T x={g.x0 + g.w + 2} y={hi.at(1)[1] - 10} lines={[pair.hi]} size={fs} bold colour={pair.hiColour} anchor="end" />
    <T x={g.x0 + g.w + 2} y={lo.at(1)[1] + 22} lines={[pair.lo]} size={fs} bold colour={pair.loColour} anchor="end" />
    {pair.same && <T x={g.x0 + g.w} y={g.y0 - 14} lines={[pair.same]} size={fs} bold colour={warm} anchor="end" />}
    {(gap || all) && step !== 'question' && <g>
      <path d={`M${gapX} ${lo.at(.9)[1] - 6}V${hi.at(.9)[1] + 7}`} stroke={ink} strokeWidth="2" />
      <path d={`M${gapX - 5} ${hi.at(.9)[1] + 13}L${gapX} ${hi.at(.9)[1] + 5}L${gapX + 5} ${hi.at(.9)[1] + 13}`} stroke={ink} strokeWidth="2" fill="none" />
    </g>}
    {numbered && <>
      {<Pointer mark="1" x={lo.at(.07)[0] + 62} y={lo.at(.07)[1] + 8} toX={lo.at(.07)[0]} toY={lo.at(.07)[1]} active={rising} />}
      {!rising && step !== 'question' && <>
        <Pointer mark="2" x={hi.at(.62)[0]} y={g.y0 - g.h * (small ? .2 : .2)} toX={lo.at(.66)[0]} toY={lo.at(.66)[1]} active={flat} />
        <Pointer mark="2" x={hi.at(.5)[0]} y={g.y0 - g.h - (small ? 2 : 10)} toX={hi.at(.62)[0]} toY={hi.at(.62)[1]} active={flat} />
      </>}
      {(gap || all) && step !== 'question' && <Pointer mark="3" x={gapX - (small ? 44 : 60)} y={(hi.at(.9)[1] + lo.at(.9)[1]) / 2} toX={gapX} toY={(hi.at(.9)[1] + lo.at(.9)[1]) / 2} active={gap} />}
    </>}
  </g>
}
function TwoFactorScene({ focus, assessment }: { focus: string; assessment: boolean }) {
  const step = focus.replace('hphoto-two-', '')
  if (step === 'question') {
    const g: Axes = { x0: 90, y0: 300, w: 400, h: 250 }, lo = lightCurve(g, LO)
    return <AnatomyFigure title="Rate at two temperatures" height={350}
      description={assessment ? 'Graph of rate of photosynthesis against light intensity with two lines, one at 25 °C and one at 15 °C. Both start together and rise, then level off; the 25 °C line levels off higher. Point 1 is on the shared rising part. Point 2 is on the flat part of the 15 °C line. Original schematic, not to scale.'
        : 'The same graph. Point 1 is on the shared rising part, where light intensity is limiting. Point 2 is on the flat part of the 15 °C line, where temperature is limiting, because the 25 °C line levels off higher. Original schematic, not to scale.'}
      labels={assessment ? undefined : [
        { mark: '1', name: 'Still rising', detail: 'Light intensity is the limiting factor.' },
        { mark: '2', name: 'Flat part of the 15 °C line', detail: 'Temperature is limiting: at 25 °C the rate goes higher.' },
      ]}
      note="The two lines show one plant species at two temperatures. Original schematic, not to scale.">
      {() => <>
        <TwoLineGraph g={g} pair={TEMP_PAIR} step="question" numbered={false} />
        <circle cx={lo.at(.07)[0]} cy={lo.at(.07)[1]} r="4.5" fill={ink} /><circle cx={lo.at(.75)[0]} cy={lo.at(.75)[1]} r="4.5" fill={ink} />
        <Pointer mark="1" x={150} y={150} toX={lo.at(.07)[0]} toY={lo.at(.07)[1]} />
        <Pointer mark="2" x={lo.at(.75)[0]} y={lo.at(.75)[1] + 70} toX={lo.at(.75)[0]} toY={lo.at(.75)[1]} />
      </>}
    </AnatomyFigure>
  }
  if (step === 'all') {
    const L: Axes = { x0: 56, y0: 300, w: 220, h: 220 }, R: Axes = { x0: 346, y0: 300, w: 220, h: 220 }
    return <AnatomyFigure title="Reading a two-line graph" height={350}
      description="Two graphs side by side, both of rate of photosynthesis against light intensity. Left: lines at 25 °C and 15 °C. Right: lines at 0.1% and 0.04% carbon dioxide, both at 25 °C. On each, the lines rise together while light is limiting, then level off; the line with more of the other factor levels off higher. Original schematic, not to scale."
      labels={[
        { mark: '1', name: 'Rising together', detail: 'Light intensity is limiting.', active: true },
        { mark: '2', name: 'Levelled off', detail: 'Light is no longer limiting.', active: true },
        { mark: '3', name: 'The gap', detail: 'Whatever differs between the lines limited the lower one.', active: true },
      ]}
      note="Dashed line = less of the second factor. Original schematic, not to scale.">
      {() => <>
        <TwoLineGraph g={L} pair={TEMP_PAIR} step="all" small />
        <TwoLineGraph g={R} pair={CO2_PAIR} step="all" small />
      </>}
    </AnatomyFigure>
  }
  const g: Axes = { x0: 90, y0: 300, w: 400, h: 250 }
  const pair = step === 'co2' ? CO2_PAIR : TEMP_PAIR
  const isCO2 = step === 'co2'
  const descriptions: Record<string, string> = {
    rise: 'Graph of rate of photosynthesis against light intensity with two lines, at 25 °C and at 15 °C. At low light the two lines rise together; this shared rising part is highlighted. Here light intensity is the limiting factor.',
    flat: 'The same graph. Further along, each line levels off; the flat parts are highlighted. More light makes no difference there, so light is no longer limiting.',
    gap: 'The same graph. The 25 °C line levels off higher than the 15 °C line. An arrow marks the gap between them: temperature was limiting the 15 °C line.',
    co2: 'Graph of rate of photosynthesis against light intensity with two lines, at 0.1% and 0.04% carbon dioxide, both at 25 °C. The 0.1% line levels off higher. An arrow marks the gap: carbon dioxide was limiting the 0.04% line.',
  }
  const labels: AnatomyLabel[] = [
    { mark: '1', name: 'Rising together', detail: 'More light, faster: light intensity is limiting.', active: step === 'rise' },
    { mark: '2', name: 'Levelled off', detail: 'More light, no faster: light is no longer limiting.', active: step === 'flat' },
    { mark: '3', name: 'The gap', detail: isCO2 ? 'Only carbon dioxide differs, so it limited the 0.04% line.' : 'Only temperature differs, so it limited the 15 °C line.', active: step === 'gap' || isCO2 },
  ]
  const shown = step === 'rise' ? labels.slice(0, 1) : step === 'flat' ? labels.slice(0, 2) : labels
  return <AnatomyFigure title={isCO2 ? 'Light and carbon dioxide' : 'Light and temperature'} height={350} description={`${descriptions[step] || descriptions.rise} Original schematic, not to scale.`} labels={shown}
    note={isCO2 ? 'Normal air is about 0.04% carbon dioxide. Dashed line = less carbon dioxide. Original schematic, not to scale.' : 'Dashed line = the cooler plant. Original schematic, not to scale.'}>
    {() => <TwoLineGraph g={g} pair={pair} step={step} />}
  </AnatomyFigure>
}

// ---------- Section 2: distance, the inverse square law and greenhouse costs ----------
const ROOF: Pt[] = [[24, 130], [150, 46], [276, 130]]
function Greenhouse({ lampY, step }: { lampY: number; step: string }) {
  const leaves = [
    { node: [150, 236] as Pt, angle: -150, length: 46, width: 16 }, { node: [150, 236] as Pt, angle: -30, length: 46, width: 16 },
    { node: [151, 212] as Pt, angle: -140, length: 40, width: 14 }, { node: [151, 212] as Pt, angle: -40, length: 40, width: 14 },
    { node: [150, 192] as Pt, angle: -115, length: 30, width: 11 }, { node: [150, 192] as Pt, angle: -65, length: 30, width: 11 },
  ]
  const cost = step === 'cost'
  return <g>
    {/* Glass house */}
    <path d={`M24 330V130L150 46L276 130V330Z`} fill="#eef6f8" stroke="#8fb7c6" strokeWidth="2.4" />
    <path d="M87 88V330M213 88V330M24 210H276" stroke="#bcd6df" strokeWidth="1.6" fill="none" />
    <path d="M14 330H286" stroke="#b9a17c" strokeWidth="4" strokeLinecap="round" />
    {/* Bench and pot */}
    <path d="M70 286H230M84 286V330M216 286V330" stroke="#a88a62" strokeWidth="5" strokeLinecap="round" />
    <path d="M128 252H172L166 284H134Z" fill="#e2b48c" stroke="#a8714b" strokeWidth="2" strokeLinejoin="round" />
    {/* Light cone from the lamp to the leaves */}
    <path d={`M140 ${lampY + 14}L92 236Q150 252 208 236L160 ${lampY + 14}Z`} fill={lightWash} opacity={.65} />
    {/* Tomato plant */}
    <path d="M150 254C148 236 153 214 150 186" stroke={green} strokeWidth="5" fill="none" strokeLinecap="round" />
    {leaves.map((l, i) => { const p = leafPath(l); return <g key={i}><path d={p.outline} fill={leafFill} stroke={green} strokeWidth="2" /><path d={p.rib} stroke={green} strokeWidth="1.2" /></g> })}
    {[[118, 222], [184, 220]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="7" fill="#e5735f" stroke="#b44b3c" strokeWidth="1.6" /><path d={`M${x - 3} ${y - 7}l3 2l3 -2`} stroke={green} strokeWidth="1.6" fill="none" /></g>)}
    {/* Lamp on a cord from the roof */}
    <path d={`M150 54V${lampY}`} stroke={ink} strokeWidth="1.8" />
    <path d={`M134 ${lampY + 14}L140 ${lampY}H160L166 ${lampY + 14}Z`} fill="#5d6f7e" stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />
    <ellipse cx={150} cy={lampY + 16} rx="9" ry="5" fill={sunFill} stroke={sunLine} strokeWidth="1.4" />
    {/* Distance from lamp to the leaves */}
    <g opacity={step === 'spread' || step === 'cost' ? .55 : 1}>
      <path d={`M236 ${lampY + 16}V190`} stroke={lightInk} strokeWidth="2" />
      <path d={`M231 ${lampY + 24}L236 ${lampY + 16}L241 ${lampY + 24}M231 182L236 190L241 182`} stroke={lightInk} strokeWidth="2" fill="none" />
      <path d={`M226 ${lampY + 16}H246M226 190H246`} stroke={lightInk} strokeWidth="1.4" strokeDasharray="3 3" />
      <T x={246} y={(lampY + 16 + 190) / 2 + 5} lines={['d']} size={16} bold colour={lightInk} />
    </g>
    {/* Paraffin heater: heat and carbon dioxide */}
    {cost && <g>
      <rect x={232} y={292} width={30} height={34} rx="5" fill="#d9dee3" stroke={ink} strokeWidth="1.8" />
      <rect x={238} y={300} width={18} height={10} rx="2" fill={warmFill} stroke={warm} strokeWidth="1.4" />
      {[0, 1, 2].map(i => <path key={i} d={`M${238 + i * 9} 286c-5 -8 5 -12 0 -20`} stroke={warm} strokeWidth="1.8" fill="none" strokeLinecap="round" />)}
      <CO2 x={250} y={252} s={.8} /><CO2 x={226} y={236} s={.8} />
    </g>}
  </g>
}
// Light from a point spreading out. An oblique drawing is linear, so the rays through the near square's corners land exactly
// on the far square's corners: at twice the distance the same light covers 2 × 2 = 4 squares.
function SpreadPanel() {
  const o: Pt = [330, 196]
  const pt = (X: number, y: number, z: number): Pt => [r1(o[0] + X + .45 * z), r1(o[1] - y - .3 * z)]
  const sq = (X: number, h: number) => [pt(X, h, -h), pt(X, h, h), pt(X, -h, h), pt(X, -h, -h)]
  const near = sq(92, 24), far = sq(184, 48)
  const poly = (ps: Pt[]) => ps.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('') + 'Z'
  return <g>
    {far.map(([x, y], i) => <path key={i} d={`M${o[0]} ${o[1]}L${x} ${y}`} stroke={sunLine} strokeWidth="1.3" opacity=".75" />)}
    <path d={poly(far)} fill={lightWash} stroke={sunLine} strokeWidth="2" opacity=".95" />
    <path d={`M${pt(184, 0, -48).join(' ')}L${pt(184, 0, 48).join(' ')}M${pt(184, 48, 0).join(' ')}L${pt(184, -48, 0).join(' ')}`} stroke={sunLine} strokeWidth="1.6" />
    <path d={poly(near)} fill={sunFill} stroke={sunLine} strokeWidth="2" opacity=".9" />
    <circle cx={o[0]} cy={o[1]} r="9" fill={sunFill} stroke={sunLine} strokeWidth="1.8" />
    {[[92, 'd', 278], [184, '2d', 312]].map(([X, name, y]) => <g key={name as string}>
      <path d={`M${o[0]} ${y}H${o[0] + (X as number)}M${o[0]} ${(y as number) - 6}v12M${o[0] + (X as number)} ${(y as number) - 6}v12`} stroke={ink} strokeWidth="1.4" />
      <T x={o[0] + (X as number) + 10} y={(y as number) + 5} lines={[name as string]} size={14} bold colour={lightInk} />
    </g>)}
    <T x={o[0] + 104} y={92} lines={['1 square']} size={13} bold anchor="middle" />
    <T x={o[0] + 214} y={92} lines={['4 squares']} size={13} bold anchor="middle" />
    <T x={o[0] + 214} y={108} lines={['each gets ¼']} size={13} anchor="middle" />
  </g>
}
// Light intensity = 1 ÷ d², plotted for d from 8 cm to 40 cm.
const IG: Axes = { x0: 404, y0: 270, w: 176, h: 190 }
const ix = (d: number) => r1(IG.x0 + (d - 0) / 40 * IG.w), iy = (v: number) => r1(IG.y0 - v / .016 * IG.h)
const INV_PATH = Array.from({ length: 49 }, (_, i) => 8 + i * .667).map((d, i) => `${i ? 'L' : 'M'}${ix(d)} ${iy(1 / (d * d))}`).join('')
function InverseGraph({ step }: { step: string }) {
  return <g>
    <path d={`M${IG.x0} ${IG.y0 - IG.h - 6}V${IG.y0}H${IG.x0 + IG.w + 6}`} stroke={ink} strokeWidth="2" fill="none" />
    {[10, 20, 30, 40].map(d => <g key={d}><path d={`M${ix(d)} ${IG.y0}v6`} stroke={ink} /><text x={ix(d)} y={IG.y0 + 19} textAnchor="middle" fill={ink} fontSize="12">{d}</text></g>)}
    {[0, .005, .01, .015].map(v => <g key={v}><path d={`M${IG.x0 - 6} ${iy(v)}h6`} stroke={ink} /><text x={IG.x0 - 9} y={iy(v) + 4} textAnchor="end" fill={ink} fontSize="12">{v}</text></g>)}
    <text x={IG.x0 + IG.w / 2} y={IG.y0 + 38} textAnchor="middle" fill={ink} fontSize="13">distance from lamp, d (cm)</text>
    <text transform={`translate(${IG.x0 - 56} ${IG.y0 - IG.h / 2}) rotate(-90)`} textAnchor="middle" fill={ink} fontSize="13">light intensity (a.u.)</text>
    <path d={INV_PATH} stroke={sunLine} strokeWidth="3.6" fill="none" strokeLinecap="round" />
    {step === 'farther' && <Arrow x1={ix(15)} y1={iy(.0105)} x2={ix(30)} y2={iy(.0034)} colour={lightInk} width={2.4} />}
    {step === 'farther' && <T x={588} y={iy(.0145)} lines={['further away:', 'dimmer']} size={13} bold colour={lightInk} anchor="end" />}
    {(step === 'halve' || step === 'calc') && <g>
      <path d={`M${ix(20)} ${IG.y0}V${iy(.0025)}H${IG.x0}`} stroke={ink} strokeWidth="1.4" strokeDasharray="4 4" fill="none" />
      <circle cx={ix(20)} cy={iy(.0025)} r="5" fill="white" stroke={ink} strokeWidth="2" />
    </g>}
    {step === 'halve' && <g>
      <path d={`M${ix(10)} ${IG.y0}V${iy(.01)}H${IG.x0}`} stroke={ink} strokeWidth="1.4" strokeDasharray="4 4" fill="none" />
      <circle cx={ix(10)} cy={iy(.01)} r="5" fill="white" stroke={ink} strokeWidth="2" />
      <T x={588} y={iy(.0145)} lines={['½ the distance', '→ 4 × the light']} size={13} bold colour={lightInk} anchor="end" />
    </g>}
  </g>
}
function CalcCard() {
  return <Card x={462} y={74} w={126} h={112} tint="#fffaf0" line="#ecd9a8">
    <T x={474} y={96} lines={['d = 20 cm']} size={13} bold />
    <T x={474} y={118} lines={['20² = 400']} size={13} />
    <T x={474} y={140} lines={['1 ÷ 400']} size={13} />
    <T x={474} y={170} lines={['= 0.0025 a.u.']} size={13} bold colour={lightInk} />
  </Card>
}
function CostPanel() {
  const g: Axes = { x0: 350, y0: 270, w: 220, h: 200 }
  const c = lightCurve(g, .78, 2.6), bend = .5
  return <g>
    <path d={`M${c.at(bend)[0]} ${g.y0}V${g.y0 - g.h}H${g.x0 + g.w}V${g.y0}Z`} fill="#f4ecec" />
    <Axes g={g} yLabel="growth rate" xLabel="money spent on heat, light, CO₂" />
    <path d={c.path(0, bend)} stroke={green} strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d={c.path(bend, 1)} stroke={green} strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="2 7" />
    <T x={g.x0 + 12} y={g.y0 - g.h + 16} lines={['worth it:', 'faster growth']} size={13} bold colour={green} />
    <T x={c.at(bend)[0] + 10} y={g.y0 - 40} lines={['extra spending', 'is wasted']} size={13} bold colour="#a2524f" />
  </g>
}
function LightCostScene({ focus }: { focus: string }) {
  const step = focus.replace('hphoto-isl-', '')
  const lampY = 108
  const descriptions: Record<string, string> = {
    farther: 'A tomato plant on a bench in a greenhouse, with a lamp hanging above it at distance d. Beside it, a graph of light intensity against distance from the lamp: it falls steeply at first, then more slowly. The further away, the dimmer.',
    spread: 'The greenhouse lamp, with a drawing of light spreading from a lamp. At distance d the light covers one square. At distance 2d the same light covers four squares, so each square gets a quarter: the inverse square law.',
    halve: 'The greenhouse lamp beside the graph of light intensity against distance. At 20 cm the light intensity is 0.0025; at 10 cm it is 0.01. Halving the distance makes the light four times greater.',
    calc: 'The greenhouse lamp beside a worked calculation: the lamp is 20 cm away, 20 squared is 400, and 1 divided by 400 is 0.0025 arbitrary units. The point is marked on the graph.',
    cost: 'The greenhouse with a lamp and a paraffin heater, which gives off heat and carbon dioxide. Beside it, a graph of growth rate against money spent on heat, light and carbon dioxide: it rises, then levels off, where extra spending is wasted.',
  }
  const n = { farther: 1, spread: 2, halve: 3, calc: 3, cost: 4 }[step] || 1
  const labels: AnatomyLabel[] = [
    { mark: '1', name: 'Lamp', detail: 'Extra light for photosynthesis.', active: step === 'cost' },
    { mark: '2', name: 'Distance, d', detail: 'From the lamp to the leaves.', active: step === 'farther' || step === 'halve' || step === 'calc' },
    { mark: '3', name: 'Light intensity', detail: step === 'farther' ? 'How bright the light is at the leaves.' : 'Proportional to 1 ÷ d²: the inverse square law.', active: step === 'spread' || step === 'halve' || step === 'calc' },
    ...(n === 4 ? [{ mark: '4', name: 'Paraffin heater', detail: 'Gives heat and carbon dioxide.', active: true }] : []),
  ]
  return <AnatomyFigure title={step === 'cost' ? 'Paying for faster growth' : 'Light and distance'} height={350} description={`${descriptions[step] || descriptions.farther} Original schematic, not to scale.`} labels={labels}
    note={step === 'cost' ? 'Add heat, light or carbon dioxide only while it is the limiting factor. Original schematic, not to scale.' : 'a.u. = arbitrary units: a measure that lets you compare, with no real unit. Original schematic, not to scale.'}>
    {() => <>
      <Greenhouse lampY={lampY} step={step} />
      {step === 'spread' && <SpreadPanel />}
      {(step === 'farther' || step === 'halve' || step === 'calc') && <InverseGraph step={step} />}
      {step === 'calc' && <CalcCard />}
      {step === 'cost' && <CostPanel />}
      <Pointer mark="1" x={60} y={84} toX={140} toY={lampY + 6} active={step === 'cost'} />
      <Pointer mark="2" x={300} y={160} toX={240} toY={150} active={step === 'farther' || step === 'halve' || step === 'calc'} />
      <Pointer mark="3" x={60} y={180} toX={112} toY={204} active={step === 'spread' || step === 'halve' || step === 'calc'} />
      {step === 'cost' && <Pointer mark="4" x={300} y={300} toX={262} toY={306} active />}
    </>}
  </AnatomyFigure>
}

// ---------- Section 3: lactic acid to the liver, and the oxygen debt ----------
const skin = '#f1dcc8', skinLine = '#b9906f', lungFill = '#f3c9c0', lungLine = '#c77f75', liverFill = '#b9675a', liverLine = '#8a4338'
const muscle = '#c96f68', muscleFill = '#f4d3cc', blood = '#c8505a'
const VESSEL = 'M196 268C202 246 198 226 186 214C176 204 166 202 160 196'
type Organ = 'muscle' | 'blood' | 'liver' | 'lungs'
function BodyFigure({ lit, lactics = 0, vessel = true }: { lit: (o: Organ) => boolean; lactics?: number; vessel?: boolean }) {
  const o = (k: Organ) => lit(k) ? 1 : faded
  const lacticSpots: Pt[] = [[200, 250], [196, 230], [184, 214], [170, 205]]
  return <g>
    {/* Legs, arms, torso, head */}
    {['M150 220L144 350', 'M190 220L196 350'].map(d => <g key={d}><path d={d} stroke={skinLine} strokeWidth="33" strokeLinecap="round" /><path d={d} stroke={skin} strokeWidth="30" strokeLinecap="round" /></g>)}
    {['M130 98L112 196', 'M210 98L228 196'].map(d => <g key={d}><path d={d} stroke={skinLine} strokeWidth="21" strokeLinecap="round" /><path d={d} stroke={skin} strokeWidth="18" strokeLinecap="round" /></g>)}
    <path d="M128 92Q170 78 212 92L218 222Q170 236 122 222Z" fill={skin} stroke={skinLine} strokeWidth="1.8" />
    <rect x={161} y={70} width={18} height={16} fill={skin} />
    <circle cx={170} cy={50} r={24} fill={skin} stroke={skinLine} strokeWidth="1.8" />
    <path d="M147 44C146 20 194 18 194 44C186 34 156 34 147 44Z" fill="#6d5a4b" />
    {/* Lungs */}
    <g opacity={o('lungs')}><path d="M170 76V100M170 100L158 110M170 100L182 110" stroke={lungLine} strokeWidth="3" fill="none" strokeLinecap="round" />
      {[-1, 1].map(s => <path key={s} d={blob(170 + s * 22, 136, 17, 30, 60 + s, .04, .9)} fill={lungFill} stroke={lungLine} strokeWidth="1.8" />)}</g>
    {/* Liver: on the body's right, under the lungs (the viewer's left) */}
    <g opacity={o('liver')}><path d="M134 178C140 168 176 166 190 172C196 176 190 186 176 190C162 194 140 196 134 190Z" fill={liverFill} stroke={liverLine} strokeWidth="1.8" strokeLinejoin="round" /></g>
    {/* Blood vessel from the thigh muscle up to the liver */}
    {vessel && <g opacity={o('blood')}><path d={VESSEL} stroke={blood} strokeWidth="5" fill="none" strokeLinecap="round" opacity=".85" />
      <Arrow x1={171} y1={203} x2={160} y2={196} colour={blood} width={2} /></g>}
    {/* Thigh muscle */}
    <g opacity={o('muscle')}><path d={blob(196, 282, 11, 30, 70, .04)} fill={muscleFill} stroke={muscle} strokeWidth="2.2" /></g>
    {lacticSpots.slice(0, lactics).map(([x, y], i) => <Lactic key={i} x={x} y={y} s={.85} />)}
    {lactics > 0 && [[192, 272], [200, 292]].map(([x, y], i) => <Lactic key={`m${i}`} x={x} y={y} s={.8} />)}
  </g>
}
function LacticScene({ focus, assessment }: { focus: string; assessment: boolean }) {
  const step = focus.replace('hphoto-lactic-', '')
  if (step === 'question') {
    return <AnatomyFigure title="Where does lactic acid go?" height={370}
      description={assessment ? 'A front view of a person with three numbered parts: 1 in the upper leg, 2 in the upper abdomen just below the chest, 3 in the chest. Original schematic, not to scale.' : 'A front view of a person with three numbered parts: 1 a leg muscle, 2 the liver, 3 the lungs. Original schematic, not to scale.'}
      labels={assessment ? undefined : [
        { mark: '1', name: 'Leg muscle', detail: 'Makes lactic acid in hard exercise.' },
        { mark: '2', name: 'Liver', detail: 'Converts lactic acid back into glucose.', active: true },
        { mark: '3', name: 'Lungs', detail: 'Take in the extra oxygen.' },
      ]} note="Original schematic, not to scale.">
      {() => <g transform="translate(130 0)">
        <BodyFigure lit={() => true} vessel={false} />
        <Pointer mark="1" x={300} y={290} toX={204} toY={284} />
        <Pointer mark="2" x={40} y={200} toX={142} toY={184} />
        <Pointer mark="3" x={300} y={120} toX={196} toY={128} />
      </g>}
    </AnatomyFigure>
  }
  const lit: Record<string, Organ[]> = { liver: ['muscle', 'blood', 'liver'], glucose: ['liver'], oxygen: ['lungs', 'muscle'], debt: ['muscle', 'blood', 'liver', 'lungs'] }
  const on = (k: Organ) => (lit[step] || lit.liver).includes(k)
  const descriptions: Record<string, string> = {
    liver: 'A front view of a person. Lactic acid, shown as half-hexagons, leaves a thigh muscle in the blood and is carried up a blood vessel to the liver.',
    glucose: 'The liver is highlighted. A card shows lactic acid being converted back into glucose in the liver.',
    oxygen: 'The lungs and the muscle are highlighted. A card shows lactic acid reacting with oxygen to make carbon dioxide and water.',
    debt: 'The whole picture: blood carries lactic acid from the muscle to the liver, where it becomes glucose; extra oxygen from the lungs reacts with lactic acid to make carbon dioxide and water. This extra oxygen is the oxygen debt.',
  }
  const labels: AnatomyLabel[] = [
    { mark: '1', name: 'Leg muscle', detail: 'Lactic acid builds up after hard exercise.', active: step === 'liver' },
    { mark: '2', name: 'Blood', detail: 'Carries the lactic acid to the liver.', active: step === 'liver' },
    { mark: '3', name: 'Liver', detail: step === 'liver' ? 'Where the blood takes the lactic acid.' : 'Converts lactic acid back into glucose.', active: step === 'glucose' },
    ...(step === 'oxygen' || step === 'debt' ? [{ mark: '4', name: 'Lungs', detail: 'Take in extra oxygen to react with the lactic acid.', active: step === 'oxygen' }] : []),
  ]
  const lactics = step === 'liver' || step === 'debt' ? 4 : 0
  return <AnatomyFigure title={step === 'debt' ? 'Paying back the oxygen debt' : 'Clearing lactic acid'} height={370} description={`${descriptions[step] || descriptions.liver} Original schematic, not to scale.`} labels={labels}
    note="Half-hexagon = lactic acid; hexagon = glucose. Molecules are simple symbols, not real shapes. Original schematic, not to scale.">
    {() => <>
      <BodyFigure lit={on} lactics={lactics} />
      <Pointer mark="1" x={290} y={300} toX={206} toY={290} active={step === 'liver'} />
      <Pointer mark="2" x={290} y={236} toX={200} toY={240} active={step === 'liver'} />
      <Pointer mark="3" x={50} y={186} toX={140} toY={182} active={step === 'glucose'} />
      {(step === 'oxygen' || step === 'debt') && <Pointer mark="4" x={50} y={112} toX={150} toY={130} active={step === 'oxygen'} />}
      {(step === 'oxygen' || step === 'debt') && <g><O2 x={214} y={58} s={.85} /><Arrow x1={226} y1={70} x2={196} y2={80} colour={teal} width={2} /></g>}
      {step === 'liver' && <Card x={340} y={150} w={240} h={84}>
        <Lactic x={366} y={184} /><Arrow x1={384} y1={184} x2={440} y2={184} colour={blood} width={2.4} />
        <T x={454} y={180} lines={['to the liver', 'in the blood']} size={13} bold colour={blood} />
        <T x={354} y={222} lines={['muscle → blood → liver']} size={13} />
      </Card>}
      {(step === 'glucose' || step === 'debt') && <Card x={340} y={step === 'debt' ? 36 : 150} w={240} h={78} tint="#fdf6e6" line="#ecd9a8">
        <T x={354} y={(step === 'debt' ? 36 : 150) + 22} lines={['In the liver']} size={13} bold colour={liverLine} />
        <Lactic x={370} y={(step === 'debt' ? 36 : 150) + 50} /><Arrow x1={388} y1={(step === 'debt' ? 36 : 150) + 50} x2={438} y2={(step === 'debt' ? 36 : 150) + 50} colour={ink} width={2.2} />
        <Glucose x={456} y={(step === 'debt' ? 36 : 150) + 50} /><T x={472} y={(step === 'debt' ? 36 : 150) + 55} lines={['glucose']} size={13} bold colour={sugar} />
      </Card>}
      {(step === 'oxygen' || step === 'debt') && <Card x={340} y={step === 'debt' ? 130 : 150} w={240} h={96} tint="#eef8f6" line="#b9dfd9">
        <T x={354} y={(step === 'debt' ? 130 : 150) + 22} lines={['Oxygen removes it']} size={13} bold colour={teal} />
        <Lactic x={366} y={(step === 'debt' ? 130 : 150) + 50} /><T x={384} y={(step === 'debt' ? 130 : 150) + 55} lines={['+']} size={15} bold anchor="middle" />
        <O2 x={406} y={(step === 'debt' ? 130 : 150) + 50} /><Arrow x1={420} y1={(step === 'debt' ? 130 : 150) + 50} x2={460} y2={(step === 'debt' ? 130 : 150) + 50} colour={ink} width={2.2} />
        <CO2 x={486} y={(step === 'debt' ? 130 : 150) + 50} /><T x={513} y={(step === 'debt' ? 130 : 150) + 55} lines={['+']} size={15} bold anchor="middle" /><H2O x={540} y={(step === 'debt' ? 130 : 150) + 48} />
        <T x={354} y={(step === 'debt' ? 130 : 150) + 84} lines={['carbon dioxide + water']} size={13} />
      </Card>}
      {step === 'debt' && <Card x={340} y={242} w={240} h={96} tint="#fff" line={teal}>
        <T x={354} y={266} lines={['Oxygen debt:']} size={14} bold colour={teal} />
        <T x={354} y={288} lines={['the extra oxygen needed', 'to react with lactic acid', 'and remove it']} size={13} />
      </Card>}
    </>}
  </AnatomyFigure>
}

export function HigherPhotosynthesisVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('hphoto-two-')) return <TwoFactorScene focus={focus} assessment={assessment} />
  if (focus.startsWith('hphoto-isl-')) return <LightCostScene focus={focus} />
  if (focus.startsWith('hphoto-lactic-')) return <LacticScene focus={focus} assessment={assessment} />
  return <div className="science-bio-model" data-focus={focus} />
}

