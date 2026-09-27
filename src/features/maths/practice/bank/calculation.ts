/*
 * Practice templates for types of number, BIDMAS, place value, written methods, decimals, factors and money
 * (lessons 1–7). Original questions in the style of AQA Foundation papers; `inspiredBy` is our audit trail.
 */
import type { ChainStep } from '../../step-chain/StepChain'
import { columnName, indexForm, lcm, gcd, money, num, pounds, primeFactors, rotate, tex, texMoney, tidy } from '../helpers'
import type { QuestionBody, Template } from '../types'

/* Types of number */

function typesList(list: number[], cube: number, multipleOf: number): QuestionBody {
  const options = list.map(String)
  const isPrime = (n: number) => n > 1 && primeFactors(n).length === 1
  const prime = list.find(isPrime)!
  const multiple = list.find(n => n % multipleOf === 0)!
  const root = Math.round(Math.cbrt(cube))
  return {
    stem: `Here is a list of numbers: ${list.join(', ')}`,
    parts: [
      {
        kind: 'choice', prompt: 'Which number in the list is a prime number?', marks: 1, statements: ['1:special-integers'],
        options, correct: list.indexOf(prime),
        hint: 'A prime number has exactly two factors: 1 and itself.',
        reason: `${prime} has exactly two factors, 1 and ${prime}. Every other number in the list can be divided by something else too.`,
      },
      {
        kind: 'choice', prompt: 'Which number in the list is a cube number?', marks: 1, statements: ['1:special-integers'],
        options, correct: list.indexOf(cube),
        hint: 'A cube number is a whole number multiplied by itself three times: 1, 8, 27, 64…',
        reason: `${cube} = ${root} × ${root} × ${root}.`,
      },
      {
        kind: 'choice', prompt: `Which number in the list is a multiple of ${multipleOf}?`, marks: 1, statements: ['1:multiples-factors'],
        options, correct: list.indexOf(multiple),
        hint: `A multiple of ${multipleOf} is in the ${multipleOf} times table.`,
        reason: `${multiple} = ${multipleOf} × ${multiple / multipleOf}, so it is in the ${multipleOf} times table.`,
      },
    ],
  }
}

function integersRational(nonInteger: string[], wrong: number, square: number, by: number): QuestionBody {
  const root = Math.sqrt(square)
  const explain = rotate([
    `No. √${square} = ${root}, which is an integer, so it is rational.`,
    'Yes. Any number with a square root sign is irrational.',
    `Yes. √${square} is a decimal that never ends.`,
  ], 0, by)
  return {
    stem: 'Numbers come in different types.',
    parts: [
      {
        kind: 'choice', prompt: 'Which of these is not an integer?', marks: 1, statements: ['1:whole-values'],
        options: nonInteger, correct: wrong,
        hint: 'Integers are whole numbers. They can be negative, and 0 is an integer too.',
        reason: `${nonInteger[wrong]} is not a whole number, so it is not an integer. Negative whole numbers and 0 are integers.`,
      },
      {
        kind: 'choice', prompt: `Priya says, “√${square} is irrational, because it has a square root sign.” Is she right?`, marks: 1,
        statements: ['1:irrational-numbers', '1:rational-numbers'], ...explain,
        hint: `Work out √${square} first. Can it be written as a fraction?`,
        reason: `√${square} = ${root}. ${root} can be written as the fraction ${root}/1, so it is rational. Only roots that are not whole numbers, like √2, are irrational.`,
      },
    ],
  }
}

/* BIDMAS */

function bidmasWorkOut(a: number, b: number, c: number, d: number, e: number, g: number): QuestionBody {
  const first = a + b * c, second = d - e * g * g
  const chainA: ChainStep[] = [
    { line: `[[a:${a}]] + [[b:${b} \\times ${c}]]` },
    { line: `= [[a:${a}]] + [[c:${b * c}]]`, op: 'Multiply first', merge: { c: ['b'] }, why: `Multiplication comes before addition in BIDMAS, so work out ${b} × ${c} = ${b * c} first.` },
    { line: `= [[d:${first}]]`, op: 'Add', merge: { d: ['a', 'c'] }, why: `Now add: ${a} + ${b * c} = ${first}.` },
  ]
  const chainB: ChainStep[] = [
    { line: `[[a:${d}]] - [[b:${e}]] \\times [[c:${g}^2]]` },
    { line: `= [[a:${d}]] - [[b:${e}]] \\times [[i:${g * g}]]`, op: 'Indices first', merge: { i: ['c'] }, why: `Indices come before multiplying: ${g}² = ${g} × ${g} = ${g * g}.` },
    { line: `= [[a:${d}]] - [[m:${e * g * g}]]`, op: 'Multiply', merge: { m: ['b', 'i'] }, why: `Multiplication comes before subtraction: ${e} × ${g * g} = ${e * g * g}.` },
    { line: `= [[r:${second}]]`, op: 'Subtract', merge: { r: ['a', 'm'] }, why: `Last, ${d} − ${e * g * g} = ${second}.` },
  ]
  return {
    stem: 'Work out the value of each calculation.',
    parts: [
      { kind: 'number', prompt: `$${a} + ${b} \\times ${c}$`, answer: first, marks: 1, statements: ['2:operation-priority'], hint: 'BIDMAS: multiply before you add.', chain: chainA },
      { kind: 'number', prompt: `$${d} - ${e} \\times ${g}^2$`, answer: second, marks: 1, statements: ['2:bidmas-ladder', '2:operation-priority'], hint: 'Indices first, then multiply, then subtract.', chain: chainB },
    ],
  }
}

