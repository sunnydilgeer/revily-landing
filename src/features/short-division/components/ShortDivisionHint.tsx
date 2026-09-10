'use client'

import { useEffect, useId, useRef } from 'react'

export type ShortDivisionHintDefinition = { label: string; title: string; body: string; example?: string }

export function ShortDivisionHint({ hint, open, onOpen, onClose }: {
  hint: ShortDivisionHintDefinition
  open: boolean
  onOpen: () => void
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const bodyId = useId()

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
        requestAnimationFrame(() => triggerRef.current?.focus())
      }
      if (event.key === 'Tab') {
        event.preventDefault()
        closeRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  function close() {
    onClose()
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  return (
    <div className="short-division-hint">
      <button ref={triggerRef} type="button" className="short-division-hint__trigger" aria-haspopup="dialog" aria-expanded={open} onClick={onOpen}>{hint.label}</button>
      {open && (
        <div className="short-division-hint__backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}>
          <section className="short-division-hint__modal" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={bodyId}>
            <header><div><p>Short-division hint</p><h2 id={titleId}>{hint.title}</h2></div><button ref={closeRef} type="button" aria-label="Close hint" onClick={close}>×</button></header>
            <p id={bodyId}>{hint.body}</p>
            {hint.example && <div className="short-division-hint__example">{hint.example}</div>}
          </section>
        </div>
      )}
    </div>
  )
}
