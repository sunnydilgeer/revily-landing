/*
 * Higher-only sections for three Physics graph lessons, from the CGP AQA Combined Science Higher guide pages 205 and 217
 * (scope only; all wording, graphs, numbers and questions are original). AQA 8464 HT content: 6.4.2.3 (net decline as a
 * ratio after a number of half-lives), 6.5.4.1.4 (speed at one moment from the gradient of a tangent to a curved
 * distance-time graph) and 6.5.4.1.5 (distance travelled from the area under a velocity-time graph, by shapes or by
 * counting squares). Diagrams: components/HigherMotionGraphVisuals.tsx ('hgraph-'), drawn to match the Foundation
 * half-life chain, distance-time graphs and velocity-time graphs so students meet familiar pictures.
 */
import { addition, f, type HigherAddition } from './helpers'

// Physics Lesson 36 · Higher p205: net decline, final count-rate : initial count-rate after n half-lives. Before "On your own".
const netDecline = addition('P-ATM-036-P', 'P36-14', 'P-HIGHER-NETDECLINE', ['6.4.2.3'],
  { id: 'P36-H01', higher: true, label: 'How much has it fallen?', detail: 'Net decline as a ratio' },
  [
    f('End compared with start', 'Net decline compares the final count-rate with the initial count-rate, as a ratio.', 'final first, initial second', 'A source starts with a count-rate of 80 counts per second. As it decays, the count-rate falls. To show how far it has fallen overall, compare the final count-rate with the initial one. This is called the net decline. Write it as a ratio, final : initial.', 'hgraph-ratio-1'),
    f('After one half-life', 'After one half-life, final : initial = 40 : 80 = 1 : 2.', 'halve once → 1 : 2', 'After one half-life the count-rate has halved to 40. So final : initial = 40 : 80. Divide both sides by 40 to make it simpler. The ratio is 1 : 2.', 'hgraph-ratio-2'),
    f('After two half-lives', 'After two half-lives, final : initial = 20 : 80 = 1 : 4.', 'halve twice → 1 : 4', 'After a second half-life the count-rate has halved again, to 20. So final : initial = 20 : 80. Divide both sides by 20. The ratio is 1 : 4.', 'hgraph-ratio-3'),
    f('After three half-lives', 'After three half-lives, final : initial = 10 : 80 = 1 : 8.', 'halve three times → 1 : 8', 'After a third half-life the count-rate is 10. So final : initial = 10 : 80. Divide both sides by 10. The ratio is 1 : 8.', 'hgraph-ratio-4'),
    f('Put it together', 'Each half-life doubles the second number: 1 : 2, then 1 : 4, then 1 : 8.', 'one more half-life → double it', 'The pattern is the same for any source. After one half-life the ratio is 1 : 2. Each extra half-life doubles the second number, so you get 1 : 4, then 1 : 8, then 1 : 16. It does not matter what the count-rate was at the start.', 'hgraph-ratio-5'),
  ],
  a => [
    a.worked('P36-H02', 'Find the net decline as a ratio', 'A source has an initial count-rate of 120 counts per second. Find the ratio of its final count-rate to its initial count-rate after three half-lives.', ['Halve three times: 120 → 60 → 30 → 15 counts per second.', 'Final : initial = 15 : 120.', 'Divide both sides by 15.', 'The ratio is 1 : 8.'], 'hgraph-ratio-worked'),
    a.choice('P36-H03', 'Activity 200 Bq, half-life 6 hours. What is final : initial activity after 12 hours?', ['1 : 2', '4 : 1', '1 : 4', '1 : 12'], 2, 'How many half-lives are in 12 hours?', ['12 hours is two half-lives, so 200 → 100 → 50 Bq.', 'Final : initial = 50 : 200. Divide both sides by 50 to get 1 : 4.'], 'calculation'),
    a.choice('P36-H04', 'Count-rate 64 counts per second, half-life 10 minutes. What is final count-rate : initial count-rate after 40 minutes?', ['1 : 4', '1 : 16', '1 : 8', '1 : 40'], 1, 'Count the half-lives first, then halve that many times.', ['40 minutes is four half-lives: 64 → 32 → 16 → 8 → 4.', 'Final : initial = 4 : 64. Divide both sides by 4 to get 1 : 16.'], 'calculation', true),
  ])

