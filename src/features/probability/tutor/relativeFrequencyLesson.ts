import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { slips } from '../../geometry/tutor/figureLesson'
import { chanceScreens } from './chanceLesson'
import { fraction, spinnerFig, tableFig } from './chancePictures'

/*
 * Probability and statistics lesson 4: Relative frequency. From P4 in Sunny's revision book (p171–173), with the
 * book's numbers for the worked examples and most of Your Turn, and our own for a few questions. Four rungs: relative
 * frequency from an experiment (times it happened ÷ total trials, Example 1 and Your Turn Q1); expected frequency,
 * probability × trials (Example 1's 20 000 people, Your Turn Q5); spotting bias by comparing with the theoretical
 * probability (Example 2, Your Turn Q2 and Q3); and why more trials give a more reliable estimate (Your Turn Q4).
 * The first rung opens on the chance board, spinning a fair four-section spinner.
 *
 * Hidden on live: only the unlisted Probability shelf opens it.
 */

const lesson = author(304)
const { add, finish } = lesson
const { worked, practice, ask, play } = chanceScreens(lesson)
const relative = 'chance-relative'
const expected = 'chance-expected'
const bias = 'chance-bias'
const trials = 'chance-trials'

const RF_BOX = { label: 'Relative frequency', prefix: 'RF =' }
const COUNT_BOX = { label: 'Number', prefix: 'n =' }

/* ---------- Pictures ---------- */

/** Prim's survey (P4 Example 1): what people ate, with a total row filled in as the working goes. */
function primFig(total: string, tones: [number, number, FigureTone][] = [], caption?: string): AngleFrame {
  return tableFig([['Food', 'Frequency'], ['Vegetarian', '44'], ['Vegan', '23'], ['Other', '43'], ['Total', total]],
    'Prim’s table: vegetarian 44, vegan 23, other 43.', { tones, caption })
}

/** Som’s survey (P4 Your Turn Q1): how 52 people travelled to school. */
function somFig(tones: [number, number, FigureTone][] = [], caption?: string): AngleFrame {
  return tableFig([['Travel', 'Frequency'], ['Public transport', '12'], ['Car', '15'], ['Cycle', '9'], ['Walk', '16']],
    'Som’s table: public transport 12, car 15, cycle 9, walk 16. 52 people in all.', { tones, caption })
}

/** Amber’s spinner (P4 Example 2): four equal sections, 1 to 4. */
const amberFig = (lit: number[] = [], caption?: string) => spinnerFig(['1', '2', '3', '4'], 'A spinner with four equal sections numbered 1 to 4.', { lit, caption })

/* ---------- Rung 1: relative frequency ---------- */

