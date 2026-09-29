import type { TeachingFrame } from '../../teachingFrame'

// Gradient as steepness and rate, gradient = change in y / change in x from a straight line (worked example, then practice), three kinds of correlation.
// No tangents (Higher tier only). Rate needs time on the x-axis.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const wsGraphFrames: Record<string, TeachingFrame[]> = {
  'W8-02': [
    f('Gradient means steepness', 'The gradient of a graph is how steep the line is. It shows how quickly the dependent variable changes.', 'steep means quick change', 'The gradient of a line is how steep it is. A steep line means the dependent variable changes quickly when the independent variable changes. A flat line means it is not changing at all.', 'wsgraph-steep'),
    f('Steeper means faster', 'On a graph of gas volume against time, a steeper line means a faster reaction.', 'compare the steepness', 'Imagine two reactions that each make a gas. Plot the volume of gas against time for both. The line for the faster reaction is steeper, because more gas is made in each second.', 'wsgraph-compare'),
    f('The gradient formula', 'Gradient = change in y ÷ change in x. Change in y is the rise. Change in x is the run.', 'up divided by across', 'To put a number on the steepness, use this. Gradient equals the change in y divided by the change in x. The change in y is how far the line goes up. The change in x is how far it goes across.', 'wsgraph-formula'),
    f('Rate and units', 'With time on the x-axis, the gradient is the rate of change. Its unit is the y unit divided by the x unit.', 'time on x, unit from the axes', 'To find a rate from a graph, time must be on the x-axis. The gradient is then the rate. Its unit is the unit of y divided by the unit of x, such as cm³/s.', 'wsgraph-rate'),
  ],
  'W8-05': [
    f('Pick two points', 'Pick two points on the line that are easy to read and far apart: (10 s, 6 cm³) and (30 s, 18 cm³).', 'easy to read, far apart', 'A graph shows the volume of gas made in a reaction against time. Find the rate of reaction. Step one: pick two points on the line that are easy to read and far apart. We use (10 s, 6 cm³) and (30 s, 18 cm³).', 'wsgraph-work-1'),
    f('Draw the triangle', 'Draw a line down from the higher point and across from the other. The upright side is the change in y, the bottom side the change in x.', 'a right-angled triangle', 'Step two: draw a line down from the higher point. Then draw a line across from the lower point to meet it. This makes a triangle. The upright side is the change in y. The bottom side is the change in x.', 'wsgraph-work-2'),
    f('Read the two changes', 'Change in y = 18 − 6 = 12 cm³. Change in x = 30 − 10 = 20 s.', 'take the smaller from the larger', 'Step three: work out both changes from the numbers on the axes. The change in y is 18 − 6 = 12 cm³. The change in x is 30 − 10 = 20 s.', 'wsgraph-work-3'),
    f('Divide, then add the unit', 'Gradient = 12 ÷ 20 = 0.6 cm³/s. The rate of reaction is 0.6 cm³ per second.', 'divide, then unit', 'Step four: divide. Gradient equals change in y divided by change in x, so 12 ÷ 20 = 0.6. The unit is cm³ divided by s. So the rate of reaction is 0.6 cm³/s.', 'wsgraph-work-4'),
  ],
  'W8-08': [
    f('Positive correlation', 'If one variable increases as the other increases, there is positive correlation.', 'both go up', 'Points on a graph are often scattered but still show a trend. If one variable increases as the other increases, this is positive correlation. For example, a spring stretches more as the force on it grows.', 'wsgraph-positive'),
    f('Negative correlation', 'If one variable increases as the other decreases, there is negative (inverse) correlation.', 'one up, one down', 'If one variable increases as the other decreases, this is negative correlation. It is also called inverse correlation. For example, the hotter the water, the less time a tablet takes to dissolve.', 'wsgraph-negative'),
    f('No correlation', 'If the points show no pattern, there is no relationship between the variables.', 'no pattern at all', 'If the points are scattered with no pattern, there is no correlation. The two variables have no relationship. Shoe size and test mark are like this. Correlation alone does not prove that one variable causes the other.', 'wsgraph-none'),
  ],
}
