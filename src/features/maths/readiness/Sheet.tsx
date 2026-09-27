'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { CloseIcon } from '../../../ui/icons'
import './Sheet.css'

/**
 * A modal panel that slides up from the bottom on a phone and sits centred on a wide screen. Built on
 * <dialog>, so focus stays inside, Escape closes it and the page behind is inert.
 */
export default function Sheet({ label, tone = 'night', onClose, children }: {
  label: string
  tone?: 'night' | 'paper'
  onClose: () => void
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const node = ref.current
    node?.showModal()
    document.documentElement.classList.add('has-sheet-open')
    return () => { document.documentElement.classList.remove('has-sheet-open'); node?.close() }
  }, [])

  return <dialog
    ref={ref}
    className={`sheet sheet--${tone}`}
    aria-label={label}
    onCancel={event => { event.preventDefault(); onClose() }}
    onClick={event => { if (event.target === event.currentTarget) onClose() }}
  >
    <div className="sheet-panel">
      <span className="sheet-grip" aria-hidden="true" />
      <button type="button" className="sheet-close" aria-label="Close" onClick={onClose}><CloseIcon size={18} /></button>
      {children}
    </div>
  </dialog>
}
