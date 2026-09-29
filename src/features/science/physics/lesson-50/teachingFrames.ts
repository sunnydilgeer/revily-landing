import type { TeachingFrame } from '../../teachingFrame'

// Stopping distance = thinking distance + braking distance (one worked addition), typical stopping distances, and the factors that change thinking distance.
// Braking distance factors, ½mv² = Fd and reaction-time measurement belong to the next two lessons.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const stoppingFrames: Record<string, TeachingFrame[]> = {
  'P50-02': [
    f('An emergency stop', 'In an emergency stop the brakes apply their maximum force to stop in the shortest possible distance.', 'brake as hard as possible', 'A driver sees a hazard and makes an emergency stop. The brakes apply their maximum force. This is so the vehicle stops in the shortest possible distance.', 'stopdist-emergency'),
    f('Stopping distance', 'The total distance a vehicle travels before it stops is its stopping distance.', 'from seeing the hazard to stopped', 'The total distance a vehicle travels while it stops is called its stopping distance. It is measured from the point where the driver sees the hazard.', 'stopdist-total'),
    f('Two parts', 'stopping distance = thinking distance + braking distance', 'add two distances', 'The stopping distance is made of two parts. You find it with a word equation: stopping distance = thinking distance + braking distance.', 'stopdist-equation'),
    f('Thinking distance', 'How far the car travels during the driver\'s reaction time.', 'before the brakes are used', 'Thinking distance is how far the car travels during the driver\'s reaction time. The reaction time is the time between seeing the hazard and pressing the brakes. The car is still moving at full speed.', 'stopdist-thinking'),
    f('Braking distance', 'How far the car travels while the brakes are slowing it down.', 'after the brakes are used', 'Braking distance is how far the car travels once the brakes are applied. The braking force slows the car down until it stops.', 'stopdist-braking'),
    f('Worked example', 'Thinking distance 9 m + braking distance 15 m = stopping distance 24 m.', 'add, then add the unit', 'A car has a thinking distance of 9 m and a braking distance of 15 m. Use the equation: stopping distance = thinking distance + braking distance. So the stopping distance = 9 + 15 = 24 m.', 'stopdist-w'),
  ],
  'P50-05': [
    f('Speed and mass', 'The heavier a vehicle or the faster it is going, the longer its stopping distance.', 'heavier and faster', 'The heavier a vehicle is, the longer its stopping distance will be. The faster it is travelling, the longer its stopping distance will be too.', 'stopdist-factors'),
    f('Typical distances', 'A typical car needs about 23 m at 30 mph, 73 m at 60 mph and 96 m at 70 mph.', 'mph means miles per hour', 'Here are typical stopping distances for a car. At 30 mph it is about 23 m. At 60 mph it is about 73 m. At 70 mph it is about 96 m. The letters mph mean miles per hour.', 'stopdist-typical'),
    f('Longer means riskier', 'The longer the stopping distance, the higher the risk of crashing into what is in front.', 'stopping distance and risk', 'The longer it takes a vehicle to stop, the higher the risk of crashing into whatever is in front. So the shorter a vehicle\'s stopping distance is, the safer it is.', 'stopdist-risk'),
    f('Speed limits', 'Roads with a higher risk of hazards have lower speed limits to shorten stopping distances.', 'lower speed, shorter distance', 'Roads where hazards are more likely, such as near schools, have lower speed limits. A lower speed gives a shorter stopping distance. Driving above the speed limit is unsafe.', 'stopdist-limit'),
  ],
  'P50-08': [
    f('Two things matter', 'Thinking distance depends on the speed of the car and on the driver\'s reactions.', 'speed and reactions', 'Thinking distance depends on two things. One is the speed of the car. The other is the driver\'s reaction time, which is how quickly they respond.', 'stopdist-think-two'),
    f('Speed', 'The faster you go, the further you travel in the time it takes you to react.', 'same time, more distance', 'The reaction time might be the same, but a faster car covers more distance in that time. So the faster you go, the greater your thinking distance.', 'stopdist-think-speed'),
    f('Tiredness, drugs and alcohol', 'Being tired, or having taken drugs or alcohol, makes you slower to react.', 'slower reactions', 'Driving while tired is unsafe, and so is driving after taking drugs or alcohol. They make you slower to react. So your reaction time increases, and so does your thinking distance.', 'stopdist-think-tired'),
    f('Distractions', 'Distractions such as using a phone make you slower to spot a hazard.', 'attention', 'Distractions also make your reaction time longer, or make it harder for you to react at all. A driver on a phone takes longer to spot a hazard. This can be very dangerous.', 'stopdist-think-phone'),
    f('A longer stopping distance', 'A longer thinking distance means a longer stopping distance, so a crash is more likely.', 'add it up', 'A longer thinking distance makes the stopping distance longer. The car travels further before it even starts to slow down. So the driver is more likely to crash.', 'stopdist-think-crash'),
  ],
}
