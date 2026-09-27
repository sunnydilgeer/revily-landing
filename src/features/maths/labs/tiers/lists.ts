import type { ChainStep } from '../../step-chain/StepChain'

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

export const lists: TierList[] = [
  {
    id: 'fizzy',
    title: 'Fizzy drinks',
    emoji: '🥤',
    unit: 'can',
    measure: 'cost',
    why: 'Bigger packs cost more, so you can’t compare the prices straight. Find what ONE can costs in each deal, then compare like with like.',
    lesson: 'The “2 for £2.50” offer was the worst deal on the list. “Offer” doesn’t mean cheap.',
    deals: [
      { name: 'Single can', emoji: '🥫', price: 1.2, amount: 1 },
      { name: '4-pack', emoji: '📦', price: 4, amount: 4 },
      { name: '12-pack', emoji: '🧃', price: 9.6, amount: 12 },
      { name: '2 for £2.50', emoji: '🏷️', price: 2.5, amount: 2 },
    ],
  },
  {
    id: 'data',
    title: 'Phone data',
    emoji: '📶',
    unit: 'GB',
    measure: 'cost',
    why: 'Same move: the price of 1 GB on each plan. Watch out, the biggest plan isn’t always the best value.',
    lesson: 'The 100 GB plan costs more per GB than the 50 GB one. Bigger isn’t always better.',
    deals: [
      { name: '5 GB plan', emoji: '📱', price: 5, amount: 5 },
      { name: '20 GB plan', emoji: '📲', price: 12, amount: 20 },
      { name: '100 GB plan', emoji: '🚀', price: 45, amount: 100 },
      { name: '50 GB plan', emoji: '⚡', price: 20, amount: 50 },
    ],
  },
  {
    id: 'coins',
    title: 'Game coins',
    emoji: '🪙',
    unit: 'coin',
    measure: 'amount',
    why: 'Flip it: work out how many coins you get for every £1. This time, the bigger number wins.',
    lesson: 'Here the biggest bundle wins: 225 coins for every £1, against 160 in the smallest.',
    deals: [
      { name: 'Starter', emoji: '👛', price: 5, amount: 800 },
      { name: 'Mid pack', emoji: '💰', price: 25, amount: 4500 },
      { name: 'Mega pack', emoji: '🏦', price: 60, amount: 13500 },
      { name: 'Value pack', emoji: '🎒', price: 10, amount: 2000 },
    ],
  },
]
