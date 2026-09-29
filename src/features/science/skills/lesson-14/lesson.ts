import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { wsLengthFrames as frames } from './teachingFrames'

const source = { id: 'aqa-working-scientifically', title: 'AQA 8464 Working scientifically and practical skills', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification', locator: 'AT 1 (measuring volume of solids, length, angles, temperature and time), as on the supplied revision page' }
const skill = 'W-PRC-014-W'
const a = author(skill, ['AT 1'], ['aqa-working-scientifically'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const wsLengthSections = [
  { id: 'W14-01', label: 'Start here', detail: 'A stone with an odd shape' },
  { id: 'W14-02', label: 'How do you find the volume of a solid?', detail: 'The eureka can' },
  { id: 'W14-05', label: 'How do you measure length?', detail: 'Rulers, eye level and ten at a time' },
  { id: 'W14-09', label: 'Angles, temperature and time', detail: 'Protractor, thermometer and stopwatch' },
  { id: 'W14-12', label: 'On your own', detail: 'Choosing and using instruments' },
]

const states: ScienceState[] = [
  { ...a.choice('W14-01', 'You want the volume of a small stone with an odd shape. Which approach works best?', ['Measure its sides with a ruler', 'Use a eureka can and see how much water it pushes out', 'Weigh it on a balance', 'Time how long it takes to fall'], 1, 'The stone is irregular, so its sides are hard to measure.', ['A eureka can measures the water an object pushes out.', 'The volume of that water equals the volume of the object.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('W14-02', 'How do you find the volume of a solid?'),
  a.choice('W14-03', 'Why should the water start just at the level of the spout before you add the object?', ['So only water pushed out by the object leaves the spout', 'So the object will float', 'So the water is warmer', 'So the can weighs more'], 0, 'Think about which water you want to collect.', ['If the water starts at the spout, any water that comes out is because of the object.', 'Water that was already above the spout would spoil the reading.'], 'understanding'),
  a.choice('W14-04', 'The object is in the eureka can and the spout has stopped dripping. What do you read to find its volume?', ['The water left in the can', 'The mass of the object', 'The height of the can', 'The volume of water in the measuring cylinder'], 3, 'It is the water that has been pushed out.', ['The water in the measuring cylinder is the water the object pushed out.', 'Its volume is equal to the volume of the object.'], 'practicalReasoning'),
  t('W14-05', 'How do you measure length?'),
  a.worked('W14-06', 'Find the length of one seed', 'Ten identical seeds are laid end to end in a straight line. The line is 12 cm long. What is the length of one seed?', ['Measure the ten seeds together with a ruler: 12 cm.', 'Divide by the number of seeds: 12 ÷ 10 = 1.2.', 'One seed is 1.2 cm long.', 'This is easier and more accurate than measuring one small seed.'], 'wslength-worked-ten'),
  a.choice('W14-07', 'Which is the best instrument to measure the width of a very thin wire?', ['A centimetre ruler', 'A metre rule', 'A micrometer', 'A protractor'], 2, 'The wire is tiny.', ['A micrometer measures tiny things, such as the width of a wire.', 'A ruler is not precise enough for something so thin.'], 'application'),
  a.choice('W14-08', 'Ten identical beads in a row measure 8.0 cm. What is the length of one bead?', ['0.80 cm', '80 cm', '8.0 cm', '1.8 cm'], 0, 'Divide the total length by ten.', ['8.0 ÷ 10 = 0.80 cm.', 'Dividing by 10 moves the decimal point one place to the left.'], 'calculation'),
  t('W14-09', 'Angles, temperature and time'),
  a.choice('W14-10', 'Where should you place the middle of a protractor to measure an angle?', ['On the far end of one line', 'On the edge of the paper', 'Anywhere along a line', 'On the corner where the two lines meet'], 3, 'The middle of the protractor goes where the lines start.', ['Put the middle of the protractor on the corner of the angle.', 'Line up its base line with one line, then read the scale.'], 'understanding'),
  a.choice('W14-11', 'A student measures the temperature of hot water. Which is the correct method?', ['Hold the bulb above the surface of the water', 'Put the bulb completely under the surface, wait for the reading to stop changing, then read at eye level', 'Read as soon as the thermometer touches the water', 'Read the scale from above the beaker'], 1, 'The bulb senses the temperature, and the reading needs to be steady.', ['The bulb must be under the surface of the liquid.', 'Wait until the temperature stops changing, then read at eye level.'], 'practicalReasoning'),
  a.choice('W14-12', 'Look at the numbered parts of the protractor. Which part sits on the corner of the angle?', ['Part 1', 'Part 2', 'Part 3', 'Part 4'], 2, 'It is the middle of the protractor’s straight edge.', ['The middle mark of the straight edge goes on the corner of the angle.', 'The base line then lines up with one line of the angle.'], 'application', true, 'wslength-q-protractor'),
  a.choice('W14-13', 'Ten identical ripples on a water tank cover 24 cm. What is the length of one ripple?', ['2.4 cm', '24 cm', '0.24 cm', '14 cm'], 0, 'Measure ten together, then divide by ten.', ['24 ÷ 10 = 2.4 cm.', 'Dividing by ten gives the length of one.'], 'calculation', true),
  a.choice('W14-14', 'A student times how long marble chips take to fizz away in acid. When should the stopwatch start?', ['Before the chips are added', 'When the fizzing looks strong', 'At the exact moment the chips are added', 'Once a minute has passed'], 2, 'The timing should begin exactly when the reaction begins.', ['Start the stopwatch at the exact moment the reactants are mixed.', 'Starting late or early makes every time wrong.'], 'practicalReasoning', true),
  a.written('W14-15', 'Describe how to find the volume of a small irregular rock using a eureka can and a measuring cylinder.', 'Think about the starting level, catching the water and when to read.', 'I would fill the eureka can with water above the spout and let it drain until the water is just at the spout. I would put a measuring cylinder under the spout. I would lower the rock gently into the can. I would wait until the spout stopped dripping, then read the volume of water in the cylinder. This is the volume of the rock.', ['Fill above the spout and let the water drain to the spout.', 'Place a measuring cylinder under the spout.', 'Lower the rock in and wait until dripping stops.', 'Read the water volume in the cylinder as the volume of the rock.'], ['Reading the water left in the can.', 'Reading before the dripping has stopped.', 'Forgetting to let the water settle at the spout first.']),
]

export const lessonW14: ScienceLesson = {
  id: skill, contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'skills',
  title: 'Measuring volume, length, angles, temperature and time', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
