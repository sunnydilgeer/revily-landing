import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TeachingChunk } from './components/TeachingChunk'
import { lesson1 } from './lesson-1/lesson'
import { lesson2 } from './lesson-2/lesson'
import { lesson3 } from './lesson-3/lesson'
import { lesson4 } from './lesson-4/lesson'
import { lesson5 } from './lesson-5/lesson'
import { lesson6 } from './lesson-6/lesson'
import { teachingFrames } from './lesson-1/teachingFrames'
import { microscopyFrames } from './lesson-2/teachingFrames'
import { practicalFrames } from './lesson-3/teachingFrames'
import { specialisationFrames } from './lesson-4/teachingFrames'
import { divisionFrames } from './lesson-5/teachingFrames'
import { transportFrames } from './lesson-6/teachingFrames'

const lessons = [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6]
const frameSets = [teachingFrames, microscopyFrames, practicalFrames, specialisationFrames, divisionFrames, transportFrames]
// Captured from the easier-wording lessons when the original wording (Variant A) was retired. Their
// question and marking contracts had been checked identical to A's. Wording is deliberately
// excluded; grading, evidence and snapshot identity are not.
const contracts = [
  '8a79d71b5c49f723262e3bdacc59f7d37aa253385e658b9b5c886fce48b99b92',
  '1a48fc43869907c6706754f38a190b3703e7439b19a3a592f153796abb47573d',
  'e4878578ea29439fff7a1a9ebd97b46a4c5cf71049d369aa3380da8b8069d0a9',
  '33d219a2450eabe55ece6d3d912d1796dd1c51969a8278e977e3fb92d863e747',
  '8fb61a08da6fbebdd08003e17028b526e61bfe0230b415dffeaba08be3405c0b',
  'cf4ed5b9205ae0f5b979c2867081f1551f5af76252a98fd47ad88dd19cced111',
]
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
    assert.equal(hash, contracts[i])
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
check('key concepts include plain-language meanings and causal links across all six lessons', () => {
  const text = frameSets.map(fs => Object.values(fs).flat().map(f => f.text).join(' '))
  assert.match(text[0], /function.*job/i)
  assert.match(text[1], /one blurred patch/)
  assert.match(text[2], /thin so light can pass through/)
  assert.match(text[3], /more surface area\. More water/)
  assert.match(text[4], /copying is called replication/)
  assert.match(text[5], /Concentration means.*given volume/)
  assert.match(text[5], /More leave a higher-concentration region than return/)
  assert.match(text[5], /dependent variable|final mass − initial mass/)
})
console.log(`${checks} teaching-copy checks passed.`)
