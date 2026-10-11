// R1.5 Dividing amounts into ratios: the video and worksheet for the fifth rung of the Ratios lesson (lesson 37). From
// Skill 5 on p91 of Sunny's book; made in Aniksha's style. Every number is our own: the book shares £6000 in
// 3 : 4 : 5, ours shares £720 in 2 : 3 : 4.
module.exports = ({ line, big, result, answer, row, picture }) => {
  const { bars } = require('../lib/bars.cjs')
  const people = [['Ana', 2], ['Ben', 3], ['Cal', 4]]

  return {
    code: 'R1.5', topic: 'Dividing amounts into ratios', strand: 'Ratio', file: 'R1.5_Dividing_Amounts_Into_Ratios',

    checks: {
      '£720 in 2 : 3 : 4 is 9 parts of £80: 160, 240, 320': 720 / 9 === 80 && 160 + 240 + 320 === 720,
      'Q2 42 in 2 : 5 is 12 and 30': 42 / 7 * 2 === 12 && 42 / 7 * 5 === 30,
      'Q3 £96 in 5 : 3 is £60 and £36': 96 / 8 * 5 === 60 && 96 / 8 * 3 === 36,
      'Q4 40 tiles 3 : 2 is 24 blue and 16 white, costing £88.80': 40 / 5 * 3 === 24 && Math.round(24 * 250 + 16 * 180) === 8880,
      'Q5 80% of £250 is £200, games 5 of 8 parts is £125': 250 * 0.8 === 200 && 200 / 8 * 5 === 125,
    },

    video: {
      slides: [
        { hero: 'Sharing £720', sub: 'Ana, Ben and Cal share £720 in the ratio 2 : 3 : 4. How much does Ana get?', items: [
          [big('2 : 3 : 4'), 2.6], [picture(bars(people)), 3.2]] },
        { stage: 'Step 1 · total parts', title: 'Add the parts', from: '$2 : 3 : 4$', items: [
          [result('2 + 3 + 4 = 9'), 2.8],
          [picture(bars(people, { brace: '9 parts = £720' })), 3.2]] },
        { stage: 'Step 2 · find 1 part', title: 'Share the money between the parts', from: '$9$ parts $= £720$', items: [
          [result('720 \\div 9 = 80'), 2.8],
          [picture(bars(people, { each: '80', brace: '1 part = £80' })), 3.4]] },
        { stage: 'Step 3 · Ana’s share', title: 'Ana has 2 parts', from: '$1$ part $= £80$', items: [
          [picture(bars(people, { each: '80', rings: [{ bar: 0, from: 0, to: 2 }], tags: ['£160'] })), 3.2],
          [line('$2 \\times 80 = 160$'), 2.4],
          [answer('Ana gets £160'), 3.2]] },
        { title: 'Check it', items: [
          [row('Ben: $3 \\times 80 = 240$', 'Cal: $4 \\times 80 = 320$'), 3.4],
          [line('$160 + 240 + 320 = 720$ ✓ the shares add back to the total'), 3.4]] },
      ],
      recap: ['Add the parts', 'Divide the amount by the total parts', 'Multiply 1 part by each share'],
    },

    worksheet: {
      title: 'Ratios: Dividing Amounts',
      questions: [
        { n: '1', level: 'worked', marks: 2, question: 'Ana, Ben and Cal share £720 in the ratio $2 : 3 : 4$. How much does Ana get?', working: [
          { math: '2 + 3 + 4 = 9' }, { math: '720 \\div 9 = 80' }, { mark: '1 part is £80' }, { math: '2 \\times 80 = 160' }, { answer: '£160' }] },
        { n: '2', level: 'easy', marks: 2, question: 'Divide $42$ in the ratio $2 : 5$.', working: [
          { math: '2 + 5 = 7,\\ 42 \\div 7 = 6' }, { mark: '1 part is 6' }, { answer: '12 and 30' }] },
        { n: '3', level: 'medium', marks: 2, question: 'Kim and Lee share £96 in the ratio $5 : 3$. How much does each get?', working: [
          { math: '5 + 3 = 8,\\ 96 \\div 8 = 12' }, { mark: '1 part is £12' }, { answer: 'Kim £60, Lee £36' }] },
        { n: '4', level: 'hard', marks: 3, question: ['Lucy buys $40$ tiles. Blue and white tiles are in the ratio $3 : 2$.', 'Blue tiles cost £2.50 each and white tiles cost £1.80 each. How much does she spend?'], working: [
          { math: '40 \\div 5 = 8' }, { math: '3 \\times 8 = 24 \\text{ blue},\\ 2 \\times 8 = 16 \\text{ white}' }, { mark: '24 blue and 16 white' },
          { math: '24 \\times 2.50 = 60,\\ 16 \\times 1.80 = 28.80' }, { mark: 'Cost of each colour' }, { answer: '£88.80' }] },
        { n: '5', level: 'very hard', marks: 3, question: ['Mia gets £250. She saves 20% and spends the rest on games, clothes and food in the ratio $5 : 2 : 1$.', 'How much does she spend on games?'], working: [
          { math: '250 \\times 0.8 = 200' }, { mark: '£200 to share' }, { math: '200 \\div 8 = 25' }, { mark: '1 part is £25' }, { math: '5 \\times 25 = 125' }, { answer: '£125' }] },
      ],
    },
  }
}
