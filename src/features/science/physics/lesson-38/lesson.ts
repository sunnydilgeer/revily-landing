import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { contactForceFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.5.1.1 Forces and their interactions (scalar and vector quantities, contact and non-contact forces, interaction pairs), as on the supplied revision page' }
const skill = 'P-FORCEBASICS'
const vec = author(skill, ['6.5.1.1', '6.5.1.2'], ['aqa-physics'])
const kind = author(skill, ['6.5.1.1', '6.5.1.2'], ['aqa-physics'])
const pair = author(skill, ['6.5.1.1', '6.5.1.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const contactForceSections = [
  { id: 'P38-01', label: 'Start here', detail: 'Pushes and pulls' },
  { id: 'P38-02', label: 'What is a vector?', detail: 'Size and direction, and force arrows' },
  { id: 'P38-05', label: 'Contact or non-contact?', detail: 'Forces with and without touching' },
  { id: 'P38-08', label: 'What is an interaction pair?', detail: 'Two objects, two equal forces' },
  { id: 'P38-11', label: 'On your own', detail: 'Sort, read arrows and explain' },
]

const states: ScienceState[] = [
  { ...vec.choice('P38-01', 'Which of these is a force?', ['A temperature of 20 degrees', 'A time of ten seconds', 'A mass of two kilograms', 'A push on a shopping trolley'], 3, 'A force is a push or a pull.', ['A force is a push or a pull that acts on an object.', 'Pushing a trolley is a force. The others are not.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(vec, 'P38-02', 'What is a vector?'),
  vec.choice('P38-03', 'Which pair contains one vector and one scalar?', ['Force and velocity', 'Mass and time', 'Force and mass', 'Speed and distance'], 2, 'A vector has a direction. A scalar does not.', ['Force is a vector because it has a size and a direction.', 'Mass has only a size, so it is a scalar.'], 'recall'),
  vec.choice('P38-04', 'On a box, arrow X points right and is 3 cm long. Arrow Y points left, 1 cm long. Which is correct?', ['The force to the right is bigger', 'The force to the left is bigger', 'The forces are equal', 'The arrows show speed'], 0, 'A longer arrow means a bigger force.', ['The length of an arrow shows the size of the force.', 'Arrow X is longer, so the force to the right is bigger.'], 'dataInterpretation', false, 'contact-q-arrows'),
  t(kind, 'P38-05', 'Contact or non-contact?'),
  kind.choice('P38-06', 'Which of these is a non-contact force?', ['Friction', 'Tension in a rope', 'Air resistance', 'Magnetic force'], 3, 'Which one works across a gap?', ['Non-contact forces can act without the objects touching.', 'Magnetic force is a non-contact force.']),
  kind.choice('P38-07', 'A cyclist brakes and the brake blocks rub on the wheel. Which type of force slows the wheel?', ['A contact force, friction', 'A non-contact force, gravity', 'A non-contact force, magnetism', 'There is no force'], 0, 'Do the blocks touch the wheel?', ['The blocks are touching the wheel.', 'So the force is a contact force, friction.']),
  t(pair, 'P38-08', 'What is an interaction pair?'),
  pair.choice('P38-09', 'A book rests on a table. The book pushes down on the table. What else must be true?', ['The table pushes up on the book with an equal force', 'The table pushes up with a smaller force', 'The table pushes down on the book', 'The table exerts no force'], 0, 'When two objects interact, both feel a force.', ['Interacting objects each feel a force.', 'The two forces are equal in size and opposite in direction.']),
  pair.choice('P38-10', 'The Earth pulls on the Sun with a gravitational force. What is true about the Sun\'s pull on the Earth?', ['It is zero because they do not touch', 'It is bigger and acts the same way', 'It is the same size and acts in the opposite direction', 'It is smaller and acts the same way'], 2, 'Interaction pairs are equal and opposite.', ['The two forces form an interaction pair.', 'They are the same size but act in opposite directions.']),
  kind.choice('P38-11', 'A football is kicked into the air. Which force acting on the ball is a non-contact force?', ['The push from the boot', 'Air resistance', 'The pull of gravity', 'Friction with the grass'], 2, 'Which force acts across a gap?', ['Gravity pulls the ball down without touching it.', 'The others need contact, so gravity is the non-contact force.'], 'application', true),
  vec.choice('P38-12', 'Which list contains only vector quantities?', ['Mass, time, speed', 'Force, velocity, acceleration', 'Temperature, distance, force', 'Speed, mass, displacement'], 1, 'Each vector needs a direction.', ['Vectors have a size and a direction.', 'Force, velocity and acceleration all have a direction.'], 'recall', true),
  vec.choice('P38-13', 'Arrow P shows 20 N. Arrow Q is half as long and points the same way. What force does Q show?', ['5 N', '40 N', '20 N', '10 N'], 3, 'Half as long means half the size.', ['Arrow length shows the size of the force.', 'Half of 20 N is 10 N.'], 'dataInterpretation', true),
  pair.choice('P38-14', 'You pull on a rope with a force of 50 N. What force does the rope exert on you?', ['0 N', '50 N in the opposite direction', '100 N in the same direction', '25 N in the opposite direction'], 1, 'Interacting objects exert equal and opposite forces.', ['You and the rope interact, so each feels a force.', 'The rope pulls back on you with 50 N, in the opposite direction.'], 'application', true),
  kind.written('P38-15', 'Explain the difference between a contact force and a non-contact force. Give one example of each.', 'Do the objects need to touch?', 'A contact force acts when two objects touch. An example is friction. A non-contact force can act without the objects touching. An example is gravity, magnetic force or electrostatic force.', ['A contact force acts when the objects are touching.', 'An example of a contact force, such as friction or tension.', 'A non-contact force can act without the objects touching.', 'An example of a non-contact force, such as gravity or magnetic force.'], ['Saying friction is non-contact.', 'Saying gravity needs touching.', 'Confusing forces with energy.']),
]

export const lessonP38: ScienceLesson = {
  id: 'P-FOR-038-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Contact and non-contact forces', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
