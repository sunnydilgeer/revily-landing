import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C5 (Chemistry Lesson 30): reaction profiles. Original, code-native schematics; not to scale.
 * Focus ids start with 'profile-'.
 *
 * Colour code: coral = exothermic (energy given out), blue = endothermic (energy taken in), amber = activation energy,
 * grey = a profile that has not been named yet. Ink, greys and panels come from `atomPalette`.
 * Assessment views use neutral ink lines, hide the words exothermic, endothermic and activation energy, and keep numbered badges.
 */
const { ink, muted, protonLine, electronLine } = atomPalette
const amber = '#d98a1c', amberInk = '#8a5a14'

function Diagram({ title, children, viewBox = '0 0 540 300' }: { title: string; children: ReactNode; viewBox?: string }) {
  const id = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={id}><title id={id}>{`${title} Original schematic, not to scale.`}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}

type Kind = 'exo' | 'endo' | 'plain' | 'ink'
// Local drawing space: energy axis at x = 0, progress axis at y = 240. Smaller y means higher energy.
const GEO = {
  exo: { R: 110, K: 30, P: 185 },
  endo: { R: 185, K: 60, P: 115 },
}
const stroke = (k: Kind) => k === 'exo' ? protonLine : k === 'endo' ? electronLine : k === 'ink' ? ink : muted
const curve = (R: number, K: number, P: number) => `M10 ${R}H150C200 ${R} 200 ${K} 250 ${K}C300 ${K} 300 ${P} 350 ${P}H440`

function Head({ x, y, dir, c }: { x: number; y: number; dir: 'up' | 'down'; c: string }) {
  const d = dir === 'up' ? -1 : 1
  return <path d={`M${x - 6} ${y - d * 10}L${x} ${y}L${x + 6} ${y - d * 10}Z`} fill={c} stroke={c} strokeWidth="1" />
}
function VArrow({ x, y1, y2, c, w = 3 }: { x: number; y1: number; y2: number; c: string; w?: number }) {
  const dir = y2 < y1 ? 'up' : 'down'
  const yEnd = y2 + (dir === 'up' ? 8 : -8)
  return <g><path d={`M${x} ${y1}V${yEnd}`} stroke={c} strokeWidth={w} fill="none" /><Head x={x} y={y2} dir={dir} c={c} /></g>
}
function Badge({ x, y, n }: { x: number; y: number; n: number }) {
  return <g><circle cx={x} cy={y} r="12" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{n}</text></g>
}

interface Show { levels?: boolean; delta?: boolean; ea?: boolean; eaLabel?: boolean; deltaLabel?: boolean; heat?: boolean; names?: boolean }

