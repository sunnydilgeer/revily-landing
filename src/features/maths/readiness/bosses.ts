/*
 * Boss fights: the last node of a skill-tree branch. Exam-style questions that pull the branch's skills
 * together, each with its worked solution as a step chain. Beating the boss masters the branch.
 * Each attempt uses the next set of numbers, so a retry is a new fight rather than a memory test.
 */
import type { ChainStep } from '../step-chain/StepChain'
import type { AreaId } from './paperTopics'

export type BossPart = {
  /** The question, as plain text. */
  prompt: string
  answer: number
  /** Shown before the answer box, e.g. £. */
  prefix?: string
  hint: string
  chain: ChainStep[]
}

export type Boss = {
  area: AreaId
  title: string
  story: string
  /** One fight per set of numbers; attempts cycle through them. */
  rounds: BossPart[][]
}

const money = (value: number) => Number.isInteger(value) ? `£${value}` : `£${value.toFixed(2)}`

/** Tickets × price with two decimal places: take the decimal out, long multiply, put it back. */
function ticketsPart(count: number, price: number): BossPart {
  const pence = Math.round(price * 100)
  const tens = Math.floor(count / 10) * 10, ones = count % 10
  const total = count * pence
  return {
    prompt: `Trip tickets cost ${money(price)} each. The class buys ${count} tickets. Work out the total cost.`,
    answer: total / 100,
    prefix: '£',
    hint: `Work out ${count} × ${pence} first, then divide by 100 to put the decimal point back.`,
    chain: [
      { line: `[[a:${count}]] \\times [[b:${price.toFixed(2)}]]` },
      {
        line: `= [[a:${count}]] \\times [[b:${pence}]] [[d:\\div 100]]`, op: 'Take out the decimal',
        why: `${pence} is easier to multiply than ${price.toFixed(2)}. It is 100 times bigger, so we divide by 100 at the end.`,
      },
      {
        line: `= [[e:${total}]] [[d:\\div 100]]`, op: 'Long multiply', merge: { e: ['a', 'b'] },
        why: `${pence} × ${ones} = ${pence * ones} and ${pence} × ${tens} = ${pence * tens}. Add them: ${total}.`,
      },
      {
        line: `= [[f:${total / 100}]]`, op: '÷ 100', merge: { f: ['e', 'd'] },
        why: `Dividing by 100 puts back the two decimal places we took out. The total is ${money(total / 100)}.`,
      },
    ],
  }
}

/** A fraction of an amount: one part first, then as many parts as the numerator says. */
function fractionPart(numerator: number, denominator: number, amount: number): BossPart {
  const part = amount / denominator
  return {
    prompt: `${numerator}/${denominator} of the ${amount} tickets are for adults. How many adult tickets are there?`,
    answer: numerator * part,
    hint: `Find 1/${denominator} of ${amount} first.`,
    chain: [
      { line: `\\frac{[[n:${numerator}]]}{[[d:${denominator}]]} \\text{ of } [[a:${amount}]]` },
      {
        line: `= [[n:${numerator}]] \\times [[e:${part}]]`, op: `${amount} ÷ ${denominator}`, merge: { e: ['a', 'd'] },
        why: `The denominator splits the tickets into ${denominator} equal parts: ${amount} ÷ ${denominator} = ${part} in each part.`,
      },
      {
        line: `= [[f:${numerator * part}]]`, op: `× ${numerator}`, merge: { f: ['n', 'e'] },
        why: `The numerator says we want ${numerator} of those parts: ${numerator} × ${part} = ${numerator * part} adult tickets.`,
      },
    ],
  }
}

/** Estimating a division by rounding both numbers to 1 significant figure. */
function estimatePart(cost: number, people: number, roundedCost: number, roundedPeople: number): BossPart {
  const each = roundedCost / roundedPeople
  return {
    prompt: `The coach costs ${money(cost)}. It is shared between ${people} students. Estimate the cost for each student.`,
    answer: each,
    prefix: '£',
    hint: 'Round both numbers to 1 significant figure, then divide.',
    chain: [
      { line: `[[a:${cost}]] \\div [[b:${people}]]` },
      {
        line: `\\approx [[a:${roundedCost}]] \\div [[b:${roundedPeople}]]`, op: 'Round to 1 s.f.',
        why: `Rounding to 1 significant figure makes a division you can do in your head: ${cost} → ${roundedCost} and ${people} → ${roundedPeople}.`,
      },
      {
        line: `= [[c:${each}]]`, op: `${roundedCost} ÷ ${roundedPeople}`, merge: { c: ['a', 'b'] },
        why: `Cancel a zero from each: ${roundedCost / 10} ÷ ${roundedPeople / 10} = ${each}. About £${each} each.`,
      },
    ],
  }
}

export const bosses: Boss[] = [
  {
    area: 'number',
    title: 'The School Trip',
    story: 'Three exam-style questions that use everything in the Number branch. Land all three to master it.',
    rounds: [
      [ticketsPart(24, 13.75), fractionPart(3, 8, 24), estimatePart(587, 31, 600, 30)],
      [ticketsPart(32, 12.25), fractionPart(5, 8, 32), estimatePart(1180, 19, 1000, 20)],
      [ticketsPart(18, 14.5), fractionPart(2, 3, 18), estimatePart(3920, 81, 4000, 80)],
    ],
  },
]

export const HEARTS = 3

/** Reads a typed answer: ignores £, commas and spaces. */
export function readAnswer(typed: string) {
  const cleaned = typed.replace(/[£,\s]/g, '')
  return /^-?\d*\.?\d+$/.test(cleaned) ? Number(cleaned) : null
}

export function isCorrect(typed: string, part: BossPart) {
  const value = readAnswer(typed)
  return value !== null && Math.abs(value - part.answer) < 1e-9
}

const BOSSES_KEY = 'revily:maths-bosses:v1'
export type BossRecord = { beatenOn?: string; attempts: number }

export function readBossRecords(): Partial<Record<AreaId, BossRecord>> {
  try { return JSON.parse(window.localStorage.getItem(BOSSES_KEY) ?? '{}') ?? {} } catch { return {} }
}

export function saveBossRecord(area: AreaId, record: BossRecord) {
  try { window.localStorage.setItem(BOSSES_KEY, JSON.stringify({ ...readBossRecords(), [area]: record })) } catch { /* storage blocked: this visit only */ }
}
