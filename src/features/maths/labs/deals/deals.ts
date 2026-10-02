import type { ChainStep } from '../../step-chain/StepChain'
import { gbp, options, texGbp, whole, type Option, type Rand } from '../kit/random'

export type Item = { emoji: string; name: string }
export type Kind = 'off' | 'versus' | 'rise'
/** What a right answer adds to the price tags: the £ change, the final price, or the REAL DEAL / STEAL stamps. */
export type Shows = 'change' | 'final' | 'verdict'

export type Question = {
  prompt: string
  answer: number | string
  choices: Option<number | string>[]
  why: string
  shows: Shows
}

export type Round = {
  id: string
  kind: Kind
  title: string
  heading: string
  why: string
  item: Item
  /** The full price (100%), the percentage and the £ it comes to. */
  price: number
  percent: number
  change: number
  /** Price after the discount or increase. */
  final: number
  /** Round 2 only: Shop B's flat price, and which shop is cheaper. */
  rival?: number
  cheaper?: 'A' | 'B'
  questions: Question[]
  chain: ChainStep[]
}

const ITEMS: Item[] = [
  { emoji: '👟', name: 'Trainers' },
  { emoji: '🎧', name: 'Headphones' },
  { emoji: '🧥', name: 'Puffer jacket' },
  { emoji: '🎮', name: 'Controller' },
  { emoji: '⌚', name: 'Smartwatch' },
  { emoji: '🛹', name: 'Skateboard' },
  { emoji: '🎒', name: 'Backpack' },
  { emoji: '🔊', name: 'Speaker' },
]

// 10%, 25% and 50% are one division; 20% is 10% doubled. Prices are multiples of £20, so every one is whole pounds.
const PERCENTS = [10, 20, 25, 50]

/** The route to p% of £P in words, matching the chain: "£80 ÷ 10 = £8, then × 2 = £16". */
export function route(price: number, percent: number) {
  const change = price * percent / 100
  if (percent === 10) return `10% is ${gbp(price)} ÷ 10 = ${gbp(change)}`
  if (percent === 20) return `10% is ${gbp(price)} ÷ 10 = ${gbp(price / 10)}, so 20% is ${gbp(price / 10)} × 2 = ${gbp(change)}`
  if (percent === 25) return `25% is a quarter: ${gbp(price)} ÷ 4 = ${gbp(change)}`
  return `50% is half: ${gbp(price)} ÷ 2 = ${gbp(change)}`
}

/** Why the method works, for a round's intro. */
function share(percent: number) {
  if (percent === 10) return 'one tenth of it, so ÷ 10'
  if (percent === 20) return 'two tenths of it, so ÷ 10 then × 2'
  if (percent === 25) return 'a quarter of it, so ÷ 4'
  return 'half of it, so ÷ 2'
}

/** The chain lines that find p% of £P, ending on `p% = £change` under the key `e`. */
function percentLines(price: number, percent: number): ChainStep[] {
  const change = price * percent / 100
  const P = texGbp(price)
  if (percent === 25 || percent === 50) {
    const by = percent === 25 ? 4 : 2
    return [
      { line: `${percent}\\% = [[a:${P}]] [[b:\\div ${by}]]` },
      { line: `${percent}\\% = [[e:${texGbp(change)}]]`, op: 'Work it out', merge: { e: ['a', 'b'] }, why: `${by} lots of ${percent}% make 100%, so ${percent}% is ${gbp(price)} ÷ ${by} = ${gbp(change)}.` },
    ]
  }
  const tenth = price / 10
  const lines: ChainStep[] = [
    { line: `10\\% = [[a:${P}]] [[b:\\div 10]]` },
    { line: `10\\% = [[${percent === 10 ? 'e' : 't'}:${texGbp(tenth)}]]`, op: 'Work it out', merge: { [percent === 10 ? 'e' : 't']: ['a', 'b'] }, why: `The full price is 100%, and 10 lots of 10% make 100%. So 10% is ${gbp(price)} ÷ 10 = ${gbp(tenth)}.` },
  ]
  if (percent === 20) lines.push(
    { line: `20\\% = [[t:${texGbp(tenth)}]] [[d:\\times 2]]`, op: '× 2', why: '20% is two lots of 10%, so double it.' },
    { line: `20\\% = [[e:${texGbp(change)}]]`, op: 'Work it out', merge: { e: ['t', 'd'] }, why: `${gbp(tenth)} × 2 = ${gbp(change)}.` },
  )
  return lines
}

const money = (rand: Rand, answer: number, wrongs: { value: number; nope: string }[]) =>
  options<number | string>(rand, { value: answer, label: gbp(answer) }, wrongs.map(wrong => ({ ...wrong, label: gbp(wrong.value) })), { valid: value => whole(value as number) })

