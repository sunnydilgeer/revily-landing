import type { ChainStep } from '../../step-chain/StepChain'

/** One side of the scale: mystery boxes (x) and 1 kg weights. */
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
  start: Scale
  why: string
  moves: Move[]
  chain: ChainStep[]
}

/** How an equation side reads: 3x + 1, x, 9. */
export function sideText({ x, u }: Side) {
  const xs = x === 0 ? '' : x === 1 ? 'x' : `${x}x`
  if (!xs) return String(u)
  return u ? `${xs} + ${u}` : xs
}

export const puzzles: Puzzle[] = [
  {
    id: 'warmup',
    title: 'Level 1 · Warm-up',
    equation: 'x + 3 = 7',
    solution: 4,
    start: { left: { x: 1, u: 3 }, right: { x: 0, u: 7 } },
    why: 'An equation is a balance: both sides weigh the same. To find what’s in the box, get it on its own, and whatever you do to one side, do to the other or it tips.',
    moves: [
      {
        prompt: 'What gets the box on its own?',
        answer: 'sub3',
        choices: [
          { value: 'add3', label: '+ 3', nope: 'Adding puts MORE weights next to the box. The + 3 is in the way, so take 3 away.' },
          { value: 'sub3', label: '− 3' },
          { value: 'sub7', label: '− 7', nope: 'The 7 is on the other side. Undo the + 3 that’s sitting next to the box.' },
        ],
        why: 'Take 3 from both sides. The left loses its 3 weights, the right goes from 7 to 4, and it still balances.',
        after: { left: { x: 1, u: 0 }, right: { x: 0, u: 4 } },
      },
    ],
    chain: [
      { line: '[[a:x]] [[b:+ 3]] = [[c:7]]' },
      { line: '[[a:x]] [[b:+ 3]] [[m:- 3]] = [[c:7]] [[n:- 3]]', op: '− 3 both sides', why: 'The + 3 is stuck to x. Taking 3 away removes it, and doing it to both sides keeps the balance.' },
      { line: '[[a:x]] = [[r:4]]', op: 'Simplify', merge: { r: ['c', 'n'] }, why: '+ 3 − 3 is 0, so it disappears. 7 − 3 = 4.' },
    ],
  },
  {
    id: 'double',
    title: 'Level 2 · Two boxes',
    equation: '2x + 5 = 11',
    solution: 3,
    start: { left: { x: 2, u: 5 }, right: { x: 0, u: 11 } },
    why: 'Two steps now. Clear the loose weights first, then share out what’s left between the boxes.',
    moves: [
      {
        prompt: 'First move?',
        answer: 'sub5',
        choices: [
          { value: 'div2', label: '÷ 2', nope: 'Sharing comes last. First clear the + 5, so only boxes are left on that side.' },
          { value: 'sub5', label: '− 5' },
          { value: 'sub2', label: '− 2', nope: 'The 2 in 2x means two boxes. You can’t take it away like a weight. Clear the + 5 first.' },
        ],
        why: '− 5 from both sides: 2 boxes on the left, 6 weights on the right.',
        after: { left: { x: 2, u: 0 }, right: { x: 0, u: 6 } },
      },
      {
        prompt: '2 boxes weigh 6. What next?',
        answer: 'div2',
        choices: [
          { value: 'sub2', label: '− 2', nope: '2x is 2 lots of x. Taking 2 away doesn’t leave one box. Sharing into 2 does.' },
          { value: 'mul2', label: '× 2', nope: 'Multiplying doubles everything: 4 boxes. You want ONE box, so share by 2.' },
          { value: 'div2', label: '÷ 2' },
        ],
        why: 'Share both sides into 2 equal groups. One box balances 3 weights, so x = 3.',
        after: { left: { x: 1, u: 0 }, right: { x: 0, u: 3 } },
      },
    ],
    chain: [
      { line: '[[a:2x]] [[b:+ 5]] = [[c:11]]' },
      { line: '[[a:2x]] [[b:+ 5]] [[m:- 5]] = [[c:11]] [[n:- 5]]', op: '− 5 both sides', why: 'Clear the loose weights first. Do it to both sides to keep the balance.' },
      { line: '[[a:2x]] = [[r:6]]', op: 'Simplify', merge: { r: ['c', 'n'] }, why: '+ 5 − 5 is 0. 11 − 5 = 6.' },
      { line: '\\frac{[[a:2x]]}{[[p:2]]} = \\frac{[[r:6]]}{[[q:2]]}', op: '÷ 2 both sides', why: '2x means 2 lots of x. Sharing by 2 leaves one x. Share the other side by 2 as well.' },
      { line: '[[x:x]] = [[s:3]]', op: 'Simplify', merge: { x: ['a', 'p'], s: ['r', 'q'] }, why: '2x ÷ 2 = x and 6 ÷ 2 = 3.' },
    ],
  },
  {
    id: 'both',
    title: 'Level 3 · Boxes both sides',
    equation: '3x + 1 = x + 9',
    solution: 4,
    start: { left: { x: 3, u: 1 }, right: { x: 1, u: 9 } },
    why: 'Boxes on both sides! Take the same number of boxes off each side, so they’re only on one side. Then it’s the same as before.',
    moves: [
      {
        prompt: 'Get the boxes on one side. First move?',
        answer: 'subx',
        choices: [
          { value: 'div3', label: '÷ 3', nope: 'Can’t share yet: there are boxes on both sides. Take a box off each side first.' },
          { value: 'subx', label: '− x' },
          { value: 'addx', label: '+ x', nope: 'That adds a box to each side. Take one away from both to clear the right.' },
        ],
        why: 'Take one box off both sides. The right has no boxes left: 2x + 1 = 9.',
        after: { left: { x: 2, u: 1 }, right: { x: 0, u: 9 } },
      },
      {
        prompt: 'Now 2x + 1 = 9. Next?',
        answer: 'sub1',
        choices: [
          { value: 'sub1', label: '− 1' },
          { value: 'div2', label: '÷ 2', nope: 'Clear the loose weight first. Then there are only boxes to share.' },
          { value: 'sub9', label: '− 9', nope: 'That empties the right side. Undo the + 1 sitting with the boxes.' },
        ],
        why: '− 1 from both sides: 2x = 8.',
        after: { left: { x: 2, u: 0 }, right: { x: 0, u: 8 } },
      },
      {
        prompt: 'Two boxes weigh 8. Finish it.',
        answer: 'div2',
        choices: [
          { value: 'div8', label: '÷ 8', nope: 'Share by the number of boxes, not the weight. There are 2 boxes.' },
          { value: 'div2', label: '÷ 2' },
          { value: 'sub2', label: '− 2', nope: '2x is 2 lots of x. Sharing by 2 leaves one x.' },
        ],
        why: 'Share both sides by 2. x = 4. Check: 3 × 4 + 1 = 13 and 4 + 9 = 13. Balanced.',
        after: { left: { x: 1, u: 0 }, right: { x: 0, u: 4 } },
      },
    ],
    chain: [
      { line: '[[a:3x]] [[b:+ 1]] = [[c:x]] [[d:+ 9]]' },
      { line: '[[a:3x]] [[m:- x]] [[b:+ 1]] = [[c:x]] [[n:- x]] [[d:+ 9]]', op: '− x both sides', why: 'Take one x off both sides. The x on the right cancels, so the x’s are only on the left.' },
      { line: '[[e:2x]] [[b:+ 1]] = [[d:9]]', op: 'Simplify', merge: { e: ['a', 'm'] }, why: '3x − x = 2x. On the right, x − x is 0.' },
      { line: '[[e:2x]] [[b:+ 1]] [[o:- 1]] = [[d:9]] [[f:- 1]]', op: '− 1 both sides', why: 'Clear the loose + 1, on both sides.' },
      { line: '[[e:2x]] = [[g:8]]', op: 'Simplify', merge: { g: ['d', 'f'] }, why: '+ 1 − 1 is 0. 9 − 1 = 8.' },
      { line: '\\frac{[[e:2x]]}{[[p:2]]} = \\frac{[[g:8]]}{[[q:2]]}', op: '÷ 2 both sides', why: 'Share both sides by 2 to leave one x.' },
      { line: '[[x:x]] = [[s:4]]', op: 'Simplify', merge: { x: ['e', 'p'], s: ['g', 'q'] }, why: '2x ÷ 2 = x and 8 ÷ 2 = 4.' },
    ],
  },
]
