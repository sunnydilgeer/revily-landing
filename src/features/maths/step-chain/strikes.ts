/**
 * Red-pen crossings-out, measured from the page rather than drawn by each term.
 * Neighbouring cancelled terms on the same line ("+ 5 − 5") share one stroke, like a student
 * crossing them out by hand; terms apart from each other (a 12 on top, a 12 underneath) get one each.
 */

export type Strike = { row: number; x1: number; y1: number; x2: number; y2: number }

type Box = { left: number; right: number; top: number; bottom: number }

const middle = (box: Box) => (box.top + box.bottom) / 2

export function measureStrikes(stage: HTMLElement, rows: (HTMLElement | null)[]): Strike[] {
  const origin = stage.getBoundingClientRect()
  const strikes: Strike[] = []

  rows.forEach((row, index) => {
    if (!row) return
    const boxes: Box[] = [...row.querySelectorAll<HTMLElement>('[data-fate="cancel"]')]
      .map(term => term.getBoundingClientRect())
      .filter(rect => rect.width > 0)
      .map(({ left, right, top, bottom }) => ({ left, right, top, bottom }))
      .sort((a, b) => a.left - b.left)

    const groups: Box[] = []
    for (const box of boxes) {
      const group = groups.at(-1)
      const height = group ? group.bottom - group.top : 0
      if (group && Math.abs(middle(box) - middle(group)) < height * 0.35 && box.left - group.right < height * 0.5) {
        group.left = Math.min(group.left, box.left)
        group.right = Math.max(group.right, box.right)
        group.top = Math.min(group.top, box.top)
        group.bottom = Math.max(group.bottom, box.bottom)
      } else groups.push({ ...box })
    }

    for (const group of groups) {
      const height = group.bottom - group.top
      const reach = height * 0.08
      const tilt = Math.min(height * 0.3, (group.right - group.left) * 0.3)
      const y = middle(group) - origin.top
      strikes.push({
        row: index,
        x1: group.left - reach - origin.left, y1: y + tilt / 2,
        x2: group.right + reach - origin.left, y2: y - tilt / 2,
      })
    }
  })
  return strikes
}
