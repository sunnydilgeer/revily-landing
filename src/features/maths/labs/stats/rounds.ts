import type { ChainStep } from '../../step-chain/StepChain'
import { options, type Option, type Rand } from '../kit/random'

/*
 * Kai's screen time: minutes per day, always a multiple of 10 from 60 to 300 (the chart tops out at
 * 5 hours). Means are picked first and the days built around them, so every average is a whole
 * multiple of 10 and every median lands on one too.
 */

export type Stat = 'mean' | 'median' | 'mode' | 'range'

export type Question = {
  kind: 'pick'
  prompt: string
  answer: number | string
  choices: Option<number | string>[]
  /** Why the right answer is right: shown when they get it. */
  why: string
  /** What the chart shows once this is answered. */
  shows: Stat[]
  /** Line the bars up in order once it's answered (finding the median). */
  sort?: boolean
}

/** Change one day so the mean drops to `target`. */
export type Rig = {
  kind: 'rig'
  prompt: string
  day: number
  from: number
  to: number
  target: number
  why: string
}

export type Step = Question | Rig

export type Round = {
  id: string
  title: string
  headline: string
  why: string
  days: string[]
  values: number[]
  /** Stats the chart shows from the start. */
  known: Stat[]
  steps: Step[]
  chain: ChainStep[]
}

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
/** The top of the chart: 5 hours. */
export const MAX_MINUTES = 300

export const total = (values: number[]) => values.reduce((sum, value) => sum + value, 0)
export const meanOf = (values: number[]) => total(values) / values.length
export const sortedOf = (values: number[]) => [...values].sort((a, b) => a - b)
export const rangeOf = (values: number[]) => Math.max(...values) - Math.min(...values)
export function medianOf(values: number[]) {
  const s = sortedOf(values), mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}
/** The most common value, or null when nothing repeats or there's a tie. */
export function modeOf(values: number[]) {
  const counts = new Map<number, number>()
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1)
  const top = Math.max(...counts.values())
  const modes = [...counts].filter(([, count]) => count === top)
  return top > 1 && modes.length === 1 ? modes[0][0] : null
}

const min = (value: number) => `${value} min`
const list = (values: number[]) => values.join(', ')

/** n distinct multiples of 10 from 60 to 300, in a random order. */
function distinct(rand: Rand, n: number, lo = 60, hi = MAX_MINUTES) {
  const all = Array.from({ length: (hi - lo) / 10 + 1 }, (_, i) => lo + i * 10)
  return rand.shuffle(all).slice(0, n)
}

/** Five different days whose mean is a whole multiple of 10: pick the mean, then four days, and the fifth makes the total. */
function weekWithMean(rand: Rand, lo: number, hi: number) {
  for (;;) {
    const mean = rand.int(lo, hi, 10)
    const four = distinct(rand, 4)
    const fifth = mean * 5 - total(four)
    const values = rand.shuffle([...four, fifth])
    if (fifth < 60 || fifth > MAX_MINUTES || four.includes(fifth)) continue
    return { mean, values }
  }
}

