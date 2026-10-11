import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { slips } from '../../geometry/tutor/figureLesson'
import { chanceScreens } from './chanceLesson'
import { fraction, venn3Fig, vennFig, type Venn3Region, type VennRegion } from './chancePictures'
import type { SortTile } from '../../written-methods/tutor/SortBoard'

/*
 * Probability and statistics lesson 5: Venn diagrams. From P5 in Sunny's revision book (p174–175), with the book's
 * numbers for the worked examples and our own for most questions. Four rungs: drawing a Venn diagram (numbers 1 to 11,
 * odd and prime: the overlap first, then each circle's own part, then the rest outside); probability from a Venn
 * diagram (what's in the region ÷ everything in the rectangle); counting in a Venn diagram, working backwards from
 * totals (Your Turn Q1 and Q2); and three sets (Your Turn Q3).
 *
 * Brilliant-style (Sunny, 11 Oct): the lesson opens by dragging the numbers 1 to 11 into the circles on the sort board
 * (SortBoard.tsx), each one saying why when it lands in the wrong place, and the first question is built the same way.
 * The probability rung opens with a guess, answered before the rule is shown.
 *
 * Hidden on live: only the unlisted Probability shelf opens it.
 */

const lesson = author(305)
const { add, finish } = lesson
const { worked, practice, playSort, sort, ask } = chanceScreens(lesson)
const fill = 'venn-fill'
const probability = 'venn-probability'
const counts = 'venn-counts'
const three = 'venn-three'

const COUNT_BOX = { label: 'Number', prefix: 'n =' }
type Tones = Partial<Record<VennRegion, FigureTone>>

/* ---------- Pictures ---------- */

/** The book's example: 1 to 11, A odd, B prime. `show` lists the regions written in so far. */
function oddPrimeFig(show: VennRegion[], tones: Tones = {}, caption?: string): AngleFrame {
  const all: Record<VennRegion, string[]> = { both: ['3, 5', '7, 11'], onlyA: ['1, 9'], onlyB: ['2'], outside: ['4, 6', '8, 10'] }
  return vennFig({ names: ['A odd', 'B prime'], regions: Object.fromEntries(show.map(r => [r, all[r]])), tones,
    spoken: 'A Venn diagram of the numbers 1 to 11. A is odd numbers, B is prime numbers.', caption })
}

/** Our own: 1 to 12, A even, B multiples of 3. */
function evenThreeFig(show: VennRegion[], tones: Tones = {}, caption?: string): AngleFrame {
  const all: Record<VennRegion, string[]> = { both: ['6, 12'], onlyA: ['2, 4', '8, 10'], onlyB: ['3, 9'], outside: ['1, 5', '7, 11'] }
  return vennFig({ names: ['A even', 'B × of 3'], regions: Object.fromEntries(show.map(r => [r, all[r]])), tones,
    spoken: 'A Venn diagram of the numbers 1 to 12. A is even numbers, B is multiples of 3.', caption })
}

const ALL: VennRegion[] = ['both', 'onlyA', 'onlyB', 'outside']

/* ---------- Rung 1: drawing a Venn diagram ---------- */

/** The numbers 1 to n as tiles, each sorted by two rules, with why it goes where it does. */
function numberTiles(n: number, inA: (k: number) => boolean, inB: (k: number) => boolean, why: (k: number, a: boolean, b: boolean) => string): SortTile[] {
  return Array.from({ length: n }, (_, i) => i + 1).map(k => {
    const a = inA(k), b = inB(k)
    return { label: String(k), to: a && b ? 'both' : a ? 'onlyA' : b ? 'onlyB' : 'outside', why: why(k, a, b) }
  })
}
const PRIMES = new Set([2, 3, 5, 7, 11])
const oddPrime = numberTiles(11, k => k % 2 === 1, k => PRIMES.has(k), (k, a, b) =>
  k === 1 ? '1 is odd, but 1 is not a prime number.' : k === 9 ? '9 is odd, but not prime: 9 = 3 × 3.' : `${k} is ${a ? 'odd' : 'even'} and ${b ? 'prime' : 'not prime'}.`)
