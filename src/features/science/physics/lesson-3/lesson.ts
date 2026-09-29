import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { kineticFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.1.1.2 Kinetic energy (energy in the kinetic energy store, Ek = ½mv²), as on the supplied revision page' }
const skill = 'P-KINETIC'
const meaning = author(skill, ['6.1.1.2'], ['aqa-physics'])
const equation = author(skill, ['6.1.1.2'], ['aqa-physics'])
const calc = author(skill, ['6.1.1.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const kineticSections = [
  { id: 'P3-01', label: 'Start here', detail: 'A lorry and a bike' },
  { id: 'P3-02', label: 'What is kinetic energy?', detail: 'Mass, speed and the kinetic store' },
  { id: 'P3-05', label: 'What is the equation?', detail: 'Ek = ½ × m × v²' },
  { id: 'P3-08', label: 'How do you work one out?', detail: 'A worked example, then your turn' },
  { id: 'P3-11', label: 'On your own', detail: 'Compare and calculate' },
]

const states: ScienceState[] = [
  { ...meaning.choice('P3-01', 'A lorry and a bike are travelling at the same speed. Which has more energy in its kinetic store?', ['The bike', 'They have the same', 'Neither, because they are moving', 'The lorry'], 3, 'Think about which is harder to stop.', ['The lorry has much more mass.', 'At the same speed, more mass means more energy in the kinetic store.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(meaning, 'P3-02', 'What is kinetic energy?'),
  meaning.choice('P3-03', 'Two identical cars drive along a road. Car A is faster than car B. Which statement is correct?', ['Car B has more kinetic energy', 'Car A has more kinetic energy', 'They have the same kinetic energy', 'Neither has any kinetic energy'], 1, 'The cars have the same mass, so look at the speed.', ['With the same mass, the faster car has more kinetic energy.']),
  meaning.choice('P3-04', 'A cyclist slows down to stop at traffic lights. What happens to the energy in the cyclist\'s kinetic store?', ['It is transferred away from the store', 'It is transferred into the store', 'It stays the same', 'It becomes zero without going anywhere'], 0, 'Slowing down is the opposite of speeding up.', ['When an object slows down, energy is transferred away from its kinetic store.', 'The energy is not destroyed. It moves to other stores.']),
  t(equation, 'P3-05', 'What is the equation?'),
  equation.choice('P3-06', 'In Ek = ½ × m × v², which do you work out first?', ['The half times the mass', 'The mass times the speed', 'The speed times the speed, v²', 'The half plus the mass'], 2, 'Only the speed has the little 2.', ['The square applies only to the speed.', 'So work out v × v first, then multiply by the mass and by a half.'], 'recall'),
  equation.choice('P3-07', 'Which set of units is correct for kinetic energy, mass and speed?', ['Ek in metres, m in seconds, v in kilograms', 'Ek in kilograms, m in joules, v in seconds', 'Ek in joules, m in kilograms, v in metres per second', 'Ek in watts, m in grams, v in centimetres'], 2, 'Energy is measured in joules.', ['Kinetic energy is in joules (J).', 'Mass is in kilograms (kg) and speed is in metres per second (m/s).'], 'recall'),
  t(calc, 'P3-08', 'How do you work one out?'),
  calc.choice('P3-09', 'A trolley has a mass of 2 kg and moves at 3 m/s. What is the energy in its kinetic store?', ['3 J', '6 J', '12 J', '9 J'], 3, 'Ek = ½ × m × v². Square the speed first.', ['v² = 3 × 3 = 9.', 'Ek = ½ × 2 × 9 = 9 J.'], 'calculation'),
  calc.choice('P3-10', 'A scooter and child have a mass of 40 kg and move at 5 m/s. What is their kinetic energy?', ['500 J', '100 J', '1000 J', '4000 J'], 0, 'Square the speed, then multiply by the mass, then halve.', ['v² = 5 × 5 = 25.', 'Ek = ½ × 40 × 25 = 500 J.'], 'calculation'),
  meaning.choice('P3-11', 'A 1 kg ball and a 3 kg ball roll at the same speed. Which has more kinetic energy?', ['The 1 kg ball', 'The 3 kg ball', 'They have the same', 'You cannot tell'], 1, 'The speeds match, so compare the masses.', ['At the same speed, more mass means more kinetic energy.', 'The 3 kg ball has more mass.'], 'understanding', true),
  calc.choice('P3-12', 'A sledge and rider have a mass of 50 kg and move at 6 m/s. What is their kinetic energy?', ['300 J', '1800 J', '900 J', '150 J'], 2, 'Write the equation, square the speed, then work through the sum.', ['v² = 6 × 6 = 36.', 'Ek = ½ × 50 × 36 = 900 J.'], 'calculation', true),
  meaning.choice('P3-13', 'Both cars in the diagram have the same mass. Which car has more energy in its kinetic store?', ['Car 1', 'Car 2', 'They have the same', 'You cannot tell'], 1, 'The masses are the same, so look at the speeds.', ['With the same mass, the faster car has more kinetic energy.', 'Car 2 is going faster.'], 'dataInterpretation', true, 'kinetic-q-cars'),
  meaning.written('P3-14', 'A trolley has a mass of 3 kg and moves at 2 m/s. Show how to work out its kinetic energy.', 'Write the equation, put the numbers in, square first.', 'Ek = ½ × m × v². The mass is 3 kg and the speed is 2 m/s. First v² = 2 × 2 = 4. Then Ek = ½ × 3 × 4 = 6. The kinetic energy is 6 J.', ['Writes the equation Ek = ½ × m × v².', 'Squares the speed first: 2² = 4.', 'Substitutes correctly: ½ × 3 × 4.', 'Gives the answer 6 with the unit J.'], ['Squaring the mass instead of the speed.', 'Leaving out the half.', 'Giving the answer without a unit.']),
]

export const lessonP3: ScienceLesson = {
  id: 'P-ENE-003-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Kinetic energy', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
