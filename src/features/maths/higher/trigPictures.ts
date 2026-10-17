/*
 * Triangles that aren't right-angled, for the Higher sine and cosine rule lessons (20H, 20H2): placed from the angles or
 * sides the question gives, so every triangle is drawn to scale, then turned to sit the way the book draws it.
 */
import type { AngleFrame, FigurePoint } from '../../written-methods/tutor/methodWorking'
import { triangleFig, type TriAngle, type TriSide } from '../../geometry/tutor/figureLesson'

export type Pt = FigurePoint
export type Tri = [Pt, Pt, Pt]
export const rad = (deg: number) => deg * Math.PI / 180
export const deg = (r: number) => r * 180 / Math.PI

/** A base `c` along the bottom with angles `left` and `right` on it: [left corner, right corner, top]. */
export function fromAngles(c: number, left: number, right: number): Tri {
  const b = c * Math.sin(rad(right)) / Math.sin(rad(left + right))
  return [[0, 0], [c, 0], [b * Math.cos(rad(left)), b * Math.sin(rad(left))]]
}
/** A base `c` along the bottom, and a side `b` up from its left end at `angle`: [left corner, right corner, top]. */
export const fromSAS = (c: number, b: number, angle: number): Tri => [[0, 0], [c, 0], [b * Math.cos(rad(angle)), b * Math.sin(rad(angle))]]
/** Three sides: `c` along the bottom, `b` up from its left end and `a` up from its right end. */
export function fromSSS(a: number, b: number, c: number): Tri {
  return fromSAS(c, b, deg(Math.acos((b * b + c * c - a * a) / (2 * b * c))))
}
/** The triangle turned `turn` degrees anticlockwise about its first corner, and flipped upside down when `flip`. */
export const turned = (pts: Tri, turn: number, flip = false): Tri => pts.map(([x, y]) => {
  const u = flip ? -y : y
  return [x * Math.cos(rad(turn)) - u * Math.sin(rad(turn)), x * Math.sin(rad(turn)) + u * Math.cos(rad(turn))]
}) as Tri

/**
 * A triangle drawn to scale: side k runs from corner k to corner k + 1; a little more room for long labels. `inside`
 * lists corners whose angle label is pulled in towards the middle, for an obtuse angle whose label would otherwise
 * land well outside the corner.
 */
export function tri(pts: Tri, o: { sides?: (TriSide | undefined)[]; angles?: TriAngle[]; names?: string[]; right?: number; spoken: string; caption?: string; inside?: number[] }): AngleFrame {
  const { inside = [], ...rest } = o
  const frame = triangleFig(pts, { ...rest, room: 34 })
  const G: Pt = [(pts[0][0] + pts[1][0] + pts[2][0]) / 3, (pts[0][1] + pts[1][1] + pts[2][1]) / 3]
  for (const at of inside) {
    const angle = o.angles?.find(a => a.at === at), v = pts[at]
    const item = frame.figure?.items.find(i => i.kind === 'text' && i.text === angle?.label && !i.name && i.dx === undefined)
    if (item && item.kind === 'text') item.at = [v[0] + 0.5 * (G[0] - v[0]), v[1] + 0.5 * (G[1] - v[1])]
  }
  return frame
}
