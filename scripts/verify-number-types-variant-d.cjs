const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

const cache = new Map()
function loadTypeScript(filePath) {
  const resolved = path.resolve(filePath)
  if (cache.has(resolved)) return cache.get(resolved).exports
  const module = { exports: {} }
  cache.set(resolved, module)
  const source = fs.readFileSync(resolved, 'utf8')
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: resolved,
  }).outputText
  const localRequire = (request) => {
    if (!request.startsWith('.')) return require(request)
    const candidate = path.resolve(path.dirname(resolved), request)
    for (const suffix of ['.ts', '.tsx', '/index.ts', '/index.tsx']) {
      const target = candidate.endsWith('.ts') || candidate.endsWith('.tsx') ? candidate : candidate + suffix
      if (fs.existsSync(target)) return loadTypeScript(target)
    }
    return require(candidate)
  }
  new Function('require', 'module', 'exports', output)(localRequire, module, module.exports)
  return module.exports
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const root = path.resolve(__dirname, '..')
const { variantDLesson } = loadTypeScript(path.join(root, 'src/features/number-types/variant-d/variantDLesson.ts'))
const { checkAnswer } = loadTypeScript(path.join(root, 'src/features/number-types/lessonMath.ts'))
const states = variantDLesson.states
const ids = states.map(state => state.id)
const idSet = new Set(ids)

assert(states.length === 67, `Expected 67 Lesson 1 states, found ${states.length}`)
const clips = states.filter(state => state.component.type === 'lessonVideo')
assert(clips.length === 5, 'Lesson 1 must have one video per topic')
const videoView = fs.readFileSync(path.join(root, 'src/features/number-types/components/LessonVideoActivity.tsx'), 'utf8')
assert(!videoView.includes('Ani’s explanation') && !videoView.includes('clip.clarification') && !videoView.includes('<details'), 'All Lesson 1 video screens must omit the removed attribution, correction and summary UI')
for (const clip of clips) {
  assert(clip.interaction.type === 'continue', `${clip.id} must allow optional viewing`)
  const following = states[states.indexOf(clip) + 1]
  assert(clip.transition.onComplete === following.id, `${clip.id} must lead to its topic activity`)
  assert(clip.microSkillId === following.microSkillId, `${clip.id} has the wrong topic`)
  for (const asset of [clip.component.props.src, clip.component.props.poster]) {
    assert(fs.existsSync(path.join(root, 'public', asset)), `${clip.id} is missing ${asset}`)
  }
}
assert(idSet.size === states.length, 'Lesson 1 state IDs must be unique')
assert(ids.every(id => id.startsWith('D-')), 'Lesson 1 must not rejoin removed legacy states after the integer section')

for (const legacyPath of [
  'src/features/number-types/numberTypesLesson.ts',
  'src/features/number-types/variant-b/variantBLesson.ts',
  'src/features/number-types/variant-b/NestedNumberSets.tsx',
  'src/features/number-types/variant-b/SetNumberLine.tsx',
]) assert(!fs.existsSync(path.join(root, legacyPath)), `Removed Lesson 1 file still exists: ${legacyPath}`)

const appSource = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8')
assert(!appSource.includes('numberVariant'), 'Lesson 1 must not retain a variant selector state')
assert(!appSource.includes('Choose Lesson 1 variant'), 'Lesson 1 variant navigation must stay removed')
assert(!appSource.includes('Variant D'), 'Lesson 1 must not display the old variant name')
const viewSource = fs.readFileSync(path.join(root, 'src/features/number-types/NumberTypesLessonView.tsx'), 'utf8')
// Lesson 1 uses the shared rung frame (rung header with progress through this rung, check bar, rung complete)
assert(viewSource.includes('useRungFlow(lesson, engine, labels'), 'Lesson 1 must use the shared rung frame')
assert(viewSource.includes('<RungHeader') && viewSource.includes('<RungDoneCard'), 'Lesson 1 must show rung progress and the rung-complete card')
assert(viewSource.includes('<CheckBar'), 'Lesson 1 answers must use the bottom check bar')
const engineSource = fs.readFileSync(path.join(root, 'src/features/number-types/useLessonEngine.ts'), 'utf8')
assert(!engineSource.includes('targetIndex > furthestStateIndex'), 'Rungs are open: navigation must allow any screen')
assert(engineSource.includes('Math.max(current, targetIndex)'), 'Normal lesson progress must advance the furthest-reached boundary')
assert(!engineSource.includes('setFurthestStateIndex(0)'), 'Starting the lesson again must preserve reached progress sections')

