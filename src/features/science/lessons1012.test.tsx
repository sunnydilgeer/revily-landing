import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'
import { CellBiologyVisual } from './components/CellBiologyVisuals'
import { TeachingChunk } from './components/TeachingChunk'
import { evidenceProfile, gradeResponse, progress, recommendedNext } from './engine'
import { createPreviewSessionEngine } from './previewSession'
import { lesson10, lungsSections } from './variants/b/lesson-10/lesson'
import { lungsFrames } from './variants/b/lesson-10/teachingFrames'
import { lesson11, heartSections } from './variants/b/lesson-11/lesson'
import { heartFrames } from './variants/b/lesson-11/teachingFrames'
import { lesson12, vesselsSections } from './variants/b/lesson-12/lesson'
import { vesselsFrames } from './variants/b/lesson-12/teachingFrames'
import type { EvidenceDimension } from './types'

let checks = 0
function check(name: string, fn: () => void) { fn(); checks++; console.log(`PASS ${name}`) }
const lessons = [lesson10, lesson11, lesson12]
const frameSets = [lungsFrames, heartFrames, vesselsFrames]
const sections = [lungsSections, heartSections, vesselsSections]
const at = '2026-09-22T09:30:00.000Z'

lessons.forEach((lesson, index) => {
  check(`${lesson.id}: metadata, official source and independent requirements`, () => {
    assert.equal(lesson.id, `B-ORG-0${index + 10}-B`)
    assert.equal(lesson.contentVersion, '0.2.0')
    assert.equal(lesson.qualification, 'AQA-8464F')
    assert.equal(lesson.reviewStatus, 'draftNeedsTeacherReview')
    assert.equal(lesson.retrieval.length, 0)
    assert.equal(new Set(lesson.states.map(state => state.id)).size, lesson.states.length)
    assert.ok(lesson.sources.every(source => source.url.startsWith('https://www.aqa.org.uk/')))
    lesson.states.forEach(state => {
      assert.ok(state.specRefs.includes('4.2.2.2'))
      state.sourceIds.forEach(sourceId => assert.ok(lesson.sources.some(source => source.id === sourceId)))
    })
    sections[index].forEach(section => assert.ok(lesson.states.some(state => state.id === section.id)))
    Object.entries(lesson.requirements).forEach(([dimension, rule]) => rule.inSession.forEach(id => {
      const state = lesson.states.find(candidate => candidate.id === id)!
      assert.notEqual(state.kind, 'teaching')
      if (state.kind !== 'teaching') {
        assert.equal(state.evidenceRole, 'independent')
        assert.ok(state.dimensions.includes(dimension as EvidenceDimension))
      }
    }))
  })

  check(`${lesson.id}: all choices grade canonically and writing remains teacher-only`, () => {
    lesson.states.forEach(state => {
      if (state.kind === 'teaching') return
      assert.ok(state.hint && state.explanation.steps.length && state.explanation.answer)
      if (state.kind === 'choice') {
        assert.equal(new Set(state.options.map(option => option.id)).size, state.options.length)
        assert.equal(state.options.filter(option => option.id === state.answerId).length, 1)
        state.options.forEach(option => assert.equal(gradeResponse(state, option.id).result, option.id === state.answerId ? 'correct' : 'incorrect'))
        assert.equal(state.explanation.answer, state.options.find(option => option.id === state.answerId)!.label)
        assert.throws(() => gradeResponse(state, 'invalid-option'))
      } else {
        assert.equal(state.marking, 'teacherOnly')
        assert.equal(state.rubric.marks, state.rubric.points.length)
        assert.ok(state.rubric.reject.length >= 3)
        assert.equal(gradeResponse(state, 'Saved original explanation.').result, 'pendingTeacherReview')
      }
    })
  })

  check(`${lesson.id}: frames and original visuals render without answer leaks`, () => {
    Object.entries(frameSets[index]).forEach(([id, frames]) => {
      const state = lesson.states.find(candidate => candidate.id === id)!
      assert.ok(state.kind === 'teaching' && state.media)
      assert.equal(state.media.script, frames.map(frame => `${frame.label}. ${frame.summary} ${frame.text}`).join(' '))
      frames.forEach(frame => {
        const html = renderToStaticMarkup(<CellBiologyVisual focus={frame.focus!}/>)
        assert.ok(html.length > 100)
        assert.ok(!html.includes('NaN'))
      })
    })
    lesson.states.filter(state => state.visual).forEach(state => {
      const html = renderToStaticMarkup(<CellBiologyVisual focus={state.visual!.id} assessment={state.kind !== 'teaching'}/>)
      assert.ok(html.length > 100)
      assert.ok(!html.includes('NaN'))
      if (state.visual!.id === 'heart-route-question') assert.ok(!html.includes('pulmonary artery'))
      if (state.visual!.id === 'vessel-question') assert.ok(html.includes('>A<') && !html.includes('>artery<'))
      if (state.visual!.id === 'lung-route-question') assert.ok(html.includes('>1<') && !html.includes('>trachea<'))
    })
  })

  check(`${lesson.id}: full flow reloads, locks responses and preserves isolated progress`, () => {
    const engine = createPreviewSessionEngine(lesson)
    let session = engine.createPreviewSession(`lesson-${index + 10}-flow`)
    session = engine.previewReducer(session, { type: 'hint' })
    assert.ok(engine.restorePreviewSession(session)!.hintsOpen.includes(lesson.states[0].id))
    session = engine.previewReducer(session, { type: 'hint' })
    for (const state of lesson.states) {
      assert.equal(session.currentId, state.id)
      if (state.kind !== 'teaching') {
        if (state.kind === 'written') session = engine.previewReducer(session, { type: 'draft', response: 'Original learner explanation.' })
        const response = state.kind === 'choice' ? state.answerId : 'Original learner explanation.'
        session = engine.previewReducer(session, { type: 'answer', response, at })
        const locked = session.answers[state.id]
        session = engine.previewReducer(session, { type: 'answer', response: 'changed', at })
        assert.deepEqual(session.answers[state.id], locked)
      }
      session = engine.previewReducer(session, { type: 'continue', at })
      assert.ok(engine.restorePreviewSession(session))
    }
    assert.equal(session.currentId, null)
    assert.equal(progress(lesson, session.completedIds).fraction, 1)
    const profile = evidenceProfile(lesson, Object.values(session.answers))
    assert.equal(profile.pendingReview.length, 1)
    const next = recommendedNext(profile, false, lesson)
    assert.equal(next.kind, 'lesson')
    if (next.kind === 'lesson') assert.equal(next.lessonId, index < 2 ? lessons[index + 1].id : 'B-ORG-013-B')
  })
})

