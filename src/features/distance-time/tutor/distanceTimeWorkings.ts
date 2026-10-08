import type { GraphPoint } from '../../written-methods/tutor/methodWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { latex, readNumbers } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, mark, pt, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'
import { clock } from '../../written-methods/tutor/GraphPictures'
import { corners, journeyKey } from '../../written-methods/tutor/JourneyBoard'

/*
 * The workings for Distance–time graphs (graphs lesson 7, GR8), one move a step on the question's own graph: time
 * across (hours, amber, written as a clock) and distance from home up (km, biro blue). Each part of a journey is a
 * straight line: going up is moving away, flat is stopped, going down is coming back. Its speed is its gradient,
 * distance ÷ time: the time across it (amber) and the distance up or down it (biro blue), as in lesson 3's triangle.
 */

const show = (n: number) => String(Math.round(n * 1000) / 1000).replace('-', '−')
/** 1.5 → "1½ hours", 0.5 → "½ hour", 2 → "2 hours". */
export function hoursText(h: number) {
  const whole = Math.floor(h), half = Math.abs(h - whole - 0.5) < 1e-9
  if (!half) return `${whole} hour${whole === 1 ? '' : 's'}`
  return whole ? `${whole}½ hours` : '½ hour'
}
/** 1.5 → "1½ h": a part's time, written on the graph. */
const shortHours = (h: number) => hoursText(h).replace(/ hours?$/, ' h')

/** A journey: where it starts (home, at a time), its corners in time order, who makes it. */
export type Journey = { name: string; start: GraphPoint; corners: GraphPoint[] }
export const journey = (name: string, start: GraphPoint, ...points: GraphPoint[]): Journey => ({ name, start, corners: points })
export const parts = (j: Journey) => j.corners.map((p, i) => [i ? j.corners[i - 1] : j.start, p] as [GraphPoint, GraphPoint])
export const speed = (a: GraphPoint, b: GraphPoint) => Math.abs(b.y - a.y) / (b.x - a.x)

/** The graph: time across from `from` (a square is `perX` hours, a number each hour), distance up (a square is `perY` km). */
export function dtGrid(j: Journey | null, x: [number, number], perX: number, top: number, perY: number, drawn = true): GraphGrid {
  return {
    // Two squares under the time axis: room for two times read side by side (10:00 and 10:30), one a row lower.
    x: [x[0] - perX, x[1]], y: [-2 * perY, top], points: [],
    scale: { x: { per: perX, start: x[0], every: Math.max(2, Math.round(1 / perX)), clock: true, name: 'time' }, y: { per: perY, start: 0, name: 'km' } },
    lines: j && drawn ? parts(j).map(([a, b]) => ({ from: a, to: b, at: -1, segment: true })) : [],
  }
}

/** Moves: one part of the journey drawn over the graph in biro blue while a step reads it. */
const highlight = (a: GraphPoint, b: GraphPoint, step: number) => ({ from: a, to: b, at: step, segment: true })

