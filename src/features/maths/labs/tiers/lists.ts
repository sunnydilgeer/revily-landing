import type { ChainStep } from '../../step-chain/StepChain'
import type { Rand } from '../kit/random'

export type Deal = { name: string; emoji: string; price: number; amount: number }

export type TierList = {
  id: string
  title: string
  emoji: string
  /** Singular unit being bought: "can", "GB". */
  unit: string
  /** 'cost' ranks by price of one unit (lower wins); 'amount' by units per £1 (higher wins). */
  measure: 'cost' | 'amount'
  why: string
  lesson: string
  /** Del's sales pitch on the intro screen. */
  pitch: string
  deals: Deal[]
}

export const TIERS = ['S', 'A', 'B', 'C'] as const

export const money = (value: number) => `£${value.toFixed(2)}`
const texMoney = (value: number) => `\\pounds ${value.toFixed(2)}`
const count = (value: number) => value.toLocaleString('en-GB')

/** The value that gets ranked: price of one unit, or units for £1. */
export const unitValue = (list: TierList, deal: Deal) => list.measure === 'cost' ? deal.price / deal.amount : deal.amount / deal.price
export const showValue = (list: TierList, value: number) => list.measure === 'cost' ? `${money(value)} a ${list.unit}` : `${count(value)} per £1`

/** Best deal first. */
export const ranked = (list: TierList) => [...list.deals].sort((a, b) => list.measure === 'cost' ? unitValue(list, a) - unitValue(list, b) : unitValue(list, b) - unitValue(list, a))

const plural = (list: TierList) => list.unit === 'GB' ? 'GB' : `${list.unit}s`
export const describe = (list: TierList, deal: Deal) => `${money(deal.price)} for ${count(deal.amount)} ${deal.amount === 1 ? list.unit : plural(list)}`

/** The question for one deal: the right unit value and two common slips. */
export function priceQuestion(list: TierList, deal: Deal, index: number) {
  const right = unitValue(list, deal)
  const label = (value: number) => list.measure === 'cost' ? money(value) : count(value)
  const units = plural(list)
  const choices = list.measure === 'cost'
    ? [
      { value: right, label: label(right) },
      { value: deal.price * deal.amount, label: label(deal.price * deal.amount), nope: `Multiplying made it bigger. Share the price out over the ${deal.amount} ${units}: divide.` },
      { value: deal.price, label: label(deal.price), nope: `That’s the whole pack. Divide by ${deal.amount} to get one ${list.unit}.` },
    ]
    : [
      { value: right, label: label(right) },
      { value: deal.amount * deal.price, label: label(deal.amount * deal.price), nope: `Multiplying gave way more ${units} than you get. Share the ${units} out over the £${deal.price}: divide.` },
      { value: deal.amount, label: label(deal.amount), nope: `That’s all ${count(deal.amount)} for £${deal.price}. How many for just £1? Divide by ${deal.price}.` },
    ]
  // Rotate so the right answer isn't always in the same place.
  const shift = index % choices.length
  return {
    prompt: list.measure === 'cost' ? `What does 1 ${list.unit} cost?` : `How many ${units} for £1?`,
    answer: right,
    choices: [...choices.slice(shift), ...choices.slice(0, shift)],
  }
}

/** Two lines of working for one deal's unit value. */
export function unitChain(list: TierList, deal: Deal): ChainStep[] {
  const right = unitValue(list, deal)
  return list.measure === 'cost'
    ? [
      { line: `\\text{1 ${list.unit}} = [[p:${texMoney(deal.price)}]] \\div [[n:${deal.amount}]]` },
      { line: `\\text{1 ${list.unit}} = [[u:${texMoney(right)}]]`, op: 'Work it out', merge: { u: ['p', 'n'] }, why: `${money(deal.price)} shared over ${deal.amount} ${plural(list)} is ${money(right)} each.` },
    ]
    : [
      { line: `\\text{Per £1} = [[n:${count(deal.amount).replace(/,/g, '{,}')}]] \\div [[p:${deal.price}]]` },
      { line: `\\text{Per £1} = [[u:${count(right).replace(/,/g, '{,}')}]]`, op: 'Work it out', merge: { u: ['n', 'p'] }, why: `${count(deal.amount)} ${plural(list)} shared over £${deal.price} is ${count(right)} for every £1.` },
    ]
}

