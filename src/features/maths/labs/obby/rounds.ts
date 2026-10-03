import type { ChainStep } from '../../step-chain/StepChain'
import { options, texNum, type Option, type Rand } from '../kit/random'

/*
 * Obby Split: frequency trees. Players start an obstacle course, pick one of two paths, then
 * either clear the jump or fall. Every tree is built answer-first: the total, then the branch, then
 * the ends, all multiples of 5 so the dials move in 5s and every fraction of a branch is whole.
 */

export type NodeId = 'start' | 'a' | 'b' | 'ac' | 'af' | 'bc' | 'bf' | 'total'
export type Path = { name: string; emoji: string }

export type TreeNode = {
  id: NodeId
  /** In words, for prompts and button names: "Lava path", "Lava · clear". */
  label: string
  /** The box caption in the tree. */
  tag: string
  value: number
  /** Shown from the start. Otherwise the student sets it with the dial. */
  given: boolean
  /** The question while this box is selected. */
  ask?: string
  /** Why the right number is right. */
  win?: string
  /** What went wrong, from the value they set. */
  nope?: (value: number) => string
}

export type Side = { prompt: string; answer: string; choices: Option<string>[]; why: string; /** The end of the tree the answer is about, lit up when they get it. */ end: NodeId }

export type Round = {
  id: string
  title: string
  headline: string
  why: string
  start: number
  paths: [Path, Path]
  nodes: Partial<Record<NodeId, TreeNode>> & Record<Exclude<NodeId, 'total'>, TreeNode>
  /** The boxes to fill, in the order Blox suggests them. */
  order: NodeId[]
  /** The facts Blox gives, as short lines. */
  clues: string[]
  /** A short label on the branch leading into a box, like "3/4". */
  edges: Partial<Record<NodeId, string>>
  side: Side | null
  chain: ChainStep[]
}

/** Every dial in this game: 0 up to the start number, in 5s. */
export const DIAL_STEP = 5

const PATHS: Path[] = [
  { name: 'Lava', emoji: '🌋' }, { name: 'Ice', emoji: '🧊' }, { name: 'Spin', emoji: '🌀' },
  { name: 'Slime', emoji: '🟢' }, { name: 'Laser', emoji: '🔴' }, { name: 'Tower', emoji: '🗼' },
  { name: 'Rocket', emoji: '🚀' }, { name: 'Rope', emoji: '🪢' }, { name: 'Bounce', emoji: '🏀' }, { name: 'Cloud', emoji: '☁️' },
]
const STARTS = [100, 120, 200, 240]
const FRACTIONS: [number, number][] = [[3, 4], [2, 5], [3, 5], [4, 5], [3, 10], [7, 10], [2, 3]]

const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y)
const fr = ([p, q]: [number, number]) => `${p}/${q}`

/** Two different paths for a round, not used in an earlier round. */
function pickPaths(rand: Rand, used: Set<string>): [Path, Path] {
  const pool = rand.shuffle(PATHS.filter(p => !used.has(p.name)))
  const pair: [Path, Path] = [pool[0], pool[1]]
  pair.forEach(p => used.add(p.name))
  return pair
}

/** The seven boxes of a tree, with every box given until a round says otherwise. */
function baseNodes(paths: [Path, Path], v: Record<Exclude<NodeId, 'total'>, number>): Round['nodes'] {
  const [A, B] = paths
  const node = (id: NodeId, label: string, tag: string): TreeNode => ({ id, label, tag, value: v[id as Exclude<NodeId, 'total'>], given: true })
  return {
    start: node('start', 'Start', '🏁 Start'),
    a: node('a', `${A.name} path`, `${A.emoji} ${A.name}`),
    b: node('b', `${B.name} path`, `${B.emoji} ${B.name}`),
    ac: node('ac', `${A.name} · clear`, '✅ Clear'),
    af: node('af', `${A.name} · fall`, '💥 Fall'),
    bc: node('bc', `${B.name} · clear`, '✅ Clear'),
    bf: node('bf', `${B.name} · fall`, '💥 Fall'),
  }
}

/** Generic fallback when a value matches no known slip. */
function offBy(value: number, answer: number, max: number, who: string) {
  if (value > max) return `${value} can’t be right: there are only ${max} ${who}.`
  return `Not ${value}: that’s ${Math.abs(value - answer)} too ${value > answer ? 'many' : 'few'}.`
}

