import type { TeachingFrame } from '../../teachingFrame'

// Forces and elasticity: more than one force to deform, elastic vs inelastic, extension, F = ke (substitute, then one rearrangement for k with cm to m),
// and the shape of a force-extension graph with the limit of proportionality. The springs practical and Ee = 1/2 k e squared belong to the next lesson.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const elasticFrames: Record<string, TeachingFrame[]> = {
  'P41-02': [
    f('It takes two forces', 'To change the shape of an object you need more than one force. One force on its own just moves the object.', 'one force moves, two forces squash', 'Push a ball with one force and it simply rolls away. To change the shape of an object, more than one force must act on it. You squash a sponge between your two hands.', 'elastic-shape'),
    f('Stretch, squash or bend', 'Forces can stretch, compress (squash) or bend an object. Changing its shape is called deformation.', 'stretch, squash, bend', 'Forces can stretch an object, squash it or bend it. When a force changes the shape of an object like this, we say the object is deformed. This change of shape is called deformation.', 'elastic-deform'),
    f('Elastic deformation', 'An object that goes back to its original shape and length when the forces are removed is elastically deformed.', 'it springs back', 'Stretch a spring and let go, and it goes back to its original shape and length. This is called elastic deformation. An object that can do this, such as a spring, is called an elastic object.', 'elastic-elastic'),
    f('Inelastic deformation', 'An object that does not go back to its original shape and length is inelastically deformed.', 'it stays changed', 'Squash a lump of plasticine and it stays squashed. Bend a paper clip far enough and it stays bent. The object does not return to its original shape and length. This is called inelastic deformation.', 'elastic-inelastic'),
    f('Energy is stored', 'When forces deform an elastic object, energy is transferred to its elastic potential store.', 'work done stores energy', 'Deforming an object means a force does work on it. So energy is transferred to the elastic potential store of the object. A stretched spring has energy stored in this store.', 'elastic-energy'),
  ],
  'P41-05': [
    f('What is extension?', 'The extension of a spring is how much longer it is than its natural length.', 'new length minus natural length', 'The natural length of a spring is its length when nothing is pulling it. Hang a mass on the spring and it gets longer. The extension is the difference between the stretched length and the natural length.', 'elastic-extension'),
    f('Double the force', 'Up to a point, doubling the force doubles the extension. This is called direct proportion.', 'twice the force, twice the stretch', 'Suppose a force of 2 N stretches a spring by 3 cm. Then 4 N stretches it by 6 cm, and 6 N by 9 cm. The extension is directly proportional to the force.', 'elastic-proportion'),
    f('The equation F = ke', 'Force = spring constant × extension, or F = k × e. F in newtons (N), k in newtons per metre (N/m), e in metres (m).', 'force, spring constant, extension', 'The link between force and extension is written as an equation. In words: force = spring constant × extension. In symbols: F = k × e. The force is in newtons, the extension is in metres, and the spring constant is in newtons per metre.', 'elastic-eq'),
    f('The spring constant', 'The spring constant, k, is bigger for a stiffer spring. Its value depends on the object being stretched.', 'stiff spring, big k', 'The spring constant tells you how stiff a spring is. A stiff spring needs a large force for each metre of extension, so it has a large k. A different spring has a different spring constant.', 'elastic-k'),
    f('Squashing works too', 'F = ke also works when a spring is compressed. Then e is the natural length minus the squashed length.', 'e is the change in length', 'The same equation works for compression. Now the extension e is how much shorter the spring is than its natural length. The force and the spring constant mean the same as before.', 'elastic-compress'),
  ],
  'P41-07': [
    f('Write it down', 'A spring has k = 30 N/m and is stretched by 0.2 m. Start with F = k × e.', 'equation first', 'A spring has a spring constant of 30 N/m. It is stretched by 0.2 m. What force is needed? Start by writing the equation: F = k × e.', 'elastic-w1'),
    f('Put the numbers in', 'F = 30 × 0.2', 'k times e', 'Substitute the values into the equation. F = 30 × 0.2. The extension is already in metres, so no converting is needed.', 'elastic-w2'),
    f('Work it out', '30 × 0.2 = 6, so F = 6 N.', 'finish with newtons', 'Multiply the two numbers: 30 × 0.2 = 6. The force needed is 6 newtons. Always write the unit N at the end.', 'elastic-w3'),
  ],
  'P41-09': [
    f('Get k on its own', 'F = k × e. Divide both sides by e to get k = F ÷ e.', 'divide the force by the extension', 'Sometimes you know the force and the extension and need the spring constant. Start with F = k × e. Divide both sides by e. This gives k = F ÷ e.', 'elastic-r1'),
    f('Convert cm to m', 'A force of 10 N stretches a spring by 5 cm. Change 5 cm to metres: 5 ÷ 100 = 0.05 m.', 'centimetres to metres first', 'A force of 10 N stretches a spring by 5 cm. The equation needs metres. There are 100 cm in 1 m, so divide by 100. 5 ÷ 100 = 0.05 m.', 'elastic-r2'),
    f('Divide', 'k = 10 ÷ 0.05 = 200 N/m.', 'force over extension', 'Now put the numbers into k = F ÷ e. k = 10 ÷ 0.05 = 200. The spring constant is 200 N/m.', 'elastic-r3'),
  ],
  'P41-11': [
    f('A force-extension graph', 'Force goes on the vertical axis and extension on the horizontal axis. Each cross is one measurement.', 'force up, extension across', 'A graph shows how a spring behaves as the force grows. Force in newtons goes up the vertical axis. Extension in metres goes along the horizontal axis. Each cross is one measurement.', 'elastic-graph1'),
    f('A straight line', 'A straight line through the origin means force and extension are directly proportional.', 'straight line, proportional', 'At first the crosses lie on a straight line through the origin. This shows that force and extension are directly proportional. Here the equation F = ke works.', 'elastic-graph2'),
    f('A steeper line', 'The steepness of the straight part equals the spring constant, k. A steeper line means a stiffer spring.', 'steeper means stiffer', 'The steepness of the straight line is equal to the spring constant. A stiffer spring needs more force for the same extension, so its line is steeper.', 'elastic-graph3'),
    f('The limit of proportionality', 'Where the line starts to bend is the limit of proportionality, point P. Past it, F = ke is no longer true.', 'bend means the limit', 'If you keep adding force, the line starts to bend. The point where it bends is called the limit of proportionality. Past this point, force and extension are no longer directly proportional. The equation F = ke is no longer true.', 'elastic-limit'),
  ],
}
