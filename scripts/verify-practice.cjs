// Checks Practice (src/features/maths/practice): every template's variants share the same parts, marks and
// statements; every answer is clean and matches the end of its worked chain; every chain renders in KaTeX
// with an operation and a why for each step; every checklist statement is tested by at least one part, so
// gold is reachable for all of them; the marking accepts what students type; sprints climb the paper's ramp;
// and results are saved in the shape readiness.ts reads.
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

const { templates } = require(path.join(root, 'src/features/maths/practice/bank/index.ts'))
const { RAMPS, questionMarks } = require(path.join(root, 'src/features/maths/practice/types.ts'))
const { mark, readNumber, readFraction, answerText, canMark, mistakeFor } = require(path.join(root, 'src/features/maths/practice/marking.ts'))
const { buildSprint, isLearnt, SPRINT_SHAPE, templateWeight } = require(path.join(root, 'src/features/maths/practice/sprint.ts'))
const { aqaMarks } = require(path.join(root, 'src/features/maths/practice/aqaWeights.ts'))
const { addAttempt } = require(path.join(root, 'src/features/maths/practice/record.ts'))
const { canStatements } = require(path.join(root, 'src/features/maths/readiness/statements.ts'))
const { paperTopics } = require(path.join(root, 'src/features/maths/readiness/paperMap.ts'))
const { levelFor, PRACTICE_MIN } = require(path.join(root, 'src/features/maths/readiness/readiness.ts'))

const TERM = /\[\[([\w-]+):(.*?)\]\]/g
const keysOf = line => [...line.matchAll(TERM)].map(match => match[1])
const renderLine = (line, label) => {
  try {
    katex.renderToString(`\\displaystyle ${line.replace(TERM, (_, key, body) => `\\htmlData{k=${key}}{${body}}`)}`, { throwOnError: true, strict: 'ignore', trust: context => context.command === '\\htmlData' })
  } catch (error) { assert.fail(`${label}: ${error.message}`) }
}
const renderText = (text, label) => {
  for (const [, body] of text.matchAll(/\$([^$]+)\$/g)) {
    try { katex.renderToString(body, { throwOnError: true, strict: 'ignore' }) } catch (error) { assert.fail(`${label}: $${body}$ ${error.message}`) }
  }
  assert.equal((text.match(/\$/g) ?? []).length % 2, 0, `${label}: unmatched $`)
}
/** The digits of a number as they appear in LaTeX: 39\,000 → 39000, 0.85 → 0.85. */
const flat = line => line.replace(TERM, (_, key, body) => body).replace(/\\,|\\pounds|\s|\{|\}/g, '')

