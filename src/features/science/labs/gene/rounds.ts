import { options, type Rand } from '../../../maths/labs/kit/random'
import { diagnose, type Task } from '../kit/types'
import type { PlayRound, PlayTask, TileTask } from '../kit/tiles'

/*
 * Creature Breeder (Gene Detective): Dr Mensah's genomics lab breeds Blobbits, a fast-breeding
 * model creature, then takes the same genetics to NHS cases (AQA Trilogy 4.6, Foundation).
 * The move is genetics itself: tap alleles into Punnett squares, work out a parent's genotype from
 * its baby, then predict a clutch and watch it hatch. Numbers are picked so every prediction is whole.
 */

export type TraitId = 'colour' | 'glow' | 'sex' | 'cf' | 'poly'

export type Scene = {
  layout: 'square' | 'deduce' | 'clutch'
  trait: TraitId
  /** The cross: the top parent's two alleles (across the columns) and the side parent's (down the rows). */
  top: [string, string]
  side: [string, string]
  /** Who the parents are, for the labels: "Mum", "Dad", "Blobbit A". */
  names: [string, string]
  /** Deduce: the baby whose look gives the parent away. */
  baby?: string
  /** Clutch: how many eggs/babies, the chance each one is the kind asked about, and that kind's genotypes. */
  clutch?: { total: number; p: number; kinds: string[]; ask: string }
}
export type GeneTask = PlayTask<Scene>
export type GeneRound = PlayRound<Scene>

/** A genotype, dominant allele first (Gg, not gG); X before Y. */
export function genotype(a: string, b: string) {
  const rank = (s: string) => s === 'X' ? 0 : s === 'Y' ? 1 : s === s.toUpperCase() ? 0 : 1
  return [a, b].sort((p, q) => rank(p) - rank(q) || p.localeCompare(q)).join('')
}
/** The four boxes, row by row: side allele (row) with top allele (column). */
export const boxesOf = (top: [string, string], side: [string, string]) => side.flatMap(s => top.map(t => genotype(s, t)))
const BOX_NAMES = ['top-left box', 'top-right box', 'bottom-left box', 'bottom-right box']

/** Fill the square: the tile task, with a per-box diagnosis. */
function fillSquare(id: string, prompt: string, scene: Scene, palette: string[]): TileTask<Scene> {
  const answer = boxesOf(scene.top, scene.side)
  return {
    kind: 'tiles', id, prompt, label: 'Punnett square', slots: BOX_NAMES, palette: palette.map(value => ({ value })), answer,
    win: `Each box takes one allele from its row and one from its column: ${answer.join(', ')}.`,
    nope: picked => {
      const wrong = picked.flatMap((tile, index) => tile !== answer[index] ? [index] : [])
      const i = wrong[0], row = Math.floor(i / 2), col = i % 2
      const more = wrong.length > 1 ? ` ${wrong.length} boxes need fixing.` : ''
      return `The ${BOX_NAMES[i]} gets ${scene.side[row]} from its row and ${scene.top[col]} from its column, so it’s ${answer[i]}, not ${picked[i]}.${more}`
    },
    scene,
  }
}

/** % chance from the boxes: k boxes out of 4. */
function percentTask(id: string, prompt: string, label: string, k: number, scene: Scene, what: string): Task<Scene> {
  const p = k * 25
  const fix = `${k} of the 4 boxes ${k === 1 ? 'is' : 'are'} ${what}: ${k} ÷ 4 × 100 = ${p}%.`
  return {
    id, prompt, label, unit: '%', answer: p, start: 0, min: 0, max: 100, step: 5, jump: 25,
    win: `Each box is a 1 in 4 chance, so each box is 25%. ${fix}`,
    nope: value => diagnose(p, value, '%', [
      [k, `That’s the number of boxes. Each box is 25%, so × 25.`],
      [100 - p, `That’s the OTHER kind of baby. Count the boxes that are ${what}.`],
      [k * 100 / 3, `There are 4 boxes, not 3. Divide by 4.`],
    ], fix),
    scene,
  }
}

