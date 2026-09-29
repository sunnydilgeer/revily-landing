import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { elasticFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.5.3 Forces and elasticity (elastic and inelastic deformation, F = ke, limit of proportionality), as on the supplied revision page' }
const skill = 'P-ELASTIC'
const shape = author(skill, ['6.5.3'], ['aqa-physics'])
const link = author(skill, ['6.5.3'], ['aqa-physics'])
const force = author(skill, ['6.5.3'], ['aqa-physics'])
const constant = author(skill, ['6.5.3'], ['aqa-physics'])
const limit = author(skill, ['6.5.3'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const elasticSections = [
  { id: 'P41-01', label: 'Start here', detail: 'A stretched rubber band' },
  { id: 'P41-02', label: 'How do forces change shape?', detail: 'Elastic and inelastic deformation' },
  { id: 'P41-05', label: 'How are force and extension linked?', detail: 'Extension and F = ke' },
  { id: 'P41-07', label: 'How do you find a force?', detail: 'A worked example' },
  { id: 'P41-09', label: 'How do you find the spring constant?', detail: 'k = F ÷ e' },
  { id: 'P41-11', label: 'When does it stop working?', detail: 'The force-extension graph' },
  { id: 'P41-13', label: 'On your own', detail: 'Calculate and explain' },
]

const states: ScienceState[] = [
  { ...shape.choice('P41-01', 'A rubber band is stretched and then let go. What does it do?', ['It stays stretched', 'It goes back to its original length', 'It becomes shorter than before', 'It gets heavier'], 1, 'Think about what a rubber band does when you let go.', ['A rubber band is elastic.', 'When the forces stop, it goes back to its original length.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(shape, 'P41-02', 'How do forces change shape?'),
  shape.choice('P41-03', 'What is needed to change the shape of an object, such as squashing a sponge?', ['One force is enough', 'Only a very large force', 'At least two forces acting on it', 'No force at all'], 2, 'Think about squashing a sponge between your hands.', ['One force on its own just moves the object.', 'To change its shape, more than one force must act on it.']),
  shape.choice('P41-04', 'A spring goes back to its length after being stretched. Plasticine stays squashed. Which is deformed inelastically?', ['The plasticine', 'The spring', 'Both of them', 'Neither of them'], 0, 'Which one does not return to its original shape?', ['Inelastic deformation means the object does not return to its original shape.', 'The plasticine stays squashed, so it is deformed inelastically.'], 'recall'),
  t(link, 'P41-05', 'How are force and extension linked?'),
  link.choice('P41-06', 'A spring is 10 cm long normally. With a mass hanging on it, it is 14 cm long. What is its extension?', ['10 cm', '14 cm', '24 cm', '4 cm'], 3, 'Extension is how much longer the spring has become.', ['Extension = stretched length − natural length.', '14 cm − 10 cm = 4 cm.'], 'calculation'),
  t(force, 'P41-07', 'How do you find a force?'),
  force.choice('P41-08', 'A spring has a spring constant of 50 N/m and is stretched by 0.4 m. What force is needed?', ['20 N', '125 N', '2 N', '50.4 N'], 0, 'F = k × e. Multiply the two numbers.', ['F = 50 × 0.4.', '50 × 0.4 = 20, so the force is 20 N.'], 'calculation'),
  t(constant, 'P41-09', 'How do you find the spring constant?'),
  constant.choice('P41-10', 'A force of 12 N stretches a spring by 3 cm. What is its spring constant?', ['4 N/m', '0.0025 N/m', '400 N/m', '36 N/m'], 2, 'Change centimetres to metres first, then divide the force by the extension.', ['3 cm = 3 ÷ 100 = 0.03 m.', 'k = F ÷ e = 12 ÷ 0.03 = 400 N/m.'], 'calculation'),
  t(limit, 'P41-11', 'When does it stop working?'),
  limit.choice('P41-12', 'A spring is stretched further and further. What is true past its limit of proportionality?', ['Force and extension are still directly proportional', 'The equation F = ke is no longer true', 'The spring constant doubles', 'The spring stops storing energy'], 1, 'Think about where the line on the graph starts to bend.', ['Past the limit of proportionality, the line bends.', 'Force and extension are no longer directly proportional, so F = ke is no longer true.']),
  force.choice('P41-13', 'A spring has a spring constant of 25 N/m and is stretched by 0.6 m. What force is needed?', ['0.042 N', '25.6 N', '150 N', '15 N'], 3, 'Write F = k × e, then put the numbers in.', ['F = 25 × 0.6.', '25 × 0.6 = 15, so the force is 15 N.'], 'calculation', true),
  constant.choice('P41-14', 'A force of 15 N stretches a spring by 3 cm. What is its spring constant?', ['5 N/m', '500 N/m', '0.002 N/m', '45 N/m'], 1, 'Convert cm to m, then use k = F ÷ e.', ['3 cm = 0.03 m.', 'k = 15 ÷ 0.03 = 500 N/m.'], 'calculation', true),
  limit.choice('P41-15', 'The graph shows force against extension for a spring. Which point is past the limit of proportionality?', ['D', 'A', 'B', 'C'], 0, 'Look for where the line stops being straight.', ['Points A, B and C lie on the straight part of the line.', 'Point D is on the curved part, so it is past the limit of proportionality.'], 'dataInterpretation', true, 'elastic-q-graph'),
  limit.written('P41-16', 'A spring has weights added one at a time until it is overstretched. Describe how the extension changes as the force increases.', 'Think about the straight part of the graph, then the bend.', 'At first, the extension is directly proportional to the force: doubling the force doubles the extension, and the graph is a straight line through the origin. This carries on up to the limit of proportionality. Past this point the graph bends, and the extension grows by more than the equation F = ke predicts.', ['States that at first extension is directly proportional to force.', 'Says doubling the force doubles the extension (straight line through the origin).', 'Says this continues up to the limit of proportionality.', 'Says that past this point the line bends.', 'Says F = ke is no longer true past that point.'], ['Saying force and extension are always proportional.', 'Saying the line bends before the limit of proportionality.', 'Mixing up the force and extension axes.']),
]

export const lessonP41: ScienceLesson = {
  id: 'P-FOR-041-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Forces and elasticity', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
