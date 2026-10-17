/* Shared by the Higher geometry lessons and sections: a question drawn as a measured figure, and angle marks on it. */
import { working } from '../../written-methods/model'
import type { AngleFrame, FigureItem, FigurePoint, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { StepWorking } from '../../written-methods/tutor/stepWorking'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import type { author } from '../../written-methods/tutor/content'
import { triangleFig, type TriAngle, type TriSide } from '../../geometry/tutor/figureLesson'

type Author = ReturnType<typeof author>
type Pt = FigurePoint

/** A figure picture with its own margin: `pad` smaller than the usual 38 pixels draws it bigger. */
export const figure = (items: FigureItem[], spoken: string, caption?: string, pad?: number): AngleFrame => ({
  shape: 'figure', angles: [], labels: [], figure: { items, spoken, ...(caption ? { caption } : {}), ...(pad ? { pad } : {}) },
})

/** A question with its figure above the answer, and a step working ("See the working") that ends on the answer. */
export function asks({ add }: Author) {
  return function ask(topic: MicroSkillId, title: string, sourceRef: string, picture: AngleFrame, interaction: InteractionDefinition, answer: string, hint: string, model: StepWorking, box?: { label?: string; prefix?: string }) {
    const state = add(topic, title, sourceRef, { kind: 'angle', angle: picture }, interaction, working(answer, ...model.steps.map(step => [step.title, step.why] as [string, string])), hint)
    state.working = model
    if (box?.label) state.answerLabel = box.label
    if (box?.prefix) state.answerPrefix = box.prefix
    return state
  }
}

const toDeg = (v: Pt, p: Pt) => Math.atan2(p[1] - v[1], p[0] - v[0]) * 180 / Math.PI

/**
 * The angle at `v` between the lines to `p` and `q`: an arc and its label set inside the angle (`away` from the corner,
 * in the figure's units). `reflex` marks the larger way round.
 */
export function angleMark(v: Pt, p: Pt, q: Pt, label: string, o: { tone?: FigureTone; reflex?: boolean; r?: number; away?: number } = {}): FigureItem[] {
  let from = toDeg(v, p), turn = ((toDeg(v, q) - from) % 360 + 360) % 360
  if ((turn > 180) !== Boolean(o.reflex)) { from = toDeg(v, q); turn = 360 - turn }
  const r = o.r ?? (turn < 35 ? 0.26 : 0.18), mid = (from + turn / 2) * Math.PI / 180
  const away = o.away ?? (o.reflex ? 0.26 : turn < 35 ? 0.62 : turn < 60 ? 0.42 : 0.34) + (label.length > 3 ? 0.06 : 0)
  const tone = o.tone ?? 'given'
  return [
    { kind: 'arc', centre: v, r, from, to: from + turn, style: tone === 'lit' || tone === 'found' || tone === 'x' ? tone : 'plain' },
    { kind: 'text', at: [v[0] + away * Math.cos(mid), v[1] + away * Math.sin(mid)], text: label, tone },
  ]
}

/** One triangle of a pair: its corners, side labels (side k runs from corner k to k + 1), angles and right angle. */
export type PairTri = { pts: [Pt, Pt, Pt]; sides?: (TriSide | undefined)[]; angles?: TriAngle[]; right?: number; names?: string[] }

/**
 * Two triangles side by side, the second `gap` units to the right of the first (a quarter of the wider one's width if
 * not given), drawn with triangleFig's labels and a small margin so they come out as big as they can.
 */
export function pairFig(left: PairTri, right: PairTri, spoken: string, caption?: string, gap?: number): AngleFrame {
  const width = (t: PairTri) => Math.max(...t.pts.map(p => p[0])) - Math.min(...t.pts.map(p => p[0]))
  const space = gap ?? 0.25 * Math.max(width(left), width(right))
  const shiftBy = Math.max(...left.pts.map(p => p[0])) + space - Math.min(...right.pts.map(p => p[0]))
  const moved: PairTri = { ...right, pts: right.pts.map(([x, y]) => [x + shiftBy, y]) as [Pt, Pt, Pt] }
  const total = width(left) + space + width(right)
  // triangleFig sets its angle labels for one triangle filling a picture 244 pixels wide; tell it how many pixels across
  // each one really gets here (256 across the pair, with this picture's smaller margin).
  const items = [left, moved].flatMap(t => {
    const room = Math.max(0, (244 - 256 * width(t) / total) / 2)
    return triangleFig(t.pts, { sides: t.sides, angles: t.angles, right: t.right, names: t.names, spoken, room }).figure!.items
  // An angle marked with no label is just its arc.
  }).filter(item => item.kind !== 'text' || item.text)
  return { shape: 'figure', angles: [], labels: [], figure: { items, spoken, ...(caption ? { caption } : {}), room: 10, pad: 22 } }
}

/** Figure items moved `dx` across and `dy` up, for setting two pictures side by side. */
export function shiftItems(items: FigureItem[], dx: number, dy = 0): FigureItem[] {
  const m = ([x, y]: Pt): Pt => [x + dx, y + dy]
  return items.map(item => {
    switch (item.kind) {
      case 'shape': return { ...item, points: item.points.map(m) }
      case 'line': case 'measure': case 'ticks': return { ...item, from: m(item.from), to: m(item.to) }
      case 'circle': case 'arc': return { ...item, centre: m(item.centre) }
      case 'right': return { ...item, at: m(item.at), a: m(item.a), b: m(item.b) }
      case 'point': case 'text': return { ...item, at: m(item.at) }
      default: return item
    }
  })
}
