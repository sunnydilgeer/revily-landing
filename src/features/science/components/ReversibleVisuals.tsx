import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry Lesson 36: Reversible reactions and equilibrium. Original, code-native schematics; not to scale.
 * Focus ids start with 'rev-'.
 *
 * Colour code (same in every rev- diagram): reactants A and B = soft blue blobs, products C and D = soft coral blobs,
 * the ⇌ symbol and heat = amber, equilibrium / a good result = green, cooling = pale blue. Particle counts keep the
 * atoms honest: a flask starts with 4 A + 4 B, and each forward reaction turns one A + one B into one C + one D.
 * The only question view (a data table) shows the numbers alone, with no highlight and no conclusion words.
 */
const { ink, muted, protonFill, protonLine, electronLine, panelFill, panelLine, lightIso, darkIso, darkIsoLine } = atomPalette
const rFill = '#d6e9f8', rLine = electronLine, rInk = '#1d5787'
const pFill = '#fbdcd6', pLine = protonLine, pInk = '#8a332c'
const amber = '#d98a1c', amberInk = '#8a5a14', amberSoft = '#fdf0d8'
const coolFill = '#e3f1fb', coolLine = '#7fb3d9'
const glass = '#6f8798', glassFill = '#f5fafd', flame = '#f7c65a'
const red = '#c0504a'

