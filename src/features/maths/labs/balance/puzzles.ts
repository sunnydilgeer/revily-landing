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
  /** How the equation reads before the first move, when blocks alone can't show it: 2(x + 15) = 70. */
  startText?: string
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
  // Level 4: m(x + a) = b. Share by m first, then clear the a. The right side holds m(x + a) blocks, 12 at most.
  const m4 = rand.pick([2, 3]), x4 = rand.int(1, m4 === 2 ? 5 : 3), a4 = rand.int(1, (m4 === 2 ? 6 : 4) - x4)
  const s4 = x4 + a4, b4 = m4 * s4
  // Level 5 (boss): kx + c = mx + a, with the boxes ending up on the RIGHT. Bigger blocks: 10 or 20 each.
  const unit5 = rand.pick([10, 20]), n5 = (blocks: number) => blocks * unit5
  const k5 = rand.pick([2, 3]), d5 = rand.pick([2, 3]), m5 = k5 + d5
  const x5 = rand.int(1, 3), a5 = rand.int(1, 3), c5 = d5 * x5 + a5

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
    {
      id: 'bracket',
      title: 'Level 4 · Bracket box',
      equation: `${m4}(x + ${n(a4)}) = ${n(b4)}`,
      startText: `${m4}(x + ${n(a4)}) = ${n(b4)}`,
      solution: n(x4),
      unit,
      start: { left: { x: m4, u: m4 * a4 }, right: { x: 0, u: b4 } },
      why: `A bracket means ${m4 === 2 ? 'two' : 'three'} lots of everything inside. Share both sides by ${m4} first, and the bracket opens up. Then it’s a warm-up again: clear the loose weights.`,
      moves: [
        {
          prompt: 'A bracket! First move?',
          answer: 'div',
          choices: rand.shuffle([
            { value: 'div', label: `÷ ${m4}` },
            { value: 'sub-a', label: `− ${n(a4)}`, nope: `The bracket means ${m4} lots of (x + ${n(a4)}), so there’s ${m4} × ${n(a4)} = ${n(m4 * a4)} of loose weight, not ${n(a4)}. Share by ${m4} first.` },
            { value: 'mul', label: `× ${m4}`, nope: `That makes ${m4 * m4} lots of the bracket. You want ONE lot, so share by ${m4}.` },
          ]),
          why: `Share both sides into ${m4} equal groups. One group is x + ${n(a4)}, and ${n(b4)} ÷ ${m4} = ${n(s4)}.`,
          after: { left: { x: 1, u: a4 }, right: { x: 0, u: s4 } },
        },
        {
          prompt: `Now x + ${n(a4)} = ${n(s4)}. Finish it.`,
          answer: 'sub-a',
          choices: rand.shuffle([
            { value: 'add-a', label: `+ ${n(a4)}`, nope: `Adding piles MORE weight next to the box. Take the ${n(a4)} away instead.` },
            { value: 'sub-a', label: `− ${n(a4)}` },
            { value: 'div-again', label: `÷ ${m4} again`, nope: `You already shared by ${m4}: there’s only one box now. The + ${n(a4)} is what’s in the way.` },
          ]),
          why: `− ${n(a4)} from both sides. x = ${n(s4)} − ${n(a4)} = ${n(x4)}. Check: ${m4} × (${n(x4)} + ${n(a4)}) = ${m4} × ${n(s4)} = ${n(b4)}.`,
          after: { left: { x: 1, u: 0 }, right: { x: 0, u: x4 } },
        },
      ],
      chain: [
        { line: `[[a:${m4}]]([[x:x]] [[d:+ ${n(a4)}]]) = [[c:${n(b4)}]]` },
        { line: `\\frac{[[a:${m4}]]([[x:x]] [[d:+ ${n(a4)}]])}{[[p:${m4}]]} = \\frac{[[c:${n(b4)}]]}{[[q:${m4}]]}`, op: `÷ ${m4} both sides`, why: `The bracket is ${m4} lots of (x + ${n(a4)}). Sharing by ${m4} leaves one lot. Share the other side by ${m4} too.` },
        { line: `[[x:x]] [[d:+ ${n(a4)}]] = [[r:${n(s4)}]]`, op: 'Simplify', merge: { r: ['c', 'q'] }, why: `${m4} ÷ ${m4} is 1, so the bracket opens. ${n(b4)} ÷ ${m4} = ${n(s4)}.` },
        { line: `[[x:x]] [[d:+ ${n(a4)}]] [[m:- ${n(a4)}]] = [[r:${n(s4)}]] [[o:- ${n(a4)}]]`, op: `− ${n(a4)} both sides`, why: `Now it’s a warm-up. Take ${n(a4)} off both sides.` },
        { line: `[[x:x]] = [[s:${n(x4)}]]`, op: 'Simplify', merge: { s: ['r', 'o'] }, why: `+ ${n(a4)} − ${n(a4)} is 0. ${n(s4)} − ${n(a4)} = ${n(x4)}.` },
      ],
    },
    {
      id: 'boss',
      title: 'Level 5 · Boss bot',
      equation: `${k5}x + ${n5(c5)} = ${m5}x + ${n5(a5)}`,
      solution: n5(x5),
      unit: unit5,
      start: { left: { x: k5, u: c5 }, right: { x: m5, u: a5 } },
      why: `A real exam one, with heavier blocks. The right has more boxes, so take ${k5}x off both sides and the boxes stay on the right. Clear the loose weights, then share. x = something or something = x: both mean the same.`,
      moves: [
        {
          prompt: 'Boxes both sides. First move?',
          answer: 'sub-kx',
          choices: rand.shuffle([
            { value: 'sub-kx', label: `− ${k5}x` },
            { value: 'sub-mx', label: `− ${m5}x`, nope: `The left only has ${k5} boxes. You can’t take ${m5} off it. Take off the smaller number, ${k5}x, so the boxes stay on the right.` },
            { value: 'sub-x', label: '− x', nope: `That leaves ${k5 - 1}x on the left and ${m5 - 1}x on the right: boxes still both sides. Take off all ${k5}.` },
          ]),
          why: `Take ${k5} boxes off both sides. The left has none left: ${n5(c5)} = ${d5}x + ${n5(a5)}.`,
          after: { left: { x: 0, u: c5 }, right: { x: d5, u: a5 } },
        },
        {
          prompt: `Now ${n5(c5)} = ${d5}x + ${n5(a5)}. Next?`,
          answer: 'sub-a',
          choices: rand.shuffle([
            { value: 'sub-c', label: `− ${n5(c5)}`, nope: `That empties the left. Undo the + ${n5(a5)} sitting with the boxes.` },
            { value: 'sub-a', label: `− ${n5(a5)}` },
            { value: 'div', label: `÷ ${d5}`, nope: 'Clear the loose weights first. Then there are only boxes to share.' },
          ]),
          why: `− ${n5(a5)} from both sides: ${n5(c5 - a5)} = ${d5}x.`,
          after: { left: { x: 0, u: c5 - a5 }, right: { x: d5, u: 0 } },
        },
        {
          prompt: `${d5} boxes weigh ${n5(c5 - a5)}. Finish it.`,
          answer: 'div',
          choices: rand.shuffle([
            { value: 'div-w', label: `÷ ${n5(c5 - a5)}`, nope: `Share by the number of boxes, not the weight. There are ${d5} boxes.` },
            { value: 'div', label: `÷ ${d5}` },
            { value: 'sub-d', label: `− ${d5}`, nope: `${d5}x is ${d5} lots of x. Sharing by ${d5} leaves one x.` },
          ]),
          why: `Share both sides by ${d5}. x = ${n5(x5)}. Check: ${k5} × ${n5(x5)} + ${n5(c5)} = ${n5(k5 * x5 + c5)} and ${m5} × ${n5(x5)} + ${n5(a5)} = ${n5(m5 * x5 + a5)}. Balanced.`,
          after: { left: { x: 0, u: x5 }, right: { x: 1, u: 0 } },
        },
      ],
      chain: [
        { line: `[[a:${k5}x]] [[b:+ ${n5(c5)}]] = [[c:${m5}x]] [[d:+ ${n5(a5)}]]` },
        { line: `[[a:${k5}x]] [[m:- ${k5}x]] [[b:+ ${n5(c5)}]] = [[c:${m5}x]] [[n:- ${k5}x]] [[d:+ ${n5(a5)}]]`, op: `− ${k5}x both sides`, why: `The right has more x’s, so take the smaller number, ${k5}x, off both sides.` },
        { line: `[[b:${n5(c5)}]] = [[e:${d5}x]] [[d:+ ${n5(a5)}]]`, op: 'Simplify', merge: { e: ['c', 'n'] }, why: `${k5}x − ${k5}x is 0. ${m5}x − ${k5}x = ${d5}x.` },
        { line: `[[b:${n5(c5)}]] [[o:- ${n5(a5)}]] = [[e:${d5}x]] [[d:+ ${n5(a5)}]] [[f:- ${n5(a5)}]]`, op: `− ${n5(a5)} both sides`, why: `Clear the loose + ${n5(a5)}, on both sides.` },
        { line: `[[g:${n5(c5 - a5)}]] = [[e:${d5}x]]`, op: 'Simplify', merge: { g: ['b', 'o'] }, why: `+ ${n5(a5)} − ${n5(a5)} is 0. ${n5(c5)} − ${n5(a5)} = ${n5(c5 - a5)}.` },
        { line: `\\frac{[[g:${n5(c5 - a5)}]]}{[[p:${d5}]]} = \\frac{[[e:${d5}x]]}{[[q:${d5}]]}`, op: `÷ ${d5} both sides`, why: `Share both sides by ${d5} to leave one x.` },
        { line: `[[s:${n5(x5)}]] = [[x:x]]`, op: 'Simplify', merge: { s: ['g', 'p'], x: ['e', 'q'] }, why: `${n5(c5 - a5)} ÷ ${d5} = ${n5(x5)} and ${d5}x ÷ ${d5} = x.` },
        { line: `[[x:x]] = [[s:${n5(x5)}]]`, op: 'Flip it round', why: `${n5(x5)} = x and x = ${n5(x5)} say the same thing. Exams like x first.` },
      ],
    },
  ]
}
