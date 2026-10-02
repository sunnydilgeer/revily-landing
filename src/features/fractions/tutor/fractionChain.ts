import type { ChainStep } from '../../maths/step-chain/StepChain'
import type { FractionFrame } from './fractionWorking'

/**
 * Worked fractions as one chain of working (see src/features/maths/step-chain/README.md).
 * Each builder takes the numbers of the question and returns every line, with a plain-words
 * `why` for each step: the reason for the move, not just the move.
 */

/** A line of working, optionally with the fraction picture to show from this step on. */
/** `note`: lines of working shown before the step's line ("17 ÷ 6 → 2 r 5"), so no number appears from nowhere. */
/**
 * `lists`: a step that finds the HCF or LCM shows the factors or multiples of each number, the ones in every list marked
 * and the one used (`pick`) boxed in purple. Such a step has no line of working of its own.
 */
export type NumberList = { label: string; values: number[]; shared: number[]; pick: number }
/** `focus`: the mixed numbers (by their whole number's key) on the line above that this step converts, boxed in purple. */
export type FractionChainStep = ChainStep & { frame?: FractionFrame; note?: string[]; lists?: NumberList[]; focus?: string[] }

type Term = { nk: string; dk: string; n: number; d: number }
export type WholeFraction = { whole?: number; numerator: number; denominator: number }

const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a)
const lcm = (a: number, b: number) => Math.abs(a * b) / gcd(a, b)
const k = (key: string, latex: string | number) => `[[${key}:${latex}]]`
const frac = (top: string, bottom: string) => `\\frac{${top}}{${bottom}}`
/** A fraction as plain text for the `why` sentences: 3/4, 2 1/2. */
const said = (n: number, d: number, whole?: number) => `${whole ? `${whole} ` : ''}${n}/${d}`
const factorsOf = (n: number) => Array.from({ length: n }, (_, i) => i + 1).filter(f => n % f === 0)
const multiplesUpTo = (n: number, limit: number) => Array.from({ length: limit / n }, (_, i) => n * (i + 1))

/** Why the divisor: the factors of the top and the bottom, the biggest one in both boxed. */
function hcfStep(n: number, d: number, factor: number): FractionChainStep {
  const top = factorsOf(n), bottom = factorsOf(d), shared = top.filter(f => bottom.includes(f))
  return {
    line: '',
    op: 'Find the HCF',
    why: 'List the factors of the top and the bottom. The biggest number in both lists is the highest common factor, so it is the biggest number you can divide both by.',
    lists: [{ label: `Factors of ${n}`, values: top, shared, pick: factor }, { label: `Factors of ${d}`, values: bottom, shared, pick: factor }],
  }
}

/** Why the common bottom: the multiples of each bottom up to the first one they share. */
function lcmStep(bottoms: number[], common: number): FractionChainStep {
  const distinct = [...new Set(bottoms)]
  const lists = distinct.map(b => multiplesUpTo(b, common))
  const shared = lists[0].filter(m => lists.every(list => list.includes(m)))
  return {
    line: '',
    op: 'Find the LCM',
    why: 'List the multiples of each bottom. The first number in every list is the lowest common multiple: the smallest number all the bottoms go into.',
    lists: distinct.map((b, i) => ({ label: `Multiples of ${b}`, values: lists[i], shared, pick: common })),
  }
}

/**
 * Simplify the fraction on the last line: ÷ HCF top and bottom, then work it out, then (for
 * answers) write a top-heavy fraction as a mixed number.
 */
function simplifyTail(term: Term, mixedAnswer: boolean): FractionChainStep[] {
  const steps: FractionChainStep[] = []
  let { nk, dk, n, d } = term
  const factor = gcd(n, d)
  if (factor > 1) {
    steps.push(hcfStep(n, d, factor))
    steps.push({
      line: `= ${frac(`${k(nk, n)} ${k('sp', `\\div ${factor}`)}`, `${k(dk, d)} ${k('sq', `\\div ${factor}`)}`)}`,
      op: 'Divide top and bottom',
      why: `${factor} is the biggest number that goes into both. Dividing the top and bottom by the same number keeps the fraction the same size.`,
    })
    const top = n / factor, bottom = d / factor
    steps.push({
      line: bottom === 1 ? `= ${k('sn', top)}` : `= ${frac(k('sn', top), k('sd', bottom))}`,
      op: 'Work out',
      why: bottom === 1 ? 'Anything over 1 is just itself.' : 'No number bigger than 1 goes into both, so it is fully simplified.',
      merge: bottom === 1 ? { sn: [nk, 'sp', dk, 'sq'] } : { sn: [nk, 'sp'], sd: [dk, 'sq'] },
    })
    if (bottom === 1) return steps
    nk = 'sn'; dk = 'sd'; n = top; d = bottom
  }
  if (mixedAnswer && n > d) {
    const whole = Math.floor(n / d), remainder = n % d
    steps.push({
      line: `= ${k('mw', whole)}${frac(k('mr', remainder), k(dk, d))}`,
      op: 'Write it mixed',
      why: 'Find how many wholes fit, and what is left over.',
      note: [`${n} ÷ ${d} → ${whole} r ${remainder}`],
      merge: { mw: [nk], mr: [nk] },
    })
  }
  return steps
}

