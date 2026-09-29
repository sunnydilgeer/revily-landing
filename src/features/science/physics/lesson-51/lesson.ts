import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { brakingFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.5.4.3.3 Factors affecting braking distance and 6.5.4.3.4 Energy transfers when braking (dangers of large decelerations), as on the supplied revision page' }
const skill = 'P-BRAKING'
const factors = author(skill, ['6.5.4.3.3'], ['aqa-physics'])
const energy = author(skill, ['6.5.4.3.4'], ['aqa-physics'])
const speed = author(skill, ['6.5.4.3.3', '6.5.4.3.4'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const brakingSections = [
  { id: 'P51-01', label: 'Start here', detail: 'Braking in the rain' },
  { id: 'P51-02', label: 'What changes braking distance?', detail: 'Speed, weather, tyres and brakes' },
  { id: 'P51-05', label: 'What do the brakes do to energy?', detail: 'Friction and hot brakes' },
  { id: 'P51-08', label: 'Why does speed matter so much?', detail: 'More energy, more force, more danger' },
  { id: 'P51-11', label: 'On your own', detail: 'Read, apply and explain' },
]

const states: ScienceState[] = [
  { ...factors.choice('P51-01', 'It is raining and a driver has to brake hard. Compared with a dry road, what happens to the braking distance?', ['It gets shorter', 'It stays the same', 'It gets longer', 'It gets shorter and then longer'], 2, 'Think about how well the tyres grip a wet road.', ['Water on the road reduces grip.', 'With less grip it takes longer to stop, so the braking distance is longer.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(factors, 'P51-02', 'What changes braking distance?'),
  factors.choice('P51-03', 'Which car is most likely to skid on a wet road?', ['A car with bald tyres', 'A car with new tyres', 'A car with a full tank of fuel', 'A car with a clean windscreen'], 0, 'Think about what the tread does.', ['Tread pushes water out from under the tyre.', 'Bald tyres have no tread, so they skid on top of the water.']),
  factors.choice('P51-04', 'Why do worn brakes make the braking distance longer?', ['They make the driver react more slowly', 'They cannot apply as much force, so the car takes longer to stop', 'They make the road less grippy', 'They make the car heavier'], 1, 'Think about how hard the brakes can push.', ['Worn brakes cannot apply as much force.', 'So it takes longer to stop a car travelling at a given speed.']),
  t(energy, 'P51-05', 'What do the brakes do to energy?'),
  energy.choice('P51-06', 'When a car brakes, energy is transferred away from the car\'s kinetic energy store. Where does it go?', ['To the gravitational potential energy store of the car', 'To the elastic energy store of the tyres', 'To the chemical energy store of the road', 'To the thermal energy stores of the brakes'], 3, 'Think about what happens to the brakes.', ['The brakes get hotter.', 'Energy is transferred to the thermal energy stores of the brakes.']),
  energy.choice('P51-07', 'What causes the brakes to heat up when a car stops?', ['Air moving past the car', 'The engine speeding up', 'Friction between the brake pads and the wheels, which does work', 'Electricity in the brake pedal'], 2, 'Think about the pads pressing on the wheels.', ['The pads are pressed onto the wheels and friction acts.', 'Friction does work, which transfers energy to the thermal stores of the brakes.']),
  t(speed, 'P51-08', 'Why does speed matter so much?'),
  speed.choice('P51-09', 'Two cars have the same mass and the same braking force. One is going faster. Which needs the longer distance to stop?', ['The slower car', 'The faster car', 'They need the same distance', 'It depends on the colour of the car'], 1, 'Which car has more energy to get rid of?', ['The faster car has much more kinetic energy.', 'With the same braking force, more work is needed, so a longer distance is needed.']),
  speed.choice('P51-10', 'Why can a very large deceleration be dangerous?', ['The car uses more fuel', 'The tyres get lighter', 'The driver reacts more slowly', 'The brakes may overheat and stop working, or the car may skid'], 3, 'A lot of energy is transferred very quickly.', ['A very large deceleration transfers a lot of energy to the brakes very quickly.', 'The brakes may overheat, and the car may also skid.']),
  { ...factors.choice('P51-11', 'The bar chart shows braking distances at the same speed on three road surfaces. What does it show?', ['Braking distance is smallest on the icy road', 'The road surface has no effect', 'Braking distance is greatest on the icy road', 'Braking distance is the same on the wet and icy roads'], 2, 'Compare the heights of the three bars.', ['The icy road has the tallest bar, 100 m.', 'So the braking distance is greatest on the icy road.'], 'dataInterpretation', true, 'braking-q-road') },
  { ...factors.choice('P51-12', 'A car has bald tyres and worn brakes. Which is the best advice for its driver?', ['Drive close behind other cars so you can see ahead', 'Brake later than normal', 'Drive faster so the tyres warm up', 'Leave a bigger gap and get the tyres and brakes fixed'], 3, 'Both faults make the car take longer to stop.', ['Bald tyres and worn brakes both increase the braking distance.', 'So leave more room and get them repaired.'], 'application', true) },
  { ...energy.choice('P51-13', 'A car brakes to a stop. What happens to the energy that was in its kinetic energy store?', ['It is destroyed', 'It is mostly transferred to the thermal energy stores of the brakes', 'It is all transferred to the passengers', 'It is stored in the road as gravitational potential energy'], 1, 'Energy is never destroyed.', ['Energy is transferred, not lost.', 'Friction at the brakes transfers it to their thermal energy stores.'], 'understanding', true) },
  { ...factors.choice('P51-14', 'Which of these changes the braking distance of a car?', ['The reaction time of the driver', 'How tired the driver is', 'The condition of the tyres', 'Whether the driver is listening to music'], 2, 'Braking distance starts after the driver has pressed the brake.', ['The condition of the tyres changes the grip, so it changes the braking distance.', 'The other three change the thinking distance instead.'], 'recall', true) },
  factors.written('P51-15', 'Explain why a driver should leave a bigger gap between cars on an icy road. Include what happens to the braking distance.', 'Think about grip, skidding and the distance needed to stop.', 'Ice reduces the grip between the tyres and the road. The tyres are more likely to skid. Skidding makes the braking distance longer, so the car needs more room to stop. A bigger gap means the driver has enough space to stop safely.', ['Ice reduces the grip between the tyres and the road.', 'The car is more likely to skid.', 'The braking distance is longer.', 'So a bigger gap is needed to stop safely.'], ['Saying ice makes the driver react more slowly.', 'Saying the brakes overheat on ice.', 'Saying the braking distance is shorter on ice.']),
]

export const lessonP51: ScienceLesson = {
  id: 'P-MOT-051-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Braking distance', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
