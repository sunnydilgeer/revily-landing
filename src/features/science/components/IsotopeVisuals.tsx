import { physicsPalette, PhysicsDiagram, Lines } from './PhysicsKit'
import { Nucleus, Shells } from './AtomVisuals'
import { nuc, Chip, Callout, Nuclide, StepStrip, UnstableGlow, Trefoil, WavyArrow } from './NuclearModelVisuals'

/*
 * Physics Lesson 33: Isotopes. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'isotope-' and is routed from CellBiologyVisuals.tsx.
 *
 * Nuclear symbols use the P4 colours: mass number violet (top), atomic number coral (bottom, the protons' colour).
 * Nuclei are drawn with every proton and neutron, so they can be counted. Radiation from an unstable nucleus is an orange wave.
 */
const P = physicsPalette
const { ink, muted } = nuc
const radiation = '#c7701f'

/* ---------- Section 2: atomic number, mass number, notation ---------- */

function Atomic() {
  return <PhysicsDiagram title="A carbon-12 nucleus with its 6 protons highlighted. The number of protons is the atomic number, the bottom number in the symbol for carbon.">
    <Nucleus cx={140} cy={140} protons={6} neutrons={6} r={14} mode="protons" />
    <Lines x={140} y={250} anchor="middle" lines={['6 protons']} size={16} colour={nuc.protonLine} />
    <Nuclide x={270} y={176} A={12} Z={6} sym="C" size={84} dimA ringZ />
    <Callout at={[410, 214]} to={[322, 196]} lines={['atomic number', '= number of', 'protons']} colour={nuc.atomic} size={15} />
  </PhysicsDiagram>
}
function Mass() {
  return <PhysicsDiagram title="The same carbon-12 nucleus with protons and neutrons both highlighted: 6 protons + 6 neutrons = mass number 12. The electrons are not counted.">
    <Nucleus cx={140} cy={138} protons={6} neutrons={6} r={14} />
    <path d="M86 206q0 10 10 10h34l10 8l10 -8h34q10 0 10 -10" stroke={nuc.mass} strokeWidth="2" fill="none" />
    <Lines x={140} y={250} anchor="middle" lines={['6 protons + 6 neutrons']} size={14} colour={nuc.mass} />
    <g opacity=".45">{[0, 1, 2].map(i => <circle key={i} cx={62 + i * 14} cy={270} r={5.5} fill={nuc.electron} stroke={nuc.electronLine} strokeWidth="1.2" />)}</g>
    <text x={100} y={275} fontSize="13" fontWeight="650" fill={muted}>electrons: not counted</text>
    <Nuclide x={270} y={176} A={12} Z={6} sym="C" size={84} dimZ ringA />
    <Callout at={[410, 70]} to={[322, 96]} lines={['mass number', '= protons', '+ neutrons']} colour={nuc.mass} size={15} />
  </PhysicsDiagram>
}
function Pointer({ n, x, y, to }: { n: number; x: number; y: number; to: [number, number] }) {
  const a = Math.atan2(to[1] - y, to[0] - x)
  return <g><path d={`M${x + Math.cos(a) * 13} ${y + Math.sin(a) * 13}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
    <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{n}</text></g>
}
function Notation() {
  return <PhysicsDiagram title="The symbol for oxygen-16: mass number 16 at the top, atomic number 8 at the bottom, and the element symbol O.">
    <rect x={92} y={42} width={190} height={184} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <Nuclide x={112} y={180} A={16} Z={8} sym="O" size={104} />
    <Pointer n={1} x={60} y={70} to={[118, 104]} />
    <Pointer n={2} x={60} y={218} to={[152, 196]} />
    <Pointer n={3} x={306} y={60} to={[240, 110]} />
    <Lines x={187} y={262} anchor="middle" lines={['oxygen-16']} size={17} />
    {([[1, 'mass number', nuc.mass], [2, 'atomic number', nuc.atomic], [3, 'symbol: oxygen', ink]] as const).map(([n, text, colour], i) => {
      const y = 118 + i * 44
      return <g key={n}><circle cx={356} cy={y} r="12" fill="white" stroke={ink} strokeWidth="2" /><text x={356} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{n}</text>
        <text x={376} y={y + 5} fontSize="15" fontWeight="700" fill={colour}>{text}</text></g>
    })}
  </PhysicsDiagram>
}

/* ---------- Section 3: worked example, counting the particles in oxygen-16 ---------- */

function Work({ step }: { step: number }) {
  const titles = [
    'Worked example, step 1: write the rule. Neutrons = mass number − atomic number.',
    'Step 2: for oxygen-16, neutrons = 16 − 8 = 8. The nucleus has 8 protons and 8 neutrons.',
    'Step 3: check the electrons. The atom has no overall charge, so it has 8 electrons, the same as the protons.',
  ]
  return <PhysicsDiagram schematic={step === 0} title={titles[step]}>
    <StepStrip steps={['write it', 'subtract', 'check']} current={step} x={40} y={12} w={146} gap={10} />
    <rect x={20} y={66} width={150} height={170} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <Nuclide x={36} y={180} A={16} Z={8} sym="O" size={78} />
    <Lines x={95} y={266} anchor="middle" lines={['oxygen-16']} size={14} colour={muted} />
    {step === 0 && <g>
      <rect x={196} y={96} width={330} height={110} rx="18" fill="white" stroke={ink} strokeWidth="2" />
      <text x={361} y={140} textAnchor="middle" fontSize="18" fontWeight="800" fill={ink}>neutrons =</text>
      <text x={361} y={176} textAnchor="middle" fontSize="18" fontWeight="800"><tspan fill={nuc.mass}>mass number</tspan><tspan fill={ink}> − </tspan><tspan fill={nuc.atomic}>atomic number</tspan></text>
      <Lines x={361} y={244} anchor="middle" lines={['(protons + neutrons) − protons']} size={13} weight={650} colour={muted} />
    </g>}
    {step === 1 && <g>
      <text x={200} y={112} fontSize="15" fontWeight="700" fill={muted}>neutrons =</text>
      <text x={200} y={150} fontSize="28" fontWeight="800"><tspan fill={nuc.mass}>16</tspan><tspan fill={ink}> − </tspan><tspan fill={nuc.atomic}>8</tspan><tspan fill={ink}> = 8</tspan></text>
      <Chip x={268} y={196} text="8 neutrons" size={15} colour={nuc.neutronLine} fill="#f1f3f5" />
      <Nucleus cx={440} cy={146} protons={8} neutrons={8} r={12} />
      <Lines x={440} y={250} anchor="middle" lines={['8 protons, 8 neutrons']} size={14} />
    </g>}
    {step === 2 && <g>
      <Shells cx={360} cy={156} radii={[54, 88]} electrons={[2, 6]} r={8} />
      <Nucleus cx={360} cy={156} protons={8} neutrons={8} r={7.5} signs={false} />
      <Lines x={360} y={270} anchor="middle" lines={['8 protons, 8 neutrons, 8 electrons']} size={14} />
      <Lines x={360} y={291} anchor="middle" lines={['no overall charge']} size={14} colour={nuc.good} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 4: isotopes ---------- */

function Def() {
  return <PhysicsDiagram title="Oxygen-16 and oxygen-18 are isotopes: both nuclei have 8 protons, but oxygen-16 has 8 neutrons and oxygen-18 has 10 neutrons.">
    {([[108, 16, 8], [432, 18, 10]] as const).map(([x, a, n]) => <g key={a}>
      <Nuclide x={x - 40} y={52} A={a} Z={8} sym="O" size={40} />
      <Nucleus cx={x} cy={140} protons={8} neutrons={n} r={11} />
      <text x={x} y={228} textAnchor="middle" fontSize="14" fontWeight="700" fill={nuc.protonLine}>8 protons</text>
      <text x={x} y={248} textAnchor="middle" fontSize="14" fontWeight="700" fill={nuc.neutronLine}>{n} neutrons</text>
    </g>)}
    <Chip x={270} y={112} text="same protons" size={13} colour={nuc.protonLine} fill="#fdf1ee" />
    <Chip x={270} y={166} text="different neutrons" size={13} colour={nuc.neutronLine} fill="#f1f3f5" />
    <Lines x={270} y={286} anchor="middle" lines={['same element, different mass number']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}
function Carbon() {
  return <PhysicsDiagram title="Carbon-12 and carbon-14: both have 6 protons. Carbon-12 has 6 neutrons and carbon-14 has 8 neutrons, so their mass numbers are 12 and 14.">
    {([[140, 12, 8 - 2], [400, 14, 8]] as const).map(([x, a, n]) => <g key={a}>
      <Nuclide x={x - 30} y={48} A={a} Z={6} sym="C" size={38} />
      <Nucleus cx={x} cy={118} protons={6} neutrons={n} r={10} />
      <rect x={x - 96} y={184} width={192} height={96} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.4" />
      {([['protons', 6, nuc.protonLine], ['neutrons', n, nuc.neutronLine], ['mass number', a, nuc.mass]] as const).map(([k, v, c], i) => <g key={k}>
        {i > 0 && <path d={`M${x - 84} ${184 + i * 32}H${x + 84}`} stroke={P.panelLine} strokeWidth="1" />}
        <text x={x - 82} y={205 + i * 32} fontSize="13.5" fontWeight="650" fill={ink}>{k}</text>
        <text x={x + 78} y={205 + i * 32} textAnchor="end" fontSize="16" fontWeight="800" fill={c}>{v}</text>
      </g>)}
    </g>)}
    <Lines x={270} y={124} anchor="middle" lines={['isotopes']} size={15} colour={muted} />
  </PhysicsDiagram>
}
function Unstable() {
  return <PhysicsDiagram title="Carbon-12 is stable. Carbon-14 is an unstable isotope: its nucleus decays and gives out radiation.">
    <Nucleus cx={130} cy={130} protons={6} neutrons={6} r={11} />
    <Lines x={130} y={224} anchor="middle" lines={['carbon-12']} size={15} />
    <Chip x={130} y={258} text="stable" size={14} colour={nuc.good} fill="#eef7f1" />
    <UnstableGlow cx={340} cy={130} r={62} />
    <Nucleus cx={340} cy={130} protons={6} neutrons={8} r={11} glowOn={false} />
    <Trefoil x={396} y={62} r={11} />
    <WavyArrow from={[406, 130]} to={[520, 130]} colour={radiation} />
    <Lines x={466} y={108} anchor="middle" lines={['radiation']} size={14} colour={radiation} />
    <Lines x={340} y={224} anchor="middle" lines={['carbon-14']} size={15} />
    <Chip x={340} y={258} text="unstable: gives out radiation" size={13} colour={radiation} fill="#fdf2e6" />
  </PhysicsDiagram>
}
function QuestionNuclei() {
  return <PhysicsDiagram title="Two nuclei made of protons and neutrons, drawn as circles.">
    <Nucleus cx={150} cy={140} protons={3} neutrons={3} r={16} />
    <Nucleus cx={390} cy={140} protons={3} neutrons={4} r={16} />
    <Lines x={150} y={236} anchor="middle" lines={['Atom X']} size={17} />
    <Lines x={390} y={236} anchor="middle" lines={['Atom Y']} size={17} />
    <g transform="translate(212 280)"><circle cx={0} cy={0} r={8} fill={nuc.proton} stroke={nuc.protonLine} strokeWidth="1.4" /><text x={14} y={5} fontSize="13" fontWeight="650" fill={ink}>proton</text>
      <circle cx={84} cy={0} r={8} fill={nuc.neutron} stroke={nuc.neutronLine} strokeWidth="1.4" /><text x={98} y={5} fontSize="13" fontWeight="650" fill={ink}>neutron</text></g>
  </PhysicsDiagram>
}

export function IsotopeVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'isotope-atomic': return <Atomic />
    case 'isotope-mass': return <Mass />
    case 'isotope-notation': return <Notation />
    case 'isotope-work-1': return <Work step={0} />
    case 'isotope-work-2': return <Work step={1} />
    case 'isotope-work-3': return <Work step={2} />
    case 'isotope-def': return <Def />
    case 'isotope-carbon': return <Carbon />
    case 'isotope-unstable': return <Unstable />
    case 'isotope-q-nuclei': return <QuestionNuclei />
    default: return null
  }
}
