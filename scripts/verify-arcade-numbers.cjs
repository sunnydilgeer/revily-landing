// Plays every Arcade game's number generator for 2,000 seeds: the right answer is always an option, options are
// distinct, every wrong option explains the slip, answers stay whole, and every line of working renders in KaTeX.
// Each game builds fresh numbers per play (src/features/maths/labs/kit/random.ts), so this is the safety net.
const assert = require('node:assert/strict')
const fs = require('node:fs'), path = require('node:path'), Module = require('node:module')
const root = path.resolve(__dirname, '..')
const ts = require(path.join(root, 'node_modules/typescript')), katex = require(path.join(root, 'node_modules/katex'))
const resolve = Module._resolveFilename
Module._resolveFilename = function (request, parent, ...rest) {
  if (request === 'react') return 'react-stub'
  try { return resolve.call(this, request, parent, ...rest) } catch (error) {
    for (const ext of ['.ts', '.tsx']) { try { return resolve.call(this, request + ext, parent, ...rest) } catch {} }
    throw error
  }
}
require.cache['react-stub'] = { id: 'react-stub', filename: 'react-stub', loaded: true, exports: { useState() {}, useEffect() {}, useRef() {}, useCallback() {} } }
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: 1, target: 99, jsx: 4, esModuleInterop: true } }).outputText, file)
require.extensions['.css'] = () => {}
const { makeRand } = require(path.join(root, 'src/features/maths/labs/kit/random.ts'))
const TERM = /\[\[([\w-]+):(.*?)\]\]/g

const games = {
  heist: ['heist/jobs.ts', 'makeJobs'], storm: ['storm/drops.ts', 'makeDrops'], potion: ['potion/brews.ts', 'makeBrews'],
  tiers: ['tiers/lists.ts', 'makeLists'], trick: ['trick/shots.ts', 'makeShots'], packs: ['packs/rounds.ts', 'makeRounds'], balance: ['balance/puzzles.ts', 'makePuzzles'],
  deals: ['deals/deals.ts', 'makeDeals'], stats: ['stats/rounds.ts', 'makeRounds'], mind: ['mind/tricks.ts', 'makeTricks'], build: ['build/bases.ts', 'makeBases'], levels: ['levels/levels.ts', 'makeGame'], laser: ['laser/lines.ts', 'makeRounds'], stall: ['stall/days.ts', 'makeStall'],
  formula: ['formula/rounds.ts', 'makeRounds'], loot: ['loot/rounds.ts', 'makeRounds'], viral: ['viral/rounds.ts', 'makeRounds'],
  slice: ['slice/rounds.ts', 'makeRounds'], supplies: ['supplies/rounds.ts', 'makeRounds'], obby: ['obby/rounds.ts', 'makeRounds'],
}
// The Science Arcade (src/features/science/labs): same rules, plus every dial's nope() must read cleanly.
const SCIENCE = path.join(root, 'src/features/science/labs')
const scienceGames = {
  sparky: 'sparky/rounds.ts', grid: 'grid/rounds.ts', pit: 'pit/rounds.ts', hydrogen: 'hydrogen/rounds.ts', rush: 'rush/rounds.ts', shield: 'shield/rounds.ts', gene: 'gene/rounds.ts', rewild: 'rewild/rounds.ts', sugar: 'sugar/rounds.ts', element: 'element/rounds.ts', river: 'river/rounds.ts',
}
for (const [name, file] of Object.entries(scienceGames)) if (fs.existsSync(path.join(SCIENCE, file))) games[name] = [path.join(SCIENCE, file), 'makeRounds']
// `node scripts/verify-arcade-numbers.cjs loot slice` checks just those games.
const only = process.argv.slice(2)
const visible = line => line.replace(TERM, '$2').replace(/\\text\{([^}]*)\}/g, '$1').replace(/\\(pounds|times|div|circ|frac)/g, 'x').replace(/[{}\\^ ]/g, '')

