import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { MethodStep, SquaresFrame, TermsFrame, TilesFrame, WorkingLine } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseKnown, diagnosePower, diagnoseTerms, pow, type Law } from './indicesDiagnosis'

const { add, finish } = author(16)
const powerOne = 'indices-power-one'
const multiply = 'indices-multiply'
const divide = 'indices-divide'
const powerZero = 'indices-power-zero'
const oneLaw = 'indices-one'
const powerOfPower = 'indices-power-of-power'
const fractionLaw = 'indices-fraction'
const roots = 'roots'
const text = (...lines: string[]) => ({ kind: 'text' as const, lines })
/** LaTeX for a power, for the step's equation (checked by verify:step-chains). */
const tp = (base: string | number, power: number | string) => `${base}^{${power}}`
const tex = (value: string) => value.replace(/⁴√(\d+)/g, '\\sqrt[4]{$1}').replace(/∛(\d+)/g, '\\sqrt[3]{$1}').replace(/√(\d+)/g, '\\sqrt{$1}').replace(/¾/g, '\\tfrac{3}{4}').replace(/−/g, '-').replace(/×/g, '\\times ').replace(/÷/g, '\\div ')
  .replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, run => `^{${[...run].map(c => c === '⁻' ? '-' : String('⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(c))).join('')}}`)

/* ---------- Answers ---------- */

/** "Write … as a single power": a base box and a raised power box. */
const powerAnswer = (base: string | number, power: number): InteractionDefinition => ({
  type: 'numericInput', responseShape: 'power', acceptanceRule: 'power', correctAnswer: `${base}^${power}`, displayAnswer: pow(base, power),
})
const number = (answer: number): InteractionDefinition => ({ type: 'numericInput', correctAnswer: answer, displayAnswer: String(answer), acceptanceRule: 'normalisedNumber' })
const fraction = (answer: string, mixed = false): InteractionDefinition => ({
  type: 'fractionInput', correctAnswer: answer, displayAnswer: answer, acceptanceRule: 'rational', responseShape: mixed ? 'mixedNumber' : 'fraction', requireMixedForm: mixed || undefined,
})
/** Algebra in any order, with the xⁿ key for powers. */
const expression = (answer: string): InteractionDefinition => ({
  type: 'numericInput', responseShape: 'expression', acceptanceRule: 'collectedExpression', anyPower: true, correctAnswer: answer, displayAnswer: answer,
})
/** A choice whose right answer is written first; each wrong option says why it’s wrong. Options are shuffled when shown. */
const choose = (right: string, ...wrong: [string, string][]): InteractionDefinition => ({
  type: 'select', correctAnswer: '0',
  options: [{ id: '0', label: right }, ...wrong.map(([label, feedback], i) => ({ id: String(i + 1), label, feedback }))],
})
/** "Now work out its value": the right power, typed where a number was wanted. */
const asPower = (base: string | number, power: number, value: number | string): [string, string][] => [[`${base}^${power}`, `That’s right as a power. Now work out its value: ${pow(base, power)} = ${value}.`], [pow(base, power), `That’s right as a power. Now work out its value: ${pow(base, power)} = ${value}.`]]

/* ---------- Working: pictures first, one step at a time (src/features/EXPLANATIONS.md) ---------- */

type Step = { title: string; math: string; say: string; tiles?: TilesFrame; squares?: SquaresFrame; terms?: TermsFrame; sums?: WorkingLine[]; answer?: string }

function lines(question: string, ...list: Step[]): TutorWorking {
  const steps: MethodStep[] = list.map(step => ({
    title: step.title, operation: tex(question), equation: step.math, instruction: step.say,
    frame: { sums: step.sums, tiles: step.tiles, squares: step.squares, terms: step.terms, ordering: step.answer ? { answer: step.answer } : undefined },
  }))
  return { kind: 'method-worked', examples: [{ method: 'ordering', expression: tex(question), label: 'Powers', first: 0, second: 0, steps, pictureOnly: true }] }
}

const copies = (base: string | number, n: number) => Array.from({ length: n }, () => String(base))

/** base^a × base^b: both powers written out as copies, then counted. */
function multiplyModel(base: string | number, a: number, b: number, answer = pow(base, a + b)): TutorWorking {
  const tiles: TilesFrame = { rows: [{ groups: [{ tiles: copies(base, a), family: 0 }, { tiles: copies(base, b), family: 1 }] }] }
  const count: WorkingLine = { parts: `${a} + ${b}`, total: `${a + b} copies`, family: 2 }
  return lines(`${pow(base, a)} × ${pow(base, b)}`,
    { title: 'Write out the copies', math: `${tp(base, a)}\\times${tp(base, b)}`, say: `The power says how many ${base}s are multiplied together. Each colour is one of the powers.`, tiles },
    { title: 'Count them', math: `${a}+${b}=${a + b}`, say: 'All the tiles are the same base, so count them all. That’s adding the powers.', tiles, sums: [count] },
    { title: 'The answer', math: tp(base, a + b), say: 'The base stays the same. Only the power changes.', answer },
  )
}

/** base^a ÷ base^b as a fraction of copies; matching pairs cancel. `value` adds a step that works the power out. */
function divideModel(base: string | number, a: number, b: number, value?: { parts: string; total: number }): TutorWorking {
  const tiles = (crossed?: number): TilesFrame => ({ over: true, rows: [{ groups: [{ tiles: copies(base, a), family: 0, crossed }] }, { groups: [{ tiles: copies(base, b), family: 1, crossed }] }] })
  const left = a - b
  const count: WorkingLine = { parts: `${a} − ${b}`, total: left > 0 ? `${left} left on top` : `${-left} left on the bottom`, family: 2 }
  const steps: Step[] = [
    { title: 'Write it as a fraction', math: `\\frac{${tp(base, a)}}{${tp(base, b)}}`, say: `Dividing is a fraction: the copies of ${base} on top, over the copies on the bottom.`, tiles: tiles() },
    { title: 'Cancel matching pairs', math: `${a}-${b}=${left}`, say: `Each ${base} on top cancels with a ${base} on the bottom, because ${base} ÷ ${base} is 1. That’s subtracting the powers.`, tiles: tiles(Math.min(a, b)), sums: [count] },
  ]
  if (value) {
    steps.push({ title: 'Work it out', math: `${tp(base, left)}=${value.total}`, say: 'Multiply the copies that are left.', sums: [count, { parts: value.parts, total: String(value.total), family: 0 }] })
    steps.push({ title: 'The answer', math: String(value.total), say: 'That’s the value.', answer: `${pow(base, left)} = ${value.total}` })
  } else steps.push({ title: 'The answer', math: tp(base, left), say: left < 0 ? 'Copies left on the bottom make the power negative.' : 'The base stays the same. Only the power changes.', answer: pow(base, left) })
  return lines(`${pow(base, a)} ÷ ${pow(base, b)}`, ...steps)
}

/** (base^a)^b: the inside power written out b times. */
function powerModel(base: string | number, a: number, b: number, value?: { parts: string; total: number }): TutorWorking {
  const tiles: TilesFrame = { rows: [{ groups: Array.from({ length: b }, (_, i) => ({ tiles: copies(base, a), family: i })) }] }
  const count: WorkingLine = { parts: `${b} lots of ${a}`, total: `${a * b} copies`, family: 2 }
  const steps: Step[] = [
    { title: 'Write out the copies', math: `(${tp(base, a)})^{${b}}`, say: `The outside power says how many times to write ${pow(base, a)}. Each colour is one of them.`, tiles },
    { title: 'Count them', math: `${a}\\times${b}=${a * b}`, say: 'Every group has the same number of tiles, so count the groups times the tiles in each. That’s multiplying the powers.', tiles, sums: [count] },
  ]
  if (value) {
    steps.push({ title: 'Work it out', math: `${tp(base, a * b)}=${value.total}`, say: 'Multiply all the copies.', sums: [count, { parts: value.parts, total: String(value.total), family: 0 }] })
    steps.push({ title: 'The answer', math: String(value.total), say: 'That’s the value.', answer: String(value.total) })
  } else steps.push({ title: 'The answer', math: tp(base, a * b), say: 'The base stays the same. Only the power changes.', answer: pow(base, a * b) })
  return lines(`(${pow(base, a)})${pow('', b)}`, ...steps)
}

/** One term split into its parts: "7p³q" → 7, p³, q. */
function parts(term: string) {
  const match = term.match(/^(\d*)(.*)$/)!
  return { number: match[1] || '1', letters: [...match[2].matchAll(/([a-z])([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*)/g)].map(([whole, letter]) => ({ letter, whole })) }
}
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
const powerOf = (whole: string) => whole.length === 1 ? 1 : Number(whole.slice(1).replace('⁻', '-').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, c => String(SUP.indexOf(c))))