const evenThree = numberTiles(12, k => k % 2 === 0, k => k % 3 === 0, (k, a, b) => `${k} is ${a ? 'even' : 'odd'} and ${b ? 'a multiple of 3' : 'not a multiple of 3'}.`)

playSort(fill, 'Drag each number into the right place. A is odd numbers, B is prime numbers.', 'P5 p174 Example (play)', { kind: 'venn', names: ['A odd', 'B prime'], tiles: oddPrime })
{
  const p = oddPrimeFig([])
  worked(fill, 'Put the numbers 1 to 11 in the Venn diagram. A is odd numbers, B is prime numbers.', 'Drawing a Venn diagram', 'P5 p174 Example (book’s numbers)', boardModel([], [
    { title: 'Start with the overlap', say: 'Which numbers are odd and prime? They go where the circles cross.', rows: ['Both = 3, 5, 7, 11'], picture: oddPrimeFig(['both'], { both: 'lit' }) },
    { title: 'Each circle’s own part', say: 'Odd but not prime: 1 and 9. Prime but not odd: just 2.', rows: ['A only = 1, 9', 'B only = 2'], picture: oddPrimeFig(['both', 'onlyA', 'onlyB'], { onlyA: 'lit', onlyB: 'lit' }) },
    { title: 'The rest go outside', say: 'Numbers in neither set still go in the rectangle, outside both circles.', rows: ['! Outside = 4, 6, 8, 10'], picture: oddPrimeFig(ALL, { outside: 'found' }, 'Every number placed once') },
  ], 'Venn diagram', p), 'Each circle is a set and the overlap is in both. Fill the overlap first; anything in neither still goes in the rectangle (ξ).')
}
sort(fill, 'Sort the numbers 1 to 12. A is even numbers, B is multiples of 3.', 'P5 p174 (own numbers)', { kind: 'venn', names: ['A even', 'B × of 3'], tiles: evenThree }, 'Do the overlap first: even and a multiple of 3.', boardModel([], [
  { title: 'Start with the overlap', say: 'Multiples of 3 are 3, 6, 9, 12. The even ones go in the overlap.', rows: ['Both = 6, 12'], picture: evenThreeFig(['both'], { both: 'lit' }) },
  { title: 'Each circle’s own part', say: 'Even but not a multiple of 3: 2, 4, 8, 10. Multiples of 3 that are odd: 3 and 9.', rows: ['A only = 2, 4, 8, 10', 'B only = 3, 9'], picture: evenThreeFig(['both', 'onlyA', 'onlyB'], { onlyA: 'lit', onlyB: 'lit' }) },
  { title: 'The rest go outside', say: 'Odd and not a multiple of 3.', rows: ['! Outside = 1, 5, 7, 11'], picture: evenThreeFig(ALL, { outside: 'found' }) },
], 'Venn diagram', evenThreeFig([])))
{
  practice(fill, 'How many of the numbers 1 to 12 go outside both circles?', 'P5 p174 (own numbers)', evenThreeFig(['both', 'onlyA', 'onlyB']), number(4, '4'), 'Neither even nor a multiple of 3.', boardModel([], [
    { title: 'Neither set', say: 'Odd numbers that aren’t multiples of 3.', rows: ['Outside = 1, 5, 7, 11', '! 4 numbers'], picture: evenThreeFig(ALL, { outside: 'found' }) },
  ], 'Venn diagram', evenThreeFig(['both', 'onlyA', 'onlyB'])), slips(4, [[0, 'Numbers in neither set still go in the rectangle.'], [6, 'That’s all the odd numbers. 3 and 9 are multiples of 3.']]), COUNT_BOX)
}

/* ---------- Rung 2: probability from a Venn diagram ---------- */

