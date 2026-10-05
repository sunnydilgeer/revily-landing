import type { ChainStep } from '../../step-chain/StepChain'
import { options, texNum, type Rand } from '../kit/random'

export type Rarity = { id: 'common' | 'rare' | 'legendary'; name: string; emoji: string; chance: number }

export type PackQuestion = {
  prompt: string
  answer: number
  choices: { value: number; label: string; nope?: string }[]
  why: string
  /** Answering this opens this many packs. */
  open?: number
  /** Answering this reveals the legendary odds on the odds card. */
  revealsOdds?: boolean
  /** The rarities this question counts in the packs it opens (default: legendary). */
  track?: Rarity['id'][]
  /** How many of those you'd expect in the packs it opens (default: the answer). */
  expect?: number
}

export type Round = {
  id: string
  title: string
  brief: string
  why: string
  questions: PackQuestion[]
  chain: ChainStep[]
  /** This play's odds, shared by every round. */
  odds: Rarity[]
  /** Seeds for the packs opened this play, so the "random" packs replay the same within a play. */
  seeds: Record<number, number>
  /** What a legendary costs on average, for the brag line. */
  cost: number
  /** Odds-card labels shown until a question reveals the odds (e.g. "3x"). */
  mystery?: Partial<Record<Rarity['id'], string>>
  /** Show the odds as decimals (0.15) instead of percentages. */
  decimals?: boolean
}

