// Checks the step chain behind every worked example in lessons 4-13 (the teaching screens and the
// "See the working" panels): every line renders in KaTeX, every step has an operation and a why,
// keys are unique on a line, and terms that merge come from the line above.
// Lesson 8's chains have their own stricter check: verify-fraction-chains.cjs.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const Module = require('node:module')

const root = path.resolve(__dirname, '..')
const ts = require(path.join(root, 'node_modules/typescript'))
const katex = require(path.join(root, 'node_modules/katex'))

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

const { mathsLessons } = require(path.join(root, 'src/features/maths/courseRegistry.ts'))
const { methodChain } = require(path.join(root, 'src/features/written-methods/tutor/methodChain.ts'))
const { chainFromSteps } = require(path.join(root, 'src/features/maths/step-chain/fromSteps.ts'))

const TERM = /\[\[([\w-]+):(.*?)\]\]/g
const keysOf = line => [...line.matchAll(TERM)].map(match => match[1])
const latexOf = line => line.replace(TERM, (_, key, body) => `\\htmlData{k=${key}}{${body}}`)

const { checkStepWorking } = require('./step-working-check.cjs')
function chainOf(visual) {
  if (visual.kind === 'method-worked') return methodChain(visual)
  // An HCF or LCM step shows factor or multiple lists rather than a line (verify-fraction-chains checks them).
  if (visual.kind === 'fraction-worked') return visual.chain.filter(step => !step.lists)
  if (visual.kind === 'conversion-worked') return chainFromSteps(visual.expression, visual.steps)
  return null
}

const totals = []
for (const lesson of mathsLessons.filter(entry => entry.number >= 4)) {
  let chains = 0, steps = 0
  for (const state of lesson.definition.states) {
    for (const visual of [state.visual, state.working]) {
      if (!visual) continue
      // Step workings are drawn one move a step with no chain; they have their own check (step-working-check.cjs).
      if (visual.kind === 'step-worked') { checkStepWorking(visual, `L${lesson.number} ${state.id}`); chains++; continue }
      const chain = chainOf(visual)
      if (!chain) continue
      chains++
      chain.forEach((step, index) => {
        const label = `L${lesson.number} ${state.id} line ${index + 1}`
        const keys = keysOf(step.line)
        assert.ok(step.line.trim(), `${label}: empty line`)
        assert.equal(new Set(keys).size, keys.length, `${label}: keys must be unique on a line (${keys})`)
        katex.renderToString(`\\displaystyle ${latexOf(step.line)}`, { throwOnError: true, strict: 'ignore', trust: context => context.command === '\\htmlData' })
        if (index === 0) return
        steps++
        assert.ok(step.op?.trim() && step.why?.trim(), `${label}: every step needs an operation and a why`)
        const above = new Set(keysOf(chain[index - 1].line))
        for (const [result, sources] of Object.entries(step.merge ?? {})) {
          assert.ok(keys.includes(result), `${label}: merge result ${result} is not on the line`)
          for (const source of sources) assert.ok(above.has(source), `${label}: merge source ${source} is not on the line above`)
        }
        if (step.at) {
          const example = visual.examples[step.at.example ?? 0]
          assert.ok(example && step.at.step < example.steps.length, `${label}: picture points at a step that does not exist`)
        }
      })
    }
  }
  assert.ok(chains > 0, `Lesson ${lesson.number} has no worked examples`)
  totals.push(`L${lesson.number} ${chains} chains/${steps} steps`)
}
console.log(`Step chains verified for lessons 4-13 (every line renders, every step explained): ${totals.join(', ')}.`)
