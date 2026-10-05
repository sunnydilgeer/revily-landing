import type { ChainStep } from '../../step-chain/StepChain'
import type { Rand } from '../kit/random'

export type Ingredient = { id: string; name: string; emoji: string; rgb: [number, number, number] }

export const ingredients: Record<string, Ingredient> = {
  slime: { id: 'slime', name: 'Slime', emoji: '🟢', rgb: [70, 214, 96] },
  crystal: { id: 'crystal', name: 'Crystal', emoji: '💎', rgb: [60, 150, 255] },
  shroom: { id: 'shroom', name: 'Shroom', emoji: '🍄', rgb: [255, 70, 110] },
}

export type Counts = Record<string, number>

type BrewBase = {
  id: string
  potion: string
  emoji: string
  /** The recipe, in order: ingredient id → parts. */
  recipe: Counts
  task: string
  why: string
  /** Shown when they get it right. */
  win: string
  chain: ChainStep[]
}

/**
 * Brew with the steppers until the cauldron holds exactly `target`. A boss brew's recipe `makes` some potions and
 * the order is for `order` potions: find one potion's worth first, then scale up.
 */
export type MixBrew = BrewBase & { kind: 'mix'; target: Counts; makes?: number; order?: number }
/** Judge someone else's mix: is it the same ratio as the recipe? */
export type CheckBrew = BrewBase & { kind: 'check'; rival: Counts; legit: boolean; nope: string }
export type Brew = MixBrew | CheckBrew

/** Colour of a mix: each ingredient's colour weighted by how many scoops of it there are. */
export function mixColour(counts: Counts) {
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0)
  if (!total) return 'transparent'
  const mean = [0, 1, 2].map(i => Object.entries(counts).reduce((sum, [id, n]) => sum + ingredients[id].rgb[i] * n, 0) / total)
  // Averaging colours drifts towards grey, so push the mix back out from its own grey to keep it vivid.
  const grey = (mean[0] + mean[1] + mean[2]) / 3
  const [r, g, b] = mean.map(c => Math.round(Math.max(0, Math.min(255, grey + (c - grey) * 2.2))))
  return `rgb(${r} ${g} ${b})`
}

/** Scale a ratio by `k`: each part gets × k, then they merge. */
function scaleChain(parts: number[], k: number, op: string, why: string): ChainStep[] {
  const keys = ['a', 'b', 'c'], ops = ['p', 'q', 'r'], out = ['x', 'y', 'z']
  const line = (terms: string[]) => terms.join(' : ')
  return [
    { line: line(parts.map((n, i) => `[[${keys[i]}:${n}]]`)) },
    { line: line(parts.map((n, i) => `[[${keys[i]}:${n}]] [[${ops[i]}:\\times ${k}]]`)), op, why },
    {
      line: line(parts.map((n, i) => `[[${out[i]}:${n * k}]]`)),
      op: 'Work it out',
      why: parts.map(n => `${n} × ${k} = ${n * k}`).join(', ') + '.',
      merge: Object.fromEntries(parts.map((_, i) => [out[i], [keys[i], ops[i]]])),
    },
  ]
}

/** Unitary method: ÷ the potions the recipe makes, then × the potions ordered. */
function unitaryChain(parts: number[], makes: number, order: number): ChainStep[] {
  const keys = ['a', 'b', 'c'], each = ['u', 'v', 'w'], ops = ['p', 'q', 'r'], ups = ['i', 'j', 'k'], out = ['x', 'y', 'z']
  const line = (terms: string[]) => terms.join(' : ')
  const one = parts.map(n => n / makes)
  return [
    { line: line(parts.map((n, i) => `[[${keys[i]}:${n}]]`)) },
    {
      line: line(parts.map((n, i) => `[[${keys[i]}:${n}]] [[${ops[i]}:\\div ${makes}]]`)),
      op: `÷ ${makes} for 1 potion`,
      why: `The recipe makes ${makes} potions. Divide every part by ${makes} to get one potion’s worth.`,
    },
    {
      line: line(one.map((n, i) => `[[${each[i]}:${n}]]`)),
      op: 'Work it out',
      why: parts.map(n => `${n} ÷ ${makes} = ${n / makes}`).join(', ') + '.',
      merge: Object.fromEntries(parts.map((_, i) => [each[i], [keys[i], ops[i]]])),
    },
    {
      line: line(one.map((n, i) => `[[${each[i]}:${n}]] [[${ups[i]}:\\times ${order}]]`)),
      op: `× ${order} for ${order} potions`,
      why: `The order is ${order} potions, so multiply one potion’s worth by ${order}.`,
    },
    {
      line: line(one.map((n, i) => `[[${out[i]}:${n * order}]]`)),
      op: 'Work it out',
      why: one.map(n => `${n} × ${order} = ${n * order}`).join(', ') + '.',
      merge: Object.fromEntries(parts.map((_, i) => [out[i], [each[i], ups[i]]])),
    },
  ]
}

