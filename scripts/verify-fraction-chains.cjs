// Checks every step chain in Lesson 8 (worked examples and "See the working" panels):
// terms that merge must come from the line above, keys are unique on a line, every line renders
// in KaTeX, each step has an operation and a why, no term is crossed out, and the chain ends on
// the value it started with.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const Module = require('node:module')

const root = path.resolve(__dirname, '..')
const ts = require(path.join(root, 'node_modules/typescript'))
const katex = require(path.join(root, 'node_modules/katex'))

// Load the TypeScript lesson directly, as the other verify scripts read its source.
const resolve = Module._resolveFilename
Module._resolveFilename = function (request, parent, ...rest) {
  try { return resolve.call(this, request, parent, ...rest) } catch (error) {
    for (const ext of ['.ts', '.tsx']) { try { return resolve.call(this, request + ext, parent, ...rest) } catch {} }
    throw error
  }
}
for (const ext of ['.ts', '.tsx']) {
  require.extensions[ext] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: 1, target: 99, jsx: 4, esModuleInterop: true } }).outputText, file)
}
require.extensions['.css'] = () => {}

const { tutorFractionsLesson } = require(path.join(root, 'src/features/fractions/tutor/fractionsLesson.ts'))
const TERM = /\[\[([\w-]+):(.*?)\]\]/g
const keysOf = line => [...line.matchAll(TERM)].map(match => match[1])
const latexOf = line => line.replace(TERM, (_, key, body) => `\\htmlData{k=${key}}{${body}}`)
/** The value of a line of working: fractions, mixed numbers, + − × ÷, "of" and £. */
function valueOf(line) {
  const expression = line.replace(TERM, '$2').replace(/^\s*=\s*/, '')
    .replace(/(\d+)\s*\\frac\{(\d+)\}\{(\d+)\}/g, '($1+$2/$3)')
    .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\text\{ of \}/g, '*').replace(/\\pounds/g, '')
  assert.match(expression, /^[\d\s+\-*/().]+$/, `Cannot evaluate ${expression}`)
  return Function(`return (${expression})`)()
}

const workings = []
for (const state of tutorFractionsLesson.states) {
  for (const visual of [state.visual, state.working]) if (visual?.kind === 'fraction-worked') workings.push([state.id, visual])
}

let steps = 0, answers = 0
for (const [id, working] of workings) {
  assert.ok(working.chain?.length > 1, `${id}: every fraction working needs a step chain`)
  // An HCF or LCM step shows lists, not a line: its lists must be the real factors or multiples, the boxed number the
  // highest common factor or lowest common multiple, and the step right after it must use that number.
  working.chain.forEach((step, index) => {
    if (!step.lists) return
    const label = `${id} line ${index + 1}`
    assert.ok(!step.line && (step.op === 'Find the HCF' || step.op === 'Find the LCM'), `${label}: a list step has no line`)
    assert.ok(!/=|\d\s*[×÷+−-]\s*\d/.test(step.why), `${label}: the ⓘ is words (${step.why})`)
    const ns = step.lists.map(list => Number(list.label.split(' ').pop()))
    const pick = step.lists[0].pick
    for (const [i, list] of step.lists.entries()) {
      const n = ns[i]
      const expected = step.op === 'Find the HCF' ? Array.from({ length: n }, (_, k) => k + 1).filter(f => n % f === 0) : Array.from({ length: pick / n }, (_, k) => n * (k + 1))
      assert.deepEqual(list.values, expected, `${label}: ${list.label}`)
      assert.equal(list.pick, pick, `${label}: one boxed number`)
    }
    const gcd = (a, b) => b ? gcd(b, a % b) : a
    const want = step.op === 'Find the HCF' ? gcd(ns[0], ns[1]) : ns.reduce((a, b) => a * b / gcd(a, b))
    assert.equal(pick, want, `${label}: ${step.op} is ${want}`)
    assert.ok(working.chain[index + 1].line.includes(step.op === 'Find the HCF' ? `\\div ${pick}` : String(pick)) || (working.chain[index + 1].note ?? []).some(note => note.startsWith(`${pick} ÷`)), `${label}: the next step uses ${pick}`)
  })
  const chain = working.chain.filter(step => !step.lists)
  chain.forEach((step, index) => {
    const label = `${id} line ${index + 1}`
    const keys = keysOf(step.line)
    assert.equal(new Set(keys).size, keys.length, `${label}: keys must be unique on a line (${keys})`)
    katex.renderToString(`\\displaystyle ${latexOf(step.line)}`, { throwOnError: true, strict: 'ignore', trust: context => context.command === '\\htmlData' })
    if (index === 0) return
    steps++
    assert.ok(step.op && step.why, `${label}: every step needs an operation and a why`)
    // The ⓘ is words, not maths (src/features/EXPLANATIONS.md): the sums are on the lines and in the notes.
    assert.ok(!/=|\d\s*[×÷+−-]\s*\d/.test(step.why), `${label}: the ⓘ is words (${step.why})`)
    assert.ok(step.op === 'Work out' || step.op.split(' ').length <= 4, `${label}: short heading (${step.op})`)
    for (const note of step.note ?? []) {
      const [sum, result] = note.split(' → ')
      const whole = /^(\d+) ÷ (\d+)$/.exec(sum), remainder = /^(\d+) r (\d+)$/.exec(result ?? '')
      if (whole && remainder) assert.ok(Math.floor(whole[1] / whole[2]) === Number(remainder[1]) && whole[1] % whole[2] === Number(remainder[2]), `${label}: ${note}`)
      else assert.equal(Function(`return ${sum.replace(/×/g, '*').replace(/÷/g, '/')}`)(), Number(result), `${label}: ${note}`)
    }
    const above = new Set(keysOf(chain[index - 1].line))
    for (const key of step.fresh ?? []) assert.ok(keys.includes(key), `${label}: the purple number ${key} is on the step's line`)
    // A boxed mixed number must be on the line above: the whole number's key, followed by its fraction.
    for (const key of step.focus ?? []) assert.ok(new RegExp(`\\[\\[${key}:\\d+\\]\\]\\\\frac`).test(chain[index - 1].line), `${label}: focus ${key} is a mixed number on the line above`)
    for (const [result, sources] of Object.entries(step.merge ?? {})) {
      assert.ok(keys.includes(result), `${label}: merge result ${result} is not on the line`)
      for (const source of sources) assert.ok(above.has(source), `${label}: merge source ${source} is not on the line above`)
    }
    // Nothing in a fraction calculation cancels to nothing: a term that leaves must combine into a result,
    // otherwise the step chain crosses it out in red.
    const merged = new Set(Object.values(step.merge ?? {}).flat())
    for (const key of above) assert.ok(keys.includes(key) || merged.has(key), `${label}: ${key} leaves without combining into anything, so it would be crossed out`)
  })
  // Every chain is one calculation, so it must end on the value it started with.
  const start = valueOf(chain[0].line), end = valueOf(chain.at(-1).line)
  assert.ok(Math.abs(start - end) < 1e-9, `${id}: chain starts at ${start} but ends at ${end}`)
  answers++
}

console.log(`Lesson 8 step chains verified: ${workings.length} chains, ${steps} steps, every move explained and every chain ending on its answer.`)