/** How many of a clutch: total × k / 4. */
function countTask(id: string, prompt: string, label: string, unit: string, k: number, total: number, scene: Scene, what: string): Task<Scene> {
  const e = total * k / 4
  const fix = `${k} in 4 are ${what}, so ${total} ÷ 4 × ${k} = ${e}.`
  return {
    id, prompt, label, unit, answer: e, start: 0, min: 0, max: total, step: 1, jump: 5,
    win: `Expected, not guaranteed: chance is random, but it lands close. ${fix}`,
    nope: value => diagnose(e, value, unit, [
      [k, `That’s boxes, not ${unit}. Scale it up to ${total}.`],
      [total - e, `That’s the other kind. Count the ${what} boxes.`],
      [total / k, `You divided by ${k}. It’s ${k} out of every 4: ÷ 4, then × ${k}.`],
      [total * k / 2, `There are 4 boxes, so ÷ 4, not ÷ 2.`],
    ], fix),
    scene,
  }
}

const count = (top: [string, string], side: [string, string], kinds: string[]) => boxesOf(top, side).filter(g => kinds.includes(g)).length
const shuffle2 = (rand: Rand, g: string): [string, string] => rand.shuffle([g[0], g[1]]) as [string, string]

/** Round 1: green Gg × gold gg. Fill the square, then the % chance of gold. */
function clutchRound(rand: Rand): GeneRound {
  const flip = rand.chance(0.5)
  const top = shuffle2(rand, flip ? 'Gg' : 'gg'), side = shuffle2(rand, flip ? 'gg' : 'Gg')
  const names: [string, string] = flip ? ['Green', 'Gold'] : ['Gold', 'Green']
  const base: Scene = { layout: 'square', trait: 'colour', top, side, names }
  const k = count(top, side, ['gg'])
  const t1 = fillSquare('clutch-1', 'Fill the Punnett square. Tap the genotype for each box.', base, ['GG', 'Gg', 'gg'])
  const t2 = percentTask('clutch-2', 'What’s the chance a baby is gold?', 'Chance of gold', k, { ...base, layout: 'clutch', clutch: { total: 100, p: k / 4, kinds: ['gg'], ask: 'gold' } }, 'gg (gold)')
  const right = 'A different version of the same gene'
  return {
    id: 'clutch', title: 'Round 1 · First clutch', headline: 'Alleles and the Punnett square',
    why: `Genes come in versions called alleles. A big letter is dominant: one G makes a Blobbit green. Gold only shows with two small g’s (gg). Each parent passes on ONE allele, so each box in the square takes one from its row and one from its column.`,
    tasks: [t1, t2],
    side: {
      prompt: 'What is an allele?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'A whole chromosome', label: 'A whole chromosome', nope: 'A chromosome carries hundreds of genes. An allele is one version of ONE gene.' },
        { value: 'A type of cell', label: 'A type of cell', nope: 'Alleles are inside the DNA, not cells. An allele is a version of a gene, like G or g.' },
        { value: 'A protein made by a gene', label: 'A protein made by a gene', nope: 'Genes code for proteins, but an allele is a VERSION of the gene itself, like G or g.' },
      ], { count: 4 }),
      why: `An allele is a version of a gene. G (green) and g (gold) are two alleles of the colour gene.`,
    },
    chain: [
      { line: `\\text{gold (gg) boxes} = [[k:${k}]] \\text{ of } [[f:4]]` },
      { line: `\\frac{[[k:${k}]]}{[[f:4]]} \\times 100`, op: 'Make it a %', why: `A chance out of 4 boxes, turned into a percentage.` },
      { line: `[[p:${k * 25}]]\\%`, op: 'Work it out', merge: { p: ['k', 'f'] }, why: `${k} ÷ 4 × 100 = ${k * 25}%. Half the clutch, on average.` },
    ],
  }
}

