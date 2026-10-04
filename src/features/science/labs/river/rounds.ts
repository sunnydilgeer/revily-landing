import { options, type Rand } from '../../../maths/labs/kit/random'
import { diagnose, n, tex, type Round, type Side, type Task } from '../kit/types'

/*
 * River Rescue: trace what's poisoning an English river with Inspector Dev Sandhu of the Environment
 * Agency, then make the water safe to drink (AQA Trilogy 8464 Chemistry: chemical analysis, using
 * resources, acids and pH). Every answer is picked first, then the question is built around it, so
 * the numbers stay friendly. Decimals (Rf, pH, grams) are worked in whole tenths or hundredths.
 */

export type Scene =
  /** A sample bottle split into its parts. Whichever of part / percent is null is the dial. */
  | { kind: 'formula'; emoji: string; name: string; total: number; part: number | null; percent: number | null }
  /** A chromatography strip: solvent front and spot in cm, Rf. Whichever of spot / rf is null is the dial. */
  | { kind: 'chroma'; front: number; spot: number | null; rf: number | null }
  /** Repeat pH readings; the dial is their mean. */
  | { kind: 'ph'; readings: number[] }
  /** Lime into a settling pond: the pH needle swings to 7 on the right amount. */
  | { kind: 'lime'; rate: number; litres: number; startPh: number }
  /** Filter beds at the treatment works. */
  | { kind: 'beds'; need: number; each: number }
  /** The settling tank at the sewage works. */
  | { kind: 'tank'; inflow: number; outflow: number }
  /** An evaporating dish on a balance. */
  | { kind: 'dish'; before: number; after: number; sample: number }
  /** Scaling a sample's dissolved solids up to a litre. */
  | { kind: 'litre'; sample: number; solids: number }

export type RiverTask = Task<Scene>
export type RiverRound = Round<Scene>

const pickSide = (rand: Rand, prompt: string, right: string, wrongs: [string, string][], why: string): Side => ({
  prompt, answer: right,
  choices: options<string>(rand, { value: right, label: right }, wrongs.map(([label, nope]) => ({ value: label, label, nope })), { count: wrongs.length + 1 }),
  why,
})

/* ---------------------------------------------------------------- Round 1: pure substances and formulations */

