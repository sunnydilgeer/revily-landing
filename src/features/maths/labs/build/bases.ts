import type { ChainStep } from '../../step-chain/StepChain'
import { gbp, options, texGbp, texNum, whole, type Option, type Rand } from '../kit/random'

/** 1 grid square = 5 m, so every length is a multiple of 5. */
export const SQUARE = 5

/**
 * A base seen from above, in metres: a w × h rectangle, with an optional corner bitten out of the
 * top right (cut) to make an L.
 */
export type Plan = { w: number; h: number; cut: { w: number; h: number } | null }

/** What a right answer builds on the map. */
export type Builds = 'walls' | 'side' | 'floor' | 'crates' | 'cost'

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
  /** The floor is already down when the round starts. */
  floored: boolean
  /** A gap this many metres wide left in the bottom wall for a gate, if any. */
  gate: number | null
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
    floored: false,
    gate: null,
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
    floored: false,
    gate: null,
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
    floored: false,
    gate: null,
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

/** Round 4: work backwards. The floor's down and one wall is known: side = area ÷ side, then the wall, less a gate. */
function yard(rand: Rand): Round {
  // Answer first: the hidden side, then the front wall and the gate.
  const h = rand.int(15, 45, SQUARE)
  let w = rand.int(15, 40, SQUARE)
  while (w === h) w = rand.int(15, 40, SQUARE)
  const gate = rand.pick([5, 10])
  const area = w * h, perimeter = 2 * (w + h), wall = perimeter - gate
  return {
    id: 'yard',
    title: 'Night 4 · The yard',
    heading: `The yard’s floor is down: ${m2(area)}. The front wall is ${w} m.`,
    why: 'Area is width × length. If you know the area and one side, divide by that side to get the other one. Then add every side for the wall. A gate is a gap in the wall, so take it off.',
    plan: { w, h, cut: null },
    labels: [m(w), '?', `${gate} m gate`, null],
    missing: 1,
    coverage: null,
    walled: false,
    floored: true,
    gate,
    questions: [
      {
        prompt: `${m2(area)} of floor, ${w} m wide. How long is the side wall marked “?”`,
        answer: h,
        choices: options(rand, { value: h, label: m(h) }, [
          { value: area - w, label: m(area - w), nope: `That’s ${n(area)} − ${w}. The area is ${w} × the side, so undo the × with ÷: ${n(area)} ÷ ${w} = ${h} m.` },
          { value: area / 2 - w, label: m(area / 2 - w), nope: `That treats ${n(area)} as the wall all the way round. It’s the floor: ${w} × side = ${n(area)}, so the side is ${n(area)} ÷ ${w} = ${h} m.` },
          { value: w, label: m(w), nope: `That’s the front wall again. The yard isn’t a square: ${n(area)} ÷ ${w} = ${h} m.` },
          { value: area / SQUARE, label: m(area / SQUARE), nope: `That’s ${n(area)} ÷ 5. Divide by the ${w} m front wall: ${n(area)} ÷ ${w} = ${h} m.` },
        ], { valid: whole }),
        why: `${w} × ? = ${n(area)}, so ? = ${n(area)} ÷ ${w} = ${h} m. Check: ${w} × ${h} = ${n(area)}.`,
        builds: 'side',
      },
      {
        prompt: `Wall all the way round, but leave the ${gate} m gap for the gate. How many metres of wall?`,
        answer: wall,
        choices: options(rand, { value: wall, label: m(wall) }, [
          { value: perimeter, label: m(perimeter), nope: `${perimeter} m is the whole way round. Leave the ${gate} m gate open: ${perimeter} − ${gate} = ${wall} m.` },
          { value: perimeter + gate, label: m(perimeter + gate), nope: `You added the gate. It’s a gap, so it comes off: ${perimeter} − ${gate} = ${wall} m.` },
          { value: w + h - gate, label: m(w + h - gate), nope: `That’s only two walls. All four: ${w} + ${h} + ${w} + ${h} = ${perimeter}, then − ${gate} for the gate = ${wall} m.` },
        ], { valid: whole }),
        why: `${w} + ${h} + ${w} + ${h} = ${perimeter} m round the edge. Take off the ${gate} m gate: ${wall} m of wall.`,
        builds: 'walls',
      },
    ],
    chain: [
      { line: `\\text{?} = [[a:${texNum(area)}]] \\div [[w:${w}]]` },
      { line: `\\text{?} = [[h:${tm(h)}]]`, op: 'Area ÷ side', merge: { h: ['a', 'w'] }, why: `Area = width × length, so length = area ÷ width. ${n(area)} ÷ ${w} = ${h}.` },
      { line: `\\text{P} = 2 \\times ([[p:${w}]] + [[q:${h}]])`, op: 'Round the edge', why: 'Opposite walls match, so add one of each and double it.' },
      { line: `\\text{P} = [[r:${tm(perimeter)}]]`, op: 'Work it out', merge: { r: ['p', 'q'] }, why: `${w} + ${h} = ${w + h}, and 2 × ${w + h} = ${perimeter}.` },
      { line: `\\text{Wall} = [[r:${perimeter}]] - [[g:${gate}]]`, op: '− the gate', why: `The gate is a ${gate} m gap, so that bit needs no wall.` },
      { line: `\\text{Wall} = [[z:${tm(wall)}]]`, op: 'Subtract', merge: { z: ['r', 'g'] }, why: `${perimeter} − ${gate} = ${wall}.` },
    ],
  }
}

