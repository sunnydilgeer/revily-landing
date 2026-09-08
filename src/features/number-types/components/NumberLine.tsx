import type { NumberLineVisual } from '../types'

export function NumberLine({ min, max, markers, expression, revealMarkersOnAnswer, revealed = true }: NumberLineVisual['props'] & { revealed?: boolean }) {
  const range = max - min
  const tickStep = Math.max(1, Math.ceil(range / 8))
  const ticks = Array.from({ length: Math.floor(range / tickStep) + 1 }, (_, index) => min + index * tickStep)
  if (ticks.at(-1) !== max) ticks.push(max)
  const visibleMarkers = revealMarkersOnAnswer && !revealed ? [] : markers
  return (
    <figure className="number-line-figure">
      {expression && <div className="number-line-expression">{expression}</div>}
      <div className="number-line" aria-hidden="true">
        <div className="number-line__rail" />
        {ticks.map((tick) => (
          <span className="number-line__tick" key={tick} style={{ left: `${((tick - min) / (max - min)) * 100}%` }}>
            <i />
            <b>{tick}</b>
          </span>
        ))}
        {visibleMarkers.map((marker) => (
          <span
            className={`number-line__marker number-line__marker--${marker.kind ?? 'integer'}`}
            key={`${marker.label}-${marker.value}`}
            style={{ left: `${((marker.value - min) / (max - min)) * 100}%` }}
          >
            <em>{marker.label}</em>
          </span>
        ))}
      </div>
      <figcaption className="sr-only">
        Number line from {min} to {max}. {visibleMarkers.map((marker) => `${marker.label} is positioned at ${marker.value}`).join('. ')}.
      </figcaption>
    </figure>
  )
}
