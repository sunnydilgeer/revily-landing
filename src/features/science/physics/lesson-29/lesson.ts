import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { internalFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.3.1.2 Changes of state and the particle model; 6.3.2.1 Internal energy, as on the supplied revision page' }
const skill = 'P-INTERNAL-ENERGY'
const internal = author(skill, ['6.3.2.1'], ['aqa-physics'])
const heating = author(skill, ['6.3.2.1'], ['aqa-physics'])
const names = author(skill, ['6.3.1.2'], ['aqa-physics'])
const mass = author(skill, ['6.3.1.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const internalSections = [
  { id: 'P29-01', label: 'Start here', detail: 'An ice cube in your hand' },
  { id: 'P29-02', label: 'What is internal energy?', detail: 'Kinetic and potential stores of particles' },
  { id: 'P29-05', label: 'What does heating do?', detail: 'Temperature rise or change of state' },
  { id: 'P29-08', label: 'What are the changes of state called?', detail: 'Melting, freezing, boiling, condensing' },
  { id: 'P29-11', label: 'What stays the same?', detail: 'Physical change and conservation of mass' },
  { id: 'P29-13', label: 'On your own', detail: 'Energy, states and mass' },
]

const states: ScienceState[] = [
  { ...internal.choice('P29-01', 'An ice cube melts in your warm hand. What has happened to the particles in the ice?', ['They have been destroyed', 'They have turned into a different substance', 'They now have more energy and can move past each other', 'They have become smaller'], 2, 'Your hand transfers energy to the ice.', ['Energy is transferred from your hand to the ice by heating.', 'The particles gain energy and can move past each other, so the solid becomes a liquid.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(internal, 'P29-02', 'What is internal energy?'),
  internal.choice('P29-03', 'What is the internal energy of a system?', ['Only the kinetic energy of its particles', 'The total energy its particles have in their kinetic and potential energy stores', 'The energy of the container', 'The energy lost to the surroundings'], 1, 'It counts both kinds of store.', ['Internal energy is the total of the kinetic and potential energy of the particles.', 'It is not just the moving part.'], 'recall'),
  internal.choice('P29-04', 'Why do particles have energy in their kinetic energy stores?', ['Because they are cold', 'Because they are close together', 'Because they are identical', 'Because they move or vibrate'], 3, 'Kinetic means movement.', ['Kinetic energy is energy of movement.', 'Particles that move or vibrate have energy in their kinetic energy stores.']),
  t(heating, 'P29-05', 'What does heating do?'),
  heating.choice('P29-06', 'What does heating a system do to its internal energy?', ['It increases it', 'It decreases it', 'It leaves it unchanged', 'It destroys it'], 0, 'Energy is transferred to the particles.', ['Heating transfers energy to the particles.', 'So the internal energy of the system increases.']),
  heating.choice('P29-07', 'A solid is at its melting point and is still being heated. Where does the energy go?', ['It makes the particles smaller', 'It disappears from the system', 'It goes into breaking bonds between the particles', 'It makes the solid colder'], 2, 'The state is changing, not the temperature.', ['The energy is used to break the bonds between particles.', 'This increases the energy in the potential energy stores of the particles.']),
  t(names, 'P29-08', 'What are the changes of state called?'),
  names.choice('P29-09', 'What is the change of state from a gas to a liquid called?', ['Boiling', 'Condensing', 'Melting', 'Sublimating'], 1, 'The gas cools and turns into drops.', ['A gas changing to a liquid is called condensing.', 'It is the reverse of boiling or evaporating.'], 'recall'),
  names.choice('P29-10', 'In the diagram, which numbered arrow shows a liquid freezing to a solid?', ['Arrow 1', 'Arrow 2', 'Arrow 3', 'Arrow 4'], 3, 'Freezing is the change from liquid to solid.', ['Freezing changes a liquid to a solid.', 'That is arrow 4. Arrow 1 is melting.'], 'understanding', false, 'internal-q-changes'),
  t(mass, 'P29-11', 'What stays the same?'),
  mass.choice('P29-12', 'A 200 g ice cube melts completely. What is the mass of the water?', ['200 g', 'Less than 200 g', 'More than 200 g', '0 g'], 0, 'The number of particles does not change.', ['The same particles are still there.', 'So the mass is conserved: the water has a mass of 200 g.']),
  { ...mass.choice('P29-13', 'A sealed pan holds 0.30 kg of water. It all boils to steam, and none escapes. What is the mass of steam?', ['0.10 kg', '0.60 kg', '0.30 kg', '0 kg'], 2, 'The number of particles stays the same.', ['No particles are lost or added in a change of state.', 'So the mass is conserved and the steam has a mass of 0.30 kg.'], 'application', true) },
  heating.choice('P29-14', 'Ice is heated at its melting point and turns to water with no rise in temperature. Where does the energy go?', ['Into the kinetic energy stores, making the particles vibrate faster', 'Into breaking bonds, increasing the potential energy stores', 'Into making new atoms', 'Out into the surroundings'], 1, 'Think about what happens to the bonds when a solid melts.', ['During a change of state the temperature stays the same.', 'The energy breaks bonds between particles, so it goes into the potential energy stores.'], 'understanding', true),
  mass.choice('P29-15', 'Which statement about a change of state is correct?', ['It is a physical change, and the material gets its properties back if it is reversed', 'It is a chemical change that makes a new substance', 'The number of particles changes', 'The mass changes'], 0, 'Think about water freezing and melting again.', ['A change of state is a physical change.', 'No new substance forms, so reversing it gives back the original properties.'], 'understanding', true),
  internal.written('P29-16', 'Explain what happens to the particles and the internal energy when a solid is heated until it melts.', 'Think about energy transferred, then what happens at the melting point.', 'Heating transfers energy to the particles of the solid, so its internal energy increases. At first the particles vibrate faster and the temperature rises. At the melting point the energy is used to break the bonds between the particles, which increases their potential energy stores. The solid becomes a liquid, but the number of particles and the mass stay the same.', ['Heating transfers energy to the particles, so internal energy increases.', 'Before melting, the particles vibrate faster so the temperature rises.', 'At the melting point the energy breaks bonds between particles (potential energy stores increase).', 'The number of particles, and so the mass, stays the same.'], ['Saying the particles melt.', 'Saying the particles get bigger.', 'Saying energy is used up or destroyed.']),
]

export const lessonP29: ScienceLesson = {
  id: 'P-PRT-029-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Internal energy and changes of state', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
