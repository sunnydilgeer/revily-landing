// Finds Playwright and a Chromium to drive it. Neither is a dependency of the app, so the kit looks for them:
// `playwright` from the project or the folder the kit runs in, and Chromium from CHROMIUM_PATH, Playwright's own
// download, or the cloud container's copy in /opt/pw-browsers.
const fs = require('node:fs')
const path = require('node:path')

function load() {
  for (const name of ['playwright', '@playwright/test', 'playwright-core']) {
    for (const base of [process.cwd(), __dirname]) {
      try { return require(require.resolve(name, { paths: [base] })) } catch {}
    }
  }
  throw new Error('The lesson kit needs Playwright. Install it without saving it to the app: npm i --no-save playwright')
}

function chromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH
  const root = '/opt/pw-browsers'
  if (fs.existsSync(root)) {
    const found = fs.readdirSync(root).filter(name => /^chromium-\d+$/.test(name)).sort().reverse()
      .map(name => path.join(root, name, 'chrome-linux/chrome')).find(file => fs.existsSync(file))
    if (found) return found
  }
  return undefined // Playwright's own download, if there is one
}

async function launch() {
  const { chromium: browser } = load()
  return browser.launch({ executablePath: chromium() })
}

module.exports = { launch }
