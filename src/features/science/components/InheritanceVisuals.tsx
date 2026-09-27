import type { ReactNode } from 'react'
import { Arrow, Badge, Diagram, Label, blob } from './InfectionVisuals'
import { RedCell } from './anatomy/AnatomyFigure'

// Chapter B6 (Lessons 42–45): DNA, reproduction, meiosis, genetic diagrams and inherited disorders. Original, code-native schematics. Not to scale.
// Focus ids start with 'inherit-'.
// Colour code for the chapter: violet = DNA and chromosomes; amber = a gene; rose = came from the mother (or the first parent
// in a cross), blue = came from the father (or the second parent); terracotta = the allele for a disorder. Cells and nuclei
// match the cell-division drawings. Chromosome numbers are cut down in the drawings, and the text says so.
type Pt = [number, number]
type Tone = { fill: string; line: string; pale: string }
const ink = '#375a73', muted = '#5f7888', faded = .26
const cellFill = '#e3f3fa', nucFill = '#ece3f7', nucLine = '#9a80c4'
const dna = '#7b5aa6', dna2 = '#b196d9', rungColours = ['#f0b64d', '#6fb7dd', '#ec8f8f', '#8fcf9b']
const violet: Tone = { fill: '#cdb8ea', line: dna, pale: '#f1eafa' }
const gene = '#e0a030', geneLine = '#a8741a'
const mum: Tone = { fill: '#efa7ba', line: '#b84d6b', pale: '#fbe6ec' }
const dad: Tone = { fill: '#98c3e5', line: '#2f6f9f', pale: '#e2eff9' }
const fault = '#c0603f', faultFill = '#f4d6ca'
const furBlack = '#43454f', furBrown = '#b07444'
const skin = '#f1dcc8', skinLine = '#b9906f'
const O = (on: boolean) => on ? 1 : faded

