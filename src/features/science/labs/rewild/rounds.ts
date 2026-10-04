import { options, type Rand } from '../../../maths/labs/kit/random'
import { diagnose, n, tex, type Round, type Task } from '../kit/types'

/*
 * Rewild: bring a British river valley back to life with Ranger Rowan of the local Wildlife Trust
 * (AQA Trilogy 4.7 Ecology, Foundation): quadrats and population estimates, percentage cover along a
 * transect, food chains and predator–prey cycles, biodiversity and land use (peat, wetlands), and the
 * field investigation required practical. Pyramids of biomass and trophic efficiency are Biology-only,
 * so they stay out. Every answer is picked first, then the survey is built around it.
 */

/** What the stage draws under the valley: a meadow with quadrats, a transect grid, a population graph, or a wetland map. */
export type Scene = {
  layout: 'meadow' | 'transect' | 'graph' | 'wetland'
  /** The given values, in the readout beside the picture. */
  given: [string, string][]
  /** The little food chain or key under the readout. */
  tag?: string
  /** Meadow: which flower. */
  flower?: string
  /** Transect: the dial is the cover itself ('cover'), or how much it drops from `from` squares ('drop'). */
  grid?: { mode: 'cover' | 'drop'; from: number }
  /** Graph: the level drawn is base + value × per, against the vole peak. */
  graph?: { low: number; peak: number; base: number; per: number; owls: number }
  /** Wetland: 20 cells of 5% each; how many were lost, and whether the dial drains or restores them. */
  wet?: { mode: 'lose' | 'restore'; lost: number }
}
export type RwTask = Task<Scene>
export type RwRound = Round<Scene>

/** Five friendly counts with a whole-number mean, not all the same. */
function countsFor(rand: Rand, mean: number, k: number) {
  for (let tries = 0; tries < 50; tries++) {
    const offsets = Array.from({ length: k - 1 }, () => rand.int(-3, 3))
    const last = -offsets.reduce((a, b) => a + b, 0)
    const all = [...offsets, last]
    if (Math.abs(last) <= 4 && all.every(d => mean + d >= 0) && all.some(d => d !== 0)) return all.map(d => mean + d)
  }
  return Array.from({ length: k }, (_, i) => mean + (i === 0 ? 1 : i === 1 ? -1 : 0))
}