play(relative, 'Spin the spinner and watch the relative frequency', 'P4 p171 Relative frequency (play)', { mode: 'spin' })
{
  const p = primFig('?')
  worked(relative, 'Prim asks people what they eat. Find the relative frequency of vegetarian.', 'Relative frequency', 'P4 p171 Example 1 (book’s numbers)', boardModel([], [
    { title: 'Find the total', say: 'Every person asked is one trial. Add up the frequencies.', rows: ['Total = 44 + 23 + 43 = 110'], picture: primFig('110', [[4, 1, 'lit']]) },
    { title: 'Times it happened ÷ total', say: '44 people out of 110 were vegetarian. Simplify by dividing top and bottom by 22.', rows: ['RF = {44|110}', '! RF = {2|5}'], picture: primFig('110', [[1, 1, 'found'], [4, 1, 'lit']], '44 out of 110') },
  ], 'Relative frequency', p), 'Theoretical probability comes from equally likely outcomes. Relative frequency comes from an experiment: the number of times it happened ÷ the total number of trials. Flip a coin 100 times and get 48 heads: the relative frequency of heads is 0.48.')
}
for (const [row, label, count, right, slip] of [[1, 'travelling on public transport', 12, 0.231, 4.333], [4, 'walking to school', 16, 0.308, 3.25]] as const) {
  const p = somFig()
  practice(relative, `Som asks 52 people how they travelled to school. Find the relative frequency of a student ${label}, to 3 decimal places.`, 'P4 p172 Your Turn Q1 (book’s numbers)', p, number(right, String(right)), 'Times it happened ÷ total trials.', boardModel([], [
    { title: 'Times it happened ÷ total', say: `${count} of the 52 people. Divide, then round to 3 decimal places.`, rows: [`RF = {${count}|52} = ${(count / 52).toFixed(5)}…`, `! RF = ${right}`], picture: somFig([[row, 1, 'found']], `${count} out of 52`) },
  ], 'Relative frequency', p), slips(right, [[slip, `That’s 52 ÷ ${count}. Put the count on top: ${count} ÷ 52.`], [Number(right.toFixed(2)), 'Give it to 3 decimal places.']]), RF_BOX)
}
{
  const p = somFig()
  practice(relative, 'Find the relative frequency of a student not cycling to school, to 3 decimal places.', 'P4 p172 Your Turn Q1c (book’s numbers)', p, number(0.827, '0.827'), 'Everyone except the 9 who cycled.', boardModel([], [
    { title: 'Count those not cycling', say: 'Take the 9 cyclists away from the 52.', rows: ['Not cycling = 52 − 9 = 43'], picture: somFig([[1, 1, 'lit'], [2, 1, 'lit'], [4, 1, 'lit']]) },
    { title: 'Divide by the total', say: 'Then round to 3 decimal places.', rows: ['RF = {43|52} = 0.82692…', '! RF = 0.827'], picture: somFig([[1, 1, 'found'], [2, 1, 'found'], [4, 1, 'found']], '43 out of 52') },
  ], 'Relative frequency', p), slips(0.827, [[0.173, 'That’s the relative frequency of cycling. Not cycling is everyone else.'], [0.83, 'Give it to 3 decimal places.']]), RF_BOX)
}
ask(relative, 'A coin is flipped 50 times and lands on heads 23 times. What is the relative frequency of heads?', 'P4 p171 (own numbers)', ['50 flips', '23 heads'], fraction('23/50'), 'Heads ÷ total flips.', boardModel([], [
  { title: 'Times it happened ÷ total', say: '23 heads out of 50 flips.', rows: ['! RF = {23|50}'] },
], 'Relative frequency'))

/* ---------- Rung 2: expected frequency ---------- */

ask(expected, 'Guess first: a fair spinner has 4 equal parts. It is spun 200 times. How many times do you expect it to land on 1?', 'P4 p171 (guess first)', ['Spinner with 4 equal parts', '200 spins'], number(50, '50'), 'A quarter of the spins.', boardModel([], [
  { title: 'A quarter of 200', say: 'P(1) = ¼, so expect about a quarter of the spins to land on 1.', rows: ['¼ × 200 = 50', '! About 50 times'] },
], 'Expected'), slips(50, [[25, 'That’s for 100 spins. There are 200.'], [4, 'A quarter of the spins land on 1: 200 ÷ 4.']]), { label: 'Spins', prefix: 'Expect' })
play(expected, 'Spin 100 times. About how many land on 1?', 'P4 p171 Expected frequency (play)', { mode: 'spin' })

