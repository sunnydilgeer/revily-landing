import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C4, Higher-only lesson (Chemistry Lesson 22H): strong and weak acids. Original, code-native schematics;
 * not to scale. Focus ids start with 'hacid-'.
 *
 * Same visual language as the pH and neutralisation drawings (AcidVisuals.tsx) and the moles drawings
 * (HigherMolesVisuals.tsx): glass beakers of pale-blue solution; H⁺ ions in the coral proton tint with white text;
 * atoms as soft fills with a darker stroke of the same hue (H white, Cl soft green); the ethanoate part of ethanoic
 * acid a soft lilac lozenge; the pH strip in universal-indicator colours. Amber marks whatever the frame is about.
 * Question beakers use a neutral slate acid so the drawing never names the acid. Each teaching section keeps one
 * drawing on screen; the last frame shows it all.
 */
const { ink, muted, panelFill, panelLine, protonFill, protonLine } = atomPalette
const amber = '#d98a1c', amberSoft = '#fdf0dc', amberInk = '#8a5a14'
const bad = '#c0504a', badSoft = '#fbe6e4', good = '#3f8a5f'
const liquid = '#e4f1f8', glass = '#8fb0c4'
const faded = 0.3
// Universal-indicator colours for pH 0 to 7 (as on the pH scale drawings).
const UI = ['#b8322a', '#c9422b', '#d9552b', '#e8752f', '#f0952f', '#f2b53a', '#efd340', '#8fb86a']

type Acid = 'hcl' | 'eth' | 'gen'
const H_ATOM = { fill: '#ffffff', line: '#8d9ba6' }
const NEG: Record<Acid, { fill: string; line: string; text: string }> = {
  hcl: { fill: '#b2dea6', line: '#5a9a4c', text: '#2c5a22' },
  eth: { fill: '#ddd2f0', line: '#7d68a8', text: '#46336e' },
  gen: { fill: '#d5dee8', line: '#6f8296', text: '#3d4f61' },
}
const r1 = (n: number) => Math.round(n * 10) / 10

