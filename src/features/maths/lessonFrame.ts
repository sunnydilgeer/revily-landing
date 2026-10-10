'use client'

import { useEffect } from 'react'

/**
 * The lesson page is one fixed screen (app-shell--frame in MathsNavigation.css): the page never scrolls, and a card
 * that is taller than its space scrolls inside itself. This marks such a card `data-more` while there is more below,
 * so it shows a soft fade at its bottom edge, and clears it once the student reaches the end. Before that it fits the
 * card's diagram to the room (see fit), and it keeps the answer box in view when the phone keyboard opens.
 */
/** Diagrams that may shrink to fit, with how small each may go: pictures most, worked working least (it is text). */
const SHRINKABLE: [string, number][] = [['.wc-picture', 0.55], ['.pvb-stage.ns-visual', 0.6], ['.pvb-stage', 0.8]]
/**
 * Boards students drag on keep their size: their touch maths assumes it. Graphs are never zoomed either: one on the
 * card's paper shrinks with the paper, and while it is still lining up (or draws its own grid) it is left as it is.
 */
const KEEP_SIZE = '.angle-board, .graph-board, .ns-graph__picture'
/** The smallest square of squared paper a graph may shrink to, and the least share of its usual square it keeps. */
const MIN_SQUARE = 24
const MIN_SHARE = 0.6
/**
 * The most one adjustment may shrink by. A step change can overflow for a moment while the old picture is still
 * there; small steps, each measured afresh, settle on the right size instead of overshooting on that moment.
 */
const MAX_STEP = 0.85

/** How much taller the card is than the room between the top of its section and the bottom bar (negative: room spare). */
function overflowOf(card: HTMLElement) {
  const section = card.parentElement
  const bar = section?.querySelector<HTMLElement>(':scope > .rv-checkbar')
  if (!section) return 0
  const px = (value: string) => parseFloat(value) || 0
  const own = getComputedStyle(card), box = getComputedStyle(section)
  const below = bar ? bar.offsetHeight + px(getComputedStyle(bar).marginBottom) : 0
  const room = section.clientHeight - px(box.paddingTop) - px(box.paddingBottom) - below - px(own.marginTop) - px(own.marginBottom)
  return card.scrollHeight + px(own.borderTopWidth) + px(own.borderBottomWidth) - room
}

/**
 * Makes a card's content fit the screen, so it rarely scrolls. A graph is drawn square for square on the card's
 * squared paper, so the paper's squares shrink (or grow back) and the graph follows them (GraphPictures.tsx realigns
 * on resize). Any other diagram is scaled with CSS zoom, never below its floor. Returns true when it changed something.
 */
function fit(card: HTMLElement) {
  const over = overflowOf(card)
  const graph = card.querySelector<SVGSVGElement>('svg.ns-graph__picture')
  if (graph) {
    if (graph.classList.contains('has-grid')) return false
    const base = Number(card.dataset.paperBase ||= String(parseFloat(getComputedStyle(card).backgroundSize) || 32))
    const square = parseFloat(card.style.getPropertyValue('--rv-paper-grid-size')) || base
    const height = graph.getBoundingClientRect().height, across = height / square
    let next = square
    if (over > 0) next = Math.max(MIN_SQUARE, Math.ceil(base * MIN_SHARE), Math.floor(square * MAX_STEP), Math.floor(square * (height - over - 2) / height))
    else if (square < base && -over >= across + 4) next = Math.min(base, square + Math.floor((-over - 4) / across))
    if (next === square) return false
    card.style.setProperty('--rv-paper-grid-size', `${next}px ${next}px`)
    window.dispatchEvent(new Event('resize'))
    return true
  }
  const candidates = SHRINKABLE.flatMap(([selector, floor]) => [...card.querySelectorAll<HTMLElement>(selector)]
    .filter(el => !el.querySelector(KEEP_SIZE) && !el.closest(KEEP_SIZE))
    .map(el => ({ el, floor, height: el.getBoundingClientRect().height })))
  const shrunk = candidates.find(c => c.el.style.zoom)
  const target = shrunk ?? candidates.sort((a, b) => b.height - a.height)[0]
  if (!target || target.height < 120 && !shrunk) return false
  const zoom = parseFloat(target.el.style.zoom) || 1
  let next = zoom
  if (over > 0) next = Math.max(target.floor, zoom * MAX_STEP, zoom * (target.height - over - 4) / target.height)
  else if (zoom < 1 && -over > 12) next = Math.min(1, zoom * (target.height - over - 8) / target.height)
  next = Math.round(next * 100) / 100
  if (Math.abs(next - zoom) < 0.01) return false
  target.el.style.zoom = next >= 1 ? '' : String(next)
  return true
}

export function useLessonFrame(root: HTMLElement | null) {
  useEffect(() => {
    if (!root) return
    let frame = 0
    const update = () => root.querySelectorAll<HTMLElement>('.rung-card, .rung-done').forEach(card => {
      // Fit first; a change re-measures on the next frame (its own style change schedules it).
      if (card.classList.contains('rung-card') && fit(card)) return
      card.toggleAttribute('data-more', card.scrollHeight - card.scrollTop - card.clientHeight > 4)
    })
    const schedule = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(update)
    }
    // The keyboard opening shrinks the screen (or, on iOS, the visible part of it): keep the box being typed in on show.
    const keepTyping = () => {
      schedule()
      const typing = document.activeElement
      if (typing instanceof HTMLInputElement && root.contains(typing)) window.requestAnimationFrame(() => typing.scrollIntoView({ block: 'nearest' }))
    }
    const changes = new MutationObserver(schedule)
    changes.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'style'] })
    const resize = new ResizeObserver(schedule)
    resize.observe(root)
    root.addEventListener('scroll', schedule, true)
    window.addEventListener('resize', keepTyping)
    window.visualViewport?.addEventListener('resize', keepTyping)
    schedule()
    return () => {
      window.cancelAnimationFrame(frame)
      changes.disconnect()
      resize.disconnect()
      root.removeEventListener('scroll', schedule, true)
      window.removeEventListener('resize', keepTyping)
      window.visualViewport?.removeEventListener('resize', keepTyping)
    }
  }, [root])
}
