import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { gasParticleFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.3.1.1 The particle model; 6.3.3.1 Particle motion in gases (pressure and temperature at fixed volume), as on the supplied revision page' }
const skill = 'P-GAS-PARTICLES'
const states3 = author(skill, ['6.3.1.1'], ['aqa-physics'])
const pressure = author(skill, ['6.3.3.1'], ['aqa-physics'])
const heat = author(skill, ['6.3.3.1'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const gasParticleSections = [
  { id: 'P27-01', label: 'Start here', detail: 'Which state fills its container' },
  { id: 'P27-02', label: 'How do particles differ in the three states?', detail: 'Arrangement, forces and energy' },
  { id: 'P27-06', label: 'What makes gas pressure?', detail: 'Collisions with the container' },
  { id: 'P27-09', label: 'Why does a hotter gas push harder?', detail: 'Faster particles, fixed volume' },
  { id: 'P27-12', label: 'On your own', detail: 'States, pressure and temperature' },
]

const states: ScienceState[] = [
  { ...states3.choice('P27-01', 'Which state of matter always spreads out to fill the whole of its container?', ['Solid', 'Liquid', 'Gas', 'All three do'], 2, 'Think about what happens to a smell in a room.', ['A gas spreads out to fill its container.', 'Its particles are free to move because there are almost no forces holding them together.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(states3, 'P27-02', 'How do particles differ in the three states?'),
  states3.choice('P27-03', 'In which state are the particles held in a fixed, regular pattern?', ['Gas', 'Solid', 'Liquid', 'None of them'], 1, 'Strong forces hold them close together.', ['In a solid the particles are held in a fixed, regular pattern.', 'They can only vibrate about their fixed positions.'], 'recall'),
  states3.choice('P27-04', 'A single particle of ice is compared with a single particle of water. What is true?', ['The ice particle is bigger', 'The water particle is heavier', 'They are exactly the same particle', 'They are different substances'], 2, 'The state changes, but the particles do not.', ['The particles of a substance are always the same, whatever state it is in.', 'Only the energy and arrangement of the particles are different.']),
  states3.choice('P27-05', 'Which state has particles with the most energy and almost no forces between them?', ['Gas', 'Liquid', 'Solid', 'All the same'], 0, 'These particles move constantly at high speeds.', ['In a gas the particles have the most energy.', 'There are almost no forces between them, so they are not held close together.']),
  t(pressure, 'P27-06', 'What makes gas pressure?'),
  pressure.choice('P27-07', 'What causes the pressure of a gas on the walls of its container?', ['Gas particles sticking to the walls', 'The weight of the container', 'The gas being lighter than air', 'Gas particles colliding with the walls and applying a force'], 3, 'Think about what the moving particles do when they reach the wall.', ['Gas particles collide with the walls.', 'Each collision applies a force, and the force over an area is the pressure.']),
  pressure.choice('P27-08', 'What is pressure?', ['The speed of the particles', 'The force applied over a given area', 'The number of particles in a container', 'The energy stored by a wall'], 1, 'It is a force compared with an area.', ['Pressure is the force applied over a given area.', 'Gas particles hitting a wall create pressure.']),
  t(heat, 'P27-09', 'Why does a hotter gas push harder?'),
  heat.choice('P27-10', 'A gas in a sealed, rigid box is heated. What happens to the average speed of its particles?', ['It increases', 'It decreases', 'It stays the same', 'It falls to zero'], 0, 'A hotter gas has more energy in its kinetic energy stores.', ['Heating increases the average kinetic energy of the particles.', 'So the particles move faster on average.']),
  heat.choice('P27-11', 'Why does the pressure rise when a gas in a fixed container is heated?', ['The particles get bigger', 'The particles slow down and stick', 'The container shrinks', 'The particles hit the walls more often and with more force'], 3, 'Faster particles behave differently at the walls.', ['Faster particles hit the walls more often and with more force.', 'That increases the overall force on the walls, so the pressure rises.']),
  { ...states3.choice('P27-12', 'The diagram shows particles in a container. Which state is it?', ['Solid', 'Gas', 'Liquid', 'A mixture of two states'], 2, 'Look at how close the particles are and whether they follow a pattern.', ['The particles are close together but in an irregular pattern.', 'That describes a liquid.'], 'understanding', true, 'gaspart-q-arrangement') },
  { ...heat.choice('P27-13', 'A sealed can of gas is left in a hot car. Why does the pressure inside rise?', ['The particles move faster and hit the walls harder and more often', 'More particles get into the can', 'The particles get larger', 'The gas cools down'], 0, 'Think about the average speed of the particles.', ['The gas heats up, so its particles have more kinetic energy and move faster.', 'They hit the walls more often and harder, so the pressure rises.'], 'application', true) },
  heat.choice('P27-14', 'Pressure readings of a sealed gas are 100, 107 and 114 kPa at 10, 30 and 50 °C. What pattern is shown?', ['Pressure falls as temperature rises', 'Pressure rises as temperature rises', 'Pressure stays the same', 'Pressure rises and then falls'], 1, 'Read the pressure as the temperature goes up.', ['As the temperature rises from 10 to 50 °C, the pressure rises from 100 kPa to 114 kPa.', 'This fits a fixed volume of gas: hotter particles hit the walls harder.'], 'dataInterpretation', true),
  states3.written('P27-15', 'Explain why decreasing the temperature of a gas in a fixed container decreases its pressure.', 'Think about the speed of the particles and what they do at the walls.', 'Decreasing the temperature lowers the average kinetic energy of the gas particles, so they move more slowly on average. They hit the sides of the container less often and with less force. This decreases the overall force on the container, so the pressure goes down. This only works because the volume is fixed.', ['Lower temperature means lower average kinetic energy, so the particles move slower.', 'Slower particles hit the walls less often.', 'Slower particles hit the walls with less force.', 'So the overall force on the container, and the pressure, decreases.'], ['Saying the particles get smaller.', 'Saying the particles stop moving.', 'Saying the number of particles falls.']),
]

export const lessonP27: ScienceLesson = {
  id: 'P-PRT-027-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'The particle model and gas pressure', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
