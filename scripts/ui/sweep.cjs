/*
 * A UI sweep of a whole group of lessons at one screen size: about 18 screens per lesson, one JSON line per screen
 * (inner scroll, sideways clipping, smallest text, small tap targets, the roll, fitting). Summarise with summarise.py.
 *   PREVIEW_PASSWORD=… node scripts/ui/sweep.cjs <numbers|graphs|diagrams> <desktop|laptop|phone|small> > ui-results/graphs-laptop.jsonl
 */
const { BASE, GRAPHS, GEOMETRY, launch, openPage, step, shot } = require('./lib.cjs')
const [group, size] = process.argv.slice(2)
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i)
const GROUPS = {
  numbers: range(1, 34).filter(n => n !== 26).map(n => [n, `/preview?lesson=${n}`]),
  graphs: range(101, 108).map(n => [n, `${GRAPHS}?lesson=${n}`]),
  diagrams: range(201, 218).map(n => [n, `${GEOMETRY}?lesson=${n}`]),
}
if (!GROUPS[group] || !size) { console.error('Usage: node scripts/ui/sweep.cjs <numbers|graphs|diagrams> <desktop|laptop|phone|small>'); process.exit(2) }
const SCREENS = +(process.env.SCREENS || 18)

const measure = page => page.evaluate(() => {
  const d = document.documentElement, card = document.querySelector('.rung-card, .rung-done'), bar = document.querySelector('.rung-lesson > .rv-checkbar')
  const r = e => e.getBoundingClientRect()
  const out = { pageScroll: d.scrollHeight > innerHeight + 1 || scrollY > 0, kind: card?.classList.contains('rung-done') ? 'done' : 'card' }
  if (!card) return { ...out, kind: 'none' }
  out.over = card.scrollHeight - card.clientHeight
  const cr = r(card)
  out.wide = Math.max(0, card.scrollWidth - card.clientWidth, ...[...card.querySelectorAll('svg, img, table, .ns-eq, .sc, .ns-visual, .rung-answer-form, .pvb-choices')].map(e => Math.round(r(e).right - cr.right + 2)))
  // Smallest text as drawn on screen: SVG labels by their drawn height (their SVG may be scaled), the rest by font size × zoom.
  let small = 99
  for (const el of card.querySelectorAll('p, li, span, strong, button, label, text, td, th, h3, small')) {
    if (!el.textContent.trim() || el.closest('.sr-only')) continue
    const s = getComputedStyle(el), box = r(el)
    if (s.visibility === 'hidden' || s.display === 'none' || !box.width || !box.height) continue
    if (el.tagName.toLowerCase() === 'text') { small = Math.min(small, box.height / 1.2); continue }
    if (el.closest('svg')) continue
    const zoom = parseFloat(el.closest('[style*="zoom"]')?.style.zoom || '1')
    small = Math.min(small, parseFloat(s.fontSize) * zoom)
  }
  out.smallText = Math.round(small * 10) / 10
  out.tinyTaps = [...card.querySelectorAll('button, input, a')].filter(e => { const b = r(e); return b.width && b.height && (b.width < 40 || b.height < 40) && getComputedStyle(e).visibility !== 'hidden' }).length
  out.underBar = bar ? Math.max(0, Math.round(cr.bottom - r(bar).top)) : 0
  out.zoomed = [...card.querySelectorAll('[style*="zoom"]')].map(e => +e.style.zoom).sort()[0] || 1
  out.paper = card.style.getPropertyValue('--rv-paper-grid-size') || ''
  const roll = card.querySelector('.wc-roll')
  if (roll && getComputedStyle(roll).display !== 'none') out.roll = { h: roll.clientHeight, full: roll.scrollHeight, capped: !!roll.style.maxHeight }
  out.button = bar?.querySelector('button:last-child')?.textContent.trim() ?? ''
  out.heading = (card.querySelector('h3')?.textContent || '').trim().slice(0, 50)
  return out
})

;(async () => {
  const browser = await launch()
  for (const [n, url] of GROUPS[group]) {
    const page = await openPage(browser, size)
    const errors = []
    page.on('pageerror', e => errors.push(e.message.slice(0, 120)))
    await page.goto(BASE + url, { waitUntil: 'networkidle' }).catch(() => {})
    let stuck = 0, last = ''
    for (let i = 0; i < SCREENS; i++) {
      await page.waitForTimeout(700)
      const m = await measure(page).catch(e => ({ kind: 'error', err: String(e).slice(0, 80) }))
      const sig = `${m.heading}|${m.button}|${m.over}`
      stuck = sig === last ? stuck + 1 : 0; last = sig
      console.log(JSON.stringify({ group, size, lesson: n, i, ...m, errors: errors.splice(0) }))
      if (m.over > 20 || m.wide > 4 || m.underBar > 2) await shot(page, `sweep-${group}-${size}-${n}-${String(i).padStart(2, '0')}`)
      if (m.kind === 'none' || stuck >= 3) break
      await step(page)
    }
    await page.context().close()
  }
  await browser.close()
})()