function bidmasError(start: number, divisor: number, times: number): QuestionBody {
  const wrong = start / (divisor * times), right = start / divisor * times
  return {
    stem: `Sam works out $${start} \\div ${divisor} \\times ${times}$. Here is his working.`,
    parts: [
      {
        kind: 'spot', prompt: 'Tap the line where Sam goes wrong.', marks: 1, statements: ['2:equal-priority'],
        lines: [`${start} \\div ${divisor} \\times ${times}`, `= ${start} \\div ${divisor * times}`, `= ${tex(wrong)}`], wrong: 1,
        hint: '÷ and × have the same priority. Which one should come first?',
        reason: `÷ and × have equal priority, so you work from left to right: ${start} ÷ ${divisor} first. Sam did ${divisor} × ${times} first.`,
      },
      {
        kind: 'number', prompt: 'Work out the correct answer.', answer: right, marks: 1, statements: ['2:equal-priority'],
        hint: `Work left to right: ${start} ÷ ${divisor} first.`,
        chain: [
          { line: `[[a:${start} \\div ${divisor}]] [[b:\\times ${times}]]` },
          { line: `= [[c:${start / divisor}]] [[b:\\times ${times}]]`, op: 'Left to right', merge: { c: ['a'] }, why: `÷ and × have equal priority, so start on the left: ${start} ÷ ${divisor} = ${start / divisor}.` },
          { line: `= [[d:${right}]]`, op: `× ${times}`, merge: { d: ['c', 'b'] }, why: `${start / divisor} × ${times} = ${right}.` },
        ],
      },
    ],
  }
}

function fractionLine(top: [number, string, number], bottom: [number, string, number]): QuestionBody {
  const value = (a: number, op: string, b: number) => op === '+' ? a + b : op === '-' ? a - b : a * b
  const t = value(...top), b = value(...bottom)
  const texOp = (op: string) => op === '*' ? '\\times' : op
  const topTex = `${top[0]} ${texOp(top[1])} ${top[2]}`, bottomTex = `${bottom[0]} ${texOp(bottom[1])} ${bottom[2]}`
  return {
    stem: 'Work out the value of',
    parts: [{
      kind: 'number', prompt: `$\\dfrac{${topTex}}{${bottomTex}}$`, answer: t / b, marks: 1, statements: ['2:fraction-grouping'],
      hint: 'The fraction line works like brackets. Work out the top and the bottom first.',
      chain: [
        { line: `\\frac{[[a:${topTex}]]}{[[b:${bottomTex}]]}` },
        { line: `= \\frac{[[c:${t}]]}{[[d:${b}]]}`, op: 'Top and bottom first', merge: { c: ['a'], d: ['b'] }, why: 'The fraction line groups the top and the bottom, like brackets. Work each one out before you divide.' },
        { line: `= [[e:${t / b}]]`, op: 'Divide', merge: { e: ['c', 'd'] }, why: `${t} ÷ ${b} = ${t / b}.` },
      ],
    }],
  }
}

function bidmasAlgebra(coefficient: number, x: number, by: number): QuestionBody {
  const right = coefficient * x * x, wrong = (coefficient * x) ** 2
  const explain = rotate([
    `He is wrong. Square ${x} first, then multiply by ${coefficient}.`,
    `He is right. ${coefficient} × ${x} = ${coefficient * x}, and ${coefficient * x}² = ${wrong}.`,
    `He is wrong. ${coefficient}x² means ${coefficient} × 2 × x.`,
  ], 0, by)
  return {
    stem: `Ali says, “When $x = ${x}$, the value of $${coefficient}x^2$ is ${wrong}.”`,
    parts: [
      {
        kind: 'choice', prompt: 'Is Ali right? Pick the best reason.', marks: 1, statements: ['2:mixed'], ...explain,
        hint: `In ${coefficient}x², the power belongs to x only.`,
        reason: `The index only squares x. BIDMAS says indices before multiplying, so it is ${coefficient} × ${x}², not (${coefficient} × ${x})².`,
      },
      {
        kind: 'number', prompt: `Work out the value of $${coefficient}x^2$ when $x = ${x}$.`, answer: right, marks: 1, statements: ['2:mixed'],
        hint: `Square ${x} first, then multiply by ${coefficient}.`,
        chain: [
          { line: `[[k:${coefficient}]][[x:x^2]]` },
          { line: `= [[k:${coefficient}]] \\times [[s:${x}^2]]`, op: `Put in x = ${x}`, merge: { s: ['x'] }, why: `Replace x with ${x}. The number next to x means multiply.` },
          { line: `= [[k:${coefficient}]] \\times [[t:${x * x}]]`, op: 'Indices first', merge: { t: ['s'] }, why: `${x}² = ${x} × ${x} = ${x * x}. Indices come before multiplying.` },
          { line: `= [[r:${right}]]`, op: `× ${coefficient}`, merge: { r: ['k', 't'] }, why: `${coefficient} × ${x * x} = ${right}.` },
        ],
      },
    ],
  }
}

