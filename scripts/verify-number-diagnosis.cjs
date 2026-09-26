// Checks that whole-number and decimal wrong-answer explanations name the right mistake,
// using real questions from lessons 4-7 and 9-11, and stay silent on right answers.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename)
const { diagnoseNumber } = require('../src/features/written-methods/tutor/numberDiagnosis.ts')

const cases = [
  // [question, response, expected, text the explanation must contain (null = stay silent)]
  // Rounding
  ['A cyclist rides 24.3650 km. Write the distance correct to 2 decimal places.', '24.36', '24.37', 'cut the number off'],
  ['A cyclist rides 24.3650 km. Write the distance correct to 2 decimal places.', '24.37', '24.37', null],
  ['Ravi’s height is 1.6327 m. Write it correct to 1 decimal place.', '1.7', '1.6', 'less than 5'],
  ['Write 12.2451 correct to 3 decimal places.', '12.25', '12.245', 'correct to 2 decimal places'],
  ['A stadium holds 48 562 people. Write this correct to 2 significant figures.', '49', '49000', 'same size'],
  ['A stadium holds 48 562 people. Write this correct to 2 significant figures.', '48000', '49000', 'cut the number off'],
  ['A spider’s thread is 0.0004062 cm wide. Write it correct to 2 significant figures.', '0', '0.00041', 'Significant figures start'],
  ['A crowd of 3972 attends a concert. Write this correct to the nearest 100.', '3900', '4000', 'next digit is 7'],
  ['A house is valued at £64 500. Write this correct to the nearest £1000.', '64000', '65000', 'cut the number off'],
  ['A rope is 6.97 m long. Write it correct to 1 decimal place.', '7', '7.0', 'keep the zero'],
  ['The total is £30.158. Round this amount to the nearest penny.', '30.15', '30.16', 'cut the number off'],
  // Percentages and decimals
  ['Write 0.4 as a percentage.', '0.4', '40', 'multiply by 100'],
  ['Write 9% as a decimal.', '9', '0.09', 'divide by 100'],
  ['Write 3.5% as a decimal.', '0.35', '0.035', 'decimal point is in the wrong place'],
  ['Work out 5.2 × 3.4.', '176.8', '17.68', '2 decimal places altogether'],
  ['Work out 4.6 × 0.5.', '23', '2.3', '2 decimal places altogether'],
  ['Work out 9.36 ÷ 1.2.', '0.78', '7.8', 'decimal point is in the wrong place'],
  ['Work out 3.2 + 4.5.', '7.7', '7.7', null],
  ['Work out 14.2 - 5.75.', '9.55', '8.45', null],
  // Multiplication
  ['Work out 42 × 18 using the grid method.', '378', '756', 'place-holder zero'],
  ['Work out 42 × 18 using the grid method.', '336', '756', 'only multiplied by 8'],
  ['Work out 347 × 4 using the column method.', '1268', '1388', 'carried digits'],
  ['Work out 213 × 3 using the column method.', '639', '639', null],
  // HCF and LCM
  ['Find the HCF of 24 and 36.', '72', '12', 'That’s the LCM'],
  ['Find the HCF of 24 and 36.', '6', '12', "isn't the highest"],
  ['Bell A rings every 14 minutes and bell B every 21 minutes. After how many minutes will they next ring together?', '294', '42', 'not the lowest'],
  ['Bell A rings every 14 minutes and bell B every 21 minutes. After how many minutes will they next ring together?', '7', '42', 'That’s the HCF'],
  ['Bell A rings every 14 minutes and bell B every 21 minutes. After how many minutes will they next ring together?', '41', '42', null],
  // Rounding up for "none left over"
  ['The baker wants to pack every bun into a box, with none left over. How many boxes does she need?', '31', '32', 'round up to 32'],
  // Not a number, or no recognisable mistake
  ['Work out 84 ÷ 4 using the bus-stop method.', 'twenty', '21', null],
  ['Work out 84 ÷ 4 using the bus-stop method.', '19', '21', null],
]

for (const [question, response, expected, text] of cases) {
  const result = diagnoseNumber(question, response, expected)
  if (text === null) assert.equal(result, null, `${question} / ${response} should stay silent, got: ${result}`)
  else assert.ok(result && result.includes(text), `${question} / ${response} should mention "${text}", got: ${result}`)
}
console.log(`Number diagnosis verified: ${cases.length} cases.`)
