import type { ChainStep } from '../../step-chain/StepChain'
import { gbp, options, texNum, whole, type Option, type Rand } from '../kit/random'

/*
 * Slice Wars: Nonna Rosa's pizza shop against Slice Kings across the road.
 *
 * Round 1 · Equal slices: equivalent fractions. Pizzas are cut into 4 to 16 slices, so every order
 *   is a/b with b from 2 to 6, scaled ×2, ×3 or ×4.
 * Round 2 · Combine orders: a/b + c/d with Foundation denominators (2, 3, 4, 5, 6, 8, 10, 12), where
 *   neither bottom divides the other and the common one is at most 24, so both pizzas need re-cutting.
 * Round 3 · Topping split: a/b of a bag of toppings (20 to 60, always a whole number per pile),
 *   plus a £ side bet on the takings.
 *
 * Every answer is picked first and the question built backwards from it. Pure TS: no React.
 */

export type Topping = { name: string; one: string; kind: 'pepperoni' | 'olive' | 'mushroom' }

export const TOPPINGS: Topping[] = [
  { name: 'pepperoni', one: 'pepperoni slice', kind: 'pepperoni' },
  { name: 'olives', one: 'olive', kind: 'olive' },
  { name: 'mushrooms', one: 'mushroom', kind: 'mushroom' },
]

type Base = {
  id: string
  /** The dial's name, also in its button names. */
  label: string
  asker: string
  prompt: string
  commit: string
  answer: number
  start: number
  min: number; max: number; step: number; jump?: number
  /** Why their (right) value is right. Most moves have one right value; `common` takes any common multiple. */
  win: (value: number) => string
  /** What went wrong with the value they set. */
  nope: (value: number) => string
}

/** Round 1: the pizza is cut, set how many slices to serve. */
export type ServeMove = Base & { kind: 'serve'; a: number; b: number; cut: number }
/** Round 1: the slices to serve are fixed, set how many to cut the pizza into. */
export type CutMove = Base & { kind: 'cut'; a: number; b: number; serve: number }
/** Round 2: cut both pizzas into the same size slices. */
export type CommonMove = Base & {
  kind: 'common'; a: number; b: number; c: number; d: number
  /** What the two pizzas are called (default Margherita and Pepperoni) and the ticket text, if not "One box: a/b + c/d". */
  names?: [string, string]; ticket?: string
}
/** Round 2: both pizzas cut into D, count the slices that go in the box. */
export type TotalMove = Base & { kind: 'total'; a: number; b: number; c: number; d: number; D: number }
/** Round 3: share the bag into b equal piles. */
export type PileMove = Base & { kind: 'pile'; a: number; b: number; n: number; topping: Topping }
/** Round 3: take a of the piles onto the pizza. */
export type TakeMove = Base & { kind: 'take'; a: number; b: number; n: number; p: number; topping: Topping }
/** Round 4: a/b on the counter, c/d goes out, both cut into D: count the slices left. */
export type LeftMove = Base & { kind: 'left'; a: number; b: number; c: number; d: number; D: number; x: number; y: number }
/** Round 5: the night's N pizzas. Count one group: 0 Margherita (a/b), 1 Pepperoni (c/d), 2 Veggie (the rest). */
export type CountMove = Base & { kind: 'count'; group: 0 | 1 | 2; N: number; a: number; b: number; c: number; d: number; M: number; P: number }

export type Move = ServeMove | CutMove | CommonMove | TotalMove | PileMove | TakeMove | LeftMove | CountMove

/** The one multiple-choice side question a round may have. */
export type Side = { prompt: string; answer: string | number; choices: Option<string | number>[]; why: string; fractions: boolean }

export type Round = {
  id: string
  title: string
  headline: string
  why: string
  moves: Move[]
  side: Side | null
  chain: ChainStep[]
}

/** Is a move right? `common` takes any number both bottoms go into. */
export function isRight(move: Move, value: number) {
  if (move.kind === 'common') return value > 0 && value % move.b === 0 && value % move.d === 0
  return value === move.answer
}

export const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y)
export const lcm = (x: number, y: number) => x / gcd(x, y) * y
const fr = (top: number, bottom: number) => `${top}/${bottom}`
const plural = (count: number, one: string, many = `${one}s`) => `${count} ${count === 1 ? one : many}`
const slices = (count: number) => plural(count, 'slice')
const multiples = (of: number, upTo: number) => Array.from({ length: Math.floor(upTo / of) }, (_, i) => (i + 1) * of)

/** Proper fractions in lowest terms with these bottoms. */
function fractions(bottoms: number[]) {
  const out: [number, number][] = []
  for (const b of bottoms) for (let a = 1; a < b; a++) if (gcd(a, b) === 1) out.push([a, b])
  return out
}

/* ---------- Round 1 · Equal slices ---------- */

