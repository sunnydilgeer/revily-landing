import type { ChainStep } from '../../step-chain/StepChain'
import { options, texNum, whole, type Option, type Rand } from '../kit/random'

/** 1 grid square = 5 m, so every length is a multiple of 5. */
export const SQUARE = 5

/**
 * A base seen from above, in metres: a w × h rectangle, with an optional corner bitten out of the
 * top right (cut) to make an L.
 */
export type Plan = { w: number; h: number; cut: { w: number; h: number } | null }

/** What a right answer builds on the map. */
export type Builds = 'walls' | 'side' | 'floor' | 'crates'

export type Question = {
  prompt: string
  answer: number
  choices: Option[]
  why: string
  builds: Builds
}

export type Round = {
  id: string
  title: string
  heading: string
  why: string
  plan: Plan
  /** One label per edge of `corners(plan)`, in order; null leaves that side bare. */
  labels: (string | null)[]
  /** The edge shown as "?" until the first question is answered. */
  missing: number | null
  /** m² one crate of tiles covers (supply round only). */
  coverage: number | null
  /** The walls are already up when the round starts. */
  walled: boolean
  questions: Question[]
  chain: ChainStep[]
}

/** The outline, clockwise from the top-left corner, in metres (y points down). */
export function corners({ w, h, cut }: Plan): [number, number][] {
  if (!cut) return [[0, 0], [w, 0], [w, h], [0, h]]
  return [[0, 0], [w - cut.w, 0], [w - cut.w, cut.h], [w, cut.h], [w, h], [0, h]]
}

/** Every 5 m square inside the base, row by row, as [column, row]. */
export function squares({ w, h, cut }: Plan): [number, number][] {
  const out: [number, number][] = []
  for (let row = 0; row < h / SQUARE; row++) {
    for (let col = 0; col < w / SQUARE; col++) {
      if (cut && col >= (w - cut.w) / SQUARE && row < cut.h / SQUARE) continue
      out.push([col, row])
    }
  }
  return out
}

const n = (value: number) => value.toLocaleString('en-GB')
const m = (value: number) => `${n(value)} m`
const m2 = (value: number) => `${n(value)} m²`
const crates = (value: number) => `${n(value)} crate${value === 1 ? '' : 's'}`
const tm = (value: number) => `${texNum(value)}\\text{ m}`
const tm2 = (value: number) => `${texNum(value)}\\text{ m}^2`

/** Two different lengths, w wide and h long. */
function sides(rand: Rand, min: number, max: number): [number, number] {
  const w = rand.int(min, max, SQUARE)
  let h = rand.int(min, max, SQUARE)
  while (h === w) h = rand.int(min, max, SQUARE)
  return [w, h]
}

/** Round 1: a plain rectangle. Walls (perimeter), then floor (area). */
function rectangle(rand: Rand): Round {
  const [w, h] = sides(rand, 10, 45)
  const perimeter = 2 * (w + h), area = w * h
  return {
    id: 'shed',
    title: 'Night 1 · The shed',
    heading: `A ${w} m by ${h} m shed. Walls first.`,
    why: 'Walls go round the edge, so how much wall you need is the perimeter: add every side. A rectangle has two pairs of matching sides. The floor covers the inside, so that’s the area: length × width.',
    plan: { w, h, cut: null },
    labels: [m(w), m(h), null, null],
    missing: null,
    coverage: null,
    walled: false,
    questions: [
      {
        prompt: 'Walls go all the way round. How many metres of wall?',
        answer: perimeter,
        choices: options(rand, { value: perimeter, label: m(perimeter) }, [
          { value: w + h, label: m(w + h), nope: `That’s ${w} + ${h}: only two walls. A rectangle has four sides, so add them all: ${w} + ${h} + ${w} + ${h} = ${perimeter} m.` },
          { value: w * h, label: m(w * h), nope: `That’s ${w} × ${h}, the floor. Walls go round the edge, so add the sides: ${w} + ${h} + ${w} + ${h} = ${perimeter} m.` },
          { value: 2 * w + h, label: m(2 * w + h), nope: `That’s ${w} + ${w} + ${h}: one wall short. Add all four: ${w} + ${h} + ${w} + ${h} = ${perimeter} m.` },
        ]),
        why: `${w} + ${h} + ${w} + ${h} = ${perimeter} m of wall. Opposite sides match, so it’s also 2 × (${w} + ${h}).`,
        builds: 'walls',
      },
      {
        prompt: 'Floor tiles cover the inside. How much floor?',
        answer: area,
        choices: options(rand, { value: area, label: m2(area) }, [
          { value: perimeter, label: m2(perimeter), nope: `${perimeter} is the wall length all the way round. The floor is the space inside: ${w} × ${h} = ${n(area)} m².` },
          { value: w + h, label: m2(w + h), nope: `That’s ${w} + ${h}. Area multiplies: ${w} × ${h} = ${n(area)} m².` },
          { value: 2 * area, label: m2(2 * area), nope: `That’s 2 × ${w} × ${h}. One floor, not two: ${w} × ${h} = ${n(area)} m².` },
        ]),
        why: `${w} × ${h} = ${n(area)} m². Check: ${w / SQUARE} × ${h / SQUARE} = ${area / 25} grid squares, and each one is 5 × 5 = 25 m².`,
        builds: 'floor',
      },
    ],
    chain: [
      { line: `\\text{P} = [[a:${w}]] + [[b:${h}]] + [[c:${w}]] + [[d:${h}]]` },
      { line: `\\text{P} = [[p:${tm(perimeter)}]]`, op: 'Add every side', merge: { p: ['a', 'b', 'c', 'd'] }, why: 'The walls go all the way round, so every side counts, both pairs.' },
      { line: `\\text{A} = [[e:${w}]] \\times [[f:${h}]]`, op: 'Floor: W × L', why: 'The floor is the inside. A rectangle’s area is its width times its length.' },
      { line: `\\text{A} = [[g:${tm2(area)}]]`, op: 'Multiply', merge: { g: ['e', 'f'] }, why: `${w} × ${h} = ${n(area)}. Square metres, because it’s a space, not a line.` },
    ],
  }
}

