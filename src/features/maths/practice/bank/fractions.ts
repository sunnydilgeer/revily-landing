/*
 * Practice templates for fractions and for fractions, decimals and percentages (lessons 8–9).
 * Original questions in the style of AQA Foundation papers; `inspiredBy` is our audit trail.
 */
import type { ChainStep } from '../../step-chain/StepChain'
import { f, frac, gcd, lcm, mixed, rotate, tidy } from '../helpers'
import type { MethodStep, QuestionBody, Template } from '../types'

/** Adding or subtracting two fractions over the lowest common denominator, simplified at the end. */
function addChain(n1: number, d1: number, n2: number, d2: number, sign: 1 | -1): { chain: ChainStep[]; answer: [number, number]; method: MethodStep[] } {
  const L = lcm(d1, d2), m1 = n1 * L / d1, m2 = n2 * L / d2, top = m1 + sign * m2, g = gcd(top, L)
  const op = sign > 0 ? '+' : '-', word = sign > 0 ? 'Add' : 'Subtract'
  const chain: ChainStep[] = [
    { line: `[[a:${frac(n1, d1)}]] ${op} [[b:${frac(n2, d2)}]]` },
    {
      line: `= [[c:${frac(m1, L)}]] ${op} [[d:${frac(m2, L)}]]`, op: 'Common denominator', merge: { c: ['a'], d: ['b'] },
      why: `${L} is the lowest common multiple of ${d1} and ${d2}. ${n1}/${d1} = ${m1}/${L}${d2 === L ? '' : ` and ${n2}/${d2} = ${m2}/${L}`}.`,
    },
    { line: `= [[e:${frac(top, L)}]]`, op: `${word} the tops`, merge: { e: ['c', 'd'] }, why: `The denominators match, so ${word.toLowerCase()} the numerators: ${m1} ${op === '+' ? '+' : '−'} ${m2} = ${top}. The denominator stays ${L}.` },
  ]
  if (g > 1) chain.push({ line: `= [[s:${frac(top / g, L / g)}]]`, op: `÷ ${g}`, merge: { s: ['e'] }, why: `${top} and ${L} share the factor ${g}. Divide both by ${g} to simplify.` })
  const method: MethodStep[] = [
    { prompt: `Write ${n1}/${d1} as a fraction over ${L}. What is the numerator?`, answer: m1 },
    { prompt: `Write ${n2}/${d2} as a fraction over ${L}. What is the numerator?`, answer: m2 },
  ]
  return { chain, answer: [top / g, L / g], method }
}

function simplifyMixed(n: number, d: number, top: number, bottom: number): QuestionBody {
  const g = gcd(n, d), whole = Math.floor(top / bottom), rest = top % bottom
  return {
    stem: 'Fractions can be written in different ways.',
    parts: [
      {
        kind: 'fraction', prompt: `Write ${f(n, d)} in its simplest form.`, answer: [n / g, d / g], form: 'simplest', marks: 1, statements: ['8:simplifying-fractions'],
        hint: `Find the biggest number that divides into both ${n} and ${d}.`,
        chain: [
          { line: `\\frac{[[a:${n}]]}{[[b:${d}]]}` },
          { line: `= \\frac{[[c:${n / g}]]}{[[d:${d / g}]]}`, op: `÷ ${g}`, merge: { c: ['a'], d: ['b'] }, why: `${g} is the highest common factor of ${n} and ${d}. Dividing top and bottom by ${g} simplifies it fully in one go.` },
        ],
      },
      {
        kind: 'fraction', prompt: `Write ${f(top, bottom)} as a mixed number.`, answer: [top, bottom], form: 'mixed', marks: 1, statements: ['8:mixed-improper-fractions'],
        hint: `How many whole ${bottom}s go into ${top}? What is left over?`,
        chain: [
          { line: `[[a:${frac(top, bottom)}]]` },
          { line: `= [[w:${frac(whole * bottom, bottom)}]] + [[r:${frac(rest, bottom)}]]`, op: 'Split off wholes', merge: { w: ['a'] }, why: `${bottom} goes into ${top} ${whole} times (${whole * bottom}), with ${rest} left over.` },
          { line: `= [[m:${mixed(top, bottom)}]]`, op: 'Write as mixed', merge: { m: ['w', 'r'] }, why: `${whole * bottom}/${bottom} is ${whole} whole ones, so the answer is ${whole} and ${rest}/${bottom}.` },
        ],
      },
    ],
  }
}

