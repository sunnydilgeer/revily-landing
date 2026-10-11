import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { slips } from '../../geometry/tutor/figureLesson'
import { chanceScreens } from './chanceLesson'
import { vennFig, type VennRegion, type VennShade } from './chancePictures'

/*
 * Probability and statistics lesson 6: Set notation. From P6 in Sunny's revision book (p176–178), with the book's
 * numbers for the worked examples and Your Turn, and our own for a few questions. Four rungs: sets, ξ, n(A) and A'
 * (not in A); ∩ (and, the overlap) and ∪ (or, both circles, each number once), Example 1 and Your Turn Q1 and Q2;
 * shading regions such as A∩B' and A'∩B' (Your Turn Q4); and sets for inequalities, {x : x > 6} (Example 2, Your Turn
 * Q3). No board.
 *
 * On the board, { } and [ ] are drawing marks (a fraction, a crossed-out part, a box), so a set written in a working
 * row uses the bracket ornaments ❴ ❵ instead; titles and choices use ordinary curly brackets.
 *
 * Hidden on live: only the unlisted Probability shelf opens it.
 */

const lesson = author(306)
const { add, finish } = lesson
const { worked, practice, ask, playSort, sort } = chanceScreens(lesson)
const notation = 'sets-notation'
const andOr = 'sets-and-or'
const regions = 'sets-regions'
const inequalities = 'sets-inequalities'

const N_BOX = { label: 'Number of elements', prefix: 'n =' }
type Tones = Partial<Record<VennRegion, FigureTone>>
/** A set as the board writes it. */
const set = (...xs: (number | string)[]) => `❴${xs.join(', ')}❵`

/* ---------- Pictures ---------- */

/** ξ = 1 to 10, A odd numbers up to 9, B square numbers. */
function oddSquareFig(shade?: VennShade, tone: 'lit' | 'found' = 'lit', caption?: string): AngleFrame {
  return vennFig({ names: ['A', 'B'], regions: { onlyA: ['3, 5', '7'], both: ['1, 9'], onlyB: ['4'], outside: ['2, 6', '8, 10'] }, shade, shadeTone: tone,
    spoken: 'ξ is the numbers 1 to 10. A is the first five odd numbers, B is square numbers.', caption })
}

/** ξ = 1 to 12, A even, B multiples of 3. */
function evenThreeFig(shade?: VennShade, tone: 'lit' | 'found' = 'lit', caption?: string): AngleFrame {
  return vennFig({ names: ['A', 'B'], regions: { onlyA: ['2, 4', '8, 10'], both: ['6, 12'], onlyB: ['3, 9'], outside: ['1, 5', '7, 11'] }, shade, shadeTone: tone,
    spoken: 'ξ is the numbers 1 to 12. A is even numbers, B is multiples of 3.', caption })
}

/** The book's Example 1. */
function example1Fig(shade?: VennShade, tones: Tones = {}, tone: 'lit' | 'found' = 'lit', caption?: string): AngleFrame {
  return vennFig({ names: ['A', 'B'], regions: { onlyA: ['1, 8', '12'], both: ['2, 3', '10'], onlyB: ['4, 5', '6'] }, tones, shade, shadeTone: tone,
    spoken: 'A is 1, 2, 3, 8, 10, 12. B is 2, 3, 4, 5, 6, 10.', caption })
}

/** An empty Venn diagram with one region shaded. */
const blank = (shade?: VennShade, tone: 'lit' | 'found' = 'lit', caption?: string) =>
  vennFig({ names: ['A', 'B'], shade, shadeTone: tone, spoken: shade ? `A Venn diagram of A and B with a region shaded.` : 'A Venn diagram of A and B.', caption })

/* ---------- Rung 1: sets and ξ ---------- */

