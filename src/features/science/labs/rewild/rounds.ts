import { options, type Rand } from '../../../maths/labs/kit/random'
import { diagnose, n, tex, type Task } from '../kit/types'
import type { PlayRound, PlayTask, Tile, TileTask } from '../kit/tiles'

/*
 * Rewild: bring a British river valley back to life with Ranger Rowan of the local Wildlife Trust
 * (AQA Trilogy 4.7 Ecology, Foundation): quadrats and population estimates, percentage cover along a
 * transect, abiotic and biotic factors, food chains and predator–prey cycles, biodiversity and land use
 * (wetlands, peat), and the field investigation required practical. Pyramids of biomass and trophic
 * efficiency are Biology-only, so they stay out. The hands-on tasks ARE the ecology: sort factors, build
 * the food chain, place the beaver dam's effects, order the practical. The calculations stay as dials.
 */

export type Layout = 'mean' | 'meadow' | 'transect' | 'factors' | 'chain' | 'graph' | 'wetland' | 'dam' | 'method'

export type Scene = {
  layout: Layout
  /** How far the valley has rewilded (the round number, 0–4): the backdrop gains wildlife each round. */
  level: number
  /** Mean: the five quadrat counts. Method: the ten random quadrats' counts. */
  counts?: number[]
  /** Meadow: the habitat being estimated, its area label and the mean per m². */
  field?: { flower: 'orchid' | 'buttercup'; area: string; mean: number }
  /** Transect: how many of the 25 squares the meadowsweet covers. */
  near?: number
  /** Graph: the vole low and peak, and the owls hunting at the peak. */
  graph?: { low: number; peak: number; owls: number }
}
export type RwTask = PlayTask<Scene>
export type RwRound = PlayRound<Scene>

/** k friendly counts with a whole-number mean, not all the same. */
function countsFor(rand: Rand, mean: number, k: number) {
  for (let tries = 0; tries < 50; tries++) {
    const offsets = Array.from({ length: k - 1 }, () => rand.int(-3, 3))
    const last = -offsets.reduce((a, b) => a + b, 0)
    const all = [...offsets, last]
    if (Math.abs(last) <= 4 && all.every(d => mean + d >= 0) && all.some(d => d !== 0)) return all.map(d => mean + d)
  }
  return Array.from({ length: k }, (_, i) => mean + (i === 0 ? 1 : i === 1 ? -1 : 0))
}

const label = (palette: Tile[], value: string) => palette.find(tile => tile.value === value)?.label ?? value
/** A tile's words without its emoji: “🌿 Nettles competing” → “Nettles competing”. */
const words = (palette: Tile[], value: string) => label(palette, value).replace(/^\S+\s/, '')