const lockedOpening = [
  'D-I-01', 'D-I-02', 'D-I-03', 'D-I-04', 'D-I-05', 'D-I-06', 'D-I-07', 'D-I-08', 'D-I-09', 'D-I-10', 'D-I-11',
  'D-P-01', 'D-P-02', 'D-P-03', 'D-P-04', 'D-P-05', 'D-P-06', 'D-P-07',
]
const activityIds = states.filter(state => state.component.type !== 'lessonVideo').map(state => state.id)
assert(lockedOpening.every((id, index) => activityIds[index] === id), 'The existing integer/non-integer state order changed')

const sourceExercises = [
  'D-I-11', ...Array.from({ length: 7 }, (_, index) => `D-P-${String(index + 1).padStart(2, '0')}`),
  ...Array.from({ length: 8 }, (_, index) => `D-SI-${String(index + 4).padStart(2, '0')}`),
  ...Array.from({ length: 6 }, (_, index) => `D-R-${String(index + 3).padStart(2, '0')}`),
  ...Array.from({ length: 10 }, (_, index) => `D-IR-${String(index + 4).padStart(2, '0')}`),
  ...Array.from({ length: 8 }, (_, index) => `D-MF-${String(index + 5).padStart(2, '0')}`),
]
for (const id of sourceExercises) assert(idSet.has(id), `Missing source exercise state ${id}`)

const sourceQuestionTitles = {
  'D-I-11': 'Write down all the numbers from the list that are integers.',
  'D-P-01': 'Circle the number that is an integer.',
  'D-P-02': 'Write down all the numbers from the list that are not integers.',
  'D-P-03': 'Write down all the numbers from the list that are integers.',
  'D-P-04': 'Explain why √20 is not an integer.',
  'D-P-05': 'n is a number, and √n = 6. Is n an integer? Show how you know.',
  'D-P-06': 'Write down a non-integer that is between 6 and 7.',
  'D-P-07': 'Maya says: “The number exactly halfway between two integers is always a non-integer.” Is Maya correct? Give a reason for your answer.',
  'D-SI-04': 'Show that 64 is both a square number and a cube number.',
  'D-SI-05': 'Write down all the prime numbers between 20 and 30.',
  'D-SI-06': 'Explain why 51 is not a prime number.',
  'D-SI-07': 'A number is a square number, is odd, and lies between 30 and 50. Find the number, showing your method.',
  'D-SI-08': 'Write down the first three cube numbers.',
  'D-SI-09': 'Show that 12 is not a prime number by writing it as a product of prime factors.',
  'D-SI-10': 'State whether 1 is a prime number. Give a reason for your answer.',
  'D-SI-11': 'N is a two-digit number. N is a square number and a multiple of 5. Find N.',
  'D-R-03': 'Show that 0·45 is a rational number.',
  'D-R-04': 'Circle the number that is rational.',
  'D-R-05': 'Write the recurring decimal 0·7 as a fraction in its simplest form.',
  'D-R-06': 'Show that 5/8 is a rational number that can also be written as a terminating decimal.',
  'D-R-07': 'Convert the recurring decimal 0·18 (= 0·181818…) to a fraction.',
  'D-R-08': 'State whether every integer is a rational number. Give a reason for your answer.',
  'D-IR-04': 'Show that √20 is an irrational number.',
  'D-IR-05': 'Circle the number that is irrational.',
  'D-IR-06': 'Explain why √30 is irrational.',
  'D-IR-07': 'Show that √45 can be written in the form a√b, and explain why the result is still irrational.',
  'D-IR-08': 'Write down an irrational number that lies between 3 and 4.',
  'D-IR-09': 'Show that 4 + √13 is irrational.',
  'D-IR-10': 'State whether every square root is irrational. Give a reason for your answer.',
  'D-IR-11': 'Priya says this. Show that Priya is wrong. “Multiplying two irrational numbers always gives an irrational answer.”',
  'D-IR-12': 'Write down an irrational number that lies between 2 and 3.',
  'D-IR-13': 'Jack says this. Show that Jack is wrong. “If you add two irrational numbers, the answer is always irrational.”',
  'D-MF-05': 'List all the factors of 42.',
  'D-MF-06': 'Write down the first four multiples of 9.',
  'D-MF-07': 'Find the highest common factor of 24 and 36.',
  'D-MF-08': 'Find the lowest common multiple of 8 and 12.',
  'D-MF-09': 'Write down a common factor of 18 and 27, other than 1.',
  'D-MF-10': 'Two numbers both lie between 10 and 30, and their highest common factor is 6. Find one possible pair.',
  'D-MF-11': 'State whether every number is a factor of itself. Give a reason for your answer.',
  'D-MF-12': 'Tomas says this. Show that Tomas is wrong. “The LCM of two numbers is always bigger than both numbers.”',
}
for (const [id, expectedTitle] of Object.entries(sourceQuestionTitles)) {
  const state = states.find(candidate => candidate.id === id)
  assert(state.content.title === expectedTitle, `${id} source question wording changed`)
}

