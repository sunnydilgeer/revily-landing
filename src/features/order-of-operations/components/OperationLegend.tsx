'use client'

import { useEffect, useId, useState } from 'react'
import type { OperationLegendItem } from '../../number-types/types'

export function OperationLegend({ items }: { items: OperationLegendItem[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const titleId = useId()

  useEffect(() => {
    if (!isOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isOpen])

  return (
    <aside className="operation-hint">
      <button
        type="button"
        className="operation-hint__trigger"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        Hint
      </button>
      {isOpen && (
        <div className="operation-hint__backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsOpen(false)
        }}>
          <section className="operation-hint__modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <div className="operation-hint__header">
              <div>
                <h2 id={titleId}>Hint</h2>
                <p>The numbers show the order to use the operations. × means the operation is not used here.</p>
              </div>
              <button type="button" className="operation-hint__close" aria-label="Close hint" autoFocus onClick={() => setIsOpen(false)}>
                ×
              </button>
            </div>
            <ol className="operation-hint__list">
              {items.map((item) => (
                <li className={`operation-hint__item operation-hint__item--${item.status}`} key={item.label}>
                  <span aria-hidden="true">{item.step ?? '×'}</span>
                  <div>
                    <b><span className="operation-hint__initial" aria-hidden="true">{item.label.charAt(0)}</span><span className="sr-only">{item.label.charAt(0)}</span>{item.label.slice(1)}</b>
                    <small>{item.detail ?? (item.step ? `Step ${item.step}` : 'Not used here')}</small>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      )}
    </aside>
  )
}
