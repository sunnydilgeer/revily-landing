import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { slips } from '../../geometry/tutor/figureLesson'
import { chanceScreens } from './chanceLesson'
import { fraction, scaleFig, spinnerFig, tableFig, tilesFig } from './chancePictures'

/*
 * Probability and statistics lesson 1: Probability. From P1 in Sunny's revision book (p162–164), with the book's
 * numbers in the worked examples and Your Turn questions, our own elsewhere. Four rungs: the probability scale from
 * 0 (impossible) to 1 (certain), with its words; equally likely outcomes, ways it can happen over all the outcomes
 * (an even number on a die, the raffle tickets of Your Turn Q5); all the outcomes adding up to 1 (Sarah and Charlie,
 * the spinner, Jimmy's film and the bag of beads); and listing outcomes, in a sample space (Megan's two spinners) or
 * by the product rule (the set menu, Macy's outfits). The first rung opens on the chance board's scale.
 *
 * Hidden on live: only the unlisted Probability shelf opens it.
 */

const lesson = author(301)
const { add, finish } = lesson
const { worked, practice, ask, play, drag } = chanceScreens(lesson)
const scale = 'chance-scale'
const equally = 'chance-equally-likely'
const sumOne = 'chance-sum-to-one'
const outcomes = 'chance-outcomes'

const P_BOX = (prefix = 'P =') => ({ label: 'Probability', prefix })

/* ---------- Rung 1: the probability scale ---------- */

play(scale, 'Drag the arrow along the scale.', 'P1 p162 Probability scale (play)', { mode: 'scale' })
{
  const rain = (tone?: FigureTone) => scaleFig([{ at: 0.65, label: 'Rain 65%', tone }], 'The probability scale from 0 to 1, with rain tomorrow marked at 65 per cent.')
  worked(scale, 'The probability it will rain tomorrow is 65%. Which word describes it?', 'The probability scale', 'P1 p162 Probability scale (book’s numbers)', boardModel([], [
    { title: 'Write it as a decimal', say: '65% means 65 out of 100, which is 0.65. A probability can be a decimal, a fraction or a percentage.', rows: ['65% = 0.65'], picture: rain('lit') },
    { title: 'Compare with a half', say: '0.65 is more than 0.5, the middle of the scale. It’s past even, towards certain.', rows: ['>0 0.65 is more than 0.5', '! Likely'], picture: rain('found') },
  ], 'Scale', rain()), 'A probability is a number from 0 to 1. 0 is impossible, 1 is certain and 0.5 is an even chance. Below a half is unlikely; above a half is likely. We write the probability of X as P(X): P(Film) = 0.8.')
}
{
  const fog = (tone?: FigureTone) => scaleFig([{ at: 1 / 6, label: 'Fog 1/6', tone }], 'The probability scale from 0 to 1, with fog tomorrow marked at one sixth.')
  practice(scale, 'The probability it will be foggy tomorrow is 1/6. Which word describes it?', 'P1 p162 (book’s numbers)', fog(), choose('Unlikely',
    ['Likely', '1/6 is less than a half, so it’s on the unlikely side.'],
    ['Even', 'Even is exactly a half. 1/6 is much less.'],
    ['Impossible', 'Impossible is 0. 1/6 is more than 0, so it could happen.']), 'Is 1/6 more or less than a half?', boardModel([], [
    { title: 'Compare with a half', say: '1/6 is less than 3/6, which is a half. It’s between impossible and even.', rows: ['>0 1/6 is less than 1/2', '! Unlikely'], picture: fog('found') },
  ], 'Scale', fog()))
}
{
  const two = (tone?: FigureTone) => scaleFig([{ at: 0.3, label: 'A: 0.3', tone }, { at: 0.35, label: 'B: 35%', tone }], 'The probability scale with A at 0.3 and B at 35 per cent.')
  practice(scale, 'P(A) = 0.3 and P(B) = 35%. Which is more likely?', 'P1 p162 (own numbers)', two(), choose('B',
    ['A', '35% is 0.35, which is more than 0.3.'],
    ['They’re the same', '35% is 0.35, not 0.3.']), 'Write them both as decimals.', boardModel([], [
    { title: 'Both as decimals', say: '35% is 0.35. Now compare 0.3 with 0.35.', rows: ['35% = 0.35', '>0 0.35 is more than 0.3'], picture: two('lit') },
    { title: 'Further along wins', say: 'The one further towards 1 is more likely.', rows: ['! B is more likely'], picture: two('found') },
  ], 'Scale', two()))
}
ask(scale, 'You roll an ordinary dice. Which word describes rolling a 7?', 'P1 p162 (own numbers)', ['An ordinary dice has the numbers 1 to 6.', 'What is the chance of rolling a 7?'], choose('Impossible',
  ['Unlikely', 'Unlikely means it could happen. There is no 7 on the dice at all.'],
  ['Even', 'Even is a half. There is no 7 on the dice.'],
  ['Certain', 'Certain means it always happens. A 7 can never come up.']), 'Is there a 7 on the dice?', boardModel([], [
  { title: 'Can it happen?', say: 'The dice only shows 1 to 6. There are no ways to roll a 7, so the probability is 0.', rows: ['P(7) = 0', '! Impossible'] },
]))