function pureRound(rand: Rand): RiverRound {
  let P1 = 0, M1 = 0
  do { P1 = rand.pick([10, 15, 20, 25, 30, 40, 50, 60, 75, 80]); M1 = rand.pick([200, 250, 400, 500]) } while ((P1 * M1) % 100 !== 0)
  const A = P1 * M1 / 100
  const fix1 = `% = part ÷ total × 100 = ${A} ÷ ${M1} × 100 = ${P1}%.`
  const t1: RiverTask = {
    id: 'pure-1',
    prompt: `Foam at the outfall! A ${M1} g sample of the factory’s drain cleaner contains ${A} g of its active ingredient. What percentage is active ingredient?`,
    label: 'Percentage', unit: '%', answer: P1, start: 0, min: 0, max: 100, step: 5, jump: 10,
    win: `A formulation is a mixture made to an exact recipe, so every part has a set percentage. ${fix1}`,
    nope: value => diagnose(P1, value, '%', [
      [A, `That’s the ${A} g of active ingredient, not a percentage. Divide by the total, then × 100.`],
      [100 - P1, `That’s the REST of the cleaner. You want the active ingredient’s share.`],
      [Math.round(M1 / A), `Upside down: it’s part ÷ total (${A} ÷ ${M1}), not total ÷ part.`],
    ], fix1),
    scene: { kind: 'formula', emoji: '🧴', name: 'Active', total: M1, part: A, percent: null },
  }

  const P2 = rand.pick([10, 20, 25, 30, 40, 50]), T = rand.int(2, 6) * 100, N = P2 * T / 100
  const fix2 = `1% of ${T} g is ${T / 100} g, so ${P2}% is ${T / 100} × ${P2} = ${N} g.`
  const t2: RiverTask = {
    id: 'pure-2',
    prompt: `Upstream, a farm’s fertiliser is washing in. It’s ${P2}% nitrate. How many grams of nitrate are in a ${T} g scoop?`,
    label: 'Nitrate', unit: 'g', answer: N, start: 0, min: 0, max: 400, step: 5, jump: 50,
    win: `Too much nitrate makes algae bloom and starves the river of oxygen. ${fix2}`,
    nope: value => diagnose(N, value, 'g', [
      [T - N, `That’s everything EXCEPT the nitrate. Find ${P2}% of ${T} g.`],
      [P2, `That’s the percentage. Find ${P2}% OF ${T} g.`],
      [T / P2, `You divided by ${P2}. Divide by 100 to find 1%, then × ${P2}.`],
      [T, `That’s the whole scoop. Only ${P2}% of it is nitrate.`],
    ], fix2),
    scene: { kind: 'formula', emoji: '🌾', name: 'Nitrate', total: T, part: null, percent: P2 },
  }

  return {
    id: 'pure', title: 'Round 1 · Pure or not?', headline: 'Pure substances and formulations',
    why: `In everyday life “pure” means nothing added. In chemistry, a pure substance is a single element or compound, not mixed with anything else. A pure substance melts and boils at one fixed temperature. A formulation is a mixture made to a recipe, like a cleaner or a fertiliser. Percentage = mass of the part ÷ total mass × 100.`,
    tasks: [t1, t2],
    side: pickSide(rand, 'In chemistry, what is a pure substance?', 'A single element or compound', [
      ['Anything natural with nothing added', 'That’s the everyday meaning. Fresh orange juice is “pure” in the shop but it’s a mixture. In chemistry, pure means one element or compound.'],
      ['A mixture made to an exact recipe', 'That’s a formulation, like the drain cleaner. A pure substance is a single element or compound.'],
      ['Any clear, colourless liquid', 'River water can look clear and still be full of dissolved stuff. Pure means one element or compound only.'],
    ], `A pure substance is just one element or compound. That’s why it melts and boils at a single, sharp temperature, while a mixture melts over a range.`),
    chain: [
      { line: `1\\% = [[t:${T}]] \\div [[h:100]]` },
      { line: `1\\% = [[o:${T / 100}]]\\,\\text{g}`, op: 'Divide', merge: { o: ['t', 'h'] }, why: `Percent means out of 100, so 1% of ${T} g is ${T / 100} g.` },
      { line: `${P2}\\% = [[o:${T / 100}]] \\times [[p:${P2}]]`, op: `× ${P2}`, why: `${P2}% is ${P2} lots of 1%.` },
      { line: `${P2}\\% = [[s:${N}]]\\,\\text{g}`, op: 'Multiply', merge: { s: ['o', 'p'] }, why: `${T / 100} × ${P2} = ${N} g of nitrate in the scoop.` },
    ],
  }
}

/* ---------------------------------------------------------------- Round 2: chromatography */

/** Solvent front and spot distance (whole cm) whose Rf lands on the 0.05 grid. */
const PAIRS: [number, number][] = [4, 5, 8, 10].flatMap(F => Array.from({ length: F - 1 }, (_, i) => i + 1).filter(s => (s * 20) % F === 0).map(s => [F, s] as [number, number]))
const rf = (F: number, s: number) => Number((s / F).toFixed(2))