// One reaction profile in local space. `fs` is the label size in local units (13 / scale).
function Profile({ kind, geo, show, fs = 13, dashPeak = true }: { kind: Kind; geo: 'exo' | 'endo'; show: Show; fs?: number; dashPeak?: boolean }) {
  const { R, K, P } = GEO[geo]
  const c = stroke(kind)
  const deltaText = geo === 'exo' ? ['Energy', 'given out'] : ['Energy', 'taken in']
  return <g>
    {/* axes */}
    <path d="M0 -6V240H450" stroke={ink} strokeWidth="2.5" fill="none" />
    <path d="M-5 6L0 -6L5 6Z" fill={ink} stroke={ink} strokeWidth="1" />
    <path d="M438 -5L451 240L438 245Z" fill="none" />
    <path d="M440 235L452 240L440 245Z" fill={ink} stroke={ink} strokeWidth="1" />
    {/* level lines */}
    {(show.delta || show.ea) && <path d={`M40 ${R}H420`} stroke={ink} strokeWidth="1.5" strokeDasharray="6 5" opacity="0.55" fill="none" />}
    {show.ea && dashPeak && <path d={`M40 ${K}H${show.delta ? 372 : 250}`} stroke={ink} strokeWidth="1.5" strokeDasharray="6 5" opacity="0.55" fill="none" />}
    {show.delta && <path d={`M350 ${P}H420`} stroke={ink} strokeWidth="1.5" strokeDasharray="6 5" opacity="0.55" fill="none" />}
    {/* the profile */}
    <path d={curve(R, K, P)} stroke={c} strokeWidth="4" fill="none" />
    {/* level labels */}
    {show.levels && <g fontSize={fs} fontWeight="700" fill={ink}>
      <text x={56} y={R + 8 + fs}>Reactants</text>
      <text x={350} y={geo === 'endo' ? P - 10 : P + 8 + fs}>Products</text>
    </g>}
    {/* activation energy arrow */}
    {show.ea && <g>
      <VArrow x={40} y1={R} y2={K} c={amber} />
      {show.eaLabel && <g fontSize={fs} fontWeight="700" fill={amberInk}>
        <text x={50} y={(R + K) / 2 - 2}>Activation</text><text x={50} y={(R + K) / 2 - 2 + fs + 3}>energy</text>
      </g>}
    </g>}
    {/* overall energy change arrow */}
    {show.delta && <g>
      <VArrow x={420} y1={R} y2={P} c={c} />
      {show.deltaLabel && <g fontSize={fs} fontWeight="700" fill={ink} textAnchor="end">
        <text x={408} y={(R + P) / 2 - 2}>{deltaText[0]}</text><text x={408} y={(R + P) / 2 - 2 + fs + 3}>{deltaText[1]}</text>
      </g>}
    </g>}
    {show.heat && <g>
      <VArrow x={40} y1={R + 78} y2={R + 10} c={amber} />
      <path d={`M40 ${R + 100}c-14 -10 -12 -24 -3 -34c1 8 5 11 8 12c-1 -8 3 -13 7 -16c4 12 9 16 3 30c-3 6 -9 8 -15 8z`} fill="#f7c65a" stroke={amber} strokeWidth="2" transform="translate(-4 4)" />
      <text x={60} y={R + 82} fontSize={fs} fontWeight="700" fill={amberInk}>Heat</text><text x={60} y={R + 82 + fs + 3} fontSize={fs} fill={ink}>supplies it</text>
    </g>}
  </g>
}
const Frame = ({ children }: { children: ReactNode }) => <g transform="translate(72 20)">{children}</g>
function AxisLabels({ y = 290 }: { y?: number }) {
  return <g fontSize="14" fontWeight="700" fill={ink}><text transform="translate(28 140) rotate(-90)" textAnchor="middle">Energy</text><text x={297} y={y} textAnchor="middle">Progress of reaction</text></g>
}

// ---------- Section: activation energy ----------
function What() {
  return <Diagram title="A reaction profile. The vertical axis is energy and the horizontal axis is progress of reaction. A line starts flat at the reactants, rises to a peak, then falls to a lower flat line at the products.">
    <AxisLabels /><Frame><Profile kind="plain" geo="exo" show={{ levels: true }} /></Frame>
  </Diagram>
}
function Activation() {
  return <Diagram title="The same reaction profile with an amber arrow from the reactants line up to the top of the peak. The arrow is the activation energy, the minimum energy the reactants need to react.">
    <AxisLabels /><Frame><Profile kind="plain" geo="exo" show={{ levels: true, ea: true, eaLabel: true }} /></Frame>
  </Diagram>
}
function Heat() {
  return <Diagram title="A reaction profile with a flame under the reactants and an amber arrow pointing up to the peak. Heating supplies the activation energy that gets the reaction started.">
    <AxisLabels /><Frame><Profile kind="plain" geo="exo" show={{ levels: true, ea: true, eaLabel: true, heat: true }} /></Frame>
  </Diagram>
}
function EaCompare() {
  const R = 110, P = 185
  const curveFor = (K: number) => curve(R, K, P)
  return <Diagram title="Two reaction profiles on the same axes. Reaction A has a low peak and reaction B has a high peak. Reaction B has the greater activation energy, so it needs more energy to start.">
    <AxisLabels />
    <Frame>
      <path d="M0 -6V240H450" stroke={ink} strokeWidth="2.5" fill="none" /><path d="M-5 6L0 -6L5 6Z" fill={ink} stroke={ink} strokeWidth="1" /><path d="M440 235L452 240L440 245Z" fill={ink} stroke={ink} strokeWidth="1" />
      <path d={`M40 ${R}H250`} stroke={ink} strokeWidth="1.5" strokeDasharray="6 5" opacity="0.55" fill="none" />
      <path d={curveFor(30)} stroke={amber} strokeWidth="4" fill="none" />
      <path d={curveFor(75)} stroke={muted} strokeWidth="4" fill="none" />
      <VArrow x={100} y1={R} y2={30} c={amber} w={2.5} />
      <g fontSize="15" fontWeight="700"><text x={250} y={20} textAnchor="middle" fill={amberInk}>B</text><text x={250} y={65} textAnchor="middle" fill={ink}>A</text></g>
      <g fontSize="13" fill={ink}><text x={358} y={20}>Bigger hump,</text><text x={358} y={36}>more energy</text><text x={358} y={52}>needed to start</text></g>
    </Frame>
  </Diagram>
}

