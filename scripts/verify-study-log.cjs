// Checks the streak and daily-log rules (studyLog.ts).
const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename)
const { streakFrom, dayCounts, lastSevenDays, dayKey } = require('../src/features/maths/studyLog.ts')

const rung = { seconds: 60, rungs: 1 }, fiveMin = { seconds: 300, rungs: 0 }, short = { seconds: 120, rungs: 0 }
assert.equal(dayCounts(rung), true, 'Finishing a rung counts')
assert.equal(dayCounts(fiveMin), true, 'Five minutes counts')
assert.equal(dayCounts(short), false, 'Two minutes and no rung does not count')
assert.equal(dayCounts(undefined), false)

assert.equal(streakFrom({}, '2026-09-26'), 0)
assert.equal(streakFrom({ '2026-09-26': rung }, '2026-09-26'), 1)
assert.equal(streakFrom({ '2026-09-24': rung, '2026-09-25': fiveMin, '2026-09-26': rung }, '2026-09-26'), 3)
assert.equal(streakFrom({ '2026-09-24': rung, '2026-09-25': rung }, '2026-09-26'), 2, 'Today not done yet keeps yesterday\'s streak')
assert.equal(streakFrom({ '2026-09-24': rung, '2026-09-26': rung }, '2026-09-26'), 1, 'A missed day breaks the streak')
assert.equal(streakFrom({ '2026-09-25': short, '2026-09-26': short }, '2026-09-26'), 0)
assert.equal(streakFrom({ '2026-02-28': rung, '2026-03-01': rung }, '2026-03-01'), 2, 'Streaks cross month ends')
assert.equal(streakFrom({ '2025-12-31': rung, '2026-01-01': rung }, '2026-01-01'), 2, 'Streaks cross year ends')

const week = lastSevenDays({ '2026-09-26': rung, '2026-09-20': fiveMin }, '2026-09-26')
assert.equal(week.length, 7)
assert.equal(week[0].key, '2026-09-20')
assert.equal(week[6].key, '2026-09-26')
assert.deepEqual(week.map(day => day.counted), [true, false, false, false, false, false, true])
assert.match(dayKey(new Date(2026, 0, 5)), /^2026-01-05$/)

console.log('Study log verified: streak rules, missed days, month and year boundaries, week strip.')