/** Moves: the flat part found, its two times read on the time axis; the answer is how long it lasts. */
export function stopMoves(a: GraphPoint, b: GraphPoint): GraphMove[] {
  const minutes = Math.round((b.x - a.x) * 60)
  return [
    {
      title: 'The flat part', equation: latex(`${clock(a.x)} to ${clock(b.x)}`), adds: 'picture',
      say: 'A flat part means the distance from home isn’t changing: stopped. Read the time at each end of it.',
      change: (frame, step) => ({ ...frame, lines: [...(frame.lines ?? []), highlight(a, b, step)], marks: [mark('x', a.x), mark('x', b.x)], boxed: [a, b] }),
    },
    answerMove(`${minutes} minutes`, 'How long', `From ${clock(a.x)} to ${clock(b.x)} is ${minutes} minutes.`, [], {
      title: '', say: '', equation: '', adds: 'lines',
      change: (frame, step) => ({ ...frame, marks: [mark('x', a.x), mark('x', b.x)], working: [{ text: `${clock(a.x)} to ${clock(b.x)} = ${minutes} minutes`, family: 1, at: step }] }),
    }),
  ]
}
/** Moves: up from a time to the journey, then across to the distance axis. */
export function distanceAt(p: GraphPoint): GraphMove[] {
  return [
    answerMove(`${show(p.y)} km`, `At ${clock(p.x)}`, `Up from ${clock(p.x)} to the line, then across to the distance axis: ${show(p.y)} km from home.`, [], {
      title: '', say: '', equation: '', adds: 'picture',
      change: (frame, step) => ({
        ...frame, boxed: [p], marks: [mark('x', p.x), mark('y', p.y)],
        legs: [{ from: pt(p.x, 0), to: p, label: '', family: 1, at: step, dashed: true }, { from: p, to: pt(frame.scale!.x.start, p.y), label: '', family: 0, at: step, dashed: true }],
      }),
    }),
  ]
}
/** Moves: the time a part takes (across, amber) and the distance it covers (up or down, biro blue), then speed = distance ÷ time. */
export function speedMoves(a: GraphPoint, b: GraphPoint): GraphMove[] {
  const hours = b.x - a.x, km = Math.abs(b.y - a.y), s = speed(a, b)
  const turn = pt(b.x, a.y)
  return [
    {
      title: 'The time', equation: latex(`${clock(a.x)} to ${clock(b.x)}`), adds: 'lines', say: `Across the part: ${clock(a.x)} to ${clock(b.x)} is ${hoursText(hours)}.`,
      change: (frame, step) => ({
        ...frame, lines: [...(frame.lines ?? []), highlight(a, b, step)], marks: [mark('x', a.x), mark('x', b.x)],
        legs: [{ from: a, to: turn, label: shortHours(hours), family: 1, at: step }],
        working: [{ text: `time: ${clock(a.x)} to ${clock(b.x)} = ${hoursText(hours)}`, family: 1, at: step }],
      }),
    },
    {
      title: 'The distance', equation: latex(`${show(a.y)} to ${show(b.y)}`), adds: 'lines', say: `${b.y < a.y ? 'Down' : 'Up'} the part: from ${show(a.y)} km to ${show(b.y)} km is ${show(km)} km.`,
      change: (frame, step) => ({
        ...frame, marks: [mark('y', a.y), mark('y', b.y)],
        legs: [...(frame.legs ?? []), { from: turn, to: b, label: `${show(km)} km`, family: 0, at: step }],
        working: [...(frame.working ?? []), { text: `distance: ${show(km)} km`, family: 0, at: step }],
      }),
    },
    answerMove(`${show(s)} km/h`, 'Speed = distance ÷ time', `Speed is the gradient: distance ÷ time, ${show(km)} ÷ ${show(hours)} = ${show(s)} km an hour.${b.y < a.y ? ' Going down means coming back, but the speed is still positive.' : ''}`, [], {
      title: '', say: '', equation: '', adds: 'lines',
      change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), { text: `speed = ${show(km)} ÷ ${show(hours)} = ${show(s)} km/h`, family: 3, at: step }] }),
    }),
  ]
}
/** Moves: what a part shows: up is away, flat is stopped, down is coming back. */
export function partMoves(a: GraphPoint, b: GraphPoint, answer: string): GraphMove[] {
  const what = b.y === a.y ? 'flat: the distance from home doesn’t change, so stopped' : b.y > a.y ? `up, from ${show(a.y)} km to ${show(b.y)} km: moving away from home` : `down, from ${show(a.y)} km to ${show(b.y)} km: coming back${b.y === 0 ? ' home' : ''}`
  return [answerMove(answer, `${clock(a.x)} to ${clock(b.x)}`, `This part goes ${what}.`, [], {
    title: '', say: '', equation: '', adds: 'picture',
    change: (frame, step) => ({ ...frame, lines: [...(frame.lines ?? []), highlight(a, b, step)], marks: [mark('y', a.y), mark('y', b.y)], boxed: [a, b] }),
  })]
}
/** Moves: every part's distance added up, out and back. */
export function totalMoves(j: Journey): GraphMove[] {
  const moving = parts(j).filter(([a, b]) => a.y !== b.y)
  const total = moving.reduce((s, [a, b]) => s + Math.abs(b.y - a.y), 0)
  return [
    {
      title: 'Each part', equation: latex(moving.map(([a, b]) => show(Math.abs(b.y - a.y))).join(' + ')), adds: 'lines', say: 'Add the distance of every part, going out and coming back. A flat part adds nothing.',
      change: (frame, step) => ({
        ...frame, marks: [...new Set(moving.flatMap(([a, b]) => [a.y, b.y]))].map(v => mark('y', v)),
        working: moving.map(([a, b]) => ({ text: `${clock(a.x)} to ${clock(b.x)}: ${show(Math.abs(b.y - a.y))} km ${b.y > a.y ? 'out' : 'back'}`, family: 0, at: step })),
      }),
    },
    answerMove(`${show(total)} km`, 'Altogether', `${moving.map(([a, b]) => show(Math.abs(b.y - a.y))).join(' + ')} = ${show(total)} km.`),
  ]
}

