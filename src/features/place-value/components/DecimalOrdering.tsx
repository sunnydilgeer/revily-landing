'use client'

import { useRef, useState } from 'react'

export function DecimalOrdering({ values, alignedValues = {}, revealAlignedOnAnswer = false, revealed, order, onOrderChange }: {
  values: Array<{ id: string; label: string }>
  alignedValues?: Record<string, string>
  revealAlignedOnAnswer?: boolean
  revealed: boolean
  order: string[]
  onOrderChange?: (ids: string[]) => void
}) {
  const [announcement, setAnnouncement] = useState('')
  const draggedIndex = useRef<number | null>(null)
  const lookup = new Map(values.map((item) => [item.id, item]))
  function move(from: number, to: number) {
    if (revealed || to < 0 || to >= order.length || from === to) return
    const next = [...order]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onOrderChange?.(next)
    setAnnouncement(`${lookup.get(item)?.label} moved to position ${to + 1}.`)
  }
  return <figure className="decimal-ordering">
    <ol aria-label="Decimals in the current order">{order.map((id, index) => {
      const item = lookup.get(id)
      if (!item) return null
      return <li key={id} draggable={!revealed} onDragStart={() => { draggedIndex.current = index }} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (draggedIndex.current !== null) move(draggedIndex.current, index); draggedIndex.current = null }}>
        <span className="decimal-ordering__position" aria-hidden="true">{index + 1}</span>
        <span className="decimal-ordering__value">{revealAlignedOnAnswer && revealed ? alignedValues[id] ?? item.label : item.label}</span>
        {!revealed && <span className="decimal-ordering__controls"><button type="button" disabled={index === 0} aria-label={`Move ${item.label} left`} onClick={() => move(index, index - 1)}>←</button><button type="button" disabled={index === order.length - 1} aria-label={`Move ${item.label} right`} onClick={() => move(index, index + 1)}>→</button></span>}
      </li>
    })}</ol>
    <p className="sr-only" aria-live="polite">{announcement}</p>
    <figcaption>{revealed && revealAlignedOnAnswer ? 'Aligned to three decimal places' : 'Smallest to largest'}</figcaption>
  </figure>
}
