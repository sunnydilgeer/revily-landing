/*
 * Practice templates for reverse percentages (lesson 33, Ratio R4) and interest, growth and decay (lesson 34, Ratio
 * R5), with the lessons' methods: find what % you have, divide to find 1% and multiply by 100, or divide by the
 * multiplier; simple interest on the original; compound growth and decay with a multiplier once a year; and trying
 * values of n. Original questions in the style of AQA Foundation papers. The AQA 2022–25 references have not been
 * counted for these skills yet, so `inspiredBy` says so, and the weights in aqaWeights.ts are estimates.
 */
import type { NumberPart, QuestionBody, Template } from '../types'

/** Money to the penny, so 0.1 + 0.2 never shows as 0.30000000000000004. */
const pence = (n: number) => Math.round(n * 100) / 100
const money = (n: number) => Number.isInteger(n) ? `${n}` : n.toFixed(2)

/** `after` is the price after a `percent`% fall (or rise): find 1%, then × 100 (2 marks). */
function reverseByOne(direction: 'up' | 'down', percent: number, after: number, stem: string, prompt: string): QuestionBody {
  const have = direction === 'up' ? 100 + percent : 100 - percent, one = pence(after / have), answer = pence(one * 100)
  const part: NumberPart = {
    kind: 'number', prompt, answer, marks: 2, statements: ['33:reverse-percentage'], prefix: '£',
    hint: `£${money(after)} is ${direction === 'up' ? `100% + ${percent}%` : `100% − ${percent}%`} = ${have}% of the original. Divide by ${have} to find 1%.`,
    method: [{ prompt: `£${money(after)} is ${have}%. What is 1%? $${money(after)} \\div ${have} = ?$`, answer: one, prefix: '£' }],
    chain: [
      { line: `${have}\\% = ${money(after)}`, op: 'What % you have', why: direction === 'up' ? `It went up, so it is the whole 100% and ${percent}% more.` : `${percent}% came off the original, so ${have}% is left.` },
      { line: `1\\% = ${money(after)} \\div ${have} = ${money(one)}`, op: `÷ ${have}`, why: `${have} lots of 1% make £${money(after)}, so divide by ${have}.` },
      { line: `100\\% = ${money(one)} \\times 100 = ${money(answer)}`, op: '× 100', why: 'The original is 100 lots of 1%.' },
    ],
    mistakes: [
      { answer: pence(direction === 'up' ? after * (1 - percent / 100) : after * (1 + percent / 100)), note: `That ${direction === 'up' ? 'takes' : 'adds'} ${percent}% of the new price. The ${percent}% was of the original, so £${money(after)} is ${have}% of it.` },
      { answer: one, note: 'That’s 1%. Multiply by 100 for the original.' },
    ],
  }
  return { stem, parts: [part] }
}

/** `after` is the amount after a `percent`% rise or fall: divide by the multiplier (2 marks). */
function reverseByMultiplier(direction: 'up' | 'down', percent: number, after: number, stem: string, prompt: string): QuestionBody {
  const multiplier = (direction === 'up' ? 100 + percent : 100 - percent) / 100, answer = pence(after / multiplier)
  const part: NumberPart = {
    kind: 'number', prompt, answer, marks: 2, statements: ['33:reverse-percentage-multiplier'], prefix: '£',
    hint: `Write ${direction === 'up' ? `100% + ${percent}%` : `100% − ${percent}%`} as a decimal, then divide £${money(after)} by it.`,
    method: [{ prompt: `What is the multiplier for a ${percent}% ${direction === 'up' ? 'rise' : 'fall'}?`, answer: multiplier }],
    chain: [
      { line: `${direction === 'up' ? `100\\% + ${percent}\\%` : `100\\% - ${percent}\\%`} = ${multiplier}`, op: 'The multiplier', why: 'The new amount as a decimal of the original.' },
      { line: `${money(after)} \\div ${multiplier} = ${money(answer)}`, op: `÷ ${multiplier}`, why: `Original × ${multiplier} = £${money(after)}, so divide by ${multiplier} to undo it.` },
    ],
    mistakes: [
      { answer: pence(after * multiplier), note: `Divide by ${multiplier}, don’t multiply: you are going back to the original.` },
      { answer: pence(direction === 'up' ? after * (1 - percent / 100) : after * (1 + percent / 100)), note: `Don’t ${direction === 'up' ? 'take' : 'add'} ${percent}% of £${money(after)}: divide by ${multiplier}.` },
    ],
  }
  return { stem, parts: [part] }
}

