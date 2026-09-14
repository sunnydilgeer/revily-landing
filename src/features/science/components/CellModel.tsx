import { useId } from 'react'
import { CellDiagramAnnotations, DiagramKey, type DiagramAnnotation } from './CellDiagramAnnotations'

export type CellPart = 'membrane' | 'cytoplasm' | 'nucleus' | 'mitochondria' | 'ribosomes'
export const cellParts: Array<{ id: CellPart; label: string; shape: string; function: string }> = [
  { id: 'membrane', label: 'Cell membrane', shape: 'boundary', function: 'Controls movement of substances into and out of the cell.' },
  { id: 'cytoplasm', label: 'Cytoplasm', shape: 'fill', function: 'Where many chemical reactions happen.' },
  { id: 'nucleus', label: 'Nucleus', shape: 'circle', function: 'Contains genetic material and controls cell activities.' },
  { id: 'mitochondria', label: 'Mitochondria', shape: 'oval', function: 'The site of aerobic respiration, which releases energy.' },
  { id: 'ribosomes', label: 'Ribosomes', shape: 'dots', function: 'The site of protein synthesis: making proteins.' },
]

const annotations: DiagramAnnotation[] = [
  { id: 'membrane', label: 'Cell membrane', number: 1, x: 408, y: 117, targetX: 396, targetY: 147 },
  { id: 'cytoplasm', label: 'Cytoplasm', number: 2, x: 40, y: 141, targetX: 97, targetY: 158 },
  { id: 'nucleus', label: 'Nucleus', number: 3, x: 217, y: 68, targetX: 213, targetY: 112 },
  { id: 'mitochondria', label: 'Mitochondria', number: 4, x: 104, y: 56, targetX: 125, targetY: 102 },
  { id: 'ribosomes', label: 'Ribosomes', number: 5, x: 369, y: 213, targetX: 342, targetY: 176 },
]

