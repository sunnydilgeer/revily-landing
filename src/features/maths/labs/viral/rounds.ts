import type { ChainStep } from '../../step-chain/StepChain'
import { options, texNum, type Option, type Rand } from '../kit/random'

/*
 * Going Viral: Tia's stats, drawn as charts for a brand pitch.
 *
 * Round 1 builds a bar chart on a scale that goes up in 20s, 50s or 100s (labelled every 2 lines),
 * so the student must work out what one line is worth. Round 2 slices a pie: 360 ÷ total degrees per
 * viewer, × each group. Round 3 fixes a fake chart whose axis starts near the data, then finds the
 * honest % increase. Round 4 is a pictogram whose key has to be worked out backwards from a row,
 * then drawn in quarter hearts. Round 5 (the boss) plots a six-week line graph and finds the biggest
 * week-to-week rise. Every answer is picked first and the data is built backwards from it.
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
  unit: 'sq' | 'deg' | 'axis' | 'pct' | 'key' | 'icon' | 'num'
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

/** A pictogram row: `icons` hearts of the key make `likes`. */
export type Row = { name: string; emoji: string; likes: number; icons: number }

export type PictRound = Base & {
  kind: 'pict'
  /** Likes per heart. */
  key: number
  rows: Row[]
  /** Rows already drawn. Row 0 is the one the key is worked out from. */
  drawn: number[]
}

export type LineRound = Base & {
  kind: 'line'
  /** Followers per gridline. Labels go up every 2 lines. */
  line: number
  /** Followers at the end of each week. */
  weeks: number[]
  /** Points already plotted. */
  drawn: number[]
  /** The biggest week-to-week rise ends on this week (index into weeks). */
  peak: number
}

export type Round = BarRound | PieRound | FakeRound | PictRound | LineRound

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

/* ---------- Round 4: the pictogram, key worked out backwards ---------- */

const QUARTER = ['', '¼', '½', '¾']
/** 2.75 → 2¾ */
export function quarters(value: number) {
  const whole = Math.floor(value), q = Math.round((value - whole) * 4)
  return q ? `${whole || ''}${QUARTER[q]}` : String(whole)
}
const texQuarters = (value: number) => {
  const whole = Math.floor(value), q = Math.round((value - whole) * 4)
  return q ? `${whole || ''}${['', '\\tfrac14', '\\tfrac12', '\\tfrac34'][q]}` : String(whole)
}
/** Names inside \text{}: & would break KaTeX. */
const texName = (name: string) => name.replace(/&/g, '\\&')

