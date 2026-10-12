'use client'

import { useEffect } from 'react'
import { stepNeed } from './step-chain/WorkedChain'

/**
 * The lesson page is one fixed screen (app-shell--frame in MathsNavigation.css): the page never scrolls, and a card
 * that is taller than its space scrolls inside itself. This marks such a card `data-more` while there is more below,
 * so it shows a soft fade at its bottom edge, and clears it once the student reaches the end. Before that it fits the
 * card's diagram to the room (see fit), and it keeps the answer box in view when the phone keyboard opens.
 */
/** Diagrams that may shrink to fit, with how small each may go: pictures most, worked working least (it is text). */
const SHRINKABLE: [string, number][] = [['.wc-picture', 0.55], ['.pvb-stage.ns-visual', 0.6], ['.pvb-stage', 0.8]]
/**
 * Boards students drag on keep their size: their touch maths assumes it. Graphs are never zoomed either: a Graphs
 * lesson's card holds its graph at one size (GraphSlot.tsx) and is left alone (fit).
 */
const KEEP_SIZE = '.angle-board, .graph-board, .ns-graph__picture'
/**
 * The most one adjustment may shrink by. A step change can overflow for a moment while the old picture is still
 * there; small steps, each measured afresh, settle on the right size instead of overshooting on that moment.
 */
const MAX_STEP = 0.85
/** The smallest text a shrunk diagram may show, in screen pixels: past this it stays readable and the card scrolls. */
const MIN_TEXT = 11

/** The smallest text in a diagram as drawn on screen (zoom and an SVG's own scaling included), or Infinity. */
function smallestText(diagram: HTMLElement) {
  let smallest = Infinity
  for (const label of diagram.querySelectorAll<SVGTextElement>('text')) {
    const height = label.getBoundingClientRect().height
    if (height && label.textContent?.trim()) smallest = Math.min(smallest, height / 1.2)
  }
  const zoom = parseFloat(diagram.style.zoom) || 1
  for (const el of diagram.querySelectorAll<HTMLElement>('p, li, span, strong, td, th, small, b, label')) {
    if (el.closest('svg') || !el.textContent?.trim() || !el.getBoundingClientRect().width) continue
    smallest = Math.min(smallest, parseFloat(getComputedStyle(el).fontSize) * zoom)
  }
  return smallest
}

/** The shortest a worked example's working window gets (about three lines), however little its step needs. */
const MIN_ROLL = 132

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
 * Makes a card's content fit the screen, so it rarely scrolls. A worked example's working window shrinks first; then
 * the diagram is scaled with CSS zoom, never below its floor or past readable text (MIN_TEXT). Returns true when it
 * changed something.
 */
function fit(card: HTMLElement) {
  // A Graphs lesson's card is laid out around its fixed graph (GraphSlot.tsx, graphs.css): nothing on it is resized.
  if (card.classList.contains('rung-card--graph')) return false
  const over = overflowOf(card)
  // A worked example's working rolls in its own window (WorkedChain.tsx). The window gives way first, but never below
  // what the step on screen needs, so none of the step's lines are hidden (Sunny, 10 Oct); short of that the diagram
  // shrinks to make room, and only then does the window get shorter still. It grows back first when there is room.
  // The diagram is sized once for the worked example's tallest step (Sunny, 12 Oct: the bars shrank on the last steps
  // as the working grew). WorkedChain.tsx measures every step up front, so the window keeps its room on every step, and
  // on the opening screen the diagram already leaves the room the later steps will need (`ahead`).
  const roll = card.querySelector<HTMLElement>('.wc-roll')
  let short = 0, ahead = 0
  const tallest = Number(roll?.dataset.need) || 0
  const eventual = Math.min(Number(roll?.dataset.full) || 0, Math.max(MIN_ROLL, tallest))
  if (roll && !roll.offsetParent && eventual) {
    // No working yet (a picture-only working before its first step): the window and its gap are still to come.
    ahead = eventual + (parseFloat(getComputedStyle(roll.parentElement!).rowGap) || 0)
  }
  if (roll && roll.offsetParent) {
    const height = roll.clientHeight, capped = roll.style.maxHeight !== ''
    const keep = Math.max(MIN_ROLL, stepNeed(roll), tallest)
    if (over > 0 && height > keep) {
      roll.style.maxHeight = `${Math.max(keep, Math.floor(height - over - 2))}px`
      return true
    }
    // Room to spare goes to a shrunk diagram first once the step fits; otherwise to the window.
    if (over < -6 && capped && !(height >= keep && diagramShrunk(card))) {
      const next = Math.floor(height - over - 4)
      roll.style.maxHeight = next >= roll.scrollHeight ? '' : `${next}px`
      return true
    }
    if (capped) short = Math.max(0, Math.min(roll.scrollHeight, keep) - height)
    ahead = Math.max(0, eventual - height)
  }
  // A picture that grows on a later step (a row added) leaves room for that too, at its present zoom. Not a graph or a
  // board: they keep their size or follow the paper, so the rehearsal's copy is a moving target (Sunny, 12 Oct: the
  // graph on "Draw y = 3" flickered between two sizes).
  const picture = card.querySelector<HTMLElement>('.wc-picture[data-tallest]')
  if (picture && !picture.querySelector(KEEP_SIZE)) {
    const zoom = parseFloat(picture.style.zoom) || 1
    ahead += Math.max(0, Number(picture.dataset.tallest) * zoom - picture.getBoundingClientRect().height)
  }
  if (diagramFits(card, over + Math.max(short, ahead))) return true
  // The diagram can't give any more. Missing lines are worse than a card that scrolls a little (Sunny, 10 Oct), so
  // the window still shows the whole step and the card scrolls instead.
  if (roll && short > 0) {
    const next = roll.clientHeight + short
    roll.style.maxHeight = next >= roll.scrollHeight ? '' : `${next}px`
    return true
  }
  return false
}

