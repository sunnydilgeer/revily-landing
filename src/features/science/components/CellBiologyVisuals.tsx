import { useId } from 'react'
import { DivisionVisual } from './DivisionVisuals'
import { TransportVisual } from './TransportVisuals'
import { OrganisationVisual } from './OrganisationVisuals'
import { CirculationVisual } from './anatomy/CirculationVisuals'
import { HealthDiseaseVisual } from './HealthDiseaseVisuals'
import { PlantOrganisationVisual } from './PlantOrganisationVisuals'

const ink = '#37627b', blue = '#54afd2', purple = '#a68bd0', yellow = '#efc75d', green = '#68ae92'
const descriptions: Record<string, string> = {
  sperm: 'A sperm-shaped cell with a head, small oval structures in a midpiece and a long tail.',
  nerve: 'One cell with a branched body, a long fibre and branched terminal ends.',
  muscle: 'An elongated fibre with repeated stripes and small oval structures.',
  root: 'One root hair cell: a long hair-like extension of the same cell reaches between irregular soil particles surrounded by soil solution. A cell wall surrounds the cell with the cell membrane just inside it. Inside are a large vacuole, a nucleus near the base of the hair and mitochondria; there are no chloroplasts. Arrows show water and mineral ions entering the hair.',
  xylem: 'A vertical xylem vessel made of three dead cells joined end to end. There are no end walls, only small rims where the cells join, so the hollow centre forms one continuous tube. The walls are thickened with lignin, seen as brown rings and spirals. An arrow shows water and mineral ions moving up.',
  phloem: 'A vertical phloem tube made of three long, thin-walled living cells joined end to end, with cytoplasm lining each wall. Where the cells join, the end walls have several pores, forming sieve plates. Dots of dissolved sugar in sap pass through the pores, shown by a dashed arrow.',
}
const keys: Record<string, string[]> = {
  sperm: ['Head: genetic information and enzymes', 'Midpiece: many mitochondria', 'Tail: swimming'],
  nerve: ['Branched body: connections', 'Long axon: carries impulses', 'Branched ends: connections'],
  muscle: ['Contracting fibre: shortens', 'Mitochondria: respiration'],
  root: ['Root hair: long extension gives a large surface area', 'Cell wall: strengthens the cell', 'Cell membrane: just inside the wall; controls what enters', 'Nucleus: genetic material controls the cell', 'Permanent vacuole: filled with cell sap', 'Mitochondria: respiration releases energy for active transport'],
  xylem: ['Hollow route, no end walls', 'Walls strengthened by lignin'],
  phloem: ['Elongated living cells', 'Pores in end walls'],
}
function NumberPointer({ n, x, y, toX, toY }: { n: number; x: number; y: number; toX: number; toY: number }) {
  return <g><path d={`M${x} ${y} L${toX} ${toY}`} stroke={ink} fill="none" /><circle cx={x} cy={y} r="12" fill="white" stroke={ink} /><text x={x} y={y + 4} textAnchor="middle" fill={ink} fontSize="13">{n}</text><circle cx={toX} cy={toY} r="2" fill={ink} /></g>
}

/* Whole cell outline: body plus a long, slightly curving hair that tapers to a rounded tip. */
const rootCellPath = 'M50 76C96 70 150 70 180 76C186 78 184 86 196 87C236 86 272 64 318 62C350 60 372 55 388 51Q406 47 408 63Q410 79 392 83C374 88 352 94 320 96C276 98 244 120 200 123C188 124 189 132 189 142C190 158 189 170 186 180C140 186 90 184 48 180C43 142 43 110 50 76Z'
/* Irregular soil particles, each wrapped in a film of soil solution; placed to leave clear corridors for the uptake arrows. */
const soil: [number, number, number, number][] = [[214, 62, 11, 10], [246, 50, 13, -12], [276, 42, 12, 25], [322, 38, 14, 5], [356, 28, 12, -20], [390, 32, 10, 14], [424, 32, 9, 0], [428, 66, 8, 30],
  [236, 131, 13, -6], [258, 160, 12, 18], [310, 119, 13, 8], [316, 154, 11, -14], [384, 108, 12, 22], [412, 136, 12, -8], [386, 150, 9, 4], [424, 100, 9, 12]]
