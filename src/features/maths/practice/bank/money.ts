/*
 * Practice templates for the money and proportion patterns AQA returns to most often in 2022–25: rounding in
 * context (afford → down, profit → strictly more), working back from a total, best buys, scaling a recipe with
 * ingredients you don't need, and "Assume… In fact" pairs. Original questions; `inspiredBy` names the AQA ones.
 */
import { money, pounds, rotate, tidy } from '../helpers'
import type { QuestionBody, Template } from '../types'

const p2 = (value: number) => value.toFixed(2)

/** How many can you afford: a division that must round down (JUN23 2F Q5a). */
function afford(budget: number, pence: number, item: string, items: string): QuestionBody {
  const exact = tidy(budget * 100 / pence), most = Math.floor(exact)
  return {
    stem: `Ali has £${budget}. ${items[0].toUpperCase() + items.slice(1)} cost ${pence}p each.`,
    parts: [{
      kind: 'number', prompt: `What is the greatest number of ${items} he can buy?`, answer: most, marks: 2,
      statements: ['6:decimal-division', '5:long-division-remainders'],
      method: [{ prompt: `Work in pence: £${budget} is ${budget * 100}p. What is ${budget * 100} ÷ ${pence}, to 2 decimal places?`, answer: Math.round(exact * 100) / 100 }],
      mistakes: [{ answer: most + 1, note: `${most + 1} ${items} would cost ${money(pounds((most + 1) * pence), true)}, which is more than £${budget}. You can only buy the ones you can pay for, so round down.` }],
      hint: `Change £${budget} to pence first, then divide by ${pence}. Can he buy part of ${item.startsWith('a') ? 'an' : 'a'} ${item}?`,
      chain: [
        { line: `${budget * 100} \\div ${pence}` },
        { line: `= ${Math.round(exact * 100) / 100}\\ldots`, op: 'Divide in pence', why: `£${budget} is ${budget * 100}p. Keep both amounts in pence so the units match.` },
        { line: `\\to ${most}`, op: 'Round down', why: `He can’t buy ${exact.toFixed(2)} ${items}, and ${most + 1} would cost too much. So the answer is ${most}: here you round down, whatever the decimal.` },
      ],
    }],
  }
}

/** Working back from a total: 2 of A at a known price plus 3 of B cost £x; find one B (NOV24 1F Q6). */
function reverseMoney(stem: string, knownCount: number, knownPence: number, otherCount: number, totalPence: number, known: string, other: string, ask: string): QuestionBody {
  const knownTotal = knownCount * knownPence, rest = totalPence - knownTotal, each = rest / otherCount
  return {
    stem,
    parts: [{
      kind: 'number', prompt: ask, answer: pounds(each), prefix: '£', marks: 3,
      statements: ['6:decimal-multiplication', '6:decimal-subtraction', '6:decimal-division'],
      method: [
        { prompt: `How much do the ${known} cost?`, answer: pounds(knownTotal), prefix: '£' },
        { prompt: `So how much do the ${other} cost altogether?`, answer: pounds(rest), prefix: '£' },
      ],
      mistakes: [
        { answer: pounds(rest), note: `£${p2(pounds(rest))} is what all the ${other} cost together. Divide by ${otherCount} for one.` },
        { answer: pounds(totalPence / (knownCount + otherCount)), note: 'That shares the total equally between every item, but the items have different prices. Take off what you already know first.' },
      ],
      hint: `Take the cost of the ${known} away from the total first. What is left is for the ${other}.`,
      chain: [
        { line: `[[t:${p2(pounds(totalPence))}]] - [[k:${knownCount} \\times ${p2(pounds(knownPence))}]]` },
        { line: `= [[t:${p2(pounds(totalPence))}]] - [[K:${p2(pounds(knownTotal))}]]`, op: 'Cost you know', merge: { K: ['k'] }, why: `${knownCount} × ${money(pounds(knownPence), true)} = ${money(pounds(knownTotal), true)} for the ${known}.` },
        { line: `= [[r:${p2(pounds(rest))}]]`, op: 'Subtract', merge: { r: ['t', 'K'] }, why: `That leaves ${money(pounds(rest), true)} for the ${other}.` },
        { line: `[[r:${p2(pounds(rest))}]] \\div ${otherCount} = [[e:${p2(pounds(each))}]]`, op: `÷ ${otherCount}`, why: `${otherCount} of them cost ${money(pounds(rest), true)}, so one costs ${money(pounds(each), true)}. Money needs 2 decimal places.` },
      ],
    }],
  }
}

