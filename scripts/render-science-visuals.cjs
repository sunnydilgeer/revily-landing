// Renders Science lesson diagrams to PNG so they can be looked at without the app.
// Usage: node scripts/render-science-visuals.cjs <lesson folder> [out dir]
//        (Biology: 53 → lesson-53; Chemistry: c1 or chemistry/1 → chemistry/lesson-1)
//        node scripts/render-science-visuals.cjs --focus <focus id> [--assessment] [out dir]
// Writes one PNG per diagram (teaching frames, worked-example visuals, then question visuals in their assessment view) at 720px wide,
// with the lesson's CSS, and prints the paths. Needs Playwright (global install is fine) and Chromium.
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
require.extensions['.css'] = () => {}
module.paths.unshift(path.join(root, 'node_modules'))
let chromium
try { ({ chromium } = require('playwright')) } catch {
  const globalRoot = require('node:child_process').execSync('npm root -g').toString().trim()
  ;({ chromium } = require(path.join(globalRoot, 'playwright')))
}
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { CellBiologyVisual } = require(path.join(science, 'components/CellBiologyVisuals.tsx'))

const args = process.argv.slice(2)
const jobs = []
let out
if (args[0] === '--focus') {
  jobs.push({ name: args[1] + (args.includes('--assessment') ? '-assessment' : ''), focus: args[1], assessment: args.includes('--assessment') })
  out = args.filter(a => !a.startsWith('--'))[1]
} else {
  const folder = args[0]
  out = args[1]
  const { dir } = require('./science-lesson-dir.cjs')(folder)
  const framesModule = require(path.join(science, `${dir}/teachingFrames.ts`))
  const lessonModule = require(path.join(science, `${dir}/lesson.ts`))
  const lesson = Object.values(lessonModule).find(v => v && typeof v === 'object' && Array.isArray(v.states))
  const frameSets = Object.assign({}, ...Object.values(framesModule).filter(v => v && typeof v === 'object' && !Array.isArray(v)))
  const seen = new Set()
  for (const [id, frames] of Object.entries(frameSets)) frames.forEach((f, i) => {
    if (!f.focus || seen.has(f.focus)) return
    seen.add(f.focus); jobs.push({ name: `${id}-f${i + 1}-${f.focus}`, focus: f.focus, assessment: false })
  })
  for (const s of lesson.states) if (s.visual) {
    // Worked-example (teaching) screens show their visual in full; question visuals render in their assessment view.
    if (s.kind === 'teaching') { if (!seen.has(s.visual.id)) { seen.add(s.visual.id); jobs.push({ name: `${s.id}-worked-${s.visual.id}`, focus: s.visual.id, assessment: false }) } }
    else jobs.push({ name: `${s.id}-question-${s.visual.id}`, focus: s.visual.id, assessment: true })
  }
}
out = path.resolve(out || path.join(require('node:os').tmpdir(), 'science-visuals'))
fs.mkdirSync(out, { recursive: true })
const css = ['src/ui/revily-tokens.css', 'src/App.css', 'src/features/science/ScienceLesson.css', 'src/features/science/FriendlyLesson.css', 'src/features/science/AnatomyVisuals.css', 'src/features/science/ScienceLessonFrame.css']
  .map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n')
;(async () => {
  const browser = await chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium') ? undefined : undefined })
  const page = await browser.newPage({ viewport: { width: 760, height: 600 }, deviceScaleFactor: 1.5 })
  for (const job of jobs) {
    const html = renderToStaticMarkup(React.createElement(CellBiologyVisual, { focus: job.focus, assessment: job.assessment }))
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><link rel="preconnect" href="https://fonts.googleapis.com"><style>${css}\nbody{margin:0;padding:20px;background:#fff;font-family:'DM Sans',system-ui,sans-serif}</style></head><body><div class="sl-shell"><div class="science-preview science-preview--revision sl-visual" style="width:720px">${html}</div></div></body></html>`)
    const file = path.join(out, job.name.replace(/[^a-zA-Z0-9_.-]/g, '_') + '.png')
    await page.locator('.sl-visual').screenshot({ path: file })
    console.log(file)
  }
  await browser.close()
})().catch(error => { console.error(error); process.exit(1) })