practice(probability, 'A number from 1 to 11 is picked at random. Guess first: which is more likely, odd or prime?', 'P5 p175 (guess first)', oddPrimeFig(ALL), choose('Odd',
  ['Prime', 'Count them in the diagram: 5 primes (2, 3, 5, 7, 11) but 6 odd numbers (1, 3, 5, 7, 9, 11).'], ['Just as likely', 'Count each whole circle: 6 odd numbers, but only 5 primes.']),
'Count each whole circle, the overlap too.', boardModel([], [
  { title: 'Count each circle', say: 'A whole circle is its own part and the overlap. More numbers means more likely.', rows: ['Odd = 2 + 4 = 6', 'Prime = 4 + 1 = 5', '! Odd: 6 out of 11'], picture: oddPrimeFig(ALL, { onlyA: 'lit', both: 'lit' }) },
], 'Probability', oddPrimeFig(ALL)))
{
  const p = oddPrimeFig(ALL)
  worked(probability, 'A number from 1 to 11 is picked at random. Find P(odd and prime).', 'Probability from a Venn', 'P5 p175 (book’s numbers)', boardModel([], [
    { title: 'Count everything', say: 'Every number in the rectangle is one outcome.', rows: ['Total = 11'], picture: oddPrimeFig(ALL, { both: 'lit', onlyA: 'lit', onlyB: 'lit', outside: 'lit' }) },
    { title: 'Count the region', say: 'Odd and prime is the overlap: 3, 5, 7, 11.', rows: ['Both = 4', '! P = {4|11}'], picture: oddPrimeFig(ALL, { both: 'found' }, '4 out of 11') },
  ], 'Probability', p), 'Probability from a Venn diagram: count what’s in the region you want, and divide by everything in the rectangle, outside included.')
}
{
  const p = oddPrimeFig(ALL)
  practice(probability, 'A number from 1 to 11 is picked at random. Find P(odd and not prime).', 'P5 p175 (book’s numbers)', p, fraction('2/11'), 'In A but not in the overlap.', boardModel([], [
    { title: 'Count the region', say: 'Odd and not prime is A’s own part: 1 and 9.', rows: ['A only = 2', '! P = {2|11}'], picture: oddPrimeFig(ALL, { onlyA: 'found' }) },
  ], 'Probability', p))
}
{
  const p = evenThreeFig(ALL)
  practice(probability, 'A number from 1 to 12 is picked at random. Find P(not even and not a multiple of 3).', 'P5 p175 (own numbers)', p, fraction('1/3'), 'Outside both circles.', boardModel([], [
    { title: 'Count the region', say: 'Outside both circles: 1, 5, 7, 11. Out of 12 numbers.', rows: ['Outside = 4', 'P = {4|12}', '! P = {1|3}'], picture: evenThreeFig(ALL, { outside: 'found' }) },
  ], 'Probability', p))
}
{
  const geo = (tones: Tones = {}) => vennFig({ names: ['Geography', 'History'], regions: { onlyA: ['40'], both: ['14'], onlyB: ['52'], outside: ['36'] }, tones,
    spoken: 'Geography only 40, both 14, History only 52, neither 36.' })
  const p = geo()
  practice(probability, 'A student is picked at random. Find the probability they study both Geography and History.', 'P5 p175 Your Turn Q2 (book’s numbers)', p, fraction('7/71'), 'Add every number for the total first.', boardModel([], [
    { title: 'Count everyone', say: 'Add all four numbers, the 36 outside too.', rows: ['Total = 40 + 14 + 52 + 36 = 142'], picture: geo({ onlyA: 'lit', both: 'lit', onlyB: 'lit', outside: 'lit' }) },
    { title: 'The overlap ÷ total', say: 'Both is the overlap. Simplify by dividing by 2.', rows: ['P = {14|142}', '! P = {7|71}'], picture: geo({ both: 'found' }) },
  ], 'Probability', p))
}

/* ---------- Rung 3: counting in a Venn diagram ---------- */

