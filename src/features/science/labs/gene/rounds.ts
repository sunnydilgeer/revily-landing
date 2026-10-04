import { options, type Rand } from '../../../maths/labs/kit/random'
import { diagnose, n, type Round, type Task } from '../kit/types'

/*
 * Gene Detective: a trainee genetic counsellor in an NHS genomics lab with Dr Mensah, cracking the
 * family cases that newborn genome screening turns up (AQA Trilogy 4.6 Inheritance, variation and
 * evolution, Foundation): chromosomes and meiosis, alleles, Punnett squares (completing and reading
 * them), probability and simple ratios, cystic fibrosis and polydactyly, sex determination, and
 * resistant bacteria. Every answer is picked first, then the family is built around it, so counts
 * always come out whole.
 */

/** A Punnett square box: its genotype, what kind it is (for its colour), and whether it's what the question asks for. */
export type Kind = 'dd' | 'het' | 'rr' | 'boy' | 'girl'
export type Box = { g: string; kind: Kind; target: boolean }
export type Scene = {
  layout: 'cell' | 'punnett' | 'crowd'
  /** The given values, in the readout beside the picture. */
  given: [string, string][]
  /** Cell: a sperm or egg (smaller, one of each pair) rather than a body cell. */
  gamete?: boolean
  /** Punnett: one parent's alleles across the top, the other's down the side, and the four boxes (row by row). */
  square?: { top: [string, string]; side: [string, string]; boxes: Box[]; key: string }
  /** Crowd: how many babies or pets, their icon, the colour the dial paints, and the key. */
  crowd?: { total: number; icon: string; tint: Kind; key: string }
}
export type GeneTask = Task<Scene>
export type GeneRound = Round<Scene>

const PCT = '%'

/** Dominant allele first (Bb, not bB); X before Y. */
function genotype(a: string, b: string) {
  const up = (s: string) => s === s.toUpperCase() ? 0 : 1
  return [a, b].sort((p, q) => up(p) - up(q) || p.localeCompare(q)).join('')
}
function kindOf(g: string): Kind {
  if (g.includes('Y')) return 'boy'
  if (g === 'XX') return 'girl'
  return g === g.toUpperCase() ? 'dd' : g === g.toLowerCase() ? 'rr' : 'het'
}
/** The four boxes of a Punnett square: side allele × top allele, row by row. */
function cross(side: [string, string], top: [string, string], isTarget: (kind: Kind) => boolean): Box[] {
  return side.flatMap(s => top.map(t => { const g = genotype(s, t), kind = kindOf(g); return { g, kind, target: isTarget(kind) } }))
}