{
  const p = primFig('110', [[1, 1, 'lit']])
  worked(expected, 'Prim’s town has 20 000 people. How many would you expect to be vegetarian?', 'Expected frequency', 'P4 p171 Example 1 (book’s numbers)', boardModel([], [
    { title: 'The relative frequency', say: 'From Prim’s table, 2 in every 5 people are vegetarian.', rows: ['RF = {44|110} = {2|5}'], picture: primFig('110', [[1, 1, 'lit'], [4, 1, 'lit']]) },
    { title: 'Probability × trials', say: 'Use it as the probability, and times by the number of people.', rows: ['{2|5} × 20 000 = 8000', '! Expected = 8000'], picture: primFig('110', [[1, 1, 'found'], [4, 1, 'lit']], '8000 of 20 000') },
  ], 'Expected frequency', p), 'Expected frequency = probability × number of trials. Roll a fair die 60 times and you expect a 6 about 1/6 × 60 = 10 times. It’s what you expect on average, not a promise.')
}
{
  const labels = ['1', '2', '3', '4', '5']
  const p = spinnerFig(labels, 'A fair spinner with five equal sections numbered 1 to 5.')
  practice(expected, 'This fair spinner is spun 200 times. How many times would you expect it to land on 5?', 'P4 p171 (own numbers)', p, number(40, '40'), 'Probability × number of spins.', boardModel([], [
    { title: 'The probability', say: 'Five equal sections, one of them a 5.', rows: ['P(5) = {1|5}'], picture: spinnerFig(labels, 'A fair spinner with the 5 section shaded.', { lit: [4] }) },
    { title: 'Probability × trials', say: 'A fifth of 200.', rows: ['{1|5} × 200 = 40', '! Expected = 40'], picture: spinnerFig(labels, 'A fair spinner with the 5 section shaded.', { lit: [4], caption: '40 of 200 spins' }) },
  ], 'Expected frequency', p), slips(40, [[1000, 'That’s 200 × 5. The probability is 1/5: divide by 5.'], [0.2, 'That’s the probability. Times it by 200 spins.']]), COUNT_BOX)
}
const trip = ['Pizza Cottage: 0.4', 'Dazza’s Fish and Chips: 0.5', 'Burger Queen: 0.1', '16 people chose Burger Queen.']
ask(expected, 'How many people were on the school trip in total?', 'P4 p173 Your Turn Q5a (book’s numbers)', trip, number(160, '160'), '0.1 of the total is 16.', boardModel([], [
  { title: 'Work backwards', say: '0.1 of the people is 16, so divide 16 by 0.1.', rows: ['0.1 × total = 16', 'Total = 16 ÷ 0.1 = 160', '! Total = 160'] },
], 'Expected frequency'), slips(160, [[1.6, 'That’s 16 × 0.1. 16 is a tenth of the total: divide by 0.1.'], [16, 'That’s just Burger Queen. 16 is a tenth of everyone.']]), { label: 'People', prefix: 'Total =' })
ask(expected, 'How many chose Pizza Cottage?', 'P4 p173 Your Turn Q5b (book’s numbers)', [...trip.slice(0, 3), '160 people in total.'], number(64, '64'), 'Probability × total.', boardModel([], [
  { title: 'Probability × total', say: '0.4 of the 160 people.', rows: ['0.4 × 160 = 64', '! Pizza = 64'] },
], 'Expected frequency'), slips(64, [[400, 'That’s 160 ÷ 0.4. Times by 0.4 instead.'], [40, 'Use the total, 160, not 100.']]), COUNT_BOX)
ask(expected, 'How many chose Dazza’s Fish and Chips?', 'P4 p173 Your Turn Q5c (book’s numbers)', [...trip.slice(0, 3), '160 people in total.'], number(80, '80'), 'Probability × total.', boardModel([], [
  { title: 'Probability × total', say: '0.5 of the 160 people: half of them.', rows: ['0.5 × 160 = 80', '! Fish and chips = 80'] },
], 'Expected frequency'), slips(80, [[320, 'That’s 160 ÷ 0.5. Times by 0.5 instead.'], [50, 'Use the total, 160, not 100.']]), COUNT_BOX)

/* ---------- Rung 3: spotting bias ---------- */

