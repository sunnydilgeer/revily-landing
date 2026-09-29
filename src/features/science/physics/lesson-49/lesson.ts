import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { motionPracFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.5.4.2.2 Newton\'s Second Law: required practical investigating the effect of mass and force on acceleration, as on the supplied revision page' }
const skill = 'P-MOTION-PRACTICAL'
const setup = author(skill, ['6.5.4.2.2'], ['aqa-physics'])
const method = author(skill, ['6.5.4.2.2'], ['aqa-physics'])
const mass = author(skill, ['6.5.4.2.2'], ['aqa-physics'])
const force = author(skill, ['6.5.4.2.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const motionPracSections = [
  { id: 'P49-01', label: 'Start here', detail: 'A heavy trolley and a light one' },
  { id: 'P49-02', label: 'What are we measuring?', detail: 'Equipment, mass and force' },
  { id: 'P49-05', label: 'How do you run it?', detail: 'Method and safety' },
  { id: 'P49-08', label: 'How do you change the mass?', detail: 'Masses go on the trolley' },
  { id: 'P49-11', label: 'How do you change the force?', detail: 'Masses move to the hook' },
  { id: 'P49-13', label: 'On your own', detail: 'Calculating, reading results and planning' },
]

const states: ScienceState[] = [
  { ...setup.choice('P49-01', 'Two identical trolleys are pulled with the same force. One carries a heavy load. Which accelerates less?', ['The empty trolley', 'The loaded trolley', 'Both accelerate the same', 'Neither accelerates'], 1, 'More mass means less acceleration for the same force.', ['The loaded trolley has more mass.', 'For the same force, more mass gives less acceleration.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(setup, 'P49-02', 'What are we measuring?'),
  setup.choice('P49-03', 'In this practical, which force makes the trolley accelerate?', ['The weight of the trolley', 'The weight of the hook and its masses', 'The friction of the bench', 'The push of the light gate'], 1, 'Think about what pulls on the string.', ['The hook and its masses fall and pull the string.', 'So the force is the weight of the hook and its masses.']),
  setup.choice('P49-04', 'The hook and its masses have a mass of 500 g. What force accelerates the trolley? Use 9.8 N/kg.', ['4900 N', '49 N', '0.051 N', '4.9 N'], 3, 'Change grams to kilograms first.', ['500 g = 0.50 kg.', 'Weight = 0.50 × 9.8 = 4.9 N.'], 'calculation'),
  t(method, 'P49-05', 'How do you run it?'),
  method.choice('P49-06', 'Why is a starting line marked on the bench?', ['So the trolley always travels the same distance to the light gate', 'To make the trolley heavier', 'To measure the mass', 'To make the string tighter'], 0, 'Think about what must be the same each time.', ['The trolley starts from the same place each run.', 'So it always travels the same distance to the light gate.']),
  method.choice('P49-07', 'Which is a sensible safety step in this practical?', ['Stand with your feet under the hook', 'Hold the hook while it falls', 'Put a box or tray under the falling masses', 'Take the string off the trolley'], 2, 'Think about what could hurt your feet.', ['The hook and masses can fall.', 'A box or tray catches them and keeps your feet safe.']),
  t(mass, 'P49-08', 'How do you change the mass?'),
  mass.choice('P49-09', 'You investigate how mass affects acceleration. Which quantity must stay the same?', ['The total mass', 'The acceleration', 'The time', 'The weight of the hook and its masses'], 3, 'The force is the weight of the hook and its masses.', ['Only one thing should change: the mass.', 'So the force, the weight of the hook and its masses, must stay the same.']),
  mass.choice('P49-10', 'Where should the extra masses go to investigate the effect of mass?', ['On the hook', 'On the pulley', 'On the trolley', 'Under the bench'], 2, 'Adding to the hook would change the force.', ['Masses on the hook change the force.', 'Masses on the trolley change only the total mass.']),
  t(force, 'P49-11', 'How do you change the force?'),
  force.choice('P49-12', 'Why do you move masses from the trolley to the hook, instead of adding new masses to the hook?', ['To keep the total mass the same', 'To make the trolley lighter', 'To reduce the force', 'To stop the light gate working'], 0, 'Only the force should change.', ['Moving a mass does not change the total mass.', 'So only the force changes, and the test stays fair.']),
  { ...setup.choice('P49-13', 'The hook and its masses have a mass of 200 g. What force accelerates the trolley? Use 9.8 N/kg.', ['19.6 N', '1.96 N', '1960 N', '0.020 N'], 1, 'Change grams to kilograms, then multiply by 9.8.', ['200 g = 0.20 kg.', 'Weight = 0.20 × 9.8 = 1.96 N.'], 'calculation', true) },
  mass.choice('P49-14', 'Total masses of 0.5, 1.0 and 1.5 kg gave accelerations of 2.0, 1.0 and 0.7 m/s². What do these results show?', ['More mass gave less acceleration', 'More mass gave more acceleration', 'Mass had no effect on acceleration', 'The acceleration stayed at 1.0 m/s²'], 0, 'Compare how the acceleration changes as the mass rises.', ['The mass goes up: 0.5, 1.0, 1.5 kg.', 'The acceleration goes down: 2.0, 1.0, 0.7 m/s². More mass gave less acceleration.'], 'dataInterpretation', true, 'motionprac-q-table'),
  force.choice('P49-15', 'A student adds extra masses to the hook only. She wants to see how force affects acceleration. What is wrong?', ['The force decreases', 'The light gate stops working', 'The total mass also increases, so the test is not fair', 'Nothing is wrong'], 2, 'Think about what else changes when masses are added.', ['Adding masses to the hook increases the force.', 'It also increases the total mass, so two things change and the test is not fair.'], 'application', true),
  force.written('P49-16', 'Describe how you would investigate the effect of force on the acceleration of a trolley.', 'Say what you change, what you keep the same, and what you record.', 'Join the trolley to a hook by string over a pulley, with a light gate to measure the acceleration. Start with all the extra masses on the trolley. Move the masses one at a time from the trolley to the hook, so the total mass stays the same and the force increases. Release the trolley from the same starting line each time and record the acceleration from the light gate. As the force goes up, the acceleration goes up.', ['Trolley, string, pulley, hook and a light gate to measure acceleration.', 'Start with all the extra masses on the trolley.', 'Move masses from the trolley to the hook one at a time, so the total mass stays the same.', 'Release from the same starting line and record the acceleration each time.', 'As the force goes up, the acceleration goes up.'], ['Adding new masses to the hook so the total mass changes.', 'Changing the mass and the force at the same time.', 'Measuring the mass of the trolley instead of the acceleration.']),
]

export const lessonP49: ScienceLesson = {
  id: 'P-MOT-049-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Investigating motion', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
