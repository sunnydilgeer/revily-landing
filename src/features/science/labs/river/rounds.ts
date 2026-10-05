import { options, type Rand } from '../../../maths/labs/kit/random'
import { diagnose, n, tex, type Side, type Task } from '../kit/types'
import type { PlayRound, PlayTask, TileTask } from '../kit/tiles'

/*
 * River Rescue: trace what's poisoning an English river with Inspector Dev Sandhu of the Environment
 * Agency, then make the water safe to drink (AQA Trilogy 8464 Chemistry, Foundation: purity and
 * formulations, chromatography, gas tests, pH, potable water and the water purification practical).
 * Each round mixes a hands-on tile job (sort the samples, match the spots, name the gases, build the
 * treatment works, order the practical) with a dial job where the calculation is the exam skill.
 * Every answer is picked first, so the numbers stay friendly.
 */

export type Dye = 'b' | 'i' | 'as' | 'biro' | 'good'

export type Sample = { value: string; label: string; pure: boolean; look: 'liquid' | 'gas' | 'solid'; tint: string }

export type Scene =
  /** A shelf of samples; the pure ones go in the tray. */
  | { kind: 'shelf'; samples: Sample[] }
  /** A fertiliser scoop as 100 squares, each 1%. */
  | { kind: 'scoop'; total: number; percent: number }
  /** A chromatogram: the river's two spots and four factories' dyes, in cm above the start line. */
  | { kind: 'chroma'; mode: 'match' | 'rf'; front: number; river: { cm: number; dye: Dye }[]; factories: { letter: string; cm: number; dye: Dye }[] }
  /** Repeat pH readings; the dial is their mean. */
  | { kind: 'ph'; readings: number[] }
  /** Four gas jars, each showing its test result. */
  | { kind: 'gas'; tests: GasId[] }
  /** The waterworks: four empty tanks between the river and the tap. */
  | { kind: 'works' }
  /** Filter beds at the treatment works. */
  | { kind: 'beds'; need: number; each: number }
  /** The practical as four comic-strip panels. */
  | { kind: 'practical'; before: number; after: number; sample: number }
  /** Two balances: the empty dish, then the dish after evaporating. */
  | { kind: 'dish'; before: number; after: number; sample: number }

export type RiverTask = PlayTask<Scene>
export type RiverRound = PlayRound<Scene>

const pickSide = (rand: Rand, prompt: string, right: string, wrongs: [string, string][], why: string): Side => ({
  prompt, answer: right,
  choices: options<string>(rand, { value: right, label: right }, wrongs.map(([label, nope]) => ({ value: label, label, nope })), { count: wrongs.length + 1 }),
  why,
})

/* ---------------------------------------------------------------- Round 1: pure substances and formulations */

const PURE: (Sample & { what: string })[] = [
  { value: 'water', label: 'Distilled water', pure: true, look: 'liquid', tint: 'water', what: 'a compound' },
  { value: 'oxygen', label: 'Oxygen', pure: true, look: 'gas', tint: 'clear', what: 'an element' },
  { value: 'copper', label: 'Copper', pure: true, look: 'solid', tint: 'copper', what: 'an element' },
  { value: 'salt', label: 'Sodium chloride', pure: true, look: 'solid', tint: 'white', what: 'a compound' },
  { value: 'co2', label: 'Carbon dioxide', pure: true, look: 'gas', tint: 'clear', what: 'a compound' },
]
const MIXED: (Sample & { nope: string })[] = [
  { value: 'sea', label: 'Sea water', pure: false, look: 'liquid', tint: 'sea', nope: 'Sea water is water with salts dissolved in it: a mixture.' },
  { value: 'air', label: 'Air', pure: false, look: 'gas', tint: 'clear', nope: 'Air is a mixture of gases, mostly nitrogen and oxygen.' },
  { value: 'juice', label: 'Orange juice', pure: false, look: 'liquid', tint: 'juice', nope: '“Pure” orange juice is pure in the shop, not in chemistry: it’s water, sugars and more mixed together.' },
  { value: 'milk', label: 'Milk', pure: false, look: 'liquid', tint: 'white', nope: 'Milk is a mixture of water, fats and proteins.' },
  { value: 'steel', label: 'Steel', pure: false, look: 'solid', tint: 'steel', nope: 'Steel is an alloy: iron mixed with carbon. Alloys are mixtures.' },
  { value: 'cleaner', label: 'Drain cleaner', pure: false, look: 'liquid', tint: 'cleaner', nope: 'Drain cleaner is a formulation: a mixture made to a recipe.' },
  { value: 'river', label: 'River water', pure: false, look: 'liquid', tint: 'river', nope: 'River water has salts and other substances dissolved in it: a mixture.' },
]