/** Another percentage the student might have found by mistake: 10% when it was 20%, or 20% when it was 10%. */
const otherPercent = (percent: number) => percent === 10 ? 20 : 10

/** Questions about the £ change (discount or increase): the same slips either way. */
function changeQuestion(rand: Rand, price: number, percent: number, kind: 'off' | 'rise'): Question {
  const change = price * percent / 100
  const final = kind === 'off' ? price - change : price + change
  const other = otherPercent(percent)
  const word = kind === 'off' ? 'discount' : 'increase'
  const how = route(price, percent)
  return {
    prompt: kind === 'off' ? 'How much is the discount?' : 'How much is the increase?',
    answer: change,
    shows: 'change',
    why: `${how}. That’s the ${word}.`,
    choices: money(rand, change, [
      { value: percent, nope: `That’s just the ${percent} from ${percent}%. A percentage isn’t pounds, it’s a share of the price: ${how}.` },
      { value: final, nope: `That’s the ${kind === 'off' ? 'price you’d pay' : 'new price'}, not the ${word}. The ${word} is just the ${percent}% part: ${how}.` },
      { value: price * other / 100, nope: `That’s ${other}%, but this is ${percent}%. ${how}.` },
      { value: price / percent, nope: `That’s ${gbp(price)} ÷ ${percent}. Don’t divide by the percentage: ${how}.` },
      { value: price * percent, nope: `That’s ${gbp(price)} × ${percent}, way more than the whole price! The ${word} is a part of it: ${how}.` },
    ]),
  }
}

function finalQuestion(rand: Rand, price: number, percent: number, kind: 'off' | 'rise'): Question {
  const change = price * percent / 100
  const off = kind === 'off'
  const final = off ? price - change : price + change
  const sum = `${gbp(price)} ${off ? '−' : '+'} ${gbp(change)} = ${gbp(final)}`
  const tenPrice = off ? price - price / 10 : price + price / 10
  return {
    prompt: off ? 'So what do you actually pay?' : 'So what’s the new price?',
    answer: final,
    shows: 'final',
    why: off ? `Take the discount off the full price: ${sum}.` : `Add the increase on to the old price: ${sum}.`,
    choices: money(rand, final, [
      { value: off ? price - percent : price + percent, nope: `That’s ${gbp(price)} ${off ? '−' : '+'} ${gbp(percent)}. But ${percent}% isn’t ${gbp(percent)}, it’s ${percent}% of ${gbp(price)}, which is ${gbp(change)}. So ${sum}.` },
      { value: change, nope: `That’s the ${off ? 'discount' : 'increase'} on its own. ${off ? 'You pay what’s left' : 'The new price is the old one plus that'}: ${sum}.` },
      { value: off ? price + change : price - change, nope: off ? `That’s adding the discount on! A discount comes OFF: ${sum}.` : `That’s taking it off! An increase goes ON: ${sum}.` },
      ...(percent === 10 ? [] : [{ value: tenPrice, nope: `That’s only 10% ${off ? 'off' : 'on'}. It was ${percent}%, which is ${gbp(change)}: ${sum}.` }]),
    ]),
  }
}

const the = (item: Item) => `the ${item.name.toLowerCase()}`

