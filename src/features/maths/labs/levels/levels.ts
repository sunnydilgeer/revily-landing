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
  /** Round 4: a corrupted save with its own rule dn + c, where only levels p and q survive. */
  save: { d: number; c: number; p: number; q: number }
  /** Round 5: the boss's HP after hit n is c − dn, so it hits 0 on hit ko = c ÷ d. */
  boss: { d: number; c: number; ko: number }
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
  // Round 4: a different rule from rounds 1–3, so the jump has to be worked out from two far-apart levels.
  let sd = d, sc = c
  while (sd === d && sc === c) { sd = rand.pick(JUMPS.slice(0, 4)); sc = rand.pick(ADD_ONS[sd]) }
  // 3 to 5 jumps apart, but never as many jumps as the jump itself, so "levels apart" is always a wrong option.
  const p = rand.int(2, 4), q = p + rand.pick(sd === 5 ? [3, 4] : [3, 4, 5])
  // Round 5: the boss's HP. Pick the knockout hit first, so HP = c − dn lands on exactly 0.
  const bd = rand.pick(JUMPS), ko = rand.int(8, 20)
  const game = {
    d, c, terms, far, farXp: xp(d, c, far), target: pickTarget.x, hit: pickTarget.hit, level: pickTarget.level,
    save: { d: sd, c: sc, p, q }, boss: { d: bd, c: bd * ko, ko },
  }
  return { ...game, rounds: [pattern(rand, game, a), nthTerm(rand, game, a), member(rand, game), corrupted(rand, game), bossFight(rand, game)] }
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

/** "500 − 30n": the boss's HP rule, with a proper minus sign. */
const down = (c: number, d: number) => `${num(c)} − ${d}n`

function corrupted(rand: Rand, { save }: Base): Round {
  const { d, c, p, q } = save
  const tp = xp(d, c, p), tq = xp(d, c, q), gap = q - p, diff = tq - tp, answer = rule(d, c)
  const count = (value: string | number) => typeof value === 'number' && whole(value)
  return {
    id: 'corrupted',
    title: 'Round 4 · Corrupted save',
    heading: `Only levels ${p} and ${q} survived`,
    why: `The save file glitched and wiped most of the XP table. The gap between two levels is made of equal jumps, so share it by how many jumps there are. Then take that many jumps off a level to find the add-on.`,
    questions: [
      {
        asker: 'rebuild the jump',
        prompt: `Level ${p} needs ${num(tp)} XP and level ${q} needs ${num(tq)} XP. What’s the jump from one level to the next?`,
        answer: d,
        choices: options<string | number>(rand, { value: d, label: num(d) }, rand.shuffle([
          { value: diff, label: num(diff), nope: `${num(diff)} is the whole gap, ${num(tq)} − ${num(tp)}. That’s ${gap} jumps stacked up, so share it: ${num(diff)} ÷ ${gap} = ${d}.` },
          { value: diff / (gap + 1), label: num(diff / (gap + 1)), nope: `Levels ${p} to ${q} is ${gap} jumps (${q} − ${p}), not ${gap + 1}. Count the gaps, not the levels: ${num(diff)} ÷ ${gap} = ${d}.` },
          { value: gap, label: num(gap), nope: `${gap} is how many levels apart they are, not the XP. The XP gap is ${num(diff)}, shared over ${gap} jumps: ${d}.` },
          { value: tq / q, label: num(tq / q), nope: `That’s ${num(tq)} ÷ ${q}, but the XP isn’t just ${q} jumps: there’s an add-on too. Use the gap: (${num(tq)} − ${num(tp)}) ÷ ${gap} = ${d}.` },
        ]), { valid: count }),
        why: `${num(tq)} − ${num(tp)} = ${num(diff)} XP over ${gap} jumps. ${num(diff)} ÷ ${gap} = ${d} a level.`,
      },
      {
        asker: 'restore the rule',
        prompt: `The jump is ${d}. What’s the rule for level n?`,
        answer,
        choices: options<string | number>(rand, { value: answer, label: answer }, rand.shuffle([
          { value: rule(d, tp - d), label: rule(d, tp - d), nope: `That takes one jump off level ${p}. But level ${p} is ${p} jumps plus the add-on: ${num(tp)} − ${p} × ${d} = ${c}.` },
          { value: rule(d, tp), label: rule(d, tp), nope: `${num(tp)} is level ${p}’s XP. Check: ${d} × ${p} + ${num(tp)} = ${num(d * p + tp)}, not ${num(tp)}. Take ${p} jumps off: ${num(tp)} − ${d * p} = ${c}.` },
          { value: rule(diff, c), label: rule(diff, c), nope: `${num(diff)} is the whole gap, not one jump. The number in front of n is the jump: ${d}.` },
        ])),
        why: `Level ${p} needs ${num(tp)}, which is ${p} jumps of ${d} (${d * p}) plus the add-on. ${num(tp)} − ${d * p} = ${c}. Rule: ${answer}.`,
      },
    ],
    chain: [
      { line: `[[q:${texNum(tq)}]] [[p:- ${texNum(tp)}]]` },
      { line: `\\text{Gap} = [[g:${texNum(diff)}]]`, op: 'Subtract', merge: { g: ['q', 'p'] }, why: `Level ${q} needs ${num(tq)} and level ${p} needs ${num(tp)}. The gap between them is ${num(diff)} XP.` },
      { line: `[[g:${texNum(diff)}]] \\div [[j:${gap}]]`, op: `${gap} jumps`, why: `From level ${p} to level ${q} is ${q} − ${p} = ${gap} jumps. Count the gaps, not the levels.` },
      { line: `\\text{Jump} = [[d:${d}]]`, op: 'Divide', merge: { d: ['g', 'j'] }, why: `${num(diff)} ÷ ${gap} = ${d} XP a level. That goes in front of n.` },
      { line: `c = [[t:${texNum(tp)}]] [[s:- ${p} \\times ${d}]]`, op: 'Find the add-on', why: `Level ${p} is ${p} jumps of ${d} plus the add-on. So take ${p} jumps off its XP.` },
      { line: `c = [[c:${c}]]`, op: 'Work it out', merge: { c: ['t', 's'] }, why: `${num(tp)} − ${d * p} = ${c}.` },
      { line: `\\text{XP} = [[d:${d}]]n [[c:+ ${c}]]`, op: 'nth term', why: `Check level ${q}: ${d} × ${q} + ${c} = ${num(tq)}. Save restored.` },
    ],
  }
}

