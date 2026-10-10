'use client'

import { useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { StepChain, StepDots, useStepPace, type ChainLayout, type ChainStep } from './StepChain'
import { StepDriverContext } from './stepDriver'
import { WorkingWindow } from './working'
import { prefersReducedMotion } from './flip'
import './WorkedChain.css'

/** The nearest ancestor that scrolls its own content, if any (the lesson card on the fixed lesson screen). */
function scrollParent(element: HTMLElement) {
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
    const overflow = getComputedStyle(parent).overflowY
    if ((overflow === 'auto' || overflow === 'scroll') && parent.scrollHeight > parent.clientHeight) return parent
  }
  return null
}

/** How close to the bottom of the working window still counts as "at the newest line". */
const AT_END = 6

/**
 * Every worked example has one layout (Sunny, 10 Oct): the diagram, which stays put, then the working window, then
 * small controls (back, dots and Next step). The working rolls like film credits: each new line lands at the bottom
 * of the window, earlier lines glide up and fade at its top edge, and the student can scroll back up to read them.
 * The window is as tall as its lines until the lesson screen runs out of room (lessonFrame.ts limits it then).
 *
 * The lines come from the step chain itself, or, for a picture-only working, from the parts of the picture wrapped in
 * <Working> (working.tsx); the rest of the picture is the diagram.
 * On a lesson's teaching screen, Next step moves to the bottom bar (see stepDriver.ts), so there is one button to press.
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
  const roll = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<HTMLDivElement | null>(null)
  /** The student is reading the newest line (not scrolled back up): the window follows the working as it grows. */
  const following = useRef(true)
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

  // The fades at the window's edges say there is more above or below.
  function edges() {
    const box = roll.current
    if (!box) return
    const below = box.scrollHeight - box.clientHeight - box.scrollTop
    box.toggleAttribute('data-above', box.scrollTop > 2)
    box.toggleAttribute('data-below', below > AT_END)
  }

  // A new step: back to following, and the window glides down to its newest line.
  useLayoutEffect(() => { following.current = true }, [revealed])

  // While following, keep the newest line at the bottom of the window as lines arrive, animate in, or the window
  // itself is resized (the lesson screen fitting the card).
  useEffect(() => {
    const box = roll.current
    if (!box || typeof ResizeObserver === 'undefined') return
    let gliding = 0
    const follow = (smooth: boolean) => {
      if (following.current) {
        const top = box.scrollHeight - box.clientHeight
        if (Math.abs(box.scrollTop - top) > 1) box.scrollTo({ top, behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'auto' })
      }
      edges()
    }
    const observer = new ResizeObserver(() => follow(Date.now() < gliding))
    observer.observe(box)
    for (const child of box.children) observer.observe(child)
    gliding = Date.now() + 1500
    follow(true)
    const onScroll = () => {
      // Scrolled back up by the student (not by the glide): stop following until the next step.
      if (Date.now() > gliding) following.current = box.scrollHeight - box.clientHeight - box.scrollTop <= AT_END
      edges()
    }
    box.addEventListener('scroll', onScroll, { passive: true })
    return () => { observer.disconnect(); box.removeEventListener('scroll', onScroll) }
  }, [revealed, lines])

  // Each new step lands at the bottom of the working: keep the controls under it clear of the bottom bar,
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
    <WorkingWindow.Provider value={lines}>
      {shown && <div className={`wc-picture${steady ? ' wc-picture--steady' : ''}`}>{shown}</div>}
    </WorkingWindow.Provider>
    <div className="wc-roll" ref={roll}>
      <div className="wc-roll__lines" ref={setLines} />
      {!pictureOnly && <StepChain steps={steps} layout={layout} revealed={revealed} pace={pace} />}
    </div>
    {total > 0 && <div className="wc-controls" ref={controls}>
      <button type="button" className="wc-back" aria-label="Previous step" disabled={revealed === 1} onClick={() => setRevealed(revealed - 1)}>←</button>
      <StepDots total={total} current={revealed - 1} />
      {done
        ? <button type="button" className="wc-next wc-next--again" aria-label="Watch the working again" onClick={() => setRevealed(1)}>↺ Again</button>
        : !drive && <button type="button" className="wc-next" onClick={() => setRevealed(revealed + 1)}>{nextLabel}</button>}
    </div>}
  </figure>
}
