/*
 * Higher-only sections for Physics Lessons 47 and 51, from the CGP AQA Combined Science Higher guide pages 220 (top) and
 * 222 (bottom) (scope only; all wording, numbers and questions are original). AQA 8464 HT content: 6.5.4.2.1 (inertia),
 * 6.5.4.2.2 (inertial mass, m = F ÷ a) and 6.5.4.3.4 (estimating the forces in the deceleration of a road vehicle).
 * Diagrams: components/HigherNewtonVisuals.tsx ('hnewt-'), drawn with Lesson 47's trolleys and Lesson 51's road scene.
 */
import { addition, f, type HigherAddition } from './helpers'

// Physics Lesson 47 · Higher p220: inertia and inertial mass. Before "On your own".
const inertia = addition('P-MOT-047-P', 'P47-11', 'P-HIGHER-INERTIA', ['6.5.4.2.1', '6.5.4.2.2'],
  { id: 'P47-H01', higher: true, label: 'Inertia and inertial mass', detail: 'How hard it is to change velocity' },
  [
    f('Motion stays the same', 'With no resultant force, a still object stays still and a moving one keeps the same velocity.', 'no resultant force → no change', 'You met Newton\'s First Law earlier in this lesson. With no resultant force, an object at rest stays at rest. A moving object keeps moving at the same velocity. Here two trolleys roll along at the same velocity.', 'hnewt-inertia-1'),
    f('Inertia', 'The tendency of an object to keep the same motion is called inertia.', 'keep doing the same thing', 'Objects tend to carry on doing what they are already doing. A still object tends to stay still. A moving object tends to keep its velocity. This tendency to stay in the same state of motion is called inertia.', 'hnewt-inertia-2'),
    f('Harder to change', 'Inertial mass is a measure of how hard it is to change an object\'s velocity.', 'same push, less change → more inertial mass', 'Now the same force pushes both trolleys. The empty trolley A changes its velocity a lot. The loaded trolley B changes its velocity only a little. B is harder to change. We say B has more inertial mass.', 'hnewt-inertia-3'),
    f('Find it with m = F ÷ a', 'Rearrange F = ma to get m = F ÷ a. Inertial mass is force ÷ acceleration.', 'divide the force by the acceleration', 'Start with F = ma. Divide both sides by a to get m = F ÷ a. The force on each trolley is 12 N. A accelerates at 6 m/s², so m = 12 ÷ 6 = 2 kg. B accelerates at 2 m/s², so m = 12 ÷ 2 = 6 kg.', 'hnewt-inertia-4'),
    f('Put it together', 'Inertia keeps motion the same. Inertial mass tells you how hard that motion is to change: m = F ÷ a.', 'inertia → inertial mass → m = F ÷ a', 'Inertia is the tendency to keep the same motion. Inertial mass measures how hard it is to change an object\'s velocity. The bigger the inertial mass, the smaller the acceleration for the same force. You can find it with m = F ÷ a, in kilograms.', 'hnewt-inertia-5'),
  ],
  a => [
    a.worked('P47-H02', 'Find the inertial mass of a trolley', 'A resultant force of 15 N gives a trolley an acceleration of 3 m/s². Find the inertial mass of the trolley.', ['Rearrange F = ma for mass: m = F ÷ a.', 'Put the numbers in: m = 15 ÷ 3.', 'Work it out: 15 ÷ 3 = 5.', 'Force in N ÷ acceleration in m/s² gives mass in kg. So the inertial mass is 5 kg.'], 'hnewt-inertia-worked'),
    a.choice('P47-H03', 'A resultant force of 40 N gives a sledge an acceleration of 0.5 m/s². What is the inertial mass of the sledge?', ['20 kg', '40.5 kg', '80 kg', '0.0125 kg'], 2, 'Use m = F ÷ a.', ['m = F ÷ a = 40 ÷ 0.5.', 'Dividing by 0.5 is the same as doubling, so m = 80 kg.'], 'calculation'),
    a.choice('P47-H04', 'What does the inertial mass of an object tell you?', ['How fast the object is moving', 'How hard it is to change the object\'s velocity', 'How far the object travels before it stops', 'The size of the force of gravity on the object'], 1, 'Think about the loaded trolley.', ['A loaded trolley is harder to speed up, slow down or turn.', 'Inertial mass is a measure of how hard it is to change an object\'s velocity.']),
    a.choice('P47-H05', 'A resultant force of 18 N acts on each trolley. Which has the greater inertial mass, and what is it?', ['Y, 2 kg', 'X, 6 kg', 'X, 54 kg', 'Y, 162 kg'], 1, 'Work out m = F ÷ a for each trolley.', ['X: m = 18 ÷ 3 = 6 kg. Y: m = 18 ÷ 9 = 2 kg.', 'X accelerates less for the same force, so X has the greater inertial mass: 6 kg.'], 'calculation', true, 'hnewt-inertia-question'),
  ])