function pureRound(rand: Rand): RiverRound {
  const pure = rand.shuffle(PURE).slice(0, 2), mixed = rand.shuffle(MIXED).slice(0, 4)
  const samples = rand.shuffle([...pure, ...mixed])
  const answer = pure.map(s => s.value)
  const nameOf = (value: string) => samples.find(s => s.value === value)?.label ?? value
  const t1: TileTask<Scene> = {
    kind: 'tiles', id: 'pure-1', prompt: 'Two of these are pure substances. Tap them into the tray.',
    label: 'The pure tray', slots: ['first pure sample', 'second pure sample'],
    palette: samples.map(s => ({ value: s.value, label: s.label })), answer, anyOrder: true,
    win: `${pure[0].label} is ${pure[0].what} and ${pure[1].label.toLowerCase()} is ${pure[1].what}: each is ONE substance, so each melts at one sharp temperature.`,
    nope: picked => {
      const bad = picked.map(value => MIXED.find(m => m.value === value)).find(Boolean)
      if (bad) return `${bad.nope} A pure substance is a single element or compound.`
      return `You put ${nameOf(picked[0])} in twice. Find the OTHER single element or compound on the shelf.`
    },
    scene: { kind: 'shelf', samples: samples.map(({ value, label, pure, look, tint }) => ({ value, label, pure, look, tint })) },
  }

  const P2 = rand.pick([10, 20, 25, 30, 40, 50]), T = rand.int(2, 6) * 100, N = P2 * T / 100
  const fix2 = `1% of ${T} g is ${T / 100} g, so ${P2}% is ${T / 100} × ${P2} = ${N} g.`
  const t2: Task<Scene> = {
    id: 'pure-2',
    prompt: `Fertiliser is ${P2}% nitrate. How many grams in a ${T} g scoop?`,
    label: 'Nitrate', unit: 'g', answer: N, start: 0, min: 0, max: 400, step: 5, jump: 50,
    win: `Fertiliser is a formulation, so every scoop has the same share. Too much nitrate makes algae bloom and starves the river of oxygen. ${fix2}`,
    nope: value => diagnose(N, value, 'g', [
      [T - N, `That’s everything EXCEPT the nitrate. Find ${P2}% of ${T} g.`],
      [P2, `That’s the percentage. Find ${P2}% OF ${T} g.`],
      [T / P2, `You divided by ${P2}. Divide by 100 to find 1%, then × ${P2}.`],
      [T, `That’s the whole scoop. Only ${P2}% of it is nitrate.`],
    ], fix2),
    scene: { kind: 'scoop', total: T, percent: P2 },
  }

  return {
    id: 'pure', title: 'Round 1 · Pure or not?', headline: 'Pure substances and formulations',
    why: `In everyday life “pure” means nothing added. In chemistry, a pure substance is a single element or compound, not mixed with anything else. A pure substance melts and boils at one fixed temperature; a mixture melts over a range. A formulation is a mixture made to a recipe, like a cleaner or a fertiliser. Percentage = mass of the part ÷ total mass × 100.`,
    tasks: [t1, t2],
    side: pickSide(rand, 'What is a formulation?', 'A mixture made to an exact recipe', [
      ['A single element or compound', 'That’s a pure substance. A formulation is a mixture made to a recipe, like fertiliser or paint.'],
      ['Any mixture found in nature', 'Sea water is a natural mixture, but nobody designed it. A formulation is mixed to an exact recipe for a job.'],
      ['A substance that melts at one temperature', 'That’s how you spot a pure substance. A formulation is a mixture made to a recipe.'],
    ], `A formulation is a mixture designed as a useful product: each part is added in a measured amount. Fuels, cleaners, paints, medicines and fertilisers are all formulations.`),
    workingOn: 1,
    chain: [
      { line: `1\\% = [[t:${T}]] \\div [[h:100]]` },
      { line: `1\\% = [[o:${T / 100}]]\\,\\text{g}`, op: 'Divide', merge: { o: ['t', 'h'] }, why: `Percent means out of 100, so 1% of ${T} g is ${T / 100} g.` },
      { line: `${P2}\\% = [[o:${T / 100}]] \\times [[p:${P2}]]`, op: `× ${P2}`, why: `${P2}% is ${P2} lots of 1%.` },
      { line: `${P2}\\% = [[s:${N}]]\\,\\text{g}`, op: 'Multiply', merge: { s: ['o', 'p'] }, why: `${T / 100} × ${P2} = ${N} g of nitrate in the scoop.` },
    ],
  }
}