const primeCard = states.find(state => state.id === 'D-SI-05')
assert(primeCard.component.props.expression === '21, 22, 23, 24, 25, 26, 27, 28, 29', 'D-SI-05 number row must retain comma spacing')

const legacyPrimeExplorer = states.find(state => state.id === 'D-SI-03A')
assert(legacyPrimeExplorer.content.title === 'Explore prime numbers to 50', 'Legacy prime explorer title changed')
assert(legacyPrimeExplorer.content.body === 'There is no repeating pattern or magic shortcut for finding prime numbers. A prime number can only be divided exactly by 1 and itself—not by 2, 3 or another whole number, unless that number is the prime itself.', 'Legacy prime explorer body changed')
assert(legacyPrimeExplorer.content.prompt === 'Hover over or focus any number to see its factors. Prime numbers are highlighted.', 'Legacy prime explorer prompt changed')
assert(legacyPrimeExplorer.component.type === 'primeGrid', 'Legacy prime explorer must use the original prime grid')
assert(legacyPrimeExplorer.component.props.max === 50, 'Legacy prime explorer must display 1–50')
assert(JSON.stringify(legacyPrimeExplorer.component.props.highlightedPrimes) === JSON.stringify([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]), 'Legacy highlighted-prime set changed')
assert(!idSet.has('D-SI-03'), 'The superseded 6/7-counter prime screen must stay removed')

const squareTeaching = states.find(state => state.id === 'D-SI-01')
assert(squareTeaching.content.title === 'Square numbers', 'Square-number heading changed')
assert(squareTeaching.content.body === 'A number multiplied by itself is a square number.', 'Square-number definition changed')
const cubeTeaching = states.find(state => state.id === 'D-SI-02')
assert(cubeTeaching.content.title === 'Cube numbers', 'Cube-number heading changed')
assert(cubeTeaching.content.body === 'A number multiplied by itself three times is a cube number.', 'Cube-number definition changed')

assert(primeCard.component.props.revealLines === undefined, 'D-SI-05 must not reveal calculations in the green card')
assert(JSON.stringify(primeCard.feedback.correct.workedExplanation.steps[0].lines) === JSON.stringify([
  '21 = 3 × 7', '22 = 2 × 11', '24 = 2 × 12', '25 = 5 × 5', '26 = 2 × 13', '27 = 3 × 9', '28 = 2 × 14',
]), 'D-SI-05 composite checks must stay on separate explanation lines')
const cubeQuestion = states.find(state => state.id === 'D-SI-08')
assert(JSON.stringify(cubeQuestion.feedback.correct.workedExplanation.steps[0].lines) === JSON.stringify([
  '1 × 1 × 1 = 1', '2 × 2 × 2 = 8', '3 × 3 × 3 = 27',
]), 'D-SI-08 cube calculations must stay on separate explanation lines')

const rationalChoice = states.find(state => state.id === 'D-R-04')
assert(rationalChoice.component.props.expression === 'π,  √10,  0·6,  √12', 'D-R-04 values must retain comma spacing')
assert(rationalChoice.interaction.correctAnswer === '0·6', 'D-R-04 must use the plain recurring-decimal display')
assert(!JSON.stringify(states).includes('̇'), 'Lesson 1 must not display recurring overdot marks')

