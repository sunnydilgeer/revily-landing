/*
 * Lesson 303 (Probability and tree diagrams), a Higher section. From the Higher revision guide, P3 Probability and Tree
 * Diagrams (Level 6-7 and 8-9, p246–249): dependent events; picking without replacement, where the second pick's
 * probabilities change; conditional probability, P(A and B) = P(A) × P(B given A); and "at least one" as 1 take away
 * P(none). The Foundation lesson puts the counters of Your Turn Q2 back, so Higher gets the book's version.
 *
 * The book's numbers: the conditional tree (4 red, 5 blue, same colour 32/72 = 4/9), Benjamin (0.42), Your Turn Q2 (12
 * counters, same colour 31/66), and the Level 8-9 Q4 (14 balls: same 46/91, different 45/91) and Q5 (William wins at
 * least one game, 0.84).
 */
import { author } from '../../written-methods/tutor/content'
import type { FigureTone } from '../../written-methods/tutor/methodWorking'
import { line, part, sign } from '../../written-methods/tutor/stepWorking'
import { boardModel, choose, number } from '../../simultaneous-equations/tutor/boardWorkings'
import { probTreeFig, type Branch } from '../../probability/tutor/chancePictures'
import { screens } from '../../geometry/tutor/figureLesson'
import { asks } from './figureHelpers'
import { fraction, text, type HigherAddition } from './helpers'

const without = 'chance-without-replacement'
const a = author(303, 'L303-H')
const { add } = a
const { worked } = screens(a)
const ask = asks(a)

/** Two picks without replacement: the first pick's two outcomes, then the second's after each. */
function picks(names: [string, string], first: [string, string], afterFirst: [string, string], afterSecond: [string, string], spoken: string, o: { lit?: number[]; results?: (string | null)[]; tone?: FigureTone; caption?: string } = {}) {
  const b = (label: string, value: string): Branch => ({ label, value })
  return probTreeFig([b(names[0], first[0]), b(names[1], first[1])], [[b(names[0], afterFirst[0]), b(names[1], afterFirst[1])], [b(names[0], afterSecond[0]), b(names[1], afterSecond[1])]], spoken,
    { heads: ['1st pick', '2nd pick'], ...(o.lit ? { lit: o.lit } : {}), ...(o.results ? { results: o.results } : {}), ...(o.tone ? { resultTone: o.tone } : {}), ...(o.caption ? { caption: o.caption } : {}) })
}

add(without, 'Without replacement', 'Higher P3 Independent and Dependent Events', text(
  'Two events are dependent when one changes the probability of the other.',
  'Picking without replacement: the first item isn’t put back, so there is one fewer to pick from. The bottoms go down by 1, and so does the top for the colour already taken.',
  'P(A and B) = P(A) × P(B given A), where P(B given A) is the probability of B once A has happened. This is conditional probability.',
  'Words like “without replacement” or “given” mean the probabilities change on the second branches.',
))

{
  // The book's conditional probability tree: 4 red and 5 blue, two picks, not replaced.
  const t = (o: Parameters<typeof picks>[5] = {}) => picks(['R', 'B'], ['4/9', '5/9'], ['3/8', '5/8'], ['4/8', '4/8'], 'A tree for two picks without replacement from 4 red and 5 blue balls.', o)
  const res = ['12/72', '20/72', '20/72', '20/72']
  worked(without, 'A bag has 4 red and 5 blue balls. Raheem picks one, does not put it back, then picks another. Find P(same colour).', 'Without replacement', 'Higher P3 Conditional Probability Trees (p247)', boardModel([], [
    { title: 'The first pick', say: '4 of the 9 balls are red.', rows: ['P(R) = {4|9}, P(B) = {5|9}'], picture: t({ lit: [0, 1] }) },
    { title: 'One fewer', say: 'After a red is taken there are 8 balls, and only 3 red. After a blue, 8 balls with 4 red and 4 blue.', rows: ['After R = 3 R of 8', 'After B = 4 R of 8'], picture: t() },
    { title: 'Same-colour paths', say: 'Red then red, or blue then blue. Multiply along each path.', rows: ['P(R, R) = {4|9} × {3|8} = {12|72}', 'P(B, B) = {5|9} × {4|8} = {20|72}'], picture: t({ lit: [0, 3], results: res }) },
    { title: 'OR means add', say: 'Add the two paths, then simplify.', rows: ['! P(same) = {32|72} = {4|9}'], picture: t({ lit: [0, 3], results: res, tone: 'found' }) },
  ], 'Probability'), 'Without replacement, the second branches change: one fewer item altogether, and one fewer of the colour already picked.')
}