/** Round 1: the mean number per quadrat, then mean × area for the whole meadow. Two dials: the real exam maths. */
function quadratRound(rand: Rand): RwRound {
  const M = rand.int(4, 12), counts = countsFor(rand, M, 5), sum = M * 5
  const most = Math.max(...counts), least = Math.min(...counts)
  const fix1 = `Add them up and share: ${sum} ÷ 5 = ${M} orchids per quadrat.`
  const t1: Task<Scene> = {
    id: 'quad-1', prompt: `Five quadrats: ${counts.join(', ')} bee orchids. Mean per quadrat?`,
    label: 'Mean per quadrat', unit: 'orchids', answer: M, start: 0, min: 0, max: 30, step: 1, jump: 5,
    win: `The mean evens out lucky and unlucky quadrats: watch the columns level off. ${fix1}`,
    nope: value => diagnose(M, value, 'orchids', [
      [sum, `That’s the total of all five quadrats. Divide it by 5 for the mean.`],
      [most, `That’s just the biggest count. Use all five: add them, then divide by 5.`],
      [least, `That’s just the smallest count. Use all five: add them, then divide by 5.`],
      [most - least, `That’s the range (biggest − smallest), not the mean.`],
      [sum % 4 === 0 ? sum / 4 : NaN, `You divided by 4. There are 5 quadrats, so divide by 5.`],
    ], fix1),
    scene: { layout: 'mean', level: 0, counts },
  }

  const A = rand.pick([50, 80, 100, 120, 150, 200, 250, 300, 400, 500]), pop = M * A
  const fix2 = `Population = mean per m² × area = ${M} × ${A} = ${n(pop)} orchids.`
  const t2: Task<Scene> = {
    id: 'quad-2', prompt: `Mean ${M} per m². The meadow is ${A} m². Estimate the orchids.`,
    label: 'Orchid population', unit: 'orchids', answer: pop, start: 0, min: 0, max: Math.max(1000, Math.ceil(pop * 2 / 100) * 100), step: 10, jump: 100,
    win: `Each quadrat is 1 m², so scale up from 1 m² to the whole meadow. ${fix2}`,
    nope: value => diagnose(pop, value, 'orchids', [
      [sum * A, `You used the total of all five quadrats (${sum}). Use the mean, ${M} per m².`],
      [M + A, `You added. Multiply: ${M} orchids on every one of the ${A} m².`],
      [A, `That’s the area. Multiply it by ${M} orchids per m².`],
      [A * 5, `You multiplied by the number of quadrats. Multiply the area by the mean, ${M}.`],
    ], fix2),
    scene: { layout: 'meadow', level: 0, field: { flower: 'orchid', area: `${A} m² meadow`, mean: M } },
  }

  const right = 'All the bee orchids living in the meadow'
  return {
    id: 'quad', title: 'Round 1 · The meadow', headline: 'Count the orchids',
    why: `You can’t count every plant in a meadow, so you sample with quadrats. A quadrat is a square frame, here 1 m². Count inside a few quadrats and find the mean. Mean = total ÷ number of quadrats. Then population = mean per m² × area.`,
    tasks: [t1, t2],
    side: {
      prompt: 'You just estimated a POPULATION. What is a population?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'Every plant and animal in the meadow', label: 'Every plant and animal in the meadow', nope: 'All the different species living together is a community. A population is just ONE species.' },
        { value: 'The orchids plus the soil, water and light', label: 'The orchids plus the soil, water and light', nope: 'Living things plus their non-living surroundings make an ecosystem. A population is all of one species in a habitat.' },
        { value: 'Just the orchids inside your quadrats', label: 'Just the orchids inside your quadrats', nope: 'That’s your sample. The population is all of that species in the whole habitat.' },
      ], { count: 4 }),
      why: `A population is all the organisms of one species living in a habitat. All the populations together make a community.`,
    },
    chain: [
      { line: `\\text{total} = [[s:${counts.join(' + ')}]]` },
      { line: `\\text{mean} = [[t:${sum}]] \\div [[q:5]]`, op: 'Add up', merge: { t: ['s'] }, why: `The five counts add up to ${sum}.` },
      { line: `\\text{mean} = [[m:${M}]]\\text{ per m}^2`, op: 'Divide', merge: { m: ['t', 'q'] }, why: `${sum} ÷ 5 = ${M}. Each quadrat is 1 m².` },
      { line: `\\text{population} = [[m:${M}]] \\times [[a:${A}]]`, op: '× area', why: `The meadow is ${A} m², so ${M} orchids on each square metre.` },
      { line: `\\text{population} = [[p:${tex(pop)}]]`, op: 'Multiply', merge: { p: ['m', 'a'] }, why: `${M} × ${A} = ${n(pop)} bee orchids. Lovely.` },
    ],
  }
}

/** The riverbank's factors: abiotic (non-living) and biotic (living). Short names for the picture. */
export const FACTORS: Record<string, { icon: string; name: string; tile: string; abiotic: boolean }> = {
  light: { icon: '☀️', name: 'Light', tile: '☀️ Light', abiotic: true },
  moisture: { icon: '💧', name: 'Moisture', tile: '💧 Soil moisture', abiotic: true },
  temp: { icon: '🌡️', name: 'Temp', tile: '🌡️ Temperature', abiotic: true },
  ph: { icon: '🧪', name: 'Soil pH', tile: '🧪 Soil pH', abiotic: true },
  wind: { icon: '💨', name: 'Wind', tile: '💨 Wind', abiotic: true },
  rabbits: { icon: '🐇', name: 'Rabbits', tile: '🐇 Rabbits grazing', abiotic: false },
  nettles: { icon: '🌿', name: 'Nettles', tile: '🌿 Nettles competing', abiotic: false },
  disease: { icon: '🦠', name: 'Disease', tile: '🦠 Plant disease', abiotic: false },
  aphids: { icon: '🐛', name: 'Aphids', tile: '🐛 Aphids feeding', abiotic: false },
}
const BIOTIC_WHY: Record<string, string> = {
  rabbits: 'Rabbits are living, so grazing is a biotic factor.',
  nettles: 'Nettles are living plants: competition is a biotic factor.',
  disease: 'A disease is caused by a living pathogen: biotic.',
  aphids: 'Aphids are living insects: feeding pests are a biotic factor.',
}

