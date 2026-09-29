import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { conserveFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.1.1.1 Energy stores and systems and 6.1.2.1 Energy transfers in a system (conservation of energy, work done and mechanical energy transfers, describing changes in how energy is stored), as on the supplied revision page' }
const skill = 'P-CONSERVE'
const spec = ['6.1.1.1', '6.1.2.1']
const principle = author(skill, spec, ['aqa-physics'])
const force = author(skill, spec, ['aqa-physics'])
const describe = author(skill, spec, ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const conserveSections = [
  { id: 'P2-01', label: 'Start here', detail: 'A ball that bounces lower each time' },
  { id: 'P2-02', label: 'Is energy ever lost?', detail: 'The conservation of energy' },
  { id: 'P2-05', label: 'How do forces move energy?', detail: 'Work done and mechanical transfers' },
  { id: 'P2-08', label: 'How do you describe a change?', detail: 'Four everyday examples' },
  { id: 'P2-11', label: 'On your own', detail: 'Explaining where the energy goes' },
]

const states: ScienceState[] = [
  { ...principle.choice('P2-01', 'A ball is dropped and bounces a little lower each time. Where has the missing energy gone?', ['It has been destroyed', 'It has been turned into nothing', 'It has moved into other stores, such as thermal stores', 'It has gone back up into the sky'], 2, 'Think about the ball hitting the floor.', ['Each bounce warms the ball and the floor a tiny amount.', 'The energy has moved to other stores, not disappeared.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(principle, 'P2-02', 'Is energy ever lost?'),
  principle.choice('P2-03', 'Which statement is the conservation of energy?', ['Energy can be created but not destroyed', 'Energy can be destroyed but not created', 'Energy can never be created or destroyed', 'Energy is used up when things move'], 2, 'It says what can never happen to energy.', ['Energy can be transferred, stored or dissipated.', 'It can never be created or destroyed.'], 'recall'),
  principle.choice('P2-04', 'A phone gets warm when it is used, and that energy is dissipated. What has happened to the energy?', ['It has been destroyed', 'It has been transferred to the thermal store of the surroundings', 'It has been created again in the battery', 'It has become a force'], 1, 'Dissipated energy is spread out, not gone.', ['Dissipated energy has moved to stores we do not want, usually thermal.', 'It is spread out into the surroundings.']),
  t(force, 'P2-05', 'How do forces move energy?'),
  force.choice('P2-06', 'Work done is the same as which other quantity?', ['Energy transferred', 'Force', 'Speed', 'Temperature'], 0, 'Work done and this quantity are both measured in joules.', ['Work done is equal to the energy transferred.', 'Both are measured in joules.'], 'recall'),
  force.choice('P2-07', 'A girl pulls a sledge along the snow. How is energy transferred to the sledge?', ['By radiation', 'By heating', 'Electrically', 'Mechanically'], 3, 'A force is moving an object.', ['When a force moves an object, energy is transferred mechanically.', 'The girl does work on the sledge.']),
  t(describe, 'P2-08', 'How do you describe a change?'),
  describe.choice('P2-09', 'A ball falls from a shelf. Energy is transferred from which store to which store?', ['Kinetic to gravitational potential', 'Chemical to thermal', 'Gravitational potential to kinetic', 'Thermal to kinetic'], 2, 'Height store to movement store.', ['The ball loses height, so its gravitational potential store empties.', 'It speeds up, so its kinetic store fills.']),
  describe.choice('P2-10', 'A cyclist brakes and stops. Which store gains energy in the brakes?', ['Thermal', 'Kinetic', 'Chemical', 'Magnetic'], 0, 'Friction makes brakes warm.', ['Friction between the brakes and the wheel transfers energy mechanically.', 'The brakes and wheels get warmer, so their thermal stores gain energy.']),
  describe.choice('P2-11', 'A ball falls past three positions. At which is its kinetic store greatest? Ignore air resistance.', ['Position 1, at the top', 'Position 2, halfway down', 'All positions are the same', 'Position 3, just above the floor'], 3, 'The ball speeds up as it falls.', ['The ball speeds up as it falls, so its kinetic store grows.', 'It is fastest just before it lands.'], 'application', true, 'conserve-q-drop'),
  force.choice('P2-12', 'A box slides across the floor and stops. Where does the energy from its kinetic store go?', ['It is destroyed by friction', 'To the thermal stores of the box and the floor', 'Into the box as extra mass', 'Back into the box as movement'], 1, 'Friction warms the box and the floor.', ['Friction transfers energy from the kinetic store to thermal stores.', 'The energy is transferred, not destroyed.'], 'application', true),
  principle.choice('P2-13', 'A student says, "The battery is flat, so its energy has been used up." Which is the best correction?', ['The energy was transferred to other stores, and the total is the same', 'The energy is still in the battery', 'The energy was destroyed by the lamp', 'The energy turned into charge'], 0, 'Think about the conservation of energy.', ['Energy is never used up or destroyed.', 'It has been transferred from the chemical store of the battery to other stores.'], 'understanding', true),
  describe.written('P2-14', 'A car brakes to a stop. Describe what happens to its kinetic energy and explain why none is lost.', 'Say where the energy goes and use the conservation of energy.', 'As the car slows down, energy is transferred mechanically from the kinetic store of the car to the thermal stores of the brakes, wheels and surroundings. Friction between the brakes and the wheels does this. No energy is lost, because energy can never be created or destroyed. It is only transferred to different stores.', ['The kinetic store of the car decreases.', 'Energy is transferred mechanically by friction to the thermal stores of the brakes, wheels and surroundings.', 'Energy cannot be created or destroyed, so the total energy stays the same.', 'Some of the energy is dissipated to the surroundings.'], ['Saying the energy is destroyed or used up.', 'Saying the energy disappears when the car stops.', 'Saying the brakes create energy.']),
]

export const lessonP2: ScienceLesson = {
  id: 'P-ENE-002-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Conservation of energy', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
