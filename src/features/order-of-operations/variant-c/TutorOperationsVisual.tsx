import { OperationsVisual } from '../variant-b/OperationsVisual'
import type { OperationsVisualDefinition } from '../variant-b/variantBLesson'
import type { TutorOperationsVisualDefinition } from './variantCLesson'
import { StackedWorkedExample } from './StackedWorkedExample'

export function TutorOperationsVisual({ visual, onConsultRule }: {
  visual: TutorOperationsVisualDefinition
  onConsultRule?: () => void
}) {
  if (visual.kind === 'stacked-worked') return <StackedWorkedExample visual={visual} />
  if (visual.kind !== 'tutor-summary') {
    return <OperationsVisual visual={visual as OperationsVisualDefinition} onConsultRule={onConsultRule} />
  }
  return <div className="opb-stage opb-priority opc-summary" aria-label="BIDMAS order and algebra recap">
    <p className="opb-step-label">BIDMAS - four priority levels</p>
    <ol>
      <li><b className="opb-priority__letters">B</b><div><strong>Brackets</strong><span>Finish each grouped calculation.</span></div></li>
      <li><b className="opb-priority__letters">I</b><div><strong>Indices</strong><span>Calculate numerical powers.</span></div></li>
      <li><b className="opb-priority__letters">D M</b><div><strong>Division & multiplication</strong><span>Equal priority: work left to right.</span></div></li>
      <li><b className="opb-priority__letters">A S</b><div><strong>Addition & subtraction</strong><span>Equal priority: work left to right.</span></div></li>
    </ol>
    <p className="opc-summary__algebra"><strong>Algebra:</strong> multiply coefficients and combine variable factors, then collect like terms.</p>
  </div>
}
