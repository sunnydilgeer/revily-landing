import { useId, type ReactNode } from 'react'
import { Arrow } from './InfectionVisuals'

/*
 * Chemistry C1a (Chemistry Lesson 1 onwards): atoms, elements and isotopes. Original, code-native schematics; not to scale.
 * Focus ids start with 'atom-'.
 *
 * Particle colour code, the same in every Chemistry lesson:
 *   proton   = coral red circle with a white "+"  (protonFill / protonLine)
 *   neutron  = soft grey circle, no sign          (neutronFill / neutronLine)
 *   electron = small blue circle with a white "−" (electronFill / electronLine), drawn on thin circular shells (Bohr style)
 * The atom's space is a very pale blue wash; the nucleus sits in a pale coral glow. Isotopes of one element share a
 * green hue: the lighter isotope is pale green, the heavier one darker green. Ink and muted greys match the Biology visuals.
 * Every drawn atom is a real one: its protons, neutrons and electrons (and shell arrangement) match its element and mass number.
 */
const ink = '#375a73', muted = '#657a89', faded = 0.28
const protonFill = '#e8837a', protonLine = '#b4524a'
const neutronFill = '#c6ced5', neutronLine = '#7f8c97'
const electronFill = '#3f8fd0', electronLine = '#246aa3'
const shellLine = '#9fb9cb', space = '#f1f7fb', spaceLine = '#cfe0eb', glow = '#fde8e4', plainNucleon = '#f3dcd6', plainNucleonLine = '#c9a49c'
const lightIso = '#d4ecdd', lightIsoLine = '#4f9a74', darkIso = '#4f9a74', darkIsoLine = '#35785a'
const panelFill = '#f7fafc', panelLine = '#d5e2ea'

type Mode = 'on' | 'active' | 'off'
const r1 = (n: number) => Math.round(n * 10) / 10

function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}

// ---------- Particles ----------
function Proton({ x, y, r = 9, sign = true, icon = false }: { x: number; y: number; r?: number; sign?: boolean; icon?: boolean }) {
  return <g data-particle={icon ? undefined : 'proton'}><circle cx={r1(x)} cy={r1(y)} r={r} fill={protonFill} stroke={protonLine} strokeWidth="1.5" />{sign && <text x={r1(x)} y={r1(y + 4.5)} textAnchor="middle" fontSize="13" fontWeight="700" fill="white">+</text>}</g>
}
function Neutron({ x, y, r = 9, icon = false }: { x: number; y: number; r?: number; icon?: boolean }) {
  return <g data-particle={icon ? undefined : 'neutron'}><circle cx={r1(x)} cy={r1(y)} r={r} fill={neutronFill} stroke={neutronLine} strokeWidth="1.5" /></g>
}
function Electron({ x, y, r = 8, sign = true, icon = false }: { x: number; y: number; r?: number; sign?: boolean; icon?: boolean }) {
  return <g data-particle={icon ? undefined : 'electron'}><circle cx={r1(x)} cy={r1(y)} r={r} fill={electronFill} stroke={electronLine} strokeWidth="1.5" />{sign && <text x={r1(x)} y={r1(y + 4.5)} textAnchor="middle" fontSize="13" fontWeight="700" fill="white">−</text>}</g>
}

// Protons and neutrons packed in a small cluster (a sunflower spiral), protons spread evenly through it.
function nucleonSpots(count: number, r: number) {
  return Array.from({ length: count }, (_, i) => {
    const d = r * 1.1 * Math.sqrt(i + 0.3), a = i * 2.39996 + 0.6
    return [r1(Math.cos(a) * d), r1(Math.sin(a) * d)] as const
  })
}
type NucleusMode = 'plain' | 'protons' | 'full'
function Nucleus({ cx, cy, protons, neutrons, r = 10, mode = 'full', signs = true, glowOn = true }: { cx: number; cy: number; protons: number; neutrons: number; r?: number; mode?: NucleusMode; signs?: boolean; glowOn?: boolean }) {
  const total = protons + neutrons, spots = nucleonSpots(total, r)
  const isProton = (i: number) => Math.floor((i + 1) * protons / total) > Math.floor(i * protons / total)
  const extent = r * 1.1 * Math.sqrt(total - 0.7) + r
  return <g>
    {glowOn && <circle cx={cx} cy={cy} r={r1(extent + r * .7)} fill={glow} />}
    {spots.map((_, k) => {
      const i = total - 1 - k, [dx, dy] = spots[i], x = cx + dx, y = cy + dy
      if (mode === 'plain') return <g key={i} data-particle={isProton(i) ? 'proton' : 'neutron'}><circle cx={r1(x)} cy={r1(y)} r={r} fill={plainNucleon} stroke={plainNucleonLine} strokeWidth="1.5" /></g>
      if (isProton(i)) return <Proton key={i} x={x} y={y} r={r} sign={signs} />
      if (mode === 'protons') return <g key={i} data-particle="neutron"><circle cx={r1(x)} cy={r1(y)} r={r} fill="#eef1f3" stroke="#c5ced5" strokeWidth="1.5" /></g>
      return <Neutron key={i} x={x} y={y} r={r} />
    })}
  </g>
}
// Electron shells as thin circles; each shell's electrons spread evenly round it.
const SHELL_START = [180, -90, -45]
function Shells({ cx, cy, radii, electrons, r = 8, signs = true }: { cx: number; cy: number; radii: number[]; electrons: number[]; r?: number; signs?: boolean }) {
  return <g>
    {radii.slice(0, electrons.length).map((radius, i) => <circle key={i} cx={cx} cy={cy} r={radius} fill="none" stroke={shellLine} strokeWidth="1.8" />)}
    {electrons.map((count, s) => Array.from({ length: count }, (_, j) => {
      const a = (SHELL_START[s] + j * 360 / count) * Math.PI / 180
      return <Electron key={`${s}-${j}`} x={cx + Math.cos(a) * radii[s]} y={cy + Math.sin(a) * radii[s]} r={r} sign={signs} />
    }))}
  </g>
}
/** A whole atom. `scale` shrinks it; small atoms drop the + and − signs so no text is under 12px. */
function Atom({ cx, cy, protons, neutrons, electrons, scale = 1, mode = 'full', nucleusOpacity = 1, electronOpacity = 1, cloud = true }: { cx: number; cy: number; protons: number; neutrons: number; electrons: number[]; scale?: number; mode?: NucleusMode; nucleusOpacity?: number; electronOpacity?: number; cloud?: boolean }) {
  const signs = scale >= .78, radii = [62 * scale, 104 * scale, 146 * scale].map(r1)
  const outer = radii[electrons.length - 1] ?? radii[0]
  return <g>
    {cloud && <circle cx={cx} cy={cy} r={r1(outer + 22 * scale)} fill={space} stroke={spaceLine} strokeWidth="1.5" />}
    <g opacity={electronOpacity}><Shells cx={cx} cy={cy} radii={radii} electrons={electrons} r={r1(Math.max(4.5, 8 * scale))} signs={signs} /></g>
    <g opacity={nucleusOpacity}><Nucleus cx={cx} cy={cy} protons={protons} neutrons={neutrons} r={r1(Math.max(5.5, 10 * scale))} mode={mode} signs={signs} /></g>
  </g>
}

