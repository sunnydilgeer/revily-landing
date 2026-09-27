/*
 * Skill-tree rails: the RPG look, where every link is straight lines and right angles.
 *
 * Nodes snap to a grid of columns. A parent drops straight out of its node (behind its label) to a rail in
 * the gap below its row,
 * the rail runs across, and the child is reached by a short drop, so siblings share one rail. A link that
 * skips rows goes straight down a column that is free, or down the gutter between two columns, so it never
 * runs behind another node. Corners are softly rounded.
 */
export type Grid = { width: number; cols: number; top: number; row: number }

/** Row spacing, and where in the gap below a row its rail runs (clear of labels and of the next row). */
export const ROW = 160
export const RAIL = 104
/** From a node's centre to just under its label and marks: the rails keep clear of other nodes' labels. */
export const LABEL_DROP = 48

export const colX = (grid: Grid, col: number) => (col + 0.5) / grid.cols * grid.width
export const rowY = (grid: Grid, row: number) => grid.top + row * grid.row
export const railY = (grid: Grid, row: number) => rowY(grid, row) + RAIL

type Topic = { id: string; requires?: string[] }

/**
 * Columns for each topic. Roots spread evenly (they may sit between two columns, over the children they
 * share a rail with); every later topic takes the free column nearest its parents' average; rows marked
 * `aside` keep to the right-hand columns.
 */
export function assignColumns(tiers: Topic[][], cols: number, aside: (row: number) => boolean = () => false) {
  const at = new Map<string, number>()
  tiers.forEach((tier, row) => {
    if (row === 0) {
      tier.forEach((topic, index) => at.set(topic.id, (index + 0.5) * cols / tier.length - 0.5))
      return
    }
    const desired = (topic: Topic) => {
      if (aside(row)) return cols - 1
      const parents = (topic.requires ?? []).map(id => at.get(id)).filter((col): col is number => col !== undefined)
      return parents.length ? parents.reduce((a, b) => a + b, 0) / parents.length : (cols - 1) / 2
    }
    const taken = new Set<number>()
    for (const topic of [...tier].sort((a, b) => desired(a) - desired(b))) {
      const want = desired(topic)
      const free = Array.from({ length: cols }, (_, col) => col).filter(col => !taken.has(col))
      const col = free.reduce((best, candidate) => Math.abs(candidate - want) < Math.abs(best - want) ? candidate : best, free[0])
      taken.add(col)
      at.set(topic.id, col)
    }
  })
  return at
}

export type RailNode = { id: string; row: number; col: number; x: number; y: number; size: number }

/** The corner points of the rail from one node to another. */
export function railPoints(grid: Grid, from: RailNode, to: RailNode, occupied: (row: number, col: number) => boolean): [number, number][] {
  const x1 = from.x, y1 = from.y + from.size / 2 - 2
  const x2 = to.x, y2 = to.y - to.size / 2 - 6
  const span = to.row - from.row
  const between = Array.from({ length: Math.max(0, span - 1) }, (_, i) => from.row + 1 + i)
  const clear = (col: number) => between.every(row => !occupied(row, col))

  if (span <= 1) {
    const rail = railY(grid, from.row)
    return x1 === x2 ? [[x1, y1], [x2, y2]] : [[x1, y1], [x1, rail], [x2, rail], [x2, y2]]
  }
  const first = railY(grid, from.row), last = railY(grid, to.row - 1)
  // Straight down the child's column, if nothing stands in it.
  if (clear(to.col)) return x1 === x2 ? [[x1, y1], [x2, y2]] : [[x1, y1], [x1, first], [x2, first], [x2, y2]]
  // Straight down the parent's column, then across.
  if (clear(from.col)) return [[x1, y1], [x1, last], [x2, last], [x2, y2]]
  // Down the gutter beside the parent, on the side the child is.
  const boundary = to.col > from.col ? Math.floor(from.col) + 1 : to.col < from.col ? Math.ceil(from.col) : from.col < grid.cols - 1 ? from.col + 1 : from.col
  const gx = boundary / grid.cols * grid.width
  return [[x1, y1], [x1, first], [gx, first], [gx, last], [x2, last], [x2, y2]]
}

/** An SVG path through the points, with each corner rounded (never more than half the shorter side). */
export function roundedPath(points: [number, number][], radius = 7) {
  const clean = points.filter((point, index) => index === 0 || point[0] !== points[index - 1][0] || point[1] !== points[index - 1][1])
  let d = `M ${clean[0][0]} ${clean[0][1]}`
  for (let i = 1; i < clean.length - 1; i++) {
    const [px, py] = clean[i - 1], [cx, cy] = clean[i], [nx, ny] = clean[i + 1]
    const inLength = Math.hypot(cx - px, cy - py), outLength = Math.hypot(nx - cx, ny - cy)
    const r = Math.min(radius, inLength / 2, outLength / 2)
    const ax = cx - (cx - px) / inLength * r, ay = cy - (cy - py) / inLength * r
    const bx = cx + (nx - cx) / outLength * r, by = cy + (ny - cy) / outLength * r
    d += ` L ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}`
  }
  const end = clean[clean.length - 1]
  return `${d} L ${end[0]} ${end[1]}`
}
