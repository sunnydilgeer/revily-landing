import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { latentFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.3.2.3 Changes of heat and specific latent heat (heating and cooling graphs, E = mL), as on the supplied revision page' }
const skill = 'P-LATENT-HEAT'
const idea = author(skill, ['6.3.2.3'], ['aqa-physics'])
const graphs = author(skill, ['6.3.2.3'], ['aqa-physics'])
const slh = author(skill, ['6.3.2.3'], ['aqa-physics'])
const calc = author(skill, ['6.3.2.3'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const latentSections = [
  { id: 'P30-01', label: 'Start here', detail: 'A kettle stuck at 100 °C' },
  { id: 'P30-02', label: 'What is latent heat?', detail: 'Energy for a change of state' },
  { id: 'P30-05', label: 'What do the graphs show?', detail: 'Flat parts are changes of state' },
  { id: 'P30-08', label: 'What is specific latent heat?', detail: '1 kg, fusion and vaporisation' },
  { id: 'P30-11', label: 'How do you calculate it?', detail: 'E = mL, grams to kilograms' },
  { id: 'P30-14', label: 'On your own', detail: 'Calculating and reading graphs' },
]

const states: ScienceState[] = [
  { ...idea.choice('P30-01', 'Water in a kettle is boiling. A thermometer reads 100 °C, although the heater keeps supplying energy. Why?', ['The thermometer is broken', 'The heater has switched off', 'The energy is being used to change water into steam', 'Steam is colder than water'], 2, 'Boiling is a change of state.', ['During a change of state the energy does not raise the temperature.', 'It is used to change the water into steam.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(idea, 'P30-02', 'What is latent heat?'),
  idea.choice('P30-03', 'A pan of water is boiling at 100 °C. What happens to its temperature while it is still boiling?', ['It stays at 100 °C', 'It rises above 100 °C', 'It falls', 'It changes randomly'], 0, 'The temperature does not change during a change of state.', ['The temperature stays the same during a change of state.', 'The energy is used to break bonds, not to raise the temperature.'], 'recall'),
  idea.choice('P30-04', 'While ice is melting, where does the energy from heating go?', ['Raising the temperature of the ice', 'Making the particles vibrate faster', 'Cooling the surroundings', 'Breaking the bonds between the particles'], 3, 'Think about what changes when a solid becomes a liquid.', ['The energy is used to break the bonds between the particles.', 'So the internal energy increases without a rise in temperature.']),
  t(graphs, 'P30-05', 'What do the graphs show?'),
  graphs.choice('P30-06', 'What does a flat section on a heating graph show?', ['The substance is getting hotter', 'A change of state is happening', 'The heater has broken', 'The substance is a solid'], 1, 'The temperature is not changing.', ['A flat section means the temperature is constant.', 'That happens during a change of state.']),
  graphs.choice('P30-07', 'In the graph, which numbered part shows the substance melting?', ['Part 2', 'Part 4', 'Part 1', 'Part 3'], 0, 'Melting is the first change of state as it is heated, and the graph is flat.', ['Part 2 is flat and comes first, so it is melting.', 'Part 4 is the second flat part, which is boiling.'], 'understanding', false, 'latent-q-heating'),
  t(slh, 'P30-08', 'What is specific latent heat?'),
  slh.choice('P30-09', 'What does specific latent heat measure?', ['The energy to raise 1 kg by 1 °C', 'The temperature at which a solid melts', 'The energy to change the state of 1 kg without changing its temperature', 'The time taken to boil'], 2, 'It is about 1 kg and a change of state.', ['Specific latent heat is the energy needed to change the state of 1 kg of a material.', 'The temperature does not change during that change of state.'], 'recall'),
  slh.choice('P30-10', 'Which name is used for changing between a liquid and a gas?', ['Specific latent heat of fusion', 'Specific latent heat of vaporisation', 'Specific heat capacity', 'Specific latent heat of melting'], 1, 'Vaporisation sounds like vapour.', ['Boiling and condensing use the specific latent heat of vaporisation.', 'Fusion is for solid and liquid.']),
  t(calc, 'P30-11', 'How do you calculate it?'),
  calc.choice('P30-12', 'A liquid has a specific latent heat of vaporisation of 2 000 000 J/kg. How much energy boils 0.20 kg of it?', ['10 000 000 J', '2 000 000 J', '0.0000001 J', '400 000 J'], 3, 'Multiply the mass by the specific latent heat.', ['E = mL = 0.20 × 2 000 000.', 'E = 400 000 J.'], 'calculation'),
  calc.choice('P30-13', 'A 300 g sample has a specific latent heat of fusion of 200 000 J/kg. How much energy melts it?', ['60 000 J', '60 000 000 J', '600 000 J', '6000 J'], 0, 'Change grams to kilograms first.', ['300 g ÷ 1000 = 0.30 kg.', 'E = mL = 0.30 × 200 000 = 60 000 J.'], 'calculation'),
  { ...calc.choice('P30-14', 'How much energy boils 1.5 kg of a liquid, if its specific latent heat of vaporisation is 900 000 J/kg?', ['600 000 J', '2 400 000 J', '1 350 000 J', '1 350 J'], 2, 'E = mL, and the mass is already in kilograms.', ['E = mL = 1.5 × 900 000.', 'E = 1 350 000 J.'], 'calculation', true) },
  calc.choice('P30-15', 'How much energy is released when 400 g of a gas condenses? Its specific latent heat of vaporisation is 250 000 J/kg.', ['100 000 000 J', '100 000 J', '625 000 J', '1 000 000 J'], 1, 'Convert grams to kilograms, then use E = mL.', ['400 g ÷ 1000 = 0.40 kg.', 'E = mL = 0.40 × 250 000 = 100 000 J.'], 'calculation', true),
  graphs.choice('P30-16', 'The graph shows a substance being cooled. Which numbered part shows it freezing?', ['Part 2', 'Part 3', 'Part 5', 'Part 4'], 3, 'Freezing is a flat part, and it comes after the liquid has cooled.', ['Part 2 is the first flat part, where the gas condenses.', 'Part 4 is the second flat part, where the liquid freezes.'], 'dataInterpretation', true, 'latent-q-cooling'),
  idea.written('P30-17', 'Explain why the temperature stays the same while a substance boils, and how to calculate the energy needed.', 'Think about the bonds between particles, then the equation.', 'While a substance boils, the energy transferred by heating is all used to break the bonds between the particles, so none is left to raise the temperature. The energy needed is found with energy = mass × specific latent heat of vaporisation, E = mL, with the mass in kilograms.', ['Energy is transferred to the particles by heating during boiling.', 'The energy is used to break the bonds between the particles.', 'So none is left to raise the temperature.', 'E = mL: energy = mass (kg) × specific latent heat.'], ['Saying the heater is switched off.', 'Saying the particles slow down.', 'Using specific heat capacity for the calculation.']),
]

export const lessonP30: ScienceLesson = {
  id: 'P-PRT-030-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Specific latent heat', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
