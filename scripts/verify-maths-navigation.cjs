const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const app = read('src/App.tsx')
const overview = read('src/features/maths/MathsCourseOverview.tsx')
const drawer = read('src/features/maths/MathsContentsDrawer.tsx')
const registry = read('src/features/maths/courseRegistry.ts')
const engine = read('src/features/number-types/useLessonEngine.ts')
const css = read('src/features/maths/MathsNavigation.css')

for (const number of [1, 2, 3, 4, 5, 6, 7, 8]) {
  assert.ok(registry.includes(`entry(${number},`), `Lesson ${number} must be registered once in course order`)
  assert.ok(app.includes(`case ${number}:`), `Lesson ${number} must retain its preview route`)
}

assert.ok(overview.includes('Continue learning'))
assert.ok(overview.includes('maths-lesson-row'))
assert.ok(overview.includes('<summary>Preferences</summary>'))
assert.ok(css.includes('min-height: 74px'))

assert.ok(app.includes('aria-label="Breadcrumb"'))
assert.ok(app.includes('aria-controls="maths-contents"'))
assert.ok(drawer.includes('role="dialog"') && drawer.includes('aria-modal="true"'))
assert.ok(drawer.includes("event.key === 'Escape'"))
assert.ok(drawer.includes("event.key !== 'Tab'"), 'The drawer must trap keyboard focus')
assert.ok(drawer.includes("document.body.style.overflow = 'hidden'"), 'The drawer must lock page scrolling')
assert.ok(app.includes('contentsButtonRef.current?.focus()'), 'Closing must return focus to Contents')
assert.ok(drawer.includes("aria-current={isCurrent ? 'page' : undefined}"))
assert.ok(drawer.includes("aria-current={isCurrentSection ? 'step' : undefined}"))
assert.ok(drawer.includes('All Maths lessons'))
assert.ok(drawer.includes('Lesson information and options'))

assert.ok(engine.includes('saveMathsProgress'))
assert.ok(engine.includes('MATHS_NAVIGATE_EVENT'))
assert.ok(!app.includes('preview-lesson-nav'), 'The old flat lesson menu must not be rendered')

console.log('Maths navigation verified: compact overview, course registry, direct routes, persistent position and accessible contents drawer.')