/* ---------------------------------------------------------------- Round 2: chromatography */

const DYES: Dye[] = ['b', 'i', 'as', 'biro', 'good']
/** Whole-cm spot distances whose Rf lands on the 0.05 grid, for each solvent front. */
const spotsFor = (F: number) => Array.from({ length: F - 1 }, (_, i) => i + 1).filter(s => (s * 20) % F === 0)

function chromaRound(rand: Rand): RiverRound {
  const F = rand.pick([4, 5, 8, 10])
  let top = 0, bot = 0
  do { [top, bot] = rand.shuffle(spotsFor(F)).slice(0, 2).sort((a, b) => b - a) } while (top - bot < F * 0.25)
  const [dTop, dBot, dOther] = rand.shuffle(DYES)
  // Decoys: one the same colour as the top dye but a different height (a different Rf), one another colour.
  const free = Array.from({ length: 16 }, (_, i) => 0.15 + i * 0.05).filter(f => Math.abs(f - top / F) >= 0.15 && Math.abs(f - bot / F) >= 0.15)
  let d1 = 0, d2 = 0
  do { [d1, d2] = rand.shuffle(free).slice(0, 2) } while (Math.abs(d1 - d2) < 0.12)
  const roles = rand.shuffle([{ cm: top, dye: dTop, role: 'top' }, { cm: bot, dye: dBot, role: 'bot' }, { cm: Number((d1 * F).toFixed(2)), dye: dTop, role: 'd1' }, { cm: Number((d2 * F).toFixed(2)), dye: dOther, role: 'd2' }])
  const factories = roles.map((r, i) => ({ letter: 'ABCD'[i], cm: r.cm, dye: r.dye }))
  const letterOf = (role: string) => 'ABCD'[roles.findIndex(r => r.role === role)]
  const answer = [letterOf('top'), letterOf('bot')]
  const river = [{ cm: top, dye: dTop }, { cm: bot, dye: dBot }]
  const base = { kind: 'chroma' as const, front: F, river, factories }

  const t1: TileTask<Scene> = {
    kind: 'tiles', id: 'chroma-1', prompt: 'Match each river spot to the factory that made it.',
    label: 'Which factory made each spot', slots: ['top spot', 'bottom spot'],
    palette: factories.map(f => ({ value: f.letter, label: `Factory ${f.letter}` })), answer,
    win: `Factory ${answer[0]} and Factory ${answer[1]} both leak dye: each river spot sits at the same height as their dye, so it has the same Rf. Same Rf, same dye.`,
    nope: picked => {
      const raw = picked.findIndex((letter, k) => letter !== answer[k]), i = raw < 0 ? 0 : raw
      const where = i === 0 ? 'top' : 'bottom'
      const f = factories.find(x => x.letter === picked[i])!
      if (picked[i] === answer[1 - i]) return `Factory ${f.letter} matches the OTHER spot. Follow the ${where} spot straight across: it lines up with Factory ${answer[i]}.`
      const dir = f.cm > river[i].cm ? 'higher' : 'lower'
      if (f.dye === river[i].dye) return `Same colour, but Factory ${f.letter}’s spot ran ${dir}: a different Rf, so a different dye. Follow the ${where} spot across to Factory ${answer[i]}.`
      return `Factory ${f.letter}’s spot sits ${dir} than the river’s ${where} spot, so its Rf is different. Follow the spot across to Factory ${answer[i]}.`
    },
    scene: { ...base, mode: 'match' },
  }

  const r = Number((top / F).toFixed(2))
  const fix2 = `Rf = spot ÷ solvent front = ${top} ÷ ${F} = ${n(r)}.`
  const t2: Task<Scene> = {
    id: 'chroma-2',
    prompt: `Top spot: ${top} cm. Solvent front: ${F} cm. What’s its Rf?`,
    label: 'Rf', unit: '', answer: r, start: 0, min: 0, max: 1, step: 0.05, jump: 0.1,
    win: `Rf compares how far the spot went with how far the solvent went, so it’s always less than 1. ${fix2} Factory ${answer[0]}’s dye gives the same Rf: evidence for the court.`,
    nope: value => diagnose(r, value, '', [
      [Number(((F - top) / F).toFixed(2)), `You measured from the spot up to the solvent front. Measure both distances from the pencil start line.`],
      [Number((bot / F).toFixed(2)), `That’s the BOTTOM spot’s Rf. Use the top spot: ${top} cm.`],
      [Number((top / 10).toFixed(2)), `You divided by 10. Divide by the solvent front, ${F} cm.`],
    ], fix2),
    scene: { ...base, mode: 'rf' },
  }

  const side = rand.chance(0.5)
    ? pickSide(rand, 'Why is the start line drawn in pencil, not pen?', 'Ink would dissolve and run up the paper', [
      ['So it can be rubbed out afterwards', 'You don’t rub it out. Ink is soluble, so it would run with the solvent and add its own spots. Graphite doesn’t dissolve.'],
      ['Pencil makes the solvent move faster', 'Pencil doesn’t change the solvent. Ink would dissolve and make extra spots; graphite won’t.'],
      ['Pen lines are too thick to measure from', 'Thickness isn’t the issue. Ink would dissolve in the solvent and run up the paper.'],
    ], `Ink is a mixture of soluble dyes, so it would separate and leave spots of its own. Pencil (graphite) is insoluble and stays put.`)
    : pickSide(rand, 'Why must the start line sit above the solvent?', 'So the spots don’t wash off into the solvent', [
      ['So the solvent travels further', 'The solvent climbs the same either way. If the spots are under it, they dissolve into the beaker instead of moving up.'],
      ['So the pencil line stays dry', 'Pencil doesn’t mind getting wet. The SPOTS would dissolve into the solvent in the beaker.'],
      ['To make the Rf value bigger', 'Rf doesn’t depend on that. The spots would just dissolve into the solvent in the beaker.'],
    ], `If the spots sat below the solvent, they’d dissolve straight into the beaker. Above it, the solvent soaks up through them and carries each dye a different distance.`)

  return {
    id: 'chroma', title: 'Round 2 · Trace the dye', headline: 'Paper chromatography',
    why: `Spot the river sample and each factory’s dye on a pencil line near the bottom of the paper. Stand it in solvent, with the line above the solvent. Each dye moves a different distance, so a mixture splits into spots. The same dye in the same solvent always moves the same fraction of the way: its Rf. Rf = distance moved by the spot ÷ distance moved by the solvent.`,
    tasks: [t1, t2],
    side,
    workingOn: 1,
    chain: [
      { line: `\\text{Rf} = \\frac{\\text{spot}}{\\text{solvent front}}` },
      { line: `\\text{Rf} = \\frac{[[s:${top}]]}{[[f:${F}]]}`, op: 'Substitute', why: `Both measured up from the pencil start line: the spot ${top} cm, the solvent ${F} cm.` },
      { line: `\\text{Rf} = [[r:${n(r)}]]`, op: 'Divide', merge: { r: ['s', 'f'] }, why: `${top} ÷ ${F} = ${n(r)}. No units: it’s a ratio, and always less than 1.` },
    ],
  }
}

