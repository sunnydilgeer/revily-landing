import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { momentumFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.5.5.1 Momentum is a property of moving objects (HT only): p = m v in kg m/s; 6.5.5.2 Conservation of momentum (HT only): in a closed system the total momentum before an event equals the total momentum after, as on the supplied revision page' }
const skill = 'P-MOMENTUM'
const prior = author(skill, ['6.5.4.1.3'], ['aqa-physics'])
const what = author(skill, ['6.5.5.1'], ['aqa-physics'])
const calc = author(skill, ['6.5.5.1'], ['aqa-physics'])
const keep = author(skill, ['6.5.5.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const momentumSections = [
  { id: 'P52H-01', label: 'Start here', detail: 'Same speed, different directions' },
  { id: 'P52H-02', label: 'What is momentum?', detail: 'Mass, velocity and direction' },
  { id: 'P52H-05', label: 'Calculating momentum', detail: 'p = m v, three ways round' },
  { id: 'P52H-10', label: 'Momentum before = momentum after', detail: 'Collisions in a closed system' },
  { id: 'P52H-13', label: 'Explosions and recoil', detail: 'Starting from zero' },
  { id: 'P52H-16', label: 'On your own', detail: 'Vehicles, crashes, a mistake and a boat' },
]

const states: ScienceState[] = [
  { ...prior.choice('P52H-01', 'Two cyclists both ride at 5 m/s. One rides east and the other rides west. What is different about them?', ['Their speed', 'Their velocity', 'Their mass', 'Nothing is different'], 1, 'Which quantity includes a direction?', ['Both cyclists have the same speed, 5 m/s.', 'Velocity is speed in a given direction. They ride in opposite directions, so their velocities are different. Direction matters for momentum too.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },

  t(what, 'P52H-02', 'What is momentum?'),
  what.choice('P52H-03', 'Which of these has zero momentum?', ['A rolling football', 'A flying bird', 'A parked lorry', 'A walking dog'], 2, 'Momentum needs a velocity.', ['Momentum = mass × velocity. A parked lorry has a huge mass, but its velocity is zero.', 'Anything multiplied by zero is zero, so the parked lorry has zero momentum. Everything else in the list is moving.'], 'recall'),
  what.choice('P52H-04', 'Two identical trolleys roll at 2 m/s, one to the left and one to the right. How does their momentum compare?', ['Same size, opposite directions', 'Same size, same direction', 'The one moving right has more', 'Both are zero'], 0, 'Momentum is a vector. Think about size and direction separately.', ['Same mass and same speed, so the size of the momentum is the same.', 'They move in opposite directions, so their momentum points in opposite directions. If right is positive, one is positive and the other negative.']),

  t(calc, 'P52H-05', 'Calculating momentum'),
  calc.worked('P52H-06', 'Find a velocity from momentum', 'A rowing boat with its rower has a total mass of 200 kg. It has 600 kg m/s of momentum. Calculate its velocity.', ['Write the equation: p = m × v.', 'You want v, so rearrange: v = p ÷ m.', 'Put the numbers in: v = 600 ÷ 200.', 'v = 3 m/s. Velocity is in m/s, and it is in the same direction as the momentum.'], 'hmom-worked-boat'),
  calc.choice('P52H-07', 'A 0.16 kg cricket ball is bowled at 25 m/s. What is its momentum?', ['40 kg m/s', '0.0064 kg m/s', '25.16 kg m/s', '4 kg m/s'], 3, 'p = m × v. Multiply, do not divide or add.', ['p = m × v = 0.16 × 25.', '0.16 × 25 = 4, so the momentum is 4 kg m/s.'], 'calculation'),
  calc.choice('P52H-08', 'A cyclist and her bike move at 5 m/s with 450 kg m/s of momentum. What is their total mass?', ['2250 kg', '90 kg', '445 kg', '0.011 kg'], 1, 'Rearrange p = m v to make m the subject.', ['m = p ÷ v.', 'm = 450 ÷ 5 = 90 kg.'], 'calculation'),
  calc.choice('P52H-09', 'A 4 kg ball rolls to the left at 3 m/s. Taking right as positive, what is its momentum?', ['12 kg m/s', '+7 kg m/s', '−12 kg m/s', '−0.75 kg m/s'], 2, 'Work out the size first, then think about the direction.', ['Size: p = m × v = 4 × 3 = 12 kg m/s.', 'The ball moves left, and right is positive. So its momentum is −12 kg m/s.'], 'application'),

  t(keep, 'P52H-10', 'Momentum before = momentum after'),
  keep.choice('P52H-11', 'A 3 kg trolley at 4 m/s hits a still 1 kg trolley. They stick together. How fast do they move off?', ['3 m/s', '4 m/s', '12 m/s', '1 m/s'], 0, 'Find the momentum before. Then share it over the total mass.', ['Momentum before = 3 × 4 = 12 kg m/s (the still trolley has none). Momentum after is also 12 kg m/s.', 'Moving mass after = 3 + 1 = 4 kg. v = p ÷ m = 12 ÷ 4 = 3 m/s.'], 'calculation'),
  keep.choice('P52H-12', 'Curling stone A hits still stone B on smooth ice. Use the diagram. What is the momentum of stone B afterwards?', ['60 kg m/s', '20 kg m/s', '80 kg m/s', '40 kg m/s'], 3, 'Total before = total after. Take away what stone A still has.', ['Before: A has 20 × 3 = 60 kg m/s and B has 0. Total = 60 kg m/s.', 'After: A has 20 × 1 = 20 kg m/s. So B has 60 − 20 = 40 kg m/s.'], 'calculation', false, 'hmom-q-stones'),

  t(keep, 'P52H-13', 'Explosions and recoil'),
  keep.choice('P52H-14', 'Two still trolleys are pushed apart by a spring between them. What is true just after they move apart?', ['They move off in the same direction', 'The total momentum is still zero', 'The heavier trolley moves faster', 'The total momentum is now bigger than zero'], 1, 'What was the total momentum before the spring was released?', ['Before, nothing was moving, so the total momentum was zero. Momentum is conserved, so it is still zero after.', 'The trolleys move in opposite directions with momentum of equal size. The heavier one moves more slowly.']),
  keep.choice('P52H-15', 'A 2 kg toy cannon at rest fires a 0.1 kg ball forwards at 20 m/s. What is the cannon’s recoil velocity?', ['1 m/s backwards', '1 m/s forwards', '20 m/s backwards', '2 m/s backwards'], 0, 'Find the ball’s momentum first. The cannon must have the same amount the other way.', ['Ball: p = 0.1 × 20 = 2 kg m/s forwards. Total before was zero, so the cannon has 2 kg m/s backwards.', 'Cannon: v = p ÷ m = 2 ÷ 2 = 1 m/s backwards.'], 'calculation'),

  what.choice('P52H-16', 'Which numbered vehicle in the diagram has the most momentum?', ['Vehicle 1', 'Vehicle 2', 'Vehicle 3', 'They all have the same'], 2, 'Work out m × v for each one. Watch for any that are not moving.', ['Vehicle 1: 10 000 × 0 = 0 kg m/s. Vehicle 2: 800 × 10 = 8000 kg m/s.', 'Vehicle 3: 2000 × 5 = 10 000 kg m/s. So vehicle 3 has the most momentum, even though it is the slowest moving one.'], 'calculation', true, 'hmom-q-three'),
  keep.choice('P52H-17', 'A 1200 kg car at 10 m/s hits a parked 800 kg car. They lock together. How fast do they move off?', ['10 m/s', '15 m/s', '4 m/s', '6 m/s'], 3, 'Momentum before, then the total mass after. One step at a time.', ['Momentum before = 1200 × 10 = 12 000 kg m/s. The parked car has none.', 'Mass after = 1200 + 800 = 2000 kg. v = 12 000 ÷ 2000 = 6 m/s.'], 'calculation', true, 'hmom-q-crash'),
  keep.choice('P52H-18', 'A student worked out a collision. Which numbered line in the working has the first mistake?', ['Line 1', 'Line 2', 'Line 3', 'Line 4'], 2, 'After they stick together, how much mass is moving?', ['Lines 1 and 2 are right: 2 × 3 = 6 kg m/s before, so 6 kg m/s after.', 'Line 3 uses only trolley Q. Both trolleys move together, so the mass is 2 + 4 = 6 kg. Then v = 6 ÷ 6 = 1 m/s.'], 'application', true, 'hmom-q-working'),
  keep.choice('P52H-19', 'A firework at rest bursts into two pieces, shown in the diagram. What is the velocity of piece B?', ['10 m/s to the left', '10 m/s to the right', '15 m/s to the right', '22.5 m/s to the right'], 1, 'Total momentum stays zero. Find A’s momentum first.', ['A: p = 0.2 × 15 = 3 kg m/s to the left. So B must have 3 kg m/s to the right.', 'B: v = p ÷ m = 3 ÷ 0.3 = 10 m/s to the right.'], 'calculation', true, 'hmom-q-firework'),
  keep.written('P52H-20', 'A 50 kg student jumps from a still 100 kg boat at 2 m/s. Explain how the boat moves, with a calculation.', 'Momentum before is zero. Treat the student and boat as a closed system and ignore the water.', 'Before the jump nothing is moving, so the total momentum is zero. Momentum is conserved, so the total after the jump must also be zero. The student’s momentum is 50 × 2 = 100 kg m/s forwards. So the boat must have 100 kg m/s backwards. Its velocity is v = p ÷ m = 100 ÷ 100 = 1 m/s, in the opposite direction to the student. The boat recoils backwards more slowly because it has more mass.', ['Total momentum before the jump is zero.', 'Momentum is conserved, so the total after is also zero.', 'Student: 50 × 2 = 100 kg m/s forwards, so the boat has 100 kg m/s backwards.', 'Boat velocity = 100 ÷ 100 = 1 m/s.', 'The boat moves in the opposite direction to the student (it recoils).'], ['Saying the boat moves forwards with the student.', 'Using the total mass, 150 kg, or getting 2 m/s or 200 m/s for the boat.', 'Saying the boat stays still because only the student jumped.']),
]

export const lessonP52H: ScienceLesson = {
  id: 'P-MOT-052H-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Momentum', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