/** Round 1: chromosome pairs → chromosomes in a body cell, then meiosis halves it for the gametes. */
function genomeRound(rand: Rand): GeneRound {
  const SPECIES: [string, number][] = [['human', 46], ['chimpanzee', 48], ['dog', 78], ['cat', 38], ['horse', 64], ['cow', 60], ['fruit fly', 8], ['mouse', 40], ['rabbit', 44]]
  const [who, body] = rand.pick(SPECIES.slice(0, 2).concat(SPECIES)), pairs = body / 2
  const fix1 = `Each pair is 2 chromosomes: ${pairs} × 2 = ${body}.`
  const t1: GeneTask = {
    id: 'genome-1', prompt: `Every body cell of a ${who} carries ${pairs} pairs of chromosomes. How many chromosomes is that in one body cell?`,
    label: 'Chromosomes', unit: 'chromosomes', answer: body, start: 0, min: 0, max: 100, step: 1, jump: 10,
    win: `Chromosomes come in pairs: one of each pair from each parent. ${fix1}`,
    nope: value => diagnose(body, value, 'chromosomes', [
      [pairs, `That’s the number of PAIRS. Each pair is two chromosomes, so × 2.`],
      [pairs / 2, `You halved, but that’s what meiosis does for sex cells. A body cell has the full set: × 2.`],
      [pairs + 2, `You added 2. Each of the ${pairs} pairs has 2 chromosomes, so multiply.`],
    ], fix1),
    scene: { layout: 'cell', given: [['Species', who], ['Pairs', `${pairs}`]] },
  }

  const [who2, body2] = rand.pick(SPECIES.filter(([name]) => name !== who)), half = body2 / 2
  const sperm = rand.chance(0.5) ? 'sperm cell' : 'egg cell'
  const fix2 = `Meiosis halves it: ${body2} ÷ 2 = ${half}.`
  const t2: GeneTask = {
    id: 'genome-2', prompt: `A ${who2}’s body cells have ${body2} chromosomes. Meiosis makes its sex cells. How many chromosomes are in one ${sperm}?`,
    label: 'Chromosomes', unit: 'chromosomes', answer: half, start: 0, min: 0, max: 100, step: 1, jump: 10,
    win: `A gamete gets ONE chromosome from each pair. ${fix2} At fertilisation ${half} + ${half} = ${body2} again.`,
    nope: value => diagnose(half, value, 'chromosomes', [
      [body2, `That’s a body cell. Meiosis HALVES the number for sex cells.`],
      [body2 * 2, `Doubled! If gametes had more, every generation would double. Meiosis halves it.`],
      [half / 2, `You halved twice. Meiosis halves just once: one from each pair.`],
      [body2 - 2, `You took away one pair. A gamete gets one chromosome from EVERY pair: halve it.`],
    ], fix2),
    scene: { layout: 'cell', gamete: true, given: [['Species', who2], ['Body cell', `${body2}`]] },
  }

  const right = 'A different version of the same gene'
  return {
    id: 'genome', title: 'Round 1 · The genome', headline: 'Chromosomes and meiosis',
    why: `DNA is packed into chromosomes in the nucleus. Body cells have chromosomes in pairs: a human has 23 pairs, so 46. A gene is a small section of DNA that codes for a protein. Meiosis makes gametes (sperm and egg) with half the chromosomes, one from each pair. Fertilisation joins two gametes, so the full number comes back.`,
    tasks: [t1, t2],
    side: {
      prompt: 'The baby’s report mentions “alleles”. What is an allele?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'A pair of chromosomes', label: 'A pair of chromosomes', nope: 'A chromosome is a long strand of DNA carrying many genes. An allele is one version of a single gene.' },
        { value: 'A sex cell, like a sperm or egg', label: 'A sex cell, like a sperm or egg', nope: 'That’s a gamete. An allele is a different version of the same gene.' },
        { value: 'The feature you can see, like eye colour', label: 'The feature you can see, like eye colour', nope: 'That’s the phenotype. An allele is a version of a gene, like B or b.' },
      ], { count: 4 }),
      why: `A gene can come in different versions called alleles, like B and b. You get one allele of each gene from each parent.`,
    },
    chain: [
      { line: `\\text{gamete} = [[b:${body2}]] \\div [[h:2]]` },
      { line: `\\text{gamete} = [[g:${half}]]`, op: 'Halve', merge: { g: ['b', 'h'] }, why: `Meiosis gives each sex cell one chromosome from each pair: ${body2} ÷ 2 = ${half}.` },
      { line: `[[e:${half}]] + [[s:${half}]]`, op: 'Fertilise', why: `An egg with ${half} meets a sperm with ${half}.` },
      { line: `\\text{fertilised egg} = [[f:${body2}]]`, op: 'Add', merge: { f: ['e', 's'] }, why: `${half} + ${half} = ${body2}: the full set, in pairs again.` },
    ],
  }
}

type Ask = 'rr' | 'dd' | 'het' | 'dom'
const COUNT: Record<Ask, number> = { rr: 1, dd: 1, het: 2, dom: 3 }
const hits = (ask: Ask) => (kind: Kind) => ask === 'dom' ? kind === 'dd' || kind === 'het' : kind === ask

