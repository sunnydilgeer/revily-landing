import { useId } from 'react'
import { CellDiagramAnnotations, DiagramKey, type DiagramAnnotation } from './CellDiagramAnnotations'

const keys = {
  plant: [['membrane', 'Cell membrane'], ['cytoplasm', 'Cytoplasm'], ['nucleus', 'Nucleus'], ['mitochondria', 'Mitochondria'], ['ribosomes', 'Ribosomes'], ['wall', 'Cell wall'], ['vacuole', 'Permanent vacuole'], ['chloroplast', 'Chloroplasts']],
  bacterium: [['dna', 'DNA loop'], ['plasmids', 'Plasmids'], ['wall', 'Cell wall'], ['membrane', 'Cell membrane'], ['cytoplasm', 'Cytoplasm'], ['ribosomes', 'Ribosomes']],
}

const plantPositions = [[408, 89, 381, 104], [40, 111, 78, 115], [37, 166, 93, 157], [408, 193, 351, 167], [362, 285, 326, 249], [38, 41, 49, 78], [235, 136, 243, 168], [198, 16, 174, 53]]
const bacterialPositions = [[222, 70, 139, 147], [334, 252, 334, 164], [63, 52, 118, 76], [400, 71, 322, 85], [45, 255, 116, 185], [236, 255, 213, 205]]
const annotations = (type: 'plant' | 'bacterium'): DiagramAnnotation[] => keys[type].map(([id, label], index) => {
  const [x, y, targetX, targetY] = (type === 'plant' ? plantPositions : bacterialPositions)[index]
  return { id, label, number: index + 1, x, y, targetX, targetY }
})
type ModelProps = { focus?: string; onSelect?: (id: string) => void; partIds?: string[]; labelled?: boolean; selectablePartIds?: string[] }

export function PlantCellModel(props: ModelProps) { return <OtherCellModel {...props} type="plant" /> }
export function BacterialCellModel(props: ModelProps) { return <OtherCellModel {...props} type="bacterium" /> }

