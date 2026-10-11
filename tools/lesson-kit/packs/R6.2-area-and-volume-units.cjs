// R6.2 Area and volume units: the video and worksheet for the second rung of Converting units (lesson 38). From
// "Converting Units - Length, Area, Volume (Metric)" and Example 2 in R6 (p103–104) of Sunny's book, with our own numbers.
module.exports = ({ line, big, result, answer, row, picture }) => {
  const square = `<svg width="300" height="230" viewBox="0 0 300 230" font-family="Poppins, Arial, sans-serif"><rect x="60" y="20" width="180" height="180" fill="#dbe5ff" stroke="#2443b5" stroke-width="3"/>${Array.from({ length: 9 }, (_, i) => `<line x1="${60 + (i + 1) * 18}" y1="20" x2="${60 + (i + 1) * 18}" y2="200" stroke="#2443b5" stroke-opacity=".25"/><line x1="60" y1="${20 + (i + 1) * 18}" x2="240" y2="${20 + (i + 1) * 18}" stroke="#2443b5" stroke-opacity=".25"/>`).join('')}<text x="150" y="222" text-anchor="middle" font-size="18" font-weight="700" fill="#17213a">1 m = 100 cm</text><text x="44" y="116" text-anchor="middle" font-size="18" font-weight="700" fill="#17213a" transform="rotate(-90 44 116)">1 m = 100 cm</text></svg>`
  return {
    code: 'R6.2', topic: 'Area and volume units', strand: 'Ratio', file: 'R6.2_Area_And_Volume_Units',

    checks: {
      '1 m² = 100 × 100 = 10 000 cm²': 100 * 100 === 10000,
      '3 m² = 30 000 cm²': 3 * 10000 === 30000,
      '1 m³ = 1 000 000 cm³': 100 ** 3 === 1000000,
      'Q2 4 cm² = 400 mm²': 4 * 100 === 400,
      'Q3 1.2 m³ = 1 200 000 cm³': Math.round(1.2 * 1000000) === 1200000,
      'Q4 50 000 cm² = 5 m²': 50000 / 10000 === 5,
      'Q5 80 × 50 × 40 cm = 0.16 m³': Math.abs(0.8 * 0.5 * 0.4 - 0.16) < 1e-9 && 80 * 50 * 40 / 1000000 === 0.16,
    },

    video: {
      slides: [
        { hero: 'Area and volume units', sub: 'A floor has an area of 3 m². What is that in cm²?', items: [
          [big('3\\text{ m}^2 = \\ ?\\text{ cm}^2'), 2.8]] },
        { stage: 'The trap', title: 'Not 100', items: [
          [line('$1$ m $= 100$ cm, so is $1$ m² $= 100$ cm²?'), 3],
          [line('**No.** Draw the square: it is $100$ cm by $100$ cm', 'grey'), 3]] },
        { stage: 'Step 1 · square the scale factor', title: '1 m² in cm²', items: [
          [picture(square), 3.2],
          [result('1\\text{ m}^2 = 100 \\times 100 = 10\\,000\\text{ cm}^2'), 3.4]] },
        { stage: 'Step 2 · multiply', title: '3 m²', from: '$1$ m² $= 10\\,000$ cm²', items: [
          [result('3 \\times 10\\,000 = 30\\,000'), 2.8],
          [answer('$30\\,000$ cm²'), 2.6]] },
        { title: 'Volume: cube it', items: [
          [line('a cube $1$ m each way is $100 \\times 100 \\times 100$ cm³'), 3.2],
          [result('1\\text{ m}^3 = 1\\,000\\,000\\text{ cm}^3'), 3],
          [row('$1$ cm² $= 100$ mm²', '$1$ cm³ $= 1000$ mm³'), 3.2]] },
      ],
      recap: ['Square the length factor for area', 'Cube it for volume', 'Multiply to smaller units, divide to bigger'],
    },

    worksheet: {
      title: 'Converting units: Area and volume',
      questions: [
        { n: '1', level: 'worked', marks: 1, question: 'A floor has an area of $3$ m². What is that in cm²?', working: [
          { math: '1\\text{ m}^2 = 100 \\times 100 = 10\\,000\\text{ cm}^2' }, { math: '3 \\times 10\\,000 = 30\\,000' }, { answer: '30 000 cm²' }] },
        { n: '2', level: 'easy', marks: 1, question: 'A stamp has an area of $4$ cm². What is that in mm²?', working: [
          { math: '1\\text{ cm}^2 = 10 \\times 10 = 100\\text{ mm}^2' }, { answer: '400 mm²' }] },
        { n: '3', level: 'medium', marks: 1, question: 'A skip holds $1.2$ m³. What is that in cm³?', working: [
          { math: '1.2 \\times 1\\,000\\,000' }, { answer: '1 200 000 cm³' }] },
        { n: '4', level: 'hard', marks: 1, question: 'A rug has an area of $50\\,000$ cm². What is that in m²?', working: [
          { math: '50\\,000 \\div 10\\,000 = 5' }, { answer: '5 m²' }] },
        { n: '5', level: 'very hard', marks: 2, question: 'A fish tank is $80$ cm by $50$ cm by $40$ cm. What is its volume in m³?', working: [
          { math: '0.8 \\times 0.5 \\times 0.4 = 0.16' }, { mark: 'Change to metres first' }, { answer: '0.16 m³' }] },
      ],
    },
  }
}
