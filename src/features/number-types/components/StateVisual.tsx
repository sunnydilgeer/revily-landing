import type { LessonVisual } from '../types'
import { IntegerValueVisual } from '../variant-d/IntegerValueVisual'
import { ArrayBuilder } from './ArrayBuilder'
import { DecimalPattern } from './DecimalPattern'
import { FactorPairBuilder } from './FactorPairBuilder'
import { MultipleStepper } from './MultipleStepper'
import { NumberLine } from './NumberLine'
import { PowerStructure } from './PowerStructure'
import { ExpressionSteps } from '../../order-of-operations/components/ExpressionSteps'
import { GroupedFraction } from '../../order-of-operations/components/GroupedFraction'
import { OperationPriority } from '../../order-of-operations/components/OperationPriority'
import { NextOperation } from '../../order-of-operations/components/NextOperation'
import { FactorsMultiplesComparison } from './FactorsMultiplesComparison'
import { PrimeHundredGrid } from './PrimeHundredGrid'
import { PlaceValueChart } from '../../place-value/components/PlaceValueChart'

export function StateVisual({ visual, revealed, selected = [], onVisualSelect, onOrderChange, onVisualComplete }: {
  visual: LessonVisual
  revealed: boolean
  selected?: string[]
  onVisualSelect?: (id: string) => void
  onOrderChange?: (ids: string[]) => void
  onVisualComplete?: () => void
}) {
  switch (visual.type) {
    case 'lessonVideo': return null // Video activities provide playback and navigation in the lesson view.
    case 'integerValues': return <IntegerValueVisual {...visual.props} revealed={revealed} />
    case 'numberLine': return visual.props.hideUntilAnswer && !revealed ? null : <NumberLine {...visual.props} revealed={revealed} />
    case 'arrayBuilder': return <ArrayBuilder {...visual.props} />
    case 'factorPairs': return <FactorPairBuilder {...visual.props} />
    case 'multipleStepper': return <MultipleStepper {...visual.props} revealed={revealed} />
    case 'powerStructure': return <PowerStructure {...visual.props} revealed={revealed} />
    case 'decimalPattern': return <DecimalPattern {...visual.props} revealed={revealed} />
    case 'operationPriority': return <OperationPriority {...visual.props} />
    case 'nextOperation': return <NextOperation {...visual.props} onComplete={onVisualComplete} />
    case 'expressionSteps': return <ExpressionSteps {...visual.props} revealed={revealed} selected={selected} onSelect={onVisualSelect} />
    case 'groupedFraction': return <GroupedFraction {...visual.props} revealed={revealed} />
    case 'factorsMultiplesComparison': return <FactorsMultiplesComparison {...visual.props} />
    case 'primeGrid': return <PrimeHundredGrid {...visual.props} />
    case 'placeValueChart': return <PlaceValueChart {...visual.props} revealed={revealed} />
    case 'equation': return (
      <figure className="equation-visual">
        <div className="equation-visual__expression">{revealed && visual.props.resolvedExpression
          ? visual.props.resolvedExpression
          : visual.props.expression}</div>
        <figcaption className="sr-only">{revealed && visual.props.resolvedExpression
          ? visual.props.resolvedExpression
          : visual.props.expression}</figcaption>
      </figure>
    )
    case 'classification': return (
      <figure className="classification-visual">
        <div className="classification-visual__value">{visual.props.value}</div>
        {revealed && visual.props.resolvedValue && <div className="classification-visual__resolved">{visual.props.resolvedValue}</div>}
        {revealed && visual.props.properties && (
          <div className="classification-visual__evidence">
            {visual.props.properties.map((property) => <span key={property}>{property}</span>)}
          </div>
        )}
        <figcaption className="sr-only">Classify {visual.props.value}. {revealed ? visual.props.resolvedValue ?? '' : ''}</figcaption>
      </figure>
    )
  }
}