/** A box that is "what’s left": parent − sibling. */
function rest(node: TreeNode, o: { parent: number; parentName: string; sibling: number; siblingName: string; total: number; ask: string; win: string }): TreeNode {
  const answer = o.parent - o.sibling
  const fix = `${o.parent} − ${o.sibling} = ${answer}.`
  return {
    ...node, given: false, ask: o.ask, win: o.win,
    nope: value => {
      if (value === o.parent) return `Forgot to subtract: ${o.parent} is ALL the ${o.parentName}. ${o.sibling} of them are ${o.siblingName}, so take them away. ${fix}`
      if (value === o.sibling) return `That’s the ${o.siblingName} copied across. This box is the rest of the ${o.parentName}. ${fix}`
      if (value === o.parent + o.sibling) return `You added. The branches split the ${o.parentName} up, so the two boxes must add up to ${o.parent}. ${fix}`
      if (o.total !== o.parent && value === o.total - o.sibling) return `You used the total, ${o.total}, instead of the branch. Only the ${o.parentName} (${o.parent}) can end up here. ${fix}`
      return `${offBy(value, answer, o.parent, o.parentName)} The two boxes under ${o.parent} must add up to ${o.parent}: ${o.sibling} + ${value} = ${o.sibling + value}. ${fix}`
    },
  }
}

/** A box that is a fraction of its branch: parent ÷ q × p. */
function part(node: TreeNode, o: { parent: number; parentName: string; who: string; f: [number, number]; total: number; ask: string }): TreeNode {
  const [p, q] = o.f, unit = o.parent / q, answer = unit * p
  const fix = `${o.parent} ÷ ${q} = ${unit}, then × ${p} = ${answer}.`
  return {
    ...node, given: false, ask: o.ask,
    win: `${fr(o.f)} of ${o.parent}: ${o.parent} ÷ ${q} = ${unit}, × ${p} = ${answer}. That fraction was of the ${o.parentName}, not everyone.`,
    nope: value => {
      if (value === o.total * p / q) return `That’s ${fr(o.f)} of all ${o.total} players. The ${fr(o.f)} is only of the ${o.parentName}, the branch above this box. ${fix}`
      if (value === unit) return `That’s 1/${q} of them. You need ${p} lots of that. ${fix}`
      if (value === o.parent - answer) return `That’s the ones who FELL. ${fr(o.f)} is the ones who clear. ${fix}`
      if (value === o.parent * q / p) return `You did it upside down: ÷ ${p} × ${q}. Divide by the bottom, times by the top. ${fix}`
      return `${offBy(value, answer, o.parent, o.who)} ${fr(o.f)} of ${o.parent}: divide by the bottom, times by the top. ${fix}`
    },
  }
}

/** A box that is the sum of the two below it. */
function sum(node: TreeNode, o: { x: number; y: number; name: string; total: number; ask: string; win: string }): TreeNode {
  const answer = o.x + o.y
  const fix = `${o.x} + ${o.y} = ${answer}.`
  return {
    ...node, given: false, ask: o.ask, win: o.win,
    nope: value => {
      if (value === Math.abs(o.x - o.y)) return `You took away. Both ends came down from the ${o.name}, so add them back up. ${fix}`
      if (value === o.x || value === o.y) return `That’s only one end. Every ${o.name} player either clears or falls, so add both. ${fix}`
      if (value === o.total) return `That’s everyone. Only some players took the ${o.name}. ${fix}`
      return `${offBy(value, answer, o.total, 'players in total')} The two ends under this box add up to it. ${fix}`
    },
  }
}

function frequencyTree(rand: Rand, withFraction: boolean, starts: number[] = STARTS) {
  for (;;) {
    const S = rand.pick(starts), f = rand.pick(FRACTIONS)
    const a = rand.int(Math.ceil(S * .3 / 10) * 10, Math.floor(S * .7 / 10) * 10, 10), b = S - a
    if (a === b) continue
    let ac: number
    if (withFraction) {
      if (a % f[1] !== 0 || (a / f[1] * f[0]) % 5 !== 0) continue
      ac = a / f[1] * f[0]
    } else ac = rand.int(10, a - 10, 5)
    const bc = rand.int(Math.ceil(b * .3 / 5) * 5, Math.floor(b * .8 / 5) * 5, 5)
    const af = a - ac, bf = b - bc
    const ends = [ac, af, bc, bf]
    if (ends.some(e => e <= 0) || new Set(ends).size < 4 || ends.some(e => e === a || e === b)) continue
    return { S, a, b, ac, af, bc, bf, f }
  }
}

