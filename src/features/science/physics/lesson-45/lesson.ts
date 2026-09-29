import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { dtGraphFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.5.4.1.4 Distance-time relationship: drawing and describing distance-time graphs, speed from the gradient, as on the supplied revision page' }
const skill = 'P-DTGRAPH'
const read = author(skill, ['6.5.4.1.4'], ['aqa-physics'])
const curve = author(skill, ['6.5.4.1.4'], ['aqa-physics'])
const gradient = author(skill, ['6.5.4.1.4'], ['aqa-physics'])
const draw = author(skill, ['6.5.4.1.4'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const dtGraphSections = [
  { id: 'P45-01', label: 'Start here', detail: 'Waiting at the school gate' },
  { id: 'P45-02', label: 'How do you read a journey?', detail: 'Flat, straight, steeper' },
  { id: 'P45-05', label: 'What do curves mean?', detail: 'Speeding up and slowing down' },
  { id: 'P45-08', label: 'How do you find the speed?', detail: 'Gradient with a large triangle' },
  { id: 'P45-10', label: 'How do you draw one?', detail: 'Stage by stage' },
  { id: 'P45-12', label: 'On your own', detail: 'Read, calculate and describe' },
]

const states: ScienceState[] = [
  { ...read.choice('P45-01', 'A girl walks to school and then waits at the gate. While she waits, what happens to her distance from home?', ['It goes up', 'It stays the same', 'It goes down', 'It doubles'], 1, 'She is not moving while she waits.', ['If she is not moving, her distance from home does not change.', 'It stays the same.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(read, 'P45-02', 'How do you read a journey?'),
  read.choice('P45-03', 'The graph shows a journey in parts A, B, C and D. In which part is the object stationary?', ['A', 'C', 'B', 'D'], 2, 'Look for the horizontal part of the line.', ['A flat line means the distance is not changing.', 'Part B is flat, so the object is stationary.'], 'dataInterpretation', false, 'dtgraph-q-journey'),
  read.choice('P45-04', 'Two objects are drawn on the same axes. Object 1 has a steeper line than Object 2. What does this tell you?', ['Object 1 is moving faster', 'Object 2 is moving faster', 'They are moving at the same speed', 'Object 1 is stationary'], 0, 'Steeper means more distance each second.', ['The gradient of a distance-time graph is the speed.', 'Object 1 has the steeper line, so it is faster.']),
  t(curve, 'P45-05', 'What do curves mean?'),
  curve.choice('P45-06', 'A distance-time graph is a curve that gets steeper and steeper. What is the object doing?', ['Stopped', 'Moving at a steady speed', 'Slowing down', 'Speeding up'], 3, 'A steeper line means a higher speed.', ['The line gets steeper, so the speed keeps getting bigger.', 'The object is speeding up.']),
  curve.choice('P45-07', 'A distance-time graph rises steeply, then levels off until it is flat. What does the object do?', ['It speeds up, then stops', 'It slows down, then stops', 'It moves at a steady speed', 'It goes back to the start'], 1, 'The line gets flatter and flatter.', ['The gradient gets smaller, so the speed gets smaller.', 'A flat line means it stops, so it slows down and then stops.']),
  t(gradient, 'P45-08', 'How do you find the speed?'),
  gradient.choice('P45-09', 'The line on the graph is straight. Use a large triangle on the line. What is the speed of the object?', ['4 m/s', '20 m/s', '5 m/s', '0.25 m/s'], 0, 'Speed = change in distance ÷ change in time. Choose two points far apart.', ['Between 1 s and 6 s the distance goes from 4 m to 24 m. The changes are 5 s and 20 m.', 'Speed = 20 ÷ 5 = 4 m/s.'], 'calculation', false, 'dtgraph-q-speed'),
  t(draw, 'P45-10', 'How do you draw one?'),
  draw.choice('P45-11', 'A cyclist rides at a steady speed, rests, then rides on more slowly. Which describes the graph?', ['A flat line, then a steep line, then a gentler line', 'A steep line, then a gentler line, then a flat line', 'A steep line, then a flat line, then a gentler line', 'A curve that keeps getting steeper'], 2, 'Take each stage in order: moving, stopped, moving more slowly.', ['Moving at a steady speed is a straight sloping line. Stopped is a flat line.', 'Moving more slowly is a gentler slope. So: steep, flat, gentler.']),
  read.choice('P45-12', 'The graph shows a journey in three parts P, Q and R. In which part is the object moving fastest?', ['Q', 'P', 'All the same', 'R'], 3, 'The fastest part is the steepest part.', ['The steepest line covers the most distance in each second.', 'Part R is the steepest, so the object is fastest there.'], 'dataInterpretation', true, 'dtgraph-q-own'),
  gradient.choice('P45-13', 'What is the speed of the object in part R of the graph?', ['24 m/s', '6 m/s', '4 m/s', '0.17 m/s'], 1, 'Use the start and end of part R to find both changes.', ['Part R goes from 8 m to 32 m, a change of 24 m, and from 8 s to 12 s, a change of 4 s.', 'Speed = 24 ÷ 4 = 6 m/s.'], 'calculation', true, 'dtgraph-q-own'),
  gradient.choice('P45-14', 'A triangle on a straight distance-time line has sides of 60 m (vertical) and 20 s (horizontal). What is the speed?', ['3 m/s', '0.33 m/s', '80 m/s', '1200 m/s'], 0, 'Distance change over time change.', ['The vertical side is the change in distance, 60 m. The horizontal side is the change in time, 20 s.', 'Speed = 60 ÷ 20 = 3 m/s.'], 'calculation', true),
  draw.written('P45-15', 'Cyclist: 30 m in 10 s, stopped 5 s, then 60 m in 10 s. Describe the graph. Find the final speed.', 'Take the journey one stage at a time.', 'The graph starts at the origin and rises in a straight line to 30 m at 10 s. Then it is flat for 5 s while she is stopped. Then it rises in a steeper straight line, by 60 m in 10 s. The speed in the last part is 60 ÷ 10 = 6 m/s, which is faster than the first part (3 m/s), so the line is steeper.', ['Says the first stage is a straight sloping line.', 'Says the stop is a flat (horizontal) line.', 'Says the last stage is a straight line that is steeper than the first.', 'Works out the speed as 60 ÷ 10 = 6 m/s with the unit.', 'Explains that a steeper line means a higher speed.'], ['Drawing the stopped part as a sloping line.', 'Using the total time instead of 10 s for the last part.', 'Giving the speed without a unit.']),
]

export const lessonP45: ScienceLesson = {
  id: 'P-MOT-045-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Distance-time graphs', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
