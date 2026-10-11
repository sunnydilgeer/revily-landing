// R6.4 Time: the video and worksheet for the fourth rung of Converting units (lesson 38). From "Converting Units - Time
// and Speed" in R6 (p104) of Sunny's book: time is in 60s, not 10s. Our own numbers.
module.exports = ({ line, big, result, answer, row }) => ({
  code: 'R6.4', topic: 'Time', strand: 'Ratio', file: 'R6.4_Time',

  checks: {
    '2.4 hours: 0.4 × 60 = 24 minutes': Math.round(0.4 * 60) === 24,
    '2 h 15 min = 2.25 hours': 2 + 15 / 60 === 2.25,
    'Q2 3 days = 72 hours': 3 * 24 === 72,
    'Q3 3.75 hours = 225 minutes': 3.75 * 60 === 225,
    'Q4 150 minutes = 2.5 hours': 150 / 60 === 2.5,
    'Q5 4 h 12 min = 4.2 hours': Math.abs(4 + 12 / 60 - 4.2) < 1e-9,
  },

  video: {
    slides: [
      { hero: 'Converting time', sub: 'A film lasts 2.4 hours. How long is that in hours and minutes?', items: [
        [big('2.4\\text{ hours} = \\ ?\\text{ h } ?\\text{ min}'), 3]] },
      { stage: 'The facts to learn', title: 'Time is in 60s', items: [
        [row('$1$ min $= 60$ s', '$1$ hour $= 60$ min', '$1$ day $= 24$ hours'), 3.4],
        [line('so $2.4$ hours is **not** $2$ h $40$ min', 'grey'), 3]] },
      { stage: 'Step 1 · keep the whole hours', title: '2 hours', from: '$2.4$ hours', items: [
        [line('$2.4$ hours is $2$ hours and $0.4$ of an hour'), 3]] },
      { stage: 'Step 2 · the decimal part × 60', title: '0.4 of an hour', items: [
        [result('0.4 \\times 60 = 24'), 2.6],
        [answer('$2$ hours $24$ minutes'), 2.8]] },
      { title: 'The other way', from: '$2$ h $15$ min in hours', items: [
        [result('15 \\div 60 = 0.25'), 2.8],
        [answer('$2.25$ hours'), 2.4],
        [line('$15$ minutes is a quarter of an hour ✓', 'grey'), 2.8]] },
    ],
    recap: ['Time is in 60s, not 10s', 'Decimal of an hour × 60 gives minutes', 'Minutes ÷ 60 gives a decimal of an hour'],
  },

  worksheet: {
    title: 'Converting units: Time',
    questions: [
      { n: '1', level: 'worked', marks: 1, question: 'A film lasts $2.4$ hours. How long is that in hours and minutes?', working: [
        { say: 'Keep the 2 hours, then change 0.4 of an hour' }, { math: '0.4 \\times 60 = 24' }, { answer: '2 h 24 min' }] },
      { n: '2', level: 'easy', marks: 1, question: 'A holiday lasts $3$ days. How many hours is that?', working: [
        { math: '3 \\times 24 = 72' }, { answer: '72 hours' }] },
      { n: '3', level: 'medium', marks: 1, question: 'A drive takes $3.75$ hours. How many minutes is that?', working: [
        { math: '3.75 \\times 60 = 225' }, { answer: '225 minutes' }] },
      { n: '4', level: 'hard', marks: 1, question: 'A match lasts $150$ minutes. Write this in hours as a decimal.', working: [
        { math: '150 \\div 60 = 2.5' }, { answer: '2.5 hours' }] },
      { n: '5', level: 'very hard', marks: 2, question: 'A walk takes $4$ hours $12$ minutes. Write this in hours as a decimal.', working: [
        { math: '12 \\div 60 = 0.2' }, { mark: 'Minutes ÷ 60' }, { answer: '4.2 hours' }] },
    ],
  },
})