{
  // Benjamin: P(starts) = 0.7, P(scores given he starts) = 0.4.
  const b = (label: string, value: string, tone?: FigureTone): Branch => ({ label, value, ...(tone ? { tone } : {}) })
  const t = () => probTreeFig([b('Yes', '0.7'), b('No', '0.3')], [[b('Yes', '0.4'), b('No', '?', 'x')], []], 'A tree: Benjamin starts with probability 0.7; if he starts, he scores with probability 0.4.', { heads: ['Starts?', 'Scores?'] })
  ask(without, 'P(Benjamin starts the game) = 0.7. If he starts, P(he scores) = 0.4. Find P(he starts but doesn’t score).', 'Higher P3 Conditional Probability Example (p247)', t(), number(0.42, '0.42'), '0.42', 'Doesn’t score, given he starts, is 1 take away 0.4.', {
    kind: 'step-worked', start: 'P(starts) = 0.7, P(scores given starts) = 0.4', steps: [
      { title: 'Given he starts', why: 'He either scores or doesn’t, so the two branches add to one.', lines: [line([part('1'), sign('−'), part('0.4')], '0.6')] },
      { title: 'Multiply along', why: 'P(A and B) is P(A) times P(B given A).', lines: [line([part('0.7'), sign('×'), part('0.6')], '0.42', { answer: true })] },
    ],
  }, { label: 'Probability', prefix: 'P =' })
}

{
  // Your Turn Q2: 12 counters, 7 blue and 5 green, two picks without replacement.
  const t = (o: Parameters<typeof picks>[5] = {}) => picks(['B', 'G'], ['7/12', '5/12'], ['6/11', '5/11'], ['7/11', '4/11'], 'A tree for two picks without replacement from 7 blue and 5 green counters.', o)
  ask(without, 'A bag has 12 counters: 7 blue and the rest green. Sean takes one at random and, without replacing it, takes another. Find P(both the same colour).', 'Higher P3 Your Turn Q2 (Level 6-7)', t(), fraction('31/66'), '31/66', 'Blue then blue, or green then green. The second branches have 11 counters.', {
    kind: 'step-worked', start: '7 blue, 5 green, not replaced', steps: [
      { title: 'Blue then blue', why: 'After a blue, eleven are left and six are blue.', lines: [line([part('7/12'), sign('×'), part('6/11')], '42/132')] },
      { title: 'Green then green', why: 'After a green, eleven are left and four are green.', lines: [line([part('5/12'), sign('×'), part('4/11')], '20/132')] },
      { title: 'Add and simplify', why: 'Either path gives the same colour, so add them, then divide top and bottom by two.', lines: [line([part('42/132'), sign('+'), part('20/132')], '62/132'), line([part('62/132')], '31/66', { eq: true, answer: true })] },
    ],
  }, { label: 'Probability' })
}

{
  // Your Turn Q4 (Level 8-9): 14 footballs, 9 blue and 5 green, two picks without replacement.
  const t = (o: Parameters<typeof picks>[5] = {}) => picks(['B', 'G'], ['9/14', '5/14'], ['8/13', '5/13'], ['9/13', '4/13'], 'A tree for two picks without replacement from 9 blue and 5 green footballs.', o)
  ask(without, 'A bag has 14 footballs: 9 blue and the rest green. The coach takes one at random and, without replacing it, takes another. Is he more likely to get two of the same colour, or two different?', 'Higher P3 Your Turn Q4 (Level 8-9)', t(),
    choose('Same colour: 46/91 against 45/91', ['Different colours: 45/91 against 46/91', 'Check the paths: blue-blue 72/182 and green-green 20/182 make 92/182.'], ['Same colour: 106/196 against 90/196', 'That puts the first ball back. Without replacement the second pick is out of 13.'], ['Equally likely: 1/2 each', 'Work out both: 92/182 is a little more than 90/182.']),
    'Same colour: 46/91 against 45/91', 'Find P(same) from the two same-colour paths. P(different) is 1 take away it.', {
      kind: 'step-worked', start: '9 blue, 5 green, not replaced', steps: [
        { title: 'Same colour', why: 'Blue then blue, plus green then green. The second pick is out of thirteen.', lines: [line([part('9/14 × 8/13'), sign('+'), part('5/14 × 4/13')], '92/182')] },
        { title: 'Different colours', why: 'Everything else is different colours.', lines: [line([part('1'), sign('−'), part('92/182')], '90/182')] },
        { title: 'Compare', why: 'Simplify both by halving, and the bigger one wins.', words: 'Same colour: 46/91 against 45/91' },
      ],
    })
}

{
  // Your Turn Q5 (Level 8-9): William wins each game with probability 0.6; at least one win in two games.
  const b = (label: string, value: string): Branch => ({ label, value })
  const t = () => probTreeFig([b('W', '0.6'), b('L', '0.4')], [0, 1].map(() => [b('W', '0.6'), b('L', '0.4')]), 'A tree for two games: William wins each with probability 0.6 and loses with 0.4.', { heads: ['1st game', '2nd game'] })
  ask(without, 'William wins a game of badminton with probability 0.6. He plays two games. Find the probability that he wins at least one.', 'Higher P3 Your Turn Q5 (Level 8-9)', t(), number(0.84, '0.84'), '0.84', 'At least one win is every path except lose, lose.', {
    kind: 'step-worked', start: 'P(win) = 0.6 each game', steps: [
      { title: 'Lose both', why: 'The only path with no wins is lose then lose.', lines: [line([part('0.4'), sign('×'), part('0.4')], '0.16')] },
      { title: 'Take it from 1', why: 'Every other path has at least one win.', lines: [line([part('1'), sign('−'), part('0.16')], '0.84', { answer: true })] },
    ],
  }, { label: 'Probability', prefix: 'P =' })
}

export const withoutReplacement: HigherAddition = { lessonId: 'L303', skill: without, label: 'Without replacement', states: a.finish() }
