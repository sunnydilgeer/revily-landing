import type { ChainStep } from '../../step-chain/StepChain'
import { options, type Option, type Rand } from '../kit/random'

/** One step of the trick, and what's in the crystal ball once it's done. */
export type TrickStep = { op: string; value: string }

export type Question = {
  /** The trick step this question works out. */
  step: number
  ask: string
  prompt: string
  answer: string
  choices: Option<string>[]
  why: string
}

export type Round = {
  id: string
  title: string
  heading: string
  /** The trick written as an expression, shown as a pill next to the heading. */
  tag?: string
  why: string
  steps: TrickStep[]
  questions: Question[]
  /** Mo's line under the ball at the payout. */
  caption: string
  chain: ChainStep[]
}

export type Tricks = {
  /** The first round depends on the number they tap, so there's one for each of 1–10. */
  first: Round[]
  rest: Round[]
  /** The number test mode taps. Any number works, which is the point. */
  suggest: number
}

export const PICKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const POWER: Record<number, string> = { 2: '²', 5: '⁵', 10: '¹⁰' }

/** Round 1: the trick with their own number. × m, + m×k, ÷ m, − your number always leaves k. */
function playRound(rand: Rand, p: number, m: number, k: number, heading: string, why: string): Round {
  const add = m * k
  const times = m * p
  const total = times + add
  const back = p + k
  const steps: TrickStep[] = [
    { op: 'Think of a number', value: String(p) },
    { op: `× ${m}`, value: String(times) },
    { op: `+ ${add}`, value: String(total) },
    { op: `÷ ${m}`, value: String(back) },
    { op: '− your number', value: String(k) },
  ]
  const notZero = (value: string) => value !== '0'
  return {
    id: 'play',
    title: 'Round 1 · Play the trick',
    heading,
    why,
    steps,
    questions: [
      {
        step: 1,
        ask: 'I already know, but humour me',
        prompt: `Your number × ${m}. What’s ${p} × ${m}?`,
        answer: String(times),
        choices: options(rand, { value: String(times), label: String(times) }, [
          { value: String(p + m), label: String(p + m), nope: `That’s ${p} + ${m}. × ${m} means ${m} lots of ${p}: ${p} × ${m} = ${times}.` },
          { value: String(m * (p + 1)), label: String(m * (p + 1)), nope: `That’s one lot too many: ${p + 1} × ${m}. ${m} lots of ${p} is ${times}.` },
          { value: String(m * (p - 1)), label: String(m * (p - 1)), nope: `That’s one lot short: ${p - 1} × ${m}. ${m} lots of ${p} is ${times}.` },
        ], { valid: notZero }),
        why: `${m} lots of ${p} is ${times}. Next the trick adds ${add}: ${times} + ${add} = ${total}.`,
      },
      {
        step: 3,
        ask: 'the spirits are getting closer',
        prompt: `You’re on ${total}. Now ÷ ${m}. What’s ${total} ÷ ${m}?`,
        answer: String(back),
        choices: options(rand, { value: String(back), label: String(back) }, [
          { value: String(total - m), label: String(total - m), nope: `That’s ${total} − ${m}. ÷ ${m} means share into ${m} equal groups: ${total} ÷ ${m} = ${back}.` },
          { value: String(total * m), label: String(total * m), nope: `That’s ${total} × ${m}, so it got bigger. Sharing into ${m} groups makes it smaller: ${back}.` },
          { value: String(total + m), label: String(total + m), nope: `That’s ${total} + ${m}. ÷ ${m} shares it into ${m} equal groups: ${back}.` },
        ], { valid: notZero }),
        why: `${total} ÷ ${m} = ${back}. Last step: take away your number. ${back} − ${p} = …`,
      },
    ],
    caption: `Your answer is ${k}! I saw it in the mist.`,
    chain: [
      { line: `[[a:${p}]]` },
      { line: `[[b:${times}]]`, op: `× ${m}`, merge: { b: ['a'] }, why: `${p} × ${m} = ${times}.` },
      { line: `[[c:${total}]]`, op: `+ ${add}`, merge: { c: ['b'] }, why: `${times} + ${add} = ${total}.` },
      { line: `[[d:${back}]]`, op: `÷ ${m}`, merge: { d: ['c'] }, why: `${total} ÷ ${m} = ${back}.` },
      { line: `[[e:${k}]]`, op: `− ${p}`, merge: { e: ['d'] }, why: `Take away the number you picked, ${p}, and ${k} is left. Pick another number: still ${k}.` },
    ],
  }
}

