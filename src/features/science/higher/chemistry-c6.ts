/*
 * Higher-only section for chapter C6 (rate and extent of chemical change), from the CGP AQA Combined Science Higher guide
 * page 147 (scope only; all wording, graphs, numbers and questions are original). AQA 8464 HT content: 5.6.1.1 (rate at a
 * particular time from the gradient of a tangent; rate in mol/s). Diagrams: components/HigherRateTangentVisuals.tsx ('hrate-').
 * The teaching frames reuse Lesson 35's graph A (tangent at 20 s → 0.65 cm³/s), so students meet a familiar curve.
 */
import { addition, f, type HigherAddition } from './helpers'

// Chemistry Lesson 35 · Higher p147: drawing a tangent and finding its gradient. Before "On your own".
const tangent = addition('C-RAT-035-C', 'C35-13', 'C-HIGHER-RATE-TANGENT', ['5.6.1.1'],
  { id: 'C35-H01', higher: true, label: 'The rate at one moment', detail: 'Tangents and gradients' },
  [
    f('One moment in time', 'A mean rate is an average. To find the rate at one moment, you need the steepness there.', 'one time → how steep just there?', 'A mean rate is an average over a stretch of time. But the reaction does not go at one speed. It is fast at the start and slows down. To find how fast it is going at exactly 20 seconds, you need to know how steep the curve is at that moment.', 'hrate-curve'),
    f('Mark the point', 'Find the point on the curve at the time you want.', 'up from 20 s → dot on the curve', 'Start at 20 seconds on the x-axis. Go straight up to the curve and mark that point. Here it is at 22 cm³. This is the point where you want to know the rate.', 'hrate-point'),
    f('Draw a tangent', 'A tangent is a straight line that just touches the curve at one point.', 'ruler touches → same gap both sides', 'Put a ruler on the graph so it just touches the curve at your point. Turn it until the gap between the ruler and the curve is the same on both sides of the point. Then draw a long straight line along the ruler. This line is called a tangent.', 'hrate-tangent'),
    f('Find the gradient', 'Gradient = change in y ÷ change in x.', 'two easy points → up ÷ across', 'The gradient tells you how steep a line is. Pick two points on the tangent that are easy to read and far apart. Here they are 0 s, 9 cm³ and 40 s, 35 cm³. The change in y is 35 − 9 = 26 cm³. The change in x is 40 − 0 = 40 s. Gradient = 26 ÷ 40 = 0.65 cm³/s.', 'hrate-gradient'),
    f('Put it together', 'The rate at a particular time is the gradient of the tangent at that time.', 'point → tangent → two points → divide → unit', 'So the rate at 20 seconds is 0.65 cm³/s. The unit is the y-axis unit per second. A mass gives g/s and a gas volume gives cm³/s. If the amount is in moles, the rate is in mol/s.', 'hrate-all'),
  ],
  a => [
    a.worked('C35-H02', 'Find the rate at one time from a tangent', 'The graph shows the mass of product made by a reaction. A tangent has been drawn at 20 s. Find the rate of reaction at 20 s.', ['Pick two easy points on the tangent: 0 s, 1.0 g and 40 s, 5.0 g.', 'Change in y = 5.0 − 1.0 = 4.0 g.', 'Change in x = 40 − 0 = 40 s.', 'Gradient = 4.0 ÷ 40 = 0.10. So the rate at 20 s is 0.10 g/s.'], 'hrate-worked'),
    a.choice('C35-H03', 'A student wants the rate of reaction at exactly 30 s, from a graph of gas volume against time. What should they do?', ['Draw a tangent to the curve at 30 s and work out its gradient', 'Read the volume at 30 s and divide it by 30', 'Find the mean rate between 0 s and the end of the reaction', 'Read the volume at 30 s and give that as the rate'], 0, 'A rate at one moment is how steep the curve is at that moment.', ['Dividing the volume by the time gives a mean rate, not the rate at one moment.', 'The steepness at 30 s is the gradient of the tangent drawn at 30 s.']),
    a.choice('C35-H04', 'A tangent has been drawn at 10 s. Use the two dots on it. What is the rate of reaction at 10 s?', ['1.5 cm³/s', '1.75 cm³/s', '0.67 cm³/s', '2.0 cm³/s'], 0, 'Read both dots. Then find the change in y and the change in x.', ['The dots are at 0 s, 5 cm³ and 20 s, 35 cm³.', 'Change in y = 35 − 5 = 30 cm³. Change in x = 20 − 0 = 20 s. So 30 ÷ 20 = 1.5 cm³/s.'], 'calculation', false, 'hrate-question-tangent'),
    a.choice('C35-H05', 'A reaction makes carbon dioxide, CO₂. A tangent at 30 s on a mass of CO₂ graph passes through 10 s, 1.2 g and 60 s, 5.6 g. Mᵣ of CO₂ = 44. What is the rate at 30 s in mol/s?', ['0.0020 mol/s', '0.088 mol/s', '3.9 mol/s', '0.020 mol/s'], 0, 'Find the gradient in g/s first. Then change grams into moles.', ['Gradient = (5.6 − 1.2) ÷ (60 − 10) = 4.4 ÷ 50 = 0.088 g/s.', 'Moles = mass ÷ Mᵣ, so 0.088 ÷ 44 = 0.0020. The rate at 30 s is 0.0020 mol/s.'], 'calculation', true),
  ])

export const higherC6: HigherAddition[] = [tangent]
