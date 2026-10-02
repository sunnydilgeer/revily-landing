import type { ChainStep } from '../../step-chain/StepChain'
import { options, texNum, whole, type Option, type Rand } from '../kit/random'

/*
 * Level Up: an RPG where the XP for each level is a linear sequence, a, a + d, a + 2d … with the
 * nth term dn + c. The jump d and the add-on c are picked first, so every level's XP is a multiple
 * of 5 and every answer is a whole number.
 */

export type Question = {
  /** What Pixel is doing, above the prompt: "find the jump". */
  asker: string
  prompt: string
  answer: string | number
  choices: Option<string | number>[]
  why: string
}

export type Round = {
  id: string
  title: string
  heading: string
  why: string
  questions: Question[]
  chain: ChainStep[]
}

export type Game = {
  /** The jump (common difference) and the add-on: level n needs dn + c XP. */
  d: number
  c: number
  /** XP for levels 1–5. */
  terms: number[]
  /** The far-off level for round 2, and its XP. */
  far: number
  farXp: number
  /** Round 3: the XP asked about, whether a level needs exactly that, and the level at or just under it. */
  target: number
  hit: boolean
  level: number
  rounds: Round[]
}

/** 1,250 for copy. */
export const num = (value: number) => value.toLocaleString('en-GB')
const rule = (d: number, c: number) => `${d}n + ${c}`
const xp = (d: number, c: number, n: number) => d * n + c

const JUMPS = [5, 10, 20, 25, 50]
/** The add-ons that keep each jump's numbers friendly: small next to a small jump, round next to 50. */
const ADD_ONS: Record<number, number[]> = {
  5: [5, 10, 15, 20],
  10: [5, 10, 15, 20, 25, 30, 40],
  20: [5, 10, 15, 25, 30, 40, 50, 60],
  25: [5, 10, 15, 20, 25, 50, 75],
  50: [10, 20, 25, 30, 40, 50, 70, 90],
}

/** Round XP values (multiples of 100, else 50) and whether a level needs exactly that much. */
function targets(d: number, c: number) {
  const found: { x: number; hit: boolean; level: number }[] = []
  for (let x = 100; x <= 5000; x += 50) {
    const level = Math.floor((x - c) / d)
    const hit = (x - c) % d === 0
    // Far enough past the levels on screen to need the rule, close enough to stay friendly.
    if (level >= 8 && level <= 99) found.push({ x, hit, level })
  }
  return found
}

export function makeGame(rand: Rand): Game {
  // Decide yes or no first: every multiple of 5 is in a + 5 jumps sequence, so "no" needs a bigger jump.
  const hit = rand.chance(.5)
  let d = 10, c = 5, pool: ReturnType<typeof targets> = []
  for (let tries = 0; tries < 100 && !pool.length; tries++) {
    d = rand.pick(hit ? JUMPS : JUMPS.slice(1))
    c = rand.pick(ADD_ONS[d])
    const fits = targets(d, c).filter(t => t.hit === hit)
    const hundreds = fits.filter(t => t.x % 100 === 0)
    pool = hundreds.length ? hundreds : fits
  }
  const pickTarget = rand.pick(pool)
  const terms = [1, 2, 3, 4, 5].map(n => xp(d, c, n))
  const a = terms[0]
  const far = rand.pick([20, 30, 50, 100])
  const game = { d, c, terms, far, farXp: xp(d, c, far), target: pickTarget.x, hit: pickTarget.hit, level: pickTarget.level }
  return { ...game, rounds: [pattern(rand, game, a), nthTerm(rand, game, a), member(rand, game)] }
}

type Base = Omit<Game, 'rounds'>

