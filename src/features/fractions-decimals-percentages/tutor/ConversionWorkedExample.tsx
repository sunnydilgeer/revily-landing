'use client'

import { useId, useMemo, useState } from 'react'
import { MathSpan } from '../../../../components/MathText'
import { WorkedChain } from '../../maths/step-chain/WorkedChain'
import { chainFromSteps } from '../../maths/step-chain/fromSteps'
import type { ConversionForm, ConversionForms, ConversionWorking } from './conversionWorking'

const labels: Array<[keyof ConversionForms, string]> = [
  ['fraction', 'Fraction'],
  ['decimal', 'Decimal'],
  ['percentage', 'Percentage'],
]

function FormCard({ label, value }: { label: string; value?: ConversionForm }) {
  return <div className={`fdp-form-card${value ? ' is-known' : ''}`} aria-label={`${label}: ${value?.accessible ?? 'not shown yet'}`}>
    <small>{label}</small>
    <div aria-hidden="true">{value ? <MathSpan latex={value.latex} /> : '?'}</div>
  </div>
}

function FormsDiagram({ forms }: { forms: ConversionForms }) {
  return <div className="fdp-forms" role="group" aria-label="Equivalent fraction, decimal and percentage forms">
    {labels.map(([key, label], index) => <div className="fdp-form-slot" key={key}>
      {index > 0 && <span className="fdp-equivalent" aria-hidden="true">=</span>}
      <FormCard label={label} value={forms[key]} />
    </div>)}
  </div>
}

export function ConversionWorkedExample({ visual }: { visual: ConversionWorking }) {
  const chain = useMemo(() => chainFromSteps(visual.expression, visual.steps), [visual])
  // The fraction, decimal and percentage forms for the step on screen.
  const picture = (revealed: number) => {
    const step = visual.steps[revealed - 2]
    return step && <div className="rung-worked__visual"><FormsDiagram forms={step.forms} /></div>
  }
  return <WorkedChain steps={chain} picture={picture} />
}

export function AnswerConversionWorking({ visual }: { visual: ConversionWorking }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return <div className="wms-answer-working">
    <button type="button" className="lesson-secondary-action" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{open ? 'Hide step by step' : 'See this conversion step by step'}</button>
    <div id={id} className="pvb-stage" hidden={!open}><ConversionWorkedExample visual={visual} /></div>
  </div>
}
