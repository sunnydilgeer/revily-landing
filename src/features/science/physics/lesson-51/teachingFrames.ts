import type { TeachingFrame } from '../../teachingFrame'

// Braking distance: four factors, braking as an energy transfer to the brakes, why speed matters so much (qualitative), and the danger of large decelerations.
// No calculation: the kinetic energy = work done idea is kept qualitative.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const brakingFrames: Record<string, TeachingFrame[]> = {
  'P51-02': [
    f('Braking distance', 'Braking distance is how far the car travels while the brakes are working.', 'distance once braking starts', 'Braking distance is the distance a car travels after the driver has pressed the brake. It depends on a few different things. Let us look at four of them.', 'braking-recap'),
    f('Speed', 'For the same braking force, a faster car needs a longer distance to stop.', 'faster, longer', 'Suppose the brakes push with the same force each time. The faster the car is going, the longer it takes to stop. So the braking distance goes up when the speed goes up.', 'braking-speed'),
    f('Weather and road', 'Water, ice, oil or leaves reduce the grip between the tyres and the road.', 'less grip, more skidding', 'Water, ice, oil or leaves on the road all reduce grip. Grip is the friction between the tyres and the road. With less grip the car can skid. Skidding makes the braking distance longer.', 'braking-road'),
    f('Tyres', 'Bald tyres cannot clear water, so they skid on top of it.', 'tread pushes water away', 'Bald tyres have no tread left. Tread is the pattern of grooves that pushes water out from under the tyre. Without it, water stays under the tyre and the car skids in wet weather.', 'braking-tyres'),
    f('Brakes', 'Worn brakes cannot push as hard, so the car takes longer to stop.', 'weaker brakes, longer stop', 'Brakes wear out with use. Worn brakes cannot apply as much force. So it takes longer to stop a car that is travelling at a given speed.', 'braking-brakes'),
  ],
  'P51-05': [
    f('Brakes use friction', 'Pressing the pedal squeezes brake pads onto the wheels, and friction acts.', 'pads on wheels', 'When the driver presses the brake pedal, brake pads are pressed onto the wheels. The contact causes friction. Friction does work, and when work is done, energy is transferred.', 'braking-friction'),
    f('Energy moves to the brakes', 'Energy is transferred from the car\'s kinetic energy store to the thermal energy stores of the brakes.', 'from which store, to which', 'The energy comes from the kinetic energy store of the car. It is transferred to the thermal energy stores of the brakes. Energy is not lost. It moves to a different store.', 'braking-transfer'),
    f('The brakes get hot', 'To stop the car, all of its kinetic energy must be transferred, so the brakes increase in temperature.', 'all of the energy', 'To stop the car, the brakes must transfer all of the energy in its kinetic store. So the brakes increase in temperature. That is why brakes can be very hot after a long drive down a hill.', 'braking-hot'),
  ],
  'P51-08': [
    f('Energy equals work done', 'The car\'s kinetic energy equals the work done by the brakes: ½ × m × v² = F × d.', 'energy in = work done', 'To stop, the brakes must transfer all of the kinetic energy of the car. This equals the work done by the braking force over the braking distance. In symbols, ½ × m × v² = F × d. Here F is the braking force and d is the braking distance.', 'braking-energy'),
    f('Faster means more energy', 'A faster car has much more kinetic energy, so much more work is needed to stop it.', 'speed is squared', 'The speed is squared in the kinetic energy equation. So a small increase in speed means a large increase in energy. A faster car needs much more work done to stop it.', 'braking-faster'),
    f('More force needed', 'To stop in the same distance, a faster car needs a bigger braking force.', 'work = force × distance', 'Work done is force × distance. If the distance stays the same, more work needs a bigger force. So as speed increases, the braking force needed also increases. A bigger braking force means a bigger deceleration.', 'braking-force'),
    f('Big decelerations are dangerous', 'Very large decelerations can overheat the brakes or make the car skid.', 'too much, too fast', 'A very large deceleration means the brakes transfer a lot of energy very quickly. The brakes may overheat, and then they do not work as well. A very large deceleration may also make the car skid.', 'braking-danger'),
  ],
}
