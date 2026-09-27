/**
 * Moves the terms of one line of working into their places on the next line.
 *
 * Both lines are real DOM. Any element carrying data-k="key" is a term: when the next line has
 * the same key, a copy of the term flies from its old place to its new one; when the step merges
 * several keys into one (20 and − 5 becoming 15), each source flies into the result and fades.
 * The new line stays invisible while the copies travel, so the student sees the terms arrive.
 */

/** Long enough to read the operation before anything moves. */
export const FLIGHT_DELAY = 450
export const FLIGHT_MS = 560

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function termsIn(row: HTMLElement) {
  const terms = new Map<string, HTMLElement>()
  row.querySelectorAll<HTMLElement>('[data-k]').forEach(el => terms.set(el.dataset.k!, el))
  return terms
}

function centre(rect: DOMRect) {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

/**
 * Flies each term from `from` to `to` inside `stage` (which must be position: relative).
 * Calls `onArrive` once every copy has landed. Returns a function that stops the flight early.
 */
export function flyTerms({ stage, from, to, merge = {}, pace = 1, onArrive }: {
  stage: HTMLElement
  from: HTMLElement
  to: HTMLElement
  merge?: Record<string, string[]>
  /** Multiplies every duration: 1 is normal, above 1 is slower. */
  pace?: number
  onArrive: () => void
}) {
  const sources = termsIn(from)
  const stageBox = stage.getBoundingClientRect()
  const ghosts: HTMLElement[] = []
  const animations: Animation[] = []

  termsIn(to).forEach((target, key) => {
    const merging = key in merge
    const keys = merging ? merge[key] : [key]
    const targetBox = target.getBoundingClientRect()
    for (const sourceKey of keys) {
      const source = sources.get(sourceKey)
      if (!source) continue
      const sourceBox = source.getBoundingClientRect()

      // KaTeX sizes numerators and exponents through ancestor classes, so the copy carries its own font size.
      const ghost = document.createElement('span')
      ghost.className = `katex sc-ghost${merging ? ' sc-ghost--merging' : ''}`
      ghost.style.fontSize = getComputedStyle(source).fontSize
      ghost.style.color = getComputedStyle(source).color
      ghost.appendChild(source.cloneNode(true))
      ghost.style.left = `${sourceBox.left - stageBox.left}px`
      ghost.style.top = `${sourceBox.top - stageBox.top}px`
      stage.appendChild(ghost)
      ghosts.push(ghost)

      // Line the copy's centre up with the original, whatever KaTeX's vertical alignment did to its box.
      const placed = centre(ghost.getBoundingClientRect()), wanted = centre(sourceBox)
      ghost.style.left = `${sourceBox.left - stageBox.left + wanted.x - placed.x}px`
      ghost.style.top = `${sourceBox.top - stageBox.top + wanted.y - placed.y}px`
      const start = wanted
      const end = centre(targetBox)
      const scale = merging || !sourceBox.height ? 1 : targetBox.height / sourceBox.height
      animations.push(ghost.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${end.x - start.x}px, ${end.y - start.y}px) scale(${scale})`, opacity: merging ? 0 : 1 },
      ], { duration: FLIGHT_MS * pace, delay: FLIGHT_DELAY * pace, easing: 'cubic-bezier(.3, .7, .2, 1)', fill: 'both' }))
    }
  })

  let stopped = false
  const finish = () => {
    if (stopped) return
    stopped = true
    ghosts.forEach(ghost => ghost.remove())
    onArrive()
  }
  // With nothing to fly (a line of working that is written fresh), the line appears once the operation has been read.
  const timer = window.setTimeout(finish, (ghosts.length ? FLIGHT_DELAY + FLIGHT_MS : FLIGHT_DELAY) * pace)
  return () => {
    window.clearTimeout(timer)
    animations.forEach(animation => animation.cancel())
    ghosts.forEach(ghost => ghost.remove())
    stopped = true
  }
}