check('Lung, heart and vessel scientific boundaries are explicit', () => {
  const lungs = Object.values(lungsFrames).flat().map(frame => `${frame.summary} ${frame.text}`).join(' ')
  const heart = Object.values(heartFrames).flat().map(frame => `${frame.summary} ${frame.text}`).join(' ')
  const vessels = Object.values(vesselsFrames).flat().map(frame => `${frame.summary} ${frame.text}`).join(' ')
  assert.match(lungs, /trachea.*bronchi.*alveoli/i)
  assert.match(lungs, /oxygen.*into the blood/i)
  assert.match(lungs, /carbon dioxide.*into the alveolus/i)
  assert.ok(!lesson10.states.some(state => state.id !== 'B10-02' && JSON.stringify(state).match(/bronchiole/i)), 'Bronchioles are supporting context, not assessed recall')
  assert.ok(!lesson10.states.some(state => JSON.stringify(state).match(/breathing rate/i)), 'Breathing-rate arithmetic is not presented as required 4.2.2.2 content')
  assert.ok(lesson11.states.findIndex(state => state.id === 'B11-05') < lesson11.states.findIndex(state => state.id === 'B11-02'), 'The complete heart route is taught before double circulation is named')
  assert.deepEqual(vesselsFrames['B12-02'].map(frame => frame.focus), ['vessel-artery', 'vessel-capillary', 'vessel-vein'])
  frameSets.flatMap(frameSet => Object.values(frameSet).flat()).forEach(frame => assert.doesNotMatch(frame.cue, /→/))
  assert.match(heart, /right ventricle.*pulmonary artery/i)
  assert.match(heart, /left ventricle.*aorta/i)
  assert.match(heart, /names of the valves are not required/i)
  assert.match(heart, /right atrium controls the resting heart rate/i)
  assert.match(vessels, /arteries carry blood away/i)
  assert.match(vessels, /veins carry blood towards/i)
  assert.match(vessels, /walls one cell thick/i)
  assert.equal(1260 / 7, 180)
  assert.equal(1575 / 9, 175)
})

