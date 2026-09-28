'use client'

import { useState, type ReactNode } from 'react'
import { StepChain, StepDots, useStepPace, type ChainLayout, type ChainStep } from './StepChain'
import './WorkedChain.css'

/**
 * A step chain inside a lesson card, with its own small controls: back, dots and Next step.
 * The lesson's own Continue stays in the bottom bar, so a worked example never blocks moving on.
 * `picture` shows alongside the working for the step on screen (for example a fraction bar).
 * With `pictureOnly`, the picture shows the whole working (its own step headings too) and the chain isn't drawn.
 */
export function WorkedChain({ steps, layout, picture, pictureOnly }: {
  steps: ChainStep[]
  layout?: ChainLayout
  picture?: (revealed: number) => ReactNode
  pictureOnly?: boolean
}) {
  const [revealed, setRevealed] = useState(1)
  const { pace } = useStepPace()
  const total = steps.length - 1
  const done = revealed === steps.length
  const shown = picture?.(revealed)

  return <figure className="wc">
    {shown && <div className="wc-picture">{shown}</div>}
    {!pictureOnly && <StepChain steps={steps} layout={layout} revealed={revealed} pace={pace} />}
    {total > 0 && <div className="wc-controls">
      <button type="button" className="wc-back" aria-label="Previous step" disabled={revealed === 1} onClick={() => setRevealed(revealed - 1)}>←</button>
      <StepDots total={total} current={revealed - 1} />
      {done
        ? <button type="button" className="wc-next wc-next--again" aria-label="Watch the working again" onClick={() => setRevealed(1)}>↺ Again</button>
        : <button type="button" className="wc-next" onClick={() => setRevealed(revealed + 1)}>{revealed === 1 && !steps[0].op ? 'Show the first step' : 'Next step'}</button>}
    </div>}
  </figure>
}
