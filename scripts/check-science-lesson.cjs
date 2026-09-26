// Checks one Science lesson against the grading rules and the lesson 13–26 flow rules
// (see src/features/science/LESSONS-1-12-FLOW-AUDIT.md).
// Usage: node scripts/check-science-lesson.cjs <lesson folder number> [--quiet]
// Prints the lesson's flow, then every failure. Exit code 1 if anything fails.
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

const root = path.join(__dirname, '..')
const science = path.join(root, 'src/features/science')
for (const ext of ['.ts', '.tsx']) {
  require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    fileName: filename,
  }).outputText, filename)
}
module.paths.unshift(path.join(root, 'node_modules'))

const folder = process.argv[2]
if (!folder) { console.error('Usage: node scripts/check-science-lesson.cjs <lesson folder number>'); process.exit(2) }
const lessonModule = require(path.join(science, `lesson-${folder}/lesson.ts`))
const framesModule = require(path.join(science, `lesson-${folder}/teachingFrames.ts`))
const lesson = Object.values(lessonModule).find(value => value && typeof value === 'object' && Array.isArray(value.states))
const sections = Object.entries(lessonModule).find(([name, value]) => /Sections$/.test(name) && Array.isArray(value))?.[1]
  ?? require(path.join(science, 'lessonSections.ts')).scienceLessonSections?.[Number(folder)]
const frameSets = Object.assign({}, ...Object.values(framesModule).filter(value => value && typeof value === 'object' && !Array.isArray(value)))

const fails = []
const fail = (rule, message) => fails.push(`[${rule}] ${message}`)
const words = text => (text || '').split(/\s+/).filter(Boolean).length
const sentences = text => (text || '').split(/(?<=[.!?])\s+/).filter(s => s.trim())

if (!lesson) { console.error(`No lesson export found in lesson-${folder}/lesson.ts`); process.exit(2) }
if (!sections) { console.error(`No *Sections export found for lesson-${folder}`); process.exit(2) }
const states = lesson.states
const index = new Map(states.map((state, i) => [state.id, i]))

/* ---------- Grading and content rules (must always pass) ---------- */
if (new Set(states.map(s => s.id)).size !== states.length) fail('ids', 'State ids must be unique')
if (lesson.reviewStatus !== 'draftNeedsTeacherReview') fail('draft', 'Lesson must stay a draft awaiting teacher review')
const sourceIds = lesson.sources.map(s => s.id)
for (const state of states) {
  if (!state.specRefs?.length) fail('spec', `${state.id} has no specRefs`)
  for (const id of state.sourceIds || []) if (!sourceIds.includes(id)) fail('sources', `${state.id} cites unknown source ${id}`)
  if (state.kind === 'teaching' && state.media) {
    const frames = frameSets[state.id]
    if (!frames?.length) { fail('frames', `${state.id} has a script but no frames`); continue }
    const script = frames.map(f => `${f.label}. ${f.summary} ${f.text}`).join(' ')
    if (state.media.script !== script) fail('frames', `${state.id} script does not match its frames`)
    frames.forEach((f, i) => { if (!f.label || !f.summary || !f.cue || !f.text) fail('frames', `${state.id} frame ${i + 1} is missing label/summary/cue/text`) })
  }
  if (state.kind === 'choice') {
    const ids = state.options.map(o => o.id)
    if (new Set(ids).size !== ids.length) fail('choice', `${state.id} has duplicate option ids`)
    const answer = state.options.find(o => o.id === state.answerId)
    if (!answer) fail('choice', `${state.id} answerId is not an option`)
    else if (state.explanation.answer !== answer.label) fail('choice', `${state.id} explanation.answer must equal the correct option label`)
    if (!state.hint || !state.explanation.steps.length) fail('choice', `${state.id} needs a hint and explanation steps`)
    if (state.options.length < 3) fail('choice', `${state.id} needs at least 3 options`)
  }
  if (state.kind === 'written') {
    if (state.marking !== 'teacherOnly') fail('written', `${state.id} must be teacherOnly`)
    if (state.rubric.marks !== state.rubric.points.length) fail('written', `${state.id} marks must equal the number of points`)
    if (!state.rubric.reject.length) fail('written', `${state.id} needs reject lines`)
  }
}
for (const [dimension, rule] of Object.entries(lesson.requirements || {})) for (const id of rule.inSession) {
  const state = states.find(s => s.id === id)
  if (!state || state.kind === 'teaching' || state.evidenceRole !== 'independent' || !state.dimensions.includes(dimension)) fail('requirements', `${dimension} requirement ${id} must be an independent question of that dimension`)
}
// The engine sends a learner back to revise if they practised a calculation but never did one on their own.
if (states.some(s => s.kind !== 'teaching' && s.evidenceRole !== 'independent' && s.dimensions.includes('calculation'))
  && !states.some(s => s.kind !== 'teaching' && s.evidenceRole === 'independent' && s.dimensions.includes('calculation')))
  fail('requirements', 'A calculation is practised but never done on your own; add an independent calculation item')
for (const section of sections) if (!index.has(section.id)) fail('sections', `Section ${section.label} starts at unknown state ${section.id}`)