/** Best buy: compare the price of the same amount (JUN25 2F Q17). */
function bestBuy(unit: 'g' | 'ml', what: string, a: [number, number], b: [number, number], by: number): QuestionBody {
  const perA = a[1] / (a[0] / 100), perB = b[1] / (b[0] / 100)
  const better = perA < perB ? 0 : perB < perA ? 1 : 2
  const choice = rotate(['Pack A', 'Pack B', 'They are the same value'], better, by % 2)
  const per = (pack: [number, number], name: string, value: number) => ({
    kind: 'number' as const, prompt: `Cost of 100 ${unit} from pack ${name}, in pence`, answer: value, suffix: 'p', marks: 1, statements: ['6:decimal-division'],
    hint: `How many lots of 100 ${unit} are in ${pack[0]} ${unit}? Share the price between them.`,
    chain: [
      { line: `${pack[1]} \\div ${pack[0] / 100}` },
      { line: `= ${value}`, op: `÷ ${pack[0] / 100}`, why: `${pack[0]} ${unit} is ${pack[0] / 100} lots of 100 ${unit}, and ${money(pounds(pack[1]), true)} is ${pack[1]}p. ${pack[1]} ÷ ${pack[0] / 100} = ${value}p for each 100 ${unit}.` },
    ],
  })
  return {
    stem: `Two packs of ${what}. Pack A: ${a[0]} ${unit} for ${money(pounds(a[1]), true)}. Pack B: ${b[0]} ${unit} for ${money(pounds(b[1]), true)}.`,
    parts: [
      per(a, 'A', perA),
      per(b, 'B', perB),
      {
        kind: 'choice', prompt: 'Which pack is better value?', marks: 1, statements: ['6:decimal-division'], ...choice,
        hint: 'Better value means you pay less for the same amount.',
        reason: `Pack A costs ${perA}p for every 100 ${unit} and pack B costs ${perB}p. ${better === 2 ? 'They cost the same for the same amount.' : `Pack ${better === 0 ? 'A' : 'B'} costs less for the same amount, so it is better value.`}`,
      },
    ],
  }
}

type Twist = { text: string; weeks: number; outcome: 0 | 1 | 2 }

/** Assume… In fact: saving for two tickets with a half-price offer (JUN25 1F Q7). */
function assumeSavings(name: string, price: number, save: number, twist: Twist): QuestionBody {
  const cost = price * 1.5, exact = tidy(cost / save), weeks = Math.ceil(exact - 1e-9)
  const options = ['Fewer weeks than in part (a)', 'The same number of weeks as in part (a)', 'More weeks than in part (a)', 'It is not possible to tell']
  const mistakes = [{ answer: Math.ceil(price * 2 / save - 1e-9), note: 'That is the full price for both tickets. The offer makes the second one half price.' }]
  if (!Number.isInteger(exact)) mistakes.push({ answer: Math.floor(exact), note: `After ${Math.floor(exact)} weeks ${name} has £${Math.floor(exact) * save}, which is not enough yet. Round up.` })
  return {
    stem: `${name} wants to buy two concert tickets. They cost £${price} each. Offer: buy one ticket, get the second half price. ${name} saves £${save} every week.`,
    parts: [
      {
        kind: 'number', prompt: 'Assume the offer lasts. How many weeks does he need to save for?', answer: weeks, marks: 3,
        statements: ['8:fractions-of-amounts', '5:long-division-remainders'],
        method: [
          { prompt: 'With the offer, how much do the two tickets cost?', answer: cost, prefix: '£' },
          { prompt: `How many weeks is that exactly? Work out ${cost} ÷ ${save}.`, answer: exact },
        ],
        mistakes: mistakes.filter(m => m.answer !== weeks),
        hint: 'Find the cost with the offer first: one full price plus one half price.',
        chain: [
          { line: `${price} + \\tfrac{1}{2} \\times ${price} = ${cost}` },
          { line: `${cost} \\div ${save} = ${exact}`, op: 'Weeks exactly', why: `He saves £${save} a week, so divide the cost by ${save}.` },
          { line: `\\to ${weeks}`, op: Number.isInteger(exact) ? 'Whole weeks' : 'Round up', why: Number.isInteger(exact) ? `${exact} is a whole number of weeks: after ${weeks} weeks he has exactly £${cost}.` : `After ${Math.floor(exact)} weeks he is still short, so he needs ${weeks} weeks. Rounding down here would leave him without enough money.` },
        ],
      },
      {
        kind: 'choice', prompt: `In fact, ${twist.text}. What does this mean about the number of weeks he needs to save for?`, marks: 1,
        statements: ['5:long-division-remainders'], options, correct: twist.outcome,
        hint: 'Work out the new number of weeks, rounding up again, and compare it with part (a).',
        reason: `Now it takes ${twist.weeks} weeks, compared with ${weeks} in part (a). ${twist.outcome === 1 ? 'The exact number of weeks changes, but after rounding up it is the same.' : ''}`.trim(),
      },
    ],
  }
}