/** Round 2: a Bb × Bb Punnett square → the chance, then the number expected out of a big litter record. */
function punnettRound(rand: Rand): GeneRound {
  const pet = rand.pick([
    { who: 'Labradors', one: 'Labrador', unit: 'pups', icon: '🐶', D: 'B', r: 'b', dom: 'black', rec: 'chocolate', what: 'coat colour' },
    { who: 'cats', one: 'cat', unit: 'kittens', icon: '🐱', D: 'L', r: 'l', dom: 'short-haired', rec: 'long-haired', what: 'long coat' },
  ])
  const { D, r } = pet, DD = D + D, Dr = D + r, rr = r + r
  const ask = rand.pick<Ask>(['rr', 'dd', 'het', 'dom']), k = COUNT[ask], pct = k * 25
  const want = { rr: `${pet.rec} (${rr})`, dd: `${DD}`, het: `${Dr}, like its parents`, dom: pet.dom }[ask]
  const what = { rr: `${rr} (${pet.rec})`, dd: DD, het: Dr, dom: `${pet.dom} (${DD} or ${Dr})` }[ask]
  const boxes = cross([D, r], [D, r], hits(ask))
  const fix1 = `${k} of the 4 boxes ${k === 1 ? 'is' : 'are'} ${what}: ${k} ÷ 4 = ${pct}%.`
  const slips: Record<Ask, [number, string][]> = {
    rr: [[50, `50% is the ${Dr} boxes. ${pet.rec} needs ${rr}: a ${r} from BOTH parents.`], [75, `75% is every ${pet.dom} one (${DD} and ${Dr}). ${pet.rec} is only ${rr}.`], [0, `${rr} CAN happen: each ${Dr} parent can pass on ${r}.`], [100, `Only one box is ${rr}.`]],
    dd: [[50, `50% is the ${Dr} boxes. ${DD} needs a ${D} from both parents: just 1 box.`], [75, `That’s every ${pet.dom} one, but only one box is ${DD}. The others are ${Dr}.`], [0, `${DD} CAN happen: each parent can pass on ${D}.`], [100, `Only one box is ${DD}.`]],
    het: [[25, `That’s one box. ${Dr} turns up in 2 of the 4 boxes.`], [75, `That’s every ${pet.dom} one, ${DD} too. Only ${Dr} counts.`], [100, `Not every baby is ${Dr}: there’s ${DD} and ${rr} as well.`], [0, `${Dr} is in 2 boxes.`]],
    dom: [[25, `That’s the ${rr} (${pet.rec}) box. ${pet.dom} is ${DD} OR ${Dr}: 3 boxes.`], [50, `You only counted ${Dr}. ${DD} is ${pet.dom} too.`], [100, `${rr} (${pet.rec}) can still happen: 1 box in 4.`], [0, `${D} is dominant, so 3 boxes have it.`]],
  }
  const t1: GeneTask = {
    id: 'punnett-1', prompt: `A breeder asks: two ${pet.dom} ${pet.who}, both ${Dr}, are expecting. ${D} (${pet.dom}) is dominant to ${r} (${pet.rec}). What’s the chance a baby is ${want}?`,
    label: 'Chance', unit: PCT, answer: pct, start: 0, min: 0, max: 100, step: 5, jump: 25,
    win: `Each box is one equally likely outcome, so each is 25%. ${fix1}`,
    nope: value => diagnose(pct, value, PCT, slips[ask], fix1),
    scene: { layout: 'punnett', given: [['Parent 1', Dr], ['Parent 2', Dr]], square: { top: [D, r], side: [D, r], boxes, key: `${D} dominant · ${r} recessive` } },
  }

  const N = rand.pick([12, 16, 20, 24, 28, 32, 36, 40]), a = N * pct / 100
  const fix2 = `${pct}% of ${N} = ${pct} ÷ 100 × ${N} = ${a}.`
  const t2: GeneTask = {
    id: 'punnett-2', prompt: `Over the years the breeder has had ${N} ${pet.unit} from ${Dr} × ${Dr} parents. How many would you expect to be ${want.replace(', like its parents', '')}?`,
    label: pet.unit === 'pups' ? 'Pups' : 'Kittens', unit: pet.unit, answer: a, start: 0, min: 0, max: N, step: 1, jump: 5,
    win: `Expected number = probability × total. ${fix2}`,
    nope: value => diagnose(a, value, pet.unit, [
      [pct, `That’s the percentage, not ${pet.unit}. Find ${pct}% OF ${N}.`],
      [N - a, `That’s the ${pet.unit} that AREN’T ${what}. Find the ${pct}%.`],
      [N, `That’s all ${N}. Only ${pct}% are ${what}.`],
      [k, `That’s the number of boxes. Turn it into ${pet.unit}: ${pct}% of ${N}.`],
    ], fix2),
    scene: { layout: 'crowd', given: [[pet.unit === 'pups' ? 'Pups' : 'Kittens', `${N}`], ['Chance', `${pct}%`]], crowd: { total: N, icon: pet.icon, tint: ask === 'dom' ? 'dd' : ask, key: what } },
  }

  const right = 'Phenotype'
  const shown = `${pet.rec} ${pet.one}’s ${pet.what}`
  return {
    id: 'punnett', title: 'Round 2 · The breeder’s call', headline: 'Punnett squares',
    why: `You get one allele from each parent. Write one parent’s alleles across the top of a Punnett square and the other’s down the side, then fill each box with one from each. A dominant allele (capital letter) shows even if there’s only one. A recessive allele (small letter) only shows with two copies. Each of the 4 boxes is equally likely: 25% each.`,
    tasks: [t1, t2],
    side: {
      prompt: `A ${shown} is its…`, answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'Genotype', label: 'Genotype', nope: `The genotype is the alleles, like ${rr}. The feature you can SEE is the phenotype.` },
        { value: 'Allele', label: 'Allele', nope: `An allele is one version of a gene, like ${r}. The feature you can see is the phenotype.` },
        { value: 'Gamete', label: 'Gamete', nope: 'A gamete is a sex cell (sperm or egg). The feature you can see is the phenotype.' },
      ], { count: 4 }),
      why: `Phenotype = the characteristic you can see. Genotype = the alleles behind it, here ${rr}.`,
    },
    chain: [
      { line: `P = \\frac{[[k:${k}]]}{[[t:4]]}` },
      { line: `P = [[p:${pct}\\%]]`, op: '× 100', merge: { p: ['k', 't'] }, why: `${k} of the 4 boxes is ${pct}%.` },
      { line: `[[p:${pct}\\%]] \\text{ of } [[n:${N}]]`, op: 'Of them all', why: `The breeder has had ${N} ${pet.unit}.` },
      { line: `[[a:${a}]]\\,\\text{${pet.unit}}`, op: 'Multiply', merge: { a: ['p', 'n'] }, why: `${pct} ÷ 100 × ${N} = ${a} ${pet.unit}. Expected, not guaranteed: chance is chance.` },
    ],
  }
}