/** Round 2: the same trick with n. n → mn → mn + mk → n + k → k. */
function revealRound(rand: Rand, m: number, k: number): Round {
  const add = m * k
  return {
    id: 'reveal',
    title: 'Round 2 · The secret is n',
    heading: `Why does everyone get ${k}?`,
    why: `Mo can’t know your number, so call it n: a letter that stands for ANY number. Do each step to n. If the n’s vanish and ${k} is left, it works for every number there is.`,
    steps: [
      { op: 'Call it n', value: 'n' },
      { op: `× ${m}`, value: `${m}n` },
      { op: `+ ${add}`, value: `${m}n + ${add}` },
      { op: `÷ ${m}`, value: `n + ${k}` },
      { op: '− n', value: String(k) },
    ],
    questions: [
      {
        step: 1,
        ask: 'no peeking at my notes',
        prompt: `n × ${m} = ?`,
        answer: `${m}n`,
        choices: options(rand, { value: `${m}n`, label: `${m}n` }, [
          { value: `n+${m}`, label: `n + ${m}`, nope: `That adds ${m}. × ${m} means ${m} lots of n, and we write that ${m}n.` },
          { value: `n^${m}`, label: `n${POWER[m]}`, nope: `n${POWER[m]} means n × n${m === 2 ? '' : ' × …'}, ${m} n’s multiplied together. ${m} lots of n is ${m}n.` },
          { value: `${m}+n`, label: `${m} + n`, nope: `That adds ${m}. × ${m} means ${m} lots of n: ${m}n.` },
        ]),
        why: `${m} lots of n is ${m}n: the number goes in front, no × sign. Then + ${add} makes it ${m}n + ${add}.`,
      },
      {
        step: 3,
        ask: 'careful, this is the bit that works the magic',
        prompt: `(${m}n + ${add}) ÷ ${m} = ?`,
        answer: `n+${k}`,
        choices: options(rand, { value: `n+${k}`, label: `n + ${k}` }, [
          { value: `n+${add}`, label: `n + ${add}`, nope: `You only divided the ${m}n. Divide EVERY term by ${m}: ${add} ÷ ${m} = ${k} too.` },
          { value: `${m}n+${k}`, label: `${m}n + ${k}`, nope: `You only divided the ${add}. Divide EVERY term by ${m}: ${m}n ÷ ${m} = n too.` },
          { value: `n`, label: 'n', nope: `The ${add} doesn’t vanish when you divide. ${add} ÷ ${m} = ${k}, so it’s n + ${k}.` },
        ]),
        why: `Divide EVERY term by ${m}: ${m}n ÷ ${m} = n and ${add} ÷ ${m} = ${k}. That gives n + ${k}.`,
      },
      {
        step: 4,
        ask: 'go on then, finish it',
        prompt: `n + ${k} − n = ?`,
        answer: String(k),
        choices: options(rand, { value: String(k), label: String(k) }, [
          { value: '0', label: '0', nope: `Only the n’s cancel: n − n = 0. The ${k} is still there.` },
          { value: 'n', label: 'n', nope: `It’s the n that goes, not the ${k}. n − n = 0, leaving ${k}.` },
          { value: `${k}-n`, label: `${k} − n`, nope: `There was an n already. n − n = 0, so just ${k} is left.` },
        ]),
        why: `n − n = 0, so the n’s are gone. ${k} is left, whatever number you picked.`,
      },
    ],
    caption: 'You’ve ruined the magic! …It’s algebra, isn’t it. 😤',
    chain: [
      { line: '[[a:n]]' },
      { line: `[[b:${m}n]]`, op: `× ${m}`, merge: { b: ['a'] }, why: `${m} lots of n is written ${m}n.` },
      { line: `[[b:${m}n]] [[c:+ ${add}]]`, op: `+ ${add}`, why: `${m}n and ${add} aren’t like terms, so they stay apart.` },
      { line: `\\frac{[[b:${m}n]]}{[[d:${m}]]} + \\frac{[[c:${add}]]}{[[e:${m}]]}`, op: `÷ ${m}`, why: `Dividing an expression divides EVERY term, not just the first one.` },
      { line: `[[f:n]] [[g:+ ${k}]]`, op: 'Simplify', merge: { f: ['b', 'd'], g: ['c', 'e'] }, why: `${m}n ÷ ${m} = n and ${add} ÷ ${m} = ${k}.` },
      { line: `[[f:n]] [[g:+ ${k}]] [[h:- n]]`, op: '− n', why: 'Take away the number you first thought of: that’s n.' },
      { line: `[[g:${k}]]`, op: 'Collect like terms', why: `n − n = 0. No n left, so it’s ${k} for every number.` },
    ],
  }
}

