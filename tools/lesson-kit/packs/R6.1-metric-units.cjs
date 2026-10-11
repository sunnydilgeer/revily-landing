// R6.1 Metric units: the video and worksheet for the first rung of Converting units (lesson 38). From "Converting Units -
// Metric and Money" in R6 (p103) of Sunny's book; made in Aniksha's style with our own numbers.
module.exports = ({ line, big, result, answer, row }) => ({
  code: 'R6.1', topic: 'Metric units', strand: 'Ratio', file: 'R6.1_Metric_Units',

  checks: {
    '3.5 kg = 3500 g': 3.5 * 1000 === 3500,
    '650 cm = 6.5 m': 650 / 100 === 6.5,
    'Q2 2.4 litres = 2400 ml': Math.round(2.4 * 1000) === 2400,
    'Q3 850 p = £8.50': 850 / 100 === 8.5,
    'Q4 0.3 tonnes = 300 kg': Math.round(0.3 * 1000) === 300,
    'Q5 1.2 km - 450 m = 750 m': 1.2 * 1000 - 450 === 750,
  },

  video: {
    slides: [
      { hero: 'Metric units', sub: 'A bag of flour is 3.5 kg. How many grams is that?', items: [
        [big('3.5\\text{ kg} = \\ ?\\text{ g}'), 2.8]] },
      { stage: 'The facts to learn', title: 'Metric conversions', items: [
        [row('$1$ km $= 1000$ m', '$1$ m $= 100$ cm', '$1$ cm $= 10$ mm'), 3.4],
        [row('$1$ kg $= 1000$ g', '$1$ tonne $= 1000$ kg', '$1$ litre $= 1000$ ml'), 3.4],
        [line('and money: $£1 = 100$p'), 2.4]] },
      { stage: 'Step 1 · find the scale factor', title: 'kg to g', from: '$3.5$ kg', items: [
        [line('$1$ kg $= 1000$ g, so the scale factor is $1000$'), 3],
        [line('a gram is **smaller**, so you need **more** of them: multiply'), 3.2]] },
      { stage: 'Step 2 · multiply', title: 'Times 1000', items: [
        [result('3.5 \\times 1000 = 3500'), 2.6],
        [answer('$3500$ g'), 2.6]] },
      { title: 'The other way', from: '$650$ cm in metres', items: [
        [line('a metre is **bigger**, so you need **fewer**: divide'), 3],
        [result('650 \\div 100 = 6.5'), 2.6],
        [answer('$6.5$ m'), 2.4]] },
      { title: 'Check it', items: [
        [line('small unit → big unit: divide. Big unit → small unit: multiply.'), 3.4],
        [line('does the answer make sense? $3.5$ kg is a lot of grams ✓', 'grey'), 3]] },
    ],
    recap: ['Learn the metric facts', 'To a smaller unit, multiply', 'To a bigger unit, divide'],
  },

  worksheet: {
    title: 'Converting units: Metric units',
    questions: [
      { n: '1', level: 'worked', marks: 1, question: 'A bag of flour is $3.5$ kg. How many grams is that?', working: [
        { say: '1 kg = 1000 g, and grams are smaller, so multiply' }, { math: '3.5 \\times 1000 = 3500' }, { answer: '3500 g' }] },
      { n: '2', level: 'easy', marks: 1, question: 'A bottle holds $2.4$ litres. How many millilitres is that?', working: [
        { math: '2.4 \\times 1000 = 2400' }, { answer: '2400 ml' }] },
      { n: '3', level: 'medium', marks: 1, question: 'Sam has $850$p in his money box. How much is that in pounds?', working: [
        { math: '850 \\div 100 = 8.5' }, { answer: '£8.50' }] },
      { n: '4', level: 'hard', marks: 1, question: 'A lorry carries $0.3$ tonnes of sand. How many kilograms is that?', working: [
        { math: '0.3 \\times 1000 = 300' }, { answer: '300 kg' }] },
      { n: '5', level: 'very hard', marks: 2, question: 'Ella\'s walk to school is $1.2$ km. She has walked $450$ m. How many metres does she have left?', working: [
        { math: '1.2 \\times 1000 = 1200' }, { mark: 'Same units first' }, { math: '1200 - 450 = 750' }, { answer: '750 m' }] },
    ],
  },
})
