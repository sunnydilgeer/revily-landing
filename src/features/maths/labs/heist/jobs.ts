import type { ChainStep } from '../../step-chain/StepChain'
import { options, whole, type Rand } from '../kit/random'

export type CrewMember = {
  name: string
  emoji: string
  role: string
  /** What they say when you get one right. */
  hype: string[]
  /** What they say when you get one wrong, before the reason. */
  oops: string
}

export type Choice = { value: number; label: string; /** Why this answer is wrong, in the crew's voice. */ nope?: string }

export type Question = {
  prompt: string
  answer: number
  choices: Choice[]
  /** Why the right answer is right: shown when they get it. */
  why: string
  /** What the bar model shows once this question is answered. */
  reveals: 'count' | 'share' | 'payout' | 'take' | 'gap'
  /** The crew member who asks, and who reacts to the answer. */
  who: number
  /** Lines for this question only, in place of the crew member's usual ones. */
  hype?: string
  oops?: string
}

export type Job = {
  id: string
  title: string
  /** The whole take. In a reverse job the student works it out. */
  take: number
  ratio: number[]
  /** The crew member the job asks about. */
  focus: number
  /** Reverse jobs start from one person's cut and work back to the whole take. */
  reverse?: boolean
  brief: string
  why: string
  /** A crew member who lies about the take: stamped once the student works out the real one. */
  liar?: { who: number; claim: number }
  /** How much more one crew member gets than another. Asked for in job 4; given in job 5 (the boss). */
  gap?: { more: number; less: number; amount: number }
  questions: Question[]
  chain: ChainStep[]
}

export const crew: CrewMember[] = [
  { name: 'Driver', emoji: '🚗', role: 'Gets everyone out', hype: ['Engine’s running. Let’s go.', 'That’s my planner.', 'Smooth like a getaway.'], oops: 'Oi. That’s not it.' },
  { name: 'Hacker', emoji: '💻', role: 'Kills the cameras', hype: ['Numbers check out.', 'Access granted.', 'Clean code, clean maths.'], oops: 'Error 404: maths not found.' },
  { name: 'Insider', emoji: '🕶️', role: 'Leaves a door open', hype: ['Nobody suspects a thing.', 'Sharp. Very sharp.', 'Door’s open. Keep moving.'], oops: 'Keep it down… that’s wrong.' },
]

export const pounds = (value: number) => `£${value.toLocaleString('en-GB')}`
const texPounds = (value: number) => `\\pounds ${value.toLocaleString('en-GB').replace(/,/g, '{,}')}`

/** Worked chain for a forward job: add the parts, find one share, multiply up. */
function splitChain(take: number, ratio: number[], focus: number): ChainStep[] {
  const parts = ratio.reduce((sum, part) => sum + part, 0), share = take / parts, name = crew[focus].name
  const [a, b, c] = ratio
  return [
    { line: `\\text{Shares} = [[a:${a}]] + [[b:${b}]] + [[c:${c}]]` },
    { line: `\\text{Shares} = [[t:${parts}]]`, op: 'Add the parts', merge: { t: ['a', 'b', 'c'] }, why: `The deal is ${ratio.join(' : ')}, so the take is cut into ${a} + ${b} + ${c} equal shares.` },
    { line: `\\text{1 share} = [[m:${texPounds(take)}]] \\div [[t:${parts}]]`, op: 'Share out the take', why: `Every share is the same size, so split the whole take by the number of shares.` },
    { line: `\\text{1 share} = [[s:${texPounds(share)}]]`, op: 'Work it out', merge: { s: ['m', 't'] }, why: `${pounds(take)} ÷ ${parts} = ${pounds(share)}. That is what one share is worth to anyone in the crew.` },
    { line: `\\text{${name}} = [[k:${ratio[focus]}]] \\times [[s:${texPounds(share)}]]`, op: `× ${name.toLowerCase()}'s shares`, why: `The ${name.toLowerCase()} gets ${ratio[focus]} shares, so it is ${ratio[focus]} lots of ${pounds(share)}.` },
    { line: `\\text{${name}} = [[d:${texPounds(ratio[focus] * share)}]]`, op: 'Work it out', merge: { d: ['k', 's'] }, why: `${ratio[focus]} × ${pounds(share)} = ${pounds(ratio[focus] * share)}.` },
  ]
}

