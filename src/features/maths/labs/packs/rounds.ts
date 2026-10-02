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

const decimal = (value: number) => String(Math.round(value * 1000) / 1000)

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
  ]
}
