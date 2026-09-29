import type { TeachingFrame } from '../../teachingFrame'

// Wasted energy is dissipated, not destroyed; then the two ways to cut it (lubrication, insulation) and why houses cool at different rates.
// Conduction is described by what happens to the energy only (no particle detail at Foundation).
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const insulationFrames: Record<string, TeachingFrame[]> = {
  'P8-02': [
    f('Useful and wasted', 'In an energy transfer, some energy goes to the stores you want. The rest goes to stores you do not want.', 'wanted store, unwanted store', 'A lamp is switched on and energy is transferred electrically. Some energy goes to the light we want. This is the useful energy transfer. But some also goes to the thermal store of the lamp and the air. We call this wasted energy.', 'insul-useful-wasted'),
    f('Dissipated', 'Wasted energy spreads out into the surroundings. This is called dissipation.', 'spread out', 'Wasted energy spreads out into the surroundings and warms them slightly. We say it is dissipated. It usually ends up in the thermal stores of the surroundings. It is spread so thinly that it is very hard to use again.', 'insul-dissipate'),
    f('Never destroyed', 'Energy is never destroyed. Wasted energy still exists, but it is not stored in a useful way.', 'total stays the same', 'Wasted energy has not gone away. Energy can never be created or destroyed. If 100 J goes in and 60 J is useful, then 40 J is still there. It is stored somewhere we do not want it.', 'insul-conserved'),
    f('Two ways to waste less', 'Lubrication and insulation both reduce unwanted energy transfers.', 'lubrication or insulation', 'We cannot stop all waste, but we can reduce it. Two ways are lubrication and insulation. Lubrication reduces friction between moving parts. Insulation slows down energy transferred by heating.', 'insul-two-ways'),
  ],
  'P8-05': [
    f('Friction wastes energy', 'Friction between rubbing surfaces dissipates energy, so moving parts warm up.', 'rubbing → warmth', 'Friction is a force that acts when two surfaces rub together. It makes moving parts warm up. Some energy in the system is dissipated to the thermal store of the parts and the air. That energy is wasted.', 'insul-friction'),
    f('A lubricant', 'A lubricant, such as oil, reduces the friction between the surfaces.', 'a slippery layer', 'A lubricant is a slippery substance between surfaces that rub together. Oil is a common lubricant. It lets the surfaces slide past each other more easily, so there is less friction.', 'insul-lubricant'),
    f('Less friction, less waste', 'Less friction means less energy is dissipated. Oil in a car engine and on a bike chain are examples.', 'lubricant → less friction → less waste', 'With less friction, less energy is dissipated to the thermal stores of the parts and the air. Oil in a car engine does this for the moving parts inside. Oil on a bicycle chain does the same job. More of the energy is transferred usefully.', 'insul-lubricate-result'),
  ],
  'P8-07': [
    f('Conduction', 'When one end of an object is heated, energy passes along it. This is called conduction.', 'energy passes along', 'Heat one end of a metal spoon in hot soup. Energy is transferred to the thermal store of that end. The energy then passes gradually through the rest of the spoon, so the whole spoon warms up. This is called conduction.', 'insul-conduction'),
    f('Thermal conductivity', 'Thermal conductivity is a measure of how quickly energy is transferred through a material by conduction.', 'how quickly', 'Some materials pass energy along quickly and some do not. The measure of how quickly is called thermal conductivity. A material with a high thermal conductivity transfers lots of energy in a short time.', 'insul-conductivity'),
    f('Conductors and insulators', 'Materials with a low thermal conductivity are called thermal insulators.', 'high or low', 'Metals have a high thermal conductivity. That is why a metal saucepan heats up quickly. Materials with a low thermal conductivity are called thermal insulators. Plastic or wood handles on saucepans are insulators, so they stay cooler.', 'insul-conductors'),
    f('Insulators cut waste', 'Thermal insulators reduce the rate of energy transfer by heating, so they reduce unwanted transfers.', 'slower transfer', 'Thermal insulators can be used to reduce unwanted energy transfers by heating. A woolly hat is an insulator. It slows down the transfer of energy from your head to the cold air, so you stay warmer.', 'insul-insulators-use'),
  ],
  'P8-10': [
    f('A house cools down', 'A warm house transfers energy to the cold air outside. This makes the house cool.', 'inside warm, outside cold', 'On a cold day, energy is transferred from the warm house to the cooler air outside. The house cools down. To keep a house warm, we want to reduce the rate of cooling. There are three things that affect how quickly a building cools.', 'insul-house-cools'),
    f('Thicker walls', 'The thicker the walls, the slower the building cools.', 'thick → slow', 'The first thing is how thick the walls are. Energy has further to travel through thick walls. So the thicker the walls are, the slower the building cools.', 'insul-thickness'),
    f('Low conductivity walls', 'Walls made of a material with a low thermal conductivity reduce the rate of cooling.', 'low conductivity → slow cooling', 'The second thing is the thermal conductivity of the walls. If the walls are made of a material with a low thermal conductivity, energy passes through them slowly. This reduces the rate of cooling.', 'insul-wall-material'),
    f('Adding insulation', 'Adding thermal insulation, such as loft insulation, reduces the energy lost.', 'extra insulation', 'The third thing is how much thermal insulation the house has. Loft insulation is a thick layer of insulating material in the roof. It reduces the energy lost through the roof. The more insulation a house has, the slower it cools.', 'insul-loft'),
  ],
}
