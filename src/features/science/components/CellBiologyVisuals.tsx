import { useId } from 'react'
import { DivisionVisual } from './DivisionVisuals'
import { TransportVisual } from './TransportVisuals'
import { OrganisationVisual } from './OrganisationVisuals'

const ink = '#37627b', blue = '#54afd2', purple = '#a68bd0', yellow = '#efc75d', green = '#68ae92'
const descriptions: Record<string, string> = {
  sperm: 'A sperm-shaped cell with a head, small oval structures in a midpiece and a long tail.',
  nerve: 'One cell with a branched body, a long fibre and branched terminal ends.',
  muscle: 'An elongated fibre with repeated stripes and small oval structures.',
  root: 'A plant cell with a long narrow extension from its wall and membrane.',
  xylem: 'Two joined hollow vessel elements with thickened walls and an open central route.',
  phloem: 'Two elongated cells joined at an end wall with several pores.',
}
const keys: Record<string, string[]> = {
  sperm: ['Head: genetic information and enzymes', 'Midpiece: many mitochondria', 'Tail: swimming'],
  nerve: ['Branched body: connections', 'Long axon: carries impulses', 'Branched ends: connections'],
  muscle: ['Contracting fibre: shortens', 'Mitochondria: respiration'],
  root: ['Long extension: large surface area', 'Membrane inside the cell wall'],
  xylem: ['Hollow route, no end walls', 'Walls strengthened by lignin'],
  phloem: ['Elongated living cells', 'Pores in end walls'],
}
function NumberPointer({ n, x, y, toX, toY }: { n: number; x: number; y: number; toX: number; toY: number }) {
  return <g><path d={`M${x} ${y} L${toX} ${toY}`} stroke={ink} fill="none" /><circle cx={x} cy={y} r="12" fill="white" stroke={ink} /><text x={x} y={y + 4} textAnchor="middle" fill={ink} fontSize="13">{n}</text><circle cx={toX} cy={toY} r="2" fill={ink} /></g>
}
function SpecialisedCell({ focus, assessment }: { focus: string; assessment: boolean }) {
  const title = useId()
  return <div className="science-bio-model"><svg viewBox="0 0 440 170" role="img" aria-labelledby={title}><title id={title}>{(descriptions[focus]) + " Original schematic, not to scale."}</title>
    {focus === 'sperm' && <g><ellipse cx="100" cy="85" rx="44" ry="30" fill="#d9f1fb" stroke={ink} strokeWidth="2" /><ellipse cx="104" cy="85" rx="23" ry="19" fill={purple} /><path d="M62 70Q77 49 91 57" stroke={yellow} strokeWidth="7" fill="none" /><rect x="143" y="73" width="70" height="24" rx="10" fill="#fff3bf" stroke={ink} />{[154, 176, 198].map(x => <ellipse key={x} cx={x} cy="85" rx="7" ry="9" fill={yellow} stroke={ink} />)}<path d="M212 85Q249 43 285 85T386 85" fill="none" stroke={blue} strokeWidth="6" />{!assessment && <><NumberPointer n={1} x={62} y={28} toX={74} toY={61} /><NumberPointer n={2} x={179} y={135} toX={179} toY={89} /><NumberPointer n={3} x={351} y={32} toX={386} toY={85} /></>}</g>}
    {focus === 'nerve' && <g><path d="M103 58L79 82L103 109L126 87Z" fill="#d9f1fb" stroke={ink} strokeWidth="2" /><circle cx="103" cy="83" r="12" fill={purple} /><path d="M84 80L55 53L32 59M55 53L51 31M87 94L58 123L36 116M58 123L52 144M108 60L120 35L145 26M126 84L355 84L384 49L410 45M355 84L389 111L415 129M389 111L421 99" stroke={blue} strokeWidth="5" fill="none" />{!assessment && <><NumberPointer n={1} x={18} y={87} toX={57} toY={54} /><NumberPointer n={2} x={231} y={36} toX={231} toY={84} /><NumberPointer n={3} x={352} y={145} toX={390} toY={111} /></>}</g>}
    {focus === 'muscle' && <g><rect x="55" y="52" width="330" height="68" rx="28" fill="#f6e7ed" stroke={ink} strokeWidth="2" />{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${82 + i * 24} 56v60`} stroke="#d2a6bb" strokeWidth="5" />)}{[114, 211, 306].map(x => <ellipse key={x} cx={x} cy="88" rx="10" ry="6" fill={yellow} stroke={ink} />)}{!assessment && <><NumberPointer n={1} x={55} y={26} toX={82} toY={73} /><NumberPointer n={2} x={220} y={147} toX={211} toY={88} /></>}</g>}
    {focus === 'root' && <g><path d="M65 45H185V73L371 68Q399 84 371 99L185 94V129H65Z" fill="#dff4df" stroke={green} strokeWidth="8" /><path d="M70 50H180V78L372 74Q386 84 372 93L180 89V124H70Z" fill="#edf8df" stroke={ink} strokeWidth="1.5" /><rect x="87" y="60" width="73" height="54" rx="15" fill="#cfedee" /><ellipse cx="166" cy="109" rx="10" ry="9" fill={purple} />{!assessment && <><NumberPointer n={1} x={313} y={30} toX={313} toY={71} /><NumberPointer n={2} x={52} y={147} toX={70} toY={115} /></>}</g>}
    {focus === 'xylem' && <g><path d="M157 22V150M283 22V150" stroke="#c69750" strokeWidth="18" />{[36, 68, 100, 132].map(y => <g key={y}><path d={`M148 ${y}h20M272 ${y}h20`} stroke="#9e7435" strokeWidth="6" /></g>)}<rect x="170" y="22" width="100" height="128" fill="#dff3fd" />{!assessment && <><NumberPointer n={1} x={80} y={65} toX={218} toY={65} /><NumberPointer n={2} x={342} y={126} toX={282} toY={101} /></>}</g>}
    {focus === 'phloem' && <g><rect x="151" y="22" width="138" height="128" rx="7" fill="#e2f4e5" stroke={green} strokeWidth="5" /><rect x="165" y="32" width="111" height="108" rx="5" fill="#f4faf0" />{[151, 186, 221, 256].map(x => <path key={x} d={`M${x} 86h20`} stroke={green} strokeWidth="6" />)}{!assessment && <><NumberPointer n={1} x={84} y={40} toX={155} toY={46} /><NumberPointer n={2} x={347} y={125} toX={207} toY={86} /></>}</g>}
  </svg>{!assessment && <ol className="science-bio-key">{keys[focus].map((k, i) => <li key={k}><span aria-hidden="true">{i + 1}. </span>{k}</li>)}</ol>}</div>
}

export function CellBiologyVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (/^(?:epithelial$|(?:organisation|epithelial|stomach|digestive|enzyme|digestion|bile|food)-)/.test(focus)) return <OrganisationVisual focus={focus} assessment={assessment} />
  if (descriptions[focus]) return <SpecialisedCell focus={focus} assessment={assessment} />
  if (focus === 'specialisation') return <div className="science-bio-cards">{['Feature: long extension', 'Effect: more surface area', 'Job: absorb water and mineral ions'].map(s => <div key={s}>{s}</div>)}</div>
  if (focus === 'differentiate') return <div className="science-bio-cards"><div>Unspecialised cell</div><div>Develops structures suited to a job →</div><div>Specialised cell</div></div>
  if (['chromosomes','pairs','repair','therapeutic','trial'].includes(focus) || focus.startsWith('cycle') || focus.startsWith('stem-')) return <DivisionVisual focus={focus} assessment={assessment} />
  return <TransportVisual focus={focus} assessment={assessment} />
}
