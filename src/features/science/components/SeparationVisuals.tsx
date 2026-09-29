import { useId, type ReactNode } from 'react'
import { Arrow } from './InfectionVisuals'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C1a, Chemistry Lesson 4: filtration, crystallisation, simple and fractional distillation.
 * Original, code-native schematics of school apparatus; not to scale. Focus ids start with 'sep-'.
 *
 * Colour code for separating mixtures (kept the same in every drawing here):
 *   water / solvent = pale blue fill, blue line           salt (dissolved or as crystals) = lavender
 *   sand            = tan grains                          heat / flame = orange, the highlight colour for "heat"
 *   gas (vapour)    = dashed grey-blue arrows             cold water in the condenser = blue arrows
 *   propanone       = pale green (the first fraction)     glassware = very pale blue with a grey-blue line
 * Walkthroughs reuse one drawing per section and change what is highlighted, like the plant-transport lesson.
 * The distillation apparatus is drawn correctly: thermometer bulb level with the side arm, condenser water in at the
 * bottom (lower end) and out at the top (upper end), condenser sloping down to the collecting vessel.
 */
const { ink, muted, panelFill, panelLine } = atomPalette
const glass = '#f5fafd', glassLine = '#6f8fa6'
const water = '#d4e9f8', waterLine = '#3f8fd0', cold = '#2f78b7'
const salt = '#e6ddf5', saltLine = '#7d68b0'
const sand = '#e8c98f', sandLine = '#a87c38'
const flameOut = '#f5a54a', flameIn = '#fcd97d', heatLine = '#c8641e'
const vapour = '#7f9fb8', vapourText = '#4f7390'
const prop = '#d4ecdd', propLine = '#4f9a74'
const paper = '#fbf6ea', paperLine = '#b9a77a', paperText = '#8c7640'
const halo = '#f8c979'
const metal = '#9aa7b2', metalLine = '#66737e'
const faded = .3

type Mode = 'on' | 'active' | 'off'
type Pt = [number, number]
const r1 = (n: number) => Math.round(n * 10) / 10

function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}