function addOrSubtract(a: [number, number, number, number], sign: 1 | -1): QuestionBody {
  const worked = addChain(a[0], a[1], a[2], a[3], sign)
  const adding = sign > 0, word = adding ? 'adds' : 'subtracts'
  return {
    stem: 'Work out',
    parts: [{
      kind: 'fraction', prompt: `${f(a[0], a[1])} ${adding ? '+' : '−'} ${f(a[2], a[3])}`, answer: worked.answer, marks: 3,
      statements: [adding ? '8:adding-fractions' : '8:subtracting-fractions'], method: worked.method,
      mistakes: [{ answer: [a[0] + sign * a[2], a[1] + sign * a[3]], note: `That ${word} the bottoms as well as the tops. Make the denominators the same first; only the numerators are ${adding ? 'added' : 'subtracted'}.` }],
      hint: `Make the denominators the same first, then ${adding ? 'add' : 'subtract'} the numerators.`, chain: worked.chain,
    }],
  }
}

function multiplyDivide(m: [number, number, number, number], v: [number, number, number, number]): QuestionBody {
  const [a, b, c, d] = m, top = a * c, bottom = b * d, g = gcd(top, bottom)
  const [p, q, r, s] = v, vTop = p * s, vBottom = q * r, h = gcd(vTop, vBottom)
  const simplify = (t: number, u: number, k: number, key: string, from: string): ChainStep[] => k > 1
    ? [{ line: `= [[${key}:${frac(t / k, u / k)}]]`, op: `÷ ${k}`, merge: { [key]: [from] }, why: `${t} and ${u} share the factor ${k}. Divide both by ${k}.` }]
    : []
  return {
    stem: 'Work out each one. Give your answers in their simplest form.',
    parts: [
      {
        kind: 'fraction', prompt: `${f(a, b)} × ${f(c, d)}`, answer: [top / g, bottom / g], form: 'simplest', marks: 2, statements: ['8:multiplying-fractions'],
        method: [{ prompt: 'Multiply the numerators together. What do you get?', answer: top }],
        hint: 'Multiply the tops together and the bottoms together, then simplify.',
        chain: [
          { line: `[[a:${frac(a, b)}]] \\times [[b:${frac(c, d)}]]` },
          { line: `= [[c:\\frac{${a} \\times ${c}}{${b} \\times ${d}}]]`, op: 'Tops × tops', merge: { c: ['a', 'b'] }, why: 'To multiply fractions, multiply the numerators and multiply the denominators. No common denominator needed.' },
          { line: `= [[d:${frac(top, bottom)}]]`, op: 'Multiply', merge: { d: ['c'] }, why: `${a} × ${c} = ${top} and ${b} × ${d} = ${bottom}.` },
          ...simplify(top, bottom, g, 'e', 'd'),
        ],
      },
      {
        kind: 'fraction', prompt: `${f(p, q)} ÷ ${f(r, s)}`, answer: [vTop / h, vBottom / h], form: 'simplest', marks: 2, statements: ['8:dividing-fractions'],
        method: [{ prompt: `Keep, change, flip: ${p}/${q} × ${s}/${r}. What is the numerator of the answer?`, answer: vTop }],
        mistakes: [{ answer: [p * r, q * s], note: `That multiplies by ${r}/${s}. Dividing by a fraction means multiplying by it flipped: ${s}/${r}.` }],
        hint: 'Keep the first fraction, change ÷ to ×, flip the second fraction.',
        chain: [
          { line: `[[a:${frac(p, q)}]] [[o:\\div]] [[b:${frac(r, s)}]]` },
          { line: `= [[a:${frac(p, q)}]] [[x:\\times]] [[c:${frac(s, r)}]]`, op: 'Keep, change, flip', merge: { x: ['o'], c: ['b'] }, why: `Dividing by ${r}/${s} is the same as multiplying by its reciprocal, ${s}/${r}.` },
          { line: `= [[d:${frac(vTop, vBottom)}]]`, op: 'Multiply', merge: { d: ['a', 'x', 'c'] }, why: `${p} × ${s} = ${vTop} and ${q} × ${r} = ${vBottom}.` },
          ...simplify(vTop, vBottom, h, 'e', 'd'),
        ],
      },
    ],
  }
}