playSort(notation, 'ξ = {1, 2, …, 10} and A is the odd numbers. Sort each number: in A, or in A’ (not in A)?', 'P6 p176 Sets and ξ (play)', { kind: 'bins', bins: [{ id: 'A', label: 'A: odd' }, { id: 'notA', label: 'A’: not in A' }], tiles: Array.from({ length: 10 }, (_, i) => i + 1).map(k => k % 2
  ? { label: String(k), to: 'A', why: `${k} is odd, so it’s in A.` }
  : { label: String(k), to: 'notA', why: `${k} is even, so it’s not in A: it’s in A’.` }) })

{
  const p = oddSquareFig()
  worked(notation, 'ξ = {1, 2, …, 10}. A is the first five odd numbers. Write A, n(A) and A’.', 'Sets and ξ', 'P6 p176 Sets (book’s numbers)', boardModel([], [
    { title: 'List the set', say: 'A set is a list in curly brackets. The first five odd numbers.', rows: [`A = ${set(1, 3, 5, 7, 9)}`], picture: oddSquareFig('A') },
    { title: 'Count the elements', say: 'n(A) means how many things are in A.', rows: ['n(A) = 5'], picture: oddSquareFig('A') },
    { title: 'Everything not in A', say: 'A’ means not in A: everything in ξ outside A’s circle, even the 4 in B.', rows: [`! A' = ${set(2, 4, 6, 8, 10)}`], picture: oddSquareFig("A'", 'found', "A' shaded") },
  ], 'Sets', p), 'A set is a collection of things in curly brackets: A = {1, 3, 5, 7, 9}. ξ is the universal set, everything in the rectangle. n(A) is how many elements A has, and A’ means everything not in A.')
}
{
  const p = evenThreeFig()
  practice(notation, 'ξ = {1, 2, …, 12}. A is even numbers and B is multiples of 3. Find n(A).', 'P6 p176 (own numbers)', p, number(6, '6'), 'Count everything inside A’s circle.', boardModel([], [
    { title: 'Count A’s circle', say: 'A’s own part and the overlap: 2, 4, 8, 10, 6, 12.', rows: ['! n(A) = 6'], picture: evenThreeFig('A', 'found') },
  ], 'Sets', p), slips(6, [[4, 'That’s A’s own part. The overlap is in A too.'], [8, 'That’s everything in either circle.']]), N_BOX)
  practice(notation, 'Find n(B’).', 'P6 p176 (own numbers)', p, number(8, '8'), 'Everything outside B’s circle.', boardModel([], [
    { title: 'Everything not in B', say: 'B is 3, 6, 9, 12. That leaves 12 − 4 numbers.', rows: ['n(B) = 4', "! n(B') = 12 − 4 = 8"], picture: evenThreeFig("B'", 'found') },
  ], 'Sets', p), slips(8, [[4, 'That’s n(B). B’ means not in B.'], [2, 'B’ is everything outside B’s circle, A’s own part too.']]), N_BOX)
}
ask(notation, 'ξ = {103, 104, 105, 109, 110, 112, 114}. A is the even numbers. Find A’.', 'P6 p178 Your Turn Q1b (book’s numbers)', ['ξ = {103, 104, 105, 109, 110, 112, 114}', 'A = even numbers from ξ', 'B = {103, 112, 114}'], choose('{103, 105, 109}',
  ['{104, 110, 112, 114}', 'That’s A. A’ means not in A.'],
  ['{105, 109}', '103 is odd, so it’s not in A either, even though it’s in B.'],
  ['{104, 110}', 'Those are even, so they’re in A.']), 'Everything in ξ that isn’t even.', boardModel([], [
  { title: 'Find A first', say: 'The even numbers in ξ.', rows: [`A = ${set(104, 110, 112, 114)}`] },
  { title: 'Everything else in ξ', say: 'A’ is what’s left: the odd numbers.', rows: [`! A' = ${set(103, 105, 109)}`] },
], 'Sets'))

/* ---------- Rung 2: ∩ and ∪ ---------- */

