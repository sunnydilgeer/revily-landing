import type { TeachingFrame } from '../../teachingFrame'

// Velocity-time graphs (line shapes, gradient = acceleration by one big triangle), drag, and terminal velocity told as a step-by-step story (qualitative only).
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const vtGraphFrames: Record<string, TeachingFrame[]> = {
  'P46-02': [
    f('Velocity against time', 'A velocity-time graph shows how the velocity of an object changes during a journey.', 'time along, velocity up', 'A velocity-time graph shows how fast an object is moving as time passes. Time in seconds goes along the bottom. Velocity in metres per second goes up the side.', 'vtgraph-axes'),
    f('A straight line sloping up', 'A straight line sloping up means constant acceleration.', 'uphill means speeding up', 'When the line slopes up in a straight line, the object is speeding up. It gains the same amount of speed every second. This is called constant acceleration.', 'vtgraph-uphill'),
    f('A flat line', 'A flat line means a steady speed.', 'flat means no change', 'A flat section means the velocity is not changing. The object is travelling at a steady speed. Its acceleration is zero.', 'vtgraph-flat'),
    f('A straight line sloping down', 'A straight line sloping down means slowing down at a steady rate, called deceleration.', 'downhill means slowing', 'When the line slopes down in a straight line, the object is slowing down. It loses the same amount of speed every second. This is called deceleration.', 'vtgraph-downhill'),
    f('A curved line', 'A curved line means the acceleration is changing.', 'curve means changing', 'If the line is a curve, the acceleration is changing. A curve that gets steeper means the object is speeding up faster and faster. A curve that levels off means the acceleration is getting smaller.', 'vtgraph-curve'),
  ],
  'P46-05': [
    f('Gradient is acceleration', 'The gradient of a velocity-time line is the acceleration. A steeper line means a bigger acceleration.', 'steepness', 'The steepness of a line on a graph is called its gradient. On a velocity-time graph, the gradient is the acceleration. Here a car speeds up in a straight line from 0 to 12 m/s in 4 s.', 'vtgraph-g1'),
    f('Draw a large triangle', 'Use the line as the sloping side of a big right-angled triangle.', 'big triangle', 'Draw a right-angled triangle with the sloping line as its slanted side. Make the triangle big, so it covers most of the line. A big triangle gives a more accurate answer.', 'vtgraph-g2'),
    f('Read the two sides', 'Upright side: 12 − 0 = 12 m/s. Flat side: 4 − 0 = 4 s.', 'change in velocity, change in time', 'The upright side is the change in velocity. Here it is 12 − 0 = 12 m/s. The flat side is the change in time. Here it is 4 − 0 = 4 s.', 'vtgraph-g3'),
    f('Divide', 'Gradient = change in velocity ÷ change in time = 12 ÷ 4 = 3.', 'upright ÷ flat', 'Gradient = change in velocity ÷ change in time. Put the numbers in. Gradient = 12 ÷ 4 = 3.', 'vtgraph-g4'),
    f('Add the unit', 'The acceleration of the car is 3 m/s².', 'm/s per s', 'Velocity is in metres per second and time is in seconds. So acceleration is in metres per second squared. The acceleration of the car is 3 m/s².', 'vtgraph-g5'),
  ],
  'P46-07': [
    f('Fluids', 'Gases and liquids are called fluids.', 'air and water', 'Gases and liquids are called fluids. Air is a fluid and so is water. A fluid pushes back on anything that moves through it.', 'vtgraph-fluid'),
    f('Drag', 'The force from a fluid on a moving object is called drag. In air it is called air resistance.', 'a force that pushes back', 'The push back from a fluid is a force called drag. Drag on an object moving through air is called air resistance.', 'vtgraph-drag'),
    f('Drag slows things down', 'Drag acts in the opposite direction to the movement.', 'opposite direction', 'Drag always acts in the opposite direction to the way the object is moving. So drag slows the object down.', 'vtgraph-drag-dir'),
    f('Faster means more drag', 'The faster an object moves through a fluid, the more drag it feels.', 'speed and drag', 'The faster an object moves through a fluid, the more drag it feels. A cyclist feels more air resistance at 10 m/s than at 3 m/s.', 'vtgraph-drag-speed'),
  ],
  'P46-09': [
    f('Just starting to fall', 'At the start, weight is much bigger than drag, so the skydiver accelerates.', 'weight bigger than drag', 'A skydiver has just jumped. Her weight, the force of gravity, is much bigger than the drag on her. The resultant force points down. So she accelerates, which means she speeds up.', 'vtgraph-term1'),
    f('Speed up, drag up', 'As her speed increases, the drag increases too.', 'faster means more drag', 'As she speeds up, the drag on her gets bigger. Her weight stays the same.', 'vtgraph-term2'),
    f('Acceleration gets smaller', 'The resultant force gets smaller, so the acceleration reduces.', 'resultant force shrinking', 'Bigger drag means the resultant force gets smaller. So her acceleration gets smaller. She is still speeding up, but not as quickly.', 'vtgraph-term3'),
    f('Drag equals weight', 'When drag equals weight, the resultant force is zero.', 'balanced forces', 'At last the drag is equal to her weight. The forces are balanced, so the resultant force is zero. She stops accelerating and falls at a constant speed.', 'vtgraph-term4'),
    f('Terminal velocity', 'This constant speed is called terminal velocity. On the graph, the curve levels off.', 'levelling off', 'The constant speed reached when drag equals weight is called the terminal velocity. On a velocity-time graph, the line curves and then becomes flat.', 'vtgraph-term5'),
  ],
}