/** Which side of the L is hidden, and the two sides that give it away. */
type Hidden = { edge: number; big: number; small: number; bigName: string; smallName: string }

/** Round 2: an L. Find the missing side (big − small), then the area in two rectangles. */
function lShape(rand: Rand): Round {
  // The step across is at least 15 m so its label clears the step down's on the plan.
  const w = rand.int(25, 50, SQUARE), h = rand.int(20, 50, SQUARE)
  const cut = { w: rand.int(15, w - 10, SQUARE), h: rand.int(SQUARE, h - 10, SQUARE) }
  const top = w - cut.w, right = h - cut.h
  // Edges: 0 top, 1 step down, 2 step across, 3 right, 4 bottom, 5 left.
  const lengths = [top, cut.h, cut.w, right, w, h]
  const hidden: Hidden = rand.pick<Hidden>([
    { edge: 0, big: w, small: cut.w, bigName: 'bottom wall', smallName: 'step across' },
    { edge: 2, big: w, small: top, bigName: 'bottom wall', smallName: 'top wall' },
    { edge: 3, big: h, small: cut.h, bigName: 'left wall', smallName: 'step down' },
    { edge: 1, big: h, small: right, bigName: 'left wall', smallName: 'right wall' },
  ])
  const gap = lengths[hidden.edge]
  const { big, small } = hidden
  // Split down the inside corner: a tall piece on the left, a short one on the right.
  const left = top * h, rest = cut.w * right, area = left + rest
  return {
    id: 'bunker',
    title: 'Night 2 · The L-shaped bunker',
    heading: 'An L-shaped bunker. One wall’s length is missing.',
    why: 'An L is a rectangle with a corner bitten out. The two short walls on one side add up to the long wall opposite, so a missing side is the big one minus the small one. For the floor, split the L into two rectangles and add them.',
    plan: { w, h, cut },
    labels: lengths.map((length, edge) => edge === hidden.edge ? '?' : m(length)),
    missing: hidden.edge,
    coverage: null,
    walled: false,
    questions: [
      {
        prompt: 'How long is the wall marked “?”',
        answer: gap,
        choices: options(rand, { value: gap, label: m(gap) }, [
          { value: big + small, label: m(big + small), nope: `That’s ${big} + ${small}. The ${small} m ${hidden.smallName} is part of the ${big} m ${hidden.bigName}, so take it away: ${big} − ${small} = ${gap} m.` },
          { value: big, label: m(big), nope: `That’s the whole ${big} m ${hidden.bigName}. This wall is shorter, because the ${small} m ${hidden.smallName} uses some of it: ${big} − ${small} = ${gap} m.` },
          { value: small, label: m(small), nope: `That’s the ${hidden.smallName} again. Together they make the ${big} m ${hidden.bigName}: ${big} − ${small} = ${gap} m.` },
        ]),
        why: `The ${hidden.bigName} is ${big} m. The two walls opposite it add up to the same, so ? = ${big} − ${small} = ${gap} m.`,
        builds: 'side',
      },
      {
        prompt: 'Now the floor. What’s the total area?',
        answer: area,
        choices: options(rand, { value: area, label: m2(area) }, [
          { value: w * h, label: m2(w * h), nope: `That’s ${w} × ${h}, as if it were a full rectangle. The corner’s missing: split it into ${top} × ${h} and ${cut.w} × ${right}.` },
          { value: left + cut.w + right, label: m2(left + cut.w + right), nope: `You added ${cut.w} + ${right} for the small piece. Multiply: ${cut.w} × ${right} = ${n(rest)}, so ${n(left)} + ${n(rest)} = ${n(area)} m².` },
          { value: left, label: m2(left), nope: `That’s only the big piece, ${top} × ${h}. Add the small one too: ${cut.w} × ${right} = ${n(rest)}.` },
        ]),
        why: `Split it: ${top} × ${h} = ${n(left)} and ${cut.w} × ${right} = ${n(rest)}. Add them: ${n(area)} m².`,
        builds: 'floor',
      },
    ],
    chain: [
      { line: `\\text{?} = [[b:${big}]] - [[s:${small}]]` },
      { line: `\\text{?} = [[g:${tm(gap)}]]`, op: 'Big − small', merge: { g: ['b', 's'] }, why: `The two walls opposite the ${hidden.bigName} add up to ${big} m, so the missing one is what’s left after the ${small} m.` },
      { line: `\\text{A} = [[p:${top}]] \\times [[q:${h}]] + [[u:${cut.w}]] \\times [[v:${right}]]`, op: 'Split in two', why: 'Cut down the inside corner: a tall rectangle on the left and a short one on the right.' },
      { line: `\\text{A} = [[x:${texNum(left)}]] + [[y:${texNum(rest)}]]`, op: 'Each piece', merge: { x: ['p', 'q'], y: ['u', 'v'] }, why: 'Each piece is a rectangle, so it’s width × length.' },
      { line: `\\text{A} = [[z:${tm2(area)}]]`, op: 'Add the pieces', merge: { z: ['x', 'y'] }, why: 'The two pieces make the whole floor, with no overlap.' },
    ],
  }
}

