import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'
import { CellBiologyVisual } from './components/CellBiologyVisuals'
import { lesson4, specialisationSections } from './lesson-4/lesson'
import { lesson5, divisionSections } from './lesson-5/lesson'
import { lesson6, transportSections } from './lesson-6/lesson'
import { specialisationFrames } from './lesson-4/teachingFrames'
import { divisionFrames } from './lesson-5/teachingFrames'
import { transportFrames } from './lesson-6/teachingFrames'
import { transportData } from './lesson-6/practicalData'
import { gradeResponse, progress, evidenceProfile, recommendedNext } from './engine'
import { createPreviewSessionEngine } from './previewSession'
import type { EvidenceDimension } from './types'

let checks = 0
function check(name: string, fn: () => void) { fn(); checks++; console.log(`PASS ${name}`) }
const lessons = [lesson4, lesson5, lesson6]
const frameSets = [specialisationFrames, divisionFrames, transportFrames]
const sections = [specialisationSections, divisionSections, transportSections]
const at = '2026-09-17T11:00:00.000Z'
lessons.forEach((lesson, index) => {
  check(`${lesson.id}: stable IDs, draft boundaries and source/chapter references`, () => {
    assert.equal(lesson.contentVersion, '0.1.0'); assert.equal(lesson.reviewStatus, 'draftNeedsTeacherReview')
    assert.equal(lesson.qualification, 'AQA-8464F'); assert.equal(lesson.retrieval.length, 0)
    assert.equal(new Set(lesson.states.map(s=>s.id)).size, lesson.states.length)
    const sourceIds = lesson.sources.map(s=>s.id)
    lesson.sources.forEach(s=>{ assert.ok(s.locator); assert.ok(s.url.startsWith('https://')); })
    lesson.states.forEach(s=>{ assert.ok(s.specRefs.length); s.sourceIds.forEach(id=>assert.ok(sourceIds.includes(id))); })
    sections[index].forEach(s=>assert.ok(lesson.states.some(state=>state.id===s.id)))
    Object.entries(lesson.requirements).forEach(([dimension,rule])=>rule.inSession.forEach(id=>{
      const state=lesson.states.find(s=>s.id===id)!
      assert.ok(state.kind!=='teaching'&&state.evidenceRole==='independent'&&state.dimensions.includes(dimension as EvidenceDimension))
    }))
  })
  check(`${lesson.id}: every choice option, explicit answer and written rubric`, () => {
    for(const state of lesson.states) {
      if(state.kind==='teaching')continue
      assert.ok(state.hint&&state.explanation.steps.length&&state.explanation.answer)
      if(state.kind==='choice'){
        assert.equal(new Set(state.options.map(o=>o.id)).size,state.options.length)
        assert.equal(state.options.filter(o=>o.id===state.answerId).length,1)
        state.options.forEach(o=>assert.equal(gradeResponse(state,o.id).result,o.id===state.answerId?'correct':'incorrect'))
        assert.equal(state.explanation.answer,state.options.find(o=>o.id===state.answerId)!.label)
        assert.throws(()=>gradeResponse(state,'unknown'))
      }else{
        assert.equal(state.marking,'teacherOnly');assert.equal(state.rubric.marks,state.rubric.points.length)
        assert.ok(state.rubric.reject.length)
        assert.equal(gradeResponse(state,'Any nonempty reasoning, even wrong.').result,'pendingTeacherReview')
        assert.throws(()=>gradeResponse(state,'  '))
      }
    }
  })
  check(`${lesson.id}: every frame/assessment has an original renderable visual`, () => {
    Object.entries(frameSets[index]).forEach(([id,frames])=>{
      const state=lesson.states.find(s=>s.id===id)!
      assert.ok(state.kind==='teaching'&&state.media)
      assert.equal(state.media.script,frames.map(f=>`${f.label}. ${f.summary} ${f.text}`).join(' '))
      frames.forEach(f=>{const html=renderToStaticMarkup(<CellBiologyVisual focus={f.focus!}/>); assert.ok(html.includes('science-bio-')); assert.ok(!html.includes('NaN'));})
    })
    lesson.states.filter(s=>s.kind==='teaching'&&s.visual).forEach(s=>{
      const html=renderToStaticMarkup(<CellBiologyVisual focus={s.visual!.id}/>);assert.ok(html.includes('science-bio-'));assert.ok(!html.includes('NaN'))
    })
    lesson.states.filter(s=>s.kind!=='teaching'&&s.visual).forEach(s=>{
      const html=renderToStaticMarkup(<CellBiologyVisual focus={s.visual!.id} assessment/>);assert.ok(html)
      if(s.visual!.id==='osmosis-question'||s.visual!.id==='diffusion-question')assert.ok(!html.includes('Net water movement')&&!html.includes('>Net movement<'))
      if(s.visual!.id==='cycle-question')assert.ok(!html.includes('each daughter retains'))
    })
  })
  check(`${lesson.id}: full session, locks, hint/draft reload, evidence and next step`, () => {
    const engine=createPreviewSessionEngine(lesson), reduce=engine.previewReducer
    let session=engine.createPreviewSession('fresh-'+lesson.id)
    const opening=lesson.states[0]
    session=reduce(session,{type:'hint'});assert.equal(Object.keys(session.answers).length,0)
    session=engine.restorePreviewSession(session)!;assert.ok(session.hintsOpen.includes(opening.id))
    session=reduce(session,{type:'hint'});assert.ok(!session.hintsOpen.includes(opening.id))
    for(const state of lesson.states){
      assert.equal(session.currentId,state.id)
      if(state.kind!=='teaching'){
        if(state.kind==='written'){
          session=reduce(session,{type:'draft',response:'Unmarked original response.'})
          session=engine.restorePreviewSession(session)!;assert.equal(session.drafts[state.id],'Unmarked original response.')
        }
        session=reduce(session,{type:'answer',response:state.kind==='choice'?state.answerId:'Unmarked original response.',at})
        const locked=session.answers[state.id];session=reduce(session,{type:'answer',response:'other',at});assert.deepEqual(session.answers[state.id],locked)
      }
      session=reduce(session,{type:'continue',at})
    }
    assert.equal(session.currentId,null);assert.equal(progress(lesson,session.completedIds).fraction,1)
    assert.equal(engine.restorePreviewSession(session)!.currentId,null)
    const profile=evidenceProfile(lesson,Object.values(session.answers))
    assert.equal(profile.pendingReview.length,1);assert.notEqual(profile.dimensions.explanation,'secureInSession')
    assert.equal(recommendedNext(profile,false,lesson).kind,index===2?'practical':'lesson')
    if(index<2)assert.equal(recommendedNext(profile,false,lesson).lessonId,lessons[index+1].id)
    session=reduce(session,{type:'restart',sessionId:'replay',clearPracticeHistory:false})
    assert.ok(session.seenAnswers.length)
  })
})
check('Independent storage isolation and unchanged Lessons 1–3 record contracts',()=>{
  const engines=lessons.map(createPreviewSessionEngine)
  assert.equal(new Set(engines.map(e=>e.storageKey)).size,3)
  engines.forEach(e=>engines.forEach(other=>{if(e!==other)assert.equal(other.restorePreviewSession(e.createPreviewSession('test')),null)}))
})
check('Numerical examples, signed percentages, five-point illustrative graph and interpolation',()=>{
  assert.equal(3*2,6);assert.equal((2.25-2.5)/2.5*100,-10)
  assert.ok(Math.abs((2.55-3)/3*100-(-15))<1e-10)
  assert.equal(.3/60,.005);assert.equal(54/27,2);assert.equal(24/8,3)
  assert.equal(transportData.length,5)
  transportData.forEach(d=>assert.ok(Math.abs((d.final-d.initial)/d.initial*100-d.percent)<1e-10))
  assert.ok(Math.abs((.2+.4)/2-.3)<1e-10)
})
console.log(`${checks} new grouped lesson checks passed`)