export function simplifyChain(n: number, d: number): FractionChainStep[] {
  const tail = simplifyTail({ nk: 'n', dk: 'd', n, d }, false)
  return [{ line: frac(k('n', n), k('d', d)) }, ...(tail.length ? tail : [{
    line: `= ${frac(k('n', n), k('d', d))}`,
    op: 'Already fully simplified',
    why: 'No number bigger than 1 goes into both, so it cannot be simplified.',
  }])]
}

export function equivalentChain(n: number, d: number, target: number): FractionChainStep[] {
  const scale = target / d
  return [
    { line: frac(k('n', n), k('d', d)) },
    {
      line: `= ${frac(`${k('n', n)} ${k('p', `\\times ${scale}`)}`, `${k('d', d)} ${k('q', `\\times ${scale}`)}`)}`,
      op: 'Multiply top and bottom',
      why: `We need ${target} on the bottom. Multiply the top by the same number, so the fraction stays the same size.`,
      note: [`${target} ÷ ${d} → ${scale}`],
    },
    {
      line: `= ${frac(k('a', n * scale), k('b', target))}`,
      op: 'Work out',
      why: 'Multiply out the top and the bottom.',
      merge: { a: ['n', 'p'], b: ['d', 'q'] },
    },
  ]
}

export function mixedToImproperChain(whole: number, n: number, d: number): FractionChainStep[] {
  const parts = whole * d, improper = parts + n
  return [
    { line: `${k('w', whole)}${frac(k('n', n), k('d', d))}` },
    {
      line: `= ${frac(`${k('w', whole)} ${k('x', '\\times')} ${k('e', d)} ${k('pl', '+')} ${k('n', n)}`, k('d', d))}`,
      op: 'Count the parts',
      why: 'Each whole is made of parts the size of the bottom number. Count the parts in the wholes, then add the parts left over. The bottom stays the same.',
      focus: ['w'],
    },
    {
      line: `= ${frac(k('i', improper), k('d', d))}`,
      op: 'Work out',
      why: 'Multiply, then add.',
      note: [`${whole} × ${d} → ${parts}`, `${parts} + ${n} → ${improper}`],
      merge: { i: ['w', 'x', 'e', 'pl', 'n'] },
    },
  ]
}

export function improperToMixedChain(n: number, d: number): FractionChainStep[] {
  const whole = Math.floor(n / d), remainder = n % d
  return [
    { line: frac(k('n', n), k('d', d)) },
    {
      line: `= ${k('w', whole)}${frac(k('r', remainder), k('d', d))}`,
      op: 'Find the wholes',
      note: [`${n} ÷ ${d} → ${whole} r ${remainder}`],
      why: 'Divide the top by the bottom: that gives the wholes, and what is left over stays as a fraction.',
      merge: { w: ['n'], r: ['n'] },
    },
  ]
}

/** One fraction, multiplied top and bottom by `scale` when it is more than 1. */
function scaled(term: Term, scale: number, topKey: string, bottomKey: string) {
  return scale > 1
    ? frac(`${k(term.nk, term.n)} ${k(topKey, `\\times ${scale}`)}`, `${k(term.dk, term.d)} ${k(bottomKey, `\\times ${scale}`)}`)
    : frac(k(term.nk, term.n), k(term.dk, term.d))
}

