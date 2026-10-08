import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ENE-005-P',
  sections: {
    'P5-02': [
      ['What happens to energy when a material is heated?', 'Energy is transferred to its thermal store, and its temperature increases.'],
      ['How does an electric water heater warm water?', 'Energy is transferred electrically to the thermal store of the heater, then by heating to the thermal store of the water.'],
    ],
    'P5-05': [
      ['What is specific heat capacity?', 'The energy needed to raise the temperature of 1 kg of a material by 1 °C. Its unit is J/kg°C.'],
      ['What does a high specific heat capacity mean?', 'The material needs more energy to warm up, so it is better at storing energy. It also transfers a lot of energy when it cools.', 'Water is 4200 J/kg°C.'],
    ],
    'P5-08': [
      ['What is the specific heat capacity equation?', 'Change in thermal energy = mass × specific heat capacity × temperature change. In symbols, ΔE = m × c × Δθ.', 'ΔE in joules (J), m in kg, c in J/kg°C, Δθ in °C.'],
      ['What do you do before using ΔE = mcΔθ?', 'Find the temperature change, Δθ, by subtracting one temperature from the other.'],
    ],
    'P5-11': [
      ['How do you calculate the energy needed to change a temperature?', 'Find Δθ, write ΔE = m × c × Δθ, substitute the numbers, multiply and give the answer in joules.', 'Example: 2 kg × 900 J/kg°C × 5 °C = 9000 J.'],
      ['Do you need to convert units before using ΔE = m × c × Δθ?', 'Only if they are not already right: mass must be in kg and the temperature change in °C. Always finish the answer with the unit J.'],
    ],
  },
  recall: ['P5-06', 'P5-10', 'P5-12'],
}
