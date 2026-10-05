import type { ChainStep } from '../../step-chain/StepChain'
import { gbp, texGbp, type Option, type Rand } from '../kit/random'

/*
 * Ziggy's market stall, five days of it. Prices are 50p steps up to £10, quantities in 5s and 10s,
 * wages whole pounds an hour. Every answer is picked first and the question built backwards from
 * it, so every share comes out in whole pounds or 50p. Cash carries across the days.
 */

export type Stock = { name: string; item: string; items: string; emoji: string; upgrade: string; upgradeEmoji: string }

export const STOCKS: Stock[] = [
  { name: 'Smoothies', item: 'smoothie', items: 'smoothies', emoji: '🥤', upgrade: 'turbo blender', upgradeEmoji: '🌀' },
  { name: 'Phone Cases', item: 'phone case', items: 'phone cases', emoji: '📱', upgrade: 'neon sign', upgradeEmoji: '💡' },
  { name: 'Cookies', item: 'cookie', items: 'cookies', emoji: '🍪', upgrade: 'second oven', upgradeEmoji: '🔥' },
  { name: 'Bubble Tea', item: 'bubble tea', items: 'bubble teas', emoji: '🧋', upgrade: 'sealing machine', upgradeEmoji: '⚙️' },
  { name: 'Slime', item: 'slime pot', items: 'slime pots', emoji: '🫙', upgrade: 'glitter mixer', upgradeEmoji: '✨' },
]

/** Every number in one play. */
export type Numbers = {
  /** Cash at the start of day 1. */
  start: number
  /** Day 1: stock at £c each, budget £B, so q of them. */
  c: number; B: number; q: number
  /** First customer: k at £p each, paying with a £N note; t is the cost, change is N − t. */
  p: number; k: number; t: number; N: number; change: number
  /** Day 2: n items for £C, so £e each; £P profit wanted is £m each, so the price is £s. */
  n: number; C: number; e: number; P: number; m: number; s: number
  /** Day 3: h hours at £w, pay £wage; upgrade £U for £x a day pays back in d days; D days left. */
  h: number; w: number; wage: number; U: number; x: number; d: number; D: number; worth: boolean
  /** Day 4: a café orders r at £s plus a £F delivery charge (bill £bill); a second order costs £Y, so r2 items. */
  r: number; F: number; bill: number; r2: number; Y: number
  /** Day 5: g more bought for £K; fa/fb of them sell at £s (f items), the rest at £z in the clear-out; takings £T, profit £gain. */
  g: number; K: number; fa: number; fb: number; f: number; z: number; T: number; gain: number
}

export type Kind = 'buy' | 'change' | 'each' | 'price' | 'wage' | 'payback' | 'bill' | 'order' | 'portion' | 'takings' | 'profit'
export type Entry = { amount: number; note: string }

export type DialStep = {
  kind: Kind
  /** The dial's name, also in its button names. */
  label: string
  asker: string
  prompt: string
  commit: string
  answer: number
  start: number
  min: number; max: number; step: number; jump?: number
  money: boolean
  /** Why the right answer is right: shown when they get it. */
  why: string
  /** What went wrong with the value they set. */
  nope: (value: number) => string
  /** Money in (+) or out (−) once it's right. */
  cash?: Entry
}

export type ChoiceStep = {
  kind: 'worth'
  asker: string
  prompt: string
  answer: string
  choices: Option<string>[]
  why: string
  cash?: Entry
}

export type Step = DialStep | ChoiceStep

export type Day = {
  id: string
  title: string
  headline: string
  why: string
  steps: Step[]
  /** Money that lands at the end of the day. */
  close: Entry[]
  chain: ChainStep[]
}

export type Stall = { stock: Stock; n: Numbers; days: Day[] }

