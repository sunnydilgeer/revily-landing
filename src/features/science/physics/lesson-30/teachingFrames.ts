import type { TeachingFrame } from '../../teachingFrame'

// Latent heat: energy in a change of state, heating and cooling graphs, specific latent heat (fusion, vaporisation), and E = mL (substitution; g to kg once).
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const latentFrames: Record<string, TeachingFrame[]> = {
  'P30-02': [
    f('No rise in temperature', 'When a substance boils or melts, energy is transferred by heating but the temperature stays the same.', 'energy in, same temperature', 'When you boil or melt a substance, energy is transferred to its particles by heating. But the temperature stays the same while the state is changing.', 'latent-heating'),
    f('Where does the energy go?', 'The energy is all used for breaking bonds between the particles.', 'breaking bonds', 'The energy increases the internal energy of the substance. It is all used for breaking the bonds between the particles. So none is left over to raise the temperature.', 'latent-bonds'),
    f('Cooling releases energy', 'When a substance condenses or freezes, bonds form and energy is released. The temperature stays the same.', 'bonds forming', 'When a substance condenses or freezes, bonds form between the particles. This releases energy, so the internal energy decreases. The temperature stays the same during the change of state.', 'latent-cooling'),
    f('Latent heat', 'The energy transferred during a change of state is called latent heat.', 'energy for changing state', 'The energy transferred during a change of state is called latent heat. When a substance is heated, latent heat is the energy gained to cause the change. When it is cooled, it is the energy released.', 'latent-term'),
  ],
  'P30-05': [
    f('A heating graph', 'A heating graph shows temperature against time. It rises, goes flat, rises, goes flat, then rises again.', 'up, flat, up, flat, up', 'This graph shows a solid being heated steadily. Temperature is on the vertical axis and time is on the horizontal axis. The line goes up, then flat, then up, then flat, then up again.', 'latent-heatgraph'),
    f('The sloping parts', 'On a sloping part the temperature is rising, so the particles move faster. The substance is all one state.', 'temperature rising', 'On a sloping part of the graph, the temperature is rising. The particles are moving faster. The substance is in one state: a solid, then a liquid, then a gas.', 'latent-slope'),
    f('The flat parts', 'The flat parts show a change of state: melting at the melting point, boiling at the boiling point.', 'temperature does not change', 'The flat parts show a change of state. The first flat part is melting, at the melting point. The second is boiling, at the boiling point. The temperature does not change during a change of state.', 'latent-flat'),
    f('A cooling graph', 'A cooling graph is the same shape the other way round. The flat parts are condensing and freezing.', 'flat parts again', 'A cooling graph has the same shape, but it goes downwards. The flat parts are condensing and then freezing. Energy is released during these parts, but the temperature stays the same.', 'latent-coolgraph'),
  ],
  'P30-08': [
    f('Specific latent heat', 'The specific latent heat of a material is the energy needed to change the state of 1 kg of it without changing its temperature.', '1 kg changes state', 'Specific latent heat is an amount of energy. It is the energy needed to change the state of 1 kg of a material, without changing its temperature.', 'latent-def'),
    f('Not specific heat capacity', 'Specific heat capacity is about changes in temperature. Specific latent heat is about changes of state.', 'temperature or state', 'Do not mix this up with specific heat capacity. Specific heat capacity is about changes in temperature. Specific latent heat is about changes of state.', 'latent-vs'),
    f('Fusion', 'The specific latent heat of fusion is for changing between a solid and a liquid: melting or freezing.', 'solid and liquid', 'The specific latent heat of fusion is for changing between a solid and a liquid. That means melting or freezing.', 'latent-fusion'),
    f('Vaporisation', 'The specific latent heat of vaporisation is for changing between a liquid and a gas: boiling or condensing.', 'liquid and gas', 'The specific latent heat of vaporisation is for changing between a liquid and a gas. That means boiling or condensing.', 'latent-vapour'),
  ],
  'P30-11': [
    f('Choose the equation', 'How much energy melts 0.50 kg of ice at 0 °C? Use energy = mass × specific latent heat, E = mL.', 'word equation first', 'How much energy is needed to melt 0.50 kg of ice that is already at its melting point? The specific latent heat of fusion of ice is 334 000 J/kg. Start with the word equation: energy = mass × specific latent heat, or E = mL.', 'latent-w1'),
    f('Put the numbers in', 'E = 0.50 × 334 000', 'mass in kg', 'Substitute the values. E = 0.50 × 334 000. The mass is already in kilograms, so nothing needs converting.', 'latent-w2'),
    f('Work it out', 'E = 167 000 J. The unit is joules because it is energy.', 'answer in joules', 'Use a calculator. E = 167 000. The unit is joules, J, because it is energy. So 167 000 J of energy is needed to melt the ice.', 'latent-w3'),
    f('Grams to kilograms', 'If the mass is in grams, divide by 1000 to get kilograms before using E = mL.', 'convert first', 'If the mass is given in grams, change it to kilograms first. Divide by 1000. For example, 250 g ÷ 1000 = 0.25 kg. Then use E = mL.', 'latent-w4'),
  ],
}
