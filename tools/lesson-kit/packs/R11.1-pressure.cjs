// R11.1 Pressure: the video and worksheet for the third rung of Compound measures (lesson 40). From R11 Pressure Force
// Area (p114–115) of Sunny's book: the triangle, newtons and N/m². Our own numbers.
module.exports = ({ line, big, result, answer, row, picture }) => {
  const { triangle } = require('../lib/triangle.cjs')
  return {
    code: 'R11.1', topic: 'Pressure', strand: 'Ratio', file: 'R11.1_Pressure',

    checks: {
      '240 N on 0.6 m² is 400 N/m²': Math.round(240 / 0.6) === 400,
      '400 N/m² on 0.05 m² is 20 N': Math.round(400 * 0.05) === 20,
      'Q2 90 N on 3 m² is 30 N/m²': 90 / 3 === 30,
      'Q3 250 N/m² on 2 m² is 500 N': 250 * 2 === 500,
      'Q4 1.5 kN = 1500 N at 300 N/m² is 5 m²': 1500 / 300 === 5,
      'Q5 box 600 N on a 0.5 m by 0.4 m face: 0.2 m², 3000 N/m²': Math.round(0.5 * 0.4 * 10) === 2 && Math.round(600 / 0.2) === 3000,
    },

    video: {
      slides: [
        { hero: 'Pressure', sub: 'A force of 240 N pushes on an area of 0.6 m². What is the pressure?', items: [
          [big('\\text{pressure} = \\dfrac{\\text{force}}{\\text{area}}'), 3]] },
        { stage: 'The triangle', title: 'F over P × A', items: [
          [picture(triangle(['F', 'P', 'A'])), 3.2],
          [line('force in newtons (N), area in m², pressure in N/m²'), 3]] },
        { stage: 'Step 1 · cover P', title: 'Pressure', items: [
          [picture(triangle(['F', 'P', 'A'], 'P')), 2.6],
          [result('P = 240 \\div 0.6 = 400'), 2.6],
          [answer('$400$ N/m²'), 2.2]] },
        { title: 'Find the force', from: '$400$ N/m² on $0.05$ m²', items: [
          [picture(triangle(['F', 'P', 'A'], 'F')), 2.6],
          [result('F = 400 \\times 0.05 = 20\\text{ N}'), 3]] },
        { title: 'Watch the units', items: [
          [line('$1$ kN $= 1000$ N: change kilonewtons first'), 3],
          [line('a smaller area means **more** pressure for the same force', 'grey'), 3]] },
      ],
      recap: ['P = F ÷ A', 'F = P × A, A = F ÷ P', 'Newtons and m² give N/m²'],
    },

    worksheet: {
      title: 'Compound measures: Pressure',
      questions: [
        { n: '1', level: 'worked', marks: 2, question: 'A force of $240$ N pushes on an area of $0.6$ m². What is the pressure?', working: [
          { math: 'P = F \\div A' }, { mark: 'The formula' }, { math: '240 \\div 0.6 = 400' }, { answer: '400 N/m²' }] },
        { n: '2', level: 'easy', marks: 1, question: 'A force of $90$ N acts on an area of $3$ m². Find the pressure.', working: [
          { math: '90 \\div 3 = 30' }, { answer: '30 N/m²' }] },
        { n: '3', level: 'medium', marks: 1, question: 'A pressure of $250$ N/m² acts on an area of $2$ m². Find the force.', working: [
          { math: '250 \\times 2 = 500' }, { answer: '500 N' }] },
        { n: '4', level: 'hard', marks: 2, question: 'A force of $1.5$ kN gives a pressure of $300$ N/m². Find the area.', working: [
          { math: '1.5\\text{ kN} = 1500\\text{ N}' }, { mark: 'Same units' }, { math: '1500 \\div 300 = 5' }, { answer: '5 m²' }] },
        { n: '5', level: 'very hard', marks: 3, question: 'A box weighs $600$ N. It rests on a face $0.5$ m by $0.4$ m. What pressure does it put on the floor?', working: [
          { math: '0.5 \\times 0.4 = 0.2' }, { mark: 'Area of the face' }, { math: '600 \\div 0.2 = 3000' }, { mark: 'Dividing force by area' }, { answer: '3000 N/m²' }] },
      ],
    },
  }
}