export function addSubtractChain(values: { numerator: number; denominator: number }[], operation: 'add' | 'subtract'): FractionChainStep[] {
  const sign = operation === 'add' ? '+' : '-', shown = operation === 'add' ? '+' : '−', words = operation === 'add' ? 'add' : 'take away'
  const common = values.map(value => value.denominator).reduce(lcm)
  const terms: Term[] = values.map((value, i) => ({ nk: `t${i}`, dk: `b${i}`, n: value.numerator, d: value.denominator }))
  const scales = terms.map(term => common / term.d)
  const join = (parts: string[]) => parts.join(` ${sign} `)
  const steps: FractionChainStep[] = [{ line: join(terms.map(term => frac(k(term.nk, term.n), k(term.dk, term.d)))) }]

  let tops = terms.map(term => ({ key: term.nk, n: term.n })), bottoms = terms.map(term => term.dk)
  if (scales.some(scale => scale > 1)) {
    const changing = terms.filter((_, i) => scales[i] > 1)
    steps.push(lcmStep(terms.map(term => term.d), common))
    steps.push({
      line: `= ${join(terms.map((term, i) => scaled(term, scales[i], `mt${i}`, `mb${i}`)))}`,
      op: 'Make bottoms the same',
      note: changing.map(term => `${common} ÷ ${term.d} → ${common / term.d}`),
      why: `You can only ${words} parts that are the same size. ${common} is the smallest number the bottoms all go into. Multiply the top by the same number as the bottom so the size doesn't change.`,
    })
    const merge: Record<string, string[]> = {}
    terms.forEach((term, i) => {
      merge[`u${i}`] = scales[i] > 1 ? [term.nk, `mt${i}`] : [term.nk]
      merge[`v${i}`] = scales[i] > 1 ? [term.dk, `mb${i}`] : [term.dk]
    })
    steps.push({
      line: `= ${join(terms.map((term, i) => frac(k(`u${i}`, term.n * scales[i]), k(`v${i}`, common))))}`,
      op: 'Work out',
      why: 'Multiply out the tops and the bottoms.',
      merge,
    })
    tops = terms.map((term, i) => ({ key: `u${i}`, n: term.n * scales[i] })); bottoms = terms.map((_, i) => `v${i}`)
  }

  const total = tops.slice(1).reduce((sum, top) => operation === 'add' ? sum + top.n : sum - top.n, tops[0].n)
  const sum = tops.map(top => `${top.n}`).join(` ${shown} `)
  steps.push({
    line: `= ${frac(tops.map((top, i) => `${i ? `${k(`s${i}`, sign)} ` : ''}${k(top.key, top.n)}`).join(' '), k('l', common))}`,
    op: operation === 'add' ? 'Add the tops' : 'Subtract the tops',
    why: `The parts are the same size now, so just ${words} how many parts there are. The bottom stays the same, because the size of each part doesn't change.`,
    merge: { l: bottoms },
  })
  steps.push({
    line: `= ${frac(k('t', total), k('l', common))}`,
    op: 'Work out',
    why: operation === 'add' ? 'Add the tops.' : 'Subtract the tops.',
    merge: { t: tops.flatMap((top, i) => i ? [`s${i}`, top.key] : [top.key]) },
  })
  return [...steps, ...simplifyTail({ nk: 't', dk: 'l', n: total, d: common }, true)]
}

/** From "= a/b × c/e" on the last line (the × keyed `times`) to the simplified answer. */
function multiplyTail(first: Term, second: Term, times: string): FractionChainStep[] {
  const top = first.n * second.n, bottom = first.d * second.d
  return [
    {
      line: `= ${frac(`${k(first.nk, first.n)} ${k(times, '\\times')} ${k(second.nk, second.n)}`, `${k(first.dk, first.d)} ${k('x2', '\\times')} ${k(second.dk, second.d)}`)}`,
      op: 'Multiply across',
      why: 'To multiply fractions, multiply the tops together and the bottoms together. The bottoms do not need to match first.',
    },
    {
      line: `= ${frac(k('p', top), k('q', bottom))}`,
      op: 'Work out',
      why: 'Multiply out the top and the bottom.',
      merge: { p: [first.nk, times, second.nk], q: [first.dk, 'x2', second.dk] },
    },
    ...simplifyTail({ nk: 'p', dk: 'q', n: top, d: bottom }, true),
  ]
}

/** From "= a/b ÷ c/e" (the ÷ keyed `sign`) to the answer: flip the second fraction, then multiply. */
function divideTail(first: Term, second: Term, sign: string, lead = '= '): FractionChainStep[] {
  const flipped: Term = { nk: second.dk, dk: second.nk, n: second.d, d: second.n }
  return [
    {
      line: `${lead}${frac(k(first.nk, first.n), k(first.dk, first.d))} ${k('m', '\\times')} ${frac(k(flipped.nk, flipped.n), k(flipped.dk, flipped.d))}`,
      op: 'Flip and multiply',
      why: 'Dividing by a fraction is the same as multiplying by it upside down: there are 2 halves in every whole, so dividing by a half doubles.',
      merge: { m: [sign] },
    },
    ...multiplyTail(first, flipped, 'm'),
  ]
}

