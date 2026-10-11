import { working } from '../../written-methods/model'
import type { AngleFrame, FigureItem, FigurePoint, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { MeasureBoardSpec } from '../../written-methods/tutor/MeasureBoard'
import type { TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { text } from '../../simultaneous-equations/tutor/boardWorkings'
import type { author } from '../../written-methods/tutor/content'

/*
 * Shared by geometry lessons 5 to 21 (symmetry, area, circles, perimeter, sectors, and lessons 10 to 21): the four kinds of screen, built the
 * same way as lessons 1 to 4. A play screen opens a rung on the measuring board (MeasureBoard.tsx); a worked example
 * steps through its working; a question shows its own measured figure (FigurePictures.tsx), takes the answer, and
 * opens the same step-by-step working after.
 */

/** A measured figure as a picture: drawn by FigurePictures.tsx, carried in the angle picture's slot. */
export const fig = (items: FigureItem[], spoken: string, caption?: string, room?: number): AngleFrame => ({ shape: 'figure', angles: [], labels: [], figure: { items, spoken, ...(caption ? { caption } : {}), ...(room ? { room } : {}) } })

/** A side of a triangle: its label, set just outside it, and its tone (`lit`, `found` or `x` draw the side in that colour too). */
export type TriSide = { label?: string; tone?: FigureTone }
/** An angle marked inside a triangle at corner `at`, with an arc and its label. */
export type TriAngle = { at: number; label: string; tone?: FigureTone }

/**
 * A triangle drawn to scale (lessons 19 and 20): side k runs from corner k to corner k + 1, each label just outside
 * it; `names` letter the corners; `right` marks the right angle at that corner; `angles` mark angles with an arc;
 * `room` leaves more space left and right for long labels (28 pixels if not given).
 */
export function triangleFig(pts: [FigurePoint, FigurePoint, FigurePoint], o: { sides?: (TriSide | undefined)[]; names?: string[]; right?: number; angles?: TriAngle[]; spoken: string; caption?: string; extra?: FigureItem[]; room?: number }): AngleFrame {
  const items: FigureItem[] = [{ kind: 'shape', points: pts }]
  const G: FigurePoint = [(pts[0][0] + pts[1][0] + pts[2][0]) / 3, (pts[0][1] + pts[1][1] + pts[2][1]) / 3]
  const size = Math.max(...pts.map((a, k) => Math.hypot(pts[(k + 1) % 3][0] - a[0], pts[(k + 1) % 3][1] - a[1])))
  pts.forEach((a, k) => {
    const b = pts[(k + 1) % 3], side = o.sides?.[k]
    if (!side) return
    if (side.tone === 'lit' || side.tone === 'found' || side.tone === 'x') items.push({ kind: 'line', from: a, to: b, style: side.tone })
    if (!side.label) return
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]), m: FigurePoint = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    let nx = (b[1] - a[1]) / len, ny = -(b[0] - a[0]) / len
    if ((m[0] - G[0]) * nx + (m[1] - G[1]) * ny < 0) { nx = -nx; ny = -ny }
    // Far enough out that the label's box, its width across and its height up, clears the side.
    const d = 10 + Math.abs(nx) * (side.label.length * 4.5 + 7) + Math.abs(ny) * 14
    items.push({ kind: 'text', at: m, text: side.label, tone: side.tone ?? 'given', dx: nx * d, dy: -ny * d })
  })
  if (o.right !== undefined) items.push({ kind: 'right', at: pts[o.right], a: pts[(o.right + 1) % 3], b: pts[(o.right + 2) % 3] })
  for (const angle of o.angles ?? []) {
    const v = pts[angle.at], p = pts[(angle.at + 1) % 3], q = pts[(angle.at + 2) % 3]
    const deg = (to: FigurePoint) => Math.atan2(to[1] - v[1], to[0] - v[0]) * 180 / Math.PI
    let from = deg(p), turn = ((deg(q) - from) % 360 + 360) % 360
    if (turn > 180) { from = deg(q); turn = 360 - turn }
    // Out along the middle of the angle, far enough that the label (boxed when lit or found) sits clear of both sides,
    // worked in pixels at about the scale the figure is drawn (FigurePictures.tsx fits it into 320 by 210).
    const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]), room = o.room ?? 28
    const px = Math.min((320 - 2 * (38 + room)) / (Math.max(...xs) - Math.min(...xs) || 1), 134 / (Math.max(...ys) - Math.min(...ys) || 1))
    const half = angle.tone === 'lit' || angle.tone === 'found' ? angle.label.length * 4.5 + 9 : angle.label.length * 3.5 + 4
    const r = 0.15 * size, mid = (from + turn / 2) * Math.PI / 180
    const u: FigurePoint = [Math.cos(mid), Math.sin(mid)]
    // How far along the middle of the angle the opposite side is: a label that won't fit inside goes just outside the corner.
    const e: FigurePoint = [q[0] - p[0], q[1] - p[1]], cross = u[0] * e[1] - u[1] * e[0]
    const across = cross ? ((p[0] - v[0]) * e[1] - (p[1] - v[1]) * e[0]) / cross : Infinity
    let away = Math.max(r * px + 14, (half + 4) / Math.sin(turn * Math.PI / 360)) / px
    if (away > 0.6 * across) away = -(r * px + half * 0.8 + 10) / px
    items.push({ kind: 'arc', centre: v, r, from, to: from + turn, style: angle.tone === 'found' ? 'found' : angle.tone === 'lit' ? 'lit' : angle.tone === 'x' ? 'x' : 'plain' })
    items.push({ kind: 'text', at: [v[0] + away * u[0], v[1] + away * u[1]], text: angle.label, tone: angle.tone ?? 'given' })
  }
  o.names?.forEach((name, k) => {
    const v = pts[k], len = Math.hypot(v[0] - G[0], v[1] - G[1])
    items.push({ kind: 'text', at: v, text: name, name: true, dx: (v[0] - G[0]) / len * 14 - 4, dy: -(v[1] - G[1]) / len * 14 + 5 })
  })
  items.push(...(o.extra ?? []))
  return fig(items, o.spoken, o.caption, o.room ?? 28)
}