const people = (n: number) => `${n} player${n === 1 ? '' : 's'}`

/** Round 1: fill the tree from the top. */
function fillRound(rand: Rand, used: Set<string>): Round {
  const paths = pickPaths(rand, used), [A, B] = paths
  const t = frequencyTree(rand, true), { S, a, b, ac, af, bc, bf, f } = t
  const [p, q] = f
  const v = { start: S, a, b, ac, af, bc, bf }
  const nodes = baseNodes(paths, v)
  nodes.b = rest(nodes.b, { parent: S, parentName: 'players', sibling: a, siblingName: `${A.name} players`, total: S,
    ask: `How many took the ${B.name} path?`, win: `${S} − ${a} = ${b}. Everyone picks one path or the other, so the ${B.name} path gets the rest.` })
  nodes.ac = part(nodes.ac, { parent: a, parentName: `${a} ${A.name} players`, who: `${A.name} players`, f, total: S, ask: `${fr(f)} of the ${A.name} players clear. How many is that?` })
  nodes.af = rest(nodes.af, { parent: a, parentName: `${A.name} players`, sibling: ac, siblingName: 'clearers', total: S,
    ask: `How many ${A.name} players fall?`, win: `${a} − ${ac} = ${af}. The ${A.name} players who didn’t clear, fell.` })
  nodes.bf = rest(nodes.bf, { parent: b, parentName: `${B.name} players`, sibling: bc, siblingName: 'clearers', total: S,
    ask: `How many ${B.name} players fall?`, win: `${b} − ${bc} = ${bf}. Out of ${b} on the ${B.name} path, ${bc} cleared, so the rest fell.` })
  return {
    id: 'fill', title: 'Round 1 · Fill the tree', headline: 'Split the players down the branches',
    why: `A frequency tree splits one group into smaller ones. The two boxes under any box always add up to it. And a fraction on a branch is a fraction of the box it comes FROM, not of everyone.`,
    start: S, paths, nodes, order: ['b', 'ac', 'af', 'bf'],
    clues: [`${S} players start.`, `${a} take the ${A.name} path. The rest take ${B.name}.`, `${fr(f)} of the ${A.name} players clear.`, `${bc} ${B.name} players clear.`],
    edges: { ac: fr(f) },
    side: null,
    chain: [
      { line: `\\tfrac{[[p:${p}]]}{[[q:${q}]]} \\text{ of } [[a:${a}]]` },
      { line: `[[a:${a}]] \\div [[q:${q}]] = [[u:${a / q}]]`, op: `÷ ${q}`, why: `Split the ${a} ${A.name} players into ${q} equal groups: ${a / q} in each.` },
      { line: `[[u:${a / q}]] \\times [[p:${p}]] = [[c:${ac}]]`, op: `× ${p}`, why: `${p} of those groups clear the jump: ${ac} players.` },
      { line: `[[a:${a}]] - [[c:${ac}]] = [[f:${af}]]`, op: 'The rest fall', why: `${a} went ${A.name} and ${ac} cleared, so ${af} fell.` },
      { line: `[[s:${texNum(S)}]] - [[a:${a}]] = [[b:${b}]]`, op: `${B.name} path`, why: `Everyone takes one path or the other: ${S} − ${a} = ${b}.` },
      { line: `[[b:${b}]] - [[k:${bc}]] = [[g:${bf}]]`, op: `${B.name} falls`, why: `${bc} of the ${b} ${B.name} players cleared, so ${bf} fell.` },
      { line: `${ac} + ${af} + ${bc} + ${bf} = ${texNum(S)}`, op: 'Check', why: `The four ends add back up to the ${S} at the start. Nobody vanished.` },
    ],
  }
}