ask(andOr, 'Guess first: A ∩ B is what’s in both sets, and A ∪ B is what’s in either. Which has more elements?', 'P6 p177 (guess first)', ['A = {1, 2, 3, 4}', 'B = {3, 4, 5, 6}'], choose('A ∪ B',
  ['A ∩ B', 'In both is only 3 and 4. In either is 1, 2, 3, 4, 5, 6.'], ['They’re the same', 'In both is 2 numbers; in either is 6.']),
'Both, or either: which lets more numbers in?', boardModel([], [
  { title: 'In both, in either', say: 'Both sets have 3 and 4. Either set has everything in A or B, once each.', rows: [`A ∩ B = ${set(3, 4)}`, `A ∪ B = ${set(1, 2, 3, 4, 5, 6)}`, '! A ∪ B has more'] },
], 'Sets'))

{
  const p = example1Fig()
  worked(andOr, 'A = {1, 2, 3, 8, 10, 12} and B = {6, 5, 4, 3, 2, 10}. Find A ∩ B, A ∪ B and n(A ∪ B).', '∩ and ∪', 'P6 p177 Example 1 (book’s numbers)', boardModel([], [
    { title: 'And: the overlap', say: 'A ∩ B means in A and in B. Which numbers are in both lists?', rows: [`A∩B = ${set(2, 3, 10)}`], picture: example1Fig('A∩B', { both: 'lit' }) },
    { title: 'Or: both circles', say: 'A ∪ B means in A or B or both. Write each number once.', rows: [`A∪B = ${set(1, 2, 3, 4, 5, 6, 8, 10, 12)}`], picture: example1Fig('A∪B') },
    { title: 'Count them', say: 'Nine different numbers. 2, 3 and 10 count once.', rows: ['! n(A∪B) = 9'], picture: example1Fig('A∪B', {}, 'found', 'n(A∪B) = 9') },
  ], 'Sets', p), 'A ∩ B (A intersect B) means A and B: the overlap. A ∪ B (A union B) means A or B: everything in either circle, each number written once. ∩ looks like an n for aNd, and ∪ like a cup that holds everything.')
}
{
  const p = evenThreeFig()
  practice(andOr, 'ξ = {1, 2, …, 12}. A is even numbers and B is multiples of 3. Find n(A ∪ B).', 'P6 p177 (own numbers)', p, number(8, '8'), 'Everything in either circle, each once.', boardModel([], [
    { title: 'Both circles', say: '2, 4, 8, 10, then 6, 12, then 3, 9.', rows: ['n(A∪B) = 4 + 2 + 2', '! n(A∪B) = 8'], picture: evenThreeFig('A∪B', 'found') },
  ], 'Sets', p), slips(8, [[10, 'That counts 6 and 12 twice. Each number once.'], [2, 'That’s n(A ∩ B), the overlap. ∪ means either circle.']]), N_BOX)
}
ask(andOr, 'Find A ∪ B.', 'P6 p178 Your Turn Q1a (book’s numbers)', ['ξ = {103, 104, 105, 109, 110, 112, 114}', 'A = even numbers from ξ', 'B = {103, 112, 114}'], choose('{103, 104, 110, 112, 114}',
  ['{112, 114}', 'That’s A ∩ B, the overlap. ∪ means in A or B.'],
  ['{104, 110, 112, 114}', 'That’s just A. 103 is in B, so it’s in A ∪ B.'],
  ['{105, 109}', 'Those are in neither set.']), 'Everything in A or B, each once.', boardModel([], [
  { title: 'Find A', say: 'The even numbers in ξ.', rows: [`A = ${set(104, 110, 112, 114)}`] },
  { title: 'Join on B', say: 'Add anything from B that isn’t there yet: just 103.', rows: [`! A∪B = ${set(103, 104, 110, 112, 114)}`] },
], 'Sets'))
ask(andOr, 'Find W.', 'P6 p178 Your Turn Q2 (book’s numbers)', ['ξ = {1, 2, 3, 5, 7, 8, 9, 10, 12}', 'V = prime numbers in ξ', 'V ∩ W = {3, 5, 7}', 'V ∪ W = {1, 2, 3, 5, 7, 10, 12}'], choose('{1, 3, 5, 7, 10, 12}',
  ['{1, 10, 12}', 'W also holds the overlap with V: 3, 5 and 7.'],
  ['{1, 2, 3, 5, 7, 10, 12}', 'That’s V ∪ W. 2 is only in V, since it’s not in V ∩ W.'],
  ['{3, 5, 7}', 'That’s V ∩ W. W has more in it: 1, 10 and 12 are in V ∪ W but not prime.']), 'V = {2, 3, 5, 7}. What in V ∪ W isn’t only in V?', boardModel([], [
  { title: 'Find V', say: 'The primes in ξ.', rows: [`V = ${set(2, 3, 5, 7)}`] },
  { title: 'Not in V', say: 'In V ∪ W but not prime: these must be W only.', rows: [`W only = ${set(1, 10, 12)}`] },
  { title: 'Add the overlap', say: 'W is its own part and the overlap V ∩ W. 2 isn’t in the overlap, so it’s V only.', rows: [`! W = ${set(1, 3, 5, 7, 10, 12)}`] },
], 'Sets'))