/** Round 3: cystic fibrosis (recessive) in a carrier × carrier family, then polydactyly (dominant). */
function disorderRound(rand: Rand): GeneRound {
  const ask = rand.pick(['rr', 'het', 'not'] as const)
  const k = { rr: 1, het: 2, not: 3 }[ask], pct = k * 25
  const phr = { rr: 'has cystic fibrosis', het: 'is a carrier, like them', not: 'does NOT have cystic fibrosis' }[ask]
  const what = { rr: 'ff (cystic fibrosis)', het: 'Ff (carriers)', not: 'FF or Ff (no cystic fibrosis)' }[ask]
  const boxes = cross(['F', 'f'], ['F', 'f'], kind => ask === 'not' ? kind !== 'rr' : kind === ask)
  const fix1 = `${k} of the 4 boxes ${k === 1 ? 'is' : 'are'} ${what}: ${pct}%.`
  const slips1: Record<typeof ask, [number, string][]> = {
    rr: [[50, `50% is the carriers (Ff). Cystic fibrosis needs ff: two recessive alleles.`], [75, `75% is the babies WITHOUT cystic fibrosis.`], [0, `Carriers don’t have it, but each can pass on f, so ff can happen.`], [100, `Only the ff box has cystic fibrosis.`]],
    het: [[25, `That’s one box. Ff turns up in 2 of the 4 boxes.`], [75, `That’s everyone without cystic fibrosis, FF too. Carriers are only Ff.`], [100, `Not every baby is Ff: FF and ff happen too.`], [0, `Ff is in 2 boxes.`]],
    not: [[25, `That’s the chance of HAVING it (ff). The other 3 boxes don’t.`], [50, `You only counted Ff. FF babies don’t have it either.`], [100, `ff can still happen: 1 box in 4.`], [0, `Only ff has it. Count the other boxes.`]],
  }
  const t1: GeneTask = {
    id: 'cf-1', prompt: `Baby Zara’s screen shows she carries cystic fibrosis. Her parents are both carriers (Ff); it’s caused by a recessive allele, f. What’s the chance their next baby ${phr}?`,
    label: 'Chance', unit: PCT, answer: pct, start: 0, min: 0, max: 100, step: 5, jump: 25,
    win: `Each parent passes on F or f, half and half. ${fix1}`,
    nope: value => diagnose(pct, value, PCT, slips1[ask], fix1),
    scene: { layout: 'punnett', given: [['Mum', 'Ff'], ['Dad', 'Ff']], square: { top: ['F', 'f'], side: ['F', 'f'], boxes, key: 'f = cystic fibrosis allele' } },
  }

  const dadHas = rand.chance(0.5), has = dadHas ? 'Dad' : 'Mum', hasnt = dadHas ? 'Mum' : 'Dad'
  const fix2 = `Pp × pp gives Pp, Pp, pp, pp: 2 of 4 boxes have P, so 50%.`
  const t2: GeneTask = {
    id: 'poly-1', prompt: `Next case. ${has} has polydactyly (an extra finger or toe), genotype Pp. ${hasnt} is pp. It’s caused by a DOMINANT allele, P. What’s the chance their baby has it?`,
    label: 'Chance', unit: PCT, answer: 50, start: 0, min: 0, max: 100, step: 5, jump: 25,
    win: `One P is enough, because it’s dominant. ${fix2}`,
    nope: value => diagnose(50, value, PCT, [
      [25, `You treated it like a recessive disorder. One P is enough: count every box with a P.`],
      [75, `That would be Pp × Pp. Here ${hasnt} is pp, so only 2 boxes get a P.`],
      [100, `${has} is Pp, not PP: half of ${dadHas ? 'his' : 'her'} gametes carry p.`],
      [0, `${has} can pass on P, and one copy is enough to have polydactyly.`],
    ], fix2),
    scene: { layout: 'punnett', given: [[has, 'Pp'], [hasnt, 'pp']], square: { top: ['P', 'p'], side: ['p', 'p'], boxes: cross(['p', 'p'], ['P', 'p'], kind => kind === 'het'), key: 'P = polydactyly allele' } },
  }

  const right = 'They have one faulty allele but don’t have the disorder'
  return {
    id: 'disorder', title: 'Round 3 · Family clinic', headline: 'Inherited disorders',
    why: `Some disorders are inherited. Cystic fibrosis is caused by a recessive allele, so you only have it with two copies (ff). Someone with one copy (Ff) is a carrier: healthy, but able to pass it on. Polydactyly (extra fingers or toes) is caused by a dominant allele, so one copy (Pp) is enough. Embryo screening can test for disorders like these, which raises big ethical questions.`,
    tasks: [t1, t2],
    workingOn: 0,
    side: {
      prompt: 'Zara’s parents ask what being a “carrier” means.', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'They have cystic fibrosis, just mildly', label: 'They have cystic fibrosis, just mildly', nope: 'Carriers don’t have it at all. It’s recessive, so with one f they’re healthy, but they can pass f on.' },
        { value: 'They have two faulty alleles (ff)', label: 'They have two faulty alleles (ff)', nope: 'ff means you HAVE cystic fibrosis. A carrier is Ff: one faulty allele.' },
        { value: 'Every baby they have will be ill', label: 'Every baby they have will be ill', nope: 'Only 1 box in 4 is ff. There’s a 25% chance each time, not 100%.' },
      ], { count: 4 }),
      why: `A carrier has one recessive allele (Ff). It’s hidden by the dominant F, so they’re healthy, but they can pass f on.`,
    },
    chain: [
      { line: `\\text{Ff} \\times \\text{Ff} \\to \\text{FF},\\ \\text{Ff},\\ \\text{Ff},\\ \\text{ff}` },
      { line: `P = \\frac{[[k:${k}]]}{[[t:4]]}`, op: 'Count the boxes', why: `${k} of the 4 boxes ${k === 1 ? 'is' : 'are'} ${what}.` },
      { line: `P = [[p:${pct}\\%]]`, op: '× 100', merge: { p: ['k', 't'] }, why: `${k} ÷ 4 × 100 = ${pct}%. The same chance for every baby they have.` },
    ],
  }
}