function meanRound(rand: Rand): Round {
  for (;;) {
    const { mean, values } = weekWithMean(rand, 100, 200)
    const n = values.length, sum = total(values), middle = values[2]
    const hi = Math.max(...values), lo = Math.min(...values), range = hi - lo
    // The middle day mustn't happen to be the mean, or that slip would be right by luck.
    if (middle === mean || medianOf(values) === mean) continue
    const days = DAYS.slice(0, n), hiDay = DAY_NAMES[values.indexOf(hi)], loDay = DAY_NAMES[values.indexOf(lo)]
    const steps: Step[] = [
      {
        kind: 'pick',
        prompt: `What’s Kai’s mean screen time per day?`,
        answer: mean,
        choices: options<number | string>(rand, { value: mean, label: min(mean) }, [
          { value: sum, label: min(sum), nope: `That’s the total: ${list(values)} add up to ${sum}. The mean shares it out, so divide by the ${n} days.` },
          { value: sum / (n - 1), label: min(sum / (n - 1)), nope: `That’s ${sum} ÷ ${n - 1}. There are ${n} days, so share the ${sum} minutes between ${n}.` },
          { value: middle, label: min(middle), nope: `That’s just Wednesday, the middle day. The mean uses every day: add them all up, then ÷ ${n}.` },
          { value: medianOf(values), label: min(medianOf(values)), nope: `That’s the median, the middle value in order. The mean uses every day: add them all up, then ÷ ${n}.` },
        ], { valid: value => typeof value === 'number' && Number.isInteger(value) && value % 10 === 0 && value > 0 }),
        why: `${list(values)} add up to ${sum} minutes. Shared over ${n} days: ${sum} ÷ ${n} = ${mean} a day.`,
        shows: ['mean'],
      },
      {
        kind: 'pick',
        prompt: `How spread out is it? What’s the range?`,
        answer: range,
        choices: options<number | string>(rand, { value: range, label: min(range) }, [
          { value: hi + lo, label: min(hi + lo), nope: `That’s ${hi} + ${lo}. Range is a gap, so take away: biggest − smallest.` },
          { value: hi, label: min(hi), nope: `That’s just the biggest day. The range is the gap from the smallest (${lo}) up to the biggest.` },
          { value: hi - mean, label: min(hi - mean), nope: `That’s the biggest day minus the mean. Range is biggest − smallest: use ${lo}, not the mean.` },
        ]),
        why: `Biggest is ${hiDay} (${hi}), smallest is ${loDay} (${lo}). ${hi} − ${lo} = ${range} minutes between the best and worst day.`,
        shows: ['range'],
      },
    ]
    return {
      id: 'mean',
      title: 'Round 1 · Mean & range',
      headline: 'The school week. How bad is it?',
      why: `The mean shares the total out equally, as if every day had the same screen time. So add up every day, then divide by how many days there are. The range says how spread out the days are: biggest − smallest.`,
      days, values, known: [], steps,
      chain: [
        { line: `\\text{Mean} = \\frac{[[t:\\text{total}]]}{[[n:\\text{days}]]}` },
        { line: `\\text{Mean} = \\frac{[[s:${sum}]]}{[[k:${n}]]}`, op: 'Fill it in', merge: { s: ['t'], k: ['n'] }, why: `${list(values)} add up to ${sum} minutes, over ${n} days.` },
        { line: `\\text{Mean} = [[m:${mean}]]\\text{ min}`, op: `÷ ${n}`, merge: { m: ['s', 'k'] }, why: `${sum} ÷ ${n} = ${mean}. If every day were the same, each would be ${mean} minutes.` },
        { line: `\\text{Range} = [[x:${hi}]] - [[y:${lo}]]`, op: 'Biggest − smallest', why: `Now the spread. The tallest bar is ${hiDay} (${hi}) and the shortest is ${loDay} (${lo}).` },
        { line: `\\text{Range} = [[r:${range}]]\\text{ min}`, op: 'Take away', merge: { r: ['x', 'y'] }, why: `${hi} − ${lo} = ${range}. A big range means the days are very different from each other.` },
      ],
    }
  }
}

const ordinal = (n: number) => `${n}${n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'}`

