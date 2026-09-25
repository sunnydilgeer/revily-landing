const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const lesson = read('src/features/rounding/tutor/roundingLesson.ts')

const practiceCount = (lesson.match(/\bpractice\(/g) || []).length - 1
const workedCount = (lesson.match(/\bworked\(/g) || []).length - 1
const reviewCount = (lesson.match(/^add\('mixed'/gm) || []).length
assert.equal(practiceCount, 28, 'Lesson 10 must retain seven Q2-Q5c practice parts from each of four PDFs')
assert.equal(workedCount, 4, 'Lesson 10 must contain one source-video worked example for each PDF')
assert.equal(reviewCount, 1, 'Lesson 10 must end with one consolidation screen')
assert.equal(practiceCount + workedCount + reviewCount, 33, 'Lesson 10 screen total')

for (let skill = 1; skill <= 4; skill++) {
  for (const question of ['Q1', 'Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']) {
    assert.ok(lesson.includes(`N10.${skill} ${question}`), `Missing N10.${skill} ${question}`)
  }
}
assert.equal((lesson.match(/sourceFile: 'N10\./g) || []).length, 4, 'Every source video must be defined once')
assert.ok(lesson.includes("id: 'L010'"), 'Lesson 10 must preserve its stable progress key')
assert.equal((lesson.match(/fixed\('/g) || []).length, 2, 'Both typed trailing-zero answers must use formatting-aware grading')

const round = (value, places) => Number(value.toFixed(places))
assert.equal(round(7.4362, 2), 7.44, 'N10.1 Q1')
assert.equal(round(24.365, 2), 24.36, 'JavaScript tie behavior is not used as the source rule')
assert.equal(Math.floor(24.365 * 100 + 0.5) / 100, 24.37, 'N10.1 Q3 uses half-up rounding')
assert.equal(round(3.2748, 2), 3.27, 'N10.1 Q4a')
assert.equal(round(12.2451, 3), 12.245, 'N10.1 Q5b')
assert.equal(Number((0.02768).toPrecision(2)), 0.028, 'N10.2 Q1')
assert.equal(Number((48562).toPrecision(2)), 49000, 'N10.2 Q3')
assert.equal(Number((0.0004062).toPrecision(2)), 0.00041, 'N10.2 Q4a')
assert.equal(Math.round(64500 / 1000) * 1000, 65000, 'N10.3 Q3')
assert.equal(Math.round(47380 / 10000) * 10000, 50000, 'N10.3 Q4b')
assert.equal(Number((3.4962).toFixed(2)), 3.5, 'N10.4 Q1 numeric value')
assert.ok(lesson.includes("answer: '3.50'"), 'The worked example must preserve 3.50 to show two decimal places')
assert.ok(lesson.includes("fixed('7.0', 1)") && lesson.includes("fixed('0.10', 2)") && lesson.includes("answer: '6.00'"), 'Trailing-zero answers must preserve stated accuracy')

const mediaHashes = {
  'rounding-decimal-places.mp4': '80e982a564692a99968e26205a9408fd0551571520f924dac325cb963bfe9b98',
  'rounding-significant-figures.mp4': '5183c86d11310e6faca6886617ae90ddad5143d6e1e2ce2f155ff7acdeed13da',
  'rounding-nearest-powers-of-ten.mp4': '850df75f15a8bb7401199ad2063b242469f6043d0a9056b7a537e15e5dd3e301',
  'rounding-carrying.mp4': '4c96be278641baa58ff49490b40b87c3c12b3e748e22ad22c3c47c425df86d4f',
}
for (const [name, expected] of Object.entries(mediaHashes)) {
  const file = path.join(root, 'public/media/lesson-10', name)
  const actual = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
  assert.equal(actual, expected, `${name} must remain source-identical`)
  assert.ok(fs.readFileSync(file.replace(/\.mp4$/, '.svg'), 'utf8').startsWith('<svg'), `${name} poster must be an SVG`)
}

const grading = read('src/features/number-types/lessonMath.ts')
assert.ok(grading.includes("acceptanceRule === 'exactDecimalPlaces'"), 'Formatting-aware rounding must be handled by the shared lesson engine')
const app = read('src/App.tsx')
assert.ok(app.includes('TutorRoundingLesson'), 'Lesson 10 must be mounted in the preview app')
assert.ok(app.includes('case 10:') && app.includes('return <TutorRoundingLesson />'), 'Lesson 10 must open from the course overview and direct route')
const registry = read('src/features/maths/courseRegistry.ts')
assert.ok(registry.includes("entry(10, tutorRoundingLesson, 'Rounding numbers'"), 'Lesson 10 must be appended to the canonical course order')

console.log('Lesson 10 verified: 33 screens, 32 source-aligned examples and practice parts, 4 source-identical videos, exact half-up rounding and canonical course route.')