/* ---------- Rung 3: shading regions ---------- */

{
  const p = blank()
  worked(regions, 'Shade the region A ∩ B’.', 'Shading regions', 'P6 p177 Shading (book’s notation)', boardModel([], [
    { title: 'Read each part', say: 'A ∩ B’ reads “in A and not in B”.', rows: ["A∩B' = in A, not in B"], picture: blank('A') },
    { title: 'Take B away', say: 'Start with A’s circle and leave out anything inside B: the overlap goes.', rows: ['! A only: the crescent'], picture: blank("A∩B'", 'found', "A∩B' shaded") },
  ], 'Regions', p), 'Read set notation in words: ∩ is “and”, ∪ is “or” and ’ is “not”. A ∩ B’ is in A and not in B: A’s own part. (A ∪ B)’ is outside both circles.')
}
practice(regions, 'Which notation describes the shaded region?', 'P6 p177 (own question)', blank("A'∩B"), choose("A' ∩ B",
  ["A ∩ B'", 'That’s A’s own part. This is B’s own part.'],
  ['A ∩ B', 'That’s the overlap. The overlap is left clear here.'],
  ["A'", 'A’ would also shade the outside of both circles.']), 'In B, and not in A.', boardModel([], [
  { title: 'Read the picture', say: 'The shading is inside B but outside A: not in A, and in B.', rows: ["! A'∩B = B only"], picture: blank("A'∩B", 'found') },
], 'Regions', blank("A'∩B")))
practice(regions, 'Which region is A’ ∩ B’?', 'P6 p178 Your Turn Q4 (book’s question)', blank(), choose('Outside both circles',
  ['The overlap', 'That’s A ∩ B. The ’ means not.'],
  ['Everything except the overlap', 'That’s (A ∩ B)’. A’ ∩ B’ is not in A and not in B.'],
  ['A only', 'That’s A ∩ B’. Here neither A nor B.']), 'Not in A and not in B.', boardModel([], [
  { title: 'Not A and not B', say: 'Outside A’s circle and outside B’s circle: the rest of the rectangle. It’s the same as (A ∪ B)’.', rows: ["! A'∩B' = outside both"], picture: blank("(A∪B)'", 'found', "A'∩B' shaded") },
], 'Regions', blank()))
{
  const p = blank('(A∩B)\'')
  practice(regions, 'Which notation describes the shaded region?', 'P6 p177 (own question)', p, choose("(A ∩ B)'",
    ['A ∪ B', 'A ∪ B leaves the outside clear. Here the outside is shaded.'],
    ["(A ∪ B)'", 'That’s just outside both circles. Here the crescents are shaded too.'],
    ['A ∩ B', 'The overlap is the one part left clear.']), 'What is left clear?', boardModel([], [
    { title: 'What’s left clear?', say: 'Only the overlap is clear, so this is everything not in A ∩ B.', rows: ["! (A∩B)' = all but the overlap"], picture: blank("(A∩B)'", 'found') },
  ], 'Regions', p))
}
{
  const p = evenThreeFig()
  practice(regions, 'ξ = {1, 2, …, 12}. A is even numbers and B is multiples of 3. Find n(A ∩ B’).', 'P6 p177 (own numbers)', p, number(4, '4'), 'In A and not in B.', boardModel([], [
    { title: 'In A, not in B', say: 'A’s own part: 2, 4, 8, 10.', rows: ['! n(A∩B\') = 4'], picture: evenThreeFig("A∩B'", 'found') },
  ], 'Sets', p), slips(4, [[6, 'That’s n(A). Leave out the overlap, which is in B.'], [2, 'That’s n(A ∩ B). B’ means not in B.']]), N_BOX)
}