/* Place value */

function placeValue(whole: number, wholeDigit: number, decimal: string, decimalDigit: number): QuestionBody {
  const digits = String(whole), at = digits.indexOf(String(wholeDigit)), power = digits.length - 1 - at
  const wholeValue = wholeDigit * 10 ** power
  const point = decimal.indexOf('.'), dAt = decimal.indexOf(String(decimalDigit), point), dPower = point - dAt
  const decimalValue = tidy(decimalDigit * 10 ** dPower)
  const underline = (text: string, index: number) => `${text.slice(0, index)}\\underline{${text[index]}}${text.slice(index + 1)}`
  const spaced = num(whole)
  const spacedAt = [...spaced].reduce((found, ch, i) => found >= 0 ? found : ch === String(wholeDigit) ? i : -1, -1)
  return {
    stem: 'Write down the value of the digit.',
    parts: [
      {
        kind: 'number', prompt: `The ${wholeDigit} in ${spaced}`, answer: wholeValue, marks: 1, statements: ['3:digit-place-value'],
        hint: 'Count the columns from the right: ones, tens, hundreds, thousands…',
        chain: [
          { line: underline(spaced, spacedAt).replace(/\u00a0/g, '\\,') },
          { line: `${wholeDigit} \\times ${tex(10 ** power)} = ${tex(wholeValue)}`, op: `The ${columnName(power)} column`, why: `Counting from the right, the ${wholeDigit} is in the ${columnName(power)} column, so it is worth ${num(wholeValue)}.` },
        ],
      },
      {
        kind: 'number', prompt: `The ${decimalDigit} in ${decimal}`, answer: decimalValue, marks: 1, statements: ['3:decimal-places'],
        hint: 'After the decimal point the columns are tenths, hundredths, thousandths.',
        chain: [
          { line: underline(decimal, dAt) },
          { line: `${decimalDigit} \\times ${tidy(10 ** dPower)} = ${decimalValue}`, op: `The ${columnName(dPower)} column`, why: `The ${decimalDigit} is ${-dPower} place${dPower === -1 ? '' : 's'} after the point, in the ${columnName(dPower)} column, so it is worth ${decimalValue}.` },
        ],
      },
    ],
  }
}

/* Written methods */

function writtenMultiply(a: number, b: number): QuestionBody {
  const h = Math.floor(a / 100) * 100, t = Math.floor(a % 100 / 10) * 10, o = a % 10
  return {
    stem: 'Work out',
    parts: [{
      kind: 'number', prompt: `$${a} \\times ${b}$`, answer: a * b, marks: 2, statements: ['4:long-multiplication-ones', '4:long-multiplication-carrying'],
      method: [{ prompt: `Split ${a} up. What is ${h} × ${b}?`, answer: h * b }],
      hint: `Split ${a} into ${h} + ${t} + ${o} and multiply each part by ${b}.`,
      chain: [
        { line: `[[a:${a}]] \\times [[b:${b}]]` },
        { line: `= [[h:${h} \\times ${b}]] + [[t:${t} \\times ${b}]] + [[o:${o} \\times ${b}]]`, op: `Split ${a}`, merge: { h: ['a', 'b'] }, why: `Split ${a} into hundreds, tens and ones and multiply each by ${b}. The column method does the same, one column at a time.` },
        { line: `= [[H:${h * b}]] + [[T:${t * b}]] + [[O:${o * b}]]`, op: 'Multiply each', merge: { H: ['h'], T: ['t'], O: ['o'] }, why: `${h} × ${b} = ${h * b}, ${t} × ${b} = ${t * b} and ${o} × ${b} = ${o * b}.` },
        { line: `= [[r:${a * b}]]`, op: 'Add', merge: { r: ['H', 'T', 'O'] }, why: `${h * b} + ${t * b} + ${o * b} = ${a * b}. In columns, the carries do this adding for you.` },
      ],
    }],
  }
}

