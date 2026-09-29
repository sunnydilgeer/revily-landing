import { useId, type ReactNode } from 'react'
import { Arrow } from './InfectionVisuals'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C3 (Chemistry Lesson 21): concentration of solutions in g/dm³. Original, code-native schematics; not to scale.
 * Focus ids start with 'conc-'.
 *
 * Beakers hold water (a pale electron-blue tint) and dissolved particles (coral dots; the dots are only "bits of solute",
 * not ions). The more dots in the same space, the more crowded the solution and the higher its concentration. Amber marks
 * what the frame is about (the numbers being used, the step being done), as in the relative formula mass lesson.
 * Ink, muted greys and panels come from the Chemistry palette in AtomVisuals.tsx.
 */
const { ink, muted, panelFill, panelLine, protonFill, protonLine, electronFill, electronLine, shellLine } = atomPalette
const amber = '#d98a1c', amberSoft = '#fdf0dc', amberInk = '#8a5a14'
const bad = '#c0504a', badSoft = '#fbe6e4', good = '#3f8a5f', goodSoft = '#e3f3e8'

function Diagram({ title, children, viewBox = '0 0 540 320', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Num({ n, x, y, colour = ink, on = true }: { n: number; x: number; y: number; colour?: string; on?: boolean }) {
  return <g><circle cx={x} cy={y} r="12" fill={on ? colour : 'white'} stroke={colour} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill={on ? 'white' : colour}>{n}</text></g>
}
function Lines({ x, y, lines, gap = 19, anchor = 'start' }: { x: number; y: number; lines: Array<[ReactNode, 'b' | 'n' | 'm' | 'a' | 'bad' | 'good']>; gap?: number; anchor?: 'start' | 'middle' }) {
  const fill = { b: ink, n: ink, m: muted, a: amberInk, bad, good }
  return <g>{lines.map(([t, k], i) => t === '' ? null : <text key={i} x={x} y={y + i * gap} textAnchor={anchor} fontSize={k === 'm' ? 13 : 14} fontWeight={k === 'n' || k === 'm' ? 400 : 700} fill={fill[k]}>{t}</text>)}</g>
}
function Chip({ x, y, w, children, hot = false }: { x: number; y: number; w: number; children: ReactNode; hot?: boolean }) {
  return <g><rect x={x} y={y} width={w} height={28} rx="8" fill={hot ? amberSoft : panelFill} stroke={hot ? amber : panelLine} strokeWidth={hot ? 2 : 1.5} />
    <text x={x + w / 2} y={y + 19} textAnchor="middle" fontSize="15" fontWeight="700" fill={hot ? amberInk : ink}>{children}</text></g>
}
function Result({ x, y, w, children }: { x: number; y: number; w: number; children: ReactNode }) {
  return <g><rect x={x} y={y} width={w} height={36} rx="9" fill={amberSoft} stroke={amber} strokeWidth="2" />
    <text x={x + w / 2} y={y + 24} textAnchor="middle" fontSize="17" fontWeight="700" fill={amberInk}>{children}</text></g>
}
function Fraction({ x, y, top, bottom, width, size = 16 }: { x: number; y: number; top: ReactNode; bottom: ReactNode; width: number; size?: number }) {
  return <g>
    <text x={x} y={y - 10} textAnchor="middle" fontSize={size} fontWeight="700" fill={ink}>{top}</text>
    <path d={`M${x - width / 2} ${y}H${x + width / 2}`} stroke={ink} strokeWidth="2" />
    <text x={x} y={y + size + 8} textAnchor="middle" fontSize={size} fontWeight="700" fill={ink}>{bottom}</text>
  </g>
}

// ---------- Beakers of solution ----------
/** A beaker with water to `level` (0–1 of its height) and `n` dissolved particles spread evenly through the water. */
function Beaker({ x, y, w = 130, h = 150, level = 0.9, n = 0, hot = false }: { x: number; y: number; w?: number; h?: number; level?: number; n?: number; hot?: boolean }) {
  const wy = y + h * (1 - level)
  const cell = 17, x0 = x + 14, x1 = x + w - 14, y0 = wy + 12, y1 = y + h - 12
  const cols = Math.max(1, Math.floor((x1 - x0) / cell)), rows = Math.max(1, Math.floor((y1 - y0) / cell))
  const total = cols * rows
  const dots: Array<[number, number]> = []
  const seen = new Set<number>()
  for (let k = 0; k < n; k++) {
    let idx = Math.floor((((k * 0.618034 + 0.17) % 1)) * total)
    // golden-ratio spacing spreads the dots evenly without lining them up
    while (seen.has(idx)) idx = (idx + 1) % total
    seen.add(idx)
    const c = idx % cols, r = Math.floor(idx / cols)
    dots.push([x0 + cell / 2 + c * cell, y0 + cell / 2 + r * cell])
  }
  return <g>
    <path d={`M${x + 2} ${wy}H${x + w - 2}V${y + h - 10}Q${x + w - 2} ${y + h - 2} ${x + w - 12} ${y + h - 2}H${x + 12}Q${x + 2} ${y + h - 2} ${x + 2} ${y + h - 10}Z`} fill={electronFill} fillOpacity=".16" />
    <path d={`M${x + 2} ${wy}H${x + w - 2}`} stroke={electronLine} strokeWidth="1.5" opacity=".5" />
    {dots.map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="5.5" fill={protonFill} stroke={protonLine} strokeWidth="1.3" />)}
    <path d={`M${x} ${y}V${y + h - 10}Q${x} ${y + h} ${x + 10} ${y + h}H${x + w - 10}Q${x + w} ${y + h} ${x + w} ${y + h - 10}V${y}`} fill="none" stroke={hot ? amber : shellLine} strokeWidth={hot ? 3.5 : 3} />
  </g>
}
function Legend({ x, y }: { x: number; y: number }) {
  return <g><circle cx={x} cy={y} r="5.5" fill={protonFill} stroke={protonLine} strokeWidth="1.3" /><text x={x + 12} y={y + 5} fontSize="13" fill={muted}>= one particle of dissolved solid (the solute)</text></g>
}

// ---------- Section 1: what concentration means ----------
function CrowdSolute() {
  return <Diagram title="Two beakers holding the same volume of water. The left beaker has 3 dissolved particles, so it is less crowded and less concentrated. The right beaker has 12 dissolved particles in the same space, so it is more crowded and more concentrated.">
    <text x={270} y={28} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>the same volume of water</text>
    <Beaker x={80} y={48} w={140} h={150} level={0.9} n={3} />
    <Beaker x={320} y={48} w={140} h={150} level={0.9} n={12} hot />
    <text x={150} y={224} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>less crowded</text>
    <text x={390} y={224} textAnchor="middle" fontSize="15" fontWeight="700" fill={amberInk}>more crowded</text>
    <Result x={20} y={244} w={500}>same volume, more solute = more concentrated</Result>
    <Legend x={40} y={306} />
  </Diagram>
}
function CrowdVolume() {
  return <Diagram title="Two beakers each holding the same 8 dissolved particles. The left beaker has only a little water, so the particles are crowded together and it is more concentrated. The right beaker has much more water, so the same particles are spread out and it is less concentrated.">
    <text x={270} y={28} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>the same amount of solute: 8 particles</text>
    <Beaker x={80} y={48} w={140} h={150} level={0.4} n={8} hot />
    <Beaker x={320} y={48} w={140} h={150} level={0.9} n={8} />
    <Lines x={150} y={224} anchor="middle" lines={[['less water', 'n'], ['more crowded', 'a']]} gap={19} />
    <Lines x={390} y={224} anchor="middle" lines={[['more water', 'n'], ['more spread out', 'b']]} gap={19} />
    <Result x={20} y={264} w={500}>same solute, more water = less concentrated</Result>
  </Diagram>
}
function UnitCube() {
  return <Diagram title="A cube with sides of 10 centimetres, labelled 1 cubic decimetre, which is the same as 1000 cubic centimetres. Beside it, the concentration 20 g/dm³ means 20 grams of solute in every 1 dm³ of the solution.">
    {/* a cube: front face, top and side */}
    <path d="M60 110H190V240H60Z" fill={electronFill} fillOpacity=".16" stroke={shellLine} strokeWidth="3" />
    <path d="M60 110L92 78H222L190 110M190 110V240L222 208V78" fill="none" stroke={shellLine} strokeWidth="3" />
    <text x={125} y={182} textAnchor="middle" fontSize="20" fontWeight="700" fill={ink}>1 dm³</text>
    <text x={125} y={264} textAnchor="middle" fontSize="14" fill={muted}>10 cm</text>
    <text x={236} y={150} fontSize="14" fill={muted}>10 cm</text>
    <Lines x={20} y={296} lines={[['1 dm³ = 1000 cm³', 'a']]} />
    <rect x={290} y={70} width={230} height={170} rx="12" fill={amberSoft} stroke={amber} strokeWidth="2" />
    <text x={405} y={126} textAnchor="middle" fontSize="30" fontWeight="700" fill={amberInk}>20 g/dm³</text>
    <Lines x={405} y={158} anchor="middle" lines={[['means 20 grams of', 'n'], ['dissolved solid in every', 'n'], ['1 dm³ of the solution', 'n']]} />
  </Diagram>
}

// ---------- Section 2: the calculation ----------
type FormulaStage = 'formula' | 'convert' | 'steps'
const FORMULA_TITLES: Record<FormulaStage, string> = {
  formula: 'The concentration formula: concentration in g/dm³ equals the mass of solute in grams divided by the volume of solution in dm³. Unit tags show g/dm³ for concentration, g for mass and dm³ for volume.',
  convert: 'Changing cm³ to dm³: 250 cm³ divided by 1000 is 0.25 dm³. A bar of 1000 cm³, which is 1 dm³, has its first quarter shaded to show 250 cm³.',
  steps: 'Three steps for 24 g of solute in 400 cm³: 1, mass is 24 g; 2, change the volume: 400 ÷ 1000 = 0.4 dm³; 3, divide the mass by the volume: 24 ÷ 0.4 = 60 g/dm³.',
}
function Formula({ stage }: { stage: FormulaStage }) {
  return <Diagram title={FORMULA_TITLES[stage]} schematic={false}>
    {stage === 'formula' && <g>
      <rect x={20} y={30} width={500} height={190} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
      <text x={40} y={132} fontSize="18" fontWeight="700" fill={ink}>concentration</text>
      <text x={192} y={132} fontSize="22" fontWeight="700" fill={ink}>=</text>
      <Fraction x={316} y={126} width={190} size={17} top="mass of solute" bottom="volume of solution" />
      <Chip x={40} y={150} w={92} hot>g/dm³</Chip>
      <Chip x={440} y={78} w={64} hot>g</Chip>
      <Chip x={440} y={128} w={64} hot>dm³</Chip>
      <Lines x={40} y={62} lines={[['the formula', 'm']]} />
      <Lines x={20} y={252} lines={[['The solute is the solid that dissolves.', 'n'], ['Mass is in grams (g). Volume is in cubic decimetres (dm³).', 'n']]} gap={22} />
    </g>}
    {stage === 'convert' && <g>
      <Chip x={40} y={40} w={110}>250 cm³</Chip>
      <Arrow x1={160} y1={54} x2={290} y2={54} colour={amber} width={2.5} />
      <text x={225} y={40} textAnchor="middle" fontSize="16" fontWeight="700" fill={amberInk}>÷ 1000</text>
      <Chip x={300} y={40} w={110} hot>0.25 dm³</Chip>
      <text x={40} y={148} fontSize="15" fontWeight="700" fill={ink}>1 dm³ = 1000 cm³</text>
      <rect x={40} y={162} width={460} height={34} rx="6" fill={panelFill} stroke={shellLine} strokeWidth="2" />
      <rect x={40} y={162} width={115} height={34} rx="6" fill={amberSoft} stroke={amber} strokeWidth="2.5" />
      <text x={97} y={185} textAnchor="middle" fontSize="15" fontWeight="700" fill={amberInk}>250</text>
      <text x={40} y={218} fontSize="13" fill={muted}>0</text>
      <text x={500} y={218} textAnchor="end" fontSize="13" fill={muted}>1000 cm³ (1 dm³)</text>
      <Lines x={20} y={262} lines={[['Volumes are often given in cm³.', 'n'], ['Change them to dm³ before you divide.', 'a']]} gap={22} />
    </g>}
    {stage === 'steps' && <g>
      <text x={20} y={34} fontSize="16" fontWeight="700" fill={ink}>24 g of solute in 400 cm³ of solution</text>
      <Num n={1} x={40} y={78} colour={amber} /><text x={64} y={83} fontSize="16" fontWeight="700" fill={ink}>mass of solute = 24 g</text>
      <Num n={2} x={40} y={130} colour={amber} /><text x={64} y={135} fontSize="16" fontWeight="700" fill={ink}>volume in dm³ = 400 ÷ 1000 = 0.4 dm³</text>
      <Num n={3} x={40} y={182} colour={amber} /><text x={64} y={187} fontSize="16" fontWeight="700" fill={ink}>concentration = mass ÷ volume = 24 ÷ 0.4</text>
      <Result x={20} y={222} w={300}>concentration = 60 g/dm³</Result>
    </g>}
  </Diagram>
}
function WorkedConc() {
  return <Diagram title="Worked example set-up: a beaker holding 0.50 dm³ of solution with 40 g of dissolved copper sulfate. The sum to do is concentration equals mass divided by volume, 40 divided by 0.50.">
    <Beaker x={40} y={40} w={130} h={150} level={0.9} n={7} />
    <Chip x={35} y={206} w={140} hot>40 g of solute</Chip>
    <Lines x={200} y={78} lines={[['copper sulfate dissolved in water', 'n'], ['', 'n'], ['mass = 40 g', 'a'], ['volume = 0.50 dm³', 'a'], ['', 'n'], ['The volume is already in dm³,', 'm'], ['so it needs no change.', 'm']]} />
    <text x={200} y={224} fontSize="15" fontWeight="700" fill={ink}>concentration</text>
    <text x={330} y={224} fontSize="18" fontWeight="700" fill={ink}>=</text>
    <text x={358} y={224} fontSize="18" fontWeight="700" fill={ink}><tspan fill={amberInk}>40</tspan> ÷ <tspan fill={amberInk}>0.50</tspan></text>
  </Diagram>
}

// ---------- Section 3: finding the mass ----------
type MassStage = 'rearrange' | 'triangle' | 'steps'
const MASS_TITLES: Record<MassStage, string> = {
  rearrange: 'Rearranging the formula. Line 1: concentration = mass ÷ volume. Line 2: multiply both sides by the volume, so concentration × volume = mass ÷ volume × volume, with the two volumes crossed out on the right. Line 3: concentration × volume = mass.',
  triangle: 'A formula triangle with mass at the top and concentration and volume side by side at the bottom. Cover the thing you want to find. Cover mass and you see concentration × volume. Cover concentration and you see mass ÷ volume. Cover volume and you see mass ÷ concentration.',
  steps: 'Three steps for a concentration of 30 g/dm³ and a volume of 200 cm³: 1, change the volume: 200 ÷ 1000 = 0.2 dm³; 2, mass = concentration × volume = 30 × 0.2; 3, the answer is 6 g.',
}
function Mass({ stage }: { stage: MassStage }) {
  return <Diagram title={MASS_TITLES[stage]} schematic={false}>
    {stage === 'rearrange' && <g>
      <text x={20} y={34} fontSize="16" fontWeight="700" fill={ink}>To find the mass, get the mass on its own</text>
      <Num n={1} x={40} y={82} colour={muted} on={false} /><text x={68} y={88} fontSize="18" fontWeight="700" fill={ink}>concentration = mass ÷ volume</text>
      <Num n={2} x={40} y={148} colour={amber} />
      <text x={68} y={154} fontSize="15" fontWeight="700" fill={ink}>concentration <tspan fill={amberInk}>× volume</tspan> = mass ÷ <tspan textDecoration="line-through">volume</tspan> <tspan fill={amberInk}>× </tspan><tspan textDecoration="line-through" fill={amberInk}>volume</tspan></text>
      <Lines x={68} y={176} lines={[['Multiply both sides by the volume. Then ÷ volume and × volume cancel.', 'm']]} />
      <Num n={3} x={40} y={228} colour={amber} />
      <text x={68} y={234} fontSize="18" fontWeight="700" fill={ink}>concentration × volume = mass</text>
      <Result x={20} y={262} w={330}>mass = concentration × volume</Result>
    </g>}
    {stage === 'triangle' && <g>
      <path d="M130 30L34 190H226Z" fill={panelFill} stroke={shellLine} strokeWidth="3" />
      <path d="M62 128H198M130 128V190" stroke={shellLine} strokeWidth="2.5" />
      <text x={130} y={110} textAnchor="middle" fontSize="19" fontWeight="700" fill={ink}>mass</text>
      <text x={84} y={168} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>conc.</text>
      <text x={176} y={168} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>volume</text>
      <Lines x={130} y={210} anchor="middle" lines={[['mass in g · conc. in g/dm³', 'm'], ['volume in dm³', 'm']]} gap={16} />
      <text x={130} y={262} textAnchor="middle" fontSize="14" fontWeight="700" fill={amberInk}>Cover what you want to find.</text>
      {([['cover mass', 'conc. × volume', true], ['cover conc.', 'mass ÷ volume', false], ['cover volume', 'mass ÷ conc.', false]] as const).map(([a, b, hot], i) => <g key={a}>
        <rect x={290} y={40 + i * 66} width={230} height={54} rx="10" fill={hot ? amberSoft : panelFill} stroke={hot ? amber : panelLine} strokeWidth={hot ? 2 : 1.5} />
        <text x={306} y={64 + i * 66} fontSize="13" fill={muted}>{a}</text>
        <text x={306} y={84 + i * 66} fontSize="17" fontWeight="700" fill={hot ? amberInk : ink}>{b}</text>
      </g>)}
    </g>}
    {stage === 'steps' && <g>
      <text x={20} y={34} fontSize="16" fontWeight="700" fill={ink}>30 g/dm³ solution, 200 cm³ of it</text>
      <Num n={1} x={40} y={82} colour={amber} /><text x={64} y={87} fontSize="16" fontWeight="700" fill={ink}>volume in dm³ = 200 ÷ 1000 = 0.2 dm³</text>
      <Num n={2} x={40} y={134} colour={amber} /><text x={64} y={139} fontSize="16" fontWeight="700" fill={ink}>mass = concentration × volume = 30 × 0.2</text>
      <Num n={3} x={40} y={186} colour={amber} /><text x={64} y={191} fontSize="16" fontWeight="700" fill={ink}>write the answer in grams</text>
      <Result x={20} y={222} w={200}>mass = 6 g</Result>
      <Lines x={20} y={286} lines={[['Check: 0.2 dm³ is a fifth of 1 dm³, and a fifth of 30 g is 6 g.', 'm']]} />
    </g>}
  </Diagram>
}
function WorkedMass() {
  return <Diagram title="Worked example set-up: a beaker of solution with concentration 50 g/dm³ and volume 0.30 dm³. The sum to do is mass equals concentration times volume, 50 times 0.30.">
    <Beaker x={40} y={40} w={130} h={150} level={0.9} n={9} />
    <Chip x={50} y={206} w={110} hot>50 g/dm³</Chip>
    <Lines x={200} y={78} lines={[['concentration = 50 g/dm³', 'a'], ['volume = 0.30 dm³', 'a'], ['', 'n'], ['Find the mass of', 'n'], ['solute in the beaker.', 'n']]} />
    <text x={200} y={200} fontSize="15" fontWeight="700" fill={ink}>mass</text>
    <text x={252} y={200} fontSize="18" fontWeight="700" fill={ink}>=</text>
    <text x={280} y={200} fontSize="18" fontWeight="700" fill={ink}><tspan fill={amberInk}>50</tspan> × <tspan fill={amberInk}>0.30</tspan></text>
  </Diagram>
}

// ---------- On your own ----------
function BeakerQuestion() {
  const items: Array<[string, number, number, string]> = [['A', 0.45, 8, '100 cm³'], ['B', 0.9, 8, '200 cm³'], ['C', 0.9, 4, '200 cm³']]
  return <Diagram schematic={false} viewBox="0 0 540 300" title="Three beakers of the same dissolved solid. Beaker A has 100 cubic centimetres of solution with 8 particles. Beaker B has 200 cubic centimetres with 8 particles. Beaker C has 200 cubic centimetres with 4 particles.">
    {items.map(([name, level, n, vol], i) => {
      const x = 32 + i * 180
      return <g key={name}>
        <Beaker x={x} y={40} w={116} h={150} level={level} n={n} />
        <circle cx={x + 58} cy={218} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x + 58} y={224} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{name}</text>
        <text x={x + 58} y={252} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{vol}</text>
      </g>
    })}
    <Legend x={32} y={284} />
  </Diagram>
}
// A student's working: 12 g of solute in 250 cm³. Line 2 divides by 100 (should be 1000: 0.25 dm³; concentration 48 g/dm³).
function ErrorQuestion({ assessment }: { assessment: boolean }) {
  const lines = ['mass of solute = 12 g', 'volume = 250 ÷ 100 = 2.5 dm³', 'concentration = 12 ÷ 2.5', 'concentration = 4.8 g/dm³']
  return <Diagram viewBox={`0 0 540 ${assessment ? 250 : 300}`} schematic={false} title={assessment
    ? 'A student’s working for the concentration of 12 g of solute in 250 cm³ of solution, in four numbered lines. Line 1: mass of solute = 12 g. Line 2: volume = 250 ÷ 100 = 2.5 dm³. Line 3: concentration = 12 ÷ 2.5. Line 4: concentration = 4.8 g/dm³.'
    : 'A student’s working for the concentration of 12 g of solute in 250 cm³ of solution, in four numbered lines. Line 2 is marked wrong: it divides by 100 instead of 1000. The volume should be 0.25 dm³, so the concentration is 12 ÷ 0.25 = 48 g/dm³.'}>
    <text x={20} y={34} fontSize="16" fontWeight="700" fill={ink}>A student’s working: 12 g of solute in 250 cm³</text>
    <rect x={20} y={50} width={500} height={186} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    {lines.map((l, i) => {
      const y = 90 + i * 42, wrong = !assessment && i === 1
      return <g key={i}>
        {wrong && <rect x={28} y={y - 21} width={484} height={38} rx="8" fill={badSoft} stroke={bad} strokeWidth="1.5" />}
        <Num n={i + 1} x={52} y={y - 2} colour={wrong ? bad : ink} on={false} />
        <text x={78} y={y + 4} fontSize="16" fontWeight="600" fill={wrong ? bad : ink}>{l}</text>
      </g>
    })}
    {!assessment && <Lines x={20} y={264} lines={[['1 dm³ = 1000 cm³, so 250 ÷ 1000 = 0.25 dm³', 'good'], ['Then 12 ÷ 0.25 = 48 g/dm³', 'good']]} gap={22} />}
  </Diagram>
}
function SolutionsData() {
  const rows: Array<[string, string, string]> = [['P', '10', '0.50'], ['Q', '10', '0.25'], ['R', '20', '1.00'], ['S', '30', '0.50']]
  return <Diagram viewBox="0 0 540 250" schematic={false} title="A data table of four solutions of the same solute. Solution P: 10 g of solute in 0.50 dm³. Solution Q: 10 g in 0.25 dm³. Solution R: 20 g in 1.00 dm³. Solution S: 30 g in 0.50 dm³.">
    <text x={30} y={26} fontSize="15" fontWeight="700" fill={ink}>Four solutions of the same solute</text>
    <rect x={20} y={40} width={500} height={196} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="14" fontWeight="700" fill={ink}>
      <text x={36} y={70}>solution</text>
      <text x={270} y={62} textAnchor="middle">mass of solute</text><text x={270} y={78} textAnchor="middle">(g)</text>
      <text x={416} y={62} textAnchor="middle">volume of solution</text><text x={416} y={78} textAnchor="middle">(dm³)</text>
    </g>
    <path d="M32 90H508" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([name, m, v], i) => {
      const y = 120 + i * 34
      return <g key={name} fontSize="16" fill={ink}>
        <text x={36} y={y} fontWeight="700">{name}</text><text x={270} y={y} textAnchor="middle">{m}</text><text x={416} y={y} textAnchor="middle">{v}</text>
      </g>
    })}
  </Diagram>
}

export function ConcentrationVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'conc-crowd-solute': return <CrowdSolute />
    case 'conc-crowd-volume': return <CrowdVolume />
    case 'conc-unit-dm3': return <UnitCube />
    case 'conc-formula': return <Formula stage="formula" />
    case 'conc-convert': return <Formula stage="convert" />
    case 'conc-steps': return <Formula stage="steps" />
    case 'conc-worked-conc': return <WorkedConc />
    case 'conc-rearrange': return <Mass stage="rearrange" />
    case 'conc-triangle': return <Mass stage="triangle" />
    case 'conc-mass-steps': return <Mass stage="steps" />
    case 'conc-worked-mass': return <WorkedMass />
    case 'conc-question-beakers': return <BeakerQuestion />
    case 'conc-question-error': return <ErrorQuestion assessment={assessment} />
    case 'conc-data-solutions': return <SolutionsData />
    default: return <Formula stage="formula" />
  }
}
