'use client'

import { useState } from 'react'
import { WorkedLines, finalValue } from './WorkedLines'
import { MathSpan } from '../../../../components/MathText'
import type { IntervalFrame, MethodWorking, OrderingFrame, RoundingFrame } from './methodWorking'

export function isNumberSenseWorking(visual: MethodWorking) {
  return visual.examples.every(example => example.method === 'rounding' || example.method === 'ordering' || example.method === 'estimate')
}

function RoundingVisual({ frame }: { frame: RoundingFrame }) {
  if (frame.stage === 'result') return <div className="ns-result"><span className="ns-original">{frame.original}</span><span aria-hidden="true">→</span><strong>{frame.answer}</strong></div>
  return <>
    <div className="ns-rounding" role="img" aria-label={frame.chop ? `${frame.original}. Keep ${frame.kept}. Chop off the rest.` : `${frame.original}. Keep ${frame.kept}. The decision digit is ${frame.decisionDigit}.`}>
      <div className="ns-rounding-digits" aria-hidden="true">
        <span className="ns-kept">{frame.kept.slice(0, -1)}<b>{frame.kept.slice(-1)}</b></span>
        <span className="ns-cut" />
        {frame.pointAfterKept && <span className="ns-point">.</span>}
        <b className="ns-decision">{frame.decisionDigit}</b>
        <span className="ns-remaining">{frame.remaining}</span>
      </div>
      <div className="ns-key" aria-hidden="true"><span>Last digit kept</span><span>{frame.chop ? 'Chopped off' : 'Decision digit'}</span></div>
    </div>
    {frame.stage === 'decide' && <p className="ns-rule">{frame.decisionDigit} {frame.roundsUp ? '≥' : '<'} 5 <span aria-hidden="true">→</span> <strong>{frame.roundsUp ? 'round up' : 'keep the digit'}</strong></p>}
  </>
}

function IntervalVisual({ frame }: { frame: IntervalFrame }) {
  const lower = Number(frame.lower), upper = Number(frame.upper), value = Number(frame.value)
  const pad = (upper - lower) * 0.45, min = lower - pad, max = upper + pad
  const x = (n: number) => 24 + (n - min) / (max - min) * 272
  const bounds = frame.stage !== 'value', interval = frame.stage === 'interval'
  const inside = frame.test !== undefined && Number(frame.test) >= lower && Number(frame.test) < upper
  const label = interval
    ? `Number line: ${frame.lower} is included, ${frame.upper} is not.${frame.test ? ` ${frame.test} is ${inside ? 'inside' : 'outside'} the interval.` : ''}`
    : bounds ? `Number line: ${frame.value} with bounds ${frame.lower} and ${frame.upper}.` : `Number line around ${frame.value}.`
  return <svg className="ns-line" viewBox="0 0 320 96" role="img" aria-label={label}>
    <line className="ns-line__axis" x1="8" x2="312" y1="56" y2="56" />
    {interval && <rect className="ns-line__band" x={x(lower)} y="50" width={x(upper) - x(lower)} height="12" rx="3" />}
    {value !== lower && <g className="ns-line__value"><line x1={x(value)} x2={x(value)} y1="46" y2="66" /><text x={x(value)} y="36">{frame.value}</text></g>}
    {bounds && ([[lower, frame.lower], [upper, frame.upper]] as const).map(([n, text], i) => <g key={i} className="ns-line__bound">
      <line x1={x(n)} x2={x(n)} y1="48" y2="64" />
      <text x={x(n)} y="86">{text}</text>
      {interval && <circle cx={x(n)} cy="56" r="6" className={i ? 'is-open' : 'is-closed'} />}
    </g>)}
    {value === lower && <text className="ns-line__value" x={x(value)} y="36">{frame.value}</text>}
    {frame.test && <g className={`ns-line__test${inside ? ' is-inside' : ''}`}><path d={`M${x(Number(frame.test))} 44l-6 -9h12z`} /><text x={Math.min(290, Math.max(30, x(Number(frame.test))))} y="20">{frame.test}</text></g>}
  </svg>
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
    ?? (example.method === 'estimate' ? finalValue(steps.at(-1)?.equation) : undefined)
  return <WorkedLines
    question={example.expression}
    answer={rounded ? `${rounded}` : undefined}
    sign="≈"
    visual={current && <div className="ns-visual rung-worked__visual">
      {current.frame.rounding && <RoundingVisual frame={current.frame.rounding} />}
      {current.frame.interval && <IntervalVisual frame={current.frame.interval} />}
      {current.frame.ordering && <OrderingVisual frame={current.frame.ordering} />}
    </div>}
    lines={steps.slice(0, revealed).map((step, index) => ({ key: `${index}`, math: step.equation, note: step.title }))}
    say={current?.instruction}
    revealed={revealed}
    total={steps.length}
    onReveal={setRevealed}
  />
}