function bulkBuy(count: number, item: string, price: number): QuestionBody {
  const tens = Math.floor(count / 10) * 10, ones = count % 10
  return {
    stem: `A school buys ${count} ${item}. Each one costs £${price}.`,
    parts: [{
      kind: 'number', prompt: 'Work out the total cost.', answer: count * price, prefix: '£', marks: 2,
      statements: ['4:long-multiplication-layout', '4:long-multiplication-tens', '4:long-multiplication-application'],
      method: [{ prompt: `Split ${count} into ${tens} + ${ones}. What is ${tens} × ${price}?`, answer: tens * price, prefix: '£' }],
      hint: `You need ${count} × ${price}. Try ${tens} × ${price} and ${ones} × ${price}, then add.`,
      chain: [
        { line: `[[a:${count}]] \\times [[b:${price}]]` },
        { line: `= [[t:${tens} \\times ${price}]] + [[o:${ones} \\times ${price}]]`, op: `Split ${count}`, merge: { t: ['a', 'b'] }, why: `${count} lots of ${price} is ${tens} lots plus ${ones} lots. This is the grid method in one line.` },
        { line: `= [[T:${tens * price}]] + [[O:${ones * price}]]`, op: 'Multiply each', merge: { T: ['t'], O: ['o'] }, why: `${tens} × ${price} = ${tens * price} and ${ones} × ${price} = ${ones * price}.` },
        { line: `= [[r:${texMoney(count * price)}]]`, op: 'Add', merge: { r: ['T', 'O'] }, why: `${tens * price} + ${ones * price} = ${count * price}. The total cost is ${money(count * price)}.` },
      ],
    }],
  }
}

function minibuses(people: number, seats: number, group: string, vehicle: string, vehicles: string): QuestionBody {
  const full = Math.floor(people / seats), left = people - full * seats
  return {
    stem: `${people} ${group} are going on a trip. Each ${vehicle} can carry ${seats} ${group}.`,
    parts: [{
      kind: 'number', prompt: `How many ${vehicles} are needed?`,
      answer: full + 1, marks: 2, statements: ['5:long-division-remainders', '5:long-division-two-digit'],
      method: [{ prompt: `How many ${vehicles} can be completely filled?`, answer: full }],
      hint: `Work out ${people} ÷ ${seats}. What happens to the ${group} left over?`,
      chain: [
        { line: `[[a:${people}]] \\div [[b:${seats}]]` },
        { line: `= [[q:${full}]] \\text{ r } [[r:${left}]]`, op: 'Divide', merge: { q: ['a', 'b'] }, why: `${seats} × ${full} = ${seats * full}, and ${people} − ${seats * full} = ${left} left over.` },
        { line: `[[q:${full}]] + [[p:1]] = [[n:${full + 1}]]`, op: 'Round up', why: `The ${left} ${group} left over still need a seat, so you need one more ${vehicle}. Rounding down would leave people behind.` },
      ],
    }],
  }
}

/** Short division, one bus-stop step at a time. */
function busStopChain(dividend: number, divisor: number): ChainStep[] {
  const digits = String(dividend).split('').map(Number)
  const steps: ChainStep[] = [{ line: `${dividend} \\div ${divisor}` }]
  let carry = 0, started = false
  digits.forEach((digit, i) => {
    const current = carry * 10 + digit
    if (!started && current < divisor && i < digits.length - 1) { carry = current; return }
    started = true
    const q = Math.floor(current / divisor), r = current % divisor
    const next = digits[i + 1]
    steps.push({
      line: `${current} \\div ${divisor} = ${q}${r ? ` \\text{ r } ${r}` : ''}`, op: `${current} ÷ ${divisor}`,
      why: `${divisor} goes into ${current} ${q} time${q === 1 ? '' : 's'}${r ? `, with ${r} left over. Carry the ${r} onto the ${next} to make ${r}${next}` : ''}.`,
    })
    carry = r
  })
  steps.push({ line: `${dividend} \\div ${divisor} = ${dividend / divisor}`, op: 'Read the top', why: `The digits on top of the bus stop give the answer: ${dividend / divisor}.` })
  return steps
}

function busStop(dividend: number, divisor: number, by: number): QuestionBody {
  const answer = dividend / divisor
  const check = rotate([`Work out ${answer} × ${divisor}`, `Work out ${answer} ÷ ${divisor}`, `Work out ${dividend} − ${answer}`, `Work out ${dividend} × ${divisor}`], 0, by)
  return {
    stem: `Here is a division: $${dividend} \\div ${divisor}$`,
    parts: [
      { kind: 'number', prompt: 'Work it out.', answer, marks: 1, statements: ['5:long-division-layout', '5:long-division-regrouping'], hint: `Use the bus stop. Start with how many ${divisor}s go into the first digit (or first two digits).`, chain: busStopChain(dividend, divisor) },
      {
        kind: 'choice', prompt: 'How could you check your answer?', marks: 1, statements: ['5:long-division-check'], ...check,
        hint: 'Which operation undoes a division?',
        reason: `Multiplying undoes dividing. If ${dividend} ÷ ${divisor} = ${answer}, then ${answer} × ${divisor} should give ${dividend}.`,
      },
    ],
  }
}

/* Decimals and money */