/** Round 4: XX × XY → the chance of a boy (or girl), then the number expected on a busy maternity ward. */
function sexRound(rand: Rand): GeneRound {
  const boy = rand.chance(0.5), sex = boy ? 'boy' : 'girl', g = boy ? 'XY' : 'XX'
  const fix1 = `2 of the 4 boxes are ${g}: 2 ÷ 4 = 50%.`
  const t1: GeneTask = {
    id: 'sex-1', prompt: `A couple want to know: what’s the chance their baby is a ${sex}?`,
    label: 'Chance', unit: PCT, answer: 50, start: 0, min: 0, max: 100, step: 5, jump: 25,
    win: `Mum always gives an X. Dad gives X or Y, half and half. ${fix1}`,
    nope: value => diagnose(50, value, PCT, [
      [25, `That’s one box. ${g} turns up in 2 of the 4 boxes.`],
      [75, `Only 2 boxes are ${g}, not 3.`],
      [100, `Dad’s sperm carry X OR Y, so it’s not certain.`],
      [0, `${g} is in 2 boxes. It can definitely happen!`],
    ], fix1),
    scene: { layout: 'punnett', given: [['Mum', 'XX'], ['Dad', 'XY']], square: { top: ['X', 'Y'], side: ['X', 'X'], boxes: cross(['X', 'X'], ['X', 'Y'], kind => kind === sex), key: 'XX girl · XY boy' } },
  }

  const N = rand.pick([20, 24, 30, 36, 40]), a = N / 2, plural = `${sex}s`
  const fix2 = `50% of ${N} = ${N} ÷ 2 = ${a}.`
  const t2: GeneTask = {
    id: 'sex-2', prompt: `${N} babies are born on the maternity ward this week. How many would you expect to be ${plural}?`,
    label: boy ? 'Boys' : 'Girls', unit: plural, answer: a, start: 0, min: 0, max: N, step: 1, jump: 5,
    win: `Each baby has a 50% chance, so expect about half. ${fix2}`,
    nope: value => diagnose(a, value, plural, [
      [50, `That’s the percentage. Find 50% OF ${N} babies.`],
      [N, `That’s every baby. Only half are expected to be ${plural}.`],
      [N / 4, `That’s a quarter. ${g} is 2 boxes of 4: a half.`],
      [N * 2, `You doubled. Half the babies: ${N} ÷ 2.`],
    ], fix2),
    scene: { layout: 'crowd', given: [['Babies', `${N}`], ['Chance', '50%']], crowd: { total: N, icon: '👶', tint: sex, key: `${plural} (${g})` } },
  }

  const right = 'A mutation made some bacteria resistant; they survive the antibiotic and breed'
  return {
    id: 'sex', title: 'Round 4 · Maternity ward', headline: 'Boy or girl?',
    why: `One of the 23 pairs of chromosomes decides sex. Females are XX; males are XY. Every egg carries an X. Half of sperm carry X and half carry Y. So every baby has a 50% chance of being a boy, and a 50% chance of being a girl.`,
    tasks: [t1, t2],
    side: {
      prompt: 'Bad news from the ward lab: MRSA. Why are bacteria like this becoming antibiotic-resistant?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'The antibiotic teaches the bacteria to resist it', label: 'The antibiotic teaches the bacteria to resist it', nope: 'Bacteria can’t learn. Random mutations make a few resistant. The antibiotic kills the rest, so the resistant ones survive and breed: natural selection.' },
        { value: 'Bacteria choose to change their DNA', label: 'Bacteria choose to change their DNA', nope: 'Mutations are random, not chosen. The resistant ones simply survive the antibiotic and reproduce.' },
        { value: 'Patients become immune to the antibiotic', label: 'Patients become immune to the antibiotic', nope: 'It’s the BACTERIA that become resistant, not the patients. Resistant bacteria survive and breed.' },
      ], { count: 4 }),
      why: `That’s natural selection. Random mutations make a few bacteria resistant. The antibiotic kills the others, so the resistant ones survive, reproduce and spread. That’s why doctors don’t hand out antibiotics for nothing.`,
    },
    chain: [
      { line: `\\text{XX} \\times \\text{XY} \\to \\text{XX},\\ \\text{XY},\\ \\text{XX},\\ \\text{XY}` },
      { line: `P(\\text{${sex}}) = \\frac{[[k:2]]}{[[t:4]]}`, op: `Count ${g}`, why: `2 of the 4 boxes are ${g}.` },
      { line: `P(\\text{${sex}}) = [[h:\\frac{1}{2}]]`, op: 'Simplify', merge: { h: ['k', 't'] }, why: `2 out of 4 is a half: 50%.` },
      { line: `[[h:\\frac{1}{2}]] \\times [[n:${N}]]`, op: 'Of the ward', why: `${N} babies, each with a 50% chance.` },
      { line: `[[a:${a}]]\\,\\text{${plural}}`, op: 'Multiply', merge: { a: ['h', 'n'] }, why: `${N} ÷ 2 = ${a} ${plural} expected. The real number will be close, not exact.` },
    ],
  }
}