function recipe(whole: number, n: number, d: number, cakes: number, what: string, whats: string): QuestionBody {
  const improper = whole * d + n, total = improper * cakes
  return {
    stem: `A recipe for one ${what} uses ${whole}${f(n, d)} cups of flour.`,
    parts: [{
      kind: 'fraction', prompt: `How much flour is needed for ${cakes} ${whats}? Give your answer as a mixed number.`, answer: [total, d], form: 'mixed', marks: 2,
      method: [{ prompt: `Write ${whole} ${n}/${d} as an improper fraction. What is the numerator?`, answer: improper }],
      mistakes: [{ answer: [whole * cakes * d + n, d], note: `That multiplies the ${whole} whole but not the ${n}/${d}. Turn it into an improper fraction first, then multiply the whole thing.` }],
      statements: ['8:mixed-fraction-calculations'],
      hint: `Turn ${whole} ${n}/${d} into an improper fraction first, then multiply by ${cakes}.`,
      chain: [
        { line: `[[a:${mixed(improper, d)}]] \\times [[b:${cakes}]]` },
        { line: `= [[c:${frac(improper, d)}]] \\times [[b:${cakes}]]`, op: 'Make it improper', merge: { c: ['a'] }, why: `${whole} whole ones are ${whole * d}/${d}. Add the ${n}/${d}: ${improper}/${d}.` },
        { line: `= [[e:${frac(total, d)}]]`, op: `× ${cakes}`, merge: { e: ['c', 'b'] }, why: `Multiply the numerator by ${cakes}: ${improper} × ${cakes} = ${total}. The denominator stays ${d}.` },
        { line: `= [[m:${mixed(total, d)}]]`, op: 'Back to mixed', merge: { m: ['e'] }, why: `${d} goes into ${total} ${Math.floor(total / d)} times, with ${total % d} left over: ${mixed(total, d).replace(/\\frac\{(\d+)\}\{(\d+)\}/, ' $1/$2')} cups.` },
      ],
    }],
  }
}

function showFractionsOf(a: [number, number, number], b: [number, number, number]): QuestionBody {
  const [n1, d1, x] = a, [n2, d2, y] = b
  const first = x / d1 * n1, second = y / d2 * n2
  const part = (n: number, d: number, amount: number, answer: number): ChainStep[] => [
    { line: `[[f:${frac(n, d)}]] \\text{ of } [[a:${amount}]]` },
    { line: `= [[n:${n}]] \\times [[p:${amount / d}]]`, op: `${amount} ÷ ${d}`, merge: { p: ['a', 'f'] }, why: `The denominator splits ${amount} into ${d} equal parts: ${amount} ÷ ${d} = ${amount / d}.` },
    { line: `= [[r:${answer}]]`, op: `× ${n}`, merge: { r: ['n', 'p'] }, why: `The numerator says take ${n} of those parts: ${n} × ${amount / d} = ${answer}.` },
  ]
  const compare = part(n2, d2, y, second)
  compare.push({ line: `${first} > ${second}`, op: 'Compare', why: `${first} is greater than ${second}, which shows ${n1}/${d1} of ${x} is greater. A show-that ends with both numbers and a sentence.` })
  return {
    stem: `Show that ${f(n1, d1)} of ${x} is greater than ${f(n2, d2)} of ${y}.`,
    parts: [
      { kind: 'number', prompt: `Work out ${f(n1, d1)} of ${x}.`, answer: first, marks: 1, statements: ['8:fractions-of-amounts'], hint: `Divide ${x} by ${d1}, then multiply by ${n1}.`, chain: part(n1, d1, x, first) },
      { kind: 'number', prompt: `Work out ${f(n2, d2)} of ${y}.`, answer: second, marks: 1, statements: ['8:fractions-of-amounts'], hint: `Divide ${y} by ${d2}, then multiply by ${n2}.`, chain: compare },
    ],
  }
}

function ticketsLeft(total: number, fri: [number, number], sat: [number, number]): QuestionBody {
  const friday = total / fri[1] * fri[0], rest = total - friday, saturday = rest / sat[1] * sat[0], left = rest - saturday
  return {
    stem: `A theatre has ${total} tickets for a show. ${f(fri[0], fri[1])} of the tickets are sold on Friday. ${f(sat[0], sat[1])} of the remaining tickets are sold on Saturday.`,
    parts: [{
      kind: 'number', prompt: 'How many tickets are still not sold?', answer: left, marks: 3, statements: ['8:fractions-of-amounts'],
      method: [
        { prompt: 'How many tickets are sold on Friday?', answer: friday },
        { prompt: 'How many tickets are sold on Saturday?', answer: saturday },
      ],
      hint: `“Remaining” means what is left after Friday. Find Friday’s tickets, take them away, then find ${sat[0]}/${sat[1]} of what is left.`,
      chain: [
        { line: `${frac(fri[0], fri[1])} \\text{ of } ${total} = ${friday}` },
        { line: `${total} - ${friday} = ${rest}`, op: 'What remains', why: `${total} ÷ ${fri[1]} × ${fri[0]} = ${friday} sold on Friday, so ${rest} are left.` },
        { line: `${frac(sat[0], sat[1])} \\text{ of } ${rest} = ${saturday}`, op: 'Saturday', why: `Saturday’s fraction is of the remaining ${rest}, not of all ${total}: ${rest} ÷ ${sat[1]} × ${sat[0]} = ${saturday}.` },
        { line: `${rest} - ${saturday} = ${left}`, op: 'Not sold', why: `${rest} − ${saturday} = ${left} tickets are still not sold.` },
      ],
    }],
  }
}

