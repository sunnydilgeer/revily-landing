// R1.2 Simplifying ratios: the video and worksheet for the second rung of the Ratios lesson (lesson 37). From Skill 2
// on p91 of Sunny's book and its different-units example on p92; made in Aniksha's style, with our own numbers.
module.exports = ({ line, big, result, answer, row, stack }) => {
  const hcf = (a, b) => b ? hcf(b, a % b) : a
  const simplest = list => { const h = list.reduce(hcf); return list.map(n => n / h).join(':') }

  return {
    code: 'R1.2', topic: 'Simplifying ratios', strand: 'Ratio', file: 'R1.2_Simplifying_Ratios',

    checks: {
      '12 : 18 : 30 has HCF 6 and simplifies to 2 : 3 : 5': [12, 18, 30].reduce(hcf) === 6 && simplest([12, 18, 30]) === '2:3:5',
      'Q2 10 : 25 is 2 : 5': simplest([10, 25]) === '2:5',
      'Q3 36 : 48 is 3 : 4': simplest([36, 48]) === '3:4',
      'Q4 24 : 40 : 56 is 3 : 5 : 7': simplest([24, 40, 56]) === '3:5:7',
      'Q5a 2 m : 40 cm is 200 : 40, so 5 : 1': simplest([200, 40]) === '5:1',
      'Q5b 1.5 : 2.5 is 15 : 25, so 3 : 5': simplest([15, 25]) === '3:5',
    },

    video: {
      slides: [
        { hero: 'Simplify a ratio', sub: 'Write 12 : 18 : 30 in its simplest form.', items: [
          [big('12 : 18 : 30'), 2.8],
          [line('simplest form: the **smallest whole numbers** in the same ratio'), 3.2]] },
        { stage: 'Step 1 · find the HCF', title: 'What divides all three?', from: '$12 : 18 : 30$', items: [
          [stack([['$2$', 'divides all three ✓'], ['$3$', 'divides all three ✓'], ['$6$', 'divides all three ✓ the biggest']], 2), 3.6],
          [result('\\text{HCF} = 6'), 2.8]] },
        { stage: 'Step 2 · divide every part', title: 'Divide by 6', from: '$12 : 18 : 30$', items: [
          [row('$12 \\div 6 = 2$', '$18 \\div 6 = 3$', '$30 \\div 6 = 5$'), 3.6],
          [answer('$2 : 3 : 5$'), 3.2]] },
        { title: 'Is it simplest?', from: '$2 : 3 : 5$', items: [
          [line('nothing but 1 divides 2, 3 and 5, so it is in its **simplest form** ✓'), 3.4],
          [line('dividing by a smaller factor first is fine: just keep going until you can’t', 'grey'), 3.4]] },
        { title: 'Different units', items: [
          [line('$2$ m : $40$ cm: make the units the same first'), 3],
          [row('$2$ m $= 200$ cm', '$200 : 40$'), 3.2],
          [line('divide both by $40$'), 2.4], [answer('$5 : 1$'), 3]] },
      ],
      recap: ['Find the HCF of every part', 'Divide every part by it', 'Same units first'],
    },

    worksheet: {
      title: 'Ratios: Simplifying',
      questions: [
        { n: '1', level: 'worked', marks: 1, question: 'Write $12 : 18 : 30$ in its simplest form.', working: [
          { say: 'The highest common factor of 12, 18 and 30 is 6' }, { math: '12 \\div 6 : 18 \\div 6 : 30 \\div 6' }, { answer: '$2 : 3 : 5$' }] },
        { n: '2', level: 'easy', marks: 1, question: 'Write $10 : 25$ in its simplest form.', working: [
          { say: 'Divide both by 5' }, { answer: '$2 : 5$' }] },
        { n: '3', level: 'medium', marks: 1, question: 'Write $36 : 48$ in its simplest form.', working: [
          { say: 'The HCF of 36 and 48 is 12' }, { answer: '$3 : 4$' }] },
        { n: '4', level: 'hard', marks: 2, question: 'Write $24 : 40 : 56$ in its simplest form.', working: [
          { say: 'The HCF of 24, 40 and 56 is 8' }, { mark: 'Dividing by a common factor' }, { answer: '$3 : 5 : 7$' }] },
        { n: '5a', level: 'very hard', marks: 2, question: 'Write $2$ m $: 40$ cm in its simplest form.', working: [
          { say: 'Same units first: 2 m is 200 cm' }, { math: '200 : 40' }, { mark: 'Both in cm' }, { answer: '$5 : 1$' }] },
        { n: '5b', level: 'very hard', marks: 2, question: 'Write $1.5 : 2.5$ in its simplest form.', working: [
          { say: 'Multiply both by 10 to make whole numbers' }, { math: '15 : 25' }, { mark: '$15 : 25$' }, { answer: '$3 : 5$' }] },
      ],
    },
  }
}