function pattern(rand: Rand, { d, terms }: Base, a: number): Round {
  const [t1, t2, , t4, t5] = terms
  const half = d / 2
  return {
    id: 'pattern',
    title: 'Round 1 · Spot the pattern',
    heading: 'A wild sequence appears!',
    why: 'In a linear sequence the XP goes up by the same jump every level. Find that jump and the next level is easy: just add it on.',
    questions: [
      {
        asker: 'find the jump',
        prompt: `Levels 1 to 4 need ${num(t1)}, ${num(t2)}, ${num(terms[2])}, ${num(t4)} XP. What’s the rule from one level to the next?`,
        answer: 'jump',
        choices: options<string | number>(rand, { value: 'jump', label: `+ ${d}` }, [
          { value: 'first', label: `+ ${a}`, nope: `${num(a)} is level 1’s XP, not the jump. The jump is the gap between levels: ${num(t2)} − ${num(t1)} = ${d}.` },
          { value: 'double', label: '× 2', nope: `Doubling ${num(t1)} gives ${num(2 * t1)}, but level 2 is ${num(t2)}. It goes up by the same amount each time: + ${d}.` },
          ...(Number.isInteger(half / 5) ? [{ value: 'half', label: `+ ${half}`, nope: `That’s only half a jump. ${num(t1)} to ${num(t2)} is a jump of ${d}.` }] : []),
        ]),
        why: `${num(t2)} − ${num(t1)} = ${d}, and every other gap is ${d} too. Same jump each time: that’s a linear sequence.`,
      },
      {
        asker: 'predict the next level',
        prompt: `How much XP for level 5?`,
        answer: t5,
        choices: options<string | number>(rand, { value: t5, label: num(t5) }, [
          { value: t4 + a, label: num(t4 + a), nope: `That adds level 1’s XP (${num(a)}). The jump is ${d}: ${num(t4)} + ${d} = ${num(t5)}.` },
          { value: t4 * 2, label: num(t4 * 2), nope: `That doubles level 4. The XP only goes up by ${d} a level: ${num(t4)} + ${d} = ${num(t5)}.` },
          { value: t4 + 2 * d, label: num(t4 + 2 * d), nope: `That’s two jumps. Level 5 is just one jump after level 4: ${num(t4)} + ${d} = ${num(t5)}.` },
        ]),
        why: `Level 4 is ${num(t4)}. One more jump of ${d}: ${num(t4)} + ${d} = ${num(t5)} XP.`,
      },
    ],
    chain: [
      { line: `\\text{Jump} = [[p:${texNum(t2)}]] [[q:- ${texNum(t1)}]]` },
      { line: `\\text{Jump} = [[d:${d}]]`, op: 'Find the jump', merge: { d: ['p', 'q'] }, why: `Take any level from the next one. Level 2 needs ${num(t2)}, level 1 needs ${num(t1)}, so each level needs ${d} more.` },
      { line: `\\text{Lv }5 = [[t:${texNum(t4)}]] [[d:+ ${d}]]`, op: 'Add one jump', why: `Level 5 is one jump after level 4, so add ${d} to level 4’s XP.` },
      { line: `\\text{Lv }5 = [[r:${texNum(t5)}]]`, op: 'Add', merge: { r: ['t', 'd'] }, why: `${num(t4)} + ${d} = ${num(t5)}.` },
    ],
  }
}

