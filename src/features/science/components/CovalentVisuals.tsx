import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C2 (Chemistry Lesson 14): covalent bonding and simple molecules. Original, code-native schematics; not to scale.
 * Focus ids start with 'cov-'.
 *
 * Dot-and-cross drawings follow the Chemistry convention: outer shells only, drawn as thin ink circles; the first-named
 * atom's electrons are filled blue dots (the electron colour from AtomVisuals), the other atom's are ink crosses. Each
 * shared pair sits where two shells overlap, the overlap tinted pale blue, one dot and one cross per pair.
 * Ball models (3D model, molecules in a liquid) use the element colours of the formulas lesson
 * (H white · C dark grey · O soft red · N blue · Cl green), plus bromine red-brown and iodine lilac.
 * Every molecule is real: each atom has its real number of outer electrons, and every atom ends with a full outer shell.
 */
const { ink, muted, electronFill, electronLine, panelFill, panelLine, darkIsoLine, protonLine } = atomPalette
const faded = 0.3
const shareFill = '#e4f0f9', bondLine = '#7d8a94'
const r1 = (n: number) => Math.round(n * 10) / 10

type El = 'H' | 'C' | 'O' | 'N' | 'Cl' | 'Br' | 'I'
const EL: Record<El, { fill: string; line: string; text: string; name: string }> = {
  H: { fill: '#ffffff', line: '#8d9ba6', text: '#375a73', name: 'hydrogen' },
  C: { fill: '#5f6b75', line: '#3c464e', text: '#ffffff', name: 'carbon' },
  O: { fill: '#f2a39b', line: '#c0625a', text: '#6e2621', name: 'oxygen' },
  N: { fill: '#9dbfec', line: '#4a78b8', text: '#1f3f6b', name: 'nitrogen' },
  Cl: { fill: '#b2dea6', line: '#5a9a4c', text: '#2c5a22', name: 'chlorine' },
  Br: { fill: '#e7b59a', line: '#a8603a', text: '#5a2a12', name: 'bromine' },
  I: { fill: '#d9c8ec', line: '#7d5aa6', text: '#3e2560', name: 'iodine' },
}

function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}

/** A formula with real subscripts: "H2O" → H₂O. Digits are drawn small and low. */
function Formula({ f, size = 18, colour = ink }: { f: string; size?: number; colour?: string }) {
  const parts = f.match(/[A-Z][a-z]?|\d+|[()]/g) ?? []
  const sub = Math.max(12, Math.round(size * .7)), drop = r1(size * .3)
  const out: ReactNode[] = []
  let low = false
  parts.forEach((p, i) => {
    if (/^\d+$/.test(p)) { out.push(<tspan key={i} dy={drop} fontSize={sub}>{p}</tspan>); low = true }
    else { out.push(<tspan key={i} dy={low ? -drop : undefined}>{p}</tspan>); low = false }
  })
  if (low) out.push(<tspan key="end" dy={-drop}>{'​'}</tspan>)
  return <tspan fill={colour} fontSize={size}>{out}</tspan>
}

