import type { ReactNode } from 'react'
import { physicsPalette, PhysicsDiagram, Lines } from './PhysicsKit'
import { Electron, Proton, Nucleus } from './AtomVisuals'
import { nuc, r1, Arrow, WavyArrow, Chip, Callout, AlphaParticle, BetaParticle, NeutronDot, UnstableGlow, StepStrip, Tick, Nuclide, nuclideWidth, type NumVal } from './NuclearModelVisuals'

/*
 * Physics Lesson 35: Nuclear equations. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'nucleq-' and is routed from CellBiologyVisuals.tsx.
 *
 * Nuclear symbols are stacked: mass number (violet) over atomic number (coral), as in the isotopes lesson.
 * The top row of an equation is the mass numbers, the bottom row the atomic numbers; a highlighted row gets a soft band.
 * Alpha = coral cluster of 2 protons + 2 neutrons, beta = blue electron, gamma = green wave. Unknown numbers are dashed "?" boxes.
 */
const P = physicsPalette
const { ink, muted } = nuc
const radiation = '#c7701f'

type Item = { t: 'n'; A: NumVal; Z: NumVal; sym: string; dimA?: boolean; dimZ?: boolean; ringA?: boolean; ringZ?: boolean; symColour?: string } | { t: 'op'; s: string } | { t: 'g' }
function layout(items: Item[], size: number) {
  const opW = size * 1.2
  const widths = items.map(it => it.t === 'n' ? nuclideWidth({ A: it.A, Z: it.Z, sym: it.sym, size }) : it.t === 'op' ? opW : size * .7)
  const xs: number[] = []
  let x = 0
  widths.forEach(w => { xs.push(x); x += w })
  return { xs, widths, total: x }
}
/** One nuclear equation, centred on cx with its symbols' baseline at y. `band` shades the top or bottom row. */
function Equation({ items, cx, y, size = 46, band }: { items: Item[]; cx: number; y: number; size?: number; band?: 'top' | 'bottom' }) {
  const { xs, widths, total } = layout(items, size)
  const x0 = cx - total / 2, n = size * .5
  const bandY = band === 'top' ? y - size * .38 - n * .92 : y + size * .2 - n * .92
  return <g>
    {band && <rect x={r1(x0 - 12)} y={r1(bandY)} width={r1(total + 24)} height={r1(n * 1.24)} rx={r1(n * .62)} fill={band === 'top' ? nuc.massFill : nuc.atomicFill} />}
    {items.map((it, i) => {
      const x = x0 + xs[i]
      if (it.t === 'n') return <Nuclide key={i} x={r1(x)} y={y} A={it.A} Z={it.Z} sym={it.sym} size={size} dimA={it.dimA} dimZ={it.dimZ} ringA={it.ringA} ringZ={it.ringZ} symColour={it.symColour} />
      if (it.t === 'op') return <text key={i} x={r1(x + widths[i] / 2)} y={r1(y - size * .12)} textAnchor="middle" fontSize={size * .72} fontWeight="700" fill={muted}>{it.s}</text>
      return <text key={i} x={r1(x + widths[i] / 2)} y={y} textAnchor="middle" fontSize={size * .9} fontWeight="750" fill={nuc.gamma}>γ</text>
    })}
  </g>
}
/** The x centre of each item in an Equation, for icons drawn above the terms. */
function centres(items: Item[], cx: number, size = 46) {
  const { xs, widths, total } = layout(items, size)
  return xs.map((x, i) => r1(cx - total / 2 + x + widths[i] / 2))
}
const n = (A: NumVal, Z: NumVal, sym: string, extra: Partial<Extract<Item, { t: 'n' }>> = {}): Item => ({ t: 'n', A, Z, sym, ...extra })
const arrow: Item = { t: 'op', s: '→' }, plus: Item = { t: 'op', s: '+' }
function Key({ y = 288 }: { y?: number }) {
  return <g fontSize="13" fontWeight="700">
    <text x={150} y={y} textAnchor="middle" fill={nuc.mass}>top: mass number</text>
    <text x={390} y={y} textAnchor="middle" fill={nuc.atomic}>bottom: atomic number</text>
  </g>
}

/* ---------- Section 2: how a decay is written ---------- */