function nthTerm(rand: Rand, { d, c, far, farXp }: Base, a: number): Round {
  const answer = rule(d, c)
  const times = d * far
  return {
    id: 'nth',
    title: 'Round 2 · The nth term',
    heading: `Predict level ${far} before you get there`,
    why: `Adding the jump ${far - 1} times is slow. The nth term is a cheat code: a rule that turns any level number n straight into its XP. The jump goes in front of n, because each level adds one more jump.`,
    questions: [
      {
        asker: 'crack the rule',
        prompt: `XP goes ${num(a)}, ${num(a + d)}, ${num(a + 2 * d)}, ${num(a + 3 * d)} … What’s the rule for level n?`,
        answer,
        choices: options<string | number>(rand, { value: answer, label: answer }, [
          { value: rule(d, a), label: rule(d, a), nope: `Check level 1: ${d} × 1 + ${a} = ${d + a}, not ${a}. The add-on is first term − jump: ${a} − ${d} = ${c}.` },
          { value: `n + ${d}`, label: `n + ${d}`, nope: `n + ${d} only goes up by 1 a level. The XP goes up by ${d}, so it’s ${d}n, the ${d} times table.` },
          { value: rule(a, d), label: rule(a, d), nope: `That goes up by ${a} a level, but the jump is ${d}. The number in front of n is always the jump.` },
        ]),
        why: `The jump is ${d}, so start with the ${d} times table: ${d}n. That gives ${d} at level 1, but level 1 needs ${a}, so add ${c}. Rule: ${answer}.`,
      },
      {
        asker: 'jump ahead',
        prompt: `Use ${answer}. How much XP for level ${far}?`,
        answer: farXp,
        choices: options<string | number>(rand, { value: farXp, label: num(farXp) }, [
          { value: times, label: num(times), nope: `That’s ${d} × ${far}, but the rule has + ${c} too: ${num(times)} + ${c} = ${num(farXp)}.` },
          { value: a * far, label: num(a * far), nope: `That’s level 1’s XP × ${far}. Use the rule: ${d} × ${far} + ${c} = ${num(farXp)}.` },
          { value: far + d, label: num(far + d), nope: `That’s ${far} + ${d}. In ${d}n, n is multiplied: ${d} × ${far} + ${c} = ${num(farXp)}.` },
          { value: (a + d) * far, label: num((a + d) * far), nope: `Use the rule as it is: ${d} × ${far} + ${c} = ${num(farXp)}.` },
        ]),
        why: `Swap n for ${far}: ${d} × ${far} = ${num(times)}, then + ${c} makes ${num(farXp)} XP. No grinding needed.`,
      },
    ],
    chain: [
      { line: `\\text{XP} = [[d:${d}]]n [[q:+ \\,?]]` },
      { line: `\\text{XP} = [[d:${d}]]n + ([[a:${a}]] [[s:- ${d}]])`, op: 'Find the add-on', why: `The ${d} times table gives ${d} at level 1, but level 1 needs ${a}. The add-on is level 1 − jump.` },
      { line: `\\text{XP} = [[d:${d}]]n [[c:+ ${c}]]`, op: 'nth term', merge: { c: ['a', 's'] }, why: `${a} − ${d} = ${c}. Check level 1: ${d} × 1 + ${c} = ${a}.` },
      { line: `\\text{XP} = [[d:${d}]] \\times [[n:${far}]] [[c:+ ${c}]]`, op: `n = ${far}`, why: `For level ${far}, swap n for ${far}.` },
      { line: `\\text{XP} = [[m:${texNum(times)}]] [[c:+ ${c}]]`, op: 'Multiply', merge: { m: ['d', 'n'] }, why: `${d} × ${far} = ${num(times)}. Multiply before you add.` },
      { line: `\\text{XP} = [[r:${texNum(farXp)}]]`, op: 'Add', merge: { r: ['m', 'c'] }, why: `${num(times)} + ${c} = ${num(farXp)} XP for level ${far}.` },
    ],
  }
}