export function CellModel({ highlight, pointer = false, alternate = false, labelled = false, description,
  onSelectPart, partIds, selectablePartIds }: { highlight?: CellPart; pointer?: boolean; alternate?: boolean; labelled?: boolean;
    description?: string; onSelectPart?: (part: CellPart) => void; partIds?: CellPart[]; selectablePartIds?: CellPart[] }) {
  const id = useId().replace(/:/g, '')
  const nucleusX = alternate ? 235 : 212
  const nucleusY = alternate ? 158 : 142
  const mitochondria = alternate ? [[119, 93, -15], [300, 100, 35], [109, 192, 25], [290, 231, -10]]
    : [[125, 102, -25], [300, 103, 28], [112, 194, 20], [293, 232, -18]]
  const dots = [[163, 74], [194, 61], [266, 74], [328, 150], [342, 176], [157, 220],
    [198, 237], [234, 225], [139, 148], [85, 150], [317, 193], [165, 191], [247, 110]]
  const active = (part: CellPart) => !highlight || highlight === part ? 1 : 0.5
  const visibleIds = partIds || cellParts.map(part => part.id)
  return <figure className={`science-cell science-cell--animal${alternate ? ' science-cell--alternate' : ''}`}>
    <div className="science-cell__identity">Animal cell</div>
    <div className="science-cell__drawing" role="img" aria-label={description || (pointer
      ? 'Simplified animal-cell model, not to scale. A pointer ends at the outer boundary. Labels are hidden.'
      : 'Simplified animal-cell model, not to scale. A nucleus is surrounded by cytoplasm, mitochondria and ribosomes, inside a cell membrane.')}>
      <svg viewBox="0 0 440 310" aria-hidden="true" focusable="false">
        <defs>
          <marker id={`${id}-arrow`} markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7" fill="#273f35" /></marker>
          <radialGradient id={`${id}-cytoplasm`} cx="35%" cy="30%" r="75%"><stop stopColor="#e1faf0" /><stop offset="1" stopColor="#95daca" /></radialGradient>
          <radialGradient id={`${id}-nucleus`} cx="35%" cy="30%" r="75%"><stop stopColor="#dcc8f3" /><stop offset="1" stopColor="#a27bc9" /></radialGradient>
          <radialGradient id={`${id}-mitochondria`} cx="35%" cy="30%" r="75%"><stop stopColor="#ffdcaf" /><stop offset="1" stopColor="#f4ac73" /></radialGradient>
        </defs>
        <g transform={alternate ? 'translate(8 32) rotate(-10 220 150) scale(.97 .76)' : undefined}>
          <path className={`science-cell__fill${highlight === 'cytoplasm' ? ' science-cell__focus science-cell__focus--mint' : ''}`} d="M145 38C222 5 336 39 379 99C400 132 401 163 391 191C369 251 317 262 261 278C188 296 89 259 60 195C29 137 69 65 145 38Z" fill={`url(#${id}-cytoplasm)`} opacity={active('cytoplasm')} />
          <path className={`science-cell__boundary${highlight === 'membrane' ? ' science-cell__focus science-cell__focus--mint' : ''}`} d="M145 38C222 5 336 39 379 99C400 132 401 163 391 191C369 251 317 262 261 278C188 296 89 259 60 195C29 137 69 65 145 38Z" fill="none" stroke="#279575" strokeWidth={highlight === 'membrane' ? 5 : 3} opacity={active('membrane')} />
          <g className={highlight === 'nucleus' ? 'science-cell__focus science-cell__focus--purple' : undefined} opacity={active('nucleus')}>
            <ellipse cx={nucleusX} cy={nucleusY} rx="49" ry="43" fill={`url(#${id}-nucleus)`} stroke="#8660aa" strokeWidth="2.5" />
            <path d={`M${nucleusX - 24} ${nucleusY + 12}c-6 -23 29 -34 35 -15s-23 31 -27 12s26 -26 37 -12`} fill="none" stroke="#9479b0" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g className={highlight === 'mitochondria' ? 'science-cell__focus science-cell__focus--peach' : undefined} opacity={active('mitochondria')}>
            {mitochondria.map(([x, y, rotation], index) => <g key={index} transform={`translate(${x} ${y}) rotate(${rotation})`}>
              <path d="M-25 0C-27 -15 -4 -18 10 -12S29 -1 23 9S3 14 -8 10S-22 12 -25 0Z" fill={`url(#${id}-mitochondria)`} stroke="#b07842" strokeWidth="2" />
              <path d="M-17 1C-12 -11 -10 11 -4 0S3 -8 6 1S12 9 16 -1" fill="none" stroke="#b18150" strokeWidth="1.8" strokeLinecap="round" />
            </g>)}
          </g>
          <g className={highlight === 'ribosomes' ? 'science-cell__focus science-cell__focus--mint' : undefined} fill="#466c79" opacity={active('ribosomes')}>{dots.map(([x, y], index) => <circle key={index} cx={x} cy={y} r="3.4" />)}</g>
          {highlight && !pointer && <g className="science-cell__target" fill="none" stroke="#284b3d" strokeWidth="1.5" strokeDasharray="4 4">
            {highlight === 'nucleus' && <ellipse cx={nucleusX} cy={nucleusY} rx="58" ry="52" />}
            {highlight === 'mitochondria' && <ellipse cx={mitochondria[0][0]} cy={mitochondria[0][1]} rx="36" ry="26" />}
            {highlight === 'ribosomes' && <circle cx="328" cy="150" r="13" />}
          </g>}
          {pointer && <g><circle cx="391" cy="191" r="10" fill="white" fillOpacity=".7" stroke="#273f35" strokeWidth="1.5" /><path d="M436 214L398 194" fill="none" stroke="#273f35" strokeWidth="2" markerEnd={`url(#${id}-arrow)`} /></g>}
          {labelled && !pointer && <CellDiagramAnnotations parts={annotations} visibleIds={visibleIds} focus={highlight} />}
        </g>
      </svg>
    </div>
    {labelled && <DiagramKey parts={annotations} visibleIds={visibleIds} focus={highlight} selectableIds={selectablePartIds} onSelect={onSelectPart ? part => onSelectPart(part as CellPart) : undefined} />}
  </figure>
}
