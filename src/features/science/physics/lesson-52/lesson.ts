import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { reactionTimeFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.5.4.3.2 Reaction time (typical values and the ruler drop test), as on the supplied revision page' }
const skill = 'P-REACTION'
const meaning = author(skill, ['6.5.4.3.2'], ['aqa-physics'])
const method = author(skill, ['6.5.4.3.2'], ['aqa-physics'])
const improve = author(skill, ['6.5.4.3.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const reactionTimeSections = [
  { id: 'P52-01', label: 'Start here', detail: 'How quick is a reaction?' },
  { id: 'P52-02', label: 'What is reaction time?', detail: 'A short time, hard to measure' },
  { id: 'P52-05', label: 'How does the ruler drop test work?', detail: 'Drop, catch, read the distance' },
  { id: 'P52-08', label: 'How can you improve the test?', detail: 'Repeats, a mean and a fair test' },
  { id: 'P52-11', label: 'On your own', detail: 'Calculate, read and describe' },
]

const states: ScienceState[] = [
  { ...meaning.choice('P52-01', 'A ball is thrown at you without warning and you react. About how long does a typical reaction take?', ['About 0.02 seconds', 'About 5 seconds', 'About 0.2 to 0.9 seconds', 'About 1 minute'], 2, 'It is quick, but not instant.', ['A typical reaction time is between 0.2 and 0.9 seconds.', 'It is different for everyone.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(meaning, 'P52-02', 'What is reaction time?'),
  meaning.choice('P52-03', 'What is a person\'s reaction time?', ['How fast a person can run', 'How long a person takes to react to an event', 'How far a person can throw a ball', 'How long a person can hold their breath'], 1, 'It is a time between an event and a reaction.', ['Reaction time is how long a person takes to react to an event.', 'It is measured in seconds.']),
  meaning.choice('P52-04', 'Why is a stopwatch not a good way to measure a reaction time?', ['Stopwatches only work indoors', 'Stopwatches measure distance, not time', 'Stopwatches cannot show seconds', 'Reaction times are so short that your own delay in pressing the button would spoil the result'], 3, 'Think about how long it takes you to press the button.', ['Reaction times are very short.', 'Your own delay in starting and stopping the watch would be about as long as the time you want to measure.']),
  t(method, 'P52-05', 'How does the ruler drop test work?'),
  method.choice('P52-06', 'In the ruler drop test, what should the person holding the ruler do?', ['Count down from three', 'Say "catch" as they let go', 'Let go of the ruler with no warning', 'Move the ruler up and down'], 2, 'The catcher must not know when it is coming.', ['The ruler is dropped without any warning.', 'Then the catcher is really reacting to the event.']),
  method.choice('P52-07', 'Two people take the ruler drop test, shown in the diagram. Which has the longer reaction time?', ['Person B, who caught the ruler after it fell further', 'Person A, who caught the ruler after it fell less far', 'They have the same reaction time', 'You cannot tell'], 0, 'The further the ruler falls, the longer the reaction time.', ['Person B caught the ruler at a bigger distance.', 'A longer distance means a longer reaction time.'], 'dataInterpretation', false, 'rtime-q-two'),
  t(improve, 'P52-08', 'How can you improve the test?'),
  improve.choice('P52-09', 'Three ruler drops fell 14 cm, 17 cm and 20 cm. What is the mean distance?', ['51 cm', '14 cm', '17 cm', '20 cm'], 2, 'Add the readings, then divide by how many there are.', ['14 + 17 + 20 = 51.', '51 ÷ 3 = 17, so the mean is 17 cm.'], 'calculation'),
  improve.choice('P52-10', 'Which change keeps the ruler drop test a fair test?', ['Using a different ruler each time', 'Using the same ruler and the same person dropping it each time', 'Letting the catcher see the ruler being dropped', 'Changing the person catching halfway through'], 1, 'Change only one thing at a time.', ['Keep the ruler the same and keep the person dropping it the same.', 'Then only the thing you are testing can change the result.']),
  { ...improve.choice('P52-11', 'Three ruler drops fell 18 cm, 21 cm and 24 cm. What is the mean distance?', ['63 cm', '24 cm', '18 cm', '21 cm'], 3, 'Add, then divide by three.', ['18 + 21 + 24 = 63.', '63 ÷ 3 = 21, so the mean is 21 cm.'], 'calculation', true) },
  { ...method.choice('P52-12', 'Jo caught the ruler after it fell 15 cm in the morning and 20 cm in the evening. What does this show?', ['Jo\'s reaction time was shorter in the morning', 'Jo\'s reaction time was shorter in the evening', 'Jo was more tired in the morning', 'Jo\'s reaction time did not change'], 0, 'A shorter distance means a shorter reaction time.', ['The ruler fell less far in the morning.', 'So Jo\'s reaction time was shorter in the morning.'], 'dataInterpretation', true) },
  { ...meaning.choice('P52-13', 'A driver is very tired. Why might their thinking distance be longer?', ['Their brakes are worn', 'Their reaction time is longer, so the car travels further before they react', 'Their tyres are bald', 'The road is icy'], 1, 'Thinking distance depends on reaction time.', ['A tired driver may take longer to react.', 'The car keeps moving during that time, so the thinking distance is longer.'], 'application', true) },
  { ...improve.choice('P52-14', 'Which improvement makes the results of the ruler drop test more reliable?', ['Doing one drop only', 'Giving the person a warning', 'Using a longer ruler each time', 'Repeating the drop several times and taking a mean'], 3, 'One reading can be a fluke.', ['Repeating the test and taking a mean gives a more reliable result.', 'One drop only or a warning would make it worse.'], 'understanding', true) },
  method.written('P52-15', 'Describe how to use the ruler drop test to measure reaction time. Then give one way to improve the accuracy.', 'Think about the set-up, the drop, the catch and what you read.', 'A helper holds a ruler between your thumb and finger, with zero level with your finger. The helper drops the ruler without warning. You catch it as quickly as you can. Read the distance the ruler fell. The longer the distance, the longer the reaction time. To improve accuracy, repeat the test and take a mean.', ['A helper holds the ruler between the thumb and finger with zero level with the finger.', 'The ruler is dropped without warning.', 'The person catches it as quickly as possible.', 'The distance fallen is read from the ruler; a longer distance means a longer reaction time.', 'An improvement such as repeats and a mean, clay on the ruler, or a fair test.'], ['Using a stopwatch to time the reaction.', 'Warning the catcher before letting go.', 'Saying a shorter distance means a longer reaction time.']),
]

export const lessonP52: ScienceLesson = {
  id: 'P-MOT-052-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Reaction times', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
