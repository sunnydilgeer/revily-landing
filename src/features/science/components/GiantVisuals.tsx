import { useId, type ReactNode } from 'react'
import { Arrow } from './InfectionVisuals'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry Lesson 15: polymers, giant covalent structures and the structures of carbon. Original, code-native
 * schematics, all flat 2D sketches of structures that are really 3D. Focus ids start with 'giant-'.
 *
 * Atom colours (one per element, the same in every drawing):
 *   carbon   = soft grey circle (the neutron grey from AtomVisuals)
 *   hydrogen = white circle with a grey edge
 *   oxygen   = amber (oxygen's group tint in the periodic-table lesson)
 *   silicon  = pale grey (carbon's group tint in the periodic-table lesson), drawn larger than oxygen
 *   fluorine = pale blue (the halogen tint in the periodic-table lesson)
 * Covalent bonds are solid ink lines; forces between molecules are dashed lines. Delocalised electrons are small blue
 * dots (the electron blue). Coral red (the proton colour) marks what each frame is about.
 */
const { ink, muted, protonLine, electronFill, electronLine, neutronFill, neutronLine, panelFill, panelLine, glow, space, spaceLine } = atomPalette
const faded = 0.3
const amberFill = '#fff4e6', amberLine = '#d9a55b', amberInk = '#8a5a14'
const blueFill = '#e4f0f9'
const siFill = '#eef1f3', siLine = '#7f8c97'
const hot = protonLine
const r1 = (n: number) => Math.round(n * 10) / 10
type Pt = [number, number]

function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Pointer({ n, x, y, to }: { n: number; x: number; y: number; to: Pt }) {
  const angle = Math.atan2(to[1] - y, to[0] - x)
  return <g><path d={`M${r1(x + Math.cos(angle) * 13)} ${r1(y + Math.sin(angle) * 13)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
    <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}
type Kind = 'b' | 'n' | 'm' | 'r' | 'blue'
/** Right-hand notes: b bold ink, n normal, m muted, r coral (the frame's idea), blue electron blue. '' = small gap. */
function Notes({ x, y, lines }: { x: number; y: number; lines: Array<[string, Kind]> }) {
  const fill = { b: ink, n: ink, m: muted, r: hot, blue: electronLine }
  let dy = 0
  return <g>{lines.map(([text, kind], i) => {
    const gap = text === '' ? 10 : 19
    const el = text === '' ? null : <text key={i} x={x} y={y + dy} fontWeight={kind === 'n' || kind === 'm' ? 400 : 700} fontSize={kind === 'm' ? 13 : 14} fill={fill[kind]}>{text}</text>
    dy += gap
    return el
  })}</g>
}
/** Chemical formula text with real subscripts, e.g. sub('(C2H4)n'): digits become subscripts. */
function Formula({ x, y, text, size = 22, fill = ink, anchor = 'start' }: { x: number; y: number; text: string; size?: number; fill?: string; anchor?: 'start' | 'middle' | 'end' }) {
  const parts = text.split(/(\d+)/).filter(Boolean)
  const sub = Math.max(12, Math.round(size * .68))
  let down = false
  return <text x={x} y={y} fontSize={size} fontWeight="700" fill={fill} textAnchor={anchor}>{parts.map((p, i) => {
    const isNum = /^\d+$/.test(p)
    const dy = isNum && !down ? size * .28 : !isNum && down ? -size * .28 : 0
    down = isNum
    return <tspan key={i} dy={r1(dy)} fontSize={isNum ? sub : size}>{p}</tspan>
  })}</text>
}

// ---------- Atoms ----------
type El = 'C' | 'H' | 'O' | 'Si' | 'F'
const LOOK: Record<El, { fill: string; line: string; text: string }> = {
  C: { fill: neutronFill, line: neutronLine, text: ink },
  H: { fill: 'white', line: neutronLine, text: ink },
  O: { fill: amberFill, line: amberLine, text: amberInk },
  Si: { fill: siFill, line: siLine, text: ink },
  F: { fill: blueFill, line: electronLine, text: electronLine },
}
function Ball({ x, y, el, r, label = false, on = false }: { x: number; y: number; el: El; r: number; label?: boolean; on?: boolean }) {
  const look = LOOK[el]
  return <g><circle cx={r1(x)} cy={r1(y)} r={r} fill={on ? glow : look.fill} stroke={on ? hot : look.line} strokeWidth={on ? 2.5 : 1.6} />
    {label && <text x={r1(x)} y={r1(y + 4.5)} textAnchor="middle" fontSize="12" fontWeight="700" fill={on ? hot : look.text}>{el}</text>}</g>
}
function Bond({ a, b, on = false, w = 3, dashed = false, colour }: { a: Pt; b: Pt; on?: boolean; w?: number; dashed?: boolean; colour?: string }) {
  return <line x1={r1(a[0])} y1={r1(a[1])} x2={r1(b[0])} y2={r1(b[1])} stroke={colour ?? (on ? hot : ink)} strokeWidth={on ? w + 1.2 : w} strokeDasharray={dashed ? '5 5' : undefined} />
}
function FreeElectron({ x, y, r = 5.5 }: { x: number; y: number; r?: number }) {
  return <circle cx={r1(x)} cy={r1(y)} r={r} fill={electronFill} stroke={electronLine} strokeWidth="1.3" />
}

// ---------- Polymers: ball-and-stick ethene and poly(ethene) ----------
function Ethene({ cx, cy }: { cx: number; cy: number }) {
  const c1: Pt = [cx - 16, cy], c2: Pt = [cx + 16, cy]
  const hs: Array<[Pt, Pt]> = [[c1, [cx - 36, cy - 20]], [c1, [cx - 36, cy + 20]], [c2, [cx + 36, cy - 20]], [c2, [cx + 36, cy + 20]]]
  return <g>
    <Bond a={[c1[0], cy - 4]} b={[c2[0], cy - 4]} w={2.2} /><Bond a={[c1[0], cy + 4]} b={[c2[0], cy + 4]} w={2.2} />
    {hs.map(([c, h], i) => <Bond key={i} a={c} b={h} w={2.2} />)}
    {hs.map(([, h], i) => <Ball key={i} x={h[0]} y={h[1]} el="H" r={7} />)}
    <Ball x={c1[0]} y={cy} el="C" r={11} /><Ball x={c2[0]} y={cy} el="C" r={11} />
  </g>
}
/** A poly(ethene) chain, ball-and-stick: carbons in a line, one hydrogen above and one below each. */
function BallChain({ x0, y, n, step = 36, on = false, hGap = 30, cr = 11, hr = 7 }: { x0: number; y: number; n: number; step?: number; on?: boolean; hGap?: number; cr?: number; hr?: number }) {
  const xs = Array.from({ length: n }, (_, i) => x0 + i * step)
  return <g>
    <Bond a={[x0 - step * .75, y]} b={[x0 + (n - 1) * step + step * .75, y]} on={on} w={2.6} />
    {xs.map(x => <g key={x}><Bond a={[x, y]} b={[x, y - hGap]} on={on} w={2.2} /><Bond a={[x, y]} b={[x, y + hGap]} on={on} w={2.2} /></g>)}
    {xs.map(x => <g key={x}><Ball x={x} y={y - hGap} el="H" r={hr} /><Ball x={x} y={y + hGap} el="H" r={hr} /><Ball x={x} y={y} el="C" r={cr} /></g>)}
    {[x0 - step * .75 - 26, x0 + (n - 1) * step + step * .75 + 10].map(dx => [0, 8, 16].map(k => <circle key={`${dx}-${k}`} cx={r1(dx + k)} cy={y} r="2.2" fill={muted} />))}
  </g>
}
function PolyJoin({ stage }: { stage: 'join' | 'bonds' }) {
  const bonds = stage === 'bonds'
  return <Diagram title={bonds
    ? 'The same long poly(ethene) molecule with every bond highlighted. Each carbon atom is joined to the next carbon atom and to two hydrogen atoms by strong covalent bonds, all along the chain.'
    : 'Four small ethene molecules at the top, each two carbon atoms and four hydrogen atoms. An arrow shows many of them joining end to end into one very long molecule, a polymer, drawn as a chain of carbon atoms with hydrogen atoms above and below.'}>
    <g opacity={bonds ? faded : 1}>
      <text x={270} y={26} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>many small molecules (ethene)</text>
      {[90, 210, 330, 450].map(x => <Ethene key={x} cx={x} cy={74} />)}
      <Arrow x1={270} y1={116} x2={270} y2={160} colour={ink} width={2.5} />
      <text x={286} y={144} fontSize="14" fontWeight="700" fill={ink}>join together</text>
    </g>
    <BallChain x0={72} y={218} n={12} on={bonds} />
    {bonds
      ? <g><text x={270} y={288} textAnchor="middle" fontSize="14" fontWeight="700" fill={hot}>every atom joined by strong covalent bonds</text></g>
      : <text x={270} y={288} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>one very long molecule: a polymer</text>}
  </Diagram>
}
function PolyForces() {
  const ys = [62, 146, 230], xs = (row: number) => 58 + (row % 2) * 17
  return <Diagram title="Three long poly(ethene) molecules lying side by side. Dashed lines between the molecules show the forces of attraction between them, called intermolecular forces. They are larger than between small molecules, but weaker than the covalent bonds inside each molecule.">
    {ys.map((y, i) => <BallChain key={y} x0={xs(i)} y={y} n={8} step={34} hGap={22} cr={9} hr={6} />)}
    {[0, 1].map(g => [0, 1, 2, 3].map(k => {
      const x = 90 + k * 68, y1 = ys[g] + 32, y2 = ys[g + 1] - 32
      return <Bond key={`${g}-${k}`} a={[x, y1]} b={[x, y2]} dashed w={2.2} colour={hot} />
    }))}
    <Notes x={400} y={60} lines={[['Dashed lines:', 'r'], ['forces between', 'r'], ['molecules', 'r'], ['(intermolecular', 'r'], ['forces)', 'r'], ['', 'n'], ['Long molecules,', 'n'], ['so larger forces:', 'n'], ['solid at room', 'b'], ['temperature', 'b'], ['', 'n'], ['Still weaker than', 'm'], ['covalent bonds', 'm']]} />
  </Diagram>
}

// ---------- Polymers: displayed formulas and the repeating unit ----------
/** Displayed formula: carbons in a row with one atom above and one below each; subs[i] = [above, below]. */
function Displayed({ xs, y, subs, ends = true, gap = 46 }: { xs: number[]; y: number; subs: Array<[string, string]>; ends?: boolean; gap?: number }) {
  const first = xs[0], last = xs[xs.length - 1]
  return <g fontWeight="700" fill={ink}>
    {ends && <><path d={`M${first - 50} ${y}H${first - 13}`} stroke={ink} strokeWidth="2.2" /><path d={`M${last + 13} ${y}H${last + 50}`} stroke={ink} strokeWidth="2.2" /></>}
    {xs.slice(1).map((x, i) => <path key={x} d={`M${xs[i] + 13} ${y}H${x - 13}`} stroke={ink} strokeWidth="2.2" />)}
    {xs.map((x, i) => <g key={x}>
      <path d={`M${x} ${y - 14}V${y - gap + 14}M${x} ${y + 14}V${y + gap - 14}`} stroke={ink} strokeWidth="2.2" />
      <text x={x} y={y + 8} textAnchor="middle" fontSize="22">C</text>
      <text x={x} y={y - gap + 7} textAnchor="middle" fontSize="20" fill={subs[i][0] === 'F' ? electronLine : ink}>{subs[i][0]}</text>
      <text x={x} y={y + gap + 7} textAnchor="middle" fontSize="20" fill={subs[i][1] === 'F' ? electronLine : ink}>{subs[i][1]}</text>
    </g>)}
  </g>
}
function Brackets({ x1, x2, y, h = 58, n = true, colour = ink }: { x1: number; x2: number; y: number; h?: number; n?: boolean; colour?: string }) {
  return <g fill="none" stroke={colour} strokeWidth="2.6">
    <path d={`M${x1 + 8} ${y - h}Q${x1 - 8} ${y} ${x1 + 8} ${y + h}`} /><path d={`M${x2 - 8} ${y - h}Q${x2 + 8} ${y} ${x2 - 8} ${y + h}`} />
    {n && <text x={x2 + 8} y={y + h + 2} fontSize="20" fontWeight="700" fill={colour} stroke="none" fontStyle="italic">n</text>}
  </g>
}
function PolyUnit() {
  const xs = [80, 140, 200, 260, 320, 380, 440]
  return <Diagram title="Part of a poly(ethene) molecule drawn with letters and lines: a row of carbon atoms, each with one hydrogen atom above and one below. A coral box marks one section of two carbon atoms and four hydrogen atoms, the repeating unit. Dashed boxes show the same unit again and again along the chain.">
    <text x={270} y={30} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>part of a poly(ethene) molecule</text>
    <rect x={xs[0] - 22} y={88} width={104} height={148} rx="12" fill="none" stroke={muted} strokeWidth="1.8" strokeDasharray="6 5" />
    <rect x={xs[2] - 22} y={88} width={104} height={148} rx="12" fill={glow} stroke={hot} strokeWidth="2.5" />
    <rect x={xs[4] - 22} y={88} width={104} height={148} rx="12" fill="none" stroke={muted} strokeWidth="1.8" strokeDasharray="6 5" />
    <Displayed xs={xs} y={162} subs={xs.map(() => ['H', 'H'] as [string, string])} />
    <text x={xs[2] + 30} y={266} textAnchor="middle" fontSize="14" fontWeight="700" fill={hot}>repeating unit</text>
    <text x={xs[0] + 30} y={266} textAnchor="middle" fontSize="13" fill={muted}>the same</text>
    <text x={xs[4] + 30} y={266} textAnchor="middle" fontSize="13" fill={muted}>the same</text>
    <text x={270} y={292} textAnchor="middle" fontSize="13" fill={muted}>2 carbon atoms and 4 hydrogen atoms, over and over</text>
  </Diagram>
}
function PolyFormula() {
  return <Diagram title="The repeating unit of poly(ethene) drawn in brackets: two carbon atoms joined to each other, each with two hydrogen atoms, and a bond sticking out through each bracket. A small n after the brackets. An arrow leads to the molecular formula, open bracket C 2 H 4 close bracket n.">
    <text x={40} y={34} fontSize="14" fontWeight="700" fill={ink}>one repeating unit</text>
    <Displayed xs={[120, 180]} y={150} subs={[['H', 'H'], ['H', 'H']]} />
    <Brackets x1={84} x2={216} y={150} />
    <Arrow x1={270} y1={150} x2={330} y2={150} colour={hot} width={2.5} />
    <Formula x={430} y={160} text="(C2H4)" size={30} fill={hot} anchor="middle" />
    <text x={482} y={172} fontSize="24" fontWeight="700" fontStyle="italic" fill={hot}>n</text>
    <Notes x={348} y={214} lines={[['2 C and 4 H', 'b'], ['in the unit: C₂H₄', 'b'], ['n = a large number', 'n']]} />
    <text x={40} y={274} fontSize="13" fill={muted}>The bonds through the brackets</text>
    <text x={40} y={292} fontSize="13" fill={muted}>join on to the next units.</text>
  </Diagram>
}
function PtfeQuestion() {
  return <Diagram title="The repeating unit of PTFE drawn in brackets: two carbon atoms joined to each other, each with two fluorine atoms, one above and one below, and a bond through each bracket. A small n after the brackets.">
    <text x={270} y={32} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>repeating unit of PTFE</text>
    <Displayed xs={[240, 300]} y={150} subs={[['F', 'F'], ['F', 'F']]} />
    <Brackets x1={204} x2={336} y={150} />
    <text x={200} y={270} textAnchor="middle" fontSize="13" fill={muted}>C = carbon atom</text><text x={340} y={270} textAnchor="middle" fontSize="13" fill={muted}>F = fluorine atom</text>
  </Diagram>
}
function PropeneQuestion() {
  const c1 = 190, c2 = 270, y = 124
  return <Diagram title="The repeating unit of poly(propene) drawn in brackets: two carbon atoms in the chain. The first has two hydrogen atoms. The second has one hydrogen atom above and, below it, a third carbon atom joined to three hydrogen atoms. A bond goes through each bracket and there is a small n after them.">
    <text x={270} y={28} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>repeating unit of poly(propene)</text>
    <g fontWeight="700" fill={ink} stroke={ink} strokeWidth="2.2">
      <path d={`M${c1 - 60} ${y}H${c1 - 13}M${c1 + 13} ${y}H${c2 - 13}M${c2 + 13} ${y}H${c2 + 60}`} />
      <path d={`M${c1} ${y - 14}V${y - 32}M${c1} ${y + 14}V${y + 32}M${c2} ${y - 14}V${y - 32}M${c2} ${y + 14}V${y + 66}`} />
      <path d={`M${c2 - 13} ${y + 80}H${c2 - 34}M${c2 + 13} ${y + 80}H${c2 + 34}M${c2} ${y + 94}V${y + 112}`} />
      <g stroke="none" textAnchor="middle">
        <text x={c1} y={y + 8} fontSize="22">C</text><text x={c2} y={y + 8} fontSize="22">C</text><text x={c2} y={y + 88} fontSize="22">C</text>
        <text x={c1} y={y - 39} fontSize="20">H</text><text x={c1} y={y + 53} fontSize="20">H</text><text x={c2} y={y - 39} fontSize="20">H</text>
        <text x={c2 - 46} y={y + 87} fontSize="20">H</text><text x={c2 + 46} y={y + 87} fontSize="20">H</text><text x={c2} y={y + 134} fontSize="20">H</text>
      </g>
    </g>
    <Brackets x1={c1 - 42} x2={c2 + 42} y={y} h={48} />
    <text x={400} y={260} fontSize="13" fill={muted}>C = carbon atom</text><text x={400} y={280} fontSize="13" fill={muted}>H = hydrogen atom</text>
  </Diagram>
}

// ---------- Giant covalent: silicon dioxide as a flat grid ----------
function Silica({ x0, y0, cols, rows, s, highlight = null, allHot = false, siR = 15, oR = 11, label = true, stub = .5 }: { x0: number; y0: number; cols: number; rows: number; s: number; highlight?: [number, number] | null; allHot?: boolean; siR?: number; oR?: number; label?: boolean; stub?: number }) {
  const si: Pt[] = [], oxy: Pt[] = [], bonds: Array<{ a: Pt; b: Pt; on: boolean; edge: boolean }> = []
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const p: Pt = [x0 + c * s, y0 + r * s]
    si.push(p)
    const isHi = !!highlight && highlight[0] === c && highlight[1] === r
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const nc = c + dx, nr = r + dy, inside = nc >= 0 && nc < cols && nr >= 0 && nr < rows
      const o: Pt = [p[0] + dx * s / 2, p[1] + dy * s / 2]
      if (dx === 1 || dy === 1 || !inside) oxy.push(o)
      bonds.push({ a: p, b: o, on: allHot || isHi, edge: false })
      if (!inside) bonds.push({ a: o, b: [o[0] + dx * s * stub * .6, o[1] + dy * s * stub * .6], on: false, edge: true })
    }
  }
  const uniq = oxy.filter((o, i) => oxy.findIndex(q => q[0] === o[0] && q[1] === o[1]) === i)
  return <g>
    {bonds.map((b, i) => <g key={i} opacity={b.edge ? .4 : 1}><Bond a={b.a} b={b.b} on={b.on} w={2.6} /></g>)}
    {uniq.map(([x, y]) => <Ball key={`${x}-${y}`} x={x} y={y} el="O" r={oR} label={label} />)}
    {si.map(([x, y]) => <Ball key={`${x}-${y}`} x={x} y={y} el="Si" r={siR} label={label} />)}
  </g>
}
function SiliconDioxide({ stage }: { stage: 'network' | 'melt' | 'conduct' }) {
  const titles = {
    network: 'A flat sketch of silicon dioxide: a grid of silicon atoms, each joined by covalent bonds to four oxygen atoms, with each oxygen atom joined to two silicon atoms. Bonds at the edges show the structure carries on in every direction. One silicon atom and its four bonds are highlighted.',
    melt: 'The same silicon dioxide grid with every covalent bond highlighted. To melt it, all these strong bonds must be broken, which takes a lot of energy, so it melts at about 1700 °C.',
    conduct: 'The same silicon dioxide grid. A crossed-out electron shows there are no ions and no electrons free to move, so silicon dioxide does not conduct electricity.',
  }
  return <Diagram title={titles[stage]}>
    <text x={184} y={24} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>silicon dioxide (silica)</text>
    <Silica x0={76} y0={96} cols={4} rows={3} s={72} highlight={stage === 'network' ? [2, 1] : null} allHot={stage === 'melt'} />
    {stage === 'network' && <g>
      <Ball x={390} y={60} el="Si" r={15} label /><text x={414} y={65} fontSize="14" fill={ink}>silicon atom</text>
      <Ball x={390} y={96} el="O" r={11} label /><text x={414} y={101} fontSize="14" fill={ink}>oxygen atom</text>
      <path d="M376 130H404" stroke={ink} strokeWidth="3" /><text x={414} y={135} fontSize="14" fill={ink}>covalent bond</text>
      <Notes x={376} y={176} lines={[['Each Si: 4 bonds', 'r'], ['Each O: 2 bonds', 'b'], ['', 'n'], ['Carries on in', 'n'], ['every direction:', 'n'], ['no separate', 'n'], ['molecules', 'n']]} />
    </g>}
    {stage === 'melt' && <Notes x={376} y={70} lines={[['To melt it, break', 'r'], ['many strong', 'r'], ['covalent bonds', 'r'], ['', 'n'], ['That takes lots', 'n'], ['of energy.', 'n'], ['', 'n'], ['Melts at about', 'b'], ['1700 °C', 'b']]} />}
    {stage === 'conduct' && <g>
      <circle cx={400} cy={74} r={20} fill={blueFill} stroke={electronLine} strokeWidth="1.6" />
      <FreeElectron x={400} y={74} r={9} />
      <path d="M384 90L416 58" stroke={hot} strokeWidth="3.5" />
      <Notes x={376} y={124} lines={[['No ions', 'b'], ['No electrons', 'b'], ['free to move', 'b'], ['', 'n'], ['So it does not', 'r'], ['conduct', 'r'], ['electricity', 'r']]} />
    </g>}
  </Diagram>
}

// ---------- Minis for comparisons ----------
function MiniMolecules({ x, y }: { x: number; y: number }) {
  const spots: Pt[] = [[14, 16], [84, 8], [48, 58], [118, 56], [16, 108], [80, 112], [124, 116]]
  return <g>{spots.map(([dx, dy], i) => <g key={i}><Ball x={x + dx} y={y + dy} el="O" r={9} /><Ball x={x + dx + 16} y={y + dy + (i % 2 ? 4 : -4)} el="O" r={9} /></g>)}</g>
}
function MiniChains({ x, y, w = 150, rows = 3, gap = 40, withH = false }: { x: number; y: number; w?: number; rows?: number; gap?: number; withH?: boolean }) {
  return <g>{Array.from({ length: rows }, (_, row) => {
    const pts = Array.from({ length: Math.floor(w / 15) }, (_, i) => [x + i * 15, y + row * gap + (i % 2 ? 7 : -7) + Math.sin(i * .5 + row) * 5] as Pt)
    return <g key={row}>
      <path d={`M${pts.map(p => p.map(r1).join(' ')).join('L')}`} fill="none" stroke={ink} strokeWidth="2" />
      {withH && pts.map((p, i) => <g key={i}><Bond a={p} b={[p[0], p[1] + (i % 2 ? 11 : -11)]} w={1.6} /><Ball x={p[0]} y={p[1] + (i % 2 ? 12 : -12)} el="H" r={3.6} /></g>)}
      {pts.map((p, i) => <Ball key={i} x={p[0]} y={p[1]} el="C" r={5} />)}
    </g>
  })}</g>
}
function MiniDiamond({ x, y, cols, rows, s, r = 7, hi = null }: { x: number; y: number; cols: number; rows: number; s: number; r?: number; hi?: [number, number] | null }) {
  const bonds: Array<{ a: Pt; b: Pt; on: boolean; edge: boolean }> = []
  for (let rr = 0; rr < rows; rr++) for (let c = 0; c < cols; c++) {
    const p: Pt = [x + c * s, y + rr * s], isHi = !!hi && hi[0] === c && hi[1] === rr
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const nc = c + dx, nr = rr + dy, inside = nc >= 0 && nc < cols && nr >= 0 && nr < rows
      const nHi = !!hi && hi[0] === nc && hi[1] === nr
      if (inside && (dx === 1 || dy === 1)) bonds.push({ a: p, b: [p[0] + dx * s, p[1] + dy * s], on: isHi || nHi, edge: false })
      if (!inside) bonds.push({ a: p, b: [p[0] + dx * s * .42, p[1] + dy * s * .42], on: false, edge: true })
    }
  }
  return <g>
    {bonds.map((b, i) => <g key={i} opacity={b.edge ? .4 : 1}><Bond a={b.a} b={b.b} on={b.on} w={r > 8 ? 3 : 2.2} /></g>)}
    {Array.from({ length: rows }, (_, rr) => Array.from({ length: cols }, (_, c) => <Ball key={`${rr}-${c}`} x={x + c * s} y={y + rr * s} el="C" r={r} on={!!hi && hi[0] === c && hi[1] === rr} />))}
  </g>
}
/** Graphite seen from the side: flat layers of carbon atoms with a gap (no covalent bonds) between them. */
function SideLayers({ x, y, n, count, s, gap, r = 7, shift = 0, fadeBelow = false }: { x: number; y: number; n: number; count: number; s: number; gap: number; r?: number; shift?: number; fadeBelow?: boolean }) {
  return <g>{Array.from({ length: n }, (_, layer) => {
    const lx = x + (layer % 2) * s / 2 + (layer === 0 ? shift : 0), ly = y + layer * gap
    return <g key={layer} opacity={fadeBelow && layer > 0 ? faded : 1}>
      <path d={`M${lx - s * .4} ${ly}H${lx + (count - 1) * s + s * .4}`} stroke={ink} strokeWidth={r > 6 ? 3 : 2.2} />
      {Array.from({ length: count }, (_, i) => <Ball key={i} x={lx + i * s} y={ly} el="C" r={r} />)}
    </g>
  })}</g>
}

function StructureCompare() {
  const cols = [{ x: 12, title: 'simple molecules', lines: ['weak forces between', 'small molecules'], mp: 'low' }, { x: 188, title: 'polymer', lines: ['forces between', 'long molecules'], mp: 'higher' }, { x: 364, title: 'giant covalent', lines: ['strong covalent', 'bonds'], mp: 'very high' }]
  return <Diagram title="Three panels compared. Simple molecules such as oxygen: to melt, break the weak forces between small molecules, so the melting point is low. A polymer: to melt, break the forces between long molecules, so the melting point is higher. A giant covalent structure such as silicon dioxide: to melt, break strong covalent bonds, so the melting point is very high.">
    {cols.map(({ x, title, lines, mp }, i) => <g key={title}>
      <rect x={x} y={10} width={164} height={280} rx="12" fill={i === 2 ? glow : panelFill} stroke={i === 2 ? hot : panelLine} strokeWidth="1.6" />
      <text x={x + 82} y={34} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{title}</text>
      {i === 0 && <MiniMolecules x={x + 6} y={56} />}
      {i === 1 && <MiniChains x={x + 12} y={64} w={144} rows={3} gap={38} />}
      {i === 2 && <Silica x0={x + 40} y0={74} cols={3} rows={2} s={42} siR={8} oR={6} label={false} stub={.4} />}
      <text x={x + 82} y={198} textAnchor="middle" fontSize="13" fill={muted}>To melt, break:</text>
      {lines.map((l, j) => <text key={j} x={x + 82} y={217 + j * 17} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{l}</text>)}
      <text x={x + 82} y={260} textAnchor="middle" fontSize="13" fill={muted}>melting point:</text>
      <text x={x + 82} y={280} textAnchor="middle" fontSize="15" fontWeight="700" fill={i === 2 ? hot : ink}>{mp}</text>
    </g>)}
  </Diagram>
}

// ---------- Carbon: diamond ----------
function Diamond({ stage }: { stage: 'bonds' | 'props' }) {
  const x = 56, y = 60, s = 56
  return <Diagram title={stage === 'bonds'
    ? 'A flat sketch of diamond: a grid of carbon atoms, each joined to four other carbon atoms by covalent bonds. One carbon atom and its four bonds are highlighted. Pointer 1 marks a carbon atom and pointer 2 a covalent bond. Real diamond is a 3D network.'
    : 'The same flat sketch of diamond, a giant network of carbon atoms each with four covalent bonds. Notes: very hard; very high melting point; no free electrons, so it does not conduct electricity.'}>
    <MiniDiamond x={x} y={y} cols={5} rows={4} s={s} r={11} hi={stage === 'bonds' ? [2, 1] : null} />
    {stage === 'bonds' && <g>
      <Pointer n={1} x={x + 4 * s + 12} y={24} to={[x + 4 * s + 2, y - 11]} />
      <Pointer n={2} x={x + s / 2 + 30} y={y + 3 * s + 44} to={[x + s / 2, y + 3 * s + 2]} />
      <Notes x={340} y={60} lines={[['1 carbon atom', 'b'], ['2 covalent bond', 'b'], ['', 'n'], ['Each carbon atom', 'r'], ['forms 4 covalent', 'r'], ['bonds', 'r'], ['', 'n'], ['A rigid giant', 'n'], ['network', 'n'], ['', 'n'], ['Real diamond is 3D;', 'm'], ['this is a flat sketch.', 'm']]} />
    </g>}
    {stage === 'props' && <Notes x={340} y={72} lines={[['Very hard', 'b'], ['', 'n'], ['Very high', 'b'], ['melting point', 'b'], ['', 'n'], ['No free electrons', 'r'], ['and no ions, so it', 'r'], ['does not conduct', 'r'], ['electricity', 'r']]} />}
  </Diagram>
}

// ---------- Carbon: graphite, graphene, nanotubes (honeycomb) ----------
function honeycomb(x0: number, y0: number, rows: number, cols: number, R: number) {
  const w = Math.sqrt(3) * R, pts: Pt[] = [], key = new Map<string, number>(), edges = new Map<string, [number, number]>(), centres: Pt[] = []
  const add = (p: Pt) => { const k = `${Math.round(p[0] * 2)}:${Math.round(p[1] * 2)}`; if (!key.has(k)) { key.set(k, pts.length); pts.push(p) } return key.get(k)! }
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const cx = x0 + c * w + (r % 2) * w / 2, cy = y0 + r * 1.5 * R
    centres.push([cx, cy])
    const ids = Array.from({ length: 6 }, (_, k) => { const a = (-90 + 60 * k) * Math.PI / 180; return add([r1(cx + R * Math.cos(a)), r1(cy + R * Math.sin(a))]) })
    ids.forEach((id, k) => { const j = ids[(k + 1) % 6], ek = id < j ? `${id}-${j}` : `${j}-${id}`; edges.set(ek, [id, j]) })
  }
  return { pts, edges: [...edges.values()], centres }
}
function Honeycomb({ x0, y0, rows, cols, R, atomR = 6, hiAtom = false, hiHex = -1, electrons = false, bondW = 2.6, atoms = true }: { x0: number; y0: number; rows: number; cols: number; R: number; atomR?: number; hiAtom?: boolean; hiHex?: number; electrons?: boolean; bondW?: number; atoms?: boolean }) {
  const { pts, edges, centres } = honeycomb(x0, y0, rows, cols, R)
  const degree = pts.map((_, i) => edges.filter(([a, b]) => a === i || b === i).length)
  const mid: Pt = [centres.reduce((s, c) => s + c[0], 0) / centres.length, centres.reduce((s, c) => s + c[1], 0) / centres.length]
  const hi = hiAtom ? pts.map((p, i) => [i, Math.hypot(p[0] - mid[0], p[1] - mid[1])] as const).filter(([i]) => degree[i] === 3).sort((a, b) => a[1] - b[1])[0][0] : -1
  const hex = hiHex >= 0 ? centres[hiHex] : null
  return <g>
    {hex && <polygon points={Array.from({ length: 6 }, (_, k) => { const a = (-90 + 60 * k) * Math.PI / 180; return `${r1(hex[0] + R * Math.cos(a))},${r1(hex[1] + R * Math.sin(a))}` }).join(' ')} fill={glow} stroke="none" />}
    {edges.map(([a, b], i) => <Bond key={i} a={pts[a]} b={pts[b]} on={a === hi || b === hi} w={bondW} />)}
    {atoms && pts.map((p, i) => <Ball key={i} x={p[0]} y={p[1]} el="C" r={atomR} on={i === hi} />)}
    {electrons && centres.map(([x, y], i) => <FreeElectron key={i} x={x + (i % 2 ? 5 : -5)} y={y + (i % 3 ? -4 : 4)} />)}
  </g>
}
function Graphite({ stage }: { stage: 'layer' | 'electrons' }) {
  return <Diagram title={stage === 'layer'
    ? 'One layer of graphite seen from above: carbon atoms joined in rings of six, called hexagons, which join into a flat sheet. One hexagon is shaded. One carbon atom is highlighted with its three covalent bonds.'
    : 'The same layer of graphite with small blue dots among the hexagons. They stand for delocalised electrons: one from each carbon atom, free to move along the layer, so graphite conducts electricity. Only some are drawn.'}>
    <text x={170} y={24} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>one layer of graphite, from above</text>
    <Honeycomb x0={52} y0={70} rows={4} cols={4} R={30} hiAtom={stage === 'layer'} hiHex={stage === 'layer' ? 0 : -1} electrons={stage === 'electrons'} />
    {stage === 'layer' && <Notes x={356} y={70} lines={[['Rings of six carbon', 'b'], ['atoms: hexagons', 'b'], ['', 'n'], ['Each carbon atom', 'r'], ['forms 3 covalent', 'r'], ['bonds', 'r'], ['', 'n'], ['The hexagons join', 'n'], ['into a flat layer.', 'n']]} />}
    {stage === 'electrons' && <g>
      <FreeElectron x={366} y={64} r={7} /><text x={382} y={69} fontSize="14" fontWeight="700" fill={electronLine}>delocalised</text>
      <text x={382} y={88} fontSize="14" fontWeight="700" fill={electronLine}>electron</text>
      <Notes x={356} y={124} lines={[['One from each', 'n'], ['carbon atom, free', 'n'], ['to move along', 'n'], ['the layer', 'n'], ['', 'n'], ['So graphite', 'r'], ['conducts', 'r'], ['electricity', 'r'], ['', 'n'], ['Only some are drawn.', 'm']]} />
    </g>}
  </Diagram>
}
function GraphiteLayers() {
  return <Diagram title="Graphite seen from the side: four flat layers of carbon atoms stacked on top of each other with gaps between them. There are no covalent bonds between the layers, only weak forces. The top layer is shifted to one side, with an arrow, to show that the layers can slide over each other.">
    <text x={184} y={24} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>graphite, from the side</text>
    <SideLayers x={46} y={78} n={4} count={9} s={30} gap={54} shift={30} />
    <Arrow x1={120} y1={50} x2={220} y2={50} colour={hot} width={2.5} />
    <text x={232} y={55} fontSize="14" fontWeight="700" fill={hot}>slides</text>
    <path d="M330 84V126" stroke={hot} strokeWidth="2" strokeDasharray="4 4" />
    <Pointer n={1} x={372} y={104} to={[334, 104]} />
    <Notes x={396} y={76} lines={[['1 no covalent', 'b'], ['bonds between', 'b'], ['layers', 'b'], ['', 'n'], ['Layers slide over', 'r'], ['each other, so', 'r'], ['graphite is soft', 'r'], ['and slippery', 'r'], ['', 'n'], ['Bonds within each', 'n'], ['layer are strong.', 'n']]} />
  </Diagram>
}
function CarbonCompare() {
  const rows: Array<[string, string, string]> = [['bonds per carbon atom', '4', '3'], ['structure', 'giant network', 'layers of hexagons'], ['hard or soft?', 'very hard', 'soft and slippery'], ['melting point', 'very high', 'very high'], ['conducts electricity?', 'no', 'yes']]
  return <Diagram viewBox="0 0 540 290" schematic={false} title="A table comparing diamond and graphite, both made only of carbon atoms. Bonds per carbon atom: diamond 4, graphite 3. Structure: diamond a giant network, graphite layers of hexagons. Hardness: diamond very hard, graphite soft and slippery. Melting point: both very high. Conducts electricity: diamond no, graphite yes.">
    <rect x={12} y={12} width={516} height={266} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <MiniDiamond x={272} y={30} cols={3} rows={2} s={22} r={5} />
    <SideLayers x={404} y={30} n={2} count={5} s={20} gap={18} r={5} />
    <text x={294} y={88} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>diamond</text>
    <text x={444} y={88} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>graphite</text>
    <path d="M24 100H516" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([p, a, b], i) => <g key={p} fontSize="14">
      <text x={28} y={128 + i * 34} fill={ink} fontWeight="700">{p}</text>
      <text x={294} y={128 + i * 34} textAnchor="middle" fill={ink}>{a}</text>
      <text x={444} y={128 + i * 34} textAnchor="middle" fill={i === 4 || i === 2 ? hot : ink} fontWeight={i === 4 || i === 2 ? 700 : 400}>{b}</text>
    </g>)}
  </Diagram>
}
function Graphene() {
  return <Diagram viewBox="0 0 540 230" title="On the left, graphite from the side, with its top layer lifted off. An arrow leads to that single layer drawn from above: a flat sheet of carbon hexagons, one atom thick, called graphene. Notes: very strong, very light, conducts electricity.">
    <text x={100} y={30} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>graphite</text>
    <g opacity={faded}><SideLayers x={36} y={104} n={3} count={5} s={30} gap={30} /></g>
    <SideLayers x={36} y={62} n={1} count={5} s={30} gap={30} />
    <Arrow x1={190} y1={72} x2={236} y2={92} colour={hot} width={2.5} />
    <text x={392} y={30} textAnchor="middle" fontSize="14" fontWeight="700" fill={hot}>graphene: one layer, one atom thick</text>
    <Honeycomb x0={272} y0={70} rows={3} cols={4} R={24} atomR={5} hiHex={5} />
    <text x={270} y={212} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>very strong · very light · conducts electricity</text>
  </Diagram>
}
/** A flat front view of a C60 ball: a ring of five in the middle, rings of six round it, the rest hidden behind. */
function Buckyball({ cx, cy }: { cx: number; cy: number }) {
  const d = Math.PI / 180, rp = 30, e = 2 * rp * Math.sin(36 * d), phi = 72
  const at = (rad: number, ang: number): Pt => [cx + rad * Math.cos(ang * d), cy + rad * Math.sin(ang * d)]
  const P = (i: number) => at(rp, -90 + 72 * i), Q = (i: number) => at(rp + e, -90 + 72 * i)
  const T1 = (i: number): Pt => { const q = Q(i), a = (-90 + 72 * i + phi) * d; return [q[0] + e * Math.cos(a), q[1] + e * Math.sin(a)] }
  const T2 = (i: number): Pt => { const q = Q(i + 1), a = (-90 + 72 * (i + 1) - phi) * d; return [q[0] + e * Math.cos(a), q[1] + e * Math.sin(a)] }
  const outer = Math.hypot(T1(0)[0] - cx, T1(0)[1] - cy)
  const R = outer + 30, clip = useId()
  const bonds: Array<[Pt, Pt]> = []
  const pts: Pt[] = []
  for (let i = 0; i < 5; i++) {
    bonds.push([P(i), P(i + 1)], [P(i), Q(i)], [Q(i), T1(i)], [T1(i), T2(i)], [T2(i), Q(i + 1)])
    for (const t of [T1(i), T2(i)]) { const a = Math.atan2(t[1] - cy, t[0] - cx); bonds.push([t, [t[0] + e * Math.cos(a), t[1] + e * Math.sin(a)]]) }
    pts.push(P(i), Q(i), T1(i), T2(i))
  }
  return <g>
    <defs><clipPath id={clip}><circle cx={cx} cy={cy} r={R} /></clipPath></defs>
    <circle cx={cx} cy={cy} r={R} fill={space} stroke={spaceLine} strokeWidth="1.5" />
    <polygon points={[0, 1, 2, 3, 4].map(i => P(i).map(r1).join(',')).join(' ')} fill={glow} />
    <g clipPath={`url(#${clip})`}>{bonds.map(([a, b], i) => <Bond key={i} a={a} b={b} w={2.4} />)}
      {pts.map((p, i) => <Ball key={i} x={p[0]} y={p[1]} el="C" r={5} />)}</g>
    <circle cx={cx} cy={cy} r={R} fill="none" stroke={neutronLine} strokeWidth="2" />
  </g>
}
function Fullerene() {
  const cx = 160, cy = 156
  return <Diagram title="Buckminsterfullerene, C60, drawn flat: a hollow ball of 60 carbon atoms. In the middle is a ring of five carbon atoms, surrounded by rings of six. Pointer 1 marks a ring of five, pointer 2 a ring of six.">
    <text x={cx - 22} y={24} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>buckminsterfullerene,</text>
    <Formula x={cx + 70} y={24} text="C60" size={15} />
    <Buckyball cx={cx} cy={cy} />
    <Pointer n={1} x={34} y={cy + 110} to={[cx - 10, cy + 10]} />
    <Pointer n={2} x={cx + 138} y={cy - 108} to={[cx + 30, cy - 41]} />
    <Notes x={318} y={62} lines={[['1 ring of 5', 'b'], ['2 ring of 6', 'b'], ['', 'n'], ['A hollow ball of', 'r'], ['60 carbon atoms', 'r'], ['', 'n'], ['Mostly rings of 6;', 'n'], ['rings of 5 (or 7)', 'n'], ['let it curve.', 'n'], ['', 'n'], ['Only the front', 'm'], ['half is drawn.', 'm']]} />
  </Diagram>
}
function Nanotube() {
  const x1 = 50, x2 = 380, top = 110, bot = 180, clip = useId(), rh = (bot - top) / 2
  return <Diagram title="A carbon nanotube drawn from the side: a long, thin tube whose wall is a sheet of carbon hexagons rolled up. Arrows show its length is much greater than its diameter.">
    <text x={215} y={40} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>a nanotube: a tiny tube of carbon</text>
    <defs><clipPath id={clip}><path d={`M${x1} ${top}H${x2}A14 ${rh} 0 0 1 ${x2} ${bot}H${x1}A14 ${rh} 0 0 1 ${x1} ${top}Z`} /></clipPath></defs>
    <path d={`M${x1} ${top}H${x2}A14 ${rh} 0 0 1 ${x2} ${bot}H${x1}A14 ${rh} 0 0 1 ${x1} ${top}Z`} fill={panelFill} />
    <g clipPath={`url(#${clip})`}><Honeycomb x0={x1 - 30} y0={top - 6} rows={6} cols={22} R={10} atoms={false} bondW={1.8} /></g>
    <ellipse cx={x2} cy={(top + bot) / 2} rx={14} ry={rh} fill="white" stroke={neutronLine} strokeWidth="2" />
    <path d={`M${x1} ${top}H${x2}M${x1} ${bot}H${x2}`} stroke={neutronLine} strokeWidth="2" />
    <path d={`M${x1} ${top}A14 ${rh} 0 0 0 ${x1} ${bot}`} fill="none" stroke={neutronLine} strokeWidth="2" />
    <Arrow x1={215} y1={214} x2={x1 - 12} y2={214} colour={hot} width={2} /><Arrow x1={215} y1={214} x2={x2 + 12} y2={214} colour={hot} width={2} />
    <rect x={175} y={204} width={80} height={20} fill="white" /><text x={215} y={219} textAnchor="middle" fontSize="14" fontWeight="700" fill={hot}>length</text>
    <Arrow x1={424} y1={145} x2={424} y2={top} colour={hot} width={2} /><Arrow x1={424} y1={145} x2={424} y2={bot} colour={hot} width={2} />
    <text x={436} y={150} fontSize="14" fontWeight="700" fill={hot}>diameter</text>
    <text x={270} y={262} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>very long compared with its diameter</text>
    <text x={270} y={284} textAnchor="middle" fontSize="13" fill={muted}>Real nanotubes are far longer and thinner than this.</text>
  </Diagram>
}
function CarbonUses() {
  const rows: Array<[string, string, string]> = [['graphene', 'strong, light, conducts', 'composites; electronics'], ['fullerene balls', 'hollow', 'carry drugs; catalysts'], ['nanotubes', 'long, thin, strong', 'electronics; stronger materials']]
  return <Diagram viewBox="0 0 540 250" schematic={false} title="A table of uses. Graphene: strong, light and conducts, used in composites and electronics. Fullerene balls: hollow, used to carry drugs into the body and as catalysts. Nanotubes: long, thin and strong, used in electronics and to strengthen materials.">
    <rect x={12} y={12} width={516} height={226} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="14" fontWeight="700" fill={ink}><text x={28} y={42}>form of carbon</text><text x={176} y={42}>useful property</text><text x={348} y={42}>used for</text></g>
    <path d="M24 56H516" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([a, b, c], i) => {
      const [c1, c2] = c.split('; ')
      return <g key={a} fontSize="14" fill={ink}>
        <text x={28} y={90 + i * 56} fontWeight="700">{a}</text>
        <text x={176} y={90 + i * 56}>{b}</text>
        <text x={348} y={90 + i * 56} fill={hot} fontWeight="700">{c1}</text>
        <text x={348} y={110 + i * 56} fill={hot} fontWeight="700">{c2}</text>
      </g>
    })}
  </Diagram>
}

// ---------- On your own ----------
function StructuresQuestion({ assessment }: { assessment: boolean }) {
  const panels = [{ x: 12, cap: ['long chains of', 'C and H atoms'], name: 'poly(ethene)' }, { x: 188, cap: ['each C bonded to', '4 other C atoms'], name: 'diamond' }, { x: 364, cap: ['each C bonded to 3', 'others, in layers'], name: 'graphite' }]
  return <Diagram title={assessment
    ? 'Three structures in numbered panels. Structure 1: long chains of carbon and hydrogen atoms. Structure 2: a network in which each carbon atom is bonded to 4 other carbon atoms. Structure 3: carbon atoms each bonded to 3 others, in flat layers seen from the side.'
    : 'Three structures: 1 poly(ethene), long chains of carbon and hydrogen atoms; 2 diamond, each carbon bonded to 4 others; 3 graphite, each carbon bonded to 3 others in layers, with delocalised electrons, so it conducts electricity.'}>
    {panels.map(({ x, cap, name }, i) => <g key={name}>
      <rect x={x} y={10} width={164} height={280} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.6" />
      <circle cx={x + 82} cy={36} r="14" fill="white" stroke={ink} strokeWidth="2" /><text x={x + 82} y={41} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{i + 1}</text>
      {i === 0 && <MiniChains x={x + 22} y={86} w={126} rows={3} gap={44} withH />}
      {i === 1 && <MiniDiamond x={x + 30} y={78} cols={4} rows={4} s={34} r={7} />}
      {i === 2 && <SideLayers x={x + 26} y={84} n={4} count={5} s={26} gap={34} r={7} />}
      {cap.map((l, j) => <text key={j} x={x + 82} y={238 + j * 17} textAnchor="middle" fontSize="13" fill={ink}>{l}</text>)}
      {!assessment && <text x={x + 82} y={278} textAnchor="middle" fontSize="14" fontWeight="700" fill={i === 2 ? hot : ink}>{name}</text>}
    </g>)}
  </Diagram>
}
function DataQuestion() {
  const rows: Array<[string, string, string, string]> = [['A', '1610', 'no', 'no'], ['B', '801', 'no', 'yes'], ['C', '115', 'no', 'no'], ['D', '1085', 'yes', 'yes']]
  return <Diagram viewBox="0 0 540 250" schematic={false} title="A data table for four solids. A: melts at 1610 °C, does not conduct as a solid or when melted. B: melts at 801 °C, does not conduct as a solid but does when melted. C: melts at 115 °C, does not conduct as a solid or when melted. D: melts at 1085 °C, conducts as a solid and when melted.">
    <rect x={12} y={12} width={516} height={226} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="14" fontWeight="700" fill={ink}>
      <text x={30} y={46}>solid</text>
      <text x={170} y={38} textAnchor="middle">melting</text><text x={170} y={56} textAnchor="middle">point (°C)</text>
      <text x={320} y={38} textAnchor="middle">conducts</text><text x={320} y={56} textAnchor="middle">as a solid?</text>
      <text x={450} y={38} textAnchor="middle">conducts</text><text x={450} y={56} textAnchor="middle">when melted?</text>
    </g>
    <path d="M24 70H516" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([s, mp, a, b], i) => <g key={s} fontSize="15" fill={ink}>
      <text x={36} y={104 + i * 38} fontWeight="700">{s}</text>
      <text x={170} y={104 + i * 38} textAnchor="middle">{mp}</text>
      <text x={320} y={104 + i * 38} textAnchor="middle">{a}</text>
      <text x={450} y={104 + i * 38} textAnchor="middle">{b}</text>
    </g>)}
  </Diagram>
}

