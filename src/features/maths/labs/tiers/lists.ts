import type { ChainStep } from '../../step-chain/StepChain'
import type { Rand } from '../kit/random'

/**
 * A twist on a deal, for the later lists. `price` and `amount` are always what you actually pay and get;
 * the offer is how the shop words it, so the player has to work those out first.
 */
export type Offer =
  /** Sold by weight; `amount` counts lots of 100 g. */
  | { kind: 'grams'; grams: number }
  /** Buy 2 get 1 free on singles at `each`: pay for 2, get 3. */
  | { kind: 'free'; each: number }
  /** 25% off a pack that was `was`. */
  | { kind: 'off'; was: number }
  /** A pack of `base` with `extra` free on top. */
  | { kind: 'extra'; base: number; extra: number }

export type Deal = { name: string; emoji: string; price: number; amount: number; offer?: Offer }

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
  /** The intro kicker: "Tier list", "Boss list". */
  kicker?: string
  deals: Deal[]
}

export const TIERS = ['S', 'A', 'B', 'C'] as const

export const money = (value: number) => `£${value.toFixed(2)}`
const texMoney = (value: number) => `\\pounds ${value.toFixed(2)}`
const count = (value: number) => value.toLocaleString('en-GB')

/** The value that gets ranked: price of one unit, or units for £1. */
export const unitValue = (list: TierList, deal: Deal) => list.measure === 'cost' ? deal.price / deal.amount : deal.amount / deal.price
export const showValue = (list: TierList, value: number) => list.measure === 'cost' ? `${money(value)} ${/^\d/.test(list.unit) ? 'per' : 'a'} ${list.unit}` : `${count(value)} per £1`

/** Best deal first. */
export const ranked = (list: TierList) => [...list.deals].sort((a, b) => list.measure === 'cost' ? unitValue(list, a) - unitValue(list, b) : unitValue(list, b) - unitValue(list, a))

const plural = (list: TierList) => list.unit === 'GB' ? 'GB' : `${list.unit}s`
const weight = (grams: number) => grams >= 1000 ? `${grams / 1000} kg` : `${grams} g`
const texWeight = (grams: number) => `${count(grams).replace(/,/g, '{,}')}\\text{ g}`
export const describe = (list: TierList, deal: Deal) => {
  const offer = deal.offer
  if (offer?.kind === 'grams') return `${money(deal.price)} for ${weight(offer.grams)}`
  if (offer?.kind === 'free') return `${money(offer.each)} each · buy 2 get 1 free`
  if (offer?.kind === 'off') return `${money(offer.was)} for ${deal.amount} · 25% off`
  if (offer?.kind === 'extra') return `${money(deal.price)} for ${offer.base} + ${offer.extra} free`
  return `${money(deal.price)} for ${count(deal.amount)} ${deal.amount === 1 ? list.unit : plural(list)}`
}

/** The two slips for a deal with an offer: [value, why it's wrong]. */
function offerSlips(list: TierList, deal: Deal, offer: Offer): [number, string][] {
  const units = plural(list)
  switch (offer.kind) {
    case 'grams': {
      const lots = offer.grams / 100
      return [
        [deal.price, `That’s the whole ${weight(offer.grams)} bag. ${offer.grams >= 1000 ? `1 kg = 1,000 g = ${count(lots)}` : `${count(offer.grams)} g is ${count(lots)}`} lots of 100 g, so divide by ${count(lots)}.`],
        [deal.price / (offer.grams / 10), `You divided by ${count(offer.grams / 10)}: that’s lots of 10 g. You want lots of 100 g, and ${count(offer.grams)} ÷ 100 = ${count(lots)}.`],
      ]
    }
    case 'free': return [
      [offer.each, `That’s the price before the offer. Buy 2 get 1 free: you pay ${money(offer.each * 2)} and get 3 ${units}.`],
      [offer.each / 3, `You shared ONE ${list.unit}’s price over 3. You pay for 2: ${money(offer.each * 2)} ÷ 3.`],
    ]
    case 'off': return [
      [offer.was / deal.amount, `That ignores the 25% off. Take a quarter off ${money(offer.was)} first: you pay ${money(deal.price)}.`],
      [offer.was / 4 / deal.amount, `That’s the 25% you SAVE, shared out. Take it off: ${money(offer.was)} − ${money(offer.was / 4)} = ${money(deal.price)}, then ÷ ${deal.amount}.`],
    ]
    case 'extra': return [
      [deal.price / offer.base, `That forgets the ${offer.extra} free ${units}. You get ${offer.base} + ${offer.extra} = ${deal.amount}, so divide by ${deal.amount}.`],
      [deal.price / offer.extra, `You divided by just the ${offer.extra} free ones. You get ${offer.base} + ${offer.extra} = ${deal.amount} ${units} in total.`],
    ]
  }
}

