import { useId, type ReactNode } from 'react'
import { Arrow } from './InfectionVisuals'
import { atomPalette, Electron, Nucleus } from './AtomVisuals'

/*
 * Chemistry C4, a lesson only some students get (Chemistry Lesson 25H): redox and ionic equations. Original, code-native
 * schematics; not to scale. Focus ids start with 'hredox-'.
 *
 * Same visual language as the ions lesson (IonVisuals.tsx) and the moles lesson (HigherMolesVisuals.tsx): atoms on thin
 * shells with blue electrons, positive ions on a pale coral wash and negative ions on a pale blue wash, in square brackets.
 * Electrons written in equations (e⁻) are always electron blue. Amber marks what the frame is about; red crosses mark
 * spectator ions. In the displacement drawings the ions take the colour of their solution, as in the reactions-of-metals
 * lesson (MetalReactionVisuals.tsx): Cu²⁺ blue, Fe²⁺ pale green, copper metal brown. Each teaching section keeps one
 * drawing on screen and lights one step at a time; the last frame shows it all.
 * Every equation drawn is balanced for atoms and charge (checked in the storyboard).
 */
const { ink, muted, electronLine, shellLine, space, spaceLine, glow, protonLine, panelFill, panelLine } = atomPalette
const amber = '#d98a1c', amberSoft = '#fdf0dc', amberInk = '#8a5a14'
const bad = '#c0504a', badSoft = '#fbe6e4', good = '#3f8a5f'
const posFill = glow, posLine = protonLine, posInk = '#8a332c'
const negFill = '#e4f0f9', negLine = electronLine, negInk = '#1d5787'
const faded = 0.3
const r1 = (n: number) => Math.round(n * 10) / 10

