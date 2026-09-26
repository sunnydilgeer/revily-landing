import type { PrimeGridVisual } from '../types'

function factorsOf(number: number): number[] {
  return Array.from({ length: number }, (_, index) => index + 1)
    .filter((factor) => number % factor === 0)
}

function numberExplanation(number: number) {
  const factors = factorsOf(number)
  const factorLabel = factors.join(', ')

  if (number === 1) return '1 has one positive factor: 1. It is neither prime nor composite.'
  if (factors.length === 2) {
    const extra = number === 2 ? ' It is the only even prime.' : ''
    return `${number} has exactly two positive factors: ${factorLabel}. It is prime.${extra}`
  }
  return `${number} has ${factors.length} positive factors: ${factorLabel}. It is composite.`
}

export function PrimeHundredGrid({ max, highlightedPrimes }: PrimeGridVisual['props']) {
  const highlighted = new Set(highlightedPrimes)

  return (
    <figure className="prime-hundred-grid">
      <div className="prime-hundred-grid__legend">
        <span><i aria-hidden="true" /> Prime number</span>
      </div>
      <div className="prime-hundred-grid__cells" aria-label={`Number grid from 1 to ${max}`}>
        {Array.from({ length: max }, (_, index) => index + 1).map((number) => (
          <button
            aria-label={numberExplanation(number)}
            className={`prime-grid-cell${highlighted.has(number) ? ' prime-grid-cell--prime' : ''}`}
            key={number}
            type="button"
          >
            {number}
            <span role="tooltip">{numberExplanation(number)}</span>
          </button>
        ))}
      </div>
      <figcaption className="sr-only">The numbers 1 to {max}. The prime numbers are {highlightedPrimes.join(', ')}.</figcaption>
    </figure>
  )
}