/* ---------- Rung 4: sets for inequalities ---------- */

worked(inequalities, 'Solve 3x − 7 > 11 and write the answer in set notation.', 'Sets for inequalities', 'P6 p177 Example 2 (book’s numbers)', boardModel([], [
  { title: 'Undo the − 7', say: 'Add 7 to both sides.', rows: ['>0 3x − 7 > 11', '>0 3x > 18'] },
  { title: 'Undo the × 3', say: 'Divide both sides by 3.', rows: ['>0 x > 6'] },
  { title: 'Write it as a set', say: 'Read it as “the set of x such that x is more than 6”.', rows: ['! ❴x : x > 6❵'] },
], 'Inequality'), 'An inequality is a set of numbers: x ≤ 5 is written {x : x ≤ 5}, “all x such that x is at most 5”. Solve first, then write the set with x on the left.')
ask(inequalities, 'Write x ≥ 12 using set notation.', 'P6 p178 Your Turn Q3a (book’s numbers)', ['x ≥ 12'], choose('{x : x ≥ 12}',
  ['{12}', 'That’s just the one number 12. x can be anything 12 or more.'],
  ['{x : x > 12}', '≥ includes 12 itself. Keep the sign.'],
  ['{x ≥ 12}', 'Set notation names x first: {x : …}.']), 'Curly brackets, x, a colon, then the inequality.', boardModel([], [
  { title: 'Write it as a set', say: 'All x such that x is 12 or more.', rows: ['! ❴x : x ≥ 12❵'] },
], 'Inequality'))
ask(inequalities, 'Write 13 < x using set notation.', 'P6 p178 Your Turn Q3d (book’s numbers)', ['13 < x'], choose('{x : x > 13}',
  ['{x : x < 13}', '13 < x means 13 is less than x, so x is more than 13.'],
  ['{x : x ≥ 13}', 'The sign is <, not ≤, so 13 itself isn’t in the set.'],
  ['{13 : x}', 'The letter goes first.']), 'Turn it round so x comes first.', boardModel([], [
  { title: 'Put x first', say: '13 is less than x means x is more than 13. The sign turns round with it.', rows: ['>0 13 < x means x > 13'] },
  { title: 'Write it as a set', say: 'All x such that x is more than 13.', rows: ['! ❴x : x > 13❵'] },
], 'Inequality'))
ask(inequalities, 'Solve 4x + 3 ≥ 23. The answer is {x : x ≥ ?}. What number goes in the gap?', 'P6 p177 Example 2 (own numbers)', ['4x + 3 ≥ 23'], number(5, '5'), 'Take 3 from both sides, then divide by 4.', boardModel([], [
  { title: 'Undo the + 3', say: 'Take 3 from both sides.', rows: ['>0 4x ≥ 20'] },
  { title: 'Undo the × 4', say: 'Divide both sides by 4.', rows: ['>0 x ≥ 5', '! ❴x : x ≥ 5❵'] },
], 'Inequality'), slips(5, [[6.5, 'Take the 3 away, don’t add it.'], [80, 'Divide by 4, don’t multiply.'], [20, 'That’s 4x. Divide by 4 to get x.']]), { label: 'Number', prefix: 'x ≥' })

