import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { slips } from '../../geometry/tutor/figureLesson'
import { chanceScreens } from './chanceLesson'
import { fraction, probTreeFig, spinnerFig, tableFig } from './chancePictures'

/*
 * Probability and statistics lesson 3: Probability and tree diagrams. From P3 in Sunny's revision book (p168–170),
 * with the book's numbers in the worked examples and Your Turn questions, our own elsewhere. Four rungs: the AND rule
 * for independent events, multiply (two coins, Anna and Rob's tests); the OR rule for events that can't happen
 * together, add (the bag of 10 balls); tree diagrams, multiplying along the branches, the four results adding up to 1
 * (Tommy's two events, the late bus); and using the tree, AND along a path then OR across paths (Raheem's red and
 * blue balls, the counters of Your Turn Q2). The first rung opens on the chance board's tree.
 *
 * Hidden on live: only the unlisted Probability shelf opens it.
 */

const lesson = author(303)
const { add, finish } = lesson
const { worked, practice, ask, play, drag } = chanceScreens(lesson)
const andRule = 'chance-and-rule'
const orRule = 'chance-or-rule'
const tree = 'chance-tree'
const both = 'chance-tree-both'

const P_BOX = (prefix = 'P =') => ({ label: 'Probability', prefix })

/**
 * A two-event tree: the first event's outcomes `a` (with their probabilities `pa`), then the second's, `b` with
 * `pb`, the same after either first outcome. `results` go at the ends of the four paths; `lit` lights paths.
 */
const treeOf = (a: [string, string], b: [string, string], heads: [string, string], spoken: string) =>
  (pa: [string, string], pb: [string, string], opts: { lit?: number[]; results?: (string | null)[]; tone?: FigureTone; caption?: string } = {}): AngleFrame =>
    probTreeFig([{ label: a[0], value: pa[0] }, { label: a[1], value: pa[1] }], [0, 1].map(() => [{ label: b[0], value: pb[0] }, { label: b[1], value: pb[1] }]), spoken,
      { heads, ...(opts.lit ? { lit: opts.lit } : {}), ...(opts.results ? { results: opts.results } : {}), ...(opts.tone ? { resultTone: opts.tone } : {}), ...(opts.caption ? { caption: opts.caption } : {}) })

/* ---------- Rung 1: the AND rule ---------- */