function shoppingChange(count: number, item: string, pricePence: number, extra: string, extraPence: number, note: number): QuestionBody {
  const items = count * pricePence, total = items + extraPence, change = note * 100 - total
  const p = (pence: number) => pounds(pence).toFixed(2)
  return {
    stem: `Jo buys ${count} ${item} at ${money(pounds(pricePence), true)} each and ${extra} for ${money(pounds(extraPence), true)}. She pays with a £${note} note.`,
    parts: [{
      kind: 'number', prompt: 'How much change should she get?', answer: pounds(change), prefix: '£', marks: 3,
      statements: ['6:decimal-multiplication', '6:decimal-addition', '6:decimal-subtraction'],
      method: [
        { prompt: `How much do the ${count} ${item} cost?`, answer: pounds(items), prefix: '£' },
        { prompt: 'How much does she spend altogether?', answer: pounds(total), prefix: '£' },
      ],
      hint: `Find the cost of the ${item} first, add the ${extra.replace(/^an? /, '')}, then take the total away from £${note}.`,
      chain: [
        { line: `[[n:${note}]] - ([[a:${count} \\times ${p(pricePence)}]] + [[b:${p(extraPence)}]])` },
        { line: `= [[n:${note}]] - ([[c:${p(items)}]] + [[b:${p(extraPence)}]])`, op: `${count} × ${p(pricePence)}`, merge: { c: ['a'] }, why: `Multiply in pence: ${count} × ${pricePence} = ${items}p, which is ${money(pounds(items), true)}.` },
        { line: `= [[n:${note}]] - [[d:${p(total)}]]`, op: 'Add', merge: { d: ['c', 'b'] }, why: `Line up the decimal points: ${p(items)} + ${p(extraPence)} = ${p(total)}.` },
        { line: `= [[e:${p(change)}]]`, op: 'Subtract', merge: { e: ['n', 'd'] }, why: `${note}.00 − ${p(total)} = ${p(change)}. Jo gets ${money(pounds(change), true)} change.` },
      ],
    }],
  }
}

function decimalDivide(total: number, piece: number, stem: string, unitWord: string): QuestionBody {
  const scale = String(piece).split('.')[1].length === 1 ? 10 : 100
  const a = tidy(total * scale), b = tidy(piece * scale)
  return {
    stem,
    parts: [{
      kind: 'number', prompt: `How many ${unitWord} can be made?`, answer: a / b, marks: 1, statements: ['6:decimal-division'],
      hint: `Work out ${total} ÷ ${piece}. Multiply both numbers by ${scale} first.`,
      chain: [
        { line: `[[a:${total}]] \\div [[b:${piece}]]` },
        { line: `= [[c:${a}]] \\div [[d:${b}]]`, op: `× ${scale} both`, merge: { c: ['a'], d: ['b'] }, why: `Multiplying both numbers by ${scale} keeps the answer the same and makes the number you divide by a whole number.` },
        { line: `= [[e:${a / b}]]`, op: 'Divide', merge: { e: ['c', 'd'] }, why: `${a} ÷ ${b} = ${a / b}.` },
      ],
    }],
  }
}

function decimalError(a: string, b: string): QuestionBody {
  const places = a.split('.')[1].length + b.split('.')[1].length
  const whole = Number(a.replace('.', '')) * Number(b.replace('.', ''))
  const right = tidy(whole / 10 ** places), wrong = tidy(whole / 10 ** (places - 1))
  return {
    stem: `Kim works out $${a} \\times ${b}$. Here is her working.`,
    parts: [
      {
        kind: 'spot', prompt: 'Tap the line where Kim goes wrong.', marks: 1, statements: ['6:decimal-multiplication'],
        lines: [`${a} \\times ${b}`, `= ${Number(a.replace('.', ''))} \\times ${Number(b.replace('.', ''))} \\div ${10 ** (places - 1)}`, `= ${whole} \\div ${10 ** (places - 1)}`, `= ${wrong}`], wrong: 1,
        hint: 'Count the decimal places in the question. How many are there altogether?',
        reason: `There are ${places} decimal places in the question altogether, so she needs to divide by ${10 ** places}, not ${10 ** (places - 1)}.`,
      },
      {
        kind: 'number', prompt: `Work out $${a} \\times ${b}$ correctly.`, answer: right, marks: 1, statements: ['6:decimal-multiplication'],
        hint: `Multiply without the decimal points, then put back ${places} decimal places.`,
        chain: [
          { line: `[[a:${a}]] \\times [[b:${b}]]` },
          { line: `= [[w:${Number(a.replace('.', ''))} \\times ${Number(b.replace('.', ''))}]] [[d:\\div ${10 ** places}]]`, op: 'Take out the points', merge: { w: ['a', 'b'] }, why: `There are ${places} decimal places in the question, so multiply the whole numbers and divide by ${10 ** places} at the end.` },
          { line: `= [[x:${whole}]] [[d:\\div ${10 ** places}]]`, op: 'Multiply', merge: { x: ['w'] }, why: `${Number(a.replace('.', ''))} × ${Number(b.replace('.', ''))} = ${whole}.` },
          { line: `= [[r:${right}]]`, op: `÷ ${10 ** places}`, merge: { r: ['x', 'd'] }, why: `Putting back ${places} decimal places gives ${right}. The answer is smaller than both numbers, which makes sense when you multiply two numbers less than 1.` },
        ],
      },
    ],
  }
}