/** Worked chain for a reverse job: one person's cut gives one share, then scale up to the whole take. */
function reverseChain(take: number, ratio: number[], focus: number): ChainStep[] {
  const parts = ratio.reduce((sum, part) => sum + part, 0), share = take / parts, cut = ratio[focus] * share
  const [a, b, c] = ratio
  return [
    { line: `\\text{${ratio[focus]} shares} = [[g:${texPounds(cut)}]]` },
    { line: `\\text{1 share} = [[g:${texPounds(cut)}]] \\div [[k:${ratio[focus]}]]`, op: `÷ ${ratio[focus]}`, why: `${pounds(cut)} is ${ratio[focus]} shares. Split it by ${ratio[focus]} to get one share.` },
    { line: `\\text{1 share} = [[s:${texPounds(share)}]]`, op: 'Work it out', merge: { s: ['g', 'k'] }, why: `${pounds(cut)} ÷ ${ratio[focus]} = ${pounds(share)}. Every share in the deal is worth this.` },
    { line: `\\text{Take} = [[s:${texPounds(share)}]] \\times ([[a:${a}]] + [[b:${b}]] + [[c:${c}]])`, op: '× all the shares', why: `The whole take is every share in the deal: ${a} + ${b} + ${c} of them.` },
    { line: `\\text{Take} = [[s:${texPounds(share)}]] \\times [[t:${parts}]]`, op: 'Add the parts', merge: { t: ['a', 'b', 'c'] }, why: `${a} + ${b} + ${c} = ${parts} shares.` },
    { line: `\\text{Take} = [[r:${texPounds(take)}]]`, op: 'Work it out', merge: { r: ['s', 't'] }, why: `${parts} × ${pounds(share)} = ${pounds(take)}. That is the whole take.` },
  ]
}

/** Worked chain for job 4: find one share, then the gap in shares × one share. */
function gapChain(take: number, ratio: number[], more: number, less: number): ChainStep[] {
  const parts = ratio.reduce((total, part) => total + part, 0), share = take / parts
  const [a, b, c] = ratio, x = ratio[more], y = ratio[less], gap = (x - y) * share
  return [
    { line: `\\text{Shares} = [[a:${a}]] + [[b:${b}]] + [[c:${c}]]` },
    { line: `\\text{Shares} = [[t:${parts}]]`, op: 'Add the parts', merge: { t: ['a', 'b', 'c'] }, why: `The deal is ${ratio.join(' : ')}, so the take is cut into ${a} + ${b} + ${c} equal shares.` },
    { line: `\\text{1 share} = [[m:${texPounds(take)}]] \\div [[t:${parts}]]`, op: 'Share out the take', why: 'Every share is the same size, so split the whole take by the number of shares.' },
    { line: `\\text{1 share} = [[s:${texPounds(share)}]]`, op: 'Work it out', merge: { s: ['m', 't'] }, why: `${pounds(take)} ÷ ${parts} = ${pounds(share)}.` },
    { line: `\\text{Gap} = ([[x:${x}]] - [[y:${y}]]) \\times [[s:${texPounds(share)}]]`, op: 'Gap in shares', why: `The ${crew[more].name.toLowerCase()} has ${x} shares and the ${crew[less].name.toLowerCase()} has ${y}. The gap is the shares one has and the other doesn’t.` },
    { line: `\\text{Gap} = [[g:${x - y}]] \\times [[s:${texPounds(share)}]]`, op: 'Subtract the parts', merge: { g: ['x', 'y'] }, why: `${x} − ${y} = ${x - y} shares.` },
    { line: `\\text{Gap} = [[d:${texPounds(gap)}]]`, op: 'Work it out', merge: { d: ['g', 's'] }, why: `${x - y} × ${pounds(share)} = ${pounds(gap)}. Check: ${pounds(x * share)} − ${pounds(y * share)} = ${pounds(gap)}.` },
  ]
}