drag(scale, 'A spinner has 4 equal parts, and 1 of them is red. Drag the arrow to P(red).', 'P1 p162 (own numbers)', { mode: 'scale', from: [10] }, ['0.25'], '0.25', 'One part out of 4 equal parts.', boardModel([], [
  { title: 'One out of four', say: '1 red part out of 4 equal parts: a quarter.', rows: ['P(red) = {1|4}', '! P(red) = 0.25'] },
], 'Probability'), r => Number(r) > 0.5 ? 'Only 1 of the 4 parts is red, so red is unlikely: less than ½.' : `That’s ${r}. One part of 4 is a quarter: 0.25.`)

/* ---------- Rung 2: equally likely outcomes ---------- */

ask(equally, 'Guess first: on a fair dice, which is more likely, an even number or a number bigger than 4?', 'P1 p162 (guess first)', ['A fair dice: 1, 2, 3, 4, 5, 6'], choose('An even number',
  ['A number bigger than 4', 'Bigger than 4 is only 5 and 6: 2 numbers. Even is 2, 4 and 6: 3 numbers.'], ['Just as likely', 'Count them: 3 even numbers, but only 2 bigger than 4.']),
'Count the numbers that work for each.', boardModel([], [
  { title: 'Count each one', say: 'Every number is equally likely, so the one with more numbers wins.', rows: ['Even = 2, 4, 6: 3 of 6', 'Bigger than 4 = 5, 6: 2 of 6', '! An even number'] },
], 'Guess'))

