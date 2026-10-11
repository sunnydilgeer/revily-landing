/*
 * Practice templates for ratio: the basics (lesson 37, R1.1–R1.5) and ratio problems (lesson 30, R1.6–R1.8): a share from the difference between two parts, a ratio
 * that changes until two amounts are equal, and the form 1 : n. Original questions in the style of AQA Foundation
 * papers. The AQA 2022–25 references have not been counted for these skills yet, so `inspiredBy` says so, and the
 * weights in aqaWeights.ts are estimates.
 */
import type { FractionPart, NumberPart, QuestionBody, Template } from '../types'

const join = (list: (string | number)[]) => list.join(' : ')

/** a : b of two things; what fraction is the first? (1 mark) */
function asFraction(a: number, b: number, what: [string, string], group: string): QuestionBody {
  const part: FractionPart = {
    kind: 'fraction', prompt: `What fraction of the ${group} are ${what[0]}?`, answer: [a, a + b], marks: 1, statements: ['37:ratio-fractions'],
    hint: `Add the parts to find the whole: ${a} + ${b}. The ${what[0]} are ${a} of those parts.`,
    chain: [
      { line: `${a} + ${b} = ${a + b}`, op: 'Parts in total', why: 'The whole is every part added together.' },
      { line: `\\frac{${a}}{${a + b}}`, op: `${what[0]} out of the whole`, why: `${a} of the ${a + b} parts are ${what[0]}.` },
    ],
    mistakes: [{ answer: [a, b], note: `${a}/${b} compares ${what[0]} with ${what[1]}. The whole is ${a} + ${b} = ${a + b} parts.` }],
  }
  return { stem: `The ratio of ${what[0]} to ${what[1]} in a ${group.replace(/s$/, '')} group is $${a} : ${b}$.`, parts: [part] }
}

/** Simplify a : b : c and ask for the last number (1 mark). */
function simplify(list: number[], what: string): QuestionBody {
  const gcd = (x: number, y: number): number => y ? gcd(y, x % y) : x
  const h = list.reduce(gcd), small = list.map(n => n / h), last = small[small.length - 1]
  const part: NumberPart = {
    kind: 'number', prompt: `Write the ratio $${join(list)}$ in its simplest form, $${join(small.slice(0, -1))} : n$. What is $n$?`, answer: last, marks: 1, statements: ['37:ratio-simplifying'], prefix: 'n =',
    hint: `Find the biggest number that divides into all of ${list.join(', ')}.`,
    chain: [{ line: `${join(list)} = ${join(small)}`, op: `÷ ${h}`, why: `${h} is the highest common factor, so divide every part by it.` }],
    mistakes: [{ answer: list[list.length - 1] / 2, note: `Halving isn't enough: the parts still share a factor. Divide by the highest common factor, ${h}.` }],
  }
  return { stem: `A ${what} is made in the ratio $${join(list)}$.`, parts: [part] }
}

/** a : b, and `have` of the first; how much of the second? (2 marks) */
function scale(a: number, b: number, have: number, what: [string, string], unit: string): QuestionBody {
  const times = have / a, answer = b * times
  const part: NumberPart = {
    kind: 'number', prompt: `How much ${what[1]} is needed?`, answer, marks: 2, statements: ['37:ratio-scaling'], suffix: unit,
    hint: `How many times bigger is ${have} than ${a}? Multiply ${b} by the same.`,
    method: [{ prompt: `What has ${a} been multiplied by? $${have} \\div ${a} = ?$`, answer: times }],
    chain: [
      { line: `${have} \\div ${a} = ${times}`, op: 'Scale factor', why: `${a} parts of ${what[0]} became ${have}${unit}.` },
      { line: `${b} \\times ${times} = ${answer}`, op: `× ${times}`, why: 'Do the same to the other side of the ratio.' },
    ],
    mistakes: [{ answer: have + b - a, note: `Ratios scale by multiplying, not adding: ${have} is ${times} times ${a}.` }],
  }
  return { stem: `${what[0][0].toUpperCase() + what[0].slice(1)} and ${what[1]} are mixed in the ratio $${a} : ${b}$. There are ${have}${unit} of ${what[0]}.`, parts: [part] }
}

