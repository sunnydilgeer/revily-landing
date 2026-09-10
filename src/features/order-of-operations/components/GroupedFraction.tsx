import { MathSpan } from '../../../../components/MathText'
import type { OperationLegendItem } from '../../number-types/types'

export function GroupedFraction({ numerator, denominator, resolvedNumerator, resolvedDenominator, simplified, showLabels = true, revealStepsOnAnswer = false, revealed }: {
  numerator: string
  denominator: string
  resolvedNumerator?: string
  resolvedDenominator?: string
  simplified?: string
  numeratorOperation?: string
  denominatorOperation?: string
  simplifyOperation?: string
  legend?: OperationLegendItem[]
  showLabels?: boolean
  revealStepsOnAnswer?: boolean
  revealed: boolean
}) {
  const showResolution = !revealStepsOnAnswer || revealed
  return (
    <figure className="grouped-fraction">
      <div className="grouped-fraction__zones">
        <div className="grouped-fraction__zone grouped-fraction__zone--top">
          {showLabels && <span className="grouped-fraction__zone-label">One numerator calculation</span>}
          <MathSpan latex={numerator} display className="grouped-fraction__math" />
        </div>
        <div className="grouped-fraction__bar" aria-hidden="true" />
        <div className="grouped-fraction__zone grouped-fraction__zone--bottom">
          <MathSpan latex={denominator} display className="grouped-fraction__math" />
          {showLabels && <span className="grouped-fraction__zone-label">One denominator calculation</span>}
        </div>
      </div>
      {showResolution && resolvedNumerator && resolvedDenominator && (
        <div className="grouped-fraction__resolution">
          <div>
            <span>Top</span>
            <MathSpan latex={resolvedNumerator} />
          </div>
          <span aria-hidden="true">→</span>
          <div>
            <span>Bottom</span>
            <MathSpan latex={resolvedDenominator} />
          </div>
          {simplified && <span aria-hidden="true">→</span>}
          {simplified && (
            <div>
              <span>Simplify</span>
              <MathSpan latex={simplified} />
            </div>
          )}
        </div>
      )}
      <figcaption className="sr-only">
        The quantity {numerator} divided by the quantity {denominator}.
        {showResolution && simplified ? ' The completed calculation is shown.' : ''}
      </figcaption>
    </figure>
  )
}