/** The least number to sell for a profit: break-even is not enough (JUN25 1F Q6). */
function leastForProfit(count: number, buy: number, sell: number, what: string): QuestionBody {
  const cost = count * buy, exact = tidy(cost / sell), least = Math.floor(exact) + 1
  const mistakes = [Number.isInteger(exact)
    ? { answer: exact, note: `Selling ${exact} brings in exactly £${cost}, what she paid. That is breaking even, not a profit. She needs one more.` }
    : { answer: Math.floor(exact), note: `${Math.floor(exact)} × £${sell} = £${Math.floor(exact) * sell}, less than the £${cost} she paid.` }]
  return {
    stem: `A trader buys ${count} ${what} for £${buy} each. She sells them for £${sell} each.`,
    parts: [{
      kind: 'number', prompt: 'What is the least number she must sell to make a profit?', answer: least, marks: 3,
      statements: ['4:long-multiplication-application', '5:long-division-remainders'],
      method: [
        { prompt: `How much does she pay for all ${count}?`, answer: cost, prefix: '£' },
        { prompt: `How many sales at £${sell} would get that money back? Work out ${cost} ÷ ${sell}.`, answer: exact },
      ],
      mistakes,
      hint: 'Find what she paid. How many must she sell to get more than that back?',
      chain: [
        { line: `${count} \\times ${buy} = ${cost}` },
        { line: `${cost} \\div ${sell} = ${exact}`, op: 'Break even', why: `Selling ${exact} at £${sell} each gets back exactly the £${cost} she paid.` },
        { line: `\\to ${least}`, op: 'Profit means more', why: Number.isInteger(exact) ? `${exact} only breaks even. A profit needs more than £${cost}, so ${least}.` : `${Math.floor(exact)} is not enough and she can’t sell part of one, so ${least}.` },
      ],
    }],
  }
}

/** Scale one ingredient of a recipe, with others in the list you don't need (JUN25 1F Q8). */
function recipeScale(dish: string, from: number, to: number, list: [string, number, string][], ask: number): QuestionBody {
  const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a
  const step = gcd(from, to), [name, amount, unit] = list[ask]
  const perStep = amount / from * step, lots = to / step, answer = perStep * lots
  return {
    stem: `${dish} for ${from} people: ${list.map(([n, a, u]) => `${n} ${a} ${u}`).join(', ')}.`,
    parts: [{
      kind: 'number', prompt: `How much ${name} is needed for ${to} people?`, answer, suffix: ` ${unit}`, marks: 3,
      statements: ['4:long-multiplication-application', '5:long-division-layout'],
      method: [
        { prompt: `How much ${name} is needed for ${step} ${step === 1 ? 'person' : 'people'}?`, answer: perStep, suffix: ` ${unit}` },
        { prompt: `How many lots of ${step} people make ${to}?`, answer: lots },
      ],
      mistakes: list.filter((_, i) => i !== ask).map(([n, a]) => ({ answer: a / from * to, note: `That is the ${n}. The question asks about the ${name}: check which line of the recipe you used.` })),
      hint: `Find the ${name} for a number of people that goes into both ${from} and ${to}, then build up.`,
      chain: [
        { line: `${amount} \\div ${from / step} = ${perStep}` },
        { line: `${perStep} \\times ${lots} = ${answer}`, op: `× ${lots}`, why: `${amount} ${unit} feeds ${from}, so ${perStep} ${unit} feeds ${step}. ${to} people is ${lots} lots of ${step}.` },
      ],
    }],
  }
}

