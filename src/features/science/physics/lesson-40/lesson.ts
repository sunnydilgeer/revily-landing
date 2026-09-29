import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { resultantFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.5.1.4 Resultant forces, and 6.5.2 Work done and energy transfer (W = Fs, 1 J = 1 Nm), as on the supplied revision page' }
const skill = 'P-RESULTANT'
const res = author(skill, ['6.5.1.4', '6.5.2'], ['aqa-physics'])
const work = author(skill, ['6.5.1.4', '6.5.2'], ['aqa-physics'])
const fric = author(skill, ['6.5.1.4', '6.5.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const resultantSections = [
  { id: 'P40-01', label: 'Start here', detail: 'Two people pushing' },
  { id: 'P40-02', label: 'What is a resultant force?', detail: 'Add or subtract along a line' },
  { id: 'P40-05', label: 'What is work done?', detail: 'W = Fs and the joule' },
  { id: 'P40-08', label: 'What about centimetres and friction?', detail: 'Unit conversion and heating' },
  { id: 'P40-11', label: 'On your own', detail: 'Calculate, compare and explain' },
]

const states: ScienceState[] = [
  { ...res.choice('P40-01', 'Two friends push a box the same way, with 30 N and 20 N. What is the total push?', ['10 N', '600 N', '50 N', '25 N'], 2, 'They push in the same direction.', ['Forces in the same direction add together.', '30 N + 20 N = 50 N.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(res, 'P40-02', 'What is a resultant force?'),
  res.choice('P40-03', 'A cart is pulled right with 20 N and left with 6 N. What is the resultant force?', ['26 N to the right', '14 N to the right', '14 N to the left', '120 N to the right'], 1, 'Opposite directions: subtract.', ['The forces are in opposite directions, so subtract.', '20 N − 6 N = 14 N, to the right because that force is bigger.'], 'calculation', false, 'resultant-q-cart'),
  res.choice('P40-04', 'Two forces of 25 N act on a box in opposite directions. What is the resultant force?', ['50 N', '25 N', '0 N', '625 N'], 2, 'Equal and opposite forces cancel.', ['Forces in opposite directions are subtracted.', '25 N − 25 N = 0 N, so they cancel out.'], 'calculation'),
  t(work, 'P40-05', 'What is work done?'),
  work.choice('P40-06', 'A force of 25 N pushes a crate 4 m. What is the work done?', ['100 J', '6.25 J', '29 J', '21 J'], 0, 'Work done = force × distance.', ['W = Fs = 25 × 4.', '25 × 4 = 100, so the work done is 100 J.'], 'calculation'),
  work.choice('P40-07', 'One joule is the same as which of these?', ['One newton', 'One newton-metre', 'One metre', 'One kilogram'], 1, 'Force in newtons times distance in metres.', ['A joule is the work done when a force of 1 N moves an object 1 m.', 'So 1 J = 1 Nm.'], 'recall'),
  t(fric, 'P40-08', 'What about centimetres and friction?'),
  fric.choice('P40-09', 'A force of 20 N pushes a book 40 cm along a table. What is the work done?', ['800 J', '8 J', '0.5 J', '60 J'], 1, 'Change 40 cm to metres first.', ['40 cm = 0.4 m.', 'W = Fs = 20 × 0.4 = 8 J.'], 'calculation'),
  fric.choice('P40-10', 'When you push a box across a rough carpet, which store gets some of the energy because of friction?', ['The chemical energy store', 'The nuclear energy store', 'The gravitational energy store', 'The thermal energy store'], 3, 'Friction heats things.', ['Work done against friction transfers energy to the thermal energy store.', 'So the temperature of the box and carpet increases.'], 'understanding'),
  { ...work.choice('P40-11', 'A force of 60 N pushes a trolley 250 cm. What is the work done?', ['15 000 J', '24 J', '150 J', '310 J'], 2, 'Convert to metres first, then W = Fs.', ['250 cm = 2.5 m.', 'W = Fs = 60 × 2.5 = 150 J.'], 'calculation', true) },
  res.choice('P40-12', 'A sledge is pulled right with 40 N. Friction (15 N) and air resistance (5 N) act left. What is the resultant?', ['60 N to the right', '20 N to the right', '20 N to the left', '40 N to the right'], 1, 'Add the two forces on the left, then subtract.', ['The forces to the left add to 15 + 5 = 20 N.', '40 N − 20 N = 20 N, to the right.'], 'calculation', true),
  work.choice('P40-13', 'Which does most work? A: 10 N for 5 m. B: 20 N for 2 m. C: 5 N for 12 m.', ['Push A', 'Push B', 'Push C', 'They do the same work'], 2, 'Work out force × distance for each.', ['A is 50 J, B is 40 J and C is 60 J.', 'Push C does the most work.'], 'dataInterpretation', true),
  fric.choice('P40-14', 'A student rubs their hands together quickly. Why do their hands get warm?', ['Work is done against friction, so energy goes to the thermal store', 'Friction creates new energy', 'The hands lose mass', 'Gravity heats the hands'], 0, 'Think about work done against friction.', ['Rubbing does work against frictional forces.', 'This transfers energy to the thermal energy store, so the temperature rises.'], 'application', true),
  fric.written('P40-15', 'Describe what happens to the energy when you push a box along a rough floor.', 'Think about work done, moving and friction.', 'Your push does work on the box, so energy is transferred. Some of the energy is transferred to the kinetic energy store of the box because it moves. Some is transferred to the thermal energy store because of the work done against friction, so the temperature of the box and floor increases.', ['Work is done by the push, so energy is transferred.', 'Some energy goes to the kinetic energy store because the box moves.', 'Some energy goes to the thermal energy store because of friction.', 'The temperature of the box and floor increases.'], ['Saying energy is used up.', 'Saying friction makes the box lose mass.', 'Saying no energy is transferred.']),
]

export const lessonP40: ScienceLesson = {
  id: 'P-FOR-040-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Resultant forces and work done', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