function blob(x: number, y: number, r: number, rot: number) {
  const pts = [1, .82, 1.08, .9, 1.02, .78, .95].map((k, i) => { const a = (i / 7) * Math.PI * 2 + rot * Math.PI / 180; return [x + Math.cos(a) * r * k, y + Math.sin(a) * r * k * .85] })
  const mid = (a: number[], b: number[]) => `${((a[0] + b[0]) / 2).toFixed(1)} ${((a[1] + b[1]) / 2).toFixed(1)}`
  return `M${mid(pts[pts.length - 1], pts[0])}` + pts.map((p, i) => `Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${mid(p, pts[(i + 1) % pts.length])}`).join('') + 'Z'
}
function RootHairCell({ uid, assessment }: { uid: string; assessment: boolean }) {
  const r = (n: string) => `${uid}-${n}`, clip = `url(#${r('cell')})`
  const water = '#2f86b6', ion = '#b98512', text = { fill: ink, fontSize: 12 }
  return <g strokeLinejoin="round" strokeLinecap="round">
    <defs>
      <clipPath id={r('cell')}><path d={rootCellPath}/></clipPath>
      <marker id={r('water')} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10L2 5Z" fill={water}/></marker>
      <marker id={r('ion')} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10L2 5Z" fill={ion}/></marker>
    </defs>
    {/* Soil: a wash of soil solution around the hair, a film on each particle, then the particles */}
    <path d="M204 72C220 30 262 16 320 14C380 12 430 12 436 30C440 80 440 130 434 166C380 176 300 178 244 172C214 168 204 140 204 72Z" fill="#f1f8fb"/>
    <g fill="#e3f2f9" stroke="#e3f2f9" strokeWidth="9">{soil.map(([x, y, rr, rot], i) => <path key={i} d={blob(x, y, rr, rot)}/>)}</g>
    <g fill="#dcc6a2" stroke="#a88c63" strokeWidth="1.4">{soil.map(([x, y, rr, rot], i) => <path key={i} d={blob(x, y, rr, rot)}/>)}</g>

    {/* Cell: cytoplasm, then (clipped inside the outline) membrane band, narrow gap, and cell wall */}
    <path d={rootCellPath} fill="#f4f8ea"/>
    <g clipPath={clip} fill="none">
      <path d={rootCellPath} stroke="#46606e" strokeWidth="17"/>
      <path d={rootCellPath} stroke="#f4f8ea" strokeWidth="14"/>
      <path d={rootCellPath} stroke={green} strokeWidth="11"/>
    </g>
    <path d={rootCellPath} fill="none" stroke="#3f7f63" strokeWidth="1.3"/>

    {/* Contents: large permanent vacuole, nucleus near the hair base, mitochondria; no chloroplasts */}
    <path d="M67 103C92 94 148 96 170 104C177 124 175 150 167 162C130 169 92 168 68 162C60 142 60 121 67 103Z" fill="#e7e2f5" stroke="#9c86c6" strokeWidth="1.2"/>
    <ellipse cx="213" cy="103" rx="11" ry="6.5" fill={purple} stroke="#7a62a8" strokeWidth="1"/>
    {[[120, 88, -4], [262, 90, -22], [300, 82, -8], [392, 64, -12]].map(([x, y, rot]) => <g key={x} transform={`translate(${x} ${y}) rotate(${rot})`}><ellipse rx="7" ry="3.4" fill={yellow} stroke="#9a7a2a" strokeWidth=".9"/><path d="M-4 0Q-2-2 0 0T4 0" fill="none" stroke="#9a7a2a" strokeWidth=".7"/></g>)}

    {/* Uptake: water (solid blue) vs mineral ions (dashed amber, squares fewer outside than inside) */}
    <path d="M282 168V96" stroke={water} strokeWidth="2.6" markerEnd={`url(#${r('water')})`}/>
    {[[344, 152], [358, 138], [340, 126]].map(([x, y]) => <rect key={x} x={x - 3.5} y={y - 3.5} width="7" height="7" fill={yellow} stroke={ink} strokeWidth=".8"/>)}
    {[[328, 80], [339, 73], [349, 80], [359, 73], [369, 78], [379, 70]].map(([x, y]) => <rect key={x} x={x - 3} y={y - 3} width="6" height="6" fill={yellow} stroke={ink} strokeWidth=".8"/>)}
    <path d="M350 164V92" stroke={ion} strokeWidth="2.6" strokeDasharray="6 4" markerEnd={`url(#${r('ion')})`}/>
    <text x="282" y="186" textAnchor="middle" {...text} fill={water} fontWeight="650">water</text>
    {!assessment && <text x="282" y="200" textAnchor="middle" {...text} fill={water}>(osmosis)</text>}
    <text x="316" y="186" {...text} fill="#8a620a" fontWeight="650">mineral ions</text>
    {!assessment && <text x="316" y="200" {...text} fill="#8a620a">(active transport)</text>}
    <text x="436" y="10" textAnchor="end" {...text} fontSize={11} fill="#7b6440">soil particles</text>
    <text x="436" y="174" textAnchor="end" {...text} fontSize={11} fill="#4d7f99">soil solution</text>

    {!assessment && <><NumberPointer n={1} x={298} y={14} toX={298} toY={72}/><NumberPointer n={2} x={20} y={44} toX={60} toY={76}/><NumberPointer n={3} x={20} y={196} toX={58} toY={173}/>
      <NumberPointer n={4} x={200} y={176} toX={211} toY={108}/><NumberPointer n={5} x={112} y={200} toX={112} toY={160}/><NumberPointer n={6} x={120} y={18} toX={120} toY={86}/></>}
  </g>
}

