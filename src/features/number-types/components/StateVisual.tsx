import type { LessonVisual } from '../types'
import { ArrayBuilder } from './ArrayBuilder'
import { DecimalPattern } from './DecimalPattern'
import { FactorPairBuilder } from './FactorPairBuilder'
import { MultipleStepper } from './MultipleStepper'
import { NumberLine } from './NumberLine'
import { PowerStructure } from './PowerStructure'
import { ExpressionSteps } from '../../order-of-operations/components/ExpressionSteps'
import { GroupedFraction } from '../../order-of-operations/components/GroupedFraction'
import { OperationPriority } from '../../order-of-operations/components/OperationPriority'
import { BidmasSpotlight } from '../../order-of-operations/prototype/BidmasSpotlightPrototype'
import { NextOperation } from '../../order-of-operations/components/NextOperation'
import { NestedNumberSets } from '../variant-b/NestedNumberSets'
import { SetNumberLine } from '../variant-b/SetNumberLine'
import { FactorsMultiplesComparison } from './FactorsMultiplesComparison'
import { PrimeHundredGrid } from './PrimeHundredGrid'
import { PlaceValueChart } from '../../place-value/components/PlaceValueChart'
import { DecimalComparison } from '../../place-value/components/DecimalComparison'
import { DecimalOrdering } from '../../place-value/components/DecimalOrdering'
import { ShortDivisionVisual } from '../../short-division/components/ShortDivisionVisual'
import { DivisionCheck } from '../../short-division/components/DivisionCheck'
import { LongMultiplicationVisual } from '../../long-multiplication/components/LongMultiplicationVisual'
import { MultiplicationScale } from '../../long-multiplication/components/MultiplicationScale'
import { DecimalOperationVisual } from '../../decimals/components/DecimalOperationVisual'

export function StateVisual({ visual, revealed, selected = [], onVisualSelect, onOrderChange, onVisualComplete }: {
  visual: LessonVisual
  revealed: boolean
  selected?: string[]
  onVisualSelect?: (id: string) => void
  onOrderChange?: (ids: string[]) => void
  onVisualComplete?: () => void
}) {
  switch (visual.type) {
    case 'numberLine': return visual.props.hideUntilAnswer && !revealed ? null : <NumberLine {...visual.props} revealed={revealed} />
    case 'arrayBuilder': return <ArrayBuilder {...visual.props} />
    case 'factorPairs': return <FactorPairBuilder {...visual.props} />
    case 'multipleStepper': return <MultipleStepper {...visual.props} revealed={revealed} />
    case 'powerStructure': return <PowerStructure {...visual.props} revealed={revealed} />
    case 'decimalPattern': return <DecimalPattern {...visual.props} revealed={revealed} />
    case 'operationPriority': return <OperationPriority {...visual.props} />
    case 'operationSpotlight': return <BidmasSpotlight {...visual.props} embedded onComplete={onVisualComplete} />
    case 'nextOperation': return <NextOperation {...visual.props} onComplete={onVisualComplete} />
    case 'expressionSteps': return <ExpressionSteps {...visual.props} revealed={revealed} selected={selected} onSelect={onVisualSelect} />
    case 'groupedFraction': return <GroupedFraction {...visual.props} revealed={revealed} />
    case 'setNumberLine': return <SetNumberLine {...visual.props} />
    case 'nestedNumberSets': return <NestedNumberSets {...visual.props} revealed={revealed} />
    case 'factorsMultiplesComparison': return <FactorsMultiplesComparison {...visual.props} />
    case 'primeGrid': return <PrimeHundredGrid {...visual.props} />
    case 'placeValueChart': return <PlaceValueChart {...visual.props} revealed={revealed} />
    case 'decimalComparison': return <DecimalComparison {...visual.props} revealed={revealed} selected={selected} onSelect={onVisualSelect} />
    case 'decimalOrdering': return <DecimalOrdering {...visual.props} revealed={revealed} order={selected.length > 0 ? selected : visual.props.values.map((item) => item.id)} onOrderChange={onOrderChange} />
    case 'shortDivision': return <ShortDivisionVisual {...visual.props} revealed={revealed} onComplete={onVisualComplete} />
    case 'divisionCheck': return <DivisionCheck {...visual.props} revealed={revealed} />
    case 'longMultiplication': return <LongMultiplicationVisual {...visual.props} revealed={revealed} onComplete={onVisualComplete} />
    case 'multiplicationScale': return <MultiplicationScale {...visual.props} revealed={revealed} />
    case 'decimalOperation': return <DecimalOperationVisual {...visual.props} revealed={revealed} onComplete={onVisualComplete} />
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
