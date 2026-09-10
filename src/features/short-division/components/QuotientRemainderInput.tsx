import type { KeyboardEvent } from 'react'

export function QuotientRemainderInput({ id, quotient, remainder, disabled, onQuotientChange, onRemainderChange, onSubmit }: {
  id: string
  quotient: string
  remainder: string
  disabled: boolean
  onQuotientChange: (value: string) => void
  onRemainderChange: (value: string) => void
  onSubmit: () => void
}) {
  function submitOnEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && quotient.trim() && remainder.trim()) onSubmit()
  }
  return (
    <fieldset className="quotient-remainder-input" disabled={disabled}>
      <legend>Enter the whole-number result</legend>
      <label htmlFor={`${id}-quotient`}>
        <span>Quotient</span>
        <input id={`${id}-quotient`} inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={quotient} onChange={(event) => onQuotientChange(event.target.value)} onKeyDown={submitOnEnter} />
      </label>
      <label htmlFor={`${id}-remainder`}>
        <span>Remainder</span>
        <input id={`${id}-remainder`} inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={remainder} onChange={(event) => onRemainderChange(event.target.value)} onKeyDown={submitOnEnter} />
      </label>
    </fieldset>
  )
}
