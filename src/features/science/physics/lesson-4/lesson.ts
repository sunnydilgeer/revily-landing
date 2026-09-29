import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { potentialFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.1.1.2 Gravitational potential energy (Ep = mgh, g = 9.8 N/kg), falling objects, and elastic potential energy (Ee = ½ke²), as on the supplied revision page' }
const skill = 'P-POTENTIAL'
const raised = author(skill, ['6.1.1.2'], ['aqa-physics'])
const calc = author(skill, ['6.1.1.2'], ['aqa-physics'])
const falling = author(skill, ['6.1.1.2'], ['aqa-physics'])
const elastic = author(skill, ['6.1.1.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const potentialSections = [
  { id: 'P4-01', label: 'Start here', detail: 'A book on the floor or on a shelf' },
  { id: 'P4-02', label: 'What is g.p.e.?', detail: 'Energy stored by height' },
  { id: 'P4-05', label: 'How do you work out g.p.e.?', detail: 'Ep = m × g × h' },
  { id: 'P4-08', label: 'What happens when it falls?', detail: 'Height store to kinetic store' },
  { id: 'P4-11', label: 'What about springs?', detail: 'Elastic potential energy' },
  { id: 'P4-14', label: 'On your own', detail: 'Calculate and explain' },
]

const states: ScienceState[] = [
  { ...raised.choice('P4-01', 'A book is lifted from the floor onto a high shelf. What has changed about its stored energy?', ['Nothing has changed', 'It has more energy stored because it is higher', 'It has less energy stored because it is not moving', 'It has become heavier'], 1, 'Think about what it could do if it fell.', ['Lifting the book transfers energy to it.', 'The higher it is, the more energy is in its gravitational potential store.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(raised, 'P4-02', 'What is g.p.e.?'),
  raised.choice('P4-03', 'A 2 kg bag and a 1 kg bag are lifted to the same height. Which gains more g.p.e.?', ['The 1 kg bag', 'The 2 kg bag', 'They gain the same', 'Neither gains any'], 1, 'The height is the same, so compare the masses.', ['The g.p.e. depends on mass, height and g.', 'At the same height, more mass means more g.p.e.']),
  raised.choice('P4-04', 'What value of g, the gravitational field strength, is used on Earth in this course?', ['98 N/kg', '0.98 N/kg', '9.8 N/kg', '9.8 J'], 2, 'It is a little under 10, and its unit is newtons per kilogram.', ['On Earth, g is 9.8 N/kg.'], 'recall'),
  t(calc, 'P4-05', 'How do you work out g.p.e.?'),
  calc.choice('P4-06', 'A 4 kg box is lifted onto a shelf 5 m high. What is its g.p.e.? Use g = 9.8 N/kg.', ['196 J', '19.6 J', '39.2 J', '1960 J'], 0, 'Ep = m × g × h. Multiply one step at a time.', ['4 × 9.8 = 39.2.', 'Then 39.2 × 5 = 196 J.'], 'calculation'),
  calc.choice('P4-07', 'A 10 kg parcel is raised 3 m. What is the energy in its g.p.e. store? Use g = 9.8 N/kg.', ['98 J', '29.4 J', '30 J', '294 J'], 3, 'Ep = m × g × h.', ['10 × 9.8 = 98.', 'Then 98 × 3 = 294 J.'], 'calculation'),
  t(falling, 'P4-08', 'What happens when it falls?'),
  falling.choice('P4-09', 'A ball falls from a shelf. Which store loses energy, and which store gains it?', ['The kinetic store loses, the g.p.e. store gains', 'The g.p.e. store loses, the kinetic store gains', 'The thermal store loses, the g.p.e. store gains', 'Both stores lose energy'], 1, 'The ball goes down and speeds up.', ['As the ball falls it gets lower, so its g.p.e. store loses energy.', 'It speeds up, so its kinetic store gains energy.']),
  falling.choice('P4-10', 'A diver loses 500 J of g.p.e. while falling. Ignore air resistance. How much kinetic energy is gained?', ['250 J', '500 J', '1000 J', '0 J'], 1, 'Energy lost from one store is gained by the other.', ['With no air resistance, energy lost from g.p.e. = energy gained in the kinetic store.', 'So the kinetic store gains 500 J.'], 'application'),
  t(elastic, 'P4-11', 'What about springs?'),
  elastic.choice('P4-12', 'A spring with k = 100 N/m is stretched by 0.2 m. What is its elastic potential energy?', ['4 J', '20 J', '2 J', '10 J'], 2, 'Ee = ½ × k × e². Square the extension first.', ['e² = 0.2 × 0.2 = 0.04.', 'Ee = ½ × 100 × 0.04 = 2 J.'], 'calculation'),
  elastic.choice('P4-13', 'What does the extension, e, of a spring mean?', ['How much longer the spring is than its normal length', 'How heavy the spring is', 'How hard the spring is to stretch', 'How fast the spring moves'], 0, 'It is measured in metres.', ['The extension is how much longer the spring is than its normal length.', 'It is measured in metres.'], 'recall'),
  calc.choice('P4-14', 'A 20 kg box is lifted 2 m onto a platform. What is its g.p.e.? Use g = 9.8 N/kg.', ['40 J', '196 J', '392 J', '22 J'], 2, 'Write the equation Ep = m × g × h, then put the numbers in.', ['20 × 9.8 = 196.', 'Then 196 × 2 = 392 J.'], 'calculation', true),
  falling.choice('P4-15', 'A ball falls and gains 15 J in its kinetic store. Ignore air resistance. How much energy did its g.p.e. store lose?', ['30 J', '7.5 J', '0 J', '15 J'], 3, 'Energy is conserved.', ['With no air resistance, the g.p.e. lost equals the kinetic energy gained.', 'So the g.p.e. store lost 15 J.'], 'application', true),
  elastic.choice('P4-16', 'The three springs are identical. Which has the most energy in its elastic potential store?', ['Spring 1', 'Spring 3', 'Spring 2', 'They are all the same'], 1, 'Look at how far each is stretched.', ['The more a spring is stretched, the more energy is in its elastic potential store.', 'Spring 3 has the largest extension.'], 'dataInterpretation', true, 'gpe-q-springs'),
  elastic.choice('P4-17', 'A spring with k = 300 N/m is stretched by 0.2 m. What is its elastic potential energy?', ['12 J', '30 J', '60 J', '6 J'], 3, 'Ee = ½ × k × e². Square the extension first.', ['e² = 0.2 × 0.2 = 0.04.', 'Ee = ½ × 300 × 0.04 = 6 J.'], 'calculation', true),
  falling.written('P4-18', 'A 2 kg toy falls 5 m from a balcony. Ignore air resistance. Calculate the g.p.e. lost and the kinetic energy gained.', 'Use Ep = m × g × h, then use conservation of energy.', 'Ep = m × g × h = 2 × 9.8 × 5 = 98 J. So 98 J is lost from the g.p.e. store. With no air resistance, energy cannot be destroyed, so the kinetic store gains 98 J just before the toy lands.', ['Writes the equation Ep = m × g × h.', 'Substitutes correctly: 2 × 9.8 × 5.', 'Gives 98 J with the unit.', 'States that the kinetic store gains the same, 98 J.', 'Says this is because energy is conserved when there is no air resistance.'], ['Squaring the height or the mass.', 'Giving the answer without a unit.', 'Saying the kinetic store gains more energy than the g.p.e. store loses.']),
]

export const lessonP4: ScienceLesson = {
  id: 'P-ENE-004-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Gravitational and elastic potential energy', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
