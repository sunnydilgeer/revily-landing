import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { velocityFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.5.4.1.1 Distance and displacement, 6.5.4.1.2 Speed and velocity, 6.5.4.1.3 typical speeds (s = vt), as on the supplied revision page' }
const skill = 'P-VELOCITY'
const dist = author(skill, ['6.5.4.1.1'], ['aqa-physics'])
const speed = author(skill, ['6.5.4.1.2'], ['aqa-physics'])
const distCalc = author(skill, ['6.5.4.1.2'], ['aqa-physics'])
const speedCalc = author(skill, ['6.5.4.1.2'], ['aqa-physics'])
const typical = author(skill, ['6.5.4.1.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const velocitySections = [
  { id: 'P43-01', label: 'Start here', detail: 'A dog on a path' },
  { id: 'P43-02', label: 'Distance or displacement?', detail: 'How far, and in which direction' },
  { id: 'P43-05', label: 'Speed or velocity?', detail: 'Scalar and vector' },
  { id: 'P43-07', label: 'How do you find distance?', detail: 's = v × t' },
  { id: 'P43-09', label: 'How do you find speed?', detail: 'v = s ÷ t' },
  { id: 'P43-11', label: 'What are typical speeds?', detail: 'Walking to planes, and sound' },
  { id: 'P43-13', label: 'On your own', detail: 'Calculate and explain' },
]

const states: ScienceState[] = [
  { ...dist.choice('P43-01', 'A dog runs 10 m along a path and then 10 m back again. How far has it run?', ['10 m', '20 m', '0 m', '100 m'], 1, 'Add up the whole trip, there and back.', ['The dog ran 10 m out and 10 m back.', '10 + 10 = 20 m in total.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(dist, 'P43-02', 'Distance or displacement?'),
  dist.choice('P43-03', 'Ali walks 30 m along a road, then 30 m back to the start. What are his distance and displacement?', ['Distance 60 m, displacement 0 m', 'Distance 0 m, displacement 60 m', 'Distance 30 m, displacement 30 m', 'Distance 60 m, displacement 60 m'], 0, 'Where does he finish compared with where he started?', ['The distance is the whole walk: 30 + 30 = 60 m.', 'He finishes at the start, so his displacement is 0 m.']),
  dist.choice('P43-04', 'Which of these is a vector quantity?', ['Distance', 'Speed', 'Time', 'Displacement'], 3, 'A vector has a direction as well as a size.', ['A vector has size and direction.', 'Displacement is a vector because it is measured in a given direction.'], 'recall'),
  t(speed, 'P43-05', 'Speed or velocity?'),
  speed.choice('P43-06', 'Two cars each travel at 20 m/s. One goes north and the other goes south. Which statement is correct?', ['They have the same speed and the same velocity', 'They have different speeds and different velocities', 'They have the same speed but different velocities', 'They have different speeds but the same velocity'], 2, 'Speed has no direction. Velocity does.', ['Both cars go at 20 m/s, so their speeds are the same.', 'They go in different directions, so their velocities are different.']),
  t(distCalc, 'P43-07', 'How do you find distance?'),
  distCalc.choice('P43-08', 'A runner moves at 3 m/s for 50 s. How far does the runner go?', ['150 m', '16.7 m', '53 m', '0.06 m'], 0, 'Use s = v × t.', ['s = 3 × 50.', '3 × 50 = 150, so the distance is 150 m.'], 'calculation'),
  t(speedCalc, 'P43-09', 'How do you find speed?'),
  speedCalc.choice('P43-10', 'A swimmer travels 90 m in 60 s. What is the average speed?', ['0.67 m/s', '1.5 m/s', '5400 m/s', '30 m/s'], 1, 'Divide the distance by the time.', ['v = s ÷ t = 90 ÷ 60.', '90 ÷ 60 = 1.5, so the average speed is 1.5 m/s.'], 'calculation'),
  t(typical, 'P43-11', 'What are typical speeds?'),
  typical.choice('P43-12', 'A person cycles at a typical speed of 6 m/s for 60 s. About how far do they go?', ['10 m', '60 m', '360 m', '3600 m'], 2, 'Use s = v × t with the speed given.', ['s = 6 × 60.', '6 × 60 = 360, so they go about 360 m.'], 'application'),
  dist.choice('P43-13', 'A ball is thrown 5 m up and falls 5 m back into the thrower\'s hand. What are its distance and displacement?', ['Distance 0 m, displacement 10 m', 'Distance 5 m, displacement 5 m', 'Distance 10 m, displacement 10 m', 'Distance 10 m, displacement 0 m'], 3, 'Add the whole path for distance. Then ask where it finishes.', ['The path is 5 m up and 5 m down, so the distance is 10 m.', 'The ball finishes in the hand where it started, so the displacement is 0 m.'], 'understanding', true),
  speedCalc.choice('P43-14', 'A train travels 600 m in 20 s. What is its average speed?', ['30 m/s', '12 000 m/s', '620 m/s', '0.033 m/s'], 0, 'Use v = s ÷ t.', ['v = 600 ÷ 20.', '600 ÷ 20 = 30, so the average speed is 30 m/s.'], 'calculation', true),
  distCalc.choice('P43-15', 'A car travels at a steady 25 m/s for 40 s. How far does it go?', ['65 m', '100 m', '1000 m', '1.6 m'], 2, 'Write s = v × t, then put the numbers in.', ['s = 25 × 40.', '25 × 40 = 1000, so the car goes 1000 m.'], 'calculation', true),
  speedCalc.written('P43-16', 'A girl walks 40 m east then back in 40 s. Find her average speed and displacement, and explain the difference.', 'Work out the total distance first. Then ask where she finishes.', 'The total distance is 40 + 40 = 80 m. Average speed v = s ÷ t = 80 ÷ 40 = 2 m/s. She finishes where she started, so her displacement is 0 m. Distance is the whole length of the path, but displacement is the straight-line distance from start to finish, so they differ.', ['States the total distance is 80 m.', 'Writes v = s ÷ t and substitutes 80 ÷ 40.', 'Gives the average speed as 2 m/s with the unit.', 'States that the displacement is 0 m because she finishes at the start.', 'Explains that displacement is the straight-line distance from start to finish (with direction).'], ['Using 40 m as the total distance.', 'Giving speed without a unit.', 'Saying displacement is 80 m.']),
]

export const lessonP43: ScienceLesson = {
  id: 'P-MOT-043-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Distance, displacement, speed and velocity', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
