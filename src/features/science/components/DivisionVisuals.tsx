import { useId, type ReactNode } from 'react'
const ink = '#37627b', blue = '#4ca9d1', amber = '#dca739', green = '#68ae92', purple = '#a68bd0'

/* ── Cell-cycle primitives ── */
const chromo = { blue: { fill: '#4ca9d1', edge: '#2c7ca1', len: 44 }, amber: { fill: '#dca739', edge: '#a2771c', len: 33 } }
type ChromoColour = keyof typeof chromo
/** Smooth closed outline with gentle, deterministic irregularity so cells are organic rather than perfect ellipses. */
function organic(cx: number, cy: number, rx: number, ry: number, seed: number, squash = 0) {
  const n = 10, pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2, k = 1 + Math.sin(seed * 3.1 + i * 2.3) * .045
    const flat = squash && Math.cos(a) * squash > 0 ? 1 - Math.abs(Math.cos(a)) * .12 : 1
    return [cx + Math.cos(a) * rx * k * flat, cy + Math.sin(a) * ry * k]
  })
  const mid = (a: number[], b: number[]) => `${((a[0] + b[0]) / 2).toFixed(1)} ${((a[1] + b[1]) / 2).toFixed(1)}`
  return `M${mid(pts[n - 1], pts[0])}` + pts.map((p, i) => `Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${mid(p, pts[(i + 1) % n])}`).join('') + 'Z'
}
/** One chromatid: a rounded rod pinched at the centromere, with two light bands (identical on sister copies). */
function Chromatid({ colour, len }: { colour: ChromoColour; len?: number }) {
  const c = chromo[colour], L = len ?? c.len, w = 5.2, p = 2.6, m = -L * .1
  const d = `M${-w} ${-L / 2 + w}A${w} ${w} 0 0 1 ${w} ${-L / 2 + w}L${w} ${m - 3}Q${p} ${m} ${w} ${m + 3}L${w} ${L / 2 - w}A${w} ${w} 0 0 1 ${-w} ${L / 2 - w}L${-w} ${m + 3}Q${-p} ${m} ${-w} ${m - 3}Z`
  return <g><path d={d} fill={c.fill} stroke={c.edge} strokeWidth="1"/><path d={`M${-w + 1} ${-L * .32}H${w - 1}M${-w + 1} ${L * .22}H${w - 1}`} stroke="#fff" strokeOpacity=".65" strokeWidth="2"/></g>
}
/** A chromosome: unreplicated (one chromatid) or copied (two identical chromatids joined at the centromere, ends splayed). */
function CycleChromosome({ x, y, colour, copied = false, rotate = 0 }: { x: number; y: number; colour: ChromoColour; copied?: boolean; rotate?: number }) {
  const m = -chromo[colour].len * .1
  return <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    {copied ? <>
      <g transform={`rotate(-8 0 ${m}) translate(-5.4 0)`}><Chromatid colour={colour}/></g>
      <g transform={`rotate(8 0 ${m}) translate(5.4 0)`}><Chromatid colour={colour}/></g>
      <circle cy={m} r="3.2" fill={chromo[colour].edge}/>
    </> : <Chromatid colour={colour}/>}
  </g>
}
function CycleCell({ cx, cy, rx, ry, seed, squash = 0, organelles = 3, children }: { cx: number; cy: number; rx: number; ry: number; seed: number; squash?: number; organelles?: number; children?: ReactNode }) {
  const spots = Array.from({ length: organelles }, (_, i) => { const a = seed + i * (Math.PI * 2 / organelles) + .4; return [cx + Math.cos(a) * rx * .72, cy + Math.sin(a) * ry * .7, (a * 57) % 180] })
  return <g>
    <path d={organic(cx, cy, rx, ry, seed, squash)} fill="#e3f3fa" stroke={ink} strokeWidth="2"/>
    {spots.map(([x, y, r], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}><ellipse rx="7" ry="3.6" fill="#f2c1b4" stroke="#c98875" strokeWidth=".8"/><path d="M-4 0Q-2-2 0 0T4 0" fill="none" stroke="#c98875" strokeWidth=".7"/></g>)}
    {spots.map(([x, y], i) => <g key={'r' + i} fill="#7d93a3">{[[-12, 9], [-8, 12], [10, -10]].map(([dx, dy], j) => <circle key={j} cx={x + dx} cy={y + dy} r="1.3"/>)}</g>)}
    {children}
  </g>
}
function Nucleus({ cx, cy, rx, ry, seed, forming = false }: { cx: number; cy: number; rx: number; ry: number; seed: number; forming?: boolean }) {
  return <path d={organic(cx, cy, rx, ry, seed)} fill="#ece3f7" stroke="#9a80c4" strokeWidth="1.4" strokeDasharray={forming ? '5 4' : undefined}/>
}
function Caption({ x, y, children, bold = false }: { x: number; y: number; children: ReactNode; bold?: boolean }) {
  return <text x={x} y={y} textAnchor="middle" fill={ink} fontSize="12.5" fontWeight={bold ? 650 : 400}>{children}</text>
}

