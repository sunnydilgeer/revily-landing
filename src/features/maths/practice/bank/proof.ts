/*
 * Practice templates for proof (lesson 28, Algebra A13): counterexamples, identities, angle proofs, odd and even.
 * Original questions in the style of AQA Foundation papers. The AQA 2022–25 references have not been
 * counted for proof yet, so `inspiredBy` says so, and the weights in aqaWeights.ts are estimates.
 */
import { rotate } from '../helpers'
import type { ChoicePart, NumberPart, QuestionBody, Template } from '../types'

/** Someone's claim, and which value of n shows it is wrong: the right one first, then values that fit the claim. */
function counterexample(who: string, claim: string, expression: (n: number) => number, show: string, right: number, wrong: number[], why: string, by: number): QuestionBody {
  const pick: ChoicePart = {
    kind: 'choice', prompt: `Which value of $n$ shows ${who} is wrong?`, marks: 1, statements: ['28:proof-counterexample'],
    ...rotate([right, ...wrong].map(n => `$n = ${n}$`), 0, by),
    hint: `Try each value in $${show}$. One example that doesn’t fit is enough.`,
    reason: `n = ${right} gives ${expression(right)}, ${why}. The others give ${wrong.map(expression).join(', ')}, which fit the claim.`,
  }
  return { stem: `${who} says “$${show}$ ${claim} for every whole number $n$.”`, parts: [pick] }
}

/** (x + a)² − x² ≡ 2ax + a²: which expression it simplifies to, then use it for (k + a)² − k² (2 marks, method: x). */
function identity(a: number, k: number, by: number): QuestionBody {
  const left = `(x + ${a})^2 - x^2`, right = `${2 * a}x + ${a * a}`
  const simplify: ChoicePart = {
    kind: 'choice', prompt: `Expand and simplify $${left}$.`, marks: 1, statements: ['28:proof-identity'],
    ...rotate([`$${right}$`, `$${a * a}$`, `$${a}x + ${a * a}$`, `$${2 * a}x + ${a}$`], 0, by),
    hint: `$(x + ${a})^2$ is $(x + ${a})(x + ${a})$. Every term times every term.`,
    chain: [{ line: left }, { line: `x^2 + ${a}x + ${a}x + ${a * a} - x^2`, op: 'Expand the brackets', why: `x × x, x × ${a}, ${a} × x and ${a} × ${a}.` }, { line: right, op: 'Collect and cancel', why: '+x² and −x² cancel; the x terms add.' }],
  }
  const value = 2 * a * k + a * a
  const use: NumberPart = {
    kind: 'number', prompt: `Use your answer to work out $${k + a}^2 - ${k}^2$.`, answer: value, marks: 2, statements: ['28:proof-identity'],
    hint: `$${k + a}$ is $x + ${a}$. What is $x$?`,
    method: [{ prompt: 'What is the value of x?', answer: k }],
    chain: [{ line: `${k + a}^2 - ${k}^2 = (x + ${a})^2 - x^2` }, { line: `x = ${k}`, op: 'Match the pattern', why: `${k + a} is ${k} + ${a}.` }, { line: `${2 * a} \\times ${k} + ${a * a} = ${value}`, op: `Put x = ${k} into ${right}`, why: 'The two sides are equal for every x.' }],
  }
  return { stem: `Show that $${left} \\equiv ${right}$.`, parts: [simplify, use] }
}

/** The triangle proof: the reason the top-left angle equals a, then the third angle from the other two. */
function triangle(a: number, b: number, by: number): QuestionBody {
  const reason: ChoicePart = {
    kind: 'choice', prompt: 'A line through the top corner is drawn parallel to the base. Why is the new angle on the left equal to $a$?', marks: 1, statements: ['28:proof-geometric'],
    ...rotate(['Alternate angles are equal', 'Corresponding angles are equal', 'Vertically opposite angles are equal', 'Angles on a straight line add to 180°'], 0, by),
    hint: 'The two angles sit inside the parallel lines, on opposite sides of the slanted line: a Z shape.',
    reason: 'The new angle and a make a Z between the parallel lines, so they are alternate angles, and alternate angles are equal.',
  }
  const c = 180 - a - b
  const third: NumberPart = {
    kind: 'number', prompt: `$a = ${a}°$ and $b = ${b}°$. Work out $c$, the angle at the top.`, answer: c, suffix: '°', marks: 1, statements: ['28:proof-geometric'],
    hint: 'The proof shows a + b + c = 180°.',
    chain: [{ line: `a + b + c = 180^{\\circ}` }, { line: `${a} + ${b} + c = 180`, op: 'Put in a and b', why: 'Angles in a triangle add to 180°.' }, { line: `c = ${c}`, op: `Subtract ${a + b}`, why: 'Do the same to both sides.' }],
  }
  return { stem: 'A triangle has angles $a$ and $b$ at the base and $c$ at the top.', parts: [reason, third] }
}

