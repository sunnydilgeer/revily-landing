/*
 * Practice templates for standard form (lesson 14).
 * Original questions in the style of AQA Foundation papers. The AQA 2022–25 references have not been
 * counted for standard form yet, so `inspiredBy` says so, and the weights in aqaWeights.ts are estimates.
 */
import { num, rotate } from '../helpers'
import type { ChoicePart, NumberPart, QuestionBody, Template } from '../types'

const sf = (a: number, n: number) => `$${a} \\times 10^{${n}}$`
const sfTex = (a: number, n: number) => `${a} \\times 10^{${n}}`
const texNum = (value: string) => value.replace(/ /g, '\\,')

type Convert = {
  large: [number, number, number]           // a, n, the ordinary number
  small: [number, number, string[]]         // a, n, options with the right one first
  writeLarge: [string, number, number, string[]]  // number, a, n, options with the right one first
  writeSmall: [string, number, number, string[]]
}

function convert({ large, small, writeLarge, writeSmall }: Convert, by: number): QuestionBody {
  const [la, ln, lAnswer] = large
  const appended = Number(String(la).replace('.', '') + '0'.repeat(ln))
  const [sa, sn, smallOptions] = small
  const [bigNumber, wa, wn, bigOptions] = writeLarge
  const [tinyNumber, ta, tn, tinyOptions] = writeSmall
  const toLarge: NumberPart = {
    kind: 'number', prompt: `Write ${sf(la, ln)} as an ordinary number.`, answer: lAnswer, marks: 1, statements: ['14:standard-form-to-large'],
    mistakes: [{ answer: appended, note: `That adds ${ln} zeros after the digits. Hop the point ${ln} places right instead: the digits after the point use up some of the hops.` }],
    hint: `The power is ${ln}, so hop the decimal point ${ln} places right. Fill empty places with zeros.`,
    chain: [{ line: sfTex(la, ln) }, { line: `= ${texNum(num(lAnswer))}`, op: `Hop ${ln} places right`, why: `A positive power makes a large number. Move the point ${ln} places right and fill the empty places with zeros.` }],
  }
  const toSmall: ChoicePart = {
    kind: 'choice', prompt: `Write ${sf(sa, sn)} as an ordinary number.`, marks: 1, statements: ['14:standard-form-to-small'], ...rotate(smallOptions, 0, by),
    hint: `The power is ${sn}, so hop the point ${-sn} places left.`,
    chain: [{ line: sfTex(sa, sn) }, { line: `= ${smallOptions[0]}`, op: `Hop ${-sn} places left`, why: `A negative power makes a small number. Move the point ${-sn} places left and fill the empty places with zeros.` }],
  }
  const toStandardLarge: ChoicePart = {
    kind: 'choice', prompt: `Write ${bigNumber} in standard form.`, marks: 1, statements: ['14:standard-form-write-large'], ...rotate(bigOptions, 0, by + 1),
    hint: 'Hop the point left until only one digit is in front of it. Count the hops.',
    chain: [{ line: texNum(bigNumber) }, { line: `= ${sfTex(wa, wn)}`, op: `Hop ${wn} places left`, why: `The point hops ${wn} places left to give ${wa}, so the power is ${wn}. Count the hops, not the digits.` }],
  }
  const toStandardSmall: ChoicePart = {
    kind: 'choice', prompt: `Write ${tinyNumber} in standard form.`, marks: 1, statements: ['14:standard-form-write-small'], ...rotate(tinyOptions, 0, by + 2),
    hint: 'Hop the point right until one non-zero digit is in front of it. Count the hops.',
    chain: [{ line: tinyNumber }, { line: `= ${sfTex(ta, tn)}`, op: `Hop ${-tn} places right`, why: `The point hops ${-tn} places right to give ${ta}, so the power is ${tn}. Count the hops, not the zeros.` }],
  }
  return { stem: 'Standard form.', parts: [toLarge, toSmall, toStandardLarge, toStandardSmall] }
}

type Operation = { a: [number, number]; b: [number, number]; raw: number; power: number; answer: [number, number]; options: string[] }