play(andRule, 'Drag to change P(win) and watch the tree.', 'P3 p169 Probability trees (play)', { mode: 'tree' })
{
  const coins = treeOf(['H', 'T'], ['H', 'T'], ['Coin 1', 'Coin 2'], 'A tree for two coins: heads or tails, each with probability 0.5.')
  const half: [string, string] = ['0.5', '0.5']
  worked(andRule, 'Oliver flips two coins. Find the probability that both land on heads.', 'The AND rule', 'P3 p168 The AND rule (book’s numbers)', boardModel([], [
    { title: 'Independent events', say: 'One coin doesn’t change the other: they’re independent.', rows: ['P(H on coin 1) = 0.5', 'P(H on coin 2) = 0.5'], picture: coins(half, half, { lit: [0] }) },
    { title: 'AND means multiply', say: 'Heads on coin 1 AND heads on coin 2: multiply.', rows: ['! P(both heads) = 0.5 × 0.5 = 0.25'], picture: coins(half, half, { lit: [0], results: ['0.25', null, null, null], tone: 'found' }) },
  ], 'Probability', coins(half, half)), 'Two events are independent when one doesn’t affect the other. The AND rule: P(A and B) = P(A) × P(B).')
}
{
  const tests = treeOf(['Pass', 'Fail'], ['Pass', 'Fail'], ['Anna', 'Rob'], 'A tree for Anna’s test then Rob’s: pass or fail.')
  practice(andRule, 'Anna and Rob take a test. P(Anna passes) = 0.7 and P(both pass) = 0.35. Find P(Rob passes).', 'P3 Your Turn Q1a (book’s numbers)', tests(['0.7', '0.3'], ['?', '?'], { results: ['0.35', null, null, null] }), number(0.5, '0.5'), '0.7 × P(Rob) = 0.35', boardModel([], [
    { title: 'Write the AND rule', say: 'Both pass means Anna passes AND Rob passes.', rows: ['0.7 × P(Rob) = 0.35'], picture: tests(['0.7', '0.3'], ['?', '?'], { lit: [0], results: ['0.35', null, null, null] }) },
    { title: 'Divide to undo', say: 'Divide by 0.7 to undo the times.', rows: ['! P(Rob) = 0.35 ÷ 0.7 = 0.5'], picture: tests(['0.7', '0.3'], ['0.5', '0.5'], { lit: [0], results: ['0.35', null, null, null], tone: 'found' }) },
  ], 'Probability', tests(['0.7', '0.3'], ['?', '?'], { results: ['0.35', null, null, null] })), slips(0.5, [[0.245, 'That multiplies. 0.7 times Rob’s chance is 0.35, so divide.'], [1.05, 'Probabilities multiply, not add: 0.7 × P(Rob) = 0.35.'], [0.35, 'Rob’s chance times 0.7 is 0.35. Divide by 0.7.']]), P_BOX('P(Rob) ='))
}
ask(andRule, 'A fair dice is rolled and a fair coin is flipped. Find P(a 6 and heads).', 'P3 p168 (own numbers)', ['P(6) = 1/6 and P(heads) = 1/2.', 'The dice and coin are independent.'], fraction('1/12'), 'AND means multiply.', boardModel([], [
  { title: 'AND means multiply', say: 'The two are independent, so multiply the fractions: tops times tops, bottoms times bottoms.', rows: ['P = {1|6} × {1|2}', '! P = {1|12}'] },
], 'Probability'), slips(1 / 12, [[2 / 3, 'That adds. AND means multiply.'], [1 / 8, 'Multiply the bottoms: 6 × 2 = 12.']]))
ask(andRule, 'P(rain on Monday) = 0.4 and P(the bus is late) = 0.2, and they are independent. Find P(rain and a late bus).', 'P3 p168 (own numbers)', ['P(rain) = 0.4', 'P(late bus) = 0.2', 'Independent events'], number(0.08, '0.08'), 'AND means multiply.', boardModel([], [
  { title: 'AND means multiply', say: '4 × 2 = 8, and two decimal places in all.', rows: ['! P = 0.4 × 0.2 = 0.08'] },
], 'Probability'), slips(0.08, [[0.6, 'That adds. AND means multiply.'], [0.8, 'Count the decimal places: 0.4 × 0.2 = 0.08.']]), P_BOX())

drag(andRule, 'Set the sliders so that P(win both) = 0.42.', 'P3 p169 (own numbers)', { mode: 'tree', from: [5, 5] }, ['6,7', '7,6'], '0.6 and 0.7', 'Which two tenths multiply to make 0.42?', boardModel([], [
  { title: 'Multiply along the path', say: 'Win both is P(win 1) × P(win 2). 6 × 7 = 42, so 0.6 × 0.7 = 0.42.', rows: ['0.6 × 0.7 = 0.42', '! 0.6 and 0.7'] },
], 'AND rule'), r => { const [a, b] = r.split(',').map(Number); return `${a / 10} × ${b / 10} = ${Math.round(a * b) / 100}. Find two tenths that multiply to 0.42.` })

/* ---------- Rung 2: the OR rule ---------- */

ask(orRule, 'Guess first: a bag has 3 red, 5 blue and 2 green balls. Is P(red or blue) bigger or smaller than P(red)?', 'P3 p168 (guess first)', ['3 red, 5 blue, 2 green'], choose('Bigger',
  ['Smaller', 'More balls count as a win, so it’s more likely, not less.'], ['The same', 'Blue balls count too, so there are more ways to win.']),
'Which wins more often: red, or red or blue?', boardModel([], [
  { title: 'More ways to win', say: 'Red wins with 3 balls. Red or blue wins with 3 + 5 = 8.', rows: ['P(red) = {3|10}', 'P(red or blue) = {8|10}', '! Bigger'] },
], 'OR rule'))

