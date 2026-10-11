import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { slips } from '../../geometry/tutor/figureLesson'
import { chanceScreens } from './chanceLesson'
import { fraction, freqTreeFig } from './chancePictures'

/*
 * Probability and statistics lesson 2: Frequency trees. From P2 in Sunny's revision book (p165–167), with the book's
 * numbers in the worked example and Your Turn questions, our own elsewhere. Three rungs: filling in a tree, each
 * pair of branches adding up to the circle they come from (the puzzle example, Your Turn Q1 and Q2a); a probability
 * read from a filled tree, out of the right group (10 of the 45 under 18s, Q2b and c); and trees built from
 * percentages, fractions and ratios (Q3 and Q4). Every picture is the frequency tree, filled in as the working goes.
 *
 * Hidden on live: only the unlisted Probability shelf opens it.
 */

const lesson = author(302)
const { add, finish } = lesson
const { worked, practice } = chanceScreens(lesson)
const build = 'freq-tree-build'
const prob = 'freq-tree-probability'
const parts = 'freq-tree-parts'

const COUNT = (prefix: string) => ({ label: 'People', prefix })

/** Values in a tree, in order: the total, the two groups, then the four leaves (top to bottom). */
type Fill = [string, string, string, string, string, string, string]
type Tones = Partial<Record<number, FigureTone>>
/** A frequency tree with its branch names, filled with `fill`; `tones` colour values by place, `lit` the leaves a step uses. */
const treeOf = (names: [string, string, string, string, string, string], spoken: string) => (fill: Fill, tones: Tones = {}, lit?: number[], caption?: string): AngleFrame => {
  const b = (k: number, label: string) => ({ label, value: fill[k], ...(tones[k] ? { tone: tones[k] } : {}) })
  return freqTreeFig(b(0, ''), [b(1, names[0]), b(2, names[1])], [[b(3, names[2]), b(4, names[3])], [b(5, names[4]), b(6, names[5])]], spoken, { ...(lit ? { lit } : {}), ...(caption ? { caption } : {}) })
}

/* ---------- Rung 1: filling in a tree ---------- */

