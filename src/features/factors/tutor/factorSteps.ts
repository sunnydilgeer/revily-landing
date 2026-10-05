import { factorTreeWorking, primeFactors, vennWorking, type FactorSplit } from '../../written-methods/tutor/methodWorking'
import { line, part, says, sign, type StepLine, type StepWorking, type WorkedStep } from '../../written-methods/tutor/stepWorking'

/*
 * Lesson 7 workings, one move a step (src/features/EXPLANATIONS.md): a factor tree split one branch a step, factor and
 * multiple lists, and the prime-factor Venn diagram. Every product is written out, and the answer appears once, in green.
 */

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
export const power = (base: number | string, n: number) => n === 1 ? String(base) : `${base}${[...String(n)].map(d => SUP[Number(d)]).join('')}`
/** 60 → [[2, 2], [3, 1], [5, 1]]. */
const counts = (n: number) => [...primeFactors(n).reduce((m, p) => m.set(p, (m.get(p) ?? 0) + 1), new Map<number, number>())]
export const indexForm = (n: number) => counts(n).map(([p, k]) => power(p, k)).join(' × ')
const expanded = (n: number) => primeFactors(n).join(' × ')
const factorsOf = (n: number) => Array.from({ length: n }, (_, i) => i + 1).filter(d => n % d === 0)
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a
const lcmOf = (a: number, b: number) => a * b / gcd(a, b)

/** The factor tree split one branch a step, then the primes at the ends; `index` finishes in index form. */
export function treeSteps(value: number, index = true, answer = true): WorkedStep[] {
  const splits: FactorSplit[] = factorTreeWorking(value).steps.flatMap(step => step.frame.factorSplits ?? []).filter((s, i, all) => all.findIndex(t => t.value === s.value) === i)
  const tree = (upTo: number) => ({ kind: 'method' as const, method: 'factor-tree' as const, first: value, frame: { factorSplits: splits.slice(0, upTo) } })
  const steps: WorkedStep[] = splits.map((s, i) => ({
    title: `Split ${s.value}`, why: 'Split it into a prime times another factor. A branch stops when it ends in a prime.',
    picture: tree(i + 1), lines: [says(`${s.value} → ${s.left} × ${s.right}`)],
  }))
  const repeats = counts(value).filter(([, k]) => k > 1)
  const indexed = index && repeats.length > 0
  steps.push({ title: 'Collect the primes', why: 'Multiply the primes at the ends of the branches.', lines: [line([part(value)], expanded(value), { eq: true, answer: answer && !indexed })] })
  if (indexed) steps.push({
    title: 'Use powers', why: 'Write a repeated prime once, with a power for how many copies.',
    lines: [...repeats.map(([p, k]) => says(`${Array(k).fill(p).join(' × ')} → ${power(p, k)}`)), line([part(value)], indexForm(value), { eq: true, answer })],
  })
  return steps
}
const plainTree = (value: number) => ({ kind: 'method' as const, method: 'factor-tree' as const, first: value, frame: { factorSplits: [] } })
export const treeWorking = (value: number, index = true): StepWorking => ({ kind: 'step-worked', opening: plainTree(value), steps: treeSteps(value, index) })

/** Squaring a number in prime factors: write it twice, then collect each prime. */
export function squareWorking(value: number): StepWorking {
  const f = indexForm(value)
  return { kind: 'step-worked', trail: true, steps: [
    { title: 'Write it twice', why: 'Squaring means multiplying the number by itself.', lines: [line([part(`${value}²`)], `(${f}) × (${f})`, { eq: true })] },
    { title: 'Collect each prime', why: 'Put the copies of each prime together and count them.', lines: counts(value).map(([p, k]) => says(`${power(p, k)} × ${power(p, k)} → ${power(p, 2 * k)}`)) },
    { title: 'Write the answer', why: 'Multiply the powers of each prime.', lines: [line([part(`${value}²`)], counts(value).map(([p, k]) => power(p, 2 * k)).join(' × '), { eq: true, answer: true })] },
  ] }
}

/** The smallest k that makes value × k a square: every prime needs an even power. */
export function squareMakerWorking(value: number): StepWorking {
  const odd = counts(value).filter(([, k]) => k % 2)
  const k = odd.reduce((n, [p]) => n * p, 1)
  return { kind: 'step-worked', opening: plainTree(value), steps: [
    ...treeSteps(value, true, false),
    { title: 'Find odd powers', why: 'In a square number, every prime has an even power. One more copy of each odd one makes it even.', lines: odd.map(([p, n]) => says(`${power(p, n)} → ${power(p, n + 1)}`)) },
    { title: 'Multiply the extras', why: 'k is the product of the extra copies.', lines: [line(odd.flatMap(([p], i) => [...(i ? [sign('×')] : []), part(p, 3)]), k, { answer: true })] },
  ] }
}

const lists = (firstLabel: string, first: number[], secondLabel?: string, second?: number[], common?: number[]) =>
  ({ kind: 'method' as const, method: 'number-lists' as const, first: first[0], frame: { numberLists: { firstLabel, first, ...(secondLabel ? { secondLabel, second } : {}), ...(common ? { common } : {}) } } })