for (const [name, [file, make]] of Object.entries(games).filter(([name]) => !only.length || only.includes(name))) {
  const gen = require(path.isAbsolute(file) ? file : path.join(root, 'src/features/maths/labs', file))[make]
  let questions = 0, dials = 0, widest = ''
  const samples = []
  for (let seed = 1; seed <= 2000; seed++) {
    const rounds = gen(makeRand(seed))
    if (seed <= 2) samples.push(rounds)
    const walk = (node, where) => {
      if (!node || typeof node !== 'object') return
      if (Array.isArray(node)) return node.forEach((child, i) => walk(child, `${where}[${i}]`))
      if ('answer' in node && Array.isArray(node.choices)) {
        questions++
        const values = node.choices.map(c => String(c.value)), labels = node.choices.map(c => c.label)
        assert.ok(values.includes(String(node.answer)), `${name} seed ${seed} ${where}: answer ${node.answer} not in ${values}`)
        assert.ok(node.choices.length >= 2, `${name} seed ${seed} ${where}: only ${node.choices.length} options`)
        assert.equal(new Set(values).size, values.length, `${name} seed ${seed} ${where}: duplicate values ${values}`)
        assert.equal(new Set(labels).size, labels.length, `${name} seed ${seed} ${where}: duplicate labels ${labels}`)
        for (const c of node.choices) if (String(c.value) !== String(node.answer)) assert.ok(c.nope, `${name} seed ${seed} ${where}: wrong option ${c.label} has no nope`)
        if (typeof node.answer === 'number' && !['packs', 'tiers'].includes(name)) assert.ok(Number.isInteger(node.answer), `${name} seed ${seed} ${where}: answer ${node.answer} not whole`)
        for (const text of [node.prompt, node.why, ...node.choices.map(c => c.nope ?? '')]) if (text) assert.ok(!/NaN|undefined|Infinity|\d\.\d{3,}/.test(text), `${name} seed ${seed} ${where}: bad text "${text}"`)
      }
      // A dial (answer or target, with min/max/step/start): the right value must be reachable and never where it starts.
      const goal = typeof node.answer === 'number' ? node.answer : node.target
      if (!Array.isArray(node.choices) && typeof goal === 'number' && ['min', 'max', 'step', 'start'].every(k => typeof node[k] === 'number')) {
        dials++
        assert.ok(goal >= node.min && goal <= node.max, `${name} seed ${seed} ${where}: dial answer ${goal} outside ${node.min}..${node.max}`)
        assert.ok(Math.abs((goal - node.min) / node.step - Math.round((goal - node.min) / node.step)) < 1e-9, `${name} seed ${seed} ${where}: dial answer ${goal} off the ${node.step} grid`)
        assert.notEqual(goal, node.start, `${name} seed ${seed} ${where}: dial starts on the answer ${goal}`)
        if (typeof node.nope === 'function') for (const probe of [node.start, goal + node.step, goal - node.step, node.max]) {
          const text = node.nope(probe)
          assert.ok(typeof text === 'string' && text.length > 10 && !/NaN|undefined|Infinity|\d\.\d{4,}/.test(text), `${name} seed ${seed} ${where}: bad nope(${probe}) "${text}"`)
        }
        for (const text of [node.prompt, node.win]) if (typeof text === 'string') assert.ok(!/NaN|undefined|Infinity|\d\.\d{4,}/.test(text), `${name} seed ${seed} ${where}: bad text "${text}"`)
      }
      // A tile task (science PlayGame): the answer fills every slot from the palette, and a wrong placement reads cleanly.
      if (node.kind === 'tiles') {
        const palette = node.palette.map(t => t.value)
        assert.equal(node.answer.length, node.slots.length, `${name} seed ${seed} ${where}: ${node.answer.length} answers for ${node.slots.length} slots`)
        for (const tile of node.answer) assert.ok(palette.includes(tile), `${name} seed ${seed} ${where}: answer tile ${tile} not in palette ${palette}`)
        const wrongTile = palette.find(t => t !== node.answer[0])
        if (wrongTile) {
          const text = node.nope([wrongTile, ...node.answer.slice(1)])
          assert.ok(typeof text === 'string' && text.length > 10 && !/NaN|undefined/.test(text), `${name} seed ${seed} ${where}: bad tile nope "${text}"`)
        }
      }
      if (Array.isArray(node.chain)) node.chain.forEach((step, i) => {
        katex.renderToString(`\\displaystyle ${step.line.replace(TERM, (_, k, b) => `\\htmlData{k=${k}}{${b}}`)}`, { trust: true, strict: 'ignore', throwOnError: true })
        if (i > 0) assert.ok(step.op && step.why, `${name} seed ${seed}: chain step ${i} missing op/why`)
        assert.ok(!/NaN|undefined/.test(step.line + (step.why ?? '')), `${name} seed ${seed}: bad chain "${step.line}"`)
        if (visible(step.line).length > visible(widest).length) widest = step.line
      })
      for (const [key, child] of Object.entries(node)) if (key !== 'chain') walk(child, `${where}.${key}`)
    }
    walk(rounds, name)
    // Game-specific friendly-number rules.
    if (name === 'heist') rounds.forEach(job => { const share = job.take / job.ratio.reduce((a, b) => a + b); assert.ok(share % 10 === 0 || share % 25 === 0, `heist share ${share}`) })
    if (name === 'storm') rounds.forEach(drop => assert.ok((drop.squares * drop.scale) % 50 === 0, `storm distance ${drop.squares * drop.scale}`))
    if (name === 'balance') rounds.forEach(p => assert.ok(p.solution % 5 === 0, `balance x = ${p.solution}`))
    if (name === 'potion') rounds.forEach(b => Object.values(b.kind === 'mix' ? b.target : b.rival).forEach(n => assert.ok(Number.isInteger(n) && n >= 0 && n <= 16, `potion count ${n}`)))
    if (name === 'tiers') rounds.forEach(list => list.deals.forEach(d => assert.ok(Math.abs(d.price * 100 - Math.round(d.price * 100)) < 1e-6, `tiers price ${d.price}`)))
  }
  console.log(`${name}: ${questions ? `${questions} questions` : "every round"}${dials ? `, ${dials} dials` : ''} over 2000 plays ok`)
}
console.log('Arcade numbers verified: fresh, friendly and consistent for every game.')
