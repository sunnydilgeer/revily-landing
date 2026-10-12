'use client'

import { createContext, useCallback, useContext, useId, useLayoutEffect, useMemo, useState, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { GRAPH_SQUARES } from './methodWorking'

/*
 * One graph, one size, one place (Sunny, 12 Oct: "a medium size fixed positioned graph that looks the same whether it's
 * a worked example, a step of it, or the working after a wrong answer", drawn on the lesson page's own squares with no
 * second grid on top). A Graphs lesson's card has a single slot for its graph (TutorMethodLessonView.tsx): a square
 * GRAPH_SQUARES squares across, at the top left of the card on a laptop or desktop and at the top on a phone.
 * Whatever draws a graph on the card (a worked example's picture, a board, the working after an answer) hands its grid
 * to the slot with <InGraphSlot>, and the newest one is shown. The words that go with it stay in the card's words column.
 *
 * The slot's square is the card's square of squared paper. It is worked out from the card's own size alone, never
 * from what is on it, so it only changes when the window does (useGraphCard). The graph never measures itself or the
 * paper: the card's paper is lined up under the slot instead, which never changes the layout.
 */

/** How many squares across (and up) every graph is. Lesson grids are 6 to 11 squares; they are widened to this. */
export { GRAPH_SQUARES }
/** A graph's own unit: one square of its viewBox (UNIT in GraphPictures.tsx). Drawn at --rv-graph-scale times this. */
const GRAPH_UNIT = 32

type Slot = { element: HTMLElement | null; owner: string | null; claim: (id: string) => void; release: (id: string) => void }

/**
 * The card's graph slot. Undefined: not on a graph card (the graph draws where it stands). Null: drawn in place on
 * purpose, inside something already in the slot or in a worked example's out-of-sight rehearsal (WorkedChain.tsx).
 */
export const GraphSlot = createContext<Slot | null | undefined>(undefined)

/** The slot's state for a graph card: pass `ref` to the slot element and `slot` to <GraphSlot.Provider>. */
export function useGraphSlot() {
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const [stack, setStack] = useState<string[]>([])
  const claim = useCallback((id: string) => setStack(current => current.includes(id) ? current : [...current, id]), [])
  const release = useCallback((id: string) => setStack(current => current.filter(other => other !== id)), [])
  const slot = useMemo<Slot>(() => ({ element, owner: stack.at(-1) ?? null, claim, release }), [element, stack, claim, release])
  return { ref: setElement, slot }
}

/** Inside the slot: where the words that go with the graph are drawn, back in the card's words column (GraphWords). */
const WordsTarget = createContext<HTMLElement | null>(null)

/**
 * Draws its children (a graph's grid, or a board's surface) in the card's graph slot, in a box with `className` (the
 * classes its own styles hang off, as the graph or board has them where it stands). The newest one on the card is
 * shown and the others wait their turn: the working after a wrong answer takes the slot from the question's board, and
 * gives it back when it closes. Off a graph card it draws where it stands.
 */
export function InGraphSlot({ className, children }: { className?: string; children: ReactNode }) {
  const slot = useContext(GraphSlot)
  const id = useId()
  const [words, setWords] = useState<HTMLDivElement | null>(null)
  const claim = slot?.claim, release = slot?.release
  useLayoutEffect(() => {
    if (!claim || !release) return
    claim(id)
    return () => release(id)
  }, [claim, release, id])
  if (slot === undefined || slot === null) return <>{children}</>
  return <>
    <div className="graph-slot__words" ref={setWords} />
    {slot.owner === id && slot.element && createPortal(<GraphSlot.Provider value={null}><WordsTarget.Provider value={words}>
      <div className={className}>{children}</div>
    </WordsTarget.Provider></GraphSlot.Provider>, slot.element)}
  </>
}

/** Words that go with a graph (its table, a board's reading): beside the slot when the graph is in it, else in place. */
export function GraphWords({ children }: { children: ReactNode }) {
  const target = useContext(WordsTarget)
  return target ? createPortal(children, target) : <>{children}</>
}

/** The bottom bar at rest, and the card's gap above it (MathsNavigation.css): room the card never has. */
const BAR = 64 + 12

/**
 * The square of a graph card's paper, in px. From the card's width and the lesson screen's height only, never from
 * what is on the card or how tall the bottom bar is just now (a result panel is taller), so a graph keeps its size
 * from the question to its working, and changes only with the window.
 */
function squareFor(card: HTMLElement) {
  const style = getComputedStyle(card), px = (value: string) => parseFloat(value) || 0
  const width = card.clientWidth - px(style.paddingLeft) - px(style.paddingRight)
  if (window.matchMedia('(min-width: 900px)').matches) {
    // Beside the words: as tall as the screen allows, leaving the words column at least 280px.
    const section = card.parentElement ?? card
    const height = section.clientHeight - BAR - px(style.paddingTop) - px(style.paddingBottom) - px(style.borderTopWidth) - px(style.borderBottomWidth)
    return Math.max(28, Math.min(36, Math.floor((height - 1) / GRAPH_SQUARES), Math.floor((width - 281) / (GRAPH_SQUARES + 1.5))))
  }
  // At the top of the card: as wide as it. The phone keyboard opening never shrinks it.
  return Math.max(22, Math.min(36, Math.floor((width - 1) / GRAPH_SQUARES)))
}

/**
 * Sizes a graph card's squares (--graph-square, and --rv-graph-scale for the graph drawn on them) and lines the card's
 * squared paper up with the slot, so the graph's axes sit on the paper's own lines. The square is measured again only
 * when the lesson screen resizes; the slot moving (a longer question above it on a phone) only moves the paper.
 */
export function useGraphCard(card: RefObject<HTMLElement | null>, slot: HTMLElement | null) {
  useLayoutEffect(() => {
    const box = card.current, section = box?.parentElement
    if (!box || !section || !slot) return
    const align = () => {
      const square = parseFloat(box.style.getPropertyValue('--graph-square')) || GRAPH_UNIT
      const s = slot.getBoundingClientRect(), c = box.getBoundingClientRect()
      let left = s.left - c.left - box.clientLeft + box.scrollLeft, top = s.top - c.top - box.clientTop + box.scrollTop
      if (!s.width) {
        // No graph on this screen (the slot is hidden): where it would be, so the paper stays put for the next one.
        const style = getComputedStyle(box), px = (value: string) => parseFloat(value) || 0
        const room = box.clientWidth - px(style.paddingLeft) - px(style.paddingRight)
        left = px(style.paddingLeft) + (window.matchMedia('(min-width: 900px)').matches ? 0 : (room - square * GRAPH_SQUARES - 1) / 2)
        top = px(style.paddingTop)
      }
      const wrap = (v: number) => Math.round(((v % square) + square) % square * 100) / 100
      const position = `${wrap(left)}px ${wrap(top)}px`
      if (box.style.backgroundPosition !== position) box.style.backgroundPosition = position
    }
    let measured = ''
    const size = () => {
      const key = `${section.clientWidth}x${section.clientHeight}`
      if (key !== measured) {
        measured = key
        const square = squareFor(box)
        box.style.setProperty('--graph-square', `${square}px`)
        box.style.setProperty('--rv-graph-scale', String(square / GRAPH_UNIT))
        box.style.backgroundSize = `${square}px ${square}px`
      }
      align()
    }
    size()
    const observer = new ResizeObserver(size)
    observer.observe(section)
    observer.observe(slot)
    box.addEventListener('scroll', align, { passive: true })
    return () => {
      observer.disconnect()
      box.removeEventListener('scroll', align)
      for (const name of ['--graph-square', '--rv-graph-scale']) box.style.removeProperty(name)
      box.style.backgroundSize = box.style.backgroundPosition = ''
    }
  }, [card, slot])
}
