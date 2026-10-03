import type { ChainStep } from '../../step-chain/StepChain'
import { options, texNum, type Option, type Rand } from '../kit/random'

/*
 * Going Viral: Tia's stats, drawn as charts for a brand pitch.
 *
 * Round 1 builds a bar chart on a scale that goes up in 20s, 50s or 100s (labelled every 2 lines),
 * so the student must work out what one line is worth. Round 2 slices a pie: 360 ÷ total degrees per
 * viewer, × each group. Round 3 fixes a fake chart whose axis starts near the data, then finds the
 * honest % increase. Every answer is picked first and the data is built backwards from it.
 */

/** One dial-and-check move. */
export type Shot = {
  id: string
  prompt: string
  /** Which bar, sector or (for the fake chart) which control the dial drives. */
  slot: number
  /** The right dial value. */
  target: number
  /** Where the dial starts: never the target. */
  start: number
  min: number
  max: number
  step: number
  jump?: number
  label: string
  unit: 'sq' | 'deg' | 'axis' | 'pct'
  /** Why the right value is right: shown on a hit. */
  win: string
}

export type Side = { prompt: string; answer: string; choices: Option<string>[]; why: string }

export type Post = { name: string; emoji: string; views: number }
export type Group = { name: string; emoji: string; count: number; angle: number }

type Base = { id: string; title: string; headline: string; why: string; shots: Shot[]; side: Side | null; chain: ChainStep[] }

export type BarRound = Base & {
  kind: 'bar'
  /** Views per gridline. Labels go up every 2 lines. */
  line: number
  posts: Post[]
  /** Bars already on the chart. */
  drawn: number[]
}

export type PieRound = Base & { kind: 'pie'; total: number; groups: Group[]; drawn: number[] }

export type FakeRound = Base & {
  kind: 'fake'
  before: number
  after: number
  rise: number
  percent: number
  /** Where the fake chart's axis starts. */
  fakeStart: number
  /** The rise the fake chart makes it LOOK like, as a %. */
  look: number
}

export type Round = BarRound | PieRound | FakeRound

/** Gridlines up the bar chart's axis. */
export const LINES = 10

/** 6.5 → 6½ */
export const half = (value: number) => Number.isInteger(value) ? String(value) : `${Math.floor(value) || ''}½`
export const sqText = (value: number) => `${half(value)} square${value === 1 ? '' : 's'}`
export const num = (value: number) => value.toLocaleString('en-GB')
const texHalf = (value: number) => Number.isInteger(value) ? String(value) : `${value}`

const POSTS = [
  { name: 'Dance', emoji: '💃' }, { name: 'Prank', emoji: '🤡' }, { name: 'Haul', emoji: '🛍️' }, { name: 'Pet', emoji: '🐶' },
  { name: 'Q&A', emoji: '🎤' }, { name: 'Cook', emoji: '🍳' }, { name: 'Vlog', emoji: '🎬' }, { name: 'Glow-up', emoji: '✨' },
]