/** The first thing is a/whole of a bag of `total`; how many are not? (2 marks) */
function partWhole(a: number, whole: number, total: number, what: string, group: string): QuestionBody {
  const one = total / whole, answer = (whole - a) * one
  const part: NumberPart = {
    kind: 'number', prompt: `How many ${group} are not ${what}?`, answer, marks: 2, statements: ['37:ratio-part-whole'],
    hint: `${a} : ${whole} is part to whole: ${whole} parts is all ${total}. The rest is ${whole} − ${a} parts.`,
    method: [{ prompt: `What is 1 part worth? $${total} \\div ${whole} = ?$`, answer: one }],
    chain: [
      { line: `${total} \\div ${whole} = ${one}`, op: 'Find 1 part', why: `The whole bag is ${whole} parts.` },
      { line: `${whole - a} \\times ${one} = ${answer}`, op: `× ${whole - a}`, why: `${whole} − ${a} = ${whole - a} parts are not ${what}.` },
    ],
    mistakes: [{ answer: total / (a + whole) * whole, note: `${a} : ${whole} compares ${what} with the whole bag, so the bag is ${whole} parts, not ${a + whole}.` }, { answer: a * one, note: `That's how many are ${what}. The question asks for the rest.` }],
  }
  return { stem: `A bag has ${total} ${group}. The ratio of ${what} ${group} to all the ${group} is $${a} : ${whole}$.`, parts: [part] }
}

/** Share `total` in a ratio; one person's share (2 marks). */
function share(names: string[], ratio: number[], total: number, want: number, pounds = false): QuestionBody {
  const parts = ratio.reduce((x, y) => x + y, 0), one = total / parts, answer = ratio[want] * one
  const part: NumberPart = {
    kind: 'number', prompt: `How much does ${names[want]} get?`, answer, marks: 2, statements: ['37:ratio-sharing'], prefix: pounds ? '£' : undefined,
    hint: `Add the parts, then share ${pounds ? '£' : ''}${total} between them to find 1 part.`,
    method: [{ prompt: `What is 1 part worth? $${total} \\div ${parts} = ?$`, answer: one, prefix: pounds ? '£' : undefined }],
    chain: [
      { line: `${ratio.join(' + ')} = ${parts}`, op: 'Parts in total', why: 'Add every part of the ratio.' },
      { line: `${total} \\div ${parts} = ${one}`, op: 'Find 1 part', why: `Share the ${pounds ? '£' : ''}${total} between ${parts} parts.` },
      { line: `${ratio[want]} \\times ${one} = ${answer}`, op: `${names[want]}’s share`, why: `${names[want]} has ${ratio[want]} parts.` },
    ],
    mistakes: [{ answer: total / ratio.length, note: `Share by the ratio, not equally: there are ${parts} parts.` }, { answer: total / ratio[want], note: `Add up all the parts first: ${ratio.join(' + ')} = ${parts}.` }],
  }
  return { stem: `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]} share ${pounds ? '£' : ''}${total} in the ratio $${join(ratio)}$.`, parts: [part] }
}

