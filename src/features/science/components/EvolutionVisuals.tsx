import type { ReactNode } from 'react'
import { Arrow, Bacterium, Badge, Diagram, Label, Mini, Protist, Virus, blob, infectionPalette as C } from './InfectionVisuals'
import { plantPalette as P } from './PlantOrganisationVisuals'

// Chapter B6b (Lessons 46–50): variation, evolution, resistance, breeding, genetic engineering, fossils and classification.
// Original, code-native schematics. Not to scale. Focus ids start with 'evolve-'.
// Colour code for the chapter (kept the same in every lesson): coral = genes, DNA and mutations; green = plants and
// habitats (the environment); magenta = bacteria (as in the infection lessons); grey = antibiotic; sand and stone = rock.
type Pt = [number, number]
const ink = P.ink, muted = '#657a89', faded = .28
const gene = '#c0643f', geneFill = '#f9dfd2'
const leaf = '#a9d49a', leafLine = P.deepGreen, pale = '#ece3a4', paleLine = '#b3a24a'
const night = '#3a4560', soil = P.soil, potFill = '#d99a6c', potLine = '#a86a43'
const antibiotic = '#8a969f'
const skinTones = ['#f1dcc8', '#d9b08c', '#a8784f', '#e8c4a0', '#8a5a3b']
const hairTones = ['#3b2a20', '#c9964a', '#1f1a17', '#8a4b2a', '#2a2320']
const eyeTones = { brown: '#7a4b2a', blue: '#4f86b8', green: '#6f9a55', grey: '#7f98ad' }
// Four pastel colours for the parts of DNA (a simple code picture, not real bases).
const codeColours: Array<[string, string]> = [['#8fb4de', '#e7b76a'], ['#9acb8f', '#dc9ab5']]

function Chip({ x, y, w, text, colour, dim = false }: { x: number; y: number; w: number; text: string; colour: string; dim?: boolean }) {
  return <g opacity={dim ? faded : 1}><rect x={x - w / 2} y={y - 14} width={w} height={24} rx="12" fill="white" stroke={colour} strokeWidth="2" />
    <text x={x} y={y + 3} textAnchor="middle" fill={colour} fontSize="13" fontWeight="700">{text}</text></g>
}
function Caption({ x, y, lines, colour = ink, size = 12, strong = false }: { x: number; y: number; lines: string[]; colour?: string; size?: number; strong?: boolean }) {
  return <text x={x} y={y} textAnchor="middle" fill={colour} fontSize={size} fontWeight={strong ? 700 : 500}>{lines.map((l, i) => <tspan key={l} x={x} dy={i ? size + 3 : 0}>{l}</tspan>)}</text>
}

// ---------- People and eyes ----------
function Human({ x, ground, h, jumper, skin = skinTones[0], hair = hairTones[0], eyes = eyeTones.brown, long = false }: { x: number; ground: number; h: number; jumper: string; skin?: string; hair?: string; eyes?: string; long?: boolean }) {
  const hy = ground - h + 20, top = hy + 24
  return <g>
    <path d={`M${x - 26} ${ground}V${top + 22}Q${x - 26} ${top} ${x - 8} ${top}H${x + 8}Q${x + 26} ${top} ${x + 26} ${top + 22}V${ground}Z`} fill={jumper} stroke={ink} strokeWidth="1.5" />
    {long && <path d={`M${x - 21} ${hy - 4}C${x - 26} ${hy + 18} ${x - 24} ${hy + 30} ${x - 16} ${hy + 34}H${x + 16}C${x + 24} ${hy + 30} ${x + 26} ${hy + 18} ${x + 21} ${hy - 4}Z`} fill={hair} />}
    <circle cx={x} cy={hy} r="19" fill={skin} stroke="#9c7a5e" strokeWidth="1.4" />
    <path d={`M${x - 19} ${hy - 2}C${x - 20} ${hy - 24} ${x + 20} ${hy - 24} ${x + 19} ${hy - 2}C${x + 10} ${hy - 12} ${x - 8} ${hy - 12} ${x - 19} ${hy - 2}Z`} fill={hair} />
    {[-7, 7].map(d => <g key={d}><circle cx={x + d} cy={hy + 2} r="4.4" fill="white" stroke="#9c7a5e" strokeWidth=".8" /><circle cx={x + d} cy={hy + 2} r="3" fill={eyes} /></g>)}
    <path d={`M${x - 5} ${hy + 10}q5 4 10 0`} stroke="#9c7a5e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </g>
}
function Eye({ x, y, iris, k = 1 }: { x: number; y: number; iris: string; k?: number }) {
  return <g><path d={`M${x - 30 * k} ${y}Q${x} ${y - 22 * k} ${x + 30 * k} ${y}Q${x} ${y + 22 * k} ${x - 30 * k} ${y}Z`} fill="white" stroke={ink} strokeWidth="1.6" />
    <circle cx={x} cy={y} r={11 * k} fill={iris} /><circle cx={x} cy={y} r={4.6 * k} fill="#1d252c" /><circle cx={x + 3.5 * k} cy={y - 3.5 * k} r={2 * k} fill="white" /></g>
}

function PeopleScene() {
  const g = 262
  const people = [
    { x: 70, h: 150, jumper: '#a9cbe0', skin: skinTones[0], hair: hairTones[1], eyes: eyeTones.blue, long: true },
    { x: 170, h: 184, jumper: '#c6d9b4', skin: skinTones[2], hair: hairTones[2], eyes: eyeTones.brown },
    { x: 270, h: 138, jumper: '#f2cfa6', skin: skinTones[1], hair: hairTones[3], eyes: eyeTones.green, long: true },
    { x: 370, h: 166, jumper: '#d6c4e6', skin: skinTones[4], hair: hairTones[4], eyes: eyeTones.brown },
    { x: 470, h: 158, jumper: '#f0c1c1', skin: skinTones[3], hair: hairTones[0], eyes: eyeTones.grey },
  ]
  return <Diagram title="Five people of one species, humans, standing in a row. They have different heights, hair colours, skin tones and eye colours: no two are exactly the same.">
    <path d={`M20 ${g}H520`} stroke={muted} strokeWidth="2" />
    {people.map(p => <Human key={p.x} ground={g} {...p} />)}
    <Label x={30} y={40} to={[170, 76]} lines={['different heights']} />
    <Label x={300} y={40} to={[277, 146]} lines={['different eye colours']} />
    <Caption x={270} y={288} lines={['one species: humans, but no two exactly the same']} size={13} strong />
  </Diagram>
}

// ---------- Genes / environment / both: three panels ----------
const PANELS = [{ x: 6, w: 172 }, { x: 184, w: 172 }, { x: 362, w: 172 }]
function Pot({ x, ground }: { x: number; ground: number }) {
  return <path d={`M${x - 22} ${ground - 30}H${x + 22}L${x + 17} ${ground}H${x - 17}Z`} fill={potFill} stroke={potLine} strokeWidth="1.6" />
}
function Mint({ x, ground, dark = false }: { x: number; ground: number; dark?: boolean }) {
  const base = ground - 30
  if (dark) return <g><path d={`M${x} ${base}C${x - 2} ${base - 60} ${x + 3} ${base - 110} ${x} ${base - 150}`} stroke={paleLine} strokeWidth="2.4" fill="none" />
    {[50, 95, 138].map((d, i) => <path key={d} d={`M${x} ${base - d}q${i % 2 ? 14 : -14} -4 ${i % 2 ? 18 : -18} -12q${i % 2 ? -10 : 10} 0 ${i % 2 ? -18 : 18} 12z`} fill={pale} stroke={paleLine} strokeWidth="1.3" />)}</g>
  return <g><path d={`M${x} ${base}V${base - 62}`} stroke={leafLine} strokeWidth="3" />
    {[[-1, 14], [1, 22], [-1, 32], [1, 42], [-1, 50], [1, 58]].map(([s, d], i) => <path key={i} d={blob(x + s * 13, base - d, 13, 8, 60 + i, .1)} fill={leaf} stroke={leafLine} strokeWidth="1.4" transform={`rotate(${s * -18} ${x + s * 13} ${base - d})`} />)}
    <path d={blob(x, base - 66, 10, 8, 71, .1)} fill={leaf} stroke={leafLine} strokeWidth="1.4" /></g>
}
function SunIcon({ x, y, r = 12 }: { x: number; y: number; r?: number }) {
  return <g><circle cx={x} cy={y} r={r} fill="#f6d25e" stroke="#c9951c" strokeWidth="1.5" />{Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return <path key={i} d={`M${x + Math.cos(a) * (r + 4)} ${y + Math.sin(a) * (r + 4)}L${x + Math.cos(a) * (r + 10)} ${y + Math.sin(a) * (r + 10)}`} stroke="#c9951c" strokeWidth="2" strokeLinecap="round" /> })}</g>
}
function Flower({ x, ground, top }: { x: number; ground: number; top: number }) {
  return <g><path d={`M${x} ${ground}V${top + 12}`} stroke={leafLine} strokeWidth="4" strokeLinecap="round" />
    {[.35, .62].map((f, i) => { const y = ground - (ground - top) * f; return <path key={f} d={`M${x} ${y}q${i ? 16 : -16} -2 ${i ? 22 : -22} -12q${i ? -14 : 14} 0 ${i ? -22 : 22} 12z`} fill={leaf} stroke={leafLine} strokeWidth="1.3" /> })}
    {Array.from({ length: 10 }, (_, i) => { const a = i * 36 * Math.PI / 180; return <circle key={i} cx={x + Math.cos(a) * 11} cy={top + Math.sin(a) * 11} r="6" fill="#f2c230" stroke="#c9951c" strokeWidth="1" /> })}
    <circle cx={x} cy={top} r="8" fill="#7a5a36" /></g>
}
function Drops({ x, y, n }: { x: number; y: number; n: number }) {
  return <g>{Array.from({ length: n }, (_, i) => <path key={i} d={`M${x + i * 11} ${y - 7}q5 7 0 10q-5 -3 0 -10z`} fill="#bfe1f0" stroke={P.water} strokeWidth="1.3" />)}</g>
}
type PanelKind = 'genes' | 'env' | 'both'
function Panel({ kind, x, w, dim, head, caption, hideAnswer = false }: { kind: PanelKind; x: number; w: number; dim: boolean; head?: ReactNode; caption: string[]; hideAnswer?: boolean }) {
  const cx = x + w / 2, ground = 250
  return <g opacity={dim ? faded : 1}>
    <rect x={x} y={4} width={w} height={292} rx="12" fill="#fbfdfc" stroke="#d6e3e9" strokeWidth="1.4" />
    {head}
    {kind === 'genes' && <g>{[eyeTones.brown, eyeTones.blue, eyeTones.green].map((c, i) => <Eye key={c} x={cx} y={84 + i * 56} iris={c} />)}</g>}
    {kind === 'env' && <g>
      <rect x={cx + 4} y={48} width={w / 2 - 12} height={ground - 40} rx="8" fill={night} />
      <SunIcon x={cx - 42} y={78} />
      <Pot x={cx - 42} ground={ground} /><Mint x={cx - 42} ground={ground} />
      <Pot x={cx + 42} ground={ground} /><Mint x={cx + 42} ground={ground} dark />
      <text x={cx - 42} y={ground + 17} textAnchor="middle" fill={ink} fontSize="12">light</text>
      <text x={cx + 42} y={ground + 17} textAnchor="middle" fill={ink} fontSize="12">dark</text>
    </g>}
    {kind === 'both' && <g>
      <path d={`M${x} ${ground}H${x + w}V${ground + 14}H${x}Z`} fill={soil} />
      {!hideAnswer && <><path d={`M${x + 10} 76H${x + w - 10}`} stroke={gene} strokeWidth="2" strokeDasharray="6 5" />
        <text x={cx} y={66} textAnchor="middle" fill={gene} fontSize="12" fontWeight="700">greatest height (genes)</text></>}
      <Flower x={cx - 40} ground={ground} top={86} /><Flower x={cx + 40} ground={ground} top={168} />
      <Drops x={cx - 56} y={ground - 20} n={3} /><Drops x={cx + 34} y={ground - 20} n={1} />
      <text x={cx - 40} y={ground + 30} textAnchor="middle" fill={P.blue} fontSize="12">lots of water</text>
      <text x={cx + 40} y={ground + 30} textAnchor="middle" fill={P.blue} fontSize="12">little water</text>
    </g>}
    <Caption x={cx} y={kind === 'env' ? 286 : kind === 'both' ? 296 : 262} lines={caption} />
  </g>
}
const chipText: Record<PanelKind, [string, string]> = { genes: ['genes', gene], env: ['environment', leafLine], both: ['genes + environment', ink] }
function PanelsScene({ focus }: { focus: string }) {
  const step = focus.replace('evolve-var-', '')
  const lit = (k: PanelKind) => step === 'all' || step === k
  const kinds: PanelKind[] = ['genes', 'env', 'both']
  const captions: Record<PanelKind, string[]> = { genes: ['eye colour:', 'set by genes alone'], env: ['same genes'], both: [] }
  return <Diagram title="Three panels. Genes: three eyes, brown, blue and green; eye colour is set by genes alone. Environment: two mint plants with the same genes; the one in light is bushy and green, the one in the dark is tall, thin and pale. Genes and environment: two sunflowers; a dashed line shows the greatest height their genes allow; the one with lots of water reaches it, the one with little water is shorter.">
    {kinds.map((k, i) => <Panel key={k} kind={k} {...PANELS[i]} dim={!lit(k)} caption={captions[k]}
      head={<Chip x={PANELS[i].x + PANELS[i].w / 2} y={26} w={k === 'both' ? 164 : 116} text={chipText[k][0]} colour={chipText[k][1]} />} />)}
  </Diagram>
}
function VariationQuestion({ assessment }: { assessment: boolean }) {
  const order: PanelKind[] = ['env', 'both', 'genes']
  const captions: Record<PanelKind, string[]> = { env: ['pieces of one plant'], both: [], genes: ['eye colour'] }
  return <Diagram title={assessment ? 'Three numbered examples of variation. 1: two plants grown from pieces of one plant, one in light and one in the dark. 2: the heights of two sunflowers, one given lots of water and one given little water. 3: eye colour, brown, blue or green.' : 'Three numbered examples. 1: two plants from pieces of one plant, in light and in the dark: environmental variation. 2: the heights of two sunflowers: genes set the greatest height, and water decides how tall each grows, so both. 3: eye colour: genes alone.'}>
    {order.map((k, i) => <Panel key={k} kind={k} {...PANELS[i]} dim={false} caption={captions[k]} hideAnswer={assessment}
      head={<g><Badge n={i + 1} x={PANELS[i].x + 22} y={26} />{!assessment && <text x={PANELS[i].x + 42} y={31} fill={chipText[k][1]} fontSize="13" fontWeight="700">{chipText[k][0]}</text>}</g>} />)}
  </Diagram>
}