/* ── Stem-cell branching: self-renewal (top) vs differentiation into recognisable specialised cells (bottom) ── */
function SpecialisedIcon({ kind, x, y, u }: { kind: string; x: number; y: number; u: string }) {
  const g = { stroke: ink, strokeWidth: 1.6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }
  return <g transform={`translate(${x} ${y})`}>{
    kind === 'Nerve cell' ? <><path d="M-10-4L-22-14M-10-4L-24-2M-8 4L-18 14M-4-8L-6-20M6 0H30M30 0L36-7M30 0L37 6M30 0L38 1" fill="none" stroke="#3d8fb6" strokeWidth="2.6" strokeLinecap="round"/><circle r="9" fill="#dceef8" {...g}/><circle r="3.5" fill={purple}/></>
    : kind === 'Muscle cell' ? <><path d="M-34 0Q-20-11 0-11Q20-11 34 0Q20 11 0 11Q-20 11-34 0Z" fill="#f4dce4" {...g}/>{[-22, -14, -6, 2, 10, 18, 26].map(sx => <path key={sx} d={`M${sx}-${sx < -20 || sx > 24 ? 4 : 9}V${sx < -20 || sx > 24 ? 4 : 9}`} stroke="#c992aa" strokeWidth="2"/>)}<ellipse cx="-4" cy="0" rx="4" ry="2.4" fill={purple}/></>
    : kind === 'Red blood cell' ? <ellipse rx="18" ry="12" fill={`url(#${u}-rbc)`} stroke="#a8404d" strokeWidth="1.4"/>
    : kind === 'White blood cell' ? <><circle r="17" fill="#dceef8" {...g}/><path d="M-9-2Q-9-9-3-7Q1-11 5-6Q11-6 9 1Q10 8 3 7Q-1 11-5 6Q-11 6-9-2Z" fill={purple}/></>
    : kind === 'Root cell' ? <><path d="M-22-12H4V-4H34Q38 0 34 4H4V12H-22Z" fill="#edf8df" stroke={green} strokeWidth="2.4"/><circle cx="-12" cy="0" r="4" fill={purple}/></>
    : kind === 'Leaf cell' ? <><rect x="-11" y="-20" width="22" height="40" rx="6" fill="#edf8df" stroke={green} strokeWidth="2.4"/>{[[-5,-12],[4,-8],[-4,-2],[5,4],[-5,10],[4,14]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx="3.4" ry="2.4" fill="#4f9a57"/>)}</>
    : <><path d="M-12-20V20M12-20V20" stroke="#b98a47" strokeWidth="6"/>{[-14, -4, 6, 16].map(ry => <path key={ry} d={`M-9 ${ry}Q0 ${ry + 4} 9 ${ry}`} fill="none" stroke="#8a6127" strokeWidth="1.6" strokeOpacity=".6"/>)}<rect x="-9" y="-20" width="18" height="40" fill="#eaf5fb" fillOpacity=".5"/></>
  }</g>
}
function StemBranching({ kind, title }: { kind: 'embryo' | 'marrow' | 'meristem'; title: string }) {
  const u = title.replace(/[^a-zA-Z0-9_-]/g, '')
  const options = kind === 'embryo' ? ['Nerve cell', 'Muscle cell', 'Red blood cell'] : kind === 'marrow' ? ['Red blood cell', 'White blood cell'] : ['Root cell', 'Leaf cell', 'Xylem cell']
  const xs = options.length === 3 ? [214, 306, 398] : [240, 350]
  const plant = kind === 'meristem', fill = kind === 'marrow' ? '#f3e1ec' : plant ? '#e6f3df' : '#e6e1f6'
  const StemCell = ({ x, y, r }: { x: number; y: number; r: number }) => plant
    ? <g><rect x={x - r} y={y - r * .9} width={r * 2} height={r * 1.8} rx={r * .25} fill={fill} stroke={green} strokeWidth="2.6"/><circle cx={x} cy={y} r={r * .45} fill={purple}/></g>
    : <g><path d={organic(x, y, r, r * .92, x)} fill={fill} stroke={ink} strokeWidth="2"/><circle cx={x} cy={y} r={r * .42} fill={purple}/></g>
  const arrow = `url(#${u}-arr)`
  return <div className="science-bio-model"><svg viewBox="0 0 440 206" role="img" aria-labelledby={title}>
    <title id={title}>{(kind === 'embryo' ? 'Embryonic' : kind === 'marrow' ? 'Bone-marrow' : 'Meristem') + ` stem cell. Upper branch: it divides to make two more stem cells (self-renewal). Lower branch: it differentiates into specialised cells, shown as ${options.join(', ').toLowerCase()}. Not a photograph; not to scale.`}</title>
    <defs><marker id={`${u}-arr`} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10L2 5Z" fill={ink}/></marker>
      <radialGradient id={`${u}-rbc`}><stop offset="0" stopColor="#f7c9c6"/><stop offset=".4" stopColor="#efadad"/><stop offset=".64" stopColor="#d9707a"/><stop offset="1" stopColor="#a93f4c"/></radialGradient></defs>
    <StemCell x={58} y={98} r={32}/>
    <text x="58" y="154" textAnchor="middle" fontSize="12.5" fontWeight="700" fill={ink}>stem cell</text>
    <text x="58" y="168" textAnchor="middle" fontSize="11" fill="#526976">unspecialised</text>
    {/* self-renewal */}
    <path d="M86 78C110 50 136 38 162 36" fill="none" stroke={ink} strokeWidth="2" markerEnd={arrow}/>
    <StemCell x={186} y={34} r={16}/><StemCell x={224} y={34} r={16}/>
    <text x="252" y="30" fontSize="12.5" fontWeight="700" fill={ink}>divides: more stem cells</text>
    <text x="252" y="44" fontSize="11.5" fill="#526976">(self-renewal)</text>
    {/* differentiation */}
    {/* one route that fans out: each specialised cell gets its own arrow, so none turns into another */}
    <path d={`M88 112C104 126 118 128 136 128H${xs[xs.length - 1]}`} fill="none" stroke={green} strokeWidth="2.4"/>
    {xs.map(x => <path key={x} d={`M${x} 128V${x === xs[0] && options.length === 3 ? 134 : 134}`} stroke={green} strokeWidth="2.4" markerEnd={arrow}/>)}
    {options.map((o, i) => <g key={o}><SpecialisedIcon kind={o} x={xs[i]} y={158} u={u}/><text x={xs[i]} y={196} textAnchor="middle" fontSize="11.5" fill={ink}>{o.toLowerCase()}</text></g>)}
    <text x="150" y="98" fontSize="12.5" fontWeight="700" fill="#3f7f63">differentiates: becomes specialised</text>
    <text x="150" y="112" fontSize="11.5" fill="#526976">(different cells for different jobs)</text>
  </svg><p className="science-bio-note">Top branch: division makes more stem cells (self-renewal). Other branches: stem cells become specialised (differentiation). Examples include {options.join(', ')}{kind === 'embryo' ? ' and most other human types.' : kind === 'marrow' ? ' and a limited range of other types.' : ' and any other plant type.'}</p></div>
}
export function DivisionVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  const title = useId()
  if (focus === 'chromosomes') {
    const u = title.replace(/[^a-zA-Z0-9_-]/g, ''), zoom = { stroke: '#9fb2bd', strokeDasharray: '3 3', strokeWidth: 1.2, fill: 'none' }
    const helixTop = (x: number) => 78 - 16 * Math.sin((x - 304) / 14), helixBot = (x: number) => 78 + 16 * Math.sin((x - 304) / 14)
    const strand = (f: (x: number) => number) => Array.from({ length: 67 }, (_, k) => 304 + k * 2).map((x, k) => `${k ? 'L' : 'M'}${x} ${f(x).toFixed(1)}`).join('')
    const rungs = Array.from({ length: 18 }, (_, k) => 308 + k * 7.2)
    const gene = (x: number) => x > 344 && x < 392
    return <div className="science-bio-model"><svg viewBox="0 0 440 172" role="img" aria-labelledby={title}><title id={title}>Four zoom levels from left to right. A cell contains a nucleus. The nucleus contains several chromosomes. One chromosome is enlarged; it is made of one long DNA molecule. Part of that DNA is enlarged as a double helix, and a highlighted section of it is one gene. Original schematic, not to scale.</title>
      <g stroke={ink} strokeLinejoin="round">
        {/* 1 · cell */}
        <path d={organic(50, 80, 42, 40, 3)} fill="#e3f3fa" strokeWidth="2"/>
        <path d={organic(56, 78, 15, 13, 5)} fill="#ece3f7" stroke="#9a80c4" strokeWidth="1.2"/>
        <rect x="39" y="63" width="34" height="30" rx="4" {...zoom} stroke="#8a72b4"/>
        {/* 2 · nucleus with several chromosomes */}
        <path d="M73 63L114 42M73 93L114 118" {...zoom}/>
        <path d={organic(152, 80, 40, 40, 6)} fill="#ece3f7" stroke="#9a80c4" strokeWidth="1.6"/>
        {[[132, 74, -16, 'amber', .62], [148, 98, 28, 'blue', .62], [152, 60, 22, 'amber', .62], [174, 82, 6, 'blue', .62]].map(([x, y, r, c, k], n) =>
          <g key={n} transform={`translate(${x} ${y}) rotate(${r}) scale(${k})`}><Chromatid colour={c as ChromoColour}/></g>)}
        <rect x="165" y="64" width="18" height="36" rx="4" {...zoom} stroke="#2c7ca1"/>
        {/* 3 · one chromosome, made of a long DNA molecule */}
        <path d="M183 64L232 34M183 100L232 126" {...zoom}/>
        <g transform="translate(246 80) scale(2.2)"><Chromatid colour="blue"/></g>
        <rect x="232" y="84" width="28" height="16" rx="3" {...zoom} stroke="#2c7ca1"/>
        {/* 4 · DNA double helix with one gene highlighted */}
        <path d="M260 84L300 52M260 100L300 104" {...zoom}/>
        <rect x="344" y="54" width="48" height="48" rx="6" fill="#f3ecfb" stroke="#9c70c7" strokeWidth="1.5" strokeDasharray="4 3"/>
        {rungs.map(x => <path key={x} d={`M${x} ${helixTop(x).toFixed(1)}V${helixBot(x).toFixed(1)}`} stroke={gene(x) ? '#9c70c7' : '#a9c7d6'} strokeWidth={gene(x) ? 3 : 2}/>)}
        <path d={strand(helixTop)} fill="none" stroke="#2c7ca1" strokeWidth="3"/>
        <path d={strand(helixBot)} fill="none" stroke="#4ca9d1" strokeWidth="3"/>
        <path d="M344 46V40H392V46" fill="none" stroke="#7d55a8" strokeWidth="1.5"/>
      </g>
      <text x="368" y="34" textAnchor="middle" fill="#6f4a99" fontSize="12.5" fontWeight="650">one gene</text>
      <text x="436" y="126" textAnchor="end" fill={ink} fontSize="11">(the DNA continues</text><text x="436" y="139" textAnchor="end" fill={ink} fontSize="11">both ways)</text>
      {['cell', 'nucleus', 'chromosome', 'DNA'].map((t, n) => <text key={t} x={[50, 152, 246, 370][n]} y="164" textAnchor="middle" fill={ink} fontSize="12.5" fontWeight="650">{t}</text>)}
    </svg><ol className="science-bio-key"><li>Cell → nucleus → chromosome → DNA.</li><li>The outlined section of DNA represents one gene.</li><li>Dotted lines show a closer view of the same structure.</li></ol></div>
  }
  if (focus === 'pairs') return <div className="science-bio-model"><svg viewBox="0 0 440 160" role="img" aria-labelledby={title}><title id={title}>Simplified body-cell nucleus containing four chromosomes arranged as two pairs: two long blue chromosomes with matching bands form pair 1, and two shorter amber chromosomes with matching bands form pair 2. Not a complete human chromosome set.</title>
    <path d={organic(220, 72, 150, 60, 4)} fill="#ece3f7" stroke="#9a80c4" strokeWidth="1.8"/>
    {[[166, 'blue'], [274, 'amber']].map(([cx, c]) => <g key={cx}>
      <ellipse cx={cx as number} cy="72" rx="40" ry="40" fill="#fff" fillOpacity=".55" stroke="#b9a6d8" strokeDasharray="3 3"/>
      <g transform={`translate(${(cx as number) - 13} 72) rotate(-7) scale(1.25)`}><Chromatid colour={c as ChromoColour}/></g>
      <g transform={`translate(${(cx as number) + 13} 72) rotate(7) scale(1.25)`}><Chromatid colour={c as ChromoColour}/></g>
    </g>)}
    <text x="166" y="148" textAnchor="middle" fill={ink} fontSize="13" fontWeight="650">pair 1</text>
    <text x="274" y="148" textAnchor="middle" fill={ink} fontSize="13" fontWeight="650">pair 2</text>
    </svg><p className="science-bio-note">A pair: two chromosomes of the same size and pattern. Model only: 2 of the 23 pairs in a human body cell are shown.</p></div>
  if (focus === 'cycle-worked') return <div className="science-bio-model"><svg viewBox="0 0 440 160" role="img" aria-labelledby={title}><title id={title}>A starting body-cell model with four chromosomes: two long blue ones and two shorter amber ones. Follow the revealed reasoning to determine the number in each daughter cell.</title>
    <CycleCell cx={220} cy={78} rx={150} ry={64} seed={2} organelles={4}><Nucleus cx={220} cy={78} rx={88} ry={44} seed={5}/>
      <CycleChromosome x={176} y={78} colour="blue" rotate={-12}/><CycleChromosome x={202} y={80} colour="blue" rotate={8}/><CycleChromosome x={240} y={78} colour="amber" rotate={-6}/><CycleChromosome x={265} y={80} colour="amber" rotate={14}/></CycleCell>
    <Caption x={220} y={156}>starting cell</Caption></svg><p className="science-bio-note">Starting model: 4 chromosomes. Reveal the reasoning one step at a time.</p></div>
  if (focus.startsWith('cycle')) {
    const copy = focus === 'cycle-copy', separate = focus === 'cycle-separate', daughters = focus === 'cycle-daughters'
    const pair = (cx: number, cy: number, copied = false, gap = 14) => <><CycleChromosome x={cx - gap} y={cy} colour="blue" copied={copied} rotate={-10}/><CycleChromosome x={cx + gap} y={cy + 2} colour="amber" copied={copied} rotate={12}/></>
    const arrow = `url(#${title.replace(/[^a-zA-Z0-9_-]/g, '')}-arrow)`
    return <div className="science-bio-model"><svg viewBox="0 0 440 200" role="img" aria-labelledby={title}><title id={title}>{(assessment ? 'A simplified cell model with chromosome symbols; use the supplied starting count in the question.'
      : copy ? 'Left: a cell with two chromosomes, one long blue and one short amber, each a single strand. Right: the same cell after growing, now larger with more mitochondria; each chromosome has been copied and consists of two identical copies joined at one point. There are still two chromosomes.'
      : separate ? 'One elongated cell. The joined copies have separated: one blue and one amber chromosome have moved to each end, and a new nucleus is forming around each complete set. Arrows point towards the ends.'
      : daughters ? 'Two daughter cells that have just separated. Each nucleus contains one blue and one amber chromosome, the same as the starting cell. The cells are genetically identical.'
      : 'A starting cell containing one blue and one amber chromosome.') + ' Only two starting chromosomes are shown for clarity, not to scale.'}</title>
      <defs><marker id={`${title.replace(/[^a-zA-Z0-9_-]/g, '')}-arrow`} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10L2 5Z" fill={ink}/></marker></defs>
      {copy ? <>
        <CycleCell cx={90} cy={100} rx={62} ry={52} seed={1} organelles={2}><Nucleus cx={90} cy={100} rx={36} ry={32} seed={3}/>{pair(90, 100)}</CycleCell>
        <path d="M160 100H204" stroke={ink} strokeWidth="2" markerEnd={arrow}/>
        <Caption x={182} y={84}>grows,</Caption><Caption x={182} y={124}>copies DNA</Caption>
        <CycleCell cx={322} cy={100} rx={92} ry={66} seed={4} organelles={5}><Nucleus cx={322} cy={100} rx={48} ry={40} seed={6}/>{pair(322, 100, true, 19)}</CycleCell>
        {!assessment && <><Caption x={90} y={172}>2 chromosomes</Caption><Caption x={322} y={182} bold>still 2 chromosomes,</Caption><Caption x={322} y={196} bold>each one copied</Caption>
          <path d="M392 30L345 93" stroke="#657a89" strokeWidth="1"/><circle cx="345" cy="93" r="2.2" fill="#657a89"/><text x="436" y="13" textAnchor="end" fill={ink} fontSize="12">two identical copies,</text><text x="436" y="26" textAnchor="end" fill={ink} fontSize="12">joined at one point</text></>}
      </> : separate ? <>
        <CycleCell cx={220} cy={90} rx={186} ry={64} seed={7} organelles={6}>
          <Nucleus cx={112} cy={90} rx={40} ry={36} seed={2} forming/><Nucleus cx={328} cy={90} rx={40} ry={36} seed={8} forming/>
          {pair(112, 90)}{pair(328, 90)}
          <path d="M204 90H164" stroke={ink} strokeWidth="2" markerEnd={arrow}/><path d="M236 90H276" stroke={ink} strokeWidth="2" markerEnd={arrow}/>
        </CycleCell>
        {!assessment && <><Caption x={112} y={178} bold>complete set: 2</Caption><Caption x={328} y={178} bold>complete set: 2</Caption><Caption x={220} y={18}>copies separate; new nuclei form</Caption></>}
      </> : daughters ? <>
        <CycleCell cx={116} cy={90} rx={84} ry={66} seed={3} squash={1} organelles={3}><Nucleus cx={112} cy={90} rx={40} ry={36} seed={4}/>{pair(112, 90)}</CycleCell>
        <CycleCell cx={324} cy={90} rx={84} ry={66} seed={9} squash={-1} organelles={3}><Nucleus cx={328} cy={90} rx={40} ry={36} seed={1}/>{pair(328, 90)}</CycleCell>
        {!assessment && <><Caption x={116} y={178} bold>2 chromosomes</Caption><Caption x={324} y={178} bold>2 chromosomes</Caption><Caption x={220} y={14}>genetically identical daughter cells</Caption></>}
      </> : <CycleCell cx={220} cy={90} rx={120} ry={66} seed={5} organelles={3}><Nucleus cx={220} cy={90} rx={52} ry={42} seed={2}/>{pair(220, 90, false, 16)}</CycleCell>}
    </svg>{!assessment && <p className="science-bio-note">{copy ? 'DNA copied: two copies of each starting chromosome.' : separate ? 'Mitosis: complete sets separate; two nuclei form.' : 'Each new daughter cell has the same chromosome number as the starting cell.'}</p>}</div>
  }
  if (focus.startsWith('stem-') && !['stem-benefits','stem-risks'].includes(focus)) return <StemBranching kind={focus === 'stem-embryo' ? 'embryo' : focus === 'stem-marrow' ? 'marrow' : 'meristem'} title={title}/>
  const notes: Record<string,string[]> = {
    repair: ['Worn-out or damaged tissue', 'Mitosis produces new cells', 'Replacement or tissue repair'],
    'stem-benefits': ['Could replace damaged cells', 'Possible help for diabetes or paralysis', 'Evidence needed; no guaranteed cure'],
    'stem-risks': ['Medical risk: viral infection', 'Ethical issue: embryo use', 'Weigh risks, benefits and objections'],
    therapeutic: ['Embryo with patient’s genes', 'Matching stem cells are not rejected', 'Other treatment risks remain'],
    trial: ['Example trial · not real treatment evidence', '6/10 improved', '4/10 did not improve'],
  }
  return notes[focus] ? <div className="science-bio-cards">{notes[focus].map(s=><div key={s}>{s}</div>)}</div> : null
}
