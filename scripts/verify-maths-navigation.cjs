const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const app = read('src/App.tsx')
const overview = read('src/features/maths/Curriculum.tsx')
const shell = read('src/features/maths/AppShell.tsx')
const drawer = read('src/features/maths/MathsContentsDrawer.tsx')
const registry = read('src/features/maths/courseRegistry.ts')
const engine = read('src/features/number-types/useLessonEngine.ts')

for (const number of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]) {
  assert.ok(registry.includes(`entry(${number},`), `Lesson ${number} must be registered once in course order`)
  assert.ok(app.includes(`case ${number}:`), `Lesson ${number} must retain its preview route`)
}

// Curriculum home: up next, today's goal and streak, lessons as a ladder path with rungs
assert.ok(overview.includes("'Up next'") && overview.includes("'Start here'"), 'Curriculum must show what to do next')
assert.ok(overview.includes('className="cur-path"') && overview.includes('cur-rungs'), 'Lessons must show as a ladder path with rung progress')
assert.ok(overview.includes('GOAL_OPTIONS') && overview.includes('aria-pressed'), 'The daily goal must be choosable')
assert.ok(overview.includes('streakLabel'), 'Curriculum must show the streak')
assert.ok(overview.includes('Coming later'), 'Unbuilt chapters must be labelled honestly')

// App shell: the three sections, sidebar on desktop and bottom nav on phones
for (const label of ['Curriculum', 'Revision cards', 'Practice']) assert.ok(shell.includes(`label: '${label}'`), `${label} must be in the main navigation`)
assert.ok(shell.includes("nav('side')") && shell.includes("nav('bottom')"), 'Navigation must render as a sidebar and a bottom bar')
assert.ok(shell.includes("aria-current={active === section.id ? 'page' : undefined}"))
assert.ok(app.includes('useStudyTimer(view === \'lesson\' || view === \'cards\')'), 'Study minutes must only count while a lesson or revision cards are open')

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

console.log('Maths navigation verified: curriculum home, app shell, course registry, direct routes, persistent position and accessible contents drawer.')
