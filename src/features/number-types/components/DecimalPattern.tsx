import type { DecimalVisual } from '../types'

const descriptions = {
  terminating: 'The decimal stops, so it can be written as an exact fraction.',
  recurring: 'A fixed block repeats forever, so it can be written as an exact fraction.',
  nonRecurring: 'The decimal continues without a fixed repeating block.',
}

export function DecimalPattern({ value, kind, fraction, label, revealFractionOnAnswer, revealed = true }: DecimalVisual['props'] & { revealed?: boolean }) {
  return (
    <figure className={`decimal-pattern decimal-pattern--${kind}`}>
      {label && <span className="decimal-pattern__label">{label}</span>}
      <div className="decimal-pattern__value">{value}</div>
      <div className="decimal-pattern__track" aria-hidden="true">
        {Array.from({ length: Math.min(12, value.length) }, (_, index) => <span key={index} />)}
      </div>
      {fraction && (!revealFractionOnAnswer || revealed) && <div className="decimal-pattern__fraction">= {fraction}</div>}
      <figcaption>{descriptions[kind]}</figcaption>
    </figure>
  )
}