export const moneyTemplates: Template[] = [
  {
    id: 'afford-round-down', topic: 'money', ramp: 'apply', style: 'standard', context: 'shopping', calculator: true,
    inspiredBy: 'Jun23 2F Q5a; Nov24 3F Q7; Jun24 1F Q8 — how many can you afford, round down',
    variants: [afford(5, 75, 'pen', 'pens'), afford(10, 65, 'apple', 'apples'), afford(8, 90, 'bus ticket', 'bus tickets')],
  },
  {
    id: 'reverse-money', topic: 'money', ramp: 'multistep', style: 'standard', context: 'shopping', calculator: false,
    inspiredBy: 'Nov24 1F Q6; Jun25 3F Q8; Jun24 2F Q10a — known items plus unknown items cost a total; find one unknown',
    variants: [
      reverseMoney('Hats cost £4.50 each. 2 hats and 3 scarves cost £28.50 altogether.', 2, 450, 3, 2850, '2 hats', 'scarves', 'Work out the cost of one scarf.'),
      reverseMoney('Sandwiches cost £3.60 each. 2 sandwiches and 3 drinks cost £16.05 altogether.', 2, 360, 3, 1605, '2 sandwiches', 'drinks', 'Work out the cost of one drink.'),
      reverseMoney('Red fabric costs £6.40 a metre. 3 metres of red fabric and 4 metres of blue fabric cost £41.20 altogether.', 3, 640, 4, 4120, '3 metres of red', '4 metres of blue', 'Work out the cost of 1 metre of blue fabric.'),
    ],
  },
  {
    id: 'best-buy', topic: 'money', ramp: 'multistep', style: 'standard', context: 'shopping', calculator: true,
    inspiredBy: 'Jun25 2F Q17; Jun23 2F Q5b; Nov23 2F Q23 — which pack is better value',
    variants: [
      bestBuy('g', 'rice', [200, 110], [500, 260], 0),
      bestBuy('g', 'cereal', [250, 160], [400, 260], 1),
      bestBuy('ml', 'orange juice', [300, 96], [750, 225], 2),
    ],
  },
  {
    id: 'assume-savings', topic: 'money', ramp: 'multistep', style: 'assumeInFact', context: 'events', calculator: false,
    inspiredBy: 'Jun25 1F Q7 and Q16; Nov23 1F Q11 — "Assume…", then "In fact…, what does this mean?"',
    variants: [
      assumeSavings('Sam', 18, 6, { text: 'the offer ends before Sam buys the tickets, so he pays full price for both', weeks: 6, outcome: 2 }),
      assumeSavings('Leon', 24, 5, { text: 'Leon’s gran gives him £10 towards the tickets before he starts saving', weeks: 6, outcome: 0 }),
      assumeSavings('Dev', 30, 9, { text: 'Dev manages to save £10 every week instead of £9', weeks: 5, outcome: 1 }),
    ],
  },
  {
    id: 'least-for-profit', topic: 'money', ramp: 'multistep', style: 'standard', context: 'shopping', calculator: false,
    inspiredBy: 'Jun25 1F Q6 — the least number to sell to make a profit',
    variants: [leastForProfit(120, 5, 8, 'T-shirts'), leastForProfit(150, 6, 8, 'phone cases'), leastForProfit(240, 3, 5, 'mugs')],
  },
  {
    id: 'recipe-scale', topic: 'money', ramp: 'apply', style: 'standard', context: 'food', calculator: false,
    inspiredBy: 'Jun25 1F Q8 — scale one ingredient; the others are there to catch you out',
    variants: [
      recipeScale('Lentil soup', 4, 10, [['lentils', 170, 'g'], ['water', 600, 'ml'], ['onion', 50, 'g']], 0),
      recipeScale('Pasta bake', 6, 15, [['pasta', 240, 'g'], ['tomato sauce', 450, 'ml'], ['cheese', 90, 'g']], 0),
      recipeScale('Pancakes', 4, 6, [['flour', 300, 'g'], ['milk', 500, 'ml'], ['sugar', 80, 'g']], 0),
    ],
  },
]
