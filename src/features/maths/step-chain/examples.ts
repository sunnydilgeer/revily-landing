import type { ChainLayout, ChainStep } from './StepChain'

export type ChainExample = {
  id: string
  tab: string
  prompt: string
  layout?: ChainLayout
  steps: ChainStep[]
}

/** Prototype examples: one per kind of move the chain needs to handle. */
export const chainExamples: ChainExample[] = [
  {
    id: 'equation',
    tab: 'Equation',
    prompt: 'Solve',
    steps: [
      { line: '[[a:3x]] [[b:+ 5]] = [[c:20]]' },
      {
        line: '[[a:3x]] [[b:+ 5]] [[m:- 5]] = [[c:20]] [[n:- 5]]',
        op: '− 5 from both sides',
        why: 'Taking 5 from both sides keeps the equation balanced and leaves 3x on its own.',
      },
      {
        line: '[[a:3x]] = [[r:15]]',
        op: 'Simplify',
        why: '+ 5 − 5 is 0, and 20 − 5 = 15.',
        merge: { r: ['c', 'n'] },
      },
      {
        line: '\\frac{[[a:3x]]}{[[p:3]]} = \\frac{[[r:15]]}{[[q:3]]}',
        op: '÷ 3 both sides',
        why: '3x means 3 × x, so dividing by 3 undoes it.',
      },
      {
        line: '[[x:x]] = [[s:5]]',
        op: 'Simplify',
        why: '3x ÷ 3 = x and 15 ÷ 3 = 5.',
        merge: { x: ['a', 'p'], s: ['r', 'q'] },
      },
    ],
  },
  {
    id: 'fraction',
    tab: 'Fraction',
    prompt: 'Simplify fully',
    steps: [
      { line: '\\frac{[[n:18]]}{[[d:24]]}' },
      {
        line: '= \\frac{[[n:18]] [[p:\\div 6]]}{[[d:24]] [[q:\\div 6]]}',
        op: '÷ 6 top and bottom',
        why: '6 is the highest common factor of 18 and 24.',
      },
      {
        line: '= \\frac{[[a:3]]}{[[b:4]]}',
        op: 'Work out',
        why: '18 ÷ 6 = 3 and 24 ÷ 6 = 4. 3 and 4 share no factor, so it is fully simplified.',
        merge: { a: ['n', 'p'], b: ['d', 'q'] },
      },
    ],
  },
  {
    id: 'place-value',
    tab: 'Place value',
    prompt: 'Work out 3.7 × 100',
    layout: { kind: 'columns', columns: ['H', 'T', 'U', '.', 't'] },
    steps: [
      { line: ' | | [[a:3]] | . | [[b:7]]' },
      {
        line: ' | [[a:3]] | [[b:7]] | . | ',
        op: '× 10: each digit moves one place left',
        why: 'Each digit becomes worth ten times more, so it moves up one column. The decimal point stays still.',
      },
      {
        line: '[[a:3]] | [[b:7]] | [[z:0]] | . | ',
        op: '× 10 again',
        why: 'The units column is now empty, so a 0 holds its place. 3.7 × 100 = 370.',
      },
    ],
  },
  {
    id: 'trig',
    tab: 'Trig',
    prompt: 'Find x',
    steps: [
      { line: '[[s:\\sin 30^\\circ]] = \\frac{[[x:x]]}{[[h:12]]}' },
      {
        line: '[[m:12 \\times]] [[s:\\sin 30^\\circ]] = [[k:12 \\times]] \\frac{[[x:x]]}{[[h:12]]}',
        op: '× 12 both sides',
        why: 'x is divided by 12, so multiplying by 12 undoes it.',
      },
      {
        line: '[[m:12 \\times]] [[s:\\sin 30^\\circ]] = [[x:x]]',
        op: 'The 12s cancel',
        why: '12 × x ÷ 12 is just x.',
      },
      {
        line: '[[m:12 \\times]] [[v:0.5]] = [[x:x]]',
        op: 'sin 30° = 0.5',
        why: 'sin 30° is an exact value you need to know.',
        merge: { v: ['s'] },
      },
      {
        line: '[[x:x]] = [[r:6]]',
        op: '12 × 0.5 = 6',
        merge: { r: ['m', 'v'] },
      },
    ],
  },
]