/** Round 2: percentage cover from a 25-square quadrat on the transect, then sort the abiotic factors. */
function transectRound(rand: Rand): RwRound {
  const near = rand.int(8, 23), cover = near * 4
  const fix1 = `Each square is 100 ÷ 25 = 4%. ${near} × 4 = ${cover}%.`
  const t1: Task<Scene> = {
    id: 'tran-1', prompt: `Meadowsweet covers ${near} of the 25 squares. Percentage cover?`,
    label: 'Percentage cover', unit: '%', answer: cover, start: 0, min: 0, max: 100, step: 1, jump: 10,
    win: `Percentage cover is how much of the quadrat the plant covers, out of 100. ${fix1}`,
    nope: value => diagnose(cover, value, '%', [
      [near, `That’s the number of squares. Turn it into a percentage: each square is 4%.`],
      [25 - near, `That’s the squares with NO meadowsweet. Count the covered ones and × 4.`],
      [(25 - near) * 4, `That’s the bare part of the quadrat. Meadowsweet covers ${near} squares: × 4.`],
      [near * 2, `Each square is 4%, not 2%: 100 ÷ 25 = 4.`],
    ], fix1),
    scene: { layout: 'transect', level: 1, near },
  }

  const yes = rand.shuffle(['light', 'moisture', 'temp', 'ph', 'wind']).slice(0, 2)
  const no = rand.shuffle(['rabbits', 'nettles', 'disease', 'aphids']).slice(0, 3)
  const palette = rand.shuffle([...yes, ...no]).map(value => ({ value, label: FACTORS[value].tile }))
  const both = `${words(palette, yes[0])} and ${words(palette, yes[1]).toLowerCase()}`
  const t2: TileTask<Scene> = {
    kind: 'tiles', id: 'tran-2', prompt: 'Tap the TWO abiotic factors acting on the meadowsweet.',
    label: 'Abiotic factors', slots: ['abiotic factor 1', 'abiotic factor 2'], palette, answer: yes, anyOrder: true,
    win: `Abiotic means non-living. ${both} aren’t alive; the rest are living things, so they’re biotic.`,
    nope: picked => {
      const living = picked.find(tile => !FACTORS[tile].abiotic)
      if (living) return `${BIOTIC_WHY[living]} Abiotic means non-living: find the two that aren’t alive.`
      return `You picked ${words(palette, picked[0])} twice. The other non-living factor is ${words(palette, yes.find(y => y !== picked[0])!).toLowerCase()}.`
    },
    scene: { layout: 'factors', level: 1 },
  }

  const right = 'To see how plants change with distance'
  return {
    id: 'tran', title: 'Round 2 · The riverbank', headline: 'Run a transect',
    why: `A transect is a line, like a tape measure, laid out from the river. You place quadrats along it to see how plants change with distance. Percentage cover is how much of a quadrat a plant covers. With 25 squares, each square is 4%. Then ask why it changes: abiotic factors are non-living, biotic factors are living.`,
    tasks: [t1, t2],
    workingOn: 0,
    side: {
      prompt: 'Why lay a transect here, not random quadrats?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'Transects mean you count fewer plants', label: 'Transects mean you count fewer plants', nope: 'You still count every quadrat. A transect shows a CHANGE along a line, like away from the river.' },
        { value: 'Random quadrats don’t work near water', label: 'Random quadrats don’t work near water', nope: 'They work anywhere. But random quadrats give an average; a transect shows how things change with distance.' },
        { value: 'To find the total number of plants', label: 'To find the total number of plants', nope: 'Random quadrats estimate a population. A transect shows how a plant’s distribution changes along a line.' },
      ], { count: 4 }),
      why: `A transect shows how the distribution of a species changes along a line, like moving away from the wet riverbank.`,
    },
    chain: [
      { line: `\\text{each square} = [[h:100]] \\div [[s:25]] = [[f:4]]\\%` },
      { line: `\\text{cover} = [[k:${near}]] \\times [[f:4]]`, op: 'Squares × 4', why: `Meadowsweet covers ${near} of the 25 squares.` },
      { line: `\\text{cover} = [[c:${cover}]]\\%`, op: 'Multiply', merge: { c: ['k', 'f'] }, why: `${near} × 4 = ${cover}%. Wet soil near the river suits it.` },
    ],
  }
}