function medianRound(rand: Rand): Round {
  const n = rand.pick([6, 7])
  for (;;) {
    const unique = distinct(rand, n - 1, 60, 280)
    const mode = rand.pick(unique)
    const values = rand.shuffle([...unique, mode])
    const s = sortedOf(values), median = medianOf(values), mid = Math.floor(n / 2)
    if (mode === Math.max(...values)) continue
    if (n === 7 && s[mid] === mode) continue
    // An even count: the middle two are 20 apart, so halfway is still a multiple of 10.
    if (n === 6 && (s[mid] - s[mid - 1] !== 20 || s[mid] === mode || s[mid - 1] === mode)) continue
    // The middle of the UNORDERED list must be a different number, or that slip would be right by luck.
    const loose = n === 7 ? values[mid] : (values[mid - 1] + values[mid]) / 2
    if (loose === median) continue

    const days = DAYS.slice(0, n), modeDays = days.filter((_, i) => values[i] === mode).map(day => DAY_NAMES[DAYS.indexOf(day)])
    const hi = Math.max(...values), lo = Math.min(...values)
    const tens = (value: number) => Number.isInteger(value) && value % 10 === 0 && value > 0
    const medianChoices = n === 7
      ? options<number | string>(rand, { value: median, label: min(median) }, [
        { value: loose, label: min(loose), nope: `That’s Thursday, the middle DAY. Put the minutes in order first: ${list(s)}. The middle one is ${median}.` },
        { value: (hi + lo) / 2, label: min((hi + lo) / 2), nope: `That’s halfway between the biggest and smallest. The median is the middle value once they’re in order: ${list(s)}.` },
        { value: s[mid + 1], label: min(s[mid + 1]), nope: `Close, but that’s the ${ordinal(mid + 2)} in order. With ${n} values the middle is the ${ordinal(mid + 1)}: ${mid} either side.` },
        { value: s[mid - 1], label: min(s[mid - 1]), nope: `Close, but that’s the ${ordinal(mid)} in order. With ${n} values the middle is the ${ordinal(mid + 1)}: ${mid} either side.` },
      ], { valid: value => typeof value === 'number' && tens(value) })
      : options<number | string>(rand, { value: median, label: min(median) }, [
        { value: loose, label: min(loose), nope: `That’s halfway between Wednesday and Thursday, the middle DAYS. Order the minutes first: ${list(s)}.` },
        { value: s[mid], label: min(s[mid]), nope: `${s[mid]} is one of the two middle values. With ${n} values there are two in the middle, ${s[mid - 1]} and ${s[mid]}, so go halfway between them.` },
        { value: s[mid - 1], label: min(s[mid - 1]), nope: `${s[mid - 1]} is one of the two middle values. With ${n} values there are two in the middle, so go halfway between ${s[mid - 1]} and ${s[mid]}.` },
      ], { valid: value => typeof value === 'number' && tens(value) })
    const medianWhy = n === 7
      ? `In order: ${list(s)}. The middle one, ${mid} either side, is ${median}.`
      : `In order: ${list(s)}. The middle two are ${s[mid - 1]} and ${s[mid]}, and halfway between is ${median}.`

    const steps: Step[] = [
      {
        kind: 'pick',
        prompt: `What’s the median screen time?`,
        answer: median,
        choices: medianChoices,
        why: medianWhy,
        shows: ['median'],
        sort: true,
      },
      {
        kind: 'pick',
        prompt: `And the mode?`,
        answer: mode,
        choices: options<number | string>(rand, { value: mode, label: min(mode) }, [
          { value: hi, label: min(hi), nope: `That’s the biggest day, not the most common. The mode is the value that turns up most often.` },
          { value: 2, label: min(2), nope: `2 is how many times it turns up. The mode is the value itself: ${mode} appears twice.` },
          { value: median, label: min(median), nope: `That’s the median, the middle one. The mode is the most common: which value appears more than once?` },
        ]),
        why: `${mode} turns up twice (${modeDays.join(' and ')}). Every other value only appears once.`,
        shows: ['mode'],
      },
    ]

    const chain: ChainStep[] = n === 7
      ? [
        { line: `\\text{Middle} = \\frac{[[n:${n}]] + 1}{2}` },
        { line: `\\text{Middle} = [[p:${mid + 1}]]\\text{th}`, op: 'Find the spot', merge: { p: ['n'] }, why: `Line all ${n} up in order. (${n} + 1) ÷ 2 = ${mid + 1}, so the ${ordinal(mid + 1)} value is the middle: ${mid} either side.` },
        { line: `\\text{Median} = [[x:${median}]]\\text{ min}`, op: 'Count along', merge: { x: ['p'] }, why: `In order: ${list(s)}. The ${ordinal(mid + 1)} one is ${median}.` },
        { line: `\\text{Mode} = [[o:${mode}]]\\text{ min}`, op: 'Most common', why: `${mode} turns up twice (${modeDays.join(' and ')}). Nothing else repeats.` },
      ]
      : [
        { line: `\\text{Middle} = \\frac{[[n:${n}]] + 1}{2}` },
        { line: `\\text{Middle} = [[p:${mid}.5]]\\text{th}`, op: 'Find the spot', merge: { p: ['n'] }, why: `(${n} + 1) ÷ 2 = ${mid}.5. There’s no single middle, so it’s halfway between the ${ordinal(mid)} and ${ordinal(mid + 1)} values.` },
        { line: `\\text{Median} = \\frac{[[a:${s[mid - 1]}]] + [[b:${s[mid]}]]}{2}`, op: 'Halfway between', why: `In order: ${list(s)}. The ${ordinal(mid)} is ${s[mid - 1]} and the ${ordinal(mid + 1)} is ${s[mid]}.` },
        { line: `\\text{Median} = [[x:${median}]]\\text{ min}`, op: 'Work it out', merge: { x: ['a', 'b'] }, why: `${s[mid - 1]} + ${s[mid]} = ${s[mid - 1] + s[mid]}, and ÷ 2 = ${median}.` },
        { line: `\\text{Mode} = [[o:${mode}]]\\text{ min}`, op: 'Most common', why: `${mode} turns up twice (${modeDays.join(' and ')}). Nothing else repeats.` },
      ]

    return {
      id: 'median',
      title: 'Round 2 · Median & mode',
      headline: `The whole week. Find the “usual” day.`,
      why: `One huge day drags the mean up. The median ignores that: put the days in order of minutes and take the middle one. The mode is the value that turns up most often.`,
      days, values, known: [], steps, chain,
    }
  }
}