/** Worked chain for the boss job: the gap is a number of shares, which gives one share, then the whole take. */
function bossChain(take: number, ratio: number[], more: number, less: number): ChainStep[] {
  const parts = ratio.reduce((total, part) => total + part, 0), share = take / parts
  const [a, b, c] = ratio, x = ratio[more], y = ratio[less], g = x - y, gap = g * share
  return [
    { line: `\\text{Gap} = [[x:${x}]] - [[y:${y}]] \\text{ shares}` },
    { line: `\\text{Gap} = [[g:${g}]] \\text{ shares}`, op: 'Subtract the parts', merge: { g: ['x', 'y'] }, why: `The ${crew[more].name.toLowerCase()} has ${x} shares and the ${crew[less].name.toLowerCase()} has ${y}, so the gap is ${x} − ${y} = ${g} shares.` },
    { line: `\\text{1 share} = [[d:${texPounds(gap)}]] \\div [[g:${g}]]`, op: `÷ ${g}`, why: `Those ${g} shares are the ${pounds(gap)} gap. Split it by ${g} to get one share.` },
    { line: `\\text{1 share} = [[s:${texPounds(share)}]]`, op: 'Work it out', merge: { s: ['d', 'g'] }, why: `${pounds(gap)} ÷ ${g} = ${pounds(share)}. Every share in the deal is worth this.` },
    { line: `\\text{Take} = [[s:${texPounds(share)}]] \\times [[t:${parts}]]`, op: '× all the shares', why: `The whole take is every share in the deal: ${a} + ${b} + ${c} = ${parts}.` },
    { line: `\\text{Take} = [[r:${texPounds(take)}]]`, op: 'Work it out', merge: { r: ['s', 't'] }, why: `${parts} × ${pounds(share)} = ${pounds(take)}. That is the whole take.` },
  ]
}

const sum = (parts: number[]) => parts.reduce((total, part) => total + part, 0)

/** One crew member's name in a sentence: "the driver". */
const the = (who: number) => `the ${crew[who].name.toLowerCase()}`

/** Questions for a forward job: count the shares, find one share, then one person's cut. */
function forwardQuestions(rand: Rand, take: number, ratio: number[], focus: number): Question[] {
  const parts = sum(ratio), share = take / parts, cut = ratio[focus] * share
  const [a, b, c] = ratio
  return [
    {
      prompt: `How many shares is the ${pounds(take)} cut into?`,
      answer: parts,
      choices: options(rand, { value: parts, label: String(parts) }, [
        { value: 3, label: '3', nope: `3 is how many people. Count the shares: ${a} + ${b} + ${c}.` },
        { value: a * b * c, label: String(a * b * c), nope: `That’s ${a} × ${b} × ${c}. You add the parts: ${a} + ${b} + ${c}.` },
        { value: take, label: String(take), nope: `That’s the money, not the shares. Count the boxes: ${a} + ${b} + ${c}.` },
      ]),
      why: `${a} + ${b} + ${c} = ${parts}. Every box is one share, and they’re all the same size.`,
      reveals: 'count',
      who: 1,
    },
    {
      prompt: 'So what’s one share worth?',
      answer: share,
      choices: options(rand, { value: share, label: pounds(share) }, [
        { value: take / 3, label: pounds(take / 3), nope: `${pounds(take)} ÷ 3 splits it between 3 people. But there are ${parts} shares.` },
        { value: take * parts, label: pounds(take * parts), nope: 'Multiplying made the money bigger. Sharing out means dividing.' },
        { value: take / Math.max(...ratio), label: pounds(take / Math.max(...ratio)), nope: `That’s ${pounds(take)} ÷ ${Math.max(...ratio)}. Divide by all ${parts} shares.` },
      ], { valid: value => whole(value) }),
      why: `${pounds(take)} ÷ ${parts} = ${pounds(share)}. Every box is worth ${pounds(share)}.`,
      reveals: 'share',
      who: 2,
    },
    {
      prompt: `How much does the ${crew[focus].name} get?`,
      answer: cut,
      choices: options(rand, { value: cut, label: pounds(cut) }, [
        { value: share, label: pounds(share), nope: `That’s one share. ${the(focus)[0].toUpperCase() + the(focus).slice(1)} has ${ratio[focus]} of them.` },
        { value: ratio[focus], label: pounds(ratio[focus]), nope: `${ratio[focus]} is how many shares. Each share is worth ${pounds(share)}.` },
        { value: take / 3, label: pounds(take / 3), nope: `That would be a fair 3-way split. ${the(focus)[0].toUpperCase() + the(focus).slice(1)} has ${ratio[focus]} shares of ${pounds(share)}.` },
        { value: take - cut, label: pounds(take - cut), nope: `That’s what everyone ELSE gets. ${the(focus)[0].toUpperCase() + the(focus).slice(1)} has ${ratio[focus]} shares of ${pounds(share)}.` },
      ], { valid: value => whole(value) }),
      why: `${ratio[focus]} shares × ${pounds(share)} = ${pounds(cut)}.`,
      reveals: 'payout',
      who: focus,
    },
  ]
}