/** Three shares in a ratio; one is `more` than another. Find a third share (2 marks, method: 1 part). */
function difference(names: [string, string, string], ratio: [number, number, number], big: number, small: number, want: number, more: number, what: string, pounds = false): QuestionBody {
  const parts = ratio[big] - ratio[small], one = more / parts, share = ratio[want] * one
  const amount = (n: number) => pounds ? `£${n}` : `${n}`
  const part: NumberPart = {
    kind: 'number', prompt: `How ${pounds ? 'much' : 'many'} does ${names[want]} get?`, answer: share, marks: 2, statements: ['30:ratio-difference'], prefix: pounds ? '£' : undefined,
    hint: `${amount(more)} is the difference between ${names[big]} and ${names[small]}, not the total. How many parts is that?`,
    method: [{ prompt: `What is 1 part worth? $${more} \\div ${parts} = ?$`, answer: one, prefix: pounds ? '£' : undefined }],
    chain: [
      { line: `${ratio[big]} - ${ratio[small]} = ${parts}`, op: 'The difference in parts', why: `${names[big]} has ${parts} more parts than ${names[small]}: those parts are the ${amount(more)}.` },
      { line: `${more} \\div ${parts} = ${one}`, op: 'Find 1 part', why: `Share the ${amount(more)} between the ${parts} parts.` },
      { line: `${ratio[want]} \\times ${one} = ${share}`, op: `${names[want]}’s share`, why: `${names[want]} has ${ratio[want]} parts.` },
    ],
    mistakes: [{ answer: more / (ratio[0] + ratio[1] + ratio[2]) * ratio[want], note: `${amount(more)} is the difference, not the total: use ${ratio[big]} − ${ratio[small]} = ${parts} parts.` }],
  }
  return { stem: `${names[0]}, ${names[1]} and ${names[2]} share ${what} in the ratio $${join(ratio)}$. ${names[big]} gets ${amount(more)} more than ${names[small]}.`, parts: [part] }
}

/** A : B = a : b. A gives B some, and then they have the same. How many did A have at first? (2 marks, method: x) */
function changing(names: [string, string], a: number, b: number, given: number, what: string): QuestionBody {
  const x = 2 * given / (a - b), first = a * x
  const part: NumberPart = {
    kind: 'number', prompt: `How many ${what} did ${names[0]} have at first?`, answer: first, marks: 2, statements: ['30:ratio-changing'],
    hint: `Call 1 part $x$: ${names[0]} has $${a}x$ and ${names[1]} has $${b}x$. Write each after the change and make them equal.`,
    method: [{ prompt: `Solve $${a}x - ${given} = ${b}x + ${given}$. What is $x$?`, answer: x }],
    chain: [
      { line: `${a}x - ${given} = ${b}x + ${given}`, op: 'After the change', why: `${names[0]} gives ${given} away and ${names[1]} gets them. Now they are equal.` },
      { line: `${a - b}x = ${2 * given}`, op: `− ${b}x, + ${given}`, why: 'Get x on one side, and the numbers on the other.' },
      { line: `x = ${x}`, op: `÷ ${a - b}`, why: 'x is 1 part.' },
      { line: `${a} \\times ${x} = ${first}`, op: `${names[0]} at first`, why: `${names[0]} had ${a} parts.` },
    ],
    mistakes: [{ answer: x, note: `That’s 1 part, x. ${names[0]} had ${a} parts.` }, { answer: first - given, note: `That’s how many ${names[0]} has now. The question asks for at first.` }],
  }
  return { stem: `The ratio of ${names[0]}’s ${what} to ${names[1]}’s ${what} is $${a} : ${b}$. ${names[0]} gives ${names[1]} ${given} ${what}. Now they have the same number of ${what}.`, parts: [part] }
}

/** a : b in the form 1 : n (1 mark). */
function unitForm(a: number, b: number, what: [string, string]): QuestionBody {
  const n = b / a
  const part: NumberPart = {
    kind: 'number', prompt: 'Write this ratio in the form $1 : n$. What is $n$?', answer: n, marks: 1, statements: ['30:ratio-unit-form'], prefix: 'n =',
    hint: `The first number must become 1. Divide both numbers by ${a}.`,
    chain: [
      { line: `${a} \\div ${a} = 1`, op: `÷ ${a}`, why: 'The first number must become 1.' },
      { line: `${b} \\div ${a} = ${n}`, op: `÷ ${a}`, why: 'Do the same to the other number.' },
    ],
    mistakes: [{ answer: b - a, note: `Divide, don’t subtract: ${b} ÷ ${a}.` }],
  }
  return { stem: `${what[0]} and ${what[1]} are mixed in the ratio $${a} : ${b}$.`, parts: [part] }
}

