import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TeachingChunk } from './components/TeachingChunk'
import { scienceChapters, scienceLessons } from './lessonNavigation'
import type { TeachingFrame } from './teachingFrame'

// The eleven cell-biology lessons (chapter B1), in catalogue order.
const cellBiology = scienceLessons.filter(item => (scienceChapters[0].lessonNumbers as readonly number[]).includes(item.number))
const lessons = cellBiology.map(item => item.lesson)
const frameSets: Array<Record<string, TeachingFrame[]>> = cellBiology.map(item => item.frames)
// Captured from the easier-wording lessons when the original wording (Variant A) was retired, and
// re-captured for lessons 3 and 4 after their content-flow rewrite (26 September 2026). Re-captured
// again for the cell-biology split (26 September 2026): folders 1, 2, 5 and 6 were rewritten
// (content version 0.2.0) and 1b, 2b, 5b, 6b and 6c are new (0.1.0); folders 3 and 4 are unchanged.
// Wording is deliberately excluded; grading, evidence and snapshot identity are not.
const contracts: Record<string, string> = {
  'B-CELL-001-B': '1beb904c9a87676da933b6da0b705348396b805412a5b680967a6b53f18591ba',
  'B-CELL-001B-B': '69f3b5a466ee6f16cfde4585fd817c799219d0e20509ba883ad40ed1c3329460',
  'B-CELL-002-B': '4134bffb2532302e1d42327e2a393fb3617f38a8ada24ff0a67e6fbe067afecc',
  'B-CELL-002B-B': '6360286ec22723420bac698c5652796645863013f44f2b10a2b70fa1308a0c1f',
  'B-CELL-003-B': '3bda1a8cf02888095572a6fa9f2e829c606ee6baeac4467010f8efcf51710f79',
  'B-CELL-004-B': '2c8cb04be0121dfb78b511304504eb5ed9eb9e2f2e56d6e1593a14088b4fc421',
  'B-CELL-005-B': '26e00294181082bd1118aa3d58079f9da1fe388f76d64a31e5ad268ee846e3e5',
  'B-CELL-005B-B': '8bb66cc0b5c43b47741ed8bd065c3dd30a9e8ecf75b87a3741a5d8328e7722a7',
  'B-CELL-006-B': '325538788c2930a902e89f0eb96a7b8e3e65e23e49b42c41bf3a995797e51ee5',
  'B-CELL-006B-B': '217f28c9f62f4f4664957570fd1abd8180e407b576e123fc0138387a7a8cc1fa',
  'B-CELL-006C-B': '216ed01c19f3a6c1abf3af6c4fb922c28247a99e0232634e658017f47fd65e44',
}
let checks = 0
function check(name: string, fn: () => void) { fn(); checks++; console.log(`PASS ${name}`) }
lessons.forEach((l, i) => {
  check(`${l.id}: assessment contract is unchanged`, () => {
    const contract = {
      id: l.id, version: l.contentVersion, prerequisites: l.prerequisites, requirements: l.requirements,
      states: [...l.states, ...l.retrieval].map(s => ({
        id: s.id, kind: s.kind, phase: s.phase, skill: s.skillId,
        spec: s.specRefs, sources: s.sourceIds, context: s.kind === 'teaching' ? undefined : s.contextId,
        dimensions: s.kind === 'teaching' ? undefined : s.dimensions,
        role: s.kind === 'teaching' ? undefined : s.evidenceRole,
        answer: s.kind === 'choice' ? s.answerId : undefined,
        options: s.kind === 'choice' ? s.options.map(o => ({ id: o.id, signal: o.misconceptionSignal })) : undefined,
        marking: s.kind === 'written' ? s.marking : undefined,
        marks: s.kind === 'written' ? s.rubric.marks : undefined,
        exam: s.kind === 'teaching' ? undefined : s.exam,
        visual: s.visual && { id: s.visual.id, kind: s.visual.kind, highlight: s.visual.highlight },
        media: s.kind === 'teaching' ? s.media?.kind : undefined,
      })),
    }
    const hash = createHash('sha256').update(JSON.stringify(contract)).digest('hex')
    assert.equal(hash, contracts[l.id])
  })
  check(`${l.id}: every walkthrough has complete copy and a matching teaching script`, () => {
    for (const [id, frames] of Object.entries(frameSets[i])) {
      const state = l.states.find(s => s.id === id)
      assert.ok(state?.kind === 'teaching' && state.media)
      assert.equal(state.media.script, frames.map(f => `${f.label}. ${f.summary} ${f.text}`).join(' '))
      assert.ok(frames.length)
      for (const f of frames) {
        assert.ok(f.label && f.summary && f.cue && f.text)
        assert.ok(!/in the required model|technical methods are not required|you do not need the detailed/i.test(f.text))
        const html = renderToStaticMarkup(createElement(TeachingChunk, { state, onExposure: () => {}, customFrames: [f] }))
        const escaped = f.text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[c]!))
        assert.ok(html.includes(escaped), `${id}: frame copy must appear in the rendered teaching screen`)
        assert.ok(html.includes('science-walkthrough') && !html.includes('NaN'))
      }
    }
  })
  check(`${l.id}: all assessment copy is complete, without authoring-language leakage`, () => {
    for (const state of [...l.states, ...l.retrieval]) {
      if (state.kind === 'teaching') continue
      assert.ok(state.title && state.hint && state.explanation.answer && state.explanation.steps.length)
      assert.ok(state.explanation.steps.every(s => s.trim().length > 0))
      assert.ok(!/in the required model|this hint does not identify a part/.test(state.hint + state.explanation.steps.join(' ')))
    }
  })
})
check('key concepts include plain-language meanings and causal links across the cell-biology lessons', () => {
  const text = (folder: string) => Object.values(frameSets[cellBiology.findIndex(item => item.folder === folder)]).flat().map(f => f.text).join(' ')
  // Lesson 1 no longer uses the word "function"; its plain meaning ("each part has a job") is now taught there.
  assert.match(text('1'), /each part has a job/)
  assert.match(text('4'), /function.*job/i)
  assert.match(text('2'), /one blurred patch/)
  assert.match(text('3'), /thin so light can pass through/)
  assert.match(text('4'), /more surface area\. More water/)
  assert.match(text('5'), /copying is called replication/)
  assert.match(text('6'), /Concentration means.*given volume/)
  assert.match(text('6'), /More leave a higher-concentration region than return/)
  // The osmosis practical moved from lesson 6 to lesson 6b.
  assert.match(text('6b'), /dependent variable|final mass − initial mass/)
})
console.log(`${checks} teaching-copy checks passed.`)
