import { useId, type ReactNode } from 'react'
import { Arrow } from './InfectionVisuals'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C1a (Chemistry Lesson 3): mixtures and paper chromatography. Original, code-native schematics; not to scale.
 * Focus ids start with 'mix-'. Ink, muted greys, panels and the "active" highlight match AtomVisuals.tsx.
 *
 * Particle colour code (particle boxes): each atom is a soft circle with its symbol inside.
 *   iron = grey, sulfur = yellow, hydrogen = white, oxygen = soft red, nitrogen = soft blue, argon = lavender, carbon = dark grey.
 * Everyday colours (dish and chromatography): iron filings dark grey, sulfur powder yellow, solvent pale blue (water-like),
 * filter paper cream, pencil graphite grey. Dyes: yellow, pink, blue, purple; the black ink spot is a dark violet-black.
 */
const { ink, muted, panelFill, panelLine } = atomPalette
const faded = 0.28
const highlight = '#fff4e6', activeLine = '#c07a22'
const glass = '#eef6fb', glassLine = '#8fb0c4', solvent = '#bcdcf0', solventLine = '#5b9cc8', solventText = '#2f76a8', wet = '#e1eff8'
const paper = '#fffdf6', paperLine = '#c9bfa6', pencil = '#4d5359'
const filing = '#5f6b75', sulfurFill = '#f2c94c', sulfurLine = '#c49a1c'
const inkSpot = '#3b3350'
const dye = { yellow: ['#f4cc3a', '#c29a12'], pink: ['#e8739f', '#b44471'], blue: ['#4f8fd6', '#2d67a8'], purple: ['#8a62b8', '#5f3f8a'], green: ['#3e8f6c', '#2a6a4f'] } as const
type Dye = keyof typeof dye

type Mode = 'on' | 'active' | 'off'
const r1 = (n: number) => Math.round(n * 10) / 10

function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}