function member(rand: Rand, { d, c, target, hit, level }: Base): Round {
  const rest = target - c
  const low = xp(d, c, level)
  const high = xp(d, c, level + 1)
  const r = rule(d, c)
  const wrongs: Option<string | number>[] = hit ? [
    { value: target / d, label: num(target / d), nope: `That’s ${num(target)} ÷ ${d}, but the rule adds ${c} first. Take it off: ${num(target)} − ${c} = ${num(rest)}, then ÷ ${d} = ${level}.` },
    { value: rest, label: num(rest), nope: `That’s ${num(target)} − ${c}. Now share by the jump: ${num(rest)} ÷ ${d} = ${level}.` },
    { value: (target + c) / d, label: num((target + c) / d), nope: `Undo + ${c} by taking ${c} away, not adding it: (${num(target)} − ${c}) ÷ ${d} = ${level}.` },
  ] : [
    { value: level + 1, label: num(level + 1), nope: `Level ${level + 1} needs ${num(high)} XP, which goes over ${num(target)}. One level lower fits.` },
    { value: target / d, label: num(target / d), nope: `That’s ${num(target)} ÷ ${d}, forgetting the + ${c}. Take it off first: ${num(target)} − ${c} = ${num(rest)}. Level ${level} needs ${num(low)}.` },
    { value: rest, label: num(rest), nope: `That’s XP, not a level. Level ${level} needs ${num(low)}, the biggest one under ${num(target)}.` },
  ]
  const yesNo = (value: string) => value === (hit ? 'yes' : 'no')
  const missWhy = `Level ${level} needs ${num(low)} and level ${level + 1} needs ${num(high)}. ${num(target)} falls in the gap, so no level needs exactly that.`
  const hitWhy = `${num(target)} − ${c} = ${num(rest)}, and ${num(rest)} ÷ ${d} = ${level} exactly. Level ${level} needs ${num(target)} XP.`
  const back = [
    { line: `[[d:${d}]]n [[c:+ ${c}]] = [[x:${texNum(target)}]]` },
    { line: `[[d:${d}]]n = [[x:${texNum(target)}]] [[k:- ${c}]]`, op: `− ${c} both sides`, why: `Run the rule backwards. It adds ${c} last, so undo that first.` },
    { line: `[[d:${d}]]n = [[r:${texNum(rest)}]]`, op: 'Simplify', merge: { r: ['x', 'k'] }, why: `${num(target)} − ${c} = ${num(rest)}.` },
    { line: `n = [[r:${texNum(rest)}]] \\div [[d:${d}]]`, op: `÷ ${d} both sides`, why: `${d}n means ${d} lots of n, so share by ${d} to find the level.` },
  ]
  return {
    id: 'member',
    title: 'Round 3 · Is it in the sequence?',
    heading: `Will exactly ${num(target)} XP ever be a level?`,
    why: 'Every level’s XP comes from the rule. To check a number, run the rule backwards. Land on a whole level number and it’s in; land between two levels and it’s skipped.',
    questions: [
      {
        asker: 'yes or no',
        prompt: `The rule is ${r}. Does any level need exactly ${num(target)} XP?`,
        answer: hit ? 'yes' : 'no',
        choices: [
          { value: 'yes', label: 'Yes', nope: yesNo('yes') ? undefined : `${missWhy} Check: (${num(target)} − ${c}) isn’t in the ${d} times table.` },
          { value: 'no', label: 'No', nope: yesNo('no') ? undefined : `Run the rule backwards: ${hitWhy}` },
        ],
        why: hit ? hitWhy : `${num(target)} − ${c} = ${num(rest)}, which isn’t in the ${d} times table. ${missWhy}`,
      },
      hit ? {
        asker: 'name the level',
        prompt: `Which level needs exactly ${num(target)} XP?`,
        answer: level,
        choices: options<string | number>(rand, { value: level, label: num(level) }, wrongs, { valid: value => typeof value === 'number' && whole(value) }),
        why: `Check: ${d} × ${level} + ${c} = ${num(target)}. Level ${level}, locked in.`,
      } : {
        asker: 'closest without going over',
        prompt: `So which level gets closest to ${num(target)} XP without going over?`,
        answer: level,
        choices: options<string | number>(rand, { value: level, label: num(level) }, wrongs, { valid: value => typeof value === 'number' && whole(value) }),
        why: `Level ${level} needs ${d} × ${level} + ${c} = ${num(low)}. Level ${level + 1} needs ${num(high)}, too much.`,
      },
    ],
    chain: hit ? [
      ...back,
      { line: `n = [[l:${level}]]`, op: 'Divide', merge: { l: ['r', 'd'] }, why: `${num(rest)} ÷ ${d} = ${level}, a whole number. So ${num(target)} XP is exactly level ${level}.` },
    ] : [
      ...back,
      { line: `\\text{Lv }${level} = [[lo:${texNum(low)}]]`, op: 'Not whole', why: `${num(rest)} isn’t in the ${d} times table, so n isn’t whole. The nearest level under it is ${level}: ${d} × ${level} + ${c} = ${num(low)}.` },
      { line: `\\text{Lv }${level + 1} = [[hi:${texNum(high)}]]`, op: 'One more jump', why: `Level ${level + 1} needs ${num(high)}, over ${num(target)}. So ${num(target)} is skipped, and level ${level} is the closest without going over.` },
    ],
  }
}
