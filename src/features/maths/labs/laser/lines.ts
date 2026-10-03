import type { ChainStep } from '../../step-chain/StepChain'
import { options, type Option, type Rand } from '../kit/random'

/*
 * Drones on a coordinate grid from −6 to 6. Every line is picked first (m from ±1, ±2, ±3, c from
 * −5 to 5 but never 0), then drones are placed at whole-number points on it, so every target is
 * a grid crossing and the right dial values are always small whole numbers.
 */

export const LO = -6
export const HI = 6

export type Pt = { x: number; y: number }
export type Dial = 'm' | 'c'

/** One commit: turn the dials, then fire. */
export type Shot = {
  id: string
  prompt: string
  /** The dials the student turns. The other value is locked at the answer. */
  dials: Dial[]
  m: number
  c: number
  /** Where the dials start: never the answer. */
  start: { m: number; c: number }
  /** Two drones on the line, left to right. */
  drones: [Pt, Pt]
  /** Why the right line is right: shown on a hit. */
  win: string
}

/** The one multiple-choice side question a round may have. */
export type Side = { prompt: string; answer: string; choices: Option<string>[]; why: string }

export type Round = {
  id: string
  title: string
  headline: string
  why: string
  shots: Shot[]
  side: Side | null
  /** Draw the rise/run triangle between the drones once the line is found. */
  triangle: boolean
  chain: ChainStep[]
}

/** On-screen numbers with a proper minus sign. */
export const n = (value: number) => value < 0 ? `−${-value}` : String(value)
export const ptText = (p: Pt) => `(${n(p.x)}, ${n(p.y)})`
export const onLine = (p: Pt, m: number, c: number) => m * p.x + c === p.y

/** y = 2x − 3, y = −x + 4, y = 3 */
export function lineText(m: number, c: number) {
  const mx = m === 0 ? '' : m === 1 ? 'x' : m === -1 ? '−x' : `${n(m)}x`
  if (!mx) return `y = ${n(c)}`
  return c === 0 ? `y = ${mx}` : `y = ${mx} ${c < 0 ? '−' : '+'} ${Math.abs(c)}`
}

const minus = (a: number, b: number) => b < 0 ? `${n(a)} + ${-b}` : `${n(a)} − ${b}`
const times = (m: number, x: number) => `${n(m)} × ${x < 0 ? `(${n(x)})` : x}`
const plusC = (c: number) => `${c < 0 ? '−' : '+'} ${Math.abs(c)}`
const squares = (k: number) => `${k} square${k === 1 ? '' : 's'}`
const updown = (rise: number) => rise > 0 ? `up ${rise}` : `down ${-rise}`

// The same, for KaTeX (which draws - as a minus by itself).
const texP = (value: number) => value < 0 ? `(${value})` : String(value)
const texMx = (m: number) => m === 1 ? 'x' : m === -1 ? '-x' : `${m}x`
const texC = (c: number) => c < 0 ? `- ${-c}` : `+ ${c}`

const rise = (shot: Shot) => shot.drones[1].y - shot.drones[0].y
const run = (shot: Shot) => shot.drones[1].x - shot.drones[0].x

/** Whole-number points of y = mx + c on the grid, off the y-axis (a drone there would give c away). */
function xsOn(m: number, c: number, axis = false) {
  const xs: number[] = []
  for (let x = LO; x <= HI; x++) if ((axis || x !== 0) && Math.abs(m * x + c) <= HI) xs.push(x)
  return xs
}

/** Two drones on the line whose run is from `minRun` to 4 squares, or null when the line has no room. */
function pickDrones(rand: Rand, m: number, c: number, minRun = 1): [Pt, Pt] | null {
  const xs = xsOn(m, c)
  const pairs: [number, number][] = []
  for (const a of xs) for (const b of xs) if (b - a >= minRun && b - a <= 4) pairs.push([a, b])
  if (!pairs.length) return null
  const [a, b] = rand.pick(pairs)
  return [{ x: a, y: m * a + c }, { x: b, y: m * b + c }]
}

/** What went wrong with c, given the tilt is right. */
function cSlip(shot: Shot, c: number) {
  const d = shot.drones[1], p = shot.m * d.x
  const fix = `At x = ${n(d.x)}, ${times(shot.m, d.x)} = ${n(p)} and the drone is at y = ${n(d.y)}, so c = ${minus(d.y, p)} = ${n(shot.c)}.`
  if (c === -shot.c) return `Sign flip: you set c to ${n(c)}, so the beam crosses the y-axis on the wrong side of 0. ${fix}`
  const fromX = shot.drones.find(drone => drone.x === c), fromY = shot.drones.find(drone => drone.y === c)
  if (fromX || fromY) {
    const which = fromX ? `the x of the drone at ${ptText(fromX)}` : `the y of the drone at ${ptText(fromY!)}`
    return `${n(c)} is ${which}. c isn’t read off a drone: it’s where the line crosses the y-axis, at x = 0. ${fix}`
  }
  const gap = c - shot.c
  return `Your beam passes ${squares(Math.abs(gap))} ${gap > 0 ? 'above' : 'below'} the drones: at x = ${n(d.x)} it’s at y = ${n(shot.m * d.x + c)}, not ${n(d.y)}. ${fix}`
}