// Multi-mark parts that stay all-or-nothing: an HCF in context has no step we can check on a phone.
const NO_METHOD = new Set(['party-bags-hcf'])
const covered = new Set()
let parts = 0, variants = 0, mistakes = 0
const ids = new Set()
for (const template of templates) {
  const label = template.id
  assert.ok(!ids.has(template.id), `${label}: duplicate id`); ids.add(template.id)
  assert.ok(paperTopics.some(topic => topic.id === template.topic), `${label}: unknown topic ${template.topic}`)
  assert.ok(RAMPS.includes(template.ramp), `${label}: unknown ramp`)
  assert.ok(/\b(Jun|Nov)\d\d [123]F Q\d+/.test(template.inspiredBy) || /^(Not tested|Rare)/.test(template.inspiredBy), `${label}: inspiredBy should name the AQA questions (e.g. "Jun25 1F Q7") or say it is not tested / rare`)
  assert.ok(template.variants.length >= 3, `${label}: needs at least 3 sets of numbers`)
  const shape = v => JSON.stringify(v.parts.map(part => [part.kind, part.marks, part.statements, part.method?.length ?? 0, part.form ?? '']))
  const first = shape(template.variants[0])
  const stems = new Set()
  template.variants.forEach((variant, v) => {
    variants++
    const where = `${label} #${v + 1}`
    assert.equal(shape(variant), first, `${where}: every variant needs the same parts, marks and statements`)
    stems.add(JSON.stringify(variant))
    renderText(variant.stem, `${where} stem`)
    assert.ok(questionMarks(variant) >= 1 && questionMarks(variant) <= 5, `${where}: 1–5 marks per question`)
    variant.parts.forEach((part, p) => {
      parts++
      const at = `${where} part ${p + 1}`
      renderText(part.prompt, at)
      assert.ok(part.hint.trim(), `${at}: needs a hint`)
      assert.ok(part.statements.length > 0, `${at}: needs a statement`)
      for (const key of part.statements) { assert.ok(canStatements[key], `${at}: unknown statement ${key}`); covered.add(key) }
      assert.ok(part.chain?.length || part.reason, `${at}: needs a worked chain or a reason`)
      if (part.chain) part.chain.forEach((step, s) => {
        const line = `${at} chain line ${s + 1}`
        if (!step.plain) renderLine(step.line, line)
        const keys = keysOf(step.line)
        assert.equal(new Set(keys).size, keys.length, `${line}: keys must be unique on a line`)
        if (s === 0) return
        assert.ok(step.op?.trim() && step.why?.trim(), `${line}: every step needs an operation and a why`)
        const above = new Set(keysOf(part.chain[s - 1].line))
        for (const [result, sources] of Object.entries(step.merge ?? {})) {
          assert.ok(keys.includes(result), `${line}: merge result ${result} is not on the line`)
          for (const source of sources) assert.ok(above.has(source), `${line}: merge source ${source} is not on the line above`)
        }
      })
      if (part.kind === 'number' || part.kind === 'fraction') {
        assert.ok((part.method?.length ?? 0) <= part.marks - 1, `${at}: at most marks − 1 method steps`)
        for (const step of part.method ?? []) assert.ok(Number.isFinite(step.answer) && step.prompt.trim(), `${at}: method step`)
        // AQA gives method marks on almost every 2+ mark question (M1 A1, M1 M1 A1…), so we do too.
        if (part.marks >= 2 && !NO_METHOD.has(template.id)) assert.ok(part.method?.length, `${at}: a ${part.marks}-mark part needs method steps, as AQA gives method marks`)
        for (const slip of part.mistakes ?? []) {
          const typed = Array.isArray(slip.answer) ? `${slip.answer[0]}/${slip.answer[1]}` : String(slip.answer)
          assert.ok(!mark(part, typed).right, `${at}: mistake ${typed} is marked right`)
          assert.equal(mistakeFor(part, typed), slip.note, `${at}: mistake ${typed} does not get its note`)
          mistakes++
        }
      }
      if (part.kind === 'number') {
        assert.ok(Number.isFinite(part.answer), `${at}: answer is not a number`)
        assert.ok(Math.abs(part.answer * 1e4 - Math.round(part.answer * 1e4)) < 1e-6, `${at}: answer ${part.answer} is not clean`)
        // The worked chain ends on the answer.
        const shown = part.dp !== undefined ? part.answer.toFixed(part.dp) : part.prefix === '£' && !Number.isInteger(part.answer) ? part.answer.toFixed(2) : String(part.answer)
        const lastLines = part.chain.slice(-2).map(step => flat(step.line))
        assert.ok(lastLines.some(line => line.includes(shown)), `${at}: chain should end on ${shown} (got ${lastLines.join(' / ')})`)
        // Typing the answer the way the mark scheme writes it is marked right.
        assert.ok(mark(part, answerText(part).replace(part.suffix ?? '', '')).right, `${at}: its own answer text is marked wrong`)
      }
      if (part.kind === 'fraction') {
        const [n, d] = part.answer
        assert.ok(Number.isInteger(n) && Number.isInteger(d) && d > 0, `${at}: fraction answer`)
        assert.ok(mark(part, answerText(part)).right, `${at}: its own answer text ${answerText(part)} is marked wrong`)
        const last = flat(part.chain.at(-1).line)
        const g = (a, b) => b ? g(b, a % b) : a, k = g(n, d)
        assert.ok(last.includes(`frac${n / k}${d / k}`) || last.includes(`${Math.floor(n / d)}\\frac${n % d / k}${d / k}`.replace(/\\/g, '\\')) || last.includes(String(n / d)), `${at}: chain should end on the fraction (got ${last})`)
      }
      if (part.kind === 'choice') {
        assert.ok(part.correct >= 0 && part.correct < part.options.length, `${at}: correct option out of range`)
        assert.equal(new Set(part.options).size, part.options.length, `${at}: options must differ`)
        part.options.forEach((option, o) => renderText(option, `${at} option ${o + 1}`))
      }
      if (part.kind === 'spot') {
        assert.ok(part.wrong > 0 && part.wrong < part.lines.length, `${at}: the wrong line must be a line of working`)
        part.lines.forEach((line, l) => renderLine(line, `${at} spot line ${l + 1}`))
      }
    })
  })
  assert.equal(stems.size, template.variants.length, `${label}: variants must differ`)
}

