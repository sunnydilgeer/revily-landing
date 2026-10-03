import type { ChainStep } from '../../step-chain/StepChain'
import { gbp, texGbp, type Option, type Rand } from '../kit/random'

/*
 * Ziggy's market stall, three days of it. Prices are 50p steps up to £10, quantities in 5s and 10s,
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
}

export type Kind = 'buy' | 'change' | 'each' | 'price' | 'wage' | 'payback'
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
    return { start, c, B, q, p, k, t, N, change, n, C, e, P, m, s, h, w, wage, U, x, d, D, worth }
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
        answer: change, start: 0, min: 0, max: N, step: 0.5, money: true,
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
        answer: e, start: 0, min: 0, max: 10, step: 0.5, money: true,
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
        answer: s, start: e, min: 0, max: 15, step: 0.5, money: true,
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
        answer: wage, start: 0, min: 0, max: 120, step: 1, money: true,
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

export function makeStall(rand: Rand): Stall {
  const n = numbers(rand)
  // Picked after the numbers: nearby seeds share their first draw, and the stock should vary.
  const stock = rand.pick(STOCKS)
  return { stock, n, days: [day1(stock, n), day2(stock, n), day3(stock, n)] }
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