{
  const sport = (r: Partial<Record<VennRegion, string[]>>, tones: Tones = {}, caption?: string) => vennFig({ names: ['Football', 'Rugby'], regions: r, tones,
    spoken: '126 students: who plays football, rugby, both or neither.', caption })
  const p = sport({ onlyA: ['?'], both: ['42'], onlyB: ['?'], outside: ['14'] })
  worked(counts, '126 students in year 9. 14 play neither rugby nor football. 42 play both. Football only to rugby only is 7 : 3. What fraction play rugby only?', 'Counting in a Venn', 'P5 p175 Your Turn Q1 (book’s numbers)', boardModel([], [
    { title: 'Take away what you know', say: 'Take the 14 outside and the 42 in the overlap from 126.', rows: ['126 − 14 − 42 = 70'], picture: sport({ onlyA: ['?'], both: ['42'], onlyB: ['?'], outside: ['14'] }, { both: 'lit', outside: 'lit' }) },
    { title: 'Share 70 in 7 : 3', say: '7 + 3 = 10 parts, so one part is 7.', rows: ['70 ÷ 10 = 7', 'Football only = 7 × 7 = 49', 'Rugby only = 3 × 7 = 21'], picture: sport({ onlyA: ['49'], both: ['42'], onlyB: ['21'], outside: ['14'] }, { onlyA: 'lit', onlyB: 'lit' }) },
    { title: 'Rugby only ÷ total', say: '21 out of 126. Divide top and bottom by 21.', rows: ['Rugby only = {21|126}', '! Fraction = {1|6}'], picture: sport({ onlyA: ['49'], both: ['42'], onlyB: ['21'], outside: ['14'] }, { onlyB: 'found' }, '21 out of 126') },
  ], 'Venn diagram', p), 'Fill a Venn diagram from what you know: the overlap and the outside are often given, and what’s left is shared between the circles’ own parts. Everything adds up to the total.')
}
{
  const p = vennFig({ names: ['Geography', 'History'], regions: { onlyA: ['40'], both: ['14'], onlyB: ['52'], outside: ['36'] }, spoken: 'Geography only 40, both 14, History only 52, neither 36.' })
  practice(counts, 'How many students study History?', 'P5 p175 Your Turn Q2 (own question)', p, number(66, '66'), 'History’s whole circle: its own part and the overlap.', boardModel([], [
    { title: 'Add the whole circle', say: 'History only, plus those doing both.', rows: ['52 + 14 = 66', '! History = 66'], picture: vennFig({ names: ['Geography', 'History'], regions: { onlyA: ['40'], both: ['14'], onlyB: ['52'], outside: ['36'] }, tones: { both: 'found', onlyB: 'found' }, spoken: 'History’s circle shaded.' }) },
  ], 'Venn diagram', p), slips(66, [[52, 'That’s History only. Those doing both study History too.'], [106, 'That’s everyone in either circle. Just History’s circle.']]), COUNT_BOX)
}
{
  const pets = (r: Partial<Record<VennRegion, string[]>>, tones: Tones = {}) => vennFig({ names: ['Cats', 'Dogs'], regions: r, tones, spoken: '60 people: 25 have a cat, 30 have a dog, 8 have both.' })
  const p = pets({ both: ['8'] })
  practice(counts, '60 people are asked about pets. 25 have a cat, 30 have a dog and 8 have both. How many have neither?', 'P5 p175 (own numbers)', p, number(13, '13'), 'Fill the overlap, then each circle’s own part.', boardModel([], [
    { title: 'Each circle’s own part', say: 'Take the 8 with both out of each circle.', rows: ['Cats only = 25 − 8 = 17', 'Dogs only = 30 − 8 = 22'], picture: pets({ onlyA: ['17'], both: ['8'], onlyB: ['22'] }, { onlyA: 'lit', onlyB: 'lit' }) },
    { title: 'The rest go outside', say: 'Take everyone in the circles from 60.', rows: ['60 − 17 − 8 − 22 = 13', '! Neither = 13'], picture: pets({ onlyA: ['17'], both: ['8'], onlyB: ['22'], outside: ['13'] }, { outside: 'found' }) },
  ], 'Venn diagram', p), slips(13, [[5, 'That counts the 8 with both twice. Take 8 from each circle first.'], [21, 'Take the circles’ own parts away too, not just the 8.']]), COUNT_BOX)
}

