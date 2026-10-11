// R6.5 Speed units: the video and worksheet for the fifth rung of Converting units (lesson 38). From the speed example in
// R6 (p104) of Sunny's book (km/h to m/s, one unit at a time). Our own numbers: 72 km/h, not the book's 50.
module.exports = ({ line, big, result, answer, row }) => ({
  code: 'R6.5', topic: 'Speed units', strand: 'Ratio', file: 'R6.5_Speed_Units',

  checks: {
    '72 km/h = 72 000 m an hour, ÷ 3600 = 20 m/s': 72 * 1000 / 3600 === 20,
    '15 m/s × 3600 = 54 000 m an hour = 54 km/h': 15 * 3600 / 1000 === 54,
    'Q2 36 km/h = 10 m/s': 36 * 1000 / 3600 === 10,
    'Q3 25 m/s = 90 km/h': 25 * 3600 / 1000 === 90,
    'Q4 80 km/h ÷ 1.6 = 50 mph': 80 / 1.6 === 50,
    'Q5 108 km/h = 30 m/s, faster than 28 m/s': 108 * 1000 / 3600 === 30,
  },

  video: {
    slides: [
      { hero: 'Speed units', sub: 'A car drives at 72 km/h. What is that in metres per second?', items: [
        [big('72\\text{ km/h} = \\ ?\\text{ m/s}'), 2.8],
        [line('km/h means kilometres **per** hour: two units, so change them one at a time'), 3.4]] },
      { stage: 'Step 1 · change the distance', title: 'km to m', from: '$72$ km in $1$ hour', items: [
        [result('72 \\times 1000 = 72\\,000'), 2.8],
        [line('$72\\,000$ metres in $1$ hour'), 2.6]] },
      { stage: 'Step 2 · change the time', title: 'An hour in seconds', items: [
        [result('1\\text{ hour} = 60 \\times 60 = 3600\\text{ s}'), 3]] },
      { stage: 'Step 3 · divide distance by time', title: 'Metres each second', items: [
        [result('72\\,000 \\div 3600 = 20'), 2.8],
        [answer('$20$ m/s'), 2.4]] },
      { title: 'The other way', from: '$15$ m/s in km/h', items: [
        [row('$15 \\times 3600 = 54\\,000$ m an hour', '$54\\,000 \\div 1000 = 54$'), 3.6],
        [answer('$54$ km/h'), 2.4]] },
    ],
    recap: ['Change the distance unit', 'Change the time unit', 'Divide distance by time'],
  },

  worksheet: {
    title: 'Converting units: Speed units',
    questions: [
      { n: '1', level: 'worked', marks: 2, question: 'A car drives at $72$ km/h. What is that in metres per second?', working: [
        { math: '72 \\times 1000 = 72\\,000' }, { mark: 'Distance in metres' }, { math: '72\\,000 \\div 3600 = 20' }, { answer: '20 m/s' }] },
      { n: '2', level: 'easy', marks: 2, question: 'A cyclist rides at $36$ km/h. What is that in m/s?', working: [
        { math: '36 \\times 1000 = 36\\,000' }, { mark: 'Distance in metres' }, { math: '36\\,000 \\div 3600 = 10' }, { answer: '10 m/s' }] },
      { n: '3', level: 'medium', marks: 2, question: 'A train travels at $25$ m/s. What is that in km/h?', working: [
        { math: '25 \\times 3600 = 90\\,000' }, { mark: 'Metres in an hour' }, { math: '90\\,000 \\div 1000 = 90' }, { answer: '90 km/h' }] },
      { n: '4', level: 'hard', marks: 1, question: 'A road sign says $80$ km/h. Use $1$ mile $\\approx 1.6$ km. What is that in miles per hour?', working: [
        { math: '80 \\div 1.6 = 50' }, { answer: '50 mph' }] },
      { n: '5', level: 'very hard', marks: 3, question: 'A cheetah runs at $108$ km/h. A greyhound runs at $28$ m/s. Which is faster?', working: [
        { math: '108\\,000 \\div 3600 = 30' }, { mark: 'Same units' }, { say: '30 m/s is more than 28 m/s' }, { mark: 'Comparing' }, { answer: 'The cheetah' }] },
    ],
  },
})