/** What went wrong with m, given the height is right. */
function mSlip(shot: Shot, m: number) {
  const [a, b] = shot.drones, r = rise(shot), u = run(shot)
  const fix = `From ${ptText(a)} to ${ptText(b)} is ${u} across and ${updown(r)}, so m = ${n(r)} ÷ ${u} = ${n(shot.m)}.`
  if (m === 0) return `m = 0 is a flat beam. These drones are on a slope. ${fix}`
  if (u > 1 && m === r) return `${n(r)} is the rise on its own. Gradient is rise ÷ run, so share it over the ${u} squares across. ${fix}`
  if (u > 1 && m === -r) return `${n(m)} is the rise with the wrong sign, and it still needs ÷ the run. ${fix}`
  if (Math.sign(m) !== Math.sign(shot.m)) {
    return `Wrong way! Your beam slopes ${m > 0 ? 'up' : 'down'} to the right, but the drones go ${shot.m > 0 ? 'up' : 'down'}. ${shot.m > 0 ? 'Uphill' : 'Downhill'} means m is ${shot.m > 0 ? 'positive' : 'negative'}. ${fix}`
  }
  return `${Math.abs(m) > Math.abs(shot.m) ? 'Too steep' : 'Not steep enough'}: your beam goes ${updown(m)} for every 1 across, the drones go ${updown(shot.m)}. ${fix}`
}

/** Why a fired line missed, worked out from the values they set. */
export function nopeFor(shot: Shot, m: number, c: number) {
  const hits = shot.drones.filter(drone => onLine(drone, m, c)).length
  const clipped = hits === 1 ? 'You clipped one drone, but the other dodged. ' : ''
  if (!shot.dials.includes('m')) return cSlip(shot, c)
  if (!shot.dials.includes('c')) return mSlip(shot, m)
  if (m === shot.m) return `${clipped}Tilt’s spot on. Now the height. ${cSlip(shot, c)}`
  if (c === shot.c) return `${clipped}Height’s spot on: it crosses at ${n(c)}. Now the tilt. ${mSlip(shot, m)}`
  if (m === shot.c && c === shot.m) return `You swapped them. m is the tilt (the number with x), c is where the beam crosses the y-axis. The beam is ${lineText(shot.m, shot.c)}.`
  const [a, b] = shot.drones, r = rise(shot), u = run(shot), d = b, p = shot.m * d.x
  return `${clipped}Find m first: from ${ptText(a)} to ${ptText(b)} is ${updown(r)} over ${u} across, so m = ${n(shot.m)}. Then c: ${n(d.y)} = ${times(shot.m, d.x)} + c, so c = ${minus(d.y, p)} = ${n(shot.c)}.`
}

