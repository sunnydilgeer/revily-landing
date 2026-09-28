// Fails when two source files (or folders) differ only in capital letters, like Sprint.tsx and sprint.ts.
// Linux (Vercel) keeps them apart, but macOS and Windows treat them as one file, so `import './sprint'`
// silently loads Sprint.tsx and the app will not build or run there. Runs before every build.
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const MODULE = /\.(tsx?|jsx?|cjs|mjs)$/
const SKIP = new Set(['node_modules', '.next', '.git', '.vercel'])

const clashes = []
function walk(dir) {
  const names = fs.readdirSync(dir, { withFileTypes: true }).filter(entry => !SKIP.has(entry.name))
  const seen = new Map()
  for (const entry of names) {
    // Same name ignoring case; and, for code, the same name ignoring case and extension ('./sprint' finds both).
    const keys = [entry.name.toLowerCase()]
    if (entry.isFile() && MODULE.test(entry.name)) keys.push(`module:${entry.name.replace(MODULE, '').toLowerCase()}`)
    for (const key of keys) {
      const other = seen.get(key)
      if (other && other !== entry.name) clashes.push(`${path.relative(root, dir)}/: ${other} and ${entry.name}`)
      else seen.set(key, entry.name)
    }
    if (entry.isDirectory()) walk(path.join(dir, entry.name))
  }
}
for (const top of ['src', 'app', 'components', 'scripts', 'lib']) if (fs.existsSync(path.join(root, top))) walk(path.join(root, top))

if (clashes.length) {
  console.error(`These names differ only in capital letters, which breaks the build on Mac and Windows. Rename one of each pair:\n  ${clashes.join('\n  ')}`)
  process.exit(1)
}
console.log('File names verified: no two differ only in capital letters.')