/** Round 3: a mate's trick, a(n + b) − an, which always gives ab. */
function bracketRound(rand: Rand, a: number, b: number): Round {
  const ab = a * b
  return {
    id: 'bracket',
    title: 'Round 3 · Your mate’s trick',
    heading: 'Will it always give the same answer?',
    tag: `${a}(n + ${b}) − ${a}n`,
    why: `A bracket means “times everything inside”. Expand it, then collect like terms: n’s with n’s, numbers with numbers. If the n’s cancel, everyone gets the same answer.`,
    steps: [
      { op: 'Call it n', value: 'n' },
      { op: `+ ${b}`, value: `n + ${b}` },
      { op: `× ${a}`, value: `${a}(n + ${b})` },
      { op: 'Open the bracket', value: `${a}n + ${ab}` },
      { op: `− ${a}n`, value: String(ab) },
    ],
    questions: [
      {
        step: 3,
        ask: 'I don’t do brackets, they cramp my aura',
        prompt: `Expand ${a}(n + ${b})`,
        answer: `${a}n+${ab}`,
        choices: options(rand, { value: `${a}n+${ab}`, label: `${a}n + ${ab}` }, [
          { value: `${a}n+${b}`, label: `${a}n + ${b}`, nope: `You only multiplied the n. The ${a} times EVERYTHING inside: ${a} × ${b} = ${ab} too.` },
          { value: `n+${ab}`, label: `n + ${ab}`, nope: `You only multiplied the ${b}. The ${a} times the n as well: ${a}n.` },
          { value: `${a}+n+${b}`, label: `${a} + n + ${b}`, nope: `A number outside a bracket multiplies, it doesn’t add: ${a} × n and ${a} × ${b}.` },
        ]),
        why: `${a} × n = ${a}n and ${a} × ${b} = ${ab}. So ${a}(n + ${b}) = ${a}n + ${ab}.`,
      },
      {
        step: 4,
        ask: 'the last bit, then I’m going home',
        prompt: `Simplify ${a}n + ${ab} − ${a}n`,
        answer: String(ab),
        choices: options(rand, { value: String(ab), label: String(ab) }, [
          { value: `${2 * a}n+${ab}`, label: `${2 * a}n + ${ab}`, nope: `It’s − ${a}n, so take away: ${a}n − ${a}n = 0, not ${2 * a}n.` },
          { value: String(a + b), label: String(a + b), nope: `That’s ${a} + ${b}. The bracket multiplied: ${a} × ${b} = ${ab}.` },
          { value: `${ab}-${a}n`, label: `${ab} − ${a}n`, nope: `There’s + ${a}n and − ${a}n. Together they make 0, so only ${ab} is left.` },
        ]),
        why: `${a}n − ${a}n = 0. The n’s cancel, so the answer is ${ab} whatever number you pick.`,
      },
    ],
    caption: `Fine. FINE. It’s always ${ab}. Algebra again. 🙄`,
    chain: [
      { line: `[[p:${a}]]([[x:n]] [[y:+ ${b}]]) [[q:- ${a}n]]` },
      { line: `[[c:${a}n]] [[d:+ ${ab}]] [[q:- ${a}n]]`, op: 'Expand', merge: { c: ['p', 'x'], d: ['y'] }, why: `The ${a} multiplies EVERYTHING in the bracket: ${a} × n = ${a}n and ${a} × ${b} = ${ab}.` },
      { line: `[[c:${a}n]] [[q:- ${a}n]] [[d:+ ${ab}]]`, op: 'Like terms together', why: `Put the n terms side by side. Each term keeps its sign as it moves.` },
      { line: `[[d:${ab}]]`, op: 'Collect like terms', why: `${a}n − ${a}n = 0. The n’s cancel, so it’s ${ab} for every number.` },
    ],
  }
}

