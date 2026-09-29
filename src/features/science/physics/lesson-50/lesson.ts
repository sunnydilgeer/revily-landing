import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { stoppingFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.5.4.3.1 Stopping distance and 6.5.4.3.2 Reaction time (thinking distance factors), as on the supplied revision page' }
const skill = 'P-STOPPING'
const meaning = author(skill, ['6.5.4.3.1'], ['aqa-physics'])
const typical = author(skill, ['6.5.4.3.1'], ['aqa-physics'])
const thinking = author(skill, ['6.5.4.3.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const stoppingSections = [
  { id: 'P50-01', label: 'Start here', detail: 'An emergency stop' },
  { id: 'P50-02', label: 'What is stopping distance?', detail: 'Thinking distance plus braking distance' },
  { id: 'P50-05', label: 'How far does a car take to stop?', detail: 'Typical distances and safety' },
  { id: 'P50-08', label: 'What changes thinking distance?', detail: 'Speed, tiredness, drugs, alcohol and distractions' },
  { id: 'P50-11', label: 'On your own', detail: 'Calculating, reading a table and explaining' },
]

const states: ScienceState[] = [
  { ...meaning.choice('P50-01', 'A driver sees a hazard and slams on the brakes. Which best describes the car\'s stopping distance?', ['The distance it skids after the brakes work', 'The total distance from seeing the hazard to stopping', 'The time it takes to stop', 'The distance the driver looks ahead'], 1, 'The car keeps moving before the driver even reacts.', ['The car travels some distance before the driver presses the brake.', 'The stopping distance is the total distance from seeing the hazard until the car stops.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(meaning, 'P50-02', 'What is stopping distance?'),
  meaning.choice('P50-03', 'Which distance does a car travel while the driver is reacting, before the brakes are applied?', ['Braking distance', 'Thinking distance', 'Stopping distance', 'Reaction time'], 1, 'The driver is thinking, not braking, yet.', ['The distance travelled during the driver\'s reaction time is the thinking distance.', 'Braking distance only starts once the brakes are applied.'], 'recall'),
  meaning.choice('P50-04', 'A car has a thinking distance of 12 m and a braking distance of 24 m. What is its stopping distance?', ['12 m', '24 m', '288 m', '36 m'], 3, 'Add the two parts.', ['Stopping distance = thinking distance + braking distance.', '12 + 24 = 36, so the stopping distance is 36 m.'], 'calculation'),
  t(typical, 'P50-05', 'How far does a car take to stop?'),
  typical.choice('P50-06', 'About how far does a typical car need to stop when travelling at 60 mph?', ['23 m', '96 m', '73 m', '30 m'], 2, 'Think of the three typical values: 23 m, 73 m and 96 m.', ['A typical car needs about 23 m at 30 mph and 96 m at 70 mph.', 'At 60 mph it needs about 73 m.'], 'recall'),
  typical.choice('P50-07', 'Why do roads with a higher risk of hazards often have lower speed limits?', ['To make cars use less fuel', 'To make braking distances longer', 'To make drivers more tired', 'So cars have shorter stopping distances'], 3, 'Think about speed and stopping distance.', ['A lower speed gives a shorter stopping distance.', 'A shorter stopping distance makes a crash less likely.']),
  t(thinking, 'P50-08', 'What changes thinking distance?'),
  thinking.choice('P50-09', 'Which of these would increase a driver\'s thinking distance?', ['Driving more slowly', 'Being tired', 'Having a lighter car', 'Braking harder'], 1, 'Thinking distance depends on speed and reaction time.', ['Being tired makes your reactions slower.', 'A longer reaction time means a longer thinking distance.']),
  thinking.choice('P50-10', 'Why does driving faster increase the thinking distance?', ['The driver\'s reaction time becomes much longer', 'The brakes become weaker', 'The car travels further in the time it takes to react', 'The road becomes longer'], 2, 'Same reaction time, different speed.', ['The reaction time is about the same.', 'A faster car covers more distance in that time, so the thinking distance is greater.']),
  { ...meaning.choice('P50-11', 'A car has a thinking distance of 14 m and a braking distance of 38 m. What is its stopping distance?', ['24 m', '38 m', '52 m', '532 m'], 2, 'Add the two distances.', ['Stopping distance = thinking distance + braking distance.', '14 + 38 = 52, so the stopping distance is 52 m.'], 'calculation', true) },
  thinking.choice('P50-12', 'A car\'s thinking distance is 6 m at 20 mph and 12 m at 40 mph. What does this show?', ['A higher speed gives a longer thinking distance', 'Speed does not change the thinking distance', 'A higher speed gives a shorter thinking distance', 'Thinking distance depends only on the brakes'], 0, 'Compare the two speeds and the two distances.', ['The speed goes up from 20 to 40 mph.', 'The thinking distance goes up from 6 m to 12 m, so a higher speed gives a longer thinking distance.'], 'dataInterpretation', true, 'stopdist-q-table'),
  thinking.choice('P50-13', 'A very tired driver sees a hazard. Which distance is most directly increased by tiredness?', ['Braking distance', 'The speed limit', 'Neither distance', 'Thinking distance'], 3, 'Tiredness changes how quickly you react.', ['Tiredness slows reactions.', 'A longer reaction time increases the thinking distance.'], 'application', true),
  thinking.choice('P50-14', 'A driver is texting and reacts late to a hazard. What happens to the stopping distance?', ['It gets longer, because the thinking distance is greater', 'It gets shorter', 'It stays the same', 'Only the braking distance changes'], 0, 'A late reaction means a longer reaction time.', ['A distraction makes the reaction time longer.', 'The thinking distance increases, so the stopping distance increases.'], 'application', true),
  thinking.written('P50-15', 'Explain why a tired driver is more likely to crash if a child runs into the road.', 'Follow the chain: reaction time, thinking distance, stopping distance.', 'Being tired makes the driver slower to react, so the reaction time increases. The car travels further before the brakes are applied, so the thinking distance increases. Stopping distance is thinking distance plus braking distance, so the stopping distance is longer. The car is more likely to reach the child before it stops.', ['Tiredness makes the reaction time longer.', 'The thinking distance increases.', 'Stopping distance = thinking distance + braking distance, so it is longer.', 'The car is more likely to hit the child before it stops.'], ['Saying tiredness makes the brakes weaker.', 'Saying the braking distance is the part that increases.', 'Saying the car speeds up because the driver is tired.']),
]

export const lessonP50: ScienceLesson = {
  id: 'P-MOT-050-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Stopping distance and thinking distance', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
