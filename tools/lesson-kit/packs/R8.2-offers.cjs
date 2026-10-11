// R8.2 Offers: the video and worksheet for the second rung of Best buys (lesson 39). From the "buy one get the second
// half price" example in R8 (p108) of Sunny's book and its Q2 (% more free). Our own numbers.
module.exports = ({ line, big, result, answer, row }) => ({
  code: 'R8.2', topic: 'Offers', strand: 'Ratio', file: 'R8.2_Offers',

  checks: {
    'small 1 litre £1.20, second half price: 2 litres for £1.80': 120 + 60 === 180,
    'large 2 litres £1.70 is cheaper than £1.80': 1.7 < 1.8,
    'Q2 3 for 2 on £1.50 bars: 3 for £3, so £1 each': 1.5 * 2 / 3 === 1,
    'Q3 400 g £2 with 25% extra free is 500 g, 40p per 100 g; 450 g £1.89 is 42p': 400 * 1.25 === 500 && 200 / 5 === 40 && Math.round(189 / 4.5) === 42,
    'Q4 BOGOF on £2.40: 2 for £2.40 is £1.20 each; 2 for £2.20 deal is £1.10': 2.4 / 2 === 1.2 && 2.2 / 2 === 1.1,
    'Q5 6 cans: shop A £0.75 each 3 for 2 is £3.00; shop B 6 for £3.30 less 10% is £2.97': Math.round(0.75 * 4 * 100) === 300 && Math.round(3.3 * 0.9 * 100) === 297,
  },

  video: {
    slides: [
      { hero: 'Offers', sub: 'Juice: a 1 litre carton is £1.20, and the second carton is half price. A 2 litre carton is £1.70. Which is better for 2 litres?', items: [
        [big('\\text{offer or big carton?}'), 2.4]] },
      { stage: 'Step 1 · cost the offer', title: 'Two small cartons', items: [
        [row('first: $£1.20$', 'second, half price: $£0.60$'), 3.4],
        [result('1.20 + 0.60 = 1.80'), 2.6]] },
      { stage: 'Step 2 · same amount', title: '2 litres each way', items: [
        [row('two small: $£1.80$', 'one large: $£1.70$'), 3.2],
        [answer('the 2 litre carton'), 2.6]] },
      { title: 'Other offers', items: [
        [line('**3 for 2**: pay for 2, get 3'), 2.8],
        [line('**25% extra free**: $400$ g becomes $400 \\times 1.25 = 500$ g for the same price'), 3.4],
        [line('then compare the cost of the same amount, as before', 'grey'), 2.8]] },
    ],
    recap: ['Work out what the offer really costs', 'Compare the same amount each way', 'Extra free: increase the amount, not the price'],
  },

  worksheet: {
    title: 'Best buys: Offers',
    questions: [
      { n: '1', level: 'worked', marks: 2, question: 'A $1$ litre carton of juice costs $£1.20$, and the second carton is half price. A $2$ litre carton costs $£1.70$. Which is cheaper for $2$ litres?', working: [
        { math: '1.20 + 0.60 = 1.80' }, { mark: 'Cost of the offer' }, { answer: 'The 2 litre carton' }] },
      { n: '2', level: 'easy', marks: 1, question: 'Chocolate bars cost $£1.50$ each, on a 3 for 2 offer. How much does each bar cost with the offer?', working: [
        { math: '1.50 \\times 2 \\div 3 = 1.00' }, { answer: '£1' }] },
      { n: '3', level: 'medium', marks: 3, question: 'Brand A: $400$ g for $£2$ with $25\\%$ extra free. Brand B: $450$ g for $£1.89$. Which is better value?', working: [
        { math: '400 \\times 1.25 = 500' }, { mark: 'The amount with the extra' }, { math: '200 \\div 5 = 40,\\ 189 \\div 4.5 = 42' }, { mark: 'Cost of 100 g' }, { answer: 'Brand A' }] },
      { n: '4', level: 'hard', marks: 2, question: 'Shop X sells cereal at $£2.40$ a box, buy one get one free. Shop Y sells it at 2 boxes for $£2.20$. Kai wants 2 boxes. Where is it cheaper?', working: [
        { math: '\\text{X: } 2.40,\\ \\text{Y: } 2.20' }, { mark: 'Cost of 2 boxes' }, { answer: 'Shop Y' }] },
      { n: '5', level: 'very hard', marks: 3, question: ['Lee needs $6$ cans. Shop A: $75$p a can, 3 for 2.', 'Shop B: $6$ cans for $£3.30$, with $10\\%$ off. Which shop is cheaper?'], working: [
        { math: '\\text{A: pay for } 4: 4 \\times 0.75 = 3.00' }, { mark: 'Shop A' }, { math: '\\text{B: } 3.30 \\times 0.9 = 2.97' }, { mark: 'Shop B' }, { answer: 'Shop B' }] },
    ],
  },
})
