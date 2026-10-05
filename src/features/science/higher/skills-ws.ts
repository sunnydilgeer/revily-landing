/*
 * Higher-only section for Working Scientifically, from the CGP AQA Combined Science Higher guide page 248 (scope only; all
 * wording, graphs, numbers and questions are original). AQA 8464 WS 3.5 with maths skill 4e (HT: draw and use the slope of a
 * tangent to a curve as a measure of rate of change). Diagrams: components/HigherGraphTangentVisuals.tsx ('hgrad-').
 * A cyclist's distance–time graph (distance = time² ÷ 4) is used, so the section does not repeat Chemistry 35's
 * rate-of-reaction tangent: tangent at 10 s → 5 m/s (taught), tangent at 12 s → 6 m/s (practice).
 */
import { addition, f, type HigherAddition } from './helpers'

// Working Scientifically Lesson 8 · Higher p248: the gradient at one point on a curve, from a tangent. Before "On your own".
const curveGradient = addition('W-DAT-008-W', 'W8-12', 'W-HIGHER-TANGENT', ['WS 3.5', 'MS 4e'],
  { id: 'W8-H01', higher: true, label: 'Gradients of curves', detail: 'Tangents on a curved line' },
  [
    f('A curved line', 'When a line curves, its gradient changes from point to point.', 'curve → steepness keeps changing', 'A cyclist sets off from traffic lights and speeds up. This graph shows the distance they travel against time. The line curves upwards and gets steeper. So its gradient is different at every point, and one triangle cannot give it.', 'hgrad-curve'),
    f('Pick your point', 'Find the point on the curve at the time you want.', 'up from 10 s → dot on the curve', 'We want the gradient at exactly 10 seconds. Start at 10 s on the x-axis. Go straight up to the curve and mark the point. Here the cyclist has gone 25 m.', 'hgrad-point'),
    f('Draw a tangent', 'A tangent is a straight line that just touches the curve at one point.', 'ruler touches → same gap both sides', 'Lay a ruler on the graph so it just touches the curve at your point. Turn it until the gap between the ruler and the curve is the same on both sides. Draw a long straight line along the ruler. This line is called a tangent.', 'hgrad-tangent'),
    f('Find its gradient', 'Find the gradient of the tangent from two points on it that are far apart.', 'two far-apart points → up ÷ across', 'Find the gradient of the tangent, just as for a straight line. Pick two points on it that are easy to read and far apart: (6 s, 5 m) and (16 s, 55 m). Change in y = 55 − 5 = 50 m. Change in x = 16 − 6 = 10 s. Gradient = 50 ÷ 10 = 5 m/s.', 'hgrad-gradient'),
    f('Put it together', 'The gradient at one point on a curve is the gradient of the tangent there. Always give its unit.', 'point → tangent → two points → divide → unit', 'So the gradient at 10 s is 5 m/s. On a distance–time graph the gradient is the speed, so the cyclist is going at 5 m/s at that moment. The unit is the y unit divided by the x unit, so m ÷ s gives m/s.', 'hgrad-all'),
  ],
  a => [
    a.choice('W8-H02', 'A tangent has been drawn at 12 s on the cyclist’s graph. Use the two dots on it. What is the cyclist’s speed at 12 s?', ['3 m/s', '6 m/s', '0.17 m/s', '3.75 m/s'], 1, 'Read both dots. Then find the change in y and the change in x.', ['The dots are at (6 s, 0 m) and (16 s, 60 m).', 'Change in y = 60 − 0 = 60 m. Change in x = 16 − 6 = 10 s. So 60 ÷ 10 = 6 m/s.'], 'calculation', false, 'hgrad-q-tangent'),
    a.choice('W8-H03', 'What is a tangent to a curve?', ['A line joining the first and last points of the curve', 'The steepest part of the curve', 'A straight line that just touches the curve at one point', 'A line drawn straight down from the curve to the x-axis'], 2, 'Think about how you lay the ruler on the graph.', ['A tangent is a straight line.', 'It just touches the curve at the point you choose, with the same gap on both sides.'], 'recall'),
    a.choice('W8-H04', 'A graph of a sunflower’s height against time is curved. A tangent at day 20 passes through (10 days, 15 cm) and (30 days, 75 cm). What is the growth rate at day 20?', ['3 cm/day', '0.33 cm/day', '2.5 cm/day', '60 cm/day'], 0, 'Find the change in y and the change in x. Divide, then add the unit.', ['Change in y = 75 − 15 = 60 cm. Change in x = 30 − 10 = 20 days.', 'Gradient = 60 ÷ 20 = 3. So the growth rate at day 20 is 3 cm/day.'], 'calculation', true),
  ])

export const higherWS: HigherAddition[] = [curveGradient]