const puzzle = treeOf(['Under 18', '18 and over', 'Solved', 'Didn’t solve', 'Solved', 'Didn’t solve'], 'A frequency tree: 120 people, split into under 18 and 18 and over, then into solved and didn’t solve.')
{
  const p = puzzle(['120', '45', '?', '?', '?', '?', '?'], { 2: 'x' })
  practice(build, 'Guess first: 120 people, and 45 of them are under 18. What goes in the other circle?', 'P2 p164 (guess first)', p, choose('75',
    ['45', 'The two groups make up all 120 people, so they add up to 120.'], ['165', 'The 45 are part of the 120, not added to them.']),
  'The two groups make up everyone.', boardModel([], [
    { title: 'The branches add up', say: 'Under 18s and 18 and overs together are all 120 people.', rows: ['120 − 45 = 75', '! 18 and over = 75'], picture: puzzle(['120', '45', '75', '?', '?', '?', '?'], { 2: 'found' }, [2, 3]) },
  ], 'Tree', p))
}
{
  worked(build, '120 people tried a puzzle. 45 were under 18. 78 solved it. 32 people aged 18 and over did not solve it. Complete the frequency tree.', 'Filling in a tree', 'P2 p165 Constructing frequency trees (book’s numbers)', boardModel([], [
    { title: 'Find 18 and over', say: 'The two age groups add up to 120.', rows: ['18 and over = 120 − 45 = 75'], picture: puzzle(['120', '45', '75', '?', '?', '?', '32'], { 2: 'found' }, [2, 3]) },
    { title: '18 and over who solved', say: 'Of the 75, 32 didn’t solve it.', rows: ['18+ solved = 75 − 32 = 43'], picture: puzzle(['120', '45', '75', '?', '?', '43', '32'], { 5: 'found' }, [2]) },
    { title: 'Under 18 who solved', say: '78 solved it altogether, and 43 of them were 18 and over.', rows: ['Under 18 solved = 78 − 43 = 35'], picture: puzzle(['120', '45', '75', '35', '?', '43', '32'], { 3: 'found' }, [0]) },
    { title: 'Under 18 who didn’t', say: 'The under 18s add up to 45.', rows: ['! Under 18 didn’t solve = 45 − 35 = 10'], picture: puzzle(['120', '45', '75', '35', '10', '43', '32'], { 4: 'found' }, [1]) },
  ], 'Tree', puzzle(['120', '45', '?', '?', '?', '?', '32'])), 'A frequency tree splits a group into parts, then splits each part again. The two branches from a circle always add up to the number in that circle.')
}
{
  const t = treeOf(['Bus', 'Train', 'Late', 'On time', 'Late', 'On time'], 'A frequency tree: 200 people, split into bus and train, then late and on time.')
  const start: Fill = ['200', '?', '58', '40', '?', '?', '?']
  practice(build, '200 people travelled by bus or train. 58 came by train. Of those by bus, 40 were late. How many people who came by bus were on time?', 'P2 Your Turn Q1 (book’s numbers)', t(start), number(102, '102'), 'Find how many came by bus first.', boardModel([], [
    { title: 'Find the bus group', say: 'Bus and train add up to 200.', rows: ['Bus = 200 − 58 = 142'], picture: t(['200', '142', '58', '40', '?', '?', '?'], { 1: 'lit' }, [0, 1]) },
    { title: 'Take off the late ones', say: '40 of the 142 were late.', rows: ['! Bus on time = 142 − 40 = 102'], picture: t(['200', '142', '58', '40', '102', '?', '?'], { 4: 'found' }, [1]) },
  ], 'Tree', t(start)), slips(102, [[142, 'That’s everyone on the bus. Take away the 40 who were late.'], [160, 'Take the 40 from the bus group, 142, not from 200.']]), COUNT('On time ='))
  const mid: Fill = ['200', '142', '58', '40', '102', '?', '?']
  practice(build, '71 people were late in total. How many people who came by train were late?', 'P2 Your Turn Q1 (book’s numbers)', t(mid), number(31, '31'), '40 of the 71 late people came by bus.', boardModel([], [
    { title: 'Late, take off bus', say: 'The late people came by bus or by train.', rows: ['! Train late = 71 − 40 = 31'], picture: t(['200', '142', '58', '40', '102', '31', '?'], { 5: 'found' }, [0, 2]) },
  ], 'Tree', t(mid)), slips(31, [[111, 'That adds. The 40 late bus people are part of the 71: take them away.'], [27, 'That’s the train people on time.']]), COUNT('Late ='))
  const end: Fill = ['200', '142', '58', '40', '102', '31', '?']
  practice(build, 'How many people who came by train were on time?', 'P2 Your Turn Q1 (book’s numbers)', t(end), number(27, '27'), 'The train branches add up to 58.', boardModel([], [
    { title: 'Train, take off late', say: '58 came by train and 31 of them were late.', rows: ['! Train on time = 58 − 31 = 27'], picture: t(['200', '142', '58', '40', '102', '31', '27'], { 6: 'found' }, [3]) },
  ], 'Tree', t(end)), slips(27, [[89, 'That adds. Take the 31 late from the 58.'], [31, 'That’s the train people who were late.']]), COUNT('On time ='))
}
const hands = treeOf(['Left-handed', 'Right-handed', 'Left-footed', 'Right-footed', 'Left-footed', 'Right-footed'], 'A frequency tree: 75 people, split into left- and right-handed, then left- and right-footed.')
{
  const start: Fill = ['75', '?', '63', '?', '?', '?', '?']
  practice(build, '75 people: 63 are right-handed. One third of the left-handed are right-footed. 27 people are left-footed. How many right-handed people are right-footed?', 'P2 Your Turn Q2a (book’s numbers)', hands(start), number(44, '44'), 'Start with the left-handed: 75 − 63.', boardModel([], [
    { title: 'Find the left-handed', say: 'Left and right-handed add up to 75.', rows: ['Left-handed = 75 − 63 = 12'], picture: hands(['75', '12', '63', '?', '?', '?', '?'], { 1: 'lit' }, [0, 1]) },
    { title: 'Split the left-handed', say: 'One third of 12 are right-footed, so the rest are left-footed.', rows: ['12 ÷ 3 = 4', '12 − 4 = 8'], picture: hands(['75', '12', '63', '8', '4', '?', '?'], { 3: 'lit', 4: 'lit' }, [0, 1]) },
    { title: 'Right-handed, left-footed', say: '27 are left-footed in total, and 8 of them are left-handed.', rows: ['27 − 8 = 19'], picture: hands(['75', '12', '63', '8', '4', '19', '?'], { 5: 'lit' }, [2]) },
    { title: 'Right-handed, right-footed', say: 'The right-handed add up to 63.', rows: ['! Right-handed, right-footed = 63 − 19 = 44'], picture: hands(['75', '12', '63', '8', '4', '19', '44'], { 6: 'found' }, [3]) },
  ], 'Tree', hands(start)), slips(44, [[36, '27 left-footed is everyone, not just the right-handed. Take off the 8 left-handed first.'], [48, 'That’s everyone who is right-footed. Just the right-handed ones.']]), COUNT('People ='))
}

