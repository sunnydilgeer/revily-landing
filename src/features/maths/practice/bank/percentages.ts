/*
 * Practice templates for percentages (lesson 32, Ratio R3): a percentage of an amount built from 10%, 5% and 1%, a
 * percentage increase and decrease, and a percentage change. Original questions in the style of AQA Foundation papers.
 * The AQA 2022–25 references have not been counted for these skills yet, so `inspiredBy` says so, and the weights in
 * aqaWeights.ts are estimates.
 */
import type { NumberPart, QuestionBody, Template } from '../types'

/** Money to the penny, so 0.1 + 0.2 never shows as 0.30000000000000004. */
const pence = (n: number) => Math.round(n * 100) / 100
const money = (n: number) => Number.isInteger(n) ? `${n}` : n.toFixed(2)

/** `percent`% of `whole` (2 marks, method: 10%). */
function ofAmount(percent: number, whole: number, stem: string, prompt: string, pounds = true): QuestionBody {
  const ten = pence(whole / 10), answer = pence(whole * percent / 100)
  const p = pounds ? '£' : undefined
  const part: NumberPart = {
    kind: 'number', prompt, answer, marks: 2, statements: ['32:percentage-of-amount'], prefix: p,
    hint: `Find 10% first: divide by 10. Then build ${percent}% from 10%, 5% and 1%.`,
    method: [{ prompt: `What is 10% of ${pounds ? '£' : ''}${whole}? $${whole} \\div 10 = ?$`, answer: ten, prefix: p }],
    chain: [
      { line: `10\\% = ${whole} \\div 10 = ${money(ten)}`, op: 'Find 10%', why: 'Per cent means out of 100, so 10% is a tenth: divide by 10.' },
      { line: `${percent}\\% = ${money(answer)}`, op: `Build ${percent}%`, why: `Put ${percent}% together from 10%, 5% (half of 10%) and 1% (divide by 100).` },
    ],
    mistakes: [{ answer: ten, note: `That’s 10%. Build ${percent}% from the pieces.` }, { answer: pence(whole - answer), note: `That’s what is left. The question asks for ${percent}%.` }],
  }
  return { stem, parts: [part] }
}

/** `whole` goes up or down by `percent`% (2 marks, method: the change). */
function changeBy(direction: 'up' | 'down', percent: number, whole: number, stem: string, prompt: string): QuestionBody {
  const extra = pence(whole * percent / 100), answer = pence(direction === 'up' ? whole + extra : whole - extra)
  const multiplier = (100 + (direction === 'up' ? percent : -percent)) / 100
  const part: NumberPart = {
    kind: 'number', prompt, answer, marks: 2, statements: [direction === 'up' ? '32:percentage-increase' : '32:percentage-decrease'], prefix: '£',
    hint: direction === 'up' ? `Find ${percent}% of £${whole}, then add it on. Or multiply by ${multiplier}.` : `Find ${percent}% of £${whole}, then take it off. Or multiply by ${multiplier}.`,
    method: [{ prompt: `What is ${percent}% of £${whole}?`, answer: extra, prefix: '£' }],
    chain: [
      { line: `${percent}\\% \\text{ of } ${whole} = ${money(extra)}`, op: `Find ${percent}%`, why: `Work out ${percent}% of the original from 10%, 5% and 1%.` },
      { line: `${whole} ${direction === 'up' ? '+' : '-'} ${money(extra)} = ${money(answer)}`, op: direction === 'up' ? 'Add it on' : 'Take it off', why: direction === 'up' ? 'An increase goes up: add the extra to the original.' : 'A decrease goes down: take the discount off the original.' },
    ],
    mistakes: [
      { answer: extra, note: direction === 'up' ? 'That’s the increase. Add it on to the original.' : 'That’s the amount taken off. The question asks what is left.' },
      { answer: pence(direction === 'up' ? whole - extra : whole + extra), note: direction === 'up' ? 'It goes up: add it on, don’t take it off.' : 'It goes down: take it off, don’t add it on.' },
    ],
  }
  return { stem, parts: [part] }
}

