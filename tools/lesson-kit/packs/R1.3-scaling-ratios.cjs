// R1.3 Scaling ratios: the video and worksheet for the third rung of the Ratios lesson (lesson 37). From Skill 3 on p91
// of Sunny's book; made in Aniksha's style. Every number is our own: the book's meringue is 3 : 7, our squash is 2 : 7.
module.exports = ({ line, big, result, answer, row, picture }) => {
  const { bars } = require('../lib/bars.cjs')

  return {
    code: 'R1.3', topic: 'Scaling ratios', strand: 'Ratio', file: 'R1.3_Scaling_Ratios',

    checks: {
      'squash 2 : 7, 10 cups of squash is × 5, so 35 water': 10 / 2 === 5 && 7 * 5 === 35,
      'Q2 3 : 4 with 9 is × 3, so 12': 9 / 3 * 4 === 12,
      'Q3 flour 5 : 2 butter, 300 g flour gives 120 g butter': 300 / 5 * 2 === 120,
      'Q4 red 3 : 8 white, 40 l white gives 15 l red': 40 / 8 * 3 === 15,
      'Q5 1 : 2 : 4 with 18 kg sand gives 9 kg cement, 36 kg gravel, 63 kg': 18 / 2 === 9 && 9 * 4 === 36 && 9 + 18 + 36 === 63,
    },

    video: {
      slides: [
        { hero: 'Making squash', sub: 'Squash and water are mixed in the ratio 2 : 7. How much water goes with 10 cups of squash?', items: [
          [big('\\text{squash} : \\text{water} = 2 : 7'), 2.8],
          [picture(bars([['Squash', 2], ['Water', 7]])), 3.2]] },
        { stage: 'Step 1 · find the multiplier', title: 'From 2 to 10', from: '$2 : 7$', items: [
          [line('the squash goes from $2$ cups to $10$ cups'), 2.8],
          [result('10 \\div 2 = 5'), 2.8],
          [line('so the whole recipe is **5 times** as big'), 3]] },
        { stage: 'Step 2 · multiply both parts', title: 'Times 5', from: 'multiplier $5$', items: [
          [row('$2 \\times 5 = 10$', '$7 \\times 5 = 35$'), 3.4],
          [result('10 : 35'), 2.6],
          [answer('$35$ cups of water'), 3.2]] },
        { title: 'Check it', from: '$10 : 35$', items: [
          [line('divide both by $5$ and you get back to $2 : 7$ ✓'), 3.2],
          [line('scaling multiplies **every** part by the same number: never add', 'grey'), 3.2]] },
        { title: 'Where you see it', items: [
          [line('a recipe uses flour and butter in the ratio $5 : 2$. With $300$ g of flour?'), 3.4],
          [row('$300 \\div 5 = 60$', '$2 \\times 60 = 120$ g of butter'), 3.6]] },
      ],
      recap: ['Find the multiplier from the part you know', 'Multiply every part by it', 'Check by dividing back'],
    },

    worksheet: {
      title: 'Ratios: Scaling',
      questions: [
        { n: '1', level: 'worked', marks: 2, question: 'Squash and water are mixed in the ratio $2 : 7$. How much water is needed with $10$ cups of squash?', working: [
          { say: 'The squash goes from 2 to 10' }, { math: '10 \\div 2 = 5' }, { mark: 'Finding the multiplier' }, { math: '7 \\times 5 = 35' }, { answer: '35 cups' }] },
        { n: '2', level: 'easy', marks: 1, question: 'Two numbers are in the ratio $3 : 4$. The first number is $9$. What is the second?', working: [
          { math: '9 \\div 3 = 3,\\ 4 \\times 3 = 12' }, { answer: '12' }] },
        { n: '3', level: 'medium', marks: 2, question: 'A recipe uses flour and butter in the ratio $5 : 2$. How much butter goes with $300$ g of flour?', working: [
          { math: '300 \\div 5 = 60' }, { mark: '$300 \\div 5$' }, { math: '2 \\times 60 = 120' }, { answer: '120 g' }] },
        { n: '4', level: 'hard', marks: 2, question: 'Red and white paint are mixed in the ratio $3 : 8$. Ali uses $40$ litres of white paint. How much red paint does he use?', working: [
          { math: '40 \\div 8 = 5' }, { mark: '$40 \\div 8$' }, { math: '3 \\times 5 = 15' }, { answer: '15 litres' }] },
        { n: '5', level: 'very hard', marks: 3, question: ['Concrete is made from cement, sand and gravel in the ratio $1 : 2 : 4$.', 'A builder uses $18$ kg of sand. What is the total mass of the concrete?'], working: [
          { math: '18 \\div 2 = 9' }, { mark: 'Finding 1 part: 9 kg' }, { math: '9 : 18 : 36' }, { mark: 'Scaling every part' }, { math: '9 + 18 + 36 = 63' }, { answer: '63 kg' }] },
      ],
    },
  }
}