function operations(multiply: Operation, divide: Operation, by: number): QuestionBody {
  const step = (op: Operation, kind: '×' | '÷'): ChoicePart => {
    const [[a1, n1], [a2, n2]] = [op.a, op.b], [a, n] = op.answer
    const sign = kind === '×' ? '\\times' : '\\div'
    const fix = op.raw === a
      ? { line: `= ${sfTex(a, n)}`, op: 'Check the first number', why: `${a} is between 1 and 10, so this is already standard form.` }
      : { line: `= ${sfTex(a, n)}`, op: 'Check the first number', why: op.raw >= 10 ? `${op.raw} is 10 or more. ${op.raw} = ${a} × 10, so add 1 to the power.` : `${op.raw} is less than 1. ${op.raw} = ${a} × 10⁻¹, so take 1 off the power.` }
    return {
      kind: 'choice', prompt: `$(${sfTex(a1, n1)}) ${sign} (${sfTex(a2, n2)})$`, marks: 1, statements: [kind === '×' ? '14:standard-form-multiply' : '14:standard-form-divide'],
      ...rotate(op.options, 0, by + (kind === '×' ? 0 : 2)),
      hint: kind === '×' ? 'Multiply the numbers in front and add the powers. Then check the first number is less than 10.' : 'Divide the numbers in front and subtract the powers. Then check the first number is at least 1.',
      chain: [
        { line: `(${a1} ${sign} ${a2}) \\times 10^{${n1} ${kind === '×' ? '+' : '-'} ${n2}}` },
        { line: `= ${sfTex(op.raw, op.power)}`, op: kind === '×' ? 'Multiply, add the powers' : 'Divide, subtract the powers', why: kind === '×' ? `${a1} × ${a2} = ${op.raw} and ${n1} + ${n2} = ${op.power}.` : `${a1} ÷ ${a2} = ${op.raw} and ${n1} − ${n2} = ${op.power}.` },
        fix,
      ],
    }
  }
  return { stem: 'Give each answer in standard form.', parts: [step(multiply, '×'), step(divide, '÷')] }
}

export const standardFormTemplates: Template[] = [
  {
    id: 'standard-form-convert', topic: 'standard-form', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the N14 worksheets (convert both ways); AQA 2022–25 references still to be counted',
    variants: [
      convert({
        large: [4.2, 5, 420000],
        small: [5.8, -4, ['0.00058', '0.000058', '0.0058', '58 000']],
        writeLarge: ['73 100 000', 7.31, 7, [sf(7.31, 7), sf(7.31, 8), sf(73.1, 6), sf(7.31, -7)]],
        writeSmall: ['0.000906', 9.06, -4, [sf(9.06, -4), sf(9.06, -3), sf(90.6, -5), sf(9.06, 4)]],
      }, 0),
      convert({
        large: [2.5, 3, 2500],
        small: [4.7, -4, ['0.00047', '0.000047', '0.0047', '47 000']],
        writeLarge: ['5 600 000', 5.6, 6, [sf(5.6, 6), sf(5.6, 7), sf(56, 5), sf(5.6, -6)]],
        writeSmall: ['0.0038', 3.8, -3, [sf(3.8, -3), sf(3.8, -2), sf(38, -4), sf(3.8, 3)]],
      }, 1),
      convert({
        large: [7.05, 5, 705000],
        small: [9.1, -3, ['0.0091', '0.00091', '0.091', '9100']],
        writeLarge: ['302 000', 3.02, 5, [sf(3.02, 5), sf(3.02, 6), sf(3.2, 5), sf(3.02, -5)]],
        writeSmall: ['0.00064', 6.4, -4, [sf(6.4, -4), sf(6.4, -3), sf(64, -5), sf(6.4, 4)]],
      }, 2),
    ],
  },
  {
    id: 'standard-form-calculate', topic: 'standard-form', ramp: 'apply', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the N14 worksheets (multiply and divide); AQA 2022–25 references still to be counted',
    variants: [
      operations(
        { a: [4, 5], b: [5, 2], raw: 20, power: 7, answer: [2, 8], options: [sf(2, 8), sf(20, 7), sf(2, 7), sf(2, 10)] },
        { a: [3.6, 7], b: [6, 2], raw: 0.6, power: 5, answer: [6, 4], options: [sf(6, 4), sf(0.6, 5), sf(6, 5), sf(6, 9)] },
        0,
      ),
      operations(
        { a: [7, 3], b: [3, 6], raw: 21, power: 9, answer: [2.1, 10], options: [sf(2.1, 10), sf(21, 9), sf(2.1, 9), sf(2.1, 18)] },
        { a: [9, 8], b: [3, 5], raw: 3, power: 3, answer: [3, 3], options: [sf(3, 3), sf(3, 13), sf(3, -3), sf(6, 3)] },
        1,
      ),
      operations(
        { a: [2.5, 4], b: [4, 3], raw: 10, power: 7, answer: [1, 8], options: [sf(1, 8), sf(10, 7), sf(1, 7), sf(6.5, 7)] },
        { a: [1.2, 6], b: [4, 2], raw: 0.3, power: 4, answer: [3, 3], options: [sf(3, 3), sf(0.3, 4), sf(3, 4), sf(3, 8)] },
        2,
      ),
    ],
  },
]