function Diagram({ title, children, viewBox = '0 0 540 330', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Chip({ x, y, w, children, hot = true, h = 30, size = 14 }: { x: number; y: number; w: number; children: ReactNode; hot?: boolean; h?: number; size?: number }) {
  return <g><rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="9" fill={hot ? amberSoft : panelFill} stroke={hot ? amber : panelLine} strokeWidth={hot ? 2 : 1.5} />
    <text x={x} y={y + size * .35} textAnchor="middle" fontSize={size} fontWeight="700" fill={hot ? amberInk : ink}>{children}</text></g>
}
function Num({ n, x, y, on = true, colour = amber }: { n: number; x: number; y: number; on?: boolean; colour?: string }) {
  return <g><circle cx={x} cy={y} r="12" fill={on ? colour : 'white'} stroke={on ? colour : muted} strokeWidth="2" />
    <text x={x} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill={on ? 'white' : muted}>{n}</text></g>
}

// ---------- Particles ----------
function HIon({ x, y }: { x: number; y: number }) {
  return <g data-ion="H+"><circle cx={x} cy={y} r="11" fill={protonFill} stroke={protonLine} strokeWidth="1.8" />
    <text x={x} y={y + 4.3} textAnchor="middle" fontSize="12" fontWeight="700" fill="white">H⁺</text></g>
}
/** The negative ion left behind: a chloride ion for hydrochloric acid, a lozenge for ethanoate or a neutral acid. */
function NegIon({ x, y, acid }: { x: number; y: number; acid: Acid }) {
  const c = NEG[acid]
  if (acid === 'hcl') return <g data-ion="Cl-"><circle cx={x} cy={y} r="12.5" fill={c.fill} stroke={c.line} strokeWidth="1.8" />
    <text x={x} y={y + 4.3} textAnchor="middle" fontSize="12" fontWeight="700" fill={c.text}>Cl⁻</text></g>
  return <g data-ion="negative"><rect x={x - 14} y={y - 9} width={28} height={18} rx="9" fill={c.fill} stroke={c.line} strokeWidth="1.8" />
    <text x={x} y={y + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill={c.text}>−</text></g>
}
/** A whole acid molecule: a hydrogen atom joined to the rest of the acid. */
function AcidMolecule({ x, y, acid, tilt = 0 }: { x: number; y: number; acid: Acid; tilt?: number }) {
  const c = NEG[acid]
  return <g data-molecule="acid" transform={`rotate(${tilt} ${x} ${y})`}>
    <path d={`M${x - 11} ${y}H${x + 2}`} stroke="#7d8a94" strokeWidth="3" />
    {acid === 'hcl'
      ? <g><circle cx={x + 5} cy={y} r="11" fill={c.fill} stroke={c.line} strokeWidth="1.8" /><text x={x + 5} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={c.text}>Cl</text></g>
      : <rect x={x - 6} y={y - 8} width={26} height={16} rx="8" fill={c.fill} stroke={c.line} strokeWidth="1.8" />}
    <circle cx={x - 12} cy={y} r="7" fill={H_ATOM.fill} stroke={H_ATOM.line} strokeWidth="1.6" />
  </g>
}

// Deterministic jitter, so a beaker of particles looks loose rather than gridded but renders the same every time.
const rnd = (i: number, seed: number) => { const v = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453; return v - Math.floor(v) }
type Item = 'mol' | 'h' | 'neg'
function place(items: Item[], x: number, y: number, w: number, h: number, seed: number) {
  const n = items.length
  const cols = Math.max(1, Math.ceil(Math.sqrt(n * w / h))), rows = Math.ceil(n / cols)
  const cw = w / cols, ch = h / rows
  const cells = Array.from({ length: cols * rows }, (_, i) => i).sort((a, b) => rnd(a, seed) - rnd(b, seed)).slice(0, n)
  return items.map((kind, i) => {
    const c = cells[i], col = c % cols, row = Math.floor(c / cols)
    const jx = (rnd(i + 31, seed) - .5) * Math.max(0, Math.min(cw * .3, cw - 30)), jy = (rnd(i + 57, seed) - .5) * Math.max(0, Math.min(ch * .3, ch - 28))
    return { kind, x: r1(x + (col + .5) * cw + jx), y: r1(y + (row + .5) * ch + jy), tilt: Math.round((rnd(i + 7, seed) - .5) * 50) }
  })
}
/** The particles for an acid: `n` acid particles, of which `ionised` have split into an H⁺ ion and a negative ion. */
function itemsFor(n: number, ionised: number): Item[] {
  const out: Item[] = []
  for (let i = 0; i < n; i++) if (i < ionised) out.push('h', 'neg'); else out.push('mol')
  // Interleave so ions and molecules spread through the beaker.
  return out.sort((a, b) => (a === 'mol' ? 1 : 0) - (b === 'mol' ? 1 : 0))
}

/** A glass beaker of acid solution with its particles. `level` is the height of the liquid. */
function Tank({ x, y, w, h, acid, n, ionised, seed = 1, hot = false, opacity = 1 }: { x: number; y: number; w: number; h: number; acid: Acid; n: number; ionised: number; seed?: number; hot?: boolean; opacity?: number }) {
  const r = 14, level = h - 18, ly = y + h - level
  const body = `M${x} ${y}V${y + h - r}Q${x} ${y + h} ${x + r} ${y + h}H${x + w - r}Q${x + w} ${y + h} ${x + w} ${y + h - r}V${y}`
  const parts = place(itemsFor(n, ionised), x + 10, ly + 8, w - 20, level - 16, seed)
  return <g opacity={opacity}>
    {hot && <rect x={x - 9} y={y - 9} width={w + 18} height={h + 18} rx="18" fill="none" stroke={amber} strokeWidth="2" strokeDasharray="6 5" />}
    <path d={`M${x} ${ly}H${x + w}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}Z`} fill={liquid} />
    <path d={`M${x + 1.5} ${ly}Q${x + w / 2} ${ly + 3} ${x + w - 1.5} ${ly}`} fill="none" stroke={glass} strokeWidth="1.3" />
    {parts.map((p, i) => p.kind === 'mol' ? <AcidMolecule key={i} x={p.x} y={p.y} acid={acid} tilt={p.tilt} /> : p.kind === 'h' ? <HIon key={i} x={p.x} y={p.y} /> : <NegIon key={i} x={p.x} y={p.y} acid={acid} />)}
    <path d={body} fill="none" stroke={glass} strokeWidth="3" /><path d={`M${x - 6} ${y}H${x}M${x + w} ${y}H${x + w + 6}`} stroke={glass} strokeWidth="3" />
  </g>
}
/** A key to the particles, centred on x. */
function Key({ x, y, acid, size = 13 }: { x: number; y: number; acid: Acid; size?: number }) {
  const neg = acid === 'hcl' ? 'chloride ion, Cl⁻' : acid === 'eth' ? 'ethanoate ion, CH₃COO⁻' : 'negative ion'
  const mol = acid === 'hcl' ? 'HCl molecule' : acid === 'eth' ? 'CH₃COOH molecule' : 'acid molecule'
  const widths = acid === 'eth' ? [182, 84, 196] : acid === 'hcl' ? [146, 84, 140] : [142, 84, 120]
  const total = widths.reduce((a, b) => a + b, 0), x0 = x - total / 2
  const at = (i: number) => x0 + widths.slice(0, i).reduce((a, b) => a + b, 0)
  return <g fontSize={size} fill={muted}>
    <AcidMolecule x={at(0) + 16} y={y} acid={acid} /><text x={at(0) + 44} y={y + 4.5}>{mol}</text>
    <HIon x={at(1) + 12} y={y} /><text x={at(1) + 28} y={y + 4.5}>H⁺ ion</text>
    <NegIon x={at(2) + 15} y={y} acid={acid} /><text x={at(2) + 34} y={y + 4.5}>{neg}</text>
  </g>
}

// ---------- Section 1: strong and weak, two beakers built up frame by frame ----------
type StrongStage = 'ionise' | 'strong' | 'weak' | 'reversible' | 'together'
const STRONG_TITLES: Record<StrongStage, string> = {
  ionise: 'A beaker of hydrochloric acid. In water every HCl particle has split into a hydrogen ion, H⁺, and a chloride ion, Cl⁻: HCl → H⁺ + Cl⁻. This splitting is called ionising. A beaker of ethanoic acid beside it is faded.',
  strong: 'The beaker of hydrochloric acid holds 8 hydrogen ions and 8 chloride ions and no whole molecules. It has ionised completely, so it is a strong acid. Nitric acid and sulfuric acid are strong acids too.',
  weak: 'Beside it, a beaker of ethanoic acid with the same number of acid particles: 7 whole ethanoic acid molecules and only 1 hydrogen ion with 1 ethanoate ion. It has only partly ionised, so it is a weak acid. Citric acid and carbonic acid are weak acids too.',
  reversible: 'The ethanoic acid beaker with its equation, CH₃COOH ⇌ H⁺ + CH₃COO⁻. The two-way arrow shows the reaction is reversible: molecules split into ions and ions join back into molecules.',
  together: 'Both beakers side by side, with the same number of acid particles. Hydrochloric acid, strong, has ionised completely and has 8 H⁺ ions. Ethanoic acid, weak, has only partly ionised and has 1 H⁺ ion.',
}
function StrongScene({ stage }: { stage: StrongStage }) {
  const L = 34, R = 306, W = 200, Y = 50, H = 168
  const leftHot = stage === 'ionise' || stage === 'strong'
  const rightHot = stage === 'weak' || stage === 'reversible'
  const showRight = stage !== 'ionise' && stage !== 'strong'
  const all = stage === 'together'
  return <Diagram viewBox="0 0 540 350" title={STRONG_TITLES[stage]}>
    <text x={L + W / 2} y={26} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>hydrochloric acid, HCl</text>
    <text x={R + W / 2} y={26} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink} opacity={showRight ? 1 : faded}>ethanoic acid, CH₃COOH</text>
    <Tank x={L} y={Y} w={W} h={H} acid="hcl" n={8} ionised={8} seed={3} hot={leftHot} />
    <Tank x={R} y={Y} w={W} h={H} acid="eth" n={8} ionised={1} seed={5} hot={rightHot} opacity={showRight ? 1 : faded} />

    {stage === 'ionise' && <g>
      <Chip x={L + W / 2} y={252} w={220} size={15}>HCl → H⁺ + Cl⁻</Chip>
      <text x={L + W / 2} y={286} textAnchor="middle" fontSize="13" fill={muted}>every particle has split into ions</text>
    </g>}
    {(stage === 'strong' || stage === 'weak' || all) && <g>
      <Chip x={L + W / 2} y={252} w={230} hot={stage === 'strong'}>strong: all ionised</Chip>
      <text x={L + W / 2} y={282} textAnchor="middle" fontSize="13" fill={muted}>also nitric acid, HNO₃,</text>
      <text x={L + W / 2} y={299} textAnchor="middle" fontSize="13" fill={muted}>and sulfuric acid, H₂SO₄</text>
    </g>}
    {(stage === 'weak' || all) && <g>
      <Chip x={R + W / 2} y={252} w={230} hot={stage === 'weak'}>weak: only a few ionised</Chip>
      <text x={R + W / 2} y={282} textAnchor="middle" fontSize="13" fill={muted}>also citric acid</text>
      <text x={R + W / 2} y={299} textAnchor="middle" fontSize="13" fill={muted}>and carbonic acid</text>
    </g>}
    {stage === 'reversible' && <g>
      <rect x={R - 26} y={232} width={W + 52} height={74} rx="12" fill={amberSoft} stroke={amber} strokeWidth="2" />
      <text x={R + W / 2} y={262} textAnchor="middle" fontSize="16" fontWeight="700" fill={amberInk}>CH₃COOH <tspan fontSize="21">⇌</tspan> H⁺ + CH₃COO⁻</text>
      <text x={R + W / 2} y={290} textAnchor="middle" fontSize="13" fill={amberInk}>splits up → and ← joins back</text>
      <Chip x={L + W / 2} y={252} w={230} hot={false}>strong: all ionised</Chip>
      <text x={L + W / 2} y={282} textAnchor="middle" fontSize="13" fill={muted}>HCl → H⁺ + Cl⁻ (one way)</text>
    </g>}
    {all && <g>
      <Chip x={270} y={326} w={300} size={14}>8 H⁺ ions vs 1 H⁺ ion</Chip>
    </g>}
    {!all && <Key x={270} y={333} acid={stage === 'ionise' || stage === 'strong' ? 'hcl' : 'eth'} />}
  </Diagram>
}

// ---------- Section 2: pH and hydrogen ions, one strip with ×10 hops ----------
const SX = 20, SW = 500, CELLS = 8, CWID = SW / CELLS
const scx = (ph: number) => SX + (ph + .5) * CWID
function PhStrip({ y, h = 40, ring = [] as number[] }: { y: number; h?: number; ring?: number[] }) {
  return <g>
    {UI.map((c, i) => <rect key={i} x={SX + i * CWID} y={y} width={i === CELLS - 1 ? CWID : CWID + .6} height={h} fill={c} />)}
    <rect x={SX} y={y} width={SW} height={h} rx="6" fill="none" stroke={ink} strokeWidth="1.8" />
    {UI.map((_, i) => <text key={i} x={scx(i)} y={y + h + 21} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{i}</text>)}
    {ring.map(p => <circle key={p} cx={scx(p)} cy={y + h + 16} r="13" fill="none" stroke={amber} strokeWidth="2.2" />)}
    <text x={SX} y={y + h + 44} fontSize="13" fill={muted}>pH</text>
  </g>
}
/** A curved hop from one pH to the next with its label (× 10 down the scale, ÷ 10 up it). */
function Hop({ from, to, y, label, on = true, colour = amber }: { from: number; to: number; y: number; label: string; on?: boolean; colour?: string }) {
  const x1 = scx(from), x2 = scx(to), mid = (x1 + x2) / 2, top = y - 48
  const d = x2 > x1 ? 1 : -1
  return <g opacity={on ? 1 : faded}>
    <path d={`M${x1} ${y}Q${mid} ${top} ${x2 - d * 4} ${y - 4}`} fill="none" stroke={colour} strokeWidth="2.6" />
    <path d={`M${x2} ${y}l${-d * 2} -11l${-d * 8} 7z`} fill={colour} stroke={colour} strokeWidth="1.5" />
    <text x={mid} y={top + 6} textAnchor="middle" fontSize="15" fontWeight="700" fill={colour === amber ? amberInk : colour}>{label}</text>
  </g>
}
function MiniBeaker({ x, y, dots, label }: { x: number; y: number; dots: number; label: string }) {
  const w = 76, h = 66
  const pts = place(Array.from({ length: dots }, () => 'h' as Item), x + 8, y + 18, w - 16, h - 26, dots)
  return <g>
    <path d={`M${x} ${y + 14}H${x + w}V${y + h - 10}Q${x + w} ${y + h} ${x + w - 10} ${y + h}H${x + 10}Q${x} ${y + h} ${x} ${y + h - 10}Z`} fill={liquid} />
    {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="5" fill={protonFill} stroke={protonLine} strokeWidth="1.2" />)}
    <path d={`M${x} ${y}V${y + h - 10}Q${x} ${y + h} ${x + 10} ${y + h}H${x + w - 10}Q${x + w} ${y + h} ${x + w} ${y + h - 10}V${y}`} fill="none" stroke={glass} strokeWidth="2.5" />
    <text x={x + w / 2} y={y - 8} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{label}</text>
  </g>
}
type PhStage = 'more' | 'ten' | 'steps' | 'up' | 'formula'
const PH_TITLES: Record<PhStage, string> = {
  more: 'A pH strip from 0 to 7 in universal-indicator colours. Above pH 1, a small beaker crowded with H⁺ ions; above pH 6, a beaker with only a few. The lower the pH, the greater the concentration of H⁺ ions.',
  ten: 'The same pH strip with one curved hop from pH 4 down to pH 3 labelled × 10: one step down the pH scale means 10 times the H⁺ ion concentration.',
  steps: 'Two hops, from pH 4 to pH 3 and from pH 3 to pH 2, each labelled × 10. Two steps down give 10 × 10 = 100 times the H⁺ ion concentration.',
  up: 'One hop going the other way, from pH 2 up to pH 3, labelled ÷ 10. One step up the pH scale divides the H⁺ ion concentration by 10.',
  formula: 'The two hops from pH 4 to pH 2 with the formula: factor = 10 to the power minus X, where X = final pH − initial pH. Here X = 2 − 4 = −2, so the factor is 10² = 100.',
}
function PhScene({ stage }: { stage: PhStage }) {
  const sy = 150
  const down = stage === 'ten' || stage === 'steps' || stage === 'formula'
  return <Diagram viewBox="0 0 540 330" title={PH_TITLES[stage]}>
    {stage === 'more' && <g>
      <MiniBeaker x={scx(1) - 38} y={50} dots={14} label="pH 1" />
      <MiniBeaker x={scx(6) - 38} y={50} dots={2} label="pH 6" />
      <text x={270} y={86} textAnchor="middle" fontSize="13" fill={muted}>H⁺ ions in the</text>
      <text x={270} y={103} textAnchor="middle" fontSize="13" fill={muted}>same volume</text>
    </g>}
    {stage !== 'more' && <text x={270} y={34} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{stage === 'up' ? 'one step up the scale' : stage === 'ten' ? 'one step down the scale' : 'two steps down the scale'}</text>}
    {down && <Hop from={4} to={3} y={sy - 6} label="× 10" />}
    {(stage === 'steps' || stage === 'formula') && <Hop from={3} to={2} y={sy - 6} label="× 10" />}
    {stage === 'up' && <Hop from={2} to={3} y={sy - 6} label="÷ 10" colour="#3f6f9a" />}
    <PhStrip y={sy} ring={stage === 'ten' ? [3, 4] : stage === 'up' ? [2, 3] : stage === 'more' ? [1, 6] : [2, 4]} />
    {stage === 'more' && <g>
      <path d={`M${scx(0) + 6} 262H${scx(3) + 20}`} stroke={protonLine} strokeWidth="3" /><path d={`M${scx(0) - 2} 262l11 -7v14z`} fill={protonLine} />
      <text x={scx(0) + 2} y={290} fontSize="14" fontWeight="700" fill={ink}>more H⁺ ions: lower pH</text>
      <path d={`M${scx(4) + 10} 262H${scx(7) + 2}`} stroke="#3f6f9a" strokeWidth="3" /><path d={`M${scx(7) + 10} 262l-11 -7v14z`} fill="#3f6f9a" />
      <text x={scx(7) + 10} y={290} textAnchor="end" fontSize="14" fontWeight="700" fill={ink}>fewer H⁺ ions</text>
    </g>}
    {stage === 'ten' && <text x={270} y={276} textAnchor="middle" fontSize="15" fill={ink}>pH 3 has <tspan fontWeight="700" fill={amberInk}>10 times</tspan> the H⁺ ions of pH 4</text>}
    {stage === 'steps' && <g>
      <Chip x={270} y={268} w={260} size={16}>10 × 10 = 100 times</Chip>
      <text x={270} y={304} textAnchor="middle" fontSize="13" fill={muted}>multiply by 10 once for each step</text>
    </g>}
    {stage === 'up' && <text x={270} y={276} textAnchor="middle" fontSize="15" fill={ink}>pH 3 has <tspan fontWeight="700" fill="#3f6f9a">10 times fewer</tspan> H⁺ ions than pH 2</text>}
    {stage === 'formula' && <g>
      <rect x={60} y={238} width={420} height={84} rx="12" fill={amberSoft} stroke={amber} strokeWidth="2" />
      <text x={270} y={266} textAnchor="middle" fontSize="17" fontWeight="700" fill={amberInk}>factor = 10<tspan dy="-7" fontSize="12">−X</tspan></text>
      <text x={270} y={290} textAnchor="middle" fontSize="13" fill={amberInk}>X = final pH − initial pH</text>
      <text x={270} y={312} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>X = 2 − 4 = −2, so factor = 10² = 100</text>
    </g>}
  </Diagram>
}
function WorkedSteps() {
  const sy = 120
  return <Diagram viewBox="0 0 540 280" schematic={false} title="Worked example set-up: a pH strip from 0 to 7 with pH 5 (start) and pH 2 (end) ringed and three hops between them, each with a question mark. The factor is to be found.">
    <text x={270} y={34} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>pH falls from 5 to 2</text>
    <Hop from={5} to={4} y={sy - 6} label="?" />
    <Hop from={4} to={3} y={sy - 6} label="?" />
    <Hop from={3} to={2} y={sy - 6} label="?" />
    <PhStrip y={sy} ring={[2, 5]} />
    <text x={scx(5)} y={214} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>start</text>
    <text x={scx(2)} y={214} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>end</text>
    <text x={270} y={256} textAnchor="middle" fontSize="15" fill={ink}>How many steps? What is each step worth?</text>
  </Diagram>
}
function WorkedFormula() {
  return <Diagram viewBox="0 0 540 230" schematic={false} title="Worked example set-up: a card showing initial pH 7 and final pH 3, the formula factor = 10 to the power minus X, and X = final pH − initial pH. The factor is to be found.">
    <rect x={20} y={14} width={500} height={200} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <Chip x={150} y={52} w={180} hot={false} size={15}>initial pH = 7</Chip>
    <Chip x={390} y={52} w={180} hot={false} size={15}>final pH = 3</Chip>
    <text x={270} y={112} textAnchor="middle" fontSize="20" fontWeight="700" fill={amberInk}>factor = 10<tspan dy="-8" fontSize="13">−X</tspan></text>
    <text x={270} y={146} textAnchor="middle" fontSize="15" fill={ink}>X = final pH − initial pH</text>
    <text x={270} y={186} textAnchor="middle" fontSize="15" fill={muted}>X = ? · factor = ?</text>
  </Diagram>
}

// ---------- Section 3: strength is not concentration ----------
type ConcStage = 'amount' | 'strength' | 'ph' | 'grid' | 'together'
const CONC_TITLES: Record<ConcStage, string> = {
  amount: 'Two beakers of hydrochloric acid with the same volume. The dilute one holds 3 acid particles and the concentrated one holds 8. All of them have ionised into H⁺ and Cl⁻ ions.',
  strength: 'Two beakers with the same concentration, 8 acid particles each. Hydrochloric acid, strong, has ionised completely. Ethanoic acid, weak, has 7 whole molecules and only 1 ionised.',
  ph: 'The same two beakers of the same concentration with pH readings: hydrochloric acid about pH 1 and ethanoic acid about pH 3. The stronger acid has more H⁺ ions, so a lower pH.',
  grid: 'Four beakers in a grid. Columns: dilute (3 acid particles) and concentrated (8). Rows: strong (every particle ionised) and weak (only one particle ionised). A dilute strong acid and a concentrated weak acid are both possible.',
  together: 'The same grid of four beakers. Across: concentration, how much acid is in the volume; more concentrated means more H⁺ ions and a lower pH. Down: strength, how much of the acid ionises.',
}
function TwoTanks({ left, right, labels, hot, sub }: { left: { acid: Acid; n: number; i: number; seed: number }; right: { acid: Acid; n: number; i: number; seed: number }; labels: [string, string]; hot: [boolean, boolean]; sub: [string, string] }) {
  const L = 34, R = 306, W = 200, Y = 50, H = 168
  return <g>
    <text x={L + W / 2} y={26} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{sub[0]}</text>
    <text x={R + W / 2} y={26} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{sub[1]}</text>
    <Tank x={L} y={Y} w={W} h={H} acid={left.acid} n={left.n} ionised={left.i} seed={left.seed} />
    <Tank x={R} y={Y} w={W} h={H} acid={right.acid} n={right.n} ionised={right.i} seed={right.seed} />
    <Chip x={L + W / 2} y={252} w={220} hot={hot[0]}>{labels[0]}</Chip>
    <Chip x={R + W / 2} y={252} w={220} hot={hot[1]}>{labels[1]}</Chip>
  </g>
}
function GridScene({ stage }: { stage: 'grid' | 'together' }) {
  const X = [104, 322], Yr = [50, 214], W = 196, H = 126
  const cells: Array<{ col: number; row: number; n: number; i: number; seed: number; label: string }> = [
    { col: 0, row: 0, n: 3, i: 3, seed: 11, label: 'dilute, strong' },
    { col: 1, row: 0, n: 8, i: 8, seed: 12, label: 'concentrated, strong' },
    { col: 0, row: 1, n: 3, i: 1, seed: 13, label: 'dilute, weak' },
    { col: 1, row: 1, n: 8, i: 1, seed: 14, label: 'concentrated, weak' },
  ]
  const together = stage === 'together'
  return <Diagram viewBox="0 0 540 420" title={CONC_TITLES[stage]}>
    <text x={X[0] + W / 2} y={30} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>dilute</text>
    <text x={X[1] + W / 2} y={30} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>concentrated</text>
    <text x={48} y={Yr[0] + H / 2 + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>strong</text>
    <text x={48} y={Yr[1] + H / 2 + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>weak</text>
    {<g fontSize="12" fill={muted} textAnchor="middle">
      <text x={48} y={Yr[0] + H / 2 + 23}>all ionised</text>
      <text x={48} y={Yr[1] + H / 2 + 23}>few ionised</text>
    </g>}
    {cells.map(c => {
      const hot = !together && ((c.col === 0 && c.row === 0) || (c.col === 1 && c.row === 1))
      return <g key={c.label}>
        <Tank x={X[c.col]} y={Yr[c.row]} w={W} h={H} acid={c.row === 0 ? 'hcl' : 'eth'} n={c.n} ionised={c.i} seed={c.seed} hot={hot} />
        <text x={X[c.col] + W / 2} y={Yr[c.row] + H + 22} textAnchor="middle" fontSize="13" fontWeight={hot ? 700 : 400} fill={hot ? amberInk : muted}>{c.label}</text>
      </g>
    })}
    {together
      ? <g>
        <path d={`M${X[0] + 20} 388H${X[1] + W - 14}`} stroke={amber} strokeWidth="3" /><path d={`M${X[1] + W - 2} 388l-12 -7v14z`} fill={amber} />
        <text x={(X[0] + X[1] + W) / 2} y={410} textAnchor="middle" fontSize="13" fontWeight="700" fill={amberInk}>more concentrated: more H⁺ ions, lower pH</text>
      </g>
      : <g fontSize="13" fill={muted}><HIon x={170} y={396} /><text x={186} y={401}>H⁺ ion</text><AcidMolecule x={290} y={396} acid="eth" /><text x={316} y={401}>whole acid molecule</text></g>}
  </Diagram>
}
function ConcScene({ stage }: { stage: ConcStage }) {
  if (stage === 'grid' || stage === 'together') return <GridScene stage={stage} />
  if (stage === 'amount') return <Diagram viewBox="0 0 540 350" title={CONC_TITLES.amount}>
    <TwoTanks left={{ acid: 'hcl', n: 3, i: 3, seed: 21 }} right={{ acid: 'hcl', n: 8, i: 8, seed: 3 }} sub={['hydrochloric acid', 'hydrochloric acid']} labels={['dilute: a little acid', 'concentrated: lots']} hot={[true, true]} />
    <text x={270} y={292} textAnchor="middle" fontSize="13" fill={muted}>same volume of solution in each beaker</text>
    <Key x={270} y={326} acid="hcl" />
  </Diagram>
  const ph = stage === 'ph'
  return <Diagram viewBox="0 0 540 350" title={CONC_TITLES[stage]}>
    <TwoTanks left={{ acid: 'hcl', n: 8, i: 8, seed: 3 }} right={{ acid: 'eth', n: 8, i: 1, seed: 5 }} sub={['hydrochloric acid', 'ethanoic acid']} labels={ph ? ['about pH 1', 'about pH 3'] : ['strong: all ionised', 'weak: 1 in 8 ionised']} hot={[true, true]} />
    {ph && <g>
      <text x={270} y={292} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>same concentration: the stronger acid has the lower pH</text>
    </g>}
    {!ph && <g>
      <text x={270} y={292} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>same concentration: 8 acid particles in each</text>
    </g>}
    <g fontSize="13" fill={muted}><HIon x={150} y={326} /><text x={166} y={331}>H⁺ ion</text>
      <AcidMolecule x={262} y={326} acid="eth" /><text x={290} y={331}>whole ethanoic acid molecule</text></g>
  </Diagram>
}

// ---------- Question visuals ----------
// Two acids with the same number of particles. Acid 1 has 7 whole molecules and 1 ionised (weak); acid 2 is all ions (strong).
function BeakersQuestion({ assessment }: { assessment: boolean }) {
  const L = 34, R = 306, W = 200, Y = 44, H = 168
  return <Diagram viewBox={`0 0 540 ${assessment ? 300 : 330}`} title={assessment
    ? 'Two beakers of acid in water, each made from 8 acid particles. Acid 1 has 7 whole acid molecules, 1 H⁺ ion and 1 negative ion. Acid 2 has 8 H⁺ ions and 8 negative ions and no whole molecules.'
    : 'Acid 1 has 7 whole molecules and only 1 ionised, so it is weak. Acid 2 has ionised completely, so it is strong.'}>
    <text x={L + W / 2} y={26} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>Acid 1</text>
    <text x={R + W / 2} y={26} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>Acid 2</text>
    <Tank x={L} y={Y} w={W} h={H} acid="gen" n={8} ionised={1} seed={41} />
    <Tank x={R} y={Y} w={W} h={H} acid="gen" n={8} ionised={8} seed={42} />
    <text x={270} y={244} textAnchor="middle" fontSize="13" fill={muted}>each beaker started with 8 acid particles</text>
    <Key x={270} y={276} acid="gen" />
    {!assessment && <g><text x={L + W / 2} y={316} textAnchor="middle" fontSize="14" fontWeight="700" fill={good}>weak: most still whole</text><text x={R + W / 2} y={316} textAnchor="middle" fontSize="14" fontWeight="700" fill={good}>strong: all ionised</text></g>}
  </Diagram>
}
// Four numbered beakers, same volume. 1 concentrated weak · 2 concentrated strong · 3 dilute strong · 4 dilute weak.
function GridQuestion({ assessment }: { assessment: boolean }) {
  const X = [44, 300], Yr = [44, 232], W = 196, H = 126
  const cells: Array<{ n: number; c: number; r: number; parts: number; i: number; seed: number; label: string }> = [
    { n: 1, c: 0, r: 0, parts: 8, i: 1, seed: 51, label: 'concentrated, weak' },
    { n: 2, c: 1, r: 0, parts: 8, i: 8, seed: 52, label: 'concentrated, strong' },
    { n: 3, c: 0, r: 1, parts: 3, i: 3, seed: 53, label: 'dilute, strong' },
    { n: 4, c: 1, r: 1, parts: 3, i: 1, seed: 54, label: 'dilute, weak' },
  ]
  return <Diagram viewBox="0 0 540 440" title={assessment
    ? 'Four numbered beakers with the same volume of acid solution. Beaker 1: 7 whole acid molecules and 1 ionised. Beaker 2: 8 acid particles, all ionised. Beaker 3: 3 acid particles, all ionised. Beaker 4: 2 whole acid molecules and 1 ionised.'
    : 'Beaker 1 is concentrated and weak, beaker 2 concentrated and strong, beaker 3 dilute and strong, and beaker 4 dilute and weak.'}>
    {cells.map(c => {
      const right = !assessment && c.n === 3
      return <g key={c.n}>
        <Tank x={X[c.c]} y={Yr[c.r]} w={W} h={H} acid="gen" n={c.parts} ionised={c.i} seed={c.seed} hot={right} />
        <Num n={c.n} x={X[c.c] + W / 2} y={Yr[c.r] - 22} on={false} colour={ink} />
        {!assessment && <text x={X[c.c] + W / 2} y={Yr[c.r] + H + 22} textAnchor="middle" fontSize="13" fontWeight={right ? 700 : 400} fill={right ? good : muted}>{c.label}</text>}
      </g>
    })}
    <Key x={270} y={418} acid="gen" />
  </Diagram>
}
function DataTable() {
  const rows: Array<[string, string]> = [['hydrochloric acid', '1'], ['ethanoic acid', '3'], ['nitric acid', '1'], ['citric acid', '2']]
  return <Diagram viewBox="0 0 540 250" schematic={false} title="A data table of four acid solutions, all at the same concentration. Hydrochloric acid: pH 1. Ethanoic acid: pH 3. Nitric acid: pH 1. Citric acid: pH 2.">
    <text x={30} y={26} fontSize="15" fontWeight="700" fill={ink}>Four acid solutions, all at the same concentration</text>
    <rect x={20} y={40} width={500} height={196} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="14" fontWeight="700" fill={ink}><text x={60} y={72}>acid</text><text x={400} y={72} textAnchor="middle">pH</text></g>
    <path d="M32 86H508" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([name, value], i) => <g key={name} fontSize="16" fill={ink}>
      <text x={60} y={120 + i * 34}>{name}</text><text x={400} y={120 + i * 34} textAnchor="middle" fontWeight="700">{value}</text>
    </g>)}
  </Diagram>
}
// A student's working for a pH fall from 5 to 2. Line 3 multiplies 10 by 3 instead of working out 10³.
function ErrorQuestion({ assessment }: { assessment: boolean }) {
  const lines = ['initial pH = 5, final pH = 2', 'X = 2 − 5 = −3', 'factor = 10 × 3 = 30', 'the H⁺ concentration is 30 times greater']
  return <Diagram viewBox={`0 0 540 ${assessment ? 270 : 318}`} schematic={false} title={assessment
    ? 'A student’s working for the change in H⁺ ion concentration when the pH falls from 5 to 2, in four numbered lines. Line 1: initial pH = 5, final pH = 2. Line 2: X = 2 − 5 = −3. Line 3: factor = 10 × 3 = 30. Line 4: the H⁺ concentration is 30 times greater.'
    : 'The student’s working with line 3 marked wrong. The factor is 10 to the power minus X, which is 10³ = 1000, not 10 × 3.'}>
    <text x={20} y={30} fontSize="16" fontWeight="700" fill={ink}>pH falls from 5 to 2</text>
    <text x={20} y={56} fontSize="15" fill={ink}>factor = 10<tspan dy="-7" fontSize="11">−X</tspan><tspan dy="7">, X = final pH − initial pH</tspan></text>
    <rect x={20} y={70} width={500} height={186} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    {lines.map((l, i) => {
      const y = 108 + i * 42, wrong = !assessment && i === 2
      return <g key={i}>
        {wrong && <rect x={28} y={y - 21} width={484} height={38} rx="8" fill={badSoft} stroke={bad} strokeWidth="1.5" />}
        <Num n={i + 1} x={52} y={y - 2} on={false} colour={wrong ? bad : ink} />
        <text x={78} y={y + 4} fontSize="16" fontWeight="600" fill={wrong ? bad : ink}>{l}</text>
      </g>
    })}
    {!assessment && <text x={20} y={290} fontSize="15" fontWeight="700" fill={good}>factor = 10⁻⁽⁻³⁾ = 10³ = 10 × 10 × 10 = 1000</text>}
  </Diagram>
}

export function HigherAcidStrengthVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'hacid-strong-ionise': return <StrongScene stage="ionise" />
    case 'hacid-strong-strong': return <StrongScene stage="strong" />
    case 'hacid-strong-weak': return <StrongScene stage="weak" />
    case 'hacid-strong-reversible': return <StrongScene stage="reversible" />
    case 'hacid-strong-together': return <StrongScene stage="together" />
    case 'hacid-ph-more': return <PhScene stage="more" />
    case 'hacid-ph-ten': return <PhScene stage="ten" />
    case 'hacid-ph-steps': return <PhScene stage="steps" />
    case 'hacid-ph-up': return <PhScene stage="up" />
    case 'hacid-ph-formula': return <PhScene stage="formula" />
    case 'hacid-worked-steps': return <WorkedSteps />
    case 'hacid-worked-formula': return <WorkedFormula />
    case 'hacid-conc-amount': return <ConcScene stage="amount" />
    case 'hacid-conc-strength': return <ConcScene stage="strength" />
    case 'hacid-conc-ph': return <ConcScene stage="ph" />
    case 'hacid-conc-grid': return <ConcScene stage="grid" />
    case 'hacid-conc-together': return <ConcScene stage="together" />
    case 'hacid-q-beakers': return <BeakersQuestion assessment={assessment} />
    case 'hacid-q-grid': return <GridQuestion assessment={assessment} />
    case 'hacid-data-acids': return <DataTable />
    case 'hacid-question-error': return <ErrorQuestion assessment={assessment} />
    default: return <StrongScene stage="together" />
  }
}