function fdpConvert(decimal: number, fraction: [number, number], percentFrom: number): QuestionBody {
  const places = String(decimal).split('.')[1].length, scale = 10 ** places, top = Math.round(decimal * scale), g = gcd(top, scale)
  const [n, d] = fraction, asDecimal = tidy(n / d), percent = tidy(percentFrom * 100)
  return {
    stem: 'Fractions, decimals and percentages are different ways of writing the same amount.',
    parts: [
      {
        kind: 'fraction', prompt: `Write ${decimal} as a fraction in its simplest form.`, answer: [top / g, scale / g], form: 'simplest', marks: 1, statements: ['9:decimal-to-fraction'],
        hint: `${decimal} has ${places} decimal place${places === 1 ? '' : 's'}, so start with a denominator of ${scale}.`,
        chain: [
          { line: `${decimal}` },
          { line: `= \\frac{[[a:${top}]]}{[[b:${scale}]]}`, op: `Over ${scale}`, why: `The last digit is in the ${scale === 100 ? 'hundredths' : scale === 10 ? 'tenths' : 'thousandths'} column, so ${decimal} = ${top}/${scale}.` },
          { line: `= \\frac{[[c:${top / g}]]}{[[d:${scale / g}]]}`, op: `÷ ${g}`, merge: { c: ['a'], d: ['b'] }, why: `${top} and ${scale} share the factor ${g}. Divide both by ${g}.` },
        ],
      },
      {
        kind: 'number', prompt: `Write ${f(n, d)} as a decimal.`, answer: asDecimal, marks: 1, statements: ['9:fraction-to-decimal'],
        hint: `A fraction is a division: ${n} ÷ ${d}.`,
        chain: [{ line: `${frac(n, d)} = ${n} \\div ${d}` }, { line: `= ${asDecimal}`, op: `${n} ÷ ${d}`, why: `Use short division with zeros after the decimal point: ${n}.000 ÷ ${d} = ${asDecimal}.` }],
      },
      {
        kind: 'number', prompt: `Write ${percentFrom} as a percentage.`, answer: percent, suffix: '%', marks: 1, statements: ['9:decimal-to-percentage'],
        mistakes: [{ answer: tidy(percentFrom * 10), note: 'That multiplies by 10. Per cent means out of 100, so multiply by 100.' }],
        hint: 'Per cent means out of 100. Multiply by 100.',
        chain: [{ line: `${percentFrom} \\times 100` }, { line: `= ${percent}\\%`, op: '× 100', why: `Multiplying by 100 moves each digit two places left: ${percentFrom} → ${percent}%.` }],
      },
    ],
  }
}

