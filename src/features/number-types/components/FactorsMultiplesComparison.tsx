import type { FactorsMultiplesComparisonVisual } from '../types'

function factorPairsFor(target: number): Array<[number, number]> {
  return Array.from({ length: Math.floor(Math.sqrt(target)) }, (_, index) => index + 1)
    .filter((factor) => target % factor === 0)
    .map((factor) => [factor, target / factor])
}

function factorsFor(target: number): number[] {
  return Array.from(new Set(factorPairsFor(target).flat())).sort((a, b) => a - b)
}

function MiniArray({ rows, columns }: { rows: number; columns: number }) {
  return (
    <span
      aria-hidden="true"
      className="comparison-mini-array"
      style={{ '--mini-columns': columns } as React.CSSProperties}
    >
      {Array.from({ length: rows * columns }, (_, index) => <i key={index} />)}
    </span>
  )
}

export function FactorsMultiplesComparison({ target }: FactorsMultiplesComparisonVisual['props']) {
  const factorPairs = factorPairsFor(target)
  const factors = factorsFor(target)
  const multiples = [1, 2, 3, 4].map((multiplier) => target * multiplier)

  return (
    <figure className="factors-multiples-comparison">
      <div className="comparison-idea">
        <strong>Factors fit into {target}</strong>
        <span aria-hidden="true">↔</span>
        <strong>Multiples build out from {target}</strong>
      </div>
      <div className="comparison-panels">
        <section className="comparison-panel comparison-panel--factors" aria-label={`Factors of ${target}`}>
          <header><span>Factors</span><small>divide {target} exactly</small></header>
          <div className="comparison-factor-models">
            {factorPairs.map(([rows, columns]) => (
              <div className="comparison-factor-row" key={`${rows}-${columns}`}>
                <MiniArray rows={rows} columns={columns} />
                <strong>{rows} × {columns} = {target}</strong>
              </div>
            ))}
          </div>
          <p><strong>All factors:</strong> {factors.join(', ')}</p>
        </section>

        <section className="comparison-panel comparison-panel--multiples" aria-label={`Multiples of ${target}`}>
          <header><span>Multiples</span><small>add another group of {target}</small></header>
          <div className="comparison-multiple-models">
            {multiples.map((multiple, index) => (
              <div className="comparison-multiple-row" key={multiple}>
                <span className="comparison-groups" aria-hidden="true">
                  {Array.from({ length: index + 1 }, (_, groupIndex) => <i key={groupIndex}>{target}</i>)}
                </span>
                <strong>{index + 1} × {target} = {multiple}</strong>
              </div>
            ))}
          </div>
          <p><strong>Multiples continue:</strong> {multiples.join(', ')}…</p>
        </section>
      </div>
      <figcaption className="sr-only">
        Factors fit exactly into {target}: {factors.join(', ')}. Multiples build out from {target}: {multiples.join(', ')} and continuing.
      </figcaption>
    </figure>
  )
}
