import { author } from '../../written-methods/tutor/content'
import type { FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { slips } from '../../geometry/tutor/figureLesson'
import { chanceScreens } from './chanceLesson'
import { tableFig } from './chancePictures'

/*
 * Probability and statistics lesson 7: Types of data. From P7 in Sunny's revision book (p179–181), with the book's
 * examples (Jason's hair colour, siblings and Rubik's cube; Chidi's ten-year-old food survey) and Your Turn questions,
 * and our own numbers for the two typed questions. Four rungs: qualitative or quantitative (words or numbers);
 * discrete or continuous (exact values or anything in a range: time is continuous even on a stopwatch, shoe sizes are
 * discrete); primary or secondary (who collected it, with each one's advantages and disadvantages); and describing
 * data with both words at once (Your Turn Q2 and Q5).
 *
 * Brilliant-style (Sunny, 11 Oct): the first three rungs are sorted by hand on the sort board (SortBoard.tsx), into
 * bins, rather than picked from a list. Rung 1 opens with a play sort, rung 2 with a guess (shoe sizes) before the
 * rule, and each card that lands in the wrong bin says why.
 *
 * Hidden on live: only the unlisted Probability shelf opens it.
 */

const lesson = author(307)
const { add, finish } = lesson
const { worked, practice, ask, playSort, sort } = chanceScreens(lesson)
const kind = 'data-qualitative'
const exact = 'data-discrete-continuous'
const source = 'data-primary-secondary'
const describe = 'data-describe'

/* ---------- Pictures ---------- */

/** A list of data and what kind each is: `marks` fill in the second column, `tones` colour its cells by row. */
function kindsFig(head: string, items: string[], marks: string[], tones: Partial<Record<number, FigureTone>> = {}, caption?: string) {
  const rows = [['Data', head], ...items.map((item, k) => [item, marks[k] ?? ''])]
  return tableFig(rows, `A table of data: ${items.join(', ')}.`, { tones: Object.entries(tones).map(([k, t]) => [Number(k) + 1, 1, t!] as [number, number, FigureTone]), caption })
}

/* ---------- Rung 1: qualitative or quantitative ---------- */

const WORDS_NUMBERS = [{ id: 'words', label: 'Words: qualitative' }, { id: 'numbers', label: 'Numbers: quantitative' }]
playSort(kind, 'Sort each kind of data: is it words or numbers?', 'P7 p179 (play)', { kind: 'bins', bins: WORDS_NUMBERS, tiles: [
  { label: 'Hair colour', to: 'words', why: 'Brown, black, blonde: words.' },
  { label: 'Siblings', to: 'numbers', why: 'You count siblings: 0, 1, 2.' },
  { label: 'Favourite band', to: 'words', why: 'A band’s name is words.' },
  { label: 'Rubik’s cube time', to: 'numbers', why: 'A time is a number of seconds.' },
  { label: 'Eye colour', to: 'words', why: 'Blue, brown, green: words.' },
  { label: 'Goals scored', to: 'numbers', why: 'Goals are counted: 0, 1, 3.' },
] })
{
  const items = ['Hair colour', 'Siblings', 'Rubik’s time']
  const p = kindsFig('Words or numbers?', items, ['?', '?', '?'])
  worked(kind, 'Jason records three things about his classmates. Which are qualitative?', 'Qualitative or quantitative', 'P7 p180 Example 1 (book’s data)', boardModel([], [
    { title: 'Words or numbers?', say: 'Hair colour is written in words: brown, black, blonde. Words are qualitative, also called categorical.', rows: ['Hair colour = words'], picture: kindsFig('Words or numbers?', items, ['words', '?', '?'], { 0: 'lit' }) },
    { title: 'The other two', say: 'How many siblings, and how fast he solves a Rubik’s cube, are both numbers. Numbers are quantitative.', rows: ['Siblings, time = numbers'], picture: kindsFig('Words or numbers?', items, ['words', 'numbers', 'numbers'], { 1: 'lit', 2: 'lit' }) },
    { title: 'Name them', say: 'So hair colour is the only qualitative data. The other two are quantitative.', rows: ['! Qualitative: hair colour'], picture: kindsFig('Words or numbers?', items, ['qualitative', 'quantitative', 'quantitative'], { 0: 'found' }, 'Hair colour is qualitative') },
  ], 'Type', p), 'Qualitative (or categorical) data is words, like football teams or favourite takeaways, and usually comes from a survey. Quantitative data is numbers.')
}
sort(kind, 'Sort these into qualitative and quantitative data.', 'P7 Your Turn Q1 (book’s data, and our own)', { kind: 'bins', bins: WORDS_NUMBERS, tiles: [
  { label: 'Car colour', to: 'words', why: 'Red, silver, black: words, so qualitative.' },
  { label: 'Weight', to: 'numbers', why: 'A weight is a number of kilograms, so quantitative.' },
  { label: 'Favourite sport', to: 'words', why: 'Football, tennis: words, so qualitative.' },
  { label: 'Texts sent today', to: 'numbers', why: 'You count texts: a number, so quantitative.' },
  { label: 'Country of birth', to: 'words', why: 'A country’s name is words, so qualitative.' },
] }, 'Is it written in words or in numbers?', boardModel([], [
  { title: 'Words', say: 'Colours, sports and countries are written in words: qualitative.', rows: ['>0 Car colour, sport, country'] },
  { title: 'Numbers', say: 'Weight and texts sent are numbers: quantitative.', rows: ['! Weight, texts: quantitative'] },
], 'Type'))
{
  const items = ['Football team', 'Shoe size', 'Takeaway', 'Height', 'Eye colour', 'Pets owned']
  const p = kindsFig('Words or numbers?', items, [])
  practice(kind, 'How many of these six are qualitative data?', 'P7 p179 (own list)', p, number(3, '3'), 'Count the ones written in words.', boardModel([], [
    { title: 'Words or numbers?', say: 'Team names, takeaways and eye colours are words. Shoe size, height and pets owned are numbers.', rows: ['>0 Words: team, takeaway, eye colour'], picture: kindsFig('Words or numbers?', items, ['words', 'numbers', 'words', 'numbers', 'words', 'numbers'], { 0: 'lit', 2: 'lit', 4: 'lit' }) },
    { title: 'Count them', say: 'Three are words, so three are qualitative.', rows: ['! Qualitative = 3'], picture: kindsFig('Words or numbers?', items, ['words', 'numbers', 'words', 'numbers', 'words', 'numbers'], { 0: 'found', 2: 'found', 4: 'found' }, '3 are qualitative') },
  ], 'Count', p), slips(3, [[6, 'Only the ones in words. Shoe size and height are numbers.'], [2, 'Takeaway counts too: pizza, curry, Chinese are words.']]), { label: 'How many', prefix: 'Qualitative =' })
}

/* ---------- Rung 2: discrete or continuous ---------- */

ask(exact, 'Guess first: Tahani records the shoe sizes of her classmates. Discrete or continuous?', 'P7 Your Turn Q3 (book’s data)', ['Shoe sizes: 6, 7, 7½, 8, 9 …'], choose('Discrete',
  ['Continuous', 'Feet can be any length, but shoes only come in certain sizes. There’s no size 7.3.'], ['Qualitative', 'Shoe sizes are numbers, so quantitative.']),
'Can a shoe size be any value?', boardModel([], [
  { title: 'Only certain sizes', say: 'A foot’s length is continuous, but shoe sizes only come in steps: 7, 7½, 8. Only exact values, so discrete.', rows: ['Size = 7, 7½, 8 …', '! Discrete'] },
], 'Type'))
worked(exact, 'Jason records how many siblings each classmate has, and how fast each solves a Rubik’s cube. Discrete or continuous?', 'Discrete or continuous', 'P7 p180 Example 1 (book’s data)', boardModel([], [
  { title: 'Counting siblings', say: 'You can have 1 or 2 siblings, but not 1.6. Only exact values: that’s discrete.', rows: ['Siblings = 0, 1, 2, 3 …', '>0 Only exact values: discrete'] },
  { title: 'Timing the cube', say: 'A stopwatch stops at hundredths of a second, but time itself can be any value in between. Time is continuous.', rows: ['Time = 47.36 s, 47.361 s …', '>0 Any value: continuous'] },
  { title: 'Name them', say: 'Counting gives discrete data. Measuring gives continuous data.', rows: ['! Siblings: discrete; time: continuous'] },
], 'Type'), 'Quantitative data is discrete or continuous. Discrete data can only take certain exact values, usually whole numbers: children, shoe sizes. Continuous data can take any value in a range: heights, weights, race times.')
sort(exact, 'Sort these into discrete and continuous data.', 'P7 Your Turn Q1 (book’s data, and our own)', { kind: 'bins', bins: [{ id: 'discrete', label: 'Discrete: counted' }, { id: 'continuous', label: 'Continuous: measured' }], tiles: [
  { label: 'Dogs’ heights', to: 'continuous', why: 'A height is measured, and can be any value, like 41.37 cm.' },
  { label: 'People in a queue', to: 'discrete', why: 'You count people: 7 or 8, never 7.5.' },
  { label: 'Snakes’ lengths', to: 'continuous', why: 'A length is measured, and can be any value.' },
  { label: 'Children in a family', to: 'discrete', why: 'You count children: whole numbers only.' },
  { label: '100 m times', to: 'continuous', why: 'Time can be any value, even if a stopwatch rounds it.' },
] }, 'Is it counted or measured?', boardModel([], [
  { title: 'Counted', say: 'People and children are counted: only exact values.', rows: ['>0 Queue, children: discrete'] },
  { title: 'Measured', say: 'Heights, lengths and times are measured: any value in a range.', rows: ['! Heights, lengths, times: continuous'] },
], 'Type'))

/* ---------- Rung 3: primary or secondary ---------- */

worked(source, 'Chidi uses an online survey of 200 people from 10 years ago: favourite food, Italian, Chinese, Indian or Thai. Describe his data.', 'Primary or secondary', 'P7 p181 Example 2 (book’s data)', boardModel([], [
  { title: 'Who collected it?', say: 'Someone else did the survey, and Chidi found it online. That’s secondary data.', rows: ['Collector = someone else', '>0 Secondary'] },
  { title: 'Words or numbers?', say: 'The answers are kinds of food: words. That’s categorical.', rows: ['Italian, Chinese … = words', '>0 Categorical'] },
  { title: 'Good and bad', say: 'It saved him time. But it’s 10 years old, and people only had 4 foods to choose from.', rows: ['>0 Advantage: saves time', '>0 Disadvantage: old, only 4 choices', '! Secondary, categorical'] },
], 'Describe'), 'Primary data is collected by you, first-hand: it’s relevant and you know it’s reliable, but it takes time and can cost money. Secondary data was collected by someone else: it’s quick and cheap, but may not suit you, and you can’t be sure it’s fair.')
sort(source, 'Sort these into primary and secondary data.', 'P7 p179 and Your Turn Q4 (book’s examples, and our own)', { kind: 'bins', bins: [{ id: 'primary', label: 'Primary: you collect it' }, { id: 'secondary', label: 'Secondary: someone else did' }], tiles: [
  { label: 'Michael asks families', to: 'primary', why: 'Michael asks the families himself, first-hand.' },
  { label: 'Newspaper statistics', to: 'secondary', why: 'A newspaper collected it, not you.' },
  { label: 'Your own traffic count', to: 'primary', why: 'You counted the cars yourself.' },
  { label: 'An old online survey', to: 'secondary', why: 'Someone else ran the survey; you found it online.' },
  { label: 'A class vote you run', to: 'primary', why: 'You ran the vote, so you collected it.' },
] }, 'Who collected it: you, or someone else?', boardModel([], [
  { title: 'You collected it', say: 'Asking, counting or voting yourself is first-hand: primary.', rows: ['>0 Michael, traffic count, class vote'] },
  { title: 'Someone else did', say: 'Newspapers and old surveys were collected by other people: secondary.', rows: ['! Newspaper, online survey: secondary'] },
], 'Source'))
ask(source, 'What’s an advantage of Michael collecting the data himself?', 'P7 Your Turn Q4 (book’s data)', ['Primary data: Michael asks the families'], choose('He knows how it was collected, so it’s reliable',
  ['It’s quicker than finding it', 'Collecting it yourself takes more time. That’s a disadvantage.'], ['It costs nothing', 'Primary data can cost money, for printing or paying people.'], ['Someone else checked it', 'No one else was involved. He collected it himself.']),
'Think about what you know when you collect it yourself.', boardModel([], [
  { title: 'Primary data', say: 'He asked the questions himself, so he knows they’re relevant and the answers are reliable.', rows: ['>0 Relevant to his question', '! He knows it’s reliable'] },
], 'Advantage'))
ask(source, 'Lola uses statistics from a newspaper. What’s a disadvantage?', 'P7 p179 (book’s example)', ['Secondary data: newspaper statistics'], choose('She can’t be sure it was collected fairly',
  ['It takes a long time', 'Secondary data saves time. It’s already collected.'], ['It costs a lot', 'Secondary data is usually free or cheap.'], ['It’s always out of date', 'Not always. The problem is not knowing how it was collected.']),
'She didn’t collect it herself.', boardModel([], [
  { title: 'Secondary data', say: 'Someone else collected it, so she doesn’t know who was asked or how. It may not be representative, or suit her purpose.', rows: ['>0 Collected by someone else', '! Can’t be sure it’s fair'] },
], 'Disadvantage'))
ask(source, 'In Chidi’s survey of 200 people, 25% chose Italian. How many people chose Italian?', 'P7 p181 Example 2 (own numbers)', ['200 people asked', '25% chose Italian'], number(50, '50'), 'Find 25% of 200: a quarter.', boardModel([], [
  { title: 'A quarter of 200', say: '25% is a quarter. Divide 200 by 4.', rows: ['200 ÷ 4 = 50', '! Italian = 50 people'] },
], 'Count'), slips(50, [[25, 'That’s 25% of 100. The survey asked 200 people.'], [8, 'That’s 200 ÷ 25. 25% is a quarter: 200 ÷ 4.']]), { label: 'People', prefix: 'Italian =' })

/* ---------- Rung 4: describing data ---------- */

worked(describe, 'Steve asks his 30 classmates about Harry Kane. Half choose one of six phrases; the other half give him a rating out of 10. Describe both kinds of data.', 'Describing data', 'P7 Your Turn Q5 (book’s data)', boardModel([], [
  { title: 'Split the class', say: 'Half of 30 is 15, so 15 choose a phrase and 15 give a rating.', rows: ['30 ÷ 2 = 15'] },
  { title: 'The phrases', say: 'A phrase like “great finisher” is words: qualitative, or categorical.', rows: ['>0 Phrases: words, qualitative'] },
  { title: 'The ratings', say: 'A rating out of 10 is a number, and only whole numbers 1 to 10: discrete quantitative.', rows: ['>0 Ratings: whole numbers, discrete', '! Qualitative and discrete'] },
], 'Describe'), 'To describe data fully, say who collected it (primary or secondary), and whether it is words (qualitative) or numbers (quantitative: discrete or continuous). Words are hard to compare or average.')
ask(describe, 'Eleanor measures the length of her friends’ hair. Describe her data.', 'P7 Your Turn Q2 (book’s data)', ['Eleanor measures it herself', 'Hair length in centimetres'], choose('Primary and continuous',
  ['Secondary and continuous', 'She measured it herself, so it’s primary.'], ['Primary and discrete', 'A length can be any value, so it’s continuous.'], ['Secondary and qualitative', 'She collected it, and lengths are numbers.']),
'Who collected it? Is it measured or counted?', boardModel([], [
  { title: 'Who collected it?', say: 'Eleanor measured it herself: primary.', rows: ['>0 Collected by Eleanor: primary'] },
  { title: 'Measured or counted?', say: 'Length can be any value: continuous.', rows: ['>0 Length: any value, continuous', '! Primary and continuous'] },
], 'Describe'))
ask(describe, 'What’s a disadvantage of Steve’s phrases compared with the ratings?', 'P7 Your Turn Q5 (book’s data)', ['15 choose one of six phrases', '15 give a rating out of 10'], choose('Words are hard to compare or average',
  ['They take longer to collect', 'Ticking a phrase is just as quick as giving a number.'], ['They are secondary data', 'Steve collected both himself: both are primary.'], ['They are continuous', 'Phrases are words, not numbers at all.']),
'Can you find the average of six phrases?', boardModel([], [
  { title: 'Words or numbers?', say: 'You can find the average of 15 ratings, but not of 15 phrases. And six phrases limit what people can say.', rows: ['>0 Only six choices', '! Hard to compare or average'] },
], 'Disadvantage'))
ask(describe, 'Rory times his friends running 100 m, with a stopwatch. Describe his data.', 'P7 p179 (own example)', ['Rory times the runners himself'], choose('Primary and continuous',
  ['Primary and discrete', 'The stopwatch rounds, but time can take any value: continuous.'], ['Secondary and continuous', 'Rory collected it himself: primary.'], ['Primary and qualitative', 'Times are numbers, so quantitative.']),
'Who collected it? Can time be any value?', boardModel([], [
  { title: 'Who collected it?', say: 'Rory timed them himself: primary.', rows: ['>0 Collected by Rory: primary'] },
  { title: 'Measured or counted?', say: 'Race times can be any value, even if a stopwatch rounds them: continuous.', rows: ['>0 Time: any value, continuous', '! Primary and continuous'] },
], 'Describe'))

add('mixed', 'Types of data', 'P7 consolidation', text(
  'Qualitative (categorical) data is words; quantitative data is numbers.',
  'Discrete data takes only exact values (shoe sizes); continuous data can be any value (heights, times).',
  'Primary data you collect yourself: relevant and reliable, but slow and can cost money.',
  'Secondary data someone else collected: quick and cheap, but you can’t be sure it’s fair.',
))

export const tutorDataTypesLesson: TutorMethodLesson = {
  id: 'L307', number: 307, title: 'Types of data', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Tell qualitative from quantitative, discrete from continuous, and primary from secondary data.',
  labels: { [kind]: 'Qualitative or quantitative', [exact]: 'Discrete or continuous', [source]: 'Primary or secondary', [describe]: 'Describing data', mixed: 'Review' },
  states: finish(),
}
