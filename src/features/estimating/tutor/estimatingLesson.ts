import { select, working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { MethodStep } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseEstimate, type EstimateCheck } from './estimateDiagnosis'

const { add, finish } = author(12)
const significantFigures = 'estimating-significant-figures'
const calculations = 'estimating-calculations'
const formulas = 'estimating-formulas'
const checking = 'estimating-checking'
const text = (...lines: string[]) => ({ kind: 'text' as const, lines })

const number = (answer: number, displayAnswer: string): InteractionDefinition => ({
  type: 'numericInput', correctAnswer: answer, displayAnswer, acceptanceRule: 'normalisedNumber',
})

/* ---------- Working models ---------- */

type Step = { title: string; math: string; say: string; values?: string[]; answer?: string }

/** Steps shown one at a time. 'estimate' puts the final value in the ≈ box; 'ordering' leaves it out. */
function lines(question: string, method: 'estimate' | 'ordering', ...list: Step[]): TutorWorking {
  const steps: MethodStep[] = list.map(step => ({
    title: step.title, operation: question, equation: step.math, instruction: step.say,
    frame: { ordering: step.answer ? { answer: step.answer } : { values: step.values ?? [] } },
  }))
  return { kind: 'method-worked', examples: [{ method, expression: question, label: 'Estimate', first: 0, second: 0, steps }] }
}

/** [label, from, to, unit]. A unit of '£' goes in front; anything else goes after. */
type Round = [string, string, string, string?]
const withUnit = (value: string, unit?: string) => !unit ? value : unit === '£' ? `£${value}` : `${value} ${unit}`
const tex = (value: string) => value.replaceAll(' ', '\\,')

function roundStep(rounds: Round[], say = 'Round each number to 1 significant figure.'): Step {
  return {
    title: 'Round to 1 s.f.',
    math: rounds.map(([, from, to]) => `${tex(from)}\\to${tex(to)}`).join(',\\;'),
    say,
    values: rounds.map(([label, from, to, unit]) => `${label ? `${label}: ` : ''}${withUnit(from, unit)} → ${withUnit(to, unit)}`),
  }
}

/** The usual two-step estimate: round everything, then do the easy calculation. */
function estimate(question: string, rounds: Round[], calc: string, answer: string, say?: { round?: string; calc?: string }): TutorWorking {
  return lines(question, 'estimate', roundStep(rounds, say?.round), {
    title: 'Work it out', math: calc, say: say?.calc ?? 'Now the numbers are easy to work with.', answer,
  })
}

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}

