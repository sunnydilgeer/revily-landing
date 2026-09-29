import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { densityFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.3.1.1 Density of materials, including the required practical on density (regular and irregular solids, liquids), as on the supplied revision page' }
const skill = 'P-DENSITY'
const meaning = author(skill, ['6.3.1.1'], ['aqa-physics'])
const calc = author(skill, ['6.3.1.1'], ['aqa-physics'])
const solids = author(skill, ['6.3.1.1'], ['aqa-physics'])
const liquids = author(skill, ['6.3.1.1'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const densitySections = [
  { id: 'P28-01', label: 'Start here', detail: 'Feathers or nails?' },
  { id: 'P28-02', label: 'What is density?', detail: 'Mass in a given space, and particle packing' },
  { id: 'P28-05', label: 'How do you calculate density?', detail: 'Mass ÷ volume, with units' },
  { id: 'P28-08', label: 'How do you measure a solid?', detail: 'Ruler for regular, eureka can for irregular' },
  { id: 'P28-11', label: 'How do you measure a liquid?', detail: 'Balance, measuring cylinder, care' },
  { id: 'P28-13', label: 'On your own', detail: 'Calculating and planning' },
]

const states: ScienceState[] = [
  { ...meaning.choice('P28-01', 'Two boxes are the same size. One is full of feathers and one is full of iron nails. Which has more mass?', ['The feathers', 'The iron nails', 'They have the same mass', 'It depends on the colour'], 1, 'Think about which is heavier to lift.', ['Iron is much denser than feathers.', 'More mass is packed into the same space, so the box of nails has more mass.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(meaning, 'P28-02', 'What is density?'),
  meaning.choice('P28-03', 'Which statement about density is correct?', ['Density is the mass of an object only', 'Density is the volume of an object only', 'Density is how much mass there is in a certain volume', 'Density is how heavy an object feels'], 2, 'It compares mass with the space taken up.', ['Density is a measure of how much mass there is in a certain space.', 'It uses both the mass and the volume.'], 'recall'),
  meaning.choice('P28-04', 'What is generally true of the density of solids, liquids and gases?', ['Solids are denser than liquids, and liquids are denser than gases', 'Gases are the densest', 'All three are equally dense', 'Liquids are the densest'], 0, 'Think about how tightly packed the particles are in each state.', ['Particles are most tightly packed in solids and least packed in gases.', 'So solids are generally the densest and gases the least dense.']),
  t(calc, 'P28-05', 'How do you calculate density?'),
  calc.choice('P28-06', 'A block of aluminium has a volume of 0.0040 m³ and a mass of 10.8 kg. What is its density?', ['0.00037 kg/m³', '0.043 kg/m³', '6.8 kg/m³', '2700 kg/m³'], 3, 'Mass on top, volume underneath.', ['Density = mass ÷ volume = 10.8 ÷ 0.0040.', '10.8 ÷ 0.0040 = 2700, so the density is 2700 kg/m³.'], 'calculation'),
  calc.choice('P28-07', 'Which of these is a unit of density?', ['kg', 'kg/m³', 'm³', 'J/kg'], 1, 'It is a mass per unit of volume.', ['Density is mass ÷ volume.', 'Kilograms divided by cubic metres gives kg/m³.'], 'recall'),
  t(solids, 'P28-08', 'How do you measure a solid?'),
  solids.choice('P28-09', 'How can you find the volume of a small, irregularly shaped stone?', ['Measure its length, width and height with a ruler', 'Weigh it on a balance', 'Lower it into a full eureka can and measure the water pushed out', 'Measure how long it takes to fall'], 2, 'The stone pushes water out of the way.', ['The stone displaces its own volume of water.', 'The water collected from the spout has the same volume as the stone.']),
  solids.choice('P28-10', 'Which equipment is needed to find the density of a cuboid?', ['A balance and a ruler', 'A thermometer and a balance', 'A stopwatch and a ruler', 'A measuring cylinder and a stopwatch'], 0, 'You need a mass and a volume.', ['A balance measures the mass.', 'A ruler measures the length, width and height, which give the volume.']),
  t(liquids, 'P28-11', 'How do you measure a liquid?'),
  liquids.choice('P28-12', 'When finding the density of a liquid, why is the balance zeroed with the empty measuring cylinder on it?', ['To make the liquid lighter', 'To measure the volume of the liquid', 'So the cylinder does not break', 'So the reading shows only the mass of the liquid'], 3, 'You do not want the cylinder included in the mass.', ['Zeroing removes the mass of the cylinder from the reading.', 'The balance then shows the mass of the liquid only.']),
  { ...calc.choice('P28-13', 'A block has a mass of 240 g and a volume of 30 cm³. What is its density in g/cm³?', ['0.125 g/cm³', '8 g/cm³', '270 g/cm³', '7200 g/cm³'], 1, 'Mass ÷ volume, with grams and cm³.', ['Density = mass ÷ volume = 240 ÷ 30.', '240 ÷ 30 = 8, so the density is 8 g/cm³.'], 'calculation', true) },
  solids.choice('P28-14', 'A stone of mass 30 g is lowered into a full eureka can. 12 cm³ of water is collected. Which is correct?', ['The stone has a volume of 30 cm³', 'The stone has a density of 12 g/cm³', 'The stone has a volume of 12 cm³ and a density of 2.5 g/cm³', 'The stone has a volume of 42 cm³'], 2, 'The water collected gives the volume. Then divide the mass by it.', ['The volume of water collected equals the volume of the stone, 12 cm³.', 'Density = 30 ÷ 12 = 2.5 g/cm³.'], 'application', true, 'density-q-eureka'),
  meaning.choice('P28-15', 'Three cubes of volume 10 cm³ have masses X 30 g, Y 80 g and Z 55 g. Which is densest?', ['Y', 'X', 'Z', 'They are all the same'], 0, 'The volumes are equal, so compare the masses.', ['With equal volumes, the cube with the most mass is the densest.', 'Y has the greatest mass, 80 g, so its density is 80 ÷ 10 = 8 g/cm³.'], 'dataInterpretation', true),
  meaning.written('P28-16', 'Describe how you would find the density of a small, irregularly shaped stone.', 'Think about the two things you need to measure: mass and volume.', 'Measure the mass of the stone on a balance. Fill a eureka can with water and put a measuring cylinder under the spout. Lower the stone in gently, so water is pushed out and collects in the cylinder. The volume of water collected is equal to the volume of the stone. Then use density = mass ÷ volume.', ['Measure the mass of the stone with a balance.', 'Fill a eureka can with water and place a measuring cylinder under the spout.', 'Lower the stone in so it pushes water out through the spout.', 'The volume of water collected equals the volume of the stone.', 'Density = mass ÷ volume.'], ['Measuring the volume of the stone with a ruler.', 'Dividing the volume by the mass.', 'Saying the stone floats.']),
]

export const lessonP28: ScienceLesson = {
  id: 'P-PRT-028-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Density', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