function showTickets(adult: number, child: number, adults: number, children: number, limit: number): QuestionBody {
  const a = adults * Math.round(adult * 100), c = children * Math.round(child * 100), total = a + c
  const under = total < limit * 100
  const p = (pence: number) => pounds(pence).toFixed(2)
  return {
    stem: `Adult tickets for a show cost ${money(adult, true)}. Child tickets cost ${money(child, true)}. Show that ${adults} adult tickets and ${children} child tickets cost ${under ? 'less' : 'more'} than £${limit}.`,
    parts: [
      { kind: 'number', prompt: `Cost of the ${adults} adult tickets`, answer: pounds(a), prefix: '£', marks: 1, statements: ['6:decimal-multiplication'], hint: `${adults} × ${money(adult, true)}. Work in pence if it helps.`, chain: [{ line: `${adults} \\times ${p(Math.round(adult * 100))}` }, { line: `= ${p(a)}`, op: 'Multiply', why: `${adults} × ${Math.round(adult * 100)}p = ${a}p = ${money(pounds(a), true)}.` }] },
      { kind: 'number', prompt: `Cost of the ${children} child tickets`, answer: pounds(c), prefix: '£', marks: 1, statements: ['6:decimal-multiplication', '4:long-multiplication-application'], hint: `${children} × ${money(child, true)}.`, chain: [{ line: `${children} \\times ${p(Math.round(child * 100))}` }, { line: `= ${p(c)}`, op: 'Multiply', why: `${children} × ${Math.round(child * 100)}p = ${c}p = ${money(pounds(c), true)}.` }] },
      {
        kind: 'number', prompt: 'Total cost', answer: pounds(total), prefix: '£', marks: 1, statements: ['6:decimal-addition'], hint: 'Add your two answers, lining up the decimal points.',
        chain: [
          { line: `[[a:${p(a)}]] + [[c:${p(c)}]]` },
          { line: `= [[t:${p(total)}]]`, op: 'Add', merge: { t: ['a', 'c'] }, why: `Line up the points: ${p(a)} + ${p(c)} = ${p(total)}.` },
          { line: `[[t:${p(total)}]] ${under ? '<' : '>'} ${limit}`, op: 'Compare', why: `${money(pounds(total), true)} is ${under ? 'less' : 'more'} than £${limit}. A show-that answer ends by saying so, with the numbers.` },
        ],
      },
    ],
  }
}

/* Factors and multiples */

function primeProduct(n: number, distractors: string[], by: number): QuestionBody {
  const factors = primeFactors(n)
  const right = `$${indexForm(factors)}$`
  const choice = rotate([right, ...distractors.map(d => `$${d}$`)], 0, by)
  const chain: ChainStep[] = [{ line: `${n}` }]
  let rest = n, done: number[] = []
  for (const p of factors.slice(0, -1)) {
    rest /= p
    done = [...done, p]
    chain.push({ line: `= ${done.join(' \\times ')} \\times ${rest}`, op: `÷ ${p}`, why: `${p} is prime and goes into ${rest * p}: ${rest * p} = ${p} × ${rest}.` })
  }
  chain.push({ line: `= ${indexForm(factors)}`, op: 'Index form', why: `Every factor is now prime. Repeated primes are written with a power: ${factors.join(' × ')} = ${n}.` })
  return {
    stem: `Write ${n} as a product of its prime factors.`,
    parts: [{
      kind: 'choice', prompt: 'Which one is right?', marks: 1, statements: ['7:prime-factorisation'], ...choice,
      hint: 'Every number in a product of prime factors has to be prime.',
      reason: `Every number in the answer must be prime. In the others, at least one number (like ${distractors[0].match(/\d+/g)!.find(d => primeFactors(Number(d)).length > 1)}) is not prime.`,
      chain,
    }],
  }
}

function multiples(value: number, upTo: number) {
  return Array.from({ length: upTo / value }, (_, i) => (i + 1) * value).join(', ')
}

function lights(a: number, b: number): QuestionBody {
  const answer = lcm(a, b)
  return {
    stem: `Two lights flash at the same moment. The red light flashes every ${a} seconds. The green light flashes every ${b} seconds.`,
    parts: [{
      kind: 'number', prompt: 'After how many seconds will they next flash at the same time?', answer, suffix: ' seconds', marks: 2, statements: ['7:hcf-lcm-listing'],
      hint: `List the multiples of ${a} and of ${b}. Look for the first number in both lists.`,
      chain: [
        { line: `\\text{Red: } ${multiples(a, answer)}` },
        { line: `\\text{Green: } ${multiples(b, answer)}`, op: `Multiples of ${b}`, why: `The red light flashes at every multiple of ${a}, the green at every multiple of ${b}.` },
        { line: `\\text{LCM} = ${answer}`, op: 'First in both', why: `${answer} is the first number in both lists: the lowest common multiple. They flash together after ${answer} seconds.` },
      ],
    }],
  }
}

