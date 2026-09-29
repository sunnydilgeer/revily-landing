import { useId, type ReactNode } from 'react'
import { Arrow } from './InfectionVisuals'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C3 (Chemistry Lesson 20): when the mass in a container seems to change. Original, code-native
 * schematics; not to scale. Focus ids start with 'gasmass-'.
 *
 * One balance-and-container picture is reused and changed frame by frame. Gas particles are drawn as small atoms in the
 * element colours the formulas lesson uses (O soft red, C dark grey): an oxygen molecule is two red circles, a carbon
 * dioxide molecule is O–C–O. Amber marks the number or step in focus. Ink, greys and panels come from the Chemistry
 * palette in AtomVisuals.tsx. The balance display shows a real reading; masses follow the real ratios
 * (2Mg + O₂ → 2MgO; CuCO₃ → CuO + CO₂).
 */
const { ink, muted, panelFill, panelLine } = atomPalette
const amber = '#d98a1c', amberSoft = '#fdf0dc', amberInk = '#8a5a14'
const bad = '#c0504a', good = '#3f8a5f', goodSoft = '#e3f3e8'
const oFill = '#f2a39b', oLine = '#c0625a', cFill = '#5f6b75', cLine = '#3c464e'
const glassFill = '#eef6fb', glassLine = '#8fb0c4'
const faded = 0.3

