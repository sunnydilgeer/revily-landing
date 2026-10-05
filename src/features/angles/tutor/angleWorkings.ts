import type { AngleFrame, MethodStep } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodVisual, TutorWorking } from '../../written-methods/tutor/model'
import { latex } from '../../inequalities/tutor/inequalityWorkings'

/*
 * The workings for Angle facts (lesson 26, G1): the question's own angle diagram (AnglePictures.tsx), one move a step.
 * A step boxes the angles it uses in purple and writes one line under the picture; the last step writes the answer in
 * green, on the angle it finds too.
 */

export type AngleDiagram = Omit<AngleFrame, 'step' | 'adds'>

/** A straight line with angles sitting on it: the arcs between `rays` (0° and 180° are the line itself). */
export function onLine(rays: number[], labels: string[]): AngleDiagram {
  const all = [0, ...rays, 180]
  return { rays: all, straight: true, arcs: labels.map((label, i) => ({ from: all[i], to: all[i + 1], label })) }
}
/** Lines from one point: an arc from each ray to the next, all the way round. */
export function atPoint(rays: number[], labels: string[]): AngleDiagram {
  return { rays, arcs: labels.map((label, i) => ({ from: rays[i], to: i + 1 < rays.length ? rays[i + 1] : rays[0] + 360, label })) }
}
/**
 * Two straight lines crossing: rays at `start` and `start + size`, and opposite them. `labels` go round from the angle of
 * `size`, so labels 0 and 2 are opposite, and 1 and 3; an empty label leaves that angle unmarked until a step finds it.
 */
export function crossing(start: number, size: number, labels: string[]): AngleDiagram {
  const rays = [start, start + size, start + 180, start + 180 + size]
  return { rays, arcs: rays.map((from, i) => ({ from, to: i + 1 < rays.length ? rays[i + 1] : rays[0] + 360, label: labels[i] ?? '' })) }
}

/** The question's diagram, drawn plain above its answer box. */
export const figure = (diagram: AngleDiagram): TutorMethodVisual => ({ kind: 'diagram', diagram: { kind: 'angles', frame: { ...diagram, step: 0, adds: 'picture' } } })

/**
 * One move a step on the diagram. The frame keeps everything earlier steps added; `at` says which step added each part,
 * so finished parts grey out. `boxed` lasts for one step: the angles that step uses.
 */
export type AngleMove = { title: string; say: string; equation: string; adds: AngleFrame['adds']; change: (frame: AngleFrame, step: number) => AngleFrame }
export function angleModel(question: string, start: AngleDiagram, moves: AngleMove[], label = 'Work it out'): TutorWorking {
  let frame: AngleFrame = { ...start, step: 0, adds: 'picture' }
  const steps: MethodStep[] = moves.map((move, step) => {
    frame = { ...move.change({ ...frame, boxed: undefined }, step), step, adds: move.adds }
    return { title: move.title, operation: latex(question), equation: move.equation, instruction: move.say, frame: { angles: frame } }
  })
  return { kind: 'method-worked', examples: [{ method: 'ordering', expression: latex(question), label, first: 0, second: 0, steps, pictureOnly: true, focus: true }] }
}
/** Moves: a line of working under the picture (purple: a halfway result), using the angles `arcs`, boxed in purple. */
export const use = (arcs: number[], lineText: string, title: string, say: string): AngleMove => ({
  title, say, equation: latex(lineText), adds: 'lines',
  change: (frame, step) => ({ ...frame, lines: [...(frame.lines ?? []), { text: lineText, family: 3, at: step }], boxed: arcs }),
})
/** Moves: the last one, the answer in its green box, written on the angle it finds (`arc`) as `shown`. */
export const answerMove = (answerText: string, title: string, say: string, arc?: number, shown?: string): AngleMove => ({
  title, say, equation: latex(answerText), adds: 'answer',
  change: (frame, step) => ({
    ...frame, answer: { text: answerText, at: step },
    found: arc === undefined ? frame.found : [...(frame.found ?? []), { arc, text: shown ?? answerText.replace(/^.*=\s*/, ''), at: step, answer: true }],
  }),
})
