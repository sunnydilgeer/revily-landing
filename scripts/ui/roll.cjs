/*
 * The worked-example roll: step through long worked examples and check, after every step, that the step's start
 * (its heading) is below the top fade and its newest line is above the bottom edge of the working window.
 * Pass: "start hidden: 0, newest line hidden: 0".
 *   PREVIEW_PASSWORD=… node scripts/ui/roll.cjs        (LESSONS=27,19,30 to choose lessons)
 */
const { BASE, launch, openPage, bottomButton, step } = require('./lib.cjs')
const LESSONS = (process.env.LESSONS || '27,19,30,32,8,22,25').split(',').map(Number)
const STEP_START = '.ns-step, .ns-eq__heading, .ns-term-groups__heading, .sc-row:last-of-type'

;(async () => {
  const browser = await launch()
  let startHidden = 0, endHidden = 0, total = 0
  for (const size of ['laptop', 'phone', 'small']) {
    const page = await openPage(browser, size)
    for (const n of LESSONS) {
      await page.goto(`${BASE}/preview?lesson=${n}`, { waitUntil: 'networkidle' })
      // Move on to the lesson's first worked example: a teaching screen whose main button steps.
      for (let i = 0; i < 12; i++) {
        const label = (await bottomButton(page).textContent({ timeout: 1500 }).catch(() => '')).trim()
        if (/step/.test(label)) break
        await step(page); await page.waitForTimeout(250)
      }
      const log = []
      for (let s = 0; s < 10; s++) {
        const label = (await bottomButton(page).textContent({ timeout: 1500 }).catch(() => '')).trim()
        if (!/step/.test(label)) break
        await bottomButton(page).click({ timeout: 1500 }).catch(() => {})
        await page.waitForTimeout(1800)
        const m = await page.evaluate(selector => {
          const box = document.querySelector('.wc-roll')
          if (!box || getComputedStyle(box).display === 'none') return null
          const b = box.getBoundingClientRect()
          const fade = box.hasAttribute('data-above') ? parseFloat(getComputedStyle(box).fontSize) * 3 : 0
          const head = [...box.querySelectorAll(selector)].at(-1)
          const lines = [...box.querySelectorAll('li, p, .ns-eq__row > *, .sc-row, .frm-line, [class*="answer"]')].filter(e => e.getBoundingClientRect().height)
          const lastBottom = Math.max(...lines.map(e => e.getBoundingClientRect().bottom))
          const headTop = head ? head.getBoundingClientRect().top : null
          return { full: box.scrollHeight > box.clientHeight + 1, start: headTop !== null && headTop < b.top + fade - 2, end: lastBottom > b.bottom + 2 }
        }, STEP_START)
        if (!m) break
        total++
        if (m.start) startHidden++
        if (m.end) endHidden++
        log.push(`${m.full ? 'F' : '-'}${m.start ? 'S' : ''}${m.end ? 'E' : ''}`)
      }
      console.log(size.padEnd(6), `L${n}`.padEnd(4), log.join(' '), '  (F window full, S start hidden, E newest line hidden)')
    }
  }
  console.log(`steps ${total}; start hidden: ${startHidden}, newest line hidden: ${endHidden}`)
  await browser.close()
  process.exitCode = startHidden || endHidden ? 1 : 0
})()