const POTIONS = [['Speed Potion', '⚡'], ['Night Vision', '🦉'], ['Giant Potion', '🦖'], ['Invisibility', '👻'], ['Fire Breath', '🐉'], ['Super Jump', '🦘']] as const
const IDS = ['slime', 'crystal', 'shroom']
const TRIPLES = [[2, 3, 1], [1, 2, 3], [3, 1, 2], [2, 1, 1], [1, 3, 2], [3, 2, 2], [2, 2, 1], [4, 1, 2]]
const PAIRS = [[3, 2], [2, 3], [1, 3], [3, 1], [2, 5], [4, 1], [1, 2]]
const FIVES = [[1, 4], [2, 3], [3, 2], [4, 1]]
/** One potion's worth for the boss brew: small, so both the recipe and the order fit on the shelf. */
const SINGLES = [[2, 1, 1], [1, 2, 1], [1, 1, 2], [2, 3, 1], [3, 1, 2], [1, 2, 3], [3, 2, 1], [2, 1, 3]]
/** Recipe makes → potions ordered. The order is never a whole number of recipes, so "just double it" can't work. */
const ORDERS = [[2, 3], [2, 5], [3, 2], [4, 6], [3, 5], [4, 3], [3, 4], [4, 5]]
const BATCH: Record<number, string> = { 2: 'double', 3: 'triple', 4: 'quadruple' }

/** The most scoops of one ingredient the shelf allows (PotionLab's MAX_SCOOPS). */
const MAX = 15
const recipeOf = (ids: string[], parts: number[]): Counts => Object.fromEntries(ids.map((id, i) => [id, parts[i]]))
const times = (counts: Counts, k: number): Counts => Object.fromEntries(Object.entries(counts).map(([id, n]) => [id, n * k]))
const name = (id: string) => ingredients[id].name.toLowerCase()

