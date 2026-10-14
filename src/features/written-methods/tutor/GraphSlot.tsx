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
/** The lesson screen's side gutter on a wide screen (graphs.css). */
const GUTTER = 16
/** Wide screens, in squares: a square of margin all round, the graph, a square's gap, and the words (10 to 12 across). */
const MARGIN = 1, GAP = 1, WORDS_MIN = 10, WORDS_MAX = 12
const SQUARE_MAX = 60

/** A wide graph card's whole layout, in squares of `square` px (Sunny, 14 Oct: no empty half card, even margins). */
type Wide = { square: number; width: number; top: number; bottom: number }

const wide = () => window.matchMedia('(min-width: 900px)').matches

/**
 * A wide graph card, worked out from the screen alone (never from what is on the card, or how tall the bottom bar is
 * just now), so a graph keeps its size and place from the question to its working, and changes only with the window.
 * The square is as big as the screen's height allows (up to SQUARE_MAX), and the card is a whole number of squares
 * across, so its paper meets both edges on a line and the left and right margins are both one square. Height left
 * over is split evenly above and below the graph and the words.
 */
function wideLayout(card: HTMLElement, section: HTMLElement): Wide {
  const style = getComputedStyle(card), px = (value: string) => parseFloat(value) || 0
  const borderX = px(style.borderLeftWidth) + px(style.borderRightWidth), borderY = px(style.borderTopWidth) + px(style.borderBottomWidth)
  const roomX = window.innerWidth - 2 * GUTTER - borderX
  const roomY = section.clientHeight - BAR - borderY
  const across = 2 * MARGIN + GRAPH_SQUARES + GAP
  const square = Math.max(28, Math.min(SQUARE_MAX, Math.floor((roomY - 1) / (GRAPH_SQUARES + 2 * MARGIN)), Math.floor(roomX / (across + WORDS_MIN))))
  const words = Math.max(WORDS_MIN, Math.min(WORDS_MAX, Math.floor(roomX / square) - across))
  const rows = Math.floor(roomY / square), spare = roomY - rows * square
  const above = MARGIN + Math.max(0, Math.floor((rows - GRAPH_SQUARES - 2 * MARGIN) / 2))
  const top = Math.round(spare / 2 + above * square)
  return { square, width: (across + words) * square + borderX, top, bottom: Math.round(spare / 2 + MARGIN * square) }
}

/** A phone's graph card: the graph as wide as the card. The phone keyboard opening never shrinks it. */
function narrowSquare(card: HTMLElement) {
  const style = getComputedStyle(card), px = (value: string) => parseFloat(value) || 0
  const width = card.clientWidth - px(style.paddingLeft) - px(style.paddingRight)
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
        left = px(style.paddingLeft) + (wide() ? 0 : (room - square * GRAPH_SQUARES - 1) / 2)
        top = px(style.paddingTop)
      }
      const wrap = (v: number) => Math.round(((v % square) + square) % square * 100) / 100
      const position = `${wrap(left)}px ${wrap(top)}px`
      if (box.style.backgroundPosition !== position) box.style.backgroundPosition = position
    }
    const shell = box.closest<HTMLElement>('.app-shell')
    let measured = ''
    const size = () => {
      const key = `${window.innerWidth}x${section.clientHeight}`
      if (key !== measured) {
        measured = key
        let square
        if (wide()) {
          const layout = wideLayout(box, section)
          square = layout.square
          shell?.style.setProperty('--graph-card-width', `${layout.width}px`)
          box.style.padding = `${layout.top}px ${square}px ${layout.bottom}px`
        } else {
          shell?.style.removeProperty('--graph-card-width')
          box.style.padding = ''
          square = narrowSquare(box)
        }
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
      shell?.style.removeProperty('--graph-card-width')
      box.style.backgroundSize = box.style.backgroundPosition = box.style.padding = ''
    }
  }, [card, slot])
}
