import type { TeachingFrame } from '../../teachingFrame'

// What kinetic energy is, the equation Ek = 1/2 x m x v squared (substitution only), then one worked example.
// No rearranging for speed or mass: the page only asks students to calculate kinetic energy.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const kineticFrames: Record<string, TeachingFrame[]> = {
  'P3-02': [
    f('Movement means kinetic energy', 'Anything that is moving has energy in its kinetic store.', 'moving means kinetic', 'Anything that is moving has energy in its kinetic store. A rolling ball has some. A parked car has none, because it is not moving.', 'kinetic-moving'),
    f('More mass, more energy', 'If two objects move at the same speed, the one with more mass has more kinetic energy.', 'heavier means more', 'Think of a bike and a lorry travelling at the same speed. The lorry has much more mass. So it has much more energy in its kinetic store, and it is much harder to stop.', 'kinetic-mass'),
    f('More speed, more energy', 'If two objects have the same mass, the faster one has more kinetic energy.', 'faster means more', 'Now think of two identical cars. The faster car has more energy in its kinetic store. So both the mass and the speed of an object decide how much kinetic energy it has.', 'kinetic-speed'),
    f('Speeding up and slowing down', 'Energy is transferred to the kinetic store when an object speeds up, and away from it when the object slows down.', 'speeding up fills the store', 'When an object speeds up, energy is transferred to its kinetic store. When it slows down, energy is transferred away from its kinetic store. A car braking to a stop is transferring its kinetic energy away.', 'kinetic-change'),
  ],
  'P3-05': [
    f('The equation in words', 'Kinetic energy = half × mass × speed squared.', 'half, mass, speed squared', 'We can work out how much energy is in a kinetic store. In words: kinetic energy equals one half, times mass, times speed squared. Speed squared means speed multiplied by itself.', 'kinetic-words'),
    f('Symbols and units', 'Ek = ½ × m × v². Kinetic energy Ek is in joules (J), mass m in kilograms (kg) and speed v in metres per second (m/s).', 'joules, kg, m/s', 'In symbols, the equation is Ek = ½ × m × v². Ek is kinetic energy, measured in joules, J. The mass m is in kilograms, kg. The speed v is in metres per second, m/s.', 'kinetic-symbols'),
    f('Square the speed first', 'v² means v × v. Work this out first, before you multiply by the mass and by a half.', 'square first', 'Be careful with the little 2. The speed is squared, but the mass is not. So work out v² first. If the speed is 3 m/s, then v² is 3 × 3 = 9. Then multiply by the mass and by a half.', 'kinetic-square'),
  ],
  'P3-08': [
    f('Worked example: write it down', 'A ball of mass 0.5 kg moves at 4 m/s. Write the equation, then the numbers.', 'equation, then numbers', 'A ball has a mass of 0.5 kg and moves at 4 m/s. What is the energy in its kinetic store? Start by writing the equation: Ek = ½ × m × v². The units are already kg and m/s, so no converting is needed.', 'kinetic-work-1'),
    f('Worked example: square the speed', 'Ek = ½ × 0.5 × 4². First 4² = 4 × 4 = 16.', 'square the speed first', 'Put the numbers in: Ek = ½ × 0.5 × 4². Work out the square first. 4² is 4 × 4, which is 16. Now the sum is Ek = ½ × 0.5 × 16.', 'kinetic-work-2'),
    f('Worked example: answer with units', 'Ek = ½ × 0.5 × 16 = 4 J. The unit of energy is the joule.', 'finish with joules', 'Half of 0.5 is 0.25. Then 0.25 × 16 = 4. So the kinetic energy of the ball is 4 joules. Always write the unit J at the end of your answer.', 'kinetic-work-3'),
  ],
}