/** Round 2: two green parents had a gold baby. What's a green parent's genotype? Then predict a clutch. */
function deduceRound(rand: Rand): GeneRound {
  const top: [string, string] = ['G', 'g'], side: [string, string] = ['G', 'g']
  const base: Scene = { layout: 'deduce', trait: 'colour', top, side, names: ['Blobbit A', 'Blobbit B'], baby: 'gg' }
  const t1: TileTask<Scene> = {
    kind: 'tiles', id: 'deduce-1', prompt: 'Two GREEN parents had a GOLD baby. What is Blobbit A’s genotype?',
    label: 'Blobbit A’s genotype', slots: ['first allele', 'second allele'], palette: [{ value: 'G' }, { value: 'g' }], answer: ['G', 'g'], anyOrder: true,
    win: `The gold baby is gg, so it got a g from EACH parent. Blobbit A is green, so it also has a G: Gg.`,
    nope: picked => {
      const g = genotype(picked[0], picked[1])
      return g === 'GG'
        ? `A GG parent can only pass on G, so it couldn’t give the baby a g. The gold baby (gg) needs a g from each parent: Blobbit A is Gg.`
        : `gg would make Blobbit A gold, but it’s green. It needs one G to look green, and one g to pass on: Gg.`
    },
    scene: base,
  }
  const total = rand.pick([12, 20, 24, 40, 60, 80])
  const k = 1
  const t2 = countTask('deduce-2', `Gg × Gg again. Out of ${total} eggs, how many should hatch gold?`, 'Gold babies', 'eggs', k, total,
    { ...base, layout: 'clutch', clutch: { total, p: 1 / 4, kinds: ['gg'], ask: 'gold' } }, 'gg (gold)')
  const right = 'What it looks like'
  return {
    id: 'deduce', title: 'Round 2 · Who’s hiding gold?', headline: 'Genotype from the babies',
    why: `Genotype is the alleles (Gg). Phenotype is what you see (green). A green Blobbit could be GG or Gg: you can’t tell by looking. But a gold baby must be gg, so BOTH parents had a g to give. That gives them away.`,
    tasks: [t1, t2],
    side: {
      prompt: 'What does “phenotype” mean?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'The alleles it has', label: 'The alleles it has', nope: 'That’s the genotype (like Gg). Phenotype is what it looks like (green).' },
        { value: 'Two identical alleles', label: 'Two identical alleles', nope: 'That’s homozygous (GG or gg). Phenotype is what it looks like.' },
        { value: 'Where a gene sits on a chromosome', label: 'Where a gene sits on a chromosome', nope: 'Phenotype is the characteristic you can see, like green or gold.' },
      ], { count: 4 }),
      why: `Phenotype is the characteristic you see (green or gold). Genotype is the alleles behind it (GG, Gg or gg).`,
    },
    workingOn: 1,
    chain: [
      { line: `\\text{gold (gg) boxes} = [[k:1]] \\text{ of } [[f:4]]` },
      { line: `\\text{gold} = [[n:${total}]] \\div [[f:4]] \\times [[k:1]]`, op: 'Scale up', why: `1 in every 4 eggs, across ${total} eggs.` },
      { line: `\\text{gold} = [[e:${total / 4}]]\\text{ eggs}`, op: 'Work it out', merge: { e: ['n', 'f', 'k'] }, why: `${total} ÷ 4 = ${total / 4}. Hatch them and you’ll get close to that, not always exactly.` },
    ],
  }
}

