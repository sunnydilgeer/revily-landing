'use client'

import { useState } from 'react'
import { WorkedLines } from './WorkedLines'
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
  const [revealed, setRevealed] = useState(0)
  const current = revealed ? steps[revealed - 1] : undefined
  const example = visual.examples[0]
  const rounded = steps.map(step => step.frame.rounding).find(frame => frame?.stage === 'result')?.answer
  return <WorkedLines
    question={example.expression}
    answer={rounded ? `${rounded}` : undefined}
    sign="≈"
    visual={current && <div className="ns-visual rung-worked__visual">
      {current.frame.rounding && <RoundingVisual frame={current.frame.rounding} />}
      {current.frame.ordering && <OrderingVisual frame={current.frame.ordering} />}
    </div>}
    lines={steps.slice(0, revealed).map((step, index) => ({ key: `${index}`, math: step.equation, note: step.title }))}
    say={current?.instruction}
    revealed={revealed}
    total={steps.length}
    onReveal={setRevealed}
  />
}
