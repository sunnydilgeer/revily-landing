/*
 * Moving between the exercise book (paper) and the exam path (night): the next mode's surface opens out from
 * where the student tapped, then the page changes underneath it, so the switch feels like stepping through a
 * door rather than loading a different site. Reduced motion (or a modified click) goes straight there.
 */
import type { MouseEvent } from 'react'

export type Mode = 'paper' | 'night'

let listening = false
function clearOnReturn() {
  if (listening || typeof window === 'undefined') return
  listening = true
  // Coming back with the browser's back button restores the page from cache with the veil still over it.
  window.addEventListener('pageshow', () => document.querySelectorAll('.rv-veil').forEach(veil => veil.remove()))
}

export function goToMode(href: string, mode: Mode, from?: { x: number; y: number }) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { window.location.href = href; return }
  clearOnReturn()
  const veil = document.createElement('div')
  veil.className = `rv-veil rv-veil--${mode}`
  veil.style.setProperty('--x', `${from?.x ?? window.innerWidth / 2}px`)
  veil.style.setProperty('--y', `${from?.y ?? window.innerHeight / 2}px`)
  document.body.appendChild(veil)
  requestAnimationFrame(() => requestAnimationFrame(() => veil.classList.add('is-open')))
  window.setTimeout(() => { window.location.href = href }, 480)
}

/** An onClick for a link into the other mode. Cmd/ctrl/shift-clicks keep their usual behaviour. */
export function modeLink(mode: Mode) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    goToMode(event.currentTarget.href, mode, { x: event.clientX, y: event.clientY })
  }
}