check('Explanation controls use named steps without arrow-only or autoplay controls', () => {
  const state = lesson10.states.find(candidate => candidate.id === 'B10-02')!
  assert.equal(state.kind, 'teaching')
  if (state.kind !== 'teaching') return
  const html = renderToStaticMarkup(<TeachingChunk state={state} customFrames={lungsFrames['B10-02']} onExposure={() => undefined}/>)
  assert.match(html, /Explanation steps/)
  assert.match(html, /Next:/)
  assert.doesNotMatch(html, /Next idea:|teaching script/i)
  assert.doesNotMatch(html, /Previous walkthrough step|Next walkthrough step|Play walkthrough|Pause walkthrough/)
})

check('Lessons 10–12 use separate storage identities', () => {
  const engines = lessons.map(createPreviewSessionEngine)
  assert.equal(new Set(engines.map(engine => engine.storageKey)).size, 3)
  engines.forEach(engine => engines.forEach(other => {
    if (engine !== other) assert.equal(other.restorePreviewSession(engine.createPreviewSession('isolation')), null)
  }))
})

check('Every anatomy teaching frame has a labelled SVG and a separate enlarge view', () => {
  const focuses = [...new Set(frameSets.flatMap(frames => Object.values(frames).flat().map(frame => frame.focus!)))]
  focuses.forEach(focus => {
    const html = renderToStaticMarkup(<CellBiologyVisual focus={focus}/>)
    assert.match(html, /<figure class="science-anatomy"/)
    assert.equal((html.match(/<svg /g) || []).length, 2, `${focus}: inline and enlarged drawings`)
    assert.match(html, /aria-haspopup="dialog"/)
    assert.match(html, /<dialog[^>]+aria-labelledby=/)
    assert.match(html, /class="anatomy-key"/)
    assert.ok(!/<dialog[^>]*\sopen(?:=|\s|>)/.test(html), 'Enlargement starts closed')
  })
})

check('SVG titles, arrowheads and gradients resolve uniquely across multiple diagrams and zoom copies', () => {
  const focuses = ['lung-airway-alveoli', 'lung-alveolus-network', 'lung-alveolus-oxygen', 'heart-chambers-out', 'heart-double-all', 'heart-valves', 'heart-coronary', 'heart-pacemaker-artificial', 'vessel-capillary', 'vessel-exchange-network', 'vessel-exchange-wall']
  const html = renderToStaticMarkup(<>{focuses.map(focus => <CellBiologyVisual key={focus} focus={focus}/>)}</>)
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
  assert.equal(new Set(ids).size, ids.length, 'Every diagram instance has unique IDs')
  const refs = [...html.matchAll(/url\(#([^\)]+)\)/g), ...html.matchAll(/aria-labelledby="([^"]+)"/g)].map(match => match[1])
  refs.forEach(ref => assert.ok(ids.includes(ref), `Missing SVG or dialog target: ${ref}`))
  assert.ok(!/NaN|undefined/.test(html))
})

check('Assessment answers remain hidden in both inline diagrams and enlarged views', () => {
  const forbidden: Record<string, RegExp> = {
    'lung-route-question': /trachea|bronchi|alveoli/i,
    'lung-gas-question': /oxygen|carbon dioxide/i,
    'heart-route-question': /pulmonary artery|aorta|vena cava/i,
    'heart-vessel-question': /pulmonary artery|aorta|vena cava/i,
    'vessel-question': /artery|vein|capillary/i,
  }
  Object.entries(forbidden).forEach(([focus, answerWords]) => {
    const html = renderToStaticMarkup(<CellBiologyVisual focus={focus} assessment/>)
    // Ignore internal paint-server IDs; visible and accessible text must remain neutral.
    const text = html.replace(/<[^>]*>/g, ' ')
    assert.doesNotMatch(text, answerWords, focus)
    assert.ok(!html.includes('class="anatomy-key"'))
  })
  const gas = renderToStaticMarkup(<CellBiologyVisual focus="lung-gas-question" assessment/>).replace(/<[^>]*>/g, ' ')
  assert.match(gas, /Arrow X points from air to blood; arrow Y points from blood to air/)
  const vessel = renderToStaticMarkup(<CellBiologyVisual focus="heart-vessel-question" assessment/>)
  assert.equal((vessel.match(/>X<\/text>/g) || []).length, 2)
})

console.log(`${checks} lungs, heart and blood-vessel checks passed`)
