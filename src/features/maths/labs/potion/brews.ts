import type { ChainStep } from '../../step-chain/StepChain'

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

/** Brew with the steppers until the cauldron holds exactly `target`. */
export type MixBrew = BrewBase & { kind: 'mix'; target: Counts }
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

export const brews: Brew[] = [
  {
    id: 'speed',
    kind: 'mix',
    potion: 'Speed Potion',
    emoji: '⚡',
    recipe: { slime: 2, crystal: 3, shroom: 1 },
    task: 'Brew a double batch.',
    why: 'A recipe is a ratio. A double batch means double everything, so the potion comes out exactly the same, just more of it. Watch the colour.',
    target: { slime: 4, crystal: 6, shroom: 2 },
    win: 'Every ingredient × 2, so it’s the same mix: 4 : 6 : 2 is the same colour as 2 : 3 : 1.',
    chain: scaleChain([2, 3, 1], 2, '× 2 every part', 'Double batch: multiply every part by 2. Doing the same to every part keeps the ratio the same.'),
  },
  {
    id: 'night',
    kind: 'mix',
    potion: 'Night Vision',
    emoji: '🦉',
    recipe: { slime: 3, crystal: 2 },
    task: 'You’ve got 8 crystals. Use them all.',
    why: 'You can scale by any number, not just 2. Work out what the crystals got multiplied by, then do the same to the slime.',
    target: { slime: 12, crystal: 8 },
    win: '2 crystals became 8, that’s × 4. So the slime is 3 × 4 = 12.',
    chain: scaleChain([3, 2], 4, '× 4 both parts', '2 crystals → 8 crystals is × 4. The slime has to be × 4 as well, or the mix changes.'),
  },
  {
    id: 'giant',
    kind: 'mix',
    potion: 'Giant Potion',
    emoji: '🦖',
    recipe: { slime: 1, shroom: 4 },
    task: 'The cauldron holds exactly 15 scoops. Fill it.',
    why: 'One batch is 1 + 4 = 5 scoops. Work out how many batches fit in the cauldron.',
    target: { slime: 3, shroom: 12 },
    win: '1 + 4 = 5 scoops a batch. 15 ÷ 5 = 3 batches, so × 3: 3 slime and 12 shroom.',
    chain: scaleChain([1, 4], 3, '× 3 both parts', '1 + 4 = 5 scoops in one batch, and 15 ÷ 5 = 3. So the cauldron takes 3 batches.'),
  },
  {
    id: 'fake',
    kind: 'check',
    potion: 'Speed Potion',
    emoji: '⚡',
    recipe: { slime: 2, crystal: 3, shroom: 1 },
    task: 'A rival is selling Speed Potion mixed 6 : 9 : 4. Legit or fake?',
    why: 'Same potion means same ratio. Find what turns the recipe into their mix. If one number doesn’t fit, it’s a fake.',
    rival: { slime: 6, crystal: 9, shroom: 4 },
    legit: false,
    nope: '6 slime and 9 crystal are both × 3. But 1 shroom × 3 is 3, not 4. It’s a fake.',
    win: '2 × 3 = 6 and 3 × 3 = 9, but 1 × 3 = 3, not 4. Too much shroom: fake.',
    chain: [
      { line: '[[a:2]] : [[b:3]] : [[c:1]]' },
      { line: '[[a:2]] [[p:\\times 3]] : [[b:3]] [[q:\\times 3]] : [[c:1]] [[r:\\times 3]]', op: '× 3 every part', why: 'Slime went 2 → 6 and crystal 3 → 9: both × 3. A real Speed Potion would be × 3 all the way.' },
      { line: '[[x:6]] : [[y:9]] : [[z:3]]', op: 'Work it out', why: 'A real batch is 6 : 9 : 3. Theirs has 4 shroom. Fake.', merge: { x: ['a', 'p'], y: ['b', 'q'], z: ['c', 'r'] } },
    ],
  },
]
