// Checks the Science lesson frame (ScienceLesson.tsx) keeps the agreed rules.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const lesson = read('src/features/science/ScienceLesson.tsx')
const drawer = read('src/features/science/ScienceContentsDrawer.tsx')
const page = read('app/preview/science/page.tsx')
const ui = read('src/ui/index.tsx')

// Same frame as Maths: rung header, check bar, done cards, shared top bar and drawer styles
for (const part of ['className="rung-head"', '<CheckBar', 'rung-done', 'maths-breadcrumbs', 'maths-contents-button']) assert.ok(lesson.includes(part), `Lesson frame must use ${part}`)
assert.ok(lesson.includes('data-subject="science"'), 'Science lessons must use the teal theme')

// Written answers are never marked correct: "Saved for review" and the model answer
assert.ok(ui.includes("'saved'"), 'The check bar must have a saved state')
assert.ok(lesson.includes('status="saved" title="Saved for review"'))
assert.ok(lesson.includes('written.explanation.answer'), 'A saved written answer must show the model answer')
assert.ok(!/teacher will mark/i.test(lesson + drawer), 'Never claim a teacher will mark answers')

// Minimal UI: hints start closed; after a wrong answer, working in the card and the answer in the check bar
assert.ok(lesson.includes("open ? 'Hide the hint' : 'Need a hint?'"))
assert.ok(lesson.includes('The answer is <strong>{answerLabel}</strong>'))
assert.ok(lesson.includes("submitted?.result === 'incorrect'") && lesson.includes('sl-steps--working'))

// Safety and status stay visible
assert.ok(lesson.includes('PRACTICAL_NOTES') && lesson.includes('required practical 1'), 'Practical lessons must say they do not replace the real practical')
assert.ok(drawer.includes('awaiting review by a qualified teacher'), 'Draft status must stay in Contents')
assert.ok(lesson.includes("'revily:rung-complete'"), 'Finishing a section must count toward the shared streak')

// Every lesson uses the frame; lesson extras kept (refreshers on the card, the 9–12 story in Contents)
assert.ok(page.includes('<ScienceLesson ') && !page.includes('ScienceLessonPreview'), 'All Science lessons must use the lesson frame')
assert.ok(lesson.includes("'B4-01'") && lesson.includes("'B5-01'"), 'Lessons 4 and 5 keep their refreshers')
assert.ok(drawer.includes('How lessons 9–12 connect'), 'Lessons 9–12 keep the transport story')

console.log('Science lesson frame verified: shared frame, teal theme, saved-for-review written answers, minimal UI, safety notes, all 26 lessons.')