/** What Kai's parents would see if the rigged day were `value`, and what the total really needs. */
export function rigNope(round: Round, rig: Rig, value: number) {
  const n = round.values.length, now = (total(round.values) - rig.from + value) / n
  const mean = meanOf(round.values), drop = mean - rig.target
  return `That makes the mean ${now}, not ${rig.target}. To drop the mean by ${drop} over ${n} days, the total must drop by ${drop} × ${n} = ${drop * n} minutes.`
}

function rigRound(rand: Rand): Round {
  for (;;) {
    const { mean, values } = weekWithMean(rand, 130, 200)
    const n = values.length, drop = rand.pick([10, 20, 30]), cut = drop * n
    const candidates = values.map((value, i) => i).filter(i => values[i] - cut >= 20)
    if (!candidates.length) continue
    const day = rand.pick(candidates), from = values[day], to = from - cut, target = mean - drop
    const after = values.map((value, i) => i === day ? to : value)
    if (after.filter(value => value === to).length > 1) continue
    const name = DAY_NAMES[day]

    const oldRange = rangeOf(values), newRange = rangeOf(after)
    const oldMedian = medianOf(values), newMedian = medianOf(after)
    const hi = Math.max(...after), lo = Math.min(...after)
    let follow: Question
    if (rand.chance(.5)) {
      follow = {
        kind: 'pick',
        prompt: `${name} is now ${to}. What’s the new range?`,
        answer: newRange,
        choices: options<number | string>(rand, { value: newRange, label: min(newRange) }, [
          { value: oldRange, label: min(oldRange), nope: `That was the old range. ${name} changed, so check the biggest and smallest again: ${hi} and ${lo}.` },
          { value: hi + lo, label: min(hi + lo), nope: `That’s ${hi} + ${lo}. Range is biggest − smallest.` },
          { value: hi, label: min(hi), nope: `That’s just the biggest day. Take away the smallest (${lo}) to get the gap.` },
          { value: hi - target, label: min(hi - target), nope: `That’s the biggest day minus the mean. Range is biggest − smallest: use ${lo}.` },
        ]),
        why: newRange === oldRange
          ? `The biggest (${hi}) and smallest (${lo}) didn’t change, so the range is still ${hi} − ${lo} = ${newRange}. Rigging the mean didn’t touch the spread.`
          : `Now the biggest is ${hi} and the smallest is ${lo}: ${hi} − ${lo} = ${newRange}. Rigging ${name} changed the spread too.`,
        shows: ['range'],
      }
    } else {
      const moved = newMedian !== oldMedian
      follow = {
        kind: 'pick',
        prompt: `Did rigging ${name} change the median?`,
        answer: moved ? 'yes' : 'no',
        choices: options<number | string>(rand, { value: moved ? 'yes' : 'no', label: moved ? 'Yes, it moved' : 'No, it’s the same' }, [
          moved
            ? { value: 'no', label: 'No, it’s the same', nope: `It moved. In order the days are now ${list(sortedOf(after))}, so the middle one is ${newMedian}, not ${oldMedian}.` }
            : { value: 'yes', label: 'Yes, it moved', nope: `Look again. In order the days are now ${list(sortedOf(after))}. The middle one is still ${oldMedian}.` },
        ], { count: 2 }),
        why: moved
          ? `In order: ${list(sortedOf(after))}. ${name} jumped past the middle, so the median went from ${oldMedian} to ${newMedian}.`
          : `In order: ${list(sortedOf(after))}. The middle is still ${oldMedian}: ${name} stayed on the same side of the middle. The median doesn’t care how big the extremes are.`,
        shows: ['median'],
      }
    }

    const rig: Rig = {
      kind: 'rig',
      prompt: `Change ${name} so the mean drops to ${target}.`,
      day, from, to, target,
      why: `${name}: ${from} → ${to}. That cuts the total by ${cut}, and ${cut} ÷ ${n} = ${drop}, so the mean drops from ${mean} to ${target}.`,
    }
    return {
      id: 'rig',
      title: 'Round 3 · Rig it',
      headline: `Change ONE day. Shrink the mean.`,
      why: `Mean = total ÷ ${n}. Every minute you cut from one day is shared across all ${n} days, so the mean only drops by a ${n === 5 ? 'fifth' : `1/${n}`} of what you cut. Work out how much the TOTAL has to drop.`,
      days: DAYS.slice(0, n), values, known: ['mean'],
      steps: [rig, follow],
      chain: [
        { line: `\\text{Drop} = [[c:${mean}]] - [[m:${target}]]` },
        { line: `\\text{Drop} = [[d:${drop}]]`, op: 'Take away', merge: { d: ['c', 'm'] }, why: `The mean has to fall from ${mean} to ${target}: ${drop} minutes a day.` },
        { line: `\\text{Cut} = [[d:${drop}]] \\times [[n:${n}]]`, op: `× ${n} days`, why: `The mean is the total shared over ${n} days, so the total has to fall by ${drop} for every one of them.` },
        { line: `\\text{Cut} = [[k:${cut}]]`, op: 'Work it out', merge: { k: ['d', 'n'] }, why: `${drop} × ${n} = ${cut} minutes off the total.` },
        { line: `\\text{${DAYS[day]}} = [[v:${from}]] - [[k:${cut}]]`, op: `Take it off ${DAYS[day]}`, why: `All ${cut} minutes come off ${name}, the one day we’re rigging.` },
        { line: `\\text{${DAYS[day]}} = [[w:${to}]]\\text{ min}`, op: 'Work it out', merge: { w: ['v', 'k'] }, why: `${from} − ${cut} = ${to}. New total ÷ ${n} = ${target}. Rigged.` },
      ],
    }
  }
}

export function makeRounds(rand: Rand): Round[] {
  return [meanRound(rand), medianRound(rand), rigRound(rand)]
}