function bossFight(rand: Rand, { boss }: Base): Round {
  const { d, c, ko } = boss
  const [h1, h2, h3, h4] = [1, 2, 3, 4].map(hit => c - d * hit)
  const answer = down(c, d)
  return {
    id: 'boss',
    title: 'Round 5 · Boss fight',
    heading: `The boss has ${num(h1)} HP after your first hit`,
    why: `This time the numbers go down, so the jump is negative. The rule still works: first term minus the jump gives the number on its own. Then set the rule equal to 0 to find the knockout hit.`,
    questions: [
      {
        asker: 'read the health bar',
        prompt: `After each hit the boss has ${num(h1)}, ${num(h2)}, ${num(h3)}, ${num(h4)} HP … What’s the rule for its HP after hit n?`,
        answer,
        choices: options<string | number>(rand, { value: answer, label: answer }, rand.shuffle([
          { value: down(h1, d), label: down(h1, d), nope: `Check hit 1: ${num(h1)} − ${d} = ${num(h1 - d)}, not ${num(h1)}. The number on its own is first term − jump: ${num(h1)} − (−${d}) = ${num(c)}.` },
          { value: `${d}n + ${num(h1)}`, label: `${d}n + ${num(h1)}`, nope: `+ ${d}n makes the HP go up each hit, but it drops by ${d}. The jump is −${d}, so it’s − ${d}n.` },
          { value: `${d}n − ${num(c)}`, label: `${d}n − ${num(c)}`, nope: `Check hit 1: ${d} − ${num(c)} is negative, but the boss has ${num(h1)}. Start at ${num(c)} and take ${d}n away: ${answer}.` },
        ])),
        why: `The HP drops by ${d} a hit, so the jump is −${d}. The number on its own is ${num(h1)} − (−${d}) = ${num(c)}. Rule: ${answer}.`,
      },
      {
        asker: 'land the knockout',
        prompt: `HP = ${answer}. Which hit takes the boss to exactly 0 HP?`,
        answer: ko,
        choices: options<string | number>(rand, { value: ko, label: num(ko) }, rand.shuffle([
          { value: ko - 1, label: num(ko - 1), nope: `That’s ${num(h1)} ÷ ${d}, counting from the HP after hit 1. Use the rule: ${num(c)} − ${d}n = 0, so n = ${num(c)} ÷ ${d} = ${ko}. Hit ${ko - 1} still leaves ${d} HP.` },
          { value: ko + 1, label: num(ko + 1), nope: `One hit too many. After hit ${ko + 1} the HP would be ${num(c)} − ${d * (ko + 1)} = −${d}. It hits 0 on hit ${ko}.` },
          { value: -ko, label: `−${ko}`, nope: `You can’t land a negative hit. Sign slip: ${num(c)} − ${d}n = 0 means ${d}n = ${num(c)}, so n = ${num(c)} ÷ ${d} = ${ko}.` },
        ]), { valid: value => typeof value === 'number' && Number.isInteger(value) && value !== 0 }),
        why: `${num(c)} − ${d}n = 0, so ${d}n = ${num(c)} and n = ${num(c)} ÷ ${d} = ${ko}. Hit ${ko} is the knockout.`,
      },
    ],
    chain: [
      { line: `\\text{Jump} = [[b:${texNum(h2)}]] [[a:- ${texNum(h1)}]]` },
      { line: `\\text{Jump} = [[d:-${d}]]`, op: 'Find the jump', merge: { d: ['b', 'a'] }, why: `The HP drops by ${d} every hit, so the jump is negative: −${d}.` },
      { line: `\\text{HP} = [[c:${texNum(c)}]] [[d:- ${d}n]]`, op: 'nth term', why: `First term − jump: ${num(h1)} − (−${d}) = ${num(h1)} + ${d} = ${num(c)}. A negative jump means − ${d}n.` },
      { line: `[[c:${texNum(c)}]] [[d:- ${d}n]] = 0`, op: 'K.O. = 0 HP', why: `Knocked out means 0 HP left, so set the rule equal to 0.` },
      { line: `[[c:${texNum(c)}]] = [[d:${d}n]]`, op: `+ ${d}n both sides`, why: `Move the ${d}n across so it’s positive.` },
      { line: `n = [[c:${texNum(c)}]] \\div [[e:${d}]]`, op: `÷ ${d} both sides`, why: `${d}n means ${d} lots of n, so share ${num(c)} by ${d}.` },
      { line: `n = [[k:${ko}]]`, op: 'Divide', merge: { k: ['c', 'e'] }, why: `${num(c)} ÷ ${d} = ${ko}. Check: ${num(c)} − ${d} × ${ko} = 0. K.O. on hit ${ko}.` },
    ],
  }
}