/* ---------- Rung 4: three sets ---------- */

type R3 = Partial<Record<Venn3Region, string>>
const animals = (regions: R3, tones: Partial<Record<Venn3Region, FigureTone>> = {}, caption?: string) =>
  venn3Fig(['Sharks', 'Crocs', 'Hippos'], regions, '80 students: who likes sharks, crocodiles and hippos.', { tones, caption })
{
  const step1: R3 = { ABC: '15', AB: '14' }
  const step2: R3 = { ...step1, BC: '8', AC: '6' }
  const step3: R3 = { ...step2, onlyB: '7', onlyA: '12' }
  const p = animals(step1)
  worked(three, '80 students all like at least one of sharks, crocodiles and hippos. Find P(only hippos).', 'Three sets', 'P5 p175 Your Turn Q3 (book’s numbers)', boardModel([], [
    { title: 'Start in the middle', say: '15 like all three. 14 like sharks and crocodiles but not hippos.', rows: ['All three = 15', 'Sharks and crocs only = 14'], picture: animals(step1, { ABC: 'lit', AB: 'lit' }) },
    { title: 'The other overlaps', say: '23 like crocodiles and hippos, 21 sharks and hippos: take the 15 in the middle from each.', rows: ['Crocs and hippos only = 23 − 15 = 8', 'Sharks and hippos only = 21 − 15 = 6'], picture: animals(step2, { BC: 'lit', AC: 'lit' }) },
    { title: 'Each circle’s own part', say: '44 like crocodiles: take away the three parts already in that circle. 12 like sharks only.', rows: ['Crocs only = 44 − 15 − 14 − 8 = 7', 'Sharks only = 12'], picture: animals(step3, { onlyB: 'lit', onlyA: 'lit' }) },
    { title: 'What’s left is hippos', say: 'Nobody is outside, so hippos only is 80 take away the rest.', rows: ['80 − (12 + 14 + 15 + 6 + 7 + 8) = 18', '! P = {18|80} = {9|40}'], picture: animals({ ...step3, onlyC: '18', outside: '0' }, { onlyC: 'found' }, '18 out of 80') },
  ], 'Venn diagram', p), 'With three sets, start with the middle, where all three overlap. Then do the overlaps of two, taking the middle away, then each circle’s own part. Last, use the total.')
}
{
  const langs = (regions: R3, tones: Partial<Record<Venn3Region, FigureTone>> = {}) =>
    venn3Fig(['French', 'German', 'Spanish'], regions, '100 students and the languages they study: French, German, Spanish.', { tones })
  const full: R3 = { onlyA: '20', onlyB: '15', onlyC: '25', AB: '10', AC: '4', BC: '6', ABC: '5' }
  const p = langs(full)
  practice(three, '100 students are asked which languages they study. How many study none of the three?', 'P5 p175 (own numbers)', p, number(15, '15'), 'Add every number in the circles, then take from 100.', boardModel([], [
    { title: 'Add the circles', say: 'Every region inside the circles, once each.', rows: ['20 + 15 + 25 + 10 + 4 + 6 + 5 = 85'], picture: langs(full, { onlyA: 'lit', onlyB: 'lit', onlyC: 'lit', AB: 'lit', AC: 'lit', BC: 'lit', ABC: 'lit' }) },
    { title: 'The rest go outside', say: 'Take them from the 100 students.', rows: ['100 − 85 = 15', '! None = 15'], picture: langs({ ...full, outside: '15' }, { outside: 'found' }) },
  ], 'Venn diagram', p), slips(15, [[85, 'That’s how many study at least one. Take it from 100.'], [40, 'Add every region in the circles, the overlaps too.']]), COUNT_BOX)
  practice(three, 'How many study French?', 'P5 p175 (own numbers)', p, number(39, '39'), 'Every region inside the French circle.', boardModel([], [
    { title: 'Add the whole circle', say: 'French only, French and German, French and Spanish, and all three.', rows: ['20 + 10 + 4 + 5 = 39', '! French = 39'], picture: langs(full, { onlyA: 'found', AB: 'found', AC: 'found', ABC: 'found' }) },
  ], 'Venn diagram', p), slips(39, [[20, 'That’s French only. The overlaps are inside the French circle too.'], [34, 'Include the 5 in the middle.']]), COUNT_BOX)
  practice(three, 'A student is picked at random. Find the probability they study exactly two of the languages.', 'P5 p175 (own numbers)', p, fraction('1/5'), 'The overlaps of two, not the middle.', boardModel([], [
    { title: 'Exactly two', say: 'The three overlaps of two. The middle is all three, so leave it out.', rows: ['10 + 4 + 6 = 20', 'P = {20|100}', '! P = {1|5}'], picture: langs(full, { AB: 'found', AC: 'found', BC: 'found' }) },
  ], 'Probability', p))
}

