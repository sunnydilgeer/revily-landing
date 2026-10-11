import { author } from '../../written-methods/tutor/content'
import type { FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { slips } from '../../geometry/tutor/figureLesson'
import { chanceScreens } from './chanceLesson'
import { formFig } from './chancePictures'

/*
 * Probability and statistics lesson 9: Sampling and questionnaires. From P9 in Sunny's revision book (p185–187), with
 * the book's examples (asking people leaving a library, a grid over a field, Phillipa's TV question and its better
 * version) and Your Turn questions (Tilly, Saru, Samantha, Terry and the cinema), and our own numbers for the typed
 * questions. Four rungs: samples (quicker and cheaper than asking everyone, but less reliable); bias and random
 * samples; what's wrong with a question (no time frame, gaps, overlapping boxes, leading or personal questions, a
 * biased sample); and writing a better one. No board: questions in words, and questionnaire questions drawn with
 * their tick boxes, the faulty or better boxes lit.
 *
 * Hidden on live: only the unlisted Probability shelf opens it.
 */

const lesson = author(309)
const { add, finish } = lesson
const { worked, practice, ask } = chanceScreens(lesson)
const samples = 'sampling-samples'
const bias = 'sampling-bias'
const faults = 'questionnaire-faults'
const better = 'questionnaire-better'

/** A questionnaire question with its boxes; `lit` places get one tone. */
const form = (question: string, options: string[], places: number[] = [], tone: FigureTone = 'lit', caption?: string) => {
  const tones: Partial<Record<number, FigureTone>> = {}
  for (const k of places) tones[k] = tone
  return formFig(question, options, `A questionnaire question: ${question} The boxes are ${options.join(', ')}.`, { tones, caption })
}

/* ---------- Rung 1: samples ---------- */

worked(samples, 'A head teacher wants to know what all 1,200 students think of school lunches. Should she ask every one?', 'Samples', 'P9 p185 Sampling (own numbers)', boardModel([], [
  { title: 'The population', say: 'Everyone she wants to know about is the population: all 1,200 students.', rows: ['Population = 1,200 students'] },
  { title: 'Ask everyone?', say: 'Asking all 1,200 would be very reliable, but slow and expensive.', rows: ['>0 Everyone: reliable, but slow and costly'] },
  { title: 'Take a sample', say: 'Asking a smaller group, a sample, is quicker and cheaper. It’s less reliable, so make it as representative as possible.', rows: ['>0 A sample: quick, but less reliable', '! Ask a representative sample'] },
], 'Sample'), 'A sample is a smaller group you look at to learn about the whole population. It’s quicker and cheaper than asking everyone, but less reliable and could be biased, so aim for one as representative as possible.')
ask(samples, 'The head teacher asks 10% of the 1,200 students. How many students are in her sample?', 'P9 p185 Sampling (own numbers)', ['Population: 1,200 students', 'Sample: 10% of them'], number(120, '120'), '10% is a tenth: divide by 10.', boardModel([], [
  { title: 'A tenth of 1,200', say: '10% is one tenth, so divide by 10.', rows: ['1,200 ÷ 10 = 120', '! Sample = 120 students'] },
], 'Sample'), slips(120, [[12, 'That’s 1%. 10% is 1,200 ÷ 10.'], [10, 'That’s the percentage. Find 10% of 1,200.']]), { label: 'Students', prefix: 'Sample =' })
ask(samples, 'Why might she take a sample instead of asking everyone?', 'P9 p185 Sampling', ['Population: 1,200 students'], choose('It’s quicker and cheaper',
  ['It’s more reliable', 'Asking everyone is more reliable. A sample is less reliable.'], ['It can’t be biased', 'A sample can be biased if it isn’t chosen carefully.'], ['It gives the exact answer', 'Only asking everyone could do that. A sample gives an estimate.']),
'Think about time and money.', boardModel([], [
  { title: 'Why sample?', say: 'Asking 1,200 people takes a long time and costs money. A sample saves both.', rows: ['! Quicker and cheaper'] },
], 'Reason'))
ask(samples, 'Steve asks 15 of his 30 classmates. What percentage of the class is in his sample?', 'P7 Your Turn Q5 (book’s class)', ['Population: 30 classmates', 'Sample: 15 of them'], number(50, '50%'), 'What fraction of 30 is 15?', boardModel([], [
  { title: 'As a fraction', say: '15 out of 30 is a half.', rows: ['15 ÷ 30 = 0.5'] },
  { title: 'As a percentage', say: 'Times by 100.', rows: ['0.5 × 100 = 50', '! Sample = 50%'] },
], 'Percentage'), slips(50, [[15, 'That’s how many people. Find what percentage of 30 that is.'], [0.5, 'That’s a decimal. Times by 100 for a percentage.'], [2, 'That’s 30 ÷ 15. Divide the sample by the population.']]), { label: 'Percentage (%)', prefix: 'Sample =' })

/* ---------- Rung 2: bias and random samples ---------- */

worked(bias, 'To find out about reading habits, Ayo asks people leaving a library. What’s wrong with his sample?', 'Bias and random samples', 'P9 p185 Sampling (book’s example)', boardModel([], [
  { title: 'Who is asked?', say: 'Only people who have just been to a library.', rows: ['>0 Only library users'] },
  { title: 'Are they typical?', say: 'People at a library probably read more than most. They don’t represent everyone.', rows: ['>0 They read more than most', '! Biased: not representative'] },
], 'Sample'), 'A sample is biased if some people are more likely to be picked than others. Random sampling is the best way to avoid bias: everyone has the same chance, like using random numbers to pick squares from a grid over a field.')
ask(bias, 'Saru asks 100 people who live at the end of his road how much they spend on food. What’s wrong with his sample?', 'P9 Your Turn Q2 (book’s data)', ['100 people from the end of his road'], choose('It’s biased: they all live in one place',
  ['100 people is too many', '100 is a good size. The problem is who they are.'], ['It’s secondary data', 'Saru collects it himself, so it’s primary.'], ['Nothing, it’s random', 'He only asks his own road. Not everyone has a chance to be picked.']),
'Does everyone have the same chance of being asked?', boardModel([], [
  { title: 'Who is asked?', say: 'Only people from one road. Their spending may not be typical of everyone’s.', rows: ['>0 Only his road', '! Biased sample'] },
], 'Sample'))
ask(bias, 'What’s the best way for Saru to avoid bias?', 'P9 p185 Random sampling', ['Saru wants a fair sample of his town'], choose('Pick people at random',
  ['Ask his friends', 'His friends are likely to be like him. That’s biased.'], ['Ask people outside a supermarket', 'That only reaches people who shop there.'], ['Ask fewer people', 'A smaller sample isn’t any less biased.']),
'Everyone should have the same chance.', boardModel([], [
  { title: 'Random sampling', say: 'In a random sample, everyone has the same chance of being picked, so no group is favoured.', rows: ['! A random sample'] },
], 'Sample'))
ask(bias, 'A field is covered by a 10 by 10 grid. Random numbers pick 20 squares to count the flowers in. What percentage of the field is sampled?', 'P9 p185 Random sampling (own numbers)', ['A 10 by 10 grid over the field', '20 squares picked at random'], number(20, '20%'), 'How many squares are there altogether?', boardModel([], [
  { title: 'Count the squares', say: 'A 10 by 10 grid has 100 squares.', rows: ['10 × 10 = 100'] },
  { title: 'As a percentage', say: '20 out of 100 is 20%.', rows: ['20 ÷ 100 × 100 = 20', '! Sampled = 20%'] },
], 'Percentage'), slips(20, [[100, 'That’s how many squares there are. 20 of them are sampled.'], [200, 'There are 10 × 10 = 100 squares, not 20 ÷ 10.'], [0.2, 'That’s a decimal. Times by 100.']]), { label: 'Percentage (%)', prefix: 'Sampled =' })

/* ---------- Rung 3: what's wrong with it? ---------- */

{
  const q = 'How many hours do you spend watching TV?', opts = ['1–5 hours', '5–10 hours', '10–20 hours']
  const p = form(q, opts)
  worked(faults, 'Phillipa asks the 30 students in her class this question. What’s wrong with it?', 'What’s wrong with it?', 'P9 p186 Example (book’s question)', boardModel([], [
    { title: 'No time frame', say: 'Hours a day? A week? A month? People will answer different questions.', rows: ['>0 No time: per day, week or month?'], picture: form(q, opts) },
    { title: 'Gaps at the ends', say: 'There’s no box for 0 hours, or for more than 20.', rows: ['>0 No box for 0 or over 20'], picture: form(q, opts, [0, 2]) },
    { title: 'Overlapping boxes', say: 'Someone who watches 5 hours could tick two boxes; so could 10.', rows: ['>0 5 and 10 are in two boxes'], picture: form(q, opts, [0, 1, 2]) },
    { title: 'Clarity and bias', say: 'Does streaming online count? And asking only her class is a biased sample.', rows: ['>0 Streaming? Only one class', '! Unclear, gaps, overlaps, biased'], picture: form(q, opts, [0, 1, 2], 'x', 'Five faults') },
  ], 'Faults', p), 'A good question gives a time frame, has a box for every answer with no gaps and no overlaps, and is clear. It shouldn’t be leading (“How amazing was the film?”) or too personal (“Do you have a criminal record?”), and the sample shouldn’t be biased.')
}
{
  const q = 'Do you agree the new government will be a disaster?', opts = ['Yes', 'No']
  const p = form(q, opts)
  practice(faults, 'What’s wrong with Tilly’s question?', 'P9 Your Turn Q1 (book’s question)', p, choose('It’s leading, and there are only two options',
    ['It has no time frame', 'It isn’t about how often or how much, so it doesn’t need one.'], ['The boxes overlap', 'Yes and No can’t overlap.'], ['It’s too personal', 'It asks for an opinion, not something private.']),
  'Does the question push people towards an answer?', boardModel([], [
    { title: 'Leading', say: '“Do you agree … will be a disaster?” pushes people to say yes.', rows: ['>0 Leading: pushes towards yes'], picture: form(q, opts) },
    { title: 'Only two options', say: 'People can’t say “not sure” or “it’ll be fine”.', rows: ['>0 Only Yes or No', '! Leading, only two options'], picture: form(q, opts, [0, 1], 'x') },
  ], 'Faults', p))
}
{
  const q = 'How much do you spend on food every week?', opts = ['£0–£30', '£30–£60', '£60–£90', '£90–£120']
  const p = form(q, opts)
  practice(faults, 'What’s wrong with the boxes in Saru’s question?', 'P9 Your Turn Q2 (book’s question)', p, choose('They overlap, and there’s no box over £120',
    ['There’s no time frame', 'It says “every week”, so the time frame is given.'], ['There’s no box for £0', 'The first box starts at £0.'], ['It’s a leading question', 'It doesn’t push people towards an answer.']),
  'Look at where each box starts and ends.', boardModel([], [
    { title: 'Overlapping boxes', say: '£30 is in two boxes, and so are £60 and £90.', rows: ['>0 £30, £60, £90 in two boxes'], picture: form(q, opts, [0, 1, 2, 3]) },
    { title: 'Gap at the top', say: 'Someone who spends £150 has no box to tick.', rows: ['>0 Nothing over £120', '! Overlaps, nothing over £120'], picture: form(q, opts, [3], 'x') },
  ], 'Faults', p))
}
{
  const q = 'How many steps have you done today?', opts = ['0–5,000', '5,000–10,000', '10,000+']
  const p = form(q, opts)
  practice(faults, 'What’s wrong with Samantha’s question?', 'P9 Your Turn Q3 (book’s question)', p, choose('The boxes overlap, and one day may not be typical',
    ['There’s no box for 0', 'The first box starts at 0.'], ['There’s no box for lots of steps', '10,000+ covers any number over 10,000.'], ['It’s too personal', 'Steps walked aren’t private.']),
  'Check the boxes, and think about “today”.', boardModel([], [
    { title: 'Overlapping boxes', say: '5,000 and 10,000 are each in two boxes.', rows: ['>0 5,000 and 10,000 in two boxes'], picture: form(q, opts, [0, 1, 2]) },
    { title: 'Only today', say: 'One day might be unusual: a rainy day, or a sports day.', rows: ['>0 Today may not be typical', '! Overlaps; one day only'], picture: form(q, opts, [0, 1, 2], 'x') },
  ], 'Faults', p))
}
{
  const q = 'How much pocket money do you get?', opts = ['£1–£5', '£5–£10', '£10+']
  const p = form(q, opts)
  practice(faults, 'What’s wrong with Terry’s question?', 'P9 Your Turn Q4 (book’s question)', p, choose('No time frame, overlapping boxes, and no box for £0',
    ['Only the overlapping boxes', 'Look again: a week or a month? And what if you get nothing?'], ['Only that it’s leading', 'It isn’t leading. The problems are the time frame and the boxes.'], ['Nothing, it’s a good question', 'A week or a month? And £5 is in two boxes.']),
  'Look for a time frame, gaps and overlaps.', boardModel([], [
    { title: 'No time frame', say: 'Per week? Per month? It doesn’t say.', rows: ['>0 No time frame'], picture: form(q, opts) },
    { title: 'Check the boxes', say: '£5 and £10 are in two boxes, and someone who gets nothing has no box.', rows: ['>0 £5, £10 in two boxes; no £0', '! No time, overlaps, no £0'], picture: form(q, opts, [0, 1, 2], 'x') },
  ], 'Faults', p))
}

/* ---------- Rung 4: a better question ---------- */

{
  const q = 'To the nearest hour, how many hours do you spend watching TV per week, including online streaming?', opts = ['0–5 hours', '6–15 hours', '16+ hours']
  const p = form(q, opts)
  worked(better, 'Rewrite Phillipa’s TV question so it works.', 'A better question', 'P9 p186 Example (book’s question)', boardModel([], [
    { title: 'Add a time frame', say: '“Per week” means everyone answers the same question.', rows: ['>0 Per week'], picture: form(q, opts) },
    { title: 'Make it clear', say: '“To the nearest hour” and “including online streaming” settle what counts.', rows: ['>0 Nearest hour, streaming counts'], picture: form(q, opts) },
    { title: 'Fix the boxes', say: 'Start at 0, end with 16+, and no number in two boxes.', rows: ['>0 0–5, 6–15, 16+: no gaps, no overlaps', '! Time frame, clear, every answer once'], picture: form(q, opts, [0, 1, 2], 'found', 'A better question') },
  ], 'Better', p), 'To fix a question: give a time frame, make it clear what counts, and give boxes that cover every answer exactly once. Ask a random sample, not just people like you.')
}
{
  const q = 'How often do you go to the cinema?', opts = ['Never', 'Sometimes', 'All the time']
  const p = form(q, opts)
  practice(better, 'This cinema question is vague. Which is the best rewrite?', 'P9 Your Turn Q5 (book’s question)', p, choose('How many times did you go to the cinema last month? 0, 1–2, 3–4, 5 or more',
    ['How often do you go to the cinema? Rarely, Often', '“Rarely” and “often” mean different things to different people, and there’s no time frame.'], ['How many times did you go last month? 1–2, 2–4, 4+', '2 and 4 are in two boxes, and there’s no box for 0.'], ['Don’t you love going to the cinema? Yes, No', 'That’s leading, and it doesn’t ask how often.']),
  'Look for a time frame and boxes with numbers that don’t overlap.', boardModel([], [
    { title: 'What’s wrong now', say: '“Sometimes” means different things to different people, and there’s no time frame.', rows: ['>0 Vague words, no time frame'], picture: form(q, opts, [0, 1, 2], 'x') },
    { title: 'A better question', say: 'Use a time frame, last month, and number boxes with no gaps or overlaps.', rows: ['! Last month: 0, 1–2, 3–4, 5 or more'], picture: form(q, opts, [0, 1, 2], 'x') },
  ], 'Better', p))
}
{
  const q = 'How much pocket money do you get each week?', opts = ['£0–£4.99', '£5–£9.99', '£10 or more']
  const p = form(q, opts)
  practice(better, 'Terry adds “each week”. Which boxes are best now?', 'P9 Your Turn Q4 (book’s question)', p, choose('£0–£4.99, £5–£9.99, £10 or more',
    ['£1–£5, £5–£10, £10+', '£5 and £10 are in two boxes, and there’s no box for £0.'], ['£0–£5, £6–£10', '£5.50 has no box, and nothing over £10.'], ['A little, Some, A lot', 'Those words are vague. Use amounts.']),
  'Every amount should fit exactly one box.', boardModel([], [
    { title: 'Start at £0', say: 'Someone who gets nothing needs a box.', rows: ['>0 Starts at £0'], picture: form(q, opts, [0]) },
    { title: 'No gaps or overlaps', say: '£4.99 then £5: every amount in exactly one box, and £10 or more catches the rest.', rows: ['! £0–£4.99, £5–£9.99, £10 or more'], picture: form(q, opts, [0, 1, 2], 'found', 'Every amount fits once') },
  ], 'Better', p))
}
{
  const q = 'How amazing was the last Star Wars film?', opts = ['Good', 'Very good', 'Amazing']
  const p = form(q, opts)
  practice(better, 'This question is leading. Which is the best rewrite?', 'P9 p186 Leading questions (book’s question)', p, choose('How would you rate the last Star Wars film? Poor, OK, Good, Very good',
    ['How great was the last Star Wars film?', 'That still tells people it was great: still leading.'], ['Do you agree the last Star Wars film was amazing? Yes, No', 'Still leading, and only two options.'], ['Did you see a film? Yes, No', 'That doesn’t ask what they thought of it.']),
  'A fair question doesn’t tell people what to think.', boardModel([], [
    { title: 'What’s wrong now', say: '“How amazing” tells people it was amazing, and every box is good.', rows: ['>0 Leading; no bad options'], picture: form(q, opts, [0, 1, 2], 'x') },
    { title: 'A fair question', say: 'Ask for a rating, with boxes from poor to very good.', rows: ['! Rate it: Poor, OK, Good, Very good'], picture: form(q, opts, [0, 1, 2], 'x') },
  ], 'Better', p))
}

add('mixed', 'Sampling and questionnaires', 'P9 consolidation', text(
  'A sample is quicker and cheaper than asking everyone, but less reliable.',
  'A random sample is the best way to avoid bias.',
  'Give a time frame, make it clear, and give boxes with no gaps and no overlaps.',
  'Don’t ask leading or personal questions.',
))

export const tutorSamplingLesson: TutorMethodLesson = {
  id: 'L309', number: 309, title: 'Sampling and questionnaires', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Choose a fair sample, spot what’s wrong with a questionnaire question, and write a better one.',
  labels: { [samples]: 'Samples', [bias]: 'Bias and random samples', [faults]: 'What’s wrong with it?', [better]: 'A better question', mixed: 'Review' },
  states: finish(),
}