// ---------- DNA code and mutation ----------
const CODE = [0, 1, 1, 0, 1, 0, 0, 1, 0, 1] as const
const FLIP = [0, 1, 0, 0, 1, 1, 0, 1, 1, 0] as const
function Ladder({ x, y, w, mutateAt, k = 1, ring = true }: { x: number; y: number; w: number; mutateAt?: number; k?: number; ring?: boolean }) {
  const n = CODE.length, step = w / n, gap = 44 * k
  return <g>
    <path d={`M${x - 6} ${y - gap / 2}H${x + w + 6}M${x - 6} ${y + gap / 2}H${x + w + 6}`} stroke={ink} strokeWidth={3 * k} strokeLinecap="round" />
    {CODE.map((c, i) => {
      const type = i === mutateAt ? 1 - c : c, flip = i === mutateAt ? 1 - FLIP[i] : FLIP[i]
      const [a, b] = codeColours[type], top = flip ? b : a, bottom = flip ? a : b, cx = x + step * (i + .5)
      return <g key={i}><rect x={cx - step * .32} y={y - gap / 2} width={step * .64} height={gap / 2} fill={top} stroke={ink} strokeWidth={1.1} /><rect x={cx - step * .32} y={y} width={step * .64} height={gap / 2} fill={bottom} stroke={ink} strokeWidth={1.1} /></g>
    })}
    {mutateAt !== undefined && ring && <ellipse cx={x + step * (mutateAt + .5)} cy={y} rx={step * .62} ry={gap * .78} fill="none" stroke={gene} strokeWidth="2.6" strokeDasharray="6 4" />}
  </g>
}
function Helix({ y, from, to, lit }: { y: number; from: number; to: number; lit: [number, number] }) {
  const pts = (phase: number) => Array.from({ length: 97 }, (_, i) => { const x = from + (to - from) * i / 96; return `${i ? 'L' : 'M'}${x.toFixed(1)} ${(y + Math.sin((x - from) / 16 + phase) * 14).toFixed(1)}` }).join('')
  return <g>
    {Array.from({ length: 30 }, (_, i) => { const x = from + 8 + i * (to - from - 16) / 29, a = Math.sin((x - from) / 16) * 14; const inGene = x >= lit[0] && x <= lit[1]
      return <path key={i} d={`M${x} ${y + a}L${x} ${y - a}`} stroke={inGene ? gene : '#c7d3dc'} strokeWidth="2.4" /> })}
    <path d={pts(0)} stroke={ink} strokeWidth="2.6" fill="none" /><path d={pts(Math.PI)} stroke={ink} strokeWidth="2.6" fill="none" />
  </g>
}
function MutationScene({ focus }: { focus: string }) {
  const step = focus.replace('evolve-mut-', '')
  const G: [number, number] = [214, 326]
  return <Diagram title={step === 'code' ? 'A long DNA molecule, with one short section marked as a gene. Enlarged below, the gene is a row of coloured parts in a set order: the code.' : step === 'change' ? 'The enlarged gene again. One part in the row has changed by chance and is circled: a mutation.' : 'Two rows: the original gene, and below it the new form, a genetic variant, with the one changed part circled.'}>
    <Helix y={40} from={30} to={510} lit={G} />
    <path d={`M${G[0]} 64V72H${G[1]}V64`} stroke={gene} strokeWidth="2" fill="none" />
    <text x={(G[0] + G[1]) / 2} y={88} textAnchor="middle" fill={gene} fontSize="13" fontWeight="700">a gene</text>
    <text x={30} y={88} fill={muted} fontSize="12">DNA</text>
    <path d={`M${G[0]} 94L90 ${step === 'variant' ? 118 : 146}M${G[1]} 94L450 ${step === 'variant' ? 118 : 146}`} stroke={muted} strokeWidth="1.2" strokeDasharray="3 3" />
    {step !== 'variant' && <g>
      <Ladder x={90} y={196} w={360} mutateAt={step === 'change' ? 6 : undefined} />
      {step === 'code' && <Caption x={270} y={262} lines={['the parts are in a set order: a code']} size={13} />}
      {step === 'change' && <><Label x={470} y={276} anchor="end" to={[324, 234]} lines={['mutation: a random change']} strong colour={gene} /></>}
    </g>}
    {step === 'variant' && <g>
      <text x={90} y={134} fill={ink} fontSize="12" fontWeight="700">original gene</text>
      <Ladder x={90} y={168} w={360} k={.72} />
      <text x={90} y={222} fill={gene} fontSize="12" fontWeight="700">genetic variant: a new form of the gene</text>
      <Ladder x={90} y={256} w={360} mutateAt={6} k={.72} />
    </g>}
  </Diagram>
}
function Lungs({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x} ${y - 26}V${y - 6}M${x} ${y - 6}l-8 8M${x} ${y - 6}l8 8`} stroke="#b76568" strokeWidth="3" strokeLinecap="round" fill="none" />
    {[-1, 1].map(s => <path key={s} d={`M${x + s * 6} ${y - 10}C${x + s * 30} ${y - 22} ${x + s * 34} ${y + 14} ${x + s * 26} ${y + 24}C${x + s * 16} ${y + 28} ${x + s * 8} ${y + 20} ${x + s * 6} ${y - 10}Z`} fill="#f1c2b8" stroke="#b76568" strokeWidth="1.6" />)}
    {[[-17, 4], [-13, 14], [16, 2], [19, 13], [12, 18]].map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r="3" fill="#d6c46a" stroke="#a8963b" strokeWidth="1" />)}</g>
}
function OutcomeScene({ focus }: { focus: string }) {
  const step = focus.replace('evolve-mut-', '')
  const rows = [{ y: 56, key: 'none', how: 'most', w: 9 }, { y: 134, key: 'small', how: 'some', w: 4.5 }, { y: 204, key: 'big', how: 'very rarely', w: 2.2 }]
  const lit = (k: string) => step === k || (step === 'useful' && k === 'big')
  return <Diagram title="A genetic variant on the left, with three arrows to what it can do. A thick arrow, most: little or no effect; two identical eyes. A thinner arrow, some: a small effect; eye colour a little different. A very thin arrow, very rarely: a new phenotype, such as cystic fibrosis, shown by lungs with sticky mucus. If a new phenotype suits a changed environment, it can spread by natural selection.">
    <text x={20} y={120} fill={gene} fontSize="12" fontWeight="700">a genetic variant</text>
    <Ladder x={24} y={150} w={120} mutateAt={6} k={.5} ring={false} />
    {rows.map(r => <g key={r.key} opacity={lit(r.key) ? 1 : faded}>
      <Arrow x1={152} y1={150} x2={214} y2={r.y} colour={gene} width={r.w} />
      <text x={230} y={r.y - 24} fill={gene} fontSize="12" fontWeight="700">{r.how}</text>
      {r.key === 'none' && <g><Eye x={252} y={r.y + 6} iris={eyeTones.brown} k={.8} /><text x={292} y={r.y + 11} textAnchor="middle" fill={ink} fontSize="16" fontWeight="700">=</text><Eye x={332} y={r.y + 6} iris={eyeTones.brown} k={.8} />
        <text x={374} y={r.y + 11} fill={ink} fontSize="13" fontWeight="700">little or no effect</text></g>}
      {r.key === 'small' && <g><Eye x={252} y={r.y + 6} iris={eyeTones.blue} k={.8} /><text x={292} y={r.y + 11} textAnchor="middle" fill={ink} fontSize="16" fontWeight="700">≈</text><Eye x={332} y={r.y + 6} iris={eyeTones.grey} k={.8} />
        <text x={374} y={r.y + 3} fill={ink} fontSize="13" fontWeight="700">a small effect:</text><text x={374} y={r.y + 20} fill={ink} fontSize="12">eye colour a bit different</text></g>}
      {r.key === 'big' && <g><g opacity={step === 'useful' ? faded : 1}><Lungs x={262} y={r.y + 6} /><text x={306} y={r.y + 20} fill={ink} fontSize="12">e.g. cystic fibrosis</text></g><text x={306} y={r.y + 3} fill={ink} fontSize="13" fontWeight="700">a new phenotype</text></g>}
    </g>)}
    {step === 'useful' && <g>
      <rect x={226} y={248} width={300} height={48} rx="10" fill="#eef7ee" stroke={leafLine} strokeWidth="1.6" />
      <text x={240} y={268} fill={leafLine} fontSize="13" fontWeight="700">if it suits a changed environment,</text>
      <text x={240} y={286} fill={leafLine} fontSize="13" fontWeight="700">it can spread: natural selection</text>
    </g>}
  </Diagram>
}
function VariationData() {
  const Y = (v: number) => 250 - v * 2
  const bars: Array<[string, number]> = [['field A', 92], ['field B', 71]]
  return <Diagram title="Bar chart of the mean height of wheat plants in two fields. Field A: 92 centimetres. Field B: 71 centimetres.">
    <text x={20} y={24} fill={ink} fontSize="14" fontWeight="600">Mean height of wheat plants</text>
    <path d={`M90 ${Y(0)}H470M90 ${Y(0)}V${Y(100) - 8}`} stroke={ink} strokeWidth="2" />
    {[0, 20, 40, 60, 80, 100].map(v => <g key={v}><path d={`M84 ${Y(v)}h6`} stroke={ink} /><text x={80} y={Y(v) + 4} textAnchor="end" fontSize="12" fill={ink}>{v}</text><path d={`M90 ${Y(v)}H470`} stroke="#e3ebf0" strokeWidth={v ? 1 : 0} /></g>)}
    <text x={24} y={150} fill={ink} fontSize="12" transform="rotate(-90 24 150)" textAnchor="middle">mean height (cm)</text>
    {bars.map(([name, v], i) => { const x = 160 + i * 170; return <g key={name}><rect x={x} y={Y(v)} width={90} height={Y(0) - Y(v)} fill={leaf} stroke={leafLine} strokeWidth="1.6" />
      <text x={x + 45} y={Y(v) - 8} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">{v}</text><text x={x + 45} y={Y(0) + 20} textAnchor="middle" fill={ink} fontSize="13">{name}</text></g> })}
    <text x={280} y={292} textAnchor="middle" fill={ink} fontSize="12">field</text>
  </Diagram>
}

// ---------- Lesson 47: beetles, natural selection, evidence, speciation, extinction ----------
type BeetleColour = 'green' | 'brown' | 'sand' | 'ghost'
const beetleCol: Record<BeetleColour, [string, string]> = { green: ['#74b35e', '#3f7a35'], brown: ['#9a6b3f', '#5f3f22'], sand: ['#dcc38e', '#9c8450'], ghost: ['white', '#9aa9b4'] }
function Beetle({ x, y, c = 'green', s = 1, a = 0, crossed = false, long = false }: { x: number; y: number; c?: BeetleColour; s?: number; a?: number; crossed?: boolean; long?: boolean }) {
  const [fill, line] = beetleCol[c], L = long ? 1.5 : 1
  return <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
    {[-6, 0, 6].map(dy => [-1, 1].map(side => <path key={`${dy}${side}`} d={`M${side * 7} ${dy}l${side * 7 * L} ${dy / 2 - 2}l${side * 2} ${4 * L}`} stroke={line} strokeWidth="1.6" fill="none" />))}
    <circle cx={0} cy={-13} r={5} fill={line} />
    <ellipse cx={0} cy={1} rx={8.5} ry={12} fill={fill} stroke={line} strokeWidth="1.6" strokeDasharray={c === 'ghost' ? '3 2' : undefined} />
    <path d="M0 -10V13" stroke={line} strokeWidth="1.2" />
    {crossed && <path d="M-11 -12L11 12M11 -12L-11 12" stroke="#c8505a" strokeWidth="2.6" strokeLinecap="round" />}
  </g>
}
function LeafShape({ cx, cy, rx = 74, ry = 104, fill = '#cfe8bd' }: { cx: number; cy: number; rx?: number; ry?: number; fill?: string }) {
  return <g><path d={`M${cx} ${cy - ry}C${cx + rx * 1.25} ${cy - ry * .45} ${cx + rx * .9} ${cy + ry * .7} ${cx} ${cy + ry}C${cx - rx * .9} ${cy + ry * .7} ${cx - rx * 1.25} ${cy - ry * .45} ${cx} ${cy - ry}Z`} fill={fill} stroke={leafLine} strokeWidth="2" />
    <path d={`M${cx} ${cy - ry + 10}V${cy + ry - 6}`} stroke={leafLine} strokeWidth="1.6" opacity=".6" />
    {[-.4, 0, .4].map(f => [-1, 1].map(side => <path key={`${f}${side}`} d={`M${cx} ${cy + f * ry}q${side * rx * .35} ${-ry * .12} ${side * rx * .6} ${-ry * .3}`} stroke={leafLine} strokeWidth="1.2" fill="none" opacity=".45" />))}</g>
}
function Bird({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-22 4C-10 -10 12 -10 20 0C12 10 -8 14 -22 4Z" fill="#8aa0b4" stroke="#4d6478" strokeWidth="1.6" />
    <circle cx={18} cy={-4} r={8} fill="#8aa0b4" stroke="#4d6478" strokeWidth="1.6" /><circle cx={20} cy={-6} r={1.8} fill="#1d252c" />
    <path d="M25 -4L35 0L25 1Z" fill="#e2a93b" stroke="#b07a1c" strokeWidth="1" />
    <path d="M-6 0C-10 -18 -2 -26 8 -28C4 -16 4 -8 2 0Z" fill="#b6c6d4" stroke="#4d6478" strokeWidth="1.4" />
    <path d="M-22 4L-32 -2L-30 8Z" fill="#8aa0b4" stroke="#4d6478" strokeWidth="1.4" />
  </g>
}
const SPOTS: Pt[] = [[-32, -52], [20, -62], [-8, -18], [34, -12], [-36, 26], [14, 30], [-12, 66], [26, 70]]
const GENS: Array<{ cx: number; cols: BeetleColour[]; name: string }> = [
  { cx: 92, cols: ['green', 'brown', 'brown', 'green', 'green', 'brown', 'green', 'brown'], name: 'generation 1' },
  { cx: 270, cols: ['green', 'green', 'brown', 'green', 'green', 'green', 'brown', 'green'], name: 'next generation' },
  { cx: 448, cols: ['green', 'green', 'green', 'green', 'green', 'green', 'brown', 'green'], name: 'generations later' },
]
function SelectionScene({ focus }: { focus: string }) {
  const step = focus.replace('evolve-ns-', '')
  const lit = (i: number) => step === 'evolve' || (i === 0 && ['vary', 'survive', 'breed'].includes(step)) || (i === 1 && ['breed', 'select'].includes(step)) || (i === 2 && step === 'select')
  const eaten = step !== 'vary'
  const caption: Record<string, string> = { vary: 'colour varies because of genes', survive: 'brown beetles are easy to spot, so more are eaten', breed: 'survivors breed: genes for green are passed on', select: 'natural selection: green becomes common', evolve: 'evolution: the population has changed' }
  return <Diagram title="Three leaves in a row show one beetle population over time. Generation 1: four green and four brown beetles; a bird spots and eats three of the brown ones. Next generation: six green, two brown. Many generations later: seven green, one brown. Arrows between leaves say survivors breed.">
    {GENS.map((g, i) => <g key={g.name} opacity={lit(i) ? 1 : faded}>
      <LeafShape cx={g.cx} cy={146} />
      {g.cols.map((c, j) => <Beetle key={j} x={g.cx + SPOTS[j][0]} y={146 + SPOTS[j][1]} c={c} a={(j * 47) % 60 - 30} crossed={i === 0 && eaten && c === 'brown' && j !== 7} />)}
      <text x={g.cx} y={272} textAnchor="middle" fill={ink} fontSize="12" fontWeight="700">{g.name}</text>
    </g>)}
    {[0, 1].map(i => <g key={i} opacity={(i === 0 ? ['breed', 'evolve'] : ['select', 'evolve']).includes(step) ? 1 : faded}>
      <Arrow x1={GENS[i].cx + 70} y1={146} x2={GENS[i + 1].cx - 66} y2={146} colour={gene} width={3} />
      <text x={(GENS[i].cx + GENS[i + 1].cx) / 2} y={124} textAnchor="middle" fill={gene} fontSize="12" fontWeight="700">breed</text>
    </g>)}
    {['survive', 'breed', 'evolve'].includes(step) && <g opacity={step === 'survive' ? 1 : faded}><Bird x={156} y={34} s={.9} /></g>}
    <Caption x={270} y={294} lines={[caption[step] || caption.vary]} size={13} strong colour={step === 'select' || step === 'evolve' ? leafLine : ink} />
  </Diagram>
}
function SelectionData() {
  const data: Pt[] = [[0, 50], [5, 55], [10, 61], [15, 68], [20, 74], [25, 80], [30, 85]]
  const X = (g: number) => 90 + g * 13, Y = (v: number) => 250 - v * 2
  return <Diagram title="Line graph of the percentage of green beetles in a population over 30 generations. It rises steadily: 50% at generation 0, 61% at 10, 74% at 20 and 85% at 30.">
    <text x={20} y={24} fill={ink} fontSize="14" fontWeight="600">Green beetles in the population</text>
    {[0, 20, 40, 60, 80, 100].map(v => <g key={v}><path d={`M90 ${Y(v)}H${X(30) + 10}`} stroke="#e3ebf0" strokeWidth={v ? 1 : 0} /><path d={`M84 ${Y(v)}h6`} stroke={ink} /><text x={80} y={Y(v) + 4} textAnchor="end" fontSize="12" fill={ink}>{v}</text></g>)}
    <path d={`M90 ${Y(0)}H${X(30) + 10}M90 ${Y(0)}V${Y(100) - 8}`} stroke={ink} strokeWidth="2" />
    {[0, 5, 10, 15, 20, 25, 30].map(g => <g key={g}><path d={`M${X(g)} ${Y(0)}v6`} stroke={ink} /><text x={X(g)} y={Y(0) + 20} textAnchor="middle" fontSize="12" fill={ink}>{g}</text></g>)}
    <text x={24} y={150} fill={ink} fontSize="12" transform="rotate(-90 24 150)" textAnchor="middle">green beetles (%)</text>
    <text x={X(15)} y={292} textAnchor="middle" fill={ink} fontSize="12">generation</text>
    <path d={data.map(([g, v], i) => `${i ? 'L' : 'M'}${X(g)} ${Y(v)}`).join('')} stroke={leafLine} strokeWidth="3" fill="none" />
    {data.map(([g, v]) => <circle key={g} cx={X(g)} cy={Y(v)} r="4" fill={leafLine} />)}
  </Diagram>
}
function RockLayers({ x, y, w = 110, h = 80 }: { x: number; y: number; w?: number; h?: number }) {
  const cols = ['#efe3cf', '#e2cfae', '#d6bf98', '#c9ae86']
  return <g>{cols.map((c, i) => <rect key={c} x={x} y={y + i * h / 4} width={w} height={h / 4} fill={c} stroke="#a88d63" strokeWidth="1.2" />)}
    <Ammonite x={x + w * .3} y={y + h * .88} r={8} /><Ammonite x={x + w * .72} y={y + h * .62} r={7} /><path d={`M${x + w * .2} ${y + h * .38}q10 -8 20 0q10 8 20 0`} stroke="#7d6443" strokeWidth="2" fill="none" /></g>
}
function Ammonite({ x, y, r }: { x: number; y: number; r: number }) {
  const d = Array.from({ length: 40 }, (_, i) => { const a = i / 39 * Math.PI * 4, rr = r * (1 - i / 44); return `${i ? 'L' : 'M'}${(x + Math.cos(a) * rr).toFixed(1)} ${(y + Math.sin(a) * rr).toFixed(1)}` }).join('')
  return <g><circle cx={x} cy={y} r={r} fill="#b89a6c" stroke="#6f5636" strokeWidth="1.2" /><path d={d} stroke="#6f5636" strokeWidth="1.1" fill="none" /></g>
}
function Dish({ x, y, r = 40, resistant = true }: { x: number; y: number; r?: number; resistant?: boolean }) {
  return <g><circle cx={x} cy={y} r={r} fill="#fbf1f5" stroke={ink} strokeWidth="1.8" />
    {[[-18, -14, 20], [14, -18, -30], [-16, 16, 60], [18, 12, 10]].map(([dx, dy, a], i) => <Bacterium key={i} cx={x + dx} cy={y + dy} length={22} thick={10} angle={a} seed={i + 3} />)}
    {[[0, -28], [-28, 0], [26, -2], [0, 28], [2, 0]].map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r="2.6" fill={antibiotic} />)}
    {resistant && <circle cx={x + 14} cy={y - 18} r="14" fill="none" stroke={C.bugDeep} strokeWidth="2" strokeDasharray="4 3" />}</g>
}
function EvidenceScene({ focus }: { focus: string }) {
  const step = focus.replace('evolve-evid-', '')
  const on = (k: string) => step === k
  const items = [{ k: 'genes', x: 110, name: ['genes'] }, { k: 'fossils', x: 270, name: ['the fossil record'] }, { k: 'bacteria', x: 430, name: ['bacteria evolving', 'resistance'] }]
  return <Diagram title="A timeline from simple life forms more than three billion years ago to today's species. Below it, three kinds of evidence that support evolution by natural selection: genes, the fossil record, and bacteria evolving resistance to antibiotics.">
    <g opacity={on('theory') || on('darwin') ? 1 : .55}>
      <Arrow x1={40} y1={56} x2={500} y2={56} colour={ink} width={3} />
      <text x={40} y={38} fill={ink} fontSize="12" fontWeight="700">over 3 billion years ago</text><text x={500} y={38} textAnchor="end" fill={ink} fontSize="12" fontWeight="700">today</text>
      {[[52, 82], [66, 90], [58, 100], [74, 78]].map(([cx, cy], i) => <path key={i} d={blob(cx, cy, 7, 6, 200 + i, .12)} fill="#e7f2f6" stroke="#5f8aa3" strokeWidth="1.4" />)}
      <text x={40} y={124} fill={ink} fontSize="12">simple life forms</text>
      <Beetle x={430} y={92} s={.8} /><path d={`M452 104C448 86 462 76 470 72C474 84 468 98 452 104Z`} fill={leaf} stroke={leafLine} strokeWidth="1.4" />
      <path d="M476 90q14 -12 28 0q-14 12 -28 0zM476 90l-8 -6v12z" fill="#9cc3de" stroke="#4f86b8" strokeWidth="1.4" />
      <text x={500} y={124} textAnchor="end" fill={ink} fontSize="12">today’s species</text>
      <path d="M100 86C200 70 330 70 410 86" stroke={gene} strokeWidth="2" fill="none" strokeDasharray="5 5" /><text x={255} y={96} textAnchor="middle" fill={gene} fontSize="12" fontWeight="700">evolution</text>
    </g>
    {on('darwin') && <g><rect x={150} y={132} width={240} height={46} rx="12" fill="white" stroke={gene} strokeWidth="2" />
      <text x={270} y={151} textAnchor="middle" fill={gene} fontSize="13" fontWeight="700">? how do new characteristics</text><text x={270} y={169} textAnchor="middle" fill={gene} fontSize="13" fontWeight="700">appear and pass on ?</text></g>}
    {items.map(it => <g key={it.k} opacity={on(it.k) || (step === 'bacteria' && false) ? 1 : faded}>
      {it.k === 'genes' && <g><Helix y={226} from={60} to={160} lit={[60, 160]} /></g>}
      {it.k === 'fossils' && <RockLayers x={215} y={190} />}
      {it.k === 'bacteria' && <Dish x={430} y={228} r={38} />}
      <Caption x={it.x} y={it.k === 'bacteria' ? 282 : 286} lines={it.name} strong={on(it.k)} />
    </g>)}
    {step === 'bacteria' && <text x={270} y={164} textAnchor="middle" fill={leafLine} fontSize="13" fontWeight="700">✓ evidence supports it: now widely accepted</text>}
  </Diagram>
}
function Region({ x, y, w, h, kind }: { x: number; y: number; w: number; h: number; kind: 'forest' | 'desert' }) {
  return <g><rect x={x} y={y} width={w} height={h} rx="14" fill={kind === 'forest' ? '#dcefd0' : '#f4e7c6'} stroke={kind === 'forest' ? leafLine : '#b59a5e'} strokeWidth="1.8" />
    {kind === 'forest' ? [[x + 18, y + h - 10], [x + w - 20, y + h - 14]].map(([tx, ty], i) => <g key={i}><path d={`M${tx} ${ty}V${ty - 24}`} stroke="#7d5a3a" strokeWidth="4" /><circle cx={tx} cy={ty - 34} r={16} fill={leaf} stroke={leafLine} strokeWidth="1.5" /></g>)
      : [[x + 22, y + h - 10], [x + w - 22, y + h - 10]].map(([tx, ty], i) => <path key={i} d={`M${tx} ${ty}V${ty - 34}M${tx} ${ty - 16}h-8v-10M${tx} ${ty - 22}h8v-8`} stroke="#6f9a55" strokeWidth="5" strokeLinecap="round" fill="none" />)}
    <text x={x + w / 2} y={y + 18} textAnchor="middle" fill={kind === 'forest' ? leafLine : '#8a6f3a'} fontSize="12" fontWeight="700">{kind === 'forest' ? 'green forest' : 'sandy desert'}</text></g>
}
function SpeciationScene({ focus }: { focus: string }) {
  const step = focus.replace('evolve-spec-', '')
  return <Diagram title="One beetle species on the left, with mixed colours. Arrows lead to two populations after a long time: in a green forest the beetles are green, and in a sandy desert they are pale with long legs. The two populations can no longer breed to produce fertile offspring, so they are two new species.">
    <circle cx={70} cy={150} r={52} fill="#eef3ea" stroke={muted} strokeWidth="1.6" />
    {([[52, 132, 'green'], [86, 128, 'brown'], [58, 170, 'brown'], [90, 166, 'green']] as Array<[number, number, BeetleColour]>).map(([x, y, c], i) => <Beetle key={i} x={x} y={y} c={c} s={.9} a={i * 25 - 20} />)}
    <text x={70} y={222} textAnchor="middle" fill={ink} fontSize="12" fontWeight="700">one species</text>
    <Arrow x1={124} y1={132} x2={210} y2={86} colour={gene} width={3} /><Arrow x1={124} y1={168} x2={210} y2={214} colour={gene} width={3} />
    <text x={150} y={150} fill={gene} fontSize="12" fontWeight="700">a long time</text>
    <Region x={216} y={28} w={186} h={112} kind="forest" /><Region x={216} y={160} w={186} h={112} kind="desert" />
    {[[282, 92], [318, 76], [346, 104]].map(([x, y], i) => <Beetle key={i} x={x} y={y} c="green" a={i * 30 - 20} />)}
    {[[282, 226], [318, 208], [348, 236]].map(([x, y], i) => <Beetle key={i} x={x} y={y} c="sand" long a={i * 30 - 20} />)}
    <g opacity={step === 'split' ? faded : 1}>
      <path d="M309 140V160" stroke="#c8505a" strokeWidth="2.5" strokeDasharray="4 3" />
      <path d="M301 142l16 16M317 142l-16 16" stroke="#c8505a" strokeWidth="3" strokeLinecap="round" />
      <text x={410} y={146} fill="#c8505a" fontSize="12" fontWeight="700">cannot produce</text><text x={410} y={161} fill="#c8505a" fontSize="12" fontWeight="700">fertile offspring</text>
    </g>
    <g opacity={step === 'new' ? 1 : faded}>
      <text x={470} y={88} textAnchor="middle" fill={leafLine} fontSize="13" fontWeight="700">species A</text>
      <text x={470} y={220} textAnchor="middle" fill="#8a6f3a" fontSize="13" fontWeight="700">species B</text>
      {step === 'new' && <text x={470} y={290} textAnchor="middle" fill={gene} fontSize="13" fontWeight="700">speciation</text>}
    </g>
  </Diagram>
}
function Volcano({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 16} ${y - 34}c-10 -8 -2 -22 10 -18c2 -12 20 -12 22 0c12 -4 18 10 8 18z`} fill="#c9cfd4" stroke="#8a949b" strokeWidth="1.4" />
    <path d={`M${x - 38} ${y + 22}L${x - 10} ${y - 20}H${x + 10}L${x + 38} ${y + 22}Z`} fill="#9b7657" stroke="#6b4a33" strokeWidth="1.6" />
    <path d={`M${x - 10} ${y - 20}H${x + 10}L${x + 6} ${y - 6}l-4 6l-4 -8l-4 10z`} fill="#e0643b" stroke="#b4442a" strokeWidth="1.2" /></g>
}
function Stumps({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 40} ${y + 22}H${x + 40}`} stroke="#a88d63" strokeWidth="2" />
    {[[-24, 14], [2, 20], [26, 12]].map(([dx, h], i) => <g key={i}><rect x={x + dx - 8} y={y + 22 - h} width={16} height={h} fill="#b88a5c" stroke="#7d5a3a" strokeWidth="1.5" /><ellipse cx={x + dx} cy={y + 22 - h} rx={8} ry={3} fill="#e8cfa4" stroke="#7d5a3a" strokeWidth="1.2" /></g>)}
    <path d={`M${x - 30} ${y - 6}l36 -14l4 8l-36 14z`} fill="#b88a5c" stroke="#7d5a3a" strokeWidth="1.4" /></g>
}
function Fox({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 24} ${y - 22}L${x - 14} ${y - 2}L${x - 22} ${y - 2}Z M${x + 24} ${y - 22}L${x + 14} ${y - 2}L${x + 22} ${y - 2}Z`} fill="#d9803e" stroke="#9a5424" strokeWidth="1.4" />
    <path d={`M${x - 24} ${y - 6}Q${x} ${y - 20} ${x + 24} ${y - 6}L${x + 4} ${y + 24}H${x - 4}Z`} fill="#e39150" stroke="#9a5424" strokeWidth="1.6" />
    <path d={`M${x - 16} ${y + 4}L${x - 3} ${y + 22}H${x + 3}L${x + 16} ${y + 4}Q${x} ${y + 12} ${x - 16} ${y + 4}Z`} fill="white" />
    <circle cx={x - 8} cy={y - 2} r="2.2" fill="#1d252c" /><circle cx={x + 8} cy={y - 2} r="2.2" fill="#1d252c" /><circle cx={x} cy={y + 23} r="3" fill="#1d252c" /></g>
}
function Snail({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 22} ${y + 10}H${x + 18}q8 0 8 -8`} stroke="#8a6f8f" strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d={`M${x + 24} ${y}l4 -12M${x + 26} ${y}l8 -10`} stroke="#8a6f8f" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx={x - 4} cy={y - 4} r={14} fill="#e6c7a6" stroke="#9a6f4a" strokeWidth="1.6" /><path d={`M${x - 4} ${y - 4}m-7 0a7 7 0 1 1 7 7`} stroke="#9a6f4a" strokeWidth="1.4" fill="none" /></g>
}
const EXT = [
  { key: 'fast', x: 90, y: 72, name: 'habitat destroyed' }, { key: 'predator', x: 450, y: 72, name: 'new predator' },
  { key: 'fast', x: 90, y: 206, name: 'volcanic eruption' }, { key: 'predator', x: 450, y: 206, name: 'new disease' },
  { key: 'food', x: 270, y: 240, name: 'new competitor for food' },
]
function ExtinctionIcons({ numbered, assessment, lit }: { numbered: boolean; assessment: boolean; lit: (i: number) => boolean }) {
  return <g>{EXT.map((e, i) => <g key={i} opacity={lit(i) ? 1 : faded}>
    {i === 0 && <Stumps x={e.x} y={e.y} />}{i === 1 && <Fox x={e.x} y={e.y} />}{i === 2 && <Volcano x={e.x} y={e.y} />}
    {i === 3 && <Virus cx={e.x} cy={e.y} r={15} seed={3} />}
    {i === 4 && <g><path d={`M${e.x - 22} ${e.y + 4}Q${e.x} ${e.y - 18} ${e.x + 22} ${e.y + 4}Q${e.x} ${e.y + 16} ${e.x - 22} ${e.y + 4}Z`} fill={leaf} stroke={leafLine} strokeWidth="1.4" /><Beetle x={e.x - 44} y={e.y + 2} s={.85} a={90} /><g transform={`translate(${2 * e.x + 88} 0) scale(-1 1)`}><Snail x={e.x + 44} y={e.y + 2} /></g></g>}
    {numbered && <Badge n={i + 1} x={e.x + (i % 2 ? 42 : -48)} y={e.y - 26} />}
    {!assessment && <text x={e.x} y={e.y + 44} textAnchor="middle" fill={ink} fontSize="12" fontWeight="700">{e.name}</text>}
  </g>)}</g>
}
function ExtinctionScene({ focus }: { focus: string }) {
  const step = focus.replace('evolve-ext-', '')
  const lit = (i: number) => step === 'all' || EXT[i].key === step
  return <Diagram title="A circle in the middle holds dashed outlines of beetles: none are left, so the species is extinct. Around it are five causes: a habitat destroyed, a new predator, a volcanic eruption, a new disease, and a new competitor for food.">
    <g opacity={step === 'none' || step === 'all' ? 1 : faded}>
      <circle cx={270} cy={118} r={60} fill="#f4f6f8" stroke={muted} strokeWidth="1.8" strokeDasharray="6 5" />
      {[[246, 96], [290, 92], [252, 138], [294, 140]].map(([x, y], i) => <Beetle key={i} x={x} y={y} c="ghost" a={i * 30 - 30} />)}
      <text x={270} y={36} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">extinct: none left</text>
    </g>
    {step !== 'none' && EXT.map((e, i) => <g key={i} opacity={lit(i) ? 1 : faded}><Arrow x1={e.x + (e.x < 270 ? 44 : e.x > 270 ? -44 : 0)} y1={e.y + (i === 4 ? -22 : 0)} x2={e.x < 270 ? 208 : e.x > 270 ? 332 : 270} y2={i === 4 ? 184 : e.y < 150 ? 100 : 146} colour={muted} width={2} /></g>)}
    <ExtinctionIcons numbered={false} assessment={false} lit={i => step !== 'none' && lit(i)} />
  </Diagram>
}
function ExtinctionQuestion({ assessment }: { assessment: boolean }) {
  return <Diagram title={assessment ? 'Five numbered pictures of causes of extinction: 1 tree stumps, 2 a fox, 3 an erupting volcano, 4 a virus, 5 a snail and a beetle on the same leaf.' : 'Five causes of extinction: 1 habitat destroyed, 2 new predator, 3 volcanic eruption, a catastrophic event, 4 new disease, 5 new competitor for food.'}>
    <ExtinctionIcons numbered assessment={assessment} lit={() => true} />
  </Diagram>
}

// ---------- Lesson 48: antibiotic-resistant bacteria ----------
function Bug({ x, y, a = 0, resistant = false, dead = false, seed = 1, k = 1 }: { x: number; y: number; a?: number; resistant?: boolean; dead?: boolean; seed?: number; k?: number }) {
  return <g opacity={dead ? .38 : 1}><Bacterium cx={x} cy={y} length={30 * k} thick={13 * k} angle={a} seed={seed} />
    {resistant && <circle cx={x} cy={y} r={4.2 * k} fill={gene} stroke="white" strokeWidth="1.2" />}
    {dead && <path d={`M${x - 9} ${y - 9}L${x + 9} ${y + 9}M${x + 9} ${y - 9}L${x - 9} ${y + 9}`} stroke={muted} strokeWidth="2.4" strokeLinecap="round" />}</g>
}
function Pill({ x, y, a = 0, crossed = false, s = 1 }: { x: number; y: number; a?: number; crossed?: boolean; s?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
    <path d="M-14 -7H0V7H-14A7 7 0 0 1 -14 -7Z" fill="white" stroke={antibiotic} strokeWidth="1.6" /><path d="M0 -7H14A7 7 0 0 1 14 7H0Z" fill={antibiotic} stroke={antibiotic} strokeWidth="1.6" />
    {crossed && <path d="M-14 -14L14 14M14 -14L-14 14" stroke="#c8505a" strokeWidth="3" strokeLinecap="round" />}</g>
}
const DISH_R = 50, DISH_X = [66, 202, 338, 474], DISH_Y = 124
const BUGS: Array<[number, number, number]> = [[-22, -20, 20], [14, -26, -30], [28, 4, 80], [-26, 12, -60], [2, 2, 10], [-8, 30, 30], [22, 28, -20]]
const ANTI: Pt[] = [[-32, -2], [-4, -36], [34, -18], [-14, -4], [10, 20], [-30, 30], [36, 30], [18, -6]]
function Stage({ n, lit }: { n: number; lit: boolean }) {
  const cx = DISH_X[n], cy = DISH_Y
  return <g opacity={lit ? 1 : faded}>
    <circle cx={cx} cy={cy} r={DISH_R} fill="#fbf1f5" stroke={ink} strokeWidth="1.8" />
    {n > 0 && ANTI.map(([dx, dy], i) => <circle key={i} cx={cx + dx} cy={cy + dy} r="2.6" fill={antibiotic} />)}
    {n < 2 && BUGS.map(([dx, dy, a], i) => <Bug key={i} x={cx + dx} y={cy + dy} a={a} seed={i + 2} resistant={i === 4} dead={n === 1 && i !== 4} />)}
    {n === 2 && ([[-14, -6, 20], [14, 8, -10], [-4, 24, 60], [18, -22, -40]] as Array<[number, number, number]>).map(([dx, dy, a], i) => <Bug key={i} x={cx + dx} y={cy + dy} a={a} seed={i + 12} resistant />)}
    {n === 3 && BUGS.concat([[20, -2, -70]]).map(([dx, dy, a], i) => <Bug key={i} x={cx + dx} y={cy + dy} a={a} seed={i + 22} resistant />)}
  </g>
}
const STAGE_NAMES = [['random', 'mutation'], ['antibiotic kills', 'the others'], ['survivor', 'reproduces'], ['resistant', 'strain']]
function ResistanceScene({ focus }: { focus: string }) {
  const step = ['mutate', 'survive', 'breed', 'strain', 'fast'].indexOf(focus.replace('evolve-res-', ''))
  return <Diagram title="Four circles show bacteria in a patient, in order. 1: one bacterium has a random mutation that makes it resistant, marked with a coral dot. 2: the antibiotic kills the others; the resistant one survives. 3: the survivor reproduces and passes on the gene. 4: all the bacteria are resistant: a resistant strain.">
    {DISH_X.map((x, i) => <g key={x}>
      <Stage n={i} lit={step === 4 || step === i} />
      {i < 3 && <g opacity={step === 4 || step === i + 1 ? 1 : faded}><Arrow x1={x + DISH_R + 4} y1={DISH_Y} x2={DISH_X[i + 1] - DISH_R - 4} y2={DISH_Y} colour={ink} width={2.4} /></g>}
      <g opacity={step === 4 || step === i ? 1 : faded}><Badge n={i + 1} x={x - 40} y={DISH_Y - 50} /><Caption x={x} y={DISH_Y + 74} lines={STAGE_NAMES[i]} strong={step === i} /></g>
    </g>)}
    <g><Bug x={36} y={262} resistant seed={9} /><text x={70} y={267} fill={ink} fontSize="12">resistant: has the gene for resistance</text>
      <circle cx={330} cy={262} r="3" fill={antibiotic} /><text x={342} y={267} fill={ink} fontSize="12">antibiotic</text></g>
    {step === 4 && <text x={270} y={292} textAnchor="middle" fill={gene} fontSize="13" fontWeight="700">fast reproduction → many generations → fast evolution</text>}
  </Diagram>
}
function ResistanceQuestion({ assessment }: { assessment: boolean }) {
  return <Diagram title={assessment ? 'Four numbered circles of bacteria in order, with antibiotic particles in circles 2 to 4. Bacteria with a coral dot have the gene for resistance.' : 'Four stages: 1 a random mutation; 2 the antibiotic kills the others; 3 the survivor reproduces; 4 a resistant strain.'}>
    {DISH_X.map((x, i) => <g key={x}><Stage n={i} lit />{i < 3 && <Arrow x1={x + DISH_R + 4} y1={DISH_Y} x2={DISH_X[i + 1] - DISH_R - 4} y2={DISH_Y} colour={ink} width={2.4} />}
      <Badge n={i + 1} x={x - 40} y={DISH_Y - 50} />{!assessment && <Caption x={x} y={DISH_Y + 74} lines={STAGE_NAMES[i]} />}</g>)}
    <Bug x={36} y={262} resistant seed={9} /><text x={70} y={267} fill={ink} fontSize="12">has the gene for resistance</text>
    <circle cx={330} cy={262} r="3" fill={antibiotic} /><text x={342} y={267} fill={ink} fontSize="12">antibiotic</text>
  </Diagram>
}
const QUADS = [{ x: 6, y: 6 }, { x: 274, y: 6 }, { x: 6, y: 154 }, { x: 274, y: 154 }]
function Quad({ i, lit, title, colour = ink, children }: { i: number; lit: boolean; title: string; colour?: string; children: ReactNode }) {
  const q = QUADS[i]
  return <g opacity={lit ? 1 : faded}><rect x={q.x} y={q.y} width={260} height={140} rx="12" fill="#fbfdfc" stroke="#d6e3e9" strokeWidth="1.4" />
    <text x={q.x + 14} y={q.y + 24} fill={colour} fontSize="13" fontWeight="700">{title}</text>{children}</g>
}
function Cocci({ x, y }: { x: number; y: number }) {
  const pts: Pt[] = [[0, 0], [13, -4], [-12, 5], [4, 13], [-4, -12], [17, 9], [-16, -8], [9, -15], [-9, 17], [22, -8]]
  return <g>{pts.map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r={7.2} fill={C.bugFill} stroke={C.bug} strokeWidth="1.6" />)}
    {pts.filter((_, i) => i % 3 === 0).map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r="3" fill={gene} />)}</g>
}
function ProblemScene({ focus }: { focus: string }) {
  const step = ['treat', 'spread', 'worse', 'superbug'].indexOf(focus.replace('evolve-prob-', ''))
  return <Diagram title="Four panels. No effective treatment: a person with an infection and a crossed-out antibiotic. Spreads easily: resistant bacteria pass between three people. Getting more common: bars rise year by year as antibiotics are overused. Superbugs: MRSA, round bacteria in clusters, resistant to most antibiotics.">
    <Quad i={0} lit={step === 0} title="no effective treatment">
      <Mini x={60} y={66} scale={.4} /><Bug x={106} y={100} resistant seed={4} /><Pill x={186} y={92} crossed s={1.3} />
      <text x={186} y={130} textAnchor="middle" fill={ink} fontSize="12">the usual antibiotic fails</text>
    </Quad>
    <Quad i={1} lit={step === 1} title="spreads easily">
      {[312, 400, 488].map((x, i) => <Mini key={x} x={x} y={70} scale={.36} jumper={['#a9cbe0', '#c6d9b4', '#f2cfa6'][i]} />)}
      {[346, 434].map(x => <g key={x}><Arrow x1={x} y1={82} x2={x + 22} y2={82} colour={C.bug} width={2.2} /><Bug x={x + 10} y={104} resistant seed={x} k={.8} /></g>)}
      <text x={400} y={136} textAnchor="middle" fill={ink} fontSize="12">people are not immune to it</text>
    </Quad>
    <Quad i={2} lit={step === 2} title="getting more common">
      {[18, 30, 46, 64].map((h, i) => <rect key={i} x={40 + i * 30} y={266 - h * 1.1} width={20} height={h * 1.1} fill={C.bugFill} stroke={C.bug} strokeWidth="1.5" />)}
      <path d="M32 266H166" stroke={ink} strokeWidth="1.6" /><text x={99} y={284} textAnchor="middle" fill={ink} fontSize="12">resistance, year by year</text>
      <Pill x={200} y={200} a={-20} /><Pill x={228} y={214} a={30} /><Pill x={196} y={232} a={10} /><Pill x={232} y={246} a={-40} />
      <text x={214} y={280} textAnchor="middle" fill={ink} fontSize="12">overused</text>
    </Quad>
    <Quad i={3} lit={step === 3} title="superbugs, such as MRSA" colour={C.bugDeep}>
      <Cocci x={340} y={222} />
      {[[418, 204], [466, 204], [418, 244], [466, 244]].map(([x, y], i) => <Pill key={i} x={x} y={y} crossed={i < 3} s={.9} />)}
      <text x={444} y={280} textAnchor="middle" fill={ink} fontSize="12">resistant to most antibiotics</text>
    </Quad>
  </Diagram>
}
function Chicken({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 6} ${y + 18}v14M${x + 6} ${y + 18}v14`} stroke="#c98f2c" strokeWidth="2.4" strokeLinecap="round" />
    <path d={`M${x - 26} ${y - 6}C${x - 30} ${y + 16} ${x - 8} ${y + 24} ${x + 10} ${y + 20}C${x + 26} ${y + 14} ${x + 24} ${y - 4} ${x + 16} ${y - 10}C${x + 6} ${y - 4} ${x - 10} ${y - 2} ${x - 26} ${y - 6}Z`} fill="#fdf6e8" stroke="#b09a78" strokeWidth="1.6" />
    <circle cx={x + 18} cy={y - 18} r={10} fill="#fdf6e8" stroke="#b09a78" strokeWidth="1.6" /><path d={`M${x + 12} ${y - 28}q3 -8 6 -2q3 -7 6 0q4 -4 4 4`} fill="#d9534f" />
    <path d={`M${x + 27} ${y - 19}l8 3l-8 3z`} fill="#e2a93b" /><circle cx={x + 21} cy={y - 20} r="1.8" fill="#1d252c" />
    <path d={`M${x - 14} ${y + 2}q10 10 22 2`} stroke="#b09a78" strokeWidth="1.4" fill="none" /></g>
}
function Blister({ x, y }: { x: number; y: number }) {
  return <g><rect x={x} y={y} width={176} height={62} rx="8" fill="#eef2f5" stroke={antibiotic} strokeWidth="1.6" />
    {Array.from({ length: 14 }, (_, i) => { const cx = x + 16 + (i % 7) * 24, cy = y + 17 + Math.floor(i / 7) * 28
      return <g key={i}><ellipse cx={cx} cy={cy} rx={9} ry={9} fill="white" stroke={antibiotic} strokeWidth="1.3" strokeDasharray="3 2" /><path d={`M${cx - 4} ${cy}l3 3.5l5.5 -6.5`} stroke={leafLine} strokeWidth="2" fill="none" strokeLinecap="round" /></g> })}</g>
}
function SlowScene({ focus }: { focus: string }) {
  const step = ['doctor', 'course', 'farm', 'new'].indexOf(focus.replace('evolve-slow-', ''))
  return <Diagram title="Four panels on slowing down resistance. Only when needed: antibiotics for a serious infection caused by bacteria, not for a cold virus. Take the full course: a strip of 14 doses, every one taken. Restrict use on farms: use fewer antibiotics on animals such as chickens, because resistant strains can spread to people through meat. New antibiotics: a lab flask, a clock and coins: slow and expensive.">
    <Quad i={0} lit={step === 0 || step === 3} title="only when really needed">
      <Bug x={44} y={62} seed={31} /><Arrow x1={70} y1={62} x2={104} y2={62} colour={ink} width={2} /><Pill x={132} y={62} /><text x={160} y={60} fill={leafLine} fontSize="13" fontWeight="700">✓ serious</text><text x={160} y={76} fill={leafLine} fontSize="12">bacterial infection</text>
      <Virus cx={44} cy={108} r={11} seed={2} /><Arrow x1={70} y1={108} x2={104} y2={108} colour={ink} width={2} /><Pill x={132} y={108} crossed /><text x={160} y={113} fill="#c8505a" fontSize="13" fontWeight="700">✗ cold or flu</text>
    </Quad>
    <Quad i={1} lit={step === 1 || step === 3} title="take the full course">
      <Blister x={316} y={46} /><text x={404} y={128} textAnchor="middle" fill={ink} fontSize="12">every dose taken: no bacteria left</text>
    </Quad>
    <Quad i={2} lit={step === 2 || step === 3} title="restrict use on farms">
      <Chicken x={70} y={220} /><Pill x={150} y={214} /><text x={176} y={206} fill={ink} fontSize="12" fontWeight="700">use fewer</text><text x={176} y={222} fill={ink} fontSize="12" fontWeight="700">antibiotics</text>
      <text x={136} y={282} textAnchor="middle" fill={ink} fontSize="12">strains can spread to people via meat</text>
    </Quad>
    <Quad i={3} lit={step === 3} title="new antibiotics">
      <path d="M318 196h20v26l18 34h-56l18 -34z" fill="#e2f2f9" stroke={ink} strokeWidth="1.6" /><path d="M306 246l8 -14h28l8 14z" fill="#bfe1f0" />
      <circle cx={404} cy={226} r={24} fill="white" stroke={ink} strokeWidth="2" /><path d="M404 226V210M404 226l12 6" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
      {[0, 1, 2].map(i => <ellipse key={i} cx={474} cy={246 - i * 8} rx={18} ry={6} fill="#f2d27a" stroke="#b08a2a" strokeWidth="1.4" />)}
      <text x={404} y={282} textAnchor="middle" fill={ink} fontSize="12">slow and expensive to develop</text>
    </Quad>
  </Diagram>
}
function ResistanceData() {
  const data: Pt[] = [[2010, 4], [2013, 5], [2016, 7], [2019, 9], [2022, 12], [2025, 14]]
  const X = (y: number) => 100 + (y - 2010) * 24, Y = (v: number) => 250 - v * 10
  return <Diagram title="Line graph of the percentage of infections from one type of bacteria in a hospital that were resistant to an antibiotic, from 2010 to 2025. It rises from 4% in 2010 to 14% in 2025.">
    <text x={20} y={24} fill={ink} fontSize="14" fontWeight="600">Resistant infections in one hospital</text>
    {[0, 5, 10, 15, 20].map(v => <g key={v}><path d={`M100 ${Y(v)}H${X(2025) + 14}`} stroke="#e3ebf0" strokeWidth={v ? 1 : 0} /><path d={`M94 ${Y(v)}h6`} stroke={ink} /><text x={90} y={Y(v) + 4} textAnchor="end" fontSize="12" fill={ink}>{v}</text></g>)}
    <path d={`M100 ${Y(0)}H${X(2025) + 14}M100 ${Y(0)}V${Y(20) - 8}`} stroke={ink} strokeWidth="2" />
    {data.map(([y]) => <g key={y}><path d={`M${X(y)} ${Y(0)}v6`} stroke={ink} /><text x={X(y)} y={Y(0) + 20} textAnchor="middle" fontSize="12" fill={ink}>{y}</text></g>)}
    <text x={30} y={150} fill={ink} fontSize="12" transform="rotate(-90 30 150)" textAnchor="middle">resistant infections (%)</text>
    <text x={X(2017.5)} y={292} textAnchor="middle" fill={ink} fontSize="12">year</text>
    <path d={data.map(([y, v], i) => `${i ? 'L' : 'M'}${X(y)} ${Y(v)}`).join('')} stroke={C.bug} strokeWidth="3" fill="none" />
    {data.map(([y, v]) => <circle key={y} cx={X(y)} cy={Y(v)} r="4" fill={C.bug} />)}
  </Diagram>
}

