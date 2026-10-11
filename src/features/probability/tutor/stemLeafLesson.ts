import { author } from '../../written-methods/tutor/content'
import type { FigureItem, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { fig, slips } from '../../geometry/tutor/figureLesson'
import type { SortTile } from '../../written-methods/tutor/SortBoard'
import { chanceScreens } from './chanceLesson'
import { stemLeafFig } from './statsPictures'

/*
 * Statistics lesson 11: Stem and leaf diagrams. From P11 in Sunny's revision book (p191–193): drawing one (Scott's choir
 * heights, key 18 | 2 = 182 cm, in four steps) and using one (Ramona's colleagues' ages: mode 32, median 32, range
 * 55 − 19 = 36), and Your Turn: Kim's plants, Wallace's journeys, the calves (and Derek, 156 lb), Jamal's points and
 * the back-to-back French and Spanish mock exams.
 *
 * Three rungs: drawing (values sorted onto their stems on the sort board), reading (mode, median, range, mean,
 * percentages and a probability) and comparing two sets on a back-to-back diagram. Each rung opens with something to
 * sort or a guess.
 *
 * The book says "11 mock exam results" for Q5; that is Year 11: each side of the diagram has 19 marks. Hidden on live:
 * only the unlisted Probability shelf opens it.
 */

const lesson = author(311)
const { add, finish } = lesson
const { worked, practice, ask, playSort, sort } = chanceScreens(lesson)
const draw = 'stem-draw'
const read = 'stem-read'
const compare = 'stem-compare'

type Tone = [number, number, FigureTone]
/** Every leaf of a row, in one tone. */
const row = (r: number, count: number, tone: FigureTone, from = 0): Tone[] => Array.from({ length: count }, (_, i) => [r, from + i, tone])
/** Bins for the sort board, one per stem, and a tile for each value with why it goes there. */
const stemBins = (stems: string[]) => stems.map(s => ({ id: `s${s}`, label: s }))
const tilesFor = (values: number[], stemOf: (v: number) => string, say: (v: number, stem: string) => string): SortTile[] => values.map(v => ({ label: String(v), to: `s${stemOf(v)}`, why: say(v, stemOf(v)) }))

/* ---------- The book's data ---------- */

const scottStems = ['15', '16', '17', '18', '19'], scottLeaves = [[3, 4, 4], [2, 5, 9], [2, 6, 6, 6, 7], [0, 2, 6, 7], [0]]
const scott = (tones: Tone[] = [], leaves = scottLeaves) => stemLeafFig(scottStems, leaves, '18 | 2 = 182 cm', 'Scott’s choir heights as a stem and leaf diagram.', { tones })
const ramonaStems = ['1', '2', '3', '4', '5'], ramonaLeaves = [[9, 9], [0, 4, 7, 8], [1, 2, 2, 2, 6], [0, 5, 5], [5]]
const ramona = (tones: Tone[] = [], caption?: string) => stemLeafFig(ramonaStems, ramonaLeaves, '3 | 1 = 31 years', 'Ramona’s colleagues’ ages: 15 ages from 19 to 55.', { tones, caption })
const kimStems = ['1', '2', '3', '4'], kimLeaves = [[4, 9], [2, 4, 9], [2, 5, 5, 6, 8], [1, 7]]
const wallaceStems = ['0', '1', '2', '3', '4', '5'], wallaceLeaves = [[9], [0, 2, 2, 3, 5, 7, 9], [4, 7, 8], [2, 6], [7], [1]]
const wallace = (tones: Tone[] = [], caption?: string) => stemLeafFig(wallaceStems, wallaceLeaves, '2 | 4 = 24 minutes', 'Wallace’s 15 journey times in minutes.', { tones, caption })
const calfStems = ['9', '10', '11', '12', '13', '14'], calfLeaves = [[3, 7, 7, 8], [1, 3, 6, 6, 9], [2, 2, 4, 4, 5, 8], [0, 1, 1, 1, 3, 6], [2, 8], [3]]
const calves = (tones: Tone[] = [], caption?: string) => stemLeafFig(calfStems, calfLeaves, '11 | 2 = 112 lb', 'The 24 calves’ weights in pounds.', { tones, caption })
const jamalStems = ['0', '1', '2', '3', '4'], jamalLeaves = [[2, 4, 7], [0, 4, 6, 6, 7, 9], [2, 6, 8, 9], [3, 7, 9], [0]]
const jamal = (tones: Tone[] = [], caption?: string) => stemLeafFig(jamalStems, jamalLeaves, '3 | 3 = 33 points', 'Jamal’s points in 17 matches.', { tones, caption })
const langStems = ['3', '4', '5', '6', '7', '8'], french = [[], [2, 6, 7, 9], [1, 3, 9], [2, 5, 5, 6], [0, 0, 1, 2, 7], [0, 1, 7]], spanish = [[2, 6, 9], [1, 8], [6, 7, 7, 9], [0, 2, 5, 7, 8], [3, 5, 9], [8, 9]]
/**
 * The back-to-back diagram, drawn here rather than with statsPictures.ts's stemLeafFig, which packs the left leaves
 * against the stem: wider leaf spacing, both lines either side of the stem, and the two keys in the caption. Tones
 * as stemLeafFig: [row, leaf], negative leaves counting the French side outwards from the stem (-1 the nearest).
 */
const langs = (tones: Tone[] = [], caption?: string) => {
  const rowH = 1, gap = 0.85, top = langStems.length * rowH, items: FigureItem[] = []
  const tone = (r: number, i: number) => tones.find(([tr, ti]) => tr === r && ti === i)?.[2]
  items.push({ kind: 'line', from: [-0.55, top], to: [-0.55, 0] }, { kind: 'line', from: [0.55, top], to: [0.55, 0] })
  langStems.forEach((stem, r) => {
    const y = top - (r + 0.5) * rowH
    items.push({ kind: 'text', at: [0, y], text: stem, name: true })
    spanish[r].forEach((leaf, i) => { const t = tone(r, i); items.push({ kind: 'text', at: [1.05 + i * gap, y], text: String(leaf), ...(t ? { tone: t } : {}) }) })
    french[r].forEach((leaf, i) => { const t = tone(r, -(i + 1)); items.push({ kind: 'text', at: [-1.05 - i * gap, y], text: String(leaf), ...(t ? { tone: t } : {}) }) })
  })
  items.push({ kind: 'text', at: [-2.6, top + 0.7], text: 'French', tone: 'faint' }, { kind: 'text', at: [2.6, top + 0.7], text: 'Spanish', tone: 'faint' })
  return fig(items, 'Back to back: French on the left, Spanish on the right, 19 marks each.', caption ?? 'Keys: 2 | 4 | = 42 and | 3 | 6 = 36')
}

/* ---------- Rung 1: drawing a stem and leaf diagram ---------- */

playSort(draw, 'Put each height on its stem: its first two digits.', 'P11 p191 Drawing a stem and leaf diagram (play)', { kind: 'bins', bins: stemBins(scottStems),
  tiles: tilesFor([154, 180, 176, 153, 162, 165, 186, 190], v => String(Math.floor(v / 10)), (v, s) => `${v} is ${s} | ${v % 10}: its stem is ${s}.`) })
ask(draw, 'Guess first: the key says 18 | 2 means 182 cm. What does 16 | 5 mean?', 'P11 p191 (guess first)', ['Key: 18 | 2 means 182 cm', 'What is 16 | 5?'], number(165, '165 cm'), 'The stem is the first two digits, the leaf the last.', boardModel([], [
  { title: 'Follow the key', say: 'Stem 16 and leaf 5 make 165, as 18 and 2 make 182.', rows: ['16 | 5 = 165', '! 165 cm'] },
], 'Height'), slips(165, [[16.5, 'The key says 18 | 2 is 182, not 18.2. So 16 | 5 is 165.'], [65, 'The stem 16 gives the first two digits: 165.']]), { label: 'Height (cm)', prefix: 'Height =' })
worked(draw, 'Scott measured the heights of people in his choir, in cm: 154, 180, 176, 153, 162, 165, 154, 186, 190, 187, 176, 176, 172, 182, 177, 169. Draw a stem and leaf diagram.', 'Drawing a stem and leaf diagram', 'P11 p191 Drawing a stem and leaf diagram (book’s numbers)', boardModel([], [
  { title: 'Choose the key', say: 'The stem is the first two digits and the leaf the last one.', rows: ['Key: 18 | 2 = 182 cm'], picture: scott([], [[], [], [], [], []]) },
  { title: 'Write the stems', say: 'From the smallest, 153, to the biggest, 190: stems 15 to 19.', rows: ['>0 Stems 15, 16, 17, 18, 19'], picture: scott([], [[], [], [], [], []]) },
  { title: 'Put them in order', say: 'Write the heights from smallest to biggest.', rows: ['>0 153, 154, 154, 162, 165, 169, 172, …, 190'] },
  { title: 'Write the leaves', say: 'Each last digit goes next to its stem, in order, lined up in columns.', rows: ['! 16 heights on 5 stems, with the key'], picture: scott() },
], 'Diagram', scott()), 'The stem is the first digit or digits; the leaf is the last digit. Write the leaves in order, lined up, and always give a key.')
sort(draw, 'Kim’s plant heights in cm. Put each one on its stem (key 3 | 8 = 38 cm).', 'P11 Your Turn Q1 (book’s numbers)', { kind: 'bins', bins: stemBins(kimStems),
  tiles: tilesFor([38, 14, 22, 36, 35, 29, 19, 24, 32, 35, 41, 47], v => String(Math.floor(v / 10)), (v, s) => `${v} is ${s} | ${v % 10}: the tens digit is its stem.`) },
'The stem is the tens digit.', boardModel([], [
  { title: 'Stems are the tens', say: 'From 14 to 47, so stems 1 to 4.', rows: ['>0 Stems 1, 2, 3, 4'] },
  { title: 'Leaves in order', say: 'Each units digit next to its stem, smallest first.', rows: ['! 1 | 4 9, 2 | 2 4 9, 3 | 2 5 5 6 8, 4 | 1 7'], picture: stemLeafFig(kimStems, kimLeaves, '3 | 8 = 38 cm', 'Kim’s plants as a stem and leaf diagram.') },
], 'Diagram'))
ask(draw, 'A key says 2 | 4 means 2.4 kg. What does 3 | 7 mean, in kg?', 'P11 p191 (own numbers)', ['Key: 2 | 4 means 2.4 kg', 'What is 3 | 7?'], number(3.7, '3.7 kg'), 'Here the leaf is the tenths digit.', boardModel([], [
  { title: 'Follow the key', say: 'The key puts the leaf after the decimal point.', rows: ['3 | 7 = 3.7', '! 3.7 kg'] },
], 'Weight'), slips(3.7, [[37, 'The key says 2 | 4 is 2.4, so the leaf is tenths: 3.7.'], [0.37, 'The stem is the whole kilograms: 3 | 7 is 3.7.']]), { label: 'Weight (kg)', prefix: 'Weight =' })

/* ---------- Rung 2: reading a stem and leaf diagram ---------- */

practice(read, 'Guess first: which age comes up most often in Ramona’s diagram?', 'P11 p191 (guess first)', ramona(), number(32, '32'), 'Look for a leaf repeated on one stem.', boardModel([], [
  { title: 'The repeated leaf', say: 'On stem 3 the leaf 2 appears three times: 32, 32, 32.', rows: ['! Mode = 32'], picture: ramona(row(2, 3, 'found', 1)) },
], 'Mode', ramona()), slips(32, [[2, 'That’s the leaf. With its stem, 3 | 2 is 32.'], [3, 'That’s the stem. The leaf 2 appears three times on it: 32.']]), { label: 'Age', prefix: 'Mode =' })
worked(read, 'Ramona recorded her colleagues’ ages in a stem and leaf diagram. Find the mode, median and range of the ages.', 'Reading a stem and leaf diagram', 'P11 p191 Using a stem and leaf diagram (book’s numbers)', boardModel([], [
  { title: 'The mode', say: 'The most common value: 3 | 2 appears three times.', rows: ['Mode = 32'], picture: ramona(row(2, 3, 'lit', 1)) },
  { title: 'The median', say: 'The leaves are already in order. 15 ages, so the middle is the 8th: count 2, then 4, then 2 more.', rows: ['(15 + 1) ÷ 2 = 8th', 'Median = 32'], picture: ramona([...row(0, 2, 'faint'), ...row(1, 4, 'faint'), [2, 0, 'faint'], [2, 1, 'found']]) },
  { title: 'The range', say: 'Biggest take smallest: the last leaf and the first.', rows: ['55 − 19 = 36', '! Mode 32, median 32, range 36'], picture: ramona([[0, 0, 'found'], [4, 0, 'found']], 'Range = 55 − 19') },
], 'Averages', ramona()), 'The leaves are in order, so the median is counted from either end and the range is the last value take the first. Read every value with the key.')
practice(read, 'What percentage of Wallace’s journeys took under 20 minutes? Give it to 1 decimal place.', 'P11 Your Turn Q2c (book’s numbers)', wallace(), number(53.3, '53.3%'), 'Count the journeys on stems 0 and 1.', boardModel([], [
  { title: 'Count them', say: 'Under 20 minutes is stems 0 and 1: 1 + 7 journeys, out of 15.', rows: ['1 + 7 = 8 of 15'], picture: wallace([...row(0, 1, 'lit'), ...row(1, 7, 'lit')]) },
  { title: 'As a percentage', say: 'Out of 15, times 100.', rows: ['8 ÷ 15 × 100 = 53.33…', '! 53.3%'] },
], 'Percentage', wallace()), slips(53.3, [[8, 'That’s how many journeys. As a percentage: 8 ÷ 15 × 100.'], [46.7, 'That’s the journeys of 20 minutes or more.']]), { label: 'Percentage (%)', prefix: 'Under 20 =' })
practice(read, 'What is the median number of points Jamal scored in a match?', 'P11 Your Turn Q4a (book’s numbers)', jamal(), number(19, '19'), '17 matches: the middle one is the 9th.', boardModel([], [
  { title: 'Which value', say: 'With 17 matches the middle is the (17 + 1) ÷ 2 = 9th.', rows: ['(17 + 1) ÷ 2 = 9th'] },
  { title: 'Count to it', say: 'Stem 0 has 3 values; the 9th is the 6th on stem 1.', rows: ['3 + 6 = 9th value', '! Median = 19'], picture: jamal([...row(0, 3, 'faint'), ...row(1, 5, 'faint'), [1, 5, 'found']]) },
], 'Median', jamal()), slips(19, [[9, 'That’s which value, the 9th. Read it off: 19.'], [17, 'That’s how many matches. The median is the 9th value: 19.']]), { label: 'Points', prefix: 'Median =' })
practice(read, 'When Jamal scores over 25 points, his team wins. If he scores the same in the next match as in one of these, what is the probability his team wins? Give it to 1 decimal place.', 'P11 Your Turn Q4d (book’s numbers)', jamal(), number(0.4, '0.4'), 'Count the scores over 25.', boardModel([], [
  { title: 'Over 25 points', say: '26, 28, 29, 33, 37, 39 and 40: 7 of the 17.', rows: ['Over 25 = 7 of 17'], picture: jamal([[2, 1, 'found'], [2, 2, 'found'], [2, 3, 'found'], ...row(3, 3, 'found'), [4, 0, 'found']]) },
  { title: 'As a probability', say: 'Matches over 25 ÷ all the matches.', rows: ['7 ÷ 17 = 0.41…', '! P(win) = 0.4'] },
], 'Probability', jamal()), slips(0.4, [[0.6, 'That’s the chance of 25 or less, so losing.'], [7, 'That’s how many matches. As a probability: 7 ÷ 17.']]), { label: '', prefix: 'P(win) =' })
practice(read, 'To the nearest pound, what is the mean weight of the calves?', 'P11 Your Turn Q3c (book’s numbers)', calves(), number(114, '114 lb'), 'Add each row, then divide by how many calves.', boardModel([], [
  { title: 'Add row by row', say: 'Read each value with the key, and add each row.', rows: ['385 + 525 + 685 + 732 + 270 + 143 = 2740'], picture: calves() },
  { title: 'Divide by how many', say: 'There are 24 calves.', rows: ['2740 ÷ 24 = 114.17', '! Mean = 114 lb'] },
], 'Mean', calves()), slips(114, [[2740, 'That’s the total. Divide by 24 calves.'], [121, 'That’s the mode. The mean shares out the total.']]), { label: 'Mean', prefix: 'Mean =' })
practice(read, 'The farmer forgot Derek, who weighs 156 lb. If Derek is included, what happens to the mean?', 'P11 Your Turn Q3d (book’s numbers)', calves(), choose('It goes up, to about 116 lb',
  ['It goes down', '156 is above the mean of 114, so it pulls the mean up.'], ['It stays the same', 'Every value counts in the mean, so adding one changes it.']),
'Is 156 above or below the mean, 114?', boardModel([], [
  { title: 'Add Derek', say: '156 is heavier than every calf, so the mean goes up.', rows: ['2740 + 156 = 2896', '2896 ÷ 25 = 115.84', '! It goes up, to about 116 lb'] },
], 'Mean', calves()))

/* ---------- Rung 3: back-to-back diagrams ---------- */

practice(compare, 'Guess first: which language did better in the mock exams?', 'P11 Your Turn Q5 (guess first)', langs(), choose('French: more of its marks sit on the high stems',
  ['Spanish', 'Spanish has the top mark, 89, but more of its marks are in the 30s to 50s.'], ['You can’t tell', 'You can: see where most leaves sit, or compare the medians.']),
'Which side has more leaves on the 60s, 70s and 80s?', boardModel([], [
  { title: 'Where the leaves sit', say: 'French has 12 marks of 60 or more; Spanish has 10, and 3 marks in the 30s.', rows: ['French 60+ = 12, Spanish 60+ = 10', '! French did better'] },
], 'Compare', langs()))
worked(compare, 'Compare the French and Spanish mock exam results, using the median and the range.', 'Back-to-back diagrams', 'P11 Your Turn Q5 (book’s numbers)', boardModel([], [
  { title: 'Read both ways', say: 'French leaves read outwards from the stem, right to left: 2 | 4 | is 42.', rows: ['>0 French: 42, 46, 47, 49, 51, …, 87', '>0 Spanish: 32, 36, 39, 41, 48, …, 89'], picture: langs() },
  { title: 'The medians', say: '19 marks each, so the 10th. French: 65; Spanish: 60.', rows: ['(19 + 1) ÷ 2 = 10th', 'French = 65, Spanish = 60'], picture: langs([[3, -3, 'found'], [3, 0, 'found']]) },
  { title: 'The ranges', say: 'Biggest take smallest on each side.', rows: ['French 87 − 42 = 45', 'Spanish 89 − 32 = 57', '! French: higher median, smaller range'] },
], 'Compare', langs()), 'In a back-to-back diagram the left leaves read outwards from the stem. Compare an average (the median) and the spread (the range).')
practice(compare, 'What is the modal score for Spanish?', 'P11 Your Turn Q5a (book’s numbers)', langs(), number(57, '57'), 'Spanish is the right-hand side. Find a leaf repeated on one stem.', boardModel([], [
  { title: 'The repeated leaf', say: 'On stem 5, the leaf 7 appears twice. No other Spanish mark repeats.', rows: ['! Mode = 57'], picture: langs([[2, 1, 'found'], [2, 2, 'found']]) },
], 'Mode', langs()), slips(57, [[7, 'That’s the leaf. With its stem: 57.'], [70, 'That’s on the French side. Spanish is on the right.']]), { label: 'Mark', prefix: 'Mode =' })
practice(compare, 'What is the difference between the range for French and the range for Spanish?', 'P11 Your Turn Q5c (book’s numbers)', langs(), number(12, '12'), 'Find each range first.', boardModel([], [
  { title: 'Each range', say: 'Biggest take smallest on each side.', rows: ['French: 87 − 42 = 45', 'Spanish: 89 − 32 = 57'], picture: langs([[0, 0, 'lit'], [5, 1, 'lit'], [1, -1, 'lit'], [5, -3, 'lit']]) },
  { title: 'The difference', say: 'Take the smaller range from the bigger.', rows: ['57 − 45 = 12', '! Difference = 12'] },
], 'Range', langs()), slips(12, [[45, 'That’s the French range. Take it from the Spanish range, 57.'], [57, 'That’s the Spanish range. Take away the French range, 45.']]), { label: 'Marks', prefix: 'Difference =' })
practice(compare, 'By what percentage is the French median greater than the Spanish median? Give it to the nearest whole number.', 'P11 Your Turn Q5d (book’s numbers)', langs(), number(8, '8%'), 'The medians are 65 and 60. Compare the difference with the Spanish median.', boardModel([], [
  { title: 'The difference', say: 'French 65, Spanish 60.', rows: ['65 − 60 = 5'] },
  { title: 'As a percentage', say: 'Greater than Spanish, so out of Spanish’s 60.', rows: ['5 ÷ 60 × 100 = 8.33…', '! 8% greater'] },
], 'Percentage', langs()), slips(8, [[5, 'That’s the difference in marks. As a percentage of 60: 5 ÷ 60 × 100.'], [8.3, 'Round to the nearest whole number: 8.']]), { label: 'Percentage (%)', prefix: 'Greater by' })

/* ---------- Review: one of each, our own numbers ---------- */

sort('mixed', 'Put each value on its stem (key 2 | 3 = 23).', 'P11 review (own numbers)', { kind: 'bins', bins: stemBins(['2', '3', '4']),
  tiles: tilesFor([23, 41, 35, 28, 44, 37], v => String(Math.floor(v / 10)), (v, s) => `${v} is ${s} | ${v % 10}: the tens digit is its stem.`) },
'The stem is the tens digit.', boardModel([], [
  { title: 'Tens digit', say: 'Each value goes on its tens digit.', rows: ['! 2 | 3 8, 3 | 5 7, 4 | 1 4'] },
], 'Diagram'))
{
  const stems = ['1', '2', '3'], leaves = [[2, 5, 8], [0, 3, 3, 7], [1, 4]]
  const p = (tones: Tone[] = []) => stemLeafFig(stems, leaves, '2 | 3 = 23', 'Nine values from 12 to 34.', { tones })
  practice('mixed', 'Find the median.', 'P11 review (own numbers)', p(), number(23, '23'), 'Nine values: the middle is the 5th.', boardModel([], [
    { title: 'Count to the middle', say: '(9 + 1) ÷ 2 = 5th. Stem 1 has 3, so it’s the 2nd on stem 2.', rows: ['3 + 2 = 5th value', '! Median = 23'], picture: p([...row(0, 3, 'faint'), [1, 0, 'faint'], [1, 1, 'found']]) },
  ], 'Median', p()), slips(23, [[3, 'That’s the leaf. Read it with its stem: 23.'], [5, 'That’s which value, the 5th. Read it off: 23.']]), { label: 'Median', prefix: 'Median =' })
  practice('mixed', 'Find the range.', 'P11 review (own numbers)', p(), number(22, '22'), 'The first and last values.', boardModel([], [
    { title: 'Last take first', say: 'Biggest 34, smallest 12.', rows: ['34 − 12 = 22', '! Range = 22'], picture: p([[0, 0, 'found'], [2, 1, 'found']]) },
  ], 'Range', p()), slips(22, [[2, 'That’s 3 − 1, the stems. Use the values: 34 − 12.'], [46, 'Take the smallest away, don’t add it.']]), { label: 'Range', prefix: 'Range =' })
}

add('mixed', 'Stem and leaf diagrams', 'P11 consolidation', text(
  'Stem: the first digit or digits. Leaf: the last digit, in order, lined up.',
  'Always give a key: 18 | 2 = 182 cm.',
  'Mode: the most repeated leaf. Median: count to the middle. Range: last take first.',
  'Back to back: the left leaves read outwards. Compare a median and a range.',
))

export const tutorStemLeafLesson: TutorMethodLesson = {
  id: 'L311', number: 311, title: 'Stem and leaf diagrams', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Draw a stem and leaf diagram with a key, read the mode, median, range and mean from one, and compare two sets on a back-to-back diagram.',
  labels: { [draw]: 'Drawing stem and leaf', [read]: 'Reading stem and leaf', [compare]: 'Back-to-back diagrams', mixed: 'Review' },
  states: finish(),
}
