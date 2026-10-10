/*
 * The fixed lesson screen: on every screen the page never scrolls, the top bar is at the top, the bottom bar is at
 * the foot, and the page raises no errors. 14 lessons × 4 sizes × 14 screens. Pass: "problems: 0".
 *   PREVIEW_PASSWORD=… node scripts/ui/frame.cjs
 */
const { BASE, GRAPHS, GEOMETRY, SIZES, launch, openPage, step, shot } = require('./lib.cjs')
const LESSONS = [
  ['l1', '/preview?lesson=1'], ['l2', '/preview?lesson=2'], ['l3', '/preview?lesson=3'], ['l8', '/preview?lesson=8'],
  ['l19', '/preview?lesson=19'], ['l27', '/preview?lesson=27'], ['l32', '/preview?lesson=32'],
  ['geo201', `${GEOMETRY}?lesson=201`], ['geo206', `${GEOMETRY}?lesson=206`], ['geo210', `${GEOMETRY}?lesson=210`],
  ['geo212', `${GEOMETRY}?lesson=212`], ['geo216', `${GEOMETRY}?lesson=216`], ['geo218', `${GEOMETRY}?lesson=218`],
  ['graphs101', `${GRAPHS}?lesson=101`],
]

const measure = page => page.evaluate(() => {
  const d = document.documentElement, card = document.querySelector('.rung-card, .rung-done')
  const bar = document.querySelector('.rung-lesson > .rv-checkbar'), top = document.querySelector('.lesson-bar')
  return {
    pageScrolls: d.scrollHeight > innerHeight + 1 || scrollY > 0, vh: innerHeight,
    barBottom: bar ? Math.round(bar.getBoundingClientRect().bottom) : null, topBar: top ? Math.round(top.getBoundingClientRect().top) : null,
    cardScrolls: card ? card.scrollHeight > card.clientHeight + 1 : null,
  }
})

;(async () => {
  const browser = await launch()
  let problems = 0, total = 0
  for (const size of Object.keys(SIZES)) {
    const page = await openPage(browser, size)
    page.on('pageerror', e => { problems++; console.log('PROBLEM page error', size, e.message.slice(0, 160)) })
    for (const [name, url] of LESSONS) {
      await page.goto(BASE + url, { waitUntil: 'networkidle' })
      let inner = 0
      for (let i = 0; i < 14; i++) {
        await page.waitForTimeout(350)
        const m = await measure(page); total++
        const barOk = m.barBottom === null || (m.barBottom <= m.vh + 1 && m.barBottom >= m.vh - 40)
        if (m.pageScrolls || (m.topBar !== null && m.topBar !== 0) || !barOk) {
          problems++
          console.log('PROBLEM', size, name, i, JSON.stringify(m))
          await shot(page, `frame-problem-${size}-${name}-${i}`)
        }
        if (m.cardScrolls) inner++
        await step(page)
      }
      console.log(size.padEnd(8), name.padEnd(10), 'screens with inner scroll:', inner)
    }
  }
  console.log(`checked ${total} screens; problems: ${problems}`)
  await browser.close()
  process.exitCode = problems ? 1 : 0
})()