// Diagrams: every frame focus and question visual must render (original Science visuals).
try {
  const React = require('react')
  const { renderToStaticMarkup } = require('react-dom/server')
  const { CellBiologyVisual } = require(path.join(science, 'components/CellBiologyVisuals.tsx'))
  const render = (focus, assessment) => renderToStaticMarkup(React.createElement(CellBiologyVisual, { focus, assessment }))
  for (const [id, frames] of Object.entries(frameSets)) for (const f of frames) if (f.diagram === 'cellBiology' && f.focus) {
    const html = render(f.focus, false)
    if (html.length <= 20 || html.includes('NaN')) fail('visuals', `${id} frame "${f.label}" focus "${f.focus}" does not render a diagram`)
  }
  for (const state of states) if (state.visual && /^B(?:[4-9]|[1-9]\d)-/.test(state.id)) {
    const html = render(state.visual.id, state.kind !== 'teaching')
    if (html.length <= 20 || html.includes('NaN')) fail('visuals', `${state.id} visual "${state.visual.id}" does not render`)
  }
} catch (error) { fail('visuals', `Could not render visuals: ${error.message}`) }

/* ---------- Flow rules (lessons 13–26 pattern) ---------- */
const ordered = [...sections].filter(s => index.has(s.id)).sort((a, b) => index.get(a.id) - index.get(b.id))
const ranges = ordered.map((s, i) => ({ ...s, start: index.get(s.id), end: i + 1 < ordered.length ? index.get(ordered[i + 1].id) : states.length }))
if (states.length < 14 || states.length > 20) fail('flow:size', `${states.length} screens; aim for 15–19`)
if (ranges.length < 4 || ranges.length > 8) fail('flow:sections', `${ranges.length} sections; aim for 5–7 (Start here, 3–5 teaching sections, On your own)`)
if (ranges[0]?.start !== 0) fail('flow:sections', 'The first section must start at the first screen')
if (!/^Start here/.test(ranges[0]?.label || '')) fail('flow:open', 'First section must be "Start here"')
if (states[0]?.kind !== 'choice') fail('flow:open', 'Open with one "Start here" question')
if (ranges.at(-1)?.label !== 'On your own') fail('flow:close', 'Last section must be "On your own"')
if (states.at(-1)?.kind !== 'written') fail('flow:close', 'End with one written task')
if (states.filter(s => s.kind === 'written').length !== 1) fail('flow:close', 'Exactly one written task, at the end')
for (const r of ranges) {
  const block = states.slice(r.start, r.end)
  if (/^(Chapter|Part \d|Apply it)/.test(r.label)) fail('flow:titles', `Section title "${r.label}" is a topic label; use a short plain question or action`)
  if (r === ranges[0] || r === ranges.at(-1)) {
    if (r === ranges.at(-1) && (block.length < 3 || block.length > 6)) fail('flow:close', `"On your own" has ${block.length} screens; aim for 2–4 questions + 1 written`)
    if (r === ranges.at(-1) && block.some(s => s.kind === 'teaching')) fail('flow:close', '"On your own" must not teach')
    continue
  }
  if (block[0]?.kind !== 'teaching') fail('flow:section', `"${r.label}" must start by teaching`)
  const firstQuestion = block.findIndex(s => s.kind !== 'teaching')
  if (firstQuestion < 0) fail('flow:section', `"${r.label}" teaches but never checks`)
  else {
    if (block.slice(firstQuestion).some(s => s.kind === 'teaching')) fail('flow:section', `"${r.label}" teaches again after its questions; split it into two sections`)
    const questions = block.length - firstQuestion
    if (questions > 4) fail('flow:section', `"${r.label}" has ${questions} questions after its teaching; aim for 1–3`)
  }
  for (const s of block) if (s.kind !== 'teaching' && s.evidenceRole === 'independent') fail('flow:section', `${s.id} is independent but sits in "${r.label}"; independent items belong in "On your own"`)
}
for (const [id, frames] of Object.entries(frameSets)) {
  if (!index.has(id)) continue
  if (frames.length > 6) fail('flow:frames', `${id} has ${frames.length} frames; aim for 3–6`)
  for (const f of frames) {
    for (const s of sentences(f.text)) if (words(s) > 26) fail('flow:language', `${id} "${f.label}": sentence over 26 words: "${s.slice(0, 70)}…"`)
    if (sentences(f.text).length > 6) fail('flow:language', `${id} "${f.label}": more than 6 sentences in one frame`)
  }
}
const learnerText = states.map(s => [s.title, s.body, s.hint, ...(s.explanation?.steps || [])].join(' ')).join(' ') + ' ' + Object.values(frameSets).flat().map(f => `${f.summary} ${f.text}`).join(' ')
for (const pattern of [/not required here/i, /required route here/i, /later lessons? (connect|will)/i, /you do not need (the|to know)/i, /this lesson connects/i, /the specification/i]) {
  const match = learnerText.match(pattern)
  if (match) fail('flow:language', `Author note in learner text: "${match[0]}"`)
}
const choices = states.filter(s => s.kind === 'choice')
if (choices.length >= 6) {
  const counts = {}
  for (const c of choices) counts[c.answerId] = (counts[c.answerId] || 0) + 1
  const max = Math.max(...Object.values(counts))
  if (max / choices.length > 0.45) fail('flow:answers', `${max} of ${choices.length} correct answers share one position; spread them out`)
}

/* ---------- Report ---------- */
if (!process.argv.includes('--quiet')) {
  const code = s => s.kind === 'teaching' ? (frameSets[s.id] ? `T${frameSets[s.id].length}` : s.steps ? `W${s.steps.length}` : 't') : s.kind === 'choice' ? (s.evidenceRole === 'independent' ? 'i' : 'c') : 'X'
  console.log(`${lesson.id} v${lesson.contentVersion} · ${states.length} screens · ${ranges.length} sections`)
  for (const r of ranges) console.log(`  ${r.label.padEnd(34)} ${states.slice(r.start, r.end).map(code).join(' ')}`)
}
if (fails.length) { console.log(`\n${fails.length} problem(s):`); for (const f of fails) console.log('  ' + f); process.exit(1) }
console.log('OK: grading, visuals and flow rules pass.')
