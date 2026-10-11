// R6.3 Using a conversion rate: the video and worksheet for the third rung of Converting units (lesson 38): imperial and
// metric, and money. From the Metric-Imperial table, Example 1 and Q1/Q5 in R6 (p103–105) of Sunny's book, with our own
// numbers. Rates are always given in the question.
module.exports = ({ line, big, result, answer, row }) => ({
  code: 'R6.3', topic: 'Using a conversion rate', strand: 'Ratio', file: 'R6.3_Using_A_Conversion_Rate',

  checks: {
    '5 kg × 2.2 = 11 pounds': Math.round(5 * 2.2 * 10) === 110,
    '33 pounds ÷ 2.2 = 15 kg': Math.round(33 / 2.2 * 10) === 150,
    'Q2 £300 × 1.25 = $375': 300 * 1.25 === 375,
    'Q3 6 feet × 30 = 180 cm': 6 * 30 === 180,
    'Q4 9 litres ÷ 4.5 = 2 gallons': 9 / 4.5 === 2,
    'Q5 £400 less 2% = £392, × 1.15 = €450.80': 400 * 0.98 === 392 && Math.round(392 * 1.15 * 100) === 45080,
  },

  video: {
    slides: [
      { hero: 'Using a conversion rate', sub: 'A suitcase weighs 5 kg. Use 1 kg ≈ 2.2 pounds. What is that in pounds?', items: [
        [big('1\\text{ kg} \\approx 2.2\\text{ pounds}'), 2.8]] },
      { stage: 'Step 1 · read the rate', title: 'Which way?', from: '$1$ kg $\\approx 2.2$ pounds', items: [
        [line('every kilogram is $2.2$ pounds'), 2.8],
        [line('kg → pounds: **multiply** by $2.2$'), 2.8],
        [line('pounds → kg: **divide** by $2.2$', 'grey'), 2.6]] },
      { stage: 'Step 2 · multiply', title: '5 kg', items: [
        [result('5 \\times 2.2 = 11'), 2.6],
        [answer('about $11$ pounds'), 2.6]] },
      { title: 'The other way', from: '$33$ pounds in kg', items: [
        [result('33 \\div 2.2 = 15'), 2.8],
        [answer('$15$ kg'), 2.4],
        [line('check: a kilogram is bigger than a pound, so fewer kilograms ✓', 'grey'), 3.2]] },
      { title: 'Money works the same', from: '$£1 = 1.25$ dollars', items: [
        [row('$£300 \\times 1.25 = 375$ dollars', '$375 \\div 1.25 = £300$'), 3.6],
        [line('a fee? take it off first, then convert'), 3]] },
    ],
    recap: ['Read the rate: 1 of these is so many of those', 'Multiply to go from the 1, divide to go back', 'Check the size makes sense'],
  },

  worksheet: {
    title: 'Converting units: Using a conversion rate',
    questions: [
      { n: '1', level: 'worked', marks: 1, question: 'A suitcase weighs $5$ kg. Use $1$ kg $\\approx 2.2$ pounds. About how many pounds is that?', working: [
        { say: 'kg to pounds: multiply by 2.2' }, { math: '5 \\times 2.2 = 11' }, { answer: '11 pounds' }] },
      { n: '2', level: 'easy', marks: 1, question: 'Ravi changes $£300$ into dollars. The rate is $£1 = 1.25$ dollars. How many dollars does he get?', working: [
        { math: '300 \\times 1.25 = 375' }, { answer: '375 dollars' }] },
      { n: '3', level: 'medium', marks: 1, question: 'A door is $6$ feet tall. Use $1$ foot $\\approx 30$ cm. About how tall is it in cm?', working: [
        { math: '6 \\times 30 = 180' }, { answer: '180 cm' }] },
      { n: '4', level: 'hard', marks: 1, question: 'A tank holds $9$ litres. Use $1$ gallon $\\approx 4.5$ litres. About how many gallons is that?', working: [
        { math: '9 \\div 4.5 = 2' }, { answer: '2 gallons' }] },
      { n: '5', level: 'very hard', marks: 3, question: ['Kim changes $£400$ into euros. There is a $2\\%$ fee, taken off first.', 'The rate is $£1 = 1.15$ euros. How many euros does she get?'], working: [
        { math: '400 \\times 0.98 = 392' }, { mark: 'Taking off the fee' }, { math: '392 \\times 1.15 = 450.80' }, { mark: 'Multiplying by the rate' }, { answer: '€450.80' }] },
    ],
  },
})
