// A8.1 Solving quadratics by factorising: the video on lesson 22's worked example (x² + x = 20), and its worksheet.
// The worked example and its four steps are the lesson's own (src/features/quadratic-equations/tutor/). Worksheet
// questions use our own numbers.
module.exports = ({ m, line, big, result, answer, board, row, stack, column, picture, tick, cross }) => {
  // A rug x m wide and x + 1 m long, area 20 m²: the opening picture, and the answer's at the end.
  const rug = (wide = 'x', long = 'x + 1') => picture(`<svg width="320" height="196" viewBox="0 0 360 220">
    <rect x="70" y="30" width="250" height="150" rx="8" fill="#fbe7c6" stroke="#b45309" stroke-width="3"/>
    <path d="M86 46h218M86 164h218" stroke="#e9c28c" stroke-width="2" stroke-dasharray="6 6"/>
    <text x="195" y="114" text-anchor="middle" font-size="26" font-weight="700" fill="#7a3d06">20 m²</text>
    <text x="195" y="210" text-anchor="middle" font-size="22" font-weight="600" fill="#3f51b5">${long}</text>
    <text x="52" y="112" text-anchor="end" font-size="22" font-weight="600" fill="#3f51b5">${wide}</text></svg>`)
  const roots = (b, c) => { const found = []; for (let x = -100; x <= 100; x++) if (x * x + b * x + c === 0) found.push(x); return found }

  return {
    code: 'A8.1', topic: 'Solving quadratics by factorising', strand: 'Algebra', file: 'A8.1_Solving_Quadratics_By_Factorising',

    // Every answer below, worked out again. The kit stops if any is false.
    checks: {
      'x² + x = 20 has x = 4 and x = −5': roots(1, -20).join() === '-5,4',
      '−4 and 5 multiply to −20 and add to 1': -4 * 5 === -20 && -4 + 5 === 1,
      'the rug is 4 by 5, area 20': 4 * 5 === 20,
      'Q2 (x − 3)(x − 7) = 0 gives 3 and 7': roots(-10, 21).join() === '3,7',
      'Q3 x² − 9x + 18 = 0 gives 3 and 6': roots(-9, 18).join() === '3,6',
      'Q4 x² + 2x − 24 = 0 gives −6 and 4': roots(2, -24).join() === '-6,4',
      'Q5 x(x + 3) = 40 gives a width of 5 and length 8': roots(3, -40).join() === '-8,5' && 5 * 8 === 40,
      'Q5c x² − 5x = 14 gives 7 and −2': roots(-5, -14).join() === '-2,7',
    },

    video: {
      slides: [
        { hero: 'A rug with area 20 m²', sub: 'It is x m wide and 1 m longer than it is wide. How wide is it?', items: [
          [big('x(x+1) = 20'), 2.8], [rug(), 2.8], [line('multiply out: $x^2 + x = 20$ ← a quadratic equation'), 3.2]] },
        { stage: 'Step 1 · make it 0', title: 'Make one side 0', from: '$x^2 + x = 20$', items: [
          [line('take 20 from both sides → the 20s on the right cancel'), 2.8],
          [board('x^2 + x', '=', '20', '-\\,20', '-\\,20'), 2.8],
          [result('x^2 + x - 20 = 0'), 3.2]] },
        { title: 'Why make it 0?', items: [
          [line('if two numbers multiply to make **0**, one of them must be **0**'), 2.8],
          [row(m('3 \\times 0 = 0'), m('0 \\times 7 = 0'), `<span>${m('3 \\times 7 = 21')} ${cross}</span>`), 3.2],
          [line('so we write the left side as **two brackets multiplied**: factorise it'), 3.2]] },
        { stage: 'Step 2 · factorise', title: 'Which pair adds to 1?', from: '$x^2 + x - 20 = 0$', items: [
          [line('list the factor pairs of 20') + stack([['$1 \\times 20$'], ['$2 \\times 10$'], ['$4 \\times 5$']]), 3.2],
          [line('−20 is negative, so one number is negative. Make the smaller factors negative'), 3.6],
          [stack([['$-1 \\times 20$', 'adds to 19 ✗'], ['$-2 \\times 10$', 'adds to 8 ✗'], ['$-4 \\times 5$', 'adds to 1 ✓']], 2), 4, 0]] },
        { stage: 'Step 2 · factorise', title: 'Write the brackets', from: 'the pair is $-4$ and $5$', items: [
          [line('each number goes in its own bracket with x'), 2.8],
          [result('(x - 4)(x + 5) = 0'), 3.2],
          [line('check: $-4 \\times 5 = -20$ and $-4 + 5 = 1$', 'grey'), 3.2]] },
        { stage: 'Step 3 · two equations', title: 'One bracket must be 0', from: '$(x - 4)(x + 5) = 0$', items: [
          [line('two brackets multiply to make 0, so one of them is 0'), 2.8],
          [row(m('x - 4 = 0'), 'or', m('x + 5 = 0')), 3.6]] },
        { stage: 'Step 4 · solve each', title: 'Undo each number', from: '$x - 4 = 0$ or $x + 5 = 0$', items: [
          [row(column('x - 4 = 0', 'add 4 to both sides'), column('x + 5 = 0', 'take 5 from both sides')), 3.6],
          [answer('$x = 4$ or $x = -5$'), 3.6]] },
        { title: 'Check both answers', from: '$x = 4$ or $x = -5$', items: [
          [line('put each one back into $x^2 + x$'), 2.4],
          [row(`<span>${m('4^2 + 4 = 16 + 4 = 20')} ${tick}</span>`), 2.8],
          [row(`<span>${m('(-5)^2 + (-5) = 25 - 5 = 20')} ${tick}</span>`), 3.2]] },
        { title: 'Where you see it', items: [
          [rug('4 m', '5 m'), 2.8],
          [line('a width can’t be −5 m, so the rug is **4 m** wide and **5 m** long'), 3.2],
          [line('$4 \\times 5 = 20$ m² ✓'), 2.8]] },
      ],
      recap: ['Make one side 0', 'Factorise into two brackets', 'Set each bracket to 0 and solve'],
    },

    worksheet: {
      title: 'Solving Quadratics: By Factorising',
      questions: [
        { n: '1', level: 'worked', marks: 2, question: 'Solve $x^2 + x = 20$.', working: [
          { say: 'Take 20 from both sides, so one side is 0' }, { math: 'x^2 + x - 20 = 0' },
          { say: '$-4$ and $5$ multiply to $-20$ and add to $1$' }, { math: '(x - 4)(x + 5) = 0' }, { mark: 'Factorising correctly' },
          { say: 'One bracket must be 0, so solve each' }, { answer: '$x = 4$ or $x = -5$' }] },
        { n: '2', level: 'easy', marks: 1, question: 'Solve $(x - 3)(x - 7) = 0$.', working: [
          { say: 'One bracket must be 0' }, { math: 'x - 3 = 0 \\quad\\text{or}\\quad x - 7 = 0' }, { answer: '$x = 3$ or $x = 7$' }] },
        { n: '3', level: 'medium', marks: 2, question: 'Solve $x^2 - 9x + 18 = 0$.', working: [
          { say: 'Both numbers are negative: $-3$ and $-6$ multiply to $18$ and add to $-9$' }, { math: '(x - 3)(x - 6) = 0' }, { mark: '$(x - 3)(x - 6)$' }, { answer: '$x = 3$ or $x = 6$' }] },
        { n: '4', level: 'hard', marks: 2, question: 'Solve $x^2 + 2x - 24 = 0$.', working: [
          { say: '$-24$ is negative, so one number is negative: $6$ and $-4$ multiply to $-24$ and add to $2$' }, { math: '(x + 6)(x - 4) = 0' }, { mark: '$(x + 6)(x - 4)$' }, { answer: '$x = -6$ or $x = 4$' }] },
        { n: '5a', level: 'very hard', marks: 2, question: ['A rectangular garden is $x$ m wide and 3 m longer than it is wide. Its area is $40$ m².', 'Find the width of the garden.'], working: [
          { say: 'Width times length is the area' }, { math: 'x(x + 3) = 40' }, { math: 'x^2 + 3x - 40 = 0' }, { mark: '$x^2 + 3x - 40 = 0$' },
          { math: '(x + 8)(x - 5) = 0' }, { say: 'A width can’t be $-8$' }, { answer: '5 m' }] },
        { n: '5b', level: 'very hard', marks: 1, question: 'Write down the length of the garden.', working: [
          { say: '3 m longer than the width' }, { answer: '8 m' }] },
        { n: '5c', level: 'very hard', marks: 2, question: ['Sam solves $x^2 - 5x = 14$ by writing $x(x - 5) = 14$, so $x = 14$ or $x - 5 = 14$.', 'Is Sam correct? Give the right answer.'], working: [
          { say: 'The brackets only tell you the answer when the other side is 0' }, { math: 'x^2 - 5x - 14 = 0' }, { mark: 'Making one side 0' },
          { math: '(x - 7)(x + 2) = 0' }, { answer: 'No: $x = 7$ or $x = -2$' }] },
      ],
    },
  }
}
