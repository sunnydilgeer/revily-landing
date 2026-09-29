import type { TeachingFrame } from '../../teachingFrame'

// Heating raises the thermal store, what specific heat capacity means, the equation change in thermal energy = m c change in temperature (substitution; find the temperature change first), then one worked example.
// The required practical is taught in a later lesson; only substitution here, no rearranging.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const heatCapacityFrames: Record<string, TeachingFrame[]> = {
  'P5-02': [
    f('Heating fills the thermal store', 'When a material is heated, energy is transferred to its thermal store, and its temperature increases.', 'more energy in, hotter', 'When a material is heated, energy is transferred to its thermal store. This makes its temperature go up. When a material cools down, energy is transferred away from its thermal store.', 'shc-heating'),
    f('An electric water heater', 'Energy is transferred electrically to the heater, then by heating to the water. The water gets hotter.', 'electrically, then by heating', 'Think of an electric heater dipped in a tank of water. Energy is transferred electrically to the thermal store of the heater. Then energy is transferred by heating to the thermal store of the water. The temperature of the water increases.', 'shc-heater'),
    f('Describing the change', 'Name the stores and the ways: electrically to the heater, by heating to the water, so the temperature increases.', 'stores, ways and the result', 'You may be asked to describe how energy is stored when something is heated. Say which store gains energy, how the energy got there, and what happens to the temperature. This uses the same words as before: stores, and the four ways of transferring energy.', 'shc-describe'),
  ],
  'P5-05': [
    f('Materials are different', 'Some materials need more energy than others to raise their temperature by the same amount.', 'same heating, different results', 'Heat 1 kg of water and 1 kg of copper on identical heaters for the same time. The copper gets much hotter than the water. Different materials need different amounts of energy to warm up by the same amount.', 'shc-different'),
    f('Specific heat capacity', 'The specific heat capacity of a material is the energy needed to raise the temperature of 1 kg of it by 1 °C.', '1 kg, 1 °C', 'This idea has a name. The specific heat capacity of a material is the energy needed to raise the temperature of 1 kg of the material by 1 °C. Its unit is joules per kilogram per degree Celsius, J/kg°C.', 'shc-definition'),
    f('Water needs a lot', 'Water has a specific heat capacity of 4200 J/kg°C. It takes 4200 J to warm 1 kg of water by 1 °C.', 'water: 4200 J/kg°C', 'Water has a specific heat capacity of 4200 J/kg°C. So 4200 joules of energy raise the temperature of 1 kg of water by only 1 °C. Copper is about 390 J/kg°C, so it needs much less.', 'shc-water'),
    f('A high value stores more', 'The higher the specific heat capacity, the better a material is at storing energy. It also transfers a lot of energy when it cools.', 'high value, big energy store', 'A material with a high specific heat capacity can store a lot of energy for each degree of temperature change. It also transfers a lot of energy away when it cools down.', 'shc-high'),
  ],
  'P5-08': [
    f('The equation in words', 'Change in thermal energy = mass × specific heat capacity × temperature change.', 'multiply three things', 'We can work out how much energy is transferred when a material changes temperature. In words: change in thermal energy equals mass times specific heat capacity times temperature change.', 'shc-words'),
    f('Symbols and units', 'ΔE = m × c × Δθ. ΔE in joules (J), m in kilograms (kg), c in J/kg°C, and Δθ in degrees Celsius (°C).', 'delta means change in', 'In symbols, the equation is ΔE = m × c × Δθ. The Greek letter Δ, called delta, means change in. The Greek letter θ, called theta, stands for temperature. So Δθ is the change in temperature.', 'shc-symbols'),
    f('Find the temperature change first', 'Δθ is the difference between the two temperatures. Subtract the smaller from the larger.', 'take one temperature from the other', 'Before you use the equation, find the temperature change. It is the difference between the start and end temperatures. If a block warms from 20 °C to 25 °C, the temperature change is 25 − 20 = 5 °C.', 'shc-delta'),
  ],
  'P5-11': [
    f('Worked example: temperature change', 'A 2 kg metal block, with c = 900 J/kg°C, warms from 20 °C to 25 °C. Step 1: Δθ = 25 − 20 = 5 °C.', 'step 1: the temperature change', 'A block of metal has a mass of 2 kg and a specific heat capacity of 900 J/kg°C. It warms from 20 °C to 25 °C. How much energy is transferred to it? Step one: find the temperature change. Δθ = 25 − 20 = 5 °C.', 'shc-work-1'),
    f('Worked example: substitute', 'ΔE = m × c × Δθ = 2 × 900 × 5.', 'step 2: put the numbers in', 'Step two: write the equation and put the numbers in. ΔE = m × c × Δθ. So ΔE = 2 × 900 × 5. The mass is already in kg and the temperature change is in °C, so no converting is needed.', 'shc-work-2'),
    f('Worked example: the answer', '2 × 900 = 1800, then 1800 × 5 = 9000. ΔE = 9000 J.', 'step 3: multiply, then add the unit', 'Step three: work it out. 2 × 900 = 1800. Then 1800 × 5 = 9000. So 9000 joules of energy are transferred to the block. Always finish with the unit J.', 'shc-work-3'),
  ],
}
