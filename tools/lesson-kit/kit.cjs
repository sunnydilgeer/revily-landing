#!/usr/bin/env node
// The lesson kit: makes a lesson's video and worksheet PDF from one pack file.
//   node tools/lesson-kit/kit.cjs packs/A8.1-solving-quadratics.cjs          video and worksheet
//   node tools/lesson-kit/kit.cjs packs/A8.1-solving-quadratics.cjs video    just the video
//   node tools/lesson-kit/kit.cjs packs/A8.1-solving-quadratics.cjs pdf      just the worksheet
// Output goes to tools/lesson-kit/out/<code>/ (not committed): the .mp4, the .pdf, slides.png (every slide at a glance)
// and the frames. See README.md.
const fs = require('node:fs')
const path = require('node:path')
const helpers = require('./lib/helpers.cjs')

async function main() {
  const [packFile, what = 'all'] = process.argv.slice(2)
  if (!packFile || !['all', 'video', 'pdf'].includes(what)) {
    console.log('Usage: node tools/lesson-kit/kit.cjs <pack.cjs> [all|video|pdf]')
    process.exit(1)
  }
  const exported = require(path.resolve(packFile))
  const pack = typeof exported === 'function' ? exported(helpers) : exported
  for (const field of ['code', 'topic', 'strand']) if (!pack[field]) throw new Error(`The pack needs a ${field}`)
  // The pack's own maths checks: every answer worked out again. One false stops the build.
  const failed = Object.entries(pack.checks ?? {}).filter(([, ok]) => ok !== true).map(([name]) => name)
  if (failed.length) throw new Error(`These checks are false, so an answer is wrong:\n${failed.join('\n')}`)
  console.log(`${pack.code} ${pack.topic}: ${Object.keys(pack.checks ?? {}).length} checks pass.`)
  const out = path.join(__dirname, 'out', pack.code)
  fs.mkdirSync(out, { recursive: true })
  if (what !== 'pdf' && pack.video) {
    const { makeVideo } = require('./lib/video.cjs')
    const video = await makeVideo(pack, out)
    console.log(`Video: ${path.relative(process.cwd(), video.file)} (${Math.floor(video.seconds / 60)}:${String(Math.round(video.seconds % 60)).padStart(2, '0')}, ${video.states} states, nothing spills out of the card). Every slide: ${path.relative(process.cwd(), path.join(out, 'slides.png'))}`)
  }
  if (what !== 'video' && pack.worksheet) {
    const { makeWorksheet } = require('./lib/worksheet.cjs')
    const sheet = await makeWorksheet(pack, out)
    console.log(`Worksheet: ${path.relative(process.cwd(), sheet.file)} (${sheet.questions} questions, ${sheet.marks} marks, each matching its working).`)
  }
}

main().catch(error => { console.error(error.message); process.exit(1) })
