import { useId, type ReactNode } from 'react'
import { Arrow } from './InfectionVisuals'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry Lesson 43: Rf values. Original, code-native schematics; not to scale. Focus ids start with 'rfval-'.
 *
 * The chromatogram is drawn exactly as in the paper-chromatography lesson (MixtureVisuals.tsx): cream filter paper,
 * a grey pencil baseline, a pale blue wet tint up to the solvent front, which is a dashed blue line, and soft dye spots.
 * Colour code (the same in every drawing here):
 *   distance moved by the spot    = pink (the same pink as the spot being measured)
 *   distance moved by the solvent = blue (the solvent colour)
 *   amber                         = the step or feature in focus;  green tick = a match
 * The worked example is drawn to scale: 22 px = 1 cm, so the spot is 7.3 cm and the solvent front 9.6 cm above the
 * baseline, and the ruler beside the paper reads the same numbers as the text.
 */
const { ink, muted, panelFill, panelLine } = atomPalette
const paper = '#fffdf6', paperLine = '#c9bfa6', pencil = '#4d5359'
const wet = '#e1eff8', solventLine = '#5b9cc8', solventText = '#2f76a8'
const dye = { yellow: ['#f4cc3a', '#c29a12'], pink: ['#e8739f', '#b44471'], blue: ['#4f8fd6', '#2d67a8'], purple: ['#8a62b8', '#5f3f8a'], green: ['#3e8f6c', '#2a6a4f'] } as const
type Dye = keyof typeof dye
const spotLine = dye.pink[1]
const halo = '#f8c979', activeLine = '#c07a22', highlight = '#fff4e6'
const good = '#3f8a5f', goodSoft = '#e3f3e8'
const ruler = '#fbf3d9', rulerLine = '#c8b27a'
const faded = .3

type Mode = 'on' | 'active' | 'off'
type Pt = [number, number]
const r1 = (n: number) => Math.round(n * 10) / 10

