import type { TeachingFrame } from '../../teachingFrame'

// Newton's First Law (zero resultant force, five changes in motion), Newton's Second Law (proportional, F = ma) and one worked estimate of the force on a car.
// F = ma is used by substitution only; the acceleration estimate uses a = change in velocity / time from the acceleration lesson.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const newtonLawFrames: Record<string, TeachingFrame[]> = {
  'P47-02': [
    f('A stationary object', 'If the resultant force on a stationary object is zero, it stays stationary.', 'zero resultant force', 'Newton\'s First Law is about what happens when the resultant force is zero. If a stationary object has a resultant force of zero, it stays stationary.', 'newton12-first-still'),
    f('A moving object', 'If the resultant force on a moving object is zero, it keeps moving at the same velocity.', 'same speed, same direction', 'If a moving object has a resultant force of zero, it does not slow down or speed up. It keeps moving at the same velocity. That means the same speed in the same direction.', 'newton12-first-moving'),
    f('Balanced forces', 'A bus at a steady speed has a driving force equal to the resistive forces.', 'driving = resistive', 'A bus travels at a steady speed along a straight road. The driving force forwards is equal to the resistive forces backwards. The forces are balanced, so the resultant force is zero.', 'newton12-bus-balanced'),
    f('A resultant force changes motion', 'The velocity only changes if there is a resultant force that is not zero.', 'unbalanced forces', 'The velocity of an object only changes if there is a resultant force that is not zero. The change in motion is in the direction of the resultant force.', 'newton12-bus-resultant'),
    f('Five changes in motion', 'A resultant force can make an object start, stop, speed up, slow down or change direction.', 'five changes', 'A resultant force can change the motion of an object in five different ways. It can make the object start moving or stop moving. It can make it speed up, slow down or change direction.', 'newton12-five'),
  ],
  'P47-05': [
    f('Bigger force, bigger acceleration', 'The larger the resultant force on an object, the more it accelerates.', 'push harder', 'Push a trolley gently and it speeds up slowly. Push it harder and it speeds up faster. The larger the resultant force, the greater the acceleration.', 'newton12-force-acc'),
    f('Directly proportional', 'Double the force and the acceleration doubles. This is called directly proportional.', 'double and double', 'Suppose you double the resultant force on the same trolley. Its acceleration doubles too. When one quantity doubles as the other doubles, they are directly proportional.', 'newton12-proportional'),
    f('Bigger mass, less acceleration', 'For the same force, an object with more mass accelerates less.', 'same push, heavier object', 'Now keep the force the same. A heavier object accelerates less than a lighter one. The same push speeds up an empty trolley more than a full trolley.', 'newton12-mass-acc'),
    f('The equation', 'resultant force = mass × acceleration, F = ma. Force in N, mass in kg, acceleration in m/s².', 'F, m and a', 'Newton\'s Second Law can be written as a word equation: resultant force = mass × acceleration. In symbols, F = ma. Force is in newtons (N), mass is in kilograms (kg) and acceleration is in metres per second squared (m/s²).', 'newton12-equation'),
  ],
  'P47-08': [
    f('Estimate the acceleration', 'A typical car reaches about 20 m/s in about 10 s. Acceleration = 20 ÷ 10 = 2 m/s².', 'sensible round numbers', 'To estimate the force on a car, we use sensible round numbers. A typical car reaches about 20 m/s from rest in about 10 s. Its acceleration is change in velocity ÷ time = 20 ÷ 10 = 2 m/s².', 'newton12-w1'),
    f('Estimate the mass', 'A typical car has a mass of about 1000 kg.', 'kilograms', 'A typical car has a mass of about 1000 kg. We write this with a wavy equals sign, ≈, which means "is about".', 'newton12-w2'),
    f('Put the numbers in', 'Start with F = ma. Then F = 1000 × 2.', 'substitute', 'Start with the equation: resultant force = mass × acceleration. Put the numbers in. F = 1000 × 2.', 'newton12-w3'),
    f('Add the unit', 'F = 2000 N. The resultant force on the car is about 2000 N.', 'newtons', 'Work it out: 1000 × 2 = 2000. Mass was in kilograms and acceleration in m/s², so the force is in newtons. The resultant force on the car is about 2000 N.', 'newton12-w4'),
  ],
}
