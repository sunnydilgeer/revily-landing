const { mkdtempSync } = require('node:fs')
const { tmpdir } = require('node:os')
const { join, resolve } = require('node:path')
const { execFileSync } = require('node:child_process')
// Keep output isolated from Next's dev/build directories. Retained temporary output aids diagnosis.
const output = mkdtempSync(join(tmpdir(), 'revily-science-tests-'))
const tests = ['scaffold.test.ts', 'previewSession.test.ts', 'lesson-2/microscopy.test.ts', 'lesson-2b/magnification.test.ts', 'lesson-3/practical.test.ts', 'navigation.test.ts', 'lessons456.test.tsx', 'lessons789.test.tsx', 'lessons1012.test.tsx', 'lessons1316.test.tsx', 'lessons1718.test.tsx', 'lessons1920.test.tsx', 'lesson21.test.tsx', 'lesson22.test.tsx', 'lesson23.test.tsx', 'lesson24.test.tsx', 'lesson25.test.tsx', 'lesson26.test.tsx', 'lessons3241.test.tsx', 'lessons4245.test.tsx', 'lessons4650.test.tsx', 'lessons5157.test.tsx', 'lessons58.test.tsx', 'chemistry1.test.tsx', 'chemistry2to7.test.tsx', 'chemistry8to18.test.tsx', 'chemistry19to30.test.tsx', 'chemistry20h.test.tsx', 'chemistry22h.test.tsx', 'chemistry25h.test.tsx', 'chemistry30h.test.tsx', 'chemistry36h.test.tsx', 'chemistry50h.test.tsx', 'chemistry31to40.test.tsx', 'chemistry41to55.test.tsx', 'physics1to30.test.tsx', 'physics31to59.test.tsx', 'physics60to64.test.tsx', 'skills1to22.test.tsx', 'teachingCopy.test.ts', 'lessons1to6.test.ts', 'examPreparation.test.ts', 'higher.test.ts', 'revision-b/revision.test.ts']
execFileSync(resolve('node_modules/.bin/tsc'), ['--rootDir', 'src/features/science', '--outDir', output, '--noEmit', 'false', '--incremental', 'false', '--target', 'ES2020', '--module', 'commonjs', '--moduleResolution', 'node', '--jsx', 'react-jsx', '--esModuleInterop', '--skipLibCheck', ...tests.map(t => 'src/features/science/' + t)], { stdio: 'inherit' })
for (const test of tests) execFileSync(process.execPath, [join(output, test.replace(/\.tsx?$/, '.js'))], { stdio: 'inherit', env: { ...process.env, NODE_PATH: resolve('node_modules') } })
execFileSync(process.execPath, ['src/features/science/typography.test.mjs'], { stdio: 'inherit' })
console.log('Science test output:', output)