/** Round 2: some ends are given, work back up the tree. */
function backRound(rand: Rand, used: Set<string>): Round {
  const paths = pickPaths(rand, used)
  const t = frequencyTree(rand, false)
  const v = { start: t.S, a: t.a, b: t.b, ac: t.ac, af: t.af, bc: t.bc, bf: t.bf }
  const nodes = baseNodes(paths, v)
  // One side has both ends given; the other has only its clears.
  const lavaFull = rand.chance(.5)
  const X = lavaFull ? paths[0] : paths[1], Y = lavaFull ? paths[1] : paths[0]
  const [x, xc, xf, y, yc, yf] = lavaFull ? [t.a, t.ac, t.af, t.b, t.bc, t.bf] : [t.b, t.bc, t.bf, t.a, t.ac, t.af]
  const [xi, yi, yfi]: NodeId[] = lavaFull ? ['a', 'b', 'bf'] : ['b', 'a', 'af']
  const S = t.S
  nodes[xi] = sum(nodes[xi], { x: xc, y: xf, name: `${X.name} path`, total: S,
    ask: `How many took the ${X.name} path?`, win: `${xc} + ${xf} = ${x}. Everyone on the ${X.name} path ends in one of those two boxes.` }) as TreeNode
  nodes[yi] = rest(nodes[yi], { parent: S, parentName: 'players', sibling: x, siblingName: `${X.name} players`, total: S,
    ask: `How many took the ${Y.name} path?`, win: `${S} − ${x} = ${y}. Whoever didn’t go ${X.name} went ${Y.name}.` }) as TreeNode
  nodes[yfi] = rest(nodes[yfi], { parent: y, parentName: `${Y.name} players`, sibling: yc, siblingName: 'clearers', total: S,
    ask: `How many ${Y.name} players fall?`, win: `${y} − ${yc} = ${yf}. Take the clearers off the ${Y.name} branch, not off the total.` }) as TreeNode
  // Fallback slip for "used a leaf instead of the branch" on the Y path box.
  const yNope = nodes[yi].nope!
  nodes[yi].nope = value => value === S - xc
    ? `You took off ${xc}, just the ${X.name} clearers. The ${X.name} fallers took that path too: take off all ${x}. ${S} − ${x} = ${y}.`
    : yNope(value)
  const XL = X.name, YL = Y.name
  return {
    id: 'back', title: 'Round 2 · Work backwards', headline: 'Start from the ends',
    why: `Boxes add up going UP the tree too. Two ends together make the branch above them. And if you know the total and one branch, the other branch is total − that branch.`,
    start: S, paths, nodes, order: [xi, yi, yfi],
    clues: [`${S} players start.`, `On ${XL}: ${xc} clear and ${xf} fall.`, `On ${YL}: ${yc} clear.`],
    edges: {},
    side: null,
    chain: [
      { line: `\\text{${XL}} = [[c:${xc}]] + [[f:${xf}]]` },
      { line: `\\text{${XL}} = [[x:${x}]]`, op: 'Add the ends', merge: { x: ['c', 'f'] }, why: `${xc} cleared and ${xf} fell: that’s all ${x} on the ${XL} path.` },
      { line: `[[s:${texNum(S)}]] - [[x:${x}]] = [[y:${y}]]`, op: 'Total − branch', why: `${S} started and ${x} went ${XL}, so ${y} went ${YL}.` },
      { line: `[[y:${y}]] - [[k:${yc}]] = [[g:${yf}]]`, op: `${YL} falls`, why: `Of the ${y} on ${YL}, ${yc} cleared. Take them off the branch, not the total.` },
      { line: `[[x:${x}]] + [[y:${y}]] = [[s:${texNum(S)}]]`, op: 'Check', why: `The two paths add back up to the ${S} who started.` },
    ],
  }
}

