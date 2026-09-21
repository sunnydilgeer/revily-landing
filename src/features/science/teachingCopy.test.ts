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
// Captured from the six-lesson implementation BEFORE the editorial pass.
// Wording is deliberately excluded; grading, evidence and snapshot identity are not.
const contracts = [
  'e849967e8fae79837a69b6a8eb33e39f2965b5fcfe512f0873a1340bb4d6e39a',
  'b630efecca41487f7ac097b7db69162c929fa1d345b518fe01136411272f0c6e',
  '3e405df7755505026c5f4747ebcfc6cd6da7bede2dc420afd09c7dba9a1e5e19',
  '2ff0ebbc99afb126757a207cc968433f501656fa04989937270fdf40e3949c12',
  '13a12940929de86d18d976bc40a06e3a8e37bcec416088c18e5dc6a3327d70d0',
  'd60da0e646dbb3cddcd3e7b04fe7b134dc2fc9de4a4e0b3d6266c37742967484',
]
let checks = 0
function check(name: string, fn: () => void) { fn(); checks++; console.log(`PASS ${name}`) }
lessons.forEach((l, i) => {
  check(`${l.id}: editorial pass preserves the pre-edit assessment contract`, () => {
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
    assert.equal(createHash('sha256').update(JSON.stringify(contract)).digest('hex'), contracts[i])
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
  assert.match(text[3], /increases.*surface area.*allowing more water/)
  assert.match(text[4], /copying is called replication/)
  assert.match(text[5], /Concentration tells you.*given volume/)
  assert.match(text[5], /more particles leave it than return/)
  assert.match(text[5], /dependent variable|final mass − initial mass/)
})
console.log(`${checks} teaching-copy checks passed.`)