/** The food-chain tiles: the chain, and decoys that aren't consumers in it. */
const CHAIN: Tile[] = [
  { value: 'grass', label: '🌾 Grass' }, { value: 'vole', label: '🐭 Field vole' }, { value: 'owl', label: '🦉 Barn owl' },
  { value: 'sun', label: '☀️ Sun' }, { value: 'mushroom', label: '🍄 Mushroom' },
]
const CHAIN_ROLE = ['producer', 'primary consumer', 'secondary consumer']

/** Round 3: build the food chain, then the vole–owl predator–prey numbers. */
function cycleRound(rand: Rand): RwRound {
  const palette = rand.shuffle(CHAIN)
  const answer = ['grass', 'vole', 'owl']
  const t1: TileTask<Scene> = {
    kind: 'tiles', id: 'cyc-1', prompt: 'Build the food chain: producer → primary → secondary consumer.',
    label: 'Food chain', slots: CHAIN_ROLE, palette, answer,
    win: `Grass makes food by photosynthesis (producer). Voles eat grass (primary consumer). Owls eat voles (secondary consumer). The arrows show the energy moving.`,
    nope: picked => {
      const i = picked.findIndex((tile, index) => tile !== answer[index])
      const tile = picked[i]
      const should = `The ${CHAIN_ROLE[i]} here is the ${words(CHAIN, answer[i]).toLowerCase()}.`
      if (tile === 'sun') return `The Sun gives the energy, but it isn’t a living thing in the chain. ${should}`
      if (tile === 'mushroom') return `Mushrooms are decomposers: they break down dead things. ${should}`
      if (i === 0) return `The producer makes its own food by photosynthesis. That’s the grass, not the ${words(CHAIN, tile).toLowerCase()}.`
      return i === 1
        ? `The primary consumer eats the producer. Voles eat grass, so the vole goes second.`
        : `The secondary consumer eats the primary consumer. Barn owls eat voles, so the owl goes last.`
    },
    scene: { layout: 'chain', level: 2 },
  }

  const owls = rand.int(4, 12), per = rand.pick([10, 15, 20, 25]), peak = owls * per
  const low = Math.max(10, Math.round(peak * .4 / 10) * 10)
  const fix2 = `${peak} voles ÷ ${owls} owls = ${per} voles per owl.`
  const t2: Task<Scene> = {
    id: 'cyc-2', prompt: `Peak: ${peak} voles and ${owls} barn owls. Voles per owl?`,
    label: 'Voles per owl', unit: 'voles', answer: per, start: 0, min: 0, max: 100, step: 1, jump: 5,
    win: `Prey easily outnumber their predators. ${fix2}`,
    nope: value => diagnose(per, value, 'voles', [
      [peak - owls, `You took away. Share the voles out: ${peak} ÷ ${owls}.`],
      [owls, `That’s the number of owls. Divide the voles by it.`],
      [low % owls === 0 ? low / owls : NaN, `You used the low point. Use the peak, ${peak}.`],
    ], fix2),
    scene: { layout: 'graph', level: 2, graph: { low, peak, owls } },
  }

  const right = 'More food lets more owls survive and breed, which takes time'
  return {
    id: 'cyc', title: 'Round 3 · Who eats who', headline: 'Predators and prey',
    why: `Every food chain starts with a producer, a plant or alga that makes food by photosynthesis. Primary consumers eat producers; secondary consumers eat them. When prey numbers rise, predators have more food and their numbers rise too. Then the predators eat so much prey that prey numbers fall, and so do the predators. The two go up and down in cycles.`,
    tasks: [t1, t2],
    side: {
      prompt: 'The owl peak comes AFTER the vole peak. Why?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'Owls only hunt in the winter', label: 'Owls only hunt in the winter', nope: 'Barn owls hunt all year. The lag is because owls need time to breed once food is plentiful.' },
        { value: 'The owls are the producers in the chain', label: 'The owls are the producers in the chain', nope: 'The grass is the producer, it makes food by photosynthesis. Owls are secondary consumers.' },
        { value: 'Voles eat owl eggs, so owls wait', label: 'Voles eat owl eggs, so owls wait', nope: 'Rowan nearly fell in the river laughing. Voles eat grass. The owls lag because breeding takes time.' },
      ], { count: 4 }),
      why: `More voles means more food for owls, so more owls survive and raise chicks. That takes time, so the owl peak lags behind the vole peak.`,
    },
    chain: [
      { line: `\\text{voles} = [[v:${peak}]],\\ \\text{owls} = [[o:${owls}]]` },
      { line: `\\text{per owl} = [[v:${peak}]] \\div [[o:${owls}]]`, op: 'Share out', why: `At the peak, ${peak} voles share the valley with ${owls} owls.` },
      { line: `\\text{per owl} = [[e:${per}]]\\text{ voles}`, op: 'Divide', merge: { e: ['v', 'o'] }, why: `${peak} ÷ ${owls} = ${per}. Prey outnumber predators.` },
    ],
  }
}