/** 4 rows of hearts. Row 0 gives the key away backwards; rows 2 and 3 are drawn by the student. */
function pictRound(rand: Rand): PictRound {
  for (;;) {
    const key = rand.pick([20, 40, 60, 80])
    const first = rand.pick([1.5, 2.5, 3.5, 4.5, 5.5])
    // 1 to 8 hearts, in quarters, all different.
    const rest = rand.shuffle(Array.from({ length: 29 }, (_, i) => (i + 4) / 4)).slice(0, 3)
    const icons = [first, ...rest]
    if (new Set(icons).size !== 4) continue
    // At least one row to draw ends on a quarter or three-quarter heart: the trickier read.
    if (!rest.slice(1).some(v => (v * 4) % 2 === 1)) continue
    const rows: Row[] = rand.shuffle(POSTS).slice(0, 4).map((p, i) => ({ ...p, likes: icons[i] * key, icons: icons[i] }))
    const r0 = rows[0], halves = first * 2

    const shots: Shot[] = [
      {
        id: 'pict-1',
        prompt: `${r0.emoji} ${r0.name} got ${r0.likes} likes. That’s ${quarters(first)} ❤️. What’s one ❤️ worth?`,
        slot: 0, target: key, start: 0, min: 0, max: 200, step: 5, jump: 20, label: 'Key', unit: 'key',
        win: `${quarters(first)} ❤️ = ${r0.likes}. That’s ${halves} half hearts, so half a ❤️ is ${key / 2} and a whole one is ${key}.`,
      },
      ...[2, 3].map((slot, k): Shot => {
        const r = rows[slot], t = r.icons, w = Math.floor(t), q = Math.round((t - w) * 4)
        return {
          id: `pict-${k + 2}`,
          prompt: k === 0 ? `Key: ❤️ = ${key} likes. ${r.emoji} ${r.name} got ${r.likes}. Draw its row.` : `Last row. ${r.emoji} ${r.name}: ${r.likes} likes.`,
          slot, target: t, start: 0, min: 0, max: 8, step: 0.25, jump: 1, label: 'Hearts', unit: 'icon',
          win: `${r.likes} ÷ ${key} = ${quarters(t)}.${q ? ` ${w} whole ❤️ make ${w * key}, and the last ${r.likes - w * key} is ${QUARTER[q]} of ${key}.` : ''}`,
        }
      }),
    ]
    // The working follows the row that ends on a quarter or three-quarter heart.
    const shown = shots.slice(1).find(s => (s.target * 4) % 2 === 1)!
    const r = rows[shown.slot], t = r.icons, w = Math.floor(t), q = Math.round((t - w) * 4)
    return {
      kind: 'pict', id: 'pict',
      title: 'Round 4 · The pictogram',
      headline: 'Lost the key? Work it backwards.',
      why: `In a pictogram every icon is worth the same: that’s the key. Here ${quarters(first)} hearts make ${r0.likes}, so ${halves} half hearts make ${r0.likes}. Find one half, double it, and you’ve got the key. Then hearts = likes ÷ key, and a part heart is a half or a quarter of it.`,
      key, rows, drawn: [0, 1], shots, side: null,
      chain: [
        { line: `[[k:${texQuarters(first)}]]\\text{ hearts} = [[l:${r0.likes}]]` },
        { line: `[[h:${halves}]]\\text{ halves} = [[l:${r0.likes}]]`, op: '× 2', merge: { h: ['k'] }, why: `${quarters(first)} hearts is ${halves} half hearts. Halves are easier to share.` },
        { line: `\\text{Half} = [[g:${key / 2}]]`, op: `÷ ${halves}`, merge: { g: ['h', 'l'] }, why: `${r0.likes} ÷ ${halves} = ${key / 2} likes in half a heart.` },
        { line: `\\text{Key} = [[c:${key}]]`, op: '× 2', merge: { c: ['g'] }, why: `Two halves make a whole: ${key / 2} × 2 = ${key} likes per ❤️.` },
        { line: `\\text{${texName(r.name)}} = \\frac{[[m:${r.likes}]]}{[[c:${key}]]}`, op: 'Likes ÷ key', why: `${r.name} got ${r.likes} likes. How many lots of ${key} is that?` },
        { line: `\\text{${texName(r.name)}} = [[i:${texQuarters(t)}]]`, op: `÷ ${key}`, merge: { i: ['m', 'c'] }, why: `${r.likes} ÷ ${key} = ${t}: ${w} whole hearts and ${QUARTER[q]} of one (${(key * q) / 4} likes).` },
      ],
    }
  }
}

function pictNope(round: PictRound, shot: Shot, x: number) {
  const key = round.key
  if (shot.unit === 'key') {
    const r = round.rows[0], n = r.icons, likes = r.likes
    const fix = `${likes} ÷ ${quarters(n)} = ${key}: ${n * 2} halves make ${likes}, so half is ${key / 2} and a whole is ${key}.`
    if (x === 0) return `A heart has to be worth something! ${fix}`
    if (x === likes) return `${likes} is the whole row: ${quarters(n)} hearts together. One heart is a share of it. ${fix}`
    if (x === likes / Math.floor(n)) return `You shared ${likes} between ${Math.floor(n)} and forgot the half heart. It’s ${quarters(n)} hearts. ${fix}`
    if (x === likes / Math.ceil(n)) return `You counted the half heart as a whole one: ${Math.ceil(n)} hearts. It’s only ${quarters(n)}. ${fix}`
    if (x === key / 2) return `${x} is HALF a heart. Double it for a whole one. ${fix}`
    return `Check it: ${x} × ${quarters(n)} = ${num(x * n)}, not ${likes}. ${fix}`
  }
  const r = round.rows[shot.slot], t = shot.target, likes = r.likes
  const fix = `${likes} ÷ ${key} = ${quarters(t)} hearts.`
  if (x === 0) return `No hearts at all! ${r.name} got ${likes} likes. ${fix}`
  if (key !== 10 && x === likes / 10) return `You counted each heart as 10. The key says ❤️ = ${key}. ${fix}`
  if (x === t * 2) return `That’s double. Each heart is ${key}, not ${key / 2}. ${fix}`
  if (x === t / 2) return `That’s half. You counted each heart as ${key * 2}, but the key is ${key}. ${fix}`
  if (Math.floor(x) === Math.floor(t) && x !== t) {
    const left = likes - Math.floor(t) * key
    return `Right whole hearts, wrong last bit. ${Math.floor(t)} hearts make ${Math.floor(t) * key}, leaving ${left}, and ${left} is ${QUARTER[Math.round((left / key) * 4)]} of ${key}. A quarter heart is ${key / 4}.`
  }
  return `Your row shows ${quarters(x)} × ${key} = ${num(x * key)} likes, not ${likes}. ${fix}`
}