/** Round 3: glowing is recessive. Nn × Nn or Nn × nn: fill the square, then % that look normal. */
function glowRound(rand: Rand): GeneRound {
  const pair: [string, string] = rand.pick([['Nn', 'Nn'], ['Nn', 'nn'], ['nn', 'Nn']] as [string, string][])
  const top = shuffle2(rand, pair[0]), side = shuffle2(rand, pair[1])
  const look = (g: string) => g === 'nn' ? 'Glowing' : 'Normal'
  const base: Scene = { layout: 'square', trait: 'glow', top, side, names: [look(pair[0]), look(pair[1])] }
  const k = count(top, side, ['NN', 'Nn'])
  const t1 = fillSquare('glow-1', 'Glowing is recessive (nn). Fill the square.', base, ['NN', 'Nn', 'nn'])
  const t2 = percentTask('glow-2', 'What % of the babies will look NORMAL?', 'Normal-looking', k,
    { ...base, layout: 'clutch', clutch: { total: 100, p: k / 4, kinds: ['NN', 'Nn'], ask: 'normal' } }, 'NN or Nn (normal)')
  const right = 'Both parents carry a hidden n'
  return {
    id: 'glow', title: 'Round 3 · Glow-up', headline: 'Dominant hides recessive',
    why: `Glowing is recessive, so a Blobbit only glows if it’s nn. NN and Nn both look normal: the N hides the n. Count every box with at least one big N for the normal-looking babies.`,
    tasks: [t1, t2],
    side: {
      prompt: 'Two normal Blobbits have a glowing baby. How?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'A mutation, every time', label: 'A mutation, every time', nope: 'No need for a mutation. If both parents are Nn, there’s a 1 in 4 chance of nn.' },
        { value: 'Glowing must be dominant', label: 'Glowing must be dominant', nope: 'If glowing were dominant, a glowing parent would be needed. Recessive alleles can hide in Nn parents.' },
        { value: 'The baby copied its surroundings', label: 'The baby copied its surroundings', nope: 'Alleles are inherited, not copied from surroundings. Both parents were Nn and each gave an n.' },
      ], { count: 4 }),
      why: `Both parents are Nn: they look normal but each carries an n. If both pass on n, the baby is nn and glows.`,
    },
    chain: [
      { line: `\\text{normal (NN, Nn) boxes} = [[k:${k}]] \\text{ of } [[f:4]]` },
      { line: `\\frac{[[k:${k}]]}{[[f:4]]} \\times 100`, op: 'Make it a %', why: `Any box with a big N looks normal.` },
      { line: `[[p:${k * 25}]]\\%`, op: 'Work it out', merge: { p: ['k', 'f'] }, why: `${k} ÷ 4 × 100 = ${k * 25}%.` },
    ],
  }
}

/** Round 4: the NHS maternity ward. XX × XY, then boys expected out of N births. */
function sexRound(rand: Rand): GeneRound {
  const top: [string, string] = ['X', 'X']
  const side = rand.shuffle(['X', 'Y']) as [string, string]
  const base: Scene = { layout: 'square', trait: 'sex', top, side, names: ['Mum', 'Dad'] }
  const total = rand.pick([20, 30, 40, 50, 60, 80])
  const t1 = fillSquare('sex-1', 'Mum is XX, Dad is XY. Fill the square.', base, ['XX', 'XY'])
  const t2 = countTask('sex-2', `${total} babies are due this month. How many boys would you expect?`, 'Boys expected', 'babies', 2, total,
    { ...base, layout: 'clutch', clutch: { total, p: 1 / 2, kinds: ['XY'], ask: 'boys' } }, 'XY (boys)')
  const right = '23'
  return {
    id: 'sex', title: 'Round 4 · Maternity ward', headline: 'Boy or girl?',
    why: `Humans have 23 pairs of chromosomes. One pair decides sex: XX is female, XY is male. Mum’s eggs all carry an X. Half of Dad’s sperm carry X and half carry Y, so it’s Dad’s sperm that decides.`,
    tasks: [t1, t2],
    side: {
      prompt: 'Body cells have 46 chromosomes. How many are in a human egg cell?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: '46', label: '46', nope: 'Meiosis halves the number for sex cells: 46 ÷ 2 = 23. Then egg + sperm makes 46 again.' },
        { value: '92', label: '92', nope: 'If eggs had 92, every generation would double. Meiosis halves it: 23.' },
        { value: '2', label: '2', nope: 'An egg carries one of each pair: 23 chromosomes, including one sex chromosome (X).' },
      ], { count: 4 }),
      why: `Meiosis makes sex cells with one chromosome from each pair: 23. Egg (23) + sperm (23) = 46 again.`,
    },
    workingOn: 1,
    chain: [
      { line: `\\text{boy (XY) boxes} = [[k:2]] \\text{ of } [[f:4]]` },
      { line: `\\text{boys} = [[n:${total}]] \\div [[f:4]] \\times [[k:2]]`, op: 'Scale up', why: `2 in every 4 babies, across ${total} births.` },
      { line: `\\text{boys} = [[e:${total / 2}]]`, op: 'Work it out', merge: { e: ['n', 'f', 'k'] }, why: `${total} ÷ 4 × 2 = ${total / 2}. Half, as you’d expect.` },
    ],
  }
}