/** A fresh set of potions. Every ingredient count is a whole number of scoops, 15 at most. */
export function makeBrews(rand: Rand): Brew[] {
  const [p1, p2, p3, p5] = rand.shuffle(POTIONS)

  // 1: scale a three-part recipe by 2 or 3.
  const parts1 = rand.pick(TRIPLES), k1 = rand.pick([2, 3]), recipe1 = recipeOf(IDS, parts1)
  const target1 = times(recipe1, k1)

  // 2: you're given one ingredient's amount; find the multiplier and use it on the other.
  const pairs2 = rand.pick(PAIRS), ids2 = rand.shuffle(IDS).slice(0, 2)
  const k2 = rand.pick([2, 3, 4, 5].filter(k => Math.max(...pairs2) * k <= 15))
  const recipe2 = recipeOf(ids2, pairs2), target2 = times(recipe2, k2)
  const [given, other] = ids2

  // 3: fill a cauldron of 10 or 15 scoops with a recipe that makes 5 scoops a batch.
  const parts3 = rand.pick(FIVES), ids3 = rand.shuffle(IDS).slice(0, 2), k3 = rand.pick([2, 3])
  const recipe3 = recipeOf(ids3, parts3), target3 = times(recipe3, k3), holds = 5 * k3

  // 4: a rival's batch of potion 1, scaled up. Sometimes legit, sometimes one ingredient is off.
  const k4 = rand.pick([2, 3, 4].filter(k => Math.max(...parts1) * k <= 15)), legit = rand.chance(.5)
  const real4 = times(recipe1, k4)
  const off = rand.pick(IDS), nudge = real4[off] > 1 && rand.chance(.5) ? -1 : 1
  const rival = legit ? real4 : { ...real4, [off]: real4[off] + nudge }
  const [a1, b1, c1] = parts1
  const fakeWhy = `${IDS.filter(id => id !== off).map(id => `${recipe1[id]} → ${real4[id]}`).join(' and ')} are both × ${k4}. But ${recipe1[off]} ${name(off)} × ${k4} is ${real4[off]}, not ${rival[off]}.`

  // 5 (boss): the recipe makes `makes` potions; brew `order` of them. Find one potion's worth, then scale up.
  const [makes, order] = rand.pick(ORDERS)
  const single = rand.pick(SINGLES.filter(parts => Math.max(...parts) * Math.max(makes, order) <= MAX))
  const recipe5 = recipeOf(IDS, single.map(n => n * makes)), target5 = recipeOf(IDS, single.map(n => n * order))
  const parts5 = IDS.map(id => recipe5[id])

  return [
    {
      id: 'brew-1',
      kind: 'mix',
      potion: p1[0],
      emoji: p1[1],
      recipe: recipe1,
      task: `Brew a ${BATCH[k1]} batch.`,
      why: `A recipe is a ratio. A ${BATCH[k1]} batch means × ${k1} everything, so the potion comes out exactly the same, just more of it. Watch the colour.`,
      target: target1,
      win: `Every ingredient × ${k1}, so it’s the same mix: ${parts1.map(n => n * k1).join(' : ')} is the same colour as ${parts1.join(' : ')}.`,
      chain: scaleChain(parts1, k1, `× ${k1} every part`, `${BATCH[k1][0].toUpperCase() + BATCH[k1].slice(1)} batch: multiply every part by ${k1}. Doing the same to every part keeps the ratio the same.`),
    },
    {
      id: 'brew-2',
      kind: 'mix',
      potion: p2[0],
      emoji: p2[1],
      recipe: recipe2,
      task: `You’ve got ${target2[given]} ${name(given)}. Use it all.`,
      why: `You can scale by any number, not just 2. Work out what the ${name(given)} got multiplied by, then do the same to the ${name(other)}.`,
      target: target2,
      win: `${recipe2[given]} ${name(given)} became ${target2[given]}, that’s × ${k2}. So the ${name(other)} is ${recipe2[other]} × ${k2} = ${target2[other]}.`,
      chain: scaleChain(pairs2, k2, `× ${k2} both parts`, `${recipe2[given]} → ${target2[given]} ${name(given)} is × ${k2}. The ${name(other)} has to be × ${k2} as well, or the mix changes.`),
    },
    {
      id: 'brew-3',
      kind: 'mix',
      potion: p3[0],
      emoji: p3[1],
      recipe: recipe3,
      task: `The cauldron holds exactly ${holds} scoops. Fill it.`,
      why: `One batch is ${parts3[0]} + ${parts3[1]} = 5 scoops. Work out how many batches fit in the cauldron.`,
      target: target3,
      win: `${parts3[0]} + ${parts3[1]} = 5 scoops a batch. ${holds} ÷ 5 = ${k3} batches, so × ${k3}: ${target3[ids3[0]]} ${name(ids3[0])} and ${target3[ids3[1]]} ${name(ids3[1])}.`,
      chain: scaleChain(parts3, k3, `× ${k3} both parts`, `${parts3[0]} + ${parts3[1]} = 5 scoops in one batch, and ${holds} ÷ 5 = ${k3}. So the cauldron takes ${k3} batches.`),
    },
    {
      id: 'brew-4',
      kind: 'check',
      potion: p1[0],
      emoji: p1[1],
      recipe: recipe1,
      task: `A rival is selling ${p1[0]} mixed ${IDS.map(id => rival[id]).join(' : ')}. Legit or fake?`,
      why: 'Same potion means same ratio. Find what turns the recipe into their mix. If even one number doesn’t fit, it’s a fake.',
      rival,
      legit,
      nope: legit
        ? `Every part is × ${k4}: ${a1} → ${real4.slime}, ${b1} → ${real4.crystal}, ${c1} → ${real4.shroom}. Same ratio, so it’s the real thing.`
        : `${fakeWhy} It’s a fake.`,
      win: legit
        ? `${a1} × ${k4} = ${real4.slime}, ${b1} × ${k4} = ${real4.crystal}, ${c1} × ${k4} = ${real4.shroom}. Every part × ${k4}: legit!`
        : `${fakeWhy} ${nudge > 0 ? 'Too much' : 'Too little'} ${name(off)}: fake.`,
      chain: [
        ...scaleChain(parts1, k4, `× ${k4} every part`, `${IDS.filter(id => id !== off).map(id => `${recipe1[id]} → ${rival[id]}`).join(' and ')}: × ${k4}. A real batch would be × ${k4} all the way.`).slice(0, 2),
        {
          line: `[[x:${real4.slime}]] : [[y:${real4.crystal}]] : [[z:${real4.shroom}]]`,
          op: 'Work it out',
          why: legit ? `A real batch is ${IDS.map(id => real4[id]).join(' : ')}, exactly theirs. Legit.` : `A real batch is ${IDS.map(id => real4[id]).join(' : ')}. Theirs has ${rival[off]} ${name(off)}. Fake.`,
          merge: { x: ['a', 'p'], y: ['b', 'q'], z: ['c', 'r'] },
        },
      ],
    },
    {
      id: 'boss',
      kind: 'mix',
      potion: p5[0],
      emoji: p5[1],
      recipe: recipe5,
      makes,
      order,
      task: `The recipe makes ${makes} potion${makes === 1 ? '' : 's'}. Brew ${order}.`,
      why: `${order} ÷ ${makes} isn’t a nice number, so don’t guess the multiplier. Divide every part by ${makes} to get one potion’s worth. Then multiply every part by ${order}. Never add the same amount to every part: that changes the ratio.`,
      target: target5,
      win: `${parts5.join(' : ')} ÷ ${makes} = ${single.join(' : ')} for one potion. × ${order} = ${single.map(n => n * order).join(' : ')} for ${order}.`,
      chain: unitaryChain(parts5, makes, order),
    },
  ]
}
