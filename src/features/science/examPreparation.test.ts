import assert from 'node:assert/strict'
import { getScienceLessons } from './lessonNavigation'
import { createPreviewSessionEngine } from './previewSession'
import { coverageTopics, coverageLessonHref, initialPaperMappings, mappingStorageKey, paperLink, pilotStorageKey, newPilotSession, pilotReducer, restorePilotSession, restoreMappings, transportPilot, validMapping, type PaperMapping } from './examPreparation'
let checks = 0
function check(name: string, fn: () => void) { fn(); checks++; console.log('PASS ' + name) }
check('Coverage: 18 unique topics cover all six lessons with valid exact A/B targets', () => {
  assert.equal(coverageTopics.length, 18); assert.equal(new Set(coverageTopics.map(t => t.id)).size, 18)
  assert.deepEqual([...new Set(coverageTopics.map(t => t.lesson))], [1,2,3,4,5,6])
  for (const variant of ['a', 'b'] as const) for (const topic of coverageTopics) {
    const lesson = getScienceLessons(variant).find(l => l.number === topic.lesson)!.lesson
    assert.ok(lesson.states.some(s => s.id === topic.activity))
    assert.ok(topic.spec && topic.skills)
    assert.match(coverageLessonHref(topic, variant), new RegExp(`lesson=${topic.lesson}.*activity=${topic.activity}`))
    assert.equal(coverageLessonHref(topic, variant).includes('variant=b'), variant === 'b')
  }
})
check('Paper references: inherited candidates are pending, with no fabricated marks or matches', () => {
  assert.deepEqual(initialPaperMappings.map(m => m.question), ['01.2','01.3','01.4'])
  assert.ok(initialPaperMappings.every(m => m.review === 'pending' && m.marks === null && !m.topicIds.length && !m.checkedAt))
  assert.deepEqual(restoreMappings(initialPaperMappings), initialPaperMappings)
  assert.equal(paperLink(initialPaperMappings[0], 'QP'), 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2023/june/AQA-8464B1F-QP-JUN23.PDF')
  assert.match(paperLink({ ...initialPaperMappings[0], series: 'November', year: 2021 }, 'MS'), /2021\/november\/AQA-8464B1F-MS-NOV21.PDF$/)
})
const checked: PaperMapping = { ...initialPaperMappings[0], marks: 2, topicIds: ['cell-parts'], readiness: 'ready', additionalKnowledge: '', review: 'teacherChecked', reviewer: 'Test reviewer', checkedAt: '2026-09-17T12:00:00Z' }
check('Mapping review: ready needs teaching; teacher-checked needs reviewer, marks and date', () => {
  assert.ok(validMapping(checked))
  for (const invalid of [{ ...checked, topicIds: [] },{ ...checked, reviewer: '' },{ ...checked, marks: null },{ ...checked, checkedAt: 'bad-date' },{ ...checked, year: 2026 },{ ...checked, topicIds: ['missing'] },{ ...checked, topicIds: ['cell-parts','cell-parts'] },{ ...checked, question: '01' },{ ...checked, marks: -1 },{ ...checked, readiness: 'partial', additionalKnowledge: '' }]) assert.equal(validMapping(invalid), false)
  assert.ok(validMapping({ ...checked, readiness: 'notTaught', topicIds: [], additionalKnowledge: 'Requires a topic outside Cell Biology.' }))
})
check('Mapping restore: corrupt, duplicate and oversized records are rejected', () => {
  for (const invalid of [null, {}, [null], [checked,checked], [checked,{ ...checked,id:'second' }], Array.from({length:101},(_,i)=>({...checked,id:String(i),question:`01.${i}`}))]) assert.equal(restoreMappings(invalid), null)
  assert.deepEqual(restoreMappings([]), [])
  assert.equal(validMapping({ ...checked, review: 'pending', checkedAt: checked.checkedAt }), false)
})
check('Pilot: original worked/supported/independent sequence and marking-point counts', () => {
  assert.deepEqual(transportPilot.map(t => t.stage), ['worked','supported','independent','independent'])
  assert.equal(new Set(transportPilot.map(t=>t.id)).size, 4)
  for (const task of transportPilot) {
    assert.equal(task.points.length,task.marks)
    assert.ok(task.model && task.commonSlip && task.prompt.includes(`[${task.marks} marks]`))
    assert.ok(task.topicIds.every(id=>coverageTopics.some(t=>t.id===id && t.lesson===6)))
    assert.equal(Boolean(task.scaffold),task.stage==='supported')
  }
  assert.match(transportPilot[2].model, /−10%/); assert.match(transportPilot[2].model, /−0.40 ÷ 4.00/)
})
check('Pilot gates: no blank submission, skipped task or independent answer reveal', () => {
  let s=newPilotSession()
  assert.deepEqual(pilotReducer(s,{type:'next'}),s)
  assert.deepEqual(pilotReducer(s,{type:'submit'}),s)
  s=pilotReducer(s,{type:'reveal'}); s=pilotReducer(s,{type:'next'})
  assert.equal(s.current,1); assert.deepEqual(pilotReducer(s,{type:'reveal'}),s)
  assert.deepEqual(pilotReducer(s,{type:'submit'}),s)
  s=pilotReducer(s,{type:'draft',text:'  '}); assert.deepEqual(pilotReducer(s,{type:'submit'}),s)
})
check('Pilot full flow: drafts, reload, locks, models and summary survive without marks', () => {
  let s=newPilotSession(); s=pilotReducer(s,{type:'reveal'}); s=pilotReducer(s,{type:'next'})
  for (let i=1;i<4;i++) {
    const task=transportPilot[i]
    s=pilotReducer(s,{type:'draft',text:`My original answer ${i}`})
    s=restorePilotSession(JSON.parse(JSON.stringify(s)))!
    assert.ok(s); s=pilotReducer(s,{type:'submit'})
    const locked=s; assert.deepEqual(pilotReducer(s,{type:'submit'}),locked)
    assert.deepEqual(pilotReducer(s,{type:'draft',text:'replacement'}),locked)
    assert.equal(s.submitted[task.id],`My original answer ${i}`)
    if(i===1) s=pilotReducer(s,{type:'reveal'})
    s=pilotReducer(s,{type:'next'}); assert.ok(restorePilotSession(s))
  }
  assert.equal(s.current,4); assert.equal(Object.keys(s.submitted).length,3)
  assert.ok(!('score' in s)); assert.ok(!('completedIds' in s)); assert.ok(!('events' in s))
  assert.equal(pilotReducer(s,{type:'back'}).current,3)
  assert.equal(pilotReducer(pilotReducer(s,{type:'back'}),{type:'next'}).current,4)
})
check('Pilot restore: malformed, unlocked or prematurely completed snapshots rejected', () => {
  const empty=newPilotSession()
  for(const invalid of [null,{}, { ...empty,version:2 },{ ...empty,current:-1 },{ ...empty,current:5 },{ ...empty,current:2 },{ ...empty,modelSeen:['EP6-02'] },{ ...empty,modelSeen:['missing'] },{ ...empty,submitted:{'EP6-02':'answer'} },{ ...empty,drafts:[] },{ ...empty,drafts:{unknown:'draft'} }]) assert.equal(restorePilotSession(invalid),null)
  assert.ok(restorePilotSession(empty))
  assert.equal(pilotReducer(empty,{type:'back'}).current,0)
})
check('Exam storage: map and A/B pilot records cannot overwrite any lesson progress key', () => {
  const keys=[mappingStorageKey,pilotStorageKey('a'),pilotStorageKey('b'),...(['a','b'] as const).flatMap(v=>getScienceLessons(v).map(l=>createPreviewSessionEngine(l.lesson).storageKey))]
  assert.equal(new Set(keys).size,27)
})
console.log(`${checks} exam-preparation grouped checks passed`)