function practice(
  topic: MicroSkillId,
  title: string,
  sourceRef: string,
  interaction: InteractionDefinition,
  answer: string,
  hint: string,
  model: TutorWorking,
  options: { given?: string[]; unit?: string; check?: EstimateCheck } = {},
) {
  const state = add(topic, title, sourceRef, options.given ? text(...options.given) : text(title), interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  if (options.unit) state.answerLabel = options.unit
  const check = options.check
  if (check) state.diagnose = response => diagnoseEstimate(response, check)
  return state
}

function worked(topic: MicroSkillId, title: string, sourceRef: string, model: TutorWorking, body?: string) {
  return add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }

/** Rounding one number to 1 significant figure, shown with the shared kept-digit / decision-digit picture. */
type SigFig = { original: string; kept: string; decision: string; rest?: string; point?: boolean; answer: string; keptDigit: string; carry?: string; fill?: string }
function sigFig(model: SigFig): TutorWorking {
  const up = Number(model.decision) >= 5
  const frame = (stage: 'identify' | 'decide' | 'result') => ({
    original: model.original, target: '1 significant figure', kept: model.kept, decisionDigit: model.decision, remaining: model.rest ?? '',
    pointAfterKept: model.point, stage, roundsUp: up, answer: stage === 'result' ? model.answer : undefined,
  })
  const steps: MethodStep[] = [
    {
      title: 'Find the first significant figure', operation: model.original,
      equation: `${model.kept}\\mid${model.point ? '.' : ''}${model.decision}${tex(model.rest ?? '')}`,
      instruction: `The first digit that isn’t zero is ${model.keptDigit}. The digit after it decides the rounding.`,
      frame: { rounding: frame('identify') },
    },
    {
      title: 'Use the next digit', operation: model.original,
      equation: up ? `${model.decision}\\geq5` : `${model.decision}<5`,
      instruction: `${model.decision} is ${up ? '5 or more, so round up' : 'less than 5, so the digit stays the same'}.${model.carry ? ` ${model.carry}` : ''}`,
      frame: { rounding: frame('decide') },
    },
    {
      title: 'Write the rounded number', operation: model.original,
      equation: `${tex(model.original)}\\to${tex(model.answer)}`,
      instruction: model.fill ?? 'Leave out the digits after it.',
      frame: { rounding: frame('result') },
    },
  ]
  return { kind: 'method-worked', examples: [{ method: 'rounding', expression: tex(model.original), label: 'Round to 1 significant figure', first: 0, second: 0, steps }] }
}

/* ---------- Rung 1: round to 1 significant figure ---------- */

worked(significantFigures, 'Write 412.50 correct to 1 significant figure.', 'N12.1 Q3', sigFig({
  original: '412.50', kept: '4', decision: '1', rest: '2.50', answer: '400', keptDigit: 'the 4, in the hundreds column',
  fill: 'Fill the tens and units with zeros so the number stays the same size: 412.50 ≈ 400.',
}))
practice(significantFigures, 'Write 48 correct to 1 significant figure.', 'N12.1 Q1', number(50, '50'), '50', 'The first significant figure is the 4. Look at the digit after it.', sigFig({
  original: '48', kept: '4', decision: '8', answer: '50', keptDigit: 'the 4, in the tens column', fill: 'Fill the units with a zero so the number stays the same size.',
}))
practice(significantFigures, 'Write £3.12 correct to 1 significant figure.', 'N12.1 Q1', number(3, '£3'), '£3', 'The first significant figure is the 3. Look at the digit after it.', sigFig({
  original: '3.12', kept: '3', point: true, decision: '1', rest: '2', answer: '3', keptDigit: 'the 3, in the units column',
}), { unit: 'Price (£)' })
practice(significantFigures, 'Write 0.0648 correct to 1 significant figure.', 'N12.1 Q5a', number(0.06, '0.06'), '0.06', 'Zeros at the front don’t count. Start at the 6.', sigFig({
  original: '0.0648', kept: '0.06', decision: '4', rest: '8', answer: '0.06', keptDigit: 'the 6, in the hundredths column',
}))
practice(significantFigures, 'Write 9.8 correct to 1 significant figure.', 'N12.2 Q3', number(10, '10'), '10', 'The 8 tells you to round the 9 up.', sigFig({
  original: '9.8', kept: '9', point: true, decision: '8', answer: '10', keptDigit: 'the 9, in the units column', carry: 'Rounding 9 up gives 10.',
}))
practice(significantFigures, 'Write £11.90 correct to 1 significant figure.', 'N12.2 Q5a', number(10, '£10'), '£10', 'The first significant figure is the first 1, in the tens column.', sigFig({
  original: '11.90', kept: '1', decision: '1', rest: '.90', answer: '10', keptDigit: 'the first 1, in the tens column',
  fill: 'Fill the units with a zero and leave out the decimals: £11.90 ≈ £10.',
}), { unit: 'Price (£)' })
practice(significantFigures, 'Write 0.00398 correct to 1 significant figure.', 'N12.2 Q5b', number(0.004, '0.004'), '0.004', 'Zeros at the front don’t count. Start at the 3.', sigFig({
  original: '0.00398', kept: '0.003', decision: '9', rest: '8', answer: '0.004', keptDigit: 'the 3, in the thousandths column', carry: 'The 3 becomes a 4.',
}))

/* ---------- Rung 2: estimate a calculation ---------- */

const simpleVideo = worked(calculations, 'A baker sells 48 loaves at £3.12 each. Work out an estimate for the money she takes.', 'N12.1 Q1; video N12.1', estimate(
  '48\\times3.12', [['Loaves', '48', '50'], ['Price', '3.12', '3', '£']], '50\\times3=150', '£150',
  { calc: 'Multiply the rounded numbers. She takes about £150.' },
), 'Round every number to 1 significant figure first, then work out the easy calculation.')
video(simpleVideo, {
  id: 'lesson12-simple-estimating', src: '/media/lesson-12/simple-estimating.mp4', poster: '/media/lesson-12/simple-estimating.svg', title: 'Estimating a baker’s takings', durationSeconds: 57, sourceFile: 'N12.1_Simple_Estimating.mp4',
  textAlternative: ['The takings are 48 × £3.12.', 'Round 48 to 50 and £3.12 to £3, each to 1 significant figure.', 'Multiply the rounded numbers: 50 × 3 = 150.', 'She takes about £150.'],
})
practice(calculations, 'A cinema sells 19 tickets at £5.85 each. Which is the best estimate for the total?', 'N12.1 Q2', select(['£60', '£100', '£120', '£1200'], 2), '£120', 'Round 19 and £5.85 to 1 significant figure.', estimate(
  '19\\times5.85', [['Tickets', '19', '20'], ['Price', '5.85', '6', '£']], '20\\times6=120', '£120',
))
practice(calculations, 'A school trip costs £412.50. It is shared equally between 19 students. Work out an estimate for the cost for each student.', 'N12.1 Q3', number(20, '£20'), '£20', 'Sharing equally means dividing. Round both numbers first.', estimate(
  '412.50\\div19', [['Total', '412.50', '400', '£'], ['Students', '19', '20']], '400\\div20=20', '£20',
  { calc: 'Sharing equally means dividing.' },
), { unit: 'Each (£)', check: { estimate: 20, exact: 412.5 / 19, traps: [[400 * 20, 'Sharing equally means dividing, not multiplying.']] } })
practice(calculations, 'Priya buys 4 notebooks at £2.85 each and 6 pens at 46p each. Work out an estimate for the total cost.', 'N12.1 Q4a', number(15, '£15'), '£15', 'Round each price to 1 significant figure. Then work out each cost and add.', lines('4\\times2.85+6\\times0.46', 'estimate',
  roundStep([['Notebook', '2.85', '3', '£'], ['Pen', '46p', '50p = £0.50']], 'Round each price to 1 significant figure. 4 and 6 already are.'),
  { title: 'Work out each cost', math: '4\\times3=12,\\;6\\times0.5=3', say: 'Notebooks cost about £12 and pens about £3.', values: ['Notebooks: 4 × £3 = £12', 'Pens: 6 × £0.50 = £3'] },
  { title: 'Add', math: '12+3=15', say: 'The total is about £15.', answer: '£15' },
), { unit: 'Total (£)', check: { estimate: 15, exact: 4 * 2.85 + 6 * 0.46, traps: [[312, 'Change 50p to £0.50 before you add it to pounds.'], [12, 'Add the cost of the pens as well.']] } })
practice(calculations, 'A screen protector is 0.0648 cm thick. Work out an estimate for the height of a pile of 312 screen protectors.', 'N12.1 Q5b', number(18, '18 cm'), '18 cm', 'Round 0.0648 and 312 to 1 significant figure, then multiply.', estimate(
  '0.0648\\times312', [['Thickness', '0.0648', '0.06', 'cm'], ['Protectors', '312', '300']], '0.06\\times300=18', '18 cm',
  { calc: '6 × 300 = 1800, and 0.06 is 100 times smaller, so the answer is 18.' },
), { unit: 'Height (cm)', check: { estimate: 18, exact: 0.0648 * 312, traps: [[21, 'Round 0.0648 to 1 significant figure: 0.06, not 0.07.']] } })
practice(calculations, 'Work out an estimate for 38 × 5.2', 'N12 extra practice', number(200, '200'), '200', 'Round 38 and 5.2 to 1 significant figure.', estimate(
  '38\\times5.2', [['', '38', '40'], ['', '5.2', '5']], '40\\times5=200', '200',
), { check: { estimate: 200, exact: 38 * 5.2 } })
practice(calculations, 'Work out an estimate for 612 ÷ 29', 'N12 extra practice', number(20, '20'), '20', 'Round 612 and 29 to 1 significant figure.', estimate(
  '612\\div29', [['', '612', '600'], ['', '29', '30']], '600\\div30=20', '20',
  { calc: '600 ÷ 30 is the same as 60 ÷ 3.' },
), { check: { estimate: 20, exact: 612 / 29 } })
practice(calculations, 'Work out an estimate for (21.4 × 3.9) ÷ 0.49', 'N12 extra practice', number(160, '160'), '160', 'Dividing by 0.5 is the same as doubling.', lines('\\dfrac{21.4\\times3.9}{0.49}', 'estimate',
  roundStep([['', '21.4', '20'], ['', '3.9', '4'], ['', '0.49', '0.5']]),
  { title: 'Work out the top', math: '20\\times4=80', say: 'Multiply the rounded numbers on top.', values: ['20 × 4 = 80'] },
  { title: 'Divide by 0.5', math: '80\\div0.5=160', say: 'Dividing by 0.5 doubles the number: there are 160 halves in 80.', answer: '160' },
), { check: { estimate: 160, exact: 21.4 * 3.9 / 0.49, traps: [[40, 'Dividing by 0.5 makes the answer bigger: 80 ÷ 0.5 = 160, the same as 80 × 2.']] } })

/* ---------- Rung 3: estimate with a formula ---------- */

const formulaVideo = worked(formulas, 'A train travels 296 km in 3.1 hours. Work out an estimate for its average speed.', 'N12.2 Q1; video N12.2', estimate(
  '\\text{speed}=296\\div3.1', [['Distance', '296', '300', 'km'], ['Time', '3.1', '3', 'hours']], '\\text{speed}=300\\div3=100', '100 km/h',
  { calc: 'Put the rounded values into speed = distance ÷ time.' },
), 'Round the values first, then put them into the formula.')
video(formulaVideo, {
  id: 'lesson12-estimating-with-equations', src: '/media/lesson-12/estimating-with-equations.mp4', poster: '/media/lesson-12/estimating-with-equations.svg', title: 'Estimating a train’s average speed', durationSeconds: 54, sourceFile: 'N12.2_Estimating_with_Equations.mp4',
  textAlternative: ['Speed = distance ÷ time, so the speed is 296 ÷ 3.1.', 'Round 296 to 300 and 3.1 to 3, each to 1 significant figure.', 'Put them into the formula: 300 ÷ 3 = 100.', 'The average speed is about 100 km/h.'],
})
practice(formulas, 'A taxi charges £2.85 per mile. A journey is 6.2 miles long. Work out an estimate for the cost.', 'N12.2 Q2', number(18, '£18'), '£18', 'Round the price and the miles, then use the formula.', estimate(
  '\\text{cost}=2.85\\times6.2', [['Price per mile', '2.85', '3', '£'], ['Miles', '6.2', '6']], '\\text{cost}=3\\times6=18', '£18',
), { given: ['cost = price per mile × miles'], unit: 'Cost (£)', check: { estimate: 18, exact: 2.85 * 6.2 } })
practice(formulas, 'A car does 9.8 miles on each litre of fuel. Work out an estimate for the litres needed for a 412-mile journey.', 'N12.2 Q3', number(40, '40 litres'), '40 litres', 'Round 412 and 9.8 to 1 significant figure.', estimate(
  '\\text{litres}=412\\div9.8', [['Distance', '412', '400', 'miles'], ['Miles per litre', '9.8', '10']], '\\text{litres}=400\\div10=40', '40 litres',
), { given: ['litres = distance ÷ miles per litre'], unit: 'Fuel (litres)', check: { estimate: 40, exact: 412 / 9.8, traps: [[4000, 'The formula divides the distance by the miles per litre.']] } })
practice(formulas, 'A fish tank is 61.2 cm long, 29.8 cm wide and 40.3 cm high. Work out an estimate for its volume.', 'N12.2 Q4a', number(72000, '72 000 cm³'), '72 000 cm³', 'Round all three lengths, then multiply two at a time.', lines('V=61.2\\times29.8\\times40.3', 'estimate',
  roundStep([['Length', '61.2', '60', 'cm'], ['Width', '29.8', '30', 'cm'], ['Height', '40.3', '40', 'cm']]),
  { title: 'Multiply two lengths', math: '60\\times30=1800', say: '6 × 3 = 18, then add the two zeros.', values: ['60 × 30 = 1800'] },
  { title: 'Multiply by the third', math: 'V=1800\\times40=72\\,000', say: '18 × 4 = 72, then add the three zeros.', answer: '72 000 cm³' },
), { given: ['V = l × w × h'], unit: 'Volume (cm³)', check: { estimate: 72000, exact: 61.2 * 29.8 * 40.3 } })
practice(formulas, 'A fish tank holds about 72 000 cm³. Estimate how many litres it holds.', 'N12.2 Q4b', number(72, '72 litres'), '72 litres', 'There are 1000 cm³ in a litre, so divide by 1000.', lines('72\\,000\\div1000', 'estimate',
  { title: 'Change cm³ to litres', math: '72\\,000\\div1000=72', say: 'Every 1000 cm³ makes 1 litre, so divide by 1000.', answer: '72 litres' },
), { given: ['1 litre = 1000 cm³'], unit: 'Capacity (litres)', check: { estimate: 72, exact: 72, traps: [[72000000, 'Divide by 1000 to change cm³ into litres. Multiplying makes it far too big.']] } })
practice(formulas, 'A lifeguard is paid £11.90 an hour. She works 39.2 hours. Work out an estimate for her pay.', 'N12.2 Q5a', number(400, '£400'), '£400', 'The first significant figure of 11.90 is the first 1, in the tens column.', estimate(
  '\\text{pay}=11.90\\times39.2', [['Rate', '11.90', '10', '£'], ['Hours', '39.2', '40']], '\\text{pay}=10\\times40=400', '£400',
  { round: 'The first significant figure of 11.90 is the first 1, in the tens column, so £11.90 ≈ £10.' },
), { given: ['pay = rate per hour × hours'], unit: 'Pay (£)', check: { estimate: 400, exact: 11.9 * 39.2, traps: [[480, 'Round £11.90 to 1 significant figure: that’s £10, not £12.']] } })
practice(formulas, 'A block of foam has a mass of 0.0812 kg and a volume of 0.00398 m³. Work out an estimate for its density.', 'N12.2 Q5b', number(20, '20 kg/m³'), '20 kg/m³', 'Round both values, then multiply both by 1000 before you divide.', lines('\\text{density}=0.0812\\div0.00398', 'estimate',
  roundStep([['Mass', '0.0812', '0.08', 'kg'], ['Volume', '0.00398', '0.004', 'm³']]),
  { title: 'Clear the decimals', math: '0.08\\div0.004=80\\div4', say: 'Multiply both numbers by 1000. The answer to the division stays the same.', values: ['0.08 × 1000 = 80', '0.004 × 1000 = 4'] },
  { title: 'Divide', math: '\\text{density}=80\\div4=20', say: 'The density is about 20 kg/m³.', answer: '20 kg/m³' },
), { given: ['density = mass ÷ volume'], unit: 'Density (kg/m³)', check: { estimate: 20, exact: 0.0812 / 0.00398 } })

/* ---------- Rung 4: check the estimate ---------- */

practice(checking, 'Priya’s estimate for 4 notebooks at £2.85 and 6 pens at 46p was £15. Is £15 bigger or smaller than the exact cost?', 'N12.1 Q4b', select([
  'Bigger, because both prices were rounded up',
  'Smaller, because an estimate is always smaller',
  'The same, because the estimate used the same items',
], 0), 'Bigger, because both prices were rounded up', 'Check which way each price moved when you rounded it.', lines('4\\times2.85+6\\times0.46', 'ordering',
  { title: 'Check each rounding', math: '2.85\\to3,\\;0.46\\to0.5', say: 'Both prices went up when they were rounded.', values: ['£2.85 → £3: up', '46p → 50p: up'] },
  { title: 'Decide', math: '15>14.16', say: 'Both prices were made bigger, so the total is bigger too. The exact cost is £14.16.', answer: 'Bigger, because both prices were rounded up' },
))
practice(checking, 'Jo estimates 61 × 3.4 as 60 × 3 = 180. Is 180 bigger or smaller than the exact answer?', 'N12 extra practice', select([
  'Smaller, because both numbers were rounded down',
  'Bigger, because 180 is a round number',
  'The same, because the estimate is correct',
], 0), 'Smaller, because both numbers were rounded down', 'Check which way 61 and 3.4 moved.', lines('61\\times3.4', 'ordering',
  { title: 'Check each rounding', math: '61\\to60,\\;3.4\\to3', say: 'Both numbers went down when they were rounded.', values: ['61 → 60: down', '3.4 → 3: down'] },
  { title: 'Decide', math: '180<207.4', say: 'Both numbers were made smaller, so the estimate is too small. The exact answer is 207.4.', answer: 'Smaller, because both numbers were rounded down' },
))
practice(checking, 'Tom works out 48 × 3.12 = 149.76, then rounds it to 100. Why is 100 not a good estimate?', 'N12 extra practice', select([
  'He should round each number first: 50 × 3 = 150',
  'He should round 149.76 up to 200 instead',
  'It is a good estimate, because it is rounded to 1 significant figure',
], 0), 'He should round each number first: 50 × 3 = 150', 'An estimate rounds the numbers in the question, not the answer.', lines('48\\times3.12', 'ordering',
  roundStep([['', '48', '50'], ['', '3.12', '3', '£']], 'Round the numbers in the question first.'),
  { title: 'Work it out', math: '50\\times3=150', say: '150 is much closer to the real answer than 100.', answer: 'He should round each number first: 50 × 3 = 150' },
))
practice(checking, 'Tickets cost £3.49 at Shop A and £3.51 at Shop B. Amir says the estimate for 20 tickets must be the same at both shops. Is he correct?', 'N12.1 Q5c', select([
  'No. £3.49 ≈ £3 but £3.51 ≈ £4, so the estimates are £60 and £80',
  'Yes. The prices are almost the same, so the estimates are too',
  'No. Both prices round to £3.50, so both estimates are £70',
], 0), 'No. The estimates are £60 and £80', 'Round each price to 1 significant figure.', lines('20\\times3.49,\\;20\\times3.51', 'ordering',
  roundStep([['Shop A', '3.49', '3', '£'], ['Shop B', '3.51', '4', '£']], 'The digit after the 3 is 4 for Shop A but 5 for Shop B.'),
  { title: 'Multiply by 20', math: '3\\times20=60,\\;4\\times20=80', say: 'The estimates are different.', answer: 'No. The estimates are £60 and £80' },
))
practice(checking, 'Sara is estimating 0.0812 ÷ 0.00398. She rounds 0.00398 to 0 and says it can’t be estimated. What is her mistake?', 'N12.2 Q5c', select([
  '0.00398 rounds to 0.004 to 1 significant figure, not to 0',
  '0.00398 rounds to 1 to 1 significant figure',
  'There is no mistake. You can’t estimate with small decimals',
], 0), '0.00398 rounds to 0.004 to 1 significant figure, not to 0', 'Significant figures start at the first digit that isn’t zero.', lines('0.00398', 'ordering',
  { title: 'Find the first significant figure', math: '0.003\\mid98', say: 'Zeros at the front don’t count. The first significant figure is the 3.', values: ['First significant figure: 3'] },
  { title: 'Round', math: '0.00398\\to0.004', say: 'The next digit is 9, so the 3 rounds up to 4.', answer: '0.00398 rounds to 0.004, not to 0' },
))

add('mixed', 'How to estimate', 'N12.1-N12.2 consolidation', text(
  'Round every number to 1 significant figure: the first digit that isn’t zero.',
  'Then do the easy calculation and write ≈.',
  'With a formula, round the values first, then put them in.',
  'If every number was rounded up, the estimate is too big. If every number was rounded down, it is too small.',
))

export const tutorEstimatingLesson: TutorMethodLesson = {
  id: 'L012', number: 12, title: 'Estimating', level: 'GCSE Foundation',
  goal: 'Round to 1 significant figure, estimate calculations and formulas, and say whether an estimate is too big or too small.',
  labels: {
    [significantFigures]: 'Round to 1 s.f.', [calculations]: 'Estimate a calculation',
    [formulas]: 'Estimate with a formula', [checking]: 'Check the estimate', mixed: 'Review',
  },
  states: finish(),
}