const irrationalThreeToFour = states.find(state => state.id === 'D-IR-08')
assert(irrationalThreeToFour.feedback.correct.workedExplanation.steps[0].lines.length === 8, 'D-IR-08 must explain every answer option on a separate line')
const irrationalTwoToThree = states.find(state => state.id === 'D-IR-12')
assert(irrationalTwoToThree.feedback.correct.workedExplanation.steps[0].lines.length === 6, 'D-IR-12 must explain every answer option on a separate line')

for (const state of states.filter(candidate => candidate.id.startsWith('D-') && candidate.feedback?.correct?.workedExplanation)) {
  for (const step of state.feedback.correct.workedExplanation.steps) {
    for (const line of step.lines) assert(!line.includes(' · '), `${state.id} still compresses explanation calculations with a centred dot`)
  }
}
const conceptVisualSource = fs.readFileSync(path.join(root, 'src/features/number-types/variant-d/VariantDConceptVisual.tsx'), 'utf8')
assert(!conceptVisualSource.includes("join(' · ')"), 'Lesson 1 teaching visuals must not join calculations with centred dots')

const lineByLineExpectations = {
  'D-I-07': 4,
  'D-P-01': 4,
  'D-P-02': 5,
  'D-P-03': 5,
  'D-R-07': 6,
  'D-IR-04': 7,
  'D-IR-06': 7,
  'D-IR-07': 7,
  'D-IR-09': 8,
  'D-MF-05': 4,
  'D-MF-07': 4,
  'D-MF-08': 3,
}
for (const [id, expectedLineCount] of Object.entries(lineByLineExpectations)) {
  const state = states.find(candidate => candidate.id === id)
  const actualLineCount = state.feedback.correct.workedExplanation.steps.reduce((total, step) => total + step.lines.length, 0)
  assert(actualLineCount === expectedLineCount, `${id} must retain ${expectedLineCount} separate explanation lines; found ${actualLineCount}`)
}

for (const state of states) {
  const transition = state.transition || {}
  for (const target of Object.values(transition)) assert(idSet.has(target), `${state.id} points to missing state ${target}`)
  if (state.interaction.type === 'continue') continue
  assert(state.interaction.correctAnswer !== undefined, `${state.id} has no correct answer`)
  assert(state.feedback?.correct?.workedExplanation, `${state.id} has no correct worked explanation`)
  assert(state.feedback?.incorrect?.workedExplanation, `${state.id} has no incorrect worked explanation`)
  assert(transition.onCorrect === transition.onIncorrect || state.id === ids.at(-1), `${state.id} has different correct/incorrect routes`)

  const expected = state.interaction.correctAnswer
  if (state.interaction.acceptanceRule === 'oneOf' && Array.isArray(expected)) {
    for (const accepted of expected) assert(checkAnswer(state.interaction, accepted), `${state.id} rejects accepted answer ${accepted}`)
  } else {
    assert(checkAnswer(state.interaction, expected), `${state.id} rejects its configured correct answer`)
  }
  if (state.interaction.type === 'multiSelect' && Array.isArray(expected) && expected.length > 1) {
    assert(!checkAnswer(state.interaction, expected.slice(0, -1)), `${state.id} accepts an incomplete multi-selection`)
  }
}

const visited = new Set()
let current = states[0]
while (current && !visited.has(current.id)) {
  visited.add(current.id)
  const target = current.interaction.type === 'continue' ? current.transition.onComplete : current.transition.onCorrect
  current = target ? states.find(state => state.id === target) : undefined
}
assert(visited.size === states.length, `Only ${visited.size} of ${states.length} states are reachable on the correct route`)

const pairState = states.find(state => state.id === 'D-MF-10')
assert(checkAnswer(pairState.interaction, '12 and 18'), 'Corrected HCF task must accept 12 and 18')
assert(checkAnswer(pairState.interaction, '18 and 24'), 'Corrected HCF task must accept 18 and 24')
assert(!checkAnswer(pairState.interaction, '12 and 24'), 'Corrected HCF task must reject 12 and 24')

console.log(`Lesson 1 verification passed: ${states.length} states, ${sourceExercises.length} source exercises, all routes reachable.`)