{
  const p = amberFig()
  worked(bias, 'Amber spins her spinner 150 times. It lands on 1 54 times. Is the spinner biased?', 'Spotting bias', 'P4 p172 Example 2 (book’s numbers)', boardModel([], [
    { title: 'The relative frequency', say: '54 ones out of 150 spins.', rows: ['RF = {54|150} = 0.36'], picture: amberFig([0]) },
    { title: 'The theoretical probability', say: 'If it were fair, each of the 4 sections would come up equally often.', rows: ['P(1) = {1|4} = 0.25'], picture: amberFig([0], '0.36 against 0.25') },
    { title: 'Compare them', say: '0.36 is a lot more than 0.25 after 150 spins. The spinner looks biased towards 1.', rows: ['! 36% against 25%: biased'], picture: amberFig([0], 'Biased towards 1') },
  ], 'Bias', p), 'A fair spinner, coin or die has every outcome equally likely. A biased one doesn’t. Compare the relative frequency with the theoretical probability: if they’re a long way apart after lots of trials, it’s probably biased.')
}
const bev = ['Bev thinks her 6-sided die is more likely to land on 6.', 'She rolls it 400 times and gets 63 sixes.']
ask(bias, 'What is the relative frequency of a six?', 'P4 p172 Your Turn Q2 (book’s numbers)', bev, number(0.1575, '0.1575'), 'Sixes ÷ total rolls.', boardModel([], [
  { title: 'Times it happened ÷ total', say: '63 sixes out of 400 rolls.', rows: ['RF = {63|400}', '! RF = 0.1575'] },
], 'Bias'), slips(0.1575, [[6.349, 'That’s 400 ÷ 63. Put the sixes on top: 63 ÷ 400.'], [0.63, 'Divide by 400, not 100.']]), RF_BOX)
ask(bias, 'Is there evidence that Bev’s die is more likely to land on 6?', 'P4 p172 Your Turn Q2 (book’s numbers)', [...bev, 'Relative frequency of a six: 0.1575'], choose('No: 0.1575 is close to 1/6 ≈ 0.167',
  ['Yes: 63 is a lot of sixes', 'You’d expect about 400 ÷ 6 ≈ 67 sixes from a fair die. 63 is fewer than that.'],
  ['Yes: 0.1575 is more than 0.1', 'Compare with the fair probability, 1/6 ≈ 0.167, not 0.1.']), 'Compare with 1/6.', boardModel([], [
  { title: 'The fair probability', say: 'A fair die gives each number a 1 in 6 chance.', rows: ['P(6) = {1|6} ≈ 0.167'] },
  { title: 'Compare them', say: '0.1575 is close to 0.167, and a little under it. Six isn’t coming up more often.', rows: ['! 0.1575 is close to 0.167: no evidence'] },
], 'Bias'))
{
  const hannah = (tones: [number, number, FigureTone][] = [], caption?: string) => tableFig([['', 'Silver', 'Not silver'], ['Morning', '32', '48'], ['Evening', '41', '111']],
    'Hannah’s counts: morning 32 silver, 48 not silver; evening 41 silver, 111 not silver.', { tones, caption, headColumn: true })
  const p = hannah()
  practice(bias, 'From her morning count, Hannah says 40% of the cars in her town are silver. How reliable is that?', 'P4 p173 Your Turn Q3a (book’s numbers)', p, choose('It fits the morning, but 80 cars is a small sample',
    ['It’s certainly right: 32 out of 80 is 40%', 'The sum is right, but half an hour of cars may not stand for the whole town.'],
    ['It’s wrong: 32 is not 40', '32 is out of 80 cars, and 32 ÷ 80 = 0.4, which is 40%.']), 'Work out 32 ÷ 80, then think about how many cars that is.', boardModel([], [
    { title: 'Check her sum', say: '32 silver out of 32 + 48 = 80 cars.', rows: ['RF = {32|80} = 0.4'], picture: hannah([[1, 1, 'lit'], [1, 2, 'lit']]) },
    { title: 'How many trials?', say: 'Only 80 cars in half an hour. More cars would give a better estimate.', rows: ['! 40% fits, but the sample is small'], picture: hannah([[1, 1, 'found'], [1, 2, 'found']], '80 cars only') },
  ], 'Bias', p))
  practice(bias, 'Using all the data, find the relative frequency of a car being silver, to 3 decimal places.', 'P4 p173 Your Turn Q3b (book’s numbers)', p, number(0.315, '0.315'), 'All the silver cars ÷ all the cars.', boardModel([], [
    { title: 'Add up the silver', say: 'Morning and evening together.', rows: ['Silver = 32 + 41 = 73'], picture: hannah([[1, 1, 'lit'], [2, 1, 'lit']]) },
    { title: 'Add up every car', say: 'Silver and not silver, morning and evening.', rows: ['Cars = 80 + 152 = 232'], picture: hannah([[1, 1, 'lit'], [2, 1, 'lit'], [1, 2, 'lit'], [2, 2, 'lit']]) },
    { title: 'Divide and round', say: 'Then round to 3 decimal places.', rows: ['RF = {73|232} = 0.31465…', '! RF = 0.315'], picture: hannah([[1, 1, 'found'], [2, 1, 'found']], '73 out of 232') },
  ], 'Relative frequency', p), slips(0.315, [[0.27, 'That’s 41 ÷ 152, the evening only. Use all the data.'], [0.31, 'Give it to 3 decimal places.'], [0.46, 'That’s 73 ÷ 159: silver ÷ not silver. Divide by every car, 232.']]), RF_BOX)
  practice(bias, 'There are 5000 cars in the town. Use your answer, 0.315, to estimate how many are silver.', 'P4 p173 Your Turn Q3c (book’s numbers)', p, number(1575, '1575'), 'Relative frequency × number of cars.', boardModel([], [
    { title: 'Probability × trials', say: 'Use 0.315 as the probability that a car is silver.', rows: ['0.315 × 5000 = 1575', '! Silver ≈ 1575'], picture: hannah([], '1575 of 5000') },
  ], 'Expected frequency', p), slips(1575, [[1573, 'Close: that uses 73/232 exactly. The question says to use 0.315.'], [15873, 'That’s 5000 ÷ 0.315. Times instead.']]), { label: 'Cars', prefix: 'n =' })
}

