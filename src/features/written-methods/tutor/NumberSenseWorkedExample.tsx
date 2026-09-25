'use client'

import { useId, useState } from 'react'
import { MathSpan } from '../../../../components/MathText'
import type { MethodWorking, OrderingFrame, RoundingFrame } from './methodWorking'

export function isNumberSenseWorking(visual: MethodWorking) {
  return visual.examples.every(example => example.method === 'rounding' || example.method === 'ordering')
}

function RoundingVisual({ frame }: { frame: RoundingFrame }) {
  if (frame.stage === 'result') return <div className="ns-result"><span className="ns-original">{frame.original}</span><span aria-hidden="true">→</span><strong>{frame.answer}</strong></div>
  return <>
    <div className="ns-rounding" role="img" aria-label={`${frame.original}. Keep ${frame.kept}. The decision digit is ${frame.decisionDigit}.`}>
      <div className="ns-rounding-digits" aria-hidden="true">
        <span className="ns-kept">{frame.kept.slice(0, -1)}<b>{frame.kept.slice(-1)}</b></span>
        <span className="ns-cut" />
        <b className="ns-decision">{frame.decisionDigit}</b>
        <span className="ns-remaining">{frame.remaining}</span>
      </div>
      <div className="ns-key" aria-hidden="true"><span>Last digit kept</span><span>Decision digit</span></div>
    </div>
    {frame.stage === 'decide' && <p className="ns-rule">{frame.decisionDigit} {frame.roundsUp ? '≥' : '<'} 5 <span aria-hidden="true">→</span> <strong>{frame.roundsUp ? 'round up' : 'keep the digit'}</strong></p>}
  </>
}

function OrderingVisual({ frame }: { frame: OrderingFrame }) {
  if (frame.answer) return <p className="ns-order-answer">{frame.answer}</p>
  if (frame.comparison) {
    const parts = frame.comparison.split(/([<>])/)
    return <div className="ns-comparison" role="img" aria-label={frame.comparison.replaceAll('\\,', ' ').replaceAll('<', ' is less than ').replaceAll('>', ' is greater than ')}>
      {parts.map((part, index) => index % 2 === 0 && <span className="ns-comparison-pair" key={index} aria-hidden="true">{index > 0 && <span className="ns-comparison-sign">{parts[index - 1]}</span>}<MathSpan latex={part} /></span>)}
    </div>
  }
  return <ul className="ns-values" aria-label="Comparable values">{frame.values?.map((value, index) => {
    const separator = value.indexOf(':')
    return <li key={index}>{separator > -1 ? <><span>{value.slice(0, separator)}</span><strong>{value.slice(separator + 1).trim()}</strong></> : <strong>{value}</strong>}</li>
  })}</ul>
}

export function NumberSenseWorkedExample({ visual }: { visual: MethodWorking }) {
  const steps = visual.examples.flatMap(example => example.steps)
  const [index, setIndex] = useState(0)
  const current = steps[index]
  const id = useId()
  if (!current) return null
  const last = index === steps.length - 1
  return <section className="ns-working" aria-label="Worked explanation" data-step-index={index + 1}>
    <header className="ns-step-heading"><h4 id={id}>{current.title}</h4><span>{index + 1} / {steps.length}</span></header>
    <div className="ns-step" role="group" aria-labelledby={id}>
      <div className="ns-visual">
        {current.frame.rounding && <RoundingVisual frame={current.frame.rounding} />}
        {current.frame.ordering && <OrderingVisual frame={current.frame.ordering} />}
      </div>
      <p className="ns-instruction">{current.instruction}</p>
    </div>
    <nav className="ns-step-controls" aria-label="Explanation steps">
      <button type="button" disabled={index === 0} onClick={() => setIndex(value => value - 1)}>← Previous step</button>
      <button type="button" onClick={() => setIndex(value => last ? 0 : value + 1)}>{last ? 'Start again' : 'Next step →'}</button>
    </nav>
    <span className="sr-only" aria-live="polite" aria-atomic="true">Step {index + 1} of {steps.length}: {current.title}. {current.instruction}</span>
  </section>
}