/** Round 3: complete the tree, count every clear, then the odds of one end. */
function oddsRound(rand: Rand, used: Set<string>): Round {
  const paths = pickPaths(rand, used), [A, B] = paths
  const t = frequencyTree(rand, true), { S, a, b, ac, af, bc, bf, f } = t
  const [p, q] = f
  const total = ac + bc
  const nodes = baseNodes(paths, { start: S, a, b, ac, af, bc, bf })
  nodes.ac = part(nodes.ac, { parent: a, parentName: `${a} ${A.name} players`, who: `${A.name} players`, f, total: S, ask: `${fr(f)} of the ${A.name} players clear. How many?` })
  nodes.af = rest(nodes.af, { parent: a, parentName: `${A.name} players`, sibling: ac, siblingName: 'clearers', total: S,
    ask: `How many ${A.name} players fall?`, win: `${a} − ${ac} = ${af}.` })
  nodes.bc = rest(nodes.bc, { parent: b, parentName: `${B.name} players`, sibling: bf, siblingName: 'fallers', total: S,
    ask: `How many ${B.name} players clear?`, win: `${b} − ${bf} = ${bc}. The ${B.name} players who didn’t fall, cleared.` })
  nodes.total = {
    id: 'total', label: 'Cleared overall', tag: '⭐ All clears', value: total, given: false,
    ask: `How many players cleared the jump overall?`,
    win: `${ac} + ${bc} = ${total}. Clears from both paths.`,
    nope: value => {
      const fix = `${ac} + ${bc} = ${total}.`
      if (value === ac || value === bc) return `That’s only one path’s clears. Players cleared on ${A.name} AND on ${B.name}: add both. ${fix}`
      if (value === af + bf) return `That’s everyone who FELL. Add the two clear boxes. ${fix}`
      if (value === S) return `That’s everyone who started, fallers too. ${fix}`
      if (value === a || value === b) return `That’s a whole path, clears and falls. Just the clear boxes. ${fix}`
      return `${offBy(value, total, S, 'players in total')} Add the two ✅ boxes. ${fix}`
    },
  }

  // The side question: one end, out of everyone.
  const onA = rand.chance(.5)
  const X = onA ? A : B, xc = onA ? ac : bc, xf = onA ? af : bf, x = onA ? a : b
  const g = gcd(xc, S), simple = g > 1 ? ` = ${xc / g}/${S / g}` : ''
  const label = (top: number, bottom: number) => `${top}/${bottom}`
  const choices = options<string>(rand, { value: label(xc, S), label: label(xc, S) }, [
    { value: label(xc, x), label: label(xc, x), nope: `${xc}/${x} is out of the ${X.name} players only. Blox picks from ALL ${S} players, so the bottom is ${S}.` },
    { value: label(xc, total), label: label(xc, total), nope: `${xc}/${total} is out of the players who cleared. The pick is from all ${S} who started, so the bottom is ${S}.` },
    { value: label(total, S), label: label(total, S), nope: `${total}/${S} is anyone who cleared, on either path. You only want the ${X.name} clears: ${xc}.` },
    { value: label(xc, xf), label: label(xc, xf), nope: `${xc}/${xf} compares clears with falls. A probability is out of everyone: ${xc}/${S}.` },
  ])
  const chain: ChainStep[] = [
    { line: `\\tfrac{[[p:${p}]]}{[[q:${q}]]} \\text{ of } [[a:${a}]]` },
    { line: `[[a:${a}]] \\div [[q:${q}]] = [[u:${a / q}]]`, op: `÷ ${q}`, why: `${a} ${A.name} players in ${q} equal groups: ${a / q} each.` },
    { line: `[[u:${a / q}]] \\times [[p:${p}]] = [[c:${ac}]]`, op: `× ${p}`, why: `${p} groups clear: ${ac}.` },
    { line: `[[a:${a}]] - [[c:${ac}]] = [[f:${af}]]`, op: 'The rest fall', why: `${a} − ${ac} = ${af} ${A.name} players fell.` },
    { line: `[[b:${b}]] - [[h:${bf}]] = [[k:${bc}]]`, op: `${B.name} clears`, why: `${b} on ${B.name}, ${bf} fell, so ${bc} cleared.` },
    { line: `[[c:${ac}]] + [[k:${bc}]] = [[t:${total}]]`, op: 'All clears', why: `Add the clears from both paths.` },
    { line: `P = \\frac{[[n:${xc}]]}{[[s:${texNum(S)}]]}`, op: 'Out of everyone', why: `${xc} players took ${X.name} and cleared, out of all ${S} who started.` },
  ]
  if (g > 1) chain.push({ line: `P = \\frac{[[r:${xc / g}]]}{[[d:${S / g}]]}`, op: `÷ ${g} top and bottom`, merge: { r: ['n'], d: ['s'] }, why: `Simplifying is optional in the exam, but ${xc}/${S} = ${xc / g}/${S / g}.` })
  return {
    id: 'odds', title: 'Round 3 · Odds of clearing', headline: 'Finish the tree, then find the odds',
    why: `Once the tree is full, probability is easy: the number at that end ÷ everyone at the start. The bottom of the fraction is the TOTAL, not the branch.`,
    start: S, paths, nodes, order: ['ac', 'af', 'bc', 'total'],
    clues: [`${S} players start: ${a} ${A.name}, ${b} ${B.name}.`, `${fr(f)} of the ${A.name} players clear.`, `${bf} ${B.name} players fall.`],
    edges: { ac: fr(f) },
    side: {
      prompt: `Blox picks one of the ${S} players at random. What’s the probability they took ${X.name} AND cleared?`,
      answer: label(xc, S), choices,
      why: `${xc} players took ${X.name} and cleared, out of ${S} altogether. P = ${xc}/${S}${simple}.`,
      end: onA ? 'ac' : 'bc',
    },
    chain,
  }
}