/** Round 5 (boss): an NHS family case from newborn screening. */
function caseRound(rand: Rand): GeneRound {
  const cases = [
    { trait: 'cf' as const, a: 'Ff', b: 'Ff', ask: 'have cystic fibrosis', kinds: ['ff'], what: 'ff (cystic fibrosis)', palette: ['FF', 'Ff', 'ff'], names: ['Mum', 'Dad'] },
    { trait: 'cf' as const, a: 'Ff', b: 'FF', ask: 'be a carrier', kinds: ['Ff'], what: 'Ff (carrier)', palette: ['FF', 'Ff', 'ff'], names: ['Mum', 'Dad'] },
    { trait: 'poly' as const, a: 'Dd', b: 'dd', ask: 'have an extra finger', kinds: ['DD', 'Dd'], what: 'Dd (polydactyly)', palette: ['DD', 'Dd', 'dd'], names: ['Mum', 'Dad'] },
  ]
  const c = rand.pick(cases)
  const top = shuffle2(rand, c.a), side = shuffle2(rand, c.b)
  const base: Scene = { layout: 'square', trait: c.trait, top, side, names: c.names as [string, string] }
  const k = count(top, side, c.kinds)
  const t1 = fillSquare('case-1', c.trait === 'cf' ? 'Cystic fibrosis is recessive (ff). Fill the square.' : 'Polydactyly is dominant (D). Fill the square.', base, c.palette)
  const t2 = percentTask('case-2', `What’s the chance their baby will ${c.ask}?`, 'Chance', k,
    { ...base, layout: 'clutch', clutch: { total: 100, p: k / 4, kinds: c.kinds, ask: c.ask.replace(/^(have|be) /, '') } }, c.what)
  const right = 'Has one faulty allele but no symptoms'
  return {
    id: 'case', title: 'Round 5 · The family case', headline: 'An NHS genomics case',
    why: c.trait === 'cf'
      ? `Cystic fibrosis is caused by a recessive allele, f. You need ff to have it. Ff parents are carriers: healthy, but each can pass on f. Same square, same counting, real family.`
      : `Polydactyly (an extra finger or toe) is caused by a DOMINANT allele, D. One D is enough: DD and Dd both have it. Same square, same counting, real family.`,
    tasks: [t1, t2],
    side: {
      prompt: 'In genetics, what is a “carrier”?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'Has the disorder badly', label: 'Has the disorder badly', nope: 'A carrier (Ff) has one recessive allele, so the dominant F hides it: no symptoms.' },
        { value: 'Has two faulty alleles', label: 'Has two faulty alleles', nope: 'Two faulty alleles (ff) means having the disorder. A carrier has just one (Ff).' },
        { value: 'Can catch it from others', label: 'Can catch it from others', nope: 'Inherited disorders aren’t caught. A carrier inherited one faulty allele and has no symptoms.' },
      ], { count: 4 }),
      why: `A carrier has one recessive allele (Ff). The dominant F hides it, so no symptoms, but they can pass f on.`,
    },
    chain: [
      { line: `\\text{${c.kinds.join(', ')} boxes} = [[k:${k}]] \\text{ of } [[f:4]]` },
      { line: `\\frac{[[k:${k}]]}{[[f:4]]} \\times 100`, op: 'Make it a %', why: `The counsellor gives the family the chance as a percentage.` },
      { line: `[[p:${k * 25}]]\\%`, op: 'Work it out', merge: { p: ['k', 'f'] }, why: `${k} ÷ 4 × 100 = ${k * 25}% for each pregnancy.` },
    ],
  }
}

export function makeRounds(rand: Rand): GeneRound[] {
  return [clutchRound(rand), deduceRound(rand), glowRound(rand), sexRound(rand), caseRound(rand)]
}
