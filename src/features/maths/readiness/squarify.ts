/*
 * Squarified treemap layout (Bruls, Huizing and van Wijk): lays items out in rows along the shorter side of
 * the space left, starting a new row whenever adding an item would make the row's tiles less square.
 */
export type Rect = { x: number; y: number; w: number; h: number }

export function squarify<T>(items: { value: number; item: T }[], rect: Rect): (Rect & { item: T })[] {
  const total = items.reduce((sum, entry) => sum + entry.value, 0)
  if (total <= 0 || rect.w <= 0 || rect.h <= 0) return []
  const scale = rect.w * rect.h / total
  const queue = items.filter(entry => entry.value > 0).map(entry => ({ area: entry.value * scale, item: entry.item })).sort((a, b) => b.area - a.area)
  const out: (Rect & { item: T })[] = []
  let space = { ...rect }
  let row: typeof queue = []

  const worst = (areas: number[], side: number) => {
    const sum = areas.reduce((a, b) => a + b, 0)
    return Math.max(side * side * Math.max(...areas) / (sum * sum), sum * sum / (side * side * Math.min(...areas)))
  }
  const place = () => {
    const sum = row.reduce((a, entry) => a + entry.area, 0)
    if (space.w >= space.h) {
      // A column down the left of the space.
      const width = sum / space.h
      let y = space.y
      for (const entry of row) { const h = entry.area / width; out.push({ x: space.x, y, w: width, h, item: entry.item }); y += h }
      space = { x: space.x + width, y: space.y, w: space.w - width, h: space.h }
    } else {
      // A row across the top of the space.
      const height = sum / space.w
      let x = space.x
      for (const entry of row) { const w = entry.area / height; out.push({ x, y: space.y, w, h: height, item: entry.item }); x += w }
      space = { x: space.x, y: space.y + height, w: space.w, h: space.h - height }
    }
    row = []
  }

  while (queue.length) {
    const side = Math.min(space.w, space.h)
    const areas = row.map(entry => entry.area)
    if (!row.length || worst([...areas, queue[0].area], side) <= worst(areas, side)) row.push(queue.shift()!)
    else place()
  }
  if (row.length) place()
  return out
}
