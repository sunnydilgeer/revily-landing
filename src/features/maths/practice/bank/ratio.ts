/*
 * Practice templates for ratio: the basics (lesson 37, R1.1–R1.5) and ratio problems (lesson 30, R1.6–R1.8): a share from the difference between two parts, a ratio
 * that changes until two amounts are equal, and the form 1 : n. Original questions in the style of AQA Foundation
 * papers. The AQA 2022–25 references have not been counted for these skills yet, so `inspiredBy` says so, and the
 * weights in aqaWeights.ts are estimates.
 */
import type { FractionPart, MethodStep, NumberPart, QuestionBody, Template } from '../types'

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

/** One conversion: `amount` × or ÷ `factor` (1 or 2 marks). */
function convert(statement: string, stem: string, prompt: string, answer: number, line: string, why: string, mistakes: { answer: number; note: string }[], marks = 1, unit?: { prefix?: string; suffix?: string }, method?: MethodStep[]): QuestionBody {
  const part: NumberPart = {
    kind: 'number', prompt, answer, marks, statements: [statement], ...unit, ...(method ? { method } : {}),
    hint: 'To a smaller unit, multiply; to a bigger unit, divide. Check the size of your answer makes sense.',
    chain: [{ line, op: 'Convert', why }],
    mistakes,
  }
  return { stem, parts: [part] }
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
    id: 'bestbuy-unit', topic: 'ratio', ramp: 'apply', style: 'standard', context: 'shopping', calculator: true,
    inspiredBy: 'Estimate: modelled on our R8.1 worksheet and the R8 Best Buys Method (cost of the same amount of each); AQA 2022–25 references still to be counted',
    variants: [
      convert('39:bestbuy-unit', 'Pasta comes in $500$ g for $£1.10$ or $750$ g for $£1.80$.', 'What is the cost of $100$ g of the better-value bag, in pence?', 22, '110 \\div 5 = 22', '180 ÷ 7.5 = 24p, so the 500 g bag is better value.', [{ answer: 24, note: 'That’s the 750 g bag: 180 ÷ 7.5 = 24p. The 500 g bag is 22p.' }], 2, { suffix: 'p' }, [{ prompt: 'Cost of $100$ g in the $750$ g bag? $180 \\div 7.5 = ?$', answer: 24 }]),
      convert('39:bestbuy-unit', 'Batteries come in packs of $4$ for $£3.20$ or $10$ for $£7.50$.', 'What is the cost of $1$ battery in the better-value pack, in pence?', 75, '750 \\div 10 = 75', '320 ÷ 4 = 80p, so the pack of 10 is better value.', [{ answer: 80, note: 'That’s the pack of 4: 80p each. The pack of 10 is 75p each.' }], 2, { suffix: 'p' }, [{ prompt: 'Cost of $1$ battery in the pack of $4$? $320 \\div 4 = ?$', answer: 80 }]),
      convert('39:bestbuy-unit', 'Squash comes in $1$ litre for $£1.30$ or $1.5$ litres for $£1.80$.', 'What is the cost of $1$ litre in the better-value bottle, in pence?', 120, '180 \\div 1.5 = 120', '1 litre costs 130p in the small bottle, so the 1.5 litre bottle is better value.', [{ answer: 130, note: 'That’s the 1 litre bottle. The 1.5 litre bottle is 120p a litre.' }], 2, { suffix: 'p' }, [{ prompt: 'Cost of $1$ litre in the $1.5$ litre bottle? $180 \\div 1.5 = ?$', answer: 120 }]),
    ],
  },
  {
    id: 'bestbuy-offers', topic: 'ratio', ramp: 'recall', style: 'standard', context: 'shopping', calculator: true,
    inspiredBy: 'Estimate: modelled on our R8.2 worksheet and the R8 half-price example (cost the offer, then compare); AQA 2022–25 references still to be counted',
    variants: [
      convert('39:bestbuy-offers', 'Cans of soup cost $90$p each, on a 3 for 2 offer.', 'How much do $6$ cans cost, in pounds?', 3.6, '4 \\times 0.90 = 3.60', '3 for 2: for 6 cans you pay for 4.', [{ answer: 5.4, note: 'With 3 for 2 you pay for only 4 of the 6 cans.' }], 1, { prefix: '£' }),
      convert('39:bestbuy-offers', 'A $600$ g box of cereal has $20\\%$ extra free.', 'How many grams are in the box with the offer?', 720, '600 \\times 1.2 = 720', '20% extra: multiply by 1.2.', [{ answer: 120, note: 'That’s the extra. Add it to the 600 g.' }, { answer: 620, note: '20% of 600 g is 120 g, not 20 g.' }], 1, { suffix: 'g' }),
      convert('39:bestbuy-offers', 'T-shirts cost $£8$ each: buy one, get the second half price.', 'How much do $2$ T-shirts cost?', 12, '8 + 4 = 12', 'The second one is half of £8.', [{ answer: 16, note: 'The second T-shirt is half price: £4.' }, { answer: 4, note: 'That’s the second one. Add the first, full price.' }], 1, { prefix: '£' }),
    ],
  },
  {
    id: 'measures-density', topic: 'ratio', ramp: 'recall', style: 'standard', context: 'none', calculator: true,
    inspiredBy: 'Estimate: modelled on our R9.1 worksheet (the M over D × V triangle); AQA 2022–25 references still to be counted',
    variants: [
      convert('40:measures-density', 'A piece of wood has a mass of $180$ g and a volume of $300$ cm³.', 'Find its density in g/cm³.', 0.6, '180 \\div 300 = 0.6', 'Density = mass ÷ volume.', [{ answer: 1.6666666666666667, note: 'Mass goes on top: 180 ÷ 300.' }], 1, { suffix: 'g/cm³' }),
      convert('40:measures-density', 'Gold has a density of $19.3$ g/cm³.', 'What is the mass of $10$ cm³ of gold?', 193, '19.3 \\times 10 = 193', 'Mass = density × volume.', [{ answer: 1.93, note: 'Mass = density × volume, not ÷.' }], 1, { suffix: 'g' }),
      convert('40:measures-density', 'A rock has a mass of $500$ g and a density of $2.5$ g/cm³.', 'Find its volume.', 200, '500 \\div 2.5 = 200', 'Volume = mass ÷ density.', [{ answer: 1250, note: 'Volume = mass ÷ density, not ×.' }], 1, { suffix: 'cm³' }),
    ],
  },
  {
    id: 'measures-speed', topic: 'ratio', ramp: 'apply', style: 'standard', context: 'travel', calculator: true,
    inspiredBy: 'Estimate: modelled on our R10.1 worksheet and R10 Examples 1–3 (the D over S × T triangle, minutes into hours); AQA 2022–25 references still to be counted',
    variants: [
      convert('40:measures-speed', 'A car travels $180$ miles in $4$ hours.', 'Find its average speed.', 45, '180 \\div 4 = 45', 'Speed = distance ÷ time.', [{ answer: 720, note: 'Divide distance by time, don’t multiply.' }], 1, { suffix: 'mph' }),
      convert('40:measures-speed', 'A runner goes $6$ km at $12$ km/h.', 'How many minutes does it take?', 30, '6 \\div 12 \\times 60 = 30', 'Time = distance ÷ speed = 0.5 hours = 30 minutes.', [{ answer: 0.5, note: 'That’s in hours. Multiply by 60 for minutes.' }, { answer: 2, note: 'Time = distance ÷ speed: 6 ÷ 12.' }], 1, { suffix: 'minutes' }),
      convert('40:measures-speed', 'A bus travels at $36$ mph for $20$ minutes.', 'How far does it go?', 12, '36 \\times \\tfrac{1}{3} = 12', '20 minutes is 1/3 of an hour.', [{ answer: 720, note: 'Change 20 minutes to hours first: 1/3 of an hour.' }], 1, { suffix: 'miles' }),
    ],
  },
  {
    id: 'measures-pressure', topic: 'ratio', ramp: 'recall', style: 'standard', context: 'none', calculator: true,
    inspiredBy: 'Estimate: modelled on our R11.1 worksheet (the F over P × A triangle); AQA 2022–25 references still to be counted',
    variants: [
      convert('40:measures-pressure', 'A force of $150$ N acts on an area of $0.5$ m².', 'Find the pressure.', 300, '150 \\div 0.5 = 300', 'Pressure = force ÷ area.', [{ answer: 75, note: 'Divide force by area, don’t multiply.' }], 1, { suffix: 'N/m²' }),
      convert('40:measures-pressure', 'A pressure of $40$ N/m² acts on an area of $6$ m².', 'Find the force.', 240, '40 \\times 6 = 240', 'Force = pressure × area.', [{ answer: 6.666666666666667, note: 'Force = pressure × area, not ÷.' }], 1, { suffix: 'N' }),
      convert('40:measures-pressure', 'A force of $2$ kN gives a pressure of $500$ N/m².', 'Find the area.', 4, '2000 \\div 500 = 4', '2 kN = 2000 N, then area = force ÷ pressure.', [{ answer: 0.004, note: 'Change 2 kN to 2000 N first.' }], 1, { suffix: 'm²' }),
    ],
  },
  {
    id: 'units-metric', topic: 'ratio', ramp: 'recall', style: 'standard', context: 'food', calculator: false,
    inspiredBy: 'Estimate: modelled on our R6.1 worksheet (multiply to a smaller unit, divide to a bigger one); AQA 2022–25 references still to be counted',
    variants: [
      convert('38:units-metric', 'A bag of rice weighs $2.5$ kg.', 'How many grams is that?', 2500, '2.5 \\times 1000 = 2500', '1 kg = 1000 g, and grams are smaller.', [{ answer: 250, note: '1 kg is 1000 g, not 100.' }], 1, { suffix: 'g' }),
      convert('38:units-metric', 'A ribbon is $340$ cm long.', 'How many metres is that?', 3.4, '340 \\div 100 = 3.4', '1 m = 100 cm, and metres are bigger.', [{ answer: 34000, note: 'Metres are bigger, so divide.' }, { answer: 0.34, note: '1 m is 100 cm, not 1000.' }], 1, { suffix: 'm' }),
      convert('38:units-metric', 'A jug holds $1.75$ litres.', 'How many millilitres is that?', 1750, '1.75 \\times 1000 = 1750', '1 litre = 1000 ml.', [{ answer: 175, note: '1 litre is 1000 ml, not 100.' }], 1, { suffix: 'ml' }),
    ],
  },
  {
    id: 'units-area-volume', topic: 'ratio', ramp: 'recall', style: 'standard', context: 'home', calculator: false,
    inspiredBy: 'Estimate: modelled on our R6.2 worksheet and R6 Example 2 (square the factor for area, cube it for volume); AQA 2022–25 references still to be counted',
    variants: [
      convert('38:units-area-volume', 'A wall has an area of $6$ m².', 'What is that in cm²?', 60000, '6 \\times 100 \\times 100 = 60\\,000', '1 m² = 100 × 100 = 10 000 cm².', [{ answer: 600, note: 'For area, square the factor: 1 m² = 10 000 cm².' }], 1, { suffix: 'cm²' }),
      convert('38:units-area-volume', 'A box has a volume of $2$ m³.', 'What is that in cm³?', 2000000, '2 \\times 100^3 = 2\\,000\\,000', '1 m³ = 100 × 100 × 100 cm³.', [{ answer: 200, note: 'For volume, cube the factor: 1 m³ = 1 000 000 cm³.' }, { answer: 20000, note: 'That squares the factor. For volume, cube it.' }], 1, { suffix: 'cm³' }),
      convert('38:units-area-volume', 'A tile has an area of $9$ cm².', 'What is that in mm²?', 900, '9 \\times 10 \\times 10 = 900', '1 cm² = 10 × 10 = 100 mm².', [{ answer: 90, note: 'For area, square the factor: 1 cm² = 100 mm².' }], 1, { suffix: 'mm²' }),
    ],
  },
  {
    id: 'units-rates', topic: 'ratio', ramp: 'apply', style: 'standard', context: 'travel', calculator: true,
    inspiredBy: 'Estimate: modelled on our R6.3 worksheet and R6 Q1/Q5 (multiply from the 1, divide back); AQA 2022–25 references still to be counted',
    variants: [
      convert('38:units-rates', 'Use $1$ kg $\\approx 2.2$ pounds.', 'About how many pounds is $8$ kg?', 17.6, '8 \\times 2.2 = 17.6', 'Each kilogram is 2.2 pounds.', [{ answer: 3.6363636363636362, note: 'Kilograms to pounds: multiply by 2.2.' }]),
      convert('38:units-rates', 'The exchange rate is $£1 = 1.20$ euros.', 'How many pounds is $54$ euros?', 45, '54 \\div 1.2 = 45', 'Euros to pounds: divide by 1.20.', [{ answer: 64.8, note: 'Euros to pounds: divide, because each pound is 1.20 euros.' }], 1, { prefix: '£' }),
      convert('38:units-rates', 'Use $1$ mile $\\approx 1.6$ km.', 'About how many km is $25$ miles?', 40, '25 \\times 1.6 = 40', 'Each mile is 1.6 km.', [{ answer: 15.625, note: 'Miles to km: multiply by 1.6.' }], 1, { suffix: 'km' }),
    ],
  },
  {
    id: 'units-time', topic: 'ratio', ramp: 'recall', style: 'standard', context: 'travel', calculator: false,
    inspiredBy: 'Estimate: modelled on our R6.4 worksheet (time is in 60s); AQA 2022–25 references still to be counted',
    variants: [
      convert('38:units-time', 'A journey takes $1.5$ hours.', 'How many minutes is that?', 90, '1.5 \\times 60 = 90', '1 hour = 60 minutes.', [{ answer: 150, note: 'An hour is 60 minutes, not 100.' }], 1, { suffix: 'minutes' }),
      convert('38:units-time', 'A film lasts $135$ minutes.', 'Write this in hours as a decimal.', 2.25, '135 \\div 60 = 2.25', '60 minutes make an hour.', [{ answer: 1.35, note: 'Divide by 60, not 100.' }, { answer: 2.15, note: '15 minutes is 0.25 of an hour, not 0.15.' }], 1, { suffix: 'hours' }),
      convert('38:units-time', 'A race lasts $3$ hours $36$ minutes.', 'Write this in hours as a decimal.', 3.6, '3 + 36 \\div 60 = 3.6', '36 minutes is 36 ÷ 60 = 0.6 of an hour.', [{ answer: 3.36, note: '36 minutes is 36 ÷ 60 = 0.6 of an hour.' }], 1, { suffix: 'hours' }),
    ],
  },
  {
    id: 'units-speed', topic: 'ratio', ramp: 'multistep', style: 'standard', context: 'travel', calculator: true,
    inspiredBy: 'Estimate: modelled on our R6.5 worksheet and the R6 speed example (change each unit, then divide); AQA 2022–25 references still to be counted',
    variants: [
      convert('38:units-speed', 'A bus travels at $54$ km/h.', 'What is that in m/s?', 15, '54\\,000 \\div 3600 = 15', '54 km = 54 000 m, and an hour is 3600 s.', [{ answer: 900, note: 'An hour is 3600 seconds, not 60.' }, { answer: 0.015, note: 'Change the km to metres first.' }], 2, { suffix: 'm/s' }, [{ prompt: 'How many metres is $54$ km?', answer: 54000 }]),
      convert('38:units-speed', 'A runner goes at $5$ m/s.', 'What is that in km/h?', 18, '5 \\times 3600 \\div 1000 = 18', '× 3600 for an hour, ÷ 1000 for km.', [{ answer: 18000, note: 'That’s metres an hour. Divide by 1000 for km/h.' }, { answer: 0.3, note: 'An hour is 3600 seconds, not 60.' }], 2, { suffix: 'km/h' }, [{ prompt: 'How many metres in an hour? $5 \\times 3600 = ?$', answer: 18000 }]),
      convert('38:units-speed', 'A car travels at $90$ km/h.', 'What is that in m/s?', 25, '90\\,000 \\div 3600 = 25', '90 km = 90 000 m, and an hour is 3600 s.', [{ answer: 1500, note: 'An hour is 3600 seconds, not 60.' }], 2, { suffix: 'm/s' }, [{ prompt: 'How many metres is $90$ km?', answer: 90000 }]),
    ],
  },
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
