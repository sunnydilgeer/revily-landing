export type DiagramAnnotation = { id: string; label: string; number: number; x: number; y: number; targetX: number; targetY: number }

export function CellDiagramAnnotations({ parts, visibleIds, focus }: { parts: DiagramAnnotation[]; visibleIds: string[]; focus?: string }) {
  return <g>{parts.filter(part => visibleIds.includes(part.id) && (!focus || part.id === focus)).map(part => <g key={part.id}>
    <path d={`M${part.x} ${part.y}L${part.targetX} ${part.targetY}`} fill="none" stroke="#354d64" strokeWidth="1.8" />
    <circle cx={part.targetX} cy={part.targetY} r="3" fill="#354d64" />
    <circle cx={part.x} cy={part.y} r="13" fill={focus === part.id ? '#fff1a1' : '#fff'} stroke="#354d64" strokeWidth="1.8" />
    <text x={part.x} y={part.y + 4.5} textAnchor="middle" fill="#26354a" fontSize="13" fontWeight="600">{part.number}</text>
  </g>)}</g>
}

export function DiagramKey({ parts, visibleIds, focus, onSelect, selectableIds }: { parts: DiagramAnnotation[]; visibleIds: string[]; focus?: string; onSelect?: (id: string) => void; selectableIds?: string[] }) {
  return <div className="science-cell__key" aria-label="Cell diagram key">{parts.filter(part => visibleIds.includes(part.id)).map(part => {
    const content = <><span className="science-cell__key-number" aria-hidden="true">{part.number}</span>{part.label}</>
    return onSelect && (!selectableIds || selectableIds.includes(part.id))
      ? <button key={part.id} type="button" aria-pressed={focus === part.id} className={focus === part.id ? 'is-active' : ''} onClick={() => onSelect(part.id)}>{content}</button>
      : <span key={part.id}>{content}</span>
  })}</div>
}