function Box({ x, lines, children }: { x: number; lines: string[]; children: ReactNode }) {
  return <g>
    <rect x={x} y={64} width={140} height={172} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.6" />
    {children}
    <Lines x={x + 70} y={194} anchor="middle" lines={lines} size={14} />
  </g>
}
function Form() {
  return <PhysicsDiagram title="How a nuclear equation is written: the nucleus before decay, an arrow meaning changes into, then the nucleus after decay plus the radiation given out.">
    <Box x={14} lines={['nucleus', 'before decay']}><UnstableGlow cx={84} cy={124} r={46} /><Nucleus cx={84} cy={124} protons={4} neutrons={5} r={8} glowOn={false} signs={false} /></Box>
    <text x={184} y={158} textAnchor="middle" fontSize="34" fontWeight="700" fill={muted}>→</text>
    <Box x={200} lines={['nucleus', 'after decay']}><Nucleus cx={270} cy={124} protons={3} neutrons={4} r={8} signs={false} /></Box>
    <text x={370} y={158} textAnchor="middle" fontSize="34" fontWeight="700" fill={muted}>+</text>
    <Box x={386} lines={['radiation', 'given out']}><WavyArrow from={[414, 124]} to={[500, 124]} colour={radiation} amp={8} /></Box>
    <Lines x={270} y={276} anchor="middle" lines={['the arrow means “changes into”']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}
function Rule() {
  const items = [n(226, 88, 'Ra', { ringA: true, ringZ: true }), arrow, n(222, 86, 'Rn', { ringA: true, ringZ: true }), plus, n(4, 2, 'He', { ringA: true, ringZ: true })]
  return <PhysicsDiagram schematic={false} title="The balancing rule, shown with radium-226 decaying to radon-222 and an alpha particle. Top row, the mass numbers: 226 = 222 + 4. Bottom row, the atomic numbers: 88 = 86 + 2. Both sides balance.">
    <Equation items={items} cx={270} y={110} size={50} />
    <rect x={70} y={160} width={400} height={44} rx="22" fill={nuc.massFill} />
    <text x={96} y={188} fontSize="15" fontWeight="750" fill={nuc.mass}>top row:</text>
    <text x={300} y={189} textAnchor="middle" fontSize="18" fontWeight="800" fill={nuc.mass}>226 = 222 + 4</text>
    <Tick x={446} y={182} s={.9} />
    <rect x={70} y={214} width={400} height={44} rx="22" fill={nuc.atomicFill} />
    <text x={96} y={242} fontSize="15" fontWeight="750" fill={nuc.atomic}>bottom row:</text>
    <text x={300} y={243} textAnchor="middle" fontSize="18" fontWeight="800" fill={nuc.atomic}>88 = 86 + 2</text>
    <Tick x={446} y={236} s={.9} />
    <Lines x={270} y={284} anchor="middle" lines={['left total = right total, for both rows']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}
function SymbolCard({ x, title, colour, fill, children, lines }: { x: number; title: string; colour: string; fill: string; children: ReactNode; lines: string[] }) {
  return <g>
    <rect x={x} y={24} width={164} height={236} rx="18" fill={fill} fillOpacity=".45" stroke={colour} strokeWidth="1.8" />
    <Lines x={x + 82} y={50} anchor="middle" lines={[title]} size={15} colour={colour} />
    {children}
    <Lines x={x + 82} y={226} anchor="middle" lines={lines} size={12.5} weight={650} colour={ink} />
  </g>
}
function Symbols() {
  return <PhysicsDiagram schematic={false} title="Symbols for the radiation in nuclear equations: an alpha particle is a helium nucleus, written 4 over 2 He. A beta particle is an electron, written 0 over −1 e. Gamma has no numbers.">
    <SymbolCard x={14} title="alpha, α" colour={nuc.alpha} fill={nuc.alphaFill} lines={['a helium nucleus']}>
      <AlphaParticle x={96} y={96} r={12} />
      <Nuclide x={60} y={186} A={4} Z={2} sym="He" size={46} />
    </SymbolCard>
    <SymbolCard x={188} title="beta, β" colour={nuc.beta} fill={nuc.betaFill} lines={['an electron']}>
      <BetaParticle x={280} y={96} r={12} />
      <Nuclide x={238} y={186} A={0} Z={-1} sym="e" size={46} />
    </SymbolCard>
    <SymbolCard x={362} title="gamma, γ" colour={nuc.gamma} fill={nuc.gammaFill} lines={['no numbers:', 'no particles leave']}>
      <WavyArrow from={[400, 96]} to={[490, 96]} colour={nuc.gamma} amp={7} />
      <text x={444} y={186} textAnchor="middle" fontSize="44" fontWeight="750" fill={nuc.gamma}>γ</text>
    </SymbolCard>
    <Key y={288} />
  </PhysicsDiagram>
}

/* ---------- Section 3: alpha decay ---------- */

function AlphaRule() {
  return <PhysicsDiagram title="Alpha decay: the nucleus gives out an alpha particle, 2 protons and 2 neutrons. The mass number goes down by 4 and the atomic number goes down by 2, so a new element is formed.">
    <Nucleus cx={120} cy={150} protons={8} neutrons={10} r={10} />
    <Arrow from={[190, 128]} to={[256, 96]} colour={nuc.alpha} width={3} />
    <AlphaParticle x={282} y={84} r={12} />
    <Nuclide x={256} y={150} A={4} Z={2} sym="He" size={36} />
    <rect x={338} y={52} width={186} height={48} rx="24" fill={nuc.massFill} />
    <text x={431} y={82} textAnchor="middle" fontSize="16" fontWeight="800" fill={nuc.mass}>mass number − 4</text>
    <rect x={338} y={112} width={186} height={48} rx="24" fill={nuc.atomicFill} />
    <text x={431} y={142} textAnchor="middle" fontSize="16" fontWeight="800" fill={nuc.atomic}>atomic number − 2</text>
    <Chip x={431} y={206} w={186} text="new element formed" size={14} colour={nuc.good} fill="#eef7f1" />
    <Lines x={120} y={256} anchor="middle" lines={['2 protons and 2 neutrons', 'leave the nucleus']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}
const PO_ITEMS = (a: NumVal, z: NumVal, band?: 'top' | 'bottom'): Item[] => [
  n(210, 84, 'Po', { dimZ: band === 'top', dimA: band === 'bottom' }), arrow,
  n(a, z, 'Pb', { dimZ: band === 'top' && z !== '?', dimA: band === 'bottom' }), plus,
  n(4, 2, 'He', { dimZ: band === 'top', dimA: band === 'bottom' }),
]
function AlphaWork({ step }: { step: number }) {
  const titles = [
    'Worked example, step 1: polonium-210 decays by alpha emission to lead. Write 210 over 84 Po changes into lead plus 4 over 2 He, with both numbers for lead missing.',
    'Step 2: balance the top row, the mass numbers. 210 = ? + 4, so ? = 206.',
    'Step 3: balance the bottom row, the atomic numbers. 84 = ? + 2, so ? = 82. The equation is 210 over 84 Po changes into 206 over 82 Pb plus 4 over 2 He.',
  ]
  const band = step === 1 ? 'top' : step === 2 ? 'bottom' : undefined
  const items = PO_ITEMS(step >= 1 ? 206 : '?', step >= 2 ? 82 : '?', band)
  const cs = centres(items, 270, 52), right = 270 + layout(items, 52).total / 2
  return <PhysicsDiagram schematic={false} title={titles[step]}>
    <StepStrip steps={['set up', 'top row', 'bottom row']} current={step} x={40} y={12} w={146} gap={10} />
    <Nucleus cx={cs[0]} cy={84} protons={6} neutrons={7} r={4.6} signs={false} />
    <Nucleus cx={cs[2]} cy={84} protons={5} neutrons={7} r={4.6} signs={false} />
    <AlphaParticle x={cs[4]} y={84} r={6} signs={false} />
    <Equation items={items} cx={270} y={170} size={52} band={band} />
    {step === 0 && <Lines x={270} y={236} anchor="middle" lines={['lead is Pb: find its two missing numbers']} size={15} />}
    {step === 1 && <g>
      <text x={270} y={236} textAnchor="middle" fontSize="18" fontWeight="800" fill={nuc.mass}>210 = ? + 4</text>
      <text x={270} y={264} textAnchor="middle" fontSize="16" fontWeight="750" fill={ink}>? = 210 − 4 = <tspan fill={nuc.mass}>206</tspan></text>
    </g>}
    {step === 2 && <g>
      <text x={270} y={236} textAnchor="middle" fontSize="18" fontWeight="800" fill={nuc.atomic}>84 = ? + 2</text>
      <text x={270} y={264} textAnchor="middle" fontSize="16" fontWeight="750" fill={ink}>? = 84 − 2 = <tspan fill={nuc.atomic}>82</tspan></text>
      <Tick x={right + 20} y={146} s={.8} colour={nuc.mass} /><Tick x={right + 20} y={178} s={.8} colour={nuc.atomic} />
      <Lines x={270} y={290} anchor="middle" lines={['check: 206 + 4 = 210 and 82 + 2 = 84']} size={13} weight={650} colour={muted} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 4: beta decay ---------- */

function BetaRule() {
  return <PhysicsDiagram title="Beta decay: inside the nucleus a neutron turns into a proton, and a fast electron, the beta particle, leaves. The atomic number goes up by 1; the mass number stays the same.">
    <Nucleus cx={110} cy={150} protons={6} neutrons={8} r={10} />
    <Arrow from={[166, 118]} to={[226, 80]} colour={nuc.beta} width={2.8} />
    <Electron x={240} y={71} r={10} />
    <Lines x={110} y={250} anchor="middle" lines={['beta particle leaves', 'the nucleus']} size={13} weight={650} colour={muted} />
    <rect x={280} y={112} width={248} height={74} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <NeutronDot x={310} y={150} r={13} />
    <Arrow from={[330, 150]} to={[368, 150]} width={2.4} />
    <Proton x={388} y={150} r={13} />
    <text x={420} y={157} textAnchor="middle" fontSize="20" fontWeight="700" fill={muted}>+</text>
    <Electron x={452} y={150} r={11} />
    <Lines x={404} y={210} anchor="middle" lines={['neutron → proton + electron']} size={13} colour={ink} />
    <rect x={284} y={30} width={240} height={36} rx="18" fill={nuc.atomicFill} />
    <text x={404} y={54} textAnchor="middle" fontSize="15" fontWeight="800" fill={nuc.atomic}>atomic number + 1</text>
    <rect x={284} y={236} width={240} height={36} rx="18" fill={nuc.massFill} />
    <text x={404} y={260} textAnchor="middle" fontSize="15" fontWeight="800" fill={nuc.mass}>mass number: no change</text>
  </PhysicsDiagram>
}
function BetaSymbol() {
  return <PhysicsDiagram schematic={false} title="The beta particle symbol: 0 over −1 e. Its mass number is 0 because an electron has almost no mass, and its atomic number is −1 because of its charge. These numbers keep both rows balanced.">
    <rect x={40} y={50} width={200} height={190} rx="20" fill={nuc.betaFill} fillOpacity=".5" stroke={nuc.beta} strokeWidth="1.8" />
    <Nuclide x={70} y={188} A={0} Z={-1} sym="e" size={104} />
    <Callout at={[290, 84]} to={[120, 110]} lines={['mass number 0', '(almost no mass)']} colour={nuc.mass} size={15} />
    <Callout at={[290, 182]} to={[134, 198]} lines={['atomic number −1', '(charge of −1)']} colour={nuc.atomic} size={15} />
    <Chip x={380} y={262} w={230} text="keeps the rows balanced" size={14} />
  </PhysicsDiagram>
}
function BetaWork() {
  const items = [n(14, 6, 'C'), arrow, n(14, 7, 'N'), plus, n(0, -1, 'e')]
  return <PhysicsDiagram schematic={false} title="Carbon-14 decays by beta emission to nitrogen-14: 14 over 6 C changes into 14 over 7 N plus 0 over −1 e. Top row: 14 = 14 + 0. Bottom row: 6 = 7 + (−1). Both balance.">
    <Equation items={items} cx={270} y={96} size={52} />
    <rect x={60} y={138} width={420} height={50} rx="25" fill={nuc.massFill} />
    <text x={88} y={169} fontSize="15" fontWeight="750" fill={nuc.mass}>top row:</text>
    <text x={290} y={170} textAnchor="middle" fontSize="19" fontWeight="800" fill={nuc.mass}>14 = 14 + 0</text>
    <Tick x={452} y={163} s={.9} colour={nuc.mass} />
    <rect x={60} y={198} width={420} height={50} rx="25" fill={nuc.atomicFill} />
    <text x={88} y={229} fontSize="15" fontWeight="750" fill={nuc.atomic}>bottom row:</text>
    <text x={290} y={230} textAnchor="middle" fontSize="19" fontWeight="800" fill={nuc.atomic}>6 = 7 + (−1)</text>
    <Tick x={452} y={223} s={.9} colour={nuc.atomic} />
    <Lines x={270} y={282} anchor="middle" lines={['the atomic number went up by 1: carbon became nitrogen']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

/* ---------- Section 5: gamma ---------- */

function Gamma() {
  return <PhysicsDiagram title="A nucleus with extra energy gives out a gamma ray, a wave of electromagnetic radiation. No protons or neutrons leave.">
    <circle cx={150} cy={150} r={82} fill={nuc.gammaFill} opacity=".55" />
    <circle cx={150} cy={150} r={64} fill="#fff4dc" />
    <Nucleus cx={150} cy={150} protons={6} neutrons={6} r={11} glowOn={false} />
    <WavyArrow from={[222, 150]} to={[400, 150]} colour={nuc.gamma} amp={9} waves={4} width={3.2} />
    <Lines x={306} y={116} anchor="middle" lines={['gamma ray']} size={15} colour={nuc.gamma} />
    <Lines x={420} y={138} lines={['extra', 'energy', 'leaves']} size={16} />
    <Lines x={150} y={264} anchor="middle" lines={['no protons or neutrons leave']} size={14} weight={650} colour={muted} />
  </PhysicsDiagram>
}
function GammaSame() {
  const items = [n(24, 12, 'Mg'), arrow, n(24, 12, 'Mg'), plus, { t: 'g' } as Item]
  return <PhysicsDiagram schematic={false} title="Gamma decay changes neither number: 24 over 12 Mg changes into 24 over 12 Mg plus a gamma ray. The mass number stays 24 and the atomic number stays 12, so it is the same element.">
    <Equation items={items} cx={270} y={110} size={54} />
    <rect x={60} y={156} width={420} height={44} rx="22" fill={nuc.massFill} />
    <text x={270} y={184} textAnchor="middle" fontSize="16" fontWeight="800" fill={nuc.mass}>mass number: 24 → 24</text>
    <rect x={60} y={208} width={420} height={44} rx="22" fill={nuc.atomicFill} />
    <text x={270} y={236} textAnchor="middle" fontSize="16" fontWeight="800" fill={nuc.atomic}>atomic number: 12 → 12</text>
    <Lines x={270} y={284} anchor="middle" lines={['nothing changes: still the same element']} size={14} colour={nuc.good} />
  </PhysicsDiagram>
}
function QuestionMissing() {
  const items = [n(218, 84, 'Po'), arrow, n(214, '?', 'Pb'), plus, n(4, 2, 'He')]
  return <PhysicsDiagram schematic={false} title="A nuclear equation for alpha decay with one atomic number missing.">
    <Equation items={items} cx={270} y={160} size={58} />
    <Key y={262} />
  </PhysicsDiagram>
}

export function NuclearEquationVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'nucleq-form': return <Form />
    case 'nucleq-rule': return <Rule />
    case 'nucleq-symbols': return <Symbols />
    case 'nucleq-alpha-rule': return <AlphaRule />
    case 'nucleq-alpha-work-1': return <AlphaWork step={0} />
    case 'nucleq-alpha-work-2': return <AlphaWork step={1} />
    case 'nucleq-alpha-work-3': return <AlphaWork step={2} />
    case 'nucleq-beta-rule': return <BetaRule />
    case 'nucleq-beta-symbol': return <BetaSymbol />
    case 'nucleq-beta-work': return <BetaWork />
    case 'nucleq-gamma': return <Gamma />
    case 'nucleq-gamma-same': return <GammaSame />
    case 'nucleq-q-missing': return <QuestionMissing />
    default: return null
  }
}
