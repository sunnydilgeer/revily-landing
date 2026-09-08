import type { FactorPairsVisual } from '../types'

export function FactorPairBuilder({ target, pairs, revealCount = pairs.length }: FactorPairsVisual['props']) {
  const visible = pairs.slice(0, revealCount)
  const distinctFactors = [...new Set(visible.flat())].sort((a, b) => a - b)
  return (
    <figure className="factor-pairs">
      <div className="factor-pairs__target">{target}</div>
      <div className="factor-pairs__list">
        {pairs.map((pair, index) => (
          <div className={`factor-pair${index < revealCount ? ' factor-pair--revealed' : ''}`} key={pair.join('-')}>
            {index < revealCount ? <><strong>{pair[0]}</strong><span>×</span><strong>{pair[1]}</strong><span>= {target}</span></> : <span>? × ?</span>}
          </div>
        ))}
        {visible.length === 0 && <p className="factor-pairs__prompt">Build the pairs from 1 upwards.</p>}
        {distinctFactors.length > 0 && (
          <p className="factor-pairs__factors">
            <strong>{distinctFactors.length}</strong> distinct {distinctFactors.length === 1 ? 'factor' : 'factors'}: {distinctFactors.join(', ')}
          </p>
        )}
      </div>
      <figcaption className="sr-only">
        Factor pairs for {target}. {visible.map(([a, b]) => `${a} times ${b}`).join(', ') || 'No pairs revealed yet.'}
      </figcaption>
    </figure>
  )
}
