/*
 * Practice templates for negative numbers (lesson 35): adding and subtracting, two signs together, multiplying and
 * dividing, and temperature problems. Original questions in the style of AQA Foundation papers. The AQA 2022–25
 * references have not been counted for negatives yet, so `inspiredBy` says so, and the weights in aqaWeights.ts are estimates.
 */
import type { NumberPart, QuestionBody, Template } from '../types'

const n = (x: number) => (x < 0 ? `(${x})` : String(x))

/** a + b − c, one step at a time (1 mark). */
function addSubtract(a: number, b: number, c: number): QuestionBody {
  const mid = a + b, answer = mid - c
  const part: NumberPart = {
    kind: 'number', prompt: `Work out $${a} + ${b} - ${c}$`, answer, marks: 1, statements: ['35:negatives-number-line'],
    hint: 'Left to right: adding moves up the number line, subtracting moves down.',
    chain: [{ line: `${a} + ${b} = ${mid}`, op: `+ ${b}`, why: 'Move up the number line.' }, { line: `${mid} - ${c} = ${answer}`, op: `− ${c}`, why: 'Move down the number line.' }],
    mistakes: [{ answer: -answer, note: 'Check the sign: count along a number line.' }],
  }
  return { stem: '', parts: [part] }
}

/** a − (−b) and a + (−b) (1 mark each). */
function twoSigns(a: number, b: number, c: number): QuestionBody {
  const first: NumberPart = {
    kind: 'number', prompt: `Work out $${a} - (-${b})$`, answer: a + b, marks: 1, statements: ['35:negatives-two-signs'],
    hint: 'Same signs make +.', chain: [{ line: `${a} - (-${b}) = ${a} + ${b} = ${a + b}`, op: '− − is +', why: 'Two signs that are the same make +.' }],
    mistakes: [{ answer: a - b, note: 'Taking away a negative is the same as adding.' }],
  }
  const second: NumberPart = {
    kind: 'number', prompt: `Work out $${a} + (-${c})$`, answer: a - c, marks: 1, statements: ['35:negatives-two-signs'],
    hint: 'Different signs make −.', chain: [{ line: `${a} + (-${c}) = ${a} - ${c} = ${a - c}`, op: '+ − is −', why: 'Two different signs make −.' }],
    mistakes: [{ answer: a + c, note: 'Adding a negative is the same as taking away.' }],
  }
  return { stem: '', parts: [first, second] }
}

/** a × b and c ÷ d with negatives (1 mark each). */
function timesDivide(a: number, b: number, c: number, d: number): QuestionBody {
  const product: NumberPart = {
    kind: 'number', prompt: `Work out $${n(a)} \\times ${n(b)}$`, answer: a * b, marks: 1, statements: ['35:negatives-multiply-divide'],
    hint: 'Numbers first, then the sign: same signs give +, different signs give −.',
    chain: [{ line: `${n(a)} \\times ${n(b)} = ${a * b}`, op: '×', why: (a < 0) === (b < 0) ? 'Same signs: positive.' : 'Different signs: negative.' }],
    mistakes: [{ answer: -a * b, note: 'Check the sign: same signs give a positive answer, different signs a negative one.' }],
  }
  const quotient: NumberPart = {
    kind: 'number', prompt: `Work out $${n(c)} \\div ${n(d)}$`, answer: c / d, marks: 1, statements: ['35:negatives-multiply-divide'],
    hint: 'Dividing follows the same sign rules as multiplying.',
    chain: [{ line: `${n(c)} \\div ${n(d)} = ${c / d}`, op: '÷', why: (c < 0) === (d < 0) ? 'Same signs: positive.' : 'Different signs: negative.' }],
    mistakes: [{ answer: -c / d, note: 'Check the sign: same signs give a positive answer, different signs a negative one.' }],
  }
  return { stem: '', parts: [product, quotient] }
}

/** The rise between two temperatures, then a fall (1 mark each). */
function temperatures(low: number, high: number, fall: number, place: string): QuestionBody {
  const rise: NumberPart = {
    kind: 'number', prompt: 'By how many degrees did the temperature rise?', answer: high - low, marks: 1, statements: ['35:negatives-problems'], suffix: '°C',
    hint: 'Bigger take away smaller.', chain: [{ line: `${high} - (${low}) = ${high} + ${-low} = ${high - low}`, op: 'Difference', why: 'Count up to zero, then on.' }],
    mistakes: [{ answer: high + low, note: `From ${low} up to 0 is ${-low} degrees, then ${high} more.` }],
  }
  const after: NumberPart = {
    kind: 'number', prompt: `That night the temperature fell ${fall} degrees below the morning’s ${low}°C. What was it?`, answer: low - fall, marks: 1, statements: ['35:negatives-problems'], suffix: '°C',
    hint: 'Falling means moving down.', chain: [{ line: `${low} - ${fall} = ${low - fall}`, op: `− ${fall}`, why: 'Move further below zero.' }],
    mistakes: [{ answer: low + fall, note: 'It fell, so move down: further below zero.' }],
  }
  return { stem: `In ${place} the temperature was ${low}°C in the morning and ${high}°C at midday.`, parts: [rise, after] }
}

export const negativesTemplates: Template[] = [
  { id: 'negatives-add-subtract', topic: 'negatives', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: written for lesson 35; AQA 2022–25 references still to be counted',
    variants: [addSubtract(-8, 5, 4), addSubtract(-3, 7, 9), addSubtract(4, -9, 2)] },
  { id: 'negatives-two-signs', topic: 'negatives', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: written for lesson 35; AQA 2022–25 references still to be counted',
    variants: [twoSigns(6, 4, 9), twoSigns(-7, 2, 5), twoSigns(3, 8, 11)] },
  { id: 'negatives-multiply-divide', topic: 'negatives', ramp: 'apply', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: written for lesson 35; AQA 2022–25 references still to be counted',
    variants: [timesDivide(-6, 4, -20, -5), timesDivide(-7, -3, 36, -9), timesDivide(8, -5, -42, 6)] },
  { id: 'negatives-temperatures', topic: 'negatives', ramp: 'apply', style: 'standard', context: 'weather', calculator: false,
    inspiredBy: 'Estimate: written for lesson 35; AQA 2022–25 references still to be counted',
    variants: [temperatures(-4, 9, 6, 'Leeds'), temperatures(-7, 5, 3, 'Oslo'), temperatures(-2, 11, 8, 'York')] },
]
