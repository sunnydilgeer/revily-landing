const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const lessonPath = path.join(root, 'src/features/fractions/tutor/fractionsLesson.ts')
const lesson = fs.readFileSync(lessonPath, 'utf8')

const practiceCount = (lesson.match(/\bpractice\(/g) || []).length - 1
const workedCount = (lesson.match(/\bworked\(/g) || []).length - 1
const reviewCount = (lesson.match(/^add\('mixed'/gm) || []).length
assert.equal(practiceCount, 56, 'Lesson 8 must retain seven Q2-Q5c practice parts from each of eight PDFs')
assert.equal(workedCount, 15, 'Lesson 8 must contain eight video examples and seven separate PDF Q1 examples')
assert.equal(reviewCount, 1, 'Lesson 8 must end with one consolidation screen')
assert.equal(practiceCount + workedCount + reviewCount, 72, 'Lesson 8 screen total')

for (let skill = 1; skill <= 8; skill++) {
  for (const question of ['Q1', 'Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']) {
    assert.ok(lesson.includes(`N8.${skill} ${question}`), `Missing N8.${skill} ${question}`)
  }
}
assert.equal((lesson.match(/sourceFile: 'N8\./g) || []).length, 8, 'Every source video must be defined once')
assert.ok(lesson.includes('requiredDenominator,'), 'Equivalent-fraction grading must preserve the requested denominator')
assert.ok(!lesson.includes('KEEP · FLIP · CHANGE'), 'Do not reproduce the inconsistent division mnemonic in app teaching')

const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a)
const reduce = (n, d) => { const factor = gcd(n, d); return [n / factor, d / factor] }
const equal = (a, b) => a[0] * b[1] === b[0] * a[1]
const add = (...values) => {
  let [n, d] = values[0]
  for (const [nextN, nextD] of values.slice(1)) { n = n * nextD + nextN * d; d *= nextD; [n, d] = reduce(n, d) }
  return [n, d]
}
const subtract = (a, b) => reduce(a[0] * b[1] - b[0] * a[1], a[1] * b[1])
const multiply = (a, b) => reduce(a[0] * b[0], a[1] * b[1])
const divide = (a, b) => reduce(a[0] * b[1], a[1] * b[0])
const mixed = (whole, n, d) => [whole * d + n, d]
const check = (label, actual, expected) => assert.ok(equal(actual, expected), `${label}: ${actual.join('/')} is not ${expected.join('/')}`);

[
  ['N8.1 Q1', [18, 24], [3, 4]], ['N8.1 Q2', [10, 15], [2, 3]], ['N8.1 Q3', [42, 56], [3, 4]],
  ['N8.1 Q4a', [28, 70], [2, 5]], ['N8.1 Q4b', [36, 48], [3, 4]], ['N8.1 Q5a', [90, 135], [2, 3]], ['N8.1 Q5c', [51, 85], [3, 5]],
].forEach(([label, actual, expected]) => check(label, reduce(...actual), expected))
assert.equal(5 * (96 / 8), 60, 'N8.1 Q5b')

check('N8.2 Q1', mixed(4, 2, 5), [22, 5]); check('N8.2 Q2', [17, 6], mixed(2, 5, 6)); check('N8.2 Q3', mixed(6, 3, 8), [51, 8])
check('N8.2 Q4a', [29, 4], mixed(7, 1, 4)); check('N8.2 Q4b', mixed(3, 5, 8), [29, 8]); check('N8.2 Q5a', [47, 6], mixed(7, 5, 6))
check('N8.2 Q5b', mixed(8, 3, 4), [35, 4]); check('N8.2 Q5c', mixed(7, 2, 5), [37, 5])

check('N8.3 Q1', add([1, 3], [1, 4]), [7, 12]); check('N8.3 Q2', add([2, 9], [4, 9]), [2, 3]); check('N8.3 Q3', add([3, 8], [1, 6]), [13, 24])
check('N8.3 Q4a', add([2, 5], [1, 10]), [1, 2]); check('N8.3 Q4b', add([5, 6], [3, 4]), mixed(1, 7, 12)); check('N8.3 Q5a', add([7, 9], [5, 12]), mixed(1, 7, 36)); check('N8.3 Q5b', add([1, 2], [1, 3], [1, 6]), [1, 1])
check('N8.4 Q1', subtract([5, 6], [1, 4]), [7, 12]); check('N8.4 Q2', subtract([7, 8], [3, 8]), [1, 2]); check('N8.4 Q3', subtract([7, 9], [2, 3]), [1, 9])
check('N8.4 Q4a', subtract([11, 12], [1, 4]), [2, 3]); check('N8.4 Q4b', subtract([2, 1], [5, 8]), mixed(1, 3, 8)); check('N8.4 Q5a', subtract([5, 6], [3, 8]), [11, 24]); check('N8.4 Q5b', subtract([7, 10], [1, 4]), [9, 20])
check('N8.5 Q1', multiply([2, 3], [4, 5]), [8, 15]); check('N8.5 Q2', multiply([1, 4], [2, 3]), [1, 6]); check('N8.5 Q3', multiply([3, 5], [5, 9]), [1, 3])
check('N8.5 Q4a', multiply([2, 7], [7, 8]), [1, 4]); check('N8.5 Q4b', multiply([5, 6], [9, 10]), [3, 4]); check('N8.5 Q5a', multiply([4, 9], [3, 8]), [1, 6]); check('N8.5 Q5b', multiply([5, 12], [8, 15]), [2, 9])
check('N8.6 Q1', divide([3, 4], [2, 5]), mixed(1, 7, 8)); check('N8.6 Q2', divide([1, 3], [2, 5]), [5, 6]); check('N8.6 Q3', divide([5, 8], [3, 4]), [5, 6])
check('N8.6 Q4a', divide([2, 9], [4, 9]), [1, 2]); check('N8.6 Q4b', divide([7, 10], [3, 5]), mixed(1, 1, 6)); check('N8.6 Q5a', divide([5, 6], [5, 9]), mixed(1, 1, 2)); check('N8.6 Q5b', divide([2, 5], [6, 25]), mixed(1, 2, 3)); check('N8.6 Q5c', divide([3, 4], [3, 2]), [1, 2])
check('N8.7 Q1', multiply(mixed(2, 3, 5), mixed(1, 1, 2)), mixed(3, 9, 10)); check('N8.7 Q2', multiply(mixed(1, 1, 4), [2, 1]), mixed(2, 1, 2)); check('N8.7 Q3', divide(mixed(3, 1, 3), mixed(1, 2, 3)), [2, 1])
check('N8.7 Q4a', multiply(mixed(2, 1, 2), mixed(1, 1, 5)), [3, 1]); check('N8.7 Q4b', divide(mixed(4, 1, 4), mixed(1, 1, 2)), mixed(2, 5, 6)); check('N8.7 Q5a', multiply(mixed(3, 2, 5), mixed(2, 1, 2)), mixed(8, 1, 2)); check('N8.7 Q5b', divide(mixed(5, 1, 3), mixed(2, 2, 3)), [2, 1]); check('N8.7 Q5c', multiply(mixed(2, 1, 2), mixed(1, 1, 3)), mixed(3, 1, 3))

const amountChecks = [[1, 4, 48, 12], [5, 8, 96, 60], [3, 7, 147, 63], [2, 3, 96, 64], [7, 12, 360, 210], [5, 9, 126, 70], [3, 4, 48, 36]]
amountChecks.forEach(([n, d, amount, expected]) => assert.equal(amount / d * n, expected, `Fraction of amount ${n}/${d} of ${amount}`))

const mediaHashes = {
  'adding-fractions.mp4': '9048116816d5a3f9db3b57fe004122a4f25dd58328b31e717da41adfb6a34e71',
  'dividing-fractions.mp4': 'bfe912ba9e91a399c5c626a641ca85f6e55d1a25eb05dda19186ef6b9f2977fe',
  'fractions-of-amounts.mp4': '36422b82d9b97d0ba3585556304fca4f1bc0874758f4c2899a4639d9664392b6',
  'mixed-fraction-calculations.mp4': 'c16839f4dd51dac88d2b9ca75fc83f66618396829a571069a60400300b8daaba',
  'mixed-improper-fractions.mp4': '5c8b5d5e1fd5d1861942e78a870a66c697207488c69fbf5aa676328c7ca4a778',
  'multiplying-fractions.mp4': '99b8451a74b980c855a36c579603179c2e9a173ed2f277adb3f90a308d65cc49',
  'simplifying-fractions.mp4': '9a78858da418f64018c1821a8a9ba92ca45692e067333d42cd0f66ea79141179',
  'subtracting-fractions.mp4': '9a9538a8c1d4d86a4b29fd306d7f3b61c0ab6b2820247c2628652e4be1bd2805',
}
for (const [name, expected] of Object.entries(mediaHashes)) {
  const file = path.join(root, 'public/media/lesson-8', name)
  const actual = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
  assert.equal(actual, expected, `${name} must remain source-identical`)
  const poster = fs.readFileSync(file.replace(/\.mp4$/, '.jpg'))
  assert.deepEqual([...poster.subarray(0, 3)], [0xff, 0xd8, 0xff], `${name} poster must be a JPEG`)
}

const app = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8')
assert.ok(app.includes('TutorFractionsLesson'), 'Lesson 8 must be mounted in the preview app')
assert.ok(app.includes('case 8:') && app.includes('return <TutorFractionsLesson />'), 'Lesson 8 must open from the course overview and direct route')
const registry = fs.readFileSync(path.join(root, 'src/features/maths/courseRegistry.ts'), 'utf8')
assert.ok(registry.includes("entry(8, tutorFractionsLesson, 'Fractions'"), 'Lesson 8 must remain in the canonical course order')

console.log('Lesson 8 verified: 72 screens, 56 source practice parts, 15 worked/video screens, 8 source-identical videos, exact arithmetic and canonical course route.')