/* ---------------------------------------------------------------- Round 3: pH and gas tests */

export type GasId = 'h2' | 'o2' | 'co2' | 'cl2'
const GAS: Record<GasId | 'n2', { name: string; test: string; seen: string }> = {
  h2: { name: 'Hydrogen', test: 'pops with a lit splint', seen: 'gave a squeaky pop with a lit splint' },
  o2: { name: 'Oxygen', test: 'relights a glowing splint', seen: 'relit a glowing splint' },
  co2: { name: 'Carbon dioxide', test: 'turns limewater milky', seen: 'turned limewater milky' },
  cl2: { name: 'Chlorine', test: 'bleaches damp litmus paper', seen: 'bleached damp litmus paper' },
  n2: { name: 'Nitrogen', test: 'isn’t one of the four gas tests: it does none of these', seen: '' },
}

function acidRound(rand: Rand): RiverRound {
  // Work in tenths so the readings and the mean are exact.
  const m = rand.int(30, 60), a = rand.int(1, 3), b = rand.int(1, 2)
  const tenths = [m - a, m + b, m + a - b]
  const readings = tenths.map(t => t / 10), sum = tenths.reduce((s, t) => s + t, 0)
  const mean = m / 10, middle = [...tenths].sort((x, y) => x - y)[1] / 10
  const list = readings.map(r => n(r)).join(', ')
  const fix1 = `Mean = (${readings.map(r => n(r)).join(' + ')}) ÷ 3 = ${n(sum / 10)} ÷ 3 = ${n(mean)}.`
  const t1: Task<Scene> = {
    id: 'acid-1',
    prompt: `Three pH readings: ${list}. What’s the mean pH?`,
    label: 'Mean pH', unit: '', answer: mean, start: 7, min: 0, max: 14, step: 0.1, jump: 1,
    win: `Repeat readings and take the mean to cut down random errors. ${fix1} Below 7, so it’s acidic.`,
    nope: value => diagnose(mean, value, '', [
      [sum / 10, `That’s the total. Divide it by the 3 readings.`],
      [middle, `That’s the middle reading. The mean is the total ÷ 3.`],
      [7, `pH 7 is neutral. Work out the mean of the readings.`],
      [Number((sum / 20).toFixed(1)), `You divided by 2. There are 3 readings, so ÷ 3.`],
    ], fix1),
    scene: { kind: 'ph', readings },
  }

  const tests = rand.shuffle(['h2', 'o2', 'co2', 'cl2'] as GasId[])
  const palette = rand.shuffle(['h2', 'o2', 'co2', 'cl2', 'n2'] as const)
  const t2: TileTask<Scene> = {
    kind: 'tiles', id: 'acid-2', prompt: 'Name the gas in each jar, from jar 1 to jar 4.',
    label: 'The four gas jars', slots: tests.map((g, i) => `jar ${i + 1}, which ${GAS[g].seen}`),
    palette: palette.map(g => ({ value: g, label: GAS[g].name })), answer: tests,
    win: `Squeaky pop: hydrogen. Relights a glowing splint: oxygen. Milky limewater: carbon dioxide. Bleached litmus: chlorine.`,
    nope: picked => {
      const raw = picked.findIndex((g, k) => g !== tests[k]), i = raw < 0 ? 0 : raw
      const right = GAS[tests[i]], wrong = GAS[picked[i] as GasId | 'n2']
      return `Jar ${i + 1} ${right.seen}: that’s ${right.name.toLowerCase()}. ${wrong.name} ${wrong.test}.`
    },
    scene: { kind: 'gas', tests },
  }

  const side = rand.chance(0.5)
    ? pickSide(rand, 'Lime neutralises the pond to pH 7. What does that mean?', 'The water is neutral', [
      ['The water is strongly acidic', 'Acids are BELOW 7. At 7 the acid has been neutralised.'],
      ['The water is strongly alkaline', 'Alkalis are ABOVE 7. Exactly 7 is neutral.'],
      ['The water is pure', 'Salty water can be pH 7 too. pH only tells you acid, neutral or alkali.'],
    ], `pH 7 is neutral: the acid has reacted with the lime, an alkali, to make a salt and water.`)
    : pickSide(rand, 'An acid reacts with an alkali. What does it make?', 'A salt and water', [
      ['A salt and hydrogen', 'That’s acid + metal. Acid + alkali makes a salt and water.'],
      ['Carbon dioxide only', 'Carbon dioxide comes from acid + carbonate. Acid + alkali makes a salt and water.'],
      ['Chlorine and water', 'Chlorine isn’t made here. Acid + alkali → salt + water: that’s neutralisation.'],
    ], `Neutralisation: acid + alkali → salt + water. That’s why lime fixes the acidic mine water.`)

  return {
    id: 'acid', title: 'Round 3 · Acid alert', headline: 'pH and gas tests',
    why: `The pH scale runs from 0 to 14. Below 7 is acidic, 7 is neutral, above 7 is alkaline. Measure pH with universal indicator or a pH probe, and repeat readings to find a mean. Gases have tests: hydrogen pops with a lit splint, oxygen relights a glowing splint, carbon dioxide turns limewater milky, chlorine bleaches damp litmus paper.`,
    tasks: [t1, t2],
    side,
    workingOn: 0,
    chain: [
      { line: `\\text{mean} = \\frac{[[a:${n(readings[0])}]] + [[b:${n(readings[1])}]] + [[c:${n(readings[2])}]]}{[[k:3]]}` },
      { line: `\\text{mean} = \\frac{[[t:${n(sum / 10)}]]}{[[k:3]]}`, op: 'Add', merge: { t: ['a', 'b', 'c'] }, why: `Add the three readings: ${n(sum / 10)}.` },
      { line: `\\text{mean} = [[m:${n(mean)}]]`, op: 'Divide', merge: { m: ['t', 'k'] }, why: `${n(sum / 10)} ÷ 3 = ${n(mean)}. Below 7, so the mine water is acidic.` },
    ],
  }
}