/** Round 3: tiles come in crates. Area, then area ÷ what one crate covers. */
function supplies(rand: Rand): Round {
  const coverage = rand.pick([25, 50, 100])
  // Answer first: keep drawing rooms until the crates come out whole and sensible.
  let [w, h] = sides(rand, 10, 40)
  while ((w * h) % coverage !== 0 || w * h / coverage < 2 || w * h / coverage > 40) [w, h] = sides(rand, 10, 40)
  const area = w * h, count = area / coverage, perimeter = 2 * (w + h), cells = area / 25
  const per = coverage / 25
  return {
    id: 'stores',
    title: 'Night 3 · The supply run',
    heading: `New ${w} m by ${h} m store room. Each crate of tiles covers ${coverage} m².`,
    why: 'Area tells you how much floor there is. Each crate covers the same amount, so the number of crates is how many lots of that fit into the floor: divide.',
    plan: { w, h, cut: null },
    labels: [m(w), m(h), null, null],
    missing: null,
    coverage,
    walled: true,
    questions: [
      {
        prompt: 'Walls are up. How much floor needs tiling?',
        answer: area,
        choices: options(rand, { value: area, label: m2(area) }, [
          { value: perimeter, label: m2(perimeter), nope: `${perimeter} m is the wall all the way round. Tiles go inside: ${w} × ${h} = ${n(area)} m².` },
          { value: w + h, label: m2(w + h), nope: `That’s ${w} + ${h}. Area multiplies: ${w} × ${h} = ${n(area)} m².` },
          { value: 2 * area, label: m2(2 * area), nope: `That’s 2 × ${w} × ${h}. One floor, not two: ${n(area)} m².` },
        ]),
        why: `${w} × ${h} = ${n(area)} m² of floor.`,
        builds: 'floor',
      },
      {
        prompt: `One crate covers ${coverage} m². How many crates?`,
        answer: count,
        choices: options(rand, { value: count, label: crates(count) }, [
          { value: perimeter / coverage, label: crates(perimeter / coverage), nope: `That’s the wall length ÷ ${coverage}. Tiles go on the floor, so use the area: ${n(area)} ÷ ${coverage} = ${count}.` },
          { value: area * coverage, label: crates(area * coverage), nope: `That’s ${n(area)} × ${coverage}: a mountain of crates. Each crate covers ${coverage} m², so share the floor out: ${n(area)} ÷ ${coverage} = ${count}.` },
          { value: cells, label: crates(cells), nope: `That’s one crate per grid square. A crate covers ${coverage} m², which is ${per} squares: ${n(area)} ÷ ${coverage} = ${count}.` },
          { value: area - coverage, label: crates(area - coverage), nope: `That’s ${n(area)} − ${coverage}. How many ${coverage}s fit in ${n(area)}? Divide: ${count}.` },
        ], { valid: whole }),
        why: `${n(area)} ÷ ${coverage} = ${count} crates. ${per === 1 ? 'Each crate does one grid square.' : `Each crate does ${per} grid squares.`}`,
        builds: 'crates',
      },
    ],
    chain: [
      { line: `\\text{A} = [[e:${w}]] \\times [[f:${h}]]` },
      { line: `\\text{A} = [[a:${tm2(area)}]]`, op: 'Floor: W × L', merge: { a: ['e', 'f'] }, why: 'Tiles cover the floor, so start with the area.' },
      { line: `\\text{Crates} = [[a:${texNum(area)}]] \\div [[c:${coverage}]]`, op: `÷ ${coverage} m² a crate`, why: `Each crate covers ${coverage} m². Dividing counts how many ${coverage}s fit into the floor.` },
      { line: `\\text{Crates} = [[k:${count}]]`, op: 'Divide', merge: { k: ['a', 'c'] }, why: `${n(area)} ÷ ${coverage} = ${count}, a whole number of crates with nothing wasted.` },
    ],
  }
}

/** One play: three fresh bases. */
export function makeBases(rand: Rand): Round[] {
  return [rectangle(rand), lShape(rand), supplies(rand)]
}