/** Slide it: m is locked, find c. Two waves, one above the origin and one below. */
function slideRound(rand: Rand): Round {
  for (;;) {
    const m = rand.pick([1, 2, 3])
    const c1 = rand.int(1, 5), c2 = -rand.int(1, 5)
    const d1 = pickDrones(rand, m, c1), d2 = pickDrones(rand, m, c2)
    if (!d1 || !d2) continue
    const shot = (id: string, prompt: string, c: number, drones: [Pt, Pt]): Shot => {
      const d = drones[1], p = m * d.x
      return {
        id, prompt, dials: ['c'], m, c, start: { m, c: 0 }, drones,
        win: `At x = ${n(d.x)}, ${times(m, d.x)} = ${n(p)}, and the drone is at y = ${n(d.y)}. So c = ${minus(d.y, p)} = ${n(c)}: the beam crosses the y-axis at ${n(c)}.`,
      }
    }
    const shots = [
      shot('slide-1', `The tilt is locked: y = ${lineText(m, 0).slice(4)} + c. Slide c until the beam hits both drones.`, c1, d1),
      shot('slide-2', `New wave. Same tilt, new height. Set c again.`, c2, d2),
    ]
    const last = shots[1], d = last.drones[1], p = m * d.x
    return {
      id: 'slide',
      title: 'Round 1 · Slide it',
      headline: 'c moves the beam up and down',
      why: `In y = mx + c, c is where the beam crosses the y-axis (where x = 0). Change c and the whole line slides up or down without tilting. So work out what mx is at a drone: c is whatever’s left to reach its y.`,
      shots, side: null, triangle: false,
      chain: [
        { line: `y = [[m:${texMx(m)}]] + c` },
        { line: `[[y:${d.y}]] = [[m:${m}]] \\times [[x:${texP(d.x)}]] + c`, op: 'Put in a drone', why: `The drone at ${ptText(d)} is on the beam, so x = ${n(d.x)} and y = ${n(d.y)} must fit.` },
        { line: `[[y:${d.y}]] = [[p:${p}]] + c`, op: 'Multiply', merge: { p: ['m', 'x'] }, why: `${times(m, d.x)} = ${n(p)}. That’s how high the tilt alone gets you at x = ${n(d.x)}.` },
        { line: `c = [[y:${d.y}]] - [[p:${texP(p)}]]`, op: 'Get c alone', why: `c is whatever’s left after mx, so take ${n(p)} off ${n(d.y)}.` },
        { line: `c = [[k:${last.c}]]`, op: 'Work it out', merge: { k: ['y', 'p'] }, why: `${minus(d.y, p)} = ${n(last.c)}. The beam crosses the y-axis at ${n(last.c)}.` },
        { line: `y = [[e:${texMx(m)}]] [[k:${texC(last.c)}]]`, op: 'Write the line', why: `Same tilt, slid ${last.c < 0 ? 'down' : 'up'} to cross at ${n(last.c)}: ${lineText(m, last.c)}.` },
      ],
    }
  }
}

/** Tilt it: c is locked, find m. One uphill wave, then a downhill one. */
function tiltRound(rand: Rand): Round {
  for (;;) {
    const m1 = rand.pick([1, 2, 3]), m2 = -rand.pick([1, 2, 3])
    const c1 = rand.pick([-4, -3, -2, -1, 1, 2, 3, 4]), c2 = rand.pick([-4, -3, -2, -1, 1, 2, 3, 4])
    if (c1 === c2) continue
    // Drones at least 2 apart, so "rise on its own" and "rise ÷ run" give different answers.
    const d1 = pickDrones(rand, m1, c1, 2), d2 = pickDrones(rand, m2, c2, 2)
    if (!d1 || !d2) continue
    const shot = (id: string, prompt: string, m: number, c: number, drones: [Pt, Pt]): Shot => {
      const [a, b] = drones, r = b.y - a.y, u = b.x - a.x
      return {
        id, prompt, dials: ['m'], m, c, start: { m: 0, c }, drones,
        win: `From ${ptText(a)} to ${ptText(b)}: ${u} across, ${updown(r)}. m = ${n(r)} ÷ ${u} = ${n(m)}.${m < 0 ? ' Downhill, so negative.' : ''}`,
      }
    }
    const shots = [
      shot('tilt-1', `The height is locked: it crosses at ${n(c1)}. Tilt the beam: set m.`, m1, c1, d1),
      shot('tilt-2', `New wave, locked at ${n(c2)}. Set m.`, m2, c2, d2),
    ]
    const last = shots[1], [a, b] = last.drones, r = rise(last), u = run(last)
    return {
      id: 'tilt',
      title: 'Round 2 · Tilt it',
      headline: 'm is how steep the beam is',
      why: `m is the gradient: how far the beam goes up for every 1 square across. Count from one drone to the next: rise ÷ run. If the beam goes down as you go right, the rise is negative, so m is negative.`,
      shots, side: null, triangle: true,
      chain: [
        { line: `m = \\frac{[[r:\\text{rise}]]}{[[u:\\text{run}]]}` },
        { line: `m = \\frac{[[r:${r}]]}{[[u:${u}]]}`, op: 'Count squares', why: `From ${ptText(a)} to ${ptText(b)} is ${u} across and ${updown(r)}. Going down counts as negative.` },
        { line: `m = [[m:${last.m}]]`, op: `${n(r)} ÷ ${u}`, merge: { m: ['r', 'u'] }, why: `${n(r)} ÷ ${u} = ${n(last.m)}. A negative gradient slopes down to the right.` },
        { line: `y = [[e:${texMx(last.m)}]] [[k:${texC(last.c)}]]`, op: 'Add c', merge: { e: ['m'] }, why: `c was locked at ${n(last.c)}: that’s where the beam crosses the y-axis.` },
      ],
    }
  }
}