// Physics Lesson 45 · Higher p217 (top): speed at one moment on a curved distance-time graph. Before "On your own".
const tangent = addition('P-MOT-045-P', 'P45-12', 'P-HIGHER-DT-TANGENT', ['6.5.4.1.4'],
  { id: 'P45-H01', higher: true, label: 'Speed at one moment', detail: 'Tangents on a curved graph' },
  [
    f('One moment in time', 'On a curved distance-time graph the speed keeps changing. To find it at one moment, you need the steepness there.', 'one time → how steep just there?', 'This curve gets steeper and steeper, so the object is speeding up. Its speed is different at every moment. To find how fast it is going at exactly 4 s, you need to know how steep the curve is at that moment.', 'hgraph-tan-1'),
    f('Mark the point', 'Go up from the time you want to the curve, and mark that point.', 'up from 4 s → dot on the curve', 'Start at 4 s on the time axis. Go straight up to the curve and mark the point. Here it is at 4 s, 4 m. This is where you want to know the speed.', 'hgraph-tan-2'),
    f('Draw a tangent', 'A tangent is a straight line that just touches the curve at one point.', 'ruler touches → same gap both sides', 'Lay a ruler on the graph so it just touches the curve at your point. Turn it until the gap between the ruler and the curve looks the same on both sides. Draw a long straight line along it. This line is called a tangent.', 'hgraph-tan-3'),
    f('Find the gradient', 'Speed = gradient of the tangent = change in distance ÷ change in time.', 'big triangle → up ÷ across', 'Draw a large triangle on the tangent, just as you did for a straight line. Here it goes from 2 s, 0 m to 10 s, 16 m. Change in distance = 16 − 0 = 16 m. Change in time = 10 − 2 = 8 s. Gradient = 16 ÷ 8 = 2.', 'hgraph-tan-4'),
    f('Put it together', 'The speed at a moment is the gradient of the tangent at that moment.', 'point → tangent → triangle → divide → unit', 'So the speed at 4 s is 2 m/s. The steps are always the same. Mark the point, draw the tangent, draw a large triangle, then divide the change in distance by the change in time.', 'hgraph-tan-5'),
  ],
  a => [
    a.worked('P45-H02', 'Find the speed at one moment from a tangent', 'A tangent has been drawn at 4 s on this curved distance-time graph. It passes through 0 s, 4 m and 8 s, 28 m. Find the speed at 4 s.', ['Change in distance = 28 − 4 = 24 m.', 'Change in time = 8 − 0 = 8 s.', 'Gradient = 24 ÷ 8 = 3.', 'So the speed at 4 s is 3 m/s.'], 'hgraph-tan-worked'),
    a.choice('P45-H03', 'A tangent has been drawn at 8 s. Use the two dots on it. What is the speed at 8 s?', ['2 m/s', '3 m/s', '4 m/s', '2.4 m/s'], 2, 'Read both dots. Then find the change in distance and the change in time.', ['The dots are at 4 s, 0 m and 10 s, 24 m.', 'Change in distance = 24 m. Change in time = 10 − 4 = 6 s. So 24 ÷ 6 = 4 m/s.'], 'calculation', false, 'hgraph-tan-q'),
    a.choice('P45-H04', 'A distance-time tangent at 20 s passes 10 s, 30 m and 30 s, 130 m. Find the speed at 20 s.', ['6.5 m/s', '5 m/s', '4.3 m/s', '100 m/s'], 1, 'Use the two points on the tangent, not the point on the curve.', ['Change in distance = 130 − 30 = 100 m. Change in time = 30 − 10 = 20 s.', 'Speed = gradient of the tangent = 100 ÷ 20 = 5 m/s.'], 'calculation', true),
  ])

