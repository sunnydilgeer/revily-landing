/*
 * Practice templates for powers and roots (lesson 16, Algebra A2).
 * Original questions in the style of AQA Foundation papers. The AQA 2022–25 references have not been
 * counted for index laws yet, so `inspiredBy` says so, and the weights in aqaWeights.ts are estimates.
 */
import { rotate } from '../helpers'
import type { ChoicePart, FractionPart, NumberPart, QuestionBody, SpotPart, Template } from '../types'

const p = (base: string | number, power: number) => `${base}^{${power}}`

/** "Write … as a single power": the right answer first, then the usual slips (powers multiplied or added, base changed). */
function singlePower(statement: string, question: string, options: string[], op: string, why: string, by: number): ChoicePart {
  return {
    kind: 'choice', prompt: `Write $${question}$ as a single power.`, marks: 1, statements: [statement], ...rotate(options.map(option => `$${option}$`), 0, by),
    hint: 'The base stays the same. Multiply: add the powers. Divide: subtract them. Power of a power: multiply them.',
    chain: [{ line: question }, { line: `= ${options[0]}`, op, why }],
  }
}

type Laws = { base: number; mul: [number, number]; div: [number, number]; pow: [number, number] }
function lawsSet({ base: b, mul: [m1, m2], div: [d1, d2], pow: [p1, p2] }: Laws, by: number): QuestionBody {
  return {
    stem: 'Write each of these as a single power.',
    parts: [
      singlePower('16:indices-multiply', `${p(b, m1)} \\times ${p(b, m2)}`, [p(b, m1 + m2), p(b, m1 * m2), p(b * b, m1 + m2), p(b * b, m1 * m2)], 'Add the powers', `Same base, so add the powers: ${m1} + ${m2} = ${m1 + m2}. The base stays as ${b}.`, by),
      singlePower('16:indices-divide', `${p(b, d1)} \\div ${p(b, d2)}`, [p(b, d1 - d2), p(b, d1 + d2), p(1, d1 - d2), p(b, d2 - d1)], 'Subtract the powers', `Same base, so subtract the powers: ${d1} − ${d2} = ${d1 - d2}. The base isn’t divided.`, by + 1),
      singlePower('16:indices-power-of-power', `(${p(b, p1)})^{${p2}}`, [p(b, p1 * p2), p(b, p1 + p2), p(b, p1 ** p2), p(b * p2, p1)], 'Multiply the powers', `A power of a power: multiply the powers, ${p1} × ${p2} = ${p1 * p2}. Adding is for two powers multiplied together.`, by + 2),
    ],
  }
}

type Values = { one: number; zero: [number, number]; ones: number }
function valuesSet({ one, zero: [k, z], ones }: Values): QuestionBody {
  const powerOne: NumberPart = {
    kind: 'number', prompt: `Work out $${p(one, 1)}$`, answer: one, marks: 1, statements: ['16:indices-power-one'],
    mistakes: [{ answer: 1, note: `A power of 1 is one copy of the number, so $${p(one, 1)} = ${one}$. It isn’t 1.` }],
    hint: 'A power of 1 means one copy of the number.',
    chain: [{ line: p(one, 1) }, { line: `= ${one}`, op: 'One copy', why: 'A power of 1 is the number itself, with nothing to multiply it by.' }],
  }
  const powerZero: NumberPart = {
    kind: 'number', prompt: `Work out $${k} \\times ${p(z, 0)}$`, answer: k, marks: 1, statements: ['16:indices-power-zero'],
    mistakes: [{ answer: 0, note: `$${p(z, 0)}$ is 1, not 0, so $${k} \\times 1 = ${k}$.` }, { answer: k * z, note: `Work out the power first: $${p(z, 0)} = 1$, so $${k} \\times 1 = ${k}$.` }],
    hint: 'Work out the power first. Any number (except 0) to the power 0 is 1.',
    chain: [{ line: `${k} \\times ${p(z, 0)}` }, { line: `= ${k} \\times 1`, op: 'Power 0 gives 1', why: `Any number except 0 to the power 0 is 1.` }, { line: `= ${k}`, op: 'Multiply', why: 'Multiplying by 1 changes nothing.' }],
  }
  const powerOfOne: NumberPart = {
    kind: 'number', prompt: `Work out $${p(1, ones)}$`, answer: 1, marks: 1, statements: ['16:indices-one'],
    mistakes: [{ answer: ones, note: `The power says how many 1s are multiplied: $1 \\times 1 \\times \\ldots \\times 1 = 1$.` }],
    hint: 'Multiply 1 by itself: does it ever change?',
    chain: [{ line: p(1, ones) }, { line: '= 1', op: '1 to any power', why: 'Multiplying 1 by itself any number of times is still 1.' }],
  }
  return { stem: 'Work out each of these.', parts: [powerOne, powerZero, powerOfOne] }
}