/** Which expression is always odd, even or a multiple; then the number in the sum of `count` numbers in a row. */
function inARow(kind: string, right: string, wrong: string[], count: number, by: number): QuestionBody {
  const pick: ChoicePart = {
    kind: 'choice', prompt: `$n$ is a whole number. Which expression is always ${kind}?`, marks: 1, statements: ['28:proof-algebraic'],
    ...rotate([right, ...wrong].map(e => `$${e}$`), 0, by),
    hint: '2n is always even. Try n = 1 and n = 2 in each.',
    reason: `${right} is always ${kind}, whatever n is. Each of the others is not for some n.`,
  }
  const terms = Array.from({ length: count }, (_, i) => i ? `(n + ${i})` : 'n')
  const k = count * (count - 1) / 2
  const sum: NumberPart = {
    kind: 'number', prompt: `${count} whole numbers in a row are ${terms.map(t => `$${t}$`).join(', ')}. Their sum is $${count}n + k$. What is $k$?`, answer: k, marks: 1, statements: ['28:proof-algebraic'],
    hint: 'Add the n terms, then add the numbers.',
    chain: [{ line: terms.join(' + ') }, { line: `${count}n + ${k}`, op: 'Collect like terms', why: `${count} lots of n, and ${Array.from({ length: count - 1 }, (_, i) => i + 1).join(' + ')} = ${k}.` }],
  }
  return { stem: 'Odd and even numbers can be written with $n$.', parts: [pick, sum] }
}

export const proofTemplates: Template[] = [
  {
    id: 'proof-counterexample', topic: 'proof', ramp: 'multistep', style: 'explain', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A13.1 worksheet (pick the counterexample); AQA 2022–25 references still to be counted',
    variants: [
      counterexample('Mia', 'is always prime', n => 2 * n + 1, '2n + 1', 4, [1, 2, 3], 'and 9 = 3 × 3 isn’t prime', 0),
      counterexample('Sam', 'is always odd', n => n * n + 1, 'n^2 + 1', 3, [2, 4, 6], 'which is even', 1),
      counterexample('Leo', 'is always prime', n => n * n + n + 1, 'n^2 + n + 1', 4, [1, 2, 3], 'and 21 = 3 × 7 isn’t prime', 2),
    ],
  },
  {
    id: 'proof-identity', topic: 'proof', ramp: 'stretch', style: 'showThat', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A13.2 worksheet (show an identity, then use it); AQA 2022–25 references still to be counted',
    variants: [identity(3, 10, 0), identity(2, 50, 1), identity(5, 20, 2)],
  },
  {
    id: 'proof-triangle', topic: 'proof', ramp: 'stretch', style: 'explain', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A13.3 worksheet (the angles in a triangle, with reasons); AQA 2022–25 references still to be counted',
    variants: [triangle(62, 48, 0), triangle(55, 75, 1), triangle(40, 85, 2)],
  },
  {
    id: 'proof-odd-even', topic: 'proof', ramp: 'multistep', style: 'explain', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A13.4 worksheet (odd and even with n); AQA 2022–25 references still to be counted',
    variants: [
      inARow('odd', '2n + 1', ['2n', 'n + 1', '2n + 2'], 2, 0),
      inARow('even', '2n + 4', ['2n + 1', 'n + 2', '3n'], 3, 1),
      inARow('a multiple of 3', '3n + 6', ['3n + 1', 'n + 3', '2n + 3'], 4, 2),
    ],
  },
]