{
  const die = (lit: boolean, tone: FigureTone = 'lit') => tilesFig(['1', '2', '3', '4', '5', '6'], 'The six faces of a fair dice: 1, 2, 3, 4, 5 and 6.', lit ? { tones: { 1: tone, 3: tone, 5: tone } } : {})
  worked(equally, 'Find the probability of rolling an even number on a fair dice.', 'Equally likely outcomes', 'P1 p162 Calculating probabilities (book’s numbers)', boardModel([], [
    { title: 'Count the ways', say: 'The even numbers are 2, 4 and 6: 3 ways.', rows: ['>0 Even: 2, 4, 6', 'Ways = 3'], picture: die(true) },
    { title: 'Count all outcomes', say: 'A fair dice has 6 sides, all equally likely.', rows: ['Outcomes = 6'], picture: die(false) },
    { title: 'Ways over outcomes', say: '3 out of 6 is a half.', rows: ['P(even) = {3|6}', '! P(even) = {1|2}'], picture: die(true, 'found') },
  ], 'Probability', die(false)), 'When every outcome is equally likely: P(X) = the number of ways X can happen ÷ the total number of outcomes.')
}
{
  const labels = ['1', '2', '3', '4', '5', '6', '7', '8']
  const s = (lit?: number[]) => spinnerFig(labels, 'A fair spinner with eight equal sections numbered 1 to 8.', lit ? { lit } : {})
  practice(equally, 'This fair spinner is spun once. Find the probability it lands on a prime number.', 'P1 p162 (own numbers)', s(), fraction('1/2'), 'The primes up to 8 are 2, 3, 5 and 7.', boardModel([], [
    { title: 'Count the primes', say: '2, 3, 5 and 7 are prime. 1 is not prime.', rows: ['>0 Primes: 2, 3, 5, 7', 'Ways = 4'], picture: s([1, 2, 4, 6]) },
    { title: 'Ways over outcomes', say: '4 out of 8 equal sections.', rows: ['P(prime) = {4|8}', '! P(prime) = {1|2}'], picture: s([1, 2, 4, 6]) },
  ], 'Probability', s()), slips(1 / 2, [[5 / 8, '1 is not a prime number.'], [3 / 8, '2 is prime: it has exactly two factors.']]))
}
{
  const labels = ['Red', 'Blue', 'Red', 'Green', 'Red']
  const s = (lit?: number[]) => spinnerFig(labels, 'A fair spinner with five equal sections: three red, one blue, one green.', lit ? { lit } : {})
  practice(equally, 'This fair spinner is spun once. Find P(Red).', 'P1 p162 (own numbers)', s(), fraction('3/5'), 'Count the red sections.', boardModel([], [
    { title: 'Count the reds', say: 'Three of the five equal sections are red.', rows: ['Ways = 3', 'Outcomes = 5'], picture: s([0, 2, 4]) },
    { title: 'Ways over outcomes', say: '3 out of 5.', rows: ['! P(Red) = {3|5}'], picture: s([0, 2, 4]) },
  ], 'Probability', s()), slips(3 / 5, [[1 / 3, 'That’s 1 out of 3 colours. The sections are what’s equally likely, not the colours.'], [2 / 5, 'That’s the chance it’s not red.']]))
}
ask(equally, 'Raffle tickets numbered 1 to 50 are put in a hat. One is picked at random. What is the probability it is a multiple of 5 or an odd number?', 'P1 Your Turn Q5a (book’s numbers)',
  ['Tickets 1 to 50, one picked at random.', 'P(multiple of 5 or odd) = ?'], fraction('3/5'), 'Count the odd numbers, then the even multiples of 5.', boardModel([], [
    { title: 'Count the odd numbers', say: 'Half of 1 to 50 are odd.', rows: ['Odd numbers = 25'] },
    { title: 'Add even multiples of 5', say: 'The odd multiples of 5 are already counted. Add the even ones: 10, 20, 30, 40, 50.', rows: ['>0 10, 20, 30, 40, 50', 'Ways = 25 + 5 = 30'] },
    { title: 'Ways over outcomes', say: '30 out of 50.', rows: ['P = {30|50}', '! P = {3|5}'] },
  ], 'Probability'), slips(3 / 5, [[35 / 50, '5, 15, 25, 35 and 45 are odd and multiples of 5. Count them once only.'], [1 / 5, 'That’s just the multiples of 5. Odd numbers count too.']]))
ask(equally, 'A ticket numbered 1 to 50 is picked at random. What is the probability it is a factor of 48?', 'P1 Your Turn Q5b (book’s numbers)',
  ['Tickets 1 to 50, one picked at random.', 'P(factor of 48) = ?'], fraction('1/5'), 'List the factors of 48 in pairs.', boardModel([], [
    { title: 'List the factors', say: 'In pairs: 1 × 48, 2 × 24, 3 × 16, 4 × 12, 6 × 8.', rows: ['>0 1, 2, 3, 4, 6, 8, 12, 16, 24, 48', 'Ways = 10'] },
    { title: 'Ways over outcomes', say: '10 out of 50.', rows: ['P = {10|50}', '! P = {1|5}'] },
  ], 'Probability'), slips(1 / 5, [[9 / 50, 'Count 1 and 48 too: both are factors of 48.'], [8 / 50, '1 and 48 are factors of 48 as well.']]))

/* ---------- Rung 3: adding up to 1 ---------- */

drag(sumOne, 'Guess first: the probability it rains tomorrow is 0.3. Drag the arrow to the probability it doesn’t rain.', 'P1 p162 (guess first)', { mode: 'scale', from: [6] }, ['0.7'], '0.7', 'It either rains or it doesn’t.', boardModel([], [
  { title: 'One or the other', say: 'It either rains or it doesn’t, so the two probabilities add up to 1.', rows: ['1 − 0.3 = 0.7', '! P(no rain) = 0.7'] },
], 'Probability'), r => r === '0.3' ? 'That’s P(rain). Not raining is everything else: 1 − 0.3.' : 'Rain or no rain must happen, so together they make 1: 1 − 0.3.')

