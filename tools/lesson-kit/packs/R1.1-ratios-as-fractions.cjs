// R1.1 Writing ratios as fractions: the video and worksheet for the first rung of the Ratios lesson (lesson 37). From
// Skill 1 on p91 of Sunny's book (R1 Ratios); Aniksha's R1.1 files don't exist, so this is made in her style. Every
// number is our own: the book's counters are 3 : 2, ours are 4 : 5.
module.exports = ({ line, big, result, answer, row, picture }) => {
  const { bars } = require('../lib/bars.cjs')
  const counters = (o = {}) => picture(bars([['Red', 4], ['Blue', 5]], o))
  const eq = (a, b) => Math.abs(a - b) < 1e-9

  return {
    code: 'R1.1', topic: 'Writing ratios as fractions', strand: 'Ratio', file: 'R1.1_Writing_Ratios_As_Fractions',

    checks: {
      'red : blue 4 : 5 is 9 parts': 4 + 5 === 9,
      'red is 4/5 of blue: 20 blue gives 16 red': eq(20 * 4 / 5, 16),
      'Q2 cats 2 : 7 dogs, cats are 2/9': 2 / (2 + 7) === 2 / 9,
      'Q3 girls are 3/5 of boys in 5 : 3': eq(3 / 5, 0.6),
      'Q4 water is 4/5 of the drink in 1 : 4': 4 / (1 + 4) === 0.8,
      'Q5 brown 3 : 5 blonde, 3/8 of 320 is 120': 320 / 8 * 3 === 120 && 320 / 8 * 5 === 200,
    },

    video: {
      slides: [
        { hero: 'Red and blue counters', sub: 'A bag has red and blue counters in the ratio 4 : 5. What fraction are red?', items: [
          [big('\\text{red} : \\text{blue} = 4 : 5'), 2.8], [counters(), 3.2],
          [line('for every **4** red counters there are **5** blue ones'), 3.2]] },
        { stage: 'Way 1 · compare the two', title: 'Red compared with blue', from: '$4 : 5$', items: [
          [line('put the red number over the blue number'), 2.8],
          [result('\\tfrac{4}{5}'), 2.8],
          [line('there are $\\tfrac{4}{5}$ as many red counters as blue counters'), 3.4],
          [line('the other way round: $\\tfrac{5}{4}$ as many blue as red', 'grey'), 3.2]] },
        { stage: 'Way 2 · part of the whole', title: 'Find the total parts', from: '$4 : 5$', items: [
          [counters({ brace: '4 + 5 = 9 parts' }), 3.2],
          [line('add the parts: $4 + 5 = 9$'), 2.8]] },
        { stage: 'Way 2 · part of the whole', title: 'Red out of all of them', from: '$9$ parts in total', items: [
          [counters({ rings: [{ bar: 0, from: 0, to: 4 }], brace: '9 parts' }), 3.2],
          [line('red is $4$ of the $9$ parts'), 2.8],
          [answer('$\\tfrac{4}{9}$ of the counters are red'), 3.4]] },
        { title: 'Which fraction?', items: [
          [row('red compared with blue: $\\tfrac{4}{5}$', 'red out of all: $\\tfrac{4}{9}$'), 3.6],
          [line('"as many as" compares the two parts. "of the bag" or "of all" uses the total'), 3.6]] },
        { title: 'Where you see it', items: [
          [line('a bag has $20$ blue counters, in the ratio red : blue $= 4 : 5$'), 3.2],
          [line('red is $\\tfrac{4}{5}$ of blue: $\\tfrac{4}{5} \\times 20 = 16$ red counters'), 3.6]] },
      ],
      recap: ['Part over part compares the two', 'Add the parts for the total', 'Part over total is the fraction of the whole'],
    },

    worksheet: {
      title: 'Ratios: Writing Ratios as Fractions',
      questions: [
        { n: '1', level: 'worked', marks: 1, question: 'Red and blue counters are in a bag in the ratio $4 : 5$. What fraction of the counters are red?', working: [
          { say: 'Add the parts to find the total' }, { math: '4 + 5 = 9' }, { say: 'Red is 4 of the 9 parts' }, { answer: '$\\tfrac{4}{9}$' }] },
        { n: '2', level: 'easy', marks: 1, question: 'At an animal shelter the ratio of cats to dogs is $2 : 7$. What fraction of the animals are cats?', working: [
          { math: '2 + 7 = 9' }, { answer: '$\\tfrac{2}{9}$' }] },
        { n: '3', level: 'medium', marks: 1, question: 'In a choir the ratio of boys to girls is $5 : 3$. Complete: there are ☐ as many girls as boys.', working: [
          { say: 'Girls over boys compares the two' }, { answer: '$\\tfrac{3}{5}$' }] },
        { n: '4', level: 'hard', marks: 1, question: 'A drink is made from juice and water in the ratio $1 : 4$. What fraction of the drink is water?', working: [
          { math: '1 + 4 = 5' }, { answer: '$\\tfrac{4}{5}$' }] },
        { n: '5a', level: 'very hard', marks: 1, question: 'In a school the ratio of students with brown hair to students with blonde hair is $3 : 5$. What fraction have brown hair?', working: [
          { math: '3 + 5 = 8' }, { answer: '$\\tfrac{3}{8}$' }] },
        { n: '5b', level: 'very hard', marks: 2, question: 'There are $320$ students. How many have brown hair?', working: [
          { say: 'Find $\\tfrac{3}{8}$ of 320' }, { math: '320 \\div 8 = 40' }, { mark: '$320 \\div 8$' }, { math: '40 \\times 3 = 120' }, { answer: '120 students' }] },
      ],
    },
  }
}