// ---------- Lesson 49: selective breeding and genetic engineering ----------
const choose = C.amber
const alleleTones = ['#8fb4de', '#e7b76a', '#9acb8f', '#dc9ab5', '#b9a3dc', '#f2a27a']
function Berry({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 16C-8 12 -14 2 -13 -5C-12 -10 -6 -11 0 -10C6 -11 12 -10 13 -5C14 2 8 12 0 16Z" fill="#e0525a" stroke="#a8323b" strokeWidth={1.4 / s} />
    {[[-6, -4], [0, -5], [6, -4], [-4, 3], [4, 3], [0, 9]].map(([dx, dy], i) => <ellipse key={i} cx={dx} cy={dy} rx="1" ry="1.6" fill="#f6d25e" />)}
    <path d="M-9 -9l3 -6l3 4l3 -7l3 7l3 -4l3 6q-9 3 -18 0z" fill={leaf} stroke={leafLine} strokeWidth={1.2 / s} /></g>
}
function BerryPlant({ x, y, s, chosen = false }: { x: number; y: number; s: number; chosen?: boolean }) {
  return <g>
    {chosen && <circle cx={x} cy={y + 4} r={34} fill="none" stroke={choose} strokeWidth="2.6" strokeDasharray="6 4" />}
    <path d={`M${x} ${y + 26}V${y - 8}`} stroke={leafLine} strokeWidth="2" />
    <path d={blob(x - 11, y + 22, 10, 6, 3, .1)} fill={leaf} stroke={leafLine} strokeWidth="1.3" /><path d={blob(x + 11, y + 22, 10, 6, 5, .1)} fill={leaf} stroke={leafLine} strokeWidth="1.3" />
    <Berry x={x} y={y - 2} s={s} /></g>
}
const GEN_X = [8, 195, 382], GEN_W = 150
const BREED: Array<{ name: string; sizes: number[]; chosen: number[]; caption: string[] }> = [
  { name: 'parents', sizes: [.7, 1.3, .9, 1.25], chosen: [1, 3], caption: ['breed the two with', 'the biggest fruit'] },
  { name: 'offspring', sizes: [1.05, 1.45, 1.15, 1.5], chosen: [1, 3], caption: ['offspring vary: breed', 'the biggest again'] },
  { name: 'generations later', sizes: [1.6, 1.55, 1.65, 1.6], chosen: [], caption: ['all the offspring', 'have big fruit'] },
]
function BreedScene({ focus }: { focus: string }) {
  const step = ['intro', 'choose', 'repeat', 'artificial'].indexOf(focus.replace('evolve-breed-', ''))
  const lit = (i: number) => step === 3 || (step === 0 && i === 0) || (step === 1 && i < 2) || (step === 2 && i > 0)
  return <Diagram title="Selective breeding of strawberry plants, in three boxes from left to right. Parents: the two plants with the biggest strawberries are circled and bred together. Offspring: their strawberries vary in size, and the two biggest are chosen and bred again. Generations later: every plant has big strawberries.">
    {BREED.map((g, gi) => { const x0 = GEN_X[gi], cx = x0 + GEN_W / 2
      return <g key={g.name} opacity={lit(gi) ? 1 : faded}>
        <rect x={x0} y={24} width={GEN_W} height={206} rx="12" fill="#fbfdfc" stroke="#d6e3e9" strokeWidth="1.4" />
        <text x={cx} y={46} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">{g.name}</text>
        {g.sizes.map((s, i) => <BerryPlant key={i} x={cx + (i % 2 ? 36 : -36)} y={i < 2 ? 98 : 176} s={s} chosen={g.chosen.includes(i)} />)}
        <Caption x={cx} y={250} lines={g.caption} strong={step === gi} />
        {gi < 2 && <g opacity={lit(gi + 1) && lit(gi) ? 1 : faded}><Arrow x1={x0 + GEN_W + 4} y1={128} x2={GEN_X[gi + 1] - 5} y2={128} colour={choose} width={2.4} /></g>}
      </g> })}
    {step === 3 ? <text x={270} y={292} textAnchor="middle" fill={choose} fontSize="13" fontWeight="700">people choose, not nature: artificial selection</text>
      : <g><circle cx={196} cy={287} r="8" fill="none" stroke={choose} strokeWidth="2.2" strokeDasharray="4 3" /><text x={212} y={292} fill={ink} fontSize="12">chosen to breed</text></g>}
  </Diagram>
}
function Wheat({ x, ground, h = 90, sick = false, k = 1 }: { x: number; ground: number; h?: number; sick?: boolean; k?: number }) {
  const top = ground - h, grain = sick ? '#c9a36b' : '#e2b64a', line = sick ? '#8a6a3c' : '#a8801f'
  return <g><path d={`M${x} ${ground}V${top + 10}`} stroke={sick ? '#9c9a5a' : leafLine} strokeWidth="2.4" />
    <path d={`M${x} ${ground - h * .35}q-16 -6 -20 -22q12 4 20 16`} fill={sick ? '#c9c486' : leaf} stroke={sick ? '#9c9a5a' : leafLine} strokeWidth="1.2" />
    {[0, 1, 2, 3, 4].map(i => [-1, 1].map(s => <ellipse key={`${i}${s}`} cx={x + s * 4 * k} cy={top + 14 - i * 8 * k} rx={3.6 * k} ry={6 * k} transform={`rotate(${s * 22} ${x + s * 4 * k} ${top + 14 - i * 8 * k})`} fill={grain} stroke={line} strokeWidth="1" />))}
    {sick && [[-5, 4], [4, -10], [-3, -22], [6, 14]].map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={top + dy} r="2.4" fill="#6b4a2a" />)}</g>
}
function Dog({ x, y, s = 1, fur = '#c9964a' }: { x: number; y: number; s?: number; fur?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="-17" cy="2" rx="7" ry="15" fill="#8a5a3b" transform="rotate(18 -17 2)" /><ellipse cx="17" cy="2" rx="7" ry="15" fill="#8a5a3b" transform="rotate(-18 17 2)" />
    <circle cx="0" cy="0" r="17" fill={fur} stroke="#8a5a3b" strokeWidth="1.4" />
    <ellipse cx="0" cy="8" rx="9" ry="7" fill="#f3e2c6" /><ellipse cx="0" cy="4" rx="3.6" ry="2.6" fill="#2a2320" />
    <circle cx="-6" cy="-5" r="2.2" fill="#2a2320" /><circle cx="6" cy="-5" r="2.2" fill="#2a2320" />
    <path d="M-4 10q4 3 8 0" stroke="#2a2320" strokeWidth="1.3" fill="none" strokeLinecap="round" /></g>
}
function Bottle({ x, y, text, fill = 'white' }: { x: number; y: number; text: string; fill?: string }) {
  return <g><path d={`M${x - 8} ${y - 40}h16v10l8 10v40q0 6 -6 6h-20q-6 0 -6 -6v-40l8 -10z`} fill={fill} stroke={ink} strokeWidth="1.6" />
    <rect x={x - 10} y={y - 46} width={20} height={7} rx="2" fill={P.blue} />
    <text x={x} y={y + 10} textAnchor="middle" fill={ink} fontSize="10" fontWeight="700">{text}</text></g>
}
function BreedUses() {
  return <Diagram title="Four panels of features people breed for. More milk or meat: a milk bottle. Crops that resist disease: a healthy wheat plant. Gentle dogs: a friendly dog. Big or unusual flowers: a large flower.">
    <Quad i={0} lit title="more milk or meat"><Bottle x={130} y={96} text="milk" /></Quad>
    <Quad i={1} lit title="crops that resist disease"><Wheat x={380} ground={138} h={76} /><Wheat x={420} ground={138} h={70} /><text x={466} y={92} fill={leafLine} fontSize="22" fontWeight="700">✓</text></Quad>
    <Quad i={2} lit title="gentle dogs"><Dog x={136} y={228} s={1.4} /></Quad>
    <Quad i={3} lit title="big or unusual flowers"><g transform="translate(404 218) scale(1.4) translate(-404 -218)"><Flower x={404} ground={246} top={206} /></g></Quad>
  </Diagram>
}
function AllelePair({ x, y, a, b }: { x: number; y: number; a: string; b: string }) {
  return <g>{[a, b].map((c, i) => <rect key={i} x={x - 9 + i * 10} y={y - 18} width={8} height={36} rx="3" fill={c} stroke={c === C.red ? '#8e2f3a' : ink} strokeWidth="1" />)}</g>
}
function InbredScene({ focus }: { focus: string }) {
  const step = ['relatives', 'alleles', 'health', 'disease'].indexOf(focus.replace('evolve-inbred-', ''))
  return <Diagram title="Four panels on inbreeding. Close relatives: two parent dogs have three puppies, and a brother and sister are bred together. Fewer alleles: a varied population has six colours of allele; an inbred population has only two. Health problems: two parents each carry one harmful allele, and their offspring inherits it from both. A new disease: every wheat plant in a field is diseased, because none has an allele to resist it.">
    <Quad i={0} lit={step === 0} title="close relatives">
      <Dog x={96} y={54} s={.8} /><Dog x={176} y={54} s={.8} fur="#e8c49a" /><path d={`M110 54H162M136 54V78M76 78H196M76 78v8M136 78v8M196 78v8`} stroke={ink} strokeWidth="1.6" fill="none" />
      <Dog x={76} y={104} s={.7} /><Dog x={136} y={104} s={.7} fur="#e8c49a" /><Dog x={196} y={104} s={.7} />
      <path d="M150 120q23 14 32 0" stroke={choose} strokeWidth="2.4" fill="none" strokeDasharray="5 3" /><text x={166} y={142} textAnchor="middle" fill={choose} fontSize="11" fontWeight="700">bred together</text>
    </Quad>
    <Quad i={1} lit={step === 1} title="fewer different alleles">
      <text x={288} y={62} fill={ink} fontSize="12">varied</text><text x={288} y={112} fill={ink} fontSize="12">inbred</text>
      {[0, 1, 2, 3, 4, 5, 2, 4].map((c, i) => <rect key={i} x={340 + i * 22} y={44} width={14} height={26} rx="4" fill={alleleTones[c]} stroke={ink} strokeWidth=".8" />)}
      {[0, 1, 0, 0, 1, 0, 1, 0].map((c, i) => <rect key={i} x={340 + i * 22} y={94} width={14} height={26} rx="4" fill={alleleTones[c]} stroke={ink} strokeWidth=".8" />)}
    </Quad>
    <Quad i={2} lit={step === 2} title="health problems">
      <AllelePair x={50} y={210} a={alleleTones[0]} b={C.red} /><AllelePair x={130} y={210} a={C.red} b={alleleTones[1]} />
      <text x={90} y={214} textAnchor="middle" fill={ink} fontSize="16">+</text>
      <Arrow x1={150} y1={210} x2={190} y2={210} colour={ink} width={2} /><AllelePair x={216} y={210} a={C.red} b={C.red} />
      <rect x={40} y={252} width={10} height={14} rx="3" fill={C.red} /><text x={56} y={264} fill={ink} fontSize="12">harmful allele from both parents</text>
    </Quad>
    <Quad i={3} lit={step === 3} title="a new disease">
      {[310, 350, 390, 430, 470].map((x, i) => <Wheat key={x} x={x} ground={262} h={48 - (i % 2) * 6} sick k={.9} />)}
      <text x={404} y={284} textAnchor="middle" fill={ink} fontSize="12">no plant has an allele to resist it</text>
    </Quad>
  </Diagram>
}
const GE_X = [66, 202, 338, 474], GE_Y = 118
const GE_NAMES = [['cut out the', 'insulin gene'], ['put it into', 'a bacterium'], ['the bacteria', 'multiply'], ['collect the', 'insulin']]
function GeneBit({ x, y, a = 0 }: { x: number; y: number; a?: number }) {
  return <g transform={`rotate(${a} ${x} ${y})`}><rect x={x - 12} y={y - 4} width={24} height={8} rx="4" fill={gene} stroke="white" strokeWidth="1" /></g>
}
function Scissors({ x, y }: { x: number; y: number }) {
  return <g stroke={ink} strokeWidth="1.8" fill="none"><circle cx={x - 6} cy={y + 12} r="4.5" /><circle cx={x + 6} cy={y + 12} r="4.5" /><path d={`M${x - 4} ${y + 8}L${x + 6} ${y - 12}M${x + 4} ${y + 8}L${x - 6} ${y - 12}`} strokeLinecap="round" /></g>
}
function GeStage({ n }: { n: number }) {
  const cx = GE_X[n], cy = GE_Y
  if (n === 0) return <g><circle cx={cx - 8} cy={cy + 8} r={42} fill={C.skin} stroke={C.skinLine} strokeWidth="1.8" /><circle cx={cx - 8} cy={cy + 8} r={18} fill="#e6c3a6" stroke={C.skinLine} strokeWidth="1.4" />
    <path d={`M${cx - 20} ${cy + 8}q6 -6 12 0t12 0`} stroke="#9c7a5e" strokeWidth="2" fill="none" /><GeneBit x={cx + 28} y={cy - 38} a={-20} />
    <Arrow x1={cx} y1={cy - 6} x2={cx + 20} y2={cy - 28} colour={gene} width={1.8} dashed /><Scissors x={cx + 44} y={cy - 12} />
    <text x={cx - 8} y={cy + 66} textAnchor="middle" fill={ink} fontSize="11">human cell</text></g>
  if (n === 1) return <g><Bacterium cx={cx} cy={cy + 8} length={96} thick={46} seed={5} /><GeneBit x={cx + 4} y={cy + 8} /></g>
  if (n === 2) return <g>{([[-30, -16, 20], [8, -26, -30], [34, 4, 70], [-26, 22, -60], [4, 14, 10], [16, 40, 30], [-40, 50, -10]] as Array<[number, number, number]>).map(([dx, dy, a], i) => <g key={i}><Bacterium cx={cx + dx} cy={cy + dy} length={30} thick={13} angle={a} seed={i + 3} /><circle cx={cx + dx} cy={cy + dy} r="3.6" fill={gene} stroke="white" strokeWidth="1" /></g>)}</g>
  return <g><Bottle x={cx} y={cy + 20} text="insulin" fill="#eef7fb" /><Arrow x1={cx - 44} y1={cy + 34} x2={cx - 22} y2={cy + 18} colour={ink} width={1.8} /></g>
}
function InsulinScene({ focus, question = false, assessment = false }: { focus: string; question?: boolean; assessment?: boolean }) {
  const step = question ? 9 : ['cut', 'gm', 'insulin'].indexOf(focus.replace('evolve-ge-', ''))
  const lit = (i: number) => step >= 2 || step === i
  return <Diagram title={assessment ? 'Four numbered steps in making insulin. 1: a human cell and a gene with scissors. 2: a large bacterium with the gene inside it. 3: many bacteria, each with the gene. 4: a bottle of insulin.' : 'Making human insulin, in four numbered steps. 1: the insulin gene, shown in coral, is cut out of a human cell. 2: the gene is put into a bacterium, making a GM bacterium. 3: the bacteria multiply, and each one has the gene. 4: the bacteria make insulin, which is collected.'}>
    {GE_X.map((x, i) => <g key={x}>
      <g opacity={lit(i) ? 1 : faded}><GeStage n={i} /><Badge n={i + 1} x={x - 50} y={GE_Y - 62} />
        {!assessment && <Caption x={x} y={GE_Y + 104} lines={GE_NAMES[i]} strong={step === i} />}</g>
      {i < 3 && <g opacity={lit(i + 1) ? 1 : faded}><Arrow x1={x + 50} y1={GE_Y + 8} x2={GE_X[i + 1] - 50} y2={GE_Y + 8} colour={ink} width={2.2} /></g>}
    </g>)}
    <GeneBit x={40} y={278} /><text x={60} y={283} fill={ink} fontSize="12">the human insulin gene</text>
    {step === 1 && <text x={390} y={283} textAnchor="middle" fill={gene} fontSize="13" fontWeight="700">a GM bacterium: it has a new gene</text>}
  </Diagram>
}
function Weed({ x, ground }: { x: number; ground: number }) {
  return <g><path d={`M${x} ${ground}q-2 -14 -12 -20M${x} ${ground}q2 -16 12 -18M${x} ${ground}q0 -12 -2 -24`} stroke="#9c8450" strokeWidth="2" fill="none" />
    {[[-12, -20], [12, -18], [-2, -24]].map(([dx, dy], i) => <path key={i} d={blob(x + dx, ground + dy, 5, 3, 40 + i, .2)} fill="#c8b98a" stroke="#9c8450" strokeWidth="1" />)}</g>
}
function GeUses({ focus }: { focus: string }) {
  const step = ['herbicide', 'yield', 'therapy'].indexOf(focus.replace('evolve-ge-', ''))
  return <Diagram title="Three panels on uses of genetic engineering. Resists herbicide: a field is sprayed; the GM wheat stays healthy and the weeds between it die. Bigger crop yield: a bar for the GM crop is taller than for the normal crop. Gene therapy: a working gene is added to a person’s cell that has a faulty gene.">
    {PANELS.map(({ x, w }, i) => <g key={x} opacity={step === i ? 1 : faded}><rect x={x} y={4} width={w} height={292} rx="12" fill="#fbfdfc" stroke="#d6e3e9" strokeWidth="1.4" />
      <text x={x + w / 2} y={28} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">{['resists herbicide', 'bigger crop yield', 'gene therapy'][i]}</text></g>)}
    <g opacity={step === 0 ? 1 : faded}>
      <path d="M40 58h104M92 58v-10h-14" stroke={ink} strokeWidth="2" fill="none" />{[52, 76, 100, 124].map(x => <path key={x} d={`M${x} 62l-4 10M${x} 62l4 10`} stroke={P.blue} strokeWidth="1.4" />)}
      {[42, 92, 142].map(x => <Wheat key={x} x={x} ground={236} h={112} />)}{[67, 117].map(x => <Weed key={x} x={x} ground={236} />)}
      <path d="M14 236H170V246H14Z" fill={soil} />
      <Caption x={92} y={266} lines={['weeds die;', 'the GM crop survives']} />
    </g>
    <g opacity={step === 1 ? 1 : faded}>
      <path d="M204 230H336" stroke={ink} strokeWidth="1.8" />
      <rect x={220} y={160} width={40} height={70} fill="#f3e3b0" stroke="#a8801f" strokeWidth="1.5" /><rect x={280} y={110} width={40} height={120} fill="#e2b64a" stroke="#a8801f" strokeWidth="1.5" />
      <Wheat x={240} ground={156} h={48} k={.7} /><Wheat x={300} ground={106} h={48} k={.7} />
      <text x={240} y={248} textAnchor="middle" fill={ink} fontSize="12">normal</text><text x={300} y={248} textAnchor="middle" fill={ink} fontSize="12" fontWeight="700">GM</text>
      <Caption x={270} y={276} lines={['more food produced']} />
    </g>
    <g opacity={step === 2 ? 1 : faded}>
      <circle cx={448} cy={140} r={62} fill={C.skin} stroke={C.skinLine} strokeWidth="1.8" /><circle cx={448} cy={140} r={34} fill="#e6c3a6" stroke={C.skinLine} strokeWidth="1.4" />
      <GeneBit x={436} y={128} /><path d="M428 120l16 16M444 120l-16 16" stroke={C.red} strokeWidth="2.6" strokeLinecap="round" />
      <GeneBit x={452} y={154} /><text x={474} y={159} fill={leafLine} fontSize="15" fontWeight="700">✓</text>
      <Arrow x1={510} y1={60} x2={470} y2={146} colour={gene} width={1.8} dashed />
      <Caption x={448} y={232} lines={['faulty gene ✗', 'working gene added ✓']} />
      <Caption x={448} y={276} lines={['may treat', 'inherited disorders']} />
    </g>
  </Diagram>
}
const BENEFITS = ['bigger crop yields', 'human insulin', 'may treat inherited disorders']
const CONCERNS = ['GM animal health problems', 'fewer wild flowers and insects', 'unknown effects on health']
function WeighScene({ focus }: { focus: string }) {
  const step = ['benefits', 'animals', 'crops', 'weigh'].indexOf(focus.replace('evolve-gm-', ''))
  const litL = step === 0 || step === 3, litR = (i: number) => step === 3 || (step === 1 && i === 0) || (step === 2 && i > 0)
  return <Diagram title="A balance weighs benefits of genetic engineering against concerns. Benefits: bigger crop yields, human insulin, and may treat inherited disorders. Concerns: health problems in GM animals, fewer wild flowers and insects, and unknown effects on human health.">
    <path d="M270 110L248 268H292Z" fill="#e3ebf0" stroke={ink} strokeWidth="1.8" /><path d="M60 110H480" stroke={ink} strokeWidth="4" strokeLinecap="round" /><circle cx={270} cy={110} r="6" fill={ink} />
    {[130, 410].map(x => <path key={x} d={`M${x} 110L${x - 90} 250M${x} 110L${x + 90} 250`} stroke={muted} strokeWidth="1.2" />)}
    {[130, 410].map(x => <path key={x} d={`M${x - 100} 250H${x + 100}q0 18 -20 18H${x - 80}q-20 0 -20 -18z`} fill="#eef2f5" stroke={ink} strokeWidth="1.6" />)}
    <text x={130} y={90} textAnchor="middle" fill={leafLine} fontSize="15" fontWeight="700" opacity={litL ? 1 : faded}>benefits</text>
    <text x={410} y={90} textAnchor="middle" fill={C.red} fontSize="15" fontWeight="700" opacity={step > 0 ? 1 : faded}>concerns</text>
    {BENEFITS.map((t, i) => <Chip key={t} x={130} y={170 + i * 30} w={222} text={t} colour={leafLine} dim={!litL} />)}
    {CONCERNS.map((t, i) => <Chip key={t} x={410} y={170 + i * 30} w={232} text={t} colour={C.red} dim={!litR(i)} />)}
    {step === 3 && <text x={270} y={292} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">weigh up each use, case by case</text>}
  </Diagram>
}
function GmData() {
  const Y = (v: number) => 250 - v * 20
  return <Diagram title="Bar chart of maize yield from two fields of the same size on one farm in one year. Normal maize: 8.1 tonnes. GM insect-resistant maize: 9.4 tonnes.">
    <text x={20} y={24} fill={ink} fontSize="14" fontWeight="600">Maize yield from two fields on one farm, one year</text>
    {[0, 2, 4, 6, 8, 10].map(v => <g key={v}><path d={`M110 ${Y(v)}H440`} stroke="#e3ebf0" strokeWidth={v ? 1 : 0} /><path d={`M104 ${Y(v)}h6`} stroke={ink} /><text x={100} y={Y(v) + 4} textAnchor="end" fontSize="12" fill={ink}>{v}</text></g>)}
    <path d={`M110 ${Y(0)}H440M110 ${Y(0)}V${Y(10) - 8}`} stroke={ink} strokeWidth="2" />
    {([['normal maize', 8.1, '#f3e3b0'], ['GM maize', 9.4, '#e2b64a']] as Array<[string, number, string]>).map(([n, v, c], i) => <g key={n}>
      <rect x={170 + i * 150} y={Y(v)} width={70} height={v * 20} fill={c} stroke="#a8801f" strokeWidth="1.6" />
      <text x={205 + i * 150} y={Y(v) - 8} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">{v}</text>
      <text x={205 + i * 150} y={Y(0) + 20} textAnchor="middle" fill={ink} fontSize="12">{n}</text></g>)}
    <text x={40} y={150} fill={ink} fontSize="12" transform="rotate(-90 40 150)" textAnchor="middle">yield (tonnes)</text>
  </Diagram>
}

// ---------- Lesson 50: fossils and classification ----------
const rock = ['#efe3cf', '#e5d4b6', '#dac59f', '#cfb58b', '#c3a77c'], rockLine = '#a88d63', fossilInk = '#6f5636'
function LeafFossil({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 22} ${y + 6}C${x - 10} ${y - 14} ${x + 14} ${y - 14} ${x + 24} ${y}C${x + 10} ${y + 12} ${x - 10} ${y + 14} ${x - 22} ${y + 6}Z`} fill="#b89a6c" stroke={fossilInk} strokeWidth="1.2" />
    <path d={`M${x - 22} ${y + 6}L${x + 24} ${y}M${x - 6} ${y + 4}l6 -9M${x + 6} ${y + 2}l6 -8M${x - 4} ${y + 4}l6 7M${x + 8} ${y + 2}l6 6`} stroke={fossilInk} strokeWidth="1" fill="none" /></g>
}
function FishFossil({ x, y }: { x: number; y: number }) {
  return <g stroke={fossilInk} strokeWidth="1.4" fill="none"><path d={`M${x - 26} ${y}H${x + 20}`} />{[-18, -10, -2, 6, 14].map(d => <path key={d} d={`M${x + d} ${y - 8}V${y + 8}`} />)}
    <circle cx={x + 24} cy={y} r="5" fill="#b89a6c" /><path d={`M${x - 26} ${y}l-8 -8v16z`} fill="#b89a6c" /></g>
}
function Trilobite({ x, y }: { x: number; y: number }) {
  return <g><ellipse cx={x} cy={y} rx={12} ry={17} fill="#b89a6c" stroke={fossilInk} strokeWidth="1.2" />
    {[-9, -4, 1, 6, 11].map(d => <path key={d} d={`M${x - 11} ${y + d}H${x + 11}`} stroke={fossilInk} strokeWidth="1" />)}<path d={`M${x - 4} ${y - 16}V${y + 15}M${x + 4} ${y - 16}V${y + 15}`} stroke={fossilInk} strokeWidth="1" /></g>
}
function RockColumn({ focus }: { focus: string }) {
  const gaps = focus === 'evolve-fossil-gaps', x0 = 150, w = 240, top = 40, h = 40
  return <Diagram title="A cross-section of rock layers, youngest at the top and oldest at the bottom. From the top down: a fossil leaf, a fossil fish, an ammonite and a trilobite. The lowest layer has question marks: early organisms had soft bodies and left few fossils.">
    {rock.map((c, i) => <rect key={c} x={x0} y={top + i * h} width={w} height={h} fill={c} stroke={rockLine} strokeWidth="1.2" />)}
    <g opacity={gaps ? faded : 1}><LeafFossil x={x0 + 70} y={top + 20} /><FishFossil x={x0 + 160} y={top + 60} /><Ammonite x={x0 + 90} y={top + 100} r={13} /><Trilobite x={x0 + 170} y={top + 140} /></g>
    <g opacity={gaps ? 1 : faded}>{[70, 130, 190].map(dx => <text key={dx} x={x0 + dx} y={top + 188} textAnchor="middle" fill={gene} fontSize="20" fontWeight="700">?</text>)}
      <path d={`M${x0 + 206} ${top + 80}l14 12l-10 12l16 14`} stroke={fossilInk} strokeWidth="2" fill="none" /></g>
    <g opacity={gaps ? faded : 1}><Arrow x1={x0 + w + 30} y1={top + 190} x2={x0 + w + 30} y2={top + 10} colour={ink} width={2} />
      <text x={x0 + w + 44} y={top + 16} fill={ink} fontSize="12">younger</text><text x={x0 + w + 44} y={top + 194} fill={ink} fontSize="12">older</text></g>
    <text x={x0 - 14} y={top + 24} textAnchor="end" fill={ink} fontSize="12">fossils</text>
    <text x={x0 - 14} y={top + 184} textAnchor="end" fill={gaps ? gene : ink} fontSize="12" fontWeight={gaps ? 700 : 500}>soft bodies:</text>
    <text x={x0 - 14} y={top + 199} textAnchor="end" fill={gaps ? gene : ink} fontSize="12" fontWeight={gaps ? 700 : 500}>few fossils</text>
    <Caption x={270} y={280} lines={[gaps ? 'the fossil record has gaps: nobody can be sure how life began' : 'older rock is lower down, so it holds older fossils']} size={13} strong />
  </Diagram>
}
function Footprint({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} fill="#a88d63" stroke={fossilInk} strokeWidth="1.2">
    <path d="M-10 14C-14 2 -8 -6 0 -6C8 -6 14 2 10 14C6 20 -6 20 -10 14Z" />
    <path d="M-6 -6L-16 -28L-8 -8Z" /><path d="M-2 -8L0 -34L4 -8Z" /><path d="M6 -6L16 -28L8 -8Z" /></g>
}
function Amber({ x, y }: { x: number; y: number }) {
  return <g><path d={blob(x, y, 52, 40, 9, .14)} fill="#f2b64a" stroke="#b9791c" strokeWidth="2" opacity=".95" />
    <path d={blob(x - 18, y - 18, 12, 6, 4, .1)} fill="#fbe0a0" opacity=".7" />
    <g stroke="#3b2a20" strokeWidth="1.4"><ellipse cx={x} cy={y + 2} rx={10} ry={5} fill="#5a3f22" /><circle cx={x + 12} cy={y + 1} r="4" fill="#5a3f22" />
      {[-6, 0, 6].map(d => <path key={d} d={`M${x + d} ${y + 5}l-4 10M${x + d} ${y - 1}l-4 -10`} fill="none" />)}
      <path d={`M${x - 4} ${y - 2}q-12 -18 -22 -8M${x - 2} ${y - 2}q-4 -20 -18 -18`} fill="#e7eef3" fillOpacity=".7" /></g></g>
}
function FossilScene({ focus }: { focus: string }) {
  const step = ['minerals', 'cast', 'decay'].indexOf(focus.replace('evolve-fossil-', ''))
  return <Diagram title="Three ways fossils form. Replaced by minerals: an ammonite shell in layers of rock. Casts and impressions: a three-toed dinosaur footprint in rock that was once soft mud. No decay: an insect kept whole in amber.">
    {PANELS.map(({ x, w }, i) => <g key={x} opacity={step === i ? 1 : faded}><rect x={x} y={4} width={w} height={292} rx="12" fill="#fbfdfc" stroke="#d6e3e9" strokeWidth="1.4" />
      <text x={x + w / 2} y={30} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">{['replaced by minerals', 'casts and impressions', 'no decay'][i]}</text></g>)}
    <g opacity={step === 0 ? 1 : faded}>{rock.slice(0, 4).map((c, i) => <rect key={c} x={24} y={60 + i * 40} width={136} height={40} fill={c} stroke={rockLine} strokeWidth="1.2" />)}
      <Ammonite x={92} y={160} r={30} /><Caption x={92} y={242} lines={['a shell slowly', 'turned to rock']} /></g>
    <g opacity={step === 1 ? 1 : faded}><rect x={202} y={60} width={136} height={160} rx="8" fill={rock[2]} stroke={rockLine} strokeWidth="1.2" />
      <Footprint x={246} y={176} s={1.1} /><Footprint x={296} y={110} s={1.1} /><Caption x={270} y={242} lines={['a footprint pressed', 'into mud, now rock']} /></g>
    <g opacity={step === 2 ? 1 : faded}><Amber x={448} y={140} /><Caption x={448} y={242} lines={['an insect in amber:', 'no decay']} /></g>
  </Diagram>
}
function Mushroom({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-7 0V22H7V0Z" fill="#f3e6cf" stroke="#9c8450" strokeWidth="1.4" />
    <path d="M-26 2C-26 -24 26 -24 26 2Z" fill="#c8505a" stroke="#8e2f3a" strokeWidth="1.4" />{[[-12, -8], [4, -12], [14, -4]].map(([dx, dy], i) => <circle key={i} cx={dx} cy={dy} r="3" fill="white" />)}</g>
}
const KINGDOMS = ['animals', 'plants', 'fungi', 'protists', 'prokaryotes']
function KingdomIcon({ i, x, y }: { i: number; x: number; y: number }) {
  if (i === 0) return <Dog x={x} y={y} s={1.1} />
  if (i === 1) return <g transform={`translate(${x} ${y}) scale(.9) translate(${-x} ${-y})`}><Flower x={x} ground={y + 36} top={y - 20} /></g>
  if (i === 2) return <Mushroom x={x} y={y} s={1.1} />
  if (i === 3) return <g transform={`translate(${x} ${y}) scale(.7) translate(${-x} ${-y})`}><Protist cx={x} cy={y} /></g>
  return <Bacterium cx={x - 6} cy={y} length={48} thick={22} seed={3} />
}
function KingdomsScene({ focus }: { focus: string }) {
  const features = focus === 'evolve-class-features'
  return <Diagram title="Five boxes for the five kingdoms: animals, shown by a dog; plants, a flower; fungi, a mushroom; protists, a single cell with a nucleus; and prokaryotes, a bacterium with no nucleus.">
    {KINGDOMS.map((k, i) => { const x = 6 + i * 106, cx = x + 50
      return <g key={k}><rect x={x} y={40} width={100} height={170} rx="12" fill="#fbfdfc" stroke="#d6e3e9" strokeWidth="1.4" />
        <text x={cx} y={64} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">{k}</text><KingdomIcon i={i} x={cx} y={130} />
        {i >= 3 && <Caption x={cx} y={184} lines={i === 3 ? ['one cell,', 'has a nucleus'] : ['one cell,', 'no nucleus']} size={11} />}</g> })}
    <text x={270} y={24} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">the five kingdoms</text>
    <Caption x={270} y={246} lines={features ? ['sorted by features you can see, such as legs or leaves,', 'and by structures inside cells'] : ['the biggest groups of living things']} size={13} strong={features} />
  </Diagram>
}
const LEVELS: Array<[string, string]> = [['kingdom', 'animals'], ['phylum', 'chordates'], ['class', 'mammals'], ['order', 'primates'], ['family', 'great apes'], ['genus', 'Homo'], ['species', 'sapiens']]
function LevelsScene({ focus }: { focus: string }) {
  const binomial = focus === 'evolve-class-binomial'
  return <Diagram title="Seven levels of classification as bars that get narrower from top to bottom: kingdom, phylum, class, order, family, genus and species. Humans are shown as an example: animals, chordates, mammals, primates, great apes, genus Homo, species sapiens. Human's two-part name is Homo sapiens.">
    {LEVELS.map(([lvl, eg], i) => { const w = 380 - i * 36, y = 18 + i * 34, lit = !binomial || i >= 5, col = binomial && i >= 5 ? gene : ink
      return <g key={lvl} opacity={lit ? 1 : faded}><rect x={200 - w / 2} y={y} width={w} height={28} rx="8" fill={binomial && i >= 5 ? geneFill : '#eef4f7'} stroke={col} strokeWidth="1.5" />
        <text x={200 - w / 2 + 12} y={y + 19} fill={col} fontSize="13" fontWeight="700">{lvl}</text>
        <text x={200 + w / 2 - 12} y={y + 19} textAnchor="end" fill={col} fontSize="12" fontStyle={i >= 5 ? 'italic' : 'normal'}>{eg}</text></g> })}
    <Arrow x1={410} y1={24} x2={410} y2={250} colour={muted} width={2} /><Caption x={470} y={124} lines={['smaller', 'groups,', 'more alike']} />
    {binomial ? <Caption x={270} y={284} lines={['two-part name: Homo sapiens (genus, then species)']} colour={gene} size={13} strong />
      : <Caption x={200} y={284} lines={['example: humans']} size={12} />}
  </Diagram>
}
function ChangeScene() {
  return <Diagram title="Left: the old system of five kingdoms. An arrow labelled better microscopes and chemical tests points right to the new system of three domains: Archaea, Bacteria and Eukaryota.">
    <text x={100} y={36} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">five kingdoms</text>
    {KINGDOMS.map((k, i) => <Chip key={k} x={100} y={70 + i * 34} w={150} text={k} colour={muted} />)}
    <Arrow x1={196} y1={140} x2={330} y2={140} colour={ink} width={2.6} />
    <Caption x={263} y={100} lines={['better microscopes', 'and chemical tests']} strong />
    <text x={440} y={36} textAnchor="middle" fill={gene} fontSize="14" fontWeight="700">three domains</text>
    {['Archaea', 'Bacteria', 'Eukaryota'].map((d, i) => <Chip key={d} x={440} y={104 + i * 34} w={150} text={d} colour={gene} />)}
    <Caption x={270} y={276} lines={['some organisms were less closely related than people thought']} size={13} />
  </Diagram>
}
function HotSpring({ x, y }: { x: number; y: number }) {
  return <g><ellipse cx={x} cy={y} rx={52} ry={14} fill="#bfe1f0" stroke={P.water} strokeWidth="1.6" />
    {[-20, 0, 20].map(d => <path key={d} d={`M${x + d} ${y - 14}q-8 -10 0 -20t0 -20`} stroke="#9aa9b4" strokeWidth="2" fill="none" strokeLinecap="round" />)}</g>
}
function DomainsScene({ focus }: { focus: string }) {
  const euk = focus === 'evolve-class-eukaryota'
  return <Diagram title="Three domains. Archaea: simple cells with no nucleus, first found in extreme places such as hot springs. Bacteria: true bacteria. Eukaryota: cells with a nucleus, including animals, plants, fungi and protists.">
    {PANELS.map(({ x, w }, i) => <g key={x} opacity={!euk || i === 2 ? 1 : faded}><rect x={x} y={4} width={w} height={292} rx="12" fill="#fbfdfc" stroke="#d6e3e9" strokeWidth="1.4" />
      <text x={x + w / 2} y={30} textAnchor="middle" fill={gene} fontSize="15" fontWeight="700">{['Archaea', 'Bacteria', 'Eukaryota'][i]}</text></g>)}
    <g opacity={euk ? faded : 1}><HotSpring x={92} y={200} />{([[64, 90, 20], [110, 110, -30], [80, 136, 70]] as Array<[number, number, number]>).map(([x, y, a], i) => <g key={i} transform={`rotate(${a} ${x} ${y})`}><ellipse cx={x} cy={y} rx={16} ry={9} fill="#e8dcf4" stroke="#7e5aa8" strokeWidth="1.6" /></g>)}
      <Caption x={92} y={250} lines={['no nucleus; first found', 'in extreme places']} /></g>
    <g opacity={euk ? faded : 1}><Bacterium cx={270} cy={120} length={90} thick={36} seed={4} /><Caption x={270} y={250} lines={['true bacteria:', 'no nucleus']} /></g>
    <g><Dog x={410} y={86} s={.8} /><Mushroom x={486} y={92} s={.9} /><g transform="translate(410 170) scale(.6) translate(-410 -170)"><Flower x={410} ground={214} top={150} /></g>
      <g transform="translate(486 170) scale(.55) translate(-486 -170)"><Protist cx={486} cy={170} /></g><Caption x={448} y={250} lines={['cells with a nucleus:', 'animals, plants, fungi, protists']} /></g>
  </Diagram>
}
type SeaKind = 'shark' | 'croc' | 'whale' | 'dolphin'
function SeaAnimal({ x, y, kind }: { x: number; y: number; kind: SeaKind }) {
  const t = `translate(${x} ${y})`
  if (kind === 'shark') return <g transform={t} stroke="#5f7180" strokeWidth="1.4"><path d="M-38 0L-52 -18L-46 0L-52 16Z" fill="#9aa9b4" /><path d="M-6 -10L4 -28L12 -9Z" fill="#9aa9b4" />
    <path d="M-40 0C-26 -13 10 -14 34 -4L44 1L34 5C10 13 -26 11 -40 0Z" fill="#b7c3cc" /><path d="M2 6l-8 12l16 -8z" fill="#9aa9b4" /><circle cx={28} cy={-2} r="1.8" fill="#1d252c" stroke="none" />
    <path d="M14 -4v8M18 -4v8" strokeWidth="1" /></g>
  if (kind === 'dolphin') return <g transform={t} stroke="#4f86b8" strokeWidth="1.4"><path d="M-38 0L-50 -11L-46 0L-50 11Z" fill="#8fb4de" /><path d="M-6 -11Q0 -26 10 -10Z" fill="#8fb4de" />
    <path d="M-40 0C-24 -15 16 -15 28 -5L46 -2L46 2L28 5C16 12 -24 10 -40 0Z" fill="#a9c8e8" /><path d="M6 6l-10 10l14 -6z" fill="#8fb4de" /><circle cx={24} cy={-3} r="1.8" fill="#1d252c" stroke="none" /></g>
  if (kind === 'whale') return <g transform={t} stroke="#3a4f6a" strokeWidth="1.4"><path d="M-44 0L-58 -12L-52 0L-58 12Z" fill="#5a7a9c" />
    <path d="M-46 2C-42 -20 34 -22 48 -2C44 12 -22 16 -46 2Z" fill="#6d8db0" /><path d="M-8 -16L0 -24L4 -16Z" fill="#5a7a9c" /><path d="M20 6q12 2 26 -4" fill="none" /><circle cx={32} cy={-6} r="2" fill="#1d252c" stroke="none" /></g>
  return <g transform={t} stroke="#4f7a35" strokeWidth="1.4"><path d="M-10 6l-6 12M8 6l6 12M-26 4l-6 10" fill="none" strokeWidth="3" strokeLinecap="round" />
    <path d="M-56 2C-40 -6 16 -9 30 -5L50 -3L50 3L30 5C16 10 -40 8 -56 2Z" fill="#8fb86b" />{[-30, -20, -10, 0, 10].map(d => <path key={d} d={`M${d} -7l4 -5l4 5`} fill="#8fb86b" />)}<circle cx={30} cy={-4} r="1.8" fill="#1d252c" stroke="none" /></g>
}
const TREE: Array<{ kind: SeaKind; name: string; x: number }> = [{ kind: 'shark', name: 'shark', x: 80 }, { kind: 'croc', name: 'crocodile', x: 200 }, { kind: 'whale', name: 'whale', x: 330 }, { kind: 'dolphin', name: 'dolphin', x: 460 }]
function TreeScene({ focus, assessment = false, question = false }: { focus: string; assessment?: boolean; question?: boolean }) {
  const ancestor = focus === 'evolve-tree-ancestor', leafY = 92
  const A: Pt = [395, 150], B: Pt = [298, 200], R: Pt = [190, 250]
  const hi = (on: boolean) => ancestor && on ? gene : ink
  return <Diagram title={question ? (assessment ? 'An evolutionary tree with four numbered animals at the tips of its branches. Branches join at common ancestors lower down; the lowest point is the oldest common ancestor.' : 'An evolutionary tree: a shark (1), a crocodile (2), a whale (3) and a dolphin (4). The whale and dolphin branches join most recently.') : 'An evolutionary tree of a shark, a crocodile, a whale and a dolphin. The whale and dolphin branches join at a recent common ancestor. The shark branch joins the others only at the oldest common ancestor, at the bottom.'}>
    {TREE.map((a, i) => <g key={a.kind}><SeaAnimal x={a.x} y={46} kind={a.kind} />
      {question ? <Badge n={i + 1} x={a.x} y={leafY - 10} /> : <text x={a.x} y={leafY - 6} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">{a.name}</text>}</g>)}
    <g strokeWidth="3" strokeLinecap="round" fill="none">
      <path d={`M330 ${leafY + 6}L${A[0]} ${A[1]}L460 ${leafY + 6}`} stroke={hi(true)} />
      <path d={`M200 ${leafY + 6}L${B[0]} ${B[1]}L${A[0]} ${A[1]}`} stroke={ink} />
      <path d={`M80 ${leafY + 6}L${R[0]} ${R[1]}L${B[0]} ${B[1]}`} stroke={ancestor ? muted : ink} />
      <path d={`M${R[0]} ${R[1]}V${R[1] + 22}`} stroke={ancestor ? muted : ink} />
    </g>
    {[A, B, R].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6" fill={i === 0 && ancestor ? gene : 'white'} stroke={i === 0 && ancestor ? gene : ink} strokeWidth="2" />)}
    {!question && <g>
      <text x={A[0] + 14} y={A[1] + 18} fill={hi(true)} fontSize="12" fontWeight="700"><tspan x={A[0] + 14}>recent common</tspan><tspan x={A[0] + 14} dy="15">ancestor</tspan></text>
      <text x={R[0] + 14} y={R[1] + 20} fill={ink} fontSize="12" fontWeight={ancestor ? 700 : 500}>oldest common ancestor</text>
      <Arrow x1={24} y1={270} x2={24} y2={70} colour={muted} width={1.8} /><text x={34} y={272} fill={muted} fontSize="11">past</text><text x={34} y={78} fill={muted} fontSize="11">now</text>
    </g>}
    {question && <Arrow x1={24} y1={270} x2={24} y2={70} colour={muted} width={1.8} />}
  </Diagram>
}
const CATS: Array<[string, string[]]> = [['lion', ['Felidae', 'Panthera', 'leo']], ['tiger', ['Felidae', 'Panthera', 'tigris']], ['house cat', ['Felidae', 'Felis', 'catus']]]
function ClassTable() {
  const cols = [150, 300, 450]
  return <Diagram title="A table classifying three cats. Lion: family Felidae, genus Panthera, species leo. Tiger: family Felidae, genus Panthera, species tigris. House cat: family Felidae, genus Felis, species catus. All three are in the kingdom animals and the class mammals.">
    <text x={20} y={26} fill={ink} fontSize="14" fontWeight="600">How three cats are classified</text>
    <rect x={20} y={40} width={500} height={200} rx="10" fill="#fbfdfc" stroke="#d6e3e9" strokeWidth="1.4" />
    {CATS.map(([n], i) => <text key={n} x={cols[i]} y={66} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">{n}</text>)}
    {['kingdom', 'class', 'family', 'genus', 'species'].map((lvl, r) => { const y = 102 + r * 30
      return <g key={lvl}><path d={`M28 ${y - 20}H512`} stroke="#e3ebf0" /><text x={36} y={y} fill={muted} fontSize="12" fontWeight="700">{lvl}</text>
        {CATS.map(([n, v], i) => <text key={n} x={cols[i]} y={y} textAnchor="middle" fill={ink} fontSize="13" fontStyle={r >= 3 ? 'italic' : 'normal'}>{r === 0 ? 'animals' : r === 1 ? 'mammals' : v[r - 2]}</text>)}</g> })}
    <Caption x={270} y={270} lines={['same genus = more closely related than same family only']} size={12} />
  </Diagram>
}

export function EvolutionVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus === 'evolve-var-people') return <PeopleScene />
  if (focus === 'evolve-var-question') return <VariationQuestion assessment={assessment} />
  if (focus === 'evolve-var-data') return <VariationData />
  if (focus.startsWith('evolve-var-')) return <PanelsScene focus={focus} />
  if (['evolve-mut-code', 'evolve-mut-change', 'evolve-mut-variant'].includes(focus)) return <MutationScene focus={focus} />
  if (focus.startsWith('evolve-mut-')) return <OutcomeScene focus={focus} />
  if (focus === 'evolve-ns-data') return <SelectionData />
  if (focus.startsWith('evolve-ns-')) return <SelectionScene focus={focus} />
  if (focus.startsWith('evolve-evid-')) return <EvidenceScene focus={focus} />
  if (focus.startsWith('evolve-spec-')) return <SpeciationScene focus={focus} />
  if (focus === 'evolve-ext-question') return <ExtinctionQuestion assessment={assessment} />
  if (focus.startsWith('evolve-ext-')) return <ExtinctionScene focus={focus} />
  if (focus === 'evolve-res-question') return <ResistanceQuestion assessment={assessment} />
  if (focus === 'evolve-res-data') return <ResistanceData />
  if (focus.startsWith('evolve-res-')) return <ResistanceScene focus={focus} />
  if (focus.startsWith('evolve-prob-')) return <ProblemScene focus={focus} />
  if (focus.startsWith('evolve-slow-')) return <SlowScene focus={focus} />
  if (focus === 'evolve-breed-uses') return <BreedUses />
  if (focus.startsWith('evolve-breed-')) return <BreedScene focus={focus} />
  if (focus.startsWith('evolve-inbred-')) return <InbredScene focus={focus} />
  if (focus === 'evolve-ge-question') return <InsulinScene focus={focus} question assessment={assessment} />
  if (['evolve-ge-herbicide', 'evolve-ge-yield', 'evolve-ge-therapy'].includes(focus)) return <GeUses focus={focus} />
  if (focus.startsWith('evolve-ge-')) return <InsulinScene focus={focus} />
  if (focus === 'evolve-gm-data') return <GmData />
  if (focus.startsWith('evolve-gm-')) return <WeighScene focus={focus} />
  if (['evolve-fossil-intro', 'evolve-fossil-gaps'].includes(focus)) return <RockColumn focus={focus} />
  if (focus.startsWith('evolve-fossil-')) return <FossilScene focus={focus} />
  if (['evolve-class-features', 'evolve-class-kingdoms'].includes(focus)) return <KingdomsScene focus={focus} />
  if (['evolve-class-levels', 'evolve-class-binomial'].includes(focus)) return <LevelsScene focus={focus} />
  if (focus === 'evolve-class-new') return <ChangeScene />
  if (focus === 'evolve-class-question') return <ClassTable />
  if (focus.startsWith('evolve-class-')) return <DomainsScene focus={focus} />
  if (focus === 'evolve-tree-question') return <TreeScene focus={focus} question assessment={assessment} />
  if (focus.startsWith('evolve-tree-')) return <TreeScene focus={focus} />
  return <PeopleScene />
}
