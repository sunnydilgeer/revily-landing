'use client'

import { useState } from 'react'
import { StepChain, StepDots, useStepPace } from './StepChain'
import { chainExamples } from './examples'
import './StepChainPreview.css'

/** Prototype screen for the step chain: one example at a time, one button at the bottom. */
export default function StepChainPreview() {
  const [exampleIndex, setExampleIndex] = useState(0)
  const [revealed, setRevealed] = useState(1)
  const { slower, setSlower, pace } = useStepPace()
  const example = chainExamples[exampleIndex]
  const steps = example.steps.length - 1
  const done = revealed === example.steps.length

  const open = (index: number) => { setExampleIndex(index); setRevealed(1) }

  return <main className="scp">
    <header className="scp-top">
      <nav className="scp-tabs" aria-label="Examples">
        {chainExamples.map((candidate, index) => <button
          key={candidate.id}
          type="button"
          className={`scp-tab${index === exampleIndex ? ' is-active' : ''}`}
          aria-pressed={index === exampleIndex}
          onClick={() => open(index)}
        >{candidate.tab}</button>)}
      </nav>
    </header>

    <section className="scp-card rv-paper">
      <div className="scp-card__head">
        <h1 className="scp-prompt">{example.prompt}</h1>
        {revealed > 1 && <button type="button" className="scp-replay" aria-label="Start the working again" onClick={() => setRevealed(1)}>↺</button>}
      </div>
      <StepChain key={example.id} steps={example.steps} layout={example.layout} revealed={revealed} pace={pace} />
    </section>

    {/* Belongs in the student's settings once there is a settings screen; here so it can be tried. */}
    <label className="scp-motion">
      <input type="checkbox" checked={slower} onChange={event => setSlower(event.target.checked)} /> Slower animations
    </label>

    <footer className="scp-bar">
      <StepDots total={steps} current={revealed - 1} onSelect={step => setRevealed(step + 1)} />
      <div className="scp-bar__actions">
        <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-icon-btn" aria-label="Previous step" disabled={revealed === 1} onClick={() => setRevealed(revealed - 1)}>←</button>
        {done
          ? <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => open((exampleIndex + 1) % chainExamples.length)}>Next example</button>
          : <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => setRevealed(revealed + 1)}>{revealed === 1 ? 'Show the first step' : 'Next step'}</button>}
      </div>
    </footer>
  </main>
}