function Diagram({ title, children, viewBox = '0 0 540 320', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Num({ n, x, y, mode, colour = activeLine }: { n: number | string; x: number; y: number; mode: Mode; colour?: string }) {
  const active = mode === 'active'
  return <g opacity={mode === 'off' ? .42 : 1}>
    <circle cx={x} cy={y} r="12" fill={active ? colour : 'white'} stroke={active ? colour : ink} strokeWidth="2" />
    <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={active ? 'white' : ink}>{n}</text>
  </g>
}
function Lines({ x, y, lines, anchor = 'start', size = 14, weight = 700, colour = ink, gap }: { x: number; y: number; lines: string[]; anchor?: 'start' | 'middle' | 'end'; size?: number; weight?: number; colour?: string; gap?: number }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={colour}>{lines.map((l, i) => <tspan key={i} x={x} dy={i ? gap ?? size + 3 : 0}>{l}</tspan>)}</text>
}

// ---------- Chromatogram pieces ----------
function Spot({ x, y, colour, r = 7.5 }: { x: number; y: number; colour: Dye; r?: number }) {
  const [fill, line] = dye[colour]
  return <ellipse cx={r1(x)} cy={r1(y)} rx={r + 1.5} ry={r * .82} fill={fill} stroke={line} strokeWidth="1.3" opacity=".94" />
}
/** Finished chromatography paper: cream, rounded corners, wet tint below the dashed solvent front, pencil baseline. */
function Paper({ x, w, top, bottom, base, front, frontHot = false }: { x: number; w: number; top: number; bottom: number; base: number; front: number; frontHot?: boolean }) {
  const clip = useId().replace(/:/g, '')
  const d = `M${x + 5} ${top}H${x + w - 5}Q${x + w} ${top} ${x + w} ${top + 5}V${bottom - 5}Q${x + w} ${bottom} ${x + w - 5} ${bottom}H${x + 5}Q${x} ${bottom} ${x} ${bottom - 5}V${top + 5}Q${x} ${top} ${x + 5} ${top}Z`
  return <g>
    <defs><clipPath id={clip}><path d={d} /></clipPath></defs>
    <path d={d} fill={paper} />
    <rect x={x} y={r1(front)} width={w} height={r1(bottom - front)} fill={wet} clipPath={`url(#${clip})`} />
    <path d={`M${x + 1} ${r1(front)}H${x + w - 1}`} stroke={solventLine} strokeWidth={frontHot ? 3 : 2} strokeDasharray="7 5" />
    <path d={`M${x + 8} ${base}Q${x + w / 2} ${base + 1} ${x + w - 8} ${base}`} stroke={pencil} strokeWidth="1.8" fill="none" />
    <path d={d} fill="none" stroke={paperLine} strokeWidth="1.6" />
  </g>
}
/** A vertical measuring arrow from the baseline (y1) up to y2, with a short foot on the baseline. */
function Dim({ x, y1, y2, colour, width = 2.4 }: { x: number; y1: number; y2: number; colour: string; width?: number }) {
  return <g>
    <path d={`M${x - 7} ${y1}H${x + 7}`} stroke={colour} strokeWidth={width} />
    <Arrow x1={x} y1={y1} x2={x} y2={r1(y2)} colour={colour} width={width} />
  </g>
}
function Guide({ x1, x2, y, colour = muted }: { x1: number; x2: number; y: number; colour?: string }) {
  return <path d={`M${x1} ${r1(y)}H${x2}`} stroke={colour} strokeWidth="1.3" strokeDasharray="2 4" opacity=".8" />
}
function Cross({ x, y, colour = ink, s = 5 }: { x: number; y: number; colour?: string; s?: number }) {
  return <path d={`M${x - s} ${r1(y - s)}L${x + s} ${r1(y + s)}M${x + s} ${r1(y - s)}L${x - s} ${r1(y + s)}`} stroke={colour} strokeWidth="2" />
}
function Tick({ x, y, s = 1, colour = good }: { x: number; y: number; s?: number; colour?: string }) {
  return <path d={`M${x - 8 * s} ${y}l${6 * s} ${6 * s}l${11 * s} ${-13 * s}`} fill="none" stroke={colour} strokeWidth={3 * s} />
}
function Pencil({ tip, angle = -135 }: { tip: Pt; angle?: number }) {
  return <g transform={`translate(${tip[0]} ${r1(tip[1])}) rotate(${angle})`}>
    <path d="M0 0L12 -5H64Q70 -5 70 0Q70 5 64 5H12Z" fill="#f2c94c" stroke="#b58a1c" strokeWidth="1.4" />
    <path d="M0 0L12 -5V5Z" fill="#f3dfbd" stroke="#b58a1c" strokeWidth="1.2" />
    <path d="M0 0L4.5 -1.9V1.9Z" fill={pencil} />
    <path d="M58 -5V5" stroke="#b58a1c" strokeWidth="1.2" />
  </g>
}

// ---------- The worked-example chromatogram (drawn to scale: 22 px = 1 cm) ----------
const CM = 22
const G = { x: 150, w: 100, top: 44, bottom: 304, base: 276 }
const lane = G.x + G.w / 2
const at = (cm: number) => r1(G.base - cm * CM)
const FRONT = at(9.6), SPOT = at(7.3)

function Ruler({ x, opacity = 1 }: { x: number; opacity?: number }) {
  const w = 30, top = at(10) - 12, bottom = G.base + 14
  return <g opacity={opacity}>
    <rect x={x} y={top} width={w} height={bottom - top} rx="4" fill={ruler} stroke={rulerLine} strokeWidth="1.6" />
    {Array.from({ length: 21 }, (_, i) => { const y = r1(G.base - i * CM / 2); return <path key={i} d={`M${x + w} ${y}H${x + w - (i % 2 ? 6 : 11)}`} stroke={rulerLine} strokeWidth="1.3" /> })}
    {Array.from({ length: 11 }, (_, i) => <text key={i} x={x + 10} y={r1(G.base - i * CM + 4)} textAnchor="middle" fontSize="12" fontWeight="600" fill="#8a7440">{i}</text>)}
    <text x={x + w / 2} y={bottom + 14} textAnchor="middle" fontSize="12" fontWeight="600" fill={muted}>cm</text>
  </g>
}

type RfStep = 'two' | 'front' | 'formula' | 'bigger'
const RF_TITLES: Record<RfStep, string> = {
  two: 'A finished chromatogram: a pencil baseline near the bottom, one pink spot part way up and the solvent front as a dashed line near the top. A short pink arrow shows the distance moved by the spot, from the baseline to the spot. A long blue arrow shows the distance moved by the solvent, from the baseline to the solvent front.',
  front: 'The same chromatogram with the solvent front highlighted: the dashed line at the top of the wet part of the paper. A pencil marks the line, because it must be marked before the paper dries.',
  formula: 'The chromatogram with the two distances beside a card: Rf equals the distance moved by the spot (pink, on top) divided by the distance moved by the solvent (blue, underneath).',
  bigger: 'A chromatogram with three spots: one low with an Rf value of 0.2, one in the middle with 0.5 and one high with 0.8. The further a spot moves, the larger its Rf value. Rf values have no units and are never more than 1.',
}
function RfMeaning({ step }: { step: RfStep }) {
  const arrows = step === 'two' || step === 'formula'
  const three: Array<[Dye, number]> = [['yellow', .8], ['blue', .5], ['pink', .2]]
  const height = (rf: number) => r1(G.base - rf * (G.base - FRONT))
  return <Diagram title={RF_TITLES[step]}>
    <Paper x={G.x} w={G.w} top={G.top} bottom={G.bottom} base={G.base} front={FRONT} frontHot={step === 'front'} />
    {step === 'front' && <g><rect x={G.x - 8} y={FRONT - 11} width={G.w + 16} height={22} rx="11" fill={halo} opacity=".35" />
      <path d={`M${G.x + 1} ${FRONT}H${G.x + G.w - 1}`} stroke={solventLine} strokeWidth="3" strokeDasharray="7 5" /></g>}
    {step === 'bigger' ? three.map(([c, rf]) => <Spot key={c} x={lane} y={height(rf)} colour={c} />) : <Spot x={lane} y={SPOT} colour="pink" />}

    {/* the two distances */}
    {step !== 'bigger' && <g opacity={arrows ? 1 : faded}>
      <Guide x1={124} x2={G.x} y={FRONT} colour={solventLine} />
      <Guide x1={G.x - 22} x2={G.x} y={G.base} />
      <Dim x={132} y1={G.base} y2={FRONT} colour={solventText} />
      <Guide x1={lane + 10} x2={274} y={SPOT} colour={spotLine} />
      <Guide x1={G.x + G.w} x2={276} y={G.base} />
      <Dim x={268} y1={G.base} y2={SPOT} colour={spotLine} />
    </g>}
    {step === 'two' && <g>
      <Lines x={118} y={158} anchor="end" lines={['distance', 'moved by', 'the solvent']} colour={solventText} />
      <Lines x={284} y={186} lines={['distance moved', 'by the spot']} colour={spotLine} />
    </g>}
    {(step === 'two' || step === 'formula') && <g>
      <text x={284} y={FRONT + 5} fontSize="14" fontWeight="700" fill={solventText}>solvent front</text>
      <text x={284} y={G.base + 5} fontSize="14" fontWeight="700" fill={pencil}>baseline</text>
    </g>}

    {step === 'front' && <g>
      <Pencil tip={[G.x + 6, FRONT]} angle={-150} />
      <Lines x={272} y={FRONT - 4} lines={['solvent front']} size={16} colour={solventText} />
      <Lines x={272} y={FRONT + 20} lines={['mark it with a pencil', 'before the paper dries']} weight={600} />
      <Lines x={272} y={G.base - 118} lines={['The wet part of the paper', 'shows how far the', 'solvent moved.']} size={13} weight={400} colour={muted} />
      <text x={284} y={G.base + 5} fontSize="13" fontWeight="600" fill={muted}>baseline</text>
    </g>}

    {step === 'formula' && <g>
      <rect x={300} y={96} width={228} height={132} rx="14" fill={highlight} stroke={halo} strokeWidth="2" />
      <text x={318} y={170} fontSize="20" fontWeight="700" fill={ink}>Rf =</text>
      <Lines x={442} y={128} anchor="middle" lines={['distance moved', 'by the spot']} colour={spotLine} />
      <path d="M370 158H514" stroke={ink} strokeWidth="2.2" />
      <Lines x={442} y={184} anchor="middle" lines={['distance moved', 'by the solvent']} colour={solventText} />
    </g>}

    {step === 'bigger' && <g>
      {three.map(([c, rf]) => <g key={c}>
        <Guide x1={lane + 12} x2={G.x + G.w + 14} y={height(rf)} />
        <rect x={G.x + G.w + 16} y={height(rf) - 14} width={74} height={28} rx="14" fill="white" stroke={dye[c][1]} strokeWidth="2" />
        <text x={G.x + G.w + 53} y={height(rf) + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={dye[c][1]}>Rf {rf.toFixed(1)}</text>
      </g>)}
      <Arrow x1={126} y1={G.base - 14} x2={126} y2={FRONT + 16} colour={activeLine} width={3} />
      <Lines x={112} y={150} anchor="end" lines={['further', 'up =', 'larger Rf']} colour={activeLine} />
      <rect x={370} y={124} width={158} height={76} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
      <Lines x={449} y={156} anchor="middle" lines={['no units', 'never more than 1']} size={14} gap={22} />
      <text x={G.x + G.w + 12} y={FRONT + 5} fontSize="13" fontWeight="600" fill={solventText}>front</text>
    </g>}
  </Diagram>
}

type CalcStep = 'spot' | 'solvent' | 'divide' | 'round'
const CALC_STEPS: CalcStep[] = ['spot', 'solvent', 'divide', 'round']
const CALC_TITLES: Record<CalcStep, string> = {
  spot: 'Step 1 of 4: a ruler stands beside the chromatogram with 0 on the baseline. The centre of the pink spot is marked with a small cross. The distance from the baseline to the centre of the spot is 7.3 cm.',
  solvent: 'Step 2 of 4: the distance from the baseline to the solvent front is measured with the same ruler: 9.6 cm. The 7.3 cm spot distance is shown faintly.',
  divide: 'Step 3 of 4: the chromatogram is faded to one side. A card shows Rf = 7.3 ÷ 9.6 = 0.7604…, with the spot distance on top and the solvent distance underneath.',
  round: 'Step 4 of 4: the card shows 0.7604… rounded to 0.76, to 2 significant figures, with a tick. Rf values have no units.',
}
const CALC_KEY = ['spot', 'solvent', 'divide', 'round']
function RfCalc({ step }: { step: CalcStep }) {
  const n = CALC_STEPS.indexOf(step) + 1
  const card = n >= 3
  const mode = (k: number): Mode => k === n ? 'active' : k < n ? 'on' : 'off'
  return <Diagram title={CALC_TITLES[step]}>
    {/* step key along the top */}
    {CALC_KEY.map((word, i) => <g key={word}>
      <Num n={i + 1} x={52 + i * 128} y={20} mode={mode(i + 1)} />
      <text x={70 + i * 128} y={25} fontSize="14" fontWeight={i + 1 === n ? 700 : 600} fill={i + 1 === n ? activeLine : ink} opacity={i + 1 > n ? .42 : 1}>{word}</text>
    </g>)}
    <g opacity={card ? .35 : 1}>
      <Ruler x={112} />
      <Paper x={G.x} w={G.w} top={G.top} bottom={G.bottom} base={G.base} front={FRONT} frontHot={n === 2} />
      <Spot x={lane} y={SPOT} colour="pink" />
      {n === 1 && <Cross x={lane} y={SPOT} s={4} />}
    </g>
    {!card && <g>
      {n === 1 && <ellipse cx={lane} cy={SPOT} rx={20} ry={16} fill="none" stroke={activeLine} strokeWidth="2.2" strokeDasharray="6 5" />}
      <g opacity={n === 1 ? 1 : .4}>
        <Guide x1={lane + 12} x2={272} y={SPOT} colour={spotLine} />
        <Guide x1={G.x + G.w} x2={348} y={G.base} />
        <Dim x={266} y1={G.base} y2={SPOT} colour={spotLine} />
        <text x={276} y={r1((G.base + SPOT) / 2 + 6)} fontSize={n === 1 ? 18 : 15} fontWeight="700" fill={spotLine}>7.3 cm</text>
      </g>
      {n === 2 && <g>
        <Guide x1={G.x + G.w} x2={346} y={FRONT} colour={solventLine} />
        <Dim x={340} y1={G.base} y2={FRONT} colour={solventText} />
        <text x={350} y={r1((G.base + FRONT) / 2 - 20)} fontSize="18" fontWeight="700" fill={solventText}>9.6 cm</text>
      </g>}
      <rect x={372} y={196} width={156} height={78} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
      <Lines x={386} y={222} size={13} weight={600} lines={n === 1 ? ['baseline to the', 'middle of the spot'] : ['baseline to the', 'solvent front']} />
      <Lines x={386} y={262} size={13} weight={400} colour={muted} lines={[n === 1 ? 'spot distance' : 'same units: cm']} />
    </g>}
    {card && <g>
      <rect x={282} y={70} width={246} height={n === 3 ? 150 : 200} rx="14" fill={highlight} stroke={halo} strokeWidth="2" />
      <text x={300} y={126} fontSize="22" fontWeight="700" fill={ink}>Rf =</text>
      <text x={400} y={110} textAnchor="middle" fontSize="22" fontWeight="700" fill={spotLine}>7.3</text>
      <path d="M370 119H430" stroke={ink} strokeWidth="2.2" />
      <text x={400} y={144} textAnchor="middle" fontSize="22" fontWeight="700" fill={solventText}>9.6</text>
      <text x={300} y={196} fontSize={n === 3 ? 22 : 17} fontWeight="700" fill={n === 3 ? activeLine : muted}>= 0.7604…</text>
      {n === 3 && <text x={440} y={196} fontSize="13" fontWeight="600" fill={muted}>(calculator)</text>}
      {n === 4 && <g>
        <text x={300} y={236} fontSize="26" fontWeight="700" fill={activeLine}>→ 0.76</text>
        <text x={400} y={236} fontSize="14" fontWeight="700" fill={ink}>(2 s.f.)</text>
        <Tick x={482} y={228} s={1.2} />
        <text x={300} y={260} fontSize="13" fontWeight="600" fill={muted}>no units</text>
      </g>}
    </g>}
  </Diagram>
}

// ---------- Identifying substances: one wide chromatogram with a mixture and three references ----------
const W = { x: 24, w: 300, top: 34, bottom: 300, base: 262 }
const WFRONT = W.base - 211
const hAt = (rf: number) => r1(W.base - rf * (W.base - WFRONT))
const LANES = [74, 144, 209, 274]
type Lane = { name: string; spots: Array<[Dye, number]> }
const TEACH_LANES: Lane[] = [
  { name: 'mixture', spots: [['blue', .72], ['pink', .28]] },
  { name: 'A', spots: [['blue', .72]] },
  { name: 'B', spots: [['yellow', .5]] },
  { name: 'C', spots: [['pink', .28]] },
]
function Wide({ lanes }: { lanes: Lane[] }) {
  return <g>
    <Paper x={W.x} w={W.w} top={W.top} bottom={W.bottom} base={W.base} front={WFRONT} />
    {lanes.map((l, i) => <g key={l.name}>
      {l.spots.map(([c, rf], j) => <Spot key={j} x={LANES[i]} y={hAt(rf)} colour={c} />)}
      <text x={LANES[i]} y={W.base + 26} textAnchor="middle" fontSize={i === 0 ? 14 : 16} fontWeight="700" fill={pencil}>{l.name}</text>
    </g>)}
    <text x={W.x + W.w + 10} y={WFRONT + 5} fontSize="13" fontWeight="600" fill={solventText}>front</text>
  </g>
}
function Match({ from, to, rf, label = false }: { from: number; to: number; rf: number; label?: boolean }) {
  const y = hAt(rf)
  return <g>
    <path d={`M${LANES[from] + 12} ${y}H${LANES[to] - 12}`} stroke={good} strokeWidth="2.2" strokeDasharray="2 6" />
    {label && <g><rect x={(LANES[from] + LANES[to]) / 2 - 36} y={y - 50} width={72} height={24} rx="12" fill={goodSoft} stroke={good} strokeWidth="1.6" />
      <text x={(LANES[from] + LANES[to]) / 2} y={y - 33} textAnchor="middle" fontSize="13" fontWeight="700" fill={good}>same Rf</text></g>}
  </g>
}
type IdStep = 'reference' | 'compare' | 'read'
const ID_TITLES: Record<IdStep, string> = {
  reference: 'One chromatogram with four samples on the same pencil baseline: a mixture, which gives a blue spot and a pink spot, and three pure reference samples, A, B and C, which give one spot each. A is blue, B is yellow, C is pink. Same paper, same solvent.',
  compare: 'The same chromatogram. A dotted line joins the blue spot of reference A to the blue spot in the mixture: they moved the same distance, so they have the same Rf value. Substance A could be in the mixture.',
  read: 'The same chromatogram with both matches joined: reference A matches the blue spot in the mixture and reference C matches the pink spot. Reference B matches no spot and has a cross. Conclusion: the mixture possibly contains A and C, but probably not B.',
}
function Identify({ step }: { step: IdStep }) {
  return <Diagram viewBox="0 0 540 330" title={ID_TITLES[step]}>
    <Wide lanes={TEACH_LANES} />
    {step === 'compare' && <rect x={LANES[0] - 24} y={hAt(.72) - 18} width={LANES[1] - LANES[0] + 48} height={36} rx="18" fill="none" stroke={activeLine} strokeWidth="2.2" strokeDasharray="6 5" />}
    {step === 'reference' && <g>
      <path d={`M${LANES[1] - 22} ${W.bottom + 8}Q${LANES[1] - 22} ${W.bottom + 16} ${LANES[1] - 12} ${W.bottom + 16}H${LANES[3] + 12}Q${LANES[3] + 22} ${W.bottom + 16} ${LANES[3] + 22} ${W.bottom + 8}`} fill="none" stroke={activeLine} strokeWidth="2" />
      <text x={LANES[2]} y={W.bottom + 28} textAnchor="middle" fontSize="13" fontWeight="700" fill={activeLine}>pure samples (references)</text>
      <Lines x={346} y={100} lines={['Put a pure sample', 'of each known', 'substance beside', 'the mixture.']} />
      <rect x={346} y={186} width={176} height={60} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
      <Lines x={434} y={211} anchor="middle" size={13} weight={600} lines={['same paper,', 'same solvent']} />
    </g>}
    {step === 'compare' && <g>
      <Match from={0} to={1} rf={.72} label />
      <Lines x={346} y={100} lines={['A moved the same', 'distance as a spot', 'in the mixture.']} />
      <rect x={346} y={170} width={176} height={60} rx="12" fill={goodSoft} stroke={good} strokeWidth="1.5" />
      <Lines x={434} y={195} anchor="middle" size={14} colour={good} lines={['A could be in', 'the mixture']} />
    </g>}
    {step === 'read' && <g>
      <Match from={0} to={1} rf={.72} />
      <path d={`M${LANES[0] + 12} ${hAt(.28)}H${LANES[3] - 12}`} stroke={good} strokeWidth="2.2" strokeDasharray="2 6" />
      <Tick x={LANES[1] + 26} y={hAt(.72) + 3} s={.8} />
      <Tick x={LANES[3] + 26} y={hAt(.28) + 3} s={.8} />
      <Cross x={LANES[2] + 24} y={hAt(.5)} colour="#c0503f" s={6} />
      <text x={LANES[2]} y={hAt(.5) - 18} textAnchor="middle" fontSize="13" fontWeight="700" fill="#c0503f">no match</text>
      <rect x={346} y={90} width={180} height={124} rx="14" fill={highlight} stroke={halo} strokeWidth="2" />
      <Lines x={362} y={120} size={14} lines={['Conclusion']} colour={activeLine} />
      <Lines x={362} y={148} size={14} lines={['possibly A and C,', 'probably not B']} gap={22} />
    </g>}
  </Diagram>
}

function Solvents() {
  const papers: Array<{ x: number; name: string; ref: number; other: number }> = [{ x: 20, name: 'solvent 1', ref: .62, other: .3 }, { x: 194, name: 'solvent 2', ref: .36, other: .74 }]
  const pw = 160, top = 44, bottom = 300, base = 262, front = base - 190
  const y = (rf: number) => r1(base - rf * (base - front))
  return <Diagram viewBox="0 0 540 320" title="Two chromatograms of the same mixture and the same reference, run with two different solvents. In solvent 1 the reference and the matching mixture spot are both about two thirds of the way up; in solvent 2 they are both lower down. The Rf value changes with the solvent, but the spots match in both, so they are likely to be the same substance.">
    {papers.map(p => { const m = p.x + 40, r = p.x + 120; return <g key={p.name}>
      <text x={p.x + pw / 2} y={28} textAnchor="middle" fontSize="15" fontWeight="700" fill={solventText}>{p.name}</text>
      <Paper x={p.x} w={pw} top={top} bottom={bottom} base={base} front={front} />
      <Spot x={m} y={y(p.ref)} colour="blue" />
      <Spot x={m} y={y(p.other)} colour="pink" />
      <Spot x={r} y={y(p.ref)} colour="blue" />
      <path d={`M${m + 12} ${y(p.ref)}H${r - 12}`} stroke={good} strokeWidth="2.2" strokeDasharray="2 6" />
      <text x={m} y={base + 24} textAnchor="middle" fontSize="13" fontWeight="700" fill={pencil}>mixture</text>
      <text x={r} y={base + 24} textAnchor="middle" fontSize="13" fontWeight="700" fill={pencil}>reference</text>
    </g> })}
    <rect x={370} y={84} width={158} height={164} rx="14" fill={highlight} stroke={halo} strokeWidth="2" />
    <Lines x={384} y={114} size={14} lines={['Rf values change', 'with the solvent.']} />
    <Lines x={384} y={170} size={14} colour={good} lines={['A match in both', 'solvents: likely', 'the same', 'substance']} />
  </Diagram>
}

const Q_LANES: Lane[] = [
  { name: 'mixture', spots: [['green', .64], ['purple', .24]] },
  { name: '1', spots: [['green', .64]] },
  { name: '2', spots: [['yellow', .44]] },
  { name: '3', spots: [['purple', .24]] },
]
function Question({ assessment }: { assessment: boolean }) {
  return <Diagram viewBox="0 0 540 310" title={assessment ? 'A chromatogram with a mixture lane and three numbered reference lanes.' : 'A chromatogram with a mixture lane and three numbered reference lanes. The mixture has two spots, at the same heights as the spots of references 1 and 3. Reference 2 is at a different height, so it matches no spot in the mixture.'}>
    <Wide lanes={Q_LANES} />
    <text x={W.x + W.w + 10} y={W.base + 5} fontSize="13" fontWeight="600" fill={pencil}>baseline</text>
    {!assessment && <g>
      <Match from={0} to={1} rf={.64} />
      <path d={`M${LANES[0] + 12} ${hAt(.24)}H${LANES[3] - 12}`} stroke={good} strokeWidth="2.2" strokeDasharray="2 6" />
      <Lines x={410} y={130} size={14} colour={good} lines={['1 and 3 match', 'the mixture']} />
    </g>}
  </Diagram>
}

export function RfVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'rfval-two-distances': return <RfMeaning step="two" />
    case 'rfval-front': return <RfMeaning step="front" />
    case 'rfval-formula': return <RfMeaning step="formula" />
    case 'rfval-bigger': return <RfMeaning step="bigger" />
    case 'rfval-measure-spot': return <RfCalc step="spot" />
    case 'rfval-measure-front': return <RfCalc step="solvent" />
    case 'rfval-divide': return <RfCalc step="divide" />
    case 'rfval-round': return <RfCalc step="round" />
    case 'rfval-reference': return <Identify step="reference" />
    case 'rfval-compare': return <Identify step="compare" />
    case 'rfval-read': return <Identify step="read" />
    case 'rfval-solvent': return <Solvents />
    case 'rfval-q-chromatogram': return <Question assessment={assessment} />
    default: return <RfMeaning step="two" />
  }
}