export function GiantVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'giant-poly-join': return <PolyJoin stage="join" />
    case 'giant-poly-bonds': return <PolyJoin stage="bonds" />
    case 'giant-poly-forces': return <PolyForces />
    case 'giant-poly-unit': return <PolyUnit />
    case 'giant-poly-formula': return <PolyFormula />
    case 'giant-gc-network': return <SiliconDioxide stage="network" />
    case 'giant-gc-melt': return <SiliconDioxide stage="melt" />
    case 'giant-gc-conduct': return <SiliconDioxide stage="conduct" />
    case 'giant-gc-compare': return <StructureCompare />
    case 'giant-diamond': return <Diamond stage="bonds" />
    case 'giant-diamond-props': return <Diamond stage="props" />
    case 'giant-graphite': return <Graphite stage="layer" />
    case 'giant-graphite-layers': return <GraphiteLayers />
    case 'giant-graphite-electrons': return <Graphite stage="electrons" />
    case 'giant-carbon-compare': return <CarbonCompare />
    case 'giant-graphene': return <Graphene />
    case 'giant-fullerene': return <Fullerene />
    case 'giant-nanotube': return <Nanotube />
    case 'giant-carbon-uses': return <CarbonUses />
    case 'giant-q-ptfe': return <PtfeQuestion />
    case 'giant-q-structures': return <StructuresQuestion assessment={assessment} />
    case 'giant-q-data': return <DataQuestion />
    case 'giant-q-propene': return <PropeneQuestion />
    default: return <PolyJoin stage="join" />
  }
}
