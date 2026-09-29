import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { heatCapacityFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.1.1.3 Changes in thermal energy (energy transfer by heating, specific heat capacity, ΔE = mcΔθ), as on the supplied revision page' }
const skill = 'P-SHC'
const heating = author(skill, ['6.1.1.3'], ['aqa-physics'])
const meaning = author(skill, ['6.1.1.3'], ['aqa-physics'])
const equation = author(skill, ['6.1.1.3'], ['aqa-physics'])
const calc = author(skill, ['6.1.1.3'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const heatCapacitySections = [
  { id: 'P5-01', label: 'Start here', detail: 'Water and oil on the same heater' },
  { id: 'P5-02', label: 'What does heating do?', detail: 'Energy into the thermal store' },
  { id: 'P5-05', label: 'What is specific heat capacity?', detail: 'Materials warm up differently' },
  { id: 'P5-08', label: 'What is the equation?', detail: 'ΔE = m × c × Δθ' },
  { id: 'P5-11', label: 'How do you work one out?', detail: 'A worked example, then your turn' },
  { id: 'P5-14', label: 'On your own', detail: 'Read, calculate and explain' },
]

const states: ScienceState[] = [
  { ...heating.choice('P5-01', 'The same heater warms 1 kg of water and 1 kg of cooking oil for the same time. What is most likely?', ['Both rise by exactly the same temperature', 'The two temperatures rise by different amounts', 'Neither of them warms up', 'Only the water warms up'], 1, 'Think about whether every material heats up in the same way.', ['Different materials warm up by different amounts for the same energy.', 'This idea is called specific heat capacity.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(heating, 'P5-02', 'What does heating do?'),
  heating.choice('P5-03', 'An electric heater warms a tank of water. Which describes how energy is transferred?', ['By heating to the heater, then electrically to the water', 'By radiation to the water only', 'Electrically to the heater, then by heating to the water', 'Mechanically to the water, then by heating to the heater'], 2, 'The electric current reaches the heater first.', ['Energy is transferred electrically to the thermal store of the heater.', 'Then it is transferred by heating to the thermal store of the water.']),
  heating.choice('P5-04', 'A hot cup of tea cools down. What happens to the energy in its thermal store?', ['It is transferred away from the store', 'It is transferred into the store', 'It is destroyed', 'It does not change'], 0, 'The tea gets cooler, so its thermal store has less energy.', ['When a material cools, energy is transferred away from its thermal store.', 'The energy moves to the surroundings.']),
  t(meaning, 'P5-05', 'What is specific heat capacity?'),
  meaning.choice('P5-06', 'What is the specific heat capacity of a material?', ['The energy needed to raise the temperature of 1 kg of it by 1 °C', 'The temperature at which the material melts', 'The energy needed to melt 1 kg of it', 'The mass needed to raise its temperature by 1 °C'], 0, 'It uses 1 kg and 1 °C.', ['The specific heat capacity is the energy needed to raise the temperature of 1 kg of a material by 1 °C.'], 'recall'),
  meaning.choice('P5-07', 'Water has a specific heat capacity of 4200 J/kg°C. What does this tell you?', ['1 kg of water melts at 4200 °C', '4200 J raises the temperature of 1 kg of water by 1 °C', '4200 kg of water needs 1 J to warm up', '4200 J raises the temperature of 1 kg of water by 100 °C'], 1, 'Read the units: joules per kilogram per degree.', ['4200 J of energy raises the temperature of 1 kg of water by 1 °C.']),
  t(equation, 'P5-08', 'What is the equation?'),
  equation.choice('P5-09', 'A bucket of water warms from 15 °C to 40 °C. What is the temperature change, Δθ?', ['55 °C', '15 °C', '40 °C', '25 °C'], 3, 'Subtract the smaller temperature from the larger one.', ['Δθ = 40 − 15.', 'So the temperature change is 25 °C.'], 'calculation'),
  equation.choice('P5-10', 'Which is the correct unit for specific heat capacity?', ['J/kg°C', 'J/°C', 'kg/J°C', 'W/kg'], 0, 'Energy per kilogram per degree Celsius.', ['Specific heat capacity is measured in joules per kilogram per degree Celsius, J/kg°C.'], 'recall'),
  t(calc, 'P5-11', 'How do you work one out?'),
  calc.choice('P5-12', 'A 3 kg block with c = 400 J/kg°C warms from 10 °C to 30 °C. How much energy is transferred?', ['24 000 J', '2400 J', '12 000 J', '240 000 J'], 0, 'Find Δθ first, then use ΔE = m × c × Δθ.', ['Δθ = 30 − 10 = 20 °C.', 'ΔE = 3 × 400 × 20 = 24 000 J.'], 'calculation'),
  calc.choice('P5-13', 'A 0.5 kg mass of water (c = 4200 J/kg°C) cools from 60 °C to 40 °C. Find the energy transferred.', ['168 000 J', '4200 J', '84 000 J', '42 000 J'], 3, 'Find the temperature change first.', ['Δθ = 60 − 40 = 20 °C.', 'ΔE = 0.5 × 4200 × 20 = 42 000 J.'], 'calculation'),
  equation.choice('P5-14', 'The chart shows the specific heat capacity of four materials. Which needs the most energy to raise 1 kg by 1 °C?', ['Copper', 'Iron', 'Water', 'Aluminium'], 2, 'The longest bar has the largest specific heat capacity.', ['The larger the specific heat capacity, the more energy is needed for each degree.', 'Water has the longest bar.'], 'dataInterpretation', true, 'shc-q-bars'),
  calc.choice('P5-15', 'A 4 kg block with c = 500 J/kg°C warms from 15 °C to 25 °C. How much energy is transferred?', ['2000 J', '50 000 J', '10 000 J', '20 000 J'], 3, 'Find Δθ first, then put the numbers in.', ['Δθ = 25 − 15 = 10 °C.', 'ΔE = 4 × 500 × 10 = 20 000 J.'], 'calculation', true),
  calc.choice('P5-16', 'A 0.5 kg block with c = 800 J/kg°C cools from 50 °C to 30 °C. How much energy is transferred?', ['8000 J', '800 J', '20 000 J', '12 800 J'], 0, 'Find the temperature change first.', ['Δθ = 50 − 30 = 20 °C.', 'ΔE = 0.5 × 800 × 20 = 8000 J.'], 'calculation', true),
  meaning.written('P5-17', 'A 2 kg block with c = 500 J/kg°C warms from 20 °C to 30 °C. Show how to find the energy.', 'Find the temperature change, then use the equation.', 'The temperature change is Δθ = 30 − 20 = 10 °C. The equation is ΔE = m × c × Δθ. So ΔE = 2 × 500 × 10 = 10 000 J. The energy transferred to the block is 10 000 J.', ['Finds the temperature change: 30 − 20 = 10 °C.', 'Writes the equation ΔE = m × c × Δθ.', 'Substitutes correctly: 2 × 500 × 10.', 'Gives the answer 10 000 with the unit J.'], ['Using 30 or 20 as the temperature change.', 'Giving the answer without a unit.', 'Adding the numbers instead of multiplying.']),
]

export const lessonP5: ScienceLesson = {
  id: 'P-ENE-005-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Specific heat capacity', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