/** Build the bar chart: 5 posts, 2 bars already drawn, 3 to set. */
function barRound(rand: Rand): BarRound {
  for (;;) {
    const line = rand.pick([20, 50, 100])
    // Heights in half squares, 1 to 9½ squares, all different.
    const halves = rand.shuffle(Array.from({ length: 18 }, (_, i) => i + 2)).slice(0, 5)
    const names = rand.shuffle(POSTS).slice(0, 5)
    const posts: Post[] = names.map((p, i) => ({ ...p, views: (halves[i] * line) / 2 }))
    const drawn = rand.shuffle([0, 1, 2, 3, 4]).slice(0, 2).sort((a, b) => a - b)
    const toSet = [0, 1, 2, 3, 4].filter(i => !drawn.includes(i))
    const heights = toSet.map(i => posts[i].views / line)
    // At least one half square and one whole one to set.
    if (!heights.some(h => !Number.isInteger(h)) || !heights.some(h => Number.isInteger(h))) continue
    // A drawn bar on a whole line, so the scale can be checked against it.
    if (!drawn.some(i => Number.isInteger(posts[i].views / line))) continue

    const shots: Shot[] = toSet.map((slot, k) => {
      const p = posts[slot], t = p.views / line
      return {
        id: `bar-${k + 1}`,
        prompt: k === 0
          ? `${p.emoji} ${p.name} got ${num(p.views)} views. Read the scale, then set its bar.`
          : k === 1 ? `${p.emoji} ${p.name}: ${num(p.views)} views. Set its bar.` : `Last one. ${p.emoji} ${p.name}: ${num(p.views)} views.`,
        slot, target: t, start: 0, min: 0, max: LINES, step: 0.5, jump: 2, label: 'Bar height', unit: 'sq',
        win: `One line is ${line}. ${num(p.views)} ÷ ${line} = ${half(t)}${Number.isInteger(t) ? ' squares' : `: ${Math.floor(t)} lines up, then halfway to the next`}.`,
      }
    })
    // The working follows the half-square bar: the trickier read.
    const shown = shots.find(s => !Number.isInteger(s.target))!
    const p = posts[shown.slot], t = shown.target
    return {
      kind: 'bar', id: 'bar',
      title: 'Round 1 · Build the bar chart',
      headline: 'One line isn’t always 1',
      why: `Gridlines don’t always go up in 1s. Check the labels: here they go up ${line * 2} every 2 lines, so one line is worth ${line}. Then a bar’s height = views ÷ what one line is worth. Halfway between two lines is ${line / 2} more.`,
      line, posts, drawn, shots, side: null,
      chain: [
        { line: `\\text{1 line} = \\frac{[[a:${line * 2}]]}{[[b:2]]}` },
        { line: `\\text{1 line} = [[s:${line}]]`, op: '÷ 2', merge: { s: ['a', 'b'] }, why: `The labels jump ${line * 2} every 2 lines, so each line is ${line} views.` },
        { line: `\\text{bar} = \\frac{[[v:${p.views}]]}{[[s:${line}]]}`, op: 'Views ÷ 1 line', why: `${p.name} got ${num(p.views)} views. How many ${line}s fit in ${num(p.views)}?` },
        { line: `\\text{bar} = [[h:${texHalf(t)}]]`, op: `÷ ${line}`, merge: { h: ['v', 's'] }, why: `${num(p.views)} ÷ ${line} = ${t}.` },
        { line: `\\text{bar} = [[w:${Math.floor(t)}]] + [[x:\\tfrac12]]`, op: 'Read it', merge: { w: ['h'] }, why: `Up ${Math.floor(t)} lines, then half a line more: halfway is ${line / 2} views.` },
      ],
    }
  }
}

/** What a bar set to `x` squares reads, and what went wrong. */
function barNope(round: BarRound, shot: Shot, x: number) {
  const s = round.line, p = round.posts[shot.slot], v = p.views, t = shot.target
  const reads = `Your bar reads ${num(x * s)}, not ${num(v)}.`
  const fix = `${num(v)} ÷ ${s} = ${sqText(t)}.`
  if (x === 0) return `No bar at all! ${p.name} got ${num(v)} views. ${fix}`
  if (x === t / 2) return `You counted each line as ${s * 2}. The labels go up ${s * 2} every 2 lines, so one line is only ${s}. ${fix}`
  if (s !== 10 && x === v / 10) return `You counted each line as 10. Check the labels: they go up ${s * 2} every 2 lines, so one line is ${s}. ${fix}`
  if (x === t * 2) return `That’s double. One line is ${s}, not ${s / 2}. ${fix}`
  if (Math.abs(x - t) === 1) return `One line ${x > t ? 'too high' : 'too low'}. ${reads} ${fix}`
  if (Math.abs(x - t) === 0.5) return `Half a square out. Half a line is ${s / 2} views. ${reads} ${fix}`
  return `${reads} One line is ${s}, so ${fix}`
}

const VIEWERS = [
  { name: 'Superfans', emoji: '💖' }, { name: 'Lurkers', emoji: '👀' }, { name: 'Haters', emoji: '😤' }, { name: 'Bots', emoji: '🤖' },
]
/** Totals with the smallest angle step that keeps every viewer count whole. */
const TOTALS: [total: number, unit: number][] = [[36, 10], [60, 30], [72, 10], [90, 20], [120, 30], [180, 10]]