/** 5a⁴ × 3a² or 20x⁶y⁵ ÷ 4x²y: sort the numbers and each letter, then work each one out on its own line. */
function termsModel(first: string, second: string, law: 'multiply' | 'divide', answer: string): TutorWorking {
  const x = parts(first), y = parts(second)
  const letters = [...new Set([...x.letters, ...y.letters].map(part => part.letter))]
  const family = (letter: string) => [0, 2, 3][letters.indexOf(letter)]
  const chips = (p: ReturnType<typeof parts>) => [...(p.number !== '1' ? [{ text: p.number, family: 1 }] : []), ...p.letters.map(part => ({ text: part.whole, family: family(part.letter) }))]
  const op = law === 'multiply' ? '×' : '÷'
  const terms: TermsFrame = { terms: [...chips(x), { text: op, family: 0, op: true }, ...chips(y)] }
  const numberLine: WorkingLine = { parts: `${x.number} ${op} ${y.number}`, total: String(law === 'multiply' ? Number(x.number) * Number(y.number) : Number(x.number) / Number(y.number)), family: 1 }
  const sums: WorkingLine[] = [numberLine]
  const steps: Step[] = [
    { title: 'Sort the parts', math: tex(`${first} ${op} ${second}`), say: 'Numbers go with numbers, and each letter goes with the same letter.', terms },
    { title: 'The numbers', math: `${x.number}${law === 'multiply' ? '\\times ' : '\\div '}${y.number}=${numberLine.total}`, say: `${law === 'multiply' ? 'Multiply' : 'Divide'} the numbers as usual.`, terms, sums: [...sums] },
  ]
  for (const letter of letters) {
    const a = x.letters.find(part => part.letter === letter), b = y.letters.find(part => part.letter === letter)
    const pa = a ? powerOf(a.whole) : 0, pb = b ? powerOf(b.whole) : 0
    const result = law === 'multiply' ? pa + pb : pa - pb
    const total = result === 1 ? letter : pow(letter, result)
    const line: WorkingLine = a && b ? { parts: `${a.whole} ${op} ${b.whole}`, total, family: family(letter) } : { parts: (a ?? b)!.whole, total, family: family(letter) }
    sums.push(line)
    const lone = (a && a.whole.length === 1) || (b && b.whole.length === 1)
    const say = !(a && b) ? `Nothing to ${law === 'multiply' ? 'multiply' : 'divide'} ${letter} by, so it stays as it is.`
      : `${lone ? `On its own, ${letter} means ${letter}¹. ` : ''}Same letter, so ${law === 'multiply' ? 'add' : 'subtract'} the powers.${result < 0 || pa < 0 || pb < 0 ? ' Keep each minus sign with its power.' : ''}`
    steps.push({ title: `Powers of ${letter}`, math: `${tp(letter, pa)}${law === 'multiply' ? '\\times ' : '\\div '}${tp(letter, pb)}=${tp(letter, result)}`, say, terms, sums: [...sums] })
  }
  steps.push({ title: 'The answer', math: tex(answer), say: 'Write the number, then the letters.', answer })
  return lines(`${first} ${op} ${second}`, ...steps)
}

/** Working that is only lines, built up one step at a time, then the answer. */
function built(question: string, ...list: { title: string; math: string; say: string; line?: WorkingLine; answer?: string }[]): TutorWorking {
  const sums: WorkingLine[] = []
  return lines(question, ...list.map(step => {
    if (step.line) sums.push(step.line)
    return { title: step.title, math: step.math, say: step.say, sums: step.line ? [...sums] : undefined, answer: step.answer }
  }))
}
const line = (parts: string, total: string, family = 0): WorkingLine => ({ parts, total, family })

/** (n/d)²: a d-by-d square with n-by-n shaded. */
function squareFraction(n: number, d: number, answer: string, story?: string): TutorWorking {
  const squares: SquaresFrame = { rows: d, cols: d, shaded: [n, n], label: `A square split into ${d} by ${d} small squares, with ${n} by ${n} of them shaded: ${n * n} out of ${d * d}.` }
  return lines(`(${n}/${d})²`,
    { title: 'Square the top and the bottom', math: `\\left(\\frac{${n}}{${d}}\\right)^{2}=\\frac{${n}^{2}}{${d}^{2}}`, say: `${story ? `${story} ` : ''}Squaring the fraction squares the top and the bottom.`, squares, sums: [line(`${n} × ${n}`, `${n * n} shaded`, 1), line(`${d} × ${d}`, `${d * d} squares`, 0)] },
    { title: 'The answer', math: `\\frac{${n * n}}{${d * d}}`, say: 'Shaded squares over all the squares.', answer },
  )
}

