import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { vtGraphFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.5.4.1.5 Acceleration: velocity-time graphs, drag and terminal velocity (qualitative), as on the supplied revision page' }
const skill = 'P-VTGRAPH'
const shapes = author(skill, ['6.5.4.1.5'], ['aqa-physics'])
const gradient = author(skill, ['6.5.4.1.5'], ['aqa-physics'])
const drag = author(skill, ['6.5.4.1.5'], ['aqa-physics'])
const terminal = author(skill, ['6.5.4.1.5'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const vtGraphSections = [
  { id: 'P46-01', label: 'Start here', detail: 'A skydiver jumps' },
  { id: 'P46-02', label: 'What do the lines mean?', detail: 'Uphill, flat, downhill and curved' },
  { id: 'P46-05', label: 'How do you find acceleration?', detail: 'Gradient with one big triangle' },
  { id: 'P46-07', label: 'What is drag?', detail: 'Fluids, air resistance and speed' },
  { id: 'P46-09', label: 'What is terminal velocity?', detail: 'Weight, drag and a steady speed' },
  { id: 'P46-12', label: 'On your own', detail: 'Calculating, reading and explaining' },
]

const states: ScienceState[] = [
  { ...shapes.choice('P46-01', 'A skydiver steps out of a plane. What happens to her speed in the first few seconds?', ['It stays the same', 'It increases', 'It decreases', 'It drops to zero'], 1, 'Think about what gravity does to her.', ['Gravity pulls her down, and at the start there is little drag.', 'So she speeds up.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(shapes, 'P46-02', 'What do the lines mean?'),
  shapes.choice('P46-03', 'A velocity-time graph has a flat section at 8 m/s. What is the object doing?', ['Speeding up', 'Slowing down', 'Travelling at a steady speed', 'Accelerating at 8 m/s²'], 2, 'A flat line means the velocity is not changing.', ['The line stays at 8 m/s, so the velocity is not changing.', 'The object is travelling at a steady speed.']),
  shapes.choice('P46-04', 'On a velocity-time graph, which line shows an object slowing down at a steady rate?', ['A straight line sloping down', 'A flat line', 'A straight line sloping up', 'A curve that gets steeper going up'], 0, 'Downhill means the velocity is falling.', ['The velocity gets smaller by the same amount each second.', 'That gives a straight line sloping down.']),
  t(gradient, 'P46-05', 'How do you find acceleration?'),
  gradient.choice('P46-06', 'A cyclist speeds up in a straight line from 2 m/s to 10 m/s in 4 s. What is the acceleration?', ['8 m/s²', '4 m/s²', '0.5 m/s²', '2 m/s²'], 3, 'Change in velocity ÷ change in time.', ['Change in velocity = 10 − 2 = 8 m/s. Change in time = 4 s.', 'Acceleration = 8 ÷ 4 = 2 m/s².'], 'calculation', false, 'vtgraph-q-cyclist'),
  t(drag, 'P46-07', 'What is drag?'),
  drag.choice('P46-08', 'What is drag?', ['The weight of a falling object', 'A force that speeds an object up', 'A force that pulls things towards Earth', 'A force from a fluid that acts against the movement'], 3, 'It pushes back on things moving through air or water.', ['Drag is the force a fluid puts on an object moving through it.', 'It acts in the opposite direction to the movement.'], 'recall'),
  t(terminal, 'P46-09', 'What is terminal velocity?'),
  terminal.choice('P46-10', 'A skydiver falls at a steady speed. What is true about the drag and her weight?', ['Drag is bigger than her weight', 'Drag is smaller than her weight', 'Drag is equal to her weight', 'There is no drag'], 2, 'A steady speed means no acceleration.', ['No acceleration means the resultant force is zero.', 'So the drag is equal to her weight.']),
  terminal.choice('P46-11', 'What happens to the acceleration of a falling skydiver as she nears terminal velocity?', ['It gets smaller, reaching zero at terminal velocity', 'It gets bigger', 'It stays the same', 'It becomes greater than at the start'], 0, 'Drag is growing all the time.', ['More speed means more drag, so the resultant force gets smaller.', 'At terminal velocity the resultant force is zero, so the acceleration is zero.']),
  { ...gradient.choice('P46-12', 'The graph shows a motorbike speeding up from 4 m/s to 24 m/s in 5 s. What is its acceleration?', ['0.25 m/s²', '5 m/s²', '4 m/s²', '20 m/s²'], 2, 'Work out the change in velocity first.', ['Change in velocity = 24 − 4 = 20 m/s. Change in time = 5 s.', 'Acceleration = 20 ÷ 5 = 4 m/s².'], 'calculation', true, 'vtgraph-q-bike') },
  shapes.choice('P46-13', 'The graph shows a journey in three numbered parts. Which part shows the object slowing down?', ['Part 2', 'Part 3', 'Part 1', 'All three parts'], 1, 'Look for the line sloping down.', ['Part 1 slopes up, so the object speeds up.', 'Part 2 is flat, so the speed is steady. Part 3 slopes down, so the object slows down.'], 'dataInterpretation', true, 'vtgraph-q-journey'),
  terminal.choice('P46-14', 'A parachutist has reached terminal velocity. Her weight is 700 N. How big is the drag on her?', ['1400 N', '0 N', '350 N', '700 N'], 3, 'At terminal velocity the forces are balanced.', ['At terminal velocity the resultant force is zero.', 'So the drag is equal to the weight, 700 N.'], 'application', true),
  terminal.written('P46-15', 'Describe how a skydiver\'s motion changes from jumping until reaching terminal velocity. Refer to weight and drag.', 'Follow the story: start, speeding up, then a steady speed.', 'At first her weight is much bigger than the drag, so she accelerates. As her speed increases, the drag increases, so the resultant force and her acceleration get smaller. Finally the drag is equal to her weight, the resultant force is zero and she falls at a constant speed called the terminal velocity.', ['At the start the weight is bigger than the drag, so she accelerates.', 'As her speed increases, the drag increases.', 'The resultant force and acceleration get smaller.', 'Eventually drag equals weight, so the resultant force is zero.', 'She falls at a constant speed, the terminal velocity.'], ['Saying she stops falling.', 'Saying weight gets smaller as she falls.', 'Saying drag is zero at the start and stays zero.']),
]

export const lessonP46: ScienceLesson = {
  id: 'P-MOT-046-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Velocity-time graphs and terminal velocity', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