/* ---------- Rung 2: probability from a tree ---------- */

{
  const full: Fill = ['120', '45', '75', '35', '10', '43', '32']
  const p = puzzle(full)
  practice(prob, 'Guess first: an under 18 is picked at random. P(didn’t solve) is 10 out of what?', 'P2 p165 (guess first)', p, choose('45',
    ['120', 'Only under 18s can be picked, so out of the 45 under 18s.'], ['35', '35 is the under 18s who solved it. Out of all 45 under 18s.']),
  'Who could have been picked?', boardModel([], [
    { title: 'Only the under 18s', say: 'The person is picked from the under 18s, so the total is their circle: 45.', rows: ['P = {10|45}', '! Out of 45'], picture: puzzle(full, { 1: 'lit', 4: 'found' }, [1]) },
  ], 'Probability', p))
}

{
  const full: Fill = ['120', '45', '75', '35', '10', '43', '32']
  worked(prob, 'One of the under 18s is chosen at random. What is the probability they did not solve the puzzle?', 'Probability from a tree', 'P2 p165 Using frequency trees (book’s numbers)', boardModel([], [
    { title: 'Only the under 18s', say: 'They’re chosen from the under 18s, so the total is 45, not 120.', rows: ['Total = 45'], picture: puzzle(full, { 1: 'lit' }, [0, 1]) },
    { title: 'Find who didn’t solve', say: '10 of the under 18s didn’t solve it.', rows: ['Ways = 10'], picture: puzzle(full, { 4: 'lit' }, [1]) },
    { title: 'Simplest form', say: 'Divide the top and bottom by 5.', rows: ['P = {10|45}', '! P = {2|9}'], picture: puzzle(full, { 4: 'found' }, [1]) },
  ], 'Probability', puzzle(full)), 'Read the probability off the tree: the number you want over the number in the group it’s picked from. Picked from everyone, the bottom is the total; picked from one group, the bottom is that group’s circle.')
}
{
  const full: Fill = ['75', '12', '63', '8', '4', '19', '44']
  practice(prob, 'A right-handed person is picked at random. What is the probability they are right-footed?', 'P2 Your Turn Q2b (book’s numbers)', hands(full), fraction('44/63'), 'Picked from the right-handed: the bottom is 63.', boardModel([], [
    { title: 'Only the right-handed', say: 'Picked from the right-handed, so the total is 63.', rows: ['Total = 63'], picture: hands(full, { 2: 'lit' }, [2, 3]) },
    { title: 'The right-footed ones', say: '44 of them are right-footed.', rows: ['! P = {44|63}'], picture: hands(full, { 6: 'found' }, [3]) },
  ], 'Probability', hands(full)), slips(44 / 63, [[44 / 75, 'They’re picked from the 63 right-handed, not all 75.'], [19 / 63, 'That’s left-footed. 44 are right-footed.']]))
  practice(prob, 'A person is picked at random from all 75. What is the probability they are right-footed? Give it in its simplest form.', 'P2 Your Turn Q2c (book’s numbers)', hands(full), fraction('16/25', true), 'Add up both right-footed circles.', boardModel([], [
    { title: 'Add the right-footed', say: 'Right-footed people are in two circles.', rows: ['Right-footed = 4 + 44 = 48'], picture: hands(full, { 4: 'lit', 6: 'lit' }, [1, 3]) },
    { title: 'Out of everyone', say: 'Picked from all 75. Divide the top and bottom by 3.', rows: ['P = {48|75}', '! P = {16|25}'], picture: hands(full, { 4: 'found', 6: 'found' }, [1, 3]) },
  ], 'Probability', hands(full)), slips(16 / 25, [[44 / 75, 'The left-handed have 4 right-footed people too.'], [27 / 75, 'That’s left-footed.']]))
}
{
  const t = treeOf(['Men', 'Women', 'Glasses', 'No glasses', 'Glasses', 'No glasses'], 'A frequency tree: 90 people, split into men and women, then glasses and no glasses.')
  const full: Fill = ['90', '40', '50', '12', '28', '18', '32']
  practice(prob, 'A woman is picked at random. What is the probability she wears glasses?', 'P2 p165 (own numbers)', t(full), fraction('9/25'), 'Picked from the women: the bottom is 50.', boardModel([], [
    { title: 'Only the women', say: 'She’s picked from the 50 women.', rows: ['Total = 50'], picture: t(full, { 2: 'lit' }, [2, 3]) },
    { title: 'The ones with glasses', say: '18 of the women wear glasses.', rows: ['P = {18|50}', '! P = {9|25}'], picture: t(full, { 5: 'found' }, [2]) },
  ], 'Probability', t(full)), slips(9 / 25, [[18 / 90, 'She’s picked from the 50 women, not all 90.'], [30 / 90, 'Just the women: 18 of the 50.']]))
}

