/*
 * Shared helpers for the lesson-screen browser checks (README.md in this folder).
 * Settings come from the environment, so nothing secret is written down here:
 *   BASE                 the app to test (default http://localhost:3123, a production build: npm run build && npx next start -p 3123)
 *   PREVIEW_PASSWORD     the /preview password (required)
 *   CHROMIUM_PATH        a Chromium to launch (optional; Playwright's own otherwise)
 *   OUT                  where screenshots go (default ui-results/)
 */
const fs = require('fs')
const path = require('path')

function playwright() {
  for (const name of ['playwright', '@playwright/test', '/opt/node-tools/node_modules/playwright']) {
    try { return require(name) } catch { /* try the next */ }
  }
  throw new Error('Playwright not found: npm i -D playwright (no browser download needed if one is installed)')
}

const BASE = process.env.BASE || 'http://localhost:3123'
const OUT = process.env.OUT || 'ui-results'
const SIZES = { desktop: [1440, 900], laptop: [1366, 768], phone: [390, 844], small: [375, 667] }
const GRAPHS = '/preview/graphs-fb7c95e1c045', GEOMETRY = '/preview/geometry-598a5fb6df99'

async function launch() {
  if (!process.env.PREVIEW_PASSWORD) throw new Error('Set PREVIEW_PASSWORD to the /preview password')
  fs.mkdirSync(OUT, { recursive: true })
  return playwright().chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {})
}

/** A new page at a screen size, unlocked for /preview. */
async function openPage(browser, size) {
  const [width, height] = SIZES[size]
  const phone = width < 500
  const page = await (await browser.newContext({ viewport: { width, height }, isMobile: phone, hasTouch: phone })).newPage()
  await page.request.post(`${BASE}/api/preview-unlock`, { data: { password: process.env.PREVIEW_PASSWORD } })
  return page
}

const bottomButton = page => page.locator('.rung-lesson > .rv-checkbar button').last()

/** One move forward through a lesson: press the main button, or answer anything (wrong is fine) and check it. */
async function step(page) {
  const button = bottomButton(page)
  const label = (await button.textContent({ timeout: 1500 }).catch(() => '')).trim()
  if (/^(Continue|Keep going|Finish lesson|Next step|Show the first step)$/.test(label)) return button.click({ timeout: 1500 }).catch(() => {})
  const inputs = page.locator('.rung-card input:not([disabled])'); const n = await inputs.count()
  if (n) { for (let i = 0; i < n; i++) await inputs.nth(i).fill('1', { timeout: 1500 }).catch(() => {}) }
  else {
    const choice = page.locator('.rung-card .pvb-choice:not([disabled]), .rung-card .opb-choice:not([disabled])').first()
    if (await choice.count()) await choice.click({ timeout: 1500 }).catch(() => {})
    else {
      // A board to drag or tap (graph, angle, measure): tap its middle so there is an answer to check.
      const board = page.locator('.rung-card svg').first()
      const box = await board.boundingBox().catch(() => null)
      if (box) await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2).catch(() => {})
    }
  }
  await page.waitForTimeout(150)
  const check = bottomButton(page)
  if (await check.isEnabled({ timeout: 800 }).catch(() => false)) await check.click({ timeout: 1500 }).catch(() => {})
  else await check.click({ timeout: 800, force: true }).catch(() => {})
}

const shot = (page, name) => page.screenshot({ path: path.join(OUT, `${name}.png`) }).catch(() => {})

module.exports = { BASE, OUT, SIZES, GRAPHS, GEOMETRY, launch, openPage, bottomButton, step, shot }
