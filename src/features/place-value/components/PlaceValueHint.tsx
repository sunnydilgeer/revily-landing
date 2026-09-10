'use client'

import { useEffect, useRef } from 'react'

export type PlaceValueHintDefinition = { label: string; title: string; body: string; example?: string }

export function PlaceValueHint({ hint, open, onOpen, onClose }: { hint: PlaceValueHintDefinition; open: boolean; onOpen: () => void; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
        requestAnimationFrame(() => triggerRef.current?.focus())
      }
      if (event.key === 'Tab') { event.preventDefault(); closeRef.current?.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])
  function close() { onClose(); requestAnimationFrame(() => triggerRef.current?.focus()) }
  return <div className="place-value-hint">
    <button ref={triggerRef} type="button" className="place-value-hint__trigger" aria-haspopup="dialog" aria-expanded={open} onClick={onOpen}>{hint.label}</button>
    {open && <div className="place-value-hint__backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}><section className="place-value-hint__modal" role="dialog" aria-modal="true" aria-labelledby="place-value-hint-title" aria-describedby="place-value-hint-body">
      <header><div><p>Place-value hint</p><h2 id="place-value-hint-title">{hint.title}</h2></div><button ref={closeRef} type="button" aria-label="Close hint" onClick={close}>×</button></header>
      <p id="place-value-hint-body">{hint.body}</p>{hint.example && <div className="place-value-hint__example">{hint.example}</div>}
    </section></div>}
  </div>
}
