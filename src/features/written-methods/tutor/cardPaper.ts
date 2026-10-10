'use client'

import { useLayoutEffect, type RefObject } from 'react'

/**
 * Lines the lesson card's squared paper up with a picture drawn on squares (transformations, congruence, plans and
 * elevations, and the shear, enlarge and translate boards), so the shapes sit on the card's own paper and the squares
 * can be counted. Each such picture marks one of its squares with an invisible `.card-paper-square`; the card's paper
 * is sized and shifted to match the first one on the card. The picture scales with the screen, so it measures again
 * whenever the card or picture resizes. The paper scrolls with the card's content, so scrolling keeps it lined up.
 * Once no picture on the card has squares, the card's paper goes back to normal.
 */
function align(card: HTMLElement) {
  const square = card.querySelector<SVGRectElement>('.card-paper-square')
  const m = square?.getBoundingClientRect()
  if (!m?.width) {
    card.style.backgroundSize = card.style.backgroundPosition = card.style.backgroundAttachment = ''
    return
  }
  const c = card.getBoundingClientRect(), u = m.width
  const wrap = (v: number) => ((v % u) + u) % u
  card.style.backgroundSize = `${u}px ${u}px`
  card.style.backgroundPosition = `${wrap(m.left - c.left - card.clientLeft + card.scrollLeft)}px ${wrap(m.top - c.top - card.clientTop + card.scrollTop)}px`
  card.style.backgroundAttachment = 'local'
}

export function useCardPaper(marker: RefObject<SVGRectElement | null>, on: boolean) {
  useLayoutEffect(() => {
    const square = marker.current
    const card = square?.closest<HTMLElement>('.rung-card')
    if (!on || !square || !card) return
    const fit = () => align(card)
    fit()
    const resize = new ResizeObserver(fit)
    resize.observe(card)
    if (square.ownerSVGElement) resize.observe(square.ownerSVGElement)
    window.addEventListener('resize', fit)
    return () => {
      resize.disconnect()
      window.removeEventListener('resize', fit)
      // Measured once this picture has left the page: another picture on squares may still be on the card.
      window.requestAnimationFrame(fit)
    }
  })
}