{
  const t = (tones: [number, number, FigureTone][], draw = '?', charlie = '?') => tableFig([['Sarah', 'Draw', 'Charlie'], ['0.6', draw, charlie]], 'A table of the three outcomes: Sarah wins 0.6, a draw, Charlie wins.', { tones })
  worked(sumOne, 'Sarah and Charlie play a game. P(Sarah wins) = 0.6 and a draw is half as likely as Sarah winning. Find P(Charlie wins).', 'Adding up to 1', 'P1 p163 Example (book’s numbers)', boardModel([], [
    { title: 'Half of Sarah’s', say: 'A draw is half as likely as Sarah winning.', rows: ['P(draw) = 0.6 ÷ 2 = 0.3'], picture: t([[1, 1, 'lit']], '0.3') },
    { title: 'Add what you know', say: 'Sarah wins, a draw, Charlie wins: these are all the outcomes, so they add up to 1.', rows: ['0.6 + 0.3 + P(Charlie) = 1', '0.9 + P(Charlie) = 1'], picture: t([[1, 0, 'lit'], [1, 1, 'lit']], '0.3') },
    { title: 'Take it from 1', say: 'Take 0.9 from both sides.', rows: ['! P(Charlie) = 1 − 0.9 = 0.1'], picture: t([[1, 2, 'found']], '0.3', '0.1') },
  ], 'Probability', t([])), 'All the possible outcomes add up to 1. A coin: P(heads) + P(tails) = ½ + ½ = 1. So the chance something doesn’t happen is 1 minus the chance it does.')
}
{
  const t = (c = '?', tone?: FigureTone) => tableFig([['A', 'B', 'C'], ['55%', '2/5', c]], 'A spinner’s three sections: P(A) = 55%, P(B) = 2/5, P(C) unknown.', tone ? { tones: [[1, 2, tone]] } : {})
  practice(sumOne, 'A spinning wheel has sections A, B and C. P(A) = 55% and P(B) = 2/5. Find P(C) as a decimal.', 'P1 Your Turn Q1 (book’s numbers)', t(), number(0.05, '0.05'), 'Make them all decimals, then take them from 1.', boardModel([], [
    { title: 'All as decimals', say: '55% is 0.55 and 2/5 is 0.4.', rows: ['55% = 0.55', '{2|5} = 0.4'], picture: t('?', 'lit') },
    { title: 'Take them from 1', say: 'A, B and C add up to 1.', rows: ['0.55 + 0.4 = 0.95', '! P(C) = 1 − 0.95 = 0.05'], picture: t('0.05', 'found') },
  ], 'Probability', t()), slips(0.05, [[0.45, 'That only takes off A. Take off B as well.'], [5, 'Write it as a decimal: 5% is 0.05.'], [0.6, 'That only takes off B. Take off A as well.']]), P_BOX('P(C) ='))
}
{
  const t = (x = 'x', tone?: FigureTone) => tableFig([['Rom com', 'Horror', 'Sci-fi'], ['0.56', x, x]], 'Jimmy’s film: romantic comedy 0.56, horror and sci-fi equally likely.', tone ? { tones: [[1, 1, tone], [1, 2, tone]] } : {})
  practice(sumOne, 'Jimmy watches a romantic comedy, a horror or a sci-fi film. P(romantic comedy) = 0.56. Horror and sci-fi are equally likely. Find P(sci-fi).', 'P1 Your Turn Q2a (book’s numbers)', t(), number(0.22, '0.22'), 'What’s left after 0.56 is shared equally by two films.', boardModel([], [
    { title: 'What’s left', say: 'All three add up to 1.', rows: ['1 − 0.56 = 0.44'], picture: t('x', 'lit') },
    { title: 'Share it equally', say: 'Horror and sci-fi share 0.44 equally.', rows: ['0.44 ÷ 2 = 0.22', '! P(sci-fi) = 0.22'], picture: t('0.22', 'found') },
  ], 'Probability', t()), slips(0.22, [[0.44, 'That’s horror and sci-fi together. Halve it.'], [0.28, 'Take 0.56 from 1 first, then halve.']]), P_BOX('P(sci-fi) ='))
}
{
  const t = (blue = '5x', green = '4x', tones: [number, number, FigureTone][] = []) => tableFig([['Colour', 'Red', 'Blue', 'Green'], ['Probability', '0.25', blue, green]], 'A bag of beads: red 0.25, blue 5x, green 4x.', { tones })
  practice(sumOne, 'A bag has red, blue and green beads. The table shows the probabilities. Find P(blue).', 'P1 Your Turn Q4a (book’s numbers)', t(), fraction('5/12'), 'Red, blue and green add up to 1. Find x first.', boardModel([], [
    { title: 'They add up to 1', say: '0.25 + 5x + 4x = 1, so 9x is what’s left after red.', rows: ['9x = 1 − 0.25 = 0.75 = {3|4}'], picture: t('5x', '4x', [[1, 2, 'lit'], [1, 3, 'lit']]) },
    { title: 'Find x', say: 'Divide 3/4 by 9.', rows: ['x = {3|4} ÷ 9 = {3|36} = {1|12}'], picture: t('5x', '4x', [[1, 2, 'lit'], [1, 3, 'lit']]) },
    { title: 'Five lots of x', say: 'Blue is 5x.', rows: ['! P(blue) = 5 × {1|12} = {5|12}'], picture: t('5/12', '4x', [[1, 2, 'found']]) },
  ], 'Probability', t()), slips(5 / 12, [[1 / 12, 'That’s x. Blue is 5x.'], [5 / 9, 'Red takes 0.25 first: 9x is 0.75, not 1.']]))
  practice(sumOne, 'Using the same table, find P(green).', 'P1 Your Turn Q4b (book’s numbers)', t(), fraction('1/3'), 'You found x = 1/12. Green is 4x.', boardModel([], [
    { title: 'Find x', say: '9x = 0.75, so x = 1/12.', rows: ['9x = {3|4}', 'x = {1|12}'], picture: t('5x', '4x', [[1, 3, 'lit']]) },
    { title: 'Four lots of x', say: 'Green is 4x.', rows: ['4 × {1|12} = {4|12}', '! P(green) = {1|3}'], picture: t('5x', '1/3', [[1, 3, 'found']]) },
  ], 'Probability', t()), slips(1 / 3, [[1 / 12, 'That’s x. Green is 4x.'], [4 / 9, 'Red takes 0.25 first: 9x is 0.75, not 1.']]))
}