function chromaRound(rand: Rand): RiverRound {
  const [F1, s1] = rand.pick(PAIRS), r1 = rf(F1, s1)
  const fix1 = `Rf = spot ÷ solvent front = ${s1} ÷ ${F1} = ${n(r1)}.`
  const top1 = rf(F1, F1 - s1)
  const t1: RiverTask = {
    id: 'chroma-1',
    prompt: `The river sample’s dye spot moved ${s1} cm. The solvent front moved ${F1} cm. What is the spot’s Rf value?`,
    label: 'Rf', unit: '', answer: r1, start: 0, min: 0, max: 1, step: 0.05, jump: 0.1,
    win: `Rf compares how far the spot went with how far the solvent went, so it’s always less than 1. ${fix1}`,
    nope: value => diagnose(r1, value, '', [
      [top1, `You measured from the spot up to the solvent front. Measure both distances from the pencil start line.`],
      [Number((s1 / 10).toFixed(2)), `You divided by 10. Divide by the solvent front, ${F1} cm.`],
      [s1, `That’s the distance in cm. Rf is a ratio: divide it by the solvent front.`],
    ], fix1),
    scene: { kind: 'chroma', front: F1, spot: s1, rf: null },
  }

  const [F2, s2] = rand.pick(PAIRS.filter(([F]) => F >= 5)), r2 = rf(F2, s2)
  const fix2 = `Distance = Rf × solvent front = ${n(r2)} × ${F2} = ${s2} cm.`
  const t2: RiverTask = {
    id: 'chroma-2',
    prompt: `The suspect factory’s dye has Rf ${n(r2)}. On a fresh paper the solvent front reaches ${F2} cm. How far up must the river’s spot be to match it?`,
    label: 'Spot distance', unit: 'cm', answer: s2, start: 0, min: 0, max: 12, step: 0.5, jump: 1,
    win: `Same dye, same solvent, same Rf. ${fix2} The spot matches, so the dye came from that factory’s outfall.`,
    nope: value => diagnose(s2, value, 'cm', [
      [F2 - s2, `That’s measured down from the solvent front. Measure up from the start line: Rf × front.`],
      [F2, `That’s the solvent front itself. The spot only gets ${n(r2)} of the way.`],
      [Number((F2 / r2).toFixed(1)), `You divided by the Rf. Rearrange: distance = Rf × front.`],
      [r2 * 10, `That’s Rf × 10. Multiply by THIS paper’s solvent front, ${F2} cm.`],
    ], fix2),
    scene: { kind: 'chroma', front: F2, spot: null, rf: r2 },
  }

  const side = rand.chance(0.5)
    ? pickSide(rand, 'Why is the start line drawn in pencil, not pen?', 'Ink would dissolve and run up the paper', [
      ['So it can be rubbed out afterwards', 'You don’t rub it out. Ink is soluble, so it would run with the solvent and add its own spots. Graphite doesn’t dissolve.'],
      ['Pencil makes the solvent move faster', 'Pencil doesn’t change the solvent. Ink would dissolve and make extra spots; graphite won’t.'],
      ['Pen lines are too thick to measure from', 'Thickness isn’t the issue. Ink would dissolve in the solvent and run up the paper.'],
    ], `Ink is a mixture of soluble dyes, so it would separate and leave spots of its own. Pencil (graphite) is insoluble and stays put.`)
    : pickSide(rand, 'Why must the start line sit above the level of the solvent?', 'So the spots don’t wash off into the solvent', [
      ['So the solvent travels further', 'The solvent climbs the same either way. If the spots are under it, they dissolve into the beaker instead of moving up.'],
      ['So the pencil line stays dry', 'Pencil doesn’t mind getting wet. The SPOTS would dissolve into the solvent in the beaker.'],
      ['To make the Rf value bigger', 'Rf doesn’t depend on that. The spots would just dissolve into the solvent in the beaker.'],
    ], `If the spots sat below the solvent, they’d dissolve straight into the beaker. Above it, the solvent soaks up through them and carries each dye a different distance.`)

  return {
    id: 'chroma', title: 'Round 2 · Trace the dye', headline: 'Paper chromatography',
    why: `Put a spot of the sample on a pencil line near the bottom of the paper. Stand it in solvent, with the line above the solvent. Each dye moves a different distance, so a mixture splits into spots. Rf = distance moved by the spot ÷ distance moved by the solvent. The same dye in the same solvent always has the same Rf, so you can match a sample to its source.`,
    tasks: [t1, t2],
    side,
    chain: [
      { line: `[[r:${n(r2)}]] = \\frac{[[d:d]]}{[[f:${F2}]]}` },
      { line: `[[d:d]] = [[r:${n(r2)}]] \\times [[f:${F2}]]`, op: `× ${F2} both sides`, why: `Rf = distance ÷ front, so multiply both sides by the front to get d on its own.` },
      { line: `[[d:d]] = [[a:${s2}]]\\,\\text{cm}`, op: 'Multiply', merge: { a: ['r', 'f'] }, why: `${n(r2)} × ${F2} = ${s2} cm up from the start line.` },
    ],
  }
}

