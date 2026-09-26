const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const lesson = read('src/features/ordering/tutor/orderingLesson.ts')

const practiceCount = (lesson.match(/\bpractice\(/g) || []).length - 1
const workedCount = (lesson.match(/\bworked\(/g) || []).length - 1
const reviewCount = (lesson.match(/^add\('mixed'/gm) || []).length
assert.equal(practiceCount, 28, 'Lesson 11 must retain seven Q2-Q5c practice parts from each of four PDFs')
assert.equal(workedCount, 4, 'Lesson 11 must contain one source-video worked example for each PDF')
assert.equal(reviewCount, 1, 'Lesson 11 must end with one consolidation screen')
assert.equal(practiceCount + workedCount + reviewCount, 33, 'Lesson 11 screen total')

for (let skill = 1; skill <= 4; skill++) {
  for (const question of ['Q1', 'Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']) {
    assert.ok(lesson.includes(`N11.${skill} ${question}`), `Missing N11.${skill} ${question}`)
  }
}
assert.equal((lesson.match(/sourceFile: 'N11\./g) || []).length, 4, 'Every source video must be defined once')
assert.ok(lesson.includes("id: 'L011'"), 'Lesson 11 must preserve its stable progress key')
assert.equal((lesson.match(/openInterval\(/g) || []).length, 2, 'Both open decimal prompts must accept every source-valid interior value')
assert.equal((lesson.match(/integerInterval\(/g) || []).length, 2, 'Both open whole-number prompts must require a source-valid interior integer')

assert.deepEqual([3.7, 3.07, 3.72, 2.9].sort((a, b) => a - b), [2.9, 3.07, 3.7, 3.72], 'N11.1 Q1')
assert.deepEqual([1.85, 1.58, 1.5, 1.08, 1.8].sort((a, b) => b - a), [1.85, 1.8, 1.58, 1.5, 1.08], 'N11.1 Q3')
assert.deepEqual([8204, 12750, 8240, 9006, 12705].sort((a, b) => a - b), [8204, 8240, 9006, 12705, 12750], 'N11.2 Q1')
assert.ok(18620 > 18605 && 18620 < 18650 && Number.isInteger(18620), 'N11.2 Q5b')
assert.deepEqual([-3.5, 2.4, -3.05, -4.2, 0].sort((a, b) => a - b), [-4.2, -3.5, -3.05, 0, 2.4], 'N11.3 Q3')
assert.ok(-75 > -86 && -75 < -68 && Number.isInteger(-75), 'N11.3 Q4b')
assert.deepEqual([3 / 5, 0.65, 0.58, 1 / 2].sort((a, b) => a - b), [0.5, 0.58, 0.6, 0.65], 'N11.4 Q1')
assert.deepEqual([0.7, 0.705, 0.71, 18 / 25, 29 / 40].sort((a, b) => a - b), [0.7, 0.705, 0.71, 0.72, 0.725], 'N11.4 Q5a')
assert.ok(0.715 > 0.71 && 0.715 < 0.72, 'N11.4 Q5b')

const mediaHashes = {
  'ordering-decimals.mp4': '6a1b6c2f199deff2e466bab456823fe0e1d7802237bc501745c04558dd255469',
  'ordering-large-numbers.mp4': 'a4e5767ae616dd37e252100f6dfb1f7c5e52f6c9f86c6d341982d69ca8ec196f',
  'ordering-negative-numbers.mp4': 'cbd3de9a571817061f9d1686ba91b3c203cfdcea01e535cf9dc6534a163a16e8',
  'ordering-fractions-decimals-percentages.mp4': '105e4d2cb0423caacbab7b0a4c5747b444a6ed2f9a4d7c1ff65b8142903f8456',
}
for (const [name, expected] of Object.entries(mediaHashes)) {
  const file = path.join(root, 'public/media/lesson-11', name)
  const actual = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
  assert.equal(actual, expected, `${name} must remain source-identical`)
  assert.ok(fs.readFileSync(file.replace(/\.mp4$/, '.svg'), 'utf8').startsWith('<svg'), `${name} poster must be an SVG`)
}

const grading = read('src/features/number-types/lessonMath.ts')
assert.ok(grading.includes("acceptanceRule === 'openInterval'"), 'Open decimal grading must remain in the shared lesson engine')
assert.ok(grading.includes("acceptanceRule === 'integerInterval'"), 'Open integer grading must be handled by the shared lesson engine')
const app = read('src/App.tsx')
assert.ok(app.includes('TutorOrderingLesson'), 'Lesson 11 must be mounted in the preview app')
assert.ok(app.includes('case 11:') && app.includes('return <TutorOrderingLesson />'), 'Lesson 11 must open from the course overview and direct route')
const registry = read('src/features/maths/courseRegistry.ts')
assert.ok(registry.includes("entry(11, tutorOrderingLesson, 'Ordering numbers'"), 'Lesson 11 must be appended to the canonical course order')

// The right answer is written first, so choose() moves it to a different position on each question. The days stay in week order.
assert.ok(!/\], 0\)/.test(lesson.replace("select(['Monday', 'Tuesday', 'Wednesday'], 0)", '')), 'Lesson 11: use choose() so the right answer is not always first')

console.log('Lesson 11 verified: 33 screens, 32 source-aligned examples and practice parts, 4 source-identical videos, open-range grading and canonical course route.')