/** £`start` at `rate`% simple interest for `years` years: the total (2 marks). */
function simpleInterest(start: number, rate: number, years: number, stem: string, prompt: string): QuestionBody {
  const each = pence(start * rate / 100), total = pence(each * years), answer = pence(start + total)
  const part: NumberPart = {
    kind: 'number', prompt, answer, marks: 2, statements: ['34:simple-interest'], prefix: '£',
    hint: `Find ${rate}% of £${start} for 1 year, multiply by ${years}, then add it on.`,
    method: [{ prompt: `What is the interest for 1 year? ${rate}% of £${start}`, answer: each, prefix: '£' }],
    chain: [
      { line: `${start} \\div 100 \\times ${rate} = ${money(each)}`, op: `${rate}% of £${start}`, why: 'Simple interest is the same every year, worked out on the original.' },
      { line: `${years} \\times ${money(each)} = ${money(total)}`, op: `× ${years} years`, why: `${years} years of interest.` },
      { line: `${start} + ${money(total)} = ${money(answer)}`, op: 'Add it on', why: 'Add the interest to the original.' },
    ],
    mistakes: [
      { answer: total, note: `That’s the interest. Add the £${start} too.` },
      { answer: pence(start + each), note: `That’s 1 year. Multiply the interest by ${years} years.` },
      { answer: pence(start * (1 + rate / 100) ** years), note: 'That’s compound interest. Simple interest is on the original every year.' },
    ],
  }
  return { stem, parts: [part] }
}

/** £`start` growing (or falling) by `rate`% a year for `years` years, to the nearest penny (2 marks). */
function compound(direction: 'up' | 'down', start: number, rate: number, years: number, stem: string, prompt: string): QuestionBody {
  const multiplier = (direction === 'up' ? 100 + rate : 100 - rate) / 100, answer = pence(start * multiplier ** years)
  const statement = direction === 'up' ? '34:compound-growth' : '34:compound-decay'
  const part: NumberPart = {
    kind: 'number', prompt, answer, marks: 2, statements: [statement], prefix: '£',
    hint: `The multiplier is ${direction === 'up' ? `100% + ${rate}%` : `100% − ${rate}%`} = ${multiplier}. Use ${start} × ${multiplier}^${years}.`,
    method: [{ prompt: `What is the multiplier for ${rate}% ${direction === 'up' ? 'growth' : 'decay'} each year?`, answer: multiplier }],
    chain: [
      { line: `${direction === 'up' ? `100\\% + ${rate}\\%` : `100\\% - ${rate}\\%`} = ${multiplier}`, op: 'The multiplier', why: direction === 'up' ? `Keep the 100% and add ${rate}%.` : `It keeps 100% − ${rate}% each year.` },
      { line: `${start} \\times ${multiplier}^{${years}} = ${money(answer)}`, op: `× ${multiplier}^${years}`, why: `Once for every year, each on the new amount. Round to the nearest penny.` },
    ],
    mistakes: [
      { answer: pence(start * (1 + (direction === 'up' ? 1 : -1) * rate * years / 100)), note: `That’s simple ${direction === 'up' ? 'interest' : 'decay'}. Each year’s ${rate}% is of the new amount: × ${multiplier}^${years}.` },
      { answer: pence(start * multiplier), note: `That’s 1 year. Use ${multiplier}^${years} for ${years} years.` },
    ],
  }
  return { stem, parts: [part] }
}

/** The first whole year £`start` × `multiplier`^n passes `target` (2 marks). */
function periods(start: number, multiplier: number, target: number, stem: string, prompt: string): QuestionBody {
  const over = (value: number) => multiplier > 1 ? value > target : value < target
  let n = 1
  while (!over(start * multiplier ** n)) n++
  const before = pence(start * multiplier ** (n - 1)), after = pence(start * multiplier ** n)
  const part: NumberPart = {
    kind: 'number', prompt, answer: n, marks: 2, statements: ['34:compound-periods'], suffix: ' years',
    hint: `Try values of n in ${start} × ${multiplier}ⁿ, and stop at the first one ${multiplier > 1 ? 'over' : 'under'} ${target}.`,
    method: [{ prompt: `What is ${start} × ${multiplier}^${n - 1}, to the nearest penny?`, answer: before }],
    chain: [
      { line: `n = ${n - 1}: ${start} \\times ${multiplier}^{${n - 1}} = ${money(before)}`, op: `Try n = ${n - 1}`, why: `Still ${multiplier > 1 ? 'not over' : 'not under'} ${target}.` },
      { line: `n = ${n}: ${start} \\times ${multiplier}^{${n}} = ${money(after)}`, op: `Try n = ${n}`, why: `${multiplier > 1 ? 'Over' : 'Under'} ${target} for the first time, so n = ${n}.` },
      { line: `n = ${n}`, op: 'The first one that works', why: `n = ${n - 1} was not enough, so it takes ${n} years.` },
    ],
    mistakes: [{ answer: n - 1, note: `After ${n - 1} years it is ${money(before)}, still ${multiplier > 1 ? 'not over' : 'not under'} ${target}.` }, { answer: n + 1, note: `After ${n} years it is already ${money(after)}.` }],
  }
  return { stem, parts: [part] }
}

