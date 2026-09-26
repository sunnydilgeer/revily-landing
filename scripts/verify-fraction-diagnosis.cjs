// Checks that fraction wrong-answer explanations name the right mistake and stay silent on right answers.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename)
const { diagnoseFraction, diagnoseAmount } = require('../src/features/fractions/tutor/fractionDiagnosis.ts')

const simplest = { requireSimplest: true }
const cases = [
  // [question, response, expected, options, text the explanation must contain (null = stay silent)]
  ['Simplify 10/15 fully.', '2/3', '2/3', simplest, null],
  ['Simplify 10/15 fully.', '5/10', '2/3', simplest, "isn't equal to 10/15"],
  ['Simplify 10/15 fully.', '10/15', '2/3', simplest, 'the fraction you started with'],
  ['Simplify 42/56 fully.', '6/8', '3/4', simplest, 'divided by 2'],
  ['Simplify 10/15 fully.', '3/2', '2/3', simplest, 'upside down'],
  ['Write 17/6 as a mixed number.', '17/6', '2 5/6', { requireMixedForm: true }, 'wants a mixed number'],
  ['Write 6 3/8 as an improper fraction.', '6 3/8', '51/8', simplest, 'wants an improper fraction'],
  ['Write 6 3/8 as an improper fraction.', '9/8', '51/8', simplest, 'You added 6 + 3'],
  ['Write a fraction equivalent to 5/8 that has a denominator of 96.', '5/8', '60/96', { requiredDenominator: 96 }, 'denominator of 96'],
  ['Work out 2/9 + 4/9. Give your answer in its simplest form.', '6/18', '2/3', simplest, 'added the denominators'],
  ['Work out 2/9 + 4/9. Give your answer in its simplest form.', '6/9', '2/3', simplest, "isn't fully simplified"],
  ['Without a calculator, work out 3/8 + 1/6.', '4/14', '13/24', simplest, 'added the denominators'],
  ['Without a calculator, work out 3/8 + 1/6.', '4/8', '13/24', simplest, 'common denominator'],
  ['Without a calculator, work out 7/9 - 2/3.', '5/6', '1/9', simplest, 'subtracted the denominators'],
  ['Without a calculator, work out 5/6 + 3/4. Give your answer as a mixed number.', '19/12', '1 7/12', { requireMixedForm: true }, 'wants a mixed number'],
  ['Work out 1/3 ÷ 2/5.', '2/15', '5/6', simplest, 'You multiplied the fractions'],
  ['Work out 1/3 ÷ 2/5.', '6/5', '5/6', simplest, 'flipped the first fraction'],
  ['Work out 1/3 ÷ 2/5.', '5/6', '5/6', simplest, null],
  ['Work out 1/4 × 2/3. Give your answer in its simplest form.', '7/12', '1/6', simplest, null],
  ['Work out 7/8 - 3/8. Give your answer in its simplest form.', '4/8', '1/2', simplest, "isn't fully simplified"],
  ['Simplify 10/15 fully.', 'banana', '2/3', simplest, null],
]
for (const [question, response, expected, options, text] of cases) {
  const result = diagnoseFraction({ question, response, expected, ...options })
  if (text === null) assert.equal(result, null, `${question} / ${response} should stay silent, got: ${result}`)
  else assert.ok(result && result.includes(text), `${question} / ${response} should mention "${text}", got: ${result}`)
}

assert.match(diagnoseAmount('Find 5/8 of £96.', '12'), /one part/)
assert.match(diagnoseAmount('Find 5/8 of £96.', '19.2'), /divided by the top number/)
assert.equal(diagnoseAmount('Find 5/8 of £96.', '60'), null)
assert.equal(diagnoseAmount('Find 1/4 of £48.', '12'), null)

console.log(`Fraction diagnosis verified: ${cases.length + 4} cases.`)
