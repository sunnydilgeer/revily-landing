// Makes a lesson video from a pack's slides: every state (a slide with its first k items showing) is drawn in
// Chromium, checked for anything spilling out of the card, then joined with short fades by ffmpeg.
const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const { launch } = require('./browser.cjs')
const h = require('./helpers.cjs')

const FADE = 0.35
const OPENING = 1.8

/** Every state of every slide, as the card's HTML and how long it stays. */
function states(pack) {
  const slides = [...pack.video.slides]
  if (pack.video.recap?.length) slides.push({ done: true, items: pack.video.recap.map((text, i, all) => [h.pill(`${i + 1}. ${text}`), i === all.length - 1 ? 3.5 : 1.6]) })
  const list = []
  slides.forEach((slide, s) => {
    const head = slide.done ? '<h1 style="margin-top:30px">Well done!</h1><div class="tick">✓</div>'
      : slide.hero ? `<h1>${h.t(slide.hero)}</h1>${slide.sub ? `<p class="sub">${h.t(slide.sub)}</p>` : ''}`
      : `${slide.stage ? `<p class="stage">${h.esc(slide.stage)}</p>` : ''}<h2>${h.t(slide.title)}</h2>${slide.from ? `<p class="from">from last page: ${h.t(slide.from)}</p>` : ''}`
    for (let k = 0; k <= slide.items.length; k++) {
      // An item that replaces an earlier one (its third entry) takes its place once it shows.
      const gone = new Set(slide.items.slice(0, k).map(item => item[2]).filter(j => j !== undefined))
      const items = slide.items.slice(0, k).filter((_, j) => !gone.has(j)).map(([html]) => `<div class="item">${html}</div>`).join('')
      list.push({ slide: s + 1, step: k, html: head + items, hold: k === 0 ? (slide.opening ?? OPENING) : slide.items[k - 1][1] })
    }
  })
  return list
}

async function makeVideo(pack, out) {
  const theme = path.join(__dirname, '../theme')
  const katexCss = require.resolve('katex/dist/katex.min.css')
  const list = states(pack)
  const page = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="file://${katexCss}"><link rel="stylesheet" href="file://${theme}/video.css"></head>
<body><div class="card" id="card"></div><div class="label">${h.esc(`${pack.code} · ${pack.topic}`)}</div>
<script>const STATES = ${JSON.stringify(list.map(state => state.html))}; window.show = i => { document.getElementById('card').innerHTML = STATES[i] }</script></body></html>`
  const frames = path.join(out, 'frames')
  fs.rmSync(frames, { recursive: true, force: true }); fs.mkdirSync(frames, { recursive: true })
  fs.writeFileSync(path.join(out, 'slides.html'), page)
  const browser = await launch()
  const tab = await browser.newPage({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 2 })
  await tab.goto('file://' + path.join(out, 'slides.html'))
  const problems = []
  for (let i = 0; i < list.length; i++) {
    await tab.evaluate(i => window.show(i), i)
    await tab.evaluate(() => document.fonts.ready)
    // Nothing may spill out of the card: too tall, or wider than it.
    const spill = await tab.evaluate(() => {
      const card = document.getElementById('card'), box = card.getBoundingClientRect()
      const wide = [...card.querySelectorAll('*')].some(el => { const b = el.getBoundingClientRect(); return b.width && (b.left < box.left - 1 || b.right > box.right + 1) })
      return card.scrollHeight > card.clientHeight + 1 ? 'too tall for the card' : wide ? 'too wide for the card' : ''
    })
    if (spill) problems.push(`slide ${list[i].slide}, step ${list[i].step}: ${spill}`)
    await tab.screenshot({ path: path.join(frames, `s${String(i).padStart(3, '0')}.png`) })
  }
  await browser.close()
  if (problems.length) throw new Error(`Fix these slides first:\n${problems.join('\n')}`)

  // Join the states with fades: each one is held, then fades into the next.
  const inputs = [], filters = []
  list.forEach((state, i) => {
    inputs.push('-loop', '1', '-t', (state.hold + FADE).toFixed(2), '-i', path.join(frames, `s${String(i).padStart(3, '0')}.png`))
    filters.push(`[${i}:v]scale=960:540:flags=lanczos,fps=30,format=yuv420p,setsar=1[i${i}]`)
  })
  let current = '[i0]', at = 0
  for (let i = 1; i < list.length; i++) {
    at += list[i - 1].hold
    const next = i === list.length - 1 ? '[out]' : `[x${i}]`
    filters.push(`${current}[i${i}]xfade=transition=fade:duration=${FADE}:offset=${at.toFixed(2)}${next}`)
    current = next
  }
  if (list.length === 1) filters.push('[i0]null[out]')
  const file = path.join(out, `${pack.file ?? pack.code}.mp4`)
  const run = spawnSync('ffmpeg', ['-v', 'error', '-y', ...inputs, '-filter_complex', filters.join(';'), '-map', '[out]', '-c:v', 'libx264', '-preset', 'slow', '-crf', '30', '-tune', 'stillimage', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', file], { stdio: 'inherit' })
  if (run.status !== 0) throw new Error('ffmpeg could not make the video (is ffmpeg installed?)')
  // A contact sheet: the last state of every slide, to look over without playing the video.
  const lasts = list.map((state, i) => i).filter(i => !list[i + 1] || list[i + 1].slide !== list[i].slide)
  const sheetInputs = lasts.flatMap(i => ['-i', path.join(frames, `s${String(i).padStart(3, '0')}.png`)])
  const cols = Math.min(4, lasts.length), rows = Math.ceil(lasts.length / cols)
  const pads = Array.from({ length: cols * rows - lasts.length }, () => ['-f', 'lavfi', '-i', 'color=c=white:s=1920x1080:d=1']).flat()
  const total = cols * rows
  const layout = Array.from({ length: total }, (_, i) => `${(i % cols) ? (i % cols) + '*w0' : '0'}_${Math.floor(i / cols) ? Math.floor(i / cols) + '*h0' : '0'}`.replace(/(\d)\*w0/, (_, n) => Array(Number(n)).fill('w0').join('+')).replace(/(\d)\*h0/, (_, n) => Array(Number(n)).fill('h0').join('+'))).join('|')
  spawnSync('ffmpeg', ['-v', 'error', '-y', ...sheetInputs, ...pads, '-filter_complex', `${Array.from({ length: total }, (_, i) => `[${i}:v]scale=480:270[s${i}]`).join(';')};${Array.from({ length: total }, (_, i) => `[s${i}]`).join('')}xstack=inputs=${total}:layout=${layout}`, '-frames:v', '1', path.join(out, 'slides.png')], { stdio: 'inherit' })
  const seconds = list.reduce((sum, state) => sum + state.hold, 0) + FADE
  return { file, seconds, states: list.length }
}

module.exports = { makeVideo, states }
