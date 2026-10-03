import type { ChainStep } from '../../step-chain/StepChain'
import { gbp, options, texGbp, whole, type Option, type Rand } from '../kit/random'

export type Item = { emoji: string; name: string }
export type Kind = 'off' | 'versus' | 'rise' | 'claim'
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
  /** Round 5 only: the % off Sal's sticker claims (the real one is `percent`). */
  claim?: number
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

// Round 4's percentages: built from 10% (÷ 10) and 5% (half of 10%). Prices are multiples of £20, so 5% is whole pounds.
const BUILT = [15, 30, 35, 40, 45, 60, 65]

/** The route to p% of £P in words, matching the chain: "£80 ÷ 10 = £8, then × 2 = £16". */
export function route(price: number, percent: number) {
  const change = price * percent / 100
  if (BUILT.includes(percent)) {
    const tenth = price / 10, tens = Math.floor(percent / 10), five = percent % 10 === 5
    const big = tenth * tens
    const steps = [`10% is ${gbp(price)} ÷ 10 = ${gbp(tenth)}`]
    if (tens > 1) steps.push(`${tens * 10}% is ${gbp(tenth)} × ${tens} = ${gbp(big)}`)
    if (five) steps.push(`5% is half of ${gbp(tenth)} = ${gbp(tenth / 2)}`, `${percent}% is ${gbp(big)} + ${gbp(tenth / 2)} = ${gbp(change)}`)
    return steps.join(', ')
  }
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
  if (BUILT.includes(percent)) return `${percent % 10 === 5 ? 'built from 10% (÷ 10) and 5% (half of that)' : `${percent / 10} lots of 10%`}`
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
  if (BUILT.includes(percent)) {
    const tens = Math.floor(percent / 10), five = percent % 10 === 5
    const big = tenth * tens, half = tenth / 2
    // The 10s part lands on `u` (or `e` when there's no 5% to add).
    const bigKey = five ? 'u' : 'e'
    if (tens > 1) lines.push(
      { line: `${tens * 10}\\% = [[t:${texGbp(tenth)}]] [[d:\\times ${tens}]]`, op: `× ${tens}`, why: `${tens * 10}% is ${tens} lots of 10%.` },
      { line: `${tens * 10}\\% = [[${bigKey}:${texGbp(big)}]]`, op: 'Work it out', merge: { [bigKey]: ['t', 'd'] }, why: `${gbp(tenth)} × ${tens} = ${gbp(big)}.` },
    )
    if (five) lines.push(
      { line: `5\\% = [[t2:${texGbp(tenth)}]] [[h:\\div 2]]`, op: 'Halve 10%', why: '5% is half of 10%, so halve it.' },
      { line: `5\\% = [[v:${texGbp(half)}]]`, op: 'Work it out', merge: { v: ['t2', 'h'] }, why: `${gbp(tenth)} ÷ 2 = ${gbp(half)}.` },
      { line: `${percent}\\% = [[${tens > 1 ? 'u' : 't'}:${texGbp(big)}]] + [[v:${texGbp(half)}]]`, op: 'Add them', why: `${percent}% is ${tens * 10}% + 5%.` },
      { line: `${percent}\\% = [[e:${texGbp(change)}]]`, op: 'Work it out', merge: { e: [tens > 1 ? 'u' : 't', 'v'] }, why: `${gbp(big)} + ${gbp(half)} = ${gbp(change)}.` },
    )
    return lines
  }
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

/** Round 4: the £ change for a built-up % (10% and 5% chunks), with the slips you get building it. */
function builtQuestion(rand: Rand, price: number, percent: number, kind: 'off' | 'rise'): Question {
  const change = price * percent / 100
  const final = kind === 'off' ? price - change : price + change
  const tenth = price / 10, tens = Math.floor(percent / 10), five = percent % 10 === 5
  const big = tenth * tens
  const word = kind === 'off' ? 'discount' : 'increase'
  const how = route(price, percent)
  return {
    prompt: kind === 'off' ? `How much is ${percent}% off?` : `How much is the ${percent}% increase?`,
    answer: change,
    shows: 'change',
    why: `${how}. That’s the ${word}.`,
    choices: money(rand, change, [
      ...(five ? [
        { value: big, nope: `That’s only the ${tens * 10}% bit. You still need the 5% on top: ${how}.` },
        { value: big + tenth, nope: `That’s ${(tens + 1) * 10}%: you added another 10% instead of 5%. 5% is HALF of 10%: ${how}.` },
      ] : [
        { value: tenth, nope: `That’s just 10%. ${percent}% is ${tens} lots of it: ${how}.` },
      ]),
      { value: percent, nope: `That’s just the ${percent} from ${percent}%. A percentage isn’t pounds: ${how}.` },
      { value: final, nope: `That’s the ${kind === 'off' ? 'price you’d pay' : 'new price'}, not the ${word}: ${how}.` },
    ]),
  }
}

const the = (item: Item) => `the ${item.name.toLowerCase()}`

export function makeDeals(rand: Rand): Round[] {
  const [one, two, three, four, five] = rand.shuffle(ITEMS)
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

  // Round 4: a % that has to be built from 10% and 5% chunks, as a discount or a rise.
  const P4 = price(), p4 = rand.pick(BUILT), k4 = rand.chance(.6) ? 'off' as const : 'rise' as const
  const d4 = P4 * p4 / 100, f4 = k4 === 'off' ? P4 - d4 : P4 + d4
  const fives = p4 % 10 === 5
  const built: Round = {
    id: 'built', kind: k4, title: 'Round 4 · Build the %', item: four,
    heading: k4 === 'off' ? `FLASH SALE!!! ${p4}% off ${the(four)}!!! Weird number = AMAZING deal!!!` : `PRICE RISE!!! ${p4}% more on ${the(four)}!!! You can’t work THAT out!!!`,
    why: fives
      ? `${p4}% isn’t one easy chunk, so build it from bits. 10% is ÷ 10, and 5% is half of 10%. Add up the bits to make ${p4}%. Then ${k4 === 'off' ? 'take it off' : 'add it on'}.`
      : `${p4}% is ${p4 / 10} lots of 10%. Find 10% by ÷ 10, then × ${p4 / 10}. Then ${k4 === 'off' ? 'take it off' : 'add it on'}.`,
    price: P4, percent: p4, change: d4, final: f4,
    questions: [builtQuestion(rand, P4, p4, k4), finalQuestion(rand, P4, p4, k4)],
    chain: [
      ...percentLines(P4, p4),
      k4 === 'off'
        ? { line: `\\text{Pay} = [[f:${texGbp(P4)}]] - [[e:${texGbp(d4)}]]`, op: 'Take it off', why: `It’s a discount, so the ${gbp(d4)} comes off.` }
        : { line: `\\text{New} = [[f:${texGbp(P4)}]] + [[e:${texGbp(d4)}]]`, op: 'Add it on', why: `It’s an increase, so the ${gbp(d4)} goes on top.` },
      { line: `\\text{${k4 === 'off' ? 'Pay' : 'New'}} = [[h:${texGbp(f4)}]]`, op: 'Work it out', merge: { h: ['f', 'e'] }, why: `${gbp(P4)} ${k4 === 'off' ? '−' : '+'} ${gbp(d4)} = ${gbp(f4)}.` },
    ],
  }

  // Round 5 (boss): was £P, now £S. Work backwards to the real % off and check Sal's sticker.
  // Never £100: then the £ saving IS the %, which gives the game away.
  const P5 = rand.pick([40, 60, 80, 120, 140, 160, 180, 200]), r = rand.pick([10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 75])
  const claim = rand.chance(.3) ? r : Math.min(90, r + rand.pick([10, 15, 20, 25]))
  const d5 = P5 * r / 100, s5 = P5 - d5
  const honest = claim === r
  const checkWhy = honest
    ? `${r}% off, just like the sticker says. Sal told the truth for once.`
    : `It’s really ${r}% off, not ${claim}%. The sticker was a steal.`
  const dec = String(r / 100)
  const wrongDivide = d5 / s5 * 100
  const percentLabel = (value: number) => `${value}%`
  const claimed: Round = {
    id: 'claim', kind: 'claim', title: 'Round 5 · Boss: Fake %?', item: five,
    heading: `Was ${gbp(P5)}, now ${gbp(s5)}!!! That’s ${claim}% OFF!!! (Trust me.)`,
    why: 'A % off is always out of the ORIGINAL price. Find the saving in pounds first. Divide it by the old price, then × 100. If it doesn’t match the sticker, Sal is lying.',
    price: P5, percent: r, change: d5, final: s5, claim,
    questions: [
      {
        prompt: 'How much do you actually save?',
        answer: d5,
        shows: 'change',
        why: `Old price − new price: ${gbp(P5)} − ${gbp(s5)} = ${gbp(d5)}.`,
        choices: money(rand, d5, [
          { value: s5, nope: `${gbp(s5)} is what you pay, not what you save. The saving is the gap: ${gbp(P5)} − ${gbp(s5)} = ${gbp(d5)}.` },
          ...(honest ? [] : [{ value: P5 * claim / 100, nope: `That’s ${claim}% of ${gbp(P5)}, what the sticker CLAIMS. Go by the real prices: ${gbp(P5)} − ${gbp(s5)} = ${gbp(d5)}.` }]),
          { value: P5 + s5, nope: `That’s ${gbp(P5)} + ${gbp(s5)}. The saving is the gap between them: take away, ${gbp(P5)} − ${gbp(s5)} = ${gbp(d5)}.` },
          { value: claim, nope: `That’s just the ${claim} from the sticker. The saving in pounds is ${gbp(P5)} − ${gbp(s5)} = ${gbp(d5)}.` },
          { value: P5, nope: `${gbp(P5)} was the old price. The saving is the gap between old and new: ${gbp(P5)} − ${gbp(s5)} = ${gbp(d5)}.` },
        ]),
      },
      {
        prompt: 'So what % off is it REALLY?',
        answer: r,
        shows: 'verdict',
        why: `${gbp(d5)} ÷ ${gbp(P5)} = ${dec}, and × 100 = ${r}%. ${checkWhy}`,
        choices: options<number | string>(rand, { value: r, label: percentLabel(r) }, [
          ...(honest ? [] : [{ value: claim, label: percentLabel(claim), nope: `That’s just what Sal’s sticker says. Check it: ${gbp(d5)} ÷ ${gbp(P5)} × 100 = ${r}%.` }]),
          { value: wrongDivide, label: percentLabel(wrongDivide), nope: `That’s ${gbp(d5)} ÷ ${gbp(s5)}, the NEW price. A % off is out of the ORIGINAL price: ${gbp(d5)} ÷ ${gbp(P5)} × 100 = ${r}%.` },
          { value: 100 - r, label: percentLabel(100 - r), nope: `That’s the % you still PAY: ${gbp(s5)} out of ${gbp(P5)}. The % off is the saving: ${gbp(d5)} ÷ ${gbp(P5)} × 100 = ${r}%.` },
          { value: d5, label: percentLabel(d5), nope: `That’s the ${gbp(d5)} saving with a % stuck on. Turn it into a %: ${gbp(d5)} ÷ ${gbp(P5)} × 100 = ${r}%.` },
          { value: P5 / d5, label: percentLabel(P5 / d5), nope: `That’s ${gbp(P5)} ÷ ${gbp(d5)}, upside down. It’s the saving out of the old price: ${gbp(d5)} ÷ ${gbp(P5)} × 100 = ${r}%.` },
          { value: s5, label: percentLabel(s5), nope: `That’s the ${gbp(s5)} new price with a % stuck on. The % off comes from the saving: ${gbp(d5)} ÷ ${gbp(P5)} × 100 = ${r}%.` },
          { value: r / 10, label: percentLabel(r / 10), nope: `That’s × 10 at the end, not × 100. ${gbp(d5)} ÷ ${gbp(P5)} = ${dec}, and ${dec} × 100 = ${r}%.` },
        ], { valid: value => whole(value as number) && (value as number) < 100 }),
      },
    ],
    chain: [
      { line: `\\text{Save} = [[a:${texGbp(P5)}]] - [[b:${texGbp(s5)}]]` },
      { line: `\\text{Save} = [[d:${texGbp(d5)}]]`, op: 'Work it out', merge: { d: ['a', 'b'] }, why: `Old price − new price: ${gbp(P5)} − ${gbp(s5)} = ${gbp(d5)} saved.` },
      { line: `\\% = \\frac{[[d:${texGbp(d5)}]]}{[[p:${texGbp(P5)}]]} [[x:\\times 100]]`, op: '÷ old price', why: 'A % off is the saving out of the ORIGINAL price, then × 100.' },
      { line: `\\% = [[r:${r}\\%]]`, op: 'Work it out', merge: { r: ['d', 'p', 'x'] }, why: `${gbp(d5)} ÷ ${gbp(P5)} = ${dec}, and ${dec} × 100 = ${r}%.` },
      { line: `[[r:${r}\\%]] ${honest ? '=' : '<'} [[c:${claim}\\%]]`, op: 'Check the sticker', why: checkWhy },
    ],
  }

  return [off, versus, rise, built, claimed]
}
