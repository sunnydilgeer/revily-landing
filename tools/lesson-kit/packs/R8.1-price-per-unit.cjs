// R8.1 Price per unit: the video and worksheet for the first rung of Best buys (lesson 39). From the Best Buys Method in
// R8 (p108) of Sunny's book: find the cost of the same amount of each, then compare. Our own numbers.
module.exports = ({ line, big, result, answer, row }) => ({
  code: 'R8.1', topic: 'Price per unit', strand: 'Ratio', file: 'R8.1_Price_Per_Unit',

  checks: {
    'A 500 g £3.20 is 64p per 100 g': Math.round(320 / 5) === 64,
    'B 750 g £4.50 is 60p per 100 g': Math.round(450 / 7.5) === 60,
    'C 1.2 kg £7.44 is 62p per 100 g': Math.round(744 / 12) === 62,
    'Q2 8 pens £2.40 is 30p each, 5 pens £1.60 is 32p each': 240 / 8 === 30 && 160 / 5 === 32,
    'Q3 2 litres £1.80 is 90p a litre, 3 litres £2.85 is 95p': 180 / 2 === 90 && 285 / 3 === 95,
    'Q4 250 g £1.75 is 70p per 100 g, 400 g £2.60 is 65p': 175 / 2.5 === 70 && 260 / 4 === 65,
    'Q5 1.5 kg £4.20 is 28p per 100 g, 600 g £1.74 is 29p, 2 kg £5.80 is 29p': Math.round(420 / 15) === 28 && Math.round(174 / 6) === 29 && Math.round(580 / 20) === 29,
  },

  video: {
    slides: [
      { hero: 'Best buys', sub: 'Which box of cereal is the best value?', items: [
        [row('A: $500$ g for $£3.20$', 'B: $750$ g for $£4.50$', 'C: $1.2$ kg for $£7.44$'), 3.6]] },
      { stage: 'Step 1 · pick an amount', title: 'The cost of 100 g', items: [
        [line('the boxes are different sizes, so find the cost of the **same amount** of each'), 3.4],
        [line('$100$ g divides into all three: $1.2$ kg $= 1200$ g', 'grey'), 3]] },
      { stage: 'Step 2 · divide', title: 'Price ÷ number of 100 g', items: [
        [row('A: $320 \\div 5 = 64$p', 'B: $450 \\div 7.5 = 60$p', 'C: $744 \\div 12 = 62$p'), 4]] },
      { stage: 'Step 3 · compare', title: 'Cheapest per 100 g', items: [
        [result('60\\text{p} < 62\\text{p} < 64\\text{p}'), 2.8],
        [answer('B is the best value'), 2.6]] },
      { title: 'Watch out', items: [
        [line('the cheapest **box** is not always the best **buy**: A costs least but gives least'), 3.4],
        [line('work in pence to keep the numbers whole', 'grey'), 2.6]] },
    ],
    recap: ['Find the cost of the same amount of each', 'Same units first: kg to g', 'Lowest cost per unit is the best buy'],
  },

  worksheet: {
    title: 'Best buys: Price per unit',
    questions: [
      { n: '1', level: 'worked', marks: 3, question: ['Cereal comes in three sizes: A $500$ g for $£3.20$, B $750$ g for $£4.50$, C $1.2$ kg for $£7.44$.', 'Which is the best value?'], working: [
        { math: '320 \\div 5 = 64,\\ 450 \\div 7.5 = 60' }, { mark: 'Cost per 100 g for two' }, { math: '744 \\div 12 = 62' }, { mark: 'All three compared' }, { answer: 'B' }] },
      { n: '2', level: 'easy', marks: 2, question: 'A pack of $8$ pens costs $£2.40$. A pack of $5$ pens costs $£1.60$. Which pack is better value?', working: [
        { math: '240 \\div 8 = 30,\\ 160 \\div 5 = 32' }, { mark: 'Cost of 1 pen in each' }, { answer: 'The pack of 8' }] },
      { n: '3', level: 'medium', marks: 2, question: 'A $2$ litre bottle of juice costs $£1.80$. A $3$ litre bottle costs $£2.85$. Which is better value?', working: [
        { math: '180 \\div 2 = 90,\\ 285 \\div 3 = 95' }, { mark: 'Cost of 1 litre' }, { answer: 'The 2 litre bottle' }] },
      { n: '4', level: 'hard', marks: 2, question: 'A $250$ g jar of coffee costs $£1.75$. A $400$ g jar costs $£2.60$. Which is better value?', working: [
        { math: '175 \\div 2.5 = 70,\\ 260 \\div 4 = 65' }, { mark: 'Cost of 100 g' }, { answer: 'The 400 g jar' }] },
      { n: '5', level: 'very hard', marks: 3, question: ['Rice comes in $1.5$ kg for $£4.20$, $600$ g for $£1.74$ and $2$ kg for $£5.80$.', 'Which is the best value?'], working: [
        { math: '420 \\div 15 = 28' }, { mark: 'Same units: 1.5 kg = 1500 g' }, { math: '174 \\div 6 = 29,\\ 580 \\div 20 = 29' }, { mark: 'All three per 100 g' }, { answer: 'The 1.5 kg bag' }] },
    ],
  },
})