/* ---------- Review: one of each, our own numbers ---------- */

sort('mixed', 'ξ = {1, 2, …, 8}, A = {2, 4, 6, 8} and B = {1, 2, 3, 4}. Sort each number.', 'P6 review (own numbers)', { kind: 'bins', bins: [{ id: 'both', label: 'A ∩ B' }, { id: 'one', label: 'Only one' }, { id: 'neither', label: '(A ∪ B)’' }], tiles: [
  { label: '1', to: 'one', why: '1 is in B but not A.' }, { label: '2', to: 'both', why: '2 is in A and in B.' }, { label: '3', to: 'one', why: '3 is in B but not A.' },
  { label: '4', to: 'both', why: '4 is in A and in B.' }, { label: '5', to: 'neither', why: '5 is in neither set.' }, { label: '6', to: 'one', why: '6 is in A but not B.' },
  { label: '7', to: 'neither', why: '7 is in neither set.' }, { label: '8', to: 'one', why: '8 is in A but not B.' },
] }, '∩ is in both; (A ∪ B)’ is outside both.', boardModel([], [
  { title: 'In both', say: '2 and 4 are in A and B.', rows: [`A ∩ B = ${set(2, 4)}`] },
  { title: 'In neither', say: '5 and 7 are in neither set.', rows: [`! (A ∪ B)’ = ${set(5, 7)}`] },
], 'Sets'))
ask('mixed', 'With the same sets, find n(A ∪ B).', 'P6 review (own numbers)', ['A = {2, 4, 6, 8}', 'B = {1, 2, 3, 4}'], number(6, '6'), 'Everything in either set, counted once.', boardModel([], [
  { title: 'Either set, once', say: 'List them, without repeating 2 and 4.', rows: [`A ∪ B = ${set(1, 2, 3, 4, 6, 8)}`, '! n(A ∪ B) = 6'] },
], 'Sets'), slips(6, [[8, '2 and 4 are in both sets. Count them once.'], [2, 'That’s n(A ∩ B), the overlap.']]), N_BOX)
ask('mixed', 'Write x < 5 in set notation.', 'P6 review (own numbers)', ['x < 5'], choose('{x : x < 5}',
  ['{x : x ≤ 5}', '≤ includes 5. x < 5 doesn’t.'], ['{5 : x < 5}', 'The letter goes before the colon: {x : …}.']),
'The letter, a colon, then the rule.', boardModel([], [
  { title: 'Letter, colon, rule', say: 'Read it as “the set of x such that x is less than 5”.', rows: ['! {x : x < 5}'] },
], 'Sets'))

add('mixed', 'Set notation', 'P6 consolidation', text(
  'A set goes in curly brackets. ξ is everything, n(A) counts A.',
  '∩ means and: the overlap. ∪ means or: either circle, each once.',
  '’ means not: A’ is everything outside A.',
  'Inequalities as sets: {x : x > 6}.',
))

export const tutorSetNotationLesson: TutorMethodLesson = {
  id: 'L306', number: 306, title: 'Set notation', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Read and write set notation: ξ, n(A), A’, ∩ and ∪, shade regions of a Venn diagram, and write inequalities as sets.',
  labels: { [notation]: 'Sets and ξ', [andOr]: '∩ and ∪', [regions]: 'Shading regions', [inequalities]: 'Sets for inequalities', mixed: 'Review' },
  states: finish(),
}
