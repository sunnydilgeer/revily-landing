import { useId, useState } from 'react'
import type { PlaceHint } from './model'
import { AlignedNumbers, ColumnGuide } from './PlaceValueVisuals'

export function InlinePlaceHint({ hints, onConsult }: { hints: PlaceHint[]; onConsult?: () => void }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(0)
  const id = useId()
  const active = hints[selected]
  return <div className="pvb-hint">
    <button className="pvb-hint-toggle" type="button" aria-expanded={open} aria-controls={id} onClick={() => { setOpen(value => !value); if (!open) onConsult?.() }}>{open ? 'Hide hint' : 'Hint'} <span aria-hidden="true">{open ? '−' : '+'}</span></button>
    <div id={id} className="pvb-hint__content" hidden={!open}>
      {hints.length > 1 && <div className="pvb-demo-controls" role="group" aria-label="Choose a method hint">{hints.map((hint, i) => <button key={hint.label} type="button" aria-pressed={selected === i} onClick={() => setSelected(i)}>{hint.label}</button>)}</div>}
      <div aria-live="polite"><p>{active.text}</p>{active.guide && <ColumnGuide value={active.guide.value} index={active.guide.index} />}{active.alignment && <AlignedNumbers values={active.alignment} />}</div>
    </div>
  </div>
}