// ---------- Numbered key (like the step list in the plant-transport lesson) ----------
function Num({ n, x, y, mode, colour = ink }: { n: number | string; x: number; y: number; mode: Mode; colour?: string }) {
  const active = mode === 'active'
  return <g opacity={mode === 'off' ? .42 : 1}>
    <circle cx={x} cy={y} r="12" fill={active ? colour : 'white'} stroke={active ? colour : ink} strokeWidth="2" />
    <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={active ? 'white' : ink}>{n}</text>
  </g>
}
function KeyRow({ n, x, y, lines, mode, colour = ink, icon }: { n: number; x: number; y: number; lines: string[]; mode: Mode; colour?: string; icon?: ReactNode }) {
  const active = mode === 'active'
  return <g opacity={mode === 'off' ? .42 : 1}>
    <Num n={n} x={x} y={y} mode={mode === 'off' ? 'on' : mode} colour={colour} />
    {icon}
    <text x={x + (icon ? 48 : 22)} y={y + 5 - (lines.length - 1) * 8} fontSize="14" fontWeight={active ? 700 : 600} fill={active ? colour : ink}>{lines.map((l, j) => <tspan key={j} x={x + (icon ? 48 : 22)} dy={j ? 16 : 0}>{l}</tspan>)}</text>
  </g>
}
// A numbered pointer: circle with a leader line ending in a dot on the feature.
function Pointer({ n, x, y, to }: { n: number; x: number; y: number; to: [number, number] }) {
  const angle = Math.atan2(to[1] - y, to[0] - x)
  return <g><path d={`M${r1(x + Math.cos(angle) * 13)} ${r1(y + Math.sin(angle) * 13)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
    <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}
/** "A" with a subscript r, the symbol for relative atomic mass. */
function Ar({ size = 16 }: { size?: number }) {
  return <><tspan fontStyle="italic">A</tspan><tspan dy={size * .3} fontSize={Math.max(12, size * .75)}>r</tspan><tspan dy={-size * .3}>{'​'}</tspan></>
}

// ---------- Section 1: building one lithium-7 atom (3 protons, 4 neutrons, electrons 2,1) ----------
const LI = { protons: 3, neutrons: 4, electrons: [2, 1] }
const BUILD_STEPS: Record<string, number> = { 'atom-build-atom': 0, 'atom-build-nucleus': 1, 'atom-build-proton': 2, 'atom-build-neutron': 3, 'atom-build-electron': 4, 'atom-build-size': 5 }
const BUILD_TITLES = [
  'One lithium atom, drawn millions of times bigger than life: a pale round space with its parts shown faintly. The key lists the parts still to come.',
  'Step 1: the nucleus, a tiny cluster of particles right in the middle of the atom, is highlighted.',
  'Step 2: the protons in the nucleus are highlighted. This lithium atom has 3 protons, each red with a plus sign.',
  'Step 3: the neutrons in the nucleus are highlighted. This lithium atom has 4 neutrons, each grey with no sign.',
  'Step 4: the electrons are highlighted. This lithium atom has 3 electrons, each blue with a minus sign, on two shells around the nucleus: 2 on the inner shell and 1 on the outer shell.',
  'The whole lithium atom. Its radius is about 0.1 nanometres. The nucleus has a radius of about 1 × 10⁻¹⁴ metres, about 1/10 000 of the atom, and holds almost all the mass.',
]
function BuildAtom({ focus }: { focus: string }) {
  const step = BUILD_STEPS[focus] ?? 5
  const cx = 160, cy = 150
  const nucleusShown = step >= 1, electronsShown = step >= 4
  const nucleusOpacity = step === 0 ? faded : step === 4 ? .45 : 1
  const electronOpacity = step === 0 ? faded : step === 5 || step === 4 ? 1 : 0
  const mode: NucleusMode = step >= 3 || step === 0 ? 'full' : step === 2 ? 'protons' : 'plain'
  const keyMode = (n: number): Mode => step === 0 ? 'off' : step === 5 ? 'on' : n === step ? 'active' : n < step ? 'on' : 'off'
  const kx = 330
  return <Diagram viewBox="0 0 540 300" title={BUILD_TITLES[step]}>
    <circle cx={cx} cy={cy} r={122} fill={space} stroke={spaceLine} strokeWidth="1.5" />
    <g opacity={electronOpacity}><Shells cx={cx} cy={cy} radii={[62, 104]} electrons={LI.electrons} /></g>
    {step === 5 && <g><path d={`M${cx} ${cy}L${r1(cx - 122 * Math.cos(.62))} ${r1(cy + 122 * Math.sin(.62))}`} stroke={ink} strokeWidth="2" strokeDasharray="6 4" /><text x={cx - 100} y={cy + 96} textAnchor="end" fontSize="13" fontWeight="700" fill={ink}>radius</text></g>}
    {step === 0 && <g opacity={faded}><Nucleus cx={cx} cy={cy} {...LI} mode="full" /></g>}
    {nucleusShown && <g opacity={nucleusOpacity}><Nucleus cx={cx} cy={cy} {...LI} mode={mode} /></g>}
    {step === 1 && <circle cx={cx} cy={cy} r={46} fill="none" stroke={protonLine} strokeWidth="2.5" strokeDasharray="6 5" />}
    {step === 0 && <g textAnchor="middle">
      <text x={cx} y={cy - 64} fontSize="15" fontWeight="700" fill={ink}>one atom</text>
      <text x={cx} y={cy + 76} fontSize="13" fill={muted}>drawn millions of</text>
      <text x={cx} y={cy + 92} fontSize="13" fill={muted}>times bigger than life</text>
    </g>}
    {step < 5 ? <g>
      <text x={kx - 12} y={36} fontSize="14" fontWeight="700" fill={ink}>Inside the atom</text>
      <KeyRow n={1} x={kx} y={76} lines={['nucleus:', 'the tiny centre']} mode={keyMode(1)} colour={protonLine} />
      <KeyRow n={2} x={kx} y={132} lines={['protons: +']} mode={keyMode(2)} colour={protonLine} icon={<Proton x={kx + 30} y={132} icon />} />
      <KeyRow n={3} x={kx} y={182} lines={['neutrons:', 'no charge']} mode={keyMode(3)} colour={neutronLine} icon={<Neutron x={kx + 30} y={182} icon />} />
      <KeyRow n={4} x={kx} y={238} lines={['electrons: −,', 'in shells']} mode={keyMode(4)} colour={electronLine} icon={<Electron x={kx + 30} y={238} icon />} />
    </g> : <g>
      <path d="M192 126L300 72" stroke={ink} strokeWidth="1.5" /><circle cx={192} cy={126} r="2.8" fill={ink} />
      <g fontSize="14" fill={ink}>
        <text x={306} y={52} fontWeight="700">nucleus</text>
        <text x={306} y={70}>radius about 1 × 10⁻¹⁴ m</text>
        <text x={306} y={88}>(about 1/10 000 of the atom)</text>
        <text x={306} y={106} fontWeight="700" fill={protonLine}>almost all the mass</text>
        <text x={306} y={150} fontWeight="700">whole atom</text>
        <text x={306} y={168}>radius about 0.1 nm</text>
        <text x={306} y={186}>= 1 × 10⁻¹⁰ m</text>
        <text x={306} y={204} fontWeight="700" fill={electronLine}>mostly empty space</text>
      </g>
      <text x={306} y={244} fontSize="12" fill={muted}>Not to scale: a real nucleus would be</text>
      <text x={306} y={260} fontSize="12" fill={muted}>far too small to see at this size.</text>
    </g>}
  </Diagram>
}

// ---------- Section 2: relative mass and relative charge ----------
const PARTICLE_ROWS = [
  { name: 'proton', mass: '1', charge: '+1', colour: protonLine, icon: (x: number, y: number) => <Proton x={x} y={y} icon /> },
  { name: 'neutron', mass: '1', charge: '0', colour: neutronLine, icon: (x: number, y: number) => <Neutron x={x} y={y} icon /> },
  { name: 'electron', mass: 'very small', charge: '−1', colour: electronLine, icon: (x: number, y: number) => <Electron x={x} y={y} icon /> },
]
function ParticleTable({ focus }: { focus: string }) {
  const kind = focus.replace('atom-particle-', '') as 'charge' | 'mass' | 'all'
  const massOpacity = kind === 'charge' ? .22 : kind === 'mass' ? 1 : 1
  const chargeOpacity = kind === 'mass' ? .45 : 1
  const titles = {
    charge: 'Table of the three particles, with relative charge highlighted: proton +1, neutron 0, electron −1. The relative mass column is still faded.',
    mass: 'Table of the three particles, with relative mass highlighted: proton 1, neutron 1, electron very small.',
    all: 'Table of the three particles. Proton: relative mass 1, relative charge +1. Neutron: relative mass 1, charge 0. Electron: relative mass very small, charge −1. An atom has equal numbers of protons and electrons, so it is neutral.',
  }
  const col = { name: 40, mass: 300, charge: 440 }
  return <Diagram viewBox="0 0 540 260" schematic={false} title={titles[kind]}>
    <rect x={20} y={20} width={500} height={206} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    {kind === 'mass' && <rect x={col.mass - 76} y={26} width={152} height={194} rx="8" fill="#fff4e6" />}
    {kind === 'charge' && <rect x={col.charge - 66} y={26} width={132} height={194} rx="8" fill="#fff4e6" />}
    <g fontSize="14" fontWeight="700" fill={ink}>
      <text x={col.name} y={52}>particle</text>
      <text x={col.mass} y={52} textAnchor="middle" opacity={massOpacity}>relative mass</text>
      <text x={col.charge} y={52} textAnchor="middle" opacity={chargeOpacity}>relative charge</text>
    </g>
    <path d="M32 66H508" stroke={panelLine} strokeWidth="1.5" />
    {PARTICLE_ROWS.map((row, i) => {
      const y = 100 + i * 50
      return <g key={row.name}>
        {row.icon(col.name + 12, y)}
        <text x={col.name + 32} y={y + 5} fontSize="15" fontWeight="700" fill={row.colour}>{row.name}</text>
        <text x={col.mass} y={y + 6} textAnchor="middle" fontSize={row.mass.length > 2 ? 15 : 18} fontWeight="700" fill={ink} opacity={massOpacity}>{row.mass}</text>
        <text x={col.charge} y={y + 6} textAnchor="middle" fontSize="18" fontWeight="700" fill={row.colour} opacity={chargeOpacity}>{row.charge}</text>
        {i < 2 && <path d={`M32 ${y + 25}H508`} stroke={panelLine} strokeWidth="1" />}
      </g>
    })}
    {kind === 'all' && <text x={270} y={250} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>An atom has equal numbers of protons and electrons, so it is neutral.</text>}
    {kind === 'mass' && <text x={270} y={250} textAnchor="middle" fontSize="13" fill={muted}>An electron’s mass is tiny compared with a proton or a neutron.</text>}
    {kind === 'charge' && <text x={270} y={250} textAnchor="middle" fontSize="13" fill={muted}>Charges are compared using simple numbers.</text>}
  </Diagram>
}
function Neutral() {
  const cx = 140, cy = 140
  return <Diagram viewBox="0 0 540 280" title="A lithium atom has 3 protons and 3 electrons. The three +1 charges and the three −1 charges add up to zero, so the atom has no overall charge: it is neutral. The 4 neutrons have no charge.">
    <Atom cx={cx} cy={cy} {...LI} />
    <g fontSize="15" fill={ink}>
      <text x={300} y={52} fontWeight="700">lithium atom</text>
      {[0, 1, 2].map(i => <Proton key={`p${i}`} x={310 + i * 24} y={86} icon />)}
      <text x={384} y={91} fontWeight="700" fill={protonLine}>3 protons: +3</text>
      {[0, 1, 2].map(i => <Electron key={`e${i}`} x={310 + i * 24} y={130} icon />)}
      <text x={384} y={135} fontWeight="700" fill={electronLine}>3 electrons: −3</text>
      <path d="M300 156H520" stroke={ink} strokeWidth="1.5" />
      <text x={300} y={184} fontWeight="700">+3 − 3 = 0</text>
      <text x={300} y={208}>no overall charge:</text>
      <text x={300} y={228} fontWeight="700">the atom is neutral</text>
      <text x={300} y={262} fontSize="13" fill={muted}>(the 4 neutrons have no charge)</text>
    </g>
  </Diagram>
}

// ---------- Section 3: the nuclear symbol for lithium-7 ----------
const SYMBOL_STEP: Record<string, number> = { 'atom-symbol-atomic': 2, 'atom-symbol-mass': 1, 'atom-symbol-symbol': 3 }
function NuclearSymbol({ focus }: { focus: string }) {
  const step = SYMBOL_STEP[focus] ?? 0
  const massShown = focus !== 'atom-symbol-atomic'
  const mode = (n: number): Mode => step === 0 ? 'on' : n === step ? 'active' : (n === 1 && !massShown) ? 'off' : 'on'
  const titles: Record<string, string> = {
    'atom-symbol-atomic': 'The nuclear symbol for lithium, with the atomic number 3 at the bottom left highlighted: lithium atoms have 3 protons. The mass number is still faded.',
    'atom-symbol-mass': 'The nuclear symbol for lithium-7, with the mass number 7 at the top left highlighted: 3 protons plus 4 neutrons.',
    'atom-symbol-symbol': 'The nuclear symbol for lithium-7: Li with the mass number 7 at the top left and the atomic number 3 at the bottom left, with three numbered labels.',
  }
  return <Diagram viewBox="0 0 540 270" schematic={false} title={titles[focus] || titles['atom-symbol-symbol']}>
    <rect x={50} y={40} width={200} height={190} rx="14" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g opacity={massShown ? 1 : .22}><text x={116} y={112} textAnchor="end" fontSize="44" fontWeight="700" fill={step === 1 ? protonLine : ink}>7</text></g>
    <text x={116} y={200} textAnchor="end" fontSize="44" fontWeight="700" fill={step === 2 ? protonLine : ink}>3</text>
    <text x={122} y={184} fontSize="100" fontWeight="700" fill={step === 3 ? protonLine : ink}>Li</text>
    <g opacity={massShown ? 1 : .35}><Pointer n={1} x={30} y={68} to={[88, 92]} /></g>
    <Pointer n={2} x={30} y={214} to={[88, 186]} />
    <Pointer n={3} x={276} y={60} to={[222, 132]} />
    <KeyRow n={1} x={318} y={78} lines={['mass number = 7', 'protons + neutrons']} mode={mode(1)} colour={protonLine} />
    <KeyRow n={2} x={318} y={144} lines={['atomic number = 3', 'number of protons']} mode={mode(2)} colour={protonLine} />
    <KeyRow n={3} x={318} y={210} lines={['symbol: Li', 'means lithium']} mode={mode(3)} colour={protonLine} />
  </Diagram>
}
function Counting() {
  return <Diagram viewBox="0 0 540 280" title="Working out the particles in lithium-7 from its nuclear symbol: protons = atomic number = 3; neutrons = mass number − atomic number = 7 − 3 = 4; electrons = protons = 3. The drawing of the atom beside it has 3 protons, 4 neutrons and 3 electrons.">
    <g>
      <text x={92} y={70} textAnchor="end" fontSize="30" fontWeight="700" fill={ink}>7</text>
      <text x={92} y={128} textAnchor="end" fontSize="30" fontWeight="700" fill={ink}>3</text>
      <text x={96} y={118} fontSize="64" fontWeight="700" fill={ink}>Li</text>
    </g>
    <g fontSize="15" fill={ink}>
      <Proton x={48} y={176} icon /><text x={66} y={181}><tspan fontWeight="700" fill={protonLine}>protons</tspan> = atomic number = <tspan fontWeight="700">3</tspan></text>
      <Neutron x={48} y={214} icon /><text x={66} y={219}><tspan fontWeight="700" fill={neutronLine}>neutrons</tspan> = 7 − 3 = <tspan fontWeight="700">4</tspan></text>
      <Electron x={48} y={252} icon /><text x={66} y={257}><tspan fontWeight="700" fill={electronLine}>electrons</tspan> = protons = <tspan fontWeight="700">3</tspan></text>
    </g>
    <Atom cx={420} cy={140} {...LI} scale={.95} />
    <text x={420} y={274} textAnchor="middle" fontSize="13" fill={muted}>lithium-7: check the drawing</text>
  </Diagram>
}
function Ions() {
  return <Diagram viewBox="0 0 540 300" title="A lithium atom has 3 protons and 3 electrons, 2 on the inner shell and 1 on the outer shell. It loses its outer electron and becomes a lithium ion, Li plus, with 3 protons and 2 electrons, so it has an overall charge of plus 1. Below: a positive ion has lost electrons, so electrons = atomic number − charge; a negative ion has gained electrons, so electrons = atomic number + charge.">
    <Atom cx={110} cy={112} {...LI} scale={.8} />
    <text x={110} y={218} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>lithium atom, Li</text>
    <text x={110} y={236} textAnchor="middle" fontSize="13" fill={ink}>3 protons, 3 electrons</text>
    <Arrow x1={214} y1={112} x2={308} y2={112} colour={electronLine} width={3} />
    <text x={261} y={96} textAnchor="middle" fontSize="13" fontWeight="700" fill={electronLine}>loses 1</text>
    <text x={261} y={138} textAnchor="middle" fontSize="13" fontWeight="700" fill={electronLine}>electron</text>
    <Atom cx={420} cy={112} protons={3} neutrons={4} electrons={[2]} scale={.8} />
    <path d="M362 48Q352 112 362 176M478 48Q488 112 478 176" fill="none" stroke={ink} strokeWidth="2" />
    <text x={488} y={56} fontSize="22" fontWeight="700" fill={protonLine}>+</text>
    <text x={420} y={218} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>lithium ion, Li⁺</text>
    <text x={420} y={236} textAnchor="middle" fontSize="13" fill={ink}>3 protons, 3 − 1 = 2 electrons</text>
    <rect x={20} y={252} width={500} height={42} rx="8" fill={panelFill} stroke={panelLine} />
    <text x={34} y={270} fontSize="13" fill={ink}><tspan fontWeight="700">positive ion:</tspan> electrons = atomic number − charge</text>
    <text x={34} y={287} fontSize="13" fill={ink}><tspan fontWeight="700">negative ion:</tspan> electrons = atomic number + charge (F⁻: 9 + 1 = 10)</text>
  </Diagram>
}

// ---------- Section 4: elements, symbols and isotopes ----------
function ElementSame() {
  return <Diagram viewBox="0 0 540 250" title="Three lithium atoms, each with 3 protons, 4 neutrons and 3 electrons, are grouped together as one element, lithium. Beside them, a helium atom has 2 protons, 2 neutrons and 2 electrons, so it is a different element.">
    {[80, 200, 320].map(x => <Atom key={x} cx={x} cy={100} {...LI} scale={.5} />)}
    <Atom cx={462} cy={100} protons={2} neutrons={2} electrons={[2]} scale={.5} />
    <path d="M22 178V186H378V178" fill="none" stroke={protonLine} strokeWidth="2" />
    <text x={200} y={208} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>all have 3 protons: lithium</text>
    <text x={200} y={228} textAnchor="middle" fontSize="13" fill={muted}>atoms with the same number of protons = one element</text>
    <path d="M400 30V170" stroke={panelLine} strokeWidth="2" strokeDasharray="5 5" />
    <text x={462} y={208} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>2 protons:</text>
    <text x={462} y={228} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>helium</text>
  </Diagram>
}
const TILES = [['H', 'hydrogen'], ['He', 'helium'], ['Li', 'lithium'], ['C', 'carbon'], ['O', 'oxygen'], ['Na', 'sodium'], ['Cl', 'chlorine'], ['Fe', 'iron']]
function Symbols() {
  return <Diagram viewBox="0 0 540 270" schematic={false} title="Eight element symbols on tiles: H hydrogen, He helium, Li lithium, C carbon, O oxygen, Na sodium, Cl chlorine and Fe iron. Na and Fe come from old names. The first letter is always a capital; a second letter is always small.">
    {TILES.map(([symbol, name], i) => {
      const x = 30 + (i % 4) * 124, y = 18 + Math.floor(i / 4) * 106, old = symbol === 'Na' || symbol === 'Fe'
      return <g key={symbol}>
        <rect x={x} y={y} width={108} height={92} rx="10" fill={old ? '#fff4e6' : panelFill} stroke={old ? '#d9a55b' : panelLine} strokeWidth="2" />
        <text x={x + 54} y={y + 50} textAnchor="middle" fontSize="36" fontWeight="700" fill={ink}>{symbol}</text>
        <text x={x + 54} y={y + 76} textAnchor="middle" fontSize="14" fill={ink}>{name}</text>
      </g>
    })}
    <rect x={30} y={236} width={14} height={14} rx="3" fill="#fff4e6" stroke="#d9a55b" strokeWidth="2" />
    <text x={52} y={248} fontSize="13" fill={ink}>from old names</text>
    <text x={510} y={248} textAnchor="end" fontSize="13" fontWeight="700" fill={ink}>First letter capital, second letter small.</text>
  </Diagram>
}
function Isotopes({ focus }: { focus: string }) {
  const all = focus === 'atom-isotope-all'
  const atoms = [{ x: 130, neutrons: 3, name: 'lithium-6', fill: lightIso, line: lightIsoLine }, { x: 410, neutrons: 4, name: 'lithium-7', fill: darkIso, line: darkIsoLine }]
  const rows: Array<[string, string, string, boolean]> = [['protons', '3', '3', true], ['electrons', '3', '3', true], ['neutrons', '3', '4', false], ['mass number', '6', '7', false]]
  const col = [250, 360]
  return <Diagram viewBox="0 0 540 350" title={all ? 'Lithium-6 and lithium-7 side by side. Both have 3 protons and 3 electrons (the same). Lithium-6 has 3 neutrons and mass number 6; lithium-7 has 4 neutrons and mass number 7 (different).' : 'Two isotopes of lithium side by side. Lithium-6 has 3 protons, 3 neutrons and 3 electrons. Lithium-7 has 3 protons, 4 neutrons and 3 electrons. The neutrons are the only difference.'}>
    {atoms.map(atom => <g key={atom.name}>
      <rect x={atom.x - 58} y={4} width={116} height={26} rx="13" fill={atom.fill} stroke={atom.line} strokeWidth="1.5" />
      <text x={atom.x} y={22} textAnchor="middle" fontSize="15" fontWeight="700" fill={atom.fill === darkIso ? 'white' : darkIsoLine}>{atom.name}</text>
      <Atom cx={atom.x} cy={all ? 118 : 126} protons={3} neutrons={atom.neutrons} electrons={[2, 1]} scale={all ? .74 : .78} />
    </g>)}
    <text x={270} y={120} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>same</text>
    <text x={270} y={138} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>element</text>
    {!all && <g>
      {atoms.map(atom => <text key={atom.name} x={atom.x} y={240} textAnchor="middle" fontSize="15" fontWeight="700"><tspan fill={protonLine}>3 protons</tspan><tspan fill={ink}>, </tspan><tspan fill={neutronLine}>{atom.neutrons} neutrons</tspan></text>)}
      <rect x={20} y={264} width={500} height={70} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
      <text x={270} y={292} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>same number of protons → same element</text>
      <text x={270} y={316} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>different number of neutrons → <tspan fill={darkIsoLine}>isotopes</tspan></text>
    </g>}
    {all && <g>
      <rect x={20} y={214} width={500} height={132} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
      <text x={col[0]} y={236} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>lithium-6</text>
      <text x={col[1]} y={236} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>lithium-7</text>
      <path d="M32 245H508" stroke={panelLine} strokeWidth="1.5" />
      {rows.map(([name, a, b, same], i) => {
        const y = 266 + i * 25
        return <g key={name} fontSize="14" fill={ink}>
          <text x={36} y={y} fontWeight="700">{name}</text>
          <text x={col[0]} y={y} textAnchor="middle" fontWeight="700" fill={darkIsoLine}>{a}</text>
          <text x={col[1]} y={y} textAnchor="middle" fontWeight="700" fill={darkIsoLine}>{b}</text>
          <text x={504} y={y} textAnchor="end" fontWeight="700" fill={same ? lightIsoLine : protonLine}>{same ? 'same' : 'different'}</text>
          {i < 3 && <path d={`M32 ${y + 8}H508`} stroke={panelLine} />}
        </g>
      })}
    </g>}
  </Diagram>
}

// ---------- Section 5: relative atomic mass ----------
// 20 chlorine atoms: 15 chlorine-35 (75%) and 5 chlorine-37 (25%), mixed as in a real sample.
const MIX = [35, 35, 37, 35, 35, 35, 35, 35, 37, 35, 37, 35, 35, 35, 35, 35, 35, 37, 35, 37]
function Mix() {
  return <Diagram viewBox="0 0 540 260" title="A sample of 20 chlorine atoms: 15 are chlorine-35 and 5 are chlorine-37. So 75% are chlorine-35 and 25% are chlorine-37, about 3 in every 4 atoms are chlorine-35.">
    <rect x={20} y={20} width={260} height={214} rx="12" fill={space} stroke={spaceLine} strokeWidth="1.5" />
    {MIX.map((mass, i) => {
      const x = 58 + (i % 5) * 46, y = 58 + Math.floor(i / 5) * 46, heavy = mass === 37
      return <g key={i}><circle cx={x} cy={y} r={heavy ? 19 : 18} fill={heavy ? darkIso : lightIso} stroke={heavy ? darkIsoLine : lightIsoLine} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={heavy ? 'white' : darkIsoLine}>{mass}</text></g>
    })}
    <text x={150} y={254} textAnchor="middle" fontSize="13" fill={muted}>a sample of chlorine atoms</text>
    <g>
      <circle cx={320} cy={70} r="16" fill={lightIso} stroke={lightIsoLine} strokeWidth="2" /><text x={320} y={75} textAnchor="middle" fontSize="13" fontWeight="700" fill={darkIsoLine}>35</text>
      <text x={346} y={66} fontSize="14" fontWeight="700" fill={ink}>chlorine-35</text>
      <text x={346} y={84} fontSize="14" fill={ink}>15 out of 20 = <tspan fontWeight="700">75%</tspan></text>
      <circle cx={320} cy={136} r="16" fill={darkIso} stroke={darkIsoLine} strokeWidth="2" /><text x={320} y={141} textAnchor="middle" fontSize="13" fontWeight="700" fill="white">37</text>
      <text x={346} y={132} fontSize="14" fontWeight="700" fill={ink}>chlorine-37</text>
      <text x={346} y={150} fontSize="14" fill={ink}>5 out of 20 = <tspan fontWeight="700">25%</tspan></text>
      <text x={306} y={200} fontSize="14" fontWeight="700" fill={ink}>How common each isotope is</text>
      <text x={306} y={218} fontSize="14" fontWeight="700" fill={ink}>is its <tspan fill={darkIsoLine}>abundance</tspan>.</text>
    </g>
  </Diagram>
}
function Average() {
  const x = (m: number) => 60 + (m - 34.5) * 140, base = 200
  return <Diagram viewBox="0 0 540 270" schematic={false} title="A number line from 34.5 to 37.5. A tall bar at 35 shows chlorine-35 at 75%; a short bar at 37 shows chlorine-37 at 25%. The relative atomic mass, 35.5, is marked closer to 35 than the halfway point, 36.">
    <path d={`M${x(34.5)} ${base}H${x(37.5)}`} stroke={ink} strokeWidth="2" />
    {[35, 36, 37].map(m => <g key={m}><path d={`M${x(m)} ${base}V${base + 8}`} stroke={ink} strokeWidth="2" /><text x={x(m)} y={base + 26} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{m}</text></g>)}
    <text x={x(37.5)} y={base + 48} textAnchor="end" fontSize="13" fill={muted}>mass number</text>
    <rect x={x(35) - 26} y={base - 120} width={52} height={120} rx="4" fill={lightIso} stroke={lightIsoLine} strokeWidth="2" />
    <text x={x(35)} y={base - 128} textAnchor="middle" fontSize="14" fontWeight="700" fill={darkIsoLine}>75%</text>
    <rect x={x(37) - 26} y={base - 40} width={52} height={40} rx="4" fill={darkIso} stroke={darkIsoLine} strokeWidth="2" />
    <text x={x(37)} y={base - 48} textAnchor="middle" fontSize="14" fontWeight="700" fill={darkIsoLine}>25%</text>
    <path d={`M${x(36)} ${base - 150}V${base}`} stroke={muted} strokeWidth="1.5" strokeDasharray="5 5" />
    <text x={x(36) + 8} y={base - 152} fontSize="13" fill={muted}>halfway: 36</text>
    <path d={`M${x(35.5)} ${base - 180}V${base - 4}`} stroke={protonLine} strokeWidth="3" />
    <path d={`M${x(35.5) - 8} ${base - 14}L${x(35.5)} ${base - 2}L${x(35.5) + 8} ${base - 14}`} fill="none" stroke={protonLine} strokeWidth="3" />
    <text x={x(35.5) - 8} y={base - 186} textAnchor="middle" fontSize="16" fontWeight="700" fill={protonLine}><Ar /> = 35.5</text>
    <text x={x(37.5)} y={98} textAnchor="end" fontSize="13" fill={ink}>closer to 35, because</text>
    <text x={x(37.5)} y={114} textAnchor="end" fontSize="13" fill={ink}>chlorine-35 is more common</text>
  </Diagram>
}
function Fraction({ x, y, top, bottom, width, size = 16 }: { x: number; y: number; top: ReactNode; bottom: ReactNode; width: number; size?: number }) {
  return <g>
    <text x={x} y={y - 10} textAnchor="middle" fontSize={size} fontWeight="700" fill={ink}>{top}</text>
    <path d={`M${x - width / 2} ${y}H${x + width / 2}`} stroke={ink} strokeWidth="2" />
    <text x={x} y={y + size + 8} textAnchor="middle" fontSize={size} fontWeight="700" fill={ink}>{bottom}</text>
  </g>
}
function Rule() {
  return <Diagram viewBox="0 0 540 250" schematic={false} title="The rule for relative atomic mass: relative atomic mass equals the sum of each abundance times its mass number, divided by the total of the abundances. Three steps: multiply, add, divide.">
    <rect x={20} y={20} width={500} height={110} rx="12" fill="#eaf5ee" stroke={lightIsoLine} strokeWidth="1.5" />
    <text x={40} y={82} fontSize="18" fontWeight="700" fill={ink}><Ar size={18} /> =</text>
    <Fraction x={300} y={76} width={390} size={15} top="sum of (abundance × mass number)" bottom="total of the abundances" />
    <KeyRow n={1} x={50} y={164} lines={['multiply']} mode="on" colour={darkIsoLine} />
    <KeyRow n={2} x={214} y={164} lines={['add']} mode="on" colour={darkIsoLine} />
    <KeyRow n={3} x={354} y={164} lines={['divide']} mode="on" colour={darkIsoLine} />
    <text x={270} y={214} textAnchor="middle" fontSize="13" fill={ink}>each mass number × its abundance, then add the answers,</text>
    <text x={270} y={232} textAnchor="middle" fontSize="13" fill={ink}>then divide by the total abundance (100 for percentages)</text>
  </Diagram>
}
function DataTable({ rows, heading, y = 20 }: { rows: Array<[string, number, number]>; heading: string; y?: number }) {
  return <g fontSize="14" fill={ink}>
    <text x={30} y={y + 4} fontWeight="700">{heading}</text>
    <rect x={20} y={y + 18} width={500} height={32 + rows.length * 32} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={40} y={y + 40} fontWeight="700">isotope</text><text x={290} y={y + 40} textAnchor="middle" fontWeight="700">mass number</text><text x={440} y={y + 40} textAnchor="middle" fontWeight="700">abundance (%)</text>
    <path d={`M30 ${y + 50}H510`} stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([name, mass, abundance], i) => <g key={name}>
      <text x={40} y={y + 72 + i * 32}>{name}</text><text x={290} y={y + 72 + i * 32} textAnchor="middle">{mass}</text><text x={440} y={y + 72 + i * 32} textAnchor="middle">{abundance}</text>
    </g>)}
  </g>
}
function Example() {
  return <Diagram viewBox="0 0 540 250" schematic={false} title="Chlorine data: chlorine-35, mass number 35, abundance 75%; chlorine-37, mass number 37, abundance 25%. Below it the rule is set up with these numbers: 35 times 75 plus 37 times 25, all divided by 75 plus 25.">
    <DataTable heading="Isotopes of chlorine" rows={[['chlorine-35', 35, 75], ['chlorine-37', 37, 25]]} />
    <text x={40} y={196} fontSize="17" fontWeight="700" fill={ink}><Ar size={17} /> =</text>
    <Fraction x={236} y={190} width={250} size={17} top="(35 × 75) + (37 × 25)" bottom="75 + 25" />
  </Diagram>
}
function NeonData() {
  return <Diagram viewBox="0 0 540 150" schematic={false} title="Neon data: neon-20, mass number 20, abundance 90%; neon-22, mass number 22, abundance 10%.">
    <DataTable heading="Isotopes of neon" rows={[['neon-20', 20, 90], ['neon-22', 22, 10]]} />
  </Diagram>
}

// ---------- On your own: a beryllium-9 atom (4 protons, 5 neutrons, electrons 2,2) with numbered parts ----------
function AtomQuestion({ assessment }: { assessment: boolean }) {
  const cx = assessment ? 250 : 170, cy = 150, a = Math.PI / 4
  return <Diagram viewBox="0 0 540 300" title={assessment ? 'A drawing of an atom with three parts numbered 1, 2 and 3.' : 'A beryllium atom with 4 protons and 5 neutrons in the nucleus and 4 electrons on two shells. Part 1 is the outer electron shell, part 2 is an electron and part 3 is the nucleus, which holds almost all the mass.'}>
    <Atom cx={cx} cy={cy} protons={4} neutrons={5} electrons={[2, 2]} />
    <Pointer n={1} x={cx - 140} y={40} to={[r1(cx - 104 * Math.cos(a)), r1(cy - 104 * Math.sin(a))]} />
    <Pointer n={2} x={cx + 130} y={34} to={[cx + 7, cy - 104 - 5]} />
    <Pointer n={3} x={cx + 140} y={250} to={[cx + 36, cy + 28]} />
    {!assessment && <g>
      <KeyRow n={1} x={370} y={100} lines={['electron shell']} mode="on" />
      <KeyRow n={2} x={370} y={146} lines={['electron:', 'almost no mass']} mode="on" colour={electronLine} />
      <KeyRow n={3} x={370} y={200} lines={['nucleus: almost', 'all the mass']} mode="active" colour={protonLine} />
    </g>}
  </Diagram>
}

export function AtomVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('atom-build-')) return <BuildAtom focus={focus} />
  if (focus === 'atom-particle-neutral') return <Neutral />
  if (focus.startsWith('atom-particle-')) return <ParticleTable focus={focus} />
  if (focus === 'atom-symbol-count') return <Counting />
  if (focus === 'atom-symbol-ion') return <Ions />
  if (focus.startsWith('atom-symbol-')) return <NuclearSymbol focus={focus} />
  if (focus === 'atom-element-same') return <ElementSame />
  if (focus === 'atom-element-symbols') return <Symbols />
  if (focus.startsWith('atom-isotope-')) return <Isotopes focus={focus} />
  if (focus === 'atom-ram-mix') return <Mix />
  if (focus === 'atom-ram-average') return <Average />
  if (focus === 'atom-ram-rule') return <Rule />
  if (focus === 'atom-ram-example') return <Example />
  if (focus === 'atom-ram-neon') return <NeonData />
  if (focus === 'atom-question') return <AtomQuestion assessment={assessment} />
  return <BuildAtom focus="atom-build-size" />
}

// Shared with later Chemistry lessons so particles and atoms look the same everywhere.
export const atomPalette = { ink, muted, protonFill, protonLine, neutronFill, neutronLine, electronFill, electronLine, shellLine, space, spaceLine, glow, lightIso, lightIsoLine, darkIso, darkIsoLine, panelFill, panelLine }
export { Proton, Neutron, Electron, Nucleus, Shells, Atom }