const tex = texGbp
const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`

/** Every number for one play, rerolled until it's all friendly and the cash never runs dry. */
function numbers(rand: Rand): Numbers {
  for (;;) {
    const c = rand.pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5])
    const q = rand.pick([10, 15, 20, 25, 30, 40, 50])
    const B = q * c
    if (!Number.isInteger(B) || B < 10 || B > 100) continue
    const start = B + rand.int(10, 50, 10)

    const p = c + rand.pick([1, 1.5, 2, 2.5, 3])
    const k = rand.int(2, 5)
    const t = k * p
    const notes = [5, 10, 20, 50].filter(note => note > t)
    if (p > 10 || !notes.length) continue
    const N = rand.chance(.6) || notes.length === 1 ? notes[0] : notes[1]
    const change = N - t
    // Change mustn't equal the cost or the one-item slip, or those slips would be right by luck.
    if (change === t || change === N - p) continue

    const n = rand.pick([10, 20, 25, 30, 40, 50])
    const e = rand.int(1, 10) / 2
    const C = n * e
    const m = rand.int(1, 6) / 2
    const P = n * m
    const s = e + m
    if (!Number.isInteger(C) || C < 10 || C > 150 || P % 5 || s > 10) continue

    const h = rand.int(3, 8), w = rand.int(6, 12), wage = h * w
    const x = rand.int(5, 25, 5), d = rand.int(3, 8), U = d * x
    const worth = rand.chance(.5)
    const D = worth ? d + rand.int(1, 3) : d - rand.int(1, 2)

    // The cash carries over: it has to cover each day's spending.
    const afterDay1 = start - B + q * p
    const beforeUpgrade = afterDay1 - C + n * s - wage
    if (afterDay1 < C || beforeUpgrade < (worth ? U : 0)) continue
    // It's a tycoon game: every day should end up, and three days leave you richer than you started.
    if (P - wage + (worth ? D * x - U : 0) <= 0) continue

    // Day 4: two café orders at £s each plus a flat delivery charge. Whole-pound bills.
    const r = rand.pick([10, 12, 15, 20, 24, 30])
    const F = rand.pick([2, 3, 4, 5, 6, 8, 10])
    const bill = r * s + F
    const r2 = rand.int(10, 40)
    const Y = r2 * s + F
    if (!Number.isInteger(r * s) || !Number.isInteger(r2 * s) || bill > 200 || r2 === r || Y > 400) continue
    // A slip mustn't land on the answer by luck: delivery on every item, or one item plus delivery.
    if (r * (s + F) === bill || s + F === bill) continue

    // Day 5: a bulk buy, a fraction sold at full price, the rest in the clear-out.
    const [fa, fb] = rand.pick([[1, 4], [3, 4], [1, 3], [2, 3], [2, 5], [3, 5], [4, 5]])
    const g = rand.pick([20, 30, 40, 50, 60])
    const f = g * fa / fb
    const z = rand.int(1, 2 * s - 1) / 2
    const T = f * s + (g - f) * z
    const K = rand.int(Math.ceil(T * 0.4 / 5) * 5, Math.floor(T * 0.8 / 5) * 5, 5)
    const gain = T - K
    if (!Number.isInteger(f) || !Number.isInteger(T) || T > 300 || K < 10 || gain <= 0 || gain > 200) continue
    // Slips mustn't land on the answers: the rest, or the profit equal to the takings or cost.
    if (g - f === f || g / fb === f || gain === K || f * s === T) continue

    const afterDay3 = beforeUpgrade - (worth ? U : 0) + P + (worth ? D * x : 0)
    const afterDay4 = afterDay3 + bill + Y - (r + r2) * e
    if (afterDay4 < K) continue
    return { start, c, B, q, p, k, t, N, change, n, C, e, P, m, s, h, w, wage, U, x, d, D, worth, r, F, bill, r2, Y, g, K, fa, fb, f, z, T, gain }
  }
}

function day1(stock: Stock, v: Numbers): Day {
  const { c, B, q, p, k, t, N, change } = v
  return {
    id: 'stock',
    title: 'Day 1 · Stock up',
    headline: 'Fill the stall. Serve your first customer.',
    why: `Every ${stock.item} costs the same, so buying stock is sharing your money into equal ${gbp(c)} chunks: divide to see how many fit. Change is what’s left of their note once the cost comes off, so work out the cost first (price × how many), then take it away.`,
    steps: [
      {
        kind: 'buy', label: 'How many', asker: 'in items', commit: 'Buy the stock',
        prompt: `${stock.items[0].toUpperCase()}${stock.items.slice(1)} cost ${gbp(c)} each from the supplier. Your stock budget is ${gbp(B)}. How many can you buy?`,
        answer: q, start: 0, min: 0, max: 100, step: 1, jump: 10, money: false,
        why: `${gbp(B)} ÷ ${gbp(c)} = ${q}. That’s ${q} ${stock.items}, budget spent to the penny.`,
        nope: value => {
          if (value === B * c && c !== 1) return `That’s ${gbp(B)} × ${gbp(c)}. Each one takes ${gbp(c)} OUT of the budget, so share the ${gbp(B)} into ${gbp(c)} chunks: divide.`
          if (value === B - c) return `That’s ${gbp(B)} − ${gbp(c)}: one ${stock.item}’s cost taken off once. Every one costs ${gbp(c)}, so see how many ${gbp(c)}s fit in ${gbp(B)}: divide.`
          if (value === 0) return `You bought nothing! How many ${gbp(c)}s fit into ${gbp(B)}? Divide the budget by the price.`
          const spent = value * c
          return spent > B
            ? `${value} × ${gbp(c)} = ${gbp(spent)}. The budget is only ${gbp(B)}, so the supplier says no. Budget ÷ price each.`
            : `${value} × ${gbp(c)} = ${gbp(spent)}, so ${gbp(B - spent)} of the budget is doing nothing. You can afford more: budget ÷ price each.`
        },
        cash: { amount: -B, note: 'stock' },
      },
      {
        kind: 'change', label: 'Change', asker: 'in £', commit: 'Give change',
        prompt: `First customer! They buy ${k} at ${gbp(p)} each and pay with a ${gbp(N)} note. How much change?`,
        answer: change, start: 0, min: 0, max: N, step: 0.5, jump: 5, money: true,
        why: `${k} × ${gbp(p)} = ${gbp(t)}. ${gbp(N)} − ${gbp(t)} = ${gbp(change)} change. Check: ${gbp(t)} + ${gbp(change)} = ${gbp(N)}.`,
        nope: value => {
          if (value === N - p) return `That’s ${gbp(N)} − ${gbp(p)}: you only charged them for one. They bought ${k}, so work out ${k} × ${gbp(p)} first, then take that off ${gbp(N)}.`
          if (value === t) return `${gbp(t)} is what the ${k} ${stock.items} cost. Change is what’s LEFT of their ${gbp(N)} once that comes off.`
          if (value === 0) return `No change at all? They paid ${gbp(N)} for ${k} × ${gbp(p)}. Take the cost off the note.`
          return value < change
            ? `Check it: cost + change should make their note back. ${gbp(t)} + ${gbp(value)} = ${gbp(t + value)}, not ${gbp(N)}. They’ve been short-changed.`
            : `Check it: cost + change should make their note back. ${gbp(t)} + ${gbp(value)} = ${gbp(t + value)}, more than their ${gbp(N)}. You’re paying them to shop!`
        },
        cash: { amount: t, note: 'first sale' },
      },
    ],
    close: [{ amount: (q - k) * p, note: `${q - k} more sold` }],
    chain: [
      { line: `\\text{Stock} = [[b:${tex(B)}]] \\div [[c:${tex(c)}]]` },
      { line: `\\text{Stock} = [[q:${q}]]`, op: `÷ ${gbp(c)}`, merge: { q: ['b', 'c'] }, why: `Each one takes a ${gbp(c)} chunk of the ${gbp(B)}. ${q} chunks fit exactly.` },
      { line: `\\text{Cost} = [[k:${k}]] \\times [[p:${tex(p)}]]`, op: 'First sale', why: `The customer bought ${k} at ${gbp(p)} each. Total cost = price each × how many.` },
      { line: `\\text{Cost} = [[t:${tex(t)}]]`, op: 'Multiply', merge: { t: ['k', 'p'] }, why: `${k} × ${gbp(p)} = ${gbp(t)}. That’s what they owe.` },
      { line: `\\text{Change} = [[n:${tex(N)}]] - [[t:${tex(t)}]]`, op: 'Paid − cost', why: `They handed over ${gbp(N)}. Change is what’s left once the ${gbp(t)} comes off.` },
      { line: `\\text{Change} = [[r:${tex(change)}]]`, op: 'Take away', merge: { r: ['n', 't'] }, why: `${gbp(N)} − ${gbp(t)} = ${gbp(change)}. Check by adding back: ${gbp(t)} + ${gbp(change)} = ${gbp(N)}.` },
    ],
  }
}

function day2(stock: Stock, v: Numbers): Day {
  const { n, C, e, P, m, s } = v
  return {
    id: 'price',
    title: 'Day 2 · Set the price',
    headline: 'New stock. Price it for profit.',
    why: `If ${n} ${stock.items} cost one total, each one’s cost is an equal share of it: total ÷ how many. To make a profit, every ${stock.item} has to pay back its own cost AND carry a slice of the profit: price = cost each + profit each. Profit is money in − money out.`,
    steps: [
      {
        kind: 'each', label: 'Cost each', asker: 'in £', commit: 'Check the bill',
        prompt: `You bought ${n} ${stock.items} for ${gbp(C)} in total. What did each one cost?`,
        answer: e, start: 0, min: 0, max: 10, step: 0.5, jump: 5, money: true,
        why: `${gbp(C)} ÷ ${n} = ${gbp(e)} each. Check: ${n} × ${gbp(e)} = ${gbp(C)}.`,
        nope: value => {
          if (value === C - n) return `That’s ${gbp(C)} − ${n}. Sharing a total into equal parts is divide: ${gbp(C)} ÷ ${n}.`
          if (value === n / C) return `That’s ${n} ÷ ${C}, the wrong way round. Share the money between the ${stock.items}: ${gbp(C)} ÷ ${n}.`
          if (value === 0) return `They weren’t free! Share the ${gbp(C)} bill between the ${n} ${stock.items}.`
          const total = n * value
          return `Check it: ${n} × ${gbp(value)} = ${gbp(total)}, but the bill was ${gbp(C)}. That’s too ${total > C ? 'much' : 'little'} each: share ${gbp(C)} between ${n}.`
        },
        cash: { amount: -C, note: 'new stock' },
      },
      {
        kind: 'price', label: 'Price', asker: 'in £ each', commit: 'Start selling',
        prompt: `Ziggy wants ${gbp(P)} profit when all ${n} sell. What price should each one be?`,
        answer: s, start: e, min: 0, max: 15, step: 0.5, jump: 5, money: true,
        why: `${gbp(P)} ÷ ${n} = ${gbp(m)} profit each, so ${gbp(e)} + ${gbp(m)} = ${gbp(s)}. ${n} × ${gbp(s)} = ${gbp(n * s)} in, minus ${gbp(C)} out = ${gbp(P)} profit.`,
        nope: value => {
          const takings = n * value, profit = takings - C
          const result = profit >= 0 ? `${gbp(profit)} profit` : `a ${gbp(-profit)} LOSS`
          if (value === m) return `${gbp(m)} is just the profit on each one. Each ${stock.item} also has to pay back the ${gbp(e)} it cost: price = cost each + profit each.`
          if (value === e) return `That’s what each one cost you. Sell at cost and you make ${gbp(0)} profit. Add the profit each on top.`
          if (value === e + P) return `You put the whole ${gbp(P)} profit on EVERY ${stock.item}. Share the ${gbp(P)} between the ${n} first: ${gbp(P)} ÷ ${n}.`
          return `At ${gbp(value)} each, ${n} sold = ${gbp(takings)} in. Minus the ${gbp(C)} they cost = ${result}, not ${gbp(P)}. Price = cost each + (${gbp(P)} ÷ ${n}).`
        },
        cash: { amount: n * s, note: 'sold out' },
      },
    ],
    close: [],
    chain: [
      { line: `\\text{Each} = [[c:${tex(C)}]] \\div [[n:${n}]]` },
      { line: `\\text{Each} = [[e:${tex(e)}]]`, op: `÷ ${n}`, merge: { e: ['c', 'n'] }, why: `The ${gbp(C)} bill shared equally between ${n} ${stock.items}.` },
      { line: `\\text{Profit each} = [[p:${tex(P)}]] \\div [[k:${n}]]`, op: 'Share the profit', why: `Ziggy wants ${gbp(P)} altogether, so each of the ${n} has to carry an equal slice.` },
      { line: `\\text{Profit each} = [[m:${tex(m)}]]`, op: `÷ ${n}`, merge: { m: ['p', 'k'] }, why: `${gbp(P)} ÷ ${n} = ${gbp(m)} on top of every ${stock.item}.` },
      { line: `\\text{Price} = [[e2:${tex(e)}]] + [[m:${tex(m)}]]`, op: 'Cost + profit', why: `Each one pays back its own ${gbp(e)} cost, plus its ${gbp(m)} slice of the profit.` },
      { line: `\\text{Price} = [[s:${tex(s)}]]`, op: 'Add', merge: { s: ['e2', 'm'] }, why: `${gbp(e)} + ${gbp(m)} = ${gbp(s)}. Check: ${n} × ${gbp(s)} = ${gbp(n * s)} in, − ${gbp(C)} out = ${gbp(P)} profit.` },
    ],
  }
}

function day3(stock: Stock, v: Numbers): Day {
  const { h, w, wage, U, x, d, D, worth } = v
  const extra = D * x
  return {
    id: 'upgrade',
    title: 'Day 3 · Upgrade or not?',
    headline: `Hire a helper. Think about a ${stock.upgrade}.`,
    why: `Wages are a rate: the same money for every hour, so pay = rate × hours. An upgrade pays for itself once its extra money adds up to what it cost: cost ÷ extra a day. If the market closes before that, you’re out of pocket.`,
    steps: [
      {
        kind: 'wage', label: 'Pay', asker: 'in £', commit: 'Pay them',
        prompt: `Your helper works ${h} hours at ${gbp(w)} an hour. What’s their pay?`,
        answer: wage, start: 0, min: 0, max: 120, step: 1, jump: 5, money: true,
        why: `${h} hours × ${gbp(w)} = ${gbp(wage)}. Every hour earns the same ${gbp(w)}.`,
        nope: value => {
          if (value === h + w) return `That’s ${h} + ${w}. They get ${gbp(w)} for EVERY hour, so it’s ${h} lots of ${gbp(w)}: multiply.`
          if (value === w) return `That’s one hour’s pay. They worked ${h} hours, and every hour earns ${gbp(w)}.`
          if (value === 0) return `Working for free? Not on Ziggy’s watch. Pay = ${gbp(w)} an hour × ${h} hours.`
          return value < wage
            ? `${gbp(value)} is less than ${h} lots of ${gbp(w)}. Underpaid! Pay = rate × hours.`
            : `${gbp(value)} is more than ${h} lots of ${gbp(w)}. Ziggy’s crying. Pay = rate × hours.`
        },
        cash: { amount: -wage, note: 'helper’s pay' },
      },
      {
        kind: 'payback', label: 'Days', asker: 'in days', commit: 'Check it',
        prompt: `A ${stock.upgrade} costs ${gbp(U)} and brings in ${gbp(x)} extra profit a day. How many days to pay for itself?`,
        answer: d, start: 0, min: 0, max: 20, step: 1, money: false,
        why: `${gbp(U)} ÷ ${gbp(x)} = ${d}. After ${plural(d, 'day', 'days')}, the extra ${gbp(x)}s add up to the ${gbp(U)} it cost.`,
        nope: value => {
          if (value === 0) return `It doesn’t pay for itself straight away! See how many ${gbp(x)}s it takes to make ${gbp(U)}: divide.`
          const made = value * x
          return made < U
            ? `${plural(value, 'day', 'days')} × ${gbp(x)} = ${gbp(made)}, still ${gbp(U - made)} short of the ${gbp(U)} it cost. Cost ÷ extra a day.`
            : `${plural(value, 'day', 'days')} × ${gbp(x)} = ${gbp(made)}, more than the ${gbp(U)} it cost: it paid off sooner. Cost ÷ extra a day.`
        },
      },
      {
        kind: 'worth', asker: 'yes or no',
        prompt: `The market only runs ${D} more days. Is the ${stock.upgrade} worth it?`,
        answer: worth ? 'yes' : 'no',
        choices: [
          { value: 'yes', label: '✅ Buy it', nope: `It takes ${d} days to pay back, but there are only ${D} left. ${D} × ${gbp(x)} = ${gbp(extra)}, less than the ${gbp(U)} it costs: you’d lose ${gbp(U - extra)}.` },
          { value: 'no', label: '🚫 Skip it', nope: `It pays back in ${d} days and there are ${D} left. ${D} × ${gbp(x)} = ${gbp(extra)}, which beats the ${gbp(U)} cost by ${gbp(extra - U)}. Free money!` },
        ],
        why: worth
          ? `${D} days × ${gbp(x)} = ${gbp(extra)} extra, more than the ${gbp(U)} it costs. ${gbp(extra - U)} clear profit.`
          : `${D} days × ${gbp(x)} = ${gbp(extra)} extra, less than the ${gbp(U)} it costs. Buying it would lose ${gbp(U - extra)}.`,
        cash: worth ? { amount: -U, note: stock.upgrade } : undefined,
      },
    ],
    // Same stock at the same price as day 2 makes the same profit again, so the day isn't all spending.
    close: [{ amount: v.P, note: 'day 3 sales' }, ...(worth ? [{ amount: extra, note: `${stock.upgrade}, ${D} days` }] : [])],
    chain: [
      { line: `\\text{Pay} = [[h:${h}]] \\times [[w:${tex(w)}]]` },
      { line: `\\text{Pay} = [[y:${tex(wage)}]]`, op: 'Rate × hours', merge: { y: ['h', 'w'] }, why: `${gbp(w)} for each of the ${h} hours: ${h} × ${gbp(w)} = ${gbp(wage)}.` },
      { line: `\\text{Days} = [[u:${tex(U)}]] \\div [[x:${tex(x)}]]`, op: 'Cost ÷ extra', why: `Each day chips ${gbp(x)} off the ${gbp(U)} it cost. How many ${gbp(x)}s make ${gbp(U)}?` },
      { line: `\\text{Days} = [[d:${d}]]`, op: `÷ ${gbp(x)}`, merge: { d: ['u', 'x'] }, why: `${gbp(U)} ÷ ${gbp(x)} = ${d}. It breaks even after ${plural(d, 'day', 'days')}.` },
      { line: `\\text{Extra} = [[g:${D}]] \\times [[z:${tex(x)}]]`, op: `${D} days left`, why: `The market only runs ${D} more days, each bringing ${gbp(x)} extra.` },
      { line: `\\text{Extra} = [[r:${tex(extra)}]]`, op: 'Multiply', merge: { r: ['g', 'z'] }, why: worth
        ? `${gbp(extra)} beats the ${gbp(U)} it cost, so it pays for itself with ${gbp(extra - U)} to spare. Buy it.`
        : `${gbp(extra)} is less than the ${gbp(U)} it cost, so you’d lose ${gbp(U - extra)}. Skip it.` },
    ],
  }
}

function day4(stock: Stock, v: Numbers): Day {
  const { s, r, F, bill, r2, Y, e } = v
  const goods = r * s, goods2 = Y - F
  return {
    id: 'orders',
    title: 'Day 4 · Big orders',
    headline: 'A café wants your stock. Delivered.',
    why: `A bill with a fixed charge has two parts: price each × how many, then the fixed charge on top once. Working backwards undoes that in reverse order. Take the fixed charge off first, then divide by the price each.`,
    steps: [
      {
        kind: 'bill', label: 'Bill', asker: 'in £', commit: 'Send the bill',
        prompt: `A café orders ${r} ${stock.items} at your price of ${gbp(s)} each. Delivery is a flat ${gbp(F)}. What’s the bill?`,
        answer: bill, start: 0, min: 0, max: 200, step: 0.5, jump: 5, money: true,
        why: `${r} × ${gbp(s)} = ${gbp(goods)}, plus ${gbp(F)} delivery = ${gbp(bill)}.`,
        nope: value => {
          if (value === goods) return `That’s just the ${stock.items}: ${r} × ${gbp(s)} = ${gbp(goods)}. You forgot the ${gbp(F)} delivery on top.`
          if (value === r * (s + F)) return `That charges ${gbp(F)} delivery on EVERY ${stock.item}. Delivery is one flat ${gbp(F)} for the whole order: ${gbp(goods)} + ${gbp(F)}.`
          if (value === s + F) return `That’s one ${stock.item} plus delivery. They ordered ${r}: ${r} × ${gbp(s)} first, then + ${gbp(F)}.`
          if (value === r + s + F) return `That’s ${r} + ${gbp(s)} + ${gbp(F)}. The ${r} ${stock.items} each cost ${gbp(s)}, so multiply first: ${r} × ${gbp(s)}, then + ${gbp(F)}.`
          if (value === 0) return `Free stock? Ziggy faints. ${r} × ${gbp(s)}, then add the ${gbp(F)} delivery.`
          return value < bill
            ? `${gbp(value)} is too little: ${r} × ${gbp(s)} is already ${gbp(goods)} before delivery. Price × how many, then + ${gbp(F)}.`
            : `${gbp(value)} is too much. ${r} × ${gbp(s)} = ${gbp(goods)}, and delivery is only ${gbp(F)} on top.`
        },
        cash: { amount: bill, note: 'café order' },
      },
      {
        kind: 'order', label: 'How many', asker: 'in items', commit: 'Pack the order',
        prompt: `Next day the café pays ${gbp(Y)} for another order, same price, same ${gbp(F)} delivery. How many ${stock.items} did they order?`,
        answer: r2, start: 0, min: 0, max: 60, step: 1, jump: 10, money: false,
        why: `${gbp(Y)} − ${gbp(F)} delivery = ${gbp(goods2)} of ${stock.items}. ${gbp(goods2)} ÷ ${gbp(s)} = ${r2}. Check: ${r2} × ${gbp(s)} + ${gbp(F)} = ${gbp(Y)}.`,
        nope: value => {
          if (value === Y / s) return `That’s ${gbp(Y)} ÷ ${gbp(s)}, but ${gbp(F)} of that was delivery, not ${stock.items}. Take the delivery off FIRST, then divide.`
          if (value === (Y + F) / s) return `You added the delivery on. Working backwards, you undo it: ${gbp(Y)} − ${gbp(F)} first, then ÷ ${gbp(s)}.`
          if (value === goods2) return `${gbp(goods2)} is the money for the ${stock.items}. How many ${gbp(s)}s is that? Divide by ${gbp(s)}.`
          if (value === 0) return `They paid ${gbp(Y)}, so they ordered something! Take off the ${gbp(F)} delivery, then ÷ ${gbp(s)}.`
          const cost = value * s + F
          return `Check it: ${value} × ${gbp(s)} + ${gbp(F)} = ${gbp(cost)}, not ${gbp(Y)}. Take the ${gbp(F)} off ${gbp(Y)}, then ÷ ${gbp(s)}.`
        },
        cash: { amount: Y, note: 'second order' },
      },
    ],
    // The orders came out of Ziggy's stock at the day 2 cost price, so he restocks.
    close: [{ amount: -(r + r2) * e, note: `restock ${r + r2} at ${gbp(e)}` }],
    chain: [
      { line: `\\text{Bill} = [[r:${r}]] \\times [[s:${tex(s)}]] + [[f:${tex(F)}]]` },
      { line: `\\text{Bill} = [[a:${tex(goods)}]] + [[f:${tex(F)}]]`, op: 'Multiply first', merge: { a: ['r', 's'] }, why: `${r} × ${gbp(s)} = ${gbp(goods)} for the ${stock.items}.` },
      { line: `\\text{Bill} = [[b:${tex(bill)}]]`, op: 'Add delivery', merge: { b: ['a', 'f'] }, why: `Delivery goes on once: ${gbp(goods)} + ${gbp(F)} = ${gbp(bill)}.` },
      { line: `\\text{Goods} = [[y:${tex(Y)}]] - [[g:${tex(F)}]]`, op: 'Work backwards', why: `Order 2 cost ${gbp(Y)}. Undo the last step first: take the ${gbp(F)} delivery off.` },
      { line: `\\text{Goods} = [[o:${tex(goods2)}]]`, op: 'Take away', merge: { o: ['y', 'g'] }, why: `${gbp(Y)} − ${gbp(F)} = ${gbp(goods2)}, just for the ${stock.items}.` },
      { line: `\\text{Items} = [[o:${tex(goods2)}]] \\div [[p:${tex(s)}]]`, op: '÷ price each', why: `Then undo the × : how many ${gbp(s)}s make ${gbp(goods2)}?` },
      { line: `\\text{Items} = [[n:${r2}]]`, op: 'Divide', merge: { n: ['o', 'p'] }, why: `${gbp(goods2)} ÷ ${gbp(s)} = ${r2}. Check: ${r2} × ${gbp(s)} + ${gbp(F)} = ${gbp(Y)}.` },
    ],
  }
}

const FRACTIONS: Record<string, string> = { '1/4': 'a quarter', '3/4': 'three quarters', '1/3': 'a third', '2/3': 'two thirds', '2/5': 'two fifths', '3/5': 'three fifths', '4/5': 'four fifths' }
export const fractionWords = (fa: number, fb: number) => FRACTIONS[`${fa}/${fb}`] ?? `${fa}/${fb}`

function day5(stock: Stock, v: Numbers): Day {
  const { s, g, K, fa, fb, f, z, T, gain } = v
  const rest = g - f, part = g / fb
  const full = f * s, clear = rest * z
  const frac = fractionWords(fa, fb), Frac = `${frac[0].toUpperCase()}${frac.slice(1)}`
  return {
    id: 'clearout',
    title: 'Day 5 · Boss: Clear-out',
    headline: 'Last day. Sell the lot. Did it pay?',
    why: `To find a fraction of an amount, divide by the bottom number, then times by the top. Takings add up every sale at its own price. Profit is money in − money out, the same as every day.`,
    steps: [
      {
        kind: 'portion', label: 'Full price', asker: 'in items', commit: 'Sort the stock',
        prompt: `Ziggy buys ${g} more ${stock.items} for ${gbp(K)}. He reckons ${frac} will sell at full price (${gbp(s)}). How many is that?`,
        answer: f, start: 0, min: 0, max: 60, step: 1, jump: 10, money: false,
        why: `${Frac} of ${g}: ${g} ÷ ${fb} = ${part}, × ${fa} = ${f}.`,
        nope: value => {
          if (value === part && fa !== 1) return `That’s ${g} ÷ ${fb}, which is only ONE ${fb === 3 ? 'third' : fb === 4 ? 'quarter' : 'fifth'}. You need ${fa} of them: × ${fa}.`
          if (value === rest) return `That’s the ones left over for the clear-out. ${Frac} of ${g} is ${g} ÷ ${fb} × ${fa}.`
          if (value === g * fa) return `That’s ${g} × ${fa}, more than he bought! Divide by the bottom (${fb}) first, then × ${fa}.`
          if (value === 0) return `Nothing at full price? Find ${frac} of ${g}: ÷ ${fb}, then × ${fa}.`
          return `${value} isn’t ${frac} of ${g}. Divide by the bottom: ${g} ÷ ${fb} = ${part}. Then × the top, ${fa}.`
        },
        cash: { amount: -K, note: 'bulk stock' },
      },
      {
        kind: 'takings', label: 'Takings', asker: 'in £', commit: 'Count the till',
        prompt: `${f} sell at ${gbp(s)}. The other ${rest} go in the clear-out at ${gbp(z)} each. What are the takings?`,
        answer: T, start: 0, min: 0, max: 300, step: 0.5, jump: 5, money: true,
        why: `${f} × ${gbp(s)} = ${gbp(full)}. ${rest} × ${gbp(z)} = ${gbp(clear)}. Together: ${gbp(T)}.`,
        nope: value => {
          if (value === full) return `That’s only the full-price ones. The ${rest} clear-out ${stock.items} bring in ${rest} × ${gbp(z)} = ${gbp(clear)} too: add it on.`
          if (value === clear) return `That’s only the clear-out. The ${f} full-price sales bring in ${f} × ${gbp(s)} = ${gbp(full)} too.`
          if (value === g * s) return `That sells all ${g} at full price. Only ${f} went for ${gbp(s)}; the other ${rest} went for ${gbp(z)}.`
          if (value === f * z + rest * s) return `You swapped the prices. ${f} at ${gbp(s)}, and the ${rest} leftovers at the cheap ${gbp(z)}.`
          if (value === g * z) return `That sells everything at the clear-out price. Only the ${rest} leftovers went for ${gbp(z)}.`
          return value < T
            ? `Not enough in the till. Do each price separately: ${f} × ${gbp(s)}, then ${rest} × ${gbp(z)}, then add.`
            : `Too much in the till. Do each price separately: ${f} × ${gbp(s)}, then ${rest} × ${gbp(z)}, then add.`
        },
        cash: { amount: T, note: 'clear-out takings' },
      },
      {
        kind: 'profit', label: 'Profit', asker: 'in £', commit: 'Cash up',
        prompt: `The ${g} ${stock.items} cost ${gbp(K)}. What profit did today’s stock make?`,
        answer: gain, start: 0, min: 0, max: 200, step: 0.5, jump: 5, money: true,
        why: `Money in − money out: ${gbp(T)} − ${gbp(K)} = ${gbp(gain)} profit.`,
        nope: value => {
          if (value === T) return `That’s the takings. Some of that just pays back the ${gbp(K)} the stock cost: ${gbp(T)} − ${gbp(K)}.`
          if (value === T + K) return `You added the cost on. Cost is money OUT, so take it away: ${gbp(T)} − ${gbp(K)}.`
          if (value === K) return `${gbp(K)} is what the stock cost. Profit is what’s left of the ${gbp(T)} takings after paying that.`
          if (value === full - K) return `You left out the clear-out money. Takings were ${gbp(T)} in total: ${gbp(T)} − ${gbp(K)}.`
          if (value === 0) return `Broke even? Check: ${gbp(T)} in, ${gbp(K)} out.`
          return `Profit = money in − money out = ${gbp(T)} − ${gbp(K)}. ${gbp(value)} isn’t it.`
        },
      },
    ],
    close: [],
    chain: [
      { line: `\\text{Full} = [[g:${g}]] [[b:\\div ${fb}]] [[a:\\times ${fa}]]` },
      { line: `\\text{Full} = [[f:${f}]]`, op: `÷ ${fb}, × ${fa}`, merge: { f: ['g', 'b', 'a'] }, why: `${Frac} of ${g}: ${g} ÷ ${fb} = ${part}, then × ${fa} = ${f}.` },
      { line: `\\text{Rest} = [[g2:${g}]] - [[f:${f}]]`, op: 'The rest', why: `Whatever doesn’t sell at full price goes in the clear-out.` },
      { line: `\\text{Rest} = [[l:${rest}]]`, op: 'Take away', merge: { l: ['g2', 'f'] }, why: `${g} − ${f} = ${rest} for the clear-out.` },
      { line: `\\text{In} = [[u:${tex(full)}]] + [[v:${tex(clear)}]]`, op: 'Each price', why: `${f} × ${gbp(s)} = ${gbp(full)} and ${rest} × ${gbp(z)} = ${gbp(clear)}.` },
      { line: `\\text{In} = [[i:${tex(T)}]]`, op: 'Add', merge: { i: ['u', 'v'] }, why: `${gbp(full)} + ${gbp(clear)} = ${gbp(T)} takings.` },
      { line: `\\text{Profit} = [[i:${tex(T)}]] - [[k:${tex(K)}]]`, op: 'In − out', why: `The stock cost ${gbp(K)}: that’s the money out.` },
      { line: `\\text{Profit} = [[p:${tex(gain)}]]`, op: 'Take away', merge: { p: ['i', 'k'] }, why: `${gbp(T)} − ${gbp(K)} = ${gbp(gain)} profit. Tycoon.` },
    ],
  }
}

export function makeStall(rand: Rand): Stall {
  const n = numbers(rand)
  // Picked after the numbers: nearby seeds share their first draw, and the stock should vary.
  const stock = rand.pick(STOCKS)
  return { stock, n, days: [day1(stock, n), day2(stock, n), day3(stock, n), day4(stock, n), day5(stock, n)] }
}

/**
 * The money that has landed so far: every right step before this one in this day and earlier days,
 * this step too once it's right, and the day's closing takings once it's over.
 */
export function entriesSoFar(stall: Stall, day: number, step: number, closed: boolean): Entry[] {
  const out: Entry[] = []
  stall.days.forEach((each, i) => {
    if (i > day) return
    each.steps.forEach((candidate, j) => { if (candidate.cash && (i < day || j < step)) out.push(candidate.cash) })
    if (i < day || closed) out.push(...each.close)
  })
  return out
}

export const cashOf = (stall: Stall, entries: Entry[]) => entries.reduce((sum, entry) => sum + entry.amount, stall.n.start)
