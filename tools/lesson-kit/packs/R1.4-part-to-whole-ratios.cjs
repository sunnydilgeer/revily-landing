// R1.4 Part to whole ratios: the video and worksheet for the fourth rung of the Ratios lesson (lesson 37). From Skill 4
// on p91 of Sunny's book; made in Aniksha's style. Every number is our own: the book's oranges are 2 : 7, ours 3 : 8.
module.exports = ({ line, big, result, answer, picture }) => {
  const { bars } = require('../lib/bars.cjs')

  return {
    code: 'R1.4', topic: 'Part to whole ratios', strand: 'Ratio', file: 'R1.4_Part_To_Whole_Ratios',

    checks: {
      'oranges : fruit 3 : 8 leaves 5 apples, so 3 : 5': 8 - 3 === 5,
      'Q2 boys : class 4 : 9, girls are 5/9': 9 - 4 === 5,
      'Q3 red : all 2 : 7 gives red : other 2 : 5': 7 - 2 === 5,
      'Q4 2/5 blue gives blue : red 2 : 3': 5 - 2 === 3,
      'Q5 sour : all 3 : 8 in 40 gives 15 sour and 25 others': 40 / 8 * 3 === 15 && 40 - 15 === 25,
    },

    video: {
      slides: [
        { hero: 'A bag of fruit', sub: 'The ratio of oranges to all the fruit is 3 : 8. The rest are apples.', items: [
          [big('\\text{oranges} : \\text{fruit} = 3 : 8'), 3],
          [line('the **8** is the whole bag, and it **includes** the 3 oranges'), 3.4]] },
        { stage: 'Part a · a fraction of the whole', title: 'What fraction are oranges?', from: '$3 : 8$', items: [
          [line('part over whole'), 2.4],
          [answer('$\\tfrac{3}{8}$ of the fruit are oranges'), 3.4]] },
        { stage: 'Part b · part to part', title: 'How many are apples?', from: '$3$ oranges in every $8$', items: [
          [line('the apples are what’s left of the 8'), 2.8],
          [result('8 - 3 = 5'), 2.8],
          [picture(bars([['Oranges', 3], ['Apples', 5]], { brace: '3 + 5 = 8 pieces of fruit' })), 3.4]] },
        { stage: 'Part b · part to part', title: 'Oranges to apples', from: '$3$ oranges, $5$ apples', items: [
          [answer('$\\text{oranges} : \\text{apples} = 3 : 5$'), 3.4],
          [line('a part : part ratio never includes the whole', 'grey'), 3]] },
        { title: 'Where you see it', items: [
          [line('in a bag of $40$ sweets, sour sweets : all sweets $= 3 : 8$'), 3.2],
          [line('$40 \\div 8 = 5$, so $3 \\times 5 = 15$ sour sweets and $40 - 15 = 25$ others'), 3.8]] },
      ],
      recap: ['Part : whole includes the part', 'Whole take away part gives the other part', 'Part over whole is the fraction'],
    },

    worksheet: {
      title: 'Ratios: Part to Whole',
      questions: [
        { n: '1', level: 'worked', marks: 2, question: 'The ratio of oranges to all the fruit in a bag is $3 : 8$. The rest are apples. Write the ratio of oranges to apples.', working: [
          { say: 'The apples are the rest of the 8' }, { math: '8 - 3 = 5' }, { mark: '5 apples in every 8' }, { answer: '$3 : 5$' }] },
        { n: '2', level: 'easy', marks: 1, question: 'The ratio of boys to the whole class is $4 : 9$. What fraction of the class are girls?', working: [
          { math: '9 - 4 = 5' }, { answer: '$\\tfrac{5}{9}$' }] },
        { n: '3', level: 'medium', marks: 1, question: 'The ratio of red sweets to all the sweets in a jar is $2 : 7$. Write the ratio of red sweets to other sweets.', working: [
          { math: '7 - 2 = 5' }, { answer: '$2 : 5$' }] },
        { n: '4', level: 'hard', marks: 2, question: '$\\tfrac{2}{5}$ of the counters in a bag are blue. The rest are red. Write the ratio of blue to red counters.', working: [
          { say: '2 out of every 5 are blue, so 3 are red' }, { math: '5 - 2 = 3' }, { mark: '3 red in every 5' }, { answer: '$2 : 3$' }] },
        { n: '5', level: 'very hard', marks: 3, question: ['A bag has $40$ sweets. The ratio of sour sweets to all the sweets is $3 : 8$.', 'How many sweets are not sour?'], working: [
          { math: '40 \\div 8 = 5' }, { mark: '$40 \\div 8$' }, { math: '3 \\times 5 = 15' }, { mark: '15 sour sweets' }, { math: '40 - 15 = 25' }, { answer: '25 sweets' }] },
      ],
    },
  }
}
