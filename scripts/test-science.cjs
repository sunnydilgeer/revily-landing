const { mkdtempSync } = require('node:fs')
const { tmpdir } = require('node:os')
const { join, resolve } = require('node:path')
const { execFileSync } = require('node:child_process')
// Keep output isolated from Next's dev/build directories. Retained temporary output aids diagnosis.
const output = mkdtempSync(join(tmpdir(), 'revily-science-tests-'))
const tests = ['scaffold.test.ts', 'previewSession.test.ts', 'lesson-2/microscopy.test.ts', 'lesson-3/practical.test.ts', 'navigation.test.ts', 'lessons456.test.tsx', 'lessons789.test.tsx', 'lessons1012.test.tsx', 'lessons1316.test.tsx', 'lessons1718.test.tsx', 'lessons1920.test.tsx', 'lesson21.test.tsx', 'lesson22.test.tsx', 'lesson23.test.tsx', 'lesson24.test.tsx', 'lesson25.test.tsx', 'teachingCopy.test.ts', 'variants.test.ts', 'examPreparation.test.ts', 'coach/coach.test.ts', 'revision-b/revision.test.ts']
execFileSync(resolve('node_modules/.bin/tsc'), ['--rootDir', 'src/features/science', '--outDir', output, '--noEmit', 'false', '--incremental', 'false', '--target', 'ES2020', '--module', 'commonjs', '--moduleResolution', 'node', '--jsx', 'react-jsx', '--esModuleInterop', '--skipLibCheck', ...tests.map(t => 'src/features/science/' + t)], { stdio: 'inherit' })
for (const test of tests) execFileSync(process.execPath, [join(output, test.replace(/\.tsx?$/, '.js'))], { stdio: 'inherit', env: { ...process.env, NODE_PATH: resolve('node_modules') } })
execFileSync(process.execPath, ['src/features/science/typography.test.mjs'], { stdio: 'inherit' })
console.log('Science test output:', output)
