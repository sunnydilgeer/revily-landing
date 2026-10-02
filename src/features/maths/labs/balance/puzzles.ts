import type { ChainStep } from '../../step-chain/StepChain'
import type { Rand } from '../kit/random'

/** One side of the scale: mystery boxes (x) and weight blocks, each block worth the puzzle's `unit`. */
export type Side = { x: number; u: number }
export type Scale = { left: Side; right: Side }

export type Move = {
  prompt: string
  answer: string
  choices: { value: string; label: string; nope?: string }[]
  why: string
  /** The scale once this move is done to both sides. */
  after: Scale
}

export type Puzzle = {
  id: string
  title: string
  equation: string
  solution: number
  /** What one weight block is worth: 5 or 10, so every number in the equation is friendly. */
  unit: number
  start: Scale
  why: string
  moves: Move[]
  chain: ChainStep[]
}

/** How an equation side reads, in real numbers: 3x + 15, x, 45. */
export function sideText({ x, u }: Side, unit: number) {
  const xs = x === 0 ? '' : x === 1 ? 'x' : `${x}x`
  if (!xs) return String(u * unit)
  return u ? `${xs} + ${u * unit}` : xs
}

/**
 * A fresh set of equations. Built in blocks (so the scale never holds more than about a dozen),
 * then every block is worth 5 or 10: x + 15 = 35, 2x + 10 = 50, 3x + 5 = x + 25.
 */