export function makeRounds(rand: Rand): Round[] {
  const used = new Set<string>()
  return [fillRound(rand, used), backRound(rand, used), oddsRound(rand, used), reverseRound(rand, used), bossRound(rand, used)]
}

/** A branch worked out backwards from a fraction of it: part ÷ top × bottom. */
function whole(node: TreeNode, o: { part: number; partName: string; f: [number, number]; total: number; ask: string; win: string }): TreeNode {
  const [p, q] = o.f, unit = o.part / p, answer = unit * q
  const fix = `${o.part} ÷ ${p} = ${unit}, then × ${q} = ${answer}.`
  return {
    ...node, given: false, ask: o.ask, win: o.win,
    nope: value => {
      if (value === o.part) return `That’s just the ${o.partName}. They’re only ${fr(o.f)} of this branch, so the branch is bigger. ${fix}`
      if (value * q === o.part * p) return `You took ${fr(o.f)} OF the ${o.partName}. Go the other way: the ${o.part} is ${fr(o.f)} of the box you want. ${fix}`
      if (value === unit) return `That’s 1/${q} of the branch. There are ${q} of those in the whole branch. ${fix}`
      if (value === o.part * q) return `You did × ${q} but forgot ÷ ${p} first. ${o.part} is ${p} parts, not 1. ${fix}`
      if (value === o.total - o.part) return `You took ${o.part} off the total. The ${o.part} is a fraction of one branch, not a slice of everyone. ${fix}`
      return `${offBy(value, answer, o.total, 'players in total')} ${o.part} is ${p} parts out of ${q}: find one part, then times by ${q}. ${fix}`
    },
  }
}

/** Round 4: the fraction is given with its answer. Work the branch out backwards. */
function reverseRound(rand: Rand, used: Set<string>): Round {
  const paths = pickPaths(rand, used), [A, B] = paths
  const t = frequencyTree(rand, true, [240, 300, 360, 400]), { S, a, b, ac, af, bc, bf, f } = t
  const [p, q] = f, unit = ac / p
  const nodes = baseNodes(paths, { start: S, a, b, ac, af, bc, bf })
  nodes.a = whole(nodes.a, { part: ac, partName: `${A.name} clearers`, f, total: S,
    ask: `${ac} players are ${fr(f)} of the ${A.name} path. How many took ${A.name}?`,
    win: `${ac} ÷ ${p} = ${unit}, × ${q} = ${a}. ${fr(f)} of ${a} is ${ac}: checks out.` })
  nodes.af = rest(nodes.af, { parent: a, parentName: `${A.name} players`, sibling: ac, siblingName: 'clearers', total: S,
    ask: `How many ${A.name} players fall?`, win: `${a} − ${ac} = ${af}.` })
  nodes.b = rest(nodes.b, { parent: S, parentName: 'players', sibling: a, siblingName: `${A.name} players`, total: S,
    ask: `How many took the ${B.name} path?`, win: `${S} − ${a} = ${b}. Everyone else went ${B.name}.` })
  nodes.bf = rest(nodes.bf, { parent: b, parentName: `${B.name} players`, sibling: bc, siblingName: 'clearers', total: S,
    ask: `How many ${B.name} players fall?`, win: `${b} − ${bc} = ${bf}.` })
  // "Took ac off the total" on the B path box: the clearers aren't the whole branch.
  const bNope = nodes.b.nope!
  nodes.b.nope = value => value === S - ac
    ? `You took off ${ac}, just the ${A.name} clearers. The ${A.name} fallers took that path too: take off all ${a}. ${S} − ${a} = ${b}.`
    : bNope(value)
  return {
    id: 'reverse', title: 'Round 4 · Reverse the fraction', headline: 'You know the part. Find the whole branch.',
    why: `This time you know how many cleared AND what fraction that is. If ${fr(f)} of a branch is ${ac}, then 1/${q} is ${ac} ÷ ${p}. Times that by ${q} to get the whole branch. Then the boxes add up like always.`,
    start: S, paths, nodes, order: ['a', 'af', 'b', 'bf'],
    clues: [`${S} players start.`, `${fr(f)} of the ${A.name} players clear: that’s ${ac} players.`, `${bc} ${B.name} players clear.`],
    edges: { ac: fr(f) },
    side: null,
    chain: [
      { line: `\\tfrac{[[p:${p}]]}{[[q:${q}]]} \\text{ of } x = [[c:${ac}]]` },
      { line: `\\tfrac{1}{[[q:${q}]]} \\text{ of } x = [[u:${unit}]]`, op: `÷ ${p}`, merge: { u: ['c', 'p'] }, why: `${p} parts make ${ac}, so one part is ${ac} ÷ ${p} = ${unit}.` },
      { line: `x = [[u:${unit}]] \\times [[q:${q}]]`, op: `× ${q}`, why: `The whole ${A.name} branch is ${q} parts.` },
      { line: `x = [[a:${a}]]`, op: 'Work it out', merge: { a: ['u', 'q'] }, why: `${unit} × ${q} = ${a} players took ${A.name}.` },
      { line: `[[a:${a}]] - [[c:${ac}]] = [[f:${af}]]`, op: 'The rest fall', why: `${a} went ${A.name}, ${ac} cleared, so ${af} fell.` },
      { line: `[[s:${texNum(S)}]] - [[a:${a}]] = [[b:${b}]]`, op: `${B.name} path`, why: `Everyone else went ${B.name}: ${S} − ${a} = ${b}.` },
      { line: `[[b:${b}]] - [[k:${bc}]] = [[g:${bf}]]`, op: `${B.name} falls`, why: `${bc} of the ${b} cleared, so ${bf} fell.` },
    ],
  }
}