function serveMove(a: number, b: number, k: number): ServeMove {
  const cut = b * k, answer = a * k
  const fix = `${b} slices → ${cut} slices is × ${k}: every slice cut in ${k}. So the top goes × ${k} too: ${a} × ${k} = ${answer}.`
  return {
    kind: 'serve', id: 'serve', a, b, cut,
    label: 'Slices to serve', asker: 'serve the order', commit: 'Serve it',
    prompt: `Order in: ${fr(a, b)} of a pizza. Nonna cut it into ${cut} slices. How many slices make ${fr(a, b)}?`,
    answer, start: 0, min: 0, max: cut, step: 1,
    win: () => `${fr(a, b)} = ${fr(answer, cut)}. Each ${fr(1, b)} became ${k} thinner slices, so ${a} × ${k} = ${answer} slices. Same amount of pizza.`,
    nope: value => {
      if (value === 0) return `Nothing served! The customer wants ${fr(a, b)}. ${fix}`
      if (value === a) return `You kept the top the same: ${fr(a, cut)}. But these slices are thinner than ${fr(1, b)}s, so ${a} of them is way less than ${fr(a, b)}. ${fix}`
      if (value === a + cut - b) return `You added ${cut - b} to the bottom (${b} → ${cut}) and the same to the top. Adding doesn’t keep a fraction the same: multiplying does. ${fix}`
      if (value === cut - answer) return `That’s the bit the customer DIDN’T order: ${fr(value, cut)}. ${fix}`
      if (value === cut) return `That’s the whole pizza! They only ordered ${fr(a, b)}. ${fix}`
      return `${fr(value, cut)} is ${value < answer ? 'less' : 'more'} than ${fr(a, b)}: look at the dashed ticket line. ${fix}`
    },
  }
}

function cutMove(a: number, b: number, k: number): CutMove {
  const serve = a * k, answer = b * k
  const fix = `${a} → ${serve} on top is × ${k}, so the bottom goes × ${k} too: ${b} × ${k} = ${answer}.`
  return {
    kind: 'cut', id: 'cut', a, b, serve,
    label: 'Cut into', asker: 'cut the pizza', commit: 'Slice it',
    prompt: `Order in: ${fr(a, b)} of a pizza, served as ${slices(serve)}. How many slices should Nonna cut it into?`,
    answer, start: b, min: 1, max: 24, step: 1,
    win: () => `${fr(a, b)} = ${fr(serve, answer)}. Top × ${k}, bottom × ${k}: ${serve} of ${answer} slices is exactly ${fr(a, b)}.`,
    nope: value => {
      if (value === b + serve - a) return `You added ${serve - a} to the top (${a} → ${serve}) and the same to the bottom. ${fr(serve, value)} isn’t ${fr(a, b)}: fractions need ×, not +. ${fix}`
      if (value === b) return `That’s the Slice Kings cut. ${slices(serve)} of a pizza cut into ${b} is ${serve > b ? 'more than a whole pizza' : `${fr(serve, b)}, not ${fr(a, b)}`}! ${fix}`
      if (value === serve) return `${slices(serve)} out of ${serve} is the whole pizza. ${fix}`
      if (value === b * serve) return `You did × ${serve} on the bottom. The top only went × ${k} (${a} → ${serve}), so the bottom goes × ${k}. ${fix}`
      if (value < serve) return `Cut into ${value}, there aren’t ${slices(serve)} to serve! ${fix}`
      return serve * b > a * value
        ? `Slices too fat: ${fr(serve, value)} is more than ${fr(a, b)}. Cut it into more. ${fix}`
        : `Slices too thin: ${fr(serve, value)} is less than ${fr(a, b)}. Cut it into fewer. ${fix}`
    },
  }
}

function equalRound(rand: Rand): Round {
  for (;;) {
    const [a, b] = rand.pick(fractions([2, 3, 4, 5, 6]))
    const k = rand.pick([2, 3, 4].filter(x => b * x <= 12))
    const [a2, b2] = rand.pick(fractions([2, 3, 4, 5, 6]))
    const ks = [2, 3, 4].filter(x => b2 * x <= 16)
    if (!ks.length || b2 === b || b * k < 4) continue
    const k2 = rand.pick(ks)
    const serve = serveMove(a, b, k), cut = cutMove(a2, b2, k2)

    // Side: which is the same as a/b? Scale by m, with the classic slips as the other options.
    const m = rand.pick([2, 3, 5].filter(x => x !== k))
    const right = fr(a * m, b * m)
    const choices = options<string | number>(rand, { value: right, label: right }, [
      { value: fr(a + m, b + m), label: fr(a + m, b + m), nope: `That adds ${m} to the top and bottom. Adding changes the fraction: ${fr(a, b)} needs × ${m} on both, giving ${right}.` },
      { value: fr(a, b * m), label: fr(a, b * m), nope: `Only the bottom got × ${m}. Thinner slices but the same number of them is less pizza. × the top by ${m} too: ${right}.` },
      { value: fr(a * m, b), label: fr(a * m, b), nope: `Only the top got × ${m}. That’s ${m} times as much pizza! Do the bottom as well: ${right}.` },
      { value: fr(a + 1, b + 1), label: fr(a + 1, b + 1), nope: `+1 top and bottom isn’t the same fraction. Same fraction means × (or ÷) both by the same number: ${right}.` },
    ])
    if (choices.length < 3) continue

    const N = b * k, s = a * k
    return {
      id: 'equal',
      title: 'Round 1 · Equal slices',
      headline: 'Same pizza, more slices',
      why: `Cut every slice of a pizza in 2 and you get twice as many slices, each half the size. Same amount of pizza. So a fraction stays the same when you × the top AND the bottom by the same number: ${fr(1, 2)} = ${fr(2, 4)} = ${fr(4, 8)}.`,
      moves: [serve, cut],
      side: {
        prompt: `Slice Kings claim their ${fr(a, b)} is bigger. Which of these is the same as ${fr(a, b)}?`,
        answer: right, choices, fractions: true,
        why: `${fr(a, b)} × ${m} on top and bottom = ${right}. Same pizza, just cut thinner. Slice Kings are bluffing.`,
      },
      chain: [
        { line: `\\frac{[[a:${a}]]}{[[b:${b}]]} = \\frac{?}{[[n:${N}]]}` },
        { line: `\\frac{[[a:${a}]] [[k:\\times ${k}]]}{[[b:${b}]] [[j:\\times ${k}]]} = \\frac{?}{[[n:${N}]]}`, op: `× ${k} top and bottom`, why: `${b} slices → ${N} slices: every slice cut in ${k}. Whatever happens to the bottom happens to the top.` },
        { line: `\\frac{[[s:${s}]]}{[[d:${N}]]} = \\frac{?}{[[n:${N}]]}`, op: 'Work it out', merge: { s: ['a', 'k'], d: ['b', 'j'] }, why: `${a} × ${k} = ${s} and ${b} × ${k} = ${N}.` },
        { line: `? = [[s:${s}]]`, op: 'Match the tops', why: `Both bottoms are ${N}, so the tops match: serve ${slices(s)}.` },
      ],
    }
  }
}

