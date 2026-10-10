'use client'

import { useEffect } from 'react'

/**
 * The lesson page is one fixed screen (app-shell--frame in MathsNavigation.css): the page never scrolls, and a card
 * that is taller than its space scrolls inside itself. This marks such a card `data-more` while there is more below,
 * so it shows a soft fade at its bottom edge, and clears it once the student reaches the end. It also keeps the answer
 * box in view when the phone keyboard opens.
 */
export function useLessonFrame(root: HTMLElement | null) {
  useEffect(() => {
    if (!root) return
    let frame = 0
    const update = () => root.querySelectorAll<HTMLElement>('.rung-card, .rung-done').forEach(card => {
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