// Coverage: gold needs Practice on every statement, so every statement must be tested somewhere.
const missing = Object.keys(canStatements).filter(key => !covered.has(key))
assert.deepEqual(missing, [], `statements with no Practice question: ${missing.join(', ')}`)
for (const ramp of RAMPS) assert.ok(templates.filter(t => t.ramp === ramp).length >= SPRINT_SHAPE[ramp] + 1, `${ramp}: needs more templates than a sprint uses`)
const styles = new Set(templates.map(t => t.style))
for (const style of ['showThat', 'errorSpot', 'explain']) assert.ok(styles.has(style), `no ${style} questions`)

// Marking.
assert.equal(readNumber('£1,250.50'), 1250.5)
assert.equal(readNumber('−3'), -3)
assert.equal(readNumber('12%'), 12)
assert.equal(readNumber('abc'), null)
assert.deepEqual(readFraction('2 3/4'), { whole: 2, numerator: 3, denominator: 4, mixed: true })
assert.deepEqual(readFraction('11/4'), { whole: 0, numerator: 11, denominator: 4, mixed: false })
assert.equal(readFraction('3/0'), null)
const number = { kind: 'number', answer: 6, dp: 2 }
assert.ok(mark(number, '6.00').right)
assert.ok(!mark(number, '6').right && mark(number, '6').note, 'right value, wrong form gets a note')
const simplest = { kind: 'fraction', answer: [3, 4], form: 'simplest' }
assert.ok(mark(simplest, '3/4').right)
assert.ok(!mark(simplest, '18/24').right && mark(simplest, '18/24').note)
assert.ok(!mark(simplest, '2/3').right)
const anyForm = { kind: 'fraction', answer: [11, 12] }
assert.ok(mark(anyForm, '22/24').right, 'equivalent fractions count unless a form is asked for')
const mixed = { kind: 'fraction', answer: [21, 4], form: 'mixed' }
assert.ok(mark(mixed, '5 1/4').right)
assert.ok(!mark(mixed, '21/4').right && mark(mixed, '21/4').note)
assert.ok(!mark(mixed, '5 2/8').right)
assert.equal(answerText(mixed), '5 1/4')
assert.ok(mark({ kind: 'choice', correct: 2 }, '2').right)
assert.ok(!mark({ kind: 'spot', wrong: 1 }, '2').right)
assert.ok(!canMark({ kind: 'number' }, '') && canMark({ kind: 'fraction' }, '1/2'))

