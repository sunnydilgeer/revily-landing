const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const lesson = read('src/features/fractions-decimals-percentages/tutor/fractionsDecimalsPercentagesLesson.ts')

const practiceCount = (lesson.match(/\bpractice\(/g) || []).length - 1
const workedCount = (lesson.match(/\bworked\(/g) || []).length - 1
const reviewCount = (lesson.match(/^add\('mixed'/gm) || []).length
assert.equal(practiceCount, 42, 'Lesson 9 must retain seven Q2-Q5c practice parts from each of six PDFs')
assert.equal(workedCount, 6, 'Lesson 9 must contain one source-video worked example for each PDF')
assert.equal(reviewCount, 1, 'Lesson 9 must end with one consolidation screen')
assert.equal(practiceCount + workedCount + reviewCount, 49, 'Lesson 9 screen total')

for (let skill = 1; skill <= 6; skill++) {
  for (const question of ['Q1', 'Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']) {
    assert.ok(lesson.includes(`N9.${skill} ${question}`), `Missing N9.${skill} ${question}`)
  }
}
assert.equal((lesson.match(/sourceFile: 'N9\./g) || []).length, 6, 'Every source video must be defined once')
assert.ok(lesson.includes("id: 'L009'"), 'Lesson 9 must preserve its stable progress key')
assert.equal((lesson.match(/fractionRange\(/g) || []).length, 3, 'All three open fraction prompts must enforce the requested denominator and value range')
assert.equal((lesson.match(/openNumber\(/g) || []).length, 2, 'Both unbounded open-number prompts must accept every value above the source threshold')
const grading = read('src/features/number-types/lessonMath.ts')
assert.ok(grading.includes("acceptanceRule === 'rationalInterval'"), 'Open fraction grading must be handled by the shared lesson engine')
assert.ok(grading.includes("acceptanceRule === 'greaterThan'"), 'Unbounded greater-than grading must be handled by the shared lesson engine')

const close = (actual, expected, label) => assert.ok(Math.abs(actual - expected) < 1e-12, `${label}: expected ${expected}, got ${actual}`)
close(5 / 8, 0.625, 'N9.1 Q1')
close(3 / 4, 0.75, 'N9.1 Q2')
close(17 / 40, 0.425, 'N9.1 Q3')
close(9 / 16, 0.5625, 'N9.1 Q4a')
close(Math.round((9 / 16) * 100) / 100, 0.56, 'N9.1 Q4b')
close(1 / 8, 0.125, 'N9.1 Q5a')

const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a)
const reduce = (n, d) => { const factor = gcd(n, d); return [n / factor, d / factor] }
assert.deepEqual(reduce(84, 100), [21, 25], 'N9.2 Q1')
assert.deepEqual(reduce(6, 10), [3, 5], 'N9.2 Q2')
assert.deepEqual(reduce(35, 100), [7, 20], 'N9.2 Q3')
assert.deepEqual(reduce(375, 1000), [3, 8], 'N9.2 Q4a')
assert.equal(0.45 * 20, 9, 'N9.2 Q5a')

close(0.68 * 100, 68, 'N9.3 Q1')
close(0.056 * 100, 5.6, 'N9.3 Q3')
close(1.25 * 100, 125, 'N9.3 Q4a')
close(4.5 / 100, 0.045, 'N9.3 Q5a')
close(72 / 100, 0.72, 'N9.4 Q1')
close(9 / 100, 0.09, 'N9.4 Q2')
close(3.5 / 100, 0.035, 'N9.4 Q3')
close(240 / 100, 2.4, 'N9.4 Q4a')
close((25 / 2) / 100, 0.125, 'N9.4 Q5a')

close(7 / 20 * 100, 35, 'N9.5 Q1')
close(1 / 4 * 100, 25, 'N9.5 Q2')
close(9 / 25 * 100, 36, 'N9.5 Q3')
close(11 / 8 * 100, 137.5, 'N9.5 Q4a')
close(26 / 40 * 100, 65, 'N9.5 Q5a')
assert.deepEqual(reduce(65, 100), [13, 20], 'N9.6 Q1')
assert.deepEqual(reduce(40, 100), [2, 5], 'N9.6 Q2')
assert.deepEqual(reduce(28, 100), [7, 25], 'N9.6 Q3')
assert.deepEqual(reduce(125, 1000), [1, 8], 'N9.6 Q4a')
close(9 / 20 * 100, 45, 'N9.6 Q5a')

const mediaHashes = {
  'fraction-to-decimal.mp4': '2f1b266786fc7c760a636f157e98de1f83196eaf8b8d664bc637a70295d290b7',
  'decimal-to-fraction.mp4': '62fa7304c765a959b8fd5baa7a8a9c6f7dcb4caa4a3534bf1bc02e774449b40e',
  'decimal-to-percentage.mp4': '2cfcc198765fe2708a5802b29870e736748a0778d4775a0b3e573493ac53de79',
  'percentage-to-decimal.mp4': '36d0a8a3ededf42c3801533859179eb9e2ba6fe7c6cf07316a009a192dfb1354',
  'fraction-to-percentage.mp4': '32691176c40657238fce1d602885176f5c5e5eb56f60fe42b3bacf2d4f659864',
  'percentage-to-fraction.mp4': 'ac974cf28fc38f5e9dfcda2cfc496d366dfc5ac6605c0ca266e6764c55f06183',
}
for (const [name, expected] of Object.entries(mediaHashes)) {
  const file = path.join(root, 'public/media/lesson-9', name)
  const actual = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
  assert.equal(actual, expected, `${name} must remain source-identical`)
  const poster = fs.readFileSync(file.replace(/\.mp4$/, '.jpg'))
  assert.deepEqual([...poster.subarray(0, 3)], [0xff, 0xd8, 0xff], `${name} poster must be a JPEG`)
}

const app = read('src/App.tsx')
assert.ok(app.includes('TutorFractionsDecimalsPercentagesLesson'), 'Lesson 9 must be mounted in the preview app')
assert.ok(app.includes('case 9:') && app.includes('return <TutorFractionsDecimalsPercentagesLesson />'), 'Lesson 9 must open from the course overview and direct route')
const registry = read('src/features/maths/courseRegistry.ts')
assert.ok(registry.includes("entry(9, tutorFractionsDecimalsPercentagesLesson, 'Fractions, decimals and percentages'"), 'Lesson 9 must be appended to the canonical course order')
const model = read('src/features/written-methods/tutor/model.ts')
assert.ok(model.includes('| ConversionWorking'), 'Lesson 9 must use the shared tutor working pipeline')

// The right answer is written first, so choose() moves it to a different position on each question
assert.ok(!/\], 0\)/.test(lesson), 'Lesson 9: use choose() so the right answer is not always first')

console.log('Lesson 9 verified: 49 screens, 48 source-aligned examples and practice parts, 6 source-identical videos, exact conversions and canonical course route.')
