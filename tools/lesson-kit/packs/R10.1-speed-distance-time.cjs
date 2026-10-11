// R10.1 Speed, distance and time: the video and worksheet for the second rung of Compound measures (lesson 40). From R10
// (p112–113) of Sunny's book: the triangle, and changing minutes into hours. Our own numbers.
module.exports = ({ line, big, result, answer, row, picture }) => {
  const { triangle } = require('../lib/triangle.cjs')
  return {
    code: 'R10.1', topic: 'Speed, distance and time', strand: 'Ratio', file: 'R10.1_Speed_Distance_Time',

    checks: {
      '150 miles in 3 hours is 50 mph': 150 / 3 === 50,
      '40 mph for 2.5 hours is 100 miles': 40 * 2.5 === 100,
      '12 km at 48 km/h is 0.25 h = 15 min': 12 / 48 === 0.25 && 0.25 * 60 === 15,
      'Q2 240 km in 4 h is 60 km/h': 240 / 4 === 60,
      'Q3 8 m/s for 25 s is 200 m': 8 * 25 === 200,
      'Q4 30 miles at 40 mph is 45 minutes': 30 / 40 * 60 === 45,
      'Q5 60 mph for 45 min (45 miles) then 30 mph for 30 min (15 miles) is 60 miles': 60 * 0.75 + 30 * 0.5 === 60,
    },

    video: {
      slides: [
        { hero: 'Speed, distance and time', sub: 'A coach drives 150 miles in 3 hours. What is its average speed?', items: [
          [big('\\text{speed} = \\dfrac{\\text{distance}}{\\text{time}}'), 3]] },
        { stage: 'The triangle', title: 'D over S × T', items: [
          [picture(triangle(['D', 'S', 'T'])), 3.2],
          [line('cover what you want to find'), 2.6]] },
        { stage: 'Step 1 · cover S', title: 'Speed', items: [
          [picture(triangle(['D', 'S', 'T'], 'S')), 2.6],
          [result('S = 150 \\div 3 = 50'), 2.6],
          [answer('$50$ mph'), 2.2]] },
        { title: 'Find the distance', from: '$40$ mph for $2.5$ hours', items: [
          [picture(triangle(['D', 'S', 'T'], 'D')), 2.6],
          [result('D = 40 \\times 2.5 = 100\\text{ miles}'), 3]] },
        { title: 'Minutes', from: '$12$ km at $48$ km/h', items: [
          [result('T = 12 \\div 48 = 0.25\\text{ hours}'), 3],
          [row('$0.25 \\times 60 = 15$', '$15$ minutes'), 3],
          [line('a time in minutes with a speed per hour: change it to hours first', 'grey'), 3]] },
      ],
      recap: ['S = D ÷ T', 'D = S × T, T = D ÷ S', 'Keep the time units the same as the speed'],
    },

    worksheet: {
      title: 'Compound measures: Speed, distance and time',
      questions: [
        { n: '1', level: 'worked', marks: 2, question: 'A coach drives $150$ miles in $3$ hours. What is its average speed?', working: [
          { math: 'S = D \\div T' }, { mark: 'The formula' }, { math: '150 \\div 3 = 50' }, { answer: '50 mph' }] },
        { n: '2', level: 'easy', marks: 1, question: 'A train travels $240$ km in $4$ hours. Find its average speed.', working: [
          { math: '240 \\div 4 = 60' }, { answer: '60 km/h' }] },
        { n: '3', level: 'medium', marks: 1, question: 'A cyclist rides at $8$ m/s for $25$ seconds. How far does she go?', working: [
          { math: '8 \\times 25 = 200' }, { answer: '200 m' }] },
        { n: '4', level: 'hard', marks: 2, question: 'Ben drives $30$ miles at an average speed of $40$ mph. How many minutes does it take?', working: [
          { math: '30 \\div 40 = 0.75' }, { mark: 'Time in hours' }, { math: '0.75 \\times 60 = 45' }, { answer: '45 minutes' }] },
        { n: '5', level: 'very hard', marks: 3, question: ['A van drives at $60$ mph for $45$ minutes, then at $30$ mph for $30$ minutes.', 'How far does it travel in total?'], working: [
          { math: '60 \\times 0.75 = 45' }, { mark: 'First part' }, { math: '30 \\times 0.5 = 15' }, { mark: 'Second part' }, { answer: '60 miles' }] },
      ],
    },
  }
}