// Sprints: six questions on the paper's ramp, no template twice, learnt skills first, new numbers each time.
let seed = 1
const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
const none = {}
for (let run = 0; run < 50; run++) {
  const sprint = buildSprint(templates, none, {}, random)
  assert.deepEqual(sprint.map(q => q.ramp), ['recall', 'recall', 'apply', 'apply', 'multistep', 'stretch'])
  assert.equal(new Set(sprint.map(q => q.id)).size, 6, 'no template twice in a sprint')
}
const fractionsLearnt = Object.fromEntries(Object.keys(canStatements).filter(key => key.startsWith('8:')).map(key => [key, 'secure']))
const learntSprint = buildSprint(templates, fractionsLearnt, {}, random)
for (const q of learntSprint) {
  const onRamp = templates.filter(t => t.ramp === q.ramp && isLearnt(t, fractionsLearnt))
  if (onRamp.length >= SPRINT_SHAPE[q.ramp]) assert.ok(isLearnt(templates.find(t => t.id === q.id), fractionsLearnt), `${q.id}: a learnt template was available on the ${q.ramp} ramp`)
}
assert.ok(learntSprint.some(q => q.topic === 'fractions'), 'learnt fractions show up')
const servedOnce = Object.fromEntries(templates.map(t => [t.id, 1]))
assert.ok(buildSprint(templates, none, servedOnce, random).every(q => q.variant === 1), 'second time round, templates use their next numbers')

// Money needs 2 decimal places, as AQA marks it; whole pounds don't.
const cost = { kind: 'number', answer: 4.2, prefix: '£' }
assert.ok(mark(cost, '4.20').right)
assert.ok(!mark(cost, '4.2').right && /2 decimal places/.test(mark(cost, '4.2').note))
assert.ok(mark({ kind: 'number', answer: 578, prefix: '£' }, '578').right)
assert.equal(mistakeFor({ kind: 'number', answer: 64, mistakes: [{ answer: -64, note: 'n' }] }, '−64'), 'n')
assert.equal(mistakeFor({ kind: 'fraction', answer: [11, 12], mistakes: [{ answer: [3, 7], note: 'f' }] }, '6/14'), 'f', 'equivalent slips match')

// AQA weighting: every statement has a weight, often-tested skills come up more, and everything still comes round.
for (const key of Object.keys(canStatements)) assert.ok(Number.isFinite(aqaMarks[key]), `${key}: no AQA weight`)
const byId = id => templates.find(t => t.id === id)
assert.ok(templateWeight(byId('decimal-multiply')) > 2 * templateWeight(byId('bounds-truncation')), 'decimal multiplication outweighs truncation')
const counts = {}
for (let run = 0; run < 400; run++) for (const q of buildSprint(templates, none, {}, random)) counts[q.id] = (counts[q.id] ?? 0) + 1
assert.ok((counts['bounds-counting'] ?? 0) > 1.3 * (counts['bounds-truncation'] ?? 0), `bounds-counting (${counts['bounds-counting']}) should come up more than truncation (${counts['bounds-truncation']}), same topic and ramp`)
const rotation = {}
for (let run = 0; run < 40; run++) for (const q of buildSprint(templates, none, rotation, random)) rotation[q.id] = (rotation[q.id] ?? 0) + 1
const never = templates.filter(t => !rotation[t.id]).map(t => t.id)
assert.deepEqual(never, [], `templates never served in 40 sprints: ${never.join(', ')}`)

// Saving: parts add up per statement, and enough right-first-time Practice turns a secure skill gold.
let records = addAttempt({}, ['8:adding-fractions'], true, '2026-09-27')
records = addAttempt(records, ['8:adding-fractions', '8:subtracting-fractions'], false, '2026-09-27')
assert.deepEqual(records['8:adding-fractions'], { attempted: 2, firstTry: 1, on: '2026-09-27' })
assert.deepEqual(records['8:subtracting-fractions'], { attempted: 1, firstTry: 0, on: '2026-09-27' })
records = addAttempt(records, ['8:adding-fractions'], true, '2026-09-28')
assert.equal(PRACTICE_MIN, 2)
assert.equal(levelFor({ started: true, finished: true, score: { questions: 5, firstTry: 5, on: '' }, cardBoxes: [], practice: records['8:adding-fractions'] }), 'examReady', '2 of 3 right first time makes a secure skill gold')

const marks = templates.reduce((sum, t) => sum + questionMarks(t.variants[0]), 0)
console.log(`Practice verified: ${templates.length} templates, ${variants} questions, ${parts} parts, ${marks} marks per set, ${mistakes} known slips; all ${covered.size} checklist statements covered and weighted by AQA 2022–25; ${[...styles].join(', ')}.`)
