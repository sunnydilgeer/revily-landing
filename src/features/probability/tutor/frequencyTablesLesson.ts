import { author } from '../../written-methods/tutor/content'
import type { FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { slips } from '../../geometry/tutor/figureLesson'
import { chanceScreens } from './chanceLesson'
import { fraction, tableFig } from './chancePictures'
import { barFig } from './statsPictures'

/*
 * Statistics lesson 12: Frequency tables. From P12 in Sunny's revision book (p194–196): constructing one (66 people's
 * bathrooms: 30, 21, 5, 7 and so 3 with 5 or more) and using one (89 women's shoe sizes: mode 5.5, median the 45th
 * = 5.5, mean 512 ÷ 89 = 5.8), and Your Turn: the bathrooms again (why the mean can't be found), goals in a season,
 * the 240 divers' shark encounters (x : y = 7 : 5) and the form-captain votes.
 *
 * Three rungs: building a table (bars on the chart board as the frequencies), the averages from a table (the chart
 * board's mean mode: drag a frequency and watch Σfx ÷ Σf move), and problems with missing frequencies. Each rung
 * opens with something to drag or a guess.
 *
 * Hidden on live: only the unlisted Probability shelf opens it.
 */

const lesson = author(312)
const { add, finish } = lesson
const { worked, practice, ask, chartPlay, chart } = chanceScreens(lesson)
const build = 'freqtable-build'
const averages = 'freqtable-averages'
const problems = 'freqtable-problems'

type Tone = [number, number, FigureTone]
/** A two-column frequency table: the value and its frequency in each row. */
const table = (head: [string, string], values: string[], freqs: string[], spoken: string, tones: Tone[] = [], caption?: string) =>
  tableFig([head, ...values.map((v, k) => [v, freqs[k]])], spoken, { tones, caption })
/** What a wrong set of bars is told: the first one that's out. */
const barsWrong = (labels: string[], want: number[]) => (r: string) => {
  const got = r.split(',').map(Number), k = got.findIndex((n, i) => n !== want[i])
  return k < 0 ? 'Check every bar.' : `${labels[k]} should be ${want[k]}, not ${got[k]}.`
}

const rooms = ['1', '2', '3', '4', '5 or more'], roomsN = [30, 21, 5, 7, 3]
const bath = (freqs: string[] = roomsN.map(String), tones: Tone[] = [], caption?: string) => table(['Bathrooms', 'Frequency'], rooms, freqs, 'Bathrooms in 66 people’s houses.', tones, caption)
const sizes = [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9], sizesN = [5, 12, 18, 19, 11, 4, 8, 5, 5, 0, 2]
/** The shoe sizes in two bands of six columns, so the table fits across. Tones by [band row, column]. */
const shoes = (tones: Tone[] = [], caption?: string) => tableFig([
  ['Size', ...sizes.slice(0, 6).map(String)], ['Freq.', ...sizesN.slice(0, 6).map(String)],
  ['Size', ...sizes.slice(6).map(String), ''], ['Freq.', ...sizesN.slice(6).map(String), ''],
], '89 women’s shoe sizes and their frequencies.', { tones, caption, headColumn: true })
const goals = ['0', '1', '2', '3', '4', '5', '6'], goalsN = [7, 14, 13, 8, 3, 4, 1]
const goalTable = (tones: Tone[] = [], caption?: string) => tableFig([['Goals', ...goals], ['Freq.', ...goalsN.map(String)]], 'Goals scored in each of 50 matches.', { tones, caption, headColumn: true })
const sharkN = ['9', '32', '76', 'x', 'y', '15']
/** The shark table across the page, as the goals table: tones by [0 the encounters row or 1 the frequencies, encounters + 1]. */
const sharks = (freqs = sharkN, tones: Tone[] = [], caption?: string) => tableFig([['Sharks', '0', '1', '2', '3', '4', '5'], ['Freq.', ...freqs]], '240 divers’ shark encounters.', { tones, caption, headColumn: true })
const sharkFull = ['9', '32', '76', '63', '45', '15']
const names = ['Abigail', 'Dawn', 'Elizabeth', 'Gemma', 'Leanne', 'Sophie', 'Tanya'], votesN = [4, 6, 4, 8, 3, 5, 2]
const short = ['Abi', 'Dawn', 'Liz', 'Gem', 'Lea', 'Soph', 'Tan']
const votes = (tones: [number, number, 'lit' | 'found'][] = []) => barFig(short, [votesN], 'The 32 form-captain votes: Abigail 4, Dawn 6, Elizabeth 4, Gemma 8, Leanne 3, Sophie 5, Tanya 2.', { max: 10, step: 5, values: true, tones, yTitle: 'Votes' })

/* ---------- Rung 1: building a frequency table ---------- */

chartPlay(build, 'Drag the bars to 30, 21, 5 and 7. Watch the total.', 'P12 p194 Constructing frequency tables (play)', { mode: 'bars', labels: ['1', '2', '3', '4', '5+'], values: [10, 10, 10, 10, 10], max: 35, show: 'total', title: 'Bathrooms' })
ask(build, 'Guess first: how many of the 66 people have 5 or more bathrooms?', 'P12 p194 (guess first)', ['66 people were asked', '30 have 1, 21 have 2, 5 have 3 and 7 have 4', 'The rest have 5 or more'], number(3, '3'), 'Everyone is in exactly one row.', boardModel([], [
  { title: 'Add what you know', say: 'Add the four frequencies you’re given.', rows: ['30 + 21 + 5 + 7 = 63'] },
  { title: 'The rest', say: 'Everyone else has 5 or more.', rows: ['66 − 63 = 3', '! 5 or more = 3'] },
], 'Frequency'), slips(3, [[63, 'That’s how many are in the table so far. Take it from 66.'], [66, 'That’s everyone. Take away the 63 already counted.']]), { label: 'People', prefix: '5+ =' })
worked(build, '66 people were asked how many bathrooms they have. 30 had 1, 21 had 2, 5 had 3 and 7 had 4. The rest had 5 or more. Draw a frequency table.', 'Building a frequency table', 'P12 p194 Constructing frequency tables (book’s numbers)', boardModel([], [
  { title: 'Two columns', say: 'The values on the left, how many people on the right.', rows: ['>0 Bathrooms | Frequency'], picture: bath(['', '', '', '', '']) },
  { title: 'Fill in what’s given', say: 'Each frequency next to its number of bathrooms.', rows: ['>0 30, 21, 5 and 7'], picture: bath(['30', '21', '5', '7', '?'], [[1, 1, 'lit'], [2, 1, 'lit'], [3, 1, 'lit'], [4, 1, 'lit']]) },
  { title: 'Find the last row', say: 'The frequencies add up to the 66 people.', rows: ['30 + 21 + 5 + 7 = 63', '66 − 63 = 3', '! 5 or more = 3'], picture: bath(undefined, [[5, 1, 'found']]) },
], 'Table', bath()), 'A frequency table lists each value once, with how many times it happens. The frequencies add up to the total.')
chart(build, 'Count Mr Smith’s form-captain votes and drag each bar to its frequency: Gemma, Abigail, Gemma, Gemma, Abigail, Gemma, Dawn, Abigail, Sophie, Gemma, Dawn, Sophie, Gemma, Elizabeth, Sophie, Abigail, Leanne, Tanya, Dawn, Gemma, Sophie, Dawn, Leanne, Dawn, Elizabeth, Sophie, Dawn, Leanne, Tanya, Gemma, Elizabeth, Elizabeth.', 'P12 Your Turn Q4a (book’s names)',
  { mode: 'bars', labels: short, values: [0, 0, 0, 0, 0, 0, 0], max: 10, title: 'Votes' }, [votesN.join(',')], votesN.join(', '),
  'Go through the list once, crossing off each name as you count it.', boardModel([], [
    { title: 'Tally each name', say: 'Count every vote once. There are 32 votes in all.', rows: ['>0 Abigail 4, Dawn 6, Elizabeth 4, Gemma 8', '>0 Leanne 3, Sophie 5, Tanya 2'] },
    { title: 'Check the total', say: 'The frequencies add up to the 32 votes.', rows: ['4 + 6 + 4 + 8 + 3 + 5 + 2 = 32', '! Every vote counted'], picture: votes() },
  ], 'Table'), barsWrong(names, votesN))
{
  const p = votes()
  practice(build, 'What fraction of the class did not vote for Gemma?', 'P12 Your Turn Q4b (book’s numbers)', p, fraction('3/4'), 'Find the total votes first.', boardModel([], [
    { title: 'Total and Gemma', say: 'Add every frequency; Gemma has 8.', rows: ['Total = 32', 'Not Gemma = 32 − 8 = 24'], picture: votes([[0, 3, 'lit']]) },
    { title: 'As a fraction', say: '24 out of 32, then simplify by 8.', rows: ['{24|32} = {3|4}', '! Fraction = {3|4}'] },
  ], 'Fraction', p), r => /^\s*8\s*\/\s*32\s*$/.test(r) || /^\s*1\s*\/\s*4\s*$/.test(r) ? 'That’s the fraction who did vote for Gemma. Take it from the whole class.' : null)
}

/* ---------- Rung 2: averages from a frequency table ---------- */

chartPlay(averages, 'Drag a bar and watch the mean move.', 'P12 Your Turn Q2 (play)', { mode: 'bars', labels: goals, values: goalsN, max: 16, show: 'mean', xs: [0, 1, 2, 3, 4, 5, 6], title: 'Goals in a match' })
practice(averages, 'Guess first: size 5.5 has the biggest frequency, 19. What is the mode?', 'P12 p194 (guess first)', shoes(), number(5.5, '5.5'), 'The mode is a value, not a frequency.', boardModel([], [
  { title: 'Biggest frequency', say: '19 women wear size 5.5, more than any other size. The mode is that size.', rows: ['! Mode = 5.5'], picture: shoes([[0, 4, 'found'], [1, 4, 'lit']]) },
], 'Mode', shoes()), slips(5.5, [[19, '19 is how many women. The mode is the shoe size itself: 5.5.'], [5, 'Size 5 has 18 women; size 5.5 has 19.']]), { label: 'Shoe size', prefix: 'Mode =' })
worked(averages, '89 women were asked their shoe size. Find the mode, median and mean of the sizes.', 'Averages from a table', 'P12 p194 Using frequency tables (book’s numbers)', boardModel([], [
  { title: 'The mode', say: 'The size with the biggest frequency.', rows: ['Mode = 5.5'], picture: shoes([[0, 4, 'lit'], [1, 4, 'lit']]) },
  { title: 'The median', say: 'The (89 + 1) ÷ 2 = 45th woman. Add frequencies until you pass 45.', rows: ['5 + 12 + 18 = 35', '35 + 19 = 54', 'Median = 45th = 5.5'], picture: shoes([[1, 1, 'faint'], [1, 2, 'faint'], [1, 3, 'faint'], [0, 4, 'found'], [1, 4, 'found']]) },
  { title: 'The mean', say: 'Size × frequency for every column, added up, then ÷ the 89 women.', rows: ['4 × 5 + 4.5 × 12 + … + 9 × 2 = 512', '512 ÷ 89 = 5.75…', '! Mode 5.5, median 5.5, mean 5.8'] },
], 'Averages', shoes()), 'Mode: the value with the biggest frequency. Median: the (n + 1) ÷ 2th value, found by adding frequencies. Mean: add value × frequency, then divide by the total frequency.')
practice(averages, 'Find the median number of bathrooms.', 'P12 Your Turn Q1a (book’s numbers)', bath(), number(2, '2'), '66 people: find where the 33rd and 34th are.', boardModel([], [
  { title: 'Which person', say: '66 people, so halfway between the 33rd and 34th.', rows: ['(66 + 1) ÷ 2 = 33.5th'] },
  { title: 'Add frequencies', say: 'The first 30 have 1 bathroom; the next 21, people 31 to 51, have 2.', rows: ['30 + 21 = 51', '! Median = 2'], picture: bath(undefined, [[1, 1, 'faint'], [2, 0, 'found'], [2, 1, 'found']]) },
], 'Median', bath()), slips(2, [[3, 'That’s the middle row of the table. Count 33 people in instead.'], [21, 'That’s a frequency. The median is a number of bathrooms.']]), { label: '', prefix: 'Median =' })
practice(averages, 'Why is it not possible to find the mean of the bathroom data?', 'P12 Your Turn Q1b (book’s numbers)', bath(undefined, [[5, 0, 'lit']]), choose('“5 or more” could be 5, 6 or more, so the total isn’t known',
  ['There are too many people', '66 people is fine. The mean would be the total ÷ 66, if we knew the total.'], ['The mode and median are enough', 'They are different averages. The mean still needs a total.']),
'To find a mean you need the total number of bathrooms.', boardModel([], [
  { title: 'The last row', say: 'The 3 people with “5 or more” could have 5, 6, 7 or more. Without exact values, we can’t find the total.', rows: ['! Total unknown, so no mean'] },
], 'Mean', bath()))
practice(averages, 'Find the mean number of goals scored, to the nearest whole number.', 'P12 Your Turn Q2c (book’s numbers)', goalTable(), number(2, '2'), 'Goals × frequency for each column, added up, ÷ the number of matches.', boardModel([], [
  { title: 'Total goals', say: 'Goals × frequency, added up.', rows: ['0 × 7 + 1 × 14 + 2 × 13 + 3 × 8 = 64', '4 × 3 + 5 × 4 + 6 × 1 = 38', '64 + 38 = 102'] },
  { title: 'Total matches', say: 'Add the frequencies.', rows: ['7 + 14 + 13 + 8 + 3 + 4 + 1 = 50'] },
  { title: 'Divide', say: 'Total goals ÷ matches.', rows: ['102 ÷ 50 = 2.04', '! Mean = 2 goals'] },
], 'Mean', goalTable()), slips(2, [[3, 'That’s the mean of 0 to 6. Weight each by its frequency.'], [102, 'That’s the total goals. Divide by the 50 matches.']]), { label: 'Goals', prefix: 'Mean =' })

/* ---------- Rung 3: frequency table problems ---------- */

ask(problems, 'Guess first: 240 divers in all. How many had 3 or 4 shark encounters, together?', 'P12 Your Turn Q3 (guess first)', ['0: 9, 1: 32, 2: 76, 3: x, 4: y, 5: 15', '240 divers in all'], number(108, '108'), 'The frequencies add up to 240.', boardModel([], [
  { title: 'Add what you know', say: 'The four known rows.', rows: ['9 + 32 + 76 + 15 = 132'] },
  { title: 'The rest', say: 'Everyone else had 3 or 4.', rows: ['240 − 132 = 108', '! x + y = 108'] },
], 'Divers'), slips(108, [[132, 'That’s the rows you know. Take it from 240.'], [240, 'That’s everyone. Take away the known rows, 132.']]), { label: 'Divers', prefix: 'x + y =' })
{
  const pets = (freqs: string[], tones: Tone[] = []) => table(['Pets', 'Frequency'], ['0', '1', '2', '3', '4'], freqs, '100 people’s pets, with two frequencies missing.', tones)
  worked(problems, '100 people were asked how many pets they have. 2 pets has frequency x and 3 pets has y, with x : y = 3 : 2. Find x and y.', 'Missing frequencies', 'P12 Your Turn Q3 (own numbers)', boardModel([], [
    { title: 'The missing total', say: 'The frequencies add up to 100, so x + y is what’s left.', rows: ['20 + 30 + 10 = 60', 'x + y = 100 − 60 = 40'], picture: pets(['20', '30', 'x', 'y', '10'], [[3, 1, 'lit'], [4, 1, 'lit']]) },
    { title: 'Share in the ratio', say: '3 : 2 is 5 parts, so each part is 8.', rows: ['40 ÷ 5 = 8'] },
    { title: 'x and y', say: 'x is 3 parts and y is 2.', rows: ['x = 3 × 8 = 24', 'y = 2 × 8 = 16', '! x = 24, y = 16'], picture: pets(['20', '30', '24', '16', '10'], [[3, 1, 'found'], [4, 1, 'found']]) },
  ], 'Frequencies', pets(['20', '30', 'x', 'y', '10'])), 'The frequencies add up to the total: take the known ones away to find what’s missing, then share that in the ratio.')
}
chart(problems, 'Find x and y: 240 divers, and x : y = 7 : 5. Drag the 3 and 4 bars to x and y.', 'P12 Your Turn Q3a (book’s numbers)',
  { mode: 'bars', labels: ['0', '1', '2', '3', '4', '5'], values: [9, 32, 76, 0, 0, 15], max: 80, free: [3, 4], title: 'Shark encounters' }, ['63,45'], 'x = 63, y = 45', 'x + y = 108. Share 108 in the ratio 7 : 5.', boardModel([], [
    { title: 'Share in the ratio', say: 'x + y = 108, and 7 + 5 = 12 parts.', rows: ['108 ÷ 12 = 9'] },
    { title: 'x and y', say: 'x is 7 parts and y is 5.', rows: ['x = 7 × 9 = 63', '! x = 63, y = 45'], picture: sharks(sharkFull, [[1, 4, 'found'], [1, 5, 'found']]) },
  ], 'Frequencies'), r => { const [a, b] = r.split(',').map(Number); return a + b !== 108 ? `Those make ${a + b}. x + y must be 240 − 132 = 108.` : 'They add up to 108, but must be in the ratio 7 : 5: each part is 108 ÷ 12 = 9.' })
practice(problems, 'What is the modal number of shark encounters?', 'P12 Your Turn Q3b (book’s numbers)', sharks(sharkFull), number(2, '2'), 'Which row has the biggest frequency?', boardModel([], [
  { title: 'Biggest frequency', say: '76 divers had 2 encounters, more than any other number.', rows: ['! Mode = 2'], picture: sharks(sharkFull, [[0, 3, 'found'], [1, 3, 'lit']]) },
], 'Mode', sharks(sharkFull)), slips(2, [[76, 'That’s the frequency. The mode is the number of encounters.'], [3, '3 encounters has 63 divers; 2 has 76.']]), { label: '', prefix: 'Mode =' })
practice(problems, 'What is the median number of shark encounters?', 'P12 Your Turn Q3c (book’s numbers)', sharks(sharkFull), number(3, '3'), '240 divers: find the 120th and 121st.', boardModel([], [
  { title: 'Which diver', say: 'Halfway between the 120th and 121st.', rows: ['(240 + 1) ÷ 2 = 120.5th'] },
  { title: 'Add frequencies', say: 'Up to 2 encounters is 117 divers, so the 120th and 121st had 3.', rows: ['9 + 32 + 76 = 117', '! Median = 3'], picture: sharks(sharkFull, [[1, 1, 'faint'], [1, 2, 'faint'], [1, 3, 'faint'], [0, 4, 'found'], [1, 4, 'found']]) },
], 'Median', sharks(sharkFull)), slips(3, [[2, 'Up to 2 encounters is only 117 divers; the 120th had 3.'], [2.5, 'That’s the middle of 0 to 5. Count 120 divers in.']]), { label: '', prefix: 'Median =' })
practice(problems, 'To the nearest whole number, what is the mean number of shark encounters?', 'P12 Your Turn Q3d (book’s numbers)', sharks(sharkFull), number(3, '3'), 'Encounters × frequency, added, ÷ 240.', boardModel([], [
  { title: 'Total encounters', say: 'Encounters × frequency for each row.', rows: ['0 + 32 + 152 + 189 + 180 + 75 = 628'] },
  { title: 'Divide', say: 'Total ÷ the 240 divers.', rows: ['628 ÷ 240 = 2.62', '! Mean = 3'] },
], 'Mean', sharks(sharkFull)), slips(3, [[2.5, 'That’s the mean of 0 to 5. Weight each by its frequency.'], [628, 'That’s the total. Divide by the 240 divers.']]), { label: '', prefix: 'Mean =' })

/* ---------- Review: one of each, our own numbers ---------- */

{
  const labels = ['1', '2', '3', '4', '5', '6'], want = [2, 1, 3, 4, 1, 1]
  chart('mixed', 'Twelve dice rolls: 3, 1, 4, 4, 2, 6, 3, 4, 5, 1, 4, 3. Drag each bar to its frequency.', 'P12 review (own numbers)', { mode: 'bars', labels, values: [0, 0, 0, 0, 0, 0], max: 6, title: 'Score' }, [want.join(',')], want.join(', '),
    'Count each score once.', boardModel([], [
      { title: 'Count each score', say: 'One 2, 5 and 6; two 1s; three 3s; four 4s.', rows: ['2 + 1 + 3 + 4 + 1 + 1 = 12', '! 2, 1, 3, 4, 1, 1'] },
    ], 'Table'), barsWrong(labels.map(l => `Score ${l}`), want))
}
{
  const p = (tones: Tone[] = []) => table(['Value', 'Frequency'], ['1', '2', '3', '4'], ['5', '8', '4', '3'], 'Values 1 to 4 with frequencies 5, 8, 4 and 3.', tones)
  practice('mixed', 'Find the mean.', 'P12 review (own numbers)', p(), number(2.25, '2.25'), 'Value × frequency, added, ÷ the total frequency.', boardModel([], [
    { title: 'Σfx and Σf', say: 'Value × frequency, added; and the frequencies added.', rows: ['5 + 16 + 12 + 12 = 45', '5 + 8 + 4 + 3 = 20'] },
    { title: 'Divide', say: 'Total ÷ how many.', rows: ['45 ÷ 20 = 2.25', '! Mean = 2.25'] },
  ], 'Mean', p()), slips(2.25, [[2.5, 'That’s the mean of 1 to 4. Weight each by its frequency.'], [11.25, 'Divide by the total frequency, 20, not by 4.']]), { label: 'Mean', prefix: 'Mean =' })
  practice('mixed', 'Find the median.', 'P12 review (own numbers)', p(), number(2, '2'), '20 values: the 10th and 11th.', boardModel([], [
    { title: 'Add frequencies', say: 'The first 5 are 1s; the next 8, up to the 13th, are 2s.', rows: ['5 + 8 = 13', '! Median = 2'], picture: p([[1, 1, 'faint'], [2, 0, 'found'], [2, 1, 'found']]) },
  ], 'Median', p()), slips(2, [[2.5, 'That’s the middle of 1 to 4. Count 10 values in.'], [8, 'That’s a frequency. The median is a value.']]), { label: 'Median', prefix: 'Median =' })
}

add('mixed', 'Frequency tables', 'P12 consolidation', text(
  'A frequency table: each value once, with how many times it happens.',
  'The frequencies add up to the total: use that to find a missing one.',
  'Mode: biggest frequency. Median: the (n + 1) ÷ 2th, by adding frequencies.',
  'Mean: Σ(value × frequency) ÷ Σfrequency. A “5 or more” row means no mean.',
))

export const tutorFrequencyTablesLesson: TutorMethodLesson = {
  id: 'L312', number: 312, title: 'Frequency tables', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Build a frequency table from data, find the mode, median and mean from one, and find missing frequencies from a total and a ratio.',
  labels: { [build]: 'Building frequency tables', [averages]: 'Averages from a table', [problems]: 'Missing frequencies', mixed: 'Review' },
  states: finish(),
}