/** Round 5, the boss: an exam-style tree with a percentage and a fraction, then odds out of one branch. */
function bossRound(rand: Rand, used: Set<string>): Round {
  const paths = pickPaths(rand, used), [A, B] = paths
  let S = 0, pc = 0, a = 0, f: [number, number] = [1, 2], ac = 0, bf = 0
  for (;;) {
    S = rand.pick([200, 240, 300, 400]); pc = rand.pick([20, 30, 40, 60, 70]); f = rand.pick(FRACTIONS)
    a = S * pc / 100
    if (a % 5 !== 0 || a % f[1] !== 0 || (a / f[1] * f[0]) % 5 !== 0) continue
    ac = a / f[1] * f[0]
    const b0 = S - a
    bf = rand.int(Math.ceil(b0 * .2 / 5) * 5, Math.floor(b0 * .6 / 5) * 5, 5)
    const ends = [ac, a - ac, b0 - bf, bf]
    if (ends.some(e => e <= 0) || new Set(ends).size < 4 || ends.some(e => e === a || e === b0)) continue
    break
  }
  const b = S - a, af = a - ac, bc = b - bf, [p, q] = f, ten = S / 10, unit = a / q
  const nodes = baseNodes(paths, { start: S, a, b, ac, af, bc, bf })
  const fixA = `10% of ${S} is ${ten}, so ${pc}% is ${ten} × ${pc / 10} = ${a}.`
  nodes.a = {
    ...nodes.a, given: false, ask: `${pc}% of the ${S} players take ${A.name}. How many is that?`,
    win: `${fixA} Percent means out of 100.`,
    nope: value => {
      if (value === pc) return `${pc} is the percentage, not the players. ${pc}% means ${pc} out of every 100. ${fixA}`
      if (value === b) return `That’s the other ${100 - pc}%, the ${B.name} path. ${fixA}`
      if (value === ten) return `That’s just 10%. You need ${pc / 10} lots of it. ${fixA}`
      if (value === S * pc / 1000 || value === S * pc / 10) return `Decimal point slip. ${pc}% of ${S} is ${pc} ÷ 100 × ${S}. ${fixA}`
      return `${offBy(value, a, S, 'players')} ${fixA}`
    },
  }
  nodes.b = rest(nodes.b, { parent: S, parentName: 'players', sibling: a, siblingName: `${A.name} players`, total: S,
    ask: `How many take the ${B.name} path?`, win: `${S} − ${a} = ${b}. That’s the other ${100 - pc}%.` })
  nodes.ac = part(nodes.ac, { parent: a, parentName: `${a} ${A.name} players`, who: `${A.name} players`, f, total: S, ask: `${fr(f)} of the ${A.name} players clear. How many?` })
  nodes.af = rest(nodes.af, { parent: a, parentName: `${A.name} players`, sibling: ac, siblingName: 'clearers', total: S,
    ask: `How many ${A.name} players fall?`, win: `${a} − ${ac} = ${af}.` })
  nodes.bc = rest(nodes.bc, { parent: b, parentName: `${B.name} players`, sibling: bf, siblingName: 'fallers', total: S,
    ask: `How many ${B.name} players clear?`, win: `${b} − ${bf} = ${bc}.` })

  // The side question: picked from ONE branch this time, so the bottom is that branch.
  const g = gcd(bf, b), simple = g > 1 ? ` = ${bf / g}/${b / g}` : ''
  const label = (top: number, bottom: number) => `${top}/${bottom}`
  const choices = options<string>(rand, { value: label(bf, b), label: label(bf, b) }, [
    { value: label(bf, S), label: label(bf, S), nope: `${bf}/${S} is out of ALL the players. Blox only picks from the ${b} on ${B.name}, so the bottom is ${b}.` },
    { value: label(bc, b), label: label(bc, b), nope: `${bc}/${b} is the ${B.name} players who CLEARED. You want the fallers: ${bf}.` },
    { value: label(bf, bc), label: label(bf, bc), nope: `${bf}/${bc} compares falls with clears. Out of all ${b} ${B.name} players: ${bf}/${b}.` },
    { value: label(af + bf, S), label: label(af + bf, S), nope: `${af + bf}/${S} is everyone who fell, on either path. Only the ${B.name} players count here.` },
  ])
  const chain: ChainStep[] = [
    { line: `[[p:${pc}\\%]] \\text{ of } [[s:${texNum(S)}]]` },
    { line: `[[t:10\\%]] = [[u:${ten}]]`, op: '÷ 10', merge: { u: ['s'] }, why: `10% is a tenth: ${S} ÷ 10 = ${ten}.` },
    { line: `[[p:${pc}\\%]] = [[a:${a}]]`, op: `× ${pc / 10}`, merge: { a: ['u'] }, why: `${pc}% is ${pc / 10} lots of 10%: ${ten} × ${pc / 10} = ${a} took ${A.name}.` },
    { line: `[[a:${a}]] \\div [[q:${q}]] \\times [[k:${p}]] = [[c:${ac}]]`, op: `${fr(f)} of ${a}`, why: `${a} ÷ ${q} = ${unit}, × ${p} = ${ac} ${A.name} players cleared.` },
    { line: `[[s:${texNum(S)}]] - [[a:${a}]] = [[b:${b}]]`, op: `${B.name} path`, why: `Everyone else went ${B.name}: ${S} − ${a} = ${b}.` },
    { line: `P = \\frac{[[n:${bf}]]}{[[b:${b}]]}`, op: `Out of ${B.name}`, why: `${bf} of the ${b} ${B.name} players fell. Blox picks from ${B.name} only, so the bottom is ${b}.` },
  ]
  if (g > 1) chain.push({ line: `P = \\frac{[[r:${bf / g}]]}{[[d:${b / g}]]}`, op: `÷ ${g} top and bottom`, merge: { r: ['n'], d: ['b'] }, why: `Simplifying is optional in the exam, but ${bf}/${b} = ${bf / g}/${b / g}.` })
  return {
    id: 'boss', title: 'Round 5 · The final obby', headline: 'The exam-style tree: percent, fraction, then the odds',
    why: `The first split is a percentage of everyone. The second is a fraction of the branch above it. When Blox picks from ONE path, the bottom of the probability is that path, not the total.`,
    start: S, paths, nodes, order: ['a', 'b', 'ac', 'af', 'bc'],
    clues: [`${S} players start.`, `${pc}% take the ${A.name} path. The rest take ${B.name}.`, `${fr(f)} of the ${A.name} players clear.`, `${bf} ${B.name} players fall.`],
    edges: { a: `${pc}%`, ac: fr(f) },
    side: {
      prompt: `Blox picks one of the ${B.name} players at random. What’s the probability they fell?`,
      answer: label(bf, b), choices,
      why: `${bf} of the ${b} ${B.name} players fell. P = ${bf}/${b}${simple}. The bottom is ${b}, the ${B.name} path, because that’s who Blox picked from.`,
      end: 'bf',
    },
    chain,
  }
}