/* ---------------------------------------------------------------- Round 4: potable water */

export type StageId = 'screen' | 'settle' | 'filter' | 'sterilise' | 'distil' | 'evaporate'
export const STAGES: Record<StageId, { label: string; short: string }> = {
  screen: { label: 'Screening', short: 'Screen' },
  settle: { label: 'Sedimentation', short: 'Settle' },
  filter: { label: 'Filter beds', short: 'Filter' },
  sterilise: { label: 'Sterilise', short: 'Sterilise' },
  distil: { label: 'Distil', short: 'Distil' },
  evaporate: { label: 'Evaporate', short: 'Evaporate' },
}
const WORKS: StageId[] = ['screen', 'settle', 'filter', 'sterilise']
const WORKS_WHY: Record<StageId, string> = {
  screen: 'Screening comes first: a mesh catches twigs, leaves and litter.',
  settle: 'Next, sedimentation: grit and mud sink to the bottom of a big tank.',
  filter: 'Then filter beds: sand and gravel trap the fine solids left.',
  sterilise: 'Sterilise last, with chlorine, ozone or UV, once the solids are gone and nothing shields the microbes.',
  distil: 'Distilling takes huge amounts of energy: it’s for seawater, not river water.',
  evaporate: 'Evaporating would boil the water away and leave only the solids.',
}

