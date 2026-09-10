'use client'

import { useEffect, useRef } from 'react'

export type LongMultiplicationHintDefinition = { label: string; title: string; body: string; example?: string }

export function LongMultiplicationHint({ hint, open, onOpen, onClose }: { hint: LongMultiplicationHintDefinition; open: boolean; onOpen: () => void; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => { if (open) closeRef.current?.focus() }, [open])
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, open])
  return <div className="multiplication-hint">
    <button className="multiplication-hint__trigger" type="button" aria-expanded={open} onClick={onOpen}>Hint · {hint.label}</button>
    {open && <div className="multiplication-hint__backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="multiplication-hint__modal" role="dialog" aria-modal="true" aria-labelledby="multiplication-hint-title">
        <header><div><p>Strategy hint</p><h2 id="multiplication-hint-title">{hint.title}</h2></div><button ref={closeRef} type="button" aria-label="Close hint" onClick={onClose}>×</button></header>
        <p>{hint.body}</p>{hint.example && <div className="multiplication-hint__example">{hint.example}</div>}
      </section>
    </div>}
  </div>
}
