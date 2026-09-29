import type { TeachingFrame } from '../../teachingFrame'

// Resultant forces in a straight line, work done W = Fs (joules, cm to m conversion shown), and energy heating things through friction.
// Numbers are friendly; conversions from cm to m are an explicit step.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const resultantFrames: Record<string, TeachingFrame[]> = {
  'P40-02': [
    f('One force instead of many', 'A resultant force is the single force that has the same effect as all the forces acting together.', 'many forces, one replacement', 'Often several forces act on an object. You can replace them with one single force. This single force is called the resultant force. It has the same effect as all the original forces put together.', 'resultant-idea'),
    f('Same direction: add', 'Forces in the same direction add together.', 'same way, add', 'When forces act along a straight line, you can find the resultant. Forces in the same direction are added together. For example, two people pushing a car with 200 N and 300 N give a resultant of 500 N.', 'resultant-add'),
    f('Opposite directions: subtract', 'Forces in opposite directions are taken away from each other.', 'opposite, take away', 'Forces in opposite directions are subtracted. The bigger force wins, so the resultant acts in its direction. Two forces of 15 N in opposite directions cancel out, and the resultant is 0 N.', 'resultant-subtract'),
    f('A worked example', 'A trolley is pulled 12 N right and 8 N left. The resultant is 12 − 8 = 4 N to the right.', 'bigger minus smaller', 'A trolley is pulled to the right with 12 N. Another force pulls it to the left with 8 N. The forces are opposite, so subtract. 12 N − 8 N = 4 N. The resultant force is 4 N to the right.', 'resultant-trolley'),
  ],
  'P40-05': [
    f('Force and distance', 'When a force moves an object through a distance, work is done and energy is transferred.', 'force moves something', 'When a force moves an object through a distance, energy is transferred and work is done on the object. Work done and energy transferred mean the same thing here.', 'resultant-work'),
    f('The equation', 'work done = force × distance moved along the line of the force, or W = Fs.', 'word equation first', 'To work out the work done, use the word equation work done = force × distance. In symbols, W = Fs. Work done is in joules, J, force is in newtons, N, and distance is in metres, m.', 'resultant-eq'),
    f('A worked example', 'A 40 N force pushes a box 3 m. W = 40 × 3 = 120 J.', 'substitute, then unit', 'A force of 40 N pushes a box 3 m along the floor. Put the numbers in. W = 40 × 3. That is 120. Work done is measured in joules, so the answer is 120 J.', 'resultant-example'),
    f('What is a joule?', 'One joule is the work done when a force of one newton moves an object one metre. 1 J = 1 Nm.', 'newton-metre', 'One joule of work is done when a force of one newton moves an object a distance of one metre. So a joule is the same as a newton-metre. We write this as 1 J = 1 Nm.', 'resultant-joule'),
  ],
  'P40-08': [
    f('Distance in metres', 'The distance must be in metres. Convert centimetres by dividing by 100.', 'cm ÷ 100 = m', 'In the equation W = Fs, the distance must be in metres. If it is in centimetres, convert it first. Divide the centimetres by 100 to get metres. So 50 cm is 50 ÷ 100 = 0.5 m.', 'resultant-convert'),
    f('A worked example', 'A 30 N force pushes a box 50 cm. Convert to 0.5 m, then W = 30 × 0.5 = 15 J.', 'convert, then substitute', 'A force of 30 N pushes a box 50 cm. First convert. 50 cm = 0.5 m. Then W = Fs = 30 × 0.5. That is 15. The work done is 15 J.', 'resultant-convert-eg'),
    f('Working against friction', 'Pushing a box along a rough surface means doing work against friction.', 'friction acts backwards', 'When you push a box along a rough carpet, friction acts the opposite way to the motion. So you do work against friction. Some of the energy goes to the kinetic energy store of the box, because it moves.', 'resultant-friction'),
    f('Friction warms things up', 'Work done against friction transfers energy to the thermal store, so the temperature rises.', 'thermal store, warmer', 'The work done against friction also transfers energy to the thermal energy store of the box and the carpet. So the box and the carpet get a little warmer: their temperature rises.', 'resultant-heat'),
  ],
}