function treatRound(rand: Rand): RiverRound {
  const t1: TileTask<Scene> = {
    kind: 'tiles', id: 'treat-1', prompt: 'Build the waterworks: put the four stages in order.',
    label: 'The waterworks, river to tap', slots: ['tank 1', 'tank 2', 'tank 3', 'tank 4'],
    palette: rand.shuffle(Object.keys(STAGES) as StageId[]).map(value => ({ value, label: STAGES[value].label })), answer: WORKS,
    win: `Screen out the big bits, let the grit settle, filter through sand beds, then sterilise. Potable water: safe to drink, though not pure.`,
    nope: picked => {
      const raw = picked.findIndex((s, k) => s !== WORKS[k]), i = raw < 0 ? 0 : raw
      const p = picked[i] as StageId
      return WORKS.includes(p) ? `${STAGES[p].label} isn’t tank ${i + 1}. ${WORKS_WHY[WORKS[i]]}` : `${WORKS_WHY[p]} ${WORKS_WHY[WORKS[i]]}`
    },
    scene: { kind: 'works' },
  }

  const each = rand.pick([200, 250, 300, 400, 500]), beds = rand.int(3, 10), need = each * beds
  const fix2 = `Beds = ${n(need)} ÷ ${each} = ${beds}.`
  const t2: Task<Scene> = {
    id: 'treat-2',
    prompt: `Need ${n(need)} m³ an hour. Each bed cleans ${each} m³. How many beds?`,
    label: 'Filter beds', unit: 'beds', answer: beds, start: 0, min: 0, max: 20, step: 1, jump: 5,
    win: `Sand and gravel filter beds trap the solids. ${fix2}`,
    nope: value => diagnose(beds, value, 'beds', [
      [Math.round(need / 100), `You divided by 100. Divide by what ONE bed cleans: ${each} m³.`],
      [Math.round(need / 1000), `You divided by 1,000. Divide by what ONE bed cleans: ${each} m³.`],
      [need / each / 2, `${beds / 2} beds only clean ${n(need / 2)} m³, half of what’s needed.`],
    ], fix2),
    scene: { kind: 'beds', need, each },
  }

  return {
    id: 'treat', title: 'Round 4 · Tap water time', headline: 'Potable water',
    why: `Potable water is safe to drink. It isn’t pure: it still has low levels of dissolved salts. In the UK, river water is screened, left to settle, passed through filter beds, then sterilised with chlorine, ozone or UV. Where fresh water is scarce, seawater is desalinated by distillation or reverse osmosis, which takes lots of energy.`,
    tasks: [t1, t2],
    side: pickSide(rand, 'Why does seawater need desalination?', 'It has too much dissolved salt to drink', [
      ['Filter beds would take the salt out', 'Salt is dissolved, so it goes straight through a filter. It needs distillation or reverse osmosis.'],
      ['It’s too acidic to drink', 'Seawater is close to neutral. The problem is the dissolved salt.'],
      ['Chlorine can’t kill microbes in the sea', 'Chlorine works fine. The problem is the dissolved salt, which needs distillation or reverse osmosis.'],
    ], `Seawater is full of dissolved salts. Distillation or reverse osmosis removes them, but both need lots of energy, so it’s used where fresh water is scarce.`),
    workingOn: 1,
    chain: [
      { line: `[[n:\\text{beds}]] \\times [[c:${each}]] = [[w:${tex(need)}]]` },
      { line: `[[n:\\text{beds}]] = [[w:${tex(need)}]] \\div [[c:${each}]]`, op: `÷ ${each} both sides`, why: `Each bed cleans ${each} m³ an hour, so share the total between beds.` },
      { line: `[[n:\\text{beds}]] = [[a:${beds}]]`, op: 'Divide', merge: { a: ['w', 'c'] }, why: `${n(need)} ÷ ${each} = ${beds} filter beds. Check: ${beds} × ${each} = ${n(need)} m³.` },
    ],
  }
}