/** Where each beaver-dam effect happens, and its opposite as a decoy. */
const DAM_SLOTS = ['upstream of the dam', 'downstream in a storm', 'wildlife in the valley']
const DAM: Tile[] = [
  { value: 'pond', label: 'Pond forms' }, { value: 'less', label: 'Less flooding' }, { value: 'more', label: 'More species' },
  { value: 'dry', label: 'River dries up' }, { value: 'worse', label: 'Worse flooding' }, { value: 'fewer', label: 'Fewer species' },
]
const DAM_WHY = [
  'Upstream, the dam holds water back, so a pond and marsh form.',
  'Downstream in a storm, the dam and its ponds slow the water, so there’s LESS flooding.',
  'New ponds and marsh are new habitats, so MORE species move in: biodiversity rises.',
]

/** Round 4: wetland lost to drainage as a percentage, then place the beaver dam's effects. */
function wetlandRound(rand: Rand): RwRound {
  const pairs: [number, number][] = []
  for (const W of [100, 200, 400, 500, 800]) for (const p of [25, 40, 50, 60, 75, 80]) if (Number.isInteger(W * p / 100)) pairs.push([W, p])
  const [W, p] = rand.pick(pairs), lost = W * p / 100, left = W - lost
  const fix1 = `Lost = ${W} − ${left} = ${lost} ha. ${lost} ÷ ${W} × 100 = ${p}%.`
  const t1: Task<Scene> = {
    id: 'wet-1', prompt: `${W} ha of wetland in 1900, ${left} ha now. What % was lost?`,
    label: 'Wetland lost', unit: '%', answer: p, start: 0, min: 0, max: 100, step: 5, jump: 10,
    win: `Draining wetland for farmland destroys habitats, so biodiversity falls. ${fix1}`,
    nope: value => diagnose(p, value, '%', [
      [100 - p, `That’s the percentage LEFT. Find the part that was lost.`],
      [lost, `That’s the hectares lost. Turn it into a percentage of ${W}.`],
      [left, `That’s the hectares left. Find the lost part, ${W} − ${left}, as a % of ${W}.`],
    ], fix1),
    scene: { layout: 'wetland', level: 3 },
  }

  const palette = rand.shuffle(DAM)
  const answer = ['pond', 'less', 'more']
  const t2: TileTask<Scene> = {
    kind: 'tiles', id: 'wet-2', prompt: 'The beavers are back! Place each dam effect where it happens.',
    label: 'Beaver dam effects', slots: DAM_SLOTS, palette, answer,
    win: `Beavers are ecosystem engineers. Their dams make ponds upstream, ease floods downstream and create new habitats, so biodiversity rises.`,
    nope: picked => {
      const i = picked.findIndex((tile, index) => tile !== answer[index])
      const wrong = picked.filter((tile, index) => tile !== answer[index]).length
      const more = wrong > 1 ? ` ${wrong} effects need moving.` : ''
      return `${DAM_WHY[i]} Not “${label(DAM, picked[i])}”.${more}`
    },
    scene: { layout: 'dam', level: 3 },
  }

  const right = 'They store carbon; draining or burning them releases CO₂'
  return {
    id: 'wet', title: 'Round 4 · Bring back the bog', headline: 'Biodiversity',
    why: `Biodiversity is the variety of all the different species in an area. Humans reduce it by draining wetlands, cutting down forests and digging up peat bogs for compost. Peat bogs store huge amounts of carbon. Rewilding, hedgerows, field margins and breeding programmes bring biodiversity back.`,
    tasks: [t1, t2],
    workingOn: 0,
    side: {
      prompt: 'Why protect the peat bog, not dig it up for compost?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'Peat is too wet to burn, so it’s useless', label: 'Peat is too wet to burn, so it’s useless', nope: 'Dried peat burns fine, and that’s the problem: burning or decaying peat releases the stored carbon as CO₂.' },
        { value: 'Bogs have no wildlife, so they’re safe to keep', label: 'Bogs have no wildlife, so they’re safe to keep', nope: 'Bogs are full of rare species, like sundews and dragonflies. And they lock up carbon.' },
        { value: 'Peat compost makes plants grow too fast', label: 'Peat compost makes plants grow too fast', nope: 'Gardeners like peat because it helps plants grow. The reason to protect bogs is the carbon they store.' },
      ], { count: 4 }),
      why: `Peat bogs lock up carbon. When peat is dug up and burned or left to decay, it releases carbon dioxide, which adds to global warming. Protecting bogs also protects the species that live there.`,
    },
    chain: [
      { line: `\\text{lost} = [[w:${W}]] - [[n:${left}]]` },
      { line: `\\text{lost} = [[l:${lost}]]\\text{ ha}`, op: 'Subtract', merge: { l: ['w', 'n'] }, why: `${W} − ${left} = ${lost} hectares drained.` },
      { line: `\\% = \\frac{[[l:${lost}]]}{[[t:${W}]]} \\times 100`, op: 'Out of 100', why: `A percentage is the part over the whole, times 100.` },
      { line: `\\% = [[p:${p}]]\\%`, op: 'Work it out', merge: { p: ['l', 't'] }, why: `${lost} ÷ ${W} × 100 = ${p}% of the wetland gone. Time for beavers.` },
    ],
  }
}