/** Round 1: the mean number per quadrat, then mean × area for the whole meadow. */
function quadratRound(rand: Rand): RwRound {
  const M = rand.int(4, 12), counts = countsFor(rand, M, 5), sum = M * 5
  const most = Math.max(...counts), least = Math.min(...counts)
  const fix1 = `Add them up and share: ${sum} ÷ 5 = ${M} orchids per quadrat.`
  const t1: RwTask = {
    id: 'quad-1', prompt: `Five 1 m² quadrats in the new meadow. You count ${counts.join(', ')} bee orchids. What’s the mean number per quadrat?`,
    label: 'Mean per quadrat', unit: 'orchids', answer: M, start: 0, min: 0, max: 30, step: 1, jump: 5,
    win: `The mean evens out lucky and unlucky quadrats. ${fix1}`,
    nope: value => diagnose(M, value, 'orchids', [
      [sum, `That’s the total of all five quadrats. Divide it by 5 for the mean.`],
      [most, `That’s just the biggest count. Use all five: add them, then divide by 5.`],
      [least, `That’s just the smallest count. Use all five: add them, then divide by 5.`],
      [most - least, `That’s the range (biggest − smallest), not the mean.`],
      [sum % 4 === 0 ? sum / 4 : NaN, `You divided by 4. There are 5 quadrats, so divide by 5.`],
    ], fix1),
    scene: { layout: 'meadow', flower: 'orchid', given: [['Counts', counts.join(', ')], ['Quadrats', '5 × 1 m²']] },
  }

  const A = rand.pick([50, 80, 100, 120, 150, 200, 250, 300, 400, 500]), pop = M * A
  const fix2 = `Population = mean per m² × area = ${M} × ${A} = ${n(pop)} orchids.`
  const t2: RwTask = {
    id: 'quad-2', prompt: `Each quadrat is 1 m², so that’s ${M} orchids per m². The whole meadow is ${A} m². Estimate the orchid population.`,
    label: 'Orchid population', unit: 'orchids', answer: pop, start: 0, min: 0, max: Math.max(1000, Math.ceil(pop * 2 / 100) * 100), step: 10, jump: 100,
    win: `Scale up from 1 m² to the whole meadow. ${fix2}`,
    nope: value => diagnose(pop, value, 'orchids', [
      [sum * A, `You used the total of all five quadrats (${sum}). Use the mean, ${M} per m².`],
      [M + A, `You added. Multiply: ${M} orchids on every one of the ${A} m².`],
      [A, `That’s the area. Multiply it by ${M} orchids per m².`],
      [A * 5, `You multiplied by the number of quadrats. Multiply the area by the mean, ${M}.`],
    ], fix2),
    scene: { layout: 'meadow', flower: 'orchid', given: [['Mean', `${M} per m²`], ['Meadow', `${A} m²`]] },
  }

  const right = 'All the bee orchids living in the meadow'
  return {
    id: 'quad', title: 'Round 1 · The meadow', headline: 'Count the orchids',
    why: `You can’t count every plant in a meadow, so you sample with quadrats. A quadrat is a square frame, here 1 m². Count inside a few quadrats and find the mean. Mean = total ÷ number of quadrats. Then population = mean per m² × area.`,
    tasks: [t1, t2],
    side: {
      prompt: 'Rowan says you just estimated a POPULATION. What is a population?', answer: right,
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

/** Round 2: percentage cover from a 25-square quadrat along a transect from the river, then the drop. */
function transectRound(rand: Rand): RwRound {
  const near = rand.int(14, 23), far = rand.int(2, near - 6), cover = near * 4, drop = (near - far) * 4
  const fix1 = `Each square is 100 ÷ 25 = 4%. ${near} × 4 = ${cover}%.`
  const t1: RwTask = {
    id: 'tran-1', prompt: `Transect from the riverbank. In the quadrat 2 m from the water, meadowsweet covers ${near} of the 25 squares. What’s its percentage cover?`,
    label: 'Percentage cover', unit: '%', answer: cover, start: 0, min: 0, max: 100, step: 1, jump: 10,
    win: `Percentage cover is how much of the quadrat the plant covers, out of 100. ${fix1}`,
    nope: value => diagnose(cover, value, '%', [
      [near, `That’s the number of squares. Turn it into a percentage: each square is 4%.`],
      [25 - near, `That’s the squares with NO meadowsweet. Count the covered ones and × 4.`],
      [(25 - near) * 4, `That’s the bare part of the quadrat. Meadowsweet covers ${near} squares: × 4.`],
      [near * 2, `Each square is 4%, not 2%: 100 ÷ 25 = 4.`],
    ], fix1),
    scene: { layout: 'transect', grid: { mode: 'cover', from: 0 }, given: [['Covered', `${near} of 25`], ['Distance', '2 m']] },
  }

  const fix2 = `${far} × 4 = ${far * 4}%, so the drop is ${cover}% − ${far * 4}% = ${drop}%.`
  const t2: RwTask = {
    id: 'tran-2', prompt: `At 10 m from the river, meadowsweet covers just ${far} of the 25 squares. By how many percentage points did the cover drop?`,
    label: 'Drop in cover', unit: '%', answer: drop, start: 0, min: 0, max: 100, step: 1, jump: 10,
    win: `Meadowsweet loves wet soil, so it thins out away from the river. ${fix2}`,
    nope: value => diagnose(drop, value, '%', [
      [near - far, `That’s the drop in squares. Each square is 4%: × 4.`],
      [far * 4, `That’s the cover at 10 m. Take it away from ${cover}%.`],
      [cover, `That’s the cover at 2 m. Take away the cover at 10 m.`],
      [far, `That’s the squares at 10 m. Find both percentages and subtract.`],
    ], fix2),
    scene: { layout: 'transect', grid: { mode: 'drop', from: near }, given: [['At 2 m', `${cover}%`], ['At 10 m', `${far} of 25`]] },
  }

  const right = 'Soil moisture'
  return {
    id: 'tran', title: 'Round 2 · The riverbank', headline: 'Run a transect',
    why: `A transect is a line, like a tape measure, laid out from the river. You place quadrats along it to see how plants change with distance. Percentage cover is how much of a quadrat a plant covers. With 25 squares, each square is 4%.`,
    tasks: [t1, t2],
    side: {
      prompt: 'Which ABIOTIC factor most likely makes meadowsweet thin out away from the river?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'Rabbits grazing', label: 'Rabbits grazing', nope: 'Rabbits are living, so grazing is a biotic factor. Abiotic means non-living, like moisture, light or temperature.' },
        { value: 'Competition from nettles', label: 'Competition from nettles', nope: 'Nettles are living, so that’s a biotic factor. The abiotic one here is how wet the soil is.' },
        { value: 'A new plant disease', label: 'A new plant disease', nope: 'Pathogens are living: a biotic factor. Think non-living: the soil dries out away from the water.' },
      ], { count: 4 }),
      why: `Abiotic factors are non-living: light, temperature, moisture, soil pH and minerals, wind, CO₂ and O₂. Soil gets drier away from the river, and meadowsweet likes it wet.`,
    },
    chain: [
      { line: `\\text{each square} = [[h:100]] \\div [[s:25]] = [[f:4]]\\%` },
      { line: `\\text{cover at 2 m} = [[k:${near}]] \\times [[f:4]]`, op: 'Squares × 4', why: `Meadowsweet covers ${near} squares at 2 m.` },
      { line: `\\text{cover at 2 m} = [[c:${cover}]]\\%`, op: 'Multiply', merge: { c: ['k', 'f'] }, why: `${near} × 4 = ${cover}%.` },
      { line: `\\text{drop} = [[c:${cover}]]\\% - [[g:${far * 4}]]\\%`, op: 'Take away', why: `At 10 m it covers ${far} squares: ${far} × 4 = ${far * 4}%.` },
      { line: `\\text{drop} = [[d:${drop}]]\\%`, op: 'Subtract', merge: { d: ['c', 'g'] }, why: `${cover} − ${far * 4} = ${drop} percentage points. Drier soil, less meadowsweet.` },
    ],
    workingOn: 1,
  }
}

/** Round 3: a food chain and the vole–owl predator–prey cycle. */
function cycleRound(rand: Rand): RwRound {
  const owls = rand.int(4, 12), per = rand.pick([10, 15, 20, 25])
  const peak = owls * per
  const rise = rand.pick([20, 30, 40, 50, 60, 70, 80].filter(r => r < peak - 10)), low = peak - rise
  const fix1 = `Rise = peak − low = ${peak} − ${low} = ${rise} voles.`
  const t1: RwTask = {
    id: 'cyc-1', prompt: `Food chain: grass → field vole → barn owl. After a mild spring the voles go from ${low} to a peak of ${peak}. How many more voles is that?`,
    label: 'Rise in voles', unit: 'voles', answer: rise, start: 0, min: 0, max: 400, step: 1, jump: 10,
    win: `Lots of grass means lots of food, so the voles boom. ${fix1}`,
    nope: value => diagnose(rise, value, 'voles', [
      [peak, `That’s the peak. Take away where they started, ${low}.`],
      [low, `That’s where they started. Find the change: ${peak} − ${low}.`],
      [peak + low, `You added. A rise is the difference: subtract.`],
    ], fix1),
    scene: { layout: 'graph', tag: '🌾 → 🐭 → 🦉', graph: { low, peak, base: low, per: 1, owls }, given: [['Start', `${low} voles`], ['Peak', `${peak} voles`]] },
  }

  const fix2 = `${peak} voles ÷ ${owls} owls = ${per} voles per owl.`
  const t2: RwTask = {
    id: 'cyc-2', prompt: `At the vole peak there are ${owls} barn owls hunting the valley. How many voles is that per owl?`,
    label: 'Voles per owl', unit: 'voles', answer: per, start: 0, min: 0, max: 100, step: 1, jump: 5,
    win: `Prey easily outnumber their predators. ${fix2}`,
    nope: value => diagnose(per, value, 'voles', [
      [peak - owls, `You took away. Share the voles out: ${peak} ÷ ${owls}.`],
      [owls, `That’s the number of owls. Divide the voles by it.`],
      [rise % owls === 0 ? rise / owls : NaN, `You shared out the rise. Share out all ${peak} voles at the peak.`],
      [low % owls === 0 ? low / owls : NaN, `You used the starting number. Use the peak, ${peak}.`],
    ], fix2),
    scene: { layout: 'graph', tag: '🌾 → 🐭 → 🦉', graph: { low, peak, base: 0, per: owls, owls }, given: [['Voles', `${peak}`], ['Owls', `${owls}`]] },
  }

  const right = 'More food lets more owls survive and breed, which takes time'
  return {
    id: 'cyc', title: 'Round 3 · Who eats who', headline: 'Predators and prey',
    why: `Every food chain starts with a producer, a plant or alga that makes food by photosynthesis. Primary consumers eat producers; secondary consumers eat them. When prey numbers rise, predators have more food and their numbers rise too. Then the predators eat so much prey that prey numbers fall, and so do the predators. The two go up and down in cycles.`,
    tasks: [t1, t2],
    workingOn: 0,
    side: {
      prompt: 'On the graph the owl peak comes AFTER the vole peak. Why?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'Owls only hunt in the winter', label: 'Owls only hunt in the winter', nope: 'Barn owls hunt all year. The lag is because owls need time to breed once food is plentiful.' },
        { value: 'The owls are the producers in the chain', label: 'The owls are the producers in the chain', nope: 'The grass is the producer, it makes food by photosynthesis. Owls are secondary consumers.' },
        { value: 'Voles eat owl eggs, so owls wait', label: 'Voles eat owl eggs, so owls wait', nope: 'Rowan nearly fell in the river laughing. Voles eat grass. The owls lag because breeding takes time.' },
      ], { count: 4 }),
      why: `More voles means more food for owls, so more owls survive and raise chicks. That takes time, so the owl peak lags behind the vole peak.`,
    },
    chain: [
      { line: `\\text{rise} = [[p:${peak}]] - [[l:${low}]]` },
      { line: `\\text{rise} = [[r:${rise}]]\\text{ voles}`, op: 'Subtract', merge: { r: ['p', 'l'] }, why: `${peak} − ${low} = ${rise} more voles for the owls.` },
      { line: `\\text{per owl} = [[v:${peak}]] \\div [[o:${owls}]]`, op: 'Share out', why: `At the peak, ${peak} voles share the valley with ${owls} owls.` },
      { line: `\\text{per owl} = [[e:${per}]]\\text{ voles}`, op: 'Divide', merge: { e: ['v', 'o'] }, why: `${peak} ÷ ${owls} = ${per}. Prey outnumber predators.` },
    ],
  }
}

