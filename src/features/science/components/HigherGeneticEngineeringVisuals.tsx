import { Arrow, Badge, Diagram, Virus, blob, infectionPalette as C } from './InfectionVisuals'

// Higher-only diagram for the genetic engineering lesson (AQA 8464 4.6.2.4 HT: the main steps).
// Original, code-native schematic, not to scale. Focus ids start with 'hgene-'.
// Same colour code as the Foundation B6b drawings (EvolutionVisuals.tsx): coral = the useful gene, magenta = bacteria and
// their plasmids. Enzymes are teal. One drawing, built up step by step; the last frame lights every step.
type Pt = [number, number]
const ink = C.ink, faded = .28
const gene = '#c0643f', dna = '#8fa7bd'
const enzyme = '#2a8a87', enzymeFill = '#dcf1ef'
const cellFill = C.skin, cellLine = C.skinLine, nucleusFill = '#e6c3a6'
const X = [68, 198, 328, 458], Y = 128
const NAMES = [['enzymes cut', 'out the gene'], ['the gene goes', 'into a vector'], ['the vector carries', 'it into cells'], ['at an early stage,', 'so every cell has it']]
const STEPS = ['cut', 'vector', 'insert', 'early']
const r1 = (n: number) => Math.round(n * 10) / 10

function GeneBit({ x, y, a = 0, w = 22 }: { x: number; y: number; a?: number; w?: number }) {
  return <rect x={x - w / 2} y={y - 4} width={w} height={8} rx="4" fill={gene} stroke="white" strokeWidth="1" transform={`rotate(${a} ${x} ${y})`} />
}
// An enzyme: a soft round blob with a notch where it grips the DNA. `turn` points the notch.
function Enzyme({ x, y, r = 10, turn = 0 }: { x: number; y: number; r?: number; turn?: number }) {
  const a = .5, p: Pt = [r1(x + r * Math.cos(a)), r1(y - r * Math.sin(a))], q: Pt = [r1(x + r * Math.cos(a)), r1(y + r * Math.sin(a))]
  return <path d={`M${x + r * .25} ${y}L${p[0]} ${p[1]}A${r} ${r} 0 1 0 ${q[0]} ${q[1]}Z`} fill={enzymeFill} stroke={enzyme} strokeWidth="1.8" strokeLinejoin="round" transform={`rotate(${turn} ${x} ${y})`} />
}
// A plasmid: a small ring of DNA, drawn slightly uneven so it looks hand-made rather than a perfect circle.
function Plasmid({ x, y, r = 22, withGene = false, seed = 4 }: { x: number; y: number; r?: number; withGene?: boolean; seed?: number }) {
  return <g>
    <path d={blob(x, y, r, r * .9, seed, .06)} fill="none" stroke={C.bug} strokeWidth="3.2" />
    {withGene && <GeneBit x={x} y={y - r * .92} w={r * .9} />}
  </g>
}
function Cell({ x, y, r = 44, seed = 2 }: { x: number; y: number; r?: number; seed?: number }) {
  return <g><path d={blob(x, y, r, r * .92, seed, .05)} fill={cellFill} stroke={cellLine} strokeWidth="1.8" />
    <path d={blob(x - 4, y + 6, r * .38, r * .34, seed + 3, .06)} fill={nucleusFill} stroke={cellLine} strokeWidth="1.3" /></g>
}
// A small ball of cells: an early embryo. Each cell carries the gene.
function Embryo({ x, y, r = 9 }: { x: number; y: number; r?: number }) {
  const cells: Pt[] = [[-1, -.9], [1, -.9], [-1.1, .9], [1.1, .9], [0, 0], [0, -1.8], [0, 1.8]]
  return <g>
    <circle cx={x} cy={y} r={r * 3.2} fill="#fff8ec" stroke="#c49a3c" strokeWidth="1.4" />
    {cells.map(([dx, dy], i) => <g key={i}><circle cx={r1(x + dx * r)} cy={r1(y + dy * r)} r={r} fill="#fff4d6" stroke="#c49a3c" strokeWidth="1.1" />
      <circle cx={r1(x + dx * r)} cy={r1(y + dy * r)} r="2.6" fill={gene} /></g>)}
  </g>
}
function Seedling({ x, ground }: { x: number; ground: number }) {
  return <g>
    <path d={`M${x} ${ground}q-2 -24 0 -46`} stroke="#5c8a3a" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    <path d={`M${x} ${ground - 30}q-22 -6 -26 -24q20 2 26 20z`} fill="#a9d49a" stroke="#5c8a3a" strokeWidth="1.5" />
    <path d={`M${x} ${ground - 40}q22 -8 24 -26q-20 4 -24 22z`} fill="#a9d49a" stroke="#5c8a3a" strokeWidth="1.5" />
    {[[-14, -40], [12, -52], [-1, -16]].map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={ground + dy} r="2.6" fill={gene} />)}
    <path d={`M${x - 26} ${ground}q26 5 52 0`} stroke="#9c7a5e" strokeWidth="2" fill="none" />
  </g>
}

