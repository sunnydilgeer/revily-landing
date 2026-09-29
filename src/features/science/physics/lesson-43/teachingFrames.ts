import type { TeachingFrame } from '../../teachingFrame'

// Distance vs displacement, speed vs velocity, s = vt (substitution) and one rearrangement v = s / t, and typical speeds.
// Scalar and vector are named in one clause each; the full scalar/vector lesson is earlier in the chapter.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const velocityFrames: Record<string, TeachingFrame[]> = {
  'P43-02': [
    f('Distance', 'Distance is how far an object has moved along its path. It has size but no direction.', 'how far in total', 'Distance is how far an object has moved. It does not matter which way it went. A quantity with size only is called a scalar, so distance is a scalar.', 'velocity-distance'),
    f('Displacement', 'Displacement is the straight-line distance from the start to the finish, in a given direction.', 'start to finish in a straight line', 'Displacement measures how far the finish is from the start, in a straight line, and in which direction. A quantity with size and direction is called a vector, so displacement is a vector. An example is 5 m east.', 'velocity-displacement'),
    f('There and back', 'Walk 6 m east then 6 m back west. The distance is 12 m but the displacement is 0 m.', 'back at the start', 'You walk 6 m east and then 6 m back west. The distance you travelled is 6 + 6 = 12 m. But you finish where you started. So your displacement is 0 m.', 'velocity-return'),
    f('Direction matters', 'Walk 8 m east then 3 m west. The distance is 11 m and the displacement is 5 m east.', 'add for distance, take away for displacement', 'You walk 8 m east and then 3 m west. The distance is 8 + 3 = 11 m. The displacement is 8 − 3 = 5 m, and the direction is east, because you finish 5 m east of the start.', 'velocity-twoparts'),
  ],
  'P43-05': [
    f('Speed', 'Speed is how fast something is moving, for example 20 m/s. It has no direction.', 'how fast', 'Speed tells you how fast an object is moving, for example 20 m/s. It does not say which way. Speed is a scalar.', 'velocity-speed'),
    f('Velocity', 'Velocity is speed in a given direction, for example 20 m/s to the right. It is a vector.', 'speed with a direction', 'Velocity is speed in a given direction, for example 20 m/s to the right. Two cars can have the same speed but different velocities if they go in different directions. Velocity is a vector.', 'velocity-velocity'),
    f('Average speed', 'Objects rarely move at a steady speed. The speed for a whole journey is the average speed.', 'speeds vary', 'When you walk, run or ride in a car, your speed goes up and down. So we usually use the average speed for the whole journey. The average speed is also called the mean speed.', 'velocity-average'),
  ],
  'P43-07': [
    f('The equation', 'distance travelled = speed × time, or s = v × t. s in metres (m), v in metres per second (m/s), t in seconds (s).', 's is distance, v is speed', 'In words: distance travelled = speed × time. In symbols: s = v × t. Here s means the distance, not the speed, and v means the speed. Distance is in metres, speed is in metres per second, and time is in seconds.', 'velocity-eq'),
    f('Write it down', 'A cyclist rides at 6 m/s for 20 s. How far does she go? Start with s = v × t.', 'equation first', 'A cyclist rides at a steady 6 m/s for 20 s. How far does she travel? Start by writing the equation: s = v × t.', 'velocity-w1'),
    f('Put the numbers in', 's = 6 × 20', 'speed times time', 'Substitute the values. The speed is 6 m/s and the time is 20 s. So s = 6 × 20.', 'velocity-w2'),
    f('The answer', '6 × 20 = 120, so s = 120 m.', 'finish with metres', 'Work it out: 6 × 20 = 120. The cyclist travels 120 metres. The unit is m because speed was in m/s and time was in s.', 'velocity-w3'),
  ],
  'P43-09': [
    f('Get v on its own', 's = v × t. Divide both sides by t to get v = s ÷ t.', 'divide distance by time', 'Sometimes you know the distance and the time and want the speed. Start with s = v × t. Divide both sides by t. This gives v = s ÷ t.', 'velocity-r1'),
    f('Put the numbers in', 'A car travels 300 m in 12 s. v = 300 ÷ 12.', 'distance over time', 'A car travels 300 m in 12 s. What is its average speed? Use v = s ÷ t. Substitute the numbers: v = 300 ÷ 12.', 'velocity-r2'),
    f('The answer', '300 ÷ 12 = 25, so the average speed is 25 m/s.', 'metres over seconds gives m/s', 'Work it out: 300 ÷ 12 = 25. The average speed is 25 m/s. Metres divided by seconds gives metres per second.', 'velocity-r3'),
  ],
  'P43-11': [
    f('Typical speeds', 'Walking 1.5 m/s, running 3 m/s, cycling 6 m/s, car 25 m/s, train 30 m/s, plane 250 m/s.', 'learn these six', 'Some speeds are worth remembering so you can estimate. A person walks at about 1.5 m/s and runs at about 3 m/s. A bike goes about 6 m/s, a car 25 m/s, a train 30 m/s and a plane 250 m/s.', 'velocity-table'),
    f('What changes speed', 'How fast a person can go depends on fitness, age, distance travelled and the type of ground.', 'many things affect it', 'These are only typical values. How fast a person can walk, run or cycle depends on their fitness and age. It also depends on the distance they travel and the terrain, which is the type of ground.', 'velocity-affect'),
    f('Sound and wind', 'The speed of sound in air is about 330 m/s. The speed of the wind varies.', 'sound is fast', 'Sound travels through air at about 330 m/s. That is faster than a car or a train. The speed of the wind also varies from day to day.', 'velocity-sound'),
  ],
}
