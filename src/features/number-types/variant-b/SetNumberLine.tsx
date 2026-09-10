import type { SetNumberLineVisual } from '../types'
import './VariantB.css'

export function SetNumberLine({ mode, values, excluded = [] }: SetNumberLineVisual['props']) {
  const label = mode === 'whole' ? 'Whole numbers' : 'Integers'
  return (
    <figure className={`set-number-line set-number-line--${mode}`}>
      <div className="set-number-line__heading">
        <strong>{label}</strong>
        <span>{mode === 'whole' ? 'Start at zero and move right' : 'Continue forever in both directions'}</span>
      </div>
      <div className="set-number-line__track" aria-hidden="true">
        {mode === 'integer' && <span className="set-number-line__arrow set-number-line__arrow--left">←</span>}
        {values.map((value) => (
          <span className="set-number-line__point" key={value}>
            <i />
            <b>{value < 0 ? `−${Math.abs(value)}` : value}</b>
          </span>
        ))}
        <span className="set-number-line__arrow">→</span>
      </div>
      {excluded.length > 0 && (
        <div className="set-number-line__excluded">
          <small>Not in this set</small>
          {excluded.map((value) => <span key={value}>{value}</span>)}
        </div>
      )}
      <figcaption className="sr-only">
        {label}: {values.join(', ')} and continuing. {excluded.length ? `Examples outside this set: ${excluded.join(', ')}.` : ''}
      </figcaption>
    </figure>
  )
}
