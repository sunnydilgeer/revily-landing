import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { storeFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.1.1.1 Energy stores and systems (the eight energy stores, four ways of transferring energy, systems and closed systems), as on the supplied revision page' }
const skill = 'P-STORES'
const stores = author(skill, ['6.1.1.1'], ['aqa-physics'])
const moves = author(skill, ['6.1.1.1'], ['aqa-physics'])
const systems = author(skill, ['6.1.1.1'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const storeSections = [
  { id: 'P1-01', label: 'Start here', detail: 'Breakfast and a run for the bus' },
  { id: 'P1-02', label: 'What are energy stores?', detail: 'The eight places energy is kept' },
  { id: 'P1-06', label: 'How does energy move?', detail: 'Four ways to transfer energy' },
  { id: 'P1-09', label: 'What is a system?', detail: 'Systems and closed systems' },
  { id: 'P1-12', label: 'On your own', detail: 'Stores, transfers and systems' },
]

const states: ScienceState[] = [
  { ...stores.choice('P1-01', 'You eat breakfast, then run for the bus. What happens to the energy from your food?', ['It is used up and disappears', 'It stays exactly where it was', 'It moves into other stores, such as movement and warmth', 'It is destroyed as you run'], 2, 'Think about what your body does with food.', ['Energy is not used up or destroyed.', 'It moves from the chemical store of your food into other stores, such as kinetic and thermal.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(stores, 'P1-02', 'What are energy stores?'),
  stores.choice('P1-03', 'A bus is moving along the road. In which store does it have energy because it is moving?', ['Kinetic', 'Gravitational potential', 'Elastic potential', 'Nuclear'], 0, 'The name comes from the Greek word for movement.', ['Anything that is moving has energy in its kinetic store.']),
  stores.choice('P1-04', 'A rubber band is stretched. In which store does it have energy?', ['Kinetic', 'Chemical', 'Magnetic', 'Elastic potential'], 3, 'Think of stretching and squashing.', ['Anything stretched or squashed has energy in its elastic potential store.', 'Springs and rubber bands are examples.']),
  stores.choice('P1-05', 'Which store has energy that is released by a chemical reaction, such as in food?', ['Thermal', 'Chemical', 'Nuclear', 'Electrostatic'], 1, 'The store is named after the kind of reaction.', ['Food, fuel and batteries have energy in a chemical store.', 'It is released in a chemical reaction.'], 'recall'),
  t(moves, 'P1-06', 'How does energy move?'),
  moves.choice('P1-07', 'A hot mug of tea warms your cold hands. How is energy transferred from the mug to your hands?', ['Mechanically', 'Electrically', 'By heating', 'By radiation'], 2, 'Energy is moving from something hot to something cold.', ['Energy moves from a hotter object to a colder object by heating.']),
  moves.choice('P1-08', 'A person pushes a box along the floor. How is energy transferred to the box?', ['By heating', 'Mechanically', 'Electrically', 'By radiation'], 1, 'A force is moving an object.', ['When a force moves an object, energy is transferred mechanically.']),
  t(systems, 'P1-09', 'What is a system?'),
  systems.choice('P1-10', 'What is a closed system?', ['A system where nothing is moving', 'A system with only one object in it', 'A system where no matter or energy can enter or leave', 'A system where energy is used up'], 2, 'Think of a locked box.', ['In a closed system, nothing can enter or leave.', 'That includes matter and energy.']),
  systems.choice('P1-11', 'A hot block and a cold block are sealed in an insulated box. What happens to the total energy?', ['It goes up', 'It goes down', 'It becomes zero', 'It stays the same'], 3, 'The box is a closed system.', ['Energy moves from the hot block to the cold block by heating.', 'Nothing enters or leaves the box, so the total energy stays the same.']),
  stores.choice('P1-12', 'Which list contains only energy stores?', ['Force, speed, mass', 'Kinetic, thermal, chemical', 'Heating, radiation, mechanically', 'Light, sound, current'], 1, 'Stores are the places energy is kept, not the ways it moves.', ['Kinetic, thermal and chemical are all stores.', 'Heating, radiation and mechanically are ways of transferring energy.'], 'recall', true),
  stores.choice('P1-13', 'Which numbered object has energy in its elastic potential store?', ['Object 1', 'Object 2', 'Object 3', 'Object 4'], 2, 'Look for the one that is stretched or squashed.', ['A stretched or squashed object stores energy in its elastic potential store.', 'Only the object that is stretched or squashed fits.'], 'application', true, 'estore-q-objects'),
  moves.choice('P1-14', 'Energy is transferred electrically from the mains to a fan. Which store gains energy as the blades spin?', ['Kinetic', 'Chemical', 'Gravitational potential', 'Nuclear'], 0, 'The blades are moving.', ['Spinning blades are moving, so they have energy in their kinetic store.'], 'application', true),
  stores.written('P1-15', 'A person lifts a box onto a high shelf. Describe the energy transfer, naming the stores and how energy is transferred.', 'Say which store the energy leaves, which it reaches, and how.', 'Energy is transferred mechanically from the chemical store of the person to the gravitational potential store of the box. The person applies a force that moves the box upwards. The energy is transferred, not used up.', ['Energy leaves the chemical store of the person.', 'Energy reaches the gravitational potential store of the box.', 'It is transferred mechanically, because a force moves the box.', 'Energy is transferred, not used up or destroyed.'], ['Saying the energy is used up or lost.', 'Naming the kinetic store as the store that gains energy at the shelf.', 'Saying the energy is transferred by heating or by radiation.']),
]

export const lessonP1: ScienceLesson = {
  id: 'P-ENE-001-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Energy stores and systems', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