function Diagram({ title, children, h = 300 }: { title: string; children: ReactNode; h?: number }) {
  const id = useId()
  return <div className="science-bio-model"><svg viewBox={`0 0 600 ${h}`} role="img" aria-labelledby={id}><title id={id}>{`${title} Original schematic, not to scale.`}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function T({ x, y, children, size = 14, bold = false, colour = ink, anchor = 'middle' }: { x: number; y: number; children: ReactNode; size?: number; bold?: boolean; colour?: string; anchor?: 'start' | 'middle' | 'end' }) {
  return <text x={x} y={y} fontSize={size} fontWeight={bold ? 700 : 400} fill={colour} textAnchor={anchor}>{children}</text>
}

// ---------- Pieces ----------
type L = 'A' | 'B' | 'C' | 'D'
const isR = (l: L) => l === 'A' || l === 'B'
/** A soft, slightly irregular blob with a letter: reactants blue, products coral. */
function P({ x, y, l, r = 15 }: { x: number; y: number; l: L; r?: number }) {
  const k = r / 15
  const d = `M${x} ${y - 15 * k}C${x + 9 * k} ${y - 15.5 * k} ${x + 15.5 * k} ${y - 8 * k} ${x + 15 * k} ${y + 1 * k}C${x + 14.5 * k} ${y + 10 * k} ${x + 8 * k} ${y + 15 * k} ${x - 1 * k} ${y + 15 * k}C${x - 10 * k} ${y + 15 * k} ${x - 15.5 * k} ${y + 8 * k} ${x - 15 * k} ${y - 1 * k}C${x - 14.5 * k} ${y - 10 * k} ${x - 8 * k} ${y - 14.5 * k} ${x} ${y - 15 * k}Z`
  return <g><path d={d} fill={isR(l) ? rFill : pFill} stroke={isR(l) ? rLine : pLine} strokeWidth="2" /><T x={x} y={y + 5 * k} size={Math.max(12, 14 * k)} bold colour={isR(l) ? rInk : pInk}>{l}</T></g>
}
/** Quadratic arrow from (x1,y1) via (cx,cy) to (x2,y2). */
function QArrow({ x1, y1, cx, cy, x2, y2, c = ink, w = 3, dash }: { x1: number; y1: number; cx: number; cy: number; x2: number; y2: number; c?: string; w?: number; dash?: string }) {
  const a = Math.atan2(y2 - cy, x2 - cx), h = 8 + w * 1.5
  const pt = (t: number) => `${(x2 - h * Math.cos(a + t)).toFixed(1)} ${(y2 - h * Math.sin(a + t)).toFixed(1)}`
  const ex = x2 - h * 0.6 * Math.cos(a), ey = y2 - h * 0.6 * Math.sin(a)
  return <g><path d={`M${x1} ${y1}Q${cx} ${cy} ${ex.toFixed(1)} ${ey.toFixed(1)}`} stroke={c} strokeWidth={w} fill="none" strokeDasharray={dash} /><path d={`M${x2} ${y2}L${pt(0.42)}L${pt(-0.42)}Z`} fill={c} stroke={c} strokeWidth="1.2" /></g>
}
const Arrow = ({ x1, y1, x2, y2, c, w }: { x1: number; y1: number; x2: number; y2: number; c?: string; w?: number }) => <QArrow x1={x1} y1={y1} cx={(x1 + x2) / 2} cy={(y1 + y2) / 2} x2={x2} y2={y2} c={c} w={w} />
/** The ⇌ sign drawn as two half-arrows. */
function Harpoons({ x, y, w = 56, c = amber, sw = 3 }: { x: number; y: number; w?: number; c?: string; sw?: number }) {
  return <g stroke={c} strokeWidth={sw} fill="none">
    <path d={`M${x - w / 2} ${y - 5}H${x + w / 2}L${x + w / 2 - 11} ${y - 14}`} />
    <path d={`M${x + w / 2} ${y + 5}H${x - w / 2}L${x - w / 2 + 11} ${y + 14}`} />
  </g>
}
function Plus({ x, y, s = 20 }: { x: number; y: number; s?: number }) { return <T x={x} y={y + s * 0.35} size={s} bold colour={muted}>+</T> }
function Flame({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 0c-14 -2 -18 -16 -10 -28c2 7 6 9 8 9c-2 -10 3 -18 10 -24c2 14 12 18 8 32c-2 7 -8 11 -16 11z" fill={flame} stroke={amber} strokeWidth="2" />
}
function Drop({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -11C4 -5 7 -1 7 3C7 7 4 10 0 10C-4 10 -7 7 -7 3C-7 -1 -4 -5 0 -11Z" fill={coolFill} stroke={coolLine} strokeWidth="1.8" />
}
function Ice({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 14} ${y - 12}Q${x - 15} ${y - 15} ${x - 11} ${y - 15}H${x + 11}Q${x + 15} ${y - 15} ${x + 14} ${y - 11}L${x + 13} ${y + 11}Q${x + 13} ${y + 15} ${x + 9} ${y + 14}H${x - 11}Q${x - 15} ${y + 14} ${x - 14} ${y + 10}Z`} fill={coolFill} stroke={coolLine} strokeWidth="2" /><path d={`M${x - 8} ${y - 8}L${x - 3} ${y - 10}`} stroke="white" strokeWidth="3" /></g>
}
function Tick({ x, y }: { x: number; y: number }) {
  return <g><circle cx={x} cy={y} r="14" fill={lightIso} stroke={darkIso} strokeWidth="2" /><path d={`M${x - 6} ${y}L${x - 1} ${y + 5}L${x + 7} ${y - 5}`} stroke={darkIsoLine} strokeWidth="3" fill="none" /></g>
}
function Cross({ x, y }: { x: number; y: number }) {
  return <g><circle cx={x} cy={y} r="14" fill="#fbe1de" stroke={red} strokeWidth="2" /><path d={`M${x - 5} ${y - 5}L${x + 5} ${y + 5}M${x - 5} ${y + 5}L${x + 5} ${y - 5}`} stroke={red} strokeWidth="3" /></g>
}
function Tag({ x, y, text, c = darkIso, ink2 = darkIsoLine, fill = lightIso }: { x: number; y: number; text: string; c?: string; ink2?: string; fill?: string }) {
  const w = text.length * 8.4 + 22
  return <g><rect x={x - w / 2} y={y - 15} width={w} height={30} rx="15" fill={fill} stroke={c} strokeWidth="2" /><T x={x} y={y + 5} size={15} bold colour={ink2}>{text}</T></g>
}

// ---------- A sealed conical flask holding particles ----------
// Local frame: neck top at (0, 0), base at y = 150, body about 170 wide at the bottom.
const SLOTS: [number, number][] = [[-54, 128], [-18, 131], [18, 128], [54, 131], [-34, 94], [2, 97], [38, 93], [2, 62]]
/** Particles for a flask that started with 4 A + 4 B after `x` forward reactions. */
function mix(x: number): L[] {
  const out: L[] = []
  for (let i = 0; i < 4; i++) { out.push(i < 4 - x ? 'A' : 'C'); out.push(i < 4 - x ? 'B' : 'D') }
  return out
}
function Flask({ x, y, s = 1, parts, sealed = true }: { x: number; y: number; s?: number; parts: L[]; sealed?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-18 0V38C-18 46 -22 50 -30 60L-80 124C-90 138 -82 152 -64 152H64C82 152 90 138 80 124L30 60C22 50 18 46 18 38V0" fill={glassFill} stroke={glass} strokeWidth={3 / s} />
    {sealed && <path d="M-15 -16Q-16 -20 -12 -20H12Q16 -20 15 -16L13 6Q13 9 10 9H-10Q-13 9 -13 6Z" fill="#b99278" stroke="#7f5f4a" strokeWidth={2 / s} />}
    {parts.map((l, i) => <P key={i} x={SLOTS[i][0]} y={SLOTS[i][1]} l={l} />)}
  </g>
}

// ---------- Section: what is a reversible reaction ----------
function Side({ x, y, ls, name }: { x: number; y: number; ls: [L, L]; name: string }) {
  const r = isR(ls[0])
  return <g>
    <path d={`M${x - 80} ${y - 36}Q${x - 82} ${y - 50} ${x - 66} ${y - 50}H${x + 66}Q${x + 82} ${y - 50} ${x + 80} ${y - 36}L${x + 82} ${y + 38}Q${x + 82} ${y + 50} ${x + 68} ${y + 50}H${x - 68}Q${x - 82} ${y + 50} ${x - 80} ${y + 38}Z`} fill={r ? '#eef6fc' : '#fdf1ee'} stroke={r ? rLine : pLine} strokeWidth="2" />
    <P x={x - 38} y={y} l={ls[0]} r={20} /><Plus x={x} y={y} /><P x={x + 38} y={y} l={ls[1]} r={20} />
    <T x={x} y={y + 76} size={16} bold colour={r ? rInk : pInk}>{name}</T>
  </g>
}
function AB() {
  return <Diagram title="A reversible reaction. Reactants A and B react to make products C and D, shown by an arrow along the top. C and D can also react to make A and B again, shown by an arrow along the bottom.">
    <Side x={120} y={150} ls={['A', 'B']} name="reactants" />
    <Side x={480} y={150} ls={['C', 'D']} name="products" />
    <QArrow x1={210} y1={112} cx={300} cy={52} x2={392} y2={110} c={ink} />
    <QArrow x1={390} y1={190} cx={300} cy={250} x2={208} y2={192} c={ink} />
    <T x={300} y={66} size={15} bold>forwards</T>
    <T x={300} y={248} size={15} bold>backwards</T>
  </Diagram>
}
function Equation({ y, cx = 300, r = 22, gap = 1, harp = amber }: { y: number; cx?: number; r?: number; gap?: number; harp?: string }) {
  const u = 52 * gap
  return <g>
    <P x={cx - 3.3 * u} y={y} l="A" r={r} /><Plus x={cx - 2.55 * u} y={y} s={22 * gap} /><P x={cx - 1.8 * u} y={y} l="B" r={r} />
    <Harpoons x={cx} y={y} w={62 * gap} c={harp} />
    <P x={cx + 1.8 * u} y={y} l="C" r={r} /><Plus x={cx + 2.55 * u} y={y} s={22 * gap} /><P x={cx + 3.3 * u} y={y} l="D" r={r} />
  </g>
}
function ArrowFrame() {
  return <Diagram title="The equation A plus B, reversible arrow, C plus D. The reversible arrow symbol is highlighted. A curved arrow above, from A and B to C and D, is the forward reaction. A curved arrow below, from C and D back to A and B, is the backward reaction.">
    <Equation y={150} />
    <QArrow x1={140} y1={112} cx={300} cy={30} x2={458} y2={112} c={rLine} />
    <QArrow x1={458} y1={190} cx={300} cy={272} x2={140} y2={190} c={pLine} />
    <T x={300} y={62} size={15} bold colour={rInk}>forward reaction</T>
    <T x={300} y={250} size={15} bold colour={pInk}>backward reaction</T>
    <T x={300} y={120} size={13} bold colour={amberInk}>⇌ both ways</T>
  </Diagram>
}

// ---------- Copper sulfate ----------
function Dish({ x, y, kind }: { x: number; y: number; kind: 'blue' | 'white' }) {
  const crystals: [number, number, number][] = [[-38, 4, 0], [-18, 0, 20], [4, 2, -15], [26, 3, 10], [42, 8, 25], [-28, -10, 35], [-6, -12, -30], [16, -9, 5]]
  return <g>
    <ellipse cx={x} cy={y} rx={66} ry={11} fill="#eef3f6" stroke={glass} strokeWidth="2.5" />
    {kind === 'blue'
      ? crystals.map(([cx, cy, rot], i) => <path key={i} transform={`translate(${x + cx} ${y + cy}) rotate(${rot})`} d="M-9 -3L-3 -10L8 -7L10 3L2 9L-8 6Z" fill="#6aa8dc" stroke="#2f6fa6" strokeWidth="1.8" />)
      : <path d={`M${x - 52} ${y + 6}C${x - 38} ${y - 12} ${x - 18} ${y - 18} ${x} ${y - 16}C${x + 18} ${y - 18} ${x + 38} ${y - 12} ${x + 52} ${y + 6}Z`} fill="#fafbfc" stroke="#9aa6b0" strokeWidth="2" />}
    {kind === 'white' && [[-22, -4], [-4, -8], [14, -6], [28, 0], [-32, 2], [4, 0]].map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r="1.6" fill="#c3ccd3" />)}
    <path d={`M${x - 66} ${y}Q${x - 58} ${y + 40} ${x} ${y + 42}Q${x + 58} ${y + 40} ${x + 66} ${y}Q${x + 40} ${y + 14} ${x} ${y + 12}Q${x - 40} ${y + 14} ${x - 66} ${y}Z`} fill="white" stroke={glass} strokeWidth="3" />
  </g>
}
function Copper({ energy = false }: { energy?: boolean }) {
  const title = energy
    ? 'Blue hydrated copper sulfate on the left and white anhydrous copper sulfate plus water on the right. The top arrow, heating, is endothermic: heat is taken in. The bottom arrow, adding water, is exothermic: heat is given out and the powder gets warm.'
    : 'Blue hydrated copper sulfate crystals on the left. An arrow labelled heat goes to the right, to white anhydrous copper sulfate powder plus water. An arrow labelled add water goes back to the left.'
  return <Diagram title={title} h={energy ? 330 : 300}>
    <Dish x={110} y={170} kind="blue" />
    <T x={110} y={238} size={14} bold colour="#2f6fa6">blue hydrated</T>
    <T x={110} y={256} size={14} bold colour="#2f6fa6">copper sulfate</T>
    <Dish x={470} y={170} kind="white" />
    <Drop x={548} y={130} /><Drop x={566} y={150} s={0.8} /><Drop x={540} y={100} s={0.7} />
    <T x={470} y={238} size={14} bold colour="#56636d">white anhydrous</T>
    <T x={470} y={256} size={14} bold colour="#56636d">copper sulfate + water</T>
    <QArrow x1={200} y1={128} cx={290} cy={82} x2={382} y2={128} c={amber} w={3.5} />
    <QArrow x1={382} y1={200} cx={290} cy={246} x2={200} y2={200} c={coolLine} w={3.5} />
    {energy ? <g>
      <T x={290} y={72} size={15} bold colour={amberInk}>heat: endothermic</T>
      <T x={290} y={90} size={13} colour={amberInk}>(heat taken in)</T>
      <T x={290} y={290} size={15} bold colour={pInk}>add water: exothermic</T>
      <T x={290} y={310} size={13} colour={pInk}>(heat given out, powder gets warm)</T>
    </g> : <g>
      <Flame x={260} y={70} s={0.7} />
      <T x={300} y={70} size={16} bold colour={amberInk}>heat</T>
      <Drop x={226} y={264} s={1.1} />
      <T x={300} y={268} size={16} bold colour="#2f6fa6">add water</T>
    </g>}
  </Diagram>
}

// ---------- Section: equilibrium ----------
function RateArrows({ fwd, back, fLabel, bLabel, x = 330, dashedBack = false }: { fwd: number; back: number; fLabel: string; bLabel: string; x?: number; dashedBack?: boolean }) {
  return <g>
    <T x={x} y={92} size={15} bold colour={rInk} anchor="start">{fLabel}</T>
    {fwd > 0 && <Arrow x1={x} y1={112} x2={x + fwd} y2={112} c={rLine} w={6} />}
    <T x={x} y={180} size={15} bold colour={dashedBack ? muted : pInk} anchor="start">{bLabel}</T>
    {back > 0 && <Arrow x1={x + back} y1={200} x2={x} y2={200} c={pLine} w={6} />}
    {dashedBack && <path d={`M${x} 200H${x + 60}`} stroke={muted} strokeWidth="2.5" strokeDasharray="4 7" />}
  </g>
}
function EqStage({ stage }: { stage: 'start' | 'middle' | 'balance' }) {
  const titles = {
    start: 'A sealed flask with only reactants: four A and four B. A long, thick forward arrow shows the forward reaction is fast. There is no backward reaction yet.',
    middle: 'The sealed flask now has two A, two B, two C and two D. The forward arrow is shorter: the forward reaction is slowing. A backward arrow has appeared and is growing: the backward reaction is speeding up.',
    balance: 'The sealed flask has one A, one B, three C and three D. The forward and backward arrows are the same length: the two reactions go at the same rate. This is equilibrium.',
  }
  const x = { start: 0, middle: 2, balance: 3 }[stage]
  return <Diagram title={titles[stage]} h={300}>
    <Flask x={160} y={70} parts={mix(x)} />
    <T x={160} y={256} size={14} colour={muted}>sealed flask</T>
    {stage === 'start' && <RateArrows fwd={230} back={0} fLabel="forward: fast" bLabel="backward: none yet" dashedBack />}
    {stage === 'middle' && <RateArrows fwd={150} back={90} fLabel="forward: slowing" bLabel="backward: speeding up" />}
    {stage === 'balance' && <g>
      <RateArrows fwd={120} back={120} fLabel="forward" bLabel="backward" />
      <path d="M470 108Q486 156 470 204" stroke={darkIso} strokeWidth="2" fill="none" strokeDasharray="4 5" />
      <T x={494} y={160} size={15} bold colour={darkIsoLine} anchor="start">same</T>
      <T x={494} y={178} size={15} bold colour={darkIsoLine} anchor="start">rate</T>
      <Tag x={420} y={254} text="equilibrium" />
    </g>}
  </Diagram>
}
function Amounts() {
  const col = (cx: number, x: number, cap: string) => <g>
    <Flask x={cx} y={40} s={0.72} parts={mix(x)} />
    <Harpoons x={cx} y={172} w={44} c={darkIso} sw={2.5} />
    <T x={cx} y={206} size={14} bold colour={darkIsoLine}>equilibrium</T>
    <T x={cx} y={226} size={13} colour={muted}>{cap}</T>
  </g>
  return <Diagram title="Three sealed flasks, all at equilibrium. The first has mostly reactants, the second has equal amounts, the third has mostly products. At equilibrium the amounts are not changing, but they are not always equal." h={290}>
    {col(100, 1, 'mostly reactants')}
    {col(300, 2, 'equal')}
    {col(500, 3, 'mostly products')}
    <rect x={110} y={244} width={380} height={34} rx="17" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <T x={300} y={266} size={15} bold>amounts not changing (not always equal)</T>
  </Diagram>
}
function Beaker({ x, y }: { x: number; y: number }) {
  return <path d={`M${x - 78} ${y - 4}Q${x - 70} ${y - 4} ${x - 70} ${y + 6}V${y + 126}Q${x - 70} ${y + 140} ${x - 56} ${y + 140}H${x + 56}Q${x + 70} ${y + 140} ${x + 70} ${y + 126}V${y}`} fill={glassFill} stroke={glass} strokeWidth="3" />
}
function Closed() {
  return <Diagram title="Left: a sealed flask with a stopper. Nothing can escape or get in, so it is a closed system and can reach equilibrium. Right: an open beaker with gas particles leaving from the top. Gas escapes, so it is not a closed system." h={320}>
    <Flask x={150} y={60} parts={mix(2)} />
    <Tick x={150} y={236} />
    <T x={150} y={276} size={15} bold colour={darkIsoLine}>closed system:</T>
    <T x={150} y={296} size={14} colour={ink}>nothing escapes or gets in</T>
    <Beaker x={450} y={80} />
    {([[410, 196, 'A'], [446, 200, 'B'], [484, 194, 'C'], [428, 164, 'A'], [470, 160, 'B']] as [number, number, L][]).map(([px, py, l], i) => <P key={i} x={px} y={py} l={l} />)}
    <P x={430} y={50} l="D" /><P x={482} y={26} l="C" />
    <QArrow x1={432} y1={96} cx={424} cy={84} x2={430} y2={72} c={muted} w={2.5} />
    <QArrow x1={476} y1={96} cx={486} cy={72} x2={482} y2={48} c={muted} w={2.5} />
    <Cross x={450} y={236} />
    <T x={450} y={276} size={15} bold colour={red}>open:</T>
    <T x={450} y={296} size={14} colour={ink}>gas escapes</T>
  </Diagram>
}

// ---------- Section: direction ----------
function Sign({ x, y, w, dir, lines, c, fill, ink2 }: { x: number; y: number; w: number; dir: 'r' | 'l'; lines: string[]; c: string; fill: string; ink2: string }) {
  const h = 52, tip = 22
  const d = dir === 'r'
    ? `M${x - w / 2} ${y - h / 2 + 6}Q${x - w / 2} ${y - h / 2} ${x - w / 2 + 6} ${y - h / 2}H${x + w / 2 - tip}L${x + w / 2} ${y}L${x + w / 2 - tip} ${y + h / 2}H${x - w / 2 + 6}Q${x - w / 2} ${y + h / 2} ${x - w / 2} ${y + h / 2 - 6}Z`
    : `M${x + w / 2} ${y - h / 2 + 6}Q${x + w / 2} ${y - h / 2} ${x + w / 2 - 6} ${y - h / 2}H${x - w / 2 + tip}L${x - w / 2} ${y}L${x - w / 2 + tip} ${y + h / 2}H${x + w / 2 - 6}Q${x + w / 2} ${y + h / 2} ${x + w / 2} ${y + h / 2 - 6}Z`
  const off = dir === 'r' ? -tip / 3 : tip / 3
  return <g><path d={d} fill={fill} stroke={c} strokeWidth="2" />{lines.map((l, i) => <T key={i} x={x + off} y={y - 4 + i * 18} size={14} bold colour={ink2}>{l}</T>)}</g>
}
function Direction() {
  return <Diagram title="Two sealed flasks at equilibrium. The left flask has more products, C and D, so the reaction is going in the forwards direction. The right flask has more reactants, A and B, so the reaction is going in the backwards direction." h={300}>
    <Flask x={150} y={40} parts={mix(3)} />
    <Sign x={150} y={240} w={210} dir="r" lines={['more products:', 'going forwards']} c={pLine} fill="#fdf1ee" ink2={pInk} />
    <Flask x={450} y={40} parts={mix(1)} />
    <Sign x={450} y={240} w={210} dir="l" lines={['more reactants:', 'going backwards']} c={rLine} fill="#eef6fc" ink2={rInk} />
  </Diagram>
}
function Thermometer({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><rect x={-7} y={-40} width={14} height={70} rx="7" fill="white" stroke={glass} strokeWidth="2.5" /><rect x={-3} y={-10} width={6} height={40} fill={protonFill} /><circle cx={0} cy={36} r="11" fill={protonFill} stroke={glass} strokeWidth="2.5" /></g>
}
function Gauge({ x, y }: { x: number; y: number }) {
  return <g><circle cx={x} cy={y} r="30" fill="white" stroke={glass} strokeWidth="3" /><path d={`M${x - 20} ${y + 8}A21 21 0 0 1 ${x + 20} ${y + 8}`} stroke={panelLine} strokeWidth="4" fill="none" /><path d={`M${x} ${y + 4}L${x + 13} ${y - 14}`} stroke={ink} strokeWidth="3" /><circle cx={x} cy={y + 4} r="4" fill={ink} /><path d={`M${x - 6} ${y + 30}V${y + 40}H${x + 6}V${y + 30}`} fill="white" stroke={glass} strokeWidth="2.5" /></g>
}
function SmallBeaker({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 30} ${y - 30}V${y + 24}Q${x - 30} ${y + 32} ${x - 22} ${y + 32}H${x + 22}Q${x + 30} ${y + 32} ${x + 30} ${y + 24}V${y - 30}`} fill={glassFill} stroke={glass} strokeWidth="2.5" />
    {[[-16, 16], [0, 8], [16, 18], [-8, -6], [12, -2], [-18, 0], [4, 22]].map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r="4.5" fill={rFill} stroke={rLine} strokeWidth="1.5" />)}</g>
}
function Conditions() {
  return <Diagram title="The equation A plus B, reversible arrow, C plus D, with three conditions around it: temperature, shown by a thermometer; pressure, shown by a gauge; and concentration, shown by a beaker of particles. Changing the conditions can change the direction." h={300}>
    <Equation y={70} r={20} gap={0.9} />
    <rect x={62} y={126} width={140} height={128} rx="18" fill={amberSoft} stroke={amber} strokeWidth="2" />
    <Thermometer x={132} y={176} s={0.8} />
    <T x={132} y={240} size={14} bold colour={amberInk}>temperature</T>
    <rect x={230} y={126} width={140} height={128} rx="18" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <Gauge x={300} y={172} />
    <T x={300} y={240} size={14} bold>pressure</T>
    <rect x={398} y={126} width={140} height={128} rx="18" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <SmallBeaker x={468} y={176} />
    <T x={468} y={240} size={14} bold>concentration</T>
    <T x={300} y={286} size={15} bold>change the conditions to change the direction</T>
  </Diagram>
}
function Tube({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y}) rotate(-12)`}>
    <path d="M-16 -70V40Q-16 58 0 58Q16 58 16 40V-70" fill={glassFill} stroke={glass} strokeWidth="3" />
    <path d="M-14 30Q-14 56 0 56Q14 56 14 30Q6 22 0 26Q-8 22 -14 30Z" fill="white" stroke="#9aa6b0" strokeWidth="1.8" />
  </g>
}
function Puffs({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 70} ${y + 18}C${x - 92} ${y + 14} ${x - 88} ${y - 18} ${x - 64} ${y - 16}C${x - 60} ${y - 42} ${x - 20} ${y - 46} ${x - 8} ${y - 26}C${x + 8} ${y - 50} ${x + 56} ${y - 40} ${x + 52} ${y - 12}C${x + 80} ${y - 10} ${x + 82} ${y + 22} ${x + 58} ${y + 24}C${x + 40} ${y + 42} ${x - 50} ${y + 42} ${x - 70} ${y + 18}Z`} fill="#f4f7f9" stroke="#a9b6bf" strokeWidth="2" strokeDasharray="7 5" />
    <T x={x - 4} y={y - 4} size={13} bold>ammonia</T>
    <T x={x - 4} y={y + 14} size={13} bold>+ hydrogen chloride</T>
  </g>
}
function Ammonium() {
  return <Diagram title="Ammonium chloride, reversible arrow, ammonia plus hydrogen chloride, with heat above the forward arrow and cool below the backward arrow. White solid ammonium chloride in a test tube is heated and breaks down into two gases. When cooled, the gases react to make the white solid again." h={330}>
    <T x={132} y={42} size={15} bold>ammonium chloride</T>
    <Harpoons x={265} y={36} w={62} />
    <T x={265} y={16} size={13} bold colour={amberInk}>heat</T>
    <T x={265} y={66} size={13} bold colour="#2f6fa6">cool</T>
    <T x={430} y={42} size={15} bold>ammonia + hydrogen chloride</T>
    <Tube x={110} y={190} />
    <T x={110} y={292} size={14} bold>white solid</T>
    <Puffs x={478} y={190} />
    <QArrow x1={176} y1={156} cx={280} cy={118} x2={384} y2={156} c={amber} w={3.5} />
    <Flame x={278} y={152} s={0.75} />
    <T x={280} y={178} size={14} bold colour={amberInk}>forwards when heated</T>
    <QArrow x1={384} y1={236} cx={280} cy={276} x2={176} y2={236} c={coolLine} w={3.5} />
    <Ice x={280} y={228} />
    <T x={280} y={306} size={14} bold colour="#2f6fa6">backwards when cooled</T>
  </Diagram>
}