function Diagram({ title, children, viewBox = '0 0 540 320', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Lines({ x, y, lines, gap = 21 }: { x: number; y: number; lines: Array<[ReactNode, 'b' | 'n' | 'm' | 'a' | 'g']>; gap?: number }) {
  const fill = { b: ink, n: ink, m: muted, a: amberInk, g: good }
  return <g>{lines.map(([t, k], i) => t === '' ? null : <text key={i} x={x} y={y + i * gap} fontSize={k === 'm' ? 13 : 15} fontWeight={k === 'n' || k === 'm' ? 400 : 700} fill={fill[k]}>{t}</text>)}</g>
}
function Num({ n, x, y, colour = ink }: { n: number; x: number; y: number; colour?: string }) {
  return <g><circle cx={x} cy={y} r="12" fill="white" stroke={colour} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill={colour}>{n}</text></g>
}

// ---------- Gas particles ----------
function O2({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}><path d="M-6 0H6" stroke={oLine} strokeWidth="3" />
    <circle cx={-7} cy={0} r={7} fill={oFill} stroke={oLine} strokeWidth="1.6" /><circle cx={7} cy={0} r={7} fill={oFill} stroke={oLine} strokeWidth="1.6" /></g>
}
function CO2({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}><path d="M-13 0H13" stroke={cLine} strokeWidth="3" />
    <circle cx={-13} cy={0} r={6.5} fill={oFill} stroke={oLine} strokeWidth="1.6" /><circle cx={0} cy={0} r={6.5} fill={cFill} stroke={cLine} strokeWidth="1.6" /><circle cx={13} cy={0} r={6.5} fill={oFill} stroke={oLine} strokeWidth="1.6" /></g>
}

// ---------- Apparatus ----------
/** A digital balance: the platform is at y, the body and display sit beneath it. */
function Balance({ cx, y, reading, hot = false, dim = false }: { cx: number; y: number; reading: string; hot?: boolean; dim?: boolean }) {
  return <g opacity={dim ? .45 : 1}>
    <rect x={cx - 100} y={y} width={200} height={12} rx="5" fill="#dbe6ee" stroke={muted} strokeWidth="1.8" />
    <rect x={cx - 92} y={y + 12} width={184} height={46} rx="8" fill={panelFill} stroke={panelLine} strokeWidth="1.8" />
    <rect x={cx - 52} y={y + 22} width={104} height={28} rx="6" fill="white" stroke={hot ? amber : ink} strokeWidth={hot ? 2.5 : 1.8} />
    <text x={cx} y={y + 42} textAnchor="middle" fontSize={reading.length > 7 ? 15 : 18} fontWeight="700" fill={hot ? amberInk : ink}>{reading}</text>
  </g>
}
/** A conical flask sitting on y = base. Returns the outline; contents are drawn separately with halfWidth(). */
const FLASK = { h: 116, w: 112, neck: 34 }
function flaskHalf(dy: number) { // half-width at dy above the base
  const { h, w, neck } = FLASK, shoulder = h * .5
  if (dy >= shoulder) return neck / 2
  return neck / 2 + (w / 2 - neck / 2) * (1 - dy / shoulder) * 1
}
function Flask({ cx, base, bung = false, children }: { cx: number; base: number; bung?: boolean; children?: ReactNode }) {
  const { h, w, neck } = FLASK, top = base - h
  return <g>
    <path d={`M${cx - neck / 2} ${top}V${base - h * .5}L${cx - w / 2} ${base - 6}Q${cx - w / 2} ${base} ${cx - w / 2 + 8} ${base}H${cx + w / 2 - 8}Q${cx + w / 2} ${base} ${cx + w / 2} ${base - 6}L${cx + neck / 2} ${base - h * .5}V${top}Z`} fill={glassFill} stroke={glassLine} strokeWidth="2.2" />
    {children}
    <path d={`M${cx - neck / 2 - 4} ${top}H${cx + neck / 2 + 4}`} stroke={glassLine} strokeWidth="3" />
    {bung && <g><path d={`M${cx - neck / 2 - 3} ${top - 16}H${cx + neck / 2 + 3}L${cx + neck / 2 - 2} ${top + 10}H${cx - neck / 2 + 2}Z`} fill="#c9b79a" stroke="#8c7a5c" strokeWidth="2" /></g>}
  </g>
}
/** Liquid or solid at the bottom of a flask, up to `level` above the base. */
function FlaskFill({ cx, base, level, fill, line }: { cx: number; base: number; level: number; fill: string; line: string }) {
  const hw = flaskHalf(level) - 2, bw = FLASK.w / 2 - 2
  return <path d={`M${cx - bw} ${base - 6}Q${cx - bw} ${base - 1} ${cx - bw + 8} ${base - 1}H${cx + bw - 8}Q${cx + bw} ${base - 1} ${cx + bw} ${base - 6}L${cx + hw} ${base - level}H${cx - hw}Z`} fill={fill} stroke={line} strokeWidth="1.5" />
}
/** A small shallow crucible whose base rests at y = base. */
function Crucible({ cx, base, children }: { cx: number; base: number; children?: ReactNode }) {
  return <g>
    <path d={`M${cx - 46} ${base - 34}H${cx + 46}L${cx + 34} ${base}H${cx - 34}Z`} fill="#ece6dc" stroke="#9b9284" strokeWidth="2.2" />
    {children}
  </g>
}
/** A test tube (open top) with its base at y = base and `level` of powder. */
function Tube({ cx, base, level, powder, powderLine }: { cx: number; base: number; level: number; powder?: string; powderLine?: string }) {
  const w = 40, h = 126, x = cx - w / 2, top = base - h
  return <g>
    <path d={`M${x} ${top}V${base - 20}A20 20 0 0 0 ${x + w} ${base - 20}V${top}Z`} fill={glassFill} stroke={glassLine} strokeWidth="2.2" />
    {powder && level > 0 && <path d={`M${x + 2} ${base - level}V${base - 20}A18 18 0 0 0 ${x + w - 2} ${base - 20}V${base - level}Z`} fill={powder} stroke={powderLine} strokeWidth="1.5" />}
    <path d={`M${x - 4} ${top}H${x + w + 4}`} stroke={glassLine} strokeWidth="3" />
  </g>
}
function Flame({ cx, y }: { cx: number; y: number }) {
  return <g><path d={`M${cx} ${y - 34}C${cx + 18} ${y - 14} ${cx + 16} ${y} ${cx} ${y}C${cx - 16} ${y} ${cx - 18} ${y - 14} ${cx} ${y - 34}Z`} fill="#f7c65a" stroke="#d98a1c" strokeWidth="2" />
    <path d={`M${cx} ${y - 18}C${cx + 8} ${y - 8} ${cx + 7} ${y} ${cx} ${y}C${cx - 7} ${y} ${cx - 8} ${y - 8} ${cx} ${y - 18}Z`} fill="#fdf0dc" stroke="none" /></g>
}
/** A panel showing a word equation with state symbols; `hot` marks which part to look at. */
function StateBadge({ x, y, w, children }: { x: number; y: number; w: number; children: ReactNode }) {
  return <g><rect x={x} y={y} width={w} height={34} rx="9" fill={amberSoft} stroke={amber} strokeWidth="2" /><text x={x + w / 2} y={y + 23} textAnchor="middle" fontSize="16" fontWeight="700" fill={amberInk}>{children}</text></g>
}

// ---------- Section 1: why the mass can seem to change ----------
type Idea = 'rule' | 'open' | 'two'
const IDEA_TITLES: Record<Idea, string> = {
  rule: 'A sealed flask on a balance, before and after a reaction. Solid reactants are in the flask before. Afterwards the flask holds a new solid and some gas. Nothing can get in or out, so both balance readings are 100.0 g.',
  open: 'A flask with no lid on a balance. Oxygen from the air can drift in through the open top, and gas made in the reaction can drift out. The balance reading is a question mark, because it depends on which happens.',
  two: 'Two open flasks side by side. In the left flask a gas from the air joins the reaction, so the balance reading goes up. In the right flask a gas made in the reaction escapes, so the balance reading goes down.',
}
function Ideas({ idea }: { idea: Idea }) {
  const base = 190, y = 190
  if (idea === 'rule') return <Diagram title={IDEA_TITLES.rule}>
    {[110, 320].map((cx, i) => <g key={cx}>
      <Flask cx={cx} base={base} bung>
        {i === 0 ? <FlaskFill cx={cx} base={base} level={22} fill="#dfe8ee" line={muted} /> : <FlaskFill cx={cx} base={base} level={20} fill="#efe6d4" line="#b98646" />}
        {i === 1 && <g><CO2 x={cx - 8} y={base - 46} r={-15} s={.85} /><CO2 x={cx + 10} y={base - 32} r={20} s={.85} /></g>}
      </Flask>
      <Balance cx={cx} y={y} reading="100.0 g" />
      <text x={cx} y={y + 82} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{i === 0 ? 'before' : 'after'}</text>
    </g>)}
    <Arrow x1={190} y1={120} x2={240} y2={120} colour={ink} width={3} />
    <text x={215} y={104} textAnchor="middle" fontSize="13" fill={muted}>reaction</text>
    <text x={270} y={22} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>Sealed: nothing can get in or out</text>
    <text x={440} y={150} fontSize="15" fontWeight="700" fill={amberInk}>same</text>
    <text x={440} y={170} fontSize="15" fontWeight="700" fill={amberInk}>reading</text>
  </Diagram>
  if (idea === 'open') return <Diagram title={IDEA_TITLES.open}>
    <Flask cx={200} base={base}><FlaskFill cx={200} base={base} level={22} fill="#dfe8ee" line={muted} /></Flask>
    <Balance cx={200} y={y} reading="? g" hot />
    <Arrow x1={110} y1={36} x2={186} y2={78} colour={amber} width={3} />
    <O2 x={92} y={28} r={-20} />
    <Arrow x1={216} y1={80} x2={296} y2={34} colour={amber} width={3} />
    <CO2 x={318} y={26} r={-25} />
    <Lines x={340} y={100} lines={[['Gas can drift in', 'a'], ['through the open top.', 'n'], ['', 'n'], ['Gas can drift out', 'a'], ['of it too.', 'n'], ['', 'n'], ['The balance only weighs', 'n'], ['what is in the flask.', 'n']]} gap={22} />
    <text x={200} y={300} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>unsealed: no lid</text>
  </Diagram>
  return <Diagram title={IDEA_TITLES.two}>
    {[130, 410].map((cx, i) => <g key={cx}>
      <Flask cx={cx} base={base}>{i === 0 ? <FlaskFill cx={cx} base={base} level={22} fill="#dfe8ee" line={muted} /> : <FlaskFill cx={cx} base={base} level={22} fill="#efe6d4" line="#b98646" />}</Flask>
      <Balance cx={cx} y={y} reading={i === 0 ? 'goes up' : 'goes down'} hot />
    </g>)}
    <O2 x={72} y={34} r={-10} /><Arrow x1={92} y1={40} x2={124} y2={82} colour={amber} width={3} />
    <text x={130} y={18} textAnchor="middle" fontSize="15" fontWeight="700" fill={amberInk}>gas comes in</text>
    <Arrow x1={410} y1={80} x2={438} y2={42} colour={amber} width={3} /><CO2 x={462} y={34} r={-25} />
    <text x={410} y={18} textAnchor="middle" fontSize="15" fontWeight="700" fill={amberInk}>gas escapes</text>
    <text x={130} y={286} textAnchor="middle" fontSize="14" fill={ink}>a gas is a reactant</text>
    <text x={410} y={286} textAnchor="middle" fontSize="14" fill={ink}>a gas is a product</text>
    <text x={270} y={150} textAnchor="middle" fontSize="13" fill={muted}>no atoms are lost</text>
  </Diagram>
}

// ---------- Section 2: a gas reactant, magnesium burning in an open crucible ----------
type Stage3 = 'before' | 'during' | 'after' | 'rule'
const MG_TITLES: Record<Stage3, string> = {
  before: 'Magnesium ribbon in an open crucible on a balance reading 25.24 g. Oxygen molecules float in the air around the crucible. They are not in the crucible, so the balance does not weigh them.',
  during: 'The magnesium ribbon burns with a bright glow. Oxygen molecules from the air, with arrows pointing into the crucible, join the magnesium atoms and make magnesium oxide.',
  after: 'A crucible of white magnesium oxide on a balance reading 25.40 g, which is 0.16 g more than before. Oxygen atoms are now part of the solid in the crucible, so the balance weighs them.',
  rule: 'The reaction magnesium (solid) plus oxygen (gas) makes magnesium oxide (solid), with the (g) for the gas reactant highlighted. A gas reactant joins the solid, so the balance reading goes up.',
}
function Magnesium({ stage }: { stage: Stage3 }) {
  const cx = 170, base = 214
  if (stage === 'rule') return <Diagram title={MG_TITLES.rule}>
    <text x={270} y={34} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>Look at the state symbols</text>
    <rect x={20} y={56} width={500} height={82} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={270} y={104} textAnchor="middle" fontSize="18" fontWeight="700" fill={ink}>magnesium<tspan fontSize="14" dy="4">(s)</tspan><tspan dy="-4"> + oxygen</tspan><tspan fontSize="14" dy="4" fill={amberInk}>(g)</tspan><tspan dy="-4"> → magnesium oxide</tspan><tspan fontSize="14" dy="4">(s)</tspan></text>
    <rect x={253} y={150} width={40} height={4} rx="2" fill="none" />
    <Arrow x1={274} y1={120} x2={274} y2={164} colour={amber} width={2.5} />
    <StateBadge x={20} y={172} w={500}>A gas reactant joins the solid: the mass goes up</StateBadge>
    <O2 x={60} y={250} /><text x={82} y={256} fontSize="14" fill={ink}>oxygen: a gas in the air, not weighed</text>
    <Lines x={40} y={286} lines={[['The balance only weighs what is in the crucible.', 'm']]} />
  </Diagram>
  const airs: Array<[number, number, number]> = [[40, 70, 20], [104, 40, -30], [250, 60, 40], [236, 124, -10], [60, 130, -50], [300, 36, 10]]
  return <Diagram title={MG_TITLES[stage]}>
    <Balance cx={cx} y={base} reading={stage === 'after' ? '25.40 g' : '25.24 g'} hot={stage === 'after'} />
    <Crucible cx={cx} base={base}>
      {stage !== 'after' && <path d={`M${cx - 26} ${base - 8}q8 -12 16 0t16 0t16 0t16 0`} fill="none" stroke="#a7b3bc" strokeWidth="5" />}
      {stage === 'after' && <g><path d={`M${cx - 34} ${base}Q${cx - 32} ${base - 26} ${cx} ${base - 28}Q${cx + 32} ${base - 26} ${cx + 34} ${base}Z`} fill="#fbfbf8" stroke="#b9b6ac" strokeWidth="1.8" />
        {[[-16, -8], [0, -16], [16, -8], [-4, -5], [8, -5]].map(([dx, dy], i) => <circle key={i} cx={cx + dx} cy={base + dy} r={4.5} fill={oFill} stroke={oLine} strokeWidth="1.3" />)}</g>}
    </Crucible>
    {stage === 'before' && airs.map(([x, y, r], i) => <O2 key={i} x={x + 30} y={y} r={r} />)}
    {stage === 'during' && <g>
      <circle cx={cx} cy={base - 44} r={34} fill="#fdf0dc" opacity=".8" /><circle cx={cx} cy={base - 44} r={18} fill="#fff8e6" />
      {[[70, 60], [270, 70], [80, 140], [270, 140]].map(([x, y], i) => <g key={i}><O2 x={x} y={y} r={i % 2 ? 30 : -30} /><Arrow x1={x + (x < cx ? 22 : -22)} y1={y + 6} x2={cx + (x < cx ? -46 : 46)} y2={base - 52} colour={amber} width={2.5} /></g>)}
    </g>}
    {stage === 'after' && <text x={cx} y={base - 56} textAnchor="middle" fontSize="15" fontWeight="700" fill={amberInk}>+ 0.16 g</text>}
    <text x={cx} y={base + 82} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{stage === 'before' ? 'before' : stage === 'during' ? 'burning' : 'after'}</text>
    {stage === 'before' && <Lines x={340} y={120} lines={[['Oxygen is in the air,', 'a'], ['not in the crucible.', 'a'], ['', 'n'], ['The balance cannot', 'n'], ['weigh it.', 'n']]} />}
    {stage === 'during' && <Lines x={340} y={110} lines={[['Oxygen atoms join', 'a'], ['the magnesium.', 'a'], ['', 'n'], ['They make a solid,', 'n'], ['magnesium oxide.', 'n']]} />}
    {stage === 'after' && <Lines x={340} y={110} lines={[['The oxygen is now', 'a'], ['part of the solid.', 'a'], ['', 'n'], ['The balance can', 'n'], ['weigh it: mass up.', 'n']]} />}
  </Diagram>
}

// ---------- Section 3: a gas product, copper carbonate heated in an open tube ----------
const CU_TITLES: Record<Stage3, string> = {
  before: 'A green solid, copper carbonate, in an open test tube on a balance reading 6.2 g. Every reactant is a solid, so everything is held in the tube.',
  during: 'The test tube is heated by a flame. The green solid breaks down into a black solid, and carbon dioxide molecules rise out of the open top of the tube into the air.',
  after: 'The test tube on the balance now holds only black copper oxide and reads 4.0 g, which is 2.2 g less than before. Carbon dioxide molecules have drifted away into the air, so the balance cannot weigh them.',
  rule: 'The reaction copper carbonate (solid) makes copper oxide (solid) plus carbon dioxide (gas), with the (g) for the gas product highlighted. A gas product escapes, so the balance reading goes down.',
}
function Copper({ stage }: { stage: Stage3 }) {
  const cx = 170, base = 214
  if (stage === 'rule') return <Diagram title={CU_TITLES.rule}>
    <text x={270} y={34} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>Look at the state symbols</text>
    <rect x={20} y={56} width={500} height={82} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={270} y={104} textAnchor="middle" fontSize="14.5" fontWeight="700" fill={ink}>copper carbonate<tspan fontSize="13" dy="4">(s)</tspan><tspan dy="-4"> → copper oxide</tspan><tspan fontSize="13" dy="4">(s)</tspan><tspan dy="-4"> + carbon dioxide</tspan><tspan fontSize="13" dy="4" fill={amberInk}>(g)</tspan></text>
    <Arrow x1={440} y1={120} x2={440} y2={164} colour={amber} width={2.5} />
    <StateBadge x={20} y={172} w={500}>A gas product escapes: the mass goes down</StateBadge>
    <CO2 x={60} y={250} /><text x={90} y={256} fontSize="14" fill={ink}>carbon dioxide: a gas that drifts away</text>
    <Lines x={40} y={286} lines={[['The balance only weighs what is left in the tube.', 'm']]} />
  </Diagram>
  const level = stage === 'after' ? 18 : 26
  return <Diagram title={CU_TITLES[stage]}>
    {stage !== 'during' ? <Balance cx={cx} y={base} reading={stage === 'after' ? '4.0 g' : '6.2 g'} hot={stage === 'after'} /> : <Flame cx={cx} y={base + 44} />}
    <Tube cx={cx} base={base} level={level} powder={stage === 'before' ? '#9fd3b0' : stage === 'during' ? '#7aa08a' : '#4a4f52'} powderLine={stage === 'before' ? '#4c9a68' : stage === 'during' ? '#4c7a5f' : '#2f3437'} />
    {stage === 'during' && <g>
      <CO2 x={cx - 14} y={base - 150} r={-20} /><CO2 x={cx + 30} y={base - 178} r={20} /><CO2 x={cx + 4} y={base - 206} r={-10} s={.9} />
      <Arrow x1={cx} y1={base - 110} x2={cx} y2={base - 138} colour={amber} width={2.5} />
    </g>}
    {stage === 'after' && <g opacity={faded + .2}><CO2 x={cx + 70} y={70} r={-20} /><CO2 x={cx + 118} y={40} r={20} /><CO2 x={cx + 30} y={30} r={-10} /></g>}
    {stage === 'after' && <text x={cx - 34} y={base - 70} textAnchor="end" fontSize="15" fontWeight="700" fill={amberInk}>− 2.2 g</text>}
    <text x={cx} y={base + 82} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{stage === 'before' ? 'before' : stage === 'during' ? 'heating' : 'after'}</text>
    {stage === 'before' && <Lines x={340} y={120} lines={[['Everything is in', 'a'], ['the tube.', 'a'], ['', 'n'], ['The balance reads', 'n'], ['the green solid.', 'n']]} />}
    {stage === 'during' && <Lines x={340} y={110} lines={[['The solid breaks down', 'a'], ['into a black solid', 'a'], ['and a gas.', 'a'], ['', 'n'], ['The gas is not trapped,', 'n'], ['so it spreads out', 'n'], ['into the air.', 'n']]} />}
    {stage === 'after' && <Lines x={340} y={130} lines={[['The gas has escaped.', 'a'], ['', 'n'], ['The balance only', 'n'], ['weighs the solid', 'n'], ['left: mass down.', 'n']]} />}
  </Diagram>
}

// ---------- Worked-example set-ups (no answers) ----------
function WorkedPair({ kind }: { kind: 'mg' | 'cu' }) {
  const mg = kind === 'mg', y = 150
  const [a, b] = mg ? ['25.24 g', '25.40 g'] : ['6.2 g', '4.0 g']
  return <Diagram title={mg
    ? 'Worked example set-up. A crucible with magnesium ribbon reads 25.24 g. After burning in air it holds magnesium oxide and reads 25.40 g. The question is how much oxygen joined the magnesium.'
    : 'Worked example set-up. An open tube holds 6.2 g of copper carbonate. After heating it holds 4.0 g of copper oxide. The question is how much carbon dioxide escaped.'}>
    {[130, 410].map((cx, i) => <g key={cx}>
      {mg
        ? <Crucible cx={cx} base={y}>{i === 0 ? <path d={`M${cx - 26} ${y - 8}q8 -12 16 0t16 0t16 0t16 0`} fill="none" stroke="#a7b3bc" strokeWidth="5" /> : <path d={`M${cx - 30} ${y}Q${cx - 28} ${y - 22} ${cx} ${y - 24}Q${cx + 28} ${y - 22} ${cx + 30} ${y}Z`} fill="#fbfbf8" stroke="#b9b6ac" strokeWidth="1.8" />}</Crucible>
        : <Tube cx={cx} base={y} level={i === 0 ? 24 : 16} powder={i === 0 ? '#9fd3b0' : '#4a4f52'} powderLine={i === 0 ? '#4c9a68' : '#2f3437'} />}
      <Balance cx={cx} y={y} reading={i === 0 ? a : b} />
      <text x={cx} y={y + 82} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{i === 0 ? 'before' : 'after'}</text>
    </g>)}
    <Arrow x1={210} y1={y - 40} x2={330} y2={y - 40} colour={ink} width={3} />
    <text x={270} y={y - 54} textAnchor="middle" fontSize="13" fill={muted}>{mg ? 'burn in air' : 'heat'}</text>
    <StateBadge x={70} y={262} w={400}>{mg ? 'How much oxygen joined the magnesium?' : 'How much carbon dioxide escaped?'}</StateBadge>
  </Diagram>
}

// ---------- On your own ----------
// Data: three experiments in open containers. Neutral wording, no hint of which involves a gas.
function DataTable() {
  const rows: Array<[string, string, string, string]> = [['A', 'copper powder heated in an open dish', '4.0', '5.0'], ['B', 'sodium hydroxide solution mixed with acid in an open beaker', '80.0', '80.0'], ['C', 'zinc carbonate heated in an open tube', '3.0', '1.9']]
  return <Diagram viewBox="0 0 540 260" schematic={false} title="A data table of three experiments in open containers. Experiment A: copper powder heated in an open dish, mass 4.0 g before and 5.0 g after. Experiment B: sodium hydroxide solution mixed with acid in an open beaker, 80.0 g before and 80.0 g after. Experiment C: zinc carbonate heated in an open tube, 3.0 g before and 1.9 g after.">
    <text x={30} y={26} fontSize="15" fontWeight="700" fill={ink}>Three experiments, all in open containers</text>
    <rect x={20} y={40} width={500} height={206} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="13" fontWeight="700" fill={ink}>
      <text x={34} y={68}>experiment</text><text x={260} y={68}>what was done</text>
      <text x={456} y={58} textAnchor="middle">mass (g)</text><text x={425} y={78} textAnchor="middle">before</text><text x={488} y={78} textAnchor="middle">after</text>
    </g>
    <path d="M32 86H508" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([k, what, b, a], i) => {
      const y = 104 + i * 50, words = what.split(' '), mid = Math.ceil(words.length / 2)
      return <g key={k} fontSize="13" fill={ink}>
        <text x={54} y={y + 10} textAnchor="middle" fontSize="18" fontWeight="700">{k}</text>
        {what.length > 30 ? <><text x={90} y={y + 4}>{words.slice(0, mid).join(' ')}</text><text x={90} y={y + 22}>{words.slice(mid).join(' ')}</text></> : <text x={90} y={y + 12}>{what}</text>}
        <text x={425} y={y + 12} textAnchor="middle" fontSize="15" fontWeight="700">{b}</text><text x={488} y={y + 12} textAnchor="middle" fontSize="15" fontWeight="700">{a}</text>
      </g>
    })}
  </Diagram>
}
// Two flasks, each making a gas. Flask 1 open, flask 2 tightly bunged. Assessment view hides which is which in words.
function FlasksQuestion({ assessment }: { assessment: boolean }) {
  const base = 196
  return <Diagram viewBox="0 0 540 320" title={assessment
    ? 'Two flasks on balances, numbered 1 and 2. In each, a solid at the bottom reacts and makes bubbles of gas. Flask 1 has an open top. Flask 2 has a tight bung in its neck. Both balances read a question mark before and after.'
    : 'Two flasks on balances, numbered 1 and 2. In each, a solid reacts and makes gas. Flask 1 is open, so the gas escapes and its reading falls. Flask 2 has a tight bung, so the gas stays trapped and its reading stays the same.'}>
    {[130, 410].map((cx, i) => <g key={cx}>
      <Flask cx={cx} base={base} bung={i === 1}>
        <FlaskFill cx={cx} base={base} level={26} fill="#dfe8ee" line={muted} />
        <circle cx={cx - 20} cy={base - 14} r={7} fill="#9fb4c2" /><circle cx={cx + 18} cy={base - 10} r={6} fill="#9fb4c2" />
        {[[-16, -50], [12, -62], [-4, -86], [20, -40]].map(([dx, dy], k) => <circle key={k} cx={cx + dx} cy={base + dy} r={4.5} fill="white" stroke={glassLine} strokeWidth="1.6" />)}
      </Flask>
      {i === 0 && !assessment && <g><Arrow x1={cx} y1={base - 118} x2={cx} y2={base - 146} colour={amber} width={2.5} /><CO2 x={cx + 30} y={base - 158} r={-15} s={.85} /></g>}
      <Balance cx={cx} y={base} reading="? g" />
      <Num n={i + 1} x={cx} y={296} colour={ink} />
    </g>)}
    {!assessment && <g><text x={130} y={22} textAnchor="middle" fontSize="14" fontWeight="700" fill={amberInk}>gas escapes: reading falls</text><text x={410} y={22} textAnchor="middle" fontSize="14" fontWeight="700" fill={good}>gas trapped: same reading</text></g>}
  </Diagram>
}

export function GasMassVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'gasmass-rule': return <Ideas idea="rule" />
    case 'gasmass-open': return <Ideas idea="open" />
    case 'gasmass-two': return <Ideas idea="two" />
    case 'gasmass-mg-before': return <Magnesium stage="before" />
    case 'gasmass-mg-during': return <Magnesium stage="during" />
    case 'gasmass-mg-after': return <Magnesium stage="after" />
    case 'gasmass-mg-rule': return <Magnesium stage="rule" />
    case 'gasmass-cu-before': return <Copper stage="before" />
    case 'gasmass-cu-during': return <Copper stage="during" />
    case 'gasmass-cu-after': return <Copper stage="after" />
    case 'gasmass-cu-rule': return <Copper stage="rule" />
    case 'gasmass-worked-mg': return <WorkedPair kind="mg" />
    case 'gasmass-worked-cu': return <WorkedPair kind="cu" />
    case 'gasmass-data': return <DataTable />
    case 'gasmass-question-flasks': return <FlasksQuestion assessment={assessment} />
    default: return <Ideas idea="two" />
  }
}