function fdpCompare(percent: number, fractionPercent: number, testA: [number, number], testB: [number, number], by: number): QuestionBody {
  const g = gcd(fractionPercent, 100)
  const pa = tidy(testA[0] / testA[1] * 100), pb = tidy(testB[0] / testB[1] * 100)
  const better = pa > pb ? 'Maths' : 'Science', other = pa > pb ? 'Science' : 'Maths'
  const choice = rotate([
    `${better}. ${testA[0]}/${testA[1]} = ${pa}% and ${testB[0]}/${testB[1]} = ${pb}%.`,
    other === 'Science' ? `Science. ${testB[0]} is a bigger score than ${testA[0]}.` : `Maths. Out of ${testA[1]}, each mark is worth more.`,
    'They are the same. Both scores are more than half marks.',
  ], 0, by)
  return {
    stem: 'Percentages, fractions and decimals.',
    parts: [
      {
        kind: 'number', prompt: `Write ${percent}% as a decimal.`, answer: tidy(percent / 100), marks: 1, statements: ['9:percentage-to-decimal'],
        hint: 'Divide by 100.', chain: [{ line: `${percent}\\% = ${percent} \\div 100` }, { line: `= ${percent / 100}`, op: '÷ 100', why: `Per cent means out of 100, so divide by 100: ${percent / 100}.` }],
      },
      {
        kind: 'fraction', prompt: `Write ${fractionPercent}% as a fraction in its simplest form.`, answer: [fractionPercent / g, 100 / g], form: 'simplest', marks: 1, statements: ['9:percentage-to-fraction'],
        hint: `${fractionPercent}% means ${fractionPercent} out of 100.`,
        chain: [{ line: `${fractionPercent}\\% = \\frac{[[a:${fractionPercent}]]}{[[b:100]]}` }, { line: `= \\frac{[[c:${fractionPercent / g}]]}{[[d:${100 / g}]]}`, op: `÷ ${g}`, merge: { c: ['a'], d: ['b'] }, why: `${fractionPercent} and 100 share the factor ${g}. Divide both by ${g}.` }],
      },
      {
        kind: 'choice', prompt: `In a Maths test Ben scores ${testA[0]} out of ${testA[1]}. In a Science test he scores ${testB[0]} out of ${testB[1]}. In which test did he get the higher percentage?`, marks: 1,
        statements: ['9:fraction-to-percentage', '11:ordering-fractions-decimals-percentages'], ...choice,
        hint: 'Turn each score into a percentage: make the denominator 100.',
        reason: `${testA[0]}/${testA[1]} = ${pa}% (× ${100 / testA[1]} top and bottom) and ${testB[0]}/${testB[1]} = ${pb}% (× ${100 / testB[1]}). ${Math.max(pa, pb)}% is higher, so he did better in ${better}.`,
      },
    ],
  }
}

/** a/b + c/d ÷ e/f: the division first (JUN25 1F Q23, where adding first earns only a special case). */
function fractionOrder(a: [number, number], c: [number, number], e: [number, number]): QuestionBody {
  const divTop = c[0] * e[1], divBottom = c[1] * e[0]
  const L = lcm(a[1], divBottom), sumTop = a[0] * L / a[1] + divTop * L / divBottom, g = gcd(sumTop, L)
  const wrongTop = a[0] * c[1] + c[0] * a[1], wrongBottom = a[1] * c[1]
  return {
    stem: 'Work out the value of this. Give your answer as a fraction in its simplest form.',
    parts: [{
      kind: 'fraction', prompt: `${f(a[0], a[1])} + ${f(c[0], c[1])} ÷ ${f(e[0], e[1])}`, answer: [sumTop / g, L / g], form: 'simplest', marks: 3,
      statements: ['8:dividing-fractions', '8:adding-fractions', '2:operation-priority'],
      method: [
        { prompt: `Division comes first. ${c[0]}/${c[1]} ÷ ${e[0]}/${e[1]} = ${c[0]}/${c[1]} × ${e[1]}/${e[0]}. What is the numerator (before simplifying)?`, answer: divTop },
        { prompt: `Now add ${a[0]}/${a[1]} + ${divTop}/${divBottom} over ${L}. What is the numerator of the total?`, answer: sumTop },
      ],
      mistakes: [{ answer: [wrongTop * e[1], wrongBottom * e[0]], note: 'That adds first and then divides. BIDMAS says the division comes before the addition.' }],
      hint: 'BIDMAS: do the division before the addition.',
      chain: [
        { line: `[[a:${frac(a[0], a[1])}]] + [[d:${frac(c[0], c[1])} \\div ${frac(e[0], e[1])}]]` },
        { line: `= [[a:${frac(a[0], a[1])}]] + [[q:${frac(divTop, divBottom)}]]`, op: 'Divide first', merge: { q: ['d'] }, why: `Division comes before addition. Keep, change, flip: ${c[0]}/${c[1]} × ${e[1]}/${e[0]} = ${divTop}/${divBottom}.` },
        { line: `= [[A:${frac(a[0] * L / a[1], L)}]] + [[Q:${frac(divTop * L / divBottom, L)}]]`, op: 'Common denominator', merge: { A: ['a'], Q: ['q'] }, why: `${L} is a common multiple of ${a[1]} and ${divBottom}.` },
        { line: `= [[s:${frac(sumTop, L)}]]`, op: 'Add the tops', merge: { s: ['A', 'Q'] }, why: `${a[0] * L / a[1]} + ${divTop * L / divBottom} = ${sumTop}.` },
        ...(g > 1 ? [{ line: `= [[r:${frac(sumTop / g, L / g)}]]`, op: `÷ ${g}`, merge: { r: ['s'] }, why: `${sumTop} and ${L} share the factor ${g}. Divide both by ${g}: simplest form.` }] : []),
      ],
    }],
  }
}

