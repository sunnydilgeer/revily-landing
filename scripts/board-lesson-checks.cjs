// Shared checks for the board lessons built with boardWorkings.ts: Simultaneous equations (lesson 27, A12) and
// Proof (lesson 28, A13). Every board row is turned into JavaScript and both sides are worked out, so a row that
// doesn't balance, a wrong answer or a working that shows the answer early fails the build.
const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')

/** A board side as JavaScript over a scope `s`: marks are only colour; ÷ and × act on the side so far; 2n is 2 × n. */
function js(side) {
  let out = side.replace(/[~^[\]]/g, '').replace(/[−–]/g, '-').replace(/°/g, '').replace(/×/g, '*').replace(/²/g, '@').replace(/\s+/g, '')
  out = out.replace(/÷(-?[\d.]+)/g, '/($1)')
  out = out.replace(/([\d.a-z)@])(?=[a-z(])/g, '$1*')
  out = out.replace(/@/g, '**2').replace(/(^|\()-/g, '$10-')
  return out.replace(/[a-z]/g, letter => `s.${letter}`)
}
const evaluate = (side, scope) => Function('s', `return (${js(side)})`)(scope)
const close = (a, b) => Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(a), Math.abs(b))

/** The board of a state's working: its last step's rows. */
const boardOf = state => (state.working ?? state.visual)?.examples?.[0]?.steps.at(-1).frame.equation?.rows ?? []

/**
 * Every row with two sides balances in every scope `scopes()` gives: a solution for an equation, many random values
 * for an identity. A row with an empty left side carries on from the last left side written.
 */
function checkRows(label, rows, scopes) {
  let checked = 0
  for (const scope of scopes()) {
    let left = null
    for (const row of rows) {
      if (!('left' in row)) continue
      if (row.left) left = row.left
      assert.ok(left, `${label}: a row carries on from nothing`)
      const l = evaluate(left, scope), r = evaluate(row.right, scope)
      assert.ok(Number.isFinite(l) && Number.isFinite(r), `${label}: ${left} = ${row.right} works out`)
      assert.ok(close(l, r), `${label}: ${left} ${row.sign ?? '='} ${row.right} should balance at ${JSON.stringify(scope)} (${l} and ${r})`)
      checked++
    }
  }
  return checked
}

/** Random values for every letter, for identities. */
function randomScopes(count = 12, extra = scope => scope) {
  let seed = 7
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
  return () => Array.from({ length: count }, () => {
    const scope = {}
    for (const letter of 'abcdefghijklmnopqrstuvwxyz') scope[letter] = Math.round((random() * 20 - 10) * 4) / 4 || 0.5
    return extra(scope)
  })
}

function checkStructure(lesson, { id, number, rungs, code, parts, pdfs = rungs.map((_, i) => `${code}.${i + 1}`) }) {
  const states = lesson.states
  assert.equal(lesson.id, id, `${code} keeps the stable progress key ${id}`)
  assert.deepEqual([...new Set(states.map(state => state.microSkillId))], [...rungs, 'mixed'], 'Rungs easiest first, in the PDFs’ order, then Review')
  states.forEach((state, index) => {
    assert.equal(state.id, `L${number}-${String(index + 1).padStart(2, '0')}`)
    assert.equal(state.transition.onComplete, states[index + 1]?.id)
    if (state.interaction.type !== 'continue') {
      assert.ok(state.hint?.trim(), `${state.id} needs a hint`)
      assert.ok(state.working?.kind === 'method-worked' && state.working.examples.every(example => example.pictureOnly), `${state.id} needs a picture-only working`)
    }
  })
  const at = ref => states.find(state => state.sourceRef === ref)
  rungs.forEach((rung, i) => {
    const pdf = pdfs[i], first = states.find(state => state.microSkillId === rung)
    assert.ok(first.video && first.sourceRef === `${pdf} video + Q1`, `${pdf}'s rung opens with its video and Q1`)
    for (const question of parts) {
      const covered = at(`${pdf} ${question}`)
      assert.ok(covered, `Missing ${pdf} ${question}`)
      assert.equal(covered.microSkillId, rung, `${pdf} ${question} is in its rung`)
    }
  })
  return at
}

/** Choices: the right one first, every wrong one with its own message. Typed answers: diagnose stays quiet on the right answer. */
function checkInteractions(states, checkAnswer) {
  let choices = 0
  for (const state of states.filter(state => state.interaction.type === 'select')) {
    const wrong = state.interaction.options.filter(option => option.id !== '0')
    assert.ok(wrong.length >= 2 && wrong.every(option => option.feedback?.trim()), `${state.id}: each wrong option needs its own message`)
    assert.ok(checkAnswer(state.interaction, '0') && !checkAnswer(state.interaction, '1'), `${state.id}: the first option is right`)
    choices++
  }
  for (const state of states.filter(state => state.interaction.type === 'numericInput')) {
    const { interaction } = state
    assert.ok(checkAnswer(interaction, String(interaction.correctAnswer)), `${state.id}: its own answer ${interaction.correctAnswer} is marked right`)
    if (interaction.responseShape === 'expression') assert.ok(checkAnswer(interaction, interaction.displayAnswer), `${state.id}: ${interaction.displayAnswer} as shown is marked right`)
    if (state.diagnose) assert.equal(state.diagnose(String(interaction.correctAnswer)), null, `${state.id} stays silent on the right answer`)
  }
  return choices
}