/** Slice the pie: first sector drawn, the student sets the other three. */
function pieRound(rand: Rand): PieRound {
  for (;;) {
    const [total, unit] = rand.pick(TOTALS)
    const per = 360 / total, parts = 360 / unit
    const lo = Math.ceil(30 / unit), hi = Math.floor(170 / unit)
    const ks = [rand.int(lo, hi), rand.int(lo, hi), rand.int(lo, hi)]
    const last = parts - ks[0] - ks[1] - ks[2]
    ks.push(last)
    if (last < lo || last > hi || new Set(ks).size !== 4) continue
    const groups: Group[] = VIEWERS.map((g, i) => ({ ...g, angle: ks[i] * unit, count: (ks[i] * unit) / per }))
    const shots: Shot[] = [1, 2, 3].map((slot, k) => {
      const g = groups[slot]
      const sum = k === 2 ? ` And ${groups.map(x => x.angle).join(' + ')} = 360°.` : ''
      return {
        id: `pie-${k + 1}`,
        prompt: k === 0
          ? `${total} viewers in all. ${g.emoji} ${g.count} are ${g.name}. Set their angle.`
          : k === 1 ? `${g.emoji} ${g.count} ${g.name}. Set their slice.` : `Last slice: ${g.emoji} ${g.count} ${g.name}.`,
        slot, target: g.angle, start: 0, min: 0, max: 360, step: 1, jump: 10, label: `${g.name} angle`, unit: 'deg',
        win: `360 ÷ ${total} = ${per}° per viewer. ${g.count} × ${per} = ${g.angle}°.${sum}`,
      }
    })
    const g = groups[1], a = groups.map(x => x.angle)
    return {
      kind: 'pie', id: 'pie',
      title: 'Round 2 · Slice the pie',
      headline: 'Share out 360°',
      why: `A pie chart shares out the 360° of a circle. Every viewer gets the same slice: 360 ÷ total. Then a group’s angle = how many in it × that slice. All the angles add up to 360°.`,
      total, groups, drawn: [0], shots, side: null,
      chain: [
        { line: `\\text{1 viewer} = \\frac{[[a:360]]}{[[t:${total}]]}` },
        { line: `\\text{1 viewer} = [[d:${per}]]^\\circ`, op: `360 ÷ ${total}`, merge: { d: ['a', 't'] }, why: `${total} viewers share the 360° of the circle: ${per}° each.` },
        { line: `\\text{${g.name}} = [[f:${g.count}]] \\times [[d:${per}]]^\\circ`, op: `× ${g.count}`, why: `There are ${g.count} ${g.name}, and each one is worth ${per}°.` },
        { line: `\\text{${g.name}} = [[g:${g.angle}]]^\\circ`, op: 'Multiply', merge: { g: ['f', 'd'] }, why: `${g.count} × ${per} = ${g.angle}°. Same move for every slice.` },
        { line: `\\text{Total} = [[s:360]]^\\circ`, op: 'Check', why: `${a.join(' + ')} = 360°. Every pie adds to 360°.` },
      ],
    }
  }
}

function pieNope(round: PieRound, shot: Shot, x: number) {
  const g = round.groups[shot.slot], T = round.total, per = 360 / T, f = g.count, a = g.angle
  const fix = `360 ÷ ${T} = ${per}° per viewer, so ${f} × ${per} = ${a}°.`
  const last = shot.slot === round.groups.length - 1
  if (x === 0) return `No slice at all! There are ${f} ${g.name}. ${fix}`
  if (x === f) return `${f}° is just how many ${g.name} there are. Each viewer is worth more than 1°. ${fix}`
  if (x === Math.round((f / T) * 100) && (f * 100) % T === 0) return `That’s a percentage (× 100). A pie is 360°, not 100. ${fix}`
  if (x === per) return `${per}° is ONE viewer’s slice. There are ${f} ${g.name}. ${fix}`
  if (last) return `The angles must add to 360°. The other three make ${360 - a}°, so this one is 360 − ${360 - a} = ${a}°. Or: ${f} × ${per} = ${a}°.`
  return `${x > a ? 'Too big' : 'Too small'}: your slice is ${x}°. ${fix}`
}

