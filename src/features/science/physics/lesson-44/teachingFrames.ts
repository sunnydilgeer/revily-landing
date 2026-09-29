import type { TeachingFrame } from '../../teachingFrame'

// Acceleration a = change in velocity / time (worked example then guided practice), deceleration as negative acceleration, estimating with typical speeds,
// and v squared minus u squared = 2as for uniform acceleration with one fully rearranged worked example (friendly numbers, square root of a perfect square).
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const accelerationFrames: Record<string, TeachingFrame[]> = {
  'P44-02': [
    f('Changing velocity', 'Acceleration is how quickly velocity changes. It is the change in velocity in a certain time.', 'how fast the speed changes', 'When a car pulls away from traffic lights, its velocity gets bigger and bigger. Acceleration is how quickly the velocity changes. It is the change in velocity in a certain amount of time.', 'accel-idea'),
    f('The equation', 'acceleration = change in velocity ÷ time taken, or a = Δv ÷ t. a in m/s², Δv in m/s, t in s.', 'change in velocity over time', 'In words: acceleration = change in velocity ÷ time taken. In symbols: a = Δv ÷ t. The Greek letter Δ means "change in". The change in velocity is the final velocity minus the starting velocity.', 'accel-eq'),
    f('The unit m/s²', 'Acceleration is measured in metres per second squared, m/s². A car gaining 3 m/s every second has an acceleration of 3 m/s².', 'metres per second, every second', 'The unit of acceleration is metres per second squared, written m/s². It means the velocity changes by that many metres per second, every second. A car gaining 3 m/s each second has an acceleration of 3 m/s².', 'accel-units'),
    f('Slowing down', 'Deceleration means slowing down. It is just a negative acceleration.', 'slowing down is negative', 'When something slows down, its velocity gets smaller. So the change in velocity is negative. This is called deceleration, and it is just a negative acceleration.', 'accel-decel'),
  ],
  'P44-05': [
    f('Write it down', 'A bike speeds up from 3 m/s to 15 m/s in 4 s. Start with a = Δv ÷ t.', 'equation first', 'A bike speeds up from 3 m/s to 15 m/s in 4 s. What is its acceleration? Start by writing the equation: a = Δv ÷ t.', 'accel-w1'),
    f('Find the change', 'Δv = final velocity − starting velocity = 15 − 3 = 12 m/s.', 'final minus start', 'First find the change in velocity. Take the final velocity and subtract the starting velocity. Δv = 15 − 3 = 12 m/s.', 'accel-w2'),
    f('Put the numbers in', 'a = 12 ÷ 4', 'change over time', 'Now substitute the change in velocity and the time. a = 12 ÷ 4.', 'accel-w3'),
    f('The answer', '12 ÷ 4 = 3, so a = 3 m/s².', 'finish with m/s²', 'Work it out: 12 ÷ 4 = 3. The acceleration of the bike is 3 m/s². The velocity goes up by 3 m/s every second.', 'accel-w4'),
  ],
  'P44-08': [
    f('What is an estimate?', 'An estimate is a rough answer worked out with sensible numbers. The symbol ~ means "about".', 'about, not exact', 'An estimate is not an exact answer. You use sensible rough numbers for things you cannot measure. The symbol ~ in front of a number means "about".', 'accel-est1'),
    f('Use a typical speed', 'A cyclist speeds up from standing still to a typical 6 m/s in about 10 s.', 'sensible speed, sensible time', 'Suppose a woman gets on a bike and speeds up from standing still. A typical speed for a bike is about 6 m/s. Say she takes 10 s to reach it. Standing still means the change in velocity is 6 − 0 = 6 m/s.', 'accel-est2'),
    f('Work it out', 'a = 6 ÷ 10 = 0.6 m/s². So the acceleration is ~0.6 m/s².', 'about 0.6', 'Use a = Δv ÷ t. So a = 6 ÷ 10 = 0.6 m/s². We write this as ~0.6 m/s², because it is only an estimate.', 'accel-est3'),
  ],
  'P44-10': [
    f('Uniform acceleration', 'Uniform acceleration is constant acceleration. Falling objects have a uniform acceleration of about 9.8 m/s² near the Earth.', 'constant, like falling', 'Uniform acceleration means the acceleration stays the same. The velocity changes by the same amount every second. A freely falling object has a uniform acceleration due to gravity. It is about 9.8 m/s² near the Earth.', 'accel-uniform'),
    f('The equation', 'v² − u² = 2 × a × s. v is final velocity, u is starting velocity, a is acceleration and s is distance.', 'both velocities are squared', 'For uniform acceleration, use v² − u² = 2 × a × s. Here v is the final velocity and u is the starting velocity, both in m/s. The acceleration a is in m/s² and the distance s is in metres.', 'accel-suvat'),
    f('Rearrange first', 'A van at 13 m/s slows at 2 m/s² over 36 m. Add u² to both sides: v² = u² + 2as.', 'get v² on its own', 'A van travels at 13 m/s and slows down uniformly at 2 m/s² for 36 m. What is its final speed? First get v² on its own. Add u² to both sides. This gives v² = u² + 2as.', 'accel-x1'),
    f('Put the numbers in', 'Slowing down means a = −2. v² = 13² + (2 × −2 × 36) = 169 − 144 = 25.', 'a is negative for slowing', 'The van is slowing down, so a is −2 m/s². Substitute: v² = 13² + (2 × −2 × 36). That is v² = 169 − 144. So v² = 25.', 'accel-x2'),
    f('Take the square root', 'v = √25 = 5 m/s.', 'square root last', 'We have v², but we want v. Take the square root of 25. v = 5 m/s. The van is going at 5 m/s at the end.', 'accel-x3'),
  ],
}
