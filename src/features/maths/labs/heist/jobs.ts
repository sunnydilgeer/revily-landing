import type { ChainStep } from '../../step-chain/StepChain'

export type CrewMember = { name: string; emoji: string; role: string }

export type Choice = { value: number; label: string; /** Why this answer is wrong, in the crew's voice. */ nope?: string }

export type Question = {
  prompt: string
  answer: number
  choices: Choice[]
  /** Why the right answer is right: shown when they get it. */
  why: string
  /** What the bar model shows once this question is answered. */
  reveals: 'count' | 'share' | 'payout' | 'take'
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
  questions: Question[]
  chain: ChainStep[]
}

export const crew: CrewMember[] = [
  { name: 'Driver', emoji: '🚗', role: 'Gets everyone out' },
  { name: 'Hacker', emoji: '💻', role: 'Kills the cameras' },
  { name: 'Insider', emoji: '🕶️', role: 'Leaves a door open' },
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

export const jobs: Job[] = [
  {
    id: 'jewellers',
    title: 'The Jewellers',
    take: 600,
    ratio: [3, 2, 1],
    focus: 0,
    brief: 'You’re out with £600. The crew agreed to split it 3 : 2 : 1.',
    why: 'Why not split it 3 ways? The driver took the biggest risk. So for every 3 shares the driver gets, the hacker gets 2 and the insider gets 1.',
    questions: [
      {
        prompt: 'How many shares is the £600 cut into?',
        answer: 6,
        choices: [
          { value: 3, label: '3', nope: '3 is how many people. Count the shares: 3 + 2 + 1.' },
          { value: 6, label: '6' },
          { value: 600, label: '600', nope: 'That’s the money, not the shares. Count the boxes: 3 + 2 + 1.' },
        ],
        why: '3 + 2 + 1 = 6. Every box is one share, and they’re all the same size.',
        reveals: 'count',
      },
      {
        prompt: 'So what’s one share worth?',
        answer: 100,
        choices: [
          { value: 200, label: '£200', nope: '£600 ÷ 3 splits it between 3 people. But there are 6 shares.' },
          { value: 3600, label: '£3,600', nope: 'Multiplying made the money bigger. Sharing out means dividing.' },
          { value: 100, label: '£100' },
        ],
        why: '£600 ÷ 6 = £100. Every box is worth £100.',
        reveals: 'share',
      },
      {
        prompt: 'How much does the Driver get?',
        answer: 300,
        choices: [
          { value: 300, label: '£300' },
          { value: 3, label: '£3', nope: '3 is how many shares. Each share is worth £100.' },
          { value: 200, label: '£200', nope: 'That would be a fair 3-way split. The driver has 3 shares of £100.' },
        ],
        why: '3 shares × £100 = £300.',
        reveals: 'payout',
      },
    ],
    chain: splitChain(600, [3, 2, 1], 0),
  },
  {
    id: 'casino',
    title: 'The Casino Vault',
    take: 1800,
    ratio: [4, 3, 2],
    focus: 1,
    brief: 'Bigger job: £1,800. The split this time is 4 : 3 : 2.',
    why: 'Same method, bigger numbers. Count the shares, find one share, then give each person their shares.',
    questions: [
      {
        prompt: 'How many shares this time?',
        answer: 9,
        choices: [
          { value: 24, label: '24', nope: 'That’s 4 × 3 × 2. You add the parts: 4 + 3 + 2.' },
          { value: 9, label: '9' },
          { value: 3, label: '3', nope: '3 is how many people. Count the shares: 4 + 3 + 2.' },
        ],
        why: '4 + 3 + 2 = 9 shares.',
        reveals: 'count',
      },
      {
        prompt: 'What’s one share worth?',
        answer: 200,
        choices: [
          { value: 600, label: '£600', nope: '£1,800 ÷ 3 splits it between 3 people. But there are 9 shares.' },
          { value: 200, label: '£200' },
          { value: 450, label: '£450', nope: 'That’s £1,800 ÷ 4. Divide by all 9 shares.' },
        ],
        why: '£1,800 ÷ 9 = £200.',
        reveals: 'share',
      },
      {
        prompt: 'How much does the Hacker get?',
        answer: 600,
        choices: [
          { value: 200, label: '£200', nope: 'That’s one share. The hacker has 3 of them.' },
          { value: 900, label: '£900', nope: 'That’s half the take. The hacker has 3 shares of £200.' },
          { value: 600, label: '£600' },
        ],
        why: '3 shares × £200 = £600.',
        reveals: 'payout',
      },
    ],
    chain: splitChain(1800, [4, 3, 2], 1),
  },
  {
    id: 'double-cross',
    title: 'The Double-Cross',
    take: 600,
    ratio: [5, 3, 2],
    focus: 1,
    reverse: true,
    brief: 'The split was 5 : 3 : 2. The hacker got £180, but the driver won’t say how big the take was.',
    why: 'You don’t need the driver to tell you. You know the hacker’s cut and how many shares that is, so you can work back to the whole take.',
    questions: [
      {
        prompt: 'The Hacker’s £180 is 3 shares. What’s one share worth?',
        answer: 60,
        choices: [
          { value: 60, label: '£60' },
          { value: 180, label: '£180', nope: '£180 is all 3 of the hacker’s shares together. Split it by 3.' },
          { value: 540, label: '£540', nope: 'Multiplying made it bigger. 3 shares make £180, so one share is less.' },
        ],
        why: '£180 ÷ 3 = £60. Every share in the deal is worth £60.',
        reveals: 'share',
      },
      {
        prompt: 'How many shares in the whole deal?',
        answer: 10,
        choices: [
          { value: 3, label: '3', nope: '3 is how many people. Count the shares: 5 + 3 + 2.' },
          { value: 10, label: '10' },
          { value: 30, label: '30', nope: 'That’s 5 × 3 × 2. You add the parts: 5 + 3 + 2.' },
        ],
        why: '5 + 3 + 2 = 10 shares.',
        reveals: 'count',
      },
      {
        prompt: 'So how big was the take?',
        answer: 600,
        choices: [
          { value: 540, label: '£540', nope: '£180 × 3 assumes 3 equal cuts. There are 10 shares of £60.' },
          { value: 1800, label: '£1,800', nope: 'That’s 10 lots of £180. Each share is only £60.' },
          { value: 600, label: '£600' },
        ],
        why: '10 shares × £60 = £600. The driver and insider split the other £420.',
        reveals: 'take',
      },
    ],
    chain: reverseChain(600, [5, 3, 2], 1),
  },
]