/** A number for on-screen text, with a proper minus sign: −4. */
const signed = (value: number) => (value < 0 ? `−${-value}` : String(value))

/** Round 4: a rival's trick with two brackets, a(n + b) + c(n + d) − (a + c)n, which always gives ab + cd. */
function doubleRound(rand: Rand, a: number, b: number, c: number, d: number): Round {
  const ab = a * b, cd = c * d, total = ab + cd, ns = a + c
  return {
    id: 'double',
    title: 'Round 4 · Double trouble',
    heading: 'Two brackets. Still a trick?',
    tag: `${a}(n + ${b}) + ${c}(n + ${d})`,
    why: `Expand each bracket on its own: the number outside times everything inside. Then collect like terms. To make the n’s vanish, take away ALL the n’s you’ve got.`,
    steps: [
      { op: 'Call it n', value: 'n' },
      { op: `+ ${b}, then × ${a}`, value: `${a}(n + ${b})` },
      { op: `+ ${c}(n + ${d})`, value: `${ns}n + ${total}` },
      { op: 'Take away the magic bit', value: String(total) },
    ],
    questions: [
      {
        step: 2,
        ask: 'two brackets, double the drama',
        prompt: `Expand and simplify ${a}(n + ${b}) + ${c}(n + ${d})`,
        answer: `${ns}n+${total}`,
        choices: options(rand, { value: `${ns}n+${total}`, label: `${ns}n + ${total}` }, [
          { value: `${ns}n+${b + d}`, label: `${ns}n + ${b + d}`, nope: `You only multiplied the n’s. Each number outside times EVERYTHING inside: ${a} × ${b} = ${ab} and ${c} × ${d} = ${cd}.` },
          { value: `${a * c}n+${total}`, label: `${a * c}n + ${total}`, nope: `${a}n and ${c}n are like terms, so ADD them: ${a}n + ${c}n = ${ns}n, not ${a} × ${c}.` },
          { value: `${ns + total}n`, label: `${ns + total}n`, nope: `${ns}n and ${total} aren’t like terms, so they can’t join up. It stays ${ns}n + ${total}.` },
        ]),
        why: `${a}(n + ${b}) = ${a}n + ${ab} and ${c}(n + ${d}) = ${c}n + ${cd}. n’s: ${a}n + ${c}n = ${ns}n. Numbers: ${ab} + ${cd} = ${total}.`,
      },
      {
        step: 3,
        ask: 'now make the n’s disappear',
        prompt: `What must the trick take away from ${ns}n + ${total} so everyone gets the same answer?`,
        answer: `${ns}n`,
        choices: options(rand, { value: `${ns}n`, label: `${ns}n` }, [
          { value: `${a}n`, label: `${a}n`, nope: `That only cancels the first bracket’s n’s. ${ns}n − ${a}n leaves ${c}n, so the answer still depends on your number.` },
          { value: 'n', label: 'n', nope: `There are ${ns} lots of n. Taking one away leaves ${ns - 1}n, which still changes with your number.` },
          { value: String(total), label: String(total), nope: `That gets rid of the number and keeps the n’s: ${ns}n. Take away the n’s and ${total} is left for everyone.` },
        ]),
        why: `${ns}n − ${ns}n = 0. Only ${total} is left, whatever number you picked.`,
      },
    ],
    caption: `Always ${total}. Two brackets, same old algebra. 😏`,
    chain: [
      { line: `[[p:${a}]]([[x:n]] [[y:+ ${b}]]) + [[q:${c}]]([[z:n]] [[w:+ ${d}]])` },
      { line: `[[c:${a}n]] [[d:+ ${ab}]] + [[q:${c}]]([[z:n]] [[w:+ ${d}]])`, op: 'Expand the first', merge: { c: ['p', 'x'], d: ['y'] }, why: `${a} × n = ${a}n and ${a} × ${b} = ${ab}.` },
      { line: `[[c:${a}n]] [[d:+ ${ab}]] [[e:+ ${c}n]] [[f:+ ${cd}]]`, op: 'Expand the second', merge: { e: ['q', 'z'], f: ['w'] }, why: `${c} × n = ${c}n and ${c} × ${d} = ${cd}.` },
      { line: `[[c:${a}n]] [[e:+ ${c}n]] [[d:+ ${ab}]] [[f:+ ${cd}]]`, op: 'Like terms together', why: 'Put the n’s side by side and the numbers side by side. Each term keeps its sign.' },
      { line: `[[g:${ns}n]] [[h:+ ${total}]]`, op: 'Collect like terms', merge: { g: ['c', 'e'], h: ['d', 'f'] }, why: `${a}n + ${c}n = ${ns}n and ${ab} + ${cd} = ${total}.` },
      { line: `[[g:${ns}n]] [[h:+ ${total}]] [[k:- ${ns}n]]`, op: `− ${ns}n`, why: `Take away every n there is: ${ns}n.` },
      { line: `[[h:${total}]]`, op: 'Collect like terms', why: `${ns}n − ${ns}n = 0. It’s ${total} for every number.` },
    ],
  }
}