/* ---------- Round 2 · Combine orders ---------- */

function combineRound(rand: Rand): Round {
  const all = fractions([2, 3, 4, 5, 6, 8, 10, 12])
  for (;;) {
    const [a, b] = rand.pick(all), [c, d] = rand.pick(all)
    const D = lcm(b, d)
    if (b === d || D > 24 || D === Math.max(b, d)) continue
    const x = a * D / b, y = c * D / d, t = x + y
    if (t >= D || gcd(t, D) !== 1) continue
    const kb = D / b, kd = D / d
    const why = `${fr(a, b)} = ${fr(x, D)} and ${fr(c, d)} = ${fr(y, D)}`
    const table = (of: number) => multiples(of, D).join(', ')

    const common: CommonMove = {
      kind: 'common', id: 'common', a, b, c, d,
      label: 'Cut both into', asker: 'match the slices', commit: 'Cut both',
      prompt: `Order: ${fr(a, b)} of a Margherita AND ${fr(c, d)} of a Pepperoni, in one box. Cut both pizzas into the same size slices.`,
      answer: D, start: b, min: 1, max: 24, step: 1,
      win: value => value === D
        ? `${D} is in the ${b} times table AND the ${d} times table. Now ${why}.`
        : `${value} works: it’s in both times tables. Nonna uses the smallest, ${D}, so there’s less cutting. ${why}.`,
      nope: value => {
        const fix = `${b} times table: ${table(b)}. ${d} times table: ${table(d)}. ${D} is the first in both.`
        if (value === b + d) return `You added the bottoms: ${b} + ${d} = ${value}. But ${value} slices don’t line up with ${fr(1, b)}s or ${fr(1, d)}s. ${fix}`
        if (value % b === 0) return `${value} lines up with the ${fr(a, b)} pizza (${value} ÷ ${b} = ${value / b}) but not the ${fr(c, d)} one: ${value} ÷ ${d} isn’t whole. Look at the red cut. ${fix}`
        if (value % d === 0) return `${value} lines up with the ${fr(c, d)} pizza (${value} ÷ ${d} = ${value / d}) but not the ${fr(a, b)} one: ${value} ÷ ${b} isn’t whole. Look at the red cut. ${fix}`
        return `${value} doesn’t line up with either order: a cut lands in the middle of each one. You need a number both ${b} and ${d} go into. ${fix}`
      },
    }

    const total: TotalMove = {
      kind: 'total', id: 'total', a, b, c, d, D,
      label: 'Slices in the box', asker: 'box it up', commit: 'Box it',
      prompt: `Both pizzas are cut into ${D}. Box up ${fr(a, b)} of one and ${fr(c, d)} of the other. How many slices go in the box?`,
      answer: t, start: 0, min: 0, max: D, step: 1,
      win: () => `${why}. Same size slices now, so just add: ${x} + ${y} = ${t} slices, which is ${fr(t, D)} of a pizza.`,
      nope: value => {
        const fix = `${fr(a, b)} is ${x} slices (${a} × ${kb}) and ${fr(c, d)} is ${y} slices (${c} × ${kd}). ${x} + ${y} = ${t}.`
        if (value === a + c) return `You added the tops as they were: ${a} + ${c}. But those were ${fr(1, b)}s and ${fr(1, d)}s, different sizes. Count the ${fr(1, D)} slices. ${fix}`
        if (value === x) return `That’s just the ${fr(a, b)} order. Add the ${fr(c, d)} too. ${fix}`
        if (value === y) return `That’s just the ${fr(c, d)} order. Add the ${fr(a, b)} too. ${fix}`
        if (value === x + c) return `You converted ${fr(a, b)} to ${x} slices, but left the ${c} as it was. ${fr(c, d)} needs × ${kd} too. ${fix}`
        if (value === a + y) return `You converted ${fr(c, d)} to ${y} slices, but left the ${a} as it was. ${fr(a, b)} needs × ${kb} too. ${fix}`
        return `${slices(value)} is ${value < t ? 'short' : 'too many'}. ${fix}`
      },
    }

    const right = fr(t, D)
    const choices = options<string | number>(rand, { value: right, label: right }, [
      { value: fr(a + c, b + d), label: fr(a + c, b + d), nope: `That adds the tops AND the bottoms: ${a} + ${c} over ${b} + ${d}. The bottom is the slice size, and you never add slice sizes. ${why}, so ${right}.` },
      { value: fr(t, 2 * D), label: fr(t, 2 * D), nope: `You added the bottoms: ${D} + ${D}. Both are ${fr(1, D)} slices, and the size doesn’t change when you add them. Only the tops add: ${right}.` },
      { value: fr(a + c, D), label: fr(a + c, D), nope: `${a} + ${c} adds the old tops. Turn them into ${fr(1, D)}s first: ${x} + ${y} = ${t}, so ${right}.` },
      { value: fr(t, b + d), label: fr(t, b + d), nope: `The bottom isn’t ${b} + ${d}. Both pizzas are cut into ${D}, so it’s out of ${D}: ${right}.` },
    ])
    if (choices.length < 3) continue

    return {
      id: 'combine',
      title: 'Round 2 · Combine orders',
      headline: 'Two orders, one box',
      why: `You can only add slices that are the same size. ${fr(1, b)}s and ${fr(1, d)}s aren’t, so first cut both pizzas into slices that fit both: a number in both times tables. Then add the slices. The bottom (the slice size) doesn’t add.`,
      moves: [common, total],
      side: {
        prompt: `The box holds ${slices(t)} of ${D}. Write the box as a fraction of a pizza.`,
        answer: right, choices, fractions: true,
        why: `${slices(t)}, each ${fr(1, D)} of a pizza: ${right}. So ${fr(a, b)} + ${fr(c, d)} = ${right}.`,
      },
      chain: [
        { line: `\\frac{[[a:${a}]]}{[[b:${b}]]} + \\frac{[[c:${c}]]}{[[d:${d}]]}` },
        { line: `= \\frac{[[a:${a}]] [[k:\\times ${kb}]]}{[[b:${b}]] [[j:\\times ${kb}]]} + \\frac{[[c:${c}]] [[m:\\times ${kd}]]}{[[d:${d}]] [[l:\\times ${kd}]]}`, op: `Cut both into ${D}`, why: `${D} is the first number in the ${b} and ${d} times tables. ${b} × ${kb} = ${D} and ${d} × ${kd} = ${D}.` },
        { line: `= \\frac{[[p:${x}]]}{[[q:${D}]]} + \\frac{[[r:${y}]]}{[[s:${D}]]}`, op: 'Work them out', merge: { p: ['a', 'k'], q: ['b', 'j'], r: ['c', 'm'], s: ['d', 'l'] }, why: `${why}. Same size slices now.` },
        { line: `= \\frac{[[t:${t}]]}{[[u:${D}]]}`, op: 'Add the slices', merge: { t: ['p', 'r'], u: ['q', 's'] }, why: `${x} + ${y} = ${t} slices. The bottom is the slice size, so it stays ${D}.` },
      ],
    }
  }
}