{
  const bag = (tones: [number, number, FigureTone][] = []) => tableFig([['Red', 'Blue', 'Green'], ['3', '5', '2']], 'A bag of 10 balls: 3 red, 5 blue and 2 green.', { tones })
  worked(orRule, 'A bag has 10 balls: 3 red, 5 blue and 2 green. Find P(green or blue).', 'The OR rule', 'P3 p168 The OR rule (book’s numbers)', boardModel([], [
    { title: 'Each one on its own', say: 'Green is 2 of 10 and blue is 5 of 10.', rows: ['P(green) = {2|10} = 0.2', 'P(blue) = {5|10} = 0.5'], picture: bag([[1, 1, 'lit'], [1, 2, 'lit']]) },
    { title: 'OR means add', say: 'A ball can’t be green and blue at once, so add.', rows: ['! P(green or blue) = 0.2 + 0.5 = 0.7'], picture: bag([[1, 1, 'found'], [1, 2, 'found']]) },
  ], 'Probability', bag()), 'Events are mutually exclusive when they can’t happen together. The OR rule: P(A or B) = P(A) + P(B). AND means ×, OR means +.')
}
{
  const labels = ['Red', 'Blue', 'Blue', 'Yellow', 'Red', 'Green', 'Blue', 'Yellow']
  const s = (lit?: number[]) => spinnerFig(labels, 'A fair spinner with eight equal sections: two red, three blue, two yellow, one green.', lit ? { lit } : {})
  practice(orRule, 'This fair spinner is spun once. Find P(red or yellow).', 'P3 p168 (own numbers)', s(), fraction('1/2'), 'Find P(red) and P(yellow), then add.', boardModel([], [
    { title: 'Each one on its own', say: '2 of the 8 sections are red and 2 are yellow.', rows: ['P(red) = {2|8}', 'P(yellow) = {2|8}'], picture: s([0, 3, 4, 7]) },
    { title: 'OR means add', say: 'It can’t land on both, so add.', rows: ['P = {2|8} + {2|8} = {4|8}', '! P = {1|2}'], picture: s([0, 3, 4, 7]) },
  ], 'Probability', s()), slips(1 / 2, [[1 / 16, 'That multiplies. OR means add.'], [1 / 4, 'Add the yellows as well as the reds.']]))
}
{
  const t = (tones: [number, number, FigureTone][] = []) => tableFig([['Walk', 'Bus', 'Car'], ['0.15', '0.35', '0.5']], 'How Sam gets to school: walk 0.15, bus 0.35, car 0.5.', { tones })
  practice(orRule, 'The table shows how Sam gets to school. Find P(Sam walks or goes by car).', 'P3 p168 (own numbers)', t(), number(0.65, '0.65'), 'OR means add.', boardModel([], [
    { title: 'OR means add', say: 'Sam can’t walk and go by car on the same day, so add.', rows: ['! P = 0.15 + 0.5 = 0.65'], picture: t([[1, 0, 'found'], [1, 2, 'found']]) },
  ], 'Probability', t()), slips(0.65, [[0.075, 'That multiplies. OR means add.'], [0.35, 'That’s the bus. Add walk and car.']]), P_BOX())
}
ask(orRule, 'On a fair dice, can you add P(even) and P(more than 4) to get P(even or more than 4)?', 'P3 p168 Note (own numbers)', ['Even: 2, 4, 6', 'More than 4: 5, 6'], choose('No: 6 is in both',
  ['Yes: OR means add', 'Only when the events can’t happen together. A 6 is even and more than 4.'],
  ['Yes: they’re independent', 'The OR rule needs mutually exclusive events, not independent ones. 6 is in both.']), 'Can both happen at once?', boardModel([], [
  { title: 'Can both happen?', say: 'A 6 is even and more than 4, so the events aren’t mutually exclusive. Adding counts the 6 twice.', rows: ['>0 6 is in both lists', '! No: 6 is in both'] },
], 'Probability'))

/* ---------- Rung 3: tree diagrams ---------- */