// Physics Lesson 46 · Higher p217 (bottom): distance from the area under a velocity-time graph. Before "On your own".
const area = addition('P-MOT-046-P', 'P46-12', 'P-HIGHER-VT-AREA', ['6.5.4.1.5'],
  { id: 'P46-H01', higher: true, label: 'How far did it go?', detail: 'Area under a velocity-time graph' },
  [
    f('Area means distance', 'The area under a velocity-time graph is the distance travelled.', 'area under the line = distance', 'This car speeds up from 0 to 10 m/s in 4 s. Then it goes at a steady 10 m/s until 10 s. The space between the line and the time axis is the area under the graph. This area is equal to the distance the car travels.', 'hgraph-area-1'),
    f('Split it into shapes', 'Split the area into shapes you know, like triangles and rectangles.', 'one triangle + one rectangle', 'The area is an odd shape, so split it up. Draw a line straight down at 4 s, where the graph changes. Now you have a triangle from 0 to 4 s and a rectangle from 4 to 10 s.', 'hgraph-area-2'),
    f('The triangle', 'Area of a triangle = ½ × base × height = ½ × 4 × 10 = 20 m.', 'half × base × height', 'The base of the triangle is 4 s and its height is 10 m/s. Area of a triangle = ½ × base × height. So the area = ½ × 4 × 10 = 20. The car travels 20 m in the first 4 s.', 'hgraph-area-3'),
    f('The rectangle', 'Area of a rectangle = width × height = 6 × 10 = 60 m. Add the areas: 80 m.', 'width × height, then add', 'The rectangle is 10 − 4 = 6 s wide and 10 m/s high. Its area = 6 × 10 = 60, so the car travels 60 m. Add the two areas. The total distance is 20 + 60 = 80 m.', 'hgraph-area-4'),
    f('Put it together', 'You can also count the squares under the line, then multiply by the value of one square.', 'count squares × one square', 'If the line is curved, count the squares under it instead. Find the value of one square first. Here one square is 1 s wide and 2 m/s high, so it is worth 1 × 2 = 2 m. There are 40 squares under the line. 40 × 2 = 80 m, the same answer.', 'hgraph-area-5'),
  ],
  a => [
    a.worked('P46-H02', 'Find the distance from a velocity-time graph', 'A cyclist speeds up from 0 to 6 m/s in 3 s, then rides at 6 m/s until 8 s. How far does she travel in the 8 s?', ['Split the area into a triangle (0 to 3 s) and a rectangle (3 to 8 s).', 'Triangle = ½ × 3 × 6 = 9 m.', 'Rectangle = (8 − 3) × 6 = 5 × 6 = 30 m.', 'Distance = 9 + 30 = 39 m.'], 'hgraph-area-worked'),
    a.choice('P46-H03', 'The graph shows a scooter. How far does it travel from 0 s to 9 s?', ['28 m', '36 m', '20 m', '18 m'], 0, 'Split the area into a rectangle and a triangle.', ['Rectangle from 0 to 5 s: 5 × 4 = 20 m.', 'Triangle from 5 to 9 s: ½ × 4 × 4 = 8 m. Total = 20 + 8 = 28 m.'], 'calculation', false, 'hgraph-area-q-scooter'),
    a.choice('P46-H04', 'Each square is 2 s by 1 m/s. About 28 squares lie under the curve. About how far does the object travel?', ['28 m', '14 m', '80 m', '56 m'], 3, 'Work out what one square is worth first.', ['One square = 2 s × 1 m/s = 2 m.', 'Distance = 28 × 2 = 56 m.'], 'calculation', false, 'hgraph-area-q-squares'),
    a.choice('P46-H05', 'A train accelerates evenly from rest to 20 m/s in 10 s, then travels at 20 m/s for 30 s. Distance travelled?', ['800 m', '600 m', '700 m', '400 m'], 2, 'Sketch the graph, then split the area into a triangle and a rectangle.', ['Triangle: ½ × 10 × 20 = 100 m. Rectangle: 30 × 20 = 600 m.', 'Distance = 100 + 600 = 700 m.'], 'calculation', true),
  ])

export const higherPGraphs: HigherAddition[] = [netDecline, tangent, area]