/** The answer box: its label (the unit after it, in brackets) and what goes before it. */
export type Box = { label?: string; prefix: string }

/** Rounds to so many decimal places, as a number: 32.169… to 1 dp is 32.2. */
export const dp = (n: number, places = 1) => Number(n.toFixed(places))
/** Rounds to so many significant figures. */
export const sf = (n: number, figures = 3) => Number(n.toPrecision(figures))
/** A number as the board writes it: no trailing zeros, except to show the decimal places asked for. */
export const show = (n: number, places?: number) => places === undefined ? String(n) : n.toFixed(places)

export function screens(lesson: ReturnType<typeof author>) {
  const { add } = lesson
  const steps = (visual: TutorWorking) => visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
  return {
    explore(topic: MicroSkillId, title: string, sourceRef: string, spec: MeasureBoardSpec) {
      const state = add(topic, title, sourceRef, text(title))
      state.measureBoard = spec
      return state
    },
    worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: TutorWorking, body: string) {
      const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
      state.content.heading = heading
      return state
    },
    practice(topic: MicroSkillId, title: string, sourceRef: string, picture: AngleFrame, interaction: InteractionDefinition, hint: string, model: TutorWorking, diagnose?: (response: string) => string | null, box?: Box) {
      const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
      const state: TutorMethodState = add(topic, title, sourceRef, { kind: 'angle', angle: picture }, interaction, working(answer, ...steps(model)), hint)
      state.working = model
      if (interaction.type === 'numericInput' && box) { if (box.label) state.answerLabel = box.label; state.answerPrefix = box.prefix }
      if (diagnose) state.diagnose = diagnose
      return state
    },
  }
}

/** Slip messages for a typed answer; a unit, π or degree sign typed with it is fine. */
export const slips = (right: number, list: Slip[]) => (response: string) => diagnoseSlips(response.replace(/\s*(?:°|π?\s*(?:[ckm]?m[²2³3]?|miles?|%|kg|s)?)\s*$/, ''), right, list.filter(([value]) => value !== right))