// ---------- Section: exothermic ----------
function Exo({ stage }: { stage: 'shape' | 'delta' | 'ea' | 'all' }) {
  const shows: Record<typeof stage, Show> = {
    shape: { levels: true },
    delta: { levels: true, delta: true, deltaLabel: true },
    ea: { levels: true, ea: true, eaLabel: true },
    all: { levels: true, ea: true, eaLabel: true, delta: true, deltaLabel: true },
  }
  const titles = {
    shape: 'An exothermic reaction profile. The line starts at the reactants, rises to a peak, then falls to the products, which are at a lower energy than the reactants.',
    delta: 'An exothermic reaction profile with an arrow pointing down from the reactants level to the products level. The arrow shows the total energy given out.',
    ea: 'An exothermic reaction profile with an amber arrow from the reactants up to the peak. The arrow is the activation energy.',
    all: 'An exothermic reaction profile. An amber arrow up to the peak shows the activation energy. A coral arrow down from the reactants level to the lower products level shows the total energy given out.',
  }
  return <Diagram title={titles[stage]}>
    <text x={297} y={16} textAnchor="middle" fontSize="15" fontWeight="700" fill={protonLine}>Exothermic</text>
    <AxisLabels /><Frame><Profile kind="exo" geo="exo" show={shows[stage]} /></Frame>
  </Diagram>
}

// ---------- Section: endothermic ----------
function Endo({ stage }: { stage: 'shape' | 'delta' | 'all' }) {
  const shows: Record<typeof stage, Show> = {
    shape: { levels: true },
    delta: { levels: true, delta: true, deltaLabel: true },
    all: { levels: true, ea: true, eaLabel: true, delta: true, deltaLabel: true },
  }
  const titles = {
    shape: 'An endothermic reaction profile. The line starts at the reactants, rises to a peak, then falls to the products, which are at a higher energy than the reactants.',
    delta: 'An endothermic reaction profile with an arrow pointing up from the reactants level to the products level. The arrow shows the total energy taken in.',
    all: 'An endothermic reaction profile. An amber arrow up to the peak shows the activation energy. A blue arrow up from the reactants level to the higher products level shows the total energy taken in.',
  }
  return <Diagram title={titles[stage]}>
    <text x={297} y={16} textAnchor="middle" fontSize="15" fontWeight="700" fill={electronLine}>Endothermic</text>
    <AxisLabels /><Frame><Profile kind="endo" geo="endo" show={shows[stage]} /></Frame>
  </Diagram>
}
function Compare() {
  const fs = 26
  const panel = (kind: 'exo' | 'endo', x: number, name: string, line1: string, line2: string) => <g transform={`translate(${x} 44)`}>
    <text x={120} y={-12} textAnchor="middle" fontSize="15" fontWeight="700" fill={stroke(kind)}>{name}</text>
    <g transform="translate(6 0) scale(0.5)"><Profile kind={kind} geo={kind} show={{ levels: true }} fs={fs} /></g>
    <text x={120} y={158} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{line1}</text>
    <text x={120} y={176} textAnchor="middle" fontSize="14" fill={ink}>{line2}</text>
  </g>
  return <Diagram title="An exothermic and an endothermic reaction profile side by side. In the exothermic profile the products are lower than the reactants and energy is given out. In the endothermic profile the products are higher than the reactants and energy is taken in." viewBox="0 0 540 240">
    {panel('exo', 10, 'Exothermic', 'Products lower', 'Energy given out')}
    {panel('endo', 280, 'Endothermic', 'Products higher', 'Energy taken in')}
  </Diagram>
}