/** Round 5 (boss): the exam one. Show that a(n + b) − a(n − d) is always a(b + d). The minus bracket is the trap. */
function bossRound(rand: Rand, a: number, b: number, d: number): Round {
  const ab = a * b, ad = a * d, total = ab + ad
  return {
    id: 'boss',
    title: 'Round 5 · The grand finale',
    heading: `Show it’s always ${total}.`,
    tag: `${a}(n + ${b}) − ${a}(n − ${d})`,
    why: `This is a real exam question: show it always gives the same answer. Expand both brackets. A minus in front of a bracket multiplies EVERYTHING inside by a minus, and minus times minus is plus. Then collect like terms.`,
    steps: [
      { op: 'Call it n', value: 'n' },
      { op: `+ ${b}, then × ${a}`, value: `${a}(n + ${b})` },
      // Non-breaking spaces keep each half together when the ball wraps it onto two lines.
      { op: `− ${a}(n − ${d})`, value: `${a}(n\u00a0+\u00a0${b}) − ${a}(n\u00a0−\u00a0${d})` },
      { op: 'Open both brackets', value: `${a}n\u00a0+\u00a0${ab} − ${a}n\u00a0+\u00a0${ad}` },
      { op: 'Collect like terms', value: String(total) },
    ],
    questions: [
      {
        step: 3,
        ask: 'the minus bracket. I’ve been dreading this',
        prompt: `Expand ${a}(n + ${b}) − ${a}(n − ${d})`,
        answer: `${a}n+${ab}-${a}n+${ad}`,
        choices: options(rand, { value: `${a}n+${ab}-${a}n+${ad}`, label: `${a}n + ${ab} − ${a}n + ${ad}` }, [
          { value: `${a}n+${ab}-${a}n-${ad}`, label: `${a}n + ${ab} − ${a}n − ${ad}`, nope: `The − ${a} multiplies the − ${d} too. Minus times minus is plus: −${a} × −${d} = + ${ad}.` },
          { value: `${a}n+${b}-${a}n-${d}`, label: `${a}n + ${b} − ${a}n − ${d}`, nope: `You only multiplied the n’s. ${a} × ${b} = ${ab}, and −${a} × −${d} = + ${ad}.` },
          { value: `${a}n+${ab}-${a}n-${d}`, label: `${a}n + ${ab} − ${a}n − ${d}`, nope: `The second bracket needs the ${a} too: −${a} × −${d} = + ${ad}, not − ${d}.` },
        ]),
        why: `${a}(n + ${b}) = ${a}n + ${ab}. −${a}(n − ${d}) = −${a}n + ${ad}, because minus times minus is plus.`,
      },
      {
        step: 4,
        ask: 'go on, finish me off',
        prompt: `Simplify ${a}n + ${ab} − ${a}n + ${ad}`,
        answer: String(total),
        choices: options(rand, { value: String(total), label: String(total) }, [
          { value: String(ab - ad), label: signed(ab - ad), nope: `It’s + ${ad}, not − ${ad}. ${ab} + ${ad} = ${total}.` },
          { value: `${2 * a}n+${total}`, label: `${2 * a}n + ${total}`, nope: `It’s + ${a}n and − ${a}n. Together they make 0, not ${2 * a}n.` },
          { value: `${total}n`, label: `${total}n`, nope: `The n’s cancel: ${a}n − ${a}n = 0. Only the numbers are left: ${ab} + ${ad} = ${total}.` },
        ], { valid: value => value !== String(total) }),
        why: `${a}n − ${a}n = 0 and ${ab} + ${ad} = ${total}. No n left, so it’s ${total} for every number. Shown.`,
      },
    ],
    caption: `Always ${total}. You’ve out-mystic’d the mystic. 🎩`,
    chain: [
      { line: `[[p:${a}]]([[x:n]] [[y:+ ${b}]]) [[q:- ${a}]]([[z:n]] [[w:- ${d}]])` },
      { line: `[[c:${a}n]] [[d:+ ${ab}]] [[q:- ${a}]]([[z:n]] [[w:- ${d}]])`, op: 'Expand the first', merge: { c: ['p', 'x'], d: ['y'] }, why: `${a} × n = ${a}n and ${a} × ${b} = ${ab}.` },
      { line: `[[c:${a}n]] [[d:+ ${ab}]] [[e:- ${a}n]] [[f:+ ${ad}]]`, op: 'Expand the second', merge: { e: ['q', 'z'], f: ['w'] }, why: `−${a} × n = −${a}n and −${a} × −${d} = + ${ad}. Minus times minus is plus.` },
      { line: `[[c:${a}n]] [[e:- ${a}n]] [[d:+ ${ab}]] [[f:+ ${ad}]]`, op: 'Like terms together', why: 'Put the n’s side by side. Each term keeps its sign as it moves.' },
      { line: `[[g:${total}]]`, op: 'Collect like terms', merge: { g: ['d', 'f'] }, why: `${a}n − ${a}n = 0 and ${ab} + ${ad} = ${total}. No n left, so it’s always ${total}.` },
    ],
  }
}

