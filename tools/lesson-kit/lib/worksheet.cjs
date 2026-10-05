// Makes a lesson worksheet (PDF) from a pack: each question and its worked answer, printed by Chromium. The marks on
// each question must match the marks its working awards, and the levels must run easiest first.
const fs = require('node:fs')
const path = require('node:path')
const { launch } = require('./browser.cjs')
const h = require('./helpers.cjs')

const LEVELS = ['worked', 'easy', 'medium', 'hard', 'very hard']

function check(pack) {
  const problems = []
  let last = 0
  for (const q of pack.worksheet.questions) {
    const level = LEVELS.indexOf(q.level)
    if (level < 0) problems.push(`Q${q.n}: level must be one of ${LEVELS.join(', ')}`)
    if (level < last) problems.push(`Q${q.n}: ${q.level} comes after a harder question`)
    last = Math.max(last, level)
    const awarded = q.working.filter(step => step.mark !== undefined || step.answer !== undefined).length
    if (awarded !== q.marks) problems.push(`Q${q.n}: worth ${q.marks} mark${q.marks === 1 ? '' : 's'}, but its working awards ${awarded}`)
    if (!q.working.some(step => step.answer !== undefined)) problems.push(`Q${q.n}: the working needs an answer`)
  }
  if (problems.length) throw new Error(`Fix these worksheet questions first:\n${problems.join('\n')}`)
}

function html(pack) {
  const theme = path.join(__dirname, '../theme')
  const katexCss = require.resolve('katex/dist/katex.min.css')
  const questions = pack.worksheet.questions.map(q => {
    const working = q.working.map(step => step.say !== undefined ? `<p class="say">${h.t(step.say)}</p>`
      : step.math !== undefined ? `<p class="math">${h.m(step.math)}</p>`
      : step.picture !== undefined ? `<div class="picture">${step.picture}</div>`
      : step.mark !== undefined ? `<p class="mark">${h.t(step.mark)}<span class="one">[1]</span></p>`
      : `<p class="answer">${h.t(step.answer)}<span class="one">[1]</span></p>`).join('')
    return `<section class="q"><div class="card"><div class="top"><span class="num">${h.esc(q.n)}</span><span class="level ${q.level.replace(' ', '-')}">${q.level === 'worked' ? 'Worked example' : h.esc(q.level)}</span><span class="marks">${q.marks} mark${q.marks === 1 ? '' : 's'}</span></div>
      <div class="body">${q.question.map ? q.question.map(part => `<p>${h.t(part)}</p>`).join('') : `<p>${h.t(q.question)}</p>`}</div></div>
      <div class="card"><div class="body">${working}</div></div></section>`
  }).join('')
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="file://${katexCss}"><link rel="stylesheet" href="file://${theme}/worksheet.css"></head><body>
<h1>${h.t(pack.worksheet.title)}</h1><p class="meta">${h.esc(`${pack.strand} · ${pack.code}`)}<br>AQA GCSE MATHS · FOUNDATION</p>${questions}</body></html>`
}

async function makeWorksheet(pack, out) {
  check(pack)
  const file = path.join(out, `${pack.file ?? pack.code}.pdf`)
  fs.writeFileSync(path.join(out, 'worksheet.html'), html(pack))
  const browser = await launch()
  const page = await browser.newPage()
  await page.goto('file://' + path.join(out, 'worksheet.html'))
  await page.evaluate(() => document.fonts.ready)
  await page.pdf({ path: file, format: 'A4', printBackground: true, preferCSSPageSize: true })
  await browser.close()
  return { file, questions: pack.worksheet.questions.length, marks: pack.worksheet.questions.reduce((sum, q) => sum + q.marks, 0) }
}

module.exports = { makeWorksheet, check }
