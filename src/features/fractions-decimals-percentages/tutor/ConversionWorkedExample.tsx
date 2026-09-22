'use client'

import { useId, useState } from 'react'
import { MathSpan } from '../../../../components/MathText'
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
  const [revealed, setRevealed] = useState(0)
  const total = visual.steps.length
  const current = revealed ? visual.steps[revealed - 1] : undefined
  const completed = visual.steps.slice(0, revealed)
  return <figure className="fdp-worked" data-revealed-steps={revealed}>
    <p className="wm-step-label">{revealed ? `Step ${revealed} of ${total}` : 'Ready to start'}</p>
    <div className="wmt-original" aria-label={`Original value: ${visual.label}`}><MathSpan latex={visual.expression} display /></div>
    {current ? <>
      <FormsDiagram forms={current.forms} />
      <div className="wms-current" role="group" aria-label="Current conversion step">
        <p className="wms-current-title">{current.title}</p>
        <div className="wmt-math"><MathSpan latex={current.equation} display /></div>
        <p>{current.instruction}</p>
      </div>
    </> : <p className="wms-start">Click Next to begin the conversion.</p>}
    <div className="wm-controls wms-controls">
      <button type="button" aria-label="Previous conversion step" disabled={!revealed} onClick={() => setRevealed(value => value - 1)}>← Back</button>
      <button type="button" aria-label="Next conversion step" disabled={revealed === total} onClick={() => setRevealed(value => value + 1)}>Next →</button>
      <button type="button" aria-label="Replay conversion working" disabled={!revealed} onClick={() => setRevealed(0)}>Replay</button>
    </div>
    {completed.length > 1 && <><p className="wms-history-title">Earlier working</p><ol className="wms-history" aria-label="Earlier conversion working">{completed.slice(0, -1).map((step, index) => <li key={`${step.title}-${index}`}><span className="wms-history-number" aria-hidden="true">{index + 1}</span><div><div className="wmt-math"><MathSpan latex={step.equation} /></div><p>{step.instruction}</p></div></li>)}</ol></>}
    <p className="sr-only" aria-live="polite">{current?.instruction ?? 'No conversion steps revealed.'}</p>
  </figure>
}

export function AnswerConversionWorking({ visual }: { visual: ConversionWorking }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return <div className="wms-answer-working">
    <button type="button" className="lesson-secondary-action" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{open ? 'Hide step by step' : 'See this conversion step by step'}</button>
    <div id={id} className="pvb-stage" hidden={!open}><ConversionWorkedExample visual={visual} /></div>
  </div>
}
