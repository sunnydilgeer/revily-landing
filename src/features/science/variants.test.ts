import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { getScienceLessons, parseScienceVariant, scienceHubHref, scienceLessonHref } from './lessonNavigation'
import { createPreviewSessionEngine } from './previewSession'
import { gradeResponse, evidenceProfile, recommendedNext } from './engine'
import { TeachingChunk } from './components/TeachingChunk'
import { ScienceVariantSwitch } from './components/ScienceVariantSwitch'
import { teachingFrames as a1 } from './lesson-1/teachingFrames'
import { microscopyFrames as a2 } from './lesson-2/teachingFrames'
import { practicalFrames as a3 } from './lesson-3/teachingFrames'
import { specialisationFrames as a4 } from './lesson-4/teachingFrames'
import { divisionFrames as a5 } from './lesson-5/teachingFrames'
import { transportFrames as a6 } from './lesson-6/teachingFrames'
import { teachingFrames as b1 } from './variants/b/lesson-1/teachingFrames'
import { microscopyFrames as b2 } from './variants/b/lesson-2/teachingFrames'
import { practicalFrames as b3 } from './variants/b/lesson-3/teachingFrames'
import { specialisationFrames as b4 } from './variants/b/lesson-4/teachingFrames'
import { divisionFrames as b5 } from './variants/b/lesson-5/teachingFrames'
import { transportFrames as b6 } from './variants/b/lesson-6/teachingFrames'
import type { ScienceLesson } from './types'
const originals = getScienceLessons('a'), simpler = getScienceLessons('b')
const aFrames = [a1,a2,a3,a4,a5,a6], bFrames = [b1,b2,b3,b4,b5,b6]
// Full-content hashes captured immediately before B was implemented.
const originalHashes = [
  "fa57e72fd4f3bf68ade25c3042a0bcd5e362ae436210941046c97a90ae21753e",
  "d3b550ca435463da463600e81bbd796c935404f78ff60f2be05617e8f4cfc1fa",
  "3b09b2e10754b045a0d886e974c4e5443f81ef41006eee1e1f5a0d40032b48d0",
  "4e44cd258c775a713849c2826071170579d21bd7267eec13c59d2f7b8d5849c4",
  "e404c288794f8729ea639e8d2527efdcb82955089a001302cde7b676773b9607",
  "bfc959dea93e4298c08f9a278c1a3ce927a96f2ae0d34e443fa0d497eea500bf"
]
let checks = 0
function check(name: string, fn: () => void) { fn(); checks++; console.log('PASS '+name) }
const at = '2026-09-17T16:00:00.000Z'
function contract(l: ScienceLesson) {
  return { qualification:l.qualification, prerequisites:l.prerequisites, requirements:l.requirements,
    sources:l.sources, reviewStatus:l.reviewStatus,
    states:[...l.states,...l.retrieval].map(s=>({
      id:s.id, kind:s.kind, phase:s.phase, skill:s.skillId, spec:s.specRefs, sources:s.sourceIds,
      visual:s.visual && {id:s.visual.id,kind:s.visual.kind,highlight:s.visual.highlight},
      ...(s.kind==='teaching' ? {media:s.media?.kind} : {
        context:s.contextId,dimensions:s.dimensions,role:s.evidenceRole,exam:s.exam,
        ...(s.kind==='choice' ? {answer:s.answerId,options:s.options.map(o=>({id:o.id,signal:o.misconceptionSignal}))}
          : {marking:s.marking,rubric:s.rubric}),
      }),
    })),
  }
}
for(let i=0;i<6;i++) {
  const a=originals[i].lesson,b=simpler[i].lesson
  check('Lesson '+(i+1)+': A is unchanged; B preserves question and marking contracts',()=>{
    assert.equal(createHash('sha256').update(JSON.stringify(a)).digest('hex'),originalHashes[i])
    assert.equal(b.id,a.id+'-B'); assert.equal(b.contentVersion,'0.1.0')
    assert.deepEqual(contract(b),contract(a))
  })
  check('Lesson '+(i+1)+': every B frame has independent simpler copy, matching visual and script',()=>{
    assert.deepEqual(Object.keys(bFrames[i]),Object.keys(aFrames[i]))
    let aWords=0,bWords=0
    for(const [id,frames] of Object.entries(bFrames[i])) {
      const s=b.states.find(s=>s.id===id)!
      assert.ok(s.kind==='teaching' && s.media)
      assert.equal(s.media.script,frames.map(f=>f.label+'. '+f.summary+' '+f.text).join(' '))
      assert.equal(frames.length,aFrames[i][id].length)
      frames.forEach((f,j)=>{
        const old=aFrames[i][id][j]
        assert.notEqual(f.text,old.text)
        assert.deepEqual([f.part,f.diagram,f.focus],[old.part,old.diagram,old.focus])
        assert.ok(f.text&&f.summary&&f.cue)
        const html=renderToStaticMarkup(createElement(TeachingChunk,{state:s,onExposure:()=>{},customFrames:[f]}))
        assert.ok(html.includes('science-walkthrough')&&!html.includes('NaN'))
        const escaped=f.text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;'}[c]!))
        assert.ok(html.includes(escaped),'The real teaching component must render B copy, not A copy.')
        aWords+=old.text.split(/\s+/).length; bWords+=f.text.split(/\s+/).length
      })
    }
    assert.ok(bWords<aWords,'B teaching should reduce reading load across the lesson')
  })
  check('Lesson '+(i+1)+': every B option grades correctly, written work remains pending',()=>{
    for(const s of [...b.states,...b.retrieval]) {
      if(s.kind==='teaching')continue
      assert.ok(s.hint&&s.explanation.answer&&s.explanation.steps.length)
      if(s.kind==='choice') {
        s.options.forEach(o=>assert.equal(gradeResponse(s,o.id).result,o.id===s.answerId?'correct':'incorrect'))
        const old=a.states.concat(a.retrieval).find(old=>old.id===s.id)!
        assert.ok(old.kind==='choice')
        if(s.dimensions.includes('calculation')) assert.equal(
          s.options.find(o=>o.id===s.answerId)!.label.replace(/[^0-9.−+-]/g,''),
          old.options.find(o=>o.id===old.answerId)!.label.replace(/[^0-9.−+-]/g,''))
        assert.throws(()=>gradeResponse(s,'not-an-option'))
      } else assert.equal(gradeResponse(s,'Unmarked test response.').result,'pendingTeacherReview')
    }
  })
  check('Lesson '+(i+1)+': full B flow, reload, hints, drafts, locks and next lesson',()=>{
    const e=createPreviewSessionEngine(b), r=e.previewReducer
    let session=e.createPreviewSession('B-flow-'+i)
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
    if(next.kind==='lesson')assert.equal(next.lessonId,simpler[i+1].lesson.id)
    assert.equal(e.restorePreviewSession({...opening,lessonId:a.id}),null)
  })
}
check('29 separate records; A/B answers and drafts cannot leak or cross-restore',()=>{
  const items=[...originals,...simpler]
  const engines=items.map(x=>createPreviewSessionEngine(x.lesson))
  assert.equal(new Set(engines.map(e=>e.storageKey)).size,29)
  engines.forEach((e,i)=>{
    const original=e.createPreviewSession('isolation')
    for(const other of engines) if(e!==other)assert.equal(other.restorePreviewSession(original),null)
    const state=items[i].lesson.states[0]
    assert.ok(state.kind==='choice')
    const answered=e.previewReducer(original,{type:'answer',response:state.answerId,at})
    assert.equal(Object.keys(original.answers).length,0)
    assert.equal(Object.keys(answered.answers).length,1)
  })
})
check('variant parsing, same-activity switch and hub/menu links preserve variant',()=>{
  assert.equal(parseScienceVariant('b'),'b')
  for(const v of [undefined,'a','B','bad',['b']]) assert.equal(parseScienceVariant(v),'a')
  assert.equal(scienceHubHref('a'),'/preview/science')
  assert.equal(scienceHubHref('b'),'/preview/science?variant=b')
  assert.equal(scienceLessonHref(1,'a'),'/preview/science?lesson=1')
  assert.equal(scienceLessonHref(1,'b','B1-02'),'/preview/science?lesson=1&variant=b&activity=B1-02')
  const html=renderToStaticMarkup(createElement(ScienceVariantSwitch,{variant:'b',lessonNumber:1,activity:'B1-02'}))
  assert.ok(html.includes('aria-current="page"')&&html.includes('B · Easier wording')&&html.includes('activity=B1-02'))
  const e=createPreviewSessionEngine(simpler[0].lesson),session=e.createPreviewSession('invalid')
  assert.equal(e.previewReducer(session,{type:'jump',id:'unknown'}),session)
})
check('B retains scientific qualifications and practical safety rather than hiding them',()=>{
  const texts=bFrames.map(fs=>Object.values(fs).flat().map(f=>f.summary+' '+f.text).join(' '))
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
console.log(checks+' variant checks passed.')