function OtherCellModel({ type, focus, onSelect, partIds, labelled = true, selectablePartIds }: ModelProps & { type: 'plant' | 'bacterium' }) {
  const id = useId().replace(/:/g, '')
  const opacity = (part: string) => !focus || focus === part ? 1 : .5
  const parts = annotations(type)
  const visibleIds = partIds || parts.map(part => part.id)
  return <figure className={`science-cell science-cell--${type}`}>
    <div className="science-cell__identity">{type === 'plant' ? 'Plant cell' : 'Bacterial cell'}</div>
    <div className="science-cell__drawing" role="img" aria-label={type === 'plant'
      ? 'Simplified typical photosynthesising plant cell, not to scale. A cellulose wall surrounds a membrane. Cytoplasm contains a nucleus, mitochondria, ribosomes and chloroplasts around a large permanent vacuole.'
      : 'Simplified bacterial cell, not to scale. A wall surrounds a membrane and cytoplasm with ribosomes, a closed loop of DNA and two example plasmids. No nucleus is shown.'}>
      <svg viewBox="0 0 440 310" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`${id}-mint`} x2="1" y2="1"><stop stopColor="#e1faf0" /><stop offset="1" stopColor="#95daca" /></linearGradient>
          <radialGradient id={`${id}-purple`}><stop stopColor="#dcc8f3" /><stop offset="1" stopColor="#a27bc9" /></radialGradient>
        </defs>
        {type === 'plant' ? <>
          <rect x="49" y="29" width="342" height="246" rx="26" fill="#e1edb3" stroke="#769342" strokeWidth={focus === 'wall' ? 12 : 9} opacity={opacity('wall')} />
          <rect x="59" y="39" width="322" height="226" rx="20" fill={`url(#${id}-mint)`} opacity={opacity('cytoplasm')} />
          <rect x="59" y="39" width="322" height="226" rx="20" fill="none" stroke="#279575" strokeWidth={focus === 'membrane' ? 5 : 3} opacity={opacity('membrane')} />
          <path d="M156 75C190 66 240 81 288 73Q321 71 321 103V196Q319 229 287 227C241 216 202 237 156 225Q126 222 127 190V109Q126 82 156 75Z" fill="#eaf3ff" stroke="#7d9cbd" strokeWidth={focus === 'vacuole' ? 4 : 2} opacity={opacity('vacuole')} />
          <g opacity={opacity('nucleus')}><ellipse cx="93" cy="157" rx="24" ry="30" fill={`url(#${id}-purple)`} stroke="#8660aa" strokeWidth={focus === 'nucleus' ? 3 : 2} /><path d="M81 156c-8 -17 15 -22 21 -9s-16 26 -17 10s17 -19 19 -2" fill="none" stroke="#9479b0" strokeWidth="2" /></g>
          {[[101, 69], [174, 53], [282, 52], [354, 103], [346, 228], [206, 249], [87, 233]].map(([x, y]) => <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(-20)`} opacity={opacity('chloroplast')}><ellipse rx="18" ry="10" fill="#75c985" stroke="#347447" strokeWidth={focus === 'chloroplast' ? 3 : 1.5} /><path d="M-10 -4h5v8h-5zM-3 -4h5v8h-5zM4 -4h5v8H4z" fill="#42965b" stroke="#347447" strokeWidth=".7" /></g>)}
          {[[351, 167], [134, 248]].map(([x, y]) => <g key={x} opacity={opacity('mitochondria')} transform={`translate(${x} ${y}) rotate(25)`}><path d="M-17 0C-19 -11 -3 -13 7 -9S21 0 16 7S2 10 -6 7S-15 9 -17 0Z" fill="#f8bc88" stroke="#b07842" strokeWidth={focus === 'mitochondria' ? 2.5 : 1.5} /><path d="M-11 0c4 -10 5 9 9 0s6 -7 8 0" fill="none" stroke="#b07842" strokeWidth="1.5" /></g>)}
          <g opacity={opacity('ribosomes')}>{[[80, 113], [113, 206], [338, 70], [326, 249], [246, 54], [79, 199]].map(([x, y]) => <circle key={x} cx={x} cy={y} r={focus === 'ribosomes' ? 4 : 3} fill="#466c79" />)}</g>
        </> : <>
          <rect x="39" y="76" width="362" height="159" rx="79" fill="#e0d1ed" stroke="#9470b2" strokeWidth="8" opacity={opacity('wall')} />
          <rect x="48" y="85" width="344" height="141" rx="70" fill={`url(#${id}-mint)`} opacity={opacity('cytoplasm')} />
          <rect x="48" y="85" width="344" height="141" rx="70" fill="none" stroke="#279575" strokeWidth={focus === 'membrane' ? 5 : 2.5} opacity={opacity('membrane')} />
          <path d="M139 147C136 119 174 117 188 136S221 180 245 153S288 125 306 147S294 190 266 181S227 169 209 184S164 188 153 170S151 150 139 147Z" fill="none" stroke="#9065ba" strokeWidth="4" opacity={opacity('dna')} />
          <g fill="none" stroke="#c36bad" strokeWidth="3" opacity={opacity('plasmids')}><ellipse cx="103" cy="155" rx="13" ry="10" /><ellipse cx="334" cy="155" rx="12" ry="9" /></g>
          <g opacity={opacity('ribosomes')} fill="#466c79">{[[126, 110], [199, 103], [278, 108], [307, 204], [162, 202], [82, 191], [353, 188], [349, 120], [213, 205]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3.4" />)}</g>
        </>}
        {labelled && <CellDiagramAnnotations parts={parts} visibleIds={visibleIds} focus={focus} />}
      </svg>
    </div>
    {labelled && <DiagramKey parts={parts} visibleIds={visibleIds} focus={focus} onSelect={onSelect} selectableIds={selectablePartIds} />}
    <figcaption>{type === 'plant' ? 'Example photosynthesising cell; not every plant cell has chloroplasts.' : 'Example plasmids shown; not all bacteria have them.'}</figcaption>
  </figure>
}

export function AreaModel({ length = 8, width = 2 }: { length?: number; width?: number }) {
  return <figure className="science-area-model">
    <svg viewBox="0 0 440 180" role="img" aria-label={`Curved mitochondrion approximated by a rectangle. Actual length ${length} micrometres and width ${width} micrometres.`}>
      <rect x="75" y="40" width="285" height="86" rx="3" fill="#f5effb" stroke="#9270b6" strokeDasharray="6 5" />
      <path d="M85 91C70 56 157 44 211 51S347 41 353 80S280 119 208 113S104 128 85 91Z" fill="#ffd5a5" stroke="#b07842" strokeWidth="2" />
      <path d="M114 86l24 -20 23 27 26 -28 27 29 29 -24 28 24 33 -24" fill="none" stroke="#b07842" strokeWidth="2" />
      <path d="M75 139H360M75 134V144M360 134V144M375 40V126M370 40H380M370 126H380" stroke="#506379" strokeWidth="1.5" />
      <text x="215" y="163" textAnchor="middle" fill="#354c61" fontSize="15">{length} µm</text><text x="386" y="89" fill="#354c61" fontSize="14">{width} µm</text>
    </svg>
    <div className="science-area-model__dimensions"><span>Length: {length} µm</span><span>Width: {width} µm</span></div>
    <figcaption>Supplied actual dimensions · illustrative model, not to scale</figcaption>
  </figure>
}

export function SizeReference() {
  return <div className="science-size-reference"><span>Same units first</span><strong>1 mm = 1000 µm</strong><p>Example diameters: animal cell 20 µm · bacterium 2 µm</p><small>Example sizes, not fixed sizes for every cell.</small></div>
}
