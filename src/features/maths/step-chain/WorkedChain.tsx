'use client'

import { useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { StepChain, StepDots, useStepPace, type ChainLayout, type ChainStep } from './StepChain'
import { StepDriverContext } from './stepDriver'
import './WorkedChain.css'

/** The nearest ancestor that scrolls its own content, if any (the lesson card on the fixed lesson screen). */
function scrollParent(element: HTMLElement) {
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
    const overflow = getComputedStyle(parent).overflowY
    if ((overflow === 'auto' || overflow === 'scroll') && parent.scrollHeight > parent.clientHeight) return parent
  }
  return null
}

/**
 * A step chain inside a lesson card, with its own small controls: back, dots and Next step.
 * On a lesson's teaching screen, Next step moves to the bottom bar (see stepDriver.ts), so there is one button to press.
 * `picture` shows alongside the working for the step on screen (for example a fraction bar).
 * With `pictureOnly`, the picture shows the whole working (its own step headings too) and the chain isn't drawn.
 * With `steady`, the picture always fills the card's width, so it is the same size on the opening screen as on every step.
 */
export function WorkedChain({ steps, layout, picture, pictureOnly, steady }: {
  steps: ChainStep[]
  layout?: ChainLayout
  picture?: (revealed: number) => ReactNode
  pictureOnly?: boolean
  steady?: boolean
}) {
  const [revealed, setRevealed] = useState(1)
  const { pace } = useStepPace()
  const drive = useContext(StepDriverContext)
  const figure = useRef<HTMLElement>(null)
  const controls = useRef<HTMLDivElement>(null)
  const opened = useRef(revealed)
  const total = steps.length - 1
  const done = revealed === steps.length
  const nextLabel = revealed === 1 && !steps[0].op ? 'Show the first step' : 'Next step'
  const shown = picture?.(revealed)

  useEffect(() => {
    if (!drive) return
    const mine = total > 0 && !done ? { label: nextLabel, next: () => setRevealed(current => Math.min(current + 1, steps.length)) } : null
    drive(mine)
    return () => drive(null)
  }, [drive, done, nextLabel, steps.length, total])

  // Each new step lands at the bottom of the working: keep it (and the controls under it) clear of the bottom bar,
  // following the working as it grows while the step animates in.
  useEffect(() => {
    if (opened.current === revealed) return
    opened.current = revealed
    const working = figure.current, target = controls.current
    if (!drive || !working || !target || typeof ResizeObserver === 'undefined') return
    // On the fixed lesson screen the card scrolls inside itself; elsewhere the page scrolls. Chrome ignores
    // scroll-margin for block 'nearest' while the element is on screen, so measure, then align its end.
    const keepClear = () => {
      const scroller = scrollParent(target)
      const bottom = scroller ? scroller.getBoundingClientRect().bottom : window.innerHeight
      const clearance = parseFloat(getComputedStyle(target).scrollMarginBottom) || 0
      if (target.getBoundingClientRect().bottom > bottom - clearance) target.scrollIntoView({ block: 'end' })
    }
    const observer = new ResizeObserver(keepClear)
    observer.observe(working)
    const stop = window.setTimeout(() => observer.disconnect(), 1200)
    return () => { observer.disconnect(); window.clearTimeout(stop) }
  }, [drive, revealed])

  return <figure ref={figure} className={`wc${pictureOnly ? ' wc--picture' : ''}`}>
    {shown && <div className={`wc-picture${steady ? ' wc-picture--steady' : ''}`}>{shown}</div>}
    {!pictureOnly && <StepChain steps={steps} layout={layout} revealed={revealed} pace={pace} />}
    {total > 0 && <div className="wc-controls" ref={controls}>
      <button type="button" className="wc-back" aria-label="Previous step" disabled={revealed === 1} onClick={() => setRevealed(revealed - 1)}>←</button>
      <StepDots total={total} current={revealed - 1} />
      {done
        ? <button type="button" className="wc-next wc-next--again" aria-label="Watch the working again" onClick={() => setRevealed(1)}>↺ Again</button>
        : !drive && <button type="button" className="wc-next" onClick={() => setRevealed(revealed + 1)}>{nextLabel}</button>}
    </div>}
  </figure>
}