/** Round 5 (boss): a carrier × carrier study group. The 3 : 1 ratio as a number of babies, then the heterozygous ones. */
function bossRound(rand: Rand): GeneRound {
  const cf = rand.chance(0.5)
  const A = cf ? 'F' : 'P', a = A.toLowerCase(), Aa = A + a, AA = A + A, aa = a + a
  const N = rand.pick([20, 24, 28, 32, 36, 40]), three = N * 3 / 4, one = N / 4, het = N / 2
  const big = cf ? 'NOT to have cystic fibrosis' : 'to have polydactyly'
  const bigWho = cf ? 'unaffected' : 'with polydactyly', oneWho = cf ? 'with cystic fibrosis' : 'without polydactyly'
  const parents = cf ? `both carry cystic fibrosis (${Aa} × ${Aa})` : `both have polydactyly (${Aa} × ${Aa})`
  const fix1 = `${AA}, ${Aa}, ${Aa} : ${aa} is 3 : 1, so 3 out of every 4. ${N} ÷ 4 × 3 = ${three}.`
  const t1: GeneTask = {
    id: 'boss-1', prompt: `The big case. In the study, ${N} newborns have parents who ${parents}. How many would you expect ${big}?`,
    label: 'Newborns', unit: 'newborns', answer: three, start: 0, min: 0, max: N, step: 1, jump: 5,
    win: `Three boxes have a dominant ${A}, so the ratio is 3 ${bigWho} : 1 ${oneWho}. ${fix1}`,
    nope: value => diagnose(three, value, 'newborns', [
      [one, `That’s the ${aa} babies, the 1 in 3 : 1. ${cf ? 'They have cystic fibrosis.' : 'They don’t have polydactyly.'} Count the other 3 boxes.`],
      [het, `That’s just the ${Aa} babies. ${AA} babies are ${bigWho} too.`],
      [3, `That’s the ratio, not babies. 3 out of every 4 of the ${N}.`],
      [75, `That’s the percentage. Turn it into babies: 75% of ${N}.`],
      [N, `That’s everyone. ${aa} babies are ${oneWho}.`],
      [N / 3, `You split ${N} into 3 parts. A 3 : 1 ratio has 4 parts: ${N} ÷ 4 × 3.`],
    ], fix1),
    scene: { layout: 'crowd', given: [['Parents', `${Aa} × ${Aa}`], ['Newborns', `${N}`]], crowd: { total: N, icon: '👶', tint: 'dd', key: `${bigWho} (${AA} or ${Aa})` } },
  }

  const fix2 = `${Aa} fills 2 of the 4 boxes: ${N} ÷ 4 × 2 = ${het}.`
  const t2: GeneTask = {
    id: 'boss-2', prompt: `How many of the ${N} would you expect to be heterozygous (${Aa}), like their parents?`,
    label: 'Newborns', unit: 'newborns', answer: het, start: 0, min: 0, max: N, step: 1, jump: 5,
    win: `Heterozygous means two different alleles. ${fix2}`,
    nope: value => diagnose(het, value, 'newborns', [
      [one, `That’s one box’s worth: the ${AA} babies, or the ${aa}. ${Aa} fills 2 boxes.`],
      [three, `That’s everyone with a ${A}, ${AA} included. ${AA} is homozygous: two the same.`],
      [2, `That’s the number of boxes. 2 of 4 is half of ${N}.`],
      [50, `That’s the percentage. Turn it into babies: 50% of ${N}.`],
      [N, `Not all of them: ${AA} and ${aa} are homozygous.`],
    ], fix2),
    scene: { layout: 'crowd', given: [['Parents', `${Aa} × ${Aa}`], ['Newborns', `${N}`]], crowd: { total: N, icon: '👶', tint: 'het', key: `heterozygous (${Aa})` } },
  }

  const homo = rand.chance(0.5), shown = homo ? rand.pick([AA, aa]) : Aa
  const right = homo ? 'Homozygous' : 'Heterozygous'
  const wrongs = [
    homo
      ? { value: 'Heterozygous', label: 'Heterozygous', nope: `Heterozygous means two DIFFERENT alleles, like ${Aa}. ${shown} has two the same: homozygous.` }
      : { value: 'Homozygous', label: 'Homozygous', nope: `Homozygous means two the SAME, like ${AA} or ${aa}. ${Aa} has two different: heterozygous.` },
    { value: 'Phenotype', label: 'Phenotype', nope: `The phenotype is what you can see. ${shown} is a genotype, and it has ${homo ? 'two the same alleles: homozygous' : 'two different alleles: heterozygous'}.` },
    { value: 'Recessive', label: 'Recessive', nope: `Recessive describes one allele (${a}), not a pair. ${shown} has ${homo ? 'two the same: homozygous' : 'two different: heterozygous'}.` },
  ]
  return {
    id: 'boss', title: 'Round 5 · The big case', headline: 'Ratios in a family',
    why: `A Punnett square shows the chances, and a ratio compares them. ${Aa} × ${Aa} gives ${AA}, ${Aa}, ${Aa}, ${aa}: that’s 3 with a dominant ${A} to 1 without, a 3 : 1 ratio. Two the same alleles (${AA} or ${aa}) is homozygous. Two different (${Aa}) is heterozygous. To use a ratio, split the total into 4 equal parts.`,
    tasks: [t1, t2],
    side: {
      prompt: `A baby’s report reads ${shown}. Which word describes that genotype?`, answer: right,
      choices: options<string>(rand, { value: right, label: right }, wrongs, { count: 4 }),
      why: homo ? `${shown} has two copies of the same allele, so it’s homozygous.` : `${Aa} has two different alleles, so it’s heterozygous.`,
    },
    chain: [
      { line: `\\text{${AA}, ${Aa}, ${Aa} : ${aa}} = 3 : 1` },
      { line: `\\frac{[[k:3]]}{[[t:4]]} \\times [[n:${N}]]`, op: '3 parts of 4', why: `3 of every 4 babies are ${bigWho}.` },
      { line: `[[b:${three}]]\\,\\text{${cf ? 'unaffected' : 'with polydactyly'}}`, op: 'Multiply', merge: { b: ['k', 't', 'n'] }, why: `${N} ÷ 4 = ${n(one)}, × 3 = ${three}.` },
      { line: `\\frac{[[h:2]]}{[[q:4]]} \\times [[m:${N}]]`, op: `Now ${Aa}`, why: `${Aa} fills 2 of the 4 boxes.` },
      { line: `[[c:${het}]]\\,\\text{heterozygous}`, op: 'Multiply', merge: { c: ['h', 'q', 'm'] }, why: `${N} ÷ 4 × 2 = ${n(het)}. The other ${n(one * 2)} are homozygous.` },
    ],
  }
}

export function makeRounds(rand: Rand): GeneRound[] {
  return [genomeRound(rand), punnettRound(rand), disorderRound(rand), sexRound(rand), bossRound(rand)]
}