type FractionRoot = { n: number; d: number; square: number; cube: number }
function fractionRootSet({ n, d, square, cube }: FractionRoot): QuestionBody {
  const fraction: FractionPart = {
    kind: 'fraction', prompt: `Work out $\\left(\\frac{${n}}{${d}}\\right)^{2}$`, answer: [n * n, d * d], marks: 1, statements: ['16:indices-fraction'],
    mistakes: [{ answer: [n * n, d], note: `The power applies to the bottom as well: $${d}^{2} = ${d * d}$.` }, { answer: [n * 2, d * 2], note: `Squaring means multiplying by itself, not by 2: $${n}^{2} = ${n * n}$ and $${d}^{2} = ${d * d}$.` }],
    hint: 'Square the top and square the bottom.',
    chain: [{ line: `\\left(\\frac{${n}}{${d}}\\right)^{2}` }, { line: `= \\frac{${n}^{2}}{${d}^{2}}`, op: 'Power the top and the bottom', why: 'Squaring a fraction squares its top and its bottom.' }, { line: `= \\frac{${n * n}}{${d * d}}`, op: 'Work them out', why: `${n} × ${n} = ${n * n} and ${d} × ${d} = ${d * d}.` }],
  }
  const root: NumberPart = {
    kind: 'number', prompt: `Work out $\\sqrt{${square * square}} + \\sqrt[3]{${cube ** 3}}$`, answer: square + cube, marks: 2, statements: ['16:roots'],
    method: [{ prompt: `Work out $\\sqrt{${square * square}}$`, answer: square }],
    mistakes: [{ answer: square * square / 2 + cube, note: `A square root isn’t half. Which number times itself makes ${square * square}? ${square} × ${square}.` }],
    hint: 'A square root: which number times itself? A cube root: which number, used three times?',
    chain: [{ line: `\\sqrt{${square * square}} + \\sqrt[3]{${cube ** 3}}` }, { line: `= ${square} + ${cube}`, op: 'Work out each root', why: `${square} × ${square} = ${square * square} and ${cube} × ${cube} × ${cube} = ${cube ** 3}.` }, { line: `= ${square + cube}`, op: 'Add', why: 'Now it’s an ordinary sum.' }],
  }
  return { stem: 'Work out each of these.', parts: [fraction, root] }
}

type Spot = { name: string; base: number; a: number; b: number; wrongLine: string; reason: string; options: string[] }
function spotSet({ name, base, a, b, wrongLine, reason, options }: Spot, by: number): QuestionBody {
  const question = `${p(base, a)} \\times ${p(base, b)}`
  const spot: SpotPart = {
    kind: 'spot', prompt: `${name} wrote $${question}$ as a single power. Tap the first line that is wrong.`, marks: 1, statements: ['16:indices-multiply'],
    lines: [question, wrongLine], wrong: 1,
    hint: 'Check the base and the power: which should change, and how?', reason,
  }
  const fix: ChoicePart = {
    kind: 'choice', prompt: `What should ${name}’s answer be?`, marks: 1, statements: ['16:indices-multiply'], ...rotate(options.map(option => `$${option}$`), 0, by),
    hint: 'Same base, so add the powers. The base stays the same.',
    chain: [{ line: question }, { line: `= ${options[0]}`, op: 'Add the powers', why: reason }],
  }
  return { stem: 'Spot the mistake.', parts: [spot, fix] }
}

export const indicesTemplates: Template[] = [
  {
    id: 'index-laws-single-power', topic: 'simplifying', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A2 worksheets (write as a single power); AQA 2022–25 references still to be counted',
    variants: [
      lawsSet({ base: 3, mul: [4, 5], div: [7, 2], pow: [2, 3] }, 0),
      lawsSet({ base: 5, mul: [2, 6], div: [9, 4], pow: [4, 2] }, 1),
      lawsSet({ base: 7, mul: [3, 3], div: [8, 5], pow: [3, 4] }, 2),
    ],
  },
  {
    id: 'index-laws-values', topic: 'simplifying', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A2 worksheets (powers of 1 and 0, and 1 to any power); AQA 2022–25 references still to be counted',
    variants: [
      valuesSet({ one: 14, zero: [6, 8], ones: 50 }),
      valuesSet({ one: 23, zero: [9, 5], ones: 12 }),
      valuesSet({ one: 8, zero: [3, 11], ones: 40 }),
    ],
  },
  {
    id: 'fraction-powers-roots', topic: 'simplifying', ramp: 'apply', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A2 worksheets (fractions to a power, square and cube roots); AQA 2022–25 references still to be counted',
    variants: [
      fractionRootSet({ n: 2, d: 5, square: 9, cube: 3 }),
      fractionRootSet({ n: 3, d: 7, square: 6, cube: 4 }),
      fractionRootSet({ n: 4, d: 9, square: 11, cube: 2 }),
    ],
  },
  {
    id: 'index-laws-spot', topic: 'simplifying', ramp: 'apply', style: 'errorSpot', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A2 worksheet "is … correct?" questions; AQA 2022–25 references still to be counted',
    variants: [
      spotSet({ name: 'Bea', base: 3, a: 4, b: 2, wrongLine: '= 9^{6}', reason: 'The base doesn’t change: 3⁴ × 3² is six 3s multiplied together, so 3⁶, not 9⁶.', options: ['3^{6}', '9^{6}', '3^{8}', '9^{8}'] }, 0),
      spotSet({ name: 'Omar', base: 5, a: 3, b: 4, wrongLine: '= 5^{12}', reason: 'Multiplying powers of the same base adds the powers: 3 + 4 = 7, so 5⁷, not 5¹².', options: ['5^{7}', '5^{12}', '25^{7}', '25^{12}'] }, 1),
      spotSet({ name: 'Lily', base: 2, a: 5, b: 3, wrongLine: '= 4^{8}', reason: 'The base stays as 2: 2⁵ × 2³ is eight 2s multiplied together, so 2⁸, not 4⁸.', options: ['2^{8}', '4^{8}', '2^{15}', '4^{15}'] }, 2),
    ],
  },
]