export function makeTricks(rand: Rand): Tricks {
  const m = rand.pick([2, 5, 10])
  const k = rand.int(2, 9)
  const a = rand.pick([2, 3, 4, 5, 10])
  // Keep a × b small and friendly: 10 × 5 at most.
  const b = rand.int(2, Math.min(10, Math.floor(50 / a)))
  const heading = 'Think of a number. Any number.'
  // Round 4: two different multipliers, 2 to 5, so a × c never equals a + c.
  const a4 = rand.pick([2, 3, 4, 5]), c4 = rand.pick([2, 3, 4, 5].filter(v => v !== a4)), b4 = rand.int(1, 9), d4 = rand.int(1, 9)
  // Round 5: the answer first, a friendly total a(b + d), then split b + d into two different numbers.
  const a5 = rand.pick([2, 3, 4, 5]), sum5 = rand.int(5, 12), b5 = rand.int(1, sum5 - 1), d5 = sum5 - b5
  const why = `Every step is one easy sum you can do in your head. The sneaky bit is the end: taking away your own number wipes out the only part that was yours.`
  return {
    first: PICKS.map(p => playRound(rand, p, m, k, heading, why)),
    rest: [revealRound(rand, m, k), bracketRound(rand, a, b), doubleRound(rand, a4, b4, c4, d4), bossRound(rand, a5, b5, d5)],
    suggest: rand.int(1, 10),
  }
}