/* ---------------------------------------------------------------- Round 3: acids, pH and neutralisation */

function acidRound(rand: Rand): RiverRound {
  // Work in tenths so the readings and the mean are exact.
  const m = rand.int(30, 60), a = rand.int(1, 3), b = rand.int(1, 2)
  const tenths = [m - a, m + b, m + a - b]
  const readings = tenths.map(t => t / 10), sum = tenths.reduce((s, t) => s + t, 0)
  const mean = m / 10, middle = [...tenths].sort((x, y) => x - y)[1] / 10
  const list = readings.map(r => n(r)).join(', ')
  const fix1 = `Mean = (${readings.map(r => n(r)).join(' + ')}) ÷ 3 = ${n(sum / 10)} ÷ 3 = ${n(mean)}.`
  const t1: RiverTask = {
    id: 'acid-1',
    prompt: `Orange water is seeping from an old mine outfall. Your pH probe gives three readings: ${list}. What is the mean pH?`,
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

  let r = 0, V = 0
  do { r = rand.int(2, 5); V = rand.int(5, 20) } while (r * V > 100)
  const lime = r * V
  const fix2 = `${n(V * 1000)} litres is ${V} lots of 1,000, so ${r} × ${V} = ${lime} kg of lime.`
  const t2: RiverTask = {
    id: 'acid-2',
    prompt: `Lime is an alkali. In the lab, ${r} kg of lime neutralises 1,000 litres of the mine water. The settling pond holds ${n(V * 1000)} litres. How much lime does it need?`,
    label: 'Lime', unit: 'kg', answer: lime, start: 0, min: 0, max: 120, step: 1, jump: 10,
    win: `Twice the water needs twice the lime: it’s direct proportion. ${fix2}`,
    nope: value => diagnose(lime, value, 'kg', [
      [V, `That’s how many thousand litres there are. Each 1,000 needs ${r} kg.`],
      [r + V, `You added. Each 1,000 litres needs ${r} kg, so multiply.`],
      [V / r, `You divided. Each 1,000 litres needs ${r} kg, so multiply by ${V}.`],
      [r * 10, `That’s for 10,000 litres. The pond holds ${n(V * 1000)}.`],
    ], fix2),
    scene: { kind: 'lime', rate: r, litres: V * 1000, startPh: mean },
  }

  const side = rand.chance(0.5)
    ? pickSide(rand, 'Once the pond reads pH 7, what does that tell you?', 'The water is neutral', [
      ['The water is strongly acidic', 'Acids are BELOW 7. At 7 the acid has been neutralised.'],
      ['The water is strongly alkaline', 'Alkalis are ABOVE 7. Exactly 7 is neutral.'],
      ['The water is pure', 'Salty water can be pH 7 too. pH only tells you acid, neutral or alkali.'],
    ], `pH 7 is neutral: the hydrogen ions from the acid have reacted with the hydroxide ions from the lime to make water. H⁺ + OH⁻ → H₂O.`)
    : pickSide(rand, 'The acid water fizzes on old iron pipes. The gas burns with a squeaky pop. What is it?', 'Hydrogen', [
      ['Oxygen', 'Oxygen relights a glowing splint. A squeaky pop with a lit splint means hydrogen.'],
      ['Carbon dioxide', 'Carbon dioxide turns limewater milky. A squeaky pop means hydrogen.'],
      ['Chlorine', 'Chlorine bleaches damp litmus paper white. A squeaky pop means hydrogen.'],
    ], `Acid + metal → salt + hydrogen. Hold a lit splint at the tube: hydrogen burns with a squeaky pop.`)

  return {
    id: 'acid', title: 'Round 3 · Acid alert', headline: 'pH and neutralisation',
    why: `The pH scale runs from 0 to 14. Below 7 is acidic, 7 is neutral, above 7 is alkaline. Measure pH with universal indicator or a pH probe, and repeat readings to find a mean. An alkali neutralises an acid: acid + alkali → salt + water. Double the acid water needs double the alkali.`,
    tasks: [t1, t2],
    side,
    chain: [
      { line: `\\text{lime} = [[r:${r}]]\\,\\text{kg} \\times \\frac{[[v:${tex(V * 1000)}]]}{[[k:1{,}000]]}` },
      { line: `\\text{lime} = [[r:${r}]]\\,\\text{kg} \\times [[q:${V}]]`, op: 'How many 1,000s?', merge: { q: ['v', 'k'] }, why: `${n(V * 1000)} ÷ 1,000 = ${V}, so the pond is ${V} lab batches.` },
      { line: `\\text{lime} = [[a:${lime}]]\\,\\text{kg}`, op: 'Multiply', merge: { a: ['r', 'q'] }, why: `${r} kg for each batch × ${V} batches = ${lime} kg of lime.` },
    ],
  }
}

/* ---------------------------------------------------------------- Round 4: potable water and waste water */

function treatRound(rand: Rand): RiverRound {
  const each = rand.pick([200, 250, 300, 400, 500]), beds = rand.int(3, 10), need = each * beds
  const fix1 = `Beds = ${n(need)} ÷ ${each} = ${beds}.`
  const t1: RiverTask = {
    id: 'treat-1',
    prompt: `The waterworks must clean ${n(need)} m³ of river water an hour. Each filter bed cleans ${each} m³ an hour. How many filter beds must run?`,
    label: 'Filter beds', unit: 'beds', answer: beds, start: 0, min: 0, max: 20, step: 1, jump: 5,
    win: `Sand and gravel filter beds trap the solids. ${fix1}`,
    nope: value => diagnose(beds, value, 'beds', [
      [Math.round(need / 100), `You divided by 100. Divide by what ONE bed cleans: ${each} m³.`],
      [Math.round(need / 1000), `You divided by 1,000. Divide by what ONE bed cleans: ${each} m³.`],
      [need / each / 2, `${beds / 2} beds only clean ${n(need / 2)} m³, half of what’s needed.`],
    ], fix1),
    scene: { kind: 'beds', need, each },
  }

  const sludge = rand.int(2, 15) * 10, inflow = rand.int(8, 18) * 50, outflow = inflow - sludge
  const fix2 = `Mass in = mass out, so sludge = ${inflow} − ${outflow} = ${sludge} tonnes.`
  const t2: RiverTask = {
    id: 'treat-2',
    prompt: `The sewage works’ settling tank takes in ${inflow} tonnes of waste water a day, and ${outflow} tonnes of liquid flows out. What mass of sludge settled?`,
    label: 'Sludge', unit: 'tonnes', answer: sludge, start: 0, min: 0, max: 300, step: 5, jump: 50,
    win: `Sedimentation lets the heavy solids sink as sludge; the liquid (effluent) flows on for more cleaning. ${fix2}`,
    nope: value => diagnose(sludge, value, 'tonnes', [
      [inflow / 2, `It doesn’t split half and half. Sludge = what went in − what flowed out.`],
      [sludge * 2, `You doubled it. Sludge is just in − out.`],
      [Math.round(outflow / 10), `That’s a tenth of the outflow. Take the outflow away from the inflow.`],
    ], fix2),
    scene: { kind: 'tank', inflow, outflow },
  }

  const side = rand.chance(0.5)
    ? pickSide(rand, 'In the UK, how is fresh water made safe to drink?', 'Filter it, then sterilise it', [
      ['Sterilise it, then filter it', 'Filter first, so solids are gone and the chlorine, ozone or UV can reach every microbe.'],
      ['Distil all of it', 'Distilling needs huge amounts of energy. UK fresh water only needs filtering, then sterilising.'],
      ['Add salt, then filter it', 'Salt makes water LESS drinkable. Filter it, then sterilise it with chlorine, ozone or UV.'],
    ], `Choose a good source, pass it through filter beds to remove solids, then sterilise it with chlorine, ozone or UV to kill microbes.`)
    : pickSide(rand, 'A seaside town runs short of fresh water. Why does seawater need desalination?', 'It has too much dissolved salt to drink', [
      ['Filter beds would take the salt out', 'Salt is dissolved, so it goes straight through a filter. It needs distillation or reverse osmosis.'],
      ['It’s too acidic to drink', 'Seawater is close to neutral. The problem is the dissolved salt.'],
      ['Chlorine can’t kill microbes in the sea', 'Chlorine works fine. The problem is the dissolved salt, which needs distillation or reverse osmosis.'],
    ], `Seawater is full of dissolved salts. Distillation or reverse osmosis removes them, but both need lots of energy, so it’s used where fresh water is scarce.`)

  return {
    id: 'treat', title: 'Round 4 · Tap water time', headline: 'Potable water and waste water',
    why: `Potable water is safe to drink. It isn’t pure: it still has low levels of dissolved salts. In the UK, fresh river water is passed through filter beds, then sterilised with chlorine, ozone or UV. Sewage is treated too: screening, then sedimentation splits it into sludge and liquid effluent.`,
    tasks: [t1, t2],
    side,
    workingOn: 0,
    chain: [
      { line: `[[n:\\text{beds}]] \\times [[c:${each}]] = [[w:${tex(need)}]]` },
      { line: `[[n:\\text{beds}]] = [[w:${tex(need)}]] \\div [[c:${each}]]`, op: `÷ ${each} both sides`, why: `Each bed cleans ${each} m³ an hour, so share the total between beds.` },
      { line: `[[n:\\text{beds}]] = [[a:${beds}]]`, op: 'Divide', merge: { a: ['w', 'c'] }, why: `${n(need)} ÷ ${each} = ${beds} filter beds. Check: ${beds} × ${each} = ${n(need)} m³.` },
    ],
  }
}

/* ---------------------------------------------------------------- Round 5 (boss): the water purification practical */

function bossRound(rand: Rand): RiverRound {
  const b10 = rand.int(400, 600), s10 = rand.int(2, 25), a10 = b10 + s10
  const before = b10 / 10, after = a10 / 10, solids = s10 / 10
  const sample = rand.pick([50, 100]), k = 1000 / sample, perLitre = s10 * k / 10
  const fix1 = `Solids = after − before = ${n(after)} − ${n(before)} = ${n(solids)} g.`
  const t1: RiverTask = {
    id: 'boss-1',
    prompt: `Required practical: an empty evaporating dish weighs ${n(before)} g. You evaporate ${sample} cm³ of river water in it, and now it weighs ${n(after)} g. What mass of dissolved solids is left?`,
    label: 'Solids', unit: 'g', answer: solids, start: 0, min: 0, max: 5, step: 0.1, jump: 1,
    win: `The water boils off; the dissolved solids stay in the dish. ${fix1}`,
    nope: value => diagnose(solids, value, 'g', [
      [Math.floor(after) - Math.floor(before), `You only took away the whole grams. Subtract the decimals too.`],
      [s10, `The decimal point slipped: it’s ${n(solids)} g, not ${s10} g.`],
    ], fix1),
    scene: { kind: 'dish', before, after, sample },
  }

  const fix2 = `1,000 ÷ ${sample} = ${k} samples in a litre, so ${n(solids)} × ${k} = ${perLitre} g.`
  const t2: RiverTask = {
    id: 'boss-2',
    prompt: `That was a ${sample} cm³ sample. How many grams of dissolved solids would 1 litre (1,000 cm³) of the river water leave?`,
    label: 'Solids per litre', unit: 'g', answer: perLitre, start: 0, min: 0, max: 60, step: 1, jump: 10,
    win: `Scale up by how many samples fit in a litre. ${fix2}`,
    nope: value => diagnose(perLitre, value, 'g', [
      [k, `That’s how many ${sample} cm³ samples fit in a litre. Multiply it by the ${n(solids)} g.`],
      [solids, `That’s for the ${sample} cm³ sample. A litre is ${k} times as much.`],
      [s10, `You multiplied by 10. A litre is ${k} lots of ${sample} cm³.`],
      [perLitre / 2, `Half the answer: a litre is ${k} lots of ${sample} cm³, not ${k / 2}.`],
    ], fix2),
    scene: { kind: 'litre', sample, solids },
  }

  return {
    id: 'boss', title: 'Round 5 · Drinkable?', headline: 'Required practical: analysing and purifying water',
    why: `Test the sample’s pH with universal indicator or a pH probe. Weigh an empty evaporating dish, evaporate a measured volume of the water in it, then weigh it again: the gain is the dissolved solids. To purify the water, distil it: boil it, then cool the steam in a condenser. Pure water boils at exactly 100 °C.`,
    tasks: [t1, t2],
    side: pickSide(rand, 'You distil the river water. How can you tell the distilled water is pure?', 'It boils at exactly 100 °C and leaves no residue', [
      ['It looks clear and colourless', 'Dissolved solids are invisible, so clear water can still be impure. Test it: pure water boils at exactly 100 °C.'],
      ['It has a pH of 7', 'Salty water can be pH 7 too. Pure water boils at exactly 100 °C and leaves nothing when evaporated.'],
      ['It doesn’t smell of anything', 'Lots of dissolved substances have no smell. Pure water boils at exactly 100 °C and leaves no residue.'],
    ], `A pure substance has a fixed boiling point. Pure water boils at exactly 100 °C, and evaporating it leaves no solids behind.`),
    chain: [
      { line: `m = [[a:${n(after)}]] - [[b:${n(before)}]]` },
      { line: `m = [[s:${n(solids)}]]\\,\\text{g}`, op: 'Subtract', merge: { s: ['a', 'b'] }, why: `Dish after − dish before = ${n(solids)} g of dissolved solids from ${sample} cm³.` },
      { line: `\\text{per litre} = [[s:${n(solids)}]] \\times \\frac{[[l:1{,}000]]}{[[v:${sample}]]}`, op: 'Scale to 1,000 cm³', why: `A litre is 1,000 cm³. Find how many ${sample} cm³ samples that is.` },
      { line: `\\text{per litre} = [[s:${n(solids)}]] \\times [[k:${k}]]`, op: 'Divide', merge: { k: ['l', 'v'] }, why: `1,000 ÷ ${sample} = ${k} samples.` },
      { line: `\\text{per litre} = [[r:${perLitre}]]\\,\\text{g}`, op: 'Multiply', merge: { r: ['s', 'k'] }, why: `${n(solids)} × ${k} = ${perLitre} g of dissolved solids in every litre.` },
    ],
  }
}

export function makeRounds(rand: Rand): RiverRound[] {
  return [pureRound(rand), chromaRound(rand), acidRound(rand), treatRound(rand), bossRound(rand)]
}