/** Round 5, the boss: an exam-style L. Find the unmarked wall, the area, crates (round UP), then the cost. */
function hall(rand: Rand): Round {
  const coverage = rand.pick([50, 75, 100]), price = rand.pick([15, 20, 25, 30])
  let w = 0, h = 0, top = 0, cutH = 0, area = 0
  // Keep drawing halls until the crates don't come out exact (so rounding up matters) and the order is sensible.
  do {
    w = rand.int(35, 50, SQUARE); h = rand.int(30, 50, SQUARE)
    top = rand.int(15, w - 15, SQUARE); cutH = rand.int(10, h - 15, SQUARE)
    area = top * h + (w - top) * (h - cutH)
  } while (area % coverage === 0 || area / coverage > 40)
  const across = w - top, right = h - cutH
  const big = top * h, small = across * right, perimeter = 2 * (w + h)
  const under = Math.floor(area / coverage), count = under + 1, left = area - under * coverage
  const cost = count * price
  return {
    id: 'hall',
    title: 'Night 5 · The great hall',
    heading: `The great hall. One crate of tiles covers ${coverage} m² and costs ${gbp(price)}.`,
    why: 'Two walls have no length marked, so work them out from the walls opposite. Split the L into two rectangles and add them for the area. Divide by what one crate covers and round UP, because you can’t buy part of a crate. Then the cost is crates × price.',
    plan: { w, h, cut: { w: across, h: cutH } },
    labels: [m(top), null, null, m(right), m(w), m(h)],
    missing: null,
    coverage,
    walled: true,
    floored: false,
    gate: null,
    questions: [
      {
        prompt: 'Two walls aren’t marked. Work out the floor area.',
        answer: area,
        choices: options(rand, { value: area, label: m2(area) }, [
          { value: w * h, label: m2(w * h), nope: `That’s ${w} × ${h}, a full rectangle. The corner’s missing: ${top} × ${h} = ${n(big)}, plus ${across} × ${right} = ${n(small)}, makes ${n(area)} m².` },
          { value: big + w * right, label: m2(big + w * right), nope: `You used the whole ${w} m for the small piece, so it overlaps the big one. Its width is ${w} − ${top} = ${across}: ${n(big)} + ${n(small)} = ${n(area)} m².` },
          { value: big, label: m2(big), nope: `That’s only the big piece, ${top} × ${h}. Add the small one: ${across} × ${right} = ${n(small)}, so ${n(area)} m².` },
          { value: perimeter, label: m2(perimeter), nope: `${perimeter} m is the wall round the edge. The floor is inside: ${n(big)} + ${n(small)} = ${n(area)} m².` },
        ]),
        why: `The unmarked step is ${w} − ${top} = ${across} m. Split it: ${top} × ${h} = ${n(big)} and ${across} × ${right} = ${n(small)}. Total ${n(area)} m².`,
        builds: 'floor',
      },
      {
        prompt: `One crate covers ${coverage} m². How many crates do you need to buy?`,
        answer: count,
        choices: options(rand, { value: count, label: crates(count) }, [
          { value: under, label: crates(under), nope: `${under} crates only cover ${n(under * coverage)} m², leaving ${left} m² of mud. You can’t buy part of a crate, so round UP: ${count}.` },
          { value: area / 25, label: crates(area / 25), nope: `That’s one crate per grid square. A crate covers ${coverage} m²: ${n(area)} ÷ ${coverage} = ${under} remainder ${left}, so ${count} crates.` },
          { value: count + 1, label: crates(count + 1), nope: `${count} crates already cover ${n(count * coverage)} m², more than the ${n(area)} m² floor. One more is a waste of money.` },
        ], { valid: whole }),
        why: `${n(area)} ÷ ${coverage} = ${under} remainder ${left}. ${under} crates leave ${left} m² bare, so round up: ${count} crates.`,
        builds: 'crates',
      },
      {
        prompt: `Each crate costs ${gbp(price)}. How much is the order?`,
        answer: cost,
        choices: options(rand, { value: cost, label: gbp(cost) }, [
          { value: under * price, label: gbp(under * price), nope: `That’s ${under} crates: not enough to cover the floor. You need ${count}: ${count} × ${gbp(price)} = ${gbp(cost)}.` },
          { value: area / coverage * price, label: gbp(area / coverage * price), nope: `That pays for part of a crate. The shop sells whole crates: ${count} × ${gbp(price)} = ${gbp(cost)}.` },
          { value: count + price, label: gbp(count + price), nope: `That’s ${count} + ${price}. Each crate costs ${gbp(price)}, so multiply: ${count} × ${gbp(price)} = ${gbp(cost)}.` },
        ]),
        why: `${count} crates × ${gbp(price)} = ${gbp(cost)}. Bex is checking her wallet.`,
        builds: 'cost',
      },
    ],
    chain: [
      { line: `\\text{Step} = [[w:${w}]] - [[t:${top}]]` },
      { line: `\\text{Step} = [[g:${tm(across)}]]`, op: 'Big − small', merge: { g: ['w', 't'] }, why: `The bottom wall is ${w} m. The top wall and the unmarked step across make the same, so the step is ${w} − ${top}.` },
      { line: `\\text{A} = [[p:${top}]] \\times [[q:${h}]] + [[u:${across}]] \\times [[v:${right}]]`, op: 'Split in two', why: 'Cut down the inside corner: a tall rectangle and a short one.' },
      { line: `\\text{A} = [[z:${tm2(area)}]]`, op: 'Each piece, add', merge: { z: ['p', 'q', 'u', 'v'] }, why: `${top} × ${h} = ${n(big)} and ${across} × ${right} = ${n(small)}. Add them: ${n(area)}.` },
      { line: `\\text{Crates} = [[z:${texNum(area)}]] \\div [[c:${coverage}]]`, op: `÷ ${coverage} m² a crate`, why: `Each crate covers ${coverage} m², so count how many ${coverage}s fit in the floor.` },
      { line: `\\text{Crates} = [[e:${under}\\text{ r }${left}]]`, op: 'Divide', merge: { e: ['z', 'c'] }, why: `${n(area)} ÷ ${coverage} = ${under} remainder ${left}. That ${left} m² still needs tiles.` },
      { line: `\\text{Crates} = [[k:${count}]]`, op: 'Round UP', merge: { k: ['e'] }, why: `You can’t buy part of a crate, and ${under} would leave a bare patch. So ${count}.` },
      { line: `\\text{Cost} = [[k:${count}]] \\times [[s:${texGbp(price)}]]`, op: '× the price', why: `Every crate costs ${gbp(price)}.` },
      { line: `\\text{Cost} = [[y:${texGbp(cost)}]]`, op: 'Multiply', merge: { y: ['k', 's'] }, why: `${count} × ${price} = ${cost}.` },
    ],
  }
}

/** One play: five fresh bases. */
export function makeBases(rand: Rand): Round[] {
  return [rectangle(rand), lShape(rand), supplies(rand), yard(rand), hall(rand)]
}
