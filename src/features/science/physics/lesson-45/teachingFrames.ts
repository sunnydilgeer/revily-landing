import type { TeachingFrame } from '../../teachingFrame'

// Distance-time graphs: axes, flat = stationary, straight = steady speed, steeper = faster, curves = speeding up or slowing down,
// gradient = speed found with one large right-angled triangle (friendly numbers), and drawing a journey from its stages.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const dtGraphFrames: Record<string, TeachingFrame[]> = {
  'P45-02': [
    f('The two axes', 'Distance goes up the vertical axis and time goes along the horizontal axis. The line shows a whole journey.', 'distance up, time across', 'A distance-time graph shows how far an object has travelled as time goes by. Distance in metres goes up the vertical axis. Time in seconds goes along the horizontal axis. The line shows the whole journey.', 'dtgraph-axes'),
    f('A flat line', 'A flat (horizontal) line means the distance is not changing. The object is stationary.', 'time passes, distance does not', 'Look at a flat part of the line. Time keeps going along, but the distance stays the same. So the object is not moving. It is stationary.', 'dtgraph-flat'),
    f('A straight sloping line', 'A straight line that slopes upwards means the object moves at a steady speed.', 'same distance every second', 'A straight line that slopes upwards means the distance goes up by the same amount every second. So the object is moving at a steady speed.', 'dtgraph-straight'),
    f('Steeper means faster', 'The steepness of the line is called the gradient. The gradient of a distance-time graph is the speed, so a steeper line means a faster object.', 'steeper is faster', 'The steepness of a line is called its gradient. On a distance-time graph, the gradient is the speed. A steeper line covers more distance each second, so the object is going faster.', 'dtgraph-steeper'),
  ],
  'P45-05': [
    f('A curved line', 'A curved line means the gradient is changing. So the speed is changing.', 'curve means changing speed', 'Sometimes the line is a curve, not a straight line. The gradient keeps changing along a curve. So the speed of the object is changing too. The object is accelerating or decelerating.', 'dtgraph-curve'),
    f('Getting steeper', 'A curve that gets steeper and steeper means the object is speeding up.', 'steeper and steeper', 'Look at a curve where the line gets steeper as time goes on. The gradient is getting bigger, so the speed is getting bigger. The object is speeding up. It is accelerating.', 'dtgraph-curve-up'),
    f('Levelling off', 'A curve that levels off, becoming flatter and flatter, means the object is slowing down.', 'flatter and flatter', 'Now look at a curve that flattens out as time goes on. The gradient is getting smaller, so the speed is getting smaller. The object is slowing down. It is decelerating.', 'dtgraph-curve-down'),
  ],
  'P45-08': [
    f('Gradient gives speed', 'Speed = gradient = change in distance ÷ change in time. Use one large right-angled triangle on the line.', 'gradient is speed', 'To find the speed from a straight line, work out its gradient. The gradient is the change in distance divided by the change in time. To do this, draw one right-angled triangle on the line.', 'dtgraph-g1'),
    f('Draw a large triangle', 'The sloping side of the triangle is the line. Make the triangle big, so it uses most of the line.', 'big triangle, most of the line', 'Draw the triangle so that the sloping side lies along the line on the graph. Make the triangle large, using most of the line. A small triangle makes it hard to read the numbers accurately.', 'dtgraph-g2'),
    f('Read the two sides', 'Horizontal side: change in time = 8 − 2 = 6 s. Vertical side: change in distance = 16 − 4 = 12 m.', 'across for time, up for distance', 'Use the horizontal side to find the change in time. Here it is 8 − 2 = 6 s. Use the vertical side to find the change in distance. Here it is 16 − 4 = 12 m.', 'dtgraph-g3'),
    f('Divide', 'Speed = 12 ÷ 6 = 2 m/s.', 'distance over time', 'Now divide the change in distance by the change in time. Speed = 12 ÷ 6 = 2. The speed is 2 m/s.', 'dtgraph-g4'),
  ],
  'P45-10': [
    f('Split it into stages', 'Break the journey into stages. Each stage becomes one part of the line.', 'one stage, one line', 'Suppose a boy walks 20 m in 10 s, stops for 10 s, then walks 20 m in 20 s. Split it into three stages. Each stage will be one part of the line.', 'dtgraph-d1'),
    f('Plot each stage', 'Start at the origin. Stage 1 goes up to 20 m at 10 s. Stage 2 is flat until 20 s. Stage 3 rises to 40 m at 40 s.', 'flat means stopped', 'Start at the origin, where time and distance are both zero. Stage 1 rises to 20 m at 10 s. Stage 2 is flat, because he stops, until 20 s. Stage 3 rises another 20 m to reach 40 m at 40 s.', 'dtgraph-d2'),
    f('Check your graph', 'Label both axes with units. Stage 1 is steeper than stage 3, because he walks faster in stage 1.', 'labels and steepness', 'Label each axis with its quantity and unit. Then check the steepness. In stage 1 he walks 20 m in 10 s, which is faster than in stage 3. So stage 1 must be steeper.', 'dtgraph-d3'),
  ],
}
