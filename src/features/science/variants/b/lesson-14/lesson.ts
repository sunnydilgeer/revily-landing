import type { ScienceLesson, ScienceState } from '../../../types'
import { author, sampledRequirements } from '../../../lessonAuthoring'
import { cardiovascularFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.2.2.4 Coronary heart disease: a non-communicable disease' }
const a = author('B-CARDIOVASCULAR', ['4.2.2.4'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const cardiovascularSections = [
  { id: 'B14-01', label: 'Start here', detail: 'The heart muscle needs oxygen too' },
  { id: 'B14-02', label: 'The heart’s own blood supply', detail: 'Coronary arteries and fatty build-up' },
  { id: 'B14-05', label: 'Fix the pipe: stents', detail: 'Holding a narrowed artery open' },
  { id: 'B14-08', label: 'Slow the problem: statins', detail: 'Lowering blood cholesterol' },
  { id: 'B14-10', label: 'Replace the part: valves', detail: 'Stiff, leaky and replacement valves' },
  { id: 'B14-13', label: 'Replace the whole heart', detail: 'Donor and artificial hearts' },
  { id: 'B14-15', label: 'On your own', detail: 'Choose and compare treatments' },
]

const states: ScienceState[] = [
  { ...a.choice('B14-01', 'Your heart pumps all day. Where does the heart muscle get its oxygen?', ['From blood passing through its chambers', 'From arteries on the outside of the heart', 'It does not need oxygen'], 1, 'Other muscles get oxygen from arteries.', ['The heart wall is thick muscle, and it needs oxygen for respiration.', 'It has its own arteries on the outside that bring it oxygen.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B14-02', 'The heart’s own blood supply'),
  a.choice('B14-03', 'What happens when fatty material builds up inside a coronary artery?', ['It turns into a vein', 'It gets wider and more blood flows', 'It gets narrower and less blood flows'], 2, 'Think about the space left for blood.', ['The fatty layers take up space inside the artery.', 'The artery gets narrower, so less blood flows through it.']),
  a.choice('B14-04', 'Why does coronary heart disease harm the heart muscle?', ['Less oxygen reaches it for respiration', 'It receives too much glucose', 'Its valves turn into fat'], 0, 'What does blood bring to the muscle?', ['Narrow coronary arteries carry less blood.', 'Less oxygen reaches the heart muscle, so it cannot respire properly.']),
  t('B14-05', 'Fix the pipe: stents'),
  a.choice('B14-06', 'How does a stent help a narrowed coronary artery?', ['It lowers cholesterol in the blood', 'It replaces the damaged heart muscle', 'It holds the artery open'], 2, 'Where is a stent placed?', ['A stent is placed inside the narrowed artery.', 'It pushes the walls apart and holds the artery open, so more blood can flow.']),
  a.choice('B14-07', 'Which is a risk of having a stent fitted?', ['A blood clot can form near it', 'It must be taken every day', 'The body rejects it like a donor heart'], 0, 'Think about what could go wrong after the procedure.', ['A stent is fitted once, not taken every day.', 'The risks include infection, or a blood clot forming near the stent.']),
  t('B14-08', 'Slow the problem: statins'),
  a.choice('B14-09', 'What do statins do?', ['Hold a narrowed artery open', 'Lower cholesterol in the blood', 'Replace a faulty valve'], 1, 'Statins are drugs, not devices.', ['A stent holds an artery open, and a new valve replaces a faulty one.', 'Statins are drugs that lower cholesterol in the blood.']),
  t('B14-10', 'Replace the part: valves'),
  a.choice('B14-11', 'Look at this valve. Some blood flows backwards through it. What is wrong?', ['It is stiff', 'It is blocked by fatty material', 'It is leaky'], 2, 'Does it fail to open, or fail to close?', ['A stiff valve does not open fully.', 'This valve does not close fully, so it is leaky.'], 'understanding', false, 'cardio-valve-question'),
  a.choice('B14-12', 'What is a drawback of a mechanical valve?', ['It wears out very quickly', 'The patient may need drugs to stop clots', 'It comes from an animal'], 1, 'Think about blood flowing over a man-made surface.', ['Mechanical valves are man-made and last a long time.', 'Blood clots can form on them, so the patient may need drugs to stop clots.']),
  t('B14-13', 'Replace the whole heart'),
  a.choice('B14-14', 'Why do patients take drugs after a heart transplant?', ['To stop the body rejecting the new heart', 'To lower their blood cholesterol', 'To dissolve fatty material'], 0, 'The new heart’s cells are not the patient’s own.', ['The body’s defences may attack cells that are not its own.', 'Drugs lower the risk of the body rejecting the new heart.']),
  a.choice('B14-15', 'A patient’s coronary artery is badly narrowed. They need better blood flow now. Which treatment fits best?', ['Statins', 'A stent', 'A mechanical valve'], 1, 'Which treatment works straight away, at one place?', ['Statins work slowly, and a valve does not fix an artery.', 'A stent opens that artery straight away.'], 'application', true, 'cardio-treatment-question'),
  a.choice('B14-16', 'Doctors compare a stent and statins for one patient. Which statement is correct?', ['Statins work instantly but need surgery', 'Both remove all risk of heart disease', 'A stent lowers cholesterol all over the body', 'A stent works quickly but has a clot risk; statins work slowly'], 3, 'Each treatment has one benefit and one drawback.', ['A stent opens one artery quickly, but a clot can form near it.', 'Statins slow build-up over time, with no surgery. Neither removes all risk.'], 'understanding', true),
  a.choice('B14-17', 'A patient’s heart cannot pump enough blood. No donor heart is available yet. What could keep them alive?', ['A stent', 'Statins', 'An artificial heart'], 2, 'Which option pumps blood?', ['A stent and statins treat narrowed arteries, not a heart that fails to pump.', 'An artificial heart pumps blood while the patient waits for a donor.'], 'application', true),
  a.written('B14-18', 'Compare stents and statins as treatments for coronary heart disease.', 'Give at least one benefit and one drawback for each treatment.', 'A stent widens a particular narrowed artery and can improve blood flow quickly, but placement carries risks such as infection or clots. Statins lower cholesterol and can reduce future fatty build-up, but they must usually be taken long term and may cause side effects.', ['A stent widens a narrowed coronary artery.', 'A relevant stent drawback, such as procedure, infection or clot risk.', 'Statins lower cholesterol and slow fatty build-up.', 'A relevant statin drawback, such as long-term use, delay or side effects.'], ['A stent is described as a drug that lowers cholesterol.', 'Statins are said to open one artery instantly.', 'Either treatment is claimed to have no risks.']),
]

export const lesson14: ScienceLesson = {
  id: 'B-ORG-014-B', contentVersion: '0.2.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Cardiovascular disease and treatments', prerequisites: ['B-BLOOD'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