function partyBags(a: number, itemA: string, b: number, itemB: string): QuestionBody {
  const answer = gcd(a, b)
  const factors = (n: number) => Array.from({ length: n }, (_, i) => i + 1).filter(d => n % d === 0).join(', ')
  return {
    stem: `Ella has ${a} ${itemA} and ${b} ${itemB}. She puts them all into party bags. Every bag must have the same number of ${itemA} and the same number of ${itemB}, with nothing left over.`,
    parts: [{
      kind: 'number', prompt: 'What is the greatest number of party bags she can make?', answer, marks: 2, statements: ['7:hcf-lcm-listing'],
      hint: `The number of bags must be a factor of ${a} and of ${b}. Which is the biggest one they share?`,
      chain: [
        { line: `\\text{Factors of ${a}: } ${factors(a)}` },
        { line: `\\text{Factors of ${b}: } ${factors(b)}`, op: `Factors of ${b}`, why: `The ${itemA} split equally only if the number of bags is a factor of ${a}. The same goes for ${b}.` },
        { line: `\\text{HCF} = ${answer}`, op: 'Biggest in both', why: `${answer} is the highest common factor: ${answer} bags, each with ${a / answer} ${itemA} and ${b / answer} ${itemB}.` },
      ],
    }],
  }
}

function vennHcf(a: number, b: number): QuestionBody {
  const fa = primeFactors(a), fb = primeFactors(b)
  const both: number[] = [], rightOnly = [...fb], leftOnly: number[] = []
  for (const p of fa) {
    const at = rightOnly.indexOf(p)
    if (at >= 0) { both.push(p); rightOnly.splice(at, 1) } else leftOnly.push(p)
  }
  const hcf = both.reduce((x, y) => x * y, 1), all = [...leftOnly, ...both, ...rightOnly]
  return {
    stem: `The Venn diagram shows the prime factors of ${a} and ${b}.`,
    diagram: { kind: 'venn', left: String(a), right: String(b), onlyLeft: leftOnly, both, onlyRight: rightOnly },
    parts: [
      {
        kind: 'number', prompt: `Work out the highest common factor (HCF) of ${a} and ${b}.`, answer: hcf, marks: 1, statements: ['7:hcf-lcm-venn'],
        hint: 'The HCF is made of the prime factors both numbers share: the middle of the Venn diagram.',
        chain: [{ line: `\\text{HCF} = ${both.join(' \\times ')}` }, { line: `= ${hcf}`, op: 'Multiply the middle', why: `The overlap holds the primes ${a} and ${b} share. Multiply them: ${both.join(' × ')} = ${hcf}.` }],
      },
      {
        kind: 'number', prompt: `Work out the lowest common multiple (LCM) of ${a} and ${b}.`, answer: lcm(a, b), marks: 1, statements: ['7:hcf-lcm-venn'],
        hint: 'The LCM uses every number in the diagram, each one once.',
        chain: [{ line: `\\text{LCM} = ${all.join(' \\times ')}` }, { line: `= ${lcm(a, b)}`, op: 'Multiply everything', why: `The LCM needs every prime in the diagram once: ${all.join(' × ')} = ${lcm(a, b)}.` }],
      },
    ],
  }
}