/** Round 4: wetland lost to drainage as a percentage, then how long beaver dams take to win it back. */
function wetlandRound(rand: Rand): RwRound {
  const pairs: [number, number, number][] = []
  for (const W of [100, 200, 400, 500, 800]) for (const p of [25, 40, 50, 60, 75, 80]) {
    const lost = W * p / 100
    if (Number.isInteger(lost)) for (const r of [2, 4, 5, 8, 10, 20]) if (lost % r === 0 && lost / r >= 4 && lost / r <= 25) pairs.push([W, p, r])
  }
  const [W, p, r] = rand.pick(pairs), lost = W * p / 100, left = W - lost, years = lost / r
  const fix1 = `Lost = ${W} − ${left} = ${lost} ha. ${lost} ÷ ${W} × 100 = ${p}%.`
  const t1: RwTask = {
    id: 'wet-1', prompt: `In 1900 the valley had ${W} hectares of wetland. Draining it for farmland left only ${left} hectares. What percentage was lost?`,
    label: 'Wetland lost', unit: '%', answer: p, start: 0, min: 0, max: 100, step: 5, jump: 10,
    win: `Draining wetland destroys habitats, so biodiversity falls. ${fix1}`,
    nope: value => diagnose(p, value, '%', [
      [100 - p, `That’s the percentage LEFT. Find the part that was lost.`],
      [lost, `That’s the hectares lost. Turn it into a percentage of ${W}.`],
      [left, `That’s the hectares left. Find the lost part, ${W} − ${left}, as a % of ${W}.`],
    ], fix1),
    scene: { layout: 'wetland', wet: { mode: 'lose', lost: p / 5 }, given: [['In 1900', `${W} ha`], ['Now', `${left} ha`]] },
  }

  const fix2 = `${lost} ha ÷ ${r} ha a year = ${years} years.`
  const t2: RwTask = {
    id: 'wet-2', prompt: `The beavers are back! Their dams re-flood about ${r} hectares a year. How many years to win back all ${lost} lost hectares?`,
    label: 'Years to restore', unit: 'years', answer: years, start: 0, min: 0, max: 60, step: 1, jump: 5,
    win: `Beaver dams slow the river and make ponds and marsh: free ecosystem engineers. ${fix2}`,
    nope: value => diagnose(years, value, 'years', [
      [W % r === 0 ? W / r : NaN, `You used all ${W} ha. Only ${lost} ha was lost.`],
      [left % r === 0 ? left / r : NaN, `You used the wetland that’s left. Use the ${lost} ha that was lost.`],
      [lost - r, `You took away. Share the ${lost} ha into years of ${r}: divide.`],
      [r, `That’s the hectares per year. Divide ${lost} by it.`],
    ], fix2),
    scene: { layout: 'wetland', wet: { mode: 'restore', lost: p / 5 }, given: [['Lost', `${lost} ha`], ['Dams add', `${r} ha a year`]] },
  }

  const right = 'They store carbon; draining or burning them releases CO₂'
  return {
    id: 'wet', title: 'Round 4 · Bring back the bog', headline: 'Biodiversity',
    why: `Biodiversity is the variety of all the different species in an area. Humans reduce it by draining wetlands, cutting down forests and digging up peat bogs for compost. Peat bogs store huge amounts of carbon. Rewilding, hedgerows, field margins and breeding programmes bring biodiversity back.`,
    tasks: [t1, t2],
    workingOn: 0,
    side: {
      prompt: 'Upstream there’s a peat bog. Why should we protect it rather than dig it up for garden compost?', answer: right,
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

/** Round 5 (boss): the field investigation required practical. Random quadrats, mean × field area, then a second estimate. */
function fieldRound(rand: Rand): RwRound {
  const L = rand.pick([20, 25, 30, 40, 50]), Wd = rand.pick([10, 20, 30, 40]), A = L * Wd
  const m = rand.int(2, 9), T = m * 10, pop = m * A
  const fix1 = `Mean = ${T} ÷ 10 = ${m} per m². Area = ${L} × ${Wd} = ${n(A)} m². ${m} × ${n(A)} = ${n(pop)}.`
  const max = Math.ceil(11 * A * 2 / 1000) * 1000
  const t1: RwTask = {
    id: 'field-1', prompt: `The school field is ${L} m by ${Wd} m. You throw down 10 random 1 m² quadrats and count ${T} buttercups in total. Estimate the buttercup population.`,
    label: 'Buttercup estimate', unit: 'buttercups', answer: pop, start: 0, min: 0, max, step: 50, jump: 500,
    win: `Mean per quadrat × area of the field. ${fix1}`,
    nope: value => diagnose(pop, value, 'buttercups', [
      [T * A, `You used the total, ${T}. Divide by the 10 quadrats first: ${m} per m².`],
      [m * (L + Wd), `You added the sides. The field’s area is ${L} × ${Wd} = ${n(A)} m².`],
      [m * 2 * (L + Wd), `That’s the perimeter, the distance round. You need the area: ${L} × ${Wd}.`],
      [A, `That’s just the area. Multiply by the mean, ${m} per m².`],
      [T * L, `Mixed up. Mean = ${T} ÷ 10 = ${m}, area = ${L} × ${Wd} = ${n(A)} m².`],
    ], fix1),
    scene: { layout: 'meadow', flower: 'buttercup', given: [['Field', `${L} m × ${Wd} m`], ['10 quadrats', `${T} in total`]] },
  }

  const m2 = rand.pick([m - 1, m + 1, m + 2].filter(x => x >= 1)), T2 = m2 * 20, pop2 = m2 * A
  const fix2 = `Mean = ${T2} ÷ 20 = ${m2} per m². ${m2} × ${n(A)} = ${n(pop2)}.`
  const t2: RwTask = {
    id: 'field-2', prompt: `Your mate repeats it with 20 random quadrats and counts ${T2} buttercups. What’s her estimate?`,
    label: 'Second estimate', unit: 'buttercups', answer: pop2, start: 0, min: 0, max, step: 50, jump: 500,
    win: `More quadrats gives a more reliable mean. ${fix2}`,
    nope: value => diagnose(pop2, value, 'buttercups', [
      [T2 / 10 * A, `She did 20 quadrats, not 10: ${T2} ÷ 20 = ${m2}.`],
      [T2 * A, `You used the total. Divide by 20 quadrats first: ${m2} per m².`],
      [pop, `That’s YOUR estimate. Use her ${T2} buttercups in 20 quadrats.`],
      [A, `That’s just the area. Multiply by her mean, ${m2} per m².`],
    ], fix2),
    scene: { layout: 'meadow', flower: 'buttercup', given: [['Field', `${n(A)} m²`], ['20 quadrats', `${T2} in total`]] },
  }

  const right = 'So the sample is fair and not biased'
  return {
    id: 'field', title: 'Round 5 · The required practical', headline: 'Field investigation',
    why: `Mark out the field and pick random coordinates, for example with a random number generator. Put a 1 m² quadrat at each one and count the plants inside. Mean = total ÷ number of quadrats. Estimated population = mean per m² × area of the field. More quadrats give a more reliable estimate.`,
    tasks: [t1, t2],
    workingOn: 0,
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