/* ---------- Rung 4: listing outcomes ---------- */

ask(outcomes, 'Guess first: two coins are flipped. How many different outcomes are there?', 'P1 p163 (guess first)', ['Two fair coins, each heads or tails'], choose('4',
  ['3', 'Heads then tails and tails then heads are different: HH, HT, TH, TT.'], ['2', 'Each coin can land 2 ways, for each way the other lands: HH, HT, TH, TT.']),
'List them: what can the first coin do, and the second?', boardModel([], [
  { title: 'List them in order', say: 'The first coin, then the second. HT and TH are different outcomes.', rows: ['>0 HH, HT, TH, TT', '! Outcomes = 4'] },
], 'Outcomes'))

/** A sample space for two spinners numbered 1 to n, added: the heading row and column, then each sum. */
function sumSpace(n: number, lit: (sum: number) => boolean, tone: FigureTone | null, spoken: string): AngleFrame {
  const head = ['+', ...Array.from({ length: n }, (_, k) => String(k + 1))]
  const rows = [head, ...Array.from({ length: n }, (_, r) => [String(r + 1), ...Array.from({ length: n }, (_, c) => String(r + c + 2))])]
  const tones: [number, number, FigureTone][] = []
  if (tone) for (let r = 1; r <= n; r++) for (let c = 1; c <= n; c++) if (lit(r + c)) tones.push([r, c, tone])
  return tableFig(rows, spoken, { tones, headColumn: true })
}
{
  const spoken = 'A sample space for two spinners numbered 1 to 5: each cell is the sum of the two scores.'
  const s = (tone: FigureTone | null) => sumSpace(5, sum => sum >= 8, tone, spoken)
  worked(outcomes, 'Megan spins two spinners numbered 1 to 5 and adds the scores. Find P(8 or more).', 'Listing outcomes', 'P1 p163 Listing outcomes (book’s numbers)', boardModel([], [
    { title: 'Fill in the sample space', say: 'A two-way table lists every pair: 5 scores on one spinner times 5 on the other.', rows: ['Outcomes = 5 × 5 = 25'], picture: s(null) },
    { title: 'Find 8 or more', say: 'Light up every sum of 8, 9 or 10.', rows: ['>0 8, 8, 8, 9, 9, 10', 'Ways = 6'], picture: s('lit') },
    { title: 'Ways over outcomes', say: '6 of the 25 equally likely outcomes.', rows: ['! P(8 or more) = {6|25}'], picture: s('found') },
  ], 'Probability', s(null)), 'A sample space lists every outcome of two events, often in a two-way table. When there are too many to list, the product rule counts them: multiply the number of outcomes for each event.')
}
{
  const spoken = 'A sample space for two spinners numbered 1 to 4: each cell is the sum of the two scores.'
  const s = (tone: FigureTone | null) => sumSpace(4, sum => sum === 5, tone, spoken)
  practice(outcomes, 'Two spinners numbered 1 to 4 are spun and the scores added. Find P(total of 5).', 'P1 p163 (own numbers)', s(null), fraction('1/4'), 'Count the 5s in the table.', boardModel([], [
    { title: 'Count all outcomes', say: '4 scores times 4 scores.', rows: ['Outcomes = 4 × 4 = 16'], picture: s(null) },
    { title: 'Count the 5s', say: '1 + 4, 2 + 3, 3 + 2 and 4 + 1.', rows: ['Ways = 4'], picture: s('lit') },
    { title: 'Ways over outcomes', say: '4 out of 16.', rows: ['P = {4|16}', '! P(5) = {1|4}'], picture: s('found') },
  ], 'Probability', s(null)), slips(1 / 4, [[2 / 16, '2 + 3 and 3 + 2 are different outcomes. Count both orders.'], [4 / 8, 'There are 16 outcomes, not 8: 4 × 4.']]))
}
ask(outcomes, 'A set menu has 3 starters, 8 main courses and 4 desserts. How many different three-course meals are there?', 'P1 p163 Product rule (book’s numbers)',
  ['3 starters, 8 mains, 4 desserts.', 'How many three-course meals?'], number(96, '96'), 'Multiply the number of choices for each course.', boardModel([], [
    { title: 'Use the product rule', say: 'Each starter goes with each main and each dessert, so multiply.', rows: ['3 × 8 × 4 = 96', '! 96 meals'] },
  ], 'Count'), slips(96, [[15, 'That adds. The product rule multiplies.'], [24, 'Multiply by the 4 desserts too.']]), { label: 'Meals', prefix: 'Meals =' })
