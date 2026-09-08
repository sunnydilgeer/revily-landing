import type { ArrayVisual } from '../types'

export function ArrayBuilder({ total, arrangements, mode, activeArrangement = 0 }: ArrayVisual['props']) {
  const arrangement = arrangements[Math.min(activeArrangement, arrangements.length - 1)]
  const placed = Math.min(total, arrangement.rows * arrangement.columns)
  const remainder = total - placed
  return (
    <figure className={`array-figure array-figure--${mode}`}>
      <div className="array-figure__stage">
        <div
          className="counter-array"
          style={{ '--array-columns': arrangement.columns } as React.CSSProperties}
          aria-hidden="true"
        >
          {Array.from({ length: placed }, (_, index) => <span className="counter" key={index} />)}
        </div>
        {remainder > 0 && (
          <div className="counter-remainder" aria-hidden="true">
            {Array.from({ length: remainder }, (_, index) => <span className="counter counter--remainder" key={index} />)}
          </div>
        )}
      </div>
      <div className="arrangement-tabs" aria-label="Available arrangements">
        {arrangements.map((item, index) => (
          <span className={index === activeArrangement ? 'is-active' : ''} key={`${item.rows}-${item.columns}-${index}`}>
            {item.rows} × {item.columns}{item.valid === false ? ' + remainder' : ''}
          </span>
        ))}
      </div>
      <figcaption className="sr-only">
        {total} counters arranged into {arrangement.rows} rows of {arrangement.columns}{remainder ? ` with ${remainder} left over` : ''}.
      </figcaption>
    </figure>
  )
}
