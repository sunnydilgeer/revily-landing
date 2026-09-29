import type { TeachingFrame } from '../../teachingFrame'

// Weight, mass and gravity: mass vs weight, centre of mass, W = mg with one worked example, one rearrangement (m = W / g), and W proportional to m.
// g = 9.8 N/kg on Earth and 1.6 N/kg on the Moon. Friendly numbers throughout.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const weightFrames: Record<string, TeachingFrame[]> = {
  'P39-02': [
    f('Mass', 'Mass is the amount of matter in an object. It is measured in kilograms, kg.', 'amount of stuff, kg', 'Mass is the amount of matter, or stuff, in an object. It is measured in kilograms, kg. Scientists think of all the mass of an object as being at one point, called the centre of mass.', 'weight-mass'),
    f('Weight', 'Weight is the force on an object due to gravity. It is measured in newtons, N.', 'a force, newtons', 'Weight is the force acting on an object because of gravity. You can think of this force as acting from the centre of mass. Weight is a force, so it is measured in newtons, N.', 'weight-force'),
    f('Gravitational field strength', 'Near the Earth, gravity pulls with a strength of about 9.8 N on every kilogram.', 'N per kg', 'Close to the Earth, the force of gravity comes from the Earth\'s gravitational field. Its strength is about 9.8 N/kg. That means every 1 kg of mass is pulled down by 9.8 N.', 'weight-field'),
    f('Weight changes, mass does not', 'On the Moon gravity is weaker (1.6 N/kg), so weight is less. The mass is the same.', 'place changes weight', 'The strength of gravity depends on where you are. On the Moon it is much weaker, only about 1.6 N/kg. So an object weighs less on the Moon. Its mass is always the same.', 'weight-moon'),
    f('Measuring weight', 'You measure weight with a newtonmeter, a calibrated spring balance.', 'newtonmeter', 'You can measure weight with a calibrated spring balance. This is also called a newtonmeter. The heavier the object hanging from it, the more the spring stretches, and the bigger the reading in newtons.', 'weight-meter'),
  ],
  'P39-05': [
    f('The equation', 'weight = mass × gravitational field strength, or W = mg.', 'word equation first', 'To work out weight, use the word equation weight = mass × gravitational field strength. In symbols, W = mg. Weight is in newtons, mass is in kilograms and g is in newtons per kilogram.', 'weight-eq'),
    f('Put the numbers in', 'A 20 kg object on Earth: W = 20 × 9.8.', 'mass and g', 'An object has a mass of 20 kg. It is on the Earth, where g is 9.8 N/kg. Put the numbers into the equation. W = 20 × 9.8.', 'weight-w2'),
    f('Work it out', '20 × 9.8 = 196', 'use a calculator', 'Multiply the two numbers. 20 × 9.8 = 196.', 'weight-w3'),
    f('Add the unit', 'The weight is 196 N.', 'weight is in newtons', 'Weight is a force, so the answer is in newtons. The weight of the 20 kg object on Earth is 196 N.', 'weight-w4'),
  ],
  'P39-08': [
    f('Rearranging', 'To find mass, divide the weight by g: m = W ÷ g.', 'undo the multiplying', 'Sometimes you know the weight and want the mass. W = mg means weight is mass multiplied by g. To get m on its own, divide both sides by g. This gives m = W ÷ g.', 'weight-rearrange'),
    f('A mass from a weight', 'An object weighs 490 N on Earth. m = 490 ÷ 9.8 = 50 kg.', 'divide by g', 'A box weighs 490 N on the Earth. Use m = W ÷ g. Then m = 490 ÷ 9.8 = 50. The mass of the box is 50 kg.', 'weight-mass-calc'),
    f('Directly proportional', 'Double the mass and the weight doubles. This is written W ∝ m.', 'twice the mass, twice the weight', 'In the same gravitational field, weight is directly proportional to mass. If you double the mass, the weight doubles too. If you halve the mass, the weight halves. We write this as W ∝ m.', 'weight-prop'),
    f('The graph idea', 'A graph of weight against mass is a straight line through the origin.', 'straight line', 'Suppose you hang 1 kg, 2 kg and 4 kg from a newtonmeter on Earth. The readings are 9.8 N, 19.6 N and 39.2 N. Plotted on a graph, these points make a straight line through the origin.', 'weight-graph'),
  ],
}
