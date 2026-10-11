// R9.1 Density: the video and worksheet for the first rung of Compound measures (lesson 40). From R9 Density Mass Volume
// (p110–111) of Sunny's book: the formula triangle, finding density, mass or volume. Our own numbers.
module.exports = ({ line, big, result, answer, row, picture }) => {
  const { triangle } = require('../lib/triangle.cjs')
  return {
    code: 'R9.1', topic: 'Density', strand: 'Ratio', file: 'R9.1_Density',

    checks: {
      '540 g in 200 cm³ is 2.7 g/cm³': 540 / 200 === 2.7,
      '50 cm³ of 2.7 g/cm³ is 135 g': Math.round(2.7 * 50) === 135,
      'Q2 300 g in 40 cm³ is 7.5 g/cm³': 300 / 40 === 7.5,
      'Q3 0.8 g/cm³ for 250 cm³ is 200 g': 0.8 * 250 === 200,
      'Q4 1.2 kg at 8 g/cm³ is 150 cm³': 1200 / 8 === 150,
      'Q5 5 cm cube is 125 cm³, 1000 g / 125 = 8 g/cm³': 5 ** 3 === 125 && 1000 / 125 === 8,
    },

    video: {
      slides: [
        { hero: 'Density', sub: 'A block of metal has a mass of 540 g and a volume of 200 cm³. What is its density?', items: [
          [big('\\text{density} = \\dfrac{\\text{mass}}{\\text{volume}}'), 3]] },
        { stage: 'The triangle', title: 'Mass over density × volume', items: [
          [picture(triangle(['M', 'D', 'V'])), 3.2],
          [line('cover what you want: the line means **divide**, side by side means **multiply**'), 3.4]] },
        { stage: 'Step 1 · cover D', title: 'Density', items: [
          [picture(triangle(['M', 'D', 'V'], 'D')), 2.8],
          [result('D = 540 \\div 200 = 2.7'), 2.8],
          [answer('$2.7$ g/cm³'), 2.4]] },
        { title: 'Find the mass', from: '$50$ cm³ of the same metal', items: [
          [picture(triangle(['M', 'D', 'V'], 'M')), 2.6],
          [result('M = 2.7 \\times 50 = 135\\text{ g}'), 3]] },
        { title: 'Units', items: [
          [line('g and cm³ give g/cm³; kg and m³ give kg/m³'), 3],
          [line('change kg to g first if the density is in g/cm³', 'grey'), 2.8]] },
      ],
      recap: ['D = M ÷ V', 'M = D × V, V = M ÷ D', 'Match the units first'],
    },

    worksheet: {
      title: 'Compound measures: Density',
      questions: [
        { n: '1', level: 'worked', marks: 2, question: 'A block of metal has a mass of $540$ g and a volume of $200$ cm³. What is its density?', working: [
          { math: 'D = M \\div V' }, { mark: 'The formula' }, { math: '540 \\div 200 = 2.7' }, { answer: '2.7 g/cm³' }] },
        { n: '2', level: 'easy', marks: 1, question: 'A stone has a mass of $300$ g and a volume of $40$ cm³. Find its density.', working: [
          { math: '300 \\div 40 = 7.5' }, { answer: '7.5 g/cm³' }] },
        { n: '3', level: 'medium', marks: 1, question: 'Oil has a density of $0.8$ g/cm³. What is the mass of $250$ cm³ of oil?', working: [
          { math: '0.8 \\times 250 = 200' }, { answer: '200 g' }] },
        { n: '4', level: 'hard', marks: 2, question: 'A brass weight has a mass of $1.2$ kg. Brass has a density of $8$ g/cm³. Find its volume.', working: [
          { math: '1.2\\text{ kg} = 1200\\text{ g}' }, { mark: 'Same units' }, { math: '1200 \\div 8 = 150' }, { answer: '150 cm³' }] },
        { n: '5', level: 'very hard', marks: 3, question: 'A solid cube has sides of $5$ cm and a mass of $1$ kg. Find its density in g/cm³.', working: [
          { math: '5^3 = 125' }, { mark: 'Volume' }, { math: '1000 \\div 125 = 8' }, { mark: 'Mass in grams' }, { answer: '8 g/cm³' }] },
      ],
    },
  }
}