export const fractionTemplates: Template[] = [
  {
    id: 'fractions-simplify-mixed', topic: 'fractions', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Jun23 1F Q4; Nov24 1F Q3a — simplest form; improper to mixed (1.5 scores 0)',
    variants: [simplifyMixed(18, 24, 11, 4), simplifyMixed(20, 35, 17, 5), simplifyMixed(16, 40, 23, 6)],
  },
  {
    id: 'fractions-add', topic: 'fractions', ramp: 'apply', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Nov23 1F Q15 — add fractions with different denominators, 3 marks',
    variants: [addOrSubtract([2, 3, 1, 4], 1), addOrSubtract([1, 2, 2, 5], 1), addOrSubtract([3, 5, 1, 3], 1)],
  },
  {
    id: 'fractions-subtract', topic: 'fractions', ramp: 'apply', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Nov24 1F Q24; Nov22 1F Q22 — subtract fractions with different denominators',
    variants: [addOrSubtract([5, 6, 1, 4], -1), addOrSubtract([3, 4, 1, 3], -1), addOrSubtract([7, 8, 1, 6], -1)],
  },
  {
    id: 'fractions-multiply-divide', topic: 'fractions', ramp: 'apply', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Jun23 1F Q25; Jun25 2F Q19b — multiply and divide fractions',
    variants: [multiplyDivide([3, 5, 10, 21], [3, 4, 9, 10]), multiplyDivide([4, 9, 3, 8], [5, 6, 2, 3]), multiplyDivide([5, 6, 3, 10], [4, 7, 2, 3])],
  },
  {
    id: 'fractions-recipe', topic: 'fractions', ramp: 'multistep', style: 'standard', context: 'food', calculator: false,
    inspiredBy: 'Jun23 1F Q25; Nov23 1F Q7a — calculating with mixed numbers',
    variants: [recipe(1, 3, 4, 3, 'cake', 'cakes'), recipe(2, 1, 3, 4, 'loaf', 'loaves'), recipe(1, 2, 5, 3, 'pie', 'pies')],
  },
  {
    id: 'fractions-show-greater', topic: 'fractions', ramp: 'multistep', style: 'showThat', context: 'none', calculator: false,
    inspiredBy: 'Jun23 3F Q8 — show an amount compared with fractions',
    variants: [showFractionsOf([3, 4, 60], [2, 3, 66]), showFractionsOf([2, 5, 85], [3, 8, 88]), showFractionsOf([5, 6, 48], [3, 4, 52])],
  },
  {
    id: 'fractions-tickets', topic: 'fractions', ramp: 'multistep', style: 'standard', context: 'events', calculator: false,
    inspiredBy: 'Nov23 1F Q17; Jun23 1F Q19 — a fraction of what remains',
    variants: [ticketsLeft(240, [3, 8], [2, 5]), ticketsLeft(360, [5, 12], [3, 7]), ticketsLeft(180, [2, 9], [3, 4])],
  },
  {
    id: 'fdp-convert', topic: 'fdp', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Jun24 2F Q1 — decimal to fraction, fraction to decimal, decimal to percentage',
    variants: [fdpConvert(0.35, [3, 8], 0.07), fdpConvert(0.64, [5, 8], 0.4), fdpConvert(0.45, [7, 20], 0.125)],
  },
  {
    id: 'fdp-compare-tests', topic: 'fdp', ramp: 'apply', style: 'explain', context: 'school', calculator: false,
    inspiredBy: 'Jun24 1F Q12; Nov22 3F Q8 — compare by converting to the same form',
    variants: [fdpCompare(45, 12, [17, 20], [41, 50], 0), fdpCompare(8, 35, [18, 25], [37, 50], 1), fdpCompare(70, 4, [13, 20], [33, 50], 2)],
  },
  {
    id: 'fractions-order', topic: 'fractions', ramp: 'stretch', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Jun25 1F Q23; Nov22 1F Q22 — fractions with two operations; order of operations matters',
    variants: [fractionOrder([4, 15], [1, 5], [1, 2]), fractionOrder([1, 6], [2, 3], [4, 9]), fractionOrder([3, 10], [2, 5], [4, 3])],
  },
]
