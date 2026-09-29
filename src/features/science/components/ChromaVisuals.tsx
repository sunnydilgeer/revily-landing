import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry Lesson 42: How paper chromatography works. Original, code-native schematics; not to scale. Focus ids start with 'chroma-'.
 *
 * Colour code (the same in every drawing here, and close to the chromatography drawings of Chemistry Lesson 3):
 *   solvent = pale blue with a blue line (water, the course colour); wet paper = a paler blue tint
 *   filter paper = cream; pencil start line = graphite grey; the mixed ink spot = dark violet
 *   each chemical has its own soft hue: yellow, pink, purple (and a pink-purple blend where two overlap)
 *   highlight for "look here" = soft amber halo
 * One beaker-and-strip drawing is reused through the "two phases" frames, changing what is highlighted.
 */
const { ink, muted, panelFill, panelLine } = atomPalette
const glass = '#f5fafd', glassLine = '#6f8fa6'
const solvent = '#d4e9f8', solventLine = '#3f8fd0', solventText = '#2f76a8', wet = '#e6f1fa'
const paper = '#fffdf6', paperLine = '#c9bfa6', paperText = '#8c7640', fibre = '#efe4c6', fibreLine = '#c9b98e'
const pencil = '#4d5359'
const halo = '#f8c979'
const dye = {
  yellow: ['#f6d66e', '#c29a12'],
  pink: ['#f0a0bf', '#b44471'],
  purple: ['#b99ad9', '#6f4f9a'],
  blend: ['#d59bcc', '#8f4d86'],
  ink: ['#5a4d6e', '#2f2740'],
} as const
type Dye = keyof typeof dye
const faded = .32

type Pt = [number, number]
const r1 = (n: number) => Math.round(n * 10) / 10