{
  const t = treeOf(['Win', 'Lose'], ['Win', 'Lose'], ['Event 1', 'Event 2'], 'A tree for Tommy’s two events: win or lose each one.')
  worked(tree, 'Tommy wins event 1 with probability 0.6 and event 2 with probability 0.7. Draw the tree and find each outcome.', 'Tree diagrams', 'P3 p169 Probability trees (book’s numbers)', boardModel([], [
    { title: 'Fill in the losses', say: 'Each pair of branches from one point adds up to 1.', rows: ['P(lose 1) = 1 − 0.6 = 0.4', 'P(lose 2) = 1 − 0.7 = 0.3'], picture: t(['0.6', '0.4'], ['0.7', '0.3']) },
    { title: 'Multiply along the branches', say: 'Each path is an AND: win then win is 0.6 × 0.7.', rows: ['0.6 × 0.7 = 0.42', '0.6 × 0.3 = 0.18', '0.4 × 0.7 = 0.28', '0.4 × 0.3 = 0.12'], picture: t(['0.6', '0.4'], ['0.7', '0.3'], { results: ['0.42', '0.18', '0.28', '0.12'] }) },
    { title: 'They add up to 1', say: 'The four paths are every outcome, so they add up to 1. A good check.', rows: ['! 0.42 + 0.18 + 0.28 + 0.12 = 1'], picture: t(['0.6', '0.4'], ['0.7', '0.3'], { results: ['0.42', '0.18', '0.28', '0.12'], tone: 'found' }) },
  ], 'Tree', t(['0.6', '?'], ['0.7', '?'])), 'A probability tree puts each probability on its branch and the outcome at its end. Branches from one point add up to 1. Multiply along a path to find that outcome; all the paths add up to 1.')
}
{
  const tests = treeOf(['Pass', 'Fail'], ['Pass', 'Fail'], ['Anna', 'Rob'], 'A tree for Anna’s test then Rob’s: pass or fail.')
  practice(tree, 'P(Anna passes) = 0.7 and P(Rob passes) = 0.5. Find the probability that they both fail.', 'P3 Your Turn Q1b (book’s numbers)', tests(['0.7', '?'], ['0.5', '?']), number(0.15, '0.15'), 'Fill in the fail branches first.', boardModel([], [
    { title: 'Fill in the fails', say: 'Each pair adds up to 1.', rows: ['P(Anna fails) = 1 − 0.7 = 0.3', 'P(Rob fails) = 1 − 0.5 = 0.5'], picture: tests(['0.7', '0.3'], ['0.5', '0.5'], { lit: [3] }) },
    { title: 'Multiply along the path', say: 'Fail then fail: the bottom path.', rows: ['! P(both fail) = 0.3 × 0.5 = 0.15'], picture: tests(['0.7', '0.3'], ['0.5', '0.5'], { lit: [3], results: [null, null, null, '0.15'], tone: 'found' }) },
  ], 'Probability', tests(['0.7', '?'], ['0.5', '?'])), slips(0.15, [[0.35, 'That’s both passing. Use the fail branches.'], [0.8, 'That adds. Along a path, multiply.']]), P_BOX())
}
{
  const bus = treeOf(['On time', 'Late'], ['On time', 'Late'], ['Monday', 'Tuesday'], 'A tree for the bus on Monday then Tuesday: on time or late.')
  practice(tree, 'The bus is on time with probability 0.75 each day. Find the probability it is late on both Monday and Tuesday.', 'P3 Your Turn Q3 (book’s numbers)', bus(['0.75', '?'], ['0.75', '?']), number(0.0625, '0.0625'), 'Late is 1 − 0.75. Then multiply along the path.', boardModel([], [
    { title: 'Fill in late', say: 'On time and late add up to 1.', rows: ['P(late) = 1 − 0.75 = 0.25'], picture: bus(['0.75', '0.25'], ['0.75', '0.25'], { lit: [3] }) },
    { title: 'Multiply along the path', say: 'Late AND late.', rows: ['! P(late both) = 0.25 × 0.25 = 0.0625'], picture: bus(['0.75', '0.25'], ['0.75', '0.25'], { lit: [3], results: [null, null, null, '0.0625'], tone: 'found' }) },
  ], 'Probability', bus(['0.75', '?'], ['0.75', '?'])), slips(0.0625, [[0.5, 'That adds. Late AND late: multiply.'], [0.5625, 'That’s on time both days. Use 0.25 for late.'], [0.25, 'That’s one day. Multiply by the second day too.']]), P_BOX())
}
{
  const t = treeOf(['Win', 'Lose'], ['Win', 'Lose'], ['Game 1', 'Game 2'], 'A tree for two games: win or lose each one.')
  practice(tree, 'Priya wins game 1 with probability 0.8 and game 2 with probability 0.4. Find P(win game 1, lose game 2).', 'P3 p169 (own numbers)', t(['0.8', '?'], ['0.4', '?']), number(0.48, '0.48'), 'Lose game 2 is 1 − 0.4.', boardModel([], [
    { title: 'Fill in the losses', say: 'Each pair adds up to 1.', rows: ['P(lose 1) = 1 − 0.8 = 0.2', 'P(lose 2) = 1 − 0.4 = 0.6'], picture: t(['0.8', '0.2'], ['0.4', '0.6'], { lit: [1] }) },
    { title: 'Multiply along the path', say: 'Win, then lose: the second path.', rows: ['! P = 0.8 × 0.6 = 0.48'], picture: t(['0.8', '0.2'], ['0.4', '0.6'], { lit: [1], results: [null, '0.48', null, null], tone: 'found' }) },
  ], 'Probability', t(['0.8', '?'], ['0.4', '?'])), slips(0.48, [[0.32, 'That’s win then win. Game 2 is a loss: 0.6.'], [1.4, 'Along a path, multiply.']]), P_BOX())
}