/* Xylem: dead, hollow vessel elements joined end to end with no end walls; lignin thickening seen as rings and spirals. */
function XylemVessel({ uid, assessment }: { uid: string; assessment: boolean }) {
  const r = (n: string) => `${uid}-${n}`, wall = '#b98a47', lig = '#8a6127', water = '#2f86b6'
  const joins = [72, 136]
  const spiral = Array.from({ length: 13 }, (_, i) => 16 + i * 13.5).map(y => `M198 ${y}Q220 ${y + 7} 242 ${y + 2}`).join('')
  return <g strokeLinejoin="round" strokeLinecap="round">
    <defs><marker id={r('w')} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10L2 5Z" fill={water}/></marker></defs>
    <path d="M186 6C184 70 188 130 186 194H254C256 130 252 70 254 6Z" fill="#eaf5fb"/>
    <path d={spiral} fill="none" stroke={lig} strokeOpacity=".45" strokeWidth="3"/>
    {[[184, 196], [242, 254]].map(([a, b], i) => <path key={i} d={`M${a} 6C${a - 2} 70 ${a + 2} 130 ${a} 194H${b}C${b + 2} 130 ${b - 2} 70 ${b} 6Z`} fill={wall} stroke={lig} strokeWidth="1.4"/>)}
    {joins.map(y => <g key={y} fill={lig}><path d={`M196 ${y - 4}Q203 ${y} 196 ${y + 4}Z`}/><path d={`M242 ${y - 4}Q235 ${y} 242 ${y + 4}Z`}/></g>)}
    {joins.map(y => <path key={y} d={`M180 ${y}H186M254 ${y}H260`} stroke={lig} strokeWidth="1.6"/>)}
    {[[212, 160], [228, 118], [214, 84], [230, 44]].map(([x, y], i) => <rect key={i} x={x - 3} y={y - 3} width="6" height="6" fill={yellow} stroke={ink} strokeWidth=".8"/>)}
    <path d="M220 176V24" stroke={water} strokeWidth="3" markerEnd={`url(#${r('w')})`}/>
    {!assessment && <>
      <text x="274" y="30" fill={water} fontSize="12" fontWeight="650">water + mineral ions</text><text x="274" y="44" fill={water} fontSize="12">move up the tube</text>
      <text x="274" y="104" fill={ink} fontSize="12">dead cells: no contents,</text><text x="274" y="118" fill={ink} fontSize="12">so the centre is hollow</text>
      <text x="274" y="160" fill={ink} fontSize="12">where two cells join</text>
      <path d="M272 156L244 138" stroke={ink}/><circle cx="244" cy="137" r="2" fill={ink}/>
      <NumberPointer n={1} x={120} y={136} toX={210} toY={136}/><NumberPointer n={2} x={120} y={60} toX={188} toY={60}/>
    </>}
  </g>
}
/* Phloem: elongated living sieve-tube cells (thin walls, cytoplasm lining, no nucleus drawn) joined by porous sieve plates. */
function PhloemTube({ uid, assessment }: { uid: string; assessment: boolean }) {
  const r = (n: string) => `${uid}-${n}`, wallC = '#4f9a74', sap = '#b98512'
  const plates = [70, 134]
  const cellShape = (y0: number, y1: number) => `M194 ${y0 + 3}C193 ${(y0 + y1) / 2} 195 ${(y0 + y1) / 2} 194 ${y1 - 3}H246C247 ${(y0 + y1) / 2} 245 ${(y0 + y1) / 2} 246 ${y0 + 3}Z`
  return <g strokeLinejoin="round" strokeLinecap="round">
    <defs><marker id={r('s')} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10L2 5Z" fill={sap}/></marker></defs>
    <path d="M188 6C186 70 190 130 188 194H252C254 130 250 70 252 6Z" fill="#e3f2e6" stroke={wallC} strokeWidth="5"/>
    {[[6, 70], [70, 134], [134, 194]].map(([a, b], i) => <path key={i} d={cellShape(a, b)} fill="#f5fbf1" stroke="#9fcfae" strokeWidth="3" strokeOpacity=".9"/>)}
    {[[202, 30], [238, 52], [204, 98], [236, 116], [202, 160], [238, 178]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="3" ry="1.8" fill="#9fcfae"/>)}
    {plates.map(y => <g key={y}>
      <rect x="190" y={y - 3} width="60" height="6" fill={wallC}/>
      {[200, 213, 227, 240].map(x => <rect key={x} x={x - 3} y={y - 3.5} width="6" height="7" fill="#f5fbf1"/>)}
    </g>)}
    {[[213, 40], [228, 58], [220, 84], [214, 110], [226, 150], [216, 172]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.6" fill={sap}/>)}
    <path d="M220 22V178" stroke={sap} strokeWidth="2.6" strokeDasharray="7 5" markerEnd={`url(#${r('s')})`}/>
    {!assessment && <>
      <text x="274" y="24" fill="#8a620a" fontSize="12" fontWeight="650">dissolved sugars in sap,</text><text x="274" y="38" fill="#8a620a" fontSize="12">e.g. from a leaf to a root</text>
      <text x="274" y="100" fill={ink} fontSize="12">living cells</text><text x="274" y="114" fill={ink} fontSize="12">(cytoplasm lines the wall)</text>
      <path d="M272 98L247 96" stroke={ink}/><circle cx="246" cy="96" r="2" fill={ink}/>
      <text x="274" y="160" fill={ink} fontSize="12">sap passes through</text><text x="274" y="174" fill={ink} fontSize="12">pores in the end wall</text>
      <NumberPointer n={1} x={120} y={36} toX={192} toY={36}/><NumberPointer n={2} x={120} y={134} toX={200} toY={134}/>
    </>}
  </g>
}
function SpecialisedCell({ focus, assessment }: { focus: string; assessment: boolean }) {
  const title = useId(), uid = title.replace(/[^a-zA-Z0-9_-]/g, '')
  return <div className="science-bio-model"><svg viewBox={focus === 'root' ? '0 0 440 212' : focus === 'xylem' || focus === 'phloem' ? '0 0 440 200' : '0 0 440 170'} role="img" aria-labelledby={title}><title id={title}>{(descriptions[focus]) + " Original schematic, not to scale."}</title>
    {focus === 'sperm' && <g><ellipse cx="100" cy="85" rx="44" ry="30" fill="#d9f1fb" stroke={ink} strokeWidth="2" /><ellipse cx="104" cy="85" rx="23" ry="19" fill={purple} /><path d="M62 70Q77 49 91 57" stroke={yellow} strokeWidth="7" fill="none" /><rect x="143" y="73" width="70" height="24" rx="10" fill="#fff3bf" stroke={ink} />{[154, 176, 198].map(x => <ellipse key={x} cx={x} cy="85" rx="7" ry="9" fill={yellow} stroke={ink} />)}<path d="M212 85Q249 43 285 85T386 85" fill="none" stroke={blue} strokeWidth="6" />{!assessment && <><NumberPointer n={1} x={62} y={28} toX={74} toY={61} /><NumberPointer n={2} x={179} y={135} toX={179} toY={89} /><NumberPointer n={3} x={351} y={32} toX={386} toY={85} /></>}</g>}
    {focus === 'nerve' && <g><path d="M103 58L79 82L103 109L126 87Z" fill="#d9f1fb" stroke={ink} strokeWidth="2" /><circle cx="103" cy="83" r="12" fill={purple} /><path d="M84 80L55 53L32 59M55 53L51 31M87 94L58 123L36 116M58 123L52 144M108 60L120 35L145 26M126 84L355 84L384 49L410 45M355 84L389 111L415 129M389 111L421 99" stroke={blue} strokeWidth="5" fill="none" />{!assessment && <><NumberPointer n={1} x={18} y={87} toX={57} toY={54} /><NumberPointer n={2} x={231} y={36} toX={231} toY={84} /><NumberPointer n={3} x={352} y={145} toX={390} toY={111} /></>}</g>}
    {focus === 'muscle' && <g><rect x="55" y="52" width="330" height="68" rx="28" fill="#f6e7ed" stroke={ink} strokeWidth="2" />{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${82 + i * 24} 56v60`} stroke="#d2a6bb" strokeWidth="5" />)}{[114, 211, 306].map(x => <ellipse key={x} cx={x} cy="88" rx="10" ry="6" fill={yellow} stroke={ink} />)}{!assessment && <><NumberPointer n={1} x={55} y={26} toX={82} toY={73} /><NumberPointer n={2} x={220} y={147} toX={211} toY={88} /></>}</g>}
    {focus === 'root' && <RootHairCell uid={uid} assessment={assessment}/>}
    {focus === 'xylem' && <XylemVessel uid={uid} assessment={assessment}/>}
    {focus === 'phloem' && <PhloemTube uid={uid} assessment={assessment}/>}
  </svg>{!assessment && <ol className="science-bio-key">{keys[focus].map(k => <li key={k}>{k}</li>)}</ol>}</div>
}

export function CellBiologyVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('plant-')) return <PlantOrganisationVisual focus={focus} assessment={assessment} />
  if (/^(?:lung|heart|vessel)-/.test(focus)) return <CirculationVisual focus={focus} assessment={assessment}/>
  if (/^(?:blood|cardio|health|risk|cancer)-/.test(focus)) return <HealthDiseaseVisual focus={focus} assessment={assessment}/>
  if (/^(?:epithelial$|(?:organisation|epithelial|stomach|digestive|enzyme|digestion|bile|food|lung|heart|vessel|breathing|blood-flow)-)/.test(focus)) return <OrganisationVisual focus={focus} assessment={assessment} />
  if (descriptions[focus]) return <SpecialisedCell focus={focus} assessment={assessment} />
  if (focus === 'specialisation') return <div className="science-bio-cards">{['Feature: long extension', 'Effect: more surface area', 'Job: absorb water and mineral ions'].map(s => <div key={s}>{s}</div>)}</div>
  if (focus === 'differentiate') return <div className="science-bio-cards"><div>Unspecialised cell</div><div>Develops structures suited to a job →</div><div>Specialised cell</div></div>
  if (['chromosomes','pairs','repair','therapeutic','trial'].includes(focus) || focus.startsWith('cycle') || focus.startsWith('stem-')) return <DivisionVisual focus={focus} assessment={assessment} />
  return <TransportVisual focus={focus} assessment={assessment} />
}