function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Lines({ x, y, lines, anchor = 'start', size = 14, weight = 700, colour = ink }: { x: number; y: number; lines: string[]; anchor?: 'start' | 'middle' | 'end'; size?: number; weight?: number; colour?: string }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={colour}>{lines.map((l, i) => <tspan key={i} x={x} dy={i ? size + 3 : 0}>{l}</tspan>)}</text>
}
function Caption({ text, y = 288 }: { text: string; y?: number }) {
  return <text x={270} y={y} textAnchor="middle" fontSize="14" fontWeight="600" fill={muted}>{text}</text>
}
function Leader({ from, to, colour = ink }: { from: Pt; to: Pt; colour?: string }) {
  return <g><path d={`M${from[0]} ${from[1]}L${to[0]} ${to[1]}`} stroke={colour} strokeWidth="1.4" /><circle cx={to[0]} cy={to[1]} r="2.6" fill={colour} /></g>
}
function Arrow({ from, to, colour = ink, width = 2.4, dashed = false }: { from: Pt; to: Pt; colour?: string; width?: number; dashed?: boolean }) {
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]), h = 6 + width * 1.5
  const p = (d: number, s: number): Pt => [r1(to[0] - Math.cos(a) * d + Math.cos(a + Math.PI / 2) * s), r1(to[1] - Math.sin(a) * d + Math.sin(a + Math.PI / 2) * s)]
  const [b1, b2, base] = [p(h, h * .6), p(h, -h * .6), p(h * .7, 0)]
  return <g><path d={`M${from[0]} ${from[1]}L${base[0]} ${base[1]}`} stroke={colour} strokeWidth={width} fill="none" strokeDasharray={dashed ? '5 5' : undefined} /><path d={`M${to[0]} ${to[1]}L${b1[0]} ${b1[1]}L${b2[0]} ${b2[1]}Z`} fill={colour} stroke={colour} strokeWidth="1.2" /></g>
}
function Pointer({ n, x, y, to }: { n: number; x: number; y: number; to: Pt }) {
  const angle = Math.atan2(to[1] - y, to[0] - x)
  return <g><path d={`M${r1(x + Math.cos(angle) * 13)} ${r1(y + Math.sin(angle) * 13)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
    <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}

// ---------- Chromatography pieces ----------
function Spot({ x, y, c, r = 9 }: { x: number; y: number; c: Dye; r?: number }) {
  return <ellipse cx={r1(x)} cy={r1(y)} rx={r + 2} ry={r * .78} fill={dye[c][0]} stroke={dye[c][1]} strokeWidth="1.4" />
}
type StripProps = { x: number; top: number; w: number; bottom: number; line: number; front?: number; spots?: Array<[Dye, number]>; mixed?: boolean; wetOn?: boolean; frontMark?: boolean; ghost?: boolean }
/** Filter paper strip: pencil line at `line`; damp up to `front`; spots at fractions of the distance from the line to the front. */
function Strip({ x, top, w, bottom, line, front, spots = [], mixed = false, wetOn = true, frontMark = false, ghost = false }: StripProps) {
  const cx = x + w / 2
  return <g>
    <path d={`M${x} ${top + 4}Q${x} ${top} ${x + 4} ${top}H${x + w - 4}Q${x + w} ${top} ${x + w} ${top + 4}V${bottom}H${x}Z`} fill={paper} stroke={paperLine} strokeWidth="1.6" />
    {front !== undefined && wetOn && <rect x={x + 1} y={front} width={w - 2} height={bottom - front - 1} fill={wet} />}
    {front !== undefined && <path d={`M${x + 1} ${front}H${x + w - 1}`} stroke={frontMark ? solventLine : '#bcd6ea'} strokeWidth={frontMark ? 2.4 : 1.4} strokeDasharray={frontMark ? '6 4' : undefined} />}
    <path d={`M${x + 5} ${line}H${x + w - 5}`} stroke={pencil} strokeWidth="1.8" />
    {ghost && <ellipse cx={cx} cy={line} rx={11} ry={7} fill="none" stroke={muted} strokeWidth="1.4" strokeDasharray="3 3" />}
    {mixed && <Spot x={cx} y={line} c="ink" />}
    {front !== undefined && spots.map(([c, f], i) => <Spot key={i} x={cx} y={line - f * (line - front)} c={c} />)}
  </g>
}
const spotY = (line: number, front: number, f: number) => r1(line - f * (line - front))

/** The beaker set-up drawn once: a strip hangs from a rod into shallow solvent. */
function Scene({ front, spots = [], mixed = false, hl = 'none', rising = false }: { front?: number; spots?: Array<[Dye, number]>; mixed?: boolean; hl?: 'none' | 'solvent' | 'paper'; rising?: boolean }) {
  const bx = 54, bw = 168, top = 72, bottom = 272, surface = 244
  const sx = 112, sw = 52, sTop = 76, sBottom = 256, line = 226
  const solventOp = hl === 'paper' ? faded + .2 : 1, paperOp = hl === 'solvent' ? .5 : 1
  const cx = sx + sw / 2
  return <g>
    <path d={`M${bx} ${top}V${bottom - 14}Q${bx} ${bottom} ${bx + 14} ${bottom}H${bx + bw - 14}Q${bx + bw} ${bottom} ${bx + bw} ${bottom - 14}V${top}Z`} fill={glass} />
    {hl === 'paper' && <rect x={sx - 10} y={sTop - 4} width={sw + 20} height={sBottom - sTop + 10} rx="14" fill={halo} opacity=".6" />}
    <g opacity={solventOp}>
      {hl === 'solvent' && <path d={`M${bx - 6} ${surface - 7}H${bx + bw + 6}V${bottom - 10}Q${bx + bw + 6} ${bottom + 6} ${bx + bw - 10} ${bottom + 6}H${bx + 10}Q${bx - 6} ${bottom + 6} ${bx - 6} ${bottom - 10}Z`} fill={halo} opacity=".55" />}
      <path d={`M${bx + 2} ${surface}H${bx + bw - 2}V${bottom - 14}Q${bx + bw - 2} ${bottom - 2} ${bx + bw - 14} ${bottom - 2}H${bx + 14}Q${bx + 2} ${bottom - 2} ${bx + 2} ${bottom - 14}Z`} fill={solvent} />
      <path d={`M${bx + 2} ${surface}H${bx + bw - 2}`} stroke={solventLine} strokeWidth="1.8" />
    </g>
    <g opacity={paperOp}>
      <Strip x={sx} top={sTop} w={sw} bottom={sBottom} line={line} front={front} spots={spots} mixed={mixed} />
    </g>
    {hl === 'solvent' && front !== undefined && <g>
      <rect x={sx + 1} y={front} width={sw - 2} height={sBottom - front - 1} fill={solvent} opacity=".7" />
      {spots.map(([c, f], i) => <Spot key={i} x={cx} y={spotY(line, front, f)} c={c} />)}
    </g>}
    {(rising || hl === 'solvent') && front !== undefined && <g>
      <Arrow from={[sx - 14, sBottom - 14]} to={[sx - 14, front + 12]} colour={solventLine} width={2.4} />
      <Arrow from={[sx + sw + 14, sBottom - 14]} to={[sx + sw + 14, front + 12]} colour={solventLine} width={2.4} />
    </g>}
    <path d={`M${bx - 7} ${top - 3}Q${bx} ${top - 1} ${bx} ${top + 7}V${bottom - 14}Q${bx} ${bottom} ${bx + 14} ${bottom}H${bx + bw - 14}Q${bx + bw} ${bottom} ${bx + bw} ${bottom - 14}V${top}`} fill="none" stroke={glassLine} strokeWidth="2.4" />
    <path d={`M${bx + 9} ${top + 14}V${bottom - 22}`} stroke="white" strokeWidth="3" opacity=".8" />
    {/* rod and clip holding the strip */}
    <rect x={bx - 12} y={top - 10} width={bw + 24} height={6} rx="3" fill="#c9b08a" stroke="#8a6f45" strokeWidth="1.2" />
    <rect x={cx - 9} y={top - 8} width={18} height={14} rx="3" fill="#9aa4ad" stroke="#5f6b75" strokeWidth="1.2" />
  </g>
}
const SCENE_LINE = 226, SCENE_STRIP: Pt = [112, 52]

// ---------- Section 1: what it is for, and the two phases ----------
function Purpose() {
  const top = 40, bottom = 236, line = 212, front = 58, w = 56
  return <Diagram title="Chromatography separates a mixture, then the separate substances can be identified. A strip with one mixed ink spot becomes a strip with three separate coloured spots; each spot can then be matched to a chemical.">
    <Strip x={50} top={top} w={w} bottom={bottom} line={line} mixed wetOn={false} />
    <text x={78} y={262} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>mixture</text>
    <Arrow from={[124, 138]} to={[192, 138]} width={2.6} />
    <Badge x={158} y={112} text="1 separate" />
    <Strip x={212} top={top} w={w} bottom={bottom} line={line} front={front} spots={[['yellow', .82], ['pink', .52], ['purple', .22]]} />
    <text x={240} y={262} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>separate spots</text>
    <Arrow from={[286, 138]} to={[354, 138]} width={2.6} />
    <Badge x={320} y={112} text="2 identify" />
    <g>
      <rect x={370} y={70} width={150} height={136} rx="16" fill={panelFill} stroke={panelLine} strokeWidth="1.6" />
      {(['yellow', 'pink', 'purple'] as Dye[]).map((c, i) => <g key={c}>
        <Spot x={396} y={104 + i * 36} c={c} r={8} />
        <text x={416} y={109 + i * 36} fontSize="14" fontWeight="700" fill={dye[c][1]}>{`chemical ${'ABC'[i]}`}</text>
      </g>)}
    </g>
    <Caption text="Separate the substances, then identify them" y={290} />
  </Diagram>
}
function Badge({ x, y, text }: { x: number; y: number; text: string }) {
  const w = text.length * 8 + 18
  return <g><rect x={r1(x - w / 2)} y={y - 14} width={w} height={24} rx="12" fill="white" stroke={ink} strokeWidth="1.6" /><text x={x} y={y + 3} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{text}</text></g>
}
type PhaseStep = 'phases' | 'mobile' | 'stationary'
const PHASE_TITLES: Record<PhaseStep, string> = {
  phases: 'The chromatography set-up: a paper strip hangs in a beaker with a shallow layer of solvent. Every type of chromatography has two phases: a mobile phase, which moves, and a stationary phase, which does not.',
  mobile: 'The solvent is highlighted, with arrows showing it moving up the paper. The mobile phase is the solvent, such as water or ethanol: molecules can move in it.',
  stationary: 'The paper strip is highlighted. The stationary phase is the paper: molecules cannot move in it.',
}
function PhaseRow({ y, name, lines, extra, mode, colour, icon }: { y: number; name: string; lines: string; extra?: string[]; mode: 'on' | 'active' | 'off'; colour: string; icon: ReactNode }) {
  const active = mode === 'active'
  return <g opacity={mode === 'off' ? .42 : 1}>
    {active && <rect x={262} y={y - 30} width={264} height={extra ? 60 + extra.length * 18 : 70} rx="18" fill={halo} opacity=".3" />}
    <rect x={270} y={y - 22} width={44} height={44} rx="14" fill={panelFill} stroke={active ? colour : panelLine} strokeWidth="1.8" />
    <g transform={`translate(292 ${y})`}>{icon}</g>
    <text x={328} y={y - 4} fontSize="16" fontWeight="700" fill={active ? colour : ink}>{name}</text>
    <text x={328} y={y + 16} fontSize="13" fontWeight="600" fill={ink}>{lines}</text>
    {extra && <Lines x={328} y={y + 38} lines={extra} size={13} colour={colour} />}
  </g>
}
function Phases({ step }: { step: PhaseStep }) {
  const front = 150
  const row1: 'on' | 'active' | 'off' = step === 'mobile' ? 'active' : step === 'stationary' ? 'off' : 'on'
  const row2: 'on' | 'active' | 'off' = step === 'stationary' ? 'active' : step === 'mobile' ? 'off' : 'on'
  return <Diagram title={PHASE_TITLES[step]}>
    <Scene front={front} spots={[['yellow', .7], ['pink', .45], ['purple', .2]]} hl={step === 'mobile' ? 'solvent' : step === 'stationary' ? 'paper' : 'none'} />
    <text x={270} y={46} fontSize="15" fontWeight="700" fill={ink}>Two phases</text>
    <PhaseRow y={108} name="mobile phase" lines="molecules can move" extra={step === 'mobile' ? ['the solvent, such as', 'water or ethanol'] : undefined} mode={row1} colour={solventText}
      icon={<g><path d="M-12 8Q-6 2 0 8T12 8" stroke={solventLine} strokeWidth="2.4" fill="none" /><Arrow from={[0, 4]} to={[0, -12]} colour={solventLine} width={2.2} /></g>} />
    <PhaseRow y={214} name="stationary phase" lines="molecules cannot move" extra={step === 'stationary' ? ['the paper'] : undefined} mode={row2} colour={paperText}
      icon={<g><rect x={-9} y={-13} width={18} height={26} rx="3" fill={paper} stroke={paperLine} strokeWidth="1.6" /><path d="M-5 6H5" stroke={pencil} strokeWidth="1.6" /></g>} />
    {step === 'mobile' && <Leader from={[262, 128]} to={[200, 256]} colour={solventText} />}
    {step === 'stationary' && <Leader from={[262, 234]} to={[SCENE_STRIP[0] + SCENE_STRIP[1] - 4, 110]} colour={paperText} />}
    <Caption text={step === 'phases' ? 'One phase moves, one does not' : step === 'mobile' ? 'Mobile phase: the solvent' : 'Stationary phase: the paper'} y={292} />
  </Diagram>
}

// ---------- Section 2: why the spots separate ----------
function Carry() {
  const front = 112, line = SCENE_LINE, cx = SCENE_STRIP[0] + SCENE_STRIP[1] / 2
  const spots: Array<[Dye, number]> = [['yellow', .8], ['pink', .5], ['purple', .2]]
  return <Diagram title="Part way through: the solvent has soaked up the paper to a wet line, and three chemicals from the mixture are being carried upwards, each a different distance so far.">
    <Scene front={front} spots={spots} rising />
    {spots.map(([c, f]) => { const y = spotY(line, front, f); return <path key={c} d={`M${cx - 6} ${y - 9}L${cx} ${y - 15}L${cx + 6} ${y - 9}`} stroke={dye[c][1]} strokeWidth="2.2" fill="none" /> })}
    <Lines x={262} y={96} lines={['the solvent soaks', 'up the paper']} colour={solventText} />
    <Leader from={[258, 110]} to={[158, 124]} colour={solventText} />
    <Lines x={262} y={186} lines={['it carries the chemicals', 'up with it, but not all', 'at the same speed']} />
    <Leader from={[258, 196]} to={[cx + 12, spotY(line, front, .48)]} />
    <Caption text="The solvent carries the chemicals upwards" y={292} />
  </Diagram>
}
function Distribution() {
  const cx = 290, cy = 150, r = 104
  const fibres = [-80, -40, 0, 40, 80]
  return <Diagram title="A magnified view of wet paper. Paper fibres stand still; solvent flows up between them. The same chemical is shown twice: once dissolved in the solvent and moving up, once stuck to a paper fibre and staying still. The time it spends dissolved is called its distribution.">
    <Strip x={40} top={60} w={50} bottom={250} line={222} front={120} spots={[['pink', .5]]} />
    <path d={`M92 ${spotY(222, 120, .5) - 12}L${cx - r + 10} ${cy - 50}M92 ${spotY(222, 120, .5) + 12}L${cx - r + 10} ${cy + 50}`} stroke={muted} strokeWidth="1.3" strokeDasharray="4 4" />
    <Magnify cx={cx} cy={cy} r={r}>
      <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill={solvent} />
      {fibres.map(dx => <path key={dx} d={`M${cx + dx - 6} ${cy - r}C${cx + dx + 8} ${cy - 40} ${cx + dx - 10} ${cy + 20} ${cx + dx + 4} ${cy + r}`} stroke={fibreLine} strokeWidth="16" fill="none" />)}
      {fibres.map(dx => <path key={`f${dx}`} d={`M${cx + dx - 6} ${cy - r}C${cx + dx + 8} ${cy - 40} ${cx + dx - 10} ${cy + 20} ${cx + dx + 4} ${cy + r}`} stroke={fibre} strokeWidth="13" fill="none" />)}
      {[-60, 20, 60].map(dx => <Arrow key={dx} from={[cx + dx, cy + 70]} to={[cx + dx, cy + 30]} colour={solventLine} width={2} />)}
      {/* dissolved: between fibres, moving */}
      <circle cx={cx - 20} cy={cy - 30} r={10} fill={dye.pink[0]} stroke={dye.pink[1]} strokeWidth="1.8" />
      <Arrow from={[cx - 20, cy - 44]} to={[cx - 20, cy - 74]} colour={dye.pink[1]} width={2.4} />
      {/* stuck on a fibre */}
      <circle cx={cx + 50} cy={cy + 22} r={10} fill={dye.pink[0]} stroke={dye.pink[1]} strokeWidth="1.8" />
    </Magnify>
    <Lines x={408} y={62} lines={['dissolved:', 'moves up']} colour={dye.pink[1]} />
    <Leader from={[404, 68]} to={[cx - 8, cy - 32]} colour={dye.pink[1]} />
    <Lines x={414} y={206} lines={['stuck on', 'the paper:', 'stays still']} colour={paperText} />
    <Leader from={[410, 212]} to={[cx + 58, cy + 28]} colour={paperText} />
    <text x={cx} y={cy + r + 26} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>time dissolved = distribution</text>
  </Diagram>
}
function Magnify({ cx, cy, r, children }: { cx: number; cy: number; r: number; children: ReactNode }) {
  const clip = useId()
  return <g>
    <clipPath id={clip}><circle cx={cx} cy={cy} r={r - 2} /></clipPath>
    <circle cx={cx} cy={cy} r={r} fill="white" />
    <g clipPath={`url(#${clip})`}>{children}</g>
    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#7f9fb8" strokeWidth="3" />
  </g>
}
function DistanceArrow({ x, line, y, c }: { x: number; line: number; y: number; c: Dye }) {
  return <g><path d={`M${x - 5} ${line}H${x + 5}`} stroke={dye[c][1]} strokeWidth="2" /><Arrow from={[x, line]} to={[x, y]} colour={dye[c][1]} width={2.2} /></g>
}
function Soluble() {
  const top = 40, bottom = 256, line = 232, front = 60, w = 60
  return <Diagram title="Two strips with the same solvent front. A very soluble chemical spends more time dissolved and has moved far up its strip. A less soluble chemical spends less time dissolved and has stayed low down.">
    <Strip x={60} top={top} w={w} bottom={bottom} line={line} front={front} spots={[['pink', .82]]} frontMark />
    <DistanceArrow x={138} line={line} y={spotY(line, front, .82) + 8} c="pink" />
    <Strip x={180} top={top} w={w} bottom={bottom} line={line} front={front} spots={[['purple', .22]]} frontMark />
    <DistanceArrow x={258} line={line} y={spotY(line, front, .22) + 8} c="purple" />
    <Lines x={296} y={76} lines={['more soluble:', 'more time dissolved,', 'moves further up']} colour={dye.pink[1]} />
    <Lines x={296} y={180} lines={['less soluble:', 'less time dissolved,', 'stays lower down']} colour={dye.purple[1]} />
    <Caption text="More soluble in the solvent: further up the paper" y={286} />
  </Diagram>
}
function Different() {
  const top = 36, bottom = 256, line = 232, front = 56, x = 150, w = 64
  const spots: Array<[Dye, number]> = [['yellow', .84], ['pink', .54], ['purple', .24]]
  return <Diagram title="One strip with three chemicals at three different heights. Arrows from the pencil line show that each chemical has moved a different distance.">
    <Strip x={x} top={top} w={w} bottom={bottom} line={line} front={front} spots={spots} />
    {spots.map(([c, f], i) => <DistanceArrow key={c} x={x + w + 20 + i * 22} line={line} y={spotY(line, front, f) + 2} c={c} />)}
    {spots.map(([c, f]) => <path key={`g${c}`} d={`M${x + w / 2 + 12} ${spotY(line, front, f)}H${x + w + 12}`} stroke={dye[c][1]} strokeWidth="1.2" strokeDasharray="3 3" />)}
    <Lines x={310} y={100} lines={['different chemicals', 'spend different times', 'dissolved']} />
    <Lines x={310} y={176} lines={['so they move', 'different distances']} colour={muted} />
    <Lines x={x - 12} y={line + 5} anchor="end" lines={['start line']} size={13} weight={600} colour={muted} />
    <Caption text="Different times dissolved, different distances" y={286} />
  </Diagram>
}
function Spots() {
  const top = 40, bottom = 250, line = 224, front = 60, w = 64
  const spots: Array<[Dye, number]> = [['yellow', .82], ['pink', .52], ['purple', .22]]
  const ax = 330, cx = ax + w / 2
  return <Diagram title="Before: one mixed ink spot on the pencil line. After: the chemicals have moved different distances up from the start, so the mixture has separated into three spots.">
    <Strip x={100} top={top} w={w} bottom={bottom} line={line} mixed wetOn={false} />
    <text x={132} y={274} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>before</text>
    <Arrow from={[190, 146]} to={[300, 146]} width={2.6} />
    <text x={245} y={132} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>solvent runs</text>
    <Strip x={ax} top={top} w={w} bottom={bottom} line={line} front={front} ghost />
    {spots.map(([c, f]) => <Spot key={`s${c}`} x={cx} y={spotY(line, front, f)} c={c} />)}
    <text x={cx} y={274} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>after</text>
    <Lines x={ax + w + 16} y={112} lines={['three', 'separate', 'spots']} colour={ink} />
    <Lines x={100 + w + 12} y={line + 5} lines={['one mixed spot']} size={13} weight={600} colour={muted} />
  </Diagram>
}

// ---------- Section 3: reading a chromatogram ----------
const GRAM = { x: 160, top: 26, w: 76, bottom: 262, line: 234, front: 58 }
const THREE: Array<[Dye, number]> = [['yellow', .8], ['pink', .5], ['purple', .2]]
function Gram({ spots = THREE, frontMark = false, x = GRAM.x }: { spots?: Array<[Dye, number]>; frontMark?: boolean; x?: number }) {
  return <Strip x={x} top={GRAM.top} w={GRAM.w} bottom={GRAM.bottom} line={GRAM.line} front={GRAM.front} spots={spots} wetOn={false} frontMark={frontMark} />
}
const gy = (f: number) => spotY(GRAM.line, GRAM.front, f)
const gcx = GRAM.x + GRAM.w / 2
function Front() {
  return <Diagram title="A finished chromatogram. At the bottom is the pencil start line. The chemicals are three spots. Near the top, a dashed pencil line marks the solvent front: the furthest point reached by the solvent.">
    <Gram frontMark />
    <Lines x={290} y={50} lines={['solvent front:']} colour={solventText} size={15} />
    <Lines x={290} y={70} lines={['furthest point reached', 'by the solvent']} size={13} weight={600} />
    <Leader from={[286, 56]} to={[GRAM.x + GRAM.w - 6, GRAM.front]} colour={solventText} />
    <Lines x={290} y={214} lines={['start line:']} colour={pencil} size={15} />
    <Lines x={290} y={234} lines={['drawn in pencil']} size={13} weight={600} />
    <Leader from={[286, 222]} to={[GRAM.x + GRAM.w - 8, GRAM.line]} colour={pencil} />
    <Caption text="Mark the solvent front when the paper comes out" y={290} />
  </Diagram>
}
function GramLabels() {
  return <Diagram title="A chromatogram with three spots in different colours at different heights. Each spot is a different chemical: different spots, different chemicals.">
    <Gram />
    {THREE.map(([c, f], i) => <g key={c}>
      <Lines x={300} y={gy(f) + 5} lines={[`chemical ${'ABC'[i]}`]} colour={dye[c][1]} />
      <Leader from={[294, gy(f)]} to={[gcx + 13, gy(f)]} colour={dye[c][1]} />
    </g>)}
    <Caption text="Different spots = different chemicals" y={290} />
  </Diagram>
}
function Count() {
  return <Diagram title="A chromatogram with three spots numbered 1, 2 and 3. Three spots means the mixture has at least three chemicals.">
    <Gram />
    {THREE.map(([, f], i) => <g key={i}>
      <circle cx={GRAM.x - 26} cy={gy(f)} r="13" fill={ink} /><text x={GRAM.x - 26} y={gy(f) + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="white">{3 - i}</text>
    </g>)}
    <g>
      <rect x={300} y={96} width={200} height={96} rx="18" fill={panelFill} stroke={panelLine} strokeWidth="1.6" />
      <text x={400} y={134} textAnchor="middle" fontSize="18" fontWeight="700" fill={ink}>3 spots:</text>
      <text x={400} y={162} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>at least 3 chemicals</text>
    </g>
    <Caption text="The number of spots is the smallest possible number" y={290} />
  </Diagram>
}
function Overlap() {
  const spots: Array<[Dye, number]> = [['yellow', .78], ['blend', .38]]
  const cx = 400, cy = 150, r = 74
  const parts = [[-30, -26, 'pink'], [6, -36, 'purple'], [34, -12, 'pink'], [-40, 8, 'purple'], [-8, -4, 'pink'], [22, 18, 'purple'], [-22, 34, 'pink'], [8, 40, 'purple'], [42, 30, 'pink']] as const
  return <Diagram title="A chromatogram with two spots. The lower spot is magnified: it holds particles of two different chemicals, pink and purple, which travelled the same distance and so made only one spot.">
    <Gram spots={spots} x={140} />
    <path d={`M${140 + GRAM.w / 2 + 12} ${gy(.38) - 8}L${cx - r + 6} ${cy - 36}M${140 + GRAM.w / 2 + 12} ${gy(.38) + 8}L${cx - r + 6} ${cy + 36}`} stroke={muted} strokeWidth="1.3" strokeDasharray="4 4" />
    <Magnify cx={cx} cy={cy} r={r}>
      <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill="#fbf1f8" />
      {parts.map(([dx, dy, c], i) => <circle key={i} cx={cx + dx} cy={cy + dy} r={9} fill={dye[c][0]} stroke={dye[c][1]} strokeWidth="1.6" />)}
    </Magnify>
    <Lines x={cx} y={cy + r + 26} anchor="middle" lines={['two chemicals, same distance:', 'one spot']} size={14} />
    <Caption text="So the number of spots is only a minimum" y={292} />
  </Diagram>
}
function Solvents() {
  const w = 64
  const a: Array<[Dye, number]> = [['yellow', .74], ['blend', .34]]
  const b: Array<[Dye, number]> = [['pink', .82], ['yellow', .5], ['purple', .18]]
  return <Diagram title="The same mixture run with two different solvents. With solvent A there are two spots. With solvent B there are three spots, at different heights.">
    <text x={270} y={30} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>same mixture, different solvents</text>
    {([[130, 'solvent A', a], [346, 'solvent B', b]] as const).map(([x, name, spots]) => <g key={name}>
      <Strip x={x} top={46} w={w} bottom={246} line={222} front={70} spots={spots as Array<[Dye, number]>} wetOn={false} frontMark />
      <text x={x + w / 2} y={270} textAnchor="middle" fontSize="15" fontWeight="700" fill={solventText}>{name}</text>
      <text x={x + w / 2} y={290} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>{`${spots.length} spots`}</text>
    </g>)}
    <Arrow from={[220, 146]} to={[320, 146]} colour={muted} width={2} dashed />
    <Lines x={270} y={132} anchor="middle" lines={['repeat']} size={13} weight={600} colour={muted} />
  </Diagram>
}
function PureRow() {
  const heights = [.3, .72, .5, .86, .16], w = 44
  return <Diagram title="Five small chromatograms of the same substance, one for each of five different solvents. Each has a single spot, at a different height each time. One spot every time: the substance is likely to be pure.">
    {heights.map((f, i) => { const x = 36 + i * 100; return <g key={i}>
      <Strip x={x} top={40} w={w} bottom={226} line={204} front={60} spots={[['purple', f]]} wetOn={false} frontMark />
      <text x={x + w / 2} y={248} textAnchor="middle" fontSize="13" fontWeight="700" fill={solventText}>{`solvent ${i + 1}`}</text>
    </g> })}
    <Lines x={270} y={282} anchor="middle" lines={['one spot every time: likely pure']} size={15} colour="#4f9a74" />
  </Diagram>
}

// ---------- Question visual ----------
function SpotsQuestion({ assessment }: { assessment: boolean }) {
  const spots: Array<[Dye, number]> = [['yellow', .84], ['pink', .52], ['purple', .2]]
  return <Diagram title={assessment
    ? 'A chromatogram with three numbered spots between a start line and a solvent front line.'
    : 'A chromatogram with three numbered spots. Spot 3 is nearest the solvent front, so it moved furthest and is the most soluble. Spot 1 is nearest the start line.'}>
    <Gram spots={spots} frontMark />
    {spots.map(([, f], i) => <Pointer key={i} n={3 - i} x={GRAM.x - 44} y={gy(f) - 14} to={[gcx - 12, gy(f)]} />)}
    <Lines x={290} y={GRAM.front + 5} lines={['solvent front']} colour={solventText} />
    <Leader from={[284, GRAM.front]} to={[GRAM.x + GRAM.w - 4, GRAM.front]} colour={solventText} />
    <Lines x={290} y={GRAM.line + 5} lines={['start line']} colour={pencil} />
    <Leader from={[284, GRAM.line]} to={[GRAM.x + GRAM.w - 6, GRAM.line]} colour={pencil} />
    {!assessment && <Lines x={290} y={gy(.84) + 30} lines={['3: moved furthest,', 'most soluble']} size={13} colour="#4f9a74" />}
  </Diagram>
}

export function ChromaVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus === 'chroma-purpose') return <Purpose />
  if (focus === 'chroma-phases') return <Phases step="phases" />
  if (focus === 'chroma-mobile') return <Phases step="mobile" />
  if (focus === 'chroma-stationary') return <Phases step="stationary" />
  if (focus === 'chroma-carry') return <Carry />
  if (focus === 'chroma-distribution') return <Distribution />
  if (focus === 'chroma-soluble') return <Soluble />
  if (focus === 'chroma-different') return <Different />
  if (focus === 'chroma-spots') return <Spots />
  if (focus === 'chroma-front') return <Front />
  if (focus === 'chroma-gram') return <GramLabels />
  if (focus === 'chroma-count') return <Count />
  if (focus === 'chroma-overlap') return <Overlap />
  if (focus === 'chroma-solvents') return <Solvents />
  if (focus === 'chroma-pure') return <PureRow />
  if (focus === 'chroma-q-spots') return <SpotsQuestion assessment={assessment} />
  return <Phases step="phases" />
}