/* ---------- Rung 4: using the tree ---------- */

ask(both, 'Guess first: two fair coins are flipped. Is P(two heads) more or less than ½?', 'P3 p168 (guess first)', ['Two fair coins'], choose('Less than ½',
  ['More than ½', 'Both have to land heads: ½ × ½ = ¼.'], ['Exactly ½', 'That’s one coin. Both heads is ½ × ½ = ¼.']),
'Both coins have to land heads.', boardModel([], [
  { title: 'Both have to happen', say: 'AND means multiply along the path.', rows: ['½ × ½ = ¼', '! Less than ½'] },
], 'AND rule'))

{
  const balls = treeOf(['R', 'B'], ['R', 'B'], ['1st pick', '2nd pick'], 'A tree for two picks with replacement from 4 red and 5 blue balls.')
  const pa: [string, string] = ['4/9', '5/9']
  const res = ['16/81', '20/81', '20/81', '25/81']
  worked(both, 'A bag has 4 red and 5 blue balls. Raheem picks one, puts it back, then picks again. Find P(same colour).', 'Using the tree', 'P3 p169 Example (book’s numbers)', boardModel([], [
    { title: 'Draw the tree', say: '4 of the 9 balls are red. The ball is put back, so the second pick is the same.', rows: ['P(R) = {4|9}', 'P(B) = {5|9}'], picture: balls(pa, pa) },
    { title: 'Find the same-colour paths', say: 'Red then red, or blue then blue. Multiply along each.', rows: ['P(R, R) = {4|9} × {4|9} = {16|81}', 'P(B, B) = {5|9} × {5|9} = {25|81}'], picture: balls(pa, pa, { lit: [0, 3], results: res }) },
    { title: 'OR means add', say: 'Red-red or blue-blue: add the two paths.', rows: ['! P(same) = {16|81} + {25|81} = {41|81}'], picture: balls(pa, pa, { lit: [0, 3], results: res, tone: 'found' }) },
  ], 'Probability', balls(pa, pa)), 'For a question with more than one way, find each way with AND (multiply along its path), then join the ways with OR (add the paths).')
}
{
  const counters = treeOf(['B', 'G'], ['B', 'G'], ['1st pick', '2nd pick'], 'A tree for two picks with replacement from 7 blue and 5 green counters.')
  const p: [string, string] = ['7/12', '5/12']
  const res = ['49/144', '35/144', '35/144', '25/144']
  practice(both, 'A bag has 12 counters: 7 blue, the rest green. One is picked and put back, then another. Find P(both green).', 'P3 Your Turn Q2 (book’s numbers)', counters(p, p), fraction('25/144'), 'Green is 5 of the 12. Multiply along the green path.', boardModel([], [
    { title: 'The green branches', say: '12 − 7 = 5 green, so P(G) = 5/12 on both picks.', rows: ['P(G) = {5|12}'], picture: counters(p, p, { lit: [3] }) },
    { title: 'Multiply along the path', say: 'Green AND green.', rows: ['! P(G, G) = {5|12} × {5|12} = {25|144}'], picture: counters(p, p, { lit: [3], results: res, tone: 'found' }) },
  ], 'Probability', counters(p, p)), slips(25 / 144, [[10 / 12, 'That adds. Green AND green: multiply.'], [49 / 144, 'That’s both blue.'], [10 / 24, 'Multiply the tops and the bottoms: 5 × 5 over 12 × 12.']]))
  practice(both, 'Same bag, with replacement. Find P(one of each colour).', 'P3 Your Turn Q2 (own question)', counters(p, p), fraction('35/72'), 'Blue then green, or green then blue.', boardModel([], [
    { title: 'Find both paths', say: 'Blue then green, or green then blue. Multiply along each.', rows: ['P(B, G) = {7|12} × {5|12} = {35|144}', 'P(G, B) = {5|12} × {7|12} = {35|144}'], picture: counters(p, p, { lit: [1, 2], results: res }) },
    { title: 'OR means add', say: 'Add the two paths, then simplify.', rows: ['P = {35|144} + {35|144} = {70|144}', '! P(one of each) = {35|72}'], picture: counters(p, p, { lit: [1, 2], results: res, tone: 'found' }) },
  ], 'Probability', counters(p, p)), slips(35 / 72, [[35 / 144, 'That’s only blue then green. Green then blue counts too.'], [74 / 144, 'That’s the same colour. One of each is the middle two paths.']]))
}
{
  const t = treeOf(['Win', 'Lose'], ['Win', 'Lose'], ['Event 1', 'Event 2'], 'A tree for Tommy’s two events: win or lose each one.')
  const res = ['0.42', '0.18', '0.28', '0.12']
  practice(both, 'Tommy wins event 1 with probability 0.6 and event 2 with 0.7. Find P(he wins exactly one event).', 'P3 p169 (own question)', t(['0.6', '0.4'], ['0.7', '0.3']), number(0.46, '0.46'), 'Win then lose, or lose then win.', boardModel([], [
    { title: 'Find both paths', say: 'Win-lose and lose-win each give exactly one win.', rows: ['0.6 × 0.3 = 0.18', '0.4 × 0.7 = 0.28'], picture: t(['0.6', '0.4'], ['0.7', '0.3'], { lit: [1, 2], results: res }) },
    { title: 'OR means add', say: 'Either path will do: add.', rows: ['! P(exactly one) = 0.18 + 0.28 = 0.46'], picture: t(['0.6', '0.4'], ['0.7', '0.3'], { lit: [1, 2], results: res, tone: 'found' }) },
  ], 'Probability', t(['0.6', '0.4'], ['0.7', '0.3'])), slips(0.46, [[0.18, 'Lose then win counts too.'], [0.28, 'Win then lose counts too.'], [0.54, 'That’s winning both or losing both.']]), P_BOX())
}

add('mixed', 'Probability and tree diagrams', 'P3 consolidation', text(
  'AND, for independent events: multiply. P(A and B) = P(A) × P(B).',
  'OR, for events that can’t happen together: add. P(A or B) = P(A) + P(B).',
  'On a tree, branches from one point add up to 1. Multiply along a path.',
  'More than one path? Find each, then add them.',
))

export const tutorTreeDiagramsLesson: TutorMethodLesson = {
  id: 'L303', number: 303, title: 'Probability and tree diagrams', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Use the AND and OR rules, draw probability trees for two events, and combine paths to answer questions.',
  labels: { [andRule]: 'The AND rule', [orRule]: 'The OR rule', [tree]: 'Tree diagrams', [both]: 'Using the tree', mixed: 'Review' },
  states: finish(),
}