export function makePuzzles(rand: Rand): Puzzle[] {
  const unit = rand.pick([5, 10])
  const n = (blocks: number) => blocks * unit

  // Level 1: x + a = b
  const x1 = rand.int(1, 6), a1 = rand.int(1, 12 - x1 > 6 ? 6 : 12 - x1), b1 = x1 + a1
  // Level 2: m x + a = b
  const m2 = rand.pick([2, 3]), x2 = rand.int(1, 4), a2 = rand.int(1, Math.min(4, 14 - m2 * x2)), b2 = m2 * x2 + a2
  // Level 3: m x + a = x + c
  const m3 = rand.pick([3, 4]), x3 = rand.int(1, 3), a3 = rand.int(1, 3), c3 = (m3 - 1) * x3 + a3, k3 = m3 - 1

  return [
    {
      id: 'warmup',
      title: 'Level 1 · Warm-up',
      equation: `x + ${n(a1)} = ${n(b1)}`,
      solution: n(x1),
      unit,
      start: { left: { x: 1, u: a1 }, right: { x: 0, u: b1 } },
      why: 'An equation is a balance: both sides weigh the same. To find what’s in the box, get it on its own, and whatever you do to one side, do to the other or it tips.',
      moves: [
        {
          prompt: 'What gets the box on its own?',
          answer: 'sub-a',
          choices: rand.shuffle([
            { value: 'add-a', label: `+ ${n(a1)}`, nope: `Adding puts MORE weight next to the box. The + ${n(a1)} is in the way, so take ${n(a1)} away.` },
            { value: 'sub-a', label: `− ${n(a1)}` },
            { value: 'sub-b', label: `− ${n(b1)}`, nope: `The ${n(b1)} is on the other side. Undo the + ${n(a1)} that’s sitting next to the box.` },
          ]),
          why: `Take ${n(a1)} from both sides. The left loses its weights, the right goes from ${n(b1)} to ${n(x1)}, and it still balances.`,
          after: { left: { x: 1, u: 0 }, right: { x: 0, u: x1 } },
        },
      ],
      chain: [
        { line: `[[a:x]] [[b:+ ${n(a1)}]] = [[c:${n(b1)}]]` },
        { line: `[[a:x]] [[b:+ ${n(a1)}]] [[m:- ${n(a1)}]] = [[c:${n(b1)}]] [[n:- ${n(a1)}]]`, op: `− ${n(a1)} both sides`, why: `The + ${n(a1)} is stuck to x. Taking ${n(a1)} away removes it, and doing it to both sides keeps the balance.` },
        { line: `[[a:x]] = [[r:${n(x1)}]]`, op: 'Simplify', merge: { r: ['c', 'n'] }, why: `+ ${n(a1)} − ${n(a1)} is 0, so it disappears. ${n(b1)} − ${n(a1)} = ${n(x1)}.` },
      ],
    },
    {
      id: 'double',
      title: `Level 2 · ${m2 === 2 ? 'Two' : 'Three'} boxes`,
      equation: `${m2}x + ${n(a2)} = ${n(b2)}`,
      solution: n(x2),
      unit,
      start: { left: { x: m2, u: a2 }, right: { x: 0, u: b2 } },
      why: 'Two steps now. Clear the loose weights first, then share out what’s left between the boxes.',
      moves: [
        {
          prompt: 'First move?',
          answer: 'sub-a',
          choices: rand.shuffle([
            { value: 'div', label: `÷ ${m2}`, nope: `Sharing comes last. First clear the + ${n(a2)}, so only boxes are left on that side.` },
            { value: 'sub-a', label: `− ${n(a2)}` },
            { value: 'sub-m', label: `− ${m2}`, nope: `The ${m2} in ${m2}x means ${m2} boxes. You can’t take it away like a weight. Clear the + ${n(a2)} first.` },
          ]),
          why: `− ${n(a2)} from both sides: ${m2} boxes on the left, ${n(b2 - a2)} on the right.`,
          after: { left: { x: m2, u: 0 }, right: { x: 0, u: b2 - a2 } },
        },
        {
          prompt: `${m2} boxes weigh ${n(m2 * x2)}. What next?`,
          answer: 'div',
          choices: rand.shuffle([
            { value: 'sub-m', label: `− ${m2}`, nope: `${m2}x is ${m2} lots of x. Taking ${m2} away doesn’t leave one box. Sharing into ${m2} does.` },
            { value: 'mul', label: `× ${m2}`, nope: `Multiplying makes ${m2 * m2} boxes. You want ONE box, so share by ${m2}.` },
            { value: 'div', label: `÷ ${m2}` },
          ]),
          why: `Share both sides into ${m2} equal groups. One box balances ${n(x2)}, so x = ${n(x2)}.`,
          after: { left: { x: 1, u: 0 }, right: { x: 0, u: x2 } },
        },
      ],
      chain: [
        { line: `[[a:${m2}x]] [[b:+ ${n(a2)}]] = [[c:${n(b2)}]]` },
        { line: `[[a:${m2}x]] [[b:+ ${n(a2)}]] [[m:- ${n(a2)}]] = [[c:${n(b2)}]] [[n:- ${n(a2)}]]`, op: `− ${n(a2)} both sides`, why: 'Clear the loose weights first. Do it to both sides to keep the balance.' },
        { line: `[[a:${m2}x]] = [[r:${n(m2 * x2)}]]`, op: 'Simplify', merge: { r: ['c', 'n'] }, why: `+ ${n(a2)} − ${n(a2)} is 0. ${n(b2)} − ${n(a2)} = ${n(m2 * x2)}.` },
        { line: `\\frac{[[a:${m2}x]]}{[[p:${m2}]]} = \\frac{[[r:${n(m2 * x2)}]]}{[[q:${m2}]]}`, op: `÷ ${m2} both sides`, why: `${m2}x means ${m2} lots of x. Sharing by ${m2} leaves one x. Share the other side by ${m2} as well.` },
        { line: `[[x:x]] = [[s:${n(x2)}]]`, op: 'Simplify', merge: { x: ['a', 'p'], s: ['r', 'q'] }, why: `${m2}x ÷ ${m2} = x and ${n(m2 * x2)} ÷ ${m2} = ${n(x2)}.` },
      ],
    },
    {
      id: 'both',
      title: 'Level 3 · Boxes both sides',
      equation: `${m3}x + ${n(a3)} = x + ${n(c3)}`,
      solution: n(x3),
      unit,
      start: { left: { x: m3, u: a3 }, right: { x: 1, u: c3 } },
      why: 'Boxes on both sides! Take the same number of boxes off each side, so they’re only on one side. Then it’s the same as before.',
      moves: [
        {
          prompt: 'Get the boxes on one side. First move?',
          answer: 'sub-x',
          choices: rand.shuffle([
            { value: 'div', label: `÷ ${m3}`, nope: 'Can’t share yet: there are boxes on both sides. Take a box off each side first.' },
            { value: 'sub-x', label: '− x' },
            { value: 'add-x', label: '+ x', nope: 'That adds a box to each side. Take one away from both to clear the right.' },
          ]),
          why: `Take one box off both sides. The right has no boxes left: ${k3}x + ${n(a3)} = ${n(c3)}.`,
          after: { left: { x: k3, u: a3 }, right: { x: 0, u: c3 } },
        },
        {
          prompt: `Now ${k3}x + ${n(a3)} = ${n(c3)}. Next?`,
          answer: 'sub-a',
          choices: rand.shuffle([
            { value: 'sub-a', label: `− ${n(a3)}` },
            { value: 'div', label: `÷ ${k3}`, nope: 'Clear the loose weights first. Then there are only boxes to share.' },
            { value: 'sub-c', label: `− ${n(c3)}`, nope: `That empties the right side. Undo the + ${n(a3)} sitting with the boxes.` },
          ]),
          why: `− ${n(a3)} from both sides: ${k3}x = ${n(c3 - a3)}.`,
          after: { left: { x: k3, u: 0 }, right: { x: 0, u: c3 - a3 } },
        },
        {
          prompt: `${k3} boxes weigh ${n(c3 - a3)}. Finish it.`,
          answer: 'div',
          choices: rand.shuffle([
            { value: 'div-w', label: `÷ ${n(c3 - a3)}`, nope: `Share by the number of boxes, not the weight. There are ${k3} boxes.` },
            { value: 'div', label: `÷ ${k3}` },
            { value: 'sub-k', label: `− ${k3}`, nope: `${k3}x is ${k3} lots of x. Sharing by ${k3} leaves one x.` },
          ]),
          why: `Share both sides by ${k3}. x = ${n(x3)}. Check: ${m3} × ${n(x3)} + ${n(a3)} = ${n(m3 * x3 + a3)} and ${n(x3)} + ${n(c3)} = ${n(x3 + c3)}. Balanced.`,
          after: { left: { x: 1, u: 0 }, right: { x: 0, u: x3 } },
        },
      ],
      chain: [
        { line: `[[a:${m3}x]] [[b:+ ${n(a3)}]] = [[c:x]] [[d:+ ${n(c3)}]]` },
        { line: `[[a:${m3}x]] [[m:- x]] [[b:+ ${n(a3)}]] = [[c:x]] [[n:- x]] [[d:+ ${n(c3)}]]`, op: '− x both sides', why: 'Take one x off both sides. The x on the right cancels, so the x’s are only on the left.' },
        { line: `[[e:${k3}x]] [[b:+ ${n(a3)}]] = [[d:${n(c3)}]]`, op: 'Simplify', merge: { e: ['a', 'm'] }, why: `${m3}x − x = ${k3}x. On the right, x − x is 0.` },
        { line: `[[e:${k3}x]] [[b:+ ${n(a3)}]] [[o:- ${n(a3)}]] = [[d:${n(c3)}]] [[f:- ${n(a3)}]]`, op: `− ${n(a3)} both sides`, why: `Clear the loose + ${n(a3)}, on both sides.` },
        { line: `[[e:${k3}x]] = [[g:${n(c3 - a3)}]]`, op: 'Simplify', merge: { g: ['d', 'f'] }, why: `+ ${n(a3)} − ${n(a3)} is 0. ${n(c3)} − ${n(a3)} = ${n(c3 - a3)}.` },
        { line: `\\frac{[[e:${k3}x]]}{[[p:${k3}]]} = \\frac{[[g:${n(c3 - a3)}]]}{[[q:${k3}]]}`, op: `÷ ${k3} both sides`, why: `Share both sides by ${k3} to leave one x.` },
        { line: `[[x:x]] = [[s:${n(x3)}]]`, op: 'Simplify', merge: { x: ['e', 'p'], s: ['g', 'q'] }, why: `${k3}x ÷ ${k3} = x and ${n(c3 - a3)} ÷ ${k3} = ${n(x3)}.` },
      ],
    },
  ]
}