function Diagram({ title, children, viewBox = '0 0 540 320', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
/** A numbered step badge: filled when it is the step being taught, an outline otherwise. */
function Num({ n, x, y, on = true, colour = amber }: { n: number; x: number; y: number; on?: boolean; colour?: string }) {
  return <g><circle cx={x} cy={y} r="12" fill={on ? colour : 'white'} stroke={on ? colour : muted} strokeWidth="2" />
    <text x={x} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill={on ? 'white' : muted}>{n}</text></g>
}
function Chip({ x, y, w, children, tone = 'hot', h = 28, size = 14 }: { x: number; y: number; w: number; children: ReactNode; tone?: 'hot' | 'plain' | 'pos' | 'neg' | 'good'; h?: number; size?: number }) {
  const [fill, line, text] = { hot: [amberSoft, amber, amberInk], plain: [panelFill, panelLine, ink], pos: [posFill, posLine, posInk], neg: [negFill, negLine, negInk], good: ['#e6f3ea', good, '#2b6343'] }[tone]
  return <g><rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="9" fill={fill} stroke={line} strokeWidth={tone === 'plain' ? 1.5 : 2} />
    <text x={x} y={y + size * .35} textAnchor="middle" fontSize={size} fontWeight="700" fill={text}>{children}</text></g>
}

// ---------- Equations laid out token by token, so tokens can be crossed out, coloured or tallied ----------
/** Rough advance widths (em) for the bold sans used in the app; good enough to centre and cross out tokens. */
function charW(ch: string) {
  if (/[²³¹⁰-₟]/.test(ch)) return .5
  if (ch === 'M') return .99
  if (/[NOQ]/.test(ch)) return .86
  if (/[A-Z]/.test(ch)) return .76
  if (/[il]/.test(ch)) return .34
  if (/[a-z]/.test(ch)) return .69
  if (/[0-9]/.test(ch)) return .7
  if (/[+→=−×]/.test(ch)) return .84
  return .6
}
const tokenW = (t: string, size: number) => [...t].reduce((s, ch) => s + charW(ch), 0) * size
type EqProps = { x: number; y: number; eq: string; size?: number; cross?: number[]; hot?: number[]; colour?: string; anchor?: 'middle' | 'start'; tally?: [ReactNode, ReactNode]; tallyOk?: boolean }
/** An equation written as space-separated tokens. Tokens ending in e⁻ are electron blue; `cross` strikes tokens out. */
function Eq({ x, y, eq, size = 20, cross = [], hot = [], colour = ink, anchor = 'middle', tally, tallyOk }: EqProps) {
  const tokens = eq.split(' '), gap = size * .45
  const ws = tokens.map(t => tokenW(t, size))
  const total = ws.reduce((a, b) => a + b, 0) + gap * (tokens.length - 1)
  let cx = anchor === 'middle' ? x - total / 2 : x
  const xs = ws.map(w => { const at = cx; cx += w + gap; return at })
  const arrow = tokens.indexOf('→')
  const centre = (from: number, to: number) => (xs[from] + xs[to] + ws[to]) / 2
  return <g>
    {tokens.map((t, i) => {
      const fill = /e⁻$/.test(t) ? electronLine : t === '→' || t === '+' ? muted : hot.includes(i) ? amberInk : colour
      return <text key={i} x={r1(xs[i])} y={y} fontSize={size} fontWeight="700" fill={fill}>{t}</text>
    })}
    {cross.map(i => <path key={`x${i}`} d={`M${r1(xs[i] - 3)} ${r1(y + 4)}L${r1(xs[i] + ws[i] + 3)} ${r1(y - size * .82)}`} stroke={bad} strokeWidth="2.6" />)}
    {tally && arrow > 0 && <g fontSize="13" textAnchor="middle" fontWeight="600" fill={tallyOk ? good : muted}>
      <text x={r1(centre(0, arrow - 1))} y={y + 24}>{tally[0]}</text>
      <text x={r1(centre(arrow + 1, tokens.length - 1))} y={y + 24}>{tally[1]}</text>
    </g>}
  </g>
}

/** A dashed curved arrow (quadratic) with an open head at `to`. */
function ArcArrow({ from, ctrl, to, colour = amber }: { from: [number, number]; ctrl: [number, number]; to: [number, number]; colour?: string }) {
  const a = Math.atan2(to[1] - ctrl[1], to[0] - ctrl[0]), h = 12
  const wing = (t: number) => `${r1(to[0] - h * Math.cos(a + t))} ${r1(to[1] - h * Math.sin(a + t))}`
  return <g fill="none" stroke={colour} strokeWidth="2.4">
    <path d={`M${from[0]} ${from[1]}Q${ctrl[0]} ${ctrl[1]} ${to[0]} ${to[1]}`} strokeDasharray="6 5" />
    <path d={`M${wing(.45)}L${to[0]} ${to[1]}L${wing(-.45)}`} />
  </g>
}

// ---------- Atoms and ions on shells (as in the ions lesson) ----------
const ELEMENTS = { Mg: { z: 12, n: 12 }, O: { z: 8, n: 8 } } as const
const START = [180, -90, -45]
const onCircle = (cx: number, cy: number, r: number, deg: number): [number, number] => [r1(cx + Math.cos(deg * Math.PI / 180) * r), r1(cy + Math.sin(deg * Math.PI / 180) * r)]
type Tone = 'atom' | 'pos' | 'neg'
/**
 * One particle. `shells` gives the electrons drawn on each shell. `ghost` adds hollow dashed spots for electrons that
 * have left the outer shell; `fresh` rings that many outer electrons in amber (electrons just gained).
 */
function Particle({ cx, cy, sym, shells, radii, tone = 'atom', ghost = 0, ghostStart = -45, fresh = [], charge, outerHot = false }: {
  cx: number; cy: number; sym: keyof typeof ELEMENTS; shells: number[]; radii: number[]; tone?: Tone; ghost?: number; ghostStart?: number; fresh?: number[]; charge?: string; outerHot?: boolean
}) {
  const er = 5.5, el = ELEMENTS[sym], total = el.z + el.n
  const nr = Math.min(er * 1.25, (radii[0] - er - 3) / (1.1 * Math.sqrt(total - .7) + 1.7))
  const allShells = ghost ? radii.length : shells.length
  const outer = radii[allShells - 1], cloud = outer + er + 7, half = cloud + 8, last = shells.length - 1
  const [fill, line] = tone === 'pos' ? [posFill, posLine] : tone === 'neg' ? [negFill, negLine] : [space, spaceLine]
  return <g>
    <circle cx={cx} cy={cy} r={r1(cloud)} fill={fill} stroke={line} strokeWidth="1.5" />
    {shells.map((_, i) => <circle key={`s${i}`} cx={cx} cy={cy} r={radii[i]} fill="none" stroke={outerHot && i === last ? electronLine : shellLine} strokeWidth={outerHot && i === last ? 2.6 : 1.8} />)}
    {ghost > 0 && <g>
      <circle cx={cx} cy={cy} r={radii[shells.length]} fill="none" stroke={shellLine} strokeWidth="1.5" strokeDasharray="4 5" />
      {Array.from({ length: ghost }, (_, j) => { const [x, y] = onCircle(cx, cy, radii[shells.length], ghostStart + j * 360 / ghost); return <circle key={`g${j}`} cx={x} cy={y} r={er} fill="white" stroke={electronLine} strokeWidth="1.5" strokeDasharray="3 3" /> })}
    </g>}
    {shells.map((count, s) => Array.from({ length: count }, (_, j) => {
      const [x, y] = onCircle(cx, cy, radii[s], START[s] + j * 360 / count)
      return <g key={`${s}-${j}`}>
        {s === last && fresh.includes(j) && <circle cx={x} cy={y} r={er + 4} fill={amberSoft} stroke={amber} strokeWidth="2" />}
        <Electron x={x} y={y} r={er} sign={false} />
      </g>
    }))}
    <Nucleus cx={cx} cy={cy} protons={el.z} neutrons={el.n} r={r1(nr)} mode="full" signs={false} />
    {charge && <g>
      <g fill="none" stroke={ink} strokeWidth="2.4">
        <path d={`M${r1(cx - half + 9)} ${r1(cy - half)}H${r1(cx - half)}V${r1(cy + half)}H${r1(cx - half + 9)}`} />
        <path d={`M${r1(cx + half - 9)} ${r1(cy - half)}H${r1(cx + half)}V${r1(cy + half)}H${r1(cx + half - 9)}`} />
      </g>
      <text x={r1(cx + half + 4)} y={r1(cy - half + 14)} fontSize="20" fontWeight="700" fill={tone === 'pos' ? posLine : negLine}>{charge}</text>
    </g>}
  </g>
}

// ---------- Section 1: losing and gaining electrons (magnesium and oxygen), one drawing built up ----------
type EStage = 'oxygen' | 'lose' | 'gain' | 'both' | 'all'
const E_TITLES: Record<EStage, string> = {
  oxygen: 'A magnesium atom with electrons 2,8,2 beside an oxygen atom with electrons 2,6, their outer shells highlighted. When magnesium burns it gains oxygen, so it is oxidised.',
  lose: 'The magnesium atom has lost its 2 outer electrons and is now a magnesium ion, Mg²⁺, in brackets. Mg → Mg²⁺ + 2e⁻. Loss of electrons is oxidation.',
  gain: 'The oxygen atom has gained 2 electrons, ringed, and is now an oxide ion, O²⁻, with 8 outer electrons. O + 2e⁻ → O²⁻. Gain of electrons is reduction.',
  both: 'A curved arrow carries 2 electrons from the magnesium to the oxygen. Magnesium is oxidised and oxygen is reduced at the same time: a redox reaction.',
  all: 'Both ions with the electron arrow and the two halves: Mg → Mg²⁺ + 2e⁻ (oxidised) and O + 2e⁻ → O²⁻ (reduced). OIL RIG: oxidation is loss, reduction is gain. Metals with acids are redox too: the metal loses electrons and hydrogen ions gain them.',
}
const MG = { x: 130, y: 140 }, OX = { x: 410, y: 140 }
const MG_R = [20, 38, 56], O_R = [22, 42]
function ElectronScene({ stage }: { stage: EStage }) {
  const mgIon = stage !== 'oxygen', oIon = stage === 'gain' || stage === 'both' || stage === 'all'
  const mgOn = stage !== 'gain', oOn = stage !== 'lose'
  const pair = (x: number, y: number) => <g><Electron x={x - 10} y={y} r={6} sign /><Electron x={x + 10} y={y} r={6} sign /></g>
  return <Diagram viewBox="0 0 540 360" title={E_TITLES[stage]}>
    <text x={270} y={28} textAnchor="middle" fontSize="17" fontWeight="700" fill={ink}>magnesium + oxygen <tspan fill={muted}>→</tspan> magnesium oxide</text>
    <g opacity={mgOn ? 1 : faded}>
      {mgIon
        ? <Particle cx={MG.x} cy={MG.y} sym="Mg" shells={[2, 8]} radii={MG_R} tone="pos" ghost={stage === 'lose' ? 2 : 0} charge="2+" />
        : <Particle cx={MG.x} cy={MG.y} sym="Mg" shells={[2, 8, 2]} radii={MG_R} outerHot />}
    </g>
    <g opacity={oOn ? 1 : faded}>
      {oIon
        ? <Particle cx={OX.x} cy={OX.y} sym="O" shells={[2, 8]} radii={O_R} tone="neg" fresh={stage === 'gain' ? [5, 6] : []} charge="2−" />
        : <Particle cx={OX.x} cy={OX.y} sym="O" shells={[2, 6]} radii={O_R} outerHot={stage === 'oxygen'} />}
    </g>

    {stage === 'lose' && <g>
      <path d="M176 104Q222 118 262 106" fill="none" stroke={posLine} strokeWidth="2" strokeDasharray="5 4" />
      {pair(286, 104)}
      <text x={286} y={134} textAnchor="middle" fontSize="14" fontWeight="700" fill={posInk}>2e⁻ lost</text>
    </g>}
    {stage === 'gain' && <g>
      {pair(270, 104)}
      <path d="M294 104Q326 96 350 112" fill="none" stroke={negLine} strokeWidth="2" strokeDasharray="5 4" />
      <text x={270} y={134} textAnchor="middle" fontSize="14" fontWeight="700" fill={negInk}>2e⁻ gained</text>
    </g>}
    {(stage === 'both' || stage === 'all') && <g>
      <ArcArrow from={[202, 118]} ctrl={[270, 36]} to={[336, 118]} />
      {pair(269, 77)}
      <text x={270} y={150} textAnchor="middle" fontSize="20" fontWeight="700" fill={amberInk}>redox</text>
      <text x={270} y={170} textAnchor="middle" fontSize="12" fill={muted}>both at once</text>
    </g>}

    {/* names and halves under each particle */}
    <g opacity={mgOn ? 1 : faded} textAnchor="middle">
      <text x={MG.x} y={240} fontSize="14" fontWeight="700" fill={mgIon ? posInk : ink}>{mgIon ? 'magnesium ion, Mg²⁺' : 'magnesium atom'}</text>
      <text x={MG.x} y={262} fontSize="13" fill={muted}>{mgIon ? '2,8' : '2,8,2'}</text>
    </g>
    <g opacity={oOn ? 1 : faded} textAnchor="middle">
      <text x={OX.x} y={240} fontSize="14" fontWeight="700" fill={oIon ? negInk : ink}>{oIon ? 'oxide ion, O²⁻' : 'oxygen atom'}</text>
      <text x={OX.x} y={262} fontSize="13" fill={muted}>{oIon ? '2,8' : '2,6'}</text>
    </g>
    {stage !== 'oxygen' && <g>
      {mgOn && <g><Eq x={MG.x} y={290} eq="Mg → Mg²⁺ + 2e⁻" size={16} />{stage !== 'all' && <Chip x={MG.x} y={318} w={204} tone="pos" size={13}>loses electrons: oxidised</Chip>}</g>}
      {oOn && <g><Eq x={OX.x} y={290} eq="O + 2e⁻ → O²⁻" size={16} />{stage !== 'all' && <Chip x={OX.x} y={318} w={204} tone="neg" size={13}>gains electrons: reduced</Chip>}</g>}
    </g>}
    {stage === 'oxygen' && <g textAnchor="middle">
      <text x={270} y={298} fontSize="14" fontWeight="700" fill={amberInk}>Mg gains oxygen, so it is oxidised.</text>
      <text x={270} y={322} fontSize="13" fill={muted}>Now look at the outer electrons: Mg has 2, O has 6.</text>
    </g>}
    {stage === 'all' && <g>
      <Chip x={MG.x} y={318} w={210} tone="pos" size={13}>OIL: Oxidation Is Loss</Chip>
      <Chip x={OX.x} y={318} w={210} tone="neg" size={13}>RIG: Reduction Is Gain</Chip>
      <text x={270} y={350} textAnchor="middle" fontSize="13" fill={muted}>Metals + acids: the metal loses e⁻ and H⁺ ions gain e⁻.</text>
    </g>}
  </Diagram>
}

// ---------- Section 2: half equations for 2Mg + O₂ → 2MgO, one board built up ----------
type HStage = 'split' | 'lose' | 'gain' | 'combine' | 'steps'
const H_TITLES: Record<HStage, string> = {
  split: 'The equation with ions: 2Mg + O₂ → 2Mg²⁺ + 2O²⁻. Below, one half for each element: Mg → Mg²⁺ and O₂ → 2O²⁻. Neither has electrons yet.',
  lose: 'The magnesium half balanced with electrons: Mg → Mg²⁺ + 2e⁻. The charge is 0 on the left, and 2+ plus 2− makes 0 on the right. Electrons on the right were lost: oxidation.',
  gain: 'The oxygen half balanced with electrons: O₂ + 4e⁻ → 2O²⁻. The charge is 4− on both sides. Electrons on the left were gained: reduction.',
  combine: 'Combining the halves, added like a column sum. The magnesium half is doubled to 2Mg → 2Mg²⁺ + 4e⁻ so both halves have 4 electrons. Added together, the 4e⁻ on each side are crossed out, leaving 2Mg + O₂ → 2Mg²⁺ + 2O²⁻.',
  steps: 'Both finished half equations, Mg → Mg²⁺ + 2e⁻ and O₂ + 4e⁻ → 2O²⁻, with four numbered steps: write the ions; write a half for each element that changes; balance the atoms; add electrons to the more positive side.',
}
function RowLabel({ x = 24, y, name, tag, tone, on }: { x?: number; y: number; name: string; tag?: string; tone: 'pos' | 'neg'; on: boolean }) {
  return <g opacity={on ? 1 : faded}>
    <text x={x} y={y - 6} fontSize="14" fontWeight="700" fill={ink}>{name}</text>
    {tag && <text x={x} y={y + 13} fontSize="13" fontWeight="700" fill={tone === 'pos' ? posInk : negInk}>{tag}</text>}
  </g>
}
function HalfScene({ stage }: { stage: HStage }) {
  const mgDone = stage !== 'split', oDone = stage === 'gain' || stage === 'combine' || stage === 'steps'
  if (stage === 'steps') {
    const steps = ['Write the equation with any ionic compounds as ions.', 'Write a half for each element that changes.', 'Balance the atoms in each half.', 'Add e⁻ to the more positive side, so charges match.']
    return <Diagram title={H_TITLES.steps}>
      <Eq x={270} y={38} eq="2Mg + O₂ → 2Mg²⁺ + 2O²⁻" size={22} />
      <RowLabel y={96} name="magnesium" tag="lost: oxidation" tone="pos" on />
      <Eq x={330} y={98} eq="Mg → Mg²⁺ + 2e⁻" size={20} />
      <RowLabel y={150} name="oxygen" tag="gained: reduction" tone="neg" on />
      <Eq x={330} y={152} eq="O₂ + 4e⁻ → 2O²⁻" size={20} />
      <rect x={20} y={182} width={500} height={128} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
      {steps.map((s, i) => <g key={i}><Num n={i + 1} x={44} y={204 + i * 29} /><text x={66} y={209 + i * 29} fontSize="14" fill={ink}>{s}</text></g>)}
    </Diagram>
  }
  const combine = stage === 'combine'
  const mgY = combine ? 98 : 122, oY = combine ? 160 : 212
  return <Diagram title={H_TITLES[stage]}>
    <Eq x={270} y={38} eq="2Mg + O₂ → 2Mg²⁺ + 2O²⁻" size={22} hot={stage === 'split' ? [0, 2, 4, 6] : []} />
    <text x={270} y={62} textAnchor="middle" fontSize="13" fill={muted}>magnesium oxide is made of Mg²⁺ and O²⁻ ions</text>

    <RowLabel y={mgY} name="magnesium" tag={mgDone ? 'lost: oxidation' : undefined} tone="pos" on={stage !== 'gain'} />
    <g opacity={stage === 'gain' ? faded : 1}>
      {combine
        ? <g><Eq x={320} y={mgY} eq="2Mg → 2Mg²⁺ + 4e⁻" size={20} hot={[0, 2]} /><Chip x={496} y={mgY - 6} w={44} size={14}>× 2</Chip></g>
        : <Eq x={330} y={mgY} eq={mgDone ? 'Mg → Mg²⁺ + 2e⁻' : 'Mg → Mg²⁺'} size={20} hot={stage === 'split' ? [0, 2] : []}
          tally={stage === 'lose' ? ['charge 0', '(2+) + (2−) = 0'] : undefined} tallyOk />}
    </g>

    <RowLabel y={oY} name="oxygen" tag={oDone ? 'gained: reduction' : undefined} tone="neg" on={stage !== 'lose'} />
    <g opacity={stage === 'lose' ? faded : 1}>
      <Eq x={combine ? 320 : 330} y={oY} eq={oDone ? 'O₂ + 4e⁻ → 2O²⁻' : 'O₂ → 2O²⁻'} size={20} hot={stage === 'split' ? [0, 2] : []}
        tally={stage === 'gain' ? ['charge 4−', '4−'] : undefined} tallyOk />
    </g>

    {stage === 'lose' && <Lines x={270} y={288} lines={['Add electrons to the more positive side.', 'Electrons on the right have been lost.']} />}
    {stage === 'gain' && <Lines x={270} y={288} lines={['2 O atoms on each side, so the atoms balance.', 'Electrons on the left have been gained.']} />}
    {stage === 'split' && <Lines x={270} y={288} lines={['One half for each element that changes.', 'Next: balance the charge.']} />}
    {combine && <g>
      <path d="M40 190H500" stroke={panelLine} strokeWidth="2" />
      <Eq x={270} y={226} eq="2Mg + O₂ + 4e⁻ → 2Mg²⁺ + 2O²⁻ + 4e⁻" size={19} cross={[4, 10]} />
      <text x={270} y={256} textAnchor="middle" fontSize="13" fill={muted}>both halves have 4e⁻, so they cancel</text>
      <Chip x={270} y={290} w={300} size={17} h={34}>2Mg + O₂ → 2Mg²⁺ + 2O²⁻</Chip>
    </g>}
  </Diagram>
}
function Lines({ x, y, lines }: { x: number; y: number; lines: string[] }) {
  return <g textAnchor="middle">{lines.map((l, i) => <text key={i} x={x} y={y + i * 22} fontSize="14" fontWeight={i === 1 ? 700 : 400} fill={i === 1 ? amberInk : ink}>{l}</text>)}</g>
}

// ---------- Section 3: displacement and ionic equations (Fe + CuSO₄) ----------
type BallKind = 'fe' | 'fe2' | 'cu' | 'cu2' | 'mg' | 'so4'
const BALL: Record<BallKind, [string, string, string]> = {
  fe: ['#c9d0d6', '#6f7d88', '#33414c'], fe2: ['#d8edd2', '#6aa35c', '#2f5a26'], cu: ['#e8b48a', '#c9793a', '#6b3510'],
  cu2: ['#cfe4f6', electronLine, negInk], mg: ['#e9edf0', '#8d9aa5', '#3b4a56'], so4: ['#efe9f5', '#8f7aa8', '#4f3d66'],
}
function Ball({ x, y, kind, label, r = 21, ring = false, size }: { x: number; y: number; kind: BallKind; label: string; r?: number; ring?: boolean; size?: number }) {
  const [fill, line, text] = BALL[kind]
  return <g>
    {ring && <circle cx={x} cy={y} r={r + 6} fill={amberSoft} stroke={amber} strokeWidth="2" strokeDasharray="5 3" />}
    <circle cx={x} cy={y} r={r} fill={fill} stroke={line} strokeWidth="2" />
    <text x={x} y={y + 5} textAnchor="middle" fontSize={size ?? (label.length > 3 ? 12 : 14)} fontWeight="700" fill={text}>{label}</text>
  </g>
}
type IStage = 'redox' | 'split' | 'spectator' | 'ionic' | 'steps'
const I_TITLES: Record<IStage, string> = {
  redox: 'Particles in iron and copper sulfate. An iron atom loses 2 electrons and becomes Fe²⁺: oxidised. The 2 electrons go to a copper ion, Cu²⁺, which becomes a copper atom: reduced. Below, the full equation Fe + CuSO₄ → FeSO₄ + Cu.',
  split: 'Step 2: the dissolved compounds written as ions. Fe + Cu²⁺ + SO₄²⁻ → Fe²⁺ + SO₄²⁻ + Cu. Iron and copper are solids, so they stay as atoms.',
  spectator: 'Step 3: the sulfate ions, SO₄²⁻, are the same on both sides, so they are crossed out as spectator ions.',
  ionic: 'Step 4: the ionic equation Fe + Cu²⁺ → Fe²⁺ + Cu, with a charge of 2+ on each side.',
  steps: 'All four steps: full equation; dissolved compounds as ions; spectator ions crossed out; ionic equation Fe + Cu²⁺ → Fe²⁺ + Cu. The metal atom is oxidised and the metal ion is reduced.',
}
const ROWS: Array<{ y: number; label: string; eq: string; cross?: number[] }> = [
  { y: 158, label: 'full equation', eq: 'Fe + CuSO₄ → FeSO₄ + Cu' },
  { y: 206, label: 'dissolved compounds as ions', eq: 'Fe + Cu²⁺ + SO₄²⁻ → Fe²⁺ + SO₄²⁻ + Cu' },
  { y: 254, label: 'cross out the spectator ions', eq: 'Fe + Cu²⁺ + SO₄²⁻ → Fe²⁺ + SO₄²⁻ + Cu', cross: [4, 8] },
  { y: 302, label: 'ionic equation', eq: 'Fe + Cu²⁺ → Fe²⁺ + Cu' },
]
function IonicScene({ stage }: { stage: IStage }) {
  const step = { redox: 1, split: 2, spectator: 3, ionic: 4, steps: 5 }[stage]
  const all = stage === 'steps'
  return <Diagram viewBox="0 0 540 330" title={I_TITLES[stage]}>
    <g opacity={stage === 'redox' || all ? 1 : .45}>
      <rect x={14} y={8} width={512} height={108} rx="14" fill={panelFill} stroke={stage === 'redox' ? amber : panelLine} strokeWidth={stage === 'redox' ? 2 : 1.5} />
      <Ball x={56} y={50} kind="fe" label="Fe" /><Arrow x1={84} y1={50} x2={124} y2={50} colour={ink} width={2.2} /><Ball x={152} y={50} kind="fe2" label="Fe²⁺" />
      <Ball x={392} y={50} kind="cu2" label="Cu²⁺" /><Arrow x1={420} y1={50} x2={460} y2={50} colour={ink} width={2.2} /><Ball x={488} y={50} kind="cu" label="Cu" />
      <path d="M180 40Q270 0 360 40" fill="none" stroke={amber} strokeWidth="2.2" strokeDasharray="6 5" />
      <path d="M360 40l-11.6 -2.6M360 40l-4.2 -11" stroke={amber} strokeWidth="2.2" />
      <Electron x={260} y={21} r={6} /><Electron x={280} y={21} r={6} />
      <text x={270} y={56} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>2e⁻ move</text>
      <text x={104} y={92} textAnchor="middle" fontSize="13" fontWeight="700" fill={posInk}>iron atom loses 2e⁻</text>
      <text x={104} y={108} textAnchor="middle" fontSize="13" fill={posInk}>oxidised</text>
      <text x={440} y={92} textAnchor="middle" fontSize="13" fontWeight="700" fill={negInk}>copper ion gains 2e⁻</text>
      <text x={440} y={108} textAnchor="middle" fontSize="13" fill={negInk}>reduced</text>
    </g>
    {ROWS.map((row, i) => {
      const n = i + 1
      if (!all && n > Math.max(step, 1)) return null
      const on = all || n === step || (stage === 'split' && n === 2)
      const dim = !all && !on && stage !== 'redox'
      return <g key={i} opacity={dim ? .5 : 1}>
        <Num n={n} x={30} y={row.y - 6} on={on} />
        <text x={50} y={row.y - 24} fontSize="12" fill={muted}>{row.label}</text>
        {n === 4
          ? <g><rect x={150} y={row.y - 23} width={250} height={32} rx="9" fill={on ? amberSoft : 'white'} stroke={on ? amber : panelLine} strokeWidth="2" /><Eq x={275} y={row.y} eq={row.eq} size={18} /></g>
          : <Eq x={290} y={row.y} eq={row.eq} size={17} cross={row.cross} />}
      </g>
    })}
    {(stage === 'ionic' || all) && <text x={500} y={308} textAnchor="end" fontSize="13" fontWeight="600" fill={good}>2+ = 2+</text>}
    {stage === 'redox' && <text x={270} y={206} textAnchor="middle" fontSize="14" fill={muted}>Next: rewrite it with the ions.</text>}
  </Diagram>
}

// ---------- Worked example set-ups ----------
function WorkedNaCl() {
  return <Diagram viewBox="0 0 540 280" schematic={false} title="Worked example set-up: sodium burns in chlorine, 2Na + Cl₂ → 2NaCl. Sodium chloride is made of Na⁺ and Cl⁻ ions. Two half equations to write, Na → ? and Cl₂ → ?, adding electrons to the more positive side.">
    <Eq x={270} y={42} eq="2Na + Cl₂ → 2NaCl" size={26} />
    <Chip x={170} y={84} w={170} tone="pos">sodium ion: Na⁺</Chip>
    <Chip x={370} y={84} w={170} tone="neg">chloride ion: Cl⁻</Chip>
    <rect x={20} y={112} width={500} height={150} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={40} y={146} fontSize="14" fontWeight="700" fill={ink}>sodium</text>
    <Eq x={160} y={148} eq="Na → Na⁺ + ?" size={20} anchor="start" />
    <text x={40} y={196} fontSize="14" fontWeight="700" fill={ink}>chlorine</text>
    <Eq x={160} y={198} eq="Cl₂ + ? → 2Cl⁻" size={20} anchor="start" />
    <text x={270} y={244} textAnchor="middle" fontSize="13" fill={muted}>Add e⁻ to the more positive side until the charges match.</text>
  </Diagram>
}
function WorkedMgCu() {
  const steps = ['full equation', 'dissolved compounds as ions', 'cross out the spectator ions', 'ionic equation']
  return <Diagram viewBox="0 0 540 290" schematic={false} title="Worked example set-up: magnesium displaces copper from copper sulfate solution, Mg + CuSO₄ → MgSO₄ + Cu. Magnesium and copper are solids; copper sulfate and magnesium sulfate are dissolved. Ions: Cu²⁺, Mg²⁺ and SO₄²⁻. Four numbered steps to follow.">
    <Eq x={270} y={40} eq="Mg + CuSO₄ → MgSO₄ + Cu" size={24} />
    <Chip x={150} y={80} w={200} tone="plain" size={13}>solid: Mg and Cu</Chip>
    <Chip x={390} y={80} w={240} tone="plain" size={13}>dissolved: CuSO₄ and MgSO₄</Chip>
    <text x={270} y={118} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>ions: Cu²⁺, Mg²⁺, SO₄²⁻</text>
    <rect x={20} y={134} width={500} height={140} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    {steps.map((s, i) => <g key={i}><Num n={i + 1} x={44} y={160 + i * 30} on={false} colour={ink} /><text x={66} y={165 + i * 30} fontSize="14" fill={ink}>{s}</text></g>)}
  </Diagram>
}

// ---------- Question visuals ----------
// A magnesium strip in copper sulfate solution, with a magnifier on the particles. 1 = a Mg atom on the strip, 2 = a Cu²⁺
// ion, 3 = a sulfate ion. Copper ions gain electrons, so particle 2 is reduced.
function Pointer({ n, x, y, to }: { n: number; x: number; y: number; to: [number, number] }) {
  const a = Math.atan2(to[1] - y, to[0] - x)
  return <g><path d={`M${r1(x + Math.cos(a) * 13)} ${r1(y + Math.sin(a) * 13)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
    <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}
function ParticleQuestion({ assessment }: { assessment: boolean }) {
  const clip = useId()
  const zx = 330, zy = 140, zr = 112
  const mgs: Array<[number, number]> = [[235, 110], [235, 140], [235, 170], [259, 95], [259, 125], [259, 155], [259, 185]]
  return <Diagram viewBox={`0 0 540 ${assessment ? 290 : 320}`} title={assessment
    ? 'A strip of magnesium in blue copper sulfate solution, with a magnifier showing the particles. Particle 1 is an atom in the magnesium strip, particle 2 is a Cu²⁺ ion and particle 3 is a SO₄²⁻ ion.'
    : 'Particle 2, the copper ion Cu²⁺, is ringed: it gains 2 electrons from a magnesium atom and becomes copper, so it is reduced. Particle 1, magnesium, is oxidised. Particle 3, sulfate, is a spectator ion.'}>
    {/* beaker */}
    <path d="M40 120H140V252Q140 262 130 262H50Q40 262 40 252Z" fill="#cfe4f6" />
    <path d="M34 92Q40 94 40 100V252Q40 262 50 262H130Q140 262 140 252V96" fill="none" stroke="#6f8798" strokeWidth="2.4" />
    <rect x={92} y={70} width={14} height={170} rx="3" fill={BALL.mg[0]} stroke={BALL.mg[1]} strokeWidth="2" />
    <text x={90} y={284} textAnchor="middle" fontSize="13" fill={muted}>Mg strip in CuSO₄(aq)</text>
    <path d={`M106 150L${zx - zr * .9} ${zy - zr * .42}M106 186L${zx - zr * .88} ${zy + zr * .46}`} stroke={panelLine} strokeWidth="1.5" strokeDasharray="4 4" />
    <defs><clipPath id={clip}><circle cx={zx} cy={zy} r={zr} /></clipPath></defs>
    <circle cx={zx} cy={zy} r={zr} fill="#e6f1fa" />
    <g clipPath={`url(#${clip})`}>
      <rect x={200} y={20} width={74} height={240} fill="#f3f5f7" />
      <path d="M274 20V260" stroke={BALL.mg[1]} strokeWidth="1.5" />
      {mgs.map(([x, y], i) => <Ball key={i} x={x} y={y} kind="mg" label="Mg" r={13.5} size={12} />)}
      <Ball x={320} y={84} kind="cu2" label="Cu²⁺" ring={!assessment} />
      <Ball x={392} y={94} kind="so4" label="SO₄²⁻" r={22} />
      <Ball x={322} y={150} kind="cu2" label="Cu²⁺" />
      <Ball x={400} y={160} kind="so4" label="SO₄²⁻" r={22} />
      <Ball x={320} y={214} kind="cu2" label="Cu²⁺" />
      <Ball x={376} y={212} kind="so4" label="SO₄²⁻" r={22} />
    </g>
    <circle cx={zx} cy={zy} r={zr} fill="none" stroke={ink} strokeWidth="2.5" />
    <Pointer n={1} x={190} y={36} to={[250, 86]} />
    <Pointer n={2} x={500} y={40} to={[338, 74]} />
    <Pointer n={3} x={500} y={160} to={[422, 160]} />
    {!assessment && <text x={270} y={312} textAnchor="middle" fontSize="14" fontWeight="700" fill={good}>2: Cu²⁺ + 2e⁻ → Cu (reduced) · 1: Mg is oxidised · 3: spectator</text>}
  </Diagram>
}
// A student's working for the ionic equation of magnesium with iron chloride. Line 2 writes solid magnesium as Mg²⁺.
function WorkingQuestion({ assessment }: { assessment: boolean }) {
  const lines: Array<{ eq: string; cross?: number[] }> = [
    { eq: 'Mg + FeCl₂ → MgCl₂ + Fe' },
    { eq: 'Mg²⁺ + Fe²⁺ + 2Cl⁻ → Mg²⁺ + 2Cl⁻ + Fe' },
    { eq: 'Mg²⁺ + Fe²⁺ + 2Cl⁻ → Mg²⁺ + 2Cl⁻ + Fe', cross: [0, 4, 6, 8] },
    { eq: 'Fe²⁺ → Fe' },
  ]
  return <Diagram viewBox={`0 0 540 ${assessment ? 276 : 326}`} schematic={false} title={assessment
    ? 'A student’s working for the ionic equation when magnesium displaces iron from iron chloride solution, in four numbered lines. Line 1: Mg + FeCl₂ → MgCl₂ + Fe. Line 2: Mg²⁺ + Fe²⁺ + 2Cl⁻ → Mg²⁺ + 2Cl⁻ + Fe. Line 3: the same with Mg²⁺ and 2Cl⁻ crossed out on both sides. Line 4: Fe²⁺ → Fe.'
    : 'The student’s working with line 2 marked wrong. Magnesium is a solid metal, so it stays as atoms: Mg + Fe²⁺ + 2Cl⁻ → Mg²⁺ + 2Cl⁻ + Fe. Crossing out the chloride ions gives the ionic equation Mg + Fe²⁺ → Mg²⁺ + Fe.'}>
    <text x={20} y={30} fontSize="16" fontWeight="700" fill={ink}>Magnesium in iron chloride solution</text>
    <rect x={20} y={46} width={500} height={214} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    {lines.map((l, i) => {
      const y = 92 + i * 48, wrong = !assessment && i === 1
      return <g key={i}>
        {wrong && <rect x={28} y={y - 26} width={484} height={40} rx="8" fill={badSoft} stroke={bad} strokeWidth="1.5" />}
        <Num n={i + 1} x={52} y={y - 6} on={false} colour={wrong ? bad : ink} />
        <Eq x={80} y={y} eq={l.eq} size={17} anchor="start" cross={l.cross} colour={wrong ? bad : ink} />
      </g>
    })}
    {!assessment && <g>
      <text x={20} y={288} fontSize="14" fontWeight="700" fill={good}>Mg is a solid metal, so it stays as atoms. The ionic equation is</text>
      <Eq x={20} y={314} eq="Mg + Fe²⁺ → Mg²⁺ + Fe" size={17} anchor="start" colour={good} />
    </g>}
  </Diagram>
}

export function HigherRedoxVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'hredox-e-oxygen': return <ElectronScene stage="oxygen" />
    case 'hredox-e-lose': return <ElectronScene stage="lose" />
    case 'hredox-e-gain': return <ElectronScene stage="gain" />
    case 'hredox-e-both': return <ElectronScene stage="both" />
    case 'hredox-e-all': return <ElectronScene stage="all" />
    case 'hredox-half-split': return <HalfScene stage="split" />
    case 'hredox-half-lose': return <HalfScene stage="lose" />
    case 'hredox-half-gain': return <HalfScene stage="gain" />
    case 'hredox-half-combine': return <HalfScene stage="combine" />
    case 'hredox-half-steps': return <HalfScene stage="steps" />
    case 'hredox-ion-redox': return <IonicScene stage="redox" />
    case 'hredox-ion-split': return <IonicScene stage="split" />
    case 'hredox-ion-spectator': return <IonicScene stage="spectator" />
    case 'hredox-ion-ionic': return <IonicScene stage="ionic" />
    case 'hredox-ion-steps': return <IonicScene stage="steps" />
    case 'hredox-worked-nacl': return <WorkedNaCl />
    case 'hredox-worked-mgcu': return <WorkedMgCu />
    case 'hredox-question-particles': return <ParticleQuestion assessment={assessment} />
    case 'hredox-question-working': return <WorkingQuestion assessment={assessment} />
    default: return <ElectronScene stage="all" />
  }
}
