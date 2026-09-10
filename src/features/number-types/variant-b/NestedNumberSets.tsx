import type { NestedNumberSetsVisual } from '../types'
import './VariantB.css'

const examples = {
  whole: ['0', '1', '2', '3', '4', '…'],
  integerOnly: ['−2', '−7'],
  rationalNonInteger: ['½', '−1.5'],
  irrational: ['π', '√2'],
}

function uniqueLabels(exampleLabels: string[], tokenLabels: string[]) {
  return [...new Set([...exampleLabels, ...tokenLabels])]
}

function Tokens({ labels }: { labels: string[] }) {
  return <div className="nested-number-sets__tokens">{labels.map((label) => <span key={label}>{label}</span>)}</div>
}

export function NestedNumberSets({ tokens, revealPlacementsOnAnswer, revealed }: NestedNumberSetsVisual['props'] & { revealed: boolean }) {
  const showPlacements = !revealPlacementsOnAnswer || revealed
  const whole = tokens.filter((token) => token.region === 'whole')
  const integerOnly = tokens.filter((token) => token.region === 'integer-only')
  const rationalNonInteger = tokens.filter((token) => token.region === 'rational-non-integer')
  const irrational = tokens.filter((token) => token.region === 'irrational')

  const wholeLabels = uniqueLabels(examples.whole, showPlacements ? whole.map((token) => token.label) : [])
  const integerOnlyLabels = uniqueLabels(examples.integerOnly, showPlacements ? integerOnly.map((token) => token.label) : [])
  const rationalNonIntegerLabels = uniqueLabels(examples.rationalNonInteger, showPlacements ? rationalNonInteger.map((token) => token.label) : [])
  const irrationalLabels = uniqueLabels(examples.irrational, showPlacements ? irrational.map((token) => token.label) : [])

  return (
    <figure className="nested-number-sets">
      <div className="nested-number-sets__relationship">
        <strong>The number family</strong>
      </div>
      <div className="nested-number-sets__stage">
        <section className="nested-number-sets__rational" aria-label="Rational numbers">
          <div className="nested-number-sets__label nested-number-sets__label--rational">
            <strong>Rational numbers</strong><small>can be written as a fraction</small>
          </div>
          <div className="nested-number-sets__rational-groups">
            <section className="nested-number-sets__integer" aria-label="Integers">
              <div className="nested-number-sets__label"><strong>Integers</strong><small>Decimals and Fractions are not Integers</small></div>
              <div className="nested-number-sets__integer-only">
                <small>Other integers</small>
                <Tokens labels={integerOnlyLabels} />
              </div>
              <section className="nested-number-sets__whole" aria-label="Whole numbers">
                <div className="nested-number-sets__label"><strong>Whole numbers</strong><small>zero and positive integers</small></div>
                <Tokens labels={wholeLabels} />
              </section>
            </section>
            <section className="nested-number-sets__rational-non-integer" aria-label="Rational non-integers">
              <div className="nested-number-sets__label"><strong>Rational non-integers</strong><small>fractions and terminating or recurring decimals</small></div>
              <Tokens labels={rationalNonIntegerLabels} />
            </section>
          </div>
        </section>
        <section className="nested-number-sets__irrational" aria-label="Irrational numbers">
          <div className="nested-number-sets__label"><strong>Irrational numbers</strong><small>cannot be written as a fraction</small></div>
          <Tokens labels={irrationalLabels} />
        </section>
      </div>
      <figcaption className="sr-only">
        The number family. Rational numbers include integers and rational non-integers. Integers include whole numbers. Whole-number examples are 0, 1, 2, 3, 4 and continuing. Other integer examples are {examples.integerOnly.join(', ')}. Rational non-integer examples are {examples.rationalNonInteger.join(', ')}. Irrational examples are {examples.irrational.join(', ')}.
        {showPlacements
          ? ` Classified values — whole numbers: ${whole.map((token) => token.label).join(', ') || 'none'}; other integers: ${integerOnly.map((token) => token.label).join(', ') || 'none'}; rational non-integers: ${rationalNonInteger.map((token) => token.label).join(', ') || 'none'}; irrational numbers: ${irrational.map((token) => token.label).join(', ') || 'none'}.`
          : ` Classify these values: ${tokens.map((token) => token.label).join(', ')}. Their placements are hidden until the answer is checked.`}
      </figcaption>
    </figure>
  )
}