/* ---------- Rung 4: more trials ---------- */

ask(trials, 'Guess first: one estimate of P(1) comes from 10 spins, another from 1000. Which would you trust more?', 'P4 p171 (guess first)', ['10 spins', '1000 spins'], choose('1000 spins',
  ['10 spins', 'A few spins wobble a lot: 4 ones in 10 spins gives 0.4, far from 0.25.'], ['Both the same', 'More spins settle closer to the true probability, as on the spin board.']),
'Think back to the spin board: when did it settle?', boardModel([], [
  { title: 'More trials settle', say: 'The relative frequency wobbles for a few spins and settles near the probability as the spins add up.', rows: ['! 1000 spins'] },
], 'Trials'))

function coinFig(tones: [number, number, FigureTone][] = [], caption?: string): AngleFrame {
  return tableFig([['', 'Flips', 'Heads', 'RF'], ['Ali', '10', '7', '0.7'], ['Ben', '1000', '508', '0.508']],
    'Ali flips a coin 10 times and gets 7 heads. Ben flips it 1000 times and gets 508 heads.', { tones, caption, headColumn: true })
}
{
  const p = coinFig()
  worked(trials, 'Ali and Ben each test a coin. Whose estimate of P(heads) is more reliable?', 'More trials', 'P4 p171 More trials (own numbers)', boardModel([], [
    { title: 'Compare with the theory', say: 'A fair coin lands on heads half the time: 0.5.', rows: ['P(heads) = 0.5'], picture: coinFig([[1, 3, 'lit'], [2, 3, 'lit']]) },
    { title: 'Look at the trials', say: '10 flips can easily give 7 heads by chance. Over 1000 flips the luck evens out.', rows: ['! Ben’s: 1000 trials, not 10'], picture: coinFig([[2, 1, 'found'], [2, 3, 'found']], 'More trials, more reliable') },
  ], 'Trials', p), 'The more trials, the more reliable the relative frequency. With lots of trials it settles close to the true probability.')
}
const dice = ['Bob rolls an 8-sided die 100 times: 7 comes up 15 times.', 'Susan rolls the same die 500 times: 7 comes up 60 times.']
ask(trials, 'What is Bob’s relative frequency of throwing a 7?', 'P4 p173 Your Turn Q4a (book’s numbers)', dice, number(0.15, '0.15'), 'Sevens ÷ total rolls.', boardModel([], [
  { title: 'Times it happened ÷ total', say: '15 sevens out of 100 rolls.', rows: ['RF = {15|100}', '! RF = 0.15'] },
], 'Relative frequency'), slips(0.15, [[6.667, 'That’s 100 ÷ 15. Put the sevens on top.'], [0.125, 'That’s the theoretical probability, 1/8. Use Bob’s results.']]), RF_BOX)
ask(trials, 'What is Susan’s relative frequency of throwing a 7?', 'P4 p173 Your Turn Q4b (book’s numbers)', dice, number(0.12, '0.12'), 'Sevens ÷ total rolls.', boardModel([], [
  { title: 'Times it happened ÷ total', say: '60 sevens out of 500 rolls.', rows: ['RF = {60|500}', '! RF = 0.12'] },
], 'Relative frequency'), slips(0.12, [[8.333, 'That’s 500 ÷ 60. Put the sevens on top.'], [0.6, 'Divide by 500, not 100.']]), RF_BOX)
ask(trials, 'Whose results are more reliable, and why?', 'P4 p173 Your Turn Q4c (book’s numbers)', [...dice, 'Bob: 0.15. Susan: 0.12.'], choose('Susan’s: she rolled the die more times',
  ['Bob’s: his is the bigger number', 'A bigger relative frequency isn’t more reliable. More trials are.'],
  ['Both the same: it’s the same die', 'Same die, but 500 rolls give a steadier estimate than 100.']), 'Who did more trials?', boardModel([], [
  { title: 'Count the trials', say: 'Susan rolled 500 times, Bob 100. Her 0.12 is also closer to the fair 1/8 = 0.125.', rows: ['Fair P(7) = {1|8} = 0.125', '! Susan’s: 500 trials'] },
], 'Trials'))