export const interestTemplates: Template[] = [
  {
    id: 'reverse-percentage', topic: 'percentages', ramp: 'apply', style: 'standard', context: 'shopping', calculator: false,
    inspiredBy: 'Estimate: modelled on the R4.1 worksheet (find what % you have, ÷ to find 1%, × 100); AQA 2022–25 references still to be counted',
    variants: [
      reverseByOne('down', 20, 36, 'In a sale, a pair of trainers costs £36. The sale takes 20% off.', 'Work out the price before the sale.'),
      reverseByOne('down', 25, 45, 'A jacket costs £45 after a 25% reduction.', 'Work out the original price.'),
      reverseByOne('up', 10, 22, 'A ticket went up by 10% and now costs £22.', 'Work out the price before the increase.'),
    ],
  },
  {
    id: 'reverse-percentage-multiplier', topic: 'percentages', ramp: 'multistep', style: 'standard', context: 'home', calculator: true,
    inspiredBy: 'Estimate: modelled on the R4.2 worksheet (write the new % as a decimal, then divide by it); AQA 2022–25 references still to be counted',
    variants: [
      reverseByMultiplier('up', 15, 92, 'A gym membership went up by 15%. It now costs £92 a month.', 'Work out the cost before the rise.'),
      reverseByMultiplier('down', 35, 260, 'A TV is reduced by 35% in a sale. The sale price is £260.', 'Work out the original price.'),
      reverseByMultiplier('up', 8, 54, 'A train fare went up by 8% to £54.', 'Work out the fare before the rise.'),
    ],
  },
  {
    id: 'simple-interest', topic: 'percentages', ramp: 'apply', style: 'standard', context: 'home', calculator: false,
    inspiredBy: 'Estimate: modelled on the R5.1 worksheet (interest for 1 year on the original, × the years, add it on); AQA 2022–25 references still to be counted',
    variants: [
      simpleInterest(600, 5, 3, 'Ali puts £600 in a savings account paying 5% simple interest per year.', 'How much is in the account after 3 years?'),
      simpleInterest(1500, 4, 2, 'Kim borrows £1500 at 4% simple interest per year.', 'How much does she pay back after 2 years?'),
      simpleInterest(2000, 3, 4, '£2000 is saved at 3% simple interest per year.', 'How much is in the account after 4 years?'),
    ],
  },
  {
    id: 'compound-growth', topic: 'percentages', ramp: 'multistep', style: 'standard', context: 'home', calculator: true,
    inspiredBy: 'Estimate: modelled on the R5.2 worksheet (the multiplier, once for every year); AQA 2022–25 references still to be counted',
    variants: [
      compound('up', 3000, 2, 3, 'Sara saves £3000 at 2% compound interest per year.', 'How much is in the account after 3 years? Give your answer to the nearest penny.'),
      compound('up', 1200, 5, 2, '£1200 is invested at 5% compound interest per year.', 'Work out its value after 2 years.'),
      compound('up', 800, 4, 3, 'Tom saves £800 at 4% compound interest per year.', 'Work out the value after 3 years. Give your answer to the nearest penny.'),
    ],
  },
  {
    id: 'compound-decay', topic: 'percentages', ramp: 'multistep', style: 'standard', context: 'travel', calculator: true,
    inspiredBy: 'Estimate: modelled on the R5.3 worksheet (the multiplier for what is left, once for every year); AQA 2022–25 references still to be counted',
    variants: [
      compound('down', 15000, 20, 2, 'A car costs £15,000. Its value falls by 20% each year.', 'Work out its value after 2 years.'),
      compound('down', 9000, 15, 2, 'A van is worth £9000. Its value falls by 15% each year.', 'Work out its value after 2 years.'),
      compound('down', 700, 10, 2, 'A bike is worth £700. It loses 10% of its value each year.', 'Work out its value after 2 years.'),
    ],
  },
  {
    id: 'compound-periods', topic: 'percentages', ramp: 'stretch', style: 'standard', context: 'home', calculator: true,
    inspiredBy: 'Estimate: modelled on the R5.4 worksheet (try values of n until it first passes the target); AQA 2022–25 references still to be counted',
    variants: [
      periods(500, 1.1, 700, '£500 is saved at 10% compound interest per year.', 'After how many years will there first be more than £700?'),
      periods(1000, 1.05, 1200, '£1000 is saved at 5% compound interest per year.', 'After how many years will there first be more than £1200?'),
      periods(8000, 0.8, 4000, 'A car worth £8000 loses 20% of its value each year.', 'After how many years will it first be worth less than £4000?'),
    ],
  },
]