/* ---------- Review: one of each, our own numbers ---------- */

sort('mixed', 'Sort the numbers 1 to 10. A is factors of 12, B is odd numbers.', 'P5 review (own numbers)', { kind: 'venn', names: ['A', 'B'], tiles: numberTiles(10, k => 12 % k === 0, k => k % 2 === 1, (k, a, b) => `${k} is ${a ? 'a factor of 12' : 'not a factor of 12'} and ${b ? 'odd' : 'even'}.`) }, 'Factors of 12 up to 10: 1, 2, 3, 4, 6.', boardModel([], [
  { title: 'Start with the overlap', say: 'Factors of 12 that are odd: 1 and 3.', rows: ['>0 Both: 1, 3'] },
  { title: 'The rest', say: 'Other factors 2, 4, 6. Other odds 5, 7, 9. Neither: 8, 10.', rows: ['! A only 2, 4, 6; B only 5, 7, 9; neither 8, 10'] },
], 'Venn diagram'))
ask('mixed', '40 people: 22 like tea, 25 like coffee, and 10 like both. How many like neither?', 'P5 review (own numbers)', ['40 people', 'Tea 22, coffee 25, both 10'], number(3, '3'), 'Fill the overlap first, then each circle’s own part.', boardModel([], [
  { title: 'Each circle’s own part', say: 'Take the 10 with both out of each.', rows: ['Tea only = 22 − 10 = 12', 'Coffee only = 25 − 10 = 15'] },
  { title: 'The rest go outside', say: 'Take everyone in the circles from 40.', rows: ['40 − 12 − 10 − 15 = 3', '! Neither = 3'] },
], 'Venn diagram'), slips(3, [[-7, 'The 10 with both were counted twice. Take 10 from each circle first.'], [13, 'Take away the circles’ own parts too.']]), COUNT_BOX)
ask('mixed', 'One of the same 40 people is picked at random. Find P(likes tea but not coffee).', 'P5 review (own numbers)', ['Tea only: 12 of the 40'], fraction('3/10'), 'Tea’s own part, out of everyone.', boardModel([], [
  { title: 'Tea only ÷ total', say: '12 like tea but not coffee, out of 40.', rows: ['P = {12|40}', '! P = {3|10}'] },
], 'Probability'))

add('mixed', 'Venn diagrams', 'P5 consolidation', text(
  'Fill the overlap first, then each circle’s own part, then the outside.',
  'Everything in the rectangle adds up to the total.',
  'Probability = what’s in the region ÷ everything in the rectangle.',
  'With three sets, start in the middle and work outwards.',
))

export const tutorVennLesson: TutorMethodLesson = {
  id: 'L305', number: 305, title: 'Venn diagrams', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Draw Venn diagrams, fill in missing numbers, and find probabilities from them, with two or three sets.',
  labels: { [fill]: 'Drawing a Venn diagram', [probability]: 'Probability from a Venn', [counts]: 'Counting in a Venn', [three]: 'Three sets', mixed: 'Review' },
  states: finish(),
}