/** `a` of something go with `amount`; what goes with `b`? Direct proportion by finding 1 first (2 marks). */
function directProportion(a: number, amount: number, b: number, stem: string, prompt: string, one: string, pounds = false): QuestionBody {
  const each = amount / a, answer = each * b
  const part: NumberPart = {
    kind: 'number', prompt, answer, marks: 2, statements: ['31:proportion-direct'], prefix: pounds ? '£' : undefined,
    hint: `Find 1 ${one} first: divide by ${a}. Then multiply by ${b}.`,
    method: [{ prompt: `What goes with 1 ${one}? $${amount} \\div ${a} = ?$`, answer: each, prefix: pounds ? '£' : undefined }],
    chain: [
      { line: `${amount} \\div ${a} = ${each}`, op: 'Find 1', why: `Share ${pounds ? '£' : ''}${amount} between ${a}.` },
      { line: `${b} \\times ${each} = ${answer}`, op: `× ${b}`, why: `${b} is ${b} lots of 1 ${one}.` },
    ],
    mistakes: [{ answer: amount * b, note: `${pounds ? '£' : ''}${amount} goes with ${a}, not 1. Divide by ${a} first.` }, { answer: amount + b - a, note: 'Multiply, don’t add: find 1 first, then multiply.' }],
  }
  return { stem, parts: [part] }
}

/** a workers take `time` hours; how long do b workers take? Inverse proportion by finding 1 first (2 marks). */
function inverseProportion(a: number, time: number, b: number, workers: [string, string], job: string): QuestionBody {
  const one = a * time, answer = one / b
  const part: NumberPart = {
    kind: 'number', prompt: `How many hours would ${b} ${workers[1]} take?`, answer, marks: 2, statements: ['31:proportion-inverse'],
    hint: `More ${workers[1]} means less time. Find 1 ${workers[0]} first: multiply.`,
    method: [{ prompt: `How long would 1 ${workers[0]} take? $${a} \\times ${time} = ?$`, answer: one }],
    chain: [
      { line: `${a} \\times ${time} = ${one}`, op: 'Find 1', why: `1 ${workers[0]} does all the work alone, so it takes ${a} times longer.` },
      { line: `${one} \\div ${b} = ${answer}`, op: `÷ ${b}`, why: `${b} ${workers[1]} share the work.` },
    ],
    mistakes: [{ answer: time * b / a, note: 'That’s direct proportion. More workers means less time: multiply to find 1, then divide.' }, { answer: one, note: `That’s 1 ${workers[0]}. Divide by ${b}.` }],
  }
  return { stem: `It takes ${a} ${workers[1]} ${time} hours to ${job}. The time is inversely proportional to the number of ${workers[1]}.`, parts: [part] }
}