/* ---------- Round 5: the line graph (the boss) ---------- */

const pair = (i: number) => `Week ${i + 1} → ${i + 2}`

/** Six weeks of followers: mostly up, one dip, one clear biggest jump. Plot two points, then find the jump. */
function lineRound(rand: Rand): LineRound {
  for (;;) {
    const line = rand.pick([200, 250, 500])
    const dip = rand.int(1, 4)
    // Week-to-week changes in half lines.
    const changes = Array.from({ length: 5 }, (_, i) => i === dip ? -rand.int(1, 3) : rand.int(1, 5))
    const most = Math.max(...changes)
    if (changes.filter(c => c === most).length > 1) continue
    const h = [rand.int(2, 6)]
    for (const c of changes) h.push(h[h.length - 1] + c)
    if (Math.max(...h) > 2 * LINES || Math.min(...h) < 1) continue
    const weeks = h.map(x => (x * line) / 2)
    const peak = changes.indexOf(most) + 1
    const plot = rand.shuffle([1, 2, 3, 4, 5]).slice(0, 2).sort((a, b) => a - b)
    // At least one point to plot sits halfway between two lines.
    if (!plot.some(i => h[i] % 2 === 1)) continue
    const rise = weeks[peak] - weeks[peak - 1], a = weeks[peak - 1], b = weeks[peak]

    const shots: Shot[] = [
      ...plot.map((slot, k): Shot => {
        const t = h[slot] / 2
        return {
          id: `line-${k + 1}`,
          prompt: k === 0 ? `Week ${slot + 1}: ${num(weeks[slot])} followers. Read the scale, then plot it.` : `Week ${slot + 1}: ${num(weeks[slot])} followers. Plot it.`,
          slot, target: t, start: 0, min: 0, max: LINES, step: 0.5, jump: 2, label: 'Point height', unit: 'sq',
          win: `One line is ${num(line)}. ${num(weeks[slot])} ÷ ${num(line)} = ${half(t)}${Number.isInteger(t) ? ' lines up' : `: ${Math.floor(t)} lines up, then halfway to the next`}.`,
        }
      }),
      {
        id: 'line-3',
        prompt: `The brand asks: what was the biggest rise from one week to the next?`,
        slot: -1, target: rise, start: 0, min: 0, max: line * LINES, step: line / 2, jump: line * 2, label: 'Biggest rise', unit: 'num',
        win: `The steepest climb is week ${peak} → ${peak + 1}: ${num(b)} − ${num(a)} = ${num(rise)} new followers.`,
      },
    ]
    const others = rand.shuffle([0, 1, 2, 3, 4].filter(i => i !== dip && i !== peak - 1))
    const side: Side = {
      prompt: `One week, followers went DOWN. Which one?`,
      answer: `w${dip}`,
      choices: options<string>(rand, { value: `w${dip}`, label: pair(dip) }, [
        { value: `w${peak - 1}`, label: pair(peak - 1), nope: `That’s the biggest RISE: ${num(a)} → ${num(b)}. A fall is where the line goes downhill.` },
        ...others.map(i => ({ value: `w${i}`, label: pair(i), nope: `That week went up: ${num(weeks[i])} → ${num(weeks[i + 1])}. Look for the bit where the line goes DOWN.` })),
      ], { count: 3 }),
      why: `${pair(dip)} is the only bit that goes downhill: ${num(weeks[dip])} → ${num(weeks[dip + 1])}, down ${num(weeks[dip] - weeks[dip + 1])}.`,
    }
    return {
      kind: 'line', id: 'line',
      title: 'Round 5 · The line graph',
      headline: 'Six weeks. Where did it pop off?',
      why: `A line graph shows how something changes over time. Find what one gridline is worth from the labels: here the labels go up ${num(line * 2)} every 2 lines. Plot each week at followers ÷ that, then join the dots in order. The steepest uphill bit is the biggest rise: new − old.`,
      line, weeks, drawn: [0, 1, 2, 3, 4, 5].filter(i => !plot.includes(i)), peak, shots, side,
      chain: [
        { line: `\\text{1 line} = \\frac{[[a:${texNum(line * 2)}]]}{[[b:2]]}` },
        { line: `\\text{1 line} = [[s:${line}]]`, op: '÷ 2', merge: { s: ['a', 'b'] }, why: `The labels jump ${num(line * 2)} every 2 lines, so each line is ${num(line)} followers.` },
        { line: `\\text{Wk ${peak + 1}} = [[h:${h[peak] / 2}]] \\times [[s:${line}]]`, op: 'Read the top', why: `The steepest bit of the line ends at week ${peak + 1}, ${half(h[peak] / 2)} lines up.` },
        { line: `\\text{Wk ${peak + 1}} = [[v:${texNum(b)}]]`, op: 'Multiply', merge: { v: ['h', 's'] }, why: `${h[peak] / 2} × ${num(line)} = ${num(b)} followers.` },
        { line: `\\text{Rise} = [[v:${texNum(b)}]] - [[u:${texNum(a)}]]`, op: 'Take the week before', why: `Week ${peak} was ${num(a)}. A rise is new − old.` },
        { line: `\\text{Rise} = [[r:${texNum(rise)}]]`, op: 'Take away', merge: { r: ['v', 'u'] }, why: `${num(b)} − ${num(a)} = ${num(rise)} new followers in one week. That’s where Tia blew up.` },
      ],
    }
  }
}