/** Listing: factors of both for the HCF, multiples of both for the LCM. `want` is what the question asks for. */
export function listSteps(a: number, b: number, want: 'hcf' | 'lcm' | 'both', answer = true): WorkedStep[] {
  const steps: WorkedStep[] = []
  const hcf = gcd(a, b), lcm = lcmOf(a, b)
  if (want !== 'lcm') {
    const fa = factorsOf(a), fb = factorsOf(b), common = fa.filter(x => fb.includes(x))
    steps.push({ title: `Factors of ${a}`, why: 'List every number that divides it exactly, in pairs from the outside in.', picture: lists(`Factors of ${a}`, fa) })
    steps.push({ title: `Factors of ${b}`, why: 'List its factors the same way.', picture: lists(`Factors of ${a}`, fa, `Factors of ${b}`, fb) })
    steps.push({ title: 'The highest in both', why: 'Mark the factors in both lists and take the highest.', picture: lists(`Factors of ${a}`, fa, `Factors of ${b}`, fb, common), lines: [line([part('HCF')], hcf, { eq: true, answer: answer && want === 'hcf' })] })
  }
  if (want !== 'hcf') {
    const ma = Array.from({ length: lcm / a }, (_, i) => a * (i + 1)), mb = Array.from({ length: lcm / b }, (_, i) => b * (i + 1))
    steps.push({ title: `Multiples of ${a}`, why: 'Count up in steps of the number.', picture: lists(`Multiples of ${a}`, ma) })
    steps.push({ title: `Multiples of ${b}`, why: 'Count up again, until a number is in both lists.', picture: lists(`Multiples of ${a}`, ma, `Multiples of ${b}`, mb) })
    steps.push({ title: 'The first in both', why: 'The first number in both lists is the lowest common multiple.', picture: lists(`Multiples of ${a}`, ma, `Multiples of ${b}`, mb, [lcm]), ...(want === 'both' ? { words: `HCF = ${hcf}, LCM = ${lcm}` } : { lines: [line([part('LCM')], lcm, { eq: true, answer: true })] }) })
  }
  return steps
}
export const listWorking = (a: number, b: number, want: 'hcf' | 'lcm' | 'both', given?: string): StepWorking => ({ kind: 'step-worked', given, steps: listSteps(a, b, want) })

/** The first few multiples of a number. */
export function multiplesList(value: number, count: number): StepWorking {
  const values = Array.from({ length: count }, (_, i) => value * (i + 1))
  return { kind: 'step-worked', steps: [{ title: `The ${value} times table`, why: 'Multiply the number by 1, 2, 3 and so on.', lines: values.map((v, i) => says(`${value} × ${i + 1} → ${v}`)), words: values.join(', ') }] }
}

/** The prime-factor Venn diagram: primes of each number, the shared ones in the middle, then HCF and/or LCM. */
export function vennSteps(a: number, b: number, want: 'hcf' | 'lcm' | 'both', labels: [string, string] = [String(a), String(b)]): WorkedStep[] {
  const old = vennWorking(a, b, labels).steps
  const venn = (i: number) => ({ kind: 'method' as const, method: 'venn' as const, first: a, frame: { venn: { ...old[i].frame.venn!, hcf: undefined, lcm: undefined } } })
  const { left, middle, right } = old[2].frame.venn!
  const product = (xs: number[]) => xs.reduce((n, x) => n * x, 1)
  const steps: WorkedStep[] = [
    { title: `Primes of ${labels[0]}`, why: 'Write it as a product of primes first.', picture: venn(0), lines: [line([part(labels[0])], expanded(a), { eq: true })] },
    { title: `Primes of ${labels[1]}`, why: 'Now the other number.', picture: venn(1), lines: [line([part(labels[1])], expanded(b), { eq: true })] },
    { title: 'Share the matches', why: 'A prime in both goes in the middle, once for each matching pair.', picture: venn(2), lines: [line([part('Middle:'), ...middle.flatMap((p, i) => [...(i ? [sign('×')] : []), part(p, 3)])])] },
  ]
  const hcfLine: StepLine = line(middle.flatMap((p, i) => [...(i ? [sign('×')] : []), part(p, 3)]), product(middle), { answer: want === 'hcf' })
  const all = [...left, ...middle, ...right]
  if (want !== 'lcm') steps.push({ title: 'Multiply the middle', why: 'The middle is what both numbers share: its product is the HCF.', picture: venn(2), lines: [hcfLine] })
  if (want !== 'hcf') steps.push({ title: 'Multiply them all', why: 'Every prime in the diagram, each once, gives the LCM.', picture: venn(2), lines: [line(all.flatMap((p, i) => [...(i ? [sign('×')] : []), part(p)]), product(all), { answer: want === 'lcm' })], ...(want === 'both' ? { words: `HCF = ${product(middle)}, LCM = ${product(all)}` } : {}) })
  return steps
}
export const vennStepsWorking = (a: number, b: number, want: 'hcf' | 'lcm' | 'both', labels?: [string, string]): StepWorking => ({ kind: 'step-worked', steps: vennSteps(a, b, want, labels) })

/** Cutting two ropes into the longest equal pieces: the HCF, then how many pieces each rope makes. */
export function ropesWorking(a: number, b: number): StepWorking {
  const h = gcd(a, b)
  const steps = listSteps(a, b, 'hcf', false)
  return { kind: 'step-worked', given: `${a} cm and ${b} cm`, steps: [...steps, {
    title: 'Count the pieces', why: 'Divide each rope by the piece length, then add.',
    lines: [says(`${a} ÷ ${h} → ${a / h}`), says(`${b} ÷ ${h} → ${b / h}`), says(`${a / h} + ${b / h} → ${a / h + b / h}`)], words: `${h} cm each; ${a / h + b / h} pieces`,
  }] }
}