// Physics Lesson 51 · Higher p222: estimating the braking force of a car with v² − u² = 2as and F = ma. Before "On your own".
const brakingForce = addition('P-MOT-051-P', 'P51-11', 'P-HIGHER-BRAKING-FORCE', ['6.5.4.3.4'],
  { id: 'P51-H01', higher: true, label: 'Estimating a braking force', detail: 'Find the deceleration, then use F = ma' },
  [
    f('Typical values', 'To estimate a braking force, use typical values: a car at about 20 m/s with a mass of about 1000 kg.', 'sensible round numbers', 'You can estimate the braking force on a car using typical values. A car on a main road goes at about 20 to 30 m/s. A typical car has a mass of about 1000 to 1500 kg. Here a car of about 1000 kg is going at about 20 m/s. It brakes hard and stops in 40 m.', 'hnewt-brake-1'),
    f('Rearrange for a', 'Divide both sides of v² − u² = 2as by 2s: a = (v² − u²) ÷ 2s.', 'get a on its own', 'You met v² − u² = 2as for uniform acceleration. Here we want the acceleration, a. Divide both sides by 2s. This gives a = (v² − u²) ÷ 2s.', 'hnewt-brake-2'),
    f('Find the deceleration', 'a = (0² − 20²) ÷ (2 × 40) = −400 ÷ 80 = −5 m/s². The minus sign means it is slowing down.', 'stops means v = 0', 'The car stops, so v = 0. It starts at u = 20 m/s and s = 40 m. So a = (0² − 20²) ÷ (2 × 40) = −400 ÷ 80 = −5 m/s². The minus sign means the car is slowing down. Its deceleration is 5 m/s².', 'hnewt-brake-3'),
    f('Find the force', 'F = ma = 1000 × 5 = 5000 N. The braking force is about 5000 N.', 'mass × deceleration', 'Now use F = ma. F = 1000 × 5 = 5000 N. The force acts backwards, against the motion. Because we used typical values, this is an estimate. The braking force is about 5000 N.', 'hnewt-brake-4'),
    f('Put it together', 'Typical values → deceleration from v² − u² = 2as → force from F = ma. Very big decelerations are dangerous.', 'values → a → F', 'To estimate a braking force, pick typical values. Find the deceleration with a = (v² − u²) ÷ 2s. Then use F = ma. Stopping faster needs a bigger force. Very big decelerations can overheat the brakes or make the car skid.', 'hnewt-brake-5'),
  ],
  a => [
    a.worked('P51-H02', 'Estimate the braking force on a car in town', 'A car of mass about 1200 kg is travelling at 10 m/s in town. It brakes and stops in 10 m. Estimate the braking force.', ['Rearrange v² − u² = 2as for a: a = (v² − u²) ÷ 2s.', 'a = (0² − 10²) ÷ (2 × 10) = −100 ÷ 20 = −5 m/s². The deceleration is 5 m/s².', 'F = ma = 1200 × 5 = 6000.', 'The braking force is about 6000 N.'], 'hnewt-brake-worked'),
    a.choice('P51-H03', 'A car of mass about 1000 kg travels at 20 m/s. It brakes and stops in 50 m. Estimate the braking force.', ['8000 N', '4000 N', '400 N', '40 000 N'], 1, 'Find the deceleration first. Then use F = ma.', ['a = (0² − 20²) ÷ (2 × 50) = −400 ÷ 100 = −4 m/s². The deceleration is 4 m/s².', 'F = ma = 1000 × 4 = 4000 N.'], 'calculation'),
    a.choice('P51-H04', 'Why can a very large deceleration be dangerous for a car?', ['It makes the engine stop working', 'It makes the car heavier', 'It makes the thinking distance longer', 'The brakes can overheat, or the car can skid'], 3, 'Think about the brakes and the tyres.', ['A very large deceleration transfers a lot of energy to the brakes very quickly, so they may overheat and work less well.', 'It can also make the tyres lose grip, so the car skids.']),
    a.choice('P51-H05', 'A lorry of mass 10 000 kg travels at 20 m/s. It brakes and stops in 50 m. Estimate the braking force.', ['80 000 N', '2000 N', '40 000 N', '400 000 N'], 2, 'Use a = (v² − u²) ÷ 2s, then F = ma.', ['a = (0² − 20²) ÷ (2 × 50) = −400 ÷ 100 = −4 m/s².', 'F = ma = 10 000 × 4 = 40 000 N.'], 'calculation', true),
  ])

export const higherPNewton: HigherAddition[] = [inertia, brakingForce]
