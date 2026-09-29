import type { TeachingFrame } from '../../teachingFrame'

// Reaction times: what they are, the ruler drop test, and how to improve it (mean, fair test, clay).
// The v² − u² = 2as reaction-time calculation is left out.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const reactionTimeFrames: Record<string, TeachingFrame[]> = {
  'P52-02': [
    f('What is reaction time?', 'Reaction time is how long a person takes to react to an event.', 'event, then reaction', 'Reaction time is how long a person takes to react to something happening. Everyone\'s reaction time is different. A typical reaction time is between 0.2 and 0.9 seconds.', 'rtime-idea'),
    f('Too quick for a stopwatch', 'Reaction times are so short that a stopwatch is no good for measuring them.', 'your own delay', 'Reaction times are so short that a stopwatch would give poor results. Your own delay in pressing the button would be as long as the time you want to measure. So we need better tests.', 'rtime-stopwatch'),
    f('Computer-based tests', 'One test uses a computer: click the mouse as soon as the screen changes colour.', 'screen changes, click', 'One way is a computer-based test. The screen changes colour and you click the mouse as fast as you can. The computer measures the time between the two. Another simple way is the ruler drop test.', 'rtime-computer'),
  ],
  'P52-05': [
    f('Get ready', 'Rest your arm on a table. A helper holds a ruler between your thumb and finger, with zero level with your finger.', 'ruler at zero', 'Sit with your arm resting on the edge of a table. A helper holds a ruler so it hangs between your thumb and finger. The zero mark on the ruler is lined up with your finger.', 'rtime-setup'),
    f('Drop it without warning', 'The helper lets go of the ruler without any warning.', 'no warning', 'Without giving any warning, the helper drops the ruler. You must not know when it is coming. This makes sure you are really reacting to the event.', 'rtime-drop'),
    f('Catch it and read the distance', 'Close your thumb and finger to catch the ruler as fast as you can. Read the distance it fell.', 'how far it fell', 'Close your thumb and finger to catch the ruler as quickly as possible. Read the mark on the ruler at the point where you caught it. This is how far the ruler fell before you reacted.', 'rtime-catch'),
    f('Longer distance, longer time', 'The further the ruler falls before you catch it, the longer your reaction time.', 'distance stands for time', 'A short distance means you caught the ruler quickly. A long distance means you were slower to react. So the longer the distance, the longer the reaction time.', 'rtime-compare'),
  ],
  'P52-08': [
    f('Repeat and take a mean', 'Do lots of repeats and calculate a mean: add the readings, then divide by how many there are.', 'add, then divide', 'It is hard to do this experiment accurately. Doing lots of repeats helps. Then calculate a mean. Suppose the ruler fell 12 cm, 15 cm and 18 cm. Add them to get 45 cm, then divide by 3. The mean is 15 cm.', 'rtime-mean'),
    f('Help the ruler fall straight', 'A blob of modelling clay on the bottom of the ruler helps it fall straight down.', 'straight fall', 'A ruler can twist as it falls, which makes the readings less reliable. Sticking a blob of modelling clay to the bottom helps the ruler fall straight down. This improves the results.', 'rtime-clay'),
    f('Keep it a fair test', 'Use the same ruler and the same person dropping it every time.', 'change one thing only', 'To make it a fair test, use the same ruler for every repeat. Have the same person drop it each time. Change only one thing at a time, such as who is catching the ruler.', 'rtime-fair'),
  ],
}