// ---------- Small pieces ----------
function Txt({ x, y, children, size = 13, weight = 600, anchor = 'middle', fill = ink }: { x: number; y: number; children: ReactNode; size?: number; weight?: number; anchor?: 'start' | 'middle' | 'end'; fill?: string }) {
  return <text x={x} y={y} fontSize={size} fontWeight={weight} textAnchor={anchor} fill={fill}>{children}</text>
}
function Num({ n, x, y, to }: { n: number; x: number; y: number; to: Pt }) {
  return <g><path d={`M${x} ${y}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.5" /><circle cx={to[0]} cy={to[1]} r="2.6" fill={ink} /><Badge n={n} x={x} y={y} /></g>
}
/** One chromatid: a rounded rod. `tip` recolours its top third (a piece swapped with its partner); `band` marks a gene. */
function Rod({ x, y, len, w = 9, tone, rotate = 0, tip, band, bandAt = -.12, bandColour = gene }: { x: number; y: number; len: number; w?: number; tone: Tone; rotate?: number; tip?: Tone; band?: boolean; bandAt?: number; bandColour?: string }) {
  const h = len / 2, r = w / 2, cut = -h + len * .36
  return <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    <rect x={-r} y={-h} width={w} height={len} rx={r} fill={tone.fill} stroke={tone.line} strokeWidth="1.4" />
    {tip && <path d={`M${-r} ${cut}V${-h + r}A${r} ${r} 0 0 1 ${r} ${-h + r}V${cut}Z`} fill={tip.fill} stroke={tip.line} strokeWidth="1.4" />}
    {band && <rect x={-r + .7} y={len * bandAt - 4} width={w - 1.4} height={8} fill={bandColour} />}
  </g>
}
/** A copied chromosome: two identical chromatids joined in the middle, making an X. */
function XChrom({ x, y, len, w = 7, tone, tip }: { x: number; y: number; len: number; w?: number; tone: Tone; tip?: Tone }) {
  return <g transform={`translate(${x} ${y})`}>
    <Rod x={0} y={0} len={len} w={w} tone={tone} rotate={-22} />
    <Rod x={0} y={0} len={len} w={w} tone={tone} rotate={22} tip={tip} />
    <circle r={w * .45} fill={tone.line} />
  </g>
}
function Cell({ cx, cy, rx, ry, seed = 3, fill = cellFill, line = ink, width = 2, children }: { cx: number; cy: number; rx: number; ry: number; seed?: number; fill?: string; line?: string; width?: number; children?: ReactNode }) {
  return <g><path d={blob(cx, cy, rx, ry, seed, .05)} fill={fill} stroke={line} strokeWidth={width} />{children}</g>
}
/** A double helix: two strands (two shades of violet) joined by coloured rungs. */
function Helix({ cx, cy, length, amp, turns = 3, vertical = true }: { cx: number; cy: number; length: number; amp: number; turns?: number; vertical?: boolean }) {
  const at = (t: number, sign: number): Pt => { const a = t * turns * Math.PI * 2, u = -length / 2 + t * length, v = sign * amp * Math.sin(a); return vertical ? [cx + v, cy + u] : [cx + u, cy + v] }
  const strand = (sign: number) => Array.from({ length: 121 }, (_, i) => at(i / 120, sign)).map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('')
  const count = turns * 7
  return <g strokeLinecap="round">
    {Array.from({ length: count }, (_, k) => { const t = (k + .5) / count; if (Math.abs(Math.sin(t * turns * Math.PI * 2)) < .2) return null; const [x1, y1] = at(t, 1), [x2, y2] = at(t, -1)
      return <path key={k} d={`M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`} stroke={rungColours[k % 4]} strokeWidth="3.4" /> })}
    <path d={strand(1)} fill="none" stroke={dna} strokeWidth="4.2" />
    <path d={strand(-1)} fill="none" stroke={dna2} strokeWidth="4.2" />
  </g>
}
function Mouse({ x, y, fur, s = 1, dim = false }: { x: number; y: number; fur: string; s?: number; dim?: boolean }) {
  const line = fur === furBlack ? '#24252c' : '#7a4a26'
  return <g transform={`translate(${x} ${y}) scale(${s})`} opacity={dim ? faded : 1}>
    <path d="M28 10C44 12 50 0 44 -8" fill="none" stroke="#cf9a98" strokeWidth="2.6" strokeLinecap="round" />
    {[-8, 14].map(fx => <ellipse key={fx} cx={fx} cy={21} rx={6} ry={3} fill="#e8b4b0" />)}
    <ellipse cx={4} cy={6} rx={27} ry={16} fill={fur} stroke={line} strokeWidth="1.6" />
    <ellipse cx={-21} cy={0} rx={14} ry={10.5} fill={fur} stroke={line} strokeWidth="1.6" />
    <circle cx={-15} cy={-11} r={7} fill={fur} stroke={line} strokeWidth="1.6" /><circle cx={-15} cy={-11} r={3.6} fill="#e6b3b3" />
    <circle cx={-26} cy={-3} r={2} fill="white" /><circle cx={-35} cy={1} r={2.6} fill="#e39a9a" />
  </g>
}
function Sperm({ x, y, tone = dad, letter, rods = 0, scale = 1 }: { x: number; y: number; tone?: Tone; letter?: string; rods?: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-15 0C-24 -7 -30 7 -40 0S-54 -6 -62 2" fill="none" stroke={tone.line} strokeWidth="2.2" strokeLinecap="round" />
    <ellipse cx={0} cy={0} rx={16} ry={12} fill={tone.pale} stroke={tone.line} strokeWidth="1.8" />
    {Array.from({ length: rods }, (_, i) => <Rod key={i} x={-6 + i * 6} y={0} len={13} w={3.6} tone={tone} rotate={[-20, 10, 35][i]} />)}
    {letter && <Txt x={0} y={5.5} size={15} weight={700} fill={tone.line}>{letter}</Txt>}
  </g>
}
function Egg({ x, y, r = 17, tone = mum, letter }: { x: number; y: number; r?: number; tone?: Tone; letter?: string }) {
  return <g><circle cx={x} cy={y} r={r} fill={tone.pale} stroke={tone.line} strokeWidth="1.8" />{letter && <Txt x={x} y={y + 5.5} size={15} weight={700} fill={tone.line}>{letter}</Txt>}</g>
}
/** Two letters of a genotype, each coloured by the parent it came from; the dominant (capital) letter is written first. */
function pairOf(a: string, b: string): Array<[string, Tone]> {
  const first = a === a.toUpperCase(), second = b === b.toUpperCase()
  return !first && second ? [[b, dad], [a, mum]] : [[a, mum], [b, dad]]
}
function Geno({ x, y, a, b, size = 20, plain = false }: { x: number; y: number; a: string; b: string; size?: number; plain?: boolean }) {
  return <text x={x} y={y} fontSize={size} fontWeight={700} textAnchor="middle">{pairOf(a, b).map(([l, t], i) => <tspan key={i} fill={plain ? ink : t.line}>{l}</tspan>)}</text>
}

// ---------- Lesson 42: from a cell to its DNA ----------
function DnaScene({ step, numbered = false, assessment = false }: { step: string; numbered?: boolean; assessment?: boolean }) {
  const all = step === 'all' || numbered
  const lit = { cell: all || step === 'cell', chrom: all || step === 'chromosome', helix: all || step === 'helix' || step === 'polymer', poly: !numbered && (step === 'polymer' || step === 'all') }
  const inside: Array<[number, number, number, number]> = [[190, 122, 30, 28], [214, 116, 26, -24], [240, 132, 32, 64], [198, 152, 34, -58], [226, 160, 28, 12], [252, 170, 24, -40], [182, 182, 26, 70], [214, 190, 30, -14], [238, 104, 20, 80]]
  const title = assessment ? 'Four numbered parts in a row, from largest to smallest: 1 a whole cell, 2 a zoomed-in circle, 3 a long rod-shaped structure, 4 a twisted two-stranded molecule.'
    : 'A zoom from a whole animal cell into its nucleus, where DNA is packed into chromosomes. One chromosome is enlarged, and a section of it is unwound to show the DNA double helix: two strands coiled together, joined by rungs.' + (lit.poly ? ' Below, one strand is shown straightened out as a chain of many small units joined together: a polymer.' : '')
  return <Diagram viewBox="0 0 540 320" title={title}>
    <g opacity={O(lit.cell)}><Cell cx={78} cy={152} rx={62} ry={54} seed={4}>
      <path d={blob(92, 144, 22, 20, 7, .05)} fill={nucFill} stroke={nucLine} strokeWidth="1.6" />
      {[[-8, -6, 30], [4, -3, -40], [-3, 8, 80], [9, 7, 10]].map(([dx, dy, r], i) => <Rod key={i} x={92 + dx} y={144 + dy} len={11} w={3.4} tone={violet} rotate={r} />)}
    </Cell></g>
    <g opacity={O(lit.chrom)}>
      <path d="M104 128L166 104M104 162L166 198" stroke={ink} strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
      <circle cx={218} cy={150} r={60} fill={nucFill} stroke={nucLine} strokeWidth="2" />
      {inside.map(([x, y, l, r], i) => <Rod key={i} x={x} y={y} len={l} w={7} tone={violet} rotate={r} />)}
      <path d="M262 108L310 66M262 192L310 238" stroke={ink} strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
      <Rod x={324} y={152} len={176} w={24} tone={violet} />
      {[102, 128, 170, 196, 214].map(yy => <path key={yy} d={`M313 ${yy}H335`} stroke="white" strokeWidth="3" strokeOpacity=".7" />)}
      <rect x={307} y={74} width={34} height={22} rx="4" fill="none" stroke={ink} strokeWidth="1.6" />
    </g>
    <g opacity={O(lit.helix)}>
      <path d="M341 74L426 44M341 96L426 242" stroke={ink} strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
      <Helix cx={458} cy={143} length={198} amp={25} turns={3} />
    </g>
    {lit.poly && <g>
      <path d="M437 238C420 262 400 270 380 276" stroke={dna} strokeWidth="1.3" strokeDasharray="3 3" fill="none" />
      <path d="M318 294H530" stroke={dna} strokeWidth="3" />
      {Array.from({ length: 11 }, (_, i) => <g key={i}><rect x={320 + i * 19} y={286} width={15} height={15} rx="4" fill={violet.fill} stroke={dna} strokeWidth="1.4" /><circle cx={327.5 + i * 19} cy={293.5} r="3" fill={rungColours[i % 4]} /></g>)}
      <Txt x={308} y={290} anchor="end" size={13} fill={dna}>one strand: many small</Txt><Txt x={308} y={306} anchor="end" size={13} fill={dna}>units joined = a polymer</Txt>
    </g>}
    {!assessment && (all ? <>
      <Txt x={78} y={232}>cell</Txt><Txt x={218} y={236}>nucleus</Txt><Txt x={324} y={260}>chromosome</Txt><Txt x={458} y={264}>DNA</Txt>
    </> : <>
      {step === 'cell' && <><Label x={14} y={30} to={[92, 128]} lines={['DNA is kept in the nucleus']} strong /><Txt x={78} y={232}>cell</Txt></>}
      {step === 'chromosome' && <><Txt x={270} y={30} size={14} weight={700}>DNA is packed into chromosomes</Txt><Txt x={218} y={236}>nucleus</Txt><Txt x={324} y={260}>chromosome</Txt></>}
      {(step === 'helix' || step === 'polymer') && <><Txt x={530} y={26} anchor="end" size={14} weight={700} fill={dna}>two strands coiled: a double helix</Txt><Txt x={458} y={264}>DNA</Txt></>}
    </>)}
    {numbered && <><Num n={1} x={26} y={78} to={[48, 118]} /><Num n={2} x={172} y={62} to={[192, 100]} /><Num n={3} x={372} y={52} to={[334, 124]} /><Num n={4} x={512} y={82} to={[482, 108]} /></>}
  </Diagram>
}

// ---------- Lesson 42: gene → amino acids → protein ----------
const AMINO = ['#e39a3b', '#6cb38f', '#d76f86', '#5b9fd0', '#a58ad0', '#e39a3b', '#d76f86', '#6cb38f']
function GeneScene({ step, numbered = false, assessment = false }: { step: string; numbered?: boolean; assessment?: boolean }) {
  const all = step === 'all' || numbered
  const lit = { chrom: all || step === 'section', helix: !numbered, amino: all || step === 'code' || step === 'protein', protein: all || step === 'protein' }
  const fold: Pt[] = [[452, 196], [470, 186], [488, 196], [498, 214], [484, 230], [464, 226], [454, 244], [474, 252]]
  const title = assessment ? 'A long rod with bands along it, one band shaded; a chain of eight coloured beads in a row; and the same beads folded into a compact shape. Numbered pointers 1 to 4 mark parts of the drawing.'
    : 'A chromosome drawn as a long rod with bands. One small band is a gene. Zoomed in, the gene is a short section of DNA double helix. The gene codes for a chain of amino acids in a set order, shown as coloured beads, which folds up into a protein.'
  return <Diagram title={title}>
    <g opacity={O(lit.chrom)}>
      <Rod x={270} y={48} len={400} w={26} tone={violet} rotate={90} />
      {[110, 150, 196, 224, 320, 352, 400, 436].map(xx => <path key={xx} d={`M${xx} 37V59`} stroke="white" strokeWidth="3" strokeOpacity=".7" />)}
      <rect x={252} y={36} width={32} height={24} fill={gene} stroke={geneLine} strokeWidth="1.6" />
    </g>
    {lit.helix && <g opacity={O(step !== 'protein')}>
      <path d="M252 60L136 102M284 60L404 102" stroke={ink} strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
      <rect x={130} y={102} width={280} height={44} rx="10" fill="#fdf1d8" stroke={gene} strokeWidth="1.4" />
      <Helix cx={270} cy={124} length={262} amp={15} turns={4} vertical={false} />
    </g>}
    <g opacity={O(lit.amino)}>
      {!numbered && <Arrow x1={270} y1={152} x2={270} y2={178} colour={ink} width={2.2} />}
      <path d="M152 200H390" stroke={ink} strokeWidth="2.4" />
      {AMINO.map((c, i) => <circle key={i} cx={156 + i * 33} cy={200} r="12" fill={c} stroke={ink} strokeWidth="1.4" />)}
    </g>
    <g opacity={O(lit.protein)}>
      <Arrow x1={400} y1={210} x2={436} y2={216} colour={ink} width={2.2} />
      <path d={fold.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('')} stroke={ink} strokeWidth="2.4" fill="none" strokeLinejoin="round" />
      {fold.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="10" fill={AMINO[i]} stroke={ink} strokeWidth="1.4" />)}
    </g>
    {!assessment && <>
      {(all || step === 'section') && <><Txt x={18} y={24} anchor="start">chromosome</Txt><Label x={530} y={26} anchor="end" to={[284, 40]} lines={['gene: a small section of DNA']} strong colour={geneLine} /></>}
      {(all || step === 'code') && <Txt x={272} y={240} size={13}>amino acids, in the order the gene sets</Txt>}
      {(all || step === 'protein') && <Txt x={476} y={284} size={14} weight={700}>a protein</Txt>}
      {step === 'protein' && <Txt x={272} y={240} size={13}>amino acids joined, then folded</Txt>}
    </>}
    {numbered && <><Num n={1} x={128} y={252} to={[156, 212]} /><Num n={2} x={40} y={96} to={[76, 56]} /><Num n={3} x={320} y={96} to={[268, 58]} /><Num n={4} x={420} y={272} to={[454, 244]} /></>}
  </Diagram>
}

// ---------- Lesson 42: the genome and why it matters ----------
function Nucleus23({ cx, cy, r, ticks = false }: { cx: number; cy: number; r: number; ticks?: boolean }) {
  const rows = [[-62, 4], [-24, 5], [14, 5], [50, 5], [82, 4]] as const
  let i = 0
  return <g>
    <circle cx={cx} cy={cy} r={r} fill={nucFill} stroke={nucLine} strokeWidth="2" />
    {rows.map(([dy, count]) => Array.from({ length: count }, (_, c) => {
      const len = 32 - i * .9, px = cx + (c - (count - 1) / 2) * (count === 4 ? 30 : 28), py = cy + dy, k = i++
      return <g key={k}>{[-4, 4].map(d => <g key={d}><Rod x={px + d} y={py} len={len} w={6} tone={violet} />{ticks && <><rect x={px + d - 2.6} y={py - len * .2} width={5.2} height={3} fill={gene} /><rect x={px + d - 2.6} y={py + len * .18} width={5.2} height={3} fill={gene} /></>}</g>)}</g>
    }))}
  </g>
}
function GenomeScene({ step }: { step: string }) {
  const cards = [
    { key: 'disease', y: 24, title: 'Genes linked to disease', line: 'see who is at risk' },
    { key: 'treat', y: 112, title: 'Inherited disorders', line: 'understand, then treat' },
    { key: 'migration', y: 200, title: 'Human migration', line: 'how groups moved long ago' },
  ]
  const panels = step !== 'set'
  return <Diagram title={step === 'set' ? 'A human nucleus holding 46 chromosomes in 23 pairs. All of this genetic material together is the genome.' : 'A human nucleus with 46 chromosomes, with known genes marked on each. Three cards show why knowing the human genome helps: finding genes linked to disease, understanding and treating inherited disorders, and tracing human migration.'}>
    <g opacity={O(step === 'set' || step === 'map')}><Nucleus23 cx={118} cy={146} r={100} ticks={step !== 'set'} /></g>
    <Txt x={118} y={270} size={13}>46 chromosomes (23 pairs)</Txt>
    {step === 'set' && <><Txt x={400} y={120} size={16} weight={700} fill={dna}>genome =</Txt><Txt x={400} y={144} size={14}>all of the genetic material</Txt><Txt x={400} y={164} size={14}>in an organism</Txt></>}
    {step === 'map' && <><rect x={20} y={286} width={10} height={6} fill={gene} /><Txt x={36} y={293} anchor="start" size={12} weight={500}>genes that have been found</Txt></>}
    {panels && cards.map((c, i) => <g key={c.key} opacity={O(step === c.key)}>
      <rect x={250} y={c.y} width={278} height={76} rx="12" fill={step === c.key ? '#fdf6e6' : '#f7fafc'} stroke={step === c.key ? geneLine : '#cfdde7'} strokeWidth="1.8" />
      {i === 0 && <g><Rod x={284} y={c.y + 38} len={50} w={12} tone={violet} rotate={-30} band bandAt={.05} /><circle cx={300} cy={c.y + 30} r={13} fill="white" fillOpacity=".4" stroke={ink} strokeWidth="2.4" /><path d={`M309 ${c.y + 39}L320 ${c.y + 51}`} stroke={ink} strokeWidth="4" strokeLinecap="round" /></g>}
      {i === 1 && <g transform={`translate(292 ${c.y + 38}) rotate(-35)`}><rect x={-22} y={-10} width={44} height={20} rx="10" fill="white" stroke={ink} strokeWidth="1.8" /><path d="M0 -10H12A10 10 0 0 1 12 10H0Z" fill="#8fcf9b" stroke={ink} strokeWidth="1.8" /></g>}
      {i === 2 && <g>{[[264, c.y + 62, '#d7a77f'], [280, c.y + 62, '#b98a63'], [306, c.y + 36, '#b98a63'], [322, c.y + 36, '#e6c3a4']].map(([x, y, col], k) => <g key={k}><circle cx={Number(x)} cy={Number(y) - 12} r="5" fill={skin} stroke={skinLine} strokeWidth="1.2" /><path d={`M${Number(x) - 6} ${Number(y) + 6}V${Number(y) - 1}Q${Number(x)} ${Number(y) - 7} ${Number(x) + 6} ${Number(y) - 1}V${Number(y) + 6}Z`} fill={String(col)} stroke={ink} strokeWidth="1.2" /></g>)}
        <path d={`M276 ${c.y + 40}Q280 ${c.y + 18} 296 ${c.y + 20}`} stroke={ink} strokeWidth="1.8" strokeDasharray="4 3" fill="none" /><path d={`M296 ${c.y + 14}L304 ${c.y + 21}L295 ${c.y + 26}Z`} fill={ink} /></g>}
      <Txt x={338} y={c.y + 34} anchor="start" size={14} weight={700}>{c.title}</Txt>
      <Txt x={338} y={c.y + 54} anchor="start" size={13} weight={500}>{c.line}</Txt>
    </g>)}
  </Diagram>
}

// ---------- Charts ----------
function Bars({ title, bars, max, step, yLabel, unit = '' }: { title: string; bars: Array<{ label: string[]; value: number; colour: string }>; max: number; step: number; yLabel: string; unit?: string }) {
  const X0 = 96, Y0 = 244, H = 180, W = 420, Y = (v: number) => Y0 - v / max * H, bw = 96, gap = W / bars.length
  return <Diagram title={`Bar chart. ${title}. ${bars.map(b => `${b.label.join(' ')}: ${b.value}${unit}`).join('; ')}.`}>
    <Txt x={270} y={24} size={14}>{title}</Txt>
    {Array.from({ length: max / step + 1 }, (_, i) => i * step).map(v => <g key={v}><path d={`M${X0 - 6} ${Y(v)}H${X0 + W}`} stroke={v ? '#e2eaf0' : ink} strokeWidth={v ? 1 : 2} /><Txt x={X0 - 10} y={Y(v) + 4} anchor="end" size={12} weight={500}>{`${v}${unit}`}</Txt></g>)}
    <path d={`M${X0} ${Y0}V${Y(max) - 6}`} stroke={ink} strokeWidth="2" />
    <text transform={`translate(28 ${Y0 - H / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill={ink}>{yLabel}</text>
    {bars.map((b, i) => { const cx = X0 + gap * (i + .5); return <g key={i}>
      <rect x={cx - bw / 2} y={Y(b.value)} width={bw} height={Y0 - Y(b.value)} rx="4" fill={b.colour} stroke={ink} strokeWidth="1.4" />
      <Txt x={cx} y={Y(b.value) - 8} size={14} weight={700}>{`${b.value}${unit}`}</Txt>
      {b.label.map((l, k) => <Txt key={k} x={cx} y={Y0 + 20 + k * 15} size={12.5} weight={500}>{l}</Txt>)}
    </g> })}
  </Diagram>
}

// ---------- Lesson 43: gametes, fertilisation and clones ----------
function PairsIn({ cx, cy, tones, scale = 1 }: { cx: number; cy: number; tones: Array<[Tone, Tone]>; scale?: number }) {
  return <g transform={`translate(${cx} ${cy}) scale(${scale})`}>{tones.map(([a, b], i) => { const x = (i - (tones.length - 1) / 2) * 20, len = 24 - i * 4
    return <g key={i}><Rod x={x - 4} y={0} len={len} w={6} tone={a} /><Rod x={x + 4} y={0} len={len} w={6} tone={b} /></g> })}</g>
}
function ReproScene({ step }: { step: string }) {
  const lit = { gametes: true, zygote: step === 'sexual' || step === 'fertilise' }
  const counts = step === 'half' || step === 'fertilise'
  return <Diagram title={'Sexual reproduction. A sperm cell from the male and an egg cell from the female each carry half a set of chromosomes (3 drawn, standing for 23). They join at fertilisation to make a fertilised egg with a full set of pairs (46 in humans), one of each pair from each parent.'}>
    <g opacity={O(lit.gametes)}>
      <Sperm x={118} y={112} rods={3} scale={1.5} />
      <Txt x={176} y={120} size={26} weight={500}>+</Txt>
      <Egg x={246} y={112} r={46} />
      {[-12, 0, 12].map((d, i) => <Rod key={d} x={246 + d} y={112} len={24 - i * 4} w={6} tone={mum} rotate={[-10, 8, -4][i]} />)}
    </g>
    <g opacity={O(lit.zygote)}>
      <Arrow x1={302} y1={112} x2={346} y2={112} colour={ink} width={2.4} />
      <circle cx={416} cy={112} r={54} fill={nucFill} stroke={ink} strokeWidth="2" />
      <PairsIn cx={416} cy={112} tones={[[mum, dad], [mum, dad], [mum, dad]]} scale={1.1} />
    </g>
    <Txt x={96} y={46} size={14} weight={700}>sperm</Txt><Txt x={96} y={62} size={12.5} weight={500}>from the male</Txt><Txt x={246} y={40} size={14} weight={700}>egg</Txt><Txt x={246} y={56} size={12.5} weight={500}>from the female</Txt>
    <g opacity={O(lit.zygote)}><Txt x={416} y={40} size={13}>fertilised egg</Txt></g>
    {step === 'gametes' && <><path d="M40 176H300" stroke={ink} strokeWidth="1.6" /><path d="M40 170V176M300 170V176" stroke={ink} strokeWidth="1.6" /><Txt x={170} y={200} size={15} weight={700}>gametes: sex cells</Txt></>}
    {counts && <>{[[100, '23'], [246, '23']].map(([x, t]) => <g key={String(x)}><rect x={Number(x) - 24} y={170} width={48} height={28} rx="8" fill="white" stroke={ink} strokeWidth="1.6" /><Txt x={Number(x)} y={190} size={15} weight={700}>{t}</Txt></g>)}
      <Txt x={170} y={222} size={13} weight={500}>half the number of chromosomes</Txt></>}
    {step === 'fertilise' && <><rect x={392} y={180} width={48} height={28} rx="8" fill="white" stroke={ink} strokeWidth="2" /><Txt x={416} y={200} size={15} weight={700}>46</Txt><Txt x={324} y={74} size={13} weight={700}>fertilisation</Txt><Txt x={416} y={230} size={13} weight={500}>full set: a new mix of genes</Txt></>}
    {step === 'sexual' && <Txt x={270} y={214} size={15} weight={700}>two parents → a mixture of genes</Txt>}
    <Txt x={270} y={286} size={12} weight={500} fill={muted}>Only 3 chromosomes are drawn in each gamete; a human gamete has 23.</Txt>
  </Diagram>
}
function AsexualScene({ step }: { step: string }) {
  const tones: Array<[Tone, Tone]> = [[mum, dad], [mum, dad], [mum, dad]]
  return <Diagram title="Asexual reproduction. One parent cell divides by mitosis into two new cells. Each new cell has exactly the same chromosomes as the parent, so they are genetically identical clones.">
    <circle cx={120} cy={146} r={58} fill={nucFill} stroke={ink} strokeWidth="2" /><PairsIn cx={120} cy={146} tones={tones} scale={1.15} />
    <Txt x={120} y={230} size={14}>one parent cell</Txt>
    <Arrow x1={186} y1={128} x2={290} y2={88} colour={ink} width={2.4} /><Arrow x1={186} y1={164} x2={290} y2={204} colour={ink} width={2.4} />
    <Txt x={236} y={150} size={13}>mitosis</Txt>
    {[82, 210].map(y => <g key={y}><circle cx={346} cy={y} r={50} fill={nucFill} stroke={ink} strokeWidth="2" /><PairsIn cx={346} cy={y} tones={tones} scale={1} /></g>)}
    {step === 'asexual' && <><Txt x={120} y={60} size={14} weight={700}>no gametes</Txt><Txt x={120} y={78} size={14} weight={700}>no mixing of genes</Txt></>}
    {step === 'clones' && <><Txt x={346} y={153} size={20} weight={700}>=</Txt><Txt x={530} y={134} anchor="end" size={14} weight={700}>same genes</Txt><Txt x={530} y={152} anchor="end" size={14} weight={700}>as the parent:</Txt><Txt x={530} y={170} anchor="end" size={14} weight={700}>clones</Txt></>}
    <Txt x={346} y={286} size={13} weight={500}>two new cells</Txt>
  </Diagram>
}

// ---------- Lesson 43: meiosis ----------
const L_LEN = 34, S_LEN = 22
function MeiosisScene({ step, numbered = false, assessment = false }: { step: string; numbered?: boolean; assessment?: boolean }) {
  const order = ['where', 'pairs', 'copy', 'first', 'second', 'all']
  const at = numbered ? 5 : order.indexOf(step)
  const lit = [at >= 0, at >= 2, at >= 3, at >= 4]
  const cell3: Array<{ y: number; long: [Tone, Tone]; short: [Tone, Tone] }> = [{ y: 92, long: [mum, dad], short: [dad, mum] }, { y: 208, long: [dad, mum], short: [mum, dad] }]
  const gametes = [0, 1, 2, 3].map(i => { const c = cell3[i < 2 ? 0 : 1], tipped = i % 2 === 1; return { y: [48, 118, 188, 258][i], long: c.long[0], longTip: tipped ? c.long[1] : undefined, short: c.short[0], shortTip: tipped ? c.short[1] : undefined } })
  const title = assessment ? 'Meiosis drawn as four numbered stages from left to right: 1 one cell with two pairs of chromosomes; 2 one cell with X-shaped chromosomes; 3 two cells; 4 four small cells.'
    : 'Meiosis, from left to right. A parent cell has two pairs of chromosomes (a human cell has 23 pairs); in each pair one came from the mother (rose) and one from the father (blue). The DNA is copied, making X-shaped chromosomes. The cell divides, and each new cell gets one chromosome from each pair. Each cell divides again, pulling the X shapes apart. This makes four gametes, each with a single set and a different mix of chromosomes.'
  return <Diagram title={title}>
    <g opacity={O(lit[0])}>
      <circle cx={58} cy={150} r={46} fill={cellFill} stroke={ink} strokeWidth="2" />
      <Rod x={46} y={140} len={L_LEN} w={8} tone={mum} /><Rod x={58} y={140} len={L_LEN} w={8} tone={dad} />
      <Rod x={46} y={172} len={S_LEN} w={8} tone={dad} /><Rod x={58} y={172} len={S_LEN} w={8} tone={mum} />
    </g>
    <g opacity={O(lit[1])}>
      <Arrow x1={106} y1={150} x2={124} y2={150} colour={ink} width={2.2} />
      <circle cx={174} cy={150} r={48} fill={cellFill} stroke={ink} strokeWidth="2" />
      <XChrom x={160} y={136} len={L_LEN} tone={mum} /><XChrom x={188} y={136} len={L_LEN} tone={dad} />
      <XChrom x={160} y={172} len={S_LEN} tone={dad} /><XChrom x={188} y={172} len={S_LEN} tone={mum} />
    </g>
    <g opacity={O(lit[2])}>
      <Arrow x1={214} y1={126} x2={254} y2={104} colour={ink} width={2.2} /><Arrow x1={214} y1={174} x2={254} y2={196} colour={ink} width={2.2} />
      {cell3.map((c, i) => <g key={i}><circle cx={294} cy={c.y} r={38} fill={cellFill} stroke={ink} strokeWidth="2" />
        <XChrom x={282} y={c.y - 2} len={L_LEN} tone={c.long[0]} tip={c.long[1]} /><XChrom x={308} y={c.y + 4} len={S_LEN} tone={c.short[0]} tip={c.short[1]} /></g>)}
    </g>
    <g opacity={O(lit[3])}>
      {cell3.map((c, i) => <g key={i}><Arrow x1={332} y1={c.y - 8} x2={380} y2={c.y - 38} colour={ink} width={2} /><Arrow x1={332} y1={c.y + 8} x2={380} y2={c.y + 20} colour={ink} width={2} /></g>)}
      {gametes.map((g, i) => <g key={i}><circle cx={412} cy={g.y} r={27} fill={cellFill} stroke={ink} strokeWidth="2" />
        <Rod x={404} y={g.y} len={L_LEN - 4} w={7} tone={g.long} tip={g.longTip} rotate={-8} /><Rod x={420} y={g.y + 3} len={S_LEN - 2} w={7} tone={g.short} tip={g.shortTip} rotate={10} /></g>)}
    </g>
    {!assessment && <>
      <g opacity={O(lit[0])}><Txt x={58} y={220} size={13}>parent cell</Txt></g>
      <g opacity={O(lit[1])}><Txt x={174} y={220} size={13}>DNA copied</Txt></g>
      <g opacity={O(lit[2])}><Txt x={294} y={288} size={13}>divides</Txt></g>
      <g opacity={O(lit[3])}><Txt x={357} y={146} size={12.5}>divides</Txt><Txt x={357} y={161} size={12.5}>again</Txt><Txt x={490} y={138} size={14} weight={700}>four</Txt><Txt x={490} y={156} size={14} weight={700}>gametes</Txt></g>
    </>}
    {!numbered && <>
      {step === 'where' && <Label x={14} y={40} lines={['in an ovary or a testis']} strong />}
      {step === 'pairs' && <g><rect x={14} y={24} width={14} height={10} rx="3" fill={mum.fill} stroke={mum.line} /><Txt x={34} y={34} anchor="start" size={13} weight={500}>from the mother</Txt><rect x={14} y={44} width={14} height={10} rx="3" fill={dad.fill} stroke={dad.line} /><Txt x={34} y={54} anchor="start" size={13} weight={500}>from the father</Txt></g>}
      {step === 'copy' && <Txt x={174} y={82} size={13} weight={700}>X-shaped</Txt>}
      {step === 'first' && <Txt x={294} y={30} size={13} weight={700}>one of each pair</Txt>}
      {step === 'second' && <Txt x={490} y={186} size={12.5} weight={500}>X shapes</Txt>}
      {step === 'second' && <Txt x={490} y={201} size={12.5} weight={500}>pulled apart</Txt>}
      {step === 'all' && <><Txt x={490} y={186} size={12.5} weight={500}>single sets,</Txt><Txt x={490} y={201} size={12.5} weight={500}>all different</Txt></>}
      <Txt x={130} y={288} size={12} weight={500} fill={muted}>2 pairs drawn; humans have 23</Txt>
    </>}
    {numbered && <><Badge n={1} x={58} y={86} /><Badge n={2} x={174} y={84} /><Badge n={3} x={294} y={150} /><Badge n={4} x={474} y={150} /></>}
  </Diagram>
}

// ---------- Lesson 43: fertilised egg → embryo → specialised cells ----------
function Ball({ cx, cy, n, r }: { cx: number; cy: number; n: number; r: number }) {
  const spots: Pt[] = n === 2 ? [[-.5, 0], [.5, 0]] : n === 4 ? [[-.5, -.5], [.5, -.5], [-.5, .5], [.5, .5]] : [[0, 0], ...Array.from({ length: 6 }, (_, i) => [Math.cos(i * Math.PI / 3) * .56, Math.sin(i * Math.PI / 3) * .56] as Pt), ...Array.from({ length: 6 }, (_, i) => [Math.cos(i * Math.PI / 3 + .52) * .9, Math.sin(i * Math.PI / 3 + .52) * .9] as Pt)]
  const cr = n <= 4 ? r * .5 : r * .28
  return <g>{n > 4 && <circle cx={cx} cy={cy} r={r * 1.22} fill="white" stroke={nucLine} strokeWidth="1.4" />}{spots.map(([x, y], i) => <circle key={i} cx={cx + x * r} cy={cy + y * r} r={cr} fill={nucFill} stroke={nucLine} strokeWidth="1.5" />)}</g>
}
function EmbryoScene({ step }: { step: string }) {
  const lit = { fuse: step === 'fuse', divide: step === 'divide', spec: step === 'specialise' }
  return <Diagram title="From fertilisation to a whole organism. A sperm and an egg fuse to make one new cell with 46 chromosomes. It divides by mitosis into 2, 4, then many cells, forming an embryo. The embryo’s cells differentiate into specialised cells such as nerve cells, muscle cells and red blood cells.">
    <g opacity={O(lit.fuse)}>
      <Egg x={52} y={150} r={30} /><Sperm x={62} y={111} scale={.62} />
      <Arrow x1={86} y1={150} x2={108} y2={150} colour={ink} width={2.2} />
      <circle cx={136} cy={150} r={24} fill={nucFill} stroke={nucLine} strokeWidth="1.8" />
      <Txt x={52} y={206} size={13}>gametes</Txt><Txt x={52} y={222} size={13}>fuse</Txt><Txt x={136} y={206} size={13}>one cell:</Txt><Txt x={136} y={222} size={13}>46</Txt>
    </g>
    <g opacity={O(lit.divide)}>
      <Arrow x1={164} y1={150} x2={182} y2={150} colour={ink} width={2.2} /><Ball cx={210} cy={150} n={2} r={22} />
      <Arrow x1={236} y1={150} x2={252} y2={150} colour={ink} width={2.2} /><Ball cx={278} cy={150} n={4} r={22} />
      <Arrow x1={304} y1={150} x2={320} y2={150} colour={ink} width={2.2} /><Ball cx={362} cy={150} n={13} r={30} />
      <Txt x={262} y={98} size={13} weight={700}>mitosis, again and again</Txt><Txt x={362} y={214} size={13}>embryo</Txt>
    </g>
    <g opacity={O(lit.spec)}>
      <Arrow x1={402} y1={132} x2={426} y2={84} colour={ink} width={2} /><Arrow x1={406} y1={150} x2={426} y2={150} colour={ink} width={2} /><Arrow x1={402} y1={168} x2={426} y2={214} colour={ink} width={2} />
      <g transform="translate(462 70)"><path d="M-10 -4L-22 -14M-10 -4L-24 -2M-8 4L-18 12M6 0H40M40 0L46 -6M40 0L47 6" fill="none" stroke="#3d8fb6" strokeWidth="2.6" strokeLinecap="round" /><circle r="9" fill="#dceef8" stroke={ink} strokeWidth="1.6" /><circle r="3.5" fill={nucLine} /></g>
      <g transform="translate(474 150)"><path d="M-34 0Q-20 -11 0 -11Q20 -11 34 0Q20 11 0 11Q-20 11 -34 0Z" fill="#f4dce4" stroke={ink} strokeWidth="1.6" /><ellipse rx="4" ry="2.4" fill={nucLine} /></g>
      <RedCell x={474} y={222} scale={1.2} />
      <Txt x={474} y={102} size={12.5} weight={500}>nerve cell</Txt><Txt x={474} y={180} size={12.5} weight={500}>muscle cell</Txt><Txt x={474} y={254} size={12.5} weight={500}>red blood cell</Txt>
      <Txt x={470} y={30} size={13} weight={700}>specialised cells</Txt>
    </g>
  </Diagram>
}
function ChromosomeTable() {
  const rows = [['Human', '46', '23'], ['Cat', '38', '19'], ['Pea plant', '14', '7'], ['Fruit fly', '8', '4']]
  const xs = [60, 250, 410]
  return <Diagram title="A table of chromosome numbers. Human: 46 in body cells, 23 in gametes. Cat: 38 and 19. Pea plant: 14 and 7. Fruit fly: 8 and 4.">
    <rect x={40} y={30} width={460} height={240} rx="12" fill="white" stroke="#cfdde7" strokeWidth="1.6" />
    <rect x={40} y={30} width={460} height={48} rx="12" fill="#f1eafa" />
    <Txt x={xs[0]} y={60} anchor="start" size={14} weight={700}>Organism</Txt><Txt x={xs[1]} y={52} size={13.5} weight={700}>Chromosomes in</Txt><Txt x={xs[1]} y={69} size={13.5} weight={700}>a body cell</Txt><Txt x={xs[2]} y={52} size={13.5} weight={700}>Chromosomes in</Txt><Txt x={xs[2]} y={69} size={13.5} weight={700}>a gamete</Txt>
    {rows.map((r, i) => <g key={r[0]}>{i > 0 && <path d={`M52 ${78 + i * 48}H488`} stroke="#e2eaf0" />}<Txt x={xs[0]} y={108 + i * 48} anchor="start" size={15} weight={500}>{r[0]}</Txt><Txt x={xs[1]} y={108 + i * 48} size={16}>{r[1]}</Txt><Txt x={xs[2]} y={108 + i * 48} size={16}>{r[2]}</Txt></g>)}
  </Diagram>
}

// ---------- Lesson 44: sex chromosomes ----------
function Karyotype() {
  return <Diagram title="The 46 chromosomes of a male body cell arranged as 23 pairs, largest first. In each pair one chromosome came from the mother (rose) and one from the father (blue). Pairs 1 to 22 match. Pair 23 is the sex chromosomes, an X and a smaller Y.">
    <Txt x={14} y={26} anchor="start" size={14} weight={700}>pairs 1 to 22 match: genes for characteristics</Txt>
    {Array.from({ length: 23 }, (_, i) => {
      const row = i < 8 ? 0 : i < 16 ? 1 : 2, col = i - row * 8, x = 62 + col * 60, y = [72, 152, 226][row], len = 50 - i * 1.5
      if (i === 22) return <g key={i}>
        <rect x={x - 24} y={y - 32} width={48} height={60} rx="8" fill="#fdf6e6" stroke={geneLine} strokeWidth="1.6" strokeDasharray="5 4" />
        <Rod x={x - 7} y={y - 4} len={40} w={8} tone={mum} /><Rod x={x + 7} y={y + 4} len={20} w={8} tone={dad} />
        <Txt x={x - 7} y={y + 44} size={13} weight={700}>X</Txt><Txt x={x + 9} y={y + 44} size={13} weight={700}>Y</Txt>
        <Txt x={x - 20} y={y + 64} size={13} weight={700} fill={geneLine}>pair 23: sex chromosomes</Txt>
      </g>
      return <g key={i}><Rod x={x - 6} y={y} len={len} w={8} tone={mum} /><Rod x={x + 6} y={y} len={len} w={8} tone={dad} /><Txt x={x} y={y + len / 2 + 17} size={12} weight={500} fill={muted}>{i + 1}</Txt></g>
    })}
  </Diagram>
}
function SexScene({ step }: { step: string }) {
  const order = ['xy', 'gametes', 'punnett', 'chance']
  const at = order.indexOf(step)
  const G0 = 260, G1 = 80, C = 80
  return <Diagram title={'Sex determination. A female (XX) makes eggs that all carry an X. A male (XY) makes sperm that carry an X or a Y. ' + (at >= 2 ? 'A Punnett square has the eggs along the top and the sperm down the side; its squares are XX, XX, XY and XY.' : '') + (at >= 3 ? ' Two of the four squares are girls and two are boys, a 1 in 2 chance of each.' : '')}>
    <g>
      <Txt x={24} y={34} anchor="start" size={14} weight={700}>female</Txt>
      <Rod x={50} y={76} len={46} w={10} tone={mum} /><Rod x={72} y={76} len={46} w={10} tone={mum} />
      <Txt x={50} y={120} size={14} weight={700} fill={mum.line}>X</Txt><Txt x={72} y={120} size={14} weight={700} fill={mum.line}>X</Txt>
      <Txt x={24} y={176} anchor="start" size={14} weight={700}>male</Txt>
      <Rod x={50} y={218} len={46} w={10} tone={dad} /><Rod x={72} y={228} len={26} w={10} tone={dad} />
      <Txt x={50} y={262} size={14} weight={700} fill={dad.line}>X</Txt><Txt x={72} y={262} size={14} weight={700} fill={dad.line}>Y</Txt>
      {step === 'xy' && <><Txt x={120} y={72} anchor="start" size={14} weight={700}>XX</Txt><Txt x={120} y={90} anchor="start" size={13} weight={500}>lets female characteristics develop</Txt><Txt x={120} y={214} anchor="start" size={14} weight={700}>XY</Txt><Txt x={120} y={232} anchor="start" size={13} weight={500}>the Y causes male characteristics</Txt><Txt x={270} y={288} size={13} weight={700} fill={geneLine}>the sex chromosomes: pair 23</Txt></>}
    </g>
    {at >= 1 && <g>
      <Arrow x1={96} y1={62} x2={272} y2={48} colour={mum.line} width={2} /><Arrow x1={96} y1={214} x2={200} y2={170} colour={dad.line} width={2} />
      <Egg x={300} y={48} letter="X" /><Egg x={380} y={48} letter="X" />
      <Sperm x={230} y={118} letter="X" scale={.9} /><Sperm x={230} y={198} letter="Y" scale={.9} />
      <Txt x={466} y={42} anchor="start" size={13}>eggs:</Txt><Txt x={466} y={58} anchor="start" size={13}>all X</Txt>
      <Txt x={218} y={248} size={13}>sperm:</Txt><Txt x={218} y={264} size={13}>X or Y</Txt>
    </g>}
    {at >= 1 && <g opacity={O(at >= 2)}>
      {[0, 1].map(r => [0, 1].map(c => { const girl = r === 0
        return <g key={`${r}${c}`}><rect x={G0 + c * C} y={G1 + r * C} width={C} height={C} fill={at >= 3 ? (girl ? '#efe6f8' : '#e1f1ea') : 'white'} stroke={ink} strokeWidth="2" />
          {at >= 2 && <Geno x={G0 + c * C + C / 2} y={G1 + r * C + C / 2 + 8} a="X" b={r ? 'Y' : 'X'} size={24} />}</g> }))}
    </g>}
    {step === 'punnett' && <Txt x={340} y={282} size={13} weight={700}>a Punnett square</Txt>}
    {at >= 3 && <><Txt x={430} y={116} anchor="start" size={13} weight={700}>XX: girl</Txt><Txt x={430} y={132} anchor="start" size={13} weight={500}>2 of 4</Txt>
      <Txt x={430} y={196} anchor="start" size={13} weight={700}>XY: boy</Txt><Txt x={430} y={212} anchor="start" size={13} weight={500}>2 of 4</Txt>
      <Txt x={340} y={282} size={14} weight={700}>each: 1 in 2 = 50%</Txt></>}
  </Diagram>
}

// ---------- Genetic diagrams: circles-and-lines cross ----------
function LinesCross({ left, right, labels, highlight = [], note, title, tag }: { left: string; right: string; labels: string[]; highlight?: number[]; note?: string; title: string; tag?: [string, string] }) {
  const P: Pt[] = [[200, 44], [400, 44]], gx = [140, 240, 360, 460], ox = [140, 248, 352, 460], GY = 136, OY = 228
  const g = [left[0], left[1], right[0], right[1]]
  const kids: Array<[number, number]> = [[0, 2], [1, 2], [0, 3], [1, 3]]
  return <Diagram title={title}>
    {['parents', 'gametes', 'offspring'].map((t, i) => <Txt key={t} x={12} y={[48, 140, 232][i]} anchor="start" size={12.5} weight={500} fill={muted}>{t}</Txt>)}
    {[0, 1].map(p => [0, 1].map(k => <path key={`${p}${k}`} d={`M${P[p][0]} ${P[p][1] + 22}L${gx[p * 2 + k]} ${GY - 16}`} stroke={ink} strokeWidth="1.6" />))}
    {kids.map(([a, b], i) => <g key={i}><path d={`M${gx[a]} ${GY + 16}L${ox[i]} ${OY - 22}`} stroke={mum.line} strokeWidth="1.6" /><path d={`M${gx[b]} ${GY + 16}L${ox[i]} ${OY - 22}`} stroke={dad.line} strokeWidth="1.6" /></g>)}
    {P.map(([x, y], p) => <g key={p}><circle cx={x} cy={y} r={22} fill="white" stroke={p ? dad.line : mum.line} strokeWidth="2" /><Txt x={x} y={y + 7} size={19} weight={700} fill={p ? dad.line : mum.line}>{p ? right : left}</Txt>
      {tag && <Txt x={x + (p ? 30 : -30)} y={y + 5} anchor={p ? 'start' : 'end'} size={13} weight={500}>{tag[p]}</Txt>}</g>)}
    {g.map((l, i) => <g key={i}><circle cx={gx[i]} cy={GY} r={16} fill={i < 2 ? mum.pale : dad.pale} stroke={i < 2 ? mum.line : dad.line} strokeWidth="1.8" /><Txt x={gx[i]} y={GY + 6} size={16} weight={700} fill={i < 2 ? mum.line : dad.line}>{l}</Txt></g>)}
    {kids.map(([a, b], i) => <g key={i}><circle cx={ox[i]} cy={OY} r={22} fill={highlight.includes(i) ? '#fdf1d8' : 'white'} stroke={highlight.includes(i) ? geneLine : ink} strokeWidth={highlight.includes(i) ? 3 : 2} /><Geno x={ox[i]} y={OY + 7} a={g[a]} b={g[b]} size={19} />
      <Txt x={ox[i]} y={OY + 42} size={12.5} weight={highlight.includes(i) ? 700 : 500}>{labels[i]}</Txt></g>)}
    {note && <Txt x={300} y={292} size={13.5} weight={700}>{note}</Txt>}
  </Diagram>
}

// ---------- Lesson 44: alleles, genotype and phenotype (mice) ----------
const COLS = [{ x: 130, a: 'B', b: 'B' }, { x: 290, a: 'B', b: 'b' }, { x: 450, a: 'b', b: 'b' }]
const alleleColour = (l: string) => l === 'B' ? furBlack : furBrown
function AlleleScene({ step }: { step: string }) {
  if (step === 'genes') return <Diagram title="Left: a black mouse and a brown mouse; fur colour in mice is controlled by a single gene. Right: three people of different heights; height is controlled by several genes.">
    <Mouse x={86} y={130} fur={furBlack} s={1.1} /><Mouse x={196} y={130} fur={furBrown} s={1.1} />
    <Txt x={140} y={206} size={14} weight={700}>fur colour in mice</Txt><Txt x={140} y={224} size={13} weight={500}>one gene</Txt>
    <path d="M272 40V260" stroke="#cfdde7" strokeWidth="2" />
    {[[350, 112, '#a9cbe0'], [410, 146, '#c6d9b4'], [470, 128, '#f2c9a4']].map(([x, h, c]) => { const X = Number(x), Hh = Number(h), top = 200 - Hh
      return <g key={X}><circle cx={X} cy={top + 11} r={12} fill={skin} stroke={skinLine} strokeWidth="1.6" /><path d={`M${X - 16} 200V${top + 40}Q${X - 16} ${top + 24} ${X} ${top + 24}Q${X + 16} ${top + 24} ${X + 16} ${top + 40}V200Z`} fill={String(c)} stroke={ink} strokeWidth="1.6" /></g> })}
    <path d="M320 200H500" stroke={ink} strokeWidth="1.6" />
    <Txt x={410} y={226} size={14} weight={700}>height in people</Txt><Txt x={410} y={244} size={13} weight={500}>several genes</Txt>
  </Diagram>
  const on = (i: number) => step === 'pair' ? i === 1 : step === 'homo' ? i !== 1 : step === 'hetero' ? i === 1 : step === 'dominant' ? i !== 2 : step === 'recessive' ? i === 2 : true
  const lettersOn = step !== 'phenotype', miceOn = step !== 'genotype'
  return <Diagram title={'Three mice and their fur-colour alleles. Each mouse has a pair of chromosomes with the fur gene at the same place on both: BB gives black fur, Bb gives black fur, and bb gives brown fur. B, black, is dominant; b, brown, is recessive.'}>
    {COLS.map((c, i) => <g key={i} opacity={O(on(i))}>
      <g opacity={lettersOn ? 1 : .35}>
        <Rod x={c.x - 14} y={104} len={100} w={14} tone={mum} band bandAt={-.12} bandColour={alleleColour(c.a)} /><Rod x={c.x + 14} y={104} len={100} w={14} tone={dad} band bandAt={-.12} bandColour={alleleColour(c.b)} />
        <Txt x={c.x - 36} y={98} size={18} weight={700} fill={alleleColour(c.a)}>{c.a}</Txt><Txt x={c.x + 36} y={98} size={18} weight={700} fill={alleleColour(c.b)}>{c.b}</Txt>
        <Txt x={c.x} y={184} size={22} weight={700}>{c.a + c.b}</Txt>
      </g>
      <g opacity={miceOn ? 1 : .35}><Mouse x={c.x} y={232} fur={c.a === 'B' ? furBlack : furBrown} s={.9} /><Txt x={c.x} y={284} size={13} weight={500}>{c.a === 'B' ? 'black fur' : 'brown fur'}</Txt></g>
    </g>)}
    {step === 'pair' && <><Txt x={530} y={26} anchor="end" size={14} weight={700}>B and b: two alleles of one gene</Txt>
      <g><rect x={14} y={20} width={14} height={10} rx="3" fill={mum.fill} stroke={mum.line} /><Txt x={34} y={30} anchor="start" size={12.5} weight={500}>from the mother</Txt><rect x={14} y={38} width={14} height={10} rx="3" fill={dad.fill} stroke={dad.line} /><Txt x={34} y={48} anchor="start" size={12.5} weight={500}>from the father</Txt></g></>}
    {step === 'homo' && [0, 2].map(i => <Txt key={i} x={COLS[i].x} y={28} size={14} weight={700}>same: homozygous</Txt>)}
    {step === 'hetero' && <Txt x={290} y={28} size={14} weight={700}>different: heterozygous</Txt>}
    {step === 'dominant' && <Txt x={210} y={28} size={14} weight={700}>B is dominant: one B gives black fur</Txt>}
    {step === 'recessive' && <Txt x={530} y={28} anchor="end" size={14} weight={700}>b is recessive: needs bb</Txt>}
    {step === 'genotype' && <><Txt x={12} y={158} anchor="start" size={14} weight={700} fill={geneLine}>genotype</Txt><rect x={70} y={162} width={440} height={32} rx="8" fill="none" stroke={geneLine} strokeWidth="2" /></>}
    {step === 'phenotype' && <><Txt x={12} y={206} anchor="start" size={14} weight={700} fill={geneLine}>phenotype</Txt><rect x={70} y={210} width={440} height={84} rx="8" fill="none" stroke={geneLine} strokeWidth="2" /></>}
  </Diagram>
}
function Punnett({ x, y, top, side, cell = 76, show = true, nums = false, tint, mark = [], mice = false, labels }: { x: number; y: number; top: string[]; side: string[]; cell?: number; show?: boolean; nums?: boolean; tint?: (g: string) => string | undefined; mark?: number[]; mice?: boolean; labels?: (g: string) => string }) {
  return <g>
    {top.map((l, c) => <Egg key={c} x={x + c * cell + cell / 2} y={y - 26} r={16} tone={mum} letter={l} />)}
    {side.map((l, r) => <Egg key={r} x={x - 26} y={y + r * cell + cell / 2} r={16} tone={dad} letter={l} />)}
    {side.map((s, r) => top.map((t, c) => { const i = r * 2 + c, gt = pairOf(t, s).map(p => p[0]).join(''), X = x + c * cell, Y = y + r * cell
      return <g key={i}><rect x={X} y={Y} width={cell} height={cell} fill={show && tint ? tint(gt) ?? 'white' : 'white'} stroke={ink} strokeWidth="2" />
        {show && <Geno x={X + cell / 2} y={Y + (mice || labels ? cell * .42 : cell / 2 + 8)} a={t} b={s} size={22} />}
        {show && mice && <Mouse x={X + cell / 2} y={Y + cell * .72} fur={gt.includes('B') ? furBlack : furBrown} s={.42} />}
        {show && labels && <Txt x={X + cell / 2} y={Y + cell * .78} size={12.5} weight={500}>{labels(gt)}</Txt>}
        {nums && (show ? <Badge n={i + 1} x={X + 15} y={Y + 15} /> : <Badge n={i + 1} x={X + cell / 2} y={Y + cell / 2} />)}
        {mark.includes(i) && <rect x={X + 3} y={Y + 3} width={cell - 6} height={cell - 6} fill="none" stroke={geneLine} strokeWidth="3.5" />}
      </g> }))}
  </g>
}
function CrossScene({ step }: { step: string }) {
  if (step === 'lines') return <LinesCross left="BB" right="bb" tag={['black', 'brown']} labels={['black fur', 'black fur', 'black fur', 'black fur']} note="every baby is Bb: all have black fur" title="A genetic diagram of a cross between a BB mouse with black fur and a bb mouse with brown fur. The BB parent makes B gametes and the bb parent makes b gametes. All four possible offspring are Bb, with black fur." />
  const ratio = step === 'ratio' || step === 'worked'
  return <Diagram title={'A Punnett square for a cross between two Bb mice, both with black fur. Each parent can make B or b gametes. The squares are BB, Bb, Bb and bb.' + (ratio ? ' Three squares give black fur and one, bb, gives brown fur: a 3 : 1 ratio, or a 1 in 4 (25%) chance of brown.' : '')}>
    <Txt x={210} y={22} size={13} weight={500}>parent 1: Bb (black)</Txt>
    <text transform="translate(70 170) rotate(-90)" textAnchor="middle" fontSize="13" fill={ink}>parent 2: Bb (black)</text>
    <Punnett x={130} y={70} top={['B', 'b']} side={['B', 'b']} cell={100} mice tint={ratio ? g => g.includes('B') ? '#e8e8ec' : '#f5e6d8' : undefined} mark={step === 'worked' ? [3] : []} />
    {ratio && <><Txt x={346} y={150} anchor="start" size={14} weight={700}>black: 3 of 4</Txt><Txt x={346} y={220} anchor="start" size={14} weight={700}>brown (bb): 1 of 4</Txt>
      <Txt x={346} y={262} anchor="start" size={14} weight={700} fill={geneLine}>{step === 'worked' ? '1 in 4 = 25% brown' : 'ratio 3 : 1'}</Txt></>}
  </Diagram>
}
function PeaQuestion({ assessment }: { assessment: boolean }) {
  return <Diagram title={assessment ? 'A Punnett square for a cross between two Tt pea plants. The gametes T and t are along the top and T and t down the side. The four squares are numbered 1 to 4 and left empty.' : 'A Punnett square for a cross between two Tt pea plants: square 1 TT tall, square 2 Tt tall, square 3 Tt tall, square 4 tt short.'}>
    <Txt x={300} y={22} size={13} weight={500}>parent 1: Tt</Txt>
    <text transform="translate(150 164) rotate(-90)" textAnchor="middle" fontSize="13" fill={ink}>parent 2: Tt</text>
    <Punnett x={220} y={70} top={['T', 't']} side={['T', 't']} cell={96} show={!assessment} nums labels={g => g.includes('T') ? 'tall' : 'short'} />
  </Diagram>
}

// ---------- Lesson 45: disorders ----------
type Shade = 'none' | 'half' | 'full' | 'unknown'
function Member({ x, y, male, shade, size = 30, ring = false, dim = false }: { x: number; y: number; male: boolean; shade: Shade; size?: number; ring?: boolean; dim?: boolean }) {
  const h = size / 2
  const outline = male ? <rect x={x - h} y={y - h} width={size} height={size} fill="white" stroke={ink} strokeWidth="2" /> : <circle cx={x} cy={y} r={h} fill="white" stroke={ink} strokeWidth="2" />
  const half = male ? `M${x - h} ${y - h}H${x}V${y + h}H${x - h}Z` : `M${x} ${y - h}A${h} ${h} 0 0 0 ${x} ${y + h}Z`
  return <g opacity={dim ? faded : 1}>
    {ring && (male ? <rect x={x - h - 6} y={y - h - 6} width={size + 12} height={size + 12} rx="4" fill="none" stroke={geneLine} strokeWidth="2.5" /> : <circle cx={x} cy={y} r={h + 6} fill="none" stroke={geneLine} strokeWidth="2.5" />)}
    {outline}
    {shade === 'full' && (male ? <rect x={x - h} y={y - h} width={size} height={size} fill={fault} stroke={ink} strokeWidth="2" /> : <circle cx={x} cy={y} r={h} fill={fault} stroke={ink} strokeWidth="2" />)}
    {shade === 'half' && <><path d={half} fill={fault} />{male ? <rect x={x - h} y={y - h} width={size} height={size} fill="none" stroke={ink} strokeWidth="2" /> : <circle cx={x} cy={y} r={h} fill="none" stroke={ink} strokeWidth="2" />}<path d={`M${x} ${y - h}V${y + h}`} stroke={ink} strokeWidth="1.4" /></>}
    {shade === 'unknown' && <Txt x={x} y={y + 6} size={17} weight={700}>?</Txt>}
  </g>
}
function TreeKey({ x, y, unknown = false, lit = true }: { x: number; y: number; unknown?: boolean; lit?: boolean }) {
  const rows: Array<[Shade, string]> = [['full', 'has cystic fibrosis'], ['half', 'carrier'], ['none', 'unaffected'], ...(unknown ? [['unknown', 'not known'] as [Shade, string]] : [])]
  return <g opacity={lit ? 1 : .55}>
    <rect x={x} y={y} width={166} height={48 + rows.length * 34} rx="10" fill="#f7fafc" stroke="#cfdde7" strokeWidth="1.6" />
    <Txt x={x + 12} y={y + 20} anchor="start" size={13} weight={700}>Key</Txt>
    <Member x={x + 22} y={y + 38} male shade="none" size={16} /><Txt x={x + 36} y={y + 43} anchor="start" size={12.5} weight={500}>male</Txt>
    <Member x={x + 90} y={y + 38} male={false} shade="none" size={16} /><Txt x={x + 104} y={y + 43} anchor="start" size={12.5} weight={500}>female</Txt>
    {rows.map(([s, t], i) => <g key={t}><Member x={x + 22} y={y + 72 + i * 30} male shade={s} size={18} /><Txt x={x + 38} y={y + 77 + i * 30} anchor="start" size={12.5} weight={500}>{t}</Txt></g>)}
  </g>
}
function CfScene({ step }: { step: string }) {
  if (step === 'cross') return <LinesCross left="Ff" right="Ff" tag={['carrier', 'carrier']} labels={['unaffected', 'carrier', 'carrier', 'cystic fibrosis']} highlight={[3]} note="1 in 4 (25%) chance of ff: cystic fibrosis" title="A genetic diagram of two carriers of cystic fibrosis, both Ff. Each makes F or f gametes. The four possible offspring are FF unaffected, Ff carrier, Ff carrier and ff with cystic fibrosis: a 1 in 4 chance." />
  const rows: Array<{ g: [string, string]; shade: Shade; text: string; y: number }> = [{ g: ['F', 'F'], shade: 'none', text: 'unaffected', y: 70 }, { g: ['F', 'f'], shade: 'half', text: 'carrier', y: 150 }, { g: ['f', 'f'], shade: 'full', text: 'has cystic fibrosis', y: 230 }]
  const rowOn = (i: number) => step === 'allele' ? i === 2 : step === 'carrier' ? i === 1 : false
  return <Diagram title="A body cell with its membrane and nucleus. In the nucleus, a pair of chromosomes carries the cystic fibrosis gene: one F allele and one faulty f allele. Beside it, three genotypes: FF unaffected, Ff a carrier, ff has cystic fibrosis.">
    <g opacity={O(step === 'intro' || step === 'allele')}>
      <Cell cx={116} cy={150} rx={94} ry={84} seed={6} line={step === 'allele' ? fault : ink} width={step === 'allele' ? 5 : 2} />
      <circle cx={116} cy={150} r={44} fill={nucFill} stroke={nucLine} strokeWidth="1.8" />
      <Rod x={104} y={150} len={66} w={11} tone={mum} band bandAt={-.15} bandColour={ink} /><Rod x={128} y={150} len={66} w={11} tone={dad} band bandAt={-.15} bandColour={fault} />
      <Txt x={86} y={146} size={15} weight={700}>F</Txt><Txt x={146} y={146} size={15} weight={700} fill={fault}>f</Txt>
    </g>
    {step === 'intro' && <Label x={14} y={30} to={[134, 141]} lines={['f: a faulty allele']} strong colour={fault} />}
    {step === 'allele' && <Label x={14} y={30} to={[40, 110]} lines={['cell membrane affected']} strong colour={fault} />}
    {step === 'carrier' && <Txt x={116} y={270} size={13} weight={500}>one f allele: no disorder</Txt>}
    {rows.map((r, i) => <g key={i} opacity={O(rowOn(i))}>
      <Geno x={290} y={r.y + 8} a={r.g[0]} b={r.g[1]} size={22} plain />
      <Member x={352} y={r.y} male shade={r.shade} size={32} />
      <Txt x={380} y={r.y + 5} anchor="start" size={14} weight={700}>{r.text}</Txt>
    </g>)}
  </Diagram>
}
function Hand({ x, y, extra = false }: { x: number; y: number; extra?: boolean }) {
  const fingers: Array<[number, number, number]> = [[-24, 50, -6], [-8, 58, -2], [8, 56, 2], [23, 46, 7]]
  return <g strokeLinejoin="round">
    <g transform={`translate(${x - 38} ${y + 36}) rotate(-38)`}><rect x={-9} y={-40} width={18} height={44} rx="9" fill={skin} stroke={skinLine} strokeWidth="1.8" /></g>
    {fingers.map(([dx, len, r], i) => <g key={i} transform={`translate(${x + dx} ${y + 6}) rotate(${r})`}><rect x={-7.5} y={-len} width={15} height={len + 10} rx="7.5" fill={skin} stroke={skinLine} strokeWidth="1.8" /></g>)}
    {extra && <g transform={`translate(${x + 38} ${y + 18}) rotate(28)`}><rect x={-7} y={-34} width={14} height={40} rx="7" fill={skin} stroke={fault} strokeWidth="2.4" /></g>}
    <rect x={x - 36} y={y} width={72} height={78} rx="22" fill={skin} stroke={skinLine} strokeWidth="1.8" />
  </g>
}
function PolyScene({ step }: { step: string }) {
  if (step === 'cross') return <LinesCross left="Dd" right="dd" tag={['polydactyly', 'unaffected']} labels={['polydactyly', 'unaffected', 'polydactyly', 'unaffected']} highlight={[0, 2]} note="1 in 2 (50%) chance of polydactyly" title="A genetic diagram of a parent with polydactyly (Dd) and a parent without it (dd). Gametes D or d, and d or d. The four possible offspring are Dd, dd, Dd and dd: a 1 in 2 chance of polydactyly." />
  return <Diagram title="Two simple outlines of hands. The first has five digits. The second has an extra, sixth finger beside the little finger: polydactyly. Beside them, Dd has polydactyly and dd does not.">
    <g opacity={O(step === 'hand')}>
      <Hand x={80} y={130} /><Hand x={206} y={130} extra />
      <Txt x={80} y={236} size={13} weight={500}>five digits</Txt><Txt x={210} y={236} size={13} weight={700}>an extra finger</Txt>
    </g>
    {step === 'hand' && <Label x={270} y={80} to={[250, 120]} lines={['polydactyly']} strong colour={fault} />}
    <g opacity={O(step === 'allele')}>
      <Geno x={360} y={120} a="D" b="d" size={24} plain /><Txt x={400} y={112} anchor="start" size={14} weight={700}>has polydactyly</Txt><Txt x={400} y={130} anchor="start" size={12.5} weight={500}>one D is enough</Txt>
      <Geno x={360} y={200} a="d" b="d" size={24} plain /><Txt x={400} y={200} anchor="start" size={14} weight={700}>unaffected</Txt>
      <Txt x={420} y={50} size={14} weight={700} fill={fault}>D is dominant</Txt>
    </g>
  </Diagram>
}
// One family, three generations: parents 1 and 2 are carriers; their children are unaffected, have cystic fibrosis, or are a carrier.
const FAM = { a: [100, 56], b: [200, 56], c: [60, 150], d: [150, 150], e: [240, 150], f: [330, 150], baby: [285, 236] } as const
function FamilyLines() {
  return <g stroke={ink} strokeWidth="2" fill="none">
    <path d="M115 56H185M150 56V104M60 104H240M60 104V135M150 104V135M240 104V135" />
    <path d="M255 150H315M285 150V221" />
  </g>
}
function TreeScene({ step, numbered = false, assessment = false }: { step: string; numbered?: boolean; assessment?: boolean }) {
  const ring = (k: string) => step === 'read' && ['a', 'b', 'e', 'f'].includes(k)
  const dim = (k: string) => step === 'baby' && !['e', 'f', 'baby'].includes(k)
  return <Diagram title={assessment ? 'A family tree for cystic fibrosis with a key. Two carrier parents at the top have three children: a son, numbered 1, who is unaffected; a daughter, numbered 2, who has cystic fibrosis; and a son, numbered 3, who is a carrier. Son 3 and his partner, also a carrier, are expecting a baby, numbered 4, shown with a question mark.'
    : 'A family tree for cystic fibrosis with a key: squares are males, circles are females, full shading has cystic fibrosis and half shading is a carrier. Two carrier parents have three children: an unaffected son, a daughter with cystic fibrosis, and a carrier son. The carrier son and his carrier partner are expecting a baby.'}>
    <FamilyLines />
    <Member x={FAM.a[0]} y={FAM.a[1]} male shade="half" ring={ring('a')} dim={dim('a')} /><Member x={FAM.b[0]} y={FAM.b[1]} male={false} shade="half" ring={ring('b')} dim={dim('b')} />
    <Member x={FAM.c[0]} y={FAM.c[1]} male shade="none" dim={dim('c')} /><Member x={FAM.d[0]} y={FAM.d[1]} male={false} shade="full" dim={dim('d')} />
    <Member x={FAM.e[0]} y={FAM.e[1]} male shade="half" ring={ring('e')} /><Member x={FAM.f[0]} y={FAM.f[1]} male={false} shade="half" ring={ring('f')} />
    <Member x={FAM.baby[0]} y={FAM.baby[1]} male={false} shade="unknown" />
    <TreeKey x={364} y={14} lit={step === 'key' || numbered} />
    {!numbered && <Txt x={285} y={274} size={12.5} weight={500}>new baby</Txt>}
    {step === 'read' && <Txt x={200} y={290} size={13.5} weight={700}>carriers without the disorder: the allele is recessive</Txt>}
    {step === 'baby' && <><Txt x={120} y={228} size={13.5} weight={700}>Ff × Ff</Txt><Txt x={120} y={248} size={13} weight={500}>ff 25% · Ff 50% · FF 25%</Txt></>}
    {numbered && <><Badge n={1} x={30} y={176} /><Badge n={2} x={120} y={176} /><Badge n={3} x={214} y={176} /><Badge n={4} x={316} y={250} /></>}
  </Diagram>
}
function TreeQuestion2() {
  return <Diagram title="A family tree for cystic fibrosis with a key. A father, numbered 1, is shown with a question mark: his status is not known. A mother, numbered 2, is a carrier. Their son, numbered 3, has cystic fibrosis. Their daughter, numbered 4, is unaffected.">
    <g stroke={ink} strokeWidth="2" fill="none"><path d="M135 70H225M180 70V130M110 130H250M110 130V165M250 130V165" /></g>
    <Member x={120} y={70} male shade="unknown" /><Member x={240} y={70} male={false} shade="half" />
    <Member x={110} y={180} male shade="full" /><Member x={250} y={180} male={false} shade="none" />
    <Badge n={1} x={84} y={70} /><Badge n={2} x={276} y={70} /><Badge n={3} x={74} y={180} /><Badge n={4} x={286} y={180} />
    <TreeKey x={364} y={14} unknown />
  </Diagram>
}

// ---------- Lesson 45: embryo screening ----------
function EmbryoCluster({ x, y, r = 14, missing = false }: { x: number; y: number; r?: number; missing?: boolean }) {
  const spots: Pt[] = [[-.45, -.45], [.45, -.45], [-.45, .45], [.45, .45], [0, -.1], [-.1, .2]]
  return <g><circle cx={x} cy={y} r={r * 1.45} fill="white" stroke={nucLine} strokeWidth="1.4" />{spots.slice(0, missing ? 5 : 6).map(([a, b], i) => i === 1 && missing ? null : <circle key={i} cx={x + a * r} cy={y + b * r} r={r * .5} fill={nucFill} stroke={nucLine} strokeWidth="1.3" />)}</g>
}
function TestCard({ x, y }: { x: number; y: number }) {
  return <g><rect x={x} y={y} width={170} height={96} rx="12" fill="white" stroke={ink} strokeWidth="1.8" />
    <Helix cx={x + 34} cy={y + 48} length={70} amp={10} turns={2} />
    <Txt x={x + 108} y={y + 44} size={14} weight={700}>test the</Txt><Txt x={x + 108} y={y + 62} size={14} weight={700}>genes</Txt></g>
}
function ScreenScene({ step }: { step: string }) {
  if (step === 'decisions') return <Diagram title="Two possible decisions after embryo screening. After IVF, embryos with alleles linked to a disorder would not be put into the womb and would be destroyed. For an embryo in the womb, a result could lead to a decision to end the pregnancy.">
    <Txt x={270} y={28} size={14} weight={700}>a result can lead to a hard decision</Txt>
    {[{ y: 60, a: 'after IVF', b: ['embryos with a disorder allele', 'would not be used, and', 'would be destroyed'] }, { y: 172, a: 'in the womb', b: ['a result could lead to', 'a decision to end', 'the pregnancy'] }].map((r, i) => <g key={i}>
      <rect x={24} y={r.y} width={180} height={88} rx="12" fill="#f7fafc" stroke="#cfdde7" strokeWidth="1.6" />
      {i === 0 ? <EmbryoCluster x={70} y={r.y + 44} r={14} /> : <g><path d={`M50 ${r.y + 16}Q46 ${r.y + 72} 72 ${r.y + 76}Q98 ${r.y + 72} 94 ${r.y + 16}Z`} fill="#fbeee6" stroke="#c9a48c" strokeWidth="1.8" /><EmbryoCluster x={72} y={r.y + 48} r={8} /></g>}
      <Txt x={150} y={r.y + 50} size={13.5} weight={700}>{r.a}</Txt>
      <Arrow x1={212} y1={r.y + 44} x2={252} y2={r.y + 44} colour={ink} width={2.2} />
      <rect x={262} y={r.y} width={256} height={88} rx="12" fill="white" stroke={ink} strokeWidth="1.6" />
      {r.b.map((l, k) => <Txt key={k} x={390} y={r.y + 28 + k * 19} size={13.5} weight={500}>{l}</Txt>)}
    </g>)}
  </Diagram>
  if (step === 'for' || step === 'against') {
    const cols = [{ key: 'for', x: 16, colour: '#3f6f93', fill: '#eaf2f8', head: 'Arguments for', items: [['could help stop people', 'suffering'], ['treating disorders', 'costs a lot of money'], ['laws stop it going', 'too far']] },
      { key: 'against', x: 276, colour: '#86577a', fill: '#f6edf3', head: 'Arguments against', items: [['suggests people with', 'disorders are not wanted'], ['people may one day choose', 'features like eye colour'], ['screening is', 'expensive']] }]
    return <Diagram title="Two lists of arguments about embryo screening. For: it could help stop people suffering; treating disorders costs a lot of money; laws stop it going too far. Against: it suggests people with genetic disorders are not wanted and could lead to unfair treatment; people may one day choose features such as eye colour; screening is expensive.">
      {cols.map(c => <g key={c.key} opacity={step === c.key ? 1 : .35}>
        <rect x={c.x} y={16} width={248} height={268} rx="14" fill={c.fill} stroke={c.colour} strokeWidth="2" />
        <Txt x={c.x + 124} y={46} size={16} weight={700} fill={c.colour}>{c.head}</Txt>
        {c.items.map((it, k) => <g key={k}><circle cx={c.x + 22} cy={90 + k * 68} r="5" fill={c.colour} />{it.map((l, j) => <Txt key={j} x={c.x + 36} y={95 + k * 68 + j * 18} anchor="start" size={13.5} weight={500}>{l}</Txt>)}</g>)}
      </g>)}
    </Diagram>
  }
  return <Diagram title="Embryo screening. Top: in IVF, embryos are made in a lab dish, and one cell is removed from an embryo. Bottom: DNA can also be taken from an embryo growing in the womb. In both cases the genes are tested for inherited disorders.">
    <g opacity={O(step === 'ivf')}>
      <ellipse cx={130} cy={92} rx={104} ry={40} fill="#f2f8fb" stroke={ink} strokeWidth="2" /><ellipse cx={130} cy={86} rx={96} ry={30} fill="none" stroke="#b7cfdc" strokeWidth="1.4" />
      <EmbryoCluster x={72} y={92} /><EmbryoCluster x={128} y={96} missing /><EmbryoCluster x={186} y={90} />
      <path d="M150 28L136 78" stroke={ink} strokeWidth="5" strokeLinecap="round" /><path d="M150 28L136 78" stroke="white" strokeWidth="2" strokeLinecap="round" /><circle cx={135} cy={82} r={5} fill={nucFill} stroke={nucLine} strokeWidth="1.3" />
      <Txt x={130} y={152} size={13} weight={700}>IVF: embryos made in a lab</Txt>
      <Arrow x1={240} y1={90} x2={330} y2={124} colour={ink} width={2.2} /><Txt x={286} y={88} size={12.5} weight={500}>one cell</Txt>
    </g>
    <g opacity={O(step === 'womb')}>
      <path d="M88 186Q80 280 130 284Q180 280 172 186Q130 170 88 186Z" fill="#fbeee6" stroke="#c9a48c" strokeWidth="2" />
      <EmbryoCluster x={130} y={236} r={10} />
      <Txt x={184} y={276} anchor="start" size={13} weight={700}>embryo in the womb</Txt>
      <Arrow x1={176} y1={226} x2={330} y2={180} colour={ink} width={2.2} /><Txt x={262} y={226} size={12.5} weight={500}>DNA</Txt>
    </g>
    <TestCard x={340} y={104} />
    {step === 'womb' && <Txt x={425} y={236} size={14} weight={700}>embryo screening</Txt>}
  </Diagram>
}

export function InheritanceVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  const [, group, ...rest] = focus.split('-'), step = rest.join('-')
  if (focus === 'inherit-dna-question') return <DnaScene step="all" numbered assessment={assessment} />
  if (focus === 'inherit-gene-question') return <GeneScene step="all" numbered assessment={assessment} />
  if (focus === 'inherit-genome-data') return <Bars title="People with this version of the gene" bars={[{ label: ['with the disease', '(500 people)'], value: 42, colour: '#e9c2b3' }, { label: ['without the disease', '(500 people)'], value: 12, colour: '#c9dcea' }]} max={100} step={20} unit="%" yLabel="percentage of people" />
  if (focus === 'inherit-repro-table') return <ChromosomeTable />
  if (focus === 'inherit-meiosis-question') return <MeiosisScene step="all" numbered assessment={assessment} />
  if (focus === 'inherit-cross-question') return <PeaQuestion assessment={assessment} />
  if (focus === 'inherit-mice-data') return <Bars title="Babies from crossing two Bb mice" bars={[{ label: ['black fur'], value: 13, colour: '#9a9ca6' }, { label: ['brown fur'], value: 5, colour: '#d9ae8a' }]} max={15} step={5} yLabel="number of babies" />
  if (focus === 'inherit-tree-question') return <TreeScene step="all" numbered assessment={assessment} />
  if (focus === 'inherit-tree-question2') return <TreeQuestion2 />
  if (focus === 'inherit-screen-data') return <Bars title="Should embryo screening be allowed? (200 adults)" bars={[{ label: ['to check for', 'serious disorders'], value: 70, colour: '#c9dcea' }, { label: ['to choose features,', 'such as eye colour'], value: 10, colour: '#e6d3e0' }]} max={100} step={20} unit="%" yLabel="percentage who said yes" />
  if (group === 'dna') return <DnaScene step={step} />
  if (group === 'gene') return <GeneScene step={step} />
  if (group === 'genome') return <GenomeScene step={step} />
  if (group === 'repro') return step === 'asexual' || step === 'clones' ? <AsexualScene step={step} /> : <ReproScene step={step} />
  if (group === 'meiosis') return <MeiosisScene step={step} />
  if (group === 'embryo') return <EmbryoScene step={step} />
  if (group === 'sex') return step === 'pairs' ? <Karyotype /> : step === 'lines' ? <LinesCross left="XX" right="XY" tag={['female', 'male']} labels={['female', 'female', 'male', 'male']} title="A genetic diagram with circles and lines. A female (XX) and a male (XY) are at the top. Their gametes are in the middle: X and X from the female, X and Y from the male. Criss-cross lines show every way they could combine, giving XX, XX, XY and XY at the bottom." /> : <SexScene step={step} />
  if (group === 'allele') return <AlleleScene step={step} />
  if (group === 'cross') return step === 'genotype' || step === 'phenotype' ? <AlleleScene step={step} /> : <CrossScene step={step} />
  if (group === 'cf') return <CfScene step={step} />
  if (group === 'poly') return <PolyScene step={step} />
  if (group === 'tree') return <TreeScene step={step} />
  if (group === 'screen') return <ScreenScene step={step} />
  return <DnaScene step="all" />
}