/** √(n²): an n-by-n square of small squares; its side is the root. */
function squareRoot(n: number, answer: string, story = ''): TutorWorking {
  const squares: SquaresFrame = { rows: n, cols: n, shaded: [n, n], side: `${n} along each side`, label: `A square of ${n * n} small squares, ${n} along each side.` }
  return lines(`√${n * n}`,
    { title: 'Find the side', math: `${n}\\times${n}=${n * n}`, say: `${story}A square root asks: which number times itself makes ${n * n}? That’s the side of the square.`, squares, sums: [line(`${n} × ${n}`, String(n * n), 1)] },
    { title: 'The answer', math: `\\sqrt{${n * n}}=${n}`, say: 'The side of the square is the square root.', answer },
  )
}

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
function practice(topic: MicroSkillId, title: string, sourceRef: string, interaction: InteractionDefinition, hint: string, model: TutorWorking, diagnose?: (response: string) => string | null, unit?: string) {
  const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  const state = add(topic, title, sourceRef, text(title), interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  if (diagnose) state.diagnose = diagnose
  if (unit) state.answerLabel = unit
  return state
}
const known = (pairs: [string, string][]) => (response: string) => diagnoseKnown(response, pairs)
function worked(topic: MicroSkillId, title: string, sourceRef: string, model: TutorWorking, body: string, heading?: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  // When the tiles show the expression itself, the heading doesn't repeat it.
  if (heading) state.content.heading = heading
  return state
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }
const media = (name: string, title: string, durationSeconds: number, sourceFile: string, textAlternative: string[]) => ({
  id: `lesson16-${name}`, src: `/media/lesson-16/${name}.mp4`, poster: `/media/lesson-16/${name}.svg`, title, durationSeconds, sourceFile, textAlternative,
})

/** "Write … as a single power of …", with the powers written out as copies when they fit. */
function singlePower(topic: MicroSkillId, sourceRef: string, title: string, base: string | number, law: Law, a: number, b: number, hint: string) {
  const answer = law === 'multiply' ? a + b : law === 'divide' ? a - b : a * b
  const model = law === 'multiply' ? multiplyModel(base, a, b) : law === 'divide' ? divideModel(base, a, b) : powerModel(base, a, b)
  return practice(topic, title, sourceRef, powerAnswer(base, answer), hint, model, response => diagnosePower(response, base, law, a, b))
}
/** "Simplify 5a⁴ × 3a²": numbers and each letter worked out separately. */
function simplifyTerms(topic: MicroSkillId, sourceRef: string, first: string, second: string, law: 'multiply' | 'divide', answer: string, hint: string, title = `Simplify ${first} ${law === 'multiply' ? '×' : '÷'} ${second}.`, unit?: string) {
  return practice(topic, title, sourceRef, expression(answer), hint, termsModel(first, second, law, answer), response => diagnoseTerms(response, first, second, law), unit)
}

/* ---------- Rung 1: power 1 (A2.5) ---------- */

const ladder = (base: number, from: number) => Array.from({ length: from }, (_, i) => from - i).map(power => line(pow(base, power), copies(base, power).join(' × '), power === 1 ? 1 : 0))
const powerOneVideo = worked(powerOne, 'Work out 7¹.', 'A2.5 video', built('7¹',
  { title: 'Three copies', math: '7^{3}=7\\times7\\times7', say: 'The power says how many copies of 7 are multiplied together.', line: ladder(7, 3)[0] },
  { title: 'Two copies', math: '7^{2}=7\\times7', say: 'One power down, one copy fewer.', line: ladder(7, 3)[1] },
  { title: 'One copy', math: '7^{1}=7', say: 'A power of 1 is just one copy, with nothing to multiply it by.', line: ladder(7, 3)[2] },
  { title: 'The answer', math: '7^{1}=7', say: 'Any number to the power 1 is itself.', answer: '7¹ = 7' },
), 'The power tells you how many copies of the number are multiplied together.')
video(powerOneVideo, media('power-one', 'Working out 7¹', 54, 'A2.5_The_Power_One_Law.mp4', [
  '7³ = 7 × 7 × 7: the power tells us how many copies of 7 to multiply. Three copies.',
  '7² = 7 × 7 is two copies of 7, and 7¹ = 7 is just one copy.',
  'One copy of 7, with nothing to multiply it by, is just 7. So 7¹ = 7.',
  'One pack holds 7 pencils: just 7¹ pack, counted once, is 7 pencils.',
]))
const one = (question: string, value: number) => built(question,
  { title: 'One copy', math: `${tex(question)}=${value}`, say: 'A power of 1 means one copy of the number, with nothing to multiply it by.', line: line(question, String(value), 1) },
  { title: 'The answer', math: String(value), say: 'Any number to the power 1 is itself.', answer: String(value) },
)
const notOne = (value: number): [string, string] => ['1', `A power of 1 doesn’t turn the number into 1. It means one copy of ${value}, so it’s just ${value}.`]
practice(powerOne, 'A shop sells pens in packs of 12. One pack is written as 12¹. Work out 12¹.', 'A2.5 Q1', number(12), 'How many copies of 12 does the power 1 ask for?', one('12¹', 12), known([notOne(12), ['0', 'A power of 1 means one copy of 12, so 12¹ is just 12.']]))
practice(powerOne, 'Work out 25¹.', 'A2.5 Q2', number(25), 'Any number to the power 1 is itself.', one('25¹', 25), known([notOne(25), ['26', 'A power of 1 isn’t adding 1. It means one copy of 25, so 25¹ = 25.']]))
practice(powerOne, 'Work out 6¹ + 4¹.', 'A2.5 Q3', number(10), 'Work out each power first, then add.', built('6¹ + 4¹',
  { title: 'Each power of 1', math: '6^{1}=6,\\ 4^{1}=4', say: 'Each number to the power 1 is just itself.', line: line('6¹ and 4¹', '6 and 4', 1) },
  { title: 'Add them', math: '6+4=10', say: 'Now it’s an ordinary sum.', line: line('6 + 4', '10', 0) },
  { title: 'The answer', math: '10', say: 'That’s the value.', answer: '10' },
), known([['2', 'A power of 1 doesn’t make each number 1. 6¹ = 6 and 4¹ = 4, so the sum is 6 + 4.'], ['24', '6¹ + 4¹ is an addition: 6 + 4 = 10.'], ['10^1', 'That’s right as a power, but work it out: 6 + 4 = 10.']]))
practice(powerOne, 'Simplify 3x¹ + 2x.', 'A2.5 Q4a', expression('5x'), 'x¹ is just x. Then collect the like terms.', built('3x¹ + 2x',
  { title: 'x¹ is just x', math: '3x^{1}=3x', say: 'A power of 1 leaves the letter as it is.', line: line('3x¹', '3x', 1) },
  { title: 'Collect like terms', math: '3x+2x=5x', say: 'Both are x terms now, so add the numbers in front.', line: line('3x + 2x', '5x', 0) },
  { title: 'The answer', math: '5x', say: 'Adding like terms doesn’t change the power.', answer: '5x' },
), known([['5x^2', '3x¹ is just 3x, and 3x + 2x are like terms. Adding like terms only changes the number in front: 5x, not 5x².'], ['5x²', '3x¹ is just 3x, and 3x + 2x are like terms. Adding like terms only changes the number in front: 5x, not 5x².'], ['6x', 'Add the numbers in front: 3 + 2 = 5, so 5x.'], ['3x+2x', 'x¹ is just x, so 3x and 2x are like terms. Collect them into one term.']]))
practice(powerOne, 'Jay says 9¹ = 1, because the power is 1. Is Jay correct?', 'A2.5 Q4b', choose(
  'No. 9¹ is one copy of 9, so 9¹ = 9',
  ['Yes. Any number to the power 1 is 1', 'That’s the rule for 1 to any power. A power of 1 leaves the number as it is: 9¹ = 9.'],
  ['No. 9¹ = 0', 'A power of 1 means one copy of 9, so 9¹ = 9. It isn’t 0.'],
), 'How many copies of 9 does the power 1 ask for?', one('9¹', 9))
practice(powerOne, 'Work out 4¹ × 4¹.', 'A2.5 Q5a', number(16), 'Remove each power of 1 first, then multiply.', built('4¹ × 4¹',
  { title: 'Each power of 1', math: '4^{1}=4', say: 'Each 4¹ is just 4.', line: line('4¹ and 4¹', '4 and 4', 1) },
  { title: 'Multiply', math: '4\\times4=16', say: 'It’s a multiplication, so multiply.', line: line('4 × 4', '16', 0) },
  { title: 'The answer', math: '16', say: 'That’s the value.', answer: '16' },
), known([['8', '4¹ × 4¹ = 4 × 4. Multiply, don’t add: 16.'], ['4', 'Each 4¹ is 4, and there are two of them: 4 × 4 = 16.'], ...asPower(4, 2, 16)]))
practice(powerOne, 'Write x as a power of x, in the form xⁿ.', 'A2.5 Q5b', powerAnswer('x', 1), 'A single x is one copy of x.', built('x',
  { title: 'One copy of x', math: 'x=x^{1}', say: 'A single x is one copy of x, and one copy is the power 1.', line: line('x', 'x¹', 1) },
  { title: 'The answer', math: 'x^{1}', say: 'On its own, x means x¹.', answer: 'x¹' },
), known([['x^0', 'x⁰ is 1, not x. A single x is one copy of x: x¹.'], ['x^2', 'x² is x × x, two copies. A single x is one copy: x¹.']]))
practice(powerOne, 'Ana says 3¹ × 3¹ = 3¹. Is Ana correct?', 'A2.5 Q5c', choose(
  'No. 3¹ × 3¹ = 3 × 3 = 9, but 3¹ = 3',
  ['Yes. Multiplying powers of 1 keeps the power 1', '3¹ × 3¹ = 3 × 3 = 9, which is 3², not 3¹. When you multiply, add the powers: 1 + 1 = 2.'],
  ['No. 3¹ × 3¹ = 6', '3¹ is 3, and 3 × 3 = 9. Multiply, don’t add.'],
), 'Work out each side on its own.', built('3¹ × 3¹ = 3¹',
  { title: 'The left side', math: '3^{1}\\times3^{1}=3\\times3=9', say: 'Each 3¹ is 3, then multiply.', line: line('3¹ × 3¹', '9', 0) },
  { title: 'The right side', math: '3^{1}=3', say: 'A power of 1 is the number itself.', line: line('3¹', '3', 1) },
  { title: 'The answer', math: '9\\ne3', say: 'The two sides aren’t equal, so Ana is wrong.', answer: 'No. 9 is not 3' },
))

/* ---------- Rung 2: multiplying powers (A2.1) ---------- */

const multiplyVideo = worked(multiply, 'Write 3⁴ × 3⁵ as a single power of 3.', 'A2.1 video', multiplyModel(3, 4, 5), 'Two powers with the same base, multiplied together.')
video(multiplyVideo, media('multiplication', 'Writing 3⁴ × 3⁵ as a single power', 53, 'A2.1_The_Multiplication_Law.mp4', [
  '3⁴ × 3⁵: two powers with the same base, multiplied together.',
  'The first power is four 3s. The second is five 3s.',
  'Count every 3: four plus five is nine. We add the powers: 3⁴⁺⁵ = 3⁹.',
  'A warehouse holds 10² boxes and each box holds 10³ pencils: 10² × 10³ = 10⁵, which is 100 000 pencils.',
]))
singlePower(multiply, 'A2.1 Q1', 'A warehouse holds 10³ boxes. Each box contains 10⁴ pencils. Write the total number of pencils as a single power of 10.', 10, 'multiply', 3, 4, 'Total = boxes × pencils in each box. Same base, so add the powers.')
singlePower(multiply, 'A2.1 Q2', 'Write 6² × 6⁵ as a single power of 6.', 6, 'multiply', 2, 5, 'Same base, so add the powers.')
simplifyTerms(multiply, 'A2.1 Q3', '5a⁴', '3a²', 'multiply', '15a⁶', 'Area = length × width. Multiply the numbers, then add the powers of a.', 'A rectangular garden has length 5a⁴ metres and width 3a² metres. Find an expression for the area of the garden, in its simplest form.', 'Area (m²)')
simplifyTerms(multiply, 'A2.1 Q4a', '7p³q', '2p⁴q²', 'multiply', '14p⁷q³', 'Multiply the numbers. Then add the powers of each letter: q on its own means q¹.')
practice(multiply, 'Bea says 3⁴ × 3² = 9⁶. Is Bea correct?', 'A2.1 Q4b', choose(
  'No. The base stays as 3, so it is 3⁶',
  ['Yes. Multiply the 3s and add the powers', 'The base doesn’t change. 3⁴ × 3² is six 3s multiplied together, which is 3⁶.'],
  ['No. It is 3⁸', 'Multiplying powers of the same base adds the powers: 4 + 2 = 6, so 3⁶.'],
  ['No. It is 9⁸', 'The base stays as 3, and the powers are added, not multiplied: 3⁶.'],
), 'Write out the copies: how many 3s are there, and are they still 3s?', multiplyModel(3, 4, 2))
simplifyTerms(multiply, 'A2.1 Q5a', '3x⁻²', '4x⁵', 'multiply', '12x³', 'Multiply the numbers. Add the powers, keeping the minus sign: −2 + 5.')
practice(multiply, 'Work out the value of 2⁻³ × 2⁵.', 'A2.1 Q5b', number(4), 'Add the powers first, keeping the minus sign. Then work out the power.', built('2⁻³ × 2⁵',
  { title: 'Add the powers', math: '2^{-3}\\times2^{5}=2^{-3+5}=2^{2}', say: 'Same base, so add the powers. Keep the minus sign with the 3.', line: line('−3 + 5', '2', 2) },
  { title: 'Work it out', math: '2^{2}=4', say: 'Two copies of 2 multiplied together.', line: line('2 × 2', '4', 0) },
  { title: 'The answer', math: '4', say: 'That’s the value.', answer: '2² = 4' },
), known([...asPower(2, 2, 4), ['256', 'Keep the minus: −3 + 5 = 2, not 3 + 5. So it’s 2² = 4.'], ['2^8', 'Keep the minus: −3 + 5 = 2, not 3 + 5. So it’s 2² = 4.'], ['1/4', 'Add the powers: −3 + 5 = 2, which is positive. 2² = 4.'], ['-4', '2² = 2 × 2 = 4. The power is positive: −3 + 5 = 2.']]))

/* ---------- Rung 3: dividing powers (A2.2) ---------- */

const divideVideo = worked(divide, 'Work out 3⁷ ÷ 3⁴.', 'A2.2 video', divideModel(3, 7, 4, { parts: '3 × 3 × 3', total: 27 }), 'One power divided by another with the same base.')
video(divideVideo, media('division', 'Working out 3⁷ ÷ 3⁴', 55, 'A2.2_The_Division_Law.mp4', [
  '3⁷ ÷ 3⁴: one power divided by another with the same base.',
  'Write both as a fraction, then cancel matching 3s: 7 − 4 = 3 threes are left.',
  'We subtract the powers: 3⁷⁻⁴ = 3³ = 3 × 3 × 3 = 27.',
  'A tank holds 2⁸ litres and a bucket holds 2³ litres: 2⁸ ÷ 2³ = 2⁵, which is 32 bucketfuls.',
]))
singlePower(divide, 'A2.2 Q1', 'A tank holds 2⁹ litres of water. Each bucket holds 2³ litres. Write the number of buckets needed to empty the tank as a single power of 2.', 2, 'divide', 9, 3, 'Buckets = water in the tank ÷ water in one bucket. Same base, so subtract the powers.')
singlePower(divide, 'A2.2 Q2', 'Write k⁸ ÷ k³ as a single power of k.', 'k', 'divide', 8, 3, 'Same base, so subtract the powers.')
practice(divide, 'Work out the value of 5⁸ ÷ 5⁵.', 'A2.2 Q3', number(125), 'Subtract the powers, then work out the power that’s left.', divideModel(5, 8, 5, { parts: '5 × 5 × 5', total: 125 }), known([...asPower(5, 3, 125), ['15', '5³ means 5 × 5 × 5 = 125, not 5 × 3.'], ['5^13', 'Dividing subtracts the powers: 8 − 5 = 3. Then 5³ = 125.'], ['1', 'The base stays as 5: 5⁸ ÷ 5⁵ = 5³ = 125.']]))
simplifyTerms(divide, 'A2.2 Q4a', '20x⁶y⁵', '4x²y', 'divide', '5x⁴y⁴', 'Divide the numbers. Then subtract the powers of each letter: y on its own means y¹.')
practice(divide, 'Tom says 4⁷ ÷ 4² = 1⁵, because 4 ÷ 4 = 1. Is Tom correct?', 'A2.2 Q4b', choose(
  'No. The base stays as 4, so it is 4⁵',
  ['Yes. Divide the bases and subtract the powers', 'The base isn’t divided. The matching 4s cancel, and five 4s are left: 4⁵.'],
  ['No. It is 4⁹', 'Dividing subtracts the powers: 7 − 2 = 5, so 4⁵.'],
), 'Write it as a fraction of 4s. What’s left after the matching 4s cancel?', divideModel(4, 7, 2))
practice(divide, 'Write 7⁶ ÷ 7⁹ as a single power of 7.', 'A2.2 Q5a', powerAnswer(7, -3), 'Subtract the powers. The bottom power is bigger, so the answer is negative.', divideModel(7, 6, 9), response => diagnosePower(response, 7, 'divide', 6, 9))
practice(divide, 'Which working shows that 10⁹ ÷ 10⁴ = 100 000?', 'A2.2 Q5b', choose(
  '10⁹ ÷ 10⁴ = 10⁵, and 10⁵ = 100 000',
  ['10⁹ ÷ 10⁴ = 10¹³ = 100 000', 'Dividing subtracts the powers: 9 − 4 = 5, not 9 + 4.'],
  ['10⁹ ÷ 10⁴ = 1⁵ = 100 000', 'The base stays as 10: 10⁹ ÷ 10⁴ = 10⁵. And 1⁵ is only 1.'],
  ['10⁹ ÷ 10⁴ = 10⁵ = 50', '10⁵ means five 10s multiplied together, 100 000. It isn’t 10 × 5.'],
), 'Subtract the powers. Then 10⁵ is a 1 followed by five zeros.', divideModel(10, 9, 4, { parts: '10 × 10 × 10 × 10 × 10', total: 100000 }))
simplifyTerms(divide, 'A2.2 Q5c', '24a⁵b', '8a⁹', 'divide', '3a⁻⁴b', 'Divide the numbers. Subtract the powers of a (the answer is negative). b has no partner, so it stays.')

/* ---------- Rung 4: power 0 (A2.4) ---------- */

const downLine = (base: number, power: number) => line(pow(base, power), power === 3 ? String(base ** 3) : `${base ** (power + 1)} ÷ ${base} = ${base ** power}`, power === 0 ? 1 : 0)
const powerZeroVideo = worked(powerZero, 'Work out 3⁰.', 'A2.4 video', built('3⁰',
  { title: 'Start with 3³', math: '3^{3}=27', say: 'Start from a power you know.', line: downLine(3, 3) },
  { title: 'Go down a power', math: '3^{2}=27\\div3=9', say: 'Each step down the powers divides by 3.', line: downLine(3, 2) },
  { title: 'Down again', math: '3^{1}=9\\div3=3', say: 'Divide by 3 again.', line: downLine(3, 1) },
  { title: 'One more step', math: '3^{0}=3\\div3=1', say: 'One more step down, so divide by 3 once more.', line: downLine(3, 0) },
  { title: 'The answer', math: '3^{0}=1', say: 'Any number (except 0) to the power 0 is 1.', answer: '3⁰ = 1' },
), 'Follow the pattern down the powers of 3.')
video(powerZeroVideo, media('power-zero', 'Working out 3⁰', 53.6, 'A2.4_The_Power_Zero_Law.mp4', [
  'What does a power of zero mean? Start with a pattern of powers of 3: 3³ = 27.',
  'Go down one power and divide by 3: 3² = 9. Down again: 3¹ = 3.',
  'One more step down, so divide by 3 once more: 3⁰ = 3 ÷ 3 = 1.',
  'One bacterium starts a dish and the number doubles each hour. After 0 hours there are 2⁰ = 1 bacteria: just the one you started with.',
]))
const zero = (question: string, base: number | string, extra: { title: string; math: string; say: string; line: WorkingLine }[] = [], answer = '1') => built(question,
  { title: 'Power 0', math: `${tp(base, 0)}=1`, say: 'Any number (except 0) to the power 0 is 1.', line: line(pow(base, 0), '1', 1) },
  ...extra,
  { title: 'The answer', math: answer, say: extra.length ? 'That’s the value.' : 'The power 0 always gives 1.', answer },
)
const notZero = (base: number | string): [string, string] => ['0', `${pow(base, 0)} is 1, not 0. Any number (except 0) to the power 0 is 1.`]
practice(powerZero, 'One bacterium doubles every hour. After n hours there are 2ⁿ bacteria. Work out 2⁰, the number of bacteria at the start (n = 0).', 'A2.4 Q1', number(1), 'Go down the pattern: 2³ = 8, 2² = 4, 2¹ = 2. Each step divides by 2.', built('2⁰',
  { title: 'Start with 2³', math: '2^{3}=8', say: 'Start from a power you know.', line: line('2³', '8') },
  { title: 'Go down the powers', math: '2^{2}=4,\\ 2^{1}=2', say: 'Each step down divides by 2.', line: line('2² and 2¹', '4 and 2') },
  { title: 'One more step', math: '2^{0}=2\\div2=1', say: 'One more step down, so divide by 2 again.', line: line('2⁰', '2 ÷ 2 = 1', 1) },
  { title: 'The answer', math: '2^{0}=1', say: 'At the start there is just the one bacterium.', answer: '2⁰ = 1' },
), known([notZero(2), ['2', '2 is 2¹, after one hour. Go one more step down the pattern: 2 ÷ 2 = 1.']]))
practice(powerZero, 'Work out 9⁰.', 'A2.4 Q2', number(1), 'Any number (except 0) to the power 0 is 1.', zero('9⁰', 9), known([notZero(9), ['9', '9 is 9¹. The power 0 gives 1: 9⁰ = 1.']]))
practice(powerZero, 'Work out 12⁰ + 7⁰.', 'A2.4 Q3', number(2), 'Work out each power first, then add.', built('12⁰ + 7⁰',
  { title: 'Each power 0', math: '12^{0}=1,\\ 7^{0}=1', say: 'Each number to the power 0 is 1.', line: line('12⁰ and 7⁰', '1 and 1', 1) },
  { title: 'Add them', math: '1+1=2', say: 'Now it’s an ordinary sum.', line: line('1 + 1', '2') },
  { title: 'The answer', math: '2', say: 'That’s the value.', answer: '2' },
), known([['0', 'Each power 0 gives 1, not 0: 1 + 1 = 2.'], ['19', 'The powers 0 turn each number into 1: 12⁰ = 1 and 7⁰ = 1, so 1 + 1 = 2.'], ['1', 'There are two powers of 0, and each is 1: 1 + 1 = 2.']]))
practice(powerZero, 'Work out 4 × 9⁰.', 'A2.4 Q4a', number(4), 'Work out the power first, then multiply.', zero('4 × 9⁰', 9, [{ title: 'Now multiply', math: '4\\times1=4', say: 'Powers come before multiplying.', line: line('4 × 1', '4') }], '4'), known([['0', '9⁰ is 1, not 0, so 4 × 9⁰ = 4 × 1 = 4.'], ['36', 'Work out the power first: 9⁰ = 1, so 4 × 1 = 4.'], ['1', 'The power 0 belongs to the 9 only. 4 × 1 = 4.']]))
practice(powerZero, 'Ria says 5⁰ = 0, because there are no fives. Is Ria correct?', 'A2.4 Q4b', choose(
  'No. Any number (except 0) to the power 0 is 1, so 5⁰ = 1',
  ['Yes. No fives multiplied together makes 0', 'Go down the pattern: 5² = 25, 5¹ = 5, 5⁰ = 5 ÷ 5 = 1. It’s 1, not 0.'],
  ['No. 5⁰ = 5', '5 is 5¹. One more step down divides by 5: 5⁰ = 1.'],
), 'Go down the pattern: 5² = 25, 5¹ = 5, then divide by 5 again.', zero('5⁰', 5))
practice(powerZero, 'Work out (7 + 2)⁰.', 'A2.4 Q5a', number(1), 'Work out the bracket first, then the power 0.', built('(7 + 2)⁰',
  { title: 'The bracket first', math: '7+2=9', say: 'Brackets come first, then the power.', line: line('7 + 2', '9') },
  { title: 'Now the power 0', math: '9^{0}=1', say: 'Any number (except 0) to the power 0 is 1.', line: line('9⁰', '1', 1) },
  { title: 'The answer', math: '1', say: 'That’s the value.', answer: '1' },
), known([['9', 'Don’t forget the power: (7 + 2)⁰ = 9⁰ = 1.'], ['2', 'The power 0 is on the whole bracket, so work out 7 + 2 = 9 first. 9⁰ = 1.'], ['0', '9⁰ is 1, not 0.']]))
practice(powerZero, 'a is a number that is not zero. Write down the value of 2a⁰.', 'A2.4 Q5b', number(2), 'The power 0 belongs to a only, not to the 2.', zero('2a⁰', 'a', [{ title: 'Now the 2', math: '2\\times1=2', say: '2a⁰ means 2 × a⁰. The 2 has no power.', line: line('2 × 1', '2') }], '2'), known([['1', 'The power 0 belongs to a only: 2a⁰ = 2 × 1 = 2.'], ['0', 'a⁰ is 1, not 0: 2a⁰ = 2 × 1 = 2.'], ['2a', 'a⁰ is 1, so 2a⁰ = 2 × 1 = 2.']]))
practice(powerZero, 'Sam says 4⁰ × 4⁰ = 4⁰. Is Sam correct?', 'A2.4 Q5c', choose(
  'Yes. Both sides equal 1',
  ['No. 4⁰ × 4⁰ = 2', 'Each 4⁰ is 1, and 1 × 1 = 1, not 1 + 1. Both sides are 1.'],
  ['No. The left side is 0', '4⁰ is 1, not 0. The left side is 1 × 1 = 1, and so is the right.'],
), 'Work out each side on its own.', built('4⁰ × 4⁰ = 4⁰',
  { title: 'The left side', math: '4^{0}\\times4^{0}=1\\times1=1', say: 'Each 4⁰ is 1.', line: line('4⁰ × 4⁰', '1 × 1 = 1', 1) },
  { title: 'The right side', math: '4^{0}=1', say: 'The power 0 gives 1.', line: line('4⁰', '1', 1) },
  { title: 'The answer', math: '1=1', say: 'Both sides are equal, so Sam is right.', answer: 'Yes. Both sides equal 1' },
))

/* ---------- Rung 5: 1 to any power (A2.6) ---------- */

const oneVideo = worked(oneLaw, 'Work out 1¹⁰⁰.', 'A2.6 video', built('1¹⁰⁰',
  { title: 'Start small', math: '1^{2}=1\\times1=1', say: 'Multiplying by 1 changes nothing.', line: line('1²', '1 × 1 = 1') },
  { title: 'More copies', math: '1^{5}=1', say: 'Five copies of 1 multiplied together are still 1.', line: line('1⁵', '1 × 1 × 1 × 1 × 1 = 1') },
  { title: 'A hundred copies', math: '1^{100}=1', say: 'However many copies of 1 you multiply, the answer stays 1.', line: line('1¹⁰⁰', '1 × 1 × … × 1 = 1', 1) },
  { title: 'The answer', math: '1^{100}=1', say: '1 to any power is 1.', answer: '1¹⁰⁰ = 1' },
), '1 multiplied by itself, again and again.')
video(oneVideo, media('one-law', 'Working out 1¹⁰⁰', 55.5, 'A2.6_The_One_Law.mp4', [
  '1 squared is 1 × 1. Multiplying by 1 changes nothing, so 1² = 1.',
  'Five copies of 1 multiplied together is still 1: 1⁵ = 1.',
  'Even a hundred copies of 1 multiplied together is still 1: 1¹⁰⁰ = 1.',
  'A cube has edges 1 cm long. Its volume is 1³ = 1 × 1 × 1 = 1 cubic centimetre.',
]))
const ones = (question: string, extra?: { title: string; math: string; say: string; line: WorkingLine }, answer = '1') => built(question,
  { title: '1 to any power', math: '1^{n}=1', say: 'Multiplying 1 by itself any number of times is still 1.', line: line(question.replace(/^\d+ × /, ''), '1', 1) },
  ...(extra ? [extra] : []),
  { title: 'The answer', math: answer, say: 'That’s the value.', answer },
)
practice(oneLaw, 'A cube has edges 1 cm long, so its volume is 1³ cm³. Work out 1³.', 'A2.6 Q1', number(1), '1³ means 1 × 1 × 1.', ones('1³'), known([['3', '1³ means 1 × 1 × 1 = 1, not 1 × 3.'], ['0', '1 × 1 × 1 = 1.']]), 'Volume (cm³)')
practice(oneLaw, 'Work out 1⁷.', 'A2.6 Q2', number(1), '1 to any power is 1.', ones('1⁷'), known([['7', '1⁷ means seven 1s multiplied together: 1 × 1 × … × 1 = 1.']]))
practice(oneLaw, 'Work out 1⁵ + 1²⁰.', 'A2.6 Q3', number(2), 'Work out each power first, then add.', built('1⁵ + 1²⁰',
  { title: '1 to any power', math: '1^{5}=1,\\ 1^{20}=1', say: '1 to any power is 1.', line: line('1⁵ and 1²⁰', '1 and 1', 1) },
  { title: 'Add them', math: '1+1=2', say: 'Now it’s an ordinary sum.', line: line('1 + 1', '2') },
  { title: 'The answer', math: '2', say: 'That’s the value.', answer: '2' },
), known([['25', '1⁵ and 1²⁰ are both 1, whatever the power: 1 + 1 = 2.'], ['1', 'There are two terms, each equal to 1: 1 + 1 = 2.'], ['1^25', 'This is an addition, not a multiplication, so the powers don’t add. Each term is 1: 1 + 1 = 2.']]))
practice(oneLaw, 'Work out 6 × 1¹⁰⁰.', 'A2.6 Q4a', number(6), 'Work out the power first. 1 to any power is 1.', ones('6 × 1¹⁰⁰', { title: 'Now multiply', math: '6\\times1=6', say: 'Powers come before multiplying.', line: line('6 × 1', '6') }, '6'), known([['600', '1¹⁰⁰ is 1, not 100. So 6 × 1 = 6.'], ['1', 'The power belongs to the 1 only. 6 × 1 = 6.'], ['100', '1¹⁰⁰ = 1, and 6 × 1 = 6.']]))
practice(oneLaw, 'Chris says 1⁹⁹ = 99. Is Chris correct?', 'A2.6 Q4b', choose(
  'No. 1 multiplied by itself any number of times is 1, so 1⁹⁹ = 1',
  ['Yes. The power tells you the answer', 'The power says how many 1s to multiply, not the answer. 1 × 1 × … × 1 = 1.'],
  ['No. 1⁹⁹ = 0', '1 × 1 = 1 however many times you do it, so 1⁹⁹ = 1.'],
), 'Write out a few: 1² = 1 × 1, 1³ = 1 × 1 × 1…', ones('1⁹⁹'))
practice(oneLaw, 'Work out 1⁰ + 1⁻⁵.', 'A2.6 Q5a', number(2), '1 to any power is 1, even a power of 0 or a negative power.', built('1⁰ + 1⁻⁵',
  { title: '1 to any power', math: '1^{0}=1,\\ 1^{-5}=1', say: 'This works for a power of 0 and for negative powers too.', line: line('1⁰ and 1⁻⁵', '1 and 1', 1) },
  { title: 'Add them', math: '1+1=2', say: 'Now it’s an ordinary sum.', line: line('1 + 1', '2') },
  { title: 'The answer', math: '2', say: 'That’s the value.', answer: '2' },
), known([['-4', '1⁻⁵ is 1, not −5. 1 to any power is 1, so 1 + 1 = 2.'], ['1', '1⁰ is 1 as well: 1 + 1 = 2.'], ['-5', '1⁰ = 1 and 1⁻⁵ = 1, so 1 + 1 = 2.'], ['0', 'Each term is 1: 1 + 1 = 2.']]))
practice(oneLaw, 'Is 1ⁿ always equal to 1, whatever the value of n?', 'A2.6 Q5b', choose(
  'Yes. Multiplying 1 by itself any number of times can’t change it',
  ['No. 1ⁿ = n', 'n is how many 1s are multiplied, not the answer. 1 × 1 × … × 1 = 1.'],
  ['No. 1⁰ = 0', 'Any number (except 0) to the power 0 is 1, so 1⁰ = 1 as well.'],
), 'Think about 1 × 1 × 1 × …', ones('1ⁿ'))
practice(oneLaw, 'Work out 1⁹ × 1¹⁵ × 1⁻⁶.', 'A2.6 Q5c', number(1), 'Each factor is 1 to a power.', built('1⁹ × 1¹⁵ × 1⁻⁶',
  { title: 'Each factor', math: '1^{9}=1^{15}=1^{-6}=1', say: '1 to any power is 1, even a negative power.', line: line('1⁹, 1¹⁵ and 1⁻⁶', '1, 1 and 1', 1) },
  { title: 'Multiply them', math: '1\\times1\\times1=1', say: 'Multiplying by 1 changes nothing.', line: line('1 × 1 × 1', '1') },
  { title: 'The answer', math: '1', say: 'That’s the value.', answer: '1' },
), known([['18', 'Adding the powers gives 1¹⁸, but that’s still 1. 1 to any power is 1.'], ['1^18', 'That’s right as a power. Now work it out: 1 to any power is 1.'], ['0', 'Each factor is 1: 1 × 1 × 1 = 1.'], ['3', 'Multiply, don’t add: 1 × 1 × 1 = 1.']]))

/* ---------- Rung 6: power of a power (A2.3) ---------- */

const powerVideo = worked(powerOfPower, 'Write (5²)³ as a single power of 5.', 'A2.3 video', powerModel(5, 2, 3), 'A power raised to another power.')
video(powerVideo, media('multiple-powers', 'Writing (5²)³ as a single power', 53, 'A2.3_Multiple_Powers_Law.mp4', [
  '(5²)³: a power raised to another power.',
  'The outside power 3 says: write 5 squared three times, (5 × 5) × (5 × 5) × (5 × 5).',
  'Count every 5: three groups of two is six. We multiply the powers: 5²ˣ³ = 5⁶.',
  'A cube has an edge of 2² cm, so its volume is (2²)³ = 2⁶ cm³: 64 small cubes.',
]))
singlePower(powerOfPower, 'A2.3 Q1', 'A cube has side length 3² cm, so its volume is (3²)³ cm³. Write (3²)³ as a single power of 3.', 3, 'power', 2, 3, 'A power of a power: multiply the two powers.')
singlePower(powerOfPower, 'A2.3 Q2', 'Write (5⁴)² as a single power of 5.', 5, 'power', 4, 2, 'Multiply the powers.')
practice(powerOfPower, 'Work out the value of (2³)².', 'A2.3 Q3', number(64), 'Multiply the powers, then work out the power.', powerModel(2, 3, 2, { parts: '2 × 2 × 2 × 2 × 2 × 2', total: 64 }), known([...asPower(2, 6, 64), ['12', '2⁶ means six 2s multiplied together: 64, not 2 × 6.'], ['32', 'That’s 2⁵: the powers were added. For a power of a power, multiply: 3 × 2 = 6, and 2⁶ = 64.'], ['36', '(2³)² = 8² = 64. The 3 is a power, not a number to multiply.']]))
practice(powerOfPower, 'Find the value of n. (3⁴)ⁿ = 3¹²', 'A2.3 Q4a', number(3), 'Multiply the powers on the left: 4 × n. That must match 12.', built('(3⁴)ⁿ = 3¹²',
  { title: 'Match the powers', math: '4\\times n=12', say: 'A power of a power multiplies, and the bases match, so the powers must be equal.', line: line('4 × n', '12', 2) },
  { title: 'Find n', math: 'n=12\\div4=3', say: 'Divide both sides by 4.', line: line('12 ÷ 4', '3') },
  { title: 'The answer', math: 'n=3', say: 'Check: (3⁴)³ = 3¹².', answer: 'n = 3' },
), known([['8', 'For a power of a power, multiply: 4 × n = 12, so n = 12 ÷ 4 = 3. (4 + n = 12 is for multiplying two powers.)'], ['48', '4 × n = 12, so divide: n = 12 ÷ 4 = 3.'], ['16', '4 × n = 12, so n = 12 ÷ 4 = 3.']]))
practice(powerOfPower, 'Amy says (2³)² = 2⁵, because 3 + 2 = 5. Is Amy correct?', 'A2.3 Q4b', choose(
  'No. For a power of a power, multiply the powers, so it is 2⁶',
  ['Yes. Add the powers', 'Adding is for two powers multiplied together. (2³)² is 2³ written twice: six 2s, so 2⁶.'],
  ['No. It is 2⁹', 'Multiply the powers: 3 × 2 = 6, so 2⁶.'],
), 'Write out (2³)² as copies. How many 2s are there?', powerModel(2, 3, 2))
practice(powerOfPower, 'Which working shows that (2⁴)² = (2²)⁴?', 'A2.3 Q5a', choose(
  '(2⁴)² = 2⁸ and (2²)⁴ = 2⁸, so they are equal',
  ['(2⁴)² = 2⁶ and (2²)⁴ = 2⁶, so they are equal', 'For a power of a power, multiply the powers: 4 × 2 = 8 and 2 × 4 = 8. Both are 2⁸.'],
  ['(2⁴)² = 2⁸ and (2²)⁴ = 2⁶, so they are not equal', '(2²)⁴ multiplies too: 2 × 4 = 8. Both sides are 2⁸.'],
), 'Work out each side as a single power of 2.', built('(2⁴)² = (2²)⁴',
  { title: 'The left side', math: '(2^{4})^{2}=2^{8}', say: 'Multiply the powers.', line: line('4 × 2', '2⁸', 0) },
  { title: 'The right side', math: '(2^{2})^{4}=2^{8}', say: 'Multiply the powers here too.', line: line('2 × 4', '2⁸', 1) },
  { title: 'The answer', math: '2^{8}=2^{8}', say: 'Both sides are 2⁸, so they are equal.', answer: 'Both sides equal 2⁸' },
))
practice(powerOfPower, 'Simplify (a⁻²)⁴.', 'A2.3 Q5b', expression('a⁻⁸'), 'Multiply the powers. A negative times a positive is negative.', built('(a⁻²)⁴',
  { title: 'Multiply the powers', math: '(-2)\\times4=-8', say: 'A power of a power multiplies. A negative times a positive is negative.', line: line('−2 × 4', '−8', 2) },
  { title: 'The answer', math: 'a^{-8}', say: 'The letter stays the same. Only the power changes.', answer: 'a⁻⁸' },
), response => diagnosePower(response, 'a', 'power', -2, 4))
practice(powerOfPower, 'Simplify ((a²)³)².', 'A2.3 Q5c', expression('a¹²'), 'Start with the inside brackets, then the outside power.', built('((a²)³)²',
  { title: 'Inside brackets first', math: '(a^{2})^{3}=a^{6}', say: 'Multiply the powers.', line: line('2 × 3', 'a⁶', 0) },
  { title: 'Now the outside power', math: '(a^{6})^{2}=a^{12}', say: 'Multiply again.', line: line('6 × 2', 'a¹²', 1) },
  { title: 'The answer', math: 'a^{12}', say: 'Every power multiplies.', answer: 'a¹²' },
), known([['a^7', 'You added the powers. For a power of a power, multiply: 2 × 3 = 6, then 6 × 2 = 12.'], ['a⁷', 'You added the powers. For a power of a power, multiply: 2 × 3 = 6, then 6 × 2 = 12.'], ['a^8', 'The outside power multiplies too: (a⁶)² = a⁶ˣ² = a¹².'], ['a⁸', 'The outside power multiplies too: (a⁶)² = a⁶ˣ² = a¹².'], ['a^6', 'Don’t forget the outside power 2: (a⁶)² = a¹².'], ['a⁶', 'Don’t forget the outside power 2: (a⁶)² = a¹².']]))

/* ---------- Rung 7: fractions to a power (A2.7) ---------- */

const fractionVideo = worked(fractionLaw, 'A square tile has side length 2/3 m, so its area is (2/3)² m². Work out the area of the tile.', 'A2.7 video + Q1', squareFraction(2, 3, '4/9 m²', 'The tile is split into thirds each way.'), 'A fraction raised to a power: power the top and the bottom.')
video(fractionVideo, media('fraction', 'Working out (2/3)²', 51.8, 'A2.7_The_Fraction_Law.mp4', [
  '(2/3)²: a fraction raised to a power.',
  'Squared means the fraction multiplied by itself: 2/3 × 2/3.',
  'Multiply the tops and the bottoms: 2 squared over 3 squared. 2 squared is 4 and 3 squared is 9, so 4/9.',
  'A square tile has side 2/3 of a metre. Its area is (2/3)² = 4/9 square metres: 4 of the 9 small squares are shaded.',
]))
const cubeFraction = (n: number, d: number) => built(`(${n}/${d})³`,
  { title: 'Cube the top', math: `${n}^{3}=${n ** 3}`, say: 'The power applies to the top.', line: line(`${n} × ${n} × ${n}`, String(n ** 3), 1) },
  { title: 'Cube the bottom', math: `${d}^{3}=${d ** 3}`, say: 'And to the bottom as well.', line: line(`${d} × ${d} × ${d}`, String(d ** 3), 0) },
  { title: 'The answer', math: `\\frac{${n ** 3}}{${d ** 3}}`, say: 'The top over the bottom.', answer: `${n ** 3}/${d ** 3}` },
)
practice(fractionLaw, 'Work out (1/2)³.', 'A2.7 Q2', fraction('1/8'), 'Power the top and the bottom.', cubeFraction(1, 2), known([['3/6', 'Cubing means multiplying by itself three times, not by 3: 2³ = 2 × 2 × 2 = 8.'], ['1/2', 'The bottom is cubed too: 2³ = 8.'], ['1/6', 'Cubing means 2 × 2 × 2 = 8, not 2 × 3.']]))
practice(fractionLaw, 'Work out (3/4)³.', 'A2.7 Q3', fraction('27/64'), 'Power the top and the bottom separately.', cubeFraction(3, 4), known([['27/4', 'The power applies to the bottom too: 4³ = 64.'], ['9/12', 'Cubing means multiplying by itself three times, not by 3: 3³ = 27 and 4³ = 64.'], ['9/64', '3³ = 3 × 3 × 3 = 27.']]))
practice(fractionLaw, 'Simplify (x/3)².', 'A2.7 Q4a', expression('x²/9'), 'Square the top and square the bottom. Type the answer as x²/9.', built('(x/3)²',
  { title: 'Square the top', math: 'x^{2}', say: 'The power applies to the letter on top.', line: line('x × x', 'x²', 1) },
  { title: 'Square the bottom', math: '3^{2}=9', say: 'And to the number on the bottom.', line: line('3 × 3', '9', 0) },
  { title: 'The answer', math: '\\frac{x^{2}}{9}', say: 'The top over the bottom.', answer: 'x²/9' },
), known([['x^2/3', 'Square the bottom too: 3² = 9, so x²/9.'], ['x²/3', 'Square the bottom too: 3² = 9, so x²/9.'], ['x^2/6', '3² = 3 × 3 = 9, not 3 × 2.'], ['x²/6', '3² = 3 × 3 = 9, not 3 × 2.'], ['x/9', 'Square the top too: x × x = x².']]))
practice(fractionLaw, 'Ella says (2/3)² = 4/3. Is Ella correct?', 'A2.7 Q4b', choose(
  'No. The power applies to the bottom as well, so it is 4/9',
  ['Yes. Square the top number', 'The whole fraction is squared, so the bottom is squared too: 3² = 9. It’s 4/9.'],
  ['No. It is 4/6', '3² = 3 × 3 = 9, not 3 × 2. It’s 4/9.'],
), 'What happens to the bottom when you square a fraction?', squareFraction(2, 3, '4/9'))
practice(fractionLaw, 'Work out (1¾)².', 'A2.7 Q5a', fraction('49/16'), 'Turn the mixed number into an improper fraction first.', built('(1¾)²',
  { title: 'Improper fraction first', math: '1\\tfrac{3}{4}=\\frac{7}{4}', say: 'One whole is four quarters, plus three more quarters.', line: line('1¾', '7/4', 2) },
  { title: 'Square the top', math: '7^{2}=49', say: 'The power applies to the top.', line: line('7 × 7', '49', 1) },
  { title: 'Square the bottom', math: '4^{2}=16', say: 'And to the bottom.', line: line('4 × 4', '16', 0) },
  { title: 'The answer', math: '\\frac{49}{16}', say: 'The top over the bottom.', answer: '49/16' },
), known([['1 9/16', 'Turn 1¾ into 7/4 first, then square it: 49/16. Squaring the whole and the fraction separately misses part of it.'], ['9/16', 'Don’t lose the whole 1: 1¾ = 7/4, and (7/4)² = 49/16.'], ['49/4', 'Square the bottom too: 4² = 16.'], ['14/8', 'Squaring means 7 × 7 and 4 × 4, not × 2.']]))
practice(fractionLaw, 'Write your answer to (1¾)², 49/16, as a mixed number.', 'A2.7 Q5b', fraction('3 1/16', true), 'How many times does 16 go into 49, and what’s left?', built('49/16',
  { title: 'Whole ones', math: '16\\times3=48', say: '16 goes into 49 three times.', line: line('49 ÷ 16', '3 remainder 1', 0) },
  { title: 'The answer', math: '3\\tfrac{1}{16}', say: 'The remainder stays over 16.', answer: '3 1/16' },
), known([['4 1/16', '16 × 4 = 64, more than 49. 16 goes into 49 three times, with 1 left: 3 1/16.'], ['3 1/49', 'The bottom stays as 16: 3 1/16.'], ['3 1/3', 'The remainder is over 16: 3 1/16.']]))
practice(fractionLaw, 'Simplify (2x/5)³.', 'A2.7 Q5c', expression('8x³/125'), 'Cube the top (the 2 and the x), then cube the bottom. Type it like 8x³/125.', built('(2x/5)³',
  { title: 'Cube the top', math: '2^{3}x^{3}=8x^{3}', say: 'Both the 2 and the x are cubed.', line: line('2³ × x³', '8x³', 1) },
  { title: 'Cube the bottom', math: '5^{3}=125', say: 'And the bottom.', line: line('5 × 5 × 5', '125', 0) },
  { title: 'The answer', math: '\\frac{8x^{3}}{125}', say: 'The top over the bottom.', answer: '8x³/125' },
), known([['2x^3/125', 'Cube the 2 as well: 2³ = 8.'], ['2x³/125', 'Cube the 2 as well: 2³ = 8.'], ['8x^3/5', 'Cube the bottom too: 5³ = 125.'], ['8x³/5', 'Cube the bottom too: 5³ = 125.'], ['6x^3/15', 'Cubing means multiplying by itself three times, not by 3: 2³ = 8 and 5³ = 125.'], ['6x³/15', 'Cubing means multiplying by itself three times, not by 3: 2³ = 8 and 5³ = 125.'], ['8x/125', 'Cube the x too: x³.']]))

/* ---------- Rung 8: roots (A2.8) ---------- */

const rootsVideo = worked(roots, 'Work out √49.', 'A2.8 video', squareRoot(7, '√49 = 7'), 'A root undoes a power.')
video(rootsVideo, media('roots', 'Working out √49 and ∛27', 58, 'A2.8_Roots.mp4', [
  'A root undoes a power. A square root asks: which number times itself makes 49? Try 7: 7 × 7 = 49, so √49 = 7.',
  'A cube root asks: which number, used three times, makes 27? Try 3: 3 × 3 × 3 = 27, so ∛27 = 3.',
  'A square carpet has an area of 49 m². Each side is √49 = 7 m: 7 rows of 7 squares.',
]))
const cubeRoot = (n: number, answer: string, story = '') => built(`∛${n ** 3}`,
  { title: 'Used three times', math: `${n}\\times${n}\\times${n}=${n ** 3}`, say: `${story}A cube root asks: which number, used three times, makes ${n ** 3}?`, line: line(`${n} × ${n} × ${n}`, String(n ** 3), 1) },
  { title: 'The answer', math: `\\sqrt[3]{${n ** 3}}=${n}`, say: 'That number is the cube root.', answer },
)
practice(roots, 'A square carpet has an area of 81 m². Work out the side length of the carpet.', 'A2.8 Q1', number(9), 'Which number times itself makes 81?', squareRoot(9, '9 m', 'Area = side × side. '), known([['40.5', 'A square root isn’t half. Which number times itself makes 81? 9 × 9 = 81.'], ['20.25', 'Dividing by 4 isn’t a square root. Which number times itself makes 81? 9 × 9 = 81.'], ['6561', 'That’s 81 squared. We need the number that squares to 81: 9.']]), 'Side (m)')
practice(roots, 'Work out √64.', 'A2.8 Q2', number(8), 'Find the number that multiplies by itself to give 64.', squareRoot(8, '8'), known([['32', 'A square root isn’t half. 8 × 8 = 64, so √64 = 8.'], ['4', '4 × 4 × 4 = 64 is the cube root. √ means square root: 8 × 8 = 64.']]))
practice(roots, 'A cube has a volume of 125 cm³. Work out the length of one edge of the cube.', 'A2.8 Q3', number(5), 'Which number, used three times, makes 125?', cubeRoot(5, '5 cm', 'Volume = edge × edge × edge. '), known([['25', '25 × 25 × 25 is far too big. Which number, used three times, makes 125? 5 × 5 × 5 = 125.'], ['41.67', 'A cube root isn’t dividing by 3. 5 × 5 × 5 = 125.'], ['11.18', 'That’s the square root. A cube needs the cube root: 5 × 5 × 5 = 125.']]), 'Edge (cm)')
practice(roots, 'Work out √100 + ∛8.', 'A2.8 Q4a', number(12), 'Work out each root, then add.', built('√100 + ∛8',
  { title: 'The square root', math: '10\\times10=100', say: 'Which number times itself makes 100?', line: line('√100', '10', 1) },
  { title: 'The cube root', math: '2\\times2\\times2=8', say: 'Which number, used three times, makes 8?', line: line('∛8', '2', 0) },
  { title: 'Add them', math: '10+2=12', say: 'Now it’s an ordinary sum.', line: line('10 + 2', '12', 2) },
  { title: 'The answer', math: '12', say: 'That’s the value.', answer: '12' },
), known([['14', '∛8 is the number used three times to make 8: 2 × 2 × 2 = 8, so ∛8 = 2. 10 + 2 = 12.'], ['54', 'A square root isn’t half: √100 = 10, since 10 × 10 = 100.'], ['108', 'Work out each root first: √100 = 10 and ∛8 = 2.']]))
practice(roots, 'Zac says √49 = 24.5, because half of 49 is 24.5. Is Zac correct?', 'A2.8 Q4b', choose(
  'No. A square root isn’t half: 7 × 7 = 49, so √49 = 7',
  ['Yes. Square root means halve', 'Check by squaring: 24.5 × 24.5 is about 600, not 49. √49 = 7, because 7 × 7 = 49.'],
  ['No. √49 = 7 × 7', '7 × 7 is 49 itself. The square root is the 7.'],
), 'Check by squaring 24.5. Does it make 49?', squareRoot(7, '√49 = 7'))
practice(roots, 'Work out the fourth root of 81, ⁴√81.', 'A2.8 Q5a', number(3), 'The fourth root is the number that multiplies by itself four times to give 81.', built('⁴√81',
  { title: 'Used four times', math: '3\\times3\\times3\\times3=81', say: 'Which number, used four times, makes 81? Try 3.', line: line('3 × 3 × 3 × 3', '81', 1) },
  { title: 'The answer', math: '\\sqrt[4]{81}=3', say: 'That number is the fourth root.', answer: '3' },
), known([['9', 'That’s the square root: 9 × 9 = 81. The fourth root is used four times: 3 × 3 × 3 × 3 = 81.'], ['20.25', 'A root isn’t dividing by 4. 3 × 3 × 3 × 3 = 81.']]))
practice(roots, 'Is √50 a whole number?', 'A2.8 Q5b', choose(
  'No. 7² = 49 and 8² = 64, so √50 is between 7 and 8',
  ['Yes. √50 = 25', 'A square root isn’t half: 25 × 25 = 625. 7² = 49 and 8² = 64, so √50 is between 7 and 8.'],
  ['Yes. √50 = 7', '7 × 7 = 49, not 50. √50 is a little more than 7.'],
), 'Compare 50 with the square numbers on either side.', built('√50',
  { title: 'The squares either side', math: '7^{2}=49,\\ 8^{2}=64', say: '50 sits between these two square numbers.', line: line('7² and 8²', '49 and 64', 1) },
  { title: 'The answer', math: '7<\\sqrt{50}<8', say: 'No whole number squares to 50.', answer: 'No. √50 is between 7 and 8' },
))
practice(roots, 'A square patio has an area of 144 m². A cube-shaped storage box has a volume of 64 m³. How much longer is the side of the patio than an edge of the box?', 'A2.8 Q5c', number(8), 'The patio needs a square root, the box a cube root. Then subtract.', built('√144 − ∛64',
  { title: 'The patio side', math: '12\\times12=144', say: 'A square: which number times itself makes 144?', line: line('√144', '12', 1) },
  { title: 'The box edge', math: '4\\times4\\times4=64', say: 'A cube: which number, used three times, makes 64?', line: line('∛64', '4', 0) },
  { title: 'How much longer', math: '12-4=8', say: 'How much longer means take away.', line: line('12 − 4', '8', 2) },
  { title: 'The answer', math: '8', say: 'In metres.', answer: '8 m' },
), known([['4', 'The box is a cube, so its edge is the cube root: ∛64 = 4 (not √64 = 8). 12 − 4 = 8.'], ['80', 'Find each length first: √144 = 12 and ∛64 = 4. Then 12 − 4 = 8.'], ['16', 'How much longer means subtract: 12 − 4 = 8.']]), 'Difference (m)')

add('mixed', 'Powers and roots', 'A2.1-A2.8 consolidation', text(
  'Multiply powers of the same base: add the powers, 3⁴ × 3⁵ = 3⁹. Divide: subtract them, 3⁷ ÷ 3⁴ = 3³.',
  'A power of a power: multiply the powers, (5²)³ = 5⁶. The base never changes.',
  'x¹ = x, any number (except 0) to the power 0 is 1, and 1 to any power is 1.',
  'A fraction to a power: power the top and the bottom, (2/3)² = 4/9.',
  'A root undoes a power: √49 = 7 because 7 × 7 = 49, and ∛27 = 3 because 3 × 3 × 3 = 27.',
))

export const tutorIndicesLesson: TutorMethodLesson = {
  id: 'L016', number: 16, title: 'Powers and roots', level: 'GCSE Foundation',
  goal: 'Use the laws of indices, and work out square, cube and other roots.',
  labels: {
    [powerOne]: 'Power 1', [multiply]: 'Multiplying powers', [divide]: 'Dividing powers', [powerZero]: 'Power 0',
    [oneLaw]: '1 to any power', [powerOfPower]: 'Power of a power', [fractionLaw]: 'Fractions to a power', [roots]: 'Roots',
    mixed: 'Review',
  },
  states: finish(),
}