function Stage({ n }: { n: number }) {
  const x = X[n], y = Y
  if (n === 0) return <g>
    <Cell x={x} y={y + 10} r={48} seed={3} />
    <path d={`M${x - 34} ${y + 14}q8 -6 16 0t16 0t16 0t16 0`} stroke={dna} strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d={`M${x - 10} ${y + 14}q6 -4 12 0`} stroke="white" strokeWidth="6" fill="none" />
    <Enzyme x={x - 18} y={y + 31} turn={-60} /><Enzyme x={x + 12} y={y + 31} turn={-120} />
    <Arrow x1={x - 2} y1={y + 4} x2={x + 6} y2={y - 26} colour={gene} width={1.8} dashed />
    <GeneBit x={x + 10} y={y - 34} a={-12} />
  </g>
  if (n === 1) return <g>
    <Plasmid x={x} y={y - 4} r={26} withGene />
    <text x={x} y={y + 46} textAnchor="middle" fill={ink} fontSize="11" fontStyle="italic">or</text>
    <g transform={`translate(${x} ${y + 72})`}><Virus cx={0} cy={0} r={11} seed={2} /></g>
    <GeneBit x={x + 22} y={y + 72} w={14} />
  </g>
  if (n === 2) return <g>
    <Cell x={x} y={y + 14} r={46} seed={6} />
    <Plasmid x={x - 34} y={y - 40} r={13} withGene seed={9} />
    <Arrow x1={x - 22} y1={y - 28} x2={x - 6} y2={y + 6} colour={C.bug} width={1.8} dashed />
    <GeneBit x={x - 2} y={y + 20} w={18} />
  </g>
  return <g>
    <Embryo x={x - 26} y={y + 10} r={8} />
    <Arrow x1={x - 2} y1={y + 10} x2={x + 16} y2={y + 10} colour={ink} width={1.8} />
    <Seedling x={x + 46} ground={y + 40} />
  </g>
}

export function HigherGeneticEngineeringVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  const key = focus.replace('hgene-', '')
  const step = STEPS.indexOf(key)
  const all = key === 'all' || key === 'question'
  const lit = (i: number) => all || step === i
  const title = assessment || key === 'question'
    ? 'Four numbered steps. 1: a cell, with two small shapes beside a coral section of its DNA, and the coral section lifted out. 2: a small ring with the coral section in it, or a virus. 3: the small ring entering another cell, with the coral section inside. 4: a ball of cells, each with a coral dot, then a young plant with coral dots.'
    : 'The main steps of genetic engineering. 1: enzymes, shown in teal, cut the useful gene, shown in coral, out of a cell’s DNA. 2: the gene is put into a vector, a bacterial plasmid (a small ring of DNA) or a virus. 3: the vector carries the gene into the cells of the target organism. 4: this is done at an early stage, an egg or embryo, so every cell of the organism that grows has the gene.'
  return <Diagram title={title}>
    {X.map((x, i) => <g key={x}>
      <g opacity={lit(i) ? 1 : faded}><Stage n={i} /><Badge n={i + 1} x={x - 52} y={Y - 64} />
        {!(assessment || key === 'question') && <text x={x} y={Y + 112} textAnchor="middle" fill={ink} fontSize="12" fontWeight={step === i ? 700 : 500}>{NAMES[i].map((l, j) => <tspan key={l} x={x} dy={j ? 15 : 0}>{l}</tspan>)}</text>}</g>
      {i < 3 && <g opacity={lit(i + 1) ? 1 : faded}><Arrow x1={x + 54} y1={Y + 10} x2={X[i + 1] - 54} y2={Y + 10} colour={ink} width={2} /></g>}
    </g>)}
    <g transform="translate(0 4)">
      <GeneBit x={40} y={276} /><text x={58} y={280} fill={ink} fontSize="12">the useful gene</text>
      {!(assessment || key === 'question') && <><Enzyme x={186} y={276} r={8} turn={180} /><text x={200} y={280} fill={ink} fontSize="12">enzyme</text>
        <path d={blob(296, 276, 9, 8, 4, .06)} fill="none" stroke={C.bug} strokeWidth="2.6" /><text x={312} y={280} fill={ink} fontSize="12">plasmid (a vector)</text></>}
    </g>
  </Diagram>
}