export function multiplyChain(first: { numerator: number; denominator: number }, second: { numerator: number; denominator: number }): FractionChainStep[] {
  const a: Term = { nk: 'a', dk: 'b', n: first.numerator, d: first.denominator }
  const b: Term = { nk: 'c', dk: 'e', n: second.numerator, d: second.denominator }
  return [
    { line: `${frac(k('a', a.n), k('b', a.d))} ${k('m', '\\times')} ${frac(k('c', b.n), k('e', b.d))}` },
    ...multiplyTail(a, b, 'm'),
  ]
}

export function divideChain(first: { numerator: number; denominator: number }, second: { numerator: number; denominator: number }): FractionChainStep[] {
  const a: Term = { nk: 'a', dk: 'b', n: first.numerator, d: first.denominator }
  const b: Term = { nk: 'c', dk: 'e', n: second.numerator, d: second.denominator }
  return [
    { line: `${frac(k('a', a.n), k('b', a.d))} ${k('v', '\\div')} ${frac(k('c', b.n), k('e', b.d))}` },
    ...divideTail(a, b, 'v'),
  ]
}

function mixedLatex(value: WholeFraction, wk: string, nk: string, dk: string) {
  return `${value.whole ? k(wk, value.whole) : ''}${frac(k(nk, value.numerator), k(dk, value.denominator))}`
}

export function mixedCalculationChain(first: WholeFraction, second: WholeFraction, operation: 'multiply' | 'divide'): FractionChainStep[] {
  const sign = operation === 'multiply' ? '\\times' : '\\div', key = operation === 'multiply' ? 'm' : 'v'
  const top = (value: WholeFraction) => (value.whole ?? 0) * value.denominator + value.numerator
  const a: Term = { nk: 'a', dk: 'b', n: top(first), d: first.denominator }
  const b: Term = { nk: 'c', dk: 'e', n: top(second), d: second.denominator }
  const conversions = [first, second].filter(value => value.whole).map(value => `${value.whole} × ${value.denominator} + ${value.numerator} → ${top(value)}`)
  const steps: FractionChainStep[] = [
    { line: `${mixedLatex(first, 'w1', 'n1', 'b')} ${k(key, sign)} ${mixedLatex(second, 'w2', 'n2', 'e')}` },
    {
      line: `= ${frac(k('a', a.n), k('b', a.d))} ${k(key, sign)} ${frac(k('c', b.n), k('e', b.d))}`,
      op: 'Make improper fractions',
      focus: [first.whole ? 'w1' : '', second.whole ? 'w2' : ''].filter(Boolean),
      why: `Mixed numbers can't be ${operation === 'multiply' ? 'multiplied' : 'divided'} straight away, so turn each one into a top-heavy fraction: the wholes times the bottom, plus the top.`,
      note: conversions,
      merge: { a: first.whole ? ['w1', 'n1'] : ['n1'], c: second.whole ? ['w2', 'n2'] : ['n2'] },
    },
  ]
  return [...steps, ...(operation === 'multiply' ? multiplyTail(a, b, 'm') : divideTail(a, b, 'v'))]
}

export function fractionOfAmountChain(n: number, d: number, amount: number, currency: boolean): FractionChainStep[] {
  const top = n * amount, answer = top / d
  const money = (value: number) => currency ? `\\pounds ${value}` : String(value)
  return [
    { line: `${frac(k('n', n), k('d', d))} \\text{ of } ${k('a', money(amount))}` },
    {
      line: `= ${frac(k('n', n), k('d', d))} ${k('x', '\\times')} ${k('a', money(amount))}`,
      op: 'Of means times',
      why: 'Finding a fraction of an amount is the same as multiplying the amount by the fraction.',
    },
    {
      line: `= ${frac(k('t', money(top)), k('d', d))}`,
      op: 'Multiply the top',
      why: 'The amount is a whole number, so it multiplies the top. The bottom stays the same.',
      note: [`${n} × ${amount} → ${top}`],
      merge: { t: ['n', 'x', 'a'] },
    },
    {
      line: `= ${k('r', money(answer))}`,
      op: 'Divide',
      why: 'A fraction bar means divide, so divide the top by the bottom.',
      note: [`${top} ÷ ${d} → ${answer}`],
      merge: { r: ['t', 'd'] },
    },
  ]
}
