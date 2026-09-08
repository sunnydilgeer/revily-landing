import type { LessonVisual } from '../types'
import { ArrayBuilder } from './ArrayBuilder'
import { DecimalPattern } from './DecimalPattern'
import { FactorPairBuilder } from './FactorPairBuilder'
import { MultipleStepper } from './MultipleStepper'
import { NumberLine } from './NumberLine'
import { PowerStructure } from './PowerStructure'

export function StateVisual({ visual, revealed }: { visual: LessonVisual; revealed: boolean }) {
  switch (visual.type) {
    case 'numberLine': return visual.props.hideUntilAnswer && !revealed ? null : <NumberLine {...visual.props} revealed={revealed} />
    case 'arrayBuilder': return <ArrayBuilder {...visual.props} />
    case 'factorPairs': return <FactorPairBuilder {...visual.props} />
    case 'multipleStepper': return <MultipleStepper {...visual.props} revealed={revealed} />
    case 'powerStructure': return <PowerStructure {...visual.props} revealed={revealed} />
    case 'decimalPattern': return <DecimalPattern {...visual.props} revealed={revealed} />
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