// ---------- Section: energy ----------
function Energy() {
  return <Diagram title="A plus B, reversible arrow, C plus D. The forward reaction, shown by an arrow above, is endothermic: it takes in heat. The backward reaction, shown by an arrow below, is exothermic: it gives out heat." h={320}>
    <Equation y={160} />
    <QArrow x1={140} y1={122} cx={300} cy={52} x2={458} y2={122} c={rLine} />
    <QArrow x1={458} y1={198} cx={300} cy={268} x2={140} y2={198} c={pLine} />
    {/* heat going in to the forward reaction */}
    <path d="M300 24q8 7 0 14t0 14t0 14" stroke={amber} strokeWidth="3" fill="none" transform="translate(0 -6)" />
    <path d="M293 58L300 72L307 58" stroke={amber} strokeWidth="3" fill="none" />
    <T x={314} y={34} size={15} bold colour={rInk} anchor="start">forward: endothermic</T>
    <T x={314} y={52} size={13} colour={amberInk} anchor="start">takes in heat</T>
    {/* heat coming out of the backward reaction */}
    <path d="M300 248q8 7 0 14t0 14t0 14" stroke={amber} strokeWidth="3" fill="none" />
    <path d="M293 284L300 298L307 284" stroke={amber} strokeWidth="3" fill="none" />
    <T x={314} y={272} size={15} bold colour={pInk} anchor="start">backward: exothermic</T>
    <T x={314} y={290} size={13} colour={amberInk} anchor="start">gives out heat</T>
  </Diagram>
}
function EnergyEqual() {
  const U = 24, G = 4, base = 232, bw = 100
  const stack = (x: number, label: string, sub: string, c: string, ink2: string) => <g>
    {Array.from({ length: 5 }, (_, i) => <rect key={i} x={x} y={base - (i + 1) * (U + G) + G} width={bw} height={U} rx="6" fill={amberSoft} stroke={amber} strokeWidth="1.8" />)}
    <path d={`M${x - 8} ${base + 3}H${x + bw + 8}`} stroke={ink} strokeWidth="2.5" />
    <T x={x + bw / 2} y={base + 26} size={15} bold colour={ink2}>{label}</T>
    <T x={x + bw / 2} y={base + 45} size={14} colour={c}>{sub}</T>
  </g>
  return <Diagram title="Two equal stacks of energy blocks with an equals sign between them. The energy taken in by the forward reaction is the same as the energy given out by the backward reaction." h={300}>
    {stack(110, 'energy taken in', 'forward reaction', rInk, rInk)}
    <T x={300} y={170} size={40} bold colour={darkIsoLine}>=</T>
    {stack(390, 'energy given out', 'backward reaction', pInk, pInk)}
    <T x={300} y={40} size={15} bold>the same amount both ways</T>
  </Diagram>
}