/** Open `count` packs with these odds. */
export function openPacks(count: number, seed: number, odds: Rarity[]): Rarity['id'][] {
  let a = seed
  const random = () => {
    a |= 0; a = a + 0x6D2B79F5 | 0
    let t = Math.imul(a ^ a >>> 15, 1 | a)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
  const legendary = odds.find(r => r.id === 'legendary')!.chance, rare = odds.find(r => r.id === 'rare')!.chance
  return Array.from({ length: count }, () => {
    const roll = random()
    return roll < legendary ? 'legendary' : roll < legendary + rare ? 'rare' : 'common'
  })
}

export const decimal = (value: number) => String(Math.round(value * 1000) / 1000)
/** Hundredths as a tidy decimal: 15 → 0.15. */
const hund = (value: number) => value / 100

/** A fresh set of rounds. Legendary is 5% or 10%, so every expected number is whole. */
export function makeRounds(rand: Rand): Round[] {
  const l = rand.pick([5, 10]), r = rand.pick([20, 25, 30]), c = 100 - l - r
  const odds: Rarity[] = [
    { id: 'common', name: 'Common', emoji: '⚪', chance: c / 100 },
    { id: 'rare', name: 'Rare', emoji: '🔷', chance: r / 100 },
    { id: 'legendary', name: 'Legendary', emoji: '🌟', chance: l / 100 },
  ]
  const p = l / 100, twenty = 20 * p, thousand = 1000 * p
  const price = rand.pick([1, 2, 5]), perLegendary = 100 / l, cost = price * perLegendary
  const shared = { odds, seeds: { 20: rand.int(1, 999999), 1000: rand.int(1, 999999) }, cost }
  const d = decimal(p)

  return [
    {
      id: 'odds',
      title: 'Round 1 · Read the odds',
      brief: 'Jax’s pack shop. The legendary odds are hidden in the small print.',
      why: 'Every pack gives exactly one card, so the chances of all the outcomes add up to 100%. Find the missing one.',
      questions: [
        {
          prompt: `Common is ${c}%, Rare is ${r}%. What’s the chance of a Legendary?`,
          answer: l,
          choices: options(rand, { value: l, label: `${l}%` }, [
            { value: c + r, label: `${c + r}%`, nope: `${c + r}% is the chance of common OR rare. All three add to 100%, so 100 − ${c + r}.` },
            { value: 100 - c, label: `${100 - c}%`, nope: `That’s 100 − ${c}. Take away the rare ${r}% as well.` },
            { value: 100 - r, label: `${100 - r}%`, nope: `That’s 100 − ${r}. Take away the common ${c}% as well.` },
          ]),
          why: `100% − ${c}% − ${r}% = ${l}%. That’s ${l} in every 100 packs.`,
          revealsOdds: true,
        },
        {
          prompt: `Probability runs from 0 (impossible) to 1 (certain). Write ${l}% as a decimal.`,
          answer: p,
          choices: options(rand, { value: p, label: d }, [
            { value: p * 10, label: decimal(p * 10), nope: `${decimal(p * 10)} is ${l * 10}%. ${l}% is ${l} ÷ 100 = ${d}.` },
            { value: l, label: String(l), nope: `A probability can’t be bigger than 1. ${l}% = ${l} ÷ 100.` },
            { value: p / 10, label: decimal(p / 10), nope: `${decimal(p / 10)} is only ${l / 10}%. ${l}% = ${l} ÷ 100 = ${d}.` },
          ]),
          why: `${l}% = ${l} ÷ 100 = ${d}. Close to 0: unlikely.`,
        },
      ],
      chain: [
        { line: `P(\\text{L}) = [[t:100\\%]] - [[a:${c}\\%]] - [[b:${r}\\%]]` },
        { line: `P(\\text{L}) = [[r:${l}\\%]]`, op: 'Work it out', merge: { r: ['t', 'a', 'b'] }, why: `P(L) is the probability of a Legendary. The three outcomes cover every pack, so they add to 100%. 100 − ${c} − ${r} = ${l}.` },
        { line: `P(\\text{L}) = [[d:${d}]]`, op: 'As a decimal', merge: { d: ['r'] }, why: `Per cent means out of 100: ${l} ÷ 100 = ${d}.` },
      ],
      ...shared,
    },
    {
      id: 'twenty',
      title: 'Round 2 · Open 20',
      brief: 'Jax says 20 packs will get you “loads” of legendaries.',
      why: 'Expected number = probability × number of tries. It’s what you’d get on average, not a promise.',
      questions: [
        {
          prompt: 'You open 20 packs. How many Legendaries should you expect?',
          answer: twenty,
          choices: options(rand, { value: twenty, label: String(twenty) }, [
            { value: l, label: String(l), nope: `${l} is the percentage. Expected = ${d} × 20.` },
            { value: 20, label: '20', nope: `That’s every single pack! Only ${l} in every 100 are legendary.` },
            { value: 20 / l, label: String(20 / l), nope: `That’s 20 ÷ ${l}. Expected = probability × tries: ${d} × 20.` },
          ], { valid: value => Number.isInteger(value) && value > 0 }),
          why: `${d} × 20 = ${twenty}. On average, ${twenty} legendary in 20 packs.`,
          open: 20,
        },
      ],
      chain: [
        { line: `\\text{Expected} = [[p:${d}]] \\times [[n:20]]` },
        { line: `\\text{Expected} = [[e:${twenty}]]`, op: 'Work it out', merge: { e: ['p', 'n'] }, why: `Probability × number of tries: ${d} × 20 = ${twenty}.` },
      ],
      ...shared,
    },
    {
      id: 'thousand',
      title: 'Round 3 · The long run',
      brief: 'Jax: “Let’s go BIG. A thousand packs!”',
      why: 'A few packs can be lucky or unlucky. Over lots and lots of packs, the results settle close to the real odds.',
      questions: [
        {
          prompt: 'Open 1,000 packs. How many Legendaries do you expect?',
          answer: thousand,
          choices: options(rand, { value: thousand, label: thousand.toLocaleString('en-GB') }, [
            { value: l, label: String(l), nope: `${l} is per 100 packs. 1,000 packs is ten lots of 100.` },
            { value: l * 100, label: (l * 100).toLocaleString('en-GB'), nope: `That’s ${l} × 100. ${d} × 1,000 = ${thousand}.` },
            { value: 1000 / l, label: String(1000 / l), nope: `That’s 1,000 ÷ ${l}. Expected = ${d} × 1,000.` },
          ]),
          why: `${d} × 1,000 = ${thousand}.`,
          open: 1000,
        },
        {
          prompt: `Packs cost £${price}. On average, what do you spend per Legendary?`,
          answer: cost,
          choices: options(rand, { value: cost, label: `£${cost}` }, [
            { value: price, label: `£${price}`, nope: `One pack is £${price}, but it takes about ${perLegendary} packs to get one legendary (1,000 ÷ ${thousand}).` },
            { value: price * l, label: `£${price * l}`, nope: `That’s ${l} packs. On average it takes ${perLegendary} packs: ${perLegendary} × £${price}.` },
            { value: cost * 2, label: `£${cost * 2}`, nope: `Too much: 1,000 ÷ ${thousand} = ${perLegendary} packs each, and ${perLegendary} × £${price} = £${cost}.` },
          ]),
          why: `1,000 ÷ ${thousand} = ${perLegendary} packs per legendary. ${perLegendary} × £${price} = £${cost}. That’s the loot box trap.`,
        },
      ],
      chain: [
        { line: `\\text{Expected} = [[p:${d}]] \\times [[n:1{,}000]]` },
        { line: `\\text{Expected} = [[e:${texNum(thousand)}]]`, op: 'Work it out', merge: { e: ['p', 'n'] }, why: `${d} × 1,000 = ${thousand} legendaries in 1,000 packs.` },
        { line: `\\text{Cost} = [[k:${perLegendary}]] \\times [[c:\\pounds ${price}]]`, op: `${perLegendary} packs each`, why: `1,000 packs ÷ ${thousand} legendaries = ${perLegendary} packs for each one, on average.` },
        { line: `\\text{Cost} = [[m:\\pounds ${cost}]]`, op: 'Work it out', merge: { m: ['k', 'c'] }, why: `${perLegendary} × £${price} = £${cost} per legendary.` },
      ],
      ...shared,
    },
    workBack(rand, odds, shared),
    boss(rand, shared),
  ]
}

type Shared = { odds: Rarity[]; seeds: Record<number, number>; cost: number }
const pct = (odds: Rarity[], id: Rarity['id']) => Math.round(odds.find(o => o.id === id)!.chance * 100)

/** Round 4: work backwards from a promise, then chain "not common" with expected number. */
function workBack(rand: Rand, odds: Rarity[], shared: Shared): Round {
  const l = pct(odds, 'legendary'), r = pct(odds, 'rare'), c = pct(odds, 'common')
  const d = decimal(l / 100), per = 100 / l
  // Answer first: k legendaries promised, so n = k ÷ p packs. k even keeps n × P(not common) whole.
  const k = rand.pick([4, 6, 8]), n = k * per
  const notC = r + l, m = n * notC / 100, dn = decimal(notC / 100), dc = decimal(c / 100)
  return {
    id: 'back',
    title: 'Round 4 · Work it backwards',
    brief: `Jax: “Want ${k} Legendaries? Just keep opening!” But how many is that?`,
    why: `Expected = probability × packs, so packs = expected ÷ probability. Not common means Rare or Legendary. Its chance is 1 − P(Common).`,
    questions: [
      {
        prompt: `You want to expect ${k} Legendaries. How many packs should you open?`,
        answer: n,
        choices: options(rand, { value: n, label: String(n) }, [
          { value: k * l, label: String(k * l), nope: `That’s ${k} × ${l}. You need packs × ${d} = ${k}, so packs = ${k} ÷ ${d} = ${n}.` },
          { value: per, label: String(per), nope: `${per} packs gets you ONE Legendary on average. You want ${k}: ${k} × ${per} = ${n}.` },
          { value: 100 * k, label: String(100 * k), nope: `That’s ${k} × 100. Each 100 packs gives ${l} Legendaries, not 1. ${k} ÷ ${d} = ${n}.` },
        ]),
        why: `${n} × ${d} = ${k}, so ${n} packs. Dividing by ${d} is the same as × ${per}.`,
        open: n,
        expect: k,
      },
      {
        prompt: `In those ${n} packs, how many cards should be NOT Common?`,
        answer: m,
        choices: options(rand, { value: m, label: String(m) }, [
          { value: n * r / 100, label: String(n * r / 100), nope: `That’s just the Rares. Legendaries aren’t common either: ${notC}% of ${n} = ${m}.` },
          { value: n - m, label: String(n - m), nope: `That’s how many ARE common: ${c}% of ${n}. Not common is 1 − ${dc} = ${dn}, and ${dn} × ${n} = ${m}.` },
          { value: notC, label: String(notC), nope: `${notC} is the percentage, per 100 packs. You opened ${n}: ${dn} × ${n} = ${m}.` },
          { value: k, label: String(k), nope: `That’s only the Legendaries. Add the Rares too: ${dn} × ${n} = ${m}.` },
        ], { valid: value => Number.isInteger(value) && value > 0 }),
        why: `P(not Common) = 1 − ${dc} = ${dn}. ${dn} × ${n} = ${m}.`,
        track: ['rare', 'legendary'],
      },
    ],
    chain: [
      { line: `[[n:n]] \\times [[p:${d}]] = [[k:${k}]]` },
      { line: `n = [[k:${k}]] \\div [[p:${d}]]`, op: 'Undo the ×', why: `Packs × probability = expected. To get the packs back, divide: ${k} ÷ ${d}.` },
      { line: `n = [[m:${n}]]`, op: 'Work it out', merge: { m: ['k', 'p'] }, why: `÷ ${d} is the same as × ${per}: ${k} × ${per} = ${n} packs.` },
      { line: `P(\\text{not C}) = 1 - [[c:${dc}]]`, op: 'Not common', why: `Every card is common or not. The chances add to 1, so take common off 1.` },
      { line: `P(\\text{not C}) = [[q:${dn}]]`, op: 'Work it out', merge: { q: ['c'] }, why: `1 − ${dc} = ${dn}. That’s Rare ${decimal(r / 100)} + Legendary ${d}.` },
      { line: `[[m:${n}]] \\times [[q:${dn}]] = [[e:${m}]]`, op: 'Expected', why: `Probability × packs: ${dn} × ${n} = ${m} cards that aren’t common.` },
    ],
    ...shared,
    seeds: { ...shared.seeds, [n]: rand.int(1, 999999) },
  }
}

/** Round 5, the boss: an exam-style missing-probability table with x, then an estimate. */
function boss(rand: Rand, shared: Shared): Round {
  // Answer first, in hundredths: P(Legendary) = x, Rare = m × x, Common is the rest.
  const X = rand.pick([5, 10]), mult = rand.pick([2, 3, 4]), R = mult * X, C = 100 - (mult + 1) * X, left = (mult + 1) * X
  const x = hund(X), dx = decimal(x), dr = decimal(hund(R)), dc = decimal(hund(C)), dl = decimal(hund(left))
  const N = rand.pick([200, 400, 500, 600]), rares = N * R / 100
  const odds: Rarity[] = [
    { id: 'common', name: 'Common', emoji: '⚪', chance: C / 100 },
    { id: 'rare', name: 'Rare', emoji: '🔷', chance: R / 100 },
    { id: 'legendary', name: 'Legendary', emoji: '🌟', chance: X / 100 },
  ]
  const twoDp = (value: number) => Number.isFinite(value) && value > 0 && Math.abs(value * 100 - Math.round(value * 100)) < 1e-9
  return {
    id: 'mega',
    title: 'Round 5 · The Mega pack',
    brief: `Jax’s new Mega pack. The odds table has an x in it. Classic Jax.`,
    why: `The probabilities still add up to 1. Rare is ${mult} times as likely as Legendary, so call Legendary x and Rare ${mult}x. Solve for x, then estimate with probability × packs.`,
    questions: [
      {
        prompt: `P(Common) = ${dc}. Rare is ${mult} times as likely as Legendary. Find x, the chance of a Legendary.`,
        answer: x,
        choices: options(rand, { value: x, label: dx }, [
          { value: hund(R), label: dr, nope: `${dr} is ${mult}x, the Rare chance. The x’s: ${mult}x + x = ${mult + 1}x = ${dl}, so x = ${dl} ÷ ${mult + 1} = ${dx}.` },
          { value: hund(left), label: dl, nope: `${dl} is Rare AND Legendary together (1 − ${dc}). That’s ${mult + 1}x: divide by ${mult + 1} to get x = ${dx}.` },
          { value: hund(left / mult), label: decimal(hund(left / mult)), nope: `You divided by ${mult}. But ${mult}x + x makes ${mult + 1}x, so ${dl} ÷ ${mult + 1} = ${dx}.` },
          { value: hund(100 / (mult + 1)), label: decimal(hund(100 / (mult + 1))), nope: `You shared all of 1 between the x’s. Take off Common first: 1 − ${dc} = ${dl}, then ÷ ${mult + 1} = ${dx}.` },
        ], { valid: twoDp }),
        why: `${dc} + ${mult}x + x = 1, so ${mult + 1}x = ${dl} and x = ${dx}. Rare = ${mult} × ${dx} = ${dr}.`,
        revealsOdds: true,
      },
      {
        prompt: `Jax opens ${N} Mega packs. Estimate how many will be Rare.`,
        answer: rares,
        choices: options(rand, { value: rares, label: String(rares) }, [
          { value: N * X / 100, label: String(N * X / 100), nope: `That used x, the Legendary chance. Rare is ${mult}x = ${dr}: ${dr} × ${N} = ${rares}.` },
          { value: N * left / 100, label: String(N * left / 100), nope: `That’s Rare AND Legendary. Just Rare: ${dr} × ${N} = ${rares}.` },
          { value: N * C / 100, label: String(N * C / 100), nope: `That’s the Commons. Rare is ${dr}: ${dr} × ${N} = ${rares}.` },
          { value: R, label: String(R), nope: `${R} is per 100 packs. Jax opens ${N}: ${dr} × ${N} = ${rares}.` },
        ], { valid: value => Number.isInteger(value) && value > 0 }),
        why: `Estimate = probability × packs: ${dr} × ${N} = ${rares} Rares.`,
        open: N,
        track: ['rare'],
      },
    ],
    chain: [
      { line: `[[c:${dc}]] + [[r:${mult}x]] + [[l:x]] = 1` },
      { line: `[[c:${dc}]] + [[s:${mult + 1}x]] = 1`, op: 'Collect the x’s', merge: { s: ['r', 'l'] }, why: `${mult}x + x = ${mult + 1}x. Same as ${mult} apples + 1 apple.` },
      { line: `[[s:${mult + 1}x]] = [[t:${dl}]]`, op: `− ${dc}`, merge: { t: ['c'] }, why: `Take ${dc} off both sides: 1 − ${dc} = ${dl}.` },
      { line: `x = [[x:${dx}]]`, op: `÷ ${mult + 1}`, merge: { x: ['s', 't'] }, why: `${dl} ÷ ${mult + 1} = ${dx}. That’s P(Legendary).` },
      { line: `P(\\text{R}) = [[y:${dr}]]`, op: `Rare is ${mult}x`, merge: { y: ['x'] }, why: `${mult} × ${dx} = ${dr}. Check: ${dc} + ${dr} + ${dx} = 1.` },
      { line: `[[n:${N}]] \\times [[y:${dr}]] = [[e:${rares}]]`, op: 'Estimate', why: `Probability × number of packs: ${dr} × ${N} = ${rares} Rares.` },
    ],
    ...shared,
    odds,
    seeds: { ...shared.seeds, [N]: rand.int(1, 999999) },
    mystery: { common: dc, rare: `${mult}x`, legendary: 'x' },
    decimals: true,
  }
}