/** The question for one deal: the right unit value and two common slips. */
export function priceQuestion(list: TierList, deal: Deal, index: number) {
  const right = unitValue(list, deal)
  const label = (value: number) => list.measure === 'cost' ? money(value) : count(value)
  const units = plural(list)
  const choices: { value: number; label: string; nope?: string }[] = deal.offer
    ? [{ value: right, label: label(right) }, ...offerSlips(list, deal, deal.offer).map(([value, nope]) => ({ value, label: label(value), nope }))]
    : list.measure === 'cost'
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
    prompt: list.measure === 'cost' ? `What does ${/^\d/.test(list.unit) ? '' : '1 '}${list.unit} cost?` : `How many ${units} for £1?`,
    answer: right,
    choices: [...choices.slice(shift), ...choices.slice(0, shift)],
  }
}

/** Two lines of working for one deal's unit value. */
export function unitChain(list: TierList, deal: Deal): ChainStep[] {
  const right = unitValue(list, deal)
  const offer = deal.offer
  const one = `\\text{1 ${list.unit}}`
  const share: ChainStep[] = [
    { line: `${one} = [[p:${texMoney(deal.price)}]] \\div [[n:${deal.amount}]]`, op: '÷ how many', why: `You get ${deal.amount} ${plural(list)} for ${money(deal.price)}, so share it out.` },
    { line: `${one} = [[u:${texMoney(right)}]]`, op: 'Work it out', merge: { u: ['p', 'n'] }, why: `${money(deal.price)} ÷ ${deal.amount} = ${money(right)} each.` },
  ]
  if (offer?.kind === 'grams') return [
    { line: `\\text{Lots} = [[g:${texWeight(offer.grams)}]] \\div 100` },
    { line: `\\text{Lots} = [[n:${count(deal.amount)}]]`, op: 'Count the 100 g', merge: { n: ['g'] }, why: `${offer.grams >= 1000 ? '1 kg is 1,000 g. ' : ''}${count(offer.grams)} g is ${count(deal.amount)} lots of 100 g.` },
    { line: `\\text{100 g} = [[p:${texMoney(deal.price)}]] \\div [[n:${count(deal.amount)}]]`, op: '÷ the lots', why: `Share the ${money(deal.price)} over the ${count(deal.amount)} lots.` },
    { line: `\\text{100 g} = [[u:${texMoney(right)}]]`, op: 'Work it out', merge: { u: ['p', 'n'] }, why: `${money(deal.price)} ÷ ${count(deal.amount)} = ${money(right)} for every 100 g.` },
  ]
  if (offer?.kind === 'free') return [
    { line: `\\text{Pay} = 2 \\times [[e:${texMoney(offer.each)}]]` },
    { line: `\\text{Pay} = [[p:${texMoney(deal.price)}]]`, op: 'Work it out', merge: { p: ['e'] }, why: `Buy 2 get 1 free: you pay for 2 and walk off with 3.` },
    ...share,
  ]
  if (offer?.kind === 'off') return [
    { line: `\\text{Off} = [[w:${texMoney(offer.was)}]] \\div 4` },
    { line: `\\text{Off} = [[o:${texMoney(offer.was / 4)}]]`, op: 'Find 25%', merge: { o: ['w'] }, why: `25% is a quarter, so divide ${money(offer.was)} by 4.` },
    { line: `\\text{Pay} = ${texMoney(offer.was)} - [[o:${texMoney(offer.was / 4)}]]`, op: 'Take it off', why: `The pack was ${money(offer.was)}. Knock the ${money(offer.was / 4)} off.` },
    { line: `\\text{Pay} = [[p:${texMoney(deal.price)}]]`, op: 'Work it out', merge: { p: ['o'] }, why: `${money(offer.was)} − ${money(offer.was / 4)} = ${money(deal.price)}.` },
    ...share,
  ]
  if (offer?.kind === 'extra') return [
    { line: `\\text{Get} = [[a:${offer.base}]] + [[b:${offer.extra}]]` },
    { line: `\\text{Get} = [[n:${deal.amount}]]`, op: 'Add the free ones', merge: { n: ['a', 'b'] }, why: `${offer.base} in the pack plus ${offer.extra} free makes ${deal.amount}.` },
    { ...share[0], why: `Share the ${money(deal.price)} over all ${deal.amount}, free ones included.` },
    share[1],
  ]
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

  // Crisps by weight: different bag sizes, so price them all per 100 g (and 1 kg is 1,000 g).
  const per100 = rand.shuffle([40, 50, 60, 70, 80, 90, 100, 110, 120]).slice(0, 4)
  const small = rand.pick([200, 300])
  const bags: [string, string, number][] = [[`${small} g bag`, '🥔', small], ['250 g bag', '🍟', 250], ['500 g bag', '🛍️', 500], ['Party bag', '🎉', 1000]]
  const crisps = bags.map(([name, emoji, grams], i): Deal => ({ name, emoji, price: pounds(per100[i] * grams / 100), amount: grams / 100, offer: { kind: 'grams', grams } }))
  const crispBest = crisps[per100.indexOf(Math.min(...per100))]

  // Boss: energy bars, every deal worded differently. Unit prices are picked first, then each offer built round them.
  const used: number[] = []
  const take = (pool: number[]) => { const u = rand.pick(pool.filter(p => !used.includes(p))); used.push(u); return u }
  const uOff = take([45, 60, 75, 90]), uFree = take([40, 50, 60, 70, 80, 90, 100]), uExtra = take([40, 50, 60, 70, 80, 90, 100]), uBox = take([40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100])
  const boxCount = rand.pick([6, 8])
  const bars: Deal[] = [
    deal(`Box of ${boxCount}`, '📦', uBox, boxCount),
    { name: 'Singles', emoji: '🍫', price: pounds(uFree * 3), amount: 3, offer: { kind: 'free', each: pounds(uFree * 3 / 2) } },
    { name: 'Four-pack', emoji: '🏷️', price: pounds(uOff * 4), amount: 4, offer: { kind: 'off', was: pounds(uOff * 16 / 3) } },
    { name: 'Bonus pack', emoji: '🎁', price: pounds(uExtra * 6), amount: 6, offer: { kind: 'extra', base: 4, extra: 2 } },
  ]
  const barsBest = bars[used.indexOf(Math.min(...used))]

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
    {
      id: 'crisps',
      title: 'Crisps by weight',
      emoji: '🥔',
      unit: '100 g',
      measure: 'cost',
      why: 'Every bag is a different weight, so compare the price of 100 g. Count how many lots of 100 g are in each bag. 1 kg is 1,000 g. Then share the price over the lots.',
      lesson: crispBest.name === 'Party bag'
        ? `The Party bag won this time, at ${money(pounds(Math.min(...per100)))} per 100 g. You only know because you checked.`
        : `The ${crispBest.name} won at ${money(pounds(Math.min(...per100)))} per 100 g. The 1 kg Party bag didn’t. Check, don’t guess.`,
      pitch: 'A whole KILO of crisps. The Party bag. Obviously the best deal, look at the size of it.',
      deals: rand.shuffle(crisps),
    },
    {
      id: 'bars',
      title: 'Energy bar offers',
      emoji: '⚡',
      unit: 'bar',
      measure: 'cost',
      kicker: 'Boss list',
      why: 'Every deal has a different offer. First work out what you actually pay and how many bars you actually get. Then find the price of one bar. Only then compare.',
      lesson: `${barsBest.name} wins at ${money(pounds(Math.min(...used)))} a bar. An offer only means something once you’ve found the price of one.`,
      pitch: 'Buy 2 get 1 FREE. Two FREE bars in the Bonus pack. 25% OFF. Everything’s a bargain, just grab one.',
      deals: rand.shuffle(bars),
    },
  ]
}
