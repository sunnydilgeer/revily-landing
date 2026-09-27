import type { ScienceLesson, ScienceState } from '../types'
import { author, sampledRequirements } from '../lessonAuthoring'
import { reactionTimeFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.5.2.1 Structure and function of the nervous system: required practical activity, the effect of a factor (caffeine) on human reaction time' }
const a = author('B-REACTION-TIME', ['4.5.2.1'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const reactionTimeSections = [
  { id: 'B32-01', label: 'Start here', detail: 'Which neurones reach your hand?' },
  { id: 'B32-02', label: 'What is reaction time?', detail: 'Milliseconds, factors and caffeine' },
  { id: 'B32-05', label: 'The ruler drop', detail: 'Set up, drop, catch and read' },
  { id: 'B32-08', label: 'Make it fair', detail: 'Caffeine and control variables' },
  { id: 'B32-11', label: 'Find the mean', detail: 'Repeats and means' },
  { id: 'B32-14', label: 'On your own', detail: 'A mean, data and a method' },
]

const states: ScienceState[] = [
  { ...a.choice('B32-01', 'Which neurones carry impulses from the CNS to the muscles in your hand?', ['Sensory neurones', 'Motor neurones', 'Relay neurones'], 1, 'Which neurones carry impulses away from the CNS?', ['Sensory neurones carry impulses to the CNS, and relay neurones link neurones inside it.', 'Motor neurones carry impulses from the CNS to effectors, such as the muscles in your hand.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B32-02', 'What is reaction time?'),
  a.choice('B32-03', 'Why are reaction times often measured in milliseconds?', ['They are usually less than one second', 'They are usually longer than an hour', 'Rulers measure in milliseconds'], 0, 'How long does a reaction usually take?', ['Reaction times are often less than one second.', 'So a smaller unit, the millisecond, is used. There are 1000 ms in one second.']),
  a.choice('B32-04', 'Which of these reaction times is the fastest?', ['310 ms', '270 ms', '190 ms', '240 ms'], 2, 'A faster reaction takes less time.', ['The fastest reaction takes the least time.', '190 ms is the smallest time, so it is the fastest.']),
  t('B32-05', 'The ruler drop'),
  a.choice('B32-06', 'Why is the ruler dropped without any warning?', ['So the ruler falls faster', 'So the person cannot guess when it will fall', 'So the reading is always zero', 'So the person can use both hands'], 1, 'What could the person do if they knew when it was coming?', ['If the person knew when the ruler would drop, they could get ready early.', 'With no warning, they cannot guess, so the catch shows their reaction time.']),
  a.choice('B32-07', 'Sam catches the ruler at 18 cm. Priya catches it at 9 cm. What does this show?', ['Sam reacted faster', 'They reacted equally fast', 'Priya reacted faster'], 2, 'Does a higher number mean faster or slower?', ['The ruler fell further before Sam caught it.', 'A lower number means a faster reaction, so Priya reacted faster.']),
  t('B32-08', 'Make it fair'),
  a.choice('B32-09', 'Which of these is a control variable in the caffeine test?', ['Whether the person has had caffeine', 'The distance the ruler falls', 'The hand used to catch the ruler'], 2, 'A control variable is kept the same.', ['Caffeine is what is changed, and the distance the ruler falls is what is measured.', 'The hand used is kept the same, so it is a control variable.']),
  a.choice('B32-10', 'Why must the same person catch the ruler before and after the drink?', ['Different people can have different reaction times', 'The ruler only works for one person', 'It makes the ruler fall further'], 0, 'Is everyone’s reaction time the same?', ['Reaction times differ from person to person.', 'Using the same person means only the caffeine changes.']),
  t('B32-11', 'Find the mean'),
  a.worked('B32-12', 'Find a mean distance', 'Before the drink, one person caught the ruler five times. The distances were 12 cm, 15 cm, 11 cm, 14 cm and 13 cm. What is the mean distance?', ['Add up the results: 12 + 15 + 11 + 14 + 13 = 65 cm.', 'Count the results: there are 5.', 'Divide the total by the number of results: 65 ÷ 5 = 13.', 'Add the unit: the mean is 13 cm.'], 'nerve-mean-worked'),
  a.choice('B32-13', 'After the drink, the same person caught the ruler five times: 10 cm, 12 cm, 9 cm, 11 cm and 13 cm. What is the mean distance?', ['55 cm', '13 cm', '10 cm', '11 cm'], 3, 'Add them up, then divide by 5.', ['Add them up: 10 + 12 + 9 + 11 + 13 = 55 cm.', 'Divide by 5: 55 ÷ 5 = 11 cm.'], 'calculation'),
  a.choice('B32-14', 'A student did a computer reaction test four times. Their times were 260 ms, 240 ms, 250 ms and 270 ms. What is their mean reaction time?', ['1020 ms', '250 ms', '255 ms', '270 ms'], 2, 'How many results are there this time?', ['Add them up: 260 + 240 + 250 + 270 = 1020 ms.', 'There are 4 results, so 1020 ÷ 4 = 255 ms.'], 'calculation', true),
  a.choice('B32-15', 'The chart shows one person’s mean results. Which conclusion fits?', ['Caffeine speeds up everyone’s reaction time', 'In this test, their mean distance was smaller after caffeine, so they reacted faster', 'They reacted more slowly after caffeine', 'Caffeine made the ruler fall faster'], 1, 'Compare the two bars, and remember this is one person.', ['The mean fell from 13 cm to 11 cm after caffeine; one person cannot show what happens to everyone.', 'So in this test, their mean distance was smaller after caffeine, so they reacted faster.'], 'dataInterpretation', true, 'nerve-caffeine-data'),
  a.choice('B32-16', 'Halfway through the test, Jo switches from catching with her right hand to her left hand. Why is this a problem?', ['The hand is a control variable, so the test is no longer fair', 'The ruler falls more slowly', 'It means she has had more caffeine', 'The ruler cannot be read'], 0, 'What should stay the same in a fair test?', ['Jo may react at a different speed with each hand.', 'The hand is a control variable, so changing it means the test is no longer fair.'], 'application', true),
  a.written('B32-17', 'Describe how you would use a ruler drop to find out whether caffeine affects a person’s reaction time. Include how you would make it a fair test.', 'Go in order: set up, drop, read, repeat, drink, wait, repeat. Then say what stays the same.', 'The person rests their forearm on a table with their hand over the edge. Hold a ruler with the zero level with the top of their thumb, then drop it without warning. They catch it, and you read the number at the top of their thumb. Repeat several times and find the mean. Then they have a drink with caffeine, wait 10 minutes and repeat. Use the same person, the same hand and the same drop height each time.', ['The ruler is held with zero level with the top of the thumb and dropped without warning.', 'The distance is read at the top of the thumb when the ruler is caught.', 'The test is repeated several times and the mean distance is calculated.', 'The test is repeated after a caffeinated drink and a 10-minute wait, and the means are compared.', 'Control variables are kept the same: the same person, the same hand and the same drop height.'], ['Saying a higher number means a faster reaction.', 'Using a different person after the drink.', 'Giving a warning before the ruler is dropped.']),
]

export const lesson32: ScienceLesson = {
  id: 'B-HOM-032-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Reaction time practical', prerequisites: ['B-NERVOUS-SYSTEM'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