/* ---------------------------------------------------------------- Round 5 (boss): the water purification practical */

export type StepId = 'weigh' | 'add' | 'heat' | 'reweigh' | 'indicator' | 'pour'
export const STEPS: Record<StepId, string> = {
  weigh: 'Weigh empty dish', add: 'Add the water', heat: 'Evaporate', reweigh: 'Reweigh dish', indicator: 'Add indicator', pour: 'Pour it away',
}
const PRACTICAL: StepId[] = ['weigh', 'add', 'heat', 'reweigh']
const PRACTICAL_WHY: Record<StepId, string> = {
  weigh: 'Start by weighing the EMPTY dish, so you can take its mass away later.',
  add: 'Next, measure the water into the weighed dish.',
  heat: 'Then heat it to evaporate the water. The dissolved solids stay behind.',
  reweigh: 'Last, reweigh the dish: the gain is the dissolved solids.',
  indicator: 'Indicator would add its own mass. Test the pH on a separate sample.',
  pour: 'Pouring the water away throws out the dissolved solids with it.',
}

function bossRound(rand: Rand): RiverRound {
  const b10 = rand.int(400, 600), s10 = rand.int(2, 25), a10 = b10 + s10
  const before = b10 / 10, after = a10 / 10, solids = s10 / 10
  const sample = rand.pick([50, 100])
  const base = { before, after, sample }

  const t1: TileTask<Scene> = {
    kind: 'tiles', id: 'boss-1', prompt: 'Required practical: put the four steps in order.',
    label: 'The dissolved-solids practical', slots: ['step 1', 'step 2', 'step 3', 'step 4'],
    palette: rand.shuffle(Object.keys(STEPS) as StepId[]).map(value => ({ value, label: STEPS[value] })), answer: PRACTICAL,
    win: `Weigh empty, add ${sample} cm³, evaporate, reweigh. Dish after − dish before = the dissolved solids.`,
    nope: picked => {
      const raw = picked.findIndex((s, k) => s !== PRACTICAL[k]), i = raw < 0 ? 0 : raw
      const p = picked[i] as StepId
      return PRACTICAL.includes(p) ? `“${STEPS[p]}” isn’t step ${i + 1}. ${PRACTICAL_WHY[PRACTICAL[i]]}` : `${PRACTICAL_WHY[p]} ${PRACTICAL_WHY[PRACTICAL[i]]}`
    },
    scene: { kind: 'practical', ...base },
  }

  const fix2 = `Solids = after − before = ${n(after)} − ${n(before)} = ${n(solids)} g.`
  const t2: Task<Scene> = {
    id: 'boss-2',
    prompt: `Empty dish ${n(before)} g. After evaporating, ${n(after)} g. Mass of solids?`,
    label: 'Solids', unit: 'g', answer: solids, start: 0, min: 0, max: 5, step: 0.1, jump: 1,
    win: `The water boils off; the dissolved solids stay in the dish. ${fix2}`,
    nope: value => diagnose(solids, value, 'g', [
      [Math.floor(after) - Math.floor(before), `You only took away the whole grams. Subtract the decimals too.`],
      [s10, `The decimal point slipped: it’s ${n(solids)} g, not ${s10} g.`],
    ], fix2),
    scene: { kind: 'dish', ...base },
  }

  return {
    id: 'boss', title: 'Round 5 · Drinkable?', headline: 'Required practical: analysing and purifying water',
    why: `Test the sample’s pH with universal indicator or a pH probe. Weigh an empty evaporating dish, evaporate a measured volume of the water in it, then weigh it again: the gain is the dissolved solids. To purify the water, distil it: boil it, then cool the steam in a condenser. Pure water boils at exactly 100 °C.`,
    tasks: [t1, t2],
    side: pickSide(rand, 'You distil the river water. How can you tell it’s pure?', 'It boils at exactly 100 °C and leaves no residue', [
      ['It looks clear and colourless', 'Dissolved solids are invisible, so clear water can still be impure. Test it: pure water boils at exactly 100 °C.'],
      ['It has a pH of 7', 'Salty water can be pH 7 too. Pure water boils at exactly 100 °C and leaves nothing when evaporated.'],
      ['It doesn’t smell of anything', 'Lots of dissolved substances have no smell. Pure water boils at exactly 100 °C and leaves no residue.'],
    ], `A pure substance has a fixed boiling point. Pure water boils at exactly 100 °C, and evaporating it leaves no solids behind.`),
    workingOn: 1,
    chain: [
      { line: `m = \\text{after} - \\text{before}` },
      { line: `m = [[a:${n(after)}]] - [[b:${n(before)}]]`, op: 'Substitute', why: `The dish weighed ${n(before)} g empty and ${n(after)} g once the ${sample} cm³ had evaporated.` },
      { line: `m = [[s:${n(solids)}]]\\,\\text{g}`, op: 'Subtract', merge: { s: ['a', 'b'] }, why: `${n(after)} − ${n(before)} = ${n(solids)} g of dissolved solids. Line up the decimal points.` },
    ],
  }
}

export function makeRounds(rand: Rand): RiverRound[] {
  return [pureRound(rand), chromaRound(rand), acidRound(rand), treatRound(rand), bossRound(rand)]
}