// ---------- Question visual ----------
function QuestionData() {
  const t = [0, 10, 20, 30, 40, 50, 60], m = ['0', '2.0', '3.0', '3.4', '3.5', '3.5', '3.5']
  const x0 = 20, lw = 168, cw = 56, rh = 38, y = 76
  return <Diagram title="A table headed sealed flask. Time in seconds: 0, 10, 20, 30, 40, 50, 60. Mass of product in grams: 0, 2.0, 3.0, 3.4, 3.5, 3.5, 3.5." h={190}>
    <Flask x={52} y={18} s={0.3} parts={[]} />
    <T x={84} y={52} size={16} bold anchor="start">Sealed flask</T>
    <rect x={x0} y={y} width={lw + cw * 7} height={rh * 2} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <path d={`M${x0} ${y + rh}H${x0 + lw + cw * 7}`} stroke={panelLine} strokeWidth="1.2" />
    {t.map((_, i) => <path key={i} d={`M${x0 + lw + cw * i} ${y}V${y + rh * 2}`} stroke={panelLine} strokeWidth="1.2" />)}
    <T x={x0 + 12} y={y + 24} size={14} bold anchor="start">Time (s)</T>
    <T x={x0 + 12} y={y + rh + 24} size={14} bold anchor="start">Mass of product (g)</T>
    {t.map((v, i) => <T key={`t${i}`} x={x0 + lw + cw * i + cw / 2} y={y + 24} size={15}>{v}</T>)}
    {m.map((v, i) => <T key={`m${i}`} x={x0 + lw + cw * i + cw / 2} y={y + rh + 24} size={15}>{v}</T>)}
  </Diagram>
}

export function ReversibleVisual({ focus }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'rev-ab': return <AB />
    case 'rev-arrow': return <ArrowFrame />
    case 'rev-copper': return <Copper />
    case 'rev-eq-start': return <EqStage stage="start" />
    case 'rev-eq-middle': return <EqStage stage="middle" />
    case 'rev-eq-balance': return <EqStage stage="balance" />
    case 'rev-eq-amounts': return <Amounts />
    case 'rev-closed': return <Closed />
    case 'rev-direction': return <Direction />
    case 'rev-conditions': return <Conditions />
    case 'rev-ammonium': return <Ammonium />
    case 'rev-energy': return <Energy />
    case 'rev-energy-equal': return <EnergyEqual />
    case 'rev-copper-energy': return <Copper energy />
    case 'rev-question-data': return <QuestionData />
    default: return <AB />
  }
}