/* ---------- Rung 3: percentages and ratios ---------- */

{
  const t = treeOf(['Adults', 'Children', 'Swim', 'Don’t', 'Swim', 'Don’t'], 'A frequency tree: 160 members, split into adults and children, then swim and don’t swim.')
  worked(parts, 'A club has 160 members. Adults to children is 3 : 5. Half the adults and 40% of the children swim. How many members swim?', 'Percentages and ratios', 'P2 Your Turn Q3 and Q4 (own numbers)', boardModel([], [
    { title: 'One share', say: '3 + 5 = 8 shares make 160.', rows: ['1 share = 160 ÷ 8 = 20'], picture: t(['160', '?', '?', '?', '?', '?', '?'], { 0: 'lit' }) },
    { title: 'Adults and children', say: '3 shares are adults, 5 are children.', rows: ['Adults = 3 × 20 = 60', 'Children = 5 × 20 = 100'], picture: t(['160', '60', '100', '?', '?', '?', '?'], { 1: 'lit', 2: 'lit' }) },
    { title: 'Who swims', say: 'Half of 60, and 40% of 100.', rows: ['60 ÷ 2 = 30', '0.4 × 100 = 40'], picture: t(['160', '60', '100', '30', '30', '40', '60'], { 3: 'lit', 5: 'lit' }, [0, 2]) },
    { title: 'Add the swimmers', say: 'Swimmers are in two circles.', rows: ['! Swim = 30 + 40 = 70'], picture: t(['160', '60', '100', '30', '30', '40', '60'], { 3: 'found', 5: 'found' }, [0, 2]) },
  ], 'Tree', t(['160', '?', '?', '?', '?', '?', '?'])), 'Share a ratio by finding one share first. Turn a percentage or fraction of a group into a number by multiplying. If you know a number and the fraction it is, work backwards to the whole group.')
}
const exams = treeOf(['French', 'Spanish', 'Pass', 'Fail', 'Pass', 'Fail'], 'A frequency tree: Year 11, split into French and Spanish, then pass and fail.')
{
  const start: Fill = ['?', '?', '?', '?', '13', '?', '?']
  practice(parts, 'Year 11 took French or Spanish. 65% took French. 1/12 of the French students failed, which was 13 students. How many students are in Year 11?', 'P2 Your Turn Q3a (book’s numbers)', exams(start), number(240, '240'), '13 is 1/12 of the French students.', boardModel([], [
    { title: 'The French students', say: '13 is one twelfth of them, so times by 12.', rows: ['French = 13 × 12 = 156'], picture: exams(['?', '156', '?', '?', '13', '?', '?'], { 1: 'lit' }, [1]) },
    { title: '65% is 156', say: 'Divide by 65 to find 1%, then times by 100.', rows: ['1% = 156 ÷ 65 = 2.4', '! Year 11 = 2.4 × 100 = 240'], picture: exams(['240', '156', '?', '?', '13', '?', '?'], { 0: 'found' }) },
  ], 'Tree', exams(start)), slips(240, [[156, 'That’s the French students. They’re only 65% of the year.'], [101.4, '156 is 65% of the year: divide by 0.65, don’t multiply.']]), COUNT('Year 11 ='))
  const mid: Fill = ['240', '156', '84', '?', '13', '?', '?']
  practice(parts, 'Twice as many failed Spanish as failed French. To the nearest whole number, what percentage of the whole year passed French?', 'P2 Your Turn Q3b (book’s numbers)', exams(mid), number(60, '60%'), 'Find the French passes, then put them over 240.', boardModel([], [
    { title: 'French passes', say: '156 took French and 13 failed.', rows: ['French pass = 156 − 13 = 143'], picture: exams(['240', '156', '84', '143', '13', '58', '26'], { 3: 'lit' }, [0]) },
    { title: 'Out of the whole year', say: 'Of the whole year, so over 240, then times by 100.', rows: ['{143|240} × 100 = 59.58…', '! French pass = 60%'], picture: exams(['240', '156', '84', '143', '13', '58', '26'], { 3: 'found' }, [0]) },
  ], 'Tree', exams(mid)), slips(60, [[92, 'That’s out of the French students. The question asks for the whole year: over 240.'], [59.6, 'Round to the nearest whole number.'], [65, 'That’s everyone who took French. Take off the 13 who failed.']]), { label: 'Percentage (%)', prefix: '% =' })
}
{
  const t = treeOf(['Cheese', 'Ham', 'Brown', 'White', 'Brown', 'White'], 'A frequency tree: pupils split into cheese and ham sandwiches, then brown and white bread.')
  const start: Fill = ['?', '?', '?', '18', '?', '?', '?']
  practice(parts, 'Pupils chose a cheese or ham sandwich, on white or brown bread. 15% of those who chose cheese had brown bread: 18 pupils. How many chose cheese?', 'P2 Your Turn Q4 (book’s numbers)', t(start), number(120, '120'), '18 is 15% of the cheese group.', boardModel([], [
    { title: 'Find 1%', say: '15% of the cheese group is 18.', rows: ['1% = 18 ÷ 15 = 1.2'], picture: t(start, { 3: 'lit' }, [0]) },
    { title: 'Times by 100', say: 'The whole cheese group is 100%.', rows: ['! Cheese = 1.2 × 100 = 120'], picture: t(['?', '120', '?', '18', '102', '?', '?'], { 1: 'found' }) },
  ], 'Tree', t(start)), slips(120, [[2.7, 'That’s 15% of 18. 18 is the 15%: work backwards.'], [102, 'That’s the cheese on white.']]), COUNT('Cheese ='))
  const mid: Fill = ['?', '120', '?', '18', '102', '?', '?']
  practice(parts, 'Cheese to ham was 2 : 3. 3/10 of the ham pupils had brown bread. A pupil is picked at random. Find P(ham on brown bread).', 'P2 Your Turn Q4b (book’s numbers)', t(mid), fraction('9/50'), 'Use the ratio to find the ham group and the total.', boardModel([], [
    { title: 'Ham and total', say: '2 shares are 120, so 1 share is 60.', rows: ['Ham = 3 × 60 = 180', 'Total = 120 + 180 = 300'], picture: t(['300', '120', '180', '18', '102', '?', '?'], { 0: 'lit', 2: 'lit' }) },
    { title: 'Ham on brown', say: '3/10 of 180.', rows: ['180 ÷ 10 × 3 = 54'], picture: t(['300', '120', '180', '18', '102', '54', '126'], { 5: 'lit' }, [2]) },
    { title: 'Out of everyone', say: 'Picked from all 300. Divide the top and bottom by 6.', rows: ['P = {54|300}', '! P = {9|50}'], picture: t(['300', '120', '180', '18', '102', '54', '126'], { 5: 'found' }, [2]) },
  ], 'Probability', t(mid)), slips(9 / 50, [[54 / 180, 'Picked from all the pupils, 300, not just the ham ones.'], [3 / 10, 'That’s out of the ham pupils. Picked from everyone: 54 out of 300.']]))
}

add('mixed', 'Frequency trees', 'P2 consolidation', text(
  'The two branches from a circle add up to the number in it.',
  'Fill in what you can from each fact, then use the totals to finish.',
  'A probability from a tree: what you want ÷ the group it’s picked from.',
  'Ratios: find one share. Percentages and fractions: work back to the whole.',
))

export const tutorFrequencyTreesLesson: TutorMethodLesson = {
  id: 'L302', number: 302, title: 'Frequency trees', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Complete frequency trees, find probabilities from them, and build them from percentages, fractions and ratios.',
  labels: { [build]: 'Filling in a tree', [prob]: 'Probability from a tree', [parts]: 'Percentages and ratios', mixed: 'Review' },
  states: finish(),
}
