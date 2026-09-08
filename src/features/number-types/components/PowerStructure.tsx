import type { PowerVisual } from '../types'

function expression(base: number, power: 2 | 3) {
  const factors = Array.from({ length: power }, () => base).join(' × ')
  return `${factors} = ${base ** power}`
}

function Structure({ base, power, showResult = true }: { base: number; power: 2 | 3; showResult?: boolean }) {
  const layers = power === 3 ? base : 1
  return (
    <div className={`power-model power-model--${power === 3 ? 'cube' : 'square'}`}>
      {showResult && <div className="power-model__layers" aria-hidden="true">
        {Array.from({ length: layers }, (_, layer) => (
          <div
            className="power-layer"
            key={layer}
            style={{ '--layer-index': layer, '--power-base': base } as React.CSSProperties}
          >
            {Array.from({ length: base * base }, (_, index) => <span key={index} />)}
          </div>
        ))}
      </div>}
      <strong>{showResult ? expression(base, power) : `${Array.from({ length: power }, () => base).join(' × ')} = ?`}</strong>
    </div>
  )
}

export function PowerStructure({ base, power, comparePower, compareBase, revealResultOnAnswer, revealed = true }: PowerVisual['props'] & { revealed?: boolean }) {
  const showResult = !revealResultOnAnswer || revealed
  return (
    <figure className="power-structure">
      {comparePower && <Structure base={compareBase ?? base} power={comparePower} />}
      <Structure base={base} power={power} showResult={showResult} />
      <figcaption className="sr-only">
        {comparePower ? `${expression(compareBase ?? base, comparePower)}. ` : ''}{showResult ? expression(base, power) : `${base} multiplied by itself ${power} times`}.
      </figcaption>
    </figure>
  )
}
