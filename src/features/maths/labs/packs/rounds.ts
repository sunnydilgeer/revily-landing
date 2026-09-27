import type { ChainStep } from '../../step-chain/StepChain'

export type Rarity = { id: 'common' | 'rare' | 'legendary'; name: string; emoji: string; chance: number }

export const rarities: Rarity[] = [
  { id: 'common', name: 'Common', emoji: '⚪', chance: .7 },
  { id: 'rare', name: 'Rare', emoji: '🔷', chance: .25 },
  { id: 'legendary', name: 'Legendary', emoji: '🌟', chance: .05 },
]

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
}

/** A small seeded random generator, so every student's "random" packs are the same and the page is testable. */
export function seeded(seed: number) {
  let a = seed
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0
    let t = Math.imul(a ^ a >>> 15, 1 | a)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

/** Open `count` packs: each is common, rare or legendary with the odds above. */
export function openPacks(count: number, seed: number): Rarity['id'][] {
  const random = seeded(seed)
  return Array.from({ length: count }, () => {
    const roll = random()
    return roll < .05 ? 'legendary' : roll < .3 ? 'rare' : 'common'
  })
}

export const rounds: Round[] = [
  {
    id: 'odds',
    title: 'Round 1 · Read the odds',
    brief: 'Jax’s pack shop. The legendary odds are hidden in the small print.',
    why: 'Every pack gives exactly one card, so the chances of all the outcomes add up to 100%. Find the missing one.',
    questions: [
      {
        prompt: 'Common is 70%, Rare is 25%. What’s the chance of a Legendary?',
        answer: 5,
        choices: [
          { value: 95, label: '95%', nope: '95% is the chance of common OR rare. All three add to 100%, so 100 − 95.' },
          { value: 5, label: '5%' },
          { value: 30, label: '30%', nope: 'That’s 100 − 70. Take away the rare 25% as well.' },
        ],
        why: '100% − 70% − 25% = 5%. That’s 5 in every 100 packs.',
        revealsOdds: true,
      },
      {
        prompt: 'Probability runs from 0 (impossible) to 1 (certain). Write 5% as a decimal.',
        answer: .05,
        choices: [
          { value: .5, label: '0.5', nope: '0.5 is 50%, a coin flip. 5% is 5 ÷ 100 = 0.05.' },
          { value: 5, label: '5', nope: 'A probability can’t be bigger than 1. 5% = 5 ÷ 100.' },
          { value: .05, label: '0.05' },
        ],
        why: '5% = 5 ÷ 100 = 0.05. Close to 0: very unlikely.',
      },
    ],
    chain: [
      { line: 'P(\\text{L}) = [[t:100\\%]] - [[a:70\\%]] - [[b:25\\%]]' },
      { line: 'P(\\text{L}) = [[r:5\\%]]', op: 'Work it out', merge: { r: ['t', 'a', 'b'] }, why: 'P(L) is the probability of a Legendary. The three outcomes cover every pack, so they add to 100%. 100 − 70 − 25 = 5.' },
      { line: 'P(\\text{L}) = [[d:0.05]]', op: 'As a decimal', merge: { d: ['r'] }, why: 'Per cent means out of 100: 5 ÷ 100 = 0.05.' },
    ],
  },
  {
    id: 'twenty',
    title: 'Round 2 · Open 20',
    brief: 'Jax says 20 packs will get you “loads” of legendaries.',
    why: 'Expected number = probability × number of tries. It’s what you’d get on average, not a promise.',
    questions: [
      {
        prompt: 'You open 20 packs. How many Legendaries should you expect?',
        answer: 1,
        choices: [
          { value: 5, label: '5', nope: '5 is the percentage. Expected = 0.05 × 20.' },
          { value: 1, label: '1' },
          { value: 20, label: '20', nope: 'That’s every single pack! Only 5 in every 100 are legendary.' },
        ],
        why: '0.05 × 20 = 1. On average, one legendary in 20 packs.',
        open: 20,
      },
    ],
    chain: [
      { line: '\\text{Expected} = [[p:0.05]] \\times [[n:20]]' },
      { line: '\\text{Expected} = [[e:1]]', op: 'Work it out', merge: { e: ['p', 'n'] }, why: 'Probability × number of tries: 0.05 × 20 = 1.' },
    ],
  },
  {
    id: 'thousand',
    title: 'Round 3 · The long run',
    brief: 'Jax: “Let’s go BIG. A thousand packs!”',
    why: 'A few packs can be lucky or unlucky. Over lots and lots of packs, the results settle close to the real odds.',
    questions: [
      {
        prompt: 'Open 1,000 packs. How many Legendaries do you expect?',
        answer: 50,
        choices: [
          { value: 5, label: '5', nope: '5 is per 100 packs. 1,000 packs is ten lots of 100.' },
          { value: 500, label: '500', nope: 'That’s half of them. 0.05 × 1,000 = 50.' },
          { value: 50, label: '50' },
        ],
        why: '0.05 × 1,000 = 50.',
        open: 1000,
      },
      {
        prompt: 'Packs cost £2. On average, what do you spend per Legendary?',
        answer: 40,
        choices: [
          { value: 2, label: '£2', nope: 'One pack is £2, but it takes about 20 packs to get one legendary (1,000 ÷ 50).' },
          { value: 40, label: '£40' },
          { value: 10, label: '£10', nope: 'That’s 5 packs. On average it takes 20 packs: 20 × £2.' },
        ],
        why: '1,000 ÷ 50 = 20 packs per legendary. 20 × £2 = £40. That’s the loot box trap.',
      },
    ],
    chain: [
      { line: '\\text{Expected} = [[p:0.05]] \\times [[n:1{,}000]]' },
      { line: '\\text{Expected} = [[e:50]]', op: 'Work it out', merge: { e: ['p', 'n'] }, why: '0.05 × 1,000 = 50 legendaries in 1,000 packs.' },
      { line: '\\text{Cost} = [[k:20]] \\times [[c:\\pounds 2]]', op: '20 packs each', why: '1,000 packs ÷ 50 legendaries = 20 packs for each one, on average.' },
      { line: '\\text{Cost} = [[m:\\pounds 40]]', op: 'Work it out', merge: { m: ['k', 'c'] }, why: '20 × £2 = £40 per legendary.' },
    ],
  },
]
