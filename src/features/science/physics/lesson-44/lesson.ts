import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { accelerationFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.5.4.1.5 Acceleration (a = Δv ÷ t, estimating accelerations, v² − u² = 2as, g ≈ 9.8 m/s²), as on the supplied revision page' }
const skill = 'P-ACCEL'
const meaning = author(skill, ['6.5.4.1.5'], ['aqa-physics'])
const calc = author(skill, ['6.5.4.1.5'], ['aqa-physics'])
const estimate = author(skill, ['6.5.4.1.5'], ['aqa-physics'])
const uniform = author(skill, ['6.5.4.1.5'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const accelerationSections = [
  { id: 'P44-01', label: 'Start here', detail: 'Pulling away from the lights' },
  { id: 'P44-02', label: 'What is acceleration?', detail: 'Change in velocity over time' },
  { id: 'P44-05', label: 'How do you calculate it?', detail: 'a = Δv ÷ t' },
  { id: 'P44-08', label: 'How do you estimate it?', detail: 'Typical speeds and sensible times' },
  { id: 'P44-10', label: 'What is v² − u² = 2as?', detail: 'Uniform acceleration and distance' },
  { id: 'P44-12', label: 'On your own', detail: 'Calculate and explain' },
]

const states: ScienceState[] = [
  { ...meaning.choice('P44-01', 'A cyclist pulls away from traffic lights and gets faster and faster. What do we call how quickly the velocity changes?', ['Deceleration', 'Distance', 'Acceleration', 'Displacement'], 2, 'It is about how quickly the velocity changes.', ['Acceleration is how quickly velocity changes.', 'A cyclist getting faster is accelerating.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(meaning, 'P44-02', 'What is acceleration?'),
  meaning.choice('P44-03', 'A scooter speeds up by 2 m/s every second. What is its acceleration?', ['2 m/s', '2 m/s²', '2 s', '0.5 m/s²'], 1, 'The unit says "metres per second, every second".', ['The velocity changes by 2 m/s each second.', 'So the acceleration is 2 m/s².'], 'recall'),
  meaning.choice('P44-04', 'A car has an acceleration of −4 m/s². What is the car doing?', ['Speeding up by 4 m/s every second', 'Moving at a steady 4 m/s', 'Stopped', 'Slowing down by 4 m/s every second'], 3, 'A negative acceleration is a deceleration.', ['Negative acceleration means the velocity is getting smaller.', 'So the car is slowing down by 4 m/s every second.']),
  t(calc, 'P44-05', 'How do you calculate it?'),
  calc.choice('P44-06', 'A car speeds up from rest to 20 m/s in 5 s. What is its acceleration?', ['4 m/s²', '100 m/s²', '15 m/s²', '0.25 m/s²'], 0, 'Find the change in velocity, then divide by the time.', ['Δv = 20 − 0 = 20 m/s.', 'a = 20 ÷ 5 = 4 m/s².'], 'calculation'),
  calc.choice('P44-07', 'A car slows from 20 m/s to 8 m/s in 4 s. What is its acceleration?', ['3 m/s²', '−12 m/s²', '−3 m/s²', '5 m/s²'], 2, 'Final velocity minus starting velocity gives a negative change.', ['Δv = 8 − 20 = −12 m/s.', 'a = −12 ÷ 4 = −3 m/s². It is a deceleration.'], 'calculation'),
  t(estimate, 'P44-08', 'How do you estimate it?'),
  estimate.choice('P44-09', 'A car pulls away and reaches a typical speed of 25 m/s in about 10 s. Estimate its acceleration.', ['0.4 m/s²', '2.5 m/s²', '250 m/s²', '15 m/s²'], 1, 'Change in velocity over time.', ['Starting from rest, Δv = 25 m/s.', 'a = 25 ÷ 10 = 2.5, so the acceleration is about 2.5 m/s².'], 'application'),
  t(uniform, 'P44-10', 'What is v² − u² = 2as?'),
  uniform.choice('P44-11', 'A cyclist starts from rest and accelerates uniformly at 2 m/s² over 16 m. What is the final speed?', ['64 m/s', '32 m/s', '8 m/s', '4 m/s'], 2, 'From rest, u = 0. Work out v², then take the square root.', ['v² = 0² + 2 × 2 × 16 = 64.', 'v = √64 = 8 m/s.'], 'calculation'),
  calc.choice('P44-12', 'A train speeds up from 4 m/s to 28 m/s in 6 s. What is its acceleration?', ['4 m/s²', '24 m/s²', '0.25 m/s²', '168 m/s²'], 0, 'Write a = Δv ÷ t. Find Δv first.', ['Δv = 28 − 4 = 24 m/s.', 'a = 24 ÷ 6 = 4 m/s².'], 'calculation', true),
  uniform.choice('P44-13', 'An object at 2 m/s accelerates uniformly at 4 m/s² over 4 m. What is its final speed?', ['36 m/s', '10 m/s', '18 m/s', '6 m/s'], 3, 'Rearrange to v² = u² + 2as, then take the square root.', ['v² = 2² + 2 × 4 × 4 = 4 + 32 = 36.', 'v = √36 = 6 m/s.'], 'calculation', true),
  meaning.choice('P44-14', 'A stone falls freely near the Earth. About what is its acceleration?', ['9.8 m/s', '9.8 m/s²', '98 m/s²', '0 m/s²'], 1, 'It is the acceleration due to gravity.', ['Falling objects have a uniform acceleration due to gravity.', 'Near the Earth it is about 9.8 m/s².'], 'recall', true),
  calc.written('P44-15', 'From rest, a motorbike reaches 24 m/s in 8 s, then stops in 6 s. Find both accelerations and explain their signs.', 'Find the change in velocity each time, then divide by the time.', 'Speeding up: Δv = 24 − 0 = 24 m/s, so a = 24 ÷ 8 = 3 m/s². Braking: Δv = 0 − 24 = −24 m/s, so a = −24 ÷ 6 = −4 m/s². The second acceleration is negative because the motorbike is slowing down, so its velocity is decreasing.', ['Writes a = Δv ÷ t.', 'Speeding up: Δv = 24 m/s, a = 3 m/s².', 'Braking: Δv = 0 − 24 = −24 m/s.', 'Braking: a = −4 m/s² with the unit.', 'Explains the sign: negative because the velocity is decreasing, so it is slowing down.'], ['Using 24 m/s as the acceleration.', 'Leaving out the unit m/s².', 'Giving the braking acceleration as positive with no explanation.']),
]

export const lessonP44: ScienceLesson = {
  id: 'P-MOT-044-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Acceleration', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