/** The random-quadrat method, in order, plus two classic mistakes. */
export const METHOD: Tile[] = [
  { value: 'grid', label: '📏 Grid the field' }, { value: 'random', label: '🎲 Random coords' }, { value: 'place', label: '🔲 Place quadrats' },
  { value: 'count', label: '🔢 Count inside' }, { value: 'mean', label: '➗ Find the mean' },
  { value: 'flowery', label: '🌼 Pick flowery spots' }, { value: 'every', label: '👀 Count every plant' },
]
const METHOD_WHY: Record<string, string> = {
  grid: 'First mark out the field with tapes as a grid, so every spot has coordinates.',
  random: 'Then pick random coordinates, for example with a random number generator.',
  place: 'Then put a 1 m² quadrat down at each random coordinate.',
  count: 'Then count the plants inside each quadrat.',
  mean: 'Last, find the mean: total ÷ number of quadrats.',
}

/** Round 5 (boss): the field investigation required practical. Order the method, then mean × field area. */
function fieldRound(rand: Rand): RwRound {
  const answer = ['grid', 'random', 'place', 'count', 'mean']
  const palette = rand.shuffle(METHOD)
  const L = rand.pick([20, 25, 30, 40, 50]), Wd = rand.pick([10, 20, 30, 40]), A = L * Wd
  const m = rand.int(2, 9), T = m * 10, pop = m * A
  const counts = countsFor(rand, m, 10)
  const t1: TileTask<Scene> = {
    kind: 'tiles', id: 'field-1', prompt: 'Put the random quadrat method in order.',
    label: 'Field practical method', slots: ['step 1', 'step 2', 'step 3', 'step 4', 'step 5'], palette, answer,
    win: `Grid, random coordinates, quadrats down, count, mean. Random placing means nobody chooses the spots, so the sample isn’t biased.`,
    nope: picked => {
      const i = picked.findIndex((tile, index) => tile !== answer[index])
      const tile = picked[i]
      if (tile === 'flowery') return `Picking flowery spots is biased: it would overestimate the population. Step ${i + 1}: ${METHOD_WHY[answer[i]]}`
      if (tile === 'every') return `The whole point of sampling is that you DON’T count every plant. Step ${i + 1}: ${METHOD_WHY[answer[i]]}`
      return `Step ${i + 1} isn’t “${words(METHOD, tile)}”. ${METHOD_WHY[answer[i]]}`
    },
    scene: { layout: 'method', level: 4, counts },
  }

  const fix2 = `Mean = ${T} ÷ 10 = ${m} per m². Area = ${L} × ${Wd} = ${n(A)} m². ${m} × ${n(A)} = ${n(pop)}.`
  const max = Math.ceil(11 * A * 2 / 1000) * 1000
  const t2: Task<Scene> = {
    id: 'field-2', prompt: `Field ${L} m × ${Wd} m. 10 quadrats, ${T} buttercups. Estimate the population.`,
    label: 'Buttercup estimate', unit: 'buttercups', answer: pop, start: 0, min: 0, max, step: 50, jump: 500,
    win: `Mean per quadrat × area of the field. ${fix2}`,
    nope: value => diagnose(pop, value, 'buttercups', [
      [T * A, `You used the total, ${T}. Divide by the 10 quadrats first: ${m} per m².`],
      [m * (L + Wd), `You added the sides. The field’s area is ${L} × ${Wd} = ${n(A)} m².`],
      [m * 2 * (L + Wd), `That’s the perimeter, the distance round. You need the area: ${L} × ${Wd}.`],
      [A, `That’s just the area. Multiply by the mean, ${m} per m².`],
      [T * L, `Mixed up. Mean = ${T} ÷ 10 = ${m}, area = ${L} × ${Wd} = ${n(A)} m².`],
    ], fix2),
    scene: { layout: 'meadow', level: 4, field: { flower: 'buttercup', area: `${L} m × ${Wd} m field`, mean: m } },
  }

  const right = 'So the sample is fair and not biased'
  return {
    id: 'field', title: 'Round 5 · The required practical', headline: 'Field investigation',
    why: `Mark out the field and pick random coordinates, for example with a random number generator. Put a 1 m² quadrat at each one and count the plants inside. Mean = total ÷ number of quadrats. Estimated population = mean per m² × area of the field. More quadrats give a more reliable estimate.`,
    tasks: [t1, t2],
    side: {
      prompt: 'Why must the quadrats go down at RANDOM places?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'So you can pick the patches with the most flowers', label: 'So you can pick the patches with the most flowers', nope: 'That’s exactly the bias random placing stops. Choosing flowery patches would overestimate the population.' },
        { value: 'So you don’t have to count every quadrat', label: 'So you don’t have to count every quadrat', nope: 'You still count every quadrat you place. Random placing makes the sample representative.' },
        { value: 'So the buttercups don’t get trampled', label: 'So the buttercups don’t get trampled', nope: 'Nice thought, but random placing is about a fair sample. Nobody gets to choose the good spots.' },
      ], { count: 4 }),
      why: `Random placing means you don’t choose where the quadrats go, so the sample isn’t biased and represents the whole field.`,
    },
    chain: [
      { line: `\\text{mean} = [[t:${T}]] \\div [[q:10]]` },
      { line: `\\text{mean} = [[m:${m}]]\\text{ per m}^2`, op: 'Divide', merge: { m: ['t', 'q'] }, why: `${T} buttercups in 10 quadrats: ${m} per quadrat, and each is 1 m².` },
      { line: `\\text{area} = [[l:${L}]] \\times [[w:${Wd}]]`, op: 'Field area', why: `The field is ${L} m by ${Wd} m.` },
      { line: `\\text{area} = [[a:${tex(A)}]]\\text{ m}^2`, op: 'Multiply', merge: { a: ['l', 'w'] }, why: `${L} × ${Wd} = ${n(A)} m².` },
      { line: `\\text{population} = [[m:${m}]] \\times [[a:${tex(A)}]]`, op: 'Mean × area', why: `${m} buttercups on each of ${n(A)} square metres.` },
      { line: `\\text{population} = [[p:${tex(pop)}]]`, op: 'Multiply', merge: { p: ['m', 'a'] }, why: `${m} × ${n(A)} = ${n(pop)} buttercups. Chief Ecologist material.` },
    ],
  }
}

export function makeRounds(rand: Rand): RwRound[] {
  return [quadratRound(rand), transectRound(rand), cycleRound(rand), wetlandRound(rand), fieldRound(rand)]
}