// ---------- Numbered key and pointers (as in the other Chemistry lessons) ----------
type Mode = 'on' | 'active' | 'off'
function Num({ n, x, y, mode, colour = ink }: { n: number | string; x: number; y: number; mode: Mode; colour?: string }) {
  const active = mode === 'active'
  return <g>
    <circle cx={x} cy={y} r="12" fill={active ? colour : 'white'} stroke={active ? colour : ink} strokeWidth="2" />
    <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={active ? 'white' : ink}>{n}</text>
  </g>
}
function KeyRow({ n, x, y, lines, mode, colour = electronLine }: { n: number; x: number; y: number; lines: ReactNode[]; mode: Mode; colour?: string }) {
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
/** A label with a thin leader line to a feature. */
function Callout({ x, y, to, lines, colour = ink, anchor = 'middle' }: { x: number; y: number; to?: [number, number]; lines: ReactNode[]; colour?: string; anchor?: 'start' | 'middle' | 'end' }) {
  const top = y - (lines.length - 1) * 16 - 16, end = to && to[1] > y ? y + 6 : top
  return <g>
    {to && <><path d={`M${to[0]} ${to[1]}L${x} ${end}`} stroke={colour} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.6" fill={colour} /></>}
    <text x={x} y={y - (lines.length - 1) * 16} textAnchor={anchor} fontSize="14" fontWeight="700" fill={colour}>{lines.map((l, j) => <tspan key={j} x={x} dy={j ? 16 : 0}>{l}</tspan>)}</text>
  </g>
}

// ---------- Dot-and-cross pieces ----------
function Dot({ x, y }: { x: number; y: number }) {
  return <circle data-electron="dot" cx={r1(x)} cy={r1(y)} r="4.7" fill={electronFill} stroke={electronLine} strokeWidth="1.3" />
}
function Cross({ x, y, s = 4.3 }: { x: number; y: number; s?: number }) {
  return <path data-electron="cross" d={`M${r1(x - s)} ${r1(y - s)}L${r1(x + s)} ${r1(y + s)}M${r1(x + s)} ${r1(y - s)}L${r1(x - s)} ${r1(y + s)}`} stroke={ink} strokeWidth="2.2" />
}
const Mark = ({ kind, x, y }: { kind: 'dot' | 'cross'; x: number; y: number }) => kind === 'dot' ? <Dot x={x} y={y} /> : <Cross x={x} y={y} />
/** Angles (degrees, clockwise from the right, as SVG draws them) for a pair of electrons centred on one direction. */
const pr = (deg: number, spread = 11) => [deg - spread, deg + spread]

type DAtom = { el: El; x: number; y: number; r: number; mark: 'dot' | 'cross'; lone: number[] }
type DBond = { a: number; b: number; pairs: number }
type Spec = { atoms: DAtom[]; bonds: DBond[] }

/**
 * Where the shared electrons of one bond go: in the middle of the overlap, each pair a dot and a cross side by side
 * (each electron on its own atom's side), extra pairs stacked across the bond.
 */
function sharedSpots(A: DAtom, B: DAtom, pairs: number, spacing = 14) {
  const dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d, px = -uy, py = ux
  const along = (d - B.r + A.r) / 2, mx = A.x + ux * along, my = A.y + uy * along
  return Array.from({ length: pairs }, (_, i) => {
    const t = (i - (pairs - 1) / 2) * spacing, cx = mx + px * t, cy = my + py * t
    return { a: [cx - ux * 5.8, cy - uy * 5.8] as const, b: [cx + ux * 5.8, cy + uy * 5.8] as const, mid: [r1(cx), r1(cy)] as [number, number] }
  })
}
function DotCross({ spec, activeShells = [], lensActive = false, lensShown = true, spacing = 14, symbolSize = 15 }: { spec: Spec; activeShells?: number[]; lensActive?: boolean; lensShown?: boolean; spacing?: number; symbolSize?: number }) {
  const uid = useId().replace(/:/g, '')
  const { atoms, bonds } = spec
  return <g>
    <defs>{bonds.map((bd, i) => <clipPath key={i} id={`${uid}-c${i}`}><circle cx={atoms[bd.a].x} cy={atoms[bd.a].y} r={atoms[bd.a].r} /></clipPath>)}</defs>
    {lensShown && bonds.map((bd, i) => { const B = atoms[bd.b]; return <circle key={`l${i}`} cx={B.x} cy={B.y} r={B.r} fill={lensActive ? '#cfe3f4' : shareFill} clipPath={`url(#${uid}-c${i})`} /> })}
    {atoms.map((a, i) => { const on = activeShells.includes(i); return <circle key={`s${i}`} cx={a.x} cy={a.y} r={a.r} fill="none" stroke={on ? electronLine : ink} strokeWidth={on ? 3.4 : 1.8} /> })}
    {atoms.map((a, i) => { const e = EL[a.el], h = a.el === 'H', size = h ? symbolSize - 1 : symbolSize; return <g key={`n${i}`}>
      <circle cx={a.x} cy={a.y} r={h ? 10 : 13} fill={e.fill} stroke={e.line} strokeWidth="1.5" opacity={a.el === 'C' ? .35 : 1} />
      <text x={a.x} y={r1(a.y + size * .36)} textAnchor="middle" fontSize={size} fontWeight="700" fill={a.el === 'C' ? ink : e.text}>{a.el}</text></g> })}
    {atoms.map((a, i) => a.lone.map((deg, j) => { const rad = deg * Math.PI / 180; return <Mark key={`e${i}-${j}`} kind={a.mark} x={a.x + Math.cos(rad) * a.r} y={a.y + Math.sin(rad) * a.r} /> }))}
    {bonds.map((bd, i) => sharedSpots(atoms[bd.a], atoms[bd.b], bd.pairs, spacing).map((s, j) => <g key={`p${i}-${j}`}><Mark kind={atoms[bd.a].mark} x={s.a[0]} y={s.a[1]} /><Mark kind={atoms[bd.b].mark} x={s.b[0]} y={s.b[1]} /></g>))}
  </g>
}
/** An atom placed at distance d from a centre atom in a direction (degrees). */
const around = (cx: number, cy: number, d: number, deg: number) => [r1(cx + Math.cos(deg * Math.PI / 180) * d), r1(cy + Math.sin(deg * Math.PI / 180) * d)] as const
function Legend({ x, y, dot, cross }: { x: number; y: number; dot: string; cross: string }) {
  return <g fontSize="13" fill={muted}>
    <Dot x={x} y={y - 4} /><text x={x + 12} y={y}>{dot}</text>
    <Cross x={x + 12 + dot.length * 7.2 + 18} y={y - 4} /><text x={x + 12 + dot.length * 7.2 + 30} y={y}>{cross}</text>
  </g>
}

// ---------- Ball models ----------
function Ball({ el, x, y, r, label = true }: { el: El; x: number; y: number; r: number; label?: boolean }) {
  const e = EL[el]
  return <g><circle cx={r1(x)} cy={r1(y)} r={r} fill={e.fill} stroke={e.line} strokeWidth="1.8" />
    {label && r >= 11 && <text x={r1(x)} y={r1(y + 5)} textAnchor="middle" fontSize={r >= 16 ? 14 : 12} fontWeight="700" fill={e.text}>{el}</text>}</g>
}
/** A two-atom molecule drawn as two touching balls (space-filling). */
function Pair({ el, x, y, r, deg = 0, label = true }: { el: El; x: number; y: number; r: number; deg?: number; label?: boolean }) {
  const [ax, ay] = around(x, y, r * .72, deg + 180), [bx, by] = around(x, y, r * .72, deg)
  return <g><Ball el={el} x={ax} y={ay} r={r} label={label} /><Ball el={el} x={bx} y={by} r={r} label={label} /></g>
}

// ---------- Section 1: two chlorine atoms share a pair ----------
const SHARE: Record<string, number> = { 'cov-share-need': 0, 'cov-share-overlap': 1, 'cov-share-count': 2, 'cov-share-bond': 3, 'cov-share-molecule': 4 }
const SHARE_TITLES = [
  'Step 1: two chlorine atoms, drawn apart, outer shells only. Each has 7 outer electrons (one atom shown with dots, the other with crosses), so each needs 1 more.',
  'Step 2: the two outer shells overlap. Each atom has put one electron into the overlap: one dot and one cross, a shared pair.',
  'Step 3: each outer shell is highlighted. Each chlorine atom counts 6 electrons of its own plus the shared pair: 8, a full outer shell.',
  'Step 4: the shared pair in the overlap is labelled as a covalent bond, which is strong.',
  'The whole chlorine molecule, Cl₂: two chlorine atoms joined by one covalent bond, each with a full outer shell of 8.',
]
const SHARE_KEY: ReactNode[][] = [['7 outer electrons:', 'each needs 1 more'], ['shells overlap:', 'a shared pair'], ['each atom counts 8'], ['shared pair =', 'covalent bond'], [<>a Cl<tspan dy="4" fontSize="12">2</tspan><tspan dy="-4"> molecule</tspan></>]]
function ShareChlorine({ focus }: { focus: string }) {
  const step = SHARE[focus] ?? 4, apart = step === 0
  const cy = 132, r = 58
  const ax = apart ? 92 : 130, bx = apart ? 252 : 224
  const spec: Spec = {
    atoms: [
      { el: 'Cl', x: ax, y: cy, r, mark: 'dot', lone: apart ? [...pr(90), ...pr(180), ...pr(270), 0] : [...pr(90), ...pr(180), ...pr(270)] },
      { el: 'Cl', x: bx, y: cy, r, mark: 'cross', lone: apart ? [...pr(90), ...pr(0), ...pr(270), 180] : [...pr(90), ...pr(0), ...pr(270)] },
    ],
    bonds: apart ? [] : [{ a: 0, b: 1, pairs: 1 }],
  }
  const mid: [number, number] = [177, cy - 10]
  const keyMode = (n: number): Mode => step === 4 ? (n === 4 ? 'active' : 'on') : n === step ? 'active' : n < step ? 'on' : 'off'
  return <Diagram viewBox="0 0 540 300" title={SHARE_TITLES[step]}>
    <DotCross spec={spec} activeShells={step === 2 ? [0, 1] : []} lensActive={step === 1 || step === 3} />
    {apart && <g>
      {[ax, bx].map((x, i) => <g key={i}>
        <text x={x} y={cy + r + 26} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>7 outer electrons</text>
        <text x={x} y={cy + r + 44} textAnchor="middle" fontSize="13" fill={muted}>needs 1 more</text></g>)}
    </g>}
    {step === 1 && <Callout x={177} y={40} to={mid} lines={['shared pair']} colour={electronLine} />}
    {step === 2 && [ax, bx].map((x, i) => <g key={i}>
      <text x={i ? x + 18 : x - 18} y={cy + r + 26} textAnchor="middle" fontSize="15" fontWeight="700" fill={electronLine}>6 + 2 = 8</text></g>)}
    {step === 3 && <Callout x={177} y={36} to={mid} lines={['covalent bond', 'strong']} colour={electronLine} />}
    {step === 4 && <g>
      <path d={`M${ax - r} ${cy + r + 12}V${cy + r + 20}H${bx + r}V${cy + r + 12}`} fill="none" stroke={ink} strokeWidth="1.8" />
      <text x={177} y={cy + r + 44} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>chlorine molecule, <Formula f="Cl2" size={15} /></text>
    </g>}
    <Legend x={32} y={288} dot="one atom" cross="the other atom" />
    {SHARE_KEY.map((lines, i) => <KeyRow key={i} n={i + 1} x={352} y={52 + i * 48} lines={lines} mode={keyMode(i)} />)}
  </Diagram>
}

// ---------- Section 2: how many bonds each atom makes ----------
const COUNT: Record<string, number> = { 'cov-count-h2': 0, 'cov-count-hcl': 1, 'cov-count-water': 2, 'cov-count-ammonia': 3, 'cov-count-methane': 4 }
const ROWS: Array<[El, number, number]> = [['H', 1, 1], ['Cl', 7, 1], ['O', 6, 2], ['N', 5, 3], ['C', 4, 4]]
const ROW_ACTIVE = [[0], [0, 1], [2], [3], [4]]
function countSpec(step: number): { spec: Spec; name: string; formula: string; shells: number[] } {
  const cx = 150
  if (step === 0) return { name: 'hydrogen', formula: 'H2', shells: [0, 1], spec: { atoms: [
    { el: 'H', x: cx - 25, y: 135, r: 36, mark: 'dot', lone: [] }, { el: 'H', x: cx + 25, y: 135, r: 36, mark: 'cross', lone: [] }], bonds: [{ a: 0, b: 1, pairs: 1 }] } }
  if (step === 1) return { name: 'hydrogen chloride', formula: 'HCl', shells: [0, 1], spec: { atoms: [
    { el: 'H', x: 104, y: 135, r: 36, mark: 'dot', lone: [] }, { el: 'Cl', x: 174, y: 135, r: 56, mark: 'cross', lone: [...pr(0), ...pr(90), ...pr(270)] }], bonds: [{ a: 0, b: 1, pairs: 1 }] } }
  if (step === 2) {
    const O = { x: cx, y: 108 }, [h1x, h1y] = around(O.x, O.y, 64, 130), [h2x, h2y] = around(O.x, O.y, 64, 50)
    return { name: 'water', formula: 'H2O', shells: [0], spec: { atoms: [
      { el: 'O', ...O, r: 50, mark: 'cross', lone: [...pr(215, 12), ...pr(325, 12)] }, { el: 'H', x: h1x, y: h1y, r: 36, mark: 'dot', lone: [] }, { el: 'H', x: h2x, y: h2y, r: 36, mark: 'dot', lone: [] }],
      bonds: [{ a: 1, b: 0, pairs: 1 }, { a: 2, b: 0, pairs: 1 }] } }
  }
  if (step === 3) {
    const N = { x: cx, y: 114 }, hs = [180, 0, 90].map(deg => around(N.x, N.y, 62, deg))
    return { name: 'ammonia', formula: 'NH3', shells: [0], spec: { atoms: [
      { el: 'N', ...N, r: 48, mark: 'dot', lone: pr(270, 12) }, ...hs.map(([x, y]) => ({ el: 'H' as El, x, y, r: 36, mark: 'cross' as const, lone: [] }))],
      bonds: [1, 2, 3].map(b => ({ a: 0, b, pairs: 1 })) } }
  }
  const C = { x: cx, y: 136 }, hs = [270, 0, 90, 180].map(deg => around(C.x, C.y, 62, deg))
  return { name: 'methane', formula: 'CH4', shells: [0], spec: { atoms: [
    { el: 'C', ...C, r: 48, mark: 'dot', lone: [] }, ...hs.map(([x, y]) => ({ el: 'H' as El, x, y, r: 36, mark: 'cross' as const, lone: [] }))],
    bonds: [1, 2, 3, 4].map(b => ({ a: 0, b, pairs: 1 })) } }
}
const COUNT_TITLES = [
  'A hydrogen molecule, H₂: two hydrogen atoms share one pair, so each counts 2 electrons, a full first shell. Beside it, a table of outer electrons and bonds, with the hydrogen row highlighted: 1 outer electron, needs 1, makes 1 bond.',
  'A hydrogen chloride molecule, HCl: hydrogen and chlorine share one pair. Chlorine keeps 6 other outer electrons, so it counts 8. In the table, hydrogen and chlorine each need 1 electron and make 1 bond.',
  'A water molecule, H₂O: the oxygen atom shares one pair with each of two hydrogen atoms and keeps two pairs of its own, so it counts 8. In the table, oxygen has 6 outer electrons, needs 2 and makes 2 bonds.',
  'An ammonia molecule, NH₃: the nitrogen atom shares one pair with each of three hydrogen atoms and keeps one pair of its own, so it counts 8. In the table, nitrogen has 5 outer electrons, needs 3 and makes 3 bonds.',
  'A methane molecule, CH₄: the carbon atom shares one pair with each of four hydrogen atoms, so it counts 8. The whole table: hydrogen 1 outer electron, 1 bond; chlorine 7, 1 bond; oxygen 6, 2 bonds; nitrogen 5, 3 bonds; carbon 4, 4 bonds.',
]
function CountBonds({ focus }: { focus: string }) {
  const step = COUNT[focus] ?? 4
  const { spec, name, formula, shells } = countSpec(step)
  const first = spec.atoms[0].mark === 'dot' ? spec.atoms[0].el : spec.atoms[1].el, second = spec.atoms.find(a => a.mark === 'cross')!.el
  const tx = 290, ty = 44, cols = [314, 374, 442, 500]
  const rowMode = (i: number): Mode => ROW_ACTIVE[step].includes(i) ? 'active' : step === 4 || i < Math.min(...ROW_ACTIVE[step]) ? 'on' : 'off'
  return <Diagram viewBox="0 0 540 310" title={COUNT_TITLES[step]}>
    <DotCross spec={spec} activeShells={shells} />
    <text x={150} y={262} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{name}, <Formula f={formula} size={15} /></text>
    <Legend x={34} y={294} dot={first === second ? 'one atom' : EL[first].name} cross={first === second ? 'the other atom' : EL[second].name} />
    <rect x={tx} y={ty - 26} width={238} height={236} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="13" fontWeight="700" fill={muted} textAnchor="middle">
      <text x={cols[0]} y={ty}>atom</text>
      <text x={cols[1]} y={ty - 6}>outer</text><text x={cols[1]} y={ty + 9}>electrons</text>
      <text x={cols[2]} y={ty}>needs</text><text x={cols[3]} y={ty}>bonds</text>
    </g>
    <path d={`M${tx + 8} ${ty + 17}H${tx + 230}`} stroke={panelLine} strokeWidth="1.5" />
    {ROWS.map(([el, outer, need], i) => {
      const y = ty + 46 + i * 36, mode = rowMode(i), active = mode === 'active'
      return <g key={el} opacity={mode === 'off' ? faded : 1}>
        {active && <rect x={tx + 6} y={y - 22} width={226} height={32} rx="8" fill={shareFill} stroke={electronLine} strokeWidth="1.5" />}
        <text x={cols[0]} y={y} textAnchor="middle" fontSize="16" fontWeight="700" fill={EL[el].line === '#8d9ba6' ? ink : EL[el].line}>{el}</text>
        <text x={cols[1]} y={y} textAnchor="middle" fontSize="15" fill={ink}>{outer}</text>
        <text x={cols[2]} y={y} textAnchor="middle" fontSize="15" fill={ink}>{need}</text>
        <text x={cols[3]} y={y} textAnchor="middle" fontSize="16" fontWeight="700" fill={active ? electronLine : ink}>{need}</text>
      </g>
    })}
    <text x={tx + 119} y={ty + 234} textAnchor="middle" fontSize="13" fill={muted}>bonds made = electrons needed</text>
  </Diagram>
}

// ---------- Section 3: double and triple bonds ----------
const MULTI: Record<string, number> = { 'cov-multi-oxygen': 0, 'cov-multi-nitrogen': 1, 'cov-multi-all': 2 }
function diatomic(el: El, x: number, y: number, r: number, d: number, pairs: number): Spec {
  const lone = el === 'H' ? [] : el === 'O' ? [...pr(125, 12), ...pr(235, 12)] : el === 'N' ? pr(180, 12) : [...pr(90), ...pr(180), ...pr(270)]
  return { atoms: [{ el, x: x - d / 2, y, r, mark: 'dot', lone }, { el, x: x + d / 2, y, r, mark: 'cross', lone: lone.map(a => 180 - a) }], bonds: [{ a: 0, b: 1, pairs }] }
}
function MultiBonds({ focus }: { focus: string }) {
  const step = MULTI[focus] ?? 2
  if (step === 2) {
    const items: Array<[El, string, number, string, string, number, number]> = [['H', 'H2', 1, '1 shared pair', 'single bond', 34, 46], ['O', 'O2', 2, '2 shared pairs', 'double bond', 44, 62], ['N', 'N2', 3, '3 shared pairs', 'triple bond', 44, 62]]
    return <Diagram viewBox="0 0 540 280" title="Three molecules side by side. Hydrogen, H₂: 1 shared pair, a single bond. Oxygen, O₂: 2 shared pairs, a double bond. Nitrogen, N₂: 3 shared pairs, a triple bond. Every atom has a full outer shell.">
      {items.map(([el, f, pairs, a, b, r, d], i) => {
        const x = 92 + i * 178
        return <g key={el}>
          <DotCross spec={diatomic(el, x, 112, r, d, pairs)} lensActive spacing={13} />
          <text x={x} y={200} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{EL[el].name}, <Formula f={f} size={16} /></text>
          <text x={x} y={224} textAnchor="middle" fontSize="14" fill={ink}>{a}</text>
          <text x={x} y={246} textAnchor="middle" fontSize="15" fontWeight="700" fill={electronLine}>{b}</text>
        </g>
      })}
      <Legend x={150} y={272} dot="one atom" cross="the other atom" />
    </Diagram>
  }
  const rows: Array<[El, string, number, string, string, string]> = [['O', 'O2', 2, 'each needs 2', 'the atoms share 2 pairs', 'double bond'], ['N', 'N2', 3, 'each needs 3', 'the atoms share 3 pairs', 'triple bond']]
  return <Diagram viewBox="0 0 540 300" title={step === 0 ? 'An oxygen molecule, O₂, highlighted: each oxygen atom has 6 outer electrons and needs 2, so the atoms share two pairs (4 electrons) in the overlap, a double bond. Below it, faded, a nitrogen molecule.' : 'A nitrogen molecule, N₂, highlighted: each nitrogen atom has 5 outer electrons and needs 3, so the atoms share three pairs (6 electrons) in the overlap, a triple bond. Above it, faded, the oxygen molecule.'}>
    {rows.map(([el, f, pairs, need, share, bond], i) => {
      const y = 80 + i * 136, on = i === step
      return <g key={el} opacity={on ? 1 : faded}>
        <DotCross spec={diatomic(el, 150, y, 52, 82, pairs)} lensActive={on} />
        <text x={290} y={y - 30} fontSize="16" fontWeight="700" fill={ink}>{EL[el].name}, <Formula f={f} size={16} /></text>
        <text x={290} y={y - 6} fontSize="14" fill={ink}>{el === 'O' ? '6 outer electrons:' : '5 outer electrons:'} {need.replace('each ', '')}</text>
        <text x={290} y={y + 16} fontSize="14" fill={ink}>{share}</text>
        <text x={290} y={y + 42} fontSize="16" fontWeight="700" fill={electronLine}>{bond}</text>
      </g>
    })}
  </Diagram>
}

// ---------- Section 4: three ways to draw ammonia, then a molecular formula ----------
const DRAW: Record<string, number> = { 'cov-draw-dotcross': 0, 'cov-draw-displayed': 1, 'cov-draw-model': 2, 'cov-draw-compare': 3 }
const PANELS = ['dot-and-cross', 'displayed formula', '3D model']
const NOTES: Array<[string, string]> = [['which atom gave', 'each electron'], ['which atoms', 'are joined'], ['the shape', 'in space']]
const MISSES = ['not the shape', 'not the shape', 'not the electrons']
function Tick({ x, y, ok }: { x: number; y: number; ok: boolean }) {
  return ok ? <path d={`M${x - 7} ${y}L${x - 2} ${y + 5}L${x + 8} ${y - 6}`} fill="none" stroke={darkIsoLine} strokeWidth="3" />
    : <path d={`M${x - 6} ${y - 6}L${x + 6} ${y + 6}M${x + 6} ${y - 6}L${x - 6} ${y + 6}`} stroke={protonLine} strokeWidth="3" />
}
function Bond({ x1, y1, x2, y2, gap = 16 }: { x1: number; y1: number; x2: number; y2: number; gap?: number }) {
  const d = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / d, uy = (y2 - y1) / d
  return <path d={`M${r1(x1 + ux * gap)} ${r1(y1 + uy * gap)}L${r1(x2 - ux * gap)} ${r1(y2 - uy * gap)}`} stroke={ink} strokeWidth="2.6" />
}
function Sym({ el, x, y, size = 22 }: { el: El; x: number; y: number; size?: number }) {
  return <text x={x} y={r1(y + size * .36)} textAnchor="middle" fontSize={size} fontWeight="700" fill={ink}>{el}</text>
}
function DrawAmmonia({ focus }: { focus: string }) {
  const step = DRAW[focus] ?? 3
  // The same ammonia drawing as before, shrunk to fit its panel.
  const N = { x: 0, y: 0 }, hs = [180, 0, 90].map(deg => around(N.x, N.y, 62, deg))
  const spec: Spec = { atoms: [{ el: 'N', ...N, r: 48, mark: 'dot', lone: pr(270, 12) }, ...hs.map(([x, y]) => ({ el: 'H' as El, x, y, r: 36, mark: 'cross' as const, lone: [] }))], bonds: [1, 2, 3].map(b => ({ a: 0, b, pairs: 1 })) }
  const titles = [
    'Ammonia drawn three ways. The dot-and-cross diagram is highlighted: nitrogen’s electrons are dots, each hydrogen’s electron is a cross, and three shared pairs sit in the overlaps. It shows which atom gave each electron, but not the shape.',
    'Ammonia drawn three ways. The displayed formula is highlighted: the symbols H, N, H in a row with a third H below N, each covalent bond drawn as a line. It shows which atoms are joined, but not the shape.',
    'Ammonia drawn three ways. The 3D model is highlighted: a blue nitrogen ball at the top joined by sticks to three white hydrogen balls below it, a low pyramid. It shows the shape, but not where the electrons came from.',
    'Ammonia drawn three ways, each with what it shows and what it does not. Dot-and-cross: shows which atom gave each electron, not the shape. Displayed formula: shows which atoms are joined, not the shape. 3D model: shows the shape, not the electrons.',
  ]
  const px = [14, 188, 362], pw = 164
  const on = (i: number) => step === 3 || i === step
  return <Diagram viewBox="0 0 540 300" title={titles[step]}>
    {PANELS.map((p, i) => <g key={p} opacity={on(i) ? 1 : faded}>
      <rect x={px[i]} y={14} width={pw} height={200} rx="12" fill="white" stroke={i === step ? electronLine : panelLine} strokeWidth={i === step ? 2.6 : 1.5} />
      <text x={px[i] + pw / 2} y={38} textAnchor="middle" fontSize="14" fontWeight="700" fill={i === step ? electronLine : ink}>{p}</text>
    </g>)}
    <g opacity={on(0) ? 1 : faded} transform="translate(96 104) scale(0.78)"><DotCross spec={spec} symbolSize={17} lensActive={step === 0} /></g>
    <g opacity={on(1) ? 1 : faded}>
      <Sym el="N" x={270} y={112} /><Sym el="H" x={222} y={112} /><Sym el="H" x={318} y={112} /><Sym el="H" x={270} y={164} />
      <Bond x1={270} y1={112} x2={222} y2={112} gap={13} /><Bond x1={270} y1={112} x2={318} y2={112} gap={13} /><Bond x1={270} y1={112} x2={270} y2={164} gap={15} />
    </g>
    <g opacity={on(2) ? 1 : faded}>
      {[[400, 150], [488, 150], [448, 170]].map(([x, y], i) => <path key={i} d={`M444 100L${x} ${y}`} stroke={bondLine} strokeWidth="6" />)}
      <Ball el="H" x={400} y={150} r={16} /><Ball el="H" x={488} y={150} r={16} />
      <Ball el="N" x={444} y={100} r={25} />
      <Ball el="H" x={448} y={172} r={18} />
    </g>
    {PANELS.map((p, i) => (step === 3 || i === step) && <g key={`n${p}`}>
      <Tick x={px[i] + 14} y={236} ok /><text x={px[i] + 28} y={236} fontSize="13" fill={ink}><tspan x={px[i] + 28} dy="-2">{NOTES[i][0]}</tspan><tspan x={px[i] + 28} dy="16">{NOTES[i][1]}</tspan></text>
      <Tick x={px[i] + 14} y={278} ok={false} /><text x={px[i] + 28} y={283} fontSize="13" fill={ink}>{MISSES[i]}</text>
    </g>)}
  </Diagram>
}
function MolecularFormula() {
  const y = 96, xs = [150, 230, 310, 390], els: El[] = ['H', 'O', 'O', 'H']
  return <Diagram viewBox="0 0 540 270" title="The displayed formula of hydrogen peroxide: H, O, O, H in a row joined by three single bonds. Counting: 2 hydrogen atoms and 2 oxygen atoms, so the molecular formula is H₂O₂.">
    <text x={270} y={34} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>hydrogen peroxide (one molecule)</text>
    {xs.map((x, i) => <g key={i}><circle cx={x} cy={y} r="19" fill={EL[els[i]].fill} stroke={EL[els[i]].line} strokeWidth="1.5" opacity={els[i] === 'O' ? .45 : 1} /><Sym el={els[i]} x={x} y={y} size={24} /></g>)}
    {xs.slice(1).map((x, i) => <Bond key={i} x1={xs[i]} y1={y} x2={x} y2={y} gap={21} />)}
    <g fontSize="15" fill={ink}>
      <rect x={120} y={144} width={130} height={40} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
      <text x={185} y={170} textAnchor="middle" fontWeight="700">H atoms: 2</text>
      <rect x={290} y={144} width={130} height={40} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
      <text x={355} y={170} textAnchor="middle" fontWeight="700">O atoms: 2</text>
    </g>
    <path d="M270 194V214" stroke={ink} strokeWidth="2.5" /><path d="M262 208L270 218L278 208" fill="none" stroke={ink} strokeWidth="2.5" />
    <text x={270} y={250} textAnchor="middle" fontSize="16" fontWeight="700" fill={electronLine}>molecular formula: <Formula f="H2O2" size={20} colour={electronLine} /></text>
  </Diagram>
}
function Propane() {
  const y = 145, cs = [190, 270, 350]
  return <Diagram viewBox="0 0 540 290" schematic={false} title="The displayed formula of a propane molecule: carbon and hydrogen atoms, each covalent bond drawn as a line.">
    {cs.map(x => <g key={x}><Sym el="C" x={x} y={y} size={24} /><Sym el="H" x={x} y={y - 64} size={22} /><Sym el="H" x={x} y={y + 64} size={22} />
      <Bond x1={x} y1={y} x2={x} y2={y - 64} gap={17} /><Bond x1={x} y1={y} x2={x} y2={y + 64} gap={17} /></g>)}
    <Sym el="H" x={110} y={y} size={22} /><Sym el="H" x={430} y={y} size={22} />
    <Bond x1={110} y1={y} x2={190} y2={y} gap={17} /><Bond x1={190} y1={y} x2={270} y2={y} gap={17} /><Bond x1={270} y1={y} x2={350} y2={y} gap={17} /><Bond x1={350} y1={y} x2={430} y2={y} gap={17} />
    <text x={270} y={272} textAnchor="middle" fontSize="13" fill={muted}>propane · one line = one covalent bond</text>
  </Diagram>
}

// ---------- Section 5: a simple molecular substance ----------
const PROP: Record<string, number> = { 'cov-prop-molecules': 0, 'cov-prop-forces': 1, 'cov-prop-boil': 2 }
// Br₂ molecules in the liquid: centre and angle.
const LIQUID: Array<[number, number, number]> = [[58, 92, 20], [118, 82, -30], [180, 96, 70], [224, 84, 10], [72, 150, 100], [132, 142, 15], [196, 156, -40], [60, 208, -15], [122, 204, 60], [190, 214, 25]]
const GAS: Array<[number, number, number]> = [[330, 74, 30], [464, 92, -40], [396, 150, 80], [322, 214, -10], [472, 212, 50]]
function Substance({ focus }: { focus: string }) {
  const step = PROP[focus] ?? 2
  const titles = [
    'A box of liquid bromine: many separate Br₂ molecules, each two red-brown atoms joined together. Beside it, one Br₂ molecule enlarged: two bromine atoms joined by a covalent bond.',
    'The same liquid, with short dashed lines between neighbouring molecules for the weak intermolecular forces. Beside it, two molecules enlarged: a strong covalent bond inside each, and a weak intermolecular force between them.',
    'Bromine boiling: heat turns the liquid, with molecules close together, into a gas, with molecules far apart. Every Br₂ molecule is still whole: only the weak forces between molecules were overcome.',
  ]
  const links: Array<[number, number]> = [[0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 6], [1, 5], [4, 7], [7, 8], [8, 9], [5, 8], [6, 9], [3, 6], [2, 6]]
  return <Diagram viewBox="0 0 540 300" title={titles[step]}>
    <rect x={20} y={44} width={240} height={206} rx="14" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={140} y={32} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>liquid bromine</text>
    {step >= 1 && links.map(([a, b], i) => { const A = LIQUID[a], B = LIQUID[b]; const dx = B[0] - A[0], dy = B[1] - A[1], d = Math.hypot(dx, dy); return <path key={i} d={`M${r1(A[0] + dx / d * 24)} ${r1(A[1] + dy / d * 24)}L${r1(B[0] - dx / d * 24)} ${r1(B[1] - dy / d * 24)}`} stroke={muted} strokeWidth="1.6" strokeDasharray="3 4" opacity={step === 1 ? 1 : .6} /> })}
    {LIQUID.map(([x, y, deg], i) => <Pair key={i} el="Br" x={x} y={y} r={13} deg={deg} label={false} />)}
    {step === 0 && <g>
      <Pair el="Br" x={400} y={140} r={36} />
      <Callout x={400} y={68} to={[400, 140]} lines={['covalent bond']} colour={electronLine} />
      <text x={400} y={214} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>one <Formula f="Br2" size={15} /> molecule</text>
      <text x={400} y={236} textAnchor="middle" fontSize="13" fill={muted}>2 atoms</text>
    </g>}
    {step === 1 && <g>
      <Pair el="Br" x={332} y={150} r={28} deg={0} /><Pair el="Br" x={476} y={150} r={28} deg={0} />
      <path d="M384 150H424" stroke={muted} strokeWidth="2.2" strokeDasharray="4 5" />
      <Callout x={332} y={80} to={[332, 150]} lines={['covalent bond:', 'very strong']} colour={electronLine} />
      <Callout x={404} y={232} to={[404, 150]} lines={['intermolecular', 'force: weak']} colour={muted} />
    </g>}
    {step === 2 && <g>
      <path d="M268 146H290" stroke={protonLine} strokeWidth="3" /><path d="M282 138L292 146L282 154" fill="none" stroke={protonLine} strokeWidth="3" />
      <text x={279} y={132} textAnchor="middle" fontSize="13" fontWeight="700" fill={protonLine}>heat</text>
      <rect x={300} y={44} width={220} height={206} rx="14" fill="white" stroke={panelLine} strokeWidth="1.5" strokeDasharray="6 5" />
      <text x={410} y={32} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>bromine gas</text>
      {GAS.map(([x, y, deg], i) => <Pair key={i} el="Br" x={x} y={y} r={13} deg={deg} label={false} />)}
      <text x={270} y={280} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>each <Formula f="Br2" size={14} /> stays whole: only the weak forces are overcome</text>
    </g>}
  </Diagram>
}
function BoilingSize() {
  const x0 = 60, x1 = 500, t0 = -50, t1 = 200, X = (t: number) => r1(x0 + (t - t0) * (x1 - x0) / (t1 - t0)), axisY = 206
  const items: Array<[El, string, number, number, string]> = [['Cl', 'Cl2', -34, 14, 'gas'], ['Br', 'Br2', 59, 16.5, 'liquid'], ['I', 'I2', 184, 19.5, 'solid']]
  return <Diagram viewBox="0 0 540 300" schematic={false} title="Boiling points on a temperature line from −50 to 200 °C. Chlorine, Cl₂, the smallest molecule, boils at −34 °C and is a gas at room temperature (20 °C). Bromine, Br₂, a bigger molecule, boils at 59 °C and is a liquid. Iodine, I₂, the biggest, boils at 184 °C and is a solid. Bigger molecules, stronger intermolecular forces, higher boiling points.">
    <text x={270} y={26} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>bigger molecule → stronger forces → higher boiling point</text>
    <path d={`M${X(20)} 44V${axisY}`} stroke={muted} strokeWidth="1.8" strokeDasharray="5 5" />
    <text x={X(20) + 6} y={58} fontSize="13" fill={muted}>room temperature, 20 °C</text>
    {items.map(([el, f, bp, r, state]) => { const x = X(bp); return <g key={el}>
      <text x={x} y={96} textAnchor="middle" fontSize="13" fill={muted}>{state} at 20 °C</text>
      <Pair el={el} x={x} y={128} r={r} label={false} />
      <text x={x} y={170} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}><Formula f={f} size={15} /></text>
      <path d={`M${x} 178V${axisY - 6}`} stroke={EL[el].line} strokeWidth="2" />
      <circle cx={x} cy={axisY} r="6" fill={EL[el].fill} stroke={EL[el].line} strokeWidth="2" />
    </g> })}
    <path d={`M${x0} ${axisY}H${x1}`} stroke={ink} strokeWidth="2" />
    {[-50, 0, 50, 100, 150, 200].map(t => <g key={t}><path d={`M${X(t)} ${axisY}V${axisY + 7}`} stroke={ink} strokeWidth="1.6" /><text x={X(t)} y={axisY + 24} textAnchor="middle" fontSize="13" fill={ink}>{t < 0 ? `−${-t}` : t}</text></g>)}
    {items.map(([el, , bp]) => <text key={`v${el}`} x={X(bp)} y={axisY - 14} textAnchor={bp < 0 ? 'end' : 'start'} dx={bp < 0 ? -6 : 6} fontSize="13" fontWeight="700" fill={EL[el].line}>{bp < 0 ? `−${-bp}` : bp} °C</text>)}
    <text x={270} y={262} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>boiling point (°C)</text>
  </Diagram>
}
function NoConduct() {
  const inBeaker: Array<[number, number, number]> = [[222, 188, 20], [262, 206, -40], [300, 184, 60], [328, 214, 10], [240, 232, 80], [290, 238, -15], [340, 180, 45]]
  return <Diagram viewBox="0 0 540 300" title="A circuit testing liquid bromine: a cell and a bulb wired to two electrodes dipped in the liquid. The bulb stays off, because Br₂ molecules have no overall charge, so nothing can carry the current.">
    <g transform="translate(-62 0)">
    <path d="M196 142V96H250M322 96H290M358 96H372V142" fill="none" stroke={ink} strokeWidth="2.4" />
    <path d="M250 80V112M262 88V104" stroke={ink} strokeWidth="3" /><path d="M262 96H290" stroke={ink} strokeWidth="2.4" />
    <text x={256} y={70} textAnchor="middle" fontSize="13" fill={muted}>cell</text>
    <circle cx={340} cy={96} r="18" fill="white" stroke={muted} strokeWidth="2.2" /><path d="M327 83L353 109M353 83L327 109" stroke={muted} strokeWidth="1.6" />
    <text x={340} y={64} textAnchor="middle" fontSize="13" fontWeight="700" fill={protonLine}>bulb stays off</text>
    <path d="M180 130V262H390V130" fill="none" stroke={ink} strokeWidth="2.4" />
    <path d="M182 160H388V260H182Z" fill="#f6e3d8" />
    <rect x={190} y={140} width={12} height={96} rx="3" fill="#c6ced5" stroke="#7f8c97" strokeWidth="1.5" />
    <rect x={366} y={140} width={12} height={96} rx="3" fill="#c6ced5" stroke="#7f8c97" strokeWidth="1.5" />
    {inBeaker.map(([x, y, deg], i) => <Pair key={i} el="Br" x={x} y={y} r={10} deg={deg} label={false} />)}
    <text x={420} y={196} fontSize="13" fill={muted}><tspan x={420}>no charged</tspan><tspan x={420} dy="16">particles to</tspan><tspan x={420} dy="16">carry a current</tspan></text>
    </g>
    <text x={270} y={286} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>liquid bromine: <Formula f="Br2" size={14} /> molecules, no overall charge</text>
  </Diagram>
}

// ---------- On your own ----------
function MethaneQuestion({ assessment }: { assessment: boolean }) {
  const cx = assessment ? 250 : 180, cy = 150
  const hs = [270, 0, 90, 180].map(deg => around(cx, cy, 64, deg))
  const spec: Spec = { atoms: [{ el: 'C', x: cx, y: cy, r: 50, mark: 'dot', lone: [] }, ...hs.map(([x, y]) => ({ el: 'H' as El, x, y, r: 36, mark: 'cross' as const, lone: [] }))], bonds: [1, 2, 3, 4].map(b => ({ a: 0, b, pairs: 1 })) }
  const shell = around(cx, cy, 50, 225), pair = sharedSpots(spec.atoms[0], spec.atoms[1], 1)[0].mid
  return <Diagram viewBox="0 0 540 300" title={assessment ? 'A dot-and-cross diagram of a methane molecule with three parts numbered 1, 2 and 3.' : 'A dot-and-cross diagram of methane. Part 1 is the outer shell of the carbon atom. Part 2 is a dot and a cross in the overlap between carbon and hydrogen: a shared pair, one covalent bond. Part 3 is a hydrogen atom.'}>
    <DotCross spec={spec} />
    <Pointer n={1} x={cx - 130} y={62} to={[shell[0], shell[1]]} />
    <Pointer n={2} x={cx + 110} y={44} to={pair} />
    <Pointer n={3} x={cx - 130} y={262} to={[cx - 9, cy + 64]} />
    {!assessment && <g>
      <KeyRow n={1} x={372} y={96} lines={['outer shell', 'of carbon']} mode="on" />
      <KeyRow n={2} x={372} y={150} lines={['shared pair:', 'a covalent bond']} mode="active" />
      <KeyRow n={3} x={372} y={204} lines={['hydrogen atom']} mode="on" />
    </g>}
  </Diagram>
}
function DataTable() {
  const rows: Array<[string, string, number, string]> = [['methane', 'CH4', 5, '−162'], ['ethane', 'C2H6', 8, '−89'], ['propane', 'C3H8', 11, '−42'], ['butane', 'C4H10', 14, '−1']]
  const cols = [44, 188, 318, 452]
  return <Diagram viewBox="0 0 540 250" schematic={false} title="A table of four simple molecular substances. Methane, CH₄, 5 atoms per molecule, boiling point −162 °C. Ethane, C₂H₆, 8 atoms, −89 °C. Propane, C₃H₈, 11 atoms, −42 °C. Butane, C₄H₁₀, 14 atoms, −1 °C.">
    <rect x={20} y={16} width={500} height={196} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="14" fontWeight="700" fill={ink}>
      <text x={cols[0]} y={46}>substance</text><text x={cols[1]} y={46} textAnchor="middle">formula</text>
      <text x={cols[2]} y={38} textAnchor="middle">atoms in one</text><text x={cols[2]} y={54} textAnchor="middle">molecule</text>
      <text x={cols[3]} y={38} textAnchor="middle">boiling</text><text x={cols[3]} y={54} textAnchor="middle">point (°C)</text>
    </g>
    <path d="M30 66H510" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([name, f, atoms, bp], i) => { const y = 96 + i * 34; return <g key={name} fontSize="15" fill={ink}>
      <text x={cols[0]} y={y}>{name}</text><text x={cols[1]} y={y} textAnchor="middle"><Formula f={f} size={15} /></text>
      <text x={cols[2]} y={y} textAnchor="middle">{atoms}</text><text x={cols[3]} y={y} textAnchor="middle">{bp}</text></g> })}
    <text x={270} y={238} textAnchor="middle" fontSize="13" fill={muted}>room temperature is about 20 °C</text>
  </Diagram>
}

export function CovalentVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('cov-share-')) return <ShareChlorine focus={focus} />
  if (focus.startsWith('cov-count-')) return <CountBonds focus={focus} />
  if (focus.startsWith('cov-multi-')) return <MultiBonds focus={focus} />
  if (focus === 'cov-draw-formula') return <MolecularFormula />
  if (focus.startsWith('cov-draw-')) return <DrawAmmonia focus={focus} />
  if (focus === 'cov-propane') return <Propane />
  if (focus === 'cov-prop-size') return <BoilingSize />
  if (focus === 'cov-prop-conduct') return <NoConduct />
  if (focus.startsWith('cov-prop-')) return <Substance focus={focus} />
  if (focus === 'cov-question') return <MethaneQuestion assessment={assessment} />
  if (focus === 'cov-data') return <DataTable />
  return <ShareChlorine focus="cov-share-molecule" />
}