/** Three parts, biggest first, that fit the bar model (at most 5 boxes a row). */
const RATIOS = { small: [[3, 2, 1], [4, 2, 1], [3, 1, 1], [2, 2, 1], [4, 1, 1]], big: [[4, 3, 2], [5, 3, 1], [4, 4, 1], [5, 2, 2], [3, 3, 2]], reverse: [[5, 3, 2], [4, 3, 1], [5, 3, 1], [4, 3, 2], [3, 2, 1]],
  // Jobs 4 and 5: every part different, so any two crew members have a gap.
  gap: [[5, 3, 2], [5, 4, 2], [4, 3, 1], [5, 4, 1], [5, 2, 1], [4, 2, 1], [5, 3, 1]] }
/** Who has more, who has less: always a gap of at least 2 shares, so the gap and one share are never the same thing. */
const gapPair = (rand: Rand, ratio: number[]) => rand.pick([[0, 1], [0, 2], [1, 2]].filter(([m, l]) => ratio[m] - ratio[l] >= 2))

/** A fresh set of jobs: friendly shares (so every answer is whole pounds), random ratios and focus. */
export function makeJobs(rand: Rand): Job[] {
  // Job 1: small shares, a small ratio.
  const ratio1 = rand.pick(RATIOS.small), share1 = rand.pick([20, 25, 50, 100]), take1 = sum(ratio1) * share1
  const focus1 = rand.int(0, 2)
  // Job 2: bigger shares and a bigger ratio.
  const ratio2 = rand.pick(RATIOS.big), share2 = rand.pick([100, 150, 200, 250]), take2 = sum(ratio2) * share2
  const focus2 = rand.pick([0, 1, 2].filter(who => who !== focus1))
  // Job 3: work back from the hacker's cut; the driver lies by a whole number of shares.
  const ratio3 = rand.pick(RATIOS.reverse), share3 = rand.pick([20, 30, 40, 50, 60]), parts3 = sum(ratio3)
  const take3 = parts3 * share3, cut3 = ratio3[1] * share3
  const claim = take3 - rand.int(1, Math.min(3, parts3 - 2)) * share3
  const [a3, b3, c3] = ratio3
  // Job 4: less friendly-looking shares; split it, then say how much more one gets than another.
  const ratio4 = rand.pick(RATIOS.gap), share4 = rand.pick([40, 60, 75, 120, 125, 150, 175]), parts4 = sum(ratio4)
  const take4 = parts4 * share4, [more4, less4] = gapPair(rand, ratio4)
  const cut4 = ratio4[more4] * share4, low4 = ratio4[less4] * share4, g4 = ratio4[more4] - ratio4[less4], gap4 = g4 * share4
  // Job 5 (boss): only the gap is known. Gap in shares → one share → the whole take.
  const ratio5 = rand.pick(RATIOS.gap), share5 = rand.pick([30, 40, 50, 60, 70, 80, 90]), parts5 = sum(ratio5)
  const take5 = parts5 * share5, [more5, less5] = gapPair(rand, ratio5)
  const x5 = ratio5[more5], y5 = ratio5[less5], g5 = x5 - y5, gap5 = g5 * share5
  const [a5, b5, c5] = ratio5

  return [
    {
      id: 'job-1',
      title: rand.pick(['The Jewellers', 'The Sneaker Store', 'The Arcade Safe']),
      take: take1,
      ratio: ratio1,
      focus: focus1,
      brief: `You’re out with ${pounds(take1)}. The crew agreed to split it ${ratio1.join(' : ')}.`,
      why: `Why not split it 3 ways? They didn’t all take the same risk. For every ${ratio1[0]} shares the driver gets, the hacker gets ${ratio1[1]} and the insider gets ${ratio1[2]}.`,
      questions: forwardQuestions(rand, take1, ratio1, focus1),
      chain: splitChain(take1, ratio1, focus1),
    },
    {
      id: 'job-2',
      title: rand.pick(['The Casino Vault', 'The Bank Job', 'The Art Gallery']),
      take: take2,
      ratio: ratio2,
      focus: focus2,
      brief: `Bigger job: ${pounds(take2)}. The split this time is ${ratio2.join(' : ')}.`,
      why: 'Same method, bigger numbers. Count the shares, find one share, then give each person their shares.',
      questions: forwardQuestions(rand, take2, ratio2, focus2),
      chain: splitChain(take2, ratio2, focus2),
    },
    {
      id: 'double-cross',
      title: 'The Double-Cross',
      take: take3,
      ratio: ratio3,
      focus: 1,
      reverse: true,
      brief: `The split was ${ratio3.join(' : ')}. The hacker got ${pounds(cut3)}. The driver swears the whole take was only ${pounds(claim)}…`,
      liar: { who: 0, claim },
      why: 'Don’t take the driver’s word for it. You know the hacker’s cut and how many shares that is, so you can work back to the real take.',
      questions: [
        {
          prompt: `The Hacker’s ${pounds(cut3)} is ${b3} shares. What’s one share worth?`,
          answer: share3,
          choices: options(rand, { value: share3, label: pounds(share3) }, [
            { value: cut3, label: pounds(cut3), nope: `${pounds(cut3)} is all ${b3} of the hacker’s shares together. Split it by ${b3}.` },
            { value: cut3 * b3, label: pounds(cut3 * b3), nope: `Multiplying made it bigger. ${b3} shares make ${pounds(cut3)}, so one share is less.` },
            { value: cut3 / 3, label: pounds(cut3 / 3), nope: `That splits it 3 ways, but the hacker’s cut is ${b3} shares. Divide by ${b3}.` },
          ], { valid: value => whole(value) }),
          why: `${pounds(cut3)} ÷ ${b3} = ${pounds(share3)}. Every share in the deal is worth ${pounds(share3)}.`,
          reveals: 'share',
          who: 2,
        },
        {
          prompt: 'How many shares in the whole deal?',
          answer: parts3,
          choices: options(rand, { value: parts3, label: String(parts3) }, [
            { value: 3, label: '3', nope: `3 is how many people. Count the shares: ${a3} + ${b3} + ${c3}.` },
            { value: a3 * b3 * c3, label: String(a3 * b3 * c3), nope: `That’s ${a3} × ${b3} × ${c3}. You add the parts: ${a3} + ${b3} + ${c3}.` },
            { value: b3, label: String(b3), nope: `That’s just the hacker’s shares. Count everyone’s: ${a3} + ${b3} + ${c3}.` },
          ]),
          why: `${a3} + ${b3} + ${c3} = ${parts3} shares.`,
          reveals: 'count',
          who: 1,
        },
        {
          prompt: 'So how big was the take?',
          answer: take3,
          choices: options(rand, { value: take3, label: pounds(take3) }, [
            { value: claim, label: pounds(claim), nope: `That’s the driver’s number. Don’t trust it: ${parts3} shares of ${pounds(share3)}.` },
            { value: cut3 * 3, label: pounds(cut3 * 3), nope: `${pounds(cut3)} × 3 assumes 3 equal cuts. There are ${parts3} shares of ${pounds(share3)}.` },
            { value: cut3 * parts3, label: pounds(cut3 * parts3), nope: `That’s ${parts3} lots of ${pounds(cut3)}. Each share is only ${pounds(share3)}.` },
          ]),
          why: `${parts3} shares × ${pounds(share3)} = ${pounds(take3)}, not ${pounds(claim)}. The driver tried to pocket ${pounds(take3 - claim)}.`,
          reveals: 'take',
          who: 0,
          hype: `…Fine. It was ${pounds(take3)}.`,
          oops: 'Yeah! That’s… totally right. Moving on.',
        },
      ],
      chain: reverseChain(take3, ratio3, 1),
    },
    {
      id: 'job-4',
      title: rand.pick(['The Gold Train', 'The Diamond Expo', 'The Mansion']),
      take: take4,
      ratio: ratio4,
      focus: more4,
      gap: { more: more4, less: less4, amount: gap4 },
      brief: `${pounds(take4)}, split ${ratio4.join(' : ')}. The ${crew[less4].name.toLowerCase()} wants to know how much more the ${crew[more4].name.toLowerCase()} gets.`,
      why: `Find one share first: the take ÷ all the shares. The ${crew[more4].name.toLowerCase()} has ${ratio4[more4]} shares and the ${crew[less4].name.toLowerCase()} has ${ratio4[less4]}. The gap is ${ratio4[more4]} − ${ratio4[less4]} = ${g4} shares. Gap in shares × one share = how much more.`,
      questions: [
        {
          prompt: `First: what’s one share of the ${pounds(take4)} worth?`,
          answer: share4,
          choices: options(rand, { value: share4, label: pounds(share4) }, [
            { value: take4 / 3, label: pounds(take4 / 3), nope: `${pounds(take4)} ÷ 3 splits it between 3 people. Add the parts: ${ratio4.join(' + ')} = ${parts4} shares.` },
            { value: take4 / ratio4[0], label: pounds(take4 / ratio4[0]), nope: `That’s ${pounds(take4)} ÷ ${ratio4[0]}. Divide by all ${parts4} shares.` },
            { value: take4 / g4, label: pounds(take4 / g4), nope: `That’s ÷ ${g4}, the gap. One share is the take ÷ all ${parts4} shares.` },
            { value: take4 / (ratio4[more4] + ratio4[less4]), label: pounds(take4 / (ratio4[more4] + ratio4[less4])), nope: `That’s ÷ ${ratio4[more4] + ratio4[less4]}: just two people’s parts. Add all three: ${ratio4.join(' + ')} = ${parts4}.` },
            { value: ratio4[2] > 1 ? take4 / ratio4[2] : NaN, label: pounds(take4 / ratio4[2]), nope: `That’s ${pounds(take4)} ÷ ${ratio4[2]}, the insider’s parts. Divide by all ${parts4} shares.` },
            { value: take4 * parts4, label: pounds(take4 * parts4), nope: 'Multiplying made the money bigger. Sharing out means dividing.' },
            { value: share4 * ratio4[0], label: pounds(share4 * ratio4[0]), nope: `That’s ${ratio4[0]} shares: the driver’s whole cut. One share is ${pounds(take4)} ÷ ${parts4}.` },
          ], { valid: value => whole(value) }),
          why: `${ratio4.join(' + ')} = ${parts4} shares, and ${pounds(take4)} ÷ ${parts4} = ${pounds(share4)}.`,
          reveals: 'share',
          who: 1,
        },
        {
          prompt: `How much does the ${crew[more4].name} get?`,
          answer: cut4,
          choices: options(rand, { value: cut4, label: pounds(cut4) }, [
            { value: share4, label: pounds(share4), nope: `That’s one share. The ${crew[more4].name.toLowerCase()} has ${ratio4[more4]} of them.` },
            { value: ratio4[more4], label: pounds(ratio4[more4]), nope: `${ratio4[more4]} is how many shares. Each share is worth ${pounds(share4)}.` },
            { value: take4 - cut4, label: pounds(take4 - cut4), nope: `That’s what everyone ELSE gets. The ${crew[more4].name.toLowerCase()} has ${ratio4[more4]} shares of ${pounds(share4)}.` },
          ], { valid: value => whole(value) }),
          why: `${ratio4[more4]} shares × ${pounds(share4)} = ${pounds(cut4)}.`,
          reveals: 'payout',
          who: more4,
        },
        {
          prompt: `How much MORE does the ${crew[more4].name} get than the ${crew[less4].name}?`,
          answer: gap4,
          choices: options(rand, { value: gap4, label: pounds(gap4) }, [
            { value: cut4, label: pounds(cut4), nope: `That’s the ${crew[more4].name.toLowerCase()}’s whole cut. Take away the ${crew[less4].name.toLowerCase()}’s ${pounds(low4)}.` },
            { value: g4, label: pounds(g4), nope: `${g4} is the gap in shares, not pounds. Each share is ${pounds(share4)}.` },
            { value: cut4 + low4, label: pounds(cut4 + low4), nope: `You added them. “How much more” means take away: ${pounds(cut4)} − ${pounds(low4)}.` },
            { value: low4, label: pounds(low4), nope: `That’s the ${crew[less4].name.toLowerCase()}’s cut. The gap is ${g4} shares of ${pounds(share4)}.` },
          ], { valid: value => whole(value) }),
          why: `${ratio4[more4]} − ${ratio4[less4]} = ${g4} shares, and ${g4} × ${pounds(share4)} = ${pounds(gap4)}. Or: ${pounds(cut4)} − ${pounds(low4)} = ${pounds(gap4)}.`,
          reveals: 'gap',
          who: less4,
          hype: `${pounds(gap4)} more?! I’m asking for a raise.`,
          oops: 'Nah. I’ve counted my bag. Again.',
        },
      ],
      chain: gapChain(take4, ratio4, more4, less4),
    },
    {
      id: 'boss',
      title: 'Boss job · The Getaway Bags',
      take: take5,
      ratio: ratio5,
      focus: more5,
      reverse: true,
      gap: { more: more5, less: less5, amount: gap5 },
      brief: `The split was ${ratio5.join(' : ')}. The ${crew[more5].name.toLowerCase()} got ${pounds(gap5)} more than the ${crew[less5].name.toLowerCase()}. How big was the take?`,
      why: `You don’t know the take, only the gap. The ${crew[more5].name.toLowerCase()} has ${x5} shares and the ${crew[less5].name.toLowerCase()} has ${y5}, so the gap is ${g5} shares. ${g5} shares = ${pounds(gap5)}, so divide to get one share. One share × all the shares is the take.`,
      questions: [
        {
          prompt: `How many more shares does the ${crew[more5].name} have than the ${crew[less5].name}?`,
          answer: g5,
          choices: options(rand, { value: g5, label: String(g5) }, [
            { value: x5 + y5, label: String(x5 + y5), nope: `You added them. “More than” means take away: ${x5} − ${y5}.` },
            { value: x5, label: String(x5), nope: `That’s all of the ${crew[more5].name.toLowerCase()}’s shares. Take away the ${crew[less5].name.toLowerCase()}’s ${y5}.` },
            { value: parts5, label: String(parts5), nope: `That’s every share in the deal. Just the gap: ${x5} − ${y5}.` },
          ]),
          why: `${x5} − ${y5} = ${g5}. The ${pounds(gap5)} gap is ${g5} shares.`,
          reveals: 'count',
          who: less5,
        },
        {
          prompt: `${g5} shares = ${pounds(gap5)}. What’s one share worth?`,
          answer: share5,
          choices: options(rand, { value: share5, label: pounds(share5) }, [
            { value: gap5, label: pounds(gap5), nope: `${pounds(gap5)} is all ${g5} shares of the gap. Split it by ${g5}.` },
            { value: gap5 / x5, label: pounds(gap5 / x5), nope: `That’s ÷ ${x5}, the ${crew[more5].name.toLowerCase()}’s shares. But ${pounds(gap5)} is only the gap: ${g5} shares.` },
            { value: gap5 * g5, label: pounds(gap5 * g5), nope: `Multiplying made it bigger. ${g5} shares make ${pounds(gap5)}, so one share is less.` },
          ], { valid: value => whole(value) }),
          why: `${pounds(gap5)} ÷ ${g5} = ${pounds(share5)}. Every share in the deal is worth ${pounds(share5)}.`,
          reveals: 'share',
          who: 2,
        },
        {
          prompt: 'So how big was the whole take?',
          answer: take5,
          choices: options(rand, { value: take5, label: pounds(take5) }, [
            { value: gap5 * parts5, label: pounds(gap5 * parts5), nope: `That treats the ${pounds(gap5)} gap as one share. One share is ${pounds(share5)}: ${parts5} × ${pounds(share5)}.` },
            { value: (x5 + y5) * share5, label: pounds((x5 + y5) * share5), nope: `That’s only the ${crew[more5].name.toLowerCase()} and the ${crew[less5].name.toLowerCase()}. Count everyone’s: ${a5} + ${b5} + ${c5} = ${parts5} shares.` },
            { value: x5 * share5, label: pounds(x5 * share5), nope: `That’s just the ${crew[more5].name.toLowerCase()}’s cut. The take is all ${parts5} shares of ${pounds(share5)}.` },
            { value: share5 * 3, label: pounds(share5 * 3), nope: `3 is how many people. There are ${a5} + ${b5} + ${c5} = ${parts5} shares.` },
          ], { valid: value => whole(value) }),
          why: `${a5} + ${b5} + ${c5} = ${parts5} shares, and ${parts5} × ${pounds(share5)} = ${pounds(take5)}.`,
          reveals: 'take',
          who: more5,
          hype: `${pounds(take5)}. And yeah, ${pounds(gap5)} more than the ${crew[less5].name.toLowerCase()}. Fair’s fair.`,
        },
      ],
      chain: bossChain(take5, ratio5, more5, less5),
    },
  ]
}
