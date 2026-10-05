const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const app = read('src/App.tsx')
const overview = read('src/features/maths/Curriculum.tsx')
const shell = read('src/features/maths/AppShell.tsx')
const today = read('src/features/maths/TodayCard.tsx')
const science = read('src/features/science/ScienceCurriculum.tsx')
const sciencePage = read('app/preview/science/page.tsx')
const tokens = read('src/ui/revily-tokens.css')
const drawer = read('src/features/maths/MathsContentsDrawer.tsx')
const registry = read('src/features/maths/courseRegistry.ts')
const engine = read('src/features/number-types/useLessonEngine.ts')

for (const number of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]) {
  assert.ok(registry.includes(`entry(${number},`), `Lesson ${number} must be registered once in course order`)
  assert.ok(app.includes(`case ${number}:`), `Lesson ${number} must retain its preview route`)
}

// Curriculum home: a compact contents page, chapters on the left and the chosen chapter's lessons on a line
assert.ok(overview.includes('Up next ·') && overview.includes('Start here ·'), 'Curriculum must show what to do next')
assert.ok(overview.includes('className="cur-path"') && overview.includes('cur-toc__chapters'), 'Lessons must show as a chapter list and a lesson line')
assert.ok(overview.includes('aria-pressed={selected}') && science.includes('<TocChapter') && science.includes('<TocLesson'), 'Both subjects must share the contents layout')
assert.ok(!overview.includes('<TodayCard') && !science.includes('<TodayCard'), 'The curriculum is only the table of contents: no Today card')
assert.ok(today.includes('GOAL_OPTIONS') && today.includes('aria-pressed'), 'The daily goal must be choosable')
assert.ok(today.includes('streakLabel'), 'Curriculum must show the streak')
assert.ok(today.includes('minutesBySubject'), 'Today must show the split between subjects')
assert.ok(overview.includes('Coming later'), 'Unbuilt chapters must be labelled honestly')

// App shell: the four sections, sidebar on desktop and bottom nav on phones
for (const label of ['Curriculum', 'Revision cards', 'Practice', 'Arcade']) assert.ok(shell.includes(`label: '${label}'`), `${label} must be in the main navigation`)
assert.ok(shell.includes("nav('side')") && shell.includes("nav('bottom')"), 'Navigation must render as a sidebar and a bottom bar')
assert.ok(shell.includes("aria-current={active === section.id ? 'page' : undefined}"))
assert.ok(app.includes("useStudyTimer(view === 'cards' || (subject === 'maths' && view === 'lesson'), subject)"), 'Study minutes must only count while a lesson or revision cards (either subject) are open')
assert.ok(sciencePage.includes('<StudyTimer subject="science" />'), 'Science lesson minutes must count toward the shared goal')

// Subjects: one-tap switch in both placements, remembered, themed by data-subject
assert.ok(shell.includes('placement="side"') && shell.includes('placement="top"'), 'The subject switch must be in the sidebar and the phone top bar')
assert.ok(shell.includes('data-subject={subject}'), 'The shell must carry the subject theme')
assert.ok(app.includes('saveLastSubject') && app.includes('readLastSubject'), 'The app must reopen on the last subject')
assert.ok(tokens.includes('[data-subject="science"]') && tokens.includes('--rv-accent:'), 'Science must override the accent tokens')
assert.ok(science.includes("'Coming later'") || science.includes('Coming later'), 'Chemistry and Physics must show as coming later')
assert.ok(science.includes('scienceSubjects.filter(item => item.lessons.length === 0)'), 'Science subjects with no lesson yet (e.g. Physics) must be listed as coming later')
assert.ok(sciencePage.includes("redirect('/preview?subject=science')"), 'The old Science hub must redirect into the app')

assert.ok(app.includes('aria-label="Breadcrumb"'))
assert.ok(app.includes('aria-controls="maths-contents"'))
assert.ok(drawer.includes('role="dialog"') && drawer.includes('aria-modal="true"'))
assert.ok(drawer.includes("event.key === 'Escape'"))
assert.ok(drawer.includes("event.key !== 'Tab'"), 'The drawer must trap keyboard focus')
assert.ok(drawer.includes("document.body.style.overflow = 'hidden'"), 'The drawer must lock page scrolling')
assert.ok(app.includes('contentsButtonRef.current?.focus()'), 'Closing must return focus to Contents')
assert.ok(drawer.includes("aria-current={isCurrent ? 'page' : undefined}"))
assert.ok(drawer.includes("aria-current={isCurrentSection ? 'step' : undefined}"))
assert.ok(drawer.includes('aria-label="Search lessons and skills"'), 'Contents must let students search every lesson and skill')
assert.ok(drawer.includes('aria-expanded={chapterOpen}') && drawer.includes('aria-expanded={skillsOpen}'), 'Chapters and lessons must fold open and closed')
assert.ok(app.includes('selectSkillFromDrawer'), 'Any skill in any lesson must open in one tap')

assert.ok(engine.includes('saveMathsProgress'))
assert.ok(engine.includes('MATHS_NAVIGATE_EVENT'))
assert.ok(!app.includes('preview-lesson-nav'), 'The old flat lesson menu must not be rendered')

console.log('Maths navigation verified: curriculum home, app shell, course registry, direct routes, persistent position and accessible contents drawer.')