export const calculationTemplates: Template[] = [
  {
    id: 'number-types-list', topic: 'number-types', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Q1–3 style: "Here is a list of numbers… write down a prime / cube / multiple"',
    variants: [typesList([8, 15, 19, 21, 24, 49], 8, 6), typesList([12, 23, 25, 27, 33, 35], 27, 4), typesList([16, 21, 29, 39, 45, 64], 64, 9)],
  },
  {
    id: 'integers-rational', topic: 'number-types', ramp: 'recall', style: 'explain', context: 'none', calculator: false,
    inspiredBy: 'Explain-why questions about types of number, with a student’s claim to judge',
    variants: [
      integersRational(['−8', '0', '6.5', '15'], 2, 16, 0),
      integersRational(['−3', '2.5', '0', '20'], 1, 49, 1),
      integersRational(['7', '−12', '100', '0.4'], 3, 36, 2),
    ],
  },
  {
    id: 'bidmas-work-out', topic: 'bidmas', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Q1–5 style: "Work out 3 + 4 × 5", one mark each',
    variants: [bidmasWorkOut(3, 4, 5, 20, 2, 3), bidmasWorkOut(6, 2, 7, 60, 3, 4), bidmasWorkOut(9, 5, 3, 70, 2, 5)],
  },
  {
    id: 'bidmas-error', topic: 'bidmas', ramp: 'apply', style: 'errorSpot', context: 'none', calculator: false,
    inspiredBy: 'Error-spotting: a student’s working for an order-of-operations calculation',
    variants: [bidmasError(24, 4, 2), bidmasError(36, 6, 3), bidmasError(40, 5, 2)],
  },
  {
    id: 'bidmas-fraction-line', topic: 'bidmas', ramp: 'apply', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Non-calculator "Work out (a + b) / (c − d)"',
    variants: [fractionLine([18, '+', 6], [10, '-', 2]), fractionLine([35, '-', 7], [2, '+', 5]), fractionLine([6, '*', 9], [20, '-', 11])],
  },
  {
    id: 'bidmas-algebra', topic: 'bidmas', ramp: 'apply', style: 'explain', context: 'none', calculator: false,
    inspiredBy: 'Substitution with a power, and a student’s claim to check',
    variants: [bidmasAlgebra(3, 4, 0), bidmasAlgebra(3, 5, 1), bidmasAlgebra(2, 6, 2)],
  },
  {
    id: 'place-value-digit', topic: 'place-value', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Q1 style: "Write down the value of the 7 in…"',
    variants: [placeValue(4706285, 7, '3.529', 2), placeValue(2381604, 8, '16.047', 4), placeValue(9052317, 5, '0.638', 3)],
  },
  {
    id: 'written-multiply', topic: 'written-methods', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Non-calculator "Work out 468 × 7"',
    variants: [writtenMultiply(468, 7), writtenMultiply(537, 8), writtenMultiply(649, 6)],
  },
  {
    id: 'bulk-buy', topic: 'money', ramp: 'apply', style: 'standard', context: 'school', calculator: false,
    inspiredBy: 'Non-calculator money: a number of items at a whole-pound price',
    variants: [bulkBuy(34, 'calculators', 17), bulkBuy(26, 'revision guides', 19), bulkBuy(43, 'football shirts', 15)],
  },
  {
    id: 'minibuses', topic: 'written-methods', ramp: 'apply', style: 'standard', context: 'travel', calculator: false,
    inspiredBy: 'Division with a remainder in context: how many vehicles/boxes are needed',
    variants: [minibuses(150, 16, 'students', 'minibus', 'minibuses'), minibuses(200, 24, 'fans', 'coach', 'coaches'), minibuses(175, 12, 'players', 'van', 'vans')],
  },
  {
    id: 'bus-stop', topic: 'written-methods', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Non-calculator "Work out 952 ÷ 7", then checking by the inverse',
    variants: [busStop(952, 7, 0), busStop(738, 6, 1), busStop(784, 8, 2)],
  },
  {
    id: 'shopping-change', topic: 'money', ramp: 'multistep', style: 'standard', context: 'shopping', calculator: false,
    inspiredBy: 'Money multi-step: several items, pay with a note, find the change (3 marks)',
    variants: [
      shoppingChange(3, 'notebooks', 245, 'a pen', 180, 10),
      shoppingChange(4, 'cans of drink', 135, 'a sandwich', 260, 10),
      shoppingChange(2, 'hot chocolates', 375, 'a muffin', 145, 10),
    ],
  },
  {
    id: 'decimal-divide', topic: 'decimals', ramp: 'apply', style: 'standard', context: 'home', calculator: false,
    inspiredBy: 'Non-calculator division by a decimal, in context',
    variants: [
      decimalDivide(4.5, 0.25, 'A ribbon is 4.5 m long. It is cut into pieces that are each 0.25 m long.', 'pieces'),
      decimalDivide(7.2, 0.3, 'A jug holds 7.2 litres of juice. Each glass holds 0.3 litres.', 'full glasses'),
      decimalDivide(6, 0.4, 'A baker has 6 kg of flour. She packs it into bags of 0.4 kg.', 'bags'),
    ],
  },
  {
    id: 'decimal-error', topic: 'decimals', ramp: 'apply', style: 'errorSpot', context: 'none', calculator: false,
    inspiredBy: 'Error-spotting: a decimal multiplication with the point in the wrong place',
    variants: [decimalError('0.4', '0.3'), decimalError('0.7', '0.4'), decimalError('0.5', '0.06')],
  },
  {
    id: 'show-tickets', topic: 'money', ramp: 'multistep', style: 'showThat', context: 'events', calculator: false,
    inspiredBy: 'Show-that with money: prove a total is under (or over) a budget',
    variants: [showTickets(12.5, 7.25, 2, 3, 50), showTickets(9.75, 6.4, 2, 4, 45), showTickets(15.2, 8.6, 3, 2, 65)],
  },
  {
    id: 'prime-product', topic: 'factors', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: '"Write 84 as a product of its prime factors"',
    variants: [
      primeProduct(84, ['2^2 \\times 21', '4 \\times 3 \\times 7', '2 \\times 42'], 0),
      primeProduct(90, ['9 \\times 10', '2 \\times 45', '2 \\times 3 \\times 15'], 1),
      primeProduct(72, ['8 \\times 9', '2^3 \\times 9', '2 \\times 36'], 2),
    ],
  },
  {
    id: 'lights-lcm', topic: 'factors', ramp: 'apply', style: 'standard', context: 'events', calculator: false,
    inspiredBy: 'LCM in context: two things that repeat, when do they coincide again',
    variants: [lights(6, 8), lights(4, 10), lights(9, 12)],
  },
  {
    id: 'party-bags-hcf', topic: 'factors', ramp: 'apply', style: 'standard', context: 'events', calculator: false,
    inspiredBy: 'HCF in context: share two kinds of item equally with none left over',
    variants: [partyBags(24, 'sweets', 36, 'stickers'), partyBags(18, 'balloons', 30, 'badges'), partyBags(28, 'pencils', 42, 'rubbers')],
  },
  {
    id: 'venn-hcf-lcm', topic: 'factors', ramp: 'stretch', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Prime factors in a Venn diagram, then HCF and LCM',
    variants: [vennHcf(60, 84), vennHcf(36, 120), vennHcf(45, 75)],
  },
]