// ---------- Numbered key and pointers (the house style) ----------
function Num({ n, x, y, mode, colour = ink }: { n: number | string; x: number; y: number; mode: Mode; colour?: string }) {
  const active = mode === 'active'
  return <g opacity={mode === 'off' ? .42 : 1}>
    <circle cx={x} cy={y} r="12" fill={active ? colour : 'white'} stroke={active ? colour : ink} strokeWidth="2" />
    <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={active ? 'white' : ink}>{n}</text>
  </g>
}
function KeyRow({ n, x, y, lines, mode, colour = ink }: { n: number; x: number; y: number; lines: string[]; mode: Mode; colour?: string }) {
  const active = mode === 'active'
  return <g opacity={mode === 'off' ? .42 : 1}>
    <Num n={n} x={x} y={y} mode={mode === 'off' ? 'on' : mode} colour={colour} />
    <text x={x + 22} y={y + 5 - (lines.length - 1) * 8} fontSize="14" fontWeight={active ? 700 : 600} fill={active ? colour : ink}>{lines.map((l, j) => <tspan key={j} x={x + 22} dy={j ? 16 : 0}>{l}</tspan>)}</text>
  </g>
}
function Pointer({ n, x, y, to }: { n: number; x: number; y: number; to: Pt }) {
  const angle = Math.atan2(to[1] - y, to[0] - x)
  return <g><path d={`M${r1(x + Math.cos(angle) * 13)} ${r1(y + Math.sin(angle) * 13)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
    <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}
/** A short label with a leader line ending in a dot on the feature. */
function Tag({ x, y, text, to, anchor = 'start', colour = ink, size = 13 }: { x: number; y: number; text: string; to?: Pt; anchor?: 'start' | 'middle' | 'end'; colour?: string; size?: number }) {
  const sx = anchor === 'start' ? x - 4 : anchor === 'end' ? x + 4 : x
  return <g>
    {to && <><path d={`M${r1(sx)} ${y - 4}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.3" /><circle cx={to[0]} cy={to[1]} r="2.5" fill={ink} /></>}
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight="700" fill={colour}>{text}</text>
  </g>
}

// ---------- Apparatus pieces ----------
function Crystal({ x, y, s = 6 }: { x: number; y: number; s?: number }) {
  return <rect x={r1(x - s / 2)} y={r1(y - s / 2)} width={s} height={s} rx="1" fill={salt} stroke={saltLine} strokeWidth="1.2" transform={`rotate(${(x * 7 + y * 3) % 40 - 20} ${r1(x)} ${r1(y)})`} />
}
function Grain({ x, y, s = 4 }: { x: number; y: number; s?: number }) {
  return <ellipse cx={r1(x)} cy={r1(y)} rx={s} ry={s * .75} fill={sand} stroke={sandLine} strokeWidth="1.1" transform={`rotate(${(x * 13 + y * 5) % 60} ${r1(x)} ${r1(y)})`} />
}
/** A beaker: x,y is the top-left of the rim. `level` is the liquid height as a fraction of the beaker. */
function Beaker({ x, y, w, h, level = 0, fill = water, line = waterLine, children }: { x: number; y: number; w: number; h: number; level?: number; fill?: string; line?: string; children?: ReactNode }) {
  const top = y + h - h * level
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="6" fill={glass} />
    {level > 0 && <path d={`M${x + 2} ${r1(top)}H${x + w - 2}V${y + h - 6}Q${x + w - 2} ${y + h - 2} ${x + w - 6} ${y + h - 2}H${x + 6}Q${x + 2} ${y + h - 2} ${x + 2} ${y + h - 6}Z`} fill={fill} />}
    {level > 0 && <path d={`M${x + 2} ${r1(top)}H${x + w - 2}`} stroke={line} strokeWidth="1.8" />}
    {children}
    <path d={`M${x - 6} ${y - 2}Q${x} ${y} ${x} ${y + 6}V${y + h - 8}Q${x} ${y + h} ${x + 8} ${y + h}H${x + w - 8}Q${x + w} ${y + h} ${x + w} ${y + h - 8}V${y}`} fill="none" stroke={glassLine} strokeWidth="2.4" />
  </g>
}
/** A conical flask; x is its centre line, y the top of the neck, h its height. */
function Conical({ x, y, h, w, level = 0, fill = water, line = waterLine }: { x: number; y: number; h: number; w: number; level?: number; fill?: string; line?: string }) {
  const neck = w * .2, shoulder = y + h * .28, bottom = y + h
  const outline = `M${x - neck} ${y}V${shoulder}L${x - w / 2} ${bottom - 4}Q${x - w / 2} ${bottom} ${x - w / 2 + 4} ${bottom}H${x + w / 2 - 4}Q${x + w / 2} ${bottom} ${x + w / 2} ${bottom - 4}L${x + neck} ${shoulder}V${y}`
  const top = bottom - h * level, halfAt = (yy: number) => neck + (w / 2 - neck) * (yy - shoulder) / (bottom - shoulder)
  return <g>
    <path d={outline + 'Z'} fill={glass} />
    {level > 0 && <path d={`M${r1(x - halfAt(top))} ${r1(top)}L${x - w / 2 + 1} ${bottom - 2}H${x + w / 2 - 1}L${r1(x + halfAt(top))} ${r1(top)}Z`} fill={fill} stroke={line} strokeWidth="1.5" />}
    <path d={outline} fill="none" stroke={glassLine} strokeWidth="2.4" />
  </g>
}
function Flame({ cx, base, size = 1 }: { cx: number; base: number; size?: number }) {
  const h = 30 * size, w = 10 * size
  return <g>
    <path d={`M${cx - w} ${base}Q${cx - w} ${r1(base - h * .55)} ${cx} ${r1(base - h)}Q${cx + w} ${r1(base - h * .55)} ${cx + w} ${base}Z`} fill={flameOut} stroke={heatLine} strokeWidth="1.4" />
    <path d={`M${r1(cx - w * .5)} ${base}Q${r1(cx - w * .5)} ${r1(base - h * .35)} ${cx} ${r1(base - h * .62)}Q${r1(cx + w * .5)} ${r1(base - h * .35)} ${r1(cx + w * .5)} ${base}Z`} fill={flameIn} />
  </g>
}
/** Tripod with gauze on top at gauzeY and a Bunsen burner under it, standing on the bench at ground. */
function HeatStand({ cx, gauzeY, ground, flame = 'full', width = 110 }: { cx: number; gauzeY: number; ground: number; flame?: 'off' | 'gentle' | 'full'; width?: number }) {
  const tubeTop = gauzeY + 34
  return <g>
    <path d={`M${cx - width / 2 + 10} ${gauzeY + 4}L${cx - width / 2} ${ground}M${cx + width / 2 - 10} ${gauzeY + 4}L${cx + width / 2} ${ground}`} stroke={metalLine} strokeWidth="4" />
    <rect x={cx - width / 2} y={gauzeY} width={width} height={5} rx="1.5" fill={metal} stroke={metalLine} strokeWidth="1.2" />
    <path d={`M${cx - width / 2 + 6} ${gauzeY + 2.5}H${cx + width / 2 - 6}`} stroke="white" strokeWidth="1" strokeDasharray="2 3" />
    {flame !== 'off' && <Flame cx={cx} base={tubeTop} size={flame === 'gentle' ? .65 : 1} />}
    <rect x={cx - 6} y={tubeTop} width={12} height={ground - tubeTop - 8} fill={metal} stroke={metalLine} strokeWidth="1.4" />
    <rect x={cx - 22} y={ground - 9} width={44} height={9} rx="3" fill={metal} stroke={metalLine} strokeWidth="1.4" />
  </g>
}
/** A shallow evaporating dish sitting with its base at y. */
function Dish({ cx, y, w = 110, contents = 'solution' }: { cx: number; y: number; w?: number; contents?: 'solution' | 'crystals' | 'dry' | 'none' }) {
  const top = y - 26, half = w / 2
  const surface = contents === 'dry' ? top + 15 : top + 8
  const halfAt = (yy: number) => half * Math.sqrt(Math.max(0, 1 - ((yy - top) / 26) ** 2)) - 3
  const hs = halfAt(surface)
  const crystals: Pt[] = contents === 'dry' ? [[-30, -6], [-18, -4], [-6, -5], [6, -4], [18, -5], [30, -6], [-24, -11], [-11, -10], [2, -10], [14, -11], [26, -11], [-2, -15], [-38, -9], [38, -9]]
    : contents === 'crystals' ? [[-hs + 7, 0], [hs - 7, 0], [-hs + 15, 1], [hs - 15, 1], [0, 7], [-14, 6], [14, 7]] : []
  return <g>
    <path d={`M${cx - half} ${top}Q${cx - half} ${y} ${cx} ${y}Q${cx + half} ${y} ${cx + half} ${top}Z`} fill="#fbfbfb" />
    {(contents === 'solution' || contents === 'crystals') && <path d={`M${r1(cx - hs)} ${surface}H${r1(cx + hs)}Q${r1(cx + hs * .9)} ${y - 3} ${cx} ${y - 3}Q${r1(cx - hs * .9)} ${y - 3} ${r1(cx - hs)} ${surface}Z`} fill={water} stroke={waterLine} strokeWidth="1.5" />}
    {crystals.map(([dx, dy], i) => <Crystal key={i} x={cx + dx} y={contents === 'dry' ? y + dy - 1 : surface + dy + 3} s={6} />)}
    <path d={`M${cx - half - 4} ${top}Q${cx - half} ${y + 1} ${cx} ${y + 1}Q${cx + half} ${y + 1} ${cx + half + 4} ${top}`} fill="none" stroke="#7d8a95" strokeWidth="2.6" />
  </g>
}
function Steam({ cx, y, n = 3 }: { cx: number; y: number; n?: number }) {
  return <g fill="none" stroke={vapour} strokeWidth="2" opacity=".85">
    {Array.from({ length: n }, (_, i) => { const x = cx + (i - (n - 1) / 2) * 24; return <path key={i} d={`M${x} ${y}q-7 -9 0 -18q7 -9 0 -18`} /> })}
  </g>
}
/** A funnel with a filter-paper cone. cx is the centre line, top the rim. */
function Funnel({ cx, top, w = 150, sandy = false, residue = false, liquidTop }: { cx: number; top: number; w?: number; sandy?: boolean; residue?: boolean; liquidTop?: number }) {
  const h = w * .72, apex = top + h, stemEnd = apex + w * .38
  const paperTop = top + w * .06, ph = (apex - 4) - paperTop, pw = w / 2 - w * .07
  const halfAt = (yy: number) => pw * (apex - 4 - yy) / ph
  const lt = liquidTop ?? top + h * .45
  const grains: Pt[] = []
  if (residue) for (let row = 0; row < (w > 120 ? 6 : 4); row++) { const yy = apex - 12 - row * 6.5, hw = Math.max(0, halfAt(yy) - 5); for (let x = -hw; x <= hw + .1; x += 7.5) grains.push([cx + x + (row % 2) * 2, yy]) }
  return <g>
    <path d={`M${cx - w / 2} ${top}L${cx - 7} ${apex}V${stemEnd}H${cx + 7}V${apex}L${cx + w / 2} ${top}Z`} fill={glass} />
    <path d={`M${r1(cx - pw)} ${r1(paperTop)}L${cx} ${apex - 4}L${r1(cx + pw)} ${r1(paperTop)}Z`} fill={paper} stroke={paperLine} strokeWidth="1.6" />
    {liquidTop !== undefined && <path d={`M${r1(cx - halfAt(lt) + 2)} ${r1(lt)}L${cx} ${apex - 7}L${r1(cx + halfAt(lt) - 2)} ${r1(lt)}Z`} fill={water} stroke={waterLine} strokeWidth="1.5" />}
    {sandy && [[-18, 12], [6, 20], [16, 8], [-6, 28], [-2, 6]].map(([dx, dy], i) => <Grain key={`s${i}`} x={cx + dx} y={lt + dy} s={3.5} />)}
    {grains.map(([x, y], i) => <Grain key={i} x={x} y={y} s={4} />)}
    <path d={`M${cx - w / 2 - 4} ${top - 2}L${cx - 7} ${apex}V${stemEnd}M${cx + 7} ${stemEnd}V${apex}L${cx + w / 2 + 4} ${top - 2}`} fill="none" stroke={glassLine} strokeWidth="2.4" />
  </g>
}
function Drops({ x, y, n = 2, colour = waterLine, fill = water }: { x: number; y: number; n?: number; colour?: string; fill?: string }) {
  return <g>{Array.from({ length: n }, (_, i) => <path key={i} d={`M${x} ${y + i * 14}q-4 6 0 8q4 -2 0 -8Z`} fill={fill} stroke={colour} strokeWidth="1.4" />)}</g>
}

// ---------- Section 1: soluble and insoluble, then filtration ----------
function Dissolving({ focus }: { focus: string }) {
  const which = focus === 'sep-filter-soluble' ? 'soluble' : 'insoluble'
  const grains: Pt[] = [[-30, 92], [-18, 94], [-6, 93], [6, 94], [18, 92], [30, 93], [-24, 86], [-12, 87], [0, 86], [12, 87], [24, 86], [-6, 80], [8, 80], [-20, 50], [14, 36], [24, 62]]
  return <Diagram viewBox="0 0 540 280" title={which === 'soluble'
    ? 'Two beakers of water. In the left one, sugar has been stirred in and has dissolved: the water looks clear and no grains can be seen. Sugar is soluble. The right beaker, with sand, is faded.'
    : 'Two beakers of water. In the right one, sand has been stirred in: the grains are still there, some floating and most sitting on the bottom. Sand is insoluble. The left beaker, with dissolved sugar, is faded.'}>
    <g opacity={which === 'soluble' ? 1 : faded}>
      <Beaker x={90} y={70} w={120} h={130} level={.72} />
      <text x={150} y={36} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>sugar + water</text>
      <text x={150} y={230} textAnchor="middle" fontSize="14" fill={ink}>dissolves: no grains left</text>
      <text x={150} y={256} textAnchor="middle" fontSize="16" fontWeight="700" fill={saltLine}>soluble</text>
    </g>
    <g opacity={which === 'insoluble' ? 1 : faded}>
      <Beaker x={330} y={70} w={120} h={130} level={.72} fill="#e2ecef">
        {grains.map(([dx, dy], i) => <Grain key={i} x={390 + dx} y={100 + dy} s={4.5} />)}
      </Beaker>
      <text x={390} y={36} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>sand + water</text>
      <text x={390} y={230} textAnchor="middle" fontSize="14" fill={ink}>grains are still there</text>
      <text x={390} y={256} textAnchor="middle" fontSize="16" fontWeight="700" fill={sandLine}>insoluble</text>
    </g>
  </Diagram>
}
const FILTER_STEP: Record<string, number> = { 'sep-filter-setup': 1, 'sep-filter-filtrate': 2, 'sep-filter-residue': 3, 'sep-filter-all': 4 }
function Filtration({ focus, assessment = false, question = false }: { focus: string; assessment?: boolean; question?: boolean }) {
  const step = question ? 4 : FILTER_STEP[focus] ?? 4
  const cx = 150
  const keyMode = (n: number): Mode => step === 4 ? 'on' : n === step ? 'active' : n < step ? 'on' : 'off'
  const titles = [
    '',
    'Step 1: a cone of filter paper sits in a funnel, and the funnel stands in a beaker. The paper has tiny holes.',
    'Step 2: sandy water is poured into the paper cone, below the top of the paper. Clear water drips through into the beaker: this liquid is the filtrate.',
    'Step 3: the sand grains are too big to pass through the paper, so they are left on the filter paper: this solid is the residue.',
    'Filtration: sandy water in a filter-paper cone in a funnel. The clear filtrate collects in the beaker below and the sand residue stays on the paper.',
  ]
  return <Diagram viewBox="0 0 540 300" title={question && assessment ? 'Filtration apparatus after sandy water has been filtered, with three parts numbered 1, 2 and 3.' : question ? 'Filtration apparatus. Part 1 is the filter paper, part 2 is the filtrate in the beaker and part 3 is the sand left on the paper: the residue.' : titles[step]}>
    {step === 2 && <rect x={cx - 76} y={214} width={152} height={80} rx="12" fill={halo} opacity=".55" />}
    {step === 3 && <ellipse cx={cx} cy={122} rx={34} ry={22} fill={halo} opacity=".55" />}
    <Beaker x={cx - 60} y={170} w={120} h={112} level={step >= 2 ? .32 : 0} />
    <Funnel cx={cx} top={36} w={150} sandy={step >= 2 && step < 3} residue={step >= 3} liquidTop={step >= 2 ? (step >= 3 ? 96 : 70) : undefined} />
    {step >= 2 && <Drops x={cx} y={210} n={2} />}
    {step === 1 && <path d={`M${cx - 64} 45L${cx} 140L${cx + 64} 45Z`} fill={halo} fillOpacity=".3" stroke={halo} strokeWidth="5" />}
    {question ? <g>
      <Pointer n={1} x={40} y={50} to={[cx - 58, 48]} />
      <Pointer n={2} x={40} y={262} to={[cx - 40, 262]} />
      <Pointer n={3} x={276} y={132} to={[cx + 4, 116]} />
      {!assessment && <g>
        <KeyRow n={1} x={330} y={70} lines={['filter paper']} mode="on" colour={paperLine} />
        <KeyRow n={2} x={330} y={120} lines={['filtrate:', 'the liquid']} mode="on" colour={waterLine} />
        <KeyRow n={3} x={330} y={180} lines={['residue:', 'the solid left']} mode="active" colour={sandLine} />
      </g>}
    </g> : <g>
      <text x={318} y={40} fontSize="14" fontWeight="700" fill={ink}>Filtering sandy water</text>
      <KeyRow n={1} x={330} y={84} lines={['filter paper cone', 'in a funnel']} mode={keyMode(1)} colour={paperText} />
      <KeyRow n={2} x={330} y={150} lines={['filtrate: the liquid', 'that passes through']} mode={keyMode(2)} colour={waterLine} />
      <KeyRow n={3} x={330} y={216} lines={['residue: the solid', 'left on the paper']} mode={keyMode(3)} colour={sandLine} />
      {step === 2 && <text x={318} y={262} fontSize="13" fill={muted}><tspan x={318}>Keep the level below</tspan><tspan x={318} dy={17}>the top of the paper.</tspan></text>}
      {step === 4 && <text x={318} y={262} fontSize="13" fill={muted}><tspan x={318}>Works only for a solid</tspan><tspan x={318} dy={17}>that does not dissolve.</tspan></text>}
    </g>}
  </Diagram>
}

// ---------- Section 2: getting a soluble salt back ----------
function Solvent() {
  const zx = 290, zy = 140, zr = 92
  const waterDots: Pt[] = [[-60, -30], [-40, -58], [-14, -70], [18, -64], [46, -46], [66, -18], [-70, 4], [-44, 20], [-20, -8], [8, -30], [34, -10], [60, 22], [-58, 46], [-28, 56], [2, 40], [30, 62], [52, 50], [-4, 74], [22, 12], [-36, -34], [40, -76], [-8, 10]]
  const saltDots: Pt[] = [[-30, -52], [28, -38], [-52, -8], [48, 0], [-12, 26], [16, 44], [-40, 70], [70, 40]]
  return <Diagram viewBox="0 0 540 280" title="A beaker of salt solution. A magnified circle shows its particles: many water particles, which are the solvent, with salt particles spread evenly among them. The salt is dissolved, so no crystals can be seen.">
    <Beaker x={30} y={90} w={110} h={140} level={.7} />
    <text x={85} y={60} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>salt solution</text>
    <path d={`M130 154L${zx - zr + 6} ${zy - 40}M130 186L${zx - zr + 10} ${zy + 50}`} stroke={panelLine} strokeWidth="2" />
    <circle cx={122} cy={170} r="18" fill="none" stroke={ink} strokeWidth="2" />
    <circle cx={zx} cy={zy} r={zr} fill="white" stroke={ink} strokeWidth="2" />
    {waterDots.map(([dx, dy], i) => <circle key={`w${i}`} cx={zx + dx} cy={zy + dy} r="7" fill={water} stroke={waterLine} strokeWidth="1.4" />)}
    {saltDots.map(([dx, dy], i) => <circle key={`s${i}`} cx={zx + dx} cy={zy + dy} r="7" fill={salt} stroke={saltLine} strokeWidth="1.6" />)}
    <text x={zx} y={zy + zr + 22} textAnchor="middle" fontSize="13" fill={muted}>magnified (particles not to scale)</text>
    <g fontSize="14" fontWeight="700">
      <circle cx={412} cy={96} r="7" fill={water} stroke={waterLine} strokeWidth="1.4" /><text x={426} y={101} fill={waterLine}>water:</text>
      <text x={426} y={119} fill={waterLine}>the solvent</text>
      <circle cx={412} cy={170} r="7" fill={salt} stroke={saltLine} strokeWidth="1.6" /><text x={426} y={175} fill={saltLine}>salt:</text>
      <text x={426} y={193} fill={saltLine}>dissolved</text>
    </g>
  </Diagram>
}
function EvapScene({ contents, flame, steam, cx = 140 }: { contents: 'solution' | 'crystals' | 'dry'; flame: 'off' | 'gentle' | 'full'; steam: boolean; cx?: number }) {
  return <g>
    <HeatStand cx={cx} gauzeY={196} ground={286} flame={flame} width={120} />
    <Dish cx={cx} y={196} w={116} contents={contents} />
    {steam && <Steam cx={cx} y={156} n={3} />}
  </g>
}
const CRYST_ROWS = [['heat the solution', 'gently'], ['stop when crystals', 'start to form'], ['leave it to cool'], ['filter, then dry', 'in a warm place']]
function Evaporation() {
  return <Diagram viewBox="0 0 540 300" title="Evaporation: salt solution in an evaporating dish on a tripod and gauze, heated gently by a Bunsen burner. Water evaporates into the air as steam, and dry salt crystals are left in the dish.">
    <EvapScene contents="dry" flame="gentle" steam cx={110} />
    <Tag x={166} y={112} text="water evaporates" to={[136, 124]} colour={vapourText} />
    <Tag x={188} y={172} text="evaporating dish" to={[164, 180]} />
    <Tag x={188} y={244} text="Bunsen burner" to={[118, 250]} />
    <text x={318} y={40} fontSize="14" fontWeight="700" fill={ink}>Evaporation</text>
    <KeyRow n={1} x={330} y={80} lines={['heat the solution', 'gently']} mode="on" colour={heatLine} />
    <KeyRow n={2} x={330} y={134} lines={['water evaporates']} mode="on" colour={vapourText} />
    <KeyRow n={3} x={330} y={182} lines={['keep going until', 'dry crystals are left']} mode="active" colour={saltLine} />
    <text x={318} y={250} fontSize="13" fill={muted}>Quick, but the salt</text>
    <text x={318} y={266} fontSize="13" fill={muted}>gets very hot.</text>
  </Diagram>
}
function Warning() {
  return <Diagram viewBox="0 0 540 300" title="The evaporating dish, now dry, still on the hot tripod and gauze. A warning panel says: some salts break down into other substances if they get too hot, so heating them until dry would spoil them; the dish, tripod and gauze stay hot, so let them cool before touching.">
    <EvapScene contents="dry" flame="full" steam={false} cx={120} />
    <path d="M78 150q6 -10 0 -20M120 146q6 -10 0 -20M162 150q6 -10 0 -20" fill="none" stroke={heatLine} strokeWidth="2" opacity=".7" />
    <text x={120} y={114} textAnchor="middle" fontSize="13" fontWeight="700" fill={heatLine}>very hot</text>
    <rect x={268} y={30} width={256} height={124} rx="10" fill="#fff4e6" stroke={halo} strokeWidth="2" />
    <path d={`M286 66L300 42L314 66Z`} fill={halo} stroke={heatLine} strokeWidth="2" /><text x={300} y={62} textAnchor="middle" fontSize="14" fontWeight="700" fill={heatLine}>!</text>
    <g fontSize="14" fill={ink}>
      <text x={322} y={62} fontWeight="700">Some salts break down</text>
      <text x={286} y={88} fontWeight="700">if they get too hot.</text>
      <text x={286} y={114}>Heating them until dry</text>
      <text x={286} y={134}>would spoil them.</text>
    </g>
    <rect x={268} y={170} width={256} height={92} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="14" fill={ink}>
      <text x={286} y={196} fontWeight="700">Hot apparatus</text>
      <text x={286} y={220}>Dish, tripod and gauze stay</text>
      <text x={286} y={240}>hot: let them cool first.</text>
    </g>
  </Diagram>
}
function Crystallise({ focus }: { focus: string }) {
  const dry = focus === 'sep-salt-dry'
  const keyMode = (n: number): Mode => dry ? (n === 4 ? 'active' : 'on') : n <= 3 ? 'active' : 'off'
  return <Diagram viewBox="0 0 540 300" title={dry
    ? 'The last step of crystallisation: the crystals and the leftover solution are poured into a filter-paper cone in a funnel. The crystals stay on the paper and are then left in a warm place to dry.'
    : 'Crystallisation: salt solution in an evaporating dish is heated gently with a small flame until crystals start to form at the edge. Then heating stops and the dish is left to cool, and more crystals grow.'}>
    {dry ? <g>
      <Beaker x={80} y={186} w={100} h={96} level={.3} />
      <Funnel cx={130} top={50} w={130} liquidTop={96} />
      {[[-18, 100], [-6, 104], [8, 102], [20, 100], [-12, 112], [2, 114], [14, 110], [-2, 124], [6, 122]].map(([dx, y], i) => <Crystal key={i} x={130 + dx} y={y} s={7} />)}
      <Drops x={130} y={218} n={1} />
      <Tag x={214} y={78} text="crystals" to={[150, 104]} colour={saltLine} />
    </g> : <g>
      <EvapScene contents="crystals" flame="gentle" steam />
      <Tag x={214} y={120} text="crystals start" to={[97, 181]} colour={saltLine} />
      <Tag x={214} y={136} text="at the edge" colour={saltLine} />
      <Tag x={214} y={236} text="small flame" to={[146, 222]} colour={heatLine} />
    </g>}
    <text x={318} y={40} fontSize="14" fontWeight="700" fill={ink}>Crystallisation</text>
    {CRYST_ROWS.map((lines, i) => <KeyRow key={i} n={i + 1} x={330} y={80 + i * 54} lines={lines} mode={keyMode(i + 1)} colour={[heatLine, saltLine, cold, saltLine][i]} />)}
  </Diagram>
}
function SaltCompare() {
  const col = (x: number, head: string, colour: string, items: string[][], contents: 'dry' | 'crystals') => <g>
    <rect x={x} y={16} width={244} height={258} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={x + 122} y={44} textAnchor="middle" fontSize="16" fontWeight="700" fill={colour}>{head}</text>
    <Dish cx={x + 122} y={100} w={100} contents={contents} />
    {items.map((lines, i) => { const y = 136 + items.slice(0, i).reduce((t, it) => t + it.length * 19 + 14, 0); return <g key={i}>
      <circle cx={x + 22} cy={y - 5} r="3.5" fill={colour} />
      <text x={x + 34} y={y} fontSize="14" fontWeight={i === items.length - 1 ? 700 : 400} fill={ink}>{lines.map((l, j) => <tspan key={j} x={x + 34} dy={j ? 19 : 0}>{l}</tspan>)}</text>
    </g> })}
  </g>
  return <Diagram viewBox="0 0 540 290" schematic={false} title="Two ways to get a soluble salt back from its solution. Evaporation: heat until only dry crystals are left; quick; only for salts that do not break down when heated. Crystallisation: heat gently and stop when crystals start, then cool, filter and dry; gives bigger crystals; use it when the salt breaks down on heating.">
    {col(20, 'Evaporation', heatLine, [['heat until only dry', 'crystals are left'], ['quick'], ['only for salts that do', 'not break down']], 'dry')}
    {col(276, 'Crystallisation', saltLine, [['heat gently, stop', 'when crystals start'], ['cool, filter, then dry;', 'bigger crystals'], ['for salts that break', 'down when heated']], 'crystals')}
  </Diagram>
}

// ---------- Section 3: separating rock salt ----------
function RockMix() {
  const zx = 300, zy = 140, zr = 96
  const bits: Array<[number, number, 's' | 'g']> = [[-60, -36, 's'], [-30, -60, 'g'], [4, -66, 's'], [40, -50, 's'], [66, -16, 'g'], [-72, 6, 's'], [-40, -10, 'g'], [-8, -26, 's'], [26, -18, 'g'], [56, 18, 's'], [-54, 40, 'g'], [-20, 30, 's'], [12, 16, 's'], [42, 50, 'g'], [-26, 68, 's'], [10, 70, 'g'], [70, 44, 's'], [-2, 46, 'g']]
  return <Diagram viewBox="0 0 540 280" title="A lump of rock salt, with a magnified circle showing that it is a mixture of lavender salt crystals and tan sand grains. The key says salt is soluble in water and sand is insoluble.">
    <path d="M60 170Q52 140 80 128Q104 112 130 126Q156 132 150 160Q148 186 118 190Q84 196 60 170Z" fill="#efe7da" stroke={sandLine} strokeWidth="2" />
    {[[80, 150, 's'], [100, 140, 'g'], [120, 150, 's'], [92, 168, 's'], [132, 170, 'g'], [110, 176, 's'], [74, 170, 'g']].map(([x, y, k], i) => k === 's' ? <Crystal key={i} x={x as number} y={y as number} s={7} /> : <Grain key={i} x={x as number} y={y as number} s={4} />)}
    <text x={105} y={226} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>rock salt</text>
    <circle cx={120} cy={158} r="26" fill="none" stroke={ink} strokeWidth="2" />
    <path d={`M142 144L${zx - zr + 8} ${zy - 36}M142 172L${zx - zr + 8} ${zy + 36}`} stroke={panelLine} strokeWidth="2" />
    <circle cx={zx} cy={zy} r={zr} fill="white" stroke={ink} strokeWidth="2" />
    {bits.map(([dx, dy, k], i) => k === 's' ? <Crystal key={i} x={zx + dx} y={zy + dy} s={16} /> : <Grain key={i} x={zx + dx} y={zy + dy} s={10} />)}
    <text x={zx} y={zy + zr + 22} textAnchor="middle" fontSize="13" fill={muted}>magnified</text>
    <g fontSize="14" fontWeight="700">
      <Crystal x={428} y={98} s={14} /><text x={444} y={96} fill={saltLine}>salt:</text><text x={444} y={114} fill={saltLine}>soluble</text>
      <Grain x={428} y={176} s={8} /><text x={444} y={174} fill={sandLine}>sand:</text><text x={444} y={192} fill={sandLine}>insoluble</text>
    </g>
  </Diagram>
}
const ROCK_ACTIVE: Record<string, number[]> = { 'sep-rock-dissolve': [1, 2], 'sep-rock-filter': [3], 'sep-rock-dry': [4], 'sep-rock-all': [1, 2, 3, 4] }
function RockSteps({ focus }: { focus: string }) {
  const active = ROCK_ACTIVE[focus] ?? [1, 2, 3, 4], all = active.length === 4
  const done = (n: number) => n < Math.min(...active)
  const opacity = (n: number) => active.includes(n) ? 1 : done(n) ? .55 : faded
  const titles: Record<string, string> = {
    'sep-rock-dissolve': 'Four steps for separating rock salt. Steps 1 and 2 are highlighted: grind the rock salt with a pestle and mortar, then stir it into warm water. The salt dissolves; the sand sinks.',
    'sep-rock-filter': 'Four steps for separating rock salt. Step 3 is highlighted: filter the mixture. The sand is left on the filter paper as the residue; the salt solution passes through as the filtrate.',
    'sep-rock-dry': 'Four steps for separating rock salt. Step 4 is highlighted: heat the salt solution in an evaporating dish until salt crystals are left.',
    'sep-rock-all': 'The four steps for separating rock salt: 1 grind, 2 dissolve in water, 3 filter off the sand, 4 evaporate the filtrate to leave salt crystals.',
  }
  const panel = (n: number, label: string, child: ReactNode) => { const x = 12 + (n - 1) * 132; return <g opacity={opacity(n)}>
    <rect x={x} y={14} width={120} height={214} rx="10" fill={active.includes(n) && !all ? '#fff8ec' : panelFill} stroke={active.includes(n) && !all ? halo : panelLine} strokeWidth={active.includes(n) && !all ? 2.5 : 1.5} />
    {child}
    <Num n={n} x={x + 22} y={256} mode={active.includes(n) && !all ? 'active' : 'on'} colour={heatLine} />
    <text x={x + 40} y={261} fontSize="15" fontWeight="700" fill={ink}>{label}</text>
  </g> }
  return <Diagram viewBox="0 0 540 280" title={titles[focus] || titles['sep-rock-all']}>
    {panel(1, 'grind', <g>
      <path d="M22 150Q22 196 72 196Q122 196 122 150Z" fill="#eceff1" stroke={metalLine} strokeWidth="2.4" />
      <path d="M18 150H126" stroke={metalLine} strokeWidth="2.4" />
      {[[48, 164], [62, 172], [80, 166], [94, 172], [70, 184], [54, 180], [88, 184]].map(([x, y], i) => i % 3 === 1 ? <Grain key={i} x={x} y={y} s={3.5} /> : <Crystal key={i} x={x} y={y} s={6} />)}
      <path d="M92 60L70 164" stroke={metalLine} strokeWidth="14" /><path d="M92 60L70 164" stroke="#eceff1" strokeWidth="10" />
      <text x={72} y={218} textAnchor="middle" fontSize="12" fill={muted}>pestle and mortar</text>
    </g>)}
    {panel(2, 'dissolve', <g>
      <Beaker x={166} y={70} w={80} h={120} level={.72}>
        {[[-22, 180], [-10, 182], [4, 181], [16, 182], [-16, 175], [10, 175]].map(([dx, y], i) => <Grain key={i} x={206 + dx} y={y} s={4} />)}
      </Beaker>
      <path d="M186 44L222 170" stroke={glassLine} strokeWidth="4" />
      <text x={206} y={218} textAnchor="middle" fontSize="12" fill={muted}>stir in warm water</text>
    </g>)}
    {panel(3, 'filter', <g>
      <Beaker x={298} y={146} w={80} h={62} level={.4} />
      <Funnel cx={338} top={44} w={96} residue liquidTop={82} />
      <Drops x={338} y={172} n={1} />
      <text x={338} y={218} textAnchor="middle" fontSize="12" fill={muted}>sand on the paper</text>
    </g>)}
    {panel(4, 'evaporate', <g>
      <HeatStand cx={470} gauzeY={146} ground={206} flame="gentle" width={84} />
      <Dish cx={470} y={146} w={84} contents="dry" />
      <Steam cx={470} y={112} n={2} />
      <text x={470} y={218} textAnchor="middle" fontSize="12" fill={muted}>salt crystals left</text>
    </g>)}
  </Diagram>
}

// ---------- Sections 4 and 5: simple and fractional distillation (one apparatus) ----------
const U: Pt = [.923, .386], N: Pt = [-.386, .923]
type RigStep = 'heat' | 'boil' | 'condense' | 'collect' | 'all'
type FracStep = 'column' | 'first' | 'fraction' | 'next' | 'all'
type RigProps = { frac: boolean; step: RigStep | FracStep; question?: boolean; assessment?: boolean }
function Rig({ frac, step, question = false, assessment = false }: RigProps) {
  const clip = useId()
  // Geometry: the fractional version moves the flask right and puts a packed column between the flask and the still head.
  const g = frac
    ? { cx: 130, cy: 226, r: 38, neckHalf: 12, neckTop: 50, arm: 66, ground: 350, end: 300 }
    : { cx: 100, cy: 196, r: 40, neckHalf: 9, neckTop: 60, arm: 92, ground: 330, end: 346 }
  const A: Pt = [g.cx + g.neckHalf, g.arm]
  const P = (s: number, off = 0): Pt => [r1(A[0] + U[0] * s + N[0] * off), r1(A[1] + U[1] * s + N[1] * off)]
  const gauzeY = g.cy + g.r + 2
  const joinY = r1(g.cy - Math.sqrt(g.r * g.r - g.neckHalf * g.neckHalf))
  const flaskPath = `M${g.cx - g.neckHalf} ${g.neckTop}V${joinY}A${g.r} ${g.r} 0 1 0 ${g.cx + g.neckHalf} ${joinY}V${g.neckTop}`
  const s0 = 64, s1 = 262, jacket = 17
  const [ex, ey] = P(g.end)
  const all = step === 'all'
  const has = (...steps: string[]) => all || question || steps.includes(step)
  // What is shown at each stage
  const gasOn = question || step !== (frac ? 'column' : 'heat')
  const coldOn = true
  const liquidInTube = frac ? step !== 'column' : ['condense', 'collect', 'all'].includes(step) || question
  const collecting = frac ? step !== 'column' : ['collect', 'all'].includes(step) || question
  const reading = frac ? (step === 'column' ? '' : step === 'next' || step === 'all' ? '100 °C' : '56 °C') : (step === 'heat' ? '' : '100 °C')
  const flaskFill = frac ? '#dcece8' : water, flaskLine = frac ? propLine : waterLine
  const distil = frac ? (step === 'next' || step === 'all' ? 'water' : 'prop') : 'water'
  const drip = distil === 'prop' ? { fill: prop, line: propLine } : { fill: water, line: waterLine }
  const hl = (on: boolean, el: ReactNode) => on && !question ? el : null
  const outlet = P(84, -jacket), inlet = P(s1 - 22, jacket)
  const [rx, ry] = [ex, g.ground]
  const wx = [inlet[0], outlet[0]]
  return <g>
    {/* highlight halos (drawn first, under the glass) */}
    {hl(!frac && step === 'heat', <rect x={g.cx - 56} y={g.cy - 50} width={112} height={g.ground - g.cy + 40} rx="16" fill={halo} opacity=".35" />)}
    {hl(frac && step === 'column', <rect x={g.cx - 24} y={g.neckTop - 4} width={48} height={joinY - g.neckTop + 8} rx="10" fill={halo} opacity=".5" />)}
    {hl((!frac && step === 'boil') || (frac && step === 'first'), <rect x={g.cx - 22} y={6} width={44} height={joinY - 2} rx="10" fill={halo} opacity=".45" />)}
    {hl((!frac && step === 'condense'), <path d={`M${P(s0)[0]} ${P(s0)[1]}L${P(s1)[0]} ${P(s1)[1]}`} stroke={halo} strokeWidth={jacket * 2 + 22} opacity=".45" />)}
    {hl((!frac && step === 'collect') || (frac && (step === 'fraction' || step === 'next')), <rect x={rx - 44} y={ey + 8} width={88} height={g.ground - ey - 4} rx="12" fill={halo} opacity=".45" />)}
    {/* heat */}
    <HeatStand cx={g.cx} gauzeY={gauzeY} ground={g.ground} flame={frac && step === 'first' ? 'gentle' : 'full'} width={104} />
    {/* flask and its contents */}
    <clipPath id={clip}><circle cx={g.cx} cy={g.cy} r={g.r - 1.5} /></clipPath>
    <path d={flaskPath + 'Z'} fill={glass} />
    <rect x={g.cx - g.r} y={g.cy + 2} width={g.r * 2} height={g.r} fill={flaskFill} clipPath={`url(#${clip})`} />
    <path d={`M${g.cx - g.r} ${g.cy + 2}H${g.cx + g.r}`} stroke={flaskLine} strokeWidth="1.6" clipPath={`url(#${clip})`} />
    {!frac && [[-18, 20], [0, 26], [16, 18], [-6, 12], [24, 28]].map(([dx, dy], i) => <circle key={i} cx={g.cx + dx} cy={g.cy + dy} r="2.6" fill={salt} stroke={saltLine} strokeWidth="1" />)}
    {frac && Array.from({ length: 24 }, (_, i) => { const row = Math.floor(i / 3), col = i % 3; return <circle key={i} cx={g.cx - 6 + col * 6 + (row % 2) * 1.5} cy={g.neckTop + 36 + row * 12} r="3.6" fill="white" stroke={glassLine} strokeWidth="1.2" /> })}
    <path d={flaskPath} fill="none" stroke={glassLine} strokeWidth="2.4" />
    {/* stopper and thermometer, bulb level with the side arm */}
    <rect x={g.cx - g.neckHalf - 3} y={g.neckTop - 12} width={g.neckHalf * 2 + 6} height={16} rx="3" fill="#d8c3a5" stroke="#a88d68" strokeWidth="1.4" />
    <rect x={g.cx - 3.5} y={6} width={7} height={g.arm - 10} rx="3.5" fill="white" stroke={glassLine} strokeWidth="1.6" />
    <path d={`M${g.cx} ${g.arm - 4}V${reading === '100 °C' ? 22 : reading ? 36 : 54}`} stroke="#d0463c" strokeWidth="2.4" />
    <circle cx={g.cx} cy={g.arm} r="5" fill="#e06b62" stroke="#b4524a" strokeWidth="1.4" />
    {reading && !question && <g><rect x={g.cx - 92} y={8} width={70} height={28} rx="8" fill="white" stroke={heatLine} strokeWidth="1.8" /><text x={g.cx - 57} y={28} textAnchor="middle" fontSize="15" fontWeight="700" fill={heatLine}>{reading}</text><path d={`M${g.cx - 22} 22H${g.cx - 6}`} stroke={heatLine} strokeWidth="1.6" /></g>}
    {/* condenser: outer cold-water jacket, then the inner tube along the same axis */}
    <path d={`M${P(s0)[0]} ${P(s0)[1]}L${P(s1)[0]} ${P(s1)[1]}`} stroke={glassLine} strokeWidth={jacket * 2 + 4} />
    <path d={`M${P(s0)[0]} ${P(s0)[1]}L${P(s1)[0]} ${P(s1)[1]}`} stroke={coldOn ? '#cfe5f6' : glass} strokeWidth={jacket * 2 - 1} />
    <path d={`M${outlet[0]} ${outlet[1] + 4}V${outlet[1] - 20}M${inlet[0]} ${inlet[1] - 4}V${inlet[1] + 20}`} stroke={glassLine} strokeWidth="11" />
    <path d={`M${outlet[0]} ${outlet[1] + 6}V${outlet[1] - 19}M${inlet[0]} ${inlet[1] - 6}V${inlet[1] + 19}`} stroke="#cfe5f6" strokeWidth="7" />
    <path d={`M${A[0] - 2} ${A[1]}L${ex} ${ey}`} stroke={glassLine} strokeWidth="12" strokeLinecap="butt" />
    <path d={`M${A[0] - 2} ${A[1]}L${ex} ${ey}`} stroke={glass} strokeWidth="8" strokeLinecap="butt" />
    <rect x={g.cx - g.neckHalf + 1.2} y={g.arm - 5} width={g.neckHalf * 2 - 2.4} height={10} fill={glass} />
    {liquidInTube && <path d={`M${P(s1 - 40)[0]} ${P(s1 - 40)[1] + 2}L${ex - 1} ${ey + 2}`} stroke={drip.line} strokeWidth="3" />}
    {/* cold water: in at the bottom (lower end), out at the top (upper end) */}
    <g opacity={!frac && step !== 'condense' && !all && !question ? .6 : 1}>
      <Arrow x1={wx[0]} y1={inlet[1] + 46} x2={wx[0]} y2={inlet[1] + 22} colour={cold} width={2.5} />
      <Arrow x1={wx[1]} y1={outlet[1] - 20} x2={wx[1]} y2={outlet[1] - 44} colour={cold} width={2.5} />
      {has('condense') && !assessment && !frac && <><text x={wx[0] - 8} y={inlet[1] + 60} textAnchor="middle" fontSize="13" fontWeight="700" fill={cold}>cold water in</text><text x={wx[1] + 8} y={outlet[1] - 50} textAnchor="start" fontSize="13" fontWeight="700" fill={cold}>water out</text></>}
    </g>
    {/* gas rising and passing into the condenser */}
    {gasOn && !question && <g>
      <Arrow x1={g.cx} y1={frac ? joinY - 6 : joinY + 14} x2={g.cx} y2={frac ? g.neckTop + 30 : g.arm + 34} colour={vapour} width={2.2} dashed />
      <Arrow x1={P(6)[0]} y1={P(6)[1]} x2={P(56)[0]} y2={P(56)[1]} colour={vapour} width={2.2} dashed />
    </g>}
    {/* collecting vessel(s) under the end of the condenser */}
    {frac ? <g>
      <Conical x={rx} y={ey + 30} h={g.ground - ey - 30} w={62} level={collecting ? (step === 'first' ? .1 : .3) : 0} fill={drip.fill} line={drip.line} />
      {collecting && <Drops x={ex} y={ey + 8} n={1} colour={drip.line} fill={drip.fill} />}
      {(step === 'next' || all) && <Conical x={rx + 72} y={ey + 70} h={g.ground - ey - 70} w={48} level={.4} fill={prop} line={propLine} />}
    </g> : <g>
      <Beaker x={rx - 40} y={ey + 30} w={80} h={g.ground - ey - 30} level={collecting ? .3 : 0} />
      {collecting && <Drops x={ex} y={ey + 8} n={2} />}
    </g>}
  </g>
}
const SIMPLE_STEPS: RigStep[] = ['heat', 'boil', 'condense', 'collect', 'all']
const SIMPLE_TITLES: Record<RigStep, string> = {
  heat: 'Simple distillation apparatus. Salty water in a round flask is heated by a Bunsen burner under a tripod and gauze. A thermometer sits in the top of the flask, and a sloping condenser leads down to a beaker.',
  boil: 'The water boils and turns into a gas, which rises up the flask. The thermometer bulb is level with the side arm and reads 100 °C.',
  condense: 'The gas passes into the condenser, a tube surrounded by a jacket of cold water. Cold water goes in at the bottom (lower end) and out at the top (upper end). The gas cools and condenses into liquid water.',
  collect: 'Liquid water runs down the condenser and drips into the beaker. It is pure water; the salt is left behind in the flask.',
  all: 'Simple distillation of sea water: heat the flask, the water boils at 100 °C, the gas is cooled in the condenser (cold water in at the bottom, out at the top), and pure water is collected in the beaker. The salt stays in the flask.',
}
function SimpleDistillation({ focus }: { focus: string }) {
  const step = (focus.replace('sep-dist-', '') as RigStep)
  const n = SIMPLE_STEPS.indexOf(step) + 1 || 5
  const mode = (k: number): Mode => n === 5 ? 'on' : k === n ? 'active' : k < n ? 'on' : 'off'
  return <Diagram viewBox="0 0 540 340" title={SIMPLE_TITLES[step] || SIMPLE_TITLES.all}>
    <Rig frac={false} step={SIMPLE_STEPS[n - 1]} />
    <KeyRow n={1} x={330} y={26} lines={['heat the sea water']} mode={mode(1)} colour={heatLine} />
    <KeyRow n={2} x={330} y={56} lines={['water boils: a gas']} mode={mode(2)} colour={vapourText} />
    <KeyRow n={3} x={330} y={86} lines={['condenser: gas → liquid']} mode={mode(3)} colour={cold} />
    <KeyRow n={4} x={330} y={116} lines={['pure water collected']} mode={mode(4)} colour={waterLine} />
    {(n === 4 || n === 5) && <text x={352} y={140} fontSize="13" fontWeight="700" fill={saltLine}>salt stays in the flask</text>}
  </Diagram>
}
const FRAC_STEPS: FracStep[] = ['column', 'first', 'fraction', 'next', 'all']
const FRAC_TITLES: Record<FracStep, string> = {
  column: 'Fractional distillation apparatus. A flask holding a mixture of propanone and water sits on a tripod and gauze over a Bunsen burner. A tall fractionating column packed with glass beads stands on the flask, with a thermometer at the top level with the side arm, then a sloping condenser and a collecting flask.',
  first: 'The mixture is heated gently. Propanone, with the lower boiling point, evaporates first and its gas rises up the column, which is hotter at the bottom and cooler at the top. The thermometer at the top reads 56 °C.',
  fraction: 'Propanone gas condenses in the condenser and drips into the collecting flask. This liquid, collected on its own, is the first fraction. The thermometer reads 56 °C.',
  next: 'The flask is heated more strongly. The thermometer reaches 100 °C and water is collected in a new flask as the second fraction. The first fraction, propanone, stands beside it.',
  all: 'Fractional distillation of propanone and water: heat, the liquid with the lowest boiling point (propanone, 56 °C) reaches the top of the column first and is collected; then the temperature is raised to 100 °C to collect water as the next fraction.',
}
function FractionalDistillation({ focus }: { focus: string }) {
  const step = focus.replace('sep-frac-', '') as FracStep
  const n = FRAC_STEPS.indexOf(step)
  const i = n < 0 ? 4 : n
  const mode = (k: number): Mode => i === 4 ? 'on' : i === 0 ? 'off' : k === i + 1 ? 'active' : k < i + 1 ? 'on' : 'off'
  return <Diagram viewBox="0 0 540 380" title={FRAC_TITLES[FRAC_STEPS[i]]}>
    <Rig frac step={FRAC_STEPS[i]} />
    {(i === 0 || i === 4) && <g>
      <Tag x={104} y={100} text="fractionating" anchor="end" to={[118, 110]} />
      <Tag x={104} y={116} text="column" anchor="end" />
      <Tag x={104} y={160} text="glass beads" anchor="end" to={[124, 158]} />
    </g>}
    {i === 1 && <g>
      <text x={106} y={104} textAnchor="end" fontSize="13" fontWeight="700" fill={cold}>cooler</text>
      <text x={106} y={178} textAnchor="end" fontSize="13" fontWeight="700" fill={heatLine}>hotter</text>
      <path d="M100 164V112" stroke={muted} strokeWidth="1.6" /><path d="M95 118L100 110L105 118" fill="none" stroke={muted} strokeWidth="1.6" />
    </g>}
    <Tag x={84} y={238} text="mixture" anchor="end" to={[104, 240]} colour={propLine} />
    {(i >= 2) && <text x={419} y={372} textAnchor="middle" fontSize="12" fontWeight="700" fill={i >= 3 ? waterLine : propLine}>{i >= 3 ? 'fraction 2' : 'fraction 1'}</text>}
    {i >= 3 && <text x={491} y={372} textAnchor="middle" fontSize="12" fontWeight="700" fill={propLine}>fraction 1</text>}
    <KeyRow n={1} x={330} y={22} lines={['heat the mixture']} mode={mode(1)} colour={heatLine} />
    <KeyRow n={2} x={330} y={48} lines={['lowest boiling point']} mode={mode(2)} colour={vapourText} />
    <KeyRow n={3} x={330} y={74} lines={['condenses: a fraction']} mode={mode(3)} colour={propLine} />
    <KeyRow n={4} x={330} y={100} lines={['raise the temperature']} mode={mode(4)} colour={heatLine} />
  </Diagram>
}
function FracData() {
  const rows: Array<[string, string]> = [['pentane', '36'], ['hexane', '69'], ['heptane', '98']]
  return <Diagram viewBox="0 0 540 220" schematic={false} title="Table of boiling points: pentane 36 °C, hexane 69 °C, heptane 98 °C. The thermometer at the top of the fractionating column reads 69 °C.">
    <rect x={20} y={16} width={330} height={176} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={40} y={48} fontSize="14" fontWeight="700" fill={ink}>liquid</text>
    <text x={270} y={48} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>boiling point (°C)</text>
    <path d="M30 62H340" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([name, bp], k) => <g key={name}>
      <text x={40} y={96 + k * 38} fontSize="15" fill={ink}>{name}</text>
      <text x={270} y={96 + k * 38} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{bp}</text>
      {k < 2 && <path d={`M30 ${110 + k * 38}H340`} stroke={panelLine} strokeWidth="1" />}
    </g>)}
    <rect x={384} y={40} width={16} height={130} rx="8" fill="white" stroke={glassLine} strokeWidth="1.8" />
    <path d="M392 164V100" stroke="#d0463c" strokeWidth="3" />
    <circle cx={392} cy={172} r="10" fill="#e06b62" stroke="#b4524a" strokeWidth="1.6" />
    <text x={414} y={96} fontSize="14" fontWeight="700" fill={ink}>thermometer</text>
    <text x={414} y={114} fontSize="14" fontWeight="700" fill={ink}>at the top:</text>
    <text x={414} y={140} fontSize="20" fontWeight="700" fill={heatLine}>69 °C</text>
  </Diagram>
}
function DistillQuestion({ assessment }: { assessment: boolean }) {
  // Pointer targets on the simple-distillation drawing (see Rig geometry: A = (109, 92), axis U).
  const at = (s: number, off = 0): Pt => [r1(109 + U[0] * s + N[0] * off), r1(92 + U[1] * s + N[1] * off)]
  return <Diagram viewBox="0 0 540 340" title={assessment ? 'Distillation apparatus with four parts numbered 1 to 4.' : 'Distillation apparatus. Part 1 is the flask of salty water, part 2 is the thermometer, part 3 is the condenser, which cools the gas so it turns back into a liquid, and part 4 is the collected pure water.'}>
    <Rig frac={false} step="all" question assessment={assessment} />
    <Pointer n={1} x={26} y={150} to={[80, 214]} />
    <Pointer n={2} x={36} y={34} to={[97, 34]} />
    <Pointer n={3} x={at(160)[0]} y={at(160)[1] - 58} to={at(160, -8)} />
    <Pointer n={4} x={512} y={262} to={[462, 316]} />
    {!assessment && <g>
      <KeyRow n={1} x={330} y={26} lines={['flask of salty water']} mode="on" />
      <KeyRow n={2} x={330} y={56} lines={['thermometer']} mode="on" />
      <KeyRow n={3} x={330} y={86} lines={['condenser: gas → liquid']} mode="active" colour={cold} />
      <KeyRow n={4} x={330} y={116} lines={['pure water collected']} mode="on" />
    </g>}
  </Diagram>
}

export function SeparationVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus === 'sep-filter-soluble' || focus === 'sep-filter-insoluble') return <Dissolving focus={focus} />
  if (focus === 'sep-filter-question') return <Filtration focus={focus} question assessment={assessment} />
  if (focus.startsWith('sep-filter-')) return <Filtration focus={focus} />
  if (focus === 'sep-salt-solvent') return <Solvent />
  if (focus === 'sep-salt-evaporate') return <Evaporation />
  if (focus === 'sep-salt-warning') return <Warning />
  if (focus === 'sep-salt-crystallise' || focus === 'sep-salt-dry') return <Crystallise focus={focus} />
  if (focus === 'sep-salt-all') return <SaltCompare />
  if (focus === 'sep-rock-mix') return <RockMix />
  if (focus.startsWith('sep-rock-')) return <RockSteps focus={focus} />
  if (focus.startsWith('sep-dist-')) return <SimpleDistillation focus={focus} />
  if (focus === 'sep-frac-data') return <FracData />
  if (focus.startsWith('sep-frac-')) return <FractionalDistillation focus={focus} />
  if (focus === 'sep-question') return <DistillQuestion assessment={assessment} />
  return <SimpleDistillation focus="sep-dist-all" />
}