/** Fake stats: a chart whose axis starts near the data. Fix the axis, then find the real % rise. */
function fakeRound(rand: Rand): FakeRound {
  const combos: [number, number, number][] = []
  for (const before of [500, 800, 1000, 1200, 2000, 2500, 4000, 5000])
    for (const percent of [2, 4, 5, 10, 20, 25])
      for (const k of [1, 2]) {
        const rise = (before * percent) / 100, start = before - k * rise
        if (rise % 20 || rise < 20 || start <= 0 || start % 100 || rise === percent) continue
        combos.push([before, percent, k])
      }
  const [before, percent, k] = rand.pick(combos)
  const rise = (before * percent) / 100, after = before + rise, fakeStart = before - k * rise, look = 100 / k
  const lookWord = k === 1 ? 'DOUBLED' : 'UP 50%'
  const wrongs: Option<string>[] = [
    { value: 'uneven', label: 'The scale went up unevenly', nope: `The gridlines went up evenly. The trick was where they started: ${num(fakeStart)}, not 0. That chops ${num(fakeStart)} off both bars.` },
    { value: 'labels', label: 'It had no labels', nope: `It did have labels: you could read ${num(fakeStart)} at the bottom. That’s the giveaway. It should say 0.` },
    { value: 'colour', label: 'The bars were too bright', nope: `Colour doesn’t change heights. The axis started at ${num(fakeStart)}, so the bottom of every bar was missing.` },
  ]
  return {
    kind: 'fake', id: 'fake',
    title: 'Round 3 · Fake stats',
    headline: `Followers ${k === 1 ? 'doubled' : 'up 50%'}? Really?`,
    why: `A bar’s height should match its number. Start the axis at ${num(fakeStart)} instead of 0 and you chop the bottom off every bar, so a small rise looks massive. The honest way: % increase = rise ÷ original × 100.`,
    before, after, rise, percent, fakeStart, look, side: {
      prompt: `So why did ${percent}% look like ${k === 1 ? 'double' : 'a 50% jump'}?`,
      answer: 'axis',
      choices: options<string>(rand, { value: 'axis', label: 'The y-axis didn’t start at 0' }, wrongs, { count: 4 }),
      why: `The axis started at ${num(fakeStart)}. Chop that off and ${num(before)} shows as ${num(before - fakeStart)}, ${num(after)} as ${num(after - fakeStart)}: ${k === 1 ? 'twice' : '1.5 times'} as tall.`,
    },
    shots: [
      {
        id: 'fake-1', prompt: `The chart says ${lookWord}. The brand says it’s sus. Fix the y-axis so the bars are honest.`,
        slot: 0, target: 0, start: fakeStart, min: 0, max: fakeStart, step: 100, jump: 500, label: 'Axis starts at', unit: 'axis',
        win: `From 0, ${num(before)} and ${num(after)} look almost the same height. Because they are.`,
      },
      {
        id: 'fake-2', prompt: `Honest numbers: ${num(before)} → ${num(after)} followers. Set the real % increase.`,
        slot: 1, target: percent, start: 0, min: 0, max: 200, step: 1, jump: 10, label: 'Increase', unit: 'pct',
        win: `Rise: ${num(after)} − ${num(before)} = ${rise}. ${rise} ÷ ${num(before)} × 100 = ${percent}%. Not ${k === 1 ? 'doubled' : '50%'}. Just ${percent}%.`,
      },
    ],
    chain: [
      { line: `\\text{rise} = [[n:${texNum(after)}]] - [[o:${texNum(before)}]]` },
      { line: `\\text{rise} = [[r:${rise}]]`, op: 'Take away', merge: { r: ['n', 'o'] }, why: `${num(after)} − ${num(before)} = ${rise} new followers.` },
      { line: `\\% = \\frac{[[r:${rise}]]}{[[b:${texNum(before)}]]} \\times 100`, op: 'Over the original', why: `% increase is the rise out of where you STARTED: ${num(before)}.` },
      { line: `\\% = [[p:${percent}]]`, op: '÷, then × 100', merge: { p: ['r', 'b'] }, why: `${rise} ÷ ${num(before)} = ${rise / before}, × 100 = ${percent}%. Real, but not viral.` },
    ],
  }
}

function fakeNope(round: FakeRound, shot: Shot, x: number) {
  const { before, after, rise, percent, look } = round
  const fix = `${rise} ÷ ${num(before)} × 100 = ${percent}%.`
  if (shot.unit === 'axis') {
    if (x === round.fakeStart) return `You didn’t move it. The axis still starts at ${num(x)}, so the bottom ${num(x)} of each bar is chopped off.`
    return `Closer, but the axis still starts at ${num(x)}. Any start above 0 chops the bottom off the bars. Honest bar charts start at 0.`
  }
  if (x === 0) return `0% would mean no change. It went from ${num(before)} to ${num(after)}. ${fix}`
  if (x === rise) return `${rise} is the rise in followers, not the percentage. Per cent means out of 100 of the original: ${fix}`
  if (x === look) return `${look}% is what the fake chart made it LOOK like. The real numbers say ${fix}`
  if (x === 100 + percent) return `That’s the new number as a % of the old one. The increase is just the extra bit: ${percent}%.`
  if ((rise * 100) % after === 0 && x === (rise * 100) / after) return `You divided by the new number. % increase is out of the ORIGINAL: ${fix}`
  return `${x > percent ? 'Too high' : 'Too low'}. % increase = rise ÷ original × 100. ${fix}`
}

/** Why a dial value was wrong, built from that play's numbers. */
export function nopeFor(round: Round, shot: Shot, x: number) {
  if (round.kind === 'bar') return barNope(round, shot, x)
  if (round.kind === 'pie') return pieNope(round, shot, x)
  return fakeNope(round, shot, x)
}

export function makeRounds(rand: Rand): Round[] {
  return [barRound(rand), pieRound(rand), fakeRound(rand)]
}