export const ratioTemplates: Template[] = [
  {
    id: 'ratio-fractions', topic: 'ratio', ramp: 'recall', style: 'standard', context: 'school', calculator: false,
    inspiredBy: 'Estimate: modelled on our R1.1 worksheet (the whole is every part added); AQA 2022–25 references still to be counted',
    variants: [asFraction(4, 5, ['boys', 'girls'], 'students'), asFraction(3, 7, ['cats', 'dogs'], 'pets'), asFraction(5, 6, ['adults', 'children'], 'people')],
  },
  {
    id: 'ratio-simplifying', topic: 'ratio', ramp: 'recall', style: 'standard', context: 'home', calculator: false,
    inspiredBy: 'Estimate: modelled on our R1.2 worksheet (divide every part by the HCF); AQA 2022–25 references still to be counted',
    variants: [simplify([12, 18, 30], 'mortar'), simplify([24, 40, 56], 'paint'), simplify([36, 48], 'drink')],
  },
  {
    id: 'ratio-scaling', topic: 'ratio', ramp: 'apply', style: 'standard', context: 'food', calculator: false,
    inspiredBy: 'Estimate: modelled on our R1.3 worksheet (multiply both sides by the same number); AQA 2022–25 references still to be counted',
    variants: [scale(2, 7, 10, ['squash', 'water'], ' cups'), scale(5, 2, 300, ['flour', 'butter'], ' g'), scale(3, 8, 15, ['red paint', 'white paint'], ' ml')],
  },
  {
    id: 'ratio-part-whole', topic: 'ratio', ramp: 'multistep', style: 'standard', context: 'food', calculator: false,
    inspiredBy: 'Estimate: modelled on our R1.4 worksheet (part to whole means the whole is the second number); AQA 2022–25 references still to be counted',
    variants: [partWhole(3, 8, 40, 'sour', 'sweets'), partWhole(2, 5, 30, 'red', 'counters'), partWhole(4, 9, 36, 'green', 'marbles')],
  },
  {
    id: 'ratio-sharing', topic: 'ratio', ramp: 'apply', style: 'standard', context: 'shopping', calculator: false,
    inspiredBy: 'Estimate: modelled on our R1.5 worksheet (add the parts, find 1 part, multiply); AQA 2022–25 references still to be counted',
    variants: [share(['Ana', 'Ben', 'Cal'], [2, 3, 4], 720, 0, true), share(['Lee', 'Mo'], [5, 3], 96, 1, true), share(['Ria', 'Sam'], [2, 5], 42, 1)],
  },
  {
    id: 'ratio-difference', topic: 'ratio', ramp: 'multistep', style: 'standard', context: 'food', calculator: false,
    inspiredBy: 'Estimate: modelled on the R1.6 worksheet (the difference between two shares, not the total); AQA 2022–25 references still to be counted',
    variants: [
      difference(['Asha', 'Ben', 'Cara'], [2, 3, 7], 2, 0, 1, 35, 'some sweets'),
      difference(['Dan', 'Ella', 'Finn'], [5, 3, 1], 0, 2, 1, 28, 'some money', true),
      difference(['Gus', 'Hana', 'Ivy'], [3, 8, 6], 1, 0, 2, 40, 'some stickers'),
    ],
  },
  {
    id: 'ratio-changing', topic: 'ratio', ramp: 'stretch', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the R1.7 worksheet (call 1 part x and make the two amounts equal); AQA 2022–25 references still to be counted',
    variants: [changing(['Kai', 'Lily'], 5, 3, 4, 'stickers'), changing(['Maya', 'Nico'], 9, 5, 6, 'marbles'), changing(['Owen', 'Priya'], 8, 2, 9, 'cards')],
  },
  {
    id: 'ratio-unit-form', topic: 'ratio', ramp: 'apply', style: 'standard', context: 'home', calculator: false,
    inspiredBy: 'Estimate: modelled on the R1.8 worksheet (divide both by the first number; n can be a decimal); AQA 2022–25 references still to be counted',
    variants: [unitForm(4, 10, ['Cement', 'sand']), unitForm(2, 7, ['Squash', 'water']), unitForm(5, 30, ['Flour', 'oats'])],
  },
  {
    id: 'proportion-direct', topic: 'ratio', ramp: 'apply', style: 'standard', context: 'food', calculator: false,
    inspiredBy: 'Estimate: modelled on the R2.1 worksheet (divide to find 1, multiply to find many); AQA 2022–25 references still to be counted',
    variants: [
      directProportion(6, 9, 10, '6 notebooks cost £9.', 'Work out the cost of 10 notebooks.', 'notebook', true),
      directProportion(4, 300, 6, 'A recipe uses 300 g of sugar to make 4 cakes.', 'How many grams of sugar are needed for 6 cakes?', 'cake'),
      directProportion(5, 60, 8, 'A van travels 60 miles on 5 litres of fuel.', 'How many miles can it travel on 8 litres?', 'litre'),
    ],
  },
  {
    id: 'proportion-inverse', topic: 'ratio', ramp: 'apply', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the R2.2 worksheet (multiply to find 1, divide to find many); AQA 2022–25 references still to be counted',
    variants: [inverseProportion(3, 10, 5, ['builder', 'builders'], 'build a wall'), inverseProportion(4, 6, 8, ['cleaner', 'cleaners'], 'clean a school'), inverseProportion(6, 4, 3, ['gardener', 'gardeners'], 'plant a field')],
  },
]