// ---------- On your own ----------
function QArrows() {
  const { R, K, P } = GEO.exo
  return <Diagram title="A reaction profile with three numbered arrows. Arrow 1 goes up from the reactants level to the top of the peak. Arrow 2 goes down from the reactants level to the products level. Arrow 3 goes down from the top of the peak to the products level.">
    <AxisLabels /><Frame>
      <Profile kind="ink" geo="exo" show={{ levels: true }} />
      <path d={`M40 ${R}H420M40 ${K}H372M350 ${P}H420`} stroke={ink} strokeWidth="1.5" strokeDasharray="6 5" opacity="0.55" fill="none" />
      <VArrow x={40} y1={R} y2={K} c={ink} /><Badge x={66} y={(R + K) / 2} n={1} />
      <VArrow x={420} y1={R} y2={P} c={ink} /><Badge x={438} y={(R + P) / 2} n={2} />
      <VArrow x={372} y1={K} y2={P} c={ink} /><Badge x={394} y={(K + P) / 2 - 22} n={3} />
    </Frame>
  </Diagram>
}
function QPair() {
  const panel = (geo: 'exo' | 'endo', x: number, n: number) => <g transform={`translate(${x} 46)`}>
    <g transform="translate(6 0) scale(0.5)"><Profile kind="ink" geo={geo} show={{ levels: true }} fs={26} /></g>
    <Badge x={120} y={-14} n={n} />
  </g>
  return <Diagram title="Two reaction profiles side by side. In profile 1 the products line is higher than the reactants line. In profile 2 the products line is lower than the reactants line." viewBox="0 0 540 200">
    {panel('endo', 10, 1)}{panel('exo', 280, 2)}
  </Diagram>
}
function QTwo() {
  const R = 110, P = 185
  return <Diagram title="Two reaction profiles, P and Q, on the same axes. Both start at the same reactants level and end at the same products level. The peak of Q is higher than the peak of P.">
    <AxisLabels />
    <Frame>
      <path d="M0 -6V240H450" stroke={ink} strokeWidth="2.5" fill="none" /><path d="M-5 6L0 -6L5 6Z" fill={ink} stroke={ink} strokeWidth="1" /><path d="M440 235L452 240L440 245Z" fill={ink} stroke={ink} strokeWidth="1" />
      <path d={curve(R, 30, P)} stroke={ink} strokeWidth="4" fill="none" />
      <path d={curve(R, 75, P)} stroke={muted} strokeWidth="4" strokeDasharray="10 6" fill="none" />
      <g fontSize="16" fontWeight="700" fill={ink}><text x={250} y={20} textAnchor="middle">Q</text><text x={250} y={65} textAnchor="middle">P</text></g>
      <g fontSize="13" fontWeight="700" fill={ink}><text x={56} y={R + 22}>Reactants</text><text x={350} y={P + 22}>Products</text></g>
    </Frame>
  </Diagram>
}

export function ProfileVisual({ focus }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'profile-what': return <What />
    case 'profile-ea': return <Activation />
    case 'profile-ea-compare': return <EaCompare />
    case 'profile-ea-heat': return <Heat />
    case 'profile-exo-shape': return <Exo stage="shape" />
    case 'profile-exo-delta': return <Exo stage="delta" />
    case 'profile-exo-ea': return <Exo stage="ea" />
    case 'profile-exo-all': return <Exo stage="all" />
    case 'profile-endo-shape': return <Endo stage="shape" />
    case 'profile-endo-delta': return <Endo stage="delta" />
    case 'profile-endo-all': return <Endo stage="all" />
    case 'profile-compare': return <Compare />
    case 'profile-q-arrows': return <QArrows />
    case 'profile-q-pair': return <QPair />
    case 'profile-q-two': return <QTwo />
    default: return <What />
  }
}