/** One move a step: short headings, ⓘ in words, the answer once in the last step, finished rows greyed but never the answer. */
function checkWorkings(states) {
  const React = require('react')
  const { renderToStaticMarkup } = require('react-dom/server')
  const { EquationVisual } = require('../src/features/written-methods/tutor/EquationPictures.tsx')
  const { AngleVisual } = require('../src/features/written-methods/tutor/AnglePictures.tsx')
  let steps = 0, pictures = 0
  for (const state of states) {
    const working = state.working ?? (state.visual?.kind === 'method-worked' ? state.visual : null)
    if (!working) continue
    const example = working.examples[0], list = example.steps
    assert.ok(example.focus, `${state.id}: finished working greys out`)
    list.forEach((step, i) => {
      assert.ok(step.title.trim() && step.title.split(' ').length <= 9, `${state.id}: "${step.title}" is a short heading`)
      assert.ok(step.instruction.trim(), `${state.id}: "${step.title}" needs its ⓘ words`)
      assert.ok(!/^the answer$/i.test(step.title), `${state.id}: no separate answer step`)
      const rows = step.frame.equation.rows
      const hasAnswer = rows.some(row => 'answer' in row)
      assert.equal(hasAnswer, i === list.length - 1, `${state.id} step ${i + 1}: the answer comes once, in the last step`)
      const newFrom = list[i - 1]?.frame.equation.rows.length ?? step.frame.equation.given ?? 1
      const html = renderToStaticMarkup(React.createElement(EquationVisual, { frame: step.frame.equation, newFrom, focus: true }))
      // Only rows above the one this step works on grey out; a row with a boxed part is being used, so stays clear.
      assert.ok((html.match(/is-done/g) ?? []).length <= Math.max(0, newFrom - 1), `${state.id} step ${i + 1}: only finished rows grey out`)
      assert.ok(!/ns-eq__answer[^"]*is-done/.test(html), `${state.id} step ${i + 1}: the answer stays clear`)
      if (step.frame.angles) {
        const svg = renderToStaticMarkup(React.createElement(AngleVisual, { frame: step.frame.angles }))
        // Everything in the picture stays inside it: every point drawn is within the 320 × 210 box.
        const numbers = [...svg.matchAll(/ d="([^"]*)"/g)].flatMap(m => m[1].match(/-?[\d.]+/g).map(Number))
        assert.ok(numbers.every(n => n >= -0.5 && n <= 320.5), `${state.id} step ${i + 1}: the angle picture stays inside its box`)
        for (const [, x, y] of svg.matchAll(/<text x="([-\d.]+)" y="([-\d.]+)"/g)) assert.ok(x >= 12 && x <= 308 && y >= 14 && y <= 200, `${state.id} step ${i + 1}: label at ${x}, ${y} sits inside the picture`)
        pictures++
      }
      steps++
    })
  }
  return { steps, pictures }
}

function checkVideos(states, folder, hashes) {
  assert.equal(states.filter(state => state.video).length, Object.keys(hashes).length, 'One video per source PDF')
  for (const [name, expected] of Object.entries(hashes)) {
    const file = path.join(root, 'public/media', folder, name)
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'), expected, `${name} must stay as checked`)
    assert.ok(fs.readFileSync(file.replace(/\.mp4$/, '.svg'), 'utf8').startsWith('<svg'), `${name} poster must be an SVG`)
    assert.ok(states.some(state => state.video?.src === `/media/${folder}/${name}`), `${name} must be used`)
  }
}

function checkCourse(number, code, view, chapter = 'algebra') {
  const { mathsLessons, lessonCode } = require('../src/features/maths/courseRegistry.ts')
  const entry = mathsLessons.find(lesson => lesson.number === number)
  assert.equal(entry.chapterId, chapter)
  assert.equal(lessonCode(entry), code, `Students see lesson ${number} as ${code}`)
  const app = read('src/App.tsx')
  assert.ok(app.includes(`case ${number}:`) && app.includes(`return <${view} />`), `Lesson ${number} must open from the course and its direct route`)
  assert.ok(read('src/features/cards/keyFacts.ts').includes(`  ${number}: {`), `${code} needs key-fact cards`)
}

module.exports = { assert, evaluate, close, boardOf, checkRows, randomScopes, checkStructure, checkInteractions, checkWorkings, checkVideos, checkCourse }
