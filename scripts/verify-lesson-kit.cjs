// Checks every lesson-kit pack without a browser: its own answer checks, that every slide's maths renders, and that
// the worksheet's levels run easiest first with marks matching the working. Rendering (Chromium, ffmpeg) is checked
// when a pack is made, by tools/lesson-kit/kit.cjs.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const kit = path.resolve(__dirname, '../tools/lesson-kit')
const helpers = require(path.join(kit, 'lib/helpers.cjs'))
const { states } = require(path.join(kit, 'lib/video.cjs'))
const { check } = require(path.join(kit, 'lib/worksheet.cjs'))

// The helpers: maths in KaTeX, words escaped, ticks coloured, a typo in the maths stopped with its own words.
assert.match(helpers.t('take $20$ from both sides ✓'), /katex.*from both sides <span class="yes">✓<\/span>/)
assert.equal(helpers.t('<b>'), '&lt;b&gt;')
assert.throws(() => helpers.m('\\frac{1'), /KaTeX can't read: \\frac\{1/)

const packs = fs.readdirSync(path.join(kit, 'packs')).filter(file => file.endsWith('.cjs'))
assert.ok(packs.length > 0, 'There is at least one pack')
let slides = 0
for (const file of packs) {
  const pack = require(path.join(kit, 'packs', file))(helpers)
  for (const field of ['code', 'topic', 'strand', 'file']) assert.ok(pack[field], `${file} needs a ${field}`)
  const checks = Object.entries(pack.checks ?? {})
  assert.ok(checks.length > 0, `${file} works its answers out again in checks`)
  for (const [name, ok] of checks) assert.equal(ok, true, `${file}: ${name}`)
  if (pack.video) slides += states(pack).length
  if (pack.worksheet) check(pack)
}
console.log(`Lesson kit verified: ${packs.length} pack${packs.length === 1 ? '' : 's'}, ${slides} slide states rendering their maths, every worksheet's levels and marks, and every pack's own answer checks.`)