/** The card's diagram is drawn smaller than its own size (zoomed). */
function diagramShrunk(card: HTMLElement) {
  return [...card.querySelectorAll<HTMLElement>('[style*="zoom"]')].some(el => !el.querySelector('.wc-roll'))
}

/** Shrinks (or grows back) the card's diagram by `over` pixels. Returns true when it changed something. */
function diagramFits(card: HTMLElement, over: number) {
  const candidates = SHRINKABLE.flatMap(([selector, floor]) => [...card.querySelectorAll<HTMLElement>(selector)]
    // A box holding a worked example's working window is not a diagram: its picture (.wc-picture) is. Nor is anything
    // in a worked example's out-of-sight rehearsal (WorkedChain.tsx).
    .filter(el => !el.querySelector(KEEP_SIZE) && !el.closest(KEEP_SIZE) && !el.querySelector('.wc-roll') && !el.closest('.wc-rehearsal'))
    // A worked example's picture counts at its tallest step's height (data-tallest, WorkedChain.tsx).
    .map(el => ({ el, floor, height: Math.max(el.getBoundingClientRect().height, Number(el.dataset.tallest) * (parseFloat(el.style.zoom) || 1) || 0) })))
  const shrunk = candidates.find(c => c.el.style.zoom)
  const target = shrunk ?? candidates.sort((a, b) => b.height - a.height)[0]
  if (!target || target.height < 120 && !shrunk) return false
  const zoom = parseFloat(target.el.style.zoom) || 1
  let next = zoom
  // Never shrink a diagram's labels past readable (Sunny, 10 Oct: angle names went down to 7px on a laptop).
  const legible = zoom * MIN_TEXT / smallestText(target.el)
  if (over > 0) next = Math.min(zoom, Math.max(target.floor, legible, zoom * MAX_STEP, zoom * (target.height - over - 4) / target.height))
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
    let settle = 0
    const schedule = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(update)
      // Once things go quiet, look once more: a step's lines finish sliding in (an animation ending changes the layout
      // without touching the page), and the card may now have room to give back.
      window.clearTimeout(settle)
      settle = window.setTimeout(() => { frame = window.requestAnimationFrame(update) }, 700)
    }
    // The keyboard opening shrinks the screen (or, on iOS, the visible part of it): keep the box being typed in on show.
    const keepTyping = () => {
      schedule()
      const typing = document.activeElement
      if (typing instanceof HTMLInputElement && root.contains(typing)) window.requestAnimationFrame(() => typing.scrollIntoView({ block: 'nearest' }))
    }
    const changes = new MutationObserver(schedule)
    changes.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'style', 'data-need', 'data-full', 'data-tallest'] })
    const resize = new ResizeObserver(schedule)
    resize.observe(root)
    root.addEventListener('scroll', schedule, true)
    root.addEventListener('animationend', schedule, true)
    root.addEventListener('transitionend', schedule, true)
    window.addEventListener('resize', keepTyping)
    window.visualViewport?.addEventListener('resize', keepTyping)
    schedule()
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(settle)
      changes.disconnect()
      resize.disconnect()
      root.removeEventListener('scroll', schedule, true)
      root.removeEventListener('animationend', schedule, true)
      root.removeEventListener('transitionend', schedule, true)
      window.removeEventListener('resize', keepTyping)
      window.visualViewport?.removeEventListener('resize', keepTyping)
    }
  }, [root])
}