/* ---------- Review: one of each, our own numbers ---------- */

ask('mixed', 'A drawing pin lands point up 36 times in 120 throws. Find the relative frequency of point up.', 'P4 review (own numbers)', ['36 point up', '120 throws'], number(0.3, '0.3'), 'How often it happened ÷ how many tries.', boardModel([], [
  { title: 'Divide by the throws', say: '36 out of 120 throws.', rows: ['36 ÷ 120 = 0.3', '! RF = 0.3'] },
], 'Relative frequency'), slips(0.3, [[3.33, 'Divide 36 by 120, not 120 by 36.'], [36, 'Divide by the number of throws.']]), RF_BOX)
ask('mixed', 'A spinner lands on 1 with probability 0.4. It is spun 250 times. How many 1s would you expect?', 'P4 review (own numbers)', ['P(1) = 0.4', '250 spins'], number(100, '100'), 'Probability × number of tries.', boardModel([], [
  { title: 'Multiply', say: 'Expect 0.4 of the 250 spins.', rows: ['0.4 × 250 = 100', '! Expected = 100'] },
], 'Expected'), slips(100, [[0.4, 'Multiply by the 250 spins.'], [625, 'Multiply, don’t divide: 0.4 × 250.']]), COUNT_BOX)
ask('mixed', 'Ali gets 6 heads in 10 flips. Ben gets 489 heads in 1000 flips. Whose estimate of P(heads) is more reliable?', 'P4 review (own numbers)', ['Ali: 6 in 10', 'Ben: 489 in 1000'], choose('Ben’s',
  ['Ali’s', '10 flips wobble a lot. More trials give a better estimate.'], ['Both the same', 'More trials settle closer to the true probability.']),
'Who did more trials?', boardModel([], [
  { title: 'More trials', say: 'The more trials, the closer relative frequency settles to the probability.', rows: ['! Ben’s: 1000 flips'] },
], 'Trials'))

add('mixed', 'Relative frequency', 'P4 consolidation', text(
  'Relative frequency = times it happened ÷ total trials.',
  'Expected frequency = probability × number of trials.',
  'Compare relative frequency with the theoretical probability to spot bias.',
  'More trials give a more reliable relative frequency.',
))

export const tutorRelativeFrequencyLesson: TutorMethodLesson = {
  id: 'L304', number: 304, title: 'Relative frequency', level: 'GCSE Foundation',
  steadyPictures: true,
  steadySize: true,
  goal: 'Find relative frequencies from experiments, use them to estimate how often something happens, and spot bias.',
  labels: { [relative]: 'Relative frequency', [expected]: 'Expected frequency', [bias]: 'Spotting bias', [trials]: 'More trials', mixed: 'Review' },
  states: finish(),
}