/* ---------- Round 3 · Topping split ---------- */

function toppingRound(rand: Rand): Round {
  for (;;) {
    const topping = rand.pick(TOPPINGS)
    const [a, b] = rand.pick(fractions([3, 4, 5, 8, 10]).filter(([top]) => top >= 2))
    const n = rand.pick([20, 24, 30, 32, 36, 40, 45, 48, 50, 60].filter(x => x % b === 0))
    if (n === undefined) continue
    const p = n / b, take = a * p
    if (p < 3 || p > 12) continue

    const pile: PileMove = {
      kind: 'pile', id: 'pile', a, b, n, topping,
      label: 'In each pile', asker: 'share the bag', commit: 'Make the piles',
      prompt: `The order says ${fr(a, b)} of the ${n} ${topping.name}. First, share the bag into ${b} equal piles. How many in each?`,
      answer: p, start: 0, min: 0, max: n, step: 1, jump: 5,
      win: () => `${n} ÷ ${b} = ${p}. ${b} piles of ${p}: each pile is ${fr(1, b)} of the bag.`,
      nope: value => {
        const fix = `The bottom of ${fr(a, b)} says how many equal piles: ${b}. ${n} ÷ ${b} = ${p}.`
        if (value === 0) return `Empty piles! ${fix}`
        if (value * a === n && a !== b) return `You shared by ${a}, the top number. ${fix}`
        if (value === b) return `${b} is how many piles, not how many in each. ${fix}`
        if (value === n - b) return `${n} − ${b} takes ${b} away. Sharing into piles is ÷. ${fix}`
        if (value === n) return `That puts the whole bag in every pile! ${fix}`
        return value * b < n
          ? `${b} piles of ${value} only uses ${value * b}: ${n - value * b} still in the bag. Bigger piles. ${fix}`
          : `${b} piles of ${value} needs ${value * b}, but there are only ${n}. Smaller piles. ${fix}`
      },
    }

    const takeMove: TakeMove = {
      kind: 'take', id: 'take', a, b, n, p, topping,
      label: `${topping.name[0].toUpperCase()}${topping.name.slice(1)} on`, asker: 'top the pizza', commit: 'Bake it',
      prompt: `${b} piles of ${p}. The order is ${fr(a, b)} of the bag. How many ${topping.name} go on the pizza?`,
      answer: take, start: 0, min: 0, max: n, step: 1, jump: 5,
      win: () => `${fr(a, b)} means ${a} of the ${b} piles: ${a} × ${p} = ${take} ${topping.name}.`,
      nope: value => {
        const fix = `${fr(a, b)} is ${a} piles of ${p}: ${a} × ${p} = ${take}.`
        if (value === p) return `That’s one pile: ÷ ${b} only. The top says take ${a} piles. ${fix}`
        if (value * a === n) return `You did ${n} ÷ ${a}: you divided by the top. Divide by the bottom (${b}) to get a pile, then × the top. ${fix}`
        if (value === n - take) return `That’s what’s left: the other ${b - a} piles. ${fix}`
        if (value === a) return `${a} ${topping.name}? It’s ${a} PILES. ${fix}`
        if (value === n) return `The whole bag! That’s ${fr(b, b)}, not ${fr(a, b)}. ${fix}`
        return `${value} is ${value < take ? 'too few' : 'too many'}. ${fix}`
      },
    }

    // Side: the bet on the takings. c/d of £T, answer in £5s.
    const [c, d] = rand.pick(fractions([3, 4, 5, 10]))
    const T = rand.int(4, 20) * 10
    const share = T / d, owed = c * share
    if (!Number.isInteger(share) || owed % 5 !== 0) continue
    const choices = options<string | number>(rand, { value: owed, label: gbp(owed) }, [
      { value: share, label: gbp(share), nope: `${gbp(share)} is ${gbp(T)} ÷ ${d}: just ${fr(1, d)}. The bet is ${fr(c, d)}, so × ${c}: ${gbp(owed)}.` },
      { value: T / c, label: gbp(T / c), nope: `You divided by ${c}, the top. Divide by the bottom: ${gbp(T)} ÷ ${d} = ${gbp(share)}, then × ${c} = ${gbp(owed)}.` },
      ...c > 1 ? [] : [{ value: T, label: gbp(T), nope: `That’s ALL of the takings. ${fr(1, d)} means share it into ${d}: ${gbp(T)} ÷ ${d} = ${gbp(owed)}.` }],
      { value: T * c, label: gbp(T * c), nope: `You only multiplied. That’s more than they took! ÷ ${d} first: ${gbp(share)}, then × ${c} = ${gbp(owed)}.` },
      { value: T - owed, label: gbp(T - owed), nope: `That’s what Slice Kings get to keep. They owe ${fr(c, d)}: ${gbp(T)} ÷ ${d} × ${c} = ${gbp(owed)}.` },
    ], { valid: value => typeof value === 'number' && whole(value) })
    if (choices.length < 3) continue

    return {
      id: 'topping',
      title: 'Round 3 · Topping split',
      headline: `${fr(a, b)} of the bag`,
      why: `To find a fraction of an amount, share it into equal piles (÷ by the bottom), then take the piles you need (× by the top). ${fr(3, 4)} of 20: 20 ÷ 4 = 5 in each pile, 3 piles = 15.`,
      moves: [pile, takeMove],
      side: {
        prompt: `Slice Kings lost the bet: they owe Nonna ${fr(c, d)} of today’s takings. They took ${gbp(T)}. How much do they owe?`,
        answer: owed, choices, fractions: false,
        why: `${gbp(T)} ÷ ${d} = ${gbp(share)}. × ${c} = ${gbp(owed)}. Pay up, Slice Kings.`,
      },
      chain: [
        { line: `\\frac{[[a:${a}]]}{[[b:${b}]]} \\text{ of } [[n:${texNum(n)}]]` },
        { line: `[[n:${n}]] [[d:\\div]] [[b:${b}]] [[x:\\times]] [[a:${a}]]`, op: 'Divide, then times', why: `The bottom says share into ${b} equal piles. The top says take ${a} of them.` },
        { line: `[[p:${p}]] [[x:\\times]] [[a:${a}]]`, op: `${n} ÷ ${b}: one pile`, merge: { p: ['n', 'd', 'b'] }, why: `${n} ÷ ${b} = ${p} ${topping.name} in each pile.` },
        { line: `[[t:${take}]]`, op: `× ${a}: take ${a} piles`, merge: { t: ['p', 'x', 'a'] }, why: `${a} piles of ${p}: ${a} × ${p} = ${take} ${topping.name} on the pizza.` },
      ],
    }
  }
}

