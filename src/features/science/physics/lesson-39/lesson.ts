import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { weightFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.5.1.3 Gravity: weight, mass and gravitational field strength (W = mg), as on the supplied revision page' }
const skill = 'P-WEIGHT'
const idea = author(skill, ['6.5.1.3'], ['aqa-physics'])
const calc = author(skill, ['6.5.1.3'], ['aqa-physics'])
const rearr = author(skill, ['6.5.1.3'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const weightSections = [
  { id: 'P39-01', label: 'Start here', detail: 'A bag of flour' },
  { id: 'P39-02', label: 'What is the difference between mass and weight?', detail: 'Kilograms, newtons and gravity' },
  { id: 'P39-05', label: 'How do you calculate weight?', detail: 'W = mg' },
  { id: 'P39-08', label: 'How do you find mass, and what is proportional?', detail: 'm = W ÷ g and W ∝ m' },
  { id: 'P39-11', label: 'On your own', detail: 'Calculate and explain' },
]

const states: ScienceState[] = [
  { ...idea.choice('P39-01', 'A bag of flour is labelled 1 kg. What does the 1 kg tell you?', ['How hard the Earth pulls on it', 'How much matter is in the bag', 'How big the bag is', 'How fast it can fall'], 1, 'Kilograms measure mass.', ['Kilograms measure mass.', 'Mass is the amount of matter in the bag.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(idea, 'P39-02', 'What is the difference between mass and weight?'),
  idea.choice('P39-03', 'An astronaut travels from the Earth to the Moon. What happens?', ['Mass and weight both stay the same', 'Mass gets smaller and weight stays the same', 'Mass stays the same and weight gets smaller', 'Mass and weight both get bigger'], 2, 'Gravity is weaker on the Moon.', ['Mass is the amount of matter, which does not change.', 'The Moon\'s gravity is weaker, so the weight is smaller.'], 'understanding'),
  idea.choice('P39-04', 'Which instrument measures weight, and in which unit?', ['A balance, in kilograms', 'A newtonmeter, in newtons', 'A ruler, in metres', 'A newtonmeter, in kilograms'], 1, 'Weight is a force.', ['Weight is a force, so it is measured in newtons.', 'A newtonmeter, or calibrated spring balance, measures it.'], 'recall'),
  t(calc, 'P39-05', 'How do you calculate weight?'),
  calc.choice('P39-06', 'A rock has a mass of 5 kg. What is its weight on the Moon, where g is 1.6 N/kg?', ['3.1 N', '6.6 N', '8 N', '49 N'], 2, 'Use W = m × g with the Moon\'s g.', ['W = m × g = 5 × 1.6.', '5 × 1.6 = 8, so the weight is 8 N.'], 'calculation'),
  calc.choice('P39-07', 'Why does a person weigh less on the Moon than on the Earth?', ['Their mass is less on the Moon', 'The Moon has no gravity at all', 'The Moon\'s gravitational field is weaker', 'The person is further from the Sun'], 2, 'Weight depends on gravitational field strength.', ['Weight = mass × gravitational field strength.', 'The Moon\'s gravitational field strength is weaker, so weight is less.'], 'understanding'),
  t(rearr, 'P39-08', 'How do you find mass, and what is proportional?'),
  rearr.choice('P39-09', 'An object weighs 147 N on the Earth. What is its mass? (g = 9.8 N/kg)', ['15 kg', '1440 kg', '0.07 kg', '157 kg'], 0, 'Rearrange to m = W ÷ g.', ['m = W ÷ g = 147 ÷ 9.8.', '147 ÷ 9.8 = 15, so the mass is 15 kg.'], 'calculation'),
  rearr.choice('P39-10', 'A student doubles the mass on a newtonmeter on Earth. What happens to the reading?', ['It halves', 'It stays the same', 'It doubles', 'It goes to zero'], 2, 'Weight is directly proportional to mass.', ['Weight is directly proportional to mass.', 'Double the mass means double the weight.']),
  { ...calc.choice('P39-11', 'A person has a mass of 60 kg. What is their weight on the Earth? (g = 9.8 N/kg)', ['588 N', '60 N', '6.1 N', '69.8 N'], 0, 'Word equation first, then substitute.', ['W = m × g = 60 × 9.8.', '60 × 9.8 = 588, so the weight is 588 N.'], 'calculation', true) },
  rearr.choice('P39-12', 'A crate weighs 392 N on the Earth. What is its mass? (g = 9.8 N/kg)', ['3841 kg', '0.025 kg', '402 kg', '40 kg'], 3, 'Divide the weight by g.', ['m = W ÷ g = 392 ÷ 9.8.', '392 ÷ 9.8 = 40, so the mass is 40 kg.'], 'calculation', true),
  rearr.choice('P39-13', 'On Earth, 1 kg weighs 9.8 N, 2 kg weighs 19.6 N, 4 kg weighs 39.2 N. Which conclusion is best?', ['Weight is not linked to mass', 'Weight is directly proportional to mass', 'Mass is bigger than weight', 'Weight stays the same as mass increases'], 1, 'Each time the mass doubles, look at the weight.', ['1 kg to 2 kg to 4 kg doubles the mass each time, and the weight doubles each time.', 'So weight is directly proportional to mass.'], 'dataInterpretation', true),
  idea.written('P39-14', 'A 10 kg rucksack is taken from the Earth to the Moon. Explain what changes and what stays the same.', 'Think about mass, weight and gravitational field strength.', 'The mass stays the same at 10 kg because it is the amount of matter. The weight gets smaller because the Moon has a weaker gravitational field strength. Weight = mass × gravitational field strength, so a smaller g gives a smaller weight.', ['The mass stays the same, because it is the amount of matter.', 'The weight decreases.', 'The Moon\'s gravitational field strength is weaker than the Earth\'s.', 'Weight = mass × g, so a smaller g gives a smaller weight.'], ['Saying mass gets smaller on the Moon.', 'Saying the Moon has no gravity.', 'Saying weight is measured in kilograms.']),
]

export const lessonP39: ScienceLesson = {
  id: 'P-FOR-039-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Weight, mass and gravity', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