ask(outcomes, 'Macy picks trousers (black, navy or purple) and a jumper (orange, yellow or white). How many different outfits can she choose?', 'P1 Your Turn Q3 (book’s numbers)',
  ['Trousers: black, navy, purple', 'Jumpers: orange, yellow, white', 'Black trousers, yellow jumper: BY'], number(9, '9'), 'Each pair of trousers goes with each jumper.', boardModel([], [
    { title: 'List one row', say: 'With black trousers: BO, BY, BW. Navy and purple give 3 more each.', rows: ['>0 BO, BY, BW, NO, NY, NW, PO, PY, PW'] },
    { title: 'Use the product rule', say: '3 trousers times 3 jumpers.', rows: ['3 × 3 = 9', '! 9 outfits'] },
  ], 'Count'), slips(9, [[6, 'That adds. Each pair of trousers goes with every jumper: multiply.'], [8, 'That leaves out BY. Count every outfit.']]), { label: 'Outfits', prefix: 'Outfits =' })

add('mixed', 'Probability', 'P1 consolidation', text(
  'A probability goes from 0 (impossible) to 1 (certain). A half is even.',
  'Equally likely outcomes: P(X) = ways X can happen ÷ total outcomes.',
  'All the outcomes add up to 1, so P(not X) = 1 − P(X).',
  'List outcomes in a sample space, or multiply the choices: the product rule.',
))

export const tutorProbabilityLesson: TutorMethodLesson = {
  id: 'L301', number: 301, title: 'Probability', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Use the probability scale, find probabilities of equally likely outcomes, use the fact that they add up to 1, and list outcomes.',
  labels: { [scale]: 'The probability scale', [equally]: 'Equally likely outcomes', [sumOne]: 'Adding up to 1', [outcomes]: 'Listing outcomes', mixed: 'Review' },
  states: finish(),
}
