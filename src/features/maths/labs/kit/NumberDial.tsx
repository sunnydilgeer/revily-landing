'use client'

import { isTestMode } from './random'
import { sfx } from './sfx'
import './NumberDial.css'

/**
 * Set-the-value control, for games where you DO the maths rather than pick an answer: big − and +,
 * bigger jumps for long distances, and a slider for quick moves. Values snap to `step`.
 *
 * Test mode (?seed=) puts the right value on the group as data-target, and the current one as
 * data-value, so automated playthroughs can turn the dial to it with the named buttons.
 */
export function NumberDial({ label, value, onChange, min, max, step = 1, jump, format = String, target, disabled = false, tone = 'default' }: {
  /** What's being set, shown above the number and used in the button names: "Price". */
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  /** A bigger move (±jump) for long distances. Shown only when given. */
  jump?: number
  /** How the number reads: £2.50, 3 m, −2. */
  format?: (value: number) => string
  /** The right value, exposed only in test mode. */
  target?: number
  disabled?: boolean
  tone?: 'default' | 'right' | 'wrong'
}) {
  // Snap to the step grid, so float steps like 0.5 never drift.
  const snap = (next: number) => Math.min(max, Math.max(min, Math.round((next - min) / step) * step + min))
  const set = (next: number) => {
    const snapped = Number(snap(next).toFixed(6))
    if (snapped === value || disabled) return
    onChange(snapped)
    sfx.tick()
  }
  const test = isTestMode() && target !== undefined
  return <div
    className={`nd nd--${tone}`}
    role="group"
    aria-label={label}
    data-dial=""
    data-value={test ? value : undefined}
    data-target={test ? target : undefined}
  >
    <div className="nd__row">
      {jump && <button type="button" className="nd__btn nd__btn--jump" aria-label={`${label}: much less`} disabled={disabled || value <= min} onClick={() => set(value - jump)}>−{format(jump).replace(/^[−-]/, '')}</button>}
      <button type="button" className="nd__btn" aria-label={`${label}: less`} disabled={disabled || value <= min} onClick={() => set(value - step)}>−</button>
      <output className="nd__value" aria-live="polite">
        <span className="nd__label">{label}</span>
        <span className="nd__number">{format(value)}</span>
      </output>
      <button type="button" className="nd__btn" aria-label={`${label}: more`} disabled={disabled || value >= max} onClick={() => set(value + step)}>+</button>
      {jump && <button type="button" className="nd__btn nd__btn--jump" aria-label={`${label}: much more`} disabled={disabled || value >= max} onClick={() => set(value + jump)}>+{format(jump).replace(/^[−-]/, '')}</button>}
    </div>
    <input
      className="nd__slider"
      type="range"
      aria-label={`${label} slider`}
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      onChange={event => set(Number(event.target.value))}
    />
  </div>
}