/** From `from` to `to`: the percentage change (2 marks, method: the change). */
function percentChange(from: number, to: number, stem: string, prompt: string): QuestionBody {
  const change = Math.abs(to - from), answer = pence(change / from * 100)
  const part: NumberPart = {
    kind: 'number', prompt, answer, marks: 2, statements: ['32:percentage-change'], suffix: '%',
    hint: 'Find the change, then divide by the original and multiply by 100.',
    method: [{ prompt: `What is the change from ${from} to ${to}?`, answer: change }],
    chain: [
      { line: `${Math.max(from, to)} - ${Math.min(from, to)} = ${change}`, op: 'Find the change', why: 'The difference between the two values.' },
      { line: `${change} \\div ${from} \\times 100 = ${answer}`, op: 'Divide by the original', why: `Always divide by the original, ${from}, then multiply by 100.` },
    ],
    mistakes: [{ answer: pence(change / to * 100), note: `Divide by the original, ${from}, not the new value.` }, { answer: change, note: `That’s the change. Divide by ${from}, then multiply by 100.` }],
  }
  return { stem, parts: [part] }
}

export const percentageTemplates: Template[] = [
  {
    id: 'percentage-of-amount', topic: 'percentages', ramp: 'recall', style: 'standard', context: 'shopping', calculator: false,
    inspiredBy: 'Estimate: modelled on the R3.1 worksheet (build the percentage from 10%, 5% and 1%); AQA 2022–25 references still to be counted',
    variants: [
      ofAmount(15, 60, 'A shop takes 15% off a £60 pair of shoes.', 'How much is taken off?'),
      ofAmount(35, 240, 'A school has 240 pupils. 35% of them walk to school.', 'How many pupils walk to school?', false),
      ofAmount(21, 90, 'A bill of £90 includes 21% for delivery.', 'How much is for delivery?'),
    ],
  },
  {
    id: 'percentage-increase', topic: 'percentages', ramp: 'apply', style: 'standard', context: 'home', calculator: false,
    inspiredBy: 'Estimate: modelled on the R3.2 worksheet (find the percentage, add it on, or use the multiplier); AQA 2022–25 references still to be counted',
    variants: [
      changeBy('up', 15, 400, 'Rent of £400 a month goes up by 15%.', 'Work out the new rent.'),
      changeBy('up', 5, 260, 'A bike costs £260. Its price goes up by 5%.', 'Work out the new price.'),
      changeBy('up', 20, 35, 'A gym membership of £35 a month goes up by 20%.', 'Work out the new price.'),
    ],
  },
  {
    id: 'percentage-decrease', topic: 'percentages', ramp: 'apply', style: 'standard', context: 'shopping', calculator: false,
    inspiredBy: 'Estimate: modelled on the R3.3 worksheet (find the discount, take it off, or use the multiplier); AQA 2022–25 references still to be counted',
    variants: [
      changeBy('down', 30, 55, 'A jacket costs £55. In a sale it is reduced by 30%.', 'Work out the sale price.'),
      changeBy('down', 25, 180, 'A games console costs £180. It is reduced by 25%.', 'Work out the new price.'),
      changeBy('down', 15, 8000, 'A car is worth £8000. Its value falls by 15% in a year.', 'Work out its value after the year.'),
    ],
  },
  {
    id: 'percentage-change', topic: 'percentages', ramp: 'apply', style: 'standard', context: 'shopping', calculator: true,
    inspiredBy: 'Estimate: modelled on the R3.4 worksheet (change ÷ original × 100, then say increase or decrease); AQA 2022–25 references still to be counted',
    variants: [
      percentChange(80, 60, 'A pair of trainers cost £80. In a sale they cost £60.', 'Work out the percentage decrease.'),
      percentChange(250, 290, 'A plant was 250 mm tall. A month later it is 290 mm tall.', 'Work out the percentage increase.'),
      percentChange(1200, 1020, 'A club had 1200 members. A year later it has 1020.', 'Work out the percentage decrease.'),
    ],
  },
]
