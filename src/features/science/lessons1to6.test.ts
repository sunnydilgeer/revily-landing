import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { scienceLessons } from './lessonNavigation'
import { createPreviewSessionEngine } from './previewSession'
import { gradeResponse, evidenceProfile, recommendedNext } from './engine'
import { TeachingChunk } from './components/TeachingChunk'
import { teachingFrames as f1 } from './lesson-1/teachingFrames'
import { microscopyFrames as f2 } from './lesson-2/teachingFrames'
import { practicalFrames as f3 } from './lesson-3/teachingFrames'
import { specialisationFrames as f4 } from './lesson-4/teachingFrames'
import { divisionFrames as f5 } from './lesson-5/teachingFrames'
import { transportFrames as f6 } from './lesson-6/teachingFrames'
// Lessons 1–6: teaching copy, grading, the full flow and saved records.
const lessons = scienceLessons
const lessonFrames = [f1,f2,f3,f4,f5,f6]
let checks = 0
function check(name: string, fn: () => void) { fn(); checks++; console.log('PASS '+name) }
const at = '2026-09-17T16:00:00.000Z'
for(let i=0;i<6;i++) {
  const b=lessons[i].lesson
  check('Lesson '+(i+1)+': every teaching frame renders, with a matching visual target and script',()=>{
    for(const [id,frames] of Object.entries(lessonFrames[i])) {
      const s=b.states.find(s=>s.id===id)!
      assert.ok(s.kind==='teaching' && s.media)
      assert.equal(s.media.script,frames.map(f=>f.label+'. '+f.summary+' '+f.text).join(' '))
      frames.forEach(f=>{
        assert.ok(f.text&&f.summary&&f.cue)
        const html=renderToStaticMarkup(createElement(TeachingChunk,{state:s,onExposure:()=>{},customFrames:[f]}))
        assert.ok(html.includes('science-walkthrough')&&!html.includes('NaN'))
        const escaped=f.text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;'}[c]!))
        assert.ok(html.includes(escaped),'The real teaching component must render the lesson copy.')
      })
    }
  })
  check('Lesson '+(i+1)+': every option grades correctly, written work remains pending',()=>{
    for(const s of [...b.states,...b.retrieval]) {
      if(s.kind==='teaching')continue
      assert.ok(s.hint&&s.explanation.answer&&s.explanation.steps.length)
      if(s.kind==='choice') {
        s.options.forEach(o=>assert.equal(gradeResponse(s,o.id).result,o.id===s.answerId?'correct':'incorrect'))
        assert.throws(()=>gradeResponse(s,'not-an-option'))
      } else assert.equal(gradeResponse(s,'Unmarked test response.').result,'pendingTeacherReview')
    }
  })
  check('Lesson '+(i+1)+': full flow, reload, hints, drafts, locks and next lesson',()=>{
    const e=createPreviewSessionEngine(b), r=e.previewReducer
    let session=e.createPreviewSession('flow-'+i)
    const opening=session
    assert.equal(r(session,{type:'continue',at}),session)
    session=r(session,{type:'hint'}); session=e.restorePreviewSession(session)!
    assert.ok(session.hintsUsed.includes(b.states[0].id))
    assert.equal(Object.keys(session.answers).length,0)
    session=r(session,{type:'hint'}); assert.equal(session.hintsOpen.length,0)
    for(const state of b.states) {
      assert.equal(session.currentId,state.id)
      if(state.kind!=='teaching') {
        if(state.kind==='written') {
          session=r(session,{type:'draft',response:'Test explanation.'})
          session=e.restorePreviewSession(session)!
          assert.equal(session.drafts[state.id],'Test explanation.')
        }
        session=r(session,{type:'answer',response:state.kind==='choice'?state.answerId:'Test explanation.',at})
        assert.equal(r(session,{type:'answer',response:'Change after submission.',at}),session)
        if(state.kind==='written') assert.equal(session.answers[state.id].result,'pendingTeacherReview')
      }
      session=r(session,{type:'continue',at})
      assert.ok(e.restorePreviewSession(session))
    }
    assert.equal(session.currentId,null); assert.equal(session.completedIds.length,b.states.length)
    const cleanProfile=evidenceProfile(b,Object.values(session.answers).map(event=>({...event,usedHint:false})))
    const next=recommendedNext(cleanProfile,false,b)
    assert.equal(next.kind,'lesson')
    if(next.kind==='lesson')assert.equal(next.lessonId,lessons[i+1].lesson.id)
    assert.equal(e.restorePreviewSession({...opening,lessonId:lessons[i+1].lesson.id}),null)
  })
}
check('Lessons 1–6 keep separate records; answers and drafts cannot leak or cross-restore',()=>{
  const items=lessons.slice(0,6)
  const engines=items.map(x=>createPreviewSessionEngine(x.lesson))
  assert.equal(new Set(engines.map(e=>e.storageKey)).size,6)
  engines.forEach((e,i)=>{
    const original=e.createPreviewSession('isolation')
    for(const other of engines) if(e!==other)assert.equal(other.restorePreviewSession(original),null)
    const state=items[i].lesson.states[0]
    assert.ok(state.kind==='choice')
    const answered=e.previewReducer(original,{type:'answer',response:state.answerId,at})
    assert.equal(Object.keys(original.answers).length,0)
    assert.equal(Object.keys(answered.answers).length,1)
  })
  const e=engines[0],session=e.createPreviewSession('invalid')
  assert.equal(e.previewReducer(session,{type:'jump',id:'unknown'}),session)
})
check('Teaching keeps scientific qualifications and practical safety rather than hiding them',()=>{
  const texts=lessonFrames.map(fs=>Object.values(fs).flat().map(f=>f.summary+' '+f.text).join(' '))
  assert.match(texts[0],/aerobic respiration/)
  assert.match(texts[0],/Some bacteria have plasmids; others do not/)
  assert.match(texts[0],/Not every plant cell has chloroplasts/)
  assert.match(texts[2],/eye protection/)
  assert.match(texts[2],/never pick it up by hand/)
  assert.match(texts[2],/Do not move the lens towards the glass/)
  assert.match(texts[2],/does not replace doing it/)
  assert.match(texts[4],/most human cell types/)
  assert.match(texts[4],/not guaranteed cures/)
  assert.match(texts[5],/no net movement/)
  assert.match(texts[5],/partially permeable membrane/)
  assert.match(texts[5],/risk-assessed method/)
  assert.match(texts[5],/does not replace doing it/)
})
console.log(checks+' Lessons 1–6 checks passed.')
