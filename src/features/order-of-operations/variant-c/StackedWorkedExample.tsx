import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { MathSpan } from '../../../../components/MathText'
import type { TutorOperationsVisualDefinition } from './variantCLesson'

type Props = { visual: Extract<TutorOperationsVisualDefinition, { kind: 'stacked-worked' }> }

export function StackedWorkedExample({ visual }: Props) {
  const [revealed, setRevealed] = useState(0)
  const examples = [visual, ...(visual.additionalExamples ?? [])]
  const steps = examples.flatMap(example => example.steps)
  const active = steps[revealed - 1]
  let precedingSteps = 0
  const working = examples.map(example => {
    const count = Math.max(0, Math.min(example.steps.length, revealed - precedingSteps))
    precedingSteps += example.steps.length
    return { example, count }
  })

  return <figure className="opb-stage opc-stacked" data-revealed-steps={revealed}>
    {revealed > 0 && <p className="opb-step-label">{`Step ${revealed} of ${steps.length}`}</p>}
    {working.map(({ example, count }, exampleIndex) => exampleIndex > 0 && count === 0 ? null : <div className="opc-working-example" key={exampleIndex}>
      {examples.length > 1 && <p className="opc-example-label">Example {exampleIndex + 1}</p>}
      <ol className="opc-working-lines" aria-label={examples.length > 1 ? `Example ${exampleIndex + 1} calculation working` : 'Calculation working'}>
        {[example.math, ...example.steps.slice(0, count).map(item => item.math)].map((math, index) => <li key={index} className={index === count ? 'opc-working-line--current' : ''}>
          <span className="opc-working-equals" aria-hidden="true">{index > 0 ? '=' : ''}</span>
          <div className="opc-working-math"><MathSpan latex={index < count ? example.steps[index].previousMath : math} display /></div>
        </li>)}
      </ol>
    </div>)}
    <div className="opc-step-description" aria-live="polite" aria-atomic="true">
      {active?.title && <p className="opb-instruction">{active.title}</p>}
      {active?.evidence && <p className="opb-note">{active.evidence}</p>}
    </div>
    <div className="opb-toggles opc-step-controls">
      <button type="button" aria-label="Previous calculation step" disabled={revealed === 0} onClick={() => setRevealed(value => value - 1)}>← Back</button>
      <button type="button" aria-label="Next calculation step" disabled={revealed === steps.length} onClick={() => setRevealed(value => value + 1)}>Next →</button>
      <button type="button" aria-label="Replay calculation" disabled={revealed === 0} onClick={() => setRevealed(0)}><RotateCcw size={16} aria-hidden="true" /> Replay</button>
    </div>
  </figure>
}