/* ---------- Round 4 · Leftovers ---------- */

/** The smallest number bigger than 1 that goes into n. */
const smallestFactor = (n: number) => { for (let f = 2; f <= n; f++) if (n % f === 0) return f; return n }

/** Two fractions turned into D-ths, for a chain line: × only shown where a pizza needs re-cutting. */
function convertLine(a: number, b: number, c: number, d: number, D: number, sign: string) {
  const one = (top: number, bottom: number, k: number, keys: [string, string, string, string]) => k === 1
    ? `\\frac{[[${keys[0]}:${top}]]}{[[${keys[1]}:${bottom}]]}`
    : `\\frac{[[${keys[0]}:${top}]] [[${keys[2]}:\\times ${k}]]}{[[${keys[1]}:${bottom}]] [[${keys[3]}:\\times ${k}]]}`
  return `= ${one(a, b, D / b, ['a', 'b', 'k', 'j'])} ${sign} ${one(c, d, D / d, ['c', 'd', 'm', 'l'])}`
}

function leftoverRound(rand: Rand): Round {
  const all = fractions([2, 3, 4, 5, 6, 8, 10, 12])
  for (;;) {
    const [a, b] = rand.pick(all), [c, d] = rand.pick(all)
    const D = lcm(b, d)
    if (b === d || D > 30) continue
    const x = a * D / b, y = c * D / d, r = x - y, g = gcd(r, D)
    if (r < 1 || g === 1 || r === x - c || r === a - c) continue
    const kb = D / b, kd = D / d
    // Only say the fractions that actually change: one of them may already be in D-ths.
    const why = [kb > 1 ? `${fr(a, b)} = ${fr(x, D)}` : '', kd > 1 ? `${fr(c, d)} = ${fr(y, D)}` : ''].filter(Boolean).join(' and ')
    const table = (of: number) => multiples(of, D).join(', ')

    const common: CommonMove = {
      kind: 'common', id: 'common-left', a, b, c, d,
      names: ['On the counter', 'The order'], ticket: `${fr(a, b)} left, ${fr(c, d)} going out`,
      label: 'Cut into', asker: 'line up the slices', commit: 'Cut it',
      prompt: `${fr(a, b)} of a pizza is left on the counter. A customer wants ${fr(c, d)} of a pizza from it. Cut so both amounts land on slice lines.`,
      answer: D, start: Math.min(b, d), min: 1, max: 30, step: 1,
      win: value => value === D
        ? `${D} is in the ${b} times table AND the ${d} times table. Now ${why}.`
        : `${value} works: it’s in both times tables. Nonna uses the smallest, ${D}, so there’s less cutting. ${why}.`,
      nope: value => {
        const fix = `${b} times table: ${table(b)}. ${d} times table: ${table(d)}. ${D} is the first in both.`
        if (value === b - d || value === d - b) return `You took the bottoms away: that gives ${value}. The bottom is the slice size, and ${value} slices don’t line up with both. ${fix}`
        if (value === b + d) return `You added the bottoms: ${b} + ${d} = ${value}. ${value} slices don’t line up with both amounts. ${fix}`
        if (value % b === 0) return `${value} lines up with the ${fr(a, b)} (${value} ÷ ${b} = ${value / b}) but not the ${fr(c, d)}: ${value} ÷ ${d} isn’t whole. Look at the red cut. ${fix}`
        if (value % d === 0) return `${value} lines up with the ${fr(c, d)} (${value} ÷ ${d} = ${value / d}) but not the ${fr(a, b)}: ${value} ÷ ${b} isn’t whole. Look at the red cut. ${fix}`
        return `${value} doesn’t line up with either amount. You need a number both ${b} and ${d} go into. ${fix}`
      },
    }

    const left: LeftMove = {
      kind: 'left', id: 'left', a, b, c, d, D, x, y,
      label: 'Slices left', asker: 'what’s left?', commit: 'Serve it',
      prompt: `Cut into ${D}: ${fr(a, b)} on the counter, ${fr(c, d)} goes out to the customer. How many slices are left?`,
      answer: r, start: 0, min: 0, max: D, step: 1,
      win: () => `${why}. Same size slices, so take away: ${x} − ${y} = ${slices(r)}, which is ${fr(r, D)} of a pizza.`,
      nope: value => {
        const fix = `${fr(a, b)} is ${x} slices (${a} × ${kb}) and ${fr(c, d)} is ${y} slices (${c} × ${kd}). ${x} − ${y} = ${r}.`
        if (value === x + y) return `You added. The order goes OUT of the shop, so take it away. ${fix}`
        if (value === a - c) return `You took away the tops as they were: ${a} − ${c}. But those were ${fr(1, b)}s and ${fr(1, d)}s, different sizes. ${fix}`
        if (value === x - c) return `You turned ${fr(a, b)} into ${x} slices but left the ${c} as it was. ${fr(c, d)} needs × ${kd} too. ${fix}`
        if (value === x) return `That’s what was there BEFORE the order went out. ${fix}`
        if (value === y) return `That’s the order, not what’s left. ${fix}`
        if (value === D - r) return `That’s the bit of the pizza that’s gone, not what’s left. ${fix}`
        return `${slices(value)} is ${value < r ? 'too few' : 'too many'}. ${fix}`
      },
    }

    const right = fr(r / g, D / g)
    const half = smallestFactor(g)
    const choices = options<string | number>(rand, { value: right, label: right }, [
      ...half < g ? [{ value: fr(r / half, D / half), label: fr(r / half, D / half), nope: `Good start: ÷ ${half} gives ${fr(r / half, D / half)}. But ${r / half} and ${D / half} can both still be divided. Keep going: ${right}.` }] : [],
      { value: fr(r, D), label: fr(r, D), nope: `${fr(r, D)} is the right amount, but not in its simplest form: ${r} and ${D} both divide by ${g}. That gives ${right}.` },
      { value: fr(r / g, D), label: fr(r / g, D), nope: `You divided the top by ${g} but not the bottom. Same number, top AND bottom: ${right}.` },
      { value: fr(r, D / g), label: fr(r, D / g), nope: `You divided the bottom by ${g} but not the top. Same number, top AND bottom: ${right}.` },
    ])
    if (choices.length < 3) continue

    const chain = [
      { line: `\\frac{[[a:${a}]]}{[[b:${b}]]} - \\frac{[[c:${c}]]}{[[d:${d}]]}` },
      { line: convertLine(a, b, c, d, D, '-'), op: `Cut both into ${D}`, why: `${D} is the first number in the ${b} and ${d} times tables.${kb > 1 ? ` ${b} × ${kb} = ${D}.` : ''}${kd > 1 ? ` ${d} × ${kd} = ${D}.` : ''}` },
      {
        line: `= \\frac{[[p:${x}]]}{[[q:${D}]]} - \\frac{[[r:${y}]]}{[[s:${D}]]}`, op: 'Work them out',
        merge: { p: kb > 1 ? ['a', 'k'] : ['a'], q: kb > 1 ? ['b', 'j'] : ['b'], r: kd > 1 ? ['c', 'm'] : ['c'], s: kd > 1 ? ['d', 'l'] : ['d'] },
        why: `${why}. Same size slices now.`,
      },
      { line: `= \\frac{[[t:${r}]]}{[[u:${D}]]}`, op: 'Take away the slices', merge: { t: ['p', 'r'], u: ['q', 's'] }, why: `${x} − ${y} = ${r} slices. The bottom is the slice size, so it stays ${D}.` },
      { line: `= \\frac{[[v:${r / g}]]}{[[w:${D / g}]]}`, op: `÷ ${g} top and bottom`, merge: { v: ['t'], w: ['u'] }, why: `${r} and ${D} both divide by ${g}, so ${fr(r, D)} = ${right}. Simplest form: nothing else goes into both.` },
    ]

    return {
      id: 'leftover',
      title: 'Round 4 · Leftovers',
      headline: 'Take it away',
      why: `Taking away works just like adding: you can only take away slices of the same size. Cut both amounts into a number in both times tables. Then take away the tops. Last, simplify: ÷ the top and bottom by the same number until nothing else goes into both.`,
      moves: [common, left],
      side: {
        prompt: `${slices(r)} of ${D} are left. Write that as a fraction in its simplest form.`,
        answer: right, choices, fractions: true,
        why: `${r} and ${D} both divide by ${g}: ${fr(r, D)} = ${right}. So ${fr(a, b)} − ${fr(c, d)} = ${right}.`,
      },
      chain,
    }
  }
}