/* ---------- Drawing a journey ---------- */

/** One part of a story, drawn: where it ends and how the story gives it. */
export type Leg = { to: GraphPoint; title: string; say: string; text: string }
/** Moves: each part drawn from the last corner, its sum under the graph; the answer is the whole journey, green. */
export function drawMoves(j: Journey, legs: Leg[]): GraphMove[] {
  return legs.map((leg, i) => {
    const from = i ? legs[i - 1].to : j.start
    const move: GraphMove = {
      title: leg.title, equation: latex(leg.text), adds: 'picture', say: leg.say,
      change: (frame, step) => ({
        ...frame, lines: [...(frame.lines ?? []), { from, to: leg.to, at: step, segment: true }], marks: [mark('x', leg.to.x), mark('y', leg.to.y)],
        points: [...(frame.points ?? []), { ...leg.to, at: step, label: '' }], working: [{ text: leg.text, family: 0, at: step }],
      }),
    }
    if (i < legs.length - 1) return move
    return answerMove(`${j.name}’s journey`, leg.title, `${leg.say} That’s the whole journey.`, [], {
      ...move, change: (frame, step) => {
        const drawn = move.change(frame, step)
        return { ...drawn, lines: (drawn.lines ?? []).map(line => ({ ...line, answer: true })) }
      },
    })
  })
}

/* ---------- Answers ---------- */

/** A number of km, minutes or km/h, typed (either minus sign, any way of writing it). */
export const amount = (n: number, unit: string): InteractionDefinition => ({
  type: 'numericInput', acceptanceRule: 'openInterval', lowerBound: n - 1e-6, upperBound: n + 1e-6, correctAnswer: n, displayAnswer: `${show(n)} ${unit}`, signed: true,
})
/** The journey drawn on the board: its corners after the start (JourneyBoard.tsx). */
export const drawnJourney = (j: Journey): InteractionDefinition => ({
  type: 'numericInput', acceptanceRule: 'numberList', correctAnswer: journeyKey(j.start, j.corners), displayAnswer: `${j.name}’s journey`, signed: true,
})
/** Slips drawing a journey: the first part that doesn't match, and where it should end. */
export function journeySlips(j: Journey) {
  return (response: string) => {
    const n = readNumbers(response)
    if (!n.length || n.length % 2) return null
    const own = corners(j.start, Array.from({ length: n.length / 2 }, (_, i) => pt(n[2 * i], n[2 * i + 1])))
    const right = j.corners
    const i = right.findIndex((p, k) => !own[k] || Math.abs(own[k].x - p.x) > 1e-9 || own[k].y !== p.y)
    if (i < 0) return own.length > right.length ? 'The journey ends sooner: there is nothing after its last part.' : null
    const p = right[i], from = i ? right[i - 1] : j.start
    const what = p.y === from.y ? 'stopped, so it is flat' : p.y > from.y ? 'moving away, so it goes up' : 'coming home, so it goes down'
    return `Part ${i + 1} is ${what}: it ends at ${clock(p.x)}, ${show(p.y)} km from home.`
  }
}
/** Slips working out a speed: time taken as minutes, or distance × time. */
export function speedSlips(a: GraphPoint, b: GraphPoint) {
  const hours = b.x - a.x, km = Math.abs(b.y - a.y)
  return (response: string) => {
    const [v] = readNumbers(response)
    if (v === undefined || Math.abs(v - km / hours) < 1e-6) return null
    if (Math.abs(v - km / (hours * 60)) < 0.01) return `Speed in km/h needs the time in hours: ${hoursText(hours)}, not ${Math.round(hours * 60)} minutes.`
    if (Math.abs(v - km * hours) < 1e-6) return 'Speed is distance ÷ time, not times.'
    if (Math.abs(v - hours / km) < 1e-6) return 'Distance ÷ time: the km first.'
    if (Math.abs(v - km) < 1e-6 && hours !== 1) return `${show(km)} km is the distance. It took ${hoursText(hours)}, so divide by ${show(hours)}.`
    return null
  }
}