function lineNope(round: LineRound, shot: Shot, x: number) {
  const { weeks, peak, line } = round
  if (shot.unit === 'sq') {
    const v = weeks[shot.slot], t = shot.target
    const fix = `${num(v)} ÷ ${num(line)} = ${sqText(t)}.`
    if (x === 0) return `No point plotted! Week ${shot.slot + 1} had ${num(v)} followers. ${fix}`
    if (x === t / 2) return `You counted each line as ${num(line * 2)}. The labels go up ${num(line * 2)} every 2 lines, so one line is only ${num(line)}. ${fix}`
    if (x === t * 2) return `That’s double. One line is ${num(line)}, not ${num(line / 2)}. ${fix}`
    if (Math.abs(x - t) === 1) return `One line ${x > t ? 'too high' : 'too low'}. Your point reads ${num(x * line)}, not ${num(v)}. ${fix}`
    if (Math.abs(x - t) === 0.5) return `Half a line out. Half a line is ${num(line / 2)} followers. ${fix}`
    return `Your point reads ${num(x * line)}, not ${num(v)}. One line is ${num(line)}, so ${fix}`
  }
  const a = weeks[peak - 1], b = weeks[peak], rise = b - a
  const fix = `Steepest climb: week ${peak} → ${peak + 1}, ${num(b)} − ${num(a)} = ${num(rise)}.`
  const ups = weeks.slice(1).map((w, i) => w - weeks[i])
  if (x === 0) return `0 means no rise at all. The line climbs a lot. ${fix}`
  if (x === b) return `${num(b)} is how many followers in week ${peak + 1}, not the rise. A rise is new − old. ${fix}`
  if (x === a) return `${num(a)} is week ${peak}’s followers, not the rise. A rise is new − old. ${fix}`
  const other = ups.findIndex((u, i) => u === x && i !== peak - 1)
  if (other >= 0) return `That’s the rise from week ${other + 1} to ${other + 2}. Real, but not the biggest. ${fix}`
  const fell = ups.findIndex(u => -u === x)
  if (fell >= 0) return `That’s how much it FELL from week ${fell + 1} to ${fell + 2}. The brand wants the biggest rise. ${fix}`
  if (x === weeks[5] - weeks[0]) return `That’s the rise over all six weeks. The brand asked about ONE week to the next. ${fix}`
  return `${x > rise ? 'Too big' : 'Too small'}. ${fix}`
}

/** Why a dial value was wrong, built from that play's numbers. */
export function nopeFor(round: Round, shot: Shot, x: number) {
  if (round.kind === 'bar') return barNope(round, shot, x)
  if (round.kind === 'pie') return pieNope(round, shot, x)
  if (round.kind === 'pict') return pictNope(round, shot, x)
  if (round.kind === 'line') return lineNope(round, shot, x)
  return fakeNope(round, shot, x)
}

export function makeRounds(rand: Rand): Round[] {
  return [barRound(rand), pieRound(rand), fakeRound(rand), pictRound(rand), lineRound(rand)]
}