/* ---------- Round 5 · Friday night (boss) ---------- */

function bossRound(rand: Rand): Round {
  const all = fractions([2, 3, 4, 5, 6, 8, 10])
  for (;;) {
    const [a, b] = rand.pick(all), [c, d] = rand.pick(all)
    if (b === d) continue
    const Ns = [20, 24, 30, 36, 40, 48, 50, 60].filter(x => x % b === 0 && x % d === 0)
    if (!Ns.length) continue
    const N = rand.pick(Ns)
    const M = a * N / b, P = c * N / d, V = N - M - P
    if (V < 2 || M === P || V === M || V === P) continue
    const base = { N, a, b, c, d, M, P, start: 0, min: 0, max: N, step: 1, jump: 5 }
    const ofFix = (top: number, bottom: number, count: number, name: string) =>
      `${fr(top, bottom)} of ${N}: ${N} ÷ ${bottom} = ${N / bottom}, then × ${top} = ${count} ${name}.`
    const ofNope = (top: number, bottom: number, count: number, name: string) => (value: number) => {
      const fix = ofFix(top, bottom, count, name)
      if (value === N / bottom && top > 1) return `That’s ${fr(1, bottom)} of ${N}: you stopped after ÷ ${bottom}. Now × ${top}. ${fix}`
      if (value * top === N && top !== bottom) return `You did ${N} ÷ ${top}: you divided by the top. Divide by the bottom, then × the top. ${fix}`
      if (value === N - count) return `That’s the pizzas that WEREN’T ${name}. ${fix}`
      if (value === top) return `${top} pizzas? ${fr(top, bottom)} is a fraction OF the ${N}. ${fix}`
      if (value === N) return `That’s every pizza sold! ${fix}`
      return `${value} is ${value < count ? 'too few' : 'too many'}. ${fix}`
    }

    const marg: CountMove = {
      ...base, kind: 'count', id: 'marg', group: 0,
      label: 'Margherita', asker: 'count the Margheritas', commit: 'Count them',
      prompt: `Friday night: ${N} pizzas sold. ${fr(a, b)} of them were Margherita. How many is that?`,
      answer: M,
      win: () => ofFix(a, b, M, 'Margherita'),
      nope: ofNope(a, b, M, 'Margherita'),
    }
    const pep: CountMove = {
      ...base, kind: 'count', id: 'pep', group: 1,
      label: 'Pepperoni', asker: 'count the Pepperonis', commit: 'Count them',
      prompt: `${fr(c, d)} of the ${N} pizzas were Pepperoni. How many is that?`,
      answer: P,
      win: () => ofFix(c, d, P, 'Pepperoni'),
      nope: ofNope(c, d, P, 'Pepperoni'),
    }
    const vegFix = `${M} Margherita + ${P} Pepperoni = ${M + P}. ${N} − ${M + P} = ${V} Veggie.`
    const veg: CountMove = {
      ...base, kind: 'count', id: 'veg', group: 2,
      label: 'Veggie', asker: 'the rest', commit: 'Count them',
      prompt: `The rest of the ${N} pizzas were Veggie. How many Veggie pizzas were sold?`,
      answer: V,
      win: () => `The rest is what’s left after the other two. ${vegFix}`,
      nope: value => {
        if (value === N - M) return `You only took away the Margheritas. The Pepperonis go too. ${vegFix}`
        if (value === N - P) return `You only took away the Pepperonis. The Margheritas go too. ${vegFix}`
        if (value === M + P) return `That’s the Margherita and Pepperoni together. Veggie is what’s LEFT. ${vegFix}`
        if (value === N - a - c) return `You took away the tops of the fractions, not the pizzas. ${vegFix}`
        return `${value} is ${value < V ? 'too few' : 'too many'}. ${vegFix}`
      },
    }

    const g = gcd(V, N), right = fr(V / g, N / g)
    const rest = N - V, gr = gcd(rest, N)
    const choices = options<string | number>(rand, { value: right, label: right }, [
      { value: fr(V, N), label: fr(V, N), nope: `${fr(V, N)} is the right amount, but not in its simplest form: ${V} and ${N} both divide by ${g}. That gives ${right}.` },
      { value: fr(V, N - V), label: fr(V, N - V), nope: `That’s Veggie against the rest (${V} to ${N - V}). A fraction is out of ALL ${N} pizzas: ${fr(V, N)} = ${right}.` },
      { value: fr(rest / gr, N / gr), label: fr(rest / gr, N / gr), nope: `That’s the Margherita and Pepperoni (${rest} of ${N}). Veggie is the other ${V}: ${right}.` },
      { value: fr(b + d - a - c, b + d), label: fr(b + d - a - c, b + d), nope: `You added the fractions by adding tops and bottoms. Never add the bottoms. Count the pizzas instead: ${V} of ${N} = ${right}.` },
    ])
    if (choices.length < 3) continue

    const chain = [
      { line: `\\frac{[[a:${a}]]}{[[b:${b}]]} \\text{ of } [[n:${N}]]` },
      { line: `[[n:${N}]] \\div [[b:${b}]] \\times [[a:${a}]] = [[m:${M}]]`, op: 'Margherita', why: `÷ by the bottom, × by the top: ${N} ÷ ${b} = ${N / b}, × ${a} = ${M}.` },
      { line: `[[n:${N}]] \\div [[d:${d}]] \\times [[c:${c}]] = [[p:${P}]]`, op: 'Pepperoni', why: `Same again for ${fr(c, d)}: ${N} ÷ ${d} = ${N / d}, × ${c} = ${P}.` },
      { line: `[[n:${N}]] - [[m:${M}]] - [[p:${P}]]`, op: 'The rest', why: `Veggie is whatever’s left of the ${N} once the Margheritas and Pepperonis are gone.` },
      { line: `= [[v:${V}]]`, op: 'Take away', merge: { v: ['n', 'm', 'p'] }, why: `${N} − ${M} − ${P} = ${V} Veggie pizzas.` },
      g > 1
        ? { line: `\\frac{[[v:${V}]]}{[[n:${N}]]} = \\frac{[[s:${V / g}]]}{[[t:${N / g}]]}`, op: 'As a fraction', why: `${V} out of ${N} were Veggie. Both divide by ${g}: ${right}.` }
        : { line: `\\frac{[[v:${V}]]}{[[n:${N}]]}`, op: 'As a fraction', why: `${V} out of ${N} were Veggie: ${right}. Nothing goes into both, so it’s already simplest.` },
    ]

    return {
      id: 'boss',
      title: 'Round 5 · Friday night',
      headline: 'The whole night’s orders',
      why: `To find a fraction of an amount, ÷ by the bottom, then × by the top. Do that for each fraction you’re given. The rest is what’s left when you take those away from the total. A fraction of the total is the count over the total, simplified.`,
      moves: [marg, pep, veg],
      side: {
        prompt: `What fraction of the ${N} pizzas were Veggie? Give it in its simplest form.`,
        answer: right, choices, fractions: true,
        why: `${V} of the ${N} were Veggie: ${fr(V, N)}${g > 1 ? ` = ${right}` : ''}. Slice Kings didn’t sell that many all week.`,
      },
      chain,
    }
  }
}

export function makeRounds(rand: Rand): Round[] {
  return [equalRound(rand), combineRound(rand), toppingRound(rand), leftoverRound(rand), bossRound(rand)]
}