// ---------- Numbered key, pointers ----------
function Num({ n, x, y, mode, colour = ink, r = 12 }: { n: number | string; x: number; y: number; mode: Mode; colour?: string; r?: number }) {
  const active = mode === 'active'
  return <g opacity={mode === 'off' ? .42 : 1}>
    <circle cx={x} cy={y} r={r} fill={active ? colour : 'white'} stroke={active ? colour : ink} strokeWidth="2" />
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
function Pointer({ n, x, y, to }: { n: number; x: number; y: number; to: [number, number] }) {
  const angle = Math.atan2(to[1] - y, to[0] - x)
  return <g><path d={`M${r1(x + Math.cos(angle) * 13)} ${r1(y + Math.sin(angle) * 13)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
    <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}
/** Deterministic scatter so every render is identical. */
function scatter(count: number, seed: number) {
  let s = seed
  const next = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
  return Array.from({ length: count }, () => [next(), next(), next()] as const)
}

// ---------- Atoms (particle boxes) ----------
type El = 'Fe' | 'S' | 'H' | 'O' | 'N' | 'Ar' | 'C'
const EL: Record<El, { fill: string; line: string; text: string }> = {
  Fe: { fill: '#bcc6cf', line: '#6b7a88', text: '#33414d' },
  S: { fill: '#f6d65a', line: '#b89220', text: '#5f4a00' },
  H: { fill: '#ffffff', line: '#8fa3b1', text: ink },
  O: { fill: '#f3a8a0', line: '#c0584f', text: '#6e2621' },
  N: { fill: '#aecdea', line: '#4f86b8', text: '#1f4c75' },
  Ar: { fill: '#d6c8ec', line: '#7d62ad', text: '#44306e' },
  C: { fill: '#5d6973', line: '#3c454d', text: '#ffffff' },
}
function Ball({ el, x, y, r = 12, label = true }: { el: El; x: number; y: number; r?: number; label?: boolean }) {
  const c = EL[el]
  return <g data-atom={el}><circle cx={r1(x)} cy={r1(y)} r={r} fill={c.fill} stroke={c.line} strokeWidth="1.5" />
    {label && <text x={r1(x)} y={r1(y + 4.3)} textAnchor="middle" fontSize="12" fontWeight="700" fill={c.text}>{el}</text>}</g>
}
/** A molecule of atoms along a line (angle in degrees): N₂, O₂, H₂, or O=C=O. */
function Molecule({ els, x, y, angle = 0, r = 11, gap = 17 }: { els: El[]; x: number; y: number; angle?: number; r?: number; gap?: number }) {
  const a = angle * Math.PI / 180, start = -(els.length - 1) / 2
  return <g>{els.map((el, i) => <Ball key={i} el={el} x={x + Math.cos(a) * gap * (start + i)} y={y + Math.sin(a) * gap * (start + i)} r={r} />)}</g>
}
/** A water molecule: oxygen with two hydrogens at about 104°. */
function Water({ x, y, angle = 0 }: { x: number; y: number; angle?: number }) {
  const hs = [-52, 52].map(d => (angle + 90 + d) * Math.PI / 180)
  return <g><Ball el="O" x={x} y={y} r={12} />{hs.map((a, i) => <Ball key={i} el="H" x={x + Math.cos(a) * 18} y={y + Math.sin(a) * 18} r={9} />)}</g>
}
/** A small block of touching atoms (a grain of an element, or a piece of a compound lattice). */
function Block({ x, y, cols, rows, el, r = 12 }: { x: number; y: number; cols: number; rows: number; el: (c: number, r: number) => El; r?: number }) {
  const label = r >= 10
  const d = r * 2
  return <g>{Array.from({ length: rows }, (_, j) => Array.from({ length: cols }, (_, i) => <Ball key={`${i}-${j}`} el={el(i, j)} x={x + (i - (cols - 1) / 2) * d} y={y + (j - (rows - 1) / 2) * d} r={r} label={label} />))}</g>
}
const iron = () => 'Fe' as El, sulfur = () => 'S' as El, ironSulfide = (i: number, j: number) => ((i + j) % 2 ? 'S' : 'Fe') as El
function MixtureGrains({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  const r = 12 * scale, s = (n: number) => n * scale
  return <g>
    <Block x={x + s(40)} y={y + s(38)} cols={2} rows={2} el={iron} r={r} />
    <Block x={x + s(108)} y={y + s(50)} cols={2} rows={2} el={sulfur} r={r} />
    <Block x={x + s(42)} y={y + s(110)} cols={2} rows={2} el={sulfur} r={r} />
    <Block x={x + s(108)} y={y + s(118)} cols={2} rows={2} el={iron} r={r} />
  </g>
}

// ---------- C3-02: element, compound, mixture ----------
const KIND_STEP: Record<string, 'recap' | 'mixture' | 'bonds'> = { 'mix-kinds-recap': 'recap', 'mix-kinds-mixture': 'mixture', 'mix-kinds-bonds': 'bonds' }
function KindsBoxes({ focus }: { focus: string }) {
  const step = KIND_STEP[focus] ?? 'recap'
  const cols = [22, 196, 370], w = 148, top = 46, h = 150
  const opacity = step === 'recap' ? [1, 1, faded] : step === 'mixture' ? [.45, .45, 1] : [.45, 1, 1]
  const active = step === 'recap' ? [false, false, false] : step === 'mixture' ? [false, false, true] : [false, true, true]
  const kinds = [
    { name: 'element', what: 'iron', note: 'one kind of atom' },
    { name: 'compound', what: 'iron sulfide', note: step === 'bonds' ? 'bonded together' : 'iron and sulfur bonded' },
    { name: 'mixture', what: 'iron + sulfur', note: step === 'bonds' ? 'no bonds between parts' : 'mixed, not bonded' },
  ]
  const titles = {
    recap: 'Three boxes of particles. Box 1, an element: iron atoms only. Box 2, a compound: iron sulfide, with iron and sulfur atoms bonded in a fixed pattern. Box 3, still faded, is to come.',
    mixture: 'Box 3 is highlighted: a mixture of iron and sulfur. Small grains of iron atoms and small grains of sulfur atoms sit side by side without joining.',
    bonds: 'The compound and the mixture compared. In iron sulfide the iron and sulfur atoms are held by chemical bonds; in the mixture there are no bonds between the grains of iron and sulfur.',
  }
  return <Diagram viewBox="0 0 540 256" title={titles[step]}>
    {kinds.map((k, i) => {
      const x = cols[i]
      return <g key={k.name} opacity={opacity[i]}>
        <Num n={i + 1} x={x + 13} y={24} mode={active[i] ? 'active' : 'on'} colour={activeLine} />
        <text x={x + 32} y={29} fontSize="15" fontWeight="700" fill={active[i] ? activeLine : ink}>{k.name}</text>
        <rect x={x} y={top} width={w} height={h} rx="10" fill={active[i] ? highlight : panelFill} stroke={active[i] ? activeLine : panelLine} strokeWidth={active[i] ? 2.5 : 1.5} />
        {i === 0 && <Block x={x + w / 2} y={top + h / 2} cols={4} rows={4} el={iron} r={13} />}
        {i === 1 && <Block x={x + w / 2} y={top + h / 2} cols={4} rows={4} el={ironSulfide} r={13} />}
        {i === 2 && <MixtureGrains x={x} y={top} />}
        <text x={x + w / 2} y={top + h + 22} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{k.what}</text>
        <text x={x + w / 2} y={top + h + 42} textAnchor="middle" fontSize="13" fontWeight={step === 'bonds' && i > 0 ? 700 : 400} fill={step === 'bonds' && i > 0 ? activeLine : muted}>{k.note}</text>
      </g>
    })}
  </Diagram>
}

// ---------- C3-02: air and crude oil ----------
const AIR: Array<[El[], number]> = [
  [['N', 'N'], 20], [['O', 'O'], -30], [['N', 'N'], 60], [['N', 'N'], 0],
  [['N', 'N'], -15], [['O', 'C', 'O'], 10], [['N', 'N'], 40], [['Ar'], 0],
  [['O', 'O'], 30], [['N', 'N'], -45], [['N', 'N'], 15], [['N', 'N'], 75],
]
function Chain({ x, y, n }: { x: number; y: number; n: number }) {
  const gap = 17, cs = Array.from({ length: n }, (_, i) => x + i * gap)
  const hs: Array<[number, number, number, number]> = []
  cs.forEach(cx => { hs.push([cx, y, cx, y - 12], [cx, y, cx, y + 12]) })
  hs.push([cs[0], y, cs[0] - 13, y], [cs[n - 1], y, cs[n - 1] + 13, y])
  return <g>
    <path d={`M${cs[0]} ${y}H${cs[n - 1]}`} stroke={EL.C.line} strokeWidth="2.5" />
    {hs.map(([x1, y1, x2, y2], i) => <path key={i} d={`M${x1} ${y1}L${x2} ${y2}`} stroke={EL.H.line} strokeWidth="1.5" />)}
    {hs.map(([, , x2, y2], i) => <circle key={`h${i}`} cx={x2} cy={y2} r="4" fill={EL.H.fill} stroke={EL.H.line} strokeWidth="1.3" />)}
    {cs.map((cx, i) => <circle key={`c${i}`} cx={cx} cy={y} r="6.5" fill={EL.C.fill} stroke={EL.C.line} strokeWidth="1.3" />)}
  </g>
}
function Examples({ focus }: { focus: string }) {
  const crude = focus === 'mix-examples-crude'
  const panels = [20, 280], w = 240, top = 42, h = 168
  return <Diagram viewBox="0 0 540 290" title={crude
    ? 'Two boxes. The crude oil box is highlighted: four chains of carbon atoms, 3, 5, 6 and 9 carbons long, each with hydrogen atoms around it. They are different compounds, not bonded to each other. The air box is faded.'
    : 'Two boxes. The air box is highlighted: mostly nitrogen molecules (N₂), some oxygen molecules (O₂), one argon atom (Ar) and one carbon dioxide molecule (CO₂), all moving separately, not bonded to each other. The crude oil box is faded.'}>
    <g opacity={crude ? .32 : 1}>
      <text x={panels[0]} y={28} fontSize="15" fontWeight="700" fill={crude ? ink : activeLine}>Air</text>
      <rect x={panels[0]} y={top} width={w} height={h} rx="10" fill={crude ? panelFill : highlight} stroke={crude ? panelLine : activeLine} strokeWidth={crude ? 1.5 : 2.5} />
      {AIR.map(([els, angle], i) => {
        const col = i % 4, row = Math.floor(i / 4)
        return <Molecule key={i} els={els} x={panels[0] + 32 + col * 58 + (row % 2 ? 6 : 0)} y={top + 30 + row * 54} angle={angle} r={els.length === 1 ? 13 : 10.5} gap={els.length === 3 ? 18 : 17} />
      })}
      <text x={panels[0] + w / 2} y={top + h + 22} textAnchor="middle" fontSize="13" fill={ink}>elements: nitrogen, oxygen, argon</text>
      <text x={panels[0] + w / 2} y={top + h + 40} textAnchor="middle" fontSize="13" fill={ink}>compound: carbon dioxide</text>
      <text x={panels[0] + w / 2} y={top + h + 60} textAnchor="middle" fontSize="12" fill={muted}>mainly nitrogen and oxygen</text>
    </g>
    <g opacity={crude ? 1 : .32}>
      <text x={panels[1]} y={28} fontSize="15" fontWeight="700" fill={crude ? activeLine : ink}>Crude oil</text>
      <rect x={panels[1]} y={top} width={w} height={h} rx="10" fill={crude ? highlight : panelFill} stroke={crude ? activeLine : panelLine} strokeWidth={crude ? 2.5 : 1.5} />
      <Chain x={panels[1] + 34} y={top + 28} n={5} />
      <Chain x={panels[1] + 110} y={top + 66} n={3} />
      <Chain x={panels[1] + 34} y={top + 104} n={9} />
      <Chain x={panels[1] + 78} y={top + 142} n={6} />
      <text x={panels[1] + w / 2} y={top + h + 22} textAnchor="middle" fontSize="13" fill={ink}>many different compounds:</text>
      <text x={panels[1] + w / 2} y={top + h + 40} textAnchor="middle" fontSize="13" fill={ink}>chains of different lengths</text>
      <g fontSize="12" fill={muted}>
        <circle cx={panels[1] + 36} cy={top + h + 56} r="6.5" fill={EL.C.fill} stroke={EL.C.line} strokeWidth="1.3" /><text x={panels[1] + 48} y={top + h + 60}>carbon</text>
        <circle cx={panels[1] + 130} cy={top + h + 56} r="4" fill={EL.H.fill} stroke={EL.H.line} strokeWidth="1.3" /><text x={panels[1] + 140} y={top + h + 60}>hydrogen</text>
      </g>
    </g>
  </Diagram>
}

// ---------- C3-05: iron and sulfur in a dish ----------
function Filings({ cx, cy, rx, ry, count, seed }: { cx: number; cy: number; rx: number; ry: number; count: number; seed: number }) {
  return <g stroke={filing} strokeWidth="2.2">{scatter(count, seed).map(([a, b, c], i) => {
    const t = a * Math.PI * 2, d = Math.sqrt(b), x = cx + Math.cos(t) * rx * d, y = cy + Math.sin(t) * ry * d, ang = c * Math.PI, l = 4
    return <path key={i} d={`M${r1(x - Math.cos(ang) * l)} ${r1(y - Math.sin(ang) * l)}L${r1(x + Math.cos(ang) * l)} ${r1(y + Math.sin(ang) * l)}`} />
  })}</g>
}
function Powder({ cx, cy, rx, ry, count, seed }: { cx: number; cy: number; rx: number; ry: number; count: number; seed: number }) {
  return <g fill={sulfurFill} stroke={sulfurLine} strokeWidth=".8">{scatter(count, seed).map(([a, b], i) => {
    const t = a * Math.PI * 2, d = Math.sqrt(b)
    return <circle key={i} cx={r1(cx + Math.cos(t) * rx * d)} cy={r1(cy + Math.sin(t) * ry * d)} r="2.7" />
  })}</g>
}
function Dish({ cx, cy, rx, children }: { cx: number; cy: number; rx: number; children?: ReactNode }) {
  return <g>
    <path d={`M${cx - rx} ${cy}Q${cx} ${cy + rx * .55} ${cx + rx} ${cy}`} fill="#e9f0f4" stroke={glassLine} strokeWidth="2" />
    <ellipse cx={cx} cy={cy} rx={rx} ry={rx * .16} fill="#f5f9fb" stroke={glassLine} strokeWidth="2" />
    {children}
  </g>
}
function Magnet({ cx, top }: { cx: number; top: number }) {
  const outer = 50, inner = 24, legBottom = top + 92
  return <g>
    <path d={`M${cx - outer} ${legBottom}V${top + outer}A${outer} ${outer} 0 0 1 ${cx + outer} ${top + outer}V${legBottom}H${cx + inner}V${top + outer}A${inner} ${inner} 0 0 0 ${cx - inner} ${top + outer}V${legBottom}Z`} fill="#e0605a" stroke="#a63d38" strokeWidth="2" />
    <rect x={cx - outer} y={legBottom - 16} width={outer - inner} height="16" fill="#d5dade" stroke="#8b949b" strokeWidth="2" />
    <rect x={cx + inner} y={legBottom - 16} width={outer - inner} height="16" fill="#d5dade" stroke="#8b949b" strokeWidth="2" />
  </g>
}
function PropsDish({ focus }: { focus: string }) {
  const step = focus === 'mix-props-magnet' ? 'magnet' : focus === 'mix-props-react' ? 'react' : 'look'
  if (step === 'react') return <Diagram viewBox="0 0 540 280" title="Left: a dish of iron and sulfur, a mixture. An arrow labelled heat strongly, they react, leads to the right: a dish of iron sulfide, a dark solid. It is a compound, a new substance with different properties.">
    <text x={100} y={40} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>iron + sulfur</text>
    <text x={100} y={60} textAnchor="middle" fontSize="13" fill={muted}>a mixture</text>
    <Dish cx={100} cy={150} rx={78}><Powder cx={100} cy={160} rx={58} ry={12} count={70} seed={3} /><Filings cx={100} cy={160} rx={58} ry={12} count={34} seed={11} /></Dish>
    <text x={260} y={128} textAnchor="middle" fontSize="14" fontWeight="700" fill={activeLine}>heat strongly</text>
    <Arrow x1={200} y1={148} x2={318} y2={148} colour={activeLine} width={3} />
    <text x={260} y={174} textAnchor="middle" fontSize="13" fill={ink}>they react</text>
    <text x={428} y={40} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>iron sulfide</text>
    <text x={428} y={60} textAnchor="middle" fontSize="13" fill={muted}>a compound: a new substance</text>
    <Dish cx={428} cy={150} rx={86}>
      <g fill="#474c53" stroke="#2c3035" strokeWidth="1">{scatter(22, 7).map(([a, b, c], i) => {
        const t = a * Math.PI * 2, d = Math.sqrt(b), x = 428 + Math.cos(t) * 62 * d, y = 160 + Math.sin(t) * 12 * d, s = 4 + c * 3
        return <path key={i} d={`M${r1(x - s)} ${r1(y)}L${r1(x - s * .3)} ${r1(y - s * .8)}L${r1(x + s)} ${r1(y - s * .3)}L${r1(x + s * .5)} ${r1(y + s * .6)}Z`} />
      })}</g>
    </Dish>
    <rect x={40} y={222} width={460} height={42} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={270} y={248} textAnchor="middle" fontSize="14" fill={ink}>Iron sulfide’s properties are different from iron’s and sulfur’s.</text>
  </Diagram>
  const magnet = step === 'magnet'
  return <Diagram viewBox="0 0 540 290" title={magnet
    ? 'A magnet held over the dish has pulled the grey iron filings up onto its ends. The yellow sulfur powder is left behind in the dish. Each part of the mixture keeps its own properties.'
    : 'A glass dish holding a mixture of grey iron filings and yellow sulfur powder. Key: iron is grey and attracted to a magnet; sulfur is yellow and not attracted to a magnet.'}>
    <Dish cx={150} cy={222} rx={122}>
      <Powder cx={150} cy={232} rx={96} ry={16} count={130} seed={5} />
      {!magnet && <Filings cx={150} cy={232} rx={96} ry={16} count={70} seed={13} />}
    </Dish>
    {!magnet && <g textAnchor="middle"><text x={150} y={140} fontSize="15" fontWeight="700" fill={ink}>iron + sulfur</text><text x={150} y={160} fontSize="13" fill={muted}>mixed together in a dish</text></g>}
    {magnet && <g>
      <Magnet cx={150} top={30} />
      <Filings cx={112} cy={130} rx={16} ry={6} count={20} seed={17} />
      <Filings cx={188} cy={130} rx={16} ry={6} count={20} seed={19} />
      <Arrow x1={234} y1={200} x2={234} y2={128} colour={filing} width={2.5} />
      <text x={242} y={160} fontSize="13" fontWeight="700" fill={filing}>iron</text>
      <text x={242} y={176} fontSize="13" fontWeight="700" fill={filing}>pulled up</text>
    </g>}
    <text x={330} y={42} fontSize="15" fontWeight="700" fill={ink}>{magnet ? 'Each part keeps' : 'Properties'}</text>
    {magnet && <text x={330} y={62} fontSize="15" fontWeight="700" fill={ink}>its own properties</text>}
    <g transform={`translate(0 ${magnet ? 20 : 0})`}>
      <rect x={314} y={76} width={214} height={70} rx="10" fill={magnet ? highlight : panelFill} stroke={magnet ? activeLine : panelLine} strokeWidth="1.5" />
      <Filings cx={340} cy={111} rx={12} ry={10} count={8} seed={23} />
      <text x={362} y={100} fontSize="14" fontWeight="700" fill={ink}>iron</text>
      <text x={362} y={118} fontSize="13" fill={ink}>grey</text>
      <text x={362} y={134} fontSize="13" fill={ink}>attracted to a magnet</text>
      <rect x={314} y={160} width={214} height={70} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
      <Powder cx={340} cy={195} rx={12} ry={10} count={12} seed={29} />
      <text x={362} y={184} fontSize="14" fontWeight="700" fill={ink}>sulfur</text>
      <text x={362} y={202} fontSize="13" fill={ink}>yellow</text>
      <text x={362} y={218} fontSize="13" fill={ink}>not attracted</text>
    </g>
  </Diagram>
}

// ---------- C3-08: separating ----------
function Separation({ focus }: { focus: string }) {
  const compare = focus === 'mix-sep-compare'
  const box = (x: number, y: number, active = false) => <rect x={x} y={y} width={112} height={100} rx="10" fill={active ? highlight : panelFill} stroke={active ? activeLine : panelLine} strokeWidth={active ? 2 : 1.5} />
  return <Diagram viewBox="0 0 540 300" title={compare
    ? 'Top row: a mixture of iron and sulfur is separated by a physical method, a magnet, giving back iron and sulfur, with no new substances. Bottom row: iron sulfide, a compound, cannot be separated by a physical method because its atoms are bonded; only a chemical reaction can split it.'
    : 'A mixture of iron and sulfur grains goes through a physical method, a magnet, and comes out as iron and sulfur separately: the same substances, with no new substances made.'}>
    <g>
      {box(16, 24)}<MixtureGrains x={16} y={24} scale={.66} />
      <text x={72} y={142} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>mixture</text>
      <text x={196} y={58} textAnchor="middle" fontSize="13" fontWeight="700" fill={activeLine}>physical method</text>
      <Arrow x1={146} y1={74} x2={246} y2={74} colour={activeLine} width={3} />
      <text x={196} y={98} textAnchor="middle" fontSize="13" fill={ink}>(a magnet)</text>
      {box(264, 24, true)}<Block x={320} y={74} cols={3} rows={3} el={iron} r={11} />
      <text x={392} y={80} textAnchor="middle" fontSize="20" fontWeight="700" fill={ink}>+</text>
      {box(412, 24, true)}<Block x={468} y={74} cols={3} rows={3} el={sulfur} r={11} />
      <text x={320} y={142} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>iron</text>
      <text x={468} y={142} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>sulfur</text>
      <text x={394} y={164} textAnchor="middle" fontSize="13" fontWeight="700" fill={activeLine}>same substances: nothing new</text>
    </g>
    <g opacity={compare ? 1 : .2}>
      <path d="M16 182H524" stroke={panelLine} strokeWidth="1.5" strokeDasharray="5 5" />
      {box(16, 194)}<Block x={72} y={244} cols={4} rows={4} el={ironSulfide} r={10} />
      <text x={196} y={228} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>physical method</text>
      <Arrow x1={146} y1={244} x2={246} y2={244} colour={muted} width={3} />
      <g stroke="#c0453d" strokeWidth="4"><path d="M184 232L208 256" /><path d="M208 232L184 256" /></g>
      <text x={196} y={276} textAnchor="middle" fontSize="13" fill={ink}>(a magnet)</text>
      <text x={264} y={220} fontSize="14" fontWeight="700" fill={ink}>iron sulfide: a compound</text>
      <text x={264} y={242} fontSize="13" fill={ink}>The atoms are bonded, so a</text>
      <text x={264} y={260} fontSize="13" fill={ink}>physical method cannot split it.</text>
      <text x={264} y={282} fontSize="13" fontWeight="700" fill={activeLine}>Only a chemical reaction can.</text>
    </g>
  </Diagram>
}
function MethodIcon({ kind, x, y }: { kind: number; x: number; y: number }) {
  const s = { stroke: ink, strokeWidth: 1.8, fill: 'none' }
  const beaker = (bx: number, by: number, bw: number, bh: number, liquid?: string) => <g>
    {liquid && <rect x={bx + 1} y={by + bh * .5} width={bw - 2} height={bh * .5 - 1} fill={liquid} />}
    <path d={`M${bx} ${by}V${by + bh}H${bx + bw}V${by}`} {...s} fill="none" /></g>
  if (kind === 0) return <g>{/* filtration */}
    {beaker(x + 18, y + 26, 28, 20, solvent)}
    <path d={`M${x + 12} ${y + 2}H${x + 52}L${x + 34} ${y + 20}V${y + 34}H${x + 30}V${y + 20}Z`} fill={glass} {...{ stroke: ink, strokeWidth: 1.8 }} />
    <path d={`M${x + 17} ${y + 4}L${x + 32} ${y + 18}L${x + 47} ${y + 4}`} stroke={paperLine} strokeWidth="1.8" fill={paper} />
  </g>
  if (kind === 1) return <g>{/* crystallisation */}
    <path d={`M${x + 6} ${y + 24}Q${x + 32} ${y + 50} ${x + 58} ${y + 24}Z`} fill="#eef3f6" stroke={ink} strokeWidth="1.8" />
    {[[20, 28], [30, 31], [40, 28], [27, 25], [35, 25]].map(([dx, dy], i) => <rect key={i} x={x + dx} y={y + dy} width="6" height="6" fill="white" stroke={muted} strokeWidth="1.2" transform={`rotate(${i * 17} ${x + dx + 3} ${y + dy + 3})`} />)}
  </g>
  if (kind === 2) return <g>{/* simple distillation */}
    <circle cx={x + 14} cy={y + 32} r="11" fill={glass} stroke={ink} strokeWidth="1.8" />
    <path d={`M${x + 14} ${y + 21}V${y + 8}L${x + 50} ${y + 24}`} {...s} />
    <path d={`M${x + 24} ${y + 8}L${x + 50} ${y + 20}`} stroke={solventLine} strokeWidth="5" opacity=".5" />
    {beaker(x + 46, y + 30, 16, 16, solvent)}
  </g>
  if (kind === 3) return <g>{/* fractional distillation */}
    <circle cx={x + 14} cy={y + 36} r="10" fill={glass} stroke={ink} strokeWidth="1.8" />
    <rect x={x + 10} y={y} width="8" height="26" fill={glass} stroke={ink} strokeWidth="1.8" />
    {[6, 12, 18].map(dy => <circle key={dy} cx={x + 14} cy={y + dy} r="1.6" fill={muted} />)}
    <path d={`M${x + 18} ${y + 4}L${x + 50} ${y + 22}`} {...s} />
    {beaker(x + 46, y + 30, 16, 16, solvent)}
  </g>
  return <g>{/* chromatography */}
    {beaker(x + 14, y + 2, 36, 44, undefined)}
    <rect x={x + 15} y={y + 38} width="34" height="7" fill={solvent} />
    <rect x={x + 24} y={y + 4} width="16" height="38" fill={paper} stroke={paperLine} strokeWidth="1.3" />
    <circle cx={x + 32} cy={y + 12} r="2.6" fill={dye.yellow[0]} /><circle cx={x + 32} cy={y + 20} r="2.6" fill={dye.pink[0]} /><circle cx={x + 32} cy={y + 28} r="2.6" fill={dye.blue[0]} />
  </g>
}
function Methods() {
  const rows = ['filtration', 'crystallisation', 'simple distillation', 'fractional distillation', 'chromatography']
  return <Diagram viewBox="0 0 540 318" title="Five physical methods for separating mixtures, each with a small icon: filtration, crystallisation, simple distillation and fractional distillation (next lesson), and chromatography (this lesson). None of them makes new substances.">
    <text x={20} y={28} fontSize="15" fontWeight="700" fill={ink}>Physical methods: no new substances made</text>
    {rows.map((name, i) => {
      const y = 42 + i * 54, active = i === 4
      return <g key={name}>
        <rect x={20} y={y} width={500} height={50} rx="10" fill={active ? highlight : panelFill} stroke={active ? activeLine : panelLine} strokeWidth={active ? 2 : 1.5} />
        <MethodIcon kind={i} x={34} y={y + 3} />
        <text x={116} y={y + 30} fontSize="15" fontWeight="700" fill={active ? activeLine : ink}>{name}</text>
        <text x={506} y={y + 30} textAnchor="end" fontSize="13" fontWeight={active ? 700 : 400} fill={active ? activeLine : muted}>{active ? 'this lesson' : 'next lesson'}</text>
      </g>
    })}
  </Diagram>
}

// ---------- Chromatography pieces ----------
function Spot({ x, y, colour, r = 7 }: { x: number; y: number; colour: Dye | 'ink'; r?: number }) {
  const [fill, line] = colour === 'ink' ? [inkSpot, '#221c30'] : dye[colour]
  return <ellipse cx={r1(x)} cy={r1(y)} rx={r + 1} ry={r * .8} fill={fill} stroke={line} strokeWidth="1.2" opacity=".92" />
}
/** Filter paper strip with pencil line; optional damp region up to `front` and dye spots at fractions of the distance run. */
function Strip({ x, y, w, h, line, front, spots = [], ink: inkOn = false, frontMark = false, lineMark = false }: { x: number; y: number; w: number; h: number; line: number; front?: number; spots?: Array<[Dye, number]>; ink?: boolean; frontMark?: boolean; lineMark?: boolean }) {
  const cx = x + w / 2
  return <g>
    <rect x={x} y={y} width={w} height={h} fill={paper} stroke={paperLine} strokeWidth="1.5" />
    {front !== undefined && <rect x={x + .8} y={front} width={w - 1.6} height={y + h - front - .8} fill={wet} />}
    {front !== undefined && <path d={`M${x + 1} ${front}H${x + w - 1}`} stroke={frontMark ? solventLine : '#c4dcec'} strokeWidth={frontMark ? 2.5 : 1.2} strokeDasharray={frontMark ? '6 4' : undefined} />}
    <path d={`M${x + 6} ${line}H${x + w - 6}`} stroke={pencil} strokeWidth={lineMark ? 2.6 : 1.6} />
    {inkOn && <Spot x={cx} y={line} colour="ink" />}
    {front !== undefined && spots.map(([c, f], i) => <Spot key={i} x={cx} y={line - f * (line - front)} colour={c} />)}
  </g>
}

// ---------- C3-10: setting up paper chromatography ----------
const CHROM_STEPS: Record<string, number> = { 'mix-chrom-intro': 0, 'mix-chrom-line': 1, 'mix-chrom-spot': 2, 'mix-chrom-solvent': 3, 'mix-chrom-lid': 4, 'mix-chrom-run': 5 }
const CHROM_TITLES = [
  'Paper chromatography set-up, shown faintly: a strip of filter paper hangs from a rod in a beaker, with a lid on top and a shallow layer of solvent at the bottom. The key lists five steps to come.',
  'Step 1: a pencil line is drawn near the bottom of the filter paper. The beaker is shown faintly.',
  'Step 2: a small spot of black ink is put on the pencil line.',
  'Step 3: a shallow layer of solvent is in the beaker. The paper hangs from a rod so its bottom edge dips in, with the pencil line and ink above the solvent.',
  'Step 4: a lid covers the beaker to stop the solvent evaporating.',
  'Step 5: the solvent has soaked part of the way up the paper, carrying the ink. The dyes in the ink are starting to separate: yellow highest, then pink, then blue, with a purple spot still on the pencil line.',
]
function ChromSetup({ focus }: { focus: string }) {
  const step = CHROM_STEPS[focus] ?? 0
  const all = step === 0 ? faded : 1
  const beakerOp = step === 0 ? faded : step < 3 ? .22 : 1
  const lidOp = step === 0 ? faded : step < 4 ? .22 : 1
  const keyMode = (n: number): Mode => step === 0 ? 'off' : n === step ? 'active' : n < step ? 'on' : 'off'
  const colours = [pencil, inkSpot, solventText, '#4f7f9d', solventText]
  const px = 122, pw = 56, pTop = 106, pBottom = 284, lineY = 250, surface = 266
  const running = step === 5 || step === 0
  const front = running ? 176 : undefined
  const tag = (n: number, x: number, y: number, to: [number, number]) => step >= n && step > 0 && <g opacity={n === step || step === 5 ? 1 : .55}><Pointer n={n} x={x} y={y} to={to} /></g>
  return <Diagram viewBox="0 0 540 316" title={CHROM_TITLES[step]}>
    <g opacity={beakerOp}>
      <path d="M70 100V286Q70 298 82 298H218Q230 298 230 286V100" fill={glass} stroke={glassLine} strokeWidth="2.2" />
      <path d={`M71.5 ${surface}H228.5V286Q228.5 296.5 218 296.5H82Q71.5 296.5 71.5 286Z`} fill={solvent} opacity=".85" />
      <path d={`M72 ${surface}H228`} stroke={solventLine} strokeWidth="1.6" />
      <rect x={58} y={96} width={184} height={5} rx="2.5" fill="#c9b08a" stroke="#8a6f45" strokeWidth="1.2" />
      <rect x={142} y={96} width={16} height={14} rx="2" fill="#9aa4ad" stroke="#5f6b75" strokeWidth="1.2" />
    </g>
    <g opacity={lidOp}><rect x={54} y={84} width={192} height={10} rx="3" fill="#dcebf4" stroke={glassLine} strokeWidth="1.8" /></g>
    <g opacity={all}>
      <Strip x={px} y={pTop} w={pw} h={pBottom - pTop} line={lineY} front={front} ink={step === 2 || step === 3 || step === 4} lineMark={step === 1}
        spots={running ? [['yellow', .8], ['pink', .55], ['blue', .3], ['purple', 0]] : []} />
      {step === 1 && <circle cx={px + pw / 2} cy={lineY} r={34} fill="none" stroke={activeLine} strokeWidth="2.2" strokeDasharray="6 5" />}
      {step === 2 && <circle cx={px + pw / 2} cy={lineY} r={18} fill="none" stroke={activeLine} strokeWidth="2.2" strokeDasharray="6 5" />}
      {running && <Arrow x1={104} y1={250} x2={104} y2={186} colour={solventText} width={3} />}
    </g>
    {tag(1, 262, 228, [174, lineY])}
    {tag(2, 38, 222, [px + pw / 2 - 8, lineY])}
    {tag(3, 262, 278, [214, 282])}
    {tag(4, 262, 64, [236, 88])}
    {tag(5, 38, 170, [104, 200])}
    <g>
      <text x={290} y={34} fontSize="14" fontWeight="700" fill={ink}>Setting up</text>
      <KeyRow n={1} x={302} y={76} lines={['pencil line', 'near the bottom']} mode={keyMode(1)} colour={colours[0]} />
      <KeyRow n={2} x={302} y={124} lines={['small spot of ink', 'on the line']} mode={keyMode(2)} colour={colours[1]} />
      <KeyRow n={3} x={302} y={172} lines={['shallow solvent,', 'below the line']} mode={keyMode(3)} colour={colours[2]} />
      <KeyRow n={4} x={302} y={220} lines={['lid: stops the', 'solvent evaporating']} mode={keyMode(4)} colour={colours[3]} />
      <KeyRow n={5} x={302} y={268} lines={['solvent moves up,', 'carrying the ink']} mode={keyMode(5)} colour={colours[4]} />
    </g>
  </Diagram>
}

// ---------- C3-13: reading a chromatogram ----------
const GRAM_STEP: Record<string, 'speeds' | 'spots' | 'insoluble' | 'front' | 'all'> = { 'mix-gram-speeds': 'speeds', 'mix-gram-spots': 'spots', 'mix-gram-insoluble': 'insoluble', 'mix-gram-front': 'front', 'mix-gram-all': 'all' }
const BLACK_INK: Array<[Dye, number]> = [['yellow', .85], ['pink', .58], ['blue', .32], ['purple', 0]]
function Chromatogram({ focus }: { focus: string }) {
  const step = GRAM_STEP[focus] ?? 'all'
  const xs = [24, 116, 208], w = 72, top = 24, h = 232, line = 224
  const fronts = [undefined, 130, 40]
  const paperOp = step === 'speeds' ? [1, 1, .3] : [.4, .4, 1]
  const finished = xs[2] + w / 2
  const at = (f: number) => line - f * (line - 40)
  const titles = {
    speeds: 'Three strips of filter paper: at the start, one dark ink spot on the pencil line; part way, the solvent has carried the dyes up and they are spreading apart; the finished strip is faded. Yellow moves fastest, then pink, then blue.',
    spots: 'The finished chromatogram is highlighted: four spots in different places, yellow near the top, pink, blue, and purple on the pencil line. One spot for each dye, so the ink has four dyes.',
    insoluble: 'On the finished chromatogram, the purple spot on the pencil line is circled. That dye is insoluble in the solvent, so it was not carried up.',
    front: 'On the finished chromatogram, the solvent front is marked with a dashed line near the top: the furthest point the solvent reached. All the dyes that moved are below it.',
    all: 'The finished chromatogram labelled: solvent front at the top; yellow dye moved fastest, nearest the front; pink dye; blue dye; purple dye, insoluble, still on the pencil line.',
  }
  const right = 316
  return <Diagram viewBox="0 0 540 290" title={titles[step]}>
    {xs.map((x, i) => <g key={x} opacity={paperOp[i]}>
      <Strip x={x} y={top} w={w} h={h} line={line} front={i === 0 ? 246 : fronts[i]} ink={i === 0}
        spots={i === 0 ? [] : BLACK_INK} frontMark={i === 2 && (step === 'front' || step === 'all')} lineMark={i === 2 && step === 'insoluble'} />
      <text x={x + w / 2} y={278} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{['start', 'part way', 'finished'][i]}</text>
    </g>)}
    {step === 'speeds' && <g>
      <Arrow x1={xs[0] + w + 4} y1={140} x2={xs[1] - 4} y2={140} colour={muted} width={2} />
      <text x={right} y={46} fontSize="15" fontWeight="700" fill={ink}>Different speeds</text>
      {([['yellow', 'fastest'], ['pink', 'slower'], ['blue', 'slowest of these']] as Array<[Dye, string]>).map(([c, word], i) => <g key={c}>
        <Spot x={right + 10} y={82 + i * 34} colour={c} /><text x={right + 28} y={87 + i * 34} fontSize="14" fill={ink}><tspan fontWeight="700">{c}</tspan>: {word}</text>
      </g>)}
      <text x={right} y={200} fontSize="13" fill={muted}>Each dye moves at its own</text>
      <text x={right} y={216} fontSize="13" fill={muted}>speed, so they spread apart.</text>
    </g>}
    {step === 'spots' && <g>
      <text x={right} y={46} fontSize="15" fontWeight="700" fill={activeLine}>Chromatogram</text>
      <text x={right} y={70} fontSize="14" fill={ink}>one spot for each dye</text>
      {BLACK_INK.map(([c], i) => <Spot key={c} x={right + 12 + i * 30} y={104} colour={c} />)}
      <text x={right + 128} y={109} fontSize="14" fontWeight="700" fill={ink}>= 4 dyes</text>
      <text x={right} y={146} fontSize="13" fill={muted}>Count every spot,</text>
      <text x={right} y={162} fontSize="13" fill={muted}>including any on the line.</text>
    </g>}
    {step === 'insoluble' && <g>
      <circle cx={finished} cy={line} r={16} fill="none" stroke={activeLine} strokeWidth="2.2" strokeDasharray="6 5" />
      <path d={`M${finished + 18} ${line - 6}L${right - 6} ${178}`} stroke={ink} strokeWidth="1.5" />
      <text x={right} y={150} fontSize="15" fontWeight="700" fill={activeLine}>Insoluble dye</text>
      <text x={right} y={174} fontSize="14" fill={ink}>does not dissolve in the</text>
      <text x={right} y={192} fontSize="14" fill={ink}>solvent, so it stays on</text>
      <text x={right} y={210} fontSize="14" fill={ink}>the pencil line</text>
    </g>}
    {step === 'front' && <g>
      <path d={`M${xs[2] + w + 4} 40L${right - 6} 52`} stroke={ink} strokeWidth="1.5" /><circle cx={xs[2] + w + 2} cy={40} r="2.8" fill={ink} />
      <text x={right} y={48} fontSize="15" fontWeight="700" fill={solventText}>Solvent front</text>
      <text x={right} y={70} fontSize="14" fill={ink}>the furthest point the</text>
      <text x={right} y={88} fontSize="14" fill={ink}>solvent reached</text>
      <text x={right} y={120} fontSize="13" fill={muted}>Every dye that dissolved</text>
      <text x={right} y={136} fontSize="13" fill={muted}>is below it.</text>
    </g>}
    {step === 'all' && <g fontSize="13" fill={ink}>
      {([[40, ['solvent front'], solventText], [at(.85), ['yellow dye: moved fastest'], dye.yellow[1]], [at(.58), ['pink dye'], dye.pink[1]], [at(.32), ['blue dye'], dye.blue[1]], [line, ['purple dye: insoluble,', 'stayed on the pencil line'], dye.purple[1]]] as Array<[number, string[], string]>).map(([y, lines, colour], i) => {
        const ty = i === 0 ? 40 : y
        return <g key={i}>
          <path d={`M${finished + (i === 0 ? w / 2 - 2 : 10)} ${y}L${right - 6} ${ty}`} stroke={ink} strokeWidth="1.3" /><circle cx={finished + (i === 0 ? w / 2 - 2 : 10)} cy={y} r="2.5" fill={ink} />
          <text x={right} y={ty + 5} fontWeight="700" fill={colour}>{lines.map((l, j) => <tspan key={j} x={right} dy={j ? 16 : 0}>{l}</tspan>)}</text>
        </g>
      })}
    </g>}
  </Diagram>
}

// ---------- Question visuals ----------
function GramQuestion({ assessment }: { assessment: boolean }) {
  const x = 230, w = 80, top = 20, h = 250, line = 236, front = 48, cx = x + w / 2
  const at = (f: number) => line - f * (line - front)
  return <Diagram viewBox="0 0 540 290" title={assessment
    ? 'A chromatogram of a green ink on a strip of filter paper, with a pencil line near the bottom and three numbered pointers: 1 at the top edge of the damp paper, 2 at a spot on the pencil line, 3 at a blue spot part way up. A yellow spot is higher up.'
    : 'A chromatogram of a green ink. 1 is the solvent front. 2 is a green dye still on the pencil line: it did not dissolve. 3 is a blue dye that moved up. A yellow dye moved further.'}>
    <Strip x={x} y={top} w={w} h={h} line={line} front={front} spots={[['yellow', .78], ['blue', .4], ['green', 0]]} />
    <Pointer n={1} x={420} y={56} to={[x + w - 4, front]} />
    <Pointer n={2} x={140} y={226} to={[cx - 3, line + 1]} />
    <Pointer n={3} x={420} y={176} to={[cx + 8, at(.4)]} />
    {!assessment && <g fontSize="13" fill={ink}>
      <text x={20} y={40} fontWeight="700">Key</text>
      <text x={20} y={60}>1 solvent front</text>
      <text x={20} y={78}>2 dye that did not dissolve</text>
      <text x={20} y={96}>3 dye that moved up</text>
    </g>}
  </Diagram>
}
function Pens() {
  const x = 60, w = 350, top = 20, h = 252, line = 234, front = 46
  const lanes: Array<[string, Array<[Dye, number]>]> = [['A', [['blue', .38]]], ['B', [['yellow', .8], ['pink', .56], ['blue', .38]]], ['C', [['pink', .56], ['purple', 0]]]]
  return <Diagram viewBox="0 0 540 290" title="One chromatogram of three inks, A, B and C, spotted on the same pencil line. Ink A gives one blue spot. Ink B gives three spots: yellow, pink and blue. Ink C gives a pink spot, and a purple spot that is still on the pencil line. The solvent front is near the top.">
    <rect x={x} y={top} width={w} height={h} fill={paper} stroke={paperLine} strokeWidth="1.5" />
    <rect x={x + .8} y={front} width={w - 1.6} height={top + h - front - .8} fill={wet} />
    <path d={`M${x + 1} ${front}H${x + w - 1}`} stroke={solventLine} strokeWidth="2" strokeDasharray="6 4" />
    <path d={`M${x + 12} ${line}H${x + w - 12}`} stroke={pencil} strokeWidth="1.8" />
    {lanes.map(([name, spots], i) => {
      const cx = x + 70 + i * 105
      return <g key={name}>
        {spots.map(([c, f], j) => <Spot key={j} x={cx} y={line - f * (line - front)} colour={c} />)}
        <text x={cx} y={line + 24} textAnchor="middle" fontSize="15" fontWeight="700" fill={pencil}>{name}</text>
      </g>
    })}
    <g fontSize="13" fill={muted}>
      <path d={`M${x + w + 4} ${front}H${x + w + 14}`} stroke={muted} strokeWidth="1.4" /><text x={x + w + 18} y={front + 5}>solvent front</text>
      <path d={`M${x + w + 4} ${line}H${x + w + 14}`} stroke={muted} strokeWidth="1.4" /><text x={x + w + 18} y={line + 5}>pencil line</text>
    </g>
  </Diagram>
}
function BoxesQuestion({ assessment }: { assessment: boolean }) {
  const cols = [22, 196, 370], w = 148, top = 42, h = 156
  const cells = [[44, 44], [106, 50], [42, 114], [104, 112]]
  const names = ['compound', 'element', 'mixture']
  return <Diagram viewBox="0 0 540 240" title={assessment
    ? 'Three numbered boxes of particles. Box 1: four particles, each an oxygen atom joined to two hydrogen atoms. Box 2: four particles, each two oxygen atoms joined. Box 3: particles of two hydrogen atoms joined and particles of two oxygen atoms joined, moving separately.'
    : 'Box 1 is a compound, water: each particle is an oxygen atom bonded to two hydrogen atoms. Box 2 is an element, oxygen. Box 3 is a mixture of hydrogen and oxygen particles that are not joined to each other.'}>
    {cols.map((x, i) => <g key={x}>
      <text x={x} y={28} fontSize="15" fontWeight="700" fill={ink}>Box {i + 1}</text>
      <rect x={x} y={top} width={w} height={h} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
      {cells.map(([dx, dy], j) => {
        const angle = [10, 60, -35, 30][j]
        if (i === 0) return <Water key={j} x={x + dx} y={top + dy} angle={angle * 2} />
        if (i === 1 || j % 2 === 0) return <Molecule key={j} els={['O', 'O']} x={x + dx} y={top + dy} angle={angle} r={11} gap={18} />
        return <Molecule key={j} els={['H', 'H']} x={x + dx} y={top + dy} angle={angle} r={9} gap={15} />
      })}
      {!assessment && <text x={x + w / 2} y={top + h + 24} textAnchor="middle" fontSize="14" fontWeight="700" fill={activeLine}>{names[i]}</text>}
    </g>)}
  </Diagram>
}

export function MixtureVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('mix-kinds-')) return <KindsBoxes focus={focus} />
  if (focus.startsWith('mix-examples-')) return <Examples focus={focus} />
  if (focus.startsWith('mix-props-')) return <PropsDish focus={focus} />
  if (focus === 'mix-sep-methods') return <Methods />
  if (focus.startsWith('mix-sep-')) return <Separation focus={focus} />
  if (focus.startsWith('mix-chrom-')) return <ChromSetup focus={focus} />
  if (focus === 'mix-gram-question') return <GramQuestion assessment={assessment} />
  if (focus.startsWith('mix-gram-')) return <Chromatogram focus={focus} />
  if (focus === 'mix-pens') return <Pens />
  if (focus === 'mix-boxes-question') return <BoxesQuestion assessment={assessment} />
  return <p>Missing diagram: {focus}</p>
}
