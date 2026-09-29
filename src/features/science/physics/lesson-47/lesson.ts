import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { newtonLawFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.5.4.2.1 Newton\'s First Law and 6.5.4.2.2 Newton\'s Second Law, as on the supplied revision page' }
const skill = 'P-NEWTON12'
const first = author(skill, ['6.5.4.2.1'], ['aqa-physics'])
const second = author(skill, ['6.5.4.2.2'], ['aqa-physics'])
const calc = author(skill, ['6.5.4.2.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const newtonLawSections = [
  { id: 'P47-01', label: 'Start here', detail: 'A bus at a steady speed' },
  { id: 'P47-02', label: 'What is Newton\'s First Law?', detail: 'Zero resultant force and the five changes' },
  { id: 'P47-05', label: 'What is Newton\'s Second Law?', detail: 'Force, mass and acceleration' },
  { id: 'P47-08', label: 'How do you use F = ma?', detail: 'Estimating the force on a car' },
  { id: 'P47-11', label: 'On your own', detail: 'Calculating, comparing and explaining' },
]

const states: ScienceState[] = [
  { ...first.choice('P47-01', 'A bus is driving along a straight road at a steady 20 m/s. What can you say about the forces on it?', ['The driving force is bigger than the resistive forces', 'The driving force is smaller than the resistive forces', 'The forces on it are balanced', 'Only one force acts on it'], 2, 'A steady speed means no acceleration.', ['The bus is not speeding up or slowing down.', 'So the driving force and the resistive forces are balanced.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(first, 'P47-02', 'What is Newton\'s First Law?'),
  first.choice('P47-03', 'A skater glides in a straight line. The resultant force on her is zero. What does she do?', ['Stops straight away', 'Keeps moving at the same velocity', 'Speeds up', 'Slows down gradually'], 1, 'Zero resultant force means no change in motion.', ['With a resultant force of zero, the motion does not change.', 'She keeps moving at the same velocity.']),
  first.choice('P47-04', 'Which of these is NOT a change in the motion of an object?', ['Starting to move', 'Slowing down', 'Changing direction', 'Moving at a constant velocity'], 3, 'Change means the velocity is different afterwards.', ['Starting, stopping, speeding up, slowing down and changing direction are changes in motion.', 'Moving at a constant velocity is no change.'], 'recall'),
  t(second, 'P47-05', 'What is Newton\'s Second Law?'),
  second.choice('P47-06', 'The same resultant force is used on an empty trolley and on a full trolley. Which is correct?', ['The empty trolley accelerates more', 'The full trolley accelerates more', 'They accelerate by the same amount', 'Neither trolley accelerates'], 0, 'More mass means less acceleration for the same force.', ['The full trolley has more mass.', 'For the same force, the object with more mass accelerates less.']),
  second.choice('P47-07', 'A resultant force of 10 N accelerates a trolley. The force is doubled to 20 N. What happens to the acceleration?', ['It halves', 'It stays the same', 'It doubles', 'It goes up by 10 m/s²'], 2, 'Acceleration is directly proportional to force.', ['Acceleration is directly proportional to the resultant force.', 'Double the force and the acceleration doubles.']),
  t(calc, 'P47-08', 'How do you use F = ma?'),
  calc.choice('P47-09', 'A sledge of mass 60 kg accelerates at 0.5 m/s². What is the resultant force on it?', ['120 N', '30 N', '60.5 N', '0.008 N'], 1, 'Force = mass × acceleration.', ['F = ma = 60 × 0.5.', '60 × 0.5 = 30, so the resultant force is 30 N.'], 'calculation'),
  calc.choice('P47-10', 'Which unit is used for resultant force in the equation F = ma?', ['kg', 'm/s²', 'N', 'J'], 2, 'It is named after Newton.', ['Force is measured in newtons.', 'Mass is in kg and acceleration is in m/s².'], 'recall'),
  { ...calc.choice('P47-11', 'A car of mass 800 kg accelerates at 1.5 m/s². What is the resultant force on the car?', ['533 N', '1.9 N', '801.5 N', '1200 N'], 3, 'Put the numbers into F = ma.', ['F = ma = 800 × 1.5.', '800 × 1.5 = 1200, so the resultant force is 1200 N.'], 'calculation', true) },
  second.choice('P47-12', 'The same force pushes two trolleys. X accelerates at 4 m/s² and Y at 2 m/s². Which has more mass?', ['Trolley X', 'Trolley Y', 'They have the same mass', 'It cannot be worked out'], 1, 'Same force: less acceleration means more mass.', ['The force is the same for both trolleys.', 'Y accelerates less, so Y has the greater mass.'], 'dataInterpretation', true, 'newton12-q-trolleys'),
  first.choice('P47-13', 'A hockey puck slides over ice with almost no friction. Why does it keep moving at the same velocity?', ['It has no mass', 'A force keeps pushing it forward', 'Gravity pulls it along', 'The resultant force on it is close to zero'], 3, 'Think about what changes an object\'s motion.', ['Motion only changes if there is a resultant force.', 'With almost no friction the resultant force is close to zero, so the velocity stays the same.'], 'application', true),
  second.choice('P47-14', 'A resultant force of 12 N gives a trolley 3 m/s². What acceleration does 24 N give it?', ['1.5 m/s²', '3 m/s²', '6 m/s²', '12 m/s²'], 2, 'Double the force on the same mass.', ['The mass is the same, so acceleration is directly proportional to the force.', 'Doubling the force doubles the acceleration to 6 m/s².'], 'application', true),
  second.written('P47-15', 'A van is loaded with heavy boxes. The engine force is the same as before. Explain what happens to the van\'s acceleration.', 'Use the words mass, force and acceleration.', 'The loaded van has more mass. For the same resultant force, an object with more mass accelerates less. So the loaded van accelerates more slowly than the empty van.', ['The loaded van has a bigger mass.', 'The resultant force is the same.', 'A bigger mass gives a smaller acceleration for the same force.'], ['Saying the force gets bigger because the van is heavier.', 'Saying the van accelerates more because it is heavier.', 'Saying the acceleration stays the same.']),
]

export const lessonP47: ScienceLesson = {
  id: 'P-MOT-047-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Newton\'s First and Second Laws', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
