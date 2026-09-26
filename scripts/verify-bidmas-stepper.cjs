// Checks the rule-based BIDMAS stepper (Try your own) and the BIDMAS wrong-answer explanations.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename)
const { solve, SumError } = require('../src/features/order-of-operations/ladder/bidmasStepper.ts')
const { diagnoseBidmas, latexToPlain } = require('../src/features/order-of-operations/ladder/bidmasDiagnosis.ts')

// [sum as a student types it, answer, ladder letters used in order]
const sums = [
  ['3 + 4 × 2', '11', 'MA'],
  ['20 ÷ 4 × 5', '25', 'DM'],
  ['3 × 8 ÷ 4', '6', 'MD'],
  ['10 − 3 + 2', '9', 'SA'],
  ['10 - 4 / 2', '8', 'DS'],
  ['(5 + 3) × 3² − 6 ÷ 3', '70', 'BIMDS'],
  ['(2 + 3)² − 4 × 2', '17', 'BIMS'],
  ['√16 + 3 × (7 − 5)', '10', 'BIMA'],
  ['18 − 12 ÷ 4 + 1', '16', 'DSA'],
  ['(8 − 2) × 3² ÷ 6', '9', 'BIMD'],
  ['5 × (2^3 − 3) + 6', '31', 'BBMA'],
  ['2(3 + 4)', '14', 'BM'],
  ['2 x 3 + 1', '7', 'MA'],
  ['2 * 3 ** 2', '18', 'IM'],
  ['((2 + 3) × 2) + 1', '11', 'BBA'],
  ['−3 + 5', '2', 'A'],
  ['(−3)² + 1', '10', 'IA'],
  ['1.5 × 4', '6', 'M'],
  ['7 ÷ 2', '3.5', 'D'],
  ['100 − 99 − 1', '0', 'SS'],
  ['3 + 4 × 2 =', '11', 'MA'],
  ['2³ × 2', '16', 'IM'],
]
for (const [sum, answer, letters] of sums) {
  const sol = solve(sum)
  assert.equal(sol.answer, answer, `${sum} should be ${answer}, got ${sol.answer}`)
  assert.equal(sol.steps.map(step => step.letter).join(''), letters, `${sum} should use the ladder as ${letters}`)
  assert.equal(sol.steps.at(-1).final, true)
}

// Sums it must refuse, with a plain-English reason
const refusals = [
  ['', 'Type a sum first'],
  ['5 ÷ 0', 'divides by zero'],
  ['√(0 − 9)', "can't square root a negative"],
  ['(3 + 4', 'opened 1 but closed 0'],
  ['3 + × 4', 'two signs in a row'],
  ['3 +', 'ends with a sign'],
  ['1 ÷ 3', 'long decimal'],
  ['1+2+3+4+5+6+7+8+9+10+11+12+13', '12 numbers or fewer'],
  ['3 & 4', "don't understand"],
  ['7', 'something to work out'],
]
for (const [sum, reason] of refusals) {
  assert.throws(() => solve(sum), error => error instanceof SumError && error.message.includes(reason), `${JSON.stringify(sum)} should be refused with "${reason}"`)
}

// Wrong-answer explanations for Lesson 2's own questions
assert.equal(latexToPlain('20\\div(2+3)\\times4'), '20÷(2+3)×4')
assert.equal(latexToPlain('n=3\\times(5-2)^2'), '3×(5-2)^2')
assert.equal(latexToPlain('\\frac{5+3}{2\\times2}'), '(5+3)÷(2×2)')
const explain = [
  ['4+6\\times3', '30', 22, 'left to right'],
  ['4+6\\times3', '22', 22, null],
  ['3+4^2\\times(6-2)', '35', 67, '4² means 4 × 4, not 4 × 2'],
  ['n=3\\times(5-2)^2', '18', 27, '3² means 3 × 3'],
  ['18\\div3\\times2', '3', 12, 'share a step'],
  ['10-6+2', '2', 6, '+ and − share a step'],
  ['\\frac{5+3}{2\\times2}', '7', 2, null],
]
for (const [latex, response, expected, text] of explain) {
  const result = diagnoseBidmas(latex, response, expected)
  if (text === null) assert.equal(result, null, `${latex} / ${response} should stay silent, got: ${result}`)
  else assert.ok(result && result.includes(text), `${latex} / ${response} should mention "${text}", got: ${result}`)
}

console.log(`BIDMAS stepper verified: ${sums.length} sums, ${refusals.length} refusals, ${explain.length} explanations.`)