/** Both: two drones, find m and then c. Plus one bonus point to check. */
function bothRound(rand: Rand): Round {
  const MS = [-3, -2, -1, 1, 2, 3], CS = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]
  for (;;) {
    const m = rand.pick(MS), c = rand.pick(CS)
    if (m === c) continue
    const drones = pickDrones(rand, m, c)
    if (!drones) continue
    const [a, b] = drones, r = b.y - a.y, u = b.x - a.x, p = m * b.x
    // The bonus point: another grid crossing on the beam, not one of the drones.
    const spare = xsOn(m, c, true).filter(x => x !== a.x && x !== b.x)
    if (!spare.length) continue
    const sx = rand.pick(spare), sy = m * sx + c
    const key = (x: number, y: number) => `${x},${y}`
    const label = (x: number, y: number) => ptText({ x, y })
    const check = (x: number, y: number) => `Put x = ${n(x)} into ${lineText(m, c)}: ${times(m, x)} ${plusC(c)} = ${n(m * x + c)}, not ${n(y)}.`
    const choices = options<string>(rand, { value: key(sx, sy), label: label(sx, sy) }, [
      { value: key(sy, sx), label: label(sy, sx), nope: `Coordinates go (x, y): across first, then up. ${check(sy, sx)}` },
      { value: key(sx, m * sx - c), label: label(sx, m * sx - c), nope: `That uses c = ${n(-c)}, the wrong sign. ${check(sx, m * sx - c)}` },
      { value: key(sx, -m * sx + c), label: label(sx, -m * sx + c), nope: `That’s on a beam sloping the other way (m = ${n(-m)}). ${check(sx, -m * sx + c)}` },
      { value: key(sx, sy + 1), label: label(sx, sy + 1), nope: `So close. ${check(sx, sy + 1)}` },
      { value: key(sx, sy - 1), label: label(sx, sy - 1), nope: `So close. ${check(sx, sy - 1)}` },
    ], {
      valid: value => {
        const [x, y] = value.split(',').map(Number)
        return Math.abs(x) <= HI && Math.abs(y) <= HI && m * x + c !== y
      },
    })
    if (choices.length < 3) continue
    return {
      id: 'both',
      title: 'Round 3 · Both dials',
      headline: 'Find the whole line',
      why: `Two points fix one straight line. Get the tilt first: m = rise ÷ run between the drones. Then put one drone’s x and y into y = mx + c to find c.`,
      shots: [{
        id: 'both-1', prompt: `Full manual. Set m and c so the beam hits both drones.`, dials: ['m', 'c'], m, c, start: { m: 0, c: 0 }, drones,
        win: `From ${ptText(a)} to ${ptText(b)}: ${u} across, ${updown(r)}, so m = ${n(m)}. Then ${n(b.y)} = ${times(m, b.x)} + c, so c = ${n(c)}.`,
      }],
      side: {
        prompt: `Your beam is ${lineText(m, c)}. Which point is also on it?`,
        answer: key(sx, sy),
        choices,
        why: `Put x = ${n(sx)} in: ${times(m, sx)} ${plusC(c)} = ${n(sy)}. So ${label(sx, sy)} is on the beam too.`,
      },
      triangle: true,
      chain: [
        { line: `m = \\frac{[[r:\\text{rise}]]}{[[u:\\text{run}]]}` },
        { line: `m = \\frac{[[r:${r}]]}{[[u:${u}]]}`, op: 'Count squares', why: `From ${ptText(a)} to ${ptText(b)} is ${u} across and ${updown(r)}.` },
        { line: `m = [[m:${m}]]`, op: `${n(r)} ÷ ${u}`, merge: { m: ['r', 'u'] }, why: `${n(r)} ÷ ${u} = ${n(m)}. That’s the tilt. Now for the height.` },
        { line: `[[y:${b.y}]] = [[m:${m}]] \\times [[x:${texP(b.x)}]] + c`, op: 'Put in a drone', why: `The drone at ${ptText(b)} is on the beam, so its x and y must fit y = mx + c.` },
        { line: `[[y:${b.y}]] = [[p:${p}]] + c`, op: 'Multiply', merge: { p: ['m', 'x'] }, why: `${times(m, b.x)} = ${n(p)}.` },
        { line: `c = [[k:${c}]]`, op: 'Get c alone', merge: { k: ['y', 'p'] }, why: `c is what’s left: ${minus(b.y, p)} = ${n(c)}. The beam crosses the y-axis at ${n(c)}.` },
        { line: `y = [[e:${texMx(m)}]] [[k:${texC(c)}]]`, op: 'Write the line', why: `Tilt ${n(m)}, crossing at ${n(c)}: ${lineText(m, c)}.` },
      ],
    }
  }
}

export function makeRounds(rand: Rand): Round[] {
  return [slideRound(rand), tiltRound(rand), bothRound(rand)]
}