/** Pence → pounds, so prices are built in whole pence and never pick up float noise. */
const pounds = (pence: number) => pence / 100
const deal = (name: string, emoji: string, unitPence: number, amount: number): Deal => ({ name, emoji, price: pounds(unitPence * amount), amount })

/** A fresh set of tier lists. Unit prices are multiples of 5p, coin rates multiples of 10. */
export function makeLists(rand: Rand): TierList[] {
  // Fizzy drinks: the big pack is best and the "offer" is the worst deal on the list.
  const single = rand.pick([80, 90, 100, 110, 120]), multi = single - rand.pick([10, 20]), big = multi - rand.pick([10, 20])
  const offerCount = rand.pick([2, 3]), offerUnit = single + rand.pick([5, 10, 15]), multiCount = rand.pick([4, 6]), bigCount = rand.pick([12, 24])
  const offerName = `${offerCount} for ${money(pounds(offerUnit * offerCount)).replace('.00', '')}`
  const fizzy = [
    deal('Single can', '🥫', single, 1),
    deal(`${multiCount}-pack`, '📦', multi, multiCount),
    deal(`${bigCount}-pack`, '🧃', big, bigCount),
    deal(offerName, '🏷️', offerUnit, offerCount),
  ]

  // Phone data: the 50 GB plan beats the 100 GB one, so bigger isn't always better.
  const u50 = rand.pick([30, 40]), u100 = u50 + 5, u20 = u100 + rand.pick([10, 15]), u5 = u20 + rand.pick([20, 40])
  const data = [deal('5 GB plan', '📱', u5, 5), deal('20 GB plan', '📲', u20, 20), deal('100 GB plan', '🚀', u100, 100), deal('50 GB plan', '⚡', u50, 50)]

  // Game coins: rated in coins per £1; which pack wins changes from play to play.
  const rates = rand.shuffle([150, 160, 180, 200, 220, 250]).slice(0, 4)
  const packs = [['Starter', '👛', 5], ['Value pack', '🎒', 10], ['Mid pack', '💰', 25], ['Mega pack', '🏦', 50]] as const
  const coins: Deal[] = packs.map(([name, emoji, price], i) => ({ name, emoji, price, amount: rates[i] * price }))
  const best = coins[rates.indexOf(Math.max(...rates))], worst = coins[rates.indexOf(Math.min(...rates))]
  const mega = coins[3]

  return [
    {
      id: 'fizzy',
      title: 'Fizzy drinks',
      emoji: '🥤',
      unit: 'can',
      measure: 'cost',
      why: 'Bigger packs cost more, so you can’t compare the prices straight. Find what ONE can costs in each deal, then compare like with like.',
      lesson: `The “${offerName}” offer was the worst deal on the list. “Offer” doesn’t mean cheap.`,
      pitch: `Trust me, the “${offerName}” is a proper offer. It says OFFER on it.`,
      deals: rand.shuffle(fizzy),
    },
    {
      id: 'data',
      title: 'Phone data',
      emoji: '📶',
      unit: 'GB',
      measure: 'cost',
      why: 'Same move: the price of 1 GB on each plan. Watch out, the biggest plan isn’t always the best value.',
      lesson: `The 100 GB plan costs ${money(pounds(u100))} a GB, more than the 50 GB plan’s ${money(pounds(u50))}. Bigger isn’t always better.`,
      pitch: 'Everyone wants the 100 GB plan. Biggest is best, innit?',
      deals: rand.shuffle(data),
    },
    {
      id: 'coins',
      title: 'Game coins',
      emoji: '🪙',
      unit: 'coin',
      measure: 'amount',
      why: 'Flip it: work out how many coins you get for every £1. This time, the bigger number wins.',
      lesson: best === mega
        ? `Here the biggest bundle wins: ${count(Math.max(...rates))} coins for every £1, against ${count(Math.min(...rates))} in the worst.`
        : `The Mega pack ISN’T the best value: the ${best.name} gives ${count(Math.max(...rates))} coins for every £1. Always check.`,
      pitch: `The ${worst.name}, perfect for you. Small price, big fun. Don’t look at the maths.`,
      deals: rand.shuffle(coins),
    },
  ]
}