export function makeDeals(rand: Rand): Round[] {
  const [one, two, three] = rand.shuffle(ITEMS)
  const [p1, p2, p3] = rand.shuffle(PERCENTS)
  const price = () => rand.int(40, 200, 20)

  // Round 1: % off.
  const P1 = price(), d1 = P1 * p1 / 100, f1 = P1 - d1
  const off: Round = {
    id: 'off', kind: 'off', title: 'Round 1 · % off', item: one,
    heading: `MEGA DEAL!!! ${p1}% off ${the(one)}!!!`,
    why: `% means “out of 100”. The full ${gbp(P1)} is 100%, and ${p1}% is ${share(p1)}. Find that bit first, then take it off. That’s the real price.`,
    price: P1, percent: p1, change: d1, final: f1,
    questions: [changeQuestion(rand, P1, p1, 'off'), finalQuestion(rand, P1, p1, 'off')],
    chain: [
      ...percentLines(P1, p1),
      { line: `\\text{Pay} = [[f:${texGbp(P1)}]] - [[e:${texGbp(d1)}]]`, op: 'Take it off', why: `It’s a discount, so the ${gbp(d1)} comes off the full price.` },
      { line: `\\text{Pay} = [[h:${texGbp(f1)}]]`, op: 'Work it out', merge: { h: ['f', 'e'] }, why: `${gbp(P1)} − ${gbp(d1)} = ${gbp(f1)}. That’s what you really pay.` },
    ],
  }

  // Round 2: Shop A has the % sticker, Shop B a flat price within £10 of A's sale price (a multiple of £5, never equal).
  const P2 = price(), d2 = P2 * p2 / 100, f2 = P2 - d2
  const cheaper = rand.chance(.5) ? 'A' : 'B'
  const near = [0, 5, 10, 15, 20].map(step => Math.ceil((f2 - 10) / 5) * 5 + step)
    .filter(value => Math.abs(value - f2) <= 10 && (cheaper === 'A' ? value > f2 : value < f2) && value > 0)
  const Q = rand.pick(near)
  const gap = Math.abs(Q - f2)
  const versusWhy = cheaper === 'A'
    ? `Shop A is ${gbp(f2)} and Shop B is ${gbp(Q)}. Shop A is ${gbp(gap)} cheaper: a real deal.`
    : `Shop A is ${gbp(f2)} and Shop B is ${gbp(Q)}. The big sticker loses: Shop B is ${gbp(gap)} cheaper.`
  const sign = cheaper === 'A' ? '<' : '>'
  const versus: Round = {
    id: 'versus', kind: 'versus', title: 'Round 2 · Real deal or steal?', item: two,
    heading: `Shop A: ${gbp(P2)}, ${p2}% off. Shop B: just ${gbp(Q)}.`,
    why: 'A giant % sticker doesn’t mean a low price. Turn the % into pounds, find what you’d actually pay at Shop A, then compare pounds with pounds.',
    price: P2, percent: p2, change: d2, final: f2, rival: Q, cheaper,
    questions: [
      { ...finalQuestion(rand, P2, p2, 'off'), prompt: `What does Shop A really charge, after ${p2}% off?`, why: `${route(P2, p2)}, so Shop A is ${gbp(P2)} − ${gbp(d2)} = ${gbp(f2)}.` },
      {
        prompt: 'So which shop is cheaper?',
        answer: cheaper,
        shows: 'verdict',
        why: versusWhy,
        choices: [
          { value: 'A', label: 'Shop A', nope: `Shop A’s ${p2}% off still leaves ${gbp(f2)}. Shop B is just ${gbp(Q)}, which is ${gbp(gap)} less. Big sticker, bigger price.` },
          { value: 'B', label: 'Shop B', nope: `Shop B is ${gbp(Q)}, but Shop A is only ${gbp(f2)} once the ${p2}% comes off. That’s ${gbp(gap)} less, so Shop A wins.` },
        ],
      },
    ],
    chain: [
      ...percentLines(P2, p2),
      { line: `\\text{A} = [[f:${texGbp(P2)}]] - [[e:${texGbp(d2)}]]`, op: 'Take it off', why: `Shop A’s discount is ${gbp(d2)}, so it comes off the ${gbp(P2)}.` },
      { line: `\\text{A} = [[h:${texGbp(f2)}]]`, op: 'Work it out', merge: { h: ['f', 'e'] }, why: `${gbp(P2)} − ${gbp(d2)} = ${gbp(f2)}. That’s Shop A’s real price.` },
      { line: `\\text{A} = [[h:${texGbp(f2)}]] ${sign} [[q:${texGbp(Q)}]]`, op: 'Compare with B', why: versusWhy },
    ],
  }

  // Round 3: a price rise.
  const P3 = price(), d3 = P3 * p3 / 100, f3 = P3 + d3
  const rise: Round = {
    id: 'rise', kind: 'rise', title: 'Round 3 · Price rise', item: three,
    heading: `NEW IMPROVED ${three.name.toUpperCase()}!!! Was ${gbp(P3)}, now ${p3}% MORE!!!`,
    why: `An increase works the same way, just the other direction. The old ${gbp(P3)} is 100%, ${p3}% is ${share(p3)}. Find it, then ADD it on.`,
    price: P3, percent: p3, change: d3, final: f3,
    questions: [changeQuestion(rand, P3, p3, 'rise'), finalQuestion(rand, P3, p3, 'rise')],
    chain: [
      ...percentLines(P3, p3),
      { line: `\\text{New} = [[f:${texGbp(P3)}]] + [[e:${texGbp(d3)}]]`, op: 'Add it on', why: `It’s an increase, so the ${gbp(d3)} goes on top of the old price.` },
      { line: `\\text{New} = [[h:${texGbp(f3)}]]`, op: 'Work it out', merge: { h: ['f', 'e'] }, why: `${gbp(P3)} + ${gbp(d3)} = ${gbp(f3)}. Same item, more money.` },
    ],
  }

  return [off, versus, rise]
}
