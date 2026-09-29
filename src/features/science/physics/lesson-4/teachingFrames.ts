import type { TeachingFrame } from '../../teachingFrame'

// Gravitational potential energy Ep = mgh (g = 9.8 N/kg) with a worked example, the falling-object idea (energy lost from the g.p.e. store = energy gained in the kinetic store, no air resistance),
// then elastic potential energy Ee = 1/2 k e squared by substitution. No speed-from-height calculation: too hard for Foundation.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const potentialFrames: Record<string, TeachingFrame[]> = {
  'P4-02': [
    f('Raised objects store energy', 'Lifting an object above the ground transfers energy to its gravitational potential (g.p.e.) store.', 'higher means more stored', 'Lifting an object above the ground transfers energy to its gravitational potential energy store. We write this as its g.p.e. store. The higher the object is, the more energy it has in this store.', 'gpe-raised'),
    f('Mass, gravity and height', 'The g.p.e. depends on the mass of the object, the height it is raised to, and the gravitational field strength.', 'mass, height, gravity', 'Three things decide how much energy is in the g.p.e. store. One is the mass of the object. Another is how high it is raised. The third is the strength of gravity, called the gravitational field strength.', 'gpe-three'),
    f('The equation in words', 'g.p.e. = mass × gravitational field strength × height.', 'multiply the three', 'To work out the energy in the g.p.e. store, multiply the three things together. In words: gravitational potential energy equals mass times gravitational field strength times height.', 'gpe-words'),
    f('Symbols, units and g', 'Ep = m × g × h. Ep in joules (J), m in kilograms (kg), g in newtons per kilogram (N/kg), h in metres (m). On Earth, g is 9.8 N/kg.', 'g = 9.8 on Earth', 'In symbols, the equation is Ep = m × g × h. Ep is measured in joules, J. Mass m is in kilograms, kg, and height h is in metres, m. Gravitational field strength g is in newtons per kilogram, N/kg. On Earth, g is 9.8 N/kg.', 'gpe-symbols'),
  ],
  'P4-05': [
    f('Worked example: write it down', 'A 5 kg bag is lifted onto a shelf 3 m high. Write the equation, then the numbers.', 'equation, then numbers', 'A bag of mass 5 kg is lifted onto a shelf that is 3 m high. How much energy is in its g.p.e. store? Start by writing the equation: Ep = m × g × h. Take g as 9.8 N/kg.', 'gpe-work-1'),
    f('Worked example: substitute', 'Ep = 5 × 9.8 × 3. Multiply step by step: 5 × 9.8 = 49, then 49 × 3 = 147.', 'multiply one step at a time', 'Put the numbers in: Ep = 5 × 9.8 × 3. Work through it one step at a time. First 5 × 9.8 = 49. Then 49 × 3 = 147.', 'gpe-work-2'),
    f('Worked example: the answer', 'Ep = 147 J. The energy in the g.p.e. store is 147 joules.', 'finish with joules', 'The bag has 147 joules of energy in its gravitational potential store. Always write the unit J at the end of the answer. The mass was in kg and the height was in m, so no converting was needed.', 'gpe-work-3'),
  ],
  'P4-08': [
    f('A falling object', 'As an object falls, energy is transferred mechanically from its g.p.e. store to its kinetic store.', 'height store to movement store', 'When an object falls, gravity pulls it downwards and it speeds up. Energy is transferred mechanically from its g.p.e. store to its kinetic store. The object is lower, but it is moving faster.', 'gpe-falling'),
    f('Lost equals gained', 'With no air resistance, the energy lost from the g.p.e. store equals the energy gained in the kinetic store.', 'energy lost = energy gained', 'Energy cannot be destroyed. So if we ignore air resistance, all the energy lost from the g.p.e. store is gained by the kinetic store. Energy lost from g.p.e. store = energy gained in kinetic store.', 'gpe-equal'),
    f('Using it', 'If a falling ball loses 30 J from its g.p.e. store, it gains 30 J in its kinetic store.', 'same number both ways', 'Suppose a ball falls and loses 30 joules from its g.p.e. store. With no air resistance, its kinetic store gains 30 joules. The numbers are the same. Only the store has changed.', 'gpe-use'),
  ],
  'P4-11': [
    f('Stretching and squashing', 'Stretching or squashing an object, such as a spring, transfers energy to its elastic potential store.', 'stretch or squash a spring', 'Stretching or squashing an object can transfer energy to its elastic potential store. A spring is a good example. The extension is how much longer the spring is than its normal length.', 'gpe-elastic'),
    f('The equation and its symbols', 'Ee = ½ × k × e². Ee in joules (J), k, the spring constant, in N/m, and e, the extension, in metres (m).', 'half, spring constant, extension squared', 'For a stretched spring, the energy in the elastic potential store is Ee = ½ × k × e². Ee is in joules. The spring constant k is in newtons per metre, N/m. The extension e is in metres. Square the extension first.', 'gpe-elastic-eq'),
    f('Worked example', 'A spring with k = 200 N/m is stretched by 0.1 m. Ee = ½ × 200 × 0.1² = ½ × 200 × 0.01 = 1 J.', 'square e first', 'A spring has a spring constant of 200 N/m. It is stretched by 0.1 m. First 0.1² = 0.1 × 0.1 = 0.01. Then Ee = ½ × 200 × 0.01 = 1. The energy in its elastic potential store is 1 joule.', 'gpe-elastic-work'),
    f('A limit', 'This equation only works if the spring has not been stretched past its limit of proportionality.', 'do not overstretch', 'The equation only works if the spring has not been stretched too far. Past a certain point, called the limit of proportionality, the spring stops behaving in the way the equation expects.', 'gpe-limit'),
  ],
}
